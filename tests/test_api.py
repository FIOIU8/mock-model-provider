import json
import threading
import time
import unittest

import app as service


class MockProviderTests(unittest.TestCase):
    def setUp(self):
        service.app.config.update(TESTING=True)
        with service.lock:
            service.state["mode"] = "auto"
            service.state["delay_ms"] = 0
            service.state["failure_status"] = 503
            service.state["failure_message"] = "Simulated provider error"
            service.state["tool_name"] = "get_weather"
            service.state["tool_arguments"] = {"city": "Shanghai", "unit": "celsius"}
            service.state["tool_final_text"] = "Mock final response after tool result: {tool_result}"
            service.state["requests"].clear()
            service.state["pending"].clear()
        self.client = service.app.test_client()
        self.headers = {"Authorization": "Bearer test-key"}

    def test_models_requires_api_key(self):
        self.assertEqual(self.client.get("/v1/models").status_code, 401)
        response = self.client.get("/v1/models", headers=self.headers)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json["object"], "list")
        self.assertIn("mock-chat", [model["id"] for model in response.json["data"]])

    def test_auto_completion_returns_openai_shape(self):
        response = self.client.post("/v1/chat/completions", headers=self.headers, json={"model": "mock-chat", "messages": [{"role": "user", "content": "hello"}]})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json["object"], "chat.completion")
        self.assertEqual(response.json["choices"][0]["message"]["role"], "assistant")
        self.assertEqual(len(service.state["requests"]), 1)
        self.assertEqual(service.state["requests"][0]["status"], "completed")

    def test_stream_completion_returns_sse_chunks(self):
        response = self.client.post("/v1/chat/completions", headers=self.headers, json={"model": "mock-chat", "stream": True, "messages": [{"role": "user", "content": "hello"}]})
        self.assertEqual(response.status_code, 200)
        self.assertIn("text/event-stream", response.content_type)
        body = response.get_data(as_text=True)
        self.assertIn('"object": "chat.completion.chunk"', body)
        self.assertIn("data: [DONE]", body)

    def test_tool_call_mode_returns_declared_function_and_arguments(self):
        with service.lock:
            service.state["mode"] = "tool_call"
        payload = {
            "model": "mock-chat",
            "tools": [{"type": "function", "function": {"name": "lookup_order", "parameters": {"type": "object"}}}],
            "messages": [{"role": "user", "content": "查询订单"}],
        }
        response = self.client.post("/v1/chat/completions", headers=self.headers, json=payload)
        self.assertEqual(response.status_code, 200)
        choice = response.json["choices"][0]
        self.assertEqual(choice["finish_reason"], "tool_calls")
        call = choice["message"]["tool_calls"][0]
        self.assertEqual(call["function"]["name"], "lookup_order")
        self.assertEqual(json.loads(call["function"]["arguments"])["city"], "Shanghai")

    def test_stream_tool_call_returns_function_chunks(self):
        with service.lock:
            service.state["mode"] = "tool_call"
        response = self.client.post("/v1/chat/completions", headers=self.headers, json={"model": "mock-chat", "stream": True, "messages": [{"role": "user", "content": "查询天气"}], "tools": [{"type": "function", "function": {"name": "get_weather"}}]})
        self.assertEqual(response.status_code, 200)
        body = response.get_data(as_text=True)
        self.assertIn('"name": "get_weather"', body)
        self.assertIn('"finish_reason": "tool_calls"', body)
        self.assertIn("data: [DONE]", body)

    def test_tool_result_gets_final_text_on_next_turn(self):
        with service.lock:
            service.state["mode"] = "tool_call"
        first = self.client.post("/v1/chat/completions", headers=self.headers, json={"model": "mock-chat", "messages": [{"role": "user", "content": "查询天气"}], "tools": [{"type": "function", "function": {"name": "get_weather"}}]})
        call = first.json["choices"][0]["message"]["tool_calls"][0]
        second = self.client.post("/v1/chat/completions", headers=self.headers, json={"model": "mock-chat", "messages": [{"role": "user", "content": "查询天气"}, {"role": "assistant", "content": None, "tool_calls": [call]}, {"role": "tool", "tool_call_id": call["id"], "content": "晴，25°C"}]})
        self.assertEqual(second.status_code, 200)
        self.assertIn("晴，25°C", second.json["choices"][0]["message"]["content"])

    def test_dashboard_can_inspect_messages_and_simulate_tool_result(self):
        with service.lock:
            service.state["mode"] = "tool_call"
        payload = {"model": "mock-chat", "messages": [{"role": "user", "content": "查天气"}], "tools": [{"type": "function", "function": {"name": "get_weather"}}]}
        first = self.client.post("/v1/chat/completions", headers=self.headers, json=payload)
        call = first.json["choices"][0]["message"]["tool_calls"][0]
        state = self.client.get("/api/state").json
        self.assertEqual(state["requests"][0]["payload"]["messages"][0]["content"], "查天气")
        simulated = self.client.post("/api/simulate-tool-result", json={"request": payload, "tool_call": call, "tool_result": "晴天"})
        self.assertEqual(simulated.status_code, 200)
        self.assertIn("晴天", simulated.json["choices"][0]["message"]["content"])

    def test_simulate_tool_result_validates_input(self):
        response = self.client.post("/api/simulate-tool-result", json={"request": {}, "tool_call": {}, "tool_result": "x"})
        self.assertEqual(response.status_code, 400)

    def test_manual_tool_call_can_be_dispatched(self):
        with service.lock:
            service.state["mode"] = "manual"
        result = {}

        def send_request():
            with service.app.test_client() as client:
                response = client.post("/v1/chat/completions", headers=self.headers, json={"model": "mock-chat", "messages": [{"role": "user", "content": "请调用工具"}]})
                result["response"] = response

        worker = threading.Thread(target=send_request)
        worker.start()
        request_id = None
        deadline = time.time() + 2
        while time.time() < deadline and request_id is None:
            with service.lock:
                if service.state["requests"]:
                    request_id = service.state["requests"][0]["id"]
            time.sleep(0.01)
        self.assertIsNotNone(request_id)
        dispatch = self.client.post(f"/api/requests/{request_id}/tool-call", json={"name": "lookup_order", "arguments": {"order_id": "A-1"}})
        self.assertEqual(dispatch.status_code, 200)
        worker.join(timeout=2)
        self.assertFalse(worker.is_alive())
        self.assertEqual(result["response"].json["choices"][0]["finish_reason"], "tool_calls")
        self.assertEqual(result["response"].json["choices"][0]["message"]["tool_calls"][0]["function"]["name"], "lookup_order")

    def test_manual_response_is_dispatched_from_control_api(self):
        with service.lock:
            service.state["mode"] = "manual"
        result = {}

        def send_request():
            with service.app.test_client() as client:
                response = client.post("/v1/chat/completions", headers=self.headers, json={"model": "mock-chat", "messages": [{"role": "user", "content": "question"}]})
                result["status"] = response.status_code
                result["body"] = response.get_json()

        worker = threading.Thread(target=send_request)
        worker.start()
        request_id = None
        deadline = time.time() + 2
        while time.time() < deadline and request_id is None:
            with service.lock:
                if service.state["requests"]:
                    request_id = service.state["requests"][0]["id"]
            time.sleep(0.01)
        self.assertIsNotNone(request_id)
        dispatch = self.client.post(f"/api/requests/{request_id}/respond", json={"text": "manual answer"})
        self.assertEqual(dispatch.status_code, 200)
        worker.join(timeout=2)
        self.assertFalse(worker.is_alive())
        self.assertEqual(result["status"], 200)
        self.assertEqual(result["body"]["choices"][0]["message"]["content"], "manual answer")

    def test_error_mode_returns_configured_status(self):
        with service.lock:
            service.state["mode"] = "error"
        response = self.client.post("/v1/chat/completions", headers=self.headers, json={"model": "mock-chat", "messages": [{"role": "user", "content": "hello"}]})
        self.assertEqual(response.status_code, 503)
        self.assertEqual(response.json["error"]["code"], "mock_failure")

    def test_invalid_messages_are_rejected(self):
        response = self.client.post("/v1/chat/completions", headers=self.headers, json={"model": "mock-chat", "messages": []})
        self.assertEqual(response.status_code, 400)


if __name__ == "__main__":
    unittest.main()
