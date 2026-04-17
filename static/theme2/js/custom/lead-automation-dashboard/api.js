function leadAutomationGetApiRoot() {
	var schoolKey = window.SCHOOL_UUID || window.SCHOOL_ID || "";
	if (!schoolKey) return "";
	if (window.APP_BASE_URL) {
		return window.APP_BASE_URL + schoolKey;
	}
	if (window.BASE_URL && window.CONTEXT_PATH) {
		return window.BASE_URL + window.CONTEXT_PATH + schoolKey;
	}
	if (window.CONTEXT_PATH) {
		return window.CONTEXT_PATH + schoolKey;
	}
	return "";
}

function leadAutomationApplyChannels(data) {
	var channels = $.isArray(data) ? data : [];
	window.LEAD_AUTOMATION_STATE.channels = channels;
	window.LEAD_AUTOMATION_STATE.channelsLoaded = true;

	if (channels.length) {
		var first = channels[0] || {};
		if (first.maxLimitPerLead !== undefined && first.maxLimitPerLead !== null) {
			window.LEAD_AUTOMATION_STATE.settings.maxMessages = first.maxLimitPerLead;
		}
		if (first.minGapToSendMsg) {
			window.LEAD_AUTOMATION_STATE.settings.minGap = first.minGapToSendMsg;
		}
	}
}

function leadAutomationApplyScheduleTiming(data) {
	var payload = data || {};
	var settings = window.LEAD_AUTOMATION_STATE.settings || {};
	var dayMap = { 1: "Sun", 2: "Mon", 3: "Tue", 4: "Wed", 5: "Thu", 6: "Fri", 7: "Sat" };
	var scheduleTimings = $.isArray(payload.scheduleTimings) ? payload.scheduleTimings : [];
	var schedules = [];

	$.each(scheduleTimings, function (index, item) {
		if (!item) return;
		var activeDaysJson = item.activeDaysJson || item.activeDays || "[]";
		var activeDayIds = [];
		try {
			activeDayIds = JSON.parse(activeDaysJson);
		} catch (e) {
			activeDayIds = [];
		}
		var activeDays = $.map(activeDayIds || [], function (dayId) {
			return dayMap[dayId] || null;
		}).filter(function (val) {
			return val !== null;
		});
		var timezoneId = item.timezoneId !== undefined && item.timezoneId !== null ? item.timezoneId : item.timezone;
		var timezoneStr = item.timezone || "";
		if (!timezoneStr && String(timezoneId) === "0") {
			timezoneStr = "ALL";
		}
		schedules.push({
			id: "db-" + String(item.id || index || Date.now()),
			timezone: timezoneStr,
			timezoneId: timezoneId,
			windowStart: item.windowStart || "10:00",
			windowEnd: item.windowEnd || "17:00",
			activeDays: activeDays.length ? activeDays : (settings.activeDays || ["Mon", "Tue", "Wed", "Thu", "Fri"]).slice(),
			isDefault: String(timezoneId) === "0",
		});
	});

	if (scheduleTimings.length) {
		settings.schedules = schedules;
	} else {
		settings.schedules = [];
		settings.timezone = "ALL";
		settings.timezoneId = 0;
	}

	if (payload.smartSendTime !== undefined) {
		settings.smartSendTime = String(payload.smartSendTime).toUpperCase() === "Y" || payload.smartSendTime === true;
	}
	var blackouts = $.isArray(payload.blackouts) ? payload.blackouts : [];
	settings.blackouts = $.map(blackouts, function (item, index) {
		if (!item) return null;
		return {
			id: item.id || ("b" + Date.now() + "-" + index),
			reason: item.reason || item.label || "",
			startDate: item.startDate || "",
			endDate: item.endDate || "",
		};
	}).filter(function (item) {
		return !!item;
	});

	window.LEAD_AUTOMATION_STATE.settings = settings;
	window.LEAD_AUTOMATION_STATE.scheduleLoaded = true;
}

function leadAutomationLoadChannels() {
	var apiRoot = leadAutomationGetApiRoot();
	if (!apiRoot) {
		leadAutomationApplyChannels(window.LEAD_AUTOMATION_STATE.channels || []);
		return $.Deferred().resolve(window.LEAD_AUTOMATION_STATE.channels).promise();
	}
	return $.ajax({
		type: "GET",
		url: apiRoot + "/api/v1/lead-automation/media-channels",
		dataType: "json",
		cache: false,
	}).done(function (data) {
		leadAutomationApplyChannels(data);
	}).fail(function () {
		leadAutomationApplyChannels([]);
		leadAutomationShowMessage("Unable to load channel settings.", "error");
	});
}

function leadAutomationLoadScheduleTiming() {
	var apiRoot = leadAutomationGetApiRoot();
	if (!apiRoot) {
		leadAutomationApplyScheduleTiming({});
		return $.Deferred().resolve(window.LEAD_AUTOMATION_STATE.settings || {}).promise();
	}
	return $.ajax({
		type: "GET",
		url: apiRoot + "/api/v1/lead-automation/schedule-timing",
		dataType: "json",
		cache: false,
	}).done(function (data) {
		var payload = data || {};
		if (String(payload.status || "") === "1") {
			leadAutomationApplyScheduleTiming(payload);
		} else {
			leadAutomationApplyScheduleTiming({});
			leadAutomationShowMessage(payload.message || "Unable to load schedule timing.", "error");
		}
	}).fail(function () {
		leadAutomationApplyScheduleTiming({});
		leadAutomationShowMessage("Unable to load schedule timing.", "error");
	});
}

function leadAutomationSaveChannels() {
	var apiRoot = leadAutomationGetApiRoot();
	var channels = $.isArray(window.LEAD_AUTOMATION_STATE.channels) ? window.LEAD_AUTOMATION_STATE.channels : [];
	if (!channels.length) {
		leadAutomationShowMessage("No channels found to save.", "error");
		return false;
	}
	if (!apiRoot) {
		leadAutomationShowMessage("Missing API base URL.", "error");
		return false;
	}

	var maxLimit = parseInt($("#leadAutomationChannelMaxLimit").val(), 10);
	if (isNaN(maxLimit)) {
		maxLimit = null;
	}
	var minGap = String($("#leadAutomationChannelMinGap").val() || "").trim();

	var payload = $.map(channels, function (channel) {
		var channelId = String(channel.id || "");
		var card = $("[data-lead-automation-channel-card='" + channelId + "']");
		var isOn = card.find("[data-lead-automation-channel-toggle]").hasClass("is-on");
		var priorityVal = parseInt(card.find("[data-lead-automation-channel-priority]").val(), 10);
		return $.extend({}, channel, {
			active: isOn ? "Y" : "N",
			priority: isNaN(priorityVal) ? channel.priority : priorityVal,
			maxLimitPerLead: maxLimit,
			minGapToSendMsg: minGap,
			schoolId: window.SCHOOL_ID || "",
		});
	});
	if (!$.isArray(payload)) {
		payload = [payload];
	}

	var activeCount = 0;
	var primaryCount = 0;
	for (var i = 0; i < payload.length; i++) {
		var isActive = String(payload[i].active || "N").toUpperCase() === "Y";
		if (isActive) {
			activeCount++;
			if (Number(payload[i].priority) === 1) {
				primaryCount++;
			}
		} else {
			// Inactive channels do not participate in priority rules
		}
	}
	if (activeCount && primaryCount === 0) {
		leadAutomationShowMessage("Select one active channel as 1st sending priority.", "error");
		return false;
	}
	if (primaryCount > 1) {
		leadAutomationShowMessage("Only one channel can have 1st sending priority.", "error");
		return false;
	}

	leadAutomationShowMessage("Saving channel settings...", "info");
	return $.ajax({
		type: "POST",
		url: apiRoot + "/api/v1/lead-automation/save-media-channels/bulk",
		contentType: "application/json",
		dataType: "json",
		data: JSON.stringify(payload),
		cache: false,
	}).done(function (savedChannels) {
		if (!$.isArray(savedChannels) || !savedChannels.length) {
			leadAutomationShowMessage("Unable to save channel settings.", "error");
			return;
		}
		leadAutomationLoadChannels().always(function () {
			leadAutomationShowMessage("Channel settings saved.", "success");
			leadAutomationRenderSection("channels");
		});
	}).fail(function () {
		leadAutomationShowMessage("Unable to save channel settings.", "error");
	});
}

function leadAutomationSaveSettings() {
	if (window.LEAD_AUTOMATION_STATE.activeTab === "channels") {
		leadAutomationSaveChannels();
		return;
	}
	if (window.LEAD_AUTOMATION_STATE.activeTab === "schedule") {
		leadAutomationSaveScheduleTiming();
		return;
	}
	var apiRoot = leadAutomationGetApiRoot();
	if (!apiRoot) {
		leadAutomationShowMessage("Missing API base URL.", "error");
		return;
	}
	var settings = window.LEAD_AUTOMATION_STATE.settings || {};
	var payload = {
		schoolId: window.SCHOOL_ID || "",
		automationEnabled: settings.automationEnabled ? "Y" : "N"
	};
	leadAutomationShowMessage("Saving settings...", "info");
	$.ajax({
		type: "POST",
		url: apiRoot + "/api/v1/lead-automation/save-settings",
		contentType: "application/json",
		dataType: "json",
		data: JSON.stringify(payload),
		cache: false,
	}).done(function (data) {
		if (String(data.status || "") === "1") {
			leadAutomationShowMessage(data.message || "Settings saved.", "success");
		} else {
			leadAutomationShowMessage(data.message || "Failed to save settings.", "error");
		}
	}).fail(function () {
		leadAutomationShowMessage("Unable to save settings.", "error");
	});
}

function leadAutomationLoadSettings() {
	var apiRoot = leadAutomationGetApiRoot();
	if (!apiRoot) {
		return $.Deferred().resolve({}).promise();
	}
	return $.ajax({
		type: "GET",
		url: apiRoot + "/api/v1/lead-automation/settings",
		dataType: "json",
		cache: false,
	}).done(function (data) {
		if (String(data.status || "") === "1" && data.settings) {
			var s = data.settings;
			var state = window.LEAD_AUTOMATION_STATE.settings || {};
			state.automationEnabled = s.automationEnabled === "Y";
			window.LEAD_AUTOMATION_STATE.settings = state;
		}
	}).fail(function () {
		// keep defaults
	});
}

function leadAutomationSaveScheduleTiming() {
	var apiRoot = leadAutomationGetApiRoot();
	if (!apiRoot) {
		leadAutomationShowMessage("Missing API base URL.", "error");
		return;
	}
	var settings = window.LEAD_AUTOMATION_STATE.settings || {};
	var dayMap = { Sun: 1, Mon: 2, Tue: 3, Wed: 4, Thu: 5, Fri: 6, Sat: 7 };

	settings.schedules = settings.schedules || [];
	$(".lead-automation-scheduleRow").each(function () {
		var rowId = String($(this).data("schedule-row-id") || "");
		var row = (settings.schedules || []).filter(function (item) {
			return String(item.id) === rowId;
		})[0];
		if (!row) return;
		var rawStart = String($(this).find(".lead-automation-window-start").val() || "10:00").trim();
		var rawEnd = String($(this).find(".lead-automation-window-end").val() || "17:00").trim();
		row.windowStart = typeof leadAutomationTime12To24 === "function" ? leadAutomationTime12To24(rawStart) : rawStart;
		row.windowEnd = typeof leadAutomationTime12To24 === "function" ? leadAutomationTime12To24(rawEnd) : rawEnd;
		var tzSelect = $(this).find(".lead-automation-timezone-select");
		row.timezone = String(tzSelect.val() || row.timezone || "");
		row.timezoneId = tzSelect.find("option:selected").attr("custom_timezone_id") || row.timezoneId || "";
	});

	var scheduleTimings = $.map(settings.schedules || [], function (row) {
		var activeDays = row.activeDays || [];
		var activeDayIds = $.map(activeDays, function (day) {
			return dayMap[day] || null;
		}).filter(function (val) {
			return val !== null;
		});
		return {
			timezone: row.timezone || "",
			timezoneId: row.timezone === "ALL" ? 0 : row.timezoneId,
			windowStart: row.windowStart || "10:00",
			windowEnd: row.windowEnd || "17:00",
			activeDaysJson: JSON.stringify(activeDayIds),
		};
	});

	window.LEAD_AUTOMATION_STATE.settings = settings;

	var blackouts = $.map(settings.blackouts || [], function (item) {
		return {
			id: item.id || "",
			reason: item.reason || item.label || "",
			startDate: item.startDate || "",
			endDate: item.endDate || "",
		};
	});

	var payload = {
		schoolId: window.SCHOOL_ID || "",
		scheduleTimings: scheduleTimings,
		smartSendTime: settings.smartSendTime ? "Y" : "N",
		blackouts: blackouts,
	};

	leadAutomationShowMessage("Saving schedule...", "info");
	$.ajax({
		type: "POST",
		url: apiRoot + "/api/v1/lead-automation/save-schedule-timing",
		contentType: "application/json",
		dataType: "json",
		data: JSON.stringify(payload),
		cache: false,
	}).done(function (response) {
		var payloadResponse = response || {};
		var isSuccess = String(payloadResponse.status || "") === "1";
		if (isSuccess) {
			window.LEAD_AUTOMATION_CONFIG.mock.settings = $.extend(true, {}, window.LEAD_AUTOMATION_CONFIG.mock.settings, settings);
			leadAutomationShowMessage(payloadResponse.message || "Schedule timing saved.", "success");
			leadAutomationLoadScheduleTiming().always(function () {
				leadAutomationRenderSection("schedule");
			});
		} else {
			leadAutomationShowMessage(payloadResponse.message || "Unable to save schedule timing.", "error");
		}
	}).fail(function () {
		leadAutomationShowMessage("Unable to save schedule timing.", "error");
	});
}

function leadAutomationSaveTemplate() {
	var name = String($("#leadAutomationTemplateName").val() || "").trim();
	var channel = String($("#leadAutomationTemplateChannel").val() || "WhatsApp").trim();
	var subject = String($("#leadAutomationTemplateSubject").val() || "").trim();
	var body = String(leadAutomationGetEditorValue("templateBodyEditor", "#leadAutomationTemplateBody") || "").trim();

	if (!name) {
		leadAutomationShowMessage("Template name is required.", "error");
		return false;
	}
	return leadAutomationSaveTemplateRequest({
		name: name,
		channel: channel,
		subject: subject,
		body: body,
		templateStatus: "Draft",
		metadataJson: "",
	}, false);
}

function leadAutomationGetTemplateById(templateId) {
	var templates = window.LEAD_AUTOMATION_STATE.templatesLoaded
		? (window.LEAD_AUTOMATION_STATE.templates || [])
		: [];
	for (var i = 0; i < templates.length; i++) {
		if (String(templates[i].id || "") === String(templateId || "")) {
			return templates[i];
		}
	}
	return null;
}

function leadAutomationOpenTemplateModal(templateId, mode) {
	var template = leadAutomationGetTemplateById(templateId);
	if (!template) {
		leadAutomationShowMessage("Template not found.", "error");
		return false;
	}

	window.LEAD_AUTOMATION_STATE.selectedTemplateId = template.id;
	window.LEAD_AUTOMATION_STATE.templateModalMode = mode === "edit" ? "edit" : "view";

	$("#leadAutomationTemplateModalTitle").text(mode === "edit" ? "Edit template" : "Template details");
	$("#leadAutomationTemplateId").val(template.id || "");
	$("#leadAutomationTemplateModalName").val(template.name || template.templateLabel || "");
	$("#leadAutomationTemplateModalChannel").val(template.channel || template.templateFor || "WhatsApp");
	$("#leadAutomationTemplateModalSubject").val(template.subject || "");
	$("#leadAutomationTemplateModalBody").val(template.body || template.templateContent || "");

	var isViewMode = window.LEAD_AUTOMATION_STATE.templateModalMode === "view";
	$("#leadAutomationTemplateModalName, #leadAutomationTemplateModalChannel, #leadAutomationTemplateModalSubject").prop("disabled", isViewMode);
	$("#leadAutomationTemplateModal [data-lead-automation-action='template-modal-save']").toggle(!isViewMode);

	$("#leadAutomationTemplateModal").addClass("show").attr("aria-hidden", "false");
	clearTimeout(window.LEAD_AUTOMATION_STATE.templateModalInitTimer);
	window.LEAD_AUTOMATION_STATE.templateModalInitTimer = window.setTimeout(function () {
		if (!$("#leadAutomationTemplateModal").hasClass("show")) {
			return;
		}
		leadAutomationInitRichTextEditor(
			"templateModalBodyEditor",
			"#leadAutomationTemplateModalBody",
			template.body || template.templateContent || "",
			isViewMode
		);
	}, 0);
	return false;
}

function leadAutomationSaveTemplateFromModal() {
	var templateId = String($("#leadAutomationTemplateId").val() || "").trim();
	var template = leadAutomationGetTemplateById(templateId);
	if (!template) {
		leadAutomationShowMessage("Template not found.", "error");
		return false;
	}

	return leadAutomationSaveTemplateRequest({
		id: templateId,
		name: String($("#leadAutomationTemplateModalName").val() || "").trim(),
		channel: String($("#leadAutomationTemplateModalChannel").val() || "WhatsApp").trim(),
		subject: String($("#leadAutomationTemplateModalSubject").val() || "").trim(),
		templateStatus: String(template.status || template.templateStatus || "Active").trim() || "Active",
		body: String(leadAutomationGetEditorValue("templateModalBodyEditor", "#leadAutomationTemplateModalBody") || "").trim(),
		metadataJson: String(template.metadataJson || template.assets || "").trim(),
	}, true);
}

function leadAutomationDeleteTemplate(templateId) {
	var template = leadAutomationGetTemplateById(templateId);
	if (!template) {
		leadAutomationShowMessage("Template not found.", "error");
		return false;
	}

	return leadAutomationShowConfirmDialog(
		"Delete template '" + (template.name || "") + "'?",
		function () {
			var apiRoot = leadAutomationGetMediaControllerRoot();
			if (!apiRoot) {
				leadAutomationShowMessage("Missing API base URL.", "error");
				return;
			}
			leadAutomationShowMessage("Deleting template...", "info");
			$.ajax({
				type: "POST",
				url: apiRoot + "/app-template/delete",
				contentType: "application/json; charset=utf-8",
				dataType: "text",
				cache: false,
				data: JSON.stringify(leadAutomationBuildPayloadRequest({
					id: Number(templateId),
				})),
			}).done(function (resp) {
				var data = leadAutomationParsePayloadResponse(resp);
				var status = String((data && data.status) || "").toUpperCase();
				if (status === "FAILED" || status === "EXCEPTION" || status === "SESSIONOUT") {
					leadAutomationShowMessage((data && data.message) || "Unable to delete template.", "error");
					return;
				}
				var templates = window.LEAD_AUTOMATION_STATE.templatesLoaded
					? (window.LEAD_AUTOMATION_STATE.templates || [])
					: [];
				templates = $.grep(templates, function (item) {
					return String(item.id || "") !== String(templateId || "");
				});
				if (window.LEAD_AUTOMATION_STATE.templatesLoaded) {
					window.LEAD_AUTOMATION_STATE.templates = templates;
				}
				leadAutomationShowMessage((data && data.message) || "Template deleted.", "success");
				leadAutomationRenderSection("content");
			}).fail(function () {
				leadAutomationShowMessage("Unable to delete template.", "error");
			});
		},
		"Delete template"
	);
}

function leadAutomationSaveTemplateRequest(templateData, closeModalAfterSave) {
	var apiRoot = leadAutomationGetMediaControllerRoot();
	if (!apiRoot) {
		leadAutomationShowMessage("Missing API base URL.", "error");
		return false;
	}
	var payload = templateData || {};
	leadAutomationShowMessage("Saving template...", "info");
	return $.ajax({
		type: "POST",
		url: apiRoot + "/app-template/save",
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		cache: false,
		data: JSON.stringify(leadAutomationBuildPayloadRequest(payload)),
	}).done(function (resp) {
		var data = leadAutomationParsePayloadResponse(resp);
		if (String(data.status || "") !== "SUCCESS") {
			leadAutomationShowMessage(data.message || "Unable to save template.", "error");
			return;
		}
		var saved = (data.templateList && data.templateList[0]) ? data.templateList[0] : null;
		if (saved) {
			var templates = window.LEAD_AUTOMATION_STATE.templatesLoaded
				? (window.LEAD_AUTOMATION_STATE.templates || [])
				: [];
			var idx = -1;
			for (var i = 0; i < templates.length; i++) {
				if (String(templates[i].id || "") === String(saved.id || "")) {
					idx = i;
					break;
				}
			}
			if (idx >= 0) {
				templates[idx] = saved;
			} else {
				templates.unshift(saved);
			}
			window.LEAD_AUTOMATION_STATE.templates = templates;
			window.LEAD_AUTOMATION_STATE.templatesLoaded = true;
		}
		$("#leadAutomationTemplateName").val("");
		leadAutomationSetEditorValue("templateBodyEditor", "#leadAutomationTemplateBody", "", false);
		if (closeModalAfterSave) {
			leadAutomationCloseTemplateModal();
		}
		leadAutomationShowMessage(data.message || "Template saved.", "success");
		leadAutomationLoadTemplates(true).always(function () {
			leadAutomationRenderSection("content");
		});
	}).fail(function () {
		leadAutomationShowMessage("Unable to save template.", "error");
	});
}

function leadAutomationCloseTemplateModal() {
	clearTimeout(window.LEAD_AUTOMATION_STATE.templateModalInitTimer);
	window.LEAD_AUTOMATION_STATE.templateModalInitTimer = null;
	leadAutomationDestroyEditorInstance("templateModalBodyEditor");
	$("#leadAutomationTemplateModalBody").prop("disabled", false).val("");
	$("#leadAutomationTemplateModalSubject").prop("disabled", false).val("");
	$("#leadAutomationTemplateModal").removeClass("show").attr("aria-hidden", "true");
	return false;
}

function leadAutomationApplyTemplates(data) {
	var response = data || {};
	var templates = [];
	if ($.isArray(response.templateList)) {
		templates = response.templateList;
	} else if ($.isArray(response.templates)) {
		templates = response.templates;
	} else if ($.isArray(response.data)) {
		templates = response.data;
	}
	window.LEAD_AUTOMATION_STATE.templates = templates;
	window.LEAD_AUTOMATION_STATE.templatesLoaded = true;
	return templates;
}

function leadAutomationLoadTemplates(forceReload) {
	var controllerRoot = leadAutomationGetMediaControllerRoot();
	if (!controllerRoot) {
		return $.Deferred().resolve(window.LEAD_AUTOMATION_STATE.templates || []).promise();
	}
	if (!forceReload && window.LEAD_AUTOMATION_STATE.templatesLoaded) {
		return $.Deferred().resolve(window.LEAD_AUTOMATION_STATE.templates || []).promise();
	}
	return $.ajax({
		type: "POST",
		url: controllerRoot + "/app-template/list",
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		cache: false,
		data: JSON.stringify(leadAutomationBuildPayloadRequest({})),
	}).done(function (resp) {
		leadAutomationApplyTemplates(leadAutomationParsePayloadResponse(resp));
	}).fail(function () {
		leadAutomationApplyTemplates({ templateList: [] });
		leadAutomationShowMessage("Unable to load template library.", "error");
	});
}

function leadAutomationFormatFileSize(bytes) {
	var size = Number(bytes || 0);
	if (!size) return "";
	var units = ["B", "KB", "MB", "GB"];
	var unitIndex = 0;
	while (size >= 1024 && unitIndex < units.length - 1) {
		size = size / 1024;
		unitIndex++;
	}
	return size.toFixed(size >= 10 || unitIndex === 0 ? 0 : 1) + " " + units[unitIndex];
}

function leadAutomationRenderMediaTags(tags) {
	var values = String(tags || "")
		.split(",")
		.map(function (item) {
			return $.trim(item);
		})
		.filter(Boolean);
	if (!values.length) {
		return '<span class="text-muted">-</span>';
	}
	return values
		.map(function (tag) {
			return '<span class="badge badge-light border mr-1 mb-1">#' + leadAutomationEscapeHtml(tag.replace(/^#/, "")) + "</span>";
		})
		.join("");
}

function leadAutomationGetFileExtension(fileName) {
	var name = String(fileName || "").toLowerCase();
	var dotIndex = name.lastIndexOf(".");
	if (dotIndex === -1) return "";
	return name.substring(dotIndex + 1);
}

function leadAutomationGetMediaBucket(tabId) {
	var bucket = String(tabId || "images");
	if (bucket === "videos" || bucket === "pdfs") return bucket;
	return "images";
}

function leadAutomationGetMediaLimitInfo(tabId) {
	var bucket = leadAutomationGetMediaBucket(tabId);
	if (bucket === "videos") {
		return {
			maxBytes: 25 * 1024 * 1024,
			label: "Max 25 MB each",
		};
	}
	if (bucket === "pdfs") {
		return {
			maxBytes: 10 * 1024 * 1024,
			label: "Max 10 MB each",
		};
	}
	return {
		maxBytes: 5 * 1024 * 1024,
		label: "Max 5 MB each",
	};
}

function leadAutomationIsAllowedMediaFile(tabId, file) {
	if (!file) return false;
	var bucket = leadAutomationGetMediaBucket(tabId);
	var mime = String(file.type || "").toLowerCase();
	var ext = leadAutomationGetFileExtension(file.name || "");

	if (bucket === "images") {
		return mime.indexOf("image/") === 0 || ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"].indexOf(ext) !== -1;
	}
	if (bucket === "videos") {
		return mime.indexOf("video/") === 0 || ["mp4", "webm", "ogg", "mov", "m4v", "avi", "mkv"].indexOf(ext) !== -1;
	}
	if (bucket === "pdfs") {
		return mime === "application/pdf" || ["pdf", "doc", "docx", "rtf", "odt"].indexOf(ext) !== -1;
	}
	return false;
}

function leadAutomationGetMediaControllerRoot() {
	var schoolKey = window.SCHOOL_ID || window.SCHOOL_UUID || "";
	if (!schoolKey) return "";
	if (window.LEAD_AUTOMATION_MEDIA_CONFIG && window.LEAD_AUTOMATION_MEDIA_CONFIG.apiBase) {
		return window.LEAD_AUTOMATION_MEDIA_CONFIG.apiBase;
	}
	if (window.APP_BASE_URL) {
		return window.APP_BASE_URL + schoolKey + "/dashboard/lead-automation-media";
	}
	if (window.BASE_URL && window.CONTEXT_PATH) {
		return window.BASE_URL + window.CONTEXT_PATH + schoolKey + "/dashboard/lead-automation-media";
	}
	return "";
}

function leadAutomationEncodePayload(data) {
	return window.btoa(unescape(encodeURIComponent(JSON.stringify(data || {}))));
}

function leadAutomationBuildPayloadRequest(data) {
	return {
		payload: leadAutomationEncodePayload(data),
	};
}

function leadAutomationParsePayloadResponse(resp) {
	if (resp == null) {
		return {};
	}
	if (typeof resp === "object") {
		return resp;
	}
	try {
		return JSON.parse(resp);
	} catch (e) {
		return {};
	}
}

function leadAutomationReadFileBase64(file) {
	return new Promise(function (resolve, reject) {
		var reader = new FileReader();
		reader.onload = function () {
			var result = String(reader.result || "");
			var commaIndex = result.indexOf(",");
			resolve(commaIndex >= 0 ? result.substring(commaIndex + 1) : result);
		};
		reader.onerror = function () {
			reject(new Error("Unable to read file"));
		};
		reader.readAsDataURL(file);
	});
}

function leadAutomationFileToJson(file) {
	return leadAutomationReadFileBase64(file).then(function (content) {
		return {
			name: file.name || "media-file",
			type: file.type || "",
			content: content,
		};
	});
}

function leadAutomationAddMediaFiles(tabId, files) {
	var bucket = leadAutomationGetMediaBucket(tabId);
	var limitInfo = leadAutomationGetMediaLimitInfo(bucket);
	var list = (window.LEAD_AUTOMATION_STATE.mediaUploads[bucket] || []);
	var invalidFiles = [];
	var oversizeFiles = [];
	var addedCount = 0;
	$.each(files || [], function (index, file) {
		if (!file) return;
		if (!leadAutomationIsAllowedMediaFile(bucket, file)) {
			invalidFiles.push(file.name || "Unknown file");
			return;
		}
		if (limitInfo.maxBytes && Number(file.size || 0) > limitInfo.maxBytes) {
			oversizeFiles.push((file.name || "Unknown file") + " (" + leadAutomationFormatFileSize(file.size || 0) + ")");
			return;
		}
		var item = {
			id: bucket + "-" + Date.now() + "-" + index + "-" + Math.random().toString(36).slice(2, 7),
			name: file.name || "Untitled",
			type: file.type || "",
			size: leadAutomationFormatFileSize(file.size || 0),
			url: URL.createObjectURL(file),
			isObjectUrl: true,
			file: file,
		};
		list.push(item);
		addedCount++;
	});
	window.LEAD_AUTOMATION_STATE.mediaUploads[bucket] = list;
	leadAutomationRenderMediaPreviews();
	if (addedCount) {
		leadAutomationShowMessage("Added " + addedCount + " file(s) to " + bucket + ".", "success");
	}
	if (invalidFiles.length) {
		var bucketLabel = bucket === "images" ? "Images" : (bucket === "videos" ? "Videos" : "PDFs / docs");
		leadAutomationShowMessage("Only " + bucketLabel + " files are allowed. Skipped: " + invalidFiles.join(", "), addedCount ? "info" : "error");
	}
	if (oversizeFiles.length) {
		var sizeBucketLabel = bucket === "images" ? "Images" : (bucket === "videos" ? "Videos" : "PDFs / docs");
		leadAutomationShowMessage("File size limit exceeded for " + sizeBucketLabel + ". " + limitInfo.label + ". Skipped: " + oversizeFiles.join(", "), addedCount ? "info" : "error");
	}
	return false;
}

function leadAutomationLoadSavedMedia(tabId, forceReload) {
	var bucket = leadAutomationGetMediaBucket(tabId);
	var controllerRoot = leadAutomationGetMediaControllerRoot();
	if (!controllerRoot) {
		return $.Deferred().resolve([]).promise();
	}
	if (!forceReload && window.LEAD_AUTOMATION_STATE.savedMediaLoaded[bucket]) {
		leadAutomationRenderMediaPreviews();
		return $.Deferred().resolve(window.LEAD_AUTOMATION_STATE.savedMedia[bucket] || []).promise();
	}
	return $.ajax({
		type: "POST",
		url: controllerRoot + "/list",
		contentType: "application/json; charset=utf-8",
		dataType: "text",
		cache: false,
		data: JSON.stringify(leadAutomationBuildPayloadRequest({
			mediaType: bucket,
		})),
	}).done(function (resp) {
		var data = leadAutomationParsePayloadResponse(resp);
		window.LEAD_AUTOMATION_STATE.savedMedia[bucket] = $.isArray(data.mediaList) ? data.mediaList : [];
		window.LEAD_AUTOMATION_STATE.savedMediaLoaded[bucket] = true;
		leadAutomationRenderMediaPreviews();
	}).fail(function () {
		window.LEAD_AUTOMATION_STATE.savedMedia[bucket] = [];
		window.LEAD_AUTOMATION_STATE.savedMediaLoaded[bucket] = true;
		leadAutomationRenderMediaPreviews();
	});
}

function leadAutomationSaveCurrentMedia() {
	var bucket = String(window.LEAD_AUTOMATION_STATE.selectedMediaTab || "images");
	var stagedList = (window.LEAD_AUTOMATION_STATE.mediaUploads[bucket] || []).slice();
	if (!stagedList.length) {
		leadAutomationShowMessage("Please choose at least one file.", "error");
		return false;
	}

	var controllerRoot = leadAutomationGetMediaControllerRoot();
	if (!controllerRoot) {
		leadAutomationShowMessage("Missing media controller URL.", "error");
		return false;
	}

	var panel = $('[data-media-panel="' + bucket + '"]');
	var title = String(panel.find('[data-lead-automation-media-title="' + bucket + '"]').val() || "").trim();
	var channel = String(panel.find('[data-lead-automation-media-channel="' + bucket + '"]').val() || "WhatsApp").trim();
	var tags = leadAutomationNormalizeTagValues(panel.find('[data-lead-automation-media-tags="' + bucket + '"]').val()).join(",");

	var filePromises = $.map(stagedList, function (item) {
		return leadAutomationFileToJson(item.file || null);
	});
	if (!filePromises.length) {
		leadAutomationShowMessage("Selected files could not be processed.", "error");
		return false;
	}

	leadAutomationShowMessage("Uploading media...", "info");
	return Promise.all(filePromises).then(function (filesJson) {
		if (!filesJson.length) {
			leadAutomationShowMessage("Selected files could not be processed.", "error");
			return;
		}

		return $.ajax({
			type: "POST",
			url: controllerRoot + "/save",
			contentType: "application/json; charset=utf-8",
			dataType: "text",
			cache: false,
			data: JSON.stringify(leadAutomationBuildPayloadRequest({
				title: title,
				channel: channel,
				tags: tags,
				mediaType: bucket,
				filesJson: JSON.stringify(filesJson),
			})),
		})
			.done(function () {
				window.LEAD_AUTOMATION_STATE.mediaUploads[bucket] = [];
				panel.find('[data-lead-automation-media-title="' + bucket + '"]').val("");
				panel.find('[data-lead-automation-media-tags="' + bucket + '"]').val(null).trigger("change");
				panel.find('[data-lead-automation-media-channel="' + bucket + '"]').val("WhatsApp");
				leadAutomationShowMessage("Media saved successfully.", "success");
				leadAutomationLoadSavedMedia(bucket, true);
			})
			.fail(function () {
				leadAutomationLoadSavedMedia(bucket, true);
				leadAutomationShowMessage("Some media files may not have been saved.", "error");
			});
	}).catch(function () {
		leadAutomationShowMessage("Unable to read selected file(s).", "error");
	});
}

function leadAutomationDeleteSavedMedia(tabId, itemId) {
	var bucket = leadAutomationGetMediaBucket(tabId);
	var controllerRoot = leadAutomationGetMediaControllerRoot();
	if (!controllerRoot || !itemId) {
		leadAutomationShowMessage("Unable to delete media.", "error");
		return false;
	}
	return leadAutomationShowConfirmDialog(
		"Delete this saved media item?",
		function () {
	$.ajax({
		type: "POST",
		url: controllerRoot + "/delete",
		contentType: "application/json; charset=utf-8",
		dataType: "text",
		cache: false,
		data: JSON.stringify(leadAutomationBuildPayloadRequest({
			id: Number(itemId),
		})),
	}).done(function (resp) {
		var data = leadAutomationParsePayloadResponse(resp);
		var status = String((data && data.status) || "").toUpperCase();
		if (status === "FAILED" || status === "EXCEPTION" || status === "SESSIONOUT") {
			leadAutomationShowMessage((data && data.message) || "Unable to delete media.", "error");
			return;
		}
		window.LEAD_AUTOMATION_STATE.savedMedia[bucket] = $.grep(window.LEAD_AUTOMATION_STATE.savedMedia[bucket] || [], function (item) {
			return String(item.id || "") !== String(itemId || "");
		});
		leadAutomationRenderMediaPreviews();
		leadAutomationShowMessage((data && data.message) || "Media deleted successfully.", "success");
		}).fail(function () {
			leadAutomationShowMessage("Unable to delete media.", "error");
		});
		},
		"Delete media"
	);
}

function leadAutomationGetSavedMediaItem(tabId, itemId) {
	var allMedia = window.LEAD_AUTOMATION_STATE.allMedia || [];
	for (var i = 0; i < allMedia.length; i++) {
		if (String(allMedia[i].id || "") === String(itemId || "")) {
			return allMedia[i];
		}
	}
	return null;
}

function leadAutomationLoadAllMedia(callback) {
	var controllerRoot = leadAutomationGetMediaControllerRoot();
	if (!controllerRoot) {
		if (typeof callback === "function") callback();
		return;
	}
	$.ajax({
		type: "POST",
		url: controllerRoot + "/list",
		contentType: "application/json; charset=utf-8",
		dataType: "text",
		cache: false,
		data: JSON.stringify(leadAutomationBuildPayloadRequest({})),
	}).done(function (resp) {
		var data = leadAutomationParsePayloadResponse(resp);
		window.LEAD_AUTOMATION_STATE.allMedia = $.isArray(data.mediaList) ? data.mediaList : [];
		window.LEAD_AUTOMATION_STATE.allMediaLoaded = true;
		leadAutomationRenderAllMediaTable();
		if (typeof callback === "function") callback();
	}).fail(function () {
		window.LEAD_AUTOMATION_STATE.allMedia = [];
		window.LEAD_AUTOMATION_STATE.allMediaLoaded = true;
		leadAutomationRenderAllMediaTable();
		if (typeof callback === "function") callback();
	});
}

function leadAutomationRenderAllMediaTable(pageNum) {
	var target = $("#leadAutomationMediaAllTable");
	if (!target.length) return;
	var allMedia = window.LEAD_AUTOMATION_STATE.allMedia || [];
	var filterType = String($("#leadAutomationMediaFilterType").val() || "");
	var filtered = allMedia;
	if (filterType) {
		filtered = $.grep(allMedia, function (item) {
			return String(item.mediaType || "").toLowerCase() === filterType.toLowerCase();
		});
	}
	var pageSize = 10;
	var currentPage = typeof pageNum === "number" ? pageNum : (window.LEAD_AUTOMATION_STATE.mediaPage || 0);
	window.LEAD_AUTOMATION_STATE.mediaPage = currentPage;
	var totalCount = filtered.length;
	var totalPages = Math.ceil(totalCount / pageSize);
	var start = currentPage * pageSize;
	var pageItems = filtered.slice(start, start + pageSize);

	if (!pageItems.length) {
		target.html('<tr><td colspan="9" class="text-center text-muted">No media found.</td></tr>');
		$("#leadAutomationMediaPagination").html("");
		return;
	}
	var html = "";
	$.each(pageItems, function (idx, item) {
		var srNo = start + idx + 1;
		var name = item.title || item.originalFileName || "Untitled";
		var typeLabel = String(item.mediaType || "").toUpperCase();
		if (typeLabel === "IMAGES") typeLabel = "IMAGE";
		if (typeLabel === "VIDEOS") typeLabel = "VIDEO";
		if (typeLabel === "PDFS") typeLabel = "PDF";
		html += [
			'<tr data-media-row-id="' + leadAutomationEscapeHtml(String(item.id || "")) + '">',
			'  <td>' + srNo + '</td>',
			'  <td>' + leadAutomationEscapeHtml(item.title || name) + '</td>',
			'  <td>' + leadAutomationBuildFileNameCell(item.originalFileName, name) + '</td>',
			'  <td><span class="lead-automation-badge lead-automation-badge--neutral">' + leadAutomationEscapeHtml(typeLabel) + '</span></td>',
			'  <td>' + leadAutomationEscapeHtml(item.fileSizeLabel || "") + '</td>',
			'  <td>' + leadAutomationEscapeHtml(item.channel || "WhatsApp") + '</td>',
			'  <td>' + leadAutomationRenderMediaTags(item.tags) + '</td>',
			'  <td>',
			'    <div class="lead-automation-rowActions">',
			'      <button type="button" class="lead-automation-rowAction" data-lead-automation-action="media-view" data-all-media-id="' + leadAutomationEscapeHtml(String(item.id || "")) + '" title="View"><i class="fa fa-eye"></i></button>',
			'      <button type="button" class="lead-automation-rowAction" data-lead-automation-action="media-edit" data-all-media-id="' + leadAutomationEscapeHtml(String(item.id || "")) + '" title="Edit"><i class="fa fa-edit"></i></button>',
			'      <button type="button" class="lead-automation-rowAction lead-automation-rowAction--danger" data-lead-automation-media-db-delete="' + leadAutomationEscapeHtml(String(item.id || "")) + '" title="Delete"><i class="fa fa-trash"></i></button>',
			'    </div>',
			'  </td>',
			'</tr>',
		].join("");
	});
	target.html(html);
	leadAutomationRenderMediaPagination(currentPage, totalPages, totalCount);
}

function leadAutomationRenderMediaPagination(currentPage, totalPages, totalCount) {
	var target = $("#leadAutomationMediaPagination");
	if (!target.length || totalPages <= 1) {
		if (target.length) target.html("");
		return;
	}
	var html = '<div style="display:flex;align-items:center;justify-content:center;gap:4px;flex-wrap:wrap;margin-top:12px;">';
	if (currentPage > 0) {
		html += '<button type="button" class="lead-automation-btn lead-automation-btn--ghost" data-media-page="' + (currentPage - 1) + '" style="padding:4px 10px;font-size:13px;">&larr; Prev</button>';
	}
	var startPage = Math.max(0, currentPage - 2);
	var endPage = Math.min(totalPages - 1, currentPage + 2);
	if (startPage > 0) {
		html += '<button type="button" class="lead-automation-btn lead-automation-btn--ghost" data-media-page="0" style="padding:4px 10px;font-size:13px;">1</button>';
		if (startPage > 1) html += '<span style="padding:0 4px;color:#94a3b8;">...</span>';
	}
	for (var p = startPage; p <= endPage; p++) {
		if (p === currentPage) {
			html += '<button type="button" class="lead-automation-btn" style="padding:4px 12px;font-size:13px;" disabled>' + (p + 1) + '</button>';
		} else {
			html += '<button type="button" class="lead-automation-btn lead-automation-btn--ghost" data-media-page="' + p + '" style="padding:4px 10px;font-size:13px;">' + (p + 1) + '</button>';
		}
	}
	if (endPage < totalPages - 1) {
		if (endPage < totalPages - 2) html += '<span style="padding:0 4px;color:#94a3b8;">...</span>';
		html += '<button type="button" class="lead-automation-btn lead-automation-btn--ghost" data-media-page="' + (totalPages - 1) + '" style="padding:4px 10px;font-size:13px;">' + totalPages + '</button>';
	}
	if (currentPage < totalPages - 1) {
		html += '<button type="button" class="lead-automation-btn lead-automation-btn--ghost" data-media-page="' + (currentPage + 1) + '" style="padding:4px 10px;font-size:13px;">Next &rarr;</button>';
	}
	html += '<span style="margin-left:10px;font-size:12px;color:#94a3b8;">Page ' + (currentPage + 1) + ' of ' + totalPages + ' (' + totalCount + ' items)</span>';
	html += '</div>';
	target.html(html);
}

function leadAutomationBuildMediaEditPreview(item) {
	var state = window.LEAD_AUTOMATION_STATE || {};
	var groupItems = state.selectedMediaEditItems || leadAutomationGetMediaGroupItems(item);
	if (!groupItems.length) {
		return '<div class="lead-automation-mediaPreviewEmpty">No attachment details available.</div>';
	}
	var isEditMode = String(state.selectedMediaEditMode || "view") === "edit";
	var selectedIndex = Math.max(0, Math.min(Number(state.selectedMediaEditIndex || 0), groupItems.length - 1));
	var selectedItem = groupItems[selectedIndex] || groupItems[0] || {};
	var selectedType = String(selectedItem.contentType || "").toLowerCase();
	var selectedUrl = leadAutomationNormalizeMediaUrl(selectedItem.fileUrl || "", selectedItem.storedFileName || selectedItem.name || selectedItem.originalFileName || "");
	var selectedName = String(selectedItem.name || selectedItem.originalFileName || "Untitled");
	var preview = '<div class="lead-automation-mediaThumb__placeholder">' + leadAutomationEscapeHtml((leadAutomationGetFileExtension(selectedName) || item.mediaType || "").toUpperCase() || "FILE") + "</div>";
	if (selectedType.indexOf("image/") === 0 && selectedUrl) {
		preview = '<img data-lead-automation-preview-url="' + leadAutomationEscapeHtml(selectedUrl) + '" alt="' + leadAutomationEscapeHtml(selectedName) + '" class="lead-automation-mediaEditViewer__image" src="">';
	}
	var html = "";
	html += '<div class="lead-automation-mediaEditViewer">';
	html += '  <div class="lead-automation-mediaEditViewer__main">';
	html += '    <div class="lead-automation-mediaEditViewer__frame" data-media-open-url="' + leadAutomationEscapeHtml(selectedUrl) + '">';
	html += preview;
	html += '    </div>';
	html += '    <div class="lead-automation-mediaEditViewer__meta">';
	html += '      <div class="lead-automation-mediaEditViewer__name">' + leadAutomationEscapeHtml(selectedName) + '</div>';
	html += '      <div class="lead-automation-mediaEditViewer__sub">' + leadAutomationEscapeHtml(String(selectedItem.contentType || "Attachment")) + '</div>';
	html += '    </div>';
	html += '  </div>';
	html += '  <div class="lead-automation-mediaEditViewer__thumbs">';

	for (var i = 0; i < groupItems.length; i++) {
		var groupItem = groupItems[i] || {};
		var name = String(groupItem.name || groupItem.originalFileName || "Untitled");
		var type = String(groupItem.contentType || "").toLowerCase();
		var url = leadAutomationNormalizeMediaUrl(groupItem.fileUrl || "", groupItem.storedFileName || groupItem.name || groupItem.originalFileName || "");
		var thumb = '<div class="lead-automation-mediaThumb__placeholder">' + leadAutomationEscapeHtml((leadAutomationGetFileExtension(name) || item.mediaType || "").toUpperCase() || "FILE") + "</div>";
		if (type.indexOf("image/") === 0 && url) {
			thumb = '<img data-lead-automation-preview-url="' + leadAutomationEscapeHtml(url) + '" alt="' + leadAutomationEscapeHtml(name) + '" class="lead-automation-mediaThumb__image" src="">';
		}
		html += '<button type="button" class="lead-automation-mediaEditThumb ' + (i === selectedIndex ? "is-active" : "") + '" data-media-edit-index="' + i + '">';
		html += '  <span class="lead-automation-mediaEditThumb__preview">' + thumb + '</span>';
		html += '  <span class="lead-automation-mediaEditThumb__label">' + leadAutomationEscapeHtml(name) + '</span>';
		if (isEditMode) {
			html += '  <span class="lead-automation-mediaEditThumb__remove" data-media-remove-index="' + i + '" title="Remove">&times;</span>';
		}
		html += '</button>';
	}

	html += "</div></div>";
	return html;
}

function leadAutomationClearMediaEditBlobUrls() {
	var state = window.LEAD_AUTOMATION_STATE || {};
	var blobUrls = state.mediaEditBlobUrls || [];
	for (var i = 0; i < blobUrls.length; i++) {
		try {
			URL.revokeObjectURL(blobUrls[i]);
		} catch (e) {
			// best effort cleanup
		}
	}
	state.mediaEditBlobUrls = [];
}

function leadAutomationHydrateMediaEditPreview() {
	var state = window.LEAD_AUTOMATION_STATE || {};
	var previewImages = $("#leadAutomationMediaEditPreview [data-lead-automation-preview-url]");
	if (!previewImages.length) {
		return;
	}
	leadAutomationClearMediaEditBlobUrls();
	state.mediaEditBlobUrls = [];
	previewImages.each(function () {
		var img = this;
		var url = String($(img).attr("data-lead-automation-preview-url") || "");
		if (!url) return;
		fetch(url, { method: "GET" })
			.then(function (response) {
				if (!response.ok) {
					throw new Error("Unable to fetch image");
				}
				return response.blob();
			})
			.then(function (blob) {
				var blobUrl = URL.createObjectURL(blob);
				state.mediaEditBlobUrls = state.mediaEditBlobUrls || [];
				state.mediaEditBlobUrls.push(blobUrl);
				$(img).attr("src", blobUrl);
			})
			.catch(function () {
				$(img).attr("src", url);
			});
	});
}

function leadAutomationRenderEditNewFilePreviews() {
	var state = window.LEAD_AUTOMATION_STATE || {};
	var files = state.editNewFiles || [];
	var previewWrap = $("#leadAutomationMediaEditNewPreview");
	previewWrap.empty();
	for (var i = 0; i < files.length; i++) {
		var f = files[i];
		var ext = leadAutomationEscapeHtml((f.name || "").split(".").pop().toUpperCase());
		var isImg = /^image\//.test(f.type || "");
		var thumb;
		if (isImg) {
			var blobUrl = URL.createObjectURL(f);
			thumb = '<img src="' + blobUrl + '" style="width:60px;height:60px;object-fit:cover;border-radius:6px;">';
		} else {
			thumb = '<div style="width:60px;height:60px;background:#e2e8f0;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#64748b;">' + ext + '</div>';
		}
		var label = f.name.length > 14 ? leadAutomationEscapeHtml(f.name.substring(0, 12)) + "…" : leadAutomationEscapeHtml(f.name);
		previewWrap.append(
			'<div style="position:relative;background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:8px;width:80px;text-align:center;font-size:10px;">' +
			'<button type="button" data-edit-new-file-remove="' + i + '" style="position:absolute;top:-6px;right:-6px;width:20px;height:20px;border-radius:50%;background:#ef4444;color:#fff;border:none;font-size:12px;line-height:20px;cursor:pointer;padding:0;" title="Remove">&times;</button>' +
			thumb +
			'<div style="margin-top:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="' + leadAutomationEscapeHtml(f.name) + '">' + label + '</div>' +
			'</div>'
		);
	}
}

function leadAutomationOpenMediaEditModal(tabId, itemId, mode) {
	var allMedia = window.LEAD_AUTOMATION_STATE.allMedia || [];
	var item = null;
	for (var i = 0; i < allMedia.length; i++) {
		if (String(allMedia[i].id || "") === String(itemId || "")) {
			item = allMedia[i];
			break;
		}
	}
	if (!item) {
		leadAutomationShowMessage("Media item not found. Refreshing list...", "error");
		leadAutomationLoadAllMedia();
		return false;
	}

	var title = String(item.title || "");
	var tags = String(item.tags || "");
	var channel = String(item.channel || "WhatsApp");
	var mediaType = String(item.mediaType || "");
	var fileNames = leadAutomationParseFileNames(item.originalFileName);
	var fileName = fileNames.length ? fileNames.join(", ") : title;

	$("#leadAutomationMediaEditModalTitle").text("Edit media — " + leadAutomationEscapeHtml(title));
	$("#leadAutomationMediaEditId").val(String(item.id || ""));
	$("#leadAutomationMediaEditTab").val(mediaType);
	$("#leadAutomationMediaEditTitle").val(title);
	$("#leadAutomationMediaEditChannel").val(channel);
	var storedNames = leadAutomationParseFileNames(item.storedFileName);
	var baseUrl = String(item.fileUrl || "");
	var baseUrlPrefix = baseUrl.lastIndexOf("/") >= 0 ? baseUrl.substring(0, baseUrl.lastIndexOf("/") + 1) : "";

	window.LEAD_AUTOMATION_STATE.editFileNames = fileNames.slice();
	window.LEAD_AUTOMATION_STATE.editStoredNames = storedNames.slice();
	window.LEAD_AUTOMATION_STATE.editBaseUrlPrefix = baseUrlPrefix;
	window.LEAD_AUTOMATION_STATE.editMediaType = mediaType;
	window.LEAD_AUTOMATION_STATE.editFileSizeLabel = item.fileSizeLabel || "";
	leadAutomationRenderEditFileInfo();
	window.LEAD_AUTOMATION_STATE.editMediaItem = item;

	// Clear any previously staged new files
	var addFilesInput = document.getElementById("leadAutomationMediaEditAddFiles");
	if (addFilesInput) addFilesInput.value = "";
	window.LEAD_AUTOMATION_STATE.editNewFiles = [];
	$("#leadAutomationMediaEditNewPreview").empty();

	$("#leadAutomationMediaEditModal").appendTo("body");
	$("#leadAutomationMediaEditModal").addClass("show").attr("aria-hidden", "false");
	setTimeout(function () {
		leadAutomationInitTagSelects("#leadAutomationMediaEditModal");
		leadAutomationSetTagSelectValues("#leadAutomationMediaEditTags", tags);
	}, 0);
	return false;
}

function leadAutomationEnterMediaEditMode() {
	window.LEAD_AUTOMATION_STATE.selectedMediaEditMode = "edit";
	$("#leadAutomationMediaEditModalTitle").text("Edit media group");
	$("#leadAutomationMediaEditTitle, #leadAutomationMediaEditChannel, #leadAutomationMediaEditTags").prop("disabled", false);
	$("#leadAutomationMediaEditModal [data-lead-automation-action='media-modal-edit']").hide();
	$("#leadAutomationMediaEditModal [data-lead-automation-action='media-modal-save']").show();
	setTimeout(function () {
		leadAutomationInitTagSelects("#leadAutomationMediaEditModal");
	}, 0);
	return false;
}

function leadAutomationRenderMediaEditPreview(item) {
	$("#leadAutomationMediaEditPreview").html(leadAutomationBuildMediaEditPreview(item));
	leadAutomationHydrateMediaEditPreview();
}

function leadAutomationSetMediaEditSelectedIndex(index) {
	var state = window.LEAD_AUTOMATION_STATE || {};
	var items = state.selectedMediaEditItems || [];
	if (!items.length) return;
	var nextIndex = Math.max(0, Math.min(Number(index || 0), items.length - 1));
	state.selectedMediaEditIndex = nextIndex;
	leadAutomationRenderMediaEditPreview(leadAutomationGetSavedMediaItem(state.selectedMediaEditTab, state.selectedMediaEditId));
}

function leadAutomationRemoveMediaEditItem(index) {
	var state = window.LEAD_AUTOMATION_STATE || {};
	var items = state.selectedMediaEditItems || [];
	if (!items.length) return false;
	var nextItems = [];
	for (var i = 0; i < items.length; i++) {
		if (i !== Number(index)) {
			nextItems.push(items[i]);
		}
	}
	if (!nextItems.length) {
		leadAutomationShowMessage("At least one image must remain in the group.", "error");
		return false;
	}
	state.selectedMediaEditItems = nextItems;
	state.selectedMediaEditIndex = Math.min(state.selectedMediaEditIndex || 0, nextItems.length - 1);
	leadAutomationRenderMediaEditPreview(leadAutomationGetSavedMediaItem(state.selectedMediaEditTab, state.selectedMediaEditId));
	return false;
}

function leadAutomationSaveMediaFromModal() {
	var itemId = Number($("#leadAutomationMediaEditId").val() || 0);
	var tabId = String($("#leadAutomationMediaEditTab").val() || window.LEAD_AUTOMATION_STATE.selectedMediaEditTab || "images");
	var controllerRoot = leadAutomationGetMediaControllerRoot();
	if (!controllerRoot || !itemId) {
		leadAutomationShowMessage("Unable to save media.", "error");
		return false;
	}
	if (window.LEAD_AUTOMATION_STATE && window.LEAD_AUTOMATION_STATE.mediaEditSaving) {
		return false;
	}
	var editFileNames = window.LEAD_AUTOMATION_STATE.editFileNames || [];
	var editStoredNames = window.LEAD_AUTOMATION_STATE.editStoredNames || [];
	var pendingNewFiles = (window.LEAD_AUTOMATION_STATE.editNewFiles || []).length;
	if (!editFileNames.length && !pendingNewFiles) {
		leadAutomationShowModalError("Please add at least one file before saving, or close without saving.");
		return false;
	}

	window.LEAD_AUTOMATION_STATE.mediaEditSaving = true;
	var saveButton = $("#leadAutomationMediaEditModal [data-lead-automation-action='media-modal-save']");
	saveButton.prop("disabled", true);
	leadAutomationSetBusy(true, "Updating media...", "Please wait while the media group is being saved.");
	var attachments = [];
	for (var ai = 0; ai < editStoredNames.length; ai++) {
		attachments.push({
			name: editFileNames[ai] || editStoredNames[ai] || "",
			storedFileName: editStoredNames[ai] || "",
			contentType: "",
			fileUrl: "",
		});
	}

	var basePayload = {
		id: itemId,
		title: String($("#leadAutomationMediaEditTitle").val() || "").trim(),
		channel: String($("#leadAutomationMediaEditChannel").val() || "WhatsApp").trim(),
		tags: leadAutomationNormalizeTagValues($("#leadAutomationMediaEditTags").val()).join(","),
		mediaType: tabId,
		attachmentsJson: JSON.stringify(attachments),
	};

	var newFiles = (window.LEAD_AUTOMATION_STATE.editNewFiles || []).slice();

	function doSave(filesJsonStr) {
		var payload = $.extend({}, basePayload);
		if (filesJsonStr) payload.filesJson = filesJsonStr;
		setTimeout(function () {
			$.ajax({
				type: "POST",
				url: controllerRoot + "/save",
				contentType: "application/json; charset=utf-8",
				dataType: "text",
				cache: false,
				data: JSON.stringify(leadAutomationBuildPayloadRequest(payload)),
			}).done(function (resp) {
				leadAutomationSetBusy(false);
				window.LEAD_AUTOMATION_STATE.mediaEditSaving = false;
				saveButton.prop("disabled", false);
				var data = leadAutomationParsePayloadResponse(resp);
				var status = String((data && data.status) || "").toUpperCase();
				if (status === "FAILED" || status === "EXCEPTION" || status === "SESSIONOUT") {
					leadAutomationShowPopup((data && data.message) || "Unable to save media.", "error");
					return;
				}
				leadAutomationClearMediaEditBlobUrls();
				$("#leadAutomationMediaEditModal").removeClass("show").attr("aria-hidden", "true");
				setTimeout(function () {
					var successMessage = (data && data.message) || "Media updated successfully.";
					leadAutomationShowPopup(successMessage, "success");
					leadAutomationShowMessage(successMessage, "success");
					leadAutomationLoadAllMedia();
				}, 120);
			}).fail(function () {
				leadAutomationSetBusy(false);
				window.LEAD_AUTOMATION_STATE.mediaEditSaving = false;
				saveButton.prop("disabled", false);
				leadAutomationShowPopup("Unable to save media.", "error");
			});
		}, 0);
	}

	if (newFiles.length > 0) {
		var filePromises = newFiles.map(function (f) { return leadAutomationFileToJson(f); });
		Promise.all(filePromises).then(function (filesJsonArr) {
			doSave(JSON.stringify(filesJsonArr));
		}).catch(function () {
			leadAutomationSetBusy(false);
			window.LEAD_AUTOMATION_STATE.mediaEditSaving = false;
			saveButton.prop("disabled", false);
			leadAutomationShowMessage("Unable to read selected file(s).", "error");
		});
	} else {
		doSave(null);
	}
	return false;
}

window.LEAD_AUTOMATION_STAGED_FILES = window.LEAD_AUTOMATION_STAGED_FILES || [];

function leadAutomationRenderFilePreview() {
	var fileInput = $("#leadAutomationMediaFiles")[0];
	var files = fileInput && fileInput.files ? fileInput.files : [];
	var stagedFiles = [];
	for (var i = 0; i < files.length; i++) {
		stagedFiles.push(files[i]);
	}
	window.LEAD_AUTOMATION_STAGED_FILES = stagedFiles;
	leadAutomationDrawFilePreview();
}

function leadAutomationDrawFilePreview() {
	var target = $("#leadAutomationMediaFilePreview");
	if (!target.length) return;
	var files = window.LEAD_AUTOMATION_STAGED_FILES || [];
	if (!files.length) {
		target.html("");
		return;
	}
	var html = "";
	for (var i = 0; i < files.length; i++) {
		var file = files[i];
		var name = file.name || "Untitled";
		var size = file.size ? (file.size / 1024).toFixed(1) + " KB" : "";
		var isImage = file.type && file.type.indexOf("image/") === 0;
		var preview = '<div style="width:60px;height:60px;background:#e2e8f0;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#64748b;">' +
			leadAutomationEscapeHtml(name.split(".").pop().toUpperCase()) + '</div>';
		if (isImage) {
			try {
				var blobUrl = URL.createObjectURL(file);
				preview = '<img src="' + blobUrl + '" style="width:60px;height:60px;object-fit:cover;border-radius:6px;">';
			} catch (e) { /* fallback to placeholder */ }
		}
		html += '<div style="position:relative;background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:8px;width:140px;text-align:center;">' +
			'<button type="button" data-file-preview-remove="' + i + '" style="position:absolute;top:-6px;right:-6px;width:20px;height:20px;border-radius:50%;background:#ef4444;color:#fff;border:none;font-size:12px;line-height:20px;cursor:pointer;padding:0;">&times;</button>' +
			preview +
			'<div style="font-size:11px;margin-top:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="' + leadAutomationEscapeHtml(name) + '">' + leadAutomationEscapeHtml(name) + '</div>' +
			'<div style="font-size:10px;color:#94a3b8;">' + leadAutomationEscapeHtml(size) + '</div>' +
			'</div>';
	}
	target.html(html);
}

function leadAutomationRemoveFileFromInput(removeIndex) {
	var files = window.LEAD_AUTOMATION_STAGED_FILES || [];
	var newFiles = [];
	for (var i = 0; i < files.length; i++) {
		if (i !== removeIndex) {
			newFiles.push(files[i]);
		}
	}
	window.LEAD_AUTOMATION_STAGED_FILES = newFiles;

	var dt = new DataTransfer();
	for (var j = 0; j < newFiles.length; j++) {
		dt.items.add(newFiles[j]);
	}
	var fileInput = $("#leadAutomationMediaFiles")[0];
	if (fileInput) {
		fileInput.files = dt.files;
	}
	leadAutomationDrawFilePreview();
}

function leadAutomationShowModalError(message) {
	var el = $("#leadAutomationMediaEditError");
	if (!el.length) return;
	el.text(message || "").show();
	clearTimeout(window._laModalErrorTimer);
	window._laModalErrorTimer = setTimeout(function () { el.hide().text(""); }, 3500);
}

function leadAutomationClearModalError() {
	$("#leadAutomationMediaEditError").hide().text("");
}

function leadAutomationRenderEditFileInfo() {
	var state = window.LEAD_AUTOMATION_STATE || {};
	var fileNames = state.editFileNames || [];
	var storedNames = state.editStoredNames || [];
	var baseUrlPrefix = state.editBaseUrlPrefix || "";
	var mediaType = state.editMediaType || "";
	var fileSizeLabel = state.editFileSizeLabel || "";

	var html = '<strong>Type:</strong> ' + leadAutomationEscapeHtml(mediaType) +
		(fileSizeLabel ? ' &nbsp;|&nbsp; <strong>Size:</strong> ' + leadAutomationEscapeHtml(fileSizeLabel) : '') +
		' &nbsp;|&nbsp; <strong>Files (' + fileNames.length + '):</strong>';
	html += '<div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:8px;">';
	for (var fi = 0; fi < fileNames.length; fi++) {
		var storedName = storedNames[fi] || storedNames[0] || "";
		var fileUrl = baseUrlPrefix ? baseUrlPrefix + encodeURIComponent(storedName) : "";
		var isImage = /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(fileNames[fi]);
		var isVideo = /\.(mp4|mov|webm|m4v|avi|mkv|ogg)$/i.test(fileNames[fi]);
		var ext = fileNames[fi].split(".").pop().toUpperCase();
		var previewHtml = '<div style="width:60px;height:60px;background:#e2e8f0;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#64748b;">' + leadAutomationEscapeHtml(ext) + '</div>';
		if (isImage && fileUrl) {
			previewHtml = '<img src="' + leadAutomationEscapeHtml(fileUrl) + '" style="width:60px;height:60px;object-fit:cover;border-radius:6px;">';
		} else if (isVideo) {
			previewHtml = '<div style="width:60px;height:60px;background:#1e293b;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:18px;color:#fff;">▶</div>';
		}
		html += '<div style="position:relative;background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:8px;width:120px;text-align:center;" data-edit-file-index="' + fi + '">' +
			'<button type="button" data-edit-file-remove="' + fi + '" style="position:absolute;top:-6px;right:-6px;width:20px;height:20px;border-radius:50%;background:#ef4444;color:#fff;border:none;font-size:12px;line-height:20px;cursor:pointer;padding:0;">&times;</button>' +
			previewHtml +
			'<div style="font-size:10px;margin-top:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="' + leadAutomationEscapeHtml(fileNames[fi]) + '">' + leadAutomationEscapeHtml(fileNames[fi]) + '</div>' +
			'</div>';
	}
	html += '</div>';
	$("#leadAutomationMediaEditFileInfo").html(html);
}

function leadAutomationRemoveEditFile(removeIndex) {
	var state = window.LEAD_AUTOMATION_STATE || {};
	var fileNames = state.editFileNames || [];
	var storedNames = state.editStoredNames || [];
	var newFileNames = [];
	var newStoredNames = [];
	for (var i = 0; i < fileNames.length; i++) {
		if (i !== removeIndex) {
			newFileNames.push(fileNames[i]);
			newStoredNames.push(storedNames[i] || "");
		}
	}
	state.editFileNames = newFileNames;
	state.editStoredNames = newStoredNames;
	leadAutomationClearModalError();
	// Re-render with corrected indices so subsequent deletes work correctly
	leadAutomationRenderEditFileInfo();
}

function leadAutomationParseFileNames(rawValue) {
	var value = String(rawValue || "").trim();
	if (!value) return [];
	try {
		if (value.charAt(0) === "[") {
			var parsed = JSON.parse(value);
			if ($.isArray(parsed)) return parsed;
		}
	} catch (e) { /* fall through */ }
	return value.replace(/[\[\]"]/g, "").split(",").map(function (s) { return $.trim(s); }).filter(Boolean);
}

function leadAutomationBuildFileNameCell(rawValue, fallback) {
	var names = leadAutomationParseFileNames(rawValue);
	if (!names.length) return leadAutomationEscapeHtml(fallback || "Untitled");
	if (names.length === 1) return leadAutomationEscapeHtml(names[0]);
	return leadAutomationEscapeHtml(names[0]) + ' <span class="lead-automation-badge lead-automation-badge--neutral">+' + (names.length - 1) + ' more</span>';
}

function leadAutomationShowMediaViewModal(itemId) {
	var allMedia = window.LEAD_AUTOMATION_STATE.allMedia || [];
	var item = null;
	for (var i = 0; i < allMedia.length; i++) {
		if (String(allMedia[i].id || "") === String(itemId || "")) {
			item = allMedia[i];
			break;
		}
	}
	if (!item) {
		leadAutomationShowMessage("Media item not found.", "error");
		return;
	}
	var fileNames = leadAutomationParseFileNames(item.originalFileName);
	var storedNames = leadAutomationParseFileNames(item.storedFileName);
	var baseUrl = String(item.fileUrl || "");
	var baseUrlPrefix = baseUrl.lastIndexOf("/") >= 0 ? baseUrl.substring(0, baseUrl.lastIndexOf("/") + 1) : "";
	var mediaType = String(item.mediaType || "").toLowerCase();

	var html = '<div style="margin-bottom:12px;">';
	html += '<strong>Title:</strong> ' + leadAutomationEscapeHtml(item.title || "Untitled");
	html += ' &nbsp;|&nbsp; <strong>Type:</strong> ' + leadAutomationEscapeHtml(mediaType);
	html += ' &nbsp;|&nbsp; <strong>Channel:</strong> ' + leadAutomationEscapeHtml(item.channel || "-");
	if (item.fileSizeLabel) html += ' &nbsp;|&nbsp; <strong>Size:</strong> ' + leadAutomationEscapeHtml(item.fileSizeLabel);
	html += '</div>';

	if (item.tags) {
		html += '<div style="margin-bottom:12px;">' + leadAutomationRenderMediaTags(item.tags) + '</div>';
	}

	html += '<div style="display:flex;flex-wrap:wrap;gap:12px;">';
	for (var fi = 0; fi < fileNames.length; fi++) {
		var fileName = fileNames[fi];
		var storedName = storedNames[fi] || storedNames[0] || "";
		var fileUrl = baseUrlPrefix ? baseUrlPrefix + encodeURIComponent(storedName) : "";
		var isImage = /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(fileName);
		var isVideo = /\.(mp4|mov|webm|m4v|avi|mkv|ogg)$/i.test(fileName);
		var isPdf = /\.(pdf)$/i.test(fileName);

		html += '<div style="border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;width:220px;background:#fff;">';
		if (isImage && fileUrl) {
			html += '<a href="' + leadAutomationEscapeHtml(fileUrl) + '" target="_blank"><img src="' + leadAutomationEscapeHtml(fileUrl) + '" style="width:220px;height:160px;object-fit:cover;display:block;"></a>';
		} else if (isVideo && fileUrl) {
			html += '<video src="' + leadAutomationEscapeHtml(fileUrl) + '" controls style="width:220px;height:160px;object-fit:cover;display:block;"></video>';
		} else if (isPdf && fileUrl) {
			html += '<a href="' + leadAutomationEscapeHtml(fileUrl) + '" target="_blank" style="display:flex;align-items:center;justify-content:center;width:220px;height:160px;background:#f1f5f9;font-size:32px;font-weight:800;color:#ef4444;text-decoration:none;">PDF</a>';
		} else {
			html += '<a href="' + leadAutomationEscapeHtml(fileUrl) + '" target="_blank" style="display:flex;align-items:center;justify-content:center;width:220px;height:160px;background:#f1f5f9;font-size:14px;color:#64748b;text-decoration:none;">📎 Open file</a>';
		}
		html += '<div style="padding:8px;font-size:11px;color:#475569;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="' + leadAutomationEscapeHtml(fileName) + '">' + leadAutomationEscapeHtml(fileName) + '</div>';
		html += '</div>';
	}
	html += '</div>';

	var modal = $("#leadAutomationMediaViewModal");
	if (!modal.length) {
		modal = $([
			'<div id="leadAutomationMediaViewModal" style="position:fixed;top:0;left:0;width:100%;height:100%;z-index:20000;display:none;align-items:center;justify-content:center;background:rgba(15,23,42,0.42);">',
			'  <div style="background:#fff;border-radius:16px;box-shadow:0 18px 44px rgba(15,23,42,0.22);max-width:800px;width:90%;max-height:85vh;overflow-y:auto;padding:0;">',
			'    <div style="display:flex;justify-content:space-between;align-items:center;padding:16px 20px;border-bottom:1px solid #e2e8f0;">',
			'      <h5 id="leadAutomationMediaViewModalTitle" style="margin:0;font-size:16px;font-weight:700;">Media Preview</h5>',
			'      <button type="button" data-lead-automation-action="media-view-close" style="background:none;border:none;font-size:22px;cursor:pointer;color:#64748b;">&times;</button>',
			'    </div>',
			'    <div id="leadAutomationMediaViewModalBody" style="padding:20px;"></div>',
			'  </div>',
			'</div>',
		].join(""));
		$("body").append(modal);
	}
	$("#leadAutomationMediaViewModalTitle").text("Preview — " + (item.title || "Media"));
	$("#leadAutomationMediaViewModalBody").html(html);
	modal.css("display", "flex");
}

function leadAutomationDeleteSavedMediaById(itemId) {
	var controllerRoot = leadAutomationGetMediaControllerRoot();
	if (!controllerRoot || !itemId) return;
	$.ajax({
		type: "POST",
		url: controllerRoot + "/delete",
		contentType: "application/json; charset=utf-8",
		dataType: "text",
		cache: false,
		data: JSON.stringify(leadAutomationBuildPayloadRequest({ id: Number(itemId) })),
	}).done(function (resp) {
		var data = leadAutomationParsePayloadResponse(resp);
		var status = String((data && data.status) || "").toUpperCase();
		if (status === "FAILED" || status === "EXCEPTION" || status === "SESSIONOUT") {
			leadAutomationShowMessage((data && data.message) || "Unable to delete media.", "error");
			return;
		}
		leadAutomationShowMessage((data && data.message) || "Media deleted successfully.", "success");
		leadAutomationLoadAllMedia();
	}).fail(function () {
		leadAutomationShowMessage("Unable to delete media.", "error");
	});
}

function leadAutomationCloseMediaEditModal() {
	$("#leadAutomationMediaEditModal").removeClass("show").attr("aria-hidden", "true");
	leadAutomationClearMediaEditBlobUrls();
	window.LEAD_AUTOMATION_STATE.selectedMediaEditItems = [];
	window.LEAD_AUTOMATION_STATE.selectedMediaEditIndex = 0;
	window.LEAD_AUTOMATION_STATE.mediaEditSaving = false;
	$("#leadAutomationMediaEditModal [data-lead-automation-action='media-modal-save']").prop("disabled", false);
	$("#leadAutomationMediaEditModal [data-lead-automation-action='media-modal-edit']").prop("disabled", false).show();
	leadAutomationSetBusy(false);
	return false;
}

function leadAutomationDeleteMediaFile(tabId, itemId) {
	var bucket = leadAutomationGetMediaBucket(tabId);
	var list = window.LEAD_AUTOMATION_STATE.mediaUploads[bucket] || [];
	return leadAutomationShowConfirmDialog(
		"Delete this attachment?",
		function () {
	for (var i = list.length - 1; i >= 0; i--) {
		if (String(list[i].id || "") === String(itemId || "")) {
			if (list[i].isObjectUrl && list[i].url) {
				URL.revokeObjectURL(list[i].url);
			}
			list.splice(i, 1);
			break;
		}
	}
	window.LEAD_AUTOMATION_STATE.mediaUploads[bucket] = list;
	leadAutomationRenderMediaPreviews();
	return false;
		},
		"Delete attachment"
	);
}

function leadAutomationParseMediaListValue(value) {
	if (Array.isArray(value)) {
		return value.slice();
	}
	var text = String(value == null ? "" : value).trim();
	if (!text) {
		return [];
	}
	if (text.charAt(0) !== "[" && text.charAt(0) !== "{") {
		return [text];
	}
	try {
		var parsed = JSON.parse(text);
		if (Array.isArray(parsed)) {
			return parsed;
		}
	} catch (e) {
		return [text];
	}
	return [text];
}

function leadAutomationBuildMediaUrl(fileName) {
	var base = String(window.FILE_UPLOAD_PATH || "");
	var name = String(fileName || "").trim();
	if (!name) return "";
	if (!base) return name;
	if (/^https?:\/\//i.test(name)) return name;
	var bucket = "";
	try {
		var baseParts = base.replace(/\\/g, "/").split("/").filter(Boolean);
		bucket = baseParts.length ? baseParts[baseParts.length - 1] : "";
	} catch (e) {
		bucket = "";
	}
	if (bucket && name.indexOf(bucket + "/") === 0) {
		name = name.substring(bucket.length + 1);
	}
	return leadAutomationEncodeMediaUrl(base + name);
}

function leadAutomationNormalizeMediaUrl(url, fallbackFileName) {
	var raw = String(url || "").trim();
	if (!raw) {
		return leadAutomationBuildMediaUrl(fallbackFileName);
	}
	if (!/^https?:\/\//i.test(raw)) {
		return leadAutomationBuildMediaUrl(raw || fallbackFileName);
	}
	var base = String(window.FILE_UPLOAD_PATH || "");
	var bucket = "";
	try {
		var baseParts = base.replace(/\\/g, "/").split("/").filter(Boolean);
		bucket = baseParts.length ? baseParts[baseParts.length - 1] : "";
	} catch (e) {
		bucket = "";
	}
	if (bucket) {
		var duplicatePrefix = "/" + bucket + "/" + bucket + "/";
		while (raw.indexOf(duplicatePrefix) >= 0) {
			raw = raw.replace(duplicatePrefix, "/" + bucket + "/");
		}
	}
	return leadAutomationEncodeMediaUrl(raw);
}

function leadAutomationEncodeMediaUrl(url) {
	var value = String(url || "").trim();
	if (!value) return "";
	value = value.replace(/\u00A0/g, " ").replace(/\u202F/g, " ");
	try {
		value = decodeURI(value);
	} catch (e) {
		// keep original value when it is not safely decoded
	}
	return encodeURI(value);
}

function leadAutomationGetMediaGroupItems(item) {
	var names = leadAutomationParseMediaListValue(item && item.originalFileName);
	var storedNames = leadAutomationParseMediaListValue(item && item.storedFileName);
	var types = leadAutomationParseMediaListValue(item && item.contentType);
	var items = [];
	for (var i = 0; i < storedNames.length; i++) {
		var storedName = String(storedNames[i] || "");
		var resolvedUrl = leadAutomationBuildMediaUrl(storedName);
		if (!resolvedUrl && item && item.fileUrl) {
			resolvedUrl = leadAutomationNormalizeMediaUrl(item.fileUrl, storedName);
		}
		items.push({
			name: String(names[i] || names[0] || storedName || "Untitled"),
			storedFileName: storedName,
			fileUrl: resolvedUrl,
			contentType: String(types[i] || types[0] || ""),
		});
	}
	if (!items.length) {
		var fallbackStoredName = String(item && item.storedFileName ? item.storedFileName : "");
		items.push({
			name: String(item && item.originalFileName ? item.originalFileName : item && item.title ? item.title : "Untitled"),
			storedFileName: fallbackStoredName,
			fileUrl: leadAutomationBuildMediaUrl(fallbackStoredName) || String(item && item.fileUrl ? item.fileUrl : ""),
			contentType: String(item && item.contentType ? item.contentType : ""),
		});
	}
	return items;
}

function leadAutomationGetPreferredMediaEditIndex(groupItems, bucket) {
	var items = $.isArray(groupItems) ? groupItems : [];
	var mediaBucket = String(bucket || "").toLowerCase();
	var matchers = {
		images: function (item) {
			var type = String((item && item.contentType) || "").toLowerCase();
			var name = String((item && item.name) || "").toLowerCase();
			return type.indexOf("image/") === 0 || /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(name);
		},
		videos: function (item) {
			var type = String((item && item.contentType) || "").toLowerCase();
			var name = String((item && item.name) || "").toLowerCase();
			return type.indexOf("video/") === 0 || /\.(mp4|mov|webm|m4v|avi|mkv|ogg)$/i.test(name);
		},
		pdfs: function (item) {
			var type = String((item && item.contentType) || "").toLowerCase();
			var name = String((item && item.name) || "").toLowerCase();
			return type.indexOf("application/pdf") === 0 || /\.(pdf|docx?|rtf|odt)$/i.test(name);
		}
	};
	var matcher = matchers[mediaBucket];
	if (matcher) {
		for (var i = 0; i < items.length; i++) {
			if (matcher(items[i])) {
				return i;
			}
		}
	}
	return 0;
}

function leadAutomationBuildSavedMediaRow(item, tabId) {
	var groupItems = leadAutomationGetMediaGroupItems(item);
	var firstItem = groupItems[0] || {};
	var name = firstItem.name || item.originalFileName || item.title || item.storedFileName || "Untitled";
	var typeLabel = item.mediaType || tabId || "";
	var sizeLabel = item.fileSizeLabel || leadAutomationFormatFileSize(item.fileSizeBytes || 0);
	var countLabel = groupItems.length > 1 ? " +" + (groupItems.length - 1) + " more" : "";
	return [
		'<tr data-media-id="' + leadAutomationEscapeHtml(String(item.id || "")) + '" data-media-tab="' + leadAutomationEscapeHtml(String(tabId || "")) + '">',
		'  <td>' + leadAutomationEscapeHtml(item.title || name) + '</td>',
		'  <td>' + leadAutomationEscapeHtml(name) + leadAutomationEscapeHtml(countLabel) + '</td>',
		'  <td>' + leadAutomationEscapeHtml(typeLabel) + '</td>',
		'  <td>' + leadAutomationEscapeHtml(sizeLabel) + '</td>',
		'  <td>' + leadAutomationEscapeHtml(item.channel || "WhatsApp") + '</td>',
		'  <td>' + leadAutomationRenderMediaTags(item.tags) + '</td>',
		'  <td>',
		'    <div class="lead-automation-rowActions">',
		'      <button type="button" class="lead-automation-rowAction" data-lead-automation-action="media-view" data-media-tab="' + leadAutomationEscapeHtml(String(tabId || "")) + '" data-media-id="' + leadAutomationEscapeHtml(String(item.id || "")) + '" title="View"><i class="fa fa-eye"></i></button>',
		'      <button type="button" class="lead-automation-rowAction" data-lead-automation-action="media-edit" data-media-tab="' + leadAutomationEscapeHtml(String(tabId || "")) + '" data-media-id="' + leadAutomationEscapeHtml(String(item.id || "")) + '" title="Edit"><i class="fa fa-edit"></i></button>',
		'      <button type="button" class="lead-automation-rowAction lead-automation-rowAction--danger" data-lead-automation-media-db-delete="' + leadAutomationEscapeHtml(String(item.id || "")) + '" title="Delete"><i class="fa fa-trash"></i></button>',
		'    </div>',
		'  </td>',
		"</tr>",
	].join("");
}

function leadAutomationRenderSavedMediaTable(tabId, items) {
	var target = $("#leadAutomationMediaTable-" + tabId);
	if (!target.length) return;
	if (!items || !items.length) {
		target.html('<tr><td colspan="7"><div class="lead-automation-mediaPreviewEmpty">No files uploaded yet for this tab.</div></td></tr>');
		return;
	}
	var html = "";
	$.each(items, function (_, item) {
		html += leadAutomationBuildSavedMediaRow(item, tabId);
	});
	target.html(html);
}

function leadAutomationGetFollowupApiRoot() {
	var schoolKey = window.SCHOOL_ID || window.SCHOOL_UUID || "";
	if (!schoolKey) return "";
	if (window.APP_BASE_URL) {
		return window.APP_BASE_URL + schoolKey + "/dashboard/lead-automation-followup";
	}
	if (window.BASE_URL && window.CONTEXT_PATH) {
		return window.BASE_URL + window.CONTEXT_PATH + schoolKey + "/dashboard/lead-automation-followup";
	}
	return "";
}

function leadAutomationLoadFollowupLogs(page) {
	var apiRoot = leadAutomationGetFollowupApiRoot();
	if (!apiRoot) {
		leadAutomationShowMessage("Missing API base URL.", "error");
		return;
	}
	var state = window.LEAD_AUTOMATION_STATE || {};
	var pageNum = (typeof page === "number") ? page : 0;
	var filterLeadId = String($("#leadAutomationLogsFilterLeadId").val() || state.followupLogsFilterLeadId || "").trim();
	state.followupLogsFilterLeadId = filterLeadId;

	var requestData = { page: pageNum, size: 10 };
	if (filterLeadId) {
		requestData.leadNo = filterLeadId;
	}

	$.ajax({
		type: "POST",
		url: apiRoot + "/logs",
		contentType: "application/json; charset=utf-8",
		dataType: "text",
		cache: false,
		data: JSON.stringify(leadAutomationBuildPayloadRequest(requestData)),
	}).done(function (resp) {
		var data = leadAutomationParsePayloadResponse(resp);
		var status = String((data && data.status) || "").toUpperCase();
		if (status === "FAILED" || status === "EXCEPTION" || status === "SESSIONOUT") {
			leadAutomationShowMessage((data && data.message) || "Unable to load logs.", "error");
			return;
		}
		state.followupLogs = $.isArray(data.logs) ? data.logs : [];
		state.followupLogsTotalCount = data.totalCount || 0;
		state.followupLogsPage = pageNum;
		state.followupLogsLoaded = true;
		$(".lead-automation-card__title:contains('Follow-up log')").text("Follow-up log (" + state.followupLogsTotalCount + " total)");

		var tableBody = $("#leadAutomationLogsTableBody");
		if (tableBody.length) {
			tableBody.html(leadAutomationBuildFollowupLogsRows(state.followupLogs));
			// Start live countdowns for Scheduled rows
			if (typeof leadAutomationStartLogCountdowns === "function") {
				leadAutomationStartLogCountdowns();
			}
		}
		leadAutomationRenderLogsPagination();
	}).fail(function () {
		leadAutomationShowMessage("Unable to load follow-up logs.", "error");
	});
}

function leadAutomationShowFollowupLogDetail(logId) {
	var state = window.LEAD_AUTOMATION_STATE || {};
	var logs = state.followupLogs || [];
	var logItem = null;
	for (var i = 0; i < logs.length; i++) {
		if (String(logs[i].id || "") === String(logId || "")) {
			logItem = logs[i];
			break;
		}
	}
	if (!logItem) {
		leadAutomationShowMessage("Log entry not found.", "error");
		return;
	}

	// Human-readable status label
	var rawStatus = String(logItem.sendStatus || "").toUpperCase();
	var statusLabel = rawStatus;
	if      (rawStatus === "RESUMED")          statusLabel = "Scheduled";
	else if (rawStatus === "SCHEDULED")        statusLabel = "Scheduled";
	else if (rawStatus === "PAUSED")           statusLabel = "Paused";
	else if (rawStatus === "SKIPPED")          statusLabel = "Skipped";
	else if (rawStatus === "SENT")             statusLabel = "Sent";
	else if (rawStatus === "FAILED")           statusLabel = "Failed";
	else if (rawStatus === "PENDING_APPROVAL") statusLabel = "Pending Approval";
	else if (rawStatus === "PREVIEW")          statusLabel = "Preview";

	$("#leadAutomationLogDetailModalTitle").text("Follow-up #" + (logItem.id || "") + " — " + statusLabel);

	$("#leadAutomationLogDetailRecipient").html(
		'<strong>Recipient:</strong> ' + leadAutomationEscapeHtml(logItem.recipientEmail || "N/A") +
		' &nbsp;|&nbsp; <strong>Channel:</strong> ' + leadAutomationEscapeHtml(logItem.channel || "N/A") +
		' &nbsp;|&nbsp; <strong>Lead:</strong> ' + leadAutomationEscapeHtml(String(logItem.leadNo || logItem.leadId || "N/A"))
	);

	$("#leadAutomationLogDetailBody").html(logItem.generatedEmailBody || '<span class="text-muted">No email body recorded.</span>');

	// ── Attachments preview inside the detail modal ──────────────────────────
	var fileUrlsStr    = String(logItem.selectedFileUrls  || "").trim();
	var resourceTitles = String(logItem.matchedResourceTitles || "").trim();
	var attachSection  = $("#leadAutomationLogDetailAttachments");

	// Build or replace attachments section (appended after modal body if not present)
	if (!attachSection.length) {
		$("#leadAutomationLogDetailBody").after('<div id="leadAutomationLogDetailAttachments" style="margin-top:14px;"></div>');
		attachSection = $("#leadAutomationLogDetailAttachments");
	}

	if (fileUrlsStr) {
		var fileUrls = fileUrlsStr.split("\t").map(function(u){ return u.trim(); }).filter(Boolean);
		var titles   = resourceTitles.split(",").map(function(t){ return t.trim(); }).filter(Boolean);

		var gridHtml = '<div style="margin-bottom:8px;font-size:12px;font-weight:600;color:#667085;text-transform:uppercase;letter-spacing:.4px;">Attachments (' + fileUrls.length + ')</div>';
		gridHtml += '<div style="display:flex;flex-wrap:wrap;gap:12px;">';

		for (var i = 0; i < fileUrls.length; i++) {
			var url   = fileUrls[i];
			var name  = titles[i] || ("File " + (i + 1));
			var lower = url.toLowerCase();
			var isImg = /\.(jpg|jpeg|png|gif|webp|svg|bmp)(\?|$)/.test(lower);
			var isVid = /\.(mp4|webm|ogg|mov)(\?|$)/.test(lower);

			var thumb;
			if (isImg) {
				thumb = '<img src="' + leadAutomationEscapeHtml(url) + '" alt="' + leadAutomationEscapeHtml(name) + '" style="width:100%;height:100%;object-fit:cover;border-radius:6px;" />';
			} else if (isVid) {
				thumb = '<div style="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#f1f5f9;border-radius:6px;color:#64748b;"><span style="font-size:28px;">&#127916;</span><span style="font-size:10px;margin-top:3px;">video</span></div>';
			} else {
				thumb = '<div style="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#fef3f2;border-radius:6px;color:#b42318;"><span style="font-size:28px;">&#128196;</span><span style="font-size:10px;margin-top:3px;">pdf</span></div>';
			}

			gridHtml +=
				'<div style="width:110px;flex-shrink:0;cursor:pointer;" onclick="window.open(\'' + leadAutomationEscapeHtml(url) + '\',\'_blank\')" title="' + leadAutomationEscapeHtml(name) + '">' +
					'<div style="width:110px;height:82px;border:1px solid #e4e7ec;border-radius:8px;overflow:hidden;background:#f9fafb;">' + thumb + '</div>' +
					'<div style="margin-top:4px;font-size:11px;color:#344054;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:110px;">' + leadAutomationEscapeHtml(name) + '</div>' +
				'</div>';
		}
		gridHtml += '</div>';
		attachSection.html(gridHtml).show();
	} else {
		attachSection.hide();
	}

	$("#leadAutomationLogDetailModal").addClass("show").attr("aria-hidden", "false");
}

// ─── Followup Send / Action API ─────────────────────────────────────────────

/**
 * Sends a followup process request (preview, send, pause, resume, skip).
 * payload: { leadId, leadNo, dryRun, followupAction, testEmail, templateMode,
 *            selectedTemplateId, customBody, selectedMediaIds }
 */
function leadAutomationSendFollowup(payload, onSuccess, onError) {
	var apiRoot = leadAutomationGetFollowupApiRoot();
	if (!apiRoot) {
		leadAutomationShowMessage("Missing API base URL.", "error");
		if (typeof onError === "function") onError("Missing API base URL.");
		return;
	}
	var requestData = {
		leadId:             payload.leadId || null,
		leadNo:             payload.leadNo || null,
		dryRun:             payload.dryRun === true,
		followupAction:     payload.followupAction || null,
		testEmail:          payload.testEmail || null,
		templateMode:       payload.templateMode || "AI",
		selectedTemplateId: payload.selectedTemplateId || null,
		customBody:         payload.customBody || null,
		selectedMediaIds:   $.isArray(payload.selectedMediaIds) ? payload.selectedMediaIds : [],
	};
	$.ajax({
		type: "POST",
		url: apiRoot + "/process",
		contentType: "application/json; charset=utf-8",
		dataType: "text",
		cache: false,
		data: JSON.stringify(leadAutomationBuildPayloadRequest(requestData)),
	}).done(function (resp) {
		var data = leadAutomationParsePayloadResponse(resp);
		var status = String((data && data.status) || "").toUpperCase();
		if (status === "FAILED" || status === "EXCEPTION" || status === "SESSIONOUT") {
			leadAutomationShowMessage((data && data.message) || "Follow-up failed.", "error");
			if (typeof onError === "function") onError(data);
			return;
		}
		if (typeof onSuccess === "function") onSuccess(data);
	}).fail(function () {
		leadAutomationShowMessage("Unable to process follow-up.", "error");
		if (typeof onError === "function") onError(null);
	});
}

/**
 * Populates LEAD_AUTOMATION_STATE from a processFollowup response.
 */
function leadAutomationApplyFollowupResponse(data) {
	var state = window.LEAD_AUTOMATION_STATE;
	if (!state) return;
	state.followupResponse = data || null;
	state.followupAvailableTemplates = $.isArray(data && data.availableTemplates) ? data.availableTemplates : [];
	state.followupAvailableMedia = $.isArray(data && data.availableMedia) ? data.availableMedia : [];
	// Pre-select media IDs from AI-suggested mediaList
	if ($.isArray(data && data.mediaList)) {
		state.followupSelectedMediaIds = $.map(data.mediaList, function (m) { return m.id; });
	}
	// Set current editor body from response
	state.followupCurrentBody = (data && data.finalMessage) || "";
	// Set selected template
	if (data && data.template && data.template.id) {
		state.followupSelectedTemplateId = data.template.id;
		state.followupTemplateMode = "MANUAL";
	} else {
		state.followupSelectedTemplateId = null;
		state.followupTemplateMode = "AI";
	}
}
