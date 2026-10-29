const modeHelp = {auto: "收到请求后返回默认模拟回复。", manual: "请求会保持等待，直到你在队列中编辑并下发回复。", tool_call: "返回标准 tool_calls；客户端回传 role=tool 后，服务会生成最终文本。", error: "所有新请求都会返回设定的 HTTP 错误。"};
let currentFilter = "all";
let latestState = null;
let toastTimer = null;
let selectedRequestId = null;
let lastRequestRenderKey = null;
const replyDrafts = new Map();

const quickTools = [
  {group: "屏幕控制", name: "pocket_screen_control", label: "读取当前屏幕", args: {action: "read", reason: "查看当前界面"}},
  {group: "屏幕控制", name: "pocket_screen_control", label: "截取当前屏幕", args: {action: "screenshot", reason: "确认当前界面"}},
  {group: "屏幕控制", name: "pocket_screen_control", label: "请求无障碍权限", args: {action: "request_permission", permission: "accessibility", reason: "启用屏幕读取"}},
  {group: "屏幕控制", name: "pocket_screen_control", label: "点击坐标", args: {action: "tap", x: 540, y: 960, reason: "点击目标按钮"}},
  {group: "屏幕控制", name: "pocket_screen_control", label: "输入测试文本", args: {action: "text", text: "测试文本", reason: "填写测试内容"}},
  {group: "工作区", name: "glob", label: "搜索文件", args: {pattern: "**/*", path: "."}},
  {group: "工作区", name: "read", label: "读取 README", args: {path: "README.md"}},
  {group: "工作区", name: "write", label: "写入测试文件", args: {path: "mock-test.txt",content: "这是模拟工具写入的内容。"}},
  {group: "工作区", name: "fetch", label: "获取网页", args: {url: "https://example.com"}},
  {group: "任务", name: "todo_write", label: "更新待办", args: {todos: [{content: "验证工具调用链路", status: "in_progress"}]}},
];

async function api(path, options = {}) {
  const response = await fetch(path, {headers: {"Content-Type": "application/json"}, ...options});
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || `HTTP ${response.status}`);
  return data;
}

function toast(message) {
  const node = document.getElementById("toast");
  node.textContent = message;
  node.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => node.classList.remove("show"), 2200);
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}

function lastUserMessage(messages) {
  const item = [...(messages || [])].reverse().find(x => x.role === "user");
  if (!item) return "无用户消息";
  return typeof item.content === "string" ? item.content : JSON.stringify(item.content);
}

function saveVisibleReplyDrafts(list) {
  list.querySelectorAll("textarea[id^='reply-']").forEach(textarea => {
    replyDrafts.set(textarea.id.slice("reply-".length), textarea.value);
  });
}

function renderRequests(rows) {
  const filtered = currentFilter === "pending" ? rows.filter(row => row.status === "pending") : rows;
  const list = document.getElementById("request-list");
  saveVisibleReplyDrafts(list);
  const renderKey = JSON.stringify({
    filter: currentFilter,
    rows: filtered.map(row => ({
      id: row.id,
      status: row.status,
      created_at: row.created_at,
      model: row.model,
      stream: row.stream,
      messages: row.messages,
      response: row.response,
      error: row.error,
    })),
  });
  if (renderKey === lastRequestRenderKey) return;

  const pendingIds = new Set(rows.filter(row => row.status === "pending").map(row => row.id));
  for (const id of replyDrafts.keys()) {
    if (!pendingIds.has(id)) replyDrafts.delete(id);
  }

  const active = document.activeElement;
  const activeReplyId = active?.id?.startsWith("reply-") ? active.id : null;
  const selection = activeReplyId ? {
    start: active.selectionStart,
    end: active.selectionEnd,
    direction: active.selectionDirection,
  } : null;

  if (!filtered.length) {
    list.innerHTML = `<div class="empty-state"><div class="empty-icon">⇄</div><strong>${currentFilter === "pending" ? "当前没有待处理请求" : "还没有收到请求"}</strong><p>${currentFilter === "pending" ? "新的手动模式请求会显示在这里。" : "从你的客户端发送一次模型请求后，它会出现在这里。"}</p></div>`;
    lastRequestRenderKey = renderKey;
    return;
  }
  list.innerHTML = filtered.map(row => {
    const status = row.status;
    const date = new Date(row.created_at).toLocaleTimeString([], {hour: "2-digit", minute: "2-digit", second: "2-digit"});
    const preview = escapeHtml(lastUserMessage(row.messages));
    const result = row.response ? `<div class="message-preview"><b>回复：</b>${escapeHtml(row.response)}</div>` : row.error ? `<div class="message-preview"><b>错误：</b>${escapeHtml(row.error)}</div>` : "";
    const controls = status === "pending" ? `<div class="response-form" onclick="event.stopPropagation()"><textarea id="reply-${row.id}" placeholder="输入要下发给客户端的模型回复…"></textarea><button class="dispatch" onclick="dispatchReply('${row.id}')">下发回复</button><button class="tool-dispatch" onclick="dispatchToolCall('${row.id}')">下发工具调用</button><button class="reject" onclick="dispatchError('${row.id}')">返回错误</button></div>` : "";
    return `<article class="request-card" onclick="openConversation('${row.id}')"><div class="request-top"><code class="request-id">${escapeHtml(row.id)}</code><span class="request-time">${date}<span class="open-hint">查看详情 ›</span></span></div><div class="request-meta"><span class="tag ${status}">${statusLabel(status)}</span><span class="tag">${escapeHtml(row.model || "未指定模型")}</span><span class="tag">${row.stream ? "stream" : "非流式"}</span></div><div class="message-preview">${preview}</div>${result}${controls}</article>`;
  }).join("");

  list.querySelectorAll("textarea[id^='reply-']").forEach(textarea => {
    textarea.value = replyDrafts.get(textarea.id.slice("reply-".length)) || "";
  });
  if (activeReplyId) {
    const restored = document.getElementById(activeReplyId);
    if (restored) {
      restored.focus({preventScroll: true});
      if (selection) restored.setSelectionRange(selection.start, selection.end, selection.direction);
    }
  }
  lastRequestRenderKey = renderKey;
}

function statusLabel(status) { return ({pending:"等待下发",completed:"已完成",tool_call:"等待客户端执行工具",failed:"失败",timed_out:"已超时"})[status] || status; }

function roleLabel(role) { return ({system: "系统", developer: "开发者", user: "用户", assistant: "助手", tool: "工具结果"})[role] || role || "消息"; }

function prettyJson(value) {
  if (value === undefined || value === null) return "";
  if (typeof value === "string") {
    try { return JSON.stringify(JSON.parse(value), null, 2); } catch { return value; }
  }
  return JSON.stringify(value, null, 2);
}

function toolCallFromRow(row) {
  if (row.tool_call?.function) return row.tool_call;
  try {
    const parsed = JSON.parse(row.response || "");
    if (parsed.function) return parsed;
  } catch {}
  const assistant = [...(row.messages || [])].reverse().find(item => item.role === "assistant" && item.tool_calls?.length);
  return assistant?.tool_calls?.[0] || null;
}

function renderMessage(message, index) {
  const content = typeof message.content === "string" ? message.content : prettyJson(message.content);
  const toolCalls = message.tool_calls?.length ? `<div class="detail-tool-list">${message.tool_calls.map(call => `<div class="inline-tool-call"><span>${escapeHtml(call.function?.name || "function")}</span><code>${escapeHtml(prettyJson(call.function?.arguments || "{}"))}</code></div>`).join("")}</div>` : "";
  return `<div class="conversation-message role-${escapeHtml(message.role)}"><div class="message-label"><span class="role-dot"></span>${roleLabel(message.role)}<span class="message-index">#${index + 1}</span></div>${content ? `<pre class="message-content">${escapeHtml(content)}</pre>` : ""}${toolCalls}</div>`;
}

function quickToolButtons(row) {
  return quickTools.map((tool, index) => `<button class="quick-tool" onclick="chooseQuickTool(${index}, '${row.id}')"><span>${escapeHtml(tool.label)}</span><code>${escapeHtml(tool.name)}</code></button>`).join("");
}

function renderConversation(row) {
  selectedRequestId = row.id;
  const overlay = document.getElementById("conversation-overlay");
  const content = document.getElementById("conversation-content");
  const call = toolCallFromRow(row);
  const payloadTools = row.payload?.tools || [];
  const responseBlock = row.response ? `<div class="detail-section"><div class="detail-label">模型响应</div>${row.response_kind === "tool_call" || call ? `<pre class="message-content">${escapeHtml(prettyJson(call || row.response))}</pre>` : `<pre class="message-content">${escapeHtml(row.response)}</pre>`}</div>` : row.error ? `<div class="detail-section error-box">${escapeHtml(row.error)}</div>` : "";
  const pendingActions = row.status === "pending" ? `<div class="detail-section action-box"><div class="detail-label">下发操作</div><textarea id="detail-reply" placeholder="输入普通文本回复…"></textarea><div class="detail-actions"><button class="primary-button" onclick="detailDispatchReply()">下发文本</button><button class="plain-button" onclick="detailDispatchToolCall()">下发工具调用</button><button class="plain-button danger-button" onclick="detailDispatchError()">返回错误</button></div></div>` : "";
  const toolSection = call ? `<div class="detail-section tool-call-box"><div class="detail-label">工具调用</div><div class="tool-call-header"><strong>${escapeHtml(call.function?.name || "未命名工具")}</strong><span>${call.id ? escapeHtml(call.id) : "模拟调用"}</span></div><pre class="message-content">${escapeHtml(prettyJson(call.function?.arguments || "{}"))}</pre><p class="tool-note">这是模型返回给客户端的工具调用。这里不会操作真实设备；可以模拟工具执行结果，验证下一轮回复。</p><div class="quick-result-row"><input id="tool-result-value" value="模拟工具执行成功：操作已完成" aria-label="模拟工具结果"><button class="plain-button" onclick="copyToolResult()">复制 role=tool</button><button class="primary-button" onclick="simulateToolResult()">模拟执行并继续</button></div></div>` : "";
  const quickSection = `<div class="detail-section quick-tools-box"><div class="detail-label">快捷工具示例</div><p class="tool-note">按 DSH Pocket 工具定义准备的模拟示例。选择后会填入工具调用；若这是待处理请求，将直接下发给客户端。</p><div class="quick-tool-grid">${quickToolButtons(row)}</div></div>`;
  content.innerHTML = `<div class="conversation-meta"><span class="tag ${row.status}">${statusLabel(row.status)}</span><span class="tag">${escapeHtml(row.model || "未指定模型")}</span><span class="tag">${row.stream ? "stream" : "非流式"}</span><button class="plain-button copy-request" onclick="copyRequestJson()">复制请求 JSON</button></div><div class="detail-section"><div class="detail-label">对话消息</div><div class="conversation-thread">${(row.messages || []).map(renderMessage).join("") || "<p class='tool-note'>没有可展示的消息。</p>"}</div></div>${responseBlock}${toolSection}${pendingActions}${quickSection}${payloadTools.length ? `<div class="detail-section"><div class="detail-label">客户端声明的工具</div><pre class="message-content">${escapeHtml(prettyJson(payloadTools))}</pre></div>` : ""}`;
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

function chooseQuickTool(index, requestId) {
  const tool = quickTools[index];
  document.getElementById("tool-name").value = tool.name;
  document.getElementById("tool-arguments").value = JSON.stringify(tool.args, null, 2);
  document.querySelectorAll("#mode-control button").forEach(button => button.classList.toggle("selected", button.dataset.mode === "tool_call"));
  document.getElementById("mode-help").textContent = modeHelp.tool_call;
  document.getElementById("save-state").textContent = "未保存";
  document.getElementById("save-state").classList.add("unsaved");
  const row = latestState?.requests?.find(item => item.id === requestId);
  if (row?.status === "pending") {
    api(`/api/requests/${row.id}/tool-call`, {method: "POST", body: JSON.stringify({name: tool.name, arguments: tool.args})})
      .then(async () => { toast(`已下发工具调用：${tool.label}`); await refreshState(); openConversation(row.id); })
      .catch(error => toast(`下发失败：${error.message}`));
  } else {
    toast(`已填入示例：${tool.label}`);
  }
}

async function detailDispatchReply() {
  const row = selectedRow();
  const text = document.getElementById("detail-reply")?.value || "";
  if (!row || !text.trim()) { toast("请输入回复内容"); return; }
  try { await api(`/api/requests/${row.id}/respond`, {method: "POST", body: JSON.stringify({text})}); toast("回复已下发"); await refreshState(); openConversation(row.id); }
  catch (error) { toast(`下发失败：${error.message}`); }
}

async function detailDispatchToolCall() {
  const row = selectedRow();
  if (row) await dispatchToolCall(row.id);
}

async function detailDispatchError() {
  const row = selectedRow();
  if (row) await dispatchError(row.id);
}

async function copyRequestJson() {
  const row = selectedRow();
  if (row) { await navigator.clipboard.writeText(JSON.stringify(row.payload || {}, null, 2)); toast("请求 JSON 已复制"); }
}

async function copyToolResult() {
  const row = selectedRow();
  const call = row && toolCallFromRow(row);
  const result = document.getElementById("tool-result-value")?.value || "";
  const message = {role: "tool", tool_call_id: call?.id || "call_mock", content: result};
  await navigator.clipboard.writeText(JSON.stringify(message, null, 2));
  toast("role=tool 消息已复制");
}

async function simulateToolResult() {
  const row = selectedRow();
  const call = row && toolCallFromRow(row);
  if (!row || !call) { toast("当前请求没有工具调用可继续"); return; }
  const toolResult = document.getElementById("tool-result-value")?.value || "模拟工具执行成功";
  try {
    const result = await api("/api/simulate-tool-result", {method: "POST", body: JSON.stringify({request: row.payload, tool_call: call, tool_result: toolResult})});
    const text = result.choices?.[0]?.message?.content || JSON.stringify(result);
    toast("模拟工具结果已回传，已收到下一轮回复");
    await refreshState();
    renderConversation({...row, messages: [...(row.messages || []), {role: "assistant", content: null, tool_calls: [call]}, {role: "tool", tool_call_id: call.id || "call_mock", content: toolResult}], status: "completed", response: text, response_kind: "final_after_tool"});
  } catch (error) { toast(`模拟续答失败：${error.message}`); }
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("mock-provider-theme", theme);
  const button = document.getElementById("theme-toggle");
  button.textContent = theme === "dark" ? "☀" : "☾";
  button.title = theme === "dark" ? "切换浅色模式" : "切换深色模式";
  button.setAttribute("aria-label", button.title);
}

function toggleTheme() {
  setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
}

function syncSettings(data) {
  document.querySelectorAll("#mode-control button").forEach(button => button.classList.toggle("selected", button.dataset.mode === data.mode));
  document.getElementById("mode-help").textContent = modeHelp[data.mode];
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
  } catch (error) { toast(`读取服务状态失败：${error.message}`); }
}

async function saveSettings() {
  const selected = document.querySelector("#mode-control button.selected");
  const payload = {mode: selected?.dataset.mode || "auto", delay_ms: Number(document.getElementById("delay").value), failure_status: Number(document.getElementById("failure-status").value), failure_message: document.getElementById("failure-message").value, tool_name: document.getElementById("tool-name").value, tool_arguments: document.getElementById("tool-arguments").value, tool_final_text: document.getElementById("tool-final-text").value};
  try { await api("/api/settings", {method: "POST", body: JSON.stringify(payload)}); document.getElementById("save-state").textContent = "已同步"; document.getElementById("save-state").classList.remove("unsaved"); toast("设置已保存"); await refreshState(); }
  catch (error) { toast(`保存失败：${error.message}`); }
}

async function dispatchReply(id) {
  const text = document.getElementById(`reply-${id}`).value;
  try {
    await api(`/api/requests/${id}/respond`, {method: "POST", body: JSON.stringify({text})});
    const textarea = document.getElementById(`reply-${id}`);
    if (textarea) textarea.value = "";
    replyDrafts.delete(id);
    toast("回复已下发");
    await refreshState();
  }
  catch (error) { toast(`下发失败：${error.message}`); }
}

async function dispatchError(id) {
  const status = Number(prompt("HTTP 状态码（400-599）", "500"));
  if (!status) return;
  const message = prompt("错误消息", "Manually dispatched error") || "Manually dispatched error";
  try { await api(`/api/requests/${id}/fail`, {method: "POST", body: JSON.stringify({status, message})}); toast("错误已下发"); await refreshState(); }
  catch (error) { toast(`下发失败：${error.message}`); }
}

async function dispatchToolCall(id) {
  let argumentsObject;
  try { argumentsObject = JSON.parse(document.getElementById("tool-arguments").value); }
  catch { toast("工具参数必须是有效 JSON"); return; }
  try { await api(`/api/requests/${id}/tool-call`, {method: "POST", body: JSON.stringify({name: document.getElementById("tool-name").value, arguments: argumentsObject})}); toast("工具调用已下发"); await refreshState(); if (selectedRequestId === id) openConversation(id); }
  catch (error) { toast(`下发失败：${error.message}`); }
}

async function copyBaseUrl() { await navigator.clipboard.writeText(document.getElementById("base-url").textContent); toast("Base URL 已复制"); }
async function copyCurl() {
  const command = 'curl http://127.0.0.1:8000/v1/chat/completions -H "Authorization: Bearer test-key" -H "Content-Type: application/json" -d \'{"model":"mock-chat","messages":[{"role":"user","content":"你好"}]}\'';
  await navigator.clipboard.writeText(command); toast("curl 命令已复制");
}

document.querySelectorAll("#mode-control button").forEach(button => button.addEventListener("click", () => {
  document.querySelectorAll("#mode-control button").forEach(item => item.classList.toggle("selected", item === button));
  document.getElementById("mode-help").textContent = modeHelp[button.dataset.mode];
  document.getElementById("save-state").textContent = "未保存";
  document.getElementById("save-state").classList.add("unsaved");
}));
document.getElementById("delay").addEventListener("input", event => { document.getElementById("delay-label").textContent = `${event.target.value} ms`; document.getElementById("save-state").textContent = "未保存"; document.getElementById("save-state").classList.add("unsaved"); });
document.getElementById("save-settings").addEventListener("click", saveSettings);
document.getElementById("theme-toggle").addEventListener("click", toggleTheme);
document.getElementById("conversation-overlay").addEventListener("click", event => { if (event.target.id === "conversation-overlay") closeConversation(); });
document.addEventListener("keydown", event => { if (event.key === "Escape") closeConversation(); });
document.getElementById("clear-requests").addEventListener("click", async () => { if (confirm("清空所有请求记录？")) { await api("/api/requests/clear", {method:"POST"}); replyDrafts.clear(); lastRequestRenderKey = null; await refreshState(); toast("请求记录已清空"); } });
document.getElementById("request-list").addEventListener("input", event => {
  if (event.target.matches("textarea[id^='reply-']")) {
    replyDrafts.set(event.target.id.slice("reply-".length), event.target.value);
  }
});
document.querySelectorAll(".filter-tabs button").forEach(button => button.addEventListener("click", () => { currentFilter = button.dataset.filter; document.querySelectorAll(".filter-tabs button").forEach(item => item.classList.toggle("active", item === button)); if (latestState) renderRequests(latestState.requests); }));
window.refreshState = refreshState;
window.dispatchReply = dispatchReply;
window.dispatchError = dispatchError;
window.dispatchToolCall = dispatchToolCall;
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
setTheme(localStorage.getItem("mock-provider-theme") || "light");
refreshState();
setInterval(refreshState, 1500);
[
  "failure-status", "failure-message", "tool-name", "tool-arguments", "tool-final-text",
].forEach(id => document.getElementById(id).addEventListener("input", () => {
  document.getElementById("save-state").textContent = "未保存";
  document.getElementById("save-state").classList.add("unsaved");
}));
