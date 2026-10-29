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
    if (details.outlookSetupPending && !isOutlookSetupSkipped()) {
        $("#timezoneConfirm").remove();
        $("#outlookUserCreatedModal").remove();
        showOutlookUserCreatedModal(details);

    } else if (details.paymentOverDue) {
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


// "Skip for now": remembered in a cookie (the server also reads it so login/dashboard stop redirecting here).
// The dashboard then triggers the same modal itself on its own interval until the Outlook password is set.
function getOutlookSkippedCookieName() {
    return "OUTLOOK_SKIPPED_" + getCurrentUserUniqueId();
}

function isOutlookSetupSkipped() {
    return document.cookie.split("; ").indexOf(getOutlookSkippedCookieName() + "=Y") > -1;
}

function skipOutlookSetup() {
    stopOutlookActivationPolling();
    document.cookie = getOutlookSkippedCookieName() + "=Y; path=/; max-age=" + (365 * 24 * 60 * 60) + "; SameSite=Lax";
    window.location = getStudentDashboardUrl();
}

var OUTLOOK_ACTIVATION_POLL_MS = 30000;
var outlookActivationPollTimer = null;
var outlookActivationPollInFlight = false;

function stopOutlookActivationPolling() {
    if (outlookActivationPollTimer) {
        clearInterval(outlookActivationPollTimer);
        outlookActivationPollTimer = null;
    }
}

// Every 30s asks the backend whether the student has already set the Outlook password (e.g. activated it in
// another tab). Once passwordUpdated = Y the modal is no longer needed, so polling stops and the student goes on
// to the dashboard.
function startOutlookActivationPolling() {
    stopOutlookActivationPolling();
    outlookActivationPollTimer = setInterval(checkOutlookAccountActive, OUTLOOK_ACTIVATION_POLL_MS);
}

// Checks first (so a reload after the password was already set never flashes the modal), then shows it and keeps
// polling. If the check itself fails the modal is shown anyway.
async function showOutlookUserCreatedModal(details) {
    if (await checkOutlookAccountActive()) {
        return;
    }
    window.OUTLOOK_NEEDS_AZURE_CREATION = !!(details && details.needsAzureCreation);
    $("#outlookUserCreatedModal").remove();
    $("body").append(outlookUserCreatedModal($.extend({}, details, { skipAction: "skipOutlookSetup()", skipLabel: "Do it later" })));
    $("#outlookUserCreatedModal").modal({ backdrop: "static", keyboard: false, show: true });
    startOutlookActivationPolling();
}

// Called when the student clicks "Activate my email" in the outlook modal.
// If the Azure AD account has not been created yet (needsAzureCreation), creates it first,
// updates the displayed email/password, then opens Outlook.
async function handleActivateSchoolEmail() {
    var btn = document.getElementById("activateSchoolEmailBtn");
    if (btn) btn.disabled = true;

    if (window.OUTLOOK_NEEDS_AZURE_CREATION) {
        var payload = { payload: encode(JSON.stringify({ userId: USER_ID })) };
        var ajaxReqDetails = {
            method: "POST",
            url: APP_BASE_URL + SCHOOL_UUID + "/dashboard/create-azure-user",
            body: payload,
            global: true,
            showMessage: false,
            onFaildResolved: true,
            onSuccessResolved: true
        };
        var responseData = await callCommonAjax(ajaxReqDetails);
        if (!responseData || responseData.status != 1) {
            if (btn) btn.disabled = false;
            showMessageTheme2(0, (responseData && responseData.message) ? responseData.message : "Unable to create school email account. Please try again.");
            return;
        }
        window.OUTLOOK_NEEDS_AZURE_CREATION = false;
        var d = responseData.details || {};
        if (d.email) {
            $("#outlookOfficialEmail").text(d.email);
            $("#outlookOfficialEmailCopy").val(d.email);
        }
        if (d.password) {
            $("#outlookTemporaryPasswordCopy").val(d.password);
            var $passText = $("#outlookTemporaryPassword");
            if ($passText.data("visible") === true) {
                $passText.text(d.password);
            }
        }
        // Account just created — open Outlook directly, no need to mark credentials viewed
        setTimeout(function () { window.open("https://outlook.office.com", "_blank"); }, 1200);
        if (btn) btn.disabled = false;
        return;
    }

    await handleProceedToOutlook();
    if (btn) btn.disabled = false;
}

// Resolves true (and sends the student to the dashboard) when the backend says passwordUpdated = Y.
async function checkOutlookAccountActive() {
    if (outlookActivationPollInFlight) {
        return false;
    }
    outlookActivationPollInFlight = true;
    try {
        var responseData = await callCommonAjax({
            method: "POST",
            url: getURLFor("is-outlook-account-active", ""),
            body: { userId: USER_ID },
            global: true,
            showMessage: false
        });
        if (responseData && responseData.passwordUpdated == "Y") {
            stopOutlookActivationPolling();
            $("#outlookUserCreatedModal").modal("hide");
            window.location = getStudentDashboardUrl();
            return true;
        }
    } catch (e) {
        // transient failure: try again on the next tick
    } finally {
        outlookActivationPollInFlight = false;
    }
    return false;
}

async function handleOutlookAlreadyActivated() {
    $("#outlookAlreadyActivated").prop("disabled", true);
    var ajaxReqDetails = {
        method: "POST",
        url: APP_BASE_URL + SCHOOL_UUID + "/dashboard/stamp-password-created-date/" + getCurrentUserUniqueId(),
        body: { userId: USER_ID },
        global: true,
        showMessage: false,
        onFaildResolved: true,
        onSuccessResolved: true
    };
    var responseData = await callCommonAjax(ajaxReqDetails);
    var status = responseData && responseData.status != null ? String(responseData.status).toLowerCase() : "";
    if (status == "1" || status == "success") {
        stopOutlookActivationPolling();
        window.location = getStudentDashboardUrl();
    } else {
        $("#outlookAlreadyActivated").prop("disabled", false);
        showMessageTheme2(0, (responseData && responseData.message) ? responseData.message : "Unable to proceed");
    }
}
