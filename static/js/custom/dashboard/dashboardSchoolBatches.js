var flag_Change_Batch_Start_And_EndDate=false;
var teacherMappingSetTime = [];

///asfasdfsa
function createBatchByStudent(formId, moduleId, roleModuleId) {
	hideMessage('');
	var callFrom = $('#batchForm #callFrom').val();
	console.log("callFrom : " + callFrom);
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLForHTML('dashboard', 'create-batch-student'),
		data: JSON.stringify(getRequestForCreateBatchByStudent(formId, moduleId)),
		dataType: 'json',
		cache: false,
		timeout: 600000,
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				showMessage(true, data['message']);
				$('#' + formId)[0].reset();
				$('#addBatchModal').modal('hide');
				if (callFrom == 'ManageBatch') {
					setTimeout(function () { callDashboardPageSchool(roleModuleId, 'manage-batch-student'); }, 1000);
				} else if (callFrom == 'ManageUser') {
					setTimeout(function () { advanceStudentSearch('studentFilter', roleModuleId); }, 1000);
				}
			}
			return false;
		},
		error: function (e) {
			//showMessage(true, e.responseText);
			console.log("ERROR : ", e);
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
	hideMessage('');
	if ($('#' + formId + ' #studentEmail').val() == '' || $('#' + formId + ' #studentEmail').val() == undefined) {
		showMessage(true, "Student Email is required to send link");
		return false;
	}
	var emailId = $('#' + formId + ' #studentEmail').val();
	var data = { email: emailId }
	$.ajax({
		type: "POST",
		url: getURLForHTML('dashboard', 'accelerated-mode-signup-student-content'),
		contentType: "application/json",
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
					showMessage(true, stringMessage[1]);
					$('#accModeStudentContentModal').modal('show');
				} else {
					showMessage(true, stringMessage[1]);
					$('#accModeStudentContentModal').modal('hide');
					setTimeout(function () { callDashboardPageSchool(moduleId, 'accelerated-mode'); }, 1000);
				}
				return false;
			}
		},
		error: function (e) {
			//showMessage(true, e.responseText);
			$("#nextStep").prop("disabled", false);
			tabActiveStatus(1);
		}
	});

}

function sendAcceleratedModeSignupLinkContent(accModeId, moduleId) {
	hideMessage('');
	var data = { accModeId: accModeId }
	$.ajax({
		type: "POST",
		contentType: "application/json",
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
					showMessage(true, stringMessage[1]);
				} else {
					showMessage(true, stringMessage[1]);
					setTimeout(function () { callDashboardPageSchool(moduleId, 'accelerated-mode'); }, 1000);
				}
				return false;
			}
		},
		error: function (e) {
			//showMessage(true, e.responseText);
		}
	});
}

function callBatchSubjectAndTeacherMapping(formId, batchId, batchName, standardId, controllType, moduleId) {
	hideMessage('');
	var data = {};
	data['batchId'] = batchId;
	data['standardId'] = standardId;
	data['controllType'] = controllType;
	data['batchName'] = batchName;
	data['moduleId'] = moduleId;
	data['userId'] = USER_ID;
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLForHTML('dashboard', 'batch-subject-and-teacher-mapping'),
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
					$('#batchSubjectTeacherSupportContent').html(htmlContent);
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

function callAssignBatchSubjectTeacherContent(callFor) {
	var batchId = $('#subjectTeacherMappingModalLabel #batchId').html();
	var batchName = $('#subjectTeacherMappingModalLabel #batchName').html();
	var standardId = $('#subjectTeacherMappingModalLabel #standardId').html();
	var moduleId = $('#subjectTeacherMappingModalLabel #moduleId').html();
	var controllType = $('#subjectTeacherMappingModalLabel #controllType').html();
	$('#viewStudentTeacherTab').removeClass('active');
	$('#viewStudentTeacherTab').removeClass('inactive-tab');
	$('#assignStudentTeacherTab').removeClass('active');
	$('#assignStudentTeacherTab').removeClass('inactive-tab');
	$('#viewPastStudentTeacherTab').removeClass('active');
	$('#viewPastStudentTeacherTab').removeClass('inactive-tab');
	if (callFor == 'View') {
		//var controllType="new";
		$('#viewStudentTeacherTab').addClass('active');
		$('#assignStudentTeacherTab').addClass('inactive-tab');
		$('#viewPastStudentTeacherTab').addClass('inactive-tab');
		callForDashboardData('formIdIfAny', 'batch-subject-teacher-linking-content?batchId=' + batchId + "&callFor=" + callFor + "&standardId=" + standardId + "&controllType=" + controllType + "&batchName=" + batchName + "&moduleId=" + moduleId, 'studentTeacherLinkingContent');
	} else if (callFor == 'Assign') {
		//var controllType="new";
		$('#viewStudentTeacherTab').addClass('inactive-tab');
		$('#assignStudentTeacherTab').addClass('active');
		$('#viewPastStudentTeacherTab').addClass('inactive-tab');
		callForDashboardData('formIdIfAny', 'batch-subject-teacher-linking-content?batchId=' + batchId + "&callFor=" + callFor + "&standardId=" + standardId + "&controllType=" + controllType + "&batchName=" + batchName + "&moduleId=" + moduleId, 'studentTeacherLinkingContent');
	} else if (callFor == 'view-assignPastStudentTeacher') {
		//var controllType="old";
		$('#viewStudentTeacherTab').addClass('inactive-tab');
		$('#assignStudentTeacherTab').addClass('inactive-tab');
		$('#viewPastStudentTeacherTab').addClass('active');
		callForDashboardData('formIdIfAny', 'student-teacher-linking-content?studentId=' + studentId + "&callFor=" + callFor + "&standardId=" + standardId + "&controllType=" + controllType, 'studentTeacherLinkingContent');
	}
}

function submitBatchSubjectTeacherAssign(formId, moduleId) {
	var subjectId = $("#subjectIds option:selected").val();
	var standardId = $("#subjectIds option:selected").attr('data-standardId');
	var batchId = $("#subjectIds option:selected").attr('data-studentId');
	var oldTeacherId = $("#subjectIds  option:selected").attr('data-assignId');
	var courseType = $("#subjectIds option:selected").attr('data-courseType');
	var subjectPId = $("#subjectIds option:selected").attr('data-subjectPId');

	hideMessage('');
	if (subjectId == 'Select Subject') {
		showMessage(true, "Please select subject to update.");
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
		contentType: "application/json",
		url: getURLForHTML('dashboard', 'batch-teacher-assign-submit'),
		data: JSON.stringify(getRequestForBatchTeacherAssign(formId, moduleId, subjectId, standardId, batchId, oldTeacherId, courseType, subjectPId)),
		dataType: 'json',
		cache: false,
		timeout: 600000,
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				showMessage(true, "Batch Subject-teacher updated successfully.");
			}
			return false;
		},
		error: function (e) {
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
		showMessage(true, 'Please Select a teacher to update.');
		return false;
	}
	return true;
}

function advanceBatchStudentSearch(formId, moduleId) {
	hideMessage('');
	$.ajax({
		type: "POST",
		contentType: "application/json",
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
						showMessage(true, stringMessage[1]);
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
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLForHTML('dashboard', 'validate-teacher-batch-time-schedule'),
		data: JSON.stringify(getRequestForBatchTeacherTime(batchTeacherMappingId, subjectId, teacherId, elementId, subjectPId, batchId)),
		dataType: 'json',
		cache: false,
		//timeout : 600000,
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
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

		},
		error: function (e) {
			//showMessage(true, e.responseText);
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
	hideMessage('');
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
		contentType: "application/json",
		url: getURLForHTML('dashboard', 'update-teacher-batch-time-schedule'),
		data: JSON.stringify(getRequestForBatchTeacherTime(batchTeacherMappingId, subjectId, teacherId, elementId, subjectPId)),
		dataType: 'json',
		cache: false,
		//timeout : 600000,
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				showMessage(true, "Teacher time updated successfully.");
				$("#booksclassOutsideAvailabilityConfirmationModal").modal("hide");
				$('#batchSubjectTeacherMappingModel').modal('hide');
				setTimeout(function () { callBatchSubjectAndTeacherMapping('formId', batchId, batchName, standardId, 'View', roleModuleId); }, 1000);
				//setTimeout(function(){$('#batchSubjectTeacherMappingModel').modal('hide'); },1000);
				flag_Change_Batch_Start_And_EndDate=true;
			}
			return false;
		},
		error: function (e) {
			//showMessage(true, e.responseText);
		}
	});
}

function validateRequestBatchSubjectTeacherTime(subjectId, elementId) {
	console.log('stdate');
	if ($("#startDate" + elementId).val() == undefined || $("#startDate" + elementId).val() == '') {
		//showMessage(true, 'Please enter start date.');
		showMessage(true, 'Please enter start date.');
		return false;
	}
	if ($("#endDate" + elementId).val() == undefined || $("#endDate" + elementId).val() == '') {
		//showMessage(true, 'Please enter end date.');
		showMessage(true, 'Please enter end date.');
		return false;
	}

	var stDate = $("#startDate" + elementId).val();
	var edDate = $("#endDate" + elementId).val();
	if (new Date(stDate) > new Date(edDate)) {
		showMessage(true, 'End date should be greater than start date.');
		return false;
	}

	var timeDays = [];
	var i = 0;
	$("input:checkbox[name=teachDays" + elementId + "]:checked").each(function () {
		if ($(this).val() == '') {
			showMessage(true, 'Please choose day.');
			i = 1;
		}
		if ($("#timeInterval" + subjectId + "" + $(this).val()).val() == '') {
			//showMessage(true, 'Please choose time schedule.');
			showMessage(true, 'Please choose time schedule.');
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
		showMessage(true, 'Please choose time schedule.');
		return false;
	}
	if (timeDays.length === 0) {
		showMessage(true, 'Please choose time schedule.');
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
	authentication['userId'] = $("#userId").val();
	request['authentication'] = authentication;
	return request;
}

function changeTeacherTime(id, teacherId, elementId) {
	$("#startDate" + elementId).val('');
	$("#endDate" + elementId).val('');
}

function callStudentBatchTransfer(formId, batchId, batchName, standardId, controllType, moduleId, userId) {
	hideMessage('');
	var data = {};
	data['batchId'] = batchId;
	data['standardId'] = standardId;
	data['controllType'] = controllType;
	data['batchName'] = batchName;
	data['moduleId'] = moduleId;
	data['userId'] = USER_ID;
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLForHTML('dashboard', 'move-student-batch'),
		data: JSON.stringify(data),
		dataType: 'html',
		cache: false,
		timeout: 600000,
		success: function (htmlContent) {
			$('#batchSubjectTeacherSupportContent').html('');
			if (htmlContent != "") {
				var stringMessage = [];
				stringMessage = htmlContent.split("|");
				if (stringMessage[0] == "FAILED" || stringMessage[0] == "EXCEPTION" || stringMessage[0] == "SESSIONOUT") {
					showMessage(true, stringMessage[1]);
				} else {
					if (controllType == 'Delete') {
						setTimeout(function () { callDashboardPageSchool(moduleId, 'manage-batch-student'); }, 1000);
						showMessage(true, 'Batch deleted successfully.');
					} else {
						$('#batchSubjectTeacherSupportContent').html(htmlContent);
					}
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

function callBatchExaminationSheetModule(formId, batchId, batchName, standardId, controllType, moduleId, userId) {
	hideMessage('');
	var data = {};
	data['batchId'] = batchId;
	data['standardId'] = standardId;
	data['controllType'] = controllType;
	data['batchName'] = batchName;
	data['moduleId'] = moduleId;
	data['userId'] = USER_ID;
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLForHTML('dashboard', 'batch-exam-sheet'),
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
					$('#batchSubjectTeacherSupportContent').html(htmlContent);
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

function saveBatchExaminationSheet(formId, batchId, roleModuleId) {

	/*var labelName = $("#" + formId + " #labelName").val().trim();
	if (labelName == "" || labelName == undefined) {
		showMessage(true, 'Module Name is Required.');
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
		contentType: "application/json",
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
		},
		error: function (e) {
			//showMessage(true, e.responseText);
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
		contentType: "application/json",
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
		},
		error: function (e) {
			//showMessage(true, e.responseText);
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
			showMessage(true, "Please select batch to move student.");
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
		showMessage(true, "Please select atleast one student");
		return;
	} else {
		$("#selectStudentIds").val(studentIds.substring(0, studentIds.length - 1));
		console.log("student Ids are ", studentIds);
	}

	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLForHTML('dashboard', 'move-batch-student'),
		data: JSON.stringify(getRequestForMoveBatchByStudent(formId, moduleId, controllType)),
		dataType: 'json',
		cache: false,
		timeout: 600000,
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				showMessage(true, data['message']);
				$('#batchStudentTransferModel').modal('hide');
				setTimeout(function () { callDashboardPageSchool(roleModuleId, 'manage-batch-student'); }, 1000);
			}
			return false;
		},
		error: function (e) {
			//showMessage(true, e.responseText);
			console.log("ERROR : ", e);
		}
	});
}


function callTeacherTimeScheduleBatch(batchId, subjectId, teacherId) {
	hideMessage('');
	if(flag_Change_Batch_Start_And_EndDate){
		var newStartDate = new Date($("#endDate" + subjectId).val());
		newStartDate.setDate(newStartDate.getDate() + 1);
		var batchEndDate = $("#batchEndDate").val();
	}else{
		var newStartDate = new Date($("#batchStartDate").val());
		newStartDate.setDate(newStartDate.getDate() + 1);
		var batchEndDate = $("#batchEndDate").val();
	}
	$.ajax({
		type: "POST",
		url: getURLForHTML('dashboard', 'batch-subject-teacher-timeschedule-content'),
		data: "batchId=" + batchId + "&subjectId=" + subjectId + "&teacherId=" + teacherId,
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
					$("#batch-schedule" + subjectId + "").html(htmlContent).promise().done(function () {
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

function teacherTimeCheck(scheduleTime, elementId, dayid, batchId) {
	var result = false;
	hideMessage('');
	$(".subjectTeacherTimeError").text('');
	var teacherId = $("#assignTeacherId" + elementId).val();
	var startDate = $("#startDate" + elementId).val();
	console.log($("#assignTeacherId" + elementId).val());
	checkUpdatesBatch("", elementId)
	$.ajax({
		type: "POST",
		contentType: "application/json",
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
		},
		error: function (e) {
			//showMessage(true, e.responseText);
			console.log("ERROR : ", e);
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
	hideMessage('');
	$.ajax({
		type: "POST",
		contentType: "application/json",
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
		},
		error: function (e) {
			//showMessage(true, e.responseText);
			console.log("ERROR : ", e);
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

function calendarDates(replaceId, startDate, slotType, userId, batchId) {
	var inActDate = $("#inActDate").val();
	var moduleId = $("#roleModuleId").val();
	customLoader(true);
	var data = {};
	data['startDate'] = startDate;
	data['slotType'] = slotType;
	data['disabledDate'] = inActDate;
	data['userId'] = userId;
	data['batchId'] = batchId;
	data['moduleId'] = moduleId;
	$.ajax({
		type: "POST",
		url: getURLForHTML('dashboard', 'calendar-dates'),
		data: JSON.stringify(data),
		contentType: "application/json",
		dataType: 'html',
		cache: false,
		// async: false,
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
					customLoader(false);
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

function editBatchDetails(formId, moduleId, roleModuleId) {
	hideMessage('');
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLForHTML('dashboard', 'edit-batch-details'),
		data: JSON.stringify(getRequestForEditBatchDetails(formId, moduleId)),
		dataType: 'json',
		cache: false,
		timeout: 600000,
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				$('#' + formId)[0].reset();
				showModalMessage(false, data['message']);
				setTimeout(function () { $('#batchStudentTransferModel').modal('hide'); }, 2500);
				//setTimeout(function(){ callDashboardPageSchool(roleModuleId,'manage-batch-student'); },1000);
			}
			return false;
		},
		error: function (e) {
			//showMessage(true, e.responseText);
			console.log("ERROR : ", e);
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
	hideMessage('');
	if (teacherId == '') {
		return false;
	}
	customLoader(true);
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLForHTML('dashboard', 'remove-teacher-time-table'),
		data: JSON.stringify(getRequestForRemoveTeacherTimeTable(batchId, subjectId, teacherId, startDate, batchEndDate)),
		dataType: 'json',
		cache: false,
		//timeout : 600000,
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				showMessage(true, "Teacher time remove successfully.");
				$('#batchSubjectTeacherMappingModel').modal('hide');
				setTimeout(function () {
					callBatchSubjectAndTeacherMapping('formId', batchId, batchName, standardId, 'View', roleModuleId);
				}, 1000);
				customLoader(false);
				//setTimeout(function(){$('#batchSubjectTeacherMappingModel').modal('hide'); },1000);
			}
			return false;
		},
		error: function (e) {
			//showMessage(true, e.responseText);
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
	hideMessage('');
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
		contentType: "application/json",
		url: getURLForHTML('dashboard', 'create-teacher-class-link'),
		data: JSON.stringify(getRequestForUpdateClassLink(formId, moduleId)),
		dataType: 'json',
		cache: false,
		timeout: 600000,
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				showMessage(true, data['message']);
				$('#batchCreateTime').modal('hide');
				setTimeout(function () { callDashboardPageSchool(roleModuleId, 'batch-schedule', '', userId); }, 1000);
			}
			return false;
		},
		error: function (e) {
			//showMessage(true, e.responseText);
			console.log("ERROR : ", e);
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
	hideMessage('');
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLForHTML('dashboard', 'send-mail-student-move-batch'),
		data: JSON.stringify(getRequestForStudentMoveBatch(formId, moduleId, batchId, studentId, mailType)),
		dataType: 'json',
		cache: false,
		timeout: 600000,
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				showMessage(true, data['message']);
			}
			return false;
		},
		error: function (e) {
			//showMessage(true, e.responseText);
			console.log("ERROR : ", e);
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
	hideMessage('');
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLForHTML('dashboard', 'send-mail-teacher-move-batch'),
		data: JSON.stringify(getRequestForTeacherMoveBatch(formId, moduleId, batchId, teacherId, userId, mailType)),
		dataType: 'json',
		cache: false,
		timeout: 600000,
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				showMessage(true, data['message']);
			}
			return false;
		},
		error: function (e) {
			//showMessage(true, e.responseText);
			console.log("ERROR : ", e);
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
	hideMessage('');
	var data={};
	data['batchId']=batchId;
	data['subjectId']=subjectId;
	data['userId']=USER_ID;
	$.ajax({
		type: "POST",
		contentType:"application/json",
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
					showMessage(true, stringMessage[1]);
				} else {
					showMessage(true, "Batch Subject deleted successfully.");
					$('#batchSubjectTeacherMappingModel').modal('hide');
					setTimeout(function () { callBatchSubjectAndTeacherMapping('formId', batchId, batchName, standardId, 'View', moduleId); }, 1000);
				}
				return false;
			}
		},
		error: function (e) {
			console.log(e)
			return false;
		}
	});
}

function studentRemoveFromBatch(formId, moduleId, batchId, studentId, batchName, standardId) {
	hideMessage('');
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLForHTML('dashboard', 'remove-student-from-batch'),
		data: JSON.stringify(getRequestForStudentRemoveFromBatch(formId, moduleId, batchId, studentId)),
		dataType: 'json',
		cache: false,
		timeout: 600000,
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				showMessage(true, data['message']);
				$('#batchStudentTransferModel').modal('hide');
				setTimeout(function () { callStudentBatchTransfer('formId', batchId, batchName, standardId, 'Edit', moduleId); }, 1000);
			}
			return false;
		},
		error: function (e) {
			//showMessage(true, e.responseText);
			console.log("ERROR : ", e);
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
	$.ajax({
		type: "POST",
		contentType: "application/json",
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
