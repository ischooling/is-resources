/* =========================================================
   noticeCompose.js
   Compose behaviour: audience targeting, priority/channels,
   per-channel messaging, merge fields, collect-info builder,
   scheduling, acknowledgment, override, live preview, validation
   and the save/send flow. All plain global functions.
   Console-callable: renderCompose(), validateCompose(),
   saveCompose()/composeSaveDraft(), newCompose(), loadComposeNotice("NT-1044")
   ========================================================= */

/* module-scoped view state (data, not a namespace) */
let composeActiveField = "appBody";
let composeVarKey = "";
let composeAckTimer = null;

function blankCompose() {
  return {
    roles: [], registrationTypes: [], sessions: [], grades: [], batches: [], courses: [], users: [], countries: [], enrollStatuses: [], profile: "",
    prio: "normal", type: TYPES.length ? TYPES[0].id : "", otherType: "",
    channels: ["email"],
    commonMode: false,
    appHeading: "", appPush: "", appBody: "",
    webHeading: "", webBody: "",
    emailSubject: "", emailBody: "", footerEmails: "admissions@is.edu, support@is.edu", footerWebsite: "www.internationalschooling.org",
    waTemplate: "",
    samples: {},
    attachment: "", attachmentStorageKey: "", attachMode: "attached",
    schedDate: "", quietMode: "first1", quietX: 2, timeRef: "local", schedTZ: "", schedTime: "9:00",
    ack: false, ackMode: "timed", declaration: "", enforce: "soft", softToHard: 3, deadline: "", declineOutcome: "unblock-flag",
    collectFields: [], collectEnforce: "soft", collectSoftToHard: 3, collectHeading: "",
    collectDraft: { source: "new", section: PROFILE_SECTIONS[0], ftype: "text", label: "", options: "", mandatory: true, existing: "" },
    override: false, ovrRoles: [], ovrUsers: "",
    editId: null
  };
}

function composeSyncEmailBodyFromEditor() {
  noticeSyncHtmlEditorToState("emailBody", function (v) { S.compose.emailBody = v; });
}

function initComposeEmailBodyEditor() {
  const c = S.compose;
  if (!c.channels.includes("email") || c.commonMode) return;
  noticeInitHtmlEditor("emailBody", c.emailBody, {
    placeholder: "Email body…",
    height: 260,
    onChange: function (val) {
      S.compose.emailBody = val;
      composeOnMsgInput();
    },
    onFocus: function () {
      composeActiveField = "emailBody";
    }
  });
}

function renderCompose() {
  composeNormalizeExclusiveSelections();
  if (!composeAttachmentEmbeddedEnabled()) S.compose.attachMode = "attached";
  if (!composeCommonModeEnabled()) S.compose.commonMode = false;
  if (noticeHtmlEditors.emailBody) {
    composeSyncEmailBodyFromEditor();
  }
  noticeDestroyHtmlEditor("emailBody");
  $('#dashboardContentInHTML').html(composePageHtml(S.compose));
  initComposeSelect2All();
  initComposeEmailBodyEditor();
  initComposePreviewSticky();
  refreshComposeTargetFields();
  renderComposeUserChips();
  composeRefreshAttachmentUi();
  syncComposeTypeCat();
  updateComposePrioHelp();
  renderComposeChanNotes();
  syncComposeVarSamples(true);
  updateComposeVarNote();
  renderComposePreview();
  updateComposeSchedHelp();
}

let composePreviewStickyHandler = null;

function composePreviewStickyReposition() {
  const $col = $('#composePreviewCol');
  const $outer = $('#composePreviewOuter');
  if (!$col.length || !$outer.length) return;
  const headerEl = document.querySelector('.app-header');
  const topOffset = (headerEl ? Math.max(headerEl.getBoundingClientRect().bottom, 0) : 0) + 16;
  const outerRect = $outer[0].getBoundingClientRect();
  const colHeight = $col.outerHeight();
  const colWidth = $outer.width();
  if (outerRect.top >= topOffset) {
    $col.css({ position: "static", top: "", bottom: "", left: "", width: "" });
  } else if (outerRect.bottom - colHeight < topOffset) {
    $col.css({ position: "absolute", top: "", bottom: "0px", left: "0px", width: colWidth + "px" });
  } else {
    $col.css({ position: "fixed", top: topOffset + "px", bottom: "", left: outerRect.left + "px", width: colWidth + "px" });
  }
}

function initComposePreviewSticky() {
  if (composePreviewStickyHandler) {
    $(window).off("scroll.composePreview resize.composePreview", composePreviewStickyHandler);
  }
  composePreviewStickyHandler = composePreviewStickyReposition;
  $(window).on("scroll.composePreview resize.composePreview", composePreviewStickyHandler);
  composePreviewStickyReposition();
}

function initComposeSelect2All() {
  const $selects = $('#dashboardContentInHTML select');
  $selects.each(function () {
    if ($(this).hasClass('select2-hidden-accessible')) {
      $(this).select2('destroy');
    }
  });
  $selects.select2({
    theme: 'bootstrap4',
    dropdownParent: $('#dashboardContentInHTML'),
    width: '100%'
  });
}

/* ---- generic field setters (delegated handlers) ---- */
function composeApplyAfter(after) {
  if (after === "compose") renderCompose();
  else if (after === "preview") renderComposePreview();
  else if (after === "msg") composeOnMsgInput();
  else if (after === "sched") updateComposeSchedHelp();
}
function composeField(e) {
  const el = e.currentTarget;
  S.compose[el.dataset.k] = el.dataset.num != null ? +el.value : el.value;
  if (el.dataset.k === "type" && composeIsOtherNoticeType(el.value)) {
    S.compose.emailSubject = "";
  }
  composeApplyAfter(el.dataset.after);
  if (el.dataset.k === "waTemplate") renderComposeChanNotes();
}
function composeFieldClick(e) {
  const el = e.currentTarget;
  if (el.dataset.k === "attachMode" && el.dataset.v === "embedded" && !composeAttachmentEmbeddedEnabled()) return;
  S.compose[el.dataset.k] = el.dataset.v;
  if (el.dataset.k === "attachMode" && !composeAttachmentEmbeddedEnabled()) S.compose.attachMode = "attached";
  composeApplyAfter(el.dataset.after);
}

/* ---- audience ---- */
function composeApplicableFields() {
  const relevant = S.compose.roles
    .map(function (id) { return ROLES.find(function (r) { return r.id === id; }); })
    .filter(function (r) { return r && ["STUDENT", "TEACHER", "PARENT"].includes((r.name || "").toUpperCase()); });
  const union = { registrationType: false, session: false, grade: false, batch: false, course: false, enroll: false };
  relevant.forEach(function (r) {
    const f = r.fields || {};
    if (f.registrationType) union.registrationType = true;
    if (f.session) union.session = true;
    if (f.grade) union.grade = true;
    if (f.batch) union.batch = true;
    if (f.course) union.course = true;
    if (f.enroll) union.enroll = true;
  });
  return union;
}

function composeStudentRoleId() {
  const found = S.compose.roles
    .map(function (id) { return ROLES.find(function (r) { return r.id === id; }); })
    .find(function (r) { return r && (r.name || "").toUpperCase() === "STUDENT"; });
  return found ? found.id : null;
}

function composeSetRole(elementId) {
  const c = S.compose;
  c.roles = $("#"+elementId).val() || [];
  c.users = [];

  const f = composeApplicableFields();
  if (!f.grade) c.grades = [];
  if (!f.batch) c.batches = [];
  if (!f.course) c.courses = [];
  if (!f.registrationType) c.registrationTypes = [];
  if (!f.session) c.sessions = [];

  c.profile = "";

  refreshComposeTargetFields();
  renderComposeUserChips();

  const studentRoleId = composeStudentRoleId();
  $("#userSearch").attr(
      "placeholder",
      studentRoleId
          ? "Type a " + roleName(studentRoleId) + " name…"
          : (c.roles.length ? "Individual search only available for Student" : "Select a role first")
  );
}

function composeSetRegistrationTypes(e) { S.compose.registrationTypes = $(e.currentTarget).val() || []; }
function composeSetSessions(e) { S.compose.sessions = $(e.currentTarget).val() || []; }
function composeSetCourses(e) { S.compose.courses = $(e.currentTarget).val() || []; }
function composeSetCountries(e) { S.compose.countries = $(e.currentTarget).val() || []; }
function composeSetEnrollStatuses(e) { S.compose.enrollStatuses = $(e.currentTarget).val() || []; }

function refreshComposeTargetFields() {
  const f = composeApplicableFields();
  const show = function (fid, on) { const e = document.getElementById(fid); if (e) e.classList.toggle("d-none", !on); };
  show("registrationTypeField", f.registrationType);
  show("sessionField", f.session);
  show("gradeField", f.grade);
  show("batchField", f.batch);
  show("courseField", f.course);
  show("enrollField2", f.enroll);
  show("profileField", !!S.compose.roles.length);
  show("userField", !!S.compose.roles.length);
}

function composeGradeChanged(e) {
  const c = S.compose;
  c.grades = $(e.currentTarget).val() || [];
  c.batches = [];
  c.courses = [];
  loadComposeBatches(c.grades.join(","), function () {
    loadComposeCourses(c.grades.join(","), "", renderCompose);
  });
}

function composeBatchChanged(e) {
  const c = S.compose;
  c.batches = $(e.currentTarget).val() || [];
  c.courses = [];
  loadComposeCourses(c.grades.join(","), c.batches.join(","), renderCompose);
}

let composeUserSearchResults = [];
let composeUserSearchTimer = null;

function composeUserSearchInput(e) {
  const v = e.currentTarget.value.trim();
  if (composeUserSearchTimer) clearTimeout(composeUserSearchTimer);
  if (!composeStudentRoleId() || v.length < 2) {
    composeUserSearchResults = [];
    renderComposeUserSearchResults();
    return;
  }
  composeUserSearchTimer = setTimeout(function () { composeRunUserSearch(v); }, 300);
}

function composeRunUserSearch(searchText) {
  const c = S.compose;
  const roleId = composeStudentRoleId();
  if (!roleId) return;
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLForNotice("audience/search-students"),
    data: JSON.stringify({
      roleId: parseInt(roleId, 10),
      registrationType: c.registrationTypes[0] || null,
      sessionId: c.sessions[0] ? parseInt(c.sessions[0], 10) : null,
      standardId: c.grades[0] || null,
      batchId: c.batches[0] || null,
      courseProId: c.courses[0] || null,
      country: c.countries[0] || null,
      firstReset: c.profile !== "" ? parseInt(c.profile, 10) : null,
      withdrawalStatus: c.enrollStatuses[0] !== undefined ? parseInt(c.enrollStatuses[0], 10) : null,
      searchText: searchText,
      limit: 20
    }),
    dataType: "json",
    success: function (rows) {
      composeUserSearchResults = rows || [];
      renderComposeUserSearchResults();
    },
    error: function () {
      composeUserSearchResults = [];
      renderComposeUserSearchResults();
    }
  });
}

function renderComposeUserSearchResults() {
  const box = document.getElementById("userSearchResults");
  if (box) box.innerHTML = composeUserSearchResultsHtml(composeUserSearchResults, S.compose.users);
}

function composeSelectUserResult(e) {
  const el = e.currentTarget;
  const id = +el.dataset.id;
  const name = el.dataset.name;
  if (!S.compose.users.some(function (u) { return u.id === id; })) {
    S.compose.users.push({ id: id, fullName: name });
  }
  composeUserSearchResults = [];
  const inp = document.getElementById("userSearch");
  if (inp) inp.value = "";
  renderComposeUserSearchResults();
  renderComposeUserChips();
}

function composeRemoveUser(e) { const el = e.currentTarget; S.compose.users.splice(+el.dataset.i, 1); renderComposeUserChips(); }
function renderComposeUserChips() {
  const box = document.getElementById("userChips");
  if (box) box.innerHTML = composeUserChipsHtml(S.compose);
}
function composeUserSearchKey(e) {
  if (e.key === "Enter") {
    e.preventDefault();
    if (composeUserSearchResults.length) {
      composeSelectUserResult({ currentTarget: { dataset: { id: composeUserSearchResults[0].userId, name: composeUserSearchResults[0].fullName } } });
    }
  }
}

/* ---- priority & channels (one selected chip; others disabled until selection cleared) ---- */
function composeNormalizeExclusiveSelections() {
  const c = S.compose;
  if (c.channels.length > 1) c.channels = [c.channels[c.channels.length - 1]];
}

function composeSelectChan(e) {
  const id = e.currentTarget.dataset.id;
  const cur = S.compose.channels;
  if (cur.length === 1 && cur[0] === id) {
    S.compose.channels = [];
  } else {
    S.compose.channels = [id];
  }
  renderCompose();
}
var COMPOSE_CHANNEL_READINESS = { key: null, loading: false, byChannel: {} };

function renderComposeChanNotes() {
  const box = document.getElementById("chanNotes");
  if (box) box.innerHTML = composeChanNotesHtml(S.compose);
  loadComposeChannelReadiness();
}

/* Asks the server whether each channel is configured (re-asked when the WhatsApp event changes). */
function loadComposeChannelReadiness() {
  const waEvent = S.compose.channels.includes("whatsapp") ? (S.compose.waTemplate || "") : "";
  const key = "wa:" + waEvent;
  if (COMPOSE_CHANNEL_READINESS.key === key || COMPOSE_CHANNEL_READINESS.loading) return;
  COMPOSE_CHANNEL_READINESS.loading = true;
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLForNotice("channels/readiness"),
    data: JSON.stringify({ waEvent: waEvent }),
    dataType: "json",
    success: function (rows) {
      COMPOSE_CHANNEL_READINESS.byChannel = {};
      (rows || []).forEach(function (r) { COMPOSE_CHANNEL_READINESS.byChannel[r.channel] = r; });
      COMPOSE_CHANNEL_READINESS.key = key;
    },
    complete: function () {
      COMPOSE_CHANNEL_READINESS.loading = false;
      const box = document.getElementById("chanNotes");
      if (box) box.innerHTML = composeChanNotesHtml(S.compose);
      const nowKey = "wa:" + (S.compose.channels.includes("whatsapp") ? (S.compose.waTemplate || "") : "");
      if (nowKey !== COMPOSE_CHANNEL_READINESS.key && COMPOSE_CHANNEL_READINESS.key !== null) loadComposeChannelReadiness();
    }
  });
}
function composeSetPrio(e) {
  const p = e.currentTarget.dataset.p;
  if (S.compose.prio === p) {
    S.compose.prio = "";
  } else {
    S.compose.prio = p;
  }
  renderCompose();
}
function updateComposePrioHelp() {
  const h = document.getElementById("prioHelp");
  if (h) h.innerHTML = composePrioHelpHtml(S.compose);
}
function syncComposeTypeCat() {
  const t = document.getElementById("catTxt");
  if (t) t.innerHTML = composeTypeCatHtml(typeCat(S.compose.type));
}

/* ---- message: common mode + merge fields ---- */
function composeSetActiveField(e) { composeActiveField = e.currentTarget.id; }
function composeSetCommonValue(k, val) {
  const c = S.compose;
  if (k === "heading") {
    c.appHeading = c.webHeading = val;
    if (!composeIsOtherNoticeType(c.type)) c.emailSubject = val;
  } else if (k === "body") { c.appBody = c.webBody = c.emailBody = val; }
  composeOnMsgInput();
}
function composeSetCommon(e) { const el = e.currentTarget; composeSetCommonValue(el.dataset.k, el.value); }
function composeToggleCommon() {
  if (!composeCommonModeEnabled()) return;
  const c = S.compose;
  c.commonMode = !c.commonMode;
  if (c.commonMode) {
    const heading = c.appHeading || c.webHeading || c.emailSubject || "";
    const body = c.appBody || c.webBody || c.emailBody || "";
    c.appHeading = c.webHeading = heading;
    if (!composeIsOtherNoticeType(c.type)) c.emailSubject = heading;
    c.appBody = c.webBody = c.emailBody = body;
  }
  renderCompose();
}
function composeInsertVar(e) {
  const v = e.currentTarget.dataset.v;
  const fieldId = composeActiveField || "appBody";
  const token = "{{" + v + "}}";
  if (fieldId === "emailBody" && noticeHtmlEditors.emailBody) {
    const val = noticeHtmlEditorInsertAtCursor("emailBody", token);
    S.compose.emailBody = val;
    composeOnMsgInput();
    return;
  }
  const ta = document.getElementById(fieldId) || document.getElementById("appBody") || document.getElementById("webBody") || document.getElementById("emailBody");
  if (!ta) return;
  const pos = ta.selectionStart != null ? ta.selectionStart : ta.value.length;
  ta.value = ta.value.slice(0, pos) + token + ta.value.slice(ta.selectionEnd != null ? ta.selectionEnd : pos);
  if (ta.id === "commonHeading") composeSetCommonValue("heading", ta.value);
  else if (ta.id === "commonBody") composeSetCommonValue("body", ta.value);
  else { S.compose[ta.id] = ta.value; composeOnMsgInput(); }
  ta.focus();
  ta.selectionStart = ta.selectionEnd = pos + token.length;
}

/* ---- merge-field sample values + validation note ---- */
function composeVarsAllText() {
  const c = S.compose;
  let t = [c.appHeading, c.appPush, c.appBody, c.webHeading, c.webBody, c.emailSubject, c.emailBody].join(" ");
  if (c.channels.includes("whatsapp") && c.waTemplate) {
    const w = WA_TEMPLATES.find(function (x) { return x.id === c.waTemplate; });
    if (w) t += " " + w.body;
  }
  return t;
}
function composeVarsInUse() { return varsInText(composeVarsAllText()); }
function syncComposeVarSamples(force) {
  const vars = composeVarsInUse();
  const key = vars.join(",");
  if (!force && key === composeVarKey) return;
  composeVarKey = key;
  const box = document.getElementById("varSamples");
  if (box) box.innerHTML = composeVarSamplesHtml(vars);
}
function composeSetSample(e) { const el = e.currentTarget; S.compose.samples[el.dataset.v] = el.value; renderComposePreview(); }
function updateComposeVarNote() {
  const bad = unknownVars(composeVarsAllText());
  const vn = document.getElementById("varNote");
  if (!vn) return;
  vn.innerHTML = bad.length
    ? '<span class="text-danger">&#9888; Unknown merge field' + (bad.length > 1 ? "s" : "") + ": " + bad.map(function (b) { return "{{" + b + "}}"; }).join(", ") + " — won't resolve at send.</span>"
    : (composeVarKey ? '<span class="text-success">&#10003; All merge fields recognised.</span>' : "");
}
function composeOnMsgInput() { syncComposeVarSamples(); updateComposeVarNote(); renderComposePreview(); }

/* ---- collect-information builder ---- */
function composeCollectDraftSetValue(k, v) {
  const dr = S.compose.collectDraft;
  dr[k] = v;
  if (k === "existing" && v) {
    const f = EXISTING_FIELDS.find(function (x) { return x.id === v; });
    if (f) { dr.section = f.section; dr.ftype = f.ftype; dr.label = f.label; }
  }
  renderCompose();
}
function composeCollectDraftSet(e) { const el = e.currentTarget; composeCollectDraftSetValue(el.dataset.k, el.value); }
function composeCollectSource(e) { composeCollectDraftSetValue("source", e.currentTarget.dataset.v); }
function composeCollectLabel(e) { S.compose.collectDraft.label = e.currentTarget.value; }
function composeCollectOptions(e) { S.compose.collectDraft.options = e.currentTarget.value; }
function composeCollectMandatory(e) { S.compose.collectDraft.mandatory = e.currentTarget.value === "1"; }
function composeAddCollectField() {
  const dr = S.compose.collectDraft;
  if (dr.source === "existing") {
    if (!dr.existing) { toast("Select an existing field", "err"); return; }
    const f = EXISTING_FIELDS.find(function (x) { return x.id === dr.existing; });
    S.compose.collectFields.push({ source: "existing", section: f.section, ftype: f.ftype, label: f.label, options: f.options || [], mandatory: dr.mandatory, existingFieldRef: f.id });
  } else {
    if (!dr.label.trim()) { toast("Enter a label name", "err"); return; }
    const opts = dr.ftype === "dropdown" ? dr.options.split(",").map(function (s) { return s.trim(); }).filter(Boolean) : [];
    if (dr.ftype === "dropdown" && !opts.length) { toast("Add at least one dropdown option", "err"); return; }
    S.compose.collectFields.push({ source: "new", section: dr.section, ftype: dr.ftype, label: dr.label.trim(), options: opts, mandatory: dr.mandatory, existingFieldRef: null });
  }
  S.compose.collectDraft = { source: "new", section: PROFILE_SECTIONS[0], ftype: "text", label: "", options: "", mandatory: true, existing: "" };
  renderCompose();
  toast("Field added", "ok");
}
function composeRemoveCollectField(e) { S.compose.collectFields.splice(+e.currentTarget.dataset.i, 1); renderCompose(); }

/* ---- templates ---- */
function applyComposeTemplate(id) {
  if (!id) return;
  const t = COMPOSE_TEMPLATES.find(function (x) { return String(x.id) === String(id); });
  if (!t) return;
  noticeDestroyHtmlEditor("emailBody");
  const c = S.compose;
  c.type = t.type;
  c.appHeading = t.heading;
  c.webHeading = t.heading;
  c.emailSubject = "";
  c.appPush = t.push;
  c.appBody = t.body;
  c.webBody = t.body;
  c.emailBody = t.body || "";
  if (composeAckOverrideEnabled() && t.type === "legal") c.ack = true;
  if (t.collectFields && t.collectFields.length) c.collectFields = t.collectFields.map(function (f) { return Object.assign({}, f); });
  renderCompose();
  toast('Template "' + t.name + '" inserted', "ok");
}
function composeApplyTemplate(e) { applyComposeTemplate(e.currentTarget.value); }

/* ---- acknowledgment + override toggles ---- */
function composeToggleAck() {
  if (!composeAckOverrideEnabled()) return;
  S.compose.ack = !S.compose.ack;
  renderCompose();
}
function composeSetAckMode(e) { const m = e.currentTarget.dataset.v; S.compose.ackMode = m; if (m === "simple") S.compose.deadline = ""; renderCompose(); }
function composeSetEnforce(e) { S.compose.enforce = e.currentTarget.dataset.v; renderCompose(); }
function composeToggleOvr() {
  if (!composeAckOverrideEnabled()) return;
  S.compose.override = !S.compose.override;
  renderCompose();
}
function composeToggleOvrRole(e) {
  const el = e.currentTarget;
  const a = S.compose.ovrRoles;
  const id = el.dataset.id;
  const i = a.indexOf(id);
  if (i >= 0) a.splice(i, 1); else a.push(id);
  renderCompose();
}

/* ---- scheduling ---- */
function composeSetTimeRef(e) {
  const el = e.currentTarget;
  S.compose.timeRef = el.value;
  if (el.value === "fixed" && !S.compose.schedTZ && TIMEZONE_OPTIONS.length) {
    S.compose.schedTZ = TIMEZONE_OPTIONS[0].key;
  }
  const f = document.getElementById("tzField");
  if (f) {
    f.classList.toggle("d-none", el.value !== "fixed");
    const select = f.querySelector("select");
    if (select) select.value = S.compose.schedTZ;
  }
  updateComposeSchedHelp();
}
function updateComposeSchedHelp() {
  const c = S.compose;
  const qx = document.getElementById("quietXField");
  if (qx) qx.classList.toggle("d-none", c.quietMode !== "firstX");
  const h = document.getElementById("schedHelp");
  if (h) h.innerHTML = composeSchedHelpHtml(c);
}

/* ---- attachment ---- */
function composeTriggerAttach() { document.getElementById("attachInput").click(); }

function composeOpenAttachmentPreview() {
  const c = S.compose;
  if (c.attachmentUploading) {
    toast("Please wait for the upload to finish.", "warn");
    return;
  }
  if (!c.attachmentStorageKey) {
    toast("Upload a file first to preview it.", "warn");
    return;
  }
  const url = composeAttachmentPreviewUrl(c.attachmentStorageKey);
  if (!url) {
    toast("Could not build preview URL.", "err");
    return;
  }
  const display = c.attachment || c.attachmentStorageKey;
  const lower = String(display).toLowerCase();
  let body = "";
  if (/\.pdf$/i.test(lower)) {
    body = `<iframe src="${esc(url)}" title="${esc(display)}" style="width:100%;height:70vh;border:0;border-radius:4px"></iframe>`;
  } else if (/\.(jpe?g|png)$/i.test(lower)) {
    body = `<div class="d-block text-center"><img src="${esc(url)}" alt="${esc(display)}" class="img-fluid" style="max-height:70vh"></div>`;
  } else {
    body = `<p class="mb-3">Inline preview is not available for this file.</p><a class="btn btn-primary" href="${esc(url)}" target="_blank" rel="noopener">Open in new tab</a>`;
  }
  openModal("Attachment preview · " + esc(display), body, '<button class="btn btn-light" onclick="closeModal()">Close</button>', { wide: true });
}

function composeRefreshAttachmentUi() {
  const c = S.compose;
  const box = document.getElementById("attachName");
  if (box && c.attachment) {
    box.textContent = c.attachment;
  } else if (box && !c.attachment) {
    box.textContent = "No file chosen";
  }
  const prev = document.getElementById("attachPreviewBtn");
  if (prev) prev.disabled = !c.attachmentStorageKey || !!c.attachmentUploading;
}
function composePickAttachment(e) {
  const el = e.currentTarget;
  const f = el.files && el.files[0];
  const box = document.getElementById("attachName");
  if (!f) { box.textContent = "No file chosen"; return; }
  if (f.size > 5 * 1024 * 1024) { toast("File exceeds 5 MB limit", "err"); el.value = ""; box.textContent = "No file chosen"; return; }
  if (!/\.(pdf|jpe?g|png)$/i.test(f.name)) { toast("Only pdf, JPEG, PNG allowed", "err"); el.value = ""; box.textContent = "No file chosen"; return; }

  S.compose.attachment = f.name;
  S.compose.attachmentStorageKey = "";
  S.compose.attachmentUploading = true;
  box.textContent = "Uploading " + f.name + "…";
  composeRefreshAttachmentUi();

  const formData = new FormData();
  formData.append("file", f);
  $.ajax({
    type: "POST",
    url: getURLForNotice("attachment/upload"),
    data: formData,
    processData: false,
    contentType: false,
    dataType: "json",
    success: function (res) {
      S.compose.attachmentUploading = false;
      if (!res || res.status !== "1" || !res.filename) {
        toast((res && res.message) || "Could not upload the file.", "err");
        el.value = "";
        S.compose.attachment = "";
        box.textContent = "No file chosen";
        composeRefreshAttachmentUi();
        return;
      }
      S.compose.attachmentStorageKey = res.filename;
      box.textContent = f.name + "  (" + (f.size / 1024).toFixed(0) + " KB)";
      composeRefreshAttachmentUi();
      renderComposePreview();
    },
    error: function () {
      S.compose.attachmentUploading = false;
      toast("Could not upload the file.", "err");
      el.value = "";
      S.compose.attachment = "";
      box.textContent = "No file chosen";
      composeRefreshAttachmentUi();
    }
  });
}

/* ---- live preview + countdown timer ---- */
function renderComposePreview() {
  const c = S.compose;
  const p = document.getElementById("pvNotif");
  if (!p) return;
  p.innerHTML = composePreviewNotifHtml(c);
  const a = document.getElementById("pvAck");
  if (isCollectType(c.type)) {
    a.innerHTML = composeCollectFooterHtml(c);
  } else if (c.ack) {
    a.innerHTML = composeAckFooterHtml(c, true);
    startComposeAckTimer();
  } else {
    a.innerHTML = "";
  }
}

function startComposeAckTimer() {
  if (composeAckTimer) { clearInterval(composeAckTimer); composeAckTimer = null; }
  const ids = ["ackDays", "ackHrs", "ackMin", "ackSec"];
  const tick = function () {
    const days = document.getElementById("ackDays");
    if (!days) { if (composeAckTimer) { clearInterval(composeAckTimer); composeAckTimer = null; } return; }
    const c = S.compose;
    const note = document.getElementById("ackdNote");
    if (!c.deadline) { ids.forEach(function (id) { const e = document.getElementById(id); if (e) e.textContent = "—"; }); return; }
    const diff = new Date(c.deadline).getTime() - Date.now();
    if (isNaN(diff)) return;
    if (diff <= 0) {
      ids.forEach(function (id) { const e = document.getElementById(id); if (e) { e.textContent = "00"; e.classList.add("text-danger"); } });
      if (note) { note.textContent = "The acceptance window has closed."; note.classList.add("text-danger"); }
      return;
    }
    const dd = Math.floor(diff / 86400000), h = Math.floor((diff % 86400000) / 3600000), m = Math.floor((diff % 3600000) / 60000), s = Math.floor((diff % 60000) / 1000);
    const set = function (id, v) { const e = document.getElementById(id); if (e) e.textContent = pad2(v); };
    set("ackDays", dd); set("ackHrs", h); set("ackMin", m); set("ackSec", s);
    if (note) { note.classList.toggle("text-danger", diff < 86400000); note.classList.toggle("text-warning", diff >= 86400000); }
  };
  tick();
  composeAckTimer = setInterval(tick, 1000);
}

/* ---- full preview modal ---- */
function composeTogglePreviewExpired() { S.previewExpired = !S.previewExpired; composeOpenFullPreview(); }
function composeOpenFullPreview() {
  const c = S.compose;
  if (!c.channels.length) { toast("Select at least one channel to preview", "warn"); return; }
  openModal(composeFullPreviewTitleHtml(c), composeFullPreviewBodyHtml(c),
    '<button class="btn btn-success" onclick="composePreviewSend()">Looks good — schedule &amp; send</button>',
    { wide: true });
}
function composePreviewSend() { composeSend(); }

/* ---- validation ---- */
function composeTitle(c) { return (isCollectType(c.type) ? c.collectHeading : "") || c.appHeading || c.webHeading || c.emailSubject || ""; }
function validateCompose() {
  composeSyncEmailBodyFromEditor();
  const c = S.compose;
  if (!c.roles.length) { toast("Select a role", "err"); return false; }
  if (!c.prio) { toast("Select a priority", "err"); return false; }
  if (c.type === "other" && !c.otherType.trim()) { toast('Please specify what "Other" is', "err"); return false; }
  if (!c.channels.length) { toast("Select at least one channel", "err"); return false; }
  if (isCollectType(c.type)) {
    if (!c.collectHeading.trim()) { toast("Enter a pop-up heading for the information request", "err"); return false; }
    if (!c.collectFields.length) { toast("Add at least one field to collect", "err"); return false; }
    if (c.channels.includes("whatsapp") && !c.waTemplate) { toast("Choose a WhatsApp event", "err"); return false; }
  } else {
    if (c.channels.includes("inapp") && (!c.appHeading.trim() || !c.appPush.trim() || !c.appBody.trim())) { toast("In-app needs a heading, push text and message", "err"); return false; }
    if (c.channels.includes("website") && (!c.webHeading.trim() || !c.webBody.trim())) { toast("Website needs a heading and message", "err"); return false; }
    if (c.channels.includes("email") && (!c.emailSubject.trim() || noticeHtmlIsBlank(c.emailBody))) { toast("Email needs a subject and message", "err"); return false; }
    if (c.channels.includes("whatsapp") && !c.waTemplate) { toast("Choose a WhatsApp event", "err"); return false; }
    const bad = unknownVars(composeVarsAllText());
    if (bad.length) { toast("Unknown merge field: {{" + bad[0] + "}} — fix or remove it", "err"); return false; }
  }
  if (composeAckOverrideEnabled()) {
    if (c.ack && !c.declaration.trim()) { toast("Declaration text is required for acknowledgment", "err"); return false; }
    if (c.ack && c.deadline && new Date(c.deadline).getTime() <= Date.now()) { toast("Acknowledgment deadline must be in the future", "err"); return false; }
  }
  if (!c.schedDate) { toast("Set a delivery date and time", "err"); return false; }
  if (new Date(c.schedDate).getTime() <= Date.now()) { toast("Scheduled time must be in the future", "err"); return false; }
  if ((c.prio === "normal" || c.prio === "info") && c.quietMode === "firstX" && (!c.quietX || c.quietX < 1)) { toast("Enter a valid X (hours) for the quiet-hours release", "err"); return false; }
  return true;
}

/* ---- save / send ---- */
function composeWhenLabel(c, status) {
  if (status === "draft") return "—";
  const when = c.schedDate ? c.schedDate.replace("T", " ") : "time TBD";
  if (c.prio === "high" || c.prio === "critical") return when + " (recipient local)";
  const q = c.quietMode === "firstX" ? "first " + c.quietX + " hrs of active window" : "first hour of active window";
  return when + " · quiet hrs → " + q;
}

function composeBuildChannelContent(c) {
  const list = [];
  if (c.channels.includes("inapp")) list.push({ channel: "inapp", heading: c.appHeading, pushText: c.appPush, body: c.appBody });
  if (c.channels.includes("website")) list.push({ channel: "website", heading: c.webHeading, body: c.webBody });
  if (c.channels.includes("email")) list.push({ channel: "email", emailSubject: c.emailSubject, body: c.emailBody, footerEmails: c.footerEmails, footerWebsite: c.footerWebsite });
  if (c.channels.includes("whatsapp")) list.push({ channel: "whatsapp", waTemplateRef: c.waTemplate });
  return list;
}

function composeBuildCollectChannelContent(c) {
  const list = [];
  if (c.channels.includes("inapp")) list.push({ channel: "inapp", heading: c.collectHeading, pushText: c.collectHeading, body: c.collectHeading });
  if (c.channels.includes("website")) list.push({ channel: "website", heading: c.collectHeading, body: c.collectHeading });
  if (c.channels.includes("email")) list.push({ channel: "email", emailSubject: c.collectHeading, body: c.collectHeading });
  if (c.channels.includes("whatsapp")) list.push({ channel: "whatsapp", waTemplateRef: c.waTemplate });
  return list;
}

function composeBuildSaveRequest(status) {
  const c = S.compose;
  const collect = isCollectType(c.type);
  return {
    id: c.editId,
    typeId: c.type === "other" ? null : parseInt(c.type, 10),
    otherTypeName: c.type === "other" ? c.otherType : null,
    priority: c.prio,
    status: status,
    commonMode: composeCommonModeEnabled() && c.commonMode,
    roleIds: c.roles.join(",") || null,
    registrationType: c.registrationTypes.join(",") || null,
    session: c.sessions.join(",") || null,
    grade: c.grades.join(",") || null,
    batch: c.batches.join(",") || null,
    course: c.courses.join(",") || null,
    country: c.countries.join(",") || null,
    enrollmentStatus: c.enrollStatuses.join(",") || null,
    profileStatus: c.profile || null,
    recipientUserIds: c.users.map(function (u) { return u.id; }),
    channels: c.channels.slice(),
    channelContent: collect ? composeBuildCollectChannelContent(c) : composeBuildChannelContent(c),
    attachment: c.attachment ? { fileName: c.attachment, storageKey: c.attachmentStorageKey || null, mode: composeAttachmentEmbeddedEnabled() ? c.attachMode : "attached" } : null,
    schedule: c.schedDate ? { sendAt: c.schedDate, timeReference: c.timeRef, timezoneId: (c.timeRef === "fixed" && c.schedTZ) ? parseInt(c.schedTZ, 10) : null, quietReleaseMode: c.quietMode, quietReleaseX: c.quietX } : null,
    ackEnabled: composeAckOverrideEnabled() && !!c.ack,
    ack: composeAckOverrideEnabled() && c.ack ? { style: c.ackMode, declarationText: c.declaration, enforcement: c.enforce, softToHardCount: c.softToHard, deadlineAt: c.deadline || null, declineOutcome: c.declineOutcome } : null,
    collectFields: collect ? c.collectFields.map(function (f) {
      return { source: f.source, profileSection: f.section, fieldType: f.ftype, label: f.label, options: (f.options && f.options.length) ? f.options.join(",") : null, mandatory: f.mandatory ? "Y" : "N", existingFieldRef: f.existingFieldRef };
    }) : [],
    collectHeading: collect ? c.collectHeading : null,
    overrideEnabled: composeAckOverrideEnabled() && c.override,
    overrideRoles: composeAckOverrideEnabled() && c.ovrRoles.length ? c.ovrRoles.join(",") : null,
    overrideUsers: composeAckOverrideEnabled() ? (c.ovrUsers || null) : null
  };
}

function composeSubmitSave(status, onSuccess) {
  const c = S.compose;
  if (c.attachmentUploading) {
    toast("Please wait for the attachment to finish uploading.", "warn");
    return;
  }
  if (c.type === "other") {
    const nt = c.otherType.trim();
    saveNewNoticeType(nt, function (newType) {
      TYPES.splice(TYPES.length - 1, 0, newType);
      c.type = newType.id;
      composeSendSaveRequest(status, onSuccess);
    });
    return;
  }
  composeSendSaveRequest(status, onSuccess);
}

function composeSendSaveRequest(status, onSuccess) {
  const request = composeBuildSaveRequest(status);
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLForNotice("compose/save"),
    data: JSON.stringify(request),
    dataType: "json",
    success: function (saved) {
      S.compose.editId = null;
      if (onSuccess) onSuccess(saved);
    },
    error: function (xhr) {
      const msg = (xhr.responseJSON && xhr.responseJSON.message) ? xhr.responseJSON.message : "Could not save the notice.";
      toast(msg, "err");
    }
  });
}

function newCompose() { S.compose = blankCompose(); }

function composeApplyLoadedNotice(n) {
  const c = S.compose = blankCompose();
  c.editId = n.id;
  c.roles = n.roleIds ? n.roleIds.split(",").filter(Boolean) : [];
  c.registrationTypes = n.registrationType
    ? n.registrationType.split(",").map(function (s) { return s.trim(); }).filter(Boolean)
    : [];
  c.sessions = n.session ? n.session.split(",").filter(Boolean) : [];
  c.grades = n.grade ? n.grade.split(",").filter(Boolean) : [];
  c.batches = n.batch ? n.batch.split(",").filter(Boolean) : [];
  c.courses = n.course ? n.course.split(",").filter(Boolean) : [];
  c.countries = n.country ? n.country.split(",").filter(Boolean) : [];
  c.enrollStatuses = n.enrollmentStatus ? n.enrollmentStatus.split(",").filter(Boolean) : [];
  c.profile = n.profileStatus || "";
  c.users = (n.recipients || []).map(function (u) { return { id: u.userId, fullName: u.fullName }; });
  c.type = n.typeId ? String(n.typeId) : (TYPES.length ? TYPES[0].id : "");
  c.otherType = "";
  c.prio = n.priority || "normal";
  c.commonMode = composeCommonModeEnabled() && n.commonMode === "Y";

  const content = n.channelContent || [];
  c.channels = content.map(function (x) { return x.channel; });
  if (!c.channels.length) c.channels = ["email"];
  const inapp = content.find(function (x) { return x.channel === "inapp"; });
  const website = content.find(function (x) { return x.channel === "website"; });
  const email = content.find(function (x) { return x.channel === "email"; });
  const whatsapp = content.find(function (x) { return x.channel === "whatsapp"; });
  c.appHeading = (inapp && inapp.heading) || "";
  c.appPush = (inapp && inapp.pushText) || "";
  c.appBody = (inapp && inapp.body) || "";
  c.webHeading = (website && website.heading) || "";
  c.webBody = (website && website.body) || "";
  c.emailSubject = (email && email.emailSubject) || "";
  c.emailBody = (email && email.body) || "";
  c.footerEmails = (email && email.footerEmails) || c.footerEmails;
  c.footerWebsite = (email && email.footerWebsite) || c.footerWebsite;
  c.waTemplate = (whatsapp && whatsapp.waTemplateRef) || "";

  const att = n.attachment;
  c.attachment = (att && att.fileName) || "";
  c.attachmentStorageKey = (att && att.storageKey) || "";
  c.attachMode = (att && att.mode) ? att.mode.toLowerCase() : "attached";

  const sched = n.schedule;
  c.schedDate = (sched && sched.sendAt)
    ? noticeUtcToScheduleInput(sched.sendAt, sched.timeReference, sched.timezoneId)
    : "";
  c.timeRef = (sched && sched.timeReference) || "local";
  c.schedTZ = (sched && sched.timezoneId != null) ? String(sched.timezoneId) : "";
  c.quietMode = (sched && sched.quietReleaseMode) || "first1";
  c.quietX = (sched && sched.quietReleaseX != null) ? sched.quietReleaseX : 2;

  const ack = n.ack;
  c.ack = !!ack;
  c.ackMode = (ack && ack.style) || "timed";
  c.enforce = (ack && ack.enforcement) || "soft";
  c.declaration = (ack && ack.declarationText) || "";
  c.softToHard = (ack && ack.softToHardCount != null) ? ack.softToHardCount : 3;
  c.deadline = (ack && ack.deadlineAt) ? noticeUtcToScheduleInput(ack.deadlineAt, "local", null) : "";
  c.declineOutcome = (ack && ack.declineOutcome) || "unblock-flag";

  c.collectFields = (n.collectFields || []).map(function (f) {
    return { source: f.source, section: f.profileSection, ftype: f.fieldType, label: f.label, options: f.options ? f.options.split(",").map(function (s) { return s.trim(); }).filter(Boolean) : [], mandatory: f.mandatory === "Y", existingFieldRef: f.existingFieldRef };
  });
  c.collectHeading = n.collectHeading || "";

  c.override = n.overrideEnabled === "Y";
  c.ovrRoles = n.overrideRoles ? n.overrideRoles.split(",").filter(Boolean) : [];
  c.ovrUsers = n.overrideUsers || "";
  if (!composeAckOverrideEnabled()) {
    c.ack = false;
    c.override = false;
    c.ovrRoles = [];
    c.ovrUsers = "";
  }
}

function fetchAndApplyComposeNotice(id) {
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLForNotice("compose/get-detail"),
    data: JSON.stringify({ id: id }),
    dataType: "json",
    success: function (n) {
      composeApplyLoadedNotice(n);
      const c = S.compose;
      const finish = function () {
        renderCompose();
        toast("Editing notice #" + id, "ok");
      };
      if (c.grades.length) {
        loadComposeBatches(c.grades.join(","), function () {
          loadComposeCourses(c.grades.join(","), c.batches.join(","), finish);
        });
      } else {
        finish();
      }
    },
    error: function () {
      toast("Could not load the notice.", "err");
    }
  });
}

function loadComposeNotice(id) {
  renderNoticeComposeContent(id);
}

function composeSaveDraft() {
  if (!composeTitle(S.compose)) { toast("Add a heading or subject before saving", "err"); return; }
  composeSubmitSave("DRAFT", function () {
    toast("Saved to Drafts", "ok");
    renderNoticeWorkspaceContent();
  });
}
/* alias matching the requested naming */
function saveCompose() { composeSaveDraft(); }

function composeCommitSend() {
  const editing = !!S.compose.editId;
  composeSubmitSave("SCHEDULED", function () {
    closeModal();
    toast(editing ? "Notice updated" : "Notice scheduled", "ok");
    renderNoticeWorkspaceContent();
  });
}

function composeEstimateReach(c) {
  if (c.users.length) return c.users.length;
  return c.roles.reduce(function (total, roleId) {
    const r = ROLES.find(function (x) { return x.id === roleId; });
    if (!r) return total;
    let n = r.count;
    if (c.countries.length) n = Math.round(n * 0.13);
    if (c.grades.length && r.fields && r.fields.grade) n = Math.round(n * 0.09);
    else if (c.grades.length && (r.name || "").toUpperCase() === "PARENT") n = Math.round(n * 0.11);
    return total + n;
  }, 0);
}

function composePreSendChecks(c) {
  const blocks = [], warns = [];
  const interactive = c.channels.some(function (ch) { return ["inapp", "website", "email"].includes(ch); });
  const reach = composeEstimateReach(c);
  if (composeAckOverrideEnabled()) {
    if (c.ack && !interactive) blocks.push("Acknowledgment requires an interactive channel (In-app, Website or Email). WhatsApp can't capture a declaration.");
    if (c.ack && c.enforce === "hard" && typeCat(c.type) === "emergency") blocks.push("An emergency notice can't be a hard blocker — recipients must see it immediately. Use Soft, or drop acknowledgment.");
    if (c.override && !c.ovrRoles.length && !c.ovrUsers.trim()) warns.push("Preference override is ON but no roles or users are selected — it will have no effect.");
    if (c.prio === "critical" && !c.override) warns.push("This is Critical but no preference override is set on the notice. Per-user exceptions in Override Configuration won't apply unless enabled here.");
  }
  if (reach >= MASS_SEND_THRESHOLD) warns.push("This will reach approximately " + fmt(reach) + " recipients. Please confirm this broad send.");
  if (APPROVAL_REQUIRED_ROLES.includes(USER_ROLE) && reach >= MASS_SEND_THRESHOLD) warns.push("As " + USER_ROLE + ", a send this large is routed for approval before dispatch.");
  return { blocks: blocks, warns: warns, reach: reach };
}

function composeSend() {
  if (!validateCompose()) return;
  const c = S.compose;
  const checks = composePreSendChecks(c);
  if (checks.blocks.length) {
    openModal("Can't send yet", composeBlocksModalBodyHtml(checks.blocks), '<button class="btn btn-light" onclick="closeModal()">Back</button>');
    return;
  }
  const paid = c.channels.includes("whatsapp");
  const needsReview = checks.warns.length || paid;
  if (!needsReview) { composeCommitSend(); return; }
  const approval = APPROVAL_REQUIRED_ROLES.includes(USER_ROLE) && checks.reach >= MASS_SEND_THRESHOLD;
  const confirmLabel = approval ? "Submit for approval" : "Confirm &amp; schedule";
  openModal("Review before sending", composeReviewModalBodyHtml(c, checks.warns, paid, checks.reach),
    '<button class="btn btn-light" onclick="closeModal()">Cancel</button>' +
    '<button class="btn ' + (approval ? "btn-warning" : "btn-success") + '" onclick="composeConfirmSend(event)" data-approval="' + (approval ? 1 : 0) + '">' + confirmLabel + "</button>");
}

function composeConfirmSend(e) {
  if (e.currentTarget.dataset.approval === "1") composeSubmitForApproval();
  else composeCommitSend();
}

function composeSubmitForApproval() {
  composeSubmitSave("PENDING_APPROVAL", function () {
    closeModal();
    toast("Submitted for approval", "ok");
    renderNoticeWorkspaceContent();
  });
}

function composeConfirmReset() {
  openModal("Reset the form?", composeResetModalBodyHtml(S.compose),
    '<button class="btn btn-light" onclick="closeModal()">Keep editing</button>' +
    '<button class="btn btn-danger" onclick="composeDoReset()">Reset form</button>');
}
function composeDoReset() { closeModal(); resetCompose(); }
function resetCompose() { S.compose = blankCompose(); renderCompose(); toast("Form reset", "warn"); }
