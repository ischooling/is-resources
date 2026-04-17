// ─── Followup Preview Rendering ─────────────────────────────────────────────

function leadAutomationGetFollowupContent() {
	var state = window.LEAD_AUTOMATION_STATE || {};
	var resp = state.followupResponse || {};
	var leadTags = $.isArray(resp.leadTags) ? resp.leadTags : [];
	var sendStatus = resp.sendStatus || "";
	var scheduleText = leadAutomationEscapeHtml(resp.scheduleText || "");
	var channel = leadAutomationEscapeHtml(resp.channel || "EMAIL");

	// ── Tag badges
	var tagsHtml = "";
	$.each(leadTags, function (i, tag) {
		tagsHtml += leadAutomationBuildBadge(tag, "neutral") + " ";
	});

	// ── Schedule alert
	var alertVariant = "blue";
	if (sendStatus === "PAUSED") alertVariant = "orange";
	else if (sendStatus === "SENT") alertVariant = "green";
	else if (sendStatus === "FAILED") alertVariant = "red";
	var alertHtml = scheduleText
		? '<div class="lead-automation-followupAlert">' +
		  '<span class="lead-automation-followupAlert__dot lead-automation-followupAlert__dot--' + alertVariant + '"></span>' +
		  '<span class="lead-automation-followupAlert__text">' + scheduleText + '</span>' +
		  '</div>'
		: "";

	// ── Template selector dropdown
	var availableTemplates = $.isArray(state.followupAvailableTemplates) ? state.followupAvailableTemplates : [];
	var selectedTemplId = state.followupSelectedTemplateId;
	var templateSelectHtml = '<div class="lead-automation-followupField">' +
		'<label class="lead-automation-label">Template</label>' +
		'<select id="leadAutomationFollowupTemplateSelect" class="lead-automation-select">';
	$.each(availableTemplates, function (i, t) {
		var isAI = (t.itemType === "AI_TEMPLATE");
		var val = isAI ? "" : String(t.id || "");
		var mode = isAI ? "AI" : "MANUAL";
		var selected = isAI
			? (!selectedTemplId ? "selected" : "")
			: (String(selectedTemplId) === String(t.id) ? "selected" : "");
		templateSelectHtml += '<option value="' + leadAutomationEscapeHtml(val) + '" data-mode="' + mode + '" ' + selected + '>' +
			leadAutomationEscapeHtml(t.name || "") + (isAI ? " ✨" : "") + '</option>';
	});
	if (availableTemplates.length === 0) {
		templateSelectHtml += '<option value="" data-mode="AI" selected>Let AI Design ✨</option>';
	}
	templateSelectHtml += '</select></div>';

	// ── Jodit editor container
	var editorHtml = '<div class="lead-automation-followupField">' +
		'<label class="lead-automation-label">Message <span class="lead-automation-label__hint">— editable</span></label>' +
		'<textarea id="leadAutomationFollowupBodyEditor" style="width:100%;min-height:160px;"></textarea>' +
		'</div>';

	// ── Attachment cards
	var availableMedia = $.isArray(state.followupAvailableMedia) ? state.followupAvailableMedia : [];
	var selectedIds = $.isArray(state.followupSelectedMediaIds) ? state.followupSelectedMediaIds : [];
	var attachHtml = '<div class="lead-automation-followupField">' +
		'<label class="lead-automation-label">Attachments</label>' +
		'<div id="leadAutomationAttachmentList" class="lead-automation-attachmentList">';

	var mediaById = {};
	$.each(availableMedia, function (i, m) { if (m.id) mediaById[m.id] = m; });

	if (selectedIds.length === 0) {
		attachHtml += '<span class="text-muted" style="font-size:13px;">No attachments selected.</span>';
	} else {
		$.each(selectedIds, function (i, mid) {
			var m = mediaById[mid];
			if (!m) return;
			var aiLabel = m.aiScored
				? ' <span class="lead-automation-badge lead-automation-badge--blue" style="font-size:10px;padding:1px 5px;">AI</span>'
				: "";
			attachHtml +=
				'<div class="lead-automation-attachmentCard" data-media-id="' + mid + '">' +
				'<span class="lead-automation-attachmentCard__icon">' + leadAutomationGetMediaIcon(m.mediaType) + '</span>' +
				'<span class="lead-automation-attachmentCard__title">' + leadAutomationEscapeHtml(m.name || "") + aiLabel + '</span>' +
				'<span class="lead-automation-attachmentCard__type">' + leadAutomationBuildBadge(m.mediaType || m.channel || "", "neutral") + '</span>' +
				'<button type="button" class="lead-automation-attachmentCard__remove" ' +
				'data-lead-automation-action="remove-attachment" data-media-id="' + mid + '" title="Remove">✕</button>' +
				'</div>';
		});
	}

	attachHtml +=
		'</div>' +
		'<button type="button" class="lead-automation-linkBtn" data-lead-automation-action="add-attachment" style="margin-top:6px;">+ Add Resource</button>' +
		'</div>';

	// ── Action buttons
	var isPaused = (sendStatus === "PAUSED");
	var actionBtns =
		'<div class="lead-automation-followupActions">' +
		'<button type="button" class="lead-automation-actionBtn lead-automation-actionBtn--primary" ' +
		'data-lead-automation-action="send-followup" data-lead-id="' + leadAutomationEscapeHtml(String(resp.leadId || state.followupLeadId || "")) + '">Send now</button>' +
		(isPaused
			? '<button type="button" class="lead-automation-actionBtn" data-lead-automation-action="resume-followup" data-lead-id="' + leadAutomationEscapeHtml(String(resp.leadId || state.followupLeadId || "")) + '">Resume</button>'
			: '<button type="button" class="lead-automation-actionBtn" data-lead-automation-action="pause-followup" data-lead-id="' + leadAutomationEscapeHtml(String(resp.leadId || state.followupLeadId || "")) + '">Pause</button>') +
		'<button type="button" class="lead-automation-actionBtn" data-lead-automation-action="preview-followup">Preview</button>' +
		'</div>';

	// ── Log panel
	var logsArr = $.isArray(resp.logs) ? resp.logs : [];
	var logsHtml = "";
	$.each(logsArr, function (i, log) {
		logsHtml +=
			'<div class="lead-automation-followupLog">' +
			'<div class="lead-automation-followupLog__avatar ' + leadAutomationEscapeHtml(log.avatarVariant || "") + '">' + leadAutomationEscapeHtml(log.avatarText || "") + '</div>' +
			'<div class="lead-automation-followupLog__body">' +
			'<div class="lead-automation-followupLog__title">' + leadAutomationEscapeHtml(log.title || "") + ' ' + leadAutomationBuildBadge(log.badgeLabel || "", log.badgeVariant || "neutral") + '</div>' +
			'<div class="lead-automation-followupLog__desc">' + leadAutomationEscapeHtml(log.description || "") + '</div>' +
			'</div>' +
			(log.timeLabel ? '<div class="lead-automation-followupLog__time">' + leadAutomationEscapeHtml(log.timeLabel) + '</div>' : '') +
			'</div>';
	});

	var logPanel = logsHtml
		? '<div class="lead-automation-followupLogPanel">' +
		  '<div class="lead-automation-followupLogPanel__header"><span>AI automation log (' + logsArr.length + ' entries)</span></div>' +
		  '<div class="lead-automation-followupLogList">' + logsHtml + '</div>' +
		  '</div>'
		: "";

	// ── Media Picker Modal (hidden)
	var pickerHtml = '<div id="leadAutomationMediaPickerModal" class="lead-automation-modal" style="display:none;">' +
		'<div class="lead-automation-modal__overlay" data-lead-automation-action="close-media-picker"></div>' +
		'<div class="lead-automation-modal__inner">' +
		'<div class="lead-automation-modal__header">' +
		'<span>Add Resource</span>' +
		'<button type="button" data-lead-automation-action="close-media-picker" class="lead-automation-modal__close">✕</button>' +
		'</div>' +
		'<div class="lead-automation-modal__body" id="leadAutomationMediaPickerList"></div>' +
		'<div class="lead-automation-modal__footer">' +
		'<button type="button" class="lead-automation-actionBtn lead-automation-actionBtn--primary" data-lead-automation-action="confirm-media-picker">Add selected</button>' +
		'<button type="button" class="lead-automation-actionBtn" data-lead-automation-action="close-media-picker">Cancel</button>' +
		'</div>' +
		'</div>' +
		'</div>';

	// ── Assemble
	var html = [];
	html.push('<div class="lead-automation-sectionHeader">');
	html.push('<div class="lead-automation-sectionHeader__title"><span class="lead-automation-sectionHeader__bullet"></span>AI analysis & automated follow-up</div>');
	html.push('</div>');
	html.push('<div class="lead-automation-followupWrap">');
	if (tagsHtml) {
		html.push('<div class="lead-automation-followupTop"><div class="lead-automation-tags lead-automation-tags--tight">' + tagsHtml + '</div></div>');
	}
	if (alertHtml) html.push(alertHtml);
	html.push('<div class="lead-automation-followupPreview">');
	html.push('<div class="lead-automation-followupPreview__label">Scheduled ' + channel + ' message preview</div>');
	html.push(templateSelectHtml);
	html.push(editorHtml);
	html.push(attachHtml);
	html.push(actionBtns);
	html.push('</div>');
	if (logPanel) html.push(logPanel);
	html.push('</div>');
	html.push(pickerHtml);
	return html.join("");
}

/**
 * Re-renders the followup section while preserving the current editor body in state.
 * Destroys any existing Jodit instance before replacing DOM.
 */
function leadAutomationRenderFollowupSection() {
	var state = window.LEAD_AUTOMATION_STATE || {};
	var editorKey = state.followupEditorKey || "followupBodyEditor";
	var target = $("#leadAutomationSection");
	if (!target.length) return;

	// Snapshot editor content before destroying
	var currentBody = leadAutomationGetEditorValue(editorKey, "#leadAutomationFollowupBodyEditor");
	if (currentBody !== null && currentBody !== undefined) {
		state.followupCurrentBody = currentBody;
	}

	// Destroy editor, replace DOM, re-init
	if (typeof leadAutomationDestroyEditorInstance === "function") {
		leadAutomationDestroyEditorInstance(editorKey);
	}
	target.html(leadAutomationGetFollowupContent());

	leadAutomationInitRichTextEditor(
		editorKey,
		"#leadAutomationFollowupBodyEditor",
		state.followupCurrentBody || "",
		false
	);
}

/**
 * Rebuilds the media picker modal checklist from state.followupAvailableMedia.
 */
function leadAutomationRenderMediaPickerList() {
	var state = window.LEAD_AUTOMATION_STATE || {};
	var allMedia = $.isArray(state.followupAvailableMedia) ? state.followupAvailableMedia : [];
	var selectedIds = $.isArray(state.followupSelectedMediaIds) ? state.followupSelectedMediaIds : [];
	var html = "";

	if (allMedia.length === 0) {
		html = '<p class="text-muted" style="padding:12px;">No media resources available.</p>';
	} else {
		$.each(allMedia, function (i, m) {
			var isChecked = ($.inArray(m.id, selectedIds) !== -1) ? "checked" : "";
			var aiLabel = m.aiScored
				? ' <span class="lead-automation-badge lead-automation-badge--blue" style="font-size:10px;">AI</span>'
				: "";
			html +=
				'<label class="lead-automation-pickerItem">' +
				'<input type="checkbox" value="' + leadAutomationEscapeHtml(String(m.id || "")) + '" ' + isChecked + ' />' +
				'<span class="lead-automation-pickerItem__icon">' + leadAutomationGetMediaIcon(m.mediaType) + '</span>' +
				'<span class="lead-automation-pickerItem__name">' + leadAutomationEscapeHtml(m.name || "") + aiLabel + '</span>' +
				'<span class="lead-automation-pickerItem__meta">' + leadAutomationEscapeHtml(m.mediaType || m.channel || "") + '</span>' +
				'</label>';
		});
	}
	$("#leadAutomationMediaPickerList").html(html);
}

/**
 * Returns an icon character for a media type.
 */
function leadAutomationGetMediaIcon(mediaType) {
	var t = String(mediaType || "").toLowerCase();
	if (t === "pdf") return "📄";
	if (t === "video" || t === "mp4") return "🎬";
	if (t === "image" || t === "jpg" || t === "png" || t === "jpeg") return "🖼️";
	return "📎";
}
