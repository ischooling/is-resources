$(document).ready(function () {

});
function callDashboardPageTeacher(pageNo, args) {
	if (pageNo == '1') {
		callForDashboardData('formIdIfAny', 'teacher-content');
	} else if (pageNo == '2a') {
		callForDashboardData('formIdIfAny', 'attendance-content' + args);
	} else if (pageNo == '2b') {
		callForDashboardData('formIdIfAny', 'student-attendance-list');
	} else if (pageNo == '3a') {
		callForDashboardData('formIdIfAny', 'teacher-subject-content');
	} else if (pageNo == '4a') {
		callForDashboardData('formIdIfAny', 'teacher-current-task-request-content');
	} else if (pageNo == '4b') {
		callForDashboardData('formIdIfAny', 'teacher-task-request-content');
	} else if (pageNo == '4c') {
		callForDashboardData('formIdIfAny', 'teacher-student-task-request-content');
	} else if (pageNo == '5') {
		callForDashboardData('formIdIfAny', 'teacher-events-content');
	} else if (pageNo == '6') {
		callForDashboardData('formIdIfAny', 'ptm-meeting-slots-request-content');
	} else if (pageNo == '7') {
		callForDashboardData('formIdIfAny', 'teacher-attempt-ptm-slots-request-content');
	} else if (pageNo == '8') {
		callForDashboardData('formIdIfAny', 'assigned-students-content');
	} else if (pageNo == '10') {
		callForDashboardData('formIdIfAny', 'techer-user-guide-request-content');
	} else if (pageNo == '11') {
		callForDashboardData('formIdIfAny', 'payment-history-list' + args);
	} else if (pageNo == '12') {
		callForDashboardData('formIdIfAny', 'teacher-create-session-content' + args);
	} else if (pageNo == '16T') {
		callForDashboardData('formIdIfAny', 'teacher-view-tips-attachement' + args);
	} else if (pageNo == '2002') {
		callForDashboardData('formIdIfAny', 'notifications' + args);
	}
}

/*function callTeacherInneraction(actionType, arg0,arg1){
//	if(actionType=='3syllabus'){
//		callForDashboardData('formIdIfAny','teacher-syllabus-content?subjectId='+arg0+'&placementSubjectId='+arg1);	
//	}
}*/


function createRatingAjax(params) {
	var ratingParams = $.parseJSON(params)
	$.ajax({
		type: "POST",
		url: getURLForHTML('dashboard', 'teacher-rating-submit-request-content'),
		data: { comments: ratingParams.comments, entityId: ratingParams.entityId, studentId: parseInt(ratingParams.studentId), rating: parseInt(ratingParams.rating) },
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
					$('#dashboardContentInHTML').html(htmlContent)
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

function submitTask(formId, moduleId) {
	hideMessage('');
	if (!validateRequestForSubmitTask(formId, moduleId)) {
		return false;
	}
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLFor('dashboard', 'task-submit'),
		data: JSON.stringify(getRequestForSubmitTask(formId, moduleId)),
		dataType: 'json',
		cache: false,
		timeout: 600000,
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				showMessage(false, data['message']);
				$('#' + formId)[0].reset();
				$("#" + formId + " #schoolId").val(1);
			}
			return false;
		},
		error: function (e) {
			//showMessage(true, e.responseText);
			return false;
		}
	});
}

function getRequestForSubmitTask(formId, moduleId) {
	var request = {};
	var authentication = {};
	var requestData = {};
	var taskdto = {};
	taskdto['schoolId'] = $("#" + formId + " #schoolId").val().trim();
	taskdto['standardId'] = $("#" + formId + " #standardId").val().trim();
	taskdto['subjectId'] = $("#" + formId + " #subjectId").val().trim();
	taskdto['taskName'] = $("#" + formId + " #taskName").val().trim();
	var startDateEndDate = $("#" + formId + " #startDateEndDate").val().trim();
	var dates = startDateEndDate.split(" - ");
	taskdto['startDate'] = dates[0];
	taskdto['endDate'] = dates[1];
	if (editor1 != undefined) {
		taskdto['content'] = escapeCharacters(editor1.getData());
	}

	requestData['taskdto'] = taskdto;
	authentication['hash'] = getHash(); authentication['schoolId'] = SCHOOL_ID; authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = moduleId;
	authentication['userId'] = $("#" + formId + " #userId").val().trim();
	request['authentication'] = authentication;
	request['requestData'] = requestData;
	return request;
}

function validateRequestForSubmitTask(formId, moduleId) {
	return true;
}

function submitPTMRemarksSlots(formId, moduleId) {
	hideMessage('');
	if (!validateRequestForSubmitPTMRemarksSlots(formId, moduleId)) {
		return false;
	}
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLFor('dashboard', 'ptm-remarks-submit'),
		data: JSON.stringify(getRequestForSubmitPTMRemarksSlots(formId, moduleId)),
		dataType: 'json',
		cache: false,
		timeout: 600000,
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				showMessage(false, data['message']);
				$('#' + formId)[0].reset();

			}
			return false;
		},
		error: function (e) {
			//showMessage(true, e.responseText);
			return false;
		}
	});
}

function getRequestForSubmitPTMRemarksSlots(formId, moduleId) {
	var request = {};
	var authentication = {};
	var requestData = {};
	var meetingSlotDTO = {};

	var rating = $("#" + formId + " input[name='rating']:checked").val().trim();
	var ratingDescr = $("#" + formId + " #sremark").val().trim();
	var meetingId = $("#" + formId + " #meetingId").val().trim();

	meetingSlotDTO['rating'] = rating;
	meetingSlotDTO['meetingResult'] = ratingDescr;
	meetingSlotDTO['meetingId'] = meetingId;

	requestData['meetingSlotDTO'] = meetingSlotDTO;
	authentication['hash'] = getHash(); authentication['schoolId'] = SCHOOL_ID; authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = moduleId;
	authentication['userId'] = $("#" + formId + " #userId").val().trim();
	request['authentication'] = authentication;
	request['requestData'] = requestData;
	return request;
}

function validateRequestForSubmitPTMRemarksSlots(formId, moduleId) {
	return true;
}

//$('#sendremarkback').bind('click', function() {
//	var rating=$("input[name='rating']:checked").val();
//	var ratingDescr=$('#sremark').val();
//	var meetingId=$('#meetingId').val();
//	console.log("rating "+ rating+' ratingDescr '+ratingDescr+' meetingId '+meetingId);
//	var url="/remarks";
//	var data = 'data={"meetingId":"'+meetingId+'", "rating":"'+rating+'", "ratingDescr":"'+ratingDescr+'"}';
//		jQuery.ajax({
//        type:'post',
//        url: url,
//        data: data,
//        dataType: "json",
//        success:function(response){
//        	console.log(response.status);
//        	if(response.status=='success'){
//        		alert("Successfully saved.");
//        		$('#remarkform').trigger("reset");
//        		
//        	}
//        	
//        },
//        error:function(response){
//        	return false;
//        }
//    });
//});

function validateRequestForMeetingSlots(formId) {

	if ($("#" + formId + " #slotCtFor").length > 0) {
		if ($("#" + formId + " #slotCtFor").val().trim() == '0') {
			showMessage(true, 'Session Creation For field is mandatory.');
			return false;
		}
	}
	if ($("#" + formId + " #weekCount").val() == undefined || $("#" + formId + " #weekCount").val() == '') {
		showMessage(true, 'Session Type is required');
		return false;
	}
	if ($("#" + formId + " #countryTimezoneId").val() == undefined || $("#" + formId + " #countryTimezoneId").val() == 0) {
		showMessage(true, 'Country Timezone is required');
		return false;
	}
	if ($("#" + formId + " #dateCategory").val() == undefined || $("#" + formId + " #dateCategory").val() == '') {
		showMessage(true, 'Session Type  is required');
		return false;
	}
	if ($("#" + formId + " #meetingDateFrom").val() == undefined || $("#" + formId + " #meetingDateFrom").val() == '') {
		showMessage(true, 'Session Date From is required');
		return false;
	}
	if ($("#" + formId + " #meetingDateTo").val() == undefined || $("#" + formId + " #meetingDateTo").val() == '') {
		showMessage(true, 'Session Date to is required');
		return false;
	}
	if (new Date($("#" + formId + " #meetingDateFrom").val().trim()) > new Date($("#" + formId + " #meetingDateTo").val().trim())) {//compare end <=, not >=
		showMessage(true, 'From date is less than To date');
		return false;
	}
	if ($("#" + formId + " #timeHrsFrom").val() == undefined || $("#" + formId + " #timeHrsFrom").val() == '') {
		showMessage(true, 'Session time is required');
		return false;
	}
	if ($("#" + formId + " #timeMinFrom").val() == undefined || $("#" + formId + " #timeMinFrom").val() == '') {
		showMessage(true, 'Session time is required');
		return false;
	}
	if ($("#" + formId + " #timeHrsTo").val() == undefined || $("#" + formId + " #timeHrsTo").val() == '') {
		showMessage(true, 'Session time is required');
		return false;
	}
	if ($("#" + formId + " #timeMinTo").val() == undefined || $("#" + formId + " #timeMinTo").val() == '') {
		showMessage(true, 'Session time is required');
		return false;
	}
	if ($("#" + formId + " #timeInterval").val() == undefined || $("#" + formId + " #timeInterval").val() == 0) {
		showMessage(true, 'Time Interval is required');
		return false;
	}
	return true;
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



function calendarDateMeetingSlots(formId, moduleId, controlType, replaceId, requestType) {
	hideMessage('');
	if (!validateRequestForMeetingSlots(formId)) {
		return false;
	}
	$.ajax({
		type: "POST",
		url: getURLForHTML('dashboard', 'meeting-dates-slots'),
		data: encodeURI("request=" + JSON.stringify(getRequestForMeetingSlots(formId, requestType))),
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
function getRequestForMeetingSlots(formId, requestType) {
	var request = {};
	var authentication = {};
	var requestData = {};
	var meetingSlotDTO = {};

	meetingSlotDTO['weekCount'] = $("#" + formId + " #weekCount").val().trim();
	meetingSlotDTO['inActDate'] = $("#" + formId + " #inActDate").val().trim();
	meetingSlotDTO['timezone'] = $('#countryTimezoneId option:selected').attr('custom_timezone_id');
	meetingSlotDTO['timeZoneCheck'] = $('#countryTimezoneId option:selected').val().trim();
	meetingSlotDTO['dateCategory'] = $("#" + formId + " #dateCategory").val().trim();
	meetingSlotDTO['startDate'] = $("#" + formId + " #meetingDateFrom").val().trim();
	meetingSlotDTO['endDate'] = $("#" + formId + " #meetingDateTo").val().trim();
	meetingSlotDTO['timeHrsFrom'] = $("#" + formId + " #timeHrsFrom").val().trim();
	meetingSlotDTO['timeMinFrom'] = $("#" + formId + " #timeMinFrom").val().trim();
	meetingSlotDTO['timeHrsTo'] = $("#" + formId + " #timeHrsTo").val().trim();
	meetingSlotDTO['timeMinTo'] = $("#" + formId + " #timeMinTo").val().trim();
	meetingSlotDTO['timeInterval'] = $("#" + formId + " #timeInterval").val().trim();
	meetingSlotDTO['userId'] = $("#" + formId + " #userId").val().trim();
	meetingSlotDTO['slotCtFor'] = $("#" + formId + " #slotCtFor").val().trim();
	meetingSlotDTO['meetingType'] = requestType;
	meetingSlotDTO['timeIntervalValue'] = $("#" + formId + " #sessionbuffer").val();

	requestData['meetingSlotDTO'] = meetingSlotDTO;
	authentication['hash'] = getHash(); authentication['schoolId'] = SCHOOL_ID; authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = 'TEACHER';
	authentication['userId'] = $("#" + formId + " #userId").val().trim();
	request['authentication'] = authentication;
	request['requestData'] = requestData;
	return request;
}

function validateRequestForMeetingSlotsList(formId) {
	if ($("#" + formId + " #deleteMeetingDateFrom").val() == undefined || $("#" + formId + " #deleteMeetingDateFrom").val() == '') {
		showMessage(true, 'Session Date From is required');
		return false;
	}
	if ($("#" + formId + " #deleteMeetingDateTo").val() == undefined || $("#" + formId + " #deleteMeetingDateTo").val() == '') {
		showMessage(true, 'Session Date to is required');
		return false;
	}
	if (new Date($("#" + formId + " #deleteMeetingDateFrom").val().trim()) > new Date($("#" + formId + " #deleteMeetingDateTo").val())) {//compare end <=, not >=
		showMessage(true, 'From date should be less than To date');
		return false;
	}
	if ($("#" + formId + " #dTimeHrsFrom").val() == undefined || $("#" + formId + " #dTimeHrsFrom").val() == '') {
		showMessage(true, 'Session time is required');
		return false;
	}
	if ($("#" + formId + " #dTimeMinFrom").val() == undefined || $("#" + formId + " #dTimeMinFrom").val() == '') {
		showMessage(true, 'Session time is required');
		return false;
	}
	if ($("#" + formId + " #dTimeHrsTo").val() == undefined || $("#" + formId + " #dTimeHrsTo").val() == '') {
		showMessage(true, 'Session time is required');
		return false;
	}
	if ($("#" + formId + " #dTimeMinTo").val() == undefined || $("#" + formId + " #dTimeMinTo").val() == '') {
		showMessage(true, 'Session time is required');
		return false;
	}
	return true;
}

function meetingSlotsList(formId, replaceId, requestType) {
	hideMessage('');
	if (!validateRequestForMeetingSlotsList(formId)) {
		return false;
	}
	$.ajax({
		type: "POST",
		url: getURLForHTML('dashboard', 'meeting-slots-list'),
		data: encodeURI("request=" + JSON.stringify(getRequestForMeetingSlotsList(formId, requestType))),
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
					$('#' + replaceId).html(htmlContent)
					$("#confirmDeleteSlots").show();
				}
				return false;
			}
		},
		error: function (e) {
			return false;
		}
	});
}
function getRequestForMeetingSlotsList(formId, requestType) {
	var request = {};
	var authentication = {};
	var requestData = {};
	var meetingSlotsRequestDTO = {};

	var meetStDate = $("#" + formId + " #deleteMeetingDateFrom").val().split("-");
	meetStDate = meetStDate[2] + '-' + meetStDate[0] + '-' + meetStDate[1];
	var meetEdDate = $("#" + formId + " #deleteMeetingDateTo").val().split("-");
	meetEdDate = meetEdDate[2] + '-' + meetEdDate[0] + '-' + meetEdDate[1];
	meetingSlotsRequestDTO['startDate'] = meetStDate;
	meetingSlotsRequestDTO['endDate'] = meetEdDate;
	meetingSlotsRequestDTO['timeHrsFrom'] = $("#" + formId + " #dTimeHrsFrom").val();
	meetingSlotsRequestDTO['timeMinFrom'] = $("#" + formId + " #dTimeMinFrom").val();
	meetingSlotsRequestDTO['timeHrsTo'] = $("#" + formId + " #dTimeHrsTo").val();
	meetingSlotsRequestDTO['timeMinTo'] = $("#" + formId + " #dTimeMinTo").val();
	meetingSlotsRequestDTO['teacherUserId'] = $("#" + formId + " #userId").val();
	meetingSlotsRequestDTO['meetingType'] = requestType;
	meetingSlotsRequestDTO['teacherTimeZone'] = $("#" + formId + " #teacherTimezone").val();

	requestData['meetingSlotsRequestDTO'] = meetingSlotsRequestDTO;
	authentication['hash'] = getHash(); authentication['schoolId'] = SCHOOL_ID; authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = 'TEACHER';
	authentication['userId'] = $("#" + formId + " #userId").val();
	request['authentication'] = authentication;
	request['requestData'] = requestData;
	return request;
}