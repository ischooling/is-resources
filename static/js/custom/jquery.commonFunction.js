var BASE_TIMEZONE='Asia/Singapore';
var API_VERSION = CONTEXT_PATH + SCHOOL_UUID + '/' + 'api/v1/';
var API_VERSION_WITHOUT_UNIQUEID = CONTEXT_PATH + 'api/v1/';
var GLOBAL_EMAIL = '';
var GRADE_CAL_RULE = {};
var DEFAULT_SEARCH_STATE = true;
var editor1;
var editor2;
var editor3;
var editor4;
var IGNORECOUNTRYARRAY = ['AQ', 'BV', 'HM', 'TF', 'UM'];
var globalEntityId = "";
// var reviewDone = false;
// var submitted = false;
// var courseCategoryType = [];
// var gradesTaught = [];
// var gradesChanged = false;
// var elementary_subjects = [];
// var middleSchool_subjects = [];
// var highSchool_subjects = [];
// var uploadDone = false;
// var FULL_NAME = "";
// var LEAVE_DATES = "";
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
function logout(suffix) {
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
function getURLForWithoutUnique(apiType, suffixUrl) {
  return BASE_URL + API_VERSION_WITHOUT_UNIQUEID + apiType + "/" + suffixUrl;
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
  if ($('[data-toggle="tooltip"]').length > 0) {
    $('[data-toggle="tooltip"]').tooltip();
  }
  //	$('select[multiple].active.3col').multiselect({
  //		columns:2,
  //		placeholder: 'Optional Subject',
  //		search: true,
  //		searchOptions: {
  //		    'default': 'Search Subjects'
  //		},
  //		selectAll: false,
  //	});

  $("#login-btn").click(function (event) {
    event.preventDefault();
    $("#signupDiv")
      .css("margin-left", "100%")
      .css("width", "100%")
      .css("transition", "0.3s");
    $("#loginDiv").fadeIn(100);
    $("#loginDiv")
      .css("margin-left", "0px")
      .css("width", "100%")
      .css("transition", "0.3s");
    $("#moduleNme").html("Student Login");
  });

  $("#signup-btn").click(function (event) {
    event.preventDefault();
    $("#loginDiv")
      .css("margin-left", "-100%")
      .css("width", "100%")
      .css("transition", "0.3s");
    $("#signupDiv").fadeIn(100);
    $("#signupDiv")
      .css("margin-left", "0px")
      .css("width", "100%")
      .css("transition", "0.3s");
    $("#moduleNme").html("Student Enrollment");
  });
  $(".panel-heading a").click(function () {
    $(".panel-heading").removeClass("active");
    if (!$(this).closest(".panel").find(".panel-collapse").hasClass("in"))
      $(this).parents(".panel-heading").addClass("active");
  });

  function toggleIcon(e) {
    $(e.target)
      .prev(".panel-heading")
      .find(".more-less")
      .toggleClass("glyphicon-plus glyphicon-minus");
  }
  $(".panel-group").on("hidden.bs.collapse", toggleIcon);
  $(".panel-group").on("shown.bs.collapse", toggleIcon);

  $(".datepicker").on("change", function () {
    var dates = $(this).val();
    var splitDates = dates.split(/(\d{4})/).filter(Boolean);
    for (let i = 1; i < splitDates.length; i += 2) {
      splitDates[i - 1] += splitDates[i];
      splitDates.splice(i, 1);
    }
    $(this).val(splitDates[0]);
  });
});

function showModalMessage(isWarnig, message, id) {
  hideModalMessage(id);
  if (isWarnig) {
    $("#modalMessageNew").addClass("failure");
    $("#modalMessageNew1").addClass("failure");
  } else {
    $("#modalMessageNew").addClass("success");
    $("#modalMessageNew1").addClass("success");
  }
  $("#modalMessageNew").html(message);
  $("#modalMessageNew1").html(message);
}
function hideModalMessage(id) {
  $("#modalMessageNew").html("");
  $("#modalMessageNew").removeClass("success");
  $("#modalMessageNew").removeClass("failure");
  $("#modalMessageNew1").html("");
  $("#modalMessageNew1").removeClass("success");
  $("#modalMessageNew1").removeClass("failure");
}
function showMessage(isWarnig, message, id) {
  // window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  // $('#statusMessage').removeClass('error');
  // $('#statusMessage').removeClass('success');
  // $('#statusMessage').removeClass('notification');
  // $('#statusMessage').html('');
  // if (isWarnig) {
  // 	$('#errorHeading').html('Error! Be focus on work');
  // 	$('#statusMessage').addClass('error');
  // 	$('#statusMessage').html('<i class="fa fa-exclamation-triangle"></i>&nbsp;'+message);
  // } else {
  // 	$('#errorHeading').html('Information!');
  // 	$('#statusMessage').addClass('success');
  // 	$('#statusMessage').html('<i class="fa fa-check"></i>&nbsp;'+message);
  // }
  // $('.server-message').addClass('show')
  // setTimeout(function(){
  // 	$('.server-message').removeClass('show');
  // }, 5000);

  // // $('#modalMessage').modal("show");
  // if(signupPage>0){
  // 	setTimeout(function(){
  // 		$('#modalMessage').modal("hide");
  // 	}, 3000);
  // 	setTimeout(function(){
  // 		tabActiveStatus(signupPage);
  // 	}, 1);
  // }

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
function hideMessage(id) {
  $("#errorHeading").html("");
  $("#statusMessage").removeClass("success-color");
  $("#statusMessage").removeClass("danger-color");
  $("#statusMessage").html("");
  $("#modalMessage").modal("hide");
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
  $("#" + id).addClass("show-errow-msg");
  $("#" + id).html(message);
}
function hideMessageErrorNew(id) {
  $("#" + id).removeClass("show-errow-msg");
  $("#" + id).html("");
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
function buildDropdown(result, dropdown, emptyMessage) {
  dropdown.html("");
  if (result != "") {
    dropdown.append('<option value="0">' + emptyMessage + "</option>");
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
  //dropdown.append('<option value="0">' + emptyMessage + '</option>');
  dropdown.append("<option disabled selected> </option>");
}
//var ajaxCalls = 0;
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
$(document).ajaxStart(function () {
  customLoader(true);
});
//$( document ).ajaxSend(function() {
//	customLoader(true);
//});
$(document).ajaxSuccess(function () {
  customLoader(false);
});
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
  customLoader(false);
  if (isJson(jqxhr.responseText)) {
    var parseResponse = JSON.parse(jqxhr.responseText);
    console.log("parse Response is:" + jqxhr.status);
    var hasProperty = parseResponse.hasOwnProperty("message");
    if (hasProperty) {
      showMessage(true, parseResponse.message);
    } else {
      showMessage(true, TECHNICAL_GLITCH);
    }
  } else {
    showMessage(true, TECHNICAL_GLITCH);
  }
});
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
  customLoader(false);
  if (checkonlineOfflineStatus()) {
    return;
  }
  if (isJson(jqxhr.responseText)) {
    var parseResponse = JSON.parse(jqxhr.responseText);
    console.log("parse Response is:" + jqxhr.status);
    var hasProperty = parseResponse.hasOwnProperty("message");
    if (hasProperty) {
      showMessage(true, parseResponse.message);
    } else {
      showMessage(true, TECHNICAL_GLITCH);
    }
  } else {
    showMessage(true, TECHNICAL_GLITCH);
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
function setPagePosition(position) {
  signupPage = position;
}
function increasePosition() {
  signupPage = signupPage + 1;
}
function decresePosition() {
  console.log(
    "signupPage: " + signupPage + " - " + " signupSubPage1: " + signupSubPage1
  );
  if (signupPage == 6) {
    if ($("#standardId5").val() >= 11 && $("#standardId5").val() <= 17) {
      signupSubPage1 = 3;
      signupPage = signupPage - 1;
      tabActiveStatus(signupPage);
    } else {
      if (signupSubPage1 == 1 || signupSubPage1 == 2) {
      } else {
        if ($("#standardId5").val() < 4) {
          signupSubPage1 = 2;
        } else {
          signupSubPage1 = 1;
        }
      }
      if (signupSubPage1 == 1) {
        // showOne();
      } else if (signupSubPage1 == 2) {
        // showTwo();
      }
      signupPage = signupPage - 1;
      tabActiveStatus(signupPage);
    }
  } else if (signupPage == 5) {
    if (SCHOOL_ID == 1) {
      if ($("#standardId5").val() >= 11 && $("#standardId5").val() <= 17) {
        signupPage = signupPage - 1;
        tabActiveStatus(signupPage);
      } else {
        if (signupSubPage1 == 4) {
          if (!elligibleForAPCourse) {
            signupSubPage1 = 2;
          } else {
            signupSubPage1 = 3;
          }
        } else if (signupSubPage1 == 3) {
          // showTwo();
          signupSubPage1 = 4;
          signupPage = 4;
          $("#signupSubPage1").val(signupSubPage1);
          tabActiveStatus(signupPage);
          return false;
        } else if (signupSubPage1 == 2) {
          if ($("#standardId5").val() < 4) {
            signupPage = signupPage - 1;
            tabActiveStatus(signupPage);
          } else {
            signupSubPage1 = 1;
            // showOne();
            tabActiveStatus(signupPage);
          }
        } else if (signupSubPage1 == 1) {
          signupPage = signupPage - 1;
          tabActiveStatus(signupPage);
        }
      }
    } else {
      signupPage = signupPage - 2;
      tabActiveStatus(signupPage);
    }
    $("#signupSubPage1").val(signupSubPage1);
  } else {
    if (signupPage <= 1) {
      signupPage = 1;
    } else if (signupPage == 2) {
      if (signupType == "Offline" || signupType == "Online-Flex") {
        signupPage = signupPage - 1;
      } else {
      }
    } else if (signupPage == 4) {
      if (signupType == "Offline" || signupType == "Online-Flex") {
        signupPage = signupPage - 2;
      } else {
      }
    } else {
      signupPage = signupPage - 1;
      if (moduleId == "SCHOOL_B2B") {
        $("#signupStage2 #declConfirmation").prop("checked", false);
      }
    }
    tabActiveStatus(signupPage);
  }
  $("#signupSubPage1").val(signupSubPage1);
  console.log("signupPage : " + signupPage);
}
function tabActiveStatus(tabPosition) {
  signupPage = tabPosition;
  $("#tabPosition" + tabPosition).trigger("click");
}

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
  if (
    !$("#" + formId + " #email")
      .val()
      .trim()
  ) {
    return true;
  }
  if (!validateRequestForEmailCheck(formId)) {
    return false;
  }
  $("#email").prop("disabled", true);
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: getURLForCommon("is-user-available"),
    data: JSON.stringify(getRequestForEmailCheck(formId, moduleId)),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        // if (data['statusCode'] == '0043') {
        // 	$('#allReadyEmail #emailNotVerify').show();
        // 	$('#allReadyEmailFooter').show();
        // 	$('#allReadyEmail #emailVerify').hide();
        // 	$('#allReadyEmail #userDeclined').hide();
        // 	$('#allReadyEmail').modal('toggle');
        // } else
        if (data["statusCode"] == "0044" || data["statusCode"] == "0043") {
          $("#allReadyEmail #emailNotVerify").hide();
          $("#allReadyEmail #emailVerify").show();
          $("#allReadyEmail #userDeclined").hide();
          $("#allReadyEmail").modal("toggle");
        } else if (data["statusCode"] == "02") {
          $("#allReadyEmail #emailNotVerify").hide();
          $("#allReadyEmail #emailVerify").hide();
          $("#allReadyEmail #userDeclined").show();
          $("#allReadyEmail").modal("toggle");
        } else {
          showMessage(true, data["message"]);
        }
      }
      $("#" + formId + " #email").prop("disabled", false);
      //refreshCaptcha('captchaImage');
      return false;
    },
    error: function (e) {
      //showMessage(true, e.responseText);
      console.log("ERROR : ", e);
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
    showMessage(false, "Email is either empty or invalid");
    return false;
  }
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
    showMessage(false, "Email is either empty or invalid");
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
      if (data["status"] == "0" || data["status"] == "2") {
        showMessage(true, "Email already exist");
        result = false;
      } else {
        result = true;
      }
    },
    error: function (e) {
      //showMessage(true, e.responseText);
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
  data["requestValue"] = emailId;
  data["requestExtra1"] = userRole;
  authentication["hash"] = getHash();
  authentication["schoolId"] = SCHOOL_ID;
  authentication["schoolUUID"] = SCHOOL_UUID;
  authentication["userType"] = module;
  request["authentication"] = authentication;
  request["data"] = data;
  return request;
}

function callCities(formId, value, elementId) {
  hideMessage("");
  if (!validateRequestForMaster(formId, elementId)) {
    if ($("#" + formId + " #cityId").val()) {
      $("#" + formId + " #cityId")
        .val()
        .trim(0);
    }
    resetDropdown($("#" + formId + " #cityId"), "Select city*");
    return false;
  }
  $("#" + formId + " #cityId").prop("disabled", true);
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: getURLForCommon("masters"),
    data: JSON.stringify(getRequestForMaster("formId", "CITIES-LIST", value)),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        showMessage(true, data["message"]);
      } else {
        buildDropdown(
          data["mastersData"]["cities"],
          $("#" + formId + " #cityId"),
          "Select city*"
        );
      }
      $("#" + formId + " #cityId").prop("disabled", false);
      return false;
    },
    error: function (e) {
      //showMessage(true, e.responseText);
      $("#" + formId + " #cityId").prop("disabled", false);
    },
  });
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
function getCountryTimezoneByTimeZone(formId, value, elementId) {
  hideMessage("");
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: getURLForCommon("masters"),
    data: JSON.stringify(
      getRequestForMaster(formId, "TIMEZONE-LIST-BY-OFFSET", value)
    ),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      console.log(data["status"]);
      if (data["status"] == "0" || data["status"] == "2") {
        showMessage(true, data["message"]);
      } else {
        $.each(data["mastersData"]["countryTimeZones"], function (k, v) {
          $("#" + formId + " #" + elementId).append(
            '<option value="' +
              v.key +
              '" data-timezone="' +
              v.extra4 +
              '">(' +
              v.extra +
              ") - " +
              v.extra1 +
              "/" +
              v.extra3 +
              "</option>"
          );
        });
      }
    },
  });
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
        showMessage(true, data["message"]);
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
    async: false,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        showMessage(true, data["message"]);
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
function callCountries(formId, value, elementId) {
  $("#" + formId + " #" + elementId).html(
    '<option value="">Select country*</option>'
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
        showMessage(true, data["message"]);
      } else {
        $.each(data["mastersData"]["countries"], function (k, v) {
          $("#" + formId + " #" + elementId).append(
            '<option value="' + v.key + '">' + v.value + "</option>"
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
}
function callStates(formId, value, elementId) {
  hideMessage("");
  console.log(value);
  if (!validateRequestForMaster(formId, elementId)) {
    $("#" + formId + " #stateId").val();
    resetDropdown($("#" + formId + " #stateId"), "Select State/Province*");
    $("#" + formId + " #cityId").val();
    resetDropdown($("#" + formId + " #cityId"), "Select city*");
    return false;
  }
  $("#" + formId + " #stateId").prop("disabled", true);
  resetDropdown($("#" + formId + " #cityId"), "Select city*");
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: getURLForCommon("masters"),
    data: JSON.stringify(getRequestForMaster(formId, "STATES-LIST", value)),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        showMessage(true, data["message"]);
      } else {
        buildDropdown(
          data["mastersData"]["states"],
          $("#" + formId + " #stateId"),
          "Select State/Province*"
        );
        if (formId == "inquiryForm") {
          $("#" + formId + " #countryCode").val(
            $("#" + formId + " #countryId")
              .val()
              .trim()
          );
        } else if (formId == "signupStage2") {
          $("#" + formId + " #countryCode").val(
            $("#" + formId + " #countryId option:selected").attr("dailCode")
          );
          $("#" + formId + " #countryCodeStudent").val(
            $("#" + formId + " #countryId option:selected").attr("dailCode")
          );
          //$('#'+formId+' #countryCodeAlternate').val($('#'+formId+' #countryId option:selected').attr('dailCode'));
        }
      }
      $("#" + formId + " #stateId").prop("disabled", false);
    },
    error: function (e) {
      //showMessage(true, e.responseText);
      $("#" + formId + " #stateId").prop("disabled", false);
    },
  });
}

function callStatesNew(formId, value, elementId, bindElementId) {
  hideMessage("");
  if (!validateRequestForMaster(formId, elementId)) {
    $("#" + formId + " #" + bindElementId).val(0);
    resetDropdown(
      $("#" + formId + " #" + bindElementId),
      "Select State/Province*"
    );
    $("#" + formId + " #cityId").val(0);
    resetDropdown($("#" + formId + " #cityId"), "Select city*");
    return false;
  }
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
      .trim() <= 0
  ) {
    return false;
  }
  return true;
}

function callForResetPassword(formId, moduleId) {
  hideMessage("");
  if (
    $("#password").val().trim() == "" &&
    $("#confirmPassword").val().trim() == ""
  ) {
    showMessage(false, "Fields are not valid");
    return false;
  } else if (
    $("#password").val().trim() != $("#confirmPassword").val().trim()
  ) {
    showMessage(false, "Password does not match.");
    return false;
  }
  if (!pattern.test($("#" + formId + " #password").val())) {
    showMessage(false, " New password must match all requirements", "", false);
    return false;
  }
  if (
    !pattern.test(
      $("#" + formId + " #confirmPassword")
        .val()
        .trim()
    )
  ) {
    showMessage(
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
    cache: false,
    timeout: 600000,
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
          $("#emialLimit #emailLimitText").html(data["message"]);
          $("#emialLimit").modal("toggle");
        } else {
          showMessage(true, data["message"]);
        }
      } else {
        showMessage(false, data["message"]);
      }
      $("#resendEmail").prop("disabled", false);
      return false;
    },
    error: function (e) {
      //showMessage(true, e.responseText);
      console.log("ERROR : ", e);
      $("#resendEmail").prop("disabled", false);
    },
  });
}

function validateForEmailResend(emailId) {
  //GLOBAL_EMAIL
  if (!validateEmail(emailId)) {
    showMessage(false, "Email is either empty or invalid");
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
    showMessage(true, "Country is required");
    return false;
  }
  if (
    $("#" + formId + " #stateId")
      .val()
      .trim() == 0 ||
    $("#" + formId + " #stateId").val() == null
  ) {
    showMessage(true, "State is required");
    return false;
  }
  if (
    $("#" + formId + " #cityId")
      .val()
      .trim() == 0 ||
    $("#" + formId + " #cityId").val() == null
  ) {
    showMessage(true, "City is required");
    return false;
  }
  if (
    $("#" + formId + " #name")
      .val()
      .trim() == ""
  ) {
    showMessage(true, "Name is required");
    return false;
  }

  if (
    !validateEmail(
      $("#" + formId + " #email")
        .val()
        .trim()
    )
  ) {
    showMessage(false, "Email is either empty or invalid");
    return false;
  }
  if (
    $("#" + formId + " #countryCode")
      .val()
      .trim() == 0
  ) {
    showMessage(true, "Country Code is required");
    return false;
  }

  if (
    $("#" + formId + " #contactNumber")
      .val()
      .trim() == 0
  ) {
    showMessage(true, "Contact Number is required");
    return false;
  }
  if (
    $("#" + formId + " #contactDescription")
      .val()
      .trim() == 0
  ) {
    showMessage(true, "Contact Description is required");
    return false;
  }

  if (
    !validateCaptcha(
      $("#" + formId + " #captcha")
        .val()
        .trim()
    )
  ) {
    showMessage(false, "Either captcha is empty or invalid");
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
        showMessage(true, data["message"]);
      } else {
        //customLoader(true);
        showMessage(false, data["message"]);
        // LOGIC TO DISPLAY DASHBOARD
        // LOGIC TO DISPLAY SIGN-PROCESS
      }
      $("#login").prop("disabled", false);
      return false;
    },
    error: function (e) {
      //showMessage(true, e.responseText);
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
          showMessage(true, uploadErrors.join("\n"));
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
        showMessage(true, MAX_SIZE_LIMIT);
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
          showMessage(true, uploadErrors.join("\n"));
          return false;
        }
        data.process().done(function () {
          data.submit();
        });
      },
      start: function (e) {
        customLoader(true);
        $("#" + uploadIndex)
          .parents(".file-tab")
          .find("span.fileName")
          .text();
      },
      send: function (e, data) {
        console.log("send");
      },
      done: function (e, data) {
        customLoader(false);
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
        showMessage(true, MAX_SIZE_LIMIT);
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
  $('[data-toggle="tooltip"]').tooltip({ trigger: "hover" });
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
            "Please upload files in following formats (jpg, jpeg, pdf or png)."
          );
        }
        if (
          (USER_ROLE != "TEACHER" &&
            data.originalFiles.length &&
            data.originalFiles[0]["size"] > 5242880) ||
          (USER_ROLE == "TEACHER" &&
            data.originalFiles.length &&
            data.originalFiles[0]["size"] > 10485760)
        ) {
          if (USER_ROLE == "TEACHER") {
            uploadErrors.push(MAX_SIZE_LIMIT_FOR_TEACHER);
          } else {
            uploadErrors.push(MAX_SIZE_LIMIT);
          }
          isError = true;
        }
        if (uploadErrors.length > 0) {
          showMessage(true, uploadErrors.join("\n"));
          return false;
        }
        data.process().done(function () {
          data.submit();
        });
      },
      start: function (e) {
        customLoader(true);
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
        customLoader(false);
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
                  if (data.originalFiles[0]["type"] == "application/pdf") {
                    showMessage(
                      true,
                      "Please upload files in following formats (jpg, jpeg or png)."
                    );
                    return false;
                  }
                }
              } else if (uploadMethodType == 2) {
                $("#fileupload" + uploadIndex)
                  .parents(".file-tab")
                  .find("span.fileName")
                  .text(file.fileName);
                console.log(
                  $("#fileupload" + uploadIndex)
                    .parents(".file-tab")
                    .find("span.fileName")
                    .text(file.fileName)
                );
                if (data.originalFiles[0]["type"] == "application/pdf") {
                  $("#fileupload" + uploadIndex)
                    .parents(".file-tab")
                    .find("img")
                    .attr("src", PATH_FOLDER_IMAGE + "pdf.jpg");
                }
                if (uploadCategoryId == 34) {
                  hideMessageErrorNew("fileupload1Error", "fileupload1");
                }
              } else if (uploadMethodType == 3) {
                $("#fileupload" + uploadIndex)
                  .parent("span")
                  .parent("p")
                  .parent("div")
                  .find("i")
                  .addClass("fa fa-check-circle-o");
                $("#fileupload" + uploadIndex)
                  .parent("span")
                  .parent("p")
                  .parent("div")
                  .find("h1")
                  .attr("style", "color:green");
                $("#fileupload" + uploadIndex)
                  .parent("span")
                  .parent("p")
                  .parent("div")
                  .find("span.fileName")
                  .html(file.fileName);
                $("#fileupload" + uploadIndex)
                  .parent("span")
                  .parent("p")
                  .find("a.view")
                  .next("a.remove")
                  .attr(
                    "href",
                    'javascript:removeDocument("' +
                      uploadIndex +
                      '","' +
                      uploadMethodType +
                      '");'
                  );
                $("#fileupload" + uploadIndex)
                  .parent("span")
                  .parent("p")
                  .find("a.view")
                  .next("a.remove")
                  .attr("style", "display:block;");
                $("#fileupload" + uploadIndex)
                  .parent("span")
                  .parent("p")
                  .find("a.view")
                  .attr("style", "display:block;");
                if (data.originalFiles[0]["type"] == "application/pdf") {
                  $("#fileupload" + uploadIndex)
                    .parent("span")
                    .parent("p")
                    .find("a.view")
                    .attr("target", "_blank");
                  $("#fileupload" + uploadIndex)
                    .parent("span")
                    .parent("p")
                    .find("a.view")
                    .attr("href", FILE_UPLOAD_PATH + file.fileName);
                } else {
                  $("#fileupload" + uploadIndex)
                    .parent("span")
                    .parent("p")
                    .find("a.view")
                    .attr("target", "_self");
                  $("#fileupload" + uploadIndex)
                    .parent("span")
                    .parent("p")
                    .find("a.view")
                    .attr(
                      "href",
                      'javascript:showDocument("' +
                        FILE_UPLOAD_PATH +
                        file.fileName +
                        '");'
                    );
                }
              } else if (uploadMethodType == 4) {
                $("#fileName" + uploadIndex).html(file.fileName);
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
              } else if (uploadMethodType == 5) {
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
                  //								$('#fileupload'+uploadIndex+'imgIcon').attr('src',PATH_FOLDER_IMAGE+'pdf.jpg');
                  setTimeout(function () {
                    $("#fileupload" + uploadIndex + "imgIcon").attr(
                      "src",
                      PATH_FOLDER_IMAGE + "pdf.jpg"
                    );
                  }, 3000);
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
                //$('#fileupload'+uploadIndex+'div').hide();
              } else if (uploadMethodType == 6) {
                $("#fileupload" + uploadIndex + "Span").html(file.fileName);
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
        //			console.log(uploadIndex+' fail '+e+" = "+data);
        //			console.log(uploadIndex+' fail '+index+" = "+file+' == '+file.name);
        if (uploadMethodType == 1) {
          //$('#fileupload'+uploadIndex+'Progress .progress-bar').css('width', 100 + '%');
          $("#fileupload" + uploadIndex + "ProgressStatus").addClass(
            "label-error"
          );
          showMessage(true, MAX_SIZE_LIMIT);
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
        showMessage(true, MAX_SIZE_LIMIT);
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
          showMessage(true, uploadErrors.join("\n"));
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
        showMessage(true, MAX_SIZE_LIMIT);
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
          showMessage(true, uploadErrors.join("\n"));
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
        customLoader(false);
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
        showMessage(true, MAX_SIZE_LIMIT);
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
  var serializedString = decodeURIComponent($("#" + formId).serialize());
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
        showMessage(true, data["message"]);
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
      //	showMessage(true, e.responseText);
      //$("#"+formId+" #pastTaughtSubjectId").prop("disabled", false);
    },
  });
}

//function callPlacementSubjectsByGradeId(formId, value, elementId, toElementId, requestExtra) {
//	hideMessage('');
//	resetDropdown($("#"+formId+" #"+toElementId), 'Select course');
//	if (!validateRequestForMasterGrade(formId, elementId)) {
//		$("#"+formId+" #"+elementId).val().trim(0);
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
//				showMessage(true, data['message']);
//			} else {
//				buildDropdown(data['mastersData']['subject'], $("#"+formId+" #"+toElementId), 'Select course');
//				$("#"+formId+" #pastTaughtSubjectId").prop("disabled", false);
//			}
//			$("#"+formId+" #pastTaughtSubjectId").prop("disabled", false);
//		},
//		error : function(e) {
//		//	showMessage(true, e.responseText);
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
        showMessage(true, data["message"]);
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
      //	showMessage(true, e.responseText);
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
    $("#" + formId + " #" + elementId).val(0);
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
        showMessage(true, data["message"]);
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
      //showMessage(true, e.responseText);
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
          showMessage(true, stringMessage[1]);
        } else {
          $("#teacherTaughtSubjectContent").html(htmlContent);
        }
        //return false;
      }
    },
    error: function (e) {
      //showMessage(true, e.responseText);
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
          showMessage(true, stringMessage[1]);
        } else {
          $("#teacherPreferredSubjectsContent").html(htmlContent);
        }
        //return false;
      }
    },
    error: function (e) {
      //showMessage(true, e.responseText);
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
        showMessage(true, data["message"]);
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
      //showMessage(true, e.responseText);
      $("#" + formId + " #pastTaughtSubjectId").prop("disabled", false);
    },
  });
}

function getRequestForMaster(formId, key, value, requestExtra, requestExtra1) {
  var request = {};
  var authentication = {};
  var requestData = {};
  requestData["requestKey"] = key;
  requestData["requestValue"] = value;
  if (requestExtra != undefined) {
    requestData["requestExtra"] = requestExtra;
  }
  if (requestExtra1 != undefined) {
    requestData["requestExtra1"] = requestExtra1;
  }
  authentication["hash"] = getHash();
  authentication["schoolId"] = SCHOOL_ID;
  authentication["schoolUUID"] = SCHOOL_UUID;
  authentication["userType"] = "COMMON";
  request["authentication"] = authentication;
  request["requestData"] = requestData;
  return request;
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
  if (requestExtra4 != undefined || requestExtra4 != "") {
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
          showMessage(true, stringMessage[1]);
        } else {
          //        			$('#subjectCatalogModalContent').html('');
          $("#subjectCatalogModalContent").html(htmlContent);
          $("#subjectCatalogModal").modal("show");
        }
      }
      return false;
    },
    error: function (e) {
      //showMessage(true, e.responseText);
    },
  });
}
function showWarningMessage(warningMessage, functionName) {
  if (functionName == "") {
    $("#resetDeleteErrorWarningYes").hide();
    $("#resetDeleteErrorWarningNo").hide();
    $("#resetDeleteErrorWarningCancel*").show();
  } else {
    $("#resetDeleteErrorWarningYes").show();
    $("#resetDeleteErrorWarningNo").show();
    $("#resetDeleteErrorWarningCancel*").hide();
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
    $(".withdraw").html(strText);
  } else {
    $(".withdraw").html(
      '<i class="fa fa-refresh fa-4x" style="color:#337ab7 !important;"></i>'
    );
  }
  $("#resetDeleteErrorWarningYes1").attr("onclick", functionName1);
  $("#remarksresetDelete1").modal("show");
}
function selectSubjectNew(src, flag, applicableClass, counterCheck) {
  if (flag) {
    if (!$(src).hasClass("greenDiv")) {
      $(src).addClass("greenDiv");
      var selSubjectd = "";
      $("." + applicableClass).each(function () {
        if ($(this).hasClass("greenDiv")) {
          selSubjectd = selSubjectd + "," + $(this).attr("id");
        }
      });
      selSubjectd = selSubjectd.substr(1);
      var choosenItems = selSubjectd.split(",").length;
      if (choosenItems <= parseInt(counterCheck)) {
      } else {
        $(src).removeClass("greenDiv");
        showMessage(
          true,
          "You cannot select more than " + counterCheck + " courses."
        );
      }
    } else {
      $(src).removeClass("greenDiv");
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

function copyToClipboardNew(originalValue) {
  $("#hiddenForCopy").attr("disabled", false);
  var copyText = document.getElementById("hiddenForCopy");
  copyText.value = originalValue;
  $(copyText).attr("type", "text").select();
  copyText.setSelectionRange(0, 99999);
  document.execCommand("copy");
  $(copyText).attr("type", "hidden");
}
function copyToClipboardText(originalValue) {
  var $tempInput = $("<input>");
  $("body").append($tempInput);
  $tempInput.val(originalValue).select();
  document.execCommand("copy");
  $tempInput.remove();
}

function copyToClipboard(elementId, showElement) {
  $("#" + elementId).attr("disabled", false);
  var copyText = document.getElementById(elementId);
  copyText.select();
  copyText.setSelectionRange(0, 99999);
  document.execCommand("copy");
  if (document.queryCommandSupported("copy")) {
    $("#" + showElement).show();
    showMessage(1, "Copy Successfully");
  } else {
    alert("Copying is not supported in your browser.");
  }
}
function copyToClipboardNew(elementId, messageElementId) {
  $("#" + elementId).attr("disabled", false);
  var copyText = document.getElementById(elementId);
  copyText.select();
  copyText.setSelectionRange(0, 99999);
  document.execCommand("copy");

  if (document.queryCommandSupported("copy")) {
    var messageElement = $("#" + messageElementId);
    messageElement.text("Copied successfully!");
    messageElement.css("display", "inline");
    messageElement.fadeIn(300).delay(3000).fadeOut(300);
  } else {
    alert("Copying is not supported in your browser.");
  }
}
function daysInMonth(month, year) {
  return new Date(year, month, 0).getDate();
}
function getDateList(yearId, monthId, dayId) {
  var yyVal = $("#" + yearId).val();
  var mmVal = $("#" + monthId).val();
  var ddVal = $("#" + dayId).val();
  var noOfDays = daysInMonth(mmVal, yyVal);
  $("#" + dayId).html('<option value="0">DD</option>');
  for (i = 1; i <= noOfDays; i++) {
    $("#" + dayId).append('<option value="' + i + '">' + i + "</option>");
  }
}
function createSelect2Element(formId, elementId) {
  if (
    $("#" + formId + " #" + elementId).hasClass("select2-hidden-accessible")
  ) {
    $("#" + formId + " #" + elementId).select2("destroy");
  }
  $("#" + formId + " #" + elementId).select2();
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
  requestExtra4,
  requestExtra5
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
        requestExtra4,
        requestExtra5
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
        var studentList = data["mastersData"]["studentList"];
        if (studentList.length > 0) {
          if (formId == "extraActivityForm") {
            showMessage(true, "User list fetched successfully");
          }
          buildDropdown(
            data["mastersData"]["studentList"],
            $("#" + formId + " #" + toElementId),
            "Select"
          );
        } else {
          if (formId == "extraActivityForm") {
            showMessage(true, "User not found");
          }
        }
      }
    },
    error: function (e) {
      //showMessage(true, e.responseText);
      $("#" + formId + " #pastTaughtSubjectId").prop("disabled", false);
    },
  });
}

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

$(document).on("show.bs.modal", ".modal", function (e) {
  var inputElement = e.target.id;
  var isModal = $("#" + inputElement).hasClass("modal");

  if (!isModal) {
    var isDatepickerOpen = $("#" + inputElement)
      .datepicker("getDatePicker")
      .is(":visible");

    if (!isDatepickerOpen) {
      // Check if datepicker is already destroyed
      if ($("#" + inputElement).data("datepicker")) {
        $("#" + inputElement).datepicker("destroy");

        const zIndex = 1040 + 10 * $(".modal-backdrop").length;
        $(this).css({ "z-index": zIndex });

        setTimeout(() =>
          $(".modal-backdrop")
            .not(".modal-stack")
            .css("z-index", zIndex - 1)
            .addClass("modal-stack")
        );
      }
    }
  } else {
    // Handle modal-specific logic if needed
    const zIndex = 1040 + 10 * $(".modal-backdrop").length;
    $(this).css({ "z-index": zIndex });

    setTimeout(() =>
      $(".modal-backdrop")
        .not(".modal-stack")
        .css("z-index", zIndex - 1)
        .addClass("modal-stack")
    );
  }
});

$(document).on("hidden.bs.modal", function () {
  if ($(".modal.show").length < 1) {
    $(".modal-backdrop").remove();
    $(".navbar-toggler").css("margin-right", "0px");
  }
});

$(document).on("hidden.bs.modal", ".modal", function (e) {
  var visibleModalLength = $(".modal.fade.show").length;
  if (visibleModalLength == 0) {
    $(".modal-backdrop").remove();
  } else {
    $("body").addClass("modal-open");
  }
});

function convertTZ(date, tzString) {
  return new Date(
    (typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {
      timeZone: tzString,
    })
  );
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

function getDatepickerChangeVal(src) {
  var dates = $(src).val();
  var splitDates = dates.split(/(\d{4})/).filter(Boolean);
  for (let i = 1; i < splitDates.length; i += 2) {
    splitDates[i - 1] += splitDates[i];
    splitDates.splice(i, 1);
  }
  $(src).val(splitDates[0]);
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

function validateSelectedDateWithMinandMaxDate(
  selectedDate,
  minMonthBeforeNumber,
  maxMonthAfterNumber
) {
  var sixMonthAgoDate = new Date();
  var nextYearMaxDate = new Date();
  var selectDate = selectedDate.split("-");
  selectedDate = new Date(
    selectDate[2] + "-" + selectDate[0] + "-" + selectDate[1]
  );
  sixMonthAgoDate.setMonth(sixMonthAgoDate.getMonth() - minMonthBeforeNumber);
  nextYearMaxDate.setMonth(nextYearMaxDate.getMonth() + maxMonthAfterNumber);
  if (selectedDate >= sixMonthAgoDate && selectedDate <= nextYearMaxDate) {
    return true;
  }
  return false;
}
function convertMsToTime(milliseconds) {
  let seconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);

  seconds = seconds % 60;
  minutes = minutes % 60;
  hours = hours % 24;

  return `${padTo2Digits(hours)}h ${padTo2Digits(minutes)}m ${padTo2Digits(
    seconds
  )}s`;
}
function padTo2Digits(num) {
  return num.toString().padStart(2, "0");
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
  //console.log(params);
  var data = {};
  data["userId"] = USER_ID;
  var splittedParams = params.split("?");
  if (splittedParams.length > 1) {
    var splittedParams1 = splittedParams[1].split("&");
    var sessionIds = [];
    for (index = 0; index < splittedParams1.length; index++) {
      var splittedParams2 = splittedParams1[index].split("=");
      if (splittedParams2[0] == "sessionId") {
        sessionIds.push(splittedParams2[1]);
        data[splittedParams2[0]] = sessionIds;
      } else {
        data[splittedParams2[0]] = splittedParams2[1];
      }
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
    .removeClass("text-success text-danger")
    .addClass(success ? "text-success" : "text-danger")
    .text(message);

  // Clear the message after 3 seconds
  setTimeout(() => {
    messageElement.text("");
  }, 3000);
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
  return hours + ":" + minutes;
}

function autodiposeModel(modelId) {
  window.setTimeout(function () {
    $("#" + modelId).modal("hide");
  }, 10000);
}

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
$(document).ready(function(){
	detectBrave();
});

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

function showMessageTheme2(messageType, message, id, msgHide,timer) {
	if(timer==undefined || timer==null || timer==''){
		timer=6000;
	}
	if (message == '') {
		return false;
	} else {
		hideMessageTheme2(id);
		$('#msgTheme2').removeClass('error');
		$('#msgTheme2').removeClass('success');
		$('#msgTheme2').removeClass('notification');
		if (messageType == 0) {
			$('#msgTheme2').addClass('error')
			$('#msgTheme2').html('<i class="fa fa-exclamation-triangle"></i>&nbsp;' + message);
		} else if (messageType == 1) {
			$('#msgTheme2').addClass('success')
			$('#msgTheme2').html('<i class="fa fa-check"></i>&nbsp;' + message);
		} else if (messageType == 2) {
			$('#msgTheme2').addClass('notification')
			$('#msgTheme2').html('<i class="fa fa-info"></i>&nbsp;' + message);
		}
		$('.server-message').addClass('show')
		if (msgHide) {
			setTimeout(function () {
				$('#msgTheme2').html('')
				$('.server-message').removeClass('show');
			}, timer);
		}else{
			setTimeout(function () {
				$('.server-message').removeClass('show');
			}, timer);
		}
	}
}

function showMessageTheme2Content(){
	var html =
	`<div class="server-message">
		<span class="msg" id="msgTheme2"></span>
	</div>`
	return html;
}
$("#msgTheme2").click(function () { $('.server-message').removeClass('show'); })
function hideMessageTheme2(id) {
	$('#msgTheme2').html('');
	$('.server-message').removeClass('show');
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