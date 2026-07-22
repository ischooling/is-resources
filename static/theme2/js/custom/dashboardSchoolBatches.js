var flag_Change_Batch_Start_And_EndDate=false;
var teacherMappingSetTime = [];

///asfasdfsa
function createBatchByStudent(formId, moduleId, roleModuleId) {
	hideMessageTheme2('');
	var callFrom = $('#batchForm #callFrom').val();
	console.log("callFrom : " + callFrom);
	$.ajax({
		type: "POST",
		contentType: APPLICATION_JSON_VALUE,
		url: getURLForHTML('dashboard', 'create-batch-student'),
		data: JSON.stringify(getRequestForCreateBatchByStudent(formId, moduleId)),
		dataType: 'json',
		cache: false,
		timeout: 600000,
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessageTheme2(0, data['message']);
			} else {
				showMessageTheme2(1, data['message']);
				$('#' + formId)[0].reset();
				$('#addBatchModal').modal('hide');
				if (callFrom == 'ManageBatch') {
					setTimeout(function () { callDashboardPageSchool(roleModuleId, 'manage-batch-student'); }, 1000);
				} else if (callFrom == 'ManageUser') {
					setTimeout(function () { advanceStudentSearch('studentFilter', roleModuleId); }, 1000);
				}
			}
			return false;
		}
	});
}

function getRequestForCreateBatchByStudent(formId, moduleId) {
	var request = {};
	var authentication = {};
	var batchDTO = {};
	batchDTO['userId'] = $("#" + formId + " #userId").val();
	batchDTO['batchStudentIds'] = $("#" + formId + " #selectStudentIds").val();
	batchDTO['standardId'] = $("#" + formId + " #standardId").val();
	batchDTO['batchName'] = $("#" + formId + " #batchName").val();
	batchDTO['batchCategory'] = $("#" + formId + " #batchCategory").val();
	batchDTO['batchStartDate'] = $("#" + formId + " #batchStartDate").val();
	batchDTO['batchEndDate'] = $("#" + formId + " #batchEndDate").val().trim();
	batchDTO['batchHolidayDate'] = $("#" + formId + " #batchHolidayDate").val();
	batchDTO['timeHrsFrom'] = $("#" + formId + " #timeHrsFrom").val();
	batchDTO['timeMinFrom'] = $("#" + formId + " #timeMinFrom").val();
	batchDTO['timeInterval'] = $("#" + formId + " #timeInterval").val();
	batchDTO['periodTime'] = $("#" + formId + " #batchPeriodTime").val();
	batchDTO['batchDuration'] = $("#" + formId + " #batchDuration").val();
	//	batchDTO['timeZoneFrom'] = $("#"+formId+" #timeZoneFrom").val();
	//	batchDTO['timeZoneTo'] = $("#"+formId+" #timeZoneTo").val();
	batchDTO['sessionId'] = $("#" + formId + " #sessionId").val();
	batchDTO['timeZoneFrom'] = $("#" + formId + " #countryTimezoneFromId").val();
	batchDTO['timeZoneTo'] = $("#" + formId + " #countryTimezoneToId").val();
	batchDTO['classRoomLink'] = $("#" + formId + " #batchLink").val();
	batchDTO['meetingVendor'] = $("#" + formId + " #meetingVendor").val();
	batchDTO['joiningType'] = $("#" + formId + " #joiningType").val();

	batchDTO['schoolId'] = SCHOOL_ID;
	request['batchDTO'] = batchDTO;
	authentication['hash'] = getHash();
	authentication['userId'] = $("#" + formId + " #userId").val();
	authentication['schoolId'] = SCHOOL_ID;
	authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = moduleId;
	authentication['sessionUserId'] = USER_ID;
	request['authentication'] = authentication;
	return request;
}

function saveAcceleratedModeSignupContent(formId, moduleId) {
	hideMessageTheme2('');
	if ($('#' + formId + ' #studentEmail').val() == '' || $('#' + formId + ' #studentEmail').val() == undefined) {
		showMessageTheme2(0, "Student Email is required to send link");
		return false;
	}
	var emailId = $('#' + formId + ' #studentEmail').val();
	var data = { email: emailId }
	$.ajax({
		type: "POST",
		url: getURLForHTML('dashboard', 'accelerated-mode-signup-student-content'),
		contentType: APPLICATION_JSON_VALUE,
		data: JSON.stringify(data),
		dataType: 'html',
		cache: false,
		//timeout : 600000,
		success: function (htmlContent) {
			if (htmlContent != "") {
				var stringMessage = [];
				stringMessage = htmlContent.split("|");
				console.log('stringMessage: ' + stringMessage);
				if (stringMessage[0] == "FAILED" || stringMessage[0] == "EXCEPTION" || stringMessage[0] == "SESSIONOUT") {
					showMessageTheme2(0, stringMessage[1]);
					$('#accModeStudentContentModal').modal('show');
				} else {
					showMessageTheme2(1, stringMessage[1]);
					$('#accModeStudentContentModal').modal('hide');
					setTimeout(function () { callDashboardPageSchool(moduleId, 'accelerated-mode'); }, 1000);
				}
				return false;
			}
		}
	});

}

function sendAcceleratedModeSignupLinkContent(accModeId, moduleId) {
	hideMessageTheme2('');
	var data = { accModeId: accModeId }
	$.ajax({
		type: "POST",
		contentType: APPLICATION_JSON_VALUE,
		url: getURLForHTML('dashboard', 'accelerated-mode-signup-mail'),
		data: JSON.stringify(data),
		dataType: 'html',
		cache: false,
		//timeout : 600000,
		success: function (htmlContent) {
			if (htmlContent != "") {
				var stringMessage = [];
				stringMessage = htmlContent.split("|");
				console.log('stringMessage: ' + stringMessage);
				if (stringMessage[0] == "FAILED" || stringMessage[0] == "EXCEPTION" || stringMessage[0] == "SESSIONOUT") {
					showMessageTheme2(0, stringMessage[1]);
				} else {
					showMessageTheme2(1, stringMessage[1]);
					setTimeout(function () { callDashboardPageSchool(moduleId, 'accelerated-mode'); }, 1000);
				}
				return false;
			}
		}
	});
}

// JS-rendered replacement for the BatchSubjectTeacherContent.jsp shell: builds the modal
// (with the hidden title spans callAssignBatchSubjectTeacherContent reads) client-side,
// then loads the linking content via JSON. Signature unchanged.
function callBatchSubjectAndTeacherMapping(formId, batchId, batchName, standardId, controllType, moduleId) {
	hideMessageTheme2('');
	$('#batchSubjectTeacherSupportContent').html(getBatchSubjectTeacherShellHtml(batchId, batchName, standardId, controllType, moduleId));
	if (controllType == 'View') {
		callAssignBatchSubjectTeacherContent('View');
	} else if (controllType == 'Assign') {
		callAssignBatchSubjectTeacherContent('Assign');
	} else {
		callAssignBatchSubjectTeacherContent('view-assignPastStudentTeacher');
	}
	$('#batchSubjectTeacherMappingModel').modal('show');
	return false;
}

// The modal shell — from BatchSubjectTeacherContent.jsp (title spans carry the ids the
// linking-content loader reads back).
function getBatchSubjectTeacherShellHtml(batchId, batchName, standardId, controllType, moduleId) {
	var dialogSize = controllType == 'Assign' ? 'modal-lg' : 'modal-xl';
	return '' +
	'<div class="modal fade" id="batchSubjectTeacherMappingModel" role="dialog" aria-labelledby="subjectTeacherMappingModalLabel">' +
		'<div class="modal-dialog ' + dialogSize + '" role="document">' +
			'<div class="modal-content border-0">' +
				'<div class="modal-header py-2 bg-primary text-white">' +
					'<h5 class="modal-title" id="subjectTeacherMappingModalLabel">' + batchEsc(controllType) + ' Batch Subject Teacher Mapping: ' + batchEsc(batchName) +
						'<span id="batchId" style="display:none;">' + batchEsc(batchId) + '</span>' +
						'<span id="batchName" style="display:none;">' + batchEsc(batchName) + '</span>' +
						'<span id="standardId" style="display:none;">' + batchEsc(standardId) + '</span>' +
						'<span id="moduleId" style="display:none;">' + batchEsc(moduleId) + '</span>' +
						'<span id="controllType" style="display:none;">' + batchEsc(controllType) + '</span>' +
					'</h5>' +
					'<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
				'</div>' +
				'<div class="modal-body" style="max-height:480px;margin-top:0 !important">' +
					'<div id="studentTeacherLinkingContent" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 p-0"></div>' +
				'</div>' +
				'<div class="modal-footer">' +
					'<button type="button" class="btn btn-danger " data-dismiss="modal">Close</button>' +
				'</div>' +
			'</div>' +
		'</div>' +
	'</div>' +
	'<div class="modal fade" id="booksclassOutsideAvailabilityConfirmationModal" tabindex="-1">' +
		'<div class="modal-dialog modal-md modal-notify modal-info" role="document">' +
			'<div class="modal-content border-primary" style="border-top: 10px solid;">' +
				'<div class="modal-body" style="margin-top: 0px !important;">' +
					'<div class="text-center text-warning mb-2"><i class="fa fa-exclamation-triangle fa-3x" aria-hidden="true"></i></div>' +
					'<div class="full my-2">' +
						'<p class="text-center mb-1 font-weight-semi-bold text-primary">The class for <span id="studentBatchName"></span> - <span id="courseActivity"></span> will be scheduled<span id="meetingDateTime"></span>. If this class is outside teacher\'s current availability, it will be added to teacher\'s availability. Do you wish to proceed?</p>' +
					'</div>' +
				'</div>' +
				'<div class="modal-footer justify-content-between">' +
					'<button type="button" class="btn btn-sm btn-danger " data-dismiss="modal">Cancel</button>' +
					'<button type="button" class="btn btn-sm btn-success " id="updateTeacherTimeTableScheduleBtn" onclick="">Confirm</button>' +
				'</div>' +
			'</div>' +
		'</div>' +
	'</div>';
}

async function callAssignBatchSubjectTeacherContent(callFor) {
	var batchId = $('#subjectTeacherMappingModalLabel #batchId').html();
	var batchName = $('#subjectTeacherMappingModalLabel #batchName').html();
	var standardId = $('#subjectTeacherMappingModalLabel #standardId').html();
	var moduleId = $('#subjectTeacherMappingModalLabel #moduleId').html();
	var controllType = $('#subjectTeacherMappingModalLabel #controllType').html();

	if (callFor == 'view-assignPastStudentTeacher') {
		// Past-teacher branch is not reachable from the classroom row actions; leave the
		// legacy HTML-fragment loader in place.
		callForDashboardData('formIdIfAny', 'student-teacher-linking-content?studentId=' + studentId + "&callFor=" + callFor + "&standardId=" + standardId + "&controllType=" + controllType, 'studentTeacherLinkingContent');
		return;
	}

	var ajaxReqDetails = {
		method: "POST",
		url: getURLForHTML('dashboard', 'batch-subject-teacher-linking-data'),
		body: {
			batchId: batchId,
			standardId: standardId,
			controllType: controllType,
			batchName: batchName,
			callFor: callFor,
			moduleId: moduleId,
		},
		global: true,
		showMessage: false,
	};
	var data = await callCommonAjax(ajaxReqDetails);
	if (!data || data.status != "1") {
		showMessageTheme2(0, (data && data.message) ? data.message : "Unable to load teacher mapping. Please try again.");
		return;
	}
	$('#studentTeacherLinkingContent').html(getBatchTeacherLinkingHtml(data));
	initBatchTeacherLinking(data);
}

// Client render of BatchTeacherLinkingContent.jsp from the JSON payload. Branches on
// data.callFor: 'Assign' shows the subject/teacher assign form; otherwise the per-subject
// schedule table (rendered only when a teacher is already assigned).
function getBatchTeacherLinkingHtml(data) {
	if ($("#batchTeacherLinkingCss").length < 1) {
		$("head").append('<style id="batchTeacherLinkingCss">.emailIDDropDown{display:none;float:left;width:100%;}.batch-schedule{width:450px;}@media(max-width:570px){.batch-schedule{width:360px !important}}</style>');
	}
	var moduleId = data.moduleId;
	var batchId = data.batchId;
	var batchName = data.batchName || "";
	var endDate = data.endDate || "";
	var subjects = data.subjects || [];

	var inner = '';
	if (data.callFor == 'Assign') {
		var subjectOptions = '<option value="0"> Select Subject</option>';
		for (var i = 0; i < subjects.length; i++) {
			var s = subjects[i];
			subjectOptions += '<option value="' + s.subjectId + '" class="subjectIdcls" data-studentId="' + s.batchId + '" data-assignId="' + batchEsc(s.assighnTId) + '" data-subjectCode="' + batchEsc(s.subjectCode) + '" data-subjectName="' + batchEsc(s.subjectName) + '" data-subjectId="' + s.subjectId + '" data-subjectPId="' + batchEsc(s.subjectPId) + '" data-courseType="' + batchEsc(s.courseType) + '" data-standardId="' + batchEsc(s.standardId) + '">' + batchEsc(s.subjectCode) + ' - ' + batchEsc(s.subjectName) + '<br/>' + batchEsc(s.standardName) + '</option>';
		}
		inner =
			'<div class="row">' +
				'<div class="col-md-6 col-sm-12 mb-2 custom-field">' +
					'<select id="subjectIds" name="subjectIds" class="select-style form-control" onchange="subjectBasedTeacherList(this.value);">' + subjectOptions + '</select>' +
					'<label for="subjectIds">Select Subject</label>' +
				'</div>' +
				'<div class="col-md-6 col-sm-12 mb-2 custom-field">' +
					'<select name="teacherId" class="teacherId select-style form-control" id="teacherId" onchange="changeTeacher(\'\', this.value, \'\');"></select>' +
					'<label for="teacherId">Select Teacher</label>' +
				'</div>' +
				'<div class="col-md-12 col-sm-12">' +
					'<a href="#" class="btn btn-primary btn-sm mt-2" id="assigTeacherLinkList" onclick="submitBatchSubjectTeacherAssign(\'teacherForm\',\'SCHOOL\');">Update</a>' +
				'</div>' +
			'</div>';
	} else {
		var tableInner = '';
		if (data.numberOfAssignedTeacher != 0) {
			var rows = '';
			var incRow = 0;
			for (var r = 0; r < subjects.length; r++) {
				var sub = subjects[r];
				if (sub.assignTSName == 'N/A') { continue; }
				incRow++;
				rows +=
					'<tr class="subjectTeacherAssignTime" id="viewBatch-' + sub.subjectId + '" data-id="' + sub.subjectId + '">' +
						'<td style="vertical-align: top;">' + incRow + '</td>' +
						'<td style="vertical-align: top;">' + batchEsc(sub.subjectCode) + ' - ' + batchEsc(sub.subjectName) + '<br/>' + batchEsc(sub.standardName) + '</td>' +
						'<td style="vertical-align: top;" id="assignedTeacherList">' +
							'<div>' + buildLinkingOldTeachersHtml(sub, endDate, batchName, moduleId) + '</div>' +
							'<hr/>' +
							'<input type="hidden" name="oldTeacherAssignId" id="oldTeacherAssignId' + sub.subjectId + '" value="' + batchEsc(sub.assighnTId) + '" />' +
							'<div class="custom-field" style="margin-bottom:0;">' +
								'<select name="assignTeacherId" class="assignTeacherId select-style form-control" id="assignTeacherId' + sub.subjectId + '" onchange="callTeacherTimeScheduleBatch(\'' + batchId + '\',\'' + sub.subjectId + '\', this.value);">' +
									'<option value="">--Select--</option>' + buildLinkingTeacherOptions(sub) +
								'</select>' +
								'<label for="assignTeacherId' + sub.subjectId + '">Assign Teacher</label>' +
							'</div>' +
						'</td>' +
						'<td class="batch-schedule">' +
							'<div id="batch-schedule' + sub.subjectId + '">' +
								'<div style="display:flex;align-items:center">' +
									'<span class="custom-field has-value" style="padding:0 5px;margin-bottom:0;width:50%;">' +
										'<input type="text" class="teachStartDate form-control" name="startDate" placeholder=" " id="startDate' + sub.subjectId + '" value="' + batchEsc(sub.batchStartDate) + '" onchange="checkUpdatesBatch(this,\'' + sub.subjectId + '\')" data-date-start="' + batchEsc(sub.batchStartDate) + '" readonly onkeydown="return false"/>' +
										'<label for="startDate' + sub.subjectId + '">Start Date</label>' +
									'</span>' +
									'<span class="custom-field has-value" style="padding:0 5px;margin-bottom:0;width:50%;">' +
										'<input type="text" class="teachEndDate form-control " name="endDate" placeholder=" " id="endDate' + sub.subjectId + '" value="' + batchEsc(sub.batchEndDate) + '" onchange="checkUpdatesBatch(this,\'' + sub.subjectId + '\')" data-date-end="' + batchEsc(sub.batchEndDate) + '" readonly onkeydown="return false"/>' +
										'<label for="endDate' + sub.subjectId + '">End Date</label>' +
									'</span>' +
								'</div>' +
								'<hr/>' +
								'<div class="form-row teacher-mapping-set-time-' + sub.subjectId + '" style="display:flex;align-items:center;flex-wrap: wrap;justify-content:space-between;font-size:11px;">' +
									buildLinkingDaysGridHtml(sub) +
								'</div>' +
							'</div>' +
							'<hr/>' +
							'<div class="emailIDDropDown continueTeacher' + sub.subjectId + '">' +
								'<div class="custom-field" style="margin-bottom:0;">' +
									'<select name="assignContinueTeacherId" class="assignContinueTeacherId select-style form-control" style="font-size:11px" id="assignContinueTeacherId' + sub.subjectId + '">' +
										'<option value="">--Select--</option>' + buildLinkingTeacherOptions(sub) +
									'</select>' +
									'<label for="assignContinueTeacherId' + sub.subjectId + '">Continue Teacher</label>' +
								'</div>' +
							'</div>' +
						'</td>' +
						'<td style="text-align:center;">' +
							'<a href="javascript:void(0);" class="btn btn-primary btn-sm  mt-2 validateTeacherTime" onclick="validateTeacherTimeTableSchedule(\'' + batchEsc(sub.batchTeacherMappingId) + '\',\'' + sub.subjectId + '\',\'' + batchEsc(sub.assighnTId) + '\',\'' + sub.subjectId + '\',\'' + batchEsc(sub.subjectPId) + '\',\'' + batchId + '\',\'' + batchEsc(sub.standardId) + '\',\'' + batchJsArg(batchName) + '\',\'' + moduleId + '\');">Validate</a><br/>' +
							'<a href="javascript:void(0);" class="btn btn-primary btn-sm  mt-2 proceedClassbtn" onclick="validateBatchOutsideAvailabilityConfirmationModal(\'' + batchEsc(sub.batchTeacherMappingId) + '\',\'' + sub.subjectId + '\',\'' + batchEsc(sub.assighnTId) + '\',\'' + sub.subjectId + '\',\'' + batchEsc(sub.subjectPId) + '\',\'' + batchId + '\',\'' + batchEsc(sub.standardId) + '\',\'' + batchJsArg(batchName) + '\',\'' + moduleId + '\',\'' + batchJsArg(sub.subjectName) + '\')">Update</a><br/>' +
							'<a href="javascript:void(0);" class="btn btn-danger  btn-sm  mt-2" onclick="return showWarningMessage(\'Are you sure you want to delete subject?\', \'inactiveTeacherTimeTableSchedule(' + batchId + ',' + sub.subjectId + ',\\\'' + batchJsArg(batchName) + '\\\',' + sub.standardId + ',\\\'' + moduleId + '\\\')\');">Delete</a>' +
						'</td>' +
					'</tr>';
			}
			tableInner =
				'<input type="hidden" name="userId" id="userId" value="' + batchEsc(data.userId) + '" />' +
				'<input type="hidden" name="batchId" id="batchId" value="' + batchEsc(batchId) + '" />' +
				'<input type="hidden" name="batchStartDate" id="batchStartDate" value="' + batchEsc(data.startDate) + '" />' +
				'<input type="hidden" name="batchEndDate" id="batchEndDate" value="' + batchEsc(endDate) + '" />' +
				'<input type="hidden" name="needToAddTimePreferrence" id="needToAddTimePreferrence" value="" />' +
				'<input type="hidden" name="saveForcefully" id="saveForcefully" value="" />' +
				'<table class="table table-bordered table-striped border-radius-table font-12 nowrap mb-2" id="viewAssigTeacherLink" style="min-width:1100px;width:100%">' +
					'<thead class="position-sticky" style="top:0;left:0;z-index: 10;">' +
						'<tr class="bg-primary text-white"><th>S.No</th><th>Course Name</th><th>Assigned Teacher</th><th>Set Time</th><th class="text-center">Action</th></tr>' +
					'</thead>' +
					'<tbody>' + rows + '</tbody>' +
				'</table>';
		} else {
			tableInner = '<div> <h3 style="text-align: center; font-weight: bold"> No Teacher Assigned Yet </h3> </div>';
		}
		inner =
			'<div><span class="txt-danger" id="errorStartEnroll"></span></div>' +
			'<div class="text-center"><h6 style="color:var(--pc) !important; margin-top:0"><b>' + batchEsc(batchName) + ' (' + batchEsc(data.startDate) + ' - ' + batchEsc(endDate) + ')</b><br/>All timings mentioned below are in ' + batchEsc(data.timezoneValue) + ' timezone.</h6></div>' +
			'<div class="subjectTeacherTimeError text-center text-danger mb-2"></div>' +
			'<div class="table-responsive" style="max-height:400px">' + tableInner + '</div>' +
			'<div id="studentTeacherMappingLogContent" class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="padding:0;"></div>';
	}

	return '<div id="batchTeacherLinkingContent" class="custom-field-scope">' + inner + '</div>';
}

function buildLinkingOldTeachersHtml(sub, endDate, batchName, moduleId) {
	var list = sub.oldAssignteacherList || [];
	var html = '';
	for (var i = 0; i < list.length; i++) {
		var ot = list[i];
		if (!ot.assignedDate) { continue; }
		var removeLink = '';
		if ((i + 1) > 1 && i == list.length - 1) {
			removeLink = ' <a href="javascript:void(0);" onclick="showWarningMessage(\'Are you sure you want to remove teacher timings?\',\'removeTeacherTimeTable(' + ot.batchId + ',' + ot.subjectId + ',' + ot.teacherId + ',\\\'' + batchJsArg(ot.steachStartDate) + '\\\',\\\'' + batchJsArg(endDate) + '\\\',\\\'' + batchJsArg(batchName) + '\\\',' + ot.standardId + ',' + moduleId + ')\');">Remove</a>';
		}
		html += '<div><b>' + batchEsc(ot.teacherName) + ' (' + batchEsc(ot.emailId) + ')</b>' + removeLink + '</div>' +
			'<div>' + batchEsc(ot.assignedDate) + '</div>' +
			'<div>' + batchEsc(ot.scheduleTime) + '</div>';
	}
	return html;
}

function buildLinkingTeacherOptions(sub) {
	var list = sub.teacherList || [];
	var html = '';
	for (var i = 0; i < list.length; i++) {
		var t = list[i];
		var selected = (t.teacherId == sub.assighnTId) ? ' selected' : '';
		html += '<option value="' + t.teacherId + '"' + selected + '>' + batchEsc(t.teacherName) + ' (' + batchEsc(t.emailId) + ')</option>';
	}
	return html;
}

function buildLinkingDaysGridHtml(sub) {
	var days = sub.daysList || [];
	var slots = sub.timeTableList || [];
	var html = '';
	for (var i = 0; i < days.length; i++) {
		var d = days[i];
		var checked = (d.extra == d.key) ? ' checked' : '';
		var dataCheck = (d.extra == d.key) ? 'true' : 'false';
		var selectedTime = (d.extra2 ? d.extra2 : '') + '-' + (d.extra3 ? d.extra3 : '');
		var timeOptions = '<option value="">Select Time</option>';
		for (var j = 0; j < slots.length; j++) {
			var tt = slots[j];
			var sel = (d.extra2 == tt.startTime) ? 'selected' : '0';
			timeOptions += '<option value="' + batchEsc(tt.startTime) + '-' + batchEsc(tt.endTime) + '" ' + sel + '> ' + batchEsc(tt.startTime) + ' - ' + batchEsc(tt.endTime) + ' </option>';
		}
		html +=
			'<div class="col-md-6 col-sm-6 col-xs-12 mb-1">' +
				'<div class="teacher-mapping-set-time-item" style="display:flex;align-items:center;justify-content:space-between;border: 1px solid #e3e3e3; padding: 0 5px">' +
					'<span>' +
						'<input type="checkbox" class="teachDays" style="position:relative;top:2px;" name="teachDays' + sub.subjectId + '" value="' + batchEsc(d.key) + '" data-batchid="' + batchEsc(d.extra1) + '" id="teachDays' + sub.subjectId + batchEsc(d.key) + '"' + checked + ' onchange="checkUpdatesBatch(this,\'' + sub.subjectId + '\')" data-check="' + dataCheck + '"/>' +
						'<label>' + batchEsc(d.value) + '</label>' +
					'</span>' +
					'<span>' +
						'<select name="timeInterval" class="form-control time-selec2" style="font-size:11px;" id="timeInterval' + sub.subjectId + batchEsc(d.key) + '" data-selected-time="' + batchEsc(selectedTime) + '" onchange="checkUpdatesBatch(this,\'' + sub.subjectId + '\')">' + timeOptions + '</select>' +
					'</span>' +
				'</div>' +
			'</div>';
	}
	return html;
}

// Init block moved from BatchTeacherLinkingContent.jsp's $(document).ready.
function initBatchTeacherLinking(data) {
	$('.proceedClassbtn').hide();
	var startDate = data.startDate ? data.startDate : new Date();
	var endDate = data.endDate ? data.endDate : new Date();

	$('.inactive-tab a').on('click', function (e) {
		$.fn.dataTable.tables({ visible: true, api: true }).columns.adjust();
	});
	$('#modalMessage').on('click', function (e) {
		setTimeout(function () { $('body').addClass('modal-open'); }, 1000);
	});

	$(".teachStartDate").datepicker({ format: 'mm-dd-yyyy', autoclose: true, startDate: startDate, endDate: endDate });
	$(".teachEndDate").datepicker({ format: 'mm-dd-yyyy', autoclose: true, startDate: startDate, endDate: endDate });

	$('.switch .checkTeacher').on('click', function () {
		if ($(this).prop("checked") == true) {
			$(".continueTeacher" + $(this).attr("data-subjectid")).hide();
		} else {
			$(".continueTeacher" + $(this).attr("data-subjectid")).show();
		}
	});

	if (typeof $.fn.select2 === 'function') {
		var batchTeacherLinkingRoot = $('#batchTeacherLinkingContent');
		var batchTeacherLinkingModalBody = batchTeacherLinkingRoot.closest('.modal').find('.modal-body');
		var batchTeacherLinkingDropdownParent = batchTeacherLinkingModalBody.length > 0 ? batchTeacherLinkingModalBody : batchTeacherLinkingRoot;
		batchTeacherLinkingRoot.find('select').each(function () {
			var selectField = $(this);
			if (selectField.data('select2')) {
				selectField.select2('destroy');
			}
			selectField.select2({ theme: 'bootstrap4', dropdownParent: batchTeacherLinkingDropdownParent });
			var customField = selectField.closest('.custom-field');
			selectField.next('.select2-container').css({
				'width': '100%', 'min-height': '44px', 'position': 'relative', 'z-index': '1'
			}).find('.select2-selection--single').css({
				'height': '44px', 'min-height': '44px', 'padding': '0', 'display': 'flex', 'align-items': 'center'
			}).find('.select2-selection__rendered').css({
				'height': '42px', 'line-height': '42px', 'padding-top': '0', 'padding-bottom': '0'
			});
			if (customField.length > 0) {
				refreshBatchLinkingFieldState(selectField, customField);
				selectField.off('change.batchTeacherLinkingField select2:select.batchTeacherLinkingField select2:clear.batchTeacherLinkingField')
					.on('change.batchTeacherLinkingField select2:select.batchTeacherLinkingField select2:clear.batchTeacherLinkingField', function () {
						refreshBatchLinkingFieldState($(this), $(this).closest('.custom-field'));
					});
			}
		});
	}
}

function refreshBatchLinkingFieldState(selectField, customField) {
	var selectValue = selectField.val();
	if ($.isArray(selectValue)) {
		selectValue = selectValue.join('');
	}
	selectValue = selectValue == undefined || selectValue == null ? '' : selectValue.toString().trim();
	var hasSelectValue = selectValue !== '' && selectValue !== '0';
	customField.toggleClass('active has-value', hasSelectValue);
	selectField.next('.select2-container').find('.select2-selection__rendered').css('color', hasSelectValue ? '' : 'transparent');
	customField.find('label:not(.error-msg)').first().css(hasSelectValue ? {
		'top': '0', 'transform': 'translateY(-46%)', 'font-size': '12px', 'font-weight': '500',
		'z-index': '25', 'background': '#fff', 'padding': '0 8px', 'color': ''
	} : {
		'top': '48%', 'transform': 'translateY(-50%)', 'font-size': '16px', 'font-weight': '400',
		'z-index': '25', 'background': 'transparent', 'padding': '0 8px', 'color': '#9ca3af'
	});
}

function submitBatchSubjectTeacherAssign(formId, moduleId) {
	var subjectId = $("#subjectIds option:selected").val();
	var standardId = $("#subjectIds option:selected").attr('data-standardId');
	var batchId = $("#subjectIds option:selected").attr('data-studentId');
	var oldTeacherId = $("#subjectIds  option:selected").attr('data-assignId');
	var courseType = $("#subjectIds option:selected").attr('data-courseType');
	var subjectPId = $("#subjectIds option:selected").attr('data-subjectPId');

	hideMessageTheme2('');
	if (subjectId == 'Select Subject') {
		showMessageTheme2(0, "Please select subject to update.");
		$('#modalMessage').click(function () {
			setTimeout(function () { $('body').addClass('modal-open'); }, 1000);
		});
		return false;
	}
	if (!validateRequestBatchSubjectTeacherAssign(formId, moduleId, subjectId)) {
		$('#modalMessage').click(function () {
			setTimeout(function () { $('body').addClass('modal-open'); }, 1000);
		});
		return false;
	}
	$.ajax({
		type: "POST",
		contentType: APPLICATION_JSON_VALUE,
		url: getURLForHTML('dashboard', 'batch-teacher-assign-submit'),
		data: JSON.stringify(getRequestForBatchTeacherAssign(formId, moduleId, subjectId, standardId, batchId, oldTeacherId, courseType, subjectPId)),
		dataType: 'json',
		cache: false,
		timeout: 600000,
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessageTheme2(0, data['message']);
			} else {
				showMessageTheme2(1, "Batch Subject-teacher updated successfully.");
				$("#subjectIds").val(0);
				$("#teacherId").val(0);
			}
			return false;
		}
	});
}
function getRequestForBatchTeacherAssign(formId, moduleId, subjectId, standardId, batchId, oldTeacherId, courseType, subjectPId) {
	var request = {};
	var authentication = {};
	var batchTeacherSavedMappingDTO = {};
	var teacherId = $("#teacherId option:selected").val();
	batchTeacherSavedMappingDTO['subjectId'] = subjectId;
	batchTeacherSavedMappingDTO['teacherId'] = teacherId;
	batchTeacherSavedMappingDTO['standardId'] = standardId;
	batchTeacherSavedMappingDTO['subjectPId'] = subjectPId;

	batchTeacherSavedMappingDTO['batchId'] = batchId;//$(this).find("td.subjectIdcls").attr("data-studentId");
	batchTeacherSavedMappingDTO['oldTeacherId'] = oldTeacherId; //$(this).find("td.subjectIdcls").attr("data-assignId");
	batchTeacherSavedMappingDTO['courseType'] = courseType; //$(this).find("td.subjectIdcls").attr("data-courseType");
	//	});

	request['batchTeacherSavedMappingDTO'] = batchTeacherSavedMappingDTO;
	authentication['hash'] = getHash(); authentication['schoolId'] = SCHOOL_ID; authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = moduleId;
	authentication['userId'] = USER_ID;
	request['authentication'] = authentication;
	return request;
}

function validateRequestBatchSubjectTeacherAssign(formId, moduleId, subjectId) {
	var teacherId = $("#teacherId option:selected").val();
	if (teacherId == 0 || teacherId == undefined) {
		showMessageTheme2(0, 'Please Select a teacher to update.');
		return false;
	}
	return true;
}

function advanceBatchStudentSearch(formId, moduleId) {
	hideMessageTheme2('');
	$.ajax({
		type: "POST",
		contentType: APPLICATION_JSON_VALUE,
		url: getURLForHTML('dashboard', 'assigned-batch-student-search-content'),
		data: JSON.stringify(getCallRequestForBatchStudentSearch(formId, moduleId)),
		dataType: 'html',
		async: false,
		success: function (htmlContent) {
			if (htmlContent != "") {
				var stringMessage = [];
				stringMessage = htmlContent.split("|");
				if (stringMessage[0] == "FAILED" || stringMessage[0] == "EXCEPTION" || stringMessage[0] == "SESSIONOUT") {
					if (stringMessage[0] == "SESSIONOUT") {
						redirectLoginPage();
					} else {
						showMessageTheme2(0, stringMessage[1]);
					}
				} else {
					$('#advBatchStudentSearch').modal('hide');
					$('#advance-search-content').html(htmlContent);
				}
				return false;
			}
		}
	});
}

function getCallRequestForBatchStudentSearch(formId, moduleId) {
	var requestTranscriptSearch = {};
	var authentication = {};
	var batchStudentSearchDTO = {};
	batchStudentSearchDTO['moduleId'] = moduleId;
	batchStudentSearchDTO['gradeId'] = $("#" + formId + " #gradeId").select2('val');
	batchStudentSearchDTO['studentName'] = $("#" + formId + " #studentName").val().trim();
	batchStudentSearchDTO['studentSubject'] = $("#" + formId + " #studentSubject").select2('val');
	batchStudentSearchDTO['sortBy'] = $("#" + formId + " #sortBy").select2('val');
	batchStudentSearchDTO['startPosition'] = $("#" + formId + " #startPosition").val().trim();
	batchStudentSearchDTO['numberOfRecords'] = $("#" + formId + " #numberOfRecords").val().trim();
	batchStudentSearchDTO['schoolUUID'] = SCHOOL_UUID;
	batchStudentSearchDTO['schoolId'] = SCHOOL_ID;

	requestTranscriptSearch['batchStudentSearchDTO'] = batchStudentSearchDTO;
	authentication['hash'] = getHash();
	authentication['userType'] = "SCHOOL";
	authentication['schoolId'] = SCHOOL_ID;
	authentication['schoolUUID'] = SCHOOL_UUID;
	requestTranscriptSearch['authentication'] = authentication;

	return requestTranscriptSearch;

}

function batchStudentSearchReset(formId) {
	$("#" + formId + " #gradeId").val('').trigger('change');
	$("#" + formId + " #studentName").val('');
	$("#" + formId + " #studentSubject").val('');
	$("#" + formId + " #sortBy").val('DESC').trigger('change');
	$("#" + formId + " #startPosition").val('0');
	$("#" + formId + " #numberOfRecords").val('25');
}

function validateTeacherTimeTableSchedule(batchTeacherMappingId, subjectId, teacherId, elementId, subjectPId, batchId, standardId, batchName, roleModuleId) {
	$("#needToAddTimePreferrence").val(false);
	if (!validateRequestBatchSubjectTeacherTime(subjectId, elementId)) {
		return false;
	}
	if (batchId == null || batchId == 0 || batchId === '') {
		showMessageTheme2(0, 'Invalid batch. Please select a valid batch.');
		return false;
	}
	$.ajax({
		type: "POST",
		contentType: APPLICATION_JSON_VALUE,
		url: getURLForHTML('dashboard', 'validate-teacher-batch-time-schedule'),
		data: JSON.stringify(getRequestForBatchTeacherTime(batchTeacherMappingId, subjectId, teacherId, elementId, subjectPId, batchId)),
		dataType: 'json',
		cache: false,
		//timeout : 600000,
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessageTheme2(0, data['message']);
				$("#viewBatch-" + subjectId + " .proceedClassbtn").show();
			} else {
				$(".teacher-mapping-set-time-" + subjectId + " .teacher-mapping-set-time-item").each(function (key) {
					var teachStartDate = $("#batch-schedule" + subjectId + " .teachStartDate").val();
					var teachEndDate = $("#batch-schedule" + subjectId + " .teachEndDate ").val();
					var dayCheckValue = $(this).find(".teachDays").prop("checked");
					var timeInterval = $(this).find("#timeInterval" + subjectId + (key + 1)).val();
					teacherMappingSetTime.push(new Object({ "startDate": teachStartDate, "endDate": teachEndDate, "dayValue": dayCheckValue, "timeInterval": timeInterval }));
				});
				console.log(teacherMappingSetTime);
				//teacherMappingSetTime
				var saveForcefully= data['saveForcefully'];
				var recurringclassForAA = data['recurringClassListForAvailability'];
				$("#availaibilityHeading").hide();
				if(recurringclassForAA.length>0){
					$("#availaibilityHeading").show();
					$("#needToAddTimePreferrence").val(true);
					$("#teacherAvailabilityTable").show();
					var html='';
					for(var k=0; k < recurringclassForAA.length; k++){
						html+=`<tr class='text-danger'>
								<td>`+recurringclassForAA[k]['meetingDate']+`</td>
								<td>`+recurringclassForAA[k]['teacherTime']+`</td>
								<td>`+recurringclassForAA[k]['slotAvailableReason']+`</td>
							</tr>`;
					}
					$("#teacherAvailabilityTable #teacherAvailabilityTbody").html(html);
					$("#viewBatch-" + subjectId + " .proceedClassbtn").hide();
					$("#recurringClassShowModel").modal('show');
				}else{
					$("#recurringClassShowModel").modal('hide');
					$("#teacherAvailabilityTable").hide();
					$("#needToAddTimePreferrence").val(false);
					$("#recurringClassShowModelValidation").modal('show');
				}
				if(saveForcefully=='Y'){
					$("#viewBatch-" + subjectId + " .proceedClassbtn").show();
				}
				$("#saveForcefully").val(saveForcefully);
				var recurringclass = data['recurringClassList'];
				var htmlRecu = "";
				var inc = 1;
				var validateClass = true;
				for (var i = 0; i < recurringclass.length; i++) {
					if (recurringclass[i]['slotAvailable'] != 'Available' || recurringclass[i]['slotAvailableBatch'] != 'Available') {
						htmlRecu = htmlRecu + "<tr class='text-danger'>";
					} else {
						htmlRecu = htmlRecu + "<tr>";
					}
					htmlRecu = htmlRecu + " <td>" + (inc++) + "</td>";

					htmlRecu = htmlRecu + " <td>" + recurringclass[i]['subjects'] + "</td>";
					htmlRecu = htmlRecu + " <td>" + recurringclass[i]['teachName'] + "</td>";

					htmlRecu = htmlRecu + " <td>" + recurringclass[i]['teacherTime'] + "</td>";
					if (recurringclass[i]['slotAvailableBatch'] != 'Available') {
						htmlRecu = htmlRecu + " <td>" + recurringclass[i]['slotAvailableBatch'] + "</td>";
					} else {
						htmlRecu = htmlRecu + " <td>" + recurringclass[i]['slotAvailable'] + "</td>";
					}
					if (recurringclass[i]['slotAvailableBatch'] != 'Available') {
						htmlRecu = htmlRecu + " <td>" + recurringclass[i]['reason'] + "</td>";
					} else {
						htmlRecu = htmlRecu + " <td>" + recurringclass[i]['studentName'] + "</td>";
					}
					htmlRecu = htmlRecu + "</tr>";
					if (recurringclass[i]['slotAvailable'] != 'Available' || recurringclass[i]['slotAvailableBatch'] != 'Available') {
						validateClass = false;
					}
				}
				if (validateClass && $("#needToAddTimePreferrence").val() != "true") {
					$("#viewBatch-" + subjectId + " .proceedClassbtn").show();
				} else {
					$("#viewBatch-" + subjectId + " .proceedClassbtn").hide();
				}
				$("#trRecurring").html(htmlRecu);
				flag_Change_Batch_Start_And_EndDate=false;				
			}

		}
	});
}

function checkUpdatesBatch(src, subjectId) {
	var updatedTeacherMappingSetTime = [];
	var prevTeacherMappingSetTime = []
	$(".teacher-mapping-set-time-" + subjectId + " .teacher-mapping-set-time-item").each(function (key) {
		var PteachStartDate = $("#batch-schedule" + subjectId + " .teachStartDate").attr("data-date-start");
		var PteachEndDate = $("#batch-schedule" + subjectId + " .teachEndDate ").attr("data-date-end");
		var PdayCheckValue = $(this).find("#teachDays" + subjectId + (key + 1)).attr("data-check") == "true" ? true : false;
		var PtimeInterval = $(this).find("#timeInterval" + subjectId + (key + 1)).attr("data-selected-time") == "-" ? "" : $(this).find("#timeInterval" + subjectId + (key + 1)).attr("data-selected-time");
		prevTeacherMappingSetTime.push(new Object({ "startDate": PteachStartDate, "endDate": PteachEndDate, "dayValue": PdayCheckValue, "timeInterval": PtimeInterval }));
	});
	$(".teacher-mapping-set-time-" + subjectId + " .teacher-mapping-set-time-item").each(function (key) {
		var teachStartDate = $("#batch-schedule" + subjectId + " .teachStartDate").val();
		var teachEndDate = $("#batch-schedule" + subjectId + " .teachEndDate ").val();
		var dayCheckValue = $(this).find(".teachDays").prop("checked");
		var timeInterval = $(this).find("#timeInterval" + subjectId + (key + 1)).val();
		updatedTeacherMappingSetTime.push(new Object({ "startDate": teachStartDate, "endDate": teachEndDate, "dayValue": dayCheckValue, "timeInterval": timeInterval }));
	});
	if (JSON.stringify(updatedTeacherMappingSetTime) === JSON.stringify(prevTeacherMappingSetTime)) {
		$("#viewBatch-" + subjectId + " .validateTeacherTime").show();
		// $("#viewBatch-"+subjectId+ " .proceedClassbtn").show();
	} else {
		$("#viewBatch-" + subjectId + " .proceedClassbtn").hide();
		$("#viewBatch-" + subjectId + " .validateTeacherTime").show();

	}
	console.log(updatedTeacherMappingSetTime);
	console.log(prevTeacherMappingSetTime);
}

function validateBatchOutsideAvailabilityConfirmationModal(batchTeacherMappingId, subjectId, teacherId, elementId, subjectPId, batchId, standardId, batchName, roleModuleId, subjectName){
	$(".subjectTeacherTimeError").text('');
	hideMessageTheme2('');
	if (!validateRequestBatchSubjectTeacherTime(subjectId, elementId)) {
		return false;
	}
	$("#booksclassOutsideAvailabilityConfirmationModal").modal("show");
	if(batchName != undefined && batchName != ""){
		$("#studentBatchName").text(batchName);
	}
	if(subjectName != undefined && subjectName != ""){
		$("#courseActivity").text(subjectName);
	}
	var fun = "updateTeacherTimeTableSchedule('"+batchTeacherMappingId+"', '"+subjectId+"', '"+teacherId+"', '"+elementId+"', '"+subjectPId+"', '"+batchId+"', '"+standardId+"', '"+batchName+"', '"+roleModuleId+"');";
	$("#updateTeacherTimeTableScheduleBtn").attr("onclick", fun)
	var needToAddTimePref = $("#needToAddTimePreferrence").val();
	var saveForcefully = $("#saveForcefully").val();
	if(needToAddTimePref=='true'){
		$("#updateTeacherTimeTableScheduleBtn").hide();
	}else{
		$("#updateTeacherTimeTableScheduleBtn").show();
	}
	if(saveForcefully=='Y'){
		$("#updateTeacherTimeTableScheduleBtn").show();
	}
}

function updateTeacherTimeTableSchedule(batchTeacherMappingId, subjectId, teacherId, elementId, subjectPId, batchId, standardId, batchName, roleModuleId) {
	$.ajax({
		type: "POST",
		contentType: APPLICATION_JSON_VALUE,
		url: getURLForHTML('dashboard', 'update-teacher-batch-time-schedule'),
		data: JSON.stringify(getRequestForBatchTeacherTime(batchTeacherMappingId, subjectId, teacherId, elementId, subjectPId)),
		dataType: 'json',
		cache: false,
		//timeout : 600000,
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessageTheme2(0, data['message']);
			} else {
				showMessageTheme2(1, "Teacher time updated successfully.");
				$("#booksclassOutsideAvailabilityConfirmationModal").modal("hide");
				$('#batchSubjectTeacherMappingModel').modal('hide');
				setTimeout(function () { callBatchSubjectAndTeacherMapping('formId', batchId, batchName, standardId, 'View', roleModuleId); }, 1000);
				//setTimeout(function(){$('#batchSubjectTeacherMappingModel').modal('hide'); },1000);
				flag_Change_Batch_Start_And_EndDate=true;
			}
			return false;
		}
	});
}

function validateRequestBatchSubjectTeacherTime(subjectId, elementId) {
	console.log('stdate');
	if ($("#startDate" + elementId).val() == undefined || $("#startDate" + elementId).val() == '') {
		//showMessageTheme2(0, 'Please enter start date.');
		showMessageTheme2(0, 'Please enter start date.');
		return false;
	}
	if ($("#endDate" + elementId).val() == undefined || $("#endDate" + elementId).val() == '') {
		//showMessageTheme2(0, 'Please enter end date.');
		showMessageTheme2(0, 'Please enter end date.');
		return false;
	}

	var stDate = $("#startDate" + elementId).val();
	var edDate = $("#endDate" + elementId).val();
	if (new Date(stDate) > new Date(edDate)) {
		showMessageTheme2(0, 'End date should be greater than start date.');
		return false;
	}

	var timeDays = [];
	var i = 0;
	$("input:checkbox[name=teachDays" + elementId + "]:checked").each(function () {
		if ($(this).val() == '') {
			showMessageTheme2(0, 'Please choose day.');
			i = 1;
		}
		if ($("#timeInterval" + subjectId + "" + $(this).val()).val() == '') {
			//showMessageTheme2(0, 'Please choose time schedule.');
			showMessageTheme2(0, 'Please choose time schedule.');
			i = 1;
		}

		//		var result = teacherTimeCheck($("#timeInterval"+subjectId+""+$(this).val()).val(), elementId, $(this).val());
		//		console.log(result);
		//		if(result===false){
		//			$(".subjectTeacherTimeError").text('Selected time already schedule');
		//			i=1;
		//		}

		timeDays.push($("#timeInterval" + subjectId + "" + $(this).val()).val());
	});
	if (i > 0) {
		showMessageTheme2(0, 'Please choose time schedule.');
		return false;
	}
	if (timeDays.length === 0) {
		showMessageTheme2(0, 'Please choose time schedule.');
		return false;
	}
	return true;
}

function getRequestForBatchTeacherTime(batchTeacherMappingId, subjectId, teacherId, elementId, subjectPId, batchId) {
	console.log(batchTeacherMappingId);
	var request = {};
	var authentication = {};
	var batchTeacherMappingDTO = {}
	var batchTeacherSavedMappingDTO = [];
	var daysIds = "";
	var is = 0;
	batchTeacherMappingDTO['firstBatchTeacherMappingId'] = batchTeacherMappingId;
	batchTeacherMappingDTO['batchStartDate'] = $("#batchStartDate").val();
	batchTeacherMappingDTO['batchEndDate'] = $("#batchEndDate").val();
	batchTeacherMappingDTO['batchId'] = batchId;
	batchTeacherMappingDTO['subjectId'] = subjectId;
	batchTeacherMappingDTO['subjectPId'] = subjectPId;
	batchTeacherMappingDTO['oldTeacherId'] = teacherId;
	batchTeacherMappingDTO['newTeacherId'] = $("#assignTeacherId" + elementId).val();
	batchTeacherMappingDTO['steachStartDate'] = $("#startDate" + elementId).val();
	batchTeacherMappingDTO['steachEndDate'] = $("#endDate" + elementId).val();
	if ($("#checkTeacher" + elementId).is(":checked")) {
		batchTeacherMappingDTO['teacherCountinueCheck'] = "Y";
	} else {
		batchTeacherMappingDTO['teacherCountinueCheck'] = "N";
		batchTeacherMappingDTO['continueTeacherId'] = $("#assignContinueTeacherId" + elementId).val();
	}


	$("input:checkbox[name=teachDays" + elementId + "]:checked").each(function () {
		var batchTeacherSavedMapping = {};
		batchTeacherSavedMapping['batchTeacherMappingId'] = $(this).attr("data-batchid");
		batchTeacherSavedMapping['dayId'] = $(this).val();
		batchTeacherSavedMapping['scheduleTime'] = $("#timeInterval" + subjectId + "" + $(this).val()).val();
		batchTeacherSavedMappingDTO.push(batchTeacherSavedMapping);
		is = is + 1;
	});
	batchTeacherMappingDTO['batchTeacherSavedMappingList'] = batchTeacherSavedMappingDTO;
	request['batchTeacherMapping'] = batchTeacherMappingDTO;
	authentication['hash'] = getHash(); authentication['schoolId'] = SCHOOL_ID; authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = moduleId;
	authentication['userId'] = USER_ID
	request['authentication'] = authentication;
	return request;
}

function changeTeacherTime(id, teacherId, elementId) {
	$("#startDate" + elementId).val('');
	$("#endDate" + elementId).val('');
}

// JS-rendered replacement for the MoveBatchStudents.jsp fragment: fetches JSON from
// /dashboard/move-student-batch-data via callCommonAjax and builds the modal client-side.
// Signature unchanged. controllType 'Delete' still deletes server-side (inside the endpoint's
// getBatchStudentData call) then reloads the list, exactly as before.
async function callStudentBatchTransfer(formId, batchId, batchName, standardId, controllType, moduleId, userId) {
	hideMessageTheme2('');
	var ajaxReqDetails = {
		method: "POST",
		url: getURLForHTML('dashboard', 'move-student-batch-data'),
		body: {
			batchId: batchId,
			standardId: standardId,
			controllType: controllType,
			batchName: batchName,
			moduleId: moduleId,
		},
		global: true,
		showMessage: false,
	};
	var data = await callCommonAjax(ajaxReqDetails);
	$('#batchSubjectTeacherSupportContent').html('');
	if (!data || data.status != "1") {
		showMessageTheme2(0, (data && data.message) ? data.message : "Unable to load classroom students. Please try again.");
		return false;
	}
	if (controllType == 'Delete') {
		setTimeout(function () { callDashboardPageSchool(moduleId, 'manage-batch-student'); }, 1000);
		showMessageTheme2(1, 'Batch deleted successfully.');
		return false;
	}
	$('#batchSubjectTeacherSupportContent').html(getMoveBatchStudentsHtml(data));
	initMoveBatchStudents(data);
	return false;
}

// Client render of MoveBatchStudents.jsp from the JSON payload. Branches on controllType:
// Add / Move / Extra Class share the "select students" layout; Edit shows the full batch
// edit form plus the student & teacher tables.
function getMoveBatchStudentsHtml(data) {
	var controllType = data.controllType;
	var isEdit = controllType == 'Edit';
	var batchName = data.batchName || "";
	var batchId = data.batchId;
	var moduleId = data.moduleId;
	var stlStandardId = data.stlStandardId;

	var title;
	if (controllType == 'Move') { title = 'Move Student to Another Batch'; }
	else if (controllType == 'Add') { title = 'Add Student to ' + batchEsc(batchName); }
	else if (controllType == 'Edit') { title = 'Update ' + batchEsc(batchName); }
	else { title = 'Join Extra Classes Batch'; }

	var formFields;
	if (!isEdit) {
		var transferBatch = '';
		if (controllType != 'Add') {
			var opts = '<option value="0"> Select Batch</option>';
			if (data.batchList) {
				for (var i = 0; i < data.batchList.length; i++) {
					opts += '<option value="' + data.batchList[i].id + '">' + batchEsc(data.batchList[i].batchName) + '</option>';
				}
			}
			var moveLabel = (controllType == 'Move') ? 'Move To' : 'Join Batch';
			transferBatch =
				'<div class="col-md-6 col-sm-12 mb-2 mt-2 custom-field">' +
					'<select id="tansferBatch" name="tansferBatch" class="select-style form-control">' + opts + '</select>' +
					'<label>' + moveLabel + '</label>' +
				'</div>';
		}
		formFields =
			'<div class="col-md-12 col-sm-12 mb-2">' +
				'<div class="row">' +
					'<div class="col-md-6 col-sm-12 mb-2 mt-2 custom-field">' +
						'<input class="form-control" type="text" name="batchName" id="batchName" placeholder=" " value="' + batchEsc(data.stlBatchName) + '" disabled/>' +
						'<label>Batch Name</label>' +
					'</div>' + transferBatch +
				'</div>' +
			'</div>';
	} else {
		formFields = getMoveBatchEditFieldsHtml(data);
	}

	var studentsHeading = isEdit ? '<div class="col-md-12 col-sm-12 col-xs-12"><h5 class="text-primary font-weight-bold">Students Details</h5></div>' : '';

	var studentRows = '';
	if (data.students) {
		for (var s = 0; s < data.students.length; s++) {
			studentRows += buildMoveStudentRowHtml(data.students[s], s + 1, isEdit, batchId, batchName, moduleId, stlStandardId);
		}
	}
	var studentHead =
		'<tr>' +
			'<th class="text-center font-weight-bold">' + (isEdit ? ' S.No.' : 'Select Student') + '</th>' +
			'<th class="text-center font-weight-bold">' + batchEsc(data.meetingVendor) + ' Status</th>' +
			'<th class="text-center font-weight-bold">Student Name</th>' +
			'<th class="text-center font-weight-bold">Student Id</th>' +
			'<th class="text-center font-weight-bold">Student Email</th>' +
			(isEdit ? '<th class="">Send Mail</th><th class="">Action</th>' : '') +
		'</tr>';
	var studentTable =
		'<table class="table table-bordered w-100" id="moveStudentBatch">' +
			'<thead>' + studentHead + '</thead>' +
			'<tbody>' + studentRows + '</tbody>' +
		'</table>';

	var teacherSection = '';
	var sendMailAllStudents = '';
	if (isEdit) {
		sendMailAllStudents = '<button type="button" class="btn btn-primary" onclick="return sendMailStudentMoveBatch(\'batchMoveForm\',\'STUDENT\',\'' + batchId + '\',\'\',\'SendToAll\');">Send Mail to All Students</button>';
		var teacherRows = '';
		if (data.teachers) {
			for (var t = 0; t < data.teachers.length; t++) {
				teacherRows += buildMoveTeacherRowHtml(data.teachers[t], t + 1, batchId);
			}
		}
		teacherSection =
			'<br/><br/><h5 class="text-primary font-weight-bold">Teacher Details</h5>' +
			'<table class="table table-bordered w-100" id="moveTeacherBatch">' +
				'<thead>' +
					'<tr><th class="text-center font-weight-bold">S.No.</th><th class="text-center font-weight-bold">Teacher Name</th><th class="text-center font-weight-bold">Application No</th><th class="text-center font-weight-bold">Teacher Email</th><th class="">Send Mail</th></tr>' +
				'</thead>' +
				'<tbody>' + teacherRows + '</tbody>' +
			'</table>' +
			'<button type="button" class="btn btn-primary" onclick="return sendMailTeacherMoveBatch(\'batchMoveForm\',\'TEACHER\',\'' + batchId + '\',\'\', \'\',\'SendToAll\');">Send Mail to All Teachers</button>';
	}

	var footer;
	if (!isEdit) {
		var btnLabel = (controllType == 'Move') ? 'Move' : (controllType == 'Add' ? 'Add' : 'Join');
		footer = '<button type="button" class="btn btn-primary" onclick="return transferStudent(\'batchMoveForm\',\'STUDENT\',\'' + moduleId + '\',\'' + batchEsc(controllType) + '\');">' + btnLabel + '</button>';
	} else {
		footer = '<button type="button" class="btn btn-primary" onclick="return editBatchDetails(\'batchMoveForm\',\'STUDENT\',\'' + moduleId + '\');">Update</button>';
	}

	return '' +
	'<div class="modal fade" id="batchStudentTransferModel" role="dialog" aria-labelledby="subjectTeacherMappingModalLabel">' +
		'<div class="modal-dialog modal-xl" role="document">' +
			'<div class="modal-content">' +
				'<form name="batchMoveForm" id="batchMoveForm" class="custom-field-scope" action="javascript:void(0);">' +
					'<div class="modal-header py-2 bg-primary text-white">' +
						'<h5 class="modal-title" id="subjectTeacherMappingModalLabel">' + title + '</h5>' +
						'<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
					'</div>' +
					'<div class="modal-body overflow-auto">' +
						'<div class="w-100 overflow-auto">' +
							'<input type="hidden" name="userId" id="userId" value="' + batchEsc(data.userId) + '" />' +
							'<input type="hidden" class="form-control" id="batchId" name="batchId" value="' + batchEsc(data.stlBatchId) + '" />' +
							'<input type="hidden" class="form-control" id="standardId" name="standardId" value="' + batchEsc(data.stlStandardId) + '" />' +
							'<input type="hidden" class="form-control" id="batchName" name="batchName" value="' + batchEsc(data.stlBatchName) + '"/>' +
							'<input type="hidden" class="form-control" id="selectStudentIds" name="selectStudentIds" />' +
							'<input type="hidden" class="form-control" id="selectStudentIdsForMail" name="selectStudentIdsForMail" />' +
							'<input type="hidden" class="form-control" id="selectTeacherIdsForMail" name="selectTeacherIdsForMial" />' +
							'<div class="col-md-12 text-center"><p class="text-center m-0 mt-2 font-size-md" id="modalMessageNew"></p></div>' +
							'<div class="row">' + formFields + '</div>' +
							studentsHeading +
							studentTable +
							(isEdit ? sendMailAllStudents : '') +
							teacherSection +
						'</div>' +
						'<div id="studentTeacherLinkingContent" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 p-0"></div>' +
					'</div>' +
					'<div class="modal-footer">' + footer + '</div>' +
				'</form>' +
			'</div>' +
		'</div>' +
	'</div>';
}

function getMoveBatchEditFieldsHtml(data) {
	var hoursOptions = '<option value=""></option>';
	for (var h = 1; h <= 23; h++) {
		var hv = h > 9 ? String(h) : '0' + h;
		hoursOptions += '<option value="' + hv + '"' + (Number(data.timeHrsFrom) === h ? ' selected' : '') + '>' + hv + '</option>';
	}
	var minOptions = '<option value=""></option>';
	for (var m = 0; m <= 59; m += 5) {
		var mv = m > 9 ? String(m) : '0' + m;
		minOptions += '<option value="' + mv + '"' + (Number(data.timeMinFrom) === m ? ' selected' : '') + '>' + mv + '</option>';
	}
	var durationOptions = '<option value="">Please select batch duration</option>';
	for (var d = 1; d <= 12; d++) {
		durationOptions += '<option value="' + d + '"' + (data.batchDuration == d ? ' selected' : '') + '>' + d + (d === 1 ? ' Hour' : ' Hours') + '</option>';
	}
	var intervalOptions = '<option value="0">Please select Buffer Time</option>';
	[5, 10, 15, 20, 25, 30].forEach(function (v) {
		intervalOptions += '<option value="' + v + '"' + (data.timeInterval == v ? ' selected' : '0') + '>' + v + ' Minutes</option>';
	});
	var vendorSelect;
	if (SCHOOL_ID == 1) {
		vendorSelect = '<select class="form-control" name="meetingVendor" id="meetingVendor"><option value="LENS"' + (data.meetingVendor == 'LENS' ? ' selected' : '') + '>LENS</option></select>';
	} else {
		vendorSelect = '<select disabled class="form-control" name="meetingVendor" id="meetingVendor"><option value="External"' + (data.meetingVendor == 'External' ? ' selected' : '') + '>External</option></select>';
	}
	var joiningOptions = '<option value="Single"' + (data.joiningType == 'Single' ? ' selected' : '') + '>Single</option>' +
		'<option value="Multiple"' + (data.joiningType == 'Multiple' ? ' selected' : '') + '>Multiple</option>';

	return '' +
		'<div class="col-md-3 col-sm-12 col-xs-12"><div class="form-group custom-field">' +
			'<input type="text" class="form-control" id="batchNameEdit" name="batchNameEdit" placeholder=" " onkeydown="return M.isAddressLine(event);" value="' + batchEsc(data.stlBatchName) + '"/><label>Batch Name </label></div></div>' +
		'<div class="col-md-3 col-sm-12 col-xs-12"><div class="form-group custom-field">' +
			'<input type="text" class="form-control" id="batchStartDate" name="batchStartDate" placeholder=" " value="' + batchEsc(data.batchStartDate) + '" readonly onkeydown="return false" /><label>Start Date</label></div></div>' +
		'<div class="col-md-3 col-sm-12 col-xs-12"><div class="form-group custom-field">' +
			'<input type="text" class="form-control" id="batchEndDate" name="batchEndDate" placeholder=" " value="' + batchEsc(data.batchEndDate) + '" readonly onkeydown="return false" /><label>End Date</label></div></div>' +
		'<div class="col-md-3 col-sm-12 col-xs-12"><div class="form-group custom-field">' +
			'<input type="text" class="form-control" id="batchHolidayDate" name="batchHolidayDate" placeholder=" " value="' + batchEsc(data.batchHolidayDate) + '" readonly onkeydown="return false" /><label>Blackout Date</label></div></div>' +
		'<div class="col-md-3 col-sm-6 col-xs-12"><div class="form-group"><div class="position-relative w-100"><div class="row mx-n1">' +
			'<div class="col-5 px-1 custom-field"><select id="timeHrsFrom" name="timeHrsFrom" class="form-control" onchange="getTimeFrom(this.value);">' + hoursOptions + '</select><label>Hour</label></div>' +
			'<div class="col-2 px-1 d-flex align-items-center justify-content-center mb-4"><span>:</span></div>' +
			'<div class="col-5 px-1 custom-field"><select id="timeMinFrom" name="timeMinFrom" class="form-control">' + minOptions + '</select><label>Minute</label></div>' +
		'</div></div></div></div>' +
		'<div class="col-md-3 col-sm-6 col-xs-12"><div class="form-group custom-field">' +
			'<select class="form-control" name="batchDuration" id="batchDuration">' + durationOptions + '</select><label>Batch Duration (in Hours)</label></div></div>' +
		'<div class="col-md-3 col-sm-6 col-xs-12"><div class="form-group custom-field">' +
			'<input type="text" class="form-control" id="batchPeriodTime" name="batchPeriodTime" placeholder=" " onkeydown="return M.digit(event);" value="' + batchEsc(data.periodTime) + '" /><label>Period Time (In Minutes)</label></div></div>' +
		'<div class="col-md-3 col-sm-6 col-xs-12"><div class="form-group custom-field">' +
			'<select class="form-control" name="timeInterval" id="timeInterval">' + intervalOptions + '</select><label>Buffer Time Between Two Periods</label></div></div>' +
		'<div class="col-md-2 col-sm-12 col-xs-12"><div class="form-group custom-field">' +
			'<input type="text" class="form-control" id="batchSession" name="batchSession" placeholder=" " value="' + batchEsc(data.sessionName) + '" disabled/><label>Session</label></div></div>' +
		'<div class="col-md-2 col-sm-12 col-xs-12"><div class="form-group custom-field">' + vendorSelect + '<label>Meeting Vendor</label></div></div>' +
		'<div class="col-md-2 col-sm-12 col-xs-12"><div class="form-group custom-field">' +
			'<select class="form-control" name="joiningType" id="joiningType" disabled>' + joiningOptions + '</select><label>Joining Type</label></div></div>';
}

function buildMoveStudentRowHtml(student, incRow, isEdit, batchId, batchName, moduleId, standardId) {
	var firstCell = isEdit
		? '<input type="hidden" name="checkStudentId" class="checkStudentname" value="' + student.studentId + '">' + incRow
		: '<input type="checkbox" name="checkStudentId" class="checkStudentname" value="' + student.studentId + '">';
	var editCells = '';
	if (isEdit) {
		var removeCall = "studentRemoveFromBatch(\\'formId\\'," + moduleId + "," + batchId + "," + student.studentId + ",\\'" + batchJsArg(batchName) + "\\'," + standardId + ")";
		editCells =
			'<td><a href="javascript:void(0);" onclick="return sendMailStudentMoveBatch(\'batchMoveForm\',\'STUDENT\',\'' + batchId + '\',\'' + student.studentId + '\',\'SendToOne\');"><i class="fa fa-envelope"></i></a></td>' +
			'<td><a href="javascript:void(0);" class="dropdown-item" onclick="return showWarningMessage(\'Are you sure you want to remove student?\', \'' + removeCall + '\');"><i class="fa fa-trash"></i>&nbsp;&nbsp;</a></td>';
	}
	return '<tr class="subjectTeacherAssignTime" data-id="' + student.studentId + incRow + '">' +
		'<td class="text-center">' + firstCell + '</td>' +
		'<td class="text-center" id="zoomStatus_' + student.userId + '">' + batchEsc(student.zoomStatus) + ' </td>' +
		'<td class="text-center">' + batchEsc(student.studentName) + ' </td>' +
		'<td class="text-center">' + batchEsc(student.studentStringId) + ' </td>' +
		'<td class="text-center">' + batchEsc(student.studentEmail) + '<br/>' + batchEsc(student.countryTimeZone) + ' </td>' +
		editCells +
		'</tr>';
}

function buildMoveTeacherRowHtml(teacher, incRow, batchId) {
	return '<tr class="subjectTeacherAssignTime" data-id="' + teacher.userId + incRow + '">' +
		'<td class="text-center"><input type="hidden" name="checkTeacherId" class="checkTeachername" value="' + teacher.teacherId + '">' + incRow + '</td>' +
		'<td class="text-center">' + batchEsc(teacher.fullName) + '</td>' +
		'<td class="text-center">' + batchEsc(teacher.applicationNo) + '</td>' +
		'<td class="text-center">' + batchEsc(teacher.email) + ' <br> ' + batchEsc(teacher.timezone) + '</td>' +
		'<td><a href="javascript:void(0);" onclick="return sendMailTeacherMoveBatch(\'batchMoveForm\',\'TEACHER\',\'' + batchId + '\',\'' + teacher.teacherId + '\', \'' + teacher.userId + '\',\'SendToOne\');"><i class="fa fa-envelope"></i></a></td>' +
		'</tr>';
}

// Init block moved from MoveBatchStudents.jsp's $(document).ready.
function initMoveBatchStudents(data) {
	$('#batchStudentTransferModel').modal('show');
	$('#batchMoveForm select').select2({ width: '100%', dropdownParent: $('#batchStudentTransferModel') });
	if (typeof refreshCustomFieldState === 'function') {
		refreshCustomFieldState('#batchMoveForm');
	}
	var startDate = new Date();
	$('#batchStartDate').datepicker({ autoclose: true, format: 'mm-dd-yyyy', startDate: startDate });
	$('#batchEndDate').datepicker({ autoclose: true, format: 'mm-dd-yyyy', startDate: startDate });
	$("#batchHolidayDate").datepicker({ format: 'mm-dd-yyyy', startDate: startDate, multidate: true });

	if (data.controllType != 'Edit') {
		var studentIds = "";
		$('#moveStudentBatch > tbody  > tr').each(function () {
			studentIds = studentIds + $(this).find(".checkStudentname").val() + ',';
		});
		$("#selectStudentIdsForMail").val(studentIds.substring(0, studentIds.length - 1));

		var teacherIds = "";
		$('#moveTeacherBatch > tbody  > tr').each(function () {
			teacherIds = teacherIds + $(this).find(".checkTeachername").val() + ',';
		});
		$("#selectTeacherIdsForMail").val(teacherIds.substring(0, teacherIds.length - 1));
	}
}

// JS-rendered replacement for the BatchExamSheet.jsp fragment: fetches JSON from
// /dashboard/batch-exam-sheet-data via callCommonAjax and builds the modal client-side.
// Signature unchanged so the row action and the save/status refresh callers work as-is.
async function callBatchExaminationSheetModule(formId, batchId, batchName, standardId, controllType, moduleId, userId) {
	hideMessageTheme2('');
	var ajaxReqDetails = {
		method: "POST",
		url: getURLForHTML('dashboard', 'batch-exam-sheet-data'),
		body: {
			batchId: batchId,
			standardId: standardId,
			controllType: controllType,
			batchName: batchName,
			moduleId: moduleId,
		},
		global: true,
		showMessage: false,
	};
	var data = await callCommonAjax(ajaxReqDetails);
	if (!data || data.status != "1") {
		showMessageTheme2(0, (data && data.message) ? data.message : "Unable to load examination schedule. Please try again.");
		return false;
	}
	$('#batchSubjectTeacherSupportContent').html(getBatchExamSheetModuleHtml(data));
	$('#batchExaminationFormModel').modal('show');
	bindFileUploadForPDF('1', data.userId);
	$('#batchExamSheetUploadTable').DataTable();
	return false;
}

// Build the Upload Examination Schedule modal — from BatchExamSheet.jsp.
function getBatchExamSheetModuleHtml(data) {
	if ($("#batchExamSheetCss").length < 1) {
		$("head").append('<style id="batchExamSheetCss">' +
			'.file-upload{display:block;text-align:center;font-family: Helvetica, Arial, sans-serif;font-size: 12px;}' +
			'.file-upload .file-select{display:flex;border: 2px solid #dce4ec;color: var(--pc);cursor:pointer;height:40px;line-height:40px;text-align:left;background:#FFFFFF;overflow:hidden;position:relative;}' +
			'.file-upload .file-select .file-select-button{background:#dce4ec;padding:0 10px;display:inline-block;height:40px;line-height:40px;}' +
			'.file-upload .file-select .file-select-name{line-height:40px;display:inline-block;padding:0 10px;}' +
			'.file-upload .file-select:hover{border-color:var(--pc);}' +
			'.file-upload .file-select:hover .file-select-button{background:var(--pc);color:#FFFFFF;}' +
			'.file-upload.active .file-select{border-color:#3fa46a;}' +
			'.file-upload.active .file-select .file-select-button{background:#3fa46a;color:#FFFFFF;}' +
			'.file-upload .file-select input[type=file]{z-index:100;cursor:pointer;position:absolute;height:100%;width:100%;top:0;left:0;opacity:0;filter:alpha(opacity=0);}' +
			'</style>');
	}

	var moduleId = data.moduleId;
	var batchId = data.batchId;
	var rowsHtml = "";
	if (data.rows) {
		for (var i = 0; i < data.rows.length; i++) {
			var u = data.rows[i];
			var statusCell = (u.activeStatus == 'Y')
				? '<a onclick="callForChangeStatus(\'batchExaminationForm\',\'' + u.batchExShId + '\',\'INACTIVE\',\'' + moduleId + '\',\'' + u.batchId + '\');" href="javascript:void(0);"><i class="fa fa-circle active m-r-10" title="Click to inactivate"></i></a>'
				: '<a onclick="callForChangeStatus(\'batchExaminationForm\',\'' + u.batchExShId + '\',\'ACTIVE\',\'' + moduleId + '\',\'' + u.batchId + '\');" href="javascript:void(0);"><i class="fa fa-circle inactive m-r-10" title="Click to activate"></i></a>';
			rowsHtml += '<tr>' +
				'<td style="text-align: center;">' + (i + 1) + '</td>' +
				'<td style="text-align: center;"><a target="_blank" href="' + batchEsc(u.fileName) + '"><i class="fa fa-eye text-primary"></i></a></td>' +
				'<td>' + batchEsc(u.uploadedDate) + '</td>' +
				'<td>' + batchEsc(u.uploadedBy) + '</td>' +
				'<td>' + statusCell + '</td>' +
				'</tr>';
		}
	}

	return '' +
	'<div class="modal fade" id="batchExaminationFormModel" role="dialog" aria-labelledby="subjectTeacherMappingModalLabel">' +
		'<div class="modal-dialog modal-xl" role="document">' +
			'<div class="modal-content">' +
				'<form name="batchExaminationForm" id="batchExaminationForm" action="javascript:void(0);">' +
					'<div class="modal-header py-2 bg-primary text-white">' +
						'<h5 class="modal-title" id="subjectTeacherMappingModalLabel">Upload Examination Schedule for ' + batchEsc(data.batchName) + '</h5>' +
						'<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true" style="color:#fff;">&times;</span></button>' +
					'</div>' +
					'<div class="modal-body" style="max-height:450px;overflow-x:auto">' +
						'<div>' +
							'<input type="hidden" name="userId" id="userId" value="' + batchEsc(data.userId) + '" />' +
							'<input type="hidden" class="form-control" id="batchId" name="batchId" value="' + batchEsc(data.batchId) + '" />' +
							'<input type="hidden" class="form-control" id="standardId" name="standardId" value="' + batchEsc(data.standardId) + '" />' +
							'<input type="hidden" class="form-control" id="batchName" name="batchName" value="' + batchEsc(data.batchName) + '"/>' +
							'<div class="col-md-12 text-center">' +
								'<p class="" style="font-size: 16px; text-align: center; margin: 0; height: 25px;" id="modalMessageNew"></p>' +
							'</div>' +
							'<div class="row">' +
								'<div class="col-md-4 col-sm-4 col-xs-12">' +
									'<div class="form-group">' +
										'<label>Upload Examination Schedule:</label>' +
										'<div class="file-upload">' +
											'<div class="file-select">' +
												'<div class="file-select-button" id="fileupload1Label">Choose File</div>' +
												'<div class="file-select-name" id="fileupload1ChoosenFile">No file chosen...</div>' +
												'<input type="file" name="fileupload1" id="fileupload1">' +
											'</div>' +
										'</div>' +
									'</div>' +
								'</div>' +
								'<div class="col-md-3 col-sm-4 col-xs-12">' +
									'<div class="form-group">' +
										'<label class="full">&nbsp;</label>' +
										'<input type="hidden" id="fileupload1" name="fileupload1" value="">' +
										'<button type="submit" class="btn btn-primary btn-lg" id="uploadCSV" onclick="return saveBatchExaminationSheet(\'batchExaminationForm\',\'' + batchId + '\',\'' + moduleId + '\');">Upload</button>' +
									'</div>' +
								'</div>' +
								'<div class="col-12">' +
									'<table class="table table-bordered table-striped border-radius-table font-12 responsive nowrap" id="batchExamSheetUploadTable" style="width:100%;">' +
										'<thead class="bg-primary text-white">' +
											'<tr><th>S.No</th><th class="text-center">View Attachment</th><th>Uploaded Date-Time</th><th>Upload By</th><th>Action</th></tr>' +
										'</thead>' +
										'<tbody>' + rowsHtml + '</tbody>' +
									'</table>' +
								'</div>' +
							'</div>' +
						'</div>' +
					'</div>' +
				'</form>' +
			'</div>' +
		'</div>' +
	'</div>';
}

function saveBatchExaminationSheet(formId, batchId, roleModuleId) {

	/*var labelName = $("#" + formId + " #labelName").val().trim();
	if (labelName == "" || labelName == undefined) {
		showMessageTheme2(0, 'Module Name is Required.');
		return false
	}*/

	var attachmentName = $("#" + formId + " #fileupload1ChoosenFile").text();
	if (attachmentName.trim() == "" || attachmentName.trim() == undefined || attachmentName.trim() == "No file chosen...") {
		$('#modalMessageNew').show()
		$('#modalMessageNew').addClass('failure');
		$('#modalMessageNew').html('Attachement is required');
		return false;
	}
	var userId = $("#" + formId + " #userId").val();
	$.ajax({
		type: "POST",
		contentType: APPLICATION_JSON_VALUE,
		url: getURLForHTML('dashboard', 'save-batch-exam-sheet'),
		data: JSON.stringify(getRequestForSaveBatchExamSheet(formId)),
		dataType: 'json',
		cache: false,
		timeout: 600000,
		success: function (data) {
			console.log("response data is:", data);
			if (data['status'] == '0' || data['status'] == '2') {
				$('#modalMessageNew').show()
				$('#modalMessageNew').addClass('failure');
				$('#modalMessageNew').html(data['message'])
			} else {
				$('#modalMessageNew').show()
				$('#modalMessageNew').addClass('success')
				$('#modalMessageNew').html(data['message'])
				$('#' + formId)[0].reset();
				setTimeout(function () { $(".modal-backdrop").removeClass('show'); $(".modal-backdrop").addClass('modal'); $(".modal-backdrop").removeClass('modal-backdrop'); callBatchExaminationSheetModule('', batchId, '', '', '', roleModuleId, userId); }, 3000);

			}
			return false;
		}
	});

}

function getRequestForSaveBatchExamSheet(formId) {
	var request = {};
	var authentication = {};
	var batchExamSheetDTO = {};
	batchExamSheetDTO['batchId'] = $("#" + formId + " #batchId").val().trim()
	batchExamSheetDTO['fileName'] = $("#" + formId + " #fileupload1ChoosenFile").text();
	//	batchExamSheetDTO['labelName'] =escapeCharacters($("#" + formId + " #labelName").val().trim());
	batchExamSheetDTO['activeStatus'] = 'Y';
	batchExamSheetDTO['controllType'] = 'UPLOAD';
	request['batchExamSheetDTO'] = batchExamSheetDTO;
	authentication['hash'] = getHash(); authentication['schoolId'] = SCHOOL_ID; authentication['schoolUUID'] = SCHOOL_UUID;
	// authentication['userType'] = moduleId;
	authentication['userId'] = $("#" + formId + " #userId").val();
	authentication['sessionUserId'] = USER_ID;
	request['authentication'] = authentication;
	return request;
}

function callForChangeStatus(formId, examSheetId, controllType, roleModuleId, batchId) {

	var request = {};
	var authentication = {};
	var batchExamSheetDTO = {};
	// batchExamSheetDTO['batchExShId'] = examSheetId;
	batchExamSheetDTO['controllType'] = controllType;
	authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userId'] = $("#" + formId + " #userId").val();
	authentication['sessionUserId'] = USER_ID;
	request['authentication'] = authentication;
	request['batchExamSheetDTO'] = batchExamSheetDTO;
	request['batchExShId'] = examSheetId;
	var userId = $("#" + formId + " #userId").val();
	$.ajax({
		type: "POST",
		contentType: APPLICATION_JSON_VALUE,
		url: getURLForHTML('dashboard', 'update-batch-exam-sheet'),
		data: JSON.stringify(request),
		dataType: 'json',
		cache: false,
		timeout: 600000,
		success: function (data) {
			console.log("response data is:", data);
			if (data['status'] == '0' || data['status'] == '2') {
				$('#modalMessageNew').show()
				$('#modalMessageNew').addClass('failure');
				$('#modalMessageNew').html(data['message'])
			} else {
				$('#modalMessageNew').show()
				$('#modalMessageNew').addClass('success')
				$('#modalMessageNew').html(data['message'])
				setTimeout(function () { $(".modal-backdrop").removeClass('show'); $(".modal-backdrop").addClass('modal'); $(".modal-backdrop").removeClass('modal-backdrop'); callBatchExaminationSheetModule('', batchId, '', '', '', roleModuleId, userId); }, 3000);
			}
			return false;
		}
	});

}

function getRequestForMoveBatchByStudent(formId, moduleId, controllType) {
	var request = {};
	var authentication = {};
	var batchDTO = {};
	batchDTO['userId'] = $("#" + formId + " #userId").val();
	batchDTO['batchId'] = $("#" + formId + " #batchId").val();
	batchDTO['controllType'] = controllType;
	batchDTO['moveToBatchId'] = $("#" + formId + " #tansferBatch option:selected").val();
	batchDTO['batchStudentIds'] = $("#" + formId + " #selectStudentIds").val();
	batchDTO['standardId'] = $("#" + formId + " #standardId").val();
	batchDTO['batchName'] = $("#" + formId + " #batchName").val();
	batchDTO['schoolId'] = SCHOOL_ID;
	request['batchDTO'] = batchDTO;
	authentication['hash'] = getHash();
	authentication['userId'] = $("#" + formId + " #userId").val();
	authentication['schoolId'] = SCHOOL_ID;
	authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = moduleId;
	authentication['sessionUserId'] = USER_ID;
	request['authentication'] = authentication;
	return request;
}

function transferStudent(formId, moduleId, roleModuleId, controllType) {
	if (controllType != 'Add') {
		if ($('#tansferBatch option:selected').val() == 0) {
			showMessageTheme2(0, "Please select batch to move student.");
			return;
		}
	}
	var studentIds = "";
	$('#moveStudentBatch > tbody  > tr').each(function (index, tr) {
		if ($(this).find(".checkStudentname").is(":checked")) {
			studentIds = studentIds + $(this).find(".checkStudentname").val() + ',';
		}
	});
	if (studentIds == "") {
		showMessageTheme2(0, "Please select atleast one student");
		return;
	} else {
		$("#selectStudentIds").val(studentIds.substring(0, studentIds.length - 1));
		console.log("student Ids are ", studentIds);
	}

	$.ajax({
		type: "POST",
		contentType: APPLICATION_JSON_VALUE,
		url: getURLForHTML('dashboard', 'move-batch-student'),
		data: JSON.stringify(getRequestForMoveBatchByStudent(formId, moduleId, controllType)),
		dataType: 'json',
		cache: false,
		timeout: 600000,
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessageTheme2(0, data['message']);
			} else {
				showMessageTheme2(1, data['message']);
				$('#batchStudentTransferModel').modal('hide');
				setTimeout(function () { callDashboardPageSchool(roleModuleId, 'manage-batch-student'); }, 1000);
			}
			return false;
		}
	});
}


function callTeacherTimeScheduleBatch(batchId, subjectId, teacherId) {
	hideMessageTheme2('');
	if(flag_Change_Batch_Start_And_EndDate){
		var newStartDate = new Date($("#endDate" + subjectId).val());
		newStartDate.setDate(newStartDate.getDate() + 1);
		var batchEndDate = $("#batchEndDate").val();
	}else{
		var newStartDate = new Date($("#batchStartDate").val());
		newStartDate.setDate(newStartDate.getDate() + 1);
		var batchEndDate = $("#batchEndDate").val();
	}
	var ajaxReqDetails = {
		method: "POST",
		url: getURLForHTML('dashboard', 'batch-subject-teacher-timeschedule-data'),
		body: {
			batchId: batchId,
			subjectId: subjectId,
			teacherId: teacherId,
		},
		global: false,
		showMessage: false,
	};
	callCommonAjax(ajaxReqDetails).then(function (data) {
		if (!data || data.status != "1") {
			showMessageTheme2(0, (data && data.message) ? data.message : "Unable to load teacher time schedule. Please try again.");
			return;
		}
		$("#batch-schedule" + subjectId + "").html(getBatchTeacherTimeScheduleHtml(data)).promise().done(function () {
			$("#viewBatch-" + subjectId + " .proceedClassbtn").hide();
			$("#startDate" + subjectId).datepicker('remove');
			$("#startDate" + subjectId).datepicker({
				format: 'mm-dd-yyyy',
				startDate: new Date(newStartDate + 1),
				endDate: new Date(batchEndDate),
				autoclose: true,
				todayHighlight: false,
			});
			$("#endDate" + subjectId).datepicker('remove');
			$("#endDate" + subjectId).datepicker({
				format: 'mm-dd-yyyy',
				startDate: new Date(newStartDate + 1),
				endDate: new Date(batchEndDate),
				autoclose: true,
				todayHighlight: false,
			});
		});
	});
}

// Client render of BatchTeacherTimeScheduleContent.jsp from the JSON payload. The day-grid
// items are identical to the linking table's, so buildLinkingDaysGridHtml is reused.
function getBatchTeacherTimeScheduleHtml(data) {
	var sid = data.subjectId;
	var sub = { subjectId: sid, daysList: data.days, timeTableList: data.timeTableList };
	return '' +
		'<div style="display: flex; align-items: center">' +
			'<span style="padding: 0 5px">' +
				'<input type="text" class="teachStartDate form-control" name="startDate" placeholder="Select Start Date" id="startDate' + sid + '" value="' + batchEsc(data.batchStartDate) + '" onchange="checkUpdatesBatch(this,\'' + sid + '\')" data-date-start="' + batchEsc(data.batchStartDate) + '" readonly onkeydown="return false"/>' +
			'</span>' +
			'<span style="padding: 0 5px">' +
				'<input type="text" class="teachEndDate form-control " name="endDate" placeholder="Select End Date" id="endDate' + sid + '" value="' + batchEsc(data.batchEndDate) + '" onchange="checkUpdatesBatch(this,\'' + sid + '\')" data-date-end="' + batchEsc(data.batchEndDate) + '" readonly onkeydown="return false"/>' +
			'</span>' +
		'</div>' +
		'<hr />' +
		'<div>' +
			'<div class="row teacher-mapping-set-time-' + sid + '" style="display:flex;align-items:center;flex-wrap: wrap;justify-content:space-between;font-size:11px;">' +
				buildLinkingDaysGridHtml(sub) +
			'</div>' +
		'</div>';
}

function teacherTimeCheck(scheduleTime, elementId, dayid, batchId) {
	var result = false;
	hideMessageTheme2('');
	$(".subjectTeacherTimeError").text('');
	var teacherId = $("#assignTeacherId" + elementId).val();
	var startDate = $("#startDate" + elementId).val();
	console.log($("#assignTeacherId" + elementId).val());
	checkUpdatesBatch("", elementId)
	$.ajax({
		type: "POST",
		contentType: APPLICATION_JSON_VALUE,
		url: getURLForHTML('dashboard', 'teacher-time-available'),
		data: JSON.stringify(getCallRequestForTeacherTime(teacherId, scheduleTime, dayid, startDate)),
		dataType: 'json',
		cache: false,
		timeout: 600000,
		async: false,
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2') {
				result = true;
				//result = batchTimeCheck(scheduleTime, elementId, dayid, batchId);
			} else {
				// $(".subjectTeacherTimeError").text('Selected time already scheduled');
				// $("#teachDays"+elementId+dayid).prop("checked",false);
				// $("#timeInterval"+elementId+dayid).val('');
				// result=false;
			}
		}
	});
	return result;
}



function getCallRequestForTeacherTime(teacherId, scheduleTime, dayid, startDate) {
	var request = {};
	var authentication = {};
	var requestData = {};
	requestData['requestKey'] = 'TEACHER-TIME-AVAILABLE';
	requestData['requestValue'] = teacherId;
	requestData['requestExtra'] = scheduleTime;
	requestData['requestExtra1'] = dayid;
	requestData['requestExtra2'] = startDate;
	authentication['hash'] = getHash(); authentication['schoolId'] = SCHOOL_ID; authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = moduleId;
	request['authentication'] = authentication;
	request['requestData'] = requestData;
	return request;
}

function batchTimeCheck(scheduleTime, elementId, dayid, batchId) {
	var result = false;
	hideMessageTheme2('');
	$.ajax({
		type: "POST",
		contentType: APPLICATION_JSON_VALUE,
		url: getURLForHTML('dashboard', 'student-subject-time-available'),
		data: JSON.stringify(getCallRequestForBatchTime(batchId, scheduleTime, dayid)),
		dataType: 'json',
		cache: false,
		timeout: 600000,
		async: false,
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2') {
				result = true;
			} else {
				$(".subjectTeacherTimeError").text('Selected time already scheduled');
				$("#teachDays" + elementId + dayid).prop("checked", false);
				$("#timeInterval" + elementId + dayid).val('');
				result = false;
			}
		}
	});
	return result;
}

function getCallRequestForBatchTime(batchId, scheduleTime, dayid) {
	var request = {};
	var authentication = {};
	var requestData = {};
	requestData['requestKey'] = 'BATCH-TIME-AVAILABLE';
	requestData['requestValue'] = batchId;
	requestData['requestExtra'] = scheduleTime;
	requestData['requestExtra1'] = dayid;
	authentication['hash'] = getHash(); authentication['schoolId'] = SCHOOL_ID; authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = moduleId;
	request['authentication'] = authentication;
	request['requestData'] = requestData;
	return request;
}

	// JS-rendered replacement for the legacy batch calendar fragment: fetches JSON from
// /dashboard/calendar-dates-data via callCommonAjax and builds the calendar client-side
// (batchCalendarRender.js). Signature unchanged so all nav/getToday callers keep working.
function calendarDates(replaceId, startDate, slotType, userId, batchId) {
	if (typeof window !== 'undefined') {
		window.__bcCurrentCalendarStartDate = startDate;
		window.__bcCurrentCalendarSlotType = slotType;
	}
	var inActDate = $("#inActDate").val();
	var moduleId = $("#roleModuleId").val();
	customLoader(true);
	var ajaxReqDetails = {
		method: "POST",
		url: getURLForHTML('dashboard', 'calendar-dates-data'),
		body: {
			startDate: startDate,
			slotType: slotType,
			disabledDate: inActDate,
			userId: userId,
			batchId: batchId,
			moduleId: moduleId,
		},
		global: false,
		showMessage: false,
	};
	callCommonAjax(ajaxReqDetails).then(function (data) {
		customLoader(false);
		if (!data || data.status != "1") {
			// callCommonAjax already redirects on session-out (status '3').
			if (data && data.status != "3") {
				showMessageTheme2(0, (data && data.message) ? data.message : "Unable to load calendar. Please try again.");
			}
			return;
		}
		$('#monthYear').html('');
		$('#' + replaceId).html(buildBatchCalendarHtml(data));
		initBatchCalendar(data);
	});
}

function editBatchDetails(formId, moduleId, roleModuleId) {
	hideMessageTheme2('');
	$.ajax({
		type: "POST",
		contentType: APPLICATION_JSON_VALUE,
		url: getURLForHTML('dashboard', 'edit-batch-details'),
		data: JSON.stringify(getRequestForEditBatchDetails(formId, moduleId)),
		dataType: 'json',
		cache: false,
		timeout: 600000,
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessageTheme2(0, data['message']);
			} else {
				$('#' + formId)[0].reset();
				showModalMessage(1, data['message']);
				setTimeout(function () { $('#batchStudentTransferModel').modal('hide'); }, 2500);
				//setTimeout(function(){ callDashboardPageSchool(roleModuleId,'manage-batch-student'); },1000);
			}
			return false;
		}
	});
}

function getRequestForEditBatchDetails(formId, moduleId) {
	var request = {};
	var authentication = {};
	var batchDTO = {};
	batchDTO['userId'] = $("#" + formId + " #userId").val();
	batchDTO['batchId'] = $("#" + formId + " #batchId").val();
	batchDTO['batchName'] = $("#" + formId + " #batchNameEdit").val();
	batchDTO['batchStartDate'] = $("#" + formId + " #batchStartDate").val();
	batchDTO['batchEndDate'] = $("#" + formId + " #batchEndDate").val().trim();
	batchDTO['batchHolidayDate'] = $("#" + formId + " #batchHolidayDate").val();
	batchDTO['timeHrsFrom'] = $("#" + formId + " #timeHrsFrom").val();
	batchDTO['timeMinFrom'] = $("#" + formId + " #timeMinFrom").val();
	batchDTO['timeInterval'] = $("#" + formId + " #timeInterval").val();
	batchDTO['periodTime'] = $("#" + formId + " #batchPeriodTime").val();
	batchDTO['batchDuration'] = $("#" + formId + " #batchDuration").val();
	batchDTO['meetingVendor'] = $("#" + formId + " #meetingVendor").val();
	batchDTO['joiningType'] = $("#" + formId + " #joiningType").val();
	batchDTO['sessionName'] = $("#" + formId + " #batchSession").val();
	batchDTO['schoolId'] = SCHOOL_ID;
	request['batchDTO'] = batchDTO;
	authentication['hash'] = getHash();
	authentication['userId'] = $("#" + formId + " #userId").val();
	authentication['schoolId'] = SCHOOL_ID;
	authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = moduleId;
	authentication['sessionUserId'] = USER_ID;
	request['authentication'] = authentication;
	return request;
}

function removeTeacherTimeTable(batchId, subjectId, teacherId, startDate, batchEndDate, batchName, standardId, roleModuleId) {
	hideMessageTheme2('');
	if (teacherId == '') {
		return false;
	}
	customLoader(true);
	$.ajax({
		type: "POST",
		contentType: APPLICATION_JSON_VALUE,
		url: getURLForHTML('dashboard', 'remove-teacher-time-table'),
		data: JSON.stringify(getRequestForRemoveTeacherTimeTable(batchId, subjectId, teacherId, startDate, batchEndDate)),
		dataType: 'json',
		cache: false,
		//timeout : 600000,
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessageTheme2(0, data['message']);
			} else {
				showMessageTheme2(1, "Teacher time remove successfully.");
				$('#batchSubjectTeacherMappingModel').modal('hide');
				setTimeout(function () {
					callBatchSubjectAndTeacherMapping('formId', batchId, batchName, standardId, 'View', roleModuleId);
				}, 1000);
				customLoader(false);
				//setTimeout(function(){$('#batchSubjectTeacherMappingModel').modal('hide'); },1000);
			}
			return false;
		}
	});
}


function getRequestForRemoveTeacherTimeTable(batchId, subjectId, teacherId, startDate, batchEndDate) {
	var request = {};
	var authentication = {};
	var batchTeacherMappingDTO = {}
	batchTeacherMappingDTO['batchId'] = batchId;
	batchTeacherMappingDTO['subjectId'] = subjectId;
	batchTeacherMappingDTO['teacherId'] = teacherId;
	batchTeacherMappingDTO['steachStartDate'] = startDate;
	var batchEndDates = batchEndDate.split("-")[2] + '-' + batchEndDate.split("-")[0] + '-' + batchEndDate.split("-")[1]
	batchTeacherMappingDTO['batchEndDate'] = batchEndDates;
	authentication['hash'] = getHash(); authentication['schoolId'] = SCHOOL_ID; authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = moduleId;
	authentication['userId'] = $("#userId").val();
	request['authentication'] = authentication;
	request['batchTeacherMapping'] = batchTeacherMappingDTO;
	return request;
}
function updateClassLink(formId, moduleId, roleModuleId, userId) {
	hideMessageTheme2('');
	$(".error-message-link").text('');
	if ($("#" + formId + " #classLink").val() == '') {
		$(".error-message-link").text('Please fill classroom link');
		return false;
	}
	if ($("#" + formId + " #teacherId").val() == '') {
		$(".error-message-link").text('teacher not found');
		return false;
	}
	if ($("#" + formId + " #subjectId").val() == '') {
		$(".error-message-link").text('subject not found');
		return false;
	}
	$.ajax({
		type: "POST",
		contentType: APPLICATION_JSON_VALUE,
		url: getURLForHTML('dashboard', 'create-teacher-class-link'),
		data: JSON.stringify(getRequestForUpdateClassLink(formId, moduleId)),
		dataType: 'json',
		cache: false,
		timeout: 600000,
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessageTheme2(0, data['message']);
			} else {
				showMessageTheme2(1, data['message']);
				$('#batchCreateTime').modal('hide');
				setTimeout(function () { callDashboardPageSchool(roleModuleId, 'batch-schedule', '', userId); }, 1000);
			}
			return false;
		}
	});
}

function getRequestForUpdateClassLink(formId, moduleId) {
	var request = {};
	var authentication = {};
	var requestData = {};
	var batchTeacherMappingDTO = {};
	batchTeacherMappingDTO['batchId'] = $("#" + formId + " #batchId").val();
	batchTeacherMappingDTO['teacherId'] = $("#" + formId + " #teacherId").val();
	batchTeacherMappingDTO['subjectId'] = $("#" + formId + " #subjectId").val();
	batchTeacherMappingDTO['steachStartDate'] = $("#" + formId + " #startDate").val();
	batchTeacherMappingDTO['startTime'] = $("#" + formId + " #startTime").val();
	batchTeacherMappingDTO['meetingLink'] = $("#" + formId + " #classLink").val();
	batchTeacherMappingDTO['meetingGenerateStatus'] = "MANUAL";
	batchTeacherMappingDTO['timeZone'] = $("#" + formId + " #timeZone").val();
	requestData['batchTeacherMapping'] = batchTeacherMappingDTO;
	authentication['hash'] = getHash();
	authentication['userId'] = $("#" + formId + " #userId").val();
	authentication['schoolId'] = SCHOOL_ID;
	authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = moduleId;
	request['authentication'] = authentication;
	request['requestData'] = requestData;
	return request;
}
function sendMailStudentMoveBatch(formId, moduleId, batchId, studentId, mailType) {
	hideMessageTheme2('');
	$.ajax({
		type: "POST",
		contentType: APPLICATION_JSON_VALUE,
		url: getURLForHTML('dashboard', 'send-mail-student-move-batch'),
		data: JSON.stringify(getRequestForStudentMoveBatch(formId, moduleId, batchId, studentId, mailType)),
		dataType: 'json',
		cache: false,
		timeout: 600000,
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessageTheme2(0, data['message']);
			} else {
				showMessageTheme2(1, data['message']);
			}
			return false;
		}
	});
}

function getRequestForStudentMoveBatch(formId, moduleId, batchId, studentId, mailType) {
	var request = {};
	var authentication = {};
	var batchStudentDetailsDTO = {};
	batchStudentDetailsDTO['mailType'] = mailType;
	batchStudentDetailsDTO['batchId'] = batchId;
	if (mailType == 'SendToOne') {
		batchStudentDetailsDTO['studentId'] = studentId;
	} else {
		batchStudentDetailsDTO['ids'] = $("#batchMoveForm #selectStudentIdsForMail").val();
	}
	request['batchStudentDetailsDTO'] = batchStudentDetailsDTO;
	authentication['hash'] = getHash(); authentication['schoolId'] = SCHOOL_ID; authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = moduleId;
	request['authentication'] = authentication;
	return request;
}

function sendMailTeacherMoveBatch(formId, moduleId, batchId, teacherId, userId, mailType) {
	hideMessageTheme2('');
	$.ajax({
		type: "POST",
		contentType: APPLICATION_JSON_VALUE,
		url: getURLForHTML('dashboard', 'send-mail-teacher-move-batch'),
		data: JSON.stringify(getRequestForTeacherMoveBatch(formId, moduleId, batchId, teacherId, userId, mailType)),
		dataType: 'json',
		cache: false,
		timeout: 600000,
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessageTheme2(0, data['message']);
			} else {
				showMessageTheme2(1, data['message']);
			}
			return false;
		}
	});
}


function getRequestForTeacherMoveBatch(formId, moduleId, batchId, teacherId, userId, mailType) {
	var request = {};
	var authentication = {};
	var teacherDetailsDTO = {};
	teacherDetailsDTO['batchId'] = batchId;
	teacherDetailsDTO['mailType'] = mailType;
	if (mailType == 'SendToOne') {
		teacherDetailsDTO['teacherId'] = teacherId;
	} else {
		teacherDetailsDTO['ids'] = $("#batchMoveForm #selectTeacherIdsForMail").val();
	}
	request['teacherDetailsDTO'] = teacherDetailsDTO;
	authentication['hash'] = getHash(); authentication['schoolId'] = SCHOOL_ID; authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userId'] = userId;
	authentication['userType'] = moduleId;
	request['authentication'] = authentication;
	return request;
}

function inactiveTeacherTimeTableSchedule(batchId, subjectId, batchName, standardId, moduleId) {
	hideMessageTheme2('');
	var data={};
	data['batchId']=batchId;
	data['subjectId']=subjectId;
	data['userId']=USER_ID;
	$.ajax({
		type: "POST",
		contentType:APPLICATION_JSON_VALUE,
		url: getURLForHTML('dashboard', 'inactive-batch-subject'),
		data: JSON.stringify(data),
		dataType: 'html',
		cache: false,
		timeout: 600000,
		success: function (htmlContent) {
			if (htmlContent != "") {
				var stringMessage = [];
				stringMessage = htmlContent.split("|");
				if (stringMessage[0] == "FAILED" || stringMessage[0] == "EXCEPTION" || stringMessage[0] == "SESSIONOUT") {
					showMessageTheme2(0, stringMessage[1]);
				} else {
					showMessageTheme2(1, "Batch Subject deleted successfully.");
					$('#batchSubjectTeacherMappingModel').modal('hide');
					setTimeout(function () { callBatchSubjectAndTeacherMapping('formId', batchId, batchName, standardId, 'View', moduleId); }, 1000);
				}
				return false;
			}
		}
	});
}

function studentRemoveFromBatch(formId, moduleId, batchId, studentId, batchName, standardId) {
	hideMessageTheme2('');
	$.ajax({
		type: "POST",
		contentType: APPLICATION_JSON_VALUE,
		url: getURLForHTML('dashboard', 'remove-student-from-batch'),
		data: JSON.stringify(getRequestForStudentRemoveFromBatch(formId, moduleId, batchId, studentId)),
		dataType: 'json',
		cache: false,
		timeout: 600000,
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessageTheme2(0, data['message']);
			} else {
				showMessageTheme2(1, data['message']);
				$('#batchStudentTransferModel').modal('hide');
				setTimeout(function () { callStudentBatchTransfer('formId', batchId, batchName, standardId, 'Edit', moduleId); }, 1000);
			}
			return false;
		}
	});
}

function getRequestForStudentRemoveFromBatch(formId, moduleId, batchId, studentId) {
	var request = {};
	var authentication = {};
	var batchStudentDetailsDTO = {};
	batchStudentDetailsDTO['batchId'] = batchId;
	batchStudentDetailsDTO['studentId'] = studentId;
	request['batchStudentDetailsDTO'] = batchStudentDetailsDTO;
	authentication['userId'] = $('#userId').val();
	authentication['hash'] = getHash(); authentication['schoolId'] = SCHOOL_ID; authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = moduleId;
	request['authentication'] = authentication;
	return request;
}

function sendMailCancelClass(status, batchTeacherMappingId, classDate){
	let data = {}
		
	data.batchTeacherMappingId = batchTeacherMappingId
	
	data.status = status;
	data.classCancelDate = classDate
	data.userId = USER_ID
	$.ajax({
		type: "POST",
		contentType: APPLICATION_JSON_VALUE,
		url: getURLForHTML('dashboard','class-cancel-and-reschedule'),
		data: JSON.stringify(data),
		dataType: 'json',
		cache: false,
		timeout: 600000,
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessageTheme2(0, data['message']);
			} else {
				showMessageTheme2(1, data['message']);
				location.reload()
			}
		}
	});
}	
