// content function start from here
var schoolSettingsLinks;
var schoolSettingsTechnical;
async function renderJobApplicationTrackingContent(entityId,email){
    schoolSettingsLinks = await getSchoolSettingsLinks(SCHOOL_ID);
    schoolSettingsTechnical = await getSchoolSettingsTechnical(SCHOOL_ID);
    $("body").html(getJobTrackingPageContent());
    $("#OTPProcessWrapper").html(
        getJobTrackingOTPProcess(entityId,email)
    );
}
function getJobTrackingPageContent(){
    var html=
    `<div class="app-container app-theme-white body-tabs-shadow fixed-header fixed-sidebar" style="min-height:100vh;display:flex;flex-direction:column;">
        ${getJobTrackingHeaderContent()}
        ${getJobTrackingMainCardContent()}
        ${getJobTrackingFooterContent()}
    </div>`;
    return html;
}
function getJobTrackingHeaderContent(){
    var html=
    `<div class="sticky-header" style="position: sticky;">
        <div class="app-header header-shadow">
            <div class="app-header__logo">
                <a href="${schoolSettingsLinks.schoolWebsite}" target="blank" class="logo-src" style="background:url(${schoolSettingsLinks.logoUrl}${SCRIPT_VERSION});"></a>
            </div>
        </div>
    </div>`;
    return html;
}

function getJobTrackingFooterContent() {
    return `
    <footer style="margin-top:auto; width:100%; text-align:center; background:#fff; padding:10px 0;">
        <p style="margin:0">${getCopyright()}</p>
    </footer>`;
}

function getJobTrackingOTPProcess(entityId,email){
    var html=
    `<div class="d-flex align-items-center px-4 px-md-5" style="position:static;background:url(${PATH_FOLDER_IMAGE2}otp_process_bg.png${SCRIPT_VERSION});background-size:cover;background-repeat:no-repeat;padding-bottom:60px">
        <div class="card mx-auto w-100 px-4 px-md-5 border-primary" style="max-width:500px;border-top:7px solid">
            <div class="text-center pb-4">
                <span class="bg-primary text-center d-inline-flex align-items-center justify-content-center text-white" style="width:75px;height:75px;">
                    <i class="fa fa-shield fa-2x"></i>
                </span>
            </div>
            <div id="job-verify-identity" class="full">
                <h5 class="font-weight-bold text-dark text-center">Verify Your Identity</h5>
                <p class="text-dark text-center">Please send the OTP to the registered email address.</p>
                <div class="bg-light-primary p-2 px-3 d-flex align-items-center mt-4 mb-2">
                    <span class="d-inline-block text-center mr-2" style="width:25px;height:25px;background:#bbdaf9">
                        <i class="fa fa-envelope text-primary position-relative" style="top:2px"></i>
                    </span>
                    <div>
                        <p class="mb-0 font-weight-bold">OTP will be sent to:</p>`;
                        if(email != null && email != undefined && email != ""){
                            html+=`<p class="mb-1 text-primary">${hideEmail(email)}</p>`;
                        }
                    html+=`</div>
                </div>
                <div class="bg-light-warning border-warning border p-2 px-3 d-flex align-items-center mt-4 mb-2">
                    <span class="d-inline-block text-center mr-2">
                        <i class="fa fa-info-circle text-warning position-relative" style="top:2px"></i>
                    </span>
                    <div>
                        <p class="mb-0 font-weight-bold">Security Notice</p>
                        <p class="mb-1 text-dark font-12">Please check your spam folder if you don't receive it.</p>
                    </div>
                </div>
                <div class="mt-4">
                    <a href="javascript:void(0)" class="btn btn-primary btn-lg full font-16" onclick="requestJobTrackingForOTP(\'${entityId}\',\'${email}\', \'send\')">
                        <i class="fa fa-paper-plane"></i>&nbsp;Send OTP
                    </a>
                </div>
                <hr class="mt-4"/>
                <p class="text-center text-black-50 font-12">
                    <i class="fa fa-lock"></i>&nbsp;Secure & Encrypted
                </p>
            </div>
            <div id="job-verify-OTP" style="display:none">
                <h5 class="font-weight-semi-bold text-dark text-center">
                    Enter OTP Code to Review the Contract   
                </h5>
                <p class="mb-0 text-black-50 font-16 text-center">Code sent to your registered email address</p>
                <div class="d-flex gap-15 mt-4 mb-4">
                    <input type="text" value="" id="opt-input-1" class="otp-input form-control font-30 py-4 text-center" onkeydown="handleTabValidation(this, event); return M.digit(event);" required maxlength="1" tabindex="1" onkeyup="setupOtpInputs(this, event)" autocomplete="off"/>    
                    <input type="text" value="" id="opt-input-2" class="otp-input form-control font-30 py-4 text-center" onkeydown="handleTabValidation(this, event); return M.digit(event);" required maxlength="1" tabindex="2" onkeyup="setupOtpInputs(this, event)" autocomplete="off"/>    
                    <input type="text" value="" id="opt-input-3" class="otp-input form-control font-30 py-4 text-center" onkeydown="handleTabValidation(this, event); return M.digit(event);" required maxlength="1" tabindex="3" onkeyup="setupOtpInputs(this, event)" autocomplete="off"/>    
                    <input type="text" value="" id="opt-input-4" class="otp-input form-control font-30 py-4 text-center" onkeydown="handleTabValidation(this, event); return M.digit(event);" required maxlength="1" tabindex="4" onkeyup="setupOtpInputs(this, event)" autocomplete="off"/>    
                    <input type="text" value="" id="opt-input-5" class="otp-input form-control font-30 py-4 text-center" onkeydown="handleTabValidation(this, event); return M.digit(event);" required maxlength="1" tabindex="4" onkeyup="setupOtpInputs(this, event)" autocomplete="off"/>    
                    <input type="text" value="" id="opt-input-6" class="otp-input form-control font-30 py-4 text-center" onkeydown="handleTabValidation(this, event); return M.digit(event);" required maxlength="1" tabindex="4" onkeyup="setupOtpInputs(this, event)" autocomplete="off"/>    
                </div>
                <div class="font-16 my-4 text-center">Haven't received the Code? <button id="btnResendOtp" onclick="requestJobTrackingForOTP(\'${entityId}\', \'${email}\',\'resend\')" disabled class="btn btn-secondary">Resend Code</button>&nbsp;<span id="otpTimer" class="d-inline-block"></span></div>
                <div class="full">
                    <a href="javascript:void(0)" class="btn btn-primary btn-lg disabled full font-16" id="verifyOTP" onclick="verifyJobTrackingOTP('${entityId}', '${email}')">
                    <i class="fa fa-check-circle"></i>&nbsp;Verify
                    </a>   
                </div>
            </div>
        </div>    
    </div>`;
    return html;
}

function getJobTrackingMainCardContent(){
    var html=
    `<div class="app-main py-2" style="flex:1;">
            <div id="OTPProcessWrapper"></div>
            <div id="b2bAppliactionTrackingViewWrapper"></div>
    </div>`;
    return html;
}

function getMainJobCardContent(){
    return getJobTrackingMainCardContent();
}
function getDotStyle(step) {
    if (step.priority === 12) {
        const msg = (step.message || "").toLowerCase();

        if (msg === "onboard") return "background:#16a34a";
        if (msg === "on hold") return "background:#F97316";
        if (msg === "rejected") return "background:red";

        return "background:#cbd5e1";
    }

    const priorityColors = {
        1: "#FBBF24",
        2: "#007FFF",
        3: "#0172E4",
        4: "#0262C2",
        5: "#0056AD",
        6: "#004890",
        7: "#003F7E",
        8: "#00E061",
        9: "#03C658",
        10: "#02B34F",
        11: "#019A43",
    };

    return `background:${priorityColors[step.priority] || "#cbd5e1"}`;
}

function getJobApplicationTrackingContent(res) {
    let steps = res.trackingSteps || [];
    let showSteps = [];
    
    for (let step of steps) {
        if (step.status === "pending") continue;
        showSteps.push(step);
            if (step.message === "rejected") break;
    }
    
    showSteps.reverse();

    let timelineHtml = showSteps.map(step => {
        const title =
            step.priority === 12
                ? step.message  
                : step.heading;
    
        return `
            <div class="step job-row">
                <div class="dot" style="${getDotStyle(step)}"></div>
                <h6>${title}</h6>
                <span class="badge">${step.processDate || ""}</span>
            </div>
        `;
    }).join("");

    const html = `
        <div class="user-header">
            <div class="user-row">
               <div class="user-title-icon"><i class="pe-7s-users text-primary mb-3" style="width: 50px;height: 50px;"></i></div>
                <div class="user-info">
                    <h4>${res.userDetails.fullName}</h4>
                    <span>
                        ${res.userDetails.city}, ${res.userDetails.country}
                    </span>
                </div>
            </div>
        </div>

        <div class="section">
            <h2 class="bold">Applied Jobs</h2>
            <p>Track the status of your job applications</p>

            <div class="card">
                <div class="job-row">
                    <div>
                        <strong class="h4 semi-bold">
                            <span class="icon-box">
                                <img src="${PATH_FOLDER_IMAGE2}buil.png" class="job-img">
                            </span>
                            ${res.userDetails.appliedUserRole}
                        </strong><br>
                        <small class="applied">
                            <i class="fa fa-calendar font-12"></i>
                            ${res.userDetails.appliedDate}
                        </small>
                    </div>
                </div>
            </div>

            <div class="card">
                <strong class="h4 semi-bold">
                    <img src="${PATH_FOLDER_IMAGE2}steps.png" class="job-img"> Track Status
                </strong>
                <div class="timeline">
                    ${timelineHtml}
                </div>
            </div>
        </div>
    `;
    return html;
}
// content function end here
