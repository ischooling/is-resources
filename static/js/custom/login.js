var API_VERSION = CONTEXT_PATH + SCHOOL_UUID + '/' + 'api/v1/';
var schoolSettingsLinks;
var schoolSettingsTechnical;
var schoolSettings;
function goAhead(url, hash) {
  var form = $(
    '<form action="' +
      url +
      '" method="POST">' +
      '<input type="hidden" name="hash" id="hash" value="' +
      hash +
      '" />' +
      "</form>"
  );
  $("body").append(form);
  $(form).target = "_blank";
  $(form).submit();
}
function hideMessage(id) {
  $("#errorHeading").html("");
  $("#statusMessage").removeClass("success-color");
  $("#statusMessage").removeClass("danger-color");
  $("#statusMessage").html("");
  $("#modalMessage").modal("hide");
}
function chooseValueByElement(elementId, value) {
  if ($("#" + elementId).length) {
    $("#" + elementId + " option")
      .map(function () {
        var currentValue = $(this).text();
        //currentValue = currentValue.substr(0,currentValue.indexOf(' ')); // returns text before space
        currentValue = currentValue.substr(currentValue.indexOf(" ") + 1); // returns text after space
        if (currentValue === value) {
          return this;
        }
      })
      .attr("selected", "selected");
  }
}
function chooseCountryElement(elementId, value) {
  if ($("#" + elementId).length) {
    $("#" + elementId + " option")
      .map(function () {
        var currentValue = $(this).text();
        if (currentValue === value) {
          return this;
        }
      })
      .attr("selected", "selected");
    $("#" + elementId).trigger("change");
  }
}
function getPrimaryColor(){
	var primaryColor=ROOTCSS.split(':#')[1].split(';')[0];
	return primaryColor;
}

function checkAndReturn(type, resolve) {
	var scriptVersionType = 'SCRIPT_VERSION';
	var svObject = JSON.parse(localStorage.getItem(scriptVersionType));
	var data=JSON.parse(svObject.metaKey);
	if (data.data.metaValue != SCRIPT_VERSION) {
		localStorage.clear();
		resolve(getNeedToCall());
	} else {
		if (localStorage.getItem(type) == null) {
			resolve(getNeedToCall());
		} else {
			resolve(JSON.parse(localStorage.getItem(type)));
		}
	}
}
function getSettingsByTypeAndKey(type, key) {
  var responseData = {};
  $.ajax({
    url:
      BASE_URL +
      CONTEXT_PATH +
      SCHOOL_UUID +
      `/api/v1/get-setting?metaType=${type}&metaKey=${key}`,
    method: "GET",
    contentType: "application/json",
    async: false,
    success: function (response) {
      responseData = response;
    },
    error: function (error) {
      console.error("Error fetching settings");
    },
  });
  return responseData;
}
function getNeedToCall(){
	const needToCall = {
		"ntc": true
	};
	return needToCall;
}


async function getFreshValue(type, key){
	const metaValue = await getSettingsByTypeAndKey(type,key);
	const formData = {
		"metaType": key,
		"metaKey": metaValue
	};
	localStorage.setItem(key,JSON.stringify(formData));
}
function getDesiredObject(type) {
    var scriptVersionType = 'SCRIPT_VERSION';
    return new Promise((resolve, reject) => {
        if (localStorage.getItem(scriptVersionType) == null) {
            getFreshValue('CONFIGURATION', scriptVersionType)
                .then(() => {
                    checkAndReturn(type, resolve);
                })
                .catch(reject);
        } else {
            checkAndReturn(type, resolve);
        }
    });
}

async function getSchoolSettingsLinks(schoolId){
	try{
		var responseData = await  getDesiredObject('sslink'+schoolId);
		if(typeof responseData =='object'){
			if(!responseData.ntc){
				return responseData;
			}
		}
		responseData = await getDataBasedUrlAndPayload('links', getSettingRequest(schoolId));
		localStorage.setItem('sslink'+schoolId,JSON.stringify(responseData));
		return responseData;
	}catch(e){
		showMessage(true, e)
	}
}
function getSettingRequest(schoolId) {
  var data = {};
  data["schoolId"] = schoolId;
  return data;
}
async function getSchoolSettingsTechnical(schoolId){
	try{
		var responseData = await  getDesiredObject('sst'+schoolId);
		if(typeof responseData =='object'){
			if(!responseData.ntc){
				return responseData;
			}
		}
		responseData = await getDataBasedUrlAndPayload('technical', getSettingRequest(schoolId));
		localStorage.setItem('sst'+schoolId,JSON.stringify(responseData));
		return responseData;
	}catch(e){
		showMessage(true, e);

	}
}
async function getSchoolSettingsOffice(schoolId){
	try{
		var responseData = await  getDesiredObject('ssoffice'+schoolId);
		if(typeof responseData =='object'){
			if(!responseData.ntc){
				return responseData;
			}
		}
		responseData = await getDataBasedUrlAndPayload('office', getSettingRequest(schoolId));
		localStorage.setItem('ssoffice'+schoolId,JSON.stringify(responseData));
		return responseData;
	}catch(e){
		showMessage(true, e)
	}
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

async function initiateSetting(){
	schoolSettingsLinks = await getSchoolSettingsLinks(SCHOOL_ID);
    schoolSettingsTechnical = await getSchoolSettingsTechnical(SCHOOL_ID);
    schoolSettings = await getSchoolSettingsOffice(SCHOOL_ID);
}
async function loginPageOnLoadEvent(){
	callLocationAndSelectCountryNew('loginForm');		
    // <c:if test="${not empty username}">
    // 	var mandatoryFields='email,password'.split(',');
    // 	formValdate('loginForm', mandatoryFields, '');
    // </c:if>
    
    $("form").attr('autocomplete', 'off');
	  
	//   /* DON'T REMOVE BELOW SCRIPT THIS IS USE FOR EID MUBARAK LOGIN PAGE */
	  
	//   $("body").sparkle({
	// 	// accepts a HEX string, or "rainbow" or an array of HEX strings:
	// 	  color: ["#34ffec","#ff9a1d"],
	// 	// determine how many sparkles will be on the element at a time
	// 		count: 150,
	// 	// tell the canvas how far over the edge of it's container it should overlap in pixels.
	// 	  overlap: 0,
	// 	// set the speed multiplier
	// 	  speed: 1,
	// 	  minSize: 4,
	// 	  maxSize: 10,
	// 	  direction:"both"
	// });

	$("#email").blur(function() {
		validEndInvalidField(null, "email");
	});
	$("#password").blur(function() {
		validEndInvalidField(null, "password");
	});
	$('[data-toggle="tooltip"]').tooltip();
	$("#marqueeDiv").css({"color":"red"});
	$("#loginButton").click(function(event) {
		event.preventDefault();
		callUserLogin('loginForm', moduleId, 'FRESH');
	});
	$("#forgotSubmit").click(function(){
		callForEmailForgot('forgetForm', moduleId, "messageTypeTheme2");
	});
	
	$("#resetPassword").click(function(){
		callForResetPassword('changeForm', moduleId);
	});
	$("#notVerify").click(function(){
		callForEmailResend($("#loginForm #email").val().trim(), moduleId,'false');
	});
}

function callFocusForForgotPassword(){
	$('#forgotPassword').modal('show');
	$('#forgotPassword input').keydown(function (e) {
		if (e.keyCode == 13) {
			e.preventDefault();
			return false;
		}
	});
}

function validateRequestForLogin(formId) {
	
//	if (!validateFormAscii(formId)) {
//		showMessage(false, 'Please use the English Keyboard while providing information');
//		return false
//	}
	

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
	loginDTO['timezone'] = timezone;
	loginDTO['userName'] = $("#" + formId + " #email").val().trim();
	loginDTO['password'] = encode($("#" + formId + " #password").val().trim());
	loginDTO['captcha'] = $("#" + formId + " #captcha").val().trim();
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


function callLocationAndSelectCountryNewFill(formId, data){
	if($('#'+formId+' #countryTimezoneId').length){
		$('#'+formId+' #countryTimezoneId').select2();
	}
	if(data!=undefined && data !=''){
		if($("#"+formId+" #countryTimezoneId").length){
			$('#countryTimezoneId').val(data.timezone).trigger('change')
		}
		if($("#"+formId+" #chooseDate").length){
			$("#"+formId+" #chooseDate").datepicker().datepicker("setDate", new Date());
		}
		chooseValueByElement('isdCodeMobileNo', data.country);
		chooseValueByElement('isdCodeWhatsupNo', data.country);
		chooseCountryElement('countryId', data.country);
		setTimeout(function(){
			$('#countryId').trigger('change');
		},500)
		$("#"+formId+" #location").val(JSON.stringify(data));
		if($("#"+formId+"Alternet #location").length){
			$("#"+formId+"Alternet #location").val($("#"+formId+" #location").val());
		}
//		if($('#email').is(":disabled") && $('#confirmEmail').is(":disabled")){
//		}else if(SCHOOL_ID ==1 && $("#signupMode").length>0 && ($("#signupMode").val()=='SCHOLARSHIP' || $("#signupMode").val()=='ONE_TO_ONE')){
//		}
		// if(SCHOOL_ID ==1 && moduleId=='STUDENT'){
		// 	checkRequestIsEligibleForEnrollment(formId, moduleId, $("#signupMode").val().trim(), SCHOOL_ID, data.timezone, data.country, $("#email").val());
		// }
	}
}

function callLocationAndSelectCountryNew(formId){
	callLocationAndSelectCountryNewFill(formId, getActualData());
}

function showMessage(isWarnig, message, id) {
  window.scrollTo({ top: 100, left: 100, behavior: "smooth" });
  if (isWarnig) {
    $("#errorHeading").html("Error! Be focus on work");
    $("#statusMessage").addClass("danger-color");
    $("#statusMessage").removeClass("success-color");
  } else {
    $("#errorHeading").html("Information!");
    $("#statusMessage").removeClass("danger-color");
    $("#statusMessage").addClass("success-color");
  }
  $("#statusMessage").html(message);
  $("#modalMessage").modal("show");
  if (signupPage > 0) {
    setTimeout(function () {
      $("#modalMessage").modal("hide");
    }, 3000);
    setTimeout(function () {
      tabActiveStatus(signupPage);
    }, 1);
  }
}
function validateForEmailForgot(formId) {
  //GLOBAL_EMAIL
  if (
    !validateEmail(
      $("#" + formId + " #emailid")
        .val()
        .trim()
    )
  ) {
    $("#" + formId + " #emailid").css("color", "#a9a9a9");
    showMessage(false, "Please enter a valid email.");
    return false;
  }
  return true;
}
function getRequestForForgot(formId, moduleId) {
  var request = {};
  var authentication = {};
  var data = {};
  data["requestKey"] = "FORGOT-PASSWORD";
  data["email"] = $("#" + formId + " #emailid")
    .val()
    .trim();
  authentication["hash"] = getHash();
  authentication["schoolId"] = SCHOOL_ID;
  authentication["schoolUUID"] = SCHOOL_UUID;
  authentication["userType"] = moduleId;
  request["authentication"] = authentication;
  request["data"] = data;
  return request;
}
function refreshCaptcha(id) {
  if (id != undefined && id != "" && $("#" + id).length > 0) {
    document.images[id].src =
      BASE_URL + API_VERSION + "common/captcha.jpg?v=" + new Date().getTime();
  }
}
function getURLForCommon(suffixUrl) {
  return BASE_URL + API_VERSION + "common" + "/" + suffixUrl;
}
function getURLFor(apiType, suffixUrl) {
  return BASE_URL + API_VERSION + apiType + "/" + suffixUrl;
}
function getDataBasedUrlAndPayload(url, payload){
	return new Promise(function (resolve, reject) {
		$.ajax({
			type : "POST",
			contentType : "application/json",
			url : getURLFor(url,''),
			data : JSON.stringify(payload),
			dataType : 'json',
			global: false,
			success : function(data) {
				resolve(data);
			},
			error: function (xhr, status, e) {
				reject(e);
				if(tt=='theme1'){
					showMessage(true, TECHNICAL_GLITCH);
				}else{
					showMessageTheme2(0, TECHNICAL_GLITCH,'',true);
				}
			  }
		});
	});
}
function callForEmailForgot(formId, moduleId) {
  	if($("#modalMessage.in").length>0){
		hideMessage('');
		return false;
	}
  if (!validateForEmailForgot(formId)) {
    return false;
  }
  //$("#resendEmail").prop("disabled", true);
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: getURLForCommon("forgot-password"),
    data: JSON.stringify(getRequestForForgot(formId, moduleId)),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        //showMessage(true, data['message']);
        if (data["statusCode"] == "0047") {
          $("#allReadyEmail #emailNotVerify").html(data["message"]);
          $("#allReadyEmail #emailNotVerify").show();
          $("#allReadyEmailFooter").show();
          $("#allReadyEmail #emailVerify").hide();
          $("#allReadyEmail #userDeclined").hide();
          $("#allReadyEmail").modal("toggle");
        } else {
          showMessage(true, data["message"]);
        }
      } else {
        $("#forgotPassword #emailid").val().trim("");
        $("#forgotPassword").modal("hide");
        showMessage(false, data["message"]);
      }
      //$("#resendEmail").prop("disabled", false);
      return false;
    },
    error: function (e) {
      //showMessage(true, e.responseText);
      console.log("ERROR : ", e);
      //$("#resendEmail").prop("disabled", false);
    },
  });
}

$(document).on("show.bs.modal", ".modal", function (e) {
  const modal = $(this);
  const backdrops = $(".modal-backdrop");
  const modals = $(".modal.in").not(this);
  // Calculate new z-index
  let baseZIndex = 1050;
  let zIndex = baseZIndex + modals.length * 20; // Each stacked modal increases z-index

  modal.css("z-index", zIndex);

  setTimeout(() => {
    let backdrop = $(".modal-backdrop").last();
    backdrop
      .css("z-index", zIndex - 10) // Ensure backdrop is behind modal
      .addClass("modal-stack");
  }, 10);
});



function validEndInvalidField(flag, ele) {
  if (flag) {
    $("#" + ele)
      .closest(".valid-field")
      .addClass("true");
    $("#" + ele)
      .closest(".valid-field")
      .removeClass("false");
  } else if (flag == null) {
    $("#" + ele)
      .closest(".valid-field")
      .removeClass("false");
    $("#" + ele)
      .closest(".valid-field")
      .removeClass("true");
  } else {
    $("#" + ele)
      .closest(".valid-field")
      .addClass("false");
    $("#" + ele)
      .closest(".valid-field")
      .removeClass("true");
  }
}
function getSystemTimezone() {
  var timezone = "";
  try {
    timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (err) {
    console.log("getSystemTimezone: " + err.message);
  }
  return timezone;
}
function encode(payload) {
  return window.btoa(encodeURI(payload));
}
function getHash() {
  return Math.random().toString(36);
}
function showPassWord(elementId, iconId) {
  var x = document.getElementById(elementId);
  var y = document.getElementById(iconId);
  if (!x.disabled) {
    if (x.type === "password") {
      x.type = "text";
      // this.class = "fa fa-eye";
      y.classList.remove("fa-eye-slash");
      y.classList.add("fa-eye");
    } else {
      x.type = "password";
      // y.class = "fa-eye-slash";
      y.classList.remove("fa-eye");
      y.classList.add("fa-eye-slash");
    }
  } else {
    return false;
  }
} 
$.ajaxSetup({
  beforeSend: function (xhr, settings) {
    if (settings.data != undefined) {
      if (settings.contentType == "application/json") {
        // var KEUS = getSecreteKey();
        // AesUtil(KEUS.KEYSIZE, KEUS.ITERATIONS);
        var payload = {};
        // payload['payload']=AesUtil.prototype.encrypt(KEUS.SALT, KEUS.IV, KEUS.PASSPHRASE, settings.data);
        payload["payload"] = encode(settings.data);
        settings.data = JSON.stringify(payload);
      }
    }
    xhr.setRequestHeader("UNIQUEUUID", UNIQUEUUID);
  },
});
function customLoader(needToShow) {
  if (needToShow) {
    //ajaxCalls++;
    $("#commonloaderId").removeClass("hide");
    $("#commonloaderBody").addClass("loader");
    $("#commonloaderId").addClass("loader-bg");
    $("#commonloaderId").show();
  } else {
    // if(ajaxCalls>0){
    // 	ajaxCalls--;
    // }
    //if(ajaxCalls == 0){

    $("#commonloaderBody").removeClass("loader");
    $("#commonloaderId").removeClass("loader-bg");
    $("#commonloaderId").addClass("hide");
    $("#commonloaderId").hide();

    //}
  }
}
$(document).ajaxStart(function () {
  customLoader(true);
});
$(document).ajaxSuccess(function () {
  customLoader(false);
});