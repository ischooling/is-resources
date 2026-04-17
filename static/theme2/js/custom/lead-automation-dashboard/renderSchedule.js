function leadAutomationEnsureScheduleRows(settings) {
	if (!settings.schedules || !settings.schedules.length) {
		var defaultDays = (settings.activeDays && settings.activeDays.length ? settings.activeDays : ["Mon", "Tue", "Wed", "Thu", "Fri"]).slice();
		var rows = [
			{
				id: "default",
				timezone: "ALL",
				timezoneId: 0,
				windowStart: "10:00",
				windowEnd: "17:00",
				activeDays: defaultDays,
				isDefault: true,
			},
		];
		if (settings.timezone && settings.timezone !== "ALL") {
			var tzDays = defaultDays;
			if (settings.activeDaysByTimezone && settings.activeDaysByTimezone[settings.timezone]) {
				tzDays = settings.activeDaysByTimezone[settings.timezone];
			}
			rows.push({
				id: "tz-" + Date.now(),
				timezone: settings.timezone,
				timezoneId: settings.timezoneId || "",
				windowStart: settings.windowStart || "10:00",
				windowEnd: settings.windowEnd || "17:00",
				activeDays: tzDays.slice(),
				isDefault: false,
			});
		}
		settings.schedules = rows;
	}
	// Ensure an "ALL" row exists and is always first
	var allIndex = -1;
	for (var i = 0; i < settings.schedules.length; i++) {
		var s = settings.schedules[i];
		if (s && (s.timezone === "ALL" || String(s.timezoneId) === "0")) {
			allIndex = i;
			break;
		}
	}
	if (allIndex === -1) {
		var fallbackDays = (settings.activeDays && settings.activeDays.length ? settings.activeDays : ["Mon", "Tue", "Wed", "Thu", "Fri"]).slice();
		settings.schedules.unshift({
			id: "default",
			timezone: "ALL",
			timezoneId: 0,
			windowStart: "10:00",
			windowEnd: "17:00",
			activeDays: fallbackDays,
			isDefault: true,
		});
	} else if (allIndex !== 0) {
		var allRow = settings.schedules.splice(allIndex, 1)[0];
		allRow.isDefault = true;
		settings.schedules.unshift(allRow);
	} else {
		settings.schedules[0].isDefault = true;
	}
	return settings.schedules;
}

function leadAutomationFormatDateLong(dateStr) {
	if (!dateStr) return "";
	var parts = String(dateStr).split("-");
	if (parts.length !== 3) return dateStr;
	var year = parts[0];
	var month = parseInt(parts[1], 10);
	var day = parseInt(parts[2], 10);
	if (isNaN(month) || isNaN(day)) return dateStr;
	var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	var monthLabel = months[month - 1] || "";
	var dayLabel = String(day).padStart(2, "0");
	return monthLabel + " " + dayLabel + ", " + year;
}

function leadAutomationTime24To12(val) {
	// "20:00:00" or "20:00" -> "08:00 PM" (no seconds for display)
	if (!val) return "12:00 AM";
	var parts = String(val).trim().split(":");
	var h = parseInt(parts[0], 10);
	if (isNaN(h)) return val;
	var m = parts[1] || "00";
	var period = h >= 12 ? "PM" : "AM";
	if (h === 0) h = 12;
	else if (h > 12) h -= 12;
	return (h < 10 ? "0" + h : h) + ":" + m + " " + period;
}

function leadAutomationTime12To24(val) {
	// "08:00 PM" or "08:00:00 PM" -> "20:00:00" (always seconds for DB)
	if (!val) return "00:00:00";
	var match = String(val).trim().match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM|am|pm)$/);
	if (!match) {
		var s = String(val).trim();
		// Already 24-hour? Ensure seconds are present
		if (/^\d{1,2}:\d{2}$/.test(s)) return s + ":00";
		return s;
	}
	var h = parseInt(match[1], 10);
	var m = match[2];
	var sec = match[3] || "00";
	var period = match[4].toUpperCase();
	if (period === "PM" && h !== 12) h += 12;
	if (period === "AM" && h === 12) h = 0;
	return (h < 10 ? "0" + h : h) + ":" + m + ":" + sec;
}

function leadAutomationInitTimepickers() {
	if (typeof $.fn.timepicker !== "function") return;
	var tpCounter = 0;
	$("#leadAutomationScheduleForm .lead-automation-timepicker").each(function () {
		var $input = $(this);
		if ($input.data("timepicker")) return;
		// Ensure every picker input has an id (timepicker plugin uses it for popover element id)
		if (!this.id) {
			this.id = "leadAutomationTp-" + Date.now() + "-" + (tpCounter++);
		}
		// Convert stored 24-hour value to 12-hour display format (no seconds)
		var val = String($input.val() || "").trim();
		if (val && !/\s*(AM|PM|am|pm)$/.test(val)) {
			$input.val(leadAutomationTime24To12(val));
		}
		$input.timepicker({ format: "hh:mm A", step: 15 });
	});

	// Override "Time (24 Hours)" label → "Time (12 Hours)" whenever a timepicker popover is shown
	$(document).off("inserted.bs.popover.leadAutomationTp shown.bs.popover.leadAutomationTp")
		.on("inserted.bs.popover.leadAutomationTp shown.bs.popover.leadAutomationTp", function () {
			setTimeout(function () {
				$(".popover.timepicker-popover .popover-header").each(function () {
					var html = $(this).html();
					if (html && html.indexOf("24 Hours") !== -1) {
						$(this).html(html.replace("24 Hours", "12 Hours"));
					}
				});
			}, 0);
		});
}

function leadAutomationPopulateScheduleTimezones() {
	leadAutomationInitTimepickers();
	var settings = window.LEAD_AUTOMATION_STATE.settings || {};
	var formId = "leadAutomationScheduleForm";
	var masterId = "leadAutomationTimezoneMaster";
	var master = $("#" + formId + " #" + masterId);
	if (!master.length || typeof getAllCountryTimezone !== "function") {
		return;
	}
	function initTimezoneSelect2() {
		if (typeof $.fn.select2 !== "function") return;
		$("#" + formId + " .lead-automation-timezone-select").each(function () {
			var $select = $(this);
			if ($select.hasClass("select2-hidden-accessible")) {
				$select.select2("destroy");
			}
			$select.select2({
				theme: "bootstrap4",
				width: "100%",
				dropdownParent: $("#" + formId),
			});
		});
	}
	function applyOptionsToRows() {
		var state = window.LEAD_AUTOMATION_STATE;
		var optionsHtml = state.timezoneOptionsHtml || "";
		if (!optionsHtml) return;
		$("#" + formId + " .lead-automation-timezone-select").each(function () {
			var $select = $(this);
			if (!$select.find("option").length) {
				$select.html(optionsHtml);
			}
			var rowId = $select.attr("data-schedule-row-id") || "";
			var row = (settings.schedules || []).filter(function (item) {
				return String(item.id) === String(rowId);
			})[0];
			if (row && !row.isDefault) {
				$select.find("option[value='ALL']").remove();
			}
			if (row) {
				var timezoneValue = String(row.timezone || "");
				if (!timezoneValue && (row.timezoneId !== undefined && row.timezoneId !== null && String(row.timezoneId) !== "")) {
					if (String(row.timezoneId) === "0") {
						timezoneValue = "ALL";
					} else {
						var matched = $select.find("option[custom_timezone_id='" + row.timezoneId + "']");
						if (matched.length) {
							timezoneValue = String(matched.val() || matched.attr("value") || "");
						}
					}
					if (timezoneValue) {
						row.timezone = timezoneValue;
					}
				}
				$select.val(String(timezoneValue || ""));
				$select.prop("disabled", !!row.isDefault);
			}
		});
		initTimezoneSelect2();
	}
	var state = window.LEAD_AUTOMATION_STATE;
	if (state.timezonesLoaded && state.timezoneOptionsHtml) {
		applyOptionsToRows();
		return;
	}
	if (state.timezonesLoading) {
		return;
	}
	state.timezonesLoading = true;
	master.prop("disabled", true).html('<option>Loading...</option>');
	var tzRequest = getAllCountryTimezone(formId, 0, masterId);
	if (tzRequest && typeof tzRequest.then === "function") {
		tzRequest.then(function () {
			var optionsHtml = '<option value="ALL" custom_timezone_id="0">ALL</option>' + master.html();
			state.timezoneOptionsHtml = optionsHtml;
			master.html(optionsHtml).prop("disabled", false);
			state.timezonesLoaded = true;
			state.timezonesLoading = false;
			applyOptionsToRows();
		}, function () {
			state.timezonesLoading = false;
		});
		return;
	}
	if (tzRequest && typeof tzRequest.fail === "function") {
		tzRequest.then(function () {
			var optionsHtml = '<option value="ALL" custom_timezone_id="0">ALL</option>' + master.html();
			state.timezoneOptionsHtml = optionsHtml;
			master.html(optionsHtml).prop("disabled", false);
			state.timezonesLoaded = true;
			state.timezonesLoading = false;
			applyOptionsToRows();
		}).fail(function () {
			state.timezonesLoading = false;
		});
		return;
	}
	var optionsHtml = '<option value="ALL" custom_timezone_id="0">ALL</option>' + master.html();
	state.timezoneOptionsHtml = optionsHtml;
	master.html(optionsHtml).prop("disabled", false);
	state.timezonesLoaded = true;
	state.timezonesLoading = false;
	applyOptionsToRows();
}

function leadAutomationGetScheduleContent() {
	var settings = window.LEAD_AUTOMATION_STATE.settings || {};
	var schedules = leadAutomationEnsureScheduleRows(settings);

	var blackouts = "";
	$.each(settings.blackouts || [], function (k, item) {
		var startDate = leadAutomationFormatDateLong(item.startDate || "");
		var endDate = leadAutomationFormatDateLong(item.endDate || "");
		var range = startDate && endDate && startDate !== endDate ? startDate + " - " + endDate : startDate;
		blackouts +=
			'<div class="lead-automation-blackout">' +
			'<div><div class="lead-automation-blackout__title">' +
			leadAutomationEscapeHtml(item.reason || item.label || "") +
			'</div><div class="lead-automation-blackout__sub">' +
			leadAutomationEscapeHtml(item.range || range || "") +
			'</div></div>' +
			'<button type="button" class="lead-automation-chip lead-automation-chip--danger" data-lead-automation-blackout-remove="' +
			leadAutomationEscapeHtml(String(item.id || "")) +
			'">Remove</button>' +
			'</div>';
	});

	var html = [];
	html.push('<div class="lead-automation-sectionHeader">');
	html.push('<div class="lead-automation-sectionHeader__title">Schedule & timing</div>');
	html.push('<div class="lead-automation-sectionHeader__sub">Set send windows, time zones and blackout dates</div>');
	html.push('</div>');
	var scheduleRows = "";
	$.each(schedules, function (_, row) {
		var activeDays = row.activeDays || [];
		var days = "";
		$.each(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], function (k, day) {
			var isActive = $.inArray(day, activeDays) !== -1;
			days +=
				'<button type="button" class="lead-automation-day ' +
				(isActive ? "is-active" : "") +
				'" data-lead-automation-day="' +
				day +
				'" data-schedule-row-id="' +
				leadAutomationEscapeHtml(String(row.id)) +
				'">' +
				day +
				"</button>";
		});
		scheduleRows +=
			'<div class="lead-automation-scheduleRow" data-schedule-row-id="' +
			leadAutomationEscapeHtml(String(row.id)) +
			'">' +
			'<div class="lead-automation-formGrid lead-automation-formGrid--three">' +
			'<label class="lead-automation-field lead-automation-field--timezone"><span>Timezone</span><select class="lead-automation-input lead-automation-timezone-select" data-schedule-row-id="' +
			leadAutomationEscapeHtml(String(row.id)) +
			'" id="leadAutomationTimezone-' +
			leadAutomationEscapeHtml(String(row.id)) +
			'" ' +
			(row.isDefault ? "disabled" : "") +
			'></select></label>' +
			'<label class="lead-automation-field"><span>Window start</span><input type="text" readonly class="lead-automation-input lead-automation-window-start lead-automation-timepicker" data-schedule-row-id="' +
			leadAutomationEscapeHtml(String(row.id)) +
			'" value="' +
			leadAutomationEscapeHtml(row.windowStart || "10:00") +
			'"></label>' +
			'<label class="lead-automation-field"><span>Window end</span><input type="text" readonly class="lead-automation-input lead-automation-window-end lead-automation-timepicker" data-schedule-row-id="' +
			leadAutomationEscapeHtml(String(row.id)) +
			'" value="' +
			leadAutomationEscapeHtml(row.windowEnd || "17:00") +
			'"></label>' +
			"</div>" +
			'<div class="lead-automation-activeDaysInline">' +
			'<div class="lead-automation-scheduleBlock__subLabel">Active days</div>' +
			'<div class="lead-automation-dayRow lead-automation-dayRow--inline">' +
			days +
			"</div>" +
			"</div>" +
			'<div class="lead-automation-scheduleActions">' +
			(row.isDefault
				? '<span class="lead-automation-scheduleActions__note"></span>'
				: '<button type="button" class="lead-automation-btn lead-automation-btn--ghost" data-lead-automation-schedule-remove="' +
					leadAutomationEscapeHtml(String(row.id)) +
					'">Remove</button>') +
			"</div>" +
			"</div>";
	});
	html.push(
		leadAutomationBuildCard(
			"Schedule & timing",
			[
				'<div class="lead-automation-scheduleBlock">',
				'<div class="lead-automation-scheduleBlock__head">' +
					'<div><div class="lead-automation-scheduleBlock__label">Send window</div>' +
					'<div class="lead-automation-copy">Messages will only fire within these hours - queued messages wait until the next open window.</div></div>' +
					'<div class="lead-automation-scheduleBlock__actions">' +
						'<button type="button" class="lead-automation-btn lead-automation-btn--ghost" data-lead-automation-schedule-add="+">+ Add timezone</button>' +
					"</div>" +
				"</div>",
				'<div id="leadAutomationScheduleForm">' +
					'<select class="lead-automation-input lead-automation-timezone-master" id="leadAutomationTimezoneMaster" style="display:none;"></select>' +
					scheduleRows +
				"</div>",
				"</div>",
				'<div class="lead-automation-scheduleBlock">',
				'<div class="lead-automation-scheduleBlock__label">Smart send time</div>',
				'<div class="lead-automation-copy">AI adjusts send time to the slot with the highest historical reply rates for each lead\'s timezone and temperament</div>',
				leadAutomationBuildToggle("smartSendTime", !!settings.smartSendTime, "Smart send time"),
				'<div class="lead-automation-pills">' +
					leadAutomationBuildBadge("9–10 AM", "purple") +
					leadAutomationBuildBadge("11 AM–1 PM", "purple") +
					leadAutomationBuildBadge("2–5 PM", "purple") +
					leadAutomationBuildBadge("6–8 PM", "neutral") +
					"</div>",
				"</div>",
				'<div class="lead-automation-scheduleBlock">',
				'<div class="lead-automation-scheduleBlock__head"><div><div class="lead-automation-scheduleBlock__label">Blackout dates</div><div class="lead-automation-copy">No messages are sent on these dates - public holidays, exams, etc.</div></div><button type="button" class="lead-automation-btn lead-automation-btn--ghost" data-lead-automation-blackout-toggle="+">+ Add blackout date</button></div>',
				'<div class="lead-automation-blackoutForm" id="leadAutomationBlackoutForm" style="display:none;">' +
					'<div class="lead-automation-formGrid lead-automation-formGrid--three">' +
						'<label class="lead-automation-field"><span>Reason</span><input type="text" class="lead-automation-input" id="leadAutomationBlackoutReason" placeholder="Holiday / Exam"></label>' +
						'<label class="lead-automation-field"><span>Start date</span><input type="date" class="lead-automation-input" id="leadAutomationBlackoutStart"></label>' +
						'<label class="lead-automation-field"><span>End date</span><input type="date" class="lead-automation-input" id="leadAutomationBlackoutEnd"></label>' +
					'</div>' +
					'<div class="lead-automation-blackoutForm__actions">' +
						'<button type="button" class="lead-automation-btn lead-automation-btn--ghost" data-lead-automation-blackout-cancel="true">Cancel</button>' +
						'<button type="button" class="lead-automation-btn" data-lead-automation-blackout-add="true">Add blackout</button>' +
					'</div>' +
				'</div>',
				blackouts,
				"</div>",
			].join(""),
			'<div class="mt-2"><button type="button" class="lead-automation-btn" data-lead-automation-action="settings-save">Save changes</button></div>'
		)
	);
	return html.join("");
}
