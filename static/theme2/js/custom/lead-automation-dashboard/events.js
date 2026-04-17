function leadAutomationBindEvents() {
	$(document)
		.off("click.leadAutomationTabs")
		.on("click.leadAutomationTabs", "[data-lead-automation-tab]", function () {
			var tab = $(this).data("lead-automation-tab");
			leadAutomationRenderSection(tab);
		});

	$(document)
		.off("click.leadAutomationToggle")
		.on("click.leadAutomationToggle", "[data-lead-automation-toggle]", function () {
			var key = String($(this).data("lead-automation-toggle") || "");
			var isOn = $(this).hasClass("is-on");
			$(this).toggleClass("is-on", !isOn).toggleClass("is-off", isOn).attr("aria-pressed", String(!isOn));
			if (window.LEAD_AUTOMATION_STATE.settings.hasOwnProperty(key)) {
				window.LEAD_AUTOMATION_STATE.settings[key] = !isOn;
			}
		});

	$(document)
		.off("click.leadAutomationChannelToggle")
		.on("click.leadAutomationChannelToggle", "[data-lead-automation-channel-toggle]", function () {
			var button = $(this);
			var card = button.closest("[data-lead-automation-channel-card]");
			var priorityVal = parseInt(card.find("[data-lead-automation-channel-priority]").val(), 10);
			var isOn = button.hasClass("is-on");

			if (isOn && priorityVal === 1) {
				leadAutomationShowMessage("Primary channel cannot be disabled. Change priority first.", "error");
				return;
			}

			var nextOn = !isOn;
			button.toggleClass("is-on", nextOn).toggleClass("is-off", !nextOn).attr("aria-pressed", String(nextOn));
			card.find("[data-lead-automation-channel-priority-wrap]").toggle(nextOn);
			var status = card.find("[data-lead-automation-channel-status]");
			status
				.toggleClass("lead-automation-status--success", nextOn)
				.toggleClass("lead-automation-status--danger", !nextOn)
				.text(nextOn ? "Connected" : "Not connected");
		});


	$(document)
		.off("click.leadAutomationDay")
		.on("click.leadAutomationDay", "[data-lead-automation-day]", function () {
			var day = String($(this).data("lead-automation-day") || "");
			var rowId = String($(this).data("schedule-row-id") || "");
			var settings = window.LEAD_AUTOMATION_STATE.settings || {};
			var schedules = settings.schedules || [];
			var row = schedules.filter(function (item) {
				return String(item.id) === rowId;
			})[0];
			if (!row) return;
			var activeDays = row.activeDays || [];
			var index = $.inArray(day, activeDays);
			if (index === -1) {
				activeDays.push(day);
			} else {
				activeDays.splice(index, 1);
			}
			row.activeDays = activeDays;
			leadAutomationRenderSection("schedule");
		});

	$(document)
		.off("change.leadAutomationTimezone")
		.on("change.leadAutomationTimezone", ".lead-automation-timezone-select", function () {
			var timezone = String($(this).val() || "");
			var timezoneId = $(this).find("option:selected").attr("custom_timezone_id") || "";
			var rowId = String($(this).data("schedule-row-id") || "");
			if (!timezone || !rowId) {
				return;
			}
			var settings = window.LEAD_AUTOMATION_STATE.settings || {};
			var schedules = settings.schedules || [];
			var row = schedules.filter(function (item) {
				return String(item.id) === rowId;
			})[0];
			if (!row) return;
			row.timezone = timezone;
			row.timezoneId = timezoneId;
			if (!row.activeDays || !row.activeDays.length) {
				row.activeDays = (settings.activeDays || ["Mon", "Tue", "Wed", "Thu", "Fri"]).slice();
			}
			leadAutomationRenderSection("schedule");
		});

	$(document)
		.off("click.leadAutomationScheduleAdd")
		.on("click.leadAutomationScheduleAdd", "[data-lead-automation-schedule-add]", function () {
			var settings = window.LEAD_AUTOMATION_STATE.settings || {};
			settings.schedules = settings.schedules || [];
			settings.schedules.push({
				id: "tz-" + Date.now(),
				timezone: "",
				timezoneId: "",
				windowStart: "10:00",
				windowEnd: "17:00",
				activeDays: (settings.activeDays || ["Mon", "Tue", "Wed", "Thu", "Fri"]).slice(),
				isDefault: false,
			});
			leadAutomationRenderSection("schedule");
		});

	$(document)
		.off("click.leadAutomationScheduleRemove")
		.on("click.leadAutomationScheduleRemove", "[data-lead-automation-schedule-remove]", function () {
			var rowId = String($(this).data("lead-automation-schedule-remove") || "");
			if (!rowId) return;
			var settings = window.LEAD_AUTOMATION_STATE.settings || {};
			settings.schedules = $.grep(settings.schedules || [], function (item) {
				return String(item.id) !== rowId || item.isDefault;
			});
			leadAutomationRenderSection("schedule");
		});

	$(document)
		.off("click.leadAutomationSave")
		.on("click.leadAutomationSave", '[data-lead-automation-action="settings-save"]', function () {
			leadAutomationSaveSettings();
		});

	$(document)
		.off("click.leadAutomationBlackoutToggle")
		.on("click.leadAutomationBlackoutToggle", "[data-lead-automation-blackout-toggle]", function () {
			$("#leadAutomationBlackoutForm").toggle();
		});

	$(document)
		.off("click.leadAutomationBlackoutCancel")
		.on("click.leadAutomationBlackoutCancel", "[data-lead-automation-blackout-cancel]", function () {
			$("#leadAutomationBlackoutReason").val("");
			$("#leadAutomationBlackoutStart").val("");
			$("#leadAutomationBlackoutEnd").val("");
			$("#leadAutomationBlackoutForm").hide();
		});

	$(document)
		.off("click.leadAutomationBlackoutAdd")
		.on("click.leadAutomationBlackoutAdd", "[data-lead-automation-blackout-add]", function () {
			var reason = String($("#leadAutomationBlackoutReason").val() || "").trim();
			var startDate = String($("#leadAutomationBlackoutStart").val() || "").trim();
			var endDate = String($("#leadAutomationBlackoutEnd").val() || "").trim();
			if (!reason || !startDate) {
				leadAutomationShowMessage("Please add reason and start date.", "error");
				return;
			}
			if (!endDate) {
				endDate = startDate;
			}
			var blackouts = window.LEAD_AUTOMATION_STATE.settings.blackouts || [];
			blackouts.push({
				id: "b" + Date.now(),
				reason: reason,
				startDate: startDate,
				endDate: endDate,
			});
			window.LEAD_AUTOMATION_STATE.settings.blackouts = blackouts;
			leadAutomationSaveScheduleTiming();
		});

	$(document)
		.off("click.leadAutomationBlackoutRemove")
		.on("click.leadAutomationBlackoutRemove", "[data-lead-automation-blackout-remove]", function () {
			var id = String($(this).data("lead-automation-blackout-remove") || "");
			var blackouts = window.LEAD_AUTOMATION_STATE.settings.blackouts || [];
			window.LEAD_AUTOMATION_STATE.settings.blackouts = $.grep(blackouts, function (item) {
				return String(item.id || "") !== id;
			});
			leadAutomationSaveScheduleTiming();
		});

	$(document)
		.off("click.leadAutomationTemplateSave")
		.on("click.leadAutomationTemplateSave", '[data-lead-automation-action="template-save"]', function () {
			leadAutomationSaveTemplate();
		});

	$(document)
		.off("click.leadAutomationTemplateAdd")
		.on("click.leadAutomationTemplateAdd", '[data-lead-automation-action="template-add"]', function () {
			leadAutomationShowMessage("Fill template name, channel and message body, then save.", "info");
		});

	$(document)
		.off("click.leadAutomationTemplateRowActions")
		.on("click.leadAutomationTemplateRowActions", '[data-lead-automation-action="template-view"], [data-lead-automation-action="template-edit"], [data-lead-automation-action="template-delete"]', function () {
			var action = String($(this).data("lead-automation-action") || "");
			var templateId = String($(this).data("template-id") || "");
			if (action === "template-view") {
				leadAutomationOpenTemplateModal(templateId, "view");
			} else if (action === "template-edit") {
				leadAutomationOpenTemplateModal(templateId, "edit");
			} else if (action === "template-delete") {
				leadAutomationDeleteTemplate(templateId);
			}
		});

	$(document)
		.off("click.leadAutomationMediaRowActions")
		.on("click.leadAutomationMediaRowActions", '[data-lead-automation-action="media-edit"][data-all-media-id]', function () {
			var mediaId = String($(this).data("all-media-id") || "");
			leadAutomationOpenMediaEditModal("", mediaId, "edit");
		});

	$(document)
		.off("click.leadAutomationMediaView")
		.on("click.leadAutomationMediaView", '[data-lead-automation-action="media-view"][data-all-media-id]', function () {
			leadAutomationShowMediaViewModal(String($(this).data("all-media-id") || ""));
		});

	$(document)
		.off("click.leadAutomationMediaViewClose")
		.on("click.leadAutomationMediaViewClose", '[data-lead-automation-action="media-view-close"]', function () {
			$("#leadAutomationMediaViewModal").css("display", "none");
		});

	$(document)
		.off("click.leadAutomationMediaViewBackdrop")
		.on("click.leadAutomationMediaViewBackdrop", "#leadAutomationMediaViewModal", function (e) {
			if (e.target === this) {
				$(this).css("display", "none");
			}
		});

	$(document)
		.off("click.leadAutomationMediaModalSave")
		.on("click.leadAutomationMediaModalSave", '[data-lead-automation-action="media-modal-save"]', function () {
			leadAutomationSaveMediaFromModal();
		});

	$(document)
		.off("click.leadAutomationMediaModalEdit")
		.on("click.leadAutomationMediaModalEdit", '[data-lead-automation-action="media-modal-edit"]', function () {
			leadAutomationEnterMediaEditMode();
		});

	$(document)
		.off("click.leadAutomationMediaModalClose")
		.on("click.leadAutomationMediaModalClose", '[data-lead-automation-action="media-modal-close"]', function () {
			leadAutomationCloseMediaEditModal();
		});

	$(document)
		.off("click.leadAutomationEditFileRemove")
		.on("click.leadAutomationEditFileRemove", "[data-edit-file-remove]", function () {
			var idx = Number($(this).data("edit-file-remove"));
			leadAutomationRemoveEditFile(idx);
		});

	$(document)
		.off("change.leadAutomationMediaEditAddFiles")
		.on("change.leadAutomationMediaEditAddFiles", "#leadAutomationMediaEditAddFiles", function () {
			var newFiles = this.files ? Array.prototype.slice.call(this.files) : [];
			var state = window.LEAD_AUTOMATION_STATE = window.LEAD_AUTOMATION_STATE || {};
			var tabId = (state.editMediaItem && state.editMediaItem.mediaType) ? state.editMediaItem.mediaType : "pdfs";
			var limitInfo = leadAutomationGetMediaLimitInfo(tabId);
			var oversizeFiles = [];
			var validFiles = [];
			$.each(newFiles, function (_, file) {
				if (!file) return;
				if (limitInfo.maxBytes && Number(file.size || 0) > limitInfo.maxBytes) {
					oversizeFiles.push((file.name || "file") + " (" + leadAutomationFormatFileSize(file.size || 0) + ")");
				} else {
					validFiles.push(file);
				}
			});
			if (oversizeFiles.length) {
				leadAutomationShowMessage("File too large. " + limitInfo.label + ". Skipped: " + oversizeFiles.join(", "), "error");
			}
			state.editNewFiles = (state.editNewFiles || []).concat(validFiles);
			if (validFiles.length && typeof leadAutomationClearModalError === "function") {
				leadAutomationClearModalError();
			}
			// Reset input so same file can be re-added if needed
			this.value = "";
			leadAutomationRenderEditNewFilePreviews();
		});

	$(document)
		.off("click.leadAutomationEditNewFileRemove")
		.on("click.leadAutomationEditNewFileRemove", "[data-edit-new-file-remove]", function () {
			var idx = Number($(this).data("edit-new-file-remove"));
			var state = window.LEAD_AUTOMATION_STATE = window.LEAD_AUTOMATION_STATE || {};
			if (state.editNewFiles && idx >= 0 && idx < state.editNewFiles.length) {
				state.editNewFiles.splice(idx, 1);
			}
			leadAutomationRenderEditNewFilePreviews();
		});

	$(document)
		.off("click.leadAutomationMediaBackdrop")
		.on("click.leadAutomationMediaBackdrop", "#leadAutomationMediaEditModal", function (event) {
			if (event.target === this) {
				leadAutomationCloseMediaEditModal();
			}
		});

	$(document)
		.off("click.leadAutomationMediaEditThumb")
		.on("click.leadAutomationMediaEditThumb", "[data-media-edit-index]", function (event) {
			event.preventDefault();
			event.stopPropagation();
			leadAutomationSetMediaEditSelectedIndex(Number($(this).data("media-edit-index") || 0));
		});

	$(document)
		.off("click.leadAutomationMediaEditRemove")
		.on("click.leadAutomationMediaEditRemove", "[data-media-remove-index]", function (event) {
			event.preventDefault();
			event.stopPropagation();
			leadAutomationRemoveMediaEditItem(Number($(this).data("media-remove-index") || 0));
		});

	$(document)
		.off("click.leadAutomationMediaEditOpen")
		.on("click.leadAutomationMediaEditOpen", "[data-media-open-url]", function (event) {
			var url = String($(this).data("media-open-url") || "");
			if (!url) {
				return;
			}
			window.open(url, "_blank", "noopener,noreferrer");
		});

	$(document)
		.off("click.leadAutomationTemplateModalSave")
		.on("click.leadAutomationTemplateModalSave", '[data-lead-automation-action="template-modal-save"]', function () {
			leadAutomationSaveTemplateFromModal();
		});

	$(document)
		.off("click.leadAutomationTemplateModalClose")
		.on("click.leadAutomationTemplateModalClose", '[data-lead-automation-action="template-modal-close"]', function () {
			leadAutomationCloseTemplateModal();
		});

	$(document)
		.off("click.leadAutomationTemplateBackdrop")
		.on("click.leadAutomationTemplateBackdrop", "#leadAutomationTemplateModal", function (event) {
			if (event.target === this) {
				leadAutomationCloseTemplateModal();
			}
		});

	$(document)
		.off("click.leadAutomationConfirmYes")
		.on("click.leadAutomationConfirmYes", '[data-lead-automation-action="confirm-modal-yes"]', function () {
			var callback = window.LEAD_AUTOMATION_STATE.confirmCallback;
			leadAutomationCloseConfirmDialog();
			if (typeof callback === "function") {
				callback();
			}
		});

	$(document)
		.off("click.leadAutomationConfirmCancel")
		.on("click.leadAutomationConfirmCancel", '[data-lead-automation-action="confirm-modal-cancel"], [data-lead-automation-action="confirm-modal-close"]', function () {
			leadAutomationCloseConfirmDialog();
		});

	$(document)
		.off("click.leadAutomationConfirmBackdrop")
		.on("click.leadAutomationConfirmBackdrop", "#leadAutomationConfirmModal", function (event) {
			if (event.target === this) {
				leadAutomationCloseConfirmDialog();
			}
		});

	$(document)
		.off("change.leadAutomationMediaFilterType")
		.on("change.leadAutomationMediaFilterType", "#leadAutomationMediaFilterType", function () {
			leadAutomationRenderAllMediaTable(0);
		});

	$(document)
		.off("click.leadAutomationMediaPage")
		.on("click.leadAutomationMediaPage", "[data-media-page]", function () {
			leadAutomationRenderAllMediaTable(Number($(this).data("media-page") || 0));
		});

	$(document)
		.off("click.leadAutomationMediaUploadBtn")
		.on("click.leadAutomationMediaUploadBtn", "#leadAutomationMediaUploadBtn", function () {
			leadAutomationMediaSave();
		});

	$(document)
		.off("change.leadAutomationMediaFilesChange")
		.on("change.leadAutomationMediaFilesChange", "#leadAutomationMediaFiles", function () {
			leadAutomationRenderFilePreview();
		});

	$(document)
		.off("click.leadAutomationFilePreviewRemove")
		.on("click.leadAutomationFilePreviewRemove", "[data-file-preview-remove]", function () {
			var idx = Number($(this).data("file-preview-remove"));
			leadAutomationRemoveFileFromInput(idx);
		});

	$(document)
		.off("click.leadAutomationMediaDbDelete")
		.on("click.leadAutomationMediaDbDelete", "[data-lead-automation-media-db-delete]", function () {
			var itemId = String($(this).data("lead-automation-media-db-delete") || "");
			if (!itemId) return;
			leadAutomationShowConfirmDialog(
				"Delete this saved media item?",
				function () {
					leadAutomationDeleteSavedMediaById(itemId);
				},
				"Delete media"
			);
		});

	$(document)
		.off("click.leadAutomationLogsSearch")
		.on("click.leadAutomationLogsSearch", '[data-lead-automation-action="logs-search"]', function () {
			window.LEAD_AUTOMATION_STATE.followupLogsFilterLeadId = String($("#leadAutomationLogsFilterLeadId").val() || "").trim();
			window.LEAD_AUTOMATION_STATE.followupLogsPage = 0;
			leadAutomationLoadFollowupLogs(0);
		});

	$(document)
		.off("click.leadAutomationLogsClear")
		.on("click.leadAutomationLogsClear", '[data-lead-automation-action="logs-clear"]', function () {
			$("#leadAutomationLogsFilterLeadId").val("");
			window.LEAD_AUTOMATION_STATE.followupLogsFilterLeadId = "";
			window.LEAD_AUTOMATION_STATE.followupLogsPage = 0;
			leadAutomationLoadFollowupLogs(0);
		});

	$(document)
		.off("click.leadAutomationLogsPage")
		.on("click.leadAutomationLogsPage", "[data-logs-page]", function () {
			var pageNum = Number($(this).data("logs-page") || 0);
			leadAutomationLoadFollowupLogs(pageNum);
		});

	$(document)
		.off("click.leadAutomationLogsViewDetail")
		.on("click.leadAutomationLogsViewDetail", '[data-lead-automation-action="logs-view-detail"]', function () {
			leadAutomationShowFollowupLogDetail(String($(this).data("log-id") || ""));
		});

	$(document)
		.off("click.leadAutomationLogDetailClose")
		.on("click.leadAutomationLogDetailClose", '[data-lead-automation-action="log-detail-close"]', function () {
			$("#leadAutomationLogDetailModal").removeClass("show").attr("aria-hidden", "true");
		});

	// ─── Attachment Preview (click "N files" badge in logs table) ──────────────
	$(document)
		.off("click.leadAutomationLogsPreviewAttachments")
		.on("click.leadAutomationLogsPreviewAttachments", '[data-lead-automation-action="logs-preview-attachments"]', function () {
			var fileUrlsStr = String($(this).data("file-urls") || "");
			var titlesStr   = String($(this).data("titles")    || "");
			if (typeof leadAutomationShowAttachmentPreviewModal === "function") {
				leadAutomationShowAttachmentPreviewModal(fileUrlsStr, titlesStr);
			}
		});

	$(document)
		.off("click.leadAutomationLogDetailBackdrop")
		.on("click.leadAutomationLogDetailBackdrop", "#leadAutomationLogDetailModal", function (event) {
			if (event.target === this) {
				$("#leadAutomationLogDetailModal").removeClass("show").attr("aria-hidden", "true");
			}
		});

	// ─── Followup Preview Events ─────────────────────────────────────────────

	// 1. Template selector change
	$(document)
		.off("change.leadAutomationFollowupTemplate")
		.on("change.leadAutomationFollowupTemplate", "#leadAutomationFollowupTemplateSelect", function () {
			var val = $(this).val();
			var mode = $(this).find("option:selected").data("mode");
			window.LEAD_AUTOMATION_STATE.followupSelectedTemplateId = val ? Number(val) : null;
			window.LEAD_AUTOMATION_STATE.followupTemplateMode = (mode === "MANUAL") ? "MANUAL" : "AI";
		});

	// 2. Send now
	$(document)
		.off("click.leadAutomationSendFollowup")
		.on("click.leadAutomationSendFollowup", '[data-lead-automation-action="send-followup"]', function () {
			var state = window.LEAD_AUTOMATION_STATE || {};
			var leadId = Number($(this).data("lead-id") || 0) || state.followupLeadId;
			var body = leadAutomationGetEditorValue(state.followupEditorKey || "followupBodyEditor", "#leadAutomationFollowupBodyEditor");
			leadAutomationShowConfirmDialog("Send this follow-up message now?", function () {
				leadAutomationSendFollowup({
					leadId: leadId,
					dryRun: false,
					followupAction: "SEND_NOW",
					templateMode: state.followupTemplateMode || "AI",
					selectedTemplateId: state.followupSelectedTemplateId,
					customBody: body || null,
					selectedMediaIds: state.followupSelectedMediaIds || [],
				}, function (data) {
					leadAutomationApplyFollowupResponse(data);
					leadAutomationShowMessage(data.message || "Follow-up sent.", "success");
					leadAutomationRenderFollowupSection();
				});
			}, "Send follow-up");
		});

	// 3. Pause
	$(document)
		.off("click.leadAutomationPauseFollowup")
		.on("click.leadAutomationPauseFollowup", '[data-lead-automation-action="pause-followup"]', function () {
			var state = window.LEAD_AUTOMATION_STATE || {};
			var leadId = Number($(this).data("lead-id") || 0) || state.followupLeadId;
			leadAutomationSendFollowup({
				leadId: leadId,
				dryRun: true,
				followupAction: "PAUSE",
			}, function (data) {
				leadAutomationApplyFollowupResponse(data);
				leadAutomationShowMessage("Follow-up paused.", "success");
				leadAutomationRenderFollowupSection();
			});
		});

	// 4. Resume
	$(document)
		.off("click.leadAutomationResumeFollowup")
		.on("click.leadAutomationResumeFollowup", '[data-lead-automation-action="resume-followup"]', function () {
			var state = window.LEAD_AUTOMATION_STATE || {};
			var leadId = Number($(this).data("lead-id") || 0) || state.followupLeadId;
			leadAutomationSendFollowup({
				leadId: leadId,
				dryRun: true,
				followupAction: "RESUME",
			}, function (data) {
				leadAutomationApplyFollowupResponse(data);
				leadAutomationShowMessage("Follow-up resumed.", "success");
				leadAutomationRenderFollowupSection();
			});
		});

	// 5. Remove attachment
	$(document)
		.off("click.leadAutomationRemoveAttachment")
		.on("click.leadAutomationRemoveAttachment", '[data-lead-automation-action="remove-attachment"]', function () {
			var state = window.LEAD_AUTOMATION_STATE || {};
			var mediaId = Number($(this).data("media-id") || 0);
			var ids = state.followupSelectedMediaIds || [];
			state.followupSelectedMediaIds = $.grep(ids, function (id) { return id !== mediaId; });
			// Snapshot editor content before re-render
			var body = leadAutomationGetEditorValue(state.followupEditorKey || "followupBodyEditor", "#leadAutomationFollowupBodyEditor");
			if (body !== null && body !== undefined) state.followupCurrentBody = body;
			leadAutomationRenderFollowupSection();
		});

	// 6. Open media picker
	$(document)
		.off("click.leadAutomationAddAttachment")
		.on("click.leadAutomationAddAttachment", '[data-lead-automation-action="add-attachment"]', function () {
			leadAutomationRenderMediaPickerList();
			$("#leadAutomationMediaPickerModal").css("display", "flex");
		});

	// 7. Confirm media picker selection
	$(document)
		.off("click.leadAutomationConfirmMediaPicker")
		.on("click.leadAutomationConfirmMediaPicker", '[data-lead-automation-action="confirm-media-picker"]', function () {
			var state = window.LEAD_AUTOMATION_STATE || {};
			var checked = $("#leadAutomationMediaPickerList input[type='checkbox']:checked");
			var existing = $.isArray(state.followupSelectedMediaIds) ? state.followupSelectedMediaIds.slice() : [];
			checked.each(function () {
				var id = Number($(this).val() || 0);
				if (id && $.inArray(id, existing) === -1) {
					existing.push(id);
				}
			});
			state.followupSelectedMediaIds = existing;
			$("#leadAutomationMediaPickerModal").css("display", "none");
			var body = leadAutomationGetEditorValue(state.followupEditorKey || "followupBodyEditor", "#leadAutomationFollowupBodyEditor");
			if (body !== null && body !== undefined) state.followupCurrentBody = body;
			leadAutomationRenderFollowupSection();
		});

	// 8. Close media picker
	$(document)
		.off("click.leadAutomationCloseMediaPicker")
		.on("click.leadAutomationCloseMediaPicker", '[data-lead-automation-action="close-media-picker"]', function () {
			$("#leadAutomationMediaPickerModal").css("display", "none");
		});

	// 9. Preview message in log detail modal
	$(document)
		.off("click.leadAutomationPreviewFollowup")
		.on("click.leadAutomationPreviewFollowup", '[data-lead-automation-action="preview-followup"]', function () {
			var state = window.LEAD_AUTOMATION_STATE || {};
			var body = leadAutomationGetEditorValue(state.followupEditorKey || "followupBodyEditor", "#leadAutomationFollowupBodyEditor");
			$("#leadAutomationLogDetailModalTitle").text("Follow-up Preview");
			$("#leadAutomationLogDetailRecipient").html(
				'<strong>Channel:</strong> ' + leadAutomationEscapeHtml((state.followupResponse && state.followupResponse.channel) || "EMAIL")
			);
			$("#leadAutomationLogDetailBody").html(body || "<em class='text-muted'>No content</em>");
			$("#leadAutomationLogDetailModal").addClass("show").attr("aria-hidden", "false");
		});
}
