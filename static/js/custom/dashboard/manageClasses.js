$(document).ready(function () {
	getWaringContent1();
});

function advanceClassroomSearch(formId, moduleId, userId, userRole) {
	checkTextBox(formId);
	if ($('#' + formId + ' #classStartDate').val() == '' && $('#' + formId + ' #classEndDate').val() != '') {
		if (tt == 'theme1') {
			showMessage(false, 'Please select start date');
		} else {
			showMessageTheme2(0, 'Please select start date', '', true);
		}
		return false;
	} else if ($('#' + formId + ' #classStartDate').val() != '' && $('#' + formId + ' #classEndDate').val() == '') {
		if (tt == 'theme1') {
			showMessage(false, 'Please select end date');
		} else {
			showMessageTheme2(0, 'Please select end date', '', true);
		}
		return false;
	}
	var argument = '?moduleId=' + moduleId + '&schoolId=' + SCHOOL_ID + '&' + decodeURIComponent($('#'+formId).serialize());
	console.log(argument);
	classroomSessionsData('classroomSessionsList', argument, userId, userRole);
}

function classroomSessionsData(elementId, argument, userId, role) {
	customLoader(true);
	var data = parseUrlToJson(argument);
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: BASE_URL + CONTEXT_PATH + SCHOOL_UUID + "/dashboard/student-teacher-sessions-report-data/" + UNIQUEUUID,
		data: JSON.stringify(data),
		dataType: 'json',
		global: false,
		success: function (data) {
			$('#' + elementId + ' > tbody').html('');
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if (data['status'] == '3') {
					redirectLoginPage();
				} else {
					if (tt == 'theme1') {
						showMessage(false, data['message']);
					} else {
						showMessageTheme2(0, data['message'], '', true);
					}
				}
			} else {
				$('#manageSessionContentDiv').html(manageClassroomTable(elementId, role));
				$('#' + elementId + ' > tbody').append(getClassroomBody(data.sessions, userId, role, data.resetMeetingRights));
				var isDataTable = $.fn.dataTable.isDataTable('#' + elementId);
				if (isDataTable) {
					$('#' + elementId).dataTable().fnDestroy();
				}
				$('#' + elementId).DataTable();
			}
			customLoader(false);
			return false;
		},
		error: function (e) {
			if (checkonlineOfflineStatus()) {
				return;
			}else{
				return false;
			}
		}
	});
	bindHover();
}

function classroomSessionsForOther(elementId, argument) {
	var isDataTable = $.fn.dataTable.isDataTable('#' + elementId);
	if (isDataTable) {
		$('#' + elementId).dataTable().fnDestroy();
	}
	$('#' + elementId).DataTable({
		"stateSave": true,
		"searching": true,
		"processing": true,
		"serverSide": true,
		"pagingType": "full",
		"searching": true,
		"pageLength": 10,
		"stateLoadParams": function (settings, data) {
			if (!DEFAULT_SEARCH_STATE) {
				return false;
			}
		},
		"ajax": {
			"url": CONTEXT_PATH + UNIQUEUUID + "/dashboard/student-teacher-sessions-report-data" + argument,
			"data": function (data) {
				console.log('data ' + data)
			}
		},
		"fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
			$(nRow).find('td:eq(3)').css('text-align', 'left');
			$(nRow).find('td:eq(4)').css('text-align', 'left');
			$(nRow).find('td:eq(5)').css('text-align', 'left');
			//$('tr').addClass('success');
		},
		"columns": [
			{ "data": "sno", "name": "sno", "title": "S. No" },
			{ "data": "subjectName", "name": "subjectName", "title": "Course Name" },//standardName
			{ "data": "teacherName", "name": "teacherName", "title": "Teacher Details" },//teacherEmail
			{ "data": "studentName", "name": "studentName", "title": "Student Details" },//studentEmail
			{ "data": "studentDateTime", "name": "studentDateTime", "title": "Student Time Zone" },//studentTimezone studentDaylightResponse
			{ "data": "teacherDateTime", "name": "teacherTimeZone", "title": "Teacher Time Zone" },//teacherTimezone teacherDaylightResponse
			{ "data": "adminDateTime", "name": "adminDateTime", "title": "Admin Time Zone" },//adminDateTime
			{ "data": "recordingUrl", "name": "recordingUrl", "title": "Join/View Class" },
			//{ "data": "moderator", "name" : "moderator", "title" : "Join Class"},
			//{ "data": "attendee", "name" : "attendee", "title" : "Join/View Class As Attendee"},
			{ "data": "attendeeStatus", "name": "attendeeStatus", "title": "Link Generation Status" },
			{ "data": "sessionLink", "name": "sessionLink", "title": "Class Link" },
			{ "data": "sendMail", "name": "sendMail", "title": "Send Mail" },
			{ "data": "markSession", "name": "markSession", "title": "Mark Session" },
			{ "data": "status", "name": "status", "title": "Session Status" },
			{ "data": "createdDate", "name": "createdDate", "title": "Created Date / Booked Date" },//bookedDate
			//        	 { "data": "recordingPublished", "name" : "recordingPublished", "title" : "Action"},
			//        	 { "data": "endMeeting", "name" : "endMeeting", "title" : "End meeting"},
		],
	});
	$('#' + elementId).dataTable().fnSetFilteringEnterPress();
	bindHover();
}

function extraSessionDetails(elementId, argument) {
	var isDataTable = $.fn.dataTable.isDataTable('#' + elementId);
	if (isDataTable) {
		$('#' + elementId).dataTable().fnDestroy();
	}
	$('#' + elementId).DataTable({
		"stateSave": true,
		"searching": true,
		"processing": true,
		"serverSide": true,
		"pagingType": "full",
		"searching": true,
		"pageLength": 10,
		"stateLoadParams": function (settings, data) {
			if (!DEFAULT_SEARCH_STATE) {
				return false;
			}
		},
		"ajax": {
			"url": CONTEXT_PATH + UNIQUEUUID + "/dashboard/extra-session-details-data" + argument,
			"data": function (data) {
				console.log('data ' + data)
			}
		},
		"fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
			$(nRow).find('td:eq(3)').css('text-align', 'left');
			$(nRow).find('td:eq(4)').css('text-align', 'left');
			$(nRow).find('td:eq(5)').css('text-align', 'left');
			//$('tr').addClass('success');
		},
		"columns": [
			{ "data": "sno", "name": "sno", "title": "S. No" },
			{ "data": "studentName", "name": "studentName", "title": "Student Name" },
			{ "data": "studentStringId", "name": "studentStringId", "title": "Student ID" },
			{ "data": "email", "name": "email", "title": "Email" },
			{ "data": "grade", "name": "grade", "title": "Grade" },
			{ "data": "referenceNo", "name": "referenceNo", "title": "Transaction Reference no" },
			{ "data": "paymentDate", "name": "paymentDate", "title": "Payment Date" },
			{ "data": "totalAmount", "name": "totalAmount", "title": "Total Amount" },
			{ "data": "courseDetails", "name": "courseDetails", "title": "Course PlanDetails" },
			//       	 { "data": "attendeeStatus", "name" : "attendeeStatus", "title" : "Link Generation Status"},
			//       	 { "data": "sessionLink", "name" : "sessionLink", "title" : "Session Link"},
			//       	 { "data": "sendMail", "name" : "sendMail", "title" : "Send Mail"},
			//       	 { "data": "markSession", "name" : "markSession", "title" : "Mark Session"},
			//       	 { "data": "status", "name" : "status", "title" : "Session Status"},
			//       	 { "data": "createdDate", "name" : "createdDate", "title" : "Created Date / Booked Date"},//bookedDate
			//       	 { "data": "recordingPublished", "name" : "recordingPublished", "title" : "Action"},
			//       	 { "data": "endMeeting", "name" : "endMeeting", "title" : "End meeting"},

		],
	});
	$('#' + elementId).dataTable().fnSetFilteringEnterPress();
	bindHover();
}

function toggleFilter(elementId) {
	$('#'+elementId).stop().slideToggle();
}
function saveClassroomSessionMeetingUrl(moduleId, role) {
	submitMeetingForStudentSessionSlots("meetingUrlForm", "SCHOOL", "ADDURL", moduleId, "STUDENT_DOUBT_SESSION", role);
}
function sendClassroomSessionMail(moduleId, role) {
	submitMeetingForStudentSessionSlots("sendMailForm", "SCHOOL", "SENDMAIL", moduleId, "STUDENT_DOUBT_SESSION", role);
}
function publishClassroomSession(moduleId, role) {
	submitMeetingForStudentSessionSlots("publishRecordForm", "SCHOOL", "PUBLISH_RECORD", moduleId, "STUDENT_DOUBT_SESSION", role);
}
function revokeClassroomSession(moduleId, role) {
	submitMeetingForStudentSessionSlots("revokeForm", "SCHOOL", "REVOKE", moduleId, "STUDENT_DOUBT_SESSION", role);
}
function updateClassroomSession(moduleId, role) {
	if ($('#meetingResult').val() == "N/A" || $('#meetingResult').val() == "") {
		showMessage(true, 'Please Choose Mark Session');
	} else {
		submitMeetingForStudentSessionSlots("updateMeetingResultForm", "SCHOOL", "UPDATE", moduleId, "STUDENT_DOUBT_SESSION", role);
	}
}
function validateRequestForSubmitMeetingForStudentSessionSlots(formId, moduleId, controllType) {
	//	if(controllType=='ADD'){
	//		if($('#standardId').val()==0 || $('#standardId').val()==undefined){
	//			showMessage(true, 'Grade is required');
	//			return false;
	//		}
	//		if($('#subjectId').val()==0 || $('#subjectId').val()==undefined){
	//			showMessage(true, 'Course is required');
	//			return false;
	//		}
	//		if($('#countryTimezoneId').val()==0 || $('#countryTimezoneId').val()==undefined){
	//			showMessage(true, 'Time-Zone is required');
	//			return false;
	//		}
	//		if($('#weekPickerId').val()==0 || $('#weekPickerId').val()==undefined){
	//			showMessage(true, 'Meeting week is required');
	//			return false;
	//		}
	//		if($('#meetingDate').val()=='' || $('#meetingDate').val()==undefined){
	//			showMessage(true, 'Meeting Date is required');
	//			return false;
	//		}
	//		if($('#startTime').val()=='' || $('#startTime').val()==undefined){
	//			showMessage(true, 'Start Time is required');
	//			return false;
	//		}
	//		if($('#timeInterval').val()==0 || $('#timeInterval').val()==undefined){
	//			showMessage(true, 'Time Interval is required');
	//			return false;
	//		}
	////		var selDate=$('#meetingDate').val().split('-');
	////	    var selTime = $('#startTime').val().split(':');
	////	    var selectedDate = new Date(selDate[2],selDate[0]-1,selDate[1], selTime[0],selTime[1]);
	////	    var currentDate=new Date();
	////	    //var currentDate = new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate())
	////	    console.log('selectedDate=>'+selectedDate.getTime()+' currentDate=>'+currentDate.getTime())
	////	    if(selectedDate.getTime()<=currentDate.getTime()){
	////	    	showMessage(true, 'Please create future meeting slots');
	////	    	return false;
	////	    }
	//	}else
	if (controllType == 'UPDATE') {
		if ($('#meetingResult').val() == '' || $('#meetingResult').val() == undefined) {
			showMessage(true, 'Session Status is required');
			return false;
		}
	} else if (controllType == 'ADDURL') {
		if ($('#meetingUrl').val() == '' || $('#meetingUrl').val() == undefined) {
			showMessage(true, 'Class Link is required');
			return false;
		}
	}
	return true;
}
function submitMeetingForStudentSessionSlots(formId, moduleId, controllType, roleModuleId, requestType, role) {
	$(".meetingSave").prop("disabled", true);
	hideMessage('');
	if (!validateRequestForSubmitMeetingForStudentSessionSlots(formId, moduleId, controllType)) {
		$(".meetingSave").prop("disabled", true);
		return true;
	}
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLFor('dashboard', 'meetingslots-new-submit'),
		data: JSON.stringify(getRequestForSubmitMeetingForStudentSessionSlots(formId, moduleId, controllType, requestType)),
		dataType: 'json',
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2') {
				$(".meetingSave").prop("disabled", false);
				showMessage(true, data['message']);
			} else {
				showMessage(false, data['message']);
				if (requestType == 'COUNSELORMEET') {
					if ("ADD" == controllType) {
						showMessage(false, data['message']);
						$('#teacherMeetingSlotsModal').modal('toggle');
						$('#' + formId)[0].reset();
						setTimeout(function () { callDashboardPageSchool(roleModuleId, 'counselor-meet-slot', '', '?moduleId=' + roleModuleId + '&requestType=' + requestType); }, 1000);
					} else if ("EDIT" == controllType) {
						showMessage(false, data['message']);
						$('#' + formId)[0].reset();
						setTimeout(function () { callDashboardPageSchool(roleModuleId, 'counselor-meet-slot', '', '?moduleId=' + roleModuleId + '&requestType=' + requestType); }, 1000);
					}
					$('body').removeClass('modal-open');
				} else if (requestType == 'REQUESTDEMO') {
					if ("ADD" == controllType) {
						showMessage(false, data['message']);
						$('#teacherMeetingSlotsModal').modal('toggle');
						$('#' + formId)[0].reset();
						setTimeout(function () { callDashboardPageSchool(roleModuleId, 'student-meet-slot', '', '?moduleId=' + roleModuleId + '&requestType=' + requestType); }, 1000);
					} else if ("EDIT" == controllType) {
						showMessage(false, data['message']);
						$('#' + formId)[0].reset();
						setTimeout(function () { callDashboardPageSchool(roleModuleId, 'student-meet-slot', '', '?moduleId=' + roleModuleId + '&requestType=' + requestType); }, 1000);
					}
					$('body').removeClass('modal-open');
				} else if (requestType == 'CONNECTMEET') {
					if ("ADD" == controllType) {
						showMessage(false, data['message']);
						$('#teacherMeetingSlotsModal').modal('toggle');
						$('#' + formId)[0].reset();
						setTimeout(function () { callDashboardPageSchool(roleModuleId, 'Connect-to-impact-slot', '', '?moduleId=' + roleModuleId + '&requestType=' + requestType); }, 1000);
					} else if ("EDIT" == controllType) {
						showMessage(false, data['message']);
						$('#' + formId)[0].reset();
						setTimeout(function () { callDashboardPageSchool(roleModuleId, 'Connect-to-impact-slot', '', '?moduleId=' + roleModuleId + '&requestType=' + requestType); }, 1000);
					}
					$('body').removeClass('modal-open');
				} else {
					if (controllType == 'ADD') {
						$('#teacherMeetingSlotsModal').modal('toggle');
						$('#' + formId)[0].reset();
						setTimeout(function () { callDashboardPageSchool(roleModuleId, 'create-manage-sessions', ''); }, 1000);
					}
					else if (controllType == 'UPDATE') {
						meetingId = $('#updateMeetingResultForm #meetingId').val();
						userId = $('#updateMeetingResultForm #userId').val();
						meetingCurStatus = $('#updateMeetingResultForm #meetingCurStatus').val();
						meetingResult = $('#updateMeetingResultForm #meetingResult').val();
						var changeClassroomSessionContent = '<a id="updateStatus' + meetingId + '" href="javascript:void(0);" onclick="meetingResultModal(' + meetingId + ',' + userId + ',\'' + meetingResult + '\',\'' + meetingCurStatus + '\',\'' + role + '\')">Change</a>';
						meetingResult = '<strong>' + meetingResult + '</strong><br/>';
						if ('TEACHER' != role) {
							meetingResult += ' | ';
							meetingResult += changeClassroomSessionContent;
						}
						$('.markSession' + meetingId).html(meetingResult);

						$('#updateMeetingResultModal').modal('toggle');
						$('#' + formId)[0].reset();
					} else if (controllType == 'ADDURL') {
						meetingId = $('#meetingUrlForm #meetingId').val();
						mailSendStatus = $('#meetingUrlForm #mailSendStatus').val();
						userId = $('#meetingUrlForm #userId').val();
						meetingUrl = $('#meetingUrlForm #meetingUrl').val();
						remarks = $('#meetingUrlForm #remarks').val();
						var joinClass = '<a id="joinClass' + meetingId + '" href="' + meetingUrl + '" target="_blank"><i data-toggle="tooltip" title="Join class" class="fa fa-video-camera"></i></a>';
						var viewComment = '<a id="_createLink' + meetingId + '" href="javascript:void(0);" onclick="meetingUrlModalTeacher(' + meetingId + ',' + userId + ',\'' + meetingUrl + '\',\'' + mailSendStatus + '\',\'' + remarks + '\')"><i data-toggle="tooltip" title="View Comments" class="fa fa-eye"></i></a>';

						$('.linkStatus' + meetingId).html('External Link Added');
						$('.joinView' + meetingId).html(joinClass + ' | ' + viewComment)
						var sendMail = '<a id="sendMail' + meetingId + '" href="javascript:void(0);" onclick="sendMailModel(' + meetingId + ',' + userId + ',\'' + meetingUrl + '\',\'N\')"><i data-toggle="tooltip" title="Send Mail" class="fa fa-paper-plane"></i></a>';
						$('.classAction' + meetingId).html(sendMail + ' | ' + $('.classAction' + meetingId).html());

						$('#meetingUrlModal').modal('toggle');
						$('#' + formId)[0].reset();
					} else if (controllType == 'SENDMAIL') {
						meetingId = $('#sendMailForm #meetingId').val();
						userId = $('#sendMailForm #userId').val();
						$('#updateStatus' + meetingId).before('<i data-toggle="tooltip" title="Mail Already Sent" class="fa fa-check"></i>|');
						$('#updateStatus' + meetingId).html('<i data-toggle="tooltip" title="ReSend Mail" class="fa fa-paper-plane"></i>');
						$('#sendMailModal').modal('toggle');
						$('#' + formId)[0].reset();
					} else if (controllType == 'PUBLISH_RECORD') {
						$('#publishRecordModal').modal('toggle');
						$('#' + formId)[0].reset();
					} else if (controllType == 'REVOKE') {
						$('#revokeModal').modal('toggle');
						$('#' + formId)[0].reset();
						// if(moduleId=='SCHOOL'){
						// 	setTimeout(function(){ callDashboardPageSchool(roleModuleId,'student-teacher-sessions'); }, 1000);
						// }else {
						// 	setTimeout(function(){ callDashboardPageTeacher(roleModuleId,'create-manage-sessions',''); }, 1000);
						// }
					} else if (controllType == 'RESET') {
						setTimeout(function () { callDashboardPageSchool(roleModuleId, 'student-teacher-sessions'); }, 1000);
					}
				}
			}
			return false;
		}
	});
}

function getRequestForSubmitMeetingForStudentSessionSlots(formId, moduleId, controllType, requestType) {
	var request = {};
	var authentication = {};
	var dashboardCommonDTO = {}
	var meetingSlotDTOList = [];

	if (controllType == 'ADD') {
		//		meetingSlotDTO['meetingType'] = "STUDENT_DOUBT_SESSION";
		//
		//		meetingSlotDTO['timezone'] = $('#countryTimezoneId option:selected').attr('custom_timezone_id');
		//		meetingSlotDTO['timeZoneCheck'] = $('#countryTimezoneId').val().trim();
		//		var meetDate = $("#"+formId+" #meetingDate").val().trim();
		//		meetDate = meetDate.split("-");
		//		meetingDate = meetDate[2]+"-"+meetDate[0]+"-"+meetDate[1];
		//
		//		meetingSlotDTO['meetingDate'] = meetingDate;
		//
		//		meetingSlotDTO['weekID'] = $("#"+formId+" #weekPickerId").val().trim();
		//		var startTime = $("#"+formId+" #startTime").val().trim();
		//		meetingSlotDTO['startTime'] = startTime;
		//
		//		var interval = $("#"+formId+" #timeInterval option:selected").val().trim();
		//		var endTime= new Date("2016/09/12 "+startTime+":00");
		//		endTime.setMinutes(endTime.getMinutes() + parseInt(interval));
		//		endTime = endTime.getHours()+":"+endTime.getMinutes();
		//
		//		meetingSlotDTO['endTime'] = endTime;
		//		meetingSlotDTO['subject'] = "STUDENT_DOUBT_SESSION";
		//		meetingSlotDTO['status'] = "0";

		$("#" + formId + " .slotDate").each(function () {
			var enabledTimeSlotsDTO = [];
			meetingSlotDTO = {};
			meetingSlotDTO['meetingType'] = requestType;//"STUDENT_DOUBT_SESSION";
			meetingSlotDTO['timezone'] = $("#" + formId + " #timeZoneId").val();
			meetingSlotDTO['weekCount'] = $("#" + formId + " #weekCount").val();
			meetingSlotDTO['inActDate'] = $("#" + formId + " #inActDate").val();
			meetingSlotDTO['dateCategory'] = $("#" + formId + " #dateCategory").val();
			if ($("#" + formId + " #slotCtFor").length > 0) {
				meetingSlotDTO['slotCtFor'] = $("#" + formId + " #slotCtFor").val().trim();
			}
			var meetDate = $(this).attr('data-text');
			meetDate = meetDate.split("-");
			meetingDate = meetDate[2] + "-" + meetDate[0] + "-" + meetDate[1];
			meetingSlotDTO['meetingDate'] = meetingDate;
			meetingSlotDTO['subject'] = requestType;

			$("#" + formId + " .slotTime" + $(this).attr('id')).each(function () {
				enabledTimeSlots = {};
				enabledTimeSlots['dayTime1'] = $(this).attr("data-starttime");
				enabledTimeSlots['dayTime2'] = $(this).attr("data-endtime");
				enabledTimeSlotsDTO.push(enabledTimeSlots);
			});
			meetingSlotDTO['enabledTimeSlotsDTO'] = enabledTimeSlotsDTO;
			meetingSlotDTOList.push(meetingSlotDTO);
		});
	} else if (controllType == 'UPDATE') {
		meetingSlotDTO = {};
		meetingSlotDTO['controllType'] = controllType;
		meetingSlotDTO['meetingType'] = "STUDENT_DOUBT_SESSION";
		meetingSlotDTO['meetingId'] = $("#" + formId + " #meetingId").val().trim();
		meetingSlotDTO['meetingResult'] = $("#" + formId + " #meetingResult option:selected").val().trim();
		meetingSlotDTO['userType'] = moduleId;
		meetingSlotDTOList.push(meetingSlotDTO);
	} else if (controllType == 'ADDURL') {
		meetingSlotDTO = {};
		meetingSlotDTO['controllType'] = controllType;
		meetingSlotDTO['meetingType'] = "STUDENT_DOUBT_SESSION";
		meetingSlotDTO['meetingId'] = $("#" + formId + " #meetingId").val().trim();
		meetingSlotDTO['meetingUrl'] = $("#" + formId + " #meetingUrl").val().trim();
		meetingSlotDTO['urlRemarks'] = escapeCharacters($("#" + formId + " #remarks").val().trim());
		meetingSlotDTO['userType'] = moduleId;
		meetingSlotDTOList.push(meetingSlotDTO);
	} else if (controllType == 'SENDMAIL') {
		meetingSlotDTO = {};
		meetingSlotDTO['controllType'] = controllType;
		meetingSlotDTO['meetingType'] = "STUDENT_DOUBT_SESSION";
		meetingSlotDTO['meetingId'] = $("#" + formId + " #meetingId").val().trim();
		meetingSlotDTO['userType'] = moduleId;
		meetingSlotDTOList.push(meetingSlotDTO);
	} else if (controllType == 'PUBLISH_RECORD') {
		meetingSlotDTO = {};
		meetingSlotDTO['controllType'] = controllType;
		meetingSlotDTO['meetingType'] = "STUDENT_DOUBT_SESSION";
		meetingSlotDTO['meetingId'] = $("#" + formId + " #meetingId").val().trim();
		meetingSlotDTO['meetingStrId'] = $("#" + formId + " #meetingStrId").val().trim();
		meetingSlotDTO['userType'] = moduleId;
		meetingSlotDTOList.push(meetingSlotDTO);
	} else if (controllType == 'REVOKE') {
		meetingSlotDTO = {};
		meetingSlotDTO['controllType'] = controllType;
		meetingSlotDTO['meetingType'] = "STUDENT_DOUBT_SESSION";
		meetingSlotDTO['meetingId'] = $("#" + formId + " #meetingId").val().trim();
		meetingSlotDTO['meetingStrId'] = $("#" + formId + " #meetingStrId").val().trim();
		meetingSlotDTO['userType'] = moduleId;
		meetingSlotDTOList.push(meetingSlotDTO);
	} else if (controllType == 'RESET') {
		meetingSlotDTO = {};
		meetingSlotDTO['controllType'] = controllType;
		meetingSlotDTO['meetingType'] = "STUDENT_DOUBT_SESSION";
		meetingSlotDTO['meetingId'] = formId;
		meetingSlotDTO['userType'] = moduleId;
		meetingSlotDTOList.push(meetingSlotDTO);
	}

	dashboardCommonDTO['meetingSlotDTO'] = meetingSlotDTOList;
	request['dashboardCommonDTO'] = dashboardCommonDTO;
	authentication['hash'] = getHash(); authentication['schoolId'] = SCHOOL_ID; authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = moduleId;
	authentication['userId'] = USER_ID;
	request['authentication'] = authentication;
	return request;
}

function meetingResultModal(meetingId, userId, meetingresult, meetingCurStatus, role) {
	$('#updateMeetingResultModal').modal('show');
	$('#updateMeetingResultForm #userId').val(userId);
	$('#updateMeetingResultForm #meetingId').val(meetingId);
	$('#updateMeetingResultForm #meetingCurStatus').val(meetingCurStatus);

	html = '<option value="N/A" selected>Select Status</option>';
	if (meetingCurStatus == 'N') {
		html += '<option value="Reschedule Session">Reschedule Class</option>';
	} else {
		html += '<option value="Reschedule Session">Reschedule Class</option>';
		html += '<option value="Missed by Student">Missed by Student</option>';
		if ('TEACHER' == role) {
		} else {
			html += '<option value="Missed by Teacher">Missed by Teacher</option>';
		}
		html += '<option value="Completed">Completed</option>'
	}
	$('#updateMeetingResultForm #meetingResult').html(html);
	//	$('#updateMeetingResultForm #meetingResult option:selected').val(meetingresult);
	if (meetingresult == '') {
		if ($('#updateMeetingResultForm #meetingResult option:selected').val().trim() == '') {
		} else {
			$('#updateMeetingResultForm #meetingResult').val($('#updateMeetingResultForm #meetingResult option:selected').text());
		}
	} else {
		$('#updateMeetingResultForm #meetingResult').val(meetingresult);
	}
}

function meetingUrlModalTeacher(meetingId, userId, meetingUrl, mailSendStatus, urlRemarks) {
	if (meetingUrl == 'N/A') {
		meetingUrl = ''
	}
	if (mailSendStatus == 'N/A') {
		mailSendStatus = 'N'
	}
	if (urlRemarks == 'N/A') {
		urlRemarks = ''
	}
	$('#meetingUrlForm #meetingUrl').attr('disabled', false);
	$('#meetingUrlForm #remarks').attr('disabled', false);
	$('#meetingUrlForm #saveMeetingUrl').show();
	$('#meetingUrlForm #note').show();

	$('#meetingUrlModal').modal('show');
	$('#meetingUrlForm #meetingId').val(meetingId);
	$('#meetingUrlForm #userId').val(userId);
	$('#meetingUrlForm #meetingUrl').val(meetingUrl);
	$('#meetingUrlForm #mailSendStatus').val(mailSendStatus);
	$('#meetingUrlForm #remarks').val(urlRemarks);
	if (mailSendStatus == 'Y' || meetingUrl != '') {
		$('#meetingUrlForm #meetingUrl').attr('disabled', true);
		$('#meetingUrlForm #remarks').attr('disabled', true);
		$('#meetingUrlForm #saveMeetingUrl').hide();
		$('#meetingUrlForm #note').hide();
	}
}


function submitRequestDemoMeetingSlots(formId, moduleId, controllType, meetingId, requestType, roleModuleId, userId) {
	hideMessage('');
	console.log("submitRequestDemoMeetingSlots ", requestType);
	if (!validateRequestDemoMeetingSlots(formId, moduleId, controllType, requestType)) {
		return false;
	}
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLFor('dashboard', 'meetingslots-submit'),
		data: JSON.stringify(getRequestForSubmitRequestDemoMeetingSlots(formId, moduleId, controllType, meetingId, requestType, userId)),
		dataType: 'json',
		cache: false,
		timeout: 600000,
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if (data['status'] == '3') {
					redirectLoginPage();
				} else {
					if (tt == 'theme1') {
						showMessage(false, data['message']);
					} else {
						showMessageTheme2(0, data['message'], '', true);
					}
				}
			} else {
				if (requestType == 'COUNSELORMEET') {
					if ("ADD" == controllType) {
						showMessage(false, data['message']);
						$('#meetingSlotsModal').modal('toggle');
						$('#' + formId)[0].reset();
						setTimeout(function () { callDashboardPageSchool(roleModuleId, 'counselor-meet-slot', '', '?moduleId=' + roleModuleId + '&requestType=' + requestType); }, 1000);
					} else if ("EDIT" == controllType) {
						showMessage(false, data['message']);
						$('#' + formId)[0].reset();
						setTimeout(function () { callDashboardPageSchool(roleModuleId, 'counselor-meet-slot', '', '?moduleId=' + roleModuleId + '&requestType=' + requestType); }, 1000);
					}
				} else if (requestType == 'REQUESTDEMO') {
					if ("ADD" == controllType) {
						showMessage(false, data['message']);
						$('#meetingSlotsModal').modal('toggle');
						$('#' + formId)[0].reset();
						setTimeout(function () { callDashboardPageSchool(roleModuleId, 'student-meet-slot', '', '?moduleId=' + roleModuleId + '&requestType=' + requestType); }, 1000);
					} else if ("EDIT" == controllType) {
						showMessage(false, data['message']);
						$('#' + formId)[0].reset();
						setTimeout(function () { callDashboardPageSchool(roleModuleId, 'student-meet-slot', '', '?moduleId=' + roleModuleId + '&requestType=' + requestType); }, 1000);
					}
				} else if (requestType == 'CONNECTMEET') {
					if ("ADD" == controllType) {
						showMessage(false, data['message']);
						$('#meetingSlotsModal').modal('toggle');
						$('#' + formId)[0].reset();
						setTimeout(function () { callDashboardPageSchool(roleModuleId, 'Connect-to-impact-slot', '', '?moduleId=' + roleModuleId + '&requestType=' + requestType); }, 1000);
					} else if ("EDIT" == controllType) {
						showMessage(false, data['message']);
						$('#' + formId)[0].reset();
						setTimeout(function () { callDashboardPageSchool(roleModuleId, 'Connect-to-impact-slot', '', '?moduleId=' + roleModuleId + '&requestType=' + requestType); }, 1000);
					}
				} else {
					if ("EDIT" == controllType) {
						if (tt == 'theme1') {
							showMessage(false, data['message']);
						} else {
							showMessageTheme2(0, data['message'], '', true);
						}
						// if($('#'+formId).length>0){
						// 	$('#'+formId)[0].reset();
						// }
						$('#classrommTr' + meetingId).remove();
						//setTimeout(function(){ callDashboardPageSchool(roleModuleId, 'create-manage-sessions','',''); }, 1000);
					}
				}
			}
			return false;
		},
		error: function (e) {
			showMessage(true, e.responseText);
			return false;
		}
	});
}

function getRequestForSubmitRequestDemoMeetingSlots(formId, moduleId, controllType, meetingId, requestType, userId) {
	var request = {};
	var authentication = {};
	var requestData = {};
	var meetingSlotDTO = {};
	if ("ADD" == controllType) {
		meetingSlotDTO['meetingType'] = requestType;
		var meetDate = $("#" + formId + " #meetingDate").val();
		meetDate = meetDate.split("-");
		meetingDate = meetDate[2] + "-" + meetDate[0] + "-" + meetDate[1];
		meetingSlotDTO['meetingDate'] = meetingDate;
		var startTime = $("#" + formId + " #startTime").val();
		var interval = $("#" + formId + " #timeInterval option:selected").val();
		meetingSlotDTO['startTime'] = startTime;

		var endTime = new Date("2016/09/12 " + startTime + ":00");
		endTime.setMinutes(endTime.getMinutes() + parseInt(interval));
		endTime = endTime.getHours() + ":" + endTime.getMinutes();

		meetingSlotDTO['endTime'] = endTime;
		meetingSlotDTO['subject'] = requestType;
		meetingSlotDTO['status'] = "0";
		meetingSlotDTO['controllType'] = controllType;
	} else if ("EDIT" == controllType) {
		meetingSlotDTO['meetingType'] = requestType;
		meetingSlotDTO['meetingId'] = meetingId;
		meetingSlotDTO['controllType'] = controllType;
	}
	authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = moduleId;
	authentication['userId'] = userId;//$("#teacherMeetingSlotsForm #userId").val();
	request['authentication'] = authentication;
	request['meetingSlotDTO'] = meetingSlotDTO;
	return request;
}

function advanceClassroomSearchReset(formId) {
	$('#' + formId)[0].reset();
}

function showAggrigatorStatusPopup(message, status, aggregatorId, aggrigatorUserId, aggrigatorMeetingVendor, userKey, groupId) {
	$('#aggregatorId').val(aggregatorId);
	$('#aggrigatorUserId').val(aggrigatorUserId);
	$('#aggrigatorMeetingVendor').val(aggrigatorMeetingVendor);
	$('#aggrigatorCurrentStatus').val(status);
	$('#userKey').val(status);
	$('#groupId').val(status);
	if (status == "activate" || status == "active") {
		$('#aggrigatorStatusIcon').html('<i class="fa fa-user-plus text-primary fa-4x"></i>');
		$('#showMessageCreateUser .modal-header').addClass('bg-primary').removeClass('bg-danger, bg-success');
		$("#resetAggregatorWarningNo").text("Create").addClass('btn-primary').removeClass('btn-danger,btn-success');
	} else if (status == "inactive" || status == "unlink") {
		$('#aggrigatorStatusIcon').html('<i class="fa fa-times text-danger fa-4x"></i>');
		$('#showMessageCreateUser .modal-header').addClass('bg-danger').removeClass('bg-success, bg-primary');
		$("#resetAggregatorWarningNo").text("Unlink").addClass('btn-danger').removeClass('btn-success, btn-primary');;
	} else if (status == "create") {
		$('#aggrigatorStatusIcon').html('<i class="fa fa-check text-success fa-4x"></i>');
		$('#showMessageCreateUser .modal-header').addClass('bg-success').removeClass('bg-danger, bg-primary');
		$("#resetAggregatorWarningNo").text("Create").addClass('btn-success').removeClass('btn-danger, btn-primary');
	}
	$('#aggrigatorStatus').html(message);
	$('#aggregatorUserModel').modal('show');
}

function saveUpdateAggregatorUser(callFrom, moduleId) {
	var aggregatorId = $('#aggregatorId').val();
	var aggrigatorUserId = $('#aggrigatorUserId').val();
	var aggrigatorMeetingVendor = $('#aggrigatorMeetingVendor').val();
	var aggrigatorCurrentStatus = $('#aggrigatorCurrentStatus').val();
	var userKey = $('#userKey').val();
	var groupId = $('#groupId').val();
	var data = {};
	data['meetingVendor'] = aggrigatorMeetingVendor;
	data['userId'] = aggrigatorUserId;
	data['UNIQUEUUID'] = UNIQUEUUID;
	if (gotoMeetingId == '' || gotoMeetingId == '0') {
		$.ajax({
			type: "POST",
			contentType: "application/json",
			url: getURLForHTML('gotomeeting', 'createUser'),
			data: JSON.stringify(data),
			dataType: 'json',
			success: function (data) {
				if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
					if (data['status'] == '3') {
						redirectLoginPage();
					} else {
						if (tt == 'theme1') {
							showMessage(false, data['message']);
						} else {
							showMessageTheme2(0, data['message'], '', true);
						}
					}
				} else {
					if ('manageSession' == callFrom) {
						var createGotoUserResponseDTO = data.createGotoUserResponseDTO;
						var zoomCommand = getZoomCommandContent(aggrigatorMeetingVendor, 'A', createGotoUserResponseDTO.id, aggrigatorUserId, createGotoUserResponseDTO.key, createGotoUserResponseDTO.groupId);
						$('#' + aggrigatorMeetingVendor + '_aggrigatorUserId_' + aggrigatorUserId).html(zoomCommand);
					}
					showMessage(true, data['message']);
				}
			}
		});
	} else {
		$.ajax({
			type: "POST",
			contentType : 'application/json',
			url: getURLForHTML('gotomeeting', 'update-goto-meeting-user'),
			data: JSON.stringify({"gotoMeetingUserId" :  aggregatorId}),
			dataType: 'json',
			success: function (data) {
				if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
					if (data['status'] == '3') {
						redirectLoginPage();
					} else {
						if (tt == 'theme1') {
							showMessage(false, data['message']);
						} else {
							showMessageTheme2(0, data['message'], '', true);
						}
					}
				} else {
					if ('manageSession' == callFrom) {
						var gotoMeetingUserDTO = data.gotoMeetingUserDTO;
						var zoomCommand = getZoomCommandContent(gotoMeetingUserDTO.status, aggregatorId, aggrigatorUserId);
						$('#aggrigatorUserId_' + aggrigatorUserId).html(zoomCommand);
					}
					showMessage(true, data['message']);
				}
			}
		});
	}
}
