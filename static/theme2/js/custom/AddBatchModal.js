/*
 * Shared "Add Classroom" modal — JS replacement for AddBatchStudent.jsp.
 * Used by the theme2 host fragments that previously did <%@ include AddBatchStudent.jsp %>
 * (ManageAdvanceSearchStudentContent.jsp, ManageProfileBatchStudentContent.jsp). Each host
 * emits its dropdown/master data as inline JSON and calls abmRenderAddBatchModal(cfg) from
 * its openAddBatch() click handler, then shows #addBatchModal as before.
 *
 * Functions are namespaced abm* to avoid any collision (the manage-batch-student page has its
 * own equivalent in ManageBatchStudentContent.js and never shares a page with this file).
 * The modal's submit/vendor/joining handlers (createBatchByStudent, changeVendor,
 * changeJoiningType) still come from dashboardSchoolBatches.js, unchanged.
 *
 * cfg = { userId, added ('Y'/'N'), moduleId, schoolId, timeZoneList:[{key,value,extra,extra4}], gradeList:[{key,value}] }
 */

function abmEsc(value) {
	if (value === undefined || value === null) {
		return "";
	}
	return String(value)
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");
}

function abmTimezoneOptions(timeZoneList) {
	var html = '<option value="">Select Time Zone</option>';
	if (timeZoneList) {
		for (var i = 0; i < timeZoneList.length; i++) {
			var tz = timeZoneList[i];
			html += '<option value="' + abmEsc(tz.key) + '" data-timezone="' + abmEsc(tz.extra4) + '">(' + abmEsc(tz.extra) + ') - ' + abmEsc(tz.value) + '</option>';
		}
	}
	return html;
}

function abmGradeOptions(gradeList) {
	var html = '<option value="0">Select Grade</option>';
	if (gradeList) {
		for (var i = 0; i < gradeList.length; i++) {
			html += '<option value="' + abmEsc(gradeList[i].key) + '">' + abmEsc(gradeList[i].value) + '</option>';
		}
	}
	return html;
}

// Faithful reproduction of AddBatchStudent.jsp's modal markup.
function abmGetAddBatchModalHtml(cfg) {
	var hoursOptions = '<option value="">HH</option><option value="00">00</option>';
	for (var h = 1; h <= 23; h++) {
		var hv = h > 9 ? String(h) : "0" + h;
		hoursOptions += '<option value="' + hv + '">' + hv + '</option>';
	}
	var minOptions = '<option value="">MM</option>';
	for (var m = 0; m <= 59; m += 5) {
		var mv = m > 9 ? String(m) : "0" + m;
		minOptions += '<option value="' + mv + '">' + mv + '</option>';
	}
	var durationOptions = '<option value="">Please select batch duration</option>';
	for (var d = 1; d <= 12; d++) {
		durationOptions += '<option value="' + d + '">' + d + (d === 1 ? ' Hour' : ' Hours') + '</option>';
	}
	var vendorOptions = cfg.schoolId != 5
		? '<option value="LENS" selected>LENS</option>'
		: '<option value="External">External</option>';

	return '' +
	'<div class="modal fade" id="addBatchModal" role="dialog">' +
		'<div class="modal-dialog modal-xl">' +
			'<form name="batchForm" id="batchForm" class="custom-field-scope" action="javascript:void(0);">' +
				'<div class="modal-content border-0">' +
					'<div class="modal-header py-2 bg-primary text-white">' +
						'<h5 class="modal-title">Add Classroom</h5>' +
						'<button type="button" class="close text-white" data-dismiss="modal">&times;</button>' +
					'</div>' +
					'<div class="modal-body">' +
						'<input type="hidden" class="form-control" id="userId" name="userId" value="' + abmEsc(cfg.userId) + '">' +
						'<input type="hidden" class="form-control" id="selectStudentIds" name="selectStudentIds" />' +
						'<input type="hidden" class="form-control" id="standardId" name="standardId" />' +
						'<input type="hidden" class="form-control" id="callFrom" name="callFrom" />' +
						'<input type="hidden" class="form-control" id="timeZoneFrom" name="timeZoneFrom" />' +
						'<input type="hidden" class="form-control" id="timeZoneTo" name="timeZoneTo" />' +
						'<input type="hidden" class="form-control" id="sessionId" name="sessionId" />' +
						'<div class="row">' +
							'<div class="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">' +
								'<div class="form-group custom-field">' +
									'<input type="text" class="form-control" id="batchName" name="batchName" placeholder=" " onkeydown="return M.isAddressLine(event);" />' +
									'<label for="batchName">Classroom Name</label>' +
								'</div>' +
							'</div>' +
							'<div class="col-xl-2 col-lg-4 col-md-6 col-sm-12 col-12" id="batchCategoryDiv">' +
								'<div class="form-group custom-field">' +
									'<select class="form-control" id="batchCategory" name="batchCategory" onchange="return abmChangeCategory()">' +
										'<option value="">Select Classroom Category</option>' +
										'<option value="MAIN_BATCH">Main Batch</option>' +
										'<option value="EXTRA_CLASS_BATCH">Extra Classes Batch</option>' +
									'</select>' +
									'<label for="batchCategory">Classroom Category</label>' +
								'</div>' +
							'</div>' +
							'<div class="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12" id="countryTimezoneFromIdDiv">' +
								'<div class="form-group custom-field">' +
									'<select name="countryTimezoneFromId" id="countryTimezoneFromId" class="form-control">' + abmTimezoneOptions(cfg.timeZoneList) + '</select>' +
									'<label for="countryTimezoneFromId">TimeZone From</label>' +
								'</div>' +
							'</div>' +
							'<div class="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12" id="countryTimezoneToIdDiv">' +
								'<div class="form-group custom-field">' +
									'<select name="countryTimezoneToId" id="countryTimezoneToId" class="form-control">' + abmTimezoneOptions(cfg.timeZoneList) + '</select>' +
									'<label for="countryTimezoneToId">TimeZone To</label>' +
								'</div>' +
							'</div>' +
							'<div class="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12" id="gradeDiv">' +
								'<div class="form-group custom-field">' +
									'<select class="form-control" id="standardId" name="standardId" onchange="abmSetStandardId(this.value)">' + abmGradeOptions(cfg.gradeList) + '</select>' +
									'<label for="standardId">Select Grade</label>' +
								'</div>' +
							'</div>' +
							'<div class="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">' +
								'<div class="form-group custom-field">' +
									'<input type="text" class="form-control" id="batchStartDate" name="batchStartDate" placeholder=" " readonly onkeydown="return false" />' +
									'<label for="batchStartDate">Start Date</label>' +
								'</div>' +
							'</div>' +
							'<div class="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">' +
								'<div class="form-group custom-field">' +
									'<input type="text" class="form-control" id="batchEndDate" name="batchEndDate" placeholder=" " readonly onkeydown="return false" />' +
									'<label for="batchEndDate">End Date</label>' +
								'</div>' +
							'</div>' +
							'<div class="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">' +
								'<div class="form-group custom-field">' +
									'<input type="text" class="form-control" id="batchHolidayDate" name="batchHolidayDate" placeholder=" " readonly onkeydown="return false" />' +
									'<label for="batchHolidayDate">Blackout Date</label>' +
								'</div>' +
							'</div>' +
							'<div class="col-xl-2 col-lg-4 col-md-6 col-sm-12 col-12">' +
								'<div class="form-group">' +
									'<div class="d-flex align-items-center">' +
										'<div class="d-inline-block w-50 batchStartTimeDiv form-group custom-field mb-0">' +
											'<select id="timeHrsFrom" name="timeHrsFrom" class="form-control" style="padding: 0 15px;" onchange="abmGetTimeFrom(this.value);">' + hoursOptions + '</select>' +
											'<label for="timeHrsFrom">HH</label>' +
										'</div>' +
										'<span class="d-inline-block w-fit-content mx-2 font-weight-bold">:</span>' +
										'<div class="d-inline-block w-50 batchEndTimeDiv form-group custom-field mb-0">' +
											'<select id="timeMinFrom" name="timeMinFrom" class="form-control" style="padding: 0 15px;">' + minOptions + '</select>' +
											'<label for="timeMinFrom">MM</label>' +
										'</div>' +
									'</div>' +
								'</div>' +
							'</div>' +
							'<div class="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">' +
								'<div class="form-group custom-field batchDurationDiv">' +
									'<select class="form-control" name="batchDuration" id="batchDuration">' + durationOptions + '</select>' +
									'<label for="batchDuration">Classroom Duration (in Hours)</label>' +
								'</div>' +
							'</div>' +
							'<div class="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">' +
								'<div class="form-group custom-field">' +
									'<input type="text" class="form-control" id="batchPeriodTime" name="batchPeriodTime" placeholder=" " onkeydown="return M.digit(event);" />' +
									'<label for="batchPeriodTime">Period Time (In Minutes)</label>' +
								'</div>' +
							'</div>' +
							'<div class="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">' +
								'<div class="form-group custom-field timeIntervalDiv">' +
									'<select class="form-control" name="timeInterval" id="timeInterval">' +
										'<option value="0">Please select Buffer Time</option>' +
										'<option value="5">5 Minutes</option>' +
										'<option value="10">10 Minutes</option>' +
										'<option value="15">15 Minutes</option>' +
										'<option value="20">20 Minutes</option>' +
										'<option value="25">25 Minutes</option>' +
										'<option value="30">30 Minutes</option>' +
									'</select>' +
									'<label for="timeInterval">Buffer Time Between Two Periods</label>' +
								'</div>' +
							'</div>' +
							'<div class="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">' +
								'<div class="form-group custom-field meetingVendorDiv">' +
									'<select class="form-control" name="meetingVendor" id="meetingVendor" onchange="return changeVendor(\'batchForm\', \'meetingVendor\', \'batchLink\')">' + vendorOptions + '</select>' +
									'<label for="meetingVendor">Meeting Vendor</label>' +
								'</div>' +
							'</div>' +
							'<div class="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">' +
								'<div class="form-group custom-field joiningTypeDiv">' +
									'<select disabled class="form-control" name="joiningType" id="joiningType" onchange="return changeJoiningType(\'batchForm\', \'batchLink\')">' +
										'<option value="Multiple" selected>Multiple</option>' +
										'<option value="Single">Single</option>' +
									'</select>' +
									'<label for="joiningType">Joining Type</label>' +
								'</div>' +
							'</div>' +
							'<div class="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12 hide">' +
								'<div class="form-group custom-field">' +
									'<input type="text" class="form-control" id="batchLink" name="batchLink" placeholder=" " readonly />' +
									'<label for="batchLink">Enter Classroom Link</label>' +
								'</div>' +
							'</div>' +
						'</div>' +
					'</div>' +
					'<div class="modal-footer text-right">' +
						'<button type="button" class="btn btn-danger " data-dismiss="modal">Close</button>' +
						(cfg.added === 'Y' ? '<button type="button" class="send btn btn-primary batchCreate" id="proceed" onclick="return createBatchByStudent(\'batchForm\',\'STUDENT\',' + cfg.moduleId + ');">Proceed</button>' : '') +
					'</div>' +
				'</div>' +
			'</form>' +
		'</div>' +
	'</div>';
}

function abmRefreshSelect2FieldState(selectField) {
	var field = $(selectField);
	var value = field.val();
	if ($.isArray(value)) {
		value = value.join('');
	}
	value = value == undefined || value == null ? '' : value.toString().trim();
	var customField = field.closest('.custom-field');
	var hasValue = false;
	customField.find('input:not([type="hidden"]), select, textarea').each(function () {
		var fieldValue = $(this).val();
		if ($.isArray(fieldValue)) {
			fieldValue = fieldValue.join('');
		}
		fieldValue = fieldValue == undefined || fieldValue == null ? '' : fieldValue.toString().trim();
		if (fieldValue !== '' && fieldValue !== '0') {
			hasValue = true;
			return false;
		}
	});
	var rendered = field.next('.select2-container').find('.select2-selection__rendered');
	var label = customField.find('label:not(.error-msg)').first();
	customField.toggleClass('active has-value', hasValue);
	rendered.css('color', hasValue ? '' : 'transparent');
	label.css('left', '16px');
	if (typeof refreshCustomFieldState === 'function') {
		refreshCustomFieldState(customField);
	}
}

function abmInitFormSelect2() {
	if (typeof $.fn.select2 !== 'function') {
		return;
	}
	var parent = $('#addBatchModal .modal-body');
	$('#batchForm select').each(function () {
		var selectField = $(this);
		if (selectField.data('select2')) {
			selectField.select2('destroy');
		}
		selectField.select2({ theme: 'bootstrap4', dropdownParent: parent });
		selectField.next('.select2-container').css({
			'width': '100%', 'min-height': '44px', 'position': 'relative', 'z-index': '1'
		}).find('.select2-selection--single').css({
			'height': '44px', 'min-height': '44px', 'padding': '0', 'display': 'flex', 'align-items': 'center'
		}).find('.select2-selection__rendered').each(function () {
			this.style.setProperty('height', '42px');
			this.style.setProperty('line-height', '42px', 'important');
			this.style.setProperty('padding-top', '0');
			this.style.setProperty('padding-bottom', '0');
		});
		abmRefreshSelect2FieldState(selectField);
		selectField.on('change select2:select select2:clear', function () {
			abmRefreshSelect2FieldState(this);
		});
	});
	if (typeof refreshCustomFieldState === 'function') {
		refreshCustomFieldState($('#batchForm'));
	}
}

function abmGetTimeFrom(fromStart) {
	var html = '<option value=""></option>';
	for (var i = (parseInt(fromStart) + 1); i <= 23; i++) {
		if (i > 9) {
			html += '<option value="' + i + '">' + i + '</option>';
		} else {
			html += '<option value="0' + i + '">0' + i + '</option>';
		}
	}
}

function abmChangeCategory() {
	if ($('#batchCategory').val() == 'MAIN_BATCH') {
		$("#batchForm #gradeDiv").show();
	} else {
		$("#batchForm #gradeDiv").hide();
	}
	if (typeof refreshCustomFieldState === 'function') {
		refreshCustomFieldState($('#batchForm'));
	}
}

function abmSetStandardId(standardId) {
	$("#batchForm #standardId").val(standardId);
}

function abmInitModal() {
	var startDate = new Date();
	$('#batchStartDate').datepicker({ autoclose: true, format: 'mm-dd-yyyy', startDate: startDate })
		.on('changeDate change', function () { if (typeof refreshCustomFieldState === 'function') { refreshCustomFieldState($('#batchForm')); } });
	$('#batchEndDate').datepicker({ autoclose: true, format: 'mm-dd-yyyy', startDate: startDate })
		.on('changeDate change', function () { if (typeof refreshCustomFieldState === 'function') { refreshCustomFieldState($('#batchForm')); } });
	$("#batchHolidayDate").datepicker({ format: 'mm-dd-yyyy', startDate: startDate, multidate: true })
		.on('changeDate change', function () { if (typeof refreshCustomFieldState === 'function') { refreshCustomFieldState($('#batchForm')); } });
	if (typeof refreshCustomFieldState === 'function') {
		refreshCustomFieldState($('#batchForm'));
	}
	abmInitFormSelect2();
}

// Mount the modal (once) into <body> and initialise it. Call from the host's openAddBatch()
// before setting #batchForm fields and showing #addBatchModal.
function abmRenderAddBatchModal(cfg) {
	cfg = cfg || {};
	if ($('#addBatchModal').length) {
		$('#addBatchModal').remove();
	}
	$('body').append(abmGetAddBatchModalHtml(cfg));
	abmInitModal();
}
