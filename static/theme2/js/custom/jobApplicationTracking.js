// event function start from here
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
        $("#").addClass("disabled");
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

function hideEmail(email) {
    let [username, domain] = email.split("@");
    let hiddenUsername = username.slice(0,2) + "*".repeat(username.length - 2)+username.slice(username.length-2,username.length);
    return hiddenUsername + "@" + domain;
}

async function requestJobTrackingForOTP(entityId,email,reqType){   
     var payload = {
         authentication: {
             hash: "",
             loginHash: "",
             userType: "B2B_PARTNER",
             schoolId: SCHOOL_ID,
             schoolUUID: SCHOOL_UUID,
             sessionUserId: USER_ID
         },
         requestOTPData: {
             otpType: reqType == "send" ? 1 : 2,
             userphone: "",
             otpCode: "",
             signupType: "",
             isDemoUser: "false",
             email:email,
             messageChannel: "email",
             location: "",
             entityType: "USER_SCREENING",
             entityId: entityId,
             schoolUUID:SCHOOL_UUID,
             schoolId:SCHOOL_ID,
             varifiedUsing:"E"
         }
     } 
 
     var response =  await getDashboardDataBasedUrlAndPayloadWithParentUrl(true, true,"otp-process", payload, "api/v1/common");
     console.log(response);
     if(response.status == 1){
         startTenSecondTimer('otpTimer', 11);
         $("#job-verify-identity").hide();
         $("#job-verify-OTP").show();
     }
     
 }

async function verifyJobTrackingOTP(entityId,email){
    
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
            timezone: getSystemTimezone(),
            entityId:entityId
        };
        var ajaxReqDetails = {
            method: "POST",
            url: APP_BASE_URL + SCHOOL_UUID+"/job-application/tracker",
            body: payload,
            global: true,
            showMessage: true,
            onFaildResolved: true,
            onSuccessResolved: true
        }
        var data = await callCommonAjax(ajaxReqDetails);
        if(data.status == 1){
            $("#job-verify-OTP, #OTPProcessWrapper").hide();
            $("#b2bAppliactionTrackingViewWrapper").show();
            $("#b2bAppliactionTrackingViewWrapper").html(getJobApplicationTrackingContent(data));
        }        
    }
}
// event function end here
