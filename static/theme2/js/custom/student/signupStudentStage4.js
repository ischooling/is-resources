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

function callStudentTransferSubmitSignup(formId,paymentOption, callingFrom, paymentByUserId, gatewayName){
	var functionName='';
	hideModalMessage('');
	if(paymentOption==1){
		if($("#"+formId+" #wireTransferNumberPaypal").val()=='' || $("#"+formId+" #wireTransferNumberPaypal").val()==undefined){
			showModalMessage(0, 'Reference Number is required');
			return false;
		}else{
			functionName="callStudentWireTransferPayment('" + formId + "', '1', '"+paymentByUserId+"', 'student','"+callingFrom+"', '"+paymentByUserId+"', '"+gatewayName+"');"
		}
	}
	if(paymentOption==2){
		if($("#"+formId+" #referenceNumber").val()=='' || $("#"+formId+" #referenceNumber").val()==undefined){
			showModalMessage(0, 'Reference Number is required');
			return false;
		}
		var elementId='fileName9';
		if(gatewayName=='CASH'){
			elementId='fileName8';
		}
		if($("#"+formId+" #"+elementId).text() == undefined || $("#"+formId+" #"+elementId).text() == ''){
			showModalMessage(0, 'Proof of Payment required');
			return false;
		}
		functionName="callStudentWireTransferPayment('" + formId + "', '2', '"+paymentByUserId+"', 'student','"+callingFrom+"', '"+paymentByUserId+"', '"+gatewayName+"');"
	}
	$('#proceedStudentPayment').attr("onclick",functionName);
	$('#cancelStudentPayment').attr("onclick","$('#callPaymentStudentModal').modal({backdrop: 'static', keyboard: false});");
	$('#callPaymentStudentModal').modal('hide');
	$('#reference_number').modal('show');
}