$(document).ready(function() {
	console.log("signupCommon");
	$("#signupButton").click(function(event) {
		event.preventDefault();
		callForUserSignUp('userSignupForm',moduleId);
	});
	$("#resendEmail").click(function(event) {
		event.preventDefault();
		callForEmailResend($("#userSignupForm #email").val().trim(),moduleId,'false');
	});
	$("#email").blur(function() {
//		event.preventDefault();
		callEmailCheck('userSignupForm',moduleId);
	});
	$("#notVerify").click(function(){
//		event.preventDefault();
		callForEmailResend($("#userSignupForm #email").val().trim(),moduleId,'false');
	});
	$("#referralCode").blur(function() {
		if($("#referralCode").val().trim()!=''){
			callReferralCodeCounselorCheck('userSignupForm',moduleId);
		}
		
	});
	
});

function callForUserSignUp(formId, moduleId) {
	hideMessage('');
	if(!validateRequestForSignup(formId,moduleId)){
		//refreshCaptcha('captchaImage');
		return false;
	}
	var signupMode = $("#"+formId+" #signupMode").val().trim();
	$("#signup").prop("disabled", true);
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForSignup('enrollment/stage-1'),
		data : JSON.stringify(getRequestForSignup(formId, moduleId)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				if(data['statusCode'] == '0001'){
					$('#allReadyEmail #emailNotVerify').hide();
					$('#allReadyEmail #emailVerify').show();
					$('#allReadyEmail').modal('toggle');
				}
				if(signupMode!='SCHOLARSHIP'){
					showMessage(true, data['message']);
				}
				showHideDiv(false,'signupShortForm');
				showHideDiv(true,'accountConfirmation');
				if(data['statusCode']=='0041' || data['statusCode']=='0038'){
					refreshCaptcha('captchaImage');
				}
			} else {
				//showMessage(false, data['message']);
				showHideDiv(true,'signupShortForm');
				showHideDiv(false,'accountConfirmation');
				$('#emailId').html($("#"+formId+" #email").val().trim());
			}
			$("#signup").prop("disabled", false);
			return false;
		},
		error : function(e) {
			$("#signup").prop("disabled", false);
		}
	});
}

function validateRequestForSignup(formId, moduleId){
	
	if (!validateFormAscii(formId)) {
		showMessage(false, 'Please use the English Keyboard while providing information');
		return false
	}
	
	if (!validateEmail($("#"+formId+" #email").val().trim())) {
		$("#"+formId+" #email").css('color', '#a9a9a9');
		if("STUDENT" == moduleId){
			showMessage(false, 'Student email is either empty or invalid');
		}else {
			showMessage(false,'Email is either empty or invalid');
		}
		return false
	}
	if (!validateEmail($("#"+formId+" #confirmEmail").val().trim())) {
		$("#"+formId+" #confirmEmail").css('color', '#a9a9a9');
		if("STUDENT" == moduleId){
			showMessage(false, 'Either confirm student email is empty or invalid');
		}else{
			showMessage(false, 'Either confirm email is empty or invalid');
		}
		return false
	}
	if($("#"+formId+" #email").val().trim()!=$("#"+formId+" #confirmEmail").val().trim()){
		$("#"+formId+" #email").css('color', '#a9a9a9');
		$("#"+formId+" #confirmEmail").css('color', '#a9a9a9');
		if("STUDENT" == moduleId){
			showMessage(false, 'Student email and confirm student email are not same');
		}else{
			showMessage(false, 'Email and confirm email are not same');
		}
		return false
	}
	if (!validPassword($("#"+formId+" #password").val().trim())) {
		$("#"+formId+" #password").css('color', '#a9a9a9');
		showMessage(false, 'Either create your password is empty or invalid');
		return false
	}
	if (!validPassword($("#"+formId+" #confirmPassword").val().trim())) {
		$("#"+formId+" #confirmPassword").css('color', '#a9a9a9');
		showMessage(false, 'Either confirm password is empty or invalid');
		return false
	}
	if($("#"+formId+" #password").val().trim()!=$("#"+formId+" #confirmPassword").val().trim()){
		$("#"+formId+" #password").css('color', '#a9a9a9');
		$("#"+formId+" #confirmPassword").css('color', '#a9a9a9');
		showMessage(false, 'Create your password and Confirm Your Password do not match');
		return false
	}
	var pass=$("#"+formId+" #password").val().trim();
	if (!(pattern.test(pass))) {
		showMessage(false, 'Passwords must match all requirements.');
		return false
	}
	
	if (!validateCaptcha($("#"+formId+" #captcha").val().trim())) {
		$("#"+formId+" #captcha").css('color', '#a9a9a9');
		showMessage(false, 'Either captcha is empty or invalid');
		return false
	}
	
	if($("#"+formId+" #checkTerms").is(':checked')){
		
	}else{
		showMessage(false, 'Please accept terms and conditions');
		return false
	}
	return true;
}

function getRequestForSignup(formId, moduleId){
	var request = {};
	var authentication = {};
	var signupDTO = {};
	var url=window.location.href;
	var isDemoUser=url.split('?isDemoUser')[1];
	signupDTO['location'] = $("#"+formId+" #location").val();
	signupDTO['signupMode'] = $("#"+formId+" #signupMode").val().trim();
	if($("#"+formId+" #courseProviderId").length>0){
		signupDTO['courseProviderId'] = $("#"+formId+" #courseProviderId").val().trim();
	}else{
		signupDTO['courseProviderId'] = 37;
	}
	signupDTO['unregisteredId'] = $("#"+formId+" #unregisteredId").val();
	signupDTO['ras'] = $("#"+formId+" #ras").val();
	signupDTO['email'] = $("#"+formId+" #email").val();
	signupDTO['confirmEmail'] = $("#"+formId+" #confirmEmail").val();
	signupDTO['password'] = encode($("#"+formId+" #password").val());
	signupDTO['confirmPassword'] = encode($("#"+formId+" #confirmPassword").val());
	signupDTO['captcha'] = $("#"+formId+" #captcha").val();
	// signupDTO['referralCode'] = $("#"+formId+" #referralCode").val();
	signupDTO['signupType'] = 'Online';
	signupDTO['userType'] = moduleId;
	signupDTO['schoolId'] = SCHOOL_ID;
	signupDTO['schoolUUID'] = SCHOOL_UUID;
	if(isDemoUser!='' && isDemoUser!=undefined){
		isDemoUser=isDemoUser.split('=')[1];
		signupDTO['isDemoUser'] = isDemoUser;
	}
	authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = moduleId;
	request['authentication'] = authentication;
	request['data'] = signupDTO;
	return request;
}


function callReferralCodeCounselorCheck(formId, moduleId) {
	hideMessage('');
	if ($("#referralCode").val().trim()=='') {
  		showMessage(false, 'Referral Code empty or invalid');
  		return false
  	}
	
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForCommon('verify-referral'),
		data : JSON.stringify(getRequestForReferralCodeCheck(formId,moduleId)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, 'This referral code is not available, please try again.');
			}
			return false;
		},
		error : function(e) {
			//showMessage(true, e.responseText);
			console.log("ERROR : ", e);
		}
	});
}

function getRequestForReferralCodeCheck(formId, moduleId){
	var request = {};
	var authentication = {};
	var requestData = {};
	requestData['requestKey'] = 'REFERRAL-AVAILABLE';
	requestData['requestValue'] = $("#referralCode").val().trim();
	authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = moduleId;
	request['authentication'] = authentication;
	request['requestData'] = requestData;
	return request;
}

function checkRequestIsEligibleForEnrollment(formId, moduleId, signupMode, schoolId, timeZone, countryName, email) {
	hideMessage('');
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForCommon('eligible-for-enrollment'),
		data : JSON.stringify(checkRequestIsEligibleForEnrollmentPayload(formId, moduleId, signupMode, schoolId, timeZone, countryName, email)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				window.location.replace(data['message']);
				showMessage(true, 'The selected learning is not available in your region right now.');
			}else{
				$('#email').attr('disabled',false);
				$('#confirmEmail').attr('disabled',false);
			}
			return false;
		}
	});
}
function checkRequestIsEligibleForEnrollmentPayload(formId, moduleId, signupMode, schoolId, timeZone, countryName, email){
	var request = {};
	var authentication = {};
	var data = {};
	data['requestKey'] = 'ELIGIBLE-FOR-ENROLLMENT';
	data['signupMode'] = signupMode;
	data['schoolId'] = schoolId;
	data['timeZone'] = timeZone;
	data['countryName'] = countryName;
	data['SCHOOL_UUID'] = SCHOOL_UUID;
	data['email'] = email;

	authentication['hash'] = getHash();
	authentication['schoolId'] = SCHOOL_ID;
	authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = moduleId;

	request['authentication'] = authentication;
	request['data'] = data;
	return request;
}