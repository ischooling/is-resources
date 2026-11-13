/* =========================================================
   noticeComposeContent.js
   HTML generation for the Compose view: the seven-section form,
   the live recipient preview, and every compose modal body.
   Plain string-returning functions. They read S for rendering but
   never mutate state or bind events.
   ========================================================= */

/* ---- generic message field builders ---- */

function loadComposePageData(callback) {
  loadNoticeRoles(function () {
    loadNoticeTypes(function () {
      loadExistingFields(function () {
        loadComposeTemplates(function () {
          loadWhatsAppEvents(function () {
          loadComposeSessions(function () {
            loadComposeGrades(function () {
              loadComposeCountries(function () {
                loadComposeTimezones(callback);
              });
            });
          });
          });
        });
      });
    });
  });
}

function renderNoticeComposeContent(editId) {
  loadComposePageData(function () {
    if (editId) {
      fetchAndApplyComposeNotice(editId);
    } else {
      newCompose();
      renderCompose();
    }
  });
}

function composeFieldInputHtml(id, label, val, ph, attrs) {
  return `<div class="form-group"><label>${label}</label>
    <input type="text" class="form-control" id="${id}" value="${esc(val)}" placeholder="${esc(ph)}" ${inlineAttrs(attrs)}></div>`;
}
function composeFieldAreaHtml(id, label, val, ph, attrs) {
  return `<div class="form-group"><label>${label}</label>
    <textarea class="form-control" id="${id}" rows="3" placeholder="${esc(ph)}" ${inlineAttrs(attrs)}>${esc(val)}</textarea></div>`;
}
function composeFieldHtmlBodyHtml(id, label, ph, attrs) {
  return `<div class="form-group"><label>${label}</label>
    <textarea class="form-control" id="${id}" rows="4" placeholder="${esc(ph)}" ${inlineAttrs(attrs)}></textarea></div>`;
}
function composeEmailFooterHtml(c) {
  return `<div class="form-row">
    <div class="form-group col-md-6"><label>Footer — contact emails</label>
      <input type="text" class="form-control" value="${esc(c.footerEmails)}" placeholder="support@school.edu" oninput="composeField(event)" ${dataAttrs({ k: "footerEmails", after: "preview" })}></div>
    <div class="form-group col-md-6"><label>Footer — website</label>
      <input type="text" class="form-control" value="${esc(c.footerWebsite)}" placeholder="www.school.edu" oninput="composeField(event)" ${dataAttrs({ k: "footerWebsite", after: "preview" })}></div>
  </div>`;
}

function composeChannelBlockHtml(headEmoji, headTitle, tag, inner) {
  return `<div class="border rounded p-3 mb-3">
    <div class="font-weight-bold mb-2">${headEmoji} ${headTitle} <span class="badge badge-light">${tag}</span></div>
    ${inner}</div>`;
}

function composeWaBlockHtml(c) {
  if (!c.channels.includes("whatsapp")) return "";
  const t = WA_TEMPLATES.find(function (x) { return x.id === c.waTemplate; });
  const saved = c.waTemplate && !t ? `<option value="${esc(c.waTemplate)}" selected>${esc(c.waTemplate)} (saved event)</option>` : "";
  const sel = `<div class="form-group"><label>WhatsApp event <span class="text-danger">*</span> <span class="text-muted small">— each event sends its mapped Gupshup template</span></label>
    <select class="form-control" onchange="composeField(event)" ${dataAttrs({ k: "waTemplate", after: "msg" })}><option value="">— choose an event —</option>${saved}${WA_TEMPLATES.map(function (x) { return `<option value="${esc(x.id)}" ${c.waTemplate === x.id ? "selected" : ""}>${esc(x.name)}</option>`; }).join("")}</select></div>`;
  const prev = t ? `<div class="form-group mb-0"><label>Template preview <span class="text-muted small">— variables fill from sample values below</span></label><div class="border rounded bg-light p-2">${composeResolveText(t.body)}</div></div>` : "";
  return composeChannelBlockHtml("&#128172;", "WhatsApp", "Gupshup · template-based", sel + prev);
}

function composeCommonBlocksHtml(c) {
  let h = "";
  const textChans = ["inapp", "website", "email"].filter(function (id) { return c.channels.includes(id); });
  if (textChans.length) {
    let inner = composeFieldInputHtml("commonHeading", 'Notice heading / email subject <span class="text-danger">*</span>', c.appHeading || c.webHeading || c.emailSubject || "", "Shown as the heading, and used as the email subject", { input: "composeSetCommon", k: "heading", focusin: "composeSetActiveField" })
      + composeFieldAreaHtml("commonBody", 'Message <span class="text-danger">*</span> <span class="text-muted small">— use {{variables}}</span>', c.appBody || c.webBody || c.emailBody || "", "Full message shared across channels…", { input: "composeSetCommon", k: "body", focusin: "composeSetActiveField" });
    if (c.channels.includes("inapp"))
      inner += composeFieldAreaHtml("appPush", 'Push notification text <span class="text-danger">*</span> <span class="text-muted small">— In-app only</span>', c.appPush, "Lock-screen alert", { input: "composeField", k: "appPush", after: "msg", focusin: "composeSetActiveField" });
    if (c.channels.includes("email"))
      inner += composeEmailFooterHtml(c);
    h += composeChannelBlockHtml("&#9878;", "Shared message", textChans.map(channelName).join(" · "), inner);
  }
  return h + composeWaBlockHtml(c);
}

function composePerChannelBlocksHtml(c) {
  let h = "";
  if (c.channels.includes("inapp")) {
    h += composeChannelBlockHtml("&#128241;", "In-app", "pop-up + notice section",
      composeFieldInputHtml("appHeading", 'Notice heading <span class="text-danger">*</span>', c.appHeading, "Short title shown in the app", { input: "composeField", k: "appHeading", after: "msg", focusin: "composeSetActiveField" })
      + composeFieldAreaHtml("appPush", 'Push notification text <span class="text-danger">*</span> <span class="text-muted small">— lock-screen alert</span>', c.appPush, "e.g. Your fee is due in 7 days", { input: "composeField", k: "appPush", after: "msg", focusin: "composeSetActiveField" })
      + composeFieldAreaHtml("appBody", 'Message <span class="text-danger">*</span> <span class="text-muted small">— use {{variables}}</span>', c.appBody, "Full message shown in the app…", { input: "composeField", k: "appBody", after: "msg", focusin: "composeSetActiveField" }));
  }
  if (c.channels.includes("website")) {
    h += composeChannelBlockHtml("&#127760;", "Website", "pop-up + notice section",
      composeFieldInputHtml("webHeading", 'Notice heading <span class="text-danger">*</span>', c.webHeading, "Short title shown on the site", { input: "composeField", k: "webHeading", after: "msg", focusin: "composeSetActiveField" })
      + composeFieldAreaHtml("webBody", 'Message <span class="text-danger">*</span> <span class="text-muted small">— use {{variables}}</span>', c.webBody, "Full message shown on the site…", { input: "composeField", k: "webBody", after: "msg", focusin: "composeSetActiveField" }));
  }
  if (c.channels.includes("email")) {
    h += composeChannelBlockHtml("&#9993;", "Email", "sent to inbox",
      composeFieldInputHtml("emailSubject", 'Email subject <span class="text-danger">*</span>', c.emailSubject, "e.g. Fee payment is due in 7 days", { input: "composeField", k: "emailSubject", after: "msg", focusin: "composeSetActiveField" })
      + composeFieldHtmlBodyHtml("emailBody", 'Message <span class="text-danger">*</span> <span class="text-muted small">— use {{variables}}</span>', "Email body…", { focusin: "composeSetActiveField" })
      + composeEmailFooterHtml(c));
  }
  return h + composeWaBlockHtml(c);
}

function composeChannelBlocksHtml(c) {
  return c.commonMode ? composeCommonBlocksHtml(c) : composePerChannelBlocksHtml(c);
}

function composeSchedulingHtml(c) {
  if (c.prio === "high" || c.prio === "critical") {
    return `<div class="alert alert-info">&#9203; ${PRIO[c.prio].l} notices need an exact delivery time — they reach recipients immediately at that moment.</div>
      <div class="form-row">
        <div class="form-group col-md-6"><label>Send at (date &amp; time) <span class="text-danger">*</span></label>
          <input type="datetime-local" class="form-control" style="-webkit-appearance:auto;" value="${esc(c.schedDate)}" onchange="composeField(event)" ${dataAttrs({ k: "schedDate", after: "sched" })}></div>
        <div class="form-group col-md-6"><label>Time reference</label>
          <select class="form-control" onchange="composeSetTimeRef(event)">
            <option value="local" ${c.timeRef === "local" ? "selected" : ""}>Each recipient's local time</option>
            <option value="fixed" ${c.timeRef === "fixed" ? "selected" : ""}>A single fixed moment (choose timezone)</option>
          </select></div>
        <div class="form-group col-md-6 ${c.timeRef === "fixed" ? "" : "d-none"}" id="tzField"><label>Timezone</label>
          <select class="form-control" onchange="composeField(event)" ${dataAttrs({ k: "schedTZ", after: "sched" })}>${TIMEZONE_OPTIONS.map(function (tz) { return `<option value="${tz.key}" ${c.schedTZ === tz.key ? "selected" : ""}>${esc(tz.value)}</option>`; }).join("")}</select></div>
      </div>
      <div class="text-muted small" id="schedHelp"></div>`;
  }
  return `<div class="text-muted small mb-3">${PRIO[c.prio].l} notices respect each recipient's quiet hours. Set a specific time for people who have <b>no</b> quiet hours, and a release rule for people who <b>do</b>.</div>
    <div class="form-row">
      <div class="form-group col-md-6"><label>Specific time <span class="text-muted small">— recipients without quiet hours</span> <span class="text-danger">*</span></label>
        <input type="datetime-local" class="form-control" style="-webkit-appearance:auto;" value="${esc(c.schedDate)}" onchange="composeField(event)" ${dataAttrs({ k: "schedDate", after: "sched" })}></div>
      <div class="form-group col-md-6"><label>Time reference</label>
        <select class="form-control" onchange="composeSetTimeRef(event)">
          <option value="local" ${c.timeRef === "local" ? "selected" : ""}>${c.schedTime || "9:00"} in each recipient's local time</option>
          <option value="fixed" ${c.timeRef === "fixed" ? "selected" : ""}>A single fixed moment (choose timezone)</option>
        </select></div>
      <div class="form-group col-md-6 ${c.timeRef === "fixed" ? "" : "d-none"}" id="tzField"><label>Timezone</label>
        <select class="form-control" onchange="composeField(event)" ${dataAttrs({ k: "schedTZ", after: "sched" })}>${TIMEZONE_OPTIONS.map(function (tz) { return `<option value="${tz.key}" ${c.schedTZ === tz.key ? "selected" : ""}>${esc(tz.value)}</option>`; }).join("")}</select></div>
    </div>
    <div class="form-row">
      <div class="form-group col-md-6"><label>Recipients with quiet hours</label>
        <select class="form-control" onchange="composeField(event)" ${dataAttrs({ k: "quietMode", after: "sched" })}>
          <option value="first1" ${c.quietMode === "first1" ? "selected" : ""}>Within the first hour of their active window</option>
          <option value="firstX" ${c.quietMode === "firstX" ? "selected" : ""}>Within the first X hours of their active window</option>
        </select></div>
      <div class="form-group col-md-6 ${c.quietMode === "firstX" ? "" : "d-none"}" id="quietXField"><label>X (hours)</label>
        <input type="number" min="1" max="12" class="form-control" value="${c.quietX}" oninput="composeField(event)" ${dataAttrs({ k: "quietX", num: 1, after: "sched" })}></div>
    </div>
    <div class="text-muted small" id="schedHelp"></div>`;
}

function composeCollectFieldInputHtml(f) {
  if (f.ftype === "text") return `<input type="text" class="form-control" placeholder="Enter ${esc(f.label).toLowerCase()}">`;
  if (f.ftype === "date") return `<input type="date" class="form-control" style="-webkit-appearance:auto;">`;
  if (f.ftype === "dropdown") return `<select class="form-control"><option value="">— select —</option>${(f.options || []).map(function (o) { return `<option>${esc(o)}</option>`; }).join("")}</select>`;
  if (f.ftype === "file") return `<div class="d-flex align-items-center"><button type="button" class="btn btn-light btn-sm mr-2">&#128206; Choose file</button><span class="text-muted small">No file chosen</span></div>`;
  return "";
}

function composeCollectConfigHtml(c) {
  const dr = c.collectDraft;
  const addForm = dr.source === "existing"
    ? `<div class="form-group"><label>Existing profile field</label>
         <select class="form-control" onchange="composeCollectDraftSet(event)" ${dataAttrs({ k: "existing" })}>
           <option value="">— select a field —</option>
           ${EXISTING_FIELDS.map(function (f) { return `<option value="${f.id}" ${dr.existing === f.id ? "selected" : ""}>${esc(f.label)} — ${ftypeName(f.ftype)} · ${esc(f.section)}</option>`; }).join("")}
         </select></div>`
    : `<div class="form-row">
         <div class="form-group col-md-6"><label>Profile section</label>
           <select class="form-control" onchange="composeCollectDraftSet(event)" ${dataAttrs({ k: "section" })}>${PROFILE_SECTIONS.map(function (s) { return `<option ${dr.section === s ? "selected" : ""}>${esc(s)}</option>`; }).join("")}</select></div>
         <div class="form-group col-md-6"><label>Field type</label>
           <select class="form-control" onchange="composeCollectDraftSet(event)" ${dataAttrs({ k: "ftype" })}>${FIELD_TYPES.map(function (f) { return `<option value="${f[0]}" ${dr.ftype === f[0] ? "selected" : ""}>${f[1]}</option>`; }).join("")}</select></div>
         <div class="form-group col-12"><label>Label name</label>
           <input type="text" class="form-control" value="${esc(dr.label)}" placeholder="e.g. Emergency contact number" oninput="composeCollectLabel(event)"></div>
         ${dr.ftype === "dropdown" ? `<div class="form-group col-12"><label>Dropdown options <span class="text-muted small">— comma-separated</span></label>
           <input type="text" class="form-control" value="${esc(dr.options)}" placeholder="e.g. Yes, No, Maybe" oninput="composeCollectOptions(event)"></div>` : ""}
       </div>`;

  const list = c.collectFields.length
    ? `<h6>Fields to collect (${c.collectFields.length})</h6>
       <div class="table-responsive"><table class="table table-sm table-hover">
         <thead><tr><th>Label</th><th>Type</th><th>Section</th><th>Source</th><th>Required</th><th></th></tr></thead>
         <tbody>${c.collectFields.map(function (f, i) {
           return `<tr><td><b>${esc(f.label)}</b></td><td>${ftypeName(f.ftype)}</td><td>${esc(f.section)}</td>
             <td><span class="badge badge-${f.source === "existing" ? "success" : "info"}">${f.source === "existing" ? "Existing" : "New"}</span></td>
             <td>${f.mandatory ? '<span class="badge badge-danger">Mandatory</span>' : '<span class="text-muted">Optional</span>'}</td>
             <td><button class="btn btn-light btn-sm" onclick="composeRemoveCollectField(event)" ${dataAttrs({ i: i })}>Remove</button></td></tr>`;
         }).join("")}</tbody>
       </table></div>`
    : '<div class="alert alert-info mb-0">&#8505; No fields added yet. Configure a field above and click <b>Add field</b>.</div>';

  return `<div class="mb-2">
      ${chipButton("Add a new field", dr.source === "new", { click: "composeCollectSource", v: "new" })}
      ${chipButton("Use an existing field", dr.source === "existing", { click: "composeCollectSource", v: "existing" })}
    </div>
    ${addForm}
    <div class="alert alert-warning">&#9888; Before adding a new field, make sure a similar one doesn't already exist — duplicates cause data inconsistency.</div>
    <div class="form-row align-items-end">
      <div class="form-group col-md-4"><label>Requirement</label>
        <select class="form-control" onchange="composeCollectMandatory(event)"><option value="1" ${dr.mandatory ? "selected" : ""}>Mandatory</option><option value="0" ${!dr.mandatory ? "selected" : ""}>Non-mandatory</option></select></div>
      <div class="form-group col-md-4"><button class="btn btn-primary btn-sm" type="button" onclick="composeAddCollectField(event)">&#43; Add field</button></div>
    </div>
    <div class="mt-2">${list}</div>
    <div class="form-row mt-3">
      <div class="form-group col-md-6"><label>Skip enforcement</label><div>
        ${chipButton("Soft — can skip", c.collectEnforce === "soft", { click: "composeFieldClick", k: "collectEnforce", v: "soft", after: "compose" })}
        ${chipButton("Hard — blocking", c.collectEnforce === "hard", { click: "composeFieldClick", k: "collectEnforce", v: "hard", after: "compose" })}
      </div></div>
      <div class="form-group col-md-6 ${c.collectEnforce === "soft" ? "" : "d-none"}"><label>Convert to hard after</label>
        <input type="number" min="0" class="form-control" value="${c.collectSoftToHard}" oninput="composeField(event)" ${dataAttrs({ k: "collectSoftToHard", num: 1 })}> <span class="text-muted small">skips (0 = stays soft)</span></div>
    </div>`;
}

/* ---- preview / merge-field resolution ---- */
function composeResolveText(text) {
  return esc(text).replace(/\n/g, "<br>").replace(/\{\{(\w+)\}\}/g, function (m, v) {
    const s = composeMergeSampleValue(v);
    return s
      ? `<span class="badge badge-success font-weight-normal">${esc(s)}</span>`
      : `<span class="badge badge-warning font-weight-normal">${v}</span>`;
  });
}
function composeResolveHtml(html) {
  return String(html || "").replace(/\{\{(\w+)\}\}/g, function (m, v) {
    const s = composeMergeSampleValue(v);
    return s
      ? `<span class="badge badge-success font-weight-normal">${esc(s)}</span>`
      : `<span class="badge badge-warning font-weight-normal">${v}</span>`;
  });
}
function composeFormatMessageBody(body, forEmail) {
  if (!body) return "";
  if (forEmail && noticeLooksLikeHtml(body)) {
    return `<div class="mt-2 small notice-email-html-preview">${composeResolveHtml(body)}</div>`;
  }
  return `<div class="mt-2 small">${composeResolveText(body)}</div>`;
}

function composeAttachChipHtml(c, prim) {
  const view = c.attachmentStorageKey
    ? `<a href="#" class="text-primary" onclick="composeOpenAttachmentPreview(); return false;">&#128065; Preview</a>`
    : "<span class=\"text-muted\">&#128065; View</span>";
  if (c.attachMode === "embedded" && prim === "website")
    return `<div class="border rounded bg-light p-2 mt-2 small">&#128196; ${esc(c.attachment)} ${view} <span class="text-muted">(embedded)</span></div>`;
  return `<div class="border rounded bg-light p-2 mt-2 small d-inline-block">${view} · ${esc(c.attachment)}</div>`;
}

function composeAttachPreviewHtml(c, forWeb) {
  if (!c.attachment) return "";
  const viewBtn = c.attachmentStorageKey
    ? `<button type="button" class="btn btn-sm btn-outline-primary" onclick="composeOpenAttachmentPreview()">&#128065; Preview attachment</button>`
    : `<span class="badge badge-secondary">&#128065; View</span>`;
  if (c.attachMode === "embedded" && forWeb)
    return `<div class="border rounded bg-light p-3 mt-2 small">&#128196; ${esc(c.attachment)} ${viewBtn} <span class="text-muted">— embedded inline</span></div>`;
  return `<div class="mt-2">${viewBtn}<div class="text-muted small mt-1">${esc(c.attachment)}</div></div>`;
}

function composePreviewNotifHtml(c) {
  const prim = ["inapp", "website", "email", "whatsapp"].find(function (ch) { return c.channels.includes(ch); });
  let heading = "Notice heading", body = "Your message preview appears here.";
  if (isCollectType(c.type)) { heading = c.collectHeading || "Information required"; body = ""; }
  else if (prim === "inapp") { heading = c.appHeading || heading; body = c.appBody || c.appPush || body; }
  else if (prim === "website") { heading = c.webHeading || heading; body = c.webBody || body; }
  else if (prim === "email") { heading = c.emailSubject || heading; body = c.emailBody || body; }
  else if (prim === "whatsapp") { const t = WA_TEMPLATES.find(function (x) { return x.id === c.waTemplate; }); heading = t ? "WhatsApp · " + t.name : (c.waTemplate ? "WhatsApp · " + c.waTemplate : "WhatsApp event"); body = t ? t.body : "Choose a WhatsApp event."; }
  return `<div class="border rounded p-3">
    <div class="font-weight-bold">${PRIO[c.prio].d} ${esc(heading)}</div>
    ${body ? composeFormatMessageBody(body, prim === "email") : ""}
    ${!isCollectType(c.type) && c.attachment ? composeAttachChipHtml(c, prim) : ""}
    <div class="d-flex justify-content-between text-muted small mt-2"><span>${typeName(c.type)}</span><span>${prim ? channelName(prim) : ""}</span></div>
    <div class="mt-1">${c.channels.map(function (id) { const ch = channelById(id); return ch ? `<span class="mr-1">${ch.icon}</span>` : ""; }).join("")}</div>
  </div>`;
}

function composeDeadlineSnapshotHtml(dt) {
  const box = function (v, l, danger) { return `<div class="border rounded text-center px-2 py-1 mr-1 mb-1"><div class="h5 mb-0 ${danger ? "text-danger" : ""}"><b>${v}</b></div><div class="small text-muted">${l}</div></div>`; };
  if (S.previewExpired) return `<div class="d-flex flex-wrap">${box("00", "DAYS", true)}${box("00", "HRS", true)}${box("00", "MIN", true)}</div>`;
  const diff = new Date(dt).getTime() - Date.now();
  if (isNaN(diff)) return "";
  if (diff <= 0) return `<span class="text-danger font-weight-bold">Window closed</span>`;
  const dd = Math.floor(diff / 86400000), h = Math.floor((diff % 86400000) / 3600000), m = Math.floor((diff % 3600000) / 60000);
  return `<div class="d-flex flex-wrap">${box(pad2(dd), "DAYS")}${box(pad2(h), "HRS")}${box(pad2(m), "MIN")}</div>`;
}

function composeCountdownBoxesHtml(c, live) {
  if (!live) return composeDeadlineSnapshotHtml(c.deadline);
  const box = function (id, l) { return `<div class="border rounded text-center px-2 py-1 mr-1 mb-1"><div class="h5 mb-0"><b id="${id}">00</b></div><div class="small text-muted">${l}</div></div>`; };
  return `<div class="d-flex flex-wrap">${box("ackDays", "DAYS")}${box("ackHrs", "HRS")}${box("ackMin", "MIN")}${box("ackSec", "SEC")}</div>`;
}

function composeValidityPanelHtml(c, live) {
  if (!c.deadline) return "";
  const expiredNote = (!live && S.previewExpired) ? "The acceptance window has closed." : "Please review and accept before the window closes.";
  return `<div class="border rounded p-2 mt-2">
    <div class="d-flex flex-wrap justify-content-between">
      <div><div class="small text-muted">Valid till</div><div class="font-weight-bold">${fmtDeadlineDate(c.deadline)}</div></div>
      <div><div class="small text-muted">Time left to accept</div>${composeCountdownBoxesHtml(c, live)}</div>
    </div>
    <div class="small text-muted mt-1"${live ? ' id="ackdNote"' : ""}>${expiredNote}</div>
  </div>`;
}

function composeCollectFooterHtml(c) {
  if (!isCollectType(c.type) || !c.collectFields.length) return "";
  const fields = c.collectFields.map(function (f) {
    return `<div class="mt-2">
      <label class="small font-weight-bold d-block mb-1">${esc(f.label)}${f.mandatory ? ' <span class="text-danger">*</span>' : ' <span class="text-muted">(optional)</span>'}</label>
      ${composeCollectFieldInputHtml(f)}
    </div>`;
  }).join("");
  const skipBtn = c.collectEnforce === "soft" ? '<button class="btn btn-light btn-sm">Skip for now</button>' : "";
  return `<div class="border-top mt-3 pt-3">
    <div class="small font-weight-bold text-uppercase text-muted">Please provide the following</div>
    ${fields}
    <div class="d-flex flex-wrap justify-content-between align-items-center mt-3">
      <span class="text-muted small">${c.collectEnforce === "hard" ? "Required — you must submit to continue." : `You can skip${c.collectSoftToHard ? ` (mandatory after ${c.collectSoftToHard} skip(s))` : ""}.`}</span>
      <div><button class="btn btn-primary btn-sm mr-1">Submit</button>${skipBtn}</div>
    </div>
  </div>`;
}

function composeAckFooterHtml(c, live) {
  if (isCollectType(c.type)) return composeCollectFooterHtml(c);
  if (!c.ack) return "";
  const decl = esc(c.declaration || "I hereby confirm that I have read and agree to the terms.");
  if (c.ackMode === "simple") {
    const skipBtn = c.enforce === "soft" ? '<button class="btn btn-light btn-sm">Not now</button>' : "";
    return `<div class="border-top mt-3 pt-3">
      <div class="d-flex flex-wrap justify-content-between align-items-center">
        <label class="mb-0"><input type="checkbox"> ${decl}</label>
        <div><button class="btn btn-primary btn-sm mr-1">Acknowledge</button>${skipBtn}</div>
      </div>
      <div class="text-muted small mt-2">Stored as <b>Yes</b> on acknowledge${c.enforce === "soft" ? `, or <b>No</b> after ${c.softToHard || 0} skip(s)` : ""}. No deadline or timer.</div>
    </div>`;
  }
  const expired = !live && S.previewExpired;
  const btn = expired ? '<button class="btn btn-light btn-sm" disabled>Expired</button>' : '<button class="btn btn-primary btn-sm">Confirm</button>';
  return `<div class="border-top mt-3 pt-3">
    <div class="d-flex flex-wrap justify-content-between align-items-center"><label class="mb-0"><input type="checkbox" ${expired ? "disabled" : ""}> ${decl}</label>${btn}</div>
    ${composeValidityPanelHtml(c, live)}
  </div>`;
}

/* ---- small injected string helpers ---- */
/* Warnings from notice/channels/readiness: a channel that is switched off or not configured. */
function composeChannelReadinessHtml(id) {
  const r = COMPOSE_CHANNEL_READINESS.byChannel[id];
  if (!r) return "";
  let html = "";
  (r.problems || []).forEach(function (p) {
    html += `<div class="small text-danger my-1 ml-3">&#9888; ${esc(p)} Deliveries on this channel will fail until this is fixed.</div>`;
  });
  if (r.note) html += `<div class="small text-warning my-1 ml-3">&#9432; ${esc(r.note)}</div>`;
  return html;
}

function composeChanNotesHtml(c) {
  return c.channels.length
    ? c.channels.map(function (id) { return `<div class="text-muted small my-1">${channelById(id).icon} ${CHANNEL_NOTE[id]}</div>` + composeChannelReadinessHtml(id); }).join("")
    : '<div class="text-muted small">Pick one or more channels — the message fields below adapt to what you choose.</div>';
}

function composePrioHelpHtml(c) {
  if (!c.prio) return "Select a priority.";
  const map = {
    critical: "🔴 Critical: overrides quiet hours, channel opt-outs and category mutes for the recipients set in Override config. Gated to selected senders. Cannot be unsubscribed.",
    high: "🟠 High: delivered promptly on the user's enabled channels; respects opt-outs unless overridden.",
    normal: "🟡 Normal: respects quiet hours (queued and released after), opt-outs and mutes.",
    info: "🟢 Informational: fully respects all preferences; skipped for muted categories."
  };
  let extra = "";
  if (c.prio === "critical") {
    extra = `<div class="mt-1 text-muted small">You are signed in as ${esc(USER_FULL_NAME)} (${esc(USER_ROLE)}).</div>`;
  }
  return map[c.prio] + extra;
}

function composeTypeCatHtml(cat) {
  return {
    transactional: "This is a <b>transactional</b> notice — it has a lawful basis to reach opted-out users (e.g. fees, classes, policy).",
    emergency: "This is an <b>emergency</b> notice — it may override marketing consent and quiet hours where legally permitted.",
    marketing: "This is a <b>marketing</b> notice — consent &amp; unsubscribe are always respected, even at high priority."
  }[cat];
}

function composeSchedHelpHtml(c) {
  const tz = TIMEZONE_OPTIONS.find(function (t) { return t.key === c.schedTZ; });
  const ref = c.timeRef === "fixed" ? `the fixed timezone <b>${esc(tz ? tz.value : c.schedTZ)}</b>` : `each recipient's <b>local time</b>`;
  if (c.prio === "high" || c.prio === "critical") {
    return c.schedDate ? `Delivers on <b>${c.schedDate.replace("T", " ")}</b>, interpreted in ${ref}.` : `<span class="text-danger">Pick a delivery date and time.</span>`;
  }
  const q = c.quietMode === "firstX" ? `the first ${c.quietX} hours` : "the first hour";
  return `${c.schedDate ? `Without quiet hours: delivers at <b>${c.schedDate.replace("T", " ")}</b> in ${ref}. ` : '<span class="text-danger">Set a specific time. </span>'}With quiet hours: released within <b>${q}</b> of the recipient's active window.`;
}

function composeVarSamplesHtml(vars) {
  if (!vars.length) return '<div class="text-muted small">Add a {{variable}} to your message to set a sample preview value.</div>';
  return `<label class="small font-weight-bold text-muted">Preview values <span class="text-muted small font-weight-normal">— sample text substituted into the preview for each variable</span></label>
    <div class="form-row mt-1">${vars.map(function (v) { return `<div class="form-group col-md-6"><label class="font-weight-bold">{{${v}}}</label><input type="text" class="form-control" value="${esc(S.compose.samples[v] || "")}" placeholder="Sample ${v.replace(/_/g, " ")}" oninput="composeSetSample(event)" ${dataAttrs({ v: v })}></div>`; }).join("")}</div>`;
}

function composeUserChipsHtml(c) {
  return c.users.length
    ? c.users.map(function (u, i) { return `<span class="badge badge-primary p-2 mr-2 mb-2">${esc(u.fullName)} <span role="button" class="ml-1" onclick="composeRemoveUser(event)" ${dataAttrs({ i: i })}>&times;</span></span>`; }).join("")
    : '<span class="text-muted small">No individuals added — the whole role (filtered) will be targeted.</span>';
}

function composeUserSearchResultsHtml(results, selectedUsers) {
  if (!results.length) return "";
  const selectedIds = selectedUsers.map(function (u) { return u.id; });
  return `<div class="list-group mt-1">${results.map(function (r) {
    const already = selectedIds.includes(r.userId);
    return `<button type="button" class="list-group-item list-group-item-action py-2 ${already ? "disabled text-muted" : ""}" onclick="composeSelectUserResult(event)" ${dataAttrs({ id: r.userId, name: r.fullName })}>${esc(r.fullName)}${already ? ' <span class="small">(added)</span>' : ""}</button>`;
  }).join("")}</div>`;
}

/* ---- the seven-section form ---- */
function composeAudienceCardHtml(c) {
  return `<div class="card mb-3"><div class="card-body">
    <h5 class="mb-3">1 · Audience targeting</h5>
    <div class="text-muted small mb-3">Choose a role. Student and Parent share the same filters. Adding individuals is optional — leave empty to reach everyone matching the filters.</div>
    <div class="form-group">
      <label>Notice for <span class="text-danger">*</span> <span class="text-muted small">— role(s)</span></label>
      <select id="roleSelect" class="form-control" multiple onchange="composeSetRole('roleSelect')">
        ${ROLES.map(function (r) { return `<option value="${r.id}" ${c.roles.includes(r.id) ? "selected" : ""}>${r.name}</option>`; }).join("")}
      </select>
    </div>
    <div class="form-row">
      <div class=" col-md-6 d-none" id="sessionField"><label>Session</label>
        <select id="sessionSelect" class="form-control" multiple onchange="composeSetSessions(event)">${SESSION_OPTIONS.map(function (s) { return `<option value="${s.key}" ${c.sessions.includes(s.key) ? "selected" : ""}>${esc(s.value)}</option>`; }).join("")}</select></div>
      <div class=" col-md-6" id="registrationTypeField"><label>Enroll type</label>
        <select class="form-control" multiple onchange="composeSetRegistrationTypes(event)">${REGISTRATION_TYPE_OPTIONS.map(function (rt) { return `<option value="${rt.key}" ${c.registrationTypes.includes(rt.key) ? "selected" : ""}>${esc(rt.value)}</option>`; }).join("")}</select></div>
      <div class=" col-md-6" id="gradeField"><label>Grade</label>
        <select id="gradeSelect" class="form-control" multiple onchange="composeGradeChanged(event)">${GRADE_OPTIONS.map(function (g) { return `<option value="${g.key}" ${c.grades.includes(g.key) ? "selected" : ""}>${esc(g.value)}</option>`; }).join("")}</select></div>
      <div class=" col-md-6" id="batchField"><label>Batch</label>
        <select id="batchSelect" class="form-control" multiple onchange="composeBatchChanged(event)">${BATCH_OPTIONS.map(function (b) { return `<option value="${b.key}" ${c.batches.includes(b.key) ? "selected" : ""}>${esc(b.value)}</option>`; }).join("")}</select></div>
      <div class=" col-md-6" id="courseField"><label>Course</label>
        <select id="courseSelect" class="form-control" multiple onchange="composeSetCourses(event)">${COURSE_OPTIONS.map(function (x) { return `<option value="${x.key}" ${c.courses.includes(x.key) ? "selected" : ""}>${esc(x.value)}</option>`; }).join("")}</select></div>
      <div class=" col-md-6"><label>Country / region</label>
        <select id="countrySelect" class="form-control" multiple onchange="composeSetCountries(event)">${COUNTRY_OPTIONS.map(function (x) { return `<option value="${x.key}" ${c.countries.includes(x.key) ? "selected" : ""}>${esc(x.value)}</option>`; }).join("")}</select></div>
      <div class=" col-md-6" id="enrollField2"><label>Enrollment status</label>
        <select class="form-control" multiple onchange="composeSetEnrollStatuses(event)">
          ${ENROLLMENT_STATUS_OPTIONS.map(function (o) { return `<option value="${o.key}" ${c.enrollStatuses.includes(o.key) ? "selected" : ""}>${esc(o.value)}</option>`; }).join("")}
        </select></div>
      <div class=" col-md-6" id="profileField"><label>Profile Status</label>
        <select id="profileSelect" class="form-control" onchange="composeField(event)" ${dataAttrs({ k: "profile" })}>
          <option value="">All</option>
          ${PROFILE_STATUS_OPTIONS.map(function (o) { return `<option value="${o.key}" ${c.profile === o.key ? "selected" : ""}>${esc(o.value)}</option>`; }).join("")}
        </select></div>
    </div>
    <div class="form-group" id="userField" style="position:relative;"><label>Select individuals <span class="text-muted small">— optional; type at least 2 letters to search</span></label>
      <input type="text" id="userSearch" class="form-control" placeholder="Select a role first" oninput="composeUserSearchInput(event)" onkeydown="composeUserSearchKey(event)" autocomplete="off">
      <div id="userSearchResults" style="position:absolute; z-index:1000; width:100%; max-height:240px; overflow-y:auto;"></div>
      <div class="d-flex flex-wrap mt-2" id="userChips"></div>
    </div>
  </div></div>`;
}

function composePriorityChannelsCardHtml(c) {
  const prios = ["critical", "high", "normal", "info"].map(function (p) {
    const on = c.prio === p;
    const disabled = Boolean(c.prio) && !on;
    return chipButton(`${PRIO[p].d} ${PRIO[p].l}`, on, { click: "composeSetPrio", p: p, disabled: disabled });
  }).join("");
  const soleChan = c.channels.length === 1 ? c.channels[0] : null;
  const chans = COMPOSE_CHANNELS.map(function (id) {
    const ch = channelById(id);
    const on = c.channels.includes(id);
    const disabled = soleChan != null && id !== soleChan;
    return chipButton(`${ch.icon} ${ch.name}`, on, { click: "composeSelectChan", id: id, disabled: disabled });
  }).join("");
  return `<div class="card mb-3"><div class="card-body">
    <h5 class="mb-3">2 · Priority &amp; channels</h5>
    <div class="form-group">
      <label>Priority</label>
      <div class="d-flex flex-wrap" id="prioRow">${prios}</div>
      <div class="text-muted small mt-2" id="prioHelp"></div>
    </div>
    <div class="form-group mb-0">
      <label>Delivery channels <span class="text-muted small">— the message fields below adapt to what you pick</span></label>
      <div class="d-flex flex-wrap" id="chanChips">${chans}</div>
      <div class="mt-2" id="chanNotes"></div>
    </div>
  </div></div>`;
}

function composeMessageCardHtml(c) {
  const templateOpts = COMPOSE_TEMPLATES.filter(function (t) { return t.type === c.type; }).map(function (t) { return `<option value="${t.id}">${t.name}</option>`; }).join("");
  return `<div class="card mb-3"><div class="card-body">
    <h5 class="mb-3">3 · ${isCollectType(c.type) ? "Notice type" : "Message"}</h5>
    <div class="form-row">
      <div class="form-group col-md-6"><label>Notice type <span class="text-danger">*</span></label>
        <select class="form-control" onchange="composeField(event)" ${dataAttrs({ k: "type", after: "compose" })}>${TYPES.map(function (t) { return `<option value="${t.id}" ${c.type === t.id ? "selected" : ""}>${t.name}</option>`; }).join("")}</select></div>
      <div class="form-group col-md-6 ${c.type === "other" ? "" : "d-none"}" id="otherField"><label>Specify "Other" <span class="text-danger">*</span></label>
        <input type="text" maxlength="60" class="form-control" value="${esc(c.otherType)}" placeholder="e.g. Transport route change" oninput="composeField(event)" ${dataAttrs({ k: "otherType" })}></div>
      <div class="form-group col-12"><label>Start from a template <span class="text-muted small">— matches the notice type; fills the fields below</span></label>
        <select class="form-control" onchange="composeApplyTemplate(event)"><option value="">— none —</option>${templateOpts}</select></div>
    </div>
    <div class="${isCollectType(c.type) ? "d-none" : ""}">
      ${composeCommonModeEnabled() ? '<div class="mb-3">' + switchToggle("commonToggle", c.commonMode, 'Common mode <span class="text-muted small font-weight-normal">— write one heading &amp; message shared across In-app, Website and Email</span>', { change: "composeToggleCommon" }) + "</div>" : ""}
      <div id="channelBlocks">${c.channels.length ? composeChannelBlocksHtml(c) : '<div class="text-muted small">Select at least one channel above to compose its message.</div>'}</div>
      <div class="text-muted small mt-2" id="varNote"></div>
      <div class="form-group mt-3">
        <label>Insert merge field <span class="text-muted small">— click to add a {{variable}} into the active field</span></label>
        <div class="d-flex flex-wrap">${KNOWN_VARS.map(function (v) { return `<button type="button" class="btn btn-sm btn-outline-secondary mr-1 mb-1" onclick="composeInsertVar(event)" ${dataAttrs({ v: v })}>{{${v}}}</button>`; }).join("")}</div>
      </div>
      <div class="mt-3" id="varSamples"></div>
      <div class="alert alert-warning mt-3 mb-0">&#8505; <span id="catTxt"></span></div>
    </div>
  </div></div>`;
}

function composeCollectCardHtml(c) {
  return `<div class="card mb-3 ${isCollectType(c.type) ? "" : "d-none"}" id="collectCard"><div class="card-body">
    <h5 class="mb-3">Information to collect</h5>
    <div class="text-muted small mb-3">This notice asks the selected ${rolesLabel(c.roles) || "recipient"}s to provide information — there's no separate message. Recipients see a pop-up with the fields below to fill in.</div>
    <div class="form-group"><label>Pop-up heading <span class="text-danger">*</span> <span class="text-muted small">— shown at the top of the request pop-up</span></label>
      <input type="text" class="form-control" value="${esc(c.collectHeading || "")}" placeholder="e.g. Action required: please update your details" oninput="composeField(event)" ${dataAttrs({ k: "collectHeading", after: "preview" })}></div>
    ${composeCollectConfigHtml(c)}
  </div></div>`;
}

function composeAttachmentCardHtml(c) {
  return `<div class="card mb-3"><div class="card-body">
    <h5 class="mb-3">4 · Attachment</h5>
    <div class="form-group"><label>File <span class="text-muted small">— pdf, JPEG, PNG · max 5 MB</span></label>
      <div class="d-flex align-items-center flex-wrap">
        <button class="btn btn-light mr-2" type="button" onclick="composeTriggerAttach(event)">Choose file</button>
        <button type="button" class="btn btn-outline-primary btn-sm mr-2" id="attachPreviewBtn" onclick="composeOpenAttachmentPreview()" ${c.attachmentStorageKey ? "" : "disabled"}>Preview</button>
        <span id="attachName" class="text-muted small">${esc(c.attachment || "No file chosen")}</span>
        <input type="file" id="attachInput" accept=".pdf,.jpg,.jpeg,.png" class="d-none" onchange="composePickAttachment(event)">
      </div>
    </div>
    <div class="form-group mb-0"><label>How to present it</label>
      <div class="d-flex flex-wrap">
        ${composeAttachmentEmbeddedEnabled() ? chipButton("Show in message (embedded)", c.attachMode === "embedded", { click: "composeFieldClick", k: "attachMode", v: "embedded", after: "compose" }) : ""}
        ${chipButton("Attach to message (separate)", composeAttachmentEmbeddedEnabled() ? c.attachMode === "attached" : true, composeAttachmentEmbeddedEnabled()
          ? { click: "composeFieldClick", k: "attachMode", v: "attached", after: "compose" }
          : {})}
      </div>
      <div class="text-muted small mt-2">${composeAttachmentEmbeddedEnabled()
        ? "Embedded shows inline on Website; In-app shows a view icon only. Attached shows a separate view icon on every channel."
        : "Attachments are sent as a separate file with a view/download link on each channel (not embedded inline)."}</div>
      <div class="text-muted small mt-1">&#9888; Attachments are not sent via WhatsApp — the channel is text-only. They go out with Email and are downloadable from My Notices.</div>
    </div>
  </div></div>`;
}

function composeSchedulingCardHtml(c) {
  return `<div class="card mb-3"><div class="card-body">
    <h5 class="mb-3">5 · Scheduling</h5>
    <div id="schedBlock">${composeSchedulingHtml(c)}</div>
  </div></div>`;
}

function composeAckCardHtml(c) {
  const fields = `<div class="${c.ack ? "" : "d-none"} mt-3" id="ackFields">
    <div class="form-group"><label>Acknowledgment style</label>
      <div class="d-flex flex-wrap">
        ${chipButton("Timed — deadline &amp; countdown", (c.ackMode || "timed") === "timed", { click: "composeSetAckMode", v: "timed" })}
        ${chipButton("Simple — Acknowledge button only", c.ackMode === "simple", { click: "composeSetAckMode", v: "simple" })}
      </div>
      <div class="text-muted small mt-1">${c.ackMode === "simple" ? "The recipient sees only an <b>Acknowledge</b> button — no date or timer. The response is stored as <b>Yes</b> on acknowledge, or <b>No</b> once the skip limit is reached." : "The recipient sees the declaration with a <b>Valid till</b> date and a live countdown."}</div>
    </div>
    <div class="form-group"><label>Declaration text <span class="text-danger">*</span> <span class="text-muted small">— the exact statement the user agrees to; versioned on edit</span></label>
      <textarea id="declf" class="form-control" rows="2" placeholder="e.g. I confirm I have read and understood the Child Protection & Safeguarding Policy v3.1." oninput="composeField(event)" ${dataAttrs({ k: "declaration", after: "preview" })}>${esc(c.declaration)}</textarea></div>
    <div class="form-row">
      <div class="form-group col-md-6"><label>Enforcement</label>
        <div class="d-flex flex-wrap">
          ${chipButton("Soft — can skip", c.enforce === "soft", { click: "composeSetEnforce", v: "soft" })}
          ${chipButton("Hard — blocking", c.enforce === "hard", { click: "composeSetEnforce", v: "hard" })}
        </div></div>
      <div class="form-group col-md-6 ${c.enforce === "soft" ? "" : "d-none"}" id="softField"><label>Convert to hard after</label>
        <input type="number" min="0" class="form-control" value="${c.softToHard}" oninput="composeField(event)" ${dataAttrs({ k: "softToHard", num: 1 })}> <span class="text-muted small">skips (0 = stays soft)</span></div>
      <div class="form-group col-md-6 ${c.ackMode === "simple" ? "d-none" : ""}" id="ackByField"><label>Acknowledge by <span class="text-muted small">— optional deadline</span></label>
        <input type="datetime-local" class="form-control" style="-webkit-appearance:auto;" value="${esc(c.deadline || "")}" onchange="composeField(event)" ${dataAttrs({ k: "deadline", after: "preview" })}></div>
      <div class="form-group col-md-6"><label>If declined</label>
        <select class="form-control" onchange="composeField(event)" ${dataAttrs({ k: "declineOutcome" })}>
          <option value="unblock-flag" ${c.declineOutcome === "unblock-flag" ? "selected" : ""}>Unblock &amp; flag for follow-up (default)</option>
          <option value="unblock-restrict" ${c.declineOutcome === "unblock-restrict" ? "selected" : ""}>Unblock with restricted access</option>
          <option value="escalate" ${c.declineOutcome === "escalate" ? "selected" : ""}>Escalate to admin</option>
        </select></div>
    </div>
    <div class="alert alert-danger mb-0">&#9878; Config (soft/hard, skip threshold) is changeable later; <b>recorded acknowledgments are immutable</b> and always store the declaration version the user actually saw.</div>
  </div>`;
  return `<div class="card mb-3"><div class="card-body">
    <h5 class="mb-3">6 · Legal notice &amp; acknowledgment</h5>
    ${switchToggle("ackToggle", c.ack, "Require acknowledgment / declaration", { change: "composeToggleAck" })}
    <div class="text-muted small mt-2">Turns this into a system of record — every response is stored immutably with timestamp, local time and location.</div>
    ${fields}
  </div></div>`;
}

function composeOverrideCardHtml(c) {
  const roles = ROLES.map(function (r) { return chipButton(r.name, c.ovrRoles.includes(r.id), { click: "composeToggleOvrRole", id: r.id }); }).join("");
  return `<div class="card mb-3"><div class="card-body">
    <h5 class="mb-3">7 · Preference override <span class="text-muted small font-weight-normal">(who bypasses quiet hours / opt-outs)</span></h5>
    ${switchToggle("ovrToggle", c.override, "Apply preference override for selected recipients", { change: "composeToggleOvr" })}
    <div class="text-muted small mt-2">No default layer — override applies only to the roles and users you explicitly select here.</div>
    <div class="${c.override ? "" : "d-none"} mt-3" id="ovrFields">
      <div class="form-group"><label>Override for roles</label><div class="d-flex flex-wrap">${roles}</div></div>
      <div class="form-group mb-0"><label>Override for specific users <span class="text-muted small">— comma separated</span></label>
        <input type="text" class="form-control" value="${esc(c.ovrUsers)}" placeholder="e.g. Priya Nair, Facilities Lead" oninput="composeField(event)" ${dataAttrs({ k: "ovrUsers" })}></div>
    </div>
  </div></div>`;
}

function composePreviewColumnHtml() {
  return `<div class="card"><div class="card-body">
      <h3 class="h6">Recipient preview</h3>
      <div class="text-muted small mb-2">Primary channel, with sample values filled in</div>
      <div class="border rounded">
        <div class="bg-light border-bottom px-3 py-2 small">&#128205; International Schooling</div>
        <div class="p-3"><div id="pvNotif"></div><div id="pvAck"></div></div>
      </div>
    </div></div>`;
}

function composePageHtml(c) {
  return pageHead("pe-7s-mail", "Compose Notice", "Target, choose channels, compose per channel, and schedule", '<button class="btn btn-light" onclick="navTo(event)" data-view="notices">&#8592; Back</button>') +
    `<div class="row">
      <div class="col-lg-8">
        ${composeAudienceCardHtml(c)}
        ${composePriorityChannelsCardHtml(c)}
        ${composeMessageCardHtml(c)}
        ${composeCollectCardHtml(c)}
        ${composeAttachmentCardHtml(c)}
        ${composeSchedulingCardHtml(c)}
        ${composeAckOverrideEnabled() ? composeAckCardHtml(c) : ""}
        ${composeAckOverrideEnabled() ? composeOverrideCardHtml(c) : ""}
        <div class="d-flex flex-wrap justify-content-end mb-4">
          <button class="btn btn-danger mr-2 mb-2" onclick="composeConfirmReset()">&#8634; Reset</button>
          <button class="btn btn-light mr-2 mb-2" onclick="composeSaveDraft()">Save as draft</button>
          <button class="btn btn-light mr-2 mb-2" onclick="composeOpenFullPreview()">&#128065; Preview</button>
          <button class="btn btn-success mb-2" id="sendBtn" onclick="composeSend()">Schedule &amp; send</button>
        </div>
      </div>
      <div class="col-lg-4" id="composePreviewOuter" style="position:relative;"><div id="composePreviewCol">${composePreviewColumnHtml()}</div></div>
    </div>`;
}

/* ---- IS school email layout (header + card + footer) ---- */
var NOTICE_EMAIL_HEADER_IMG = "https://sms.internationalschooling.org/static/theme2/images/is-mail-banner.png";

function composeIsSchoolEmailFooterButtonsHtml(c) {
  const web = noticeFooterWebsiteUrl(c.footerWebsite);
  const mail = noticeFirstFooterEmail(c.footerEmails);
  const btn = function (label, cls, href) {
    return href
      ? `<a href="${esc(href)}" target="_blank" rel="noopener" class="btn btn-sm ${cls} mr-1 mb-1">${label}</a>`
      : "";
  };
  return btn("&#127760; Visit Website", "btn-primary", web)
    + btn("&#9993; Email Us", "btn-primary", mail ? "mailto:" + mail : "")
    + `<span class="btn btn-sm btn-success mb-1">&#128172; WhatsApp</span>`;
}

function composeIsSchoolEmailPreviewHtml(c) {
  const who = c.samples.guardian_name || c.samples.student_name || "there";
  const school = "International Schooling";
  const bodyInner = noticeLooksLikeHtml(c.emailBody)
    ? composeResolveHtml(c.emailBody || "")
    : esc(composeResolveText(c.emailBody || "")).replace(/\n/g, "<br>");
  const subject = composeResolveText((isCollectType(c.type) ? c.collectHeading : c.emailSubject) || "(no subject)");
  const ackBlock = isCollectType(c.type) && c.collectFields.length
    ? `<img src="https://sms.internationalschooling.org/static/img/info-icon.png" alt="" style="width:14px;vertical-align:middle"/> Information requested — <b>log in to provide ${c.collectFields.length} detail(s)</b>`
    : (c.ack
      ? (c.ackMode === "simple"
        ? "Acknowledgment required — <b>log in to acknowledge</b>"
        : "Acceptance is valid till: <b>" + (c.deadline ? fmtDeadlineDate(c.deadline) : "—") + "</b>")
      : "");
  const social = ["Facebook", "Instagram", "X", "LinkedIn", "YouTube"].map(function (t) {
    return `<span class="d-inline-flex align-items-center justify-content-center rounded-circle bg-secondary text-white mr-1" style="width:28px;height:28px;font-size:10px">${t.charAt(0)}</span>`;
  }).join("");
  return `<div class="notice-is-email-preview mx-auto" style="max-width:600px;font-family:Lato,Arial,sans-serif;color:#464646">
    <img src="${NOTICE_EMAIL_HEADER_IMG}" alt="${esc(school)}" class="w-100 mb-0" onerror="this.style.display='none'"/>
    <div style="border:1px solid #0d6efd;border-radius:9px;background:#fff;padding-bottom:12px;margin:16px 0">
      <div style="width:80%;margin:0 auto;padding:10px 20px;text-align:left">
        <p style="font-weight:bold;font-size:17px;margin:0 0 8px;text-transform:capitalize">Dear ${esc(who)},</p>
        <p style="font-weight:bold;font-size:14px;text-align:center;margin:0 0 12px">Greetings from ${esc(school)}!</p>
        <div class="small notice-email-html-preview" style="line-height:22px">${bodyInner}</div>
        ${composeAttachPreviewHtml(c, false)}
        ${ackBlock ? `<p class="small mt-2 mb-0">${ackBlock}</p>` : ""}
        <p class="small mt-2 mb-0" style="text-align:center"><a href="#" onclick="return false">Click here to log in</a></p>
        <p class="small mt-3 mb-0"><strong>Gratitude and Prayers,<br>${esc(school)} Family</strong></p>
      </div>
      <p class="text-muted small text-center px-3 mb-0 mt-2" style="font-size:12px;line-height:22px">${esc(noticeReplyDisclaimerText(c.footerEmails))}</p>
    </div>
    <div class="p-3 rounded" style="background:#f1f8ff">
      <div class="text-center mb-2">${composeIsSchoolEmailFooterButtonsHtml(c)}</div>
      <div class="row small text-center mb-2">
        <div class="col-4"><b>Fully Accredited</b><div class="text-muted">NEASC · WASC · Cognia</div></div>
        <div class="col-4"><b>Approved</b><div class="text-muted">College Board</div></div>
        <div class="col-4"><b>Recognized</b><div class="text-muted">NCAA</div></div>
      </div>
      <div class="text-center mb-2">${social}</div>
      <p class="text-muted small text-justify mb-1" style="font-size:11px"><b>Disclaimer:</b> The information contained herein (including any accompanying documents) is confidential and intended solely for the addressee…</p>
      <p class="text-muted small mb-0" style="font-size:11px">&#128205; Singapore Office: #03-09, Level 3, 111 Somerset Road, Singapore 238164<br>&#128205; USA Office: 3080 Tamiami Trail E, Suite 311, Naples, Florida 34112</p>
    </div>
    <div class="text-muted small mt-1">Subject: <b>${subject}</b></div>
  </div>`;
}

/* ---- modal bodies ---- */
function composeFullPreviewBodyHtml(c) {
  let body = `<div class="text-muted small mb-3">Exactly how it renders for a ${rolesLabel(c.roles) || "recipient"} with your sample values filled in. ${Object.keys(c.samples || {}).length ? "" : "Tip: set sample values in the message section to see variables resolved."}</div>`;

  if (c.channels.includes("inapp")) {
    body += `<div class="mb-4"><div class="text-muted small mb-1">&#128241; In-app — pop-up + notice section</div>
      <div class="border rounded">
        <div class="bg-light border-bottom px-3 py-2 small">&#128205; International Schooling <span class="text-success">· Your School. Your Time.</span></div>
        <div class="p-3">
          ${c.appPush ? `<div class="alert alert-secondary py-2 small">&#128276; ${composeResolveText(c.appPush)}</div>` : ""}
          <div class="border rounded p-3">
            <div class="font-weight-bold">${PRIO[c.prio].d} ${esc((isCollectType(c.type) ? c.collectHeading : c.appHeading) || "Notice heading")}</div>
            ${isCollectType(c.type) ? "" : `<div class="mt-2 small">${composeResolveText(c.appBody || "")}${composeAttachPreviewHtml(c, false)}</div>`}
            ${composeAckFooterHtml(c, false)}
          </div>
        </div>
      </div></div>`;
  }
  if (c.channels.includes("website")) {
    body += `<div class="mb-4"><div class="text-muted small mb-1">&#127760; Website — pop-up + notice section</div>
      <div class="border rounded p-3">
        <div class="font-weight-bold">${PRIO[c.prio].d} ${esc((isCollectType(c.type) ? c.collectHeading : c.webHeading) || "Notice heading")}</div>
        ${isCollectType(c.type) ? "" : `<div class="mt-2 small">${composeResolveText(c.webBody || "")}${composeAttachPreviewHtml(c, true)}</div>`}
        ${composeAckFooterHtml(c, false)}
      </div></div>`;
  }
  if (c.channels.includes("email")) {
    body += `<div class="mb-4"><div class="text-muted small mb-2">&#9993; Email — layout matches the sent message (school header, card, footer)</div>
      ${composeIsSchoolEmailPreviewHtml(c)}</div>`;
  }
  if (c.channels.includes("whatsapp")) {
    const t = WA_TEMPLATES.find(function (x) { return x.id === c.waTemplate; });
    body += `<div class="mb-2"><div class="text-muted small mb-1">&#128172; WhatsApp — via Gupshup</div>
      <div class="border rounded">
        <div class="bg-success text-white px-3 py-2 small">&#128172; WhatsApp Business</div>
        <div class="p-3"><div class="alert alert-light border mb-0">${t ? composeResolveText(t.body) : '<span class="text-muted">No template selected.</span>'}<div class="text-muted small text-right mt-1">just now &#10003;&#10003;</div></div></div>
      </div></div>`;
  }
  return body;
}

function composeFullPreviewTitleHtml(c) {
  const pill = `<span class="badge badge-info ml-2">${PRIO[c.prio].l}</span>`;
  const expToggle = c.ack && c.deadline
    ? `<label class="mb-0 ml-auto small"><input type="checkbox" ${S.previewExpired ? "checked" : ""} onchange="composeTogglePreviewExpired()"> Preview expired</label>`
    : "";
  return `<span class="d-flex align-items-center flex-wrap w-100">Recipient preview ${pill}${expToggle}</span>`;
}

function composeBlocksModalBodyHtml(blocks) {
  return `<div class="alert alert-danger mb-0">&#9940; ${blocks.map(function (b) { return `<div class="mb-2">&bull; ${b}</div>`; }).join("")}</div>`;
}

function composeReviewModalBodyHtml(c, warns, paid, reach) {
  const audience = c.roles.length
    ? esc(rolesLabel(c.roles)) + (c.registrationTypes.length ? " · " + esc(c.registrationTypes.map(registrationTypeLabel).join(", ")) : "")
    : "—";
  const kv = kvTable([
    ["Sending as", `<b>${esc(USER_FULL_NAME)}</b> (${esc(USER_ROLE)})`],
    ["Priority", prioLabel(c.prio)],
    ["Type", `${typeName(c.type)}${c.type === "other" && c.otherType ? " — " + esc(c.otherType) : ""} <span class="text-muted small">(${typeCat(c.type)})</span>`],
    ["Audience", audience],
    ["Channels", c.channels.map(channelName).join(", ")],
    ["Est. reach", `<b>${fmt(reach)}</b> recipients`]
  ]);
  const paidAlert = paid ? `<div class="alert alert-warning">&#128181; <b>WhatsApp via Gupshup</b> incurs per-message cost and requires an approved template plus recipient opt-in. Users without opt-in are excluded automatically.</div>` : "";
  const warnAlerts = warns.map(function (w) { return `<div class="alert alert-${w.includes("override is ON") || w.includes("isn't") ? "warning" : "info"}">&#9888; ${w}</div>`; }).join("");
  return kv + paidAlert + warnAlerts;
}

function composeResetModalBodyHtml(c) {
  return `<div class="alert alert-warning mb-0">&#9888; This clears everything you've entered${c.editId ? " and stops editing " + c.editId : ""}. This can't be undone.</div>`;
}
