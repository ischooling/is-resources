$(document).ready(function() {
	$("select#countryId").on("change",function(){
		callStates('signupStage2', this.value, 'countryId');
		$('.divStateSchool').removeClass("is-empty");
		$('.divStateCity').removeClass("is-empty");
		$('.divStdIsdCode').removeClass("is-empty");
	});
	$("select#stateId").on("change",function(){
		callCities('signupStage2', this.value, 'stateId');
		$('.divStateCity').removeClass("is-empty");
	});
//	$('#signupStage2 #communicationEmail').blur(function(){
//		var status=emailCheck($('#signupStage2 #communicationEmail').val(), 'SCHOOL');
//		if(status==false){
//			tabActiveStatus(2);
//			showMessage(true, stringMessage[1]);
//			return false;
//		}
//	});
});

function validateRequestForSignupSchoolBasicDetails(formId){
	
	if (!validateFormAscii(formId)) {
		showMessage(false, 'Please use the English Keyboard while providing information');
		return false
	}
	
	if ($("#"+formId+" #countryId").val().trim()==0 || $("#"+formId+" #countryId").val().trim()=='' || $("#"+formId+" #countryId").val()==null) {
		showMessage(true, 'Country is required');
		return false
	}
	if ($("#"+formId+" #stateId").val().trim()==0 || $("#"+formId+" #stateId").val().trim()=='' || $("#"+formId+" #stateId").val()==null) {
		showMessage(true, 'State is required');
		return false
	}
	if ($("#"+formId+" #cityId").val().trim()==0 || $("#"+formId+" #cityId").val().trim()=='' || $("#"+formId+" #cityId").val()==null) {
		showMessage(true, 'City is required');
		return false
	}
	if ($("#"+formId+" #typeOfSchool").val().trim()==0 || $("#"+formId+" #typeOfSchool").val().trim()=='' || $("#"+formId+" #typeOfSchool").val()==null) {
		showMessage(true, 'Type of Institute is required');
		return false
	}
	if ($("#"+formId+" #schoolName").val().trim()=="") {
		showMessage(true, 'Institute Name is required');
		return false
	}
	if ($("#"+formId+" #yearOfEstablishment").val().trim()==0 || $("#"+formId+" #yearOfEstablishment").val().trim()=='' || $("#"+formId+" #yearOfEstablishment").val()==null) {
		showMessage(true, 'Year of Establishment is required');
		return false
	}
	if ($("#"+formId+" #addressAddress1").val().trim()=="") {
		showMessage(true, 'Address Line 1 is required');
		return false
	}
	if ($("#"+formId+" #addressAddress2").val().trim()=="") {
		showMessage(true, 'Address Line 2 is required');
		return false
	}
	if ($("#"+formId+" #pincode").val().trim()=="") {
		showMessage(true, 'Zipcode is required');
		return false
	}
	
//	if ($("#"+formId+" #website").val().trim()=="") {
//		showMessage(true, 'Institute Website is required');
//		return false
//	}
	if ($("#"+formId+" #countryCode").val().trim()==0 || $("#"+formId+" #countryCode").val().trim()=='' || $("#"+formId+" #countryCode").val()==null) {
		showMessage(true, 'ISD code is required');
		return false
	}
	if ($("#"+formId+" #contactNumber").val().trim()=="") {
		showMessage(true, 'Institute Phone No is required');
		return false
	}
	if ($("#"+formId+" #firstName").val().trim()=="") {
		showMessage(true, 'First Name is required');
		return false
	}
	if ($("#"+formId+" #lastName").val().trim()=="") {
		showMessage(true, 'Last Name is required');
		return false
	}
	if($('#roleType').val().trim()=='SCHOOL_B2B'){
		if ($("#"+formId+" #instituteHeadName").val().trim()=='' || $("#"+formId+" #instituteHeadName").val()==null) {
			showMessage(true, 'Name of Head of Institute is required');
			return false
		}
		if ($("#"+formId+" #instituteHeadTitle").val().trim()=='' || $("#"+formId+" #instituteHeadTitle").val()==null) {
			showMessage(true, 'Title of Head of Institute is required');
			return false
		}
		if ($("#"+formId+" #contactPersonStdCode").val().trim()==0  || $("#"+formId+" #contactPersonStdCode").val().trim()=='' || $("#"+formId+" #contactPersonStdCode").val()==null) {
			showMessage(true, 'Contact Person Std code is required');
			return false
		}
		if ($("#"+formId+" #contactPersonPhoneNo").val().trim()=='' || $("#"+formId+" #contactPersonPhoneNo").val()==null) {
			showMessage(true, 'Contact Person Phone no is required');
			return false
		}
//		var status=emailCheck($("#"+formId+" #communicationEmail").val().trim(), 'SCHOOL');
//		if(status==false){
//			tabActiveStatus(2);
//			showMessage(true, stringMessage[1]);
//			return false;
//		}
	}else{
		if ($("#"+formId+" #countryCodeAlternate").val().trim()==0  || $("#"+formId+" #countryCodeAlternate").val().trim()=='' || $("#"+formId+" #countryCodeAlternate").val()==null) {
			showMessage(true, 'Contact ISD code is required');
			return false
		}
		if ($("#"+formId+" #contactNumberAlternate").val().trim()=="") {
			showMessage(true, 'Contact Phone No is required');
			return false
		}
	}
	if ($("#"+formId+" #communicationEmail").val().trim()=="") {
		showMessage(true, 'Contact Person Email is required');
		return false
	}
	if($('#roleType').val()=='SCHOOL'){
		if ($("#"+formId+" #numberOfStudent").val().trim()==0  || $("#"+formId+" #numberOfStudent").val().trim()=='' || $("#"+formId+" #numberOfStudent").val()==null) {
			showMessage(true, 'Number of student is required');
			return false
		}
		if ($("#"+formId+" #numberOfStaffs").val().trim()==0  || $("#"+formId+" #numberOfStaffs").val().trim()=='' || $("#"+formId+" #numberOfStaffs").val()==null) {
			showMessage(true, 'Number of staffs is required');
			return false
		}
		if ($("#"+formId+" #numberOfClassrooms").val().trim()==0  || $("#"+formId+" #numberOfClassrooms").val().trim()=='' || $("#"+formId+" #numberOfClassrooms").val()==null) {
			showMessage(true, 'Number of classroom is required');
			return false
		}
		if ($("#"+formId+" #totalSchoolArea").val().trim()==0  || $("#"+formId+" #totalSchoolArea").val().trim()=='' || $("#"+formId+" #totalSchoolArea").val()==null) {
			showMessage(true, 'Total School Area is required');
			return false
		}
	}
	
	if(!$('#declConfirmation').is(':checked')){
		showMessage(true, 'Please accept the declaration');
		return false
	}
	return true;
}

function callForSignupSchoolBasicDetails(formId) {
	hideMessage('');
	if(!validateRequestForSignupSchoolBasicDetails(formId)){
		tabActiveStatus(2);
		return false;
	}
	$("#nextStep").prop("disabled", true);
	$.ajax({
		type : "POST",
		url : getURLForHTML('school','signup/stage-2'),
		data : encodeURI("request="+JSON.stringify(getRequestForSchoolBasicDetails(formId))),
		dataType : 'html',
		cache : false,
		timeout : 600000,
		success : function(htmlContent) {
			if(htmlContent!=""){
            	var stringMessage = [];
            	stringMessage = htmlContent.split("|");
        		if(stringMessage[0] == "FAILED" || stringMessage[0] == "EXCEPTION" || stringMessage[0] == "SESSIONOUT" ){
        			if(stringMessage[0] == "SESSIONOUT"){
        				redirectLoginPage();
        			}else{
        			showMessage(true, stringMessage[1]);
        			tabActiveStatus(2);
        			}
        		} else {
        			$('#signupStage3Content').html(htmlContent)
        			showMessage(false, 'Basic information updated successfully.');
        			tabActiveStatus(3);
        		}
        		$("#nextStep").prop("disabled", false);
        			return false;
			}
		},
		error : function(e) {
			//showMessage(true, e.responseText);
			$("#nextStep").prop("disabled", false);
			tabActiveStatus(2);
		}
	});
}
function getRequestForSchoolBasicDetails(formId){
	var request = {};
	var authentication = {};
	var requestData = {};
	var signupSchoolDTO = {};
	signupSchoolDTO['countryId'] = $("#"+formId+" #countryId").val().trim();
	signupSchoolDTO['stateId'] = $("#"+formId+" #stateId").val().trim();
	signupSchoolDTO['cityId'] = $("#"+formId+" #cityId").val().trim();
	signupSchoolDTO['typeOfSchool'] = $("#"+formId+" #typeOfSchool").val().trim();
	signupSchoolDTO['schoolName'] = escapeCharacters($("#"+formId+" #schoolName").val().trim());
	signupSchoolDTO['addressAddress1'] = escapeCharacters($("#"+formId+" #addressAddress1").val().trim());
	signupSchoolDTO['addressAddress2'] = escapeCharacters($("#"+formId+" #addressAddress2").val().trim());
	signupSchoolDTO['pincode'] = escapeCharacters($("#"+formId+" #pincode").val().trim());
	signupSchoolDTO['yearOfEstablishment'] = $("#"+formId+" #yearOfEstablishment").val().trim();
	signupSchoolDTO['website'] = escapeCharacters($("#"+formId+" #website").val().trim());
	signupSchoolDTO['email'] = $("#"+formId+" #email").val().trim();
	if($('#roleType').val().trim()=='SCHOOL_B2B'){
		signupSchoolDTO['instituteHeadName'] = escapeCharacters($("#"+formId+" #instituteHeadName").val().trim());
		signupSchoolDTO['instituteHeadTitle'] = escapeCharacters($("#"+formId+" #instituteHeadTitle").val().trim());
		signupSchoolDTO['contactPersonStdCode'] = $.trim($("#"+formId+" #contactPersonStdCode option:selected").text().split(" ")[0].replace("+",""));
		signupSchoolDTO['contactPersonPhoneNo'] = $("#"+formId+" #contactPersonPhoneNo").val().trim();
		signupSchoolDTO['contactPersonDesignation'] = escapeCharacters($("#"+formId+" #contactPersonDesignation").val().trim());
	}
	signupSchoolDTO['countryCode'] = $.trim($("#"+formId+" #countryCode option:selected").text().split(" ")[0].replace("+",""));
	signupSchoolDTO['contactNumber'] = $("#"+formId+" #contactNumber").val().trim();
	signupSchoolDTO['firstName'] = escapeCharacters($("#"+formId+" #firstName").val().trim());
	signupSchoolDTO['lastName'] = escapeCharacters($("#"+formId+" #lastName").val().trim());
	signupSchoolDTO['communicationEmail'] = escapeCharacters($("#"+formId+" #communicationEmail").val().trim());
	if($('#roleType').val().trim()=='SCHOOL'){
		signupSchoolDTO['numberOfStudent'] = $("#"+formId+" #numberOfStudent").val().trim();
		signupSchoolDTO['countryCodeAlternate'] = $.trim($("#"+formId+" #countryCodeAlternate option:selected").text().split(" ")[0].replace("+",""));
		signupSchoolDTO['contactNumberAlternate'] = $("#"+formId+" #contactNumberAlternate").val().trim();
		signupSchoolDTO['numberOfStaffs'] = $("#"+formId+" #numberOfStaffs").val().trim();
		signupSchoolDTO['numberOfClassrooms'] = $("#"+formId+" #numberOfClassrooms").val().trim();
		signupSchoolDTO['totalSchoolArea'] = $("#"+formId+" #totalSchoolArea").val().trim();
		signupSchoolDTO['contactPersonDesignation'] = escapeCharacters($("#"+formId+" #contactPersonDesignation").val().trim());
	}
	if($('#declConfirmation').is(':checked')){
		signupSchoolDTO['declConfirmation'] = 'Y';
	}else{
		signupSchoolDTO['declConfirmation'] = 'N';
	}
	
	requestData['signupSchoolDTO'] = signupSchoolDTO;
	authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = 'SCHOOL';
	authentication['userId'] = $("#"+formId+" #userId").val().trim();
	request['authentication'] = authentication;
	request['requestData'] = requestData;
	return request;
}