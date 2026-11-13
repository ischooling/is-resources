/* =========================================================
   noticeCommon.js
   Cross-cutting helpers shared by every screen — all plain
   global functions:
     - toast()                Bootstrap toast notifications
     - Bootstrap markup builders (statusPill, kvTable, chipButton …)
     - applyWidths()          data-driven widths (no inline styles)
   ========================================================= */

/* ---- toast notifications (Bootstrap 4.6 toast) ---- */
function toast(msg, kind) {
  const color = { ok: "success", err: "danger", warn: "warning", info: "info" }[kind] || "dark";
  const wrap = createEl("div", "toast text-white bg-" + color + " border-0", '<div class="toast-body">' + msg + "</div>");
  wrap.setAttribute("role", "alert");
  let host = document.getElementById("nmsToasts");
  if (!host) {
    host = createEl("div", "position-fixed", "");
    host.id = "nmsToasts";
    host.style.cssText = "top:1rem;right:1rem;z-index:1080;";
    document.body.appendChild(host);
  }
  host.appendChild(wrap);
  const $t = $(wrap);
  $t.toast({ delay: 3200 });
  $t.on("hidden.bs.toast", function () { wrap.remove(); });
  $t.toast("show");
}

/* ---- reusable Bootstrap markup builders ---- */
function statusPill(status) {
  const m = STATUS_MAP[status] || ["secondary", status];
  return '<span class="badge badge-' + m[0] + '">' + m[1] + "</span>";
}

function deliveryStatusPill(status) {
  const key = (status || "").toUpperCase();
  const m = typeof DELIVERY_STATUS_MAP !== "undefined" && DELIVERY_STATUS_MAP[key]
    ? DELIVERY_STATUS_MAP[key]
    : ["secondary", esc(status || "—")];
  return '<span class="badge badge-' + m[0] + '">' + m[1] + "</span>";
}

function prioLabel(prio) {
  const p = PRIO[prio];
  return p ? p.d + " " + p.l : prio;
}

function prioBadge(prio, extraCls) {
  const p = PRIO[prio];
  if (!p) return prio;
  return '<span class="badge badge-' + p.cls + " " + (extraCls || "") + '">' + p.l + "</span>";
}

function ackBadge(enforce) {
  const hard = (enforce || "soft") === "hard";
  return '<span class="badge badge-' + (hard ? "danger" : "info") + '">' + (hard ? "Hard" : "Soft") + "</span>";
}

function highlightVars(text) {
  return esc(text).replace(/\{\{(\w+)\}\}/g, '<span class="badge badge-warning font-weight-normal">{{$1}}</span>');
}

/* key/value detail table. pairs = [[label, valueHtml], ...] */
function kvTable(pairs) {
  const rows = pairs.filter(Boolean).map(function (p) {
    return '<tr><th class="text-muted font-weight-normal small w-25 align-top">' + p[0] + "</th><td>" + p[1] + "</td></tr>";
  }).join("");
  return '<table class="table table-sm table-borderless mb-0"><tbody>' + rows + "</tbody></table>";
}

/* build a data-* attribute string from a plain object */
function dataAttrs(attrs) {
  return Object.keys(attrs || {})
    .filter(function (k) { return attrs[k] != null && attrs[k] !== false; })
    .map(function (k) { return "data-" + k + '="' + attrs[k] + '"'; })
    .join(" ");
}

/* event keys recognized inside an attrs object passed to inlineAttrs() */
const EVENT_ATTR_KEYS = ["click", "change", "input", "keydown", "focusin"];

/* build inline on{event}="fn(event)" handler attributes + data-* attrs
   from a plain object. Keys in EVENT_ATTR_KEYS become inline event
   handlers (calling the named global function with the event); every
   other key becomes a data-* attribute via dataAttrs(). */
function inlineAttrs(attrs) {
  const rest = {};
  const handlers = [];
  Object.keys(attrs || {}).forEach(function (k) {
    if (EVENT_ATTR_KEYS.indexOf(k) !== -1 && attrs[k] != null && attrs[k] !== false) {
      handlers.push("on" + k + '="' + attrs[k] + '(event)"');
    } else {
      rest[k] = attrs[k];
    }
  });
  handlers.push(dataAttrs(rest));
  return handlers.filter(Boolean).join(" ");
}

/* Bootstrap custom switch */
function switchToggle(id, checked, labelHtml, attrs) {
  return '<div class="custom-control custom-switch">' +
    '<input type="checkbox" class="custom-control-input" id="' + id + '" ' + (checked ? "checked" : "") + " " + inlineAttrs(attrs) + ">" +
    '<label class="custom-control-label" for="' + id + '">' + labelHtml + "</label></div>";
}

/* page header block */
function pageHead(icon, title, sub, actionsHtml) {
  return '<div class="app-page-title mb-3 py-2"><div class="page-title-wrapper">' +
    '<div class="page-title-heading">' +
      '<div class="page-title-icon"><i class="' + icon + ' text-primary"></i></div>' +
      '<div>' + title + (sub ? '<div class="page-title-subheading">' + sub + '</div>' : '') + '</div>' +
    '</div>' +
    '<div class="page-title-actions">' + (actionsHtml || '') + '</div>' +
  '</div></div>';
}

/* Legacy notice navigation used by shared HTML snippets. */
function navTo(e) {
  const el = e.currentTarget;
  const view = el.getAttribute("data-page") || el.getAttribute("data-view");
  const routes = {
    dashboard: typeof renderNoticeDashboardContent === "function" ? renderNoticeDashboardContent : null,
    notices: typeof renderNoticeWorkspaceContent === "function" ? renderNoticeWorkspaceContent : null,
    workspace: typeof renderNoticeWorkspaceContent === "function" ? renderNoticeWorkspaceContent : null,
    compose: typeof renderNoticeComposeContent === "function" ? renderNoticeComposeContent : null,
    templates: typeof renderNoticeTemplatesContent === "function" ? renderNoticeTemplatesContent : null
  };
  if (routes[view]) {
    routes[view]();
    return;
  }
  if (typeof callDashboardPageSchool === "function") {
    const currentModuleId = typeof MODULE_ID !== "undefined" ? MODULE_ID : (typeof moduleId !== "undefined" ? moduleId : "");
    callDashboardPageSchool(currentModuleId, view);
  }
}

/* Toggle chip; pass attrs.disabled = true to grey out and block clicks (exclusive selection UIs). */
function chipButton(label, on, attrs) {
  const a = Object.assign({}, attrs || {});
  const disabled = a.disabled === true;
  delete a.disabled;
  const disAttr = disabled ? " disabled" : "";
  return '<button type="button" class="btn btn-sm ' + (on ? "btn-primary" : "btn-outline-secondary") + ' mr-2 mb-2"' + disAttr + " " + inlineAttrs(a) + ">" + label + "</button>";
}

/* progress bar with a data-driven width (applied by applyWidths) */
function progressBar(pct, color) {
  const p = Math.max(0, Math.min(100, Math.round(pct)));
  return '<div class="progress mt-1"><div class="progress-bar bg-' + (color || "success") + '" role="progressbar" data-width="' + p + '" aria-valuenow="' + p + '" aria-valuemin="0" aria-valuemax="100"></div></div>';
}

/* apply data-driven widths after markup is injected (keeps templates inline-style-free) */
function applyWidths(root) {
  (root || document).querySelectorAll("[data-width]").forEach(function (e) {
    e.style.width = e.getAttribute("data-width") + "%";
  });
}

function getURLForNotice(suffixUrl) {
  return BASE_URL + API_VERSION + "notice/" + suffixUrl;
}

function loadNoticeTypes(callback) {
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLForNotice("types/get"),
    data: JSON.stringify({}),
    dataType: "json",
    success: function (rows) {
      TYPES.length = 0;
      (rows || []).forEach(function (t) {
        TYPES.push({ id: String(t.id), name: t.name, cat: t.category });
      });
      TYPES.push({ id: "other", name: "Other", cat: "transactional" });
      if (callback) callback();
    },
    error: function () {
      toast("Could not load notice types.", "err");
      if (callback) callback();
    }
  });
}

function loadExistingFields(callback) {
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLForNotice("existing-fields/get"),
    data: JSON.stringify({}),
    dataType: "json",
    success: function (rows) {
      EXISTING_FIELDS.length = 0;
      (rows || []).forEach(function (f) {
        EXISTING_FIELDS.push({ id: String(f.id), section: f.section, label: f.label, ftype: f.fieldType, options: f.options || [] });
      });
      if (callback) callback();
    },
    error: function () {
      toast("Could not load existing fields.", "err");
      if (callback) callback();
    }
  });
}

function loadWorkspaceNotices(callback) {
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLForNotice("workspace/get"),
    data: JSON.stringify({}),
    dataType: "json",
    success: function (rows) {
      WORKSPACE_NOTICES.length = 0;
      (rows || []).forEach(function (r) {
        var row = {
          id: r.id,
          title: r.title,
          typeName: r.typeName || "",
          prio: r.priority,
          status: (r.status || "").toLowerCase(),
          roleNames: r.roleNames || "",
          registrationType: r.registrationType || "",
          session: r.session || "",
          grade: r.grade || "",
          batch: r.batch || "",
          ack: !!r.ack,
          enforce: r.enforce,
          created: r.createdDate,
          sendAt: r.sendAt,
          total: r.totalRecipients || 0,
          sent: r.sent || 0,
          delivered: r.delivered || 0,
          failed: r.failed || 0
        };
        row.audienceFilters = typeof noticeAudienceFilterLine === "function" ? noticeAudienceFilterLine(row) : "";
        WORKSPACE_NOTICES.push(row);
      });
      if (callback) callback(true);
    },
    error: function () {
      toast("Could not load notices.", "err");
      if (callback) callback(false);
    }
  });
}

function loadNoticeRoles(callback) {
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLForNotice("roles/get"),
    data: JSON.stringify({}),
    dataType: "json",
    success: function (rows) {
      ROLES.length = 0;
      (rows || []).forEach(function (r) {
        const meta = ROLE_FIELD_META[(r.roleName || "").toUpperCase()] || { fields: {}, profileStatus: null };
        ROLES.push({ id: String(r.id), name: r.roleName, count: 0, fields: meta.fields, profileStatus: meta.profileStatus });
      });
      if (callback) callback();
    },
    error: function () {
      toast("Could not load roles.", "err");
      if (callback) callback();
    }
  });
}

function loadWhatsAppEvents(callback) {
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLForNotice("whatsapp-events/get"),
    data: JSON.stringify({}),
    dataType: "json",
    success: function (rows) {
      WA_TEMPLATES.length = 0;
      (rows || []).forEach(function (event) {
        WA_TEMPLATES.push({ id: event.id, name: event.name, body: event.body || "" });
      });
      if (callback) callback();
    },
    error: function () {
      toast("Could not load WhatsApp events.", "err");
      if (callback) callback();
    }
  });
}

function loadComposeTemplates(callback) {
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLForNotice("templates/get"),
    data: JSON.stringify({}),
    dataType: "json",
    success: function (rows) {
      COMPOSE_TEMPLATES.length = 0;
      (rows || []).forEach(function (t) {
        COMPOSE_TEMPLATES.push({
          id: t.id,
          type: String(t.typeId),
          name: t.name,
          heading: t.name,
          push: t.name,
          body: t.body || "",
          collectFields: (t.fields || []).map(function (f) {
            return {
              source: f.source,
              section: f.profileSection,
              ftype: f.fieldType,
              label: f.label,
              options: f.options ? f.options.split(",").map(function (s) { return s.trim(); }).filter(Boolean) : [],
              mandatory: f.mandatory === "Y",
              existingFieldRef: f.existingFieldRef
            };
          })
        });
      });
      if (callback) callback();
    },
    error: function () {
      toast("Could not load templates.", "err");
      if (callback) callback();
    }
  });
}

function saveNewNoticeType(name, callback) {
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLForNotice("types/save"),
    data: JSON.stringify({ name: name, category: "transactional" }),
    dataType: "json",
    success: function (savedType) {
      callback({ id: String(savedType.id), name: savedType.name, cat: savedType.category });
    },
    error: function () {
      toast("Could not create the new notice type.", "err");
    }
  });
}

function loadComposeSessions(callback) {
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLForCommon("masters"),
    data: JSON.stringify(getRequestForMaster("composeForm", "SESSIONS-LIST", "")),
    dataType: "json",
    success: function (data) {
      SESSION_OPTIONS.length = 0;
      const rows = (data.mastersData && data.mastersData.data) || [];
      rows.forEach(function (r) {
        SESSION_OPTIONS.push({ key: String(r.key), value: r.value, active: r.extra === "Y" });
      });
      if (callback) callback();
    },
    error: function () {
      toast("Could not load academic sessions.", "err");
      if (callback) callback();
    }
  });
}

function loadComposeGrades(callback) {
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLForCommon("masters"),
    data: JSON.stringify(getRequestForMaster("composeForm", "ALL-STANDARD-LIST", "")),
    dataType: "json",
    success: function (data) {
      GRADE_OPTIONS.length = 0;
      const rows = (data.mastersData && data.mastersData.standards) || [];
      rows.forEach(function (r) { GRADE_OPTIONS.push({ key: String(r.key), value: r.value }); });
      if (callback) callback();
    },
    error: function () {
      toast("Could not load grades.", "err");
      if (callback) callback();
    }
  });
}

function loadComposeCountries(callback) {
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLForCommon("masters"),
    data: JSON.stringify(getRequestForMaster("composeForm", "COUNTRIES-LIST", "")),
    dataType: "json",
    success: function (data) {
      COUNTRY_OPTIONS.length = 0;
      const rows = (data.mastersData && data.mastersData.countries) || [];
      rows.forEach(function (r) { COUNTRY_OPTIONS.push({ key: String(r.key), value: r.value }); });
      if (callback) callback();
    },
    error: function () {
      toast("Could not load countries.", "err");
      if (callback) callback();
    }
  });
}

function loadComposeTimezones(callback) {
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLForCommon("masters"),
    data: JSON.stringify(getRequestForMaster("composeForm", "TIMEZONE-LIST", "")),
    dataType: "json",
    success: function (data) {
      TIMEZONE_OPTIONS.length = 0;
      const rows = (data.mastersData && data.mastersData.countryTimeZones) || [];
      rows.forEach(function (r) { TIMEZONE_OPTIONS.push({ key: String(r.key), value: r.value }); });
      if (callback) callback();
    },
    error: function () {
      toast("Could not load timezones.", "err");
      if (callback) callback();
    }
  });
}

function loadComposeBatches(gradeId, callback) {
  BATCH_OPTIONS.length = 0;
  if (!gradeId) { if (callback) callback(); return; }
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLForCommon("masters"),
    data: JSON.stringify(getRequestForMaster("composeForm", "BATCH-NAME-LIST-BASED-ON-MULTIPLE-STANDARD", gradeId, "", "0", "", "ALL")),
    dataType: "json",
    success: function (data) {
      const rows = (data.mastersData && data.mastersData.subject) || [];
      rows.forEach(function (r) { BATCH_OPTIONS.push({ key: String(r.key), value: r.value }); });
      if (callback) callback();
    },
    error: function () {
      toast("Could not load batches.", "err");
      if (callback) callback();
    }
  });
}

function loadComposeCourses(gradeId, batchId, callback) {
  COURSE_OPTIONS.length = 0;
  if (!gradeId) { if (callback) callback(); return; }
  const mode = batchId ? "BATCH_WISE" : "STANDARD_WISE";
  const idsForMode = batchId ? batchId : gradeId;
  const courseProviderId = batchId ? COURSE_PROVIDER_ID_FOR_BATCH : COURSE_PROVIDER_ID_DEFAULT;
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLForCommon("masters"),
    data: JSON.stringify(getRequestForMaster("composeForm", "SUBJECT-NAME-LIST-BASED-ON-BATCHES", "", String(courseProviderId), "student", mode, idsForMode)),
    dataType: "json",
    success: function (data) {
      const rows = (data.mastersData && data.mastersData.courseList) || [];
      rows.forEach(function (r) { COURSE_OPTIONS.push({ key: String(r.key), value: r.value }); });
      if (callback) callback();
    },
    error: function () {
      toast("Could not load courses.", "err");
      if (callback) callback();
    }
  });
}
