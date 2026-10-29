from __future__ import annotations

import json
import os
import queue
import threading
import time
import uuid
from collections import deque
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from flask import Flask, Response, jsonify, render_template, request


BASE_DIR = Path(__file__).resolve().parent
API_KEY = os.environ.get("MOCK_API_KEY", "test-key")
app = Flask(__name__, template_folder=str(BASE_DIR / "templates"), static_folder=str(BASE_DIR / "static"))

lock = threading.RLock()
state: dict[str, Any] = {
    "mode": "auto",
    "delay_ms": 300,
    "failure_status": 503,
    "failure_message": "Simulated provider error",
    "tool_name": "get_weather",
    "tool_arguments": {"city": "Shanghai", "unit": "celsius"},
    "tool_final_text": "Mock final response after tool result: {tool_result}",
    "models": [
        {"id": "mock-chat", "object": "model", "created": int(time.time()), "owned_by": "mock-provider"},
        {"id": "mock-reasoner", "object": "model", "created": int(time.time()), "owned_by": "mock-provider"},
    ],
    "requests": deque(maxlen=100),
    "pending": {},
}


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def auth_ok() -> bool:
    header = request.headers.get("Authorization", "")
    return header == f"Bearer {API_KEY}"


def openai_error(message: str, error_type: str = "invalid_request_error", code: str | None = None, status: int = 400):
    return jsonify({"error": {"message": message, "type": error_type, "param": None, "code": code}}), status


def record_request(payload: dict[str, Any]) -> dict[str, Any]:
    entry = {
        "id": f"req_{uuid.uuid4().hex[:12]}",
        "created_at": now_iso(),
        "status": "pending",
        "model": payload.get("model", ""),
        "stream": bool(payload.get("stream", False)),
        "messages": payload.get("messages", []),
        "payload": payload,
        "response": None,
        "error": None,
    }
    with lock:
        state["requests"].appendleft(entry)
    return entry


def choices_for(text: str, model: str, prompt_tokens: int = 0) -> dict[str, Any]:
    completion_tokens = max(1, len(text.split()))
    return {
        "id": f"chatcmpl-{uuid.uuid4().hex[:16]}",
        "object": "chat.completion",
        "created": int(time.time()),
        "model": model,
        "choices": [{"index": 0, "message": {"role": "assistant", "content": text}, "finish_reason": "stop"}],
        "usage": {"prompt_tokens": prompt_tokens, "completion_tokens": completion_tokens, "total_tokens": prompt_tokens + completion_tokens},
    }


def complete_request(entry: dict[str, Any], text: str) -> dict[str, Any]:
    result = choices_for(text, entry["model"], len(json.dumps(entry["messages"], ensure_ascii=False)) // 4)
    with lock:
        entry["status"] = "completed"
        entry["response"] = text
        entry["finished_at"] = now_iso()
    return result


def requested_tool(payload: dict[str, Any]) -> tuple[str, dict[str, Any]]:
    """Choose a declared client function when available, then use configured arguments."""
    with lock:
        configured_name = state["tool_name"]
        configured_arguments = dict(state["tool_arguments"])
    for tool in payload.get("tools") or []:
        function = tool.get("function") if isinstance(tool, dict) else None
        name = function.get("name") if isinstance(function, dict) else None
        if isinstance(name, str) and name.strip():
            return name.strip(), configured_arguments
    return configured_name, configured_arguments


def tool_call_for(entry: dict[str, Any], name: str, arguments: dict[str, Any]) -> dict[str, Any]:
    call = {
        "id": f"call_{uuid.uuid4().hex[:16]}",
        "type": "function",
        "function": {"name": name, "arguments": json.dumps(arguments, ensure_ascii=False, separators=(",", ":"))},
    }
    result = {
        "id": f"chatcmpl-{uuid.uuid4().hex[:16]}",
        "object": "chat.completion",
        "created": int(time.time()),
        "model": entry["model"],
        "choices": [{"index": 0, "message": {"role": "assistant", "content": None, "tool_calls": [call]}, "finish_reason": "tool_calls"}],
        "usage": {"prompt_tokens": len(json.dumps(entry["messages"], ensure_ascii=False)) // 4, "completion_tokens": 1, "total_tokens": len(json.dumps(entry["messages"], ensure_ascii=False)) // 4 + 1},
    }
    with lock:
        entry["status"] = "tool_call"
        entry["response_kind"] = "tool_call"
        entry["response"] = json.dumps(call, ensure_ascii=False)
        entry["tool_call"] = call
        entry["finished_at"] = now_iso()
    return result


def final_tool_text(messages: list[dict[str, Any]]) -> str:
    tool_message = messages[-1] if messages and isinstance(messages[-1], dict) else {}
    tool_result = str(tool_message.get("content", ""))
    with lock:
        template = state["tool_final_text"]
    return template.replace("{tool_result}", tool_result)


def stream_response(entry: dict[str, Any], text: str):
    completion_id = f"chatcmpl-{uuid.uuid4().hex[:16]}"
    created = int(time.time())
    model = entry["model"]
    first = {"id": completion_id, "object": "chat.completion.chunk", "created": created, "model": model, "choices": [{"index": 0, "delta": {"role": "assistant"}, "finish_reason": None}]}
    yield f"data: {json.dumps(first, ensure_ascii=False)}\n\n"
    pieces = [text[i:i + 24] for i in range(0, len(text), 24)] or [""]
    for piece in pieces:
        chunk = {"id": completion_id, "object": "chat.completion.chunk", "created": created, "model": model, "choices": [{"index": 0, "delta": {"content": piece}, "finish_reason": None}]}
        yield f"data: {json.dumps(chunk, ensure_ascii=False)}\n\n"
    final = {"id": completion_id, "object": "chat.completion.chunk", "created": created, "model": model, "choices": [{"index": 0, "delta": {}, "finish_reason": "stop"}]}
    yield f"data: {json.dumps(final, ensure_ascii=False)}\n\n"
    yield "data: [DONE]\n\n"


def tool_stream_response(entry: dict[str, Any], name: str, arguments: dict[str, Any]):
    completion_id = f"chatcmpl-{uuid.uuid4().hex[:16]}"
    created = int(time.time())
    model = entry["model"]
    call_id = f"call_{uuid.uuid4().hex[:16]}"
    first = {"id": completion_id, "object": "chat.completion.chunk", "created": created, "model": model, "choices": [{"index": 0, "delta": {"role": "assistant", "tool_calls": [{"index": 0, "id": call_id, "type": "function", "function": {"name": name, "arguments": ""}}]}, "finish_reason": None}]}
    yield f"data: {json.dumps(first, ensure_ascii=False)}\n\n"
    argument_text = json.dumps(arguments, ensure_ascii=False, separators=(",", ":"))
    for piece in [argument_text[i:i + 24] for i in range(0, len(argument_text), 24)] or [""]:
        chunk = {"id": completion_id, "object": "chat.completion.chunk", "created": created, "model": model, "choices": [{"index": 0, "delta": {"tool_calls": [{"index": 0, "function": {"arguments": piece}}]}, "finish_reason": None}]}
        yield f"data: {json.dumps(chunk, ensure_ascii=False)}\n\n"
    final = {"id": completion_id, "object": "chat.completion.chunk", "created": created, "model": model, "choices": [{"index": 0, "delta": {}, "finish_reason": "tool_calls"}]}
    yield f"data: {json.dumps(final, ensure_ascii=False)}\n\n"
    yield "data: [DONE]\n\n"


def as_stream(entry: dict[str, Any], text: str):
    with lock:
        entry["status"] = "completed"
        entry["response"] = text
        entry["finished_at"] = now_iso()
    return Response(stream_response(entry, text), mimetype="text/event-stream", headers={"Cache-Control": "no-cache"})


def as_tool_stream(entry: dict[str, Any], name: str, arguments: dict[str, Any]):
    with lock:
        entry["status"] = "tool_call"
        entry["response_kind"] = "tool_call"
        entry["tool_call"] = {"type": "function", "function": {"name": name, "arguments": json.dumps(arguments, ensure_ascii=False)}}
        entry["finished_at"] = now_iso()
    return Response(tool_stream_response(entry, name, arguments), mimetype="text/event-stream", headers={"Cache-Control": "no-cache"})


@app.get("/")
def dashboard():
    return render_template("index.html")


@app.get("/health")
def health():
    return jsonify({"ok": True, "service": "mock-model-provider", "time": now_iso()})


@app.get("/v1/models")
def models():
    if not auth_ok():
        return openai_error("Missing or invalid API key", "authentication_error", "invalid_api_key", 401)
    with lock:
        return jsonify({"object": "list", "data": list(state["models"])})


@app.post("/v1/chat/completions")
def chat_completions():
    if not auth_ok():
        return openai_error("Missing or invalid API key", "authentication_error", "invalid_api_key", 401)
    payload = request.get_json(silent=True)
    if not isinstance(payload, dict):
        return openai_error("Request body must be a JSON object")
    messages = payload.get("messages")
    if not isinstance(messages, list) or not messages:
        return openai_error("messages must be a non-empty array")
    entry = record_request(payload)

    with lock:
        mode = state["mode"]
        delay_ms = state["delay_ms"]
        failure_status = state["failure_status"]
        failure_message = state["failure_message"]

    if mode == "tool_call" and messages[-1].get("role") == "tool":
        time.sleep(delay_ms / 1000)
        final_text = final_tool_text(messages)
        if payload.get("stream") is True:
            return as_stream(entry, final_text)
        return jsonify(complete_request(entry, final_text))

    if mode == "error":
        with lock:
            entry["status"] = "failed"
            entry["error"] = failure_message
            entry["finished_at"] = now_iso()
        return openai_error(failure_message, "server_error", "mock_failure", failure_status)

    if mode == "auto":
        time.sleep(delay_ms / 1000)
        default_text = "Mock response: request received. Change the response in the dashboard by switching to manual mode."
        if payload.get("stream") is True:
            return as_stream(entry, default_text)
        result = complete_request(entry, default_text)
        return jsonify(result)

    if mode == "tool_call":
        time.sleep(delay_ms / 1000)
        name, arguments = requested_tool(payload)
        if payload.get("stream") is True:
            return as_tool_stream(entry, name, arguments)
        return jsonify(tool_call_for(entry, name, arguments))

    waiter: queue.Queue[dict[str, Any]] = queue.Queue(maxsize=1)
    with lock:
        state["pending"][entry["id"]] = waiter
    try:
        outcome = waiter.get(timeout=180)
    except queue.Empty:
        with lock:
            state["pending"].pop(entry["id"], None)
            entry["status"] = "timed_out"
            entry["error"] = "No response was dispatched within 180 seconds"
            entry["finished_at"] = now_iso()
        return openai_error("Timed out waiting for a manual response", "server_error", "manual_timeout", 504)

    if outcome["kind"] == "error":
        with lock:
            entry["status"] = "failed"
            entry["error"] = outcome["message"]
            entry["finished_at"] = now_iso()
        return openai_error(outcome["message"], "server_error", "manual_failure", outcome["status"])
    if outcome["kind"] == "tool_call":
        if payload.get("stream") is True:
            return as_tool_stream(entry, outcome["name"], outcome["arguments"])
        return jsonify(tool_call_for(entry, outcome["name"], outcome["arguments"]))
    if payload.get("stream") is True:
        return as_stream(entry, outcome["text"])
    return jsonify(complete_request(entry, outcome["text"]))


@app.get("/api/state")
def api_state():
    with lock:
        requests = list(state["requests"])
        public_requests = []
        for row in requests:
            public = {k: v for k, v in row.items() if k != "payload"}
            public["payload"] = row["payload"]
            public_requests.append(public)
        return jsonify({
            "mode": state["mode"],
            "delay_ms": state["delay_ms"],
            "failure_status": state["failure_status"],
            "failure_message": state["failure_message"],
            "tool_name": state["tool_name"],
            "tool_arguments": state["tool_arguments"],
            "tool_final_text": state["tool_final_text"],
            "models": list(state["models"]),
            "requests": public_requests,
            "pending_count": len(state["pending"]),
        })


@app.post("/api/settings")
def api_settings():
    payload = request.get_json(silent=True) or {}
    mode = payload.get("mode")
    if mode is not None and mode not in {"auto", "manual", "error", "tool_call"}:
        return jsonify({"error": "mode must be auto, manual, error, or tool_call"}), 400
    try:
        delay_ms = int(payload.get("delay_ms", state["delay_ms"]))
        failure_status = int(payload.get("failure_status", state["failure_status"]))
    except (ValueError, TypeError):
        return jsonify({"error": "delay_ms and failure_status must be integers"}), 400
    if not 0 <= delay_ms <= 30000:
        return jsonify({"error": "delay_ms must be between 0 and 30000"}), 400
    if not 400 <= failure_status <= 599:
        return jsonify({"error": "failure_status must be between 400 and 599"}), 400
    tool_name = str(payload.get("tool_name", state["tool_name"])).strip()
    if not tool_name or not tool_name.replace("_", "").replace("-", "").isalnum():
        return jsonify({"error": "tool_name must contain only letters, numbers, _ or -"}), 400
    raw_arguments = payload.get("tool_arguments", state["tool_arguments"])
    if isinstance(raw_arguments, str):
        try:
            raw_arguments = json.loads(raw_arguments)
        except json.JSONDecodeError:
            return jsonify({"error": "tool_arguments must be valid JSON"}), 400
    if not isinstance(raw_arguments, dict):
        return jsonify({"error": "tool_arguments must be a JSON object"}), 400
    with lock:
        if mode is not None:
            state["mode"] = mode
        state["delay_ms"] = delay_ms
        state["failure_status"] = failure_status
        if "failure_message" in payload:
            state["failure_message"] = str(payload["failure_message"])[:500]
        state["tool_name"] = tool_name
        state["tool_arguments"] = raw_arguments
        if "tool_final_text" in payload:
            state["tool_final_text"] = str(payload["tool_final_text"])[:1000]
        return jsonify({"ok": True, "mode": state["mode"], "delay_ms": state["delay_ms"], "tool_name": state["tool_name"]})


@app.post("/api/requests/<request_id>/respond")
def api_respond(request_id: str):
    payload = request.get_json(silent=True) or {}
    text = payload.get("text")
    if not isinstance(text, str) or not text.strip():
        return jsonify({"error": "text must be a non-empty string"}), 400
    with lock:
        waiter = state["pending"].get(request_id)
        if waiter is None:
            return jsonify({"error": "request is no longer pending"}), 404
        waiter.put({"kind": "response", "text": text})
        state["pending"].pop(request_id, None)
    return jsonify({"ok": True})


@app.post("/api/requests/<request_id>/tool-call")
def api_tool_call(request_id: str):
    payload = request.get_json(silent=True) or {}
    with lock:
        default_name = state["tool_name"]
        default_arguments = dict(state["tool_arguments"])
        waiter = state["pending"].get(request_id)
    name = str(payload.get("name", default_name)).strip()
    arguments = payload.get("arguments", default_arguments)
    if isinstance(arguments, str):
        try:
            arguments = json.loads(arguments)
        except json.JSONDecodeError:
            return jsonify({"error": "arguments must be valid JSON"}), 400
    if not name or not isinstance(arguments, dict):
        return jsonify({"error": "name and arguments object are required"}), 400
    if waiter is None:
        return jsonify({"error": "request is no longer pending"}), 404
    with lock:
        waiter.put({"kind": "tool_call", "name": name, "arguments": arguments})
        state["pending"].pop(request_id, None)
    return jsonify({"ok": True})


@app.post("/api/simulate-tool-result")
def api_simulate_tool_result():
    payload = request.get_json(silent=True) or {}
    original = payload.get("request")
    call = payload.get("tool_call")
    result_text = payload.get("tool_result")
    if not isinstance(original, dict) or not isinstance(original.get("messages"), list):
        return jsonify({"error": "request must contain a messages array"}), 400
    if not isinstance(call, dict) or not isinstance(call.get("function"), dict):
        return jsonify({"error": "tool_call must contain a function object"}), 400
    if not isinstance(result_text, str):
        return jsonify({"error": "tool_result must be a string"}), 400
    continuation = dict(original)
    continuation["stream"] = False
    continuation["messages"] = [
        *original["messages"],
        {"role": "assistant", "content": None, "tool_calls": [call]},
        {"role": "tool", "tool_call_id": call.get("id", "call_mock"), "content": result_text},
    ]
    entry = record_request(continuation)
    text = final_tool_text(continuation["messages"])
    return jsonify(complete_request(entry, text))


@app.post("/api/requests/<request_id>/fail")
def api_fail(request_id: str):
    payload = request.get_json(silent=True) or {}
    message = str(payload.get("message", "Manually dispatched error"))[:500]
    try:
        status = int(payload.get("status", 500))
    except (TypeError, ValueError):
        return jsonify({"error": "status must be an integer"}), 400
    if not 400 <= status <= 599:
        return jsonify({"error": "status must be between 400 and 599"}), 400
    with lock:
        waiter = state["pending"].get(request_id)
        if waiter is None:
            return jsonify({"error": "request is no longer pending"}), 404
        waiter.put({"kind": "error", "message": message, "status": status})
        state["pending"].pop(request_id, None)
    return jsonify({"ok": True})


@app.post("/api/requests/clear")
def api_clear_requests():
    with lock:
        state["requests"].clear()
    return jsonify({"ok": True})


if __name__ == "__main__":
    host = os.environ.get("MOCK_HOST", "127.0.0.1")
    port = int(os.environ.get("MOCK_PORT", "8000"))
    app.run(host=host, port=port, threaded=True, debug=False)
