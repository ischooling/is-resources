$(document).ready(function () {
  //alert('I am in ready state inside ppcreqnew.js :: alert works');
  console.log("I am in ready state inside ppcreqnew.js");
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
  $("#countryId").on("change", function (e) {
    inputContact = document.querySelector("#userphone");
    itiContcat.setCountry("");
    itiContcat.setCountry(
      $("#countryId option:selected").attr("custom_country_icon")
    );
    $("#isdCodeMobileNoIcon").val(itiContcat.getSelectedCountryData().iso2);
    $("#isdCodeMobileNo").val(itiContcat.getSelectedCountryData().dialCode);
    if ($("#leadType").val() == "BD") {
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
  callCountries("requestDemo", 0, "countryId");
  getAllCountryTimezone("requestDemo", 0, "countryTimezoneId");
  getGrades("requestDemo", "grade", getGradesData(actualGrades));
  getDefaultDateListForDemo("requestDemo", "chooseDate", 7);
  callLocationAndSelectCountryNew("requestDemo");
  callCampain("requestDemo", 0, "campainid"); //fillBrowserDetail('requestDemo');
});

function getDefaultDateListForDemo(formId, elementId, limit) {
  var currentDate = new Date();
  $("#" + formId + " #" + elementId).append(
    '<option value="">Select Date</option>'
  );
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
    "name",
    "email",
    "isdCodeMobileNo",
    "contactNumber",
    "grade",
    "description",
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
function getRequestForMasterNew(
  formId,
  key,
  value,
  requestExtra,
  requestExtra1,
  requestExtra2
) {
  var MasterRequestDTO = {};
  MasterRequestDTO["requestKey"] = key;
  MasterRequestDTO["requestValue"] = value;
  return MasterRequestDTO;
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
    } else if (requiredGrades[index] == "22") {
      gradeK["key"] = 22;
      gradeK["value"] = "English Learning Program";
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

function validateRequestForPPCRequest(formId) {
  removeAllError(formId);
  var flag = true;
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
  console.log("cv :" + cv);
  if (cv) {
    var response = grecaptcha.getResponse();
    console.log("cv response:" + response);
    if (response.length == 0) {
      showMessageRequestDemoPage(
        true,
        "Please validate recaptcha",
        "recaptchaError",
        ""
      );
      flag = false;
    }
  }
  return flag;
}

function callForPPCRequestForm(formId, moduleId, folderName, domainName) {
  hideMessage("");
  if (!validateRequestForPPCRequest(formId)) {
    return false;
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
    url: getURLForCommon("save-ppc-request-content"),
    contentType: "application/json",
    data: JSON.stringify(getRequestForPPCRequest(formId, moduleId, folderName)),
    dataType: "json",
    global: false,
    success: function (data) {
      customLoader(false);
      if (data["status"] == "0" || data["status"] == "2") {
        //$('#'+formId+' #serverError').html(data['elementId']);
        showServerError(true, formId, "serverError", data["message"]);
      } else {
        var url = "";
        if (ENVIRONMENT == "uat") {
          url =
            "https://www.internationalschooling.org/" +
            folderName +
            "/thank-you.html";
        } else if (ENVIRONMENT == "uat2") {
          url =
            "https://www.internationalschooling.org/" +
            folderName +
            "/thank-you.html";
        } else if (ENVIRONMENT == "dev") {
          url =
            "https://www.internationalschooling.org/" +
            folderName +
            "/thank-you.html";
        }
        if (ENVIRONMENT == "staging") {
          url = "http://164.52.198.42:8070/istest/common/ppc-request-thank-you";
          url =
            "https://www.internationalschooling.org/" +
            folderName +
            "/thank-you.html";
        } else {
          if (domainName == undefined) {
            domainName = "https://enroll.internationalschooling.org";
          }
          var payload = "";

          if (data.name) {
            var name = base64Encode(data.name);
            payload = "?dn=" + name;
          }

          if (data.email) {
            var email = base64Encode(data.email);
            payload = payload + "&de=" + email;
          }

          if (data.country) {
            var country = base64Encode(data.country);
            payload = payload + "&dc=" + country;
          }

          if (data.type) {
            var type = base64Encode(data.type);
            payload = payload + "&t=" + type;
          } else {
            var p = base64Encode("P");
            payload = payload + "&t=" + p;
          }

          url = ORIGIN_URL + "/is-thankyou" + payload;
          if (folderName == "brochure") {
            url = ORIGIN_URL + "/brochure-thankyou/" + payload;
          }
        }
        goAhead(url, "");
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
function getRequestForPPCRequest(formId, moduleId, folderName) {
  var PPCRequestDTO = {};
  PPCRequestDTO["name"] = toTitleCase($("#" + formId + " #username").val());
  PPCRequestDTO["lastName"] = toTitleCase($("#" + formId + " #lastName").val());

  PPCRequestDTO["email"] = $("#" + formId + " #email").val();
  PPCRequestDTO["isdCode"] = $("#" + formId + " #isdCodeMobileNo").val();
  PPCRequestDTO["contactNumber"] = $("#" + formId + " #userphone").val();
  PPCRequestDTO["demoCode"] = $("#" + formId + " #demoCode").val();

  PPCRequestDTO["grade"] = $("#" + formId + " #grade").val();
  PPCRequestDTO["standardId"] = $(
    "#" + formId + " #grade option:selected"
  ).attr("grade_id");

  PPCRequestDTO["countryId"] = $(
    "#" + formId + " #countryId option:selected"
  ).attr("custom_country_value");
  PPCRequestDTO["countryName"] = $("#" + formId + " #countryId")
    .find(":selected")
    .text();

  PPCRequestDTO["description"] = escapeCharacters(
    $("#" + formId + " #description").val()
  );
  PPCRequestDTO["location"] = $("#" + formId + " #location").val();
  PPCRequestDTO["browserDetails"] = fillBrowserDetail();
  PPCRequestDTO["campaignName"] = folderName;
  PPCRequestDTO["schoolId"] = SCHOOL_ID;
  PPCRequestDTO["utmSource"] = sourceProvider("us", folderName);
  PPCRequestDTO["utmMedium"] = getCookie("um");
  PPCRequestDTO["utmDescription"] = getCookie("uc");
  PPCRequestDTO["originalUrl"] = getCookie("cu");
  PPCRequestDTO["gclid"] = getCookie("gclid");
  var name = getCookie("ucam");
  if (
    $("#" + formId + " #campainid").val() != undefined &&
    $("#" + formId + " #campainid").val() != ""
  ) {
    PPCRequestDTO["utmCampaign"] = $("#" + formId + " #campainid").val();
  } else {
    if (name == "Test") {
      PPCRequestDTO["utmCampaign"] = folderName;
    } else {
      PPCRequestDTO["utmCampaign"] = name;
    }
  }
  PPCRequestDTO["utmTerm"] = getCookie("ut");
  return PPCRequestDTO;
}

function sourceProvider(key, folderName) {
  const value = getCookie(key);
  if (value === "N/A") {
    return folderName;
  }
  return value;
}

function validateRequestForCommonForm(formId, moduleId) {
  hideMessageRequestDemoPage("serverError", "");
  hideMessageRequestDemoPage("usernameError", "username");
  hideMessageRequestDemoPage("lastNameError", "lastName");
  hideMessageRequestDemoPage("emailError", "email");
  hideMessageRequestDemoPage("relationError", "relation");
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
  //   if (
  //     $("#" + formId + " #relation").val() == "" ||
  //     $("#" + formId + " #relation").val() == null
  //   ) {
  //     showMessageRequestDemoPage(
  //       true,
  //       "Relation is required",
  //       "relationError",
  //       "relation"
  //     );
  //     flag = false;
  //   }
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
        "State is required",
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
        true,
        "Please validate recaptcha",
        "recaptchaError",
        ""
      );
      flag = false;
    }
  }
  return flag;
}
function callForRequestDemoForm(formId, moduleId, folderName, domainName) {
  $(".callBackSubmit").prop("disabled", true);
  $(".reqeustDemo").prop("disabled", true);
  if (!validateRequestForCommonForm(formId, moduleId)) {
    $(".callBackSubmit").prop("disabled", false);
    $(".reqeustDemo").prop("disabled", false);
    return false;
  }
  var me = $(this);
  if (me.data("requestRunning")) {
    return false;
  }
  me.data("requestRunning", true);
  customLoader(true);
  $.ajax({
    global: false,
    type: "POST",
    url: getURLForCommon("reqeust-demo-content"),
    contentType: "application/json",
    data: JSON.stringify(
      getRequestForRequestDemo(formId, moduleId, folderName)
    ),
    dataType: "json",
    success: function (data) {
      customLoader(false);
      if (data["status"] == "0" || data["status"] == "2") {
        showMessageRequestDemoPage(true, data["message"], "serverError", "");
        if (
          "You have already rescheduled your demo session." == data["message"]
        ) {
          goAhead(
            BASE_URL + CONTEXT_PATH + SCHOOL_UUID + "/student/enrollment/O",
            ""
          );
        }
        $(".callBackSubmit").prop("disabled", false);
        $(".reqeustDemo").prop("disabled", false);
      } else {
        var url = "";
        if (ENVIRONMENT == "uat") {
          url = "https://staging.internationalschooling.org/istest/common/book-a-demo-thank-you";
        } else if (ENVIRONMENT == "uat2") {
          url =
            "http://164.52.216.248:8080/istest/common/book-a-demo-thank-you";
        } else if (ENVIRONMENT == "dev") {
          url = "http://localhost:8080/istest/common/book-a-demo-thank-you";
        } else {
          if (domainName == undefined) {
            domainName = "https://enroll.internationalschooling.org";
          }

          var payload = "";

          if (data.name) {
            var name = base64Encode(data.name);
            payload = "?dn=" + name;
          }

          if (data.email) {
            var email = base64Encode(data.email);
            payload = payload + "&de=" + email;
          }

          if (data.country) {
            var country = base64Encode(data.country);
            payload = payload + "&dc=" + country;
          }

          if (data.type) {
            var type = base64Encode(data.type);
            payload = payload + "&t=" + type;
          }

          if (data.schoolPersonId) {
            var spId = base64Encode(data.schoolPersonId);
            payload = payload + "&spId=" + spId;
          }

          if (data.meetingId) {
            var mId = base64Encode(data.meetingId);
            payload = payload + "&mId=" + mId;
          }

          if (data.timeZone) {
            var tz = base64Encode(data.timeZone);
            payload = payload + "&tz=" + tz;
          }

          if (data.eventId) {
            var eId = base64Encode(data.eventId);
            payload = payload + "&eId=" + eId;
          }

          if (data.startDate) {
            var sd = base64Encode(data.startDate);
            payload = payload + "&sd=" + sd;
          }
          if (data.endDate) {
            var ed = base64Encode(data.endDate);
            payload = payload + "&ed=" + ed;
          }

          url = ORIGIN_URL + "/is-demo-thankyou" + payload;
        }

        goAhead(url, "");
        return false;
      }
      return false;
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

function getCheckedData(formId) {
  var selectedCommunication = $(
    "#" + formId + " input[name='preferredCommunication']:checked"
  )
    .map(function () {
      return $(this).val();
    })
    .get()
    .join(",");
  return selectedCommunication;
}

function getRequestForRequestDemo(formId, moduleId, folderName) {
  var requestDemoDTO = {};
  requestDemoDTO["name"] = toTitleCase($("#" + formId + " #username").val());
  requestDemoDTO["lastName"] = toTitleCase(
    $("#" + formId + " #lastName").val()
  );
  requestDemoDTO["parentEmail"] = $("#" + formId + " #email").val();
  var selectedCommunication = getCheckedData(formId);
  requestDemoDTO["prefrence"] = selectedCommunication
    ? selectedCommunication
    : "N/A";
  if ("BD" == $(".radioCheck:checked").attr("id")) {
    requestDemoDTO["requestCallFrom"] = "DEMO";
  } else if ("CB" == $(".radioCheck:checked").attr("id")) {
    requestDemoDTO["requestCallFrom"] = "PPC";
  }
  requestDemoDTO["demoCode"] = $("#" + formId + " #demoCode").val();
  requestDemoDTO["isdCode"] = $("#" + formId + " #isdCodeMobileNo").val();
  requestDemoDTO["contactNumber"] = $("#" + formId + " #userphone").val();

  requestDemoDTO["isdCodeWtsp"] = $(
    "#" + formId + " #isdCodeWtspStudent"
  ).val();
  if ($("#wtspNumber").length > 0) {
    requestDemoDTO["wtspNumber"] = $("#" + formId + " #wtspNumber").val();
  }
  requestDemoDTO["contactDescription"] = escapeCharacters(
    $("#" + formId + " #description").val()
  );
  requestDemoDTO["location"] = $("#" + formId + " #location").val();
  requestDemoDTO["browserDetails"] = fillBrowserDetail();
  if ($("#" + formId + " #curriculum").length) {
    requestDemoDTO["curriculum"] = $("#" + formId + " #curriculum").val();
  }
  requestDemoDTO["grade"] = $("#" + formId + " #grade").val();
  requestDemoDTO["relation"] = $("#" + formId + " #relation").val();
  requestDemoDTO["age"] = $("#" + formId + " #age").val();
  requestDemoDTO["standardId"] = $(
    "#" + formId + " #grade option:selected"
  ).attr("grade_id");
  if ($("#" + formId + " #cityId").length) {
    requestDemoDTO["cityId"] = $("#" + formId + " #cityId").val();
  }
  if ($("#" + formId + " #stateId").length) {
    requestDemoDTO["stateId"] = $("#" + formId + " #stateId").val();
  }
  if ($("#" + formId + " #countryId").length) {
    requestDemoDTO["countryId"] = $(
      "#" + formId + " #countryId option:selected"
    ).attr("custom_country_value");
    requestDemoDTO["countryName"] = $("#" + formId + " #countryId")
      .find(":selected")
      .text();
  }
  //requestDemoDTO['otpVerifiedStatus'] = $("#" + formId + " #otpVerifiedstatus").val();
  // requestDemoDTO['countryTimezoneId'] = $("#" + formId + " #countryTimezoneId").val().trim();
  requestDemoDTO["callBackReason"] = $("#" + formId + " #callback").val();
  requestDemoDTO["timeZone"] = $("#" + formId + " #countryTimezoneId")
    .val()
    .trim();
  requestDemoDTO["studentTimeZone"] = $(
    "#" + formId + " #countryTimezoneId option:selected"
  )
    .text()
    .trim();
  requestDemoDTO["meetingDate"] = $("input[name='slotTime']:checked").attr(
    "slotDateAttr"
  );
  requestDemoDTO["meetingSlotId"] = $("input[name='slotTime']:checked").attr(
    "slotidattr"
  );
  requestDemoDTO["meetingSlotTime"] = $("input[name='slotTime']:checked").val();
  requestDemoDTO["campaignName"] = folderName;
  requestDemoDTO["moduleName"] = moduleId;
  requestDemoDTO["utmSource"] = sourceProvider("us", folderName);
  requestDemoDTO["utmMedium"] = getCookie("um");
  requestDemoDTO["utmDescription"] = getCookie("uc");
  requestDemoDTO["originalUrl"] = getCookie("cu");
  requestDemoDTO["gclid"] = getCookie("gclid");
  var name = getCookie("ucam");
  if (
    $("#" + formId + " #campainid").val() != undefined &&
    $("#" + formId + " #campainid").val() != ""
  ) {
    requestDemoDTO["utmCampaign"] = $("#" + formId + " #campainid").val();
  } else {
    if (name == "Test") {
      requestDemoDTO["utmCampaign"] = folderName;
    } else {
      requestDemoDTO["utmCampaign"] = name;
    }
  }
  requestDemoDTO["utmTerm"] = getCookie("ut");
  requestDemoDTO["schoolId"] = SCHOOL_ID;
  if (
    $("#counselorUserId").val() != undefined &&
    $("#counselorUserId").val() != null &&
    $("#counselorUserId").val() != "null" &&
    $("#counselorUserId").val() != 0
  ) {
    requestDemoDTO["counselorUserId"] = $("#counselorUserId").val();
  } else {
    var cId = $("input[name='slotTime']:checked").attr("slotadminuserid");
    if (cId != "undefined" && cId != null && cId != 0) {
      requestDemoDTO["counselorUserId"] = cId;
    } else {
      requestDemoDTO["counselorUserId"] = 0;
    }
  }
  /* 
		Not in common page
		requestDemoDTO['encryptedRequestDemoId'] = $("#" + formId + " #encryptedRequestDemoId").val();
		requestDemoDTO['relationType'] = $("#" + formId + " #relationType").val();
		requestDemoDTO['title'] = $("#" + formId + " #title").val();
		requestDemoDTO['parentName'] = $("#" + formId + " #parentName").val();
		requestDemoDTO['occupation'] = $("#" + formId + " #occupation").val();
		requestDemoDTO['dob'] = $("#" + formId + " #dob").val();
		requestDemoDTO['gender'] = $("#" + formId + " #gender").val();
		Not in common page
	*/
  return requestDemoDTO;
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
          "",
          data["counselorUserId"]
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
  if (
    $("#email").val() != undefined &&
    $("#email").val() != null &&
    $("#email").val() != ""
  ) {
    demoFreeSlotListRequest["emailId"] = $("#email").val().trim();
  }
  if (
    $("#userphone").val() != undefined &&
    $("#userphone").val() != null &&
    $("#userphone").val() != ""
  ) {
    demoFreeSlotListRequest["phnoNo"] = $("#userphone").val();
  }
  if (
    $("#countryId option:selected").attr("custom_country_value") != undefined &&
    $("#countryId option:selected").attr("custom_country_value") != null &&
    $("#countryId option:selected").attr("custom_country_value") != ""
  ) {
    demoFreeSlotListRequest["countryIds"] = $(
      "#countryId option:selected"
    ).attr("custom_country_value");
  }
  if (
    $("#grade option:selected").attr("grade_id") != undefined &&
    $("#grade option:selected").attr("grade_id") != null &&
    $("#grade option:selected").attr("grade_id") != ""
  ) {
    demoFreeSlotListRequest["gradeIds"] = $("#grade option:selected").attr(
      "grade_id"
    );
  }
  if (
    $("#campainid option:selected").attr("custom_campain_id") != undefined &&
    $("#campainid option:selected").attr("custom_campain_id") != null &&
    $("#campainid option:selected").attr("custom_campain_id") != ""
  ) {
    demoFreeSlotListRequest["campaignIds"] = $(
      "#campainid option:selected"
    ).attr("custom_campain_id");
  }
  console.log(demoFreeSlotListRequest);
  return demoFreeSlotListRequest;
}

function buildListForFreeSlots(
  result,
  dropdown,
  emptyMessage,
  counselorUserId
) {
  dropdown.html("");
  if ($("#counselorUserId").length > 0) {
    $("#counselorUserId").remove();
    $("body").append(
      '<input type="hidden" id="counselorUserId" value="' +
        counselorUserId +
        '">'
    );
  } else {
    $("body").append(
      '<input type="hidden" id="counselorUserId" value="' +
        counselorUserId +
        '">'
    );
  }
  if (result != "") {
    // dropdown.append('<option value="0">' + emptyMessage + '</option>');
    $.each(result, function (k, v) {
      if (v.id != null && v.startTime != null) {
        //dropdown.append('<div class="slot-wrapper slot-wrapper-flex"><div class="time-slot"><div class="form-check"><input class="form-check-input time-radio" type="radio" name="slotTime" id="' + ('slot'+k) + '" value="' + v.startTime + '-' + v.endTime + '" slotIdAttr="' + v.id + '" slotDateAttr="' + v.meetingDate + '"><label class="meeting-time" for="' + ('slot'+k) + '">' + v.startTime + '-' + v.endTime + '</label></div></div></div>');
        dropdown.append(
          '<div class="slot-wrapper slot-wrapper-flex"><div class="time-slot"><div class="form-check"><input class="form-check-input time-radio" type="radio" name="slotTime" slotAdminUserId="' +
            v.adminUserId +
            '"  id="' +
            ("slot" + k) +
            '" value="' +
            v.startTime +
            "-" +
            v.endTime +
            '" slotIdAttr="' +
            v.id +
            '" slotDateAttr="' +
            v.meetingDate +
            '"><label class="meeting-time" for="' +
            ("slot" + k) +
            '">' +
            v.startTime +
            "</label></div></div></div>"
        );
      }
    });
  } else {
    dropdown.append(`
			<div>
				<h4 style="margin-bottom: 20px; font-size:14px;">
					No slots available, please try with another date.
				</h4>
				<p style="font-size:14px;">Need help booking a School Demo?
				<br/>
				Talk to us at : 
				<a target="_0" style="text-decoration:none; margin-top:3px;" href="https://wa.me/+17273902419"><svg xmlns="http://www.w3.org/2000/svg" style="width:24px; height:24px; margin-bottom:-5px;" viewBox="0 0 448 512"><path fill="#25D366" d="M92.1 254.6c0 24.9 7 49.2 20.2 70.1l3.1 5-13.3 48.6L152 365.2l4.8 2.9c20.2 12 43.4 18.4 67.1 18.4h.1c72.6 0 133.3-59.1 133.3-131.8c0-35.2-15.2-68.3-40.1-93.2c-25-25-58-38.7-93.2-38.7c-72.7 0-131.8 59.1-131.9 131.8zM274.8 330c-12.6 1.9-22.4 .9-47.5-9.9c-36.8-15.9-61.8-51.5-66.9-58.7c-.4-.6-.7-.9-.8-1.1c-2-2.6-16.2-21.5-16.2-41c0-18.4 9-27.9 13.2-32.3c.3-.3 .5-.5 .7-.8c3.6-4 7.9-5 10.6-5c2.6 0 5.3 0 7.6 .1c.3 0 .5 0 .8 0c2.3 0 5.2 0 8.1 6.8c1.2 2.9 3 7.3 4.9 11.8c3.3 8 6.7 16.3 7.3 17.6c1 2 1.7 4.3 .3 6.9c-3.4 6.8-6.9 10.4-9.3 13c-3.1 3.2-4.5 4.7-2.3 8.6c15.3 26.3 30.6 35.4 53.9 47.1c4 2 6.3 1.7 8.6-1c2.3-2.6 9.9-11.6 12.5-15.5c2.6-4 5.3-3.3 8.9-2s23.1 10.9 27.1 12.9c.8 .4 1.5 .7 2.1 1c2.8 1.4 4.7 2.3 5.5 3.6c.9 1.9 .9 9.9-2.4 19.1c-3.3 9.3-19.1 17.7-26.7 18.8zM448 96c0-35.3-28.7-64-64-64H64C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96zM148.1 393.9L64 416l22.5-82.2c-13.9-24-21.2-51.3-21.2-79.3C65.4 167.1 136.5 96 223.9 96c42.4 0 82.2 16.5 112.2 46.5c29.9 30 47.9 69.8 47.9 112.2c0 87.4-72.7 158.5-160.1 158.5c-26.6 0-52.7-6.7-75.8-19.3z"/></svg> +1 (727) 390-2419 </a>
				</br>
				Write to us at : <a target="_0" style="text-decoration:none;margin-top:3px;" href="mailto:chat.support@internationalschooling.org">chat.support@internationalschooling.org</a></p>
			</div>`);
    dropdown.append("");
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

// function checkEmailField(formId,eleId){
// 	if (!validateEmail($("#" + formId + " #"+eleId).val())) {
// 		showMessageRequestDemoPage(false, 'Email is either empty or invalid', 'emailError', 'email');
// 		$("#chooseDate").prop("disabled", true);
// 		return false;
// 	}else{
// 		$("#chooseDate").prop("disabled", false);
// 	}
// }

function callCampain(formId, value, elementId) {
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: getURLForCommon("masters"),
    data: JSON.stringify(getRequestForMaster(formId, "CAMPAIN-LIST", value)),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      console.log(data);
      if (data["status"] == "0" || data["status"] == "2") {
        showMessageRequestDemoPage(true, stringMessage[1], "serverError", "");
      } else {
        //buildDropdown(data['data'], $('#campainid'), 'Select city');
        $("#" + formId + " #" + elementId).html(
          '<option value="">Select Campain*</option>'
        );
        var dropdown = $("#" + formId + " #" + elementId);
        $.each(data["data"], function (k, v) {
          dropdown.append(
            '<option value="' +
              v.value +
              '" custom_campain_id="' +
              v.key +
              '"> ' +
              v.value +
              "</option>"
          );
        });
      }
      $("#campainid").prop("disabled", false);
      return false;
    },
    error: function (e) {
      $("#campainid").prop("disabled", false);
    },
  });
}
//Browser detail
function getBrowserDetail() {
  var nVer = navigator.appVersion;
  var nAgt = navigator.userAgent;
  var browserName = navigator.appName;
  var fullVersion = "" + parseFloat(navigator.appVersion);
  var majorVersion = parseInt(navigator.appVersion, 10);
  var nameOffset, verOffset, ix;

  // In Opera, the true version is after "Opera" or after "Version"

  if ((verOffset = nAgt.indexOf("Opera")) != -1) {
    browserName = "Opera";
    fullVersion = nAgt.substring(verOffset + 6);
    if ((verOffset = nAgt.indexOf("Version")) != -1)
      fullVersion = nAgt.substring(verOffset + 8);
  }
  // In MSIE, the true version is after "MSIE" in userAgent
  else if ((verOffset = nAgt.indexOf("MSIE")) != -1) {
    browserName = "Microsoft Internet Explorer";
    fullVersion = nAgt.substring(verOffset + 5);
  }
  // In Chrome, the true version is after "Chrome"
  else if ((verOffset = nAgt.indexOf("Chrome")) != -1) {
    browserName = "Chrome";
    fullVersion = nAgt.substring(verOffset + 7);
  }
  // In Safari, the true version is after "Safari" or after "Version"
  else if ((verOffset = nAgt.indexOf("Safari")) != -1) {
    browserName = "Safari";
    fullVersion = nAgt.substring(verOffset + 7);
    if ((verOffset = nAgt.indexOf("Version")) != -1)
      fullVersion = nAgt.substring(verOffset + 8);
  }
  // In Firefox, the true version is after "Firefox"
  else if ((verOffset = nAgt.indexOf("Firefox")) != -1) {
    browserName = "Firefox";
    fullVersion = nAgt.substring(verOffset + 8);
  }
  // In most other browsers, "name/version" is at the end of userAgent
  else if (
    (nameOffset = nAgt.lastIndexOf(" ") + 1) <
    (verOffset = nAgt.lastIndexOf("/"))
  ) {
    browserName = nAgt.substring(nameOffset, verOffset);
    fullVersion = nAgt.substring(verOffset + 1);
    if (browserName.toLowerCase() == browserName.toUpperCase()) {
      browserName = navigator.appName;
    }
  }

  // trim the fullVersion string at semicolon/space if present

  if ((ix = fullVersion.indexOf(";")) != -1)
    fullVersion = fullVersion.substring(0, ix);
  if ((ix = fullVersion.indexOf(" ")) != -1)
    fullVersion = fullVersion.substring(0, ix);

  majorVersion = parseInt("" + fullVersion, 10);
  if (isNaN(majorVersion)) {
    fullVersion = "" + parseFloat(navigator.appVersion);
    majorVersion = parseInt(navigator.appVersion, 10);
  }

  return {
    name: browserName,
    fullVersion: fullVersion,
    shortVersion: majorVersion,
    navAppName: navigator.appName,
    uAgentFull: navigator.userAgent,
  };
}

//Fill Browser data
function fillBrowserDetail() {
  var browserDetails = getBrowserDetail();
  if (browserDetails != undefined && browserDetails != "") {
    return JSON.stringify(browserDetails);
  }
  return "{}";
}
