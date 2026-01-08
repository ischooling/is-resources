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
	hideMessageTheme2('');
	var data = {
		'controllType' : controllType,
		'entityId' : entityId,
		'entityName' : entityName,
		'paymentDate' : paymentDate,
		'paymentMode' : paymentMode
	}
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLForHTML('dashboard','payments-by-entity-id'),
		data : JSON.stringify(data),
		dataType : 'html',
		cache : false,
		timeout : 600000,
		success : function(htmlContent) {
			if(htmlContent!=""){
            	var stringMessage = [];
            	stringMessage = htmlContent.split("|");
        		if(stringMessage[0] == "FAILED" || stringMessage[0] == "EXCEPTION" || stringMessage[0] == "SESSIONOUT" ){
        			showMessageTheme2(0, stringMessage[1]);
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
		}
	});
}
function showAddPaymentForm(formId, controllType, entityId, entityName, userName){
	$("#addPaymentHistory").trigger('reset');
	$('#commonAddPaymentModel').modal('show');
	$('#entityId').val(entityId);
	$('#entityName').val(entityName);
	$('#userName').val(userName);
	removeDocument('1','4')
	hideModalMessage('');
}
function savePaymentHistory(formId, controllType, entityId, entityName, userName) {
	if ($("#"+formId+" #entityId").val()=='') {
		showMessageTheme2(0, 'Entity Id is required');
		return false
	}
	if ($("#"+formId+" #entityName").val()=='') {
		showMessageTheme2(0, 'Entity name is required');
		return false
	}
	if ($("#"+formId+" #paymentDate").val()=='') {
		showMessageTheme2(0, 'Payment date is required');
		return false
	}
	if ($("#"+formId+" #paymentMode").val()=='' || $("#"+formId+" #paymentMode").val()==null) {
		showMessageTheme2(0, 'Payment mode is required');
		return false
	}
	if ($("#"+formId+" #paymentCurrency").val()=='' || $("#"+formId+" #paymentCurrency").val()==null) {
		showMessageTheme2(0, 'Payment currency is required');
		return false
	}
	if ($("#"+formId+" #paymentAmount").val()=='') {
		showMessageTheme2(0, 'Payment amount is required');
		return false
	}
	if ($("#"+formId+" #remarks").val()=='') {
		showMessageTheme2(0, 'Remarks is required');
		return false
	}
	var imageName = $('#fileupload1').parent().find('span.fileName').html();;
	if(imageName == null || imageName == undefined || imageName==''){
		showMessageTheme2(0, 'Attachment is required');
		return false
	}
	$.ajax({
		type : "POST",
		url : getURLForHTML('dashboard','save-payment-history'),
		contentType : APPLICATION_JSON_VALUE,
		data : JSON.stringify(getRequestForSavePaymentHistory(formId, moduleId)),
		dataType : 'html',
		cache : false,
		timeout : 600000,
		success : function(htmlContent) {
			if(htmlContent!=""){
            	var stringMessage = [];
            	stringMessage = htmlContent.split("|");
        		if(stringMessage[0] == "FAILED" || stringMessage[0] == "EXCEPTION" || stringMessage[0] == "SESSIONOUT" ){
        			showMessageTheme2(0, stringMessage[1]);
        		} else {
        			showMessageTheme2(1, stringMessage[1]);
        			resetPaymentHistoryForm(formId)
					$('#commonAddPaymentModel').modal('hide');
        		}
        		return false;
			}
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
	var imageName =$('#fileupload1').parent().find('span.fileName').html();
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
	removeDocument('1','4');
}
function validateRequestForSaveTeacherOfficialMail(formId,moduleId,controllType){
	if(controllType=='ADD'){
		if (!validateEmail($("#"+formId+" #officialEmailId").val())) {
			showMessageTheme2(0, 'Email is invalid');
			return false;
		}
		if (!validateEmail($("#"+formId+" #confirmOfficialEmailId").val())) {
			showMessageTheme2(0, 'Confirm Email is invalid');
			return false;
		}
		if($("#"+formId+" #officialEmailId").val().trim()!= $("#"+formId+" #confirmOfficialEmailId").val().trim()){
			showMessageTheme2(0, 'Email and Confirm Email are not same');
			return false;
		}
		
		if ($('#teamUserCheck').is(":checked")== true ) {
			if ($("#"+formId+" #teamPassword").val()=='') {
				showMessageTheme2(0, 'Password is invalid');
				return false;
			}
			if ($("#"+formId+" #confirmTeamPassword").val()=='') {
				showMessageTheme2(0, 'Confirm Password is invalid');
				return false;
			}
			if($("#"+formId+" #teamPassword").val().trim()!= $("#"+formId+" #confirmTeamPassword").val().trim()){
				showMessageTheme2(0, 'Password and Confirm Password are not same');
				return false;
			}
		}
	}
	return true;
}
function saveTeacherBufferHoursToAddAvailability(formId,roleModuleId) {
	hideMessageTheme2('');
	if($('#'+formId+' #bufferHours').val()==undefined || $('#'+formId+' #bufferHours').val()==''){
		showMessageTheme2(0, 'Either buffer hours are empty or invalid');
		return false;
	}
	var data={};
	data['userId']=$('#'+formId+' #userId').val();
	data['teacherId']=$('#'+formId+' #teacherId').val();
	data['bufferHours']=$('#'+formId+' #bufferHours').val();
	data['sessionUserId']=USER_ID;
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLFor('dashboard','save-teacher-buffer-hours-for-availability'),
		data : JSON.stringify(data),
		dataType : 'json',
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessageTheme2(0, data['message']);
			} else {
				showMessageTheme2(1, data['message']);
				$('#teacherAddBufferAvailaibilityModel').modal('hide');
				setTimeout(function(){ 
					//callDashboardPageSchool(roleModuleId,'approved-teachers'); 
					getApprovedTeacherList(roleModuleId, USER_ID, SCHOOL_ID, '0', '0,1', 0) ;
				}, 1000);
			}
			return false;
		}
	});
}
function saveTeacherOfficialMail(formId,moduleId,controllType,teacherId, roleModuleId, fromUrl) {
	hideMessageTheme2('');
	if(!validateRequestForSaveTeacherOfficialMail(formId,moduleId,controllType,teacherId)){
		return false;
	}
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLFor('dashboard','save-teacher-official-email'),
		data : JSON.stringify(getRequestForSaveTeacherOfficialMail(formId, moduleId,controllType,teacherId, roleModuleId)),
		dataType : 'json',
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessageTheme2(0, data['message']);
			} else {
				showMessageTheme2(1, data['message']);
				
				if(fromUrl=='withdraw'){
					setTimeout(function(){ callDashboardPageSchool(roleModuleId,'withdraw-teachers'); }, 1000);
				}else{
					if(controllType=='ADD'){
						$('#teacherOfficialModel').modal('hide');
						setTimeout(function(){ 
							//callDashboardPageSchool(roleModuleId,'approved-teachers'); 
							getApprovedTeacherList(roleModuleId, USER_ID, SCHOOL_ID, '0', '0,1', 0) ;
						}, 1000);
					}else if(controllType=='REFRESH_TOKEN'){
					}else{
						setTimeout(function(){ 
							//callDashboardPageSchool(roleModuleId,'approved-teachers'); 
							getApprovedTeacherList(roleModuleId, USER_ID, SCHOOL_ID, '0', '0,1', 0) ;
						}, 1000);
						
					}
				}
			}
			return false;
		}
	});
}

function activateInactiveBookaClassForPtmAndCustom(formId,moduleId,controllType,teacherId, roleModuleId, showOption) {
	hideMessageTheme2('');
	var data = {};
	data['schoolId'] = SCHOOL_ID;
	data['moduleId'] = moduleId;
	data['roleModuleId'] = roleModuleId;
	data['userId'] = USER_ID;
	data['teacherId'] = teacherId;
	data['showOption']=showOption;
	data['controllType']=controllType
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLFor('dashboard','active-inactive-teacher-book-class-options'),
		data : JSON.stringify(data),
		dataType : 'json',
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessageTheme2(0, data['message']);
			} else {
				showMessageTheme2(1, data['message']);
				setTimeout(function(){ 
					//callDashboardPageSchool(roleModuleId,'approved-teachers'); 
					getApprovedTeacherList(roleModuleId, USER_ID, SCHOOL_ID, '0', '0,1', 0) ;
				}, 1000);	
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
	
	authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = moduleId;
	authentication['userId'] = USER_ID;
	request['authentication'] = authentication;
	request['teacherRequestDTO'] = teacherRequestDTO;
	return request;
}

function callTeacherOfficialEmailModal(teacherId, userId, officialEmailId,gotoMeetingIdT,gotoMeetingPasswordT, zoomPassword,teamStatus){
	
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

function callTeacherAddBufferAvailaibilitylModal(teacherId, userId,bufferHoursToAddAvailability){
	$('#teacherAddBufferAvailaibilityModel').modal('show');
	$('#teacherAddBufferAvailabilityForm #teacherId').val(teacherId);
	$('#teacherAddBufferAvailabilityForm #userId').val(userId);
	$('#teacherAddBufferAvailabilityForm #bufferHours').val(bufferHoursToAddAvailability);
}