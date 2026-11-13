/* =========================================================
   noticeUtils.js
   Pure, stateless helper functions. Every one is a plain global
   function, callable directly from the console (esc("<x>"),
   roleName("parent"), fmt(1234), ...).
   Note: querySelector helpers are named qs/qsa so they never
   collide with jQuery's global $.
   ========================================================= */

function qs(sel) { return document.querySelector(sel); }
function qsa(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }

function createEl(tag, cls, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html != null) e.innerHTML = html;
  return e;
}

function esc(s) { return (s || "").replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
function fmt(n) { return n.toLocaleString(); }
function pad2(n) { return String(n).padStart(2, "0"); }

function roleName(id) { const r = ROLES.find(function (r) { return r.id === id; }); return r ? r.name : id; }
function rolesLabel(ids) { return (ids || []).map(roleName).join("/"); }
function typeName(id) { const t = TYPES.find(function (t) { return t.id === id; }); return t ? t.name : id; }
function typeCat(id) { const t = TYPES.find(function (t) { return t.id === id; }); return t ? t.cat : "transactional"; }
function isCollectType(id) { const t = TYPES.find(function (t) { return t.id === id; }); return !!(t && t.name === "Collect information"); }
/** Compose “Other” notice (free-text type, not a catalog notice type). */
function composeIsOtherNoticeType(typeId) { return String(typeId) === "other"; }

function composeAckOverrideEnabled() {
  return typeof COMPOSE_ACK_OVERRIDE_ENABLED !== "undefined" && COMPOSE_ACK_OVERRIDE_ENABLED === true;
}

function composeAttachmentEmbeddedEnabled() {
  return typeof COMPOSE_ATTACHMENT_EMBEDDED_ENABLED !== "undefined" && COMPOSE_ATTACHMENT_EMBEDDED_ENABLED === true;
}

function composeCommonModeEnabled() {
  return typeof COMPOSE_COMMON_MODE_ENABLED !== "undefined" && COMPOSE_COMMON_MODE_ENABLED === true;
}

/** tmpFiles download URL for a notice attachment storage key (after upload). */
function composeAttachmentPreviewUrl(storageKey) {
  if (!storageKey || typeof BASE_URL === "undefined" || typeof SCHOOL_UUID === "undefined") return "";
  const ctx = typeof CONTEXT_PATH !== "undefined" ? CONTEXT_PATH : "";
  return BASE_URL + ctx + SCHOOL_UUID + "/common/downloads?fileName=" + encodeURIComponent(storageKey);
}
function ftypeName(ft) { const f = FIELD_TYPES.find(function (x) { return x[0] === ft; }); return f ? f[1] : ft; }
function channelById(id) { return CHANNELS.find(function (x) { return x.id === id; }); }
function channelName(id) { const ch = channelById(id); return ch ? ch.name : id; }
function registrationTypeLabel(code) {
  if (!code) return "";
  const key = String(code).trim().toUpperCase();
  return (typeof REGISTRATION_TYPE_LABELS !== "undefined" && REGISTRATION_TYPE_LABELS[key])
    ? REGISTRATION_TYPE_LABELS[key]
    : String(code).replace(/_/g, " ");
}
function registrationTypesLabelCsv(csv) {
  if (!csv || !String(csv).trim()) return "";
  return String(csv).split(",").map(function (s) { return s.trim(); }).filter(Boolean)
    .map(registrationTypeLabel).join(", ");
}

function varsInText(text) {
  return [...new Set((String(text).match(/\{\{(\w+)\}\}/g) || []).map(function (v) { return v.replace(/[{}]/g, ""); }))];
}
function unknownVars(text) {
  return varsInText(text).filter(function (v) { return !KNOWN_VARS.includes(v); });
}

function fmtDeadlineDate(dt) {
  if (!dt) return "—";
  const d = new Date(dt);
  if (isNaN(d)) return esc(dt);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/** UTC sendAt from compose/get-detail → datetime-local value in the schedule input zone (matches NoticeUtil). */
function noticeUtcToScheduleInput(sendAt, timeRef, timezoneId) {
  if (!sendAt) return "";
  const raw = String(sendAt).replace(/\.\d+$/, "");
  let m = (typeof moment !== "undefined") ? moment.utc(raw, "YYYY-MM-DDTHH:mm:ss", true) : null;
  if (!m || !m.isValid()) {
    m = (typeof moment !== "undefined") ? moment.utc(raw) : null;
  }
  if (!m || !m.isValid()) return String(sendAt).substring(0, 16);
  let tz = "Asia/Kolkata";
  if (timeRef === "fixed" && timezoneId != null && typeof TIMEZONE_OPTIONS !== "undefined") {
    const opt = TIMEZONE_OPTIONS.find(function (t) { return t.key === String(timezoneId); });
    if (opt && opt.value) tz = opt.value;
  }
  return m.tz(tz).format("YYYY-MM-DDTHH:mm");
}

function fmtDateTime(dt) {
  if (!dt) return "—";
  // Backend sends this as a raw UTC wall-clock value with no zone marker (e.g. "2026-08-21T14:30:00").
  // new Date(dt) would misinterpret that as browser-local time and show it unconverted. Explicitly
  // parse as UTC and convert to the logged-in user's own timezone (USER_TIMEZONE - same source used
  // server-side for quiet hours, and the same pattern already used in activity.js / B2CLeadListContent.js).
  const raw = String(dt).replace(/\.\d+$/, "");
  const utcMoment = (typeof moment !== "undefined") ? moment.utc(raw, "YYYY-MM-DDTHH:mm:ss", true) : null;
  if (!utcMoment || !utcMoment.isValid()) {
    const d = new Date(dt);
    if (isNaN(d)) return esc(dt);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) + " " +
      d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
  }
  const tz = (typeof USER_TIMEZONE !== "undefined" && USER_TIMEZONE) ? USER_TIMEZONE : moment.tz.guess();
  return utcMoment.tz(tz).format("MMM D, YYYY hh:mm A");
}

function newNoticeId() { return "NT-" + (1049 + Math.floor(Math.random() * 900)); }
function nowStamp() { return "14 Jul 2026 " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); }

function downloadCSV(filename, rows) {
  const csv = rows.map(function (r) {
    return r.map(function (c) {
      const s = String(c == null ? "" : c);
      return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
    }).join(",");
  }).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  toast("Downloaded " + filename, "ok");
}

/** First contact email from compose “Footer — contact emails” (comma-separated). */
function noticeFirstFooterEmail(footerEmails) {
  const raw = String(footerEmails || "").trim();
  if (!raw) return "";
  return raw.split(",")[0].trim();
}

/** Normalized https URL from compose “Footer — website”, or empty. */
function noticeFooterWebsiteUrl(footerWebsite) {
  let w = String(footerWebsite || "").trim();
  if (!w) return "";
  if (!/^https?:\/\//i.test(w)) w = "https://" + w;
  return w;
}

/** Merge-field preview: explicit sample, else audience-based defaults. */
function composeMergeSampleValue(varName) {
  const c = S && S.compose ? S.compose : null;
  if (!c) return "";
  const explicit = String(c.samples[varName] || "").trim();
  if (explicit) return explicit;
  if (varName === "grade" && c.grades && c.grades.length && typeof GRADE_OPTIONS !== "undefined") {
    return c.grades.map(function (k) {
      const g = GRADE_OPTIONS.find(function (x) { return String(x.key) === String(k); });
      return g ? g.value : k;
    }).join(", ");
  }
  return "";
}

/** Card footer disclaimer (matches sent notice email). */
function noticeReplyDisclaimerText(footerEmails) {
  const emails = String(footerEmails || "").trim();
  if (emails) {
    return "Please reply to this email for any queries: " + emails;
  }
  return "Please do NOT reply to this email. Please note this is an auto generated e-mail.";
}
