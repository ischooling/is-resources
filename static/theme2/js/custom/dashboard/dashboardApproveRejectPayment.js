function showPaymentRemarksModal(formId, moduleId, userId, userPaymentDetailsId, studentName, paymentTitle){
	$('#'+formId+' #userPaymentDetailsId').val(userPaymentDetailsId);
	$('#'+formId+' #userId').val(userId);
	$('#'+formId+' #moduleId').val(moduleId);
	$('#paymentRemarksTitle').html(studentName+' - '+paymentTitle);
	
	$('#paymentRemarks').modal('show');
	
}
function validateRequestForPaymentRemarks(formId){
	
	if($("#" + formId + " #remarksStatus").val()=='' ||$("#" + formId + " #remarksStatus").val()==null || $("#" + formId + " #remarksStatus").val()==undefined){
		showMessage(true, "Please select status of payment");
		return false;
	}
	if($("#" + formId + " #remarks").val()=='' || $("#" + formId + " #remarks").val()==null||$("#" + formId + " #remarks").val()==undefined){
		showMessage(true, "Remark is required");
		return false;
	}
	
	return true;
}
function updatePaymentRemarks(formId, moduleId){
	hideMessage('');
	if (!validateRequestForPaymentRemarks(formId)) {
		return false;
	}
	$("#"+formId+" #addApproveRejectRemarks").prop("disabled", true);
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLFor('dashboard','approve-reject-payment'),
		data : JSON.stringify(getRequestForPaymentRemarks(formId, moduleId)),
		dataType : 'json',
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
				$("#"+formId+" #addApproveRejectRemarks").prop("disabled", false);
			} else {
				$('#paymentRemarks').modal('hide');
				showMessage(true, data['message']);
				setTimeout(function(){
					callSchoolInneraction('17a',$('#'+formId+' #userId').val(),'userPaymentHistoryDetails');
				}, 2000);
				
			}
			return false;
		}
	});
}

function getRequestForPaymentRemarks(formId, moduleId) {
	var approveRejectRequest = {};
	var authentication = {};
	authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['moduleId'] = $('#'+formId+' #moduleId').val();;
	authentication['userId'] = $('#'+formId+' #userId').val();
	
	approveRejectRequest['authentication'] = authentication;
	approveRejectRequest['controlType'] = $("#" + formId + " #remarksStatus").val();
	approveRejectRequest['userId'] = $("#" + formId + " #userId").val();
	approveRejectRequest['userPaymentDetailsId'] = $("#" + formId + " #userPaymentDetailsId").val();
	approveRejectRequest['remarks'] = escapeCharacters($("#" + formId + " #remarks").val());
	return approveRejectRequest;
}