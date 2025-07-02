function validateRequestForLogin(formId) {
	if (!validateEmail($("#" + formId + " #email").val().trim())) {
		showMessage(false, 'Email is either empty or invalid');
		return false
	}
	if (!validPassword($("#" + formId + " #password").val().trim())) {
		showMessage(false, 'Either password is empty or invalid');
		return false
	}
	if (!validateCaptcha($("#" + formId + " #captcha").val().trim())) {
		showMessage(false, 'Either captcha is empty or invalid');
		return false
	}
	return true;
}
function getRequestForLogin(formId, moduleId, loginType) {
	var request = {};
	var authentication = {};
	var loginDTO = {};
	
	var timezone=getSystemTimezone();
	if(timezone=='Asia/Calcutta'){
		timezone='Asia/Kolkata';
	}
	loginDTO['fromSpoof'] = $("#" + formId + " #fromSpoof").val().trim();
	loginDTO['timezone'] = timezone;
	loginDTO['userName'] = $("#" + formId + " #email").val().trim();
	loginDTO['password'] = encode($("#" + formId + " #password").val().trim());
	loginDTO['captcha'] = $("#" + formId + " #captcha").val().toUpperCase().trim();
	loginDTO['location'] = $("#" + formId + " #location").val().trim();
	authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = moduleId;
	request['authentication'] = authentication;
	request['login'] = loginDTO;
	return request;
}
function getRequestForProceedToChangeTimezoneForCommon(timezoneId,userId){
	var request = {};
	var authentication = {};
	var data = {};

	authentication['userType'] = 'common';
	authentication['userId'] = userId;
	authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
	data['timezoneId']=timezoneId;
	request['authentication'] = authentication;
	request['data'] = data;
	return request;
}
function proceedWithUserChangedTimezone(currentTimezoneId, userId){
	if($("#modalMessage.in").length>0){
        hideMessage('');
		return false;
	}
	currentTimezoneId = $("#countryTimezoneFromId").val();
	if (currentTimezoneId==null || currentTimezoneId==undefined || currentTimezoneId=='') {
		return false;
	}
	$("#proceed").prop("disabled", true);
	customLoader(true);
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLFor('common','save-user-new-timezone'),
		data : JSON.stringify(getRequestForProceedToChangeTimezoneForCommon(currentTimezoneId,userId)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data.status == '0' || data.status == '2') {
				showMessage(true, data.message);
				customLoader(false);
			} else if(data.status == '3'){
				showMessage(true, data.message);
				customLoader(false);
				redirectLoginPage();
			} else {
				customLoader(false);
				var redirectUrl=$("#ssoUrl").val();
				goAhead(redirectUrl, $("#hash").val());
				$("#proceed").prop("disabled", false);
			}
		},
		error : function(e) {
			$("#proceed").prop("disabled", false);
		}
	});
}
var debouncing = function (mainFun, delay) {
	var timer;
	return function (...args) {
		clearTimeout(timer);
		timer = setTimeout(() => {
			mainFun(...args);
		}, delay);
	};
};
const callUserLogin = debouncing(callUserLoginFun, 300);
function callUserLoginFun(formId, moduleId, loginType) {
	if($("#modalMessage.in").length>0){
        hideMessage('');
		return false;
	}
	
	if (!validateRequestForLogin(formId)) {
		return false;
	}
	$("#"+formId+" #login").prop("disabled", true);
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForCommon('login'),
		data : JSON.stringify(getRequestForLogin(formId, moduleId, loginType)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			localStorage.setItem('welcome',false);
			if (data.status == '0' || data.status == '2') {
				//refreshCaptcha('captchaImage');
				if(data.statusCode == '0043') {
					$('#allReadyEmail #emailNotVerify').show();
					$('#allReadyEmailFooter').show();
					$('#allReadyEmail #emailVerify').hide();
					$('#allReadyEmail #userDeclined').hide();
					$('#allReadyEmail').modal('toggle');
				}else if(data.statusCode == '02') {
					$('#allReadyEmail #emailNotVerify').hide();
					$('#allReadyEmail #emailVerify').hide();
					$('#allReadyEmail #userDeclined').show();
					$('#allReadyEmail').modal('toggle');
				}else{
					if(moduleId=='STUDENT'){
						showMessage(false, data.message,'',true);
						validEndInvalidField(false, "email");
						validEndInvalidField(false, "password");
						validEndInvalidField(false, "captcha");
					}else{
						showMessage(false, data.message);
						validEndInvalidField(false, "email");
						validEndInvalidField(false, "password");
						validEndInvalidField(false, "captcha");
					}
				}
				customLoader(false)
			} else {
				customLoader(true);
				UNIQUEUUID=data['uniqueId']
				var redirectUrl = data['redirectUrl'];
				console.log('redirectUrl :: '+redirectUrl)
				if(redirectUrl.startsWith('http')){
					if(loginType=='FRESH'){
						showMessage(true, data.message);
						goAhead(redirectUrl, data['userLoginHash']);
						//sync one by one all static contents
						// getCommonCustomScript(data['userId'],SCHOOL_ID);
						// setTimeout(function(){
						// 	alert("called")
						// 	$("#ssoUrl").val(redirectUrlSSO);
						// 	$("#hash").val(['userLoginHash']);
						// }, 10000)
					}else if(loginType=='CONTINUE'){
						customLoader(false)
						if(moduleId=='STUDENT'){
							showMessage(true, data.message,'',true);
						}else{
							showMessage(true, data.message);
						}
						$('#sessionOutPermission').modal('hide')
					}
				}else{
					showMessage(true, redirectUrl);
				}
				validEndInvalidField(true, "email");
				validEndInvalidField(true, "password");
				validEndInvalidField(true, "captcha");
			}
			$("#"+formId+" #login").prop("disabled", false);
			return false;
		},
		error : function(e) {
			//showMessage(true, e.responseText);
			$("#"+formId+" #login").prop("disabled", false);
		}
	});
}