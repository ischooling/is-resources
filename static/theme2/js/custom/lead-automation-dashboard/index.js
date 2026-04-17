function getLeadAutomationContent() {
	try {
		var root = $("#lead-automation-root");
		if (!root.length) {
			root = $('<div id="lead-automation-root"></div>');
			$("body").append(root);
		}
	root.html(leadAutomationBuildPageShell());
	leadAutomationBindEvents();
	var activeTab = window.LEAD_AUTOMATION_STATE.activeTab || window.LEAD_AUTOMATION_CONFIG.defaultTab;
	if (window.LEAD_AUTOMATION_STATE.channelsLoaded && window.LEAD_AUTOMATION_STATE.scheduleLoaded && (activeTab !== "content" || window.LEAD_AUTOMATION_STATE.templatesLoaded)) {
		leadAutomationRenderSection(activeTab);
		return;
	}
	var loads = [leadAutomationLoadChannels(), leadAutomationLoadScheduleTiming(), leadAutomationLoadSettings()];
	if (activeTab === "content") {
		loads.push(leadAutomationLoadTemplates());
	}
	$.when.apply($, loads).always(function () {
		leadAutomationRenderSection(window.LEAD_AUTOMATION_STATE.activeTab || window.LEAD_AUTOMATION_CONFIG.defaultTab);
	});
	} catch (error) {
		if (window.console && console.error) {
			console.error("Lead Automation render failed", error);
		}
		$("#lead-automation-root").html(
			'<div class="lead-automation-loading"><div class="lead-automation-loading__title">Lead Automation could not load</div><div>' +
			leadAutomationEscapeHtml(error && error.message ? error.message : "Unknown runtime error") +
			"</div></div>"
		);
	}
}

$(document).ready(function () {
	getLeadAutomationContent();
});
