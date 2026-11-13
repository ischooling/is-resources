/* =========================================================
   noticeWorkspace.js
   Notices Workspace behaviour. Also owns openWorkspaceNotice,
   used by the Dashboard's recent-activity rows.
   Console-callable: renderWorkspace(), drawWorkspaceRows("fee"),
   openWorkspaceNotice("NT-1048")
   Delegated handlers accept either an id string or the clicked
   element, so they work both from the console and from clicks.
   ========================================================= */

var _workspacePage = 1;
var _deliveryIndex = {};
var _workspaceFilteredIds = [];

function renderWorkspace() {
  _workspacePage = 1;
  $("#dashboardContentInHTML").html(workspacePageHtml(S.noticeTab));
  drawWorkspaceRows("");
}

function deliveryFiltersActive() {
  ensureCommunicationInboxState();
  var st = S.communicationInbox;
  return !!(st.channel || st.subjectContains || st.noticeQuery || (st.statusFilters && st.statusFilters.length));
}

function applyDeliveryMeta(n) {
  var slot = _deliveryIndex[String(n.id)];
  n.emailOpened = false;
  n.channelLabel = "";
  n.recipientLabel = "";
  n.emailSubject = "";
  n.deliveryDetail = "";
  n.resendDeliveryId = null;
  n.undeliveredCount = 0;
  if (!slot) return;
  n.undeliveredCount = slot.undelivered;
  n.emailOpened = !!slot.emailOpened;
  n.channelLabel = slot.channels.join(", ");
  n.recipientLabel = slot.recipients.length > 2
    ? slot.recipients.slice(0, 2).join(", ") + " +" + (slot.recipients.length - 2)
    : slot.recipients.join(", ");
  n.emailSubject = slot.subjects.join(", ");
  n.deliveryDetail = slot.remarks.join(" · ");
  if (slot.deliveryIds.length === 1) n.resendDeliveryId = slot.deliveryIds[0];
}

function drawWorkspaceRows(q) {
  const query = (q || "").toLowerCase();
  const useDeliveryFilter = deliveryFiltersActive();
  const filtered = WORKSPACE_NOTICES.filter(function (n) {
    applyDeliveryMeta(n);
    if (useDeliveryFilter && !_deliveryIndex[String(n.id)]) return false;
    return (S.noticeTab === "all" || n.status === S.noticeTab) &&
      (!query || (n.title || "").toLowerCase().includes(query) || String(n.id).includes(query));
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / WORKSPACE_PAGE_SIZE));
  if (_workspacePage > totalPages) _workspacePage = totalPages;
  const start = (_workspacePage - 1) * WORKSPACE_PAGE_SIZE;
  const page = filtered.slice(start, start + WORKSPACE_PAGE_SIZE);

  const tbody = document.getElementById("noticeRows");
  if (tbody) tbody.innerHTML = workspaceRowsHtml(page);

  _workspaceFilteredIds = filtered.map(function (n) { return n.id; });
  const resendBtn = document.getElementById("workspaceResendFilteredBtn");
  if (resendBtn) resendBtn.classList.toggle("d-none", !(useDeliveryFilter && filtered.length));

  const label = document.getElementById("workspaceCountLabel");
  if (label) label.textContent = "Showing " + filtered.length + " notice" + (filtered.length !== 1 ? "s" : "");

  const pag = document.getElementById("workspacePagination");
  if (pag) pag.innerHTML = workspacePaginationHtml(totalPages, _workspacePage);

  if (tbody) applyWidths(tbody);
}

function gotoWorkspacePage(p) { _workspacePage = p; drawWorkspaceRows(""); }

function idFrom(arg) {
  if (arg && arg.currentTarget) return arg.currentTarget.dataset.id;
  if (arg && arg.dataset) return arg.dataset.id;
  return arg;
}

function setWorkspaceTab(e) { S.noticeTab = e.currentTarget.dataset.tab; renderWorkspace(); }

function ensureCommunicationInboxState() {
  if (!S.communicationInbox) {
    S.communicationInbox = { page: 1, channel: "", subjectContains: "", noticeQuery: "", statusFilters: [] };
  }
  if (!S.communicationInbox.statusFilters) {
    S.communicationInbox.statusFilters = [];
  }
}

function readCommunicationInboxStatusFilters() {
  var filters = [];
  NOTICE_DELIVERY_STATUS_FILTERS.forEach(function (pair) {
    var el = document.getElementById("ndlFilter_" + pair[0]);
    if (el && el.checked) {
      filters.push(pair[0]);
    }
  });
  return filters;
}

function indexDeliveryRows(rows) {
  _deliveryIndex = {};
  (rows || []).forEach(function (r) {
    var id = String(r.noticeId);
    var slot = _deliveryIndex[id];
    if (!slot) {
      slot = { emailOpened: false, undelivered: 0, channels: [], recipients: [], subjects: [], remarks: [], deliveryIds: [] };
      _deliveryIndex[id] = slot;
    }
    if (r.emailOpened) slot.emailOpened = true;
    if (r.undelivered) slot.undelivered++;
    var channel = r.channel ? channelName(r.channel) : "";
    if (channel && slot.channels.indexOf(channel) === -1) slot.channels.push(channel);
    var recip = r.recipientName || r.recipientEmail || (r.recipientUserId != null ? "User " + r.recipientUserId : "");
    if (recip && slot.recipients.indexOf(recip) === -1) slot.recipients.push(recip);
    if (r.emailSubject && slot.subjects.indexOf(r.emailSubject) === -1) slot.subjects.push(r.emailSubject);
    if (r.statusRemark && slot.remarks.indexOf(r.statusRemark) === -1) slot.remarks.push(r.statusRemark);
    if (r.deliveryId != null && slot.deliveryIds.indexOf(r.deliveryId) === -1) slot.deliveryIds.push(r.deliveryId);
  });
}

var COMMUNICATION_INBOX_FETCH_SIZE = 500;
var COMMUNICATION_INBOX_MAX_PAGES = 10;
var _communicationInboxRequest = 0;

/* Loads every delivery row matching the filters (500 per request, up to 5,000) so the
   notice list is filtered on all matches, not just the first page. Without delivery
   filters only the first page is needed, for the channel/recipient hints. */
function loadCommunicationInbox() {
  ensureCommunicationInboxState();
  var st = S.communicationInbox;
  var requestId = ++_communicationInboxRequest;
  var maxPages = deliveryFiltersActive() ? COMMUNICATION_INBOX_MAX_PAGES : 1;
  var collected = [];

  function fetchPage(page) {
    $.ajax({
      type: "POST",
      contentType: APPLICATION_JSON_VALUE,
      url: getURLForNotice("workspace/communication-inbox/search"),
      data: JSON.stringify({
        page: page,
        pageSize: COMMUNICATION_INBOX_FETCH_SIZE,
        channel: st.channel || "",
        subjectContains: st.subjectContains || "",
        noticeQuery: st.noticeQuery || "",
        statusFilters: st.statusFilters || []
      }),
      dataType: "json",
      success: function (resp) {
        if (requestId !== _communicationInboxRequest) return;
        var rows = (resp && resp.rows) ? resp.rows : [];
        collected = collected.concat(rows);
        var totalPages = (resp && resp.totalPages) || 1;
        if (page < totalPages && page < maxPages && rows.length) {
          fetchPage(page + 1);
          return;
        }
        if (maxPages > 1 && page < totalPages) {
          toast("Showing the first " + fmt(collected.length) + " matching deliveries. Narrow the filters to see the rest.", "err");
        }
        indexDeliveryRows(collected);
        if (document.getElementById("noticeRows")) {
          drawWorkspaceRows("");
        }
      },
      error: function () {
        if (requestId !== _communicationInboxRequest) return;
        toast("Could not load delivery details.", "err");
      }
    });
  }
  fetchPage(1);
}

function applyCommunicationInboxFilters() {
  ensureCommunicationInboxState();
  var st = S.communicationInbox;
  var chEl = document.getElementById("commInboxChannel");
  var subEl = document.getElementById("commInboxSubject");
  var nEl = document.getElementById("commInboxNotice");
  st.channel = chEl ? chEl.value : "";
  st.subjectContains = subEl ? subEl.value.trim() : "";
  st.noticeQuery = nEl ? nEl.value.trim() : "";
  st.statusFilters = readCommunicationInboxStatusFilters();
  st.page = 1;
  _workspacePage = 1;
  loadCommunicationInbox();
}

function resendNoticeDelivery(e) {
  var deliveryId = e && e.currentTarget ? e.currentTarget.getAttribute("data-delivery-id") : e;
  if (!deliveryId) {
    return;
  }
  if (!confirm("Resend this notice delivery to the same recipient on the same channel?")) {
    return;
  }
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLForNotice("workspace/delivery-log/resend"),
    data: JSON.stringify({ deliveryId: parseInt(deliveryId, 10) }),
    dataType: "json",
    success: function () {
      toast("Resend queued.", "success");
      loadCommunicationInbox();
      loadWorkspaceNotices(function () { });
    },
    error: function (xhr) {
      var msg = (xhr.responseJSON && xhr.responseJSON.message) ? xhr.responseJSON.message : "Could not resend.";
      toast(msg, "err");
    }
  });
}

function resendFilteredDeliveries() {
  ensureCommunicationInboxState();
  var st = S.communicationInbox;
  if (!deliveryFiltersActive() || !_workspaceFilteredIds.length) {
    toast("Apply a delivery filter first.", "err");
    return;
  }
  var n = _workspaceFilteredIds.length;
  if (!confirm("Resend all deliveries matching the current filters for " + n + " notice" + (n !== 1 ? "s" : "") +
      "? Deliveries already queued are skipped.")) {
    return;
  }
  var btn = document.getElementById("workspaceResendFilteredBtn");
  if (btn) btn.disabled = true;
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLForNotice("workspace/delivery-log/resend-filtered"),
    data: JSON.stringify({
      channel: st.channel || "",
      subjectContains: st.subjectContains || "",
      noticeQuery: st.noticeQuery || "",
      statusFilters: st.statusFilters || [],
      noticeIds: _workspaceFilteredIds.map(function (id) { return parseInt(id, 10); })
    }),
    dataType: "json",
    success: function (resp) {
      var q = (resp && resp.queued) || 0;
      var msg = "Resend queued for " + q + " deliver" + (q !== 1 ? "ies" : "y") + " across " + ((resp && resp.notices) || 0) + " notice(s).";
      if (resp && resp.skipped) msg += " " + resp.skipped + " skipped (notice not sent yet).";
      if (resp && resp.capped) msg += " Limit reached; run again for the rest.";
      toast(msg, "success");
      loadCommunicationInbox();
      loadWorkspaceNotices(function () { });
    },
    error: function (xhr) {
      var msg = (xhr.responseJSON && xhr.responseJSON.message) ? xhr.responseJSON.message : "Could not resend.";
      toast(msg, "err");
    },
    complete: function () { if (btn) btn.disabled = false; }
  });
}

function describeResendCounts(resp) {
  var parts = [];
  var byChannel = (resp && resp.byChannel) || {};
  Object.keys(byChannel).forEach(function (ch) {
    parts.push(fmt(byChannel[ch]) + " " + esc(channelName(ch)));
  });
  return parts.join(", ");
}

function resendUndeliveredNotice(arg) {
  var id = idFrom(arg);
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLForNotice("workspace/resend-undelivered"),
    data: JSON.stringify({ id: parseInt(id, 10), dryRun: true }),
    dataType: "json",
    success: function (resp) {
      var q = (resp && resp.queued) || 0;
      if (!q) {
        toast("Every recipient of NT-" + id + " got this notice. Nothing to resend.", "success");
        return;
      }
      var body = "<p>Send NT-" + esc(String(id)) + " again only to the <b>" + fmt(q) + "</b> deliver" + (q !== 1 ? "ies" : "y") +
        " that did not reach the recipient (" + describeResendCounts(resp) + ").</p>";
      if (resp.emailProviderFailed) {
        body += '<p class="text-muted small">' + fmt(resp.emailProviderFailed) +
          " of these are emails SendGrid bounced, blocked or dropped. Addresses on the suppression list may be dropped again.</p>";
      }
      if (resp.capped) body += '<p class="text-muted small">Only the first 5,000 are sent now; run it again for the rest.</p>';
      openModal("Resend undelivered", body,
        '<button class="btn btn-light" onclick="closeModal()">Cancel</button>' +
        '<button class="btn btn-warning" onclick="confirmResendUndelivered(event)" data-id="' + esc(String(id)) + '">Resend to ' + fmt(q) + "</button>");
    },
    error: function (xhr) {
      var msg = (xhr.responseJSON && xhr.responseJSON.message) ? xhr.responseJSON.message : "Could not check undelivered recipients.";
      toast(msg, "err");
    }
  });
}

function confirmResendUndelivered(arg) {
  var id = idFrom(arg);
  var btn = arg && arg.currentTarget;
  if (btn) btn.disabled = true;
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLForNotice("workspace/resend-undelivered"),
    data: JSON.stringify({ id: parseInt(id, 10) }),
    dataType: "json",
    success: function (resp) {
      closeModal();
      var q = (resp && resp.queued) || 0;
      toast("Resend queued for " + fmt(q) + " undelivered recipient" + (q !== 1 ? "s" : "") + ".", "success");
      loadCommunicationInbox();
      loadWorkspaceNotices(function () { drawWorkspaceRows(""); });
    },
    error: function (xhr) {
      if (btn) btn.disabled = false;
      var msg = (xhr.responseJSON && xhr.responseJSON.message) ? xhr.responseJSON.message : "Could not resend.";
      toast(msg, "err");
    }
  });
}

/* Read the modal's ticked delivery statuses. */
function readNoticeDetailStatusFilters() {
  var picks = [];
  $(document).find("input.nd-modal-filter:checked").each(function () { picks.push(this.value); });
  return picks;
}

/* View-modal delivery list state: current notice, page, and the rows ticked (deliveryId -> row, kept across pages). */
var ND_PAGE_SIZE = 25;
var _nd = {
  noticeId: null, page: 1, totalPages: 1, totalMatching: 0,
  rows: [], selected: {}, selectAllMatching: false
};

function resetNoticeDetailState(noticeId) {
  _nd = {
    noticeId: noticeId, page: 1, totalPages: 1, totalMatching: 0,
    rows: [], selected: {}, selectAllMatching: false
  };
}

function noticeDetailSelectedIds() {
  return Object.keys(_nd.selected).map(function (k) { return parseInt(k, 10); });
}

/* A status change re-scopes the list, so the old selection no longer applies. */
function onNoticeDetailFilterChange(noticeId) {
  resetNoticeDetailState(noticeId);
  loadNoticeDetailDeliveries(noticeId);
}

function gotoNoticeDetailPage(page) {
  if (page < 1 || page > _nd.totalPages) return;
  _nd.page = page;
  loadNoticeDetailDeliveries(_nd.noticeId);
}

function changeNoticeDetailPageSize(size) {
  ND_PAGE_SIZE = size;
  _nd.page = 1;
  loadNoticeDetailDeliveries(_nd.noticeId);
}

function toggleNoticeDetailRowSelection(deliveryId, checked) {
  if (!checked) _nd.selectAllMatching = false;
  var row = _nd.rows.find(function (r) { return r.deliveryId === deliveryId; });
  if (checked && row) _nd.selected[deliveryId] = row;
  else delete _nd.selected[deliveryId];
  syncNoticeDetailSelectionUi();
}

/** Header checkbox: all rows matching current filters (every page), not only this page. */
function toggleNoticeDetailSelectAllMatching(checked) {
  _nd.selectAllMatching = !!checked;
  if (checked) {
    _nd.rows.forEach(function (r) {
      if (r.deliveryId != null) _nd.selected[r.deliveryId] = r;
    });
    $(document).find("input.nd-row-select").prop("checked", true);
  } else {
    _nd.selected = {};
    $(document).find("input.nd-row-select").prop("checked", false);
  }
  syncNoticeDetailSelectionUi();
}

function clearNoticeDetailSelection() {
  _nd.selected = {};
  _nd.selectAllMatching = false;
  $(document).find("input.nd-row-select").prop("checked", false);
  syncNoticeDetailSelectionUi();
}

function noticeDetailUsesAllMatchingSelection() {
  return _nd.selectAllMatching && _nd.totalMatching > 0;
}

/* Button labels and the "N selected" note follow the selection. */
function syncNoticeDetailSelectionUi() {
  var allMatching = noticeDetailUsesAllMatchingSelection();
  var n = allMatching ? _nd.totalMatching : noticeDetailSelectedIds().length;
  var resendBtn = document.getElementById("ndResendBtn");
  if (resendBtn) resendBtn.textContent = n ? "Resend selected (" + fmt(n) + ")" : "Resend matching";
  var exportBtn = document.getElementById("ndExportBtn");
  if (exportBtn) exportBtn.textContent = n ? "Export selected (" + fmt(n) + ")" : "Export";
  var info = document.getElementById("ndSelectionInfo");
  if (info) {
    if (allMatching) {
      info.innerHTML = ' · <b>All ' + fmt(_nd.totalMatching) + '</b> matching selected · ' +
        '<a href="javascript:void(0)" onclick="clearNoticeDetailSelection()">Clear</a>';
    } else if (n) {
      info.innerHTML = ' · <b>' + fmt(n) + "</b> selected · " +
        '<a href="javascript:void(0)" onclick="clearNoticeDetailSelection()">Clear</a>';
    } else {
      info.innerHTML = "";
    }
  }
  var pageBox = $(document).find("#noticeDetailDeliveries thead input[type=checkbox]");
  var onPage = _nd.rows.filter(function (r) { return r.deliveryId != null; });
  pageBox.prop("checked", allMatching || (onPage.length > 0 && onPage.every(function (r) { return _nd.selected[r.deliveryId]; })));
}

/* Called by the Resend button inside the View modal. With rows ticked it resends only those; otherwise every match. */
function resendNoticeFromModal(noticeId) {
  var statusFilters = readNoticeDetailStatusFilters();
  if (!statusFilters.length) {
    toast("Tick at least one delivery status to resend.", "err");
    return;
  }
  var useAllMatching = String(_nd.noticeId) === String(noticeId) && noticeDetailUsesAllMatchingSelection();
  var deliveryIds = useAllMatching ? [] : (String(_nd.noticeId) === String(noticeId) ? noticeDetailSelectedIds() : []);
  var payload = { noticeIds: [parseInt(noticeId, 10)], noticeId: parseInt(noticeId, 10), statusFilters: statusFilters, dryRun: true };
  if (deliveryIds.length) payload.deliveryIds = deliveryIds;
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLForNotice("workspace/delivery-log/resend-filtered"),
    data: JSON.stringify(payload),
    dataType: "json",
    success: function (resp) {
      var q = (resp && resp.queued) || 0;
      if (!q) {
        toast(deliveryIds.length
          ? "None of the selected deliveries can be resent (already queued, or the notice is not sent yet)."
          : "No deliveries match the ticked filters for NT-" + noticeId + ".", "err");
        return;
      }
      var body;
      if (useAllMatching) {
        body = "<p>Re-queue <b>" + fmt(q) + "</b> deliver" + (q !== 1 ? "ies" : "y") +
          " for NT-" + esc(String(noticeId)) + " (all " + fmt(_nd.totalMatching) + " matching the ticked filters; " +
          describeResendCounts(resp) + ").</p>";
      } else if (deliveryIds.length) {
        body = "<p>Re-queue <b>" + fmt(q) + "</b> selected deliver" + (q !== 1 ? "ies" : "y") +
          " for NT-" + esc(String(noticeId)) + " (" + describeResendCounts(resp) + ").</p>";
        if (q < deliveryIds.length) {
          body += '<p class="text-muted small">' + fmt(deliveryIds.length - q) +
            " selected deliver" + (deliveryIds.length - q !== 1 ? "ies are" : "y is") + " already queued and will be skipped.</p>";
        }
      } else {
        var labels = statusFilters.map(function (c) {
          var pair = NOTICE_DELIVERY_STATUS_FILTERS.find(function (p) { return p[0] === c; });
          return pair ? pair[1].replace(/\s*\(.*\)$/, "") : c;
        }).join(", ");
        body = "<p>Re-queue <b>" + fmt(q) + "</b> deliver" + (q !== 1 ? "ies" : "y") +
          " for NT-" + esc(String(noticeId)) + " matching: <b>" + esc(labels) + "</b> (" + describeResendCounts(resp) + ").</p>";
      }
      if (resp.capped) body += '<p class="text-muted small">Only the first 5,000 are sent now; run it again for the rest.</p>';
      _pendingResendNoticeId = noticeId;
      _pendingResendStatusFilters = statusFilters;
      _pendingResendDeliveryIds = useAllMatching ? [] : deliveryIds;
      _pendingResendAllMatching = useAllMatching;
      openModal(useAllMatching || deliveryIds.length ? "Resend selected" : "Resend matching", body,
        '<button class="btn btn-light" onclick="closeModal()">Cancel</button>' +
        '<button class="btn btn-warning" onclick="confirmResendNoticeFromModal()">Resend ' + fmt(q) + '</button>');
    },
    error: function (xhr) {
      var msg = (xhr.responseJSON && xhr.responseJSON.message) ? xhr.responseJSON.message : "Could not check the deliveries.";
      toast(msg, "err");
    }
  });
}

var _noticeDetailDeliveriesRequest = 0;

/* Loads one page of this notice's delivery rows matching the modal's ticked filters and renders them. */
function loadNoticeDetailDeliveries(noticeId) {
  var box = document.getElementById("noticeDetailDeliveries");
  if (!box) return;
  if (String(_nd.noticeId) !== String(noticeId)) resetNoticeDetailState(noticeId);
  var statusFilters = readNoticeDetailStatusFilters();
  if (!statusFilters.length) {
    _nd.rows = [];
    box.innerHTML = '<div class="text-muted small">Tick a status to see matching deliveries.</div>';
    syncNoticeDetailSelectionUi();
    return;
  }
  box.innerHTML = '<div class="text-muted small">Loading matching deliveries…</div>';
  var reqId = ++_noticeDetailDeliveriesRequest;
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLForNotice("workspace/communication-inbox/search"),
    data: JSON.stringify({ page: _nd.page, pageSize: ND_PAGE_SIZE, channel: "", subjectContains: "",
      noticeId: parseInt(noticeId, 10), statusFilters: statusFilters }),
    dataType: "json",
    success: function (resp) {
      if (reqId !== _noticeDetailDeliveriesRequest) return;
      var rows = (resp && resp.rows) || [];
      var total = (resp && resp.total) || 0;
      _nd.totalMatching = total;
      _nd.totalPages = Math.max(1, (resp && resp.totalPages) || 1);
      if (!rows.length && _nd.page > 1 && total > 0) {
        _nd.page = _nd.totalPages;
        loadNoticeDetailDeliveries(noticeId);
        return;
      }
      _nd.rows = rows;
      if (_nd.selectAllMatching) {
        rows.forEach(function (r) {
          if (r.deliveryId != null) _nd.selected[r.deliveryId] = r;
        });
      }
      box.innerHTML = noticeDetailDeliveriesTableHtml(rows, total, _nd.page, _nd.totalPages, ND_PAGE_SIZE, _nd.selected, _nd.selectAllMatching);
      syncNoticeDetailSelectionUi();
    },
    error: function () {
      if (reqId !== _noticeDetailDeliveriesRequest) return;
      box.innerHTML = '<div class="small text-danger">Could not load deliveries.</div>';
    }
  });
}

function noticeDeliveriesCsv(noticeId, rows) {
  var header = ["Notice ID", "Notice Title", "Recipient User ID", "Recipient Name", "Recipient Email",
    "Channel", "Email Subject", "Delivery Status", "Status Remark", "Retry Count", "Email Opened",
    "Delivered At", "Last Updated At"];
  var data = rows.map(function (r) {
    return [r.noticeId, r.noticeTitle, r.recipientUserId, r.recipientName, r.recipientEmail,
      channelName(r.channel), r.emailSubject, r.deliveryStatus, r.statusRemark, r.retryCount,
      r.emailOpened ? "Yes" : "No",
      r.deliveredAt ? fmtDateTime(r.deliveredAt) : "",
      r.updatedAt ? fmtDateTime(r.updatedAt) : ""];
  });
  var ts = new Date().toISOString().slice(0, 19).replace(/[:T-]/g, "");
  downloadCSV("NT-" + noticeId + "-deliveries-" + ts + ".csv", [header].concat(data));
}

/* Export the ticked rows if any, otherwise every delivery row matching the modal's ticked filters, as CSV. */
function exportNoticeFromModal(noticeId) {
  if (String(_nd.noticeId) === String(noticeId) && !noticeDetailUsesAllMatchingSelection()) {
    var picked = noticeDetailSelectedIds().map(function (id) { return _nd.selected[id]; });
    if (picked.length) {
      noticeDeliveriesCsv(noticeId, picked);
      return;
    }
  }
  var statusFilters = readNoticeDetailStatusFilters();
  if (!statusFilters.length) {
    toast("Tick at least one delivery status to export.", "err");
    return;
  }
  var body = {
    page: 1,
    pageSize: 5000,
    channel: "",
    subjectContains: "",
    noticeId: parseInt(noticeId, 10),
    statusFilters: statusFilters
  };
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLForNotice("workspace/communication-inbox/search"),
    data: JSON.stringify(body),
    dataType: "json",
    success: function (resp) {
      var rows = (resp && resp.rows) || [];
      if (!rows.length) {
        toast("No deliveries match the ticked filters for NT-" + noticeId + ".", "err");
        return;
      }
      noticeDeliveriesCsv(noticeId, rows);
      if ((resp.total || 0) > rows.length) {
        toast("Exported first " + fmt(rows.length) + " rows of " + fmt(resp.total) + ".", "ok");
      }
    },
    error: function () { toast("Could not load deliveries for export.", "err"); }
  });
}

var _pendingResendNoticeId = null;
var _pendingResendStatusFilters = [];
var _pendingResendDeliveryIds = [];
var _pendingResendAllMatching = false;

function confirmResendNoticeFromModal() {
  var noticeId = _pendingResendNoticeId;
  var statusFilters = _pendingResendStatusFilters || [];
  var deliveryIds = _pendingResendDeliveryIds || [];
  if (!noticeId || !statusFilters.length) return;
  var payload = { noticeIds: [parseInt(noticeId, 10)], noticeId: parseInt(noticeId, 10), statusFilters: statusFilters };
  if (deliveryIds.length) payload.deliveryIds = deliveryIds;
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLForNotice("workspace/delivery-log/resend-filtered"),
    data: JSON.stringify(payload),
    dataType: "json",
    success: function (resp) {
      closeModal();
      var q = (resp && resp.queued) || 0;
      toast("Resend queued for " + fmt(q) + " deliver" + (q !== 1 ? "ies" : "y") + ".", "success");
      _pendingResendDeliveryIds = [];
      loadCommunicationInbox();
      loadWorkspaceNotices(function () { drawWorkspaceRows(""); });
    },
    error: function (xhr) {
      var msg = (xhr.responseJSON && xhr.responseJSON.message) ? xhr.responseJSON.message : "Could not resend.";
      toast(msg, "err");
    }
  });
}

function createWorkspaceNotice() { renderNoticeComposeContent(); }
function editWorkspaceDraft(e) { loadComposeNotice(idFrom(e)); }
function workspaceAckLedger() { closeModal(); callDashboardPageSchool('298','acknowledgment-ledger'); }

function deleteWorkspaceDraft(e) {
  const id = idFrom(e);
  if (!confirm("Delete this draft? This cannot be undone.")) return;
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLForNotice("workspace/delete"),
    data: JSON.stringify({ id: id }),
    dataType: "json",
    success: function () {
      const idx = WORKSPACE_NOTICES.findIndex(function (n) { return String(n.id) === String(id); });
      if (idx !== -1) WORKSPACE_NOTICES.splice(idx, 1);
      drawWorkspaceRows("");
      toast("Draft deleted.", "success");
    },
    error: function () { toast("Could not delete draft.", "err"); }
  });
}

function retryWorkspaceFailed(e) {
  const id = idFrom(e);
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLForNotice("workspace/retry-failed"),
    data: JSON.stringify({ id: id }),
    dataType: "json",
    success: function () {
      toast("Retry queued. Refresh in a moment.", "success");
      loadWorkspaceNotices(function () { drawWorkspaceRows(""); });
    },
    error: function () { toast("Could not queue retry.", "err"); }
  });
}

function sendAgainNotice(arg) {
  const id = idFrom(arg);
  openModal("Send again",
    "<p>Are you sure you want to send this notice again?</p>",
    '<button class="btn btn-light" onclick="closeModal()">No</button>' +
    '<button class="btn btn-success" onclick="confirmSendAgainNotice(event)" data-id="' + id + '">Yes</button>'
  );
}

function confirmSendAgainNotice(arg) {
  const id = idFrom(arg);
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLForNotice("workspace/send-again"),
    data: JSON.stringify({ id: id }),
    dataType: "json",
    success: function () {
      closeModal();
      toast("Notice queued to send again.", "success");
      loadWorkspaceNotices(function () { drawWorkspaceRows(""); });
    },
    error: function (xhr) {
      const msg = (xhr.responseJSON && xhr.responseJSON.message) ? xhr.responseJSON.message : "Could not send notice again.";
      toast(msg, "err");
    }
  });
}

function openWorkspaceNotice(arg) {
  const id = idFrom(arg);
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLForNotice("compose/get-detail"),
    data: JSON.stringify({ id: id }),
    dataType: "json",
    success: function (n) {
      const cached = WORKSPACE_NOTICES.find(function (x) { return String(x.id) === String(id); });
      openModal("NT-" + id + " · " + esc((cached && cached.title) || "(untitled)"), workspaceDetailBodyHtml(n), null, { wide: true });
      applyWidths(document.getElementById("nmsModalBody"));
      resetNoticeDetailState(id);
      if (document.getElementById("noticeDetailDeliveries")) loadNoticeDetailDeliveries(id);
    },
    error: function () { toast("Could not load the notice.", "err"); }
  });
}
