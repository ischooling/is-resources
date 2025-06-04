var role;
$(document).ready(function() {
	if(moduleId == "TEACHER"){
		role = "";
	}else if(moduleId == "STUDENT"){
		role = "Student";
	}
	console.log("signupCommon");
	$("#signupButton").click(function(event) {
		event.preventDefault();
		if($("#captcha").val().trim() == ""){
			validEndInvalidField(false, "captcha");
		}
		callForUserSignUp('userSignupForm',moduleId);
	});
	$("#resendEmail").click(function(event) {
		event.preventDefault();
		callForEmailResend($("#userSignupForm #email").val().trim(),moduleId,'false');
	});
	var prevValue='';
	$("#email").blur(function() {
		var currentValue=$(this).val();
		if($(this).val().trim().length > 0){
			if(validateEmail($("#userSignupForm #email").val().trim())){
				if(prevValue != currentValue){
					validEndInvalidField(null, "email");
					callEmailCheck('userSignupForm',moduleId);
					if($("#confirmEmail").val().trim() != '' && $("#email").val().trim() != $("#confirmEmail").val().trim() && $("#email").val().trim().length > 0){
						validEndInvalidField(false, "email");
						if("STUDENT" == moduleId){
							showElementErrorMessage(false, 'email', role+ 'email and confirm '+role+' email are not same');
						}else{
							showElementErrorMessage(false, 'email', 'Email and confirm email are not same');
						}
						
					}else if($("#email").val().trim() == $("#confirmEmail").val().trim() && $("#email").val().trim() != ""){
						validEndInvalidField(true, "email");
						validEndInvalidField(true, "confirmEmail");
						showElementErrorMessage(false, 'confirmEmail', '');
						showElementErrorMessage(false, 'email', '');
					}
					prevValue = currentValue;
				}else{
					if($("#email").val().trim() == $("#confirmEmail").val().trim()){
						validEndInvalidField(true, "email");
						validEndInvalidField(true, "confirmEmail");
						showElementErrorMessage(false, 'confirmEmail', '');
						showElementErrorMessage(false, 'email', '');
					}
				}
			}else{
				validEndInvalidField(false, "email");
				if("STUDENT" == moduleId){
					showElementErrorMessage(false, 'email', role+' email is either empty or invalid.');
				}else{
					showElementErrorMessage(false, 'email', 'Email is either empty or invalid');
				}
			}
		}
	});
	$("#confirmEmail").blur(function() {
		if(validateEmail($("#userSignupForm #confirmEmail").val().trim())){
			if($("#email").val().trim() != '' && $("#email").val().trim() != $("#confirmEmail").val().trim() && $("#confirmEmail").val().trim().length > 0){
				validEndInvalidField(false, "confirmEmail");
				if("STUDENT" == moduleId){
					showElementErrorMessage(false, 'confirmEmail', role+' email and confirm '+role.toLowerCase()+' email are not same');
				}else{
					showElementErrorMessage(false, 'confirmEmail', 'Email and confirm email are not same');
				}
				
			}else if($("#email").val().trim() == $("#confirmEmail").val().trim() && $("#confirmEmail").val().trim() != ""){
				validEndInvalidField(true, "email");
				validEndInvalidField(true, "confirmEmail");
				showElementErrorMessage(false, 'confirmEmail', '');
				showElementErrorMessage(false, 'email', '');
			}else{
				validEndInvalidField(null, "confirmEmail");
				showElementErrorMessage(false, 'confirmEmail', '');
			}
		}else{
			if($("#confirmEmail").val().trim().length > 0){
				validEndInvalidField(false, "confirmEmail");
				if("STUDENT" == moduleId){
					showElementErrorMessage(false, 'confirmEmail', 'Confirm '+role+' email empty or invalid.');
				}else{
					showElementErrorMessage(false, 'confirmEmail', 'Confirm email is either empty or invalid');
				}
				
			}else{
				validEndInvalidField(null, "confirmEmail");
				showElementErrorMessage(false, 'confirmEmail', '');
			}
		}
	});
	// $("#email").blur(function() {
	// 	//event.preventDefault();
	// 	if($(this).val().trim().length > 0){
	// 		if(!validateEmail($("#userSignupForm #email").val().trim())){
	// 			validEndInvalidField(false, "email");
	// 			showElementErrorMessage(false, 'email', role+' email is either empty or invalid');
	// 			if($(this).val().trim() != $("#confirmEmail").val().trim() && $("#confirmEmail").val().trim().length > 0 ){
	// 				validEndInvalidField(false, "confirmEmail");
	// 				showElementErrorMessage(false, 'confirmEmail', role+' email and confirm '+role+' email are not same');
	// 			}
	// 			return false;
	// 		}else{
	// 			validEndInvalidField(true, "email");
	// 			showElementErrorMessage(true, 'email', '');
	// 			callEmailCheck('userSignupForm',moduleId);
	// 			if($(this).val().trim() != $("#confirmEmail").val().trim() && $("#confirmEmail").val().trim().length > 0){
	// 				if(!validateEmail($("#userSignupForm #confirmEmail").val().trim())){
	// 					validEndInvalidField(false, "confirmEmail");
	// 					showElementErrorMessage(false, 'confirmEmail', 'Confirm '+role+' email is either empty or invalid');
	// 				}else{
	// 					validEndInvalidField(false, "confirmEmail");
	// 					showElementErrorMessage(false, 'confirmEmail', role+' email and confirm '+role+' email are not same');
	// 				}
	// 			}else if($("#confirmEmail").val().trim().length == 0){
	// 				validEndInvalidField(null, "confirmEmail");
	// 			}else{
	// 				validEndInvalidField(true, "confirmEmail");
	// 				showElementErrorMessage(false, 'confirmEmail', '');
	// 			}
	// 		}
	// 	}else{
	// 		validEndInvalidField(null, "email");
	// 		validEndInvalidField(null, "confirmEmail");
	// 		showElementErrorMessage(false, 'email', '');
	// 		showElementErrorMessage(false, 'confirmEmail', '');
	// 	}
	// });
	// $("#confirmEmail").blur(function() {
	// 	//event.preventDefault();
	// 	if($(this).val().length > 0){
	// 		if (!validateEmail($("#userSignupForm #confirmEmail").val().trim())) {
	// 			if("STUDENT" == moduleId){
	// 				showElementErrorMessage(false, 'confirmEmail', 'Confirm '+role+' email is either empty or invalid');
	// 			}else{
	// 				showElementErrorMessage(false, 'confirmEmail', 'Confirm email is either empty or invalid');
	// 			}
	// 			validEndInvalidField(false, "confirmEmail");
	// 			return false;
	// 		}else if( $("#confirmEmail").val() != $("#email").val()){
	// 			if("STUDENT" == moduleId){
	// 				showElementErrorMessage(false, 'confirmEmail', role' email and confirm '+role+' email are not same');
	// 			}else{
	// 				showElementErrorMessage(false, 'confirmEmail', 'Email and confirm email are not same');
	// 			}
	// 			validEndInvalidField(false, "confirmEmail");
	// 		}else{
	// 			validEndInvalidField(true, "confirmEmail");
	// 			showElementErrorMessage(true, 'confirmEmail', '');
	// 		}
	// 	}else{
	// 		validEndInvalidField(null, "confirmEmail");
	// 	}
			
	// });
	$("#password").blur(function() {
		if($(this).val().trim().length > 0){
			var pass=$("#userSignupForm #password").val().trim();
			if (!(pattern.test(pass))) {
				showElementErrorMessage(false, 'password', 'Create your own password must match all requirements.');
				if($(this).val().trim() != $("#userSignupForm #confirmPassword").val().trim() && $("#userSignupForm #confirmPassword").val().trim().length > 0){
					showElementErrorMessage(false, 'confirmPassword', 'Create your own password and Confirm y our own Password do not match');
					validEndInvalidField(false, "confirmPassword");
				}else{
					showElementErrorMessage(false, 'password', 'Create your own password must match all requirements.')
					validEndInvalidField(null, "confirmPassword");
				}
				validEndInvalidField(false, "password");
				flag = false
			}else if (!validPassword($("#userSignupForm #password").val().trim())) {
				$("#userSignupForm #password").css('color', '#a9a9a9');
				showElementErrorMessage(false, 'password', 'Password is either empty or invalid');
				validEndInvalidField(false, "password");
				flag = false
			}else{
				validEndInvalidField(true, "password");
				showElementErrorMessage(true, 'password', '');
				if($(this).val().trim() != $("#confirmPassword").val().trim() && $("#confirmPassword").val().trim().length > 0){
					validEndInvalidField(false, "confirmPassword");
					showElementErrorMessage(false, 'confirmPassword', 'Create your own password and Confirm your own Password do not match');
				}else if($("#confirmPassword").val().trim().length == 0){
					validEndInvalidField(null, "confirmPassword");
				}else{
					validEndInvalidField(true, "confirmPassword");
					showElementErrorMessage(false, 'confirmPassword', '');
				}
			}
		}
		else{
			validEndInvalidField(null, "password");
		}
	});
	$("#confirmPassword").blur(function() {
		if($(this).val().length > 0){
			
			var confpass=$("#userSignupForm #confirmPassword").val().trim();
			if (!validPassword($("#userSignupForm #confirmPassword").val().trim())) {
				$("#userSignupForm #confirmPassword").css('color', '#a9a9a9');
				showElementErrorMessage(false, 'confirmPassword', 'Confirm password is either empty or invalid');
				validEndInvalidField(false, "confirmPassword");
				flag = false;
			}else if (!(pattern.test(confpass))) {
				showElementErrorMessage(false, 'confirmPassword', 'Confirm your own Passwords must match all requirements.');
				validEndInvalidField(false, "confirmPassword");
				flag = false
			}else if($("#userSignupForm #password").val().trim()!= $("#userSignupForm #confirmPassword").val().trim()){
				$("#userSignupForm #password").css('color', '#a9a9a9');
				$("#userSignupForm #confirmPassword").css('color', '#a9a9a9');
				showElementErrorMessage(false, 'confirmPassword', 'Create your own password and Confirm your own Password do not match');
				validEndInvalidField(false, "confirmPassword");
				flag = false
			}else{
				validEndInvalidField(true, "confirmPassword");
				showElementErrorMessage(true, 'confirmPassword', '');
			}
		}else{
			validEndInvalidField(null, "confirmPassword");	
		}
	});
	$("#captcha").blur(function() {
		if($(this).val().length > 0){
			// if (!validateCaptcha($("#userSignupForm #captcha").val().trim())) {
			// 	$("#userSignupForm #captcha").css('color', '#a9a9a9');
			// 	showElementErrorMessage(false, 'captcha', 'Captcha is either empty or invalid');
			// 	validEndInvalidField(false, "captcha");
			// 	flag = false
			// }else{
			// 	validEndInvalidField(true, "captcha");
			// 	showElementErrorMessage(true, 'captcha', '');
			// }
			validEndInvalidField(null, "captcha");
			showElementErrorMessage(false, 'captcha','')
		}else{
			//validEndInvalidField(null, "captcha");
		}
	})
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
	$('.error-msg').html('');
	if(!validateRequestForSignup(formId,moduleId)){
		return false;
	}
	var learningProgram = $("#"+formId+" #learningProgram").val().trim();
	$("#signup").prop("disabled", true);
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForSignup('enrollment/stage-1'),
		data : JSON.stringify(getRequestForSignup(formId, moduleId)),
		dataType : 'json',
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				if(learningProgram!='SCHOLARSHIP'){
					showServerMessage(false, data['message']);
				}
				if(data['statusCode'] == '0001'){
					hideStep1Div()
					showWrapper(true)
					$('#emailVerify').show();
				}else if(data['statusCode']=='0041' || data['statusCode']=='0038'){
					refreshCaptcha('captchaImage');
				}else{
					hideStep1Div()
				}
			} else {
				if(data['emailVerified']){
					goAhead(data['redirectUrl'], '');
				}else{
					showWrapper(true)
					$('#emailNotVerify').hide();
					$('#userDeclined').hide();
					$('#emialLimit').hide();
					$('#emailVerify').hide();
					$('#accountConfirmation').show();
					$('#emailId').html($("#"+formId+" #email").val());
				}
			}
			$("#signup").prop("disabled", false);
			return false;
		},
		error : function(e) {
			$("#signup").prop("disabled", false);
		}
	});
}

function hideStep1Div(){
	$('#accountConfirmation').hide();
	$('#emailNotVerify').hide();
	$('#userDeclined').hide();
	$('#emialLimit').hide();
	$('#emailVerify').hide();
}

function validateRequestForSignup(formId, moduleId){
	var flag=true;
	if (!validateFormAscii(formId)) {
		showServerMessage(false, 'Please use the English Keyboard while providing information');
		flag = false
	}
	if (!validateEmail($("#"+formId+" #email").val().trim())) {
		$("#"+formId+" #email").css('color', '#a9a9a9');
		if("STUDENT" == moduleId){
			showElementErrorMessage(false, 'email', 'Email is either empty or invalid');
		}else {
			showElementErrorMessage(false,'email', 'Email is either empty or invalid');
		}
		flag = false
	}
	if (!validateEmail($("#"+formId+" #confirmEmail").val().trim())) {
		$("#"+formId+" #confirmEmail").css('color', '#a9a9a9');
		if("STUDENT" == moduleId){
			showElementErrorMessage(false, 'confirmEmail', 'Confirm email is either empty or invalid');
		}else{
			showElementErrorMessage(false, 'confirmEmail', 'Confirm email is either empty or invalid');
		}
		flag = false
	}else if($("#"+formId+" #email").val().trim()!=$("#"+formId+" #confirmEmail").val().trim()){
		$("#"+formId+" #email").css('color', '#a9a9a9');
		$("#"+formId+" #confirmEmail").css('color', '#a9a9a9');
		if("STUDENT" == moduleId){
			showElementErrorMessage(false, 'confirmEmail', 'Student email and confirm student email are not same');
		}else{
			showElementErrorMessage(false, 'confirmEmail', 'Email and confirm email are not same');
		}
		flag = false
	}
	var pass=$("#"+formId+" #password").val().trim();
	if (!(pattern.test(pass))) {
		showElementErrorMessage(false, 'password', 'Create your own password must match all requirements.');
		flag = false
	}else if (!validPassword($("#"+formId+" #password").val().trim())) {
		$("#"+formId+" #password").css('color', '#a9a9a9');
		showElementErrorMessage(false, 'password', 'Password is either empty or invalid');
		flag = false
	}
	var confpass=$("#"+formId+" #confirmPassword").val().trim();
	
	if (!validPassword($("#"+formId+" #confirmPassword").val().trim())) {
		$("#"+formId+" #confirmPassword").css('color', '#a9a9a9');
		showElementErrorMessage(false, 'confirmPassword', 'Confirm password is either empty or invalid');
		flag = false;
	}else if (!(pattern.test(confpass))) {
		showElementErrorMessage(false, 'confirmPassword', 'Confirm your own Passwords must match all requirements.');
		flag = false
	}else if($("#"+formId+" #password").val().trim()!=$("#"+formId+" #confirmPassword").val().trim()){
		$("#"+formId+" #password").css('color', '#a9a9a9');
		$("#"+formId+" #confirmPassword").css('color', '#a9a9a9');
		showElementErrorMessage(false, 'confirmPassword', 'Create your own password and Confirm your own Password do not match');
		flag = false
	}
	if (!validateCaptcha($("#"+formId+" #captcha").val().trim())) {
		$("#"+formId+" #captcha").css('color', '#a9a9a9');
		showElementErrorMessage(false, 'captcha', 'Captcha is either empty or invalid');
		flag = false
	}
	
	if($("#"+formId+" #checkTerms").is(':checked')){
		showElementErrorMessage(false, 'checkTerms','');
	}else{
		showElementErrorMessage(false, 'checkTerms','Please accept terms and conditions');
		flag = false
	}
	return flag;
}

function getRequestForSignup(formId, moduleId){
	var request = {};
	var authentication = {};
	var signupDTO = {};
	var url=window.location.href;
	var isDemoUser=url.split('?isDemoUser')[1];
	signupDTO['location'] = $("#"+formId+" #location").val();
	signupDTO['learningProgram'] = $("#"+formId+" #learningProgram").val().trim();
	signupDTO['enrollmentFor'] = $("#"+formId+" #enrollmentFor").val().trim();
	signupDTO['unregisteredId'] = $("#"+formId+" #unregisteredId").val();
	signupDTO['ras'] = $("#"+formId+" #ras").val();
	signupDTO['email'] = $("#"+formId+" #email").val();
	signupDTO['confirmEmail'] = $("#"+formId+" #confirmEmail").val();
	signupDTO['password'] = encode($("#"+formId+" #password").val());
	signupDTO['confirmPassword'] = encode($("#"+formId+" #confirmPassword").val());
	signupDTO['captcha'] = $("#"+formId+" #captcha").val();
	signupDTO['referralCode'] = $("#"+formId+" #referralCode").val();
	signupDTO['discount'] = $("#"+formId+" #discount").val();
	signupDTO['signupType'] = 'Online';
	if($("#"+formId+" #learningProgram").val()=='ONE_TO_ONE_FLEX'){
		signupDTO['signupType'] = 'Online-Flex';
	}
	signupDTO['userType'] = moduleId;
	signupDTO['schoolId'] = SCHOOL_ID;
	signupDTO['schoolUUID'] = SCHOOL_UUID;
	if(isDemoUser!='' && isDemoUser!=undefined){
		isDemoUser=isDemoUser.split('=')[1];
		signupDTO['isDemoUser'] = isDemoUser;
	}
	signupDTO['utmSource'] = getCookie('us');
	signupDTO['utmMedium'] = getCookie('um');
	signupDTO['utmDescription'] = getCookie('uc');
	signupDTO['originalUrl'] = getCookie('cu');
	signupDTO['gclid'] = getCookie('gclid');
	signupDTO['utmCampaign'] = getCookie('ucam');
	signupDTO['utmTerm'] = getCookie('ut');

	authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = moduleId;
	request['authentication'] = authentication;
	request['data'] = signupDTO;
	return request;
}


function callReferralCodeCounselorCheck(formId, moduleId) {
	hideMessage('');
	if ($("#referralCode").val().trim()=='') {
  		showServerMessage(false, 'Referral Code empty or invalid');
  		return false
  	}
	
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForCommon('verify-referral'),
		data : JSON.stringify(getRequestForReferralCodeCheck(formId,moduleId)),
		dataType : 'json',
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showServerMessage(true, 'This referral code is not available, please try again.');
			}
			return false;
		},
		error : function(e) {
			//showServerMessage(true, e.responseText);
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
function showServerMessage(show, message){
	if(!show){
		$('#servermessage').html('<b>'+message+'</b>')
	}else{
		$('#servermessage').html('')
	}
}
function showServerMessageWrapper(show, message){
	if(!show){
		$('#servermessagewrapper').html('<b>'+message+'</b>')
	}else{
		$('#servermessagewrapper').html('')
	}
}
function showElementErrorMessage(show, elementId, message){
	if(!show){
		$('#'+elementId+'-error-message').html(message)
	}else{
		$('#'+elementId+'-error-message').html('')
	}
}

function checkRequestIsEligibleForEnrollment(formId, moduleId, learningProgram, schoolId, timeZone, countryName, email) {
	hideMessage('');
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForCommon('eligible-for-enrollment'),
		data : JSON.stringify(checkRequestIsEligibleForEnrollmentPayload(formId, moduleId, learningProgram, schoolId, timeZone, countryName, email)),
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
function checkRequestIsEligibleForEnrollmentPayload(formId, moduleId, learningProgram, schoolId, timeZone, countryName, email){
	var request = {};
	var authentication = {};
	var data = {};
	data['requestKey'] = 'ELIGIBLE-FOR-ENROLLMENT';
	data['learningProgram'] = learningProgram;
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

function validMailPermission(flag, elementID){
	if(flag){
		validEndInvalidField(true, "email");
		if($("#email").val().trim() == $("#confirmEmail").val().trim()){
			validEndInvalidField(true, "confirmEmail");
		}else{
			validEndInvalidField(true, "email");
			validEndInvalidField(false, "confirmEmail");
			showElementErrorMessage(false, 'email', '');
			if("STUDENT" == moduleId){
				showElementErrorMessage(false, 'confirmEmail', role+' email and confirm student email are not same');
			}else{
				showElementErrorMessage(false, 'confirmEmail', 'Email and confirm email are not same');
			}
			
		}
	}else{
		validEndInvalidField(null, "email");
		validEndInvalidField(null, "confirmEmail");
		$("#email").val("");
		$("#confirmEmail").val("");
		showElementErrorMessage(false, 'email', '');
		showElementErrorMessage(false, 'confirmEmail', '');
	}
	
	$(".emailValidatorModal").removeClass("animate__fadeInUpBig");
	$(".emailValidatorModal").addClass("animate__fadeOutUpBig");
	$(".blur-overlary").hide();
}

function getLearningProgram(learningProgram){
	var responseData={};

	var data={};
	data['schoolId']=SCHOOL_ID;
	data['learningProgram']=learningProgram;

	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLFor('learning-program',''),
		data : JSON.stringify(data),
		dataType : 'json',
		async: false,
		global: false,
		success : function(data) {
			responseData=data
		},
		error : function(e) {
			showMessage(true, e.responseText);
		}
	});
	return responseData;
}
