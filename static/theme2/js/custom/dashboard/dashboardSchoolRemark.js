function changeRemark(){
	if($('#interviewApprovalId #remarksStatus').val()=="3"){
		$('#interviewApproval').addClass('modal-lg');
		$('#interviewApprovalId #pendingRemark').hide();
		$('#interviewApprovalId #techerAgreementShow').show();
		initEditor(1, 'techerAgreementTinymce1','Please provide teacher agreement, if any', true);
		$('#showAgreement').show();
		$('#showRemark').hide();
		$('#agreementRefNumber').val('');
		$('#agreementDate').val('');
		$('#remarksInterview').val('');
	}else{
		$('#interviewApproval').removeClass('modal-lg');
		$('#interviewApprovalId #pendingRemark').show();
		$('#showAgreement').hide();
		$('#showRemark').show();
		$('#interviewApprovalId #techerAgreementShow').hide();
	
	}
}
function redirectToBankDetailsOnProfileRequest(){
	if($('#profileApprovalId #remarksStatus').val()=="3"){
		$('#profileApproval').addClass('modal-lg');
		$('#profileApprovalId #pendingRemark').hide();
		$('#profileApprovalId #techerAgreementShow').show();
		$('#showAgreement1').show();
		$('#showRemark1').hide();
		$('#agreementRefNumber').val('');
		$('#agreementDate').val('');
		$('#remarksInterview').val('');
		$("#employeeSpecialization").select2()
		$('#employeeType').val('');
		$('#typeOfTeacher').val('');
		$('#teacherDesignation').val('');
		$('#teacherDepartment').val('');
		initEditor(1, 'techerAgreementTinymce','Please provide teacher agreement, if any', true);
	}else{
		$('#profileApproval').removeClass('modal-lg');
		$('#profileApprovalId #pendingRemark').show();
		$('#showAgreement1').hide();
		$('#showRemark1').show();
		$('#profileApprovalId #techerAgreementShow').hide();
	
	}
}
function callRemarksModel(userId){
	$('#profileApprovalModal').modal('show');
	$('#userId').val(userId);
}

function updateSchoolRemarks(){
	if (!validateCharacters($('#schoolRemarks').val())) {
		showMessage(false, 'Please use the English Keyboard while providing information');
		return false
	}
    
	if( $('#schoolRemarks').val()=='' || $('#userId').val()=='' || $('#schoolRemarksStatus').val()==undefined ){
		showMessage(false, 'Remarks is required.');      
		return false;
	}
	var remarks=escapeCharacters($('#schoolRemarks').val());
	var userId=$('#userId').val();
	if($('#schoolApprovalId #schoolRemarksStatus').val()==1){
		callCommonAction('','approve-school-request','dashboard','approve&'+remarks,userId);
	}else{
		callCommonAction('','approve-school-request','dashboard','decline&'+remarks,userId);
	}
	$('#schoolApprovalModal').modal('hide');
	setTimeout(function(){ callDashboardPageSchool('6b'); }, 1000);
}