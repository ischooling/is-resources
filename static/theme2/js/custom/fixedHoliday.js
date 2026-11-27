var FH_DATES = [];
var FH_ORIGINAL = [];

function fhParse(value) {
	var p = (value || '').split('-');
	if (p.length != 3) {
		return null;
	}
	return new Date(parseInt(p[2], 10), parseInt(p[0], 10) - 1, parseInt(p[1], 10));
}

function fhFormat(date) {
	var m = ('0' + (date.getMonth() + 1)).slice(-2);
	var d = ('0' + date.getDate()).slice(-2);
	return m + '-' + d + '-' + date.getFullYear();
}

function fhToday() {
	var t = new Date();
	return new Date(t.getFullYear(), t.getMonth(), t.getDate());
}

function fhIsLocked(value) {
	return FH_ORIGINAL.indexOf(value) != -1 && fhParse(value) < fhToday();
}

function initFixedHolidayForm() {
	FH_ORIGINAL = ($('#fixedHolidayForm #originalDates').val() || '').split(',').filter(function (d) { return d != ''; });
	FH_DATES = FH_ORIGINAL.slice();
	$('#fixedHolidayForm #singleDate, #fixedHolidayForm #rangeFrom, #fixedHolidayForm #rangeTo').datepicker({
		format: 'mm-dd-yyyy',
		autoclose: true,
		todayHighlight: true
	});
	$('#fixedHolidayForm #singleDate').on('changeDate', function () {
		var value = $(this).val();
		if (value) {
			fhAddDates([value]);
			$(this).val('');
		}
	});
	fixedHolidaySessionChanged();
}

function fixedHolidaySessionChanged() {
	var today = fhToday();
	$('#fixedHolidayForm #singleDate, #fixedHolidayForm #rangeFrom, #fixedHolidayForm #rangeTo').each(function () {
		$(this).datepicker('setStartDate', today);
		$(this).datepicker('setEndDate', null);
	});
	fhRender();
}

function addFixedHolidayRange() {
	var from = fhParse($('#fixedHolidayForm #rangeFrom').val());
	var to = fhParse($('#fixedHolidayForm #rangeTo').val());
	if (!from || !to) {
		showMessageTheme2(0, 'Please select both From and To dates.');
		return false;
	}
	if (to < from) {
		showMessageTheme2(0, 'To date must be on or after the From date.');
		return false;
	}
	var dates = [];
	for (var d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
		dates.push(fhFormat(d));
	}
	fhAddDates(dates);
	$('#fixedHolidayForm #rangeFrom, #fixedHolidayForm #rangeTo').val('');
	return false;
}

function fhAddDates(dates) {
	var today = fhToday();
	var skipped = 0;
	$.each(dates, function (i, value) {
		var date = fhParse(value);
		if (!date || date < today) {
			skipped++;
			return;
		}
		if (FH_DATES.indexOf(value) == -1) {
			FH_DATES.push(value);
		}
	});
	if (skipped > 0) {
		showMessageTheme2(0, skipped + ' date(s) skipped because they are in the past.');
	}
	fhRender();
}

function removeFixedHolidayDate(value) {
	if (fhIsLocked(value)) {
		return false;
	}
	FH_DATES = FH_DATES.filter(function (d) { return d != value; });
	fhRender();
	return false;
}

function fhRender() {
	FH_DATES.sort(function (a, b) { return fhParse(a) - fhParse(b); });
	var box = $('#fixedHolidayForm #fixedHolidayDates');
	if (FH_DATES.length == 0) {
		box.html('<span class="text-muted">No dates selected yet.</span>');
		return;
	}
	var html = '';
	$.each(FH_DATES, function (i, value) {
		var label = fhParse(value).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', weekday: 'short' });
		if (fhIsLocked(value)) {
			html += '<span class="fh-chip fh-locked" title="Past date"><i class="fa fa-lock"></i>' + label + '</span>';
		} else {
			html += '<span class="fh-chip">' + label + '<a href="javascript:void(0);" onclick="return removeFixedHolidayDate(\'' + value + '\')" title="Remove">&times;</a></span>';
		}
	});
	html += '<div class="fh-hint">' + FH_DATES.length + ' day(s) selected</div>';
	box.html(html);
}

function fixedHolidayPost(action, data, onSuccess) {
	data['userId'] = USER_ID;
	$.ajax({
		type: 'POST',
		contentType: APPLICATION_JSON_VALUE,
		url: getURLForHTML('dashboard', action),
		data: JSON.stringify(data),
		dataType: 'json',
		success: function (response) {
			if (response.status == '1') {
				showMessageTheme2(1, response.message);
				onSuccess(response);
			} else {
				showMessageTheme2(0, response.message || 'Something went wrong. Please try again.');
			}
		}
	});
}

function submitFixedHoliday() {
	hideMessageTheme2('');
	var name = $.trim($('#fixedHolidayForm #holidayName').val());
	if (name == '') {
		showMessageTheme2(0, 'Please enter the holiday name.');
		return false;
	}
	if (FH_DATES.length == 0) {
		showMessageTheme2(0, 'Please select at least one holiday date.');
		return false;
	}
	var moduleId = $('#fixedHolidayForm #moduleId').val();
	var sessionId = $('#fixedHolidayForm #sessionId').val();
	var data = {
		moduleId: moduleId,
		holidayId: $('#fixedHolidayForm #holidayId').val(),
		sessionId: sessionId,
		holidayName: name,
		holidayRemark: $.trim($('#fixedHolidayForm #holidayRemark').val()),
		holidayDates: FH_DATES.join(',')
	};
	var newDates = FH_DATES.filter(function (d) { return FH_ORIGINAL.indexOf(d) == -1; });
	checkHolidayBookedClasses({ holidayFor: 'ALL', holidayDates: newDates.join(',') }, function () {
		fixedHolidayPost('fixed-holiday-submit', data, function () {
			setTimeout(function () { callDashboardPageSchool(moduleId, 'fixed-holiday-list', '', '&sessionId=' + sessionId); }, 800);
		});
	});
	return false;
}

function openFixedHolidayForm(moduleId, holidayId) {
	var sessionId = $('#fixedHolidaySessionId').val() || '';
	callDashboardPageSchool(moduleId, 'fixed-holiday-form', '', '&holidayId=' + holidayId + '&sessionId=' + sessionId);
	return false;
}

function fixedHolidayReloadList(moduleId) {
	var sessionId = $('#fixedHolidaySessionId').val() || '';
	setTimeout(function () { callDashboardPageSchool(moduleId, 'fixed-holiday-list', '', '&sessionId=' + sessionId); }, 800);
}

function copyFixedHolidays(moduleId) {
	fixedHolidayPost('fixed-holiday-copy', { moduleId: moduleId, sessionId: $('#fixedHolidaySessionId').val() }, function () {
		fixedHolidayReloadList(moduleId);
	});
}

function updateFixedHoliday(holidayId, action, moduleId) {
	fixedHolidayPost('fixed-holiday-update', { moduleId: moduleId, holidayId: holidayId, controllType: action }, function () {
		fixedHolidayReloadList(moduleId);
	});
}

function activateFixedHoliday(holidayId, dates, moduleId) {
	checkHolidayBookedClasses({ holidayFor: 'ALL', holidayDates: dates }, function () {
		updateFixedHoliday(holidayId, 'ACTIVATE', moduleId);
	}, 'Are you sure you want to activate this holiday?');
	return false;
}

function checkHolidayBookedClasses(holiday, onConfirm, plainConfirmMessage) {
	if (!holiday.holidayDates) {
		if (plainConfirmMessage) {
			fhConfirmModal(plainConfirmMessage, '', onConfirm);
		} else {
			onConfirm();
		}
		return;
	}
	holiday['userId'] = USER_ID;
	$.ajax({
		type: 'POST',
		contentType: APPLICATION_JSON_VALUE,
		url: getURLForHTML('dashboard', 'holiday-booked-classes'),
		data: JSON.stringify(holiday),
		dataType: 'json',
		success: function (response) {
			if (response.status != '1') {
				showMessageTheme2(0, response.message || 'Could not check booked classes. Please try again.');
				return;
			}
			var classes = response.classes || [];
			if (classes.length == 0) {
				if (plainConfirmMessage) {
					fhConfirmModal(plainConfirmMessage, '', onConfirm);
				} else {
					onConfirm();
				}
				return;
			}
			var rows = '';
			$.each(classes, function (i, c) {
				rows += '<tr><td>' + (i + 1) + '</td><td>' + escapeHtmlFh(c.studentName) + '</td><td>' + escapeHtmlFh(c.teacherName)
					+ '</td><td>' + escapeHtmlFh(c.courseName) + '</td><td>' + escapeHtmlFh(c.classTime) + '</td></tr>';
			});
			var body = '<div class="table-responsive" style="max-height:320px;overflow:auto"><table class="table table-bordered table-sm font-12 mb-0">'
				+ '<thead><tr class="bg-primary text-white"><th>#</th><th>Student</th><th>Teacher</th><th>Course</th><th>Class time</th></tr></thead><tbody>'
				+ rows + '</tbody></table></div>';
			fhConfirmModal(classes.length + ' booked class(es) fall on this holiday. They will be rescheduled automatically '
				+ response.daysBefore + ' day(s) before the holiday and the class count goes back to Carry Forward. Continue?', body, onConfirm);
		}
	});
}

function escapeHtmlFh(value) {
	return $('<div/>').text(value == null ? '' : value).html();
}

function fhConfirmModal(message, body, onConfirm) {
	$('#holidayBookedClassesModal').remove();
	var html = '<div class="modal fade" id="holidayBookedClassesModal" tabindex="-1" role="dialog">'
		+ '<div class="modal-dialog ' + (body ? 'modal-lg' : 'modal-md') + '" role="document"><div class="modal-content">'
		+ '<div class="modal-header bg-primary text-white py-2"><h6 class="modal-title mb-0">Please confirm</h6>'
		+ '<button type="button" class="close text-white" data-dismiss="modal">&times;</button></div>'
		+ '<div class="modal-body"><p class="font-weight-semi-bold mb-3">' + message + '</p>' + body + '</div>'
		+ '<div class="modal-footer"><button type="button" class="btn btn-outline-secondary" data-dismiss="modal">Cancel</button>'
		+ '<button type="button" class="btn btn-primary" id="holidayBookedClassesConfirm"><i class="fa fa-check"></i>&nbsp;Continue</button></div>'
		+ '</div></div></div>';
	$('body').append(html);
	$('#holidayBookedClassesConfirm').on('click', function () {
		$('#holidayBookedClassesModal').modal('hide');
		onConfirm();
	});
	$('#holidayBookedClassesModal').modal('show');
}
