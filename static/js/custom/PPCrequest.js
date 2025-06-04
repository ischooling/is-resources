function validateRequestForPPCRequest(formId){
	if (!validateFormAscii(formId)) {
		showMessage(false, 'Please use the English Keyboard while providing information');
		return false
	}
	
	if ($("#"+formId+" #name").val()=='' || $("#"+formId+" #name").val()==null) {
		showMessage(true, 'Name is required');
		return false
	}
	if (!validateEmail($("#" + formId + " #email").val().trim())) {
		showMessage(false, 'Email is either empty or invalid');
		return false
	}
	if($("#"+formId+" #isdCodeMobileNo").length){
		if ($("#"+formId+" #isdCodeMobileNo").val()=='' || $("#"+formId+" #isdCodeMobileNo").val()==null) {
			showMessage(true, 'Isd code is required');
			return false
		}
	}
	if($("#"+formId+" #contactNumber").length){
		if ($("#"+formId+" #contactNumber").val()=='' || $("#"+formId+" #contactNumber").val()==null) {
			showMessage(true, 'Phone Number is required');
			return false
		}
	}
	if ($("#"+formId+" #grade").val()=='0' || $("#"+formId+" #grade").val()==null) {
		showMessage(true, 'Grade is required');
		return false
	}
	return true;
}

function callForPPCRequestForm(formId, moduleId,folderName) {
	hideMessage('');
	if(!validateRequestForPPCRequest(formId)){
		return false;
	}
	$("#sendRequest").prop("disabled", true);
	$.ajax({
		type : "POST",
		url : getURLForHTML('common','save-ppc-request-content'),
		contentType : "application/json",
		data : JSON.stringify(getRequestForPPCRequest(formId, moduleId, folderName)),
		dataType : 'html',
		cache : false,
		timeout : 600000,
		success : function(htmlContent) {
			if(htmlContent!=""){
            	var stringMessage = [];
            	stringMessage = htmlContent.split("|");
        		if(stringMessage[0] == "FAILED" || stringMessage[0] == "EXCEPTION" || stringMessage[0] == "SESSIONOUT" ){
        			showMessage(true, stringMessage[1]);
        		} else {
        			var url = '';
        			if(ENVIRONMENT=='uat'){
        				url = 'https://staging.internationalschooling.org/istest/common/ppc-request-thank-you';
        				url = 'https://www.internationalschooling.org/'+folderName+'/thank-you.html';
        			}else if(ENVIRONMENT=='dev'){
        				url = 'http://localhost:8080/istest/common/ppc-request-thank-you';
        				url = 'https://www.internationalschooling.org/'+folderName+'/thank-you.html';
        			}else{
        				url = 'https://www.internationalschooling.org/'+folderName+'/thank-you.html';
        			}
        			goAhead(url,'');
        			return false;
        		}
        		return false;
			}
		},
		error : function(e) {
			showMessage(true, TECHNICAL_GLITCH);
			return false;
		}
	});
}
function getRequestForPPCRequest(formId, moduleId, folderName){
	var request = {};
	var authentication = {};
	var requestData = {};
	var PPCRequestDTO = {};
	PPCRequestDTO['name'] = $("#" + formId + " #name").val();
	PPCRequestDTO['email'] = $("#" + formId + " #email").val().trim();
	PPCRequestDTO['isdCode'] = $("#" + formId + " #isdCodeMobileNo :selected").text().split(" ")[0];
	PPCRequestDTO['contactNumber'] = $("#" + formId + " #contactNumber").val();
	PPCRequestDTO['grade'] = $("#" + formId + " #grade").val();
	PPCRequestDTO['description'] = escapeCharacters($("#" + formId + " #description").val());
	PPCRequestDTO['location'] = $("#" + formId + " #location").val();
	PPCRequestDTO['campaignName'] = folderName;
	requestData['ppcRequestDTO'] = PPCRequestDTO;
	authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = moduleId;
	request['authentication'] = authentication;
	request['requestData'] = requestData;
	return request;
}