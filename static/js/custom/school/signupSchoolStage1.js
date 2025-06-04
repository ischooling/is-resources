$(document).ready(function() {
	
});
function saveSignupSchool(){
	if(signupPage==1){
		callForSignupUserDetails('signupStage1');
	}else if(signupPage==2){
		callForSignupSchoolBasicDetails('signupStage2');
	}else if(signupPage==3){
		callForSignupSchoolUpdateProfile('signupStage3');
	}else if(signupPage==4){
		callForSignupSchoolReviewAndApproval('signupStage4');
	}else if(signupPage==5){
		callForSignupSchoolPaymentStructure('signupStage5');
	}else if(signupPage==6){
		if ($("#refPersonName").val().trim()=="") {
			showMessage(true, 'Name Of Authorized Person is required.');
			return false
		}
		if ($("#witnessName").val().trim()=="") {
			showMessage(true, 'Enter Your Witnesses.');
			return false
		}
		$('#declConfirmation7').prop('checked', false);
		$('#termsAndConditionsSchool').modal('show')
//		callForSignupSchoolSigningContractB2B('signupStage6');
		//callForSignupSchoolSigningContract('signupStage6');
	}
}

function validateRequestForSignupUser(formId){
	if($("#"+formId+" #currentPassword").val().trim()!=$("#"+formId+" #currentPassword").val().trim()){
		showMessage(false, 'Current password is not valid');
		return false
	}
	
	if (!validPassword($("#"+formId+" #newPassword").val().trim())) {
		showMessage(false, 'Either new password is empty or invalid');
		return false
	}
	
	if($("#"+formId+" #password").val().trim()!=$("#"+formId+" #confirmPassword").val().trim()){
		showMessage(false, 'Password and Confirm Password do not match');
		return false
	}
	
	var pass=$("#"+formId+" #password").val().trim();
	if (!(pattern.test(pass))) {
		showMessage(false, 'Passwords must match all requirements.');
		return false
	}
	
	return true;
}

function callForSignupUserDetails(formId) {
	hideMessage('');
	if(!validateRequestForSignupUser(formId)){
		tabActiveStatus(1);
		return false;
	}
	$("#nextStep").prop("disabled", true);
	$.ajax({
		type : "POST",
		url : getURLForHTML('teacher','enrollment/stage-1'),
		data : getRequestForUser(formId),
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
            			tabActiveStatus(1);
        			}
        		} else {
        			$('#signupStage2Content').html(htmlContent)
        			showMessage(false, 'User password updated successfully.');
        			tabActiveStatus(2);
        		}
        		$("#nextStep").prop("disabled", false);
        		return false;
			}
		},
		error : function(e) {
			//showMessage(true, e.responseText);
			$("#nextStep").prop("disabled", false);
			tabActiveStatus(1);
		}
	});
}

function getRequestForUser(formId){	
	$(".disabledFields").each(function(){
		$(this).removeAttr('disabled');
	});
	var request = decodeURIComponent($('#'+formId).serialize());
	$(".disabledFields").each(function(){
		$(this).attr('disabled','disabled');
	});
	return request;
}