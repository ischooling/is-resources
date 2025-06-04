function callCommonInitPayment(formId, moduleId, eligiblePaymentGateway) {
	hideMessage('');
	//$('#callPaymentModal').modal('show');
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLForHTML('common', 'payment-initiated'),
		data: JSON.stringify(getRequestForInitPayment(formId, moduleId, eligiblePaymentGateway)),
		dataType: 'json',
		cache: false,
		async: false,
		timeout: 600000,
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				showMessage(true, data['message']);
				callCommonPaymentGateway('', 'common', '', eligiblePaymentGateway);
			}
			return false;
		}
	});
}
function getRequestForInitPayment(formId, moduleId, eligiblePaymentGateway) {
	var request = {};
	var authentication = {};
	var commonPaymentInfoDTO = {};
	if ($('#location').length > 0) {
		commonPaymentInfoDTO['location'] = $('#location').val();
	} else {
		commonPaymentInfoDTO['location'] = '';
	}
	commonPaymentInfoDTO['eligiblePaymentGateway'] = eligiblePaymentGateway;
	commonPaymentInfoDTO['userType'] = moduleId;
	if (moduleId == 'STUDENT') {
		commonPaymentInfoDTO['studentId'] = $('#studentId').val().trim();
		commonPaymentInfoDTO['moduleName'] = $('#moduleName').val().trim();
		commonPaymentInfoDTO['paymentTitle'] = $('#paymentType').val().trim();
		commonPaymentInfoDTO['paymentType'] = $('#paymentType').val().trim();
		commonPaymentInfoDTO['paymentAmount'] = $('#totalPaymentAmount').attr('data-payAmount');
	} else if (moduleId == 'SCHOOL') {
		commonPaymentInfoDTO['moduleName'] = $('#moduleName').val().trim();
		commonPaymentInfoDTO['paymentTitle'] = $('#paymentType').val().trim();
		commonPaymentInfoDTO['paymentType'] = $('#paymentType').val().trim();
		if ($('#paymentType').val().trim() == 'SCHOOL-STUDENT-FEE') {
			commonPaymentInfoDTO['schoolId'] = $('#schoolId').val().trim();
			commonPaymentInfoDTO['studentId'] = $('#totalStudentIds').val().trim();
			commonPaymentInfoDTO['totalCount'] = $('#totalCount').val().trim();
			commonPaymentInfoDTO['gradeId'] = $('#currentGradeId').val().trim();
		}
	}
	commonPaymentInfoDTO['teacherRequestSubjectIds'] = $('#totalSubjectIds').attr('data-subjectids');
	//	commonPaymentInfoDTO['teacherRequestPlacementSubjectIds'] = $('#totalPlacementSubjectIds').attr('data-placementSubjectIds');

	//alert(commonPaymentInfoDTO);
	authentication['hash'] = getHash(); authentication['schoolId'] = SCHOOL_ID; authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = moduleId;
	authentication['userId'] = $('#userId').val().trim();
	request['authentication'] = authentication;
	request['commonPaymentInfo'] = commonPaymentInfoDTO;
	return request;
}

function callCommonPaymentGateway(formId, module, args, callCommonPaymentGateway) {
	hideModalMessage('');
	$('#cardHolderNameError').hide();
	$('#cardNumberError').hide();
	$('#cardExpiryMonthError').hide();
	$('#cardExpiryMonthError').hide();
	$('#cardCodeError').hide();
	if (callCommonPaymentGateway == 'WELLSFARGO') {
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
	customLoader(true);
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLForHTML('common', 'call-payment-gateway'),
		data: JSON.stringify(getRequestForCommonPayment(formId, module, args, callCommonPaymentGateway)),
		dataType: 'json',
		cache: false,
		timeout: 600000,
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showModalMessage(true, data['message']);
				if (data['statusCode'] == 'ELIGIBLE_CUSTOME_PLAN' || data['statusCode'] == 'REDIRECT_TO_DASHBOOARD') {
					window.location.reload();
				}
			} else {
				showModalMessage(false, data['message']);
				if (data['paymentGateway'] == 'Smoovpay') {
					prepareSmoovPayDataAndPost(data['smoovPayData']);
				} else {
					window.location.replace(data['extra']);
				}
			}
			customLoader(false);
			return false;
		}
	});
}
function getRequestForCommonPayment(formId, module, args, eligiblePaymentGateway) {
	var request = {};
	var authentication = {};
	if (module == 'common') {
		authentication['userType'] = module;
		authentication['userId'] = $("#userId").val().trim();
		var commonPaymentInfoDTO = {};
		if ($('#location').length > 0) {
			commonPaymentInfoDTO['location'] = $('#location').val();
		} else {
			commonPaymentInfoDTO['location'] = '';
		}
		commonPaymentInfoDTO['themeType'] = 'theme2';
		commonPaymentInfoDTO['paymentOptionName'] = 'Online'
		commonPaymentInfoDTO['eligiblePaymentGateway'] = eligiblePaymentGateway;
		commonPaymentInfoDTO['userType'] = module;
		if ($('#moduleName').length > 0) {
			commonPaymentInfoDTO['moduleName'] = $('#moduleName').val().trim();
		}
		if ($('#paymentType').length > 0) {
			commonPaymentInfoDTO['paymentTitle'] = $('#paymentType').val().trim();
		}
		if ($('#paymentType').length > 0) {
			commonPaymentInfoDTO['paymentType'] = $('#paymentType').val().trim();
		}

		if (eligiblePaymentGateway == 'WELLSFARGO') {
			var creditCard = {};
			creditCard['cardHolderName'] = $('#cardHolderName').val().trim();
			creditCard['cardNumber'] = $('#cardNumber').val().trim();
			creditCard['expirationDate'] = $('#cardExpiryYear').val().trim() + '-' + $('#cardExpiryMonth').val().trim();
			creditCard['cardCode'] = $('#cardCode').val().trim();
			commonPaymentInfoDTO['creditCard'] = creditCard;
		}
		console.log("Data for Payment is :  ", commonPaymentInfoDTO);
	} else if (module == 'student') {
		authentication['userType'] = 'STUDENT';
		var commonPaymentInfoDTO = {};
		if ($('#location').length > 0) {
			commonPaymentInfoDTO['location'] = $('#location').val();
		} else {
			commonPaymentInfoDTO['location'] = '';
		}
		commonPaymentInfoDTO['themeType'] = 'theme2';
		commonPaymentInfoDTO['paymentOptionName'] = 'Online'
		commonPaymentInfoDTO['eligiblePaymentGateway'] = eligiblePaymentGateway;
		commonPaymentInfoDTO['userType'] = moduleId;
		if (eligiblePaymentGateway == 'WELLSFARGO') {
			var creditCard = {};
			creditCard['cardHolderName'] = $('#cardHolderName').val().trim();
			creditCard['cardNumber'] = $('#cardNumber').val().trim();
			creditCard['expirationDate'] = $('#cardExpiryYear').val().trim() + '-' + $('#cardExpiryMonth').val().trim();
			creditCard['cardCode'] = $('#cardCode').val().trim();
			commonPaymentInfoDTO['creditCard'] = creditCard;
		}
		if (args != undefined && args != '') {
			//type=INSTALLMENT-FEE&userId=331&payId=6691&paymentType=nineMonthly
			console.log('getRequestForCommonPayment=>' + args);
			var params = args.split("&");
			var type = params[0].split("=");
			var user = params[1].split("=");
			var userPaymentId = params[2].split("=");
			var paymentType = params[3].split("=");
			var paymentByUserId = params[4].split("=");
			var entityType = params[5].split("=");
			var entityId = params[6].split("=");
			commonPaymentInfoDTO['entityType'] = entityType[1];
			commonPaymentInfoDTO['entityId'] = entityId[1];
			commonPaymentInfoDTO['paymentByUserId'] = paymentByUserId[1];
			authentication['userId'] = user[1];
			commonPaymentInfoDTO['userPaymentId'] = userPaymentId[1];
			if (type[1] == 'SUBJECT_FEE') {
				commonPaymentInfoDTO['paymentType'] = type[1];
			} else {
				commonPaymentInfoDTO['paymentType'] = paymentType[1];
			}
			commonPaymentInfoDTO['paymentTitle'] = type[1];
		} else {
			authentication['userId'] = $("#" + formId + " #userId").val().trim();
			//commonPaymentInfoDTO['moduleName'] = $('#moduleName').val().trim();
			commonPaymentInfoDTO['paymentTitle'] = $('#paymentType').val().trim();
			commonPaymentInfoDTO['paymentType'] = $('#paymentType').val().trim();
		}
		console.log("Data for Payment is :  ", commonPaymentInfoDTO);
	} else if (module == 'school') {
		authentication['userType'] = 'SCHOOL';
		authentication['userId'] = $("#userId").val().trim();
		var commonPaymentInfoDTO = {};
		if ($('#location').length > 0) {
			commonPaymentInfoDTO['location'] = $('#location').val();
		} else {
			commonPaymentInfoDTO['location'] = '';
		}
		commonPaymentInfoDTO['themeType'] = 'theme2';
		commonPaymentInfoDTO['paymentOptionName'] = 'Online'
		commonPaymentInfoDTO['eligiblePaymentGateway'] = eligiblePaymentGateway;
		commonPaymentInfoDTO['userType'] = module;
		commonPaymentInfoDTO['moduleName'] = 'SCHOOL_B2B';
		if (eligiblePaymentGateway == 'WELLSFARGO') {
			var creditCard = {};
			creditCard['cardHolderName'] = $('#cardHolderName').val();
			creditCard['cardNumber'] = $('#cardNumber').val();
			creditCard['expirationDate'] = $('#cardExpiryYear').val() + '-' + $('#cardExpiryMonth').val();
			creditCard['cardCode'] = $('#cardCode').val();
			commonPaymentInfoDTO['creditCard'] = creditCard;
		}
		if (args != undefined && args != '') {
			//'type=One_time_Application_Fee&userId=&payId=&paymentType=One_time_Application_Fee';
			console.log('getRequestForCommonPayment=>' + args);
			var params = args.split("&");
			var type = params[0].split("=");
			var user = params[1].split("=");
			var userPaymentId = params[2].split("=");
			var paymentType = params[3].split("=");
			var entityType = params[4].split("=");
			var entityId = params[5].split("=");
			commonPaymentInfoDTO['entityType'] = entityType[1];
			commonPaymentInfoDTO['entityId'] = entityId[1];
			commonPaymentInfoDTO['paymentType'] = type[1];
			commonPaymentInfoDTO['paymentTitle'] = type[1];
		} else {
			if ($('#paymentType').val().trim() == undefined) {
				commonPaymentInfoDTO['paymentTitle'] = 'APPLICATION-FEE';
				commonPaymentInfoDTO['paymentType'] = 'APPLICATION-FEE';
			} else {
				commonPaymentInfoDTO['paymentTitle'] = $('#paymentType').val().trim();
				commonPaymentInfoDTO['paymentType'] = $('#paymentType').val().trim();
			}
		}
		console.log("Data for Payment is :  ", commonPaymentInfoDTO);
	} else if (module == 'student') {
		authentication['userType'] = 'STUDENT';
		var commonPaymentInfoDTO = {};
		if ($('#location').length > 0) {
			commonPaymentInfoDTO['location'] = $('#location').val();
		} else {
			commonPaymentInfoDTO['location'] = '';
		}
		commonPaymentInfoDTO['themeType'] = 'theme2';
		commonPaymentInfoDTO['paymentOptionName'] = 'Online'
		commonPaymentInfoDTO['eligiblePaymentGateway'] = eligiblePaymentGateway;
		commonPaymentInfoDTO['userType'] = moduleId;
		if (eligiblePaymentGateway == 'WELLSFARGO') {
			var creditCard = {};
			creditCard['cardHolderName'] = $('#cardHolderName').val();
			creditCard['cardNumber'] = $('#cardNumber').val();
			creditCard['expirationDate'] = $('#cardExpiryYear').val() + '-' + $('#cardExpiryMonth').val();
			creditCard['cardCode'] = $('#cardCode').val();
			commonPaymentInfoDTO['creditCard'] = creditCard;
		}
		if (args != undefined && args != '') {
			//type=INSTALLMENT-FEE&userId=331&payId=6691&paymentType=nineMonthly
			console.log('getRequestForCommonPayment=>' + args);
			var params = args.split("&");
			var type = params[0].split("=");
			var user = params[1].split("=");
			var userPaymentId = params[2].split("=");
			var paymentType = params[3].split("=");
			var entityType = params[4].split("=");
			var entityId = params[5].split("=");
			commonPaymentInfoDTO['entityType'] = entityType[1];
			commonPaymentInfoDTO['entityId'] = entityId[1];
			authentication['userId'] = user[1];
			commonPaymentInfoDTO['userPaymentId'] = userPaymentId[1];
			commonPaymentInfoDTO['paymentType'] = type[1];
			commonPaymentInfoDTO['paymentTitle'] = type[1];
		} else {
			authentication['userId'] = $("#" + formId + " #userId").val().trim();
			//commonPaymentInfoDTO['moduleName'] = $('#moduleName').val().trim();
			commonPaymentInfoDTO['paymentTitle'] = $('#paymentType').val().trim();
			commonPaymentInfoDTO['paymentType'] = $('#paymentType').val().trim();
		}
	} else if (module == 'school') {
		authentication['userType'] = 'SCHOOL';
		authentication['userId'] = $("#userId").val().trim();
		var commonPaymentInfoDTO = {};
		if ($('#location').length > 0) {
			commonPaymentInfoDTO['location'] = $('#location').val();
		} else {
			commonPaymentInfoDTO['location'] = '';
		}
		commonPaymentInfoDTO['themeType'] = 'theme2';
		commonPaymentInfoDTO['paymentOptionName'] = 'Online'
		commonPaymentInfoDTO['eligiblePaymentGateway'] = eligiblePaymentGateway;
		commonPaymentInfoDTO['userType'] = module;
		commonPaymentInfoDTO['moduleName'] = 'SCHOOL_B2B';
		if (eligiblePaymentGateway == 'WELLSFARGO') {
			var creditCardDTO = {};
			creditCardDTO['cardHolderName'] = $('#cardHolderName').val();
			creditCardDTO['cardNumber'] = $('#cardNumber').val();
			creditCardDTO['expirationDate'] = $('#cardExpiryYear').val() + '-' + $('#cardExpiryMonth').val();
			creditCardDTO['cardCode'] = $('#cardCode').val();
			commonPaymentInfoDTO['creditCard'] = creditCardDTO;
		}
		if (args != undefined && args != '') {
			//'type=One_time_Application_Fee&userId=&payId=&paymentType=One_time_Application_Fee';
			console.log('getRequestForCommonPayment=>' + args);
			var params = args.split("&");
			var type = params[0].split("=");
			var user = params[1].split("=");
			var userPaymentId = params[2].split("=");
			var paymentType = params[3].split("=");
			var entityType = params[4].split("=");
			var entityId = params[5].split("=");
			commonPaymentInfoDTO['entityType'] = entityType[1];
			commonPaymentInfoDTO['entityId'] = entityId[1];
			commonPaymentInfoDTO['paymentType'] = type[1];
			commonPaymentInfoDTO['paymentTitle'] = type[1];
		} else {
			commonPaymentInfoDTO['paymentTitle'] = 'APPLICATION-FEE';
			commonPaymentInfoDTO['paymentType'] = 'APPLICATION-FEE';
		}
	}
	authentication['hash'] = getHash(); authentication['schoolId'] = SCHOOL_ID; authentication['schoolUUID'] = SCHOOL_UUID;
	request['authentication'] = authentication;
	request['commonPaymentInfo'] = commonPaymentInfoDTO;
	return request;
}

function prepareSmoovPayDataAndPost(smoovPayData) {
	$("#smoovpayForm").attr("action", smoovPayData['endPoint']);
	$("#smoovpayForm input[name*='action']").val(smoovPayData['action']);
	$("#smoovpayForm input[name*='currency']").val(smoovPayData['currency']);
	$("#smoovpayForm input[name*='version']").val(smoovPayData['version']);
	$("#smoovpayForm input[name*='item_name_1']").val(smoovPayData['itemName1']);
	$("#smoovpayForm input[name*='item_description_1']").val(smoovPayData['itemDescription1']);
	$("#smoovpayForm input[name*='item_quantity_1']").val(smoovPayData['itemQuantity1']);
	$("#smoovpayForm input[name*='item_amount_1']").val(smoovPayData['itemAmount1']);
	$("#smoovpayForm input[name*='merchant']").val(smoovPayData['merchant']);
	$("#smoovpayForm input[name*='ref_id']").val(smoovPayData['refId']);
	$("#smoovpayForm input[name*='delivery_charge']").val(smoovPayData['deliveryCharge']);
	$("#smoovpayForm input[name*='tax_amount']").val(smoovPayData['taxAmount']);
	$("#smoovpayForm input[name*='tax_percentage']").val(smoovPayData['taxPercentage']);
	$("#smoovpayForm input[name*='total_amount']").val(smoovPayData['totalAmount']);
	$("#smoovpayForm input[name*='str_url']").val(smoovPayData['strUrl']);
	$("#smoovpayForm input[name*='success_url']").val(smoovPayData['successUrl']);
	$("#smoovpayForm input[name*='cancel_url']").val(smoovPayData['cancelUrl']);
	$("#smoovpayForm input[name*='signature']").val(smoovPayData['signature']);
	$("#smoovpayForm input[name*='signature_algorithm']").val(smoovPayData['signatureAlgorithm']);
	//	alert($("#smoovpayForm").html());
	$("#smoovpayForm").submit();
}

function callStudentWireTransferPayment(formId, paymentOption, userId, moduleId, callingFrom, paymentByUserId, gatewayName) {
	console.log("Module ID is ", moduleId);
	$.ajax({
		type: "POST",
		url: getURLForHTML('common', 'call-for-wire-transfer-payment'),
		contentType: "application/json",
		data: JSON.stringify(getRequestForStudentWireTransferPayment(formId, paymentOption, userId, moduleId, callingFrom, paymentByUserId, gatewayName)),
		dataType: 'html',
		cache: false,
		timeout: 600000,
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				$('#callPaymentStudentModal').modal('hide');
				if (callingFrom == 'migration' || callingFrom == 'signup') {
					$('#logout_modal_logout').modal('show');
				} else {
					$('#logout_modal_continue').modal('show');
				}
			}
		}
	});
}

function getRequestForStudentWireTransferPayment(formId, paymentOption, userId, moduleId, callingFrom, paymentByUserId, gatewayName) {
	var paypalAndWireTransferPaymentInfoDTO = {};
	paypalAndWireTransferPaymentInfoDTO['userId'] = userId;
	paypalAndWireTransferPaymentInfoDTO['paymentByUserId'] = paymentByUserId;
	paypalAndWireTransferPaymentInfoDTO['moduleId'] = moduleId;
	paypalAndWireTransferPaymentInfoDTO['callingFrom'] = callingFrom;
	paypalAndWireTransferPaymentInfoDTO['paymentMode'] = $('#editStage5PaymentMethod').text();
	if (paymentOption == 1) {
		paypalAndWireTransferPaymentInfoDTO['paymentOptionName'] = gatewayName;
		paypalAndWireTransferPaymentInfoDTO['referenceNumber'] = $("#"+formId+" #wireTransferNumberPaypal").val().trim();
		paypalAndWireTransferPaymentInfoDTO['uplaodedFileName'] = $("#"+formId+" #fileName8").html();
		paypalAndWireTransferPaymentInfoDTO['amountPaid'] = $("#"+formId+" #paypalAmount").val().trim();
		paypalAndWireTransferPaymentInfoDTO['userPaymentDetailsId'] = $("#"+formId+" #userPaymentDetailsId").val().trim();
		paypalAndWireTransferPaymentInfoDTO['paymentTitle'] = $("#"+formId+" #paymentTitle").val().trim();
	} else {
		paypalAndWireTransferPaymentInfoDTO['paymentOptionName'] = gatewayName;
		paypalAndWireTransferPaymentInfoDTO['referenceNumber'] = $("#"+formId+" #referenceNumber").val();
		if('CASH'==gatewayName){
			paypalAndWireTransferPaymentInfoDTO['uplaodedFileName'] =$("#"+formId+" #fileName8").html();
		}else{
			paypalAndWireTransferPaymentInfoDTO['uplaodedFileName'] =$("#"+formId+" #fileName9").html();
		}
		paypalAndWireTransferPaymentInfoDTO['amountPaid'] = $("#"+formId+" #wireTransferAmount").val();
		paypalAndWireTransferPaymentInfoDTO['userPaymentDetailsId'] = $("#"+formId+" #userPaymentDetailsId").val();
		paypalAndWireTransferPaymentInfoDTO['paymentTitle'] = $("#"+formId+" #paymentTitle").val();
	}
	console.log("Payment data is : " + JSON.stringify(paypalAndWireTransferPaymentInfoDTO));
	return paypalAndWireTransferPaymentInfoDTO;
}

function callClientCommonPaymentGateway(formId, moduleId, userId, userPaymentDetailsId, termCondi, paymentByUserId) {
	callLocationForPayment();
	customLoader(true);
	$.ajax({
		type: "POST",
		url: getURLForHTML('common', 'call-for-client-common-payment-method'),
		contentType: "application/json",
		data: JSON.stringify(getRequestForClientPayment(formId, moduleId, userId, userPaymentDetailsId, termCondi, paymentByUserId)),
		dataType: 'html',
		global: false,
		success: function (htmlContent) {
			//customLoader(false);
			var stringMessage = [];
			stringMessage = htmlContent.split("|");
			if (stringMessage[0] == "FAILED" || stringMessage[0] == "EXCEPTION" || stringMessage[0] == "SESSIONOUT") {
				if (stringMessage[0] == "SESSIONOUT") {
					redirectLoginPage();
					customLoader(false);
				} else {
					showMessage(true, stringMessage[1]);
				}
			} else if (stringMessage[0] == "NOPAYMENTGATEWAYENABLED") {
				showMessage(true, stringMessage[1]);
			} else if (stringMessage[0] == "INVALIDPAYMENT") {
				window.location.reload();
			} else {
				if($('#reserveSeatModal').length==1){
					$('#reserveSeatModal').modal('hide');
				}
				if (termCondi == 'booksession' || termCondi == 'extension') {
					$("#payTabBookingSessionModal").modal('hide');
					$("#paymentBookSessionModel").html(htmlContent);
					$('#callPaymentStudentModal').modal({ backdrop: 'static', keyboard: false })
					$('#courseFeeModalTNC').modal('hide');
				} else {
					setTimeout(function () { $("#paymentMethodModel").html(htmlContent); }, 1000);
				}
				setTimeout(function () { $('body').addClass("modal-open"); }, 1000);
			}
		},
		error: function (e) {
			if (checkonlineOfflineStatus()) {
				return;
			}else{
				showMessageTheme2(0, TECHNICAL_GLITCH, '', true);
			}
			customLoader(false);
		}
	});
}

function getRequestForClientPayment(formId, moduleId, userId, userPaymentDetailsId, termCondi, paymentByUserId) {
	var clientCommonPaymentInfoDTO = {};
	if ($('#location').length > 0) {
		clientCommonPaymentInfoDTO['location'] = $('#location').val();
	}
	clientCommonPaymentInfoDTO['userId'] = userId;
	clientCommonPaymentInfoDTO['paymentByUserId'] = paymentByUserId;
	clientCommonPaymentInfoDTO['moduleId'] = moduleId;
	clientCommonPaymentInfoDTO['userPaymentDetailsId'] = userPaymentDetailsId;
	clientCommonPaymentInfoDTO['termCondi'] = termCondi;
	console.log("Payment data is : " + JSON.stringify(clientCommonPaymentInfoDTO));
	return clientCommonPaymentInfoDTO;

}

$(document).on("click", "#dashboardPayment #chkval", function () {
	if ($("#chkval").is(":checked")) {
		$("#payTabData").removeAttr("disabled");
	} else {
		$("#payTabData").attr("disabled", true);
	}
});

function continueWorking() {
	$('#logout_modal_logout').modal('hide');
	//	setTimeout(function(){
	//				callDashboardPageStudent('12');
	//			},1000);
}

function callSigninStudentPay(formId, callingFrom) {
	hideModalMessage(true);
	$('#callPaymentStudentModal').modal({ backdrop: 'static', keyboard: false })
	//setTimeout(function(){$('body').addClass('modal-open');},1000);
	$('#courseFeeModalTNC').modal('hide');
	$('#bookAnEnrollmentModel').modal('hide');
	$('#wu_payment_warning').modal('hide');
}
function callStudentTransferSubmit(paymentOption, callingFrom, paymentByUserId, gatewayName) {
	console.log("Payment by parent");
	var functionName = '';
	var userId = $('#userId').val();
	if (paymentOption == 1) {
		if ($("#wireTransferNumberPaypal").val() == '' || $("#wireTransferNumberPaypal").val() == undefined) {
			showMessage(true, "Reference Number is required");
			return false;
		} else {
			functionName = "callStudentWireTransferPayment('" + formId + "', '1', '" + userId + "', 'student','" + callingFrom + "', '" + paymentByUserId + "', '"+gatewayName+"');"
		}
	}
	if (paymentOption == 2) {
		if ($("#referenceNumber").val() == '' || $("#referenceNumber").val() == undefined) {
			showMessage(true, "Reference Number is required");
			return false;
		} else {
			functionName = "callStudentWireTransferPayment('" + formId + "', '2', '" + userId + "', 'student','" + callingFrom + "', '" + paymentByUserId + "', '"+gatewayName+"');"
		}
	}
	$('#proceedStudentPayment').attr("onclick", functionName);
	$('#cancelStudentPayment').attr("onclick", "$('#callPaymentStudentModal').modal({backdrop: 'static', keyboard: false});");
	$('#callPaymentStudentModal').modal('hide');
	$('#reference_number').modal('show');
}

function showAlternatePG() {
	$('#primary-pg').hide(1000)
	$('#alternate-pg').show(1000);
}
function showPrimaryPG() {
	$('#primary-pg').show(1000);
	$('#alternate-pg').hide(1000)
}