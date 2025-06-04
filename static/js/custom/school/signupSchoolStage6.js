$(document).ready(function() {
	
});
function cancelSchoolPayment(src){
	$('#callWireTransferModal').modal('hide');
}

function callTransferSubmit(src){
	if($('#wireTransferNumber').val().trim()=='' || $('#wireTransferNumber').val().trim()==undefined){
		showMessage(true, 'WireTransfer Number is required');
		return false;
	}else{
		$('#callWireTransferModal').modal('show');
	}
}

function callSchoolPayOnline(src){
	callInitPayment('','SCHOOL_B2B');
	var args='type=One_time_Application_Fee&userId=&payId=&paymentType=One_time_Application_Fee';
	callCommonPaymentGateway('signupStage6','school',args);
}

function callSigninSchoolPay(src){
	$('#termsAndConditionsSchool').modal('hide')
	$('#callWireTransferModalDecline').modal('hide');
	callForSignupSchoolSigningContractB2B('signupStage6');
}

function callDeclConfirmation(src){
	if($("#declConfirmation7").is(":checked")){
		$("#signingSchoolPay").removeAttr("disabled");
	}else{
		$("#signingSchoolPay").attr("disabled", true);
	}
}

function callForSignupSchoolSigningContract(formId){
	hideMessage('');
	if(validateForSigningContract('formId')){
		tabActiveStatus(6);
		return false;
	}
	$.ajax({
		type : "POST",
		url : getURLForHTML('school','signup/stage-6'),
		data : encodeURI("request="+JSON.stringify(getRequestForSigningContract(formId))),
		dataType : 'html',
		cache : false,
		timeout : 600000,
		success : function(htmlContent) {
			if(htmlContent!=""){
            	var stringMessage = [];
            	stringMessage = htmlContent.split("|");
        		if(stringMessage[0] == "FAILED" || stringMessage[0] == "EXCEPTION" || stringMessage[0] == "SESSIONOUT"){
        			if(stringMessage[0] == "SESSIONOUT"){
        				redirectLoginPage();
        			}else{
        				showMessage(true, stringMessage[1]);
        				tabActiveStatus(6);
        			}
        		} else {
        			showMessage(false, 'School request updated successfully.');
        			url = "/dashboard/school";
    				goAhead(url, '');
        		}
        		$("#nextStep").prop("disabled", false);
    			return false;
			}
		},
		error : function(e) {
			showMessage(true, e.responseText);
			$("#nextStep").prop("disabled", false);
			tabActiveStatus(6);
		}
	});
		
}

function validateForSigningContract(formId){
	if ($("#"+formId+" #refThrough").val().trim()==""||
			$("#"+formId+" #witnessName").val().trim()=="") {
		showMessage(true, 'Please Fill the mandotory field For the contract');
		return false
	}
	return true;
}

function callForSignupSchoolSigningContractB2B(formId){
	hideMessage('');
	$.ajax({
		type : "POST",
		url : getURLForHTML('school','signup/stage-6'),
		data : encodeURI("request="+JSON.stringify(getRequestForSigningContract(formId))),
		dataType : 'html',
		cache : false,
		timeout : 600000,
		success : function(htmlContent) {
			if(htmlContent!=""){
            	var stringMessage = [];
            	stringMessage = htmlContent.split("|");
        		if(stringMessage[0] == "FAILED" || stringMessage[0] == "EXCEPTION" || stringMessage[0] == "SESSIONOUT"){
        			if(stringMessage[0] == "SESSIONOUT"){
        				redirectLoginPage();
        			}else{
        				showMessage(true, stringMessage[1]);
        				tabActiveStatus(6);
        			}
        		} else {
        			showMessage(false, 'School contract saved successfully.');
        			$('#callPaymentModal').modal('show');
        		}
        		$("#nextStep").prop("disabled", false);
    			return false;
			}
		},
		error : function(e) {
			//showMessage(true, e.responseText);
			$("#nextStep").prop("disabled", false);
			tabActiveStatus(6);
		}
	});
		
}
function getRequestForSigningContract(formId){
	var request = {};
	var authentication = {};
	var requestData = {};
	
	var schoolSigningContractsDTO = {};
	schoolSigningContractsDTO['userId'] = $("#"+formId+" #userId").val().trim();
	schoolSigningContractsDTO['contractDate'] = $("#"+formId+" #currentDate").val().trim();
	schoolSigningContractsDTO['schoolCompAddress'] = escapeCharacters($("#"+formId+" #regSchoolName").val().trim());
	schoolSigningContractsDTO['chairPersonName'] = escapeCharacters($("#"+formId+" #regSchoolName").val().trim());
	schoolSigningContractsDTO['refThrough'] = escapeCharacters($("#"+formId+" #refPersonName").val().trim());
	schoolSigningContractsDTO['designation'] = escapeCharacters($("#"+formId+" #designationName").val().trim());
	schoolSigningContractsDTO['witnessName'] = escapeCharacters($("#"+formId+" #witnessName").val().trim());
	requestData['schoolSigningContractsDTO'] = schoolSigningContractsDTO;
	authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = 'SCHOOL';
	authentication['userId'] = $("#"+formId+" #userId").val().trim();
	request['authentication'] = authentication;
	request['requestData'] = requestData;
	return request;
}

function callInitPayment(formId, moduleId) {
	hideMessage('');
	$('#callPaymentModal').modal('show');
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLFor('school','signup/payment-initiated'),
		data : JSON.stringify(getSchoolRequestForInitPayment(formId, moduleId)),
		dataType : 'json',
		cache : false,
		async:false,
		timeout : 600000,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				showMessage(true, data['message']);
			}
			return false;
		},
		error : function(e) {
			//showMessage(true, e.responseText);
		}
	});
}
function getSchoolRequestForInitPayment(formId, moduleId){
	console.log('in 11');
	var request = {};
	var authentication = {};
	var requestData = {};
	var commonPaymentInfoDTO = {};
	if($('#location').length>0){
		commonPaymentInfoDTO['location'] = $('#location').val();
	}else{
		commonPaymentInfoDTO['location'] = '';
	}
	commonPaymentInfoDTO['userType'] = moduleId;
	commonPaymentInfoDTO['moduleName'] = 'SCHOOL_B2B';
	requestData['commonPaymentInfoDTO'] = commonPaymentInfoDTO;
	authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = moduleId;
	authentication['userId']=$('#userId').val().trim();
	request['authentication'] = authentication;
	request['requestData'] = requestData;
	return request;
}
function callWireTransferPayment(formId, moduleId) {
	hideMessage('');
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLFor('school','call-wireTransferPayment'),
		data : JSON.stringify(getRequestForWireTransferPayment(formId, moduleId)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				showMessage(true, data['message']);
				$('#callWireTransferModalInProcess').modal('show');
				location.reload();
			}
			return false;
		},
		error : function(e) {
			//showMessage(true, e.responseText);
		}
	});
}
function getRequestForWireTransferPayment(formId, moduleId){
	var request = {};
	var authentication = {};
	var requestData = {};
	var wireTransferInfoDTO = {};
	wireTransferInfoDTO['userType'] = 'SCHOOL_B2B';
	wireTransferInfoDTO['moduleName'] = 'SCHOOL_B2B';
	wireTransferInfoDTO['referenceNumber'] = escapeCharacters($('#wireTransferNumber').val().trim());
	wireTransferInfoDTO['paymentType'] = $('#paymentType').val().trim();
	requestData['wireTransferInfoDTO'] = wireTransferInfoDTO;
	authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = 'SCHOOL_B2B';
	authentication['userId']=$('#userId').val().trim();
	request['authentication'] = authentication;
	request['requestData'] = requestData;
	return request;
}