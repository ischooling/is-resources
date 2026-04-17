function leadAutomationRenderSection(section) {
	var target = $("#leadAutomationSection");
	var activeTab = section || window.LEAD_AUTOMATION_CONFIG.defaultTab;
	var html = "";

	window.LEAD_AUTOMATION_STATE.activeTab = activeTab;
	leadAutomationDestroyEditorInstance("templateBodyEditor");

	// Followup preview tab — has its own Jodit init after DOM insertion
	if (activeTab === "followup") {
		var state = window.LEAD_AUTOMATION_STATE || {};
		var editorKey = state.followupEditorKey || "followupBodyEditor";
		leadAutomationDestroyEditorInstance(editorKey);
		target.html(leadAutomationGetFollowupContent());
		leadAutomationInitTagSelects(target);
		$("[data-lead-automation-tab]").removeClass("active");
		$('[data-lead-automation-tab="followup"]').addClass("active");
		leadAutomationInitRichTextEditor(
			editorKey,
			"#leadAutomationFollowupBodyEditor",
			state.followupCurrentBody || "",
			false
		);
		return;
	}

	if (activeTab === "content") {
		html = leadAutomationGetContentLibrary();
	} else if (activeTab === "media") {
		html = leadAutomationGetMediaContent();
	} else if (activeTab === "general") {
		html = leadAutomationGetGeneralContent();
	} else if (activeTab === "channels") {
		html = leadAutomationGetChannelsContent();
	} else if (activeTab === "schedule") {
		html = leadAutomationGetScheduleContent();
	} else if (activeTab === "followup-logs") {
		html = leadAutomationGetFollowupLogsContent();
	}

	target.html(html);
	leadAutomationInitTagSelects(target);
	$("[data-lead-automation-tab]").removeClass("active");
	$('[data-lead-automation-tab="' + activeTab + '"]').addClass("active");
	if ((activeTab === "content" || activeTab === "media") && typeof leadAutomationRenderMediaPreviews === "function") {
		leadAutomationRenderMediaPreviews();
	}
	if (activeTab === "content") {
		leadAutomationInitRichTextEditor(
			"templateBodyEditor",
			"#leadAutomationTemplateBody",
			"",
			false
		);
	}
	if (activeTab === "schedule" && typeof leadAutomationPopulateScheduleTimezones === "function") {
		leadAutomationPopulateScheduleTimezones();
	}
	if (activeTab === "followup-logs") {
		leadAutomationLoadFollowupLogs(0);
	}
}
