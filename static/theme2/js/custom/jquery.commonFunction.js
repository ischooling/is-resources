var BASE_TIMEZONE='Asia/Singapore';
var API_VERSION = CONTEXT_PATH + SCHOOL_UUID + '/' + 'api/v1/';
var API_VERSION_WITHOUT_UNIQUEID = CONTEXT_PATH + '/' + 'api/v1/';
var GLOBAL_EMAIL = '';
var GRADE_CAL_RULE = {};
var DEFAULT_SEARCH_STATE = true;
var editor1;
var editor2;
var editor3;
var editor4;
var IGNORECOUNTRYARRAY = ['AQ', 'BV', 'HM', 'TF', 'UM'];
var globalEntityId = "";
var reviewDone = false;
var submitted = false;
var courseCategoryType = [];
var gradesTaught = [];
var gradesChanged = false;
var elementary_subjects = [];
var middleSchool_subjects = [];
var highSchool_subjects = [];
var uploadDone = false;
var FULL_NAME = "";
var LEAVE_DATES = "";
var TECHNICAL_GLITCH =
  "Sorry for inconvenience, system has encountered technical glitch.";
var SERVICE_UNAVAILABLE = "Temporarily Ticket Service is not available!";
var MAX_SIZE_LIMIT = "Please upload maximum 5MB file in size.";
var MAX_SIZE_LIMIT_FOR_TEACHER = "Please upload maximum 10 MB file in size.";
var pattern = /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[A-Z])(?=.*[a-z]).{8,20}$/;
var sumUnseen;
var date = new Date();
var today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
var end = new Date(date.getFullYear(), date.getMonth(), date.getDate());
function copyToClipboardText(originalValue) {
  var $tempInput = $("<input>");
  $("body").append($tempInput);
  $tempInput.val(originalValue).select();
  document.execCommand("copy");
  $tempInput.remove();
}
window.addEventListener("offline", (event) => {
  if (tt == "theme1") {
    showMessage(
      true,
      "Your device is offline, please check your internet connection."
    );
  } else {
    showMessageTheme2(
      0,
      "Your device is offline, please check your internet connection.",
      "",
      true
    );
  }
});

window.addEventListener("online", (event) => {
  if (tt == "theme1") {
    showMessage(false, "You are back online");
  } else {
    showMessageTheme2(1, "You are back online", "", true);
  }
});

function redirectLoginPage() {
  if (signupPage > 0) {
    window.setTimeout(function () {
      window.location = BASE_URL + CONTEXT_PATH + SCHOOL_UUID + "/common/login";
    }, 1000);
  } else {
    if ($("#continueSessionForm").length > 0) {
      callLocationAndSelectCountryNew("continueSessionForm");
      $("#password").val("");
      $("#captcha").val("");
      $("#sessionOutPermission").modal({ backdrop: "static", keyboard: false });
      refreshCaptcha("captchaImage");
    } else {
      window.setTimeout(function () {
        window.location =
          BASE_URL + CONTEXT_PATH + SCHOOL_UUID + "/common/login";
      }, 1000);
    }
  }
}
function refreshCaptcha(id) {
	var primaryColor=ROOTCSS.split(':#')[1].split(';')[0];
	if (id != undefined && id != '' && $('#' + id).length > 0) {
		document.images[id].src = BASE_URL + API_VERSION + 'common/captcha.jpg?payload='+primaryColor+'&v=' + new Date().getTime();
	}
}
function getURLForHTML(apiType, suffixUrl) {
  return (
    BASE_URL + CONTEXT_PATH + SCHOOL_UUID + "/" + apiType + "/" + suffixUrl
  );
}
function getURLFor(apiType, suffixUrl) {
  return BASE_URL + API_VERSION + apiType + "/" + suffixUrl;
}
function getURLForCommon(suffixUrl) {
  return BASE_URL + API_VERSION + "common" + "/" + suffixUrl;
}
function getURLForMeeting(suffixUrl) {
  return BASE_URL + API_VERSION + "meetings" + "/" + suffixUrl;
}

function getURLForWithoutUnique(apiType, suffixUrl) {
  return BASE_URL + API_VERSION_WITHOUT_UNIQUEID + apiType + "/" + suffixUrl;
}

function getURLForAdmissionCycle(apiType, suffixUrl, session) {
  return (
    BASE_URL +
    CONTEXT_PATH +
    SCHOOL_UUID +
    "/" +
    apiType +
    "/" +
    suffixUrl +
    "/" +
    session
  );
}
function logout(suffix) {
  localStorage.clear();
  var url =
    BASE_URL +
    CONTEXT_PATH +
    SCHOOL_UUID +
    "/" +
    "common/logout/" +
    (UNIQUEUUID || "111");
  if (suffix) {
    url += suffix;
  }
  goAheadGet(url, "");
}

function getURLForSignup(suffixUrl, module) {
  var apiType = "common";
  if (module == undefined || module == null) {
    if (moduleId == "STUDENT") {
      apiType = "student";
    } else if (moduleId == "TEACHER") {
      apiType = "teacher";
    } else if (moduleId == "SCHOOL" || moduleId == "SCHOOL_B2B") {
      apiType = "school";
    } else if (moduleId == "COMMON") {
      apiType = "common";
    }
  } else {
    apiType = module.toLowerCase();
  }
  return API_VERSION + apiType + "/" + suffixUrl;
}

$(document).ready(function () {
  //$('[data-toggle="tooltip"]').tooltip();
});
function setPagePosition(position) {
  signupPage = position;
}
function increasePosition() {
  signupPage = signupPage + 1;
}
function tabActiveStatus(tabPosition) {
  signupPage = tabPosition;
  if (tabPosition == 2) {
    tabPosition = 0;
  } else if (tabPosition == 3 || tabPosition == 4) {
    tabPosition = 1;
  } else if (tabPosition == 5) {
    tabPosition = 2;
  } else if (tabPosition == 6) {
    tabPosition = 3;
  }
  $("#formSteps div").steps("setStep", tabPosition);
}

function setActiveTab(signupPage) {
  var activetab = 0;
  if (signupPage == 2) {
    activetab = 0;
  } else if (signupPage == 3) {
    activetab = 1;
  } else if (signupPage == 4) {
    activetab = 2;
    submitted = true;
  } else if (signupPage == 5) {
    activetab = 3;
    reviewDone = true;
  } else if (signupPage == 6) {
    activetab = 4;
    reviewDone = true;
  }
  if (USER_ROLE == "TEACHER") {
    if (activetab == 2) {
      $("#formSteps div").steps("setStep", 2);
    } else {
      $("#formSteps div").steps("setStep", activetab);
    }
  }
  if (activetab == 2) {
    showPendingApprovalPopup(4);
  }
}

function showPendingApprovalPopup() {
  $("#submitInterviewSlotModal").modal("hide");
  $("#inReviewForTeacherDetailsModal").modal({
    backdrop: "static",
    keyboard: false,
  });
  $("#inReviewForTeacherDetailsModal").modal("show");
}
//messageType=0 ERROR
//messageType=1 SUCCESS
//messageType=2 INFORMATION
function showModalMessage(messageType, message, id) {
  // hideModalMessage(id);
  // $('.messageModalDiv1').removeClass('error');
  // $('.messageModalDiv1').removeClass('success');
  // $('.messageModalDiv1').removeClass('notification');
  // if (messageType==0) {
  // 	$('.messageModalDiv1').addClass('error')
  // 	$('.messageModalDiv1').html('<i class="fa fa-times"></i>'+message);
  // 	$('.messageModalDiv').removeClass('hide');
  // }else if (messageType==1) {
  // 	$('.messageModalDiv1').addClass('success')
  // 	$('.messageModalDiv1').html('<i class="fa fa-check"></i>'+message);
  // 	$('.messageModalDiv').removeClass('hide');
  // }else if (messageType==2) {
  // 	$('.messageModalDiv1').addClass('notification')
  // 	$('.messageModalDiv1').html('<i class="fa fa-info"></i>'+message);
  // 	$('.messageModalDiv').removeClass('hide');
  // }
  // $('.messageModalDiv').show();

  // $('#studentPaymentModal .modal-body').animate({scrollTop: "0px"
  // }, 'slow');

  // $('#callPaymentStudentModal .modal-body').animate({scrollTop: "0px"
  // }, 'slow');
  showMessage(messageType, message, id, false);
}
function hideModalMessage(signupError, id) {
  if (!signupError) {
    $(".messageModalDiv").addClass("hide");
    $(".messageModalDiv1").html("");
    $(".messageModalDiv").hide();
  }
}
function showMessageBankDetails(isWarnig, message, id) {
  if (isWarnig) {
    $("#errorHeading").html("Error! Be focus on work");
    $("#statusMessageBD").addClass("danger-color");
    $("#statusMessageBD").removeClass("success-color");
  } else {
    $("#errorHeading").html("Information!");
    $("#statusMessageBD").removeClass("danger-color");
    $("#statusMessageBD").addClass("success-color");
  }
  $("#statusMessageBD").html(message);
  $("#modalMessageBD").show();
  $("#withdrawnRequestBankForm .modal-body").animate({ scrollTop: 0 }, "slow");
  setTimeout(function () {
    $("#modalMessageBD").hide();
  }, 5000);
}
function showMessage(messageType, message, id, msgHide) {
  if (message == "") {
    return false;
  } else {
    $("#messageDiv1").removeClass("error");
    $("#messageDiv1").removeClass("success");
    $("#messageDiv1").removeClass("notification");
    $("#messageDiv").show();
    if (messageType == 0 || messageType == false) {
      $("#messageDiv1").addClass("error");
      $("#messageDiv1").html(
        '<i class="fa fa-times-circle"></i>&nbsp;' + message
      );
    } else if (messageType == 1 || messageType == true) {
      $("#messageDiv1").addClass("success");
      $("#messageDiv1").html(
        '<i class="fa fa-check-circle"></i>&nbsp;' + message
      );
    } else if (messageType == 2) {
      $("#messageDiv1").addClass("notification");
      $("#messageDiv1").html(
        '<i class="fa fa-info-circle"></i>&nbsp;' + message
      );
    }
    $(".server-error-message").addClass("show");
    setTimeout(function () {
      if ($(".server-error-message").hasClass("show")) {
        $(".server-error-message").removeClass("show");
      }
    }, 5000);

    if (msgHide) {
      setTimeout(function () {
        $(".server-error-message").removeClass("show");
      }, 3000);
    }
  }
}
function hideMessage(signupError, id) {
  if (!signupError) {
    $("#messageDiv1").html("");
    $("#messageDiv").hide();
  }
}
function showMessageTheme2(messageType, message, id, msgHide, timer) {
  if (timer == undefined || timer == null || timer == "") {
    timer = 6000;
  }
  if (message == "") {
    return false;
  } else {
    hideMessageTheme2(id);
    $("#msgTheme2").removeClass("error");
    $("#msgTheme2").removeClass("success");
    $("#msgTheme2").removeClass("notification");
    if (messageType == 0) {
      $("#msgTheme2").addClass("error");
      $("#msgTheme2").html(
        '<i class="fa fa-exclamation-triangle"></i>&nbsp;' + message
      );
    } else if (messageType == 1) {
      $("#msgTheme2").addClass("success");
      $("#msgTheme2").html('<i class="fa fa-check"></i>&nbsp;' + message);
    } else if (messageType == 2) {
      $("#msgTheme2").addClass("notification");
      $("#msgTheme2").html('<i class="fa fa-info"></i>&nbsp;' + message);
    }
    $(".server-message").addClass("show");
    setTimeout(function () {
      $(".server-message").removeClass("show");
    }, timer);
    if (msgHide) {
      setTimeout(function () {
        $("#msgTheme2").html("");
        $(".server-message").removeClass("show");
      }, timer);
    }
  }
}
$("#msgTheme2").click(function () {
  $(".server-message").removeClass("show");
});
function hideMessageTheme2(id) {
  $("#msgTheme2").html("");
  $(".server-message").removeClass("show");
  //$('.server-message').hide();
}
function showHideDiv(isHide, divId) {
  if (isHide) {
    $("#" + divId).removeClass("show");
    $("#" + divId).addClass("hide");
  } else {
    $("#" + divId).removeClass("hide");
    $("#" + divId).addClass("show");
  }
}
function getHash() {
  return Math.random().toString(36);
}
function showMessageRequestDemoPage(isWarnig, message, id, fid) {
  //	$('#'+id).parent().removeClass('error-message-hide');
  $("#" + id)
    .parent()
    .addClass("show-message");
  if (fid.length > 0) {
    $("#" + fid).addClass("highlight-field");
    $("#" + fid)
      .next()
      .find(".select2-selection__rendered")
      .addClass("highlight-field");
  }
  $("#" + id).html(message);
}
function hideMessageRequestDemoPage(id, fid) {
  $("#" + id)
    .parent()
    .removeClass("show-message");
  if (fid.length > 0) {
    $("#" + fid).removeClass("highlight-field");
    $("#" + fid)
      .next()
      .find(".select2-selection__rendered")
      .removeClass("highlight-field");
  }
  //	$('#'+id).parent().addClass('error-message-hide');
  $("#" + id).html("");
}
function showMessageErrorNew(isWarnig, message, id) {
  if (!isWarnig) {
    $("#" + id).addClass("success-msg");
  }
  $("#" + id).addClass("show-errow-msg");
  $("#" + id).html(message);
}
function hideMessageErrorNew(id) {
  $("#" + id).removeClass("success-msg");
  $("#" + id).removeClass("show-errow-msg");
  $("#" + id).html("");
}
function buildDropdown(result, dropdown, emptyMessage) {
  dropdown.html("");
  if (result != "") {
    dropdown.append('<option value="">' + emptyMessage + "</option>");
    //	dropdown.append('<option disabled selected> </option>');
    $.each(result, function (k, v) {
      if (v.extra != null && v.extra1 != null) {
        dropdown.append(
          '<option value="' +
            v.key +
            '">' +
            v.extra +
            " - " +
            v.extra1 +
            "</option>"
        );
      } else if (v.extra != null) {
        if (v.extra == "selected") {
          dropdown.append(
            '<option disabled selected value="' +
              v.key +
              '">' +
              v.value +
              "</option>"
          );
        } else if (v.extra == "non-selected") {
          dropdown.append(
            '<option value="' + v.key + '"> ' + v.value + "</option>"
          );
        } else {
          dropdown.append(
            '<option value="' + v.key + '"> ' + v.value + "</option>"
          );
        }
      } else {
        dropdown.append(
          '<option value="' + v.key + '">' + v.value + "</option>"
        );
      }
    });
  } else {
    dropdown.append('<option value="0">' + emptyMessage + "</option>");
  }
}

function resetDropdown(dropdown, emptyMessage) {
  dropdown.html("");
  //	dropdown.append('<option disabled selected> </option>');
}
$(document).ajaxStart(function () {
  customLoader(true);
});
//var ajaxCalls = 0;
function customLoader(needToShow) {
  //console.log("2"+new Date());
  if (needToShow) {
    if (signupPage == 0) {
      //ajaxCalls++;
      // console.log("3a"+new Date());
      // setTimeout(function(){
      // 	//$('#commonloaderIdNewLoader').removeClass('hide-loader')
      // 	$('#commonloaderId').show();
      // 	$('#commonloaderBody').show();
      // }, 100);
      $("#commonloaderIdNewLoader").removeClass("hide-loader");
      $("#commonloaderId").show();
      $("#commonloaderBody").show();
    } else {
      /*setTimeout(function(){
				$('#commonloaderId').show();
				$('#commonloaderBody').show();
			}, 800);*/
      // console.log("3"+new Date());
      $("#commonloaderId").hide();
      $("#commonloaderBody").hide();
    }
  } else {
    if (signupPage == 0) {
      // if(ajaxCalls>0){
      // 	ajaxCalls--;
      // }
      setTimeout(function () {
        //if(ajaxCalls == 0){
        $("#commonloaderIdNewLoader").addClass("hide-loader");
        $("#commonloaderId").hide();
        $("#commonloaderBody").hide();
        //}
      }, 1000);
      // console.log("4"+new Date());
      $("#topProfileImage").show();
      $(".dt-responsive tbody tr td:first-child").addClass("dtr-control");
    } else {
      setTimeout(function () {
        // console.log("5"+new Date());
        $("#commonloaderId").hide();
        $("#commonloaderBody").hide();
      }, 800);
    }
  }
}
function customLoaderExternalPage(needToShow) {
  if (needToShow) {
    $("#newThemeloader").modal({ backdrop: "static", keyboard: false });
  } else {
    setTimeout(function () {
      $("#newThemeloader").modal("hide");
    }, 800);
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
        // console.log('settings.data '+settings.data)
        payload["payload"] = encode(settings.data);
        settings.data = JSON.stringify(payload);
      }
    }
    xhr.setRequestHeader("UNIQUEUUID", UNIQUEUUID);
  },
});

//$( document ).ajaxSend(function() {
//	customLoader(true);
//});
//$( document ).ajaxSuccess(function() {
//	customLoader(false);
//});
$(document).ajaxError(function (event, jqxhr, settings, exception) {
  console.log(
    "event is" +
      event +
      "jqxhr is" +
      jqxhr +
      "settings" +
      settings +
      "exception is" +
      exception
  );
  console.log("exception ajax request URL:", settings.url);
  customLoader(false);
  if (checkonlineOfflineStatus()) {
    return;
  }
  if (!navigator.onLine) {
    if (tt == "theme1") {
      showMessage(
        true,
        "Your device is offline, please check your internet connection."
      );
    } else {
      showMessageTheme2(
        0,
        "Your device is offline, please check your internet connection.",
        "",
        true
      );
    }
    return;
  }

  if (isJson(jqxhr.responseText)) {
    var parseResponse = JSON.parse(jqxhr.responseText);
    console.log("parse Response is:" + jqxhr.status);
    var hasProperty = parseResponse.hasOwnProperty("message");
    if (hasProperty) {
      showMessage(1, parseResponse.message);
      showModalMessage(1, TECHNICAL_GLITCH);
    } else {
      showMessage(1, TECHNICAL_GLITCH);
      showModalMessage(1, TECHNICAL_GLITCH);
    }
  } else {
    showMessage(1, TECHNICAL_GLITCH);
    showModalMessage(1, TECHNICAL_GLITCH);
  }
});

function checkonlineOfflineStatus() {
  if (!navigator.onLine) {
    if (tt == "theme1") {
      showMessage(
        true,
        "Your device is offline, please check your internet connection."
      );
    } else {
      showMessageTheme2(
        0,
        "Your device is offline, please check your internet connection.",
        "",
        true
      );
    }
    return true;
  }
  return false;
}
//$( document ).ajaxComplete(function() {
//	customLoader(false);
//});
$(document).ajaxStop(function () {
  customLoader(false);
});

function goAheadGet(url, hash) {
  var form = $(
    '<form action="' +
      url +
      '" method="GET">' +
      '<input type="hidden" name="hash" id="hash" value="' +
      hash +
      '" />' +
      "</form>"
  );
  $("body").append(form);
  $(form).submit();
}
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

function callEmailCheck(formId, moduleId) {
  hideMessage("");
  $(".error-msg").html("");
  if (
    !$("#" + formId + " #email")
      .val()
      .trim()
  ) {
    return true;
  }
  // if (!validateRequestForEmailCheck(formId)) {
  // 	return false;
  // }
  $("#email").prop("disabled", true);
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: getURLForCommon("is-user-available"),
    data: JSON.stringify(getRequestForEmailCheck(formId, moduleId)),
    dataType: "json",
    success: function (data) {
      if (!data.emailVerified && data.status == "1") {
        $("#emailValidatorEle").text($("#email").val());
        $(".emailValidatorModal").addClass("show");
        $(".emailValidatorModal").addClass("animate__fadeInUpBig");
        $(".emailValidatorModal").removeClass("animate__fadeOutUpBig");
        $(".blur-overlary").show();
      } else {
        validEndInvalidField(true, "email");
      }
      $("#allReadyEmailFooter").hide();
      if (data["status"] == "0" || data["status"] == "2") {
        // if (data['statusCode'] == '0043') {
        // 	showWrapper(true);
        // 	hideStep1Div()
        // 	$('#emailNotVerify').show();
        // 	$('#allReadyEmailFooter').show();
        // } else
        if (data["statusCode"] == "0044" || data["statusCode"] == "0043") {
          showWrapper(true);
          hideStep1Div();
          $("#emailVerify").show();
        } else if (data["statusCode"] == "02") {
          showWrapper(true);
          hideStep1Div();
          $("#userDeclined").show();
        } else {
          showMessage(1, data["message"]);
        }
      }
      $("#" + formId + " #email").prop("disabled", false);
      return false;
    },
    error: function (e) {
      $("#" + formId + " #email").prop("disabled", false);
    },
  });
}

function validateRequestForEmailCheck(formId) {
  if (
    !validateEmail(
      $("#" + formId + " #email")
        .val()
        .trim()
    )
  ) {
    $("#" + formId + " #email").css("color", "#a9a9a9");
    validEndInvalidField(false, "email");
    showMessage(false, "email", "Student email is either empty or invalid");
    return false;
  }
  validEndInvalidField(true, "email");
  return true;
}

function getRequestForEmailCheck(formId, moduleId) {
  var request = {};
  var authentication = {};
  var data = {};
  data["requestKey"] = "EMAIL-AVAILABLE";
  data["email"] = $("#" + formId + " #email")
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

function emailCheck(emailId, moduleId) {
  var result = "";
  hideMessage("");
  if (!validateEmail(emailId)) {
    showMessage(0, "Email is either empty or invalid");
    return false;
  }
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: getURLForCommon("is-user-available"),
    data: JSON.stringify(getCallRequestForEmailCheck(emailId, moduleId)),
    dataType: "json",
    cache: false,
    timeout: 600000,
    async: false,
    success: function (data) {
      //console.log('data=> '+JSON.stringify(data));
      if (data["status"] == "0" || data["status"] == "2") {
        showMessage(0, "Email already exist");
        result = false;
      } else {
        result = true;
      }
    },
    error: function (e) {
      console.log("ERROR : ", e);
    },
  });
  return result;
}

function getCallRequestForEmailCheck(emailId, module, userRole) {
  var request = {};
  var authentication = {};
  var data = {};
  data["requestKey"] = "EMAIL-AVAILABLE";
  data["email"] = emailId;
  data["requestExtra1"] = userRole;
  authentication["hash"] = getHash();
  authentication["schoolId"] = SCHOOL_ID;
  authentication["schoolUUID"] = SCHOOL_UUID;
  authentication["userType"] = module;
  request["authentication"] = authentication;
  request["data"] = data;
  return request;
}

function callCities(formId, value, stateId, cityId) {
  var flag = false;
  hideMessage("");
  if (cityId == undefined) {
    cityId = "cityId";
  }
  if (!validateRequestForMaster(formId, stateId)) {
    resetDropdown($("#" + formId + " #" + cityId), "Select City*");
    if ($("#" + formId + " #" + cityId).val()) {
      $("#" + formId + " #" + cityId)
        .val(0)
        .trigger("change");
    }
    return false;
  }
  $("#" + formId + " #" + cityId).prop("disabled", true);
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: getURLForCommon("masters"),
    data: JSON.stringify(getRequestForMaster("formId", "CITIES-LIST", value)),
    dataType: "json",
    async: false,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        showMessage(1, data["message"]);
      } else {
        buildDropdown(
          data["mastersData"]["cities"],
          $("#" + formId + " #" + cityId),
          "Select City*"
        );
      }
      $("#" + formId + " #" + cityId).prop("disabled", false);
      flag = true;
    },
    error: function (e) {
      $("#" + formId + " #" + cityId).prop("disabled", false);
      flag = false;
    },
  });
  return flag;
}

function callCitiesNew(formId, value, elementId, bindElementId) {
  var flag = false;
  hideMessage("");
  if (!validateRequestForMaster(formId, elementId)) {
    $("#" + formId + " #" + bindElementId).val(0);
    resetDropdown($("#" + formId + " #" + bindElementId), "Select city*");
    return false;
  }
  $("#" + formId + " #" + bindElementId).prop("disabled", true);
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: getURLForCommon("masters"),
    data: JSON.stringify(getRequestForMaster("formId", "CITIES-LIST", value)),
    dataType: "json",
    async: false,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        showMessage(1, data["message"]);
      } else {
        buildDropdown(
          data["mastersData"]["cities"],
          $("#" + formId + " #" + bindElementId),
          "Select city*"
        );
      }
      $("#" + formId + " #" + bindElementId).prop("disabled", false);
      flag = true;
    },
    error: function (e) {
      $("#" + formId + " #" + bindElementId).prop("disabled", false);
      flag = false;
    },
  });
  return flag;
}
function getAllCountryTimezone(formId, value, elementId) {
  hideMessage("");
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: getURLForCommon("masters"),
    data: JSON.stringify(getRequestForMaster(formId, "TIMEZONE-LIST", value)),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        showMessage(1, data["message"]);
      } else {
        $.each(data["mastersData"]["countryTimeZones"], function (k, v) {
          $("#" + formId + " #" + elementId).append(
            '<option custom_timezone_id="' +
              v.key +
              '" value="' +
              v.value +
              '">(' +
              v.extra +
              ") - " +
              v.extra1 +
              "/" +
              v.extra3 +
              "</option>"
          );
        });
        if ($("#" + formId + "Alternet #" + elementId).length) {
          $("#" + formId + "Alternet #" + elementId).html(
            $("#" + formId + " #" + elementId).html()
          );
        }
      }
    },
  });
}
function callISDCode(formId, value, elementId) {
  $("#" + formId + " #" + elementId).html(
    '<option value="">Select ISD code</option>'
  );
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: getURLForCommon("masters"),
    data: JSON.stringify(getRequestForMaster(formId, "COUNTRIES-LIST", value)),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        showMessage(1, data["message"]);
      } else {
        $.each(data["mastersData"]["countries"], function (k, v) {
          $("#" + formId + " #" + elementId).append(
            '<option value="' +
              v.extra1 +
              '">' +
              v.extra1 +
              " " +
              v.value +
              "</option>"
          );
        });
      }
      if ($("#" + formId + "Alternet #" + elementId).length) {
        $("#" + formId + "Alternet #" + elementId).html(
          $("#" + formId + " #" + elementId).html()
        );
      }
      callLocationAndSelectCountryNew(formId);
    },
  });
}
function callCountries(formId, value, elementId, eventBinder) {
  $("#" + formId + " #" + elementId).html(
    '<option value="">Select country*</option>'
  );
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: getURLForCommon("masters"),
    data: JSON.stringify(getRequestForMaster(formId, "COUNTRIES-LIST", value)),
    dataType: "json",
    async: false,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        showMessage(1, data["message"]);
      } else {
        $.each(data["mastersData"]["countries"], function (k, v) {
          $("#" + formId + " #" + elementId).append(
            '<li class="option ' +
              eventBinder +
              '" value="' +
              v.key +
              '">' +
              v.value +
              "</li>"
          );
        });
      }
      if ($("#" + formId + "Alternet #" + elementId).length) {
        $("#" + formId + "Alternet #" + elementId).html(
          $("#" + formId + " #" + elementId).html()
        );
      }
    },
  });
  return true;
}
function callCountriesOption(formId, value, elementId, preSelected) {
  $("#" + formId + " #" + elementId).html(
    '<option value="">Select country*</option>'
  );
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: getURLForCommon("masters"),
    data: JSON.stringify(getRequestForMaster(formId, "COUNTRIES-LIST", value)),
    dataType: "json",
    async: false,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        showMessage(1, data["message"]);
      } else {
        buildDropdownCountry(
          data["mastersData"]["countries"],
          $("#" + formId + " #" + elementId),
          "Select Country*"
        );
        // var html='';
        // html += '<option value="" disabled selected>Select Country</option>';
        // $.each(data['mastersData']['countries'], function(k, v) {
        // 	html+='<option dailCode="'+v.extra1+'" dail-country-code="'+v.extra+'" value="'+v.key+'" '+(preSelected==v.key?'selected':'')+'>'+v.value+'</option>'
        // 	//html+='<option value="'+v.key+'" '+(preSelected==v.key?'selected':'')+' >'+v.value+'</option>';
        // });
        // $("#"+elementId).html(html);
      }
    },
  });
}
function callStates(formId, value, countryId, stateId, cityId) {
  hideMessage("");
  if (stateId == undefined) {
    stateId = "stateId";
  }
  if (cityId == undefined) {
    cityId = "cityId";
  }
  if (!validateRequestForMaster(formId, countryId)) {
    resetDropdown($("#" + formId + " #" + stateId), "Select State/Province*");
    $("#" + formId + " #" + stateId)
      .val(0)
      .trigger("change");
    resetDropdown($("#" + formId + " #" + cityId), "Select City*");
    $("#" + formId + " #" + cityId)
      .val(0)
      .trigger("change");
    return false;
  }
  $("#" + stateId).prop("disabled", true);
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: getURLForCommon("masters"),
    data: JSON.stringify(
      getRequestForMaster(
        formId,
        "STATES-LIST",
        value == "" ? $("#" + countryId).val() : value
      )
    ),
    dataType: "json",
    async: false,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        showMessage(1, data["message"]);
      } else {
        buildDropdown(
          data["mastersData"]["states"],
          $("#" + formId + " #" + stateId),
          "Select State/Province*"
        );
      }
      $("#" + formId + " #" + stateId).prop("disabled", false);
    },
    error: function (e) {
      $("#" + formId + " #" + stateId).prop("disabled", false);
    },
  });
  return true;
}

function validateRequestForMaster(formId, elementId) {
  if ($("#" + formId + " #" + elementId).val() == null) {
    return false;
  }
  if (
    $("#" + formId + " #" + elementId)
      .val()
      .trim() == "" ||
    $("#" + formId + " #" + elementId)
      .val()
      .trim() == 0
  ) {
    return false;
  }
  return true;
}

function callStatesNew(formId, value, elementId, bindElementId) {
  hideMessage("");
  if (!validateRequestForMaster(formId, elementId)) {
    $("#" + formId + " #" + bindElementId).val(0);
    resetDropdown($("#" + formId + " #stateId"), "Select State/Province*");
    $("#" + formId + " #cityId").val(0);
    resetDropdown($("#" + formId + " #cityId"), "Select City*");
    return false;
  }
  $("#stateId").prop("disabled", true);

  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: getURLForCommon("masters"),
    data: JSON.stringify(getRequestForMaster(formId, "STATES-LIST", value)),
    dataType: "json",
    async: false,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        showMessage(1, data["message"]);
      } else {
        buildDropdown(
          data["mastersData"]["states"],
          $("#" + formId + " #" + bindElementId),
          "Select State/Province*"
        );
      }
      $("#" + formId + " #" + bindElementId).prop("disabled", false);
    },
    error: function (e) {
      $("#" + formId + " #" + bindElementId).prop("disabled", false);
    },
  });
  return true;
}

// function validateRequestForMaster(formId, elementId) {
//   if (
//     $("#" + formId + " #" + elementId).val() == "" ||
//     $("#" + formId + " #" + elementId).val() <= 0
//   ) {
//     return false;
//   }
//   return true;
// }

function callForResetPassword(formId, moduleId) {
  hideMessage("");
  if (
    $("#password").val().trim() == "" &&
    $("#confirmPassword").val().trim() == ""
  ) {
    showMessageTheme2(false, "Fields are not valid", "", false);
    return false;
  } else if (
    $("#password").val().trim() != $("#confirmPassword").val().trim()
  ) {
    showMessageTheme2(false, "Password does not match.", "", false);
    return false;
  }
  if (!pattern.test($("#" + formId + " #password").val())) {
    showMessageTheme2(
      false,
      " New password must match all requirements",
      "",
      false
    );
    return false;
  }
  if (
    !pattern.test(
      $("#" + formId + " #confirmPassword")
        .val()
        .trim()
    )
  ) {
    showMessageTheme2(
      false,
      " Confirm password must match all requirements",
      "",
      false
    );
    return false;
  }
  $.ajax({
    type: "POST",
    url: getURLForCommon("reset-password"),
    contentType: "application/json",
    data: JSON.stringify(getRequestForReset(formId, moduleId)),
    dataType: "json",
    success: function (data) {
      if (
        data["status"] == "0" ||
        data["status"] == "2" ||
        data["status"] == "3"
      ) {
        if (data["status"] == "3") {
          redirectLoginPage();
        } else {
          if (tt == "theme1") {
            showMessage(false, data["message"]);
          } else {
            showMessageTheme2(0, data["message"], "", true);
          }
        }
      } else {
        if (data["statusCode"] == "S001") {
          showMessage(true, data["message"]);
          setTimeout(function () {
            logout();
          }, 1500);
        } else {
          showMessage(true, data["message"]);
        }
      }
      return false;
    },
  });
}

function getRequestForReset(formId, moduleId) {
  var request = {};
  var authentication = {};
  var data = {};
  data["password"] = encode(
    $("#" + formId + " #password")
      .val()
      .trim()
  );
  data["confirmPassword"] = encode(
    $("#" + formId + " #confirmPassword")
      .val()
      .trim()
  );
  authentication["hash"] = getHash();
  authentication["schoolId"] = SCHOOL_ID;
  authentication["schoolUUID"] = SCHOOL_UUID;
  authentication["userType"] = moduleId;
  authentication["userId"] = $("#" + formId + " #userId")
    .val()
    .trim();
  request["authentication"] = authentication;
  request["data"] = data;
  return request;
}

function callForEmailForgot(formId, moduleId) {
  hideMessage("");
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
        //showMessage(1, data['message']);
        if (data["statusCode"] == "0047") {
          showWrapper(true);
          $("#emailNotVerify").html(data["message"]);
          $("#emailNotVerify").show();
          $("#allReadyEmailFooter").show();
          $("#emailVerify").hide();
          $("#userDeclined").hide();
        } else {
          showMessage(1, data["message"]);
        }
      } else {
        $("#forgotPassword #emailid").val().trim("");
        $("#forgotPassword").modal("hide");
        showMessage(0, data["message"]);
      }
      //$("#resendEmail").prop("disabled", false);
      return false;
    },
    error: function (e) {
      //showMessage(1, e.responseText);
      console.log("ERROR : ", e);
      //$("#resendEmail").prop("disabled", false);
    },
  });
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
    showMessage(0, "Please enter a valid email.");
    return false;
  }
  return true;
}

function getRequestForForgot(formId, moduleId) {
  var request = {};
  var authentication = {};
  var data = {};
  data["requestKey"] = "FORGOT-PASSWORD";
  data["requestValue"] = $("#" + formId + " #emailid")
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

function callForEmailResend(emailId, moduleId, sendStatus) {
  hideMessage("");
  if (!validateForEmailResend(emailId)) {
    return false;
  }
  $("#resendEmail").prop("disabled", true);
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: getURLForCommon("resend-email-verification"),
    data: JSON.stringify(
      getRequestForEmailResend(emailId, moduleId, sendStatus)
    ),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        if (data["statusCode"] == "0022") {
          showServerMessageWrapper(false, data["message"]);
        } else {
          showServerMessageWrapper(false, data["message"]);
        }
      } else {
        showServerMessageWrapper(false, data["message"]);
      }
      $("#resendEmail").prop("disabled", false);
      return false;
    },
    error: function (e) {
      $("#resendEmail").prop("disabled", false);
    },
  });
}

function validateForEmailResend(emailId) {
  //GLOBAL_EMAIL
  if (!validateEmail(emailId)) {
    showMessage(0, "Email is either empty or invalid");
    return false;
  }
  return true;
}

function getRequestForEmailResend(emailId, moduleId, sendStatus) {
  var request = {};
  var authentication = {};
  var data = {};
  data["requestKey"] = "EMAIL-RESEND";
  data["email"] = emailId;
  data["sendStatus"] = sendStatus;
  authentication["hash"] = getHash();
  authentication["schoolId"] = SCHOOL_ID;
  authentication["schoolUUID"] = SCHOOL_UUID;
  authentication["userType"] = moduleId;
  request["authentication"] = authentication;
  request["data"] = data;
  return request;
}

function validateRequestForContact(formId) {
  if (
    $("#" + formId + " #countryId")
      .val()
      .trim() == 0 ||
    $("#" + formId + " #countryId").val() == null
  ) {
    showMessage(1, "Country is required");
    return false;
  }
  if (
    $("#" + formId + " #stateId")
      .val()
      .trim() == 0 ||
    $("#" + formId + " #stateId").val() == null
  ) {
    showMessage(1, "State is required");
    return false;
  }
  if (
    $("#" + formId + " #cityId")
      .val()
      .trim() == 0 ||
    $("#" + formId + " #cityId").val() == null
  ) {
    showMessage(1, "City is required");
    return false;
  }
  if (
    $("#" + formId + " #name")
      .val()
      .trim() == ""
  ) {
    showMessage(1, "Name is required");
    return false;
  }

  if (
    !validateEmail(
      $("#" + formId + " #email")
        .val()
        .trim()
    )
  ) {
    showMessage(0, "Email is either empty or invalid");
    return false;
  }
  if (
    $("#" + formId + " #countryCode")
      .val()
      .trim() == 0
  ) {
    showMessage(1, "Country Code is required");
    return false;
  }

  if (
    $("#" + formId + " #contactNumber")
      .val()
      .trim() == 0
  ) {
    showMessage(1, "Contact Number is required");
    return false;
  }
  if (
    $("#" + formId + " #contactDescription")
      .val()
      .trim() == 0
  ) {
    showMessage(1, "Contact Description is required");
    return false;
  }

  if (
    !validateCaptcha(
      $("#" + formId + " #captcha")
        .val()
        .trim()
    )
  ) {
    showMessage(0, "Either captcha is empty or invalid");
    return false;
  }
  return true;
}

function getRequestForContact(formId, moduleId) {
  var request = {};
  var authentication = {};
  var requestData = {};
  var contactUsDTO = {};
  contactUsDTO["countryId"] = $("#" + formId + " #countryId")
    .val()
    .trim();
  contactUsDTO["stateId"] = $("#" + formId + " #stateId")
    .val()
    .trim();
  contactUsDTO["cityId"] = $("#" + formId + " #cityId")
    .val()
    .trim();
  contactUsDTO["name"] = $("#" + formId + " #name")
    .val()
    .trim();
  contactUsDTO["email"] = $("#" + formId + " #email")
    .val()
    .trim();
  contactUsDTO["isdCode"] = $("#" + formId + " #countryCode")
    .val()
    .trim();
  contactUsDTO["contactNumber"] = $("#" + formId + " #contactNumber")
    .val()
    .trim();
  contactUsDTO["contactDescription"] = $("#" + formId + " #contactDescription")
    .val()
    .trim();
  contactUsDTO["captcha"] = $("#" + formId + " #captcha")
    .val()
    .trim();
  requestData["contactUsDTO"] = contactUsDTO;
  authentication["hash"] = getHash();
  authentication["schoolId"] = SCHOOL_ID;
  authentication["schoolUUID"] = SCHOOL_UUID;
  authentication["userType"] = moduleId;
  request["authentication"] = authentication;
  request["requestData"] = requestData;
  console.log("request " + request);
  return request;
}

function callUserContact(formId, moduleId) {
  hideMessage("");
  if (!validateRequestForContact(formId)) {
    return false;
  }
  $("#login").prop("disabled", true);
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: getURLForCommon("contact"),
    data: JSON.stringify(getRequestForContact(formId, moduleId)),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        refreshCaptcha("captchaImage");
        showMessage(1, data["message"]);
      } else {
        //customLoader(true);
        showMessage(0, data["message"]);
        // LOGIC TO DISPLAY DASHBOARD
        // LOGIC TO DISPLAY SIGN-PROCESS
      }
      $("#login").prop("disabled", false);
      return false;
    },
    error: function (e) {
      //showMessage(1, e.responseText);
      $("#login").prop("disabled", false);
    },
  });
}

//disable back button
window.onload = function () {
  if (typeof history.pushState === "function") {
    history.pushState("jibberish", null, null);
    window.onpopstate = function () {
      history.pushState("newjibberish", null, null);
    };
  } else {
    var ignoreHashChange = true;
    window.onhashchange = function () {
      if (!ignoreHashChange) {
        ignoreHashChange = true;
        window.location.hash = Math.random();
      } else {
        ignoreHashChange = false;
      }
    };
  }
};

//upload document function
function getFinalValue(data) {
  // var KEUS = getSecreteKey();
  // AesUtil(KEUS.KEYSIZE, KEUS.ITERATIONS);
  var payload = {};
  // payload['payload']=AesUtil.prototype.encrypt(KEUS.SALT, KEUS.IV, KEUS.PASSPHRASE, data);
  payload["payload"] = encode(JSON.stringify(data));
  console.log("getFinalValue 2" + JSON.stringify(payload));
  return payload;
}
function bindFileUpload(uploadIndex, uploadCategoryId, uploadUserId) {
  var data = {};
  data["uploadCategory"] = uploadCategoryId;
  data["uploadUserId"] = uploadUserId;
  $("#fileupload" + uploadIndex)
    .fileupload({
      formData: { payload: JSON.stringify(getFinalValue(data)) },
      url: BASE_URL + CONTEXT_PATH + SCHOOL_UUID + "/api/upload/" + UNIQUEUUID,
      dataType: "json",
      type: "POST",
      enctype: "multipart/form-data",
      global: false,
      add: function (e, data) {
        var uploadErrors = [];
        var acceptFileTypes = /^image\/(png|jpe?g)$/i;
        var acceptFileTypesPDF = /^application\/pdf$/i;
        var isError = false;
        if (
          data.originalFiles[0]["type"].length &&
          (acceptFileTypes.test(data.originalFiles[0]["type"]) ||
            acceptFileTypesPDF.test(data.originalFiles[0]["type"]))
        ) {
        } else {
          isError = true;
        }
        //            else{
        //
        //	            	if(data.originalFiles[0]['type'].length && !acceptFileTypes.test(data.originalFiles[0]['type'])) {
        //	            		isError = true;
        //	            	}
        //            }
        if (isError) {
          uploadErrors.push(
            "Please upload files in following formats (jpg, jpeg, pdf or png)."
          );
        }
        if (
          data.originalFiles.length &&
          data.originalFiles[0]["size"] > 5242880
        ) {
          uploadErrors.push(MAX_SIZE_LIMIT);
          isError = true;
        }
        if (uploadErrors.length > 0) {
          showMessage(1, uploadErrors.join("\n"));
          return false;
        }
        data.process().done(function () {
          data.submit();
        });
      },
      start: function (e) {
        customLoader(true);
        //			console.log(uploadIndex+' start '+e);
        $("#fileupload" + uploadIndex + "Span").html("");
        $("#fileupload" + uploadIndex + "Progress .progress-bar").css(
          "width",
          0 + "%"
        );
        $("#fileupload" + uploadIndex + "ProgressStatus")
          .removeClass("progress-bar-success")
          .removeClass("progress-bar-danger");
      },
      send: function (e, data) {
        //			console.log(uploadIndex+' send '+e+" = "+data);
        $("#fileupload" + uploadIndex + "Progress .progress-bar").css(
          "width",
          5 + "%"
        );
      },
      done: function (e, data) {
        customLoader(false);
        //			console.log(uploadIndex+' done '+e+" = "+data);
        if (data.result.status == 0 || data.result.status == 3) {
          //				$('#fileupload'+uploadIndex+'Progress .progress-bar').css('width', 100 + '%');
          //DISPLAY MESSAGE FORM SERVER SIDE data.resutl.message
          $("#fileupload" + uploadIndex + "ProgressStatus")
            .removeClass("progress-bar-success")
            .addClass("progress-bar-danger");
          if (
            data.result.message.includes("Your session has been timed out") ||
            data.result.status == 3
          ) {
            redirectLoginPage();
          }
        } else {
          $.each(data.result.uploadFiles, function (index, file) {
            //console.log(uploadIndex+' done'+index+" = "+file+' == '+file.fileName);
            if (file.status == 1) {
              var removeClassName = "";
              if (uploadIndex == 1) {
                removeClassName = "fa fa-user";
              } else if (uploadIndex == 2) {
                removeClassName = "fa fa-calendar";
              } else if (uploadIndex == 3) {
                removeClassName = "fa fa-home";
              } else if (uploadIndex == 4) {
                removeClassName = "fa fa-image";
              } else if (uploadIndex == 5) {
                removeClassName = "fa fa-graduation-cap";
              }
              $("#fileupload" + uploadIndex + "Response").removeClass(
                removeClassName
              );
              $("#fileupload" + uploadIndex + "Response")
                .removeClass("label-error")
                .addClass("fa fa-check-circle green");
              if ($("#fileupload" + uploadIndex + "Span").html() == "") {
                $("#fileupload" + uploadIndex + "Span").html(file.fileName);
              } else {
                $("#fileupload" + uploadIndex + "Span").html(
                  $("#fileupload" + uploadIndex + "Span").html() +
                    "," +
                    file.fileName
                );
              }
              if (uploadIndex == 1) {
                $(".profile-pic").attr("src", FILE_UPLOAD_PATH + file.fileName);
              }
            }
          });
        }
      },
      progressall: function (e, data) {
        //			console.log(uploadIndex+' progressall '+e+" = "+data);
        $("#fileupload" + uploadIndex + "ProgressStatus")
          .removeClass("label-error")
          .addClass("fa fa-check-circle green");
        //var progress = parseInt(data.loaded / data.total * 100, 10);
        $("#fileupload" + uploadIndex + "Progress .progress-bar").css(
          "width",
          100 + "%"
        );
      },
      fail: function (e, data) {
        //			console.log(uploadIndex+' fail '+e+" = "+data);
        //				console.log(uploadIndex+' fail '+index+" = "+file+' == '+file.name);
        //$('#fileupload'+uploadIndex+'Progress .progress-bar').css('width', 100 + '%');
        $("#fileupload" + uploadIndex + "ProgressStatus").addClass(
          "label-error"
        );
        showMessage(1, MAX_SIZE_LIMIT);
      },
    })
    .prop("disabled", !$.support.fileInput)
    .parent()
    .addClass($.support.fileInput ? undefined : "disabled");
}
function bindFileUploadNew(uploadIndex, uploadCategoryId, uploadUserId) {
  var data = {};
  data["uploadCategory"] = uploadCategoryId;
  data["uploadUserId"] = uploadUserId;
  $("#" + uploadIndex)
    .fileupload({
      formData: { payload: JSON.stringify(getFinalValue(data)) },
      url: BASE_URL + CONTEXT_PATH + SCHOOL_UUID + "/api/upload/" + UNIQUEUUID,
      dataType: "json",
      type: "POST",
      enctype: "multipart/form-data",
      global: false,
      add: function (e, data) {
        var uploadErrors = [];
        var acceptFileTypes = /^image\/(png|jpe?g)$/i;
        var acceptFileTypesPDF = /^application\/pdf$/i;
        var isError = false;
        if (
          data.originalFiles[0]["type"].length &&
          (acceptFileTypes.test(data.originalFiles[0]["type"]) ||
            acceptFileTypesPDF.test(data.originalFiles[0]["type"]))
        ) {
        } else {
          isError = true;
        }
        //            else{
        //
        //	            	if(data.originalFiles[0]['type'].length && !acceptFileTypes.test(data.originalFiles[0]['type'])) {
        //	            		isError = true;
        //	            	}
        //            }
        if (isError) {
          uploadErrors.push(
            "Please upload files in following formats (jpg, jpeg, pdf or png)."
          );
        }
        if (
          data.originalFiles.length &&
          data.originalFiles[0]["size"] > 5242880
        ) {
          uploadErrors.push(MAX_SIZE_LIMIT);
          isError = true;
        }
        if (uploadErrors.length > 0) {
          showMessage(1, uploadErrors.join("\n"));
          return false;
        }
        data.process().done(function () {
          data.submit();
        });
      },
      start: function (e) {
        if (signupPage != 0) {
          $("#commonloaderId, #commonloaderBody").show();
        } else {
          customLoader(true);
        }

        $("#" + uploadIndex)
          .parents(".file-tab")
          .find("span.fileName")
          .text();
      },
      send: function (e, data) {
        console.log("send");
      },
      done: function (e, data) {
        if (signupPage != 0) {
          $("#commonloaderId, #commonloaderBody").hide();
        } else {
          customLoader(false);
        }
        console.log("done");
        if (data.result.status == 0 || data.result.status == 3) {
          //$("#"+uploadIndex).parents(".file-tab").find("span.fileName").text();
          if (
            data.result.message.includes("Your session has been timed out") ||
            data.result.status == 3
          ) {
            redirectLoginPage();
          }
        } else {
          $.each(data.result.uploadFiles, function (index, file) {
            if (file.status == 1) {
              console.log("aya");
              console.log("file: " + file);
              $("#" + uploadIndex)
                .parents(".file-tab")
                .find("span.fileName")
                .text(file.fileName);
              console.log(
                $("#" + uploadIndex)
                  .parents(".file-tab")
                  .find("span.fileName")
                  .text(file.fileName)
              );
              //console.log('type'+data.originalFiles[0]['type']);
              if (data.originalFiles[0]["type"] == "application/pdf") {
                $("#" + uploadIndex)
                  .parents(".file-tab")
                  .find("img")
                  .attr("src", PATH_FOLDER_IMAGE + "pdf.jpg");
              }
            }
          });
        }
      },
      progressall: function (e, data) {
        console.log("progressall");
      },
      fail: function (e, data) {
        console.log("fail");
        $("#fileupload" + uploadIndex + "Progress .progress-bar").css(
          "width",
          100 + "%"
        );
        $("#fileupload" + uploadIndex + "ProgressStatus")
          .removeClass("progress-bar-success")
          .addClass("progress-bar-danger");
        showMessage(1, MAX_SIZE_LIMIT);
      },
    })
    .prop("disabled", !$.support.fileInput)
    .parent()
    .addClass($.support.fileInput ? undefined : "disabled");
}
function bindFileUploadNew1(
  uploadIndex,
  uploadCategoryId,
  uploadUserId,
  uploadMethodType,
  skipSession
) {
  var data = {};
  data["uploadCategory"] = uploadCategoryId;
  data["uploadUserId"] = uploadUserId;
  data["skipSession"] = skipSession;
  $("#fileupload" + uploadIndex)
    .fileupload({
      formData: { payload: JSON.stringify(getFinalValue(data)) },
      url: BASE_URL + CONTEXT_PATH + SCHOOL_UUID + "/api/upload/" + UNIQUEUUID,
      dataType: "json",
      type: "POST",
      enctype: "multipart/form-data",
      global: false,
      add: function (e, data) {
        var uploadErrors = [];
        var acceptFileTypes = /^image\/(png|jpe?g)$/i;
        var acceptFileTypesPDF = /^application\/pdf$/i;
        var isError = false;
        if (
          data.originalFiles[0]["type"].length &&
          (acceptFileTypes.test(data.originalFiles[0]["type"]) ||
            acceptFileTypesPDF.test(data.originalFiles[0]["type"]))
        ) {
        } else {
          isError = true;
        }
        if (isError) {
          uploadErrors.push(
            " Please upload files in following formats (jpg, jpeg, pdf or png)."
          );
        }
        if (SCHOOL_ID == 1) {
          if (
            (USER_ROLE != "TEACHER" &&
              data.originalFiles.length &&
              data.originalFiles[0]["size"] > 10276044.8) ||
            (USER_ROLE == "TEACHER" &&
              data.originalFiles.length &&
              data.originalFiles[0]["size"] > 10276044.8)
          ) {
            if (USER_ROLE == "TEACHER") {
              uploadErrors.push(MAX_SIZE_LIMIT_FOR_TEACHER);
            } else {
              uploadErrors.push(MAX_SIZE_LIMIT);
            }
            isError = true;
          }
        } else {
          if (
            (USER_ROLE != "TEACHER" &&
              data.originalFiles.length &&
              data.originalFiles[0]["size"] > 5767168) ||
            (USER_ROLE == "TEACHER" &&
              data.originalFiles.length &&
              data.originalFiles[0]["size"] > 5767168)
          ) {
            if (USER_ROLE == "TEACHER") {
              uploadErrors.push(MAX_SIZE_LIMIT);
            } else {
              uploadErrors.push(MAX_SIZE_LIMIT);
            }
            isError = true;
          }
        }
        if (uploadErrors.length > 0) {
          if (
            "34" == uploadCategoryId ||
            "35" == uploadCategoryId ||
            "36" == uploadCategoryId ||
            "37" == uploadCategoryId ||
            "38" == uploadCategoryId
          ) {
            showMessageErrorNew(
              true,
              uploadErrors.join("\n"),
              "evaluationDocsError"
            );
            return false;
          } else {
            if (tt == "theme1") {
              showMessage(0, uploadErrors.join("\n"), "", false);
              setTimeout(function () {
                $("#fileupload" + uploadIndex + "Span").html(
                  "No file Selected"
                );
              }, 1000);
              return false;
            } else {
              showMessageTheme2(0, uploadErrors.join("\n"), "", false);
              setTimeout(function () {
                $("#fileupload" + uploadIndex + "Span").html(
                  "No file Selected"
                );
              }, 1000);
              return false;
            }
          }
        }
        data.process().done(function () {
          data.submit();
        });
      },
      start: function (e) {
        if (signupPage != 0) {
          $("#commonloaderId, #commonloaderBody").show();
        } else {
          customLoader(true);
        }
        if (uploadMethodType == 1) {
          $("#fileupload" + uploadIndex + "Span").html("");
          $("#fileupload" + uploadIndex + "Progress .progress-bar").css(
            "width",
            0 + "%"
          );
          $("#fileupload" + uploadIndex + "ProgressStatus")
            .removeClass("progress-bar-success")
            .removeClass("progress-bar-danger");
        } else if (uploadMethodType == 2) {
          $("#fileupload" + uploadIndex)
            .parents(".file-tab")
            .find("span.fileName")
            .text();
          if (
            "34" == uploadCategoryId ||
            "35" == uploadCategoryId ||
            "36" == uploadCategoryId ||
            "37" == uploadCategoryId ||
            "38" == uploadCategoryId
          ) {
            if ("34" == uploadCategoryId) {
              hideMessageErrorNew("fileupload1Error");
              showMessageErrorNew(false, "", "fileupload1Error");
            } else if ("35" == uploadCategoryId) {
              hideMessageErrorNew("fileupload2Error");
              showMessageErrorNew(false, "", "fileupload2Error");
            } else if ("36" == uploadCategoryId) {
              showMessageErrorNew(false, "", "fileupload3Error");
            } else if ("37" == uploadCategoryId) {
              showMessageErrorNew(false, "", "fileupload4Error");
            } else if ("38" == uploadCategoryId) {
              showMessageErrorNew(false, "", "fileupload5Error");
            }
          }
        } else if (uploadMethodType == 3) {
          $("#fileupload" + uploadIndex)
            .parents(".file-tab")
            .find("span.fileName")
            .text();
          $("#fileupload" + uploadIndex)
            .parent("span")
            .parent("p")
            .parent("div")
            .find("i")
            .removeClass("fa-check-circle-o");
          $("#fileupload" + uploadIndex)
            .parent("span")
            .parent("p")
            .parent("div")
            .find("i")
            .removeClass("fa-close");
        } else if (uploadMethodType == 4) {
        }
      },
      send: function (e, data) {
        console.log("send");
        if (uploadMethodType == 1) {
          $("#fileupload" + uploadIndex + "Progress .progress-bar").css(
            "width",
            5 + "%"
          );
        } else if (uploadMethodType == 2) {
        } else if (uploadMethodType == 3) {
        } else if (uploadMethodType == 4) {
        }
      },
      done: function (e, data) {
        uploadDone = true;
        if (signupPage != 0) {
          $("#commonloaderId, #commonloaderBody").hide();
        } else {
          customLoader(false);
        }
        console.log("done");
        if (data.result.status == 0 || data.result.status == 3) {
          if (uploadMethodType == 1) {
            $("#fileupload" + uploadIndex + "Progress .progress-bar").css(
              "width",
              100 + "%"
            );
            $("#fileupload" + uploadIndex + "ProgressStatus")
              .removeClass("progress-bar-success")
              .addClass("progress-bar-danger");
          } else if (uploadMethodType == 2) {
            $("#fileupload" + uploadIndex)
              .parents(".file-tab")
              .find("span.fileName")
              .text();
          } else if (uploadMethodType == 3) {
            $("#fileupload" + uploadIndex)
              .parent("span")
              .parent("p")
              .parent("div")
              .find("i")
              .removeClass("fa-check-circle-o");
            $("#fileupload" + uploadIndex)
              .parent("span")
              .parent("p")
              .parent("div")
              .find("i")
              .removeClass("fa-close");
            $("#fileupload" + uploadIndex)
              .parent("span")
              .parent("p")
              .parent("div")
              .find("i")
              .addClass("fa fa-close");
            $("#fileupload" + uploadIndex)
              .parent("span")
              .parent("p")
              .parent("div")
              .find("h1")
              .attr("style", "color:red");
            $("#fileupload" + uploadIndex)
              .parent("span")
              .parent("p")
              .parent("div")
              .find("span.fileName")
              .html("");
            $("#fileupload" + uploadIndex)
              .parent("span")
              .parent("p")
              .find("a.view")
              .next("a.remove")
              .attr("style", "display:none;");
            $("#fileupload" + uploadIndex)
              .parent("span")
              .parent("p")
              .find("a.view")
              .attr("style", "display:none;");
          } else if (uploadMethodType == 4) {
            $("#fileName" + uploadIndex).html("");
            $("#divdeleteDocument" + uploadIndex).attr(
              "style",
              "display:none;"
            );
            $("#divshowDocument" + uploadIndex).attr("style", "display:none;");
          }
          showMessageTheme2(0, data.result.message, "", true);
          if (
            data.result.message.includes("Your session has been timed out") ||
            data.result.status == 3
          ) {
            redirectLoginPage();
          }
        } else {
          $.each(data.result.uploadFiles, function (index, file) {
            if (file.status == 1) {
              console.log("file: " + file);
              if (uploadMethodType == 1) {
                var removeClassName = "";
                if (uploadIndex == 1) {
                  removeClassName = "fa fa-user";
                } else if (uploadIndex == 2) {
                  removeClassName = "fa fa-calendar";
                } else if (uploadIndex == 3) {
                  removeClassName = "fa fa-home";
                } else if (uploadIndex == 4) {
                  removeClassName = "fa fa-image";
                } else if (uploadIndex == 5) {
                  removeClassName = "fa fa-graduation-cap";
                }
                $("#fileupload" + uploadIndex + "Response").removeClass(
                  removeClassName
                );
                $("#fileupload" + uploadIndex + "Response")
                  .removeClass("label-error")
                  .addClass("fa fa-check-circle green");
                if ($("#fileupload" + uploadIndex + "Span").html() == "") {
                  $("#fileupload" + uploadIndex + "Span").html(file.fileName);
                } else {
                  $("#fileupload" + uploadIndex + "Span").html(
                    $("#fileupload" + uploadIndex + "Span").html() +
                      "," +
                      file.fileName
                  );
                }
                if (uploadIndex == 1) {
                  $(".profile-pic").attr(
                    "src",
                    FILE_UPLOAD_PATH + file.fileName
                  );
                  $("#dropDownProfileImage").attr(
                    "src",
                    FILE_UPLOAD_PATH + file.fileName
                  );
                  $("#topProfileImage").attr(
                    "src",
                    FILE_UPLOAD_PATH + file.fileName
                  );
                }
              } else if (uploadMethodType == 2) {
                hideMessageErrorNew("evaluationDocsError");
                console.log(
                  $("#fileupload" + uploadIndex)
                    .parents(".file-tab")
                    .find("span.fileName")
                    .text(file.fileName)
                );
                $("#evluationATTachement" + uploadIndex).val(file.fileName);
                if (data.originalFiles[0]["type"] == "application/pdf") {
                  $("#fileupload" + uploadIndex)
                    .parents(".file-tab")
                    .find("img")
                    .attr("src", FILE_UPLOAD_PATH + file.fileName + "pdf.jpg");
                  $(".pdf" + uploadIndex + " .stu-view" + uploadIndex).attr(
                    "href",
                    FILE_UPLOAD_PATH + file.fileName
                  );
                  $(".pdf" + uploadIndex).attr("title", file.fileName);
                  $(".other-img" + uploadIndex).css({ display: "none" });
                  $(
                    ".pdf" + uploadIndex + ", .delete-upload" + uploadIndex
                  ).css({ display: "inline-block" });
                  validateElement(
                    "evalualionFormRequest",
                    "fileupload" + uploadIndex,
                    "fileupload" + uploadIndex + "Error"
                  );
                } else {
                  $("#fileupload" + uploadIndex)
                    .parents(".file-tab")
                    .find("span.fileName")
                    .text(file.fileName);
                  $(
                    ".other-img" + uploadIndex + " .stu-view" + uploadIndex
                  ).attr(
                    "href",
                    'javascript:showDocument("' +
                      FILE_UPLOAD_PATH +
                      file.fileName +
                      '");'
                  );
                  $(".other-img" + uploadIndex).attr("title", file.fileName);
                  $(".pdf" + uploadIndex).css({ display: "none" });
                  $(
                    ".other-img" +
                      uploadIndex +
                      ", .delete-upload" +
                      uploadIndex
                  ).css({ display: "inline-block" });
                  validateElement(
                    "evalualionFormRequest",
                    "fileupload" + uploadIndex,
                    "fileupload" + uploadIndex + "Error"
                  );
                }
              } else if (uploadMethodType == 3) {
                $("#fileupload" + uploadIndex + "img").attr(
                  "fileName",
                  file.fileName
                );
                $("#fileupload" + uploadIndex + "img").attr(
                  "href",
                  'javascript:removeDocument("' +
                    uploadIndex +
                    '","' +
                    uploadMethodType +
                    '");'
                );
                if (data.originalFiles[0]["type"] == "application/pdf") {
                  $("#fileupload" + uploadIndex + "img").addClass("full mt-1");
                  $("#fileupload" + uploadIndex + "img").attr(
                    "target",
                    "_blank"
                  );
                  $("#fileupload" + uploadIndex + "img").attr(
                    "href",
                    FILE_UPLOAD_PATH + file.fileName
                  );
                  setTimeout(function () {
                    $("#fileupload" + uploadIndex + "imgIcon").attr(
                      "src",
                      PATH_FOLDER_IMAGE2 + "pdf.jpg"
                    );
                  }, 3000);
                  console.log("PATH_FOLDER_IMAGE2 : " + PATH_FOLDER_IMAGE2);
                } else {
                  $("#fileupload" + uploadIndex + "img").addClass("full mt-1");
                  $("#fileupload" + uploadIndex + "img").attr(
                    "target",
                    "_self"
                  );
                  $("#fileupload" + uploadIndex + "img").attr(
                    "href",
                    'javascript:showDocument("' +
                      FILE_UPLOAD_PATH +
                      file.fileName +
                      '");'
                  );
                  setTimeout(function () {
                    $("#fileupload" + uploadIndex + "imgIcon").attr(
                      "src",
                      FILE_UPLOAD_PATH + file.fileName
                    );
                  }, 3000);
                }
                if (
                  "2" == uploadCategoryId ||
                  "3" == uploadCategoryId ||
                  "4" == uploadCategoryId ||
                  "14" == uploadCategoryId ||
                  "15" == uploadCategoryId ||
                  "16" == uploadCategoryId ||
                  "17" == uploadCategoryId
                ) {
                  if (
                    data.result.userRole == "" ||
                    data.result.userRole == "STUDENT"
                  ) {
                    $("#fileupload" + uploadIndex + "div").hide();
                  }
                } else {
                  $("#fileupload" + uploadIndex + "div").hide();
                }
              } else if (uploadMethodType == 4) {
                $("#fileName" + uploadIndex).html(file.fileName);
                $("#fileupload" + uploadIndex + "Span").html(file.fileName);
                $("#deleteDocument" + uploadIndex).attr(
                  "href",
                  'javascript:removeDocument("' +
                    uploadIndex +
                    '","' +
                    uploadMethodType +
                    '");'
                );
                //							$('#deleteDocument'+uploadIndex).attr('style','display:block;');
                //							$('#showDocument'+uploadIndex).attr('style','display:block;');
                $("#divdeleteDocument" + uploadIndex).attr(
                  "style",
                  "display:block;"
                );
                $("#divshowDocument" + uploadIndex).attr(
                  "style",
                  "display:block;"
                );
                if (data.originalFiles[0]["type"] == "application/pdf") {
                  $("#showDocument" + uploadIndex).attr("target", "_blank");
                  $("#showDocument" + uploadIndex).attr(
                    "href",
                    FILE_UPLOAD_PATH + file.fileName
                  );
                } else {
                  $("#showDocument" + uploadIndex).attr("target", "_self");
                  $("#showDocument" + uploadIndex).attr(
                    "href",
                    'javascript:showDocument("' +
                      FILE_UPLOAD_PATH +
                      file.fileName +
                      '");'
                  );
                }
              }
              if (
                "34" == uploadCategoryId ||
                "35" == uploadCategoryId ||
                "36" == uploadCategoryId ||
                "37" == uploadCategoryId ||
                "38" == uploadCategoryId
              ) {
                setTimeout(function () {
                  if ("34" == uploadCategoryId) {
                    hideMessageErrorNew("fileupload1Error");
                    showMessageErrorNew(
                      false,
                      " Document uploaded successfully.",
                      "fileupload1Error"
                    );
                  } else if ("35" == uploadCategoryId) {
                    hideMessageErrorNew("fileupload2Error");
                    showMessageErrorNew(
                      false,
                      " Document uploaded successfully.",
                      "fileupload2Error"
                    );
                  } else if ("36" == uploadCategoryId) {
                    showMessageErrorNew(
                      false,
                      " Document uploaded successfully.",
                      "fileupload3Error"
                    );
                  } else if ("37" == uploadCategoryId) {
                    showMessageErrorNew(
                      false,
                      " Document uploaded successfully.",
                      "fileupload4Error"
                    );
                  } else if ("38" == uploadCategoryId) {
                    showMessageErrorNew(
                      false,
                      " Document uploaded successfully.",
                      "fileupload5Error"
                    );
                  }
                }, 500);
              } else {
                if (tt == "theme1") {
                  showMessage(1, " Document uploaded successfully.", "", true);
                } else {
                  showMessageTheme2(
                    1,
                    " Document uploaded successfully.",
                    "",
                    true
                  );
                }
              }
            }
          });
        }
      },
      progressall: function (e, data) {
        console.log("progressall");
        if (uploadMethodType == 1) {
          $("#fileupload" + uploadIndex + "ProgressStatus")
            .removeClass("label-error")
            .addClass("fa fa-check-circle green");
          //var progress = parseInt(data.loaded / data.total * 100, 10);
          $("#fileupload" + uploadIndex + "Progress .progress-bar").css(
            "width",
            100 + "%"
          );
        } else if (uploadMethodType == 2) {
        } else if (uploadMethodType == 3) {
        } else if (uploadMethodType == 4) {
        }
      },
      fail: function (e, data) {
        console.log("fail");
        if (signupPage != 0) {
          $("#commonloaderId, #commonloaderBody").hide();
        } else {
          customLoader(false);
        }
        //			console.log(uploadIndex+' fail '+e+" = "+data);
        //			console.log(uploadIndex+' fail '+index+" = "+file+' == '+file.name);
        if (uploadMethodType == 1) {
          //$('#fileupload'+uploadIndex+'Progress .progress-bar').css('width', 100 + '%');
          $("#fileupload" + uploadIndex + "ProgressStatus").addClass(
            "label-error"
          );
          showMessageTheme2(0, MAX_SIZE_LIMIT, "", false);
        } else if (uploadMethodType == 2) {
          $("#fileupload" + uploadIndex + "Progress .progress-bar").css(
            "width",
            100 + "%"
          );
          $("#fileupload" + uploadIndex + "ProgressStatus")
            .removeClass("progress-bar-success")
            .addClass("progress-bar-danger");
        } else if (uploadMethodType == 3) {
          $("#fileupload" + uploadIndex)
            .parent("span")
            .parent("p")
            .parent("div")
            .find("i")
            .addClass("fa fa-close");
          $("#fileupload" + uploadIndex)
            .parent("span")
            .parent("p")
            .parent("div")
            .find("h1")
            .attr("style", "color:red");
          $("#fileupload" + uploadIndex)
            .parent("span")
            .parent("p")
            .parent("div")
            .find("span.fileName")
            .html("");
          $("#fileupload" + uploadIndex)
            .parent("span")
            .parent("p")
            .find("a.view")
            .next("a.remove")
            .attr("style", "display:none;");
          $("#fileupload" + uploadIndex)
            .parent("span")
            .parent("p")
            .find("a.view")
            .attr("style", "display:none;");
        }
        if (tt == "theme2") {
          showMessage(2, MAX_SIZE_LIMIT, "", false);
        } else {
          showMessageTheme2(2, MAX_SIZE_LIMIT, "", false);
        }
        showMessageTheme2(2, MAX_SIZE_LIMIT, "", false);
      },
    })
    .prop("disabled", !$.support.fileInput)
    .parent()
    .addClass($.support.fileInput ? undefined : "disabled");
}
function bindFileUploadForCSV(uploadIndex, uploadStudentId, uploadStandardId) {
  var data = {};
  data["uploadStudentId"] = uploadStudentId;
  data["uploadStandardId"] = uploadStandardId;
  $("#fileupload" + uploadIndex)
    .fileupload({
      formData: { payload: JSON.stringify(getFinalValue(data)) },
      url:
        BASE_URL + CONTEXT_PATH + SCHOOL_UUID + "/api/upload-csv/" + UNIQUEUUID,
      dataType: "json",
      type: "POST",
      enctype: "multipart/form-data",
      global: false,
      add: function (e, data) {
        var uploadErrors = [];
        //application/vnd.ms-excel - text/csv
        var acceptFileTypesApplication = /^application\/vnd.ms-excel$/i;
        var acceptFileTypesText = /^text\/csv$/i;
        var isError = false;
        console.log(
          "bindFileUploadForCSV type: " + data.originalFiles[0]["type"]
        );
        if (
          data.originalFiles[0]["type"].length &&
          (acceptFileTypesApplication.test(data.originalFiles[0]["type"]) ||
            acceptFileTypesText.test(data.originalFiles[0]["type"]))
        ) {
        } else {
          isError = true;
        }
        if (isError) {
          uploadErrors.push("Please upload files in following formats csv.");
        }
        if (
          data.originalFiles.length &&
          data.originalFiles[0]["size"] > 10485760
        ) {
          uploadErrors.push("Please upload maximum 10MB file in size.");
          isError = true;
        }
        if (uploadErrors.length > 0) {
          showMessage(1, uploadErrors.join("\n"));
          return false;
        }
        data.process().done(function () {
          data.submit();
        });
      },
      start: function (e) {
        customLoader(false);
        $("#fileupload" + uploadIndex + "Span").html("");
        $("#fileupload" + uploadIndex + "Progress .progress-bar").css(
          "width",
          0 + "%"
        );
        $("#fileupload" + uploadIndex + "ProgressStatus")
          .removeClass("progress-bar-success")
          .removeClass("progress-bar-danger");
      },
      send: function (e, data) {
        $("#fileupload" + uploadIndex + "Progress .progress-bar").css(
          "width",
          5 + "%"
        );
      },
      done: function (e, data) {
        customLoader(false);
        if (data.result.status == 0) {
          $("#fileupload" + uploadIndex + "ProgressStatus")
            .removeClass("progress-bar-success")
            .addClass("progress-bar-danger");
        } else {
          $.each(data.result.uploadFiles, function (index, file) {
            if (file.status == 1) {
              var removeClassName = "";
              $("#fileupload" + uploadIndex + "ChoosenFile").html(
                file.fileName
              );
              $("#fileupload" + uploadIndex + "Hash").val(file.hash);
              fileupload1Hash;
              $("#fileupload" + uploadIndex + "Response").removeClass(
                removeClassName
              );
              $("#fileupload" + uploadIndex + "Response")
                .removeClass("label-error")
                .addClass("fa fa-check-circle green");
              if ($("#fileupload" + uploadIndex + "Span").html() == "") {
                $("#fileupload" + uploadIndex + "Span").html(file.fileName);
              } else {
                $("#fileupload" + uploadIndex + "Span").html(
                  $("#fileupload" + uploadIndex + "Span").html() +
                    "," +
                    file.fileName
                );
              }
            }
          });
        }
      },
      progressall: function (e, data) {
        $("#fileupload" + uploadIndex + "ProgressStatus")
          .removeClass("label-error")
          .addClass("fa fa-check-circle green");
        //var progress = parseInt(data.loaded / data.total * 100, 10);
        $("#fileupload" + uploadIndex + "Progress .progress-bar").css(
          "width",
          100 + "%"
        );
      },
      fail: function (e, data) {
        $("#fileupload" + uploadIndex + "ProgressStatus").addClass(
          "label-error"
        );
        showMessage(1, MAX_SIZE_LIMIT);
      },
    })
    .prop("disabled", !$.support.fileInput)
    .parent()
    .addClass($.support.fileInput ? undefined : "disabled");
}
function bindFileUploadForPDF(uploadIndex, uploadUserId) {
  var data = {};
  data["uploadUserId"] = uploadUserId;
  $("#fileupload" + uploadIndex)
    .fileupload({
      formData: { payload: JSON.stringify(getFinalValue(data)) },
      url: BASE_URL + CONTEXT_PATH + SCHOOL_UUID + "/api/upload/" + UNIQUEUUID,
      dataType: "json",
      type: "POST",
      enctype: "multipart/form-data",
      global: false,
      add: function (e, data) {
        var uploadErrors = [];
        var acceptFileTypesPDF = /^application\/pdf$/i;
        var isError = false;
        if (
          data.originalFiles[0]["type"].length &&
          acceptFileTypesPDF.test(data.originalFiles[0]["type"])
        ) {
        } else {
          isError = true;
        }
        if (isError) {
          uploadErrors.push("Please upload files in pdf format.");
        }
        console.log("originalFiles size" + data.originalFiles[0]["size"]);
        if (
          data.originalFiles.length &&
          data.originalFiles[0]["size"] > 5242880
        ) {
          uploadErrors.push(MAX_SIZE_LIMIT);
          isError = true;
        }
        if (uploadErrors.length > 0) {
          isError = true;
          showMessage(1, uploadErrors.join("\n"));
          return false;
        }
        data.process().done(function () {
          data.submit();
        });
      },
      start: function (e) {
        customLoader(true);
        $("#fileupload" + uploadIndex + "Span").html("");
        $("#fileupload" + uploadIndex + "Progress .progress-bar").css(
          "width",
          0 + "%"
        );
        $("#fileupload" + uploadIndex + "ProgressStatus")
          .removeClass("progress-bar-success")
          .removeClass("progress-bar-danger");
      },
      send: function (e, data) {
        $("#fileupload" + uploadIndex + "Progress .progress-bar").css(
          "width",
          5 + "%"
        );
      },
      done: function (e, data) {
        customLoader(true);
        if (data.result.status == 0 || data.result.status == 3) {
          $("#fileupload" + uploadIndex + "ProgressStatus")
            .removeClass("progress-bar-success")
            .addClass("progress-bar-danger");
          if (
            data.result.message.includes("Your session has been timed out") ||
            data.result.status == 3
          ) {
            redirectLoginPage();
          }
        } else {
          $.each(data.result.uploadFiles, function (index, file) {
            if (file.status == 1) {
              var removeClassName = "";
              $("#fileupload" + uploadIndex + "ChoosenFile").html(
                file.fileName
              );
              $("#fileupload" + uploadIndex + "Hash").val(file.hash);
              //						fileupload1Hash
              $("#fileupload" + uploadIndex + "Response").removeClass(
                removeClassName
              );
              $("#fileupload" + uploadIndex + "Response")
                .removeClass("label-error")
                .addClass("fa fa-check-circle green");
              if ($("#fileupload" + uploadIndex + "Span").html() == "") {
                $("#fileupload" + uploadIndex + "Span").html(file.fileName);
              } else {
                $("#fileupload" + uploadIndex + "Span").html(
                  $("#fileupload" + uploadIndex + "Span").html() +
                    "," +
                    file.fileName
                );
              }
            }
          });
        }
      },
      progressall: function (e, data) {
        $("#fileupload" + uploadIndex + "ProgressStatus")
          .removeClass("label-error")
          .addClass("fa fa-check-circle green");
        //var progress = parseInt(data.loaded / data.total * 100, 10);
        $("#fileupload" + uploadIndex + "Progress .progress-bar").css(
          "width",
          100 + "%"
        );
      },
      fail: function (e, data) {
        $("#fileupload" + uploadIndex + "ProgressStatus").addClass(
          "label-error"
        );
        showMessage(1, MAX_SIZE_LIMIT);
      },
    })
    .prop("disabled", !$.support.fileInput)
    .parent()
    .addClass($.support.fileInput ? undefined : "disabled");
}

function removeDocument(uploadIndex, uploadMethodType) {
  console.log(uploadIndex);
  if (uploadMethodType == 1) {
  } else if (uploadMethodType == 2) {
    $("#fileupload" + uploadIndex)
      .parent("span")
      .parent("div")
      .find(".view-upload")
      .hide();
    $("#fileupload" + uploadIndex)
      .parent("span")
      .parent("div")
      .find(".delete-upload")
      .hide();
    $("#fileupload" + uploadIndex)
      .parent("span")
      .parent("div")
      .find(".error-msg")
      .removeClass("show-errow-msg");
    $("#fileupload" + uploadIndex)
      .parent("span")
      .parent("div")
      .find(".error-msg")
      .addClass("show-errow-msg")
      .html("Document Deleted Successfuly");
    setTimeout(function () {
      $("#fileupload" + uploadIndex)
        .parent("span")
        .parent("div")
        .find(".error-msg")
        .html("");
    }, 1500);
    $("#fileupload" + uploadIndex)
      .parent("span")
      .parent("div")
      .find("a.view")
      .attr("href", "javascript:void(0)");
    $("#fileupload" + uploadIndex).addClass("w100");
    console.log(
      "delete docs" +
        $("#fileupload" + uploadIndex)
          .parent("span")
          .parent("div")
          .find("a.view")
          .attr("href", "javascript:void(0)")
    );
  } else if (uploadMethodType == 3) {
    $("#fileupload" + uploadIndex)
      .parent("span")
      .parent("p")
      .find("a.view")
      .hide();
    $("#fileupload" + uploadIndex)
      .parent("span")
      .parent("p")
      .find("a.view")
      .next("a.remove")
      .hide();
    $("#fileupload" + uploadIndex)
      .parent("span")
      .parent("p")
      .parent("div")
      .find("span.fileName")
      .html("");
    $("#fileupload" + uploadIndex)
      .parent("span")
      .parent("p")
      .parent("div")
      .find("i")
      .removeClass("fa-check-circle-o");
    $("#fileupload" + uploadIndex)
      .parent("span")
      .parent("p")
      .parent("div")
      .find("i")
      .removeClass("fa-close");
    $("#fileupload" + uploadIndex)
      .parent("span")
      .parent("p")
      .parent("div")
      .find("h1")
      .removeAttr("style");
    $("#fileupload" + uploadIndex)
      .parent("span")
      .parent("p")
      .parent("div")
      .find("a.view")
      .attr("href", "");
    $("#fileupload" + uploadIndex)
      .parent("span")
      .parent("p")
      .parent("div")
      .find("a.remove")
      .attr("href", "");
    console.log(
      "delete docs" +
        $("#fileupload" + uploadIndex)
          .parent("span")
          .parent("p")
          .parent("div")
          .find("a.remove")
          .attr("href", "")
    );
  } else if (uploadMethodType == 4) {
    $("#fileName" + uploadIndex).html("");
    $("#divdeleteDocument" + uploadIndex).attr("style", "display:none;");
    $("#divshowDocument" + uploadIndex).attr("style", "display:none;");
  }
}
//convert serialize object to json
function getJSONRequest(formId, isMulitSelect) {
  $(".disabledFields").each(function () {
    $(this).removeAttr("disabled");
  });
  var serializedString = $("#" + formId).serialize();
  console.log("serializedString " + serializedString);
  $(".disabledFields").each(function () {
    $(this).attr("disabled", "disabled");
  });
  serializedString = serializedString.replace(/\+/g, "%20");
  var formFieldArray = serializedString.split("&");
  var requestObj = {};
  $.each(formFieldArray, function (i, pair) {
    var nameValue = pair.split("=");
    if (nameValue[1] != "") {
      var name = nameValue[0];
      var value = escapeCharacters(nameValue[1]);
      console.log("name " + name);
      console.log(" value " + value);
      console.log("original Value " + nameValue[1]);
      requestObj[name] = value;
    }
  });
  //	$.each(formFieldArray, function(i, pair) {
  //		var nameValue = pair.split("=");
  //		if(nameValue[1]!=''){
  //			var name = decodeURIComponent(nameValue[0]);
  //			var value = decodeURIComponent(nameValue[1]);
  //			requestObj[name] = value;
  //		}
  //	});
  if (isMulitSelect != undefined) {
    var name = decodeURIComponent("teacherSubjectIds");
    if (
      $("#teacherSubjectIds").val().trim() != "null" &&
      $("#teacherSubjectIds").val().trim() != null &&
      $("#teacherSubjectIds").val().trim() != ""
    ) {
      var value = decodeURIComponent($("#teacherSubjectIds").val().trim());
    }
    requestObj[name] = value;

    var name1 = decodeURIComponent("teacherPlacementSubjectIds");
    if (
      $("#teacherPlacementSubjectIds").val().trim() != "null" &&
      $("#teacherPlacementSubjectIds").val().trim() != null &&
      $("#teacherPlacementSubjectIds").val().trim() != ""
    ) {
      var value1 = decodeURIComponent(
        $("#teacherPlacementSubjectIds").val().trim()
      );
    }
    requestObj[name1] = value1;
  }
  console.log("requestObj " + requestObj);
  return requestObj;
}
function callSubjectsByGradeId(
  formId,
  value,
  elementId,
  toElementId,
  requestExtra,
  requestExtra1,
  requestExtra2
) {
  hideMessage("");
  //	if (!validateRequestForMasterGrade(formId, elementId)) {
  //		$("#"+formId+" #"+elementId).val().trim(0);
  //		return false;
  //	}
  //$("#"+formId+" #pastTaughtSubjectId").prop("disabled", true);
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: getURLForCommon("masters"),
    data: JSON.stringify(
      getRequestForMaster(
        formId,
        "SUBJECT-LIST-BY-GRADE",
        value,
        requestExtra,
        requestExtra1,
        requestExtra2
      )
    ),
    dataType: "json",
    cache: false,
    timeout: 600000,
    async: false,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        showMessage(1, data["message"]);
      } else {
        buildDropdown(
          data["mastersData"]["subject"],
          $("#" + formId + " #" + toElementId),
          "Select course"
        );
        //$("#"+formId+" #pastTaughtSubjectId").prop("disabled", false);
      }
      //$("#"+formId+" #pastTaughtSubjectId").prop("disabled", false);
    },
    error: function (e) {
      console.log(e);
      //	showMessage(1, e.responseText);
      //$("#"+formId+" #pastTaughtSubjectId").prop("disabled", false);
    },
  });
}

//function callPlacementSubjectsByGradeId(formId, value, elementId, toElementId, requestExtra) {
//	hideMessage('');
//	resetDropdown($("#"+formId+" #"+toElementId), 'Select course');
//	if (!validateRequestForMasterGrade(formId, elementId)) {
//		$("#"+formId+" #"+elementId).val(0);
//		//resetDropdown($("#"+formId+" #"+elementId), 'Select course');
//		return false;
//	}
//	$("#"+formId+" #pastTaughtSubjectId").prop("disabled", true);
//	$.ajax({
//		type : "POST",
//		contentType : "application/json",
//		url : getURLForCommon('masters'),
//		data : JSON.stringify(getRequestForMaster(formId, 'PLACEMENT-SUBJECT-LIST-BY-GRADE', value, requestExtra)),
//		dataType : 'json',
//		cache : false,
//		timeout : 600000,
//		async: false,
//		success : function(data) {
//			if (data['status'] == '0' || data['status'] == '2') {
//				showMessage(1, data['message']);
//			} else {
//				buildDropdown(data['mastersData']['subject'], $("#"+formId+" #"+toElementId), 'Select course');
//				$("#"+formId+" #pastTaughtSubjectId").prop("disabled", false);
//			}
//			$("#"+formId+" #pastTaughtSubjectId").prop("disabled", false);
//		},
//		error : function(e) {
//		//	showMessage(1, e.responseText);
//			$("#"+formId+" #pastTaughtSubjectId").prop("disabled", false);
//		}
//	});
//}

function callBothSubjectAndPlacementSubjectsByGrade(
  formId,
  value,
  elementId,
  toElementId,
  requestExtra1,
  requestExtra2
) {
  hideMessage("");
  resetDropdown($("#" + formId + " #" + toElementId), "Select course");
  if (!validateRequestForMasterGrade(formId, elementId)) {
    $("#" + formId + " #" + elementId)
      .val()
      .trim(0);
    //resetDropdown($("#"+formId+" #"+elementId), 'Select course');
    return false;
  }

  console.log("Subject Id : " + requestExtra1);
  console.log("Placement Subject Id : " + requestExtra2);
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: getURLForCommon("masters"),
    data: JSON.stringify(
      getRequestForMaster(
        formId,
        "BOTH-SUBJECT-AND-PLACEMENT-SUBJECT",
        value,
        requestExtra1,
        requestExtra2
      )
    ),
    dataType: "json",
    cache: false,
    timeout: 600000,
    async: false,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        showMessage(1, data["message"]);
      } else {
        console.log("Response Data  " + data);
        $("#" + formId + " #" + toElementId).html(
          '<option value="">Select Course</option>'
        );
        $.each(data["mastersData"]["subject"], function (k, v) {
          $("#" + formId + " #" + toElementId).append(
            '<option courseType="' +
              v.extra +
              '" value="' +
              v.key +
              '">' +
              v.value +
              "</option>"
          );
        });
      }
    },
    error: function (e) {
      //	showMessage(1, e.responseText);
      $("#" + formId + " #pastTaughtSubjectId").prop("disabled", false);
    },
  });
}

function callTeacherSubjectsByGradeId(
  formId,
  value,
  elementId,
  toElementId,
  requestExtra
) {
  hideMessage("");
  resetDropdown($("#" + formId + " #" + toElementId), "Select course");
  if (!validateRequestForMasterGrade(formId, elementId)) {
    $("#" + formId + " #" + elementId)
      .val()
      .trim(0);
    //resetDropdown($("#"+formId+" #"+elementId), 'Select course');
    return false;
  }
  $("#" + formId + " #pastTaughtSubjectId").prop("disabled", true);
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: getURLForCommon("masters"),
    data: JSON.stringify(
      getRequestForMaster(
        formId,
        "TEACHER_SUBJECT-LIST-BY-GRADE",
        value,
        requestExtra
      )
    ),
    dataType: "json",
    cache: false,
    timeout: 600000,
    async: false,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        showMessage(1, data["message"]);
      } else {
        buildDropdown(
          data["mastersData"]["teacherSubject"],
          $("#" + formId + " #" + toElementId),
          "Select course"
        );
        $("#" + formId + " #pastTaughtSubjectId").prop("disabled", false);
      }
      $("#" + formId + " #pastTaughtSubjectId").prop("disabled", false);
    },
    error: function (e) {
      //showMessage(1, e.responseText);
      $("#" + formId + " #pastTaughtSubjectId").prop("disabled", false);
    },
  });
}
function callTeacherTaughtSubjects(formId, value, elementId, flag) {
  hideMessage("");
  $.ajax({
    global: flag,
    type: "POST",
    url: getURLForHTML("dashboard", "teacher-subject-List"),
    data: "value=" + value + "&elementId=" + elementId,
    dataType: "html",
    cache: false,
    timeout: 600000,
    success: function (htmlContent) {
      if (htmlContent != "") {
        var stringMessage = [];
        stringMessage = htmlContent.split("|");
        if (
          stringMessage[0] == "FAILED" ||
          stringMessage[0] == "EXCEPTION" ||
          stringMessage[0] == "SESSIONOUT"
        ) {
          showMessage(1, stringMessage[1]);
        } else {
          $("#teacherTaughtSubjectContent").html(htmlContent);
        }
        //return false;
      }
    },
    error: function (e) {
      //showMessage(1, e.responseText);
      return false;
    },
  });
}
function callTeacherPreferredSubjects(formId, value, elementId, flag) {
  hideMessage("");
  $.ajax({
    global: flag,
    type: "POST",
    url: getURLForHTML("dashboard", "teacher-preferred-subject-List"),
    data: "value=" + value + "&elementId=" + elementId,
    dataType: "html",
    cache: false,
    timeout: 600000,
    success: function (htmlContent) {
      if (htmlContent != "") {
        var stringMessage = [];
        stringMessage = htmlContent.split("|");
        if (
          stringMessage[0] == "FAILED" ||
          stringMessage[0] == "EXCEPTION" ||
          stringMessage[0] == "SESSIONOUT"
        ) {
          showMessage(1, stringMessage[1]);
        } else {
          $("#teacherPreferredSubjectsContent").html(htmlContent);
        }
        //return false;
      }
    },
    error: function (e) {
      //showMessage(1, e.responseText);
      return false;
    },
  });
}

function validateRequestForMasterGrade(formId, elementId, toElementId) {
  console.log(
    "element=>" +
      $("#" + formId + " #" + elementId)
        .val()
        .trim()
  );
  if (
    $("#" + formId + " #" + elementId).val() == null ||
    $("#" + formId + " #" + elementId)
      .val()
      .trim() == "" ||
    $("#" + formId + " #" + elementId)
      .val()
      .trim() == 0
  ) {
    return false;
  }
  return true;
}

function callTeacherEventSubjectsByGradeId(
  formId,
  value,
  toElementId,
  requestExtra
) {
  hideMessage("");
  resetDropdown($("#" + formId + " #" + toElementId), "Select course");
  $("#" + formId + " #pastTaughtSubjectId").prop("disabled", true);
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: getURLForCommon("masters"),
    data: JSON.stringify(
      getRequestForMaster(
        formId,
        "TEACHER_EVENT_SUBJECT-LIST",
        value,
        requestExtra
      )
    ),
    dataType: "json",
    cache: false,
    timeout: 600000,
    async: false,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        showMessage(1, data["message"]);
      } else {
        buildDropdown(
          data["mastersData"]["teacherEventSubject"],
          $("#" + formId + " #" + toElementId),
          "Select course"
        );
        $("#" + formId + " #pastTaughtSubjectId").prop("disabled", false);
      }
      $("#" + formId + " #pastTaughtSubjectId").prop("disabled", false);
    },
    error: function (e) {
      //showMessage(1, e.responseText);
      $("#" + formId + " #pastTaughtSubjectId").prop("disabled", false);
    },
  });
}

function getRequestForMaster(
  formId,
  key,
  value,
  requestExtra,
  requestExtra1,
  requestExtra2,
  requestExtraRemarks,
  requestExtra4,
  requestExtra5
) {
  var request = {};
  var authentication = {};
  var requestData = {};
  requestData["requestKey"] = key;
  requestData["requestValue"] = value;
  if (requestExtra != undefined) {
    requestData["requestExtra1"] = requestExtra;
  }
  if (requestExtra1 != undefined) {
    requestData["requestExtra2"] = requestExtra1;
  }
  //New line add by mayank
  if (requestExtra2 != undefined) {
    requestData["requestExtra3"] = requestExtra2;
  }
  //New line add by mayank
  if (requestExtraRemarks != undefined || requestExtraRemarks != "") {
    if (formId == "recurringClass") {
      requestData["requestExtraTime"] = requestExtraRemarks;
    } else {
      requestData["requestExtraRemarks"] = requestExtraRemarks;
    }
  }
  if (requestExtra4 != undefined && requestExtra4 != "") {
    requestData["requestExtra4"] = requestExtra4;
  }
  if (requestExtra5 != undefined || requestExtra5 != "") {
    requestData["requestExtra"] = requestExtra5;
  }
  authentication["hash"] = getHash();
  authentication["schoolId"] = SCHOOL_ID;
  authentication["schoolUUID"] = SCHOOL_UUID;
  authentication["userType"] = "COMMON";
  request["authentication"] = authentication;
  request["requestData"] = requestData;
  return request;
}

function customLoaderPreview(needToShow) {
  if (needToShow) {
    $("#commonloaderId1").removeClass("hide");
    $("#commonloaderBody1").addClass("loader");
    $("#commonloaderId1").addClass("loader-bg");
    $("#commonloaderId1").show();
  } else {
    $("#commonloaderBody1").removeClass("loader");
    $("#commonloaderId1").removeClass("loader-bg");
    $("#commonloaderId1").addClass("hide");
    $("#commonloaderId1").hide();
  }
}
function showDocument(imagePath) {
  customLoaderPreview(true);
  $("#documentPreview").attr("src", "");
  $("#documentPreview").attr("src", imagePath);
  $("#documentPreviewModal").modal("show");
  window.setTimeout(function () {
    customLoaderPreview(false);
  }, 1000);
}

history.pushState(null, null, location.href);
window.onpopstate = function () {
  history.go(1);
};
function showSubjectCatalog(subjectId, courseType) {
  $.ajax({
    type: "POST",
    url: getURLForHTML("student", "course-catalog"),
    data: "subjectId=" + subjectId + "&courseType=" + courseType,
    dataType: "html",
    cache: false,
    async: false,
    timeout: 600000,
    success: function (htmlContent) {
      if (htmlContent != "") {
        var stringMessage = [];
        stringMessage = htmlContent.split("|");
        if (stringMessage[0] == "FAILED" || stringMessage[0] == "EXCEPTION") {
          showMessage(1, stringMessage[1]);
        } else {
          //        			$('#subjectCatalogModalContent').html('');
          $("#subjectCatalogModalContent").html(htmlContent);
          $("#subjectCatalogModal").modal("show");
        }
      }
      return false;
    },
    error: function (e) {
      //showMessage(1, e.responseText);
    },
  });
}
function showWarningMessage(warningMessage, functionName) {
  console.log(warningMessage);
  if (functionName == "") {
    $("#resetDeleteErrorWarningYes").hide();
    $("#resetDeleteErrorWarningNo").hide();
    $("#resetDeleteErrorWarningCancel*").show();
  } else {
    $("#resetDeleteErrorWarningYes").show();
    $("#resetDeleteErrorWarningNo").show();
    $("#resetDeleteErrorWarningCancel*").hide();
  }
  if (warningMessage == "Are you sure you want to avail Extension-1?") {
    $("#remarksresetDelete .modal-header")
      .removeClass("bg-danger")
      .addClass("bg-info");
    $("#statusMessage-1 i").removeClass("fa-times");
    $("#statusMessage-1 i").addClass("fa-check");
    $("#statusMessage-1 i").css({ color: "#57abff" });
    $("#remarksresetDelete .modal-footer #resetDeleteErrorWarningYes")
      .removeClass("btn-outline-danger")
      .addClass("btn-outline-info");
    $("#remarksresetDelete .modal-footer #resetDeleteErrorWarningNo")
      .removeClass("btn-danger")
      .addClass("btn-info");
  } else if (warningMessage == "Are you sure you want to delete?") {
    $("#remarksresetDelete .modal-header")
      .removeClass("bg-info")
      .addClass("bg-danger");

    $("#statusMessage-1 i").removeClass("fa-lock");
    $("#statusMessage-1 i").addClass("text-danger");
    $("#statusMessage-1 i").addClass("fa-times");

    $("#statusMessage-1 i").css({ color: "#57abff" });
    $("#remarksresetDelete .modal-footer #resetDeleteErrorWarningYes")
      .removeClass("btn-outline-info")
      .addClass("btn-outline-danger");
    $("#remarksresetDelete .modal-footer #resetDeleteErrorWarningNo")
      .removeClass("btn-info")
      .addClass("btn-danger");
  } else if (
    warningMessage.indexOf(
      "Are you sure want to lock your availability till"
    ) != -1
  ) {
    $("#remarksresetDelete .modal-header")
      .removeClass("bg-danger")
      .addClass("bg-info");
    $("#statusMessage-1 i").removeClass("fa-times");
    $("#statusMessage-1 i").removeClass("text-danger");
    $("#statusMessage-1 i").addClass("fa-lock");
    $("#statusMessage-1 i").css({ color: "#57abff" });
    $("#remarksresetDelete .modal-footer #resetDeleteErrorWarningYes")
      .removeClass("btn-outline-danger")
      .addClass("btn-outline-info");
    $("#remarksresetDelete .modal-footer #resetDeleteErrorWarningNo")
      .removeClass("btn-danger")
      .addClass("btn-info");
  } else if (
    warningMessage.indexOf("You have added more available times for ") != -1
  ) {
    $("#remarksresetDelete .modal-header")
      .removeClass("bg-danger")
      .addClass("bg-info");
    $("#statusMessage-1 i").removeClass("fa-times");
    $("#statusMessage-1 i").removeClass("text-danger");
    $("#statusMessage-1 i").addClass("fa-lock");
    $("#statusMessage-1 i").css({ color: "#57abff" });
    $("#remarksresetDelete .modal-footer #resetDeleteErrorWarningYes")
      .removeClass("btn-outline-danger")
      .addClass("btn-outline-info");
    $("#remarksresetDelete .modal-footer #resetDeleteErrorWarningNo")
      .removeClass("btn-danger")
      .addClass("btn-info");
  } else if (
    warningMessage.indexOf(
      "Are you sure you want to skip your school system training?"
    ) != -1
  ) {
    $("#statusMessage-1").html(
      '<svg xmlns="http://www.w3.org/2000/svg" width="70px" fill="#d92550" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480L40 480c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24l0 112c0 13.3 10.7 24 24 24s24-10.7 24-24l0-112c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"/></svg>'
    );
  }

  functionName = "$('#remarksresetDelete').modal('hide');" + functionName + ";";
  $("#warningMessage").html(warningMessage);
  $("#resetDeleteErrorWarningYes").attr("onclick", functionName);
  $("#remarksresetDelete").modal("show");
}
function sendAnnouncementWarning(message, functionName) {
  $("#resetDeleteErrorWarningYes1").show();
  $("#resetDeleteErrorWarningNo1").show();
  $("#resetDeleteErrorWarningCancel1").hide();
  $("#remarksresetDelete1Icon").removeAttr("class");
  $("#remarksresetDelete1Icon").attr("class", "fa fa-envelope fa-4x");
  functionName =
    "$('#remarksresetDelete1').modal('hide');" + functionName + ";";
  $("#warningMessage1").html(message);
  $("#resetDeleteErrorWarningYes1").attr("onclick", functionName);
  $("#remarksresetDelete1").modal("show");
}
function sendHolidayActivWarning(message, functionName) {
  $("#resetDeleteErrorWarningYes1").show();
  $("#resetDeleteErrorWarningNo1").show();
  $("#resetDeleteErrorWarningCancel1").hide();
  $("#remarksresetDelete1Icon").removeAttr("class");
  $("#remarksresetDelete1Icon").attr("class", "fa fa-ban fa-4x");
  functionName =
    "$('#remarksresetDelete1').modal('hide');" + functionName + ";";
  $("#warningMessage1").html(message);
  $("#resetDeleteErrorWarningYes1").attr("onclick", functionName);
  $("#remarksresetDelete1").modal("show");
}
function showWarningMessageShow(warningMessage1, functionName1, bodyMsg) {
  $("#remarksresetDelete1").remove();
  $("body").append(getWaringContent1());
  if (bodyMsg == "info-modal-sm") {
    if ($("#remarksresetDelete2").length < 1) {
      $("body #schoolReportContent").append(
        deleteWarning(warningMessage1, functionName1)
      );
    }

    if (functionName1 == "") {
      $("#resetDeleteErrorWarningYes2").hide();
      $("#resetDeleteErrorWarningNo2").hide();
      $("#resetDeleteErrorWarningCancel2").show();
    } else {
      $("#resetDeleteErrorWarningYes2").show();
      $("#resetDeleteErrorWarningNo2").show();
      $("#resetDeleteErrorWarningCancel2").hide();
    }
    functionName1 =
      "$('#remarksresetDelete2').modal('hide');" + functionName1 + ";";
    $("#warningMessage2").html(warningMessage1);
    if (bodyMsg !== "info-modal-sm") {
      var strText =
        "Please note that any recurring class created for this student will be deactivated after the student is withdrawn. If for any reason the class is not deactivated, kindly do the same from the Recurring Class menu";
      $("#statusMessage-2").html(strText);
    } else {
      $("#statusMessage-2").html('<i class="fas fa-sync fa-4x text-info"></i>');
    }
    $("#resetDeleteErrorWarningYes2").attr("onclick", functionName1);
    $("#remarksresetDelete2").modal("show");
  } else {
    if (functionName1 == "") {
      $("#resetDeleteErrorWarningYes1").hide();
      $("#resetDeleteErrorWarningNo1").hide();
      $("#resetDeleteErrorWarningCancel1").show();
    } else {
      $("#resetDeleteErrorWarningYes1").show();
      $("#resetDeleteErrorWarningNo1").show();
      $("#resetDeleteErrorWarningCancel1").hide();
    }
    functionName1 =
      "$('#remarksresetDelete1').modal('hide');" + functionName1 + ";";
    $("#warningMessage1").html(warningMessage1);
    if (bodyMsg) {
      var strText =
        "Please note that any recurring class created for this student will be deactivated after the student is withdrawn. If for any reason the class is not deactivated, kindly do the same from the Recurring Class menu";
      $("#statusMessage-1").html(strText);
    } else {
      $("#statusMessage-1").html(
        '<i class="fa fa-refresh fa-4x" style="color:#337ab7 !important;"></i>'
      );
    }
    $("#resetDeleteErrorWarningYes1").attr("onclick", functionName1);
    $("#remarksresetDelete1").modal("show");
  }
}

function selectSubjectNew(src, flag, applicableClass, counterCheck) {
  if (flag) {
    if (!$(src).hasClass("selected-course")) {
      $(src).addClass("selected-course");
      var selSubjectd = "";
      $("." + applicableClass).each(function () {
        if ($(this).hasClass("selected-course")) {
          selSubjectd = selSubjectd + "," + $(this).attr("id");
        }
      });
      selSubjectd = selSubjectd.substr(1);
      var choosenItems = selSubjectd.split(",").length;
      if (choosenItems <= parseInt(counterCheck)) {
      } else {
        $(src).removeClass("selected-course");
        showMessageTheme2(
          0,
          " You cannot select more than " + counterCheck + " courses.",
          "",
          true
        );
      }
    } else {
      $(src).removeClass("selected-course");
    }
  }
}

function isJson(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

function getISDCodeByCityAndCountry(
  cityName,
  countryName,
  elementId1,
  elementId2
) {
  var data = {};
  data["cityName"] = cityName;
  data["countryName"] = countryName;
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url:
      BASE_URL +
      CONTEXT_PATH +
      SCHOOL_UUID +
      "/get-isdcode-by-city-and-country",
    data: JSON.stringify(getFinalValue(data)),
    dataType: "json",
    async: false,
    success: function (content) {
      var finalValue = content + " " + countryName;
      //			console.log('finalValue=>'+finalValue);
      if (elementId1 != "") {
        chooseValueByElement(elementId1, finalValue);
      }
      if (elementId2 != "") {
        chooseValueByElement(elementId2, finalValue);
      }
      chooseValueByElement("countryId", countryName);
      return content;
    },
  });
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
function chooseTimezoneValueByElement(elementId, value) {
  if ($("#" + elementId).length) {
    $("#" + elementId + " option")
      .map(function () {
        var currentValue = $(this).text();
        //currentValue = currentValue.substr(0,currentValue.indexOf(' ')); // returns text before space
        currentValue = currentValue.substr(currentValue.indexOf("- ") + 1); // returns text after space
        currentValue = currentValue.substr(0, currentValue.indexOf("/"));
        //console.log('1. currentValue=>'+currentValue+', value=>'+value+', conditions=>'+(currentValue === value));
        if (currentValue.trim() === value) {
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
function renderIsdCode(formId, elementId, defaultCountryISOCode) {
  var element = "";
  if (formId != "") {
    element = "#" + formId + " #" + elementId;
  } else {
    element = "#" + elementId;
  }
  console.log("element " + element);
  if (document.querySelector(element) != null) {
    var phoneNo = document.querySelector(element);
    iti = intlTelInput(phoneNo, {
      // allowDropdown: false,
      // autoHideDialCode: false,
      // autoPlaceholder: "off",
      // dropdownContainer: document.body,
      // excludeCountries: ["us"],
      // formatOnDisplay: false,
      // geoIpLookup: function(callback) {
      //   $.get("http://ipinfo.io", function() {}, "jsonp").always(function(resp) {
      //     var countryCode = (resp && resp.country) ? resp.country : "";
      //     callback(countryCode);
      //   });
      // },
      // hiddenInput: "full_number",
      // initialCountry: "auto",
      // localizedCountries: { 'de': 'Deutschland' },
      // nationalMode: false,
      // onlyCountries: ['us', 'gb', 'ch', 'ca', 'do'],
      //placeholderNumberType: "MOBILE",
      //preferredCountries: ['in'],
      // separateDialCode: true,
      // utilsScript: "js/utils.js",
    });
    iti.setCountry(defaultCountryISOCode);
  }
  return iti;
}
function createSelect2Element(formId, elementId) {
  if (
    $("#" + formId + " #" + elementId).hasClass("select2-hidden-accessible")
  ) {
    $("#" + formId + " #" + elementId).select2("destroy");
  }
  $("#" + formId + " #" + elementId).select2();
}

$(document).ready(function () {
  $(".chat-message").hover(
    function () {
      $(".chat-message").css({
        background: "#2ebf51",
        "border-color": "#2ebf51",
      });
    },
    function () {
      $(".chat-message").css({
        background: "#1d963a",
        "border-color": "#0f9f13",
      });
    }
  );
  var window_width = $(window).outerWidth();
  //	function mobile_menu(){
  if (window_width < 991) {
    $(".vertical-nav-menu li a").click(function () {
      $(".closed-sidebar-mobile").removeClass("sidebar-mobile-open");
      $(".mobile-toggle-nav").removeClass("is-active");
    });
  }
  //	}

  //  for header script
  $(".mobile-toggle-header-nav").click(function () {
    $(this).toggleClass("active");
    $(".app-header__content").toggleClass("header-mobile-open");
  });
  $(".mobile-toggle-nav").click(function () {
    if (!$(this).hasClass("is-active")) {
      $(".app-header__content").removeClass("header-mobile-open");
      $(".mobile-toggle-header-nav").removeClass("active");
    }
  });
  $(".mobile-toggle-header-nav").click(function () {
    if (!$(this).hasClass("active")) {
      $(".closed-sidebar-mobile").removeClass("sidebar-mobile-open");
      $(".mobile-toggle-nav").removeClass("is-active");
    }
  });
});

function getDatepickerChangeVal(src) {
  var dates = $(src).val();
  var splitDates = dates.split(/(\d{4})/).filter(Boolean);
  for (let i = 1; i < splitDates.length; i += 2) {
    splitDates[i - 1] += splitDates[i];
    splitDates.splice(i, 1);
  }
  $(src).val(splitDates[0]);
}

function copyToClipboardNew(originalValue) {
  $("#hiddenForCopy").attr("disabled", false);
  var copyText = document.getElementById("hiddenForCopy");
  copyText.value = originalValue;
  $(copyText).attr("type", "text").select();
  copyText.setSelectionRange(0, 99999);
  document.execCommand("copy");
  $(copyText).attr("type", "hidden");
}
function copyToClipboard(elementId, showmsgEle) {
  $("#" + elementId).attr("disabled", false);
  var copyText = document.getElementById(elementId);
  copyText.select();
  copyText.setSelectionRange(0, 99999);
  document.execCommand("copy");
  $(showmsgEle).text("Copied");
  $(showmsgEle).removeClass("btn-primary");
  $(showmsgEle).addClass("btn-success");
}

function copyURL(eleID, msgEle, msg) {
  const copyURL = $("#" + eleID).val();
  if (msg == undefined) {
    msg = "Copied!";
  }
  if (copyURL && copyURL.length > 0) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        navigator.clipboard
          .writeText(copyURL)
          .then(() => {
            showCopyMessage(msgEle, msg, true);
          })
          .catch((error) => {
            console.error("Clipboard API failed:", error);
            fallbackCopyText(copyURL, msgEle);
          });
      } catch (err) {
        console.error("Clipboard API error:", err);
        fallbackCopyText(copyURL, msgEle);
      }
    } else {
      fallbackCopyText(copyURL, msgEle);
    }
  } else {
    console.error("No valid URL found to copy.");
    showCopyMessage(msgEle, "Invalid URL", false);
  }
}

// Fallback copy method using document.execCommand
function fallbackCopyText(text, msgEle) {
  console.log("Using fallback copy method (execCommand).");

  const tempInput = document.createElement("input");
  tempInput.type = "text";
  tempInput.value = text;
  document.body.appendChild(tempInput);

  tempInput.select();
  tempInput.setSelectionRange(0, tempInput.value.length); // For mobile

  try {
    const successful = document.execCommand("copy");
    if (successful) {
      console.log("Copied successfully using execCommand.");
      showCopyMessage(msgEle, "Copied!", true);
    } else {
      console.error("execCommand failed.");
      showCopyMessage(msgEle, "Copy failed", false);
    }
  } catch (error) {
    console.error("execCommand error:", error);
    showCopyMessage(msgEle, "Copy failed", false);
  }

  document.body.removeChild(tempInput);
}

// Helper function to display success or error messages
function showCopyMessage(msgEle, message, success) {
  const messageElement = $("." + msgEle);
  messageElement
    .removeClass("text-success text-danger d-none")
    .addClass(success ? "text-success" : "text-danger")
    .text(message);

  // Clear the message after 3 seconds
  setTimeout(() => {
    messageElement.text("");
    messageElement.addClass("d-none");
  }, 3000);
}

function validationOfDate(stDate, edDate) {
  stDate = stDate.split("-");
  edDate = edDate.split("-");
  startTime = new Date(stDate[2], stDate[0] - 1, stDate[1]).getTime();
  endTime = new Date(edDate[2], edDate[0] - 1, edDate[1]).getTime();

  if (startTime > endTime) {
    mesg = "Report start date must be less than Report end date.";
    return mesg;
  }
  return "";
}
function toTitleCase(str) {
  return str.toLowerCase().replace(/(?:^|\s)\w/g, function (match) {
    return match.toUpperCase();
  });
}

function toSentenceCase(strSentense) {
  strSentense = strSentense.split(". ");
  for (var index = 0; index < strSentense.length; index++) {
    strSentense[index] =
      strSentense[index].charAt(0).toUpperCase() + strSentense[index].slice(1);
  }
  return strSentense.join(". ");
}
//mm dd, yyyy to desiredFormat
function changeDateFormat(date, dateFormat) {
  if ("mm-dd-yyyy" == dateFormat) {
    return (
      (date.getMonth() > 8
        ? date.getMonth() + 1
        : "0" + (date.getMonth() + 1)) +
      "-" +
      (date.getDate() > 9 ? date.getDate() : "0" + date.getDate()) +
      "-" +
      date.getFullYear()
    );
  } else if ("yyyy-mm-dd" == dateFormat) {
    return (
      date.getFullYear() +
      "-" +
      (date.getMonth() > 8
        ? date.getMonth() + 1
        : "0" + (date.getMonth() + 1)) +
      "-" +
      (date.getDate() > 9 ? date.getDate() : "0" + date.getDate())
    );
  } else if ("yyyy-mm-dd hh:mm:ss" == dateFormat) {
    return (
      date.getFullYear() +
      "-" +
      (date.getMonth() > 8
        ? date.getMonth() + 1
        : "0" + (date.getMonth() + 1)) +
      "-" +
      (date.getDate() > 9 ? date.getDate() : "0" + date.getDate()) +
      " " +
      (date.getHours() > 9 ? date.getHours() : "0" + date.getHours()) +
      ":" +
      (date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes()) +
      ":" +
      (date.getSeconds() > 9 ? date.getSeconds() : "0" + date.getSeconds())
    );
  } else if ("MMM-dd-yyyy hh:mm:ss" == dateFormat) {
    return (
      M.months[date.getMonth()] +
      " " +
      (date.getDate() > 9 ? date.getDate() : "0" + date.getDate()) +
      ", " +
      date.getFullYear() +
      " " +
      (date.getHours() > 9 ? date.getHours() : "0" + date.getHours()) +
      ":" +
      (date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes()) +
      ":" +
      (date.getSeconds() > 9 ? date.getSeconds() : "0" + date.getSeconds())
    );
  } else if ("dd-mm-yyyy" == dateFormat) {
    return (
      (date.getDate() > 9 ? date.getDate() : "0" + date.getDate()) +
      "-" +
      (date.getMonth() > 8
        ? date.getMonth() + 1
        : "0" + (date.getMonth() + 1)) +
      "-" +
      date.getFullYear()
    );
  } else if ("MMM-dd-yyyy" == dateFormat) {
    return (
      M.months[date.getMonth()] +
      " " +
      (date.getDate() > 9 ? date.getDate() : "0" + date.getDate()) +
      ", " +
      date.getFullYear()
    );
  } else {
    return (
      date.getFullYear() +
      "-" +
      (date.getMonth() > 8
        ? date.getMonth() + 1
        : "0" + (date.getMonth() + 1)) +
      "-" +
      (date.getDate() > 9 ? date.getDate() : "0" + date.getDate())
    );
  }
}
function getDateInDateFormat(dateAsString) {
  dateAsString = dateAsString.replace(",", "");
  dateAsString = dateAsString.split(" ");
  var mm = M.months.indexOf(dateAsString[0]);
  return new Date(dateAsString[2], mm > 9 ? mm : "0" + mm, dateAsString[1]);
}

function callBatchesByMulltipleGradeId(
  formId,
  value,
  elementId,
  toElementId,
  requestExtra,
  requestExtra1,
  requestExtra2,
  requestExtraRemarks
) {
  hideMessage("");
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: getURLForCommon("masters"),
    data: JSON.stringify(
      getRequestForMaster(
        formId,
        "BATCH-NAME-LIST-BASED-ON-MULTIPLE-STANDARD",
        value,
        requestExtra,
        requestExtra1,
        requestExtra2,
        requestExtraRemarks
      )
    ),
    dataType: "json",
    cache: false,
    timeout: 600000,
    async: false,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        showMessage(true, data["message"]);
      } else {
        buildDropdown(
          data["mastersData"]["subject"],
          $("#" + formId + " #" + toElementId),
          "Select class"
        );
        //$("#"+formId+" #pastTaughtSubjectId").prop("disabled", false);
      }
      //$("#"+formId+" #pastTaughtSubjectId").prop("disabled", false);
    },
    error: function (e) {
      console.log(e);
      //	showMessage(true, e.responseText);
      //$("#"+formId+" #pastTaughtSubjectId").prop("disabled", false);
    },
  });
}

function callStudentBatchesByGradeId(
  formId,
  value,
  elementId,
  toElementId,
  requestExtra,
  requestExtra1,
  requestExtra2,
  requestExtraRemarks,
  requestExtra4
) {
  hideMessage("");
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: getURLForCommon("masters"),
    data: JSON.stringify(
      getRequestForMaster(
        formId,
        "MULTIPLE-STUDENT-LIST",
        value,
        requestExtra,
        requestExtra1,
        requestExtra2,
        requestExtraRemarks,
        requestExtra4
      )
    ),
    dataType: "json",
    cache: false,
    timeout: 600000,
    async: false,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        showMessage(true, data["message"]);
      } else {
        buildDropdown(
          data["mastersData"]["studentList"],
          $("#" + formId + " #" + toElementId),
          "Select"
        );
      }
    },
    error: function (e) {
      //showMessage(true, e.responseText);
      $("#" + formId + " #pastTaughtSubjectId").prop("disabled", false);
    },
  });
}
function convertTZ(date, tzString) {
  return new Date(
    (typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {
      timeZone: tzString,
    })
  );
}

function validEndInvalidField(flag, ele) {
  if (flag) {
    $("#" + ele)
      .closest(".valid-field")
      .addClass("true");
    $("#" + ele)
      .closest(".valid-field")
      .removeClass("false");
    $("#" + ele + "-error").hide();
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
    $("#" + ele + "-error").show();
  }
}
function formValdate(formID, mandatory, nonMandatory) {
  for (var i = 0; i < mandatory.length; i++) {
    var mElementType = $("#" + formID + " " + "#" + mandatory[i]).attr("type");
    var mElementValue = $("#" + formID + " " + "#" + mandatory[i]).val();
    if (mElementValue != null && mElementValue != undefined) {
      mElementValue = mElementValue.trim();
    } else {
      mElementValue = "";
    }
    if (
      mElementValue != "" &&
      mElementType != "checkbox" &&
      mElementType != "tel"
    ) {
      validEndInvalidField(true, mandatory[i]);
    } else if (mElementType == "checkbox") {
      if ($("#" + formID + " " + "#" + mandatory[i]).is(":checked")) {
        validEndInvalidField(true, "pcModeWhatsapp");
        //return true;
      } else {
        validEndInvalidField(null, mandatory[i]);
        //return false;
      }
    } else if (mElementType == "tel") {
      if ($("#" + formID + " " + "#" + mandatory[i]).val().length == 0) {
        validEndInvalidField(null, mandatory[i]);
        //return false;
      } else if (
        $("#" + formID + " " + "#" + mandatory[i]).val().length < 3 &&
        $("#" + formID + " " + "#" + mandatory[i]).val().length > 0
      ) {
        validEndInvalidField(false, mandatory[i]);
        //return false;
      } else {
        validEndInvalidField(true, mandatory[i]);
        //return true;
      }
    } else if (mElementType == undefined) {
      validEndInvalidField(null, mandatory[i]);
    } else {
      validEndInvalidField(false, mandatory[i]);
    }
  }
  for (var j = 0; j < nonMandatory.length; j++) {
    var nElementType = $("#" + formID + " " + "#" + nonMandatory[j]).attr(
      "type"
    );
    var nElementValue = $("#" + formID + " " + "#" + nonMandatory[j]).val();
    if (nElementValue != null && nElementValue != undefined) {
      nElementValue = nElementValue.trim();
    } else {
      nElementValue = "";
    }
    if (
      nElementValue != "" &&
      nElementType != "checkbox" &&
      nElementType != "tel"
    ) {
      validEndInvalidField(true, nonMandatory[j]);
    } else if (nElementType == "checkbox") {
      if ($("#" + formID + " " + "#" + nonMandatory[j]).is(":checked")) {
        validEndInvalidField(true, nonMandatory[j]);
        //return true;
      } else {
        validEndInvalidField(null, nonMandatory[j]);
        //return false;
      }
    } else if (nElementType == "tel") {
      if ($("#" + formID + " " + "#" + nonMandatory[j]).val().length == 0) {
        validEndInvalidField(null, nonMandatory[j]);
        //return false;
      } else if (
        $("#" + formID + " " + "#" + nonMandatory[j]).val().length < 3 &&
        $("#" + formID + " " + "#" + nonMandatory[j]).val().length > 0
      ) {
        validEndInvalidField(false, nonMandatory[j]);
        //return false;
      } else {
        validEndInvalidField(true, nonMandatory[j]);
        //return true;
      }
    } else {
      validEndInvalidField(null, nonMandatory[j]);
    }
  }
}

$(".show-password").on("click", function () {
  var inputField = $("#passwordType");
  if (inputField.val() != "") {
    if (inputField.attr("type") == "password") {
      inputField.attr("type", "text");
    } else {
      inputField.attr("type", "password");
    }
    $(this).find("i").toggleClass("fa-eye fa-eye-slash");
  }
});
var i = 0;

$(document).on("shown.bs.modal", ".modal", function (e) {
  const modal = $(this);
  const backdrops = $(".modal-backdrop");
  const modals = $(".modal.show").not(this);

  // Calculate new z-index
  let baseZIndex = 1050;
  let zIndex = baseZIndex + modals.length * 20; // Each stacked modal increases z-index

  modal.css("z-index", zIndex);

  setTimeout(() => {
    let backdrop = $(".modal-backdrop").not(".modal-stack").last();
    backdrop
      .css("z-index", zIndex - 10) // Ensure backdrop is behind modal
      .addClass("modal-stack");
  }, 10);
});

$(document).on("hidden.bs.modal", ".modal", function () {
  // Check if there are still open modals
  if ($(".modal.show").length === 0) {
    // Remove leftover backdrop(s)
    $(".modal-backdrop").remove();
    $("body").removeClass("modal-open");
  } else {
    // Adjust z-index of the last open modal and its backdrop
    const topModal = $(".modal.show").last();
    const newZIndex = 1050 + ($(".modal.show").length - 1) * 20;
    topModal.css("z-index", newZIndex);
    $(".modal-backdrop").last().css("z-index", newZIndex - 10);
  }
});


$(document).ready(function () {
  $(".hamburger").on("click", function () {
    $(".card-body, table, tbody").resize();
    // var table = $('div.dataTables_scrollBody>table').dataTable();
    //     if ( table.length > 0 ) {
    //         table.fnDestroy()
    // 		table.dataTable();
    //     }
    // if($("table tbody tr td:first").hasClass("dtr-control")){
    // 	alert("SAfd")
    // 	$("table").destroy();
    // }
  });
});

function disabledBackButton() {
  history.pushState(null, null, location.href);
  window.onpopstate = function () {
    history.go(1);
  };
}
function checkCSCValidation(value, ele, fieldName) {
  if (value == "" || value == null || value == undefined) {
    validEndInvalidField(null, ele);
    //showMessage(0, fieldName+' is required');
    return false;
  } else {
    validEndInvalidField(true, ele);
  }
}

function pCheckCSCValidation(value, ele, fieldName) {
  if (value == "" || value == null || value == undefined) {
    validEndInvalidField(null, ele);
    //showMessage(0, fieldName+' is required');
    return false;
  } else {
    validEndInvalidField(true, ele);
  }
}

function getNumberWithPrecision(number, prececision) {
  return Number.parseFloat(number).toFixed(prececision);
}
function getVauleAsNumber(elementId) {
  var value = $("#" + elementId).val();
  if (!$.isNumeric(value)) {
    return 0;
  }
  return value;
}

function getTrimmedValue(formId, elementId) {
  $("#" + formId + " " + "#" + elementId).val(
    $("#" + formId + " " + "#" + elementId)
      .val()
      .trim()
  );
}

function checkTextBox(formId) {
  var form = $("#" + formId);
  if ($("#" + formId + " input").length > 0) {
    form.find(":text").each(function () {
      getTrimmedValue(formId, this.id);
    });
    form.find("input[type='email']").each(function () {
      getTrimmedValue(formId, this.id);
    });
  }
}
function removeItemOnce(arr, value) {
  var index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

function removeItemAll(arr, value) {
  var i = 0;
  while (i < arr.length) {
    if (arr[i] === value) {
      arr.splice(i, 1);
    } else {
      ++i;
    }
  }
  return arr;
}

function toSeconds(hours, minutes, seconds) {
  return hours * 3600 + minutes * 60 + seconds;
}

function secondsToHms(d) {
  d = Number(d);
  var h = Math.floor(d / 3600);
  var m = Math.floor((d % 3600) / 60);
  var s = Math.floor((d % 3600) % 60);

  var hDisplay = h > 0 ? h + "h " : "";
  var mDisplay = m > 0 ? m + "m" : "";
  //var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
  return hDisplay + mDisplay;
}

function convertMsToTime(milliseconds) {
  let seconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);

  seconds = seconds % 60;
  minutes = minutes % 60;
  hours = hours % 24;
  return `${padTo2Digits(hours)}h ${padTo2Digits(minutes)}m ${padTo2Digits(seconds)}s`;
}
function padTo2Digits(num) {
  return num.toString().padStart(2, "0");
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

$(document).ready(function () {
  $("#captcha").keyup(function () {
    $(this).val($(this).val().toUpperCase());
  });
  $("#marqueeDiv").css({ color: "red" });
});
function hidePassWordSuggession(src) {
  $(src).parent().find(".password-sugession").hide();
}

function checkPasswordStrength(
  src,
  formID,
  elementId,
  passwordType,
  matchElementId
) {
  var passwodSuggessionHTML =
    '<div class="password-sugession">' +
    '<h6 class="password-sugession-title"><b>Password must include at least:</b></h6>	' +
    '<p class="password-sugession-type password-uppercase-letter"><span class="ps-valid"><i class="fa fa-check"></i></span><span class="ps-invalid"><i class="fa fa-times"></i></span> <span class="ps-dot">.</span> 1 uppercase letter</p>' +
    '<p class="password-sugession-type password-lowercase-letter"><span class="ps-valid"><i class="fa fa-check"></i></span><span class="ps-invalid"><i class="fa fa-times"></i></span> <span class="ps-dot">.</span> 1 lowercase letter</p>' +
    '<p class="password-sugession-type password-special-letter"><span class="ps-valid"><i class="fa fa-check"></i></span><span class="ps-invalid"><i class="fa fa-times"></i></span> <span class="ps-dot">.</span> 1 special character</p>' +
    '<p class="password-sugession-type password-number"><span class="ps-valid"><i class="fa fa-check"></i></span><span class="ps-invalid"><i class="fa fa-times"></i></span> <span class="ps-dot">.</span> 1 number</p>' +
    '<p class="password-sugession-type password-length"><span class="ps-valid"><i class="fa fa-check"></i></span><span class="ps-invalid"><i class="fa fa-times"></i></span> <span class="ps-dot">.</span> min 8 characters & max 20 characters</p>';
  if (passwordType == "CP") {
    passwodSuggessionHTML +=
      '<p class="password-sugession-type comfirm-password"><span class="ps-valid"><i class="fa fa-check"></i></span><span class="ps-invalid"><i class="fa fa-times"></i></span> <span class="ps-dot">.</span> password and confirm password should be same</p>';
  }
  +"</div>";
  $("#" + formID + " #" + elementId)
    .parent()
    .css({ position: "relative" });
  if (
    $("#" + formID + " #" + elementId)
      .parent()
      .find(".password-sugession").length < 1
  ) {
    $("#" + formID + " #" + elementId)
      .parent()
      .append(passwodSuggessionHTML);
  }
  $(src).parent().find(".password-sugession").show();
  if (passwordType == "P") {
    var password = $("#" + elementId).val();
  } else {
    var password = $("#" + elementId).val();
    var comfirmPassword = $("#" + matchElementId).val();
  }

  // Regular expressions for password validation
  var lowercaseRegex = /^(?=.*[a-z])/;
  var uppercaseRegex = /^(?=.*[A-Z])/;
  var digitRegex = /^(?=.*\d)/;
  var specialCharRegex = /^(?=.*[@$!%*?&#])/;

  var isLowercaseValid = lowercaseRegex.test(password);
  var isUppercaseValid = uppercaseRegex.test(password);
  var isDigitValid = digitRegex.test(password);
  var isSpecialCharValid = specialCharRegex.test(password);

  var isValid =
    isLowercaseValid && isUppercaseValid && isDigitValid && isSpecialCharValid;
  if (password.length == 0) {
    $(".ps-dot").show();
    $(".ps-valid").hide();
    $(".ps-invalid").hide();
    $(".password-length").css({ color: "inherit" });
    $(".password-lowercase-letter").css({ color: "inherit" });
    $(".password-uppercase-letter").css({ color: "inherit" });
    $(".password-number").css({ color: "inherit" });
    $(".password-special-letter").css({ color: "inherit" });
  } else {
    if (password.length < 8 && password.length <= 20) {
      $(".password-length .ps-valid").hide();
      $(".password-length .ps-invalid").show();
      $(".password-length .ps-dot").hide();
      $(".password-length").css({ color: "red" });
    } else {
      $(".password-length .ps-valid").show();
      $(".password-length .ps-invalid").hide();
      $(".password-length .ps-dot").hide();
      $(".password-length").css({ color: "green" });
    }
    if (!isLowercaseValid) {
      $(".password-lowercase-letter .ps-valid").hide();
      $(".password-lowercase-letter .ps-invalid").show();
      $(".password-lowercase-letter .ps-dot").hide();
      $(".password-lowercase-letter").css({ color: "red" });
    } else {
      $(".password-lowercase-letter .ps-valid").show();
      $(".password-lowercase-letter .ps-invalid").hide();
      $(".password-lowercase-letter .ps-dot").hide();
      $(".password-lowercase-letter").css({ color: "green" });
    }
    if (!isUppercaseValid) {
      $(".password-uppercase-letter .ps-valid").hide();
      $(".password-uppercase-letter .ps-invalid").show();
      $(".password-uppercase-letter .ps-dot").hide();
      $(".password-uppercase-letter").css({ color: "red" });
    } else {
      $(".password-uppercase-letter .ps-valid").show();
      $(".password-uppercase-letter .ps-invalid").hide();
      $(".password-uppercase-letter .ps-dot").hide();
      $(".password-uppercase-letter").css({ color: "green" });
    }

    if (!isDigitValid) {
      $(".password-number .ps-valid").hide();
      $(".password-number .ps-invalid").show();
      $(".password-number .ps-dot").hide();
      $(".password-number").css({ color: "red" });
    } else {
      $(".password-number .ps-valid").show();
      $(".password-number .ps-invalid").hide();
      $(".password-number .ps-dot").hide();
      $(".password-number").css({ color: "green" });
    }
    if (!isSpecialCharValid) {
      $(".password-special-letter .ps-valid").hide();
      $(".password-special-letter .ps-invalid").show();
      $(".password-special-letter .ps-dot").hide();
      $(".password-special-letter").css({ color: "red" });
    } else {
      $(".password-special-letter .ps-valid").show();
      $(".password-special-letter .ps-invalid").hide();
      $(".password-special-letter .ps-dot").hide();
      $(".password-special-letter").css({ color: "green" });
    }
    if (password != comfirmPassword) {
      $(".comfirm-password .ps-valid").hide();
      $(".comfirm-password .ps-invalid").show();
      $(".comfirm-password .ps-dot").hide();
      $(".comfirm-password").css({ color: "red" });
    } else {
      $(".comfirm-password .ps-valid").show();
      $(".comfirm-password .ps-invalid").hide();
      $(".comfirm-password .ps-dot").hide();
      $(".comfirm-password").css({ color: "green" });
    }
  }
}

function parseUrlToJson(params) {
  var data = {};
  data["userId"] = USER_ID;
  var splittedParams = params.split("?");
  if (splittedParams.length > 1) {
    var splittedParams1 = splittedParams[1].split("&");
    for (index = 0; index < splittedParams1.length; index++) {
      var splittedParams2 = splittedParams1[index].split("=");
      data[splittedParams2[0]] = splittedParams2[1];
    }
  }
  return data;
}

function getAsPost(paramas, isSelf) {
  console.log("getAsPost1 " + paramas);
  // var KEUS = getSecreteKey();
  // AesUtil(KEUS.KEYSIZE, KEUS.ITERATIONS);
  var payload = JSON.stringify(parseUrlToJson(paramas));
  // payload=AesUtil.prototype.encrypt(KEUS.SALT, KEUS.IV, KEUS.PASSPHRASE, payload);
  payload = encode(payload);
  console.log("getAsPost2 " + paramas);
  var urlSend =
    BASE_URL +
    CONTEXT_PATH +
    SCHOOL_UUID +
    paramas.split("?")[0] +
    "/" +
    UNIQUEUUID +
    "?payload=" +
    payload;
  if (isSelf == undefined || isSelf == null || isSelf == "") {
    window.open(urlSend);
  } else {
    window.open(urlSend, "_self");
  }
  customLoader(false);
}

function getAsPostWithoutUniqueID(paramas) {
  // console.log('getAsPost1 '+paramas);
  // var KEUS = getSecreteKey();
  // AesUtil(KEUS.KEYSIZE, KEUS.ITERATIONS);
  // var payload=JSON.stringify(parseUrlToJson(paramas));
  // payload=AesUtil.prototype.encrypt(KEUS.SALT, KEUS.IV, KEUS.PASSPHRASE, payload);
  // payload=encode(payload);
  // console.log('getAsPost2 '+paramas);
  var urlSend = BASE_URL + CONTEXT_PATH + SCHOOL_UUID + paramas;
  window.open(urlSend);
  customLoader(false);
}

function getAsPostWithoutUUID(paramas, isSelf) {
  console.log("getAsPost1 " + paramas);
  // var KEUS = getSecreteKey();
  // AesUtil(KEUS.KEYSIZE, KEUS.ITERATIONS);
  var payload = JSON.stringify(parseUrlToJson(paramas));
  // payload=AesUtil.prototype.encrypt(KEUS.SALT, KEUS.IV, KEUS.PASSPHRASE, payload);
  payload = encode(payload);
  console.log("getAsPost2 " + paramas);
  var urlSend =
    BASE_URL +
    CONTEXT_PATH +
    SCHOOL_UUID +
    paramas.split("?")[0] +
    "?payload=" +
    payload;
  if (isSelf == undefined || isSelf == null || isSelf == "") {
    window.open(urlSend);
  } else {
    window.open(urlSend, "_self");
  }
  customLoader(false);
}

function encode(payload) {
  return window.btoa(encodeURI(payload));
}

function decode(payload) {
  return window.atob(payload);
}

function disablePastTimes(startTimeID, endTime, currentDate) {
  var currentHour = currentDate.getHours();
  var currentMinute = currentDate.getMinutes();

  $("#" + startTimeID).timepicker({
    format: "HH:mm",
    minTime: currentHour + ":" + currentMinute,
  });
  // $("#"+endTime).trigger('click');
}

function getSettingRequest(schoolId) {
  var data = {};
  data["schoolId"] = schoolId;
  return data;
}
// function getSchoolSettingsTechnical(schoolId){
// 	var responseData={};
// 	$.ajax({
// 		type : "POST",
// 		contentType : "application/json",
// 		url : getURLFor('technical',''),
// 		data : JSON.stringify(getSettingRequest(schoolId)),
// 		dataType : 'json',
// 		async: false,
// 		global: false,
// 		success : function(data) {
// 			responseData=data
// 		},
// 		error : function(e) {
// 			if (checkonlineOfflineStatus()) {
// 				return;
// 			}else{
// 				showMessage(true, e.responseText);
// 			}
// 		}
// 	});
// 	return responseData;
// }

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

// function getSchoolSettingsLinks(schoolId){
// 	var responseData={};
// 	$.ajax({
// 		type : "POST",
// 		contentType : "application/json",
// 		url : getURLFor('links',''),
// 		data : JSON.stringify(getSettingRequest(schoolId)),
// 		dataType : 'json',
// 		async: false,
// 		global: false,
// 		success : function(data) {
// 			responseData=data
// 		},
// 		error : function(e) {
// 			if (checkonlineOfflineStatus()) {
// 				return;
// 			}else{
// 				showMessage(true, e.responseText);
// 			}
// 		}
// 	});
// 	return responseData;
// }

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
async function getCommonCustomScript(userId,schoolId){
	try{
		var responseData = await  getDesiredObject('commonscript'+schoolId);
		if(typeof responseData =='object'){
			if(!responseData.ntc){
				return responseData;
			}
		}
		var data={};
		data['userId']=userId;
		responseData = await getDataBasedUrlAndPayload('common-script-variables', data);
		localStorage.setItem('commonscript'+schoolId,JSON.stringify(responseData));
		return responseData;
	}catch(e){
		showMessage(true, e)
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

function getPlaneFormattedPhone(phoneNumber) {
  if (phoneNumber == undefined || phoneNumber == null || phoneNumber == "") {
    return "";
  }
  return phoneNumber
    .replaceAll("(", "")
    .replaceAll(")", "")
    .replaceAll("-", "")
    .replaceAll(" ", "");
}

function convertTo24Hour(time) {
  let [timePart, modifier] = time.split(" ");
  let [hours, minutes] = timePart.split(":");

  if (hours === "12") {
    hours = "00";
  }

  if (modifier === "PM") {
    hours = parseInt(hours, 10) + 12;
  }

  return `${hours.toString().padStart(2, "0")}:${minutes}`;
}

function inputNumberValidation(event) {
  event.target.value = event.target.value.replace(/\D/g, "");
}

function getTimePlusInterval(date, intervalInMinutes) {
  var currentDate = new Date(date); // Get current date and time
  // var oneHourLater = new Date(currentDate.getTime() + (1 * 60 * 60 * 1000)); // Add 1 hour to current time
  var intervalLater = new Date(
    currentDate.getTime() + intervalInMinutes * 60 * 1000
  ); // Add the interval
  var hours = intervalLater.getHours().toString().padStart(2, "0");
  var minutes = intervalLater.getMinutes().toString().padStart(2, "0");
  var seconds = intervalLater.getSeconds().toString().padStart(2, "0");
  var ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // Handle midnight (0 hours)
  var formattedTime =
    hours.toString().padStart(2, "0") + ":" + minutes + " " + ampm;
  return formattedTime;
  //var formattedTime = intervalLater.toLocaleTimeString();
  //return formattedTime.toString().padStart(2, '0');//intervalLater.toLocaleTimeString(); // Format the time as a string
}
function getSession() {
  var responseData = false;
  $.ajax({
    type: "GET",
    url: getURLForCommon("check-session"),
    async: false,
    global: false,
    success: function (data) {
      responseData = data;
    },
    error: function (e) {
      if (checkonlineOfflineStatus()) {
        return;
      } else {
        showMessage(true, e.responseText);
      }
    },
  });
  return responseData;
}

function callWithSession(url, isSelf) {
  if (getSession()) {
    if (isSelf) {
      goAheadGet(url);
    } else {
      window.open(url);
    }
  } else {
    redirectLoginPage();
  }
}
function callWithSessionWithGetAsPost(url, isSelf) {
  if (getSession()) {
    getAsPost(url, isSelf);
  } else {
    redirectLoginPage();
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

function getTimeDifference(start, end) {
  return moment.duration(
    moment(end, "HH:mm:ss a").diff(moment(start, "HH:mm:ss a"))
  );
}

function getTimeWithFormat(durationAsMilisecond) {
  // var diff = moment.duration(durationAsMilisecond);
  // return (`${diff.hours()}h ${diff.minutes()}m`);
  var totalMinutes = durationAsMilisecond / (1000 * 60);
  var hours = Math.floor(totalMinutes / 60);
  var minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
}

function getTimeFormat(hour) {
  var hours = parseInt(hour.split(":")[0]);
  var minutes = parseInt(hour.split(":")[1]);
  return `${hours}h ${minutes}m`;
}

function getTimeFormatByMiliSecond(durationAsMilisecond) {
  // var diff = moment.duration(durationAsMilisecond);
  // return (`${diff.hours()}h ${diff.minutes()}m`);
  var totalMinutes = durationAsMilisecond / (1000 * 60);
  var hours = Math.floor(totalMinutes / 60);
  if (hours < 10) {
    hours = "0" + hours;
  }
  var minutes = totalMinutes % 60;
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  return hours + ":" + Math.round(minutes);
}

function autodiposeModel(modelId) {
  window.setTimeout(function () {
    $("#" + modelId).modal("hide");
  }, 10000);
}

function getEndTimeDropdownValue(startMins, timeGap) {
  var html = "";
  for (var i = startMins; i < 24 * 60; i += timeGap) {
    var endHour = Math.floor(i / 60);
    var endMinutes = i % 60;
    var endPeriod = endHour >= 12 ? "PM" : "AM";
    if (endHour > 12) endHour -= 12;
    if (endHour === 0) endHour = 12;

    var formattedEndTime = `${endHour}:${endMinutes
      .toString()
      .padStart(2, "0")} ${endPeriod}`;
    html += `<option value="${formattedEndTime}">${formattedEndTime}</option>`;
    //$('.endTime').append("<option value="+endHour+":"+endMinutes.toString().padStart(2, '0')+"_"+endPeriod+">"+formattedEndTime+"</option>");
  }
  return html;
}

$(document).ready(function () {
  $(".mobile-toggle-header-nav").click(function () {
    $(this).toggleClass("active"),
      $(".app-header__content").toggleClass("header-mobile-open");
  });
  detectBrave();
});
function detectBrave() {
  if (navigator.brave && navigator.brave.isBrave) {
    navigator.brave.isBrave().then(function (result) {
      if (result) {
        $(".cookie-consent").hide();
      } else {
        if (isShowcookie) {
          $(".cookie-consent").show();
        }
      }
    });
  } else {
    var isBrave = false;
    if (navigator.userAgent.includes("Chrome")) {
      // Additional feature detection for Brave
      const testBrave = new Error("Test Error").stack.includes(
        "chrome-extension://"
      );
      if (testBrave) {
        isBrave = true;
        $(".cookie-consent").hide();
      } else {
        if (isShowcookie) {
          $(".cookie-consent").show();
        }
      }
    }
    //console.log(isBrave ? 'This is the Brave browser' : 'This is not the Brave browser');
  }
}

function getDashboardDataBasedUrlAndPayload(
  globalflag,
  showMessage,
  url,
  payload
) {
  customLoader(true);
  return new Promise(function (resolve, reject) {
    $.ajax({
      type: "POST",
      contentType: "application/json",
      url: getURLForHTML("dashboard", url),
      data: JSON.stringify(payload),
      dataType: "json",
      global: globalflag,
      success: function (data) {
        if (data.status == "0" || data.status == "2" || data.status == "3") {
          if (data.status == "3") {
            redirectLoginPage();
          } else {
            if (showMessage) {
              if (tt == "theme1") {
                showMessage(false, data.message);
              } else {
                showMessageTheme2(0, data.message, "", true);
              }
            }
          }
        } else {
          customLoader(false);
          resolve(data);
        }
      },
      error: function (xhr, status, e) {
        if (showMessage) {
          if (tt == "theme1") {
            showMessage(false, e.responseText);
          } else {
            showMessageTheme2(0, e.responseText, "", true);
          }
        }
        reject(e);
      },
    });
  });
}

function getDashboardDataBasedUrlAndPayloadWithParentUrl(globalflag, showMessage, url, payload, parentUrl){
  return new Promise(function (resolve, reject) {
      $.ajax({
          type : "POST",
          contentType : "application/json",
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
                          if(tt=='theme1'){
                              showMessage(false, data.message);
                          }else{
                              showMessageTheme2(0, data.message,'',true);
                          }
                      }
                  }
              } else {
                  resolve(data);
              }
          },
          error: function (xhr, status, e) {
              if(showMessage){
                  if(tt=='theme1'){
                      showMessage(false, e.responseText);
                  }else{
                      showMessageTheme2(0, e.responseText,'',true);
                  }
              }
              reject(e);
          }
      });
  });
}
function getActualData(){
	var responseData={};
	if(LOCATION_SERVICE_BYPASS=='true'){
		responseData=JSON.parse(DEFAULT_LOCATION);
	}else{
		$.ajax({
			global: false,
			type : "GET",
			url : PRO_IP_API_URL,
			async : false,
			success : function(data) {
				responseData=data;
			}
		});
	}
	return responseData;
}
function getCurrentTimeFromDateAsString(date){
	return getCurrentTimeFromDate(new Date(date))
}

function getCurrentTimeOnly(){
	return getCurrentTimeFromDate(new Date())
}

function getCurrentTimeFromDate(date){
	return (date.getHours() > 9 ? date.getHours() : ('0' + date.getHours())) + ':' + (date.getMinutes() > 9 ? date.getMinutes() : ('0' + date.getMinutes())) + ':' + (date.getSeconds() > 9 ? date.getSeconds() : ('0' + date.getSeconds()));
}
function getBeforeAndAfterDate(date, hours){
	var now = new Date(date);
	return new Date(now.getTime()+(hours * 60 * 60 * 1000));
}

function getDataBasedUrlAndPayload(url, payload){
	return new Promise(function (resolve, reject) {
		$.ajax({
			type : "POST",
			contentType : "application/json",
			url : getURLFor(url,''),
			data : JSON.stringify(payload),
			dataType : 'json',
			//global: false,
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
function getPrimaryColor(){
	var primaryColor=ROOTCSS.split(':#')[1].split(';')[0];
	return primaryColor;
}
function showMessageTheme2Content(){
	var html =
	`<div class="server-message">
		<span class="msg" id="msgTheme2"></span>
	</div>`
	return html;
}

function getWelcomeMessage(){
  var timeOfDay = new Date().getHours();
  if (timeOfDay >= 0 && timeOfDay < 12) {
      return "Good morning";
  } else if (timeOfDay >= 12 && timeOfDay < 16) {
      return "Good afternoon";
  } else if (timeOfDay >= 16 && timeOfDay < 21) {
      return "Good evening";
  } else if (timeOfDay >= 21 && timeOfDay < 24) {
      return "Good evening";
  }
}