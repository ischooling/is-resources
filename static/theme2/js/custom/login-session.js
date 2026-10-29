function validateRequestForLogin(formId) {
	if (!validateEmail($("#" + formId + " #email").val().trim())) {
		showMessage(false, 'Email is either empty or invalid');
		return false
	}
	if (!validPassword($("#" + formId + " #password").val().trim())) {
		showMessage(false, 'Either password is empty or invalid');
		return false
	}
	return true;
}
var recaptchaScriptPromise = null;
function loadRecaptchaScript() {
	if (recaptchaScriptPromise) {
		return recaptchaScriptPromise;
	}
	recaptchaScriptPromise = new Promise(function (resolve, reject) {
		if (!document.querySelector('script[src*="recaptcha/api.js"]')) {
			var style = document.createElement("style");
			style.textContent = ".grecaptcha-badge{visibility:hidden!important;}";
			document.head.appendChild(style);
			var script = document.createElement("script");
			script.src = "https://www.google.com/recaptcha/api.js?render=" + encodeURIComponent(RECAPTCHA_SITE_KEY);
			script.async = true;
			document.head.appendChild(script);
		}
		var waited = 0;
		(function waitForGrecaptcha() {
			if (window.grecaptcha && typeof window.grecaptcha.execute === "function") {
				resolve();
			} else if ((waited += 100) > 10000) {
				recaptchaScriptPromise = null;
				reject();
			} else {
				setTimeout(waitForGrecaptcha, 100);
			}
		})();
	});
	return recaptchaScriptPromise;
}

// Keyed on DEPLOYMENT_MODE rather than RECAPTCHA_ENABLED: the server re-reads RECAPTCHA_BYPASS on every
// POST, so a page rendered while the bypass was on must still send a token once it is switched off.
function getRecaptchaToken(action) {
	if (typeof RECAPTCHA_SITE_KEY === "undefined" || !RECAPTCHA_SITE_KEY
			|| typeof DEPLOYMENT_MODE === "undefined" || String(DEPLOYMENT_MODE).toUpperCase() !== "PROD") {
		return Promise.resolve("");
	}
	return loadRecaptchaScript().then(function () {
		return new Promise(function (resolve) {
			setTimeout(function () { resolve(""); }, 10000);
			grecaptcha.ready(function () {
				grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: action }).then(function (token) {
					resolve(token || "");
				}).catch(function () {
					resolve("");
				});
			});
		});
	}).catch(function () {
		return "";
	});
}

async function getRequestForLogin(formId, moduleId, loginType) {
	var request = {};
	var authentication = {};
	var loginDTO = {};

	var timezone=getSystemTimezone();
	if(timezone=='Asia/Calcutta'){
		timezone='Asia/Kolkata';
	}
	loginDTO['timezone'] = timezone;
	loginDTO['userName'] = $("#" + formId + " #email").val().trim();
	loginDTO['password'] = encode($("#" + formId + " #password").val().trim());
	loginDTO['location'] = $("#" + formId + " #location").val().trim();
	loginDTO['fromSpoof'] = $("#" + formId + " #fromSpoof").val().trim();
	loginDTO['recaptchaToken'] = await getRecaptchaToken('session_continue');
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
		contentType : APPLICATION_JSON_VALUE,
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
				$("#proceed").prop("disabled", false);
				// Timezone is now the first-priority layer, so after saving it we must
				additionalLayer();
			}
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
async function callUserLoginFun(formId, moduleId, loginType) {
	if($("#modalMessage.in").length>0){
        hideMessage('');
		return false;
	}

	if (!validateRequestForLogin(formId)) {
		return false;
	}
	$("#"+formId+" #login").prop("disabled", true);
	var loginRequest = await getRequestForLogin(formId, moduleId, loginType);
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLForCommon('login'),
		data : JSON.stringify(loginRequest),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			localStorage.setItem('welcome',false);
			if (data.status == '0' || data.status == '2') {
				if(data.statusCode == '0043') {
					$('#allReadyEmail #emailNotVerify').show();
					$('#allReadyEmailFooter').show();
					$('#allReadyEmail #emailVerify').hide();
					$('#allReadyEmail #userDeclined').hide();
					$('#allReadyEmail').modal('toggle');
				}else if(data.statusCode == '02' || data.statusCode == '0042') {
					$('#allReadyEmail #emailNotVerify').hide();
					$('#allReadyEmail #emailVerify').hide();
					$('#allReadyEmailFooter').hide();
					$('#allReadyEmailTitle').text('Access Denied!');
					$('#allReadyEmail #userDeclinedMessage').text(data.message || 'policy violation.');
					$('#allReadyEmail #userDeclined').show();
					$('#allReadyEmail').modal('toggle');
				}else{
					if(moduleId=='STUDENT'){
						showMessage(false, data.message,'',true);
						validEndInvalidField(false, "email");
						validEndInvalidField(false, "password");
					}else{
						showMessage(false, data.message);
						validEndInvalidField(false, "email");
						validEndInvalidField(false, "password");
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
					}else if(loginType=='CONTINUE'){
						customLoader(false)
						if(moduleId=='STUDENT'){
							showMessage(true, data.message,'',true);
						}else{
							showMessage(true, data.message);
						}
						$('#sessionOutPermission').modal('hide');
						window.location.reload();
					}
				}else{
					showMessage(true, redirectUrl);
				}
				validEndInvalidField(true, "email");
				validEndInvalidField(true, "password");
			}
			$("#"+formId+" #login").prop("disabled", false);
			return false;
		}
	});
}