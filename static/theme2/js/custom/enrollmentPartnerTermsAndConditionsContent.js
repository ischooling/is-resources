function getMainContent(entityType){
    var html=
    `<div class="app-container app-theme-white body-tabs-shadow fixed-header fixed-sidebar">
        ${getHeaderContent()}
        ${getMainCardContent(entityType)}
        ${getFooterContent()}
    </div>`;
    return html;
}

function getHeaderContent(){
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

function getFooterContent() {
    return `
    <div class="app-wrapper-footer">
        <div class="app-footer">
            <div class="app-footer__inner">
                <p style="margin: 0">${getCopyright()}</p>
            </div>
        </div>
    </div>`;
}

function getMainCardContent(entityType){
    var html=
    `<div class="app-main py-2">
        <div class="app-main__inner py-0 px-2">
            <div id="OTPProcessWrapper"></div>`;
            if(entityType == "USER_SCREENING"){
                html+=`${stepsContent()}`
            }else{
                html+=`<div id="b2bContractViewWrapper" class="col-xl-8 col-lg-10 col-md-12 col-sm-12 col-12 mx-auto p-3 card mt-4 pb-4 overflow-auto" style="display: none;"></div>`;
            }
        html+=`</div>
    </div>`;
    return html;
}

function getOTPProcess(entityId, partnerEmail, contractId, entityType, currentApplicantStage){
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
                    <a href="javascript:void(0)" class="btn btn-primary btn-lg disabled full font-16" id="verifyOTP" onclick="verifyOTP(\'${entityId}\', \'${partnerEmail}\',\'${contractId}\', \'${entityType}\', \'${currentApplicantStage}\')">
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
        <input type="hidden" id="entityId" name="entityId"/>
        <input type="hidden" id="entityType" name="entityType"/>
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
                        onchange="handleRecipientSignatureUpload(this, 'rightSignatureBox'); updateFileName(this); handleFileInputCancel('b2bAcceptanceTermsConditionForm', 'recipientSignatureUpload', 'rightSignatureBox')"
                    >
                    <label class="custom-file-label text-truncate" for="recipientSignatureUpload">Choose file...</label>
                </div>
                <small class="form-text text-danger font-12 mt-1" style="max-width: 50%;">
                    Please upload your signature image (PNG/JPG only, white/transparent background, max size: 300KB).
                </small>
            </div>
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
                        <i class="fa fa-exclamation font-30"></i>
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

function getContractPreparationContent() {
	var html =
		`<div class="d-flex align-items-center" style="background:url(${PATH_FOLDER_IMAGE2}otp_process_bg.png${SCRIPT_VERSION});background-size:cover;background-repeat:no-repeat; height:calc(100vh - 60px);padding-bottom:60px">
			<div class="card mx-3 mx-sm-auto w-100 px-3 py-4 px-md-5 border-primary rounded-15" style="max-width:500px;border-top:7px solid">
				<div class="text-center pb-4">
					<span class="bg-light-warning text-center rounded-circle d-inline-flex align-items-center justify-content-center text-white" style="width:75px;height:75px;">
						<span class="bg-warning text-center rounded-circle d-inline-flex align-items-center justify-content-center text-white" style="width:55px;height:55px;">
							<i class="fa fa-file-contract font-30"></i>
						</span>
					</span>
				</div>
				<div id="verify-identity" class="full">
					<h5 class="font-weight-bold text-dark text-center">Contract In Preparation</h5>
					<p class="text-dark text-center">
						Thanks for completing your professional details. They are verified now.
						Our team is preparing your contract. Please stay on this step and wait for the update.
					</p>
				</div>
			</div>
		</div>`;
	return html;
}

function getProfessionalDetailsInReviewContent(){
    var html=
    `<div class="d-flex align-items-center" style="background:url(${PATH_FOLDER_IMAGE2}otp_process_bg.png${SCRIPT_VERSION});background-size:cover;background-repeat:no-repeat; height:calc(100vh - 60px);padding-bottom:60px">
        <div class="card mx-3 mx-sm-auto w-100 px-3 py-4 px-md-5 border-primary rounded-15" style="max-width:500px;border-top:7px solid">
            <div class="text-center pb-4">
                <span class="bg-light-warning text-center rounded-circle d-inline-flex align-items-center justify-content-center text-white" style="width:75px;height:75px;">
                    <span class="bg-warning text-center rounded-circle d-inline-flex align-items-center justify-content-center text-white" style="width:55px;height:55px;">
                        <i class="fa fa-hourglass-half font-30"></i>
                    </span>
                </span>
            </div>
            <div id="verify-identity" class="full">
                <h5 class="font-weight-bold text-dark text-center">Professional Details Under Review</h5>
                <p class="text-dark text-center">Thanks for submitting your professional details. Our team is reviewing them now. Please stay on this step and wait for the approval update.</p>
            </div>
        </div>
    </div>`;
    return html;
}

function getVerificationInReviewContent(){
    var html=
    `<div class="d-flex align-items-center" style="background:url(${PATH_FOLDER_IMAGE2}otp_process_bg.png${SCRIPT_VERSION});background-size:cover;background-repeat:no-repeat; height:calc(100vh - 60px);padding-bottom:60px">
        <div class="card mx-3 mx-sm-auto w-100 px-3 py-4 px-md-5 border-primary rounded-15" style="max-width:500px;border-top:7px solid">
            <div class="text-center pb-4">
                <span class="bg-light-warning text-center rounded-circle d-inline-flex align-items-center justify-content-center text-white" style="width:75px;height:75px;">
                    <span class="bg-warning text-center rounded-circle d-inline-flex align-items-center justify-content-center text-white" style="width:55px;height:55px;">
                        <i class="fa fa-shield-alt font-30"></i>
                    </span>
                </span>
            </div>
            <div id="verify-identity" class="full">
                <h5 class="font-weight-bold text-dark text-center">Verification Documents Under Review</h5>
                <p class="text-dark text-center">Thanks for submitting your verification documents. Our team is reviewing them now. Please stay on this step and wait for the approval update.</p>
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

function stepsContent(){
    var html=
        `<div id="formSteps" class="mt-2 d-none">
            <div class="steps clearfix">
                <ul role="tablist">
                    <li role="tab" aria-disabled="false" class="first current" aria-selected="true" id="step1_li">
                        <a>
                            <span class="step-order" style="text-transform: capitalize !important;">Step 1</span>
                            <div class="icon-circle"></div>
                            <span class="step-order" style="text-transform: capitalize !important;font-weight: bold;">Professional Details</span>
                            <span class="step-arrow-other-roles step1"></span>
                        </a>
                    </li>
                    <li role="tab" aria-disabled="false" class="" aria-selected="true" id="step2_li">
                        <a>
                            <span class="step-order" style="text-transform: capitalize !important;">Step 2</span>
                            <div class="icon-circle"></div>
                            <span class="step-order" style="text-transform: capitalize !important;font-weight: bold;">Contract Details</span>
                            <span class="step-arrow-other-roles step2"></span>
                        </a>
                    </li>
                    <li role="tab" aria-disabled="false" class="" aria-selected="true" id="step3_li">
                        <a>
                            <span class="step-order" style="text-transform: capitalize !important;">Step 3</span>
                            <div class="icon-circle"></div>
                            <span class="step-order" style="text-transform: capitalize !important;font-weight: bold;">Verification</span>
                            <span class="step-arrow-other-roles step3"></span>
                        </a>
                    </li>
                    <li role="tab" aria-disabled="false" class="" aria-selected="true" id="step4_li">
                        <a>
                            <span class="step-order" style="text-transform: capitalize !important;">Step 4</span>
                            <div class="icon-circle"></div>
                            <span class="step-order" style="text-transform: capitalize !important;font-weight: bold;">Bank Details</span>
                        </a>
                    </li>
                </ul>
            </div>
            <div class="content bg-white mx-auto" style="max-width: 85%;">
                <section class="step active-step" id="step-1">
                    <div class="full step-1-skeleton"></div>
                    <form id="otherRolesStage1" name="otherRolesStage1" class="px-4" method="post" autocomplete="off" action="javascript:void(0);" style="display:none;">
                        <div id="otherRolesContentStage1"></div>
                    </form>
                </section>
                <section class="step" id="step-2">
                    <div class="full step-2-skeleton"></div>
                    <form id="otherRolesStage2" name="otherRolesStage2" method="post" autocomplete="off" action="javascript:void(0);" style="display:none;">
                        <div id="otherRolesContentStage2"></div>
                    </form>
                </section>
                <section class="step" id="step-3">
                    <div class="full step-3-skeleton"></div>
                    <form id="otherRolesStage3" name="otherRolesStage3" class="px-4" method="post" autocomplete="off" action="javascript:void(0);" style="display:none;">
                        <div id="otherRolesContentStage3"></div>
                    </form>
                </section>
                <section class="step" id="step-4">
                    <div class="full step-4-skeleton"></div>
                    <form id="otherRolesStage4" name="otherRolesStage4" method="post" autocomplete="off" action="javascript:void(0);" style="display:none;">
                        <div id="otherRolesContentStage4" class="px-4"></div>
                    </form>
                </section>
            </div>
            <div class="actions clearfix">
                <ul role="menu" aria-label="Pagination">
                    <li class="prev-btn"  style="opacity:0;visibility: hidden;">
                        <a href="javascript:void(0)" class="primary-bg white-txt-color white-hov-bg primary-hov-border-color primary-hov-txt" role="menuitem" onclick="moveStep(\'prev\')" >Back</a>
                    </li>
                    <li class="next-btn">
                        <a href="javascript:void(0)"class="primary-bg white-txt-color white-hov-bg primary-hov-border-color primary-hov-txt"role="menuitem" onclick="moveStep(\'next\')">Next</a>
                    </li>
                    <li class="finish-btn" style="display: none;">
                        <a href="javascript:void(0)"class="primary-bg white-txt-color white-hov-bg primary-hov-border-color primary-hov-txt"role="menuitem" onclick="moveStep(\'finish\');">Submit</a>
                    </li>
                </ul>
            </div>
        </div>`
    return html;
}

function step1Skeleton(){
	var html=
	`<h4 class="alternate-txt-color text-center font-weight-bold mb-3">Professional Details</h4>
	<div class="step1-skeleton">
		<div class="form-row">
			<div class="form-holder skeleton" style="height:32px"></div>
			<div class="form-holder skeleton" style="height:32px"></div>
		</div>
		<div class="form-row">
			<div class="form-holder skeleton" style="height:32px"></div>
			<div class="form-holder skeleton" style="height:32px"></div>
		</div>
		<div class="form-row">
			<div class="form-holder skeleton" style="height:65px"></div>
		</div>
		<div style="border: rgb(232, 237, 239) 2px solid; border-radius: 5px; padding-inline: 10px; padding-top: 10px; margin-bottom: 15px;">
			<div class="form-holder skeleton" style="height:14px;margin-bottom:15px;"></div>
            <div class="form-row">
                <div class="form-holder skeleton" style="height:32px"></div>
                <div class="form-holder skeleton" style="height:32px"></div>
            </div>
            <div class="form-row">
                <div class="form-holder skeleton" style="height:32px"></div>
                <div class="form-holder skeleton" style="height:32px"></div>
            </div>
		</div>
        <br>
        <div class="form-row" style="margin-bottom:4px;">
            <div class="form-holder skeleton" style="height:14px;"></div>
		</div>
		<div class="form-row" style="margin-bottom:4px;">
            <div class="form-holder skeleton" style="height:14px;"></div>
		</div>
		<div class="form-row" style="margin-bottom:4px;">
            <div class="form-holder skeleton" style="height:14px;"></div>
		</div>
		<div class="form-row" style="margin-bottom:4px;">
            <div class="form-holder skeleton" style="height:14px;"></div>
		</div>
	</div>`;
	return html;
}

function step2Skeleton(){
	var html=
	`<h4 class="alternate-txt-color text-center font-weight-bold">Contract Details</h4>
	<div class="step1-skeleton">
		<div class="form-row">
			<div class="form-holder skeleton" style="height:893px;"></div>
		</div>
	</div>`;
	return html;
}

function step3Skeleton(){
	var html=
	`<h4 class="alternate-txt-color text-center font-weight-bold" style="margin-bottom: 30px !important;">Verification</h4>
	<div class="step1-skeleton">
		<div style="border: rgb(232, 237, 239) 2px solid; border-radius: 5px; padding-inline: 10px; padding-top: 10px; margin-bottom: 15px;">
			<div class="form-holder skeleton" style="height:14px;margin-bottom:15px;width:50% !important"></div>
            <div class="form-row">
                 <div class="form-holder skeleton" style="height:32px"></div>
                <div class="form-holder skeleton" style="height:32px"></div>
                <div class="form-holder skeleton" style="height:32px"></div>
            </div>
            <div class="form-row">
                <div class="form-holder skeleton" style="height:32px;width:33.3% !important;"></div>
            </div>
            <div class="form-holder skeleton" style="height:14px;margin-bottom:15px;width:50% !important"></div>
		</div>
		<div style="border: rgb(232, 237, 239) 2px solid; border-radius: 5px; padding-inline: 10px; padding-top: 10px; margin-bottom: 15px;">
            <div class="form-row">
                <div class="form-holder skeleton" style="height:32px;width:25% !important;"></div>
                <div class="form-holder skeleton" style="height:32px;width:25% !important;"></div>
            </div>
            <div class="form-row">
                <div class="form-holder skeleton" style="height:32px"></div>
                <div class="form-holder skeleton" style="height:32px"></div>
                <div class="form-holder skeleton" style="height:32px"></div>
                <div class="form-holder skeleton" style="height:32px"></div>
            </div>
		</div>
		<div style="border: rgb(232, 237, 239) 2px solid; border-radius: 5px; padding-inline: 10px; padding-top: 10px; margin-bottom: 15px;">
            <div class="form-row">
                <div class="form-holder skeleton" style="height:80px;"></div>
            </div>
		</div>
		<div style="border: rgb(232, 237, 239) 2px solid; border-radius: 5px; padding-inline: 10px; padding-top: 10px; margin-bottom: 15px;">
            <div class="form-row">
                <div class="form-holder skeleton" style="height:32px;width:25% !important;"></div>
                <div class="form-holder skeleton" style="height:32px;width:25% !important;"></div>
            </div>
		</div>
	</div>`;
	return html;
}

function step4Skeleton(){
	var html=
	`<h4 class="alternate-txt-color text-center font-weight-bold">Account Details</h4>
	<div class="step1-skeleton">
		<div style="border: rgb(232, 237, 239) 2px solid; border-radius: 5px; padding-inline: 10px; padding-top: 10px; margin-bottom: 15px;">
            <h5 class="text-center k8-theme-text text-capitalize secondary-txt-color">
                <b>BANK DETAILS</b>
            </h5>
            <div class="form-row" style="margin-top:10px;">
                <div class="form-holder skeleton" style="height:32px"></div>
                <div class="form-holder skeleton" style="height:32px"></div>
            </div>
            <div class="form-row">
                <div class="form-holder skeleton" style="height:32px"></div>
                <div class="form-holder skeleton" style="height:32px"></div>
            </div>
            <div class="form-row">
                <div class="form-holder skeleton" style="height:32px"></div>
                <div class="form-holder skeleton" style="height:32px"></div>
                <div class="form-holder skeleton" style="height:32px"></div>
            </div>
            <div class="form-row">
                <div class="form-holder skeleton" style="height:32px"></div>
            </div>
            <div class="form-row">
                <div class="form-holder skeleton" style="height:32px"></div>
                <div class="form-holder skeleton" style="height:32px"></div>
                <div class="form-holder skeleton" style="height:32px"></div>
            </div>
            <div class="form-row">
                <div class="form-holder skeleton" style="height:32px"></div>
                <div class="form-holder skeleton" style="height:32px"></div>
                <div class="form-holder skeleton" style="height:32px"></div>
            </div>
            <div class="form-row">
                <div class="form-holder skeleton" style="height:32px"></div>
                <div class="form-holder skeleton" style="height:32px"></div>
            </div>
            <div class="form-row">
                <div class="form-holder skeleton" style="height:32px"></div>
            </div>
            <div class="form-row">
                <div class="form-holder skeleton" style="height:32px"></div>
                <div class="form-holder skeleton" style="height:32px"></div>
                <div class="form-holder skeleton" style="height:32px"></div>
            </div>
            <div class="form-row">
                <div class="form-holder skeleton" style="height:32px"></div>
                <div class="form-holder skeleton" style="height:32px"></div>
            </div>
            <div class="form-row">
                <div class="form-holder skeleton" style="height:32px"></div>
                <div class="form-holder skeleton" style="height:32px"></div>
                <div class="form-holder skeleton" style="height:32px"></div>
            </div>
		</div>
        <div style="border: rgb(232, 237, 239) 2px solid; border-radius: 5px; padding-inline: 10px; padding-top: 10px; margin-bottom: 15px;">
			<div class="form-holder skeleton" style="height:14px;margin-bottom:15px;"></div>
            <div class="form-row">
                <div class="form-holder skeleton" style="height:32px"></div>
                <div class="form-holder skeleton" style="height:32px"></div>
            </div>
		</div>
	</div>`;
	return html;
}

function getOtherRolesProfessionalDetailsContent(stup){
    stup = {
        "details": {
            "teacherDetails": {
                "lastOrganizationName": "",
                "lastJobTitle": "",
                "sessionEntityIdList": [],
                "firstMeetingStatus": "",
                "lastJobDesc": "",
                "teacherSubjectSpecialization": "",
                "userId": 23063,
                "totalExpYear": "",
                "firstReset": 11,
                "currentlyWorking": "",
                "highestQualificationId": "",
                "selectedGrades": "",
                "declConfirmation": "",
                "demoVedioLink": ""
            }
        },
        "recordingUrls": {
            "urls": []
        },
        "message": "Teacher details",
        "status": "1",
        "statusCode": "SUCCESS"
    }
    stup = stup.details.teacherDetails;
    var html=
        `<style>
            .valid-check:after{translate: -12px;}
        </style>
        <input type="hidden" id="academicDocument" value="${stup.uploadDocumentAcademicName}" />
        <input type="hidden" id="teacherCV" value="${stup.uploadDocumentCVName}" />
        <input type="hidden" id="experienceDoc" value="${stup.uploadDocumentExperienceName}" />
        <input type="hidden" id="lastSalarySlip" value="${stup.uploadDocumentLastSalarySlip}" />
        <div class="other-roles-professional-layout">
        <h4 class="alternate-txt-color text-center font-weight-bold mb-3">Professional Details</h4>
        <div class="other-roles-pro-card">
        <div class="other-roles-section-band">Core Information</div>
        <div class="other-roles-card-body">
        <div class="form-row">
            <div class="form-holder">
                <div class="icon-field valid-field">
                    <i class="fa fa-book"></i>
                    <select class="select_dropdown form-control" id="highestQualificationId" name="highestQualificationId" data-floating-label="Highest Education Degree *">
                        <option value="">Highest Education Degree *</option>`
                        $.each(getHeighestEducation(), function(index, qualification){
                            html+= `<option value="${index}">${qualification}</option>`;
                        });
                    html+=`</select>
                </div>
            </div>
            <div class="form-holder">
                <div class="icon-field valid-field">
                    <i class="fa fa-graduation-cap"></i>
                    <input type="text" class="form-control valid" id="otherSubjectSpecialization" name="otherSubjectSpecialization" placeholder="Enter Degree Specialization*" data-floating-label="Enter Degree Specialization*" onkeydown="return M.isAddressLine(event);" value="${escapeCharacters(stup.teacherSubjectSpecialization)}" maxlength="100" style="text-transform:capitalize" aria-required="true" aria-invalid="false">
                </div>
            </div>
        </div>

        <div class="form-row">
            <div class="form-holder">
                <div class="form-row m-0">
                    <div class="form-holder">
                        <div class="icon-field valid-field">
                            <i class="fa fa-calendar"></i>
                            <select id="totalExperianceFromYYYY" name="totalExperianceFromYYYY" class="select_dropdown form-control" name="gender" data-floating-label="Experience In Years*">
                                <option selected value="">Experience In Years*</option>`
                                $.each(getTotalExpYears(), function(index, years){
                                    html+=`<option value="${index}">${years}</option>`
                                })
                            html+=`</select>
                        </div>
                    </div>
                </div>
            </div>
            <div class="form-holder">
                <div class="icon-field valid-field">
                    <i class="fa fa-briefcase"></i> <input type="text"
                        class="form-control"
                        id="lastOrganizationName"
                        name="lastOrganizationName"
                        placeholder="Last Organization Name*"
                        data-floating-label="Last Organization Name*"
                        onkeydown="return M.isAddressLine(event);"
                        value="${escapeCharacters(stup.lastOrganizationName)}"
                        maxlength="100" style="text-transform:capitalize" >
                </div>
            </div>
        </div>

        <div class="form-row">
            <div class="form-holder">
                <div class="icon-field textarea-icon  valid-field">
                    <i class="fa fa-pencil-square-o"></i>
                    <textarea class="form-control" id="lastJobDesc" name="lastJobDesc" placeholder="Why Should We Hire You? (Describe how you stand out from other online teachers highlighting your expertise) *" data-floating-label="Why Should We Hire You? (Describe how you stand out from other online teachers highlighting your expertise) *" onkeydown="return M.isAddressLine(event);" rows="2" style="text-transform:initial" maxlength="200">${escapeCharacters(stup.lastJobDesc)}</textarea>
                </div>
            </div>
        </div>
        </div>
        <div class="other-roles-doc-card">
            <div class="other-roles-section-band">Required Documents</div>
            <div class="other-roles-card-body">
            <p class="other-roles-upload-note">NOTE:- Please upload files in following formats (jpg, jpeg, pdf or png) with maximum size of 10 MB</p>
            <div class="form-row">
                <div class="form-holder">
                    <label class="full text-gray font-14">Highest Degree<sup class="sup">*</sup>
                    </label>
                    <div class="full upload-item-wrapper clone-item">
                        <div class="upload-btn-wrapper mt-1 upload-item">
                            <div class="uploaded-file valid-field valid-check" id="fileupload2Span" >${stup.uploadDocumentAcademicName!=null?stup.uploadDocumentAcademicName:'Upload Highest degree'}</div>
                            <input onchange="uploadDocsFun(this, \'professional\');" class="file-input" type="file" name="fileupload2" id="fileupload2" fileType="2" elem-id="2"> <span
                                class="upload-btn primary-txt-color"> <i class="fa fa-upload"></i>
                            </span>
                        </div>
                    </div>
                </div>
                <div class="form-holder">
                    <label class="full text-gray font-14">Updated CV <sup class="sup">*</sup></label>
                    <div class="full">
                        <div class="upload-btn-wrapper mt-1">
                            <div class="uploaded-file valid-field valid-check" id="fileupload1Span">${stup.uploadDocumentCVName!=null?stup.uploadDocumentCVName:'Upload CV'}</div>
                            <input onchange="uploadDocsFun(this, \'professional\');" class="file-input" type="file" name="fileupload1" id="fileupload1" fileType="4" elem-id="1"> <span
                                class="upload-btn primary-txt-color"> <i class="fa fa-upload"></i>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="form-row">
                <div class="form-holder">
                    <label class="full text-gray font-14">Proof of last Work-Experience <sup class="sup"></sup></label>
                    <div class="full upload-item-wrapper clone-item">
                        <div class="upload-btn-wrapper mt-1 upload-item">
                            <div class="uploaded-file valid-field valid-check" id="fileupload3Span" >${stup.uploadDocumentExperienceName!=null? stup.uploadDocumentExperienceName:'Upload Proof of last Work-Experience'}</div>
                            <input onchange="uploadDocsFun(this, \'professional\');" class="file-input" type="file" name="fileupload3" id="fileupload3" fileType="3" elem-id="3"> <span
                                class="upload-btn primary-txt-color"> <i class="fa fa-upload"></i>
                            </span>
                        </div>
                    </div>
                </div>
                <div class="form-holder">
                    <label class="full text-gray font-14">Passport/National ID <sup class="sup">*</sup></label>
                    <div class="full">
                        <div class="upload-btn-wrapper mt-1">
                            <div class="uploaded-file valid-field valid-check" id="fileupload4Span">${stup.uploadDocumentPassport!=null?stup.uploadDocumentPassport:'Upload Passport/National ID'}</div>
                            <input onchange="uploadDocsFun(this, \'professional\');" class="file-input" type="file" name="fileupload4" id="fileupload4" fileType="19" elem-id="4"> <span
                                class="upload-btn primary-txt-color"> <i class="fa fa-upload"></i>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="form-row">
                <div class="form-holder">
                    <label class="full text-gray font-14">Internet Speed Test Screenshot <sup class="sup">*</sup></label>
                    <div class="full upload-item-wrapper clone-item">
                        <div class="upload-btn-wrapper mt-1 upload-item">
                            <div class="uploaded-file valid-field valid-check" id="fileupload11Span" >${stup.uploadNetSpeedTestSSName!=null?stup.uploadNetSpeedTestSSName:'Upload Internet Speed Test Screenshot'}</div>
                            <input onchange="uploadDocsFun(this, \'professional\');" class="file-input" type="file" name="fileupload11" id="fileupload11" fileType="75" elem-id="11"> <span
                                class="upload-btn primary-txt-color"> <i class="fa fa-upload"></i>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </div>
        <div class="form-row">
            <div class="form-holder">
                <div class="other-roles-declaration-card">
                    <input type="checkbox"
                    class="wishSameParent"
                    name="declConfirmation"
                    id="declConfirmation"
                    value="${stup.declConfirmation=='Y'?'Y':'N'}" ${stup.declConfirmation=='Y'?'checked':''}> <span
                    class="undertaking ml-2 font-12"> I confirm that the information given in
                    this form is true, complete and accurate. I, hereby, undertake to
                    present the original documents immediately upon demand by the
                    concerned authorities of ${SCHOOL_NAME}. I, further declare
                    that my appointment may be canceled, at any stage, if I am found
                    ineligible and/or the information provided by me is found to be
                    incorrect. I, hereby undertake to inform the concerned person, about
                    any changes in information submitted by me, in the Application Form
                    and any other documents, including change in addresses and contact
                    numbers, from time to time.</span>
                </div>
            </div>
        </div>
        </div>`
    return html;
}

function getContractDetailsContent(data){
    var html=
        `<input type="hidden" id="contractId" name="contractId"/>
        <input type="hidden" id="b2bLeadId" name="b2bLeadId"/>
        <input type="hidden" id="location" name="location"/>
        <input type="hidden" id="entityId" name="entityId"/>
        <input type="hidden" id="entityType" name="entityType"/>
        <h4 class="alternate-txt-color text-center font-weight-bold">Contract Details</h4>
        <div class="full p-5 bg-light-primary" style="min-width:980px; border: 2px dotted #007fff;">
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
                        onchange="handleRecipientSignatureUpload(this, 'rightSignatureBox'); updateFileName(this); handleFileInputCancel('otherRolesStage1', 'recipientSignatureUpload', 'rightSignatureBox')"
                    >
                    <label class="custom-file-label text-truncate" for="recipientSignatureUpload">Choose file...</label>
                </div>
                <small class="form-text text-danger font-12 mt-1" style="max-width: 50%;">
                    Please upload your signature image (PNG/JPG only, white/transparent background, max size: 300KB).
                </small>
            </div>
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
        </div>`
    return html;
}

function getOtherRolesVerificationDetailsContent(data){
    var html=
        `<style>
            .valid-check:after{translate: -12px;}
        </style>
        <input type="hidden" id="countryData1" value="${data.employeeReference?.[0]?.isoCode || 'US'}">
        <input type="hidden" id="countryIsd1" value="${data.employeeReference?.[0]?.isdCode || '1'}">
        <input type="hidden" id="countryData2" value="${data.employeeReference?.[1]?.isoCode || 'US'}">
        <input type="hidden" id="countryIsd2" value="${data.employeeReference?.[1]?.isdCode || '1'}">
        <h4 class="alternate-txt-color text-center font-weight-bold" style="margin-bottom: 30px !important;">Verification</h4>
        <div class="other-roles-verification-layout">
            <div class="other-roles-verification-card">
                <div class="other-roles-section-band">Social Media Details</div>
                <div class="other-roles-verification-card-body">
                    <p class="other-roles-upload-note">You can add links to all your social media profiles. However, adding at least one profile link is mandatory(*).</p>
                    <div class="form-row mb-2">
                        <div class="form-holder">
                            <div class="form-group">
                                <div class="icon-field valid-field">
                                    <i class="fa fa-linkedin"></i>
                                    <input id="linkedinProfileUrl" name="linkedinProfileUrl" type="text" class="form-control other-roles-verify-control" placeholder="LinkedIn Profile URL" value="${checkValueValidation(data.teacherVerification.linkedIn, "")}">
                                </div>
                            </div>
                        </div>
                        <div class="form-holder">
                            <div class="form-group">
                                <div class="icon-field valid-field">
                                    <i class="fa fa-facebook"></i>
                                    <input id="facebookProfileUrl" name="facebookProfileUrl" type="text" class="form-control other-roles-verify-control" placeholder="Facebook Profile URL" value="${checkValueValidation(data.teacherVerification.facebook, "")}">
                                </div>
                            </div>
                        </div>
                        <div class="form-holder">
                            <div class="form-group">
                                <div class="icon-field valid-field">
                                    <i class="fa fa-instagram"></i>
                                    <input id="instagramProfileUrl" name="instagramProfileUrl" type="text" class="form-control other-roles-verify-control" placeholder="Instagram Profile URL" value="${checkValueValidation(data.teacherVerification.instagram, "")}">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="form-row mt-2">
                        <div class="form-holder">
                            <div class="form-group">
                                <div class="icon-field valid-field">
                                    <i class="fa fa-twitter"></i>
                                    <input id="twitterProfileUrl" name="twitterProfileUrl" type="text" class="form-control other-roles-verify-control" placeholder="Twitter/X Profile URL" value="${checkValueValidation(data.teacherVerification.twitter, "")}">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="other-roles-inline-check">
                        <input type="checkbox"
                            name="socialMediaCheckbox"
                            id="socialMediaCheckbox"
                            value="${data.teacherVerification?.haveSocialMediaAccount == "Y" ? "Y" : "N"}"
                            ${data.teacherVerification?.haveSocialMediaAccount == "Y" ? "checked" : ""}
                        >
                        <label for="socialMediaCheckbox">I hereby declare that I do not have any active social media accounts.</label>
                    </div>
                </div>
            </div>

            <div class="other-roles-verification-card">
                <div class="other-roles-section-band">Recommendation Letter Or Any Reference</div>
                <div class="other-roles-verification-card-body">
                    <p class="other-roles-upload-note">NOTE:- Please upload files in following formats (jpg, jpeg, pdf or png) with maximum size of 10 MB</p>
                    <div class="form-row">
                        <div class="form-holder">
                            <label class="full text-gray font-14">Recommendation Letter 1<sup class="text-danger">*</sup></label>
                            <div class="full upload-item-wrapper clone-item">
                                <div class="upload-btn-wrapper mt-1 upload-item">
                                    <div class="uploaded-file valid-field valid-check" id="fileupload7Span" >${checkValueValidation(data.attachments.recommendationLetter1Name, "Upload Recommendation Letter 1")}</div>
                                    <input onchange="uploadDocsFun(this, \'verify\');" class="file-input" type="file" name="fileupload7" id="fileupload7" fileType="73" elem-id="7"> <span
                                        class="upload-btn primary-txt-color"> <i class="fa fa-upload"></i>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="form-holder">
                            <label class="full text-gray font-14">Recommendation Letter 2<sup class="text-danger">*</sup></label>
                            <div class="full">
                                <div class="upload-btn-wrapper mt-1">
                                    <div class="uploaded-file valid-field valid-check" id="fileupload8Span">${checkValueValidation(data.attachments.recommendationLetter2Name, "Upload Recommendation Letter 2")}</div>
                                    <input onchange="uploadDocsFun(this, \'verify\');" class="file-input" type="file" name="fileupload8" id="fileupload8" fileType="74" elem-id="8"> <span
                                        class="upload-btn primary-txt-color"> <i class="fa fa-upload"></i>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="other-roles-reference-block">
                        <h6 class="other-roles-bank-subhead">Reference 1<sup class="text-danger">*</sup></h6>
                        <div class="form-row d-flex flex-wrap gap-3">
                            <div class="form-holder">
                                <div class="icon-field valid-field">
                                    <i class="fa fa-user"></i>
                                    <input id="reference1Name" type="text" class="form-control other-roles-verify-control" placeholder="Name" value="${data.employeeReference?.[0]?.name || ''}" onkeydown="return M.isChars(event);" maxlength="50">
                                </div>
                            </div>
                            <div class="form-holder">
                                <div class="icon-field valid-field">
                                    <i class="fa fa-envelope-o"></i>
                                    <input id="reference1Email" type="email" class="form-control other-roles-verify-control" placeholder="Email" value="${data.employeeReference?.[0]?.email || ''}" maxlength="50">
                                </div>
                            </div>
                            <div class="form-holder">
                                <div class="icon-field valid-field phone-icon-field">
                                    <input id="reference1Phone" type="tel" class="form-control other-roles-verify-control" placeholder="Phone Number" value="${data.employeeReference?.[0]?.number || ''}" maxlength="20">
                                </div>
                            </div>
                            <div class="form-holder">
                                <div class="icon-field valid-field">
                                    <i class="fa fa-briefcase"></i>
                                    <input id="reference1Designation" type="text" class="form-control other-roles-verify-control" placeholder="Designation" value="${data.employeeReference?.[0]?.designation || ''}" maxlength="50">
                                </div>
                            </div>
                        </div>
                        <h6 class="other-roles-bank-subhead mt-3">Reference 2<sup class="text-danger">*</sup></h6>
                        <div class="form-row d-flex flex-wrap gap-3">
                            <div class="form-holder">
                                <div class="icon-field valid-field">
                                    <i class="fa fa-user"></i>
                                    <input id="reference2Name" type="text" class="form-control other-roles-verify-control" placeholder="Name" value="${data.employeeReference?.[1]?.name || ''}" onkeydown="return M.isChars(event);" maxlength="50">
                                </div>
                            </div>
                            <div class="form-holder">
                                <div class="icon-field valid-field">
                                    <i class="fa fa-envelope-o"></i>
                                    <input id="reference2Email" type="email" class="form-control other-roles-verify-control" placeholder="Email" value="${data.employeeReference?.[1]?.email || ''}" maxlength="50">
                                </div>
                            </div>
                            <div class="form-holder">
                                <div class="icon-field valid-field phone-icon-field">
                                    <input id="reference2Phone" type="tel" class="form-control other-roles-verify-control" placeholder="Phone Number" value="${data.employeeReference?.[1]?.number || ''}" maxlength="20">
                                </div>
                            </div>
                            <div class="form-holder">
                                <div class="icon-field valid-field">
                                    <i class="fa fa-briefcase"></i>
                                    <input id="reference2Designation" type="text" class="form-control other-roles-verify-control" placeholder="Designation" value="${data.employeeReference?.[1]?.designation || ''}" maxlength="50">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="other-roles-verification-card">
                <div class="other-roles-section-band">Police Verification</div>
                <div class="other-roles-verification-card-body other-roles-verification-copy">
                    <p class="mb-2">I, ${USER_FULL_NAME} do hereby declare and undertake that:</p>
                    <p class="mb-2">I have undergone a police verification process in my city/town of residence and obtained a valid police clearance certificate.</p>
                    <p class="mb-2">The verification confirms that I do not have any criminal record, and I am eligible for employment as per the institution's requirements.</p>
                    <p class="mb-2">I take full responsibility for the accuracy of this information and understand that any false declaration may result in disciplinary action, including termination of employment.</p>
                    <p class="mb-4">I also undertake to notify the institution immediately in case of any legal proceedings initiated against me in the future.</p>
                    <div class="other-roles-inline-check">
                        <input type="checkbox"
                            name="policeVerificationCheck"
                            id="policeVerificationCheck"
                            value="${data.teacherVerification?.policeVerificationAcceptance == "Y" ? "Y" : "N"}"
                            ${data.teacherVerification?.policeVerificationAcceptance == "Y" ? "checked" : ""}
                        >
                        <label for="policeVerificationCheck">I declare that the above statements are true and correct to the best of my knowledge and belief.</label>
                    </div>
                </div>
            </div>

            <div class="other-roles-verification-card">
                <div class="other-roles-section-band">Upload Documents</div>
                <div class="other-roles-verification-card-body">
                    <p class="other-roles-upload-note">NOTE:- Please upload files in following formats (jpg, jpeg, pdf or png) with maximum size of 10 MB</p>
                    <div class="form-row">
                        <div class="form-holder">
                            <label class="full text-gray font-14">Police Verification<sup class="text-danger">*</sup></label>
                            <div class="full upload-item-wrapper clone-item">
                                <div class="upload-btn-wrapper mt-1 upload-item">
                                    <div class="uploaded-file valid-field valid-check" id="fileupload9Span" >${checkValueValidation(data.attachments.policeVerificationName, "Upload Police Verification")}</div>
                                    <input onchange="uploadDocsFun(this, \'verify\');" class="file-input" type="file" name="fileupload9" id="fileupload9" fileType="72" elem-id="9"> <span
                                        class="upload-btn primary-txt-color"> <i class="fa fa-upload"></i>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="form-holder">
                            <label class="full text-gray font-14">Last Salary Slip<sup class="text-danger">*</sup></label>
                            <div class="full">
                                <div class="upload-btn-wrapper mt-1">
                                    <div class="uploaded-file valid-field valid-check" id="fileupload10Span">${checkValueValidation(data.attachments.previousSalarySlipName, "Upload Last Salary Slip")}</div>
                                    <input onchange="uploadDocsFun(this, \'verify\');" class="file-input" type="file" name="fileupload10" id="fileupload10" fileType="41" elem-id="10"> <span
                                        class="upload-btn primary-txt-color"> <i class="fa fa-upload"></i>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`
    return html;
}

function getOtherRolesBankAccountDetails(){
    var html=
        `<style>
            .valid-check:after{translate: -12px;}
        </style>
        <div class="other-roles-bank-layout">
        <h4 class="alternate-txt-color text-center font-weight-bold">Account Details</h4>
        <div class="form-row">
            <div class="form-holder bank-details secondary-border-color other-roles-bank-card">
                <div class="other-roles-section-band">Bank Details</div>
                <div class="other-roles-bank-card-body">
                <div class="form-row m-0">
                    <div class="form-holder">
                        <div class="form-group">
                            <label class="secondary-txt-color">Account Currency <sup class="sup" title="required">*</sup></label>
                            <div class="icon-field valid-field">
                                <i class="zmdi zmdi-money"></i>
                                <select name="accountCurrency" id="accountCurrency" class="form-control form-control secondary-focus-border-color">
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="form-holder">
                        <div class="form-group">
                            <label class="secondary-txt-color">Account Number <sup class="sup" title="required">*</sup></label>
                            <div class="icon-field  valid-field">
                                <i class="zmdi zmdi-account"></i>
                                <input id="accountNumber" name="accountNumber" type="text"
                                    value="" autocomplete="off"
                                    class="form-control form-control secondary-focus-border-color">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="form-row m-0">
                    <div class="form-holder">
                        <div class="form-group">
                            <label class="secondary-txt-color">IBAN (If Available)</label>
                            <div class="icon-field  valid-field">
                                <i class="zmdi zmdi-account-calendar"></i>
                                <input id="iban" name="iban" type="text" autocomplete="off"
                                    value=""
                                    class="form-control form-control secondary-focus-border-color">
                            </div>
                        </div>
                    </div>
                    <div class="form-holder">
                        <div class="form-group">
                            <label class="secondary-txt-color">Account Type <sup class="sup" title="required">*</sup></label>
                            <div class="icon-field  valid-field">
                                <i class="zmdi zmdi-balance"></i>
                                <select name="accountCategory" id="accountCategory" class="form-control form-control secondary-focus-border-color">
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="divider"></div>
                <div class="form-row m-0">
                    <h6 class="m-0 other-roles-bank-subhead"><b>Account Holder Name</b><span class="fontf-italic">&nbsp;(as per bank record)</span></h6>
                </div>
                <div class="form-row m-0">
                    <div class="form-holder">
                        <div class="form-group">
                            <label class="secondary-txt-color">First <sup class="sup" title="required">*</sup></label>
                            <div class="icon-field  valid-field">
                                <i class="zmdi zmdi-account"></i>
                                <input id="accountHolderFirstName" name="accountHolderFirstName" type="text"
                                    value="" autocomplete="off"
                                    style="text-transform:capitalize"
                                    class="form-control form-control secondary-focus-border-color"
                                    onkeydown="return M.isChars(event);" maxlength="50">
                            </div>
                        </div>
                    </div>
                    <div class="form-holder">
                        <div class="form-group">
                            <label class="secondary-txt-color">Middle</label>
                            <div class="icon-field  valid-field">
                                <i class="zmdi zmdi-account"></i>
                                <input id="accountHolderMiddleName" name="accountHolderMiddleName" type="text"
                                    value="" autocomplete="off"
                                    style="text-transform:capitalize"
                                    class="form-control form-control secondary-focus-border-color"
                                    onkeydown="return M.isChars(event);" maxlength="50">
                            </div>
                        </div>
                    </div>
                    <div class="form-holder">
                        <div class="form-group">
                            <label class="secondary-txt-color">Last <sup class="sup" title="required">*</sup></label>
                            <div class="icon-field  valid-field">
                                <i class="zmdi zmdi-account"></i>
                                <input id="accountHolderLastName" name="accountHolderLastName" type="text"
                                    value="" autocomplete="off"
                                    style="text-transform:capitalize"
                                    class="form-control form-control secondary-focus-border-color"
                                    onkeydown="return M.isChars(event);" maxlength="50">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="form-row m-0">
                    <div class="form-holder">
                        <div class="form-group">
                            <label class="secondary-txt-color">Account Holder Address<sup class="sup" title="required">*</sup></label>
                            <div class="icon-field  valid-field">
                                <i class="zmdi zmdi-pin"></i> <input 
                                type="text" maxlength="100" 
                                id="accountHolderAddress"  
                                name="accountHolderAddress"
                                style="text-transform:capitalize" 
                                value=""
                                class="form-control form-control secondary-focus-border-color"
                                onkeydown="return M.isAddressLine(event);"
                                autocomplete="off">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="form-row m-0">
                    <div class="form-holder">
                        <div class="form-group">
                            <label>Country <sup class="sup" title="required">*</sup></label>
                            <div class="icon-field  valid-field">
                                <i class="zmdi zmdi-pin"></i>
                                <select class="select_dropdown form-control " name="accountHolderCountryId" id="accountHolderCountryId"></select>
                            </div>
                        </div>
                    </div>
                    <div class="form-holder">
                        <div class="form-group">
                            <label>State <sup class="sup" title="required">*</sup></label>
                            <div class="icon-field  valid-field">
                                <i class="zmdi zmdi-pin"></i>
                                <select class="select_dropdown form-control " name="accountHolderStateId" id="accountHolderStateId"></select>
                            </div>
                        </div>
                    </div>
                    <div class="form-holder">
                        <div class="form-group">
                            <label>City <sup class="sup" title="required">*</sup></label>
                            <div class="icon-field  valid-field">
                                <i class="zmdi zmdi-pin"></i>
                                <select class="select_dropdown form-control " name="accountHolderCityId" id="accountHolderCityId"></select>
                            </div>
                        </div>
                    </div>

                </div>
                <div class="form-row m-0">
                    <div class="form-holder">
                        <div class="form-group">
                            <label class="secondary-txt-color">Postal Code<sup class="sup" title="required">*</sup></label>
                            <div class="icon-field  valid-field">
                                <i class="zmdi zmdi-pin"></i>
                                <input id="accountHolderPostal" name="accountHolderPostal" type="text"
                                    autocomplete="off" value=""
                                    class="form-control form-control secondary-focus-border-color">
                            </div>
                        </div>
                    </div>
                    <div class="form-holder">
                        <div class="form-group">
                            <label class="secondary-txt-color">Phone No.<sup class="sup" title="required">*</sup></label>
                            <div class="icon-field  valid-field">
                                <i class="zmdi zmdi-phone"></i>
                                <input id="accountHolderPhone"  name="accountHolderPhone" value="" 
                                    type="text" autocomplete="off"
                                    style="text-transform:capitalize"
                                    class="form-control form-control secondary-focus-border-color"
                                    onkeydown="return M.digit(event);" maxlength="50">
                            </div>
                        </div>
                    </div>
                    <div class="form-holder">
                        <div class="form-group">
                            <label class="secondary-txt-color">Email-ID<sup class="sup" title="required">*</sup></label>
                            <div class="icon-field valid-field">
                                <i class="zmdi zmdi-email"></i>
                                <input id="accountHolderEmail" value="" 
                                    name="accountHolderEmail" type="text" autocomplete="off"
                                    class="form-control form-control secondary-focus-border-color"
                                    onkeydown="">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="divider"></div>
                <div class="form-row m-0">
                    <div class="form-holder">
                        <div class="form-group">
                            <label class="secondary-txt-color">Bank Name <sup class="sup" title="required">*</sup></label>
                            <div class="icon-field  valid-field">
                                <i class="zmdi zmdi-city-alt"></i> 
                                <input type="text" id="bankName" name="bankName"
                                    value=""
                                    class="form-control form-control secondary-focus-border-color"
                                    onkeydown="return M.isChars(event);" style="text-transform:capitalize"
                                    autocomplete="off" maxlength="50">
                            </div>
                        </div>
                    </div>
                    <div class="form-holder">
                        <div class="form-group">
                            <label class="secondary-txt-color">Bank Branch Name<sup class="sup" title="required">*</sup></label>
                            <div class="icon-field  valid-field">
                                <i class="zmdi zmdi-city-alt"></i> <input
                                    class="form-control form-control secondary-focus-border-color"
                                    onkeydown="return M.isChars(event);" id="bankBranchName" type="text"
                                    style="text-transform:capitalize" value=""
                                    name="bankBranchName" autocomplete="off">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="form-row m-0">
                    <div class="form-holder">
                        <div class="form-group">
                            <label class="secondary-txt-color">Bank Branch Address<sup class="sup" title="required">*</sup></label>
                            <div class="icon-field  valid-field">
                                <i class="zmdi zmdi-pin"></i> <input 
                                type="text" maxlength="100" 
                                id="bankBranchAddress"  
                                name="bankBranchAddress"
                                style="text-transform:capitalize"
                                value=""
                                class="form-control form-control secondary-focus-border-color"
                                onkeydown="return M.isAddressLine(event);"
                                autocomplete="off">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="form-row m-0">
                    <div class="form-holder">
                        <div class="form-group">
                            <label>Country <sup class="sup" title="required">*</sup></label>
                            <div class="icon-field  valid-field">
                                <i class="zmdi zmdi-pin"></i>
                                <select class="select_dropdown form-control " name="bankCountryId" id="bankCountryId"></select>
                            </div>
                        </div>
                    </div>
                    <div class="form-holder">
                        <div class="form-group">
                            <label>State <sup class="sup" title="required">*</sup></label>
                            <div class="icon-field  valid-field">
                                <i class="zmdi zmdi-pin"></i>
                                <select class="select_dropdown form-control " name="bankStateId" id="bankStateId"></select>
                            </div>
                        </div>
                    </div>
                    <div class="form-holder">
                        <div class="form-group">
                            <label>City <sup class="sup" title="required">*</sup></label>
                            <div class="icon-field  valid-field">
                                <i class="zmdi zmdi-pin"></i>
                                <select class="select_dropdown form-control " name="bankCityId" id="bankCityId"></select>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="form-row m-0">
                    <div class="form-holder">
                        <div class="form-group">
                            <label class="secondary-txt-color">Postal Code <sup class="sup" title="required">*</sup></label>
                            <div class="icon-field  valid-field">
                                <i class="zmdi zmdi-pin"></i>
                                <input id="bankPostal" name="bankPostal" type="text"
                                    autocomplete="off" value=""
                                    class="form-control form-control secondary-focus-border-color">
                            </div>
                        </div>
                    </div>
                    <div class="form-holder">
                        <div class="form-group">
                            <label class="secondary-txt-color">Other Details</label>
                            <div class="icon-field  valid-field">
                                <i class="zmdi zmdi-pin"></i>
                                <input id="otherDetails" name="otherDetails" type="text"
                                    autocomplete="off" value=""
                                    class="form-control form-control secondary-focus-border-color">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="divider"></div>
                <div class="form-row m-0">
                    <div class="form-holder">
                        <div class="form-group">
                            <label class="secondary-txt-color">Bank Swift Code (If Applicable)</label>
                            <div class="icon-field  valid-field">
                                <i class="zmdi zmdi-code"></i>
                                <input type="text" id="swiftCode" name="swiftCode"
                                    value=""
                                    class="form-control form-control secondary-focus-border-color"
                                    maxlength="50" autocomplete="off"
                                    onkeydown="return M.isAlphaNumericWithNoSpecialCharacter(event);">
                            </div>
                        </div>
                    </div>
                    <div class="form-holder">
                        <div class="form-group">
                            <label class="secondary-txt-color">Bank IFSC Code (If Applicable)</label>
                            <div class="icon-field  valid-field">
                                <i class="zmdi zmdi-code"></i> 
                                <input type="text" id="bankIfsc" name="bankIfsc"
                                    value=""
                                    class="form-control form-control secondary-focus-border-color"
                                    maxlength="50" autocomplete="off"
                                    onkeydown="return M.isAlphaNumericWithNoSpecialCharacter(event);">
                            </div>
                        </div>
                    </div>
                    <div class="form-holder">
                        <div class="form-group">
                            <label class="secondary-txt-color">IBAN/Routing Number (If Applicable)</label>
                            <div class="icon-field  valid-field">
                                <i class="zmdi zmdi-account"></i> <input
                                    class="form-control form-control secondary-focus-border-color"
                                    id="routeNumber" type="text" name="routeNumber"
                                    value="" maxlength="50" tabindex="8"
                                    onkeydown="return M.isAlphaNumericWithNoSpecialCharacter(event);"
                                    autocomplete="off">
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
        </div>`
    return html;
}

function contractThankyouForOtherRolesModal() {
    var html = `
        <div class="modal fade" id="contractThankyouForOtherRolesModal" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" style="box-shadow: 0 0;" role="document">
                <div class="modal-content text-center" style="border-radius:12px;">
                    <div class="modal-body py-5 px-4">
                        <div class="mb-4">
                            <div style="width:70px; height:70px; background:#e6f9f0; border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto;">
                                <span style="width:40px; height:40px; background:#2ecc71; color:#fff; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:20px;">
                                    <i class="fa fa-check"></i>
                                </span>
                            </div>
                        </div>

                        <h5 class="mb-2">Thank You, ${USER_FULL_NAME}!</h5>

                        <p class="text-muted mb-4">
                            Your agreement has been submitted successfully.<br>
                            To continue the process, we kindly request you to complete your police verification by selecting the <b>Next</b> button.
                        </p>

                        <button type="button" class="btn btn-primary px-4" onClick="getOtherRolesStage3Data();">
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>`;

    return html;
}


function submitVerificationModal(){
    var html=
        `<div id="submitVerificationModal" class="modal modal-design fade" role="dialog">
            <div class="modal-dialog modal-md">
                <div class="modal-content">
                    <div class="modal-header primary-bg white-txt-color">
                        <h4 class="modal-title">Note</h4>
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <h6>
                            <b>Dear <span>${USER_FULL_NAME}</span>,<br>
                                <br>
                                Please review your documents carefully before submitting, as no changes can be made once your verification documents have been submitted.
                                <br>
                                <br>
                                Thanks<br>
                                ${SCHOOL_NAME}</b>
                        </h4>
                    </div>
                    <div class="modal-footer">
                        <button type="submit" class="btn btn-primary" onclick="saveVerificationDetails('otherRolesStage3');">Submit</button>
                    </div>
                </div>
            </div>
        </div>`
    return html;
}

function inReviewForOtherRolesVerificationModal(){
    var html=
        `<div id="inReviewForOtherRolesVerificationModal" class="modal modal-design fade" role="dialog" data-backdrop="static" data-bs-keyboard="false">
            <div class="modal-dialog modal-md">
                <div class="modal-content">
                    <div class="modal-header primary-bg white-txt-color">
                        <h4 class="modal-title">Documents Under Verification</h4>
                    </div>
                    <div class="modal-body">
                        <div class="modal-body" style="margin-top: 0 !important">
                            <p style="font: bold 16px Arial, Helvetica, sans-serif; text-align: justify">Dear 
                                <span class="text-capitalize" id="teacherFullName">${USER_FULL_NAME}</span>
                                <td></td>,<br>
                                <br>
                                Your verification documents are currently <span class="text-primary primary-txt-color">under review</span>. We will get back to you within 1 week.
                                <br>
                                <br> Thanks<br> ${SCHOOL_NAME}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>`
    return html;
}

function inReviewForOtherRolesProfessionalDetailsModal(){
    var html=
        `<div id="inReviewForOtherRolesProfessionalDetailsModal" class="modal modal-design fade" role="dialog" data-backdrop="static" data-bs-keyboard="false">
            <div class="modal-dialog modal-md">
                <div class="modal-content">
                    <div class="modal-header primary-bg white-txt-color">
                        <h4 class="modal-title">Professional Details Under Review</h4>
                    </div>
                    <div class="modal-body">
                        <div class="modal-body" style="margin-top: 0 !important">
                            <p style="font: bold 16px Arial, Helvetica, sans-serif; text-align: justify">Dear
                                <span class="text-capitalize" id="teacherFullName">${USER_FULL_NAME}</span>,<br>
                                <br>
                                Thank you for submitting your Professional Details. They are currently under admin review.
                                Please stay on this step and wait for the approval update.
                                <br>
                                <br> Thanks<br> ${SCHOOL_NAME}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>`
    return html;
}

function getOtherRolesThankYouPage(){
    var html =
        `<div class="d-flex justify-content-center align-items-center bg-light vh-100">
            <div class="bg-white p-4 rounded shadow text-center w-100" style="max-width: 550px;">
                <div class="bg-primary" style="height:6px; border-top-left-radius:10px; border-top-right-radius:10px; margin:-24px -24px 24px -24px;"></div>
                <div class="d-flex justify-content-center mb-4">
                    <div class="rounded-circle d-flex align-items-center justify-content-center" style="width:70px; height:70px; background-color:#3CC48F;">
                        <i class="fas fa-check text-white" style="font-size:28px;"></i>
                    </div>
                </div>
                <h2 class="h4 text-secondary mb-3">Thank You, ${USER_FULL_NAME}!</h2>
                <p class="text-muted mb-2">All steps completed. You’re ready for onboarding.</p>
                <p class="text-muted mb-0">Our team will contact you shortly with further instructions.</p>
            </div>
        </div>`;
    return html;
}
