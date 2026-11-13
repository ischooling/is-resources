var callFrom="";

function isAdminProfileContactVerified(entry) {
    return entry && (entry.verifiedStatus === "Y" || entry.verifiedStatus === "y");
}

function isAdminProfileEmailFormatInvalid(entry) {
    return entry && entry.formatStatus && entry.formatStatus !== "OK";
}

function adminProfileStatusChipHtml(variant, label) {
    var safe = String(label || "").replace(/[&<>"]/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
    return (
        '<span class="profile-status-chip profile-status-chip--' + variant + '">' +
        '<span class="profile-status-chip__dot" aria-hidden="true"></span>' +
        '<span class="profile-status-chip__label">' + safe + "</span></span>"
    );
}

function adminProfileEmailStatusChip(entry, otpVerified) {
    // Server tag from SendGrid results (+ OTP): Verified / Not verified / Unsubscribed.
    var emailStatus = entry && entry.emailStatus ? String(entry.emailStatus).toUpperCase() : "";
    if (emailStatus === "UNSUBSCRIBED") {
        return adminProfileStatusChipHtml("progress", "Unsubscribed");
    }
    if (emailStatus === "VERIFIED") {
        return adminProfileStatusChipHtml("success", "Verified");
    }
    if (emailStatus === "NOT_VERIFIED") {
        return adminProfileStatusChipHtml("neutral", "Not verified");
    }
    if (otpVerified) {
        return adminProfileStatusChipHtml("success", "Verified");
    }
    if (isAdminProfileEmailFormatInvalid(entry)) {
        return adminProfileStatusChipHtml("review", "Incorrect email");
    }
    var status = ((entry && entry.deliverabilityStatus) || "UNKNOWN").toUpperCase();
    if (status === "INVALID") {
        return adminProfileStatusChipHtml("danger", "Invalid");
    }
    if (status === "RISKY") {
        return adminProfileStatusChipHtml("progress", "Risky");
    }
    if (status === "VALID") {
        return adminProfileStatusChipHtml("success", "Deliverable");
    }
    return adminProfileStatusChipHtml("neutral", "Not verified");
}

function adminProfileEmailStatusBadgesHtml(fieldId, fieldValue, verificationMap) {
    if (fieldValue === "" || fieldValue === undefined || fieldValue === null) {
        return "";
    }
    var entry = verificationMap && verificationMap[fieldId] ? verificationMap[fieldId] : {};
    var otpVerified = isAdminProfileContactVerified(entry);
    var chip = adminProfileEmailStatusChip(entry, otpVerified);
    return '<div class="profile-contact-status-labels profile-contact-status-chips d-flex flex-wrap mt-1 mb-0">' + chip + "</div>";
}

function refreshAdminProfileEmailStatusBadges(verificationMap) {
    var $email = $("#emailId").first();
    if ($email.length < 1) {
        return;
    }
    var $formGroup = $email.closest(".form-group");
    $formGroup.find(".profile-contact-status-labels").remove();
    var badgeHtml = adminProfileEmailStatusBadgesHtml("emailId", $email.val(), verificationMap || {});
    if (badgeHtml !== "") {
        $formGroup.find(".admin-profile-email-status-wrap").html(badgeHtml);
    }
}

function initAdminProfileQuietHours(targetUserId) {
    if (!targetUserId) {
        return;
    }
    if (typeof initProfileQuietHoursSection === "function") {
        initProfileQuietHoursSection(targetUserId, { summarySelector: "#adminQuietHoursSummary", buttonId: "quietHoursBtn" });
    } else if (typeof openQuietHoursModalSafe === "function") {
        $.getScript(PATH_FOLDER_JS2 + RESOURCES_FROM_MIN_LOCATION + "custom/quietHours.js" + SCRIPT_VERSION, function () {
            if (typeof initProfileQuietHoursSection === "function") {
                initProfileQuietHoursSection(targetUserId, { summarySelector: "#adminQuietHoursSummary", buttonId: "quietHoursBtn" });
            }
        });
    }
}

function adminQuietHoursSectionHtml(data) {
  return `<div class="card profile-section mt-3 d-none" id="quiet_hours_information">
        <div class="card-body">
            <div class="form-row">
                <div class="col-12 mb-2">
                    <h5 class="text-dark font-weight-semi-bold d-flex align-items-center mb-0">
                        <span class="bg-light-primary border border-primary text-primary d-inline-flex justify-content-center align-items-center mr-2 rounded" style="width:20px;height:20px">
                            <i class="fa fa-clock-o font-12"></i>
                        </span>
                        <span class="flex-grow-1">2. Quiet Hours</span>
                    </h5>
                </div>
                <div class="col-12 mb-3">
                    <p class="text-muted small mb-2">Set when this user should not receive non-urgent notifications.</p>
                    <div id="adminQuietHoursSummary" class="small"></div>
                </div>
                <div class="col-xl-4 col-lg-6 col-md-6 col-sm-12 d-flex align-items-center mb-2">
                    <button type="button" id="quietHoursBtn" class="btn btn-sm btn-pill btn-outline-primary"
                        onclick="openQuietHoursModalSafe('${data.userId}', 'quietHoursBtn')">Add Quiet Hours</button>
                </div>
            </div>
        </div>
    </div>`;
}

async function renderProfilePage(arg0){
    var arg1=arg0.split("&");
    var userId=arg1[0];
    if(arg1[1]=="callFrom="){
       callFrom=''; 
    }else{
        callFrom=arg1[1];
    }

	//console.log(arg1);
    $("#cropModal").remove();
    if($("#adminImgCropModal").length>0){
        $("#adminImgCropModal").remove();
    }
    $("body").append(cropperImageModalContent())
    var payload = {
        userId: userId,
        userIdSession: USER_ID
    };
    var responseData = await getDashboardDataBasedUrlAndPayload(true, false, 'get-common-profile-details', payload);
    var html = getAdminProfilePageHeader(callFrom) + getProfilePageContent(responseData.details, callFrom, arg0);
    $("#dashboardContentInHTML").hide();
    $("#dashboardContentInHTMLAdditional").html(html).show();
    if (responseData.details && responseData.details.showAppInstallPromptAdminToggle) {
        mountAppInstallPromptAdminToggle($("#parentAppInstallPromptMount"), userId,
            responseData.details.appInstallPromptEnabled, true, responseData.details.countryTimezone);
    }
    if(USER_ROLE == "B2B_PARTNER"){
        var payloadBank = {
        userId: USER_ID,
        };
        var responseDataBank = await getDashboardDataBasedUrlAndPayload(true, false, 'get-partner-bank-details', payloadBank);
        $("#bankDetailsWrapper").html(getProfileBankDetailsContent(responseDataBank.bankDetails));
        cancelBankDetailsUpdation();
    }
    $("#addedDate").datepicker({
        autoclose: true,
        format: "M dd, yyyy",
        startDate: new Date(),
        endDate: new Date()
    });
    getAllCountryList('profilePageFromTag','country')
    await getAllCountryTimezone('profilePageFromTag','','countryTimezoneId');
    $('#country').select2({
        theme:"bootstrap4",
        width:"100%",
    }).on("change", function(){
        var selectedCountryID= $(this).val()
        callStates('profilePageFromTag',selectedCountryID, 'country', 'state', 'city')
        if ($("#state").hasClass("select2-hidden-accessible")) {
            $("#state").select2("destroy");
        }
        $("#state").select2({
            theme:"bootstrap4",
            width:"100%",
        });
        $("#state").attr("disabled",false);
    });
    $("#state").select2({
        theme:"bootstrap4",
        width:"100%",
    }).on("change", function(){
        var selectedStateID= $(this).val()
        callCities('profilePageFromTag',selectedStateID, 'state', 'city')
        if ($("#city").hasClass("select2-hidden-accessible")) {
            $("#city").select2("destroy");
        }
        $("#city").select2({
            theme:"bootstrap4",
            width:"100%",
        });
        $("#city").attr("disabled",false);
    });
    $("#city").select2({
        theme:"bootstrap4",
        width:"100%",
    });
    $('#countryTimezoneId').select2({
        theme:"bootstrap4",
        width:"100%",
    });
    $("#languages").select2({
        theme:"bootstrap4",
        width:"100%",
    });
    $("#country").val(responseData.details.countryId).trigger("change");
    $("#state").val(responseData.details.stateId).trigger("change");
    $("#city").val(responseData.details.cityId).trigger("change");
    $("#countryTimezoneId").val(responseData.details.countryTimezone).trigger("change");
    if(responseData.details.languagesKnown!=''){
        var lang = responseData.details.languagesKnown.split(',');
        $("#languages").val(lang).trigger("change");
        // $.each(lang, function(i,e){
        //     $("#languages option[value='" + e + "']").prop("selected", true);
        // });
    }
    //return html;
    corpAdminProfile();
    if(callFrom=='' || callFrom=='callFrom=admin'){
        editProfilePage();
    }
    if (typeof refreshCustomFieldState === "function") {
        refreshCustomFieldState($("#profilePageFromTag"));
        setTimeout(function () {
            refreshCustomFieldState($("#profilePageFromTag"));
        }, 300);
    }
    $("#profilePageFromTag input, #profilePageFromTag select, #profilePageFromTag textarea").on("input change blur select2:select select2:clear", function () {
        if (typeof refreshCustomFieldState === "function") {
            refreshCustomFieldState($("#profilePageFromTag"));
        }
    });
    adminProfileSectionSwitching();
    adminProfileAdjustLayout();
    initAdminProfileQuietHours(responseData.details && responseData.details.userId);
    if (responseData.details && responseData.details.profileContactVerification) {
        refreshAdminProfileEmailStatusBadges(responseData.details.profileContactVerification);
    }
}

function getProfilePageContent(data, callFrom, arg0){
    var verificationMap = data.profileContactVerification || {};
    var emailChips = adminProfileEmailStatusBadgesHtml("emailId", data.emailId, verificationMap);
    var html=
        `<style>
            .admin-profile-wrapper .admin-profile-email-status-wrap .profile-contact-status-labels{display:flex !important;}
            #profilePageView .profile-picture-wrapper .profile-name{color:#fff;}
            #profilePageView .profile-selection-list-anchor.bg-light{background:#e8f2fc !important;}
        </style>
        <div class="main-card mb-3 p-0" id="profilePageView">
            <div class="card border-0 shadow-sm" id="withdrawalProfileCard">
                <div class="card-body p-3 p-lg-4">
                    <form class="admin-profile-wrapper custom-field-scope row mx-0" id="profilePageFromTag">
                        <div class="col-xl-3 col-lg-4 col-md-12 col-12 mb-3 mb-xl-0">`;
                        if(callFrom=='callFrom=admin'){
                            html+= `<div class="d-lg-none text-right mb-2"><a href="javascript:void(0)" onClick="backToMain(\'manageProfileParentContent\');" class="btn btn-sm btn-dark"><i class="fa fa-arrow-left"></i>&nbsp;Back</a></div>`;
                        }else if(typeof USER_ROLE !== "undefined" && USER_ROLE == "PARENT"){
                            html+= `<div class="d-lg-none text-right mb-2"><a href="javascript:void(0)" onClick="showAndHideDashboardAndAdditionalContent('main');" class="btn btn-sm btn-dark"><i class="fa fa-arrow-left"></i>&nbsp;Back</a></div>`;
                        }
                   html+= `<div class="profile-picture-wrapper bg-primary rounded p-3">
                            <div class="profile-picture text-center text-xl-left">
                                <div class="user-img admin-proifle d-inline-block mx-auto">
                                    <img id="profileImageStudent" name="profileImageStudent" class="user profile-pic" src="${data.profileImage}" alt="image" title="Profile Image" thumbtype="">
                                    <div class="edit-user-img trans5s">
                                        <input class="file-input" type="file" name="fileupload1" id="fileupload1" onchange="cropImage(event, 'fileupload1', 'profileImageStudent', 'Profile Image', '15808')">
                                        <span class="upload-img-btn"><i class="fa fa-upload"></i> Upload</span>
                                    </div>
                                </div>
                                <div class="mt-2 text-center text-xl-left">
                                    <div class="profile-name font-weight-semi-bold font-size-lg userNameLabel">${data.userFullName}</div>
                                    <p class="text-white font-size-12 mb-0 img-notification opacity-90">Profile Image (Max 5MB)</p>
                                </div>
                            </div>
                            ${adminProfileSectionTabs()}
                        </div>
                        </div>
                        <div class="col-xl-9 col-lg-8 col-md-12 col-12 overflow-y-auto overflow-x-hidden profile-right-section position-relative pl-xl-3" style="will-change:scroll-position">
                            <div class="profile-details-wrapper float-left w-100">
                                <input type="hidden" id="pCountryCode" value="${data.countryCode}"/>
                                <input type="hidden" id="isdCode" value="${data.dialCode}"/>
                                <input type="hidden" id="userId" value="${data.userId}"/>
                                <div class="card profile-section" id="personal_information">
                                    <div class="card-body">
                                        <div class="form-row">
                                            <div class="col-12 d-flex align-items-center justify-content-between mb-2">
                                                <h5 class="text-dark font-weight-semi-bold d-flex align-items-center mb-0">
                                                    <span class="bg-light-primary border border-primary text-primary d-inline-flex justify-content-center align-items-center mr-1 rounded" style="width:20px;height:20px">
                                                        <i class="fa fa-user font-12"></i>
                                                    </span>
                                                    <span class="flex-grow-1">1. Personal Information</span>
                                                </h5>
                                            </div>
                            <div class="form-row">
                                <div class="col-md-4 col-sm-6 col-12 custom-field mb-3">
                                    <div class="form-group">
                                        <div class="profile-label field-value font-weight-semi-bold text-dark userNameLabel">${data.userFullName}</div> 
                                        <div class="field-input w-100 position-relative custom-field">
                                            <input type="text" id="userName" name="userName" class="form-control field-input" value="${data.userFullName}" placeholder=" "/>
                                            <label class="m-0">User Name</label>
                                        </div>
                                    </div>  
                                </div>
                                <div class="col-md-4 col-sm-6 col-12 custom-field mb-3">
                                    <div class="form-group">
                                        <div class="profile-label field-value font-weight-semi-bold text-dark genderLabel">${data.gender}</div> 
                                        <div class="field-input w-100 position-relative custom-field">
                                            <select id="gender" name="gender" class="form-control field-input">
                                                <option value="MALE" ${data.gender == "MALE"? 'selected':''}>Male</option>
                                                <option value="FEMALE" ${data.gender == "FEMALE"? 'selected':''}>Female</option>
                                                <option value="TRANSGENDER" ${data.gender == "TRANSGENDER"? 'selected':''}>Transgender</option>
                                                <option value="DONOTWANTTOSPECIFY" ${data.gender == "DONOTWANTTOSPECIFY"? 'selected':''}>DO NOT WANT TO SPECIFY</option>   
                                            </select>
                                            <label class="m-0">Gender</label>
                                        </div>
                                    </div>  
                                </div>
                                <div class="col-md-4 col-sm-6 col-12 custom-field mb-3">
                                    <div class="form-group">
                                        <div class="profile-label field-value font-weight-semi-bold text-dark phoneNumberLabel">${data.contactNumber !=''? data.contactNumber:'N/A' }</div> 
                                        <div class="w-100 position-relative custom-field field-input">
                                            <input type="text" id="phoneNumber" name="phoneNumber" class="form-control field-input" value="${data.contactNumber}" placeholder=" "/>
                                            <label style="left: 106px;">Phone Number</label>
                                        </div>  
                                    </div>  
                                </div>
                                
                                <div class="col-md-4 col-sm-6 col-12 custom-field mb-3">
                                    <div class="form-group">
                                        <div class="profile-label field-value font-weight-semi-bold text-dark emailIdLabel">${data.emailId}</div> 
                                        <div class="field-input w-100 position-relative custom-field">
                                            <input type="text" id="emailId" name="emailId" class="form-control field-input" value="${data.emailId}" disabled placeholder=" "/>
                                            <label class="m-0">Email</label>
                                        </div>
                                        <div class="admin-profile-email-status-wrap mt-1">`+ emailChips +`</div>
                                    </div>  
                                </div>
                                <div class="col-md-4 col-sm-6 col-12 custom-field mb-3">
                                    <div class="form-group">
                                        <div class="profile-label field-value font-weight-semi-bold text-dark useremailIdLabel">${data.userName}</div> 
                                        <div class="field-input w-100 position-relative custom-field">
                                            <input type="text" id="userEmailId" name="userEmailId" class="form-control field-input" value="${data.userName}" disabled placeholder=" "/>
                                            <label class="m-0">User name</label>
                                        </div>  
                                    </div>  
                                </div>
                                <div class="col-md-4 col-sm-6 col-12 custom-field mb-3">
                                    <div class="form-group">
                                        <div class="profile-label field-value font-weight-semi-bold text-dark addedDateLabel">Added Date</div> 
                                        <div class="field-input w-100 position-relative custom-field">
                                            <input type="text" id="addedDate" name="addedDate" class="form-control field-input" value="${data.addedDate}" readonly onkeydown="return false" placeholder=" "/>
                                            <label class="m-0">Added Date</label>
                                        </div>  
                                    </div>  
                                </div>
                                <div class="col-md-4 col-sm-6 col-12 custom-field mb-3">
                                    <div class="form-group">
                                        <div class="profile-label field-value font-weight-semi-bold text-dark countryLabel">${data.country !=""?data.country:"N/A"}</div> 
                                        <div class="field-input w-100 position-relative custom-field">
                                            <select id="country" name="country" class="form-control field-input"></select>
                                            <label class="m-0">Country</label>
                                        </div>  
                                    </div>  
                                </div>
                                <div class="col-md-4 col-sm-6 col-12 custom-field mb-3">
                                    <div class="form-group">
                                        <div class="profile-label field-value font-weight-semi-bold text-dark stateLabel">${data.state !=""?data.state:"N/A"}</div> 
                                        <div class="field-input w-100 position-relative custom-field">
                                            <select id="state" name="state" class="form-control field-input" disabled></select>
                                            <label class="m-0">State</label>
                                        </div> 
                                    </div>  
                                </div>
                                <div class="col-md-4 col-sm-6 col-12 custom-field mb-3">
                                    <div class="form-group">
                                        <div class="profile-label field-value font-weight-semi-bold text-dark cityLabel">${data.city !=""?data.city:"N/A"}</div> 
                                        <div class="field-input w-100 position-relative custom-field">
                                            <select id="city" name="city" class="form-control field-input" disabled></select>
                                            <label class="m-0">City</label>
                                        </div> 
                                    </div>  
                                </div>
                                <div class="col-md-4 col-sm-6 col-12 custom-field mb-3">
                                    <div class="form-group">
                                        <div class="profile-label field-value font-weight-semi-bold text-dark countryTimezoneIdLabel">${formatProfileTimezoneLabel(data.countryTimezone)}</div>
                                        <div class="field-input w-100 position-relative custom-field">
                                            <select id="countryTimezoneId" name="countryTimezoneId" class="form-control field-input"></select>
                                            <label class="m-0">Timezone</label>
                                        </div> 
                                    </div>  
                                </div>
                                ${data.showAppInstallPromptAdminToggle ? `
                                <div class="col-12 mb-2">
                                    <div id="parentAppInstallPromptMount"></div>
                                </div>` : ``}
                                <div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12 mb-3">
                                    <div class="form-group">
                                        <div class="profile-label field-value font-weight-semi-bold text-dark langKnownLabel">`+getLanguagesValueByCode(data.languagesKnown)+`</div>
                                        <div class="field-input w-100 position-relative custom-field">
                                             <select id="languages" name="languages" class="form-control field-input" multiple>`+getLanguages(false)+`</select>
                                             <label class="m-0">Languages</label>
                                        </div> 
                                    </div>  
                                </div>
                            </div>
                            <div class="row mt-2">
                                <div class="col-12 text-right save-proifle-btn-row" style="display:none">
                                    <a href="javascript:void(0)" class="btn btn-pill btn-outline-primary cancelEditProfileBtn" style="display:none" onclick="cancelEditProfilePage()">Cancel</a>
                                    <a href="javascript:void(0)" class="btn btn-outline-success btn-pill" onclick="saveProfileDetails('profilePageFromTag', \'${arg0}\')">Save</a>    
                                </div>    
                            </div>
                                        </div>
                                    </div>
                                </div>
                                `+ adminQuietHoursSectionHtml(data) +`
                            </div>
                        </div>
                    </form>
                </div>
            </div>`;
                if(USER_ROLE == "B2B_PARTNER"){
                    html+=`<div id="bankDetailsWrapper" class="px-3 pb-3"></div>`;
                }
            if(typeof USER_ROLE !== "undefined" && USER_ROLE == "PARENT"){
                html+=`<div class="card mt-0 border-0 shadow-sm d-none" id="withdrawalRequestSection"><div class="card-body wd-scope" id="withdrawalRequestBody"></div></div>`;
            }
            html+=`</div>`;
    return html;
}

function getAdminProfilePageHeader(callFrom) {
    var html =
        `<div class="app-page-title mb-3 py-2">
            <div class="page-title-wrapper">
                <div class="page-title-heading">
                    <div class="page-title-icon">
                        <i class="fa fa-user text-primary"></i>
                    </div>
                    <div>Profile</div>
                </div>`;
                if(callFrom=='callFrom=admin'){
                    html += `<div class="page-title-actions">
                        <a href="javascript:void(0);" onclick="backToMain(\'manageProfileParentContent\');" class="btn btn-dark rounded"><i class="fa fa-arrow-left mr-1" aria-hidden="true"></i>Back</a>
                    </div>`;
                }
            html += `</div>
        </div>`;
    return html;
}

function adminProfileSectionTabs(){
    var html =
        `<div class="full mt-3">
            <ul class="m-0 p-0">
                <li class="bg-white border border-top-left-rounded overflow-hidden">
                    <a href="#personal_information" class="d-flex align-items-center py-1 px-3 text-decoration-none bg-light profile-selection-list-anchor">
                        <div class="text-dark font-weight-bold flex-grow-1">1. Personal Information</div>
                    </a>
                </li>
                <li class="bg-white border border-top-left-rounded rounded-bottom-left-10 rounded-bottom-right-10 overflow-hidden">
                    <a href="#quiet_hours_information" class="d-flex align-items-center py-1 px-3 text-decoration-none bg-light-hover profile-selection-list-anchor">
                        <div class="text-dark font-weight-bold flex-grow-1">2. Quiet Hours</div>
                    </a>
                </li>
            </ul>
        </div>`;
    return html;
}
/* ==========================================================================
   Withdrawal Request — parent entry (profile link -> child cards -> form)
   ========================================================================== */

function adminProfileSectionSwitching(){
    var profileWrapper = $("#profilePageView");
    if (profileWrapper.length < 1) {
        profileWrapper = $("#profilePageFromTag").closest(".main-card");
    }
    profileWrapper.find(".profile-selection-list-anchor").off("click.adminProfile").on("click.adminProfile", function(e){
        e.preventDefault();
        var target = $(this).attr("href");
        profileWrapper.find(".profile-selection-list-anchor").removeClass("bg-light");
        $(this).addClass("bg-light");
        profileWrapper.find(".profile-section").addClass("d-none");
        profileWrapper.find(target).removeClass("d-none");
    });
    profileWrapper.find(".profile-section").addClass("d-none");
    profileWrapper.find("#personal_information").removeClass("d-none");
    profileWrapper.find('.profile-selection-list-anchor[href="#personal_information"]').addClass("bg-light");
}

function adminProfileAdjustLayout(){
    var profileWrapper = $("#profilePageView");
    if (profileWrapper.length < 1) {
        profileWrapper = $("#profilePageFromTag").closest(".main-card");
    }
    var rightSection = profileWrapper.find(".profile-right-section");
    if(rightSection.length < 1){
        return;
    }
    function setAdminProfileRightSectionHeight(){
        if($(window).outerWidth() > 991){
            var footerHeight = $(".app-footer").outerHeight() || 0;
            var rightSectionTop = rightSection.offset().top - $(window).scrollTop();
            var availableHeight = Math.max(320, $(window).height() - rightSectionTop - footerHeight - 16);
            rightSection.css({"height": availableHeight + "px"}).removeClass("mb-4");
        }else{
            rightSection.css({"height": "inherit"}).addClass("mb-4");
        }
    }
    if($(window).outerWidth() > 991){
        $("html, body").animate({ scrollTop: 0 }, 600, setAdminProfileRightSectionHeight);
    }
    setAdminProfileRightSectionHeight();
    $(window).off("resize.adminProfileLayout").on("resize.adminProfileLayout", function(){
        setAdminProfileRightSectionHeight();
    });
}

function cropperImageModalContent(){
    var html=
        `<div class="modal fade" id="adminImgCropModal" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true" data-backdrop="static">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="modalLabel">Crop the image</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="img-container">
                            <img id="cropModalImg" src="https://avatars0.githubusercontent.com/u/3456749" class="w-100">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary " data-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" id="cropProfileImg">Crop</button>
                        <button type="button" class="btn btn-primary" onclick="rotateImage()">Rotate</button>
                    </div>
                </div>
            </div>
        </div>`;
    return html;
}

function serverMessageContent(){
    var html=
        '<div class="server-message">'
            +'<span class="msg" id="msgTheme2"></span>'
        +'</div>';
    return html;	
}

function getProfileBankDetailsContent(data){
    var html=
        `<hr>
        <div class="px-4 mb-4">
            <div class="d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center">
                    <i class="fa fa-university font-24 bg-light-primary text-primary rounded p-1 mr-2" aria-hidden="true"></i>
                    <h5 class="font-weight-bold text-dark">Bank Details</h5>
                </div>
                <a href="javascript:void(0)" class="btn btn-pill btn-outline-primary float-right editBankDetailsBtn" onclick="editBankDetailsProfile();">
                    <i class="fa fa-edit"></i>&nbsp; Edit
                </a>
            </div>
                <div class="row mt-4 custom-field-scope">
                <div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12 mb-3">
                    <div class="form-group">
                        <div id="bicNameLabel" class="font-weight-semi-bold text-dark bank-details-field">${data == "N/A" ? "" : data.iban}</div> 
                        <div class="w-100 bank-details-input-field position-relative custom-field">
                            <input type="text" id="bicNameB2b" name="bicNameB2b" class="form-control" value="${data == "N/A" ? "" : data.iban}" placeholder=" "/>
                            <label class="m-0">BIC Name</label>
                        </div>
                    </div>  
                </div>
                <div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12 mb-3">
                    <div class="form-group">
                        <div id="bankAddressLabel" class="font-weight-semi-bold text-dark bank-details-field">${data == "N/A" ? "" : data.bankBranchAddress}</div> 
                        <div class="w-100 bank-details-input-field position-relative custom-field">
                            <input type="text" id="bankAddressB2b" name="bankAddressB2b" class="form-control" value="${data == "N/A" ? "" : data.bankBranchAddress}" placeholder=" "/>
                            <label class="m-0">Bank Address</label>
                        </div>
                    </div>  
                </div>
                <div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12 mb-3">
                    <div class="form-group">
                        <div id="swiftCodeLabel" class="font-weight-semi-bold text-dark bank-details-field">${data == "N/A" ? "" : data.swiftCode}</div> 
                        <div class="w-100 bank-details-input-field position-relative custom-field">
                            <input type="text" id="swiftCodeB2b" name="swiftCodeB2b" class="form-control" value="${data == "N/A" ? "" : data.swiftCode}" placeholder=" "/>
                            <label class="m-0">Swift Code</label>
                        </div>
                    </div>  
                </div>
                <div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12 mb-3">
                    <div class="form-group">
                        <div id="bankCodeLabel" class="font-weight-semi-bold text-dark bank-details-field">${data == "N/A" ? "" : data.bankIfsc}</div> 
                        <div class="w-100 bank-details-input-field position-relative custom-field">
                            <input type="text" id="bankCodeB2b" name="bankCodeB2b" class="form-control" value="${data == "N/A" ? "" : data.bankIfsc}" placeholder=" "/>
                            <label class="m-0">Bank Code</label>
                        </div>
                    </div>  
                </div>
                <div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12 mb-3">
                    <div class="form-group">
                        <div id="branchCodeLabel" class="font-weight-semi-bold text-dark bank-details-field">${data == "N/A" ? "" : data.routeNo}</div> 
                        <div class="w-100 bank-details-input-field position-relative custom-field">
                            <input type="text" id="branchCodeB2b" name="branchCodeB2b" class="form-control" value="${data == "N/A" ? "" : data.routeNo}" placeholder=" "/>
                            <label class="m-0">Branch Code</label>
                        </div>
                    </div>  
                </div>
                <div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12 mb-3">
                    <div class="form-group">
                        <div id="accountNameLabel" class="font-weight-semi-bold text-dark bank-details-field">${data == "N/A" ? "" : data.accountHolderFirstName}</div> 
                        <div class="w-100 bank-details-input-field position-relative custom-field">
                            <input type="text" id="accountNameB2b" name="accountNameB2b" class="form-control" value="${data == "N/A" ? "" : data.accountHolderFirstName}" placeholder=" "/>
                            <label class="m-0">Account Holder Name</label>
                        </div>
                    </div>  
                </div>
                <div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12 mb-3">
                    <div class="form-group">
                        <div id="accountNumberLabel" class="font-weight-semi-bold text-dark bank-details-field">${data == "N/A" ? "" : data.accountNo}</div> 
                        <div class="w-100 bank-details-input-field position-relative custom-field">
                            <input type="text" id="accountNumberB2b" name="accountNumberB2b" class="form-control" value="${data == "N/A" ? "" : data.accountNo}" onkeydown="return M.digit(event);" placeholder=" "/>
                            <label class="m-0">Account Number</label>
                        </div>
                    </div>  
                </div>
            </div>
            <div id="bankDetailsAction" class="d-flex justify-content-end align-items-center gap-5">
                <button class="btn btn-sm btn-danger" onclick="cancelBankDetailsUpdation();">Cancel</button>
                <button class="btn btn-sm btn-primary" onclick="saveB2bBankDetails('fromProfile');">Update</button>
            </div>
        </div>`
    return html;
}

/** Display IANA zone (e.g. Asia/Dubai) without posix/right prefixes from legacy DB values. */
function formatProfileTimezoneLabel(raw) {
    if (raw == null || raw === '') {
        return 'N/A';
    }
    var text = String(raw).trim();
    if (!text) {
        return 'N/A';
    }
    var slash = text.lastIndexOf('/');
    if (slash >= 0 && (text.indexOf('posix/') === 0 || text.indexOf('right/') === 0)) {
        return text.substring(slash + 1);
    }
    return text;
}
