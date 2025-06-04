function validateRequestForRequestDemo(formId, folderName){
//	if (!validateFormAscii(formId)) {
//		showMessage(false, 'Please use the English Keyboard while providing information');
//		return false
//	}
	if ($("#"+formId+" #username").val().trim()=='' || $("#"+formId+" #username").val()==null) {
		showMessage(true, 'Name is required');
		return false
	}
	if (!validateEmail($("#" + formId + " #email").val().trim())) {
		showMessage(false, 'Email is either empty or invalid');
		return false
	}
	if($("#"+formId+" #isdCodeMobileNo").length){
		if ($("#"+formId+" #isdCodeMobileNo").val().trim()=='') {
			showMessage(true, 'ISD code is required');
			return false
		}
	}
	if($("#"+formId+" #contactNumber").length){
		if ($("#"+formId+" #contactNumber").val().trim()=='') {
			showMessage(true, 'Contact number is required');
			return false
		}
	}
	if(folderName=='learning-resources-for-schools' || folderName=='best-online-high-school-in-philippines'){
		if($("#"+formId+" #countryTimezoneId").length){
			if ($("#"+formId+" #countryTimezoneId").val().trim()=='' || $("#"+formId+" #countryTimezoneId").val().trim()=='0') {
				showMessage(true, 'Please select a timezone');
				return false
			}
		}
		if($("#"+formId+" #countryId").length){
			if ($("#"+formId+" #countryId").val().trim()=='' || $("#"+formId+" #countryId").val().trim()=='0') {
				showMessage(true, 'Please select a country');
				return false
			}
		}
		if ($("#"+formId+" #schoolName").val().trim()=='') {
			showMessage(true, 'School name is required');
			return false
		}
	}
	if(folderName!='learning-resources-for-schools' && folderName!='best-online-high-school-in-philippines'){
		if($("#"+formId+" #grade").length){
			if ($("#"+formId+" #grade").val().trim()=='0' || $("#"+formId+" #grade").val()==null) {
				showMessage(true, 'Grade is required');
				return false
			}
		}
	}
	/*if ($("#"+formId+" #contactDescription").val().trim()=='' || $("#"+formId+" #contactDescription").val()==null) {
		showMessage(true, 'Description is required');
		return false
	}*/
	return true;
}

function callForRequestDemoForm(formId, moduleId, folderName) {
	hideMessage('');
	if(!validateRequestForRequestDemo(formId, folderName)){
		return false;
	}
	$("#inquiry").prop("disabled", true);
	$.ajax({
		type : "POST",
		url : getURLForHTML('common','reqeust-demo-content'),
		contentType : "application/json",
		data : JSON.stringify(getRequestForRequestDemo(formId, moduleId)),
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
        		}
			}
		},
		error : function(e) {
			$("#sendRequest").prop("disabled", false);
		}
	});
}
function getRequestForRequestDemo(formId, moduleId){
	var request = {};
	var authentication = {};
	var requestData = {};
	var requestDemoDTO = {};
	requestDemoDTO['encryptedRequestDemoId'] = $("#" + formId + " #encryptedRequestDemoId").val().trim();
	requestDemoDTO['location'] = $("#" + formId + " #location").val().trim();
	requestDemoDTO['campaignName'] = $("#" + formId + " #campaingnType").val().trim();
	
	requestDemoDTO['name'] = $("#" + formId + " #username").val().trim();
	requestDemoDTO['email'] = $("#" + formId + " #email").val().trim();
	if($("#" + formId + " #isdCodeMobileNo").length){
		requestDemoDTO['isdCode'] = $("#" + formId + " #isdCodeMobileNo").val().trim();
	}
	requestDemoDTO['contactNumber'] = $("#" + formId + " #contactNumber").val().trim();
	if($("#" + formId + " #isdCodeWhatsupNo").length){
		requestDemoDTO['isdCodeWtsp'] = $("#" + formId + " #isdCodeWhatsupNo").val().trim();
	}
	if($("#" + formId + " #wtspNumber").length){
		requestDemoDTO['wtspNumber'] = $("#" + formId + " #wtspNumber").val().trim();
	}
	if($("#" + formId + " #countryTimezoneId").length){
		requestDemoDTO['countryTimezoneId'] = $('#'+formId+' #countryTimezoneId option:selected').attr('custom_timezone_id');
		requestDemoDTO['timeZone'] = $('#'+formId+' #countryTimezoneId option:selected').text();
	}
	if($("#" + formId + " #countryId").length){
		requestDemoDTO['countryId'] = $('#'+formId+' #countryId option:selected').val().trim();
		requestDemoDTO['countryName'] = $('#'+formId+' #countryId option:selected').text();
	}
	if($("#" + formId + " #schoolName").length){
		requestDemoDTO['schoolName'] = $("#" + formId + " #schoolName").val().trim();
	}
	requestDemoDTO['contactDescription'] = escapeCharacters($("#" + formId + " #description").val().trim());
	requestDemoDTO['meetingDate'] =$("input[name='slotTime']:checked").attr('slotDateAttr');
	requestDemoDTO['meetingSlotId'] = $("input[name='slotTime']:checked").attr('slotidattr');
	requestDemoDTO['meetingSlotTime'] = $("input[name='slotTime']:checked").val().trim();
	if($("#counselorUserId").val()!=undefined && $("#counselorUserId").val()!=null && $("#counselorUserId").val()!=0){
		requestDemoDTO['counselorUserId'] = $("#counselorUserId").val();
	}
	requestData['requestDemoDTO'] = requestDemoDTO;
	authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = moduleId;
	request['authentication'] = authentication;
	request['requestData'] = requestData;
	return request;
}