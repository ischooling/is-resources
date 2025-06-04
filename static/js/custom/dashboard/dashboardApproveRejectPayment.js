function showPaymentRemarksModal(formId, moduleId, userId, userPaymentDetailsId, studentName, paymentTitle, serialNumber){
	$('#'+formId+' #userPaymentDetailsId').val(userPaymentDetailsId);
	$('#'+formId+' #userId').val(userId);
	$('#'+formId+' #moduleId').val(moduleId);
	$('#'+formId+' #serialNumber').val(serialNumber);
	$('#paymentRemarksTitle').html(studentName+' - '+paymentTitle);
	$('#'+formId+' #remarksStatus').val('');
	$('#paymentRemarksForm #remarks').val('');
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
				showMessage(true, data['message']);
				$('#paymentRemarks').modal('hide');
				var serialNumber = $("#" + formId + " #serialNumber").val()
				$('#remarks-'+serialNumber).html($("#" + formId + " #remarks").val());
				$('#review-'+serialNumber).html('-');
				$('#payment-status-'+serialNumber).removeClass('fa-hourglass-start')
				if($("#" + formId + " #remarksStatus").val()=='Approve'){
					$('#payment-status-'+serialNumber).addClass('fa-check')
					$('#payment-status-message-'+serialNumber).html(' SUCCESS')
				}else if($("#" + formId + " #remarksStatus").val()=='Decline'){
					$('#payment-status-'+serialNumber).addClass('fa-times')
					$('#payment-status-message-'+serialNumber).html(' REJECTED')
				}
//				setTimeout(function(){
//					callSchoolInneraction('17a',$('#'+formId+' #userId').val(),'userPaymentHistoryDetails',moduleId);
//				}, 1000);
			}
			return false;
		}
	});
}

function getRequestForPaymentRemarks(formId, moduleId) {
	var payload = {}
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
	payload['approveRejectRequest'] = approveRejectRequest
	payload['authentication'] = authentication
	return payload;
}