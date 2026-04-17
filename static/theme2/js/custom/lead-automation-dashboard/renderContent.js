function leadAutomationGetContentLibrary() {
	var templates = window.LEAD_AUTOMATION_STATE.templatesLoaded
		? (window.LEAD_AUTOMATION_STATE.templates || [])
		: [];
	var selectedMediaTab = String(window.LEAD_AUTOMATION_STATE.selectedMediaTab || "images");
	var rows = "";

	$.each(templates, function (k, tpl) {
		rows +=
			'<tr data-template-id="' + leadAutomationEscapeHtml(tpl.id || "") + '">' +
			'<td>' + leadAutomationEscapeHtml(tpl.name || tpl.templateLabel || "") + "</td>" +
			'<td>' + leadAutomationEscapeHtml(tpl.channel || tpl.templateFor || "") + "</td>" +
			'<td>' + leadAutomationEscapeHtml(tpl.status || tpl.templateStatus || "") + "</td>" +
			'<td>' +
				'<div class="lead-automation-rowActions">' +
					'<button type="button" class="lead-automation-rowAction" data-lead-automation-action="template-view" data-template-id="' + leadAutomationEscapeHtml(tpl.id || "") + '" title="View"><i class="fa fa-eye"></i></button>' +
					'<button type="button" class="lead-automation-rowAction" data-lead-automation-action="template-edit" data-template-id="' + leadAutomationEscapeHtml(tpl.id || "") + '" title="Edit"><i class="fa fa-edit"></i></button>' +
					'<button type="button" class="lead-automation-rowAction lead-automation-rowAction--danger" data-lead-automation-action="template-delete" data-template-id="' + leadAutomationEscapeHtml(tpl.id || "") + '" title="Delete"><i class="fa fa-trash"></i></button>' +
				"</div>" +
			"</td>" +
			"</tr>";
	});

	var html = [];
	html.push('<div class="lead-automation-sectionHeader">');
	html.push('<div class="lead-automation-sectionHeader__title">Add content</div>');
	// html.push('<div class="lead-automation-sectionHeader__sub">Template library and AI matching rules</div>');
	html.push('</div>');
	html.push('<div class="lead-automation-grid lead-automation-grid--two">');
	html.push(
		leadAutomationBuildCard(
			"Template",'' +
				'<div class="lead-automation-toolbar">' +
				'<input type="text" class="lead-automation-input" id="leadAutomationTemplateSearch" placeholder="Search templates">' +
				"</div>" +
				'<div class="lead-automation-tableWrap"><table class="lead-automation-table"><thead><tr><th>Name</th><th>Channel</th><th>Status</th><th>Action</th></tr></thead><tbody>' +
				(rows || '<tr><td colspan="4" class="text-center text-muted">No templates found.</td></tr>') +
				"</tbody></table></div>",
			""
		)
	);
	html.push(
		leadAutomationBuildCard(
			"Template",
				'<div class="lead-automation-formGrid">' +
				'<label class="lead-automation-field"><span>Template name</span><input type="text" class="lead-automation-input" id="leadAutomationTemplateName" placeholder="Fee objection - school"></label>' +
				'<label class="lead-automation-field"><span>Channel</span><select class="lead-automation-input" id="leadAutomationTemplateChannel"><option>Email</option><option>WhatsApp</option><option>SMS</option></select></label>' +
				"</div>" +
				'<label class="lead-automation-field mt-2"><span>Email Subject</span><input type="text" class="lead-automation-input" id="leadAutomationTemplateSubject" placeholder="Following up on your enrollment inquiry for [child_name]"></label>' +
				'<label class="lead-automation-field"><span>Message body</span><textarea class="lead-automation-textarea lead-automation-richEditor" id="leadAutomationTemplateBody" placeholder="Hi [name], following up on your child\'s Grade [grade]..."></textarea></label>' +
				'<div class="mt-2"><button type="button" class="lead-automation-btn" data-lead-automation-action="template-save">Save template</button></div>',
			""
		)
	);
	html.push("</div>");
	html.push(leadAutomationBuildTemplateModal());
	html.push(leadAutomationBuildMediaEditModal());
	return html.join("");}

function leadAutomationGetMediaContent() {
	var selectedMediaTab = String(window.LEAD_AUTOMATION_STATE.selectedMediaTab || "images");
	return leadAutomationBuildMediaUploadSection(selectedMediaTab) + leadAutomationBuildMediaEditModal();
}

function leadAutomationBuildMediaUploadSection(activeTab) {
	var current = activeTab || "images";
	var mediaTypeOptions =
		'<option value="images"' + (current === "images" ? " selected" : "") + '>Images</option>' +
		'<option value="videos"' + (current === "videos" ? " selected" : "") + '>Videos</option>' +
		'<option value="pdfs"' + (current === "pdfs" ? " selected" : "") + '>PDFs / docs</option>';

	var uploadForm =
		'<div class="lead-automation-formGrid lead-automation-formGrid--three">' +
		'<label class="lead-automation-field"><span>Media Type</span><select class="lead-automation-input" id="leadAutomationMediaTypeSelect">' + mediaTypeOptions + '</select></label>' +
		'<label class="lead-automation-field"><span>Channel</span><select class="lead-automation-input" id="leadAutomationMediaChannel"><option>Email</option><option>WhatsApp</option><option>SMS</option></select></label>' +
		'</div>' +
		'<div class="lead-automation-formGrid lead-automation-formGrid--three" style="margin-top:12px;">' +
		'<label class="lead-automation-field"><span>Tags</span>' + leadAutomationBuildTagSelectHtml("leadAutomationMediaTags", [], "", "Select tags") + '</label>' +
		'<label class="lead-automation-field"><span>Title</span><input type="text" class="lead-automation-input" id="leadAutomationMediaTitle" placeholder="Media asset"></label>' +
		'<label class="lead-automation-field"><span>Upload files</span><input type="file" multiple id="leadAutomationMediaFiles" class="lead-automation-input lead-automation-input--file"><small id="leadAutomationMediaSizeHint" style="color:#64748b;font-size:11px;margin-top:3px;display:block;">Max: Images 5 MB · PDFs/docs 10 MB · Videos 25 MB per file</small></label>' +
		'</div>' +
		'<div id="leadAutomationMediaFilePreview" style="display:flex;flex-wrap:wrap;gap:10px;margin-top:12px;"></div>' +
		'<div style="margin-top:12px;"><button type="button" class="lead-automation-btn" id="leadAutomationMediaUploadBtn">Upload media</button></div>';

	var filterRow =
		'<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">' +
		'<strong>Filter by type:</strong>' +
		'<select class="form-control" id="leadAutomationMediaFilterType" style="width:200px;">' +
		'<option value="">All types</option>' +
		'<option value="images">Images</option>' +
		'<option value="videos">Videos</option>' +
		'<option value="pdfs">PDFs / docs</option>' +
		'</select>' +
		'</div>';

	var table =
		'<div class="lead-automation-tableWrap mt-3">' +
		'<table class="lead-automation-table lead-automation-mediaTable">' +
		'<thead><tr><th>#</th><th>Title</th><th>File</th><th>Type</th><th>Size</th><th>Channel</th><th>Tags</th><th>Action</th></tr></thead>' +
		'<tbody id="leadAutomationMediaAllTable"></tbody>' +
		'</table>' +
		'</div>' +
		'<div id="leadAutomationMediaPagination"></div>';

	return [
		leadAutomationBuildCard(
			"Upload media",
			'<div class="lead-automation-copy">Upload assets that can be attached to WhatsApp, Email and SMS messages.</div>' +
			uploadForm,
			""
		),
		leadAutomationBuildCard(
			"Saved media",
			filterRow + table,
			""
		),
	].join("");
}

function leadAutomationBuildMediaThumb(item, tabId) {
	var type = String((item && item.type) || "").toLowerCase();
	var ext = String((item && item.name) || "").toLowerCase();
	ext = ext.lastIndexOf(".") > -1 ? ext.substring(ext.lastIndexOf(".") + 1) : "";
	var url = item && item.url ? item.url : "";
	var name = item && item.name ? item.name : "Untitled";
	var size = item && item.size ? item.size : "";
	var previewHtml = '<div class="lead-automation-mediaThumb__placeholder">' + leadAutomationEscapeHtml((tabId || "").toUpperCase()) + "</div>";

	if (type.indexOf("image") === 0 && url) {
		previewHtml = '<img src="' + leadAutomationEscapeHtml(url) + '" alt="' + leadAutomationEscapeHtml(name) + '" class="lead-automation-mediaThumb__image">';
	} else if (type.indexOf("video") === 0 && url) {
		previewHtml = '<video class="lead-automation-mediaThumb__video" src="' + leadAutomationEscapeHtml(url) + '" muted playsinline preload="metadata"></video>';
	} else if (type.indexOf("pdf") === 0 || type.indexOf("application/pdf") === 0 || ext === "pdf" || ext === "doc" || ext === "docx") {
		previewHtml = '<div class="lead-automation-mediaThumb__placeholder">' + (ext === "doc" || ext === "docx" ? "DOC" : "PDF") + "</div>";
	}

	return [
		'<div class="lead-automation-mediaThumb">',
		'  <button type="button" class="lead-automation-mediaThumb__delete" data-lead-automation-media-delete="' + leadAutomationEscapeHtml(String(item.id || "")) + '" title="Delete"><i class="fa fa-trash"></i></button>',
		'  <div class="lead-automation-mediaThumb__preview">' + previewHtml + '</div>',
		'  <div class="lead-automation-mediaThumb__meta">',
		'    <div class="lead-automation-mediaThumb__name">' + leadAutomationEscapeHtml(name) + '</div>',
		(size ? '<div class="lead-automation-mediaThumb__size">' + leadAutomationEscapeHtml(size) + "</div>" : ""),
		'  </div>',
		"</div>",
	].join("");
}

function leadAutomationBuildMediaTableRow(item, tabId) {
	var title = item && item.title ? item.title : (item && item.name ? item.name : "Untitled");
	var fileName = item && item.name ? item.name : "Untitled";
	var typeLabel = item && item.type ? String(item.type).split("/")[0] : leadAutomationEscapeHtml(tabId || "");
	var size = item && item.size ? item.size : "";
	var channel = item && item.channel ? item.channel : "WhatsApp";
	var tags = item && item.tags ? item.tags : "";

	return [
		'<tr data-media-id="' + leadAutomationEscapeHtml(String(item.id || "")) + '" data-media-tab="' + leadAutomationEscapeHtml(String(tabId || "")) + '">',
		'  <td>' + leadAutomationEscapeHtml(title) + '</td>',
		'  <td>' + leadAutomationEscapeHtml(fileName) + '</td>',
		'  <td>' + leadAutomationEscapeHtml(typeLabel) + '</td>',
		'  <td>' + leadAutomationEscapeHtml(size) + '</td>',
		'  <td>' + leadAutomationEscapeHtml(channel) + '</td>',
		'  <td>' + leadAutomationEscapeHtml(tags) + '</td>',
		'  <td>',
		'    <div class="lead-automation-rowActions">',
		'      <button type="button" class="lead-automation-rowAction" data-lead-automation-action="media-view" data-media-tab="' + leadAutomationEscapeHtml(String(tabId || "")) + '" data-media-id="' + leadAutomationEscapeHtml(String(item.id || "")) + '" title="View"><i class="fa fa-eye"></i></button>',
		'      <button type="button" class="lead-automation-rowAction" data-lead-automation-action="media-edit" data-media-tab="' + leadAutomationEscapeHtml(String(tabId || "")) + '" data-media-id="' + leadAutomationEscapeHtml(String(item.id || "")) + '" title="Edit"><i class="fa fa-edit"></i></button>',
		'      <button type="button" class="lead-automation-rowAction lead-automation-rowAction--danger" data-lead-automation-action="media-delete" data-media-tab="' + leadAutomationEscapeHtml(String(tabId || "")) + '" data-media-id="' + leadAutomationEscapeHtml(String(item.id || "")) + '" title="Delete"><i class="fa fa-trash"></i></button>',
		"    </div>",
		"  </td>",
		"</tr>",
	].join("");
}

function leadAutomationRenderMediaPreviews() {
	var state = window.LEAD_AUTOMATION_STATE || {};
	if (!state.allMediaLoaded) {
		leadAutomationLoadAllMedia();
		return;
	}
	leadAutomationRenderAllMediaTable();
}

function leadAutomationBuildTemplateModal() {
	return [
		'<div id="leadAutomationTemplateModal" class="lead-automation-modalBackdrop" aria-hidden="true">',
		'  <div class="lead-automation-modalCard" role="dialog" aria-modal="true" aria-labelledby="leadAutomationTemplateModalTitle">',
		'    <div class="lead-automation-modalHeader">',
		'      <h5 class="lead-automation-modalTitle" id="leadAutomationTemplateModalTitle">Template details</h5>',
		'      <button type="button" class="lead-automation-modalClose" data-lead-automation-action="template-modal-close" aria-label="Close">&times;</button>',
		"    </div>",
		'    <div class="lead-automation-modalBody">',
		'      <input type="hidden" id="leadAutomationTemplateId" />',
		'      <div class="lead-automation-formGrid">',
		'        <label class="lead-automation-field"><span>Template name</span><input type="text" class="lead-automation-input" id="leadAutomationTemplateModalName"></label>',
		'        <label class="lead-automation-field"><span>Channel</span><select class="lead-automation-input" id="leadAutomationTemplateModalChannel"><option>WhatsApp</option><option>Email</option><option>SMS</option></select></label>',
		"      </div>",
		'      <label class="lead-automation-field mt-2"><span>Email Subject</span><input type="text" class="lead-automation-input" id="leadAutomationTemplateModalSubject" placeholder="Following up on your enrollment inquiry for [child_name]"></label>',
		'      <label class="lead-automation-field mt-2"><span>Message body</span><textarea class="lead-automation-textarea lead-automation-richEditor" id="leadAutomationTemplateModalBody"></textarea></label>',
		"    </div>",
		'    <div class="lead-automation-modalFooter">',
		'      <button type="button" class="lead-automation-btn lead-automation-btn--ghost" data-lead-automation-action="template-modal-close">Close</button>',
		'      <button type="button" class="lead-automation-btn" data-lead-automation-action="template-modal-save">Save changes</button>',
		"    </div>",
		"  </div>",
		"</div>",
	].join("");
}

function leadAutomationBuildMediaEditModal() {
	return [
		'<div id="leadAutomationMediaEditModal" class="lead-automation-modalBackdrop" aria-hidden="true">',
		'  <div class="lead-automation-modalCard" role="dialog" aria-modal="true" aria-labelledby="leadAutomationMediaEditModalTitle">',
		'    <div class="lead-automation-modalHeader">',
		'      <h5 class="lead-automation-modalTitle" id="leadAutomationMediaEditModalTitle">Edit media</h5>',
		'      <button type="button" class="lead-automation-modalClose" data-lead-automation-action="media-modal-close" aria-label="Close">&times;</button>',
		"    </div>",
		'    <div class="lead-automation-modalBody">',
		'      <input type="hidden" id="leadAutomationMediaEditId" />',
		'      <input type="hidden" id="leadAutomationMediaEditTab" />',
		'      <div class="lead-automation-formGrid">',
		'        <label class="lead-automation-field"><span>Title</span><input type="text" class="lead-automation-input" id="leadAutomationMediaEditTitle"></label>',
		'        <label class="lead-automation-field"><span>Channel</span><select class="lead-automation-input" id="leadAutomationMediaEditChannel"><option>Email</option><option>WhatsApp</option><option>SMS</option></select></label>',
		'      </div>',
		'      <label class="lead-automation-field mt-2"><span>Tags</span>' + leadAutomationBuildTagSelectHtml("leadAutomationMediaEditTags", [], "lead-automation-input--dark", "Select tags") + "</label>",
		'      <div class="lead-automation-copy mt-3" id="leadAutomationMediaEditFileInfo"></div>',
		'      <label class="lead-automation-field mt-3"><span style="font-weight:600;">Add more files</span>' +
		'        <input type="file" multiple id="leadAutomationMediaEditAddFiles" class="lead-automation-input lead-automation-input--file" style="margin-top:4px;">' +
		'        <small style="color:#64748b;font-size:11px;margin-top:3px;display:block;">Max: Images 5 MB · PDFs/docs 10 MB · Videos 25 MB per file</small>' +
		'      </label>',
		'      <div id="leadAutomationMediaEditNewPreview" style="display:flex;flex-wrap:wrap;gap:8px;margin-top:8px;"></div>',
		'      <div id="leadAutomationMediaEditError" style="display:none;margin-top:12px;padding:10px 14px;background:#fef2f2;border:1px solid #fecaca;border-radius:8px;color:#b91c1c;font-size:13px;"></div>',
		"    </div>",
		'    <div class="lead-automation-modalFooter">',
		'      <button type="button" class="lead-automation-btn lead-automation-btn--ghost" data-lead-automation-action="media-modal-close">Close</button>',
		'      <button type="button" class="lead-automation-btn" data-lead-automation-action="media-modal-save">Update Media</button>',
		"    </div>",
		"  </div>",
		"</div>",
	].join("");
}
