# Mock Model Provider

An independent OpenAI-compatible mock model API for local application integration testing. The service is built with Python and Flask and includes a browser-based dashboard for inspecting requests and controlling responses.

中文说明：[README.zh-CN.md](README.zh-CN.md)

## Features

- OpenAI-compatible `GET /v1/models` and `POST /v1/chat/completions` endpoints.
- Non-streaming responses and simulated Server-Sent Events (`stream: true`).
- Automatic, manual, fixed-error, and tool-call response modes.
- Standard OpenAI `tool_calls`, including streaming tool calls and follow-up responses after a tool result.
- Request queue with full message inspection and response controls.
- Light and dark dashboard themes.
- Configurable response delay, API key, failure status, tool name, and tool arguments.

## Quick Start

On Windows, double-click `run.bat`, or run the following commands in PowerShell:

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe app.py
```

Open the dashboard at `http://127.0.0.1:8000`.

The default server binding is the local loopback address, so the service is only reachable from the same computer.

## Client Configuration

| Setting | Default |
| --- | --- |
| Base URL | `http://127.0.0.1:8000/v1` |
| API key | `test-key` |
| Models | `mock-chat`, `mock-reasoner` |

The API supports:

- `GET /v1/models`
- `POST /v1/chat/completions`
- Non-streaming chat completions
- Streaming chat completions using SSE
- Function tool calls through the standard OpenAI `tools` request field

For an Android emulator, use `http://10.0.2.2:8000/v1` to reach the host machine. To test from a physical device, bind the service to a trusted local network interface:

```powershell
$env:MOCK_HOST = "0.0.0.0"
.\.venv\Scripts\python.exe app.py
```

Then use the computer's LAN IP address. Only expose the service on a network you trust.

## Dashboard Modes

- **Automatic response**: waits for the configured delay and returns a default response.
- **Manual response**: keeps the API request open until a response, tool call, or error is dispatched from the dashboard. Requests time out after 180 seconds.
- **Fixed error**: returns the configured HTTP status code and error message for every new request.
- **Tool call**: returns a function call with the configured function name and JSON arguments. If the client sends a follow-up message with `role: "tool"`, the service returns the configured final text with the tool result inserted.

When a request declares `tools`, tool-call mode uses the first function name declared by the client and the arguments configured in the dashboard. If no tools are declared, it uses the configured function name.

Each request in the queue can be opened to inspect the full conversation, model tool calls, arguments, and client-declared tools. The dashboard can also copy a `role: "tool"` message or simulate a tool result for the next turn. These actions only construct and send mock API messages; they do not operate Android devices or modify workspace files.

The theme button in the top-right corner switches between light and dark mode. The selection is stored in the current browser.

## Configuration

The following environment variables override the defaults:

| Variable | Default | Description |
| --- | --- | --- |
| `MOCK_HOST` | `127.0.0.1` | Server bind address |
| `MOCK_PORT` | `8000` | Server port |
| `MOCK_API_KEY` | `test-key` | API key expected in the `Authorization: Bearer ...` header |

The service does not perform real model inference or persist data. Streaming responses are simulated SSE chunks. The request queue keeps the most recent 100 requests, and settings and request history reset when the process restarts.

## Tests

Run the test suite with:

```powershell
python -m unittest discover -s tests -v
```

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
