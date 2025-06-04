$(document).ready(function() {

});
function searchPaymentHistory(formId, entityId, entityName){
	var paymentDateSearch = $('#'+formId+' #paymentDateSearch').val();
	var paymentDate='';
	if(paymentDateSearch!=''){
		var splittedDate = paymentDateSearch.split('-');
		paymentDate = splittedDate[2]+'-'+splittedDate[0]+'-'+splittedDate[1];
	}
	var entityId = $('#entityIdSearch').val();
	var entityName = $('#entityNameSearch').val();
	var paymentMode = $('#'+formId+' #paymentModeSearch').val();
	callForPaymentHistory(false, formId, 'add', entityId, entityName, paymentDate, paymentMode)
}
function callForPaymentHistory(showModal, formId, controllType, entityId, entityName, paymentDate, paymentMode) {
	hideMessage('');
	var data = {
		'controllType' : controllType,
		'entityId' : entityId,
		'entityName' : entityName,
		'paymentDate' : paymentDate,
		'paymentMode' : paymentMode
	}
	$.ajax({
		type : "POST",
		contentType : 'application/json',
		url : getURLForHTML('dashboard','payments-by-entity-id'),
		data : JSON.stringify(data),
		dataType : 'html',
		success : function(htmlContent) {
			if(htmlContent!=""){
            	var stringMessage = [];
            	stringMessage = htmlContent.split("|");
        		if(stringMessage[0] == "FAILED" || stringMessage[0] == "EXCEPTION" || stringMessage[0] == "SESSIONOUT" ){
        			showMessage(true, stringMessage[1]);
        		} else {
        			$('#commonPaymentModelContents').html(htmlContent);
        			$('#entityIdSearch').val(entityId);
        			$('#entityNameSearch').val(entityName);
        			if(showModal){
        				$('#commonPaymentModel').modal('show');
        			}
        		}
        		return false;
			}
		},
		error : function(e) {
			console.log(e)
			//showMessage(true, TECHNICAL_GLITCH);
			return false;
		}
	});
}
function showAddPaymentForm(formId, controllType, entityId, entityName, userName){
	$('#commonAddPaymentModel').modal('show');
	$('#entityId').val(entityId);
	$('#entityName').val(entityName);
	$('#userName').val(userName);
	hideModalMessage('');
}
function savePaymentHistory(formId, controllType, entityId, entityName, userName) {
	if ($("#"+formId+" #entityId").val()=='') {
		showModalMessage(true, 'Entity Id is required');
		return false
	}
	if ($("#"+formId+" #entityName").val()=='') {
		showModalMessage(true, 'Entity name is required');
		return false
	}
	if ($("#"+formId+" #paymentDate").val()=='') {
		showModalMessage(true, 'Payment date is required');
		return false
	}
	if ($("#"+formId+" #paymentMode").val()=='' || $("#"+formId+" #paymentMode").val()==null) {
		showModalMessage(true, 'Payment mode is required');
		return false
	}
	if ($("#"+formId+" #paymentCurrency").val()=='' || $("#"+formId+" #paymentCurrency").val()==null) {
		showModalMessage(true, 'Payment currency is required');
		return false
	}
	if ($("#"+formId+" #paymentAmount").val()=='') {
		showModalMessage(true, 'Payment amount is required');
		return false
	}
	if ($("#"+formId+" #remarks").val()=='') {
		showModalMessage(true, 'Remarks is required');
		return false
	}
	var imageName =$('#fileupload1').parent('span').parent('p').parent('div').find('span.fileName').html();
	if(imageName==''){
		showModalMessage(true, 'Attachment is required');
		return false
	}
	$.ajax({
		type : "POST",
		url : getURLForHTML('dashboard','save-payment-history'),
		contentType : 'application/json',
		data : JSON.stringify(getRequestForSavePaymentHistory(formId, moduleId)),
		dataType : 'html',
		cache : false,
		timeout : 600000,
		success : function(htmlContent) {
			if(htmlContent!=""){
            	var stringMessage = [];
            	stringMessage = htmlContent.split("|");
        		if(stringMessage[0] == "FAILED" || stringMessage[0] == "EXCEPTION" || stringMessage[0] == "SESSIONOUT" ){
        			showModalMessage(true, stringMessage[1]);
        		} else {
        			showModalMessage(false, stringMessage[1]);
        			resetPaymentHistoryForm(formId)
        		}
        		return false;
			}
		},
		error : function(e) {
			//showMessage(true, TECHNICAL_GLITCH);
			return false;
		}
	});
}

function getRequestForSavePaymentHistory(formId, moduleId){
	var request = {};
	var authentication = {};
	var requestData = {};
	var commonPaymentHistoryDTO = {};
	commonPaymentHistoryDTO['paymentId']=$("#"+formId+" #paymentId").val();
	commonPaymentHistoryDTO['entityId']=$("#"+formId+" #entityId").val();
	commonPaymentHistoryDTO['entityName']=$("#"+formId+" #entityName").val();
	commonPaymentHistoryDTO['paymentDate']=$("#"+formId+" #paymentDate").val();
	commonPaymentHistoryDTO['paymentMode']=$("#"+formId+" #paymentMode").val();
	commonPaymentHistoryDTO['paymentCurrency']=$("#"+formId+" #paymentCurrency").val();
	commonPaymentHistoryDTO['paymentAmount']=$("#"+formId+" #paymentAmount").val();
	commonPaymentHistoryDTO['remarks']=escapeCharacters($("#"+formId+" #remarks").val());
	var imageName =$('#fileupload1').parent('span').parent('p').parent('div').find('span.fileName').html();
	if(imageName!='' && imageName!=undefined){
		if ($.inArray($.trim(imageName.split('.').pop().toLowerCase()), ['gif','png','jpg','jpeg','pdf']) == -1){
	
		}else{
			commonPaymentHistoryDTO['attachment']=imageName;
		}
	}
	commonPaymentHistoryDTO['addedBy']=$("#"+formId+" #userId").val();
	
	authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = moduleId;
	authentication['userId'] = $("#"+formId+" #userId").val();
	request['authentication'] = authentication;
	request['commonPaymentHistoryDTO'] = commonPaymentHistoryDTO;
	return request;
}
function resetPaymentHistoryForm(formId){
	$("#"+formId+" #paymentDate").val('');
	$("#"+formId+" #paymentMode").val('');
	$("#"+formId+" #paymentCurrency").val('');
	$("#"+formId+" #paymentAmount").val('');
	$("#"+formId+" #remarks").val('');
	removeDocument('1','3');
}
function validateRequestForSaveTeacherOfficialMail(formId,moduleId,controllType){
	if(controllType=='ADD'){
		if (!validateEmail($("#"+formId+" #officialEmailId").val())) {
			showMessage(true, 'Email is invalid');
			return false;
		}
		if (!validateEmail($("#"+formId+" #confirmOfficialEmailId").val())) {
			showMessage(true, 'Confirm Email is invalid');
			return false;
		}
		if($("#"+formId+" #officialEmailId").val().trim()!= $("#"+formId+" #confirmOfficialEmailId").val().trim()){
			showMessage(true, 'Email and Confirm Email are not same');
			return false;
		}
		
		if ($('#teamUserCheck').is(":checked")== true ) {
			if ($("#"+formId+" #teamPassword").val()=='') {
				showMessage(true, 'Password is invalid');
				return false;
			}
			if ($("#"+formId+" #confirmTeamPassword").val()=='') {
				showMessage(true, 'Confirm Password is invalid');
				return false;
			}
			if($("#"+formId+" #teamPassword").val().trim()!= $("#"+formId+" #confirmTeamPassword").val().trim()){
				showMessage(true, 'Password and Confirm Password are not same');
				return false;
			}
		}
	}
	return true;
}
function saveTeacherOfficialMail(formId,moduleId,controllType,teacherId, roleModuleId, fromUrl) {
	hideMessage('');
	if(!validateRequestForSaveTeacherOfficialMail(formId,moduleId,controllType,teacherId)){
		return false;
	}
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLFor('dashboard','save-teacher-official-email'),
		data : JSON.stringify(getRequestForSaveTeacherOfficialMail(formId, moduleId,controllType,teacherId, roleModuleId)),
		dataType : 'json',
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				showMessage(false, data['message']);
				
				if(fromUrl=='withdraw'){
					setTimeout(function(){ callDashboardPageSchool(roleModuleId,'withdraw-teachers'); }, 1000);
				}else{
					if(controllType=='ADD'){
						$('#teacherOfficialModel').modal('hide');
						setTimeout(function(){ callDashboardPageSchool(roleModuleId,'approved-teachers'); }, 1000);
					}else if(controllType=='REFRESH_TOKEN'){
					}else{
						setTimeout(function(){ callDashboardPageSchool(roleModuleId,'approved-teachers'); }, 1000);
						
					}
				}
			}
			return false;
		}
	});
}

function getRequestForSaveTeacherOfficialMail(formId,moduleId,controllType,teacherId){
	var request = {};
	var authentication = {};
	var requestData = {};
	var teacherRequestDTO = {};
	teacherRequestDTO['controllType'] = controllType;
	teacherRequestDTO['userId'] = $("#userId").val();
	teacherRequestDTO['gotoMeetingIdT'] = $("#"+formId+" #teamMeetingId").val();
	if ($('#teamUserCheck').is(":checked")== true) {
		teacherRequestDTO['teamUserCreationStatus'] ='T';
		teacherRequestDTO['gotoMeetingPasswordT'] = $("#"+formId+" #teamPassword").val();
	}else{
		teacherRequestDTO['teamUserCreationStatus'] ='F';
	}		
	if(controllType=='ADD'){
		teacherRequestDTO['teacherId'] = $("#"+formId+" #teacherId").val();
		teacherRequestDTO['officialEmail'] = $("#"+formId+" #officialEmailId").val().trim();
	}else if(controllType=='WITHDRAW'){
		teacherRequestDTO['teacherId'] = teacherId;
	}else {
		teacherRequestDTO['teacherId'] = teacherId;
	}
	
	requestData['teacherRequestDTO'] = teacherRequestDTO;
	authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = moduleId;
	authentication['userId'] = $("#userId").val();
	request['authentication'] = authentication;
	request['teacherRequestDTO'] = teacherRequestDTO;
	return request;
}

function callTeacherOfficialEmailModal(teacherId, userId, officialEmailId,gotoMeetingIdT,gotoMeetingPasswordT,zoomPassword,teamStatus){
	$('#teacherOfficialModel').modal('show');
	$('#teacherOfficialMailForm #teamPassword').val('');
	$('#teacherOfficialMailForm #confirmTeamPassword').val('');
	$('#teacherOfficialMailForm #teacherId').val(teacherId);
	$('#teacherOfficialMailForm #userId').val(userId);
	$('#teacherOfficialMailForm #teamMeetingId').val(gotoMeetingIdT);
	$('#teacherOfficialMailForm #officialEmailId').val(officialEmailId);
	$('#teacherOfficialMailForm #confirmOfficialEmailId').val(officialEmailId);
	$('#teacherOfficialMailForm #zoomPassword').val(zoomPassword);
	$('#teamUserCreationDiv').show(); 
	if(officialEmailId==''){
		gotoMeetingPasswordT='';
	}
	if(gotoMeetingPasswordT=='' || officialEmailId==''){
		$('.switch-input').prop('checked', false);
		$("#teamUserCheck").prop('disabled', false);
		$('.paswrd').css("display","none"); 
	}else{
		$('.switch-input').prop('checked', true);
		$("#teamUserCheck").prop('disabled', true);
		$('.paswrd').css("display","block");
		$('#teacherOfficialMailForm #teamPassword').val(gotoMeetingPasswordT);
		$('#teacherOfficialMailForm #confirmTeamPassword').val(gotoMeetingPasswordT);
	}
	if(teamStatus!='Active' && teamStatus!='Inactive'){
		$('#teamUserCreationDiv').hide(); 
	}
}