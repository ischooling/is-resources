var schoolSettingsLinks;
var USER_TIMEZONE = "Asia/Kolkata";
async function getEnrollmentPartnerTermsAndCondtionContent(b2bLeadId, partnerEmail, contractId){
    schoolSettingsLinks = await getSchoolSettingsLinks(SCHOOL_ID);
    $("body").html(getMainContent()+serverMessageContent()+getLoaderContent());
    $("#OTPProcessWrapper").append(getOTPProcess(b2bLeadId, partnerEmail, contractId));
}

function getMainContent(){
    var html=
    `<div class="app-container app-theme-white body-tabs-shadow fixed-header fixed-sidebar">
        ${getHeaderContent()}
        ${getMainCardContent()}
    </div>`;
    return html;
}

function getHeaderContent(){
    var html=
    `<div class="sticky-header">
        <div class="app-header header-shadow">
            <div class="app-header__logo">
                <a href="${schoolSettingsLinks.schoolWebsite}" target="blank" class="logo-src" style="background:url(${schoolSettingsLinks.logoUrl}${SCRIPT_VERSION});"></a>
            </div>
        </div>
    </div>`;
    return html;
}

function getMainCardContent(){
    var html=
    `<div class="app-main pb-4">
        <div class="app-main__inner py-0 px-2">
            <div id="OTPProcessWrapper"></div>
            <div id="b2bContractViewWrapper" class="col-xl-8 col-lg-10 col-md-12 col-sm-12 col-12 mx-auto p-3 card mt-4 pb-4 overflow-auto" style="display: none;"></div>
        </div>
    </div>`;
    return html;
}

function getOTPProcess(b2bLeadId, partnerEmail, contractId){
    var html=
    `<div class="d-flex align-items-center" style="background:url(${PATH_FOLDER_IMAGE2}otp_process_bg.png${SCRIPT_VERSION});background-size:cover;background-repeat:no-repeat; height:calc(100vh - 60px);padding-bottom:60px">
        <div class="card mx-auto w-100 px-3 py-4 px-md-5 border-primary rounded-15" style="max-width:500px;border-top:7px solid">
            <div class="text-center pb-4">
                <span class="bg-primary text-center rounded-circle d-inline-flex align-items-center justify-content-center text-white" style="width:75px;height:75px;">
                    <i class="fa fa-user-shield fa-2x"></i>
                </span>
            </div>
            <div id="verify-identity" class="full">
                <h5 class="font-weight-bold text-dark text-center">Verify Your Identity</h5>
                <p class="text-dark text-center">Please send the OTP to the registered email address.</p>
                <div class="bg-light-primary p-2 px-3 rounded-10 d-flex align-items-center mt-4 mb-2">
                    <span class="d-inline-block text-center rounded mr-2" style="width:25px;height:25px;background:#bbdaf9">
                        <i class="fa fa-envelope text-primary position-relative" style="top:2px"></i>
                    </span>
                    <div>
                        <p class="mb-0 font-weight-bold">OTP will be sent to:</p>
                        <p class="mb-1 text-primary">${hideEmail(partnerEmail)}</p>
                    </div>
                </div>
                <div class="bg-light-warning border-warning border p-2 px-3 rounded-10 d-flex align-items-center mt-4 mb-2">
                    <span class="d-inline-block text-center rounded mr-2">
                        <i class="fa fa-info-circle text-warning position-relative" style="top:2px"></i>
                    </span>
                    <div>
                        <p class="mb-0 font-weight-bold">Security Notice</p>
                        <p class="mb-1 text-dark font-12">Please check your spam folder if you don't receive it.</p>
                    </div>
                </div>
                <div class="mt-4">
                    <a href="javascript:void(0)" class="btn btn-primary btn-lg full font-16" onclick="requestForOTP(\'${partnerEmail}\', \'${contractId}\', \'send\')">
                        <i class="fa fa-paper-plane"></i>&nbsp;Send OTP
                    </a>
                </div>
                <hr class="mt-4"/>
                <p class="text-center text-black-50 font-12">
                    <i class="fa fa-lock"></i>&nbsp;Secure & Encrypted
                </p>
            </div>
            <div id="verify-OTP" style="display:none">
                <h5 class="font-weight-semi-bold text-dark text-center">
                    Enter OTP Code to Review the Contract   
                </h5>
                <p class="mb-0 text-black-50 font-16 text-center">Code sent to your registered email address</p>
                <div class="d-flex gap-15 mt-4 mb-4">
                    <input type="text" value="" id="opt-input-1" class="otp-input form-control font-30 py-4 text-center rounded-5" onkeydown="handleTabValidation(this, event); return M.digit(event);" required maxlength="1" tabindex="1" onkeyup="setupOtpInputs(this, event)" autocomplete="off"/>    
                    <input type="text" value="" id="opt-input-2" class="otp-input form-control font-30 py-4 text-center rounded-5" onkeydown="handleTabValidation(this, event); return M.digit(event);" required maxlength="1" tabindex="2" onkeyup="setupOtpInputs(this, event)" autocomplete="off"/>    
                    <input type="text" value="" id="opt-input-3" class="otp-input form-control font-30 py-4 text-center rounded-5" onkeydown="handleTabValidation(this, event); return M.digit(event);" required maxlength="1" tabindex="3" onkeyup="setupOtpInputs(this, event)" autocomplete="off"/>    
                    <input type="text" value="" id="opt-input-4" class="otp-input form-control font-30 py-4 text-center rounded-5" onkeydown="handleTabValidation(this, event); return M.digit(event);" required maxlength="1" tabindex="4" onkeyup="setupOtpInputs(this, event)" autocomplete="off"/>    
                    <input type="text" value="" id="opt-input-5" class="otp-input form-control font-30 py-4 text-center rounded-5" onkeydown="handleTabValidation(this, event); return M.digit(event);" required maxlength="1" tabindex="4" onkeyup="setupOtpInputs(this, event)" autocomplete="off"/>    
                    <input type="text" value="" id="opt-input-6" class="otp-input form-control font-30 py-4 text-center rounded-5" onkeydown="handleTabValidation(this, event); return M.digit(event);" required maxlength="1" tabindex="4" onkeyup="setupOtpInputs(this, event)" autocomplete="off"/>    
                </div>
                <div class="font-16 my-4 text-center">Haven't received the Code? <button id="btnResendOtp" onclick="requestForOTP(\'${partnerEmail}\', \'${contractId}\', \'resend\')" disabled class="btn btn-secondary">Resend Code</button>&nbsp;<span id="otpTimer" class="d-inline-block"></span></div>
                <div class="full">
                    <a href="javascript:void(0)" class="btn btn-primary btn-lg disabled full font-16" id="verifyOTP" onclick="verifyOTP(\'${b2bLeadId}\', \'${partnerEmail}\',\'${contractId}\')">
                    <i class="fa fa-check-circle"></i>&nbsp;Verify
                    </a>   
                </div>
            </div>
        </div>    
    </div>`;
    return html;
}

function viewB2BContractDetails(data){
    var html=
    `<form action="javascript:void(0);" id="b2bAcceptanceTermsConditionForm"> 
        <input type="hidden" id="contractId" name="contractId"/>
        <input type="hidden" id="b2bLeadId" name="b2bLeadId"/>
        <input type="hidden" id="location" name="location"/>
        <div class="full p-5" style="min-width:980px">
            <div class="full mb-4">
                <img src="${schoolSettingsLinks.logoUrl+SCRIPT_VERSION}" style="max-width:300px;width:100%"/>
            </div>
            <div class="w-100 d-flex justify-content-between my-4">
                <div>
                    <p class="m-0">${data.name}</p>
                    <p class="m-0">${data.countryName}</p>
                    <p class="m-0">${data.stateName}</p>
                    <p class="m-0">${data.cityName}</p>
                </div>
                <div calss="ml-auto">
                    <p class="m-0"><b>Date: </b>${data.createdAt == ""? "N/A":convertU2L(data.createdAt, getSystemTimezone(), DISPLAY_DATE_ONLY)}</p>`;
                    if(data.createdAt !=""){
                        var time = data.createdAt;
                        time=time.split(" ");
                        time = time[1].split(":");
                        html+=`<p class="m-0"><b>Time: </b>${data.createdAt == ""? "N/A":`${time[0]}:${time[1]}${time[0]>=12?"PM" : "AM"}`}</p>`;
                    }
                html+=`</div>
            </div>
            <div id="editorData"></div>
            <div class="full">
                <div class="signuture py-3">
                    <img src="${PATH_FOLDER_IMAGE2}paulsignature.png${SCRIPT_VERSION}" style="max-width:120px;width:100%"/>
                </div>
                <div class="signuture">
                    <p class="m-0">${data.createdByName}</p>
                    <p class="m-0">${data.schoolName}</p>
                    <p class="m-0">(Authorised Signatory for International Schooling)</p>
                </div>
            </div>
            <div class="full mt-4">
                <div class="d-flex">
                    <p class="m-0"><b>Address:</b>${data.schoolLocation}</p>
                    <p class="m-0 ml-auto">${data.name}</p>
                </div>
                ${data.publishedDate != ""? `<p class="m-0"><b>Date:</b>${data.publishedDate}</p>`:``}
            </div>
            <div class="full mt-5">
                <p class="font-weight-bold mb-0">Acceptance of Offer</p>
                <div class="d-flex align-items-start">
                    <span class="d-inline-block position-relative mr-1" style="top:2px">
                        <input type="checkbox" id="b2bContractAcceptanceCheckbox" onchange="acceptanceCheckbox(this)"/>							
                    </span>
                    <label for="b2bContractAcceptanceCheckbox">I hereby confirm that I have read and agree to the Terms. I understand that this agreement is digitally signed and does not require a physical signature.</label>
                </div>
            </div>
            <div class="full text-right mt-3" id="acceptb2bPartnerTermsConditionBtnWrapper" style="display:none">
                <a href="javascript:void(0)" class="btn btn-success px-4" id="acceptb2bPartnerTermsConditionBtn" onclick="acceptb2bPartnerTermsCondition()">Accept</a>
            </div>
        </div>
    </form>`;
    return html;
}


function serverMessageContent(){
    var html=
    `<div id="messageDiv" class="server-message">
        <span id="msgTheme2" class="msg"></span>
    </div>`;
    return html;
}

function startTenSecondTimer(elementID, timeLeft) {
    $("#btnResendOtp").attr("disabled", true);
    var countdown = setInterval(function() {
        timeLeft--;
        if (timeLeft > 0) {
            $("#" + elementID).text("("+timeLeft+")");
        } else {
            clearInterval(countdown);
            $("#btnResendOtp").attr("disabled", false);
            $("#" + elementID).text("");
        }
    }, 1000);
}


function setupOtpInputs(currentInput, event) {
    var inputs = $('[id^="opt-input-"]').toArray();
    var index = inputs.indexOf(currentInput);
    var value = $(currentInput).val();
    var inputID = $(currentInput).attr("id");
    if (value !="" && index < inputs.length - 1) {
        $(currentInput).removeClass('is-invalid');
        $(inputs[index + 1]).focus();
    }else{
        if(value != ""){
            $(currentInput).removeClass('is-invalid');
        }
    }
    if (event.key === 'Backspace' && !value && index > 0) {
        $(inputs[index - 1]).focus();
        $(currentInput).removeClass('is-invalid');
        $("#verifyOTP").addClass("disabled");
    }
    
    if(validateOtpInputs()){
        $("#verifyOTP").removeClass("disabled");
    }
}
function handleTabValidation(currentInput, event) {
    if (event.key === 'Tab') {
        const value = $(currentInput).val();
        if (!/^\d$/.test(value)) {
            $(currentInput).addClass('is-invalid');
        } else {
            $(currentInput).removeClass('is-invalid');
        }
    }
}
function validateOtpInputs() {
    var isValid = true;
    $('[id^="opt-input-"]').each(function () {
        if (!/^\d$/.test($(this).val())) {
            isValid = false;
        }
    });
    return isValid;
}

async function requestForOTP(partnerEmail, contractId, reqType){
    
   var payload = {
        authentication: {
            hash: "",
            loginHash: "",
            userType: "B2B_PARTNER",
            userId: USER_ID,
            schoolId: SCHOOL_ID,
            schoolUUID: SCHOOL_UUID,
            sessionUserId: USER_ID
        },
        requestOTPData: {
            otpType: reqType == "send" ? 1 : 2,
            isdCode: "",
            userphone: "",
            otpCode: "",
            signupType: "",
            isDemoUser: "false",
            email:partnerEmail,
            messageChannel: "EMAIL",
            location: "",
            entityType: "CONTRACT_DETAILS",
            entityId: contractId,
            schoolUUID:SCHOOL_UUID,
            schoolId:SCHOOL_ID,
            varifiedUsing:"E"
        }
    } 

    var response =  await getDashboardDataBasedUrlAndPayloadWithParentUrl(true, true,"otp-process", payload, "api/v1/common");
    console.log(response);
    if(response.status == 1){
        startTenSecondTimer('otpTimer', 11);
        $("#verify-identity").hide();
        $("#verify-OTP").show();
    }
    
}

async function verifyOTP(b2bLeadId, partnerEmail, contractId){
    if (!validateOtpInputs()) {
        showMessageTheme2(0, 'Please enter all digits (0-9) in the OTP fields.');
        $("#verifyOTP").addClass("disabled");
        return false;
    }else{
        var OTP="";
        $(".otp-input").each(function(){ 
            OTP += $(this).val() 
        });
        console.log(OTP)
        var payload = {
            authentication: {
                hash: "",
                loginHash: "",
                userType: "B2B_PARTNER",
                userId: USER_ID,
                schoolId: SCHOOL_ID,
                schoolUUID: SCHOOL_UUID,
                sessionUserId: USER_ID
            },
            requestOTPData: {
                otpType: 3,
                otpCode:OTP,
                isdCode: "",
                userphone: "",
                signupType: "",
                isDemoUser: "false",
                email:partnerEmail,
                messageChannel: "EMAIL",
                location: "",
                entityType: "CONTRACT_DETAILS",
                entityId: contractId,
                schoolUUID:SCHOOL_UUID,
                schoolId:SCHOOL_ID
            }
        } 

        var response =  await getDashboardDataBasedUrlAndPayloadWithParentUrl(true, true,"otp-process", payload, "api/v1/common");
        console.log(response);
        if(response.status == 1){
            $("#b2bContractViewWrapper").show();
            $("#OTPProcessWrapper").hide();
            verifyOTPAndGetAgreementDetails(b2bLeadId, contractId)
        }
    }
}




async function verifyOTPAndGetAgreementDetails(b2bLeadId, contractId){
    var payload = {};
    payload['b2bleadId'] = b2bLeadId;
    payload['contractId'] = contractId;
    payload['requestFor'] = "B2B_PARTNER";
    payload['actionType'] = "V";
    payload = "?payload="+encode(JSON.stringify(payload))
    responseData = await getDashboardDataBasedUrlAndPayloadWithParentUrlGET(true, true, 'partner-contract-details'+payload, '');
    console.log(responseData)
    $("#b2bContractViewWrapper").html(viewB2BContractDetails(responseData.details));
    callLocationDetails("b2bAcceptanceTermsConditionForm");
    $("#contractId").val(responseData.details.contractId);
    $("#b2bLeadId").val(responseData.details.b2bLeadId);
    $("#editorData").html(responseData.details.commentData);
}

function acceptanceCheckbox(src){
    if($(src).prop("checked")){
        $("#acceptb2bPartnerTermsConditionBtnWrapper").show()
    }else{
        $("#acceptb2bPartnerTermsConditionBtnWrapper").hide()
    }
}

async function acceptb2bPartnerTermsCondition(){
    var payload ={
		contractId:parseInt($("#contractId").val()),
		b2bLeadId:parseInt($("#b2bLeadId").val()),
        location:$("#b2bAcceptanceTermsConditionForm #location").val(),
        additionalDetails: fillBrowserDetail(),
		actionType:"A",
        sessionUserId:USER_ID
	}
    var response =  await getDashboardDataBasedUrlAndPayloadWithParentUrlForContract(true, true,"save-partner-contract-details", payload, "");
    if (response.status == '0' || response.status == '2' || response.status == '3') {
        showMessageTheme2(0, response.message);
    }else{
        showMessageTheme2(1, response.message)
        setTimeout(() => {
            $("body").html(getContractThankYouPage(response.partnerName))
        }, 2000);
    }
    // if(response.status == 1){
	// 	// $("#acceptb2bPartnerTermsConditionBtnWrapper").hide();
    //     // $("#b2bContractAcceptanceCheckbox").prop("disabled", true);
	// }
}   

function hideEmail(email) {
    let [username, domain] = email.split("@");
    let hiddenUsername = username.slice(0,2) + "*".repeat(username.length - 2)+username.slice(username.length-2,username.length);
    return hiddenUsername + "@" + domain;
}

function getContractThankYouPage(partnerName){
    var html =
        `<div class="w-100 bg-white py-2 px-3 shadow-sm position-fixed fixed-top">
            <img src="${schoolSettingsLinks.logoUrl}${SCRIPT_VERSION}" alt="School Logo" class="img-fluid" style="height:40px;">
        </div>

        <div class="d-flex justify-content-center align-items-center bg-light vh-100">
          <div class="bg-white p-4 rounded shadow text-center w-100" style="max-width: 550px;">
            
            <div class="bg-primary" style="height:6px; border-top-left-radius:10px; border-top-right-radius:10px; margin:-24px -24px 24px -24px;"></div>
            
            <div class="d-flex justify-content-center mb-4">
              <div class="rounded-circle d-flex align-items-center justify-content-center" 
                   style="width:70px; height:70px; background-color:#3CC48F;">
                <i class="fas fa-check text-white" style="font-size:28px;"></i>
              </div>
            </div>

            <h2 class="h4 text-secondary mb-3">Thank You, ${partnerName}!</h2>
            <p class="text-muted mb-2">You have successfully accepted the contract.</p>
            <p class="text-muted mb-0">Your Enrollment Partner credentials will be sent to you shortly.</p>
          </div>
        </div>`;
    return html;
}