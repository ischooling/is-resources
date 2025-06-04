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
	taskdto['schoolId'] = $("#" + formId + " #schoolId").val();
	taskdto['standardId'] = $("#" + formId + " #standardId").val();
	taskdto['subjectId'] = $("#" + formId + " #subjectId").val();
	taskdto['taskName'] = $("#" + formId + " #taskName").val();
	var startDateEndDate = $("#" + formId + " #startDateEndDate").val();
	var dates = startDateEndDate.split(" - ");
	taskdto['startDate'] = dates[0];
	taskdto['endDate'] = dates[1];
	if (editor1 != undefined) {
		taskdto['content'] = escapeCharacters(editor1.getData());
	}

	requestData['taskdto'] = taskdto;
	authentication['hash'] = getHash(); authentication['schoolId'] = SCHOOL_ID; authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = moduleId;
	authentication['userId'] = $("#" + formId + " #userId").val();
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

	var rating = $("#" + formId + " input[name='rating']:checked").val();
	var ratingDescr = $("#" + formId + " #sremark").val();
	var meetingId = $("#" + formId + " #meetingId").val();

	meetingSlotDTO['rating'] = rating;
	meetingSlotDTO['meetingResult'] = ratingDescr;
	meetingSlotDTO['meetingId'] = meetingId;

	requestData['meetingSlotDTO'] = meetingSlotDTO;
	authentication['hash'] = getHash(); authentication['schoolId'] = SCHOOL_ID; authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = moduleId;
	authentication['userId'] = $("#" + formId + " #userId").val();
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

function validateRequestForMeetingSlots(formId, moduleId, newTheme) {
	if ($('#slotCtFor').val() == 0 || $('#slotCtFor').val() == undefined) {
		if (newTheme) {
			showMessageTheme2(0, 'Session Creation For is required', '', true);
		} else {
			showMessage(true, 'Session Creation For is required');
		}
		return false;
	}
	if ($('#weekCount').val() == '' || $('#weekCount').val() == undefined) {

		if (newTheme) {
			showMessageTheme2(0, 'Session Type is required', '', true);
		} else {
			showMessage(true, 'Session Type is required');
		}
		return false;
	}
	if ($('#countryTimezoneId').val() == 0 || $('#countryTimezoneId').val() == undefined) {
		if (newTheme) {
			showMessageTheme2(0, 'Country Timezone is required', '', true);
		} else {
			showMessage(true, 'Country Timezone is required');
		}
		return false;
	}
	if ($('#dateCategory').val() == '' || $('#dateCategory').val() == undefined) {
		if (newTheme) {
			showMessageTheme2(0, 'Session Type  is required', '', true);
		} else {
			showMessage(true, 'Session Type  is required');
		}
		return false;
	}
	if ($('#meetingDateFrom').val() == '' || $('#meetingDateFrom').val() == undefined) {
		if (newTheme) {
			showMessageTheme2(0, 'Session Date From is required', '', true);
		} else {
			showMessage(true, 'Session Date From is required');
		}
		return false;
	}
	if ($('#meetingDateTo').val() == '' || $('#meetingDateTo').val() == undefined) {
		if (newTheme) {
			showMessageTheme2(0, 'Session Date to is required', '', true);
		} else {
			showMessage(true, 'Session Date to is required');
		}
		return false;
	}
	if (new Date($('#meetingDateFrom').val()) > new Date($('#meetingDateTo').val())) {//compare end <=, not >=
		if (newTheme) {
			showMessageTheme2(0, 'From date is less than To date', '', true);
		} else {
			showMessage(true, 'From date is less than To date');
		}
		return false;
	}
	if ($('#timeHrsFrom').val() == '' || $('#timeHrsFrom').val() == undefined) {
		if (newTheme) {
			showMessageTheme2(0, 'Session time is required', '', true);
		} else {
			showMessage(true, 'Session time is required');
		}
		return false;
	}
	if ($('#timeMinFrom').val() == '' || $('#timeMinFrom').val() == undefined) {
		if (newTheme) {
			showMessageTheme2(0, 'Session time is required', '', true);
		} else {
			showMessage(true, 'Session time is required');
		}
		return false;
	}
	if ($('#timeHrsTo').val() == '' || $('#timeHrsTo').val() == undefined) {
		if (newTheme) {
			showMessageTheme2(0, 'Session time is required', '', true);
		} else {
			showMessage(true, 'Session time is required');
		}
		return false;
	}
	if ($('#timeMinTo').val() == '' || $('#timeMinTo').val() == undefined) {
		if (newTheme) {
			showMessageTheme2(0, 'Session time is required', '', true);
		} else {
			showMessage(true, 'Session time is required');
		}
		return false;
	}
	if ($('#timeInterval').val() == 0 || $('#timeInterval').val() == undefined) {
		if (newTheme) {
			showMessageTheme2(0, 'Time Interval is required', '', true);
		} else {
			showMessage(true, 'Time Interval is required');
		}
		return false;
	}

	return true;
}


function calendarDateMeeting(replaceId, startDate, slotType) {
	var inActDate = $("#inActDate").val();
	var request = { startDate: startDate, slotType: slotType, disabledDate: inActDate };
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLForHTML('dashboard', 'meeting-dates'),
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



function calendarDateMeetingSlots(formId, moduleId, controlType, replaceId, requestType, newTheme) {

	if (newTheme) {
		hideMessageTheme2('');
	} else {
		hideMessage('');
	}
	if (!validateRequestForMeetingSlots(formId, moduleId, newTheme)) {
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
						if (newTheme) {
							showMessageTheme2(1, stringMessage[1], '', true);
						} else {
							showMessage(true, stringMessage[1]);
						}
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

	meetingSlotDTO['weekCount'] = $("#" + formId + " #weekCount").val();
	meetingSlotDTO['inActDate'] = $("#" + formId + " #inActDate").val();
	meetingSlotDTO['timezone'] = $('#countryTimezoneId option:selected').attr('custom_timezone_id');
	meetingSlotDTO['timeZoneCheck'] = $('#countryTimezoneId option:selected').val();
	meetingSlotDTO['dateCategory'] = $("#" + formId + " #dateCategory").val();
	meetingSlotDTO['startDate'] = $("#" + formId + " #meetingDateFrom").val();
	meetingSlotDTO['endDate'] = $("#" + formId + " #meetingDateTo").val();
	meetingSlotDTO['timeHrsFrom'] = $("#" + formId + " #timeHrsFrom").val();
	meetingSlotDTO['timeMinFrom'] = $("#" + formId + " #timeMinFrom").val();
	meetingSlotDTO['timeHrsTo'] = $("#" + formId + " #timeHrsTo").val();
	meetingSlotDTO['timeMinTo'] = $("#" + formId + " #timeMinTo").val();
	meetingSlotDTO['timeInterval'] = $("#" + formId + " #timeInterval").val();
	meetingSlotDTO['userId'] = $("#" + formId + " #userId").val();
	meetingSlotDTO['timeIntervalValue'] = $("#" + formId + " #sessionbuffer").val();
	meetingSlotDTO['meetingType'] = requestType;

	requestData['meetingSlotDTO'] = meetingSlotDTO;
	authentication['hash'] = getHash(); authentication['schoolId'] = SCHOOL_ID; authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = 'TEACHER';
	authentication['userId'] = $("#" + formId + " #userId").val();
	request['authentication'] = authentication;
	request['requestData'] = requestData;
	return request;
}


function validateRequestForMeetingSlotsList(formId, newTheme) {
	if ($("#" + formId + " #deleteMeetingDateFrom").val() == undefined || $("#" + formId + " #deleteMeetingDateFrom").val() == '') {
		if (newTheme) {
			showMessageTheme2(0, 'Session Date From is required', '', true);
		} else {
			showMessage(true, 'Session Date From is required');
		}
		return false;
	}
	if ($("#" + formId + " #deleteMeetingDateTo").val() == undefined || $("#" + formId + " #deleteMeetingDateTo").val() == '') {
		if (newTheme) {
			showMessageTheme2(0, 'Session Date to is required', '', true);
		} else {
			showMessage(true, 'Session Date to is required');
		}
		return false;
	}
	if (new Date($("#" + formId + " #deleteMeetingDateFrom").val().trim()) > new Date($("#" + formId + " #deleteMeetingDateTo").val())) {//compare end <=, not >=
		if (newTheme) {
			showMessageTheme2(0, 'From date should be less than To date', '', true);
		} else {
			showMessage(true, 'From date should be less than To date');
		}
		return false;
	}
	if ($("#" + formId + " #dTimeHrsFrom").val() == undefined || $("#" + formId + " #dTimeHrsFrom").val() == '') {
		if (newTheme) {
			showMessageTheme2(0, 'Session time is required', '', true);
		} else {
			showMessage(true, 'Session time is required');
		}
		return false;
	}
	if ($("#" + formId + " #dTimeMinFrom").val() == undefined || $("#" + formId + " #dTimeMinFrom").val() == '') {
		if (newTheme) {
			showMessageTheme2(0, 'Session time is required', '', true);
		} else {
			showMessage(true, 'Session time is required');
		}
		return false;
	}
	if ($("#" + formId + " #dTimeHrsTo").val() == undefined || $("#" + formId + " #dTimeHrsTo").val() == '') {
		if (newTheme) {
			showMessageTheme2(0, 'Session time is required', '', true);
		} else {
			showMessage(true, 'Session time is required');
		}
		return false;
	}
	if ($("#" + formId + " #dTimeMinTo").val() == undefined || $("#" + formId + " #dTimeMinTo").val() == '') {
		if (newTheme) {
			showMessageTheme2(0, 'Session time is required', '', true);
		} else {
			showMessage(true, 'Session time is required');
		}
		return false;
	}
	return true;
}
function meetingSlotsList(formId, replaceId, requestType, newTheme) {
	if (newTheme) {
		hideMessageTheme2('');
	} else {
		hideMessage('');
	}
	if (!validateRequestForMeetingSlotsList(formId, newTheme)) {
		return false;
	}
	customLoader(true);
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
						if (newTheme) {
							showMessageTheme2(1, stringMessage[1], '', true);
						} else {
							showMessage(true, stringMessage[1]);
						}
					}
				} else {
					$('#' + replaceId).html(htmlContent)
					$("#confirmDeleteSlots").show();
				}
				return false;
			}
			customLoader(false);
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



function redirectLmsTeacher(e) {

	var go_to_url = $(e).attr('changeurl');
	var checkedValue = $('.redirectLmsUrl').val()
	if ($('.redirectLmsUrl').is(":checked") == true && checkedValue == "yes") {
		setTimeout(function () {
			$('.switch').find('.switch-input').prop('checked', false);
		}, 600);
		setTimeout(function () {
			window.open(go_to_url, '_blank');
		}, 500);
	}

}