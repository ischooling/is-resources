/* =========================================================
   noticeTemplatesContent.js
   HTML generation for the Templates grid + template-builder modal.
   Plain string-returning functions.
   ========================================================= */

function renderNoticeTemplatesContent() {
  loadTemplatesPageData(function () {
    $('#dashboardContentInHTML').html(templatesPageHtml());
  });
}

function templateCardHtml(t) {
  const heading = '<div class="d-flex justify-content-between align-items-start">' +
    '<h3 class="h5 mb-0">' + esc(t.name) + '</h3><span class="badge badge-info text-nowrap">' + typeName(t.type) + "</span></div>";

  let bodyBlock;
  if (t.collectFields && t.collectFields.length) {
    const collects = t.collectFields.map(function (f) {
      return esc(f.label) + ' <span class="text-muted small">(' + ftypeName(f.ftype) + (f.mandatory ? ", required" : "") + ")</span>";
    }).join(" · ");
    bodyBlock = '<div class="border rounded bg-light p-2 small my-2">' + (t.body ? highlightVars(noticeHtmlToPlainPreview(t.body)) + '<div class="mt-2"></div>' : "") + "<b>Collects:</b> " + collects + "</div>";
  } else {
    const vars = varsInText(t.body).map(function (v) { return '<span class="badge badge-light">' + v + "</span>"; }).join(" ") || '<span class="badge badge-light">none</span>';
    bodyBlock = '<div class="border rounded bg-light p-2 small my-2">' + highlightVars(noticeLooksLikeHtml(t.body) ? noticeHtmlToPlainPreview(t.body) : t.body) + "</div>" +
      '<div class="text-muted small mb-2">Variables: ' + vars + "</div>";
  }

  return '<div class="col-md-6 mb-4"><div class="card h-100"><div class="card-body">' +
    heading + bodyBlock +
    '<button class="btn btn-success btn-sm mr-2" onclick="useTemplate(event)" data-id="' + t.id + '">Use in composer</button>' +
    '<button class="btn btn-light btn-sm mr-2" onclick="editTemplate(event)" data-id="' + t.id + '">Edit</button>' +
    '<button class="btn btn-outline-danger btn-sm" onclick="deleteTemplate(event)" data-id="' + t.id + '">Delete</button>' +
    "</div></div></div>";
}

function templatesPageHtml() {
  const newBtn = '<button class="btn btn-primary" onclick="newTemplate()">&#43; New template</button>';
  return pageHead("pe-7s-copy-file", "Templates", "Reusable messages with {{variables}}", newBtn) +
    '<div class="row">' + COMPOSE_TEMPLATES.map(templateCardHtml).join("") + "</div>";
}

function templateCollectBuilderHtml(t) {
  const d = t.collectDraft;
  const addForm = d.source === "existing"
    ? '<div class="form-group"><label>Existing profile field</label>' +
        '<select class="form-control" onchange="tplDraftSet(event)" data-k="existing"><option value="">— select a field —</option>' +
        EXISTING_FIELDS.map(function (f) { return '<option value="' + f.id + '" ' + (d.existing === f.id ? "selected" : "") + ">" + esc(f.label) + " — " + ftypeName(f.ftype) + "</option>"; }).join("") +
        "</select></div>"
    : '<div class="form-row">' +
        '<div class="form-group col-md-6"><label>Profile section</label><select class="form-control" onchange="tplDraftSet(event)" data-k="section">' +
          PROFILE_SECTIONS.map(function (s) { return "<option " + (d.section === s ? "selected" : "") + ">" + esc(s) + "</option>"; }).join("") + "</select></div>" +
        '<div class="form-group col-md-6"><label>Field type</label><select class="form-control" onchange="tplDraftSet(event)" data-k="ftype">' +
          FIELD_TYPES.map(function (f) { return '<option value="' + f[0] + '" ' + (d.ftype === f[0] ? "selected" : "") + ">" + f[1] + "</option>"; }).join("") + "</select></div>" +
        '<div class="form-group col-12"><label>Label name</label><input type="text" class="form-control" value="' + esc(d.label) + '" oninput="tplDraftLabel(event)" placeholder="e.g. Emergency contact number"></div>' +
        (d.ftype === "dropdown" ? '<div class="form-group col-12"><label>Dropdown options <span class="text-muted small">— comma-separated</span></label><input type="text" class="form-control" value="' + esc(d.options) + '" oninput="tplDraftOptions(event)" placeholder="e.g. Yes, No"></div>' : "") +
      "</div>";

  const list = t.collectFields.length
    ? '<div class="table-responsive"><table class="table table-sm mt-2"><thead><tr><th>Label</th><th>Type</th><th>Required</th><th></th></tr></thead><tbody>' +
      t.collectFields.map(function (f, i) {
        return "<tr><td><b>" + esc(f.label) + "</b></td><td>" + ftypeName(f.ftype) + "</td><td>" + (f.mandatory ? '<span class="badge badge-danger">Mandatory</span>' : '<span class="text-muted">Optional</span>') + '</td><td><button class="btn btn-light btn-sm" onclick="tplRemoveField(event)" data-i="' + i + '">Remove</button></td></tr>';
      }).join("") + "</tbody></table></div>"
    : '<div class="text-muted small mt-2">No fields added yet.</div>';

  return '<div class="form-group mt-3"><label>Information to collect</label>' +
    '<div class="mb-2">' +
      chipButton("Add new field", d.source === "new", { click: "tplDraftSource", v: "new" }) +
      chipButton("Use existing field", d.source === "existing", { click: "tplDraftSource", v: "existing" }) +
    "</div>" +
    addForm +
    '<div class="form-row align-items-end mt-2">' +
      '<div class="form-group col-md-6"><label>Requirement</label><select class="form-control" onchange="tplDraftMandatory(event)"><option value="1" ' + (d.mandatory ? "selected" : "") + '>Mandatory</option><option value="0" ' + (!d.mandatory ? "selected" : "") + ">Non-mandatory</option></select></div>" +
      '<div class="form-group col-md-6"><button class="btn btn-primary btn-sm" type="button" onclick="tplAddField()">&#43; Add field</button></div>' +
    "</div>" + list + "</div>";
}

function templateModalBodyHtml(t) {
  const isCollect = isCollectType(t.type);
  return '<div class="form-group"><label>Template name <span class="text-danger">*</span></label>' +
      '<input type="text" class="form-control" id="tplName" value="' + esc(t.name) + '" placeholder="e.g. Late Fee Warning"></div>' +
    '<div class="form-group"><label>Type</label><select class="form-control" id="tplType" onchange="tplTypeChanged(event)">' +
      TYPES.map(function (x) { return '<option value="' + x.id + '" ' + (t.type === x.id ? "selected" : "") + ">" + x.name + "</option>"; }).join("") + "</select></div>" +
    (t.type === "other" ? '<div class="form-group"><label>New type name <span class="text-danger">*</span> <span class="text-muted small">— adds a new notice type</span></label><input type="text" class="form-control" id="tplNewType" value="' + esc(t.newTypeName) + '" placeholder="e.g. Transport update"></div>' : "") +
    '<div class="form-group"><label>Body <span class="text-muted small">— ' + (isCollect ? "optional intro message · " : "") + 'use {{variables}}</span></label>' +
      '<textarea class="form-control" id="tplBody" rows="4" placeholder="Dear {{guardian_name}}, …"></textarea>' +
      '<small class="form-text text-muted">Variables are auto-detected from the {{...}} placeholders you type. Rich text is supported for email.</small></div>' +
    '<div class="form-group"><label>Insert merge field <span class="text-muted small">— click to add a {{variable}} into the body</span></label>' +
      '<div class="d-flex flex-wrap">' + KNOWN_VARS.map(function (v) { return '<button type="button" class="btn btn-sm btn-outline-secondary mr-1 mb-1" onclick="tplInsertVar(event)" data-v="' + v + '">{{' + v + '}}</button>'; }).join("") + "</div></div>" +
    (isCollect ? templateCollectBuilderHtml(t) : "");
}
