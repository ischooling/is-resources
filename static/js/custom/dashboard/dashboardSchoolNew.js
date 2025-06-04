$(document).ready(function() {
	console.log("insideSchoolNew");
});

function callDashboardPageSchoolB2B(pageNo, replaceDiv){
	customLoader(true);
	if(pageNo=='1'){
		callForDashboardData('formIdIfAny','school-admin-content');
	}else if(pageNo=='1a'){
		callForDashboardData('formIdIfAny','prospective-form-content?startEndDate=');
	}else if(pageNo=='1b'){
		callForDashboardData('formIdIfAny','evalution-form-content?userId=');
	}else if(pageNo=='2a'){
		callForDashboardData('formIdIfAny','professional-development-content');
	}else if(pageNo=='2b'){
		callForDashboardData('formIdIfAny','prospective-report-content');
	}else if(pageNo=='2c'){
		callForDashboardData('formIdIfAny','partnership-fee-content');
	}else if(pageNo=='2d'){
		callForDashboardData('formIdIfAny','partnership-certificate-content');
		
	}else if(pageNo=='3a'){
		callForDashboardData('formIdIfAny','student-list-content?controlType=1&schoolId=');
//	}
//	else if(pageNo=='3b'){
//		callForDashboardData('formIdIfAny','add-student-content?studentId=&schoolId=');
//	}
//	else if(pageNo=='3c'){
//		callForDashboardData('formIdIfAny','student-list-content?controlType=2&schoolId=1&moduleId=92');
	}else if(pageNo=='3d'){
		callForDashboardData('formIdIfAny','student-list-content?controlType=3&schoolId=1&moduleId=92');
	}else if(pageNo=='3e'){
		callForDashboardData('formIdIfAny','student-list-content?controlType=4&schoolId=1&moduleId=92');
	}else if(pageNo=='3f'){
		callForDashboardData('formIdIfAny','student-list-content?controlType=5&schoolId=1&moduleId=92');
	}else if(pageNo=='4a'){
		callForDashboardData('formIdIfAny','student-list-content?controlType=1&schoolId=1&moduleId=92');
	}else if(pageNo=='4b'){
		callForDashboardData('formIdIfAny','student-list-content?controlType=1&schoolId=1&moduleId=92');
	}else if(pageNo=='4c'){
		callForDashboardData('formIdIfAny','student-list-content?controlType=1&schoolId=1&moduleId=92');
	}else if(pageNo=='5'){
		callForDashboardData('formIdIfAny','search-subject-content');
	}else if(pageNo=='5c'){
		callForDashboardData('formIdIfAny','search-pre-subject-content');
	}else if(pageNo=='markgrade'){
		callForDashboardData('formIdIfAny','grade-list-content');
	}else if(pageNo=='6'){
		callForDashboardData('formIdIfAny','annual-dues-content');
	}else if(pageNo=='7'){
		callForDashboardData('formIdIfAny','paid-fee-content');
	}else if(pageNo=='8'){
		callForDashboardData('formIdIfAny','inquiry-content');
	}
}

function callSchoolInneractionNew(actionType, arg0,replaceDiv){
	customLoader(true);
	if(actionType=='1a'){
		callForDashboardData('formIdIfAny','prospective-form-content?startEndDate='+arg0,replaceDiv);	
	}else if(actionType=='1b'){
		callForDashboardData('formIdIfAny','evalution-form-content?userId='+arg0,replaceDiv);	
	}else if(actionType=='3a'){
		callForDashboardData('formIdIfAny','search-student-list-content'+arg0,replaceDiv);	
	}else if(actionType=='3ProfileView'){
		callForDashboardData('formIdIfAny','getStudentB2BProfile-content'+arg0,replaceDiv);	
	}else if(actionType=='3EditView'){
		callForDashboardData('formIdIfAny','add-student-content'+arg0,replaceDiv);	
	}else if(actionType=='3b'){
		callForDashboardData('formIdIfAny','searchFor-student-fee-list-content'+arg0,replaceDiv);	
	}else if(actionType=='3b1'){
		callForDashboardData('formIdIfAny','get-student-bucket-details',replaceDiv);	
	}else if(actionType=='3c'){
		callForDashboardData('formIdIfAny','searchFor-student-marks-list-content'+arg0,replaceDiv);	
	}else if(actionType=='3d'){
		callForDashboardData('formIdIfAny','add-student-marks-content?studentId='+arg0,replaceDiv);	
	}else if(actionType=='3d1'){
		callForDashboardData('formIdIfAny','get-previous-subjects-content'+arg0,replaceDiv);	
	}else if(actionType=='3e'){
		callForDashboardData('formIdIfAny','searchFor-student-transcript-content'+arg0,replaceDiv);	
	}else if(actionType=='3f'){
		callForDashboardData('formIdIfAny','searchFor-student-diploma-content'+arg0,replaceDiv);	
	}else if(actionType=='3g'){
		callForDashboardData('formIdIfAny','student-show-diploma?studentId='+arg0,replaceDiv);	
	}else if(actionType=='5a'){
		callForDashboardData('formIdIfAny','subject-list-content'+arg0,replaceDiv);	
	}else if(actionType=='5d'){
		callForDashboardData('formIdIfAny','pre-subject-list-content'+arg0,replaceDiv);	
	}else if(actionType=='5e'){
		callForDashboardData('formIdIfAny','pre-edit-subject-content'+arg0,replaceDiv);	
	}else if(actionType=='7a'){
		callForDashboardData('formIdIfAny','show-receipt?userPaymentDetailsId='+arg0,replaceDiv);	
	}
}

function submitProspective(formId,moduleId) {
	hideMessage('');
	if(!validateRequestForSubmitProspective(formId,moduleId)){
		return false;
	}
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLFor('school','prospective-form-submit'),
		data : JSON.stringify(getRequestForSubmitProspective(formId, moduleId)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				showMessage(false, data['message']);
				location.reload();
			}
			return false;
		},
		error : function(e) {
			//showMessage(true, e.responseText);
			return false;
		}
	});
}
function addlmsContent(controlType,studentId,roleModuleId,lmsId) {
	hideMessage('');
	console.log(controlType);
	if(lmsId==undefined){
		lmsId=0;
	}
	var data={};
	data['studentId']=studentId;
	data['controlType']=controlType;
	data['lmsId']=lmsId;
	data['userId']=USER_ID;
	$.ajax({
		type : "POST",
		contentType : 'application/json',
		url : getURLForHTML('dashboard','add-lms-Content'),
		data : JSON.stringify(data),
		dataType : 'html',
		success : function(htmlContent) {
			if(htmlContent!=""){
	        	var stringMessage = [];
	        	stringMessage = htmlContent.split("|");
	    		console.log('stringMessage: '+stringMessage);
	        	if(stringMessage[0] == "FAILED" || stringMessage[0] == "EXCEPTION" || stringMessage[0] == "SESSIONOUT" ){
	        		showMessage(true, stringMessage[1]);
	    		}else{
	    			showMessage(true, stringMessage[1]);
	    			if(controlType=="email"){
	    				setTimeout(function(){
	    					callDashboardPageSchool(roleModuleId,'manage-lms-user');
	    				}, 1000);
	    			}else if(controlType=="emailUser"){
	    				setTimeout(function(){ $('#studentViewLmsEntryModel').modal('hide'); }, 1000)
	    			}
	    		}
				return false;
			}
		}
	});
}
function getRequestForSubmitProspective(formId,moduleId){
	var request = {};
	var authentication = {};
	var requestData = {};
	var enabledDateDTO = {};
	enabledDateDTO['bookedBy'] = $("#"+formId+" #userId").val();
	
	$("#"+formId+" .chkDate").each(function(){
		if($(this).find('input[name=chkEnableDate]').is(':checked')){
			var strDateWithId = $(this).find('input[name=chkEnableDate]').val().split(",");
			enabledDateDTO['slotId'] = strDateWithId[1];
			var strDate = strDateWithId[0].split("-");
			enabledDateDTO['bookedDate'] = strDate[2]+"-"+strDate[1]+"-"+strDate[0];
			$(this).find('input[name=chkEnableDate]').attr('checked', 'checked');
		}
		$(this).find('input[name=chkEnableDate]').attr('disabled', 'disabled');
	});
	
	requestData['enabledDateDTO'] = enabledDateDTO;
	authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = moduleId;
	authentication['userId'] = $("#"+formId+" #userId").val();
	request['authentication'] = authentication;
	request['requestData'] = requestData;
	return request;
}

function validateRequestForSubmitProspective(formId,moduleId){
	return true;
}
function validateKeyMembers(formId,moduleId,key) {
	var result=false;
	if(key==1){
		
		if (!validateFormAscii('keyMember')) {
			showMessage(false, 'Please use the English Keyboard while providing information');
			return false
		}
		
		$("#keyMember tbody tr").each(function() {
			var keyMembers={};
			if($(this).find("input.name").val()!='' || $(this).find("input.designation").val()!=''
				|| $(this).find("input.address").val()!=''|| $(this).find("input.contactNo").val()!=''
					|| $(this).find("input.emailId").val()!=''){
				result=false;
				if($(this).find("input.name").val()==''){
					showMessage(true, 'Name is required');
					return false;
				}else if($(this).find("input.designation").val()==''){
					showMessage(true, 'Designation is required');
					return false;
				}
//				else if($(this).find("input.address").val()==''){
//					showMessage(true, 'Address is required');
//					return false;
//				}else if($(this).find("input.contactNo").val()==''){
//					showMessage(true, 'Contact No is required');
//					return false;
//				}else if($(this).find("input.emailId").val()==''){
//					showMessage(true, 'Email is required');
//					return false;
//				}else if($(this).find("input.emailId").val()!=''){
//					var email=$(this).find("input.emailId").val();
//					var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
//					if(!regex.test(email)){
//						showMessage(true, 'Email is not valid');
//						return false;
//					}
//				}
			}else{
				result=true;
			}
			result=true;
		});
		if(result){
			$('#addKeyMembers').modal('hide');
		}
	}else if(key==2){
		
		if (!validateFormAscii('keyMember2')) {
			showMessage(false, 'Please use the English Keyboard while providing information');
			return false
		}
		
		$("#keyMember2 tbody tr").each(function() {
			var keyMembers={};
			if($(this).find("input.name").val()!='' || $(this).find("input.designation").val()!=''
				|| $(this).find("input.address").val()!=''|| $(this).find("input.contactNo").val()!=''
					|| $(this).find("input.emailId").val()!=''){
				result=false;
				if($(this).find("input.name").val()==''){
					showMessage(true, 'Name is required');
					return false;
				}else if($(this).find("input.designation").val()==''){
					showMessage(true, 'Designation is required');
					return false;
				}
//				else if($(this).find("input.address").val()==''){
//					showMessage(true, 'Address is required');
//					return false;
//				}else if($(this).find("input.contactNo").val()==''){
//					showMessage(true, 'Contact No is required');
//					return false;
//				}else if($(this).find("input.emailId").val()==''){
//					showMessage(true, 'Email is required');
//					return false;
//				}else if($(this).find("input.emailId").val()!=''){
//					var email=$(this).find("input.emailId").val();
//					var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
//					if(!regex.test(email)){
//						showMessage(true, 'Email is not valid');
//						return false;
//					}
//				}
			}else{
				result=true;
			}
			result=true;
		});
		if(result){
			$('#addAcadmicStaff').modal('hide');
		}
	}else if(key==3){
		
		if (!validateFormAscii('keyMember3')) {
			showMessage(false, 'Please use the English Keyboard while providing information');
			return false
		}
		
		$("#keyMember3 tbody tr").each(function() {
			var keyMembers={};
			if($(this).find("input.name").val()!='' || $(this).find("input.designation").val()!=''
				|| $(this).find("input.address").val()!=''|| $(this).find("input.contactNo").val()!=''
					|| $(this).find("input.emailId").val()!=''){
				result=false;
				if($(this).find("input.name").val()==''){
					showMessage(true, 'Name is required');
					return false;
				}else if($(this).find("input.designation").val()==''){
					showMessage(true, 'Designation is required');
					return false;
				}
//				else if($(this).find("input.address").val()==''){
//					showMessage(true, 'Address is required');
//					return false;
//				}else if($(this).find("input.contactNo").val()==''){
//					showMessage(true, 'Contact No is required');
//					return false;
//				}else if($(this).find("input.emailId").val()==''){
//					showMessage(true, 'Email is required');
//					return false;
//				}else if($(this).find("input.emailId").val()!=''){
//					var email=$(this).find("input.emailId").val();
//					var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
//					if(!regex.test(email)){
//						showMessage(true, 'Email is not valid');
//						return false;
//					}
//				}
			}else{
				result=true;
			}
			result=true;
		});
		if(result){
			$('#addNonAcadmicStaff').modal('hide');
		}
	}else if(key==4){
		if (!validateFormAscii('keyMember4')) {
			showMessage(false, 'Please use the English Keyboard while providing information');
			return false
		}
		
		$("#keyMember4 tbody tr").each(function() {
			var keyMembers={};
			if($(this).find("input.name").val()!='' || $(this).find("input.designation").val()!=''
				|| $(this).find("input.address").val()!=''|| $(this).find("input.contactNo").val()!=''
					|| $(this).find("input.emailId").val()!=''){
				result=false;
				if($(this).find("input.name").val()==''){
					showMessage(true, 'Name is required');
					return false;
				}else if($(this).find("input.designation").val()==''){
					showMessage(true, 'Designation is required');
					return false;
				}
//				else if($(this).find("input.address").val()==''){
//					showMessage(true, 'Address is required');
//					return false;
//				}else if($(this).find("input.contactNo").val()==''){
//					showMessage(true, 'Contact No is required');
//					return false;
//				}else if($(this).find("input.emailId").val()==''){
//					showMessage(true, 'Email is required');
//					return false;
//				}else if($(this).find("input.emailId").val()!=''){
//					var email=$(this).find("input.emailId").val();
//					var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
//					if(!regex.test(email)){
//						showMessage(true, 'Email is not valid');
//						return false;
//					}
//				}
			}else{
				result=true;
			}
			result=true;
		});
		if(result){
			$('#addITSupportStaff').modal('hide');
		}
	}else if(key==5){
		
		if (!validateFormAscii('keyMember5')) {
			showMessage(false, 'Please use the English Keyboard while providing information');
			return false
		}
		
		$("#keyMember5 tbody tr").each(function() {
			var keyMembers={};
			if($(this).find("input.name").val()!='' || $(this).find("input.designation").val()!=''
				|| $(this).find("input.address").val()!=''|| $(this).find("input.contactNo").val()!=''
					|| $(this).find("input.emailId").val()!=''){
				result=false;
				if($(this).find("input.name").val()==''){
					showMessage(true, 'Name is required');
					return false;
				}else if($(this).find("input.designation").val()==''){
					showMessage(true, 'Designation is required');
					return false;
				}
//				else if($(this).find("input.address").val()==''){
//					showMessage(true, 'Address is required');
//					return false;
//				}else if($(this).find("input.contactNo").val()==''){
//					showMessage(true, 'Contact No is required');
//					return false;
//				}else if($(this).find("input.emailId").val()==''){
//					showMessage(true, 'Email is required');
//					return false;
//				}else if($(this).find("input.emailId").val()!=''){
//					var email=$(this).find("input.emailId").val();
//					var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
//					if(!regex.test(email)){
//						showMessage(true, 'Email is not valid');
//						return false;
//					}
//				}
			}else{
				result=true;
			}
			result=true;
		});
		if(result){
			$('#addPersonStaff').modal('hide');
		}
	}
	return result;
}
function submitEvaluationForm(formId,moduleId,finalSubmit,evalStage) {
	hideMessage('');
	if(!validateRequestForSubmitEvaluationForm(formId,moduleId,evalStage)){
		callCurrentStep(evalStage);
		return false;
	}
	callCurrentStep(evalStage+1);
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLFor('school','evaluation-form-submit'),
		data : JSON.stringify(getRequestForSubmitEvaluationForm(formId, moduleId,finalSubmit,evalStage)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				showMessage(true, data['message']);
				if(finalSubmit){
					location.reload();
				}else{
					if(evalStage==1){
						$('#evaluationFormId').trigger('click');
					}
					if(evalStage==5){
						if($('#dashboardFor').val()=='SCHOOL_ADMIN'){
							callDashboardPageSchoolB2B('6h');
						}else{
							callDashboardPageSchoolB2B('1b');
						}
					}
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
function getRequestForSubmitEvaluationForm(formId,moduleId,finalSubmit,evalStage){
	console.log('getRequestForSubmitEvaluationForm aya');
	var request = {};
	var authentication = {};
	var requestData = {};
	var schoolEvaluationDTO = {};
	var schoolEvaluation={};
	var keyMembersDTO=[];
	var keyMembersDTO2=[];
	var keyMembersDTO3=[];
	var keyMembersDTO4=[];
	var keyMembersDTO5=[];
	//schoolEvaluationDTO['schoolEvaluation']=$('#evaluationForm').serialize();
	if(evalStage==4){
		console.log('getRequestForSubmitEvaluationForm key Member start');
		$("#keyMember tbody tr").each(function() {
			var keyMembers={};
			keyMembers['id']=$(this).find("input.id").val();
			keyMembers['staffId']=1;
			keyMembers['name']=$(this).find("input.name").val();
			keyMembers['designation']=$(this).find("input.designation").val();
			keyMembers['address']=$(this).find("input.address").val();
			keyMembers['contactNo']=$(this).find("input.contactNo").val();
			keyMembers['emailId']=$(this).find("input.emailId").val();
			keyMembersDTO.push(keyMembers);
		});
		$("#keyMember2 tbody tr").each(function() {
			var keyMembers={};
			keyMembers['id']=$(this).find("input.id").val();
			keyMembers['staffId']=2;
			keyMembers['name']=$(this).find("input.name").val();
			keyMembers['designation']=$(this).find("input.designation").val();
			keyMembers['address']=$(this).find("input.address").val();
			keyMembers['contactNo']=$(this).find("input.contactNo").val();
			keyMembers['emailId']=$(this).find("input.emailId").val();
			keyMembersDTO2.push(keyMembers);
		});
		$("#keyMember3 tbody tr").each(function() {
			var keyMembers={};
			keyMembers['id']=$(this).find("input.id").val();
			keyMembers['staffId']=3;
			keyMembers['name']=$(this).find("input.name").val();
			keyMembers['designation']=$(this).find("input.designation").val();
			keyMembers['address']=$(this).find("input.address").val();
			keyMembers['contactNo']=$(this).find("input.contactNo").val();
			keyMembers['emailId']=$(this).find("input.emailId").val();
			keyMembersDTO3.push(keyMembers);
		});
		$("#keyMember4 tbody tr").each(function() {
			var keyMembers={};
			keyMembers['id']=$(this).find("input.id").val();
			keyMembers['staffId']=4;
			keyMembers['name']=$(this).find("input.name").val();
			keyMembers['designation']=$(this).find("input.designation").val();
			keyMembers['address']=$(this).find("input.address").val();
			keyMembers['contactNo']=$(this).find("input.contactNo").val();
			keyMembers['emailId']=$(this).find("input.emailId").val();
			keyMembersDTO4.push(keyMembers);
		});
		$("#keyMember5 tbody tr").each(function() {
			var keyMembers={};
			keyMembers['id']=$(this).find("input.id").val();
			keyMembers['staffId']=5;
			keyMembers['name']=$(this).find("input.name").val();
			keyMembers['designation']=$(this).find("input.designation").val();
			keyMembers['address']=$(this).find("input.address").val();
			keyMembers['contactNo']=$(this).find("input.contactNo").val();
			keyMembers['emailId']=$(this).find("input.emailId").val();
			keyMembersDTO5.push(keyMembers);
		});
		schoolEvaluationDTO['keyMembers']=keyMembersDTO;
		schoolEvaluationDTO['keyMembers2']=keyMembersDTO2;
		schoolEvaluationDTO['keyMembers3']=keyMembersDTO3;
		schoolEvaluationDTO['keyMembers4']=keyMembersDTO4;
		schoolEvaluationDTO['keyMembers5']=keyMembersDTO5;
		console.log("keyMemebers: "+keyMembersDTO);
	}
//	var values ='';
//	$('.disabled').each(function(){
//		values+='&'+this.name+'='+this.value;
//	});
	//console.log('values: '+values);
	var schoolEvaluationInfoDTO={};
	schoolEvaluationInfoDTO['id']=$("#id").val();
	schoolEvaluationInfoDTO['evaluationStage']=evalStage
	if(evalStage==1){
		schoolEvaluationInfoDTO['nameParentOrg']=$("#nameParentOrg").val();
		schoolEvaluationInfoDTO['registrationDate']=$("#registrationDate").val();
		schoolEvaluationInfoDTO['learningCountry']=$("#lCountry").val()
		schoolEvaluationInfoDTO['learningState']=$("#lState").val()
		schoolEvaluationInfoDTO['learningCity']=$("#lCity").val()
		schoolEvaluationInfoDTO['learningPostalCode']=$("#lPostalCode").val()
		schoolEvaluationInfoDTO['learningAddress']=$("#lAddress").val()
		if($('#sameAddress').is(':checked')){
			schoolEvaluationInfoDTO['sameAddress']='Y';
		}else{
			schoolEvaluationInfoDTO['sameAddress']='N';
		}
		schoolEvaluationInfoDTO['mailingCountry']=$("#mCountry").val()
		schoolEvaluationInfoDTO['mailingState']=$("#mState").val()
		schoolEvaluationInfoDTO['mailingCity']=$("#mCity").val()
		schoolEvaluationInfoDTO['mailingPostalCode']=$("#mPostalCode").val()
		schoolEvaluationInfoDTO['mailingAddress']=$("#mAddress").val()
		schoolEvaluationInfoDTO['taxId']=$("#taxId").val()
		
	}else if(evalStage==2){
		schoolEvaluationInfoDTO['nocNo']=$("#nocNo").val();
		schoolEvaluationInfoDTO['nocIssueDate']=$("#nocDate").val();
		schoolEvaluationInfoDTO['learningCenterReco']=$("#learningCenterReco").val();
		schoolEvaluationInfoDTO['affiliationNo']=$("#affiliationNo").val()
		schoolEvaluationInfoDTO['affiliationSince']=$("#affiliationSince").val()
		schoolEvaluationInfoDTO['affiliationExtention']=$("#affiliationExtention").val()
		schoolEvaluationInfoDTO['academicSession']=$("#academicSession").val()

		schoolEvaluationInfoDTO['girlNo']=$("#girlNo").val()
		schoolEvaluationInfoDTO['boyNo']=$("#boyNo").val()
		schoolEvaluationInfoDTO['ageRange']=$("#ageRange").val()
		schoolEvaluationInfoDTO['totalStaff']=$("#totalStaff").val()
		schoolEvaluationInfoDTO['academicStaff']=$("#academicStaff").val()
		schoolEvaluationInfoDTO['nonAcademicStaff']=$("#nonAcademicStaff").val()
		schoolEvaluationInfoDTO['itStaff']=$("#itStaff").val()
		
	}else if(evalStage==3){
		schoolEvaluationInfoDTO['areaInacr']=$("#areaInacr").val();
		schoolEvaluationInfoDTO['areaSqr']=$("#areaSqr").val();
		schoolEvaluationInfoDTO['builtUpArea']=$("#builtUpArea").val();
		
		schoolEvaluationInfoDTO['librarySizeSqr']=$("#librarySizeSqr").val()
		schoolEvaluationInfoDTO['libraryTitleNo']=$("#libraryTitleNo").val()
		schoolEvaluationInfoDTO['libraryPeriodic']=$("#libraryPeriodic").val()
		schoolEvaluationInfoDTO['libraryDailies']=$("#libraryDailies").val()
		schoolEvaluationInfoDTO['libraryRefrenceBook']=$("#libraryRefrenceBook").val()
		
		schoolEvaluationInfoDTO['libraryMagazine']=$("#libraryMagazine").val()
		schoolEvaluationInfoDTO['libraryOthers']=$("#libraryOthers").val()
		
		schoolEvaluationInfoDTO['labSizeroom']=$("#labSizeroom").val()
		schoolEvaluationInfoDTO['labNoComputer']=$("#labNoComputer").val()
		schoolEvaluationInfoDTO['labOther']=$("#labOther").val()
		
		schoolEvaluationInfoDTO['labOtherScience']=$("#labOtherScience").val()
		schoolEvaluationInfoDTO['labOtherLanguage']=$("#labOtherLanguage").val()
		schoolEvaluationInfoDTO['labOtherMath']=$("#labOtherMath").val()
		
		schoolEvaluationInfoDTO['listOfWifi']=$("#listOfWifi").val()
		schoolEvaluationInfoDTO['listOfLaptop']=$("#listOfLaptop").val()
		schoolEvaluationInfoDTO['listOfTablet']=$("#listOfTablet").val()
		schoolEvaluationInfoDTO['listOfWhiteBoard']=$("#listOfWhiteBoard").val()
		schoolEvaluationInfoDTO['listOfIntractiveBoard']=$("#listOfIntractiveBoard").val()
		schoolEvaluationInfoDTO['listOfLcd']=$("#listOfLcd").val()
		schoolEvaluationInfoDTO['listOfLazerPrinter']=$("#listOfLazerPrinter").val()
		schoolEvaluationInfoDTO['listOfMountLcd']=$("#listOfMountLcd").val()
		schoolEvaluationInfoDTO['listOfProjectorScreen']=$("#listOfProjectorScreen").val()
		schoolEvaluationInfoDTO['listOfAudio']=$("#listOfAudio").val()
		schoolEvaluationInfoDTO['listOfMicrophone']=$("#listOfMicrophone").val()
		schoolEvaluationInfoDTO['otherTechnologi']=$("#otherTechnologi").val()
		schoolEvaluationInfoDTO['wheelchairWorkstation']=$("#wheelchairWorkstation").val()
		schoolEvaluationInfoDTO['wheelchairMarkerBond']=$("#wheelchairMarkerBond").val()
	}else if(evalStage==5){
		schoolEvaluationInfoDTO['statutoryRequire']=$("#statutoryRequire").val();
		schoolEvaluationInfoDTO['evaluationPlan']=$("#evaluationPlan").val();
		schoolEvaluationInfoDTO['evaluationDrill']=$("#evaluationDrill").val();
		
		schoolEvaluationInfoDTO['evaluationDocHealth']=$("#evaluationDocHealth").val()
		schoolEvaluationInfoDTO['learningExp']=$("#learningExp").val()
		
		schoolEvaluationInfoDTO['studentValuable']=$("#studentValuable").val()
		schoolEvaluationInfoDTO['schoolTechnology']=$("#schoolTechnology").val()
		schoolEvaluationInfoDTO['schoolActivity']=$("#schoolActivity").val()
		
		schoolEvaluationInfoDTO['schoolAbledStudent']=$("#schoolAbledStudent").val()
		schoolEvaluationInfoDTO['teacherRegular']=$("#teacherRegular").val()
	}
//	if(evalStage!='' && evalStage!=undefined){
//		var serializedString=$('#evaluationForm').serialize()+'&id='+$('#schoolEvaluationId').val()+'&evaluationStage='+evalStage+values;
//		console.log('serializedString: '+serializedString);
//	}else{
//		var serializedString=$('#evaluationForm').serialize()+'&id='+$('#schoolEvaluationId').val()+values;
//	}
//	
//	serializedString = serializedString.replace(/\+/g, '%20');
//	var formFieldArray = serializedString.split("&");
//	var requestObj = {};
//	$.each(formFieldArray, function(i, pair) {
//		var nameValue = pair.split("=");
//		if(nameValue[1]!=''){
//			var name = decodeURIComponent(nameValue[0]);
//			var value = decodeURIComponent(nameValue[1]);
//			requestObj[name] = value;
//		}
//	});
	schoolEvaluationDTO['schoolEvaluationInfoDTO']=schoolEvaluationInfoDTO;
	console.log('schoolEvaluationDTO: '+schoolEvaluationDTO);
	if(finalSubmit){
		schoolEvaluationDTO['finalSubmit']=1;
	}
	requestData['schoolEvaluationDTO'] = schoolEvaluationDTO;
	authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = moduleId;
	authentication['userId'] = $("#"+formId+" #userId").val();
	request['authentication'] = authentication;
	request['requestData'] = requestData;
	return request;
}
function validateRequestForSubmitEvaluationForm(formId,moduleId,evalStage){
	
	if (!validateFormAscii(formId)) {
		showMessage(false, 'Please use the English Keyboard while providing information');
		return false
	}
		
	if(evalStage==1){
		if ($("#"+formId+" #lCountry").val()=='0' ||  $("#"+formId+" #lCountry").val()==null) {
			showMessage(false, 'Learning center country is required');
			return false
		}
		if ($("#"+formId+" #lState").val()=='0' ||  $("#"+formId+" #lState").val()==null) {
			showMessage(false, 'Learning center state is required');
			return false
		}
		if ($("#"+formId+" #lCity").val()=='0' ||  $("#"+formId+" #lCity").val()==null) {
			showMessage(false, 'Learning center city is required');
			return false
		}
		if ($("#"+formId+" #lPostalCode").val()=='' ||  $("#"+formId+" #lPostalCode").val()==null) {
			showMessage(false, 'Learning center postal code is required');
			return false
		}
		
		var taxId= $("#"+formId+" #taxId").val();
		if(taxId && taxId.trim()!="")
		 {
		if(taxId.length<9){
			showMessage(false, 'Tax Payer Id should be 9 digit');
			return false
		}
		
		if(!taxId.startsWith("9")){
			showMessage(false, 'Tax Payer Id should start with digit 9');
			return false
		} }
		
		
	}
	if(evalStage==4){
		if(!validateKeyMembers('evaluationForm','school',1)){
			$('#addKeyMembers').modal('show');
			return false;
		}
		if(!validateKeyMembers('evaluationForm','school',2)){
			$('#addAcadmicStaff').modal('show');
			return false;
		}
		if(!validateKeyMembers('evaluationForm','school',3)){
			$('#addNonAcadmicStaff').modal('show');
			return false;
		}
		if(!validateKeyMembers('evaluationForm','school',4)){
			$('#addITSupportStaff').modal('show');
			return false;
		}
		if(!validateKeyMembers('evaluationForm','school',5)){
			$('#addPersonStaff').modal('show');
			return false;
		}
	}
	return true;
}
function callSearchData(controlType,isForAll){
	var studentName='';
	var schoolId='';
	var gradeId=0;
	var paymentStatus='';
	var rollNumber='';
	var forAll='';
	
	if($('#studentName').val()=='' && $('#gradeId').val()=='' && $('#paymentStatus').val()=='' && $('#rollNumber').val()=='' && !$('#forAll').is(':checked')){
		return false;
	}
	$('#studentListDiv').show();
	if($('#studentName').val()!=undefined && $('#studentName').val()!=''){
		studentName=$('#studentName').val();
	}
	if($('#schoolId').val()!=undefined && $('#schoolId').val()!=''){
		schoolId=$('#schoolId').val();
	}
	if($('#gradeId').val()!=undefined && $('#gradeId').val()!=''){
		gradeId=$('#gradeId option:selected').index();
	}
	if($('#paymentStatus').val()!=undefined && $('#paymentStatus').val()!=''){
		paymentStatus=$('#paymentStatus option:selected').val();
		if(paymentStatus=='Paid'){
			paymentStatus="1"
		}else if(paymentStatus=='Unpaid'){
			paymentStatus="2";
		}else{
			paymentStatus="0";
		}
	}
	if($('#rollNumber').val()!=undefined && $('#rollNumber').val()!=''){
		rollNumber=$('#rollNumber').val();
	}
	if($('#forAll').is(':checked')){
		forAll=true;
	}else{
		forAll=false;
	}
	if(isForAll!='' & isForAll!=undefined){
		forAll=true;
	}
	if(controlType=='student-list'){
		callSchoolInneractionNew('3a',"?studentName="+studentName+"&schoolId="+schoolId+"&gradeId="+gradeId+"&paymentStatus="+paymentStatus+"&rollNumber="+rollNumber+"&forAll="+forAll+"&gradeRuleStatus=0","studentListDiv");
	}else if(controlType=='student-fee'){
		callSchoolInneractionNew('3b',"?studentName="+studentName+"&schoolId="+schoolId+"&gradeId="+gradeId+"&paymentStatus="+paymentStatus+"&rollNumber="+rollNumber+"&forAll="+forAll+"&gradeRuleStatus=0","studentListDiv");
	}else if(controlType=='student-marks'){
		callSchoolInneractionNew('3c',"?studentName="+studentName+"&schoolId="+schoolId+"&gradeId="+gradeId+"&paymentStatus="+paymentStatus+"&rollNumber="+rollNumber+"&forAll="+forAll+"&gradeRuleStatus=1","studentListDiv");
	}else if(controlType=='student-transcript'){
		callSchoolInneractionNew('3e',"?studentName="+studentName+"&schoolId="+schoolId+"&gradeId="+gradeId+"&paymentStatus="+paymentStatus+"&rollNumber="+rollNumber+"&forAll="+forAll+"&gradeRuleStatus=0","studentListDiv");
	}else if(controlType=='student-diploma'){
		callSchoolInneractionNew('3f',"?studentName="+studentName+"&schoolId="+schoolId+"&gradeId="+gradeId+"&paymentStatus="+paymentStatus+"&rollNumber="+rollNumber+"&forAll="+forAll+"&gradeRuleStatus=0","studentListDiv");
	}else if(controlType=='school-student-list'){
		callSchoolInneraction('schoolStudentList',"?studentName="+studentName+"&schoolId="+schoolId+"&gradeId="+gradeId+"&paymentStatus="+paymentStatus+"&rollNumber="+rollNumber+"&forAll="+forAll+"&gradeRuleStatus=0","studentListDiv");
	}else if(controlType=='student-diploma-content'){
		callSchoolInneraction('21a12',"?studentName="+studentName+"&schoolId="+schoolId+"&gradeId="+gradeId+"&paymentStatus="+paymentStatus+"&rollNumber="+rollNumber+"&forAll="+forAll+"&gradeRuleStatus=0","studentListDiv");
	}else if(controlType=='student-transcript-school'){
		callSchoolInneraction('21a13',"?studentName="+studentName+"&schoolId="+schoolId+"&gradeId="+gradeId+"&paymentStatus="+paymentStatus+"&rollNumber="+rollNumber+"&forAll="+forAll+"&gradeRuleStatus=0","studentListDiv");
	}
//	else if(controlType=='school-student-content-list'){
//		callSchoolInneraction('21a14',"?studentName="+studentName+"&schoolId="+schoolId+"&gradeId="+gradeId+"&paymentStatus="+paymentStatus+"&rollNumber="+rollNumber+"&forAll="+forAll,"studentListDiv");
//	}
	
	
}
function callSubjectSearch(gradeId,schoolId){
	console.log('callSubjectSearch '+gradeId);
	
	if(gradeId==undefined || gradeId==''){
		gradeId=$('#standardId').val();
		console.log('gradeId1 '+gradeId);
		if(gradeId==null || gradeId=='' || gradeId==0){
			showMessage(true, 'Please select Grade to proceed.');
			return false;
		}
		console.log('gradeId2 '+gradeId);
	}
	schoolId=$('#schoolId').val();
	
	if(USER_ROLE=='12'){
		callSchoolInneractionNew('5a',"?gradeId="+gradeId,"subjectListDiv");
	}else{
	  callSchoolInneraction('22a',schoolId);
	}
	console.log('gradeId3 :: '+gradeId);
}
function callPreSubjectSearch(gradeId,schoolId){
	/*if($('#standardId option:selected').val()==0){
		showMessage(true, 'Please select Grade to proceed.');
		return false;
	}
	var gradeId=$('#standardId option:selected').index();
	
	
	callSchoolInneractionNew('5d',"?gradeId="+gradeId,"preSubjectListDiv");*/
console.log('callSubjectSearch '+gradeId);
	
	if(gradeId==undefined || gradeId==''){
		gradeId=$('#standardId').val();
		console.log('gradeId1 '+gradeId);
		if(gradeId==null || gradeId=='' || gradeId==0){
			showMessage(true, 'Please select Grade to proceed.');
			return false;
		}
		console.log('gradeId2 '+gradeId);
	}
	schoolId=$('#schoolId').val();
	
	if(USER_ROLE=='12'){
		callSchoolInneractionNew('5d',"?gradeId="+gradeId,"preSubjectListDiv");
	}else{
	  callSchoolInneraction('22b',schoolId);
	}
	console.log('gradeId3 :: '+gradeId);
	
	
}
function saveSubject(formId,moduleId, roleModuleId) {
	hideMessage('');
	if(!validateRequestForAddSubject(formId)){
		return false;
	}
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLFor('school','save-subjects'),
		data : JSON.stringify(getRequestForSaveSubject(formId, moduleId)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				var gradeId = $("#"+formId+" #standardId").val();
				var schoolId = $("#"+formId+" #schoolId").val();
				console.log('gradeId4 :: schoolId '+gradeId +schoolId);
				setTimeout(function(){
					callSubjectSearch(gradeId,schoolId);
					console.log('gradeId5 '+gradeId);
				}, 1000);
				$('#SubjectInfoModal').modal('hide');
				$('#EditSubjectInfoModal').modal('hide');
				$('#callSubjectInfoModal').modal('hide');
				showMessage(true, data['message']);
			}
			return false;
		},
		error : function(e) {
			//showMessage(true, e.responseText);
			return false;
		}
	});
}
function savePreSubject(formId,moduleId) {
	hideMessage('');
	if(!validateRequestForAddPreSubject(formId)){
		return false;
	}
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLFor('school','save-pre-subjects'),
		data : JSON.stringify(getRequestForSavePreSubject(formId, moduleId)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				var gradeId = $("#"+formId+" #standardId").val();
				var schoolId = $("#"+formId+" #schoolId").val();
				console.log('gradeId4 :: schoolId '+gradeId +schoolId);
				setTimeout(function(){
					callPreSubjectSearch(gradeId,schoolId);
					console.log('gradeId5 '+gradeId);
				}, 1000);
				$('#preSubjectInfoModal').modal('hide');
				$('#EditSubjectInfoModal').modal('hide');
				$('#callPreSubjectInfoModal').modal('hide');
				showMessage(true, data['message']);
				//callSubjectSearch();
			}
			return false;
		},
		error : function(e) {
			//showMessage(true, e.responseText);
			return false;
		}
	});
}

function adminSaveSubject(formId,moduleId) {
	hideMessage('');
	if(!validateRequestForAddSubject(formId)){
		return false;
	}
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLFor('school','admin-save-subjects'),
		data : JSON.stringify(getRequestForSaveSubject(formId, moduleId)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				showMessage(true, data['message']);
				//$('#subjectName').val('');
    			//$('#studentMiddleName').val('');
    			//$('#studentLastName').val('');
				$('#SubjectInfoModal').modal('hide');
				$('#callEditSubjectInfoModal').modal('hide');
				$('#callSubjectInfoModal').modal('hide');
				//callSubjectSearch();
				
			}
			return false;
		},
		error : function(e) {
			//showMessage(true, e.responseText);
			return false;
		}
	});
}
function adminSavePreSubject(formId,moduleId) {
	hideMessage('');
	if(!validateRequestForAddPreSubject(formId)){
		return false;
	}
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLFor('school','admin-save-subjects'),
		data : JSON.stringify(getRequestForSavePreSubject(formId, moduleId)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				showMessage(true, data['message']);
				//$('#subjectName').val('');
    			//$('#studentMiddleName').val('');
    			//$('#studentLastName').val('');
				$('#SubjectInfoModal').modal('hide');
				$('#callEditSubjectInfoModal').modal('hide');
				$('#callSubjectInfoModal').modal('hide');
				//callSubjectSearch();
				
			}
			return false;
		},
		error : function(e) {
			//showMessage(true, e.responseText);
			return false;
		}
	});
}
function validateRequestForAddSubject(formId){
	if ($("#"+formId+" #standardId").val()=='0' ||  $("#"+formId+" #standardId").val()==null) {
		showMessage(false, 'Please choose grade');
		return false
	}
	if ($("#"+formId+" #subjectName").val()=='' ||  $("#"+formId+" #subjectName").val()==null) {
		showMessage(false, 'Course Name is required ');
		return false
	}
	if ($("#"+formId+" #subjectCode").val()=='' ||  $("#"+formId+" #subjectCode").val()==null) {
		showMessage(false, 'Course code is required ');
		return false
	}
	if ($("#"+formId+" #theoryIsCompulory").val()=='0' ||  $("#"+formId+" #theoryIsCompulory").val()==null) {
		showMessage(false, 'Please choose mandatory course');
		return false
	}
	if ($("#"+formId+" #maxTheoryMarks").val()=='' ||  $("#"+formId+" #maxTheoryMarks").val()==null) {
		showMessage(false, 'Maximum Theory marks is required ');
		return false
	}
	if ($("#"+formId+" #theoryPassingMarks").val()=='' ||  $("#"+formId+" #theoryPassingMarks").val()==null) {
		showMessage(false, 'Theory passing marks is required ');
		return false
	}
	
	if ($("#"+formId+" #practicalIsCompulory").val()=='0' ||  $("#"+formId+" #practicalIsCompulory").val()==null) {
		showMessage(false, 'Practical is required ');
		return false
	}
	
	if ($("#"+formId+" #practicalIsCompulory").val()=='1' &&  $("#"+formId+" #maxPracticalMarks").val()== '') {
		showMessage(false, 'Max Practical Marks  is required');
		return false
	}
	if ($("#"+formId+" #practicalIsCompulory").val()=='1' &&  $("#"+formId+" #practicalPassingMarks").val()== '') {
		showMessage(false, 'Passing Practical Marks is required');
		return false
	}
	if ($("#"+formId+" #maxTheoryMarks").val()!='' && $("#"+formId+" #maxTheoryMarks").val()!=undefined && $("#"+formId+" #theoryPassingMarks").val()!=''  && $("#"+formId+" #theoryPassingMarks").val()!=undefined) {
		
		var maxTheoryMar=parseInt($("#"+formId+" #maxTheoryMarks").val());
		var theoryPassingMar=parseInt($("#"+formId+" #theoryPassingMarks").val());
		if(maxTheoryMar<theoryPassingMar){
			showMessage(false, 'Theory Max marks should be greater than Theory passing marks');
			return false
			
		}
	}
	
	if ($("#"+formId+" #practicalIsCompulory").val()=='1' &&  $("#"+formId+" #maxPracticalMarks").val()!= "") {
			
			var maxPracticalMarks=parseInt($("#maxPracticalMarks").val());
			var practicalPassingMarks=parseInt($("#practicalPassingMarks").val());
			if(maxPracticalMarks<practicalPassingMarks){
				showMessage(false, 'Practical Max marks should be greater than Practical passing marks');
				return false
				
			}
		}
		if ($("#"+formId+" #maxTheoryMarks").val()!='' && $("#"+formId+" #maxPracticalMarks").val()!='' ) {
				
				var maxTheoryMarks=parseInt($("#"+formId+" #maxTheoryMarks").val());
				var maxPracticalMark=parseInt($("#maxPracticalMarks").val());
				if(maxTheoryMarks<maxPracticalMark){
					showMessage(false, 'Practical Max marks should be less than Theory Max marks');
					return false
					
				}
			}
	return true;
}

function validateRequestForAddPreSubject(formId){
	if ($("#"+formId+" #standardId").val()=='0' ||  $("#"+formId+" #standardId").val()==null) {
		showMessage(false, 'Please choose grade');
		return false
	}
	if ($("#"+formId+" #subjectName").val()=='' ||  $("#"+formId+" #subjectName").val()==null) {
		showMessage(false, 'Course Name is required ');
		return false
	}
	if ($("#"+formId+" #subjectCode").val()=='' ||  $("#"+formId+" #subjectCode").val()==null) {
		showMessage(false, 'Course code is required ');
		return false
	}
	if ($("#"+formId+" #theoryIsCompulory").val()=='0' ||  $("#"+formId+" #theoryIsCompulory").val()==null) {
		showMessage(false, 'Please choose mandatory course');
		return false
	}
	if ($("#"+formId+" #maxTheoryMarks").val()=='' ||  $("#"+formId+" #maxTheoryMarks").val()==null) {
		showMessage(false, 'Maximum Theory marks is required ');
		return false
	}
	if ($("#"+formId+" #theoryPassingMarks").val()=='' ||  $("#"+formId+" #theoryPassingMarks").val()==null) {
		showMessage(false, 'Theory passing marks is required ');
		return false
	}
	
	if ($("#"+formId+" #practicalIsCompulory").val()=='0' ||  $("#"+formId+" #practicalIsCompulory").val()==null) {
		showMessage(false, 'Practical is required ');
		return false
	}
	
	if ($("#"+formId+" #practicalIsCompulory").val()=='1' &&  $("#"+formId+" #maxPracticalMarks").val()== '') {
		showMessage(false, 'Max Practical Marks  is required');
		return false
	}
	if ($("#"+formId+" #practicalIsCompulory").val()=='1' &&  $("#"+formId+" #practicalPassingMarks").val()== '') {
		showMessage(false, 'Passing Practical Marks is required');
		return false
	}
	if ($("#"+formId+" #maxTheoryMarks").val()!='' && $("#"+formId+" #maxTheoryMarks").val()!=undefined && $("#"+formId+" #theoryPassingMarks").val()!=''  && $("#"+formId+" #theoryPassingMarks").val()!=undefined) {
		
		var maxTheoryMar=parseInt($("#"+formId+" #maxTheoryMarks").val());
		var theoryPassingMar=parseInt($("#"+formId+" #theoryPassingMarks").val());
		if(maxTheoryMar<theoryPassingMar){
			showMessage(false, 'Theory Max marks should be greater than Theory passing marks');
			return false
			
		}
	}
	
	if ($("#"+formId+" #practicalIsCompulory").val()=='1' &&  $("#"+formId+" #maxPracticalMarks").val()!= "") {
			
			var maxPracticalMarks=parseInt($("#maxPracticalMarks").val());
			var practicalPassingMarks=parseInt($("#practicalPassingMarks").val());
			if(maxPracticalMarks<practicalPassingMarks){
				showMessage(false, 'Practical Max marks should be greater than Pratical passing marks');
				return false
				
			}
		}
		if ($("#"+formId+" #maxTheoryMarks").val()!='' && $("#"+formId+" #maxPracticalMarks").val()!='' ) {
				
				var maxTheoryMarks=parseInt($("#"+formId+" #maxTheoryMarks").val());
				var maxPracticalMark=parseInt($("#maxPracticalMarks").val());
				if(maxTheoryMarks<maxPracticalMark){
					showMessage(false, 'Practical Max marks should be less than Theory Max marks');
					return false
					
				}
			}
	return true;
}	
function saveRM(formId,moduleId) {
	hideMessage('');
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLFor('school','save-RM'),
		data : JSON.stringify(getRequestForSaveRM(formId, moduleId)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				showMessage(true, data['message']);
				/*$('#callSubjectInfoModal').modal('hide');
				$('#callEditSubjectInfoModal').modal('hide');*/
				//callSubjectSearch();
			}
			return false;
		},
		error : function(e) {
			//showMessage(true, e.responseText);
			return false;
		}
	});
}
function getRequestForSaveRM(formId,moduleId){
	var request = {};
	var authentication = {};
	var requestData = {};
	var addRMInfoDTO = {};
	
	addRMInfoDTO['firstName']=$("#fName").val();
	addRMInfoDTO['middleName']=$("#"+formId+" #middleName").val();
	addRMInfoDTO['lastName']=$("#"+formId+" #lastName").val();
	addRMInfoDTO['emailId']=$("#"+formId+" #emailId").val();
	addRMInfoDTO['contactNo']=$("#contactNo").val();
		
	requestData['addRMInfoDTO'] = addRMInfoDTO;
	authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = moduleId;
	authentication['userId'] = $("#"+formId+" #userId").val();
	request['authentication'] = authentication;
	request['requestData'] = requestData;
	return request;
}
function getRequestForSaveSubject(formId,moduleId){
	console.log('getRequestForSaveSubject');
	var request = {};
	var authentication = {};
	var requestData = {};
	var subjectListInfoDTO = {};
	
	subjectListInfoDTO['standardId']=$("#"+formId+" #standardId").val();
	subjectListInfoDTO['schoolId']=$("#schoolId").val();
	subjectListInfoDTO['subjectId']=$("#subjectId").val();
	subjectListInfoDTO['subjectName']=$("#"+formId+" #subjectName").val();
	subjectListInfoDTO['subjectCode']=$("#"+formId+" #subjectCode").val();
	subjectListInfoDTO['maxTheoryMarks']=$("#"+formId+" #maxTheoryMarks").val();
	subjectListInfoDTO['maxPracticalMarks']=$("#"+formId+" #maxPracticalMarks").val();
	subjectListInfoDTO['theoryIsCompulory']=$("#"+formId+" #theoryIsCompulory option:selected").index();
	subjectListInfoDTO['practicalIsCompulory']=$("#"+formId+" #practicalIsCompulory option:selected").index();
	subjectListInfoDTO['practicalPassingMarks']=$("#"+formId+" #practicalPassingMarks").val();
	subjectListInfoDTO['theoryPassingMarks']=$("#"+formId+" #theoryPassingMarks").val();
		
	requestData['subjectListInfoDTO'] = subjectListInfoDTO;
	authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = moduleId;
	authentication['userId'] = $("#"+formId+" #userId").val();
	request['authentication'] = authentication;
	request['requestData'] = requestData;
	return request;
}

function getRequestForSavePreSubject(formId,moduleId){
	console.log('getRequestForSaveSubject');
	var request = {};
	var authentication = {};
	var requestData = {};
	var subjectListInfoDTO = {};
	
	subjectListInfoDTO['standardId']=$("#"+formId+" #standardId").val();
	subjectListInfoDTO['schoolId']=$("#schoolId").val();
	subjectListInfoDTO['subjectId']=$("#subjectId").val();
	subjectListInfoDTO['subjectName']=$("#"+formId+" #subjectName").val();
	subjectListInfoDTO['subjectCode']=$("#"+formId+" #subjectCode").val();
	subjectListInfoDTO['maxTheoryMarks']=$("#"+formId+" #maxTheoryMarks").val();
	subjectListInfoDTO['maxPracticalMarks']=$("#"+formId+" #maxPracticalMarks").val();
	subjectListInfoDTO['theoryIsCompulory']=$("#"+formId+" #theoryIsCompulory option:selected").index();
	subjectListInfoDTO['practicalIsCompulory']=$("#"+formId+" #practicalIsCompulory option:selected").index();
	subjectListInfoDTO['practicalPassingMarks']=$("#"+formId+" #practicalPassingMarks").val();
	subjectListInfoDTO['theoryPassingMarks']=$("#"+formId+" #theoryPassingMarks").val();
		
	requestData['subjectListInfoDTO'] = subjectListInfoDTO;
	authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = moduleId;
	authentication['userId'] = $("#"+formId+" #userId").val();
	request['authentication'] = authentication;
	request['requestData'] = requestData;
	return request;
}

function saveStudentMarks(formId,moduleId) {
	hideMessage('');
	console.log('validateMarks :'+validateMarks('currentSubMarkstbl'));
	if(!validateMarks('currentSubMarkstbl')){
		return false;
	}
//	var flag = calcMarks('currentSubMarkstbl');
//	if(!flag){
//		showMessage(true, "Current Record subjects is not valid.");
//		return false;
//	}
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLFor('school','save-student-marks'),
		data : JSON.stringify(getRequestForSaveStudentMarks(formId, moduleId)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				showMessage(true, data['message']);
				$('#callMarksModal').modal('hide');
				callSearchData('student-marks');
			}
			return false;
		},
		error : function(e) {
			//showMessage(true, e.responseText);
			return false;
		}
	});
}
function getRequestForSaveStudentMarks(formId,moduleId){
	var request = {};
	var authentication = {};
	var requestData = {};
	var marksList=[];
	
	var currentMarksDTO = {};
	currentMarksDTO['studentId']=$('#studentCurrentMarks #studentId').val();
	currentMarksDTO['schoolId']=$('#schoolId').val();
	currentMarksDTO['gradeId']=$('#gradeId').val();//NEED TO CHECK
	
	$("#currentSubMarkstbl tbody tr").each(function() {
		var marksDTO = {};
		if($(this).find("select.sub_id option:selected").val()!=0 && $(this).find("select.sub_id option:selected").val()!=undefined){
			marksDTO['subjectId']=$(this).find("select.sub_id option:selected").val();
			marksDTO['subjectName']=$(this).find("select.sub_id option:selected").text();
			marksDTO['maximumMarks']=$(this).find("input.maximumMarks").val();
			
			marksDTO['maxTheoryMarks']=$(this).find("span.maxTheoryMarks").text();
			marksDTO['theoryPassingMarks']=$(this).find("span.theoryPassingMarks").text();
			marksDTO['maxPracticalMarks']=$(this).find("span.maxPracMarks").text();
			marksDTO['practicalPassingMarks']=$(this).find("span.pracPassigMarks").text();
			
			marksDTO['practicalMarks']=$(this).find("input.e_p_marks").val();
			marksDTO['theoryMarks']=$(this).find("input.e_t_marks").val();
			marksDTO['marksObtained']=$(this).find("span.marks-count").text();
			marksDTO['grades']=$(this).find("span.grade").text();
			marksDTO['credits']=$(this).find("input.credits").val();
			marksDTO['commulativeGPA']=$(this).find("input.commulativeGPA").val();
			marksDTO['currSubResult']=$(this).find("span.result").text();
		}
		marksList.push(marksDTO);
	});
	
	
	var currentMarksListDTO={};
	currentMarksListDTO['marks']=marksList;
	currentMarksDTO['marksList']=JSON.stringify(currentMarksListDTO);
	requestData['currentMarksDTO'] = currentMarksDTO;
	authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = moduleId;
	authentication['userId'] = $("#"+formId+" #userId").val();
	request['authentication'] = authentication;
	request['requestData'] = requestData;
	return request;
}
//function validateCurrentSubjectMarksDetails(){
//	var result=false;
//	var isEmpty=false;
//	$("#currentSubMarkstbl tbody tr").each(function() {
//		if($(this).find("input.e_p_marks").val()!='' || $(this).find("input.e_t_marks").val()!='' || $(this).find("select.sub_id").val()!='0'   
//			|| $(this).find("span.grade").text()!='' || $(this).find("input.credits").val()!='' || $(this).find("input.commulativeGPA").val()!=''){
//			isEmpty=true;
//			result=false;
//			if($(this).find("select.sub_id").val()=='0'){
//				showMessage(true, 'Please select course.');
//				return false;
//			}
//			if($(this).find("input.e_p_marks").val()=='' && $(this).find("select.sub_id option:selected").attr('isPracCompulsory')==1){
//				showMessage(true, 'Practical Marks is required.');
//				return false;
//			}
//			if($(this).find("input.e_t_marks").val()==''){
//				showMessage(true, 'Theory Marks is required.');
//				return false;
//			}
//			if($(this).find("span.grade").text()==''){
//				showMessage(true, 'Grade is required.');
//				return false;
//			}
//			if($(this).find("input.credits").val()==''){
//				showMessage(true, 'Credits is required.');
//				return false;
//			}
//			if($(this).find("input.commulativeGPA").val()==''){
//				showMessage(true, 'cumulativeGrade is required.');
//				return false;
//			}
//			var maxPracMarks=$(this).find("select.sub_id option:selected").attr('maxPracMarks');
//			if(parseInt($(this).find("input.e_p_marks").val())>parseInt(maxPracMarks)){
//				showMessage(true, 'Practical Marks can not be more than Maximum Practical marks');
//				return false;
//			}
//			var maxTheoryMarks=$(this).find("select.sub_id option:selected").attr('maxTheoryMarks');
//			if(parseInt($(this).find("input.e_t_marks").val())>parseInt(maxTheoryMarks)){
//				showMessage(true, 'Theory Marks can not be more than Maximum Theory marks');
//				return false;
//			}
//		}else{
//			result=true;
//		}
//		result=true;
//	});
//	if(!isEmpty){
//		showMessage(true, 'Subject Marks is required.');
//		result=false;
//	}
//	return result;
//}
function validateRequestForAddTravel(formId){
	
	if (!validateFormAscii(formId)) {
		showMessage(false, 'Please use the English Keyboard while providing information');
		return false
	}
	
	if (!validateFormAscii('tbl_save_passenger_details')) {
		showMessage(false, 'Please use the English Keyboard while providing information');
		return false
	}
	if ($("#"+formId+" #source").val()=='' || $("#"+formId+" #source").val()==null) {
		showMessage(false, 'Source is required');
		return false
	}
	if ($("#"+formId+" #destination").val()=='' || $("#"+formId+" #destination").val()==null) {
		showMessage(false, 'Destination is required');
		return false
	}
	if ($("#"+formId+" #dateOfBooking").val()=='' || $("#"+formId+" #dateOfBooking").val()==null) {
		showMessage(false, 'Date of Travel is required');
		return false
	}
	if ($("#"+formId+" #dateOfReturn").val()=='' || $("#"+formId+" #dateOfReturn").val()==null) {
		showMessage(false, 'Date of Return is required');
		return false
	}
	if ($("#"+formId+" #noOfPassenger").val()=='0' || $("#"+formId+" #noOfPassenger").val()==null) {
		showMessage(false, 'No of Passanger is required');
		return false
	}
	if ($("#"+formId+" #hotelName").val()=='' || $("#"+formId+" #hotelName").val()==null) {
		showMessage(false, 'Hotel Name is required');
		return false
	}
	
	if($("#"+formId+" #comments").val()=='' || $("#"+formId+" #comments").val()==null) {
		showMessage(false,'Comments is required');
		return false
	}
	var date1 = $("#dateOfBooking").val();
	var newDate = date1.split('-');
	var dateOfBooking= new Date(newDate[2]+'-'+newDate[0]+'-'+newDate[1]);
	
	var date2 = $("#dateOfReturn").val();
	var newDate1 = date2.split('-');
	var dateOfReturn= new Date(newDate1[2]+'-'+newDate1[0]+'-'+newDate1[1]);
	
	if (dateOfReturn < dateOfBooking){
		showMessage(false, 'Date of Travel should be greater than Date of Return.');
		return false
		}
	return true;
}	

function createRow(keyId) {
	console.log('dd');
	var sno = 5;
	if (keyId == '') {
		GLOBAL_KEY1_ID = GLOBAL_KEY1_ID + 1;
		sno = GLOBAL_KEY1_ID;
	} else if (keyId == 2) {
		GLOBAL_KEY2_ID = GLOBAL_KEY2_ID + 1;
		sno = GLOBAL_KEY2_ID;
	} else if (keyId == 3) {
		GLOBAL_KEY3_ID = GLOBAL_KEY3_ID + 1;
		sno = GLOBAL_KEY3_ID;
	} else if (keyId == 4) {
		GLOBAL_KEY4_ID = GLOBAL_KEY4_ID + 1;
		sno = GLOBAL_KEY4_ID;
	} else if (keyId == 5) {
		GLOBAL_KEY5_ID = GLOBAL_KEY5_ID + 1;
		sno = GLOBAL_KEY5_ID;
	}
	$('#keyMember' + keyId + ' tbody').append('<tr><td>'+ sno+ '</td>'
		+ '<td>'
		+ '<input type="hidden" class="form-control id" name="id" id="id" value="" onkeydown="return M.isChars(event);">'
		+ '<span class="bmd-form-group is-filled"><input type="text" class="form-control name" name="name" id="keyMemberName" value="" onkeydown="return M.isChars(event);" maxlength="50"></span>'
		+ '</td>'
		+ '<td><span class="bmd-form-group is-filled"><input type="text" class="form-control designation" name="designation" id="keyMemberDesig" value="" onkeydown="return M.isChars(event);" maxlength="50"></span></td>'
		+ '<td><span class="bmd-form-group is-filled"><input type="text" class="form-control address" name="address" id="keyMemberAddress" value="" onkeydown="return M.isAddressLine(event);" maxlength="150"></span></td>'
		+ '<td><span class="bmd-form-group is-filled"><input type="text" class="form-control contactNo" name="contactNo" id="keyMemberContact" value="" onkeydown="return M.digit(event);" maxlength="10"></span></td>'
		+ '<td><span class="bmd-form-group is-filled"><input type="text" class="form-control emailId" name="emailId" id="keyMemberEmail" value="" maxlength="50"></span></td>'
		+ '</tr>');
}
	function assignRM(formId){
		hideMessage('');
		if(!validateRequestForAssignRM()){
			return false;
		}
		$.ajax({
			type : "POST",
			url : getURLForHTML('dashboard','assign-rm-details'),
			data : encodeURI("request="+JSON.stringify(getRequestForAssignRMDetails(formId))),
			dataType : 'html',
			cache : false,
			timeout : 600000,
			success : function(htmlContent) {
				if(htmlContent!=""){
	            	var stringMessage = [];
	            	stringMessage = htmlContent.split("|");
	        		console.log('stringMessage: '+stringMessage);
	            	if(stringMessage[0] == "FAILED" || stringMessage[0] == "EXCEPTION" || stringMessage[0] == "SESSIONOUT" ){
	        			//redirectLoginPage();
	            		showMessage(true, stringMessage[1]);
	        		}else{
	        			showMessage(true, stringMessage[1]);
	        			$('#assignRMModal').modal('hide');
	        			//callSchoolInneraction('6f','1')
	        			setTimeout(function(){
	        				callSchoolInneraction('6f',$('#sortById').val());
	    				}, 1000);
	        		}
	    			return false;
				}
			},
			error : function(e) {
				//showMessage(true, e.responseText);
				return false;
			}
		});
		
	
		
		
	}

function callForAddTravelsDetails(formId) {
	hideMessage('');
	if(!validateRequestForAddTravel(formId)){
		return false;
	}
	if(!validatePassengerDetails()){
		return false;
	}
	$.ajax({
		type : "POST",
		url : getURLForHTML('dashboard','save-travels-details'),
		data : encodeURI("request="+JSON.stringify(getRequestForAddTravelDetails(formId))),
		dataType : 'html',
		cache : false,
		timeout : 600000,
		success : function(htmlContent) {
			if(htmlContent!=""){
            	var stringMessage = [];
            	stringMessage = htmlContent.split("|");
        		console.log('stringMessage: '+stringMessage);
            	if(stringMessage[0] == "FAILED" || stringMessage[0] == "EXCEPTION" || stringMessage[0] == "SESSIONOUT" ){
        			//redirectLoginPage();
            		showMessage(true, stringMessage[1]);
        		}else{
        			showMessage(true, stringMessage[1]);
        			$('#travelDataModal').modal('hide');
        			//callSchoolInneraction('6f',$('#sortById').val());
        		}
    			return false;
			}
		},
		error : function(e) {
			//showMessage(true, e.responseText);
			return false;
		}
	});
	
}
function getRequestForAddTravelDetails(formId){
	var request = {};
	var authentication = {};
	var requestData = {};
	var addTravelDetailsDTO = {};

	
//	addTravelDetailsDTO['id'] = $("#studentId").val();
	addTravelDetailsDTO['userId'] = $("#"+formId+" #userId").val();
	addTravelDetailsDTO['source'] = escapeCharacters($("#"+formId+" #source").val());
	addTravelDetailsDTO['destination'] = escapeCharacters($("#"+formId+" #destination").val());
	addTravelDetailsDTO['dateOfbook'] = $("#"+formId+" #dateOfBooking").val();
	addTravelDetailsDTO['dateOfReturn'] = $("#"+formId+" #dateOfReturn").val();
	addTravelDetailsDTO['noOfPassenger'] = $("#"+formId+" #noOfPassenger option:selected").val();
	addTravelDetailsDTO['hotelName'] = escapeCharacters($("#"+formId+" #hotelName").val());
	addTravelDetailsDTO['comments'] = escapeCharacters($("#"+formId+" #comments").val());
	//addTravelDetailsDTO['docsUploads'] = $("#fileupload1").parents(".file-tab").find("span.fileName").text();
	var imageName =$('#fileupload1').parent('span').parent('p').parent('div').find('span.fileName').html();
	if(imageName!='' && imageName!=undefined){
		if ($.inArray($.trim(imageName.split('.').pop().toLowerCase()), ['gif','png','jpg','jpeg','pdf']) == -1){
	
		}else{
			addTravelDetailsDTO['docsUploads'] = imageName;
		}
	}

	var addPassengerDetailsDTO={};
	addPassengerDetailsDTO['addPassengerDetailsDTO'] = savePassengerDetails();
	addTravelDetailsDTO['passengerDetails'] = JSON.stringify(addPassengerDetailsDTO);

	
	requestData['addTravelDetailsDTO'] = addTravelDetailsDTO;
	authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = 'SCHOOL';
	authentication['userId'] = $("#"+formId+" #userId").val();
	request['authentication'] = authentication;
	request['requestData'] = requestData;
	return request;
}
function getRequestForAssignRMDetails(formId){
	var request = {};
	var authentication = {};
	var requestData = {};
	var assignRMDetailsDTO = {};

	
	//assignRMDetailsDTO['id'] = $("#id").val();
	assignRMDetailsDTO['userId'] = $("#userId").val();
	assignRMDetailsDTO['rmId'] = $("#relationshipManagerId").val();
	assignRMDetailsDTO['rmName'] = $("#relationshipManagerId").val();
	assignRMDetailsDTO['contactNo'] = $("#schoolApproval #phoneNo").val();
	assignRMDetailsDTO['email'] = $("#schoolApproval #email").val();
	assignRMDetailsDTO['isdCode'] = $("#schoolApproval #isdCode").val();
	
	requestData['assignRMDetailsDTO'] = assignRMDetailsDTO;
	authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
	//authentication['userType'] = 'SCHOOL';
//	authentication['userId'] = $("#"+formId+" #userId").val();
	request['authentication'] = authentication;
	request['requestData'] = requestData;
	return request;
}

function validateRequestForAssignRM(){
	if ($("#relationshipManagerId").val()=='0' || $("#relationshipManagerId").val()==null) {
		showMessage(false, 'Please chose relationship manager');
		return false
	}
	if ($("#schoolApproval #isdCode").val()=='0' || $("#schoolApproval #isdCode").val()==null) {
		showMessage(false, 'Please chose ISD code');
		return false
	}
	if ($("#schoolApproval #phoneNo").val()=='' || $("#schoolApproval #phoneNo").val()==null) {
		showMessage(false, 'Contact No is required');
		return false
	}
	if ($("#schoolApproval #email").val()=='' || $("#schoolApproval #email").val()==null) {
		//var email=$(this).find("input.emailId").val();
		showMessage(false, 'Email is required');
		return false
	}else{
		var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		if(!regex.test($("#email").val())){
				showMessage(true, 'Email is not valid');
				return false;
		}
	}
	return true;
}	

function savePassengerDetails(){
	//var passengerDTO = [];
	var addPassengerDetailsDTO=[];
	
	$("#tbl_save_passenger_details tbody tr").each(function() {
		var saveDetails={};
		if(escapeCharacters($(this).find("input.name").val())!='' && escapeCharacters($(this).find("input.name").val())!=undefined
				&& escapeCharacters($(this).find("input.name").val())!="undefined"){
			saveDetails['name']=$(this).find("input.name").val();
			saveDetails['gender']=$(this).find("select.gender option:selected").val();
			saveDetails['age']=$(this).find("input.age").val();
			saveDetails['email']=$(this).find("input.email").val();
			saveDetails['isdCode']=$(this).find("select.isdCode option:selected").val();
			saveDetails['phone']=$(this).find("input.phone").val();
			saveDetails['passport']=$(this).find("input.passport").val();
		}
		addPassengerDetailsDTO.push(saveDetails);
	});
	console.log(addPassengerDetailsDTO.length);
	return addPassengerDetailsDTO;
}
function validatePassengerDetails(){
	var status=false;
	var count=0;
	console.log('count: '+count);
	var passports=[];
	var isPassportExist=0;
	$("#tbl_save_passenger_details tbody tr").each(function() {
		if($(this).find("input.name").val()!='' || $(this).find("select.gender").val()!='0' || $(this).find("input.age").val()!=0  
			|| $(this).find("input.email").val()!='' || $(this).find("input.passport").val()!='' || ($(this).find("select.isdCode").val()!='0' && $(this).find("input.phone").val()=='' )){
			status=false;
			if($(this).find("input.name").val()==''){
				showMessage(true, 'Name is required');
				return false;
			}
			if($(this).find("select.gender").val()=='0'){
				showMessage(true, 'Gender is required');
				return false;
			}
			if($(this).find("input.age").val()==0){
				showMessage(true, 'Age is required');
				return false;
			}
			if($(this).find("input.email").val()==''){
				showMessage(true, 'Email is required');
				return false;
			}
			if($(this).find("select.isdCode").val()=='0' && $(this).find("input.phone").val()!='' ){
				showMessage(true, 'ISD code is required');
				return false;
			}
			if($(this).find("select.isdCode").val()!='0' && $(this).find("input.phone").val()=='' ){
				showMessage(true, 'phone no is required');
				return false;
			}
			/*if($(this).find("input.phone").val()=='' ){
				showMessage(true, 'Phone no is required');
				return status;
			}*/
			if($(this).find("input.email").val()!=''){
				var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
				if(!regex.test($(this).find("input.email").val())){
					showMessage(true, 'Email is not valid');
					return false;
				}
			}
			if($(this).find("input.passport").val()==''){
				showMessage(true, 'Passport is required');
				return false;
			}
			
			
			var currentPassport = ($(this).find("input.passport").val()).toUpperCase();
			var p = passports.push(currentPassport);
			
			count=count+1;
			status=true;
			console.log('count: '+count);
		}else{
			if(count==0){
				showMessage(true, 'Passengers Details are required');
				status=false;
				return status;
			}else{
				status=true;
				return status;
			}
		}
		//status=true;
	});
	var recipientsArray = passports.sort(); 
	var countx =0;
	var passportDuplicate = []; 
	var duplicate ="";
	for (var i = 0; i < recipientsArray.length - 1; i++) 
	{
		if (recipientsArray[i + 1] == recipientsArray[i]) 
	{ 
			countx = countx+1;
			//passportDuplicate.push(recipientsArray[i]); 
			duplicate	= duplicate + recipientsArray[i] +', ';
			} 
		}
	if(countx>0){
		showMessage(true, 'duplicate passport no '+duplicate);
		return false;
	}
	
	
	if($('#noOfPassenger').val()!=count && status){
		showMessage(true, 'Please enter passenger details equivalent to number of passengers.');
		status=false;
		//return status;
	}
	return status;
}
function showCurrentSubject(flag){
	if(flag){
		if($('#currentGrade').val()>0){
			$('#currentSubjectModal').modal({backdrop: 'static', keyboard: false});
		}else{
			showMessage(true, 'Please select grade');
		}
	}
}

function saveMarksGrade(formId,moduleId) {
	customLoader(true);
	hideMessage('');
	if(!validateRequestForAddGrade(formId)){
		customLoader(false);
		return false;
	}
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLFor('school','save-grades'),
		data : JSON.stringify(getRequestForSaveMarkGrade(formId, moduleId)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				$('#marksGradeModal').modal('toggle');
				showMessage(true, data['message']);
				setTimeout(function(){
					callDashboardPageSchoolB2B('markgrade');
				}, 1000);
			}
			return false;
		},
		error : function(e) {
			//showMessage(true, e.responseText);
			return false;
		}
	});
}

function deleteMarksGrade(formId,moduleId,gradeId) {
	hideMessage('');
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLFor('school','save-grades'),
		data : JSON.stringify(getRequestForSaveMarkGrade(formId, moduleId,'Y',gradeId)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				//$('#marksGradeModal').modal('toggle');
				showMessage(true, data['message']);
				setTimeout(function(){
					callDashboardPageSchoolB2B('markgrade');
				}, 1000);
			}
			return false;
		},
		error : function(e) {
			//showMessage(true, e.responseText);
			return false;
		}
	});
}

function validateRequestForAddGrade(formId){
	console.log("Grades");
	
	if ($("#"+formId+" #minMarks").val()=='' ||  $("#"+formId+" #minMarks").val()==null) {
		showMessage(false, 'Min Marks is required ');
		return false
	}
	if ($("#"+formId+" #maxMarks").val()=='' ||  $("#"+formId+" #maxMarks").val()==null) {
		showMessage(false, 'Max Marks is required ');
		return false
	}
	if ($("#"+formId+" #grade").val()=='' ||  $("#"+formId+" #grade").val()==null) {
		showMessage(false, 'Grade is required');
		return false
	}
//	if ($("#"+formId+" #credit").val()=='' ||  $("#"+formId+" #credit").val()==null) {
//		showMessage(false, 'Credit is required ');
//		return false
//	}
	if ($("#"+formId+" #result").val()==0) {
		showMessage(false, 'Result is required ');
		return false
	}
	
	
	return true;
}
function getRequestForSaveMarkGrade(formId,moduleId,deleteMarks,gradeId){
	console.log('getRequestForSaveMarkGrade');
	var request = {};
	var authentication = {};
	var requestData = {};
	var markGradeDTO = {};
	
	if(gradeId!='' && gradeId!=undefined){
		markGradeDTO['markGradeId']=gradeId;
	}else{
		markGradeDTO['markGradeId']=$("#"+formId+" #gradeId").val();
	}
	markGradeDTO['schoolId']=$("#"+formId+" #schoolId").val();
	markGradeDTO['minMark']=$("#"+formId+" #minMarks").val();
	markGradeDTO['maxMark']=$("#"+formId+" #maxMarks").val();
	markGradeDTO['grade']=$("#"+formId+" #grade").val();
	//markGradeDTO['credit']=$("#"+formId+" #credit").val();
	markGradeDTO['result']=$('#result option:selected').html();
	if(deleteMarks!='' && deleteMarks!=undefined && deleteMarks=='Y'){
		markGradeDTO['deleteMarks']=deleteMarks;
	}
		
	requestData['markGradeDTO'] = markGradeDTO;
	authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = moduleId;
	authentication['userId'] = $("#"+formId+" #userId").val();
	request['authentication'] = authentication;
	request['requestData'] = requestData;
	return request;
}

function sendLMSStudentMailContent(lmsId) {
	hideMessage('');
	var data={};
	data['lmsId']=lmsId;
	data['userId']=USER_ID;
	$.ajax({
		type : "POST",
		contentType:"application/json",
		url : getURLForHTML('dashboard','lms-student-performance-send-mail'),
		data : JSON.stringify(data),
		dataType : 'html',
		cache : false,
		//timeout : 600000,
			success : function(htmlContent) {
				if(htmlContent!=""){
	            	var stringMessage = [];
	            	stringMessage = htmlContent.split("|");
	        		console.log('stringMessage: '+stringMessage);
	            	if(stringMessage[0] == "FAILED" || stringMessage[0] == "EXCEPTION" || stringMessage[0] == "SESSIONOUT" ){
	            		showMessage(true, stringMessage[1]);
	        		}else{
	        			showMessage(true, stringMessage[1]);
	        			setTimeout(function(){
	        				callDashboardPageSchool(roleModuleId,'lms-student-performance');
	    				}, 1000);
	        		}
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