/* =========================================================
   noticeAcknowledgmentLedgerContent.js
   HTML generation for the Acknowledgment Ledger view, the
   per-notice ledger modal and the signed-copy certificate.
   Plain string-returning functions.
   ========================================================= */

const LEDGER_ACTION_BADGE = { accepted: "success", declined: "danger", skipped: "secondary", pending: "info" };

function renderAcknowledgmentLedgerPageContent(){
  loadWorkspaceNotices(function () {
    $('#dashboardContentInHTML').html(acknowledgmentLedgerPageHtml());
    drawLedgerRows("");
  });
}

function acknowledgmentLedgerPageHtml() {
  const exportBtn = `<button class="btn btn-light" onclick="exportLedgerAudit()">&#8681; Export audit</button>`;

  return `
    ${pageHead(
      "pe-7s-check",
      "Acknowledgment Ledger",
      "Every notice and its immutable acknowledgment record — versioned, timestamped, located",
      exportBtn
    )}

    <div class="alert alert-info">
      &#8505; Open a notice's ledger to see
      <b>every user who acknowledged, declined, skipped or is pending</b>
      — each with the exact declaration version they saw, UTC + local timestamp,
      IP-derived location, device, and the signed PDF copy where applicable.
    </div>

    <div class="card mb-4">
      <div class="card-body">
        <div class="d-flex flex-wrap align-items-center mb-3">
          <div class="input-group mr-auto mb-2 mb-sm-0 col-12 col-md-5 px-0">
            <input
              type="text"
              class="form-control"
              placeholder="Search notices…"
              oninput="filterLedger(event)"
            >
          </div>

          <div class="text-muted small">
            All notices; those requiring acknowledgment expose a full record
          </div>
        </div>

        <div class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>Notice</th>
                <th>Type</th>
                <th>Priority</th>
                <th>Audience</th>
                <th>Ack.</th>
                <th>Scheduled / sent</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody id="ledgerNoticeRows"></tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function acknowledgmentLedgerRowsHtml(list) {
  if (!list.length) {
    return `
      <tr>
        <td colspan="8" class="text-center text-muted py-5">
          No notices found.
        </td>
      </tr>
    `;
  }

  return list.map(function (n) {
    return "<tr>" +
      "<td><b>" + esc(n.title || "(untitled)") + '</b><div class="text-muted small">NT-' + n.id + " · created " + fmtDateTime(n.created) + "</div></td>" +
      "<td>" + esc(n.typeName || "—") + "</td>" +
      "<td>" + prioLabel(n.prio) + "</td>" +
      '<td class="small">' + esc(n.roleNames || "—") + "</td>" +
      "<td>" + (n.ack ? ackBadge(n.enforce) : '<span class="text-muted">Not required</span>') + "</td>" +
      "<td class=\"small\">" + (n.sendAt ? fmtDateTime(n.sendAt) : "—") + "</td>" +
      "<td>" + statusPill(n.status) + "</td>" +
      '<td><button class="btn btn-outline-primary btn-sm" onclick="viewLedger(this)" data-id="' + n.id + '">View Ledger</button></td>' +
      "</tr>";
  }).join("");
}

function acknowledgmentLedgerModalBodyHtml(n, recs) {
  const title = (n && n.title) || "(untitled)";
  const roleNames = (n && n.roleNames) || "—";
  const sendAt = (n && n.sendAt) ? fmtDateTime(n.sendAt) : "—";
  const ackEnforce = n && n.enforce;
  const hasAck = n && n.ack;

  const ackCell = hasAck
    ? '<span class="badge badge-' + ((ackEnforce || "soft") === "hard" ? "danger" : "info") + '">' +
        ((ackEnforce || "soft") === "hard" ? "Hard — blocking" : "Soft — skippable") + "</span>"
    : '<span class="text-muted">Not required for this notice</span>';

  let head = kvTable([
    ["Notice", "<b>NT-" + (n && n.id) + "</b> — " + esc(title)],
    ["Audience", esc(roleNames)],
    ["Acknowledgment", ackCell],
    ["Scheduled / sent", sendAt]
  ]);

  if (recs && recs.length) {
    const accepted = recs.filter(function (r) { return (r.action || "").toLowerCase() === "accepted"; }).length;
    const declined = recs.filter(function (r) { return (r.action || "").toLowerCase() === "declined"; }).length;
    const skipped  = recs.filter(function (r) { return (r.action || "").toLowerCase() === "skipped"; }).length;
    const pending  = recs.filter(function (r) { return (r.action || "pending").toLowerCase() === "pending"; }).length;
    head += '<div class="d-flex flex-wrap small mb-3">' +
      '<span class="text-success mr-3">Accepted <b>' + accepted + "</b></span>" +
      '<span class="text-danger mr-3">Declined <b>' + declined + "</b></span>" +
      '<span class="text-warning mr-3">Skipped <b>' + skipped + "</b></span>" +
      '<span class="text-primary mr-3">Pending <b>' + pending + "</b></span>" +
      "</div>";
  }

  if (!hasAck) {
    return head + '<div class="alert alert-warning mb-0">&#8505; This notice did not require acknowledgment.</div>';
  }
  if (!recs || !recs.length) {
    return head + '<div class="alert alert-info mb-0">&#8505; No acknowledgment events captured yet.</div>';
  }

  const rows = recs.map(function (r) {
    const action = (r.action || "pending").toLowerCase();
    return "<tr>" +
      "<td><b>" + esc(r.userName || "—") + "</b></td>" +
      "<td>" + esc(r.userRole || "—") + "</td>" +
      '<td><span class="badge badge-' + (LEDGER_ACTION_BADGE[action] || "secondary") + '">' + action + "</span>" +
        (r.skipCount ? '<div class="text-muted small">' + r.skipCount + " skip(s)</div>" : "") + "</td>" +
      "<td class=\"small\">" + (r.ackAtUtc ? String(r.ackAtUtc).replace("T", " ").substring(0, 19) + " UTC" : "—") + "</td>" +
      "<td class=\"small\">" + esc(r.ackAtLocal || "—") + "</td>" +
      '<td class="small text-monospace">' + esc(r.ipAddress || "—") + "</td>" +
      "<td>" + esc(r.geoLocation || "—") + "</td>" +
      '<td class="text-muted small">' + esc(r.device || "—") + "</td>" +
      "</tr>";
  }).join("");

  return head + '<div class="table-responsive"><table class="table table-sm table-hover">' +
    "<thead><tr><th>User</th><th>Role</th><th>Action</th><th>Ack at (UTC)</th><th>Local time</th><th>IP address</th><th>Location</th><th>Device</th></tr></thead>" +
    "<tbody>" + rows + "</tbody></table></div>";
}

function acknowledgmentLedgerPdfBodyHtml(n, r) {
  return '<div class="card">' +
    '<div class="card-header bg-white"><div class="h5 mb-0">&#128205; International Schooling <sup>&reg;</sup></div><div class="text-muted small">Your Location. Your School. Your Time.</div></div>' +
    '<div class="card-body">' +
      kvTable([
        ["Document", "<b>" + esc(n.title) + '</b> <span class="text-muted small">(' + n.id + ")</span>"],
        ["Declaration version", r.ver],
        ["Signatory", "<b>" + esc(r.user) + "</b> — " + r.role]
      ]) +
      '<div class="alert alert-light border mt-2"><input type="checkbox" checked disabled> I have read, understood, and agree to all terms and conditions in this document.</div>' +
      '<div class="text-muted small mt-2">I understand that this acknowledgment is digitally signed and does not require a physical signature.</div>' +
      kvTable([
        ["Accepted on", "<b>" + r.when + "</b>"],
        ["Local time", r.local],
        ["Location", r.loc],
        ["IP address", '<span class="text-monospace">' + r.ip + "</span>"],
        ["Device / client", r.device]
      ]) +
      '<div class="mt-4">For International Schooling<br><span class="text-muted small">Authorized Signatory — Associate Director</span></div>' +
    "</div></div>" +
    '<div class="alert alert-info mt-3">&#128274; This is an immutable, system-generated copy. The declaration text is snapshotted to the version the user actually saw.</div>';
}
