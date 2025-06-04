$(document).ready(function() {

	
});

function getRequestForPaymentSctructure(formId){
	var request = {};
	var authentication = {};
	var requestData = {};
	var schoolPaymentStructureDTO = {};
	schoolPaymentStructureDTO['userId'] = $("#"+formId+" #userId").val().trim();
	if($('#declration1Stage4').is(':checked')){
		schoolPaymentStructureDTO['declration1Stage4'] = 'Y';
	}else{
		schoolPaymentStructureDTO['declration1Stage4'] = 'N';
	}
	if($('#declration2Stage4').is(':checked')){
		schoolPaymentStructureDTO['declration2Stage4'] = 'Y';
	}else{
		schoolPaymentStructureDTO['declration2Stage4'] = 'N';
	}
	requestData['schoolPaymentStructureDTO'] = schoolPaymentStructureDTO;
	authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = 'SCHOOL';
	authentication['userId'] = $("#"+formId+" #userId").val().trim();
	request['authentication'] = authentication;
	request['requestData'] = requestData;
	return request;
}
function callForSignupSchoolPaymentStructure(formId){
	if(!$('#declration1Stage4').is(':checked')){
		showMessage(true, "Please accept the declaration");
		tabActiveStatus(5);
		return false;
	}
	hideMessage('');
	$.ajax({
		type : "POST",
		url : getURLForHTML('school','signup/stage-5'),
		data : "request="+JSON.stringify(getRequestForPaymentSctructure(formId)),
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
        				tabActiveStatus(5);
        			}
        		} else {
        			showMessage(false, 'Payment structure accepted successfully.');
        			$('#signupStage6Content').html(htmlContent);
        			tabActiveStatus(6);
        		}
        		$("#nextStep").prop("disabled", false);
        			return false;
			}
		},
		error : function(e) {
			//showMessage(true, e.responseText);
			$("#nextStep").prop("disabled", false);
			tabActiveStatus(5);
		}
	});
		
}