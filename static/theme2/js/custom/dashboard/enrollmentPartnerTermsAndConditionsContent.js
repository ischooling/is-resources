var schoolSettingsLinks;
var schoolSettingsTechnical;
var B2B_LEAD_ID;
var USER_TIMEZONE = "Asia/Kolkata";
async function getEnrollmentPartnerTermsAndCondtionContent(b2bLeadId, partnerEmail, contractId){
    schoolSettingsLinks = await getSchoolSettingsLinks(SCHOOL_ID);
    schoolSettingsTechnical = await getSchoolSettingsTechnical(SCHOOL_ID);
    B2B_LEAD_ID = b2bLeadId;
    $("body").html(getMainContent()+serverMessageContent()+getLoaderContent());
    $("#OTPProcessWrapper").append(getOTPProcess(b2bLeadId, partnerEmail, contractId));
}

function getMainContent(){
    var html=
    `<div class="app-container app-theme-white body-tabs-shadow fixed-header fixed-sidebar">
        ${getHeaderContent()}
        ${getMainCardContent()}
        ${getFooterContent()}
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

function getFooterContent() {
    return `
        <footer style="
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            text-align: center;
            background: #fff;
            padding: 8px 0;
            font-size: 14px;
        ">
            Copyright © ${schoolSettingsTechnical.copyrightYear} - ${schoolSettingsTechnical.copyrightName} - All Rights Reserved.
        </footer>
    `;
}

function getMainCardContent(){
    var html=
    `<div class="app-main py-5">
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
                    <i class="fa fa-shield fa-2x"></i>
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
                        html += `<p class="m-0"><b>Time: </b>${!data.createdAt?"N/A":(()=>{let [h,m]=data.createdAt.split(" ")[1].split(":");h=parseInt(h);return `${h%12||12}:${m} ${h>=12?"PM":"AM"}`})()}</p>`;
                    }
                html+=`</div>
            </div>
            <div id="editorData"></div>

            <div class="full mt-4 mb-4">
                <label class="font-weight-bold d-block mb-2">Upload Recipient Signature</label>
                <div class="custom-file" style="max-width: 400px;">
                    <input 
                        type="file" 
                        class="custom-file-input cursor" 
                        id="recipientSignatureUpload" 
                        accept="image/*" 
                        onchange="handleRecipientSignatureUpload(this, 'rightSignatureBox'); updateFileName(this)"
                    >
                    <label class="custom-file-label text-truncate" for="recipientSignatureUpload">Choose file...</label>
                </div>
                <small class="form-text text-danger font-12 mt-1" style="max-width: 50%;">
                    Please upload your signature image (PNG/JPG only, white/transparent background, max size: 300KB).
                </small>
            </div>
            ${/*<div class="full">
                <div class="signuture py-3">
                    <img src="${PATH_FOLDER_IMAGE2}paulsignature.png${SCRIPT_VERSION}" style="max-width:120px;width:100%"/>
                </div>
                <div class="signuture">
                    <p class="m-0">${data.createdByName}</p>
                    <p class="m-0">${data.schoolName}</p>
                    <p class="m-0">(Authorised Signatory for International Schooling)</p>
                </div>
            </div>*/''}
            <div class="full mt-4">
                <div class="d-flex">
                    <p class="m-0"><b>Address:</b> ${data.schoolLocation}</p>
                    ${/*<p class="m-0 ml-auto">${data.name}</p>*/''}
                </div>
                ${data.publishedDate != ""? `<p class="m-0"><b>Date:</b> ${changeDateFormat(new Date(data.publishedDate), "MMM dd, yyyy hh:mm A")}</p>`:``}
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
    var cleanedCommentData = cleanBase64Images(responseData.details.commentData);
    $("#editorData").html(cleanedCommentData);
}

function acceptanceCheckbox(src){
    if($(src).prop("checked")){
        $("#acceptb2bPartnerTermsConditionBtnWrapper").show()
    }else{
        $("#acceptb2bPartnerTermsConditionBtnWrapper").hide()
    }
}

async function acceptb2bPartnerTermsCondition(){
    if($("#rightSignatureBox").html().includes('<br>') && $("#recipientSignatureUpload").val() === ''){
        showMessageTheme2(0, "Please upload your signature");
        return;
    }
    if(!$("#b2bContractAcceptanceCheckbox").is(":checked")){
        showMessageTheme2(0, "Please confirm that you have read and agree to the Terms.");
        return;
    }
    var updatedCommentData = $("#editorData").html();
    var payload ={
		contractId:parseInt($("#contractId").val()),
		b2bLeadId:parseInt($("#b2bLeadId").val()),
        location:$("#b2bAcceptanceTermsConditionForm #location").val(),
        additionalDetails: fillBrowserDetail(),
		actionType:"A",
        sessionUserId:USER_ID,
        commentData: updatedCommentData
	}
    var response =  await getDashboardDataBasedUrlAndPayloadWithParentUrlForContract(true, true,"save-partner-contract-details", payload, "");
    if (response.status == '0' || response.status == '2' || response.status == '3') {
        showMessageTheme2(0, response.message);
    }else{
        showMessageTheme2(1, response.message)
        setTimeout(() => {
            $("body").html(getContractThankYouPage(response.partnerName)+getBankDetailsContractContent()+showMessageTheme2Content()+getFooterContent())
            if(response.partnerType == 'WLP'){
                addLaterBankDetails();
            }else if(response.bankDetailsExist == "Y"){
                addLaterBankDetails();
            }
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

        <div id="contractThankYou" style="display:none;">
            <div class="d-flex justify-content-center align-items-center bg-light vh-100">
                <div class="bg-white p-4 rounded shadow text-center w-100" style="max-width: 550px;">
                
                    <div class="bg-primary" style="height:6px; border-top-left-radius:10px; border-top-right-radius:10px; margin:-24px -24px 24px -24px;"></div>
                
                    <div class="d-flex justify-content-center mb-4">
                        <div class="rounded-circle d-flex align-items-center justify-content-center" style="width:70px; height:70px; background-color:#3CC48F;">
                            <i class="fas fa-check text-white" style="font-size:28px;"></i>
                        </div>
                    </div>

                    <h2 class="h4 text-secondary mb-3">Thank You, ${partnerName}!</h2>
                    <p class="text-muted mb-2">You have successfully accepted the contract.</p>
                    <p class="text-muted mb-0">Your Enrollment Partner credentials will be sent to you shortly.</p>
                </div>
            </div>
        </div>`;
    return html;
}

function getContractExpiredContent(){
    var html=
    `<div class="d-flex align-items-center" style="background:url(${PATH_FOLDER_IMAGE2}otp_process_bg.png${SCRIPT_VERSION});background-size:cover;background-repeat:no-repeat; height:calc(100vh - 60px);padding-bottom:60px">
        <div class="card mx-3 mx-sm-auto w-100 px-3 py-4 px-md-5 border-primary rounded-15" style="max-width:500px;border-top:7px solid">
            <div class="text-center pb-4">
                <span class="bg-light-danger text-center rounded-circle d-inline-flex align-items-center justify-content-center text-white" style="width:75px;height:75px;">
                    <span class="bg-danger text-center rounded-circle d-inline-flex align-items-center justify-content-center text-white" style="width:55px;height:55px;">
                        <i class="fa fa-exclamation-triangle font-20" aria-hidden="true"></i>
                    </span>
                </span>
            </div>
            <div id="verify-identity" class="full">
                <h5 class="font-weight-bold text-dark text-center">This contract has expired</h5>
                <p class="text-dark text-center">Kindly ask the administrator to add a new contract.</p>
            </div>
        </div>
    </div>`;
    return html;
}

function getBankDetailsContractContent() {
  var html=`
    <div id="bankDetailsContract" class="container-fluid px-3 py-4 bg-light mt-5">
        <div class="card shadow-sm border-0 rounded mx-auto" style="max-width: 768px;">
            <div class="card-header bg-white border-0 d-flex align-items-center">
                <i class="fa fa-university text-primary mr-2 fa-lg"></i>
                <h5 class="mb-0 font-weight-bold">Bank Details</h5>
            </div>

            <div class="card-body">
                <form id="b2bBankDetailsForm">
                    <div class="form-row">
                        <div class="form-group col-md-6">
                            <label for="bicName" class="font-weight-500">BIC Name</label>
                            <input type="text" class="form-control" id="bicName">
                        </div>
                        <div class="form-group col-md-6">
                            <label for="bankAddress" class="font-weight-500">Bank Address</label>
                            <input type="text" class="form-control" id="bankAddress">
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group col-md-6">
                            <label for="swiftCode" class="font-weight-500">Swift Code</label>
                            <input type="text" class="form-control" id="swiftCode">
                        </div>
                        <div class="form-group col-md-6">
                            <label for="bankCode" class="font-weight-500">Bank Code</label>
                            <input type="text" class="form-control" id="bankCode">
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group col-md-6">
                            <label for="branchCode" class="font-weight-500">Branch Code</label>
                            <input type="text" class="form-control" id="branchCode">
                        </div>
                        <div class="form-group col-md-6">
                            <label for="accountName" class="font-weight-500">Account Holder Name</label>
                            <input type="text" class="form-control" id="accountName">
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="accountNumber" class="font-weight-500">Account Number</label>
                        <input type="text" class="form-control" id="accountNumber" onkeydown="return M.digit(event);">
                    </div>

                    <div class="text-right mt-4">
                        <button type="button" class="btn btn-light border mr-2" onclick="addLaterBankDetails();">Add Later</button>
                        <button type="button" class="btn btn-primary" onclick="openBankConfirmationModal('fromContract');">Save</button>
                    </div>
                </form>
            </div>
        </div>
    </div>`;
  return html;
}

function addLaterBankDetails(){
    $("#bankDetailsContract").hide();
    $("#contractThankYou").show();
}

function confirmationModalBank(){
    var html=
        `<div class="modal fade" id="confirmationModalBank" tabindex="-1" role="dialog" aria-labelledby="confirmationModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document" style="box-shadow: 0 0;">
                <div class="modal-content">
                <div class="border-0 d-flex flex-column align-items-center">
                    <i class="fa fa-info bg-primary font-28 mt-2 text-white d-flex justify-content-center align-items-center rounded-circle my-3" style="width: 55px; height: 55px;"></i>
                </div>

                <div class="modal-body text-center">
                    <h5 class="mb-0">Are you sure you want to save these details?</h5>
                </div>

                <div class="modal-footer justify-content-center border-0">
                    <button type="button" class="btn btn-primary px-4" onclick="saveB2bBankDetails('fromContract');">
                        Yes
                    </button>
                    <button type="button" class="btn btn-light px-4" data-dismiss="modal">
                        No
                    </button>
                </div>

                </div>
            </div>
            </div>`
    return html;
}

function openBankConfirmationModal(callFrom){
    if(!validateB2bBankDetails(callFrom)) return;
    if($("#confirmationModalBank").length == 1){
        $("#confirmationModalBank").remove();
    }
    $("body").append(confirmationModalBank());
    setTimeout(() => {
        $("#confirmationModalBank").modal('show');
    }, 300);
}