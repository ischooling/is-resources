/* =========================================================
   noticeAcknowledgmentLedger.js
   Ledger behaviour: search, per-notice drill-down, CSV export.
   Console-callable: renderAcknowledgmentLedger(), viewLedger(1043)
   ========================================================= */

function renderAcknowledgmentLedger() {
  renderAcknowledgmentLedgerPageContent();
}

function drawLedgerRows(q) {
  const query = (q || "").toLowerCase();
  const list = WORKSPACE_NOTICES.filter(function (n) {
    return !query || (n.title || "").toLowerCase().includes(query) || String(n.id).includes(query);
  });
  const tbody = document.getElementById("ledgerNoticeRows");
  if (tbody) tbody.innerHTML = acknowledgmentLedgerRowsHtml(list);
}

function filterLedger(e) { drawLedgerRows(e.currentTarget.value); }

function viewLedger(arg) {
  const id = arg && arg.dataset ? arg.dataset.id : arg;
  const cached = WORKSPACE_NOTICES.find(function (n) { return String(n.id) === String(id); });
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLForNotice("ack/ledger-get"),
    data: JSON.stringify({ noticeId: parseInt(id, 10) }),
    dataType: "json",
    success: function (rows) {
      const footer = rows.length ? '<button class="btn btn-primary" onclick="exportNoticeLedger(event)" data-id="' + id + '">&#8681; Export</button>' : "";
      openModal("NT-" + id + " · Acknowledgment ledger",
        acknowledgmentLedgerModalBodyHtml(cached, rows),
        footer, { wide: true });
    },
    error: function () { toast("Could not load ledger.", "err"); }
  });
}

function exportLedgerAudit() {
  const rows = [["Notice ID", "Title", "User", "Role", "Action", "Skip count", "Ack at (UTC)", "Ack at (local)", "IP address", "Location", "Device"]];
  WORKSPACE_NOTICES.forEach(function (n) {
    rows.push([n.id, n.title || "", "", "", "", "", "", "", "", "", ""]);
  });
  downloadCSV("acknowledgment-ledger.csv", rows);
}

function exportNoticeLedger(arg) {
  const id = arg && arg.currentTarget ? arg.currentTarget.dataset.id : arg;
  toast("Export queued for NT-" + id, "ok");
}
