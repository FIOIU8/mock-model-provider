# Mock Model Provider

一个独立的 OpenAI 兼容模型 API 模拟服务，供本机软件联调。服务端使用 Python + Flask，管理界面通过浏览器访问。

## 启动

Windows 上双击 `run.bat`，或在 PowerShell 中运行：

```powershell
cd mock-model-provider
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe app.py
```

浏览器打开 `http://127.0.0.1:8000`。默认只监听本机回环地址。

## 客户端配置

- Base URL：`http://127.0.0.1:8000/v1`
- API Key：`test-key`
- 模型：`mock-chat` 或 `mock-reasoner`
- 支持：`GET /v1/models`、`POST /v1/chat/completions`（非流式和 `stream: true` SSE）
- 支持标准 OpenAI `tool_calls`：自动工具调用、流式工具调用、工具结果回传后的最终回复

Android 模拟器访问宿主机服务时，通常使用 `http://10.0.2.2:8000/v1`。真机可让服务监听局域网地址：PowerShell 设置 `$env:MOCK_HOST = "0.0.0.0"` 后再启动，并使用电脑的局域网 IP。只在可信测试网络中开放。

## 控制台行为

- **自动回复**：等待配置的延迟后返回默认文本。
- **手动下发**：API 请求保持等待，控制台出现请求后可输入自定义回复或返回错误。等待上限为 180 秒。
- **固定错误**：每个新请求都返回设置的 HTTP 状态码和错误消息。
- **工具调用**：返回 `finish_reason: "tool_calls"` 和函数名/JSON 参数；客户端把工具执行结果作为 `role: "tool"` 消息再次提交后，服务返回最终文本。

工具调用模式下，如果请求带有 `tools`，服务优先使用请求声明的第一个函数名；控制台中设置的工具参数作为调用参数。请求没有声明工具时使用控制台配置的函数名。

请求队列中的每一项都可以点击打开完整对话详情。详情会显示模型返回的工具调用、参数和客户端声明的工具；可以复制 `role: tool` 结果消息，或用“模拟执行并继续”验证下一轮回复。快捷示例参考 DSH Pocket 的 `pocket_screen_control`（读屏、截图、申请无障碍权限、点击、输入）、工作区 `glob`/`read`/`write`、`fetch` 和待办工具。示例只构造并下发模拟的 API 工具调用，不会直接操作 Android 设备或修改其文件。

控制台右上角的月亮/太阳按钮切换浅色和深色模式，选择保存在当前浏览器。

请求队列最多保留最近 100 条；进程重启后记录与设置恢复默认值。

## 配置

默认地址 `127.0.0.1:8000`，默认 API Key `test-key`。可用环境变量 `MOCK_HOST`、`MOCK_PORT`、`MOCK_API_KEY` 覆盖。服务不实现真正的模型推理或持久化；流式模式会模拟标准 SSE 片段。

## 测试

```powershell
python -m unittest discover -s tests -v
```

## 许可证

本项目采用 MIT 许可证，详情请参阅 [LICENSE](LICENSE)。
