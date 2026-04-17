function leadAutomationGetGeneralContent() {
	var settings = window.LEAD_AUTOMATION_STATE.settings || {};
	var html = [];
	html.push('<div class="lead-automation-sectionHeader">');
	html.push('<div class="lead-automation-sectionHeader__title">General settings</div>');
	html.push('<div class="lead-automation-sectionHeader__sub">Control how the automation engine behaves globally</div>');
	html.push('</div>');
	html.push('<div class="lead-automation-cardStack">');
	html.push(
		leadAutomationBuildCard(
			"General settings",
			[
				leadAutomationBuildToggle("automationEnabled", !!settings.automationEnabled, "AI engine"),
			].join(""),
			'<div class="mt-2"><button type="button" class="lead-automation-btn" data-lead-automation-action="settings-save">Save changes</button></div>'
		)
	);
	html.push('</div>');
	return html.join("");
}
