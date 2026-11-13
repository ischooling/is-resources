/* =========================================================
   noticeWorkspaceContent.js
   HTML generation for the Notices Workspace + notice-detail modal.
   Plain string-returning functions; no events, no logic.
   ========================================================= */

const WORKSPACE_TABS = [["all", "All"], ["draft", "Drafts"], ["pending_approval", "Pending approval"], ["scheduled", "Scheduled"], ["sending", "Sending"], ["sent", "Sent"], ["partially_failed", "Partially failed"]];
const WORKSPACE_PAGE_SIZE = 15;
const COMMUNICATION_INBOX_PAGE_SIZE = 15;
/* The View modal opens with only this status ticked; the rest start unticked. */
const NOTICE_DELIVERY_DEFAULT_FILTER = "DELIVERED";
const NOTICE_DELIVERY_STATUS_FILTERS = [
  ["PROCESSED", "Processed (queued / in progress)"],
  ["DELIVERED", "Delivered (sent to provider)"],
  ["DROPPED", "Not delivered (failed / email bounced, blocked, dropped)"],
  ["OPEN", "Opened (email engagement)"]
];

function renderNoticeWorkspaceContent() {
  if (typeof loadComposeSessions === "function" && !SESSION_OPTIONS.length) {
    loadComposeSessions(function () {});
  }
  loadWorkspaceNotices(function (ok) {
    renderWorkspace();
    if (ok) loadCommunicationInbox();
  });
}

function workspaceTabCount(tab) {
  return tab === "all" ? WORKSPACE_NOTICES.length : WORKSPACE_NOTICES.filter(function (n) { return n.status === tab; }).length;
}

function workspaceTabsHtml(activeTab) {
  return WORKSPACE_TABS.map(function (t) {
    return '<li class="nav-item"><a class="nav-link ' + (activeTab === t[0] ? "active" : "") + '" role="button" onclick="setWorkspaceTab(event)" data-tab="' + t[0] + '">' +
      t[1] + ' <span class="badge badge-pill badge-light">' + workspaceTabCount(t[0]) + "</span></a></li>";
  }).join("");
}

function workspacePaginationHtml(totalPages, currentPage) {
  if (totalPages <= 1) return "";
  const pages = [];
  for (var p = 1; p <= totalPages; p++) {
    pages.push('<li class="page-item' + (p === currentPage ? " active" : "") + '">' +
      '<a class="page-link" role="button" onclick="gotoWorkspacePage(' + p + ')">' + p + "</a></li>");
  }
  return '<nav aria-label="Notices pages" class="ml-auto"><ul class="pagination pagination-sm justify-content-end mb-0 flex-nowrap">' +
    '<li class="page-item' + (currentPage === 1 ? " disabled" : "") + '"><a class="page-link" role="button" onclick="gotoWorkspacePage(' + (currentPage - 1) + ')">Prev</a></li>' +
    pages.join("") +
    '<li class="page-item' + (currentPage === totalPages ? " disabled" : "") + '"><a class="page-link" role="button" onclick="gotoWorkspacePage(' + (currentPage + 1) + ')">Next</a></li>' +
  "</ul></nav>";
}

function noticeDeliveryStatusFilterHtml() {
  var selected = (S.communicationInbox && S.communicationInbox.statusFilters) || [];
  var boxes = NOTICE_DELIVERY_STATUS_FILTERS.map(function (pair) {
    var id = "ndlFilter_" + pair[0];
  var on = selected.indexOf(pair[0]) >= 0 ? " checked" : "";
    return '<div class="custom-control custom-checkbox custom-control-inline">' +
      '<input type="checkbox" class="custom-control-input" id="' + id + '" value="' + pair[0] + '"' + on + ' onchange="applyCommunicationInboxFilters()">' +
      '<label class="custom-control-label" for="' + id + '">' + esc(pair[1]) + "</label></div>";
  }).join("");
  return '<fieldset class="mb-2"><legend class="small text-muted mb-1">Delivery status (like Email Logs)</legend>' +
    '<div class="d-flex flex-wrap" style="gap:8px">' + boxes + "</div></fieldset>";
}

function communicationInboxFiltersHtml() {
  const st = S.communicationInbox || {};
  const ch = st.channel || "";
  const subj = esc(st.subjectContains || "");
  const nq = esc(st.noticeQuery || "");
  const channelOpts = ['<option value="">All channels</option>'].concat(
    ["inapp", "website", "push", "email", "whatsapp"].map(function (id) {
      return '<option value="' + id + '"' + (ch === id ? " selected" : "") + ">" + esc(channelName(id)) + "</option>";
    })
  );
  return '<div class="row align-items-end mb-3">' +
    '<div class="col-6 col-md-6 col-lg-2 mb-2"><label class="small text-muted mb-0 d-block">Channel</label>' +
      '<select class="form-control form-control-sm" id="commInboxChannel" onchange="applyCommunicationInboxFilters()">' + channelOpts.join("") + "</select></div>" +
    '<div class="col-12 col-md-6 col-lg-3 mb-2"><label class="small text-muted mb-0 d-block">Email subject contains</label>' +
      '<input type="text" class="form-control form-control-sm" id="commInboxSubject" placeholder="Subject…" value="' + subj + '" onkeydown="if (event.key === \'Enter\') applyCommunicationInboxFilters()"></div>' +
    '<div class="col-12 col-md-6 col-lg-3 mb-2"><label class="small text-muted mb-0 d-block">Notice (ID or title)</label>' +
      '<input type="text" class="form-control form-control-sm" id="commInboxNotice" placeholder="Search notice…" value="' + nq + '" onkeydown="if (event.key === \'Enter\') applyCommunicationInboxFilters()"></div>' +
    '<div class="col-12 col-lg-2 mb-2">' +
      '<button type="button" class="btn btn-primary btn-sm btn-block mt-3 mt-lg-4" onclick="applyCommunicationInboxFilters()">Search</button></div>' +
    "</div>" +
    '<p class="text-muted small mb-2">Filters apply to this notice list. For email, <strong>Opened</strong> uses the same engagement data as Email Logs (SendGrid opens). <strong>Not delivered</strong> includes emails SendGrid bounced, blocked or dropped. Use <strong>Resend filtered</strong> to re-queue every matching delivery for the notices shown, or <strong>Resend undelivered</strong> on a notice to send it again only to recipients who did not get it.</p>';
}

function workspacePageHtml(activeTab) {
  const createBtn = '<button class="btn btn-primary" onclick="createWorkspaceNotice()">&#43; Create Notice</button>';
  const sub = "Manage notices. Filter the same list by channel, email subject and notice.";

  return pageHead("pe-7s-note2", "Notices Workspace", sub, createBtn) +
    '<div class="card mb-4"><div class="card-body">' +
      '<ul class="nav nav-pills flex-wrap mb-3">' + workspaceTabsHtml(activeTab) + "</ul>" +
      communicationInboxFiltersHtml() +
      '<div class="d-flex flex-wrap align-items-center mb-3">' +
        '<div class="text-muted small" id="workspaceCountLabel"></div>' +
        '<button type="button" class="btn btn-outline-warning btn-sm ml-auto d-none" id="workspaceResendFilteredBtn" onclick="resendFilteredDeliveries()">Resend filtered</button>' +
      "</div>" +
      '<div class="notice-workspace-table-wrap w-100">' +
        '<div class="table-responsive" style="float:none;width:100%"><table class="table table-hover mb-0">' +
          "<thead><tr><th>Notice</th><th>Type</th><th>Priority</th><th>Audience</th><th>Ack.</th><th>Status</th><th>Engagement</th><th>Action</th></tr></thead>" +
          '<tbody id="noticeRows"></tbody></table></div>' +
        '<div id="workspacePagination" class="d-flex justify-content-end w-100 mt-3 pt-2 border-top"></div>' +
      "</div>" +
    "</div></div>";
}

function workspaceEngagementCell(n) {
  const opened = (n.emailOpened ? '<div class="mb-1"><span class="badge badge-success">Opened</span></div>' : "") +
    (n.undeliveredCount ? '<div class="mb-1"><span class="badge badge-danger">Not delivered ' + fmt(n.undeliveredCount) + "</span></div>" : "");
  if (!n.total && !n.emailOpened && !n.undeliveredCount) return '<span class="text-muted">—</span>';
  if (!n.total) return opened;
  const fail = n.failed ? ' · <span class="text-danger">Fail <b>' + fmt(n.failed) + "</b></span>" : "";
  const pct = n.total ? (n.sent / n.total) * 100 : 0;
  return opened + '<div class="small">Total <b>' + fmt(n.total) + "</b> · Sent <b>" + fmt(n.sent) + "</b> · Deliv <b>" + fmt(n.delivered) + "</b>" + fail + "</div>" + progressBar(pct);
}

function workspaceActionButtonHtml(n) {
  var html = "";
  if (n.status === "draft") {
    html += '<button class="btn btn-success btn-sm" onclick="editWorkspaceDraft(event)" data-id="' + n.id + '">Edit</button>' +
      '<button class="btn btn-danger btn-sm mt-1" onclick="deleteWorkspaceDraft(event)" data-id="' + n.id + '">Delete</button>';
  } else if (n.status === "partially_failed") {
    html += '<button class="btn btn-warning btn-sm" onclick="resendUndeliveredNotice(event)" data-id="' + n.id + '">Resend undelivered</button>';
  } else if (n.status === "sent") {
    html += '<button class="btn btn-light btn-sm" onclick="sendAgainNotice(event)" data-id="' + n.id + '">Send again</button>' +
      '<button class="btn btn-outline-warning btn-sm mt-1" onclick="resendUndeliveredNotice(event)" data-id="' + n.id + '">Resend undelivered</button>';
  }
  if (n.resendDeliveryId != null) {
    html += '<button type="button" class="btn btn-outline-warning btn-sm mt-1" onclick="resendNoticeDelivery(event)" data-delivery-id="' + n.resendDeliveryId + '">Resend</button>';
  }
  return html;
}

function workspaceRowsHtml(list) {
  if (!list.length) {
    return '<tr><td colspan="8" class="text-center text-muted py-5">No notices here yet. <a role="button" onclick="navTo(event)" data-view="compose">Create one &rarr;</a></td></tr>';
  }
  return list.map(function (n) {
    return "<tr>" +
      "<td><b>" + esc(n.title || "(untitled)") + '</b><div class="text-muted small">NT-' + n.id + " · created " + fmtDateTime(n.created) + "<br>when: " + (n.sendAt ? fmtDateTime(n.sendAt) : "—") +
        (n.deliveryDetail ? "<br>" + esc(n.deliveryDetail) : "") + "</div></td>" +
      "<td>" + esc(n.typeName || "—") + (n.emailSubject ? '<div class="text-muted small">' + esc(n.emailSubject) + "</div>" : "") + "</td>" +
      "<td>" + prioLabel(n.prio) + (n.channelLabel ? '<div class="text-muted small">' + esc(n.channelLabel) + "</div>" : "") + "</td>" +
      '<td class="small">' + esc(n.roleNames || "—") +
        (n.audienceFilters ? '<div class="text-muted">' + esc(n.audienceFilters) + "</div>" : "") +
        (n.recipientLabel ? '<div class="text-muted">' + esc(n.recipientLabel) + "</div>" : "") + "</td>" +
      "<td>" + (n.ack ? ackBadge(n.enforce) : '<span class="text-muted">—</span>') + "</td>" +
      "<td>" + statusPill(n.status) + "</td>" +
      '<td class="text-nowrap">' + workspaceEngagementCell(n) + "</td>" +
      '<td><div class="btn-group-vertical btn-group-sm">' +
        '<button class="btn btn-outline-primary btn-sm mb-1" onclick="openWorkspaceNotice(event)" data-id="' + n.id + '">View</button>' +
        workspaceActionButtonHtml(n) +
      "</div></td></tr>";
  }).join("");
}

/* Turns a CSV filter value into a display pair for the detail KV table, or null if blank.
   lookup is an array of {key,value} (GRADE_OPTIONS etc.) or null for plain values. */
function composeFilterPair(label, csv, lookup) {
  if (!csv || !csv.trim()) return null;
  var parts = csv.split(",").map(function (s) { return s.trim(); }).filter(Boolean);
  if (!parts.length) return null;
  var display = lookup
    ? parts.map(function (k) {
        var key = String(k).trim();
        var match = lookup.find(function (o) { return String(o.key).trim() === key; });
        if (match) return match.value;
        if (/^\d+$/.test(key)) return key;
        return registrationTypeLabel(k);
      })
    : parts.map(registrationTypeLabel);
  return [label, display.map(esc).join(", ")];
}

/** Prefer API-resolved labels (grade/batch/country names) over client master lists. */
function workspaceFilterPair(label, csv, resolvedLabels, lookup) {
  if (resolvedLabels && String(resolvedLabels).trim()) {
    return [label, esc(String(resolvedLabels).trim())];
  }
  return composeFilterPair(label, csv, lookup);
}

function noticeAudienceFilterLine(n) {
  if (!n) return "";
  var reg = registrationTypesLabelCsv(n.registrationType);
  return reg ? ("Enroll type: " + reg) : "";
}

/** Highlight unresolved {{merge_fields}} in stored HTML (workspace has no sample values). */
function workspaceResolveHtml(html) {
  return String(html || "").replace(/\{\{(\w+)\}\}/g, function (m, v) {
    return '<span class="badge badge-warning font-weight-normal">{{' + v + "}}</span>";
  });
}

function workspaceNoticePreviewStub(n, c) {
  const att = n.attachment || {};
  return {
    emailBody: c.body || "",
    attachment: att.fileName || "",
    attachmentStorageKey: att.storageKey || "",
    attachMode: att.mode || "attached"
  };
}

/** Sent-mail card only (no banner, site footer, or login strip) — matches #DESCRIPTION# area of SEND_NOTICE_MAIL_TO_USER. */
function workspaceEmailInnerBodyPreviewHtml(n, c) {
  const school = "International Schooling";
  const bodyInner = typeof noticeLooksLikeHtml === "function" && noticeLooksLikeHtml(c.body)
    ? workspaceResolveHtml(c.body)
    : esc(c.body || "").replace(/\n/g, "<br>");
  const stub = workspaceNoticePreviewStub(n, c);
  const attachHtml = stub.attachment && typeof composeAttachPreviewHtml === "function"
    ? composeAttachPreviewHtml(stub, false) : "";
  const subject = c.emailSubject || c.heading || "";
  const subjectLine = subject ? '<p class="text-muted small mt-2 mb-0">Subject: <b>' + esc(subject) + "</b></p>" : "";
  return '<div class="notice-workspace-email-inner mx-auto" style="max-width:520px;font-family:Lato,Arial,sans-serif;color:#464646">' +
    '<div style="border:1px solid #0d6efd;border-radius:9px;background:#fff;padding-bottom:10px">' +
      '<div style="width:90%;margin:0 auto;padding:10px 16px;text-align:left">' +
        '<p style="font-weight:bold;font-size:17px;margin:0 0 8px;text-transform:capitalize">Dear there,</p>' +
        '<p style="font-weight:bold;font-size:14px;text-align:center;margin:0 0 12px">Greetings from ' + esc(school) + "!</p>" +
        '<div class="notice-email-html-preview small" style="line-height:22px">' + bodyInner + "</div>" +
        attachHtml +
        '<p class="small mt-3 mb-0"><strong>Gratitude and Prayers,<br>' + esc(school) + " Family</strong></p>" +
      "</div>" +
      '<p class="text-muted small text-center px-3 mb-0 mt-2" style="font-size:12px;line-height:22px">' +
        esc(noticeReplyDisclaimerText(c.footerEmails || "")) + "</p>" +
    "</div>" +
    subjectLine +
    "</div>";
}

function workspaceChannelMessageHtml(n, c) {
  const ch = (c.channel || "").toLowerCase();
  const label = '<div class="small text-muted text-uppercase mb-2">' + channelName(c.channel) + "</div>";
  if (ch === "email" && c.body) {
    return '<div class="mb-3">' + label + workspaceEmailInnerBodyPreviewHtml(n, c) + "</div>";
  }
  const heading = c.heading || c.emailSubject || "";
  const headingHtml = heading ? '<b class="d-block mb-2">' + esc(heading) + "</b>" : "";
  let bodyHtml = "";
  if (c.body) {
    if (typeof noticeLooksLikeHtml === "function" && noticeLooksLikeHtml(c.body)) {
      bodyHtml = '<div class="notice-email-html-preview small" style="line-height:22px">' + workspaceResolveHtml(c.body) + "</div>";
    } else {
      bodyHtml = '<div class="mt-1 small" style="white-space:pre-wrap">' + highlightVars(c.body) + "</div>";
    }
  }
  return '<div class="mb-3">' + label + headingHtml + bodyHtml + "</div>";
}

function workspaceDetailBodyHtml(n) {
  const typeId = n.typeId != null ? String(n.typeId) : "";
  const roleIds = n.roleIds ? n.roleIds.split(",").filter(Boolean) : [];
  const channels = (n.channelContent || []).map(function (c) { return c.channel; });
  const recipients = n.recipients || [];
  const overrideRoles = n.overrideRoles ? n.overrideRoles.split(",").filter(Boolean) : [];
  const pairs = [
    ["Type", typeName(typeId) + (typeId === "other" && n.otherTypeName ? " — " + esc(n.otherTypeName) : "") + ' <span class="text-muted small">(' + typeCat(typeId) + ")</span>"],
    ["Priority", prioLabel(n.priority)],
    ["Status", statusPill((n.status || "").toLowerCase())],
    ["Audience", esc(n.roleNames || rolesLabel(roleIds)) + (recipients.length ? " — " + recipients.length + " individual(s)" : "")],
    composeFilterPair("Enroll type", n.registrationType, REGISTRATION_TYPE_OPTIONS),
    composeFilterPair("Session", n.session, SESSION_OPTIONS),
    workspaceFilterPair("Grade", n.grade, n.gradeLabels, GRADE_OPTIONS),
    workspaceFilterPair("Batch", n.batch, n.batchLabels, BATCH_OPTIONS),
    composeFilterPair("Course", n.course, COURSE_OPTIONS),
    workspaceFilterPair("Country", n.country, n.countryLabels, COUNTRY_OPTIONS),
    composeFilterPair("Enrollment status", n.enrollmentStatus, ENROLLMENT_STATUS_OPTIONS),
    composeFilterPair("Profile status", n.profileStatus, PROFILE_STATUS_OPTIONS),
    channels.length ? ["Channels", channels.map(channelName).join(", ")] : null,
    n.attachment ? ["Attachment", "&#128206; " + esc(n.attachment.fileName) + ' <span class="text-muted small">(' + ((n.attachment.mode || "").toLowerCase() === "embedded" ? "embedded" : "attached") + ")</span>"] : null,
    ["Created", fmtDateTime(n.createdDate)],
    ["When", n.schedule && n.schedule.sendAt ? fmtDateTime(n.schedule.sendAt) : "—"],
    n.overrideEnabled === "Y" ? ["Override", (overrideRoles.length ? overrideRoles.map(roleName).join(", ") + (n.overrideUsers ? "; " : "") : "") + (n.overrideUsers ? esc(n.overrideUsers) : "") || "—"] : null,
    n.ack ? ["Acknowledgment", ackBadge(n.ack.enforcement) + (n.ack.enforcement === "soft" && n.ack.softToHardCount ? " · hard after " + n.ack.softToHardCount + " skips" : "") + (n.ack.deadlineAt ? " · by " + fmtDateTime(n.ack.deadlineAt) : "")] : null
  ];

  let html = kvTable(pairs);
  if (isCollectType(typeId)) {
    const fields = (n.collectFields || []).map(function (f) { return "<li>" + esc(f.label) + ' <span class="text-muted">(' + ftypeName(f.fieldType) + ")</span></li>"; }).join("");
    html += '<h6 class="mt-4">Information requested</h6><div class="border rounded bg-light p-3 small"><b>' + esc(n.collectHeading || "") + "</b>" +
      (fields ? "<ul class='mb-0 mt-2'>" + fields + "</ul>" : "") + "</div>";
  } else {
    const bodies = (n.channelContent || []).filter(function (c) { return c.body || c.emailSubject; })
      .map(function (c) { return workspaceChannelMessageHtml(n, c); }).join("");
    if (bodies) {
      html += '<h6 class="mt-4">Message</h6><div class="border rounded bg-white p-3">' + bodies + "</div>";
    }
  }
  if (n.ack) {
    html += '<div class="mt-3"><button class="btn btn-outline-primary btn-sm" onclick="workspaceAckLedger()">View acknowledgment ledger &rarr;</button></div>';
  }
  html += workspaceDetailResendPanelHtml(n);
  return html;
}

/* Delivery filter + Resend inside the View modal. Reuses workspace/delivery-log/resend-filtered,
   so one notice can be re-queued only to the deliveries matching the ticked statuses. */
function workspaceDetailResendPanelHtml(n) {
  var status = (n.status || "").toUpperCase();
  var scheduledOrDraft = status === "DRAFT" || status === "PENDING_APPROVAL" || status === "SCHEDULED";
  var boxes = NOTICE_DELIVERY_STATUS_FILTERS.map(function (pair) {
    var id = "ndmFilter_" + pair[0];
    return '<div class="custom-control custom-checkbox custom-control-inline">' +
      '<input type="checkbox" class="custom-control-input nd-modal-filter" id="' + id + '" value="' + pair[0] +
      '"' + (pair[0] === NOTICE_DELIVERY_DEFAULT_FILTER ? " checked" : "") +
      ' onchange="onNoticeDetailFilterChange(' + n.id + ')">' +
      '<label class="custom-control-label" for="' + id + '">' + esc(pair[1]) + "</label></div>";
  }).join("");
  var notice = scheduledOrDraft
    ? '<div class="small text-muted">Resend is available once the notice has started sending.</div>'
    : '<div class="small text-muted">Tick statuses to filter. Use the table header checkbox to select <b>all matching rows</b> (every page), or tick individual rows. Resend matching applies when nothing is selected.</div>';
  var exportBtn = '<button class="btn btn-outline-primary btn-sm mr-1" id="ndExportBtn" onclick="exportNoticeFromModal(' + n.id + ')">Export</button>';
  var btn = exportBtn + (scheduledOrDraft
    ? '<button class="btn btn-outline-warning btn-sm" disabled>Resend matching</button>'
    : '<button class="btn btn-outline-warning btn-sm" id="ndResendBtn" onclick="resendNoticeFromModal(' + n.id + ')">Resend matching</button>');
  return '<div class="border rounded p-3 mt-4" id="noticeDetailResendPanel">' +
    '<div class="font-weight-semi-bold mb-2">Delivery filters</div>' +
    '<div class="d-flex flex-wrap mb-2" style="gap:8px">' + boxes + '</div>' +
    '<div class="d-flex align-items-center justify-content-between flex-wrap">' + notice +
    '<div>' + btn + '</div></div>' +
    '<div class="mt-3" id="noticeDetailDeliveries"><div class="text-muted small">Loading matching deliveries…</div></div>' +
    '</div>';
}

/* Renders one page of this notice's deliveries, with a checkbox per row and a pager.
   selected is a map of deliveryId -> row, kept across pages by noticeWorkspace.js. */
function noticeDetailDeliveriesTableHtml(rows, total, page, totalPages, pageSize, selected, selectAllMatching) {
  if (!rows.length) {
    return '<div class="text-muted small">No deliveries match the ticked filters.</div>';
  }
  var selectable = rows.filter(function (r) { return r.deliveryId != null; });
  var allOnPage = selectAllMatching || (selectable.length > 0 && selectable.every(function (r) { return selected[r.deliveryId]; }));
  var selectAllTitle = total > rows.length
    ? "Select all " + fmt(total) + " matching rows (all pages)"
  : "Select all matching rows";
  var head = '<thead><tr>' +
    '<th style="width:32px"><input type="checkbox" title="' + esc(selectAllTitle) + '"' + (allOnPage ? " checked" : "") +
    ' onchange="toggleNoticeDetailSelectAllMatching(this.checked)"></th>' +
    '<th>Recipient</th><th>Channel</th><th>Subject</th><th>Status</th><th>Updated</th></tr></thead>';
  var body = rows.map(function (r) {
    var recipient = esc(r.recipientName || r.recipientEmail || (r.recipientUserId != null ? "User " + r.recipientUserId : "—"));
    var sub = r.recipientEmail && r.recipientName ? '<div class="text-muted small">' + esc(r.recipientEmail) + "</div>" : "";
    var opened = r.emailOpened ? ' <span class="badge badge-success">Opened</span>' : "";
    var remark = r.statusRemark ? '<div class="text-muted small">' + esc(r.statusRemark) + "</div>" : "";
    var box = r.deliveryId != null
      ? '<input type="checkbox" class="nd-row-select" value="' + r.deliveryId + '"' + (selected[r.deliveryId] ? " checked" : "") +
        ' onchange="toggleNoticeDetailRowSelection(' + r.deliveryId + ', this.checked)">'
      : "";
    return "<tr><td>" + box + "</td><td>" + recipient + sub + "</td>" +
      "<td>" + esc(channelName(r.channel)) + "</td>" +
      "<td>" + esc(r.emailSubject || "—") + "</td>" +
      "<td>" + esc(r.deliveryStatus || "—") + opened + remark + "</td>" +
      "<td>" + (r.updatedAt ? fmtDateTime(r.updatedAt) : "—") + "</td></tr>";
  }).join("");
  var from = (page - 1) * pageSize + 1;
  var to = from + rows.length - 1;
  var pageSizeOpts = [25, 50, 100].map(function (n) {
    return '<option value="' + n + '"' + (n === pageSize ? ' selected' : '') + '>' + n + '</option>';
  }).join('');
  var pager = '<div class="mt-2">' +
    '<div class="text-muted small">Showing ' + fmt(from) + "–" + fmt(to) + " of " + fmt(total) + " row" + (total !== 1 ? "s" : "") +
    '<span id="ndSelectionInfo"></span></div>' +
    '<div class="d-flex align-items-center justify-content-between flex-wrap mt-2" style="gap:8px">' +
    (totalPages > 1
      ? '<div class="btn-group btn-group-sm">' +
        '<button class="btn btn-outline-secondary"' + (page <= 1 ? " disabled" : "") + ' onclick="gotoNoticeDetailPage(' + (page - 1) + ')">&lsaquo; Prev</button>' +
        '<button class="btn btn-outline-secondary" disabled>Page ' + fmt(page) + " of " + fmt(totalPages) + "</button>" +
        '<button class="btn btn-outline-secondary"' + (page >= totalPages ? " disabled" : "") + ' onclick="gotoNoticeDetailPage(' + (page + 1) + ')">Next &rsaquo;</button>' +
        "</div>"
      : '<div></div>') +
    '<span class="text-muted small">Show <select class="custom-select custom-select-sm d-inline-block" style="width:auto" ' +
    'onchange="changeNoticeDetailPageSize(parseInt(this.value,10))">' + pageSizeOpts + '</select> per page</span>' +
    "</div></div>";
  return '<div class="table-responsive" style="max-height:300px"><table class="table table-sm table-hover mb-0">' +
    head + "<tbody>" + body + "</tbody></table></div>" + pager;
}
