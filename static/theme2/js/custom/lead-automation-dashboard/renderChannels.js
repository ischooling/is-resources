function leadAutomationGetChannelDefault(field, fallback) {
	var channels = window.LEAD_AUTOMATION_STATE.channels || [];
	for (var i = 0; i < channels.length; i++) {
		var value = channels[i] && channels[i][field];
		if (value !== undefined && value !== null && String(value).trim() !== "") {
			return value;
		}
	}
	return fallback;
}

function leadAutomationBuildPriorityOptions(total, selected) {
	var html = "";
	for (var i = 1; i <= total; i++) {
		var isSelected = Number(selected) === i ? " selected" : "";
		var label = i + (i === 1 ? "st (primary)" : i === 2 ? "nd" : i === 3 ? "rd" : "th");
		html += "<option" + isSelected + ">" + label + "</option>";
	}
	return html;
}

function leadAutomationBuildGapOptions(selectedValue) {
	var options = ["12 hours", "24 hours", "48 hours"];
	var selected = String(selectedValue || "").trim();
	if (selected && $.inArray(selected, options) === -1) {
		options.unshift(selected);
	}
	return $.map(options, function (item) {
		var isSelected = String(item) === selected ? " selected" : "";
		return "<option" + isSelected + ">" + leadAutomationEscapeHtml(item) + "</option>";
	}).join("");
}

function leadAutomationBuildChannelToggle(channelId, isOn) {
	return (
		'<button type="button" class="lead-automation-toggle ' +
		(isOn ? "is-on" : "is-off") +
		'" data-lead-automation-channel-toggle="true" data-channel-id="' +
		leadAutomationEscapeHtml(channelId) +
		'" aria-pressed="' +
		(isOn ? "true" : "false") +
		'">' +
		'<span class="lead-automation-toggle__dot"></span>' +
		'<span class="lead-automation-toggle__label"></span>' +
		"</button>"
	);
}

function leadAutomationGetChannelsContent() {
	var settings = window.LEAD_AUTOMATION_STATE.settings || {};
	var channels = (window.LEAD_AUTOMATION_STATE.channels || []).slice();
	channels.sort(function (a, b) {
		var aName = String(a.channelName || "").toLowerCase();
		var bName = String(b.channelName || "").toLowerCase();
		// Email always first in display and priority assignment
		if (aName === "email" && bName !== "email") return -1;
		if (bName === "email" && aName !== "email") return 1;
		return (Number(a.priority) || 999) - (Number(b.priority) || 999);
	});

	var maxLimit = leadAutomationGetChannelDefault("maxLimitPerLead", settings.maxMessages || 5);
	var minGap = leadAutomationGetChannelDefault("minGapToSendMsg", settings.minGap || "24 hours");

	var html = [];
	html.push('<div class="lead-automation-sectionHeader">');
	html.push('<div class="lead-automation-sectionHeader__title">Channels</div>');
	html.push('<div class="lead-automation-sectionHeader__sub">Configure WhatsApp, Email and SMS delivery</div>');
	html.push("</div>");

	var channelGrid = [];
	if (!channels.length) {
		channelGrid.push('<div class="lead-automation-copy">No channels configured yet.</div>');
	} else {
		channelGrid.push('<div class="lead-automation-channelGrid">');
		$.each(channels, function (index, channel) {
			var isActive = String(channel.active || "Y").toUpperCase() === "Y";
			var channelId = String(channel.id || "");
			var priority = channel.priority || (index + 1);
			var statusClass = isActive ? "lead-automation-status--success" : "lead-automation-status--danger";
			var statusText = isActive ? "Connected" : "Not connected";
			channelGrid.push('<div class="lead-automation-channelCard" data-lead-automation-channel-card="' + leadAutomationEscapeHtml(channelId) + '">');
			channelGrid.push('<div class="lead-automation-channelCard__head"><div>' + leadAutomationEscapeHtml(channel.channelName || "") + "</div>" + leadAutomationBuildChannelToggle(channelId, isActive) + "</div>");
			channelGrid.push('<div class="lead-automation-copy">' + leadAutomationEscapeHtml(channel.description || "") + "</div>");
			channelGrid.push('<div class="lead-automation-status ' + statusClass + '" data-lead-automation-channel-status="' + leadAutomationEscapeHtml(channelId) + '">' + leadAutomationEscapeHtml(statusText) + "</div>");
			channelGrid.push(
				'<div data-lead-automation-channel-priority-wrap="' +
					leadAutomationEscapeHtml(channelId) +
					'" style="display:' +
					(isActive ? "block" : "none") +
					'">' +
					'<label class="lead-automation-field"><span>Send priority</span><select class="lead-automation-input" data-lead-automation-channel-priority="' +
					leadAutomationEscapeHtml(channelId) +
					'">' +
					leadAutomationBuildPriorityOptions(channels.length, priority) +
					"</select></label>" +
					"</div>"
			);
			channelGrid.push("</div>");
		});
		channelGrid.push("</div>");
	}

	html.push(
		leadAutomationBuildCard(
			"Channel settings",
			[
				channelGrid.join(""),
				'<div class="lead-automation-formGrid" style="margin-top:16px">' +
					'<label class="lead-automation-field"><span>Max messages per lead</span><input type="number" class="lead-automation-input" id="leadAutomationChannelMaxLimit" value="' +
					leadAutomationEscapeHtml(maxLimit) +
					'"></label>' +
					'<label class="lead-automation-field"><span>Minimum gap</span><select class="lead-automation-input" id="leadAutomationChannelMinGap">' +
					leadAutomationBuildGapOptions(minGap) +
					"</select></label>" +
					"</div>",
			].join(""),
			'<div class="mt-2"><button type="button" class="lead-automation-btn" data-lead-automation-action="settings-save">Save changes</button></div>'
		)
	);
	return html.join("");
}
