var CHECK_PAYMENT_INTERVAL;
var CHECK_PAYMENT_INTERVAL_COUNT=0;

function getSchoolAdminChatButton() {
	return `<a target="_blank" href="${CHAT_URL}/onboarding-support?uuid=${UNIQUEUUID}" class="btn btn-success btn-lg btn-block btn-shadow rounded-10 mb-3 scale-animate" style="width:92%;margin:0 auto 1rem auto;font-size:15px;">
								<i class="fa fa-comments mr-2"></i>Live Chat with School Administration
							</a>`;
}

async function checkPayment(formId, userPaymentDetailsId, schoolId){
	var payload = {
		'userPaymentDetailsId' : userPaymentDetailsId,
		'schoolId' : schoolId
	};	
	$("#enrollReserveModal").modal("hide");
	$("#reserveSeatModal").modal("hide");
	var responseData = await getDashboardDataBasedUrlAndPayloadWithParentUrl(true,false,'check-payment',payload,'common');
	if (responseData.status == '0' || responseData.status == '2' || responseData.status == '3') {
		if (responseData.status == '3') {
			redirectLoginPage();
		} else {
			if (responseData.statusCode == 'OLD_FEE') {
				renderOldFeeCard(responseData);
			}else{
				showMessageTheme2(false, responseData['message']);
			}
		}
	}else{
		if(responseData.details.type == "BOOKSESSION_FEE" || responseData.details.type == "EXTENSION_FEE"){
			$('#courseFeeModalTNC').modal('hide');
			$('#bookAnEnrollmentModel').modal('hide');
			// $('#callPaymentStudentModal').modal('show');
			getPaymentGatewaysOptions(responseData.details.schoolId, responseData.details.schoolId, responseData.details.upid, responseData.details.entityType, responseData.details.entityId, responseData.details.userId)
		}else if(responseData.details.type == "REGISTRATION_FEE_ADV" || responseData.details.type ==  "REGISTRATION_FEE" || responseData.details.type == "REGISTRATION_SUBJECT_FEE_ADV"){
			if($("#bookAnEnrollmentModel").length>0){
				$("#bookAnEnrollmentModel").remove();
			}
			$("body").append(await getTNCContent(responseData));
			$('#bookAnEnrollmentModel').modal('show');
		}else{
			if($("#courseFeeModalTNC").length>0){
				$("#courseFeeModalTNC").remove();
			}
			$("body").append(await courseFeeModalTNC(responseData));
			$('#courseFeeModalTNC').modal('show');
		}
		$("#chkval").on("change", function(){
			if($("#chkval").is(":checked")){
				$("#payTabData").removeAttr("disabled");
			}else{
				$("#payTabData").attr("disabled", true);
			}
		});
		$("#bookAnEnrollmentModel #bookAnEnrollmentChkval").on("change", function(){
			if($("#bookAnEnrollmentModel #bookAnEnrollmentChkval").is(":checked")){
				$("#bookAnEnrollmentModel #bookAnEnrollmentData").removeAttr("disabled");
			}else{
				$("#bookAnEnrollmentModel #bookAnEnrollmentData").attr("disabled", true);
			}
		});
	}
}
function isPopupBlocked() {
	var popup = window.open('', '_blank');

	if (!popup || popup.closed || typeof popup.closed === 'undefined') {
		return true;
	}

	popup.close();
	return false;
}
async function invokePaymentGateway(formId, userPaymentDetailsId, paidByUserId, schoolId, paymentGateway, schoolIdOfPaymentGateway) {
    hideModalMessage('');

    if (paymentGateway == 'WELLSFARGO') {
        $('#cardHolderNameError').hide();
        $('#cardNumberError').hide();
        $('#cardExpiryMonthError').hide();
        $('#cardExpiryMonthError').hide();
        $('#cardCodeError').hide();
        if ($('#cardHolderName').val() == '' || $('#cardHolderName').val() == undefined) {
            $('#cardHolderNameError').show();
            return false;
        }
        if ($('#cardNumber').val() == '' || $('#cardNumber').val() == undefined) {
            $('#cardNumberError').show();
            return false;
        }
        if ($('#cardExpiryYear').val() == '' || $('#cardExpiryYear').val() == undefined) {
            $('#cardExpiryMonthError').show();
            return false;
        }
        if ($('#cardExpiryMonth').val() == '' || $('#cardExpiryMonth').val() == undefined) {
            $('#cardExpiryMonthError').show();
            return false;
        }
        if ($('#cardCode').val() == '' || $('#cardCode').val() == undefined) {
            $('#cardCodeError').show();
            return false;
        }
    }
	var payload = {
        location: $('#location').length > 0 ? $('#location').val() : '',
        browserDetails: userPaymentDetailsId,
        userPaymentDetailsId: userPaymentDetailsId,
        paidByUserId: paidByUserId,
        schoolId: schoolId,
        schoolIdOfPaymentGateway: schoolIdOfPaymentGateway,
        paymentGateway: paymentGateway,
        initiateVia: window.location.href.includes('fee-receipt') ? 'Link' : ''
    };

    /* =========================
       3. OPEN POPUP (SAFARI SAFE)
    ========================== */
    if (isPopupBlocked()) {
        showModalMessage(0, 'Popup blocked. Please allow popups and try again.');
        return;
    }

    var responseData;
    try {
        responseData = await getDashboardDataBasedUrlAndPayloadWithParentUrl(true,false,'invoke-payment-gateway',payload,'common');
    }catch (error) {
        console.error('Payment invoke failed:', error);
        showModalMessage(0, 'Network error. Please try again.');
        // newWindow.close();
        return;
    }
	if(responseData.status == '0' || responseData.status == '2' || responseData.status == '3') {
		if (responseData.statusCode == 'OLD_FEE') {
			renderFeeCard(responseData);
		}else{
			showModalMessage(0, responseData['message']);
		if (responseData.statusCode == 'ELIGIBLE_CUSTOME_PLAN' || responseData.statusCode == 'REDIRECT_TO_DASHBOOARD') {
			window.location.reload();
		}
        }
    }else {
        showModalMessage(1, "Please wait while redirecting to payment gateway...");
        if (responseData.details.openSelf) {
            window.location.replace(responseData.details.redirectUrl);
        } else {
            if ($(".paymentUnderProcessOverlay").length > 0) {
                $(".paymentUnderProcessOverlay").remove();
            }
            $("body").append(paymentUnderProcessOverlay());
            CHECK_PAYMENT_INTERVAL_COUNT = 0;
            CHECK_PAYMENT_INTERVAL = setInterval(() => getPaymentPaidStatus(userPaymentDetailsId, schoolId), 10000);
            window.location.href = responseData.details.redirectUrl;
        }
    }
}


function initiateOfflinePayment(formId, userPaymentDetailsId, callingFrom, paymentByUserId, gatewayName, schoolId, elementId){
	hideModalMessage('');
	if($("#"+formId+" #referenceNumber").val()=='' || $("#"+formId+" #referenceNumber").val()==undefined){
		showModalMessage(0, 'Reference Number is required');
		return false;
	}
	if($("#"+formId+" #"+elementId).text() == undefined || $("#"+formId+" #"+elementId).text() == ''){
		showModalMessage(0, 'Proof of Payment required');
		return false;
	}
	var functionName="callOfflinePayment('" + formId + "', '"+userPaymentDetailsId+"', '"+paymentByUserId+"','"+callingFrom+"', '"+paymentByUserId+"', '"+gatewayName+"', '"+schoolId+"');"
	$('#proceedStudentPayment').attr("onclick",functionName);
	$('#cancelStudentPayment').attr("onclick","$('#callPaymentStudentModal').modal({backdrop: 'static', keyboard: false});");
	$('#callPaymentStudentModal').modal('hide');
	$('#reference_number').modal('show');
}

async function callOfflinePayment(formId, userPaymentDetailsId, userId, callingFrom, paymentByUserId, gatewayName, schoolId){
	var payload = {};
	payload['userId'] = userId;
	payload['paymentByUserId'] = paymentByUserId;
	payload['userPaymentDetailsId'] = userPaymentDetailsId;
	payload['callingFrom'] = callingFrom;
	payload['gatewayName'] = gatewayName;
	payload['referenceNumber'] = $("#"+formId+" #referenceNumber").val().trim();
	if('CASH'==gatewayName){
		payload['uplaodedFileName'] =$("#"+formId+" #fileName8").html();
	}else{
		payload['uplaodedFileName'] =$("#"+formId+" #fileName9").html();
	}
	payload['amountPaid'] = $("#"+formId+" #payAmount").val();
	payload['schoolId'] = schoolId;
	
	var responseData = await getDashboardDataBasedUrlAndPayloadWithParentUrl(true,true,'offline-payment',payload,'common');
	console.log(responseData);
	if(responseData.status == "1"){
		showMessageTheme2(1,"Your Payment is under review.");
		$('#callPaymentStudentModal, #paymentOptionsModal, #courseFeeModalTNC').modal('hide');
		$('#payNowBtn').hide();
		$('#logout_modal_logout').modal('hide');
		setTimeout(function(){
			$('#logout_modal_logout').modal('show');
		},1000);
		if('CASH'==gatewayName){
			$('#logout_modal_logout_cash').modal('hide');
			setTimeout(function(){
				$('#logout_modal_logout_cash').modal('show');
			},1000);
		}
	}
}

function getRequestForOfflinePayment(formId, userPaymentDetailsId, userId, callingFrom, paymentByUserId, gatewayName, schoolId) {
	var offlinePaymentRequest = {};
	offlinePaymentRequest['userId'] = userId;
	offlinePaymentRequest['paymentByUserId'] = paymentByUserId;
	offlinePaymentRequest['userPaymentDetailsId'] = userPaymentDetailsId;
	offlinePaymentRequest['callingFrom'] = callingFrom;
	offlinePaymentRequest['gatewayName'] = gatewayName;
	offlinePaymentRequest['referenceNumber'] = $("#"+formId+" #referenceNumber").val().trim();
	if('CASH'==gatewayName){
		offlinePaymentRequest['uplaodedFileName'] =$("#"+formId+" #fileName8").html();
	}else{
		offlinePaymentRequest['uplaodedFileName'] =$("#"+formId+" #fileName9").html();
	}
	offlinePaymentRequest['amountPaid'] = $("#"+formId+" #payAmount").val();
	offlinePaymentRequest['schoolId'] = schoolId;
	return offlinePaymentRequest;
}

function continueWorking(){
	$('#logout_modal_logout').modal('hide');
	customLoader(true);
	setTimeout(function(){
		window.location.reload();
	},1000);
}

function showAlternatePG(){
	$('#primary-pg').hide(1000)
	$('#alternate-pg').show(1000);
}
function showPrimaryPG(){
	$('#primary-pg').show(1000);
	$('#alternate-pg').hide(1000)
}

async function getAirwallexMethods(buttonId, schoolId){
	var counrtyCode;
	if($("#location").val() == ""){
		counrtyCode = getCountryISOCode();
	}else{
		counrtyCode = JSON.parse($("#location").val()).countryCode;
	}
	$.ajax({
        url: `${APP_BASE_URL}${SCHOOL_UUID}/get-airwallex-payment-methods?schoolId=${btoa(schoolId)}&countryCode=${btoa(counrtyCode)}`,
        type: 'GET',
        dataType: 'json',
        success: function(response) {
			var html = '';
            if (response.methods && response.methods.length > 0) {
                $.each(response.methods, function (index, method) {
                    html+=
					`<a href="javascript:void(0);" onclick="commonPayment('${buttonId}')" class="">
						<div class="payment-method-icon h-100">`;
							if(method.image == ""){
								html+=`<p style="font-size: 14px;">${method.labelName}</p>`
							}else{
								html+=
								`<img src="${PATH_FOLDER_IMAGE2}payment-gateway/${method.image}">
								<p>${method.labelName}</p>`
							}
						html+=`</div>
					</a>`;
                });
            } else {
                html+='<div>No Payment Methods Available</div>';
            }
            $("#paymentMethods").html(html);
		}
	})
}

function commonPayment(payBtnID){
	$("#"+payBtnID).trigger("click");
}

async function getPaymentGatewaysOptions(schoolIdOfPaymentGateway, schoolId, userPaymentDetailsId, entityType, entityId, paidByUserId) {
	hideMessage('');
	var payload ={
		'userPaymentDetailsId' : userPaymentDetailsId,
		'entityType' : entityType,
		'entityId' : entityId,
		'paidByUserId' : paidByUserId,
		'schoolIdOfPaymentGateway' : schoolIdOfPaymentGateway,
		'schoolId' : schoolId
	}
	$("#enrollReserveModal").modal("hide");
	$("#reserveSeatModal").modal("hide");
	$("#bookAnEnrollmentModel").modal("hide");
	var responseData = await getDashboardDataBasedUrlAndPayloadWithParentUrl(true,false,'payment-gateway/options',payload,'common');
	if (responseData['status'] == '0' || responseData['status'] == '2' || responseData['status'] == '3') {
		if (responseData['status'] == '3') {
			redirectLoginPage();
		}else if(responseData['statusCode'] == "FLAGGED"){
			$("#flaggedModal").remove();
			$("body").append(flaggedModalContent(responseData));
			$("#flaggedModal").modal("show");
			return false;
			// $(".step-3-skeleton").hide();
			// $("#signupStage3").hide();
			// $("#signupStage2").show();
			// setActiveStep(2);
			// $(".prev-btn, .next-btn").removeClass("disabled");
		} else {
			showMessageTheme2(false, responseData['message']);
		}
	}else{
		if($('#paymentOptionsModal').length > 0) {
			$('#paymentOptionsModal').remove();
		}
		$("body").append(await getPaymentGatewayOptionsModal(responseData.details));
		await callLocationForPaymentPromise();
		if($("#bookAnEnrollmentModel").hasClass("show")){
			$("#bookAnEnrollmentModel").modal("hide");
		}
		setTimeout(function(){
			$('#paymentOptionsModal').modal({ backdrop: 'static', keyboard: false });
		}, 700);
		$.each(responseData.details.paymentOptions, function(k,v){
			if(v.name=='Airwallex'){
				getAirwallexMethods('payButton'+(k+1), schoolIdOfPaymentGateway);
			}else if(v.name=='CASH'){
				bindFileUploadNew1('8', '32', responseData.details.userId, 4, true);
			}else if(v.name=='WIRETRANSFER'){
				bindFileUploadNew1('9', '33', responseData.details.userId, 4, true);
			}
		});
	}
}

async function getPaymentGatewayOptionsModal(details){
	var schoolSettingsTechnical = await getSchoolSettingsTechnical(SCHOOL_ID);
	var html=
	`<div id="paymentOptionsModal" class=" modal theme-modal fade payment-opiton-modal" role="dialog" data-backdrop="static" data-keyboard="false" style="overflow: auto;">
		<div class="modal-dialog modal-xl">
			<div class="modal-content">
				<div class="modal-header py-2 primary-bg white-txt-color">
					<button type="button" class="close" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true" style="color: #fff;">×</span>
					</button>
					<h4 class="modal-title" style="font-size: 14px">&nbsp;</h4>
				</div>
				<div class="modal-body" style="margin-top: 0 !important; position: relative; padding: 15px !important;">
					<section class="payment-option-wrapper">
						<div class="full">
							<h4 class="section-heading primary-bg-before primary-bg-after">Choose Your Payment Method</h4>
							<span style="width:100%;display:inline-block; font-size:13px"> ${ SCHOOL_ID == 1 ? 'Powered by Trusted Global Payment Gateways.' : details.schoolNameOfPaymentGateway + ' is trusted by the safest and most reputed payment gateway and bank' } </span>
						</div>
						<div class="tab-wrapper">
							<div class="payment-tabs">
								<ul class="nav nav-tabs" role="tablist">`;
									$.each(details.paymentOptions, function(k,v){
										html+=
										`<li role="presentation" class="nav-item">
											<a href="#payment_option_${k+1}" aria-controls="paymentOption${k+1}" role="tab" data-toggle="tab" class="payment-tab-mobile-view payment-option-itme secondary-border-color ${k==0?'active':''}">Choose ${k+1}: Pay via ${toTitleCase(v.name)}</a>
										</li>`;
									});
									html+=
								`</ul>
							</div>
							<div class="payment-option tab-content">`;
								$.each(details.paymentOptions, function(k,v){
									html+=
									`<div role="tabpanel" id="payment_option_${k+1}" class="tab-pane ${k==0?'active':''} credit-card-payment flex-item secondary-border-color h-100">
										<div id="primary-pg" style="display:block;">`
											if(v.name=='STRIPE' || v.name=='Airwallex' || v.name=='YOCO' || v.name=='WIRETRANSFER' || v.name=='CONVERA'){
												html+=`
												<div class="payment-icon lg">
													<img src="${PATH_FOLDER_IMAGE2}${v.icon}">
												</div>`;
												if(v.name=='STRIPE' || v.name=='YOCO'){
													html+=
													`<div class="payment-icon m-0">
														<div class="payment-method-icon" onclick="commonPayment('payButton${k+1}')" style="cursor:pointer">
															<img src="${PATH_FOLDER_IMAGE2}visa.png">
															<p>Visa</p>
														</div>
														<div class="payment-method-icon" onclick="commonPayment('payButton${k+1}')" style="cursor:pointer">
															<img src="${PATH_FOLDER_IMAGE2}master-card.png">
															<p>Mastercard</p>
														</div>
													</div>`;
												}else if(v.name=='Airwallex'){
													html+=`<div id="paymentMethods" class="payment-icon m-0 align-items-stretch"></div>`;
												}
											}
											if(v.name=='CONVERA'){
												html+=`
												<div class="full lg">`;
													html+=v.addtionalDetails;
												html+=	
												`</div>
												<div class="payment-icon" style="margin-bottom:0">
													<h3 class="fw-600 text-left">Pay money from the comfort of your own home - Reliable, convenient international money transfer using your home/local currency</h3>
													<p>&nbsp;</p>
													<div class="row">
														<div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
															<ul class="full mt-4">
																<li>
																	<h4 class="fw-600 text-left full">Step 1</h4>
																	<strong class="full">Select your preferred currency and click on Get Quote</strong>
																</li>
																<p style="margin:0">&nbsp;</p>
																<li>
																	<h4 class="fw-600 text-left full">Step 2</h4>
																	<strong class="full">Verify your details – Student Name, Registered Email.</strong>
																</li>
																<li>
																	<br/>
																	<p>You can use a wide variety of services to complete your transactions. You can pay with your bank account or a credit/debit card* or use cash at your nearest in-person Convera agent location.</p>
																</li>
															</ul>
														</div>
														<div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
														</div>
													</div>
												</div>
												<div class="payment-icon m-0">
													<div class="payment-method-icon" onclick="commonPayment('payButton${k+1}')" style="cursor:pointer">
														<img src="${PATH_FOLDER_IMAGE2}visa.png">
														<p>Visa</p>
													</div>
													<div class="payment-method-icon" onclick="commonPayment('payButton${k+1}')" style="cursor:pointer">
														<img src="${PATH_FOLDER_IMAGE2}master-card.png">
														<p>Mastercard</p>
													</div>
												</div>`;
											}else if(v.name=='WIRETRANSFER'){
												html+=`
													<div class="full">`;
														if(v.additionalDetails!=''){
															html+=`${v.additionalDetails}`;
														}else{
															html+=
															`<p>Here are the banking instructions for your payment:</p>
															<ul>
																<li>
																	<strong>Provide your bank details</strong>
																</li>
															</ul>`;
														}
														html+=
														`<p>Please clearly identify Student Name and City/State/Country in the reference information that accompanies the bank transfer, so that we can properly credit your account.</p>
														<p>Your SMS profile will be created after the complete payment is processed in ${SCHOOL_NAME}\'s bank Account</p>
													</div>
													<div class="payment-form mt-0">
														<form id="wirePaymentForm" name="wirePaymentForm">
															<ul>
																<li>
																	<label>Payable Fee &nbsp;<b>${schoolSettingsTechnical.currencyIsoCode}</b></label>
																	<input type="text" name="payAmount" disabled placeholder="Fee" id="payAmount" required="" value="${details.payAmount}">
																</li>
																<li>
																	<label>Reference Number</label>
																	<input type="text" id="referenceNumber" name="referenceNumber" placeholder="Reference Number" maxlength="150" required="" onKeyDown="hideModalMessage(\'\');">
																</li>
																<li>
																	<label>Proof of Payment</label>
																	<div class="upload-btn-wrapper">
																		<div class="file-btn">
																			<span id="fileName9" class="fileName" style="display: none;"></span>
																			<input type="file" name="fileupload9" id="fileupload9" value="Upload Proof of Payment"/>
																			<span class="btn primary-bg white-txt-color">Upload Proof of Payment</span>
																		</div>
																		<div id="divshowDocument9" class="custom-btn mr-2 rounded pr-0" style="display: none;">
																			<div>
																				<a id="showDocument9" href="javascript:showDocument(\'\');" target="_self" data-toggle="tooltip" title="View">
																					<i class="fa fa-eye"></i>
																				</a>
																			</div>
																		</div>
																		<div id="divdeleteDocument9" class="custom-btn mr-2 rounded pr-0" style="display: none;">
																			<div>
																				<a id="deleteDocument9" href="javascript.void(0)" data-toggle="tooltip" title="Delete">
																					<i class="fa fa-trash"></i>
																				</a>
																			</div>
																		</div>
																		<p>Please upload files in following formats (jpg, jpeg, pdf or png) with maximum size of 5 MB</p>
																	</div>
																</li>
																<li>
																	<label>&nbsp;</label>
																	<div class="pay-now-btn secondary-border-color">
																		<span class="btn ref-no-btn primary-bg white-txt-color" data-toggle="modal" onclick="initiateOfflinePayment('wirePaymentForm','${details.upid}','signup','${details.userId}','${v.name}','${details.schoolId}', 'fileName9');">Submit</span>
																	</div>
																</li>
															</ul>
														</form>
													</div>
												`;
											}else if(v.name=='CASH'){
												html+=`
													<div class="payment-icon lg">
														<img src="${PATH_FOLDER_IMAGE2}${v.icon}">
													</div>
													<div class="payment-form mt-0">
														<form id="cashPaymentForm" name="cashPaymentForm">
															<ul>
																<li>
																	<label>Payable Fee &nbsp;<b>${schoolSettingsTechnical.currencyIsoCode}</b></label>
																	<input type="text" name="payAmount" disabled placeholder="Fee" id="payAmount" required="" value="${details.payAmount}">
																</li>
																<li>
																	<label>Reference Number</label>
																	<input type="text" id="referenceNumber" name="referenceNumber" placeholder="Reference Number" maxlength="150" required="" onKeyDown="hideModalMessage(\'\');">
																</li>
																<li>
																	<label>Proof of Payment</label>
																	<div class="upload-btn-wrapper">
																		<div class="file-btn">
																			<span id="fileName8" class="fileName" style="display: none;"></span>
																			<input type="file" name="fileupload8" id="fileupload8" value="Upload Proof of Payment"/>
																			<span class="btn primary-bg white-txt-color">Upload Proof of Payment</span>
																		</div>
																		<div id="divshowDocument8" class="custom-btn mr-2 rounded pr-0" style="display: none;">
																			<div>
																				<a id="showDocument8" href="javascript:showDocument(\'\');" target="_self" data-toggle="tooltip" title="View">
																					<i class="fa fa-eye"></i>
																				</a>
																			</div>
																		</div>
																		<div id="divdeleteDocument8" class="custom-btn mr-2 rounded pr-0" style="display: none;">
																			<div>
																				<a id="deleteDocument8" href="javascript.void(0)" data-toggle="tooltip" title="Delete">
																					<i class="fa fa-trash"></i>
																				</a>
																			</div>
																		</div>
																		<p>Please upload files in following formats (jpg, jpeg, pdf or png) with maximum size of 5 MB</p>
																	</div>
																</li>
																<li>
																	<label>&nbsp;</label>
																	<div class="pay-now-btn secondary-border-color">
																		<span class="btn ref-no-btn primary-bg white-txt-color" data-toggle="modal" onclick="initiateOfflinePayment('cashPaymentForm','${details.upid}','signup','${details.paidByUserId}','${v.name}','${details.schoolId}','fileName8');"">Submit</span>
																	</div>
																</li>
															</ul>
														</form>
													</div>
												`;
											}
											if(v.name=='Airwallex'){
												html+=`
												<div class="payment-icon justify-content-sm-end justify-content-center " style="margin-bottom:0px; margin-top:30px">
													<div id="payButton${k+1}" class="smoov lg white-txt-color" onclick="invokePaymentGateway('signupStage4','${details.upid}','${details.paidByUserId}','${details.schoolId}','${v.name}','${details.schoolIdOfPaymentGateway}');">
														<span class="paypal-button-text" optional="" style="font-size: 14px; color:#fff; vertical-align: bottom;">Pay Now</span>
													</div>
												</div>`;
											}
											else if(v.name=='YOCO'){
												 html+= `
												<div class="payment-icon justify-content-sm-end justify-content-center " style="margin-bottom:0px; margin-top:30px" style="display:none;">
													<div id="payButton${k+1}" class="smoov lg white-txt-color">
														<span class="paypal-button-text" optional="" style="font-size: 14px; color:#fff; vertical-align: bottom;">Pay Now</span>
													</div>
												</div>`;
											}
											else if(v.name=='STRIPE' || v.name=='CONVERA'){
												html+=
												`<div class="payment-icon justify-content-sm-end justify-content-center" style="margin-bottom:0px; margin-top:30px">
													<div id="payButton${k+1}" class="smoov lg white-txt-color" onclick="invokePaymentGateway('signupStage4','${details.upid}','${details.paidByUserId}','${details.schoolId}','${v.name}','${details.schoolIdOfPaymentGateway}');">
														<span class="paypal-button-text" optional="" style="font-size: 14px; color:#fff; vertical-align: bottom;">Pay Now</span>
													</div>
												</div>`;
											}
											html+=
										`</div>
									</div>`;
								});
								html+=
							`</div>
						</div>
					</section>
				</div>
				<div class="modal-footer">
					<div style="display:flex;flex-wrap:wrap;margin-right:auto; justify-content: center;">
						<span style="display:inline-flex;align-items:self-start; margin-right:8px;font-weight:bold">
							<i class="fa fa-lock" style="position:relative;top:3px"></i>
							<span style="display: inline-flex;padding: 0px 5px; text-align:left;">SSL Secured &nbsp;<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-check-big text-green-500 fill-green-200"><path d="M21.801 10A10 10 0 1 1 17 3.335"></path><path d="m9 11 3 3L22 4"></path></svg></span>
							
						</span>
						<span style="display:inline-flex;align-items:self-start; margin-right:8px;position:relative;top:0px;font-weight:bold">
							<svg xmlns="http://www.w3.org/2000/svg" style="position:relative;top:3px" width="17px" height="17px" viewBox="0 0 64 64" stroke-width="6" stroke="#000" fill="none"><path d="M32.39,7.32,14,15a1,1,0,0,0-.61.92V32.23h0A22.87,22.87,0,0,0,24.58,51.9l8.17,4.86,8.06-4.84A22.89,22.89,0,0,0,51.9,32.31V15a1,1,0,0,0-.65-.94L33.12,7.3A1,1,0,0,0,32.39,7.32Z"/><path d="M32.83,17.92l3.64,7.37a.16.16,0,0,0,.1.08l8.14,1.18a.13.13,0,0,1,.07.23L38.9,32.51a.12.12,0,0,0,0,.12l1.39,8.1a.14.14,0,0,1-.2.15l-7.27-3.83a.15.15,0,0,0-.13,0l-7.27,3.83a.14.14,0,0,1-.2-.15l1.39-8.1a.15.15,0,0,0,0-.12l-5.88-5.73a.13.13,0,0,1,.07-.23l8.13-1.18a.15.15,0,0,0,.11-.08l3.63-7.37A.13.13,0,0,1,32.83,17.92Z" stroke-linecap="round"/></svg>
							<span style="display: inline-flex; text-align:left;">PCI-DSS Certified &nbsp;<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-check-big text-green-500 fill-green-200"><path d="M21.801 10A10 10 0 1 1 17 3.335"></path><path d="m9 11 3 3L22 4"></path></svg></span>
							
						</span>
						<span style="display:inline-flex;align-items:self-start; margin-right:8px;font-weight:bold">
							<i class="fa fa-globe" style="position:relative;top:3px"></i>
							<span style="display: inline-flex;padding: 0px 5px; text-align:left;">Global Gateways &nbsp;<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-check-big text-green-500 fill-green-200"><path d="M21.801 10A10 10 0 1 1 17 3.335"></path><path d="m9 11 3 3L22 4"></path></svg></span>
							
						</span>
					</div>
				</div>
			</div>
		</div>
	</div>`;
	return html;	
}

async function getTNCContent(responseData){
	var schoolSettingsTechnical = await getSchoolSettingsTechnical(SCHOOL_ID);
	var schoolSettingsLinks = await getSchoolSettingsLinks(SCHOOL_ID);
	const { details: { type, paymentName, registrationType, schoolId, upid, entityType, entityId, userId }} = responseData;
	var html=
	`<div id="bookAnEnrollmentModel" class="modal fade" role="dialog">
		<div class="modal-dialog modal-xl">
			<div class="modal-content">
				<div class="modal-header py-2 bg-primary text-white d-flex">
					<h5 class="modal-title">`;
						if(type == 'REGISTRATION_FEE' || type == 'REGISTRATION_FEE_ADV'){
							var paymentNameBycondition="";
							if(type == 'REGISTRATION_FEE'){
								paymentNameBycondition = 'Reserve an Enrollment Seat';
							}else if(type == 'REGISTRATION_FEE_ADV'){
								paymentNameBycondition = 'Reserve an Enrollment Seat - Advance';
							}
							html+=`Further to my successful completion of the ‘${paymentNameBycondition}’ process with ${SCHOOL_NAME}, I agree to comply with the following as stated below, without any exceptions:`;
						}
						else if(type == 'REGISTRATION_SUBJECT_FEE' || type == 'REGISTRATION_SUBJECT_FEE_ADV'|| type == 'CUSTOMIZED_REGISTRATION_SUBJECT_FEE' || type == 'SUBJECT_FEE'|| type == 'SUBJECT_FEE_ADV' || type == 'CUSTOMIZED_SUBJECT_FEE'){
							if(((type == 'REGISTRATION_SUBJECT_FEE' || type == 'CUSTOMIZED_REGISTRATION_SUBJECT_FEE') && (registrationType != 'REGISTRATION_FRESH') && (registrationType != 'REGISTRATION_FLEX_COURSE')) || type == 'REGISTRATION_SUBJECT_FEE_ADV' ){
								html+=`Further to my Enrollment with ${SCHOOL_NAME},I agree to comply with the following as stated below, without any exceptions:`;
							}else{
								html+=`Fee Refund Policy`;
							}
						}
						else if(type == 'EVALUATION_TEST'){
							html+=`Fee Refund Policy And Terms & Conditions For ${schoolSettingsTechnical.evaluationModTermsName}`;
						}
						else if(type == 'BOOKSESSION_FEE'){
							html+=`Fee Refund Policy And Terms & Conditions For Extra Class Fee`;
						}else if(type == 'EXTENSION_FEE'){
							html+=`Fee Refund Policy And Terms & Conditions For Academic Year Extension`;
						}else{
							html+=`Fee Refund Policy And Terms & Conditions For ${paymentName}`;
						}
					html+=`</h5>
					<button type="button" class="close" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true" style="color: #fff;">×</span>
					</button>
				</div>
				<div class="modal-body">
					<form id="bookAnEnrollmentPayment" name="bookAnEnrollmentPayment" method="post" autocomplete="off">
						<div class="full" style="max-height: 400px;overflow-y: auto;">
							<input type="hidden" id="userId" value="${userId}" />
							<div class="agree">`;
								if(type == 'REGISTRATION_FEE' || type == 'REGISTRATION_FEE_ADV'){
									var paymentNameBycondition="";
									if(type == 'REGISTRATION_FEE'){
										paymentNameBycondition = 'Reserve an Enrollment Seat';
									}else if(type == 'REGISTRATION_FEE_ADV'){
										paymentNameBycondition = 'Reserve an Enrollment Seat - Advance';
									}
									
									html+=
									`<ol class="ol-style">
										<li class="mb-1">I understand that by paying the ‘${paymentNameBycondition}’ Fee, I am only reserving my Enrollment Seat at ${SCHOOL_NAME} and I will only get access to the learning platform once the Course Fee is paid in full.</li>
										<li class="mb-1">I may be asked to provide additional information, and documents ( including but not limited to Age Proof, Address Proof, and Last Academic Proof) in support of the information provided by me (especially related to but not limited to academic credentials, coursework and other relevant information in support of my eligibility/candidature with ${SCHOOL_NAME}) especially if the information provided by me is incomplete, inconsistent (or with discrepancies) or not as per the prescribed requirements of ${SCHOOL_NAME}.</li>
										<li class="mb-1">I will not misrepresent any facts or details to ${SCHOOL_NAME}. and not forge/misrepresent any documents, signatures, or credentials and any deviation from the above (or from any other truthful representation of details) shall render my candidature to be canceled (null/void) by ${SCHOOL_NAME} with immediate effect upon discovery of such misrepresentation(s).</li>
										<li class="mb-1">I understand that all materials of ${SCHOOL_NAME} (including but not limited to all study materials used by me during my learning/coursework) are the sole and complete property of ${SCHOOL_NAME} and I will not make any ‘commercial’ use of any of the ${SCHOOL_NAME} courses, assignments, audio-visual resources, materials, or any other collaterals.</li>
										<li class="mb-1">I understand that the ‘${paymentNameBycondition}’ amount will be deducted from the Course Fee (which is subject to changes) once paid.</li>
										<li class="mb-1">Under any circumstances/conditions, the fee paid for ‘${paymentNameBycondition}’ is non-refundable, non-transferable and non-adjustable.</li>
										<li class="mb-1">It is my responsibility, as a student (or parent/guardian), to regularly check the website for any upcoming notifications. I understand and agree that ${SCHOOL_NAME} will not send me notifications or updates separately.</li>
										<li class="mb-1">${SCHOOL_NAME} reserves the right to amend, limit or revoke this offer at any time prior to purchase and accepts no responsibility for any technical issues resulting in the failure to pay.</li>
									</ol>`;
								}else if(type == 'REGISTRATION_SUBJECT_FEE' || type == 'REGISTRATION_SUBJECT_FEE_ADV' || type == 'CUSTOMIZED_REGISTRATION_SUBJECT_FEE' || type == 'SUBJECT_FEE'|| type == 'SUBJECT_FEE_ADV'|| type == 'CUSTOMIZED_SUBJECT_FEE'){
									if(((type == 'REGISTRATION_SUBJECT_FEE' || type == 'CUSTOMIZED_REGISTRATION_SUBJECT_FEE') && (registrationType != 'REGISTRATION_FRESH') && (registrationType != 'REGISTRATION_FLEX_COURSE')) || type == 'REGISTRATION_SUBJECT_FEE_ADV'){
										html+=
										`<div class="terms-policy" style="font-size: 12px;" >
											I as a parent/guardian/student:
											<ol style="padding-left: 35px !important;margin-bottom: 16px;">
												<li style="margin-bottom: 2px;position: inherit;float: inherit;text-align: justify;">Declare that I have digitally signed this legal document (`;
													if(schoolSettingsLinks.enrollmentPolicyUrl != ""){
														html+=`<a class="theme-text" href="${schoolSettingsLinks.enrollmentPolicyUrl}" style="font-size: 12px;" target="_blank" >Service Agreement - Parent/Guardian/Student</a>`;
													}
												html+=`) with my full consent.</li>
												<li style="margin-bottom: 2px;position: inherit;float: inherit;text-align: justify">Declare that I have read and agree to the`;
													if(schoolSettingsLinks.schoolPolicyUrl != ""){
														html+=`<a class="theme-text" href="${schoolSettingsLinks.schoolPolicyUrl}" style="font-size: 12px;" target="_blank" >School Policies</a>
														, <a class="theme-text" href="${schoolSettingsLinks.studentPolicytUrl}" style="font-size: 12px;" target="_blank" >Academic Integrity & Student Code of Conduct</a>`;
													}
													if(schoolSettingsLinks.termasOfUserUrl){
														html+=`, <a class="theme-text" href="${schoolSettingsLinks.termasOfUserUrl}" style="font-size: 12px;" target="_blank" >Terms of Use</a>`;
													}
													if(schoolSettingsLinks.privacyPolicyUrl != ""){
														html+=`, and <a class="theme-text" href="${schoolSettingsLinks.privacyPolicyUrl}" style="font-size: 12px;" target="_blank" >Privacy Policy.</a>`;
													}
												html+=`</li>
												<li style="margin-bottom: 2px;position: inherit;float: inherit;text-align: justify">Declare all information provided by me in any of the steps of the Enrollment Form are true, complete and correct to the best of my own knowledge and belief. I understand that in the event of any information being found suppressed/false or incorrect or any ineligibility detected at the time or after the enrollment, my enrollment (or that of my child/ward, as the case may be) is liable to be canceled with immediate effect</li>
											</ol>
											<div class="custom-checkbox-policy text-dark">
												<input type="checkbox" name="bookAnEnrollmentChkval" id="bookAnEnrollmentChkval" required tabindex="7">
												<label class="mb-0" for="bookAnEnrollmentChkval">By checking this box, I have read & agree to the above-mentioned terms and conditions.</label>
											</div>
											${/*<input type="checkbox" name="bookAnEnrollmentChkval" id="bookAnEnrollmentChkval" required tabindex="7" style="position: relative;top:3px">4 By checking this box, I have read & agree to the above-mentioned terms and conditions. */''}
										</div>
										<div class="full mt-2">
											<button type="button" id="bookAnEnrollmentData" class="btn btn-success " disabled="disabled" onclick="getPaymentGatewaysOptions(${schoolId},${schoolId},'${upid}','${entityType}','${entityId}','${userId}');">Proceed</button>
										</div>`;
									}else{
										html+=
										`<div class="px-3">
										<ol class="pl-4 ol-style">
											<li class="mb-1"> We provide a no-questions asked 100 percent refund (except Enrollment Fee/Reserve an Enrollment Seat Fee which cannot be refunded under any circumstances) for the FIRST 24 HOURS AFTER ENROLLMENT.</li>
											<li class="mb-1">Only those students (or parents/guardians) who have chosen the One-time Payment option are eligible for any refunds, subject to other terms & conditions being met/satisfied. NO REFUND will be processed if a student (or parent/guardian) has chosen to pay in installments.</li>
											<li class="mb-1">Refund requests must be initiated within 90 days of payment from the academic year start date (the academic year start date is counted as day 1). No refund can be claimed after completion of 90 days of enrollment. Days imply Calendar Days and are calculated on a 24-hour basis, irrespective of time zone.</li>
											<li class="mb-1">The student (or parent/guardian) must send the notice of cancellation via email at <a href="mailto:${schoolSettingsOffice.contactEmail}" class="text-primary">${schoolSettingsOffice.contactEmail}</a> with the subject as ‘Request for Cancellation’.</li>
										</ol>
										<table id="feeTableTermsCondition" class="table">
											<thead class="bg-primary text-white p-1">
												<tr>
													<th>Period After Enrollment*</th>
													<th>% of Course Fee Refunded</th>
												</tr>
											</thead>
											<tbody>
												<tr>
													<td>Within 15 days**</td>
													<td>50</td>
												</tr>
												<tr>
													<td>Within 16-30 days**</td>
													<td>35</td>
												</tr>
												<tr>
													<td>Within 31-60 days**</td>
													<td>25</td>
												</tr>
												<tr>
													<td>Within 61-90 days**</td>
													<td>15</td>
												</tr>
												<tr>
													<td>After 90 days**</td>
													<td>0</td>
												</tr>
											</tbody>
										</table>
										<p class="m-0">* The refund/withdrawal must be initiated within the time frame.</p>
										<p class="m-0">**(Calendar) Days are calculated on a 24-hour basis, irrespective of time zone.</p>

										<div class="mt-3">
											<p class="m-0 text-primary font-weight-bold">While mailing us your withdrawal request, kindly follow the following format to ease the process of refund (if any).</p>
											<ul class="my-2">
												<li>ACCOUNT HOLDER NAME:</li>
												<li>BANK NAME:</li>
												<li>BANK SWIFT CODE:</li>
												<li>ACCOUNT NUMBER:</li>
												<li>BANK BRANCH NAME:</li>
												<li>BANK BRANCH STREET ADDRESS:</li>
												<li>BANK BRANCH STREET CITY:</li>
												<li>BANK BRANCH STREET STATE OR PROVINCE:</li>
												<li>BANK BRANCH POSTAL CODE:</li>
												<li>BANK BRANCH STREET COUNTRY:</li>
												<li>ABA/ROUTING NUMBER (If applicable):</li>
												<li>BENEFICIARY STREET ADDRESS:</li>
												<li>BENEFICIARY CITY:</li>
												<li>BENEFICIARY STATE OR PROVINCE:</li>
												<li>BENEFICIARY POSTAL CODE:</li>
												<li>BENEFICIARY COUNTRY:</li>
												<li>BENEFICIARY PHONE NUMBER:</li>
												<li>ENROLLED GRADE/COURSE:</li>
											</ul>
											<ol class="pl-3 py-2 ol-style">
												<li class="mt-2">Kindly note that a refund will be made (if any) ONLY to the bank account from which the fee was paid. The refund amount (if any) will be exclusive of the handling fee & transaction fee. Without the specified format, the request will not be entertained.</li>
												<li class="mt-2">Note: In case of concealment/misrepresentation of personal, academic, or any other detail by the student/guardian or/and in case of submission of false/fake documents by student/guardian, no refund shall apply.</li>
												<li class="mt-2">Note: No refund of the Enrollment Fee/Reserve an Enrollment Seat Fee will be made under any circumstances.</li>
												<li class="mt-2">Students (or their parents/guardians) are responsible for regularly checking the website for any upcoming notifications. ${SCHOOL_NAME} will not send notifications or updates separately to students (or their parents/guardians)..</li>
												<li class="mt-2">${SCHOOL_NAME} reserves the right to amend, limit or revoke any offers or terms at any time prior to purchase and accepts no responsibility for any technical issues resulting in the failure to pay.</li>
											</ol>
										</div>
									</div>`;
									}
								}else if(type == 'EVALUATION_TEST'){
									html+=
									`<div class="">
										<p class="m-0 font-weight-bold">Please note the important fee refund policy and terms & conditions mentioned below before paying for the ${schoolSettingsTechnical.evaluationModTermsName}:</p>
										<ol class="font-12 mt-2 pl-4 ol-style">
											<li class="mb-1">After receiving the payment, our team will reach out to you to confirm the appointment and provide you with the link to join the same.</li>
											<li class="mb-1">Kindly note that your enrollment will be based on your performance in the ${schoolSettingsTechnical.evaluationModTermsName}.</li>
											<li class="mb-1">The fee paid for the ${schoolSettingsTechnical.evaluationModTermsName} is separate from all other fees (included but not limited to course fee, enrollment fee) and is non-refundable, non-transferable and non-adjustable.</li>
											<li class="mb-1">In case you do not appear for the ${schoolSettingsTechnical.evaluationModTermsName} at the scheduled appointment, you will be given only one more chance to appear for the ${schoolSettingsTechnical.evaluationModTermsName}. The second appointment must be fixed within 7 days from the first appointment, based on the convenience of the ${SCHOOL_NAME} Team.</li>
											<li class="mb-1">In case you do not appear for the second appointment as well, the fee will be forfeited.</li>
											<li class="mb-1">The ${schoolSettingsTechnical.evaluationModTermsName} result is final and binding and no communication regarding the result will be entertained.</li>
											<li class="mb-1">The ${schoolSettingsTechnical.evaluationModTermsName} is only meant for the purpose of checking the eligibility of the student for the respective grade and the examiner of the ${schoolSettingsTechnical.evaluationModTermsName} may or may not issue a recommendation to the student based on his/her performance in the test. The ${schoolSettingsTechnical.evaluationModTermsName} is not meant to be a supplement to any other test and no transcript for the ${schoolSettingsTechnical.evaluationModTermsName} will be issued.</li>
											<li class="mb-1">The result of the ${schoolSettingsTechnical.evaluationModTermsName} is valid for enrollment to the respective grade of ${SCHOOL_NAME}, for 60 days from the date of issuance.</li>
											<li class="mb-1">In case you are found seeking help or using any unfair means or assistance during the ${schoolSettingsTechnical.evaluationModTermsName}, the fee will be forfeited and the test will be declared null and void.</li>
											<li class="mb-1">Students (or their parents/guardians) are responsible for regularly checking the website for any upcoming notifications. ${SCHOOL_NAME} will not send notifications or updates separately to students (or their parents/guardians)..</li>
											<li class="mb-1">${SCHOOL_NAME} reserves the right to amend, limit or revoke any offers or terms at any time prior to purchase and accepts no responsibility for any technical issues resulting in the failure to pay.</li>
										</ol>
									</div>`;
								}else if(type == 'BOOKSESSION_FEE'){
									hmtl+=
									`<div class="">
										<p class="m-0 font-weight-bold">Please note the important fee refund policy and terms & conditions before enrolling for Extra Classes:</p>
										<ol class="font-12 mt-2 pl-4 ol-style">
											<li class="mb-1">Extra Classes are defined as doubt-clearing classes which are in addition to your complimentary classes. For example, 2 extra classes per week mean 1 complimentary doubt-clearing class + 2 extra doubt-clearing classes = 3 doubt-clearing classes per week.</li>
											<li class="mb-1">Students have to pay in full for the Extra Classes in advance.</li>
											<li class="mb-1">Fees will be accepted through online payment methods only.</li>
											<li class="mb-1">All your Extra Classes will be pre-booked at the beginning of every month. You will be notified duly about your Extra Classes Schedule via mail.</li>
											<li class="mb-1">In case you want to change the date and/or timings of your Extra Class(s), you will have to inform ${SCHOOL_NAME} via mail at least 7 days in advance.</li>
											<li class="mb-1">Under any circumstances/conditions, fee for Extra Class is non-refundable, non-transferable and non-adjustable. Absence is not valid for any compensation class or refund of fee.</li>
											<li class="mb-1">The class will be compensated only if it is canceled by ${SCHOOL_NAME}. The compensation will occur only through policies of ${SCHOOL_NAME}. You cannot claim a refund of fees in such cases.</li>
											<li class="mb-1">Students (or their parents/guardians) are responsible for regularly checking the website for any upcoming notifications. ${SCHOOL_NAME} will not send notifications or updates separately to students (or their parents/guardians)..</li>
											<li class="mb-1">${SCHOOL_NAME} reserves the right to amend, limit or revoke any offers or terms at any time prior to purchase and accepts no responsibility for any technical issues resulting in the failure to pay.</li>
										</ol>
									</div>`;
								}else if(type == 'EXTENSION_FEE'){
									html+=
									`<div class="px-4 py-2">
										<p class="m-0 font-weight-bold">Please note the important fee refund policy and terms & conditions before extending academic year:</p>
										<ol class="font-12 mt-2 pl-4 ol-style">
											<li class="mb-1">We recommend that you consult with the School Admin (email to:<a href="mailto:${schoolSettingsMails.withdrawalRequestAdmin}">${schoolSettingsMails.withdrawalRequestAdmin}</a>) before opting for Paid Academic Year Extension.</li>
											<li clsss="mb-1">Paid academic year extension can be availed for a period of a maximum of 4 weeks.</li>
											<li class="mb-1">The school provides no other form of an academic year extension.</li>
											<li class="mb-1">In case you are not able to complete this course even after availing paid extension for 4 weeks, no credit would be provided for this course, and it would be graded as Incomplete "(I)" in your annual transcript.</li>
											<li class="mb-1">Under any circumstances/conditions, fee paid for Academic Year Extension is non-refundable, non-transferable and non-adjustable.</li>
											<li class="mb-1">Students (or their parents/guardians) are responsible for regularly checking the website for any upcoming notifications. ${SCHOOL_NAME} will not send notifications or updates separately to students (or their parents/guardians)..</li>
											<li class="mb-1">${SCHOOL_NAME} reserves the right to amend, limit or revoke any offers or terms at any time prior to purchase and accepts no responsibility for any technical issues resulting in the failure to pay.</li>
										</ol>
									</div>`;
								}else{
									html+=
									`<div class="px-4 py-2">
										<ol class="mt-2 pl-4 ol-style">
											<li class="mb-1">I understand and agree that under any circumstances/conditions, the fee paid for ${paymentName} is non-refundable, non-transferable and non-adjustable.</li>
											<li class="mb-1">I may be asked to provide additional information, and documents (including but not limited to Age Proof, Address Proof, and Last Academic Proof) in support of the information provided by me (especially related to but not limited to academic credentials, coursework and other relevant information in support of my eligibility/candidature with ${SCHOOL_NAME}) especially if the information provided by me is incomplete, inconsistent (or with discrepancies) or not as per the prescribed requirements of ${SCHOOL_NAME}.</li>
											<li class="mb-1">I will not misrepresent any facts or details to ${SCHOOL_NAME} and not forge/misrepresent any documents, signatures, or credentials and any deviation from the above (or from any other truthful representation of details) shall render my candidature to be canceled (null/void) by ${SCHOOL_NAME} with immediate effect upon discovery of such misrepresentation(s).</li>
											<li class="mb-1">It is my responsibility, as a student (or parent/guardian), to regularly check the website for any upcoming notifications. I understand and agree that ${SCHOOL_NAME} will not send me notifications or updates separately.</li>
											<li class="mb-1">${SCHOOL_NAME} reserves the right to amend, limit or revoke any offers or terms at any time prior to purchase and accepts no responsibility for any technical issues resulting in the failure to pay.</li>
										</ol>
									</div>`;
								}
							html+=`</div>
						</div>
					</form>
				</div>`;
				if(((type == 'REGISTRATION_SUBJECT_FEE' || type == 'CUSTOMIZED_REGISTRATION_SUBJECT_FEE') && (registrationType != 'REGISTRATION_FRESH') && (registrationType != 'REGISTRATION_FLEX_COURSE')) || type == 'REGISTRATION_SUBJECT_FEE_ADV'){

				}else{
					html+=
					`<div class="modal-footer justify-content-between">
						<div class="d-flex align-items-center">
							<span class="d-flex" style="gap: 5px;">
								<label for="bookAnEnrollmentChkval" class="m-0 text-dark">
									<input type="checkbox" id="bookAnEnrollmentChkval" class="checkbox-lg" name="bookAnEnrollmentChkval">&nbsp;I confirm that I have read and agree to the above-mentioned fee refund policy and terms & conditions.
								</label>
							</span>
						</div>
						<button type="button" id="bookAnEnrollmentData" class="btn btn-success " disabled="disabled" onclick="getPaymentGatewaysOptions(${schoolId},${schoolId},'${upid}','${entityType}','${entityId}','${userId}');">Proceed</button>
					</div>`;
				}
			html+=`</div>
		</div>
	</div>`;
	return html
}

async function courseFeeModalTNC(responseData) {
	var schoolSettingsTechnical = await getSchoolSettingsTechnical(SCHOOL_ID);
	var schoolSettingsLinks = await getSchoolSettingsLinks(SCHOOL_ID);
	var schoolSettingsOffice = await getSchoolSettingsOffice(SCHOOL_ID);
	var schoolSettingsMails = await getSchoolSettingsMails(SCHOOL_ID);
	
	const {
       details:{ 
			type,
			paymentName,
			registrationType,
			schoolId, 
			upid, 
			entityType, 
			entityId, 
			userId
		}
    } = responseData;
	const isGraduationCeremonyPayment = paymentName && paymentName.includes('Graduation Ceremony');

    // Helper function to determine which content to show
    const getModalContent = () => {
        if (type === 'REGISTRATION_FEE' || type === 'REGISTRATION_FEE_ADV') {
            return `
                <ol class="ol-style">
                    <li class="mb-1">I understand that by paying the '${paymentName}' Fee, I am only reserving my Enrollment Seat at ${SCHOOL_NAME} and I will only get access to the learning platform once the Course Fee is paid in full.</li>
                    <li class="mb-1">I may be asked to provide additional information, and documents ( including but not limited to Age Proof, Address Proof, and Last Academic Proof) in support of the information provided by me (especially related to but not limited to academic credentials, coursework and other relevant information in support of my eligibility/candidature with ${SCHOOL_NAME}) especially if the information provided by me is incomplete, inconsistent (or with discrepancies) or not as per the prescribed requirements of ${SCHOOL_NAME}.</li>
                    <li class="mb-1">I will not misrepresent any facts or details to ${SCHOOL_NAME}. and not forge/misrepresent any documents, signatures, or credentials and any deviation from the above (or from any other truthful representation of details) shall render my candidature to be canceled (null/void) by ${SCHOOL_NAME} with immediate effect upon discovery of such misrepresentation(s).</li>
                    <li class="mb-1">I understand that all materials of ${SCHOOL_NAME} (including but not limited to all study materials used by me during my learning/coursework) are the sole and complete property of ${SCHOOL_NAME} and I will not make any 'commercial' use of any of the ${SCHOOL_NAME} courses, assignments, audio-visual resources, materials, or any other collaterals.</li>
                    <li class="mb-1">I understand that the '${paymentName}' amount will be deducted from the Course Fee (which is subject to changes) once paid.</li>
                    <li class="mb-1">Under any circumstances/conditions, the fee paid for '${paymentName}' is non-refundable, non-transferable and non-adjustable.</li>
                    <li class="mb-1">It is my responsibility, as a student (or parent/guardian), to regularly check the website for any upcoming notifications. I understand and agree that ${SCHOOL_NAME} will not send me notifications or updates separately.</li>
                    <li class="mb-1">${SCHOOL_NAME} reserves the right to amend, limit or revoke this offer at any time prior to purchase and accepts no responsibility for any technical issues resulting in the failure to pay.</li>
                </ol>
            `;
        } else if (type === 'REGISTRATION_SUBJECT_FEE' || 
                  type === 'REGISTRATION_SUBJECT_FEE_ADV' ||
                  type === 'CUSTOMIZED_REGISTRATION_SUBJECT_FEE' ||
                  type === 'SUBJECT_FEE' ||
                  type === 'SUBJECT_FEE_ADV' ||
                  type === 'CUSTOMIZED_SUBJECT_FEE') {
            
            if (((type === 'REGISTRATION_SUBJECT_FEE' || 
                 type === 'CUSTOMIZED_REGISTRATION_SUBJECT_FEE') && 
                 registrationType !== 'REGISTRATION_FRESH' && 
                 registrationType !== 'REGISTRATION_FLEX_COURSE') || 
                 type === 'REGISTRATION_SUBJECT_FEE_ADV') {
                return `
                    <div class="terms-policy" style="font-size: 12px;">
                        I as a parent/guardian/student:
                        <ol style="padding-left: 35px !important;margin-bottom: 16px;">
                            <li style="margin-bottom: 2px;position: inherit;float: inherit;text-align: justify;">Declare that I have digitally signed this legal document (
                                ${schoolSettingsLinks?.enrollmentPolicyUrl ? `
                                    <a class="theme-text" href="${schoolSettingsLinks.enrollmentPolicyUrl}" style="font-size: 12px;" target="_blank" >Service Agreement - Parent/Guardian/Student</a>
                                ` : ''}
                            ) with my full consent.</li>
                            <li style="margin-bottom: 2px;position: inherit;float: inherit;text-align: justify">Declare that I have read and agree to the
                                ${schoolSettingsLinks?.schoolPolicyUrl ? `
                                    <a class="theme-text" href="${schoolSettingsLinks.schoolPolicyUrl}" style="font-size: 12px;" target="_blank" >School Policies</a>
                                ` : ''}
                                ${schoolSettingsLinks?.studentPolicytUrl ? `
                                    , <a class="theme-text" href="${schoolSettingsLinks.studentPolicytUrl}" style="font-size: 12px;" target="_blank" >Academic Integrity & Student Code of Conduct</a>
                                ` : ''}
                                ${schoolSettingsLinks?.termasOfUserUrl ? `
                                    , <a class="theme-text" href="${schoolSettingsLinks.termasOfUserUrl}" style="font-size: 12px;" target="_blank" >Terms of Use</a>
                                ` : ''}
                                ${schoolSettingsLinks?.privacyPolicyUrl ? `
                                    , and <a class="theme-text" href="${schoolSettingsLinks.privacyPolicyUrl}" style="font-size: 12px;" target="_blank" >Privacy Policy.</a>
                                ` : ''}
                            </li>
                            <li style="margin-bottom: 2px;position: inherit;float: inherit;text-align: justify">Declare all information provided by me in any of the steps of the Enrollment Form are true, complete and correct to the best of my own knowledge and belief. I understand that in the event of any information being found suppressed/false or incorrect or any ineligibility detected at the time or after the enrollment, my enrollment (or that of my child/ward, as the case may be) is liable to be canceled with immediate effect</li>
                        </ol>
                        <div class="custom-checkbox-policy align-items-start">
                            <input type="checkbox" name="chkval" id="chkval" required tabindex="7">
                            <label class="mb-0" for="chkval">By checking this box, I have read & agree to the above-mentioned terms and conditions.</label>
                        </div>
                    </div>
                    <div class="full mt-2 full mt-2 text-center">
                        <button type="button" id="payTabData" class="btn" style="background-color: green;color: white;" disabled="disabled" onclick="getPaymentGatewaysOptions(${schoolId},${schoolId},'${upid}','${entityType}','${entityId}','${userId}');">Proceed</button>
                    </div>
                `;
            } else {
                return `
                    <div class="px-3">
                        <p class="my-1">Fee Refund Policy: Enrollment Fee is non-refundable, non-transferable, and non-adjustable under any condition, whether in the ONE-TIME, INSTALLMENT, or CUSTOMISED fee plan. Fee refunds are only applicable for students who have paid the ONE-TIME fee. The Installment and Customised fee plans are non-refundable, non-transferable, and non-adjustable under any condition. Fee refund requests must be initiated within 90 days from the academic year start date. The student is not eligible for a fee refund after the 90-day period under any condition. If all conditions are met, we refund 50% of the course fee if the enrollment period is within 15 days, 35% if the enrollment period is within 16-30 days, 25% if the enrollment period is within 31-60 days, 15% if the enrollment period is within 61-90 days, and no refund is possible after 90 days of enrollment. The refund/withdrawal must be initiated within the time frame. Calendar days are calculated on a 24-hour basis, irrespective of time zone.The parent/guardian/student must send the notice of cancellation via email to ${schoolSettingsOffice.contactEmail} with the subject as "Request for Cancellation of Enrollment." No refund will be given if any personal, academic, or other details are misrepresented or hidden, or if fake documents are submitted. A transaction charge of USD 80 will be deducted from all refunds mandatorily. Refunds will only be sent to the bank account details provided by the parent/guardian/student and only after receiving confirmation via email. Refund eligibility will be calculated from the date the refund request is received via email.</p>
                    </div>
                `;
            }
        } else if (type === 'EVALUATION_TEST') {
            return `
                <div class="">
                    <p class="m-0 font-weight-bold">Fee Refund Policy And Terms & Conditions For ${schoolSettingsTechnical?.evaluationModTermsName}</p>
                    <ol class="font-12 mt-2 pl-4 ol-style">
                        <li class="mb-1">After receiving the payment, our team will reach out to you to confirm the appointment and provide you with the link to join the same.</li>
                        <li class="mb-1">Kindly note that your enrollment will be based on your performance in the ${schoolSettingsTechnical?.evaluationModTermsName}.</li>
                        <li class="mb-1">The fee paid for the ${schoolSettingsTechnical?.evaluationModTermsName} is separate from all other fees (included but not limited to course fee, enrollment fee) and is non-refundable, non-transferable and non-adjustable.</li>
                        <li class="mb-1">In case you do not appear for the ${schoolSettingsTechnical?.evaluationModTermsName} at the scheduled appointment, you will be given only one more chance to appear for the ${schoolSettingsTechnical?.evaluationModTermsName}. The second appointment must be fixed within 7 days from the first appointment, based on the convenience of the ${SCHOOL_NAME} Team.</li>
                        <li class="mb-1">In case you do not appear for the second appointment as well, the fee will be forfeited.</li>
                        <li class="mb-1">The ${schoolSettingsTechnical?.evaluationModTermsName} result is final and binding and no communication regarding the result will be entertained.</li>
                        <li class="mb-1">The ${schoolSettingsTechnical?.evaluationModTermsName} is only meant for the purpose of checking the eligibility of the student for the respective grade and the examiner of the ${schoolSettingsTechnical?.evaluationModTermsName} may or may not issue a recommendation to the student based on his/her performance in the test. The ${schoolSettingsTechnical?.evaluationModTermsName} is not meant to be a supplement to any other test and no transcript for the ${schoolSettingsTechnical?.evaluationModTermsName} will be issued.</li>
                        <li class="mb-1">The result of the ${schoolSettingsTechnical?.evaluationModTermsName} is valid for enrollment to the respective grade of ${SCHOOL_NAME}, for 60 days from the date of issuance.</li>
                        <li class="mb-1">In case you are found seeking help or using any unfair means or assistance during the ${schoolSettingsTechnical?.evaluationModTermsName}, the fee will be forfeited and the test will be declared null and void.</li>
                        <li class="mb-1">Students (or their parents/guardians) are responsible for regularly checking the website for any upcoming notifications. ${SCHOOL_NAME} will not send notifications or updates separately to students (or their parents/guardians)..</li>
                        <li class="mb-1">${SCHOOL_NAME} reserves the right to amend, limit or revoke any offers or terms at any time prior to purchase and accepts no responsibility for any technical issues resulting in the failure to pay.</li>
                    </ol>
                </div>
            `;
        } else if (type === 'BOOKSESSION_FEE') {
            return `
                <div class="">
                    <p class="m-0 font-weight-bold">Fee Refund Policy And Terms & Conditions For Extra Class Fee</p>
                    <ol class="font-12 mt-2 pl-4 ol-style">
                        <li class="mb-1">Extra Classes are defined as doubt-clearing classes which are in addition to your complimentary classes. For example, 2 extra classes per week mean 1 complimentary doubt-clearing class + 2 extra doubt-clearing classes = 3 doubt-clearing classes per week.</li>
                        <li class="mb-1">Students have to pay in full for the Extra Classes in advance.</li>
                        <li class="mb-1">Fees will be accepted through online payment methods only.</li>
                        <li class="mb-1">All your Extra Classes will be pre-booked at the beginning of every month. You will be notified duly about your Extra Classes Schedule via mail.</li>
                        <li class="mb-1">In case you want to change the date and/or timings of your Extra Class(s), you will have to inform ${SCHOOL_NAME} via mail at least 7 days in advance.</li>
                        <li class="mb-1">Under any circumstances/conditions, fee for Extra Class is non-refundable, non-transferable and non-adjustable. Absence is not valid for any compensation class or refund of fee.</li>
                        <li class="mb-1">The class will be compensated only if it is canceled by ${SCHOOL_NAME}. The compensation will occur only through policies of ${SCHOOL_NAME}. You cannot claim a refund of fees in such cases.</li>
                        <li class="mb-1">Students (or their parents/guardians) are responsible for regularly checking the website for any upcoming notifications. ${SCHOOL_NAME} will not send notifications or updates separately to students (or their parents/guardians)..</li>
                        <li class="mb-1">${SCHOOL_NAME} reserves the right to amend, limit or revoke any offers or terms at any time prior to purchase and accepts no responsibility for any technical issues resulting in the failure to pay.</li>
                    </ol>
                </div>
            `;
        } else if (type === 'EXTENSION_FEE') {
            return `
                <div class="px-4 py-2">
                    <p class="m-0 font-weight-bold">Fee Refund Policy And Terms & Conditions For Academic Year Extension</p>
                    <ol class="font-12 mt-2 pl-4 ol-style">
                        <li class="mb-1">We recommend that you consult with the School Admin (email to:<a href="mailto:${schoolSettingsMails?.withdrawalRequestAdmin}">${schoolSettingsMails?.withdrawalRequestAdmin}</a>) before opting for Paid Academic Year Extension.</li>
                        <li clsss="mb-1">Paid academic year extension can be availed for a period of a maximum of 4 weeks.</li>
                        <li class="mb-1">The school provides no other form of an academic year extension.</li>
                        <li class="mb-1">In case you are not able to complete this course even after availing paid extension for 4 weeks, no credit would be provided for this course, and it would be graded as Incomplete "(I)" in your annual transcript.</li>
                        <li class="mb-1">Under any circumstances/conditions, fee paid for Academic Year Extension is non-refundable, non-transferable and non-adjustable.</li>
                        <li class="mb-1">Students (or their parents/guardians) are responsible for regularly checking the website for any upcoming notifications. ${SCHOOL_NAME} will not send notifications or updates separately to students (or their parents/guardians)..</li>
                        <li class="mb-1">${SCHOOL_NAME} reserves the right to amend, limit or revoke any offers or terms at any time prior to purchase and accepts no responsibility for any technical issues resulting in the failure to pay.</li>
                    </ol>
                </div>
            `;
        } else if (type === 'EXTERNAL_PAYMENT') {
            return `
                <div class="px-4">
                    <ol class="font-16 mt-2 pl-4 ol-style">
                        <li class="mb-1">All fees are strictly non-refundable, non-negotiable, and non-transferable under any circumstances.</li>
                        <li class="mb-1">Payments cannot be moved or credited to another student, program, intake, or academic year.</li>
                        <li class="mb-1">This policy applies whether the student withdraws, defers, or is unable to attend or complete the program for any reason.</li>
                        <li class="mb-1">${SCHOOL_NAME} acts only as a payment facilitator for the university and assumes no responsibility for any disputes or outcomes related to the program or the university.</li>
                        <p class="mb-1 mt-4">By completing payment, the student and/or parent/guardian acknowledges and accepts this policy in full.</p>
                    </ol>
                </div>
            `;
        } else if (isGraduationCeremonyPayment) {
            return `
                <div class="px-4 py-2">
                    <p class="m-0 mt-3 font-weight-bold">By registering for the Graduation Ceremony 2026 organized by ${SCHOOL_NAME}, I acknowledge, understand, and agree to the following terms and conditions:</p>
                    <ol class="font-12 mt-2 pl-4 ol-style">
                        <li class="mb-1"><strong>Non-Refundable Policy:</strong> All fees paid toward the Graduation Ceremony 2026 are strictly non-refundable, non-transferable, and non-adjustable under any circumstances, including but not limited to cancellation, absence, travel issues, visa delays/rejections, personal reasons, medical reasons, scheduling conflicts, or any other unforeseen situations.</li>
                        <li class="mb-1"><strong>Accuracy of Information:</strong> Participants must provide complete, accurate, and truthful information during registration and communication with ${SCHOOL_NAME}. Any misrepresentation, false declaration, forged documentation, or misleading information may result in immediate cancellation of participation without any refund.</li>
                        <li class="mb-1"><strong>Event Updates &amp; Communication:</strong> It is the responsibility of the participant (or parent/guardian) to regularly check the official website, email communications, or official announcements for updates related to the Graduation Ceremony 2026. ${SCHOOL_NAME} shall not be held responsible for missed updates, notifications, schedule changes, or communication failures.</li>
                        <li class="mb-1"><strong>Event Modifications:</strong> ${SCHOOL_NAME} reserves the right to amend event schedules, modify event arrangements, change venue details, update participation policies, and limit or revoke offers or benefits at any time without prior notice if required due to operational, legal, safety, or unforeseen circumstances.</li>
						<li class="mb-1">${SCHOOL_NAME} reserves the right to withhold entry to and participation in the graduation ceremony without prior notice, at the school's sole discretion.</li>
                        <li class="mb-1"><strong>Acceptance of Terms:</strong> By completing the registration and payment process, I confirm that I have read and understood the Graduation Ceremony 2026 Fee Refund Policy &amp; Terms and Conditions, I voluntarily agree to all the above-mentioned terms, and I understand that all decisions made by ${SCHOOL_NAME} regarding the event shall be final.</li>
                    </ol>
                </div>
            `;
        } else {
            return `
                <div class="px-4 py-2">
                    <p class="m-0 font-weight-bold">Fee Refund Policy And Terms & Conditions For ${paymentName}</p>
                    <ol class="mt-2 pl-4 ol-style">
                        <li class="mb-1">I understand and agree that under any circumstances/conditions, the fee paid for ${paymentName} is non-refundable, non-transferable and non-adjustable.</li>
                        <li class="mb-1">I may be asked to provide additional information, and documents (including but not limited to Age Proof, Address Proof, and Last Academic Proof) in support of the information provided by me (especially related to but not limited to academic credentials, coursework and other relevant information in support of my eligibility/candidature with ${SCHOOL_NAME}) especially if the information provided by me is incomplete, inconsistent (or with discrepancies) or not as per the prescribed requirements of ${SCHOOL_NAME}.</li>
                        <li class="mb-1">I will not misrepresent any facts or details to ${SCHOOL_NAME} and not forge/misrepresent any documents, signatures, or credentials and any deviation from the above (or from any other truthful representation of details) shall render my candidature to be canceled (null/void) by ${SCHOOL_NAME} with immediate effect upon discovery of such misrepresentation(s).</li>
                        <li class="mb-1">It is my responsibility, as a student (or parent/guardian), to regularly check the website for any upcoming notifications. I understand and agree that ${SCHOOL_NAME} will not send me notifications or updates separately.</li>
                        <li class="mb-1">${SCHOOL_NAME} reserves the right to amend, limit or revoke any offers or terms at any time prior to purchase and accepts no responsibility for any technical issues resulting in the failure to pay.</li>
                    </ol>
                </div>
            `;
        }
    };

    // Determine modal title
    const getModalTitle = () => {
        if (type === 'REGISTRATION_FEE' || type === 'REGISTRATION_FEE_ADV') {
            return `Further to my successful completion of the '${paymentName}' process with ${SCHOOL_NAME}, I agree to comply with the following as stated below, without any exceptions:`;
        } else if (type === 'REGISTRATION_SUBJECT_FEE' || 
                  type === 'REGISTRATION_SUBJECT_FEE_ADV' ||
                  type === 'CUSTOMIZED_REGISTRATION_SUBJECT_FEE' ||
                  type === 'SUBJECT_FEE' ||
                  type === 'SUBJECT_FEE_ADV' ||
                  type === 'CUSTOMIZED_SUBJECT_FEE') {
            
            if (((type === 'REGISTRATION_SUBJECT_FEE' || 
                 type === 'CUSTOMIZED_REGISTRATION_SUBJECT_FEE') && 
                 registrationType !== 'REGISTRATION_FRESH' && 
                 registrationType !== 'REGISTRATION_FLEX_COURSE') || 
                 type === 'REGISTRATION_SUBJECT_FEE_ADV') {
                return `Further to my Enrollment with ${SCHOOL_NAME},I agree to comply with the following as stated below, without any exceptions:`;
            } else {
                return 'Fee Refund Policy';
            }
        } else if (type === 'EVALUATION_TEST') {
            return `Fee Refund Policy And Terms & Conditions For ${schoolSettingsTechnical?.evaluationModTermsName}`;
        } else if (type === 'BOOKSESSION_FEE') {
            return 'Fee Refund Policy And Terms & Conditions For Extra Class Fee';
        } else if (type === 'EXTENSION_FEE') {
            return 'Fee Refund Policy And Terms & Conditions For Academic Year Extension';
        } else if (isGraduationCeremonyPayment) {
            return `Fee Refund Policy And Terms & Conditions For ${paymentName}`;
        } else {
            return `Fee Refund Policy And Terms & Conditions For ${paymentName}`;
        }
    };

    // Determine if footer should be shown
    const showFooter = !(
        ((type === 'REGISTRATION_SUBJECT_FEE' || 
          type === 'CUSTOMIZED_REGISTRATION_SUBJECT_FEE') && 
         registrationType !== 'REGISTRATION_FRESH' && 
         registrationType !== 'REGISTRATION_FLEX_COURSE') || 
        type === 'REGISTRATION_SUBJECT_FEE_ADV'
    );

    const modalContent = getModalContent();
    const modalTitle = getModalTitle();

    return `
        <div id="courseFeeModalTNC" class="modal fade" role="dialog">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header py-2 bg-primary d-flex">
						${/* <h5 class="modal-title text-white">${modalTitle}</h5> */''}
                        <button type="button" class="close text-white" data-dismiss="modal">&times;</button>
                    </div>
                    <form id="dashboardPayment" name="dashboardPayment" method="post" autocomplete="off">
                        <div class="modal-body">
                            <p class="scroll-down" style="margin-top:5px;"><a href="#" class="animate"></a></p>
                            <input type="hidden" id="userId" value="${userId}" />
                            <div class="agree">
                                ${modalContent}
                            </div>
                        </div>
                        ${showFooter ? `
                            <div class="modal-footer justify-content-between full mt-2 text-center">
                                <div class="d-flex align-items-center">
                                    <span class="d-flex" style="gap: 5px;">
                                       <input type="checkbox" id="chkval" class="checkbox-lg" name="chkval">
                                       <label for="chkval" class="m-0">
                                            ${type === 'EXTERNAL_PAYMENT' ? 
                                                `I understand that all University Program fees are non-refundable and non-transferable, and that ${SCHOOL_NAME} only facilitates payment.` : 
                                                `I confirm that I have read and agree to the above-mentioned fee refund policy and terms & conditions.`
                                            }
                                        </label>
                                   </span>
                                </div>
                               <button type="button" id="payTabData" class="btn " style="background-color: green;color: white;" disabled="disabled" onclick="getPaymentGatewaysOptions(${schoolId},${schoolId},'${upid}','${entityType}','${entityId}','${userId}');">Proceed</button>
                           </div>
                        ` : ''}
                    </form>
                </div>
            </div>
        </div>
    `;
}


// function getSignupStatus() {
// 	if (!signupStageStatusInitiated) {
// 		if(ENVIRONMENT!='dev'){
// 			window.setInterval(function () { getSignupStatusFinal() }, 180000);
// 		}
// 	}
// }


async function getPaymentPaidStatus(userPaymentDetailsId, schoolId) {
	if(userPaymentDetailsId != "" && schoolId != ""){
		var payload = {
			'userPaymentDetailsId' : userPaymentDetailsId,
			'schoolId' : schoolId
		};	
		var responseData = await getDashboardDataBasedUrlAndPayloadWithParentUrl(true,true,'get-payment-paid-status',payload,'common');
		if (responseData.status == '1' ) {
			if(CHECK_PAYMENT_INTERVAL_COUNT>10){
				flushPaymentInterval();
			}else{
				CHECK_PAYMENT_INTERVAL_COUNT++;
				if(responseData.statusCode == "SUCCESS" ){
					clearInterval(CHECK_PAYMENT_INTERVAL);
					if($("#payNowBtn"+userPaymentDetailsId).length>0){
						$("#payNowBtn"+userPaymentDetailsId).remove();
						$("#paymentStatus"+userPaymentDetailsId).text("SUCCESS");
						$("#paymentDate"+userPaymentDetailsId+"Wrapper").removeClass("d-none");
						$("#paymentDate"+userPaymentDetailsId).text(changeDateFormat(new Date(), "MMM-dd-yyyy"));
					}
					$("#paymentOptionsModal").modal("hide");
					$(".paymentUnderProcessOverlay").remove();
				}else if(responseData.statusCode == "FAILURE"){
					flushPaymentInterval();
				}
			}
		}
	}
}
function flushPaymentInterval(){
	clearInterval(CHECK_PAYMENT_INTERVAL);
	$("#paymentOptionsModal").modal("hide");
	$(".paymentUnderProcessOverlay").remove();
	if($("#paymentStatusResponse").length>0){
		$("#paymentStatusResponse").remove();
	}
	$("body").append(paymentStatusResponseModal());
	$("#paymentStatusResponse").modal("show");
}

$(document).on("click","#signupStage4 #chkval", function(){
	if($("#chkval").is(":checked")){
		$("#payTabData").removeAttr("disabled");
	}else{
		$("#payTabData").attr("disabled", true);
	}
});
$(document).on("click","#signupStage4 #chkvalBook", function(){
	if($("#chkvalBook").is(":checked")){
		$("#bookAnEnrollmentTNC #payTabData").removeAttr("disabled");
	}else{
		$("#bookAnEnrollmentTNC #payTabData").attr("disabled", true);
	}
});


function paymentUnderProcessOverlay(){
	var html=
	`<div class="paymentUnderProcessOverlay">
		<div style="text-align:center;color:#fff">`;
			if(SCHOOL_ID==1){
				html+=`<img src="`+PATH_FOLDER_IMAGE2+`loader-new.gif" alt="`+SCHOOL_NAME+` Loader" style="max-width:150px;width:100%"/>`
			}else{
				html+=
				`<div class="ball-rotate">
					<div style="background-color: rgb(247, 185, 36);"></div>
				</div>
				<p>Payment is under process ...</p>`
			}
			html+=`<h4>Payment is under process...</h4>
		</div>
	</div>`;
	return html;
}

function paymentStatusResponseModal(){
	var html=
	`<div id="paymentStatusResponse" class="modal theme-modal fade payment-opiton-modal" role="dialog" data-backdrop="static" data-keyboard="false">
		<div class="modal-dialog modal-sm">
			<div class="modal-content">
				<div class="modal-header py-2 primary-bg white-txt-color">
					<button type="button" class="close" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true" style="color: #fff;">×</span>
					</button>
				<h4 class="modal-title" style="font-size: 14px">&nbsp;</h4>
				</div>
				<div class="modal-body">
					<h2 class="text-center">Oops!</h2>
					<h3 class="text-danger text-center">Payment Incomplete</h3>
				</div>
			</div>
		</div>
	</div>`;
	return html;	
}

$(document).on("click","#chkvalBookSession", function(){
	if($("#chkvalBookSession").is(":checked")){
		$("#payTabBookingSessionModal #payBookingSessionTabData").removeAttr("disabled");
	}else{
		$("#payTabBookingSessionModal #payBookingSessionTabData").attr("disabled", true);
	}
});
function renderOldFeeCard(responseData){
	if($("#oldFeePaymentModal").length > 0){
		$("#oldFeePaymentModal").remove();
	}

	var modalHtml =
	`<div id="oldFeePaymentModal" class="modal fade theme-modal" role="dialog" data-backdrop="static" data-keyboard="false">
		<div class="modal-dialog modal-dialog-centered box-shadow-none" role="document" style="max-width:460px">
			<div class="modal-content border-0 rounded-20 overflow-hidden">
				<div class="card-header bg-primary text-white d-flex align-items-center justify-content-center py-3 px-3 border-0">
					<div class="d-flex align-items-center justify-content-center">
						<div class="text-white text-center" style="font-size:18px;text-transform:none;">
							School Payment Update
						</div>
					</div>
				</div>
				<div class="modal-body bg-white px-4 py-4">
					<div class="border border-warning bg-light-warning rounded-15 px-3 py-3 mb-4">
						<div class="d-flex align-items-center mb-2" style="color: #92400E;">
							<i class="fa fa-info-circle mr-2"></i>
							<p class="mb-0 font-weight-semi-bold">Important Notice</p>
						</div>
						<p class="mb-0" style="color: #92400E;">` + (responseData.message || '') + `</p>
					</div>
					<div class="mb-4" style="font-size:14px;">`
					    if(CHAT_URL != ""){
							modalHtml+=`<div class="d-flex align-items-center text-dark mb-3">
								<i class="fa fa-headphones text-primary mr-2" style="font-size:18px;"></i>
								<p class="mb-0 font-weight-semi-bold" style="font-size:16px;">Need Any Support?</p>
							</div>`;
							modalHtml+=getSchoolAdminChatButton();
						}
						modalHtml+=`<div class="bg-light rounded-15 px-3 py-3 mb-3" style="width:92%;margin:0 auto 1rem auto;">
							<div class="d-flex align-items-center">
								<div class="mr-3 text-primary" style="font-size:18px;">
									<i class="fa fa-phone"></i>
								</div>
								<div>
									<p class="mb-0 text-muted" style="font-size:13px;">Phone Support</p>
									<p class="mb-0 text-dark font-weight-semi-bold" style="font-size:15px;">+15854990662</p>
								</div>
							</div>
						</div>
						<div class="bg-light rounded-15 px-3 py-3" style="width:92%;margin:0 auto;">
							<div class="d-flex align-items-center">
								<div class="mr-3 text-success" style="font-size:18px;">
									<i class="fa fa-envelope"></i>
								</div>
								<div>
									<p class="mb-0 text-muted" style="font-size:13px;">Email Support</p>
									<p class="mb-0 text-dark font-weight-semi-bold" style="font-size:15px;"><a href="mailto:admin.support@internationalschooling.org" style="color:inherit;text-decoration:none;">admin.support@internationalschooling.org</a></p>
								</div>
							</div>
						</div>
					</div>
					<div class="text-center">
		               <button type="button" class="btn btn-primary btn-lg btn-shadow rounded-10 text-bold" style="font-size:18px;" data-dismiss="modal">Close</button>
	                </div>
				</div>
			</div>
		</div>
	</div>`;

	$("body").append(modalHtml);
	$("#oldFeePaymentModal").modal("show");
}

function renderFeeCard(responseData){
	if($("#oldFeePaymentModal").length > 0){
		$("#oldFeePaymentModal").remove();
	}

	var modalHtml = `
	<style>
:root{
	--pc:#007fff;
}

.modal.fade .modal-dialog {
	transform: translate(0px, -50px);
	transition: transform 0.3s ease-out;
}

.modal.show .modal-dialog {
	transform: none;
}

.modal-dialog-centered {
	display: flex;
	align-items: center;
	min-height: calc(100% - 1rem);
}

@media (min-width:576px){
	.modal-dialog-centered{
		min-height: calc(100% - 3.5rem);
	}
}

#oldFeePaymentModal .modal-dialog{
	max-width:520px;
	width:95%;
}

.modal-content{
	position:relative;
	display:flex;
	flex-direction:column;
	width:100%;
	background:#fff;
	border:1px solid rgba(0,0,0,0.2);
	border-radius:12px;
}

.modal-body{
	position:relative;
	flex:1 1 auto;
	padding:20px;
}

.px-4{padding-left:1.5rem !important;padding-right:1.5rem !important;}
.py-4{padding-top:1.5rem !important;padding-bottom:1.5rem !important;}
.mb-3{margin-bottom:1rem !important;}
.mb-4{margin-bottom:1.5rem !important;}
.d-flex{display:flex !important;}
.align-items-center{align-items:center !important;}
.text-center{text-align:center;}

.bg-white{background:#fff !important;}
.bg-light{background:#f8f9fa !important;}
.bg-light-warning{background:#fff8e8 !important;}
.text-dark{color:#343a40 !important;}
.text-muted{color:#6c757d !important;}
.text-primary{color:#007fff !important;}
.text-success{color:#1fc747 !important;}

.border{border:1px solid #dee2e6 !important;}
.border-warning{border-color:#f7b924 !important;}

.rounded-10{border-radius:10px;}
.rounded-15{border-radius:15px;}
.rounded-20{border-radius:20px;}

.btn{
	position:relative;
	transition:0.15s;
}

.btn-primary{
	color:#fff;
	background:var(--pc);
	border-color:var(--pc);
}

.btn-primary:hover{
	background:var(--pc);
	border-color:var(--pc);
	opacity:0.9;
}

.btn-success{
	color:#fff;
	background:#1fc747;
	border-color:#1fc747;
}

.btn-lg{
	padding:6px 18px;
	font-size:16px;
}

.btn-shadow{
	box-shadow:0 0.125rem 0.625rem rgba(58,196,125,0.4),
			   0 0.0625rem 0.125rem rgba(58,196,125,0.5);
}

.scale-animate{
	animation:scaleAnimation 1s ease infinite;
	width:85%;
	margin:0 auto 0.8rem auto;
	display:block;
	font-size:14px;
	padding:6px 14px;
}

@keyframes scaleAnimation{
	0%{transform:scale(1);}
	50%{transform:scale(1.05);}
	100%{transform:scale(1);}
}

.font-weight-semi-bold{font-weight:600;}
.text-bold{font-weight:bold;}

</style>

<div id="oldFeePaymentModal" class="modal fade theme-modal" role="dialog" data-backdrop="static" data-keyboard="false">
	<div class="modal-dialog modal-dialog-centered box-shadow-none" role="document">
		<div class="modal-content border-0 rounded-20 overflow-hidden">

			<div class="card-header bg-primary text-white d-flex align-items-center justify-content-center py-3 px-3 border-0">
				<div class="text-white text-center" style="font-size:18px;text-transform:none;">
					School Payment Update
				</div>
			</div>

			<div class="modal-body bg-white px-4 py-4">

				<div class="border border-warning bg-light-warning rounded-15 px-3 py-3 mb-4">
					<div class="d-flex align-items-center mb-2" style="color:#92400E;">
						<i class="fa fa-info-circle mr-2"></i>
						<p class="mb-0 font-weight-semi-bold">Important Notice</p>
					</div>
					<p class="mb-0" style="color:#92400E;">${responseData.message || ''}</p>
				</div>

				<div class="mb-4" style="font-size:14px;">`
					if(CHAT_URL != ""){
						modalHtml+=`<div class="d-flex align-items-center text-dark mb-3">
							<i class="fa fa-headphones text-primary mr-2" style="font-size:18px;"></i>
							<p class="mb-0 font-weight-semi-bold" style="font-size:16px;">Need Any Support?</p>
						</div>`;
						modalHtml+=getSchoolAdminChatButton();
						}
					modalHtml+=`<div class="bg-light rounded-15 px-3 py-3 mb-3" style="width:92%;margin:0 auto 1rem auto;">
						<div class="d-flex align-items-center">
							<div class="mr-3 text-primary" style="font-size:18px;">
								<i class="fa fa-phone"></i>
							</div>
							<div>
								<p class="mb-0 text-muted" style="font-size:13px;">Phone Support</p>
								<p class="mb-0 text-dark font-weight-semi-bold" style="font-size:15px;">+15854990662</p>
							</div>
						</div>
					</div>

					<div class="bg-light rounded-15 px-3 py-3" style="width:92%;margin:0 auto;">
						<div class="d-flex align-items-center">
							<div class="mr-3 text-success" style="font-size:18px;">
								<i class="fa fa-envelope"></i>
							</div>
							<div>
								<p class="mb-0 text-muted" style="font-size:13px;">Email Support</p>
								<p class="mb-0 text-dark font-weight-semi-bold" style="font-size:15px;">
									<a href="mailto:admin.support@internationalschooling.org" style="color:inherit;text-decoration:none;">
										admin.support@internationalschooling.org
									</a>
								</p>
							</div>
						</div>
					</div>

				</div>

				<div class="text-center">
					<button type="button" class="btn btn-primary btn-lg btn-shadow rounded-10 text-bold" data-dismiss="modal">
						Close
					</button>
				</div>

			</div>
		</div>
	</div>
</div>`;

	$("body").append(modalHtml);
	$("#oldFeePaymentModal").modal("show");
}
