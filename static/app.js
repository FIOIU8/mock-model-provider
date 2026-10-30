const translations = {
  zh: {
    "brand.subtitle":"模型服务测试台", "service.online":"服务运行中", "console.title":"测试服务控制台", "console.description":"把客户端 Base URL 指向本服务，然后在这里观察请求并控制模型回复。", "common.copy":"复制",
    "summary.service":"服务状态", "service.available":"在线", "model.available":"可用", "summary.waiting":"等待客户端请求", "summary.pending":"待处理请求", "summary.pending-help":"手动模式下等待你下发", "summary.requests":"请求记录", "summary.requests-help":"最多保留最近 100 条", "summary.key-help":"客户端填写任意兼容 Bearer Key",
    "settings.title":"服务行为", "settings.synced":"已同步", "settings.unsaved":"未保存", "settings.mode":"响应模式", "mode.auto":"自动回复", "mode.manual":"手动下发", "mode.tool":"工具调用", "mode.error":"固定错误", "settings.delay":"自动回复延迟", "settings.instant":"即时", "settings.ten-seconds":"10 秒", "settings.mock-error":"模拟错误", "settings.error-message":"错误消息", "settings.tool-params":"工具调用参数", "settings.tool-name":"工具名称", "settings.final-template":"工具结果后的回复模板", "settings.tool-help-before":"工具调用模式会返回", "settings.tool-help-after":"；{tool_result} 会替换为客户端回传的工具结果。", "settings.models":"可用模型", "model.chat":"通用对话模型", "model.reasoner":"推理模型", "settings.save":"保存设置", "requests.clear":"清空记录",
    "requests.title":"请求队列", "requests.all":"全部", "requests.pending":"待处理", "requests.empty-title":"还没有收到请求", "requests.empty-description":"从你的客户端发送一次模型请求后，它会出现在这里。", "requests.pending-empty-title":"当前没有待处理请求", "requests.pending-empty-description":"新的手动模式请求会显示在这里。", "connection.title":"客户端连接参数", "connection.description":"模型名称可使用", "connection.or":"或", "connection.key":"，API Key 使用", "connection.copy-command":"复制测试命令", "detail.title":"请求详情", "detail.close":"关闭详情",
    "modeHelp.auto":"收到请求后返回默认模拟回复。", "modeHelp.manual":"请求会保持等待，直到你在队列中编辑并下发回复。", "modeHelp.tool_call":"返回标准 tool_calls；客户端回传 role=tool 后，服务会生成最终文本。", "modeHelp.error":"所有新请求都会返回设定的 HTTP 错误。",
    "status.pending":"等待下发", "status.completed":"已完成", "status.tool_call":"等待客户端执行工具", "status.failed":"失败", "status.timed_out":"已超时", "role.system":"系统", "role.developer":"开发者", "role.user":"用户", "role.assistant":"助手", "role.tool":"工具结果", "role.unknown":"消息", "request.no-user":"无用户消息", "request.unspecified-model":"未指定模型", "request.stream":"流式", "request.non-stream":"非流式", "request.open":"查看详情 ›", "request.reply":"回复：", "request.error":"错误：", "request.reply-placeholder":"输入要下发给客户端的模型回复…", "request.dispatch-reply":"下发回复", "request.dispatch-tool":"下发工具调用", "request.dispatch-error":"返回错误", "request.tools-label":"快捷工具", "request.tools-placeholder":"选择工具示例并立即下发…",
    "detail.response":"模型响应", "detail.dispatch":"下发操作", "detail.reply-placeholder":"输入普通文本回复…", "detail.dispatch-text":"下发文本", "detail.call":"工具调用", "detail.unnamed-tool":"未命名工具", "detail.mock-call":"模拟调用", "detail.tool-explanation":"这是模型返回给客户端的工具调用。这里不会操作真实设备；可以模拟工具执行结果，验证下一轮回复。", "detail.result-placeholder":"模拟工具执行成功：操作已完成", "detail.copy-tool-result":"复制 role=tool", "detail.simulate-continue":"模拟执行并继续", "detail.quick-examples":"快捷工具示例", "detail.quick-explanation":"按 DSH Pocket 工具定义准备的模拟示例。选择后会填入工具调用；若这是待处理请求，将直接下发给客户端。", "detail.no-messages":"没有可展示的消息。", "detail.copy-request":"复制请求 JSON", "detail.client-tools":"客户端声明的工具", "detail.category-screen":"屏幕控制", "detail.category-workspace":"工作区", "detail.category-tasks":"任务",
    "tool.screen-read":"读取当前屏幕", "tool.screen-shot":"截取当前屏幕", "tool.permission":"请求无障碍权限", "tool.tap":"点击坐标", "tool.text":"输入测试文本", "tool.search":"搜索文件", "tool.read":"读取 README", "tool.write":"写入测试文件", "tool.fetch":"获取网页", "tool.todo":"更新待办", "tool.simulated":"模拟工具执行成功", "tool.continuation":"模拟工具结果已回传，已收到下一轮回复", "tool.missing":"当前请求没有工具调用可继续", "tool.result-copied":"role=tool 消息已复制", "tool.copy-request":"请求 JSON 已复制", "tool.dispatch-success":"工具调用已下发", "tool.dispatch-failed":"下发失败：{message}", "tool.dispatch-named":"已下发工具调用：{name}", "tool.example-filled":"已填入示例：{name}",
    "toast.reply-required":"请输入回复内容", "toast.reply-sent":"回复已下发", "toast.error-sent":"错误已下发", "toast.settings-saved":"设置已保存", "toast.state-failed":"读取服务状态失败：{message}", "toast.tool-json":"工具参数必须是有效 JSON", "toast.clear-confirm":"清空所有请求记录？", "toast.records-cleared":"请求记录已清空", "toast.continue-failed":"模拟续答失败：{message}", "toast.settings-failed":"保存失败：{message}", "toast.base-copied":"Base URL 已复制", "toast.curl-copied":"curl 命令已复制", "toast.error-title":"错误消息", "toast.error-default":"Manually dispatched error", "toast.error-status":"HTTP 状态码（400-599）", "toast.error-status-default":"500", "toast.theme-dark":"切换深色模式", "toast.theme-light":"切换浅色模式", "toast.refresh":"刷新数据", "toast.settings-synced":"已同步", "toast.simulated-default":"模拟工具执行成功", "toast.generic-error":"操作失败：{message}"
  },
  en: {
    "brand.subtitle":"Model service workbench", "service.online":"Service running", "console.title":"Provider dashboard", "console.description":"Point your client Base URL to this service, then inspect requests and control model responses here.", "common.copy":"Copy",
    "summary.service":"Service status", "service.available":"Online", "model.available":"Available", "summary.waiting":"Waiting for client requests", "summary.pending":"Pending requests", "summary.pending-help":"Waiting for dispatch in manual mode", "summary.requests":"Request history", "summary.requests-help":"Keeps the latest 100 requests", "summary.key-help":"Use any compatible Bearer key in your client",
    "settings.title":"Service behavior", "settings.synced":"Synced", "settings.unsaved":"Unsaved", "settings.mode":"Response mode", "mode.auto":"Automatic", "mode.manual":"Manual", "mode.tool":"Tool call", "mode.error":"Fixed error", "settings.delay":"Automatic response delay", "settings.instant":"Instant", "settings.ten-seconds":"10 sec", "settings.mock-error":"Simulated error", "settings.error-message":"Error message", "settings.tool-params":"Tool call parameters", "settings.tool-name":"Tool name", "settings.final-template":"Reply after tool result", "settings.tool-help-before":"Tool-call mode returns", "settings.tool-help-after":"; {tool_result} is replaced with the result sent by the client.", "settings.models":"Available models", "model.chat":"General chat model", "model.reasoner":"Reasoning model", "settings.save":"Save settings", "requests.clear":"Clear history",
    "requests.title":"Request queue", "requests.all":"All", "requests.pending":"Pending", "requests.empty-title":"No requests yet", "requests.empty-description":"Send a model request from your client and it will appear here.", "requests.pending-empty-title":"No pending requests", "requests.pending-empty-description":"New requests in manual mode will appear here.", "connection.title":"Client connection", "connection.description":"Use", "connection.or":"or", "connection.key":"as the model, and", "connection.copy-command":"Copy test command", "detail.title":"Request details", "detail.close":"Close details",
    "modeHelp.auto":"Returns a default mock response after each request.", "modeHelp.manual":"Requests wait until you edit and dispatch a response from the queue.", "modeHelp.tool_call":"Returns standard tool_calls; after the client sends role=tool, the service creates a final response.", "modeHelp.error":"Returns the configured HTTP error for every new request.",
    "status.pending":"Waiting for dispatch", "status.completed":"Completed", "status.tool_call":"Waiting for client tool execution", "status.failed":"Failed", "status.timed_out":"Timed out", "role.system":"System", "role.developer":"Developer", "role.user":"User", "role.assistant":"Assistant", "role.tool":"Tool result", "role.unknown":"Message", "request.no-user":"No user message", "request.unspecified-model":"Unspecified model", "request.stream":"Stream", "request.non-stream":"Non-stream", "request.open":"View details ›", "request.reply":"Reply:", "request.error":"Error:", "request.reply-placeholder":"Enter a model response to send to the client…", "request.dispatch-reply":"Send reply", "request.dispatch-tool":"Send tool call", "request.dispatch-error":"Return error", "request.tools-label":"Quick tool", "request.tools-placeholder":"Choose a tool example to dispatch…",
    "detail.response":"Model response", "detail.dispatch":"Dispatch action", "detail.reply-placeholder":"Enter a plain-text response…", "detail.dispatch-text":"Send text", "detail.call":"Tool call", "detail.unnamed-tool":"Unnamed tool", "detail.mock-call":"Mock call", "detail.tool-explanation":"This is a tool call returned to the client. No real device is controlled here; simulate a result to verify the next response.", "detail.result-placeholder":"Mock tool execution succeeded: operation completed", "detail.copy-tool-result":"Copy role=tool", "detail.simulate-continue":"Simulate and continue", "detail.quick-examples":"Quick tool examples", "detail.quick-explanation":"Mock examples based on DSH Pocket tool definitions. Selecting one fills the tool call; for a pending request it is sent to the client immediately.", "detail.no-messages":"No messages to display.", "detail.copy-request":"Copy request JSON", "detail.client-tools":"Tools declared by client", "detail.category-screen":"Screen control", "detail.category-workspace":"Workspace", "detail.category-tasks":"Tasks",
    "tool.screen-read":"Read current screen", "tool.screen-shot":"Capture current screen", "tool.permission":"Request accessibility permission", "tool.tap":"Tap coordinates", "tool.text":"Enter test text", "tool.search":"Search files", "tool.read":"Read README", "tool.write":"Write test file", "tool.fetch":"Fetch webpage", "tool.todo":"Update todos", "tool.simulated":"Mock tool execution succeeded", "tool.continuation":"Mock tool result sent; next response received", "tool.missing":"This request has no tool call to continue", "tool.result-copied":"role=tool message copied", "tool.copy-request":"Request JSON copied", "tool.dispatch-success":"Tool call dispatched", "tool.dispatch-failed":"Dispatch failed: {message}", "tool.dispatch-named":"Dispatched tool call: {name}", "tool.example-filled":"Example filled in: {name}",
    "toast.reply-required":"Enter a response first", "toast.reply-sent":"Response dispatched", "toast.error-sent":"Error dispatched", "toast.settings-saved":"Settings saved", "toast.state-failed":"Could not read service state: {message}", "toast.tool-json":"Tool arguments must be valid JSON", "toast.clear-confirm":"Clear all request history?", "toast.records-cleared":"Request history cleared", "toast.continue-failed":"Could not simulate continuation: {message}", "toast.settings-failed":"Could not save settings: {message}", "toast.base-copied":"Base URL copied", "toast.curl-copied":"curl command copied", "toast.error-title":"Error message", "toast.error-default":"Manually dispatched error", "toast.error-status":"HTTP status code (400-599)", "toast.error-status-default":"500", "toast.theme-dark":"Switch to dark mode", "toast.theme-light":"Switch to light mode", "toast.refresh":"Refresh data", "toast.settings-synced":"Synced", "toast.simulated-default":"Mock tool execution succeeded", "toast.generic-error":"Action failed: {message}"
  }
};

const modeHelpKeys = {auto:"modeHelp.auto", manual:"modeHelp.manual", tool_call:"modeHelp.tool_call", error:"modeHelp.error"};
let currentFilter = "all";
let latestState = null;
let toastTimer = null;
let selectedRequestId = null;
let lastRequestRenderKey = null;
let language = "zh";
const replyDrafts = new Map();

const quickTools = [
  {group:"screen", name:"pocket_screen_control", label:"tool.screen-read", args:{action:"read", reason:"查看当前界面"}},
  {group:"screen", name:"pocket_screen_control", label:"tool.screen-shot", args:{action:"screenshot", reason:"确认当前界面"}},
  {group:"screen", name:"pocket_screen_control", label:"tool.permission", args:{action:"request_permission", permission:"accessibility", reason:"启用屏幕读取"}},
  {group:"screen", name:"pocket_screen_control", label:"tool.tap", args:{action:"tap", x:540, y:960, reason:"点击目标按钮"}},
  {group:"screen", name:"pocket_screen_control", label:"tool.text", args:{action:"text", text:"测试文本", reason:"填写测试内容"}},
  {group:"workspace", name:"glob", label:"tool.search", args:{pattern:"**/*", path:"."}},
  {group:"workspace", name:"read", label:"tool.read", args:{path:"README.md"}},
  {group:"workspace", name:"write", label:"tool.write", args:{path:"mock-test.txt", content:"这是模拟工具写入的内容。"}},
  {group:"workspace", name:"fetch", label:"tool.fetch", args:{url:"https://example.com"}},
  {group:"tasks", name:"todo_write", label:"tool.todo", args:{todos:[{content:"验证工具调用链路", status:"in_progress"}]}}
];
const toolGroups = [
  {key:"screen", label:"detail.category-screen"},
  {key:"workspace", label:"detail.category-workspace"},
  {key:"tasks", label:"detail.category-tasks"}
];

function t(key, values = {}) {
  let value = translations[language]?.[key] ?? translations.zh[key] ?? key;
  for (const [name, replacement] of Object.entries(values)) value = value.replaceAll(`{${name}}`, String(replacement));
  return value;
}

function applyTranslations() {
  document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  document.querySelectorAll("[data-i18n]").forEach(node => {
    const key = node.dataset.i18n;
    if (translations[language][key]) node.textContent = t(key);
  });
  document.querySelectorAll("[data-i18n-attr]").forEach(node => {
    for (const entry of node.dataset.i18nAttr.split(";")) {
      const [attribute, key] = entry.split(":");
      if (attribute && key && translations[language][key]) node.setAttribute(attribute, t(key));
    }
  });
  document.querySelectorAll("[data-language]").forEach(button => {
    const active = button.dataset.language === language;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  const themeButton = document.getElementById("theme-toggle");
  if (themeButton) {
    const label = document.documentElement.dataset.theme === "dark" ? t("toast.theme-light") : t("toast.theme-dark");
    themeButton.title = label;
    themeButton.setAttribute("aria-label", label);
  }
  const refreshButton = document.querySelector(".top-meta button[onclick='refreshState()']");
  if (refreshButton) {
    refreshButton.title = t("toast.refresh");
    refreshButton.setAttribute("aria-label", t("toast.refresh"));
  }
  const mode = document.querySelector("#mode-control button.selected")?.dataset.mode;
  if (mode) document.getElementById("mode-help").textContent = t(modeHelpKeys[mode]);
  const saved = document.getElementById("save-state");
  if (saved) saved.textContent = saved.classList.contains("unsaved") ? t("settings.unsaved") : t("settings.synced");
  lastRequestRenderKey = null;
  if (latestState) renderRequests(latestState.requests);
  const row = selectedRow();
  if (row) renderConversation(row);
}

function setLanguage(nextLanguage, persist = true) {
  language = nextLanguage === "en" ? "en" : "zh";
  if (persist) localStorage.setItem("mock-provider-language", language);
  applyTranslations();
}

async function api(path, options = {}) {
  const response = await fetch(path, {headers:{"Content-Type":"application/json"}, ...options});
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || `HTTP ${response.status}`);
  return data;
}

function toast(message) {
  const node = document.getElementById("toast");
  node.textContent = message;
  node.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => node.classList.remove("show"), 2600);
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}

function lastUserMessage(messages) {
  const item = [...(messages || [])].reverse().find(x => x.role === "user");
  if (!item) return t("request.no-user");
  return typeof item.content === "string" ? item.content : JSON.stringify(item.content);
}

function saveVisibleReplyDrafts(list) {
  list.querySelectorAll("textarea[id^='reply-']").forEach(textarea => replyDrafts.set(textarea.id.slice("reply-".length), textarea.value));
}

function renderRequests(rows) {
  const filtered = currentFilter === "pending" ? rows.filter(row => row.status === "pending") : rows;
  const list = document.getElementById("request-list");
  saveVisibleReplyDrafts(list);
  const renderKey = JSON.stringify({language, filter:currentFilter, rows:filtered.map(row => ({id:row.id, status:row.status, created_at:row.created_at, model:row.model, stream:row.stream, messages:row.messages, response:row.response, error:row.error}))});
  if (renderKey === lastRequestRenderKey) return;

  const pendingIds = new Set(rows.filter(row => row.status === "pending").map(row => row.id));
  for (const id of replyDrafts.keys()) if (!pendingIds.has(id)) replyDrafts.delete(id);
  const active = document.activeElement;
  const activeReplyId = active?.id?.startsWith("reply-") ? active.id : null;
  const selection = activeReplyId ? {start:active.selectionStart, end:active.selectionEnd, direction:active.selectionDirection} : null;

  if (!filtered.length) {
    const pending = currentFilter === "pending";
    list.innerHTML = `<div class="empty-state"><div class="empty-icon">⇄</div><strong>${t(pending ? "requests.pending-empty-title" : "requests.empty-title")}</strong><p>${t(pending ? "requests.pending-empty-description" : "requests.empty-description")}</p></div>`;
    lastRequestRenderKey = renderKey;
    return;
  }

  list.innerHTML = filtered.map(row => {
    const status = row.status;
    const date = new Date(row.created_at).toLocaleTimeString(language === "zh" ? "zh-CN" : "en-US", {hour:"2-digit", minute:"2-digit", second:"2-digit"});
    const preview = escapeHtml(lastUserMessage(row.messages));
    const result = row.response ? `<div class="message-preview"><b>${t("request.reply")}</b>${escapeHtml(row.response)}</div>` : row.error ? `<div class="message-preview"><b>${t("request.error")}</b>${escapeHtml(row.error)}</div>` : "";
    const controls = status === "pending" ? `<div class="response-form" onclick="event.stopPropagation()"><textarea id="reply-${row.id}" placeholder="${t("request.reply-placeholder")}"></textarea><div class="request-actions"><button class="dispatch" onclick="dispatchReply('${row.id}')">${t("request.dispatch-reply")}</button><div class="tool-picker"><label for="quick-tool-${row.id}">${t("request.tools-label")}</label><select id="quick-tool-${row.id}" aria-label="${t("request.tools-placeholder")}" onchange="dispatchQuickTool(this, '${row.id}')"><option value="">${t("request.tools-placeholder")}</option>${quickToolOptions()}</select></div><button class="tool-dispatch" onclick="dispatchToolCall('${row.id}')">${t("request.dispatch-tool")}</button><button class="reject" onclick="dispatchError('${row.id}')">${t("request.dispatch-error")}</button></div></div>` : "";
    return `<article class="request-card" onclick="openConversation('${row.id}')"><div class="request-top"><code class="request-id">${escapeHtml(row.id)}</code><span class="request-time">${date}<span class="open-hint">${t("request.open")}</span></span></div><div class="request-meta"><span class="tag ${status}">${statusLabel(status)}</span><span class="tag">${escapeHtml(row.model || t("request.unspecified-model"))}</span><span class="tag">${row.stream ? t("request.stream") : t("request.non-stream")}</span></div><div class="message-preview">${preview}</div>${result}${controls}</article>`;
  }).join("");

  list.querySelectorAll("textarea[id^='reply-']").forEach(textarea => textarea.value = replyDrafts.get(textarea.id.slice("reply-".length)) || "");
  if (activeReplyId) {
    const restored = document.getElementById(activeReplyId);
    if (restored) { restored.focus({preventScroll:true}); if (selection) restored.setSelectionRange(selection.start, selection.end, selection.direction); }
  }
  lastRequestRenderKey = renderKey;
}

function quickToolOptions() {
  return toolGroups.map(group => `<optgroup label="${t(group.label)}">${quickTools.map((tool, index) => tool.group === group.key ? `<option value="${index}">${t(tool.label)} · ${escapeHtml(tool.name)}</option>` : "").join("")}</optgroup>`).join("");
}

function statusLabel(status) { return t(({pending:"status.pending", completed:"status.completed", tool_call:"status.tool_call", failed:"status.failed", timed_out:"status.timed_out"})[status] || status); }
function roleLabel(role) { return t(({system:"role.system", developer:"role.developer", user:"role.user", assistant:"role.assistant", tool:"role.tool"})[role] || "role.unknown"); }

function prettyJson(value) {
  if (value === undefined || value === null) return "";
  if (typeof value === "string") { try { return JSON.stringify(JSON.parse(value), null, 2); } catch { return value; } }
  return JSON.stringify(value, null, 2);
}

function toolCallFromRow(row) {
  if (row.tool_call?.function) return row.tool_call;
  try { const parsed = JSON.parse(row.response || ""); if (parsed.function) return parsed; } catch {}
  const assistant = [...(row.messages || [])].reverse().find(item => item.role === "assistant" && item.tool_calls?.length);
  return assistant?.tool_calls?.[0] || null;
}

function renderMessage(message, index) {
  const content = typeof message.content === "string" ? message.content : prettyJson(message.content);
  const toolCalls = message.tool_calls?.length ? `<div class="detail-tool-list">${message.tool_calls.map(call => `<div class="inline-tool-call"><span>${escapeHtml(call.function?.name || "function")}</span><code>${escapeHtml(prettyJson(call.function?.arguments || "{}"))}</code></div>`).join("")}</div>` : "";
  return `<div class="conversation-message role-${escapeHtml(message.role)}"><div class="message-label"><span class="role-dot"></span>${roleLabel(message.role)}<span class="message-index">#${index + 1}</span></div>${content ? `<pre class="message-content">${escapeHtml(content)}</pre>` : ""}${toolCalls}</div>`;
}

function quickToolButtons(row) {
  return quickTools.map((tool, index) => `<button class="quick-tool" onclick="chooseQuickTool(${index}, '${row.id}')"><span>${t(tool.label)}</span><code>${escapeHtml(tool.name)}</code></button>`).join("");
}

function renderConversation(row) {
  selectedRequestId = row.id;
  const overlay = document.getElementById("conversation-overlay");
  const content = document.getElementById("conversation-content");
  const call = toolCallFromRow(row);
  const payloadTools = row.payload?.tools || [];
  const modelName = escapeHtml(row.model || t("request.unspecified-model"));
  const responseBlock = row.response ? `<div class="detail-section"><div class="detail-label">${t("detail.response")}</div>${row.response_kind === "tool_call" || call ? `<pre class="message-content">${escapeHtml(prettyJson(call || row.response))}</pre>` : `<pre class="message-content">${escapeHtml(row.response)}</pre>`}</div>` : row.error ? `<div class="detail-section error-box">${escapeHtml(row.error)}</div>` : "";
  const pendingActions = row.status === "pending" ? `<div class="detail-section action-box"><div class="detail-label">${t("detail.dispatch")}</div><textarea id="detail-reply" placeholder="${t("detail.reply-placeholder")}"></textarea><div class="detail-actions"><button class="primary-button" onclick="detailDispatchReply()">${t("detail.dispatch-text")}</button><button class="plain-button" onclick="detailDispatchToolCall()">${t("request.dispatch-tool")}</button><button class="plain-button danger-button" onclick="detailDispatchError()">${t("request.dispatch-error")}</button></div></div>` : "";
  const toolSection = call ? `<div class="detail-section tool-call-box"><div class="detail-label">${t("detail.call")}</div><div class="tool-call-header"><strong>${escapeHtml(call.function?.name || t("detail.unnamed-tool"))}</strong><span>${call.id ? escapeHtml(call.id) : t("detail.mock-call")}</span></div><pre class="message-content">${escapeHtml(prettyJson(call.function?.arguments || "{}"))}</pre><p class="tool-note">${t("detail.tool-explanation")}</p><div class="quick-result-row"><input id="tool-result-value" value="${t("detail.result-placeholder")}" aria-label="${t("detail.result-placeholder")}"><button class="plain-button" onclick="copyToolResult()">${t("detail.copy-tool-result")}</button><button class="primary-button" onclick="simulateToolResult()">${t("detail.simulate-continue")}</button></div></div>` : "";
  const quickSection = `<div class="detail-section quick-tools-box"><div class="detail-label">${t("detail.quick-examples")}</div><p class="tool-note">${t("detail.quick-explanation")}</p><div class="quick-tool-grid">${quickToolButtons(row)}</div></div>`;
  const thread = (row.messages || []).map(renderMessage).join("") || `<p class="tool-note">${t("detail.no-messages")}</p>`;
  content.innerHTML = `<div class="conversation-meta"><span class="tag ${row.status}">${statusLabel(row.status)}</span><span class="tag">${modelName}</span><span class="tag">${row.stream ? t("request.stream") : t("request.non-stream")}</span><button class="plain-button copy-request" onclick="copyRequestJson()">${t("detail.copy-request")}</button></div><div class="detail-section"><div class="detail-label">${t("requests.title")}</div><div class="conversation-thread">${thread}</div></div>${responseBlock}${toolSection}${pendingActions}${quickSection}${payloadTools.length ? `<div class="detail-section"><div class="detail-label">${t("detail.client-tools")}</div><pre class="message-content">${escapeHtml(prettyJson(payloadTools))}</pre></div>` : ""}`;
  overlay.classList.add("open");
  overlay.setAttribute("aria-hidden", "false");
}

function openConversation(id) {
  const row = latestState?.requests?.find(item => item.id === id);
  if (row) renderConversation(row);
}

function closeConversation() {
  const overlay = document.getElementById("conversation-overlay");
  overlay.classList.remove("open");
  overlay.setAttribute("aria-hidden", "true");
  selectedRequestId = null;
}

function selectedRow() { return latestState?.requests?.find(item => item.id === selectedRequestId); }

function markSettingsUnsaved() {
  const node = document.getElementById("save-state");
  node.textContent = t("settings.unsaved");
  node.classList.add("unsaved");
}

async function dispatchQuickTool(select, requestId) {
  const index = Number(select.value);
  if (!select.value || !Number.isInteger(index) || !quickTools[index]) return;
  const tool = quickTools[index];
  select.disabled = true;
  try {
    await api(`/api/requests/${requestId}/tool-call`, {method:"POST", body:JSON.stringify({name:tool.name, arguments:tool.args})});
    toast(t("tool.dispatch-named", {name:tool.name}));
    await refreshState();
    if (selectedRequestId === requestId) openConversation(requestId);
  } catch (error) {
    toast(t("tool.dispatch-failed", {message:error.message}));
    select.disabled = false;
    select.value = "";
  }
}

function chooseQuickTool(index, requestId) {
  const tool = quickTools[index];
  if (!tool) return;
  document.getElementById("tool-name").value = tool.name;
  document.getElementById("tool-arguments").value = JSON.stringify(tool.args, null, 2);
  document.querySelectorAll("#mode-control button").forEach(button => button.classList.toggle("selected", button.dataset.mode === "tool_call"));
  document.getElementById("mode-help").textContent = t(modeHelpKeys.tool_call);
  markSettingsUnsaved();
  const row = latestState?.requests?.find(item => item.id === requestId);
  if (row?.status === "pending") {
    api(`/api/requests/${row.id}/tool-call`, {method:"POST", body:JSON.stringify({name:tool.name, arguments:tool.args})})
      .then(async () => { toast(t("tool.dispatch-named", {name:t(tool.label)})); await refreshState(); openConversation(row.id); })
      .catch(error => toast(t("tool.dispatch-failed", {message:error.message})));
  } else toast(t("tool.example-filled", {name:t(tool.label)}));
}

async function detailDispatchReply() {
  const row = selectedRow();
  const text = document.getElementById("detail-reply")?.value || "";
  if (!row || !text.trim()) { toast(t("toast.reply-required")); return; }
  try { await api(`/api/requests/${row.id}/respond`, {method:"POST", body:JSON.stringify({text})}); toast(t("toast.reply-sent")); await refreshState(); openConversation(row.id); }
  catch (error) { toast(t("tool.dispatch-failed", {message:error.message})); }
}

async function detailDispatchToolCall() { const row = selectedRow(); if (row) await dispatchToolCall(row.id); }
async function detailDispatchError() { const row = selectedRow(); if (row) await dispatchError(row.id); }

async function copyRequestJson() {
  const row = selectedRow();
  if (row) { await navigator.clipboard.writeText(JSON.stringify(row.payload || {}, null, 2)); toast(t("tool.copy-request")); }
}

async function copyToolResult() {
  const row = selectedRow();
  const call = row && toolCallFromRow(row);
  const result = document.getElementById("tool-result-value")?.value || "";
  await navigator.clipboard.writeText(JSON.stringify({role:"tool", tool_call_id:call?.id || "call_mock", content:result}, null, 2));
  toast(t("tool.result-copied"));
}

async function simulateToolResult() {
  const row = selectedRow();
  const call = row && toolCallFromRow(row);
  if (!row || !call) { toast(t("tool.missing")); return; }
  const toolResult = document.getElementById("tool-result-value")?.value || t("toast.simulated-default");
  try {
    const result = await api("/api/simulate-tool-result", {method:"POST", body:JSON.stringify({request:row.payload, tool_call:call, tool_result:toolResult})});
    const text = result.choices?.[0]?.message?.content || JSON.stringify(result);
    toast(t("tool.continuation"));
    await refreshState();
    renderConversation({...row, messages:[...(row.messages || []), {role:"assistant", content:null, tool_calls:[call]}, {role:"tool", tool_call_id:call.id || "call_mock", content:toolResult}], status:"completed", response:text, response_kind:"final_after_tool"});
  } catch (error) { toast(t("toast.continue-failed", {message:error.message})); }
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("mock-provider-theme", theme);
  const button = document.getElementById("theme-toggle");
  button.textContent = theme === "dark" ? "☀" : "☾";
  applyTranslations();
}

function toggleTheme() { setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark"); }

function syncSettings(data) {
  document.querySelectorAll("#mode-control button").forEach(button => button.classList.toggle("selected", button.dataset.mode === data.mode));
  document.getElementById("mode-help").textContent = t(modeHelpKeys[data.mode]);
  document.getElementById("delay").value = data.delay_ms;
  document.getElementById("delay-label").textContent = `${data.delay_ms} ms`;
  document.getElementById("failure-status").value = String(data.failure_status);
  document.getElementById("failure-message").value = data.failure_message;
  document.getElementById("tool-name").value = data.tool_name;
  document.getElementById("tool-arguments").value = JSON.stringify(data.tool_arguments);
  document.getElementById("tool-final-text").value = data.tool_final_text;
}

async function refreshState() {
  try {
    const data = await api("/api/state");
    latestState = data;
    document.getElementById("pending-count").textContent = data.pending_count;
    document.getElementById("pending-tab-count").textContent = data.pending_count;
    document.getElementById("request-count").textContent = data.requests.length;
    if (!document.querySelector("#mode-control button.selected")) syncSettings(data);
    renderRequests(data.requests);
  } catch (error) { toast(t("toast.state-failed", {message:error.message})); }
}

async function saveSettings() {
  const selected = document.querySelector("#mode-control button.selected");
  const payload = {mode:selected?.dataset.mode || "auto", delay_ms:Number(document.getElementById("delay").value), failure_status:Number(document.getElementById("failure-status").value), failure_message:document.getElementById("failure-message").value, tool_name:document.getElementById("tool-name").value, tool_arguments:document.getElementById("tool-arguments").value, tool_final_text:document.getElementById("tool-final-text").value};
  try {
    await api("/api/settings", {method:"POST", body:JSON.stringify(payload)});
    const node = document.getElementById("save-state");
    node.textContent = t("settings.synced");
    node.classList.remove("unsaved");
    toast(t("toast.settings-saved"));
    await refreshState();
  } catch (error) { toast(t("toast.settings-failed", {message:error.message})); }
}

async function dispatchReply(id) {
  const text = document.getElementById(`reply-${id}`)?.value || "";
  if (!text.trim()) { toast(t("toast.reply-required")); return; }
  try {
    await api(`/api/requests/${id}/respond`, {method:"POST", body:JSON.stringify({text})});
    replyDrafts.delete(id);
    toast(t("toast.reply-sent"));
    await refreshState();
  } catch (error) { toast(t("tool.dispatch-failed", {message:error.message})); }
}

async function dispatchError(id) {
  const status = Number(prompt(t("toast.error-status"), t("toast.error-status-default")));
  if (!status) return;
  const message = prompt(t("toast.error-title"), t("toast.error-default")) || t("toast.error-default");
  try { await api(`/api/requests/${id}/fail`, {method:"POST", body:JSON.stringify({status, message})}); toast(t("toast.error-sent")); await refreshState(); }
  catch (error) { toast(t("tool.dispatch-failed", {message:error.message})); }
}

async function dispatchToolCall(id) {
  let argumentsObject;
  try { argumentsObject = JSON.parse(document.getElementById("tool-arguments").value); }
  catch { toast(t("toast.tool-json")); return; }
  try {
    await api(`/api/requests/${id}/tool-call`, {method:"POST", body:JSON.stringify({name:document.getElementById("tool-name").value, arguments:argumentsObject})});
    toast(t("tool.dispatch-success"));
    await refreshState();
    if (selectedRequestId === id) openConversation(id);
  } catch (error) { toast(t("tool.dispatch-failed", {message:error.message})); }
}

async function copyBaseUrl() { await navigator.clipboard.writeText(document.getElementById("base-url").textContent); toast(t("toast.base-copied")); }
async function copyCurl() {
  const command = 'curl http://127.0.0.1:8000/v1/chat/completions -H "Authorization: Bearer test-key" -H "Content-Type: application/json" -d \'{"model":"mock-chat","messages":[{"role":"user","content":"你好"}]}\'';
  await navigator.clipboard.writeText(command);
  toast(t("toast.curl-copied"));
}

document.querySelectorAll("#mode-control button").forEach(button => button.addEventListener("click", () => {
  document.querySelectorAll("#mode-control button").forEach(item => item.classList.toggle("selected", item === button));
  document.getElementById("mode-help").textContent = t(modeHelpKeys[button.dataset.mode]);
  markSettingsUnsaved();
}));
document.getElementById("delay").addEventListener("input", event => { document.getElementById("delay-label").textContent = `${event.target.value} ms`; markSettingsUnsaved(); });
document.getElementById("save-settings").addEventListener("click", saveSettings);
document.getElementById("theme-toggle").addEventListener("click", toggleTheme);
document.querySelectorAll("[data-language]").forEach(button => button.addEventListener("click", () => setLanguage(button.dataset.language)));
document.getElementById("conversation-overlay").addEventListener("click", event => { if (event.target.id === "conversation-overlay") closeConversation(); });
document.addEventListener("keydown", event => { if (event.key === "Escape") closeConversation(); });
document.getElementById("clear-requests").addEventListener("click", async () => {
  if (!confirm(t("toast.clear-confirm"))) return;
  try { await api("/api/requests/clear", {method:"POST"}); replyDrafts.clear(); lastRequestRenderKey = null; await refreshState(); toast(t("toast.records-cleared")); }
  catch (error) { toast(t("toast.generic-error", {message:error.message})); }
});
document.getElementById("request-list").addEventListener("input", event => {
  if (event.target.matches("textarea[id^='reply-']")) replyDrafts.set(event.target.id.slice("reply-".length), event.target.value);
});
document.querySelectorAll(".filter-tabs button").forEach(button => button.addEventListener("click", () => {
  currentFilter = button.dataset.filter;
  document.querySelectorAll(".filter-tabs button").forEach(item => item.classList.toggle("active", item === button));
  if (latestState) renderRequests(latestState.requests);
}));
window.refreshState = refreshState;
window.dispatchReply = dispatchReply;
window.dispatchError = dispatchError;
window.dispatchToolCall = dispatchToolCall;
window.dispatchQuickTool = dispatchQuickTool;
window.copyBaseUrl = copyBaseUrl;
window.copyCurl = copyCurl;
window.openConversation = openConversation;
window.closeConversation = closeConversation;
window.chooseQuickTool = chooseQuickTool;
window.detailDispatchReply = detailDispatchReply;
window.detailDispatchToolCall = detailDispatchToolCall;
window.detailDispatchError = detailDispatchError;
window.copyRequestJson = copyRequestJson;
window.copyToolResult = copyToolResult;
window.simulateToolResult = simulateToolResult;
language = localStorage.getItem("mock-provider-language") || (navigator.language?.toLowerCase().startsWith("zh") ? "zh" : "en");
document.documentElement.dataset.theme = localStorage.getItem("mock-provider-theme") || "light";
setTheme(document.documentElement.dataset.theme);
setLanguage(language, false);
refreshState();
setInterval(refreshState, 1500);
[
  "failure-status", "failure-message", "tool-name", "tool-arguments", "tool-final-text",
].forEach(id => document.getElementById(id).addEventListener("input", markSettingsUnsaved));
