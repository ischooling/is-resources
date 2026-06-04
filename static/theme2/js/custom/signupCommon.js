var role;
$(document).ready(function () {
	if ($("#signupType").val() == "Online") {
		signupStudentOnLoad();
	}
});

function signupStudentOnLoad() {
	if (moduleId == "TEACHER") {
		role = "";
	} else if (moduleId == "STUDENT") {
		role = "Student";
	}
	console.log("signupCommon");
	$("#signupButton").click(function (event) {
		event.preventDefault();
		if ($("#captcha").val().trim() == "") {
			validEndInvalidField(false, "captcha");
		}
		callForUserSignUp('userSignupForm', moduleId);
	});
	$("#resendEmail").click(function (event) {
		event.preventDefault();
		callForEmailResend($("#userSignupForm #email").val().trim(), moduleId, 'false');
	});
	var prevValue = '';
	$("#email").blur(function () {
		var currentValue = $(this).val();
		if ($(this).val().trim().length > 0) {
			if (validateEmail($("#userSignupForm #email").val().trim())) {
				if (prevValue != currentValue) {
					validEndInvalidField(null, "email");
					callEmailCheck('userSignupForm', moduleId);
					if ($("#confirmEmail").val().trim() != '' && $("#email").val().trim() != $("#confirmEmail").val().trim() && $("#email").val().trim().length > 0) {
						validEndInvalidField(false, "email");
						if ("STUDENT" == moduleId) {
							showElementErrorMessage(false, 'email', role + 'email and confirm ' + role + ' email are not same');
						} else {
							showElementErrorMessage(false, 'email', 'Email and confirm email are not same');
						}

					} else if ($("#email").val().trim() == $("#confirmEmail").val().trim() && $("#email").val().trim() != "") {
						validEndInvalidField(true, "email");
						validEndInvalidField(true, "confirmEmail");
						showElementErrorMessage(false, 'confirmEmail', '');
						showElementErrorMessage(false, 'email', '');
					}
					prevValue = currentValue;
				} else {
					if ($("#email").val().trim() == $("#confirmEmail").val().trim()) {
						validEndInvalidField(true, "email");
						validEndInvalidField(true, "confirmEmail");
						showElementErrorMessage(false, 'confirmEmail', '');
						showElementErrorMessage(false, 'email', '');
					}
				}
			} else {
				validEndInvalidField(false, "email");
				if ("STUDENT" == moduleId) {
					showElementErrorMessage(false, 'email', 'Student email is either empty or invalid.');
				} else {
					showElementErrorMessage(false, 'email', 'Email is either empty or invalid');
				}
			}
		}
	});
	$("#confirmEmail").blur(function () {
		if (validateEmail($("#userSignupForm #confirmEmail").val().trim())) {
			if ($("#email").val().trim() != '' && $("#email").val().trim() != $("#confirmEmail").val().trim() && $("#confirmEmail").val().trim().length > 0) {
				validEndInvalidField(false, "confirmEmail");
				if ("STUDENT" == moduleId) {
					showElementErrorMessage(false, 'confirmEmail', role + ' email and confirm ' + role.toLowerCase() + ' email are not same');
				} else {
					showElementErrorMessage(false, 'confirmEmail', 'Email and confirm email are not same');
				}

			} else if ($("#email").val().trim() == $("#confirmEmail").val().trim() && $("#confirmEmail").val().trim() != "") {
				validEndInvalidField(true, "email");
				validEndInvalidField(true, "confirmEmail");
				showElementErrorMessage(false, 'confirmEmail', '');
				showElementErrorMessage(false, 'email', '');
			} else {
				validEndInvalidField(null, "confirmEmail");
				showElementErrorMessage(false, 'confirmEmail', '');
			}
		} else {
			if ($("#confirmEmail").val().trim().length > 0) {
				validEndInvalidField(false, "confirmEmail");
				if ("STUDENT" == moduleId) {
					showElementErrorMessage(false, 'confirmEmail', 'Confirm Student email empty or invalid.');
				} else {
					showElementErrorMessage(false, 'confirmEmail', 'Confirm email is either empty or invalid');
				}

			} else {
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
	$("#password").blur(function () {
		if ($(this).val().trim().length > 0) {
			var isPasswordStrong = checkPasswordStrength(
				$("#userSignupForm #password").get(0),
				"userSignupForm",
				"password",
				"P"
			);
			if (!isPasswordStrong) {
				showElementErrorMessage(false, 'password', 'Create your own password must match all requirements.');
				if ($(this).val().trim() != $("#userSignupForm #confirmPassword").val().trim() && $("#userSignupForm #confirmPassword").val().trim().length > 0) {
					showElementErrorMessage(false, 'confirmPassword', 'Create your own password and Confirm y our own Password do not match');
					validEndInvalidField(false, "confirmPassword");
				} else {
					showElementErrorMessage(false, 'password', 'Create your own password must match all requirements.')
					validEndInvalidField(null, "confirmPassword");
				}
				validEndInvalidField(false, "password");
				flag = false
			} else if (!validPassword($("#userSignupForm #password").val().trim())) {
				$("#userSignupForm #password").css('color', '#a9a9a9');
				showElementErrorMessage(false, 'password', 'Password is either empty or invalid');
				validEndInvalidField(false, "password");
				flag = false
			} else {
				validEndInvalidField(true, "password");
				showElementErrorMessage(true, 'password', '');
				if ($(this).val().trim() != $("#confirmPassword").val().trim() && $("#confirmPassword").val().trim().length > 0) {
					validEndInvalidField(false, "confirmPassword");
					showElementErrorMessage(false, 'confirmPassword', 'Create your own password and Confirm your own Password do not match');
				} else if ($("#confirmPassword").val().trim().length == 0) {
					validEndInvalidField(null, "confirmPassword");
				} else {
					validEndInvalidField(true, "confirmPassword");
					showElementErrorMessage(false, 'confirmPassword', '');
				}
			}
		}
		else {
			validEndInvalidField(null, "password");
		}
	});
	$("#confirmPassword").blur(function () {
		if ($(this).val().length > 0) {

			if (!validPassword($("#userSignupForm #confirmPassword").val().trim())) {
				$("#userSignupForm #confirmPassword").css('color', '#a9a9a9');
				showElementErrorMessage(false, 'confirmPassword', 'Confirm password is either empty or invalid');
				validEndInvalidField(false, "confirmPassword");
				flag = false;
			} else if (!checkPasswordStrength(
				$("#userSignupForm #confirmPassword").get(0),
				"userSignupForm",
				"confirmPassword",
				"CP",
				"password"
			)) {
				showElementErrorMessage(false, 'confirmPassword', 'Confirm your own Passwords must match all requirements.');
				validEndInvalidField(false, "confirmPassword");
				flag = false
			} else if ($("#userSignupForm #password").val().trim() != $("#userSignupForm #confirmPassword").val().trim()) {
				$("#userSignupForm #password").css('color', '#a9a9a9');
				$("#userSignupForm #confirmPassword").css('color', '#a9a9a9');
				showElementErrorMessage(false, 'confirmPassword', 'Create your own password and Confirm your own Password do not match');
				validEndInvalidField(false, "confirmPassword");
				flag = false
			} else {
				validEndInvalidField(true, "confirmPassword");
				showElementErrorMessage(true, 'confirmPassword', '');
			}
		} else {
			validEndInvalidField(null, "confirmPassword");
		}
	});
	$("#captcha").blur(function () {
		if ($(this).val().length > 0) {
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
			showElementErrorMessage(false, 'captcha', '')
		} else {
			//validEndInvalidField(null, "captcha");
		}
	})
	$("#notVerify").click(function () {
		//		event.preventDefault();
		callForEmailResend($("#userSignupForm #email").val().trim(), moduleId, 'false');
	});
	$("#referralCode").blur(function () {
		if ($("#referralCode").val().trim() != '') {
			callReferralCodeCounselorCheck('userSignupForm', moduleId);
		}

	});
}

async function callForUserSignUp(formId, moduleId) {
	$('.error-msg').html('');
	if ($("#signupType").val() != "Offline") {
		if (!validateRequestForSignup(formId, moduleId)) {
			return false;
		}
	} else {
		if (moduleId == 'STUDENT') {
			if ($("#learningProgramPartnerStudent").val() == "") {
				showMessageTheme2(0, "Please Select the learning program");
				return false;
			}
		}
	}
	
	$("#signup").prop("disabled", true);
	var payload = getRequestForSignup(formId, moduleId);
	var parentUrl = '';
	if (moduleId == 'STUDENT') {
		parentUrl = 'api/v1/student'
	} else if (moduleId == 'TEACHER') {
		parentUrl = 'api/v1/teacher'
	} else if (moduleId == 'SCHOOL') {
		parentUrl = 'api/v1/school'
	}
	var responseData = await callSingupCommon(true, true, 'enrollment/stage-1', payload, parentUrl);

	if (responseData['status'] == '0' || responseData['status'] == '2') {
		if (moduleId == 'STUDENT') {
			var learningProgram = $("#" + formId + " #learningProgram").val().trim();
			if(responseData['statusCode'] == 'FLAGGED'){
				$("#flaggedModal").remove();
				$("body").append(flaggedModalContent(responseData));
				$("#flaggedModal").removeClass("animate__fadeOutUpBig");
				$("#flaggedModal").addClass("animate__fadeInUpBig");
				$(".blur-overlary").show();
			}else if (learningProgram != 'SCHOLARSHIP') {
				showServerMessage(false, responseData['message']);
			}
		}
		if (responseData['statusCode'] == '0001') {
			hideStep1Div();
			showWrapper(true, responseData["fr"], responseData["extra1"]);
			$('#emailVerify').show();
		} else if (responseData['statusCode'] == '0041' || responseData['statusCode'] == '0038') {
			refreshCaptcha('captchaImage');
		} else {
			hideStep1Div();
		}
	} else {
		if (responseData['emailVerified']) {
			if ($("#signupType").val() == "Offline") {
				$("#signupStage1 #communicationEmail").attr('disabled', true);
				$("#signupStage1 #userId").val(responseData.studentUserId);
			} else {
				goAhead(responseData['redirectUrl'], '');
			}
		} else {
			showWrapper(true, responseData["fr"], responseData["extra1"]);
			$('#emailNotVerify').hide();
			$('#userDeclined').hide();
			$('#emialLimit').hide();
			$('#emailVerify').hide();
			$('#accountConfirmation').show();
			$('#emailId').html($("#" + formId + " #email").val());
		}
	}
	return false;
}

function hideStep1Div() {
	$('#accountConfirmation').hide();
	$('#emailNotVerify').hide();
	$('#userDeclined').hide();
	$('#emialLimit').hide();
	$('#emailVerify').hide();
}

function validateRequestForSignup(formId, moduleId) {
	var flag = true;
	if (!validateFormAscii(formId)) {
		showServerMessage(false, 'Please use the English Keyboard while providing information');
		flag = false
	}
	if (!validateEmail($("#" + formId + " #email").val().trim())) {
		$("#" + formId + " #email").css('color', '#a9a9a9');
		if ("STUDENT" == moduleId) {
			showElementErrorMessage(false, 'email', 'Student email is either empty or invalid.');
		} else {
			showElementErrorMessage(false, 'email', 'Email is either empty or invalid');
		}
		flag = false
	}
	if (!validateEmail($("#" + formId + " #confirmEmail").val().trim())) {
		$("#" + formId + " #confirmEmail").css('color', '#a9a9a9');
		if ("STUDENT" == moduleId) {
			showElementErrorMessage(false, 'confirmEmail', 'Confirm Student email empty or invalid.');
		} else {
			showElementErrorMessage(false, 'confirmEmail', 'Confirm email is either empty or invalid');
		}
		flag = false
	} else if ($("#" + formId + " #email").val().trim() != $("#" + formId + " #confirmEmail").val().trim()) {
		$("#" + formId + " #email").css('color', '#a9a9a9');
		$("#" + formId + " #confirmEmail").css('color', '#a9a9a9');
		if ("STUDENT" == moduleId) {
			showElementErrorMessage(false, 'confirmEmail', 'Student email and confirm student email are not same');
		} else {
			showElementErrorMessage(false, 'confirmEmail', 'Email and confirm email are not same');
		}
		flag = false
	}
	var isPasswordStrong = checkPasswordStrength(
		$("#" + formId + " #password").get(0),
		formId,
		"password",
		"P"
	);
	if (!isPasswordStrong) {
		showElementErrorMessage(false, 'password', 'Create your own password must match all requirements.');
		flag = false
	} else if (!validPassword($("#" + formId + " #password").val().trim())) {
		$("#" + formId + " #password").css('color', '#a9a9a9');
		showElementErrorMessage(false, 'password', 'Password is either empty or invalid');
		flag = false
	}

	if (!validPassword($("#" + formId + " #confirmPassword").val().trim())) {
		$("#" + formId + " #confirmPassword").css('color', '#a9a9a9');
		showElementErrorMessage(false, 'confirmPassword', 'Confirm password is either empty or invalid');
		flag = false;
	} else if (!checkPasswordStrength(
		$("#" + formId + " #confirmPassword").get(0),
		formId,
		"confirmPassword",
		"CP",
		"password"
	)) {
		showElementErrorMessage(false, 'confirmPassword', 'Confirm your own Passwords must match all requirements.');
		flag = false
	} else if ($("#" + formId + " #password").val().trim() != $("#" + formId + " #confirmPassword").val().trim()) {
		$("#" + formId + " #password").css('color', '#a9a9a9');
		$("#" + formId + " #confirmPassword").css('color', '#a9a9a9');
		showElementErrorMessage(false, 'confirmPassword', 'Create your own password and Confirm your own Password do not match');
		flag = false
	}
	if (!validateCaptcha($("#" + formId + " #captcha").val().trim())) {
		$("#" + formId + " #captcha").css('color', '#a9a9a9');
		showElementErrorMessage(false, 'captcha', 'Captcha is either empty or invalid');
		flag = false
	}

	if ($("#" + formId + " #checkTerms").is(':checked')) {
		showElementErrorMessage(false, 'checkTerms', '');
	} else {
		showElementErrorMessage(false, 'checkTerms', 'Please accept terms and conditions');
		flag = false
	}
	return flag;
}

function getRequestForSignup(formId, moduleId) {
	var request = {};
	var authentication = {};
	var signupDTO = {};
	var url = window.location.href;
	var isDemoUser = url.split('?isDemoUser')[1];
	if ('Offline' == $("#" + formId + " #signupType").val()) {
		signupDTO['email'] = $("#" + formId + " #communicationEmail").val();
		if (moduleId == 'STUDENT') {
			signupDTO['referralCode'] = localStorage.getItem('referralCode' + USER_ID);
			signupDTO['learningProgram'] = $("#learningProgramPartnerStudent").val();
			signupDTO['enrollmentFor'] = $("#enrollmentFor").val();
			signupDTO['discount'] = $("#" + formId + " #discount").val();
		}
	} else {
		signupDTO['email'] = $("#" + formId + " #email").val();
		signupDTO['confirmEmail'] = $("#" + formId + " #confirmEmail").val();
		signupDTO['password'] = encode($("#" + formId + " #password").val());
		signupDTO['confirmPassword'] = encode($("#" + formId + " #confirmPassword").val());
		signupDTO['captcha'] = $("#" + formId + " #captcha").val();
		if (moduleId == 'STUDENT') {
			signupDTO['referralCode'] = $("#" + formId + " #referralCode").val();
			signupDTO['unregisteredId'] = $("#" + formId + " #unregisteredId").val();
			signupDTO['discount'] = $("#" + formId + " #discount").val();
			signupDTO['ras'] = $("#" + formId + " #ras").val();
			signupDTO['learningProgram'] = $("#" + formId + " #learningProgram").val();
			signupDTO['enrollmentFor'] = $("#" + formId + " #enrollmentFor").val();
			signupDTO['discount'] = $("#" + formId + " #discount").val();
		}
	}
	signupDTO['location'] = $("#" + formId + " #location").val();
	signupDTO['signupType'] = $("#" + formId + " #signupType").val();
	signupDTO['userType'] = moduleId;
	signupDTO['schoolId'] = SCHOOL_ID;
	signupDTO['schoolUUID'] = SCHOOL_UUID;
	if (isDemoUser != '' && isDemoUser != undefined) {
		isDemoUser = isDemoUser.split('=')[1];
		signupDTO['isDemoUser'] = isDemoUser;
	}
	signupDTO['utmSource'] = getCookie('us');
	signupDTO['utmMedium'] = getCookie('um');
	signupDTO['utmDescription'] = getCookie('uc');
	signupDTO['originalUrl'] = getCookie('cu');
	signupDTO['gclid'] = getCookie('gclid');
	signupDTO['utmCampaign'] = getCookie('ucam');
	signupDTO['utmTerm'] = getCookie('ut');
	signupDTO['landingPage'] = getCookie('lu');
	authentication['hash'] = getHash(); authentication['schoolId'] = SCHOOL_ID; authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = moduleId;
	request['authentication'] = authentication;
	request['data'] = signupDTO;
	return request;
}


function callReferralCodeCounselorCheck(formId, moduleId) {
	hideMessage('');
	if ($("#referralCode").val().trim() == '') {
		showServerMessage(false, 'Referral Code empty or invalid');
		return false
	}

	$.ajax({
		type: "POST",
		contentType: APPLICATION_JSON_VALUE,
		url: getURLForCommon('verify-referral'),
		data: JSON.stringify(getRequestForReferralCodeCheck(formId, moduleId)),
		dataType: 'json',
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showServerMessage(true, 'This referral code is not available, please try again.');
			}
			return false;
		}
	});
}

function getRequestForReferralCodeCheck(formId, moduleId) {
	var request = {};
	var authentication = {};
	var requestData = {};
	requestData['requestKey'] = 'REFERRAL-AVAILABLE';
	requestData['requestValue'] = $("#referralCode").val().trim();
	authentication['hash'] = getHash(); authentication['schoolId'] = SCHOOL_ID; authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = moduleId;
	request['authentication'] = authentication;
	request['requestData'] = requestData;
	return request;
}
function showServerMessage(show, message) {
	if (!show) {
		$('#servermessage').html('<b>' + message + '</b>')
	} else {
		$('#servermessage').html('')
	}
}
function showServerMessageWrapper(show, message) {
	if (!show) {
		$('#servermessagewrapper').html('<b>' + message + '</b>')
	} else {
		$('#servermessagewrapper').html('')
	}
}
function showElementErrorMessage(show, elementId, message) {
	if (!show) {
		$('#' + elementId + '-error-message').html(message)
	} else {
		$('#' + elementId + '-error-message').html('')
	}
}

function validMailPermission(flag, elementID) {
	if (flag) {
		validEndInvalidField(true, "email");
		if ($("#email").val().trim() == $("#confirmEmail").val().trim()) {
			validEndInvalidField(true, "confirmEmail");
		} else if ($("#confirmEmail").val().trim() == "") {
			// do nothing
		} else {
			validEndInvalidField(true, "email");
			validEndInvalidField(false, "confirmEmail");
			showElementErrorMessage(false, 'email', '');
			if ("STUDENT" == moduleId) {
				showElementErrorMessage(false, 'confirmEmail', role + ' email and confirm student email are not same');
			} else {
				showElementErrorMessage(false, 'confirmEmail', 'Email and confirm email are not same');
			}

		}
	} else {
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

function getLearningProgram(learningProgram) {
	var responseData = {};

	var data = {};
	data['schoolId'] = SCHOOL_ID;
	data['learningProgram'] = learningProgram;

	$.ajax({
		type: "POST",
		contentType: APPLICATION_JSON_VALUE,
		url: getURLFor('learning-program', ''),
		data: JSON.stringify(data),
		dataType: 'json',
		async: false,
		global: false,
		success: function (data) {
			responseData = data
		},
		error: function (e) {
			if (checkonlineOfflineStatus()) {
				return;
			}
			showMessage(true, e.responseText);
		}
	});
	return responseData;
}

function callSingupCommon(globalflag, showMessage, url, payload, parentUrl){
  return new Promise(function (resolve, reject) {
      $.ajax({
          type : "POST",
          contentType : APPLICATION_JSON_VALUE,
          url: getURLForHTML(parentUrl, url),
          data : JSON.stringify(payload),
          dataType : 'json',
          global : globalflag,
          success : function(data) {
              if (data.status == '0' || data.status == '2' || data.status == '3') {
                  if(data.status == '3'){
                      redirectLoginPage();
                  }else{
                      if(showMessage){
                        showMessageTheme2(0, data.message,'',true);
                      }
                  }
                  resolve(data);
              } else {
                  resolve(data);
              }
          },
          error: function (xhr, status, e) {
              if(showMessage){
                showMessageTheme2(0, e.responseText,'',true);
              }
              reject(e);
          }
      });
  });
}

function flaggedModalContent(data){
	var academicYear = (data && data.extra) ? data.extra : '';
	var html=
		`<div class="emailValidatorModal animate__animated animate__fadeOutUpBig" id="flaggedModal">
			<div class="emailValidatorModalBody info theme-border font-size-18">
				<div class="full text-center">
					<h1 class="bold-font font-size-22 rounded-modal-msg">Information</h1>
				</div>
				<div style="padding: 20px 10px; display: inline-block;">
					<p style="font-size: 15px;">Thank you for your interest in ${SCHOOL_NAME}.<br/>Seats for the Academic Year ${academicYear} are currently full. We have saved your details, and if any seat becomes available due to a cancellation or withdrawal, we will reach out to you right away.</p>
					<div class="confirmation-email-btn">
						<input type="button" class="theme-bg text-white valid_yes button" style="margin: auto;" value="OK" onclick="closeFlaggedModal()">
					</div>
				</div>
			</div>
		</div>`
	return html;
}

function closeFlaggedModal(){
	$("#flaggedModal").removeClass("animate__fadeInUpBig");
	$("#flaggedModal").addClass("animate__fadeOutUpBig");
	$(".blur-overlary").hide();
}
