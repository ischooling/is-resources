//$('.vcarousel').carousel({
//    interval: 3000
//})
//$(".counter").counterUp({
//    delay: 100,
//    time: 1200
//});

function callDashboardPageAuditor(pageNo, replaceDiv){
	if(pageNo=='1'){
		callForDashboardData('formIdIfAny','previous-submitted-reports-content');
	}else if(pageNo=='1a'){
		callForDashboardData('formIdIfAny','previous-submitted-reports-content');
	}else if(pageNo=='1b'){
		callForDashboardData('formIdIfAny','pending-reports-content');
	}else if(pageNo=='1c'){
		callForDashboardData('formIdIfAny','submitted-evaluation-content');
	}else if(pageNo=='1d'){
		callForDashboardData('formIdIfAny','saved-evaluation-content');
	}
}

function callAuditorInneractionNew(actionType, arg0,replaceDiv){
	if(actionType=='editEvaluationForm'){
		callForDashboardData('formIdIfAny','edit-evaluation-form-content?schoolId='+arg0);	
	}else if(actionType=='viewEvaluationForm'){
		callForDashboardData('formIdIfAny','view-evaluation-form-content?schoolId='+arg0);	
	}
}
function submitEvaluationRemarks(formId,moduleId,finalSubmit,status) {
	var length = escapeCharacters(editor1.getData()).length;
	if(length>9000){
		showMessage(true, 'You have exceeded the required limit of characters in remarks.');
		return false
	}
	hideMessage('');
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLFor('school','evaluation-remarks-submit'),
		data : JSON.stringify(getRequestForSubmitEvaluationRemarks(formId, moduleId,finalSubmit,status)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				showMessage(true, data['message']);
				if(finalSubmit){
					$('#success-form-modal').modal('show');
					location.reload();
				}
			}
			return false;
		},
		error : function(e) {
			//showMessage(true, e.responseText);
			return false;
		}
	});
}
function getRequestForSubmitEvaluationRemarks(formId,moduleId,finalSubmit,status){
	var request = {};
	var authentication = {};
	var requestData = {};
	var schoolEvaluationDTO = {};
	var schoolEvaluation={};
	var requestObj='';
	if($('input[name=remarks1]:checked').val()!=undefined){
		schoolEvaluationDTO['remarks1']=$('input[name=remarks1]:checked').val();
	}
	if($('input[name=remarks2]:checked').val()!=undefined){
		schoolEvaluationDTO['remarks2']=$('input[name=remarks2]:checked').val();
	}
	if($('input[name=remarks3]:checked').val()!=undefined){
		schoolEvaluationDTO['remarks3']=$('input[name=remarks3]:checked').val();
	}
	if($('input[name=remarks4]:checked').val()!=undefined){
		schoolEvaluationDTO['remarks4']=$('input[name=remarks4]:checked').val();
	}
	if($('input[name=remarks5]:checked').val()!=undefined){
		schoolEvaluationDTO['remarks5']=$('input[name=remarks5]:checked').val();
	}
	if($('input[name=remarks6]:checked').val()!=undefined){
		schoolEvaluationDTO['remarks6']=$('input[name=remarks6]:checked').val();
	}
	if($('input[name=remarks7]:checked').val()!=undefined){
		schoolEvaluationDTO['remarks7']=$('input[name=remarks7]:checked').val();
	}
	if($('input[name=remarks8]:checked').val()!=undefined){
		schoolEvaluationDTO['remarks8']=$('input[name=remarks8]:checked').val();
	}
	if($('input[name=remarks9]:checked').val()!=undefined){
		schoolEvaluationDTO['remarks9']=$('input[name=remarks9]:checked').val();
	}
	if(editor1!=undefined){
		schoolEvaluationDTO['remarks10']=escapeCharacters(editor1.getData());
	}
	if(finalSubmit){
		schoolEvaluationDTO['finalSubmit']=1;
	}
	if(status){
		schoolEvaluationDTO['assignStatus']=1;
		schoolEvaluationDTO['status']=$("input[name='approved']:checked"). val();
	}
	schoolEvaluationDTO['status']=$("input[name='approved']:checked"). val();
	
	requestData['schoolEvaluationDTO'] = schoolEvaluationDTO;
	authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = moduleId;
	authentication['userId'] = $("#"+formId+" #userId").val();
	request['authentication'] = authentication;
	request['requestData'] = requestData;
	return request;
}
function validateRequestForSubmitEvaluationRemarks(){
	if(!$('#approved').is(':checked') && !$('#onHold').is(':checked') && !$('#rejected').is(':checked')){
		showMessage(false, 'please update status');
		return false
	}

	if (!validateCharacters(escapeCharacters(editor1.getData()))) {
		showMessage(false, 'Please use the English Keyboard while providing information');
		return false
	}
	
  return true;
}
function callForUpdateEvaluation(formId,moduleId,finalSubmit,status) {
	if(!validateRequestForSubmitEvaluationRemarks()){
		return false;
	}
	$('#submit-form-modal').modal({backdrop: 'static', keyboard: false}) 
	
}