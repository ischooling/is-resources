/* =========================================================
   noticeHtmlEditor.js
   Jodit WYSIWYG for notice email / template HTML bodies.
   ========================================================= */

const noticeHtmlEditors = {};

const NOTICE_HTML_EDITOR_BUTTONS = [
  "source", "|",
  "bold", "italic", "underline", "|",
  "ul", "ol", "|",
  "link", "hr", "|",
  "align", "|",
  "undo", "redo"
];

function noticeLooksLikeHtml(text) {
  return /<\s*(p|div|br|ul|ol|li|h[1-6]|table|strong|em|span)\b/i.test(String(text || ""));
}

function noticeHtmlToPlainPreview(html) {
  const d = document.createElement("div");
  d.innerHTML = html || "";
  return (d.textContent || d.innerText || "").trim();
}

function noticeHtmlIsBlank(html) {
  return !noticeHtmlToPlainPreview(html);
}

function noticeDestroyHtmlEditor(id) {
  const ed = noticeHtmlEditors[id];
  if (!ed) return;
  try {
    ed.destruct();
  } catch (e) { /* ignore */ }
  delete noticeHtmlEditors[id];
}

function noticeDestroyAllHtmlEditors() {
  Object.keys(noticeHtmlEditors).forEach(noticeDestroyHtmlEditor);
}

function noticeGetHtmlEditorValue(id) {
  const ed = noticeHtmlEditors[id];
  if (ed && ed.value !== undefined) return String(ed.value || "");
  const el = document.getElementById(id);
  if (!el) return "";
  if (el.value != null) return String(el.value || "");
  return String(el.innerHTML || "");
}

function noticeInitHtmlEditor(id, initialValue, options) {
  noticeDestroyHtmlEditor(id);
  const el = document.getElementById(id);
  if (!el || typeof Jodit === "undefined") return null;

  const editor = new Jodit(el, {
    height: (options && options.height) || 220,
    width: "100%",
    toolbarSticky: false,
    toolbarAdaptive: false,
    buttons: NOTICE_HTML_EDITOR_BUTTONS,
    showCharsCounter: false,
    showWordsCounter: false,
    showXPathInStatusbar: false,
    spellcheck: true,
    placeholder: (options && options.placeholder) || "",
    uploader: { insertImageAsBase64URI: true }
  });
  editor.value = String(initialValue == null ? "" : initialValue);
  if (options && options.onChange) {
    editor.events.on("change", function () {
      options.onChange(editor.value);
    });
  }
  if (options && options.onFocus) {
    editor.events.on("focus", options.onFocus);
  }
  noticeHtmlEditors[id] = editor;
  return editor;
}

function noticeHtmlEditorInsertAtCursor(id, token) {
  const ed = noticeHtmlEditors[id];
  if (ed) {
    ed.s.focus();
    ed.s.insertHTML(token);
    ed.events.fire("change");
    return noticeGetHtmlEditorValue(id);
  }
  const ta = document.getElementById(id);
  if (!ta || ta.value == null) return "";
  const pos = ta.selectionStart != null ? ta.selectionStart : ta.value.length;
  const end = ta.selectionEnd != null ? ta.selectionEnd : pos;
  ta.value = ta.value.slice(0, pos) + token + ta.value.slice(end);
  ta.focus();
  ta.selectionStart = ta.selectionEnd = pos + token.length;
  return ta.value;
}

function noticeSyncHtmlEditorToState(id, setValue) {
  const val = noticeGetHtmlEditorValue(id);
  if (setValue) setValue(val);
  return val;
}
