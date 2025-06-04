$(document).ready(function () {
  $("#CB").click(function () {
    $("#callbackReason").show();
    $("#demoDate").show();
    $("#demoLabel").hide();
    $("#callbackLabel").show();
    $("#demoSlot").show();
    $("#dateLabelTitle").html("Select Date for Callback*");
    $("#demoTimeTitle").html("Select Time for Callback*");
    //$('.message-div').hide();
    $(".inquirySubmit").css("display", "none");
    $(".reqeustDemo").css("display", "none");
    $(".callBackSubmit").css("display", "block");
    $("#leadType").val("CB");
    // callDateListForDemo();
  });
  $("#I").click(function () {
    $("#callbackReason").hide();
    $("#demoDate").hide();
    $("#demoSlot").hide();
    $(".message-div").show();
    $(".inquirySubmit").css("display", "block");
    $(".reqeustDemo").css("display", "none");
    $(".callBackSubmit").css("display", "none");
    $("#leadType").val("I");
  });
  $("#BD").click(function () {
    $("#callbackReason").hide();
    $("#demoDate").show();
    $("#demoLabel").show();
    $("#demoSlot").show();
    $("#dateLabelTitle").html("Select Date for Demo*");
    $("#demoTimeTitle").html("Select Time for Demo*");
    //$('.message-div').hide();
    $(".inquirySubmit").css("display", "none");
    $(".reqeustDemo").css("display", "block");
    $(".callBackSubmit").css("display", "none");
    // callDateListForDemo();
    $("#leadType").val("BD");
  });
  $(".formtab label").click(function () {
    var selectedTab = $(this).parent().find("input").attr("value");
    $(".formClass").attr("id", selectedTab);
    $(".formClass").attr("name", selectedTab);
  });
  var scriptExecuted = false;
  if (!scriptExecuted) {
    var inputContact = document.querySelector("#userphone");
    itiContcat = window.intlTelInput(inputContact, {
      separateDialCode: true,
    });
    inputContact.addEventListener("countrychange", function (e) {
      $("#isdCodeStudentIcon").val(itiContcat.getSelectedCountryData().iso2);
      $("#isdCodeMobileNo").val(itiContcat.getSelectedCountryData().dialCode);
      $("#isdCodeWtspStudentIcon").val(
        itiContcat.getSelectedCountryData().iso2
      );
      $("#isdCodeWtspStudent").val(
        itiContcat.getSelectedCountryData().dialCode
      );
    });
    if ($("#wtspNumber").length > 0) {
      var inputContact2 = document.querySelector("#wtspNumber");
      itiContcat2 = window.intlTelInput(inputContact2, {
        separateDialCode: true,
      });
      inputContact2.addEventListener("countrychange", function (e) {
        $("#isdCodeWtspStudentIcon").val(
          itiContcat2.getSelectedCountryData().iso2
        );
        $("#isdCodeWtspStudent").val(
          itiContcat2.getSelectedCountryData().dialCode
        );
        $("#isdCodeStudentIcon").val(itiContcat2.getSelectedCountryData().iso2);
        $("#isdCodeMobileNo").val(
          itiContcat2.getSelectedCountryData().dialCode
        );
      });
    }
    scriptExecuted = true;
  }

  $(".same-as").css({ opacity: "0.5" });
  $("#chooseDate, #countryTimezoneId").on("change", function (e) {
    var meetingDate = $(this).val();
    if (meetingDate != "") {
      var formId = $(".formClass").attr("id");
      callCommonFreeSlotsList(formId);
    } else {
      $("#selectedMeetingDate").html("");
      $("#bookMeetingslot").removeClass("active");
    }
  });
  $("#stateId").on("change", function (e) {
    console.log(e.target.value);
    callCities("b2bRequest", e.target.value, "stateId");
  });
  $("#countryId").on("change", function (e) {
    getCountryOtpFlag(e.target.value);
    let countryId = $("#b2bRequest #countryId option:selected").attr(
      "custom_country_value"
    );
    callStates("b2bRequest", countryId, "countryId");
    if (
      !(
        $("#isOtpVerifed").val() == "Y" &&
        ($("#otpVerifiedBy").val() == "N" || $("#otpVerifiedBy").val() == "W")
      )
    ) {
      inputContact = document.querySelector("#userphone");
      itiContcat.setCountry("");
      itiContcat.setCountry(
        $("#countryId option:selected").attr("custom_country_icon")
      );
      $("#isdCodeMobileNoIcon").val(itiContcat.getSelectedCountryData().iso2);
      $("#isdCodeMobileNo").val(itiContcat.getSelectedCountryData().dialCode);
      // if ($('#leadType').val() == 'BD') {
      if ($("#wtspNumber").length > 0) {
        inputContact2 = document.querySelector("#wtspNumber");
        itiContcat2.setCountry("");
        itiContcat2.setCountry(
          $("#countryId option:selected").attr("custom_country_icon")
        );
        $("#isdCodeWhatsupNoIcon").val(
          itiContcat2.getSelectedCountryData().iso2
        );
        $("#isdCodeWhatsupNo").val(
          itiContcat2.getSelectedCountryData().dialCode
        );
      }
    }
    // }
    // sendOTPVia("N")
  });
  $("#sameWhatsapp").on("click", function () {
    var phoneNoValue = $("#userphone").val();
    var dialCode = $("#isdCodeStudentIcon").val();
    if ($(this).is(":checked") == true) {
      $("#wtspNumber").val(phoneNoValue);
      $("#userphone").attr("disabled", true).css({ background: "#e3e3e3" });
      if ($("#wtspNumber").length > 0) {
        $("#wtspNumber").attr("disabled", true).css({ background: "#e3e3e3" });
        itiContcat2.setCountry("");
        itiContcat2.setCountry(dialCode);
        $("#isdCodeWtspStudentIcon").val(
          itiContcat2.getSelectedCountryData().iso2
        );
        $("#isdCodeWtspStudent").val(
          itiContcat2.getSelectedCountryData().dialCode
        );
      }
    } else {
      if ($("#wtspNumber").length > 0) {
        $("#wtspNumber").val("");
        $("#wtspNumber").attr("disabled", false).css({ background: "#fff" });
      }
      $("#userphone").attr("disabled", false).css({ background: "#fff" });
    }
  });
  $("#userphone").on("keyup", function () {
    var PhoneNumLength = $("#userphone").val().length;
    if (PhoneNumLength > 6) {
      $("#sameWhatsapp").attr("disabled", false);
      $(".same-as").css({ opacity: "1" });
    } else {
      if ($("#wtspNumber").length > 0) {
        $("#wtspNumber").val("");
      }
      $("#sameWhatsapp").prop("checked", false);
      $("#sameWhatsapp").attr("disabled", true);
      $(".same-as").css({ opacity: "0.5" });
    }
  });
  callCountries("b2bRequest", 0, "countryId");
  getAllCountryTimezone("b2bRequest", 0, "countryTimezoneId");
  getGrades("b2bRequest", "grade", getGradesData(actualGrades));
  getDefaultDateListForDemo("b2bRequest", "chooseDate", MAX_LIMIT);
  callLocationAndSelectCountryNew("b2bRequest");

  $("#wtspNumber").on("keyup", function () {
    var e = $("#wtspNumber").val().length;
    if (e > 5 && e < 11) {
      $(".send-otp").removeClass("disable-btn");
    } else {
      $(".send-otp").addClass("disable-btn");
    }
  });

  $("#userphone").on("keyup", function () {
    var e = $("#userphone").val().length;
    if (e > 5 && e < 11) {
      $(".send-otp-to-phone").removeClass("disable-btn");
    } else {
      $(".send-otp-to-phone").addClass("disable-btn");
    }
  });

  // $("#resendOTP").on("click", function() {
  // 	hideMessageRequestDemoPage("isdCodeMobileNoError", "userphone");
  // 	hideMessageRequestDemoPage("otpCodeError", "otpCode");
  // 	if (M.isMobile($("#userphone").val()) == null) {
  // 		showMessageRequestDemoPage(true, "Phone no. is either empty or invalid", "isdCodeMobileNoError", "userphone");
  // 		return false
  // 	}
  // 	var e = $(".formClass").attr("id");
  // 	callForOTP(e, "B2B", 2, "S", "REQUEST-DEMO", "0")
  // });
  $(".change-number").on("click", function () {
    hideMessageRequestDemoPage("wtspNumberNoError", "wtspNumber");
    hideMessageRequestDemoPage("otpCodeNumberError", "verifyOTP");
    hideMessageRequestDemoPage("otpCodeNumberError", "otpCodeNumber");
    hideMessageRequestDemoPage("emailError", "email");
    hideMessageRequestDemoPage("otpCodeEmailError", "verifyOTP");
    hideMessageRequestDemoPage("otpCodeEmailError", "otpCodeEmail");
    hideMessageRequestDemoPage("isdCodeMobileNoError", "userphone");
    hideMessageRequestDemoPage("otpCodePhoneNumberError", "verifyOTP");
    hideMessageRequestDemoPage("otpCodePhoneNumberError", "otpCodePhoneNumber");
    $(".otp-message").css("display", "inline-block");
    $(".otp-field-wrapper").css("display", "none");
    $(".change-number").addClass("hide-btn");
    if ($(this).parent().hasClass("via_email_otp_btns")) {
      $("#email").attr("disabled", false);
      $(".send-otp-to-mail").removeClass("hide-btn").addClass("disable-btn");
      $("#email").val("");
      $("#otpCodeEmail").val("");
    } else if ($(this).parent().hasClass("via_phone_otp_btns")) {
      $("#userphone").attr("disabled", false);
      $(".send-otp-to-phone").removeClass("hide-btn").addClass("disable-btn");
      $("#userphone").val("");
      $("#otpCodePhoneNumber").val("");
    } else {
      $("#wtspNumber").attr("disabled", false);
      $(".send-otp").removeClass("hide-btn").addClass("disable-btn");
      $("#wtspNumber").val("");
      $("#otpCodeNumber").val("");
    }
  });
  $(".change-email").on("click", function () {
    hideMessageRequestDemoPage("emailError", "email");
    hideMessageRequestDemoPage("otpCodeError", "verifyOTP");
    hideMessageRequestDemoPage("otpCodeError", "otpCodeEmail");
    $("#email").val("");
    $("#otpCodeEmail").val("");
    $("#email").attr("disabled", false);
    $(".otp-message").css("display", "inline-block");
    $(".otp-field-wrapper").css("display", "none");
    $(".send-otp").removeClass("hide-btn").addClass("disable-btn");
    $(".change-number").addClass("hide-btn");
  });
  // $("#verifyOTP").click(function() {
  // 	hideMessageRequestDemoPage("wtspNumberNoError", "wtspNumber");
  // 	hideMessageRequestDemoPage("otpCodeError", "otpCode");
  // 	if ($("#otpCode").val().length != 6) {
  // 		showMessageRequestDemoPage(true, "Please enter valid OTP", "otpCodeError", "otpCode");
  // 		return false
  // 	}
  // 	var e = $(".formClass").attr("id");
  // 	callForOTP(e, "B2B", 3, "S", "B2B-SCHOOL", "0")
  // });
  $("#email").on("keyup", function () {
    if (validateEmail($("#email").val())) {
      $(".send-otp-to-mail").removeClass("disable-btn");
    } else {
      $(".send-otp-to-mail").addClass("disable-btn");
    }
  });
});

function resendOTP(usinfBy) {
  if (usinfBy == "email") {
    hideMessageRequestDemoPage("emailError", "email");
    hideMessageRequestDemoPage("otpCodeEmailError", "otpCodeEmail");
    if ($("#email").val() == null) {
      showMessageRequestDemoPage(
        true,
        "Email is either empty or invalid",
        "emailError",
        "email"
      );
      return false;
    }
    var e = $(".formClass").attr("id");
    $("#otpCodeEmail").val("");
    callForOTP(e, "B2B", 2, "S", "B2B-REQUEST", "0", "E");
  } else if (usinfBy == "phone_number") {
    hideMessageRequestDemoPage("isdCodeMobileNoError", "userphone");
    hideMessageRequestDemoPage("otpCodePhoneNumberError", "otpCodePhoneNumber");
    if (M.isNRIMobile($("#userphone").val()) == null) {
      showMessageRequestDemoPage(
        true,
        "Number is either empty or invalid",
        "isdCodeMobileNoError",
        "userphone"
      );
      return false;
    }
    var e = $(".formClass").attr("id");
    $("#otpCodePhoneNumber").val("");
    callForOTP(e, "B2B", 2, "S", "B2B-REQUEST", "0", "N");
  } else {
    hideMessageRequestDemoPage("wtspNumberNoError", "wtspNumber");
    hideMessageRequestDemoPage("otpCodeNumberError", "otpCodeNumber");
    if (M.isNRIMobile($("#wtspNumber").val()) == null) {
      showMessageRequestDemoPage(
        true,
        "WhatsApp Number is either empty or invalid",
        "wtspNumberNoError",
        "wtspNumber"
      );
      return false;
    }
    var e = $(".formClass").attr("id");
    $("#otpCodeNumber").val("");
    callForOTP(e, "B2B", 2, "S", "B2B-REQUEST", "0", "W");
  }
}

function sendOTP(via) {
  if (via == "email") {
    hideMessageRequestDemoPage("emailError", "email");
    if (!validateEmail($("#email").val())) {
      showMessageRequestDemoPage(
        true,
        "Email is either empty or invalid",
        "emailError",
        "email"
      );
      return false;
    }
    $("#otpVerifiedBy").val("E");
    var e = $(".formClass").attr("id");
    callForOTP(e, "B2B", 1, "S", "B2B-REQUEST", "0", "E");
  } else if (via == "phone_no") {
    hideMessageRequestDemoPage("isdCodeMobileNoError", "userphone");
    if (M.isNRIMobile($("#userphone").val()) == null) {
      showMessageRequestDemoPage(
        true,
        "Number is either empty or invalid",
        "isdCodeMobileNoError",
        "userphone"
      );
      return false;
    }
    $("#otpVerifiedBy").val("N");
    var e = $(".formClass").attr("id");
    callForOTP(e, "B2B", 1, "S", "B2B-REQUEST", "0", "N");
  } else {
    hideMessageRequestDemoPage("wtspNumberNoError", "wtspNumber");
    if (M.isNRIMobile($("#wtspNumber").val()) == null) {
      showMessageRequestDemoPage(
        true,
        "WhatsApp Number is either empty or invalid",
        "wtspNumberNoError",
        "wtspNumber"
      );
      return false;
    }
    $("#otpVerifiedBy").val("W");
    var e = $(".formClass").attr("id");
    callForOTP(e, "B2B", 1, "S", "B2B-REQUEST", "0", "W");
  }
}

function verifyOTP(via) {
  if (via == "email") {
    hideMessageRequestDemoPage("emailError", "email");
    hideMessageRequestDemoPage("otpCodeEmailError", "otpCodeEmail");
    if ($("#otpCodeEmail").val().length != 6) {
      showMessageRequestDemoPage(
        true,
        "Please enter valid OTP",
        "otpCodeEmailError",
        "otpCodeEmail"
      );
      return false;
    }
    var e = $(".formClass").attr("id");
    callForOTP(e, "B2B", 3, "S", "B2B-REQUEST", "0", "E");
  } else if (via == "phone_number") {
    hideMessageRequestDemoPage("isdCodeMobileNoError", "userphone");
    hideMessageRequestDemoPage("otpCodePhoneNumberError", "otpCodePhoneNumber");
    if ($("#otpCodePhoneNumber").val().length != 6) {
      showMessageRequestDemoPage(
        true,
        "Please enter valid OTP",
        "otpCodePhoneNumberError",
        "otpCodePhoneNumber"
      );
      return false;
    }
    var e = $(".formClass").attr("id");
    callForOTP(e, "B2B", 3, "S", "B2B-REQUEST", "0", "N");
  } else {
    hideMessageRequestDemoPage("wtspNumberNoError", "wtspNumber");
    hideMessageRequestDemoPage("otpCodeNumberError", "otpCodeNumber");
    if ($("#otpCodeNumber").val().length != 6) {
      showMessageRequestDemoPage(
        true,
        "Please enter valid OTP",
        "otpCodeNumberError",
        "otpCodeNumber"
      );
      return false;
    }
    var e = $(".formClass").attr("id");
    callForOTP(e, "B2B", 3, "S", "B2B-REQUEST", "0", "W");
  }
}

function getDefaultDateListForDemo(formId, elementId, limit) {
  var currentDate = new Date();
  for (var index = 0; index < limit; index++) {
    $("#" + formId + " #" + elementId).append(
      '<option value="' +
        changeDateFormat(currentDate, "mm-dd-yyyy") +
        '">' +
        changeDateFormat(currentDate, "MMM-dd-yyyy") +
        "</option>"
    );
    currentDate.setDate(currentDate.getDate() + 1);
  }
}

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
      months[date.getMonth()] +
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
function removeAllError(formId) {
  var elements = [
    "username",
    "lastName",
    "wtspNumber",
    "wtspNumberNoError",
    "email",
    "isdCodeMobileNo",
    "countryId",
    "cityId",
    "contactNumber",
    "stateId",
    "userphone",
  ];
  for (var index = 0; index < elements.length; index++) {
    if ($("#" + formId + " #" + elements[index]).length) {
      $("#" + formId + " #" + elements[index]).removeClass("error");
      $("#" + formId + " #" + elements[index])
        .next("p")
        .html("");
    }
  }
  hideServerError(formId, "serverError");
  hideMessageRequestDemoPage("recaptchaError", "");
}
function showServerError(isError, formId, elementId, errorMessage) {
  $("#" + formId + " #" + elementId).html(errorMessage);
  if (isError) {
    $("#" + formId + " #" + elementId).removeClass("server-success");
    $("#" + formId + " #" + elementId).addClass("server-error");
  } else {
    $("#" + formId + " #" + elementId).addClass("server-success");
    $("#" + formId + " #" + elementId).removeClass("server-error");
  }
}
function hideServerError(formId, elementId) {
  $("#" + formId + " #" + elementId).html("");
}

function validateRequestForMaster(formId, elementId) {
  if (
    $("#" + formId + " #" + elementId).val() == "" ||
    $("#" + formId + " #" + elementId).val() <= 0
  ) {
    return false;
  }
  return true;
}
function getRequestForMasterNew(key, value) {
  var MasterRequestDTO = {};
  MasterRequestDTO["requestKey"] = key;
  MasterRequestDTO["requestValue"] = value;

  // var payload = {};
  // payload['payload'] = encode(JSON.stringify(MasterRequestDTO));
  return MasterRequestDTO;
}
function encode(payload) {
  return window.btoa(encodeURI(payload));
}
function getGradesData(requiredGrades) {
  var grades = [];
  for (var index = 0; index < requiredGrades.length; index++) {
    var gradeK = {};
    if (requiredGrades[index] == "N") {
      gradeK["key"] = 17;
      gradeK["value"] = "Nursery";
      grades.push(gradeK);
    } else if (requiredGrades[index] == "KG") {
      gradeK["key"] = 11;
      gradeK["value"] = "KG";
      grades.push(gradeK);
    } else if (requiredGrades[index] == "1") {
      gradeK["key"] = 12;
      gradeK["value"] = "Grade 1";
      grades.push(gradeK);
    } else if (requiredGrades[index] == "2") {
      gradeK["key"] = 13;
      gradeK["value"] = "Grade 2";
      grades.push(gradeK);
    } else if (requiredGrades[index] == "3") {
      gradeK["key"] = 14;
      gradeK["value"] = "Grade 3";
      grades.push(gradeK);
    } else if (requiredGrades[index] == "4") {
      gradeK["key"] = 15;
      gradeK["value"] = "Grade 4";
      grades.push(gradeK);
    } else if (requiredGrades[index] == "5") {
      gradeK["key"] = 16;
      gradeK["value"] = "Grade 5";
      grades.push(gradeK);
    } else if (requiredGrades[index] == "6") {
      gradeK["key"] = 1;
      gradeK["value"] = "Grade 6";
      grades.push(gradeK);
    } else if (requiredGrades[index] == "7") {
      gradeK["key"] = 2;
      gradeK["value"] = "Grade 7";
      grades.push(gradeK);
    } else if (requiredGrades[index] == "8") {
      gradeK["key"] = 3;
      gradeK["value"] = "Grade 8";
      grades.push(gradeK);
    } else if (requiredGrades[index] == "9") {
      gradeK["key"] = 4;
      gradeK["value"] = "Grade 9";
      grades.push(gradeK);
    } else if (requiredGrades[index] == "10") {
      gradeK["key"] = 5;
      gradeK["value"] = "Grade 10";
      grades.push(gradeK);
    } else if (requiredGrades[index] == "11") {
      gradeK["key"] = 6;
      gradeK["value"] = "Grade 11";
      grades.push(gradeK);
    } else if (requiredGrades[index] == "12") {
      gradeK["key"] = 7;
      gradeK["value"] = "Grade 12";
      grades.push(gradeK);
    }
  }
  return grades;
}
function getGrades(formId, elementId, grades) {
  $.each(grades, function (k, v) {
    $("#" + formId + " #" + elementId).append(
      '<option grade_id="' +
        v.key +
        '" value="' +
        v.value +
        '">' +
        v.value +
        "</option>"
    );
  });
}
function getAllCountryTimezone(formId, value, elementId) {
  $.each(JSON.parse(tomezoneAsJson).countryTimezoneList, function (k, v) {
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

function callCountries(formId, value, elementId) {
  $("#" + formId + " #" + elementId).html(
    '<option value="">Select country*</option>'
  );
  var dropdown = $("#" + formId + " #" + elementId);
  $.each(JSON.parse(countriesAsJson).data, function (k, v) {
    dropdown.append(
      '<option custom_country_icon="' +
        v.extra +
        '" custom_dial_code="' +
        v.extra1 +
        '" value="' +
        v.value +
        '" custom_country_value="' +
        v.key +
        '"> ' +
        v.value +
        "</option>"
    );
  });
}
function callLocationAndSelectCountryNew(formId) {
  $.ajax({
    global: false,
    type: "GET",
    url: PRO_IP_API_URL,
    success: function (data) {
      callLocationAndSelectCountryNewFill(formId, data);
    },
    error: function(e){
      if (checkonlineOfflineStatus()) {
				return;
			}
    }
  });
}

function callLocationAndSelectCountryNewFill(formId, data) {
  if (data != undefined && data != "") {
    if ($("#" + formId + " #countryTimezoneId").length) {
      $("#countryTimezoneId").val(data.timezone).trigger("change");
    }
    $("#countryId").val(data.country).trigger("change");
    $("#" + formId + " #location").val(JSON.stringify(data));
  }
}

function showErrorForPPC(formId, elementId, message) {
  $("#" + formId + " #" + elementId).addClass("error");
  $("#" + formId + " #" + elementId)
    .next("p")
    .html(message);
}

function validateRequestForB2BRequest(formId) {
  removeAllError(formId);
  var flag = true;
  if (
    $("#" + formId + " #username").val() == "" ||
    $("#" + formId + " #username").val() == null
  ) {
    showMessageRequestDemoPage(
      false,
      "First name is required",
      "usernameError",
      "username"
    );
    flag = false;
  }
  if (
    $("#" + formId + " #lastName").val() == "" ||
    $("#" + formId + " #lastName").val() == null
  ) {
    showMessageRequestDemoPage(
      false,
      "Last name is required",
      "lastNameError",
      "lastName"
    );
    flag = false;
  }
  if (!validateEmail($("#" + formId + " #email").val())) {
    showMessageRequestDemoPage(
      false,
      "Email is either empty or invalid",
      "emailError",
      "email"
    );
    flag = false;
  }
  if (
    $("#" + formId + " #countryId").val() == "" ||
    $("#" + formId + " #countryId").val() == null
  ) {
    showMessageRequestDemoPage(
      false,
      "Country is required",
      "countryIdError",
      "countryId"
    );
    flag = false;
  }
  if (
    $("#" + formId + " #stateId").val() == "" ||
    $("#" + formId + " #stateId").val() == null ||
    $("#" + formId + " #stateId").val() == "0"
  ) {
    showMessageRequestDemoPage(
      false,
      "State/Province is required",
      "stateIdError",
      "stateId"
    );
    flag = false;
  }
  if (
    $("#" + formId + " #cityId").val() == "" ||
    $("#" + formId + " #cityId").val() == null ||
    $("#" + formId + " #cityId").val() == "0"
  ) {
    showMessageRequestDemoPage(
      false,
      "City is required",
      "cityIdError",
      "cityId"
    );
    flag = false;
  }
  // if ($("#" + formId + " #userphone").val() == '' || $("#" + formId + " #userphone").val() == null) {
  // 	showMessageRequestDemoPage(true, 'Phone Number is either empty or invalid', 'isdCodeMobileNoError', 'userphone');
  // 	flag = false;
  // }
  if (
    $("#" + formId + " #isdCodeMobileNo").val() == "" ||
    $("#" + formId + " #isdCodeMobileNo").val() == null
  ) {
    showMessageRequestDemoPage(
      false,
      "ISD Code is required",
      "isdCodeMobileNoError",
      "isdCodeMobileNo"
    );
    flag = false;
  }
  if (
    $("#" + formId + " #preOtpVerifiedBy").val() == "N" ||
    $("#" + formId + " #preOtpVerifiedBy").val() == "E"
  ) {
    if (
      $("#" + formId + " #userphone").val() == "" ||
      $("#" + formId + " #userphone").val() == null ||
      $("#" + formId + " #userphone").val() == "0"
    ) {
      showMessageRequestDemoPage(
        false,
        "Phone Number is either empty or invalid",
        "isdCodeMobileNoError",
        "userphone"
      );
      flag = false;
    }
    // else{
    // 	hideMessageRequestDemoPage("isdCodeMobileNoError","isdCodeMobileNoError")
    // }
    if (
      $("#" + formId + " #email").val() == "" ||
      $("#" + formId + " #email").val() == null ||
      $("#" + formId + " #email").val() == "0"
    ) {
      showMessageRequestDemoPage(
        false,
        "Email is either empty or invalid",
        "otpCodeEmailError",
        "email"
      );
      flag = false;
    }
    // else{
    // 	hideMessageRequestDemoPage("isdCodeMobileNoError","isdCodeMobileNoError")
    // }
  }
  // else if($("#" + formId + " #preOtpVerifiedBy").val() == "E"){
  // 	if ($("#" + formId + " #email").val() == '' || $("#" + formId + " #email").val() == null || $("#" + formId + " #email").val() == '0') {
  // 		showMessageRequestDemoPage(true, 'Email is either empty or invalid', 'otpCodeEmailError', 'email');
  // 		flag = false;
  // 	}else{
  // 		hideMessageRequestDemoPage("isdCodeMobileNoError","isdCodeMobileNoError")
  // 	}
  // 	if ($("#" + formId + " #userphone").val() == '' || $("#" + formId + " #userphone").val() == null || $("#" + formId + " #userphone").val() == '0') {
  // 		showMessageRequestDemoPage(true, 'Phone Number is either empty or invalid', 'isdCodeMobileNoError', 'userphone');
  // 		flag = false;
  // 	}else{
  // 		hideMessageRequestDemoPage("isdCodeMobileNoError","isdCodeMobileNoError")
  // 	}
  // }
  else {
    if (
      $("#" + formId + " #wtspNumber").val() == "" ||
      $("#" + formId + " #wtspNumber").val() == null ||
      $("#" + formId + " #userphone").val() == "0"
    ) {
      showMessageRequestDemoPage(
        false,
        "WhatsApp Number is either empty or invalid",
        "wtspNumberNoError",
        "wtspNumber"
      );
      flag = false;
    } else {
      hideMessageRequestDemoPage("wtspNumberNoError", "wtspNumber");
    }
    if (
      $("#" + formId + " #email").val() == "" ||
      $("#" + formId + " #email").val() == null ||
      $("#" + formId + " #email").val() == "0"
    ) {
      showMessageRequestDemoPage(
        false,
        "Email is either empty or invalid",
        "otpCodeEmailError",
        "email"
      );
      flag = false;
    } else {
      hideMessageRequestDemoPage(
        "isdCodeMobileNoError",
        "isdCodeMobileNoError"
      );
    }
  }

  console.log("cv :" + cv);
  if (cv) {
    var response = grecaptcha.getResponse();
    console.log("cv response:" + response);
    if (response.length == 0) {
      showMessageRequestDemoPage(
        false,
        "Please verify that you are not a robot",
        "recaptchaError",
        ""
      );
      flag = false;
    }
  }
  return flag;
}

function callForB2BRequestForm(formId, moduleId, folderName, domainName) {
  hideMessage("");

  if (!validateRequestForB2BRequest(formId)) {
    return false;
  }
  if ($("#" + formId + " #preOtpVerifiedBy").val() == "E") {
    if (!($("#isOtpVerifed").val() == "Y")) {
      showMessageRequestDemoPage(
        false,
        "Email is not verified",
        "emailError",
        "email"
      );
      return false;
    }
  } else if ($("#" + formId + " #preOtpVerifiedBy").val() == "N") {
    if (!($("#isOtpVerifed").val() == "Y")) {
      showMessageRequestDemoPage(
        false,
        "Phone Number is not verified",
        "isdCodeMobileNoError",
        "userphone"
      );
      return false;
    }
  } else {
    if (!($("#isOtpVerifed").val() == "Y")) {
      showMessageRequestDemoPage(
        false,
        "WhatsApp Number is not verified",
        "wtspNumberNoError",
        "wtspNumber"
      );
      return false;
    }
  }

  var me = $(this);
  if (me.data("requestRunning")) {
    return false;
  }
  me.data("requestRunning", true);
  customLoader(true);
  $("#sendRequest").prop("disabled", true);
  $.ajax({
    type: "POST",
    url: getURLForCommon("save-b2b-request-content"),
    contentType: "application/json",
    data: JSON.stringify(getRequestForB2BRequest(formId, moduleId, folderName)),
    dataType: "json",
    global: false,
    success: function (data) {
      console.log("callForB2BRequestForm " + JSON.stringify(data));
      customLoader(false);
      if (data["status"] == "0" || data["status"] == "2") {
        //$('#'+formId+' #serverError').html(data['elementId']);
        showServerError(true, formId, "serverError", data["message"]);
        showMessageRequestDemoPage(true, data["message"], "serverError", "");
      } else {
        var url = "";
        if (ENVIRONMENT == "uat") {
          url = "https://internationalschooling.org/en/is-b2b-thankyou/";
          url =
            "https://www.internationalschooling.org/" +
            folderName +
            "/thank-you.html";
        } else if (ENVIRONMENT == "dev") {
          url = "http://localhost:8080/istest/common/ppc-request-thank-you";
          url = "https://internationalschooling.org/en/is-b2b-thankyou/";
        } else if (ENVIRONMENT == "uat2") {
          url = BASE_URL + "istest/common/ppc-request-thank-you";
          url = "https://internationalschooling.org/en/is-b2b-thankyou/";
        } else {
          if (domainName == undefined) {
            domainName = "https://internationalschooling.org";
          }
          // var payload = "";

          // if (data.name) {
          //   var name = base64Encode(data.name);
          //   payload = "?dn=" + name;
          // }

          // if (data.email) {
          //   var email = base64Encode(data.email);
          //   payload = payload + "&de=" + email;
          // }

          // if (data.country) {
          //   var country = base64Encode(data.country);
          //   payload = payload + "&dc=" + country;
          // }
          url = "https://internationalschooling.org/en/is-b2b-thankyou/";
          // "https://internationalschooling.org/en/is-b2b-thankyou/" + payload;
        }
        window.location.href = url;
      }
    },
    complete: function () {
      window.setTimeout(function () {
        me.data("requestRunning", false);
      }, 10000);
    },
    error: function (e) {
      if (checkonlineOfflineStatus()) {
				return;
			}else{
        $(".callBackSubmit").prop("disabled", false);
        $(".reqeustDemo").prop("disabled", false);
      }
      customLoader(false);
    },
  });
}
function toTitleCase(str) {
  return str.toLowerCase().replace(/(?:^|\s)\w/g, function (match) {
    return match.toUpperCase();
  });
}
function getRequestForB2BRequest(formId, moduleId, folderName) {
  var B2BRequestDTO = {};
  B2BRequestDTO["firstName"] = toTitleCase(
    $("#" + formId + " #username").val()
  );
  B2BRequestDTO["lastName"] = toTitleCase($("#" + formId + " #lastName").val());

  B2BRequestDTO["email"] = $("#" + formId + " #email").val();
  B2BRequestDTO["isdCode"] = $("#" + formId + " #isdCodeMobileNo").val();
  if ($("#otpVerifiedBy").val() == "W") {
    B2BRequestDTO["phone"] = getPlaneFormattedPhone(
      $("#" + formId + " #wtspNumber").val()
    );
  } else {
    B2BRequestDTO["phone"] = getPlaneFormattedPhone(
      $("#" + formId + " #userphone").val()
    );
  }
  var selectedCommunication = getCheckedData();
  B2BRequestDTO["prefrence"] = selectedCommunication
    ? selectedCommunication
    : "N/A";
  B2BRequestDTO["isdIso"] = $("#" + formId + " #isdCodeStudentIcon").val();
  B2BRequestDTO["demoCode"] = $("#" + formId + " #demoCode").val();
  B2BRequestDTO["isOtpVerifed"] = $("#" + formId + " #isOtpVerifed").val();
  B2BRequestDTO["otpVerifiedBy"] = $("#" + formId + " #otpVerifiedBy").val();
  B2BRequestDTO["countryId"] = $(
    "#" + formId + " #countryId option:selected"
  ).attr("custom_country_value");
  B2BRequestDTO["stateId"] = $("#" + formId + " #stateId option:selected").attr(
    "value"
  );
  B2BRequestDTO["cityId"] = $("#" + formId + " #cityId option:selected").attr(
    "value"
  );
  B2BRequestDTO["countryName"] = $("#" + formId + " #countryId")
    .find(":selected")
    .text();

  B2BRequestDTO["message"] = escapeCharacters(
    $("#" + formId + " #description").val()
  );
  B2BRequestDTO["location"] = $("#" + formId + " #location").val();
  B2BRequestDTO["campaignName"] = folderName;
  B2BRequestDTO["schoolId"] = SCHOOL_ID;

  B2BRequestDTO["utmSource"] = getCookie("us");
  B2BRequestDTO["utmMedium"] = getCookie("um");
  B2BRequestDTO["utmDescription"] = getCookie("uc");
  B2BRequestDTO["originalUrl"] = getCookie("cu");
  B2BRequestDTO["gclid"] = getCookie("gclid");
  var name = getCookie("ucam");
  if (name == "Test") {
    B2BRequestDTO["utmCampaign"] = folderName;
  } else {
    B2BRequestDTO["utmCampaign"] = name;
  }
  B2BRequestDTO["utmTerm"] = getCookie("ut");
  return B2BRequestDTO;
}

function getCheckedData() {
  var selectedCommunication = $(
    "#b2bRequest input[name='preferredCommunication']:checked"
  )
    .map(function () {
      return $(this).val();
    })
    .get()
    .join(",");
  return selectedCommunication;
}

function validateRequestForCommonForm(formId, moduleId) {
  hideMessageRequestDemoPage("serverError", "");
  hideMessageRequestDemoPage("usernameError", "username");
  hideMessageRequestDemoPage("lastNameError", "lastName");
  hideMessageRequestDemoPage("emailError", "email");
  hideMessageRequestDemoPage("gradeError", "grade");
  hideMessageRequestDemoPage("demoCodeError", "demoCode");
  hideMessageRequestDemoPage("countryTimezoneIdError", "countryTimezoneId");
  hideMessageRequestDemoPage("countryIdError", "countryId");
  hideMessageRequestDemoPage("isdCodeMobileNoError", "isdCodeMobileNo");
  hideMessageRequestDemoPage("isdCodeMobileNoError", "userphone");
  hideMessageRequestDemoPage("isdCodeWhatsupNoError", "isdCodeWhatsupNo");
  if ($("#wtspNumber").length > 0) {
    hideMessageRequestDemoPage("isdCodeWhatsupNoError", "wtspNumber");
  }
  hideMessageRequestDemoPage("chooseDateError", "chooseDate");
  hideMessageRequestDemoPage("freeSlotListError", "viewFreeSlot");
  hideMessageRequestDemoPage("termsAndConditionsError", "termsAndConditions");
  hideMessageRequestDemoPage("callbackError", "callback");
  hideMessageRequestDemoPage("recaptchaError", "");
  var flag = true;
  var radioCheck = $("#leadType").val();
  if (radioCheck == "") {
    showMessageRequestDemoPage(
      true,
      "Please choose request type",
      "leadTypeError",
      "leadType"
    );
    flag = false;
  }
  if (radioCheck == "CB") {
    if (
      $("#" + formId + " #callback").val() == "" ||
      $("#" + formId + " #callback").val() == null
    ) {
      showMessageRequestDemoPage(
        true,
        "Please Select your call me back reason",
        "callbackError",
        "callback"
      );
      flag = false;
    }
  }
  if (
    $("#" + formId + " #username").val() == "" ||
    $("#" + formId + " #username").val() == null
  ) {
    showMessageRequestDemoPage(
      true,
      "First name is required",
      "usernameError",
      "username"
    );
    flag = false;
  }
  if (
    $("#" + formId + " #lastName").val() == "" ||
    $("#" + formId + " #lastName").val() == null
  ) {
    showMessageRequestDemoPage(
      true,
      "Last name is required",
      "lastNameError",
      "lastName"
    );
    flag = false;
  }
  if (!validateEmail($("#" + formId + " #email").val())) {
    showMessageRequestDemoPage(
      false,
      "Email is either empty or invalid",
      "emailError",
      "email"
    );
    flag = false;
  }
  if (
    $("#" + formId + " #grade").val() == "" ||
    $("#" + formId + " #grade").val() == null
  ) {
    showMessageRequestDemoPage(
      true,
      "Grade is required",
      "gradeError",
      "grade"
    );
    flag = false;
  }
  if (
    $("#" + formId + " #countryTimezoneId").val() == "" ||
    $("#" + formId + " #countryTimezoneId").val() == null
  ) {
    showMessageRequestDemoPage(
      true,
      "Timezone is required",
      "countryTimezoneIdError",
      "countryTimezoneId"
    );
    flag = false;
  }
  if (
    $("#" + formId + " #countryId").val() == "" ||
    $("#" + formId + " #countryId").val() == null
  ) {
    showMessageRequestDemoPage(
      true,
      "Country is required",
      "countryIdError",
      "countryId"
    );
    flag = false;
  }
  if (
    $("#" + formId + " #isdCodeMobileNo").val() == "" ||
    $("#" + formId + " #isdCodeMobileNo").val() == null
  ) {
    showMessageRequestDemoPage(
      true,
      "ISD Code is required",
      "isdCodeMobileNoError",
      "isdCodeMobileNo"
    );
    flag = false;
  }
  if (
    $("#" + formId + " #userphone").val() == "" ||
    $("#" + formId + " #userphone").val() == null
  ) {
    showMessageRequestDemoPage(
      true,
      "Phone Number is required",
      "isdCodeMobileNoError",
      "userphone"
    );
    flag = false;
  }

  if (
    $("#" + formId + " #isdCodeWtspStudent").val() == "" ||
    $("#" + formId + " #isdCodeWtspStudent").val() == null
  ) {
    showMessageRequestDemoPage(
      true,
      "Whatsapp ISD Code is required",
      "isdCodeWhatsupNoError",
      "isdCodeWtspStudent"
    );
    flag = false;
  }
  if ($("#" + formId + " #stateId").length) {
    if (
      $("#" + formId + " #stateId").val() == 0 ||
      $("#" + formId + " #stateId").val() == null
    ) {
      showMessageRequestDemoPage(
        true,
        "State/Province is required",
        "stateIdError",
        "stateId"
      );
      flag = false;
    }
  }
  if ($("#" + formId + " #cityId").length) {
    if (
      $("#" + formId + " #cityId").val() == 0 ||
      $("#" + formId + " #cityId").val() == null
    ) {
      showMessageRequestDemoPage(
        true,
        "City is required",
        "cityIdError",
        "cityId"
      );
      flag = false;
    }
  }
  if (radioCheck != "I") {
    if (
      $("#" + formId + " #chooseDate").val() == null ||
      $("#" + formId + " #chooseDate").val() == ""
    ) {
      showMessageRequestDemoPage(
        true,
        "Please select a date",
        "chooseDateError",
        "chooseDate"
      );
      flag = false;
    }
    if ($("input[name='slotTime']:checked").val() == undefined) {
      showMessageRequestDemoPage(
        true,
        "Please select any one Slot.",
        "freeSlotListError",
        "viewFreeSlot"
      );
      flag = false;
    }
  }
  console.log("cv :" + cv);
  if (cv) {
    var response = grecaptcha.getResponse();
    console.log("cv response:" + response);
    if (response.length == 0) {
      showMessageRequestDemoPage(
        false,
        "Please verify that you are not a robot",
        "recaptchaError",
        ""
      );
      flag = false;
    }
  }
  return flag;
}

function base64Encode(text) {
  return btoa(unescape(encodeURIComponent(text)));
}

function encrypt(text, key) {
  let result = "";
  for (let i = 0; i < text.length; i++) {
    let charCode = text.charCodeAt(i);
    let encryptedChar = charCode ^ key; // XOR operation for simplicity
    result += String.fromCharCode(encryptedChar);
  }
  return result;
}

function decrypt(encryptedText, key) {
  let result = "";
  for (let i = 0; i < encryptedText.length; i++) {
    let charCode = encryptedText.charCodeAt(i);
    let decryptedChar = charCode ^ key; // XOR operation for simplicity
    result += String.fromCharCode(decryptedChar);
  }
  return result;
}

function callCommonFreeSlotsList(formId) {
  if (
    $("#" + formId + " #chooseDate").val() == null ||
    $("#" + formId + " #chooseDate").val() == ""
  ) {
    return false;
  }
  customLoader(true);
  $.ajax({
    global: false,
    type: "POST",
    url: getURLForCommon("free-slots-list"),
    contentType: "application/json",
    data: JSON.stringify(getRequestForFreeSlotsList(formId)),
    dataType: "json",
    //async : false,
    success: function (data) {
      customLoader(false);
      if (
        data["statusResponse"]["statusCode"] == "0" ||
        data["statusResponse"]["statusCode"] == "2"
      ) {
      } else {
        buildListForFreeSlots(
          data["requestDemoFreeSlotsDTO"],
          $("#viewFreeSlot"),
          ""
        );
      }
    },
    error: function (e) {
      if (checkonlineOfflineStatus()) {
				return;
			}else{
        showMessage(true, e.responseText);
      }
      customLoader(false);
    },
  });
}

function getRequestForFreeSlotsList(formId) {
  var demoFreeSlotListRequest = {};
  var lat = "";
  var lon = "";
  var book = "";
  if ($("#location").val() != "") {
    var locations = JSON.parse($("#location").val());
    lat = locations.lat;
    lon = locations.lon;
  }
  var requestType = "REQUESTDEMO";
  var book = "Y";

  demoFreeSlotListRequest["date"] = $("#" + formId + " #chooseDate").val();
  demoFreeSlotListRequest["countryTimezoneId"] = $(
    "#" + formId + " #countryTimezoneId"
  ).val();
  demoFreeSlotListRequest["lat"] = lat;
  demoFreeSlotListRequest["lon"] = lon;
  demoFreeSlotListRequest["requestType"] = requestType;
  demoFreeSlotListRequest["book"] = book;
  demoFreeSlotListRequest["resStatus"] = "fresh";
  demoFreeSlotListRequest["schoolId"] = SCHOOL_ID;
  return demoFreeSlotListRequest;
}

function buildListForFreeSlots(result, dropdown, emptyMessage) {
  dropdown.html("");
  if (result != "") {
    dropdown.append('<option value="0">' + emptyMessage + "</option>");
    $.each(result, function (k, v) {
      if (v.id != null && v.startTime != null) {
        dropdown.append(
          '<div class="slot-wrapper slot-wrapper-flex"><div class="time-slot"><div class="form-check"><input class="form-check-input time-radio" type="radio" name="slotTime" id="' +
            v.id +
            '" value="' +
            v.startTime +
            "-" +
            v.endTime +
            '" slotIdAttr="' +
            v.id +
            '" slotDateAttr="' +
            v.meetingDate +
            '"><label class="meeting-time" for="' +
            v.id +
            '">' +
            v.startTime +
            "-" +
            v.endTime +
            "</label></div></div></div>"
        );
      }
    });
  } else {
    dropdown.append("No slots available, please try with another date.");
  }
}

function changeTimezone(date, pTimezone) {
  console.log("provide : " + date);
  let usDate = date.toLocaleString("en-US", { timeZone: pTimezone });
  console.log("date with timezone: " + pTimezone + ": " + usDate);
}

function calcTime(offset) {
  var d = new Date(new Date().toUTCString());
  console.log(
    "current date : " +
      d +
      " offset : " +
      d.getTimezoneOffset() +
      " getTime: " +
      d.getTime()
  );
  utc = d.getTime() + d.getTimezoneOffset() * 60000;
  console.log("utc : " + utc);
  nd = new Date(utc + 3600000 * offset);
  return "The local time in " + nd.toLocaleString();
}

function sendOTPVia(wtspService, emailService, smsService) {
  if (wtspService == "Y") {
    $(".otp-process-wrapper, .via_mobile_otp, .via_mobile_otp_btns").show();
    $(
      ".via_email_otp_btns, .verify-email-info, .via_phone_otp_btns, .verify-phoneNumber-info"
    ).hide();
    $(".phone_Sec").hide();
    $("#preOtpVerifiedBy").val("W");
  } else if (emailService == "Y") {
    $(
      ".otp-process-wrapper, .via_mobile_otp_btns, .via_phone_otp_btns, .verify-phoneNumber-info"
    ).hide();
    $(".otp-process-wrapper, .via_phone_otp").hide();
    $(".via_mobile_otp").hide();
    $(".via_email_otp_btns, .via_email_otp, .verify-email-info").show();
    $(".via_email_otp_btns, .via_email_otp_btns").show();
    $(".phone_Sec, .via_phone_otp").show();
    $("#preOtpVerifiedBy").val("E");
  } else if (smsService == "Y") {
    $(
      ".otp-process-wrapper .via_phone_otp_btns, .verify-phoneNumber-info"
    ).show();
    $(".otp-process-wrapper .via_mobile_otp_btns").hide();
    $(".via_email_otp_btns, .verify-email-info").hide();
    $(".via_mobile_otp").hide();
    $(".phone_Sec, .via_phone_otp").show();
    $("#preOtpVerifiedBy").val("N");
  }
}

function getCountryOtpFlag(value) {
  hideMessage("");
  if (value == null || value == undefined || value == "") {
    return false;
  }
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: getURLForCommon("masters"),
    data: JSON.stringify(getRequestForMasterNew("COUNTRY_OTP_FLAG", value)),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        showMessage(true, data["message"]);
      } else {
        var wtspService = data.data[0].value;
        var emailService = data.data[0].extra;
        var smsService = data.data[0].extra1;
        if ($("#isOtpVerifed").val() == "N") {
          sendOTPVia(wtspService, emailService, smsService);
        }
      }
    },
    error: function (e) {
      customLoader(false);
      showMessageRequestDemoPage(true, e.responseText, "serverError", "");
    },
  });
}
function validateCharacters(inputString) {
  var isValid = /^[\x00-\x7F]*$/.test(inputString);
  return isValid;
}
function validateFormAscii(formId) {
  var form = $("#" + formId).find(
    "input:text, input[type=password], textarea, input[type=email],input[type=file]"
  );
  var flag = true;
  $(form).each(function (index) {
    var input = $(this);
    //		console.log('Type: ' + input.attr('type') + '  Name: ' + input.attr('name') + '  Value: ' + input.val());
    if (input.attr("name") == "location") {
    } else {
      if (input.val()) {
        if (!validateCharacters(input.val())) {
          console.log("inside the illegal code");
          if (flag) {
            flag = false;
          }
        }
      }
    }
  });
  return flag;
}

function moveStep(step, otpVerificationType, formID) {
  if (step == "1") {
    $(".step-1").removeClass("step");
    $(".step-2, .step-3, .step-4").addClass("step");
  } else if (step == "2") {
    var flag = true;
    if (
      $("#" + formID + " #fname").val() == undefined ||
      $("#" + formID + " #fname").val() == null ||
      $("#" + formID + " #fname").val() == ""
    ) {
      showFromErrorMessage("fnameError", false, "First name is required");
      flag = false;
    }
    if (
      $("#" + formID + " #lname").val() == undefined ||
      $("#" + formID + " #lname").val() == null ||
      $("#" + formID + " #lname").val() == ""
    ) {
      showFromErrorMessage("lnameError", false, "Last name is required");
      flag = false;
    }
    if (
      $("#" + formID + " #email").val() == undefined ||
      $("#" + formID + " #email").val() == null ||
      $("#" + formID + " #email").val() == ""
    ) {
      showFromErrorMessage("emailError", false, "Email is required");
      flag = false;
    }
    if (
      $("#" + formID + " #countryId").val() == undefined ||
      $("#" + formID + " #countryId").val() == null ||
      $("#" + formID + " #countryId").val() == ""
    ) {
      showFromErrorMessage("countryError", false, "Country is required");
      flag = false;
    }
    if (
      $("#" + formID + " #stateId").val() == undefined ||
      $("#" + formID + " #stateId").val() == null ||
      $("#" + formID + " #stateId").val() == "0"
    ) {
      showFromErrorMessage("stateError", false, "State is required");
      flag = false;
    }
    if (
      $("#" + formID + " #cityId").val() == undefined ||
      $("#" + formID + " #cityId").val() == null ||
      $("#" + formID + " #cityId").val() == "0"
    ) {
      showFromErrorMessage("cityError", false, "City is required");
      flag = false;
    }
    if (
      $("#" + formID + " #wtspNumber").val() == undefined ||
      $("#" + formID + " #wtspNumber").val() == null ||
      $("#" + formID + " #wtspNumber").val() == ""
    ) {
      showFromErrorMessage(
        "wtspNumberError",
        false,
        "Whatsapp Number  is required"
      );
      flag = false;
    }
    if (flag) {
      $(".step-2").removeClass("step");
      $(".step-1, .step-3, .step-4").addClass("step");
    }
  } else if (step == "3") {
    if (otpVerificationType == "email") {
      $(".email-verification").show();
      $(".whatsapp-verification").hide();
      $("#emailVerify").val($("#email").val());
    } else {
      $(".email-verification").hide();
      $(".whatsapp-verification").show();
      $("#wtspNumberVerify").val($("#wtspNumber").val());
    }
    $(".step-3").removeClass("step");
    $(".step-1, .step-2, .step-4").addClass("step");
  } else if (step == "4") {
    $(".step-4").removeClass("step");
    $(".step-1, .step-2, .step-3").addClass("step");
  }
}
function showFromErrorMessage(element, type, msg) {
  if (type) {
    $("#" + element).show();
    $("#" + element).text(msg);
    $("#" + element).css({ color: "green" });
  } else {
    $("#" + element).text(msg);
    $("#" + element).css({ color: "red" });
    $("#" + element).show();
  }
}
function checkField(ele, errorEle, eleType) {
  ele = $("#" + ele).val();
  if ($("#" + ele).val() != "" && ele != undefined && ele != undefined) {
    $("#" + errorEle)
      .text("")
      .hide();
  }
}
