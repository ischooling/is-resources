var schoolSettingsLinks;
var schoolSettingsTechnical;
var B2B_LEAD_ID;
var USER_TIMEZONE = "Asia/Kolkata";
var verifyUploadDocsObj = [];
var professionalUploadDocsObj = [];
var ENTITY_ID;
var ENTITY_TYPE;
async function getEnrollmentPartnerTermsAndCondtionContent(entityId, partnerEmail, contractId, entityType, userFullName, currentApplicantStage){
    schoolSettingsLinks = await getSchoolSettingsLinks(SCHOOL_ID);
    schoolSettingsTechnical = await getSchoolSettingsTechnical(SCHOOL_ID);
    B2B_LEAD_ID = entityId;
    ENTITY_ID = entityId;
    ENTITY_TYPE = entityType
    USER_FULL_NAME = userFullName;
    $("body").html(getMainContent(entityType)+serverMessageContent()+getLoaderContent());
    $("#OTPProcessWrapper").append(getOTPProcess(entityId, partnerEmail, contractId, entityType, currentApplicantStage));
    createStepsImage();
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

async function verifyOTP(entityId, partnerEmail, contractId, entityType, currentApplicantStage){
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
                schoolUUID: SCHOOL_UUID,
                schoolId: SCHOOL_ID
            }
        }
        var response =  await getDashboardDataBasedUrlAndPayloadWithParentUrl(true, true,"otp-process", payload, "api/v1/common");
        if(response.status == 1){
            if(entityType == "USER_SCREENING"){
                $("#formSteps").removeClass("d-none");
            }else{
                $("#b2bContractViewWrapper").show();
            }
            $("#OTPProcessWrapper").hide();
            if (currentApplicantStage == "Academic & Professional Details Pending"){
                getOtherRolesStage1Data();
            }else if(entityType == "B2B_REQUEST" || (currentApplicantStage == "Contract Pending Acceptance" && entityType == "USER_SCREENING")){
                verifyOTPAndGetAgreementDetails(entityId, contractId, entityType, currentApplicantStage)
            }else if(currentApplicantStage == "Verification Pending Submission" || currentApplicantStage == "Verification Pending Admin Approval"){
                getOtherRolesStage3Data(entityId, entityType);
                if(currentApplicantStage == "Verification Pending Admin Approval"){
                    $("#inReviewForOtherRolesVerificationModal").remove();
                    $("body").append(inReviewForOtherRolesVerificationModal());
                    $('#inReviewForOtherRolesVerificationModal').modal({backdrop: 'static', keyboard: false});
                }
            }else if(currentApplicantStage == "Bank Details Pending"){
                getOtherRolesStage4Data();
            }else if(currentApplicantStage == "Onboarding Complete"){
                $("#formSteps").html(getOtherRolesThankYouPage());
            }
        }
    }
}

async function verifyOTPAndGetAgreementDetails(entityId, contractId, entityType, currentApplicantStage){
    if(entityType == "USER_SCREENING"){
        setSteps(2);
        showSkeleton(true, 'step2');
    }
    var payload = {};
    payload['entityId'] = entityId;
    payload['entityType'] = entityType;
    payload['contractId'] = contractId;
    payload['requestFor'] = entityType == "USER_SCREENING" ? "JOB_APPLICANT" :"B2B_PARTNER";
    payload['actionType'] = "V";
    payload = "?payload="+encode(JSON.stringify(payload))
    responseData = await getDashboardDataBasedUrlAndPayloadWithParentUrlGET(true, true, 'partner-contract-details'+payload, '');
    console.log(responseData);
    if(entityType == "USER_SCREENING"){
        getOtherRolesStage2Data(responseData.details)
    }else{
        $("#b2bContractViewWrapper").html(viewB2BContractDetails(responseData.details));
        callLocationDetails("b2bAcceptanceTermsConditionForm");
    }
    $("#contractId").val(responseData.details.contractId);
    $("#b2bLeadId").val(responseData.details.b2bLeadId);
    $("#entityId").val(entityId);
    $("#entityType").val(entityType);
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
		entityId:parseInt($("#b2bLeadId").val()),
		entityType:$("#entityType").val(),
        location:$("#b2bAcceptanceTermsConditionForm #location").val(),
        additionalDetails: fillBrowserDetail(),
		actionType:"A",
        sessionUserId:USER_ID,
        commentData: updatedCommentData
	}
    var response =  await getDashboardDataBasedUrlAndPayloadWithParentUrlForContract(true, true, "save-partner-contract-details", payload, "");
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
}

function hideEmail(email) {
    let [username, domain] = email.split("@");
    let hiddenUsername = username.slice(0,2) + "*".repeat(username.length - 2)+username.slice(username.length-2,username.length);
    return hiddenUsername + "@" + domain;
}

function addLaterBankDetails(){
    $("#bankDetailsContract").hide();
    $("#contractThankYou").show();
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

function createStepsImage(){
    $('.steps ul li:first-child').find('a .icon-circle').append(`<div class="icon-div"></div><span class="icon">${getIcon(0,true)}</span>`);
    $('.steps ul li:nth-child(2)').find('a .icon-circle').append(`<div class="icon-div"></div><span class="icon">${getIcon(1,false)}</span>`);
    $('.steps ul li:nth-child(3)').find('a .icon-circle').append(`<div class="icon-div"></div><span class="icon">${getIcon(2,false)}</span>`);
    $('.steps ul li:last-child a .icon-circle').append(`<div class="icon-div"></div><span class="icon">${getIcon(3,false)}</span>`);
}

function getIcon(index, activeFlag){
    var iconArray = 
    [
        `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="21" viewBox="0 0 24 21" fill="none"><path d="M20 19.09L22.45 20.58L21.8 17.77L24 15.89L21.11 15.64L20 13L18.87 15.64L16 15.89L18.18 17.77L17.5 20.58L20 19.09ZM14.08 18H2C0.95 18 0 17.05 0 16V2C0 0.95 0.95 0 2 0H22C23.05 0 24 0.95 24 2V12.53C22.9018 11.5429 21.4767 10.9978 20 11C16.69 11 14 13.69 14 17C14 17.34 14.03 17.68 14.08 18ZM8 10.91C6 10.91 2 12 2 14V15H14V14C14 12 10 10.91 8 10.91ZM8 3C6.35 3 5 4.35 5 6C5 7.65 6.35 9 8 9C9.65 9 11 7.65 11 6C11 4.35 9.65 3 8 3ZM21 7H14V8H21V7ZM22 5H14V6H22V5ZM22 3H14V4H22V3Z" fill="${activeFlag?'var(--pc)':'#BBBBBB'}"/></svg>`,
        `<svg xmlns="http://www.w3.org/2000/svg" width="23" height="26" viewBox="0 0 23 26" fill="none">
            <path d="M8.7091 0C9.7486 0.28761 10.3019 1.0217 10.6361 2.02149L13.2081 2.10366L13.3355 3.27053C13.9724 3.39516 17.0101 2.91718 17.0101 3.74714V15.3967L15.9213 14.9886V4.56478L15.7172 4.36071H13.4725L13.3369 5.99598H3.74167C3.35408 5.63715 3.59923 4.98387 3.5376 4.49767H1.08881V24.6632H11.0908C11.1962 24.6632 12.1947 25.3781 12.2481 25.6164H0.204066L0 25.4124V3.40612C0.134218 3.44995 0.295827 3.27053 0.339653 3.27053H3.5376L3.55677 2.19953L6.3822 2.03107C6.51094 0.89159 7.25461 0.310892 8.30097 0.00136957H8.7091V0Z" fill="${activeFlag?'var(--pc)':'#BBBBBB'}"/>
            <path d="M13.5779 12.8082H3.39514V13.8984H13.5779V12.8082Z" fill="${activeFlag?'var(--pc)':'#BBBBBB'}"/>
            <path d="M13.5737 9.12271H3.41016V10.2266H13.5737V9.12271Z" fill="${activeFlag?'var(--pc)':'#BBBBBB'}"/>
            <path d="M8.5564 15.0309C8.70747 15.0817 8.83784 15.1609 8.94214 15.2223C9.05339 15.2878 9.14035 15.3367 9.23413 15.3668V15.3678C9.56802 15.4751 9.98398 15.5062 10.3835 15.5524L10.9089 15.6139L10.5466 15.9625L9.56226 17.4391C9.44208 17.8251 9.5148 17.9696 9.573 18.0221C9.65484 18.0958 9.86276 18.1508 10.2751 18.0739C10.7364 17.9879 11.1989 17.6946 11.5496 17.3551L11.6423 17.2487C11.68 17.2022 11.7245 17.1465 11.7732 17.0846C11.8181 17.0276 11.8657 16.9678 11.9089 16.9176C11.9465 16.874 12.0001 16.814 12.0554 16.776L12.1101 16.7467C12.1221 16.7414 12.135 16.7357 12.1472 16.7311C12.172 16.7216 12.2026 16.7109 12.2351 16.6998C12.3007 16.6776 12.3827 16.6513 12.4636 16.6266C12.5444 16.6019 12.6269 16.5778 12.6921 16.5602C12.7242 16.5515 12.7548 16.5443 12.78 16.5387C12.7924 16.536 12.8069 16.5331 12.821 16.5309C12.8225 16.5307 12.8651 16.5225 12.9119 16.5299L12.947 16.5358L12.9792 16.5504C14.4349 17.2378 15.7987 18.0726 17.0984 18.9918C17.3156 19.1454 17.6637 19.3791 17.9734 19.6012C18.2876 19.8266 18.6086 20.0726 18.8083 20.2838C19.1616 20.6575 19.1783 21.1178 18.9265 21.444C18.6922 21.7475 18.2648 21.8808 17.824 21.7448C17.8632 22.1139 17.762 22.4317 17.5056 22.6344C17.2701 22.8206 16.9523 22.8703 16.6228 22.8287L16.6199 22.8756C16.6063 23.0796 16.5704 23.3094 16.449 23.4977C16.3162 23.7034 16.1034 23.8271 15.8152 23.8551C15.6452 23.8715 15.4742 23.8514 15.3064 23.8102C15.3076 23.8153 15.3104 23.8204 15.3113 23.8258C15.3231 23.8976 15.3032 23.9545 15.2957 23.9742C15.2893 23.991 15.2781 24.0109 15.2751 24.0172L15.2761 24.0182C15.2433 24.0895 15.1893 24.1553 15.1433 24.2047C15.0934 24.2583 15.0348 24.3121 14.9763 24.361C14.8932 24.4304 14.7941 24.5026 14.7048 24.5533L14.6199 24.5963C14.3508 24.7089 13.9945 24.7004 13.6873 24.6637C13.3683 24.6255 13.0507 24.55 12.8298 24.4879C12.7894 24.4766 12.6832 24.448 12.5847 24.4186C12.5355 24.4039 12.4847 24.3871 12.4412 24.3717C12.4195 24.364 12.3964 24.3562 12.3757 24.3473C12.36 24.3405 12.3272 24.3259 12.2966 24.3033V24.3024C12.2875 24.2956 12.2651 24.2793 12.2449 24.2594C12.223 24.2379 12.182 24.1921 12.1658 24.1198C12.1495 24.0471 12.1668 23.9876 12.1775 23.9586C12.1873 23.9321 12.2004 23.9081 12.2058 23.8981L12.2732 23.8004C12.2923 23.7772 12.3163 23.7507 12.3308 23.734C12.3673 23.692 12.3824 23.6695 12.3894 23.6539C12.4925 23.4229 12.4472 23.1529 12.2908 22.9391C12.1349 22.7261 11.8877 22.5952 11.6199 22.6227L11.3083 22.6549L11.3464 22.3434C11.4091 21.8298 11.0372 21.381 10.5017 21.3912L10.1638 21.3981L10.2556 21.0729C10.3355 20.7905 10.1929 20.4868 9.92163 20.3024C9.65496 20.1211 9.32991 20.0995 9.08179 20.3073H9.08081C9.04372 20.3384 9.01872 20.3769 8.96265 20.4557C8.91294 20.5256 8.83792 20.6277 8.71655 20.7037L8.44116 20.8756L8.34546 20.5651C8.27485 20.3362 8.08533 20.1488 7.85522 20.0631C7.63582 19.9814 7.39708 19.9985 7.19897 20.1461L7.18433 20.3307H6.76733L6.69214 20.2408L5.98804 19.3971L5.87671 19.2633L5.96362 19.1119L8.2605 15.1432L8.36206 14.9664L8.5564 15.0309Z" fill="${activeFlag?'var(--pc)':'#BBBBBB'}" stroke="(--pc)" stroke-width="0.5"/>
            <path d="M12.183 14.8066C13.1978 14.6578 14.343 14.6338 15.3636 14.8115C15.6612 14.8633 15.9951 14.9579 16.2758 15.0204C16.5734 15.0868 16.8495 15.1284 17.1097 15.1035C17.1092 15.1035 17.1174 15.1021 17.139 15.0976C17.1586 15.0935 17.1834 15.088 17.2123 15.081C17.2712 15.0666 17.3367 15.0491 17.4076 15.0312C17.4752 15.0141 17.547 14.9967 17.6058 14.9853C17.6345 14.9797 17.6672 14.9742 17.6976 14.9716C17.7125 14.9704 17.7338 14.969 17.7572 14.9706C17.7608 14.9709 17.767 14.9726 17.7748 14.9736H17.8978L17.9701 15.0986L20.2006 18.9531L20.2162 18.9794L20.224 19.0078C20.2446 19.0775 20.2481 19.16 20.2123 19.2411C20.1788 19.3167 20.1242 19.3618 20.0912 19.3847C20.0702 19.3992 20.043 19.4117 20.0297 19.4189C19.8002 19.6795 19.5128 19.969 19.1879 20.165C19.1627 20.1802 19.1497 20.1898 19.1088 20.2158C19.0762 20.2364 19.0322 20.2628 18.9828 20.2841C18.8799 20.3284 18.7177 20.363 18.557 20.2578L18.5482 20.2519L18.5404 20.246C17.1008 19.1281 15.5959 18.0598 13.9818 17.2148C13.9205 17.1827 13.8289 17.1331 13.7279 17.0781C13.6256 17.0223 13.5108 16.9591 13.3969 16.8994C13.2825 16.8394 13.1717 16.7832 13.0785 16.7402C12.9781 16.6938 12.9199 16.6738 12.9008 16.6699C12.8703 16.6637 12.8494 16.663 12.7924 16.6718L12.7914 16.6728C12.7877 16.6738 12.7495 16.6833 12.6703 16.707C12.5956 16.7293 12.5014 16.7581 12.4086 16.788C12.3157 16.818 12.225 16.8487 12.1556 16.873C12.1288 16.8824 12.106 16.8897 12.0883 16.8964C12.0782 16.911 12.0661 16.9305 12.0511 16.955C12.0355 16.9806 12.0144 17.0151 11.9955 17.0449C11.9767 17.0743 11.9524 17.1118 11.9242 17.1445C11.6809 17.427 11.3644 17.7256 10.9984 17.9413C10.6319 18.1574 10.1999 18.2988 9.73767 18.2363C9.65028 18.2244 9.56159 18.192 9.48865 18.1259C9.41448 18.0586 9.37609 17.974 9.36072 17.8945C9.33305 17.7506 9.37404 17.6008 9.41345 17.4921C9.49659 17.2631 9.65043 17.0227 9.70154 16.9394C9.99457 16.4619 10.5197 15.7198 10.8969 15.2958C11.072 15.0989 11.3126 14.9927 11.5355 14.9286C11.759 14.8644 11.998 14.8337 12.183 14.8066Z" fill="${activeFlag?'var(--pc)':'#BBBBBB'}" stroke="#D9D9D9" stroke-width="0.5"/>
            <path d="M6.94096 13.1991L8.91806 14.2752L5.63162 19.9138L3.65453 18.8377L6.94096 13.1991Z" fill="${activeFlag?'var(--pc)':'#BBBBBB'}" stroke="#D9D9D9" stroke-width="0.5"/>
            <path d="M19.2949 13.1988L22.5799 18.837L20.6026 19.9128L17.3176 14.2745L19.2949 13.1988Z" fill="${activeFlag?'var(--pc)':'#BBBBBB'}" stroke="#D9D9D9" stroke-width="0.5"/>
            <path d="M9.49194 20.0135C9.8101 20.0122 10.0843 20.1929 10.2458 20.4227C10.4076 20.653 10.4845 20.9763 10.3367 21.2752L10.324 21.3036L10.3035 21.326C10.1096 21.5549 9.93005 21.8157 9.73999 22.0877C9.59984 22.2884 9.45407 22.4951 9.29858 22.6893L9.1394 22.8788C9.10495 22.9177 9.05642 22.9726 9.00171 23.0233C8.96132 23.0607 8.91014 23.103 8.84937 23.1375L8.78589 23.1688C8.42847 23.3182 8.06968 23.1693 7.85034 22.9452C7.63212 22.7221 7.49091 22.3627 7.6355 22.0135L7.65015 21.9764L7.67554 21.9471C7.87647 21.7109 8.07062 21.4166 8.28198 21.1073C8.48745 20.8066 8.70984 20.492 8.95386 20.2469V20.2459C9.07146 20.1276 9.20588 20.0467 9.38159 20.0223L9.39136 20.0135H9.49194Z" fill="${activeFlag?'var(--pc)':'#BBBBBB'}" stroke="#D9D9D9" stroke-width="0.5"/>
            <path d="M10.5092 21.2422C10.8293 21.2241 11.1123 21.3974 11.2836 21.6211C11.4551 21.845 11.549 22.1676 11.4154 22.4736L11.4037 22.5L11.3871 22.5224L10.3627 23.8945L10.3383 23.9258L10.307 23.9492C9.94221 24.2081 9.5239 24.1117 9.25525 23.8896C8.99178 23.6717 8.81485 23.2838 8.97302 22.8955C8.99104 22.8514 9.02111 22.8008 9.04822 22.7578C9.07842 22.7099 9.11639 22.6534 9.15857 22.5927C9.24311 22.4712 9.35 22.325 9.45837 22.1806C9.6714 21.8968 9.90508 21.6004 9.99548 21.5029C10.1141 21.3749 10.2731 21.2565 10.5082 21.2431L10.5092 21.2422Z" fill="${activeFlag?'var(--pc)':'#BBBBBB'}" stroke="#D9D9D9" stroke-width="0.5"/>
            <path d="M11.2263 22.589C11.5711 22.3459 11.9858 22.469 12.2399 22.6876C12.4966 22.9083 12.6796 23.2977 12.5202 23.6905L12.4831 23.7686C12.4582 23.8159 12.4031 23.8932 12.3503 23.9649C12.2918 24.0444 12.2195 24.1404 12.1462 24.2345C12.0729 24.3285 11.9973 24.4226 11.9343 24.4991L11.778 24.6759C11.4247 25.0023 10.9704 24.9024 10.6911 24.671C10.4133 24.4406 10.2272 24.0173 10.4343 23.5997C10.4487 23.5706 10.4722 23.535 10.4899 23.5089C10.5112 23.4776 10.5381 23.4392 10.5681 23.3976C10.6284 23.3137 10.7044 23.2107 10.7809 23.1095C10.8507 23.0172 10.9218 22.9252 10.9821 22.8487L10.9538 22.8214L11.1589 22.6427L11.2263 22.589Z" fill="${activeFlag?'var(--pc)':'#BBBBBB'}" stroke="#D9D9D9" stroke-width="0.5"/>
            <path d="M7.24225 19.9529C7.57443 19.7862 7.92463 19.8819 8.16217 20.074C8.39703 20.264 8.56436 20.5804 8.50983 20.9217V20.9227C8.50055 20.9798 8.47583 21.0329 8.45807 21.0692C8.43776 21.1106 8.41311 21.1552 8.3858 21.199C8.33089 21.2872 8.26 21.3862 8.18756 21.4803C8.11509 21.5744 8.0374 21.6682 7.96588 21.744C7.93033 21.7816 7.89354 21.8171 7.85846 21.8475C7.82774 21.874 7.78175 21.9109 7.72858 21.9344C7.43296 22.0645 7.10918 21.9973 6.87701 21.824H6.86627L6.79401 21.7547C6.69939 21.6642 6.62009 21.543 6.56744 21.4188C6.51549 21.2961 6.4789 21.1457 6.49518 20.9979L6.51373 20.9139C6.52186 20.888 6.53066 20.8641 6.53912 20.8445C6.55803 20.8008 6.58256 20.7544 6.60846 20.7088C6.66039 20.6174 6.72749 20.5158 6.79694 20.4197C6.86647 20.3235 6.94175 20.2283 7.01178 20.1502C7.04665 20.1113 7.08254 20.0744 7.11725 20.0428C7.14873 20.0141 7.19233 19.977 7.24225 19.952V19.9529Z" fill="${activeFlag?'var(--pc)':'#BBBBBB'}" stroke="#D9D9D9" stroke-width="0.5"/>
        </svg>`,
        `<svg xmlns="http://www.w3.org/2000/svg" width="25" height="23" viewBox="0 0 25 23" fill="none">
            <path d="M14.1594 6.59285C16.1729 6.80391 17.9583 8.22954 18.7254 10.0817C19.3195 11.5156 19.3015 13.17 18.6872 14.5936C18.5808 14.8404 18.42 15.0739 18.3313 15.3214L19.1558 16.1546C19.4602 16.178 19.6393 16.1351 19.895 16.3317L23.8081 20.2814C24.9499 21.95 22.8072 24.0531 21.0277 22.3966C19.7842 21.2391 18.6606 19.9438 17.4257 18.7715C17.2551 18.5788 17.2418 18.3376 17.279 18.0922L16.392 17.2347C15.7021 17.619 14.9536 17.919 14.16 18.0032C14.1452 18.3656 14.1969 18.7425 14.1165 19.0975C13.985 19.6787 13.4582 20.1395 12.8703 20.216L1.34494 20.2208C0.578471 20.1288 0.0564578 19.5548 0 18.7872V1.46288C0.0177354 0.725379 0.549503 0.0975449 1.28552 0H12.8747C13.5623 0.0910419 14.0754 0.633746 14.1558 1.32011L14.1594 6.59285ZM13.2138 6.53374V1.31656C13.2138 1.18088 12.9628 0.9586 12.8239 0.937909L1.46288 0.916331C1.23498 0.930519 1.04787 1.0662 0.966581 1.27725L0.969242 18.9406C1.07447 19.1894 1.25981 19.2817 1.522 19.3041H12.6383C13.4009 19.2385 13.186 18.6198 13.2138 18.0615C9.74828 17.9447 7.15211 14.8209 7.69452 11.3752C8.11781 8.6877 10.4816 6.5831 13.2135 6.53374H13.2138ZM13.0893 7.45864C9.31613 7.69866 7.24256 12.0234 9.46511 15.115C11.4819 17.9208 15.7186 17.7644 17.5235 14.8191C19.5681 11.4828 16.9696 7.21182 13.0893 7.45864ZM18.1989 17.076C18.2879 16.987 18.3692 16.8578 18.4747 16.776L17.7765 16.0834L17.1753 16.6577L17.8735 17.3503C17.8945 17.3538 18.1608 17.1144 18.1989 17.076ZM19.4502 17.175L18.269 18.3127L18.8152 18.859L19.9509 17.7174C19.9636 17.6471 19.4617 17.2983 19.4502 17.1747V17.175ZM20.7111 18.4564C20.6842 18.4324 20.6514 18.4118 20.6177 18.3984L20.553 18.4251L19.4806 19.5241L21.8474 21.887C22.6866 22.5252 23.6274 21.4617 22.9494 20.6964C22.1631 20.0221 21.4761 19.1383 20.7109 18.4567L20.7111 18.4564Z" fill="${activeFlag?'var(--pc)':'#BBBBBB'}"/>
            <path d="M2.97787 1.51489H11.1829C11.339 1.57785 11.472 1.70614 11.4968 1.88083C11.5704 2.399 11.4528 3.08004 11.4927 3.61536C11.4276 3.79922 11.2727 3.94494 11.0708 3.96209L3.03788 3.95499C2.88121 3.92869 2.7216 3.78562 2.6814 3.63162C2.62671 3.42086 2.62996 2.1581 2.66366 1.91039C2.68908 1.72447 2.80288 1.58081 2.97758 1.51489H2.97787ZM10.5831 2.42502H3.62197L3.57763 2.46935V2.91274C3.57763 2.95265 3.58383 3.02063 3.62197 3.04576H10.5388L10.5831 3.00142V2.42502Z" fill="${activeFlag?'var(--pc)':'#BBBBBB'}"/>
            <path d="M2.09105 5.56448L10.8934 5.55827C11.4335 5.66735 11.4042 6.38238 10.8648 6.4752L2.20308 6.4746C1.70885 6.42169 1.62254 5.7445 2.09105 5.56448Z" fill="${activeFlag?'var(--pc)':'#BBBBBB'}"/>
            <path d="M2.09102 16.5309L8.52928 16.5241C9.06342 16.6338 9.00489 17.3837 8.46957 17.4413L2.20217 17.4419C1.70705 17.355 1.61897 16.7319 2.09073 16.5312L2.09102 16.5309Z" fill="${activeFlag?'var(--pc)':'#BBBBBB'}"/>
            <path d="M2.12122 7.75245L7.9677 7.74506C8.50331 7.85738 8.47612 8.58749 7.93755 8.66227H2.2031C1.67724 8.58394 1.62344 7.93069 2.12122 7.75274V7.75245Z" fill="${activeFlag?'var(--pc)':'#BBBBBB'}"/>
            <path d="M2.21062 14.3154L6.90016 14.3104C7.49223 14.4056 7.47065 15.1866 6.87326 15.2539L2.2053 15.2513C1.64131 15.1594 1.63096 14.4009 2.21032 14.3157L2.21062 14.3154Z" fill="${activeFlag?'var(--pc)':'#BBBBBB'}"/>
            <path d="M1.90244 10.7211C1.63404 10.4432 1.81997 9.96259 2.20276 9.93274H6.87309C7.40575 9.99363 7.41787 10.7548 6.90324 10.85L2.14216 10.8505C2.08275 10.8429 1.94116 10.7616 1.90214 10.7211H1.90244Z" fill="${activeFlag?'var(--pc)':'#BBBBBB'}"/>
            <path d="M2.1811 12.1281L6.51593 12.1231C7.10534 12.293 7.02967 13.0084 6.39977 13.066C5.09444 13.1848 3.6156 12.9785 2.29194 13.066C1.67859 13.0542 1.5846 12.2608 2.1808 12.1284L2.1811 12.1281Z" fill="${activeFlag?'var(--pc)':'#BBBBBB'}"/>
            <path d="M16.248 9.38176C18.0384 11.1393 17.8188 14.1292 15.7821 15.5903C12.8067 17.7251 8.76008 15.178 9.37905 11.5815C9.92973 8.38059 13.9199 7.09655 16.248 9.38176ZM13.0006 9.17307C11.8475 9.28392 10.7671 10.1961 10.4142 11.2865C9.5366 13.9965 12.3574 16.4011 14.8753 15.0677C17.8734 13.4798 16.5471 8.83196 13.0006 9.17307Z" fill="${activeFlag?'var(--pc)':'#BBBBBB'}"/>
            <path d="M13.7858 13.0766C13.4267 13.4278 13.0105 14.1644 12.4595 13.7172C12.2393 13.5384 11.5529 12.8665 11.3986 12.6498C11.108 12.2425 11.432 11.7542 11.9147 11.8972C12.1184 11.9578 12.753 12.7406 12.8151 12.7406L14.7367 10.8198C15.2227 10.5074 15.7258 11.0111 15.3849 11.4976C14.8671 12.0391 14.3214 12.5529 13.7861 13.0763L13.7858 13.0766Z" fill="${activeFlag?'var(--pc)':'#BBBBBB'}"/>
        </svg>`,
        `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="18" viewBox="0 0 24 18" fill="none"><path d="M4.125 0C3.03098 0 1.98177 0.434597 1.20818 1.20818C0.434597 1.98177 0 3.03098 0 4.125V6H24V4.125C24 3.03098 23.5654 1.98177 22.7918 1.20818C22.0182 0.434597 20.969 0 19.875 0H4.125ZM24 7.5H0V13.875C0 14.969 0.434597 16.0182 1.20818 16.7918C1.98177 17.5654 3.03098 18 4.125 18H19.875C20.969 18 22.0182 17.5654 22.7918 16.7918C23.5654 16.0182 24 14.969 24 13.875V7.5ZM17.25 13.5H20.25C20.4489 13.5 20.6397 13.579 20.7803 13.7197C20.921 13.8603 21 14.0511 21 14.25C21 14.4489 20.921 14.6397 20.7803 14.7803C20.6397 14.921 20.4489 15 20.25 15H17.25C17.0511 15 16.8603 14.921 16.7197 14.7803C16.579 14.6397 16.5 14.4489 16.5 14.25C16.5 14.0511 16.579 13.8603 16.7197 13.7197C16.8603 13.579 17.0511 13.5 17.25 13.5Z" fill="${activeFlag?'var(--pc)':'#BBBBBB'}"/></svg>`,
        `<svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42" fill="none">
            <circle cx="21" cy="21" r="21" fill="var(--pc)" style="&#10;    color: #0ee;&#10;"/>
            <path d="M11 21L18 28L32 14" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`
    ];
    return iconArray[index];  
}

function setSteps(step){
    var sectionLength = $(".step").length;
    $("body .content .step:nth-child("+(step)+")").siblings().removeClass("active-step");
    $("body .content .step:nth-child("+(step)+")").addClass("active-step");
    if(step > sectionLength || step < 1){
        console.log("Invalid Step")
    }
    if ( step === 1) {
        $('.steps ul li:first-child a .icon-circle').html(`<div class="icon-div"></div><span class="icon">${getIcon(0,true)}</span>`);
        $('.actions > ul > li:first-child').attr('style', 'opacity:0');
        $(".step1, .step2, .step3, .step4").removeClass("done-step-other-roles");
        $("#step1_li").addClass("current");
        $("#step2_li, #step3_li, #step4_li").removeClass('completed current');
    } else {
        $('.steps ul li:first-child a .icon-circle').html(`<div class="icon-div"></div><span class="icon">${getIcon(0,true)}</span>`);
        $('.steps ul li:nth-child(2) a .icon-circle').html(`<div class="icon-div"></div><span class="icon">${getIcon(1,false)}</span>`);
        $('.steps ul li:nth-child(3) a .icon-circle').html(`<div class="icon-div"></div><span class="icon">${getIcon(2,false)}</span>`);
        $('.steps ul li:nth-child(4) a .icon-circle').html(`<div class="icon-div"></div><span class="icon">${getIcon(3,false)}</span>`);
        $('.actions > ul > li:first-child').attr('style', 'opacity:0');
        $(".step1, .step2, .step3").removeClass("done-step-other-roles");
        $("#step1_li").addClass("current");
        $("#step2_li, #step3_li").removeClass('completed current');
    }
    if (step === 2) {
        $('.steps ul li:first-child a .icon-circle').html(`<div class="icon-div"></div><span class="icon">${getIcon(4,true)}</span>`);
        $('.steps ul li:nth-child(2) a .icon-circle').html(`<div class="icon-div"></div><span class="icon">${getIcon(1,true)}</span>`);
        $('.steps ul li:nth-child(3) a .icon-circle').html(`<div class="icon-div"></div><span class="icon">${getIcon(2,false)}</span>`);
        $('.steps ul li:nth-child(4) a .icon-circle').html(`<div class="icon-div"></div><span class="icon">${getIcon(3,false)}</span>`);
        $('.actions > ul > li:first-child').attr('style', 'opacity:1');
        $("#step1_li, #step3_li, #step4_li").removeClass('completed current');
        $("#step1_li").addClass('completed').removeClass('current');
        $("#step2_li").addClass('current');
        $(".step1").addClass("done-step-other-roles");
        $(".step3").removeClass("done-step-other-roles");
    } else {
        $('.steps ul li:nth-child(2) a .icon-circle').html(`<div class="icon-div"></div><span class="icon">${getIcon(1,false)}</span>`);
    }
    if (step === 3) {
        $('.steps ul li:first-child a .icon-circle').html(`<div class="icon-div"></div><span class="icon">${getIcon(4,true)}</span>`);
        $('.steps ul li:nth-child(2) a .icon-circle').html(`<div class="icon-div"></div><span class="icon">${getIcon(4,true)}</span>`);
        $('.steps ul li:nth-child(3) a .icon-circle').html(`<div class="icon-div"></div><span class="icon">${getIcon(2,true)}</span>`);
        $('.steps ul li:nth-child(4) a .icon-circle').html(`<div class="icon-div"></div><span class="icon">${getIcon(3,false)}</span>`);
        $('.actions > ul > li:first-child').attr('style', 'opacity:1');
        $("#step1_li, #step2_li, #step4_li").removeClass('completed current');
        $("#step1_li, #step2_li").addClass('completed').removeClass('current');
        $("#step3_li").addClass('current');
        $(".step1, .step2").addClass("done-step-other-roles");
        $(".step3").removeClass("done-step-other-roles");
    } else {
        $('.steps ul li:nth-child(3) a .icon-circle').html(`<div class="icon-div"></div><span class="icon">${getIcon(2,false)}</span>`);
    }
    if ( sectionLength == step) {
        $('.steps ul li:first-child a .icon-circle').html(`<div class="icon-div"></div><span class="icon">${getIcon(4,true)}</span>`);
        $('.steps ul li:nth-child(2) a .icon-circle').html(`<div class="icon-div"></div><span class="icon">${getIcon(4,true)}</span>`);
        $('.steps ul li:nth-child(3) a .icon-circle').html(`<div class="icon-div"></div><span class="icon">${getIcon(4, true)}</span>`);
        $('.steps ul li:nth-child(4) a .icon-circle').html(`<div class="icon-div"></div><span class="icon">${getIcon(3, true)}</span>`);
        $('.actions > ul > li:first-child').attr('style', 'opacity:1');
        $("#step1_li, #step2_li").addClass('completed').removeClass('current');
        $("#step4_li").addClass('current');
        $('.actions > ul > li:first-child').attr('style', 'opacity:1');
        $(".step1, .step2, .step3").addClass("done-step-other-roles");
        $(".next-btn").hide();
        $(".prev-btn").hide();
        $(".finish-btn").show();
        $(".finish-btn").css("margin-left", "auto");
    } else {
        $(".next-btn").show();
        $(".finish-btn").hide();
        $('.steps ul li:nth-child(4) a .icon-circle').html(`<div class="icon-div"></div><span class="icon">${getIcon(3,false)}</span>`);
    }
}

function showSkeleton(isShow, skeletonType){
    if(isShow && skeletonType == "step1"){
        $(".step-1-skeleton").html(step1Skeleton()).show();
        $("#otherRolesStage1").hide();
    }else if(isShow && skeletonType == "step2"){
        $(".step-2-skeleton").html(step2Skeleton()).show();
        $("#otherRolesStage2").hide();
    }else if(isShow && skeletonType == "step3"){
        $(".step-3-skeleton").html(step3Skeleton()).show();
        $("#otherRolesStage3").hide();
    }else if(isShow && skeletonType == "step4"){
        $(".step-4-skeleton").html(step4Skeleton()).show();
        $("#otherRolesStage4").hide();
    }
}

function updateOtherRolesFieldState(fieldWrapper){
    var wrapper = $(fieldWrapper);
    if(wrapper.length < 1){
        return;
    }
    var field;
    if(wrapper.hasClass("phone-icon-field")){
        // intl-tel-input wraps the input in .iti and may add its own extra
        // (search) inputs, so .first() could grab the wrong one and read it as
        // empty. Target the REAL phone input explicitly.
        field = wrapper.find("input[type='tel'], input.other-roles-verify-control").first();
    } else {
        field = wrapper.find("input, select, textarea").first();
    }
    if(field.length < 1){
        return;
    }
    var value = field.val();
    if($.isArray(value)){
        value = value.join("");
    }
    value = value == null || value == undefined ? "" : value.toString().trim();
    wrapper.toggleClass("field-filled", value !== "" && value !== "0");
}

function initializeOtherRolesFloatingLabels(stage){
    stage.find(".icon-field").each(function(){
        var wrapper = $(this);
        if(wrapper.find(".floating-label").length){
            return;
        }

        var field = wrapper.find("input, select, textarea").first();
        if(field.length < 1){
            return;
        }

        var labelText = field.attr("data-floating-label") || field.attr("placeholder");
        if((labelText == null || labelText == undefined || labelText.trim() === "") && field.is("select")){
            labelText = field.find("option:first").text();
        }
        if(labelText == null || labelText == undefined || labelText.trim() === ""){
            return;
        }

        wrapper.append('<span class="floating-label">' + labelText + '</span>');
        if(field.is("input, textarea")){
            field.attr("placeholder", "");
        }else if(field.is("select")){
            // Blank the placeholder option's display text so it doesn't duplicate the
            // floating label in the closed select. Only the empty-value placeholder option
            // is cleared; its value stays "" so validation/behaviour is unchanged.
            var placeholderOption = field.find("option").filter(function(){
                return $(this).attr("value") === "" || $(this).val() === "";
            }).first();
            if(placeholderOption.length && placeholderOption.text().trim() !== ""){
                placeholderOption.data("floatingPlaceholderText", placeholderOption.text()).text("");
            }
        }
    });
}

function initializeOtherRolesStage4FloatingLabels(stage){
    stage.find(".form-group").each(function(){
        var group = $(this);
        var label = group.children("label").first();
        var wrapper = group.find(".icon-field").first();
        if(label.length < 1 || wrapper.length < 1 || wrapper.find(".floating-label").length){
            return;
        }
        var labelText = label.text().replace(/\s+/g, " ").trim();
        if(labelText === ""){
            return;
        }
        wrapper.append('<span class="floating-label">' + labelText + '</span>');
        label.addClass("floating-source-hidden");

        // Blank the placeholder option's display text so the closed select doesn't
        // duplicate the floating label. Value stays "" so validation is unchanged.
        var field = wrapper.find("select").first();
        if(field.length){
            var placeholderOption = field.find("option").filter(function(){
                return $(this).attr("value") === "" || $(this).val() === "";
            }).first();
            if(placeholderOption.length && placeholderOption.text().trim() !== ""){
                placeholderOption.data("floatingPlaceholderText", placeholderOption.text()).text("");
            }
        }
    });
}

function syncOtherRolesDropdownWidth(select){
    return;
}

function initializeOtherRolesStage3Interactions(){
    var stage = $("#otherRolesStage3");
    if(stage.length < 1){
        return;
    }

    initializeOtherRolesFloatingLabels(stage);

    stage.find(".icon-field").each(function(){
        updateOtherRolesFieldState(this);
    });

    stage.find(".icon-field input, .icon-field textarea").off(".otherRolesVerifyFieldState");
    stage.find(".icon-field input, .icon-field textarea").on("focus.otherRolesVerifyFieldState", function(){
        $(this).closest(".icon-field").addClass("field-active");
    }).on("blur.otherRolesVerifyFieldState", function(){
        var wrapper = $(this).closest(".icon-field");
        wrapper.removeClass("field-active");
        updateOtherRolesFieldState(wrapper);
    }).on("input.otherRolesVerifyFieldState", function(){
        updateOtherRolesFieldState($(this).closest(".icon-field"));
    });

    setTimeout(function(){
        stage.find(".icon-field").each(function(){
            updateOtherRolesFieldState(this);
        });
    }, 300);
}

function initializeOtherRolesStage1Interactions(){
    var stage = $("#otherRolesStage1");
    if(stage.length < 1){
        return;
    }

    initializeOtherRolesFloatingLabels(stage);

    stage.find(".icon-field").each(function(){
        updateOtherRolesFieldState(this);
    });

    stage.find(".icon-field input, .icon-field textarea").off(".otherRolesFieldState");
    stage.find(".icon-field input, .icon-field textarea").on("focus.otherRolesFieldState", function(){
        $(this).closest(".icon-field").addClass("field-active");
    }).on("blur.otherRolesFieldState", function(){
        var wrapper = $(this).closest(".icon-field");
        wrapper.removeClass("field-active");
        updateOtherRolesFieldState(wrapper);
    }).on("input.otherRolesFieldState", function(){
        updateOtherRolesFieldState($(this).closest(".icon-field"));
    });

    stage.find("select.select_dropdown").each(function(){
        var select = $(this);
        if(select.hasClass("select2-hidden-accessible")){
            select.select2("destroy");
        }
        select.select2({
            minimumResultsForSearch: 5,
            width: "100%",
            dropdownAutoWidth: false,
            // Blank placeholder so the closed select2 doesn't duplicate the floating label.
            placeholder: ""
        });

        var wrapper = select.closest(".icon-field");
        updateOtherRolesFieldState(wrapper);

        select.off(".otherRolesSelectState");
        select.on("select2:open.otherRolesSelectState", function(){
            wrapper.addClass("field-active");
            setTimeout(function(){
                $(".select2-dropdown").addClass("other-roles-select-dropdown");
            }, 0);
        }).on("select2:close.otherRolesSelectState", function(){
            wrapper.removeClass("field-active");
            updateOtherRolesFieldState(wrapper);
        }).on("change.otherRolesSelectState", function(){
            updateOtherRolesFieldState(wrapper);
        });
    });
}

function initializeOtherRolesStage4Interactions(){
    var stage = $("#otherRolesStage4");
    if(stage.length < 1){
        return;
    }

    initializeOtherRolesStage4FloatingLabels(stage);

    stage.find(".icon-field").each(function(){
        updateOtherRolesFieldState(this);
    });

    stage.find(".icon-field input, .icon-field textarea, .icon-field select").off(".otherRolesBankFieldState");
    stage.find(".icon-field input, .icon-field textarea, .icon-field select").on("focus.otherRolesBankFieldState", function(){
        $(this).closest(".icon-field").addClass("field-active");
    }).on("blur.otherRolesBankFieldState", function(){
        var wrapper = $(this).closest(".icon-field");
        wrapper.removeClass("field-active");
        updateOtherRolesFieldState(wrapper);
    }).on("input.otherRolesBankFieldState change.otherRolesBankFieldState", function(){
        updateOtherRolesFieldState($(this).closest(".icon-field"));
    });

    stage.find("select.select_dropdown, #accountCurrency, #accountCategory").each(function(){
        var select = $(this);
        if(select.hasClass("select2-hidden-accessible")){
            select.select2("destroy");
        }
        select.select2({
            // Show the search box only for longer lists (country/state/city) and hide it
            // for short dropdowns. Infinity previously disabled search on every select2.
            minimumResultsForSearch: 5,
            width: "100%",
            dropdownAutoWidth: false,
            // Blank placeholder so the closed select2 doesn't duplicate the floating label.
            placeholder: ""
        });

        var wrapper = select.closest(".icon-field");
        updateOtherRolesFieldState(wrapper);

        select.off(".otherRolesBankSelectState");
        select.on("select2:open.otherRolesBankSelectState", function(){
            wrapper.addClass("field-active");
            setTimeout(function(){
                $(".select2-dropdown").addClass("other-roles-select-dropdown");
            }, 0);
        }).on("select2:close.otherRolesBankSelectState", function(){
            wrapper.removeClass("field-active");
            updateOtherRolesFieldState(wrapper);
        }).on("change.otherRolesBankSelectState", function(){
            updateOtherRolesFieldState(wrapper);
        });
    });

    setTimeout(function(){
        stage.find(".icon-field").each(function(){
            updateOtherRolesFieldState(this);
        });
    }, 500);
}

function getOtherRolesStage1Data(){
    $("#otherRolesContentStage1").html(getOtherRolesProfessionalDetailsContent());
    initializeOtherRolesStage1Interactions();
    $(".prev-btn").hide();
    $(".next-btn a").text("Next");
    $(".next-btn").addClass("ml-auto");
    $(".step-1-skeleton").hide();
    $("#otherRolesStage1").show();
}

function getOtherRolesStage2Data(data){
    $("#otherRolesContentStage2").html(getContractDetailsContent(data));
    callLocationDetails("otherRolesStage2");
    $(".prev-btn").hide();
    $(".next-btn a").text("Accept Contract");
    $(".next-btn").addClass("ml-auto");
    $(".step-2-skeleton").hide();
    $("#otherRolesStage2").show();
}

async function moveStep(moveType){
    var sectionLength = $(".step").length;
    var currentStep = $(".step.active-step").index()+1;
    var isBackButtonClicked=false;
    if(moveType == "prev"){
        if(currentStep > 1){
            var prevStep = currentStep-1;
        }else{
            var prevStep = currentStep;
        }
    }else{
        var prevStep = currentStep;
    }
    if(sectionLength == currentStep){
        var nextStep = currentStep;
    }else{
        var nextStep = currentStep+1;
    }
    if(currentStep>nextStep){
        isBackButtonClicked=true;
    }
    if(isReload){
        if(currentStep>nextStep){
            isBackButtonClicked=true;
        }
        if(currentStep==0 && nextStep==3 ){
            isBackButtonClicked=true;
        }
        isReload=false;
    }
    if(moveType == "next"){
        if(currentStep == 1){
            var professionalDetailsSaved = await saveOtherRolesProfessionalDetails("otherRolesStage1");
            if (professionalDetailsSaved) {
                $("#inReviewForOtherRolesProfessionalDetailsModal").remove();
                $("body").append(inReviewForOtherRolesProfessionalDetailsModal());
                $('#inReviewForOtherRolesProfessionalDetailsModal').modal({backdrop: 'static', keyboard: false});
            }
            return false;
        }
        else if(currentStep == 2) {
            if (!validateOtherRolesAgreement()) {
                return false;
            }
            var serverCheck = await acceptOtherRolesContract();
            if (serverCheck) {
                return true;
            } else {
                return false;
            }
        }
        else if(currentStep == 3){
            if(verificationValidationOnSave("otherRolesStage3")){
                $("body").append(submitVerificationModal());
                $('#submitVerificationModal').modal({backdrop: 'static', keyboard: false});
            }
            return false;
        }
    }
    if(moveType == "next"){
        $("body .content .step:nth-child("+(nextStep)+")").addClass("active-step");
        $("body .content .step:nth-child("+(currentStep)+")").removeClass("active-step");
        
        if(nextStep > 1 ){
            $(".prev-btn").css({"visibility":"visible", "opacity":"1"});    
        }else{
            $(".prev-btn").css({"visibility":"hidden", "opacity":"0"});
        } 
        if(nextStep == sectionLength){
            $(".next-btn").hide();
            $(".finish-btn").show(); 
        }
    }
    else if(moveType == "prev"){
        setSteps(prevStep);
        $("body .content .step:nth-child("+(prevStep)+")").addClass("active-step"); 
        $("body .content .step:nth-child("+(currentStep)+")").removeClass("active-step");
        
        if(prevStep == 1 ){
            $(".prev-btn").css({"visibility":"hidden", "opacity":"0"});
        }
        else{
            $(".prev-btn").css({"visibility":"visible", "opacity":"1"});    
        } 
        if(nextStep == sectionLength){
            $(".next-btn").show();
            $(".finish-btn").hide(); 
            $(".prev-btn").hide(); 
        }
    }
    if(moveType == "finish"){
        var serverCheck= await callForOtherRolesBankDetails("otherRolesStage4");
        if(serverCheck){
            return true;
        } else {
            return false;
        }
    }
}

function validateOtherRolesProfessionalDetails(formId){
    if ($("#" + formId + " #highestQualificationId").val() == "") {
        showMessageTheme2(2, "Please select highest education degree.");
        return false;
    }
    if ($("#" + formId + " #otherSubjectSpecialization").val().trim() == "") {
        showMessageTheme2(2, "Degree specialization can't be blank.");
        return false;
    }
    if ($("#" + formId + " #totalExperianceFromYYYY").val() == "") {
        showMessageTheme2(2, "Please select experience in years.");
        return false;
    }
    if ($("#" + formId + " #lastOrganizationName").val().trim() == "") {
        showMessageTheme2(2, "Last organization name can't be blank.");
        return false;
    }
    if ($("#" + formId + " #lastJobDesc").val().trim() == "") {
        showMessageTheme2(2, "Please enter why we should hire you.");
        return false;
    }
    if (
        $("#" + formId + " #fileupload2Span").html().trim() === "" ||
        $("#" + formId + " #fileupload2Span").html().trim() === "Upload Highest degree"
    ) {
        showMessageTheme2(2, "Please upload highest degree.");
        return false;
    }
    if (
        $("#" + formId + " #fileupload1Span").html().trim() === "" ||
        $("#" + formId + " #fileupload1Span").html().trim() === "Upload CV"
    ) {
        showMessageTheme2(2, "Please upload updated CV.");
        return false;
    }
    if (
        $("#" + formId + " #fileupload4Span").html().trim() === "" ||
        $("#" + formId + " #fileupload4Span").html().trim() === "Upload Passport/National ID"
    ) {
        showMessageTheme2(2, "Please upload passport/national id.");
        return false;
    }
    if (
        $("#" + formId + " #fileupload11Span").html().trim() === "" ||
        $("#" + formId + " #fileupload11Span").html().trim() === "Upload Internet Speed Test Screenshot*"
    ) {
        showMessageTheme2(2, "Please upload internet speed test screenshot.");
        return false;
    }
    if (!$("#" + formId + " #declConfirmation").is(":checked")) {
        showMessageTheme2(2, "Please accept the declaration to continue.");
        return false;
    }
    return true;
}

function getRequestForOtherRolesProfessionalDetails(formId){
    var raw = {};
    var authentication = {};
    var onboardingAcademicProfessionalDetailsDTO = {};

    onboardingAcademicProfessionalDetailsDTO["entityId"] = ENTITY_ID;
    onboardingAcademicProfessionalDetailsDTO["entityType"] = ENTITY_TYPE;
    onboardingAcademicProfessionalDetailsDTO["highestQualificationId"] = $("#" + formId + " #highestQualificationId").val();
    onboardingAcademicProfessionalDetailsDTO["totalExperianceFromYYYY"] = parseInt($("#" + formId + " #totalExperianceFromYYYY").val(), 10);
    onboardingAcademicProfessionalDetailsDTO["totalExperianceFromMM"] = 0;
    onboardingAcademicProfessionalDetailsDTO["lastOrganizationName"] = escapeCharacters(toTitleCase($("#" + formId + " #lastOrganizationName").val()));
    onboardingAcademicProfessionalDetailsDTO["educationSpecialization"] = escapeCharacters(toTitleCase($("#" + formId + " #otherSubjectSpecialization").val()));
    onboardingAcademicProfessionalDetailsDTO["lastJobDesc"] = escapeCharacters(toSentenceCase($("#" + formId + " #lastJobDesc").val()));
    onboardingAcademicProfessionalDetailsDTO["declConfirmation"] = $("#" + formId + " #declConfirmation").is(":checked") ? "Y" : "N";
    onboardingAcademicProfessionalDetailsDTO["attachments"] = professionalUploadDocsObj;

    authentication["hash"] = "";
    authentication["schoolId"] = SCHOOL_ID;
    authentication["schoolUUID"] = SCHOOL_UUID;
    authentication["userType"] = "TEACHER";
    authentication["userId"] = USER_ID;

    raw["authentication"] = authentication;
    raw["data"] = onboardingAcademicProfessionalDetailsDTO;

    return raw;
}

async function saveOtherRolesProfessionalDetails(formId){
    if(!validateOtherRolesProfessionalDetails(formId)){
        return false;
    }
    var payload = getRequestForOtherRolesProfessionalDetails(formId);
    var ajaxReqDetails = {
        method: "POST",
        url: APP_BASE_URL + SCHOOL_UUID + "/onboarding/save-academic-professional-details",
        body: payload,
        global: true,
        showMessage: false,
        onFaildResolved: true,
        onSuccessResolved: true
    };
    var responseData = await callCommonAjax(ajaxReqDetails);
    if(
        responseData.status == "SUCCESS" ||
        responseData.statusCode == "SUCCESS" ||
        responseData.status == 1
    ){
        return true;
    }
    showMessageTheme2(0, responseData.message || "Unable to save professional details.");
    return false;
}

function validateOtherRolesAgreement() {
    if($("#rightSignatureBox").html().includes('<br>') && $("#recipientSignatureUpload").val() === ''){
        showMessageTheme2(0, "Please upload your signature");
        return false;
    }
    if(!$("#b2bContractAcceptanceCheckbox").is(":checked")){
        showMessageTheme2(0, "Please confirm that you have read and agree to the Terms.");
        return false;
    }

    return true;
}

async function acceptOtherRolesContract(){
    var updatedCommentData = $("#editorData").html();
    var entityType = $("#entityType").val(); 
    var payload = {
        contractId: parseInt($("#contractId").val()),
        entityId: parseInt($("#entityId").val()),
        entityType: entityType,
        location: $("#otherRolesStage1 #location").val(),
        additionalDetails: fillBrowserDetail(),
        actionType: "A", 
        sessionUserId: USER_ID,
        commentData: updatedCommentData
    }

    var ajaxReqDetails = {
        method: "POST",
        url: APP_BASE_URL + SCHOOL_UUID + "/save-partner-contract-details",
        body: payload,
        global: true,
        showMessage: false,
        onFaildResolved: true,
        onSuccessResolved: true
    }

    var responseData = await callCommonAjax(ajaxReqDetails);

    if(responseData.status == 1){
        showMessageTheme2(1, "Agreement accepted successfully");
        $("body").append(contractThankyouForOtherRolesModal());
        $('#contractThankyouForOtherRolesModal').modal({
            backdrop: 'static',
            keyboard: false
        });

        return true;
    } else {
        showMessageTheme2(0, responseData.message);
        return false;
    }
}


function otherRolesStage3OnLoadEvent(data){
    initializeOtherRolesStage3Interactions();
	$('#socialMediaCheckbox').on('change', function () {
		const isChecked = $(this).is(':checked');
		const fields = [
			{ input: '#linkedinProfileUrl', sup: '#linkedinStar' },
			{ input: '#facebookProfileUrl', sup: '#facebookStar' },
			{ input: '#instagramProfileUrl', sup: '#instagramStar' },
			{ input: '#twitterProfileUrl', sup: '#twitterStar' }
		];
		fields.forEach(field => {
			if (isChecked) {
				$(field.input).prop('disabled', true);
				$(field.sup).hide();
			} else {
				$(field.input).prop('disabled', false);
				$(field.sup).show();
			}
		});
	});
	$('#socialMediaCheckbox').trigger('change');

	// Reference phones use the shared helper initPhoneInputV29 (same as every other
	// phone field in the app) instead of the raw window.intlTelInput constructor.
	// This gives national mode, country-wise length capping and caches the instance
	// on the element (intlTelInputInstance) so the save/validation path can read it.
	const phoneIds = ['#reference1Phone', '#reference2Phone'];
	phoneIds.forEach((selector, index) => {
		const input = document.querySelector(selector);
		if (!input) { return; }

		const iti = initPhoneInputV29(input, {
			initialCountry: 'us',
			onCountryChange: function (country) {
				$('#countryData' + (index + 1)).val(country ? country.iso2 : '');
				$('#countryIsd' + (index + 1)).val(country ? country.dialCode : '');
				// v29 shows an example-number placeholder (e.g. "(201) 555-0123")
				// that would overlap our injected floating label. Clear it so only
				// the "Phone Number" floating label shows. Runs on init + change.
				input.setAttribute('placeholder', '');
			} 
		});

		const ref = data.employeeReference ? data.employeeReference[index] : null;
		if (iti && ref && ref.isdCode && ref.isoCode) {
			if (IGNORECOUNTRYARRAY.includes(ref.isoCode.toLowerCase())) {
				ref.isoCode = "US";
			}
			iti.setCountry(ref.isoCode.toLowerCase());
			input.value = ref.number;
			$('#countryData' + (index + 1)).val(ref.isoCode.toLowerCase());
			$('#countryIsd' + (index + 1)).val(ref.isdCode);
		}
		clearContactNumberOnCountryChange(input);

		// OVERLAP FIX (no hiding): when a country dropdown opens we (a) lift the
		// active field's .icon-field above the sibling so its dropdown paints on
		// top, and (b) add a marker class on the stage so CSS drops EVERY phone
		// field's floating label behind the dropdown layer. Nothing is hidden —
		// both fields stay fully visible, labels included.
		input.addEventListener('open:countryselector', function(){
			$('#otherRolesStage3').addClass('iti-dropdown-open');
			phoneIds.forEach(function(sel){
				var field = $(sel).closest('.icon-field');
				if(!field.length){ return; }
				field.css('z-index', sel === selector ? '100050' : '1');
			});
		});
		input.addEventListener('close:countryselector', function(){
			$('#otherRolesStage3').removeClass('iti-dropdown-open');
			phoneIds.forEach(function(sel){
				$(sel).closest('.icon-field').css('z-index', '');
			});
		});

		// FLOATING LABEL STATE: after intl-tel-input wraps the input in .iti, the
		// stage's generic focus/input handlers don't reliably toggle the field
		// state for phones. Bind directly on this input so the label floats up
		// when the field has a value or is focused (field-filled / field-active),
		// and drops back only when empty & blurred.
		var phoneWrapper = $(input).closest('.icon-field');
		var syncPhoneFieldState = function(){
			var v = ($(input).val() || '').toString().trim();
			phoneWrapper.toggleClass('field-filled', v !== '');
		};
		$(input)
			.on('focus.phoneFloat', function(){ phoneWrapper.addClass('field-active'); })
			.on('blur.phoneFloat', function(){ phoneWrapper.removeClass('field-active'); syncPhoneFieldState(); })
			.on('input.phoneFloat keyup.phoneFloat change.phoneFloat', syncPhoneFieldState);
		input.addEventListener('countrychange', syncPhoneFieldState);
		// Initial state (handles the prefilled saved number).
		syncPhoneFieldState();
	});
    setTimeout(function(){
        initializeOtherRolesStage3Interactions();
    }, 300);
}

async function getOtherRolesStage3Data(entityId, entityType){
    $("#contractThankyouForOtherRolesModal").modal("hide");
    setSteps(3);
    showSkeleton(true, 'step3');
    var payload = {
        entityId: parseInt($("#entityId").val()) ? parseInt($("#entityId").val()) : entityId,
		entityType: $("#entityType").val() ? $("#entityType").val() : entityType,
    }
    var ajaxReqDetails = {
        method: "POST",
        url: APP_BASE_URL + SCHOOL_UUID + "/get-verification-details",
        body: payload,
        global: true,
        showMessage: false,
        onFaildResolved: true,
        onSuccessResolved: true
    }
    var responseData = await callCommonAjax(ajaxReqDetails);
    if(responseData.status == 1){
        $("#otherRolesContentStage3").html(getOtherRolesVerificationDetailsContent(responseData.details));
        otherRolesStage3OnLoadEvent(responseData.details)
        $(".prev-btn").hide();
        $(".next-btn a").text("Next");
        $(".next-btn").addClass("ml-auto");
        $(".step-3-skeleton").hide();
        $("#otherRolesStage3").show();
    }else{
        showMessageTheme2(0, responseData.message);
    }
}

function base64ImageFileAsURL(f, fileType, src, uploadType, viewAttachmentEleID, fileExtension, viewAttachmentFlag) {
    var reader = new FileReader();
	var elemId = $(src).attr('elem-id');
    reader.onload = function (e) {
		var binaryData = reader.result.substr(reader.result.indexOf(',') + 1);
        base64URL = e.target.result;
		var acceptFileTypes = /^image\/(png|jpe?g)$/i;
		var acceptFileTypesPDF = /^application\/pdf$/i;
		var uploadFlag = true;
		if(f.type.length && (acceptFileTypes.test(f.type) || acceptFileTypesPDF.test(f.type))) {

		}else {
			showMessageTheme2(false, 'Please upload files in following formats (jpg, jpeg, pdf or png).');
			uploadFlag = false;
			return false;
		} if(f.size > 10276044.8){
			showMessageTheme2(false, MAX_SIZE_LIMIT_FOR_TEACHER);
			uploadFlag = false;
			return false;
		}
		if(uploadFlag){
			var obj = {
				"fileName": f.name,
				"fileType": fileType,
				"fileContent": binaryData
			};
            if(uploadType == "professional"){
                professionalUploadDocsObj.filter(function(item){
                    if(item.fileType == fileType){
                        var index = getObjectIndex(professionalUploadDocsObj, fileType);
                        if(index != -1){
                            professionalUploadDocsObj.splice(index, 1);
                        }
                    }
                })
                professionalUploadDocsObj.push(obj);
            }
            // if(uploadType == "bank"){
            //     bankUploadDocsObj.filter(function(item){
            //         if(item.fileType == fileType){
            //             var index = getObjectIndex(bankUploadDocsObj, fileType);
            //             if(index != -1){
            //                 bankUploadDocsObj.splice(index, 1);
            //             }
            //         }
            //     })
            //     bankUploadDocsObj.push(obj);
            // }
            if(uploadType == "verify"){
                verifyUploadDocsObj.filter(function(item){
                    if(item.fileType == fileType){
                        var index = getObjectIndex(verifyUploadDocsObj, fileType);
                        if(index != -1){
                            verifyUploadDocsObj.splice(index, 1);
                        }
                    }
                })
                verifyUploadDocsObj.push(obj);
                if(viewAttachmentFlag){
                    $("#"+viewAttachmentEleID).attr("data-file-extension", fileExtension);
                    $("#"+viewAttachmentEleID).attr("data-attachment-url", base64URL);
                    $("#"+viewAttachmentEleID).show();
                }
                
            }
			$("#fileupload" + elemId + "Span").text(f.name);
            validEndInvalidField(true, "fileupload" + elemId + "Span");
		}
    };
    reader.readAsDataURL(f); 
}

function getObjectIndex(obj, value){
	return obj.findIndex(function(item){
		return item.fileType == value;
	})
}

function uploadDocsFun(src, uploadType, viewAttachmentEleID, viewAttachmentFlag) {
    var fileType = $(src).attr('fileType');
    var fileExtension = src.files[0].type.split("/");
    fileExtension = fileExtension[1];
    var file = src.files[0];
    if (file) {
        base64ImageFileAsURL(file, fileType, src, uploadType, viewAttachmentEleID, fileExtension, viewAttachmentFlag);
    }
}

function verificationValidationOnSave(formId){
    const getSpanText = (selector) => {
        const value = $(selector).html();
        return typeof value === "string" ? value.trim() : "";
    };

    // 1. Social media validation
    if (!$('#socialMediaCheckbox').is(':checked')) {
        const socialLinks = [
            $('#linkedinProfileUrl').val().trim(),
            $('#facebookProfileUrl').val().trim(),
            $('#instagramProfileUrl').val().trim(),
            $('#twitterProfileUrl').val().trim()
        ];

        const hasOneSocial = socialLinks.some(link => link !== '');
        if (!hasOneSocial) {
            showMessageTheme2(2, 'Please provide at least one social media link.');
            return false;
        }
    }

	// 2. Recommendation Letter validation
	if (
		getSpanText("#" + formId + " #fileupload7Span") === '' ||
		getSpanText("#" + formId + " #fileupload7Span") === 'Upload Recommendation Letter 1'
	) {
		showMessageTheme2(2, 'Please Upload Recommendation Letter 1');
		return false;
	}

	if (
		getSpanText("#" + formId + " #fileupload8Span") === '' ||
		getSpanText("#" + formId + " #fileupload8Span") === 'Upload Recommendation Letter 2'
	) {
		showMessageTheme2(2, 'Please Upload Recommendation Letter 2');
		return false;
	}

	// 3. Reference validation
    const validateReference = (refNum) => {
        const name = $(`#reference${refNum}Name`).val().trim();
        const email = $(`#reference${refNum}Email`).val().trim();
        const phone = $(`#reference${refNum}Phone`).val().trim();
        const designation = $(`#reference${refNum}Designation`).val().trim();

        if (!name || !email || !phone || !designation) {
			showMessageTheme2(2, `Please fill all fields for Reference ${refNum}.`);
			return false;
		}

		// Country-specific phone length/format check via the shared helper
		// (same validation used everywhere else). Phone is mandatory here.
		const phoneInput = document.querySelector(`#reference${refNum}Phone`);
		const iti = phoneInput ? phoneInput.intlTelInputInstance : null;
		if (phoneInput && iti && typeof validatePhoneNumberElement === "function") {
			if (!validatePhoneNumberElement(phoneInput, iti, true)) {
				return false;
			}
		}
        return true;
    };
	if (!validateReference(1) || !validateReference(2)) {
        return false;
    }

	// 4. Police declaration checkbox
    if (!$('#policeVerificationCheck').is(':checked')) {
        showMessageTheme2(2, 'Please accept the police verification declaration.');
        return false;
    }

    // 5. File upload validation
    if (
        getSpanText("#" + formId + " #fileupload9Span") === '' ||
        getSpanText("#" + formId + " #fileupload9Span") === 'Upload Police Verification'
    ) {
        showMessageTheme2(2, 'Please Upload Police Verification');
        return false;
    }

    if (
        getSpanText("#" + formId + " #fileupload10Span") === '' ||
        getSpanText("#" + formId + " #fileupload10Span") === 'Upload Last Salary Slip'
    ) {
        showMessageTheme2(2, 'Please Upload Last Salary Slip');
        return false;
    }

	return true;
}

function getRequestForVerification() {
	const dontHaveSocial = $('#socialMediaCheckbox').is(':checked');
	const socialMediaDetails = {
		linkedIn: dontHaveSocial ? '' : $('#linkedinProfileUrl').val().trim(),
		facebook: dontHaveSocial ? '' : $('#facebookProfileUrl').val().trim(),
		instagram: dontHaveSocial ? '' : $('#instagramProfileUrl').val().trim(),
		twitter: dontHaveSocial ? '' : $('#twitterProfileUrl').val().trim(),
		dontHaveSocialMediaAccount: dontHaveSocial ? 'Y' : 'N'
	};

	const referenceDetails = [];
	const extractReference = (refNum) => {
		const name = $(`#reference${refNum}Name`).val().trim();
		const email = $(`#reference${refNum}Email`).val().trim();
		const phoneInput = document.querySelector(`#reference${refNum}Phone`);
		const designation = $(`#reference${refNum}Designation`).val().trim();

		// Read the country from the instance cached by initPhoneInputV29 (v29-safe),
		// with a fallback to the hidden countryData/countryIsd fields.
		const iti = phoneInput ? phoneInput.intlTelInputInstance : null;
		const countryData = iti ? itiGetCountry(iti) : null;
		let isdCode = countryData && countryData.dialCode ? parseInt(countryData.dialCode) : null;
		let isoCode = countryData && countryData.iso2 ? countryData.iso2 : null;
		if (!isoCode) { isoCode = $('#countryData' + refNum).val() || null; }
		if (!isdCode) {
			const hiddenIsd = parseInt($('#countryIsd' + refNum).val(), 10);
			isdCode = isNaN(hiddenIsd) ? null : hiddenIsd;
		}

		const phone = $(phoneInput).val().trim();

		if (name && email && phone && isdCode && designation) {
			referenceDetails.push({
				name,
				email,
				isdCode,
				isoCode,
				number: phone,
				designation
			});
		}
	};
	extractReference(1);
	extractReference(2);

	const requestData = {
		requestData: {
			referenceDetails,
			socialMediaDetails,
			entityId: ENTITY_ID,
			entityType: ENTITY_TYPE,
			policeVerification: $('#policeVerificationCheck').is(':checked') ? 'Y' : 'N',
			attachments: verifyUploadDocsObj
		}
	};
	return requestData;
}

async function saveVerificationDetails(formId){
	if(verificationValidationOnSave(formId)){
		const requestBody = getRequestForVerification();
        var ajaxReqDetails = {
            method: "POST",
            url: APP_BASE_URL + SCHOOL_UUID + "/save-verification",
            body: requestBody,
            global: true,
            showMessage: false,
            onFaildResolved: true,
            onSuccessResolved: true
        }
        var saveResponse = await callCommonAjax(ajaxReqDetails);
		if (saveResponse.statusCode === "SUCCESS") {
            showMessageTheme2(1, 'Verification submitted successfully');
			$("#submitVerificationModal").modal("hide");
            $("#inReviewForOtherRolesVerificationModal").remove();
            $("body").append(inReviewForOtherRolesVerificationModal());
			setTimeout(() => {
				$('#inReviewForOtherRolesVerificationModal').modal({backdrop: 'static', keyboard: false});
			}, 500);
        } else {
            showMessageTheme2(0, saveResponse.message);
        }
	}
}

function otherRolesStage4OnLoadEvent(){
	if (typeof $.fn.valid !== 'function') {
		$.fn.valid = function () { return true; };
	}
	initializeOtherRolesStage4Interactions();
	$('#accountCurrency').html(getCurrenciesOption());
	$('#accountCategory').html(getAccountCategoriesOption());
	$('#accountCategory option').filter(function(){ return $(this).attr('value') === ' '; }).attr('value', '');
	callCountriesOption("otherRolesStage4", '', "accountHolderCountryId", '');
	callStates("otherRolesStage4", '', "accountHolderCountryId", "accountHolderStateId", "accountHolderCityId");
	$("#otherRolesStage3 #accountHolderStateId").val($("#accountHolderStateId").val()).trigger('change');
	callCities("otherRolesStage4", $("#accountHolderStateId").val(), "accountHolderStateId", "accountHolderCityId");

	callCountriesOption("otherRolesStage4", '', "bankCountryId", '');
	callStates("otherRolesStage4", '', "bankCountryId", "bankStateId", "bankCityId");
	$("#otherRolesStage3 #bankStateId").val($("#bankStateId").val()).trigger('change');
	callCities("otherRolesStage4", $("#bankStateId").val(), "bankStateId", "bankCityId");

	$("#accountHolderCountryId").unbind().bind("change", function () {
		$('#accountHolderCountryId').valid();
		callStates('otherRolesStage4', this.value, 'accountHolderCountryId','accountHolderStateId','accountHolderCityId');
		$("#accountHolderCityId").html("<option value=''>Select City*</option>");
		validEndInvalidField(null, "accountHolderCityId");
		validEndInvalidField(null, "accountHolderStateId");
	});
	$("#accountHolderStateId").unbind().bind("change", function () {
		$('#accountHolderStateId').valid();
		callCities('otherRolesStage4', this.value, 'accountHolderStateId','accountHolderCityId');
		validEndInvalidField(null, "accountHolderCityId");
	});
	$("#accountHolderCityId").unbind().bind("change", function () {
		$('#accountHolderCityId').valid();
	});

	$("#bankCountryId").unbind().bind("change", function () {
		$('#bankCountryId').valid();
		callStates('otherRolesStage4', this.value, 'bankCountryId','bankStateId','bankCityId');
		$("#bankCityId").html("<option value=''>Select City*</option>");
		validEndInvalidField(null, "bankStateId");
		validEndInvalidField(null, "bankCityId");
	});
	$("#bankStateId").unbind().bind("change", function () {
		$('#bankStateId').valid();
		callCities('otherRolesStage4', this.value, 'bankStateId','bankCityId');
		validEndInvalidField(null, "bankCityId");
	});
	$("#bankCityId").unbind().bind("change", function () {
		$('#bankCityId').valid();
	});

	$("#accountCurrency").change(function() {
		if ($("#accountCurrency").val().trim()=="") {
			validEndInvalidField(null, "accountCurrency");
			return false
		}else{
			validEndInvalidField(true, "accountCurrency");
		}
	});
	$("#accountNumber").blur(function() {
		if ($("#accountNumber").val().trim()=="") {
			validEndInvalidField(null, "accountNumber");
			return false
		}else{
			validEndInvalidField(true, "accountNumber");
		}
	});
	$("#iban").blur(function() {
		if ($("#iban").val().trim()=="") {
			validEndInvalidField(null, "iban");
			return false
		}else{
			validEndInvalidField(true, "iban");
		}
	});
	$("#accountCategory").change(function() {
		if ($("#accountCategory").val().trim()=="") {
			validEndInvalidField(null, "accountCategory");
			return false
		}else{
			validEndInvalidField(true, "accountCategory");
		}
	});
	$("#accountHolderFirstName").blur(function() {
		if ($("#accountHolderFirstName").val().trim()=="") {
			validEndInvalidField(null, "accountHolderFirstName");
			return false
		}else{
			validEndInvalidField(true, "accountHolderFirstName");
		}
	});
	$("#accountHolderMiddleName").blur(function() {
		if ($("#accountHolderMiddleName").val().trim()=="") {
			validEndInvalidField(null, "accountHolderMiddleName");
			return false
		}else{
			validEndInvalidField(true, "accountHolderMiddleName");
		}
	});
	$("#accountHolderLastName").blur(function() {
		if ($("#accountHolderLastName").val().trim()=="") {
			validEndInvalidField(null, "accountHolderLastName");
			return false
		}else{
			validEndInvalidField(true, "accountHolderLastName");
		}
	});
	$("#accountHolderAddress").blur(function() {
		if ($("#accountHolderAddress").val().trim()=="") {
			validEndInvalidField(null, "accountHolderAddress");
			return false
		}else{
			validEndInvalidField(true, "accountHolderAddress");
		}
	});
	$("#accountHolderCountryId").change(function() {
		if ($("#accountHolderCountryId").val().trim()=="") {
			validEndInvalidField(null, "accountHolderCountryId");
			return false
		}else{
			validEndInvalidField(true, "accountHolderCountryId");
		}
	});
	$("#accountHolderStateId").change(function() {
		if ($("#accountHolderStateId").val().trim()=="") {
			validEndInvalidField(null, "accountHolderStateId");
			return false
		}else{
			validEndInvalidField(true, "accountHolderStateId");
		}
	});
	$("#accountHolderCityId").change(function() {
		if ($("#accountHolderCityId").val().trim()=="") {
			validEndInvalidField(null, "accountHolderCityId");
			return false
		}else{
			validEndInvalidField(true, "accountHolderCityId");
		}
	});
	$("#accountHolderPostal").blur(function() {
		if ($("#accountHolderPostal").val().trim()=="") {
			validEndInvalidField(null, "accountHolderPostal");
			return false
		}else{
			validEndInvalidField(true, "accountHolderPostal");
		}
	});
	$("#accountHolderPhone").blur(function() {
		if ($("#accountHolderPhone").val().trim()=="") {
			validEndInvalidField(null, "accountHolderPhone");
			return false
		}else{
			validEndInvalidField(true, "accountHolderPhone");
		}
	});
	$("#accountHolderEmail").blur(function() {
		if ($("#accountHolderEmail").val().trim()=="") {
			validEndInvalidField(null, "accountHolderEmail");
			return false
		}else{
			validEndInvalidField(true, "accountHolderEmail");
		}
	});
	$("#bankName").blur(function() {
		if ($("#bankName").val().trim()=="") {
			validEndInvalidField(null, "bankName");
			return false
		}else{
			validEndInvalidField(true, "bankName");
		}
	});
	$("#bankBranchName").blur(function() {
		if ($("#bankBranchName").val().trim()=="") {
			validEndInvalidField(null, "bankBranchName");
			return false
		}else{
			validEndInvalidField(true, "bankBranchName");
		}
	});
	$("#bankBranchAddress").blur(function() {
		if ($("#bankBranchAddress").val().trim()=="") {
			validEndInvalidField(null, "bankBranchAddress");
			return false
		}else{
			validEndInvalidField(true, "bankBranchAddress");
		}
	});
	$("#bankCountryId").change(function() {
		if ($("#bankCountryId").val().trim()=="") {
			validEndInvalidField(null, "bankCountryId");
			return false
		}else{
			validEndInvalidField(true, "bankCountryId");
		}
	});
	$("#bankStateId").change(function() {
		if ($("#bankStateId").val().trim()=="") {
			validEndInvalidField(null, "bankStateId");
			return false
		}else{
			validEndInvalidField(true, "bankStateId");
		}
	});
	$("#bankCityId").change(function() {
		if ($("#bankCityId").val().trim()=="") {
			validEndInvalidField(null, "bankCityId");
			return false
		}else{
			validEndInvalidField(true, "bankCityId");
		}
	});
	$("#bankPostal").blur(function() {
		if ($("#bankPostal").val().trim()=="") {
			validEndInvalidField(null, "bankPostal");
			return false
		}else{
			validEndInvalidField(true, "bankPostal");
		}
	});
	$("#otherDetails").blur(function() {
		if ($("#otherDetails").val().trim()=="") {
			validEndInvalidField(null, "otherDetails");
			return false
		}else{
			validEndInvalidField(true, "otherDetails");
		}
	});
	$("#swiftCode").blur(function() {
		if ($("#swiftCode").val().trim()=="") {
			validEndInvalidField(null, "swiftCode");
			return false
		}else{
			validEndInvalidField(true, "swiftCode");
		}
	});
	$("#bankIfsc").blur(function() {
		if ($("#bankIfsc").val().trim()=="") {
			validEndInvalidField(null, "bankIfsc");
			return false
		}else{
			validEndInvalidField(true, "bankIfsc");
		}
	});
	$("#routeNumber").blur(function() {
		if ($("#routeNumber").val().trim()=="") {
			validEndInvalidField(null, "routeNumber");
			return false
		}else{
			validEndInvalidField(true, "routeNumber");
		}
	});
    setTimeout(function(){
        initializeOtherRolesStage4Interactions();
    }, 300);
}

async function getOtherRolesStage4Data(){
	setSteps(4);
	showSkeleton(true, "step4");
	$("#otherRolesContentStage4").html(getOtherRolesBankAccountDetails());
	otherRolesStage4OnLoadEvent();
	$(".step-4-skeleton").hide();
	$("#otherRolesStage4").show();
}

function getRequestForTeacherAccountAndContact(formId){
	var request = {};
	var otherRolesPaymentInfoDTO = {};

	var accountType = "BANK_ACCOUNT";
	
	otherRolesPaymentInfoDTO['entityId'] = ENTITY_ID;
	otherRolesPaymentInfoDTO['entityType'] = ENTITY_TYPE;
	otherRolesPaymentInfoDTO['accountType'] = accountType;
	otherRolesPaymentInfoDTO['accountCurrency'] = $("#"+formId+" #accountCurrency").val();
	otherRolesPaymentInfoDTO['accountNumber'] = $("#"+formId+" #accountNumber").val();
	otherRolesPaymentInfoDTO['iban'] = $("#"+formId+" #iban").val();
	otherRolesPaymentInfoDTO['accountCategory'] = $("#"+formId+" #accountCategory").val();
	otherRolesPaymentInfoDTO['accountHolderFirstName'] = toTitleCase($("#"+formId+" #accountHolderFirstName").val());
	otherRolesPaymentInfoDTO['accountHolderMiddleName'] = toTitleCase($("#"+formId+" #accountHolderMiddleName").val());
	otherRolesPaymentInfoDTO['accountHolderLastName'] = toTitleCase($("#"+formId+" #accountHolderLastName").val());
	otherRolesPaymentInfoDTO['accountHolderAddress'] = toTitleCase($("#"+formId+" #accountHolderAddress").val());
	otherRolesPaymentInfoDTO['accountHolderCountryId'] = $("#"+formId+" #accountHolderCountryId").val();
	otherRolesPaymentInfoDTO['accountHolderStateId'] = $("#"+formId+" #accountHolderStateId").val();
	otherRolesPaymentInfoDTO['accountHolderCityId'] = $("#"+formId+" #accountHolderCityId").val();
	otherRolesPaymentInfoDTO['accountHolderPostal'] = $("#"+formId+" #accountHolderPostal").val();
	otherRolesPaymentInfoDTO['accountHolderPhone'] = $("#"+formId+" #accountHolderPhone").val();
	otherRolesPaymentInfoDTO['accountHolderEmail'] = $("#"+formId+" #accountHolderEmail").val();
	otherRolesPaymentInfoDTO['bankName'] = toTitleCase($("#"+formId+" #bankName").val());
	otherRolesPaymentInfoDTO['bankBranchName'] = toTitleCase($("#"+formId+" #bankBranchName").val());
	otherRolesPaymentInfoDTO['bankBranchAddress'] = escapeCharacters(toTitleCase($("#"+formId+" #bankBranchAddress").val()));
	otherRolesPaymentInfoDTO['bankCountryId'] = $("#"+formId+" #bankCountryId").val();
	otherRolesPaymentInfoDTO['bankStateId'] = $("#"+formId+" #bankStateId").val();
	otherRolesPaymentInfoDTO['bankCityId'] = $("#"+formId+" #bankCityId").val();
	otherRolesPaymentInfoDTO['bankPostal'] = $("#"+formId+" #bankPostal").val();
	otherRolesPaymentInfoDTO['swiftCode'] = $("#"+formId+" #swiftCode").val();
	otherRolesPaymentInfoDTO['bankIfsc'] = $("#"+formId+" #bankIfsc").val();
	otherRolesPaymentInfoDTO['routeNumber'] = $("#"+formId+" #routeNumber").val();
	otherRolesPaymentInfoDTO['accountNumber'] = $("#"+formId+" #accountNumber").val();
	otherRolesPaymentInfoDTO['otherDetails'] = toSentenceCase($("#"+formId+" #otherDetails").val());
	otherRolesPaymentInfoDTO['payPalEmail'] = $("#"+formId+" #paypalEmailId").val();
	request['data'] = otherRolesPaymentInfoDTO;
	return request;
}

async function callForOtherRolesBankDetails(formId){
    $('#messageDiv').removeAttr('style');
    let flag = false;
    if ($("#" + formId + " #accountCurrency").val() == '') {
        showMessageTheme2(2, 'Please choose account currency.');
        return false;
    }
    if ($("#" + formId + " #accountNumber").val() == '') {
        showMessageTheme2(2, 'Account number can\'t be blank.');
        return false;
    }
    if ($("#" + formId + " #accountCategory").val() == '') {
        showMessageTheme2(2, 'Please choose account type.');
        return false;
    }
    if ($("#" + formId + " #accountHolderFirstName").val() == '') {
        showMessageTheme2(2, 'Account holder first name can\'t be blank.');
        return false;
    }
    if ($("#" + formId + " #accountHolderLastName").val() == '') {
        showMessageTheme2(2, 'Account holder last name can\'t be blank.');
        return false;
    }
    if ($("#" + formId + " #accountHolderAddress").val() == '') {
        showMessageTheme2(2, 'Account holder address can\'t be blank.');
        return false;
    }
    if ($("#" + formId + " #accountHolderCountryId").val() == null || $("#" + formId + " #accountHolderCountryId").val() == '') {
        showMessageTheme2(2, 'Please choose account holder country.');
        return false;
    }
    if ($("#" + formId + " #accountHolderStateId").val() == null || $("#" + formId + " #accountHolderStateId").val() == '') {
        showMessageTheme2(2, 'Please choose account holder state.');
        return false;
    }
    if ($("#" + formId + " #accountHolderCityId").val() == null || $("#" + formId + " #accountHolderCityId").val() == '') {
        showMessageTheme2(2, 'Please choose account holder city.');
        return false;
    }
    if ($("#" + formId + " #accountHolderPostal").val() == '') {
        showMessageTheme2(2, 'Account holder postal code can\'t be blank.');
        return false;
    }
    if ($("#" + formId + " #accountHolderPhone").val() == '') {
        showMessageTheme2(2, 'Account holder phone number can\'t be blank.');
        return false;
    }
    if (!validateEmail($("#" + formId + " #accountHolderEmail").val())) {
        showMessageTheme2(2, 'Invalid Email.');
        return false;
    }
    if ($("#" + formId + " #bankName").val() == '') {
        showMessageTheme2(2, 'Bank name can\'t be blank.');
        return false;
    }
    if ($("#" + formId + " #bankBranchName").val() == '') {
        showMessageTheme2(2, 'Bank branch name can\'t be blank.');
        return false;
    }
    if ($("#" + formId + " #bankBranchAddress").val() == '') {
        showMessageTheme2(2, 'Bank branch address can\'t be blank.');
        return false;
    }
    if ($("#" + formId + " #bankCountryId").val() == null || $("#" + formId + " #bankCountryId").val() == '') {
        showMessageTheme2(2, 'Please choose bank country.');
        return false;
    }
    if ($("#" + formId + " #bankStateId").val() == null || $("#" + formId + " #bankStateId").val() == '') {
        showMessageTheme2(2, 'Please choose bank state.');
        return false;
    }
    if ($("#" + formId + " #bankCityId").val() == null || $("#" + formId + " #bankCityId").val() == '') {
        showMessageTheme2(2, 'Please choose bank city.');
        return false;
    }
    if ($("#" + formId + " #bankPostal").val() == '') {
        showMessageTheme2(2, 'Bank postal code can\'t be blank.');
        return false;
    }
    var payload = getRequestForTeacherAccountAndContact(formId)
    var ajaxReqDetails = {
        method: "POST",
        url: APP_BASE_URL + SCHOOL_UUID + "/save-applicant-bank-details",
        body: payload,
        global: true,
        showMessage: false,
        onFaildResolved: true,
        onSuccessResolved: true
    }
    var responseData = await callCommonAjax(ajaxReqDetails);
    if(responseData.status == 1){
        $("#formSteps").html(getOtherRolesThankYouPage());
        flag = true;
        return flag;
    }else{
        showMessageTheme2(0, responseData.message);
        flag = false;
        return flag
    }
}
