var schoolSettingsLinks;
var schoolSettingsTechnical;
var B2B_LEAD_ID;
// var USER_TIMEZONE = "Asia/Kolkata";

function renderAdditionalLayerPage(){
    addtionalLayerContent();
}

function addtionalLayerContent(){
    var $containerWrapper = $('#additionalLayerContainer').closest('.sticky-header');
    if ($containerWrapper.length) {
        $containerWrapper.removeClass('sticky-header');
    }
    if (!$('#additionalLayerHeader').length) {
        $('body').prepend(addtionalLayerContentHeader());
    }
    if (!$('#additionalLayerFooter').length) {
        $('body').append(addtionalLayerContentFooter());
    }
}

$(document).on("click", ".close-message-additional", function () {
    $(this).closest(".fixed-message").hide();
});

function addtionalLayerContentHeader(){
   var schoolLinks = schoolSettingsLinks || window.schoolSettingsLinks || {};
   var scriptVersion = (typeof SCRIPT_VERSION !== "undefined") ? SCRIPT_VERSION : "";
   var schoolWebsite = schoolLinks.schoolWebsite ? schoolLinks.schoolWebsite : "javascript:void(0)";
   var logoUrl = schoolLinks.logoUrl ? schoolLinks.logoUrl : `${PATH_FOLDER_IMAGE2}is_fav_logo_200.png`;
   var html=`<div class="sticky-header bg-white" id="additionalLayerHeader">
        ${additionalLayerMarqueeContent()}
        <div class="app-header header-shadow">
            <div class="app-header__logo" style="order:0">
                <a href="${schoolWebsite}" target="blank" class="logo-src" style="background:url(${logoUrl}${logoUrl.indexOf('is_fav_logo_200.png') > -1 ? '' : scriptVersion});"></a>
            </div>
            <div class="app-header__content">
                <div class="app-header-right">
                    <div style="align-items: center;display: flex; margin-left: auto;padding-right:20px;">
                        <a href="${CONTEXT_PATH}${SCHOOL_UUID}/common/logout/${UNIQUEUUID}?from=dashboard"
                            class="btn-pill btn-shine btn btn-primary">
                            Log out
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
    return html;
}

function additionalLayerMarqueeContent() {
    var maintenanceMessage = (typeof MAINTENANCEDOWNTIME !== "undefined" && MAINTENANCEDOWNTIME) ? MAINTENANCEDOWNTIME : "";
    if (!maintenanceMessage) {
        return "";
    }
    return `<div class="fixed-message text-danger">
                <marquee id="marqueeDiv" direction="left" width="100%">
                    ${maintenanceMessage}
                </marquee>
                <span class="close-message bg-primary text-white close-message-additional">
                    <i class="fa fa-times"></i>
                </span>
            </div>`;
}

function addtionalLayerContentFooter() {
    var schoolTechnical = schoolSettingsTechnical || window.schoolSettingsTechnical || {};
    var copyrightYear = schoolTechnical.copyrightYear ? schoolTechnical.copyrightYear : "";
    var copyrightName = schoolTechnical.copyrightName ? schoolTechnical.copyrightName : "";
    var copyrightText = (copyrightYear && copyrightName)
        ? `Copyright © ${copyrightYear} - ${copyrightName} - All Rights Reserved.`
        : "Copyright All Rights Reserved.";

    var html= `<div class="app-wrapper-footer position-fixed w-100 bg-white" id="additionalLayerFooter" style="left: 0;bottom: 0;z-index:9;">
        <div class="app-footer">
            <div class="app-footer__inner">
                <p style="margin: 0">${copyrightText}</p>
            </div>
        </div>
    </div>`;
    return html;
}

function isAzureUserAvailable(details){
    var azure = details && details.azureDetails ? details.azureDetails : {};
    var email = azure.email || "";
    var password = azure.password || "";
    var html= `
        <div class="full pb-5 mt-5" id="create-lsmPassword">        
           <div class="main-card card mx-auto rounded-15 box-shadow-lg w-100" style="max-width: 1300px;">
            <div class="card-body p-4 p-xl-5">
                <div class="row">
                    <div class="col-xl-7 col-lg-7 col-md-12 col-12 mb-4 mb-xl-0 pr-xl-4">
                        <div class="text-center mb-5">
                            <span class="d-inline-flex align-items-center justify-content-center rounded-circle bg-light-primary" style="width:72px;height:72px;">
                                <img src="${PATH_FOLDER_IMAGE2}Create-azure.png" alt="Create Azure" class="rounded-circle" style="width:50px;height:50px;object-fit:contain;">
                            </span>
                            <h3 class="font-weight-bold text-dark mt-3 mb-0">Generate Your School Email Account</h3>
                        </div>

                        <div class="mb-5">
                            <p class="font-weight-semi-bold mb-2">Your School Email:</p>
                            <div class="d-flex align-items-center bg-light border rounded-10 p-2">
                                <p class="mb-0 text-break text-dark font-size-lg" id="azureOfficialEmail">${email}</p>
                                <input type="text" id="azureOfficialEmailCopy" value="${email}" class="d-none">
                                <div class="d-inline-flex align-items-center ml-auto">
                                    <span id="azureOfficialEmailCopied" class="font-11 text-success mr-2 d-none text-nowrap"></span>
                                    <button type="button" class="btn p-0 bg-transparent border-0 d-inline-flex align-items-center justify-content-center" onclick="copyAzureValue('azureOfficialEmailCopy','azureOfficialEmailCopied',this)">
                                        <img src="${PATH_FOLDER_IMAGE2}CopyIcn.png" alt="Copy" style="width:20px;height:20px;">
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="mb-5">
                            <p class="font-weight-semi-bold mb-2">Your School Email Temporary Password:</p>
                            <div class="d-flex align-items-center bg-light border rounded-10 p-2">
                                <p class="mb-0 text-break text-dark font-size-lg" id="azureTemporaryPassword">${password}</p>
                                <input type="text" id="azureTemporaryPasswordCopy" value="${password}" class="d-none">
                                <div class="d-inline-flex align-items-center ml-auto">
                                    <span id="azureTemporaryPasswordCopied" class="font-11 text-success mr-2 d-none text-nowrap"></span>
                                    <button type="button" class="btn p-0 bg-transparent border-0 d-inline-flex align-items-center justify-content-center" onclick="copyAzureValue('azureTemporaryPasswordCopy','azureTemporaryPasswordCopied',this)">
                                        <img src="${PATH_FOLDER_IMAGE2}CopyIcn.png" alt="Copy" style="width:20px;height:20px;">
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="d-flex flex-column flex-xl-row align-items-stretch mt-2">
                            <a id="azureOutlookLink" target="_blank" class="btn bg-primary-card-gradient text-white px-4 py-3 font-weight-semi-bold mb-3 mb-xl-0 mr-xl-3 d-inline-flex align-items-center justify-content-center" onclick="handleProceedToOutlook()">
                                <i class="fa fa-envelope-open mr-2"></i>Proceed
                            </a>
                            <div id="azureDashboardLinkWrap" class="mb-0" style="display:none;">
                                <a id="dashboardUrl" href="" class="btn btn-outline-primary px-4 py-3 font-weight-semi-bold d-inline-flex align-items-center justify-content-center">
                                    <i class="fa fa-th-large mr-2"></i>Click here to go to Dashboard
                                </a>
                            </div>
                        </div>
                    </div>

                    <div class="col-xl-5 col-lg-5 col-md-12 col-12">
                        <div class="border rounded-15 p-4 bg-light-warning h-100">
                            <p class="font-weight-bold mb-3 d-flex align-items-center text-dark-warning">
                                <span class="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary text-white mr-2" style="width:28px;height:28px;">
                                    <i class="fa fa-info" aria-hidden="true"></i>
                                </span>
                                Note:
                            </p>
                            <p class="mb-3 text-dark-warning">1. Please log in to your school email account by selecting “Proceed”</p>
                            <p class="mb-3 text-dark-warning">2. Copy your email address and password to access your school email account.</p>
                            <p class="mb-3 text-dark-warning">3. Once you have successfully logged in, navigate to your dashboard by selecting “Click here to go to dashboard.”</p>
                            <p class="mb-3 text-dark-warning">4. All future school communications will be sent exclusively to your school email account.</p>
                            <p class="mb-0 text-dark-warning">5. You can view your school email in the profile section any time.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
    return html;
}
function showAzureCenterPopup(message) {
    if (!$("#azureCenterPopupModal").length) {
        $("body").append(`
            <div class="modal fade" id="azureCenterPopupModal" tabindex="-1" role="dialog" aria-hidden="true">
               <div class="modal-dialog" role="document" style="margin: 35vh auto 0; padding: 0 20px;">
                    <div class="modal-content rounded-0 bg-white text-success text-center font-weight-semi-bold p-3 border border-success">
                        <p class="mb-0 font-18 msg success" id="azureCenterPopupMessage"></p>
                    </div>
                </div>
            </div>
        `);
    }

    $("#azureCenterPopupMessage").html('<i class="fa fa-check"></i>&nbsp;' + message);
    $("#azureCenterPopupModal").modal("show");

    setTimeout(function () {
        $("#azureCenterPopupModal").modal("hide");
    }, 1200);
}

function copyAzureValue(elementId, showElement, buttonRef) {
    var valueToCopy = $("#" + elementId).val() || "";
    var $button = $(buttonRef);
    var $message = $("#" + showElement);
    var copySuccess = function () {
        showAzureCenterPopup("Copied!");

        if ($message.length) {
            var existingTimeout = $message.data("copiedHideTimeout");
            if (existingTimeout) {
                clearTimeout(existingTimeout);
            }
            $message.text("Copied!").removeClass("d-none");
            var hideTimeout = setTimeout(function () {
                $message.addClass("d-none").text("");
            }, 1600);
            $message.data("copiedHideTimeout", hideTimeout);
        }

        $button.find("img").css("filter", "brightness(0) saturate(100%) invert(25%) sepia(96%) saturate(1845%) hue-rotate(196deg) brightness(99%) contrast(102%)");
        setTimeout(function () {
            $button.find("img").css("filter", "none");
        }, 1600);
    };

    var fallbackCopy = function (text) {
        var tempInput = document.createElement("textarea");
        tempInput.value = text;
        tempInput.setAttribute("readonly", "");
        tempInput.style.position = "fixed";
        tempInput.style.top = "-9999px";
        document.body.appendChild(tempInput);
        tempInput.focus();
        tempInput.select();
        tempInput.setSelectionRange(0, tempInput.value.length);
        var copied = false;
        try {
            copied = document.execCommand("copy");
        } catch (e) {
            copied = false;
        }
        document.body.removeChild(tempInput);
        return copied;
    };

    if (!valueToCopy) {
        showMessageTheme2(0, "Nothing to copy.");
        return;
    }

    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(valueToCopy).then(function () {
            copySuccess();
        }).catch(function () {
            if (fallbackCopy(valueToCopy)) {
                copySuccess();
            } else {
                showMessageTheme2(0, "Unable to copy. Please copy manually.");
            }
        });
    } else if (fallbackCopy(valueToCopy)) {
        copySuccess();
    } else {
        showMessageTheme2(0, "Unable to copy. Please copy manually.");
    }
}

function timezoneCard(timeZone){
    var timezoneId = timeZone && timeZone.currentTimezoneId ? timeZone.currentTimezoneId : "";
    var timezoneList = timeZone && timeZone.timezones ? timeZone.timezones : [];
    var options = "";
    timezoneList.forEach(function(tz){
        var selected = (String(tz.key) === String(timezoneId)) ? "selected" : "";
        var optionLabel = "(" + (tz.extra || tz.value || "") + ") - " + (tz.extra1 || "") + "/" + (tz.extra3 || "");
        options += `<option value="${tz.key}" ${selected}>
                        ${optionLabel}
                    </option>`; 
    });

    var html= `<div class="full mb-3 d-flex justify-content-center" id="timezoneCard" style="min-height: 70vh; align-items: center; padding-top: 80px;">
                    <div class="main-card mb-3 card mx-auto rounded-10" style="max-width: 650px; width: 100%;">
                        <div class="card-header rounded-10 bg-primary text-white py-2 h-auto justify-content-center text-center" style="border-bottom-left-radius: 0px !important;border-bottom-right-radius: 0px !important;text-transform: none;">
                            <h5 class="m-0 w-100 text-center">Confirm Your Time Zone</h5>
                        </div>
                        <div class="card-body">
                            <p class="text-primary text-center font-weight-semi-bold font-size-lg text-center">Before we start, please select your Country Name and Time Zone :</p>
                            <div class="col-xl-6 col-lg-6 col-md-8 col-sm-8 col-12 mx-auto mb-3">
                                <select name="countryTimezoneFromId" id="countryTimezoneFromId" class="form-control" onchange="changeTimezoneInWarning();">
                                    ${options}   
                                </select>
                            </div>
                        </div>
                        <div class="card-footer flex-wrap justify-content-sm-between justify-content-center flex-sm-row flex-column-reverse text-sm-right text-center academic-step" style="border-bottom-left-radius: 10px !important;border-bottom-right-radius: 10px !important;">
                            <a id="proceed" class="btn btn-success btn-lg font-size-md ml-auto" href="javascript:void(0);" onclick="$('#timezoneConfirm').modal('show')">Confirm</a>
                        </div>
                    </div>
                </div>`;

    return html;
}

function timezoneConfirmModal(timeZone){
    var selectedTimeZone = timeZone && timeZone.currentCountryTimeZone ? timeZone.currentCountryTimeZone : "";
    var selectedTimeZoneId = timeZone && timeZone.currentTimezoneId ? timeZone.currentTimezoneId : "";

    var html= `<div class="modal fade" id="timezoneConfirm" tabindex="-1" role="dialog" aria-labelledby="timezoneConfirmeModalLabel" aria-modal="true">
    <div class="modal-dialog modal-dialog-centered shadow-none" role="document" style="max-width: 750px;">
        <div class="modal-content border-primary"  style="border-top:10px solid">
            <div class="modal-body py-4">
                <h5 class="text-center text-primary font-weight-semi-bold">Do you wish to proceed with <b id="changeTimezone" class="font-weight-bold"> ${selectedTimeZone}</b>?</h5>
                <p class="text-primary m-0 text-center font-weight-semi-bold font-size-lg mb-3">Please note that all of your classes will follow this time zone.</p>
                <p class="text-primary m-0 text-center font-weight-semi-bold font-size-lg">To change your time zone later, go to the <b class="font-weight-bold">'My Profile'</b> section of your dashboard.</p></h5>
            </div>
            <div class="modal-footer justify-content-center" style="border-bottom-left-radius: 10px !important;border-bottom-right-radius: 10px !importan;">
                            <button type="button" class="btn btn-success font-size-md mx-1" onclick="proceedWithUserChangedTimezone(${selectedTimeZoneId},${USER_ID});">Yes</button>
                <button type="button" class="btn btn-outline-primary font-size-md mx-1" data-dismiss="modal">No</button>
            </div>
        </div>
    </div>
  </div>`;
    return html;
}

function paymentOverDueCard(details){
    var dueFees = details && details.studentDueFees && details.studentDueFees.userPaymentDetailsList
        ? details.studentDueFees.userPaymentDetailsList
        : [];
    var currencySymbol = schoolSettingsTechnical && schoolSettingsTechnical.currencySymbol
        ? schoolSettingsTechnical.currencySymbol
        : "";
    var cardsHtml = "";
    var firstDueDate = "";
    var pendingCardIndex = 0;
    var chatBaseUrl = (typeof CHAT_URL !== "undefined" && CHAT_URL) ? CHAT_URL : "https://is-chat-react.vercel.app";
    var chatSupportUrl = chatBaseUrl + "/onboarding-support?uuid=" + UNIQUEUUID;

    for (var i = 0; i < dueFees.length; i++) {
        var item = dueFees[i] || {};
        if (item.status === "SUCCESS" || !item.isOverDue) {
            continue;
        }
        if (!firstDueDate) {
            firstDueDate = item.scheduledPayDate || "-";
        }
        var isFirstPendingCard = pendingCardIndex === 0;
        var amount = item.totalFeeWithMaterialFee || 0;
        cardsHtml += `
            <div class="card mb-3 rounded mx-auto" style="max-width:420px; width:100%; border:1px solid #dfe3e8; box-shadow: 0 1px 2px rgba(16,24,40,.06);">
                <div class="card-header bg-white d-flex align-items-center font-weight-semi-bold py-2" style="border-bottom:1px solid #e9ecef;">
                    <i class="fa fa-file-text mr-2 text-dark"></i>Pending Fee
                </div>
                <div class="card-body py-3">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="text-muted font-weight-semi-bold">Grade</span>
                        <span class="font-weight-semi-bold">${item.standardName || "-"}</span>
                    </div>
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="text-muted font-weight-semi-bold">Fee Description</span>
                        <span class="font-weight-semi-bold text-right ml-3">${item.paymentName || "-"}</span>
                    </div>
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="text-muted font-weight-semi-bold">Due Fee</span>
                        <span class="font-weight-semi-bold">${currencySymbol} ${parseFloat(amount).toFixed(2)}</span>
                    </div>
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="text-danger font-weight-semi-bold">Due Date</span>
                        <span class="text-danger font-weight-semi-bold">${item.scheduledPayDate || "-"}</span>
                    </div>
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <span class="text-muted font-weight-semi-bold">Status</span>
                        <span class="badge" style="background:#fde68a; color:#946200; font-weight:600;">${item.status || "-"}</span>
                    </div>
                    <div class="d-flex justify-content-between align-items-center py-2" style="border-top:1px solid #e9ecef;">
                        <span class="text-muted font-weight-semi-bold">Total Fee Due</span>
                        <span class="font-weight-bold font-24">${currencySymbol} ${parseFloat(amount).toFixed(2)}</span>
                    </div>
                    <div class="text-center mt-2">
                        <button type="button" class="btn btn-primary" onclick="payNow('${item.id}', '${SCHOOL_ID}')" ${isFirstPendingCard ? "" : "disabled"}>
                            <i class="fa fa-credit-card mr-1"></i> Pay Now to Continue Classes
                        </button>
                    </div>
                </div>
            </div>`;
        pendingCardIndex++;
    }

    if (!cardsHtml) {
        cardsHtml = `<div class="card rounded-10" style="border:1px solid #dfe3e8;"><div class="card-body text-center">No overdue payments found.</div></div>`;
    }

    var supportCardStyles = "";
    if (!$("#additionalLayerSupportSideStyles").length) {
        supportCardStyles = `<style id="additionalLayerSupportSideStyles">
            .support-side-card{background:#fff;border:1px solid rgba(0,0,0,.08);border-radius:14px;padding:18px;box-shadow:0 .125rem .25rem rgba(0,0,0,.075);}
            .support-side-item{display:flex;align-items:center;gap:14px;border:1px solid rgba(0,0,0,.08);border-radius:12px;padding:16px;margin-top:14px;background:#fff;}
            .support-side-chat-primary{justify-content:center;width:100%;color:#fff !important;background:#28a745 !important;border-color:#28a745 !important;text-align:center;padding-top:12px;padding-bottom:12px;}
            .support-side-chat-primary:hover,.support-side-chat-primary:focus{color:#fff !important;text-decoration:none;}
            .support-side-icon{font-size:26px;color:var(--pc);width:26px;text-align:center;}
            .support-side-chat-primary .support-side-icon,.support-side-chat-primary .support-side-label{color:#fff !important;}
            .support-side-icon.fa-phone{transform:scaleX(-1);}
            .support-side-heading{line-height:1.2;color:#121826;font-size:18px;}
            .support-side-label{color:#121826;line-height:1.2;}
            .support-side-value{color:#4b5563;line-height:1.2;word-break:normal;overflow-wrap:normal;}
            .support-side-value.email-support-value{font-size:13px !important;white-space:nowrap;}
        </style>`;
    }

    var html= `
    ${supportCardStyles}
    <div id="schedule-payment-popup" class="d-flex justify-content-center flex-column align-items-center" style="padding-bottom:90px;">
        <div class="w-100" style="max-width: 900px;">
            <div class="text-center mb-4">
                
                <h4 class="font-weight-bold mb-2"><span class="mr-2">👋</span>Hi ${USER_FULL_NAME}!</h4>
            </div>
            <div class="mx-auto mb-3 d-flex align-items-center rounded-10 px-3 py-2" style="max-width:550px; border:1px solid #ff5a5f; background:#fff0f1;">
                <span class="d-inline-flex align-items-center justify-content-center rounded-circle mr-2 text-white" style="width:28px; height:28px; background:#ef4444;">
                    <i class="fa fa-exclamation-triangle"></i>
                </span>
                <p class="font-16 mb-0" style="color:#e53935;">
                    Your LMS is deactivated due to pending fee since ${firstDueDate || "-"}.
                </p>
            </div>
           
        </div>
        <div class="w-100 mt-3 p-10" style="max-width: 1100px;">
            <div class="row">
                <div class="col-xl-7 col-lg-7 col-md-12 col-12 mb-3 mb-xl-0">
                    ${cardsHtml}
                </div>
                <div class="col-xl-5 col-lg-5 col-md-12 col-12 d-flex flex-column">
                    <div class="card rounded-10" style="border:1px solid #dfe3e8; box-shadow: 0 1px 2px rgba(16,24,40,.06);">
                        <div class="card-body py-3">
                            <div class="support-side-card">
                                <div class="d-flex align-items-center mb-3">
                                    <i class="fa fa-headphones support-side-icon mr-3"></i>
                                    <h4 class="support-side-heading m-0 font-weight-semi-bold">Need Any Support ?</h4>
                                </div>
                                <a target="_blank" href="${chatSupportUrl}" class="support-side-item support-side-chat-primary scale-animate">
                                    <i class="fa fa-comments support-side-icon"></i>
                                    <div class="support-side-label m-0 font-weight-semi-bold">Live Chat with School Administration</div>
                                </a>
                                <div class="support-side-item">
                                    <i class="fa fa-phone support-side-icon"></i>
                                    <div>
                                        <div class="support-side-label font-weight-semi-bold">Phone Support</div>
                                        <div class="support-side-value font-size-md ">+15854990662</div>
                                    </div>
                                </div>
                                <div class="support-side-item">
                                    <i class="fa fa-envelope support-side-icon"></i>
                                    <div>
                                        <div class="support-side-label font-weight-semi-bold">Email Support</div>
                                        <div class="support-side-value font-size-md email-support-value"><a href="mailto:admin.support@internationalschooling.org" style="color:inherit;text-decoration:none;">admin.support@internationalschooling.org</a></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card mt-3 rounded-10" style="border:1px solid #f1d27a; background:#fff9eb;">
                        <div class="card-body">
                            <p class="font-weight-bold mb-2" style="color:#a86600;">
                                <i class="fa fa-exclamation-triangle mr-2"></i>Why is timely payment important?
                            </p>
                            <p class="mb-0" style="color:#a86600;">
                                 Please pay in advance to continue with your classes                            
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="text-center pt-2 pb-4">
                <span class="d-inline-flex align-items-center rounded-10 px-3 py-1" style="background:#e8f2ff; color:#1a73e8;">
                    <i class="fa fa-info-circle mr-2"></i>Kindly complete the payment to avoid deactivation of the School Management System.
                </span>
            </div>
        </div>
    </div>`;
    return html;
}
