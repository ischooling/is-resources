/* =========================================================
   noticeOverrideConfigurationContent.js
   HTML generation for the Override Configuration view + rule form.
   Plain string-returning functions.
   ========================================================= */

const OVERRIDE_MATRIX = [
  ["&#128308; Critical", "warning", "Override"],
  ["&#128992; High", "warning", "Override"],
  ["&#128993; Normal", "info", "Queue &amp; release"],
  ["&#128994; Informational", "success", "Respect"]
];

function overrideRuleRowsHtml(rules) {
  if (!rules || !rules.length) return '<tr><td colspan="6" class="text-center text-muted py-4">No override rules yet.</td></tr>';
  return rules.map(function (o, i) {
    return "<tr>" +
      '<td><span class="badge badge-success">' + esc(o.roleName || "—") + "</span></td>" +
      "<td>" + (o.userName ? "<b>" + esc(o.userName) + "</b>" : '<span class="text-muted">All in role</span>') + "</td>" +
      "<td>" + esc(o.appliesTo || "—") + "</td><td>" + esc(o.effect || "—") + '</td><td class="text-muted small">' + esc(o.setBy || "—") + "</td>" +
      '<td><button class="btn btn-light btn-sm" onclick="editOverrideRule(event)" data-i="' + i + '">Edit</button></td></tr>';
  }).join("");
}

function overrideConfigurationPageHtml(rules) {
  const newBtn = '<button class="btn btn-primary" onclick="newOverrideRule()">&#43; New rule</button>';
  return pageHead("pe-7s-config", "Override Configuration", "Who bypasses quiet hours — by explicit role &amp; user selection", newBtn) +
    '<div class="alert alert-warning">&#9888; Override power is intentionally scoped — <b>no default layer</b>. It applies only to the roles and users you select. Because Critical bypasses everyone\'s quiet hours, the ability to send it should stay gated to these same roles and go through approval.</div>' +
    '<div class="card mb-4"><div class="card-body">' +
      '<h3 class="h5">Active override rules</h3><div class="text-muted small mb-3">Most-specific selection wins; nothing is implied</div>' +
      '<div class="table-responsive"><table class="table table-hover">' +
        "<thead><tr><th>Role</th><th>User</th><th>Applies to</th><th>Effect</th><th>Set by</th><th></th></tr></thead>" +
        "<tbody>" + overrideRuleRowsHtml(rules) + "</tbody></table></div>" +
    "</div></div>" +
    '<div class="card mb-4"><div class="card-body">' +
      '<h3 class="h5">Default priority behaviour</h3><div class="text-muted small mb-3">The fallback for quiet hours when no override rule applies to a recipient</div>' +
      '<div class="table-responsive"><table class="table table-sm w-auto"><thead><tr><th>Priority</th><th>Quiet hours</th></tr></thead><tbody>' +
        OVERRIDE_MATRIX.map(function (m) { return "<tr><td>" + m[0] + '</td><td><span class="badge badge-' + m[1] + '">' + m[2] + "</span></td></tr>"; }).join("") +
      "</tbody></table></div>" +
      '<div class="text-muted small mt-2">Legal basis is driven by notice <b>type</b> (transactional / emergency / marketing), not only colour.</div>' +
    "</div></div>";
}

function overrideRuleFormHtml(o) {
  return '<div class="form-group"><label>Role <span class="text-danger">*</span></label>' +
      '<select id="ovRole" class="form-control"><option value="">— select a role —</option>' +
      ROLES.map(function (r) { return '<option value="' + r.id + '" ' + (o && String(o.roleId) === String(r.id) ? "selected" : "") + ">" + esc(r.name) + "</option>"; }).join("") + "</select></div>" +
    '<div class="form-group"><label>User ID <span class="text-muted small">— optional; leave blank to apply to everyone in the role</span></label>' +
      '<input type="number" id="ovUserId" class="form-control" value="' + (o && o.userId ? o.userId : "") + '" placeholder="User ID (optional)"></div>' +
    '<div class="form-group"><label>Applies to</label><select id="ovApplies" class="form-control">' +
      ["Critical", "Critical + High"].map(function (x) { return '<option value="' + x + '"' + (o && o.appliesTo === x ? " selected" : "") + ">" + x + "</option>"; }).join("") + "</select></div>" +
    '<div class="form-group mb-0"><label>Effect</label><select id="ovEffect" class="form-control">' +
      ["Override quiet hours"].map(function (x) { return '<option value="' + x + '"' + (o && o.effect === x ? " selected" : "") + ">" + x + "</option>"; }).join("") + "</select></div>";
}
