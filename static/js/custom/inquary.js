$(document).ready(function() {
	$("#inquiryOther").hide();
	$("#inquiry").click(function(){
		 callForInquiryForm('inquiryForm', 'COMMON');
	});
	
	$("select#countryId").on("change",function(){
		callStates('inquiryForm', this.value, 'countryId');
		$('.divState').removeClass("is-empty");
		$('.divStdIsdCode').removeClass("is-empty");
		$('#isdcode option:selected').text($('#countryId option:selected').attr('dailcode'));
	});
	$("select#stateId").on("change",function(){
		callCities('inquiryForm', this.value, 'stateId');
		$('.divCity').removeClass("is-empty");
	});
	$("select#inquiryId").on("change",function(){
		var inquiryType  = $('#inquiryId option:selected').val().trim();
		if(inquiryType =='OTHER'){
			$("#inquiryOther").show();
		}else{
			$("#inquiryOther").hide();
		}
	});
});
function validateRequestForInquiryDetails(formId){
	
	if (!validateFormAscii(formId)) {
		showMessage(false, 'Please use the English Keyboard while providing information');
		return false
	}
	if ($("#"+formId+" #countryId").val().trim()==0 || $("#"+formId+" #countryId").val()==null) {
		showMessage(true, 'Country is required');
		return false
	}
	if ($("#"+formId+" #stateId").val().trim()==0 || $("#"+formId+" #stateId").val()==null) {
		showMessage(true, 'State is required');
		return false
	}
	if ($("#"+formId+" #cityId").val().trim()==0 || $("#"+formId+" #cityId").val()==null) {
		showMessage(true, 'City is required');
		return false
	}
	if ($("#"+formId+" #stateId").val().trim()==0 || $("#"+formId+" #stateId").val()==null) {
		showMessage(true, 'State is required');
		return false
	}
	if ($("#"+formId+" #username").val().trim()=='' || $("#"+formId+" #username").val()==null) {
		showMessage(true, 'Name is required');
		return false
	}
	if (!validateEmail($("#" + formId + " #email").val().trim())) {
		showMessage(false, 'Email is either empty or invalid');
		return false
	}
	if ($("#"+formId+" #userphone").val().trim()=='' || $("#"+formId+" #userphone").val()==null) {
		showMessage(true, 'Phone Number is required');
		return false
	}
	if ($("#"+formId+" #description").val().trim()=='' || $("#"+formId+" #description").val()==null) {
		showMessage(true, 'Description is required');
		return false
	}
	if ($("#"+formId+" #inquiryId option:selected").val().trim()==0 || $("#"+formId+" #inquiryId option:selected").val()==null) {
		showMessage(true, 'Please Select your Type');
		return false
	}
	if ($("#"+formId+" #inquiryId option:selected").val().trim()=='OTHER') {
		if ($("#"+formId+" #otherType").val().trim()=='') {
			showMessage(true, 'Please enter other');
			return false
		}
	}
//	if (!validateCaptcha($("#" + formId + " #captcha").val().trim())) {
//		showMessage(false, 'Either captcha is empty or invalid');
//		return false
//	}
	return true;
}

function callForInquiryForm(formId, moduleId) {
	hideMessage('');
	if(!validateRequestForInquiryDetails(formId)){
		return false;
	}
	$("#inquiry").prop("disabled", true);
	$.ajax({
		type : "POST",
		url : getURLForHTML('common','inquiry-content'),
		contentType : "application/json",
		data : JSON.stringify(getRequestForInquiry(formId, moduleId)),
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
        			$("#inquiry").prop("disabled", false);
        			var url=BASE_URL+CONTEXT_PATH+SCHOOL_UUID+'/common/inquiry-thankyou/'+$("#" + formId + " #inquiryId").val().trim();
        			goAhead(url, '');
        		}
        		$("#inquiry").prop("disabled", false);
        		return false;
			}
			return false;
		},
		error : function(e) {
			$("#inquiry").prop("disabled", false);
		}
	});
}
function getRequestForInquiry(formId, moduleId){
	var request = {};
	var authentication = {};
	var contactUsDTO = {};
	contactUsDTO['countryId'] = $("#" + formId + " #countryId").val().trim();
	contactUsDTO['stateId'] = $("#" + formId + " #stateId").val().trim();
	contactUsDTO['cityId'] = $("#" + formId + " #cityId").val().trim();
	contactUsDTO['name'] = $("#" + formId + " #username").val().trim();
	contactUsDTO['email'] = $("#" + formId + " #email").val().trim();
	contactUsDTO['isdCode'] = $('#inquiryForm #isdcode :selected').text().split(" ")[0];
	contactUsDTO['contactNumber'] = $("#" + formId + " #userphone").val().trim();
	contactUsDTO['contactDescription'] = escapeCharacters($("#" + formId + " #description").val().trim());
	contactUsDTO['inquiryType'] = $("#" + formId + " #inquiryId").val().trim();
	contactUsDTO['inquiryOther'] = $("#" + formId + " #otherType").val().trim();
//	contactUsDTO['captcha'] = $("#" + formId + " #captcha").val().trim();
	contactUsDTO['location'] = $("#" + formId + " #location").val().trim();
	authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = moduleId;
	request['authentication'] = authentication;
	request['data'] = contactUsDTO;
	return request;
}