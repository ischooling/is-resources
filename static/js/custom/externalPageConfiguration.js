PRO_IP_API_URL =
  "https://pro.ip-api.com/json/?key=9908tZlRhI0pK5W&fields=status,message,continent,continentCode,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,offset,currency,isp,org,as,asname,reverse,mobile,proxy,hosting,query";
moduleId = "REQUESTDEMO";
FILE_UPLOAD_PATH = "https://s3.amazonaws.com/internationalsch/";
if (ENVIRONMENT == "prod" || ENVIRONMENT == "staging2") {
  CONTEXT_PATH = "";
} else {
  CONTEXT_PATH = "lead-api";
}
UNIQUEUUID = "";
SCHOOL_ID = 1;
SCHOOL_UUID = "international-schooling/";
var API_VERSION = CONTEXT_PATH + UNIQUEUUID + "/" + "api/v1/";
var TECHNICAL_GLITCH =
  "Sorry for inconvenience, system has encountered technical glitch.";
var SERVICE_UNAVAILABLE = "Temporarily Ticket Service is not available!";
var BASE_URL = "";

if (ENVIRONMENT == "uat") {
  BASE_URL = "https://staging.internationalschooling.org/";
} else if (ENVIRONMENT == "uat2") {
  BASE_URL = "http://164.52.216.248:8080/";
} else if (ENVIRONMENT == "dev") {
  BASE_URL = "http://localhost:9090/";
} else if (ENVIRONMENT == "staging2") {
  BASE_URL = "https://sm.internationalschooling.org/";
} else {
  BASE_URL = "https://sm.internationalschooling.org/";
}

function getURLForCommon(suffixUrl) {
  return BASE_URL + API_VERSION + "common" + "/" + suffixUrl;
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

function hideMessageRequestDemoPage(id, fid) {
  $("#" + id)
    .parent()
    .removeClass("show-message");
  if (fid != "") {
    $("#" + fid).removeClass("highlight-field");
  }
  $("#" + id).html("");
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
function showErrorForPPC(formId, elementId, message) {
  $("#" + formId + " #" + elementId).addClass("error");
  $("#" + formId + " #" + elementId)
    .next("p")
    .html(message);
}

function showMessage(isWarnig, message, id) {
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
}
function hideMessage(id) {
  $("#errorHeading").html("");
  $("#statusMessage").removeClass("success-color");
  $("#statusMessage").removeClass("danger-color");
  $("#statusMessage").html("");
}

function resetDropdown(dropdown, emptyMessage) {
  dropdown.html("");
  //dropdown.append('<option value="0">' + emptyMessage + '</option>');
  dropdown.append("<option disabled selected> </option>");
}

function isJson(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

function customLoader(needToShow) {
  if (needToShow) {
    $("#commonloaderId").removeClass("hide");
    $("#commonloaderBody").addClass("loader");
    $("#commonloaderId").addClass("loader-bg");
    $("#commonloaderId").show();
  } else {
    $("#commonloaderBody").removeClass("loader");
    $("#commonloaderId").removeClass("loader-bg");
    $("#commonloaderId").addClass("hide");
    $("#commonloaderId").hide();
  }
}

function chooseValueByElement(elementId, value) {
  if ($("#" + elementId).length) {
    $("#" + elementId + " option")
      .map(function () {
        var currentValue = $(this).text();
        currentValue = currentValue.substr(currentValue.indexOf(" ") + 1); // returns text after space
        if (currentValue.trim() === value.trim()) {
          return this;
        }
      })
      .attr("selected", "selected");
  }
}

function getHash() {
  return Math.random().toString(36);
}
function buildDropdown(result, dropdown, emptyMessage) {
  dropdown.html("");
  if (result != "") {
    if (emptyMessage != "Select Date") {
      dropdown.append('<option value="0">' + emptyMessage + "</option>");
    }
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

function showMessageRequestDemoPage(isWarnig, message, id, fid) {
  $("#" + id)
    .parent()
    .removeClass("error-message-hide");
  $("#" + id)
    .parent()
    .addClass("show-message");
  //	$('#'+id).parent().removeClass('hide');
  if (fid != "") {
    $("#" + fid).addClass("error");
    if (isWarnig) {
      $("#" + id).removeClass("error-message");
      $("#" + id).addClass("success-message");
    } else {
      $("#" + id).addClass("error-message");
      $("#" + id).removeClass("success-message");
    }
  }
  $("#" + id).html(message);
  var formId = $(".formClass").attr("id");
  callCommonFreeSlotsList(formId);
}
function hideMessageRequestDemoPage(id, fid) {
  //	$('#'+id).parent().addClass('hide');
  $("#" + id)
    .parent()
    .removeClass("show-message");
  if (fid != "") {
    $("#" + fid).removeClass("error");
  }
  //	$('#'+id).parent().addClass('error-message-hide');
  $("#" + id).html("");
}

function urlParam(name) {
  if (name == undefined || name == "") {
    return false;
  }
  var results = new RegExp("[?&]" + name + "=([^&#]*)").exec(
    window.location.href
  );
  if (results == null) {
    return null;
  }
  return decodeURI(results[1]) || null;
}

function setCookie(key, value) {
  if (value == undefined || value == "") {
    return false;
  }
  var expires = new Date();
  expires.setTime(expires.getTime() + 31 * 24 * 60 * 60 * 1000);
  var cname =
    key +
    "=" +
    value +
    ";expires=" +
    expires.toUTCString() +
    ";domain=internationalschooling.org;path=/";
  console.log("setCookie cname:: " + cname);
  document.cookie = cname;
}

function getCookie(key) {
  if (key == undefined || key == "") {
    return false;
  }
  var keyValue = document.cookie.match("(^|;) ?" + key + "=([^;]*)(;|$)");
  console.log("getCookie keyValue:: " + keyValue);
  return keyValue ? keyValue[2] : "N/A";
}

// setCookie("us", urlParam("utm_source"));
// setCookie("um", urlParam("utm_medium"));
// setCookie("uc", urlParam("utm_content"));
// setCookie("gclid", urlParam("gclid"));
// setCookie("ucam", urlParam("utm_campaign"));
// setCookie("ut", urlParam("utm_term"));
// setCookie("cu", window.location.href);

const us = getCookie("us");
if (us === "0" || !us || us === "N/A" || us === "undefined") {
  const utm_source = urlParam("utm_source");
  if (utm_source) {
    setCookie("us", utm_source);
  }
}
const um = getCookie("um");
if (um === "0" || !um || um === "N/A" || um === "undefined") {
  const utm_medium = urlParam("utm_medium");
  if (utm_medium) {
    setCookie("um", utm_medium);
  }
}
const uc = getCookie("uc");
if (uc === "0" || !uc || uc === "N/A" || uc === "undefined") {
  const utm_content = urlParam("utm_content");
  if (utm_content) {
    setCookie("uc", utm_content);
  }
}
const gc = getCookie("gclid");
if (gc === "0" || !gc || gc === "N/A" || gc === "undefined") {
  const gclid = urlParam("gclid");
  if (gclid) {
    setCookie("gclid", gclid);
  }
  const fbclid = urlParam("fbclid");
  if (fbclid) {
    setCookie("gclid", fbclid);
  }
}
const ucamCheck = getCookie("utm_campaign");
if (
  ucamCheck === "0" ||
  !ucamCheck ||
  ucamCheck === "N/A" ||
  ucamCheck === "undefined"
) {
  const utm_campaign = urlParam("utm_campaign");
  if (utm_campaign) {
    setCookie("ucam", utm_campaign);
  }
}
const ut = getCookie("utm_term");
if (ut === "0" || !ut || ut === "N/A" || ut === "undefined") {
  const utm_term = urlParam("utm_term");
  if (utm_term) {
    setCookie("ut", utm_term);
  }
}

setCookie("cu", window.location.href);

function validateEmail(email) {
  var expr =
    /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
  return expr.test(email);
}
function escapeCharacters(inputString) {
  if (inputString) {
    inputString = inputString.trim();
    if (inputString.includes("%26amp;")) {
      inputString = inputString.replace(/%26amp;/g, "%26");
    }
    if (inputString.includes("&")) {
      inputString = inputString.replace(/&/g, "%26");
    }
    if (inputString.includes("'")) {
      inputString = inputString.replace(/'/g, "%27");
    }
    if (inputString.includes("‘")) {
      inputString = inputString.replace(/‘/g, "%27");
    }
    if (inputString.includes("’")) {
      inputString = inputString.replace(/’/g, "%27");
    }
    if (inputString.includes("%26nbsp;")) {
      inputString = inputString.replace(/%26nbsp;/g, " ");
    }
    if (inputString.includes('"')) {
      inputString = inputString.replace(/\"/g, "%22");
    }
    if (inputString.includes("×")) {
      inputString = inputString.replace(/×/g, "x");
    }
    if (inputString.includes("%;")) {
      inputString = inputString.replace(/%;/g, "%25");
    }
  }
  return inputString;
}
function digit(evO) {
  evO = objEvent(evO);
  if (!evO) return false;
  if (evO.e.keyCode == 0 || evO.e.keyCode == 229) {
    return true; // case for tablet
  }
  if (evO.e.shiftKey && evO.e.keyCode == 9) return true;
  if (evO.e.shiftKey || evO.e.keyCode == 16 || evO.e.keyCode == 110)
    return false;
  var r = evO.e.keyCode >= 48 && evO.e.keyCode <= 57;
  if (r) return true;
  r = evO.e.keyCode >= 96 && evO.e.keyCode <= 105;
  if (r) return true;
  r = evO.e.keyCode >= 37 && evO.e.keyCode <= 40;
  if (r) return true;
  var is = search(evO.e.keyCode, keys);
  return is >= 0;
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
          data["data"],
          $("#" + formId + " #stateId"),
          "Select State/Province*"
        );
        if (formId == "inquiryForm") {
          $("#" + formId + " #countryCode").val(
            $("#" + formId + " #countryId")
              .val()
              .trim()
          );
        } else if (formId == "b2bRequest") {
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
function getRequestForMaster(formId, key, value, requestExtra, requestExtra1) {
  var request = {};
  var authentication = {};
  var MasterRequestDTO = {};
  MasterRequestDTO["requestKey"] = key;
  MasterRequestDTO["requestValue"] = value;
  // if (requestExtra != undefined) {
  // 	requestData['requestExtra'] = requestExtra;
  // }
  // if (requestExtra1 != undefined) {
  // 	requestData['requestExtra1'] = requestExtra1;
  // }
  // authentication['hash'] = getHash(); authentication['schoolId'] = SCHOOL_ID; authentication['schoolUUID'] = SCHOOL_UUID;
  // authentication['userType'] = 'COMMON';
  // request['authentication'] = authentication;
  // request['requestData'] = requestData;
  return MasterRequestDTO;
}
function resetDropdown(dropdown, emptyMessage) {
  dropdown.html("");
  //dropdown.append('<option value="0">' + emptyMessage + '</option>');
  dropdown.append("<option disabled selected> </option>");
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
function callCities(formId, value, elementId) {
  if (!validateRequestForMaster(formId, elementId)) {
    $("#" + formId + " #cityId")
      .val(0)
      .trigger("change");
    resetDropdown($("#" + formId + " #cityId"), "Select city");
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
        showMessageRequestDemoPage(true, stringMessage[1], "serverError", "");
      } else {
        buildDropdown(data["data"], $("#cityId"), "Select city");
      }
      $("#cityId").prop("disabled", false);
      return false;
    },
    error: function (e) {
      $("#cityId").prop("disabled", false);
    },
  });
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
var keys = [8, 9, 13, 37, 46, 110];
var months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
function search(v, a) {
  for (var i = 0; i < a.length; i++) if (a[i] == v) return i;
  return -1;
}
function objEvent(evt) {
  evt = evt ? evt : event ? event : null;
  if (evt)
    return {
      e: evt,
      src: evt.srcElement ? evt.srcElement : evt.target,
      form: (evt.srcElement ? evt.srcElement : evt.target).form,
    };
  return null;
}
function isChars(evO) {
  evO = objEvent(evO);
  if (!evO) return false;
  if (evO.e.keyCode == 0 || evO.e.keyCode == 229) {
    return true; // case for tablet
  }
  if (evO.e.shiftKey == true) {
    var r = evO.e.keyCode >= 65 && evO.e.keyCode <= 90;
    if (r) return true;
    else return false;
  }
  r = evO.e.keyCode > 96 && evO.e.keyCode <= 122;
  if (r) return false;
  if (evO.e.shiftKey && evO.e.keyCode == 9) return true;
  if (evO.e.shiftKey || evO.e.keyCode == 16 || evO.e.keyCode == 39) return true;
  var r = evO.e.keyCode == 32 || evO.e.keyCode == 127;
  if (r) return true;

  var r = evO.e.keyCode >= 65 && evO.e.keyCode <= 90;
  if (r) return true;
  var is = search(evO.e.keyCode, keys);
  return is >= 0;
}
var countriesAsJson =
  '{"status":"1","statusCode":"100","message":"country list","data":[{"key":"1","value":"Afghanistan","orderBy":"1","extra":"AF","extra1":"+93"},{"key":"2","value":"Albania","orderBy":"2","extra":"AL","extra1":"+355"},{"key":"3","value":"Algeria","orderBy":"3","extra":"DZ","extra1":"+213"},{"key":"4","value":"American Samoa","orderBy":"4","extra":"AS","extra1":"+1684"},{"key":"5","value":"Andorra","orderBy":"5","extra":"AD","extra1":"+376"},{"key":"6","value":"Angola","orderBy":"6","extra":"AO","extra1":"+244"},{"key":"7","value":"Anguilla","orderBy":"7","extra":"AI","extra1":"+1264"},{"key":"8","value":"Antarctica","orderBy":"8","extra":"AQ","extra1":"+672"},{"key":"9","value":"Antigua And Barbudans","orderBy":"9","extra":"AG","extra1":"+1268"},{"key":"10","value":"Argentina","orderBy":"10","extra":"AR","extra1":"+54"},{"key":"11","value":"Armenia","orderBy":"11","extra":"AM","extra1":"+374"},{"key":"12","value":"Aruba","orderBy":"12","extra":"AW","extra1":"+297"},{"key":"13","value":"Australia","orderBy":"13","extra":"AU","extra1":"+61"},{"key":"14","value":"Austria","orderBy":"14","extra":"AT","extra1":"+43"},{"key":"15","value":"Azerbaijan","orderBy":"15","extra":"AZ","extra1":"+994"},{"key":"16","value":"Bahamas The","orderBy":"16","extra":"BS","extra1":"+1242"},{"key":"17","value":"Bahrain","orderBy":"17","extra":"BH","extra1":"+973"},{"key":"18","value":"Bangladesh","orderBy":"18","extra":"BD","extra1":"+880"},{"key":"19","value":"Barbados","orderBy":"19","extra":"BB","extra1":"+1246"},{"key":"20","value":"Belarus","orderBy":"20","extra":"BY","extra1":"+375"},{"key":"21","value":"Belgium","orderBy":"21","extra":"BE","extra1":"+32"},{"key":"22","value":"Belize","orderBy":"22","extra":"BZ","extra1":"+501"},{"key":"23","value":"Benin","orderBy":"23","extra":"BJ","extra1":"+229"},{"key":"24","value":"Bermuda","orderBy":"24","extra":"BM","extra1":"+1441"},{"key":"25","value":"Bhutan","orderBy":"25","extra":"BT","extra1":"+975"},{"key":"26","value":"Bolivia","orderBy":"26","extra":"BO","extra1":"+591"},{"key":"27","value":"Bosnia and Herzegovina","orderBy":"27","extra":"BA","extra1":"+387"},{"key":"28","value":"Botswana","orderBy":"28","extra":"BW","extra1":"+267"},{"key":"29","value":"Bouvet Island","orderBy":"29","extra":"BV","extra1":"+55"},{"key":"30","value":"Brazil","orderBy":"30","extra":"BR","extra1":"+55"},{"key":"31","value":"British Indian Ocean Territory","orderBy":"31","extra":"IO","extra1":"+246"},{"key":"32","value":"Brunei","orderBy":"32","extra":"BN","extra1":"+673"},{"key":"33","value":"Bulgaria","orderBy":"33","extra":"BG","extra1":"+359"},{"key":"34","value":"Burkina Faso","orderBy":"34","extra":"BF","extra1":"+226"},{"key":"35","value":"Burundi","orderBy":"35","extra":"BI","extra1":"+257"},{"key":"36","value":"Cambodia","orderBy":"36","extra":"KH","extra1":"+855"},{"key":"37","value":"Cameroon","orderBy":"37","extra":"CM","extra1":"+237"},{"key":"38","value":"Canada","orderBy":"38","extra":"CA","extra1":"+1"},{"key":"39","value":"Cape Verde","orderBy":"39","extra":"CV","extra1":"+238"},{"key":"40","value":"Cayman Islands","orderBy":"40","extra":"KY","extra1":"+1345"},{"key":"41","value":"Central African Republic","orderBy":"41","extra":"CF","extra1":"+236"},{"key":"42","value":"Chad","orderBy":"42","extra":"TD","extra1":"+235"},{"key":"43","value":"Chile","orderBy":"43","extra":"CL","extra1":"+56"},{"key":"44","value":"China","orderBy":"44","extra":"CN","extra1":"+86"},{"key":"45","value":"Christmas Island","orderBy":"45","extra":"CX","extra1":"+61"},{"key":"46","value":"Cocos (Keeling) Islands","orderBy":"46","extra":"CC","extra1":"+891"},{"key":"47","value":"Colombia","orderBy":"47","extra":"CO","extra1":"+57"},{"key":"48","value":"Comoros","orderBy":"48","extra":"KM","extra1":"+269"},{"key":"49","value":"Congo","orderBy":"49","extra":"CG","extra1":"+242"},{"key":"50","value":"Congo The Democratic Republic Of The","orderBy":"50","extra":"CD","extra1":"+243"},{"key":"51","value":"Cook Islands","orderBy":"51","extra":"CK","extra1":"+682"},{"key":"52","value":"Costa Rica","orderBy":"52","extra":"CR","extra1":"+506"},{"key":"53","value":"Cote D\'Ivoire (Ivory Coast)","orderBy":"53","extra":"CI","extra1":"+225"},{"key":"54","value":"Croatia (Hrvatska)","orderBy":"54","extra":"HR","extra1":"+385"},{"key":"55","value":"Cuba","orderBy":"55","extra":"CU","extra1":"+53"},{"key":"56","value":"Cyprus","orderBy":"56","extra":"CY","extra1":"+357"},{"key":"57","value":"Czechia","orderBy":"57","extra":"CZ","extra1":"+420"},{"key":"58","value":"Denmark","orderBy":"58","extra":"DK","extra1":"+45"},{"key":"59","value":"Djibouti","orderBy":"59","extra":"DJ","extra1":"+253"},{"key":"60","value":"Dominica","orderBy":"60","extra":"DM","extra1":"+1767"},{"key":"61","value":"Dominican Republic","orderBy":"61","extra":"DO","extra1":"+1809"},{"key":"62","value":"East Timor","orderBy":"62","extra":"BH","extra1":"+670"},{"key":"63","value":"Ecuador","orderBy":"63","extra":"EC","extra1":"+593"},{"key":"64","value":"Egypt","orderBy":"64","extra":"EG","extra1":"+20"},{"key":"65","value":"El Salvador","orderBy":"65","extra":"SV","extra1":"+503"},{"key":"66","value":"Equatorial Guinea","orderBy":"66","extra":"GQ","extra1":"+240"},{"key":"67","value":"Eritrea","orderBy":"67","extra":"ER","extra1":"+291"},{"key":"68","value":"Estonia","orderBy":"68","extra":"EE","extra1":"+372"},{"key":"69","value":"Ethiopia","orderBy":"69","extra":"ET","extra1":"+251"},{"key":"70","value":"External Territories of Australia","orderBy":"70","extra":"BH","extra1":"+672"},{"key":"71","value":"Falkland Islands","orderBy":"71","extra":"FK","extra1":"+500"},{"key":"72","value":"Faroe Islands","orderBy":"72","extra":"FO","extra1":"+298"},{"key":"73","value":"Fiji Islands","orderBy":"73","extra":"FJ","extra1":"+679"},{"key":"74","value":"Finland","orderBy":"74","extra":"FI","extra1":"+358"},{"key":"75","value":"France","orderBy":"75","extra":"FR","extra1":"+33"},{"key":"76","value":"French Guiana","orderBy":"76","extra":"GF","extra1":"+594"},{"key":"77","value":"French Polynesia","orderBy":"77","extra":"PF","extra1":"+689"},{"key":"78","value":"French Southern Territories","orderBy":"78","extra":"TF","extra1":"+262"},{"key":"79","value":"Gabon","orderBy":"79","extra":"GA","extra1":"+241"},{"key":"80","value":"Gambia The","orderBy":"80","extra":"GM","extra1":"+220"},{"key":"81","value":"Georgia","orderBy":"81","extra":"GE","extra1":"+995"},{"key":"82","value":"Germany","orderBy":"82","extra":"DE","extra1":"+49"},{"key":"83","value":"Ghana","orderBy":"83","extra":"GH","extra1":"+233"},{"key":"84","value":"Gibraltar","orderBy":"84","extra":"GI","extra1":"+350"},{"key":"85","value":"Greece","orderBy":"85","extra":"GR","extra1":"+30"},{"key":"86","value":"Greenland","orderBy":"86","extra":"GL","extra1":"+299"},{"key":"87","value":"Grenada","orderBy":"87","extra":"GD","extra1":"+1473"},{"key":"88","value":"Guadeloupe","orderBy":"88","extra":"GP","extra1":"+590"},{"key":"89","value":"Guam","orderBy":"89","extra":"GU","extra1":"+1671"},{"key":"90","value":"Guatemala","orderBy":"90","extra":"GT","extra1":"+502"},{"key":"91","value":"Guernsey and Alderney","orderBy":"91","extra":"BH","extra1":"+44"},{"key":"92","value":"Guinea","orderBy":"92","extra":"GN","extra1":"+224"},{"key":"93","value":"Guinea-Bissau","orderBy":"93","extra":"GW","extra1":"+245"},{"key":"94","value":"Guyana","orderBy":"94","extra":"GY","extra1":"+592"},{"key":"95","value":"Haiti","orderBy":"95","extra":"HT","extra1":"+509"},{"key":"96","value":"Heard and McDonald Islands","orderBy":"96","extra":"HM","extra1":"+1672"},{"key":"97","value":"Honduras","orderBy":"97","extra":"HN","extra1":"+504"},{"key":"98","value":"Hong Kong S.A.R.","orderBy":"98","extra":"HK","extra1":"+852"},{"key":"99","value":"Hungary","orderBy":"99","extra":"HU","extra1":"+36"},{"key":"100","value":"Iceland","orderBy":"100","extra":"IS","extra1":"+354"},{"key":"101","value":"India","orderBy":"101","extra":"IN","extra1":"+91"},{"key":"102","value":"Indonesia","orderBy":"102","extra":"ID","extra1":"+62"},{"key":"103","value":"Iran","orderBy":"103","extra":"IR","extra1":"+98"},{"key":"104","value":"Iraq","orderBy":"104","extra":"IQ","extra1":"+964"},{"key":"105","value":"Ireland","orderBy":"105","extra":"IE","extra1":"+353"},{"key":"106","value":"Israel","orderBy":"106","extra":"IL","extra1":"+972"},{"key":"107","value":"Italy","orderBy":"107","extra":"IT","extra1":"+39"},{"key":"108","value":"Jamaica","orderBy":"108","extra":"JM","extra1":"+1876"},{"key":"109","value":"Japan","orderBy":"109","extra":"JP","extra1":"+81"},{"key":"110","value":"Jersey","orderBy":"110","extra":"JE","extra1":"+44"},{"key":"111","value":"Jordan","orderBy":"111","extra":"JO","extra1":"+962"},{"key":"112","value":"Kazakhstan","orderBy":"112","extra":"KZ","extra1":"+7"},{"key":"113","value":"Kenya","orderBy":"113","extra":"KE","extra1":"+254"},{"key":"114","value":"Kiribati","orderBy":"114","extra":"KI","extra1":"+686"},{"key":"115","value":"Korea North","orderBy":"115","extra":"KP","extra1":"+850"},{"key":"116","value":"Korea South","orderBy":"116","extra":"KR","extra1":"+82"},{"key":"117","value":"Kuwait","orderBy":"117","extra":"KW","extra1":"+965"},{"key":"118","value":"Kyrgyzstan","orderBy":"118","extra":"KG","extra1":"+996"},{"key":"119","value":"Laos","orderBy":"119","extra":"LA","extra1":"+856"},{"key":"120","value":"Latvia","orderBy":"120","extra":"LV","extra1":"+371"},{"key":"121","value":"Lebanon","orderBy":"121","extra":"LB","extra1":"+961"},{"key":"122","value":"Lesotho","orderBy":"122","extra":"LS","extra1":"+266"},{"key":"123","value":"Liberia","orderBy":"123","extra":"LR","extra1":"+231"},{"key":"124","value":"Libya","orderBy":"124","extra":"LY","extra1":"+218"},{"key":"125","value":"Liechtenstein","orderBy":"125","extra":"LI","extra1":"+423"},{"key":"126","value":"Lithuania","orderBy":"126","extra":"LT","extra1":"+370"},{"key":"127","value":"Luxembourg","orderBy":"127","extra":"LU","extra1":"+352"},{"key":"128","value":"Macau S.A.R.","orderBy":"128","extra":"MO","extra1":"+853"},{"key":"129","value":"Macedonia","orderBy":"129","extra":"MK","extra1":"+389"},{"key":"130","value":"Madagascar","orderBy":"130","extra":"MG","extra1":"+261"},{"key":"131","value":"Malawi","orderBy":"131","extra":"MW","extra1":"+265"},{"key":"132","value":"Malaysia","orderBy":"132","extra":"MY","extra1":"+60"},{"key":"133","value":"Maldives","orderBy":"133","extra":"MV","extra1":"+960"},{"key":"134","value":"Mali","orderBy":"134","extra":"ML","extra1":"+223"},{"key":"135","value":"Malta","orderBy":"135","extra":"MT","extra1":"+356"},{"key":"136","value":"Man (Isle of)","orderBy":"136","extra":"BH","extra1":"+44"},{"key":"137","value":"Marshall Islands","orderBy":"137","extra":"MH","extra1":"+692"},{"key":"138","value":"Martinique","orderBy":"138","extra":"MQ","extra1":"+596"},{"key":"139","value":"Mauritania","orderBy":"139","extra":"MR","extra1":"+222"},{"key":"140","value":"Mauritius","orderBy":"140","extra":"MU","extra1":"+230"},{"key":"141","value":"Mayotte","orderBy":"141","extra":"YT","extra1":"+262"},{"key":"142","value":"Mexico","orderBy":"142","extra":"MX","extra1":"+52"},{"key":"143","value":"Micronesia","orderBy":"143","extra":"FM","extra1":"+691"},{"key":"144","value":"Moldova","orderBy":"144","extra":"MD","extra1":"+373"},{"key":"145","value":"Monaco","orderBy":"145","extra":"MC","extra1":"+377"},{"key":"146","value":"Mongolia","orderBy":"146","extra":"MN","extra1":"+976"},{"key":"147","value":"Montserrat","orderBy":"147","extra":"MS","extra1":"+1664"},{"key":"148","value":"Morocco","orderBy":"148","extra":"MA","extra1":"+212"},{"key":"149","value":"Mozambique","orderBy":"149","extra":"MZ","extra1":"+258"},{"key":"150","value":"Myanmar","orderBy":"150","extra":"MM","extra1":"+95"},{"key":"151","value":"Namibia","orderBy":"151","extra":"NA","extra1":"+264"},{"key":"152","value":"Nauru","orderBy":"152","extra":"NR","extra1":"+674"},{"key":"153","value":"Nepal","orderBy":"153","extra":"NP","extra1":"+977"},{"key":"154","value":"Netherlands Antilles","orderBy":"154","extra":"null","extra1":"+599"},{"key":"155","value":"Netherlands","orderBy":"155","extra":"NL","extra1":"+31"},{"key":"156","value":"New Caledonia","orderBy":"156","extra":"NC","extra1":"+687"},{"key":"157","value":"New Zealand","orderBy":"157","extra":"NZ","extra1":"+64"},{"key":"158","value":"Nicaragua","orderBy":"158","extra":"NI","extra1":"+505"},{"key":"159","value":"Niger","orderBy":"159","extra":"NE","extra1":"+227"},{"key":"160","value":"Nigeria","orderBy":"160","extra":"NG","extra1":"+234"},{"key":"161","value":"Niue","orderBy":"161","extra":"NU","extra1":"+683"},{"key":"162","value":"Norfolk Island","orderBy":"162","extra":"NF","extra1":"+672"},{"key":"163","value":"Northern Mariana Islands","orderBy":"163","extra":"MP","extra1":"+1670"},{"key":"164","value":"Norway","orderBy":"164","extra":"NO","extra1":"+47"},{"key":"165","value":"Oman","orderBy":"165","extra":"OM","extra1":"+968"},{"key":"166","value":"Pakistan","orderBy":"166","extra":"PK","extra1":"+92"},{"key":"167","value":"Palau","orderBy":"167","extra":"PW","extra1":"+680"},{"key":"168","value":"Palestinian Territory Occupied","orderBy":"168","extra":"PS","extra1":"+970"},{"key":"169","value":"Panama","orderBy":"169","extra":"PA","extra1":"+507"},{"key":"170","value":"Papua new Guinea","orderBy":"170","extra":"PG","extra1":"+675"},{"key":"171","value":"Paraguay","orderBy":"171","extra":"PY","extra1":"+595"},{"key":"172","value":"Peru","orderBy":"172","extra":"PE","extra1":"+51"},{"key":"173","value":"Philippines","orderBy":"173","extra":"PH","extra1":"+63"},{"key":"174","value":"Pitcairn Island","orderBy":"174","extra":"PN","extra1":"+64"},{"key":"175","value":"Poland","orderBy":"175","extra":"PL","extra1":"+48"},{"key":"176","value":"Portugal","orderBy":"176","extra":"PT","extra1":"+351"},{"key":"177","value":"Puerto Rico","orderBy":"177","extra":"PR","extra1":"+1787"},{"key":"178","value":"Qatar","orderBy":"178","extra":"QA","extra1":"+974"},{"key":"179","value":"Reunion","orderBy":"179","extra":"RE","extra1":"+262"},{"key":"180","value":"Romania","orderBy":"180","extra":"RO","extra1":"+40"},{"key":"181","value":"Russian Federation","orderBy":"181","extra":"RU","extra1":"+7"},{"key":"182","value":"Rwanda","orderBy":"182","extra":"RW","extra1":"+250"},{"key":"183","value":"Saint Helena","orderBy":"183","extra":"SH","extra1":"+290"},{"key":"184","value":"Saint Kitts And Nevis","orderBy":"184","extra":"KN","extra1":"+1869"},{"key":"185","value":"Saint Lucia","orderBy":"185","extra":"LC","extra1":"+1758"},{"key":"186","value":"Saint Pierre and Miquelon","orderBy":"186","extra":"PM","extra1":"+508"},{"key":"187","value":"Saint Vincent And The Grenadines","orderBy":"187","extra":"VC","extra1":"+1784"},{"key":"188","value":"Samoa","orderBy":"188","extra":"WS","extra1":"+685"},{"key":"189","value":"San Marino","orderBy":"189","extra":"SM","extra1":"+378"},{"key":"190","value":"Sao Tome and Principe","orderBy":"190","extra":"ST","extra1":"+239"},{"key":"191","value":"Saudi Arabia","orderBy":"191","extra":"SA","extra1":"+966"},{"key":"192","value":"Senegal","orderBy":"192","extra":"SN","extra1":"+221"},{"key":"193","value":"Serbia","orderBy":"193","extra":"RS","extra1":"+381"},{"key":"194","value":"Seychelles","orderBy":"194","extra":"SC","extra1":"+248"},{"key":"195","value":"Sierra Leone","orderBy":"195","extra":"SL","extra1":"+232"},{"key":"196","value":"Singapore","orderBy":"196","extra":"SG","extra1":"+65"},{"key":"197","value":"Slovakia","orderBy":"197","extra":"SK","extra1":"+421"},{"key":"198","value":"Slovenia","orderBy":"198","extra":"SI","extra1":"+386"},{"key":"199","value":"Smaller Territories of the UK","orderBy":"199","extra":"BH","extra1":"+44"},{"key":"200","value":"Solomon Islands","orderBy":"200","extra":"SB","extra1":"+677"},{"key":"201","value":"Somalia","orderBy":"201","extra":"SO","extra1":"+252"},{"key":"202","value":"South Africa","orderBy":"202","extra":"ZA","extra1":"+27"},{"key":"203","value":"South Georgia","orderBy":"203","extra":"GS","extra1":"+500"},{"key":"204","value":"South Sudan","orderBy":"204","extra":"SS","extra1":"+211"},{"key":"205","value":"Spain","orderBy":"205","extra":"ES","extra1":"+34"},{"key":"206","value":"Sri Lanka","orderBy":"206","extra":"LK","extra1":"+94"},{"key":"207","value":"Sudan","orderBy":"207","extra":"SD","extra1":"+249"},{"key":"208","value":"Suriname","orderBy":"208","extra":"SR","extra1":"+597"},{"key":"209","value":"Svalbard And Jan Mayen Islands","orderBy":"209","extra":"SJ","extra1":"47"},{"key":"210","value":"Swaziland","orderBy":"210","extra":"SZ","extra1":"+268"},{"key":"211","value":"Sweden","orderBy":"211","extra":"SE","extra1":"+46"},{"key":"212","value":"Switzerland","orderBy":"212","extra":"CH","extra1":"+41"},{"key":"213","value":"Syria","orderBy":"213","extra":"SY","extra1":"+963"},{"key":"214","value":"Taiwan","orderBy":"214","extra":"TW","extra1":"+886"},{"key":"215","value":"Tajikistan","orderBy":"215","extra":"TJ","extra1":"+992"},{"key":"216","value":"Tanzania","orderBy":"216","extra":"TZ","extra1":"+255"},{"key":"217","value":"Thailand","orderBy":"217","extra":"TH","extra1":"+66"},{"key":"218","value":"Togo","orderBy":"218","extra":"TG","extra1":"+228"},{"key":"219","value":"Tokelau","orderBy":"219","extra":"TK","extra1":"+690"},{"key":"220","value":"Tonga","orderBy":"220","extra":"TO","extra1":"+676"},{"key":"221","value":"Trinidad And Tobago","orderBy":"221","extra":"TT","extra1":"+1868"},{"key":"222","value":"Tunisia","orderBy":"222","extra":"TN","extra1":"+216"},{"key":"223","value":"Turkey","orderBy":"223","extra":"TR","extra1":"+90"},{"key":"224","value":"Turkmenistan","orderBy":"224","extra":"TM","extra1":"+993"},{"key":"225","value":"Turks And Caicos Islands","orderBy":"225","extra":"TC","extra1":"+1649"},{"key":"226","value":"Tuvalu","orderBy":"226","extra":"TV","extra1":"+688"},{"key":"227","value":"Uganda","orderBy":"227","extra":"UG","extra1":"+256"},{"key":"228","value":"Ukraine","orderBy":"228","extra":"UA","extra1":"+380"},{"key":"229","value":"United Arab Emirates","orderBy":"229","extra":"AE","extra1":"+971"},{"key":"230","value":"United Kingdom","orderBy":"230","extra":"GB","extra1":"+44"},{"key":"231","value":"United States","orderBy":"231","extra":"US","extra1":"+1"},{"key":"232","value":"United States Minor Outlying Islands","orderBy":"232","extra":"US","extra1":"+1"},{"key":"233","value":"Uruguay","orderBy":"233","extra":"UY","extra1":"+598"},{"key":"234","value":"Uzbekistan","orderBy":"234","extra":"UZ","extra1":"+998"},{"key":"235","value":"Vanuatu","orderBy":"235","extra":"VU","extra1":"+678"},{"key":"236","value":"Vatican City State (Holy See)","orderBy":"236","extra":"BH","extra1":"+379"},{"key":"237","value":"Venezuela","orderBy":"237","extra":"VE","extra1":"+58"},{"key":"238","value":"Vietnam","orderBy":"238","extra":"VN","extra1":"+84"},{"key":"239","value":"Virgin Islands (British)","orderBy":"239","extra":"VG","extra1":"+1284"},{"key":"240","value":"Virgin Islands (US)","orderBy":"240","extra":"VI","extra1":"+1340"},{"key":"241","value":"Wallis And Futuna Islands","orderBy":"241","extra":"WF","extra1":"+681"},{"key":"242","value":"Western Sahara","orderBy":"242","extra":"EH","extra1":"+212"},{"key":"243","value":"Yemen","orderBy":"243","extra":"YE","extra1":"+967"},{"key":"244","value":"Yugoslavia","orderBy":"244","extra":"BH","extra1":"+38"},{"key":"245","value":"Zambia","orderBy":"245","extra":"ZM","extra1":"+260"},{"key":"246","value":"Zimbabwe","orderBy":"246","extra":"ZW","extra1":"+263"}]}';
var tomezoneAsJson =
  '{"statusResponse":{"status":"SUCCESS","statusCode":"1","message":"Country timezones success"},"countryTimezoneList":[{"key":"1","value":"Asia/Kabul","orderBy":"1","extra":"GMT +04:30","extra1":"Afghanistan","extra2":"AF","extra3":"Kabul","extra4":"+0430"},{"key":"2","value":"Europe/Tirane","orderBy":"2","extra":"GMT +01:00","extra1":"Albania","extra2":"AL","extra3":"Tirane","extra4":"+0100"},{"key":"3","value":"Africa/Algiers","orderBy":"3","extra":"GMT +01:00","extra1":"Algeria","extra2":"DZ","extra3":"Algiers","extra4":"+0100"},{"key":"4","value":"Pacific/Pago_Pago","orderBy":"4","extra":"GMT -11:00","extra1":"American Samoa","extra2":"AS","extra3":"Pago Pago","extra4":"-1100"},{"key":"5","value":"Europe/Andorra","orderBy":"5","extra":"GMT +01:00","extra1":"Andorra","extra2":"AD","extra3":"Andorra","extra4":"+0100"},{"key":"6","value":"Africa/Luanda","orderBy":"6","extra":"GMT +01:00","extra1":"Angola","extra2":"AO","extra3":"Luanda","extra4":"+0100"},{"key":"7","value":"America/Anguilla","orderBy":"7","extra":"GMT -04:00","extra1":"Anguilla","extra2":"AI","extra3":"Anguilla","extra4":"-0400"},{"key":"8","value":"Antarctica/Casey","orderBy":"8","extra":"GMT +08:00","extra1":"Antarctica","extra2":"AQ","extra3":"Casey","extra4":"+0800"},{"key":"9","value":"Antarctica/Davis","orderBy":"9","extra":"GMT +07:00","extra1":"Antarctica","extra2":"AQ","extra3":"Davis","extra4":"+0700"},{"key":"10","value":"Antarctica/DumontDUrville","orderBy":"10","extra":"GMT +10:00","extra1":"Antarctica","extra2":"AQ","extra3":"DumontDUrville","extra4":"+1000"},{"key":"11","value":"Antarctica/Mawson","orderBy":"11","extra":"GMT +05:00","extra1":"Antarctica","extra2":"AQ","extra3":"Mawson","extra4":"+0500"},{"key":"12","value":"Antarctica/McMurdo","orderBy":"12","extra":"GMT +13:00","extra1":"Antarctica","extra2":"AQ","extra3":"McMurdo","extra4":"+1300"},{"key":"13","value":"Antarctica/Palmer","orderBy":"13","extra":"GMT -03:00","extra1":"Antarctica","extra2":"AQ","extra3":"Palmer","extra4":"-0300"},{"key":"14","value":"Antarctica/Rothera","orderBy":"14","extra":"GMT -03:00","extra1":"Antarctica","extra2":"AQ","extra3":"Rothera","extra4":"-0300"},{"key":"15","value":"Antarctica/Syowa","orderBy":"15","extra":"GMT +03:00","extra1":"Antarctica","extra2":"AQ","extra3":"Syowa","extra4":"+0300"},{"key":"16","value":"Antarctica/Troll","orderBy":"16","extra":"GMT +00:00","extra1":"Antarctica","extra2":"AQ","extra3":"Troll","extra4":"+0000"},{"key":"17","value":"Antarctica/Vostok","orderBy":"17","extra":"GMT +06:00","extra1":"Antarctica","extra2":"AQ","extra3":"Vostok","extra4":"+0600"},{"key":"18","value":"America/Antigua","orderBy":"18","extra":"GMT -04:00","extra1":"Antigua and Barbuda","extra2":"AG","extra3":"Antigua","extra4":"-0400"},{"key":"19","value":"America/Argentina/Buenos_Aires","orderBy":"19","extra":"GMT -03:00","extra1":"Argentina","extra2":"AR","extra3":"Buenos Aires","extra4":"-0300"},{"key":"20","value":"America/Argentina/Catamarca","orderBy":"20","extra":"GMT -03:00","extra1":"Argentina","extra2":"AR","extra3":"Catamarca","extra4":"-0300"},{"key":"21","value":"America/Argentina/Cordoba","orderBy":"21","extra":"GMT -03:00","extra1":"Argentina","extra2":"AR","extra3":"Cordoba","extra4":"-0300"},{"key":"22","value":"America/Argentina/Jujuy","orderBy":"22","extra":"GMT -03:00","extra1":"Argentina","extra2":"AR","extra3":"Jujuy","extra4":"-0300"},{"key":"23","value":"America/Argentina/La_Rioja","orderBy":"23","extra":"GMT -03:00","extra1":"Argentina","extra2":"AR","extra3":"La Rioja","extra4":"-0300"},{"key":"24","value":"America/Argentina/Mendoza","orderBy":"24","extra":"GMT -03:00","extra1":"Argentina","extra2":"AR","extra3":"Mendoza","extra4":"-0300"},{"key":"25","value":"America/Argentina/Rio_Gallegos","orderBy":"25","extra":"GMT -03:00","extra1":"Argentina","extra2":"AR","extra3":"Rio Gallegos","extra4":"-0300"},{"key":"26","value":"America/Argentina/Salta","orderBy":"26","extra":"GMT -03:00","extra1":"Argentina","extra2":"AR","extra3":"Salta","extra4":"-0300"},{"key":"27","value":"America/Argentina/San_Juan","orderBy":"27","extra":"GMT -03:00","extra1":"Argentina","extra2":"AR","extra3":"San Juan","extra4":"-0300"},{"key":"28","value":"America/Argentina/San_Luis","orderBy":"28","extra":"GMT -03:00","extra1":"Argentina","extra2":"AR","extra3":"San Luis","extra4":"-0300"},{"key":"29","value":"America/Argentina/Tucuman","orderBy":"29","extra":"GMT -03:00","extra1":"Argentina","extra2":"AR","extra3":"Tucuman","extra4":"-0300"},{"key":"30","value":"America/Argentina/Ushuaia","orderBy":"30","extra":"GMT -03:00","extra1":"Argentina","extra2":"AR","extra3":"Ushuaia","extra4":"-0300"},{"key":"31","value":"Asia/Yerevan","orderBy":"31","extra":"GMT +04:00","extra1":"Armenia","extra2":"AM","extra3":"Yerevan","extra4":"+0400"},{"key":"32","value":"America/Aruba","orderBy":"32","extra":"GMT -04:00","extra1":"Aruba","extra2":"AW","extra3":"Aruba","extra4":"-0400"},{"key":"34","value":"Australia/Adelaide","orderBy":"33","extra":"GMT +10:30","extra1":"Australia","extra2":"AU","extra3":"Adelaide","extra4":"+1030"},{"key":"35","value":"Australia/Brisbane","orderBy":"34","extra":"GMT +10:00","extra1":"Australia","extra2":"AU","extra3":"Brisbane","extra4":"+1000"},{"key":"36","value":"Australia/Broken_Hill","orderBy":"35","extra":"GMT +10:30","extra1":"Australia","extra2":"AU","extra3":"Broken Hill","extra4":"+1030"},{"key":"37","value":"Australia/Currie","orderBy":"36","extra":"GMT +11:00","extra1":"Australia","extra2":"AU","extra3":"Currie","extra4":"+1100"},{"key":"38","value":"Australia/Darwin","orderBy":"37","extra":"GMT +09:30","extra1":"Australia","extra2":"AU","extra3":"Darwin","extra4":"+0930"},{"key":"39","value":"Australia/Eucla","orderBy":"38","extra":"GMT +08:45","extra1":"Australia","extra2":"AU","extra3":"Eucla","extra4":"+0845"},{"key":"40","value":"Australia/Hobart","orderBy":"39","extra":"GMT +11:00","extra1":"Australia","extra2":"AU","extra3":"Hobart","extra4":"+1100"},{"key":"41","value":"Australia/Lindeman","orderBy":"40","extra":"GMT +10:00","extra1":"Australia","extra2":"AU","extra3":"Lindeman","extra4":"+1000"},{"key":"42","value":"Australia/Lord_Howe","orderBy":"41","extra":"GMT +11:00","extra1":"Australia","extra2":"AU","extra3":"Lord Howe","extra4":"+1100"},{"key":"33","value":"Antarctica/Macquarie","orderBy":"42","extra":"GMT +11:00","extra1":"Australia","extra2":"AU","extra3":"Macquarie","extra4":"+1100"},{"key":"43","value":"Australia/Melbourne","orderBy":"43","extra":"GMT +11:00","extra1":"Australia","extra2":"AU","extra3":"Melbourne","extra4":"+1100"},{"key":"44","value":"Australia/Perth","orderBy":"44","extra":"GMT +08:00","extra1":"Australia","extra2":"AU","extra3":"Perth","extra4":"+0800"},{"key":"45","value":"Australia/Sydney","orderBy":"45","extra":"GMT +11:00","extra1":"Australia","extra2":"AU","extra3":"Sydney","extra4":"+1100"},{"key":"46","value":"Europe/Vienna","orderBy":"46","extra":"GMT +01:00","extra1":"Austria","extra2":"AT","extra3":"Vienna","extra4":"+0100"},{"key":"47","value":"Asia/Baku","orderBy":"47","extra":"GMT +04:00","extra1":"Azerbaijan","extra2":"AZ","extra3":"Baku","extra4":"+0400"},{"key":"48","value":"America/Nassau","orderBy":"48","extra":"GMT -04:00","extra1":"Bahamas","extra2":"BS","extra3":"Nassau","extra4":"-0400"},{"key":"49","value":"Asia/Bahrain","orderBy":"49","extra":"GMT +03:00","extra1":"Bahrain","extra2":"BH","extra3":"Bahrain","extra4":"+0300"},{"key":"50","value":"Asia/Dhaka","orderBy":"50","extra":"GMT +06:00","extra1":"Bangladesh","extra2":"BD","extra3":"Dhaka","extra4":"+0600"},{"key":"51","value":"America/Barbados","orderBy":"51","extra":"GMT -04:00","extra1":"Barbados","extra2":"BB","extra3":"Barbados","extra4":"-0400"},{"key":"52","value":"Europe/Minsk","orderBy":"52","extra":"GMT +03:00","extra1":"Belarus","extra2":"BY","extra3":"Minsk","extra4":"+0300"},{"key":"53","value":"Europe/Brussels","orderBy":"53","extra":"GMT +01:00","extra1":"Belgium","extra2":"BE","extra3":"Brussels","extra4":"+0100"},{"key":"54","value":"America/Belize","orderBy":"54","extra":"GMT -06:00","extra1":"Belize","extra2":"BZ","extra3":"Belize","extra4":"-0600"},{"key":"55","value":"Africa/Porto-Novo","orderBy":"55","extra":"GMT +01:00","extra1":"Benin","extra2":"BJ","extra3":"Porto-Novo","extra4":"+0100"},{"key":"56","value":"Atlantic/Bermuda","orderBy":"56","extra":"GMT -03:00","extra1":"Bermuda","extra2":"BM","extra3":"Bermuda","extra4":"-0300"},{"key":"57","value":"Asia/Thimphu","orderBy":"57","extra":"GMT +06:00","extra1":"Bhutan","extra2":"BT","extra3":"Thimphu","extra4":"+0600"},{"key":"58","value":"America/La_Paz","orderBy":"58","extra":"GMT -04:00","extra1":"Bolivia, Plurinational State of","extra2":"BO","extra3":"La Paz","extra4":"-0400"},{"key":"59","value":"America/Kralendijk","orderBy":"59","extra":"GMT -04:00","extra1":"Bonaire, Sint Eustatius and Saba","extra2":"BQ","extra3":"Kralendijk","extra4":"-0400"},{"key":"60","value":"Europe/Sarajevo","orderBy":"60","extra":"GMT +01:00","extra1":"Bosnia and Herzegovina","extra2":"BA","extra3":"Sarajevo","extra4":"+0100"},{"key":"61","value":"Africa/Gaborone","orderBy":"61","extra":"GMT +02:00","extra1":"Botswana","extra2":"BW","extra3":"Gaborone","extra4":"+0200"},{"key":"62","value":"America/Araguaina","orderBy":"62","extra":"GMT -03:00","extra1":"Brazil","extra2":"BR","extra3":"Araguaina","extra4":"-0300"},{"key":"63","value":"America/Bahia","orderBy":"63","extra":"GMT -03:00","extra1":"Brazil","extra2":"BR","extra3":"Bahia","extra4":"-0300"},{"key":"64","value":"America/Belem","orderBy":"64","extra":"GMT -03:00","extra1":"Brazil","extra2":"BR","extra3":"Belem","extra4":"-0300"},{"key":"65","value":"America/Boa_Vista","orderBy":"65","extra":"GMT -04:00","extra1":"Brazil","extra2":"BR","extra3":"Boa Vista","extra4":"-0400"},{"key":"66","value":"America/Campo_Grande","orderBy":"66","extra":"GMT -04:00","extra1":"Brazil","extra2":"BR","extra3":"Campo Grande","extra4":"-0400"},{"key":"67","value":"America/Cuiaba","orderBy":"67","extra":"GMT -04:00","extra1":"Brazil","extra2":"BR","extra3":"Cuiaba","extra4":"-0400"},{"key":"68","value":"America/Eirunepe","orderBy":"68","extra":"GMT -05:00","extra1":"Brazil","extra2":"BR","extra3":"Eirunepe","extra4":"-0500"},{"key":"69","value":"America/Fortaleza","orderBy":"69","extra":"GMT -03:00","extra1":"Brazil","extra2":"BR","extra3":"Fortaleza","extra4":"-0300"},{"key":"70","value":"America/Maceio","orderBy":"70","extra":"GMT -03:00","extra1":"Brazil","extra2":"BR","extra3":"Maceio","extra4":"-0300"},{"key":"71","value":"America/Manaus","orderBy":"71","extra":"GMT -04:00","extra1":"Brazil","extra2":"BR","extra3":"Manaus","extra4":"-0400"},{"key":"72","value":"America/Noronha","orderBy":"72","extra":"GMT -02:00","extra1":"Brazil","extra2":"BR","extra3":"Noronha","extra4":"-0200"},{"key":"73","value":"America/Porto_Velho","orderBy":"73","extra":"GMT -04:00","extra1":"Brazil","extra2":"BR","extra3":"Porto Velho","extra4":"-0400"},{"key":"74","value":"America/Recife","orderBy":"74","extra":"GMT -03:00","extra1":"Brazil","extra2":"BR","extra3":"Recife","extra4":"-0300"},{"key":"75","value":"America/Rio_Branco","orderBy":"75","extra":"GMT -05:00","extra1":"Brazil","extra2":"BR","extra3":"Rio Branco","extra4":"-0500"},{"key":"76","value":"America/Santarem","orderBy":"76","extra":"GMT -03:00","extra1":"Brazil","extra2":"BR","extra3":"Santarem","extra4":"-0300"},{"key":"77","value":"America/Sao_Paulo","orderBy":"77","extra":"GMT -03:00","extra1":"Brazil","extra2":"BR","extra3":"Sao Paulo","extra4":"-0300"},{"key":"78","value":"Indian/Chagos","orderBy":"78","extra":"GMT +06:00","extra1":"British Indian Ocean Territory","extra2":"IO","extra3":"Chagos","extra4":"+0600"},{"key":"79","value":"Asia/Brunei","orderBy":"79","extra":"GMT +08:00","extra1":"Brunei Darussalam","extra2":"BN","extra3":"Brunei","extra4":"+0800"},{"key":"80","value":"Europe/Sofia","orderBy":"80","extra":"GMT +02:00","extra1":"Bulgaria","extra2":"BG","extra3":"Sofia","extra4":"+0200"},{"key":"81","value":"Africa/Ouagadougou","orderBy":"81","extra":"GMT +00:00","extra1":"Burkina Faso","extra2":"BF","extra3":"Ouagadougou","extra4":"+0000"},{"key":"82","value":"Africa/Bujumbura","orderBy":"82","extra":"GMT +02:00","extra1":"Burundi","extra2":"BI","extra3":"Bujumbura","extra4":"+0200"},{"key":"83","value":"Asia/Phnom_Penh","orderBy":"83","extra":"GMT +07:00","extra1":"Cambodia","extra2":"KH","extra3":"Phnom Penh","extra4":"+0700"},{"key":"84","value":"Africa/Douala","orderBy":"84","extra":"GMT +01:00","extra1":"Cameroon","extra2":"CM","extra3":"Douala","extra4":"+0100"},{"key":"85","value":"America/Atikokan","orderBy":"85","extra":"GMT -05:00","extra1":"Canada","extra2":"CA","extra3":"Atikokan","extra4":"-0500"},{"key":"86","value":"America/Blanc-Sablon","orderBy":"86","extra":"GMT -04:00","extra1":"Canada","extra2":"CA","extra3":"Blanc-Sablon","extra4":"-0400"},{"key":"87","value":"America/Cambridge_Bay","orderBy":"87","extra":"GMT -06:00","extra1":"Canada","extra2":"CA","extra3":"Cambridge Bay","extra4":"-0600"},{"key":"88","value":"America/Creston","orderBy":"88","extra":"GMT -07:00","extra1":"Canada","extra2":"CA","extra3":"Creston","extra4":"-0700"},{"key":"89","value":"America/Dawson","orderBy":"89","extra":"GMT -07:00","extra1":"Canada","extra2":"CA","extra3":"Dawson","extra4":"-0700"},{"key":"90","value":"America/Dawson_Creek","orderBy":"90","extra":"GMT -07:00","extra1":"Canada","extra2":"CA","extra3":"Dawson Creek","extra4":"-0700"},{"key":"91","value":"America/Edmonton","orderBy":"91","extra":"GMT -06:00","extra1":"Canada","extra2":"CA","extra3":"Edmonton","extra4":"-0600"},{"key":"92","value":"America/Fort_Nelson","orderBy":"92","extra":"GMT -07:00","extra1":"Canada","extra2":"CA","extra3":"Fort Nelson","extra4":"-0700"},{"key":"93","value":"America/Glace_Bay","orderBy":"93","extra":"GMT -03:00","extra1":"Canada","extra2":"CA","extra3":"Glace Bay","extra4":"-0300"},{"key":"94","value":"America/Goose_Bay","orderBy":"94","extra":"GMT -03:00","extra1":"Canada","extra2":"CA","extra3":"Goose Bay","extra4":"-0300"},{"key":"95","value":"America/Halifax","orderBy":"95","extra":"GMT -03:00","extra1":"Canada","extra2":"CA","extra3":"Halifax","extra4":"-0300"},{"key":"96","value":"America/Inuvik","orderBy":"96","extra":"GMT -06:00","extra1":"Canada","extra2":"CA","extra3":"Inuvik","extra4":"-0600"},{"key":"97","value":"America/Iqaluit","orderBy":"97","extra":"GMT -04:00","extra1":"Canada","extra2":"CA","extra3":"Iqaluit","extra4":"-0400"},{"key":"98","value":"America/Moncton","orderBy":"98","extra":"GMT -03:00","extra1":"Canada","extra2":"CA","extra3":"Moncton","extra4":"-0300"},{"key":"99","value":"America/Nipigon","orderBy":"99","extra":"GMT -04:00","extra1":"Canada","extra2":"CA","extra3":"Nipigon","extra4":"-0400"},{"key":"100","value":"America/Pangnirtung","orderBy":"100","extra":"GMT -04:00","extra1":"Canada","extra2":"CA","extra3":"Pangnirtung","extra4":"-0400"},{"key":"101","value":"America/Rainy_River","orderBy":"101","extra":"GMT -05:00","extra1":"Canada","extra2":"CA","extra3":"Rainy River","extra4":"-0500"},{"key":"102","value":"America/Rankin_Inlet","orderBy":"102","extra":"GMT -05:00","extra1":"Canada","extra2":"CA","extra3":"Rankin Inlet","extra4":"-0500"},{"key":"103","value":"America/Regina","orderBy":"103","extra":"GMT -06:00","extra1":"Canada","extra2":"CA","extra3":"Regina","extra4":"-0600"},{"key":"104","value":"America/Resolute","orderBy":"104","extra":"GMT -05:00","extra1":"Canada","extra2":"CA","extra3":"Resolute","extra4":"-0500"},{"key":"105","value":"America/St_Johns","orderBy":"105","extra":"GMT -02:30","extra1":"Canada","extra2":"CA","extra3":"St Johns","extra4":"-0230"},{"key":"106","value":"America/Swift_Current","orderBy":"106","extra":"GMT -06:00","extra1":"Canada","extra2":"CA","extra3":"Swift Current","extra4":"-0600"},{"key":"107","value":"America/Thunder_Bay","orderBy":"107","extra":"GMT -04:00","extra1":"Canada","extra2":"CA","extra3":"Thunder Bay","extra4":"-0400"},{"key":"108","value":"America/Toronto","orderBy":"108","extra":"GMT -04:00","extra1":"Canada","extra2":"CA","extra3":"Toronto","extra4":"-0400"},{"key":"109","value":"America/Vancouver","orderBy":"109","extra":"GMT -07:00","extra1":"Canada","extra2":"CA","extra3":"Vancouver","extra4":"-0700"},{"key":"110","value":"America/Whitehorse","orderBy":"110","extra":"GMT -07:00","extra1":"Canada","extra2":"CA","extra3":"Whitehorse","extra4":"-0700"},{"key":"111","value":"America/Winnipeg","orderBy":"111","extra":"GMT -05:00","extra1":"Canada","extra2":"CA","extra3":"Winnipeg","extra4":"-0500"},{"key":"112","value":"America/Yellowknife","orderBy":"112","extra":"GMT -06:00","extra1":"Canada","extra2":"CA","extra3":"Yellowknife","extra4":"-0600"},{"key":"113","value":"Atlantic/Cape_Verde","orderBy":"113","extra":"GMT -01:00","extra1":"Cape Verde","extra2":"CV","extra3":"Cape Verde","extra4":"-0100"},{"key":"114","value":"America/Cayman","orderBy":"114","extra":"GMT -05:00","extra1":"Cayman Islands","extra2":"KY","extra3":"Cayman","extra4":"-0500"},{"key":"115","value":"Africa/Bangui","orderBy":"115","extra":"GMT +01:00","extra1":"Central African Republic","extra2":"CF","extra3":"Bangui","extra4":"+0100"},{"key":"116","value":"Africa/Ndjamena","orderBy":"116","extra":"GMT +01:00","extra1":"Chad","extra2":"TD","extra3":"Ndjamena","extra4":"+0100"},{"key":"119","value":"Pacific/Easter","orderBy":"117","extra":"GMT -05:00","extra1":"Chile","extra2":"CL","extra3":"Easter","extra4":"-0500"},{"key":"117","value":"America/Punta_Arenas","orderBy":"118","extra":"GMT -03:00","extra1":"Chile","extra2":"CL","extra3":"Punta Arenas","extra4":"-0300"},{"key":"118","value":"America/Santiago","orderBy":"119","extra":"GMT -03:00","extra1":"Chile","extra2":"CL","extra3":"Santiago","extra4":"-0300"},{"key":"120","value":"Asia/Shanghai","orderBy":"120","extra":"GMT +08:00","extra1":"China","extra2":"CN","extra3":"Shanghai","extra4":"+0800"},{"key":"121","value":"Asia/Urumqi","orderBy":"121","extra":"GMT +06:00","extra1":"China","extra2":"CN","extra3":"Urumqi","extra4":"+0600"},{"key":"122","value":"Indian/Christmas","orderBy":"122","extra":"GMT +07:00","extra1":"Christmas Island","extra2":"CX","extra3":"Christmas","extra4":"+0700"},{"key":"123","value":"Indian/Cocos","orderBy":"123","extra":"GMT +06:30","extra1":"Cocos (Keeling) Islands","extra2":"CC","extra3":"Cocos","extra4":"+0630"},{"key":"124","value":"America/Bogota","orderBy":"124","extra":"GMT -05:00","extra1":"Colombia","extra2":"CO","extra3":"Bogota","extra4":"-0500"},{"key":"125","value":"Indian/Comoro","orderBy":"125","extra":"GMT +03:00","extra1":"Comoros","extra2":"KM","extra3":"Comoro","extra4":"+0300"},{"key":"126","value":"Africa/Brazzaville","orderBy":"126","extra":"GMT +01:00","extra1":"Congo","extra2":"CG","extra3":"Brazzaville","extra4":"+0100"},{"key":"127","value":"Africa/Kinshasa","orderBy":"127","extra":"GMT +01:00","extra1":"Congo, the Democratic Republic of the","extra2":"CD","extra3":"Kinshasa","extra4":"+0100"},{"key":"128","value":"Africa/Lubumbashi","orderBy":"128","extra":"GMT +02:00","extra1":"Congo, the Democratic Republic of the","extra2":"CD","extra3":"Lubumbashi","extra4":"+0200"},{"key":"129","value":"Pacific/Rarotonga","orderBy":"129","extra":"GMT -10:00","extra1":"Cook Islands","extra2":"CK","extra3":"Rarotonga","extra4":"-1000"},{"key":"130","value":"America/Costa_Rica","orderBy":"130","extra":"GMT -06:00","extra1":"Costa Rica","extra2":"CR","extra3":"Costa Rica","extra4":"-0600"},{"key":"131","value":"Europe/Zagreb","orderBy":"131","extra":"GMT +01:00","extra1":"Croatia","extra2":"HR","extra3":"Zagreb","extra4":"+0100"},{"key":"132","value":"America/Havana","orderBy":"132","extra":"GMT -04:00","extra1":"Cuba","extra2":"CU","extra3":"Havana","extra4":"-0400"},{"key":"133","value":"America/Curacao","orderBy":"133","extra":"GMT -04:00","extra1":"Curaçao","extra2":"CW","extra3":"Curacao","extra4":"-0400"},{"key":"134","value":"Asia/Famagusta","orderBy":"134","extra":"GMT +02:00","extra1":"Cyprus","extra2":"CY","extra3":"Famagusta","extra4":"+0200"},{"key":"135","value":"Asia/Nicosia","orderBy":"135","extra":"GMT +02:00","extra1":"Cyprus","extra2":"CY","extra3":"Nicosia","extra4":"+0200"},{"key":"136","value":"Europe/Prague","orderBy":"136","extra":"GMT +01:00","extra1":"Czech Republic","extra2":"CZ","extra3":"Prague","extra4":"+0100"},{"key":"138","value":"Europe/Copenhagen","orderBy":"137","extra":"GMT +01:00","extra1":"Denmark","extra2":"DK","extra3":"Copenhagen","extra4":"+0100"},{"key":"139","value":"Africa/Djibouti","orderBy":"138","extra":"GMT +03:00","extra1":"Djibouti","extra2":"DJ","extra3":"Djibouti","extra4":"+0300"},{"key":"140","value":"America/Dominica","orderBy":"139","extra":"GMT -04:00","extra1":"Dominica","extra2":"DM","extra3":"Dominica","extra4":"-0400"},{"key":"141","value":"America/Santo_Domingo","orderBy":"140","extra":"GMT -04:00","extra1":"Dominican Republic","extra2":"DO","extra3":"Santo Domingo","extra4":"-0400"},{"key":"143","value":"Pacific/Galapagos","orderBy":"141","extra":"GMT -06:00","extra1":"Ecuador","extra2":"EC","extra3":"Galapagos","extra4":"-0600"},{"key":"142","value":"America/Guayaquil","orderBy":"142","extra":"GMT -05:00","extra1":"Ecuador","extra2":"EC","extra3":"Guayaquil","extra4":"-0500"},{"key":"144","value":"Africa/Cairo","orderBy":"143","extra":"GMT +02:00","extra1":"Egypt","extra2":"EG","extra3":"Cairo","extra4":"+0200"},{"key":"145","value":"America/El_Salvador","orderBy":"144","extra":"GMT -06:00","extra1":"El Salvador","extra2":"SV","extra3":"El Salvador","extra4":"-0600"},{"key":"146","value":"Africa/Malabo","orderBy":"145","extra":"GMT +01:00","extra1":"Equatorial Guinea","extra2":"GQ","extra3":"Malabo","extra4":"+0100"},{"key":"147","value":"Africa/Asmara","orderBy":"146","extra":"GMT +03:00","extra1":"Eritrea","extra2":"ER","extra3":"Asmara","extra4":"+0300"},{"key":"148","value":"Europe/Tallinn","orderBy":"147","extra":"GMT +02:00","extra1":"Estonia","extra2":"EE","extra3":"Tallinn","extra4":"+0200"},{"key":"149","value":"Africa/Addis_Ababa","orderBy":"148","extra":"GMT +03:00","extra1":"Ethiopia","extra2":"ET","extra3":"Addis Ababa","extra4":"+0300"},{"key":"150","value":"Atlantic/Stanley","orderBy":"149","extra":"GMT -03:00","extra1":"Falkland Islands (Malvinas)","extra2":"FK","extra3":"Stanley","extra4":"-0300"},{"key":"151","value":"Atlantic/Faroe","orderBy":"150","extra":"GMT +00:00","extra1":"Faroe Islands","extra2":"FO","extra3":"Faroe","extra4":"+0000"},{"key":"152","value":"Pacific/Fiji","orderBy":"151","extra":"GMT +12:00","extra1":"Fiji","extra2":"FJ","extra3":"Fiji","extra4":"+1200"},{"key":"153","value":"Europe/Helsinki","orderBy":"152","extra":"GMT +02:00","extra1":"Finland","extra2":"FI","extra3":"Helsinki","extra4":"+0200"},{"key":"154","value":"Europe/Paris","orderBy":"153","extra":"GMT +01:00","extra1":"France","extra2":"FR","extra3":"Paris","extra4":"+0100"},{"key":"155","value":"America/Cayenne","orderBy":"154","extra":"GMT -03:00","extra1":"French Guiana","extra2":"GF","extra3":"Cayenne","extra4":"-0300"},{"key":"156","value":"Pacific/Gambier","orderBy":"155","extra":"GMT -09:00","extra1":"French Polynesia","extra2":"PF","extra3":"Gambier","extra4":"-0900"},{"key":"157","value":"Pacific/Marquesas","orderBy":"156","extra":"GMT -09:30","extra1":"French Polynesia","extra2":"PF","extra3":"Marquesas","extra4":"-0930"},{"key":"158","value":"Pacific/Tahiti","orderBy":"157","extra":"GMT -10:00","extra1":"French Polynesia","extra2":"PF","extra3":"Tahiti","extra4":"-1000"},{"key":"159","value":"Indian/Kerguelen","orderBy":"158","extra":"GMT +05:00","extra1":"French Southern Territories","extra2":"TF","extra3":"Kerguelen","extra4":"+0500"},{"key":"160","value":"Africa/Libreville","orderBy":"159","extra":"GMT +01:00","extra1":"Gabon","extra2":"GA","extra3":"Libreville","extra4":"+0100"},{"key":"161","value":"Africa/Banjul","orderBy":"160","extra":"GMT +00:00","extra1":"Gambia","extra2":"GM","extra3":"Banjul","extra4":"+0000"},{"key":"162","value":"Asia/Tbilisi","orderBy":"161","extra":"GMT +04:00","extra1":"Georgia","extra2":"GE","extra3":"Tbilisi","extra4":"+0400"},{"key":"163","value":"Europe/Berlin","orderBy":"162","extra":"GMT +01:00","extra1":"Germany","extra2":"DE","extra3":"Berlin","extra4":"+0100"},{"key":"164","value":"Europe/Busingen","orderBy":"163","extra":"GMT +01:00","extra1":"Germany","extra2":"DE","extra3":"Busingen","extra4":"+0100"},{"key":"165","value":"Africa/Accra","orderBy":"164","extra":"GMT +00:00","extra1":"Ghana","extra2":"GH","extra3":"Accra","extra4":"+0000"},{"key":"166","value":"Europe/Gibraltar","orderBy":"165","extra":"GMT +01:00","extra1":"Gibraltar","extra2":"GI","extra3":"Gibraltar","extra4":"+0100"},{"key":"167","value":"Europe/Athens","orderBy":"166","extra":"GMT +02:00","extra1":"Greece","extra2":"GR","extra3":"Athens","extra4":"+0200"},{"key":"168","value":"America/Danmarkshavn","orderBy":"167","extra":"GMT +00:00","extra1":"Greenland","extra2":"GL","extra3":"Danmarkshavn","extra4":"+0000"},{"key":"169","value":"America/Godthab","orderBy":"168","extra":"GMT -03:00","extra1":"Greenland","extra2":"GL","extra3":"Godthab","extra4":"-0300"},{"key":"170","value":"America/Scoresbysund","orderBy":"169","extra":"GMT -01:00","extra1":"Greenland","extra2":"GL","extra3":"Scoresbysund","extra4":"-0100"},{"key":"171","value":"America/Thule","orderBy":"170","extra":"GMT -03:00","extra1":"Greenland","extra2":"GL","extra3":"Thule","extra4":"-0300"},{"key":"172","value":"America/Grenada","orderBy":"171","extra":"GMT -04:00","extra1":"Grenada","extra2":"GD","extra3":"Grenada","extra4":"-0400"},{"key":"173","value":"America/Guadeloupe","orderBy":"172","extra":"GMT -04:00","extra1":"Guadeloupe","extra2":"GP","extra3":"Guadeloupe","extra4":"-0400"},{"key":"174","value":"Pacific/Guam","orderBy":"173","extra":"GMT +10:00","extra1":"Guam","extra2":"GU","extra3":"Guam","extra4":"+1000"},{"key":"175","value":"America/Guatemala","orderBy":"174","extra":"GMT -06:00","extra1":"Guatemala","extra2":"GT","extra3":"Guatemala","extra4":"-0600"},{"key":"176","value":"Europe/Guernsey","orderBy":"175","extra":"GMT +00:00","extra1":"Guernsey","extra2":"GG","extra3":"Guernsey","extra4":"+0000"},{"key":"177","value":"Africa/Conakry","orderBy":"176","extra":"GMT +00:00","extra1":"Guinea","extra2":"GN","extra3":"Conakry","extra4":"+0000"},{"key":"178","value":"Africa/Bissau","orderBy":"177","extra":"GMT +00:00","extra1":"Guinea-Bissau","extra2":"GW","extra3":"Bissau","extra4":"+0000"},{"key":"179","value":"America/Guyana","orderBy":"178","extra":"GMT -04:00","extra1":"Guyana","extra2":"GY","extra3":"Guyana","extra4":"-0400"},{"key":"180","value":"America/Port-au-Prince","orderBy":"179","extra":"GMT -04:00","extra1":"Haiti","extra2":"HT","extra3":"Port-au-Prince","extra4":"-0400"},{"key":"181","value":"Europe/Vatican","orderBy":"180","extra":"GMT +01:00","extra1":"Holy See (Vatican City State)","extra2":"VA","extra3":"Vatican","extra4":"+0100"},{"key":"182","value":"America/Tegucigalpa","orderBy":"181","extra":"GMT -06:00","extra1":"Honduras","extra2":"HN","extra3":"Tegucigalpa","extra4":"-0600"},{"key":"183","value":"Asia/Hong_Kong","orderBy":"182","extra":"GMT +08:00","extra1":"Hong Kong","extra2":"HK","extra3":"Hong Kong","extra4":"+0800"},{"key":"184","value":"Europe/Budapest","orderBy":"183","extra":"GMT +01:00","extra1":"Hungary","extra2":"HU","extra3":"Budapest","extra4":"+0100"},{"key":"185","value":"Atlantic/Reykjavik","orderBy":"184","extra":"GMT +00:00","extra1":"Iceland","extra2":"IS","extra3":"Reykjavik","extra4":"+0000"},{"key":"186","value":"Asia/Kolkata","orderBy":"185","extra":"GMT +05:30","extra1":"India","extra2":"IN","extra3":"Kolkata","extra4":"+0530"},{"key":"187","value":"Asia/Jakarta","orderBy":"186","extra":"GMT +07:00","extra1":"Indonesia","extra2":"ID","extra3":"Jakarta","extra4":"+0700"},{"key":"188","value":"Asia/Jayapura","orderBy":"187","extra":"GMT +09:00","extra1":"Indonesia","extra2":"ID","extra3":"Jayapura","extra4":"+0900"},{"key":"189","value":"Asia/Makassar","orderBy":"188","extra":"GMT +08:00","extra1":"Indonesia","extra2":"ID","extra3":"Makassar","extra4":"+0800"},{"key":"190","value":"Asia/Pontianak","orderBy":"189","extra":"GMT +07:00","extra1":"Indonesia","extra2":"ID","extra3":"Pontianak","extra4":"+0700"},{"key":"191","value":"Asia/Tehran","orderBy":"190","extra":"GMT +04:30","extra1":"Iran, Islamic Republic of","extra2":"IR","extra3":"Tehran","extra4":"+0430"},{"key":"192","value":"Asia/Baghdad","orderBy":"191","extra":"GMT +03:00","extra1":"Iraq","extra2":"IQ","extra3":"Baghdad","extra4":"+0300"},{"key":"193","value":"Europe/Dublin","orderBy":"192","extra":"GMT +00:00","extra1":"Ireland","extra2":"IE","extra3":"Dublin","extra4":"+0000"},{"key":"194","value":"Europe/Isle_of_Man","orderBy":"193","extra":"GMT +00:00","extra1":"Isle of Man","extra2":"IM","extra3":"Isle of Man","extra4":"+0000"},{"key":"195","value":"Asia/Jerusalem","orderBy":"194","extra":"GMT +02:00","extra1":"Israel","extra2":"IL","extra3":"Jerusalem","extra4":"+0200"},{"key":"196","value":"Europe/Rome","orderBy":"195","extra":"GMT +01:00","extra1":"Italy","extra2":"IT","extra3":"Rome","extra4":"+0100"},{"key":"137","value":"Africa/Abidjan","orderBy":"196","extra":"GMT +00:00","extra1":"Ivory Coast","extra2":"CI","extra3":"Abidjan","extra4":"+0000"},{"key":"197","value":"America/Jamaica","orderBy":"197","extra":"GMT -05:00","extra1":"Jamaica","extra2":"JM","extra3":"Jamaica","extra4":"-0500"},{"key":"198","value":"Asia/Tokyo","orderBy":"198","extra":"GMT +09:00","extra1":"Japan","extra2":"JP","extra3":"Tokyo","extra4":"+0900"},{"key":"199","value":"Europe/Jersey","orderBy":"199","extra":"GMT +00:00","extra1":"Jersey","extra2":"JE","extra3":"Jersey","extra4":"+0000"},{"key":"200","value":"Asia/Amman","orderBy":"200","extra":"GMT +02:00","extra1":"Jordan","extra2":"JO","extra3":"Amman","extra4":"+0200"},{"key":"201","value":"Asia/Almaty","orderBy":"201","extra":"GMT +06:00","extra1":"Kazakhstan","extra2":"KZ","extra3":"Almaty","extra4":"+0600"},{"key":"202","value":"Asia/Aqtau","orderBy":"202","extra":"GMT +05:00","extra1":"Kazakhstan","extra2":"KZ","extra3":"Aqtau","extra4":"+0500"},{"key":"203","value":"Asia/Aqtobe","orderBy":"203","extra":"GMT +05:00","extra1":"Kazakhstan","extra2":"KZ","extra3":"Aqtobe","extra4":"+0500"},{"key":"204","value":"Asia/Atyrau","orderBy":"204","extra":"GMT +05:00","extra1":"Kazakhstan","extra2":"KZ","extra3":"Atyrau","extra4":"+0500"},{"key":"205","value":"Asia/Oral","orderBy":"205","extra":"GMT +05:00","extra1":"Kazakhstan","extra2":"KZ","extra3":"Oral","extra4":"+0500"},{"key":"206","value":"Asia/Qostanay","orderBy":"206","extra":"GMT +06:00","extra1":"Kazakhstan","extra2":"KZ","extra3":"Qostanay","extra4":"+0600"},{"key":"207","value":"Asia/Qyzylorda","orderBy":"207","extra":"GMT +05:00","extra1":"Kazakhstan","extra2":"KZ","extra3":"Qyzylorda","extra4":"+0500"},{"key":"208","value":"Africa/Nairobi","orderBy":"208","extra":"GMT +03:00","extra1":"Kenya","extra2":"KE","extra3":"Nairobi","extra4":"+0300"},{"key":"209","value":"Pacific/Enderbury","orderBy":"209","extra":"GMT +13:00","extra1":"Kiribati","extra2":"KI","extra3":"Enderbury","extra4":"+1300"},{"key":"210","value":"Pacific/Kiritimati","orderBy":"210","extra":"GMT +14:00","extra1":"Kiribati","extra2":"KI","extra3":"Kiritimati","extra4":"+1400"},{"key":"211","value":"Pacific/Tarawa","orderBy":"211","extra":"GMT +12:00","extra1":"Kiribati","extra2":"KI","extra3":"Tarawa","extra4":"+1200"},{"key":"214","value":"Asia/Kuwait","orderBy":"212","extra":"GMT +03:00","extra1":"Kuwait","extra2":"KW","extra3":"Kuwait","extra4":"+0300"},{"key":"215","value":"Asia/Bishkek","orderBy":"213","extra":"GMT +06:00","extra1":"Kyrgyzstan","extra2":"KG","extra3":"Bishkek","extra4":"+0600"},{"key":"216","value":"Asia/Vientiane","orderBy":"214","extra":"GMT +07:00","extra1":"Laos","extra2":"LA","extra3":"Vientiane","extra4":"+0700"},{"key":"217","value":"Europe/Riga","orderBy":"215","extra":"GMT +02:00","extra1":"Latvia","extra2":"LV","extra3":"Riga","extra4":"+0200"},{"key":"218","value":"Asia/Beirut","orderBy":"216","extra":"GMT +02:00","extra1":"Lebanon","extra2":"LB","extra3":"Beirut","extra4":"+0200"},{"key":"219","value":"Africa/Maseru","orderBy":"217","extra":"GMT +02:00","extra1":"Lesotho","extra2":"LS","extra3":"Maseru","extra4":"+0200"},{"key":"220","value":"Africa/Monrovia","orderBy":"218","extra":"GMT +00:00","extra1":"Liberia","extra2":"LR","extra3":"Monrovia","extra4":"+0000"},{"key":"221","value":"Africa/Tripoli","orderBy":"219","extra":"GMT +02:00","extra1":"Libya","extra2":"LY","extra3":"Tripoli","extra4":"+0200"},{"key":"222","value":"Europe/Vaduz","orderBy":"220","extra":"GMT +01:00","extra1":"Liechtenstein","extra2":"LI","extra3":"Vaduz","extra4":"+0100"},{"key":"223","value":"Europe/Vilnius","orderBy":"221","extra":"GMT +02:00","extra1":"Lithuania","extra2":"LT","extra3":"Vilnius","extra4":"+0200"},{"key":"224","value":"Europe/Luxembourg","orderBy":"222","extra":"GMT +01:00","extra1":"Luxembourg","extra2":"LU","extra3":"Luxembourg","extra4":"+0100"},{"key":"225","value":"Asia/Macau","orderBy":"223","extra":"GMT +08:00","extra1":"Macao","extra2":"MO","extra3":"Macau","extra4":"+0800"},{"key":"226","value":"Europe/Skopje","orderBy":"224","extra":"GMT +01:00","extra1":"Macedonia, the Former Yugoslav Republic of","extra2":"MK","extra3":"Skopje","extra4":"+0100"},{"key":"227","value":"Indian/Antananarivo","orderBy":"225","extra":"GMT +03:00","extra1":"Madagascar","extra2":"MG","extra3":"Antananarivo","extra4":"+0300"},{"key":"228","value":"Africa/Blantyre","orderBy":"226","extra":"GMT +02:00","extra1":"Malawi","extra2":"MW","extra3":"Blantyre","extra4":"+0200"},{"key":"229","value":"Asia/Kuala_Lumpur","orderBy":"227","extra":"GMT +08:00","extra1":"Malaysia","extra2":"MY","extra3":"Kuala Lumpur","extra4":"+0800"},{"key":"230","value":"Asia/Kuching","orderBy":"228","extra":"GMT +08:00","extra1":"Malaysia","extra2":"MY","extra3":"Kuching","extra4":"+0800"},{"key":"231","value":"Indian/Maldives","orderBy":"229","extra":"GMT +05:00","extra1":"Maldives","extra2":"MV","extra3":"Maldives","extra4":"+0500"},{"key":"232","value":"Africa/Bamako","orderBy":"230","extra":"GMT +00:00","extra1":"Mali","extra2":"ML","extra3":"Bamako","extra4":"+0000"},{"key":"233","value":"Europe/Malta","orderBy":"231","extra":"GMT +01:00","extra1":"Malta","extra2":"MT","extra3":"Malta","extra4":"+0100"},{"key":"234","value":"Pacific/Kwajalein","orderBy":"232","extra":"GMT +12:00","extra1":"Marshall Islands","extra2":"MH","extra3":"Kwajalein","extra4":"+1200"},{"key":"235","value":"Pacific/Majuro","orderBy":"233","extra":"GMT +12:00","extra1":"Marshall Islands","extra2":"MH","extra3":"Majuro","extra4":"+1200"},{"key":"236","value":"America/Martinique","orderBy":"234","extra":"GMT -04:00","extra1":"Martinique","extra2":"MQ","extra3":"Martinique","extra4":"-0400"},{"key":"237","value":"Africa/Nouakchott","orderBy":"235","extra":"GMT +00:00","extra1":"Mauritania","extra2":"MR","extra3":"Nouakchott","extra4":"+0000"},{"key":"238","value":"Indian/Mauritius","orderBy":"236","extra":"GMT +04:00","extra1":"Mauritius","extra2":"MU","extra3":"Mauritius","extra4":"+0400"},{"key":"239","value":"Indian/Mayotte","orderBy":"237","extra":"GMT +03:00","extra1":"Mayotte","extra2":"YT","extra3":"Mayotte","extra4":"+0300"},{"key":"240","value":"America/Bahia_Banderas","orderBy":"238","extra":"GMT -06:00","extra1":"Mexico","extra2":"MX","extra3":"Bahia Banderas","extra4":"-0600"},{"key":"241","value":"America/Cancun","orderBy":"239","extra":"GMT -05:00","extra1":"Mexico","extra2":"MX","extra3":"Cancun","extra4":"-0500"},{"key":"242","value":"America/Chihuahua","orderBy":"240","extra":"GMT -07:00","extra1":"Mexico","extra2":"MX","extra3":"Chihuahua","extra4":"-0700"},{"key":"243","value":"America/Hermosillo","orderBy":"241","extra":"GMT -07:00","extra1":"Mexico","extra2":"MX","extra3":"Hermosillo","extra4":"-0700"},{"key":"244","value":"America/Matamoros","orderBy":"242","extra":"GMT -05:00","extra1":"Mexico","extra2":"MX","extra3":"Matamoros","extra4":"-0500"},{"key":"245","value":"America/Mazatlan","orderBy":"243","extra":"GMT -07:00","extra1":"Mexico","extra2":"MX","extra3":"Mazatlan","extra4":"-0700"},{"key":"246","value":"America/Merida","orderBy":"244","extra":"GMT -06:00","extra1":"Mexico","extra2":"MX","extra3":"Merida","extra4":"-0600"},{"key":"247","value":"America/Mexico_City","orderBy":"245","extra":"GMT -06:00","extra1":"Mexico","extra2":"MX","extra3":"Mexico City","extra4":"-0600"},{"key":"248","value":"America/Monterrey","orderBy":"246","extra":"GMT -06:00","extra1":"Mexico","extra2":"MX","extra3":"Monterrey","extra4":"-0600"},{"key":"249","value":"America/Ojinaga","orderBy":"247","extra":"GMT -06:00","extra1":"Mexico","extra2":"MX","extra3":"Ojinaga","extra4":"-0600"},{"key":"250","value":"America/Tijuana","orderBy":"248","extra":"GMT -07:00","extra1":"Mexico","extra2":"MX","extra3":"Tijuana","extra4":"-0700"},{"key":"251","value":"Pacific/Chuuk","orderBy":"249","extra":"GMT +10:00","extra1":"Micronesia, Federated States of","extra2":"FM","extra3":"Chuuk","extra4":"+1000"},{"key":"252","value":"Pacific/Kosrae","orderBy":"250","extra":"GMT +11:00","extra1":"Micronesia, Federated States of","extra2":"FM","extra3":"Kosrae","extra4":"+1100"},{"key":"253","value":"Pacific/Pohnpei","orderBy":"251","extra":"GMT +11:00","extra1":"Micronesia, Federated States of","extra2":"FM","extra3":"Pohnpei","extra4":"+1100"},{"key":"254","value":"Europe/Chisinau","orderBy":"252","extra":"GMT +02:00","extra1":"Moldova, Republic of","extra2":"MD","extra3":"Chisinau","extra4":"+0200"},{"key":"255","value":"Europe/Monaco","orderBy":"253","extra":"GMT +01:00","extra1":"Monaco","extra2":"MC","extra3":"Monaco","extra4":"+0100"},{"key":"256","value":"Asia/Choibalsan","orderBy":"254","extra":"GMT +08:00","extra1":"Mongolia","extra2":"MN","extra3":"Choibalsan","extra4":"+0800"},{"key":"257","value":"Asia/Hovd","orderBy":"255","extra":"GMT +07:00","extra1":"Mongolia","extra2":"MN","extra3":"Hovd","extra4":"+0700"},{"key":"258","value":"Asia/Ulaanbaatar","orderBy":"256","extra":"GMT +08:00","extra1":"Mongolia","extra2":"MN","extra3":"Ulaanbaatar","extra4":"+0800"},{"key":"259","value":"Europe/Podgorica","orderBy":"257","extra":"GMT +01:00","extra1":"Montenegro","extra2":"ME","extra3":"Podgorica","extra4":"+0100"},{"key":"260","value":"America/Montserrat","orderBy":"258","extra":"GMT -04:00","extra1":"Montserrat","extra2":"MS","extra3":"Montserrat","extra4":"-0400"},{"key":"261","value":"Africa/Casablanca","orderBy":"259","extra":"GMT +00:00","extra1":"Morocco","extra2":"MA","extra3":"Casablanca","extra4":"+0000"},{"key":"262","value":"Africa/Maputo","orderBy":"260","extra":"GMT +02:00","extra1":"Mozambique","extra2":"MZ","extra3":"Maputo","extra4":"+0200"},{"key":"263","value":"Asia/Yangon","orderBy":"261","extra":"GMT +06:30","extra1":"Myanmar","extra2":"MM","extra3":"Yangon","extra4":"+0630"},{"key":"264","value":"Africa/Windhoek","orderBy":"262","extra":"GMT +02:00","extra1":"Namibia","extra2":"NA","extra3":"Windhoek","extra4":"+0200"},{"key":"265","value":"Pacific/Nauru","orderBy":"263","extra":"GMT +12:00","extra1":"Nauru","extra2":"NR","extra3":"Nauru","extra4":"+1200"},{"key":"266","value":"Asia/Kathmandu","orderBy":"264","extra":"GMT +05:45","extra1":"Nepal","extra2":"NP","extra3":"Kathmandu","extra4":"+0545"},{"key":"267","value":"Europe/Amsterdam","orderBy":"265","extra":"GMT +01:00","extra1":"Netherlands","extra2":"NL","extra3":"Amsterdam","extra4":"+0100"},{"key":"268","value":"Pacific/Noumea","orderBy":"266","extra":"GMT +11:00","extra1":"New Caledonia","extra2":"NC","extra3":"Noumea","extra4":"+1100"},{"key":"269","value":"Pacific/Auckland","orderBy":"267","extra":"GMT +13:00","extra1":"New Zealand","extra2":"NZ","extra3":"Auckland","extra4":"+1300"},{"key":"270","value":"Pacific/Chatham","orderBy":"268","extra":"GMT +13:45","extra1":"New Zealand","extra2":"NZ","extra3":"Chatham","extra4":"+1345"},{"key":"271","value":"America/Managua","orderBy":"269","extra":"GMT -06:00","extra1":"Nicaragua","extra2":"NI","extra3":"Managua","extra4":"-0600"},{"key":"272","value":"Africa/Niamey","orderBy":"270","extra":"GMT +01:00","extra1":"Niger","extra2":"NE","extra3":"Niamey","extra4":"+0100"},{"key":"273","value":"Africa/Lagos","orderBy":"271","extra":"GMT +01:00","extra1":"Nigeria","extra2":"NG","extra3":"Lagos","extra4":"+0100"},{"key":"274","value":"Pacific/Niue","orderBy":"272","extra":"GMT -11:00","extra1":"Niue","extra2":"NU","extra3":"Niue","extra4":"-1100"},{"key":"275","value":"Pacific/Norfolk","orderBy":"273","extra":"GMT +12:00","extra1":"Norfolk Island","extra2":"NF","extra3":"Norfolk","extra4":"+1200"},{"key":"212","value":"Asia/Pyongyang","orderBy":"274","extra":"GMT +09:00","extra1":"North Korea","extra2":"KP","extra3":"Pyongyang","extra4":"+0900"},{"key":"276","value":"Pacific/Saipan","orderBy":"275","extra":"GMT +10:00","extra1":"Northern Mariana Islands","extra2":"MP","extra3":"Saipan","extra4":"+1000"},{"key":"277","value":"Europe/Oslo","orderBy":"276","extra":"GMT +01:00","extra1":"Norway","extra2":"NO","extra3":"Oslo","extra4":"+0100"},{"key":"278","value":"Asia/Muscat","orderBy":"277","extra":"GMT +04:00","extra1":"Oman","extra2":"OM","extra3":"Muscat","extra4":"+0400"},{"key":"279","value":"Asia/Karachi","orderBy":"278","extra":"GMT +05:00","extra1":"Pakistan","extra2":"PK","extra3":"Karachi","extra4":"+0500"},{"key":"280","value":"Pacific/Palau","orderBy":"279","extra":"GMT +09:00","extra1":"Palau","extra2":"PW","extra3":"Palau","extra4":"+0900"},{"key":"281","value":"Asia/Gaza","orderBy":"280","extra":"GMT +02:00","extra1":"Palestine, State of","extra2":"PS","extra3":"Gaza","extra4":"+0200"},{"key":"282","value":"Asia/Hebron","orderBy":"281","extra":"GMT +02:00","extra1":"Palestine, State of","extra2":"PS","extra3":"Hebron","extra4":"+0200"},{"key":"283","value":"America/Panama","orderBy":"282","extra":"GMT -05:00","extra1":"Panama","extra2":"PA","extra3":"Panama","extra4":"-0500"},{"key":"284","value":"Pacific/Bougainville","orderBy":"283","extra":"GMT +11:00","extra1":"Papua New Guinea","extra2":"PG","extra3":"Bougainville","extra4":"+1100"},{"key":"285","value":"Pacific/Port_Moresby","orderBy":"284","extra":"GMT +10:00","extra1":"Papua New Guinea","extra2":"PG","extra3":"Port Moresby","extra4":"+1000"},{"key":"286","value":"America/Asuncion","orderBy":"285","extra":"GMT -03:00","extra1":"Paraguay","extra2":"PY","extra3":"Asuncion","extra4":"-0300"},{"key":"287","value":"America/Lima","orderBy":"286","extra":"GMT -05:00","extra1":"Peru","extra2":"PE","extra3":"Lima","extra4":"-0500"},{"key":"288","value":"Asia/Manila","orderBy":"287","extra":"GMT +08:00","extra1":"Philippines","extra2":"PH","extra3":"Manila","extra4":"+0800"},{"key":"289","value":"Pacific/Pitcairn","orderBy":"288","extra":"GMT -08:00","extra1":"Pitcairn","extra2":"PN","extra3":"Pitcairn","extra4":"-0800"},{"key":"290","value":"Europe/Warsaw","orderBy":"289","extra":"GMT +01:00","extra1":"Poland","extra2":"PL","extra3":"Warsaw","extra4":"+0100"},{"key":"291","value":"Atlantic/Azores","orderBy":"290","extra":"GMT -01:00","extra1":"Portugal","extra2":"PT","extra3":"Azores","extra4":"-0100"},{"key":"293","value":"Europe/Lisbon","orderBy":"291","extra":"GMT +00:00","extra1":"Portugal","extra2":"PT","extra3":"Lisbon","extra4":"+0000"},{"key":"292","value":"Atlantic/Madeira","orderBy":"292","extra":"GMT +00:00","extra1":"Portugal","extra2":"PT","extra3":"Madeira","extra4":"+0000"},{"key":"294","value":"America/Puerto_Rico","orderBy":"293","extra":"GMT -04:00","extra1":"Puerto Rico","extra2":"PR","extra3":"Puerto Rico","extra4":"-0400"},{"key":"295","value":"Asia/Qatar","orderBy":"294","extra":"GMT +03:00","extra1":"Qatar","extra2":"QA","extra3":"Qatar","extra4":"+0300"},{"key":"324","value":"Indian/Reunion","orderBy":"295","extra":"GMT +04:00","extra1":"Réunion","extra2":"RE","extra3":"Reunion","extra4":"+0400"},{"key":"296","value":"Europe/Bucharest","orderBy":"296","extra":"GMT +02:00","extra1":"Romania","extra2":"RO","extra3":"Bucharest","extra4":"+0200"},{"key":"297","value":"Asia/Anadyr","orderBy":"297","extra":"GMT +12:00","extra1":"Russian Federation","extra2":"RU","extra3":"Anadyr","extra4":"+1200"},{"key":"315","value":"Europe/Astrakhan","orderBy":"298","extra":"GMT +04:00","extra1":"Russian Federation","extra2":"RU","extra3":"Astrakhan","extra4":"+0400"},{"key":"298","value":"Asia/Barnaul","orderBy":"299","extra":"GMT +07:00","extra1":"Russian Federation","extra2":"RU","extra3":"Barnaul","extra4":"+0700"},{"key":"299","value":"Asia/Chita","orderBy":"300","extra":"GMT +09:00","extra1":"Russian Federation","extra2":"RU","extra3":"Chita","extra4":"+0900"},{"key":"300","value":"Asia/Irkutsk","orderBy":"301","extra":"GMT +08:00","extra1":"Russian Federation","extra2":"RU","extra3":"Irkutsk","extra4":"+0800"},{"key":"316","value":"Europe/Kaliningrad","orderBy":"302","extra":"GMT +02:00","extra1":"Russian Federation","extra2":"RU","extra3":"Kaliningrad","extra4":"+0200"},{"key":"301","value":"Asia/Kamchatka","orderBy":"303","extra":"GMT +12:00","extra1":"Russian Federation","extra2":"RU","extra3":"Kamchatka","extra4":"+1200"},{"key":"302","value":"Asia/Khandyga","orderBy":"304","extra":"GMT +09:00","extra1":"Russian Federation","extra2":"RU","extra3":"Khandyga","extra4":"+0900"},{"key":"317","value":"Europe/Kirov","orderBy":"305","extra":"GMT +03:00","extra1":"Russian Federation","extra2":"RU","extra3":"Kirov","extra4":"+0300"},{"key":"303","value":"Asia/Krasnoyarsk","orderBy":"306","extra":"GMT +07:00","extra1":"Russian Federation","extra2":"RU","extra3":"Krasnoyarsk","extra4":"+0700"},{"key":"304","value":"Asia/Magadan","orderBy":"307","extra":"GMT +11:00","extra1":"Russian Federation","extra2":"RU","extra3":"Magadan","extra4":"+1100"},{"key":"318","value":"Europe/Moscow","orderBy":"308","extra":"GMT +03:00","extra1":"Russian Federation","extra2":"RU","extra3":"Moscow","extra4":"+0300"},{"key":"305","value":"Asia/Novokuznetsk","orderBy":"309","extra":"GMT +07:00","extra1":"Russian Federation","extra2":"RU","extra3":"Novokuznetsk","extra4":"+0700"},{"key":"306","value":"Asia/Novosibirsk","orderBy":"310","extra":"GMT +07:00","extra1":"Russian Federation","extra2":"RU","extra3":"Novosibirsk","extra4":"+0700"},{"key":"307","value":"Asia/Omsk","orderBy":"311","extra":"GMT +06:00","extra1":"Russian Federation","extra2":"RU","extra3":"Omsk","extra4":"+0600"},{"key":"308","value":"Asia/Sakhalin","orderBy":"312","extra":"GMT +11:00","extra1":"Russian Federation","extra2":"RU","extra3":"Sakhalin","extra4":"+1100"},{"key":"319","value":"Europe/Samara","orderBy":"313","extra":"GMT +04:00","extra1":"Russian Federation","extra2":"RU","extra3":"Samara","extra4":"+0400"},{"key":"320","value":"Europe/Saratov","orderBy":"314","extra":"GMT +04:00","extra1":"Russian Federation","extra2":"RU","extra3":"Saratov","extra4":"+0400"},{"key":"309","value":"Asia/Srednekolymsk","orderBy":"315","extra":"GMT +11:00","extra1":"Russian Federation","extra2":"RU","extra3":"Srednekolymsk","extra4":"+1100"},{"key":"310","value":"Asia/Tomsk","orderBy":"316","extra":"GMT +07:00","extra1":"Russian Federation","extra2":"RU","extra3":"Tomsk","extra4":"+0700"},{"key":"321","value":"Europe/Ulyanovsk","orderBy":"317","extra":"GMT +04:00","extra1":"Russian Federation","extra2":"RU","extra3":"Ulyanovsk","extra4":"+0400"},{"key":"311","value":"Asia/Ust-Nera","orderBy":"318","extra":"GMT +10:00","extra1":"Russian Federation","extra2":"RU","extra3":"Ust-Nera","extra4":"+1000"},{"key":"312","value":"Asia/Vladivostok","orderBy":"319","extra":"GMT +10:00","extra1":"Russian Federation","extra2":"RU","extra3":"Vladivostok","extra4":"+1000"},{"key":"322","value":"Europe/Volgograd","orderBy":"320","extra":"GMT +04:00","extra1":"Russian Federation","extra2":"RU","extra3":"Volgograd","extra4":"+0400"},{"key":"313","value":"Asia/Yakutsk","orderBy":"321","extra":"GMT +09:00","extra1":"Russian Federation","extra2":"RU","extra3":"Yakutsk","extra4":"+0900"},{"key":"314","value":"Asia/Yekaterinburg","orderBy":"322","extra":"GMT +05:00","extra1":"Russian Federation","extra2":"RU","extra3":"Yekaterinburg","extra4":"+0500"},{"key":"323","value":"Africa/Kigali","orderBy":"323","extra":"GMT +02:00","extra1":"Rwanda","extra2":"RW","extra3":"Kigali","extra4":"+0200"},{"key":"325","value":"America/St_Barthelemy","orderBy":"324","extra":"GMT -04:00","extra1":"Saint Barthélemy","extra2":"BL","extra3":"St Barthelemy","extra4":"-0400"},{"key":"326","value":"Atlantic/St_Helena","orderBy":"325","extra":"GMT +00:00","extra1":"Saint Helena, Ascension and Tristan da Cunha","extra2":"SH","extra3":"St Helena","extra4":"+0000"},{"key":"327","value":"America/St_Kitts","orderBy":"326","extra":"GMT -04:00","extra1":"Saint Kitts and Nevis","extra2":"KN","extra3":"St Kitts","extra4":"-0400"},{"key":"328","value":"America/St_Lucia","orderBy":"327","extra":"GMT -04:00","extra1":"Saint Lucia","extra2":"LC","extra3":"St Lucia","extra4":"-0400"},{"key":"329","value":"America/Marigot","orderBy":"328","extra":"GMT -04:00","extra1":"Saint Martin (French part)","extra2":"MF","extra3":"Marigot","extra4":"-0400"},{"key":"330","value":"America/Miquelon","orderBy":"329","extra":"GMT -02:00","extra1":"Saint Pierre and Miquelon","extra2":"PM","extra3":"Miquelon","extra4":"-0200"},{"key":"331","value":"America/St_Vincent","orderBy":"330","extra":"GMT -04:00","extra1":"Saint Vincent and the Grenadines","extra2":"VC","extra3":"St Vincent","extra4":"-0400"},{"key":"332","value":"Pacific/Apia","orderBy":"331","extra":"GMT +14:00","extra1":"Samoa","extra2":"WS","extra3":"Apia","extra4":"+1400"},{"key":"333","value":"Europe/San_Marino","orderBy":"332","extra":"GMT +01:00","extra1":"San Marino","extra2":"SM","extra3":"San Marino","extra4":"+0100"},{"key":"334","value":"Africa/Sao_Tome","orderBy":"333","extra":"GMT +00:00","extra1":"Sao Tome and Principe","extra2":"ST","extra3":"Sao Tome","extra4":"+0000"},{"key":"335","value":"Asia/Riyadh","orderBy":"334","extra":"GMT +03:00","extra1":"Saudi Arabia","extra2":"SA","extra3":"Riyadh","extra4":"+0300"},{"key":"336","value":"Africa/Dakar","orderBy":"335","extra":"GMT +00:00","extra1":"Senegal","extra2":"SN","extra3":"Dakar","extra4":"+0000"},{"key":"337","value":"Europe/Belgrade","orderBy":"336","extra":"GMT +01:00","extra1":"Serbia","extra2":"RS","extra3":"Belgrade","extra4":"+0100"},{"key":"338","value":"Indian/Mahe","orderBy":"337","extra":"GMT +04:00","extra1":"Seychelles","extra2":"SC","extra3":"Mahe","extra4":"+0400"},{"key":"339","value":"Africa/Freetown","orderBy":"338","extra":"GMT +00:00","extra1":"Sierra Leone","extra2":"SL","extra3":"Freetown","extra4":"+0000"},{"key":"340","value":"Asia/Singapore","orderBy":"339","extra":"GMT +08:00","extra1":"Singapore","extra2":"SG","extra3":"Singapore","extra4":"+0800"},{"key":"341","value":"America/Lower_Princes","orderBy":"340","extra":"GMT -04:00","extra1":"Sint Maarten (Dutch part)","extra2":"SX","extra3":"Lower Princes","extra4":"-0400"},{"key":"342","value":"Europe/Bratislava","orderBy":"341","extra":"GMT +01:00","extra1":"Slovakia","extra2":"SK","extra3":"Bratislava","extra4":"+0100"},{"key":"343","value":"Europe/Ljubljana","orderBy":"342","extra":"GMT +01:00","extra1":"Slovenia","extra2":"SI","extra3":"Ljubljana","extra4":"+0100"},{"key":"344","value":"Pacific/Guadalcanal","orderBy":"343","extra":"GMT +11:00","extra1":"Solomon Islands","extra2":"SB","extra3":"Guadalcanal","extra4":"+1100"},{"key":"345","value":"Africa/Mogadishu","orderBy":"344","extra":"GMT +03:00","extra1":"Somalia","extra2":"SO","extra3":"Mogadishu","extra4":"+0300"},{"key":"346","value":"Africa/Johannesburg","orderBy":"345","extra":"GMT +02:00","extra1":"South Africa","extra2":"ZA","extra3":"Johannesburg","extra4":"+0200"},{"key":"347","value":"Atlantic/South_Georgia","orderBy":"346","extra":"GMT -02:00","extra1":"South Georgia and the South Sandwich Islands","extra2":"GS","extra3":"South Georgia","extra4":"-0200"},{"key":"213","value":"Asia/Seoul","orderBy":"347","extra":"GMT +09:00","extra1":"South Korea","extra2":"KR","extra3":"Seoul","extra4":"+0900"},{"key":"348","value":"Africa/Juba","orderBy":"348","extra":"GMT +03:00","extra1":"South Sudan","extra2":"SS","extra3":"Juba","extra4":"+0300"},{"key":"350","value":"Atlantic/Canary","orderBy":"349","extra":"GMT +00:00","extra1":"Spain","extra2":"ES","extra3":"Canary","extra4":"+0000"},{"key":"349","value":"Africa/Ceuta","orderBy":"350","extra":"GMT +01:00","extra1":"Spain","extra2":"ES","extra3":"Ceuta","extra4":"+0100"},{"key":"351","value":"Europe/Madrid","orderBy":"351","extra":"GMT +01:00","extra1":"Spain","extra2":"ES","extra3":"Madrid","extra4":"+0100"},{"key":"352","value":"Asia/Colombo","orderBy":"352","extra":"GMT +05:30","extra1":"Sri Lanka","extra2":"LK","extra3":"Colombo","extra4":"+0530"},{"key":"353","value":"Africa/Khartoum","orderBy":"353","extra":"GMT +02:00","extra1":"Sudan","extra2":"SD","extra3":"Khartoum","extra4":"+0200"},{"key":"354","value":"America/Paramaribo","orderBy":"354","extra":"GMT -03:00","extra1":"Suriname","extra2":"SR","extra3":"Paramaribo","extra4":"-0300"},{"key":"355","value":"Arctic/Longyearbyen","orderBy":"355","extra":"GMT +01:00","extra1":"Svalbard and Jan Mayen","extra2":"SJ","extra3":"Longyearbyen","extra4":"+0100"},{"key":"356","value":"Africa/Mbabane","orderBy":"356","extra":"GMT +02:00","extra1":"Swaziland","extra2":"SZ","extra3":"Mbabane","extra4":"+0200"},{"key":"357","value":"Europe/Stockholm","orderBy":"357","extra":"GMT +01:00","extra1":"Sweden","extra2":"SE","extra3":"Stockholm","extra4":"+0100"},{"key":"358","value":"Europe/Zurich","orderBy":"358","extra":"GMT +01:00","extra1":"Switzerland","extra2":"CH","extra3":"Zurich","extra4":"+0100"},{"key":"359","value":"Asia/Damascus","orderBy":"359","extra":"GMT +02:00","extra1":"Syrian Arab Republic","extra2":"SY","extra3":"Damascus","extra4":"+0200"},{"key":"360","value":"Asia/Taipei","orderBy":"360","extra":"GMT +08:00","extra1":"Taiwan, Province of China","extra2":"TW","extra3":"Taipei","extra4":"+0800"},{"key":"361","value":"Asia/Dushanbe","orderBy":"361","extra":"GMT +05:00","extra1":"Tajikistan","extra2":"TJ","extra3":"Dushanbe","extra4":"+0500"},{"key":"362","value":"Africa/Dar_es_Salaam","orderBy":"362","extra":"GMT +03:00","extra1":"Tanzania, United Republic of","extra2":"TZ","extra3":"Dar es Salaam","extra4":"+0300"},{"key":"363","value":"Asia/Bangkok","orderBy":"363","extra":"GMT +07:00","extra1":"Thailand","extra2":"TH","extra3":"Bangkok","extra4":"+0700"},{"key":"364","value":"Asia/Dili","orderBy":"364","extra":"GMT +09:00","extra1":"Timor-Leste","extra2":"TL","extra3":"Dili","extra4":"+0900"},{"key":"365","value":"Africa/Lome","orderBy":"365","extra":"GMT +00:00","extra1":"Togo","extra2":"TG","extra3":"Lome","extra4":"+0000"},{"key":"366","value":"Pacific/Fakaofo","orderBy":"366","extra":"GMT +13:00","extra1":"Tokelau","extra2":"TK","extra3":"Fakaofo","extra4":"+1300"},{"key":"367","value":"Pacific/Tongatapu","orderBy":"367","extra":"GMT +13:00","extra1":"Tonga","extra2":"TO","extra3":"Tongatapu","extra4":"+1300"},{"key":"368","value":"America/Port_of_Spain","orderBy":"368","extra":"GMT -04:00","extra1":"Trinidad and Tobago","extra2":"TT","extra3":"Port of Spain","extra4":"-0400"},{"key":"369","value":"Africa/Tunis","orderBy":"369","extra":"GMT +01:00","extra1":"Tunisia","extra2":"TN","extra3":"Tunis","extra4":"+0100"},{"key":"370","value":"Europe/Istanbul","orderBy":"370","extra":"GMT +03:00","extra1":"Turkey","extra2":"TR","extra3":"Istanbul","extra4":"+0300"},{"key":"371","value":"Asia/Ashgabat","orderBy":"371","extra":"GMT +05:00","extra1":"Turkmenistan","extra2":"TM","extra3":"Ashgabat","extra4":"+0500"},{"key":"372","value":"America/Grand_Turk","orderBy":"372","extra":"GMT -04:00","extra1":"Turks and Caicos Islands","extra2":"TC","extra3":"Grand Turk","extra4":"-0400"},{"key":"373","value":"Pacific/Funafuti","orderBy":"373","extra":"GMT +12:00","extra1":"Tuvalu","extra2":"TV","extra3":"Funafuti","extra4":"+1200"},{"key":"374","value":"Africa/Kampala","orderBy":"374","extra":"GMT +03:00","extra1":"Uganda","extra2":"UG","extra3":"Kampala","extra4":"+0300"},{"key":"375","value":"Europe/Kiev","orderBy":"375","extra":"GMT +02:00","extra1":"Ukraine","extra2":"UA","extra3":"Kiev","extra4":"+0200"},{"key":"376","value":"Europe/Simferopol","orderBy":"376","extra":"GMT +03:00","extra1":"Ukraine","extra2":"UA","extra3":"Simferopol","extra4":"+0300"},{"key":"377","value":"Europe/Uzhgorod","orderBy":"377","extra":"GMT +02:00","extra1":"Ukraine","extra2":"UA","extra3":"Uzhgorod","extra4":"+0200"},{"key":"378","value":"Europe/Zaporozhye","orderBy":"378","extra":"GMT +02:00","extra1":"Ukraine","extra2":"UA","extra3":"Zaporozhye","extra4":"+0200"},{"key":"379","value":"Asia/Dubai","orderBy":"379","extra":"GMT +04:00","extra1":"United Arab Emirates","extra2":"AE","extra3":"Dubai","extra4":"+0400"},{"key":"380","value":"Europe/London","orderBy":"380","extra":"GMT +00:00","extra1":"United Kingdom","extra2":"GB","extra3":"London","extra4":"+0000"},{"key":"381","value":"America/Adak","orderBy":"381","extra":"GMT -09:00","extra1":"United States","extra2":"US","extra3":"Adak","extra4":"-0900"},{"key":"382","value":"America/Anchorage","orderBy":"382","extra":"GMT -08:00","extra1":"United States","extra2":"US","extra3":"Anchorage","extra4":"-0800"},{"key":"403","value":"America/North_Dakota/Beulah","orderBy":"383","extra":"GMT -05:00","extra1":"United States","extra2":"US","extra3":"Beulah","extra4":"-0500"},{"key":"383","value":"America/Boise","orderBy":"384","extra":"GMT -06:00","extra1":"United States","extra2":"US","extra3":"Boise","extra4":"-0600"},{"key":"404","value":"America/North_Dakota/Center","orderBy":"385","extra":"GMT -05:00","extra1":"United States","extra2":"US","extra3":"Center","extra4":"-0500"},{"key":"384","value":"America/Chicago","orderBy":"386","extra":"GMT -05:00","extra1":"United States","extra2":"US","extra3":"Chicago","extra4":"-0500"},{"key":"385","value":"America/Denver","orderBy":"387","extra":"GMT -06:00","extra1":"United States","extra2":"US","extra3":"Denver","extra4":"-0600"},{"key":"386","value":"America/Detroit","orderBy":"388","extra":"GMT -04:00","extra1":"United States","extra2":"US","extra3":"Detroit","extra4":"-0400"},{"key":"409","value":"Pacific/Honolulu","orderBy":"389","extra":"GMT -10:00","extra1":"United States","extra2":"US","extra3":"Honolulu","extra4":"-1000"},{"key":"387","value":"America/Indiana/Indianapolis","orderBy":"390","extra":"GMT -04:00","extra1":"United States","extra2":"US","extra3":"Indianapolis","extra4":"-0400"},{"key":"395","value":"America/Juneau","orderBy":"391","extra":"GMT -08:00","extra1":"United States","extra2":"US","extra3":"Juneau","extra4":"-0800"},{"key":"388","value":"America/Indiana/Knox","orderBy":"392","extra":"GMT -05:00","extra1":"United States","extra2":"US","extra3":"Knox","extra4":"-0500"},{"key":"398","value":"America/Los_Angeles","orderBy":"393","extra":"GMT -07:00","extra1":"United States","extra2":"US","extra3":"Los Angeles","extra4":"-0700"},{"key":"396","value":"America/Kentucky/Louisville","orderBy":"394","extra":"GMT -04:00","extra1":"United States","extra2":"US","extra3":"Louisville","extra4":"-0400"},{"key":"389","value":"America/Indiana/Marengo","orderBy":"395","extra":"GMT -04:00","extra1":"United States","extra2":"US","extra3":"Marengo","extra4":"-0400"},{"key":"399","value":"America/Menominee","orderBy":"396","extra":"GMT -05:00","extra1":"United States","extra2":"US","extra3":"Menominee","extra4":"-0500"},{"key":"400","value":"America/Metlakatla","orderBy":"397","extra":"GMT -08:00","extra1":"United States","extra2":"US","extra3":"Metlakatla","extra4":"-0800"},{"key":"397","value":"America/Kentucky/Monticello","orderBy":"398","extra":"GMT -04:00","extra1":"United States","extra2":"US","extra3":"Monticello","extra4":"-0400"},{"key":"405","value":"America/North_Dakota/New_Salem","orderBy":"399","extra":"GMT -05:00","extra1":"United States","extra2":"US","extra3":"New Salem","extra4":"-0500"},{"key":"401","value":"America/New_York","orderBy":"400","extra":"GMT -04:00","extra1":"United States","extra2":"US","extra3":"New York","extra4":"-0400"},{"key":"402","value":"America/Nome","orderBy":"401","extra":"GMT -08:00","extra1":"United States","extra2":"US","extra3":"Nome","extra4":"-0800"},{"key":"390","value":"America/Indiana/Petersburg","orderBy":"402","extra":"GMT -04:00","extra1":"United States","extra2":"US","extra3":"Petersburg","extra4":"-0400"},{"key":"406","value":"America/Phoenix","orderBy":"403","extra":"GMT -07:00","extra1":"United States","extra2":"US","extra3":"Phoenix","extra4":"-0700"},{"key":"407","value":"America/Sitka","orderBy":"404","extra":"GMT -08:00","extra1":"United States","extra2":"US","extra3":"Sitka","extra4":"-0800"},{"key":"391","value":"America/Indiana/Tell_City","orderBy":"405","extra":"GMT -05:00","extra1":"United States","extra2":"US","extra3":"Tell City","extra4":"-0500"},{"key":"392","value":"America/Indiana/Vevay","orderBy":"406","extra":"GMT -04:00","extra1":"United States","extra2":"US","extra3":"Vevay","extra4":"-0400"},{"key":"393","value":"America/Indiana/Vincennes","orderBy":"407","extra":"GMT -04:00","extra1":"United States","extra2":"US","extra3":"Vincennes","extra4":"-0400"},{"key":"394","value":"America/Indiana/Winamac","orderBy":"408","extra":"GMT -04:00","extra1":"United States","extra2":"US","extra3":"Winamac","extra4":"-0400"},{"key":"408","value":"America/Yakutat","orderBy":"409","extra":"GMT -08:00","extra1":"United States","extra2":"US","extra3":"Yakutat","extra4":"-0800"},{"key":"410","value":"Pacific/Midway","orderBy":"410","extra":"GMT -11:00","extra1":"United States Minor Outlying Islands","extra2":"UM","extra3":"Midway","extra4":"-1100"},{"key":"411","value":"Pacific/Wake","orderBy":"411","extra":"GMT +12:00","extra1":"United States Minor Outlying Islands","extra2":"UM","extra3":"Wake","extra4":"+1200"},{"key":"412","value":"America/Montevideo","orderBy":"412","extra":"GMT -03:00","extra1":"Uruguay","extra2":"UY","extra3":"Montevideo","extra4":"-0300"},{"key":"413","value":"Asia/Samarkand","orderBy":"413","extra":"GMT +05:00","extra1":"Uzbekistan","extra2":"UZ","extra3":"Samarkand","extra4":"+0500"},{"key":"414","value":"Asia/Tashkent","orderBy":"414","extra":"GMT +05:00","extra1":"Uzbekistan","extra2":"UZ","extra3":"Tashkent","extra4":"+0500"},{"key":"415","value":"Pacific/Efate","orderBy":"415","extra":"GMT +11:00","extra1":"Vanuatu","extra2":"VU","extra3":"Efate","extra4":"+1100"},{"key":"416","value":"America/Caracas","orderBy":"416","extra":"GMT -04:00","extra1":"Venezuela, Bolivarian Republic of","extra2":"VE","extra3":"Caracas","extra4":"-0400"},{"key":"417","value":"Asia/Ho_Chi_Minh","orderBy":"417","extra":"GMT +07:00","extra1":"Viet Nam","extra2":"VN","extra3":"Ho Chi Minh","extra4":"+0700"},{"key":"418","value":"America/Tortola","orderBy":"418","extra":"GMT -04:00","extra1":"Virgin Islands, British","extra2":"VG","extra3":"Tortola","extra4":"-0400"},{"key":"419","value":"America/St_Thomas","orderBy":"419","extra":"GMT -04:00","extra1":"Virgin Islands, U.S.","extra2":"VI","extra3":"St Thomas","extra4":"-0400"},{"key":"420","value":"Pacific/Wallis","orderBy":"420","extra":"GMT +12:00","extra1":"Wallis and Futuna","extra2":"WF","extra3":"Wallis","extra4":"+1200"},{"key":"421","value":"Africa/El_Aaiun","orderBy":"421","extra":"GMT +01:00","extra1":"Western Sahara","extra2":"EH","extra3":"El Aaiun","extra4":"+0100"},{"key":"422","value":"Asia/Aden","orderBy":"422","extra":"GMT +03:00","extra1":"Yemen","extra2":"YE","extra3":"Aden","extra4":"+0300"},{"key":"423","value":"Africa/Lusaka","orderBy":"423","extra":"GMT +02:00","extra1":"Zambia","extra2":"ZM","extra3":"Lusaka","extra4":"+0200"},{"key":"424","value":"Africa/Harare","orderBy":"424","extra":"GMT +02:00","extra1":"Zimbabwe","extra2":"ZW","extra3":"Harare","extra4":"+0200"},{"key":"425","value":"Europe/Mariehamn","orderBy":"425","extra":"GMT +02:00","extra1":"Åland Islands","extra2":"AX","extra3":"Mariehamn","extra4":"+0200"}]}';
