/* =========================================================
   noticeTemplates.js
   Templates behaviour + template-builder modal.
   The in-progress draft lives in one module-prefixed global.
   Console-callable: renderTemplates(), useTemplate("tpl_fee")
   ========================================================= */

let templateDraft = null;

function loadTemplatesPageData(callback) {
  loadNoticeTypes(function () {
    loadExistingFields(function () {
      loadComposeTemplates(callback);
    });
  });
}

function renderTemplates() {
  loadTemplatesPageData(function () {
    $('#dashboardContentInHTML').html(templatesPageHtml());
  });
}

function useTemplate(arg) {
  const id = arg && arg.currentTarget ? arg.currentTarget.dataset.id : arg;
  newCompose();
  applyComposeTemplate(id);
}

function blankTemplateDraft() {
  return { source: "new", section: PROFILE_SECTIONS[0], ftype: "text", label: "", options: "", mandatory: true, existing: "" };
}

function newTemplate() {
  templateDraft = { name: "", type: TYPES[0].id, body: "", newTypeName: "", collectFields: [], collectDraft: blankTemplateDraft() };
  drawTemplateModal();
}

function editTemplate(arg) {
  const id = idFrom(arg);
  const t = COMPOSE_TEMPLATES.find(function (x) { return String(x.id) === String(id); });
  if (!t) { toast("Template not found.", "err"); return; }
  templateDraft = {
    id: t.id,
    name: t.name,
    type: t.type,
    body: t.body,
    newTypeName: "",
    collectFields: (t.collectFields || []).map(function (f) { return Object.assign({}, f); }),
    collectDraft: blankTemplateDraft()
  };
  drawTemplateModal();
}

function deleteTemplate(arg) {
  const id = idFrom(arg);
  const t = COMPOSE_TEMPLATES.find(function (x) { return String(x.id) === String(id); });
  openModal("Delete template",
    '<p>Delete <b>' + esc(t ? t.name : "this template") + '</b>? It will become inactive and will no longer appear in Templates. This cannot be undone.</p>',
    '<button class="btn btn-light" onclick="closeModal()">Cancel</button>' +
    '<button class="btn btn-danger" onclick="confirmDeleteTemplate(event)" data-id="' + id + '">Delete</button>'
  );
}

function confirmDeleteTemplate(arg) {
  const id = idFrom(arg);
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLForNotice("templates/delete"),
    data: JSON.stringify({ id: id }),
    dataType: "json",
    success: function () {
      closeModal();
      const idx = COMPOSE_TEMPLATES.findIndex(function (t) { return String(t.id) === String(id); });
      if (idx !== -1) COMPOSE_TEMPLATES.splice(idx, 1);
      $('#dashboardContentInHTML').html(templatesPageHtml());
      toast("Template deleted.", "ok");
    },
    error: function (xhr) {
      const msg = (xhr.responseJSON && xhr.responseJSON.message) ? xhr.responseJSON.message : "Could not delete template.";
      toast(msg, "err");
    }
  });
}

/* read free-text inputs back into the draft before any redraw */
function tplSyncFromDom() {
  if (!templateDraft) return;
  const n = document.getElementById("tplName"); if (n) templateDraft.name = n.value;
  templateDraft.body = noticeGetHtmlEditorValue("tplBody");
  const nt = document.getElementById("tplNewType"); if (nt) templateDraft.newTypeName = nt.value;
}

function tplInsertVar(e) {
  const v = e.currentTarget.dataset.v;
  const token = "{{" + v + "}}";
  templateDraft.body = noticeHtmlEditorInsertAtCursor("tplBody", token);
}

function initTemplateBodyEditor() {
  if (!templateDraft) return;
  noticeInitHtmlEditor("tplBody", templateDraft.body, {
    placeholder: "Dear {{guardian_name}}, …",
    height: 260,
    onChange: function (val) {
      templateDraft.body = val;
    }
  });
}

function drawTemplateModal() {
  const title = templateDraft && templateDraft.id ? "Edit template" : "New template";
  openModal(title, templateModalBodyHtml(templateDraft),
    '<button class="btn btn-light" onclick="closeModal()">Cancel</button>' +
    '<button class="btn btn-success" onclick="saveTemplate()">Save template</button>');
  setTimeout(initTemplateBodyEditor, 0);
}

function tplTypeChanged(e) { const el = e.currentTarget; tplSyncFromDom(); templateDraft.type = el.value; drawTemplateModal(); }

function tplDraftSet(e) {
  const el = e.currentTarget;
  const k = el.dataset.k, v = el.value;
  const d = templateDraft.collectDraft;
  d[k] = v;
  if (k === "existing" && v) {
    const f = EXISTING_FIELDS.find(function (x) { return x.id === v; });
    if (f) { d.section = f.section; d.ftype = f.ftype; d.label = f.label; }
  }
  tplSyncFromDom();
  drawTemplateModal();
}

function tplDraftSource(e) { tplDraftSetValue("source", e.currentTarget.dataset.v); }
function tplDraftSetValue(k, v) {
  templateDraft.collectDraft[k] = v;
  tplSyncFromDom();
  drawTemplateModal();
}
function tplDraftMandatory(e) { templateDraft.collectDraft.mandatory = e.currentTarget.value === "1"; }
function tplDraftLabel(e) { templateDraft.collectDraft.label = e.currentTarget.value; }
function tplDraftOptions(e) { templateDraft.collectDraft.options = e.currentTarget.value; }

function tplAddField() {
  const d = templateDraft.collectDraft;
  if (d.source === "existing") {
    if (!d.existing) { toast("Select an existing field", "err"); return; }
    const f = EXISTING_FIELDS.find(function (x) { return x.id === d.existing; });
    templateDraft.collectFields.push({ source: "existing", section: f.section, ftype: f.ftype, label: f.label, options: f.options || [], mandatory: d.mandatory, existingFieldRef: f.id });
  } else {
    if (!d.label.trim()) { toast("Enter a label name", "err"); return; }
    const opts = d.ftype === "dropdown" ? d.options.split(",").map(function (s) { return s.trim(); }).filter(Boolean) : [];
    if (d.ftype === "dropdown" && !opts.length) { toast("Add at least one dropdown option", "err"); return; }
    templateDraft.collectFields.push({ source: "new", section: d.section, ftype: d.ftype, label: d.label.trim(), options: opts, mandatory: d.mandatory, existingFieldRef: null });
  }
  templateDraft.collectDraft = blankTemplateDraft();
  tplSyncFromDom();
  drawTemplateModal();
  toast("Field added", "ok");
}

function tplRemoveField(e) {
  tplSyncFromDom();
  templateDraft.collectFields.splice(+e.currentTarget.dataset.i, 1);
  drawTemplateModal();
}

function saveTemplate() {
  tplSyncFromDom();
  const t = templateDraft;
  const name = t.name.trim();
  const type = t.type;
  const body = t.body.trim();
  if (!name) { toast("Template name is required", "err"); return; }

  if (type === "other") {
    const nt = t.newTypeName.trim();
    if (!nt) { toast("Enter the new type name", "err"); return; }
    saveNewNoticeType(nt, function (newType) {
      TYPES.splice(TYPES.length - 1, 0, newType);
      finishSaveTemplate(newType.id, name, body, t);
    });
    return;
  }

  finishSaveTemplate(type, name, body, t);
}

function finishSaveTemplate(type, name, body, t) {
  const collect = isCollectType(type);
  if (collect) {
    if (!t.collectFields.length) { toast("Add at least one field to collect", "err"); return; }
  } else if (noticeHtmlIsBlank(body)) { toast("Body is required", "err"); return; }

  const request = {
    id: t.id || null,
    name: name,
    typeId: parseInt(type, 10),
    body: body,
    isCollect: collect ? "Y" : "N",
    fields: collect ? t.collectFields.map(function (f) {
      return {
        source: f.source,
        profileSection: f.section,
        fieldType: f.ftype,
        label: f.label,
        options: (f.options && f.options.length) ? f.options.join(",") : null,
        mandatory: f.mandatory ? "Y" : "N",
        existingFieldRef: f.existingFieldRef ? parseInt(f.existingFieldRef, 10) : null
      };
    }) : []
  };
  const isEdit = !!t.id;

  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLForNotice("templates/save"),
    data: JSON.stringify(request),
    dataType: "json",
    success: function () {
      templateDraft = null;
      closeModal();
      renderTemplates();
      toast('Template "' + name + '" ' + (isEdit ? "updated" : "saved"), "ok");
    },
    error: function (xhr) {
      const msg = (xhr.responseJSON && xhr.responseJSON.message) ? xhr.responseJSON.message : "Could not save template.";
      toast(msg, "err");
    }
  });
}

