$(document).ready(async function() {
    try {
        schoolSettingsLinks = await getSchoolSettingsLinks(SCHOOL_ID);
        schoolSettingsTechnical = await getSchoolSettingsTechnical(SCHOOL_ID);
    } catch (e) {
        console.error("Failed to load school settings for additional layer", e);
    }
    renderAdditionalLayerPage();
    additionalLayer();
});
async function additionalLayer(){
    var payload = {
      userId: USER_ID,     
    };
    var ajaxReqDetails = {
        method: "POST",
        url: APP_BASE_URL + SCHOOL_UUID + "/dashboard/additinal-layer-details",
        body: payload,
        global: true,
        showMessage: false,
        onFaildResolved: true,
        onSuccessResolved: true
    }
    var responseData = await callCommonAjax(ajaxReqDetails);
    if(responseData.status == 1){
        additionalLayerSections(responseData.details || {});           
    }else{
        showMessageTheme2(0, responseData.message);
    }
}
function additionalLayerSections(details) {
    var html = "";
    if (details.paymentOverDue) {
        $("#timezoneConfirm").remove();
        html = paymentOverDueCard(details);
        $("#additionalLayerContainer").html(html);

    } else if (details.createAzureUser) {
        $("#timezoneConfirm").remove();
        html = isAzureUserAvailable(details);
        $("#additionalLayerContainer").html(html);

    } else if (details.changeTimezone) {
        html = timezoneCard(details.timeZone || {});
        $("#additionalLayerContainer").html(html);
        $("#timezoneConfirm").remove();
        $("body").append(timezoneConfirmModal(details.timeZone || {}));
        initializeTimezoneSection();
    } else {
        window.location = getStudentDashboardUrl();
    }
}
function changeTimezoneInWarning(){
    var timezone = $("#countryTimezoneFromId option:selected")
                    .text()
                    .split(") - ")[1];
    $("#changeTimezone").html(timezone);
}

function initializeTimezoneSection(){
    changeTimezoneInWarning();
    $("#countryTimezoneFromId").select2({
        theme:"bootstrap4"
    });
}

function payNow(userPaymentId, schoolId) {
    checkPayment("paymentForm", userPaymentId, schoolId);
}
function confirmTimezoneSelection(userId){
    var selectedId = $("#countryTimezoneFromId").val();
    proceedWithUserChangedTimezone(selectedId, userId);
}
function readAzureValueFromRaw(raw, key) {
    if (!raw) {
        return "";
    }
    var jsonPattern = new RegExp('"' + key + '"\\s*:\\s*"([^"]*)"', "i");
    var mapPattern = new RegExp(key + "\\s*=\\s*([^,}]+)", "i");
    var match = raw.match(jsonPattern);
    if (match && match[1]) {
        return match[1].trim();
    }
    match = raw.match(mapPattern);
    if (match && match[1]) {
        return match[1].trim();
    }
    return "";
}

function setAzureValuesFromRawResponse() {
    var raw = $("#azureRawResponse").text().trim();
    if (!raw) {
        return;
    }
    var email = readAzureValueFromRaw(raw, "officialEmail");
    var password = readAzureValueFromRaw(raw, "temporaryPassword");
    var redirectUrl = readAzureValueFromRaw(raw, "redirectUrl");

    if (email) {
        $("#azureOfficialEmail").text(email);
        $("#azureOfficialEmailCopy").val(email);
    }
    if (password) {
        $("#azureTemporaryPassword").text(password);
        $("#azureTemporaryPasswordCopy").val(password);
    }
    if (redirectUrl) {
        $("#azureOutlookLink").attr("href", redirectUrl);
    }
}
function showDashboardRelocationbButton() {
    $("#azureDashboardLinkWrap").show();
    $("#dashboardUrl").attr("href", getStudentDashboardUrl());
}

async function handleProceedToOutlook() {
	var responseData = await updateAzureCredentialsViewed();
	if (responseData && responseData.status == 1) {
		setTimeout(function () {
			window.open("https://outlook.office.com", "_blank");
		}, 1200);
		showDashboardRelocationbButton();
	} else {
		showMessageTheme2(0, (responseData && responseData.message) ? responseData.message : "Unable to proceed");
	}
	return false;
}

function updateAzureCredentialsViewed() {
	var payload = {
		userId: USER_ID
	};
	var ajaxReqDetails = {
		method: "POST",
		url: APP_BASE_URL + SCHOOL_UUID + "/dashboard/update-azure-credentials-viewed",
		body: payload,
		global: true,
		showMessage: false,
		onFaildResolved: true,
		onSuccessResolved: true
	};
	return callCommonAjax(ajaxReqDetails);
}

function getCurrentUserUniqueId() {
    var parts = window.location.pathname.split("/");
    var fallbackUniqueId = (typeof UNIQUEUUID !== "undefined") ? UNIQUEUUID : "";
    return parts[parts.length - 1] || fallbackUniqueId;
}

function getStudentDashboardUrl() {
    var dashboardPath = (typeof USER_ROLE !== "undefined" && USER_ROLE === "TEACHER") ? "/dashboard/teacher/" : "/dashboard/student/";
    return BASE_URL + CONTEXT_PATH + SCHOOL_UUID + dashboardPath + getCurrentUserUniqueId();
}
