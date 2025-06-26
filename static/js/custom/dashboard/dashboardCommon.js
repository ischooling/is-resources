$(document).ready(function () {
});
function callForDashboardData(formId, actionUrl, replaceDiv) {
	customLoader(true);
	if (!validateRequestForDashboardData(formId)) {
		return false;
	}
	var flag = true;
	if (replaceDiv == 'section-linebox') {
		flag = false;
	}
	$.ajax({
		global: flag,
		type: "POST",
		contentType: "application/json",
		url: getURLForHTML('dashboard', actionUrl.split('?')[0]),
		data: JSON.stringify(parseUrlToJson(actionUrl)),
		dataType: 'html',
		async: true,
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
					customLoader(false);
				} else if (stringMessage[0] == "SUCCESS") {
					closeMenu();
					showMessage(true, stringMessage[1]);
					if (stringMessage[1].indexOf("Counselor") != -1) {
						callDashboardPageSchool('mc30');
					}
					customLoader(false);
				} else {
					closeMenu();
					if (replaceDiv == undefined || replaceDiv == '') {
						$('#dashboardContentInHTML').html(htmlContent);
						if (actionUrl.startsWith('add-to-cart-request-data')) {
							getCartDetails(USER_ID);
						}
					} else {
						if (replaceDiv == 'section-linebox') {
							$('#teacherAgreementModal').modal('show');
							$('#' + replaceDiv).html(htmlContent);
							customLoader(false);
						} else if (replaceDiv == 'subject-plan') {
							$('#bookSessionPaymentModal').modal('show');
							$('#' + replaceDiv).html(htmlContent);
						} else if (replaceDiv == 'changePasswordContent') {
							$('#changePasswordModal').modal({ backdrop: 'static', keyboard: false });
							$('#' + replaceDiv).html(htmlContent);
						} else if (replaceDiv == 'select-parent-student-id') {
							window.location.reload();
						} else {
							setTimeout(function () { $('#' + replaceDiv).html(htmlContent); }, 1000);

						}
					}
					customLoader(false);
				}
				customLoader(false);
				return false;
			}
		},
		error: function (e) {
			//	showMessage(true, e.responseText);
			return false;
		}
	});
}



function callForDashboardDataForPasswordChange(formId, actionUrl, replaceDiv, showChancle) {
	if (!validateRequestForDashboardData(formId)) {
		return false;
	}
	var flag = true;
	if (replaceDiv == 'section-linebox') {
		flag = false;
	}
	$.ajax({
		global: flag,
		type: "POST",
		url: getURLForHTML('dashboard', actionUrl),
		data: "showChancle=" + showChancle,
		dataType: 'html',
		cache: false,
		timeout: 600000,
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
				} else if (stringMessage[0] == "SUCCESS") {
					showMessage(true, stringMessage[1]);
					if (stringMessage[1].indexOf("Counselor") != -1) {
						callDashboardPageSchool('mc30');
					}
				} else {
					if (replaceDiv == undefined || replaceDiv == '') {
						$('#dashboardContentInHTML').html(htmlContent);
						if (actionUrl.startsWith('add-to-cart-request-data')) {
							getCartDetails(USER_ID);
						}
					} else {
						if (replaceDiv == 'section-linebox') {
							$('#teacherAgreementModal').modal('show');
							$('#' + replaceDiv).html(htmlContent);
							customLoader(false);
						} else if (replaceDiv == 'subject-plan') {
							$('#bookSessionPaymentModal').modal('show');
							$('#' + replaceDiv).html(htmlContent);
						} else if (replaceDiv == 'changePasswordContent') {
							$('#changePasswordModal').modal({ backdrop: 'static', keyboard: false });
							$('#' + replaceDiv).html(htmlContent);
						} else if (replaceDiv == 'select-parent-student-id') {
							window.location.reload();
						} else {
							setTimeout(function () { $('#' + replaceDiv).html(htmlContent); }, 1000);

						}
					}
				}
				return false;
			}
		},
		error: function (e) {
			//	showMessage(true, e.responseText);
			return false;
		}
	});
}



function getRequestForStudentCourse(formId) {
	return "";
}

function validateRequestForDashboardData(formId) {
	return true;
}

function callDashboardMenu(pageNo) {
	customLoader(true);
	if (pageNo == '1') {
		callForDashboardData('formIdIfAny', 'profile-view-content/' + SCHOOL_UUID + '?userId=');
	} else if (pageNo == '2') {
		//callForDashboardData('form','school-admin-content-content');
	} else if (pageNo == '3') {
		callForDashboardData('formIdIfAny', 'common/logout');
	} else if (pageNo == '4') {

	} else if (pageNo == '5c') {
		//callForDashboardData('formIdIfAny','teacher-profile-request-content?ids=16&types=0,1');
	} else if (pageNo == '5d') {
		//callForDashboardData('formIdIfAny','teacher-profile-request-content?ids=15&types=0,1');
	} else if (pageNo == '5e') {
		//callForDashboardData('formIdIfAny','teacher-profile-request-content?ids=14,1&types=0,1');
	} else if (pageNo == '6a') {
		//callForDashboardData('formIdIfAny','teacher-profile-request-content?ids=1&types=0,1');
	} else if (pageNo == '6b') {
		//callForDashboardData('formIdIfAny','school-profile-request-content?ids=12&types=0,1');
	} else if (pageNo == '7b') {
	} else if (pageNo == '3') {
	} else if (pageNo == '13') {
		//callForDashboardData('formIdIfAny','inquiry-request-content');
	} else if (pageNo == '14') {
		callForDashboardData('formIdIfAny', 'changed-password-request', 'changePasswordContent');
	} else if (pageNo == '01compose') {
		callForDashboardData('formIdIfAny', 'email-compose-content?emailType=&emailId=0&schoolId=' + SCHOOL_ID);
	} else if (pageNo == '01inbox') {
		callForDashboardData('formIdIfAny', 'email-inbox-content?schoolId=' + SCHOOL_ID);
	} else if (pageNo == '01sent') {
		callForDashboardData('formIdIfAny', 'email-sent-content?schoolId=' + SCHOOL_ID);
	} else if (pageNo == '01draft') {
		callForDashboardData('formIdIfAny', 'email-draft-content?schoolId=' + SCHOOL_ID)
	} else if (pageNo == '01read') {
		callForDashboardData('formIdIfAny', 'email-inbox-read-content?readType=read&schoolId=' + SCHOOL_ID);
	} else if (pageNo == '01unread') {
		callForDashboardData('formIdIfAny', 'email-inbox-read-content?readType=unread&schoolId=' + SCHOOL_ID);
	}
}
function callCommonDashboardPage(pageNo) {
	if (pageNo == '1') {
		callForDashboardData('formIdIfAny', 'edit-profile-content?userId=');
	} else if (pageNo == '2') {
		//callForDashboardData('form','school-admin-content-content');
	}
}

function callCommonDashboardPageForPasswordChange(pageNo, show) {
	if (show == 'No') {
		callForDashboardDataForPasswordChange('formIdIfAny', 'changed-password-request', 'changePasswordContent', 'No');
	} else {
		callForDashboardDataForPasswordChange('formIdIfAny', 'changed-password-request', 'changePasswordContent', 'Yes');
	}
}

function callInneraction(actionType, arg0) {
	customLoader(true);
	if (actionType == '1ta') {
		callForDashboardData('formIdIfAny', 'teacher-action?actionType=approve&ids=' + arg0);
	} else if (actionType == '1td') {
		callForDashboardData('formIdIfAny', 'teacher-action?actionType=decline&ids=' + arg0);
	} else if (actionType == '3a') {
		callForDashboardData('formIdIfAny', 'view-task-content?taskname=class_work&subjectid=' + arg0);
	} else if (actionType == '3b') {
		callForDashboardData('formIdIfAny', 'view-task-content?taskname=home_work&subjectid=' + arg0);
	} else if (actionType == 'inbox') {
		callForDashboardData('formIdIfAny', 'email-detail-content?emailType=' + actionType + '&emailId=' + arg0 + '&schoolId=' + SCHOOL_ID);
	} else if (actionType == 'sent') {
		callForDashboardData('formIdIfAny', 'email-detail-content?emailType=' + actionType + '&emailId=' + arg0 + '&schoolId=' + SCHOOL_ID);
	} else if (actionType == 'reply') {
		callForDashboardData('formIdIfAny', 'email-compose-content?emailType=' + actionType + '&emailId=' + arg0 + '&schoolId=' + SCHOOL_ID);
	} else if (actionType == 'forward') {
		callForDashboardData('formIdIfAny', 'email-compose-content?emailType=' + actionType + '&emailId=' + arg0 + '&schoolId=' + SCHOOL_ID);
	} else if (actionType == 'draft') {
		callForDashboardData('formIdIfAny', 'email-compose-content?emailType=' + actionType + '&emailId=' + arg0 + '&schoolId=' + SCHOOL_ID);
	} else if (actionType == 'attendance') {
		callForDashboardData('formIdIfAny', 'attendance-content' + arg0);
	} else if (actionType == '1a') {// It has been written in dashboardSchool.js
		callForDashboardData('formIdIfAny', 'profile-view-content?userId=' + arg0 + '&actionType=' + actionType);
		// getAsPost('/dashboard/profile-view-content?userId=' + arg0 + '&actionType=' + actionType);
	} else if (actionType == '1StudentAdmin') {
		callForDashboardData('formIdIfAny', 'student-profile-view-content?userId=' + arg0);
		//	}else if(actionType=='1ParentStudentAdmin'){
		//		callForDashboardData('formIdIfAny','profile-view-content/'+SCHOOL_UUID+'?userId='+arg0+'&actionType='+actionType);
		//	}else if(actionType=='1ParentStudentAdmin'){														// no Use of that controller now
		//		callForDashboardData('formIdIfAny','parent-student-profile-view-content?userId='+arg0);			//	view by common student profile
	} else if (actionType == '1StudentLogin') {
		callForDashboardData('formIdIfAny', 'login-student-profile-view-content?userId=' + arg0);
	} else if (actionType == '1teacherAdmin') {
		callForDashboardData('formIdIfAny', 'teacher-profile-view-content?userId=' + arg0);
	} else if (actionType == '1ApproveTeacherAdmin') {
		callForDashboardData('formIdIfAny', 'approve-teacher-profile-view-content?userId=' + arg0);
	} else if (actionType == '1RejectTeacherAdmin') {
		callForDashboardData('formIdIfAny', 'reject-teacher-profile-view-content?userId=' + arg0);
	} else if (actionType == '1b') {
		callForDashboardData('formIdIfAny', 'edit-profile-content?userId=' + arg0);
	} else if (actionType == 'schoolProfileView') {
		callForDashboardData('formIdIfAny', 'new-school-profile-view-content?userId=' + arg0);
	} else if (actionType == 'rejectSchoolProfileView') {
		callForDashboardData('formIdIfAny', 'reject-school-profile-view-content?userId=' + arg0);
	}
}

function validateChangePassword(formId) {

	if ($('#' + formId + ' #oldpassword').val().trim() == undefined || $('#' + formId + ' #oldpassword').val().trim() == '') {
		showModalMessage(false, " Old password is required.", '', false);
		return false;
	}
	if ($('#' + formId + ' #newpassword').val().trim() == undefined || $('#' + formId + ' #newpassword').val().trim() == '') {
		showModalMessage(false, " New password is required.", '', false);
		return false;
	}
	if ($('#' + formId + ' #confirmpassword').val().trim() == undefined || $('#' + formId + ' #confirmpassword').val().trim() == '') {
		showModalMessage(false, " Confirm new password is required.", '', false);
		return false;
	}
	if ($('#' + formId + ' #newpassword').val().trim() != $('#' + formId + ' #confirmpassword').val().trim()) {
		showModalMessage(false, " New password and confirm password mismatch.", '', false);
		return false;
	}
	if (!pattern.test($('#' + formId + ' #newpassword').val())) {
		showModalMessage(false, " New password must match all requirements", '', false);
		return false;
	}
	if (!pattern.test($('#' + formId + ' #confirmpassword').val().trim())) {
		showModalMessage(false, " Confirm password must match all requirements", '', false);
		return false;
	}
	return true;
}

function changePassword(dashboardFor) {
	$(".disabledFields").each(function () {
		$(this).removeAttr('disabled');
	});
	var data = {};
	data['oldpassword'] = encode($('#oldpassword').val());
	data['newpassword'] = encode($('#newpassword').val());
	data['confirmpassword'] = encode($('#confirmpassword').val());
	$(".disabledFields").each(function () {
		$(this).attr('disabled', 'disabled');
	});
	if (!validateChangePassword('passwordForm')) {
		return false;
	}
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLForHTML('dashboard', 'changed-password-content'),
		data: JSON.stringify(data),
		dataType: 'json',
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if (data['status'] == '3') {
					redirectLoginPage();
				} else {
					showModalMessage(false, data['message'], '', true);
				}
			} else {
				$('#changePasswordModal').modal('hide');
				showModalMessage(false, data['message'], '', true);
			}
		}
	});
}

function inquiryReplyData(roleModuleId) {
	if ($("#enquiryForm #emailMsg").val() == '' || $("#enquiryForm #emailMsg").val() == undefined) {
		showMessage(true, 'Please enter description');
		return false;
	}
	//	var data = $('#enquiryForm').serialize();
	var request = { eqid: $('#eqid').val(), toId: $('#toId').val(), emailMsg: escapeCharacters($('#emailMsg').val()) }
	//'eqid=' + $('#eqid').val() + '&toId=' + $('#toId').val() + '&emailMsg=' + escapeCharacters($('#emailMsg').val())
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLForHTML('common', 'inquiry-reply'),
		data: JSON.stringify(request),
		dataType: 'html',
		cache: false,
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
					//showMessage(true, "Password successfully changed");
					//showMessage(true, stringMessage[1]);
					//$('#dashboardContentInHTML').html(htmlContent)
					$('#queriesModel').modal('hide');
					setTimeout(function () { callDashboardPageSchool(roleModuleId, 'inquiries'); }, 1000);
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

function getRequestForUpdateProfileNew(formId, moduleId) {
	var request = {};
	var authentication = {};
	//var requestData = {};
	if (moduleId == 'STUDENT') {
		request['updateProfileStudentDTO'] = updateProfileStudentDTO();
	} else if (moduleId == 'STUDENT_SCHOOL') {
		request['updateProfileStudentDTO'] = updateProfileStudentDTO();
	} else if (moduleId == 'TEACHER') {
		request['updateProfileTeacherDTO'] = updateTeacherProfileDTO();
	} else if (moduleId == 'PARENT') {
		request['updateProfileParentDTO'] = updateProfileParentDTO();
	} else if (moduleId == 'SCHOOL_ADMIN') {
		request['updateProfileSchoolAdminDTO'] = updateProfileSchoolAdminDTO();
	} else if (moduleId == 'AUDITOR') {
		request['updateProfileAuditorDTO'] = getJSONRequest(formId);
	} else if (moduleId == 'COUNSELOR') {
		request['addCounselorListDTO'] = updateCounselorProfile(formId, moduleId);
	} else {
		request['addCounselorListDTO'] = updateCommanProfile(formId, moduleId);
	}
	authentication['hash'] = getHash(); authentication['schoolId'] = SCHOOL_ID; authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = moduleId;
	authentication['userId'] = $("#" + formId + " #userId").val();
	request['authentication'] = authentication;
	//request['requestData'] = requestData;
	return request;
}

function callForUpdateProfile(formId, moduleId, dashboardFor, roleModuleId, schoolId) {
	var userId = $('#' + formId + ' #userId').val();
	if (moduleId == 'STUDENT') {
		if (!$('#checkParentDetails').is(':checked') && $('#checkForParentDetails').val() == 'Y') {
			if (!emailCheck($('#guardianEmail').val(), moduleId)) {
				showMessage(true, "Email already exist");
				return false;
			}
		}
	} else if (moduleId == 'TEACHER') {
		if ($('#' + formId + ' #nationalityId').val() == '' || $('#' + formId + ' #nationalityId').val() == null) {
			showMessage(true, 'Nationality is required');
			return false;
		}
		if ($("#" + formId + " #officialEmailId").val() != "") {
			if (!validateEmail($("#" + formId + " #officialEmailId").val())) {
				showMessage(true, 'Official Email is invalid');
				return false;
			}
		}
		if ($("#" + formId + " #employeeType").val() == "") {
			showMessage(true, 'Please select employee type');
			return false;
		}
		if ($("#" + formId + " #typeOfTeacher").val() == "") {
			showMessage(true, 'Please select type of teacher');
			return false;
		}
		if ($("#" + formId + " #countryZoneId").val() == "") {
			showMessage(true, 'Please select country timezone');
			return false;
		}
		var accountType = $('#' + formId + ' #accountType').val();
		if ($('#' + formId + ' #accountPersonName').val() == ''
			&& $('#' + formId + ' #bankName').val() == ''
			&& $('#' + formId + ' #bankBranchName').val() == ''
			&& $('#' + formId + ' #bankBranchAddress').val() == ''
			&& $('#' + formId + ' #accountNo').val() == ''

		) {

		} else {
			if ($('#' + formId + ' #accountPersonName').val() == '' || $('#' + formId + ' #accountPersonName').val() == undefined) {
				showMessage(true, 'Account Holder Name is required');
				return false;
			}
			if ($('#' + formId + ' #bankName').val() == '' || $('#' + formId + ' #bankName').val() == undefined) {
				showMessage(true, 'Bank Name is required');
				return false;
			}
			if ($('#' + formId + ' #bankBranchName').val() == '' || $('#' + formId + ' #bankBranchName').val() == undefined) {
				showMessage(true, 'Bank Branch Name is required');
				return false;
			}
			if ($('#' + formId + ' #bankBranchAddress').val() == '' || $('#' + formId + ' #bankBranchAddress').val() == undefined) {
				showMessage(true, 'Bank Branch Address is required');
				return false;
			}
			if ($('#' + formId + ' #accountNo').val() == '' || $('#' + formId + ' #accountNo').val() == undefined) {
				showMessage(true, 'Account Number is required');
				return false;
			}
		}
		//if($('#'+formId+ ' #swiftCode').val()!='' && ( $('#'+formId+ ' #swiftCode').val().length<8 || $('#'+formId+ ' #swiftCode').val().length>11)){
		//showMessage(true, 'Swift code should be between 8 to 11 digits');
		//return false;
		//}
		//if($('#'+formId+ ' #routeNo').val()!='' && $('#'+formId+ ' #routeNo').val().length<9){
		//showMessage(true, 'Routing Number should be atleast 9 digit');
		//return false;
		//}
		if (accountType == 'BANK_ACCOUNT') {

		} else {
			if (!validateEmail($("#" + formId + " #payPalEmail").val())) {
				showMessage(true, 'PayPal Emaild ID is invalid');
				return false;
			}
			//			if ($("#"+formId+" #payPalAccountHolderName").val()=="") {
			//				showMessage(true, 'PayPal account holder Name is required');
			//				return false
			//			}
		}
		if (($("#" + formId + " #payPalIsdCode").val() == '' || $("#" + formId + " #payPalIsdCode").val() == null) && $("#" + formId + " #payPalMobile").val() == '') {

		} else {
			if ($("#" + formId + " #payPalIsdCode").val() == '' || $("#" + formId + " #payPalIsdCode").val() == null) {
				showMessage(false, 'Please choose PayPal ISD Code');
				return false
			}
			if ($("#" + formId + " #payPalMobile").val() == "" || ($("#" + formId + " #payPalMobile").val().length < 4 || $("#" + formId + " #payPalMobile").val().length > 15)) {
				showMessage(true, 'PayPal Mobile Number is required');
				return false
			}
		}
	}
	hideMessage('');
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLForHTML('dashboard', 'update-profile-content'),
		data: JSON.stringify(getRequestForUpdateProfileNew(formId, moduleId)),
		dataType: 'html',
		cache: false,
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
						//tabActiveStatus(3);
					}
				} else {
					showMessage(false, 'Profile has been updated successfully');
					if (stringMessage[1] == '2') {
						setTimeout(function () { callDashboardPageSchool(roleModuleId, 'manage-user-list', '', '&schoolId='+schoolId+'&userClickFrom=list&registrationType=ONE_TO_ONE&themeType='); }, 2000);// hard coded roleModuleID for temporary purpose
					} else {
						setTimeout(function () { callSchoolInneraction('1a', userId, '', roleModuleId); }, 1000);
					}
				}
				return false;
			}
			return false;
		},
		error: function (e) {
			//	showMessage(true, e.responseText);
			$("#nextStep").prop("disabled", false);
			tabActiveStatus(3);
		}
	});
}

function updateTeacherProfileDTO() {
	var updateProfileTeacherDTO = {};
	updateProfileTeacherDTO['nationalityId'] = $('#nationalityId').val();

	//updateProfileTeacherDTO['residentialAddress']=$('#residentialAddress').val();
	updateProfileTeacherDTO['altEmailId'] = escapeCharacters($('#altEmailId').val());
	updateProfileTeacherDTO['altPhoneCodeNo'] = $('#altPhoneCodeNo').val();
	updateProfileTeacherDTO['altPhoneNo'] = $('#altPhoneNo').val();
	updateProfileTeacherDTO['graduationSubjects'] = escapeCharacters($('#graduationSubjects').val());
	updateProfileTeacherDTO['postGraduationSubjects'] = escapeCharacters($('#postGraduationSubjects').val());
	updateProfileTeacherDTO['otherProfessionalCourse'] = escapeCharacters($('#otherProfessionalCourse').val());
	updateProfileTeacherDTO['otherSpecialization'] = escapeCharacters($('#otherSpecialization').val());
	updateProfileTeacherDTO['otherSkills'] = escapeCharacters($('#otherSkills').val());
	updateProfileTeacherDTO['anyOtherLanguages'] = escapeCharacters($('#anyOtherLanguages').val());
	updateProfileTeacherDTO['references1'] = escapeCharacters($('#references1').val());
	updateProfileTeacherDTO['references2'] = escapeCharacters($('#references2').val());
	updateProfileTeacherDTO['describeYourself'] = escapeCharacters($('#describeYourself').val());
	updateProfileTeacherDTO['accountPersonName'] = escapeCharacters($('#accountPersonName').val());
	updateProfileTeacherDTO['bankName'] = escapeCharacters($('#bankName').val());
	updateProfileTeacherDTO['bankBranchName'] = escapeCharacters($('#bankBranchName').val());
	updateProfileTeacherDTO['bankBranchAddress'] = escapeCharacters($('#bankBranchAddress').val());
	updateProfileTeacherDTO['accountNo'] = $('#accountNo').val();
	updateProfileTeacherDTO['swiftCode'] = $('#swiftCode').val();
	updateProfileTeacherDTO['routeNo'] = $('#routeNo').val();
	updateProfileTeacherDTO['accountType'] = $('#accountType').val();
	updateProfileTeacherDTO['payPalEmail'] = escapeCharacters($('#payPalEmail').val());
	updateProfileTeacherDTO['payPalIsdCode'] = $('#payPalIsdCode').val();
	updateProfileTeacherDTO['payPalMobile'] = $('#payPalMobile').val();
	updateProfileTeacherDTO['payPalAccountHolderName'] = escapeCharacters($('#payPalAccountHolderName').val());
	updateProfileTeacherDTO['teacherSubjectIds'] = $('#teacherSubjectIds').val();
	updateProfileTeacherDTO['teacherPlacementSubjectIds'] = $('#teacherPlacementSubjectIds').val();
	updateProfileTeacherDTO['officialEmailId'] = escapeCharacters($('#officialEmailId').val());
	updateProfileTeacherDTO['providerId'] = $('#courseProvider').val();
	updateProfileTeacherDTO['employeeType'] = $('#employeeType').val();
	updateProfileTeacherDTO['typeOfTeacher'] = $('#typeOfTeacher').val();
	updateProfileTeacherDTO['timeZoneId'] = $('#countryTimezoneId').val();

	return updateProfileTeacherDTO;

}
function updateProfileSchoolAdminDTO() {
	var updateProfileSchoolAdminDTO = {};

	updateProfileSchoolAdminDTO['roomCount'] = $('#roomCount').val();
	updateProfileSchoolAdminDTO['staffCount'] = $('#staffCount').val();
	updateProfileSchoolAdminDTO['noOfStudentsMiddleSchool'] = $('#noOfStudentsMiddleSchool').val();
	updateProfileSchoolAdminDTO['noOfStudentsHighSchool'] = $('#noOfStudentsHighSchool').val();
	updateProfileSchoolAdminDTO['noOfStudentsPostSecondry'] = $('#noOfStudentsPostSecondry').val();
	updateProfileSchoolAdminDTO['noOfStudentsUnderGraduate'] = $('#noOfStudentsUnderGraduate').val();
	updateProfileSchoolAdminDTO['noOfStudentsPostGraduate'] = $('#noOfStudentsPostGraduate').val();
	updateProfileSchoolAdminDTO['numberOfStudentsVocationalSkillDev'] = $('#numberOfStudentsVocationalSkillDev').val();
	updateProfileSchoolAdminDTO['totalSchoolArea'] = $('#totalSchoolArea').val();
	updateProfileSchoolAdminDTO['washroomCount'] = $('#washroomCount').val();
	updateProfileSchoolAdminDTO['aboutSchool'] = escapeCharacters($('#aboutSchool').val());

	return updateProfileSchoolAdminDTO;

}
function updateProfileStudentDTO() {
	var updateProfileStudentDTO = {};

	updateProfileStudentDTO['altPhoneCode'] = $('#altPhoneCode').val();
	updateProfileStudentDTO['altPhoneNo'] = $('#altPhoneNo').val();
	//updateProfileStudentDTO['address']=escapeCharacters($('#address').val());
	//updateProfileStudentDTO['mail_address']=escapeCharacters($('#mail_address').val());mail_address
	updateProfileStudentDTO['birthPlace'] = escapeCharacters($('#birthPlace').val());
	updateProfileStudentDTO['hobbies'] = escapeCharacters($('#hobbies').val());
	updateProfileStudentDTO['nationality'] = $('#nationality').val();
	updateProfileStudentDTO['bloodGroup'] = $('#bloodGroup').val();
	updateProfileStudentDTO['guardianEmail'] = escapeCharacters($('#guardianEmail').val());
	updateProfileStudentDTO['guardianWorkCodeNo'] = $('#guardianWorkCodeNo').val();
	updateProfileStudentDTO['guardianWorkContactNo'] = $('#guardianWorkContactNo').val();
	updateProfileStudentDTO['timeZoneId'] = $('#countryTimezoneId').val();


	return updateProfileStudentDTO;

}
function updateProfileParentDTO() {
	var updateProfileParentDTO = {};
	if ($('#workStdCode option:selected').val() != "0") {
		updateProfileParentDTO['workStdCode'] = escapeCharacters($('#workStdCode option:selected').text());
	}
	updateProfileParentDTO['workPhoneNo'] = $('#workPhoneNo').val();
	updateProfileParentDTO['occupation'] = escapeCharacters($('#occupation').val());


	return updateProfileParentDTO;

}

function updateCounselorProfile(formId, moduleId) {
	var addCounselorListDTO = {};

	addCounselorListDTO['id'] = $("#" + formId + " #counselerId").val();
	addCounselorListDTO['userId'] = $("#" + formId + " #userId").val();
	addCounselorListDTO['firstName'] = $("#" + formId + " #firstName").val();
	addCounselorListDTO['middleName'] = $("#" + formId + " #middleName").val();
	addCounselorListDTO['lastName'] = $("#" + formId + " #lastName").val();
	addCounselorListDTO['dob'] = $("#" + formId + " #dob").val();
	addCounselorListDTO['gender'] = $("#" + formId + " #gender").val();
	addCounselorListDTO['address'] = escapeCharacters($("#" + formId + " #address").val());
	addCounselorListDTO['countryId'] = $("#" + formId + " #countryId").val();
	addCounselorListDTO['stateId'] = $("#" + formId + " #stateId").val();
	addCounselorListDTO['cityId'] = $("#" + formId + " #cityId").val();
	addCounselorListDTO['pincode'] = $("#" + formId + " #pincode").val();
	addCounselorListDTO['emailId'] = $("#" + formId + " #email").val();
	addCounselorListDTO['altEmailId'] = $("#" + formId + " #altEmailId").val();
	addCounselorListDTO['isdCode'] = $("#" + formId + " #isdCode").val();
	addCounselorListDTO['phoneNo'] = $("#" + formId + " #phoneNo").val();
	addCounselorListDTO['altIsdCode'] = $("#" + formId + " #altIsdCode").val();
	addCounselorListDTO['altPhoneNo'] = $("#" + formId + " #altPhoneNo").val();
	addCounselorListDTO['status'] = 1;
	return addCounselorListDTO;
}

function updateCommanProfile(formId, moduleId) {
	var addCounselorListDTO = {};

	addCounselorListDTO['userId'] = $("#" + formId + " #userId").val();
	addCounselorListDTO['firstName'] = $("#" + formId + " #firstName").val();
	addCounselorListDTO['middleName'] = $("#" + formId + " #middleName").val();
	addCounselorListDTO['lastName'] = $("#" + formId + " #lastName").val();
	addCounselorListDTO['gender'] = $("#" + formId + " #gender").val();
	addCounselorListDTO['countryId'] = $("#" + formId + " #countryId").val();
	addCounselorListDTO['stateId'] = $("#" + formId + " #stateId").val();
	addCounselorListDTO['cityId'] = $("#" + formId + " #cityId").val();
	addCounselorListDTO['emailId'] = $("#" + formId + " #email").val();
	addCounselorListDTO['countryTimezone'] = $("#" + formId + " #countryTimezoneId option:selected").attr('data-timezone');
	addCounselorListDTO['countryTimezoneId'] = $("#" + formId + " #countryTimezoneId").val();
	addCounselorListDTO['status'] = 1;
	return addCounselorListDTO;
}

function callCommonAction(formId, actionUrl, module, actionType, userId, requestExtra, requestExtra1, roleModuleId) {
	console.log('formId=>' + formId + ', actionUrl=>' + actionUrl + ', module=>' + module + ', actionType=>' + actionType + ', userId=>' + userId)
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLFor(module, actionUrl),
		data: JSON.stringify(getRequestForAction(formId, module, actionType, userId, requestExtra, requestExtra1, roleModuleId)),
		dataType: 'json',
		cache: false,
		timeout: 600000,
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				showMessage(false, data['message']);
				if (actionType == 'approve') {
					$('#approvedRequest' + userId).text('Approved');
					//setTimeout(function(){ callDashboardPageSchool(roleModuleId,'teacher-profile'); }, 1000);
				} else if (actionType == 'decline') {
					$('#approvedRequest' + userId).text('Declined');
					//setTimeout(function(){ callDashboardPageSchool(roleModuleId,'teacher-profile'); }, 1000);
				} else if (actionType == 'non-qualified') {
					$('#interviewApprovalModal').modal('hide');
					$('#approvedRequest' + userId).text('Rejected');
					setTimeout(function () { callDashboardPageSchool(roleModuleId, 'pending-interview-remarks'); }, 1000);
				} else if (actionType == 'qualified') {
					$('#approvedRequest' + userId).text('Qualified');
					setTimeout(function () { callDashboardPageSchool(roleModuleId, 'pending-interview-remarks'); }, 1000);
				}else if (actionType == 're-active') {
					$('#profileId_'+userId).remove();
				}
			}
			return false;
		},
		error: function (e) {
			if (actionUrl == 'pending-approve-school-visit') {
				$('#PendingRemarkModal').modal('show');
			}

			//showMessage(true, e.responseText);
		}
	});
}
function getRequestForAction(formId, module, actionType, userId, requestExtra, requestExtra1, roleModuleId) {
	var request = {};
	var authentication = {};
	var requestData = {};
	authentication['hash'] = getHash(); authentication['schoolId'] = SCHOOL_ID; authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = module;
	authentication['userId'] = userId;
	request['authentication'] = authentication;
	request['requestKey'] = actionType;
	request['requestValue'] = actionType;
	request['requestExtra'] = requestExtra;
	request['requestExtra1'] = requestExtra1;
	if (roleModuleId != undefined && roleModuleId != '') {
		request['requestExtra2'] = roleModuleId;
	}
	// requestData
	// request['data'] = requestData;
	return request;
}
function createSchoolEvent() {
	hideMessage('');
	//	if(!validateRequestForSubmitScholarship(formId)){
	//		return false;
	//	}
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLFor('dashboard', 'create-event'),
		data: JSON.stringify(getRequestForCreateEvent()),
		dataType: 'json',
		cache: false,
		timeout: 600000,
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				showMessage(false, data['message']);
				//alert("Event created successfully");
				$('#eventModal').modal('toggle');
				if ($('#dashboardFor').val() == 'TEACHER') {
					setTimeout(function () { callDashboardPageTeacher('5'); }, 1000);
				} else {
					setTimeout(function () { callDashboardPageSchool('4'); }, 1000);
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
function getRequestForCreateEvent() {
	var request = {};
	var authentication = {};
	var requestData = {};
	var createEventDTO = {};
	createEventDTO['eventTitle'] = $("#eventTitle").val();
	createEventDTO['subjectEventId'] = $("#subjectEventId").val();
	if ($("#standardId").val() != 0 && $("#standardId").val() != null) {
		createEventDTO['standardId'] = $("#standardId").val();
	}
	if ($("#placementStandardId").val() != 0 && $("#placementStandardId").val() != null) {
		createEventDTO['standardId'] = $("#placementStandardId").val();
	}
	if ($("#subjectId").val() != 0 && $("#subjectId").val() != null) {
		createEventDTO['subjectId'] = $("#subjectId").val();
	}
	//	if($("#placementSubjectId").val()!=0 && $("#placementSubjectId").val()!=null){
	//		createEventDTO['subjectId'] = $("#placementSubjectId").val();
	//	}

	createEventDTO['startEndDate'] = $("#startEndDate").val();
	requestData['createEventDTO'] = createEventDTO;
	authentication['hash'] = getHash(); authentication['schoolId'] = SCHOOL_ID; authentication['schoolUUID'] = SCHOOL_UUID;
	//authentication['userType'] = moduleId;
	authentication['userId'] = $("#userId").val();
	request['authentication'] = authentication;
	request['requestData'] = requestData;
	return request;
}

function submitSendEmailSubmit(formId, moduleId, mailType) {
	hideMessage('');
	if (!validateRequestForSendEmail(formId, moduleId)) {
		return false;
	}
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLFor('dashboard', 'compose-email-submit'),
		data: JSON.stringify(getRequestForsendEmail(formId, moduleId, mailType)),
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

function getRequestForsendEmail(formId, moduleId, mailType) {
	var request = {};
	var authentication = {};
	var requestData = {};
	var emailListDTO = {};

	var emailId = $("#" + formId + " #draftid").val();
	var toId = $("#" + formId + " #toId").val();
	var subject = $("#" + formId + " #subject").val();

	var fromId = $("#" + formId + " #fromId").val();

	emailListDTO['emailId'] = emailId;
	emailListDTO['label'] = mailType;
	emailListDTO['emailType'] = 'email';
	emailListDTO['toId'] = toId;
	emailListDTO['fromId'] = fromId;
	if (editor1 != undefined) {
		emailListDTO['msg'] = escapeCharacters(editor1.getData());
	}
	emailListDTO['subject'] = subject;
	if (mailType == 'normal') {
		emailListDTO['draftStatus'] = "1";
	} else {
		emailListDTO['draftStatus'] = "0";
	}

	requestData['emailListDTO'] = emailListDTO;
	authentication['hash'] = getHash(); authentication['schoolId'] = SCHOOL_ID; authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = moduleId;
	authentication['userId'] = $("#" + formId + " #userId").val();
	request['authentication'] = authentication;
	request['requestData'] = requestData;
	return request;
}

function validateRequestForSendEmail(formId, moduleId) {
	return true;
}
function callForUserSignUp(formId) {
	hideMessage('');
	if ($('#roleUser').val() == '' || $('#roleUser').val() == 0) {
		showMessage(true, 'Role Type is required.');
		return false;
	}
	if ($('#emailId').val() == '') {
		showMessage(true, 'Email is required.');
		return false;
	}

	if ($('#roleUser').val() == '3') {
		moduleId = 'TEACHER';
	} else {
		moduleId = 'STUDENT';
	}

	$("#signup").prop("disabled", true);
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLForSignup('enrollment/stage-1', moduleId),
		data: JSON.stringify(getRequestForSignup(formId, moduleId)),
		dataType: 'json',
		cache: false,
		timeout: 600000,
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2') {
				if (data['statusCode'] == '0001') {
					$('#allReadyEmail #emailVerify').show();
				}
				showMessage(true, data['message']);
				showHideDiv(false, 'signupShortForm');
				showHideDiv(true, 'accountConfirmation');
			} else {
				//showMessage(false, data['message']);
				showHideDiv(true, 'signupShortForm');
				showHideDiv(false, 'accountConfirmation');
				$('#emailId').html($("#" + formId + " #email").val());
				showMessage(true, data['message']);
			}
			$("#signup").prop("disabled", false);
			return false;
		},
		error: function (e) {
			//showMessage(true, e.responseText);
			console.log("ERROR : ", e);
			$("#signup").prop("disabled", false);
		}
	});
}
function getRequestForSignup(formId, moduleId) {
	var request = {};
	var authentication = {};
	var signupDTO = {};
	signupDTO['email'] = $("#" + formId + " #emailId").val();
	signupDTO['confirmEmail'] = $("#" + formId + " #emailId").val();
	signupDTO['password'] = '1234567';
	signupDTO['confirmPassword'] = '1234567';
	signupDTO['schoolId'] = SCHOOL_ID;
	signupDTO['schoolUUID'] = SCHOOL_UUID;
	if ($("#" + formId + " #captcha").val() != null) {

		signupDTO['captcha'] = $("#" + formId + " #captcha").val();
	}
	signupDTO['signupType'] = 'Offline';
	signupDTO['isAdminCreateUser'] = 'AdminCreateUser';
	signupDTO['userType'] = moduleId;
	authentication['hash'] = getHash();
	authentication['schoolId'] = SCHOOL_ID;
	authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = moduleId;
	request['authentication'] = authentication;
	request['data'] = signupDTO;
	return request;
}

function getTeacherList(formId, moduleId, newteacher) {
	createClassButtonHide();
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLFor('dashboard', 'teacher-mapping-list'),
		data: JSON.stringify(getRequestTeacherForStudent(formId, moduleId)),
		dataType: 'json',
		cache: false,
		timeout: 600000,
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				var result = data.dashboardDTO.studentTeacherMappingDTOList;
				tBodyRow = '<select id="teachername" name="teachername">';
				tBodyRow += '<option value=0>--Select Teacher--</option>';
				$.each(result, function (vKey, vVal) {
					var selt = "";
					var teacherName = vVal.teacherName + '  ' + vVal.subjectName;
					if (teacherName == newteacher) {
						selt = "selected";
					}
					tBodyRow += '<option value=' + vVal.teacherId + ' ' + selt + '>' + teacherName + '</option>';
				});
				tBodyRow += '</select>';
				$(".teacherselect").html(tBodyRow);

			}
			return false;
		},
		error: function (e) {
			//	showMessage(true, e.responseText);
			return false;
		}
	});
}

function getRequestTeacherForStudent(formId, moduleId) {
	var request = {};
	var authentication = {};
	var requestData = {};

	var subject = $("#" + formId + " #subjectid").val();

	var placementSubject = $("#" + formId + " #placementSubjectid").val();

	requestData['requestKey'] = "subject";
	if (subject != '' && subject != 0) {
		requestData['requestValue'] = subject;
	}
	requestData['requestExtra'] = "placementSubject";
	if (placementSubject != '' && placementSubject != 0) {
		requestData['requestExtra1'] = placementSubject;
	}
	authentication['hash'] = getHash(); authentication['schoolId'] = SCHOOL_ID; authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = moduleId;
	authentication['userId'] = $("#" + formId + " #userId").val();
	request['authentication'] = authentication;
	request['requestData'] = requestData;
	return request;
}

function submitStudentTeacherMapp(formId, moduleId) {
	hideMessage('');
	if (!validateRequestStudentTeacherMapp(formId, moduleId)) {
		return false;
	}
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLFor('dashboard', 'student-teacher-mapping-submit'),
		data: JSON.stringify(getRequestForStudentTeacherMapp(formId, moduleId)),
		dataType: 'json',
		cache: false,
		timeout: 600000,
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				showMessage(false, data['message']);
				$('#' + formId)[0].reset();
				setTimeout(function () { callDashboardPageSchool('3'); }, 1000);
			}
			return false;
		},
		error: function (e) {
			//	showMessage(true, e.responseText);
			return false;
		}
	});
}

function getRequestForStudentTeacherMapp(formId, moduleId) {
	var request = {};
	var authentication = {};
	var requestData = {};
	var studentTeacherMappingDTO = {};

	var mapid = $("#" + formId + " #mapid").val();
	var studentid = $("#" + formId + " #studentid").val();
	var subjectid = $("#" + formId + " #subjectid").val();
	var teacherid = $("#" + formId + " #teachername option:selected").val();
	var placementSubjectid = $("#" + formId + " #placementSubjectid").val();

	studentTeacherMappingDTO['mappingId'] = mapid;
	studentTeacherMappingDTO['teacherId'] = teacherid;
	studentTeacherMappingDTO['studentId'] = studentid;
	studentTeacherMappingDTO['subjectId'] = subjectid;
	studentTeacherMappingDTO['placementSubjectId'] = placementSubjectid;


	requestData['studentTeacherMappingDTO'] = studentTeacherMappingDTO;
	authentication['hash'] = getHash(); authentication['schoolId'] = SCHOOL_ID; authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = moduleId;
	authentication['userId'] = $("#" + formId + " #userId").val();
	request['authentication'] = authentication;
	request['requestData'] = requestData;
	return request;
}

function validateRequestStudentTeacherMapp(formId, moduleId) {
	return true;
}

function emailCheckForMail(emailId, moduleId) {
	var result = "";
	hideMessage('');
	if (emailId.indexOf(',') == -1) {
		// will not be triggered because str has _..
		if (!validateEmail(emailId)) {
			showMessage(false, 'Email is either empty or invalid');
			return false
		}
	}

	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLForCommon('is-user-available'),
		data: JSON.stringify(getCallRequestForEmailCheckForMail(emailId, moduleId)),
		dataType: 'json',
		cache: false,
		timeout: 600000,
		async: false,
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2') {
				result = true;
			} else {
				showMessage(true, "Email doesn't exist");
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

function getCallRequestForEmailCheckForMail(emailId, moduleId) {
	var request = {};
	var authentication = {};
	var data = {};
	data['requestKey'] = 'EMAIL-AVAILABLE';
	data['email'] = emailId;
	authentication['hash'] = getHash(); authentication['schoolId'] = SCHOOL_ID; authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = moduleId;
	request['authentication'] = authentication;
	request['data'] = data;
	return request;
}

function callCommonWireTransferPayment(formId, moduleId) {

	if (!validateCharacters($('#wireTransferNumber').val())) {
		showMessage(false, 'Please use the English Keyboard while providing information');
		return false
	}

	hideMessage('');
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLFor('school', 'call-wireTransferPayment'),
		data: JSON.stringify(getRequestForCommonWireTransferPayment(formId, moduleId)),
		dataType: 'json',
		cache: false,
		timeout: 600000,
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				showMessage(true, data['message']);
				//$('#callWireTransferModalInProcess').modal('show');
				$('#callPaymentModal').modal('hide');
				$('#callWireTransferModal').modal('hide');
				location.reload();
			}
			return false;
		},
		error: function (e) {
			//showMessage(true, e.responseText);
		}
	});
}
function getRequestForCommonWireTransferPayment(formId, moduleId) {
	console.log("getRequestForCommonWireTransferPayment");
	var request = {};
	var authentication = {};
	var requestData = {};
	var wireTransferInfoDTO = {};
	wireTransferInfoDTO['userType'] = 'SCHOOL_B2B';
	wireTransferInfoDTO['moduleName'] = 'SCHOOL_B2B';
	wireTransferInfoDTO['referenceNumber'] = escapeCharacters($('#wireTransferNumber').val());
	wireTransferInfoDTO['paymentType'] = $('#paymentType').val();

	if ($('#paymentType').val() == 'SCHOOL-STUDENT-FEE') {
		wireTransferInfoDTO['attachment'] = $('#fileupload3').parent('span').parent('p').parent('div').find('span.fileName').html();
	}
	if ($('#paymentType').val() == 'One_time_Application_Fee') {
		wireTransferInfoDTO['attachment'] = $('#fileupload8').parent('span').parent('p').parent('div').find('span.fileName').html();
	}
	if ($('#paymentType').val() == 'Annual_Dues') {
		wireTransferInfoDTO['attachment'] = $('#fileupload2').parent('span').parent('p').parent('div').find('span.fileName').html();
	}
	if ($('#paymentType').val() == 'One_time_Partnership_Fee') {
		wireTransferInfoDTO['attachment'] = $('#fileupload2').parent('span').parent('p').parent('div').find('span.fileName').html();
	}




	if ($('#totalCount').val() != undefined && $('#totalCount').val() != '') {
		wireTransferInfoDTO['totalCount'] = $('#totalCount').val();
	}
	if ($('#currentGradeId').val() != undefined && $('#currentGradeId').val() != '') {
		wireTransferInfoDTO['gradeId'] = $('#currentGradeId').val();
	}

	if ($('#schoolId').val() != undefined && $('#schoolId').val() != '') {
		wireTransferInfoDTO['schoolId'] = $('#schoolId').val();
	}
	if ($('#totalStudentIds').val() != undefined && $('#totalStudentIds').val() != '') {
		wireTransferInfoDTO['studentId'] = $('#totalStudentIds').val();
	}

	requestData['wireTransferInfoDTO'] = wireTransferInfoDTO;
	authentication['hash'] = getHash(); authentication['schoolId'] = SCHOOL_ID; authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = 'SCHOOL_B2B';
	authentication['userId'] = $('#userId').val();
	request['authentication'] = authentication;
	request['requestData'] = requestData;
	return request;
}

function disabledBankDeatils(flag) {

	$("#accountPersonName").prop("disabled", flag);
	$("#bankName").prop("disabled", flag);
	$("#bankBranchName").prop("disabled", flag);
	$("#bankBranchAddress").prop("disabled", flag);
	$("#accountNo").prop("disabled", flag);
	$("#swiftCode").prop("disabled", flag);
	$("#routeNo").prop("disabled", flag);
}

function changeSchool(schoolId) {
	var data = {};
	data['schoolId'] = schoolId;
	data['userId'] = USER_ID;
	actionUrl = 'select-school'
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLForHTML('dashboard', actionUrl),
		data: JSON.stringify(data),
		dataType: 'html',
		cache: false,
		timeout: 600000,
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
				} else if (stringMessage[0] == "SUCCESS") {
					showMessage(true, stringMessage[1]);
					window.location.reload();
				}
				return false;
			}
		}
	});
}

function callStudentRedirectToDashboard(userId, userPaymentDetailsId, sendMailStatus) {
	var data = {};
	data['userId'] = userId;
	data['userPaymentDetailsId'] = userPaymentDetailsId;
	data['sendMailStatus'] = sendMailStatus;
	$.ajax({
		type: "POST",
		url: getURLForHTML('dashboard', 'send-to-dashboard'),
		contentType: 'application/json',
		data: JSON.stringify(data),
		dataType: 'html',
		cache: false,
		timeout: 600000,
		async: false,
		success: function (htmlContent) {
			if (htmlContent != "") {
				var stringMessage = [];
				stringMessage = htmlContent.split("|");
				if (stringMessage[0] == "FAILED" || stringMessage[0] == "EXCEPTION" || stringMessage[0] == "SESSIONOUT") {
					if (stringMessage[0] == "SESSIONOUT") {
						//redirectLoginPage();
						return false;
					}
				}
				showMessage(true, stringMessage[1]);
				DEFAULT_SEARCH_STATE = true; callDashboardPageSchool('2b', 'studentTab', '', '&schoolId=' + SCHOOL_ID);
				return false;
			}
		},
		error: function (e) {
			showMessage(true, e.responseText);
		}
		//showMessage(true, e.responseText);
	});
}

function callForServerDownMessage(roleModuleId) {
	if ($('#message').val() == null || $('#message').val() == undefined || $('#message').val() == '') {
		showMessage(false, 'Maintenance message is mandatory');
		return false
	}
	$.ajax({
		type: "POST",
		url: getURLForHTML('dashboard', 'maintenance-down-message-activity'),
		contentType: "application/json",
		data: JSON.stringify(getRequestForServerDownMessage()),
		dataType: 'html',
		success: function (htmlContent) {
			if (htmlContent != "") {
				var obj = JSON.parse(htmlContent);
				if (obj.statusResponse.status == "FAILED"
					|| obj.statusResponse.status == "EXCEPTION"
					|| obj.statusResponse.status == "SESSIONOUT") {
					if (obj.statusResponse.status == "SESSIONOUT") {
						redirectLoginPage();
					} else {
						showMessage(true, obj.statusResponse.message);
					}
				} else if (obj.statusResponse.status == "SUCCESS") {
					showMessage(true, obj.statusResponse.message);
					setTimeout(function () { callDashboardPageSchool(roleModuleId, 'maintenance-down-message'); }, 1000);
				}
				return false;
			}
		},
		error: function (e) {
			console.log(true, e.responseText);
		}
	});
}

function getRequestForServerDownMessage() {
	var maintenanceDownTimeRequestDTO = {};
	var maintenanceDownTimeDTO = {};
	if ($('#forAllSchool').val() == 'N') {
		maintenanceDownTimeDTO['schoolId'] = SCHOOL_ID;
	}
	maintenanceDownTimeDTO['message'] = $('#message').val();
	maintenanceDownTimeDTO['userId'] = USER_ID;
	maintenanceDownTimeRequestDTO['maintenanceDownTimeDTO'] = maintenanceDownTimeDTO;
	maintenanceDownTimeRequestDTO['controlType'] = "ADD";
	maintenanceDownTimeRequestDTO['uniqueId'] = UNIQUEUUID;
	return maintenanceDownTimeRequestDTO;
}

function callForServerDownMessageEmail(id, roleModuleId) {
	//	if (!validateRequestForServerDownMessage()) {
	//		return false;
	//	}
	$.ajax({
		type: "POST",
		url: getURLForHTML('dashboard', 'maintenance-down-message-activity'),
		contentType: "application/json",
		data: JSON.stringify(getRequestForServerDownMessageEmail(id)),
		dataType: 'html',
		success: function (htmlContent) {
			if (htmlContent != "") {
				var obj = JSON.parse(htmlContent);
				if (obj.statusResponse.status == "FAILED"
					|| obj.statusResponse.status == "EXCEPTION"
					|| obj.statusResponse.status == "SESSIONOUT") {
					if (obj.statusResponse.status == "SESSIONOUT") {
						redirectLoginPage();
					} else {
						showMessage(true, obj.statusResponse.message);
					}
				} else if (obj.statusResponse.status == "SUCCESS") {
					showMessage(true, obj.statusResponse.message);
					setTimeout(function () { callDashboardPageSchool(roleModuleId, 'maintenance-down-message'); }, 1000);
				}
				return false;
			}
		},
		error: function (e) {
			console.log(true, e.responseText);
		}
	});
}

function getRequestForServerDownMessageEmail(id) {
	var maintenanceDownTimeRequestDTO = {};
	var maintenanceDownTimeDTO = {};
	maintenanceDownTimeDTO['maintenanceId'] = id;
	maintenanceDownTimeRequestDTO['maintenanceDownTimeDTO'] = maintenanceDownTimeDTO;
	maintenanceDownTimeRequestDTO['controlType'] = "EMAIL";
	maintenanceDownTimeRequestDTO['id'] = id;
	return maintenanceDownTimeRequestDTO;
}

function callForServerDownMessageMarquee(id, roleModuleId) {
	//	if (!validateRequestForServerDownMessage()) {
	//		return false;
	//	}
	$.ajax({
		type: "POST",
		url: getURLForHTML('dashboard', 'maintenance-down-message-activity'),
		contentType: "application/json",
		data: JSON.stringify(getRequestForServerDownMessageMarquee(id)),
		dataType: 'html',
		success: function (htmlContent) {
			if (htmlContent != "") {
				var obj = JSON.parse(htmlContent);
				if (obj.statusResponse.status == "FAILED"
					|| obj.statusResponse.status == "EXCEPTION"
					|| obj.statusResponse.status == "SESSIONOUT") {
					if (obj.statusResponse.status == "SESSIONOUT") {
						redirectLoginPage();
					} else {
						showMessage(true, obj.statusResponse.message);
					}
				} else if (obj.statusResponse.status == "SUCCESS") {
					showMessage(true, obj.statusResponse.message);
					setTimeout(function () { callDashboardPageSchool(roleModuleId, 'maintenance-down-message'); }, 1000);
				}
				return false;
			}
		},
		error: function (e) {
			console.log(true, e.responseText);
		}
	});
}

function getRequestForServerDownMessageMarquee(id) {
	var maintenanceDownTimeRequestDTO = {};
	var maintenanceDownTimeDTO = {};
	maintenanceDownTimeDTO['maintenanceId'] = id;
	maintenanceDownTimeRequestDTO['maintenanceDownTimeDTO'] = maintenanceDownTimeDTO;
	maintenanceDownTimeRequestDTO['controlType'] = "MARQUEE";
	maintenanceDownTimeRequestDTO['id'] = id;
	return maintenanceDownTimeRequestDTO;
}

function showAssignedSubjectToTeacher(userId) {
	showAssignedSubjectToTeacherContent(userId, 1, '');
	showAssignedSubjectToTeacherContent(userId, 31, '');
	showAssignedSubjectToTeacherContent(userId, 2, 'Yes');
	showAssignedSubjectToTeacherContent(userId, 2, 'No');
	$('#assignSubjects').modal({
		backdrop: 'static',
		keyboard: false,
	})
	showAssignedSubjectOnProviderId();
}

function showAssignedSubjectOnProviderId() {
	var providerId = $('#courseProvider').val();
	var flaxStatus = $('#flaxStatus').val();
	$('.teacherAddCourseSelectionlist').hide();
	if (providerId == "1") {
		$('#teacherAddCourseSelectionlist1').show();
	} else if (providerId == "31") {
		$('#teacherAddCourseSelectionlist31').show();
	} else if (providerId == "36") {
		$('#teacherAddCourseSelectionlist36').show();
	} else if (providerId == "2" && flaxStatus == 'No') {
		$('#teacherAddCourseSelectionlist2').show();
	} else if (providerId == "2" && flaxStatus == 'Yes') {
		$('#teacherAddCourseSelectionlist3').show();
	}
}

function cancelTotalSubjectSelected() {
	$('#teacherAddCourseSelectionlist').html("");
	$(".subjectIds").each(function () {
		if ($(this).hasClass("greenDiv")) {
			$(this).removeClass("greenDiv");
		}
	});
	$(".placementSubjectIds").each(function () {
		if ($(this).hasClass("greenDiv")) {
			$(this).removeClass("greenDiv");
		}
	});
	if (PRESERVE_CURRENT_SUBJECTS != null) {
		var ids = PRESERVE_CURRENT_SUBJECTS.split(',')
		for (var index = 0; index < ids.length; index++) {
			$('#subjectId-' + ids[index]).addClass('greenDiv');
		}
	}
	if (PRESERVE_CURRENT_PLACEMENT_SUBJECTS != null) {
		var ids = PRESERVE_CURRENT_PLACEMENT_SUBJECTS.split(',')
		for (var index = 0; index < ids.length; index++) {
			$('#subjectPlacementId-' + ids[index]).addClass('greenDiv');
		}
	}
	$('#assignSubjects').modal('hide');
}

function calculateTotalSubjectSelected() {
	var selSubjectd = "";
	var selPlacementSubjectd = "";
	$(".subjectIds").each(function () {
		if ($(this).hasClass("greenDiv")) {
			selSubjectd = selSubjectd + "," + $(this).attr('data-placement');
		}
	});
	$(".placementSubjectIds").each(function () {
		if ($(this).hasClass("greenDiv")) {
			selPlacementSubjectd = selPlacementSubjectd + "," + $(this).attr('data-placement');
		}
	});

	CURRENT_SUBJECTS = selSubjectd.substr(1);
	CURRENT_PLACEMENT_SUBJECTS = selPlacementSubjectd.substr(1);
	if (CURRENT_SUBJECTS == '' && CURRENT_PLACEMENT_SUBJECTS == '') {
		showMessage(true, 'Please select at least one subject to proceed.');
		return false;
	}
	var countSubjects = CURRENT_SUBJECTS.split(',').length;
	var countPlacements = CURRENT_PLACEMENT_SUBJECTS.split(',').length;
	$('#assignSubjects').modal('hide');
	$('#teacherSubjectIds').val(CURRENT_SUBJECTS);
	$('#teacherPlacementSubjectIds').val(CURRENT_PLACEMENT_SUBJECTS);
	PRESERVE_CURRENT_SUBJECTS = CURRENT_SUBJECTS;
	PRESERVE_CURRENT_PLACEMENT_SUBJECTS = CURRENT_PLACEMENT_SUBJECTS;
	console.log('CURRENT_SUBJECTS: ' + CURRENT_SUBJECTS);
	console.log('PRESERVE_CURRENT_SUBJECTS: ' + PRESERVE_CURRENT_SUBJECTS);

	console.log('CURRENT_PLACEMENT_SUBJECTS: ' + CURRENT_PLACEMENT_SUBJECTS);
	console.log('PRESERVE_CURRENT_PLACEMENT_SUBJECTS: ' + PRESERVE_CURRENT_PLACEMENT_SUBJECTS);
	return CURRENT_SUBJECTS + ',' + CURRENT_PLACEMENT_SUBJECTS;
}

function showAssignedSubjectToTeacherContent(userId, providerId, flaxStatus) {
	hideMessage('');
	$.ajax({
		type: "POST",
		url: getURLForHTML('dashboard', 'assigned-subject-to-teacher-content'),
		data: "userId=" + userId + "&providerId=" + providerId + "&flaxStatus=" + flaxStatus,
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
					//				$('.teacherAddCourseSelectionlist').hide();
					if (providerId == 1 && flaxStatus == "") {
						$('#teacherAddCourseSelectionlist1').html(htmlContent);
					} else if (providerId == 31 && flaxStatus == "") {
						$('#teacherAddCourseSelectionlist31').html(htmlContent);
					} else if ((providerId == 36 || providerId == 37 || providerId == 38) && flaxStatus == "") {
						$('#teacherAddCourseSelectionlist36').html(htmlContent);
					} else if (providerId == 2 && flaxStatus == "No") {
						$('#teacherAddCourseSelectionlist2').html(htmlContent);
					} else if (providerId == 2 && flaxStatus == "Yes") {
						$('#teacherAddCourseSelectionlist3').html(htmlContent);
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
function submitForTeacherInterviewSlots(formId, moduleId, controllType, roleModuleId) {
	hideMessage('');
	if ('ADDURL' == controllType) {
		if ($('#interviewLink').val() == '' || $('#interviewLink').val() == undefined) {
			showMessage(true, 'Interview Link is required');
			return false;
		}
	}
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLFor('dashboard', 'meetingslots-submit'),
		data: JSON.stringify(getRequestForsubmitForTeacherInterviewSlots(formId, moduleId, controllType)),
		dataType: 'json',
		cache: false,
		timeout: 600000,
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				showMessage(false, data['message']);
				if (controllType == 'ADDURL') {
					$('#interviewLinkModal').modal('toggle');
					$('#' + formId)[0].reset();
					setTimeout(function () { callDashboardPageSchool(roleModuleId, 'pending-interview-remarks'); }, 1000);
				} else if (controllType == 'SENDMAIL') {
					$('#sendMailInterViewModel').modal('toggle');
					$('#' + formId)[0].reset();
					setTimeout(function () { callDashboardPageSchool(roleModuleId, 'pending-interview-remarks'); }, 1000);
				}
			}
			return false;
		},
		error: function (e) {
			return false;
		}
	});
}

function getRequestForsubmitForTeacherInterviewSlots(formId, moduleId, controllType) {
	var request = {};
	var authentication = {};
	var requestData = {};
	var meetingSlotDTO = {};

	if (controllType == 'ADDURL') {
		meetingSlotDTO['controllType'] = controllType;
		meetingSlotDTO['meetingType'] = "INTERVIEW";
		meetingSlotDTO['meetingId'] = $("#" + formId + " #meetingId").val();
		meetingSlotDTO['meetingUrl'] = $("#" + formId + " #interviewLink").val();
	} else if (controllType == 'SENDMAIL') {
		meetingSlotDTO['controllType'] = controllType;
		meetingSlotDTO['meetingType'] = "INTERVIEW";
		meetingSlotDTO['meetingId'] = $("#" + formId + " #meetingId").val();
	}

	authentication['hash'] = getHash(); authentication['schoolId'] = SCHOOL_ID; authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = moduleId;
	authentication['userId'] = $("#" + formId + " #userId").val();
	request['authentication'] = authentication;
	request['meetingSlotDTO'] = meetingSlotDTO;
	return request;
}


function notificationContentListingWithQueries(elementId, argument) {
	$('#' + elementId).DataTable({
		"processing": true,
		"serverSide": true,
		"searching": true,
		"pagingType": "full",
		"pageLength": 10,
		"ajax": {
			"url": CONTEXT_PATH + UNIQUEUUID + "/" + "dashboard/notifications-1" + argument,
			"data": function (data) {
				//	            	console.log('data '+data)
			}
		},
		"fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
			//$('tr').addClass('success');
		},
		"columns": [
			{ "data": "sno", "name": "sno", "title": "S.No" },
			{ "data": "notificationTitle", "name": "notificationTitle", "title": "Title" },
			{ "data": "notificationDescription", "name": "notificationDescription", "title": "Description" },
			{ "data": "createdAt", "name": "createdAt", "title": "Date" },
			{ "data": "action", "name": "action", "title": "" },
		],
	});
	$('#' + elementId).dataTable().fnSetFilteringEnterPress();
}


function getBookSessionPayment(formId) {
	hideMessage('');
	if ($("#" + formId + " #planId").val() == '') {
		showMessage(true, "Please select a plan");
		alert("Please select a plan");
		return false;
	}
	var data = {};
	data['userId'] = USER_ID;
	data['subjectId'] = $("#" + formId + " #subjectId").val();
	data['amount'] = $("#" + formId + " #amount").val();
	data['planId'] = $("#" + formId + " #planId").val();
	data['planAmount'] = $("#" + formId + " #planAmount").val();
	data['studentSessionId'] = $("#" + formId + " #studentSessionId").val();
	data['subjectBookStatus'] = $("#" + formId + " #subjectBookStatus").val();
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLForHTML('dashboard', 'booksession-plan-content'),
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
						showMessage(true, stringMessage[1]);
					}
				} else {
					$("#bookSessionPaymentModal").modal('hide');
					$("#payTabBookingSessionModal").modal('show');
					$('#bookSessionTermModal').html(htmlContent)
				}
				return false;
			}
		},
		error: function (e) {
			return false;
		}
	});
}

function getAssignedSubjectToTeacher(userId) {
	hideMessage('');
	$('#assignSubjectsTeacher').modal({
		backdrop: 'static',
		keyboard: false,
	});

	$.ajax({
		type: "POST",
		contentType: 'application/json',
		url: getURLForHTML('dashboard', 'subject-list-teacher'),
		data: JSON.stringify(getSearchSubject(userId)),
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
					$("#userId").val(userId);
					$('#teacherAssignedCourse').html(htmlContent);
					getSubjectListToTeacher(userId);
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

function getSubjectListToTeacher(userId) {
	hideMessage('');

	$.ajax({
		type: "POST",
		contentType: 'application/json',
		url: getURLForHTML('dashboard', 'assigned-subject-teacher'),
		data: JSON.stringify(getSearchSubject(userId)),
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
					$("#userId").val(userId);
					$('#teacherAddCourseSelectionlist').html(htmlContent);
					//		    			if($("#standardId").val()>=11 && $("#standardId").val()<=17){
					//		    				getSelectedSubject();
					//		    			}
				}
				return false;
			}
		},
		error: function (e) {
			return false;
		}
	});
}
function getSearchSubject(userId) {
	var subjectDTO = {};
	subjectDTO['subjectName'] = $.trim($('#courseName').val());
	subjectDTO['standardId'] = $('#standardId').val();
	subjectDTO['courseType'] = $('#courseType').val();
	subjectDTO['providerId'] = $('#courseProvider').val();
	subjectDTO['flaxStatus'] = $('#flaxStatus').val();
	subjectDTO['userId'] = userId;

	return subjectDTO;

}

function getSelectedSubject() {
	//$(".selectedSubject").html('');
	var addHtmlBind = true;
	$(".subjectIds").each(function () {
		var subjectId = $(this).attr('id').split("-")[1];

		$(".allSelectedSubject").each(function () {
			var idVal = $(this).attr('data-subjectid');
			if (subjectId == idVal) {
				addHtmlBind = false;
			}
		});
		if (addHtmlBind) {
			if ($("#subjectId-" + subjectId).hasClass("greenDiv")) {
				var strtDate = $("#subjectStartDate-" + subjectId).val().split("-")[2] + '-' + $("#subjectStartDate-" + subjectId).val().split("-")[0] + '-' + $("#subjectStartDate-" + subjectId).val().split("-")[1]
				var htmlVar = "<div class=\"col-md-12 block allSelectedSubject\" id='selectedSubject-" + subjectId + "' data-subjectid=\"" + subjectId + "\">";
				htmlVar = htmlVar + "<input type=\"hidden\" name=\"selectSubjectId\" id=\"selectSubjectId-" + subjectId + "\" value=\"" + subjectId + "\"/>";
				htmlVar = htmlVar + "<div class=\"col-md-6\">" + $("#subjectName-" + subjectId).text() + "</div>";
				htmlVar = htmlVar + "<div class=\"col-md-2\" id=\"selectSubjectDate-" + subjectId + "\">" + strtDate + "</div>";
				htmlVar = htmlVar + "<div class=\"col-md-2\" id=\"selectSubjectDate-" + subjectId + "\">" + strtDate + "</div>";
				htmlVar = htmlVar + "<div class=\"col-md-2\" id=\"selectSubjectEndDate-" + subjectId + "\">2999-12-31</div>";
				htmlVar = htmlVar + "<div class=\"col-md-2 text-center\"><a href=\"javascript:void(0);\" class=\"click-to-catalog\" onclick=\"return removeLi('" + subjectId + "');\" style=\"font-size:14px;color:red;\"><i class=\"fa fa-times\"></i></a></div></div>";
				$(".selectedSubject").append(htmlVar);
			}
		}

	});
}

function callForUpdateCourseFee(roleModuleId, schoolId) {
	var userId = $('#userId').val();
	hideMessage('');
	if (!validateUpdateCourseTeacherDTO()) {
		return false;
	}

	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLForHTML('dashboard', 'update-teacher-course'),
		data: JSON.stringify(getRequestForCourseTeacher()),
		dataType: 'html',
		cache: false,
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
						//tabActiveStatus(3);
					}
				} else {
					showMessage(false, 'Courses Updated');
					$('#assignSubjectsTeacher').modal('hide');
					//callDashboardPageSchool(roleModuleId,'approved-teachers');
					//$('.modal-backdrop').remove();
				}
				return false;
			}
			return false;
		},
		error: function (e) {
			//	showMessage(true, e.responseText);
			$("#nextStep").prop("disabled", false);
			tabActiveStatus(3);
		}
	});
}
function getRequestForCourseTeacher() {
	var request = {};
	var authentication = {};
	var requestData = {};
	request['updateProfileTeacherDTO'] = updateCourseTeacherDTO();
	authentication['hash'] = getHash(); authentication['schoolId'] = SCHOOL_ID; authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = moduleId;
	authentication['userId'] = $("#userId").val();
	request['authentication'] = authentication;
	return request;
}
function updateCourseTeacherDTO() {
	var updateProfileTeacherDTO = {};
	var subjectDTOList = [];
	var selSubjectd = "";
	var selPlacementSubjectd = "";
	$(".allSelectedSubject").each(function () {
		subjectDTO = {};
		var subjectId = $(this).attr('data-subjectid');
		var lmssubjectId = $(this).attr('data-lmssubjectid');
		var selectid = $(this).attr('data-selectid');
		if (selectid == undefined) {
			selectid = 0;
		}
		selSubjectd = selSubjectd + "," + subjectId;

		subjectDTO['subjectId'] = subjectId;
		subjectDTO['lmsSubjectId'] = lmssubjectId;
		subjectDTO['selectId'] = selectid;
		if ($("#selectSubjectDate-" + subjectId).val() == '') {
			showMessage(true, 'Please choose start date of ' + $("#selectSubjectName-" + subjectId).text());
			return false;
		}
		subjectDTO['startDate'] = $(this).find(".selectSubjectDate").val();//$("#selectSubjectDate-"+subjectId).val();
		subjectDTO['endDate'] = $(this).find(".selectSubjectEndDate").val();
		subjectDTO['subjectStatus'] = $(this).find(".subjectStatus").val();
		subjectDTO['statusDate'] = $(this).find(".subjectStatusDateCl").val();
		subjectDTOList.push(subjectDTO);
	});

	CURRENT_SUBJECTS = selSubjectd.substr(1);
	if (CURRENT_SUBJECTS == '') {
		showMessage(true, 'Please select at least one subject to proceed.');
		return false;
	}
	var countSubjects = CURRENT_SUBJECTS.split(',').length;
	$('#teacherSubjectIds').val(CURRENT_SUBJECTS);

	updateProfileTeacherDTO['teacherSubjectIds'] = $('#teacherSubjectIds').val();
	updateProfileTeacherDTO['providerId'] = $('#courseProvider').val();

	updateProfileTeacherDTO['subjectDTO'] = subjectDTOList;
	console.log("updateProfileTeacherDTO=>", JSON.stringify(updateProfileTeacherDTO));
	return updateProfileTeacherDTO;

}

function validateUpdateCourseTeacherDTO() {
	var subjectDTOList = [];
	var selSubjectd = "";
	var selPlacementSubjectd = "";
	$(".allSelectedSubject").each(function () {
		subjectDTO = {};
		var subjectId = $(this).attr('data-subjectid');
		selSubjectd = selSubjectd + "," + subjectId;
		subjectDTO['subjectId'] = subjectId;
		if ($("#selectSubjectDate-" + subjectId).val() == '') {
			showMessage(true, 'Please choose start date of ' + $("#selectSubjectName-" + subjectId).text());
			return false;
		}
		subjectDTO['startDate'] = $("#selectSubjectDate-" + subjectId).val();
		subjectDTOList.push(subjectDTO);
	});

	CURRENT_SUBJECTS = selSubjectd.substr(1);
	if (CURRENT_SUBJECTS == '') {
		showMessage(true, 'Please select at least one subject to proceed.');
		return false;
	}

	return true;
}

function getTeacherSubjectList(userId) {
	hideMessage('');
	$('#teacherAssignSubjectModal').modal({
		backdrop: 'static',
		keyboard: false,
	});
	$.ajax({
		type: "POST",
		url: getURLForHTML('dashboard', 'teacher-subject-list'),
		data: encodeURI("request=" + JSON.stringify(getTeacherSearchSubject(userId))),
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
					$("#userId").val(userId);
					$('#assignSubjectToTeacher').html(htmlContent);
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
function getTeacherSearchSubject(userId) {
	var subjectDTO = {};
	subjectDTO['userId'] = userId;
	return subjectDTO;

}
function showOtherReason(id) {
	if ($("#reasonEnrollEnd" + id).val() == 'Other') {
		$("#otherReason" + id).show();
	} else {
		$("#otherReason" + id).val('');
		$("#otherReason" + id).hide();
	}
}

function changeTeacher(id, teacherId, standardId) {
	//getTeacherCompensationStandard("", "steachAmount"+id, teacherId, standardId);
	//$("#stdEnrollDate"+id).val('');
	var start_Date = new Date();
	$("#steachEnrollStartDate" + id).attr('value', '');
	$("#steachEnrollStartDate" + id).val('');
	$("#steachEnrollStartDate" + id).datepicker("remove");
	$("#steachEnrollStartDate" + id).datepicker({
		autoclose: true,
		format: 'mm-dd-yyyy',
		startDate: startDate,
		"setDate": start_Date,
	});

	$("#steachEnrollEndDate" + id).val('');
	$("#reasonEnrollEnd" + id).val('');
	$("#otherReason" + id).val('');
}

function subjectBasedTeacherList(subjectId) {
	hideMessage('');
	resetDropdown($("#teacherId"), 'Select Teacher');
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLForCommon('masters'),
		//data : JSON.stringify(getRequestForMaster('formId', 'TEACHER-LIST-BY-SUBJECT-ID', subjectId)),
		data: JSON.stringify(getRequestForMaster('formId', 'TEACHER-LIST-FOR-BATCH-BY-SUBJECT_ID', subjectId)),
		dataType: 'json',
		cache: false,
		timeout: 600000,
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				//buildDropdown(data['mastersData']['courseList'], $("#"+formId+" #"+toElementId), 'Select course');
				var result = data['mastersData']['teacherList'];
				var dropdown = $("#teacherId");
				dropdown.html('');
				dropdown.append('<option value="0">Select teacher</option>');
				$.each(result, function (k, v) {
					dropdown.append('<option value="' + v.teacherId + '">' + v.teacherName + '(' + v.emailId + ') </option>');
				});

			}
		},
		error: function (e) {
			//showMessage(true, e.responseText);
			$("#" + formId + " #courseId").prop("disabled", false);
		}
	});
}

function closeMenu() {
	$("#cssmenu > ul  li:not(.has-sub) a").click(function () {
		if ($("html").hasClass("nav-open")) {
			$(".close-layer").trigger("click")
		}
	});
}
function IpAddressFlush(){
	$.ajax({
		type : "GET",
		url : BASE_URL+CONTEXT_PATH+SCHOOL_UUID+'/api/v1/release-user?payload=',
		cache : false,
		timeout : 600000,
		async:false,
		success : function(response) {
			showMessage(true,response.message)
		}
	})
}