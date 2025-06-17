var currentDate = new Date();
currentDate.setDate(currentDate.getDate() + 1);
var currentYear = currentDate.getFullYear();
var currentMonth = currentDate.getMonth();
var currentDay = currentDate.getDate();

function meetingSlotModal() {
	if ($("#autoCountryTimeZoneId").val() != undefined && $("#autoCountryTimeZoneId").val() != '') {
		$("#teacherMeetingSlotsForm #countryTimezoneId").select2({});
		$("#teacherMeetingSlotsForm #countryTimezoneId").val($("#autoCountryTimeZoneId").val()).trigger('change');
	}
	//$("#teacherMeetingSlotsForm #slotCtFor").select2();
	//$("#teacherMeetingSlotsForm #slotCtFor").select2().val(0).trigger('change');
	$("#slotCtFor").val(0).trigger('change');

	$("#standardDiv").show();
	$("#course").show();
	$('#teacherMeetingSlotsModal').modal('show');
	$('#listSlotsResponse').html('');
	$('#listSlots').show();
	$('.meetingGetSlotSave').show();
	$('.meetingSave').hide();
	$('#back').hide();
	$("#meetingCategory2").prop("checked", true);

	$("#inActDate").val('');
	$("#timeHrsFrom").val(0);
	$("#timeHrsTo").val(0);
	$("#timeMinFrom").val(0);
	$("#timeMinTo").val(0);
	$("#weekCount").val(1);
	$(".arrowBtn").show();
	$('#nextVisitMonth').show();
	$('#calendarWeek').show();
	var newdate = new Date();
	//newdate.setDate(newdate.getDate() - 1); // minus the date
	var nd = newdate.getFullYear() + "-" + (newdate.getMonth() + 1) + "-" + newdate.getDate();//new Date(newdate);
	calendarDateMeeting('calendarWeek', nd, 'Week', 'Create Manage Class');
	$("#monthYear").html('1 Week(s) Selected');
	$("#monthYear").show();

}

function meetingSlotModalBack() {
	$('#teacherMeetingSlotsModal').modal('show');
	$('#listSlotsResponse').html('');
	$('#listSlots').show();
	$('.meetingGetSlotSave').show();
	$('.meetingSave').hide();
	$('#back').hide();
}

function bookingSlotModal(subjectId, roleModuleId, themeType) {
	if (themeType == 'theme2') {
		var data = {};
		data['userId'] = USER_ID;
		data['subjectId'] = subjectId;
		data['roleModuleId'] = roleModuleId;
		$.ajax({
			type: "POST",
			contentType: "application/json",
			url: getURLForHTML('dashboard', 'student-subject-session-booking'),
			data: JSON.stringify(data),
			dataType: 'html',
			success: function (htmlContent) {
				if (htmlContent != "") {
					var stringMessage = [];
					stringMessage = htmlContent.split("|");
					if (stringMessage[0] == "FAILED" || stringMessage[0] == "EXCEPTION" || stringMessage[0] == "SESSIONOUT") {
						if (stringMessage[0] == "SESSIONOUT") {
							redirectLoginPage();
						} else {
							showMessageTheme2(0, stringMessage[1], '', false);
						}
					} else {
						$('#bookASession').html(htmlContent);
						$("#studentBookingSlotsModal  #course").show();
						$('#studentBookingSlotsModal').modal('show');
					}
				}
			},
			error: function (e) {
				//showMessage(true, TECHNICAL_GLITCH);
			}
		});
	} else {
		$("#course").show();
		$('#studentBookingSlotsModal').modal('show');
	}

}

function meetingUrlModalAdmin(meetingId, userId, meetingUrl, mailSendStatus, urlRemarks) {
	$('#meetingUrlForm #meetingUrl').attr('disabled', false);
	$('#meetingUrlForm #remarks').attr('disabled', false);
	$('#meetingUrlForm #saveMeetingUrl').show();
	$('#meetingUrlForm #note').hide();

	$('#meetingUrlModal').modal('show');
	$('#meetingUrlForm #meetingId').val(meetingId);
	$('#meetingUrlForm #userId').val(userId);
	$('#meetingUrlForm #meetingUrl').val(meetingUrl);
	$('#meetingUrlForm #remarks').val(urlRemarks);
	$('#meetingUrlForm #mailSendStatus').val(mailSendStatus);
	if (mailSendStatus == 'Y') {
		$('#meetingUrlForm #meetingUrl').attr('disabled', true);
		$('#meetingUrlForm #remarks').attr('disabled', true);
		$('#meetingUrlForm #saveMeetingUrl').hide();
		$('#meetingUrlForm #note').hide();
	}
}

function sendMailModel(meetingId, userId, meetingUrl, mailSendStatus) {
	if (meetingUrl == '' || meetingUrl == undefined) {
		showMessage(true, 'Add Meeting Link before Sending Mail');
		return false;
	}
	//	else if(mailSendStatus=='Y'){
	//		showMessage(true, 'Mail Already Send');
	//		return false;
	//	}
	else {
		$('#sendMailModal').modal('show');
		$('#sendMailForm #meetingId').val(meetingId);
		$('#sendMailForm #userId').val(userId);
	}
}

function validateStudentSlots(formId) {
	var countryTimezone = "";
	var subjectId = "";
	var teacherId = "";
	var providerId = "";
	var standardId = "";
	if ($('#countryTimezoneId option:selected').val() != null && $('#countryTimezoneId option:selected').val() != '0') {
		countryTimezone = $('#countryTimezoneId option:selected').val();
	} else {
		$('#studentfreeSlotList').html("");
		showMessage(true, 'Please select a Time Zone');
		return false
	}
	if ($('#subjectId').val() == 0 || $('#subjectId').val() == undefined) {
		$('#studentfreeSlotList').html("");
		showMessage(true, 'Course is required');
		return false;
	} else {
		subjectId = $('#' + formId + ' #subjectId').val();
		teacherId = $('#' + formId + ' #subjectId option:selected').attr('data-teacherId');
		providerId = $('#' + formId + ' #subjectId option:selected').attr('data-providerId');
		standardId = $('#' + formId + ' #subjectId option:selected').attr('data-standardId');
	}
	var data = {}
	data['userId'] = USER_ID;
	data['subjectId'] = subjectId;
	data['teacherId'] = teacherId;
	data['timeZone'] = countryTimezone;
	data['providerId'] = providerId;
	data['standardId'] = standardId;
	callStudentFreeSlots('#studentBookingSlotsForm', data);
	// callStudentFreeSlots('#studentBookingSlotsForm',"subjectId="+subjectId+"&teacherId="+teacherId+"&timeZone="+countryTimezone+"&providerId="+providerId+"&standardId="+standardId);
}

function callStudentFreeSlots(formId, data) {
	//	hideMessage('');
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLForHTML('dashboard', 'get-student-free-slots'),
		data: JSON.stringify(data),
		dataType: 'html',
		cache: false,
		timeout: 600000,
		success: function (htmlContent) {
			if (htmlContent != "") {
				var stringMessage = [];
				stringMessage = htmlContent.split("|");
				if (stringMessage[0] == "FAILED" || stringMessage[0] == "EXCEPTION" || stringMessage[0] == "SESSIONOUT") {
					showMessage(true, stringMessage[1]);
				} else {
					$('#studentfreeSlotList').html(htmlContent);
				}
				return false;
			}
			return false;
		},
		error: function (e) {
			showMessage(true, e.responseText);
		}
	});
}

function validateRequestForStudentBookSessionSlots(formId, moduleId) {
	if ($('#countryTimezoneId').val() == 0 || $('#countryTimezoneId').val() == undefined) {
		showMessageTheme2(0, 'Time-Zone is required', '', false);
		return false;
	}
	if ($('#subjectId').val() == 0 || $('#subjectId').val() == undefined) {
		showMessageTheme2(0, 'Course is required', '', false);
		return false;
	}
	if ($("input[name='slotTime']:checked").val() == undefined) {
		showMessageTheme2(0, 'Please select any one Slot.', '', false);
		return false;
	}
	return true;
}
function callForStudentBookSessionSlots(formId, moduleId, roleModuleId) {
	if(!getSession()){
		redirectLoginPage();
	}
	hideMessage('');
	if (!validateRequestForStudentBookSessionSlots(formId)) {
		return false;
	}
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLForHTML('dashboard', 'student-book-session-slots-submit'),
		data: JSON.stringify(getRequestForStudentBookSessionSlots(formId, moduleId)),
		dataType: 'json',
		cache: false,
		timeout: 600000,
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessageTheme2(0, data['message'], '', false);
			} else {
				showMessageTheme2(1, data['message'], '', false);
				$('#studentBookingSlotsModal').modal('toggle');
				$('#' + formId)[0].reset();
				setTimeout(function () { callSchoolInneraction('subjectsession', data['subjectId'], '', roleModuleId); }, 1000);
			}
			return false;
		},
		error: function (e) {
			return false;
		}
	});
}
function getRequestForStudentBookSessionSlots(formId, moduleId) {
	var request = {};
	var authentication = {};
	var meetingSlotDTO = {};

	meetingSlotDTO['meetingPersoneId'] = $("#userId").val();
	meetingSlotDTO['meetingId'] = $("input[name='slotTime']:checked").attr('slotIdAttr');
	meetingSlotDTO['meetingDate'] = $("input[name='slotTime']:checked").attr('slotMeetDate');
	meetingSlotDTO['meetingEndDate'] = $("input[name='slotTime']:checked").attr('slotMeetEndDate');
	meetingSlotDTO['startTime'] = $("input[name='slotTime']:checked").attr('slotstTime');
	meetingSlotDTO['endTime'] = $("input[name='slotTime']:checked").attr('slotedTime');
	meetingSlotDTO['timezone'] = $('#countryTimezoneId option:selected').attr('custom_timezone_id');
	meetingSlotDTO['timeZoneCheck'] = $('#countryTimezoneId').val();
	meetingSlotDTO['meetingType'] = "STUDENT_DOUBT_SESSION";
	meetingSlotDTO['subjectId'] = $("#subjectId").val();
	meetingSlotDTO['standardId'] = $('#' + formId + ' #subjectId option:selected').attr('data-standardId');
	meetingSlotDTO['studentStandardId'] = $('#' + formId + ' #subjectId option:selected').attr('data-studentStandardId');
	meetingSlotDTO['studentSessionId'] = $('#' + formId + ' #subjectId option:selected').attr('data-studentSessionId');
	meetingSlotDTO['providerId'] = $('#' + formId + ' #subjectId option:selected').attr('data-providerId');
	meetingSlotDTO['teachUserId'] = $('#' + formId + ' #subjectId option:selected').attr('data-teacherid');
	meetingSlotDTO['planId'] = $('#' + formId + ' #subjectId option:selected').attr('data-planid');

	authentication['hash'] = getHash(); authentication['schoolId'] = SCHOOL_ID; authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = moduleId;
	authentication['userId'] = $("#userId").val().trim();
	request['authentication'] = authentication;
	request['meetingSlotDTO'] = meetingSlotDTO;
	return request;
}

function weekCount(year, month_number) {
	// month_number is in the range 1..12
	var firstOfMonth = new Date(year, month_number - 1, 1);
	var lastOfMonth = new Date(2020, month_number, 0);
	var used = firstOfMonth.getDay() + lastOfMonth.getDate();
	return Math.ceil(used / 7);
}

function callSubjectByGradeAndTeacherId(formId, standardId, elementId, toElementId, teacherId, callfrom, lmsPlatform) {
	hideMessage('');
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLForCommon('masters'),
		data: JSON.stringify(getRequestForMaster(formId, 'SUBJECT-LIST-BY-GRADE-TEACHER-ID', standardId, teacherId, callfrom, lmsPlatform)),
		dataType: 'json',
		cache: false,
		timeout: 600000,
		async: false,
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				console.log("Response Data  " + data)
				buildDropdown(data['mastersData']['subject'], $("#" + formId + " #" + toElementId), 'Select course');
			}
		},
		error: function (e) {
			console.log(e);
			//	showMessage(true, e.responseText);
			//$("#"+formId+" #pastTaughtSubjectId").prop("disabled", false);
		}
	});
}


function validateRequestForRequestDemoMeetingSlots(formId, moduleId) {
	if ($('#weekCount').val() == '' || $('#weekCount').val() == undefined) {
		showMessage(true, 'Session Type is required');
		return false;
	}
	if ($('#countryTimezoneId').val() == 0 || $('#countryTimezoneId').val() == undefined) {
		showMessage(true, 'Country Timezone is required');
		return false;
	}
	if ($('#dateCategory').val() == '' || $('#dateCategory').val() == undefined) {
		showMessage(true, 'Session Type  is required');
		return false;
	}
	if ($('#meetingDateFrom').val() == '' || $('#meetingDateFrom').val() == undefined) {
		showMessage(true, 'Session Date From is required');
		return false;
	}
	if ($('#meetingDateTo').val() == '' || $('#meetingDateTo').val() == undefined) {
		showMessage(true, 'Session Date to is required');
		return false;
	}
	if (new Date($('#meetingDateFrom').val()) > new Date($('#meetingDateTo').val())) {//compare end <=, not >=
		showMessage(true, 'From date is less than To date');
		return false;
	}
	if ($('#timeHrsFrom').val() == '' || $('#timeHrsFrom').val() == undefined) {
		showMessage(true, 'Session time is required');
		return false;
	}
	if ($('#timeMinFrom').val() == '' || $('#timeMinFrom').val() == undefined) {
		showMessage(true, 'Session time is required');
		return false;
	}
	if ($('#timeHrsTo').val() == '' || $('#timeHrsTo').val() == undefined) {
		showMessage(true, 'Session time is required');
		return false;
	}
	if ($('#timeMinTo').val() == '' || $('#timeMinTo').val() == undefined) {
		showMessage(true, 'Session time is required');
		return false;
	}
	if ($('#timeInterval').val() == 0 || $('#timeInterval').val() == undefined) {
		showMessage(true, 'Time Interval is required');
		return false;
	}

	return true;
}
function getRequestForRequestDemoMeetingSlots(formId, requestType) {
	var request = {};
	var authentication = {};
	var requestData = {};
	var meetingSlotDTO = {};

	meetingSlotDTO['weekCount'] = $("#" + formId + " #weekCount").val();
	meetingSlotDTO['inActDate'] = $("#" + formId + " #inActDate").val();
	meetingSlotDTO['timezone'] = $("#" + formId + " #countryTimezoneId option:selected").attr('custom_timezone_id');
	meetingSlotDTO['timeZoneCheck'] = $("#" + formId + " #countryTimezoneId option:selected").val();
	meetingSlotDTO['dateCategory'] = $("#" + formId + " #dateCategory").val();
	meetingSlotDTO['startDate'] = $("#" + formId + " #meetingDateFrom").val();
	meetingSlotDTO['endDate'] = $("#" + formId + " #meetingDateTo").val();
	meetingSlotDTO['timeHrsFrom'] = $("#" + formId + " #timeHrsFrom").val();
	meetingSlotDTO['timeMinFrom'] = $("#" + formId + " #timeMinFrom").val();
	meetingSlotDTO['timeHrsTo'] = $("#" + formId + " #timeHrsTo").val();
	meetingSlotDTO['timeMinTo'] = $("#" + formId + " #timeMinTo").val();
	meetingSlotDTO['timeInterval'] = $("#" + formId + " #timeInterval").val();
	meetingSlotDTO['userId'] = $("#" + formId + " #userId").val();
	meetingSlotDTO['meetingType'] = requestType;
	meetingSlotDTO['timeIntervalValue'] = $("#" + formId + " #sessionbuffer").val();

	requestData['meetingSlotDTO'] = meetingSlotDTO;
	authentication['hash'] = getHash(); authentication['schoolId'] = SCHOOL_ID; authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = 'SCHOOL';
	authentication['userId'] = $("#" + formId + " #userId").val();
	request['authentication'] = authentication;
	request['requestData'] = requestData;
	return request;
}
function calendarRequestMeetingSlots(formId, moduleId, controlType, replaceId, requestType) {

	hideMessage('');
	if (!validateRequestForRequestDemoMeetingSlots(formId, moduleId)) {
		return false;
	}

	$.ajax({
		type: "POST",
		url: getURLForHTML('dashboard', 'meeting-dates-slots'),
		data: encodeURI("request=" + JSON.stringify(getRequestForRequestDemoMeetingSlots(formId, requestType))),
		dataType: 'html',
		cache: false,
		async: false,
		timeout: 600000,
		success: function (htmlContent) {
			if (htmlContent != "") {
				var stringMessage = [];
				stringMessage = htmlContent.split("|");
				if (stringMessage[0] == "FAILED" || stringMessage[0] == "EXCEPTION" || stringMessage[0] == "SESSIONOUT") {
					if (stringMessage[0] == "SESSIONOUT") {
						redirectLoginPage();
					} else {
						showMessage(true, stringMessage[1]);
					}
				} else {
					$('#listSlots').hide();
					$('.meetingGetSlotSave').hide();
					$('.meetingSave').show();
					$('#back').show();
					$('#' + replaceId).html(htmlContent)
				}
				return false;
			}
		},
		error: function (e) {
			//showMessage(true, e.responseText);
			return false;
		}
	});
}

function createDate(formId, elementId, startDate, endDate) {
	$('#' + formId + ' #' + elementId).datepicker({
		autoclose: true,
		format: 'mm-dd-yyyy',
		todayHighlight: true,
		startDate: startDate,
		endDate: endDate
	});
}

function createDateNew(formId, elementId, seltDate) {
	console.log("seltDate=> ", seltDate);
	$('#' + formId + ' #' + elementId).datepicker({
		startDate: seltDate,
		autoclose: true,
		format: 'mm-dd-yyyy',
		todayHighlight: true,
	});
	$('#' + formId + ' #' + elementId).datepicker().datepicker("setDate", seltDate);
}
function setStudentTecherSessionDate(formId, elementId, calenderId) {
	var stDate = $("#" + formId + " #weekPickerId option:selected").attr('custom_startDate');
	var edDate = $("#" + formId + " #weekPickerId option:selected").attr('custom_endDate');

	var sDate = stDate.split("-");
	var eDate = edDate.split("-");

	var sDate1 = new Date(sDate[0], sDate[1] - 1, sDate[2]);
	var currentDate = new Date();
	var startDate = '';
	if (sDate1.getTime() > currentDate.getTime()) {
		startDate = sDate1;
	} else {
		//		 currentDate.setDate(currentDate.getDate() + 1);
		startDate = currentDate;
	}
	var endDate = new Date(eDate[0], eDate[1] - 1, eDate[2]);
	createDate(formId, calenderId, startDate, endDate)
}
function callAssignStudentTeacher(formId, studentId, viewAssignStudentTeacher, assignStudentTeacher, viewAssignPastStudentTeacher, standardId) {
	hideMessage('');
	var data = {};
	data['studentId'] = studentId;
	data['viewAssignStudentTeacher'] = viewAssignStudentTeacher;
	data['assignStudentTeacher'] = assignStudentTeacher;
	data['viewAssignPastStudentTeacher'] = viewAssignPastStudentTeacher;
	data['standardId'] = standardId;
	data['userId'] = USER_ID;
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLForHTML('dashboard', 'assign-student-teacher'),
		data: JSON.stringify(data),
		dataType: 'html',
		cache: false,
		timeout: 600000,
		success: function (htmlContent) {
			if (htmlContent != "") {
				var stringMessage = [];
				stringMessage = htmlContent.split("|");
				if (stringMessage[0] == "FAILED" || stringMessage[0] == "EXCEPTION" || stringMessage[0] == "SESSIONOUT") {
					showMessage(true, stringMessage[1]);
				} else {
					$('#studentAssighnTeacherSupportContent').html(htmlContent);
				}
				return false;
			}
		},
		error: function (e) {
			console.log(e)
			//	showMessage(true, TECHNICAL_GLITCH);
			return false;
		}
	});
}
function calendarDateMeeting(replaceId, startDate, slotType) {
	var inActDate = $("#inActDate").val();
	var request = { startDate: startDate, slotType: slotType, disabledDate: inActDate };
	$.ajax({
		type: "POST",
		url: getURLForHTML('dashboard', 'meeting-dates'),
		contentType: "application/json",
		data: JSON.stringify(request),
		dataType: 'html',
		cache: false,
		async: false,
		timeout: 600000,
		success: function (htmlContent) {
			if (htmlContent != "") {
				var stringMessage = [];
				stringMessage = htmlContent.split("|");
				if (stringMessage[0] == "FAILED" || stringMessage[0] == "EXCEPTION" || stringMessage[0] == "SESSIONOUT") {
					if (stringMessage[0] == "SESSIONOUT") {
						redirectLoginPage();
					} else {
						showMessage(true, stringMessage[1]);
					}
				} else {
					$('#monthYear').html('');
					$('#' + replaceId).html(htmlContent);
				}
				return false;
			}
		},
		error: function (e) {
			//showMessage(true, e.responseText);
			return false;
		}
	});
}
function callAssignStudentTeacherContent(callFor) {
	var studentId = $('#studentTeacherMappingModalLabel #studentId').html();
	var studentName = $('#studentTeacherMappingModalLabel #studentName').html();
	var standardId = $('#studentTeacherMappingModalLabel #standardId').html();
	$('#viewStudentTeacherTab').removeClass('active');
	$('#viewStudentTeacherTab').removeClass('inactive-tab');
	$('#assignStudentTeacherTab').removeClass('active');
	$('#assignStudentTeacherTab').removeClass('inactive-tab');
	$('#viewPastStudentTeacherTab').removeClass('active');
	$('#viewPastStudentTeacherTab').removeClass('inactive-tab');
	if (callFor == 'view-assignStudentTeacher') {
		var controllType = "new";
		$('#viewStudentTeacherTab').addClass('active');
		$('#assignStudentTeacherTab').addClass('inactive-tab');
		$('#viewPastStudentTeacherTab').addClass('inactive-tab');
		callForDashboardData('formIdIfAny', 'student-teacher-linking-content?studentId=' + studentId + "&callFor=" + callFor + "&standardId=" + standardId + "&controllType=" + controllType, 'studentTeacherLinkingContent');
	} else if (callFor == 'assignStudentTeacher') {
		var controllType = "new";
		$('#viewStudentTeacherTab').addClass('inactive-tab');
		$('#assignStudentTeacherTab').addClass('active');
		$('#viewPastStudentTeacherTab').addClass('inactive-tab');
		callForDashboardData('formIdIfAny', 'student-teacher-linking-content?studentId=' + studentId + "&callFor=" + callFor + "&standardId=" + standardId + "&controllType=" + controllType, 'studentTeacherLinkingContent');
	} else if (callFor == 'view-assignPastStudentTeacher') {
		var controllType = "old";
		$('#viewStudentTeacherTab').addClass('inactive-tab');
		$('#assignStudentTeacherTab').addClass('inactive-tab');
		$('#viewPastStudentTeacherTab').addClass('active');
		callForDashboardData('formIdIfAny', 'student-teacher-linking-content?studentId=' + studentId + "&callFor=" + callFor + "&standardId=" + standardId + "&controllType=" + controllType, 'studentTeacherLinkingContent');
	}
}
function viewStudentTeacherMappingsLogs(studentId, subjectId, studentTeacherMappingId) {
	hideMessage('');
	var data = {}
	data['studentId'] = studentId;
	data['subjectId'] = subjectId;
	data['studentTeacherMappingId'] = studentTeacherMappingId;
	data['userId'] = USER_ID;
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLForHTML('dashboard', 'student-teacher-mapping-log-content'),
		data: JSON.stringify(data),
		dataType: 'html',
		cache: false,
		timeout: 600000,
		success: function (htmlContent) {
			if (htmlContent != "") {
				var stringMessage = [];
				stringMessage = htmlContent.split("|");
				if (stringMessage[0] == "FAILED" || stringMessage[0] == "EXCEPTION" || stringMessage[0] == "SESSIONOUT") {
					showMessage(true, stringMessage[1]);
				} else {
					$('#studentTeacherMappingLogContent').html(htmlContent);
				}
				return false;
			}
		},
		error: function (e) {
			console.log(e)
			//	showMessage(true, TECHNICAL_GLITCH);
			return false;
		}
	});
}
function submitStudentTeacherAssign(formId, moduleId) {
	hideMessage('');
	//	if(!validateRequestStudentTeacherAssign(formId,moduleId)){
	//		return false;
	//	}
	var me = $(this);
	if (me.data('requestRunning')) {
		return false;
	}
	me.data('requestRunning', true);
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLFor('dashboard', 'student-teacher-assign-submit'),
		data: JSON.stringify(getRequestForStudentTeacherAssign(formId, moduleId)),
		dataType: 'json',
		cache: false,
		timeout: 600000,
		success: function (data) {
			me.data('requestRunning', false)
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				//showMessage(false, data['message']);
				callAssignStudentTeacherContent('view-assignStudentTeacher');
			}
			return false;
		},
		error: function (e) {
			me.data('requestRunning', false)
			return false;
		}
	});
}
function getRequestForStudentTeacherAssign(formId, moduleId, subjectId, standardId, studentId, oldTeacherId, courseType) {
	var request = {};
	var authentication = {};
	var studentTeacherSavedMappingDTOArray = [];
	//	$("#assigTeacherLink tbody tr").each(function(){
	var studentTeacherSavedMappingDTO = {};
	//		var subjectId= $(this).find("td.subjectIdcls").attr("data-subjectId");
	//		var standardId= $(this).find("td.subjectIdcls").attr("data-standardId");
	var teacherId = $("#teacherId" + subjectId).val().trim();
	studentTeacherSavedMappingDTO['subjectId'] = subjectId;
	studentTeacherSavedMappingDTO['teacherId'] = teacherId;
	studentTeacherSavedMappingDTO['standardId'] = standardId;

	studentTeacherSavedMappingDTO['stdEnrollDate'] = $("#stdEnrollDate" + subjectId).val();
	studentTeacherSavedMappingDTO['steachEnrollStartDate'] = $("#steachEnrollStartDate" + subjectId).val();
	studentTeacherSavedMappingDTO['steachEnrollEndDate'] = $("#steachEnrollEndDate" + subjectId).val();
	if ($("#steachAmount" + subjectId).val() == undefined) {
		studentTeacherSavedMappingDTO['amount'] = 0;
	} else {
		studentTeacherSavedMappingDTO['amount'] = $("#steachAmount" + subjectId).val();
	}
	if ($("#steachEnrollEndDate" + subjectId).val().trim() != '') {
		if ($("#reasonEnrollEnd" + subjectId).val().trim() == '') {
			showMessage(true, 'Reason for ending enrollment is required.');
			return false;
		}
		studentTeacherSavedMappingDTO['reasonEnrollEnd'] = $("#reasonEnrollEnd" + subjectId).val();
		if ($("#reasonEnrollEnd" + subjectId).val().trim() == 'Other') {
			if ($("#otherReason" + subjectId).val().trim() == '') {
				showMessage(true, 'Reason for ending enrollment is required');
				return false;
			}
			studentTeacherSavedMappingDTO['otherReason'] = $("#otherReason" + subjectId).val().trim();
		}
	}

	studentTeacherSavedMappingDTO['studentId'] = studentId;//$(this).find("td.subjectIdcls").attr("data-studentId");
	studentTeacherSavedMappingDTO['oldTeacherId'] = oldTeacherId; //$(this).find("td.subjectIdcls").attr("data-assignId");
	studentTeacherSavedMappingDTO['courseType'] = courseType; //$(this).find("td.subjectIdcls").attr("data-courseType");
	studentTeacherSavedMappingDTOArray.push(studentTeacherSavedMappingDTO);
	//	});

	request['studentTeacherSavedMappingDTO'] = studentTeacherSavedMappingDTO;
	authentication['hash'] = getHash(); authentication['schoolId'] = SCHOOL_ID; authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = moduleId;
	authentication['sessionUserId'] = USER_ID;
	request['authentication'] = authentication;
	return request;
}

function validateRequestForSubmitMeetingSlots(formId, moduleId, controllType) {
	if (controllType == 'ADD') {

		if ($('#countryTimezoneId').val() == 0 || $('#countryTimezoneId').val() == undefined) {
			showMessage(true, 'Time-Zone is required');
			return false;
		}
		if ($('#weekPickerId').val() == 0 || $('#weekPickerId').val() == undefined) {
			showMessage(true, 'Meeting week is required');
			return false;
		}
		if ($('#meetingDate').val() == '' || $('#meetingDate').val() == undefined) {
			showMessage(true, 'Meeting Date is required');
			return false;
		}
		if ($('#startTime').val() == '' || $('#startTime').val() == undefined) {
			showMessage(true, 'Start Time is required');
			return false;
		}
		if ($('#timeInterval').val() == 0 || $('#timeInterval').val() == undefined) {
			showMessage(true, 'Time Interval is required');
			return false;
		}
	} else if (controllType == 'UPDATE') {
		if ($('#meetingResult').val() == '' || $('#meetingResult').val() == undefined) {
			showMessage(true, 'Meeting Result is required');
			return false;
		}
	} else if (controllType == 'ADDURL') {
		if ($('#meetingUrl').val() == '' || $('#meetingUrl').val() == undefined) {
			showMessage(true, 'Meeting Link is required');
			return false;
		}
	}
	return true;
}

function submitMeetingForSlots(formId, moduleId, controllType) {
	hideMessage('');
	data['moduleId'] = moduleId;
	data['controllType'] = controllType;
	data['userId'] = USER_ID;
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLForHTML('dashboard', 'student-teacher-mapping-log-content'),
		data: JSON.stringify(data),
		dataType: 'html',
		cache: false,
		timeout: 600000,
		success: function (htmlContent) {
			if (htmlContent != "") {
				var stringMessage = [];
				stringMessage = htmlContent.split("|");
				if (stringMessage[0] == "FAILED" || stringMessage[0] == "EXCEPTION" || stringMessage[0] == "SESSIONOUT") {
					showMessage(true, stringMessage[1]);
				} else {
					$('#studentTeacherMappingLogContent').html(htmlContent);
				}
				return false;
			}
		},
		error: function (e) {
			console.log(e)
			//	showMessage(true, TECHNICAL_GLITCH);
			return false;
		}
	});
}

function getRequestForSubmitMeetingSlots(formId, moduleId, controllType) {
	var request = {};
	var authentication = {};
	var requestData = {};
	var meetingSlotDTO = {};

	if (controllType == 'ADD') {
		meetingSlotDTO['meetingType'] = "STUDENT_DOUBT_SESSION";

		meetingSlotDTO['timezone'] = $('#countryTimezoneId option:selected').attr('custom_timezone_id');
		meetingSlotDTO['timeZoneCheck'] = $('#countryTimezoneId').val();
		meetingSlotDTO['slotType'] = $('#meetingCategory1').val();

		var meetDate = $("#" + formId + " #meetingDate").val();
		meetDate = meetDate.split("-");
		meetingDate = meetDate[2] + "-" + meetDate[0] + "-" + meetDate[1];

		meetingSlotDTO['meetingDate'] = meetingDate;

		meetingSlotDTO['weekID'] = $("#" + formId + " #weekPickerId").val();
		var startTime = $("#" + formId + " #startTime").val();
		meetingSlotDTO['startTime'] = startTime;

		var interval = $("#" + formId + " #timeInterval option:selected").val();
		var endTime = new Date("2016/09/12 " + startTime + ":00");
		endTime.setMinutes(endTime.getMinutes() + parseInt(interval));
		endTime = endTime.getHours() + ":" + endTime.getMinutes();

		meetingSlotDTO['endTime'] = endTime;
		meetingSlotDTO['subject'] = "STUDENT_DOUBT_SESSION";
		meetingSlotDTO['status'] = "0";
	} else if (controllType == 'UPDATE') {
		meetingSlotDTO['controllType'] = controllType;
		meetingSlotDTO['meetingType'] = "STUDENT_DOUBT_SESSION";
		meetingSlotDTO['meetingId'] = $("#" + formId + " #meetingId").val();
		meetingSlotDTO['meetingResult'] = $("#" + formId + " #meetingResult option:selected").val();
	} else if (controllType == 'ADDURL') {
		meetingSlotDTO['controllType'] = controllType;
		meetingSlotDTO['meetingType'] = "STUDENT_DOUBT_SESSION";
		meetingSlotDTO['meetingId'] = $("#" + formId + " #meetingId").val();
		meetingSlotDTO['meetingUrl'] = $("#" + formId + " #meetingUrl").val();
	} else if (controllType == 'SENDMAIL') {
		meetingSlotDTO['controllType'] = controllType;
		meetingSlotDTO['meetingType'] = "STUDENT_DOUBT_SESSION";
		meetingSlotDTO['meetingId'] = $("#" + formId + " #meetingId").val();
	}

	requestData['meetingSlotDTO'] = meetingSlotDTO;
	authentication['hash'] = getHash(); authentication['schoolId'] = SCHOOL_ID; authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = moduleId;
	authentication['userId'] = $("#" + formId + " #userId").val();
	request['authentication'] = authentication;
	request['requestData'] = requestData;
	return request;
}

// function createGotoMeetingLink(userId, meetingId, roleModuleId, meetingType) {
// 	if (tt == 'theme1') {
// 		hideMessage('');
// 	} else {
// 		hideMessageTheme2('');
// 	}
// 	customLoader(true);
// 	$.ajax({
// 		type: "GET",
// 		contentType: "application/json",
// 		url: getURLForHTML('meeting', 'auth/creatMeeting'),
// 		data: "userId=" + userId + "&entityTypeId=" + meetingId + "&meetingType=" + meetingType + "&schoolId=" + SCHOOL_ID,
// 		dataType: 'json',
// 		cache: false,
// 		timeout: 600000,
// 		success: function (data) {
// 			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
// 				if (tt == 'theme1') {
// 					showMessage(true, data['message']);
// 				} else {
// 					showMessageTheme2(0, data['message'], '', true);
// 				}
// 			} else {
// 				if (tt == 'theme1') {
// 					showMessage(true, data['message']);
// 				} else {
// 					showMessageTheme2(1, data['message'], '', true);
// 				}
// 				if ("STUDENT_DOUBT_SESSION" == meetingType) {
// 					if (data['meetingVendor'] == 'ZOOM') {
// 						var createMeetingResponseDTO = data['createMeetingResponseDTO'];
// 						console.log("createMeetingResponseDTO :" + createMeetingResponseDTO['joinURL']);
// 						console.log("createMeetingResponseDTO :" + createMeetingResponseDTO['startURL']);
// 						$('.joinView' + meetingId).html("<a target='_blank' href='" + createMeetingResponseDTO['joinURL'] + "'><i class='jion-btn-url'></i>Enter classroom</a>")
// 						$('.linkStatus' + meetingId).text("Successfully Generated");
// 					} else if (data['meetingVendor'] == 'TEAM') {
// 						var createMeetingResponseDTO = data['createMeetingResponseDTO'];
// 						console.log("createMeetingResponseDTO :" + createMeetingResponseDTO['joinURL']);
// 						$('.joinView' + meetingId).html("<a target='_blank' href='" + createMeetingResponseDTO['joinURL'] + "'><i class='jion-btn-url'></i>Enter classroom</a>")
// 						$('.linkStatus' + meetingId).text("Successfully Generated");
// 					} else {
// 						$('.joinView' + meetingId).html("<a target='_blank' href='" + BASE_URL + CONTEXT_PATH + SCHOOL_UUID + '/' + 'meeting/auth/' + userId + '/' + meetingId + '/' + meetingType + '/' + UNIQUEUUID + "'><i class='jion-btn-url'></i>Enter classroom</a>")
// 						$('.linkStatus' + meetingId).text("Successfully Generated");
// 					}
// 				} else if ("REQUESTDEMO" == meetingType) {
// 					$('.joinView' + meetingId).html("<a target='_blank' href='" + BASE_URL + CONTEXT_PATH + SCHOOL_UUID + '/' + 'meeting/auth/' + userId + '/' + meetingId + '/' + meetingType + '/' + UNIQUEUUID + "'><i class='jion-btn-url'></i>Start School Tour</a>")
// 				}
// 			}
// 			customLoader(false);
// 			return false;
// 		},
// 		error: function (e) {
// 			//showMessage(true, e.responseText);
// 			return false;
// 		}
// 	});
// }

function validateRequestForRemoveMeetingsForStudentSessionSlots(formId) {
	var meetingIds = [];
	$(".slotDate").each(function () {
		$(".slotTime" + $(this).attr('id')).each(function () {
			meetingIds.push($(this).attr("data-slotId"));
		});
	});
	if (meetingIds.length == 0) {
		if (tt == 'theme1') {
			showMessage(true, 'No slots available for delete.');
		} else {
			showMessageTheme2(0, 'No slots available for delete.', '', true);
		}
		return false
	}
	return true;
}

function removeMeetingsForStudentSessionSlots(formId, moduleId, roleModuleId) {
	$(".confirmDeleteSlots").prop("disabled", true);

	if (tt == 'theme1') {
		hideMessage('');
	} else {
		hideMessageTheme2('');
	}
	if (!validateRequestForRemoveMeetingsForStudentSessionSlots(formId)) {
		$(".confirmDeleteSlots").prop("disabled", true);
		return true;
	}
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLFor('dashboard', 'meetingslots-remove-submit'),
		data: JSON.stringify(getRemoveMeetingsForStudentSessionSlots(formId, moduleId)),
		dataType: 'json',
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2') {
				$(".meetingSave").prop("disabled", false);
				if (tt == 'theme1') {
					showMessage(true, data['message']);
				} else {
					showMessageTheme2(0, data['message'], '', true);
				}
			} else {

				if (tt == 'theme1') {
					showMessage(false, data['message']);
				} else {
					showMessageTheme2(1, data['message'], '', true);
				}
				$('#deleteTeacherMeetingSlotsModal').modal('toggle');
				setTimeout(function () { callDashboardPageSchool(roleModuleId, 'create-manage-sessions'); }, 1000);
				$('body').removeClass('modal-open');
			}
			return false;
		}
	});
}
function getRemoveMeetingsForStudentSessionSlots(formId, moduleId) {
	var deleteSlotRequest = {};
	var authentication = {};
	var meetingIds = [];

	$("#" + formId + " .slotDate").each(function () {
		$("#" + formId + " .slotTime" + $(this).attr('id')).each(function () {
			meetingIds.push($(this).attr("data-slotId"));
		});
	});
	authentication['hash'] = getHash(); authentication['schoolId'] = SCHOOL_ID; authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = moduleId;
	authentication['userId'] = $("#" + formId + " #userId").val();
	deleteSlotRequest['authentication'] = authentication;
	deleteSlotRequest['meetingIds'] = meetingIds;
	return deleteSlotRequest;
}

function courseProviderList(formId, elementId) {
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLForCommon('masters'),
		data: JSON.stringify(getRequestForMaster('formId', 'ALL-COURSE-PROVIDER-LIST', 'courseProList')),
		dataType: 'json',
		cache: false,
		timeout: 600000,
		async: true,
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				var result = data['mastersData']['courseList'];
				var dropdown = $('#' + formId + ' #' + elementId);
				dropdown.html('');
				if (formId == 'teacherAssignForm') { } else {
					dropdown.append('<option value="">Select LMS Platform</option>');
				}

				$.each(result, function (k, v) {
					if (formId == 'teacherAssignForm') {
						// if (v.key == 37) {
						// 	dropdown.append('<option value="' + v.key + '">' + v.value + ' </option>');
						// 	//dropdown.prop("disabled",true)
						// }
						if (v.key == 36 || v.key == 37 || v.key == 38|| v.key==39|| v.key==40 || v.key==41) {
							if(v.key == 37){
								dropdown.append('<option value="' + v.key + '" selected>' + v.value + ' </option>');
							}else{
								dropdown.append('<option value="' + v.key + '">' + v.value + ' </option>');
							}
							//dropdown.prop("disabled",true)
						}
					} else {
						if (v.key == 36 || v.key == 37 || v.key == 38|| v.key==39|| v.key==40 || v.key==41) {
							dropdown.append('<option value="' + v.key + '">' + v.value + ' </option>');
							//dropdown.prop("disabled",true)
						}
					}
				});
			}
		}
	});
}


function getRequestForTeacherAssign(callfrom, subjectid) {
	if (subjectid == '') {
		if ($("#teacherAssignForm #subjectId").val() != ''
			&& $("#teacherAssignForm #subjectId").val() != undefined) {
			subjectid = $("#teacherAssignForm #subjectId").val();
		}
	}
	var name = $("#teacherAssignForm #teacherName").val();
	var applicationNo = $("#teacherAssignForm #applicationNo").val();
	var email = $("#teacherAssignForm #teacherEmail").val();
	var teacherAssignRequest = {};
	teacherAssignRequest['schoolId'] = SCHOOL_ID;
	teacherAssignRequest['subjectid'] = subjectid;
	if ($("#teacherAssignForm #standardId").val() != ''
		&& $("#teacherAssignForm #standardId").val() != undefined) {
		teacherAssignRequest['standardId'] = $("#teacherAssignForm #standardId").val();
	}

	if ($("#teacherAssignForm #countryId").val() != ''
		&& $("#teacherAssignForm #countryId").val() != undefined) {
		teacherAssignRequest['countryId'] = $("#teacherAssignForm #countryId").val();
	}

	if (name != '' && name != undefined) {
		teacherAssignRequest['teacherName'] = name.trim();
	}
	if (applicationNo != '' && applicationNo != undefined) {
		teacherAssignRequest['applicationNo'] = applicationNo.trim();
	}
	if (email != '' && email != undefined) {
		teacherAssignRequest['officialEmail'] = email.trim();
	}
	teacherAssignRequest['callFrom'] = callfrom;
	teacherAssignRequest['courseProviderId'] =  $("#teacherAssignForm #lmsPlatform").val();
	return teacherAssignRequest;
}

function getTeacherAssignList(callfrom, tbodyid, subjectid) {
	// if(callfrom==''){
	// 	callfrom = $("#callfrom").val();
	// }
	customLoader(true);

	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLForHTML('report', 'teacher-assign-form-content'),
		data: JSON.stringify(getRequestForTeacherAssign(callfrom, subjectid)),
		dataType: 'json',
		cache: false,
		timeout: 600000,
		async: true,
		success: function (data) {
			customLoader(false);
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if (data['status'] == '3') {
					redirectLoginPage();
				} else {
					if (tt == 'theme2') {
						//showMessageTheme2(2, data['message'],'',true);
						$('#' + tbodyid).html('<tr><td colspan="8"><b>Teacher not found on the basis of filter</b></td></tr>');
					} else if (tt == 'theme1') {
						//showMessage(true, data['message']);
					}
				}
			} else {
				var logList = userLogList(data.teacherAssign, tbodyid);
				$('#' + tbodyid).html('');
				$('#' + tbodyid).html(logList);
				$(".leaveDates").datepicker({
					//autoclose: true,//
					startDate: new Date(),
					multidate: true,
					format: 'M dd, yyyy',
					keyboardNavigation: false

				}).on('change', function (e) {
					LEAVE_DATES = $(this).val();
					LEAVE_DATES = LEAVE_DATES.match(/[^,]+,[^,]+/g);
					var leaveDateClass = $(this).attr("data-leave-dates");
					$("." + leaveDateClass).html("")
					$.each(LEAVE_DATES, function (index, value) {
						$("." + leaveDateClass).append("<li class='nav-item px-2'><p class='mb-0 full font-weight-bold text-left' data-leave-type='AUTO'>" + value + "</p></li>");
					});
				});
				// $(".leaveDates").keyup(function(e){
				// 	if(e.keyCode ==8 || e.keyCode == 46) {
				// 		$(".leaveDates").datepicker('update', "");
				// 	}
				// });
				setTimeout(function () {
					bindLeaveDate(data.teacherAssign);
				}, 500);
				// $('.dropdown-toggle').click(function(){
				// 	
				// 	$(this).parent().find(".dropdown-menu").addClass("show");
				// });

			}
		},
		error: function (e) {
			if (tt == 'theme2') {
				showMessageTheme2(2, TECHNICAL_GLITCH, '', true);
			} else if (tt == 'theme1') {
				showMessage(true, TECHNICAL_GLITCH);
			}
		}
	});
}




function userLogList(teacherAssign, tbodyid) {
	//console.log(teacherAssign);
	var htmlTbl = '';
	var autoInc = 1;
	if (teacherAssign.length > 0) {
		var totalFulltime = 0;
		var totalParttime = 0;
		for (md = 0; md < teacherAssign.length; md++) {
			var htmlTime = "";
			var startTimeValue = "";
			var endTimeValue = "";
			var timeRemove = "";
			var htmvarldt = "";
			var btnTitle = "View Leave Date";
			var teacherTimeList = teacherAssign[md]['teacherTimeList'];
			//
			var htmlTime = "";
			if (teacherTimeList != null) {


				for (var k = 0; k < teacherTimeList.length; k++) {
					var dayTimeValue = "<label class='mb-0 font-weight-bold' data-teach-day='" + teacherTimeList[k]['dayId'] + "'>" + teacherTimeList[k]['dayName'] + "</label>";
					var startTimeValue = "<label class='mb-0 font-weight-bold' data-teach-strtime='" + teacherTimeList[k]['startTime'] + "'>" + teacherTimeList[k]['displayStartTime'] + "</label>";
					var endTimeValue = "<label class='mb-0 font-weight-bold' data-teach-entime='" + teacherTimeList[k]['endTime'] + "' >" + teacherTimeList[k]['displayEndTime'] + "</label>";
					htmlTime += '<span class="text-left d-inline-flex align-items-center full"> '
					htmlTime += '<div class="full text-left mt-1 mr-1 day_time-' + teacherAssign[md]['teacherId'] + '">' + dayTimeValue + '</div>'
					htmlTime += '<div class="full text-left mt-1 mr-1 start_time-' + teacherAssign[md]['teacherId'] + '">' + startTimeValue + '</div>'
					htmlTime += '<div class="full text-left mt-1 ml-1 end_time-' + teacherAssign[md]['teacherId'] + '">' + endTimeValue + '</div>'
					htmlTime += '<a class="text-danger text-white cursor" onclick="removeTime(' + teacherTimeList[k]['dayId'] + ')"><i class="fa fa-trash"></i></a></span>';
				}
			}
			var userLeaveDateList = teacherAssign[md]['userLeaveDate'];
			//
			if (userLeaveDateList != null) {
				var leaDate = [];
				$.each(userLeaveDateList, function (key, val) {
					htmvarldt += "<li class='nav-item px-2'>";
					htmvarldt += "<p class='mb-0 full font-weight-bold text-left' data-leave-type='" + val.dataType + "'>" + val.displayStartDate + "</p>";
					htmvarldt += "</li>";
				});
			} else {
				btnTitle = "No Leave";
			}

			if (teacherAssign[md]['employeeType'] == 'Full-Time') {
				totalFulltime = totalFulltime + 1;
			}
			if (teacherAssign[md]['employeeType'] == 'Part-Time') {
				totalParttime = totalParttime + 1;
			}

			var gradehtml = divPopup("Grade's", 'grade', teacherAssign[md]['teacherId']);
			var coursehtml = divPopup("Course", 'course', teacherAssign[md]['teacherId']);

			getTeacherAssignStudentList('Grade', 'STANDARD', 'grade', teacherAssign[md]['teacherId'], teacherAssign[md]['workingHrs']);
			getTeacherAssignStudentList('Course', 'SUBJECT', 'course', teacherAssign[md]['teacherId'], teacherAssign[md]['workingHrs']);

			var ordrFun = "teacherOrderTr('teacherAssignForm');";

			htmlTbl += '<tr class="assignTeacherItem teacher-ord-' + autoInc + '" id="assignTeacherItem' + teacherAssign[md]['teacherId'] + '">';
			htmlTbl += '<td class="text-center">&nbsp;&nbsp;' + (autoInc) + '</td>';
			htmlTbl += '<td class="text-left"><input type="hidden" class="assignTeacherto"  value="' + teacherAssign[md]['userId'] + '">'
			htmlTbl += '<input type="hidden" class="assignSubject"  value="' + teacherAssign[md]['subjectId'] + '" />'
			htmlTbl += '<input type="hidden" class="assignTeacherId"  value="' + teacherAssign[md]['teacherId'] + '" />'
			htmlTbl += '<span id="teachername' + teacherAssign[md]['teacherId'] + '">' + teacherAssign[md]['teacherName'] + ' | ' + teacherAssign[md]['employeeType'] +' | ' + teacherAssign[md]['applicationNo'] + '</span>';
			htmlTbl += '<br/>' + gradehtml + ' |  ' + coursehtml;
			htmlTbl += '<br/>' + teacherAssign[md]['cityName'] + ' | ' + teacherAssign[md]['countryName'] + ' | ' + (teacherAssign[md]['timezone']).toString().replace("/", ',');
			htmlTbl += '</td>';
			htmlTbl += '<td class="text-left" ><span class="d-inline-block bg-danger text-white p-1 font-weight-bold mr-1 mb-1 text-center" style="min-width:30px;">' + teacherAssign[md]['agreedHrs'] + '</span><span class="d-inline-block bg-success text-white p-1 font-weight-bold mr-1 mb-1 text-center" style="min-width:30px;">' + teacherAssign[md]['completeHrs'] + '</span><span class="d-inline-block bg-warning text-white p-1 font-weight-bold mr-1 mb-1 text-center" style="min-width:30px;">' + teacherAssign[md]['pendingHrs'] + '</span>';
			htmlTbl += '<br/><span class="d-inline-block bg-alternate text-white p-1 font-weight-bold mr-1 mb-1 text-center" style="min-width:30px;" id="ass_student_' + teacherAssign[md]['teacherId'] + '">0</span><span class="d-inline-block mr-1 mb-1 text-center" id="total_student_' + teacherAssign[md]['teacherId'] + '">0</span>';
			htmlTbl += '<br/><span class="d-inline-block bg-dark text-white p-1 font-weight-bold mr-1 mb-1 text-center" style="min-width:30px;" id="pl_student_' + teacherAssign[md]['teacherId'] + '">0</span><span class="d-inline-block text-white p-1 font-weight-bold mr-1 mb-1 text-center" style="min-width:30px; background-color: #ff059d;" id="gl_student_' + teacherAssign[md]['teacherId'] + '">0</span>';
			htmlTbl += '</td>';
			htmlTbl += '<td class="text-center"><input type="text" name="orderBy" class="rowindex" value="' + (teacherAssign[md]['orderBy'] == null ? autoInc : teacherAssign[md]['orderBy']) + '" size="5"  maxlength="5" ' + (teacherAssign[md]['teacherActivate'] == 'Y' ? '' : 'disabled') + ' autocomplete="off" onfocusout="tableOrdering(this,\'TeacherAssignToStudent\',\'assignTeacherItem' + teacherAssign[md]['teacherId'] + '\')" /></td>';
			htmlTbl += '<td class="text-center"><input type="text" name="totalAssignStudent" class="totalAssignStudent" value="' + teacherAssign[md]['totalStudent'] + '" size="5"  maxlength="5"  ' + (teacherAssign[md]['teacherActivate'] == 'Y' ? '' : 'disabled') + '/></td>';
			htmlTbl += '<td class="text-center"><label class="switch" >';
			htmlTbl += '<input class="switch-input assignActiveStudent" id="assignActiveStudent' + autoInc + '"  type="checkbox" ' + (teacherAssign[md]['teacherActivate'] == 'Y' ? 'checked' : '') + '  value="' + teacherAssign[md]['teacherActivate'] + '"';
			htmlTbl += 'onclick="activeTeacher(' + teacherAssign[md]['userId'] + ',' + (teacherAssign[md]['teacherActivate'] == 'Y' ? 0 : 1) + ',' + (teacherAssign[md]['orderBy'] == null ? autoInc : teacherAssign[md]['orderBy']) + ',' + teacherAssign[md]['subjectId'] + ');"  data-size="mini"/>';
			htmlTbl += '<span class="switch-label" data-on="Yes" data-off="No"></span> <span class="switch-handle"></span>';
			htmlTbl += '</label></td>';
			htmlTbl += '<td class="text-center teacher-start-end-time' + teacherAssign[md]['teacherId'] + '">';
			//htmlTbl += '<a href="javascript:void(0);" class="btn btn-sm btn-primary mr-1" onclick="addLiveClassModal(' + teacherAssign[md]['teacherId'] + ',' + teacherAssign[md]['userId'] + ',\'teacherLeaveSchedule\',true,\'add\',\'' + teacherAssign[md]['changeSlotDate'] + '\',\'\',\'taskNameDropdow\',\'' + teacherAssign[md]['agreedHalfHours'] + '\',\'TEACHER\');" >Add | Edit Teacher Availablity</a>';
			htmlTbl += '<br/><a href="javascript:void(0);" class="btn btn-sm btn-primary mr-1" onclick="getAvailability('+teacherAssign[md]['userId']+');" >Add | Edit Teacher Availablity</a>';
			htmlTbl += '</td>';
			// htmlTbl += '<td class="text-center">';
			// htmlTbl += '<div class="dropdown d-inline-block"><button type="button" aria-haspopup="true" aria-expanded="false" data-toggle="dropdown" class="mb-2 mr-2 dropdown-toggle btn btn-sm  btn-primary" style="font-size:11px" id="leave_dates_btn_' + teacherAssign[md]['teacherId'] + '">' + btnTitle + '</button>'
			// htmlTbl += '<div tabindex="-1" role="menu" aria-hidden="true" class="dropdown-menu">';
			// htmlTbl += '<ul class="nav flex-column px-2">';
			// htmlTbl += '<li class="nav-item-header nav-item pl-0">Leave Date</li>';
			// htmlTbl += '<li class="nav-item">';
			// htmlTbl += '<input type="text" name="leaveDates" id="leave_dates-' + teacherAssign[md]['teacherId'] + '" autocomplete="off" class="mr-2 leaveDates full form-control" placeholder="Select leave date"  data-leave-dates="leave_dates' + teacherAssign[md]['teacherId'] + '" onkeydown="return false" />';
			// htmlTbl += '</li>';
			// //htmvarldt
			// htmlTbl += '</ul>';
			// htmlTbl += '<ul class="nav flex-column px-2 mt-2 leave_dates' + teacherAssign[md]['teacherId'] + '">';
			// htmlTbl += htmvarldt;
			// htmlTbl += '</ul>';
			// htmlTbl += '</div>';
			// htmlTbl += '</td>';

			htmlTbl += '</tr>';

			autoInc = autoInc + 1;
		}
		$(".span-fulltime").text(totalFulltime);
		$(".span-parttime").text(totalParttime);
	}
	return htmlTbl;
}

function getOpenPrefrenceTimePopup(callfrom, modalID, teacherid, teacherUserid, slotChangeLimit, slotStartDay, slotChangeValid, slotChangeDate, updateSlotDate, slotTillDate, controlType, taskID, minihrs, maxhrs, timeSlotType, agreedHrs, agreedHalfHrs, agreedAvgHrs,userRole) {
	$("#" + modalID + " #teacherTimeSaveDismiss").show();
	$("#" + modalID + " #availabilityDay").attr('disabled', false);

	$("#" + modalID).scrollTop(0);

	WEEKLIST_ARR = [];
	var cntype = controlType.split("-");
	var cvType = "view";
	if (cntype.length > 1) {
		controlType = cntype[0];
		cvType = cntype[1];
	}
	$("#" + modalID + " #changeSlotLimit").val(0);
	$("#" + modalID + " #changeSlotStartDay").val(0);
	$("#" + modalID + " #changeSlotValid").val(0);
	$("#" + modalID + " #changeSlotDate").val("");
	$("#" + modalID + " #updateSlotDate").val("");
	$("#" + modalID + " #controlType").val(controlType);
	$("#" + modalID + " #timeSaveTeacherId").val(teacherid);
	$("#" + modalID + " #timeSaveTeacherUserId").val(teacherUserid);
	$("#" + modalID + " #slotTillDate").val(slotTillDate);
	$("#" + modalID + " #slotLimitHrs").val(minihrs);
	$("#" + modalID + " #slotLimitMaxHrs").val(maxhrs);
	$("#" + modalID + " #timeSlotType").val(timeSlotType);
	$("#" + modalID + " #agreedHrs").val(agreedHrs);
	$("#" + modalID + " #agreedAvgHrs").val(agreedAvgHrs);

	$("#" + modalID + " .agreedHrs").text(agreedHrs);
	$("#" + modalID + " .agreedHalfHrs").text(agreedHalfHrs);
	$("#" + modalID + " .agreedAvgHrs").text(agreedAvgHrs);

	$(".added-availability").html("");

	$("#" + modalID + " #changeSlotLimit").val(slotChangeLimit);
	$("#" + modalID + " #changeSlotStartDay").val(slotStartDay);
	$("#" + modalID + " #changeSlotValid").val(slotChangeValid);
	$("#" + modalID + " #changeSlotDate").val(slotChangeDate);
	$("#" + modalID + " #updateSlotDate").val(updateSlotDate);
	$("#" + modalID + " #submitFrom").val(callfrom);//teacher-profile
	if (controlType == 'edit') {
		callTimePreferenceByDate(callfrom, teacherid, teacherUserid, userRole, updateSlotDate, modalID, cvType, 0);
	}
	if (callfrom == 'teacher-profile' || callfrom == 'teacher-my-slot') {
		$("#timePreferencePopup").removeClass("d-none");
		$('#timePreferencePopup').modal('show');
	}



}

function addLiveClassModal(teacherid, teacherUserid, modalID, isValid, controlType, changeSlotDate, updateSlotDate, taskID, maxhrs, data_by_role) {
	$("#" + modalID + " #timeSaveTeacherId").val(teacherid);
	$("#" + modalID + " #timeSaveTeacherUserId").val(teacherUserid);
	$("#" + modalID + " #controlType").val(controlType);
	$("#" + modalID + " #agreedHalfHrs").val(maxhrs);
	$("#" + modalID + " #availabilityDay").attr('disabled', false);
	$("#" + modalID + " .added-availability").html('');
	WEEKLY_TIME = [];
	WEEKLIST_ARR = [];

	// $("#availabilityDay, #taskNameDropdow").select2({
	// 	theme:"bootstrap4",
	// 	//dropdownParent:"#"+modalID,
	// })
	$(".added-live-class").html("");
	$(".add-live-class").empty();
	$(".add-leave").empty();

	$("#" + modalID + " #changeSlotDate").val(changeSlotDate);
	var addLiveClassBtn = '<a href="javascript:void(0);" class="btn btn-outline-primary py-2 d-inline-flex align-items-center" onclick="getTimeForTeacher(' + teacherUserid + ',\'' + modalID + '\',\'' + isValid + '\',\'success\',\'added-availability\', \'availabilityDay\', \'start_time_\',\'end_time_\',\'taskNameDropdow\')"><i class="fa fa-plus"></i>Add</a>'
	if ($(".add-live-class > .btn").length < 1 && $(".add-admin-task > .btn").length < 1 && $(".add-leave > .btn").length < 1) {
		$(".add-live-class").append(addLiveClassBtn);
	}

	$(".live-class-start-time,.live-class-end-time,.admin-task-start-time,.admin-task-end-time,.leave-start-time,.leave-end-time,.leave-dates").val('');
	$(".live-class-dropdown, .admin-task-dropdown").val('').trigger('change');
	$(".live-class-start-time").attr("id", 'start_time_' + teacherUserid);
	$(".live-class-end-time").attr("id", 'end_time_' + teacherUserid);
	$(".live-class-start-time").attr("name", 'start_time_' + teacherUserid);
	$(".live-class-end-time").attr("name", 'end_time_' + teacherUserid);


	$(".leaveDates").datepicker({
		//autoclose: true,//
		startDate: new Date(),
		multidate: true,
		format: 'M dd, yyyy',
		keyboardNavigation: false

	}).on('change', function (e) {
		LEAVE_DATES = $(this).val();
		LEAVE_DATES = LEAVE_DATES.match(/[^,]+,[^,]+/g);
		var leaveDateClass = $(this).attr("data-leave-dates");
		$("." + leaveDateClass).html("")
		$.each(LEAVE_DATES, function (index, value) {
			$("." + leaveDateClass).append("<li class='nav-item px-2'><p class='mb-0 full font-weight-bold text-left' data-leave-type='AUTO'>" + value + "</p></li>");
		});
	});
	$(".leaveDates").keyup(function (e) {
		if (e.keyCode == 8 || e.keyCode == 46) {
			$(".leaveDates").datepicker('update', "");
		}
	});
	//alert("Sfda")
	$('#start_time_' + teacherUserid).timepicker({ format: 'HH:mm', });
	$('#end_time_' + teacherUserid).timepicker({ format: 'HH:mm', });
	// $('.timepicker').timepicker({
	// 	format:'HH:mm',
	// 	//maxTime: "11:00",
	// 	//minTime: "10:00",
	// });
	$('.timepicker').on("click", function () {
		var zIndex = parseInt($(this).closest(".modal.fade.show, .modal.fade-scale").css("z-index")) + 1999;
		$(".popover.timepicker-popover").css({ "z-index": zIndex })
	});
	$(".live-class-dropdown").select2({
		theme: "bootstrap4",
		placeholder: "Select day"
	}).on("select2:open", function () {
		var zIndex = parseInt($(this).closest(".modal.fade.show, .modal.fade-scale").css("z-index")) + 1999;
		$(".select2-container--open").css({ "z-index": zIndex });
	});
	$(".admin-task-dropdown").select2({
		theme: "bootstrap4",
		placeholder: "Select day"
	}).on("select2:open", function () {
		var zIndex = parseInt($(this).closest(".modal.fade.show, .modal.fade-scale").css("z-index")) + 1999;
		$(".select2-container--open").css({ "z-index": zIndex });
	});
	// $(".slick-slider").not('.slick-initialized').slick({
	// 	infinite:false
	// });
	// //$("#"+modalID).modal("show");
	// $("#"+modalID).on('shown.bs.modal', function(){
	// 	$('.slick-slider').slick('setPosition');
	// });	

	if (USER_ROLE != "TEACHER") {
		callTeacherTimePreference('admin-panel', teacherid, teacherUserid, data_by_role, modalID, "N");

	} else {
		$("#" + modalID).modal("show");
	}
}

function bindLeaveDate(teacherAssign) {
	if (teacherAssign.length > 0) {
		for (md = 0; md < teacherAssign.length; md++) {
			var userLeaveDateList = teacherAssign[md]['userLeaveDate'];
			if (userLeaveDateList != null) {
				var leaDate = [];
				$.each(userLeaveDateList, function (key, val) {
					if (val.startDate != null) {
						var strdate = (val.startDate).toString().split("-");
						leaDate.push(new Date(strdate[0], parseInt(strdate[1]) - 1, strdate[2]));
					}
				});
				$('#leave_dates-' + teacherAssign[md]['teacherId']).datepicker('setDate', leaDate);
			}

			// var activeDaysList=teacherAssign[md]['activeDays'];
			// if(activeDaysList!=null){
			// 	$.each(activeDaysList, function(key, val) {
			// 		$("#day_"+val+"_"+teacherAssign[md]['teacherId']).prop("checked", true);;
			// 	});
			// }
		}
	}
}

function getRequestForTeacherAssignStd(title, reporttype, teacherId, workingHrs) {
	var teacherAssignRequest = {};
	teacherAssignRequest['schoolId'] = SCHOOL_ID;
	teacherAssignRequest['reportType'] = reporttype;
	teacherAssignRequest['teacherId'] = teacherId;
	teacherAssignRequest['workinghr'] = workingHrs;
	teacherAssignRequest['callFrom'] = '';
	return teacherAssignRequest;
}

function getTeacherAssignStudentList(title, reporttype, spanid, teacherId, workingHrs) {
	customLoader(false);
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLForHTML('report', 'teacher-assign-student-content'),
		data: JSON.stringify(getRequestForTeacherAssignStd(title, reporttype, teacherId, workingHrs)),
		dataType: 'json',
		cache: false,
		timeout: 600000,
		async: true,
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if (data['status'] == '3') {
					redirectLoginPage();
				} else {
					if (tt == 'theme2') {
						//showMessageTheme2(2, data['message'],'',true);
					} else if (tt == 'theme1') {
						//showMessage(true, data['message']);
					}
				}
			} else {
				if (reporttype != '') {
					var logList = getStuddentCountTr(data.gradeList, reporttype, spanid, teacherId, data.changeSlotDate);
					$('#' + spanid + '_' + teacherId).html('');
					$('#' + spanid + '_' + teacherId).html(logList);
				} else {
					var stlist = getStuddentListTbody(data.teacherAssign);
					$('#stdAssignList').dataTable().fnDestroy();
					$('#' + spanid).html('');
					$('#' + spanid).html(stlist);
					$('#stdAssignList').DataTable();
					var teachname = $("#teachername" + teacherId).text();
					$("#teacherAssignName").text(teachname);
					$("#studentAssignListPopup").modal('show');
				}
			}
		},
		error: function (e) {
			if (tt == 'theme2') {
				showMessageTheme2(2, TECHNICAL_GLITCH, '', true);
			} else if (tt == 'theme1') {
				showMessage(true, TECHNICAL_GLITCH);
			}
		}
	});
}


function divPopup(title, spanid, teacherid) {
	var drpclass = "dropdown-menu-md";
	if (spanid == 'course') {
		drpclass = "dropdown-menu-xl"
	}
	var gradehtml = '';
	gradehtml += '<div class="btn-group dropdown" style="vertical-align: top !important;font-size:11px">'
	gradehtml += '<a href="#" aria-haspopup="true" aria-expanded="false" data-toggle="dropdown" class="mb-2 mr-2 dropdown-toggle">' + title + '<span class="gctotal_' + spanid + '_' + teacherid + '"></span></a>';
	gradehtml += '<div tabindex="-1" role="menu" aria-hidden="true" class="' + drpclass + ' dropdown-menu" style="font-size:11px !important;">';
	//gradehtml+='<div class="dropdown-menu-header">';
	//gradehtml+='<div class="dropdown-menu-header-inner bg-primary">';
	gradehtml += '<div class="menu-header-content"><h5 class="menu-header-title text-center ">' + title + '<span class="gctotal_' + spanid + '_' + teacherid + '"></span></h5></div>';
	//gradehtml+='</div>';
	//gradehtml+='</div>';
	gradehtml += '<div class="grid-menu grid-menu-3col">';
	gradehtml += '<div class="no-gutters row">';
	gradehtml += '<div class="col-sm-12 col-xl-12 pt-0" style="max-height: 200px;overflow-y: auto;">';
	gradehtml += '<table class="row-height-small" style="width:100%;">';
	gradehtml += '<tr><thead class="table-head-sticky">';
	gradehtml += '<th>' + title + '</th><th>Total</th><th style="width:60px">In-Active</th>';
	gradehtml += '</thead></tr>';
	gradehtml += '<tbody id="' + spanid + '_' + teacherid + '">';
	gradehtml += '</tbody>';
	gradehtml += '</table>';
	gradehtml += '</div></div></div></div></div>';
	return gradehtml;
}

function getStuddentCountTr(studentCount, reporttype, spanid, teacherid, changeSlotDate) {
	var htmlst = '';
	var assStudent = 0;
	var totStudent = 0;
	var totPlStudent = 0;
	var totGlStudent = 0;
	if (studentCount.length > 0) {
		$(".gctotal_" + spanid + "_" + teacherid).html(" (" + studentCount.length + ")")
		for (md = 0; md < studentCount.length; md++) {
			htmlst += '<tr>';
			htmlst += '<td>' + studentCount[md]['gradeName'] + '</td>';
			htmlst += '<td>' + studentCount[md]['studentCount'] + '</td>';
			htmlst += '<td>' + studentCount[md]['studentInActiveCount'] + '</td>';
			htmlst += '</tr>';
			if (reporttype == "STANDARD") {
				if (parseInt(studentCount[md]['assinedTotalStudent']) > 0) {
					assStudent = parseInt(studentCount[md]['assinedTotalStudent']);
				}
				totStudent = totStudent + parseInt(studentCount[md]['studentCount']);
				totPlStudent = totPlStudent + parseInt(studentCount[md]['studentPlActiveCount']);
				totGlStudent = totGlStudent + parseInt(studentCount[md]['studentGlActiveCount']);
			}

		}
	}
	if (reporttype == "STANDARD") {
		$("#ass_student_" + teacherid).text(assStudent);
		var studentClick = "getTeacherAssignStudentList('','','studentTeachAssignList','" + teacherid + "', '');";
		var studentTot = '<a style="min-width:30px;" class="d-inline-block text-center bg-info text-white p-1 font-weight-bold" href="javascript:void(0)" onclick="' + studentClick + '">' + totStudent + '</a>';
		$("#total_student_" + teacherid).html(studentTot);
		$("#pl_student_" + teacherid).html(totPlStudent);
		$("#gl_student_" + teacherid).html(totGlStudent);
	}

	return htmlst;
}

function getStuddentListTbody(studentList) {
	var htmlst = '';
	var a = 1;
	if (studentList.length > 0) {
		for (md = 0; md < studentList.length; md++) {
			htmlst += '<tr>';
			htmlst += '<td>' + (a) + '</td>';
			htmlst += '<td>' + studentList[md]['studentName'] + '</td>';
			htmlst += '<td>' + studentList[md]['gradeName'] + '</td>';
			htmlst += '<td>' + studentList[md]['registerType'] + '</td>';
			htmlst += '</tr>';
			a = a + 1;
		}
	}
	return htmlst;
}


function saveInactiveAssignTeacher(userId, checkedVal, activated, orderBy, assignSuject, newTheme) {
	if (newTheme) {
		hideMessageTheme2('');
	} else {
		hideMessage('');
	}

	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLForHTML('report', 'inactive-assign-teacher'),
		data: JSON.stringify(getRequestForInactiveAssignTeacher(userId, checkedVal, activated, orderBy, assignSuject)),
		dataType: 'json',
		cache: false,
		timeout: 600000,
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2') {
				if (newTheme) {
					showMessageTheme2(0, data['message'], '', true);
				} else {
					showMessage(true, data['message']);
				}
			} else {
				if (newTheme) {
					showMessageTheme2(1, data['message'], '', true);
				} else {
					showMessage(true, data['message']);
				}
				setTimeout(function () {
					var subjectid = '';
					if ($("#teacherAssignForm #subjectId").val() != '') {
						subjectid = $("#teacherAssignForm #subjectId").val();
					}
					getTeacherAssignList('subjectwise', 'teacherAssignBody', subjectid);
				}, 1500);

			}
			return false;
		},
		error: function (e) {
			//showMessage(true, e.responseText);
			return false;
		}
	});
}
function getRequestForInactiveAssignTeacher(userId, checkedVal, activated, orderBy, assignSuject) {
	var authentication = {};
	var teacherAssignRequest = {};
	teacherAssignRequest['orderBy'] = orderBy;
	teacherAssignRequest['userId'] = userId;
	teacherAssignRequest['subjectid'] = assignSuject;
	teacherAssignRequest['teacherActivate'] = activated == 0 ? 'N' : 'Y';
	teacherAssignRequest['updateAll'] = checkedVal;

	authentication['hash'] = getHash();
	authentication['schoolId'] = SCHOOL_ID;
	authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userId'] = USER_ID;
	authentication['userType'] = 'COMMON';
	teacherAssignRequest['authentication'] = authentication;
	return teacherAssignRequest;
}




function saveTeacherAssignToStudent(userId, tblId, callFrom, newTheme) {
	if (newTheme) {
		hideMessageTheme2('');
	} else {
		hideMessage('');
	}
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLForHTML('report', 'save-assign-teacher-tostudent'),
		data: JSON.stringify(getRequestForTeacherAssignStudent(userId, tblId, callFrom)),
		dataType: 'json',
		cache: false,
		timeout: 600000,
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2') {
				if (newTheme) {
					showMessageTheme2(0, data['message'], '', true);
				} else {
					showMessage(true, data['message']);
				}
			} else {

				if (newTheme) {
					showMessageTheme2(1, data['message'], '', true);
					setTimeout(function () {
						var subjectid = '';
						if ($("#teacherAssignForm #subjectId").val() != '') {
							subjectid = $("#teacherAssignForm #subjectId").val();
						}
						getTeacherAssignList('subjectwise', 'teacherAssignBody', subjectid);
					}, 1500);
				} else {
					showMessage(true, data['message']);
				}


			}
			return false;
		},
		error: function (e) {
			//showMessage(true, e.responseText);
			return false;
		}
	});
}

function getRequestForTeacherAssignStudent(userId, tblId, callFrom) {
	var authentication = {};
	var teacherAssignRequest = {};
	var teacherAssignList = [];


	$('#' + tblId + ' tr.assignTeacherItem').each(function () {
		var teacherTimeList = [];
		var teacherLeaveDateList = [];
		var activeDays = [];
		var teacherAssign = {};
		var teacherAssignId = $(this).find("td .assignTeacherId").val();
		teacherAssign['userId'] = $(this).find("td .assignTeacherto").val();
		teacherAssign['subjectId'] = $(this).find("td .assignSubject").val();
		teacherAssign['orderBy'] = $(this).find("td .rowindex").val();
		teacherAssign['totalStudent'] = $(this).find("td .totalAssignStudent").val();
		var grades = $(this).find("td .leadGrades").select2('val');
		if (grades != undefined) {
			teacherAssign['leadGrade'] = grades.toString();
		}

		var chckValue = $(this).find("td .assignActiveStudent").val();
		if (chckValue == undefined) { } else {
			teacherAssign['teacherActive'] = chckValue;
		}

		$('#time-wrapper-' + teacherAssignId + ' span').each(function () {

			var teacherTime = {};
			var dayTime = $(this).find('.day_time-' + teacherAssignId).find('label').attr('data-teach-day');
			var startTime = $(this).find('.start_time-' + teacherAssignId).find('label').attr('data-teach-strtime');
			var endTime = $(this).find('.end_time-' + teacherAssignId).find('label').attr('data-teach-entime');
			if (startTime != undefined) {
				teacherTime['dayId'] = dayTime;
				teacherTime['startTime'] = startTime;
				teacherTime['endTime'] = endTime;
				teacherTimeList.push(teacherTime);
			}
		});

		$('.leave_dates' + teacherAssignId + ' li').each(function () {
			if ($(this).find('p').attr('data-leave-type') != 'LEAVE') {
				var dateLs = $(this).find('p').text();
				teacherLeaveDateList.push(dateLs);
			}
		});

		// $("input[name='days_"+teacherAssignId+"[]']").each( function () {
		// 	if($(this).is(":checked")){
		// 		var dateLs = $(this).val();
		// 		activeDays.push(dateLs);
		// 	}
		// });

		teacherAssign['teacherTimeList'] = teacherTimeList;
		teacherAssign['teacherLeaveDate'] = teacherLeaveDateList;
		teacherAssign['activeDays'] = activeDays;
		if (callFrom == 'TEACH-ASSIGN-SYS') {
			teacherAssign['userRole'] = 'TEACHER';
		}

		teacherAssignList.push(teacherAssign);
	});

	teacherAssignRequest['teacherAssignList'] = teacherAssignList;
	teacherAssignRequest['callFrom'] = callFrom;
	var updateAll = "N";
	if ($("#allCourseAssign").is(':checked')) {
		updateAll = "Y";
	}
	teacherAssignRequest['updateAll'] = updateAll;
	authentication['hash'] = getHash();
	authentication['schoolId'] = SCHOOL_ID;
	authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userId'] = USER_ID;
	authentication['userType'] = 'COMMON';
	teacherAssignRequest['authentication'] = authentication;
	return teacherAssignRequest;
}


function teacherOrderTr(tblId) {
	//console.log(tblId);
	var ord = [];
	$('#' + tblId + ' tr.assignTeacherItem').each(function () {
		if ($(this).find("td .rowindex").val() != "") {
			var rowin = parseInt($(this).find("td .rowindex").val());
			ord.push(rowin);
		}

	});
	var orderloop = ord.sort();
	for (var i = 0; i < orderloop.length; i++) {
		var minusord = orderloop[i] - 1;
		$(".teacher-ord-" + orderloop[i] + "").insertAfter(".teacher-ord-" + minusord + "");
	}
}

var WEEKLY_LIST = {};
var WEEKLIST_ARR = [];

var weekDayList = {};
function getTimeForTeacher(teacherUserid, modalID, isValid, bgColor, appendTimeDiv, dayEle, startTimeID, endTimeID, taskID) {
	console.log('getTimeForTeacher');

	var minihrs = $("#" + modalID + " #slotLimitHrs").val();
	var agreedHalfHrs = $("#" + modalID + " #agreedHalfHrs").val();

	var changeSlotLimit = $("#" + modalID + " #changeSlotLimit").val();
	var changeSlotDate = $("#" + modalID + " #changeSlotDate").val();
	var controlType = $("#" + modalID + " #controlType").val();
	//var changeSlotDate = "2023-10-08"
	var slotTillDate = $("#" + modalID + " #slotTillDate").val();
	var timeSlotType = $("#" + modalID + " #timeSlotType").val();


	var dayId = '';
	var dayName = '';
	var liveClassStartTime = $("#" + startTimeID + teacherUserid).val();
	var liveClassEndTime = $("#" + endTimeID + teacherUserid).val();
	var addTask = $("#" + taskID + " option:selected").attr("data-task-name");
	if (addTask == '') {
		showMessageTheme2(0, "Please select a task");
		return false;
	}
	if (liveClassStartTime == liveClassEndTime) {
		showMessageTheme2(0, "Invaild start time and end time");
		return false;
	}
	if (liveClassStartTime == "") {
		showMessageTheme2(0, "Invaild start time");
		return false;
	}
	if (liveClassEndTime == "") {
		showMessageTheme2(0, "Invaild end time");
		return false;
	}
	var addDays = [];
	var count = '';



	if (dayEle == 'leave-dates') {
		if ($(".leave-dates").val() == undefined && $(".leave-dates").val() == null && $(".leave-dates").val() == '') {
			showMessageTheme2(0, "Please select date");
			return false;
		}
	} else {
		if ($("." + dayEle).val() != undefined && $("." + dayEle).val() != null && $("." + dayEle).val() != '') {
			dayId = $("." + dayEle).val();
			dayName = $("." + dayEle + " option:selected").attr("data-day-name");
		} else {
			showMessageTheme2(0, "Please select day");
			return false;
		}
	}

	if (dayId == '') {
		addTime = false;
		showMessageTheme2(2, "Please select Day");
		return false;
	}
	var startLiveClassTime = liveClassStartTime.split(':');
	var endLiveClassTime = liveClassEndTime.split(':');

	var slotType = "LIVE";
	if (appendTimeDiv == 'added-admin-task') {
		slotType = "ADMIN";
	}
	var stime = new Date(1990, 1, 1, startLiveClassTime[0], startLiveClassTime[1], 0);
	var edtime = new Date(1990, 1, 1, endLiveClassTime[0], endLiveClassTime[1], 0);
	var addTime = true;
	var addDayTime = false;
	var comingDates = [];
	var WEEKLY_TIME = [];
	if (controlType == 'edit') {
		if ($("#" + modalID + " #updateSlotDate").val() != "" && $("#" + modalID + " #updateSlotDate").val() != undefined) {
			var ddddts = new Date($("#" + modalID + " #updateSlotDate").val());
			comingDates[0] = ddddts;
			//WEEKLIST_ARR=[];
		}
	} else {
		comingDates = getMonthDaysDate((dayId - 1), changeSlotLimit, changeSlotDate, slotTillDate);
	}
	if (comingDates.length == 0) {
		showMessageTheme2(0, "The selected day has passed, please select a future day.");
		return false;
	}

	// $('.tr-live-class').each(function() { 
	// 	if($(this).find('span').length>3){
	// 		showMessageTheme2(0, "You have reached your maximum limit of time slots allowed");
	// 		addTime=false;
	// 		return false;

	// 	}
	// });
	if (stime.getTime() < edtime.getTime() && liveClassStartTime != '' && liveClassEndTime != '') {
		if (isValid) {
			var start_time = liveClassStartTime;
			const timeString12hr = new Date('1970-01-01T' + start_time + 'Z')
				.toLocaleTimeString('en-US', { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' }
				);
			var start_time_am_pm = timeString12hr;
			var end_time = liveClassEndTime;
			const etimeString12hr = new Date('1970-01-01T' + end_time + 'Z')
				.toLocaleTimeString('en-US', { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' }
				);
			var end_time_am_pm = etimeString12hr;

			///----VtimeValidation
			var starttime1 = stime.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false });
			var endtime1 = edtime.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false });

			var addDateTime = true;
			//---end vtime validation

			var stDateTime = new Date('1970-01-01T' + start_time + 'Z');
			var enDateTime = new Date('1970-01-01T' + end_time + 'Z');
			var diff = (Date.parse(enDateTime) - Date.parse(stDateTime)) / 1000 / 60;
			var hours = String(100 + Math.floor(diff / 60)).substr(1);
			var mins = String(100 + diff % 60).substr(1);

			var mhours = (hours + '.' + mins);
			if (addTask == 'Live Classes') {
				if (parseFloat(mhours) < parseFloat(minihrs)) {
					var minihrs1 = minihrs = '1.59' ? '2' : minihrs;
					addTime = false;
					showMessageTheme2(2, "Minimum " + minihrs1 + " hours of slot can be added in 'Live classes' Task.");
					return false;
				}
			}
			var totalAgreedSlot = 0;
			var curtotalgetSlot = 0;
			$('.curr-slot-hours').each(function () {
				var totalgetSlot = $(this).attr('data-total-hours');
				if (totalgetSlot != undefined) {
					curtotalgetSlot += parseInt(totalgetSlot);
				}
			});
			var nexttotalgetSlot = 0;
			$('.next-slot-hours').each(function () {
				var totalgetSlot = $(this).attr('data-total-hours');
				if (totalgetSlot != undefined) {
					nexttotalgetSlot += parseInt(totalgetSlot);
				}
			});

			if (timeSlotType == 'curr-slot') {
				totalAgreedSlot = curtotalgetSlot;
			} else if (timeSlotType == 'next-slot') {
				totalAgreedSlot = nexttotalgetSlot;
			}

			var vrtotalgetSlot = 0;
			$('.vr-slot').each(function () {
				var totalSlot = $(this).attr('data-total-vrhours');
				if (totalSlot != undefined) {
					vrtotalgetSlot += parseInt(totalSlot);
				}
			});

			totalAgreedSlot += vrtotalgetSlot;
			totalAgreedSlot = Number(totalAgreedSlot);
			var hrs = Math.floor(totalAgreedSlot / 3600);

			// if(parseInt(agreedHalfHrs)<=parseInt(hrs)){
			// 	addTime=false;
			// 	showMessageTheme2(2, "You have reached your "+changeSlotLimit+" days Agreed hours is "+parseInt(agreedHalfHrs)+" hourse limit of time slots allowed");
			// 	return false;
			// }

			if (addTime) {
				var datesHTML = '';
				var addRow = true;
				$.each(comingDates, function (key, value) {
					//addRow = true;
					addDateTime = true;
					var dateFormt = value.toDateString().split(" ");
					dateFormt = dateFormt[1] + ' ' + dateFormt[2] + ', ' + dateFormt[3];
					var dateWitDayName = value.toDateString().split(" ");
					var dateWitDayName = dateWitDayName[0] + ' ' + dateWitDayName[1] + ' ' + dateWitDayName[2] + ', ' + dateWitDayName[3];


					$('.tr-live-class').each(function () {
						var daysId = $(this).attr('data-day-id');
						var startdatee = $(this).attr('data-teach-date');
						var adTask = $(this).attr('data-slot-type');
						if(adTask=='SYS-TRAINING'){
							adTask='System Training';
						}else if(adTask=='LIVE'){
							adTask='Live Classes';
						}else{
							adTask='Admin Task'
						}

						if (dateFormt === startdatee) {
							var threeCondd = $(this).find('span').length;
							if (threeCondd > 3) {
								addDateTime = false;
								showMessageTheme2(2, "You have reached your maximum of 3 time slots per day.");
								return false;
							}
						}


						$($(this).find('span')).each(function () {
							var startTime = $(this).attr('data-teach-strtime');
							var endTime = $(this).attr('data-teach-entime');
							if (startTime != undefined) {
								if ((daysId == dayId)
									&& (dateFormt === startdatee)
									&& ((startTime <= starttime1 && endTime > starttime1)
										|| (startTime < endtime1 && endTime >= endtime1))
								) {
									// addTime=false;
									addDateTime = false;
									$("#startTime" + teacherUserid).val('');
									$("#endTime" + teacherUserid).val('');
									showMessageTheme2(2, "Time already selected for " + dateFormt);
									return false;

								}
							}
						});
					});
					//if(controlType!='edit'){
					$('.tr-live-class-profile').each(function () {
						var daysId = $(this).attr('data-day-id');
						var startdatee = $(this).attr('data-teach-date');
						$($(this).find('span')).each(function () {
							var startTime = $(this).attr('data-teach-strtime');
							var endTime = $(this).attr('data-teach-entime');
							if (startTime != undefined) {
								//found = true;
								if ((daysId == dayId)
									&& (dateFormt === startdatee)
									&& ((startTime <= starttime1 && endTime > starttime1)
										|| (startTime < endtime1 && endTime >= endtime1)
									)
								) {

									//if(found){
									addDateTime = false;
									// $("#startTime"+teacherUserid).val('');
									// $("#endTime"+teacherUserid).val('');
									showMessageTheme2(2, "Time already selected for " + startdatee);
									return false;
									//}
								}

							}
						});
					});
					//}

					if (addDateTime) {

						var teacherPreferTime = [];
						var preferTime = {};
						preferTime['startTime'] = start_time + ':00';
						preferTime['endTime'] = end_time + ':00';
						preferTime['displayStartTime'] = start_time_am_pm;
						preferTime['displayEndTime'] = end_time_am_pm;

						var hrsecond = toSeconds(hours, mins, 0);

						preferTime['totalHrsSpent'] = secondsToHms(hrsecond);
						teacherPreferTime.push(preferTime);
						if (WEEKLIST_ARR.length > 0) {
							//for (var j = 0; j < WEEKLIST_ARR.length ; j++) {
							var weekapr = WEEKLIST_ARR[key];
							if (weekapr == undefined) {
								var teacherTimePref = {};
								teacherTimePref['displayStartDate'] = dateWitDayName;
								teacherTimePref['startDate'] = dateFormt;
								teacherTimePref['dayId'] = dayId;
								teacherTimePref['taskName'] = addTask;
								teacherTimePref['teacherPreferTime'] = teacherPreferTime;
								teacherTimePref['duration'] = secondsToHms(hrsecond);
								WEEKLY_TIME.push(teacherTimePref);

								weekDayList = {};
								WEEKLY = [];
								if (WEEKLY_TIME[key] == undefined) {
									WEEKLY[0] = WEEKLY_TIME[0]
								} else {
									WEEKLY[0] = WEEKLY_TIME[key];
								}
								if (WEEKLY[0] != undefined) {
									weekDayList['weeklyTime'] = WEEKLY;
									WEEKLIST_ARR.push(weekDayList);
								}
							} else {
								var weekTime = weekapr.weeklyTime;
								for (var k = 0; k < weekTime.length; k++) {
									var teachTimepref = weekTime[k];
									if (teachTimepref != undefined) {
										if (teachTimepref.startDate == dateFormt
											&& teachTimepref.dayId == dayId
											&& teachTimepref.taskName == addTask
										) {

											var tims = (teachTimepref.duration.replace("h ", ".").replace("m", ""));
											var stims = tims.toString().split(".");
											var seconds1 = 0;
											if (stims.length > 1) {
												var hrs = stims[0] > 0 ? stims[0] : 0;
												var mns = stims[1] > 0 ? stims[1] : 0;
												seconds1 = toSeconds(hrs, mns, 0);
											} else {
												var hrs = stims[0] > 0 ? stims[0] : 0;
												seconds1 = toSeconds(hrs, 0, 0);
											}
											teachTimepref.duration = secondsToHms(seconds1 + hrsecond);
											var tPref = teachTimepref.teacherPreferTime;
											tPref.push(preferTime);
											addRow = false;
											//return false;
											break;
										} else {
											addRow = true;
										}
									}
								}
								if (addRow) {
									var teacherTimePref = {};
									teacherTimePref['displayStartDate'] = dateWitDayName;
									teacherTimePref['startDate'] = dateFormt;
									teacherTimePref['dayId'] = dayId;
									teacherTimePref['taskName'] = addTask;
									teacherTimePref['teacherPreferTime'] = teacherPreferTime;
									teacherTimePref['duration'] = secondsToHms(hrsecond);
									WEEKLY_TIME.push(teacherTimePref);
									if (WEEKLY_TIME[key] == undefined) {
										weekTime.push(WEEKLY_TIME[0]);
									} else {
										weekTime.push(WEEKLY_TIME[key]);
									}

								}
							}

							//}
						} else {
							var teacherTimePref = {};
							teacherTimePref['displayStartDate'] = dateWitDayName;
							teacherTimePref['startDate'] = dateFormt;
							teacherTimePref['dayId'] = dayId;
							teacherTimePref['taskName'] = addTask;
							teacherTimePref['teacherPreferTime'] = teacherPreferTime;
							teacherTimePref['duration'] = secondsToHms(hrsecond);
							WEEKLY_TIME.push(teacherTimePref);

							weekDayList = {};
							WEEKLY = [];
							WEEKLY[0] = WEEKLY_TIME[0];
							if (WEEKLY[0] != undefined) {
								weekDayList['weeklyTime'] = WEEKLY;
								WEEKLIST_ARR.push(weekDayList);
							}
						}

					}

				});

				if (controlType == 'edit') {
					$("#teacherTimeSave").show();
					bindEditVertualslot(appendTimeDiv, WEEKLIST_ARR, teacherUserid);
				} else {
					html = '';
					html = bindVertualSlot(appendTimeDiv, WEEKLIST_ARR, teacherUserid);
					if (html != '') {
						$("#slotAddText").text("Add More")
						$("#teacherTimeSave").show();
					}
					$("." + appendTimeDiv).html(html);
				}

				/////remaining time

				// var vvrtotalgetSlot=0;
				// $('.vr-slot').each(function() { 
				// 	var totalSlot =$(this).attr('data-total-vrhours');
				// 	if(totalSlot!=undefined){
				// 		vvrtotalgetSlot+=parseInt(totalSlot);
				// 	}
				// });

				// vvrtotalgetSlot = Number(vvrtotalgetSlot);
				// var hrss = Math.floor(vvrtotalgetSlot / 3600);
				// if(hrss>0){
				// 	var remaininghrs = parseInt(agreedHalfHrs)-parseInt(hrss);
				// 	$(".remainhrs").text(remaininghrs);
				// }



			}

			return true;
		}
	} else if ($("#" + startTimeID + teacherid).val() == undefined || $("#" + startTimeID + teacherid).val() == '') {
		showMessageTheme2(2, "Please select start time");
		return false;
	} else if ($("#" + endTimeID + teacherid).val() == undefined || $("#" + endTimeID + teacherid).val() == '') {
		showMessageTheme2(2, "Please select end time");
		return false;
	} else if (stime.getTime() > edtime.getTime()) {
		showMessageTheme2(0, "Invaild start time and end time");
		return false;
	} else {
		showMessageTheme2(2, "Please select start time and end time");
		return false;
	}
}

function bindEditVertualslot(appendTimeDiv, WEEKLIST, teacherUserid) {
	for (var week = 0; week < WEEKLIST.length; week++) {
		var wTime = WEEKLIST[week];
		var weeklyTimeList = wTime.weeklyTime;
		var trHtml = '';
		var totalSpentTime = 0.0;
		for (var wt = 0; wt < weeklyTimeList.length; wt++) {
			var weekTime = weeklyTimeList[wt];
			if (weekTime != undefined) {
				var tPreferTime = weekTime.teacherPreferTime;
				var taskName = "";//(weekTime.taskName == 'Live Classes' ? 'LIVE' : 'ADMIN');
				if(weekTime.taskName=='System Training'){
					taskName='SYS-TRAINING';
				}else if(weekTime.taskName=='Live Classes'){
					taskName='LIVE';
				}else{
					taskName='ADMIN'
				}
				var rmid = "rm-day-" + week + "_" + wt;
				var onclick = "removeTime('" + appendTimeDiv + "','" + rmid + "','" + week + "','" + wt + "')";
				trHtml += '<tr  class="tr-live-class ' + rmid + '" data-userid="' + teacherUserid + '" data-day-id="' + weekTime.dayId + '" data-teach-date="' + weekTime.startDate + '"  data-slot-type="' + taskName + '">'
					// + '<td >' + weekTime.dayId + '</td>'	
					+ '<td >' + weekTime.displayStartDate + '</td>'
					+ '<td>' + weekTime.taskName + '</td>'
					+ '<td style="max-width: 300px;">';
				var rSlot = '';
				for (var tt = 0; tt < tPreferTime.length; tt++) {
					var preferTime = tPreferTime[tt];
					rSlot += '<span class="p-1 mb-1 text-center font-weight-semi-bold d-inline-block text-success border border-success rounded-5 font-10" data-teach-strtime="' + preferTime.startTime + '" data-teach-entime="' + preferTime.endTime + '">' + preferTime.displayStartTime + ' - ' + preferTime.displayEndTime + '</span>'
				}
				trHtml += rSlot;
				trHtml += '</td>'
					+ '<td class="text-center">' + weekTime.duration + '</td>'
					+ '<td class="text-center">'
					+ '<span class="full">'
					//+ '<a href="javascript:void(0)" class="border-0 btn-transition btn btn-outline-primary" onclick="edit()" tabindex="0"><i class="fa fa-edit"></i></a>'
					+ '<a href="javascript:void(0)" class="border-0 btn-transition btn btn-outline-danger" onclick="' + onclick + '" tabindex="0"><i class="fa fa-trash"></i></a>'
					+ '</span>'
					+ '</td>'
					+ '</tr>';

				// var tims = parseFloat(weekTime.duration.replace("h ",".").replace("m",""));
				// var totSpent = tims.toFixed(2);
				// totalSpentTime+=totSpent.replace(".","h ")+'m';

				var timhrArr = weekTime.duration.split("h");
				var timHr = 0;
				var tims = 0;
				var timmin = 0;
				if (timhrArr.length > 1) {
					timHr = timhrArr[0];
					if (timhrArr[1] == ' ') {
						tims = 0;
					} else {
						tims = timhrArr[1].replace('m', '');
					}
				} else {
					tims = timhrArr[0].replace('m', '');
				}
				var timmin = timHr + '.' + tims;

				var stims = timmin.toString().split(".");
				var seconds1 = 0;
				if (stims.length > 1) {
					var hrs = stims[0] > 0 ? stims[0] : 0;
					var mns = stims[1] > 0 ? stims[1] : 0;
					seconds1 = toSeconds(hrs, mns, 0);
				} else {
					var hrs = stims[0] > 0 ? stims[0] : 0;
					seconds1 = toSeconds(hrs, 0, 0);
				}
				totalSpentTime += (seconds1);

			}
		}
		$("#editTimeVertualSlot").html(trHtml);
	}
}



function bindVertualSlot(appendTimeDiv, WEEKLIST, teacherUserid) {
	var html = '';
	var weekNum = 1
	for (var week = 0; week < WEEKLIST.length; week++) {
		var wTime = WEEKLIST[week];
		var weeklyTimeList = wTime.weeklyTime;
		weeklyTimeList.sort((a, b) => {
			return a.startDate - b.startDate;
		});

		var weekNameTime = "";
		if (weekNum == 1) {
			weekNameTime = "1st";
		} else if (weekNum == 2) {
			weekNameTime = "2nd";
		} else if (weekNum == 3) {
			weekNameTime = "3rd";
		}


		var trHtml = '';
		var datesHTML = '';
		datesHTML += '<thead class="text-primary">'
			+ '<tr>'
			+ '<th valign="middle">Day &amp; Date</th>'
			+ '<th valign="middle">Task Name</th>'
			+ '<th valign="middle">Slots</th>'
			+ '<th valign="middle" class="text-center">Total Time</th>'
			+ '<th valign="middle">Action</th>'
			+ '</tr>'
			+ '</thead>'
			+ '<tbody>';
		var totalSpentTime = 0.0;
		for (var wt = 0; wt < weeklyTimeList.length; wt++) {
			var weekTime = weeklyTimeList[wt];
			//if(weekTime!=undefined){
			var taskName = "";//(weekTime.taskName == 'Live Classes' ? 'LIVE' : 'ADMIN');
			if(weekTime.taskName=='System Training'){
				taskName='SYS-TRAINING';
			}else if(weekTime.taskName=='Live Classes'){
				taskName='LIVE';
			}else{
				taskName='ADMIN'
			}
			var tPreferTime = weekTime.teacherPreferTime;
			var rmid = "rm-day-" + week + "_" + wt;
			var onclick = "removeTime('" + appendTimeDiv + "', '" + rmid + "','" + week + "','" + wt + "')";
			trHtml += '<tr  class="tr-live-class ' + rmid + '" data-userid="' + teacherUserid + '" data-day-id="' + weekTime.dayId + '" data-teach-date="' + weekTime.startDate + '"  data-slot-type="' + taskName + '">'
				+ '<td >' + weekTime.displayStartDate + '</td>'
				+ '<td>' + weekTime.taskName + '</td>'
				+ '<td style="">';
			var rSlot = '';
			for (var tt = 0; tt < tPreferTime.length; tt++) {
				var preferTime = tPreferTime[tt];
				rSlot += '<span class="p-1 mb-1 text-center font-weight-semi-bold d-inline-block text-success border border-success rounded-5 font-10" data-teach-strtime="' + preferTime.startTime + '" data-teach-entime="' + preferTime.endTime + '">' + preferTime.displayStartTime + ' - ' + preferTime.displayEndTime + '</span>'
			}
			trHtml += rSlot;
			trHtml += '</td>'
				+ '<td class="text-center">' + weekTime.duration + '</td>'
				+ '<td class="text-center">'
				+ '<span class="full">'
				//+ '<a href="javascript:void(0)" class="border-0 btn-transition btn btn-outline-primary" onclick="edit()" tabindex="0"><i class="fa fa-edit"></i></a>'
				+ '<a href="javascript:void(0)" class="border-0 btn-transition btn btn-outline-danger" onclick="' + onclick + '" tabindex="0"><i class="fa fa-trash"></i></a>'
				+ '</span>'
				+ '</td>'
				+ '</tr>';
			var timhrArr = weekTime.duration.split("h");
			var timHr = 0;
			var tims = 0;
			var timmin = 0;
			if (timhrArr.length > 1) {
				timHr = timhrArr[0];
				if (timhrArr[1] == ' ') {
					tims = 0;
				} else {
					tims = timhrArr[1].replace('m', '');
				}
			} else {
				tims = timhrArr[0].replace('m', '');
			}
			var timmin = timHr + '.' + $.trim(tims);

			var stims = timmin.toString().split(".");
			var seconds1 = 0;
			if (stims.length > 1) {
				var hrs = stims[0] > 0 ? stims[0] : 0;
				var mns = stims[1] > 0 ? stims[1] : 0;
				seconds1 = toSeconds(hrs, mns, 0);
			} else {
				var hrs = stims[0] > 0 ? stims[0] : 0;
				seconds1 = toSeconds(hrs, 0, 0);
			}
			totalSpentTime += (seconds1);
			//}		
		}
		trHtml += '<tr>'
			+ '<td colspan="4" class="text-right">'
			+ '<span class="bg-primary text-white d-inline-block py-1 px-2 rounded vr-slot" id="vr-slot-' + weekNum + '" data-total-vrhours="' + totalSpentTime + '">Total time: ' + secondsToHms(totalSpentTime) + '</span>'
			+ '</td>'
			+ '<td></td>'
			+ '</tr>';

		datesHTML += trHtml;
		//trHtml='';
		datesHTML += '</tbody>';
		if (weeklyTimeList.length > 0) {
			html += '<div class="card mb-2 full" id="week_' + weekNum + '" style="border-top-left-radius:12px;border-bottom-left-radius:12px;">'
				+ '<table class="table mb-0">'
				+ '<tbody class="">'
				+ '<tr>'
				+ '<td rowspan="5" class="font-weight-semi-bold bg-primary text-white font-size-lg position-relative availability-week-row" style="border-top-left-radius:12px;border-bottom-left-radius:12px;">'
				+ '<span class="availability-week">WEEK ' + weekNum + '</span>'
				+ '</td>'
				+ '<td class="border-top-0">'
				+ '<table class="table roop-table">'
				+ datesHTML
				+ '</table>'
				+ '</td>'
				+ '</tr>'

				+ '</tbody>'
				+ '</table>'

				+ '</div>';
			weekNum = weekNum + 1;
		}
	}
	return html;
}


function removeTime(appendTimeDiv, eleID, weekArrKey, slotKey) {

	$("." + eleID).remove();
	if (weekArrKey != undefined) {
		var wTime = WEEKLIST_ARR[weekArrKey];
		if (wTime != undefined) {
			var weeklyTimeList = wTime.weeklyTime;
			var weekTime = weeklyTimeList[slotKey];
			removeItemOnce(weeklyTimeList, weekTime);


			var totalMinusTime = 0;

			// var tims = (weekTime.duration.replace("h ",".").replace("m",""));
			// var stims=	tims.toString().split(".");
			// var seconds1=0;
			// if(stims.length>1){
			// 	var hrs = stims[0]>0?stims[0]:0;
			// 	var mns = stims[1]>0?stims[1]:0;
			// 	seconds1=toSeconds(hrs,mns,0);
			// }else{
			// 	var hrs = stims[0]>0?stims[0]:0;
			// 	seconds1=toSeconds(hrs,0,0);
			// }
			// totalMinusTime+= (seconds1);
			var timhrArr = weekTime.duration.split("h");
			var timHr = 0;
			var tims = 0;
			var timmin = 0;
			if (timhrArr.length > 1) {
				timHr = timhrArr[0];
				if (timhrArr[1] == ' ') {
					tims = 0;
				} else {
					tims = timhrArr[1].replace('m', '');
				}
			} else {
				tims = timhrArr[0].replace('m', '');
			}
			var timmin = timHr + '.' + $.trim(tims);

			var stims = timmin.toString().split(".");
			var seconds1 = 0;
			if (stims.length > 1) {
				var hrs = stims[0] > 0 ? stims[0] : 0;
				var mns = stims[1] > 0 ? stims[1] : 0;
				seconds1 = toSeconds(hrs, mns, 0);
			} else {
				var hrs = stims[0] > 0 ? stims[0] : 0;
				seconds1 = toSeconds(hrs, 0, 0);
			}
			totalMinusTime += (seconds1);

			var weknum = (parseInt(weekArrKey) + 1);
			var oldHrs = $("#vr-slot-" + weknum).attr('data-total-vrhours');
			var minusTime = oldHrs - totalMinusTime;
			var weekNTime = "";
			if (weknum == 1) {
				weekNTime = "1st";
			} else if (weknum == 2) {
				weekNTime = "2nd";
			} else if (weknum == 3) {
				weekNTime = "3rd";
			}

			var ssR = "Total time: " + secondsToHms(minusTime);
			$("#vr-slot-" + weknum).attr('data-total-vrhours', minusTime);
			$("#vr-slot-" + weknum).text(ssR);
		}
		wTime = WEEKLIST_ARR[weekArrKey];
		if (wTime == null) {
			return false;
		}
		if (wTime.weeklyTime.length == 0) {
			WEEKLIST_ARR = removeItemOnce(WEEKLIST_ARR, weekArrKey);//WEEKLIST_ARR.slice(0, weekArrKey);
		}

	}
	weekArrKey = (parseInt(weekArrKey) + 1);
	if ($("#week_" + weekArrKey + " .tr-live-class span").length < 1) {
		$("#week_" + weekArrKey).html(' ');
	}
	var teacherUserid = $("#timeSaveTeacherUserId").val();
	var controlType = $("#controlType").val();
	if (controlType == 'edit') {
		bindEditVertualslot(appendTimeDiv, WEEKLIST_ARR, teacherUserid);
	} else {
		var html = bindVertualSlot(appendTimeDiv, WEEKLIST_ARR, teacherUserid);
		$("." + appendTimeDiv).html(html);
	}



}



function getMonthDaysDate(selectedDay, duration, lastDate, slotTillDate) {
	var nextDayDate = null;
	if (lastDate != "") {
		var ldate = lastDate.split("-");
		var nextDayDate = new Date(parseInt(ldate[0]), (parseInt(ldate[1]) - 1), parseInt(ldate[2]));
		nextDayDate.setDate(nextDayDate.getDate());
		currentYear = nextDayDate.getFullYear();
		currentMonth = nextDayDate.getMonth();
		currentDay = nextDayDate.getDate();

		//nextDayDate.setDate(nextDayDate.getDate() + parseInt(duration));
		var tilldate = new Date(slotTillDate);
		nextDayDate = tilldate;
	} else {
		var tilldate = new Date(slotTillDate);
		nextDayDate = tilldate;
	}
	var daysRange = duration;
	var currentMonthsDaysCount = (new Date(currentYear, (currentMonth + 1), 0).getDate() - (currentDay - 1));
	var month = currentMonth;
	if (daysRange >= currentMonthsDaysCount) {
		month = currentMonth + 1
	}
	var dates = [];
	for (var day = 0; day <= daysRange; day++) {
		var date = new Date(currentYear, currentMonth, (currentDay + day));
		if (date <= nextDayDate) {
			if (date.getMonth() <= month && date.getDay() === selectedDay) {
				dates.push(date);
			}
		} else {
			break;
		}
		if (date.getMonth() > month) {
			break;
		}
	}
	//console.log(dates[0].toDateString().split(" "));
	return dates;
}


function getRequestForStudentTimePreference(callfrom, studentStandardId) {

	var teacherAssignRequest = {};
	teacherAssignRequest['userId'] = USER_ID;
	teacherAssignRequest['userRole'] = USER_ROLE;
	teacherAssignRequest['schoolId'] = SCHOOL_ID;
	teacherAssignRequest['callFrom'] = callfrom;
	teacherAssignRequest['studentStandardId'] = studentStandardId;
	return teacherAssignRequest;
}

function callStudentTimePreference(callfrom, studentStandardId) {
	
	$("#timeStuStandardId").val(studentStandardId);
	$("#mandatoryVideoModal").modal("hide");
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLForHTML('report', 'get-time-preference'),
		data: JSON.stringify(getRequestForStudentTimePreference(callfrom, studentStandardId)),
		dataType: 'json',
		cache: false,
		timeout: 600000,
		async: true,
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2'|| data['status'] == '3' || data['status'] == '1') {
				if(data['status'] == '3'){
					redirectLoginPage();
				}else{
					if(isSkipped && USER_ROLE == "STUDENT"){
						$("#timePreferencePopup").addClass("d-none");
						$("#timePreferencePopup").modal("hide");
						return false;
					}
					if(tt=='theme2'){
						if(USER_ROLE == "STUDENT" && (data["enrollType"] == "REGISTRATION_FRESH" || data["enrollType"] == "REGISTRATION_FLEX_COURSE")){
							if(videoUrl!='N'){
								if(flagWatchVideo){
									$("#mandatoryVideoModal").hide("hide");
									$("#timePreferencePopup").removeClass("d-none");
									$("#timePreferencePopup").modal("show");
								}else{
									$("#mandatoryVideoModal").modal("show");
									$("#timePreferencePopup").addClass("d-none");
									$("#timePreferencePopup").modal("hide");
								}
							}
						}else{
							$(".thumbnail-frame").parent().hide();
							$("#timePreferencePopup .modal-dialog").removeClass("modal-xl");
							$("#timePreferencePopup .modal-dialog").addClass("modal-lg");
							$("#timePreferenceDiv").removeClass("col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12");
							$("#timePreferenceDiv").addClass("col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12");
							$("#timePreferencePopup").removeClass("d-none");
							$("#timePreferencePopup").modal("show");
							$("#mandatoryVideoModal").modal("hide");	
						}
							
						// $("#timePreferencePopup").modal("show");
						// $("#timePreferencePopup").removeClass("d-none");
					}else if(tt=='theme1'){
						//showMessage(true, data['message']);
					}
				}
			}else {
			}
		},
		error: function (e) {
			if (tt == 'theme2') {
				showMessageTheme2(2, TECHNICAL_GLITCH, '', true);
			} else if (tt == 'theme1') {
				showMessage(true, TECHNICAL_GLITCH);
			}
		}
	});
}

function closeMaxLimitsWariningModal(){
	$(".modal-save-btn").attr("disabled", false);
}


function saveTeacherTimePreference(callFrom, modalID, newTheme) {
	$(".academit-step, #decideLater, #chooseAcademicDateBtnToCountinue").hide();
	$(".school-system-training-step, #skipTraining, #moveToDashboardProcess").show();
	$(".modal-save-btn").attr("disabled","disabled");
	if (newTheme) {
		hideMessageTheme2('');
	} else {
		hideMessage('');
	}
	var saveType = $("#saveType").val();
	var enrollmentType = $("#enrollmentType").val();
	var studentRegistrationType = $("#regstrationType").val();
	var submitFrom = $("#" + modalID + " #submitFrom").val();
	var totalReschedule = $("#totalRescheduleNumber").val();
	var rescheduleNumber = $("#rescheduleNumber").val();
	if (callFrom == 'STUDENT' && studentRegistrationType != 'BATCH') {
		if(saveType=='SKIP' ){
			if ($('#chooseDateToStartSemster').val() == null || $('#chooseDateToStartSemster').val() == '' || $('#chooseDateToStartSemster').val() == undefined) {
				showMessageTheme2(0, "Please select your academic year start date.", '', true);
				return false;
			}
			
		}else if(saveType=='STUDENT_PROFILE'){
			if ($("#preferedStartTime").val() == null || $("#preferedStartTime").val() == '' || $("#preferedStartTime").val() == undefined) {
				showMessageTheme2(0, "Please select your live classes start time.", '', true);
				return false;
			}
			if ( $("#preferedEndTime").val() == null || $("#preferedEndTime").val() == '' || $("#preferedEndTime").val() == undefined) {
				showMessageTheme2(0, "Please select your live classes end time.", '', true);
				return false;
			}
		}else{
			if ($('#chooseDateSystemTrainingDate').val() == undefined || $('#chooseDateSystemTrainingDate').val() == '' || $('#chooseDateSystemTrainingDate').val() == null) {
				showMessageTheme2(0, "Please select your system training date.", '', true);
				return false;
			}
		}
		if((enrollmentType=='REGISTRATION_FRESH' || enrollmentType=='REGISTRATION_FLEX_COURSE') && (saveType=='ORIENT' || saveType=='RESH')){
			if ($(".viewOrientFreeSlot input[name='slotTime']:checked").attr("slotedtime") == null || $(".viewOrientFreeSlot input[name='slotTime']:checked").attr("slotedtime") == undefined || $(".viewOrientFreeSlot input[name='slotTime']:checked").attr("slotedtime") == '') {
				showMessageTheme2(0, "Please select your system training time.", '', true);
				return false;
			}
		}

	}
	if (callFrom == 'student-profile' && $("#preferedTimeSavedByStudentCount").val() >= 1) {
		showMessageTheme2(0, "You have used your free reschedule for training. Please contact us at admin.support@internationalschooling.org or WhatsApp +65 82553106 if you need to further reschedule your system training", '', true);
		return false;
	}
	var timeTeacherUserId = USER_ID;
	var timeTeacherId = USER_ID;
	if (USER_ROLE != "STUDENT" && saveType!='STUDENT_PROFILE') {
		saveType="LIVE";
		if ($("#timeSaveTeacherUserId").val() != undefined && $("#timeSaveTeacherUserId").val() != "") {
			timeTeacherUserId = $("#timeSaveTeacherUserId").val();
			if ($('.tr-live-class span').length < 1) {
				showMessageTheme2(2, "Please add preferred time");
				return false;
			}
		} else {
			if ($('.tr-live-class span').length < 1) {
				showMessageTheme2(2, "Please add preferred time");
				return false;
			}
		}

	}
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLForHTML('report', 'save-time-preference'),
		data: JSON.stringify(getRequestForTeacherTimePreference(callFrom, timeTeacherUserId, modalID)),
		dataType: 'json',
		cache: false,
		timeout: 600000,
		success: function (data) {
			console.log(data);
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if(data['status'] == '3'){
					redirectLoginPage();
				}
				if (newTheme) {
					showMessageTheme2(0, data['message'], '', true);
				} else {
					showMessage(true, data['message']);
				}

			} else if(data['status'] == "3"){
				showMessageTheme2(0, data['message'], '', true);
				redirectLoginPage();
			}
			else {
				if (newTheme) {
					var msgHtml ="";
					// $("#chooseDateToStartSemsterClass").val($("#chooseDateToStartSemster").val());
					setTimeout(function () {
						if (saveType == 'STUDENT_PROFILE') {
							showMessageTheme2(1, data['message'], '', true);
							location.reload();
						} else {
							//$("#" + modalID).modal('hide');
							if (submitFrom == 'teacher-profile') {
								showMessageTheme2(1, data['message'], '', true);
								sessionStorage.reloadAfterPageLoad = true;
								location.reload();
							} else if (submitFrom == 'teacher-my-slot') {
								showMessageTheme2(1, data['message'], '', true);
								callDashboardPageSchool(163, 'teacher-manage-slot');
								$("#timePreferencePopup").modal("hide");
								$("#timePreferencePopup").addClass("d-none");
								$("#teacherTimeSave").hide();
								//$('.modal-backdrop').remove();
							}else{
								if(saveType == 'RESH'){
									showMessageTheme2(1, data['message'], '', true);
									location.reload(true);
								}else{
									if(saveType == 'ORIENT'){
										showMessageTheme2(1, data['message'], '', true);
										// location.reload(true);
										$("#orientAndSemesterChangeSpanHeading").text("School System Training");
										msgHtml+="<div class='p-2 border rounded-10' style='border-color: #007fff !important;'> <p class='mb-3 text-primary font-weight-semi-bold' style='font-size:18px'>Your School System Training is on "+data['orientationdateTimeInStudentTimeZone']+".</p><p class='mt-3 mb-1'><a href='"+data.joinOrientationUrl+"' class='btn btn-success font-size-lg py-1 px-5' target='_blank'>Join</a></p></div>";
										msgHtml+="<p class='mb-0 mt-2 text-primary font-weight-semi-bold' style='font-size:16px'>If you wish to reschedule, please <a href='"+data.rescheduleOrientationUrl+"' class='text-primary' style='text-decoration:underline' target='_blank'>click here</a></p>";
										$("#thankyouClassesMsg").html(msgHtml);
										$("#thankyouClassesMsg").show();
										$("#sartDateWrapper, .timeSlotWrapper").hide();
										$("#studentTimeSkipPrev").hide();
										$("#studentTimeSkipNext").hide();
										$('#startTimeAndEndTimeWrapper').show();
										$('#hideAllData').hide();
										$("#studentTimeSave").hide();
										$("#closeButton").show();
										$("#studentTimeSave").text("Confirm");
									}else{
										if(data['semesterStartDate'] != null){
											var semesterStartDate = data['semesterStartDate'].split("-");
											var systrainingStartDate = new Date(parseInt(semesterStartDate[2]), parseInt(semesterStartDate[0])-1, parseInt(semesterStartDate[1]));
											var systrainingEndDate = new Date(parseInt(semesterStartDate[2]), parseInt(semesterStartDate[0])-1, parseInt(semesterStartDate[1]));
										}
										showMessageTheme2(1, data['message'], '', true);
										if(data['enrollmentType']=='REGISTRATION_FRESH' || data['enrollmentType']=='REGISTRATION_FLEX_COURSE'){
											$("#startTimeAndEndTimeWrapper").hide();
											$("#sartDateWrapper, .timeSlotWrapper").show();
											$("#orientAndSemesterChangeSpanHeading").text("CHOOSE YOUR SCHOOL SYSTEM TRAINING DATE");
											$("#orientAndSemesterChangeSpan").text("I want to schedule my school system training on")
											$("#thankyouClassesMsg").html("<p class='full text-center text-primary' style='font-size:16px' onclick='showMobileViewSystemTrainingInfo()'>Join your School System Training where the School Administration will tell you how to book classes, join classes, access progress reports & course material, appear for assessments, etc.</p>");
											$("#mobileViewSystemTrainingInfo .modal-body").html("<p class='full text-center border border-primary rounded p-2 text-primary' style='font-size:16px'>Join your School System Training where the School Administration will tell you how to book classes, join classes, access progress reports & course material, appear for assessments, etc.</p>")
											if($(window).width()<600){
												if($("#thankyouClassesMsg p .circle-info").length<1){
													$("#thankyouClassesMsg p").prepend('<svg xmlns="http://www.w3.org/2000/svg" class="circle-info mr-2 mb-1" width="16px" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336l24 0 0-64-24 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l48 0c13.3 0 24 10.7 24 24l0 88 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>');
												}
												$("#thankyouClassesMsg p").css({"text-overflow":"ellipsis","-webkit-line-clamp":"1","white-space":"normal","max-height":"38px","overflow":"hidden","word-break":"break-word","display":"-webkit-box","-webkit-box-orient":"vertical"});
												$("#thankyouClassesMsg p").addClass('btn btn-outline-primary mb-2');
												$("#thankyouClassesMsg p").removeClass("text-primary");
											}
											$('#thankyouClassesMsg, #studentTimeSkipNext').show();
											$("#chooseDateToStartSemster").val("").datepicker("update");
											//callOrientationtime();	
										}else{
											location.reload(true);
										}
										$("#chooseDateToStartSemster-wrapper").removeClass("d-inline-block").addClass("d-none");
										$("#chooseDateSystemTrainingDate-wrapper").removeClass("d-none").addClass("d-inline-block");
										if(data['semesterStartDate'] != null){
											systrainingEndDate.setDate(systrainingEndDate.getDate()+(data['activeNumberOfDaysForSystemTraining']-1));
											$('#chooseDateSystemTrainingDate').datepicker('destroy').datepicker({
												autoclose: true,
												container: '#timePreferencePopup .modal-body',
												format: 'M dd, yyyy',
												startDate: systrainingStartDate,
												endDate:systrainingEndDate,
												
											}).on('changeDate',function(){
												if($("#saveType").val() == 'ORIENT'){
													$("#timePreferencePopup .modal-body").css({"max-height":"500px","overflow-y":"auto"});
													if(data['enrollmentType']=='REGISTRATION_FRESH' || data['enrollmentType']=='REGISTRATION_FLEX_COURSE'){
														callOrientationtime();
													}else{
													}
												}
												
											});
										}
									}
								}
								$("#saveType").val("ORIENT");
							}
						}

					}, 500);
					
				} else {
					showMessage(true, data['message']);
				}
			}
			return false;
		},
		error: function (e) {
			//showMessage(true, e.responseText);
			return false;
		}
	});
}

function studentTimeSkipNext(callFrom, modalID, newTheme){
	$("#saveType").val('SKIP');
	$('#orientAndSemesterChangeSpan').html('I want to start my academic year on');
	$('#orientAndSemesterChangeSpanHeading').html('CHOOSE YOUR ACADEMIC YEAR START DATE');
	$("#startTimeAndEndTimeWrapper").show();
	$("#studentTimeSkipPrev").show();
	$("#studentTimeSkipPrev").text("Back");
	$("#studentTimeSave").text("Confirm");
	$("#studentTimeSkipNext, .timeSlotWrapper").hide();
	$('#chooseDateToStartSemster').val("").datepicker("update");
}
function studentTimeSkipPrev(callFrom, modalID, newTheme){
	$("#saveType").val('ORIENT');
	$('#orientAndSemesterChangeSpan').html('I want to schedule my school system training on');
	$('#orientAndSemesterChangeSpanHeading').html('CHOOSE YOUR SCHOOL SYSTEM TRAINING DATE');
	$("#startTimeAndEndTimeWrapper").hide();
	$("#studentTimeSkipPrev").hide();
	$("#studentTimeSkipNext").show();
	$('#chooseDateToStartSemster').val("").datepicker("update");
}
function rescheduleOrientation(){
	$("#saveType").val("RESH");
	$('#orientationTimeWrapper').hide();
	$('#orientationDateWrapper').show();
}
// function iAcknowledgeOrientation(){
// 	$("#iAcknowledgeOrientation").modal("show");
// }

$(function () {
	if (sessionStorage.reloadAfterPageLoad) {
		$(".my-availability").trigger("click");
		sessionStorage.reloadAfterPageLoad = false;
	}
});

   function getRequestForTeacherTimePreference(callFrom,  teacherUserId,  modalID){
		var teacherAssign = {};
		var teacherTimeList = [];
		var teacherLeaveDateList =[];
		var teacherAssignTime = {};
		var activeDays=[];
		teacherAssign['userId'] = teacherUserId;
		teacherAssign['schoolId']= SCHOOL_ID;
		teacherAssign['slotAddUserId']=USER_ID;
		
		if(callFrom=='STUDENT'){
			teacherAssign['studentStandardId']=$("#timeStuStandardId").val();
			teacherAssign['userRole'] = 'STUDENT';
			teacherAssign['saveType'] =$("#saveType").val();
			var studentRegistrationType= $("#regstrationType").val();
			if(studentRegistrationType!='BATCH'){
				var startDate=changeDateFormat(new Date($('#chooseDateToStartSemster').val()),"mm-dd-yyyy");
				teacherAssignTime['startDate']=$('#chooseDateToStartSemster').val();
				teacherAssign['semesterStartDate']=startDate;
				
			}
			if($("#saveType").val()=='SKIP' || $("#saveType").val()=='STUDENT_PROFILE'){
				var strTime;
				var endTime;
				if( $("#saveType").val()=='STUDENT_PROFILE'){
					strTime = $("#preferedStartTime").val();
					endTime = $("#preferedEndTime").val();
				}else{
					strTime = $("#startTime"+USER_ID).val();
					endTime = $("#endTime"+USER_ID).val();
				}
				if($("#saveType").val()=='SKIP'){
					strTime='9:00  AM';
					endTime ='9:00_AM';
				}
				var sttTimee = strTime.split(":");
				var sHour = parseInt(sttTimee[0]);
				var sMins = sttTimee[1].split(" ")[0];
				if(sttTimee[1].split(" ")[1] == "PM" && sHour < 12){
					sHour = (sHour + 12);
				}else if(sttTimee[1].split(" ")[1] == "AM" && sHour==12){
					sHour = 0;
				}
				var ennTimee = endTime.split(":");
				var eHour = parseInt(ennTimee[0]);
				var eMins = ennTimee[1].split("_")[0];
				if(ennTimee[1].split("_")[1] == "PM" && eHour < 12){
					eHour = (eHour + 12);
				}
				
				var stime = new Date(1990,1,1,sHour,sMins,0);
				var etime = new Date(1990,1,1,eHour,eMins,0);

				if(stime > etime){
					showMessageTheme2(0, "Invaild start time and end time");
					return false;
				}
				teacherAssignTime['startTime']=sHour+":"+sMins+":00";
				teacherAssignTime['endTime']=eHour+":"+eMins+":00";
				teacherTimeList.push(teacherAssignTime);
			}
			var enrollmentType = $("#enrollmentType").val();
			if(enrollmentType=='REGISTRATION_FRESH' || enrollmentType=='REGISTRATION_FLEX_COURSE'){
				if($("#saveType").val()=='ORIENT' || $("#saveType").val()=='RESH'){
					var userbookDate = $('#chooseDateSystemTrainingDate').val();
					var bookStTime = $(".viewOrientFreeSlot input[name='slotTime']:checked").attr("slotsttime");
					var bookEnTime = $(".viewOrientFreeSlot input[name='slotTime']:checked").attr("slotedtime");
					var duration = $(".viewOrientFreeSlot input[name='slotTime']:checked").attr("slotduration");
					console.log(bookStTime)
					console.log(bookEnTime)
					teacherAssign['bookDate']=userbookDate;
					teacherAssign['bookStartTime']=bookStTime;
					bookStTime=bookStTime.split(':')
					var fromT = new Date(1990, 1, 1, bookStTime[0], bookStTime[1], 0);
					var timestamp = Date.parse(fromT);
					var dateObject = new Date(timestamp);
					var timeinter = getTimePlusInterval(dateObject,duration);
					var bookEnTime = convertTo24Hour(timeinter);
					teacherAssign['bookEndTime']=bookEnTime+':00';
				}
			}
		}else{
			if(callFrom!='TEACHER'){
				teacherAssign['userRole'] = 'ADMIN';
			}else{
				teacherAssign['userRole'] = 'TEACHER';
			}
			
			//#time-wrapper-'+USER_ID+' 
			$('.tr-live-class').each(function() { 
				var startDate=''
				var dyid =$(this).attr('data-day-id');
				var slotType =$(this).attr('data-slot-type');
				var startDate = $(this).attr('data-teach-date');
				$($(this).find('span')).each(function() { 
					var teacherTime={};
					var startTime = $(this).attr('data-teach-strtime');
					var endTime = $(this).attr('data-teach-entime');
					if(startTime!=undefined){
						teacherTime['slotType']=slotType;
						teacherTime['startDate']=startDate;
						teacherTime['dayId']=dyid;
						teacherTime['startTime']=startTime;
						teacherTime['endTime']=endTime;
						teacherTimeList.push(teacherTime);
					}
				});
			});
			
			teacherAssign['slotUpdateDate']=$("#"+modalID+" #updateSlotDate").val();
			teacherAssign['controlType']=$("#"+modalID+" #controlType").val();
		}
		//return false;
		teacherAssign['teacherTimeList']=teacherTimeList;
		
		console.log(teacherAssign);
	//return false;
	return teacherAssign;
}

function getRequestForTeacherTime(callfrom, teacherUserId, userRole, autoForwordStatus) {
	var teacherAssignRequest = {};
	teacherAssignRequest['userId'] = teacherUserId;
	teacherAssignRequest['userRole'] = userRole;
	teacherAssignRequest['schoolId'] = SCHOOL_ID;
	teacherAssignRequest['callFrom'] = callfrom;
	teacherAssignRequest['autoForwordStatus'] = autoForwordStatus;
	console.log(teacherAssignRequest);
	return teacherAssignRequest;
}

function callTeacherTimePreference(callfrom, teacherId, teacherUserId, userRole, modalID, autoForwordStatus) {
	console.log(userRole);
	customLoader(true);
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLForHTML('report', 'get-teacher-time-preference'),
		data: JSON.stringify(getRequestForTeacherTime(callfrom, teacherUserId, userRole, autoForwordStatus)),
		dataType: 'json',
		cache: false,
		timeout: 600000,
		async: true,
		success: function (data) {
			console.log(data);
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if (data['status'] == '3') {
					redirectLoginPage();
				} else {
					if (tt == 'theme2') {
						//showMessageTheme2(2, "",'',true);
					} else if (tt == 'theme1') {
						//showMessage(true, data['message']);
					}
				}
			} else {
				$("#teacherSchedulingHTML").html("");
				if ($("#teacherSchedulingHTML").hasClass("slick-slider")) {
					$('.slick-slider-wrapper').slick('unslick')
				}
				$("#" + modalID + " #changeSlotLimit").val(data.changeSlotLimit);
				$("#" + modalID + " #changeSlotStartDay").val(data.changeSlotStartDay);
				$("#" + modalID + " #changeSlotValid").val(data.changeSlotValid);
				$("#" + modalID + " #changeSlotDate").val(data.changeSlotDate);
				$("#" + modalID + " #updateSlotDate").val(data.updateSlotDate);
				$("#" + modalID + " #slotTillDate").val(data.slotTillDate);
				$("#" + modalID + " #admin_teacher_name").html(data.teacherName);
				$("#" + modalID + " #slotLimitHrs").val(data.agreedMiniHourse);
				$("#" + modalID + " #agreedHalfHrs").val(data.agreedHalfHourse);

				var html = randerWeeklyContent(callfrom, data, teacherId, teacherUserId, modalID, userRole);
				if (callfrom == 'teacher-profile-farword') {
					$("#" + modalID + " .added-availability").html(html);
				}
				else {
					$("#teacherSchedulingHTML").html(html);
					$(".slick-slider-wrapper").not('.slick-initialized').slick({
						infinite: false,
						adaptiveHeight: true,
					});
					$("#" + modalID).on('shown.bs.modal', function () {
						$('.slick-slider-wrapper').slick('setPosition');
					});

					$(".slick-initialized").append("<div class='slick-nav'></div>");
					$(".slick-initialized .slick-prev").appendTo(".slick-initialized .slick-nav");
					$("<div class='stutas-nav d-inline-block'><b>Current Availability</b></div>").appendTo(".slick-initialized .slick-nav");
					$(".slick-initialized .slick-next").appendTo(".slick-initialized .slick-nav");
					$(".slick-initialized .slick-next").click(function () {
						$(".slick-initialized .stutas-nav b").text("Next Availability");
					});
					$(".slick-initialized .slick-prev").click(function () {
						$(".slick-initialized .stutas-nav b").text("Current Availability");
					});
				}
				$("#counselorLeaveSchedule .slick-nav").css({"position":"absolute","top":"-27px","left":"0","right":"0px","text-align":"center"})
				$("#" + modalID).modal("show");
			}
			customLoader(false);
		},
		error: function (e) {
			if (tt == 'theme2') {
				showMessageTheme2(2, TECHNICAL_GLITCH, '', true);
			} else if (tt == 'theme1') {
				showMessage(true, TECHNICAL_GLITCH);
			}
		}
	});
}


function randerWeeklyContent(callFrom, data, teacherId, teacherUserid, modalID, userRole) {
	console.log("randerWeeklyContent "+userRole);

	var html = '';
	//if(data.teacherWeeklyTimeCurrLiveClass != null){
	//if(data.teacherWeeklyTimeCurrLiveClass.nextSlotStatus == 'Y'){

	html += '<div>';
	// html+='<div class="text-center">Current Slot</div>';
	$.each(data.teacherWeeklyTimeCurrLiveClass.teacherAssignTimeWeekList, function (keyweek, valueweek) {

		//if(valueweek.weeklyTime!=null){

		var totalSpentTime = 0;
		var weekNameTime = "";
		if ((keyweek + 1) == 1) {
			weekNameTime = "1st";
		} else if ((keyweek + 1) == 2) {
			weekNameTime = "2nd";
		} else if ((keyweek + 1) == 3) {
			weekNameTime = "3rd";
		}

		html += '<div class="card mb-2 full" id="week_' + (keyweek + 1) + '" style="border-top-left-radius:12px;border-bottom-left-radius:12px;">'
			+ '<table class="table mb-0">'
			+ '<tbody class="">'
			+ '<tr>'
			+ '<td rowspan="5" class="font-weight-semi-bold bg-primary text-white font-size-lg position-relative availability-week-row" style="border-top-left-radius:12px;border-bottom-left-radius:12px;">'
			+ '<span class="availability-week">WEEK ' + (keyweek + 1) + '</span>'
			+ '</td>'
			+ '<td class="border-top-0">'
			+ '<table class="table roop-table">';
		html += '<thead class="text-primary">'
			+ '<tr>';
		// if(callFrom!='teacher-profile-farword'){
		// 	html+='<th valign="middle">Day</th>';
		// }	
		html += '<th valign="middle">Day &amp; Date</th>'
			+ '<th valign="middle">Task Name</th>'
			+ '<th valign="middle">Slots</th>'
			+ '<th valign="middle" class="text-center">Total Time</th>';
		if (callFrom != 'teacher-profile-farword') {
			if (valueweek.weekStartDate != valueweek.weekEndDate) {
				html += '<th valign="middle" class="text-center">Action</th>';
			}
		}
		html += '</tr>'
			+ '</thead><tbody>';
		//if(valueweek.weeklyTime.length > 0){
		$.each(valueweek.weeklyTime, function (keysingle, itemsingle) {

			var timhrArr = itemsingle.totalHrsSpent.split("h");
			var timHr = 0;
			var tims = 0;
			var timmin = 0;
			if (timhrArr.length > 1) {
				timHr = timhrArr[0];
				if (timhrArr[1] == ' ') {
					tims = 0;
				} else {
					tims = timhrArr[1].replace('m', '');
				}
			} else {
				tims = timhrArr[0].replace('m', '');
			}
			var timmin = timHr + '.' + $.trim(tims);

			var stims = timmin.toString().split(".");
			var seconds1 = 0;
			if (stims.length > 1) {
				var hrs = stims[0] > 0 ? stims[0] : 0;
				var mns = stims[1] > 0 ? stims[1] : 0;
				seconds1 = toSeconds(hrs, mns, 0);
			} else {
				var hrs = stims[0] > 0 ? stims[0] : 0;
				seconds1 = toSeconds(hrs, 0, 0);
			}
			totalSpentTime += (seconds1);

			if(itemsingle.teacherPreferTime.length>0){
				html += weeklyContent(callFrom, itemsingle, "editView", teacherId, teacherUserid, keyweek, keysingle, data, modalID, 'curr-slot',userRole);
			}	
		});
		//}
		if (callFrom != 'teacher-profile-farword') {
			if (valueweek.weekStartDate != valueweek.weekEndDate) {
				html += '<tr>'
					+ '<td colspan="6" class="text-center">'
					+ '<a href="javascript:void(0)" id="add_week_' + (keyweek + 1) + '" class="border-1 btn-transition btn btn-outline-primary" onclick="getOpenPrefrenceTimePopup(\'admin-profile\', \''+modalID+'\',\'' + teacherId + '\', \'' + data.teacherUserId + '\', \'' + data.changeSlotLimit + '\',\'' + data.changeSlotStartDay + '\' , \'' + data.changeSlotValid + '\', \'' + valueweek.weekStartDate + '\', \'' + data.updateSlotDate + '\', \'' + valueweek.weekEndDate + '\',\'add\',\'taskNameDropdow\', \'' + data.agreedMiniHours + '\', \'' + data.agreedMaxHours + '\',\'curr-slot\', \'' + data.agreedHours + '\', \'' + data.agreedHalfHours + '\', \'' + data.agreedAvgHours + '\',\''+userRole+'\');"><i class="fa fa-plus"></i>Add more days within this week</a>'
					+ '</td>'
					+ '</tr>';
			} else if ((keyweek + 1) == 3 && valueweek.weeklyTime == null) {
				html += '<tr>'
					+ '<td colspan="6" class="text-center">'
					+ '<a href="javascript:void(0)" id="add_week_' + (keyweek + 1) + '" class="border-1 btn-transition btn btn-outline-primary" onclick="getOpenPrefrenceTimePopup(\'admin-profile\', \''+modalID+'\',\'' + teacherId + '\', \'' + data.teacherUserId + '\', \'' + data.changeSlotLimit + '\',\'' + data.changeSlotStartDay + '\' , \'' + data.changeSlotValid + '\', \'' + valueweek.weekStartDate + '\',  \'' + data.updateSlotDate + '\', \'' + valueweek.weekEndDate + '\',\'add\',\'taskNameDropdow\', \'' + data.agreedMiniHours + '\', \'' + data.agreedMaxHours + '\',\'next-slot\', \'' + data.agreedHours + '\', \'' + data.agreedHalfHours + '\', \'' + data.agreedAvgHours + '\',\''+userRole+'\');"><i class="fa fa-plus"></i>Add more days within this week</a>'
					+ '</td>'
					+ '</tr>';
			}
		}
		html += '<tr>'
			+ '<td colspan="4" class="text-right">'
			+ '<span class="bg-primary text-white d-inline-block py-1 px-2 rounded">Total time: ' + secondsToHms(totalSpentTime) + '</span>'
			+ '</td>';
		// if(valueweek.weekStartDate!=valueweek.weekEndDate){
		html += '<td>&nbsp;</td>';
		// }
		html += '</tr>';
		html += '</tbody></table>'
			+ '</td>'
			+ '</tr>'
			+ '</tbody>'
			+ '</table>'

			+ '</div>';
		//}
	});
	html += '</div>';
	//}

	//}
	if (data.teacherWeeklyTimeNextLiveClass != null) {
		if (data.teacherWeeklyTimeNextLiveClass.nextSlotStatus == 'Y') {
			html += '<div>';
			$.each(data.teacherWeeklyTimeNextLiveClass.teacherAssignTimeWeekList, function (keyweek, valueweek) {
				var totalSpentTimeNext = 0;
				var weekNameTime = "";
				if ((keyweek + 1) == 1) {
					weekNameTime = "1st";
				} else if ((keyweek + 1) == 2) {
					weekNameTime = "2nd";
				} else if ((keyweek + 1) == 3) {
					weekNameTime = "3rd";
				}
				html += '<div class="card mb-2 full"  id="week_next_' + (keyweek + 1) + '">'
					+ '<table class="table mb-0">'
					+ '<tbody class="">'
					+ '<tr>'
					+ '<td rowspan="5" class="font-weight-semi-bold bg-primary text-white font-size-lg position-relative availability-week-row" style="border-top-left-radius:12px;border-bottom-left-radius:12px;">'
					+ '<span class="availability-week">WEEK ' + (keyweek + 1) + '</span>'
					+ '</td>'
					+ '<td class="border-top-0">'
					+ '<table class="table roop-table">';
				html += '<thead class="text-primary">'
					+ '<tr>';
				// if(callFrom!='teacher-profile-farword'){
				// 	html+='<th valign="middle">Day</th>';
				// }
				html += '<th valign="middle">Day &amp; Date</th>'
					+ '<th valign="middle">Task Name</th>'
					+ '<th valign="middle">Slots</th>'
					+ '<th valign="middle" class="text-center">Total Time</th>';
				if (callFrom != 'teacher-profile-farword') {
					html += '<th valign="middle" class="text-center">Action';
					//html+='<a href="javascript:void(0)"  class="border-0 btn-transition btn btn-outline-primary" onclick="getOpenPrefrenceTimePopup(\'teacher-profile\', \'timePreferencePopup\',\''+teacherId+'\', \''+data.teacherUserId+'\', \''+data.changeSlotLimit+'\',\''+data.changeSlotStartDay+'\' , \''+data.changeSlotValid+'\', \''+valueweek.weekStartDate+'\',  \''+valueweek.updateSlotDate+'\', \''+valueweek.weekEndDate+'\',\'add\',\'taskNameDropdow\');"><i class="fa fa-plus"></i></a>';
					html += '</th>';
				}
				html += '</tr>'
					+ '</thead><tbody>';
				$.each(valueweek.weeklyTime, function (keysingle, itemsingle) {


					var timhrArr = itemsingle.totalHrsSpent.split("h");
					var timHr = 0;
					var tims = 0;
					var timmin = 0;
					if (timhrArr.length > 1) {
						timHr = timhrArr[0];
						if (timhrArr[1] == ' ') {
							tims = 0;
						} else {
							tims = timhrArr[1].replace('m', '');
						}
					} else {
						tims = timhrArr[0].replace('m', '');
					}
					var timmin = timHr + '.' + $.trim(tims);

					var stims = timmin.toString().split(".");
					var seconds1 = 0;
					if (stims.length > 1) {
						var hrs = stims[0] > 0 ? stims[0] : 0;
						var mns = stims[1] > 0 ? stims[1] : 0;
						seconds1 = toSeconds(hrs, mns, 0);
					} else {
						var hrs = stims[0] > 0 ? stims[0] : 0;
						seconds1 = toSeconds(hrs, 0, 0);
					}
					totalSpentTimeNext += (seconds1);
					if(itemsingle.teacherPreferTime.length>0){
						html += weeklyContent(callFrom, itemsingle, "editView", teacherId, teacherUserid, keyweek, keysingle, data, modalID, 'next-slot',userRole);
					}
				});
				if (callFrom != 'teacher-profile-farword') {
					if (valueweek.weekStartDate != valueweek.weekEndDate) {
						html += '<tr>'
							+ '<td colspan="6" class="text-center">'
							+ '<a href="javascript:void(0)" id="add_week_' + (keyweek + 1) + '" class="border-1 btn-transition btn btn-outline-primary" onclick="getOpenPrefrenceTimePopup(\'admin-profile\', \''+modalID+'\',\'' + teacherId + '\', \'' + data.teacherUserId + '\', \'' + data.changeSlotLimit + '\',\'' + data.changeSlotStartDay + '\' , \'' + data.changeSlotValid + '\', \'' + valueweek.weekStartDate + '\',  \'' + data.updateSlotDate + '\', \'' + valueweek.weekEndDate + '\',\'add\',\'taskNameDropdow\', \'' + data.agreedMiniHours + '\', \'' + data.agreedMaxHours + '\',\'next-slot\', \'' + data.agreedHours + '\', \'' + data.agreedHalfHours + '\', \'' + data.agreedAvgHours + '\',\''+userRole+'\');"><i class="fa fa-plus"></i>Add more days within this week</a>'
							+ '</td>'
							+ '</tr>';
					} else if ((keyweek + 1) == 3 && valueweek.weeklyTime == null) {
						html += '<tr>'
							+ '<td colspan="6" class="text-center">'
							+ '<a href="javascript:void(0)" id="add_week_' + (keyweek + 1) + '" class="border-1 btn-transition btn btn-outline-primary" onclick="getOpenPrefrenceTimePopup(\'admin-profile\', \''+modalID+'\',\'' + teacherId + '\', \'' + data.teacherUserId + '\', \'' + data.changeSlotLimit + '\',\'' + data.changeSlotStartDay + '\' , \'' + data.changeSlotValid + '\', \'' + valueweek.weekStartDate + '\',  \'' + data.updateSlotDate + '\', \'' + valueweek.weekEndDate + '\',\'add\',\'taskNameDropdow\', \'' + data.agreedMiniHours + '\', \'' + data.agreedMaxHours + '\',\'next-slot\', \'' + data.agreedHours + '\', \'' + data.agreedHalfHours + '\', \'' + data.agreedAvgHours + '\',\''+userRole+'\');"><i class="fa fa-plus"></i>Add more days within this week</a>'
							+ '</td>'
							+ '</tr>';
					}
				}
				html += '<tr>'
					+ '<td colspan="4" class="text-right">'
					+ '<span class="bg-primary text-white d-inline-block py-1 px-2 rounded">Total time: ' + secondsToHms(totalSpentTimeNext) + '</span>'
					+ '</td>';
				// if(valueweek.weekStartDate!=valueweek.weekEndDate){
				html += '<td>&nbsp;</td>';
				// }
				html += '</tr>'
					+ '</tbody></table>'
					+ '</td>'
					+ '</tr>'
					+ '</tbody>'
					+ '</table>'
					+ '</div>';
			});
			html += '</div>';
		}
	}
	return html;
}

function weeklyContent(callFrom, data, controlTYpe, teacherId, teacherUserid, keyweek, keysingle, maindata, modalID, timeslot,userRole) {
	var html = '';
	var dval = new Date(data.startDate);
	var dateFormt = dval.toDateString().split(" ");
	dateFormt = dateFormt[1] + ' ' + dateFormt[2] + ', ' + dateFormt[3];
	var trid = "tr-live-class-profile";
	var slotType = data.slotType;
	var editslotStatus = true;
	var rmid = "";
	if (callFrom == 'teacher-profile-farword') {
		trid = "tr-live-class";
		editslotStatus = false;
		slotType = "";//(data.slotType == 'Live Classes' ? 'LIVE' : 'ADMIN');
		if(data.slotType=='System Training'){
			slotType='SYS-TRAINING';
		}else if(data.slotType=='Live Classes'){
			slotType='LIVE';
		}else{
			slotType='ADMIN'
		}
		rmid = "rm-day-" + keyweek + "_" + keysingle;
	}

	var onclick = "removeTime('added-availability','" + rmid + "','" + keyweek + "','" + keysingle + "')";
	var editOnclick = "getOpenPrefrenceTimePopup('admin-profile', '"+modalID+"','" + teacherId + "', '" + teacherUserid + "', '" + maindata.changeSlotLimit + "', '" + maindata.changeSlotStartDay + "', '" + maindata.changeSlotValid + "', '" + maindata.changeSlotDate + "', '" + data.startDate + "','','edit','taskNameDropdow', '" + maindata.agreedMiniHours + "', '" + maindata.agreedMaxHours + "','" + timeslot + "', '" + maindata.agreedHours + "','" + maindata.agreedHalfHours + "', '" + maindata.agreedAvgHours + "','"+userRole+"')";
	var rmClick = "callTimePreferenceByDate(\\\'admin-profile\\\', \\\'" + teacherId + "\\\', \\\'" + teacherUserid + "\\\', \\\'"+userRole+"\\\', \\\'" + data.startDate + "\\\', \\\'" + modalID + "\\\', \\\'delete\\\',\\\'0\\\')";
	var actionDelete = "showWarningMessage(\'Are you sure you want to delete?\',\'" + rmClick + "\')";

	//action+='<a href="javascript:void(0);" onclick="showWarningMessage(\'Are you sure you want to delete?\',\'submitRequestDemoMeetingSlots(\\\'teacherMeetingSlotsForm\\\',\\\'TEACHER\\\',\\\'EDIT\\\',\\\''+v.meetingId+'\\\',\\\'DELETESLOTFROMTEACHER\\\','+roleAndModule.moduleId+','+userId+')\')"><i class="fa fa-trash"></i></a>';

	html += '<tr class="' + trid + ' ' + rmid + '" data-userid="' + teacherUserid + '" data-day-id="' + data.dayId + '" data-teach-date="' + dateFormt + '"  data-slot-type="' + slotType + '">';
	// if(editslotStatus){
	// 	html+='<td>'+data.dayId+'</td>';
	// }
	html += '<td>' + data.displayStartDate + '</td>'
		+ '<td>' + data.slotType + '</td>'
		+ '<td style="display: inline-block;">';


	$.each(data.teacherPreferTime, function (keyslot, valueslot) {
		var rmClick1 = "callTimePreferenceByDate(\\\'admin-profile\\\', \\\'" + teacherId + "\\\', \\\'" + teacherUserid + "\\\', \\\'"+userRole+"\\\', \\\'" + data.startDate + "\\\', \\\'" + modalID + "\\\', \\\'delete\\\',\\\'" + valueslot.timeid + "\\\')";
		var actionDelete1 = "showWarningMessage(\'Are you sure you want to delete?\',\'" + rmClick1 + "\')";
		html += '<span class="p-1 mb-1 text-center font-weight-semi-bold d-inline-block text-success border border-success rounded-5 font-10" data-teach-strtime="' + valueslot.startTime + '" data-teach-entime="' + valueslot.endTime + '">' + valueslot.displayStartTime + ' - ' + valueslot.displayEndTime;
		if (data.editDeleteStatus) {
			html += '<a href="javascript:void(0)" class="border-0 btn-transition btn btn-outline-danger" onclick="' + actionDelete1 + '" tabindex="0"><i class="fa fa-trash"></i></a>';
		}
		html += '</span>';
	});
	html += '</td>'
		+ '<td class="text-center">' + data.totalHrsSpent + '</td>';
	if (controlTYpe != "viewOnly") {
		if (data.editDeleteStatus) {
			html += '<td class="text-center">'
				+ '<span class="full">';
			if (editslotStatus) {
				html += '<a href="javascript:void(0)" class="border-0 btn-transition btn btn-outline-primary" onclick="' + editOnclick + '"><i class="fa fa-plus"></i></a>';
				html += '<a href="javascript:void(0)" class="border-0 btn-transition btn btn-outline-danger" onclick="' + actionDelete + '" tabindex="0"><i class="fa fa-trash"></i></a>';
			} else {
				html += '<a href="javascript:void(0)" class="border-0 btn-transition btn btn-outline-danger" onclick="' + onclick + '" tabindex="0"><i class="fa fa-trash"></i></a>';
			}
			html += '</span>'
				+ '</td>';
		}

	}
	html += '</tr>';
	return html;
}


function getRequestForTeacherTimeByDate(callfrom, teacherUserId, userRole, startdate, controlType, slotId) {
	var teacherAssignTimeRequest = {};
	teacherAssignTimeRequest['teacherUserId'] = teacherUserId;
	teacherAssignTimeRequest['startDate'] = startdate;
	teacherAssignTimeRequest['userRole'] = userRole;
	teacherAssignTimeRequest['schoolId'] = SCHOOL_ID;
	teacherAssignTimeRequest['callFrom'] = callfrom;
	teacherAssignTimeRequest['controlType'] = controlType;
	teacherAssignTimeRequest['slotId'] = slotId;
	teacherAssignTimeRequest['userId'] = USER_ID;
	return teacherAssignTimeRequest;
}

function callTimePreferenceByDate(callfrom, teacherid, teacherUserId, userRole, startdate, modalID, controlType, slotId) {
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLForHTML('report', 'get-time-preference-by-date'),
		data: JSON.stringify(getRequestForTeacherTimeByDate(callfrom, teacherUserId, userRole, startdate, controlType, slotId)),
		dataType: 'json',
		cache: false,
		timeout: 600000,
		async: true,
		success: function (data) {
			console.log(data);
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if (data['status'] == '3') {
					redirectLoginPage();
				} else {
					if (tt == 'theme2') {
						if (controlType == 'delete') {
							showMessageTheme2(1, data['message'], '', true);
						}

					} else if (tt == 'theme1') {
						//showMessage(true, data['message']);
					}
				}
			} else {
				if (controlType == 'delete') {
					showMessageTheme2(1, data['message'], '', true);
					if (callfrom == 'teacher-profile') {
						sessionStorage.reloadAfterPageLoad = true;
						location.reload();
						//location.reload();
					} else if (callfrom == 'teacher-my-slot') {
						callDashboardPageSchool(163, 'teacher-manage-slot');
					}


					else if (callfrom == 'admin-profile') {
						callTeacherTimePreference('admin-panel', teacherid, teacherUserId, userRole, modalID, "N");
					}

				} else {
					var htmlL = bindEditPrefrence(modalID, data, controlType);
					$("#" + modalID + " .added-availability").html(htmlL);
				}

			}
		},
		error: function (e) {
			if (tt == 'theme2') {
				showMessageTheme2(2, TECHNICAL_GLITCH, '', true);
			} else if (tt == 'theme1') {
				showMessage(true, TECHNICAL_GLITCH);
			}
		}
	});
}


function bindEditPrefrence(modalID, data, controlType) {
	var editData = data.teacherAssignTime;
	$("#" + modalID + " #availabilityDay").val(editData.dayId).trigger('change');
	$("#" + modalID + " #availabilityDay").attr('disabled', true);
	var html = '';
	$("#" + modalID + " .added-availability").html('');

	html += '<div>'
		+ '<div class="card mb-2 full" id="week_1">'
		+ '<table class="table mb-0">'
		+ '<tbody class="">'
		+ '<tr>'
		+ '<td class="border-top-0">'
		+ '<table class="table roop-table">'
		+ '<thead class="text-primary">'
		+ '<tr>'
		// +'<th valign="middle">Day</th>'
		+ '<th valign="middle">Day &amp; Date</th>'
		+ '<th valign="middle">Task Name</th>'
		+ '<th valign="middle">Slots</th>'
		+ '<th valign="middle" class="text-center">Total Time</th>'
		+ '<th valign="middle" class="text-center">Action</th>'
		+ '</tr>'
		+ '</thead><tbody id="editTimeSlot">';

	$.each(editData.teacherPreferTime, function (keyslot, valueslot) {

		var dval = new Date(editData.startDate);
		var dateFormt = dval.toDateString().split(" ");
		dateFormt = dateFormt[1] + ' ' + dateFormt[2] + ', ' + dateFormt[3];

		var slotType = "";//(valueslot.slotType == 'LIVE' ? 'Live Classes' : 'Admin Task');
		if(valueslot.slotType=='SYS-TRAINING'){
			slotType='System Training';
		}else if(valueslot.slotType=='LIVE'){
			slotType='Live Classes';
		}else{
			slotType='Admin Task';
		}
		var rmid = "rm-day_" + keyslot;
		var onclick = "removeTime('added-availability','" + rmid + "','0','" + keyslot + "')";
		html += '<tr class="tr-live-class ' + rmid + '" data-userid="' + editData.teacherUserId + '" data-day-id="' + editData.dayId + '" data-teach-date="' + dateFormt + '"  data-slot-type="' + valueslot.slotType + '">'
			// +'<td>' + editData.dayId + '</td>'	
			+ '<td>' + editData.displayStartDate + '</td>'
			+ '<td>' + slotType + '</td>'
			+ '<td style="max-width: 300px;display: inline-block;">'
			+ '<span class="p-1 mb-1 text-center font-weight-semi-bold d-inline-block text-success border border-success rounded-5 font-10" data-teach-strtime="' + valueslot.startTime + '" data-teach-entime="' + valueslot.endTime + '">' + valueslot.displayStartTime + ' - ' + valueslot.displayEndTime + '</span>'
			+ '</td>'
			+ '<td class="text-center">' + valueslot.totalHrsSpent + '</td>'
			+ '<td class="text-center">';
		// if(controlType!='addmore'){
		// 	html+='<span class="full">'
		// 				+'<a href="javascript:void(0)" class="border-0 btn-transition btn btn-outline-danger"  tabindex="0" onclick="'+onclick+'"><i class="fa fa-trash"></i></a>'
		// 			+'</span>';
		// }

		html += '</td>'
			+ '</tr>';
	});
	html += '</tbody><tbody id="editTimeVertualSlot"></tbody></table>'
		+ '</td>'
		+ '</tr>'
		+ '</tbody>'
		+ '</table>'
		+ '</div>'
		+ '</div>';
	return html;
}


function callOrientationtime(){
	customLoader(true);
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLFor('orientation','get-orientation-time'),
		data : JSON.stringify(getRequestForOrientationTime()),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		async:true,
		success : function(data) {
			console.log(data);
			if (data['status'] == '0' || data['status'] == '2'|| data['status'] == '3') {
				
			}else {
				var html = getOrientSlot(data.demoFreeSlotsList);
				$(".viewOrientFreeSlot").html(html);
				$(".timeSlotWrapper").removeClass("d-none");
				$('.timeSlotWrapper').show();
				$(".meeting-time").click(function(){
					var slotID = $(this).attr("for");
					if($("#"+slotID).prop("checked")){
						$(this).parent().addClass("bg-primary text-white").removeClass("text-primary");
						$(this).parent().closest(".time-slot").siblings().find(".form-check").addClass("text-primary").removeClass("bg-primary text-white");
						$("#moveToDashboardProcess").removeClass("disabled btn-light");
						$("#moveToDashboardProcess").addClass("btn-success");
						$("#moveToDashboardProcess").text("Confirm")
					}
				});
			}
			customLoader(false);
		},
		error : function(e) {
			if(tt=='theme2'){
				showMessageTheme2(2, TECHNICAL_GLITCH,'',true);
			}else if(tt=='theme1'){
				showMessage(true, TECHNICAL_GLITCH);
			}
		}
	});
  }

  function getRequestForOrientationTime() {
	var teacherAssignRequest = {};
	teacherAssignRequest['userId'] = USER_ID;	
	teacherAssignRequest['userRole'] = USER_ROLE;
	teacherAssignRequest['schoolId'] = SCHOOL_ID;	
	teacherAssignRequest['slotType'] = 'SYS-TRAINING';	
	teacherAssignRequest['bookDate'] = $('#chooseDateSystemTrainingDate').val();	
	return teacherAssignRequest;
}

function getOrientSlot(data){
	var html="No slot available. Please pick another date";
	$(".viewOrientFreeSlot").css({"pointer-events":"none"});
	if(data.length>0){
		$("#userTimeZone").text("("+data[0].studentTimeZone+")")
		var html="";
		var ind=1;
		var option1="<option value=\"\">Select Time</option>";
		if(data.length>0){
			for (let i = 0; i < data.length; i++) {
				const element = data[i];
				html+="<div class=\"time-slot col-lg-6 col-md-6 col-sm-12\"> ";
				html+="<div class=\"form-check border-primary text-primary p-0\"> ";
				html+="<label class=\"meeting-time full d-inline-flex justify-content-flex-start align-items-center pl-4 ml-2\" for=\""+ind+"\"> ";
				//html+="<input class=\"form-check-input time-radio orient_time\" type=\"radio\" name=\"slotTime\" id=\""+ind+"\"  slotsttime=\""+element.stTime+"\" slotedtime=\""+element.edTime+"\" slotmeetdate=\""+element.meetDate+"\"  />"+element.meetingDate+" ("+element.startTime+"-"+element.endTime+") ";
				html+="<input class=\"form-check-input time-radio orient_time\" type=\"radio\" name=\"slotTime\" id=\""+ind+"\"  slotsttime=\""+element.stTime+"\" slotedtime=\""+element.edTime+"\" slotmeetdate=\""+element.meetDate+"\" slotTime=\""+element.startTime+"\" slotDuration=\""+element.meetingDuration+"\"  />"+element.meetingDate+" "+element.startTime+" ";
				html+="</label> ";
				html+="</div> ";
				html+="</div> ";
				ind=ind+1;
				option1+="<option value=\""+element.stTime+"-"+element.edTime+"\">"+element.startTime+" - "+element.endTime+"</option>";
				// option2+="<option value=\""+element.edTime+"\">"+element.endTime+"</option>";
			}
		}
		$(".viewOrientFreeSlot").css({"pointer-events":"inherit"});
	}
	// $("#orientStartTime").html(html)
	return html;
}
function getAvailability(userId){
	getAsPost('/timeavailability/time-availability?moduleId=182&schoolId=' + SCHOOL_ID +'&euid='+userId);
	customLoader(false)
}