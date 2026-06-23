var APPLICATION_JSON_VALUE = "application/json";
function getURLForSmile(suffixUrl) {
	return BASE_URL + CONTEXT_PATH + SCHOOL_UUID + '/common/' + suffixUrl;
}

//function getURLForHTML(apiType, suffixUrl) {
//	return BASE_URL+CONTEXT_PATH+apiType + '/' + suffixUrl;
//}
function getURLForHTML(apiType, suffixUrl) {
	return BASE_URL + CONTEXT_PATH + SCHOOL_UUID + '/' + apiType + '/' + suffixUrl;
}
function tabActiveStatus(tabPosition) {
	signupPage = tabPosition;
	$('#tabPosition' + tabPosition).trigger('click');
}

function validateRequestForSmile() {
	var showError = 1;
	showMessageBAS('fNameError', '');
	showMessageBAS('lNameError', '');
	showMessageBAS('emailError', '');
	showMessageBAS('countryIdError', '');
	showMessageBAS('stateIdError', '');
	showMessageBAS('cityIdError', '');
	showMessageBAS('pincodeError', '');
	showMessageBAS('addressError', '');
	if ($('#fName').val() == '') {
		showMessageBAS('fNameError', 'First Name is required.');
		showError = 0;
	}
	if ($('#lName').val() == '') {
		showMessageBAS('lNameError', 'Last Name is required.');
		showError = 0;
	}
	if (!validateEmail($('#email').val())) {
		showMessageBAS('emailError', 'Email is either empty or invalid');
		showError = 0;
	}
	if ($('#countryId').val() == null || $('#countryId').val() == 0) {
		showMessageBAS('countryIdError', 'Country is required');
		showError = 0;
	}
	if ($('#stateId').val() == null || $('#stateId').val() == 0) {
		showMessageBAS('stateIdError', 'State is required');
		showError = 0;
	}
	if ($('#cityId').val() == null || $('#cityId').val() == 0) {
		showMessageBAS('cityIdError', 'City is required');
		showError = 0;
	}
	if ($('#pincode').val() == '') {
		showMessageBAS('pincodeError', 'Pincode is required.');
		showError = 0;
	}
	if ($('#address').val() == '') {
		showMessageBAS('addressError', 'Address is required.');
		showError = 0;
	}
	if (showError == 0) {
		return false;
	}
	return true;
}

var signupstage = 1;

function smile() {
	if (signupstage == 1) {
		if ($('#amount-input').val() != null && $('#amount-input').val() != '') {
			if ($('#amount-input').val().charAt(0) == '.') {
				return signupstage = 1;
			}
			if ($('#amount-input').val().charAt(0) == '0') {
				return signupstage = 1;
			}
			if (parseFloat($("#amount-input").val()) > 999999999.99) {
				return signupstage = 1;
			}
			if ($('#amount-input').val().includes('.')) {
				if ($('#amount-input').val().split('.').length != 2) {
					return signupstage = 1;
				} else {
					if ($('#amount-input').val().split('.')[1] == '') {
						return signupstage = 1;
					}
				}
			}
			signupstage = 2;
		} else {
			signupstage = 1
		}
	} else if (signupstage = 2) {
		saveSmile();
	}
}

function smilePrev() {
	signupstage = 1;
}

function saveSmile() {
	if (!validateRequestForSmile()) {
		return false;
	}
	if($('#userPaymentDetailsId').val()!='' && $('#userId').val()!='' && $('#smileId').val()!=''){
		getPaymentGatewaysOptions(SCHOOL_ID,SCHOOL_ID,$('#userPaymentDetailsId').val(),'BUY_A_SMILE',$('#smileId').val(),$('#userId').val());
		return false;
	}
	$.ajax({
		type: "POST",
		url: getURLForSmile("buy-a-smile-save"),
		contentType: APPLICATION_JSON_VALUE,
		data: JSON.stringify(getRequestForSmile()),
		dataType: 'json',
		success: function (data) {
			if (data.statusResponse.status == "FAILED"
				|| data.statusResponse.status == "EXCEPTION"
				|| data.statusResponse.status == "SESSIONOUT") {
				showMessageBAS('serverError', data.statusResponse.message);
			} else if (data.statusResponse.status == "NOPAYMENTGATEWAYENABLED") {
				showMessageBAS('serverError', data.statusResponse.message);
			} else {
				$('#smileId').val(data.smileId);
				$('#userId').val(data.userId);
				$('#userPaymentDetailsId').val(data.userPaymentDetailsId);
				getPaymentGatewaysOptions(SCHOOL_ID,SCHOOL_ID,$('#userPaymentDetailsId').val(),'BUY_A_SMILE',$('#smileId').val(),$('#userId').val());
			}
		}
	});
}

function getRequestForSmile() {
	var buyASmileRequestDTO = {};
	var buyASmileDTO = {};
	if ($('#eId').val() != null) {
		buyASmileRequestDTO['editId'] = $('#eId').val();
		buyASmileRequestDTO['uuId'] = $('#uuId').val();
	}
	buyASmileDTO['amount'] = (Math.round($('#amount-input').val() * 100) / 100).toFixed(2);
	buyASmileDTO['firstName'] = $('#fName').val();
	buyASmileDTO['lastName'] = $('#lName').val();
	buyASmileDTO['email'] = $('#email').val();
	buyASmileDTO['countryId'] = $('#countryId option:selected').val();
	buyASmileDTO['stateId'] = $('#stateId option:selected').val();
	buyASmileDTO['cityId'] = $('#cityId option:selected').val();
	buyASmileDTO['pincode'] = $('#pincode').val();
	buyASmileDTO['address'] = $('#address').val();

	buyASmileDTO['schoolId'] = SCHOOL_ID;
	buyASmileDTO['schoolUUID'] = SCHOOL_UUID;
	buyASmileRequestDTO['buyASmileDTO'] = buyASmileDTO;
	buyASmileRequestDTO['controlType'] = "ADD";
	return buyASmileRequestDTO;
}

// function callStates(formId, value, elementId) {
// 	hideMessage('');
// 	if (!validateRequestForMaster(formId, elementId)) {
// 		$("#" + formId + " #stateId").val(0);
// 		resetDropdown($("#" + formId + " #stateId"), 'Select state');
// 		$("#" + formId + " #cityId").val(0);
// 		resetDropdown($("#" + formId + " #cityId"), 'Select city');
// 		return false;
// 	}
// 	$("#stateId").prop("disabled", true);
// 	resetDropdown($("#" + formId + " #cityId"), 'Select city');
// 	$.ajax({
// 		type: "POST",
// 		contentType: APPLICATION_JSON_VALUE,
// 		url: getURLForCommon('masters'),
// 		data: JSON.stringify(getRequestForMaster(formId, 'STATES-LIST', value)),
// 		dataType: 'json',
// 		cache: false,
// 		timeout: 600000,
// 		success: function (data) {
// 			if (data['status'] == '0' || data['status'] == '2') {
// 				showMessageBAS('serverError', data['message']);
// 			} else {
// 				buildDropdown(data['mastersData']['states'], $('#stateId'), 'Select state');
// 			}
// 			$("#stateId").prop("disabled", false);
// 		}
// 	});
// }

// function callCities(formId, value, elementId) {
// 	hideMessage('');
// 	if (!validateRequestForMaster(formId, elementId)) {
// 		$("#" + formId + " #cityId").val(0);
// 		resetDropdown($("#" + formId + " #cityId"), 'Select city');
// 		return false;
// 	}
// 	$("#" + formId + " #cityId").prop("disabled", true);
// 	$.ajax({
// 		type: "POST",
// 		contentType: APPLICATION_JSON_VALUE,
// 		url: getURLForCommon('masters'),
// 		data: JSON.stringify(getRequestForMaster('formId', 'CITIES-LIST', value)),
// 		dataType: 'json',
// 		cache: false,
// 		timeout: 600000,
// 		success: function (data) {
// 			if (data['status'] == '0' || data['status'] == '2') {
// 				showMessageBAS('serverError', data['message']);
// 			} else {
// 				buildDropdown(data['mastersData']['cities'], $('#cityId'), 'Select city');
// 			}
// 			$("#cityId").prop("disabled", false);
// 			return false;
// 		}
// 	});
// }

function validateRequestForMaster(formId, elementId) {
	if ($('#' + formId + ' #' + elementId).val() == '' || $('#' + formId + ' #' + elementId).val() <= 0) {
		return false;
	}
	return true;
}

function resetDropdown(dropdown, emptyMessage) {
	dropdown.html('');
	//dropdown.append('<option value="0">' + emptyMessage + '</option>');
	dropdown.append('<option disabled selected> </option>');
}

function getURLForCommon(suffixUrl) {
	return BASE_URL + CONTEXT_PATH + SCHOOL_UUID + '/api/v1/common' + '/' + suffixUrl;
}

function getRequestForMaster(formId, key, value, requestExtra, requestExtra1) {
	var request = {};
	var authentication = {};
	var requestData = {};
	requestData['requestKey'] = key;
	requestData['requestValue'] = value;
	if (requestExtra != undefined) {
		requestData['requestExtra'] = requestExtra;
	}
	if (requestExtra1 != undefined) {
		requestData['requestExtra1'] = requestExtra1;
	}
	authentication['hash'] = getHash(); authentication['schoolId'] = SCHOOL_ID; authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = 'COMMON';
	request['authentication'] = authentication;
	request['requestData'] = requestData;
	return request;
}

function buildDropdown(result, dropdown, emptyMessage) {
	dropdown.html('');
	if (result != '') {
		dropdown.append('<option value="0">' + emptyMessage + '</option>');
		//	dropdown.append('<option disabled selected> </option>');
		$.each(result, function (k, v) {
			if (v.extra != null && v.extra1 != null) {
				dropdown.append('<option value="' + v.key + '">' + v.extra + ' - ' + v.extra1 + '</option>');
			} else if (v.extra != null) {
				if (v.extra == 'selected') {
					dropdown.append('<option disabled selected value="' + v.key + '">' + v.value + '</option>');
				} else if (v.extra == 'non-selected') {
					dropdown.append('<option value="' + v.key + '"> ' + v.value + '</option>');
				} else {
					dropdown.append('<option value="' + v.key + '"> ' + v.value + '</option>');
				}

			} else {
				dropdown.append('<option value="' + v.key + '">' + v.value + '</option>');
			}
		});
	} else {
		dropdown.append('<option value="0">' + emptyMessage + '</option>');
	}
}

function hideMessage(id) {
	$('#errorHeading').html('');
	$('#statusMessage').removeClass('success-color');
	$('#statusMessage').removeClass('danger-color');
	$('#statusMessage').html('');
	// $('#modalMessage').modal("hide");
}
function showMessageBAS(elementId, message) {
	$('#' + elementId).html(message);
	if (message = '') {
		$('#' + elementId).removeClass('show');
	} else {
		$('#' + elementId).addClass('show');
	}
}
function hideMessageBAS(elementId) {
	$('#' + elementId).html('');

}

function invokePaymentGateway(formId, userPaymentDetailsId, paidByUserId, schoolId, paymentGateway, schoolIdOfPaymentGateway){
	hideModalMessage('');
	if(paymentGateway=='WELLSFARGO'){
		$('#cardHolderNameError').hide();
		$('#cardNumberError').hide();
		$('#cardExpiryMonthError').hide();
		$('#cardExpiryMonthError').hide();
		$('#cardCodeError').hide();
		if($('#cardHolderName').val()=='' || $('#cardHolderName').val()==undefined){
			$('#cardHolderNameError').show();
			return false;
		}
		if($('#cardNumber').val()=='' || $('#cardNumber').val()==undefined){
			$('#cardNumberError').show();
			return false;
		}
		if($('#cardExpiryYear').val()=='' || $('#cardExpiryYear').val()==undefined){
			$('#cardExpiryMonthError').show();
			return false;
		}
		if($('#cardExpiryMonth').val()=='' || $('#cardExpiryMonth').val()==undefined){
			$('#cardExpiryMonthError').show();
			return false;
		}
		if($('#cardCode').val()=='' || $('#cardCode').val()==undefined){
			$('#cardCodeError').show();
			return false;
		}
	}
	customLoader(true);
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLForHTML('common','invoke-payment-gateway'),
		data : JSON.stringify(invokePaymentGatewayRequest(formId, userPaymentDetailsId, paidByUserId, schoolId, paymentGateway, schoolIdOfPaymentGateway)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data.status == '0' || data.status == '2' || data.status == '3') {
				showModalMessage(0, data['message']);
				if(data['statusCode']=='ELIGIBLE_CUSTOME_PLAN' || data['statusCode']=='REDIRECT_TO_DASHBOOARD'){
					window.location.reload();
				}
			} else {
				showModalMessage(1, data.message);
				window.location.replace(data.details.redirectUrl);
			}
			customLoader(false);
			return false;
		}
	});
}

function invokePaymentGatewayRequest(formId, userPaymentDetailsId, paidByUserId, schoolId, paymentGateway, schoolIdOfPaymentGateway){
	var paymentInitiateRequest = {};
	if($('#location').length>0){
		paymentInitiateRequest['location'] = $('#location').val();
	}else{
		paymentInitiateRequest['location'] = '';
	}
	paymentInitiateRequest['browserDetails'] = userPaymentDetailsId;

	paymentInitiateRequest['userPaymentDetailsId'] = userPaymentDetailsId;
	paymentInitiateRequest['paidByUserId'] = paidByUserId;
	paymentInitiateRequest['schoolId'] = schoolId;
	paymentInitiateRequest['schoolIdOfPaymentGateway'] = schoolIdOfPaymentGateway;
	paymentInitiateRequest['paymentGateway'] = paymentGateway;
	return paymentInitiateRequest;
}

function validateEmail(email) {
	var expr = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
	return expr.test(email);
}

function getHash() {
	return Math.random().toString(36);
}


function showAlternatePG() {
	$('#primary-pg').hide(1000)
	$('#alternate-pg').show(1000);
}
function showPrimaryPG() {
	$('#primary-pg').show(1000);
	$('#alternate-pg').hide(1000)
}

function customLoader(needToShow) {
	if (needToShow) {
		$('#commonloaderId').removeClass('hide');
		$('#commonloaderBody').addClass('loader');
		$('#commonloaderId').addClass('loader-bg');
		$('#commonloaderId').show();
	} else {
		$('#commonloaderBody').removeClass('loader');
		$('#commonloaderId').removeClass('loader-bg');
		$('#commonloaderId').addClass('hide');
		$('#commonloaderId').hide();
	}
}
$.ajaxSetup({
	beforeSend: function (xhr, settings) {
		if (settings.data != undefined) {
			if (settings.contentType == APPLICATION_JSON_VALUE) {
				// var KEUS = getSecreteKey();
				// AesUtil(KEUS.KEYSIZE, KEUS.ITERATIONS);
				var payload = {};
				// payload['payload']=AesUtil.prototype.encrypt(KEUS.SALT, KEUS.IV, KEUS.PASSPHRASE, settings.data);
				payload['payload'] = encode(settings.data);
				settings.data = JSON.stringify(payload);
			}
		}
		xhr.setRequestHeader("UNIQUEUUID", UNIQUEUUID);
		xhr._smsSettings = { url: settings.url, type: settings.type, method: settings.method, data: settings.data };
	}
});

function encode(payload) {
  return window.btoa(encodeURI(payload));
}
