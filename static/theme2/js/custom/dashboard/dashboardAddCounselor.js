function callForDashboardAddCounselor(formId, moduleId) {
	hideMessage('');
	if (!validateRequestForAddCounselor(formId, moduleId)) {
		return false;
	}
	$.ajax({
		type: "POST",
		contentType: 'application/json',
		url: getURLForHTML('dashboard', 'save-counseler-content'),
		data: JSON.stringify(getRequestForAddCounselor(formId, moduleId)),
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
					showMessage(true, stringMessage[1]);
					//$('#'+formId)[0].reset();
					$("#counselId").val('');
					$("#firstName").val('');
					$("#middleName").val('');
					$("#lastName").val('');
					$("#dob").val('');
					$("#gender").val(0);
					$("#address").val('');
					$("#countryId").val(0);
					$("#stateId").val(0);
					$("#cityId").val(0);
					$("#pincode").val('');
					$("#email").val('');
					$("#altEmailId").val('');
					$("#isdCode").val('');
					$("#phoneNo").val('');
					$("#altIsdCode").val('');
					$("#altPhoneNo").val('');
				}
				return false;
			}
		},
		error: function (e) {
			showMessage(true, e.responseText);
			$("#saveCounselor").prop("disabled", false);
			return false;
		}
	});

}
function getRequestForAddCounselor(formId, moduleId) {
	var addCounselorListDTO = {};

	addCounselorListDTO['id'] = $("#" + formId + " #counselerId").val();
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
	addCounselorListDTO['status'] = $("#" + formId + " #selectStatus ").val();
	var request = {};
	request['request'] = addCounselorListDTO;
	return request;
}

function validateRequestForAddCounselor(formId, moduleId) {

	if ($("#" + formId + " #firstName").val() == "") {
		showMessage(true, 'First Name is required');
		return false
	}
	if ($("#" + formId + " #lastName").val() == "") {
		showMessage(true, 'Last name is required');
		return false
	}

	if ($("#" + formId + " #gender").val() == "") {
		showMessage(true, 'Gender is required');
		return false
	}
	if ($("#" + formId + " #email").val() == "") {
		showMessage(true, 'Email is either empty or invalid');
		return false
	}

	if ($("#" + formId + " #email").val() != "") {
		if (!validateEmail($("#email").val())) {
			showMessage(true, 'Email is either empty or invalid');
			return false
		}
	}
	if ($("#altEmailId").val() != '') {
		if (!validateEmail($("#altEmailId").val())) {
			showMessage(true, 'Alternate Email is invalid');
			return false
		}
	}

	if ($("#" + formId + " #countryId").val() == "" || $("#" + formId + " #countryId").val() == 0) {
		showMessage(true, 'Country is required');
		return false
	}
	if ($("#" + formId + " #stateId").val() == "" || $("#" + formId + " #stateId").val() == 0) {
		showMessage(true, 'State is required');
		return false
	}
	if ($("#" + formId + " #cityId").val() == "" || $("#" + formId + " #cityId").val() == 0) {
		showMessage(true, 'City is required');
		return false
	}
	if ($("#" + formId + " #isdCode").val() == "" || $("#" + formId + " #isdCode").val() == 0) {
		showMessage(true, 'ISD Code is required');
		return false
	}
	if ($("#" + formId + " #phoneNo").val() == "") {
		showMessage(true, 'Phone No. is required');
		return false
	}
	if ($("#" + formId + " #altPhoneNo").val() != "") {
		if ($("#" + formId + " #altIsdCode").val() == "" || $("#" + formId + " #altIsdCode").val() == 0) {
			showMessage(true, 'Alt ISD Code is required');
			return false
		}
	}
	if ($("#" + formId + " #selectStatus").val() == "") {
		showMessage(true, 'Please select Status');
		return false
	}

	return true;
}

function callEmailCounselorCheck(formId, moduleId, email) {
	hideMessage('');
	if (!validateEmail($("#" + formId + " #" + email).val())) {
		showMessage(true, 'Email is either empty or invalid');
		return false
	}

	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLForCommon('is-user-available'),
		data: JSON.stringify(getRequestForEmailCounselorCheck(formId, moduleId, email)),
		dataType: 'json',
		cache: false,
		timeout: 600000,
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, 'This email is already in use with International Schooling');
			}
			return false;
		},
		error: function (e) {
			//showMessage(true, e.responseText);
			console.log("ERROR : ", e);
		}
	});
}

function getRequestForEmailCounselorCheck(formId, moduleId, email) {
	var request = {};
	var authentication = {};
	var data = {};
	data['requestKey'] = 'EMAIL-AVAILABLE';
	data['email'] = $("#" + formId + " #" + email).val();
	authentication['hash'] = getHash(); authentication['schoolId'] = SCHOOL_ID; authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = moduleId;
	request['authentication'] = authentication;
	request['data'] = data;
	return request;
}

function sendCodeToUser(formId, moduleId, isForSpecificUser, roleModuleId) {
	hideMessage('');
	if (!validateRequestForUserReferral(formId, moduleId)) {
		return false;
	}
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLForHTML('dashboard', 'send-referralcode-to-user'),
		data: JSON.stringify(getRequestForUserReferral(formId, moduleId, isForSpecificUser)),
		dataType: 'json',
		cache: false,
		timeout: 600000,
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				showMessage(true, data['message']);
				$('#sendReferralModal').modal('hide');
				setTimeout(function () {
					callDashboardPageSchool(roleModuleId, 'COUNS1b', '', '?roleModuleId=' + roleModuleId + '&requestFrom=counselor&userId=0');
				}, 1000);
			}
			return false;
		},
		error: function (e) {
			//showMessage(true, e.responseText);
			return false;
		}
	});
}

function validateRequestForUserReferral(formId, moduleId) {
	var intEmailError = 0;
	$("input[name='emailId']").each(function () {
		if (!validateEmail($(this).val())) {
			intEmailError = intEmailError + 1;
		}
	});
	if (intEmailError > 0) {
		showMessage(true, 'Email is either empty or invalid');
		return false;
	}
	return true;
}

function getRequestForUserReferral(formId, moduleId, isForSpecificUser) {
	var request = {};
	var authentication = {};
	var counselorReferralDTO = {};
	var emailStr = "";

	counselorReferralDTO['id'] = $("#" + formId + " #referralSendId").val();
	counselorReferralDTO['counselorId'] = $("#" + formId + " #counselorId").val();
	counselorReferralDTO['referralCode'] = $("#" + formId + " #referralCode").val();
	//counselorReferralDTO['emailId'] = $("#"+formId+" #emailId").val();
	$("input[name='emailId']").each(function () {
		emailStr = emailStr + $(this).val() + ",";
	});
	counselorReferralDTO['emailId'] = emailStr;
	authentication['hash'] = getHash(); authentication['schoolId'] = SCHOOL_ID; authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = moduleId;
	authentication['userId'] = $("#" + formId + " #userId").val();
	request['authentication'] = authentication;
	request['data'] = counselorReferralDTO;

	return request;
}
