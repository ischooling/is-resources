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
		$('#profileApproval').addClass('modal-xl');
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
		$('#employeeSpecialization').select2({
			theme:"bootstrap4",
			dropdownParent:".employeeSpecializationWrapper"
		});
	}else{
		$('#profileApproval').removeClass('modal-xl');
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
		showMessageTheme2(false, 'Please use the English Keyboard while providing information');
		return false
	}
    
	if( $('#schoolRemarks').val()=='' || $('#userId').val()=='' || $('#schoolRemarksStatus').val()==undefined ){
		showMessageTheme2(false, 'Remarks is required.');      
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


function submitWithDrawnRequestRemark(
  formId,
  moduleId,
  requestId,
  status,
  userId
) {
  hideMessageTheme2("");
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLForHTML("dashboard", "withdrawn-request-submit"),
    data: JSON.stringify(
      getRequestForSubmitWithDrawnRemark(
        formId,
        moduleId,
        requestId,
        status,
        userId
      )
    ),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        showMessageTheme2(true, data["message"]);
      } else {
        showMessageTheme2(false, data["message"]);
        $("#withdrawnAppovelModal").hide();
        $(".modal-backdrop").remove();
        $("body").removeClass("modal-open");
        callDashboardPageSchool(114, "withdrawn-request-list");
      }
      return false;
    }
  });
}

function getRequestForSubmitWithDrawnRemark(
  formId,
  moduleId,
  requestId,
  status,
  userId
) {
  var request = {};
  var authentication = {};
  var withdrawnRequestDTO = {};
  withdrawnRequestDTO["requestId"] = requestId;
  withdrawnRequestDTO["status"] = status;
  withdrawnRequestDTO["userId"] = userId;
  if ($("#remarks").val() != undefined) {
    withdrawnRequestDTO["remarks"] = $("#remarks").val();
  }

  request["withdrawnRequestDTO"] = withdrawnRequestDTO;
  authentication["hash"] = getHash();
  authentication["userType"] = moduleId;
  authentication["userId"] = USER_ID;
  request["authentication"] = authentication;
  return request;
}