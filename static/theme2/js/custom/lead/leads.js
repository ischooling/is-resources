var watiTemplateContent;
var emailTemplateContent;
// var emailStatusInterval = null;
// var pendingEmails = [];
var successfulEmails = [];
var failedOrOtherEmails = [];
$(function () {
	// $('[data-toggle="tooltip"]').tooltip()
});

function validateRequestForLeadSave(formId, newTheme, leadFrom, leadType){
 hideMessage('');
 var flag=true;
 if(leadFrom=='leadlist'){
	 if ($("#"+formId+" #leadUpdateSource").val()==null || $("#"+formId+" #leadUpdateSource").val()=='0') {
		 if(newTheme){
				 showMessageTheme2(0, "Please select Lead Source",'',true);
			 }else{
				 showMessage(true, "Please select Lead Source");
			 }
		 return false;
	 }
 }else if(leadFrom=='leadlistPopup' || leadFrom=='new-leadlistPopup'){
	if($("#"+formId+" #countrolType").val()!='edit'){

		if ($("#"+formId+" #leadSource").val()==null || $("#"+formId+" #leadSource").val()=='0' || $("#"+formId+" #leadSource").val()=='') {
			if(newTheme){
					showMessageTheme2(0, "Please select Lead Source",'',true);
				}else{
					showMessage(true, "Please select Lead Source");
				}
			return false;
		}
		if(leadType!='B2B'){
			if ($("#"+formId+" #leadGrade").val()==null || $("#"+formId+" #leadGrade").val()=='') {
				if(newTheme){
					showMessageTheme2(0, 'Please choose grade','',true);
				}else{
					showMessage(true, 'Please choose grade');
				}
				return false;
			}
		}
	}
	if ($("#"+formId+" #leademailId").val()==null || $("#"+formId+" #leademailId").val()=='') {
		 if(newTheme){
			if ($("#"+formId+" #phoneNo").val()==null || $("#"+formId+" #phoneNo").val()=='') {
				showMessageTheme2(0, "Please enter email or phone no",'',true);
				return false;
			}
		 }else{
			 showMessage(true, "Please fill Email");
			 return false;
		 }
	}
	if ($("#"+formId+" #leademailId").val()!=null && $("#"+formId+" #leademailId").val()!='') {
		if (!validateEmail($("#"+formId+" #leademailId").val())) {
			if(newTheme){
				showMessageTheme2(0, "Email is either empty or invalid",'',true);
			}else{
				showMessage(true, "Email is either empty or invalid");
			}
			return false
		}
	}
	 
	 if ($("#"+formId+" #phoneNo").val()==null || $("#"+formId+" #phoneNo").val()=='') {
		 if(newTheme){
			if ($("#"+formId+" #leademailId").val()==null || $("#"+formId+" #leademailId").val()=='') {
				showMessageTheme2(0, "Please enter email or phone no",'',true);
				return false;
			}
		 }else{
			 showMessage(true, "Please enter phone no");
			 return false;
		 }
	 }
	 if($("#"+formId+" #phoneNo").val()!='' && $("#"+formId+" #phoneNo").val()!=null){
		if ($("#"+formId+" #isdCode").val()==null || $("#"+formId+" #isdCode").val()=='0') {
			if(newTheme){
				showMessageTheme2(0, "Please choose ISD Code",'',true);
			}else{
				showMessage(true, "Please choose ISD Code");
			}
			return false;
		}
	 }


	 if ($("#"+formId+" #leadstdfname").val()==null || $("#"+formId+" #leadstdfname").val()=='') {
		 
		 if(newTheme){
			 showMessageTheme2(0, "Please enter Student's First Name",'',true);
		 }else{
			 showMessage(true, "Please enter Student's First Name");
		 }
		 return false;
	}

	if($("#"+formId+" #countrolType").val()!='edit'){
		if ($("#"+formId+" #leadStatus").val()==null || $("#"+formId+" #leadStatus").val()=='') {
			if(newTheme){
				showMessageTheme2(0, 'Please choose Lead Status','',true);
			}else{
				showMessage(true, 'Please choose Lead Status');
			}
			return false;
		}
		if ($("#"+formId+" #leadAssignTo").val()==null || $("#"+formId+" #leadAssignTo").val()==0) {
			if(newTheme){
				showMessageTheme2(0, 'Please select Lead Assigned To','',true);
			}else{
				showMessage(true, 'Please select Lead Assigned To');
			}
			return false;
		}
	}
	 
 }else if(leadFrom=='dashboard'){
	 if ($("#"+formId+" #leadSource").val()==null || $("#"+formId+" #leadSource").val()=='0') {
		 if(newTheme){
				 showMessageTheme2(0, "Please select Lead Source",'',true);
			 }else{
				 showMessage(true, "Please select Lead Source");
			 }
		 return false;
	 }
	 if ($("#"+formId+" #phoneNo").val()==null || $("#"+formId+" #phoneNo").val()=='') {
		 if(newTheme){
			 showMessageTheme2(0, "Please enter phone no",'',true);
		 }else{
			 showMessage(true, "Please enter phone no");
		 }
		 return false;
	 }
	 if ($("#"+formId+" #leadAssignTo").val()==null || $("#"+formId+" #leadAssignTo").val()==0) {
		 if(newTheme){
			 showMessageTheme2(0, 'Please select Lead Assigned To','',true);
		 }else{
			 showMessage(true, 'Please select Lead Assigned To');
		 }
		 return false;
	 }
 }else{
 	if(formId!='leadMergeDataPopupForm' && formId!='leadMergeDataPopupB2BForm'){
		 if ($("#"+formId+" #leadSource").val()==null || $("#"+formId+" #leadSource").val()=='0') {
			 if(newTheme){
					 showMessageTheme2(0, "Please select Lead Source",'',true);
				 }else{
					 showMessage(true, "Please select Lead Source");
				 }
			 return false;
		 }
		
	
		if ($("#"+formId+" #leademailId").val()==null || $("#"+formId+" #leademailId").val()=='') {
			if(newTheme){
			if ($("#"+formId+" #phoneNo").val()==null || $("#"+formId+" #phoneNo").val()=='') {
				showMessageTheme2(0, "Please enter email or phone no",'',true);
				return false;
			}
			}else{
				showMessage(true, "Please fill Email");
				return false;
			}
		}
		if ($("#"+formId+" #leademailId").val()!=null && $("#"+formId+" #leademailId").val()!='') {
			if (!validateEmail($("#"+formId+" #leademailId").val())) {
				if(newTheme){
					showMessageTheme2(0, "Email is either empty or invalid",'',true);
				}else{
					showMessage(true, "Email is either empty or invalid");
				}
				return false
			}
		}
	
		if ($("#"+formId+" #phoneNo").val()==null || $("#"+formId+" #phoneNo").val()=='') {
			if(newTheme){
			if ($("#"+formId+" #leademailId").val()==null || $("#"+formId+" #leademailId").val()=='') {
				showMessageTheme2(0, "Please enter email or phone no",'',true);
				return false;
			}
			}else{
				showMessage(true, "Please enter phone no");
				return false;
			}
		}
		if($("#"+formId+" #phoneNo").val()!='' && $("#"+formId+" #phoneNo").val()!=null){
			if ($("#"+formId+" #isdCode").val()==null || $("#"+formId+" #isdCode").val()=='0') {
				if(newTheme){
					showMessageTheme2(0, "Please choose ISD Code",'',true);
				}else{
					showMessage(true, "Please choose ISD Code");
				}
				return false;
			}
		}
	 
		if ($("#"+formId+" #leadstdfname").val()==null || $("#"+formId+" #leadstdfname").val()=='') {
			
			if(newTheme){
				showMessageTheme2(0, "Please enter Student's First Name",'',true);
			}else{
				showMessage(true, "Please enter Student's First Name");
			}
			return false;
		}
	
		if ($("#"+formId+" #leadStatus").val()==null || $("#"+formId+" #leadStatus").val()=='') {
			if(newTheme){
				showMessageTheme2(0, 'Please choose Lead Status','',true);
			}else{
				showMessage(true, 'Please choose Lead Status');
			}
			return false;
		}
		if ($("#"+formId+" #leadAssignTo").val()==null || $("#"+formId+" #leadAssignTo").val()==0) {
			if(newTheme){
				showMessageTheme2(0, 'Please select Lead Assigned To','',true);
			}else{
				showMessage(true, 'Please select Lead Assigned To');
			}
			return false;
		}
		if ($("#"+formId+" #leadRemark").val()==null || $("#"+formId+" #leadRemark").val()=='') {
		
			if(newTheme){
				showMessageTheme2(0, 'Please fill Lead Remarks','',true);
			}else{
				showMessage(true, 'Please fill Lead Remarks');
			}
			return false;
		}
	}
	
	 if(leadType!='B2B'){

		// if ($("#"+formId+" #leadDate").val()==null || $("#"+formId+" #leadDate").val()=='') {
		// 	if(newTheme){
		// 		showMessageTheme2(0, "Please choose lead Date",'',true);
		// 	}else{
		// 		showMessage(true, "Please choose lead Date");
		// 	}
		// 	return false;
		// }
		// if ($("#"+formId+" #leadDate").val()==null || $("#"+formId+" #leadDate").val()=='') {
		// 	if(newTheme){
		// 		showMessageTheme2(0, "Please choose lead Date",'',true);
		// 	}else{
		// 		showMessage(true, "Please choose lead Date");
		// 	}
		// 	return false;
		// }
		if ($("#"+formId+" #leadGrade").val()==null || $("#"+formId+" #leadGrade").val()=='') {
		   if(newTheme){
			   showMessageTheme2(0, 'Please choose grade','',true);
		   }else{
			   showMessage(true, 'Please choose grade');
		   }
		   return false;
	   }
	//    if ($("#"+formId+" #leadPriority").val()==null || $("#"+formId+" #leadPriority").val()=='') {
	// 	   if(newTheme){
	// 		   showMessageTheme2(0, 'Please select Lead Priority','',true);
	// 	   }else{
	// 		   showMessage(true, 'Please select Lead Priority');
	// 	   }
	// 	   return false;
	//    }
	}
	 
 }
 
 return flag;
}
function submitLeads(formId, roleModuleId, leadsFrom, newTheme, leadFrom, modalId, leadType, objectRights, roleAndModule) {
	
 //console.log("submitLeads", leadFrom);
 if(newTheme){
			 hideMessageTheme2('');
		 }else{
			 hideMessage('');
		 }
 if(!validateRequestForLeadSave(formId, newTheme, leadFrom, leadType)){
	 return false;
 }
 $.ajax({
	 type : "POST",
	 contentType : "application/json",
	 url : getURLFor('leads','save-leads-form-data'),
	 data : JSON.stringify(getRequestForLeadSave(formId, leadFrom, leadType)),
	 dataType : 'json',
	 cache : false,
	 timeout : 600000,
	 success : function(data) {
		 if (data['status'] == '0' || data['status'] == 'FAILED' || data['status'] == 'EXCEPTION' || data['status'] == 'SESSIONOUT' ) {
			 if(newTheme){
				 showMessageTheme2(0, data['message'],'',true);
			 }else{
				 showMessage(true, data['message']);
			 }
		 } else {
			$('#documentDiv').html('');
			 if(newTheme){
				if(leadFrom=='leadlist'){
					window.location.reload();
				}else if(leadFrom=='leadlistPopup'){
					showMessageTheme2(1, data['message'],'',true);
					$("#"+modalId).modal('hide');
					$(".b2cLeadsource").hide();
					$(".b2bLeadsource").hide();
					$(".b2bLeadstatus").hide();
					$(".b2cLeadstatus").hide();
					leadType = $("#leadType").val();
					setTimeout(function(){
						advanceLeadSearchStudent('advanceLeadNewSearchForm','', 'advance-search','', '0', 'new', true,'',''+leadType+'');
					}, 100);
				}else if(leadFrom=='new-leadlistPopup' || leadFrom=='new-leadMergePopup'){
					showMessageTheme2(1, data['message'],'',true);
					$("#"+modalId).modal('hide');
					$(".b2cLeadsource").hide();
					$(".b2bLeadsource").hide();
					$(".b2bLeadstatus").hide();
					$(".b2cLeadstatus").hide();
					leadType = $("#leadType").val();
					setTimeout(function(){
						//advanceLeadSearchStudent('advanceLeadNewSearchForm','', 'advance-search','', '0', 'new', true,'',''+leadType+'');
						getLeadDataList('advanceLeadNewSearchForm', 'advance-search','list', '0', 'new', true,'',  objectRights, roleAndModule);
					}, 100);
				}else{
					showMessageTheme2(1, data['message'],'',true);
					$("#"+modalId).modal('hide');
					advanceLeadSearchStudent('advanceLeadNewSearchForm','', 'advance-search','', '0', 'new', true,'',''+leadType+'');
				}
			 }else{
				 showMessage(false, data['message']);
				 $('#'+formId)[0].reset();
				 setTimeout(function(){
					 if(leadFrom=='dashboard'){
						 $("#addNewLeadModal").modal('hide');
						 $(".modal-backdrop").remove();
						 var urlSend = '/dashboard/lead-data-list?moduleId='+moduleId+'&leadFrom=LEAD&clickFrom=list&startDate=&endDate=&country=0&campaign=&currentPage=0&euid='+ENCRYPTED_USER_ID+'&leadType='+leadType
						 getAsPost(urlSend);
						 customLoader(false)
					 }else{
						window.location.reload();
					 }
				 }, 800);
			 }

			 $('#'+formId+'')[0].reset();
			 $('#'+formId+' #leadId').val('');
			 $('#'+formId+' #parentleadId').val('');
			 $('#'+formId+' #academicId').val('');
			 $('#'+formId+' #leadNo').val('');
			 $('#'+formId+' #rawLeadId').val('');
			 $('#'+formId+' #relationType').val('');
			 $('#'+formId+' #leadSourceGroup').val('');
			 $('#'+formId+' #countrolType').val('');
			 $('#'+formId+' #mergeLeads').val('');
			 $("#"+formId+" #leadTagging").val(0).trigger('change');
			 $("#leadNoMove").val('');
			 $("#leadDataList .checkLead").prop('checked', false);
		 }
		 return false;
	 },
	 error : function(e) {
		 //showMessage(true, e.responseText);
		 return false;
	 }
 });
}
function getRequestForLeadSave(formId, leadFrom, leadType){
 var leadAddFormRequestDTO = {};
 var authentication = {};
var leadCommonDTO = {};
var leadModifyDTO = {};
var leadStudentDetailDTO={};
var leadModifyDetailDTO={};
var leadDemoInfo={};
var leadCallFollowupDTO={};

leadModifyDTO['isUserWise'] = false;
leadModifyDTO['isLeadSearch'] = false;
leadModifyDTO['leadType']=leadType;
 if(leadFrom=='leadlist'){
	leadModifyDTO['leadSource'] =$("#leadUpdateSource").val();
	leadModifyDTO['leadId'] = $("#leadUpdateId").val();
	leadModifyDTO['leadDataFrom']='leadlist';
 }else if(leadFrom=='leadlistPopup' || leadFrom=='new-leadlistPopup' || leadFrom=='new-leadMergePopup'){
	leadModifyDTO['leadSource'] =$("#"+formId+" #leadSource").val();
	leadModifyDTO['leadId'] = $("#"+formId+" #leadId").val();
	leadStudentDetailDTO['stdDob'] = $("#"+formId+" #leadDOB").val();
	leadStudentDetailDTO['gender'] = $("#"+formId+" #leadGender option:selected").val();
	leadStudentDetailDTO['standard'] = $("#"+formId+" #leadGrade option:selected").val();
	leadStudentDetailDTO['email'] = $("#"+formId+" #leademailId").val();
	leadStudentDetailDTO['isdCountryCode'] = $("#"+formId+" #pCountryCode").val();
	leadStudentDetailDTO['isdCode'] = $("#"+formId+" #isdCode").val();
	leadStudentDetailDTO['phoneNo'] = $("#"+formId+" #phoneNo").val();
	leadStudentDetailDTO['emailAlternet'] = $("#"+formId+" #leademailAlternet").val();
	leadStudentDetailDTO['isdCountryCodeAlter'] = $("#"+formId+" #pCountryCodeAlter").val();
	leadStudentDetailDTO['isdCodeAlter'] = $("#"+formId+" #isdCodeAlter").val();
	leadStudentDetailDTO['phoneNoAlter'] = $("#"+formId+" #phoneNoAlter").val();
	leadStudentDetailDTO['stdFname'] = escapeCharacters($("#"+formId+" #leadstdfname").val());
	leadStudentDetailDTO['stdMname'] = escapeCharacters($("#"+formId+" #leadstdmname").val());
	leadStudentDetailDTO['stdLname'] = escapeCharacters($("#"+formId+" #leadstdlname").val());
	 
	leadStudentDetailDTO['gurdianFname'] = escapeCharacters($("#"+formId+" #leadGuardfname").val());
	leadStudentDetailDTO['gurdianMname'] = escapeCharacters($("#"+formId+" #leadGuardmname").val());
	leadStudentDetailDTO['gurdianLname'] = escapeCharacters($("#"+formId+" #leadGuardlname").val());
	leadStudentDetailDTO['country'] = $("#"+formId+" #countryId option:selected").val();
	leadStudentDetailDTO['state'] = $("#"+formId+" #stateId option:selected").val();
	leadStudentDetailDTO['city'] = $("#"+formId+" #cityId option:selected").val();
	leadStudentDetailDTO['address'] = escapeCharacters($("#"+formId+" #leadAdd").val());
	leadStudentDetailDTO['pincode'] = $("#"+formId+" #leadPin").val();
	leadModifyDTO['leadAddName'] = $("#"+formId+" #leadAdder").val();
	leadModifyDTO['controlType'] = $("#"+formId+" #countrolType").val();
	leadModifyDTO['assignTo'] = $("#"+formId+" #leadAssignTo").val();
	//leadModifyDTO['leadStatus'] = $("#"+formId+" #leadStatus").val();
	leadCallFollowupDTO['leadFollowStatus'] = $("#"+formId+" #leadStatus").val();
	leadModifyDTO['leadStatus'] =$("#"+formId+" #leadStatus").val();
	leadModifyDTO['parentleadId'] = $("#"+formId+" #parentleadId").val();
	leadModifyDetailDTO['remarks'] = escapeCharacters($("#leadRemark").val());
	leadCallFollowupDTO['leadTagging'] = $("#"+formId+" #leadTagging").val();
	leadModifyDetailDTO['mergeLeadsId'] = $("#"+formId+" #mergeLeads").val();
	leadModifyDTO['leadDataFrom']='leadlistPopup';
 }else if(leadFrom=='dashboard'){
	leadModifyDTO['leadSource'] =$("#leadSource").val();
	leadModifyDTO['assignTo'] = $("#leadAssignTo").val();
	leadStudentDetailDTO['isdCode'] = $("#isdCode option:selected").val();
	leadStudentDetailDTO['phoneNo'] = $("#phoneNo").val();
	leadStudentDetailDTO['gurdianFname'] = escapeCharacters($("#leadGuardfname").val());
	leadModifyDTO['leadStatus']='Assigned Working'
	leadModifyDTO['leadDataFrom']='dashboard';
	leadModifyDetailDTO['controlType'] = 'add';
}else{
	
	//leadCommonDTO['leadMailerLiteGroupName'] = $("#leadSourceGroup").val();
	if($("#"+formId+" #leadSource").val()!=undefined){
		leadModifyDTO['leadSource'] =$("#"+formId+" #leadSource").val();
	}
	leadStudentDetailDTO['stdDob'] = $("#"+formId+" #leadDOB").val();
	leadStudentDetailDTO['gender'] = $("#"+formId+" #leadGender option:selected").val();
	leadStudentDetailDTO['email'] = $("#"+formId+" #leademailId").val();
	leadStudentDetailDTO['isdCountryCode'] = $("#"+formId+" #pCountryCode").val();
	leadStudentDetailDTO['isdCode'] = $("#"+formId+" #isdCode").val();
	leadStudentDetailDTO['phoneNo'] = $("#"+formId+" #phoneNo").val();
	leadStudentDetailDTO['emailAlternet'] = $("#"+formId+" #leademailAlternet").val();
	leadStudentDetailDTO['isdCountryCodeAlter'] = $("#"+formId+" #pCountryCodeAlter").val();
	leadStudentDetailDTO['isdCodeAlter'] = $("#"+formId+" #isdCodeAlter").val();
	leadStudentDetailDTO['phoneNoAlter'] = $("#"+formId+" #phoneNoAlter").val();
	leadStudentDetailDTO['stdFname'] = escapeCharacters($("#"+formId+" #leadstdfname").val());
	leadStudentDetailDTO['stdMname'] = escapeCharacters($("#"+formId+" #leadstdmname").val());
	leadStudentDetailDTO['stdLname'] = escapeCharacters($("#"+formId+" #leadstdlname").val());
	leadStudentDetailDTO['standard'] = $("#"+formId+" #leadGrade option:selected").val();
	leadStudentDetailDTO['gurdianFname'] = escapeCharacters($("#"+formId+" #leadGuardfname").val());
	leadStudentDetailDTO['gurdianMname'] = escapeCharacters($("#"+formId+" #leadGuardmname").val());
	leadStudentDetailDTO['gurdianLname'] = escapeCharacters($("#"+formId+" #leadGuardlname").val());
	leadStudentDetailDTO['country'] = $("#"+formId+" #countryId option:selected").val();
	leadStudentDetailDTO['state'] = $("#"+formId+" #stateId option:selected").val();
	leadStudentDetailDTO['city'] = $("#"+formId+" #cityId option:selected").val();
	leadStudentDetailDTO['address'] = escapeCharacters($("#"+formId+" #leadAdd").val());
	leadStudentDetailDTO['pincode'] = $("#"+formId+" #leadPin").val();
	
	leadModifyDTO['parentleadId'] = $("#"+formId+" #parentleadId").val();
	leadModifyDTO['leadId'] = $("#"+formId+" #leadId").val();
	leadModifyDTO['leadNo'] =$("#"+formId+" #leadNo").val();
	leadModifyDTO['academicId'] =$("#"+formId+" #academicId").val();
	leadModifyDTO['leadOthers'] = $("#"+formId+" #leadOthers").val();
	leadModifyDTO['leadDate'] = $("#"+formId+" #leadDate").val();
	leadModifyDTO['leadMsg'] = escapeCharacters($("#"+formId+" #leadStdMsg").val());
	if($("#"+formId+" #leadStatus").val()!=undefined){
		leadModifyDTO['leadStatus'] = $("#"+formId+" #leadStatus").val();
	}
	if($('#'+formId+' #leadAssignTo').val()!=undefined){
		leadModifyDTO['assignTo'] = $("#"+formId+" #leadAssignTo option:selected").val();
		leadModifyDTO['assignName'] = $.trim($("#"+formId+" #leadAssignTo option:selected").text().split("-")[0]);
		leadDemoInfo['leadAssignUserEmail'] = $.trim($("#"+formId+" #leadAssignTo option:selected").text().split("-")[1].replace("(","").replace(")","")); 
	}
	
	leadDemoInfo['rawLeadId'] =$("#"+formId+" #rawLeadId").val();
	leadDemoInfo['demoSessionDateTime'] = $("#"+formId+" #demoSessionDateTime").val();
	if($('#'+formId+' #leadDemoAssign').val()!=undefined){
		leadDemoInfo['demoAssignTo'] = $('#'+formId+' #leadDemoAssign option:selected').val();
	}
	
	
	var checkWtsupSts='N';
	if(leadType=='B2B'){
		if($("#"+formId+" #checkWtsupno").val()!=undefined){
			if($("#"+formId+" #checkWtsupno").is(":checked")){
				checkWtsupSts="Y";
			}
		}
	}
	leadModifyDetailDTO['checkWtsupNo']=checkWtsupSts;
	leadModifyDetailDTO['priority'] = $("#"+formId+" #leadPriority").val();
	leadModifyDetailDTO['remarks'] = escapeCharacters($("#"+formId+" #leadRemark").val());
	leadModifyDTO['leadAddName'] = $("#"+formId+" #leadAdder").val();
	leadModifyDTO['controlType'] = $("#"+formId+" #countrolType").val();
	leadModifyDetailDTO['mergeLeadsId'] = $("#"+formId+" #mergeLeads").val();
}
if($("#"+formId+" #leadSupportTo").val()=='' &&  $("#"+formId+" #leadSupportTo").val()==undefined){
	leadModifyDTO['leadSupportTo'] = 0;
}else{
	leadModifyDTO['leadSupportTo'] = $("#"+formId+" #leadSupportTo").val();
}
leadCommonDTO['leadModifyDTO']=leadModifyDTO;
leadCommonDTO['leadModifyDetailDTO']=leadModifyDetailDTO;
leadCommonDTO['leadDemoInfo']=leadDemoInfo;
leadCommonDTO['leadStudentDetailDTO']=leadStudentDetailDTO;
leadCommonDTO['leadCallFollowupDTO']=leadCallFollowupDTO;

 authentication['hash'] = getHash();
 authentication['schoolId'] = SCHOOL_ID;
 authentication['schoolUUID'] = SCHOOL_UUID;
 authentication['userId'] = USER_ID;
 authentication['userType'] = 'COMMON';
 leadAddFormRequestDTO['authentication'] = authentication;
 leadAddFormRequestDTO['leadCommonDTO'] = leadCommonDTO;
 leadAddFormRequestDTO['uploadDocuments'] = getUploadedDocuments();
 return leadAddFormRequestDTO;
}


function leadFollowup(leadId, roleModuleId){
 $.ajax({
	 type : "POST",
	 url : getURLForHTML('dashboard','lead-followup'),
	 data : {leadId:leadId,moduleId:roleModuleId},
	 dataType : 'html',
	 success : function(htmlContent) {
		 if (htmlContent != "") {
			 var stringMessage = [];
			 stringMessage = htmlContent.split("|");
			 if (stringMessage[0] == "FAILED" || stringMessage[0] == "EXCEPTION" || stringMessage[0] == "SESSIONOUT") {
				 showMessage(true, stringMessage[1]);
			 } else {
				 $('#followupContent').html(htmlContent)
				 $("#followupform").modal('show');
				 $('.followCall').css( "display", "none" );
				 $('.followMail').css( "display", "none" );
				 $('.iNotSure').css( "display", "none" );
				 $('.heNotSure').css( "display", "none" );
				 $('.meetingSlotsDate').css( "display", "none" );
				 $("#followupform").modal('show');
				 //$("#li"+leadId).remove();
			 }
			 return false;
		 }
		 return false;
	 }
 });
}


function validateRequestForLeadFollowupSave(formId, newTheme, leadType){
 if(newTheme){
	 hideMessageTheme2('');
 }else{
	 hideMessage('');
 }
 
 $('.errorLeadCls').css( "display", "none" );
 $('#errorMessageLead').html('');
 var flag=true;

 if ($("#"+formId+" #followMed").val()==undefined || $("#"+formId+" #followMed").val()=='') {
	$('.errorLeadCls').fadeIn();
	 setTimeout(function (){
		 $('.errorLeadCls').fadeOut();
	 }, 5000)
	 if(newTheme){
		 showMessageTheme2(0, 'Please select Connected Through.','',true);
		 $('#errorMessageLead').html('Please select Connected Through.');
	 }else{
		 $('#errorMessageLead').html('Please select Connected Through.');
	 }
	 return false;
 }

 

//  if ($("#"+formId+" #selectStatusOfLead").val()==undefined || $("#"+formId+" #selectStatusOfLead").val()=='') {
// 	 $('.errorLeadCls').fadeIn();
// 	 setTimeout(function (){
// 		 $('.errorLeadCls').fadeOut();
// 	 }, 5000)
// 	 if(newTheme){
// 		 showMessageTheme2(0, 'Please select followup status.','',true);
// 		 $('#errorMessageLead').html('Please select followup status.');
// 	 }else{
// 		 $('#errorMessageLead').html('Please select followup status.');
// 	 }
// 	 return false;
//  }

 //if ($("#"+formId+" #followMed").val()=='Call') {

	 if ($("#"+formId+" #callWith").val()==undefined || $("#"+formId+" #callWith").val()=='') {
		 $('.errorLeadCls').fadeIn();
		 setTimeout(function (){
			 $('.errorLeadCls').fadeOut();
		 }, 5000)
		 
		 if(newTheme){
			 showMessageTheme2(0, 'Select follow up last call with','',true);
			 $('#errorMessageLead').html('Select follow up last call with');
		 }else{
			 $('#errorMessageLead').html('Select follow up last call with');
		 }
		 return false;
	 }

	 if ($("#"+formId+" #leadStatus").val()==undefined || $("#"+formId+" #leadStatus").val()=='') {
		 $('.errorLeadCls').fadeIn();
		 setTimeout(function (){
			 $('.errorLeadCls').fadeOut();
		 }, 5000)
		 
		 if(newTheme){
			 showMessageTheme2(0, 'Select follow up lead Status','',true);
			 $('#errorMessageLead').html('Select follow up lead Status');
		 }else{
			 $('#errorMessageLead').html('Select follow up lead Status');
		 }
		 return false;
	 }

	if(leadType=='B2B'){
		var leadStaus = $("#"+formId+" #leadStatus").val();
		var epdetailStatus = $("#"+formId+" #epdetailStatus").val();
		if(leadStaus=='Converted & On Boarding | Hot'){
			if(epdetailStatus!='Y'){
				showMessageTheme2(0, 'Please update the Enrollment Partner Form before creating the partner dashboard.','',true);
				return false;
			}
		}
 	}
	 
	//  if ($("#"+formId+" #callscheduleDate").val()==undefined || $("#"+formId+" #callscheduleDate").val()=='') {
	// 	 $('.errorLeadCls').fadeIn();
	// 	 setTimeout(function (){
	// 		 $('.errorLeadCls').fadeOut();
	// 	 }, 5000)
	// 	 if(newTheme){
	// 		 showMessageTheme2(0, 'Enter follow up last date','',true);
	// 		 $('#errorMessageLead').html('Enter follow up last date');
	// 	 }else{
	// 		 $('#errorMessageLead').html('Enter follow up last date');
	// 	 }
		 
	// 	 return false;
	//  }
	 
//	}

if($("#"+formId+" #nextDate").val()==''){
	$('.errorLeadCls').fadeIn();
	setTimeout(function (){
		$('.errorLeadCls').fadeOut();
	}, 5000)
	if(newTheme){
		showMessageTheme2(0, 'Select next follow up','',true);
		$('#errorMessageLead').html('Select next follow up');
	}else{
		$('#errorMessageLead').html('Select next follow up');
	}
	return false;
}

if($("#"+formId+" #nextDate").val()=='CUSTOM'){
	if ($("#"+formId+" #notSureCallscheduleDate").val()==undefined || $("#"+formId+" #notSureCallscheduleDate").val()=='') {
		$('.errorLeadCls').fadeIn();
		setTimeout(function (){
			$('.errorLeadCls').fadeOut();
		}, 5000)
		if(newTheme){
			showMessageTheme2(0, 'Enter follow up next date','',true);
			$('#errorMessageLead').html('Enter follow up next date');
		}else{
			$('#errorMessageLead').html('Enter follow up next date');
		}
		return false;
	}
	// if ($("#"+formId+" #notSureHours").val()==undefined || $("#"+formId+" #notSureHours").val()=='') {
	// 	$('.errorLeadCls').fadeIn();
	// 	setTimeout(function (){
	// 		$('.errorLeadCls').fadeOut();
	// 	}, 5000)
	// 	if(newTheme){
	// 		showMessageTheme2(0, 'Please select Hours','',true);
	// 		$('#errorMessageLead').html('Please select Hours');
	// 	}else{
	// 		$('#errorMessageLead').html('Please select Hours');
	// 	}
	// 	return false;
	// }

	// if ($("#"+formId+" #notSureAMPM").val()==undefined || $("#"+formId+" #notSureAMPM").val()=='') {
	// 	$('.errorLeadCls').fadeIn();
	// 	setTimeout(function (){
	// 		$('.errorLeadCls').fadeOut();
	// 	}, 5000)
	// 	if(newTheme){
	// 		showMessageTheme2(0, 'Please select AM|PM','',true);
	// 		$('#errorMessageLead').html('Please select AM|PM');
	// 	}else{
	// 		$('#errorMessageLead').html('Please select AM|PM');
	// 	}
	// 	return false;
	// }
}

// if(leadType=='B2B'){
// 	if ($("#"+formId+" #followupRemarks").val()==undefined || $("#"+formId+" #followupRemarks").val()=='') {
// 		$('.errorLeadCls').fadeIn();
// 		setTimeout(function (){
// 			$('.errorLeadCls').fadeOut();
// 		}, 5000)
		
// 		if(newTheme){
// 			showMessageTheme2(0, 'Enter follow up remarks','',true);
// 			$('#errorMessageLead').html('Enter follow up remarks');
// 		}else{
// 			$('#errorMessageLead').html('Enter follow up remarks');
// 		}
// 		return false;
// 	}
// }
 
	 
if ($("#"+formId+" #leadStatus").val()=='Demo Reschedule') {
	//if($("#demoStatus").val()==0){
		if ($("#"+formId+" #bookMeeetingDate").val()==undefined || $("#"+formId+" #bookMeeetingDate").val()=='') {
			//showMessage(true, 'Please select a booked meeting date');
			$('.errorLeadCls').fadeIn();
			setTimeout(function (){
				$('.errorLeadCls').fadeOut();
			}, 5000)
			$('#errorMessageLead').html('Please select a booked meeting date');
			return false;
		}
		if ($("#"+formId+" #countryTimezoneId").val()==undefined || $("#"+formId+" #countryTimezoneId").val()=='') {
			//showMessage(true, 'Please select a booked meeting date');
			$('.errorLeadCls').fadeIn();
			setTimeout(function (){
				$('.errorLeadCls').fadeOut();
			}, 5000)
			$('#errorMessageLead').html('Please select a country Timezone');
			return false;
		}

		if($("input[name='slotTime']:checked").val()==undefined){
			//showMessage(true, 'Please select any one Slot.');
			$('.errorLeadCls').fadeIn();
			setTimeout(function (){
				$('.errorLeadCls').fadeOut();
			}, 5000)
			if(newTheme){
				showMessageTheme2(0, 'Please select any one Slot.','',true);
				$('#errorMessageLead').html('Please select any one Slot.');
			}else{
				$('#errorMessageLead').html('Please select any one Slot.');
			}
			return false;
		}
		
	//}
}
 
 
 return flag;
}
function submitLeadFollowupSave(formId,roleModuleId, leadFrom, newTheme, modalId, objRights, roleAndModule) {
 //console.log(formId);
 $('.errorLeadCls').css( "display", "none" );
 $('.errorLeadCls').removeClass('success');
 $('#errorMessageLead').html('');
 var leadType=$("#"+formId+" #leadType").val();
 hideMessageTheme2('');
 //hideMessage('');
 if(!validateRequestForLeadFollowupSave(formId, newTheme, leadType)){
	 return false;
 }
 
 $.ajax({
	 type : "POST",
	 contentType : "application/json",
	 url : getURLFor('leads','save-leads-followup'),
	 data : JSON.stringify(getRequestForLeadFollowupSave(formId)),
	 dataType : 'json',
	 cache : false,
	 timeout : 600000,
	 success : function(data) {
		//console.log(data);
		 if (data['status'] == '0' || data['status'] == '2') {
			 //showMessage(true, data['message']);
			 if(newTheme){
				 showMessageTheme2(0, data['message'],'',true);
				 $('#errorMessageLead').html(data['message']);
			 }else{
				 $('.errorLeadCls').css( "display", "block" );
				 $('#errorMessageLead').html(data['message']);
			 }
			 return false;
		 } else {
			 //showMessage(false, data['message']);
			 
			 if(newTheme){
				 showMessageTheme2(1, data['message'],'',false);
				 $('.errorLeadCls').css( "display", "block" );
				 $('.errorLeadCls').addClass('success');
				 $('#errorMessageLead').html(data['message']);
				 //window.close();
				 setTimeout(function(){
					 $("#"+formId+"")[0].reset();
					 $("#"+formId+" #callWith").val('').trigger("change");
					 $("#"+formId+" #leadStatus").val('').trigger("change");
					 $("#"+modalId).modal('hide');
					 // var leadId = $("#"+formId+" #leadId").val();
					 if(leadFrom=="time-available"){
						
					 }else if(leadFrom=="lead-list-update"){
						
					 }else if(leadFrom=="new-lead-list"){
						getLeadDataList('advanceLeadNewSearchForm', 'advance-search', 'list', data['extra'], 'new', true,'', objRights, roleAndModule);
					 }else{
						 advanceLeadSearchStudent('advanceLeadNewSearchForm',roleModuleId, 'advance-search','list' ,data['extra'],'new', true,'', leadType);
					 }
					 // var urlSend = '/dashboard/lead-data-list?moduleId='+roleModuleId+'&leadFrom=LEAD&clickFrom=list&currentPage='+data['extra']+'&leadId=0&euid='+ENCRYPTED_USER_ID;
					 // getAsPost(urlSend);
					 customLoader(false)
				 }, 300);
			 }else{
				 $('.errorLeadCls').css( "display", "block" );
				 $('.errorLeadCls').addClass('success');
				 $('#errorMessageLead').html(data['message']);
			 }
			 //getPendingNotCall();
			 setTimeout(function(){ 
				 $("#followupform").modal('hide');
			 }, 300);
			 
		 }
		 return false;
	 },
	 error : function(e) {
		 //showMessage(true, e.responseText);
		 return false;
	 }
 });
}
function getRequestForLeadFollowupSave(formId){
	//console.log("getRequestForLeadFollowupSave");
	var leadAddFormRequestDTO = {};
	var authentication = {};
	var leadCommonDTO = {};
	var leadModifyDTO={};
	var leadModifyDetailDTO={};
	var leadCallFollowupDTO={};
	var leadDemoInfo={};
	
	leadModifyDTO['leadId'] = $("#"+formId+" #leadId").val();
	leadCallFollowupDTO['followupBy'] =$("#"+formId+" #followMed").val();
	
	if($("input[name=leadTypeCategory]").is(":checked")){
		leadModifyDetailDTO['leadCategory']=$("input[name=leadTypeCategory]:checked").val();
	}
	if($("#tentativeDate").val()!=''){
		leadModifyDetailDTO['tentativeDate'] = $("#"+formId+" #tentativeDate").val();
	}else{
		leadModifyDetailDTO['tentativeDate']='';
	}
	
	if($("#"+formId+" #followupRemarks").val()!=''){
		leadCallFollowupDTO['followRemarks'] = escapeCharacters($("#"+formId+" #followupRemarks").val());
	}

	leadCallFollowupDTO['followupRemarkBy'] = $("#"+formId+" #followupRemarkBy").val();
	leadCallFollowupDTO['callStatus'] = $("#"+formId+" #callStatus").val();
	
	leadCallFollowupDTO['toCall'] = $("#"+formId+" #callWith").val();
	
	//leadCommonDTO['callBadge'] = $('input[name="callBadge"]:checked').val();
	
	
	//leadCallFollowupDTO['callVerify'] = $("#"+formId+" #verifyCall").val();
	//leadCallFollowupDTO['superRemark'] = $("#"+formId+" #teamMemberRemark").val();
	
	leadCallFollowupDTO['leadFollowStatus'] = $("#"+formId+" #leadStatus").val();
	leadModifyDTO['leadStatus'] =$("#"+formId+" #leadStatus").val();
	
	//$("#"+formId+" #selectStatusOfLead").val();
	
	if($("#"+formId+" #leadStatus").val()=='Call Completed'
		||$("#"+formId+" #leadStatus").val()=='Not Answering | Not reachable | Switch off' ){
			leadCallFollowupDTO['callBadge'] ='followup1'
	}

	if($("#"+formId+" #leadStatus").val()=='Call Completed | Hot'
		||$("#"+formId+" #leadStatus").val()=='Call Completed | Warm'
		||$("#"+formId+" #leadStatus").val()=='Call Completed | Cold'){
			leadCallFollowupDTO['callBadge'] ='calldoneb2b'
	}
 
	if($("#"+formId+" #leadStatus").val()=='Positive to enrollment'){
		leadCallFollowupDTO['callBadge'] ='positive'
	}
	if($("#"+formId+" #leadStatus").val()=='Share details over WhatsApp | e-mail'
	||$("#"+formId+" #leadStatus").val()=='Phone | WhatsApp Call'
	||$("#"+formId+" #leadStatus").val()=='Reached out on WhatsApp'
	||$("#"+formId+" #leadStatus").val()=='Reached out on Phone Call'
	||$("#"+formId+" #leadStatus").val()=='Reached out on Email'){
		leadCallFollowupDTO['callBadge'] ='followup2'
	}
	if($("#"+formId+" #leadStatus").val()=='Need time'
	 || $("#"+formId+" #leadStatus").val()=='Other'
	 || $("#"+formId+" #leadStatus").val()=='Class Demo Needed'
	 || $("#"+formId+" #leadStatus").val()=='Class Demo Completed'
	 ){
		leadCallFollowupDTO['callBadge'] ='followup3';	
	 }
	 
 	if($("#"+formId+" #leadStatus").val()=='Duplicate lead'
	||$("#"+formId+" #leadStatus").val()=='Invalid | Cold'){
		leadCallFollowupDTO['callBadge'] ='red';
	}
	if($("#"+formId+" #leadStatus").val()=='Rejected | Cold'){
		leadCallFollowupDTO['callBadge'] ='rejected';
	}

	 if($("#"+formId+" #leadStatus").val()=='Demo Needed'
		 || $("#"+formId+" #leadStatus").val()=='Demo Completed'
		 ||$("#"+formId+" #leadStatus").val()=='Demo Reschedule'
		 ||$("#"+formId+" #leadStatus").val()=='Demo Booked'){
			leadCallFollowupDTO['callBadge'] ='yellow';
	 }
	 if($("#"+formId+" #leadStatus").val()=='Connect to Impact Recommended'
		 || $("#"+formId+" #leadStatus").val()=='Connect to Impact Booked'
		 ||$("#"+formId+" #leadStatus").val()=='Connect to Impact Completed'){
			leadCallFollowupDTO['callBadge'] ='cti';
	 }
	 
	 if($("#"+formId+" #leadStatus").val()=='Booked Seat'){
		leadCallFollowupDTO['callBadge'] ='darkgreen';
	 }
	if($("#"+formId+" #leadStatus").val()=='Neutral'){
		leadCallFollowupDTO['callBadge'] ='neutral';
	}
	if($("#"+formId+" #leadStatus").val()=='Assigned Working' 
	|| $("#"+formId+" #leadStatus").val()=='Basic Details not Filled | Cold'){
		leadCallFollowupDTO['callBadge'] ='gray';
	}
	 if($("#"+formId+" #leadStatus").val()=='Converted'||
	 $("#"+formId+" #leadStatus").val()=='Converted & On Boarding | Hot'){
		leadCallFollowupDTO['callBadge'] ='green';
	 }
	if($("#"+formId+" #leadStatus").val()=='Looking for next year'){
		leadCallFollowupDTO['callBadge'] ='nextyear';
	}
	if($("#"+formId+" #leadStatus").val()=='Request Under Review | Warm'){
		leadCallFollowupDTO['callBadge'] ='under-review';
	}
	if($("#"+formId+" #leadStatus").val()=='Interested to Interview | Warm'
	||$("#"+formId+" #leadStatus").val()=='Interested to Interview | Cold'
	||$("#"+formId+" #leadStatus").val()=='Interested to Interview | Hot'){
		leadCallFollowupDTO['callBadge'] ='int-inerview';
	}
	if($("#"+formId+" #leadStatus").val()=='Moving for the Next meeting | Warm'
	|| $("#"+formId+" #leadStatus").val()=='Moving for the Next meeting | Cold'
	|| $("#"+formId+" #leadStatus").val()=='Moving for the Next meeting | Hot'){
		leadCallFollowupDTO['callBadge'] ='move-inerview';
	}
	if($("#"+formId+" #leadStatus").val()=='Interview Booked | Cold'){
		leadCallFollowupDTO['callBadge'] ='inter-booked';
	}
	 
	if($("#"+formId+" #leadStatus").val()=='Invalid'){
		leadCallFollowupDTO['callBadge'] ='red';
	}

	if($("#"+formId+" #nextDate").val()!=''){
		leadCallFollowupDTO['customDate']= $("#"+formId+" #nextDate").val();
		if($("#"+formId+" #notSureHours").val()!='' && $("#"+formId+" #notSureMins").val()!=''){
			leadCallFollowupDTO['callHrs'] = $("#"+formId+" #notSureHours").val()+':'+$("#"+formId+" #notSureMins").val()+' '+$("#"+formId+" #notSureAMPM").val();
		}else{
			callHrs='';
		}

		if($("#"+formId+" #nextDate").val()=='CUSTOM'){
			if($("#"+formId+" #notSureCallscheduleDate").val()!=''){
				leadCallFollowupDTO['notSureCallscheduleDate'] = $("#"+formId+" #notSureCallscheduleDate").val()+' '+$("#"+formId+" #notSureHours").val()+':'+$("#"+formId+" #notSureMins").val()+' '+$("#"+formId+" #notSureAMPM").val();
			}	 
		}
		else{
			leadCallFollowupDTO['notSureCallscheduleDate']='';
		}
	}
 //leadCommonDTO['interestedFor'] = $("#interestedFor").val();
 
	// if ($("#"+formId+" #leadStatus").val()=='Demo Needed' 
	// ||$("#"+formId+" #leadStatus").val()=='Demo Reschedule'){
	// 	leadDemoInfo['meetingDate'] =$("input[name='slotTime']:checked").attr('slotDateAttr');
	// 	leadDemoInfo['meetingSlotId'] = $("input[name='slotTime']:checked").attr('slotidattr');
	// 	leadDemoInfo['meetingSlotTime'] = $("input[name='slotTime']:checked").val();
	// 	leadDemoInfo['countryTimezoneId'] = ($("#" + formId + " #countryTimezoneId").val()!=unde).trim();
	// 	leadDemoInfo['campaignName'] = "Request-demo";
	// }
	leadCommonDTO['leadModifyDTO']=leadModifyDTO;
	leadCommonDTO['leadModifyDetailDTO']=leadModifyDetailDTO;
	leadCommonDTO['leadCallFollowupDTO']=leadCallFollowupDTO;
	leadCommonDTO['leadDemoInfo']=leadDemoInfo;
	//console.log(leadCommonDTO);
	
	authentication['hash'] = getHash();
	authentication['schoolId'] = SCHOOL_ID;
	authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userId'] = USER_ID;
	authentication['userType'] = 'COMMON';
	leadAddFormRequestDTO['currentPage'] = $("#" + formId + " #currentPage").val();
	leadAddFormRequestDTO['authentication'] = authentication;
	leadAddFormRequestDTO['leadCommonDTO'] = leadCommonDTO;
	return leadAddFormRequestDTO;
}

// function sendMailLeadFollowupSave(leadId, roleModuleId, leadFrom, userId, newTheme) {
 
//  if(newTheme){
// 	 hideMessageTheme2('');
//  }else{
// 	 hideMessage('');
//  }
 
//  $.ajax({
// 	 type : "POST",
// 	 contentType : "application/json",
// 	 url : getURLFor('leads','send-mail-followup'),
// 	 data : JSON.stringify(getRequestForLeadFollowupSendMailSave(leadId, userId)),
// 	 dataType : 'json',
// 	 cache : false,
// 	 timeout : 600000,
// 	 success : function(data) {
// 		 if (data['status'] == '0' || data['status'] == '2') {
// 			 if(newTheme){
// 				 showMessageTheme2(0, data['message'],'',true);
// 			 }else{
// 				 showMessage(true, data['message']);
// 			 }
			 
			 
// 		 } else {
// 			 if(newTheme){
// 				 showMessageTheme2(1, data['message'],'',false);
// 			 }else{
// 				 showMessage(false, data['message']);
// 				 callForDashboardData('formIdIfAny','lead-list?moduleId='+roleModuleId+'&leadFrom='+leadFrom+'&clickFrom=list&currentPage=0');
			 
// 			 }
// 			 //$(".modal-backdrop").remove();
// 		 }
// 		 return false;
// 	 },
// 	 error : function(e) {
// 		 //showMessage(true, e.responseText);
// 		 return false;
// 	 }
//  });
// }
// function getRequestForLeadFollowupSendMailSave(leadId, userId){
//  var leadAddFormRequestDTO = {};
//  var authentication = {};
//  var leadCommonDTO = {};
 
//  leadCommonDTO['leadId'] =leadId;
//  leadCommonDTO['followupBy'] ="Mail";
//  authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
//  authentication['userId'] = userId;
//  authentication['userType'] = 'COMMON';
//  leadAddFormRequestDTO['authentication'] = authentication;
//  leadAddFormRequestDTO['leadCommonDTO'] = leadCommonDTO;
//  return leadAddFormRequestDTO;
// }


function leadFollowupActivityLogs(leadId, roleModuleId, logType){
 $.ajax({
	 type : "POST",
	 url : getURLForHTML('dashboard','lead-activity-logs'),
	 data : {leadId:leadId,moduleId:roleModuleId,logType:logType},
	 dataType : 'html',
	 success : function(htmlContent) {
		 if (htmlContent != "") {
			 var stringMessage = [];
			 stringMessage = htmlContent.split("|");
			 if (stringMessage[0] == "FAILED" || stringMessage[0] == "EXCEPTION" || stringMessage[0] == "SESSIONOUT") {
				 showMessage(true, stringMessage[1]);
			 } else {
				 if(logType=='editLog'){
					 $('#tblLeadEditLog').html(htmlContent)
					 $("#editLogsTab").css( "display", "block" );
					 $("#followupLogsTab").css( "display", "none" );
				 }else{
					 $('#tblLeadFollowLog').html(htmlContent);
					 $("#followupLogsTab").css( "display", "block" );
					 $("#editLogsTab").css( "display", "none" );
				 }
				 
			 }
			 return false;
		 }
		 return false;
	 }
 });
}

function demoRequestAccept(requestDemoId, roleModuleId, userId, controlType, demoType) {
 //console.log("leads");
 hideMessage('');
 $.ajax({
	 type : "POST",
	 contentType : "application/json",
	 url : getURLFor('leads','demo-request-accepted'),
	 data : JSON.stringify(getRequestForDemoRequestAcceptSave(requestDemoId, userId, controlType)),
	 dataType : 'json',
	 cache : false,
	 timeout : 600000,
	 success : function(data) {
		 if (data['status'] == "FAILED" || data['status'] == "EXCEPTION" || data['status'] == "SESSIONOUT") {
			 showMessage(true, data['message']);
		 } else {
			 showMessage(false, data['message']);
			 if(demoType=='pool'){
				 setTimeout(function(){callDashboardPageSchool(roleModuleId,'request-demo');}, 3000);
			 }else if(demoType=='accept'){
				 callDashboardPageSchool(roleModuleId,'accept-demo-list');
			 }
			 //$(".modal-backdrop").remove();
		 }
		 return false;
	 },
	 error : function(e) {
		 //showMessage(true, e.responseText);
		 return false;
	 }
 });
}
function getRequestForDemoRequestAcceptSave(requestDemoId, userId, controlType){
 var leadAddFormRequestDTO = {};
 var authentication = {};
 var leadCommonDTO = {};
 var leadModifyDTO = {};
 var leadDemoInfo={};
 
 leadDemoInfo['rawLeadId'] =requestDemoId;
 leadModifyDTO['controlType'] =controlType;
 leadCommonDTO['leadDemoInfo']=leadDemoInfo;
 leadCommonDTO['leadModifyDTO']=leadModifyDTO;

 authentication['hash'] = getHash();
 authentication['schoolId'] = SCHOOL_ID;
 authentication['schoolUUID'] = SCHOOL_UUID;
 authentication['userId'] = userId;
 authentication['userType'] = 'COMMON';
 leadAddFormRequestDTO['authentication'] = authentication;
 leadAddFormRequestDTO['leadCommonDTO'] = leadCommonDTO;
 return leadAddFormRequestDTO;
}


/*api-for-free-slot-list*/
function validateRequestLeadFreeSlotList(formId){
 hideMessage('');
 if ($("#"+formId+" #bookMeeetingDate").val()==null || $("#"+formId+" #bookMeeetingDate").val()=='') {
	 showMessage(true, 'Please select book meeting date');
	 return false;
 }
 return true;
}
function showLeadFreeSlotList(formId,roleModuleId) {
 hideMessage('');
 if(!validateRequestLeadFreeSlotList(formId)){
	 return false;
 }
 var meetingDate = $('#'+formId+' #bookMeeetingDate').val();
 var countryTimezoneId=$('#'+formId+' #countryTimezoneId').val();
 
 var lat = "";
 var lon = "";
 var requestType = "REQUESTDEMO";
 var book = "Y";
 
 $.ajax({
	 type : "POST",
	 contentType : 'application/json',
	 url : getURLForHTML('dashboard','lead-free-slot-list'),
	 data : JSON.stringify({moduleId:roleModuleId,date:meetingDate,countryTimezoneId:countryTimezoneId,lat:lat,lon:lon,requestType:requestType,book:book}),
	 dataType : 'html',
	 success : function(htmlContent) {
		 if(htmlContent!=""){
			 var stringMessage = [];
			 stringMessage = htmlContent.split("|");
			 if(stringMessage[0] == "FAILED" || stringMessage[0] == "EXCEPTION" || stringMessage[0] == "SESSIONOUT" ){
				 showMessage(true, stringMessage[1]);
				 $('#freeSlotList').html('');
			 } else {
				 $('#freeSlotList').html(htmlContent);
			 }
			 return false;
		 }
		 return false;
	 },
	 error : function(e) {
		 showMessage(true, e.responseText);
	 }
 });
}

function discardRawDemoData(leadsource, leadRawId, roleModuleId, userId) {
 hideMessage('');
 $.ajax({
	 type : "POST",
	 contentType : "application/json",
	 url : getURLFor('leads','lead-raw-list-discard-request'),
	 data : JSON.stringify(getRequestForDiscardRawDemoData(leadsource, leadRawId,userId)),
	 dataType : 'json',
	 cache : false,
	 timeout : 600000,
	 success : function(data) {
		 if (data['status'] == '0' || data['status'] == '2') {
			 showMessage(true, data['message']);
		 } else {
			 showMessage(false, data['message']);
			 setTimeout(function(){
				 callDashboardPageSchool(roleModuleId,'raw-lead-list');
			 }, 3000);
			 //$(".modal-backdrop").remove();
		 }
		 return false;
	 },
	 error : function(e) {
		 //showMessage(true, e.responseText);
		 return false;
	 }
 });
}
function getRequestForDiscardRawDemoData(leadsource, leadRawId,userId){
 var rawLeadDiscardRequestDTO = {};
 var authentication = {};
 var rawDiscardDTO = {};
 
 rawDiscardDTO['leadSourceId'] =leadRawId;
 rawDiscardDTO['leadSourceName'] =leadsource;
 rawDiscardDTO['userId'] =userId;
 
 authentication['hash'] = getHash();
 authentication['userId'] = userId;
 authentication['userType'] = 'COMMON';
 rawLeadDiscardRequestDTO['authentication'] = authentication;
 rawLeadDiscardRequestDTO['rawDiscardDTO'] = rawDiscardDTO;
 return rawLeadDiscardRequestDTO;
}


/*api-for-free-slot-list*/

function discardLeadsData(leadId, roleModuleId, leadFrom, leadSourceFrom, userId, newTheme, pageno, leadType, callFrom) {
 
 if(newTheme){
	 hideMessageTheme2('');
 }else{
	 hideMessage('');
 }
 
 $.ajax({
	 type : "POST",
	 contentType : "application/json",
	 url : getURLFor('leads','lead-discard-request'),
	 data : JSON.stringify(getRequestForDiscardLeadsData(leadId, leadFrom, leadSourceFrom, userId)),
	 dataType : 'json',
	 cache : false,
	 timeout : 600000,
	 success : function(data) {
		 if (data['status'] == '0' || data['status'] == '2') {
			 if(newTheme){
				 showMessageTheme2(0, data['message'],'',true);
			 }else{
				 showMessage(true, data['message']);
			 }
			 
		 } else {
			 if(newTheme){
				 showMessageTheme2(1, data['message'],'',false);
				 //location.reload();
				 if(callFrom=='new-leads'){
					getLeadDataList('advanceLeadNewSearchForm','advance-search', 'list','0', 'new', true,'', OBJECT_RIGHTS, ROLE_MODULE);
				}else{
					advanceLeadSearchStudent('advanceLeadNewSearchForm',roleModuleId, 'advance-search','list' ,pageno,'new', true,'',leadType);
				}
				}else{
				 showMessage(false, data['message']);
				 setTimeout(function(){
					 callForDashboardData('formIdIfAny','lead-list?moduleId='+roleModuleId+'&leadFrom='+leadFrom+'&clickFrom=list&currentPage=0');
				 }, 3000);
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
function getRequestForDiscardLeadsData(leadId, leadFrom, leadSourceFrom, userId){
 var leadAddFormRequestDTO = {};
 var authentication = {};
 var leadCommonDTO = {};
 var leadModifyDTO={};
 
 leadModifyDTO['leadId'] =leadId;
 leadModifyDTO['clickFrom'] =leadFrom;
 leadModifyDTO['leadSourceName'] =leadSourceFrom;
 leadCommonDTO['leadModifyDTO']=leadModifyDTO;

 authentication['hash'] = getHash();
 authentication['schoolId'] = SCHOOL_ID;
 authentication['schoolUUID'] = SCHOOL_UUID;
 authentication['userId'] = userId;
 authentication['userType'] = 'COMMON';
 leadAddFormRequestDTO['authentication'] = authentication;
 leadAddFormRequestDTO['leadCommonDTO'] = leadCommonDTO;
 return leadAddFormRequestDTO;
}


function feedbackLeadsData(leadStatus, leadId, remarks, remarkBy, userId) {
 hideMessage('');
 $.ajax({
	 type : "POST",
	 contentType : "application/json",
	 url : getURLFor('leads','lead-update-remarks'),
	 data : JSON.stringify(getRequestForRemarkLeadsData(leadStatus, leadId, remarks, remarkBy, userId)),
	 dataType : 'json',
	 cache : false,
	 timeout : 600000,
	 success : function(data) {
		 if (data['status'] == '0' || data['status'] == '2') {
			 showMessage(true, data['message']);
		 } else {
			 //showMessage(false, data['message']);
//				setTimeout(function(){
//					callForDashboardData('formIdIfAny','lead-list?moduleId='+roleModuleId+'&leadFrom='+leadFrom);
//				}, 3000);
		 }
		 return false;
	 },
	 error : function(e) {
		 //showMessage(true, e.responseText);
		 return false;
	 }
 });
}
function getRequestForRemarkLeadsData(leadStatus, leadId, remarks, remarkBy, userId){
 var leadAddFormRequestDTO = {};
 var authentication = {};
 var leadCommonDTO = {};
 
 leadCommonDTO['id'] =leadId;
 leadCommonDTO['superRemark'] =remarks;
 leadCommonDTO['callVerify'] =leadStatus;
 leadCommonDTO['superRemarkBy'] =remarkBy;
 authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
 authentication['userId'] = userId;
 authentication['userType'] = 'COMMON';
 leadAddFormRequestDTO['authentication'] = authentication;
 leadAddFormRequestDTO['leadCommonDTO'] = leadCommonDTO;
 return leadAddFormRequestDTO;
}


function getPendingNotCall(){
 $.ajax({
	 type : "POST",
	 contentType : "application/json",
	 url : getURLFor('leads','send-lead-notcall-cron'),
	 dataType : 'json',
	 cache : false,
	 timeout : 600000,
	 async:false,
	 success : function(data) {
		 if(data!=""){
			 //console.log(data.leadCommonDTO);
			 $('.custom_modal_wrapper').addClass('show-wrapper');
			 $('.custom-modal ul').empty();
			 var htmlVar="";
			 $.each(data.leadCommonDTO, function(k, v) {
				 htmlVar = htmlVar + " <li class=\"modal_item\" id=\"li"+v.leadId+"\" style=\"top:0\">";
				 htmlVar = htmlVar + " <p class=\"message\">Lead Source.: "+v.leadSourceName+"<br/>Lead no.: "+v.leadNo+"<br/>Grade: "+v.standardName+"<br/>Student name: "+v.stdFname+"<br/>Phone No: "+v.isdCode+" "+v.phoneNo+"<br/>Next Call: "+v.notSureCallscheduleDateString+"<br/></p>";
				 htmlVar = htmlVar + " <div class=\"input-wrapper\">";
				 htmlVar = htmlVar + " <button type=\"button\" class=\"submit-btn\" onclick=\"leadFollowup("+v.leadId+", 111);\">Call</button>";
				 htmlVar = htmlVar + " </div></li>";
			 });
			 $('.custom-modal ul').append(htmlVar);
			 $('.custom-modal ul').addClass('show-item');
			 return false;
		 }
	 }
 });
}


function advanceLeadSearchStudent(formId, moduleId, leadFrom, clickFrom, currentPage, typeTheme, newTheme, callbadge, leadType ) {
checkTextBox(formId);
var leadsFollowCount=0;
if($("#leadsFollowCount").val()!=undefined){
	leadsFollowCount=$("#leadsFollowCount").val();
}
if($("#"+formId+" #leadStartDateSearch").val()!='' && $("#"+formId+" #leadEndDateSearch").val()!=''){
	if($("#"+formId+" #searchDateType option:selected").val()=='' ){
		$(".leadErrorText").html('Please select type for date');
		return false;
	}
}

if(moduleId==''){
	moduleId=$("#"+formId+" #leadFromSearchModuleId").val();
}
if(clickFrom==''){
	clickFrom=$("#"+formId+" #clickFromSearch").val();
}
// if(currentPage>0){
// 	$("#"+formId+" #currentPageSearch").val(currentPage);
// }
if(currentPage==''){
	currentPage=$("#"+formId+" #currentPageSearch").val();
}
$('#leadAdvanceSearch').modal('hide');

customLoader(true);
 $.ajax({
	 type : "POST",
	 contentType : "application/json",
	 url : getURLForHTML('dashboard','advance-lead-search-content'),
	 data : JSON.stringify(getCallRequestForAdvanceLeadSearchStudent(formId, moduleId, leadFrom, clickFrom, currentPage, typeTheme, newTheme, callbadge, leadType,'Y')),
	 dataType : 'html',
	 global : false,
	 success : function(htmlContent) {
		 customLoader(false);
		 if(htmlContent!=""){
			 var stringMessage = [];
			 stringMessage = htmlContent.split("|");
			 if(stringMessage[0] == "FAILED" || stringMessage[0] == "EXCEPTION" || stringMessage[0] == "SESSIONOUT"){
				 if(stringMessage[0] == "SESSIONOUT"){
					 redirectLoginPage();
				 }else{
					 if(newTheme){
						 showMessageTheme2(1, data['message'],'',false);
					 }else{
						 showMessage(true, stringMessage[1]);
					 }
					 $('#leadAdvanceSearch').modal('show');
				 }
			 } else {
				 //$('#'+formId)[0].reset();
				 if(newTheme){
					 $('#leadAdvanceSearch').modal('hide');
					 $('#leadSourceList').html(htmlContent);
				 }else{
					 $('#advLeadSerch').modal('hide');
					 $('#leadSourceList').html(htmlContent);
				 }
				
				 $("#leadDataList .checkLead").prop('checked', false);
				
				 callTotalCountLeads(formId, moduleId, leadFrom, clickFrom, currentPage, typeTheme, newTheme, callbadge, leadType,'Y', leadsFollowCount,''); 
			 }
			 return false;
		 }
	 },
	 error : function(e) {
		if (checkonlineOfflineStatus()) {
			return;
		}
		console.log(e);
		customLoader(false);
	 }
 });
}

function getCallRequestForAdvanceLeadSearchStudent(formId, moduleId, leadFrom, clickFrom, currentPage,typeTheme, newTheme, callbadge, leadType, activeLead ){
 $(".leadErrorText").html('');
 var leadCommonDTO = {};
 var leadAddFormRequestDTO = {};
var leadsFollowCount=0;
if($("#leadsFollowCount").val()!=undefined){
	leadsFollowCount=($("#leadsFollowCount").val()!=undefined) ?$("#leadsFollowCount").val():"";
}
 var shortBy = "";
 if($("#leadsShortBy").val()!=undefined){
	shortBy = $("#leadsShortBy").val();
 }
 var shortType = "";
 if($("#leadsShortType").val()!=undefined){
	shortType = $("#leadsShortType").val();
 }
 var leadModifyDTO={};
var leadModifyDetailDTO={};
var leadStudentDetailDTO={};
var leadDemoInfo={};
var leadCallFollowupDTO={};
var leadCountDetailDTO={};
//  console.log('shortBy=> '+ shortBy+',  shortType=> ',shortType);
 leadModifyDTO['clickBy'] = callbadge;
 var strText = escapeCharacters($("#"+formId+" #leadFullSearch").val());
 //strText = strText.replace(' ', '');
 if(strText!=undefined){
	 strText = strText.replace('+', '');  
 }else{
	strText='';
 }
 leadModifyDTO['leadFullSearch'] = strText;  
 
 
 leadModifyDTO['showAllLeadsData'] = $("#"+formId+" #restrictedDataShow").val()!=undefined?$("#"+formId+" #restrictedDataShow").val():''; //'restricted';
 leadModifyDTO['leadNo'] = $("#"+formId+" #leadNoSearch").val()!=undefined?$("#"+formId+" #leadNoSearch").val():'';
 if(leadType==''){
	leadType=$("#"+formId+" #leadType").val()
 }
 
 leadModifyDTO['leadType']=leadType;
 //leadModifyDTO['leadSource'] = $("#"+formId+" #leadSourceSearch").val();
 leadModifyDTO['leadSources'] = $("#"+formId+" #leadSourceSearch").val()!=undefined?$("#"+formId+" #leadSourceSearch").val():'';
 //leadModifyDTO['assignTo'] = $("#"+formId+" #leadAssignToSearch option:selected").val();
 leadModifyDTO['assignTos'] = $("#"+formId+" #leadAssignToSearch").val()!=undefined?$("#"+formId+" #leadAssignToSearch").val():'';
 //leadModifyDTO['leadStatus'] = $("#"+formId+" #leadStatusSearch").val();
 leadModifyDTO['leadStatuses'] = $("#"+formId+" #leadStatusSearch").val();
 leadModifyDTO['leadAdderId'] = $("#"+formId+" #leadCreatedBy").val();
 if($("#"+formId+" #checkByLead").is(":checked")){
	leadModifyDetailDTO['onlyLead'] = "Y";
 }else{
	leadModifyDetailDTO['onlyLead'] = "N";
 }
 if($("#"+formId+" #checkByLeadDemo").is(":checked")){
	leadModifyDetailDTO['onlyLeadDemo'] = "Y";
 }else{
	leadModifyDetailDTO['onlyLeadDemo'] = "N";
 }
 if($("#"+formId+" #checkLeadStatus").is(":checked")){
	leadModifyDetailDTO['withLeadStatus']="Y";
 }else{
	leadModifyDetailDTO['withLeadStatus']="N";
 }
 
 

 

//  console.log("leadSources :: " + $("#"+formId+" #leadSourceSearch").val());
//  console.log("assignTos :: " + $("#"+formId+" #leadAssignToSearch").val());
//  console.log("leadStatuses :: " + $("#"+formId+" #leadStatusSearch").val());

 leadStudentDetailDTO['stdFname'] = $("#"+formId+" #leadstdfnameSearch").val();
 leadStudentDetailDTO['gurdianFname'] = $("#"+formId+" #leadParentfnameSearch").val();
 leadStudentDetailDTO['country'] = $("#"+formId+" #countryId option:selected").val();
 leadStudentDetailDTO['state'] = $("#"+formId+" #stateId option:selected").val();
 leadStudentDetailDTO['city'] = $("#"+formId+" #cityId option:selected").val();
 leadStudentDetailDTO['standard'] = $("#"+formId+" #leadGradeSearch option:selected").val();
 leadStudentDetailDTO['email'] = $("#"+formId+" #leademailIdSearch").val();
 leadStudentDetailDTO['phoneNo'] = $("#"+formId+" #phoneNoSearch").val();
 leadCallFollowupDTO['interestedFor'] = $("#"+formId+" #interestedForSearch").val();
 leadCallFollowupDTO['callStatus'] = $("#"+formId+" #callStatusSearch").val();
 leadCallFollowupDTO['followupBy'] =$("#"+formId+" #followMedSearch option:selected").val();
 leadCallFollowupDTO['toCall'] = $("#"+formId+" #callWithSearch").val();
 leadCallFollowupDTO['leadTagging'] = $("#"+formId+" #leadTagSearch").val();
 //  if($("#"+formId+" #leadStatusSearch").val()=='SCHOLARSHIP'){
	 // 	 leadCommonDTO['sbsbStatus']="Y";
	 //  }else if($("#"+formId+" #leadStatusSearch").val()=='Unassigned'){
		 // 	 //leadFrom = "RAW";
		 //  }else{
			 // 	 leadCommonDTO['sbsbStatus']="N";
			 //  }
leadModifyDetailDTO['acadmicYear'] = $("#"+formId+" #leadAcadmicYear").val()!=undefined?$("#"+formId+" #leadAcadmicYear").val():'';
leadModifyDetailDTO['priority'] = $("#"+formId+" #leadPrioritySearch").val()!=undefined?$("#"+formId+" #leadPrioritySearch").val():'';
leadModifyDetailDTO['utmSource'] = $("#"+formId+" #utmSourceSearch").val()!=undefined?$("#"+formId+" #utmSourceSearch").val():'';
//leadModifyDetailDTO['utmCampaign'] = $("#"+formId+" #leadSearchCampaign").val();
leadModifyDetailDTO['utmCampaigns'] = $("#"+formId+" #leadSearchCampaign").val()!=undefined?$("#"+formId+" #leadSearchCampaign").val():[];
leadModifyDetailDTO['leadTemplate'] = $("#"+formId+" #leadSearchTemplate").val()!=undefined?$("#"+formId+" #leadSearchTemplate").val():[];
leadModifyDetailDTO['deliveredStatus'] = $("#"+formId+" #leadSearchDeliveredStatus").val()!=undefined?$("#"+formId+" #leadSearchDeliveredStatus").val():'';

leadDemoInfo['demoAssignTo'] = $("#"+formId+" #leadDemoAssignSearch option:selected").val()!=undefined?$("#"+formId+" #leadDemoAssignSearch option:selected").val():'';

leadModifyDTO['leadStartDate'] = $("#"+formId+" #leadStartDateSearch").val()!=undefined?$("#"+formId+" #leadStartDateSearch").val():'';
leadModifyDTO['leadEndDate'] = $("#"+formId+" #leadEndDateSearch").val()!=undefined?$("#"+formId+" #leadEndDateSearch").val():'';
 

leadModifyDTO['searchDateType'] = $("#"+formId+" #searchDateType option:selected").val()!=undefined?$("#"+formId+" #searchDateType option:selected").val():'';
 if(shortBy!=undefined && shortBy!=''){
	leadModifyDTO['shortBy'] =shortBy;
 }

 if(shortType!=undefined && shortType!=''){
	leadModifyDTO['shortType'] =shortType;
 }
 
 leadCallFollowupDTO['leadFollowStatus'] =$("#"+formId+" #leadStatusSearch").val()!=undefined?$("#"+formId+" #leadStatusSearch").val().toString():'';//$("#"+formId+" #searchStatusOfLead").val();
 leadCountDetailDTO['totalCallDay'] = leadsFollowCount;//$("#"+formId+" #lastTotalCallDay").val();
 leadModifyDTO['curentStage'] = $("#"+formId+" #studentStage").val()!=undefined?$("#"+formId+" #studentStage").val():'';
 if(activeLead!=undefined && activeLead!=''){
	leadModifyDTO['activeStatus'] = activeLead;
 }else{
	leadModifyDTO['activeStatus'] = "N";
 }
	
 
 if(currentPage==undefined){
	 currentPage=0;
 }
 leadModifyDetailDTO['newTheme'] = typeTheme;
 leadModifyDetailDTO['moduleId'] = moduleId;
 leadModifyDetailDTO['schoolUUID'] = SCHOOL_UUID;
 leadModifyDTO['leadFrom']=leadFrom;
 leadModifyDTO['clickFrom']=clickFrom;//$("#"+formId+" #clickFrom").val();
 leadModifyDTO['userId']=USER_ID;
 leadModifyDTO['schoolId']=SCHOOL_ID;
 leadCommonDTO['leadModifyDTO']=leadModifyDTO;
 leadCommonDTO['leadModifyDetailDTO']=leadModifyDetailDTO;
 leadCommonDTO['leadStudentDetailDTO']=leadStudentDetailDTO;
 leadCommonDTO['leadCallFollowupDTO']=leadCallFollowupDTO;
 leadCommonDTO['leadDemoInfo']=leadDemoInfo;
 leadCommonDTO['leadCountDetailDTO']=leadCountDetailDTO;

 leadAddFormRequestDTO['leadCommonDTO'] = leadCommonDTO;
 leadAddFormRequestDTO['currentPage'] = currentPage;
 var recordsPerPage = 10;
 var leadPage = $("#leadsPagging").val()!=undefined?$("#leadsPagging").val():'10';
 if(leadPage!='' && leadPage!=undefined){
	recordsPerPage=leadPage;
 }
 leadAddFormRequestDTO['recordsPerPage']=recordsPerPage;
 //console.log(JSON.stringify(leadAddFormRequestDTO));
 //console.log(JSON.stringify(leadModifyDetailDTO));
 console.log(leadAddFormRequestDTO);
 return leadAddFormRequestDTO;
}



function advanceLeadSearchStudentReset(formId, leadType){
 $("#"+formId+" #leadNoSearch").val('').trigger('change');
 $("#"+formId+" #leadSourceSearch").val('').trigger('change');
 $("#"+formId+" #leadStatusSearch").val('').trigger('change');
 $("#"+formId+" #leadFullSearch").val('');
 
if(leadType=='B2B'){}else{
	$("#"+formId+" #leadAssignToSearch").val('').trigger('change');
	$("#"+formId+" #leadDemoAssignSearch").val('').trigger('change');
}
	$("#"+formId+" #followMedSearch").val('').trigger('change');
	$("#"+formId+" #leademailIdSearch").val('');
	$("#"+formId+" #phoneNoSearch").val('');
	$("#"+formId+" #leadstdfnameSearch").val('');
	$("#"+formId+" #leadParentfnameSearch").val('');
	$("#"+formId+" #leadGradeSearch").val(0).trigger('change');
	$("#"+formId+" #countryId").val(0).trigger('change');
	//  $("#"+formId+" #stateId").val(0).trigger('change');
	//  $("#"+formId+" #city").val(0).trigger('change');
	$("#"+formId+" #leadPrioritySearch").val('').trigger('change');
	$("#"+formId+" #callWithSearch").val('').trigger('change');
	$("#"+formId+" input[name='callBadgeSearch']").prop('checked',false);
	$("#"+formId+" #searchStatusOfLead").val('').trigger('change');
	
	$("#"+formId+" #leadStartDateSearch").val('');
	$("#"+formId+" #leadEndDateSearch").val('');
	$("#"+formId+" #leadModifyStartDateSearch").val('');
	$("#"+formId+" #leadModifyEndDateSearch").val('');
	$("#"+formId+" #leadCallStartDateSearch").val('');
	$("#"+formId+" #leadCallEndDateSearch").val('');
	$("#"+formId+" #utmSourceSearch").val('').trigger('change');
	$("#"+formId+" #clsrmBkedDateSearch").val('');
	$("#"+formId+" #clsrmBkedLastDateSearch").val('');
	$("#"+formId+" #leadSearchTemplate").val('').trigger('change');
	$("#"+formId+" #leadSearchDeliveredStatus").val('ALL').trigger('change');
	$("#"+formId+" #leadSearchCampaign").val('').trigger('change');

}




function moveLeadsData(userId, roleModuleId, leadFrom, currentPage, newTheme, objRights, roleAndModule) {
 if(newTheme){
	 hideMessageTheme2('');
 }else{
	 hideMessage('');
 }
 var counselorId=$('#moveLeadNewForm #leadDemoAssignMove').val();
 if(counselorId==null || counselorId==0 || counselorId==''){
	showMessageTheme2(0, 'Please choose counselor','',false);
	return false;
 }
 var moveRemarks=$('#moveLeadNewForm #moveRemarks').val();
 if(moveRemarks==null || moveRemarks==''){
	showMessageTheme2(0, 'Please fill Remarks','',false);
	return false;
 }
 $.ajax({
	 type : "POST",
	 contentType : "application/json",
	 url : getURLFor('leads','lead-move'),
	 data : JSON.stringify(getRequestForMoveLeadsData(userId)),
	 dataType : 'json',
	 cache : false,
	 timeout : 600000,
	 success : function(data) {
		 if (data['statusCode'] == '0' || data['statusCode'] == '2') {
			 if(newTheme){
				 showMessageTheme2(0, data['message'],'',true);
			 }else{
				 showMessage(true, data['message']);
			 }
			 
		 } else {
			if(newTheme){
				showMessageTheme2(1, data['message'],'',false);
				$("#leadNoMove").val('')
				$('#moveLeads').modal('hide');
				if(leadFrom=='new-leadmove'){
					callTotalCountLeads('advanceLeadNewSearchForm',''+roleAndModule.moduleId+'', 'advance-search',''+objRights.clickFrom+'', '0', 'new', true,'',''+objRights.leadType+'', 'Y','0','new-lead');
					getLeadDataList('advanceLeadNewSearchForm', 'advance-search', 'list', currentPage, 'new', true,'', objRights, roleAndModule);
				}else{
					setTimeout(function(){
						location.reload();
					}, 1000);
				}
			}else{
				showMessage(true, data['message']);
				$('#moveLeads').modal('hide');
				setTimeout(function(){
					callForDashboardData('formIdIfAny','lead-list?moduleId='+roleModuleId+'&leadFrom='+leadFrom+'&clickFrom=list&currentPage='+currentPage);
				}, 1500);
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
function getRequestForMoveLeadsData(userId){
 var leadAddFormRequestDTO = {};
 var authentication = {};
 var leadCommonDTO = {};
 var leadModifyDTO ={};
 var leadDemoInfo={};
var leadModifyDetailDTO={};
var leadStudentDetailDTO={};
var leadCallFollowupDTO={};
var leadCountDetailDTO={};
 var moveleadNo = $("#leadNoMove").val();
 var auth_discardPermission = $("#discardPermission").val();
 var leadWithRemark='';
 if($("#leadWithRemark").val()!=undefined){
	if($("#leadWithRemark").is(':checked')){
		leadWithRemark=$("#leadWithRemark").val();
	}
 }
 
 var leadDemoAssign; // = "N";
 /*if($("#leadDemoAssignTo").is(":checked")){
	leadDemoAssign ="Y";
 }*/
if($('input:radio[name="leadDemoAssignTo"]:checked').val() == 'withDemo'){
	leadDemoAssign='Y';	
}else if($('input:radio[name="leadDemoAssignTo"]:checked').val() == 'withoutDemo'){
	leadDemoAssign='Z';	
}else if($('input:radio[name="leadDemoAssignTo"]:checked').val() == 'OnlyDemo'){
	leadDemoAssign='O';	
}else{
	leadDemoAssign='N';
}

 if($("#leadIntrestedTo").val()=='B2B'){
	leadDemoAssign='Y';
 }
 leadModifyDTO['leadNo'] =moveleadNo.substring(1,moveleadNo.lenght);
 leadModifyDTO['assignTo'] =$("#leadDemoAssignMove").val();
 leadModifyDTO['authDiscardPermission'] =auth_discardPermission;
 leadDemoInfo['demoStatus']=leadDemoAssign;
 leadModifyDTO['intrestFor']=$("#leadIntrestedTo").val();
 leadModifyDTO['moveRemarks']=escapeCharacters($("#moveLeadNewForm #moveRemarks").val());
 leadModifyDTO['leadWithRemark']=leadWithRemark;

 leadCommonDTO['leadModifyDTO']=leadModifyDTO;
 leadCommonDTO['leadDemoInfo']=leadDemoInfo;
 leadCommonDTO['leadModifyDetailDTO']=leadModifyDetailDTO;
 leadCommonDTO['leadCallFollowupDTO']=leadCallFollowupDTO;
 leadCommonDTO['leadStudentDetailDTO']=leadStudentDetailDTO;
 leadCommonDTO['leadCountDetailDTO']=leadCountDetailDTO;

 authentication['hash'] = getHash();
 authentication['schoolId'] = SCHOOL_ID;
 authentication['schoolUUID'] = SCHOOL_UUID;
 authentication['userId'] = userId;
 authentication['userType'] = 'COMMON';
 leadAddFormRequestDTO['authentication'] = authentication;
 leadAddFormRequestDTO['leadCommonDTO'] = leadCommonDTO;
 return leadAddFormRequestDTO;
}

function verifyCallFn(leadStatus, leadId){
	 var remarks = $("#teamMemberRemark"+leadId).val();
	 var remarkBy = $("#superRemarkBy"+leadId).val();
	 if($("#teamMemberRemark"+leadId).val()==''){
		 $('.errorLeadCls').fadeIn();
		 setTimeout(function (){
			 $('.errorLeadCls').fadeOut();
		 }, 5000)
		 $('#errorMessageLead').html('Please fill team member feedback.');
		 return false;
	 }
	 feedbackLeadsData(leadStatus, leadId, remarks, remarkBy, '${userId}');
 }
 

function getCounselorReportData(assignTo) {


 
 $.ajax({
	 type : "POST",
	 url : getURLForHTML('dashboard','counselor-lead-search-content'),
	 data : "assignTo="+assignTo,
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
				 }
			 } else {
				 $('#counselorRptcontent').html(htmlContent);
				 $('#counselorReport').modal('show');
			 }
			 return false;
		 }
	 }
 });
}

function getScheduleCall(assignTo){
 customLoader(false);
 $.ajax({
	 type : "POST",
	 url : getURLForHTML('dashboard','counselor-lead-schedule'),
	 data : "assignTo="+assignTo,
	 dataType : 'html',
	 cache : false,
	 timeout : 600000,
	 async:false,
	 success : function(htmlContent) {
		 if(htmlContent!=""){
			 var stringMessage = [];
			 stringMessage = htmlContent.split("|");
			 if(stringMessage[0] == "FAILED" || stringMessage[0] == "EXCEPTION" || stringMessage[0] == "SESSIONOUT"){
				 if(stringMessage[0] == "SESSIONOUT"){
					 redirectLoginPage();
				 }else{
					 showMessage(true, stringMessage[1]);
				 }
			 } else {
				 $('#scheduleMessageContent').html(htmlContent);
				 //$("body").addClass("position-fixed");
				 $(".custom-overlay, .fixed-message-card").show();
			 }
			 return false;
		 }
	 }
 });
}

function dashboardRequestDemo(newTheme) {
 var strDate ="";
 var strDateTo ="";
 var standard ="";
 var url="";
 dateFrom= $("#formdate").val();
 dateto = $("#todate").val();
 if(dateFrom!="" && dateFrom!=undefined){
	 strDate = dateFrom.split("-")[2]+"-"+dateFrom.split("-")[0]+"-"+dateFrom.split("-")[1];
 }else{
	 strDate="";
 }
 
 if(dateto!="" && dateto!=undefined){
	 strDateTo = dateto.split("-")[2]+"-"+dateto.split("-")[0]+"-"+dateto.split("-")[1];
 }else{
	 strDateTo="";
 }
 if(newTheme){
	 standard = $("#standardDashboard").val()
	 url = 'counselor-leads-by-filter?todayDate='+strDate+'&toDate='+strDateTo+'&standard='+standard;
 }else{
	 url = 'get-request-demo-user';
 }
 var data={};
data['todayDate']=strDate;
data['toDate']=strDateTo;
data['userId']=USER_ID;
$.ajax({
	 global: false,
	 type : "POST",
	 contentType:"application/json",
	 url : getURLForHTML('dashboard',url),
	 data :JSON.stringify(data),
	 dataType : 'html',
	 cache : false,
	 timeout : 600000,
	 success : function(htmlContent) {
		 if(htmlContent!=""){
			 var stringMessage = [];
			 stringMessage = htmlContent.split("|");
			 if(stringMessage[0] == "FAILED" || stringMessage[0] == "EXCEPTION" || stringMessage[0] == "SESSIONOUT" ){
				 if(stringMessage[0] == "SESSIONOUT"){
					 redirectLoginPage();
				 }else{
					 showMessage(true, stringMessage[1]);
				 }
			 }else{
						 if(newTheme){
							 $('#counselorLeadReportTable').html(htmlContent);
						 }else{
							 $('#dashboardDemoLead').html(htmlContent);
						 }
				 
			 }
			 return false;
		 }
	 },
	 error : function(e) {
		 //customLoaderDashBoard(6, false);
		 if (checkonlineOfflineStatus()) {
			return;
		}else{
			showMessage(true, e.responseText);
		}
	 }
 });
}


function saveLeadAssignToCounselor(userId, tblId, callFrom, forUse, newTheme) {
customLoader(true);
 if(newTheme){
	 hideMessageTheme2('');
 }else{
	 hideMessage('');
 }
 $.ajax({
	 type : "POST",
	 contentType : "application/json",
	 url : getURLFor('leads','save-assign-lead-tocounselor'),
	 data : JSON.stringify(getRequestForLeadAssignToCounselor(userId, tblId, callFrom, forUse)),
	 dataType : 'json',
	 cache : false,
	 timeout : 600000,
	 success : function(data) {
		 if (data['status'] == '0' || data['status'] == '2') {
			 if(newTheme){
				 showMessageTheme2(0, data['message'],'',true);
			 }else{
				 showMessage(true, data['message']);
			 }
		 } else {
						 
			 if(newTheme){
				 showMessageTheme2(1, data['message'],'',true);
				 setTimeout(function(){
					 location.reload();
				 }, 1500);
			 }else{
				 showMessage(true, data['message']);
			 }
						 
			 
		 }
		 customLoader(false);
		 return false;
	 },
	 error : function(e) {
		customLoader(false);
		 //showMessage(true, e.responseText);
		 return false;
	 }
 });
}
function getRequestForLeadAssignToCounselor(userId, tblId, callFrom, forUse){
	var leadAddFormRequestDTO = {};
	var authentication = {};
	var leadCommonDTO = {};
	var leadLastCallDTO = [];
	var counselorLeaveDateList = [];
	if(callFrom=='dashboard'){
		var leadLastCall = {};
		leadLastCall['assignTo'] = userId;
   
		var chckValue = $("#"+tblId+" #assignActiveCouns").val();
		if(chckValue==undefined){}else{
			leadLastCall['counselorActive']=chckValue;
		}
		var startTime = $("#"+tblId+" #hoursFrom").val()+":"+$("#"+tblId+" #minsFrom").val();
		var endTime = $("#"+tblId+" #hoursTo").val()+":"+$("#"+tblId+" #minsTo").val();
		if(startTime!='undefined:undefined'){
			leadLastCall['availableStartTime']=startTime+":00";
			leadLastCall['availableEndTime']=endTime+":00";
		}
   
		var startTime2 = $("#"+tblId+" #hoursFrom2").val()+":"+$("#"+tblId+" #minsFrom2").val();
		var endTime2 = $("#"+tblId+" #hoursTo2").val()+":"+$("#"+tblId+" #minsTo2").val();
		if(startTime2!='undefined:undefined'){
		   leadLastCall['availableStartTime2']=startTime2+":00";
		   leadLastCall['availableEndTime2']=endTime2+":00";
		}
		leadLastCall['assignUserType']=forUse;
   
		leadLastCallDTO.push(leadLastCall);
	}else{
		$('#'+tblId+' tr.assignItem').each(function() { 
			var leadLastCall = {};
			var counselorLeaveDateList = [];
			var assignTo = $(this).find("td .assignto").val();
			leadLastCall['assignUserType']=forUse;
			leadLastCall['assignTo'] = $(this).find("td .assignto").val();
			leadLastCall['orderBy'] = $(this).find("td .rowindex").val();
			leadLastCall['totalAssignLead'] = $(this).find("td .totalAssignLead").val();
			leadLastCall['totalAssignDemo'] = $(this).find("td .totalAssignDemo").val();
   
			var country = $(this).find("td .leadCountry").select2('val');
			if(country!=undefined){
				leadLastCall['leadCountry'] = country.toString();
			}
			var campain = $(this).find("td .leadCampain").select2('val');
			if(campain!=undefined){
				leadLastCall['leadCampain'] = campain.toString();
			}
   
			// var grades = $(this).find("td .leadGrade").select2('val');
			// if(grades!=undefined){
			// 	leadLastCall['leadGrade'] = grades.toString();
			// }
			leadLastCall['onlyCountryChk'] = 0;
			if($(this).find("td .onlyCountryChk").is(':checked')){
				if(country!=undefined && country.length>0){
					leadLastCall['onlyCountryChk'] = 1;
				}
			}
	
			leadLastCall['onlyCampainChk'] = 0;
			if($(this).find("td .onlyCampainChk").is(':checked')){
				if(campain!=undefined && campain.length>0){
					leadLastCall['onlyCampainChk'] = 1;
				}
			}
	
		 //    if($(this).find("td .onlyGradeChk").is(':checked')){
		 // 	   leadLastCall['onlyGradeChk'] = 1;
		 //    }else{
		 // 	   leadLastCall['onlyGradeChk'] = 0;
		 //    }


			var chckValue = $(this).find("td .assignActiveCouns").val();
			if(chckValue==undefined){}else{
				leadLastCall['counselorActive']=chckValue;
			}
			if(chckValue=='Y'){
			   $('.leave_dates' + assignTo + ' li').each(function () {
				   if ($(this).find('p').attr('data-leave-type') != 'LEAVE') {
					   var dateLs = $(this).find('p').text();
					   if(dateLs!=""){
						   counselorLeaveDateList.push(dateLs);
					   }
				   }
			   });
			}
			if(counselorLeaveDateList.length>0){
				leadLastCall['counselorLeaveDate']=counselorLeaveDateList;
			}
		   leadLastCallDTO.push(leadLastCall);
		});
	}
	
	
	leadCommonDTO['leadLastCallList'] = leadLastCallDTO;
	authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userId'] = userId;
	authentication['userType'] = 'COMMON';
	leadAddFormRequestDTO['authentication'] = authentication;
	leadAddFormRequestDTO['leadCommonDTO'] = leadCommonDTO;
	return leadAddFormRequestDTO;
   }


function saveInactiveAssignCounselor(userId, checkedVal, orderBy, forUse , newTheme) {
 if(newTheme){
	 hideMessageTheme2('');
 }else{
	 hideMessage('');
 }
 
 $.ajax({
	 type : "POST",
	 contentType : "application/json",
	 url : getURLFor('leads','inactive-assign-counselor'),
	 data : JSON.stringify(getRequestForInactiveAssignCounselor(userId, checkedVal, orderBy, forUse)),
	 dataType : 'json',
	 cache : false,
	 timeout : 600000,
	 success : function(data) {
		 if (data['status'] == '0' || data['status'] == '2') {
			 if(newTheme){
				 showMessageTheme2(0, data['message'],'',true);
			 }else{
				 showMessage(true, data['message']);
			 }
		 } else {
			 if(newTheme){
				 showMessageTheme2(1, data['message'],'',true);
			 }else{
				 showMessage(true, data['message']);
			 }
			 setTimeout(function(){
				 location.reload();
			 }, 1500);
			 
		 }
		 return false;
	 },
	 error : function(e) {
		 //showMessage(true, e.responseText);
		 return false;
	 }
 });
}
function getRequestForInactiveAssignCounselor(userId, checkedVal, orderBy, forUse){
	var leadAddFormRequestDTO = {};
	var authentication = {};
	var leadCommonDTO = {};
	var leadDemoInfo={};
	var leadCallFollowupDTO={};
	var leadModifyDTO={};

	leadDemoInfo['orderBy']=orderBy;
	leadDemoInfo['counselorActivate']=checkedVal;
	leadModifyDTO['assignTo']=userId;
	leadCallFollowupDTO['assignUserType']=forUse;

	leadCommonDTO['leadDemoInfo']=leadDemoInfo;
	leadCommonDTO['leadModifyDTO']=leadModifyDTO;
	leadCommonDTO['leadCallFollowupDTO']=leadCallFollowupDTO;

	authentication['hash'] = getHash();
	authentication['schoolId'] = SCHOOL_ID;
	authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userId'] = userId;
	authentication['userType'] = 'COMMON';
	leadAddFormRequestDTO['authentication'] = authentication;
	leadAddFormRequestDTO['leadCommonDTO'] = leadCommonDTO;
	return leadAddFormRequestDTO;
}

function leadsDataLogDelete(leadId, userId) {
 hideMessage('');
 $.ajax({
	 type : "POST",
	 contentType : "application/json",
	 url : getURLFor('leads','leadlog-delete'),
	 data : JSON.stringify(getRequestForDeleteLeadsLogData(leadId, userId)),
	 dataType : 'json',
	 cache : false,
	 timeout : 600000,
	 success : function(data) {
		 if (data['status'] == '0' || data['status'] == '2') {
			 showMessageTheme2(0, data['message'],'',true);
		 } else {
			 showMessageTheme2(1, data['message'],'',false);
			 setTimeout(function(){
					 location.reload();
			 }, 1500);
			 
		 }
		 return false;
	 },
	 error : function(e) {
		 //showMessage(true, e.responseText);
		 return false;
	 }
 });
}

function getRequestForDeleteLeadsLogData(leadId,userId ){
 var leadAddFormRequestDTO = {};
 var authentication = {};
 var leadCommonDTO = {};
 
 leadCommonDTO['id'] =leadId;
 authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
 authentication['userId'] = userId;
 authentication['userType'] = 'COMMON';
 leadAddFormRequestDTO['authentication'] = authentication;
 leadAddFormRequestDTO['leadCommonDTO'] = leadCommonDTO;
 return leadAddFormRequestDTO;
}


function callStudentSignupStage(formId, userId) {
 hideMessageTheme2('');
 $.ajax({
		 type : "POST",
		 contentType : "application/json",
		 url : getURLForHTML('dashboard', 'student-enroll-stage'),
		 data : JSON.stringify(getRequestForStudentSignupStage(formId, userId)),
		 dataType : 'json',
		 cache : false,
		 timeout : 600000,
		 success : function(data) {
			 if (data['status'] == '0' || data['status'] == '2') {
				 //showMessageTheme2(false, data['message']);
			 } else {
				 //console.log(data['signupStudentList']);
				 var tblehtml="";
				 
				 for(i=0;i<data['signupStudentList'].length;i++){
					 var studentC = data['signupStudentList'][i];
					 var badge ="primary";
					 if(studentC['profileStatus']=="Completed"){
						 badge = "success";
					 }else if(studentC['profileStatus']=="Partial Entry"){
						 badge = "warning";
					 }
					 tblehtml = tblehtml + "<tr>";
					 tblehtml = tblehtml + " <td class=\"text-center text-muted\" style=\"width: 80px;\">"+i+"</td>";
					 tblehtml = tblehtml + " <td class=\"text-center\" style=\"width: 80px;\"><img width=\"40\" class=\"rounded-circle\" src=\""+studentC['photo']+"\"></td> ";
					 tblehtml = tblehtml + " <td class=\"text-left\">"+studentC['firstName']+"<br/>"+studentC['communicationEmail']+"<br/>"+studentC['contactNumber']+"</td> ";
					 tblehtml = tblehtml + " <td class=\"text-left\">"+studentC['countryName']+"/ <br/>"+studentC['countryTimezone']+"</td> ";
					 tblehtml = tblehtml + " <td class=\"text-center\"><div class=\"badge badge-pill badge-"+badge+"\">"+studentC['profileStatus']+"</div></td> ";
					 tblehtml = tblehtml + " <td class=\"text-center\">"+studentC['profileDate']+"</td> ";
					 tblehtml = tblehtml + " <td class=\"text-center\" style=\"width: 200px;\"></td> ";
					 tblehtml = tblehtml + " <td class=\"text-center\"> ";
					 tblehtml = tblehtml + " <div role=\"group\" class=\"btn-group-sm btn-group\"> ";
					 tblehtml = tblehtml + " <button class=\"btn-shadow btn btn-primary\">View</button></div></td> ";
					 tblehtml = tblehtml + " </tr> ";
				 }
				 $('#todyEnrollStatusTbody').html(tblehtml);
			 }
		 },
			 error : function(e) {
				 console.log(e);
			 }
		 });
}
function getRequestForStudentSignupStage(formId, userId) {
 request = {};
 authentication={};
 authentication['hash'] = getHash();
 authentication['schoolId'] = SCHOOL_ID;
 authentication['schoolUUID'] = SCHOOL_UUID;
 authentication['userId']=userId;
 request['authentication'] = authentication;
 return request;
}

function callDemoCountDetails(formId, userId, newTheme) {
 $.ajax({
		 type : "POST",
		 contentType : "application/json",
		 url : getURLForHTML('dashboard', 'get-demo-count-report'),
		 data : JSON.stringify(getRequestForDemoCountDetails(formId, userId)),
		 dataType : 'json',
		 cache : false,
		 timeout : 600000,
		 success : function(data) {
			 if (data['status'] == '0' || data['status'] == '2') {
				 //showMessageTheme2(false, data['message']);
			 } else {
				 //console.log("demoCountList",data['demoCountList']);
				 if(data['demoCountList']!=null){
					 for(i=0;i<data['demoCountList'].length;i++){
						 var demoCount = data['demoCountList'][i];
						 $("#totalDemoCounselor").html(demoCount['totalDemo']);
						 $("#todayDemoCounselor").html(demoCount['todayDemo']);
						 $("#totalAcceptedCounselor").html(demoCount['accepted']);
						 $("#totalCompleteCounselor").html(demoCount['demoYes']);
						 $("#todayCompleteCounselor").html(demoCount['todayDemoYes']);
						 $("#totalInCompleteCounselor").html(demoCount['demoNo']);
						 $("#todayInCompleteCounselor").html(demoCount['todayDemoNo']);
						 $("#totalRescheduleCounselor").html(demoCount['totalReschedule']);
						 $("#totalInvalidCounselor").html(demoCount['totalInvalid']);
						 $("#demoConversionCounselor").html(demoCount['demoConversion']);
					 }
				 }
				 
				 
			 }
		 },
			 error : function(e) {
				 console.log(e);
			 }
		 });
}
function getRequestForDemoCountDetails(formId, userId) {
 request = {};
 authentication={};
 authentication['hash'] = getHash();
 authentication['schoolId'] = SCHOOL_ID;
 authentication['schoolUUID'] = SCHOOL_UUID;
 authentication['userId']=userId;
 request['authentication'] = authentication;
 return request;
}

function callLeadCountDetails(formId, userId) {
 $.ajax({
		 type : "POST",
		 contentType : "application/json",
		 url : getURLForHTML('dashboard', 'get-lead-count-report'),
		 data : JSON.stringify(getRequestForLeadCountDetails(formId, userId)),
		 dataType : 'json',
		 cache : false,
		 timeout : 600000,
		 success : function(data) {
			 if (data['status'] == '0' || data['status'] == '2') {
				 //showMessageTheme2(false, data['message']);
			 } else {
				 //console.log("demoCountList",data['demoCountList']);
				 if(data['leadCountList']!=null){
					 for(i=0;i<data['leadCountList'].length;i++){
						 var demoCount = data['leadCountList'][i];
						 $("#totalLeadCounselor").html(demoCount['totalLead']);
						 $("#todayLeadCounselor").html(demoCount['todayLead']);
						 $("#positiveLeadCounselor").html(demoCount['positiveLead']);
						 $("#todayPositiveLeadCounselor").html(demoCount['todayPositiveLead']);
						 $("#scrapLeadCounselor").html(demoCount['scrap']);
						 $("#leadConversionCounselor").html(demoCount['leadConversion']);

						 $("#totalEnrollCounselor").html(demoCount['converted']);
						 $("#todayEnrollCounselor").html(demoCount['todayConverted']);
						 $("#totalBookedCounselor").html(demoCount['reserved']);
						 $("#todayBookedCounselor").html(demoCount['todayReserved']);
						 $("#totalCliCounselor").html(demoCount['totalCli']);
						 $("#todayCliCounselor").html(demoCount['todayCli']);
						 $("#conversionCounselor").html(demoCount['conversionRate']);


					 }
				 }
				 
				 
			 }
		 },
			 error : function(e) {
				 console.log(e);
			 }
		 });
}
function getRequestForLeadCountDetails(formId, userId) {
 request = {};
 authentication={};
 authentication['hash'] = getHash();
 authentication['schoolId'] = SCHOOL_ID;
 authentication['schoolUUID'] = SCHOOL_UUID;
 authentication['userId']=userId;
 request['authentication'] = authentication;
 return request;
}

var	itiAltPhoneNumber;
var	itiPhoneNumber;
function callLeadsByLeadId(formId, leadId, userId, controlType, modalId,leadType, columnPermission) {
	//console.log("callLeadsByLeadId",columnPermission);
	if(columnPermission=='true'){
		$(".b2cLeadsource").show();
		$(".b2bLeadsource").show();
		$(".b2bLeadstatus").show();
		$(".b2cLeadstatus").show();
	}else{
		if(controlType=='addLeadClone' || controlType=='add'){
			$(".b2cLeadsource").show();
			$(".b2bLeadsource").show();
			$(".b2bLeadstatus").show();
			$(".b2cLeadstatus").show();
		}else{
			$(".b2cLeadsource").hide();
			$(".b2bLeadsource").hide();
			$(".b2bLeadstatus").hide();
			$(".b2cLeadstatus").hide();
		}
	}
	var lfindstr = leadType.includes("-");
	var splitLeadType=leadType;
	if(lfindstr){
		splitLeadType=leadType.split("-")[0];
		leadType=leadType.split("-")[1];
		callLeadStatusList(formId,leadType,'leadStatus', false);
	}
 	$.ajax({
		 type : "POST",
		 contentType : "application/json",
		 url : getURLForHTML('/api/v1/leads', 'get-lead-data-byid'),
		 data : JSON.stringify(getRequestForLeadsByLeadId(formId, leadId, userId,splitLeadType, controlType)),
		 dataType : 'json',
		 cache : false,
		 timeout : 600000,
		 success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				 showMessage(true, data['message']);
			 } else {
				$("#"+modalId).modal({ backdrop: 'static', keyboard: false });
				 //console.log(data['leadDashboardCommon']['leadCommonDTO']);
				 if(controlType=='add'){
					$("#leadFormText").text("Add new lead");
				 }else if(controlType=='addLeadClone'){
					$("#leadFormText").text("Add clone lead");
				 }else if(controlType=='edit'){
					$("#leadFormText").text("Update lead");
				 }
				 callLeadStatusList(''+formId+'',leadType,'leadStatus', false);
				 callLeadSourceList(''+formId+'',leadType,'leadSource', true);
				 callPCountries(''+formId+'', 0, 'countryId');
				 getTggingMasterList(''+formId+'', 'leadTagging');
				 $("#"+formId+" #leadTagging").select2({
					theme:"bootstrap4",
					dropdownParent:"#"+formId
				});

			
				if(data['leadDashboardCommon']!=null){
					if(data['leadDashboardCommon']['leadCommonDTO']!=null){
					   var leadDemo = data['leadDashboardCommon']['leadCommonDTO'][0];
					   if(controlType=='addLeadClone'){
							$("#"+formId+" #parentleadId").val(leadDemo.leadModifyDTO.leadId);
							$("#"+formId+" #academicId").val(leadDemo.leadModifyDTO.academicId);
						}else{
							$("#"+formId+" #leadId").val(leadDemo.leadModifyDTO.leadId);
							$("#"+formId+" #academicId").val(leadDemo.leadModifyDTO.academicId);
							$("#"+formId+" #leadNo").val(leadDemo.leadModifyDTO.leadNo);
							$("#"+formId+" #leadNoText").html(leadDemo.leadModifyDTO.leadNo);
							$("#"+formId+" #rawLeadId").val(leadDemo.leadDemoInfo.rawLeadId);
							$("#"+formId+" #relationType").val(leadDemo.leadStudentDetailDTO.relationType);
						}
						setTimeout(function() {
							$("#"+formId+" #leadSource").val(leadDemo.leadModifyDTO.leadSource).trigger("change");
						}, 1000);
						
						$("#"+formId+" #leadGrade").val(leadDemo.leadStudentDetailDTO.standard);
						$("#"+formId+" #leadDOB").val(leadDemo.leadStudentDetailDTO.stdDob);
						$("#"+formId+" #leadGender").val(leadDemo.leadStudentDetailDTO.gender);
						$("#"+formId+" #leademailId").val(leadDemo.leadStudentDetailDTO.email);
						$("#"+formId+" #phoneNo").val(leadDemo.leadStudentDetailDTO.phoneNo);
						$("#"+formId+" #leadTagging").val(leadDemo.leadCallFollowupDTO.leadTagging).trigger('change');
						$("#"+formId+" #leademailAlternet").val(leadDemo.leadStudentDetailDTO.emailAlternet);
						//$("#"+formId+" #leadType").val(leadType);
						//if(leadType=='B2B'){
						   if(leadDemo.leadStudentDetailDTO.isdCountryCode==null || leadDemo.leadStudentDetailDTO.isdCountryCode==''){
							   $('#'+formId+' #pCountryCode').val('us');
							   $('#'+formId+' #isdCode').val('1');
						   }else{
							   $("#"+formId+" #pCountryCode").val(leadDemo.leadStudentDetailDTO.isdCountryCode);
							   $("#"+formId+" #isdCode").val(leadDemo.leadStudentDetailDTO.isdCode);
						   }
						   if(leadDemo.leadStudentDetailDTO.isdCountryCodeAlter==null || leadDemo.leadStudentDetailDTO.isdCountryCodeAlter==''){
							   $('#'+formId+' #pCountryCodeAlter').val('us');
							   $('#'+formId+' #isdCodeAlter').val('1');
						   }else{
							   $("#"+formId+" #pCountryCodeAlter").val(leadDemo.leadStudentDetailDTO.isdCountryCodeAlter);
							   $("#"+formId+" #isdCodeAlter").val(leadDemo.leadStudentDetailDTO.isdCodeAlter);
						   }
						   
						   if (itiPhoneNumber && typeof itiPhoneNumber.destroy === 'function') {
							   itiPhoneNumber.destroy();
						   }
						   var phoneNumber = document.querySelector("#"+formId+" #phoneNo");
						   itiPhoneNumber = window.intlTelInput(phoneNumber, {
							   //separateDialCode: true,
						   });
						   itiPhoneNumber.setCountry($('#'+formId+' #pCountryCode').val());
						   phoneNumber.addEventListener('countrychange', function(e) {
							   //console.log("itiPhone=>", itiPhoneNumber.getSelectedCountryData());
							   $('#'+formId+' #pCountryCode').val(itiPhoneNumber.getSelectedCountryData().iso2);
							   $('#'+formId+' #isdCode').val(itiPhoneNumber.getSelectedCountryData().dialCode);
						   });
						   
						   if (itiAltPhoneNumber && typeof itiAltPhoneNumber.destroy === 'function') {
							   itiAltPhoneNumber.destroy();
						   }
						   var altPhoneNumber = document.querySelector("#"+formId+" #phoneNoAlter");
						   itiAltPhoneNumber= window.intlTelInput(altPhoneNumber, {
							   //separateDialCode: true,
						   });
						   altPhoneNumber.addEventListener('countrychange', function(e) {
							   //console.log("itiPhone=>", itiAltPhoneNumber.getSelectedCountryData());
							   $('#'+formId+' #pCountryCodeAlter').val(itiAltPhoneNumber.getSelectedCountryData().iso2);
							   $('#'+formId+' #isdCodeAlter').val(itiAltPhoneNumber.getSelectedCountryData().dialCode);
						   });
						   if(leadDemo.leadStudentDetailDTO.isdCountryCodeAlter!=null || leadDemo.leadStudentDetailDTO.isdCountryCodeAlter !=''){
							   itiAltPhoneNumber.setCountry($('#'+formId+' #pCountryCodeAlter').val());
						   }
						   $("#"+formId+" #countryId").val(leadDemo.leadStudentDetailDTO.country).trigger('change');
						// }else{
						//    $("#"+formId+" #isdCode").val(leadDemo.leadStudentDetailDTO.isdCode).trigger('change');
						// 	$("#"+formId+" #isdCodeAlter").val(leadDemo.leadStudentDetailDTO.isdCodeAlter).trigger('change');
						// }
						
						$("#"+formId+" #phoneNoAlter").val(leadDemo.leadStudentDetailDTO.phoneNoAlter);
						
						$("#"+formId+" #leadstdfname").val(leadDemo.leadStudentDetailDTO.stdFname);
						$("#"+formId+" #leadstdmname").val(leadDemo.leadStudentDetailDTO.stdMname);
						$("#"+formId+" #leadstdlname").val(leadDemo.leadStudentDetailDTO.stdLname);
						$("#"+formId+" #leadGender").val(leadDemo.leadStudentDetailDTO.gender);
						$("#"+formId+" #leadGuardfname").val(leadDemo.leadStudentDetailDTO.gurdianFname);
						$("#"+formId+" #leadGuardmname").val(leadDemo.leadStudentDetailDTO.gurdianMname);
						$("#"+formId+" #leadGuardlname").val(leadDemo.leadStudentDetailDTO.gurdianLname);
						//$("#"+formId+" #countryId").val(leadDemo.leadStudentDetailDTO.country);
						 
						
						$("#"+formId+" #leadPin").val(leadDemo.leadStudentDetailDTO.pincode);
						$("#"+formId+" #leadAdd").val(leadDemo.leadStudentDetailDTO.address);
						
						//if(leadType=='B2B'){
							//$("#"+formId+" #leadAssignTo").val(leadDemo.leadModifyDTO.assignTo).trigger('change');
						//$("#"+formId+" #leadStatus").val(leadDemo.leadModifyDTO.leadStatus).trigger('change');
						// }else{
						//    $("#"+formId+" #leadAssignTo").val(leadDemo.leadModifyDTO.assignTo)
						//    $("#"+formId+" #leadStatus").val(leadDemo.leadModifyDTO.leadStatus);
						// }
						$("#"+formId+" #leadSupportTo").val(leadDemo.leadStudentDetailDTO.relationType);
						$("#"+formId+" #countrolType").val(controlType);
				   }

				    
			
					$("#"+formId+" #countryId").on("change",function(){
						callStates(''+formId+'', this.value, 'countryId');
					});
					$("#"+formId+" #stateId").on("change",function(){
						callCities(''+formId+'', this.value, 'stateId');
					});
					callLeadAssignUserList(''+formId+'',leadType,'leadAssignTo', true, columnPermission, USER_ID, false);
					setTimeout(function() {
						$("#"+formId+" #leadAssignTo").val(data.leadDashboardCommon.leadCommonDTO[0].leadModifyDTO.assignTo).trigger('change');
						$("#"+formId+" #leadStatus").val(leadDemo.leadModifyDTO.leadStatus).trigger('change');
					}, 1000);
					setTimeout(function () {
						callStates(formId, leadDemo.leadStudentDetailDTO.country, 'countryId');
						$("#"+formId+" #stateId").val(leadDemo.leadStudentDetailDTO.state).trigger('change');
					  }, 1000);
					setTimeout(function () {
						callCities(formId, leadDemo.leadStudentDetailDTO.state, 'stateId');
						$("#"+formId+" #cityId").val(leadDemo.leadStudentDetailDTO.city).trigger('change');
					  }, 1000); 
				    //console.log('renderDocumentContent', userId, leadId, 'LEAD-DOC');
					$("#"+formId+" #leadSource").select2({
						theme:"bootstrap4",
						dropdownParent:"#"+formId+""
					});
					$("#"+formId+" #leadStatus").select2({
						theme:"bootstrap4",
						dropdownParent:"#"+formId+""
					});
					$("#"+formId+" #leadAssignTo").select2({
						theme:"bootstrap4",
						dropdownParent:"#"+formId+""
					});
				
					$("#"+formId+" #countryId").select2({
							theme:"bootstrap4",
							dropdownParent:"#"+formId+""
					});	
					$("#"+formId+" #stateId").select2({
						theme:"bootstrap4",
						dropdownParent:"#"+formId+""
					});
					$("#"+formId+" #cityId").select2({
						theme:"bootstrap4",
						dropdownParent:"#"+formId+""
					});

					$("#"+formId+" #leadGrade").select2({
						theme:"bootstrap4",
						dropdownParent:"#"+formId+""
					});
					
					renderDocumentContent(userId, leadId, 'LEAD-DOC');
					showAddMoreBtnArray=[];
					$.each($('.upload-docs-wrapper[style*="display: none"]'), function(){showAddMoreBtnArray.push(parseInt($(this).attr("index")))});
				}
			 }
		 },
		error : function(e) {
			console.log(e);
		}
	});
}

function getRequestForLeadsByLeadId(formId, leadId, userId, leadType, controlType) {
 var leadAddFormRequestDTO = {};
 var authentication = {};
 var leadCommonDTO = {};
 var leadModifyDTO={};
 leadModifyDTO['isUserWise'] = false;
 leadModifyDTO['isLeadSearch'] = true;
 leadModifyDTO['leadId'] = leadId;
 leadModifyDTO['clickFrom'] = 'ByIdSearch';
 leadModifyDTO['schoolId'] = SCHOOL_ID;
 leadModifyDTO['leadType'] = leadType;
 leadModifyDTO['controlType']=controlType;
 
 leadCommonDTO['leadModifyDTO']=leadModifyDTO;

 authentication['hash'] = getHash();
 authentication['schoolId'] = SCHOOL_ID;
 authentication['schoolUUID'] = SCHOOL_UUID;
 authentication['userId'] = USER_ID;
 authentication['userType'] = 'COMMON';
 leadAddFormRequestDTO['authentication'] = authentication;
 leadAddFormRequestDTO['leadCommonDTO'] = leadCommonDTO;
 return leadAddFormRequestDTO;
}

function callLeadCountGradeWiseDetails(formId, userId) {
 $.ajax({
		 type : "POST",
		 contentType : "application/json",
		 url : getURLForHTML('dashboard', 'get-lead-count-gradewise-report'),
		 data : JSON.stringify(getRequestForLeadCountGradeWiseDetails(formId, userId)),
		 dataType : 'json',
		 cache : false,
		 timeout : 600000,
		 success : function(data) {
			 if (data['status'] == '0' || data['status'] == '2') {
				 //showMessageTheme2(false, data['message']);
			 } else {
				 //console.log("leadCountGradewise",data['leadCountGradewise']);
				 if(data['leadCountGradewise']!=null){
					 var htmlGradeWise = "";
					 htmlGradeWise = htmlGradeWise + " <thead><tr><th>#</th> ";
					 for(i=0;i<data['leadCountGradewise']['assignGrade'].length;i++){
						 var demoCountGrade = data['leadCountGradewise']['assignGrade'][i];
						 htmlGradeWise = htmlGradeWise + " <th><b>"+demoCountGrade['standardName']+"</b></th> ";
					 }
					 htmlGradeWise = htmlGradeWise + " </tr> </thead> ";
					 htmlGradeWise = htmlGradeWise + " <tbody><tr><td><b>Total Lead</b></td> ";
					 for(i=0;i<data['leadCountGradewise']['assignGrade'].length;i++){
						 var demoCountGrade = data['leadCountGradewise']['assignGrade'][i];
						 htmlGradeWise = htmlGradeWise + " <td><a href=\"javascript:void(0);\" onclick=\"callLeadUrl('gradewisetotal-"+demoCountGrade['standardId']+"');\" class=\"full not-underline\">"+demoCountGrade['leadCount']+"</a></td> ";
					 }
					 htmlGradeWise = htmlGradeWise + " </tr><tr><td><b>Converted Lead</b></td> ";
					 for(i=0;i<data['leadCountGradewise']['assignGrade'].length;i++){
						 var demoCountGrade = data['leadCountGradewise']['assignGrade'][i];
						 htmlGradeWise = htmlGradeWise + " <td><a href=\"javascript:void(0);\" onclick=\"callLeadUrl('cnvertgrdewisetotal-"+demoCountGrade['standardId']+"');\" class=\"full not-underline\">"+demoCountGrade['tutionCount']+"</a></td> ";
					 }
					 htmlGradeWise = htmlGradeWise + " </tr> </tbody> ";
				 }
				 $("#dashboardGradeAssign").html(htmlGradeWise);
			 }
		 },
			 error : function(e) {
				 console.log(e);
			 }
		 });
}
function getRequestForLeadCountGradeWiseDetails(formId, userId) {
 request = {};
 authentication={};
 authentication['hash'] = getHash();
 authentication['schoolId'] = SCHOOL_ID;
 authentication['schoolUUID'] = SCHOOL_UUID;
 authentication['userId']=userId;
 request['authentication'] = authentication;
 return request;
}


function callGetOpenFollowup(formId, leadId, userId, controlType, currentPage, modalId, leadType, epdetailUpdateStatus) {
//console.log(leadId);


 $("#"+formId+" #epdetailStatus").val(epdetailUpdateStatus);
 $("#"+formId+" #leadId").val(leadId);
 $("#"+formId+" #currentPage").val(currentPage);
 $("#"+modalId).modal({ backdrop: 'static', keyboard: false });

 $('.tentative_date').css( "display", "none" );
 $('#'+formId+' .meetingSlotsDate').css( "display", "none" );
 $('#'+formId+' #bookMeeetingDate').val("");
 $('#'+modalId+' #freeSlotList').html('');
 $('.errorLeadCls').css( "display", "none" );
 $(".followCall").css({'display':'none'});
 $('#errorMessageLead').html('');
 $("#Hot").prop('checked',false)
 $("#Cold").prop('checked',false)
 $("#Wram").prop('checked',false)
 $(".leadTypeCategory").removeClass('active');


 


 $.ajax({
		 type : "POST",
		 contentType : "application/json",
		 url : getURLForHTML('/api/v1/leads', 'get-lead-data-byid'),
		 data : JSON.stringify(getRequestForGetOpenFollowup(formId, leadId, userId, leadType, epdetailUpdateStatus)),
		 dataType : 'json',
		 cache : false,
		 timeout : 600000,
		 success : function(data) {
			 if (data['status'] == '0' || data['status'] == '2') {
				 showMessage(true, data['message']);
			 } else {
				 if(data['leadDashboardCommon']['leadCommonDTO']!=null){
					//console.log(data['leadDashboardCommon']['leadCommonDTO'][0]['leadLastCallList'])
					 var leadDemo = data['leadDashboardCommon']['leadCommonDTO'][0];

					 if(leadType=='B2B'){
						var name = leadDemo.leadStudentDetailDTO.stdFname+' '+leadDemo.leadStudentDetailDTO.stdMname+' '+leadDemo.leadStudentDetailDTO.stdLname
						 $("#"+formId+" #callWith").val(leadDemo.leadStudentDetailDTO.stdFname);
						 $("#notSureHours").val(leadDemo.leadCallFollowupDTO.callscheduleHourse);
						 $("#notSureMins").val(leadDemo.leadCallFollowupDTO.callscheduleMin);
						 $("#notSureAMPM").val(leadDemo.leadCallFollowupDTO.callAMPM);
					}else{
						$("#"+formId+" #followMed").val(leadDemo.leadCallFollowupDTO.followupBy);
						$("#"+formId+" #callWith").val(leadDemo.leadCallFollowupDTO.toCall).trigger('change');
						//$("#"+formId+" #selectStatusOfLead").val(leadDemo.leadCallFollowupDTO.leadFollowStatus);
						//$("#"+formId+" #leadStatus").val(leadDemo.leadModifyDTO.leadStatus).trigger('change');
						if(leadDemo.leadModifyDetailDTO.leadCategory=='Hot'){
							$("#Hot").trigger('click')
						}else if(leadDemo.leadModifyDetailDTO.leadCategory=='Cold'){
							$("#Cold").trigger('click')
						}else if(leadDemo.leadModifyDetailDTO.leadCategory=='Warm'){
							$("#Warm").trigger('click')
						}
					}
					callLeadStatusList(''+formId+'',''+leadType+'','leadStatus', false);
					$("#"+formId+" #leadStatus").select2({
						theme:"bootstrap4",
						dropdownParent:"#"+formId
					});
					if(data['leadDashboardCommon']['leadCommonDTO'][0]['leadLastCallList']!=null){
						 var leadLastCallList = data['leadDashboardCommon']['leadCommonDTO'][0]['leadLastCallList'];
						 var strLeadCall = "";
						 var int=1;
						 var followupBy="";
						 var leadFollowStatus ="";
						 var leadStatus="";
						 for(i=0;i<leadLastCallList.length;i++){
							 strLeadCall =strLeadCall + "<tr>";
							 strLeadCall =strLeadCall + " <td>"+int+"</td>";
							 strLeadCall =strLeadCall + " <td>"+leadLastCallList[i]['followupBy']+" | "+leadLastCallList[i]['callscheduleDateString']+"</td>";
							 strLeadCall =strLeadCall + " <td>"+leadLastCallList[i]['nextCallscheduleDateString']+"</td>";
							 strLeadCall =strLeadCall + " <td>"+leadLastCallList[i]['toCall']+" | "+leadLastCallList[i]['leadFollowStatus']+"</td>";
							 strLeadCall =strLeadCall + " <td>"+leadLastCallList[i]['followRemarks']+"</td>";
							 strLeadCall =strLeadCall + "</tr>";
							 int = int+1;
						 }
						 
						 $("#followupHistory").html(strLeadCall);
					}	
				}
					$('#'+formId+' #notSureCallscheduleDate').datepicker({
						container: '#'+formId,
						autoclose: true,
						format: 'mm-dd-yyyy',
					});
					$("#"+formId+" .nextCustomDate").css({'display':'none'});
					$("#"+formId+" #nextDate").on('change',function(){
						if($("#"+formId+" #nextDate").val()=='CUSTOM'){
							$("#"+formId+" .nextCustomDate").css({'display':'block'});
						}else{
							$("#"+formId+" #notSureCallscheduleDate").val('');
							$("#"+formId+" .nextCustomDate").css({'display':'none'});
						}
						if($("#"+formId+" #nextDate").val()!=''){
							if($("#"+formId+" #nextDate").val()!='NO FOLLOWUP'){
								$("#"+formId+" .followCall").css({'display':'block'});
							}else{
								$("#"+formId+" .followCall").css({'display':'none'});
							}
						}else{
							$("#"+formId+" .followCall").css({'display':'none'});
						}

					});
			 }
		 },
			 error : function(e) {
				 console.log(e);
			 }
		 });
}

function getRequestForGetOpenFollowup(formId, leadId, userId, leadType) {
 var leadAddFormRequestDTO = {};
 var authentication = {};
 var leadCommonDTO = {};
 var leadModifyDTO={};

 leadModifyDTO['isUserWise'] = false;
 leadModifyDTO['isLeadSearch'] = true;
 leadModifyDTO['leadId'] = leadId;
 leadModifyDTO['clickFrom'] = 'ByIdSearch';
 leadModifyDTO['schoolId'] = SCHOOL_ID;
 leadModifyDTO['leadType'] = leadType;
 leadCommonDTO['leadModifyDTO']=leadModifyDTO;

 authentication['hash'] = getHash();
 authentication['schoolId'] = SCHOOL_ID;
 authentication['schoolUUID'] = SCHOOL_UUID;
 authentication['userId'] = USER_ID;
 authentication['userType'] = 'COMMON';
 leadAddFormRequestDTO['authentication'] = authentication;
 leadAddFormRequestDTO['leadCommonDTO'] = leadCommonDTO;
 return leadAddFormRequestDTO;
}


function openPopupAssignToCounselor(leadId, assignTo, userId, statusPing ,newTheme, leadType) {
 if(newTheme){
	 hideMessageTheme2('');
 }else{
	 hideMessage('');
 }
 
 $.ajax({
	 type : "POST",
	 contentType : "application/json",
	 url : getURLFor('leads','popup-opento-counselor'),
	 data : JSON.stringify(getRequestForOpenPopupAssignToCounselor(leadId, assignTo, userId, statusPing, newTheme, leadType)),
	 dataType : 'json',
	 cache : false,
	 timeout : 600000,
	 success : function(data) {
		 if (data['status'] == '0' || data['status'] == '2') {
			 if(statusPing>0){
				 if(newTheme){
					 showMessageTheme2(0, data['message'],'',true);
				 }else{
					 showMessage(true, data['message']);
				 }
			 }
		 } else {
			 if(statusPing>0){
				 if(newTheme){
					 showMessageTheme2(1, data['message'],'',true);
				 }else{
					 showMessage(true, data['message']);
				 }
				 // setTimeout(function(){
				 // 	location.reload();
				 // }, 1500);
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
function getRequestForOpenPopupAssignToCounselor(leadId, assignTo, userId, statusPing, newTheme, leadType){
 var leadAddFormRequestDTO = {};
 var authentication = {};
 var leadCommonDTO = {};
 var leadModifyDTO={};
var leadModifyDetailDTO={};
var leadStudentDetailDTO={};
var leadDemoInfo={};
var leadCallFollowupDTO={};
var leadCountDetailDTO={};
leadModifyDTO['assignTo']=assignTo;
leadModifyDTO['leadId']=leadId;
leadModifyDTO['leadType']=leadType;
leadDemoInfo['counselorActivate']=statusPing;
leadCommonDTO['leadModifyDTO']=leadModifyDTO;
leadCommonDTO['leadModifyDetailDTO']=leadModifyDetailDTO;
leadCommonDTO['leadDemoInfo']=leadDemoInfo;
leadCommonDTO['leadStudentDetailDTO']=leadStudentDetailDTO;
leadCommonDTO['leadCallFollowupDTO']=leadCallFollowupDTO;
leadCommonDTO['leadCountDetailDTO']=leadCountDetailDTO;

 authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;
 authentication['schoolUUID'] = SCHOOL_UUID;
 authentication['userId'] = userId;
 authentication['userType'] = 'COMMON';
 leadAddFormRequestDTO['authentication'] = authentication;
 leadAddFormRequestDTO['leadCommonDTO'] = leadCommonDTO;
 return leadAddFormRequestDTO;
}


function callLeadDemoCountDetails(formId, userId,newTheme) {
 $.ajax({
		 type : "POST",
		 contentType : "application/json",
		 url : getURLForHTML('dashboard', 'get-lead-demo-count'),
		 data : JSON.stringify(getRequestForLeadDemoCountDetails(formId, userId)),
		 dataType : 'json',
		 cache : false,
		 timeout : 600000,
		 success : function(data) {
			 if (data['status'] == '0' || data['status'] == '2') {
				 //showMessageTheme2(false, data['message']);
			 } else {
				 //console.log("demoCountList",data['demoCountList']);
				 if(data['leadDemoCountList']!=null){
					 for(i=0;i<data['leadDemoCountList'].length;i++){
						 var demoCount = data['leadDemoCountList'][i];
						 $("#totalEnrollCounselor").html(demoCount['converted']);
						 $("#demoConversionCounselor").html(demoCount['conversionRate']);
						 $("#totalCompleteCounselor").html(demoCount['demoYes']);
						 $("#totalRescheduleCounselor").html(demoCount['totalReschedule']);
						 $("#totalInCompleteCounselor").html(demoCount['demoNo']);
						 $("#totalBookedCounselor").html(demoCount['reserved']);
						 $("#totalCliCounselor").html(demoCount['cli']);
						 $("#totalInvalidCounselor").html(demoCount['scrap']);
						 $("#totalFollowup").html(demoCount['noOfCall']);
					 }
				 }
				 
				 
			 }
		 },
			 error : function(e) {
				 console.log(e);
			 }
		 });
}
function getRequestForLeadDemoCountDetails(formId, userId) {
	leadModifyDTO={}
 	leadCommonDTO = {};
 	leadModifyDTO['schoolId'] = SCHOOL_ID;
 	leadModifyDTO['userId']=userId;
 	leadModifyDTO['leadStartDate']=$("#demoStartDate").val();
 	leadModifyDTO['leadEndDate']=$("#demoEndDate").val();
	leadCommonDTO['leadModifyDTO']=leadModifyDTO;
 	return leadCommonDTO;
}


function getPingPopupScheduleCall(assignTo){
 customLoader(false);
 //"assignTo="+assignTo,
 $.ajax({
	 type : "POST",
	 contentType : 'application/json',
	 url : getURLForHTML('dashboard','counselor-ping-lead-schedule'),
	 data : JSON.stringify({"assignTo":assignTo}),
	 dataType : 'html',
	 cache : false,
	 timeout : 600000,
	 async:false,
	 success : function(htmlContent) {
		//console.log(htmlContent);
		if(htmlContent=='\n\n'){
			htmlContent = htmlContent.replace("\n\n","");
		}
		 if(htmlContent!=""){
			 var stringMessage = [];
			 stringMessage = htmlContent.split("|");
			 if(stringMessage[0] == "FAILED" || stringMessage[0] == "EXCEPTION" || stringMessage[0] == "SESSIONOUT"){
				 if(stringMessage[0] == "SESSIONOUT"){
					 redirectLoginPage();
				 }else{
					 showMessage(true, stringMessage[1]);
				 }
			 } else {
				 $('#schedulePingMessageContent').html(htmlContent);
				 //$("body").addClass("position-fixed");
				 $(".custom-overlay, .fixed-message-card").show();
			 }
			 return false;
		 }
	 }
 });
}


function callforLeadCalculate(formId, dataType ,newTheme) {
	if($("#"+formId+" #targetLead").val()==''){
		showMessageTheme2(1, 'Please fill target','',true);
		return false;
	}
	if($("#"+formId+" #startDate").val()==''){
		showMessageTheme2(1, 'Please choose start date','',true);
		return false;
	}
	if($("#"+formId+" #endDate").val()==''){
		showMessageTheme2(1, 'Please choose end date','',true);
		return false;
	}


	$.ajax({
			type : "POST",
			contentType : "application/json",
			url : getURLForHTML('dashboard', 'calculate-tolead'),
			data : JSON.stringify(getRequestForLeadCalculate(formId, dataType)),
			dataType : 'json',
			cache : false,
			timeout : 600000,
			success : function(data) {
				if (data['status'] == '0' || data['status'] == '2') {
					//showMessageTheme2(false, data['message']);
				} else {
					//console.log("demoCountList",data['demoCountList']);
					var bindHtml = getLeadCalculatorHtml(data);
					$("#leadCalculateTbody").html(bindHtml);
					$("#dataMode").html($("#activeDataMode").val());
					$('html, body').animate({
						scrollTop: $("#leadTargetCalculate").offset().top
					}, 800);
					
				}
			},
				error : function(e) {
					console.log(e);
				}
			});
   }
   function getRequestForLeadCalculate(formId) {
	leadCalcInputRequestDTO = {};
	leadCalcInputRequestDTO['schoolId'] = SCHOOL_ID;
	
	leadCalcInputRequestDTO['totalTarget']=$("#"+formId+" #targetLead").val();
	leadCalcInputRequestDTO['convertPercent']=$("#"+formId+" #conversionRate").val();;

	leadCalcInputRequestDTO['startDate']=$("#"+formId+" #startDate").val();
	leadCalcInputRequestDTO['endDate']=$("#"+formId+" #endDate").val();
	leadCalcInputRequestDTO['leadAttendSpentTime']=$("#"+formId+" #lspentTime").val();
	leadCalcInputRequestDTO['dataType']='WEEK';//$("#"+formId+" #activeDataMode").val();
	leadCalcInputRequestDTO['workingHrs']=24;
	// if($("#"+formId+" #workingHours").val()!=''){
	// 	leadCalcInputRequestDTO['workingHrs']=$("#"+formId+" #workingHours").val();
	// }else{
	// 	leadCalcInputRequestDTO['workingHrs']=24;
	// }

	return leadCalcInputRequestDTO;
   }

   function getLeadCalculatorHtml(data){
	var hhtml = "";
	if(data.status=='SUCCESS'){
		var leadCalculateDTO = data.leadCalculateDTO;
		var leadCalculateList = leadCalculateDTO.leadCalculateWeeklyList;
		

		$("#enroll_target").html(" | "+leadCalculateDTO.targetTotalConvert);
		$("#no_of_days").html(" ("+leadCalculateDTO.totalduration+")");
		$("#convert_rate").html(" ("+leadCalculateDTO.convertPercent+"%)");
		$("#cal_total_leads").html(" | "+leadCalculateDTO.targetTotalRecieveLead);

		hhtml = hhtml + "<tr> ";
		hhtml = hhtml + "<td class=\"p-0 border-0\"> ";
		hhtml = hhtml + "<table class=\"table table-bordered table-striped\"> ";
		hhtml = hhtml + "<thead><tr><th>CURRENT</th><th>REQUIRED</th></tr></thead> ";
		hhtml = hhtml + "<tbody> ";
		hhtml = hhtml + "<tr> ";
		hhtml = hhtml + "<td>"+leadCalculateDTO.currentTotalConvert+"</td> ";
		hhtml = hhtml + "<td>"+leadCalculateDTO.remainTotalConvert+"</td> ";
		hhtml = hhtml + "</tr> ";
		hhtml = hhtml + "</tbody> ";
		hhtml = hhtml + "</table> ";
		hhtml = hhtml + "</td> ";
		hhtml = hhtml + "<td class=\"p-0 border-0\"> ";
		hhtml = hhtml + "<table class=\"table table-bordered table-striped\"> ";
		hhtml = hhtml + "<thead><tr><th>COMPLETED</th><th>REMAINING</th></tr></thead> ";
		hhtml = hhtml + "<tbody> ";
		hhtml = hhtml + "<tr> ";
		hhtml = hhtml + "<td>"+leadCalculateDTO.currentTotalduration+"</td> ";
		hhtml = hhtml + "<td>"+leadCalculateDTO.remainTotalduration+"</td> ";
		hhtml = hhtml + "</tr> ";
		hhtml = hhtml + "</tbody> ";
		hhtml = hhtml + "</table> ";
		hhtml = hhtml + "</td> ";
		hhtml = hhtml + "<td class=\"p-0 border-0\"> ";
		hhtml = hhtml + "<table class=\"table table-bordered table-striped\"> ";
		hhtml = hhtml + "<thead><tr><th>CURRENT</th><th>REQUIRED</th></tr></thead> ";
		hhtml = hhtml + "<tbody> ";
		hhtml = hhtml + "<tr> ";
		hhtml = hhtml + "<td>"+leadCalculateDTO.currentConvertPercent+"%</td> ";
		hhtml = hhtml + "<td>"+leadCalculateDTO.remainConvertPercent+"%</td> ";
		hhtml = hhtml + "</tr> ";
		hhtml = hhtml + "</tbody> ";
		hhtml = hhtml + "</table> ";
		hhtml = hhtml + "</td> ";
		hhtml = hhtml + "<td class=\"p-0 border-0\"> ";
		hhtml = hhtml + "<table class=\"table table-bordered table-striped\"> ";
		hhtml = hhtml + "<thead><tr><th>CURRENT</th><th>REQUIRED</th></tr></thead> ";
		hhtml = hhtml + "<tbody> ";
		hhtml = hhtml + "<tr> ";
		hhtml = hhtml + "<td>"+leadCalculateDTO.currentTotalRecieveLead+"</td> ";
		hhtml = hhtml + "<td>"+leadCalculateDTO.remainTotalRecieveLead+"</td> ";
		hhtml = hhtml + "</tr> ";
		hhtml = hhtml + "</tbody> ";
		hhtml = hhtml + "</table> ";
		hhtml = hhtml + "</td> ";
		hhtml = hhtml + "</tr> ";
		hhtml = hhtml + "<tr> ";
		hhtml = hhtml + "<td class=\"p-0 border-0\"> ";
		hhtml = hhtml + "<table class=\"table table-bordered table-striped\">";
		hhtml = hhtml + "<thead> ";
		hhtml = hhtml + "<th class=\"p-2 bg-danger text-white text\">Projected</th> ";
		hhtml = hhtml + "</thead> ";
		hhtml = hhtml + "<tbody> ";
		hhtml = hhtml + "<tr> ";
		hhtml = hhtml + "<td>"+leadCalculateDTO.projectedEnrollment+"</td> ";
		hhtml = hhtml + "</tr> ";
		hhtml = hhtml + "</tbody> ";
		hhtml = hhtml + "</table> ";
		hhtml = hhtml + "</td> ";
		hhtml = hhtml + "<td colspan=\"6\" class=\"border-0\">&nbsp;</td> ";
		hhtml = hhtml + "</tr> ";
		hhtml = hhtml + "<tr> ";
		hhtml = hhtml + "<td colspan=\"8\" class=\"border-0 p-0\"> ";
		hhtml = hhtml + "<table class=\"table\" style=\"font-size:11px\"> ";
		hhtml = hhtml + "<tr> ";
		hhtml = hhtml + "<th class=\"border-0\"></th> ";
		hhtml = hhtml + "<th class=\"bg-light border-dark border-0\">LEAD PER DAY</th> ";
		hhtml = hhtml + "<th class=\"bg-light border-dark border-0\">LEAD PER WEEK</th> ";
		hhtml = hhtml + "<th class=\"bg-light border-dark border-0\">LEAD PER MONTH</th> ";
		hhtml = hhtml + "<th class=\"bg-light border-dark border-0\">LEAD PER YEAR</th> ";
		hhtml = hhtml + "</tr> ";
		hhtml = hhtml + "<tr> ";
		hhtml = hhtml + "<th class=\"text-left border-dark\">TARGET</th> ";
		
		for(var l=0;l<leadCalculateList.length;l++){
			var leadCalculate = leadCalculateList[l];
			hhtml = hhtml + "<td class=\"bg-light border-dark\">"+leadCalculate.targetReqRecievedLeadPerDay +"</td> ";
		}
		hhtml = hhtml + "</tr> ";
		hhtml = hhtml + "<tr> ";
		hhtml = hhtml + "<td colspan=\"8\" class=\"p-0 border-0\" style=\"max-height:5px;overflow: hidden;font-size:3px\">&nbsp;</td> ";
		hhtml = hhtml + "</tr> ";
		hhtml = hhtml + "<tr> ";
		hhtml = hhtml + "<th class=\"text-left border-dark\">CURRENT</th> ";
		
		for(var l=0;l<leadCalculateList.length;l++){
			var leadCalculate = leadCalculateList[l];
			hhtml = hhtml + "<td class=\"bg-light border-dark\">"+leadCalculate.curr_lead +"</td> ";
		}
		hhtml = hhtml + "</tr> ";
		hhtml = hhtml + "<tr> ";
		hhtml = hhtml + "<td colspan=\"8\" class=\"p-0 border-0\" style=\"max-height:5px;overflow: hidden;font-size:3px\">&nbsp;</td> ";
		hhtml = hhtml + "</tr> ";
		hhtml = hhtml + "<tr> ";
		hhtml = hhtml + "<th class=\"text-left  border-dark\">REQUIRED</th> ";
		for(var l=0;l<leadCalculateList.length;l++){
			var leadCalculate = leadCalculateList[l];
			
			hhtml = hhtml + "<td class=\"p-0 border-0\"> ";
			hhtml = hhtml + "<table class=\"table table-bordered table-striped m-0\"> ";
			hhtml = hhtml + "<thead><tr><th>CURRENT</th><th>REQUIRED</th></tr></thead> ";
			hhtml = hhtml + "<tbody> ";
			hhtml = hhtml + "<tr> ";
			hhtml = hhtml + "<td>"+leadCalculate.req_lead_by_enroll+"</td> ";
			hhtml = hhtml + "<td>"+leadCalculate.req_lead+"</td> ";
			hhtml = hhtml + "</tr> ";
			hhtml = hhtml + "</tbody> ";
			hhtml = hhtml + "</table> ";
			hhtml = hhtml + "</td> ";
		}
		

		hhtml = hhtml + "</tr> ";
		hhtml = hhtml + "</table> ";
		hhtml = hhtml + "</td> ";
		hhtml = hhtml + "</tr> ";
		hhtml = hhtml + "<tr> ";
		hhtml = hhtml + "<td colspan=\"8\" class=\"border-0 p-0\"> ";
		hhtml = hhtml + "<table class=\"table\" style=\"font-size:11px\"> ";
		hhtml = hhtml + "<tr> ";
		hhtml = hhtml + "<th class=\"border-0\"></th> ";
		hhtml = hhtml + "<th class=\"bg-light border-dark border-0\">ENROLLED PER DAY</th> ";
		hhtml = hhtml + "<th class=\"bg-light border-dark border-0\">ENROLLED PER WEEK</th> ";
		hhtml = hhtml + "<th class=\"bg-light border-dark border-0\">ENROLLED PER MONTH</th> ";
		hhtml = hhtml + "<th class=\"bg-light border-dark border-0\">ENROLLED PER YEAR</th> ";
		hhtml = hhtml + "</tr> ";
		hhtml = hhtml + "<tr> ";
		hhtml = hhtml + "<th class=\"text-left border-dark\">TARGET</th> ";
		
		for(var l=0;l<leadCalculateList.length;l++){
			var leadCalculate = leadCalculateList[l];
			hhtml = hhtml + "<td class=\"bg-light border-dark\">"+leadCalculate.targetConvertLeadPerDay +"</td> ";
		}
		hhtml = hhtml + "</tr> ";
		hhtml = hhtml + "<tr> ";
		hhtml = hhtml + "<td colspan=\"8\" class=\"p-0 border-0\" style=\"max-height:5px;overflow: hidden;font-size:3px\">&nbsp;</td> ";
		hhtml = hhtml + "</tr> ";
		hhtml = hhtml + "<tr> ";
		hhtml = hhtml + "<th class=\"text-left border-dark\">CURRENT</th> ";
		
		for(var l=0;l<leadCalculateList.length;l++){
			var leadCalculate = leadCalculateList[l];
			hhtml = hhtml + "<td class=\"bg-light border-dark\">"+leadCalculate.curr_enroll +"</td> ";
		}
		hhtml = hhtml + "</tr> ";
		hhtml = hhtml + "<tr> ";
		hhtml = hhtml + "<td colspan=\"8\" class=\"p-0 border-0\" style=\"max-height:5px;overflow: hidden;font-size:3px\">&nbsp;</td> ";
		hhtml = hhtml + "</tr> ";
		hhtml = hhtml + "<tr> ";
		hhtml = hhtml + "<th class=\"text-left  border-dark\">REQUIRED</th> ";

		for(var l=0;l<leadCalculateList.length;l++){
			var leadCalculate = leadCalculateList[l];
			hhtml = hhtml + "<td class=\"bg-light border-dark\">"+leadCalculate.req_enroll +"</td> ";
			// hhtml = hhtml + "<td class=\"p-0 border-0\"> ";
			// hhtml = hhtml + "<table class=\"table table-bordered table-striped m-0\"> ";
			// hhtml = hhtml + "<thead><tr><th>CURRENT</th><th>REQUIRED</th></tr></thead> ";
			// hhtml = hhtml + "<tbody> ";
			// hhtml = hhtml + "<tr> ";
			// hhtml = hhtml + "<td>0</td> ";
			// hhtml = hhtml + "<td>"+leadCalculate.req_enroll+"</td> ";
			// hhtml = hhtml + "</tr> ";
			// hhtml = hhtml + "</tbody> ";
			// hhtml = hhtml + "</table> ";
			// hhtml = hhtml + "</td> ";
		}
		
		hhtml = hhtml + "</tr> ";
		hhtml = hhtml + "</table> ";
		hhtml = hhtml + "</td> ";
		hhtml = hhtml + "</tr> ";
		
		
		
		// hhtml = hhtml + "<tr>";
		// hhtml = hhtml + "<th colspan=\"2\">"+leadCalculateDTO.targetTotalConvert+"</th> ";
		// hhtml = hhtml + "<th colspan=\"2\">"+leadCalculateDTO.totalduration+"</th>";
		// hhtml = hhtml + "<th colspan=\"2\">"+leadCalculateDTO.convertPercent+"%</th>";
		// hhtml = hhtml + "<th colspan=\"2\">"+leadCalculateDTO.targetTotalRecieveLead+"</th>";
		// hhtml = hhtml + "</tr>";
		// hhtml = hhtml + "<tr> ";
		// hhtml = hhtml + "<td>"+leadCalculateDTO.currentTotalConvert+"</td> ";
		// hhtml = hhtml + "<td>"+leadCalculateDTO.remainTotalConvert+"</td> ";
		// hhtml = hhtml + "<td>"+leadCalculateDTO.currentTotalduration+"</td> ";
		// hhtml = hhtml + "<td>"+leadCalculateDTO.remainTotalduration+"</td> ";
		// hhtml = hhtml + "<td>"+leadCalculateDTO.currentConvertPercent+"%</td> ";
		// hhtml = hhtml + "<td>"+leadCalculateDTO.remainConvertPercent+"%</td> ";
		// hhtml = hhtml + "<td>"+leadCalculateDTO.currentTotalRecieveLead+"</td> ";
		// hhtml = hhtml + "<td>"+leadCalculateDTO.remainTotalRecieveLead+"</td> ";
		// hhtml = hhtml + "</tr> ";
		// hhtml = hhtml + "<tr> ";
		// hhtml = hhtml + "<td>20</td> ";
		// hhtml = hhtml + "</tr> ";
		// hhtml = hhtml + "<tr> ";
		// hhtml = hhtml + "<td colspan=\"8\"> ";
		// hhtml = hhtml + "<table style=\"width:100%;min-width:1200px;font-size:11px\"> ";
		// hhtml = hhtml + "<tr> ";
		// hhtml = hhtml + "<th></th> ";
		// hhtml = hhtml + "<th colspan=\"2\">LEAD PER DAY</th> ";
		// hhtml = hhtml + "<th colspan=\"2\">LEAD PER WEEK</th> ";
		// hhtml = hhtml + "<th colspan=\"2\">LEAD PER MONTH</th> ";
		// hhtml = hhtml + "<th colspan=\"2\">LEAD PER YEAR</th> ";
		// hhtml = hhtml + "</tr> ";
		// hhtml = hhtml + "<tr> ";
		// hhtml = hhtml + "<th class=\"text-left\">TARGET</th> ";
		// for(var l=0;l<leadCalculateList.length;l++){
		// 	var leadCalculate = leadCalculateList[l];
		// 	hhtml = hhtml + "<td colspan=\"2\">"+leadCalculate.targetReqRecievedLeadPerDay +"</td> ";
		// }
		// hhtml = hhtml + "</tr> ";
		// hhtml = hhtml + "<tr> ";
		// hhtml = hhtml + "<th class=\"text-left\">CURRENT</th> ";
		// for(var l=0;l<leadCalculateList.length;l++){
		// 	var leadCalculate = leadCalculateList[l];
		// 	hhtml = hhtml + "<td colspan=\"2\">"+leadCalculate.totalTillRecievedleadPerDay +"</td> ";
		// }
		// hhtml = hhtml + "</tr> ";
		// hhtml = hhtml + "<tr> ";
		// hhtml = hhtml + "<th class=\"text-left\">REQUIRED</th> ";
		// for(var l=0;l<leadCalculateList.length;l++){
		// 	var leadCalculate = leadCalculateList[l];
		// 	hhtml = hhtml + "<td>"+leadCalculate.recievedTillleadRatePerHrs+"%</td> ";
		// 	hhtml = hhtml + "<td>"+leadCalculate.recieveLeadRequiredRatePerHrs+"%</td> ";
		// }
		// hhtml = hhtml + "</tr> ";
		// hhtml = hhtml + "</table> ";
		// hhtml = hhtml + "</td> ";
		// hhtml = hhtml + "</tr> ";
		// hhtml = hhtml + "<tr> ";
		// hhtml = hhtml + "<td colspan=\"8\"> ";
		// hhtml = hhtml + "<table style=\"width:100%;min-width:1200px;font-size:11px\"> ";
		// hhtml = hhtml + "<tr> ";
		// hhtml = hhtml + "<th></th> ";
		// hhtml = hhtml + "<th colspan=\"2\">ENROLLED PER DAY</th> ";
		// hhtml = hhtml + "<th colspan=\"2\">ENROLLED PER WEEK</th> ";
		// hhtml = hhtml + "<th colspan=\"2\">ENROLLED PER MONTH</th> ";
		// hhtml = hhtml + "<th colspan=\"2\">ENROLLED PER YEAR</th> ";
		// hhtml = hhtml + "</tr> ";
		// hhtml = hhtml + "<tr> ";
		// hhtml = hhtml + "<th class=\"text-left\">TARGET</th> ";
		// for(var l=0;l<leadCalculateList.length;l++){
		// 	var leadCalculate = leadCalculateList[l];
		// 	hhtml = hhtml + "<td colspan=\"2\">"+leadCalculate.targetConvertLeadPerDay +"</td> ";
		// }
		// hhtml = hhtml + "</tr> ";
		// hhtml = hhtml + "<tr> ";
		// hhtml = hhtml + "<th class=\"text-left\">CURRENT</th> ";
		// for(var l=0;l<leadCalculateList.length;l++){
		// 	var leadCalculate = leadCalculateList[l];
		// 	hhtml = hhtml + "<td colspan=\"2\">"+leadCalculate.totalTillConvertLeadPerDay +"</td> ";
		// }
		// hhtml = hhtml + "</tr> ";
		// hhtml = hhtml + "<tr> ";
		// hhtml = hhtml + "<th class=\"text-left\">REQUIRED</th> ";
		// for(var l=0;l<leadCalculateList.length;l++){
		// 	var leadCalculate = leadCalculateList[l];
		// 	hhtml = hhtml + "<td>"+leadCalculate.convertedTillLeadRatePerHrs+"%</td> ";
		// 	hhtml = hhtml + "<td>"+leadCalculate.convertLeadRequiredRatePerHrs+"%</td> ";
		// }
		// hhtml = hhtml + "</tr> ";
		// hhtml = hhtml + "</table> ";
		// hhtml = hhtml + "</td> ";
		// hhtml = hhtml + "</tr> ";
		
	}else{

	}

	return hhtml;
   }


function callLeadtimecountry(modeSearch, startDate, endDate) {
	$.ajax({
			type : "POST",
			contentType : "application/json",
			url : getURLForHTML('dashboard', 'times-countries'),
			data : JSON.stringify(getRequestForLeadtimecountry(modeSearch,startDate, endDate)),
			dataType : 'json',
			cache : false,
			timeout : 600000,
			success : function(data) {
				if (data['status'] == '0' || data['status'] == '2') {
					showMessage(true, data['message']);
				} else {
					var httmls = getLeadTimeCountryHtml(data);
					$("#timescountry").html(httmls);
				}
			},
				error : function(e) {
					console.log(e);
				}
			});
   }

   function callLeadAndEnrollmentWithCountry(modeSearch, startDate, endDate) {
	$.ajax({
			type : "POST",
			contentType : "application/json",
			url : getURLForHTML('dashboard', 'get-enrolled-list-with-country'),
			data : JSON.stringify(getRequestForLeadtimecountry(modeSearch,startDate, endDate)),
			dataType : 'json',
			cache : false,
			timeout : 600000,
			success : function(data) {
				if (data['status'] == '0' || data['status'] == '2') {
					showMessage(true, data['message']);
				} else {
					var httmlTop = getLeadTopCountryHtml(data);
					$("#topcompany").html(httmlTop);
				}
			},
				error : function(e) {
					console.log(e);
				}
			});
   }
   function getRequestForLeadtimecountry(modeSearch,startDate, endDate) {
	var authentication = {};
	var leadReportRequest = {};
	leadReportRequest['schoolId'] = SCHOOL_ID;
	leadReportRequest['modeSearch'] = modeSearch;
	leadReportRequest['startDate'] = startDate;
	leadReportRequest['endDate'] = endDate;
   
	authentication['hash'] = getHash();
	authentication['schoolId'] = SCHOOL_ID;
	authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userId'] = USER_ID;
	authentication['userType'] = 'COMMON';
	leadReportRequest['authentication'] = authentication;
	return leadReportRequest;
}

function getLeadTimeCountryHtml(data){
	var leadTimeWiseList=data.leadTimeWiseList;
	var htmlRet ="";
	if(leadTimeWiseList.length>0){
		for (let ind = 0; ind < leadTimeWiseList.length; ind++) {
			const tcntry = leadTimeWiseList[ind];
			htmlRet +="<tr><td>"+tcntry.timeDuration+" ("+tcntry.totalLead+")</td><td>"+ (tcntry.countryName==''?'N/A':tcntry.countryName)+"</td></tr>";
		}
	}
	return htmlRet;
}

function getLeadTopCountryHtml(data){
	var leadCount=0;
	var totalStudent = 0;
	var totalFreshStudent = 0;
	var totalNewEnrollmentStudent = 0;
	var topLeadCompany = data.dataList;
	var htmlRet ="";

	if(topLeadCompany != null && topLeadCompany != undefined && Object.entries(topLeadCompany).length > 0){
		// object sort on the behalf of leadCount
		topLeadCompany = Object.fromEntries(
			Object.entries(topLeadCompany).sort((a, b) => {
			return b[1].leadCount - a[1].leadCount;
			})
		);
		var indx=0;
		var nacntry=0;
			for(const key in topLeadCompany){
			const tcntry = topLeadCompany[key];
			var newEnrollmentCount = parseInt(tcntry.groupStudentCount)+ parseInt(tcntry.otherStudentCount);
			indx=indx+1;
			htmlRet +="<tr><td>"+indx+"</td><td>"+(tcntry.countryName==''?'N/A':tcntry.countryName)+"</td><td class=\"text-center\">"+tcntry.leadCount+"</td><td class=\"text-center\">"+tcntry.totalStudentCount+"</td><td class=\"text-center\">"+tcntry.freshStudentCount+"</td><td class=\"text-center\">"+newEnrollmentCount+"</td></tr>";
			leadCount=leadCount+(parseInt(tcntry.leadCount))
			totalStudent += parseInt(tcntry.totalStudentCount);
			totalFreshStudent += parseInt(tcntry.freshStudentCount);
			totalNewEnrollmentStudent += parseInt(newEnrollmentCount);
			if(tcntry.countryName==''){
				nacntry=nacntry+1;
			}
		}
		$("#totalStudentCount").text(totalStudent);
		$("#freshStudentCount").text(totalFreshStudent);
		$("#newEnrollmentCount").text(totalNewEnrollmentStudent);
		$(".totalCountry").text(indx-nacntry);
		$(".totalTopCountry").text(leadCount);
		var sstr = htmlRet.slice(0,-2);
		htmlRet = sstr;
	}
	return htmlRet
}


function callLeadTotalStatuscountry(modeSearch, chartId, startDate, endDate) {
	$.ajax({
			type : "POST",
			contentType : "application/json",
			url : getURLForHTML('dashboard', 'total-lead-countries'),
			data : JSON.stringify(getRequestForLeadTotalcountry(modeSearch, startDate, endDate)),
			dataType : 'json',
			cache : false,
			timeout : 600000,
			success : function(data) {
				if (data['status'] == '0' || data['status'] == '2') {
					showMessage(true, data['message']);
				} else {
					var htChart = getTotalLeadsChart(data.leadTotalLeadCount, chartId);
				}
			},
				error : function(e) {
					console.log(e);
				}
			});
   }
   

   function getRequestForLeadTotalcountry(modeSearch, startDate, endDate) {
	var authentication = {};
	var leadReportRequest = {};
	leadReportRequest['schoolId'] = SCHOOL_ID;
	leadReportRequest['modeSearch'] = modeSearch;
	leadReportRequest['startDate'] = startDate;
	leadReportRequest['endDate'] = endDate;
   
	authentication['hash'] = getHash();
	authentication['schoolId'] = SCHOOL_ID;
	authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userId'] = USER_ID;
	authentication['userType'] = 'COMMON';
	leadReportRequest['authentication'] = authentication;
	return leadReportRequest;
}

function getTotalLeadsChart(data, chartId){
	var totalLeadSeries=[];
	var countoryName=[];
	var series={};
	

	if(data.length>0){
		var totalLData=[];
		var enrollData=[];
		var demoLeadData=[];
		var scrapLeadData=[];
		var positiveLeadData=[];
		var demoDoneData = [];

		for (let i = 0; i < data.length; i++) {
			const dataChart = data[i];
			countoryName.push(dataChart.countryName);
		}
		for (let j = 0; j < data.length; j++) {
			const dataTotalLead = data[j];
			totalLData.push(dataTotalLead.totalLead);
			enrollData.push(dataTotalLead.enrolledLead);
			demoLeadData.push(dataTotalLead.demoLead);
			scrapLeadData.push(dataTotalLead.scrapLead);
			positiveLeadData.push(dataTotalLead.positiveLead);
			demoDoneData.push(dataTotalLead.demoDone);
		}
		series['name']="Total Leads";
		series['data']=totalLData;
		totalLeadSeries.push(series);
		series={};
		series['name']="Enrolled";
		series['data']=enrollData;
		totalLeadSeries.push(series);
		series={};
		series['name']="Demo";
		series['data']=demoLeadData;
		totalLeadSeries.push(series);
		series={};
		series['name']="Demo Done";
		series['data']=demoDoneData;
		totalLeadSeries.push(series);
		series={};
		series['name']="Scrap";
		series['data']=scrapLeadData;
		totalLeadSeries.push(series);
		series={};
		series['name']="Positive Enrolled";
		series['data']=positiveLeadData;
		totalLeadSeries.push(series);
		
		//console.log(totalLeadSeries);

			var options = {
				series: totalLeadSeries,
				chart: {
				type: 'bar',
				height: 600,
				stacked: true,
			},
			plotOptions: {
				bar: {
				horizontal: true,
				dataLabels: {
					total: {
					enabled: true,
					offsetX: 0,
					style: {
						fontSize: '13px',
						fontWeight: 900
					}
					}
				}
				},
			},
			colors: [ '#008ffb', '#1fc747', '#fdb300', '#2b908f', '#e90909', '#9D00FF'],
			stroke: {
				width: 1,
				colors: ['#fff']
			},
			title: {
				text: ''
			},
			xaxis: {
				categories: countoryName, //['Brazil', 'Panama', 'Paraguay', 'United States', 'Mexico', 'Panama', 'Panama'],
				labels: {
				formatter: function (val) {
					return val + ""
				}
				}
			},
			yaxis: {
				title: {
				text: undefined
				},
			},
			tooltip: {
				y: {
				formatter: function (val) {
					return val + ""
				}
				}
			},
			fill: {
				opacity: 1
			},
			legend: {
				position: 'top',
				horizontalAlign: 'center',
				offsetX: 40
			}
			};

			
				var chart = new ApexCharts(document.querySelector("#"+chartId), options);
				chart.render();
				chart.update();

	}
}

	function callDaywiseLead(modeSearch, chartId, startDate, endDate) {
		$.ajax({
				type : "POST",
				contentType : "application/json",
				url : getURLForHTML('dashboard', 'daywise-lead'),
				data : JSON.stringify(getRequestForDayWiseLead(modeSearch, startDate, endDate)),
				dataType : 'json',
				cache : false,
				timeout : 600000,
				success : function(data) {
					if (data['status'] == '0' || data['status'] == '2') {
						showMessage(true, data['message']);
					} else {
						var htChart = getDaywiseLeadsChart(data.leadDaywiseWise, chartId);
					}
				},
					error : function(e) {
						console.log(e);
					}
				});
	   }
	   
	
	function getRequestForDayWiseLead(modeSearch, startDate, endDate) {
		var authentication = {};
		var leadReportRequest = {};
		leadReportRequest['schoolId'] = SCHOOL_ID;
		leadReportRequest['modeSearch'] = modeSearch;
		leadReportRequest['startDate'] = startDate;
		leadReportRequest['endDate'] = endDate;
	   
		authentication['hash'] = getHash();
		authentication['schoolId'] = SCHOOL_ID;
		authentication['schoolUUID'] = SCHOOL_UUID;
		authentication['userId'] = USER_ID;
		authentication['userType'] = 'COMMON';
		leadReportRequest['authentication'] = authentication;
		return leadReportRequest;
	}
	
	function getDaywiseLeadsChart(data, chartId){
		var dayName=[];
		var totalLData=[];
		var totalPercentData=[];
	
		if(data.length>0){
			
			for (let i = 0; i < data.length; i++) {
				const dataChart = data[i];
				dayName.push(dataChart.dayName);
				totalLData.push(dataChart.dayLead);
				totalPercentData.push(parseFloat(dataChart.leadPercent));
			}

				var options = {
					series: totalLData,//[25, 15, 44, 55, 41, 17],
					chart: {
					width: '85%',
					type: 'pie',
				},
				labels: dayName,//["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
				theme: {
					monochrome: {
					enabled: true
					}
				},
				plotOptions: {
					pie: {
					dataLabels: {
							offset: -5
						}
					}
				},
				title: {
					text: ""
				},
				dataLabels: {
					formatter(val, opts) {
						const name = opts.w.globals.labels[opts.seriesIndex]
						return [name, val.toFixed(1) + '%']
					}
				},
				legend: {
					show: false
				}
			  };
	  
			  
			var chart = new ApexCharts(document.querySelector("#"+chartId), options);
			chart.render();   
			chart.update();

	
		}
	}




	function callCampainWise(modeSearch, searchType , chartId, startDate, endDate) {

		$.ajax({
				type : "POST",
				contentType : "application/json",
				url : getURLForHTML('dashboard', 'campain-lead'),
				data : JSON.stringify(getRequestForCampainWise(modeSearch, searchType,startDate,endDate)),
				dataType : 'json',
				cache : false,
				timeout : 600000,
				success : function(data) {
					if (data['status'] == '0' || data['status'] == '2') {
						showMessage(true, data['message']);
					} else {
						if(searchType=='campain'){
							var htChart = getCampainWiseChart(data.leadDaywiseWise, chartId);
						}else{
							var htChart = getLeadSourceWiseChart(data.leadDaywiseWise, chartId);
						}
					}
				},
					error : function(e) {
						console.log(e);
					}
				});
	   }
	   
	
	   function getRequestForCampainWise(modeSearch, searchType,startDate,endDate) {
		var authentication = {};
		var leadReportRequest = {};
		leadReportRequest['schoolId'] = SCHOOL_ID;
		leadReportRequest['modeSearch'] = modeSearch;
		leadReportRequest['searchType'] = searchType;
		leadReportRequest['startDate'] = startDate;
		leadReportRequest['endDate'] = endDate;
	
		authentication['hash'] = getHash();
		authentication['schoolId'] = SCHOOL_ID;
		authentication['schoolUUID'] = SCHOOL_UUID;
		authentication['userId'] = USER_ID;
		authentication['userType'] = 'COMMON';
		leadReportRequest['authentication'] = authentication;
		return leadReportRequest;
	}
	
	
	function getCampainWiseChart(data, chartId){
		var dayName=[];
		var totalLData=[];
		var totalLeadSeries=[];
		var series={};
		if(data.length>0){
			var totalLData=[];
			var enrollData=[];
			var demoLeadData=[];
			var scrapLeadData=[];
			var positiveLeadData=[];
			var demoDoneData = [];
	
			for (let i = 0; i < data.length; i++) {
				const dataChart = data[i];
				dayName.push(dataChart.dayName);
				//totalLData.push(dataChart.totalLead);
			}

			for (let j = 0; j < data.length; j++) {
				const dataTotalLead = data[j];
				totalLData.push(dataTotalLead.totalLead);
				enrollData.push(dataTotalLead.enrolledLead);
				demoLeadData.push(dataTotalLead.demoLead);
				scrapLeadData.push(dataTotalLead.scrapLead);
				positiveLeadData.push(dataTotalLead.positiveLead);
				demoDoneData.push(dataTotalLead.demoDone);
			}
			series['name']="Total Leads";
			series['data']=totalLData;
			totalLeadSeries.push(series);
			series={};
			series['name']="Enrolled";
			series['data']=enrollData;
			totalLeadSeries.push(series);
			series={};
			series['name']="Demo";
			series['data']=demoLeadData;
			totalLeadSeries.push(series);
			series={};
			series['name']="Demo Done";
			series['data']=demoDoneData;
			totalLeadSeries.push(series);
			series={};
			series['name']="Scrap";
			series['data']=scrapLeadData;
			totalLeadSeries.push(series);
			series={};
			series['name']="Positive Enrolled";
			series['data']=positiveLeadData;
			totalLeadSeries.push(series);
			
			//console.log(totalLeadSeries);
	
			var options = {
				series: totalLeadSeries,
				chart: {
					type: 'bar',
					height: 600,
					stacked: true,
				},
				plotOptions: {
					bar: {
					horizontal: true,
					dataLabels: {
						total: {
						enabled: true,
						offsetX: 0,
						style: {
							fontSize: '13px',
							fontWeight: 900
						}
						}
					}
					},
				},
				colors: [ '#008ffb', '#1fc747', '#fdb300', '#2b908f', '#e90909', '#9D00FF'], //colors: ['#008ffb', '#1fc747', '#e90909', '#fdb300', '#A5978B', '#2b908f', '#f9a3a4', '#90ee7e', '#f48024', '#69d2e7', '#008ffb', '#00e396', '#feb019', '#ff4560', '#775dd0', '#b53a03' ],
				stroke: {
					width: 1,
					colors: ['#fff']
				},
				title: {
					text: ''
				},
				xaxis: {
					categories: dayName, 
					labels: {
						formatter: function (val) {
							return val + ""
						}
					}
				},
				yaxis: {
					title: {
						text: undefined
					},
				},
				tooltip: {
					y: {
						formatter: function (val) {
							return val + ""
						}
					}
				},
				fill: {
					opacity: 1
				},
				legend: {
					position: 'top',
					horizontalAlign: 'center',
					offsetX: 40
				}
			};
			
			var chart = new ApexCharts(document.querySelector("#"+chartId), options);
			chart.render();
			chart.update();
	
		}
	}

	function getLeadSourceWiseChart(data, chartId){
		var dayName=[];
		var totalLData=[];
	
		if(data.length>0){
			
			for (let i = 0; i < data.length; i++) {
				const dataChart = data[i];
				dayName.push(dataChart.dayName);
				totalLData.push(dataChart.totalLead);
			}

			
			var options = {
				series: [
				{
				name: "",
				data: totalLData,//[200, 330, 548, 740, 880],
				},
			],
				chart: {
				type: 'bar',
				height: 350,
			},
			plotOptions: {
				bar: {
					borderRadius: 0,
					horizontal: true,
					distributed: true,
					barHeight: '80%',
					isFunnel: true,
				},
			},
			// colors: [
			// 	'#F44F5E',
			// 	'#E55A89',
			// 	'#D863B1',
			// 	'#CA6CD8',
			// 	'#B57BED',
				
			// ],
			dataLabels: {
				enabled: true,
				// formatter: function (val, opt) {
				// 	return opt.w.globals.labels[opt.dataPointIndex] 
				// },
				formatter: function (val, opt) {
					return  val
				  },
				dropShadow: {
					enabled: true,
				},
			},
			title: {
				text: 'Pyramid Chart',
				align: 'middle',
			},
			xaxis: {
				categories: dayName,//['Facebook-ads', 'Google-ads', 'Demo Request', 'Website', 'Partial entry'],
			},
			legend: {
				show: false,
			},
			};

			var chart = new ApexCharts(document.querySelector("#"+chartId), options);
			chart.render(); 
				chart.update();
	
		}
	}



function callLeadEnrolled(formId, modeSearch, startDate, endDate) {
	$.ajax({
			type : "POST",
			contentType : "application/json",
			url : getURLForHTML('dashboard', 'enrolled-lead-list'),
			data : JSON.stringify(getRequestForLeadEnrolled(formId, modeSearch,startDate, endDate)),
			dataType : 'json',
			cache : false,
			timeout : 600000,
			success : function(data) {
				$("#leadReportSearch").modal('hide');
				if (data['status'] == '0' || data['status'] == '2') {
					showMessage(true, data['message']);
				} else {
					$('#enrolled-student').dataTable().fnDestroy();
					var httmlTop = getLeadEnrolledHtml(data);
					$("#enrollLeads").html(httmlTop);
					$("#enrolled-student").dataTable();
					
				}
			},
				error : function(e) {
					console.log(e);
				}
			});
   }
   

   function getRequestForLeadEnrolled(formId, modeSearch,startDate, endDate) {
	var authentication = {};
	var leadReportRequest = {};
	leadReportRequest['schoolId'] = SCHOOL_ID;
	leadReportRequest['modeSearch'] = modeSearch;
	leadReportRequest['startDate'] = startDate;
	leadReportRequest['endDate'] = endDate;
	if(formId != ''){
	   leadReportRequest['sessionYear'] = $("#"+formId+" #acadmicYear").val();
	   if($("#"+formId+" #assignToSearch").val() != null && $("#"+formId+" #assignToSearch").val() != undefined){
		   leadReportRequest['assignTo'] = $("#"+formId+" #assignToSearch").val().toString();
	   }
	   leadReportRequest['gradeId'] = $("#"+formId+" #gradeSearch").val();
	   leadReportRequest['countryId'] = $("#"+formId+" #countryId").val();
	   leadReportRequest['utmCampaign'] = $("#"+formId+" #searchCampaign").val();
	   leadReportRequest['enrollType'] = $("#"+formId+" #enrollmentSearch").val();
   }
	authentication['hash'] = getHash();
	authentication['schoolId'] = SCHOOL_ID;
	authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userId'] = USER_ID;
	authentication['userType'] = 'COMMON';
	leadReportRequest['authentication'] = authentication;
	return leadReportRequest;
}

function getLeadEnrolledHtml(data){
	var studentEnrolledList=data.studentEnrolledList;
	var htmlRet ="";
	var sr=1;
	if(studentEnrolledList != null && studentEnrolledList != undefined && studentEnrolledList.length>0){
		for (let ind = 0; ind < studentEnrolledList.length; ind++) {
			const studentEnroll = studentEnrolledList[ind];
			var registrationType = "N/A";
			if(studentEnroll.registrationType=='ONE_TO_ONE'){
				registrationType="1:1";
			}else if(studentEnroll.registrationType=='BATCH'){
				registrationType="Group Learning";
			}else if(studentEnroll.registrationType=='ONE_TO_ONE_FLEX'){
				registrationType="1:1 Flex";
			}else if(studentEnroll.registrationType=='SCHOLARSHIP'){
				registrationType="Accelerated Learning";
			}

			var enrollType = studentEnroll.enrollType;
			if(studentEnroll.enrollType=='REGISTRATION_FRESH' 
				|| studentEnroll.enrollType=='REGISTRATION_FLEX_COURSE' ){
					enrollType = "Fresh";
			}else if(studentEnroll.enrollType=='REGISTRATION_NEXT_GRADE' || studentEnroll.enrollType=='REGISTRATION_REPEAT_GRADE'){
					enrollType="Re-Enroll";
			}
			if(USER_ROLE=='LEAD_AND_DEMO'){
				if(studentEnroll.enrollType=='REGISTRATION_FRESH' ){
					htmlRet +="<tr>";
					htmlRet +="<td>"+(sr++)+"</td>";
					htmlRet +="<td>"+studentEnroll.name+"<br/>"+studentEnroll.standardName+"<br/></td>";
					htmlRet +="<td>"+hideEmail(studentEnroll.email)+"<br/>"+studentEnroll.countryName+"</td>";
					htmlRet +="<td>"+studentEnroll.parentName+"</td>";
					htmlRet +="<td>"+enrollType+"<br/>"+registrationType+"</td>";
					htmlRet +="<td>"+studentEnroll.profileDate+"</td>";
					htmlRet +="<td>"+(studentEnroll.assignName==''?'N/A':studentEnroll.assignName)+"</td>";
					htmlRet +="<td>"+(studentEnroll.orientDate==''?'N/A':studentEnroll.orientDate)+"</td>";
					htmlRet +="<td>"+(studentEnroll.orientStatus==''?'N/A':studentEnroll.orientStatus)+"</td>";
					htmlRet +="</tr>";
				}
			}else{
				htmlRet +="<tr>";
				htmlRet +="<td>"+(sr++)+"</td>";
				htmlRet +="<td>"+studentEnroll.name+"<br/>"+studentEnroll.standardName+"<br/></td>";
				htmlRet +="<td>"+hideEmail(studentEnroll.email)+"<br/>"+studentEnroll.countryName+"</td>";
				htmlRet +="<td>"+studentEnroll.parentName+"</td>";
				htmlRet +="<td>"+enrollType+"<br/>"+registrationType+"</td>";
				htmlRet +="<td>"+studentEnroll.profileDate+"</td>";
				htmlRet +="<td>"+(studentEnroll.assignName==''?'N/A':studentEnroll.assignName)+"</td>";
				htmlRet +="<td>"+(studentEnroll.orientDate==''?'N/A':studentEnroll.orientDate)+"</td>";
				htmlRet +="<td>"+(studentEnroll.orientStatus==''?'N/A':studentEnroll.orientStatus)+"</td>";
				htmlRet +="</tr>";
			}

		}
	}
	return htmlRet;
}



function callCampainWiseExpenses(modeSearch, searchType, startDate, endDate) {
	$.ajax({
			type : "POST",
			contentType : "application/json",
			url : getURLForHTML('fb', 'insights'),
			data : JSON.stringify(getRequestForCampainWiseExpenses(modeSearch, searchType, startDate,endDate)),
			dataType : 'json',
			cache : false,
			timeout : 600000,
			success : function(data) {
				if (data['status'] == '0' || data['status'] == '2') {
					showMessage(true, data['message']);
				} else {
					if(searchType=='campain'){
						//$('#campExpList').dataTable().fnDestroy();
						var htList = getLeadExpensesListHtml(data.leadExpensesList);
						$("#leadExpense").html(htList);
						$("#campExpList").dataTable();
					}
				}
			},
				error : function(e) {
					console.log(e);
				}
			});
   }
   


function getRequestForCampainWiseExpenses(modeSearch, searchType,startDate,endDate) {
	var data = {};
	data['schoolId'] = SCHOOL_ID;
	data['daytype'] = modeSearch;
	data['accountId'] = "act_2040679362947027";
	data['startDate'] = startDate;
	data['endDate'] = endDate;
	return data;
}

function getLeadExpensesListHtml(data){
	var leadExpensesList=data;
	var htmlRet ="";
	var sr=1;
	if(leadExpensesList.length>0){
		for (let ind = 0; ind < leadExpensesList.length; ind++) {
			const exdata = leadExpensesList[ind];
			htmlRet +="<tr><td>"+sr+"</td>";
			htmlRet +="<td>"+exdata.campaignName+"</td>";
			htmlRet +="<td>"+exdata.impressions+" | "+exdata.reach+"</td>";
			htmlRet +="<td>"+exdata.totalFBLeads+" | "+exdata.totalSMSLeads+"</td>";
			htmlRet +="<td>"+exdata.totalSpend+" | "+exdata.leadPerCost+"</td>";
			htmlRet +="<td>"+exdata.convertLeads+"</td>";
			htmlRet +="<td>"+exdata.positiveLeads+"</td>";
			htmlRet +="<td>"+exdata.bookSeatLeads+"</td>";
			htmlRet +="</tr>";
		}
	}
	return htmlRet;
}

function callB2BDashboardLead(moduleId,leadType) {
	$.ajax({
			type : "POST",
			contentType : "application/json",
			url : getURLForHTML('dashboard', 'b2b-dashboard-lead'),
			data : JSON.stringify(getRequestForB2bDashboard(moduleId,leadType)),
			dataType : 'json',
			cache : false,
			timeout : 600000,
			success : function(data) {
				
				if (data['status'] == '0' || data['status'] == '2') {
					showMessage(true, data['message']);
				} else {
					//console.log(data.leadCountDetailDTO);
					var totalCount = data.leadCountDetailDTO;
					if(totalCount.totalLeads!=''){
						$("#totalB2bLead").text(totalCount.totalLeads);
					}
					if(totalCount.totalConverted!=''){
						$("#convertB2bLead").text(totalCount.totalConverted);
					}
					if(totalCount.unattendedLead!=''){
						$("#unattendedB2bLead").text(totalCount.unattendedLead);
					}
					if(totalCount.followupLead1!=''){
						$("#positiveB2bLead").text(totalCount.followupLead1);
					}
					
					
				}
			},
				error : function(e) {
					console.log(e);
				}
			});
   }
   

   function getRequestForB2bDashboard(moduleId,leadType) {
	var leadCommonDTO={};
	var leadModifyDTO={};
	var leadModifyDetailDTO={};
	var leadStudentDetailDTO={};
	var leadDemoInfo={};
	var leadCallFollowupDTO={};
	var leadCountDetailDTO={};
	leadModifyDTO['schoolId'] = SCHOOL_ID;
	leadModifyDTO['userId'] = USER_ID;
	leadModifyDTO['moduleId'] = moduleId;
	leadModifyDTO['leadFrom'] = 'LEAD';
	leadModifyDTO['clickFrom'] = 'list';
	leadModifyDTO['currentPage'] = 0;
	leadModifyDTO['leadType'] = leadType;
	leadStudentDetailDTO['country']=0;
	leadCommonDTO['leadModifyDTO']=leadModifyDTO;
	leadCommonDTO['leadModifyDetailDTO']=leadModifyDetailDTO;
	leadCommonDTO['leadStudentDetailDTO']=leadStudentDetailDTO;
	leadCommonDTO['leadDemoInfo']=leadDemoInfo;
	leadCommonDTO['leadCallFollowupDTO']=leadCallFollowupDTO;
	leadCommonDTO['leadCountDetailDTO']=leadCountDetailDTO;
	
	return leadCommonDTO;
}

function showBasicDetailsMailWarning(b2bLeadId) {
	$('#warningSendBadicDetailsModel').remove();
	var html=
	'<div class="modal fade" id="warningSendBadicDetailsModel">'
		+'<div class="modal-dialog modal-md modal-notify modal-danger" role="document" style="max-width:500px;">'
			+'<div class="modal-content">'
				+'<div class="modal-body text-center">'
					+'<h5 class="modal-title py-4" id="exampleModalLabel">Are you sure you want to send basic details mail?</h5>'
					+'<div style="full text-center">'
						+'<button type="button" class="btn btn-primary mr-2" id="discardSendBasicDetailsWarningYes" onclick="sendBasicDetailsMail(' + b2bLeadId + ');">Yes</button>'
						+'<button type="button" class="btn btn-danger waves-effect text-right" data-dismiss="modal">No</button>'
					+'</div>'
				+'</div>'
			+'</div>'
		+'</div>'
	+'</div>';
	$('body').append(html);
	$('#warningSendBadicDetailsModel').modal('show');
}

function sendBasicDetailsMail(b2bleadId){
	var request={};
	request['b2bleadId']=b2bleadId;

	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : BASE_URL + CONTEXT_PATH + SCHOOL_UUID +'/send-b2b-basic-details',
		data : JSON.stringify(request),
		dataType : 'json',
		global : false,
		success : function(data) {
			$('#warningSendBadicDetailsModel').modal('hide');
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if (data['status'] == '3') {
					redirectLoginPage();
				} else {
					showMessageTheme2(0, data['message'],'',true);
				}
			} else {
				showMessageTheme2(1, data['message'],'',true);
			}
		},
		error : function(e) {
			if (checkonlineOfflineStatus()) {
				return;
			}
			console.log(e);
		}
	});
}

function showResendB2BWelcomeMailWarning(b2bLeadId) {
	$('#warningResendWelcomeMailModel').remove();
	var html=
	'<div class="modal fade" id="warningResendWelcomeMailModel">'
		+'<div class="modal-dialog modal-md modal-notify modal-danger" role="document" style="max-width:500px">'
			+'<div class="modal-content">'
				+'<div class="modal-body text-center">'
					+'<h5 class="modal-title py-4" id="exampleModalLabel">Are you sure you want to resend login details mail?</h5>'
					+'<div style="full text-center">'
						+'<button type="button" class="btn btn-primary mr-2" id="discardSendBasicDetailsWarningYes" onclick="resendB2BWelcomeMail(' + b2bLeadId + ');">Yes</button>'
						+'<button type="button" class="btn btn-danger waves-effect text-right" data-dismiss="modal">No</button>'
					+'</div>'
				+'</div>'
			+'</div>'
		+'</div>'
	+'</div>';
	$('body').append(html);
	$('#warningResendWelcomeMailModel').modal('show');
}

function resendB2BWelcomeMail(b2bleadId){
	var request={};
	request['b2bleadId']=b2bleadId;

	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : BASE_URL + CONTEXT_PATH + SCHOOL_UUID +'/resend-b2b-welcome-mail',
		data : JSON.stringify(request),
		dataType : 'json',
		global : false,
		success : function(data) {
			$('#warningResendWelcomeMailModel').modal('hide');
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if (data['status'] == '3') {
					redirectLoginPage();
				} else {
					showMessageTheme2(0, data['message'],'',true);
				}
			} else {
				showMessageTheme2(1, data['message'],'',true);
			}
		},
		error : function(e) {
			if (checkonlineOfflineStatus()) {
				return;
			}
			console.log(e);
		}
	});
}

function callLeadStatusList(formId, value, elementId, keyStatus) {
	hideMessageTheme2('');
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLForCommon('masters'),
		data: JSON.stringify(getRequestForMaster(formId, 'LEAD-STATUS-LIST', value)),
		dataType: 'json',
		cache: false,
		timeout: 600000,
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessageTheme2(true, data['message']);
			} else {
				//console.log(data['mastersData']['data']);
				result = data['mastersData']['data'];
				dropdown = $("#"+formId+" #"+elementId);
				dropdown.html('');
				dropdown.append('<option value="0">Select Status</option>');
				$.each(result, function (k, v) {
					if(keyStatus){
						dropdown.append('<option value="' + v.key + '">' + v.value + '</option>');
					}else{
						dropdown.append('<option value="' + v.value + '">' + v.value + '</option>');
					}
				});
				//buildDropdown(data['mastersData']['data'], 0, 'Select Status');
			}
		},
		error: function (e) {
			//showMessage(true, e.responseText);
			console.log(e);
		}
	});
}


function saveCampaignLead(leadid, elementId, leadFrom ) {
		hideMessageTheme2('');
		if($("#"+elementId).val()==''){
			showMessageTheme2(0, 'Please select campaign','',true);
			return false;
		}
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLFor('leads','lead-campainname-update'),
		data : JSON.stringify(getRequestForCampaignLead(leadid, elementId)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data['statusCode'] == '0' || data['statusCode'] == '2') {
				showMessageTheme2(0, data['message'],'',true);
			} else {
				showMessageTheme2(1, data['message'],'',false);
				if(leadFrom=='new-leadcampaign'){
					$(".utmCampaign-"+leadid).text($("#"+elementId+" option:selected").attr('data-campain'));
				}else{
					window.location.reload();
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
function getRequestForCampaignLead(leadid, elementId){
	var leadAddFormRequestDTO = {};
	var authentication = {};
	var leadCommonDTO = {};
	var leadModifyDTO ={};
	var leadDemoInfo={};
   var leadModifyDetailDTO={};
   var leadStudentDetailDTO={};
   var leadCallFollowupDTO={};
   var leadCountDetailDTO={};
	
   leadModifyDTO['leadId'] =leadid;
   leadModifyDetailDTO['utmCampaign'] =$("#"+elementId+"").val();
   leadModifyDetailDTO['utmlTemplate'] =$("#"+elementId).val();
   
   
	leadCommonDTO['leadModifyDTO']=leadModifyDTO;
	leadCommonDTO['leadDemoInfo']=leadDemoInfo;
	leadCommonDTO['leadModifyDetailDTO']=leadModifyDetailDTO;
	leadCommonDTO['leadCallFollowupDTO']=leadCallFollowupDTO;
	leadCommonDTO['leadStudentDetailDTO']=leadStudentDetailDTO;
	leadCommonDTO['leadCountDetailDTO']=leadCountDetailDTO;
   
	authentication['hash'] = getHash();
	authentication['schoolId'] = SCHOOL_ID;
	authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userId'] = USER_ID;
	authentication['userType'] = 'COMMON';
	leadAddFormRequestDTO['authentication'] = authentication;
	leadAddFormRequestDTO['leadCommonDTO'] = leadCommonDTO;
	return leadAddFormRequestDTO;
}



function callLeadMergeData(formId, leadId, userId, controlType, modalId,leadType, openstatus) {
	//console.log("callLeadMergeData");
 $.ajax({
		 type : "POST",
		 contentType : "application/json",
		 url : getURLForHTML('/api/v1/leads', 'get-lead-marge'),
		 data : JSON.stringify(getRequestForMergeLeadIds(formId, leadId, userId, leadType)),
		 dataType : 'json',
		 cache : false,
		 timeout : 600000,
		 success : function(data) {
				//console.log(data);
			 if (data['status'] == '0' || data['status'] == '2') {
				 showMessage(true, data['message']);
			 } else {
				var leadStatusResponse=data['leadStatusResponse'];
				if(leadStatusResponse.statusCode=='0'){
					showMessageTheme2(0, leadStatusResponse.message,'',true);
				}else{
					if(openstatus==0){
						$("#"+modalId).modal('show');
					}
					 
					if(data['leadDashboardCommon']!=null){
						if(data['leadDashboardCommon']['leadCommonDTO']!=null){
						   var leadDemo = data['leadDashboardCommon']['leadCommonDTO'][0];
						   if(controlType=='addLeadClone'){
								$("#"+formId+" #parentleadId").val(leadDemo.leadModifyDTO.leadId);
								$("#"+formId+" #academicId").val(leadDemo.leadModifyDTO.academicId);
							}else{
								$("#"+formId+" #leadId").val(leadDemo.leadModifyDTO.leadId);
								$("#"+formId+" #academicId").val(leadDemo.leadModifyDTO.academicId);
								$("#"+formId+" #leadNo").val(leadDemo.leadModifyDTO.leadNo);
								$("#"+formId+" #leadNoText").html(leadDemo.leadModifyDTO.leadNo);
								$("#"+formId+" #rawLeadId").val(leadDemo.leadDemoInfo.rawLeadId);
								$("#"+formId+" #relationType").val(leadDemo.leadStudentDetailDTO.relationType);
							}
							
							$("#"+formId+" #leadSource").val(leadDemo.leadModifyDTO.leadSource);
							$("#"+formId+" #leadGrade").val(leadDemo.leadStudentDetailDTO.standard);
							$("#"+formId+" #leadDOB").val(leadDemo.leadStudentDetailDTO.stdDob);
							$("#"+formId+" #leadGender").val(leadDemo.leadStudentDetailDTO.gender);
							$("#"+formId+" #leademailId").val(leadDemo.leadStudentDetailDTO.email);
							$("#"+formId+" #phoneNo").val(leadDemo.leadStudentDetailDTO.phoneNo);
							$("#"+formId+" #leademailAlternet").val(leadDemo.leadStudentDetailDTO.emailAlternet);
							//$("#"+formId+" #leadType").val(leadType);
							//if(leadType=='B2B'){
							   if(leadDemo.leadStudentDetailDTO.isdCountryCode==null || leadDemo.leadStudentDetailDTO.isdCountryCode==''){
								   $('#'+formId+' #pCountryCode').val('us');
								   $('#'+formId+' #isdCode').val('1');
							   }else{
								   $("#"+formId+" #pCountryCode").val(leadDemo.leadStudentDetailDTO.isdCountryCode);
								   $("#"+formId+" #isdCode").val(leadDemo.leadStudentDetailDTO.isdCode);
							   }
							   if(leadDemo.leadStudentDetailDTO.isdCountryCodeAlter==null || leadDemo.leadStudentDetailDTO.isdCountryCodeAlter==''){
								   $('#'+formId+' #pCountryCodeAlter').val('us');
								   $('#'+formId+' #isdCodeAlter').val('1');
							   }else{
								   $("#"+formId+" #pCountryCodeAlter").val(leadDemo.leadStudentDetailDTO.isdCountryCodeAlter);
								   $("#"+formId+" #isdCodeAlter").val(leadDemo.leadStudentDetailDTO.isdCodeAlter);
							   }
							   
							   if (itiPhoneNumber && typeof itiPhoneNumber.destroy === 'function') {
								   itiPhoneNumber.destroy();
							   }
							   var phoneNumber = document.querySelector("#"+formId+" #phoneNo");
							   itiPhoneNumber = window.intlTelInput(phoneNumber, {
								   //separateDialCode: true,
							   });
							   itiPhoneNumber.setCountry($('#'+formId+' #pCountryCode').val());
							   phoneNumber.addEventListener('countrychange', function(e) {
								   //console.log("itiPhone=>", itiPhoneNumber.getSelectedCountryData());
								   $('#'+formId+' #pCountryCode').val(itiPhoneNumber.getSelectedCountryData().iso2);
								   $('#'+formId+' #isdCode').val(itiPhoneNumber.getSelectedCountryData().dialCode);
							   });
							   
							   if (itiAltPhoneNumber && typeof itiAltPhoneNumber.destroy === 'function') {
								   itiAltPhoneNumber.destroy();
							   }
							   var altPhoneNumber = document.querySelector("#"+formId+" #phoneNoAlter");
							   itiAltPhoneNumber= window.intlTelInput(altPhoneNumber, {
								   //separateDialCode: true,
							   });
							   altPhoneNumber.addEventListener('countrychange', function(e) {
								   //console.log("itiPhone=>", itiAltPhoneNumber.getSelectedCountryData());
								   $('#'+formId+' #pCountryCodeAlter').val(itiAltPhoneNumber.getSelectedCountryData().iso2);
								   $('#'+formId+' #isdCodeAlter').val(itiAltPhoneNumber.getSelectedCountryData().dialCode);
							   });
							   if(leadDemo.leadStudentDetailDTO.isdCountryCodeAlter!=null || leadDemo.leadStudentDetailDTO.isdCountryCodeAlter !=''){
								   itiAltPhoneNumber.setCountry($('#'+formId+' #pCountryCodeAlter').val());
							   }
							// }else{
							//    $("#"+formId+" #isdCode").val(leadDemo.leadStudentDetailDTO.isdCode).trigger('change');
							// 	$("#"+formId+" #isdCodeAlter").val(leadDemo.leadStudentDetailDTO.isdCodeAlter).trigger('change');
							// }
							
							$("#"+formId+" #phoneNoAlter").val(leadDemo.leadStudentDetailDTO.phoneNoAlter);
							
							$("#"+formId+" #leadstdfname").val(leadDemo.leadStudentDetailDTO.stdFname);
							$("#"+formId+" #leadstdmname").val(leadDemo.leadStudentDetailDTO.stdMname);
							$("#"+formId+" #leadstdlname").val(leadDemo.leadStudentDetailDTO.stdLname);
							$("#"+formId+" #leadGender").val(leadDemo.leadStudentDetailDTO.gender);
							$("#"+formId+" #leadGuardfname").val(leadDemo.leadStudentDetailDTO.gurdianFname);
							$("#"+formId+" #leadGuardmname").val(leadDemo.leadStudentDetailDTO.gurdianMname);
							$("#"+formId+" #leadGuardlname").val(leadDemo.leadStudentDetailDTO.gurdianLname);
							//$("#"+formId+" #countryId").val(leadDemo.leadStudentDetailDTO.country);
							 $("#"+formId+" #countryId").val(leadDemo.leadStudentDetailDTO.country).trigger('change');
							setTimeout(function () {
								callStates(formId, leadDemo.leadStudentDetailDTO.country, 'countryId');
								$("#"+formId+" #stateId").val(leadDemo.leadStudentDetailDTO.state);
							  }, 1000);
							setTimeout(function () {
								callCities(formId, leadDemo.leadStudentDetailDTO.state, 'stateId');
								$("#"+formId+" #cityId").val(leadDemo.leadStudentDetailDTO.city);
							  }, 1000);  
							
							$("#"+formId+" #leadPin").val(leadDemo.leadStudentDetailDTO.pincode);
							$("#"+formId+" #leadAdd").val(leadDemo.leadStudentDetailDTO.address);
						   
							
							if(leadType=='B2B'){
								$("#"+formId+" #leadAssignTo").val(leadDemo.leadModifyDTO.assignTo).trigger('change');
								//$("#"+formId+" #leadStatus").val(leadDemo.leadModifyDTO.leadStatus);
							}else{
							   $("#"+formId+" #leadAssignTo").val(leadDemo.leadModifyDTO.assignTo)
							   $("#"+formId+" #leadStatus").val(leadDemo.leadModifyDTO.leadStatus);
							}
							$("#"+formId+" #leadSupportTo").val(leadDemo.leadStudentDetailDTO.relationType);
							$("#"+formId+" #countrolType").val(controlType);
							var leadMergeList =  data['leadDashboardCommon']['leadCommonDTO'];
							if(leadMergeList.length>0){
								$("#"+formId+" #mergeLeads").val(leadId);
								$("#mergeleadlist").html('');
								var htmld= getLeadMergeDataHtml(leadMergeList, leadDemo.leadModifyDTO.leadId);
								$("#mergeleadlist").html(htmld);
								clickRedioForMergeLead(formId, modalId, leadType);
							}
					   }
					}
				}
			 }
		 },
		error : function(e) {
			console.log(e);
		}
	});
}

function getRequestForMergeLeadIds(formId, leadId, userId, leadType) {
	var leadAddFormRequestDTO = {};
	var authentication = {};
	var leadCommonDTO = {};
	var leadModifyDTO={};
	leadModifyDTO['isUserWise'] = false;
	leadModifyDTO['isLeadSearch'] = true;
	leadModifyDTO['leadId'] = leadId;
	leadModifyDTO['clickFrom'] = 'ByIdSearch';
	leadModifyDTO['schoolId'] = SCHOOL_ID;
	leadModifyDTO['leadType'] = leadType;
	leadModifyDTO['leadFrom']='MERGE';
	leadCommonDTO['leadModifyDTO']=leadModifyDTO;
   
	authentication['hash'] = getHash();
	authentication['schoolId'] = SCHOOL_ID;
	authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userId'] = userId;
	authentication['userType'] = 'COMMON';
	leadAddFormRequestDTO['authentication'] = authentication;
	leadAddFormRequestDTO['leadCommonDTO'] = leadCommonDTO;
	return leadAddFormRequestDTO;
}

function getLeadMergeDataHtml(mergeLeadList, lid){
	var htmlLead="";
	htmlLead=htmlLead+'<table class="table table-bordered table-striped" style="font-size:11px;">';
	htmlLead=htmlLead+'<thead><tr><th>Sr. No.</th><th>Lead No<br/>Lead Source</th><th>Lead Status<br/>Lead Assign</th><th>Child Name<br/>Grade<br/>City | Country</th><th>Contact Info</th></tr></thead>';
	htmlLead=htmlLead+'<tbody>';
	if(mergeLeadList!=null && mergeLeadList.length>0){
		var mindex=1;
		for (let m = 0; m < mergeLeadList.length; m++) {
			const leads = mergeLeadList[m];
			htmlLead=htmlLead+'<tr>';
			htmlLead=htmlLead+'<td>'+(mindex)+'';
			htmlLead=htmlLead+'<input type="radio" class="checkMergerRadioLead" id="lead-'+leads.leadModifyDTO.leadId+'" name="lead-merge-another" value="'+leads.leadModifyDTO.leadId+'" '+(lid==leads.leadModifyDTO.leadId?"checked":"")+' /> ';
			htmlLead=htmlLead+'</td>';
			htmlLead=htmlLead+'<td>'+leads.leadModifyDTO.leadNo+'<br/>'+leads.leadModifyDTO.leadSourceName+'</td>';
			htmlLead=htmlLead+'<td>'+leads.leadModifyDTO.leadStatus+'<br/>'+leads.leadModifyDTO.assignName+'</td>';
			htmlLead=htmlLead+'<td>'+leads.leadStudentDetailDTO.stdFname+' '+leads.leadStudentDetailDTO.stdMname+' '+leads.leadStudentDetailDTO.stdLname+'<br/>'+(leads.leadStudentDetailDTO.standardName!=''?leads.leadStudentDetailDTO.standardName:'N/A');
			htmlLead=htmlLead+'<br/>'+(leads.leadStudentDetailDTO.cityName!=''?leads.leadStudentDetailDTO.cityName:'N/A')+' | '+leads.leadStudentDetailDTO.countryName+'</td>';
			htmlLead=htmlLead+'<td>'+leads.leadStudentDetailDTO.isdCode+' '+leads.leadStudentDetailDTO.phoneNo;
			if(leads.leadStudentDetailDTO.phoneNoAlter!=''){
				htmlLead=htmlLead+'<br/>'+leads.leadStudentDetailDTO.isdCodeAlter+' '+leads.leadStudentDetailDTO.phoneNoAlter;
			}
			htmlLead=htmlLead+'<br/>'+leads.leadStudentDetailDTO.email+'<br/>'+leads.leadStudentDetailDTO.emailAlternet+'</td>';
			
			htmlLead=htmlLead+'</tr>';
			mindex=mindex+1;
		}
	}
	htmlLead=htmlLead+'</tbody>';
	htmlLead=htmlLead+'</table>';
	return htmlLead;
}

function clickRedioForMergeLead(formId, formpopup, leadtype){
	$('.checkMergerRadioLead').on('change',function() {
		//console.log('checkMergerRadioLead')
		var leadCheckId='';	
		var leadNotCheckId='';
		var leadNewIds='';
		 $.each($("input[name='lead-merge-another']"), function(){
				 if ($(this).is(":checked")) {
					leadCheckId=leadCheckId+','+$(this).val();
				}else{
					leadNotCheckId=leadNotCheckId+','+$(this).val();
				}
				
		 });
		 leadnew = leadCheckId + leadNotCheckId;
		 var leadId =leadnew.substring(1,leadnew.lenght);
			//console.log(leadId);
			// var urlSend = '/dashboard/lead-merge-data?moduleId=${moduleId}&leadId='+leadId+'&leadFrom=MERGE&currentPage=${currentPage}&isSearch=false&countrolType=edit&leadType=B2C';
			// getAsPost(urlSend,'self');
			callLeadMergeData(formId, leadId, ''+USER_ID+'', 'edit', formpopup,leadtype,1)
	});
}


function saveCampaignMaster(formId, campid, activeInactive ) {
	hideMessageTheme2('');
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLFor('leads','save-campaign-data'),
		data : JSON.stringify(getRequestForCampaignMaster(formId, campid, activeInactive)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data['statusCode'] == '0' || data['statusCode'] == '2') {
				showMessageTheme2(0, data['message'],'',true);
			} else {
				showMessageTheme2(1, data['message'],'',false);
				$("#"+formId+" #leadCampaignName").val('');
				$("#"+formId+" #campaignStartDate").val('');
				callCampainList(false,'');
				//callCampainList(true,'leadSearchCampaign');
				callCampainList(true,'selectcampain');
				//window.location.reload();
			}
			return false;
		},
		error : function(e) {
			//showMessage(true, e.responseText);
			return false;
		}
	});
}
function getRequestForCampaignMaster(formId, campid, activeInactive){
	var campaignRequest = {};

	campaignRequest['campainId'] =campid;
	campaignRequest['userId'] = USER_ID;
	campaignRequest['schoolId'] = SCHOOL_ID;
	campaignRequest['campainName'] =$("#"+formId+" #leadCampaignName").val();

	campaignRequest['startDate']=$("#"+formId+" #campaignStartDate").val();
	campaignRequest['endDate']='2999-12-31';
	campaignRequest['activeInactive'] = activeInactive;
	
	return campaignRequest;
}

function callCampainList(dropdownStatus, elementIdid) {
	data={};
	data['schoolId']=SCHOOL_ID;
	
	$.ajax({
			type : "POST",
			contentType : "application/json",
			url : getURLForHTML('/api/v1/leads', 'get-campaign-list'),
			data : JSON.stringify(data),
			dataType : 'json',
			cache : false,
			timeout : 600000,
			success : function(data) {//console.log('get-campaign-list data :: ' + data);
				if (data['status'] == '0' || data['status'] == '2') {
					showMessage(true, data['message']);
				} else {
					if(dropdownStatus){
						var campList = data.campainNameList;
						//console.log(campList);
						if(campList.length>0){
							$("."+elementIdid).html('');
							var option='<option value=""></option>';
							var option='';
							for (let l = 0; l < campList.length; l++) {
								const camp = campList[l];
								option=option+'<option value="'+camp.campainName+'">'+camp.campainName+'</option>';
							}
							$("."+elementIdid).html(option);
						}

					}else{
						var html=getLeadMergeDataPopup(data.campainNameList);
						$('#tblCampaignList').dataTable().fnDestroy();
						$("#campaignlist").html(html);
						$('#tblCampaignList').dataTable();
					}
				}
			},
		   error : function(e) {
			   console.log(e);
		   }
	   });
   }

   function getLeadMergeDataPopup(campaignList, lid){
	var htmlLead="";
	if(campaignList!=null && campaignList.length>0){
		var mindex=1;
		for (let m = 0; m < campaignList.length; m++) {
			const campaign = campaignList[m];
			htmlLead=htmlLead+'<tr>';
			htmlLead=htmlLead+'<td>'+(mindex)+'</td>';
			htmlLead=htmlLead+'<td>'+campaign.campainName+'</td>';
			htmlLead=htmlLead+'<td>'+campaign.startDate+'</td>';
			htmlLead=htmlLead+'<td>'+campaign.endDate+'</td>';
			htmlLead=htmlLead+'<td>';
			htmlLead=htmlLead+'<label class="switch" >';
			var clickFun ="inactiveCampaignMaster('"+campaign.campainId+"', '"+campaign.activeInactive+"')";
			htmlLead=htmlLead+'<input class="switch-input assignActiveCouns"  type="checkbox" '+(campaign.activeInactive=='Y' ? 'checked':'')+'  value="'+campaign.activeInactive+'" ';
			htmlLead=htmlLead+'onclick="'+clickFun+'"  data-size="mini"/>';
			htmlLead=htmlLead+'<span class="switch-label" data-on="Yes" data-off="No"></span> <span class="switch-handle"></span> ';
			htmlLead=htmlLead+'</label>';
			htmlLead=htmlLead+'</td>';
			
			htmlLead=htmlLead+'</tr>';
			mindex=mindex+1;
		}
	}
	return htmlLead;
}

function inactiveCampaignMaster( campid, activeInactive ) {
	hideMessageTheme2('');
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLFor('leads','inactive-campaign'),
		data : JSON.stringify(getRequestForInactiveCampaignMaster(campid, activeInactive)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data['statusCode'] == '0' || data['statusCode'] == '2') {
				showMessageTheme2(0, data['message'],'',true);
			} else {
				showMessageTheme2(1, data['message'],'',false);
				callCampainList(false,'');
			}
			return false;
		},
		error : function(e) {
			//showMessage(true, e.responseText);
			return false;
		}
	});
}
function getRequestForInactiveCampaignMaster(campid, activeInactive){
	var campaignRequest = {};
	campaignRequest['campainId']=campid;
	campaignRequest['userId']=USER_ID;
	campaignRequest['schoolId']=SCHOOL_ID;
	if(activeInactive=='Y'){
		activeInactive='N';
	}else if(activeInactive=='N'){
		activeInactive='Y';
	}
	campaignRequest['activeInactive']=activeInactive;
	return campaignRequest;
}



function getPartnerLeadById(formId, leadId, modalId) {
 $.ajax({
		 type : "POST",
		 contentType : "application/json",
		 url : getURLForHTML('/api/v1/leads', 'get-lead-data-byid'),
		 data : JSON.stringify(getRequestForPartnerByLeadId(formId, leadId)),
		 dataType : 'json',
		 cache : false,
		 timeout : 600000,
		 success : function(data) {
			 if (data['status'] == '0' || data['status'] == '2') {
				 showMessage(true, data['message']);
			 } else {
				$("#"+modalId).modal('show');
				 
				if(data['leadDashboardCommon']!=null){
					if(data['leadDashboardCommon']['leadCommonDTO']!=null){
					   var leadDemo = data['leadDashboardCommon']['leadCommonDTO'][0];
					   //console.log(leadDemo);
					    $("#"+formId+" #leadId").val(leadDemo.leadModifyDTO.leadId);
						$("#"+formId+" #rawLeadId").val(leadDemo.leadDemoInfo.rawLeadId);
						
						$("#"+formId+" #email").val(leadDemo.leadStudentDetailDTO.email);
						$("#"+formId+" #fname").val(leadDemo.leadStudentDetailDTO.stdFname);
						$("#"+formId+" #mname").val(leadDemo.leadStudentDetailDTO.stdMname);
						$("#"+formId+" #lname").val(leadDemo.leadStudentDetailDTO.stdLname);
						$("#"+formId+" #phoneNo").val(leadDemo.leadStudentDetailDTO.phoneNo);
						if(leadDemo.leadStudentDetailDTO.isdCountryCode==null || leadDemo.leadStudentDetailDTO.isdCountryCode==''){
							$('#'+formId+' #pCountryCode').val('us');
							$('#'+formId+' #isdCode').val('1');
						}else{
							$("#"+formId+" #pCountryCode").val(leadDemo.leadStudentDetailDTO.isdCountryCode);
							$("#"+formId+" #isdCode").val(leadDemo.leadStudentDetailDTO.isdCode);
						}

						if (itiPhoneNumber && typeof itiPhoneNumber.destroy === 'function') {
							itiPhoneNumber.destroy();
						}
						var phoneNumber = document.querySelector("#"+formId+" #phoneNo");
						itiPhoneNumber = window.intlTelInput(phoneNumber, {
							//separateDialCode: true,
						});
						itiPhoneNumber.setCountry($('#'+formId+' #pCountryCode').val());
						phoneNumber.addEventListener('countrychange', function(e) {
							//console.log("itiPhone=>", itiPhoneNumber.getSelectedCountryData());
							$('#'+formId+' #pCountryCode').val(itiPhoneNumber.getSelectedCountryData().iso2);
							$('#'+formId+' #isdCode').val(itiPhoneNumber.getSelectedCountryData().dialCode);
						});

						$("#"+formId+" #countryId").val(leadDemo.leadStudentDetailDTO.country);
						setTimeout(function () {
							callStates(formId, leadDemo.leadStudentDetailDTO.country, 'countryId');
							$("#"+formId+" #stateId").val(leadDemo.leadStudentDetailDTO.state);
							$("#"+formId+" #stateId").attr("disabled","disabled");
						}, 1000);
						setTimeout(function () {
							callCities(formId, leadDemo.leadStudentDetailDTO.state, 'stateId');
							$("#"+formId+" #cityId").val(leadDemo.leadStudentDetailDTO.city);
							$("#"+formId+" #cityId").attr("disabled","disabled");
							$("#"+formId+" #partnerType").val(leadDemo.leadModifyDTO.partnerTypeId);
							$("#"+formId+" #originalTimezone").val(leadDemo.leadModifyDTO.originalPartnerTimzone).trigger('change');
						}, 1000);  
						$("#"+formId+" #originalPartnerType").val(leadDemo.leadStudentDetailDTO.originalPartnerType);
						if(leadDemo.leadStudentDetailDTO.originalPartnerType == "WLP"){
							$("#setDiscount, #setDiscountTab").attr("style","");
							$("#setCommissionRate, #setCommissionRateTab").hide();
						}else if(leadDemo.leadStudentDetailDTO.originalPartnerType == "GP"){
							$("#setCommissionRate, #setCommissionRateTab").attr("style","");
							$("#setDiscount, #setDiscountTab").hide();
						}
						$("#"+formId+" #commissionPayout").val(leadDemo.leadModifyDTO.commissionPayout);
						$("#"+formId+" #whiteLabel").val(leadDemo.leadModifyDTO.whiteLabel);
						$("#"+formId+" #enrollingStudent").val(leadDemo.leadModifyDTO.enrollingStudent);
				   }
				}
			 }
		 },
		error : function(e) {
			console.log(e);
		}
	});
}

function getRequestForPartnerByLeadId(formId, leadId) {
 var leadAddFormRequestDTO = {};
 var authentication = {};
 var leadCommonDTO = {};
 var leadModifyDTO={};
    leadModifyDTO['isUserWise'] = false;
    leadModifyDTO['isLeadSearch'] = true;
    leadModifyDTO['leadId'] = leadId;
    leadModifyDTO['clickFrom'] = 'ByIdSearch';
    leadModifyDTO['schoolId'] = SCHOOL_ID;
    leadModifyDTO['leadType'] = 'B2B';
    leadModifyDTO['controlType']='edit';
	leadModifyDTO['leadFrom']='list';
    
    leadCommonDTO['leadModifyDTO']=leadModifyDTO;

    authentication['hash'] = getHash();
    authentication['schoolId'] = SCHOOL_ID;
    authentication['schoolUUID'] = SCHOOL_UUID;
    authentication['userId'] = USER_ID;
    authentication['userType'] = 'COMMON';
    leadAddFormRequestDTO['authentication'] = authentication;
    leadAddFormRequestDTO['leadCommonDTO'] = leadCommonDTO;
    return leadAddFormRequestDTO;
}


function createPartnerUser(formId, leadId, modalId, partnerTypeId, epdetailUpdateStatus){
	if(epdetailUpdateStatus!='Y'){
		showMessageTheme2(0, 'Please update the Enrollment Partner Form before creating the partner dashboard.','',true);
	}else{
		renderPartnerCotent(partnerTypeId);
		getPartnerLeadById(formId, leadId, modalId);
	}
	
}


function savePatnerWithReferralCode(formId, elementId) {
	hideMessageTheme2('');

	if($("#"+formId+" #partnerType").val()=='' 
		|| $("#"+formId+" #partnerType").val()==undefined){
		showMessageTheme2(false, 'Please select Location Partner Type');
		return false;
	}
	if($("#"+formId+" #originalPartnerType").val()=='' 
		||  $("#"+formId+" #originalPartnerType").val()==undefined){
		showMessageTheme2(false, 'Please select Partner Type');
		return false;
	}
	if($("#"+formId+" #originalTimezone").val()=='' 
		||  $("#"+formId+" #originalTimezone").val()==undefined){
		showMessageTheme2(false, 'Please select Timezone');
		return false;
	}


	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForHTML('dashboard', 'save-referralcode-partner'),
		data : JSON.stringify(getRequestForPartnerWithReferral(formId)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessageTheme2(false, data['message']);
			} else {

				//var html=getLeadMergeDataPopup(data.campainNameList);
				// $('#tblCampaignList').dataTable().fnDestroy();
				// $("#campaignlist").html(html);
				// $('#tblCampaignList').dataTable();
				if($("#originalPartnerType").val() == "WLP"){
					$("#setCommissionRate, #setCommissionRateTab").hide();
					$("#setDiscount, #setDiscountTab").attr("style","");
				}else{
					$("#setCommissionRate, #setCommissionRateTab").attr("style","");
					$("#setDiscount, #setDiscountTab").hide();
				}
				showMessageTheme2(true, data['message']);
			}
		},
		error : function(e) {
			console.log(e);
		}
	});
   }

function getRequestForPartnerWithReferral(formId){
	var data = {};
	data['userId']=USER_ID;
	data['schoolId']=SCHOOL_ID;
	data['leadId']=$("#"+formId+" #leadId").val();
	data['rawLeadId']=$("#"+formId+" #rawLeadId").val();
	data['fname']=$("#"+formId+" #fname").val();
	data['mname']=$("#"+formId+" #mname").val();
	data['lname']=$("#"+formId+" #lname").val();
	if($("#"+formId+" #fname").val()!='' && $("#"+formId+" #mname").val()!='' && $("#"+formId+" #lname").val()!=''){
		data['userFullName']=$("#"+formId+" #fname").val()+' '+$("#"+formId+" #mname").val()+' '+$("#"+formId+" #lname").val();
	}else if($("#"+formId+" #fname").val()!='' && $("#"+formId+" #lname").val()!=''){
		data['userFullName']=$("#"+formId+" #fname").val()+' '+$("#"+formId+" #lname").val();
	}else{
		data['userFullName']=$("#"+formId+" #fname").val();
	}
	data['email']=$("#"+formId+" #email").val();
	data['partnerType']=$("#"+formId+" #partnerType").val();
	data['countryId']=$("#"+formId+" #countryId").val();
	data['stateId']=$("#"+formId+" #stateId").val();
	data['cityId']=$("#"+formId+" #cityId").val();
	data['originalPartnerType']=$("#"+formId+" #originalPartnerType").val();
	data['originalTimezoneId']=$("#"+formId+" #originalTimezone option:selected").attr("custom_timezone_id");
	data['originalTimezone']=$("#"+formId+" #originalTimezone").val();
	data['commissionPayout']=$("#"+formId+" #commissionPayout").val();
	data['whiteLabel']=$("#"+formId+" #whiteLabel").val();
	data['enrollingStudent']=$("#"+formId+" #enrollingStudent").val();
	return data;
}

function callPCountries(formId, value, elementId, preSelected) {
	$("#" + formId + " #" + elementId).html('<option value="">Select country*</option>');
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLForCommon('masters'),
		data: JSON.stringify(getRequestForMaster(formId, 'COUNTRIES-LIST', value)),
		dataType: 'json',
		async: false,
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(1, data['message']);
			} else {
				var countries = data['mastersData']['countries']
				$.each(countries, function(k, v) {
					$("#" + formId + " #" + elementId).append('<option dailCode="'+v.extra1+'" dail-country-code="'+v.extra+'" value="'+v.key+'" '+(preSelected==v.key?'selected':'')+'>'+v.value+'</option>');
				});
			}
		}
	});
	return true;
}

function getPartnerTypeList(formId, value,elementId, preSelected) {
	$("#" + formId + " #" + elementId).html('<option value="">Select Partner type*</option>');
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLForCommon('masters'),
		data: JSON.stringify(getRequestForMaster(formId,'PARTNER-TYPE-LIST', value)),
		dataType: 'json',
		cache: false,
		timeout: 600000,
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessageTheme2(true, data['message']);
			} else {
				var partnerType = data['mastersData']['data'];
				$.each(partnerType, function(k, v) {
					$("#" + formId + " #" + elementId).append('<option dailCode="'+v.extra1+'" dail-country-code="'+v.extra+'" value="'+v.key+'" '+(preSelected==v.key?'selected':'')+'>'+v.value+'</option>');
				});

			}
		},
		error: function (e) {
			customLoader(false);
			showMessageRequestDemoPage(true, e.responseText, 'serverError', '');
		}
	});
}
function flushUploadedDocument(){
	uploadDocs=[];
}
function getUploadedDocuments(){
	var uplodedDocuments=[];
	for(var index=1;index<=5;index++){
		if($('#OD'+index+'div').length>0){
			if($('#OD'+index+'div').attr('upload')!='N'){
				var fileObj = new Object({
					"uploaded":$('#OD'+index+'div').attr('uploaded'),
					"filePath":$('#OD'+index+'div').attr('data-PDFURL'),
					"fileName":$('#OD'+index+'div').attr('fileName'),
					"docType":$('#OD'+index+'div').attr('docType'),
					"imgID":'OD'+index+'Icon'
				});
				uplodedDocuments.push(fileObj)
			}
		}
	}
	return uplodedDocuments;
}

function disposeLeadupdateForm(){
	$('#supportHtmlFollowup').html('');
	flushUploadedDocument();
	$('#leadPopupForm').modal('hide');
	// $('#leadPopupForm').modal({ backdrop: 'static', keyboard: false })
}
function getRequestForLeadsDocuments(userId, leadId, documentsFor){
	var leadDocumentRequest = {};
	leadDocumentRequest['userId'] = userId;
	leadDocumentRequest['entityId'] = leadId;
	leadDocumentRequest['entityType'] = 'LEADS';
	leadDocumentRequest['documentsFor'] = documentsFor;
	return leadDocumentRequest;
}

function getLeadDocuments(userId, leadId, documentsFor) {
	var responseData={};
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : BASE_URL + CONTEXT_PATH + SCHOOL_UUID +'/api/v1/leads/lead-documents',
		data : JSON.stringify(getRequestForLeadsDocuments(userId, leadId, documentsFor)),
		dataType : 'json',
		async : false,
		global : false,
		success : function(data) {
			responseData=data
		},
		error: function(e){
			if (checkonlineOfflineStatus()) {
				return;
			}
		}
	});
	return responseData;
}

function getRequestForSaveChatLog(userId, leadId, documentsFor){
	var chatLogRequest = {};
	chatLogRequest['entityType'] = 'LEADS';
	chatLogRequest['entityId'] = leadId;
	chatLogRequest['userId'] = userId;
	chatLogRequest['chatFrom'] = $('#chatSupport').val();
	chatLogRequest['chatDate'] = $('#chatDate').val();
	chatLogRequest['uploadDocuments'] = getUploadedDocuments();
	return chatLogRequest;
}
function saveChatLogs(discardPermission, userId, leadId, documentsFor, dataInputID, uploadInputDivId){
	if ($("#"+dataInputID).val()=='') {
		showMessageTheme2(0, 'Select chat date.','',true);
		return false
	}
	if ($("#"+uploadInputDivId).attr("uploaded")!='Y') {
		showMessageTheme2(0, 'Please upload a document.','',true);
		return false
	}
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : BASE_URL + CONTEXT_PATH + SCHOOL_UUID +'/api/v1/leads/save-chat-log',
		data : JSON.stringify(getRequestForSaveChatLog(userId, leadId, documentsFor)),
		dataType : 'json',
		async : false,
		global : false,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if (data['status'] == '3') {
					redirectLoginPage();
				} else {
					showMessageTheme2(0, data['message']);
				}
			}else{
				$('#isuploaded').val('true');
				uploadedChatLogs(discardPermission, userId, leadId);
				resetChatSupportFormElement();
				showMessageTheme2(1, data['message']);
			}
		},
		error: function(e){
			if (checkonlineOfflineStatus()) {
				return;
			}
		}
	});
}

function getRequestForChatDetails(userId, leadId, documentsFor){
	var chatSupportRequest = {};
	chatSupportRequest['userId'] = userId;
	chatSupportRequest['entityId'] = leadId;
	chatSupportRequest['entityType'] = 'LEADS';
	chatSupportRequest['documentsFor'] = documentsFor;
	return chatSupportRequest;
}

function getLeadChatDetails(userId, leadId, documentsFor) {
	var responseData={};
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : BASE_URL + CONTEXT_PATH + SCHOOL_UUID +'/api/v1/leads/lead-chat-details',
		data : JSON.stringify(getRequestForChatDetails(userId, leadId, documentsFor)),
		dataType : 'json',
		async : false,
		global : false,
		success : function(data) {
			responseData=data
		},
		error: function(e){
			if (checkonlineOfflineStatus()) {
				return;
			}
		}
	});
	return responseData;
}
function resetLeadUpdate(){
	$('#leadPopupForm').modal('hide');
	$('#supportHtmlFollowup').html('');
	$('#documentDiv').html('');
}

function resetLeadChat(callFrom){
	$('#updateChatSupportDocs').modal('hide');
	//$('#supportHtmlChats').html('');
	// window.setTimeout(function () { $('#supportHtmlChats').html(''); }, 1500);
	if($('#isuploaded').val()=='true'){
		var leadType = $("#leadType").val();
		if(callFrom=='new-leads'){
			getLeadDataList('advanceLeadNewSearchForm','advance-search', 'list','0', 'new', true,'', OBJECT_RIGHTS, ROLE_MODULE);
		}else{
			advanceLeadSearchStudent('advanceLeadNewSearchForm','', 'advance-search','', '0', 'new', true,'',''+leadType+'');
		}
	}
}

function saveCategoryLead(leadid, elementId ) {
	hideMessageTheme2('');
	if($("#"+elementId).val()==''){
		showMessageTheme2(0, 'Please select campaign','',true);
		return false;
	}
$.ajax({
	type : "POST",
	contentType : "application/json",
	url : getURLFor('leads','lead-category-update'),
	data : JSON.stringify(getRequestForLeadCategory(leadid, elementId)),
	dataType : 'json',
	cache : false,
	timeout : 600000,
	success : function(data) {
		if (data['statusCode'] == '0' || data['statusCode'] == '2') {
			showMessageTheme2(0, data['message'],'',true);
		} else {
			showMessageTheme2(1, data['message'],'',false);
			//window.location.reload();
		}
		return false;
	},
	error : function(e) {
		//showMessage(true, e.responseText);
		return false;
	}
});
}
function getRequestForLeadCategory(leadid, elementId){
var leadAddFormRequestDTO = {};
var authentication = {};
var leadCommonDTO = {};
var leadModifyDTO ={};
var leadDemoInfo={};
var leadModifyDetailDTO={};
var leadStudentDetailDTO={};
var leadCallFollowupDTO={};
var leadCountDetailDTO={};

leadModifyDTO['leadId'] =leadid;
if($("#"+elementId).is(":checked")){
	leadModifyDetailDTO['leadCategory'] = $("#"+elementId).val();
}


leadCommonDTO['leadModifyDTO']=leadModifyDTO;
leadCommonDTO['leadDemoInfo']=leadDemoInfo;
leadCommonDTO['leadModifyDetailDTO']=leadModifyDetailDTO;
leadCommonDTO['leadCallFollowupDTO']=leadCallFollowupDTO;
leadCommonDTO['leadStudentDetailDTO']=leadStudentDetailDTO;
leadCommonDTO['leadCountDetailDTO']=leadCountDetailDTO;

authentication['hash'] = getHash();
authentication['schoolId'] = SCHOOL_ID;
authentication['schoolUUID'] = SCHOOL_UUID;
authentication['userId'] = USER_ID;
authentication['userType'] = 'COMMON';
leadAddFormRequestDTO['authentication'] = authentication;
leadAddFormRequestDTO['leadCommonDTO'] = leadCommonDTO;
return leadAddFormRequestDTO;
}



function submitFollowupSaveFromLeadList(formId, leadId,  leadType, roleModuleId, callFrom) {
	hideMessageTheme2('');
	if ($('#leadStatus-'+leadId).val()==undefined || $('#leadStatus-'+leadId).val()=='') {
		showMessageTheme2(0, 'Please select lead Status','',true);
		return false;
	}
	var leadStatus =$('#leadStatus-'+leadId).val();
	var remark='';
	if ($('#followupRemarks-'+leadId).val()==undefined || $('#followupRemarks-'+leadId).val()=='') {
		showMessageTheme2(0, 'Please fill followup Remarks','',true);
		return false;
	}
	if($('#followupRemarks-'+leadId).val()!=''){
		remark=escapeCharacters($('#followupRemarks-'+leadId).val());
	}
	
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLFor('leads','save-leads-followup'),
		data : JSON.stringify(getRequestForFollowupSaveFromLeadList(formId,leadId,leadStatus,remark, leadType)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			//console.log(data);
			if (data['status'] == '0' || data['status'] == '2') {
				showMessageTheme2(0, data['message'],'',true);
				return false;
			} else {
				//showMessage(false, data['message']);
				showMessageTheme2(1, data['message'],'',false);
				
				$(".nextSchedule-"+leadId).html("<b>"+data['extra1']+"</b>");
				$(".nextFollow-"+leadId).html("<b>NO FOLLOWUP</b>");
				$(".leadlist-status-"+leadId).html("<b>"+$('#leadStatus-'+leadId+' option:selected').text()+"</b>")
				$(".leadlist-remark-"+leadId).html("<b>"+data['extra3']+"</b>");

				var lType=leadType.toString().toLowerCase();
				$(".nextSchedule-"+leadId).addClass(""+lType+"-"+data['extra2']+"-leadno-bg");
				$(".nextFollow-"+leadId).addClass(""+lType+"-"+data['extra2']+"-leadno-bg");
				$(".leadlist-remark-"+leadId).addClass(""+lType+"-"+data['extra2']+"-leadno-bg");
				
				var clsLead=$(".lead-row-"+leadId).attr('class');
				var arrCss = clsLead.split(" ");
				var lastCssRow = arrCss[arrCss.length - 1];
				var lastCssNew = clsLead.replace(lastCssRow, ""+lType+"-"+data['extra2']+"-bg");
				$(".lead-row-"+leadId).attr('class',lastCssNew)//addClass(""+lType+"-"+data['extra2']+"-bg");

				var clsLeadTd=$(".lead-row-td-"+leadId).attr('class');
				var arrCssTd = clsLeadTd.split(" ");
				var lastCssRowTd = arrCssTd[arrCssTd.length - 1];
				var lastCssNewTd = clsLeadTd.replace(lastCssRowTd, ""+lType+"-"+data['extra2']+"-leadno-bg");
				$(".lead-row-td-"+leadId).attr('class',lastCssNewTd)
				//$(".lead-row-td-"+leadId).addClass(""+lType+"-"+data['extra2']+"-leadno-bg");

				$('#leadStatus-'+leadId).val(0);
				$('#followupRemarks-'+leadId).val('');
				discardPermission = $("#discardPermission").val();
				//advanceLeadSearchStudent('advanceLeadNewSearchForm',roleModuleId, 'advance-search','list' ,data['extra'],'new', true,'', leadType);
				getLeadStatusLog(data['leadno'], callFrom, discardPermission);
			}
			return false;
		},
		error : function(e) {
			//showMessage(true, e.responseText);
			return false;
		}
	});
   }
   function getRequestForFollowupSaveFromLeadList(formId,leadId,leadStatus,remark, leadType){
	   //console.log("getRequestForFollowupSaveFromLeadList");
	   var leadAddFormRequestDTO = {};
	   var authentication = {};
	   var leadCommonDTO = {};
	   var leadModifyDTO={};
	   var leadModifyDetailDTO={};
	   var leadCallFollowupDTO={};
	   var leadDemoInfo={};
	   
	   leadModifyDTO['leadId'] = leadId;
	   leadCallFollowupDTO['followupBy'] ='Call';
	   leadModifyDetailDTO['tentativeDate']='';
	   if(remark!=''){
		   leadCallFollowupDTO['followRemarks'] = remark;//escapeCharacters($("#"+formId+" #followupRemarks").val());
	   }
	   leadCallFollowupDTO['followupRemarkBy'] = USER_ID;
	   leadCallFollowupDTO['toCall'] = 'none';
	   
	   leadCallFollowupDTO['leadFollowStatus'] = leadStatus;
	   leadModifyDTO['leadStatus'] =leadStatus;
	   
	   
	   //$("#"+formId+" #selectStatusOfLead").val();
	   leadCallFollowupDTO['customDate']= 'NO FOLLOWUP';
	   if(leadStatus=='Call Completed'
		   ||leadStatus=='Not Answering | Not reachable | Switch off' ){
			   leadCallFollowupDTO['callBadge'] ='followup1'
	   }
   
	   if(leadStatus=='Call Completed | Hot'
		   ||leadStatus=='Call Completed | Warm'
		   ||leadStatus=='Call Completed | Cold'){
			   leadCallFollowupDTO['callBadge'] ='calldoneb2b'
	   }
	
	   if(leadStatus=='Positive to enrollment'){
		   leadCallFollowupDTO['callBadge'] ='positive'
	   }
	   if(leadStatus=='Share details over WhatsApp | e-mail'
		||leadStatus=='Phone | WhatsApp Call'
		||leadStatus=='Reached out on WhatsApp'
		||leadStatus=='Reached out on Phone Call'
		||leadStatus=='Reached out on Email'){
		   leadCallFollowupDTO['callBadge'] ='followup2'
	   }
	   if(leadStatus=='Need time'
		|| leadStatus=='Other'
		|| leadStatus=='Class Demo Needed'
		|| leadStatus=='Class Demo Completed'
		){
		   leadCallFollowupDTO['callBadge'] ='followup3';	
		}
		
		if(leadStatus=='Duplicate lead'
	  	 ||leadStatus=='Invalid | Cold'){
		   leadCallFollowupDTO['callBadge'] ='red';
	   }
	   if(leadStatus=='Rejected | Cold'){
		   leadCallFollowupDTO['callBadge'] ='rejected';
	   }
   
		if(leadStatus=='Demo Needed'
			|| leadStatus=='Demo Completed'
			||leadStatus=='Demo Reschedule'
			||leadStatus=='Demo Booked'){
			   leadCallFollowupDTO['callBadge'] ='yellow';
		}
		if(leadStatus=='Connect to Impact Recommended'
			||leadStatus=='Connect to Impact Booked'
			||leadStatus=='Connect to Impact Completed'){
			   leadCallFollowupDTO['callBadge'] ='cti';
		}
		
		if(leadStatus=='Booked Seat'){
		   leadCallFollowupDTO['callBadge'] ='darkgreen';
		}
	   if(leadStatus=='Neutral'){
		   leadCallFollowupDTO['callBadge'] ='neutral';
	   }
	   if(leadStatus=='Assigned Working' 
	   	||leadStatus=='Basic Details not Filled | Cold'){
		   leadCallFollowupDTO['callBadge'] ='gray';
	   }
		if(leadStatus=='Converted'
			||leadStatus=='Converted & On Boarding | Hot'){
		   leadCallFollowupDTO['callBadge'] ='green';
		}
	   if(leadStatus=='Looking for next year'){
		   leadCallFollowupDTO['callBadge'] ='nextyear';
	   }
	   if(leadStatus=='Request Under Review | Warm'){
		   leadCallFollowupDTO['callBadge'] ='under-review';
	   }
	   if(leadStatus=='Interested to Interview | Warm'
	   	||leadStatus=='Interested to Interview | Cold'
	   	||leadStatus=='Interested to Interview | Hot'){
		   leadCallFollowupDTO['callBadge'] ='int-inerview';
	   }
	   if(leadStatus=='Moving for the Next meeting | Warm'
	   || leadStatus=='Moving for the Next meeting | Cold'
	   || leadStatus=='Moving for the Next meeting | Hot'){
		   leadCallFollowupDTO['callBadge'] ='move-inerview';
	   }
	   if(leadStatus=='Interview Booked | Cold'){
		   leadCallFollowupDTO['callBadge'] ='inter-booked';
	   }
		
	   if(leadStatus=='Invalid'){
		   leadCallFollowupDTO['callBadge'] ='red';
	   }
	  
	   leadCommonDTO['leadModifyDTO']=leadModifyDTO;
	   leadCommonDTO['leadModifyDetailDTO']=leadModifyDetailDTO;
	   leadCommonDTO['leadCallFollowupDTO']=leadCallFollowupDTO;
	   leadCommonDTO['leadDemoInfo']=leadDemoInfo;
	   //console.log(leadCommonDTO);
	   
	   authentication['hash'] = getHash();
	   authentication['schoolId'] = SCHOOL_ID;
	   authentication['schoolUUID'] = SCHOOL_UUID;
	   authentication['userId'] = USER_ID;
	   authentication['userType'] = 'COMMON';
	   leadAddFormRequestDTO['currentPage'] = $("#" + formId + " #currentPage").val();
	   leadAddFormRequestDTO['authentication'] = authentication;
	   leadAddFormRequestDTO['leadCommonDTO'] = leadCommonDTO;
	   return leadAddFormRequestDTO;
   }

   function uploadLeads(formId) {
	hideMessageTheme2('');
	var fdata = new FormData();
	if($("#"+formId+" #userId").val()!=undefined){
		fdata.append('userId',$("#"+formId+" #userId").val());
	}else{
		fdata.append('userId',USER_ID);
	}

	
	if($("#"+formId+" #fileupload1").get(0).files[0]!=undefined && $("#"+formId+" #fileupload1").get(0).files[0]!=''){
		
		fdata.append('uploadLeadCsv', $("#"+formId+" #fileupload1").get(0).files[0]);
	}else{
		showMessageTheme2(0, 'Please choose csv file','',true);
		return false;
	}
	
	$.ajax({
		type : "POST",
		url : getURLFor('leads','upload-leads-data'),
		data : fdata,
		dataType : 'json',
		type: "POST",
		processData: false,
		contentType: false,
		enctype: 'multipart/form-data',
		success : function(data) {
			//console.log(data);
			if (data['statusCode'] == '0' || data['statusCode'] == '2') {
				showMessageTheme2(0, data['message'],'',false);
			} else {
				//$("#"+formId+" #fileupload1").text('No file chosen...');
				showMessageTheme2(1, data['message'],'',false);
				
			}
			return false;
		},
		error : function(e) {
			//showMessage(true, e.responseText);
			return false;
		}
	});
}

function callTemplateList(dropdownStatus, elementIdid, selectedUserId) { //console.log("leadSearchTemplate :: "  + elementIdid ); //console.log("leadAssign :: "  + $("#leadAssignToSearch option:selected").val()); //console.log("dropdownStatus: " + dropdownStatus + " elementIdid:: " + elementIdid + " selectedUserId:::" + selectedUserId);
	data={};
	data['schoolId']=SCHOOL_ID;
	var selectedUser = '';
	if(selectedUserId){
		data['userId'] = selectedUserId;
	}else{
		data['userId']=USER_ID;
	}
	//data['userId']=selectedUser;
	//console.log("data val :: " + JSON.stringify(data));
	$("#leadSearchDeliveredStatus").val('ALL').trigger('change');
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLFor('leads','get-template-list'),
		data : JSON.stringify(data),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) { 
			//console.log("get-template-list data :: " + JSON.stringify(data));
			templatesNameList=[];
			$.each(data.usersData, function(index, value) { 
				//console.log("index : " + index + "     value :"+ JSON.stringify(value) +" value.status::" + data.status);
				//$.each(data.messageTemplates, function(index, value) { //console.log("index : " + index + "     value :"+ JSON.stringify(value) +" value.status::" + value.status);
				templateData = {}; 
				templatesNameDataList=[];
				$.each(value.messageTemplates, function(innindex, value) {
					templateNames = {}; 
					templateNames['userTemplateName'] = value.elementName;
					templatesNameDataList.push(templateNames);
				});
				templateData['ID'] = index;
				templateData['templateName'] = templatesNameDataList;
				templateData['counsellorName'] = value.userName;
				templatesNameList.push(templateData);
			});
			//console.log("templatesNameList :: "+ JSON.stringify(templatesNameList) + " total:: "+templatesNameList.length);
			$("."+elementIdid).html('');
			if(templatesNameList.length>0){
				$("#leadSearchDeliveredStatus").removeAttr('disabled');
				$("#leadSearchDeliveredStatus").prop("disabled", false);	
			}else{
				$("#leadSearchDeliveredStatus").attr('disabled','disabled');
				$("#leadSearchDeliveredStatus").prop("disabled", true);	
			}
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				if(dropdownStatus){
					//var templatesList = templatesNameList;
					if(templatesNameList.length>0){
						$("."+elementIdid).html('');
						//var option='<option value="">--Select Template--</option>';
						//console.log("templatesNameList :: " + JSON.stringify(templatesNameList));
						var option='';
						for (let l = 0; l < templatesNameList.length; l++) {
							const temp = templatesNameList[l];
							for (let j = 0; j < temp.templateName.length; j++) {
								//console.log("templateName DATA :: " + JSON.stringify(temp.templateName[j]));
								option=option+'<option value="'+ temp.templateName[j].userTemplateName +'">'+ temp.templateName[j].userTemplateName + '(' +temp.counsellorName + ')'+'</option>';
							}
						}
						$("."+elementIdid).html(option);
					}

				}
			}
		},
		error : function(e) {
			console.log(e);
		}
	});
}

//get all WATI logs data by leadID
function getWatiLogs(lid){
	var request={};
	var formId = 'advanceLeadNewSearchForm';
	var leadSearchDeliveredStatus = $("#"+formId+" #leadSearchDeliveredStatus").val();
	var leadSearchTemplate = $("#"+formId+" #leadSearchTemplate").val();
	var leadAssignTo = $("#"+formId+" #leadAssignToSearch").val();
	var leadStartDateSearch = $("#"+formId+" #leadStartDateSearch").val();
	var leadEndDateSearch = $("#"+formId+" #leadEndDateSearch").val();
	request['leadID']=lid;
	request['leadSearchDeliveredStatus']=leadSearchDeliveredStatus;
	request['leadSearchTemplate']=leadSearchTemplate;
	request['leadAssignTo']=leadAssignTo;
	request['leadStartDateSearch']=leadStartDateSearch;
	request['leadEndDateSearch']=leadEndDateSearch;
	//console.log("leadSearchDeliveredStatus :: " + leadSearchDeliveredStatus + " leadSearchTemplate :: " + leadSearchTemplate + " leadAssignTo :: " + leadAssignTo + " leadStartDateSearch:: " + leadStartDateSearch + " leadEndDateSearch:: "+ leadEndDateSearch);
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLFor('leads','get-wati-log'),
		data : JSON.stringify(request),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {  //console.log('get data on log call : ' +  JSON.stringify(data)); //console.log('msg : ' +  JSON.stringify(data.message)); console.log('statusCode : ' +  JSON.stringify(data['statusCode']));
			if (data['statusCode'] == '0' || data['statusCode'] == '2') {
				showMessageTheme2(0, data['message'],'',true);
			} else {
				if(data["message"]=='Data Not found'){
					showMessageTheme2(0, 'Wati Logs not available for this Lead','',false);
					return false;
				}else{
					var logData = $("#logData");
					logData.html('');
					$(logData).html(whatsappChatUI(data));
					$("#watiLogsTableData").DataTable({
						theme:"bootstrap4",	 //destroy: true,	
					});
					$("#watiLogsContent").modal("show");
				}
			}
			return false;
		},
		error : function(e) {
			return false;
		}
	});
}

function getWatiTemplates() {
	$("#allWatiTemplatesList").html('');
	$("#allWatiTemplatesList").html('');
	$('#mcustomWatiTemplatesListClose').click(function(e) { 
		//console.log("mcustomWatiTemplatesListClose :: clicked :: inside :: getWatiTemplates"); 
		$("input#selectLeadAll").prop('checked','');
		$('input[name="lead-move-another"]').prop('checked','');
		$("#leadNoMove").val("");
	});
	
	var moveleadNo = $("#leadNoMove").val();
	if(moveleadNo==''){
		showMessageTheme2(0, 'Please check any one lead','',false);
		return false;
	}
	hideMessageTheme2('');
	var leads=$("#leadNoMove").val();
	var selected = new Array();
	$('input[name="lead-move-another"]').each(function() {
		selected.push($(this).val());
   	});
	//console.log("selected from allchecked :: " + selected);
	leads=leads.substring(1,leads.lenght)
	var request={}
	request['userId']=USER_ID;
	request['leads']=leads;
	//console.log(request);

	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLFor('leads','get-wati-templates'),
		data : JSON.stringify(request),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data['statusCode'] == '0' || data['statusCode'] == '2' || data['statusCode'] == 'E001' || data['statusCode'] == 'E002') {
				//showMessageTheme2(0, data['message'],'',true);
				showMessageTheme2(0, data['message'],'',false);
			} else {
				watiTemplateContent=data;
				//console.log('watiTemplateContent DATA : ' + JSON.stringify(watiTemplateContent));
				$.each(watiTemplateContent.messageTemplates, function(index, obj) {
					if(obj.customParams != null && obj.customParams != ''){
						$.each(obj.customParams, function(i, param) {
							var placeholder = "{{" + param.paramName + "}}";
							var regex = new RegExp("\\*{{" + param.paramName + "}}\\*", "g");
							if (obj.bodyOriginal.includes("*{{"+param.paramName+"}}*")) {
								var regex = new RegExp("\\*{{" + param.paramName + "}}\\*", "g");
							} else {
								var regex = placeholder;
							}
							obj.body = obj.body.replace(regex, param.paramValue);
							obj.bodyOriginal = obj.bodyOriginal.replace(regex, "<b>"+param.paramValue+"</b>");
						});
					}
				});
				
				$("body").html(getWaringContent1());
				var allWatiTemplatesListPopup = $("#allWatiTemplatesList");
				allWatiTemplatesListPopup.html('');
				$("#allWatiTemplatesList").html(customWatiTemplatesList(data));
				var isDataTable = $.fn.dataTable.isDataTable("#mwatiBroadcastTable");
				if(isDataTable){
					$("#mwatiBroadcastTable").dataTable().fnDestroy();
				}
				$("#mwatiBroadcastTable").DataTable({
					theme:"bootstrap4",
					//order: [[3, 'desc']]
				});
				$('#mcustomWatiTemplatesList').modal('show'); //calling custom method
				
				var userListPopup = $("#usrPopData");
				// userListPopup.html('');
				userListPopup.html(swatiBroadcastSendMobileModal(data));

				$("#mswatiBroadcastSendThroughMobile").modal("hide");
				//return false;
			}

			return false;
		},
		error : function(e) {
			return false;
		}
	});
}

function sendWatiNotification(templateName, index){
	var request={};
	$("#table_row_"+ templateName).addClass('selected_row').siblings().removeClass('selected_row');
	$('#templateName').html('<b>' + templateName + '</b> '); //$('#confirm_btn_data').html('<a id="confirm_btn" class="btn btn-primary mr-2" href="javascript:void(0);"  onclick="return showWarningMessageShow(\'Are you sure you want to send this data?\',\'sendWatiNotification( \\\''+templateName+'\\\','+index+') \');">SEND MSG</a>');
	boolval =true;
	$('#viewMethodCalling').html('<a href="javascript:void(0)" class="btn btn-primary btn-sm rounded-circle" onclick="viewWatiTemplate('+boolval+','+index+', `'+templateName+'`);" > <i class="fa fa-eye text-white"></i> </a>');
	
	$('#confirm_btn_data').html('<a id="confirm_btn" class="btn btn-primary mr-2" href="javascript:void(0);" >SEND</a>');
	$('#selectionCount').html('<span>Selected- </span><span id="selectedCount">0</span> / <span id="totalCount">0</span>');
	$("#mswatiBroadcastSendThroughMobile").modal("show");

	// var table = $('#mbroadcastWatiSendTable').DataTable(); 
    // if (table) {
    //     table.destroy();
    // }
	// $("#mbroadcastWatiSendTable").dataTable({
	// 	columnDefs: [
	// 		{ orderable: false, targets: 0 }
	// 	]
	// });
	$("#mcustomWatiTemplatesList").modal("hide");

	var totalCheckboxes = $(".checkToSend").length;
    $("#totalCount").text(totalCheckboxes);
	
	$("#confirm_btn").click(function () {
		console.log("Confirm btn clicked::");
		var sleads ='';
		var leadNo='';
		$.each($("input[name='chk-users-lead']:checked"), function(){
			leadNo = leadNo+','+$(this).val();
		});
		
		sleads = sleads + leadNo;
		var selectedLeads = sleads.substring(1,sleads.length); 
		//console.log("selectedLeads:::" + selectedLeads);
		if(selectedLeads==''){ 
			// $('#remarksresetDelete1').modal('hide');
			$('#remarksresetDelete2').modal('hide');
			showMessageTheme2(0, 'Please check any one user to send message','',false);
			return false;
		}else{
			showWarningMessageShow('Are you sure you want to send this data?','sendWatiNotificationToUser( '+index+',\''+templateName+'\',\''+selectedLeads+'\',\'send\')', 'info-modal-sm');
		}

	});
	//viewWatiTemplate(false);

	$(".checkToSend").click(function(){
		updateSelectionCount();
		var arrChkBox = [];
		if($(".checkToSend:checked").length>0){
			if($(".checkToSend:checked").length == $(".checkToSend").length){
				$("#allchecked").prop("checked",true);
			}else{
				$("#allchecked").prop("checked",false);
			}
			// $("#allcheckedDiv").addClass("d-inline-block").removeClass("d-none");
		}else{
			// $("#allcheckedDiv").addClass("d-none").removeClass("d-inline-block");
			$("#allchecked").prop("checked",false);
		}
	});
	$("#allchecked").click(function(){
		if($(this).prop("checked")){
			$(".checkToSend").prop("checked",true);
		}else{
			$(".checkToSend").prop("checked",false);
		}
		updateSelectionCount();
	});

	function updateSelectionCount(){
        var selectedCount = $(".checkToSend:checked").length;
        $("#selectedCount").text(selectedCount);
    }
}

//send msg to user
function sendWatiNotificationToUser(indexNo,templateName,leadID, d_status) {
	$("#successFailedWatiMessagesModal").modal("hide");
	//console.log("status of buton==" + JSON.stringify(d_status));
	
	$("#resetDeleteErrorWarningNo1").click(function(){
		$("#remarksresetDelete2").hide();
	});
	$("#resetDeleteErrorWarningYes1").click(function(){
		$("input#allchecked").prop('checked', false);
		$("input#allcheckedFailed").prop('checked', false);
		$("input#selectLeadAll").prop('checked', false); 
		$('input[name="chk-users-lead"]').prop('checked', false);
		$('input[name="lead-move-another"]').prop('checked', false);
	});
	$("#resetDeleteErrorWarningYes2").click(function(){
		$("input#allchecked").prop('checked', false);
		$("input#allcheckedFailed").prop('checked', false);
		$("input#selectLeadAll").prop('checked', false); 
		$('input[name="chk-users-lead"]').prop('checked', false);
		$('input[name="lead-move-another"]').prop('checked', false);
	});
	$("#mcustomWatiTemplatesList").click(function(){
		$("#selectLeadAll").prop("checked", false);
	});

	$('#templateName').html('<b>' + templateName + '</b> '); 
	//$('#confirm_btn_data').html('<a id="confirm_btn" class="btn btn-primary mr-2" href="javascript:void(0);"  onclick="return showWarningMessageShow(\'Are you sure you want to send this data?\',\'sendWatiNotification( \\\''+templateName+'\\\','+index+') \');">SEND MSG</a>');
	//$('#confirm_btn_data').html('<a id="resend_btn" class="btn btn-primary px-3 py-2 mr-2 mt-3 float-right" href="javascript:void(0);">Resend</a>');
	$('#resendWatiMessagesData').html('<a id="resend_btn" class="btn btn-primary px-3 py-2 mr-2 mt-3 float-right" href="javascript:void(0);">Resend</a>');
	

	var request={}
	request['userId']=USER_ID;
	request['templateName']=templateName;
	//request['broadcastName']="broadcastName";
	//request['userData']="userData";
	//request['leadID']=leadID; 
	request['selectedLeads']=leadID; 
	//console.log(request);

	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLFor('leads','set-wati-message'),
		data : JSON.stringify(request),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			//if (data['statusCode'] == '0' || data['statusCode'] == '2' || data['statusCode'] == 'E001'|| data['statusCode'] == 'E002') {
			if (data['statusCode'] == 'EX01' || data['statusCode'] == 'E004' ) {
				showMessageTheme2(0, data['message'],'',false);
				$("input#allchecked").prop('checked', false);
				$('input[name="chk-users-lead"]').prop('checked', false);
				return false;
			} else { // $("input#selectLeadAll").removeAttr('checked'); 
				$("#mswatiBroadcastSendThroughMobile").modal("hide");
				$("#mcustomWatiTemplatesList").modal("hide");
				$("input#allcheckedFailed").prop('checked', false);
				$("input#selectLeadAll").prop('checked', false); 
				$('input[name="chk-users-lead"]').prop('checked', false);
				$('input[name="lead-move-another"]').prop('checked', false);
				//
				$('#allcheckedFailed').prop('checked', false);
				$('input[name="chk-users-lead-resend"]').prop('checked', false);
				var backgrd_color, err_msg;
				if(data.leadRes!=undefined){
					if(d_status == "send" || d_status == "resend") {		
						openSuccessFailedWatiMessages(data.leadRes, indexNo, templateName);  //successFailedWatiMessagesModal(data.leadRes);
					}
				}
				$("#successFailedWatiMessagesModal").modal("show");
			}

			return false;
		},
		error : function(e) {
			return false;
		}
	});
	
}


function viewWatiTemplate(flag, indexNumber, templateName){ //console.log("flag ::" + flag + " indexNumber :: "+indexNumber + " templateName:: "+templateName);
	if(flag){
		$("#table_row_"+ templateName).addClass('selected_row').siblings().removeClass('selected_row');
		$(".wati-wrapper").addClass("active-wati-template");
		$(".wati-template").removeClass("hide-wati-template");
		$(".wati-template").addClass("show-wati-template");
		$("#priviewTemplate").html('');
		$("#priviewTemplateSecond").html('');
		$("#priviewTemplateThird").html('');
		setTimeout(function(){
			$("#priviewTemplate").html(getViewTemplate(watiTemplateContent.messageTemplates[indexNumber]));
			$("#priviewTemplateSecond").html(getViewTemplate(watiTemplateContent.messageTemplates[indexNumber]));
			$("#priviewTemplateThird").html(getViewTemplate(watiTemplateContent.messageTemplates[indexNumber]));
		},200)
	}else{
		$(".wati-wrapper").removeClass("active-wati-template");
		$(".wati-template").addClass("hide-wati-template");
		$(".wati-template").removeClass("show-wati-template");
	}
}

function getViewTemplate(data){ //console.log("inside getViewTemplate data :: " + JSON.stringify(data));
    var jsonData= [data] //console.log("inside getViewTemplate jsonData :: " + JSON.stringify(jsonData));
	var html =  '';
	var imgURL = '';
        $.each(jsonData, function(index, value){ //console.log('value : '+ JSON.stringify(value.header));
            html+='<div class="main-card card mx-auto mb-3" style="max-width:300px;">'
            +'<div class="card-body p-2">'
				if(value.header.mediaFromPC!=null && value.header.mediaFromPC!=''){
					html+='<img src="/'+ imgURL+value.header.mediaFromPC+'" class="w-100 mb-3" style="max-width:250px">'	
				}
                html+='<ul class="p-0">';
					var list = value.bodyOriginal.split("\n");
                    $.each(list, function(i, item){
                        html+='<li class="'+(i<5? "mb-3":(i==15? "mb-3":""))+'">'+item+'</li>';
                    });
                html+='</ul>'
                +'<div class="mt-3">'
                    +value.footer
                +'</div>'
                +'<hr class="mb-0"/>'
                +'<div class="full">';
					if(value.buttons != null && value.buttons != ''){
						$.each(value.buttons, function(i, item){
							html+='<div class="full font-weight-semi-bold text-primary text-center py-1">'+item.parameter.text+'</div>';
						});
					}
				html+='</div>'
            +'</div>'
        +'</div>';
        });
    return html;
}

function gotoBackWatiModal(){
	$('#allchecked').prop('checked',false);
	$('input[name="chk-users-lead"]').prop('checked',false);
	$('#allcheckedFailed').prop('checked',false);
	$('input[name="chk-users-lead-resend"]').prop('checked',false);
	$("#mswatiBroadcastSendThroughMobile").modal("hide");
	$("#successFailedWatiMessagesModal").modal("hide");
	$("#mcustomWatiTemplatesList").modal("show");
	viewWatiTemplate(false);
}

function selfModalHide(modalID){
	$("#"+modalID).modal("hide");
	viewWatiTemplate(false);
	viewEmailTemplate(false);
}

function callLeadDemoList(modeSearch, startDate, endDate) {
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForHTML('dashboard', 'school-demo-list'),
		data : JSON.stringify(getRequestForLeadDemo(modeSearch,startDate, endDate)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			// console.log(data);
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				//$('#school-demo-list').dataTable().fnDestroy();
				var httmlTop = getLeadDemoHtml(data);
				$("#schoolDemoListTbody").html(httmlTop);
				//$("#school-demo-list").dataTable();
			}
		},
			error : function(e) {
				console.log(e);
			}
		});
}
   

function getRequestForLeadDemo(modeSearch,startDate, endDate) {
	var authentication = {};
	var leadReportRequest = {};
	leadReportRequest['schoolId'] = SCHOOL_ID;
	leadReportRequest['modeSearch'] = modeSearch;
	leadReportRequest['startDate'] = startDate;
	leadReportRequest['endDate'] = endDate;
	
   
	authentication['hash'] = getHash();
	authentication['schoolId'] = SCHOOL_ID;
	authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userId'] = USER_ID;
	authentication['userType'] = 'COMMON';
	leadReportRequest['authentication'] = authentication;
	return leadReportRequest;
}

function getLeadDemoHtml(data){
	var studentEnrolledList=data.studentEnrolledList;
	var htmlRet ="";
	var sr=1;
	if(studentEnrolledList.length>0){
		for (let ind = 0; ind < studentEnrolledList.length; ind++) {
			const studentEnroll = studentEnrolledList[ind];
			var meetingJoinTimeList = studentEnroll.meetingJoinTimeList;
			htmlRet +="<tr>";
			htmlRet +="<td>"+(sr++)+"</td>";
			htmlRet +="<td style=\"vertical-align: top !important;\">"+studentEnroll.demoDate+"<br/>"+studentEnroll.demoStartTime+" - "+studentEnroll.demoEndTime+"<br/>"+studentEnroll.meetingFrom+"</td>";
			htmlRet +="<td style=\"vertical-align: top !important;\">"+studentEnroll.assignName+" | "+studentEnroll.meetingPersoneName+"</td>";
			if(!studentEnroll.searchUser){
				htmlRet +="<td style=\"vertical-align: top !important;\">";
				if(meetingJoinTimeList.length>0){
					htmlRet +="<table class=\"table table-bordered table-striped\">";
					htmlRet +="<tr><th>Host</th><th>Attendee</th></tr>";
					var bgcolor="";
					for (let mi = 0; mi < meetingJoinTimeList.length; mi++) {
						const meetingTime = meetingJoinTimeList[mi];
						if(meetingTime.joinType=='host'){
							htmlRet +="<tr><td class="+bgcolor+">"+meetingTime.clickTime+"<br/><span style=\"font-size:10px\">"+meetingTime.city+" | "+meetingTime.country+" | "+meetingTime.timeZone.replace("/","-")+"</span></td><td> - </td></tr>";
						}else{
							htmlRet +="<tr><td> - </td><td class="+bgcolor+">"+meetingTime.clickTime+"<br/><span style=\"font-size:9px\">"+meetingTime.city+" | "+meetingTime.country+" | "+meetingTime.timeZone.replace("/","-")+"</span></td></tr>";
						}
					}
					htmlRet +="</table>";
				}
				htmlRet +="</td>";
			}
			htmlRet +="<td style=\"vertical-align: top !important;\">"+studentEnroll.meetingStatus+"</td>";
			htmlRet +="<td style=\"vertical-align: top !important;\">"+studentEnroll.meetingRemark+"</td>";
			htmlRet +="</tr>";

		}
	}
	return htmlRet;
}


function callEnrollmentListDaywise(reportType, modeSearch, startDate, endDate) {
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForHTML('dashboard', 'get-enrolled-list-daywise'),
		data : JSON.stringify(getRequestForEnrollDaywise(reportType, modeSearch,startDate, endDate)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		async: true,
		success : function(data) {
			// console.log(data);
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				//$('#school-demo-list').dataTable().fnDestroy();
				var httmlTop = getEnrollDaywiseHtml(data, reportType, modeSearch);
				//$(".enrolledListTbody").html(httmlTop);
				//$("#school-demo-list").dataTable();
			}
		},
			error : function(e) {
				console.log(e);
			}
		});
}

function getRequestForEnrollDaywise(reporttype, modeSearch,startDate, endDate) {
	var authentication = {};
	var leadReportRequest = {};
	leadReportRequest['schoolId'] = SCHOOL_ID;
	leadReportRequest['modeSearch'] = modeSearch;
	leadReportRequest['startDate'] = startDate;
	leadReportRequest['endDate'] = endDate;
	leadReportRequest['reportType'] = reporttype;
   
	authentication['hash'] = getHash();
	authentication['schoolId'] = SCHOOL_ID;
	authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userId'] = USER_ID;
	authentication['userType'] = 'COMMON';
	leadReportRequest['authentication'] = authentication;
	return leadReportRequest;
}


async function getEnrollDaywiseHtml(data, colType, modeSearch){
	var enrollListMonth=data.enrollListMonth;
	const responseseries = await getEnrollListTrWise(enrollListMonth, colType, modeSearch);
	//console.log(responseseries);
	var resSeries=responseseries.series;
	var resAttr=responseseries.attrMonth;

	var htmlRet ="";
	// var srm=1;
	// var sr=1;
	
	var options = {
		series: resSeries,
		chart: {
			height: 350,
			type: 'bar',
	  },
	  plotOptions: {
		bar: {
		  borderRadius: 10,
		  dataLabels: {
			   position: 'top', // top, center, bottom
		  },
		}
	  },
	  legend: {
		show: true,
		formatter: customLegendFormatter,
	},
	  dataLabels: {
		enabled: true,
		formatter: function (val) {
		  return val;
		},
		offsetY: -30,
		style: {
		  fontSize: '12px',
		  colors: ["#304758"]
		},
	  },
	  xaxis: {
		categories: resAttr,//["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15"],
		//categories:["1","2","3"],
		position: 'bottom',
		axisBorder: {
		  show: false
		},
		axisTicks: {
		  show: false
		},
		crosshairs: {
		  fill: {
			type: 'gradient',
			gradient: {
			  colorFrom: '#D8E3F0',
			  colorTo: '#BED1E6',
			  stops: [0, 100],
			  opacityFrom: 0.4,
			  opacityTo: 0.5,
			}
		  }
		},
		// tooltip: {
		//   enabled: true,
		// }
	  },
	  yaxis: {
		axisBorder: {
		  show: false
		},
		axisTicks: {
		  show: false,
		},
		labels: {
		  show: false,
		  formatter: function (val) {
			return val + "";
		  }
		}
	  
	  },
	  tooltip: {
		y: {
		  formatter: function (val) {
			return colType+" " + val 
		  }
		}
	  }
	};

	var chart = new ApexCharts(document.querySelector("#chart-enroll-yearwise"), options);
	chart.render();
	chart.update();
	
	//Weekday
	//Enrollment
	//One_To_One
	//Group
 	//Other Remarks
	//Enrolled Weekwise
	//Total Enrolled
	//Leads
	//Leads Weekwise
	//Total Leads

	return htmlRet;
}
let customLegendFormatter = (seriesName, opts) => {
	var seriesVal=opts.w.globals.series[opts.seriesIndex];
	var seriesTotalVal=0;
	for(var i=0;i<seriesVal.length;i++){
		seriesTotalVal+=seriesVal[i];
	}
	//console.log(seriesName+' - '+opts.w.globals.series[1]);

	//var htmlRet = '<div class="legend-item-label">'+seriesName+'</div><div class="legend-item-value">'+seriesTotalVal+'</div>';
	var htmlRet = '<div class="d-flex justify-content-center flex-wrap data-count-year">';
	htmlRet += '<span class="d-inline-flex align-items-center mr-2">'+seriesName+':</span>';
	htmlRet += '<span class="d-inline-flex align-items-center mr-2"><b>'+seriesTotalVal+'</b></span>';
	htmlRet+='</div>';
	return htmlRet;
  };

async function  getEnrollListTrWise(enrollList, colType, modeSearch){
	//console.log(enrollList);
	var reponse={};
	var attrMonth=[];
	var series=[];
	

	if(enrollList.length>0){
		for (let ind = 0; ind < enrollList.length; ind++) {
			var studentEnrolls = enrollList[ind];
			var yearName = studentEnrolls.academicYear;
			var studentEnrollMonth = studentEnrolls.enrollListMonth;
			var seriesArr={};
			var data=[];
			if(studentEnrollMonth.length>0){
				for (let t = 0; t < studentEnrollMonth.length; t++) {
					var enrollMonth = studentEnrollMonth[t];
					var enrollWeekwise = enrollMonth.enrollWeekwise;
					var leadWeekwise = enrollMonth.leadWeekwise;
					var totalEnroll = enrollMonth.totalEnrollment;
					var totalLead = enrollMonth.totalLead;
					if(modeSearch=='MONTH'){
						if(colType=='Enrollment'){
							data.push(totalEnroll);
						}else if(colType=='Leads'){
							data.push(totalLead);
						}
						attrMonth.push(enrollMonth.meetingDate);
					}else{
						var enrollDaywise = enrollMonth.enrollDayList;
						if(enrollDaywise.length>0){
							for (let t = 0; t < enrollDaywise.length; t++) {
								var studentEnroll = enrollDaywise[t];
								if(colType=='Enrollment'){
									data.push(studentEnroll.enrollDaywise);
									var mdate = studentEnroll.meetingDate.replace(", "+yearName, "");
									//studentEnroll.weekday
									if(modeSearch=='DAY'){
										attrMonth.push(mdate);
									}else if(modeSearch=='WEEK'){
										attrMonth.push(mdate);
									}else{
										attrMonth.push(mdate);
									}
								}else if(colType=='Leads'){
									data.push(studentEnroll.leadDaywise);
									var mdate = studentEnroll.meetingDate.replace(", "+yearName, "");
									if(modeSearch=='DAY'){
										attrMonth.push(mdate);
									}else if(modeSearch=='WEEK'){
										attrMonth.push(mdate);
									}else{
										attrMonth.push(mdate);
									}
								}
							}
						}	

					}

				}
			}
			seriesArr['name']=yearName;
			seriesArr['data']=data;
			series.push(seriesArr);
		}
		reponse['attrMonth']=attrMonth;
		reponse['series']=series;
	}	
	return reponse;
}

function callLeadCampaignList(modeSearch, startDate, endDate, campaignName, eventid) {
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForHTML('dashboard', 'get-lead-list-campaign'),
		data : JSON.stringify(getRequestForLeadCampaign(modeSearch,startDate, endDate, campaignName)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			//console.log(data);
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				var leadListCampaign=data.leadListCampaign;
				if(leadListCampaign.length>0){
					//$('#lead-campaign-list').dataTable().fnDestroy();
					// var isDataTable = $.fn.dataTable.isDataTable('#lead-campaign-list');
                    // if (isDataTable) {
                    //     $('#lead-campaign-list').dataTable().fnDestroy();
                    // }
					if(campaignName!=''){
						$(".campaign-tr-"+eventid+"").removeClass("d-none");
						var httmlTop = getLeadListCampaignWiseHtml(data);
						$(".campaign-td-"+eventid+"").html(httmlTop);
					}else{
						$(".campaign-tr-"+eventid+"").addClass("d-none");
						var httmlTop = getLeadCampaignWiseHtml(data);
						$("#leadCampaignListTbody").html(httmlTop);
	
						var httmlFoot = getCampaignFooterTotal(data);
						$("#listCampaignTfoot").html(httmlFoot);
					}

					//$("#lead-campaign-list").dataTable();
				// 	$('#lead-campaign-list').dataTable({
				// 		"iDisplayLength": 100, 
				//    });

				   
				   $(".child_name").each(function () {
					var text = $(this).text();
					if(text!=''){
						text=text.trim();
					}
					var textsplit=text.split(" ");
					if(textsplit.length>1){
						var sss = "";
						for (let i = 0; i < textsplit.length; i++) {
							const element = textsplit[i];
							sss += element.replace(new RegExp(`.{1,25}`, 'g'), '$& ');
						}
						$(this).text(sss);
					}else{
						let spacedText = text.replace(new RegExp(`.{1,25}`, 'g'), '$& ');
						$(this).text(spacedText);
					}
				  //console.log(text);
					
				});
				
				$(".child_email").each(function () {
					var text = $(this).text();
					if(text!=''){
						text=text.trim();
					}
					  var textsplit=text.split(" ");
					  if(textsplit.length>1){
					
					  }else{
						let spacedText = text.replace(new RegExp(`.{1,50}`, 'g'), '$& ');
						$(this).text(spacedText);
					  }
				});

				}else{
					// var isDataTable = $.fn.dataTable.isDataTable('#lead-campaign-list');
                    // if (isDataTable) {
                    //     $('#lead-campaign-list').dataTable().fnDestroy();
                    // }
					var httmlTop = getLeadCampaignWiseHtml(data);
					$("#leadCampaignListTbody").html(httmlTop);
				}
			}
		},
			error : function(e) {
				console.log(e);
			}
		});
}
   

function getRequestForLeadCampaign(modeSearch,startDate, endDate, campaignName) {
	var authentication = {};
	var leadReportRequest = {};
	leadReportRequest['schoolId'] = SCHOOL_ID;
	leadReportRequest['modeSearch'] = modeSearch;
	leadReportRequest['startDate'] = startDate;
	leadReportRequest['endDate'] = endDate;
	
	if(campaignName!=undefined && campaignName!=""){
		leadReportRequest['reportType']="LEAD-LIST";
		var utmCampaign=[campaignName];
		leadReportRequest['utmCampaign'] = utmCampaign ;
	}else{
		var utmCampaign=[];
		if($("#searchCampaignType").val()!='' && $("#searchCampaignType").val()!=undefined){
			utmCampaign=$("#searchCampaignType").val();
		}
		leadReportRequest['utmCampaign'] = utmCampaign;
		leadReportRequest['reportType']="CAMPAIGN-LIST";
	}

   
	authentication['hash'] = getHash();
	authentication['schoolId'] = SCHOOL_ID;
	authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userId'] = USER_ID;
	authentication['userType'] = 'COMMON';
	leadReportRequest['authentication'] = authentication;
	return leadReportRequest;
}

function getLeadCampaignWiseHtml(data){
	var leadListCampaign=data.leadListCampaign;
	var htmlRet ="";
	var sr=1;
	var activeLead=0;
	var inActiveLead=0;
	var facebooklead=0;
	var facebookActivelead=0;
	var facebookInactivelead=0;

	if(leadListCampaign.length>0){
		
		for (let ind = 0; ind < leadListCampaign.length; ind++) {
			const leadCampaign = leadListCampaign[ind];
			// if(leadCampaign.activeStatus=='Y'){
			// 	activeLead=activeLead+1;
			// }else{
			// 	inActiveLead=inActiveLead+1;
			// }
			// if(leadCampaign.leadSource=='Facebook'){
			// 	facebooklead=facebooklead+1;
			// 	if(leadCampaign.activeStatus=='Y'){
			// 		facebookActivelead=facebookActivelead+1;
			// 	}else{
			// 		facebookInactivelead=facebookInactivelead+1;
			// 	}
			// }
			

			var spent = parseFloat(leadCampaign.totalSpend);
			var perLeadSmsSpent=spent/parseInt(leadCampaign.totalLead);
			var perLeadFbSpent=0;
			if(leadCampaign.totalFbLead!=''){
				perLeadFbSpent=spent/parseInt(leadCampaign.totalFbLead);
			}


			htmlRet +="<tr class="+(leadCampaign.activeStatus=='N'?'bg-warning':'')+">";
			htmlRet +="<td class=\"text-center\" style=\"max-width:70px !important;min-width:70px\">"+(sr)+"</td>";
			htmlRet +="<td style=\"vertical-align: top !important;min-width:250px\" ><a href=\"javascript:void(0)\" data-target=\"#collapseOne"+sr+"\" data-toggle=\"collapse\" aria-expanded=\"false\" aria-controls=\"collapse"+sr+"\" class=\"collapsed\"  onclick=\"getListLeadCampaign('"+leadCampaign.campaignName+"','"+sr+"');\">"+leadCampaign.campaignName+"</a></td>";
			htmlRet +="<td style=\"vertical-align: top !important;min-width:250px\" class=\"text-center\"><span class=\"bg-success text-white text-center  badge font-12\">"+leadCampaign.totalActiveLead+"</span> + <span class=\"bg-warning text-white text-center badge font-12\">"+leadCampaign.totalInactiveLead+"</span> = <span class=\"badge badge-primary font-12\">"+leadCampaign.totalLead+"</span> | <span class=\"badge badge-info  text-center font-12\">"+leadCampaign.totalFbLead+"</span></td>";
			htmlRet +="<td style=\"vertical-align: top !important;min-width:180px\" class=\"text-center\"><span class=\"badge badge-pill badge-dark font-10\">$"+leadCampaign.totalSpend+"</span><br/><span class=\"badge badge-pill badge-primary font-10\">$"+perLeadSmsSpent.toFixed(2)+"</span> | <span class=\"badge badge-pill badge-info font-10\">$"+perLeadFbSpent.toFixed(2)+"</span> </td>";
			htmlRet +="<td class=\"rounded-bottom-right-10\">";
			var sizeCounselor=(leadCampaign.assignNames.length);
			sizeCounselor="<b>"+sizeCounselor+"</b> "+(leadCampaign.assignNames.length>1?' Counselors':'Counselor')+" with <b>$"+(perLeadSmsSpent*parseInt(leadCampaign.totalLead)).toFixed(2)+"</b>";
			htmlRet +="<span>"+sizeCounselor+"</span>";
			htmlRet +="<div class=\"d-flex overflow-x-auto\" style=\"max-width:550px;\">";
			if(leadCampaign.assignNames.length>0){
				for (let s = 0; s < leadCampaign.assignNames.length; s++) {
					const assignNameobj = leadCampaign.assignNames[s];
					htmlRet +="<div class=\"border bg-white rounded-5 w-100 mr-2 recommended-teacher-thumb\" style=\"max-width:230px;min-width:230px;\" id=\"clone\" data-order=\"3\">";
					
					htmlRet +="<div class=\"card-body d-flex px-2 pt-2 align-items-center pb-0\">";
					htmlRet +="<span><img width=\"42\" class=\"avatar-icon\" src=\""+assignNameobj.profilePic+"\" alt=\"\" /></span>";
					htmlRet +="<div class=\"pl-1\"><div class=\"teacher-name font-weight-semi-bold font-size-md\">"+assignNameobj.assignName+"</div>";
					htmlRet +="<div class=\"teacher-availability\">";
					htmlRet +="<span class=\"total-hour text-primary\">"+assignNameobj.assignLead+" | </span><span class=\"total-hour text-success\">"+assignNameobj.assignActiveLead+" | </span><span class=\"total-hour text-danger\">"+assignNameobj.assignInactiveLead+"</span>";
					htmlRet +="</div>";
					htmlRet +="</div>";

					htmlRet +="<div class=\"pl-1 ml-auto bold\"><div class=\"teacher-name font-weight-semi-bold font-size-md\">$"+(perLeadSmsSpent*parseInt(assignNameobj.assignLead)).toFixed(2)+"</div>";
					// htmlRet +="<span class=\"total-hour text-primary\">"+assignNameobj.hotLead+" | </span><span class=\"total-hour text-success\">"+assignNameobj.coldLead+" | </span><span class=\"total-hour text-danger\">"+assignNameobj.warmLead+"</span>";
					htmlRet +="</div>";
					htmlRet +="</div>";
					
					htmlRet +="</div>";
				}
			}

			htmlRet +="</div>";
			
			htmlRet +="</td>";
			htmlRet +="</tr>";
			
			htmlRet +="<tr data-parent=\"#accordion\" id=\"collapseOne"+sr+"\" class=\"collapse campaign-tr-"+sr+"\"><td colspan=\"9\" >";
			htmlRet +="<table class=\"table\" id=\"leadListByCamp"+sr+"\" style=\"font-size:11px;min-width:450px\">";
			htmlRet +="<thead>";
			htmlRet +="<tr>";
			htmlRet +="<th style=\"5% !important\" class=\"text-center bg-primary text-white\">Sr no.</th>";
            htmlRet +="<th class=\"text-center bg-primary text-white\">Student Name<br/>Grade</th>";
            htmlRet +="<th class=\"text-center bg-primary text-white\">Email<br/>Country<br/>Create Date Time</th>";
            // htmlRet +="<th class=\"text-center bg-primary text-white\">Parent's Name<br/>Phone No.</th>";
            htmlRet +="<th class=\"text-center bg-primary text-white\">Ad_set<br/>Ad_Name</th>";
            htmlRet +="<th class=\"text-center bg-primary text-white\">Counselor Name<br/>Lead Status</th>";
            // htmlRet +="<th class=\"text-center bg-primary text-white\">Demo Booked</th>";
            htmlRet +="<th class=\"text-center bg-primary text-white\">Remarks</th>";
			htmlRet +="</tr>";
			htmlRet +="</thead>";
			htmlRet +="<tbody class=\"campaign-td-"+sr+"\"></tbody>";
			htmlRet +="</table>";
			htmlRet +="</td></tr>";
			

			sr=sr+1;

		}

	}else{
			htmlRet +="<tr>";
			htmlRet +="<td colspan=\"9\" class=\"text-center\">No Record</td>";
			htmlRet +="</tr>";	

	}
	return htmlRet;
}

function getCampaignFooterTotal(data){


	var leadListCampaign=data.leadListCampaign;
	var htmlRet ="";
	var sr=1;
	var totalLeads=0;
	var totalActiveLeads=0;
	var totalInactiveLeads=0;
	var totalFBLeads=0;
	var totalFbSpend=0;
	if(leadListCampaign.length>0){
		for (let ind = 0; ind < leadListCampaign.length; ind++) {
			const leadCampaign = leadListCampaign[ind];
			totalLeads=totalLeads+ parseInt(leadCampaign.totalLead);
			totalActiveLeads=totalActiveLeads+ parseInt(leadCampaign.totalActiveLead);
			totalInactiveLeads=totalInactiveLeads+parseInt(leadCampaign.totalInactiveLead);
			totalFBLeads=totalFBLeads+parseInt(leadCampaign.totalFbLead);
			totalFbSpend=totalFbSpend+ parseFloat(leadCampaign.totalSpend);
		}
		var spent = totalFbSpend.toFixed(2);
		var perLeadSmsSpent=spent/totalLeads;
		var perLeadFbSpent=spent/totalFBLeads;

		htmlRet +="<tr style=\"font-size:14px;background-color: #c9def3 !important;\">";
		htmlRet +="<th class=\"text-center\"></th>";
		htmlRet +="<th style=\"vertical-align: top !important;\" class=\"text-center\">Total</th>";
		htmlRet +="<th style=\"vertical-align: top !important;\" class=\"text-center\">"+totalActiveLeads+" + "+totalInactiveLeads+" = "+totalLeads+" | "+totalFBLeads+"</th>";
		htmlRet +="<th style=\"vertical-align: top !important;\" class=\"text-center\">$"+totalFbSpend.toFixed(2)+"</td>";
		htmlRet +="<th style=\"vertical-align: top !important;\" class=\"text-center\"></td>";
		htmlRet +="</tr>";
	}
	return htmlRet;
}

function getListLeadCampaign(campaignName, eventid){
	var startDate = $("#dataLeadCampaignStartDate").val();
	var endDate = $("#dataLeadCampaignEndDate").val();
	var searchCountrytype = $("#searchLeadCampaignType").val();
	
	if($("#dataLeadCampaignStartDate").val()=='' && $("#dataLeadCampaignStartDate").val()==undefined){
		showMessageTheme2(1, 'Please choose start date','',true);
		return false;
	}
	if($("#dataLeadCampaignEndDate").val()=='' && $("#dataLeadCampaignEndDate").val()==undefined){
		showMessageTheme2(1, 'Please choose end date','',true);
		return false;
	}
	
	callLeadCampaignList($("#searchLeadCampaignType").val(), startDate, endDate,campaignName,eventid);
}

function getLeadListCampaignWiseHtml(data){
	var leadListCampaign=data.leadListCampaign;
	var htmlRet ="";
	var sr=1;

	if(leadListCampaign.length>0){
		
		for (let ind = 0; ind < leadListCampaign.length; ind++) {
			const leadCampaign = leadListCampaign[ind];

			htmlRet +="<tr class="+(leadCampaign.activeStatus=='N'?'bg-warning':'')+">";
			htmlRet +="<td class=\"text-center\">"+(sr++)+"</td>";
			htmlRet +="<td style=\"vertical-align: top !important;\"><span class=\"child_name\">"+leadCampaign.childName+"</span><br/>"+leadCampaign.grade+"</td>";
			htmlRet +="<td style=\"vertical-align: top !important;\"><span class=\"child_email\">"+leadCampaign.email+"</span><br/>"+leadCampaign.country+"<br/>"+leadCampaign.assignDate+"</td>";
			htmlRet +="<td style=\"vertical-align: top !important;\">"+leadCampaign.fbAddSet+"<br/>"+leadCampaign.fbAdd+"</td>";
			htmlRet +="<td style=\"vertical-align: top !important;\">"+leadCampaign.assignName+"<br/>"+leadCampaign.leadStatus+"</td>";
			// htmlRet +="<td style=\"vertical-align: top !important;\">"+(leadCampaign.demoDateTime!=''?'Y':'N')+"</td>";
			htmlRet +="<td style=\"vertical-align: top !important;\">"+leadCampaign.followupRemark+"</td>";
			htmlRet +="</tr>";

			
		}

	}else{
			htmlRet +="<tr>";
			htmlRet +="<td colspan=\"9\" class=\"text-center\">No Record</td>";
			htmlRet +="</tr>";	

	}
	return htmlRet;
}


function callTotalCountLeads(formId, moduleId, leadFrom, clickFrom, currentPage, typeTheme, newTheme, callbadge, leadType, activeLead, totalfollowup, callFrom) {
	if(moduleId==''){
		moduleId=$("#"+formId+" #leadFromSearchModuleId").val();
	}
	if(clickFrom==''){
		clickFrom=$("#"+formId+" #clickFromSearch").val();
	}
	if(currentPage==''){
		currentPage=$("#"+formId+" #currentPageSearch").val();
	}
	
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForHTML('dashboard', 'get-total-lead'),
		data : JSON.stringify(getCallRequestForAdvanceLeadSearchStudent(formId, moduleId, leadFrom, clickFrom, currentPage, typeTheme, newTheme, callbadge, leadType,activeLead)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			console.log(data);
			customLoader(false);
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				if(leadType=='B2B'){
					if(callFrom=='new-lead'){
						getTotalB2BLeads(data);
					}else{
						var htmlt=getB2BLeadTotalCount(data, moduleId);
						$("#b2b-total-head").html(htmlt);
						$("#b2bLeadCount").html(htmlt);
					}
					//$("#total-active-hotlead").html(htmhot);
				}else if(leadType=='B2C'){
					if(callFrom=='new-lead'){
						getTotalB2CLeads(data);
					}else{
						var htmlt=getLeadTotalCountList(data, moduleId, totalfollowup, callFrom);
						var htmhot = getLeadTotalHotCountList(data, moduleId, callFrom);
						if(activeLead=='Y'){
							$("#total-lead-active-tr").html(htmlt);
							$("#total-active-hotlead").html(htmhot);
						}else{
							$("#total-lead-inactive-tr").html(htmlt);
							$("#total-inactive-hotlead").html(htmhot);
						}
					}
				}else{
					var htmlt=getB2BLeadTotalCount(data, moduleId);
					$("#b2bLeadCount").html(htmlt);
				}
			}
		},
			error : function(e) {
				console.log(e);
				customLoader(false);
			}
		});
}
   


function getLeadTotalCountList(data, moduleId, totalfollowup, callFrom){
	var leadTotalData=data.leadTotalData;
	var htmlRet ="";
	var sr=1;
	//htmlRet=htmlRet+"<tr>";
	htmlRet=htmlRet+"<td data-label=\"Total\" class=\"text-center\"  style=\"background-color:#3f6ad8 !important;color:#fff\">";
	if(leadTotalData.totalLeads>0){
		htmlRet=htmlRet+"<a href=\"javascript:void(0);\" style=\"color:#fff !important\" onclick=\"getTotalLead('B2C')\">"+leadTotalData.totalLeads+"</a>";
	}else{
		htmlRet=htmlRet+"-";
	}
	htmlRet=htmlRet+"</td>";
	htmlRet=htmlRet+"<td data-label=\"Total FB Lead\"  class=\"text-center\" text-color=\"#fff\" style=\"background-color:#6c757d !important;color:#fff\">";
	if(leadTotalData.totalFbLead>0){
		htmlRet=htmlRet+"<a href=\"javascript:void(0);\" style=\"color:#fff !important\" onclick=\"return advanceLeadSearchStudent('advanceLeadNewSearchForm','"+moduleId+"', '"+leadTotalData.leadFrom+"','"+leadTotalData.clickFrom+"-"+leadTotalData.clickUserid+"', '0', 'new', true, 'facebooklead','B2C');\">";
		htmlRet=htmlRet+leadTotalData.totalFbLead+"</a>";
	}else{
		htmlRet=htmlRet+"-";
	}
	htmlRet=htmlRet+" | ";
	if(leadTotalData.todayFbLead>0){
		htmlRet=htmlRet+"<a href=\"javascript:void(0);\" style=\"color:#fff !important\" onclick=\"return advanceLeadSearchStudent('advanceLeadNewSearchForm','"+moduleId+"', '"+leadTotalData.leadFrom+"','"+leadTotalData.clickFrom+"-"+leadTotalData.clickUserid+"', '0', 'new', true, 'fbtdlead','B2C');\">";
		htmlRet=htmlRet+leadTotalData.todayFbLead+"</a>";
	}else{
		htmlRet=htmlRet+"-";
	}					
	htmlRet=htmlRet+"</td>";

	htmlRet=htmlRet+"<td data-label=\"Today's Fresh Lead\" class=\"text-center\"  style=\"background-color:#6c757d !important;color:#fff\">";
	if(leadTotalData.freshLead>0){
		htmlRet=htmlRet+"<a href=\"javascript:void(0);\" style=\"color:#fff !important\" onclick=\"return advanceLeadSearchStudent('advanceLeadNewSearchForm','"+moduleId+"', '"+leadTotalData.leadFrom+"','"+leadTotalData.clickFrom+"-"+leadTotalData.clickUserid+"', '0', 'new', true, 'freshLead','B2C');\">";
		htmlRet=htmlRet+leadTotalData.freshLead+"</a>";
	}else{
		htmlRet=htmlRet+"-";
	}
	htmlRet=htmlRet+"</td>";	
	htmlRet=htmlRet+"<td data-label=\"Today's Follow-ups\" class=\"text-center\" style=\"background-color:#efd597 !important;color:#343a40\">";
	if(leadTotalData.todayScheduleCall>0){
		htmlRet=htmlRet+"<a href=\"javascript:void(0);\" style=\"color:#343a40 !important\" onclick=\"return advanceLeadSearchStudent('advanceLeadNewSearchForm','"+moduleId+"', '"+leadTotalData.leadFrom+"','"+leadTotalData.clickFrom+"-"+leadTotalData.clickUserid+"', '0', 'new', true, 'todayScheduleCall','B2C');\">";
		htmlRet=htmlRet+leadTotalData.todayScheduleCall+"</a>";
	}else{
		htmlRet=htmlRet+"-";
	}
	htmlRet=htmlRet+"</td>";	
	htmlRet=htmlRet+"<td data-label=\"Today's School Demo\" class=\"text-center\" style=\"background-color:#f3f39e !important;color:#343a40\">";
	if(leadTotalData.todayDemo>0){
		htmlRet=htmlRet+"<a href=\"javascript:void(0);\" style=\"color:#343a40 !important\" onclick=\"return advanceLeadSearchStudent('advanceLeadNewSearchForm','"+moduleId+"', '"+leadTotalData.leadFrom+"','"+leadTotalData.clickFrom+"-"+leadTotalData.clickUserid+"', '0', 'new', true, 'tdyDemo','B2C');\">";
		htmlRet=htmlRet+leadTotalData.todayDemo+"</a>";
	}else{
		htmlRet=htmlRet+"-";
	}
	htmlRet=htmlRet+"</td>";					
	if(leadTotalData.discardPermission){
		htmlRet=htmlRet+"<td data-label=\"Unassigned Lead\" class=\"text-center\"  style=\"background-color:#6c757d !important;color:#fff\">";
		if(leadTotalData.followupLead2>0){
			htmlRet=htmlRet+"<a href=\"javascript:void(0);\" style=\"color:#fff !important\" onclick=\"return advanceLeadSearchStudent('advanceLeadNewSearchForm','"+moduleId+"', '"+leadTotalData.leadFrom+"','"+leadTotalData.clickFrom+"-"+leadTotalData.clickUserid+"', '0', 'new', true, 'leadnotassign','B2C');\">";
			htmlRet=htmlRet+leadTotalData.followupLead2+"</a>";
		}else{
			htmlRet=htmlRet+"-";
		}
		htmlRet=htmlRet+"</td>";
	}			
	htmlRet=htmlRet+"<td data-label=\"Followup Lead\" class=\"text-center\" >";
	htmlRet=htmlRet+"<select name=\"leadsFollowCount\" id=\"leadsFollowCount\"  onchange=\"advanceLeadSearchStudent('advanceLeadNewSearchForm','"+moduleId+"', '"+leadTotalData.leadFrom+"','"+leadTotalData.clickFrom+"-"+leadTotalData.clickUserid+"', '0', 'new', true,'folwcount','B2C');\">";
	htmlRet=htmlRet+"<option value=\"0\" "+(totalfollowup==0?'selected':'')+">0</option>";
	htmlRet=htmlRet+"<option value=\"1\" "+(totalfollowup==1?'selected':'')+">1</option>";
	htmlRet=htmlRet+"<option value=\"2\" "+(totalfollowup==2?'selected':'')+">2</option>";
	htmlRet=htmlRet+"<option value=\"3\" "+(totalfollowup==3?'selected':'')+">3</option>";
	htmlRet=htmlRet+"<option value=\"4\" "+(totalfollowup==4?'selected':'')+">4</option>";
	htmlRet=htmlRet+"<option value=\"5\" "+(totalfollowup==5?'selected':'')+">5</option>";
	htmlRet=htmlRet+"<option value=\">5\" "+(totalfollowup=='>5'?'selected':'')+">>5</option>";
	htmlRet=htmlRet+"</select>";
	htmlRet=htmlRet+"</td>";
	htmlRet=htmlRet+"<td data-label=\"Unattended Lead\" class=\"text-center\" >";
	if(leadTotalData.unattendedLead>0){
		htmlRet=htmlRet+"<a href=\"javascript:void(0);\" style=\"color:#343a40 !important\" onclick=\"return advanceLeadSearchStudent('advanceLeadNewSearchForm','"+moduleId+"', '"+leadTotalData.leadFrom+"','"+leadTotalData.clickFrom+"-"+leadTotalData.clickUserid+"', '0', 'new', true, 'unattendedLead','B2C');\">";
		htmlRet=htmlRet+leadTotalData.unattendedLead+"</a>";
	}else{
		htmlRet=htmlRet+"-";
	}
	htmlRet=htmlRet+"</td>";
	htmlRet=htmlRet+"<td data-label=\"Total Demo\" class=\"text-center\" style=\"background-color:#f3f39e !important;color:#343a40\">";
	if(leadTotalData.demoLead>0){
		htmlRet=htmlRet+"<a href=\"javascript:void(0);\" style=\"color:#343a40 !important\" onclick=\"return advanceLeadSearchStudent('advanceLeadNewSearchForm','"+moduleId+"', '"+leadTotalData.leadFrom+"','"+leadTotalData.clickFrom+"-"+leadTotalData.clickUserid+"', '0', 'new', true, 'demoLead','B2C');\">";
		htmlRet=htmlRet+leadTotalData.demoLead+"</a>";
	}else{
		htmlRet=htmlRet+"-";
	}	
	htmlRet=htmlRet+" | ";
	if(leadTotalData.followupLead3>0){
		htmlRet=htmlRet+"<a href=\"javascript:void(0);\" style=\"color:#343a40 !important\" onclick=\"return advanceLeadSearchStudent('advanceLeadNewSearchForm','"+moduleId+"', '"+leadTotalData.leadFrom+"','"+leadTotalData.clickFrom+"-"+leadTotalData.clickUserid+"', '0', 'new', true, 'demodone','B2C');\">";
		htmlRet=htmlRet+leadTotalData.followupLead3+"</a>";
	}else{
		htmlRet=htmlRet+"-";
	}	
	htmlRet=htmlRet+"</td>";
	htmlRet=htmlRet+"<td data-label=\"Positive to enrollment\" class=\"text-center\" style=\"background-color:#efd597 !important;color:#343a40\">";
	if(leadTotalData.followupLead1>0){
		htmlRet=htmlRet+"<a href=\"javascript:void(0);\" style=\"color:#343a40 !important\" onclick=\"return advanceLeadSearchStudent('advanceLeadNewSearchForm','"+moduleId+"', '"+leadTotalData.leadFrom+"','"+leadTotalData.clickFrom+"-"+leadTotalData.clickUserid+"', '0', 'new', true, 'followupLead1','B2C');\">";
		htmlRet=htmlRet+leadTotalData.followupLead1+"</a>";
	}else{
		htmlRet=htmlRet+"-";
	}
	htmlRet=htmlRet+"</td>";
	htmlRet=htmlRet+"<td data-label=\"Move lead\" class=\"text-center\" style=\"background-color:#f3d1e7 !important;color:#343a40\">";
	if(leadTotalData.movedLead>0){
		htmlRet=htmlRet+"<a href=\"javascript:void(0);\" style=\"color:#343a40 !important\" onclick=\"return advanceLeadSearchStudent('advanceLeadNewSearchForm','"+moduleId+"', '"+leadTotalData.leadFrom+"','"+leadTotalData.clickFrom+"-"+leadTotalData.clickUserid+"', '0', 'new', true, 'movedLead','B2C');\">";
		htmlRet=htmlRet+leadTotalData.movedLead+"</a>";
	}else{
		htmlRet=htmlRet+"-";
	}		
	htmlRet=htmlRet+"</td>";
	htmlRet=htmlRet+"<td data-label=\"Scrape\" class=\"text-center\" style=\"background-color:#efb3aa !important;color:#343a40\">";
	if(leadTotalData.scrapeLead>0){
		htmlRet=htmlRet+"<a href=\"javascript:void(0);\" style=\"color:#343a40 !important\" onclick=\"return advanceLeadSearchStudent('advanceLeadNewSearchForm','"+moduleId+"', '"+leadTotalData.leadFrom+"','"+leadTotalData.clickFrom+"-"+leadTotalData.clickUserid+"', '0', 'new', true, 'scrapeLead','B2C');\">";
		htmlRet=htmlRet+leadTotalData.scrapeLead+"</a>";
	}else{
		htmlRet=htmlRet+"-";
	}		
	htmlRet=htmlRet+"</td>";	
	//htmlRet=htmlRet+"</tr>";
	return htmlRet;
}


function getLeadTotalHotCountList(data, moduleId){
	var leadTotalData=data.leadTotalData;
	var htmlRet ="";
	var sr=1;
	htmlRet=htmlRet+"<td data-label=\"Hot\" class=\"text-center bg-success text-white\">";
	if(leadTotalData.totalHot>0){
		htmlRet=htmlRet+"<a href=\"javascript:void(0);\" style=\"color:#343a40 !important\" onclick=\"return advanceLeadSearchStudent('advanceLeadNewSearchForm','"+moduleId+"', '"+leadTotalData.leadFrom+"','"+leadTotalData.clickFrom+"-"+leadTotalData.clickUserid+"', '0', 'new', true, 'hottotal','B2C');\">";
		htmlRet=htmlRet+leadTotalData.totalHot+"</a>";
	}else{
		htmlRet=htmlRet+"-";
	}		
	htmlRet=htmlRet+"</td>";

	htmlRet=htmlRet+"<td data-label=\"Warm\" class=\"text-center bg-warning\" >";
	if(leadTotalData.totalWarm>0){
		htmlRet=htmlRet+"<a href=\"javascript:void(0);\" style=\"color:#343a40 !important\" onclick=\"return advanceLeadSearchStudent('advanceLeadNewSearchForm','"+moduleId+"', '"+leadTotalData.leadFrom+"','"+leadTotalData.clickFrom+"-"+leadTotalData.clickUserid+"', '0', 'new', true, 'warmtotal','B2C');\">";
		htmlRet=htmlRet+leadTotalData.totalWarm+"</a>";
	}else{
		htmlRet=htmlRet+"-";
	}		
	htmlRet=htmlRet+"</td>";

	htmlRet=htmlRet+"<td data-label=\"Cold\" class=\"text-center bg-primary text-white\" >";
	if(leadTotalData.totalCold>0){
		htmlRet=htmlRet+"<a href=\"javascript:void(0);\" style=\"color:#fff !important\" onclick=\"return advanceLeadSearchStudent('advanceLeadNewSearchForm','"+moduleId+"', '"+leadTotalData.leadFrom+"','"+leadTotalData.clickFrom+"-"+leadTotalData.clickUserid+"', '0', 'new', true, 'coldtotal','B2C');\">";
		htmlRet=htmlRet+leadTotalData.totalCold+"</a>";
	}else{
		htmlRet=htmlRet+"-";
	}		
	htmlRet=htmlRet+"</td>";
	htmlRet=htmlRet+"<td data-label=\"Website\" class=\"text-center\"  style=\"background-color:#7000FF;\">";
	if(leadTotalData.totalWebsiteDemo>0){
		htmlRet=htmlRet+"<a href=\"javascript:void(0);\" style=\"color:#fff !important\" onclick=\"return advanceLeadSearchStudent('advanceLeadNewSearchForm','"+moduleId+"', '"+leadTotalData.leadFrom+"','"+leadTotalData.clickFrom+"-"+leadTotalData.clickUserid+"', '0', 'new', true, 'totalWebsiteDemo','B2C');\">";
		htmlRet=htmlRet+leadTotalData.totalWebsiteDemo+"</a>";
	}else{
		htmlRet=htmlRet+"-";
	}	
	htmlRet=htmlRet+"</td>";
	htmlRet=htmlRet+"<td data-label=\"Copyurl\" class=\"text-center\"  style=\"background-color:#2200FF;\">";
	if(leadTotalData.totalCopyUrlDemo>0){
		htmlRet=htmlRet+"<a href=\"javascript:void(0);\" style=\"color:#fff !important\" onclick=\"return advanceLeadSearchStudent('advanceLeadNewSearchForm','"+moduleId+"', '"+leadTotalData.leadFrom+"','"+leadTotalData.clickFrom+"-"+leadTotalData.clickUserid+"', '0', 'new', true, 'totalCopyUrlDemo','B2C');\">";
		htmlRet=htmlRet+leadTotalData.totalCopyUrlDemo+"</a>";
	}else{
		htmlRet=htmlRet+"-";
	}	
	htmlRet=htmlRet+"</td>";
	htmlRet=htmlRet+"<td data-label=\"support\" class=\"text-center\" >";
	if(leadTotalData.totalDemoSupport>0){
		htmlRet=htmlRet+"<a href=\"javascript:void(0);\" style=\"color:#343a40 !important\" onclick=\"return advanceLeadSearchStudent('advanceLeadNewSearchForm','"+moduleId+"', '"+leadTotalData.leadFrom+"','"+leadTotalData.clickFrom+"-"+leadTotalData.clickUserid+"', '0', 'new', true, 'totalDemoSupport','B2C');\">";
		htmlRet=htmlRet+leadTotalData.totalDemoSupport+"</a>";
	}else{
		htmlRet=htmlRet+"-";
	}	
	htmlRet=htmlRet+"</td>";

	return htmlRet;
}

function getB2BLeadTotalCount(data, moduleId){
	var leadTotalData=data.leadTotalData;
	var htmlRet ="";
	var sr=1;
	htmlRet+='<div class="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-12 px-1">';
		htmlRet+='<div class="full p-2 bg-light-primary border border-primary rounded-10 position-relative mr-0 mr-sm-2 mb-2 shadow-sm">';
			htmlRet+='<span class="line-left bg-primary d-inline-block position-absolute rounded-10"></span>';
			htmlRet+='<p class="m-0 font-12"><b>Total</b></p>';
			htmlRet+='<p class="m-0">';
			if(leadTotalData.totalLeads>0){
				htmlRet+="<a href=\"javascript:void(0);\" class=\"text-dark\" onclick=\"getTotalLead('B2B')\">"+leadTotalData.totalLeads+"</a>";
			}else{
				htmlRet+="-";
			}
			htmlRet+='</p>';
		htmlRet+='</div>';
	htmlRet+='</div>';
	htmlRet+='<div class="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-12 px-1">';
		htmlRet+='<div class="full p-2 bg-white border border-secondary rounded-10 position-relative mr-0 mr-sm-2 mb-2  shadow-sm ">';
			htmlRet+='<span class="line-left bg-secondary d-inline-block position-absolute rounded-10"></span>';
			htmlRet+='<p class="m-0 font-12"><b>Today\'s Fresh Requests</b></p>';
			htmlRet+='<p class="m-0"><b>';
			if(leadTotalData.freshLead>0){
				htmlRet+="<a href=\"javascript:void(0);\" class=\"text-dark\"  onclick=\"return advanceLeadSearchStudent('advanceLeadNewSearchForm','"+moduleId+"', '"+leadTotalData.leadFrom+"','"+leadTotalData.clickFrom+"-"+leadTotalData.clickUserid+"', '0', 'new', true, 'freshLead','B2B');\">"+leadTotalData.freshLead+"</a>";
			}else{
				htmlRet+="-";
			}
			htmlRet+='</b></p>';
		htmlRet+='</div>';
	htmlRet+='</div>';
	htmlRet+='<div class="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-12 px-1 ">';
		htmlRet+='<div class="full p-2 bg-light border border-secondary rounded-10 position-relative mr-0 mr-sm-2 mb-2  shadow-sm ">';
			htmlRet+='<span class="line-left bg-secondary d-inline-block position-absolute rounded-10"></span>';
			htmlRet+='<p class="m-0 font-12"><b>Basic Details not Filled</b></p>';
			htmlRet+='<p class="m-0"><b>';
			if(leadTotalData.followupLead1>0){
				htmlRet+="<a href=\"javascript:void(0);\" class=\"text-dark\"  onclick=\"return advanceLeadSearchStudent('advanceLeadNewSearchForm','"+moduleId+"', '"+leadTotalData.leadFrom+"','"+leadTotalData.clickFrom+"-"+leadTotalData.clickUserid+"', '0', 'new', true, 'leadbasicdetail','B2B');\">"+leadTotalData.followupLead1+"</a>";
			}else{
				htmlRet+="-";
			}
			htmlRet+='</b></p>';
		htmlRet+='</div>';
	htmlRet+='</div>';
	htmlRet+='<div class="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-12 px-1">';
		htmlRet+='<div class="full p-2 bg-review-white border border-review-dark rounded-10 position-relative mr-0 mr-sm-2 mb-2  shadow-sm">';
			htmlRet+='<span class="line-left bg-review-dark d-inline-block position-absolute rounded-10"></span>';
			htmlRet+='<p class="m-0 font-12"><b>Request Under Review</b></p>';
			htmlRet+='<p class="m-0"><b>';
			if(leadTotalData.followupLead2>0){
				htmlRet+="<a href=\"javascript:void(0);\" class=\"text-dark\"  onclick=\"return advanceLeadSearchStudent('advanceLeadNewSearchForm','"+moduleId+"', '"+leadTotalData.leadFrom+"','"+leadTotalData.clickFrom+"-"+leadTotalData.clickUserid+"', '0', 'new', true, 'leadrequestreview','B2B');\">"+leadTotalData.followupLead2+"</a>";
			}else{
				htmlRet+="-";
			}
			htmlRet+='</b></p>';
		htmlRet+='</div>';
	htmlRet+='</div>';
	htmlRet+='<div class="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-12 px-1">';
		htmlRet+='<div class="full p-2 bg-callCompleted-white border border-callCompleted-dark rounded-10 position-relative mr-0 mr-sm-2 mb-2  shadow-sm">';
			htmlRet+='<span class="line-left bg-callCompleted-dark d-inline-block position-absolute rounded-10"></span>';
			htmlRet+='<p class="m-0 font-12"><b>Call Completed</b></p>';
			htmlRet+='<p class="m-0"><b>';
			if(leadTotalData.totalCallComplete>0){
				htmlRet+="<a href=\"javascript:void(0);\" class=\"text-dark\"  onclick=\"return advanceLeadSearchStudent('advanceLeadNewSearchForm','"+moduleId+"', '"+leadTotalData.leadFrom+"','"+leadTotalData.clickFrom+"-"+leadTotalData.clickUserid+"', '0', 'new', true, 'callb2bcomplete','B2B');\">"+leadTotalData.totalCallComplete+"</a>";
			}else{
				htmlRet+="-";
			}
			htmlRet+='</b></p>';
		htmlRet+='</div>';
	htmlRet+='</div>';
	htmlRet+='<div class="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-12 px-1">';
		htmlRet+='<div class="full p-2 bg-interview-white border border-interview-dark rounded-10 position-relative mr-0 mr-sm-2 mb-2  shadow-sm ">';
			htmlRet+='<span class="line-left bg-interview-dark d-inline-block position-absolute rounded-10"></span>';
			htmlRet+='<p class="m-0 font-12"><b>Interested to Interview</b></p>';
			htmlRet+='<p class="m-0"><b>';
			if(leadTotalData.meetingResult>0){
				htmlRet+="<a href=\"javascript:void(0);\" class=\"text-dark\"  onclick=\"return advanceLeadSearchStudent('advanceLeadNewSearchForm','"+moduleId+"', '"+leadTotalData.leadFrom+"','"+leadTotalData.clickFrom+"-"+leadTotalData.clickUserid+"', '0', 'new', true, 'leadInterestedInterview','B2B');\">"+leadTotalData.meetingResult+"</a>";
			}else{
				htmlRet+="-";
			}
			htmlRet+='</b></p>';
		htmlRet+='</div>';
			
	htmlRet+='</div>';
	htmlRet+='<div class="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-12 px-1">';
		htmlRet+='<div class="full p-2 bg-totinterview-white border border-totinterview-dark rounded-10 position-relative mr-0 mr-sm-2 mb-2  shadow-sm ">';
			htmlRet+='<span class="line-left bg-totinterview-dark d-inline-block position-absolute rounded-10"></span>';
			htmlRet+='<p class="m-0 font-12"><b>Total Interview</b></p>';
			htmlRet+='<p class="m-0"><b>';
			if(leadTotalData.demoLead>0){
				htmlRet+="<a href=\"javascript:void(0);\" class=\"text-dark\"  onclick=\"return advanceLeadSearchStudent('advanceLeadNewSearchForm','"+moduleId+"', '"+leadTotalData.leadFrom+"','"+leadTotalData.clickFrom+"-"+leadTotalData.clickUserid+"', '0', 'new', true, 'leadInterviewBooked','B2B');\">"+leadTotalData.demoLead+"</a>";
			}else{
				htmlRet+="-";
			}
			htmlRet+='</b> | <b>';
			if(leadTotalData.followupLead3>0){
				htmlRet+="<a href=\"javascript:void(0);\" class=\"text-dark\"  onclick=\"return advanceLeadSearchStudent('advanceLeadNewSearchForm','"+moduleId+"', '"+leadTotalData.leadFrom+"','"+leadTotalData.clickFrom+"-"+leadTotalData.clickUserid+"', '0', 'new', true, 'btwinterviewdone','B2B');\">"+leadTotalData.followupLead3+"</a>";
			}else{
				htmlRet+="-";
			}
			htmlRet+='</b></p>';
		htmlRet+='</div>';
	htmlRet+='</div>';
	htmlRet+='<div class="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-12 px-1">';
		htmlRet+='<div class="full p-2 bg-moveinterview-white border border-moveinterview-dark rounded-10 position-relative mr-0 mr-sm-2 mb-2  shadow-sm ">';
			htmlRet+='<span class="line-left bg-moveinterview-dark d-inline-block position-absolute rounded-10"></span>';
			htmlRet+='<p class="m-0 font-12"><b>Moving for the Next meeting</b></p>';
			htmlRet+='<p class="m-0"><b>';
			if(leadTotalData.totalReserved>0){
				htmlRet+="<a href=\"javascript:void(0);\" class=\"text-dark\"  onclick=\"return advanceLeadSearchStudent('advanceLeadNewSearchForm','"+moduleId+"', '"+leadTotalData.leadFrom+"','"+leadTotalData.clickFrom+"-"+leadTotalData.clickUserid+"', '0', 'new', true, 'movingtonextinterview','B2B');\">"+leadTotalData.totalReserved+"</a>";
			}else{
				htmlRet+="-";
			}
			htmlRet+='</b></p>';
		htmlRet+='</div>';
	htmlRet+='</div>';
	
	htmlRet+='<div class="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-12 px-1">';
		htmlRet+='<div class="full  p-2 bg-light-success border border-success rounded-10 position-relative mr-0 mr-sm-2 mb-2 shadow-sm">';
			htmlRet+='<span class="line-left bg-success d-inline-block position-absolute rounded-10"></span>';
			htmlRet+='<p class="m-0 font-12"><b>Converted | Partner </b></p>';
			htmlRet+='<p class="m-0"><b>';
			if(leadTotalData.totalConverted>0){
				htmlRet+="<a href=\"javascript:void(0);\" class=\"text-dark\"  onclick=\"return advanceLeadSearchStudent('advanceLeadNewSearchForm','"+moduleId+"', '"+leadTotalData.leadFrom+"','"+leadTotalData.clickFrom+"-"+leadTotalData.clickUserid+"', '0', 'new', true, 'totalonboarding','B2B');\">"+leadTotalData.totalConverted+"</a>";
			}else{
				htmlRet+="-";
			}
			htmlRet+='</b> | <b>';
			if(leadTotalData.totalPartner>0){
				htmlRet+="<a href=\"javascript:void(0);\" class=\"text-dark\"  onclick=\"return advanceLeadSearchStudent('advanceLeadNewSearchForm','"+moduleId+"', '"+leadTotalData.leadFrom+"','"+leadTotalData.clickFrom+"-"+leadTotalData.clickUserid+"', '0', 'new', true, 'totalonpartner','B2B');\">"+leadTotalData.totalPartner+"</a>";
			}else{
				htmlRet+="-";
			}
			htmlRet+='</b></p>';
		htmlRet+='</div>';
	htmlRet+='</div>';
	htmlRet+='<div class="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-12 px-1">';
		htmlRet+='<div class="full p-2 bg-light-alternate border border-alternate rounded-10 position-relative mr-0 mr-sm-2 mb-2 shadow-sm ">';
			htmlRet+='<span class="line-left bg-alternate d-inline-block position-absolute rounded-10"></span>';
			htmlRet+='<p class="m-0 font-12"><b>Move Lead</b></p>';
			htmlRet+='<p class="m-0"><b>';
			if(leadTotalData.movedLead>0){
				htmlRet+="<a href=\"javascript:void(0);\" class=\"text-dark\"  onclick=\"return advanceLeadSearchStudent('advanceLeadNewSearchForm','"+moduleId+"', '"+leadTotalData.leadFrom+"','"+leadTotalData.clickFrom+"-"+leadTotalData.clickUserid+"', '0', 'new', true, 'btmovdLead','B2B');\">"+leadTotalData.movedLead+"</a>";
			}else{
				htmlRet+="-";
			}
			htmlRet+='</b></p>';
		htmlRet+='</div>';
	htmlRet+='</div>';
	htmlRet+='<div class="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-12 px-1">';
		htmlRet+='<div class="full p-2 bg-light-danger border border-danger rounded-10 position-relative mb-2 shadow-sm">';
			htmlRet+='<span class="line-left bg-danger d-inline-block position-absolute rounded-10"></span>';
			htmlRet+='<p class="m-0 font-12"><b>Scrape</b></p>';
			htmlRet+='<p class="m-0"><b>';
			if(leadTotalData.scrapeLead>0){
				htmlRet+="<a href=\"javascript:void(0);\" class=\"text-dark\"  onclick=\"return advanceLeadSearchStudent('advanceLeadNewSearchForm','"+moduleId+"', '"+leadTotalData.leadFrom+"','"+leadTotalData.clickFrom+"-"+leadTotalData.clickUserid+"', '0', 'new', true, 'scrapeLead','B2B');\">"+leadTotalData.scrapeLead+"</a>";
			}else{
				htmlRet+="-";
			}
			htmlRet+='</b></p>';
		htmlRet+='</div>';
	htmlRet+='</div>';
	htmlRet+='<div class="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-12 px-1">';
		htmlRet+='<div class="full p-2 bg-rejected-white border border-rejected-dark rounded-10 position-relative mb-2 shadow-sm">';
			htmlRet+='<span class="line-left bg-rejected-dark d-inline-block position-absolute rounded-10"></span>';
			htmlRet+='<p class="m-0 font-12"><b>Rejected</b></p>';
			htmlRet+='<p class="m-0"><b>';
			if(leadTotalData.totalArchive>0){
				htmlRet+="<a href=\"javascript:void(0);\" class=\"text-dark\"  onclick=\"return advanceLeadSearchStudent('advanceLeadNewSearchForm','"+moduleId+"', '"+leadTotalData.leadFrom+"','"+leadTotalData.clickFrom+"-"+leadTotalData.clickUserid+"', '0', 'new', true, 'totalArchive','B2B');\">"+leadTotalData.totalArchive+"</a>";
			}else{
				htmlRet+="-";
			}
			htmlRet+='</b></p>';
		htmlRet+='</div>';
	htmlRet+='</div>';
	return htmlRet;
}



// open new modal for success and failed wati msgs
function openSuccessFailedWatiMessages(resp_data,indexSF,templateName) {
	
	//console.log("resp_data :: " + JSON.stringify(resp_data));
	var usrPopDataOnResend = $("#usrPopDataOnResend");
	//usrPopDataOnResend.html('');
	usrPopDataOnResend.html(successFailedWatiMessagesModal(resp_data));

	//console.log( JSON.stringify(usrPopDataOnResend.html()));
	$("#failedWatiTableDiv").slideDown();
	$("#successWatiTableDiv").slideUp();
	$("#successWatiTable").dataTable();

	//if($("#successFailedWatiMessagesModal").length < 1) {
	//$("body").append(successFailedWatiMessagesModal(resp_data))
	//}
	var table = $('#failedWatiTable').DataTable();
	if (table) {
        table.destroy();
    }
	var count=table.rows().count()
	$("#failedWatiTable").dataTable({
		lengthMenu: [[count], [count]],
		lengthChange: false,
		paging: false,
		info: false
        // columnDefs: [
        //     { orderable: false, targets: 0 }
        // ]
    });

	$("#successWatiDiv").css("cursor", "pointer");
	$("#failedWatiDiv").css("cursor", "default");

	$("#chevron_failed").removeClass("fa-chevron-up").addClass("fa-chevron-down");
	$("#chevron_success").removeClass("fa-chevron-down").addClass("fa-chevron-up");

	$("#successWatiDiv").click(function() {
		$("#successWatiTableDiv").slideDown(500);
		$("#failedWatiTableDiv").slideUp(500);
		$("#failedWatiDiv").css("cursor", "pointer");
		$("#successWatiDiv").css("cursor", "default");

		$("#chevron_success").removeClass("fa-chevron-down").addClass("fa-chevron-up");
		$("#chevron_failed").removeClass("fa-chevron-up").addClass("fa-chevron-down");
	});

	$("#failedWatiDiv").click(function() {
		$("#failedWatiTableDiv").slideDown(500);
		$("#successWatiTableDiv").slideUp(500);
		$("#successWatiDiv").css("cursor", "pointer");
		$("#failedWatiDiv").css("cursor", "default");

		$("#chevron_failed").removeClass("fa-chevron-down").addClass("fa-chevron-up");
		$("#chevron_success").removeClass("fa-chevron-up").addClass("fa-chevron-down");
	});

	$('#resendWatiMessagesData').html('<a id="resend_btn" class="btn btn-primary px-3 py-2 mr-2 mt-3 float-right" href="javascript:void(0);">Resend</a>');
	$('#selectionCountOnFailed').html('<span>Selected- </span><span id="selectedCountFailed">0</span> / <span id="totalCountFailed">0</span>');
	$('#templateNameSF').html();
	$('#templateNameSF').html('<b>' + templateName + '</b> '); //$('#confirm_btn_data').html('<a id="confirm_btn" class="btn btn-primary mr-2" href="javascript:void(0);"  onclick="return showWarningMessageShow(\'Are you sure you want to send this data?\',\'sendWatiNotification( \\\''+templateName+'\\\','+index+') \');">SEND MSG</a>');
	boolvalSF =true;
	$('#viewMethodCallingSF').html();
    $('#viewMethodCallingSF').html('<a href="javascript:void(0)" class="btn btn-primary btn-sm rounded-circle" onclick="viewWatiTemplate('+boolvalSF+','+indexSF+', `'+templateName+'`);" > <i class="fa fa-eye text-white"></i> </a>');
	//console.log('mt = ' + templateName);
	$("#resend_btn").click(function () {
		//console.log('clicked on resend') ;;
		var sleads ='';
		var leadNo='';
		$.each($("input[name='chk-users-lead-resend']:checked"), function(){
			leadNo = leadNo+','+$(this).val();
		});
		
		sleads = sleads + leadNo;
		var selectedLeads = sleads.substring(1,sleads.length); 
		if(selectedLeads==''){
			$('#remarksresetDelete2').modal('hide');
			showMessageTheme2(0, 'Please check any one user to send message','',false);
			return false;
		}else{
			showWarningMessageShow('Are you sure you want to resend the message?','sendWatiNotificationToUser( '+indexSF+',\''+templateName+'\',\''+selectedLeads+'\',\'resend\')', 'info-modal-sm');
		}
	});

	var totalCheckboxes = $(".checkToSendFailed").length;
    $("#totalCountFailed").text(totalCheckboxes);

	$(".checkToSendFailed").click(function(){
		updateSelectionCount();
		var arrChkBox = [];
		if($(".checkToSendFailed:checked").length>0){
			if($(".checkToSendFailed:checked").length == $(".checkToSendFailed").length){
				$("#allcheckedFailed").prop("checked",true);
			}else{
				$("#allcheckedFailed").prop("checked",false);
			}
			// $("#allcheckedDiv").addClass("d-inline-block").removeClass("d-none");
		}else{
			// $("#allcheckedDiv").addClass("d-none").removeClass("d-inline-block");
			$("#allcheckedFailed").prop("checked",false);
		}
	});
	$("#allcheckedFailed").click(function(){
		if($(this).prop("checked")){
			$(".checkToSendFailed").prop("checked",true);
		}else{
			$(".checkToSendFailed").prop("checked",false);
		}
		updateSelectionCount();
	});

	function updateSelectionCount(){
        var selectedCountFailed = $(".checkToSendFailed:checked").length;
        $("#selectedCountFailed").text(selectedCountFailed);
    }
}

function updateWatiLogsLink(leadId){  //wati_logs_link_${leads.leadModifyDTO.leadId}
	$("#wati_logs_link_"+leadId).show();
}

function closeModalAndFlushData(){
	// if (emailStatusInterval) {
	// 	clearInterval(emailStatusInterval);
	// 	emailStatusInterval = null;
	// }
	// pendingEmails = [];
	// successfulEmails = [];
	// failedOrOtherEmails = [];
	$("input#allchecked").prop('checked',false);
	$("input#allCheckedEmail").prop('checked',false);
	$('input[name="chk-users-lead"]').prop('checked',false);
	$('input[name="chk-users-lead-email"]').prop('checked',false);
	$(".stmsg").html('');
	$("#successFailedWatiMessagesModalClose").modal("hide");
	$('#allchecked').prop('checked',false);
	$('#allCheckedEmail').prop('checked',false);
	//added to flush all checked box
	$("input#selectLeadAll").prop('checked',false);
	$('input[name="lead-move-another"]').prop('checked',false);
	$("#leadNoMove").val("");
	$("#remarksresetDelete1").remove();
	$(".modal-backdrop").remove();
}

function getLeadStatusLog(leadno, callFrom, adminStatus){
	//console.log(adminStatus);
	var request={};
	request['leadno']=leadno;
	request['adminStatus']=adminStatus;
	request['leadsFollowCount']=$("#leadsFollowCount").val();

	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLFor('leads','lead-status-log'),
		data : JSON.stringify(request),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) { 
			//console.log(data);
			var leadTagging="<b>"+data.leadTagging+"</b>";
			$(".leadtagstatus_"+leadno).html(leadTagging);
			if (data['status'] == '0' || data['status'] == '2') {
				//showMessageTheme2(0, data['message'],'',true);
			}
			else {
				var html='';
				if(callFrom=='new-lead'){
					var incS=1;
					for(var l=0;l<data.data.length;l++){
						var leadCall = data.data[l];

						html+='<li class=" '+(l==0?'follow-up-accordian-active':'')+'">'
							+'<span class="cursor follow-up-no text-primary p-2 text-center border-primary full bold"><label class="float-left">'+(incS++)+'</label> '+(leadCall.leadStatus)+'<br/><span style="font-size:10px">'+(leadCall.statusDate)+'</span> <i class="fa '+(l==0?'fa-angle-up':'fa-angle-down')+' float-right" style="line-height: 20px;"></i></span>'
							+'<div class="follow-up-content text-center" style="'+(l==0?'display: block':'')+'">'
								+'<div class="dropdown d-inline-block text-center my-2" style="position: inherit;">'
									+'<button type="button" aria-haspopup="true" aria-expanded="false" data-toggle="dropdown" class="dropdown-toggle btn btn-sm btn-primary">View Follow Up</button>'
									+'<div tabindex="-1" role="menu" aria-hidden="true" class="dropdown-menu-md dropdown-menu p-2" x-placement="bottom-start" style="position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(0px, 32px, 0px);font-size:11px;">'
										+'<table class="w-100">'
											+'<tr>'
												+'<th class="p-1 border-0">Last Followup Date:</th>'
												+'<td class="p-1 border-0" id="connectedTh">'+(leadCall.statusDate)+'</td>'
											+'</tr>'
											+'<tr>'
												+'<th class="p-1 border-0">Connected Through:</th>'
												+'<td class="p-1 border-0" id="connectedTh">'+(leadCall.leadFollowup)+'</td>'
											+'</tr>'
											+'<tr>'
												+'<th class="p-1 border-0">Connected With:</th>'
												+'<td class="p-1 border-0" id="connectWith">'+(leadCall.tocall)+'</td>'
											+'</tr>'
											+'<tr>'
												+'<th class="p-1 border-0">Next Follow-up:</th>'
												+'<td class="p-1 border-0" id="nextFollowStatus">'
												+(leadCall.callStatus!=''?leadCall.callStatus:'')
												+(leadCall.nextCallDate!=''?leadCall.nextCallDate:'')
												+'</td>'
											+'</tr>'
											+'<tr>'
												+'<th class="p-1 border-0">Remarks:</th>'
												+'<td class="p-1 border-0 text-justify" id="callRemark" style="max-width: 250px;">'+(leadCall.remarks!=''?leadCall.remarks:'N/A')+'</td>'
											+'</tr>'
										+'</table>'
									+'</div>'
								+'</div>'
							+'</div>'
						+'</li>';
					}
					$(".followup-remark-"+leadno).html(html);

					$(".follow-up-no").click(function(){
						$(this).find(".fa-angle-down").toggleClass('fa-angle-down fa-angle-up');
						$(this).parent().siblings().find(".fa-angle-up").toggleClass('fa-angle-up fa-angle-down');
						$(this).parent().find(".follow-up-content").slideDown();
						$(this).parent().siblings().find(".follow-up-content").slideUp();
						$(this).parent().addClass("follow-up-accordian-active");
						$(this).parent().siblings().removeClass("follow-up-accordian-active");
					});


				}else{
					var brtg=1;
					html+='<div style="height:100px;overflow-y:auto">'
					for(var i=0;i<data.data.length;i++){
						if(brtg>3){
							html+='<br/>';
							brtg=1;
						}
						html+='<span style="font-size:12px; " data-toggle="tooltip" data-placement="top">'
							+'<div class="d-inline-block">'
								+'<p class="m-0 text-dark"><i class="fa fa-check-circle" style="color:green;"></i><b>'+data.data[i].leadStatus+'</b></p>'
								+'<p class="m-0 text-dark" style="padding-left:12px">'+data.data[i].statusDate+'</p>'	
							+'</div>'
						+'</span>&nbsp;&nbsp;';		
						brtg=brtg+1;
					}
					html+='</div>'
					$(".leadstatus_"+leadno).html(html);
				}

			}
			return false;
		},
		error : function(e) {
			return false; 
		}
	});
}


function callB2CDashboardLead(moduleId,leadType) {
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForHTML('dashboard', 'b2c-dashboard-lead'),
		data : JSON.stringify(getRequestForB2cDashboard(moduleId,leadType)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			//console.log(data);
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				if(data.totalLeads!=''){
					$("#totalLead").text(data.totalLeads);
				}
				if(data.totalConverted!=''){
					$("#convertLead").text(data.totalConverted);
				}
				if(data.followupLead1!=''){
					$("#positiveLead").text(data.followupLead1);
				}
				if(data.demoLead!=''){
					$("#totalDemoLead").text(data.demoLead);
				}
				// if(data.demoLead!=''){
				// 	$("#totalDemoDone").text(data.demoLead);
				// }
				
			}
		},
			error : function(e) {
				console.log(e);
			}
		});
   }
   

   function getRequestForB2cDashboard(moduleId,leadType) {
	var leadCommonDTO={};
	var leadModifyDTO={};
	var leadModifyDetailDTO={};
	var leadStudentDetailDTO={};
	var leadDemoInfo={};
	var leadCallFollowupDTO={};
	var leadCountDetailDTO={};
	leadModifyDTO['schoolId'] = SCHOOL_ID;
	leadModifyDTO['userId'] = USER_ID;
	leadModifyDTO['moduleId'] = moduleId;
	leadModifyDTO['leadFrom'] = 'LEAD';
	leadModifyDTO['clickFrom'] = 'list';
	leadModifyDTO['currentPage'] = 0;
	leadModifyDTO['leadType'] = leadType;
	
	leadCommonDTO['leadModifyDTO']=leadModifyDTO;
	leadCommonDTO['leadModifyDetailDTO']=leadModifyDetailDTO;
	leadCommonDTO['leadStudentDetailDTO']=leadStudentDetailDTO;
	leadCommonDTO['leadDemoInfo']=leadDemoInfo;
	leadCommonDTO['leadCallFollowupDTO']=leadCallFollowupDTO;
	leadCommonDTO['leadCountDetailDTO']=leadCountDetailDTO;
	
	return leadCommonDTO;
}



function callLeadSourceList(formId, value, elementId, keyStatus) {
	hideMessageTheme2('');
	customLoader(false);
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLForCommon('masters'),
		data: JSON.stringify(getRequestForMaster(formId, 'LEAD-SOURCE-LIST', value)),
		dataType: 'json',
		cache: false,
		timeout: 600000,
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessageTheme2(true, data['message']);
			} else {
				//console.log(data['mastersData']['data']);
				result = data['mastersData']['data'];
				dropdown = $("#"+formId+" #"+elementId);
				dropdown.html('');
				dropdown.append('<option value="0">Select Source</option>');
				$.each(result, function (k, v) {
					if(keyStatus){
						dropdown.append('<option value="' + v.key + '">' + v.value + '</option>');
					}else{
						dropdown.append('<option value="' + v.value + '">' + v.value + '</option>');
					}
				});
				//buildDropdown(data['mastersData']['data'], 0, 'Select Status');
			}
		},
		error: function (e) {
			//showMessage(true, e.responseText);
			console.log(e);
		}
	});
}

function callUTMSourceList(formId, value, elementId, keyStatus) {
	hideMessageTheme2('');
	customLoader(false);
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLForCommon('masters'),
		data: JSON.stringify(getRequestForMaster(formId, 'UTM-SOURCE-LIST', value)),
		dataType: 'json',
		cache: false,
		timeout: 600000,
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessageTheme2(true, data['message']);
			} else {
				//console.log(data['mastersData']['data']);
				result = data['mastersData']['data'];
				dropdown = $("#"+formId+" #"+elementId);
				dropdown.html('');
				dropdown.append('<option value="0">Select Source</option>');
				$.each(result, function (k, v) {
					if(keyStatus){
						dropdown.append('<option value="' + v.key + '">' + v.value + '</option>');
					}else{
						dropdown.append('<option value="' + v.value + '">' + v.value + '</option>');
					}
				});
				//buildDropdown(data['mastersData']['data'], 0, 'Select Status');
			}
		},
		error: function (e) {
			//showMessage(true, e.responseText);
			console.log(e);
		}
	});
}

function getRequestForLeadAssign(formId, key, value,  discardPermission,  requestExtra) {
  var request = {};
  var authentication = {};
  var requestData = {};
  requestData["requestKey"] = key;
  requestData["requestValue"] = value;
  if (requestExtra != undefined) {
    requestData["requestExtra"] = requestExtra;
  }
  if (discardPermission != undefined) {
    requestData["permissionStatus"] = discardPermission;
  }
  authentication["hash"] = getHash();
  authentication["schoolId"] = SCHOOL_ID;
  authentication["schoolUUID"] = SCHOOL_UUID;
  authentication["userType"] = "COMMON";
  request["authentication"] = authentication;
  request["requestData"] = requestData;
  return request;
}

function callLeadAssignUserList(formId, value, elementId, keyStatus, discardPermission, userId, selectStatus) {
    hideMessageTheme2('');
    customLoader(false);

    const requestData = getRequestForLeadAssign(formId, 'LEAD-ASSIGN-USER-LIST', value, discardPermission, userId);

    return new Promise(function(resolve, reject) {
        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: getURLForCommon('masters'),
            data: JSON.stringify(requestData),
            dataType: 'json',
            cache: false,
            async: true,
            timeout: 600000,
            success: function(data) {
                resolve(data);
            },
            error: function(err) {
                reject(err);
            }
        });
    }).then(function(data) {
        if (data['status'] === '0' || data['status'] === '2') {
            showMessageTheme2(true, data['message']);
            return null;  // Indicate error or early exit
        }
		const result = data['mastersData']['data'];
        const dropdown = $("#" + formId + " #" + elementId);
        dropdown.html('');
        dropdown.append('<option value="0">Select Assign</option>');
		$.each(result, function(k, v) {
            if (keyStatus) {
                if (discardPermission) {
                    dropdown.append('<option value="' + v.key + '">' + v.value + ' - (' + v.extra + ')</option>');
                } else {
                    if (selectStatus) {
                        dropdown.append('<option value="' + v.key + '" ' + (v.key == userId ? 'selected' : '') + '>' + v.value + ' - (' + v.extra + ')</option>');
                    } else {
                        dropdown.append('<option value="' + v.key + '">' + v.value + ' - (' + v.extra + ')</option>');
                    }
                }
            } else {
                dropdown.append('<option value="' + v.value + '">' + v.value + '</option>');
            }
        });
		return result;
    }).catch(function(error) {
        console.error('Error occurred:', error);
        throw error;
    });
}




function callLeadCounselorsList(formId, modeSearch, startDate, endDate, elementId, sublistStatus, countryId, campaignId ) {
	if(sublistStatus){
		customLoader(false)
	}
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForHTML('dashboard', 'get-lead-list-counselor'),
		data : JSON.stringify(getRequestForCounselorLead(formId, modeSearch,startDate, endDate, sublistStatus, countryId, campaignId)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			//console.log(data);
			$("#leadReportSearch").modal('hide');
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				var counselorReportType = $("#searchLeadCounselorReportType").val();
				var leadListCounselor=data.leadListCounselor;
				if(leadListCounselor.length>0){
					var httmlTop = getLeadCounselorHtml(data, startDate, endDate, counselorReportType, sublistStatus, countryId, campaignId);
					$("#"+elementId).html(httmlTop);
					if(!sublistStatus){
						$("#counselor-list-footer").removeClass("d-none");
						var httmlFoot = ""
						if(counselorReportType=="LOGS"){
							$("#advanceSearchAndExport12").addClass('hidden');
							$("#listCounselorTheader_log").removeClass('hidden');
							$("#listCounselorTheader").addClass('hidden');
							if(modeSearch=="DAY"){
								$("#zadarmaCallSync").removeClass('hidden');
							}else{
								$("#zadarmaCallSync").addClass('hidden');
							}
							// $("#listCounselorTheader").html(getLogsHeaderHtml());
							httmlFoot+=getLogsFootHtml(data, false);
						}else{
							$("#advanceSearchAndExport12").removeClass('hidden');
							$("#listCounselorTheader_log").addClass('hidden');
							$("#listCounselorTheader").removeClass('hidden');
							$("#zadarmaCallSync").addClass('hidden');
							// $("#listCounselorTheader").html(getLeadsHeaderHtml());
							httmlFoot+=getLeadCounselorFootHtml(data, false);
						}
						getLeadCounselorFootHtml(data, true);
						$("#listCounselorTfoot").html(httmlFoot);
					}else{
						var foots = elementId.split("-")[1];
						var httmlFoot = ""
						if(counselorReportType=="LOGS"){
							$("#advanceSearchAndExport12").addClass('hidden');
							$("#listCounselorTheader_log").removeClass('hidden');
							$("#listCounselorTheader").addClass('hidden');
							// $("#listCounselorTheader").html(getLogsHeaderHtml());
							httmlFoot+=getLogsFootHtml(data, false);
						}else{
							$("#advanceSearchAndExport12").removeClass('hidden');
							$("#listCounselorTheader_log").addClass('hidden');
							$("#listCounselorTheader").removeClass('hidden');
							// $("#listCounselorTheader").html(getLeadsHeaderHtml());
							httmlFoot+=getLeadCounselorFootHtml(data, false);
						}
						if(campaignId==-1 || countryId==-1){
							$("#sublistCounselorTfoot--1").html(httmlFoot);
						}else{
							$("#sublistCounselorTfoot-"+foots).html(httmlFoot);
						}
					}
				}else{
					var httmlTop = getLeadCounselorHtml(data, startDate, endDate, counselorReportType, sublistStatus, countryId, campaignId);
					$("#"+elementId).html(httmlTop);
					//console.log("N/A");
					//var httmlFoot = getLeadCounselorFootHtml(data);
					//$("#listCounselorTfoot").html(httmlFoot);

				}
			}
		},
			error : function(e) {
				console.log(e);
			}
		});
}
   

function getRequestForCounselorLead(formId, modeSearch,startDate, endDate,  sublistStatus, countryId, campaignId) {
	var leadCommonDTO = {};
	var leadModifyDTO = {};
	var leadStudentDetailDTO={};
	var leadModifyDetailDTO={};
	var leadDemoInfo={};
	var leadCallFollowupDTO={};
	leadModifyDTO['schoolId'] = SCHOOL_ID;
	leadModifyDTO['userId'] = USER_ID;
	leadModifyDTO['searchDateType'] = modeSearch;
	leadModifyDTO['assignTos'] = $("#"+formId+" #assignToSearch").val();
	leadModifyDTO['leadStartDate'] = startDate;
	leadModifyDTO['leadEndDate'] = endDate;
	leadModifyDTO['leadSources'] = $("#"+formId+" #sourceSearch").val();
	leadModifyDTO['leadStatuses'] = $("#"+formId+" #statusSearch").val();
	//leadModifyDTO['leadNo'] = $("#"+formId+" #leadNoSearch").val();
	leadStudentDetailDTO['standard'] = $("#"+formId+" #gradeSearch").val();
	leadDemoInfo['demoAssignTo'] = $("#"+formId+" #leadDemoAssign").val();
	leadModifyDetailDTO['acadmicYear'] = $("#"+formId+" #acadmicYear").val();
	if(sublistStatus){
		leadStudentDetailDTO['country'] = countryId;
		if(campaignId==-1){
			leadModifyDetailDTO['utmCampaigns'] = ["-1"];
		}else {
			if(campaignId>0){
				leadModifyDetailDTO['utmCampaigns'] = [campaignId];
			}else{
				leadModifyDetailDTO['utmCampaigns'] = [];
			}
		}
	}else{
		leadStudentDetailDTO['country'] = $("#"+formId+" #countryId").val();
		leadModifyDetailDTO['utmCampaigns'] = $("#"+formId+" #searchCampaign").val();
	}
	leadCommonDTO['leadModifyDTO']=leadModifyDTO;
	leadCommonDTO['leadModifyDetailDTO']=leadModifyDetailDTO;
	leadCommonDTO['leadStudentDetailDTO']=leadStudentDetailDTO;
	leadCommonDTO['leadDemoInfo']=leadDemoInfo;
	leadCommonDTO['leadCallFollowupDTO']=leadCallFollowupDTO;
	if(sublistStatus){
		leadCommonDTO['reportType']='';
	}else{
		leadCommonDTO['reportType']=$("#searchLeadCounselorReportType").val();
	}
	
	//console.log(leadCommonDTO);
	return leadCommonDTO;
}
function callLeadUrl(leadFrom){
	var urlSend = '/dashboard/lead-data-list?moduleId='+moduleId+'&leadFrom=LEAD&clickFrom='+leadFrom+'&startDate=&endDate=&country=0&campaign=&currentPage=0&euid='+ENCRYPTED_USER_ID;
	getAsPost(urlSend);
	customLoader(false)
}
function getLeadCounselorHtml(data, startDate, endDate, counselorReportType, sublistStatus, countryId, campaignId){
	var leadListCounselor=data.leadListCounselor;
	var htmlRet ="";
	var sr=1;
	if(startDate=='' && endDate==''){
		if($("#searchLeadCounselorType").val()=='DAY'){
			let today = new Date();
			let formattedDate = today.toISOString().split('T')[0]; // YYYY-MM-DD format
			startDate=formattedDate.split("-")[2]+'-'+formattedDate.split("-")[1]+'-'+formattedDate.split("-")[0];
			endDate=startDate;
		}else if($("#searchLeadCounselorType").val()=='WEEK'){
			let today = new Date();
			let firstDay = new Date(today.setDate(today.getDate() - today.getDay())); // Start of the week (Sunday)
			let lastDay = new Date(today.setDate(today.getDate() + 6)); // End of the week (Saturday)

			let startDate1 = firstDay.toISOString().split('T')[0]; // Format: YYYY-MM-DD
			let endDate1 = lastDay.toISOString().split('T')[0];
			startDate=startDate1.split("-")[2]+'-'+startDate1.split("-")[1]+'-'+startDate1.split("-")[0];
			endDate=endDate1.split("-")[2]+'-'+endDate1.split("-")[1]+'-'+endDate1.split("-")[0];

		}else if($("#searchLeadCounselorType").val()=='MONTH'){
			let today = new Date();
			let firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
			let lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
			let startDate1 = firstDay.toLocaleDateString("fr-CA",{year:"numeric", month:"2-digit", day:"2-digit"});
    		let endDate1 = lastDay.toLocaleDateString("fr-CA",{year:"numeric", month:"2-digit", day:"2-digit"});
			startDate=startDate1.split("-")[2]+'-'+startDate1.split("-")[1]+'-'+startDate1.split("-")[0];
			endDate=endDate1.split("-")[2]+'-'+endDate1.split("-")[1]+'-'+endDate1.split("-")[0];
		}
	}
		
	if(leadListCounselor.length>0){
		
		for (let ind = 0; ind < leadListCounselor.length; ind++) {
			const leadCounselor = leadListCounselor[ind];
			var assignTo=leadCounselor.assignTo==0?'N':leadCounselor.assignTo;
			if(counselorReportType=='Country' || counselorReportType=='Campaign'){
				if(countryId==0 && campaignId==0){
					assignTo=0
				}
				if(campaignId<0){
					assignTo="00";
					campaignId="00";
				}
				if(countryId<0){
					assignTo="00";
					countryId="00";
				}
			}
			if(leadCounselor.assignName=='Partial entry (Unassigned)')	{
				assignTo="00";
			}
			

			var urlClick="/dashboard/lead-data-list?moduleId=" + moduleId +"&leadFrom=LEAD&currentPage=0&euid=" +ENCRYPTED_USER_ID + "&leadType=B2C";
			
			var totalLeadLink="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','list-"+assignTo+"','"+countryId+"', '"+campaignId+"')";
			var uniqueLeadLink="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','unique-"+assignTo+"','"+countryId+"', '"+campaignId+"')";
			var duplicateLeadLink="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','duplicate-"+assignTo+"','"+countryId+"', '"+campaignId+"')";
			var facebookleadLink="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','facebooklead-"+assignTo+"','"+countryId+"', '"+campaignId+"')";
			var FbleadLink="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','fblead-"+assignTo+"','"+countryId+"', '"+campaignId+"')";
			var igleadLink="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','iglead-"+assignTo+"','"+countryId+"', '"+campaignId+"')";

			var unattendedLink="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','unattendedLead-"+assignTo+"','"+countryId+"', '"+campaignId+"')";
			var demoLeadLink="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','demoLead-"+assignTo+"','"+countryId+"', '"+campaignId+"')";
			var demoLeadDoneLink="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','demodone-"+assignTo+"','"+countryId+"', '"+campaignId+"')";

			var positiveLink="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','positiveLead-"+assignTo+"','"+countryId+"', '"+campaignId+"')";
			var hotLink="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','hottotal-"+assignTo+"','"+countryId+"', '"+campaignId+"')";
			var warmLink="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','warmtotal-"+assignTo+"','"+countryId+"', '"+campaignId+"')";
			var coldLink="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','coldtotal-"+assignTo+"','"+countryId+"', '"+campaignId+"')";
			var bookseatLink="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','reserved-"+assignTo+"','"+countryId+"', '"+campaignId+"')";
			var convertLink="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','enrolled-"+assignTo+"','"+countryId+"', '"+campaignId+"')";
			
			if(counselorReportType=='Country' || counselorReportType=='Campaign'){
				if(!sublistStatus){
					assignTo=0;
					if(counselorReportType=='Country'){
						countryId=leadCounselor.assignTo;
					}
					if(counselorReportType=='Campaign'){
						campaignId=leadCounselor.assignTo;
					}
				}
				totalLeadLink="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','list-"+assignTo+"','"+countryId+"', '"+campaignId+"')";
				uniqueLeadLink="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','unique-"+assignTo+"','"+countryId+"', '"+campaignId+"')";
				duplicateLeadLink="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','duplicate-"+assignTo+"','"+countryId+"', '"+campaignId+"')";
				facebookleadLink="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','facebooklead-"+assignTo+"','"+countryId+"', '"+campaignId+"')";
				FbleadLink="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','fblead-"+assignTo+"','"+countryId+"', '"+campaignId+"')";
				igleadLink="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','iglead-"+assignTo+"','"+countryId+"', '"+campaignId+"')";

				unattendedLink="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','unattendedLead-"+assignTo+"','"+countryId+"', '"+campaignId+"')";
				demoLeadLink="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','demoLead-"+assignTo+"','"+countryId+"', '"+campaignId+"')";
				demoLeadDoneLink="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','demodone-"+assignTo+"','"+countryId+"', '"+campaignId+"')";

				positiveLink="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','positiveLead-"+assignTo+"','"+countryId+"', '"+campaignId+"')";
				hotLink="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','hottotal-"+assignTo+"','"+countryId+"', '"+campaignId+"')";
				warmLink="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','warmtotal-"+assignTo+"','"+countryId+"', '"+campaignId+"')";
				coldLink="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','coldtotal-"+assignTo+"','"+countryId+"', '"+campaignId+"')";
				bookseatLink="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','reserved-"+assignTo+"','"+countryId+"', '"+campaignId+"')";
				convertLink="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','enrolled-"+assignTo+"','"+countryId+"', '"+campaignId+"')";
			}
			
			
			// if(leadCounselor.assignName=='Partial entry (Unassigned)')	{
			// 	totalLeadLink="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','partial-"+leadCounselor.assignTo+"','"+countryId+"', '"+campaignId+"')";
			// }
			

			htmlRet +="<tr>";
			htmlRet +="<td class=\"text-center\">"+(sr++)+"</td>";
			htmlRet +="<td style=\"vertical-align: top !important;\" class=\"text-left\">"+leadCounselor.assignName+"</td>";
			if(sublistStatus){
				var uniqLead=(leadCounselor.totalLead-leadCounselor.duplicateLeadCount);
				htmlRet +="<td style=\"vertical-align: top !important;background-color:#3f6ad8 !important;color:#fff;\" class=\"\"><span class=\"text-left\"><a href=\"javascript:void(0);\" class=\"text-white\" onclick=\""+totalLeadLink+"\">"+leadCounselor.totalLead+"</a></span>  <span class=\"float-right\"><a href=\"javascript:void(0);\" class=\"text-white\" onclick=\""+uniqueLeadLink+"\">"+(uniqLead>0?uniqLead:0) +"</a>  |  <a href=\"javascript:void(0);\" class=\"text-white\" onclick=\""+duplicateLeadLink+"\">"+leadCounselor.duplicateLeadCount+"</a></span></td>";
			}else{
				if(counselorReportType=='Country' || counselorReportType=='Campaign'){
					var dropdownCounselor=getDropdownTable(leadCounselor.assignTo, leadCounselor.totalLead, leadCounselor.duplicateLeadCount, totalLeadLink, uniqueLeadLink, duplicateLeadLink);
					htmlRet +="<td style=\"vertical-align: top !important;background-color:#3f6ad8 !important;color:#fff;\" class=\"\">"+dropdownCounselor+"</td>";
				}else if(counselorReportType!='LOGS'){
					var uniqLead=(leadCounselor.totalLead-leadCounselor.duplicateLeadCount);
					htmlRet +="<td style=\"vertical-align: top !important;background-color:#3f6ad8 !important;color:#fff;\" class=\"\"> ";
					htmlRet +="<div class='d-flex align-items-center'>"
						htmlRet +="<span class='d-flex'><a href=\"javascript:void(0);\" class=\"text-white\" onclick=\""+totalLeadLink+"\">"+leadCounselor.totalLead+"</a></span>"
						htmlRet +="<span class='d-inline-flex ml-auto'><a href=\"javascript:void(0);\" class=\"text-white\" onclick=\""+uniqueLeadLink+"\">"+(uniqLead>0?uniqLead:0) +"</a> | <a href=\"javascript:void(0);\" class=\"text-white\" onclick=\""+duplicateLeadLink+"\">"+leadCounselor.duplicateLeadCount+"</a></span>"
					+"</div></td>"
				}
			}
			if(counselorReportType=='LOGS'){
				htmlRet +=`<td style=\"vertical-align: top !important;\" class=\"text-center\"><button onClick="showZadarmaDetails('${leadCounselor.zadarma}')" style="border: none; outline: none; cursor: pointer;" class=\"bg-success text-white text-center  badge font-12\">${leadCounselor.zadarmaCount}</button></td>`;
				htmlRet +=`<td style=\"vertical-align: top !important;\" class=\"text-center\"><button onClick="showWatiDetails('${leadCounselor.wati}')" style="border: none; outline: none; cursor: pointer;" class=\"bg-warning text-white text-center badge font-12\">${leadCounselor.watiCount}</button></td>`;
				htmlRet +=`<td style=\"vertical-align: top !important;\" class=\"text-center\"><button onClick="showWhatsappDetails('${leadCounselor.whatsappIds}')" style="border: none; outline: none; cursor: pointer;" class=\"bg-primary text-white text-center badge font-12\">${leadCounselor.whatsappCount}</button></td>`;
				htmlRet +=`<td style=\"vertical-align: top !important;\" class=\"text-center\"><button onClick="showMailBrodcastDetails('${leadCounselor.mailIds}')" style="border: none; outline: none; cursor: pointer;" class=\"bg-info text-white text-center badge font-12\">${leadCounselor.mailCount}</button></td>`;

			}else{
				
				htmlRet +="<td style=\"vertical-align: top !important;\" class=\"text-center\">";
				htmlRet +="<div class='d-flex align-items-center'>"
				htmlRet +="<span class='d-flex'><a href=\"javascript:void(0);\"  onclick=\""+facebookleadLink+"\">"+leadCounselor.totalFbLead+"</a></span>"
				htmlRet +="<span class='d-inline-flex ml-auto'><a href=\"javascript:void(0);\"  onclick=\""+FbleadLink+"\">"+leadCounselor.fb_total +"</a> | <a href=\"javascript:void(0);\"  onclick=\""+igleadLink+"\">"+leadCounselor.ig_total+"</a></span>"
				htmlRet +="</div></td>";
				htmlRet +="<td style=\"vertical-align: top !important;\" class=\"text-center\"><a href=\"javascript:void(0);\" onclick=\""+unattendedLink+"\">"+leadCounselor.unattended+"</a></td>";
				htmlRet +="<td style=\"vertical-align: top !important;background-color:#f3f39e !important;color:#343a40;\" class=\"text-center\"><span class=\"badge font-12\"><a href=\"javascript:void(0);\" onclick=\""+demoLeadLink+"\">"+leadCounselor.totalDemo+"</a></span> | <span class=\"badge font-12\"><a href=\"javascript:void(0);\" onclick=\""+demoLeadDoneLink+"\">"+leadCounselor.totalDemoDone+"</a></span></td>";
				htmlRet +="<td style=\"vertical-align: top !important;\" class=\"text-center\"><span class=\"bg-success text-white text-center  badge font-12\"><a href=\"javascript:void(0);\" class=\"text-white\" onclick=\""+hotLink+"\">"+leadCounselor.totalHot+"</a></span> | <span class=\"bg-warning text-white text-center badge font-12\"><a href=\"javascript:void(0);\" class=\"text-white\" onclick=\""+warmLink+"\">"+leadCounselor.totalWarm+"</a></span> | <span class=\"bg-primary text-white text-center badge font-12\"><a href=\"javascript:void(0);\" class=\"text-white\" onclick=\""+coldLink+"\">"+leadCounselor.totalCold+"</a></span></td>";
				htmlRet +="<td style=\"vertical-align: top !important;background-color:#efd597;\" class=\"text-center\"><a href=\"javascript:void(0);\" onclick=\""+positiveLink+"\">"+leadCounselor.positiveEnroll+"</a></td>";
				htmlRet +="<td style=\"vertical-align: top !important;\" class=\"text-center\"><a href=\"javascript:void(0);\" onclick=\""+bookseatLink+"\">"+leadCounselor.reserved+"</a></td>";
				htmlRet +="<td style=\"vertical-align: top !important;background-color:#c4d38a;\" class=\"text-center\"><a href=\"javascript:void(0);\" onclick=\""+convertLink+"\">"+leadCounselor.enrollment+"</a></td>";
				htmlRet +="</tr>";
				
				var countryIds=0;
			    var campignIds=0;
				if(counselorReportType=='Country' || counselorReportType=='Campaign'){
					countryIds=(counselorReportType=='Country'?leadCounselor.assignTo:0);
					campignIds=(counselorReportType=='Campaign'?leadCounselor.assignTo:0);
					if(!sublistStatus){
						callLeadCounselorsList('leadReportSearch',$("#searchLeadCounselorType").val(), startDate, endDate, 'sublistCounselorTbody-'+leadCounselor.assignTo, true, countryIds, campignIds);
					}
				}
			}
		}
	}else{
			htmlRet +="<tr>";
			htmlRet +="<td colspan=\"12\" class=\"text-center\">No Record</td>";
			htmlRet +="</tr>";	

	}
	return htmlRet;
}
function getLeadCounselorFootHtml(data, fontSize){
	var leadListCounselor=data.leadListCounselor;
	var htmlRet ="";
	var sr=1;
	var totalLeads=0;
	var totalFbLeads=0;
	var totalDemo=0;
	var totalDemoDone=0;
	var totalHot=0;
	var totalCold=0;
	var totalWarm=0;
	var positiveEnroll=0;
	var reserved=0;
	var enrollment=0;
	var duplicateLeadCount=0;
	var unattended=0;
	var fbtotal=0;
	var igtotal=0;


	if(leadListCounselor.length>0){
		
		for (let ind = 0; ind < leadListCounselor.length; ind++) {
			const leadCounselor = leadListCounselor[ind];
			totalLeads+=leadCounselor.totalLead;
			duplicateLeadCount+=leadCounselor.duplicateLeadCount;
			totalFbLeads+=leadCounselor.totalFbLead;
			totalDemo+=leadCounselor.totalDemo;
			totalDemoDone+=leadCounselor.totalDemoDone;
			totalHot+=leadCounselor.totalHot;
			totalCold+=leadCounselor.totalCold;
			totalWarm+=leadCounselor.totalWarm;
			positiveEnroll+=leadCounselor.positiveEnroll;
			reserved+=leadCounselor.reserved;
			enrollment+=leadCounselor.enrollment;
			unattended+=leadCounselor.unattended;
			fbtotal+=leadCounselor.fb_total;
			igtotal+=leadCounselor.ig_total;		
			sr=sr+1;
		}
	}else{
			
	}
	if(fontSize){
		htmlRet +="<tr style=\"font-size:14px;background-color: #c9def3 !important;\">";
	}else{
		htmlRet +="<tr style=\"font-size:11px;background-color: #c9def3 !important;\">";
	}
	var uniqLead=(totalLeads-duplicateLeadCount);
	htmlRet +="<th class=\"text-center\"></th>";
	htmlRet +="<th style=\"vertical-align: top !important;\" class=\"text-center\">Total</th>";
	htmlRet +="<th style=\"vertical-align: top !important;\" class=\"\"><span class=\"text-left\">"+totalLeads+"</span>  <span class=\"float-right\">"+(uniqLead>0?uniqLead:0) +"  |  "+duplicateLeadCount+"</span></th>";
	htmlRet +="<th style=\"vertical-align: top !important;\" class=\"text-center\"><span class=\"text-left\">"+totalFbLeads+"</span>  <span class=\"float-right\">"+fbtotal +"  |  "+igtotal+"</span></td>";
	htmlRet +="<th style=\"vertical-align: top !important;\" class=\"text-center\">"+unattended+"</td>";
	htmlRet +="<th style=\"vertical-align: top !important;\" class=\"text-center\">"+totalDemo+" | "+totalDemoDone+"</th>";
	htmlRet +="<th style=\"vertical-align: top !important;\" class=\"text-center\">"+totalHot+" | "+totalWarm+" | "+totalCold+"</th>";
	htmlRet +="<th style=\"vertical-align: top !important;\" class=\"text-center\">"+positiveEnroll+"</th>";
	htmlRet +="<th style=\"vertical-align: top !important;\" class=\"text-center\">"+reserved+"</th>";
	htmlRet +="<th style=\"vertical-align: top !important;\" class=\"text-center\">"+enrollment+"</th>";
	htmlRet +="</tr>";
	return htmlRet;
}

function getLogsFootHtml(data, fontSize){
	var leadListCounselor=data.leadListCounselor;
	var htmlRet ="";
	var sr=1;
	var zadarmatotal=0;
	var watitotal=0;
	var whatsapptotal=0;
	var mailtotal=0;

	if(leadListCounselor.length>0){
		for (let ind = 0; ind < leadListCounselor.length; ind++) {
			const leadCounselor = leadListCounselor[ind];
			zadarmatotal+=leadCounselor.zadarmaCount;
			watitotal+=leadCounselor.watiCount;	
			whatsapptotal+=leadCounselor.whatsappCount;
			mailtotal+=leadCounselor.mailCount;
			sr=sr+1;
		}
	}
	if(fontSize){
		htmlRet +="<tr style=\"font-size:14px;background-color: #c9def3 !important;\">";
	}else{
		htmlRet +="<tr style=\"font-size:11px;background-color: #c9def3 !important;\">";
	}

	htmlRet +="<th class=\"text-center\"></th>";
	htmlRet +="<th style=\"vertical-align: top !important;\" class=\"text-center\">Total</th>";
	htmlRet +="<th style=\"vertical-align: top !important;\" class=\"text-center\">"+zadarmatotal+"</th>";
	htmlRet +="<th style=\"vertical-align: top !important;\" class=\"text-center\">"+watitotal+"</th>";
	htmlRet +="<th style=\"vertical-align: top !important;\" class=\"text-center\">"+whatsapptotal+"</th>";
	htmlRet +="<th style=\"vertical-align: top !important;\" class=\"text-center\">"+mailtotal+"</th>";
	htmlRet +="</tr>";
	return htmlRet;
}


function getDropdownTable(listId, totallead, duplicateLeadCount, totalLeadLink, uniqueLeadLink, duplicateLeadLink){
	var html='';
	html+='<div class="dropdown full">';
    html+='<button type="button"  aria-haspopup="true" aria-expanded="false" data-toggle="dropdown" class="dropdown-toggle btn btn-sm full" style="width:100px;background-color:#3f6ad8 !important;color:#fff; padding:0px"><span class=\"float-left\"><a href=\"javascript:void(0)\" style=\"color:#fff !important\" class=\"not-underline\" onclick="'+totalLeadLink+'">'+totallead+'</a></span> <span class="float-right"><a href=\"javascript:void(0)\" style=\"color:#fff !important\" class=\"not-underline\" onclick="'+uniqueLeadLink+'">'+(totallead-duplicateLeadCount) +'</a>  |  <a href=\"javascript:void(0)\" style=\"color:#fff !important\" class=\"not-underline\" onclick="'+duplicateLeadLink+'">'+duplicateLeadCount+'</a><i class="fa fa-caret-down" ></i></span></button>';
    html+='<div tabindex="-1" role="menu" aria-hidden="true" class="dropdown-menu-lg dropdown-menu" x-placement="bottom-start" style="position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(0px, 33px, 0px);">';
    html+='<table class="table table-bordered table-striped" id="sub-counselor-list-'+listId+'" style="font-size:11px !important; width:1050px;" >';
    html+='<thead>';
	html+='<tr>';
	html+='<th style="5% !important" class="text-center bg-primary text-white">Sr no.</th>';
	html+='<th class="text-center bg-primary text-white">Academic Counselor</th>';
	html+='<th class="bg-primary text-white">Total Leads    U | D </th>';
	html+='<th class="bg-primary text-white">Total    FB | IG </th>';
	html+='<th class="text-center bg-primary text-white">Unattended</th>';
	html+='<th class="text-center bg-primary text-white">Demo Booked | Demo Done</th>';
	html+='<th class="text-center bg-primary text-white">Hot | Warm | Cold</th>';
	html+='<th class="text-center bg-primary text-white">Positive Enrollment</th>';
	html+='<th class="text-center bg-primary text-white">Reserved</th>';
	html+='<th class="text-center bg-primary text-white">Converted</th>';
	html+='</tr>';
	html+='</thead>';
	html+='<tbody id="sublistCounselorTbody-'+listId+'"></tbody>';
	html+='<tfoot id="sublistCounselorTfoot-'+listId+'"></tfoot></tbody>';
	html+='</table>';
	html+='</div>';
	html+='</div>';
	return html;
}

function clickLeadsLink(ulrLink, startDate, endDate, leadClickFrom, country, campaighn){


	var clickUrl=ulrLink+"&startDate="+startDate+"&endDate="+endDate+"&country="+country+"&campaign="+campaighn+"&clickFrom="+leadClickFrom
	getAsPost(clickUrl);
}

function reportLeadSearchReset(formId){
	$("#"+formId+" #sourceSearch").val('').trigger('change');
	$("#"+formId+" #statusSearch").val('').trigger('change');
	$("#"+formId+" #gradeSearch").val('0').trigger('change');
	$("#"+formId+" #assignToSearch").val('').trigger('change');
	$("#"+formId+" #countryId").val('0').trigger('change');
	$("#"+formId+" #leadDemoAssign").val('').trigger('change');
	$("#"+formId+" #searchCampaign").val('').trigger('change');
   
}

function callOpenWatsAppMessage(modalId, leadId){
	$("#"+modalId).modal("show");
	getLeadWatsAppchat(leadId);
}

function getLeadWatsAppchat(leadId){
	var request={};
	request['leadId']=leadId;
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLFor('leads','get-watsApp-chat'),
		data : JSON.stringify(request),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) { 
			//console.log(data);
			if (data['status'] == '0' || data['status'] == '2') {
				//showMessageTheme2(0, data['message'],'',true);
			}
			else {
				var html = watsAppchatBoxHtml(data);
				$(".chatmessage").html(html)
			}
			return false;
		},
		error : function(e) {
			return false;
		}
	});
}

function watsAppchatBoxHtml(data){
	var chatMobileList = data.chatMobileList
	var chatPersonList=data.chatPersonList;
	
	
	var html='';
	html+='<div class="row">';
	html+='	<div class="col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12 mb-2 mb-md-0 text-center text-md-left">';
	html+='		<div class="app-inner-layout chat-layout card">';
	html+='		<div class="app-inner-layout__wrapper">';
	html+='		<div class="app-inner-layout__sidebar card">';
	html+='			<div class="app-inner-layout__sidebar-header">';
	html+='				<ul class="nav flex-column">';
	// html+='					<li class="pt-4 pl-3 pr-3 pb-3 nav-item">';
	// html+='						<div class="input-group">';
	// html+='							<div class="input-group-prepend">';
	// html+='								<div class="input-group-text">';
	// html+='									<i class="fa fa-search"></i>';
	// html+='								</div>';
	// html+='							</div>';
	// html+='							<input placeholder="Search..." type="text" class="form-control"></div>';
	// html+='					</li>';
	html+='					<li class="nav-item-header nav-item">Chat With</li>';
	html+='				</ul>';
	html+='			</div>';
	html+='			<ul class="nav flex-column">';
if(chatPersonList.length>0){
	for(var ct=0;ct<chatPersonList.length;ct++){
		var chatp=chatPersonList[ct];
		html+='				<li class="nav-item">';
		if(ct==0){
			html+='					<button type="button" tabindex="0" class="dropdown-item active">';
		}else{
			html+='					<button type="button" tabindex="0" class="dropdown-item">';
		}
		html+='						<div class="widget-content p-0">';
		html+='							<div class="widget-content-wrapper">';
		html+='								<div class="widget-content-left mr-3">';
		html+='									<div class="avatar-icon-wrapper">';
		html+='										<div class="badge badge-bottom badge-success badge-dot badge-dot-lg"></div>';
		html+='										<div class="avatar-icon"><img src="'+chatp.profilePic+'" alt="" /></div>';
		html+='									</div>';
		html+='								</div>';
		html+='								<div class="widget-content-left">';
		html+='									<div class="widget-heading">'+chatp.chatPerson+'</div>';
		html+='								</div>';
		html+='							</div>';
		html+='						</div>';
		html+='					</button>';
		html+='				</li>';
	}
}else{
	html+='				<li class="nav-item">';
	html+='					<button type="button" tabindex="0" class="dropdown-item">';
	html+='						<div class="widget-content p-0">';
	html+='							<div class="widget-content-wrapper">';
	html+='								<div class="widget-content-left mr-3">';
	html+='									<div class="avatar-icon-wrapper">';
	html+='										<div class="badge badge-bottom badge-success badge-dot badge-dot-lg"></div>';
	html+='										<div class="avatar-icon"><img src="'+data.profilePic+'" alt="" /></div>';
	html+='									</div>';
	html+='								</div>';
	html+='								<div class="widget-content-left">';
	html+='									<div class="widget-heading">No Chat person</div>';
	html+='								</div>';
	html+='							</div>';
	html+='						</div>';
	html+='					</button>';
	html+='				</li>';
}
	html+='			</ul>';
	html+='		</div>';
	html+='	</div>';
	html+='	</div>';
	html+='	</div>';
	html+='	<div class="col-xl-9 col-lg-9 col-md-6 col-sm-12 col-12 mb-2 mb-md-0">';
	html+='		<div class="app-inner-layout chat-layout card">';
	html+='		<div class="app-inner-layout__wrapper">';
	html+='		<div class="app-inner-layout__content ">';
	html+='			<div class="table-responsive">';
	html+='				<div class="app-inner-layout__top-pane">';
	html+='					<div class="pane-left">';
	html+='						<div class="mobile-app-menu-btn">';
	html+='							<button type="button" class="hamburger hamburger--elastic">';
	html+='						<span class="hamburger-box">';
	html+='							<span class="hamburger-inner"></span>';
	html+='						</span>';
	html+='							</button>';
	html+='						</div>';
	html+='						<div class="avatar-icon-wrapper mr-2">';
	html+='							<div class="badge badge-bottom btn-shine badge-success badge-dot badge-dot-lg"></div>';
	html+='							<div class="avatar-icon avatar-icon-xl rounded"><img width="82" src="'+data.profilePic+'" alt=""></div>';
	html+='						</div>';
	html+='						<h4 class="mb-0 text-nowrap">'+data.leadPersonName+' <div class="opacity-7">Last Chat time: <span class="opacity-8">'+(data.lastChatTime!=''?data.lastChatTime:'N/A')+'</span></div></h4>';
	html+='					</div>';
	html+='				</div>';
	html+='				<div class="chat-wrapper">';
	if(chatMobileList!="" && chatMobileList.length>0){
		for(var t=0;t<chatMobileList.length;t++){
			var chatb=chatMobileList[t];
			// var mobileno=chatLb.mobileno;
			// var chatlist=chatLb.jsChatList
			// html+='<div class="text-center bold border-bottom">'+mobileno+'</div>	';
			//if(chatlist.length>0){
				//for(var ct=0;ct<chatlist.length;ct++){
					//var chatb=chatlist[ct];
					if(chatb.message!=''){
						if(chatb.direction=='OUTGOING'){
							html+='					<div class="chat-box-wrapper py-1">';
							html+='						<div>';
							html+='							<div class="avatar-icon-wrapper mr-1">';
							html+='								<div class="badge badge-bottom btn-shine badge-success badge-dot badge-dot-lg"></div>';
							html+='								<div class="avatar-icon avatar-icon-lg rounded"><img src="'+chatb.profilePic+'" alt="" /></div>';
							html+='							</div>';
							html+='						</div>';
							html+='						<div>';
							html+='							<div class="chat-box">'+chatb.message+'</div>';
							html+='							<small class="opacity-6"><i class="fa fa-calendar-alt mr-1"></i>'+chatb.displayDate+' | '+chatb.chatPerson+' | '+chatb.c_phone_no+'</small>';
							html+='						</div>';
							html+='					</div>';
						}else{
				
							html+='					<div class="float-right w-100">';
							html+='						<div class="chat-box-wrapper py-1 chat-box-wrapper-right justify-content-end">';
							html+='							<div>';
							html+='								<div class="chat-box">'+chatb.message+'</div>';
							html+='								<small class="opacity-6"><i class="fa fa-calendar-alt mr-1"></i> '+chatb.displayDate+' | '+data.leadPersonName+' | '+chatb.mobileno+'</small>';
							html+='							</div>';
							html+='							<div>';
							html+='								<div class="avatar-icon-wrapper ml-1">';
							html+='									<div class="badge badge-bottom btn-shine badge-success badge-dot badge-dot-lg"></div>';
							html+='									<div class="avatar-icon avatar-icon-lg rounded"><img src="'+chatb.profilePic+'" alt="" /></div>';
							html+='								</div>';
							html+='							</div>';
							html+='						</div>';
							html+='					</div>';
						}
					}
				
				//}
			// }else{
			// 	html+='					<div class="chat-box-wrapper">';
			// 	html+='<div class="chat-box">No Message</div>';
			// 	html+='				</div>';
		
			// }
		}	
	}else{
		html+='					<div class="chat-box-wrapper">';
		html+='<div class="chat-box">No Message</div>';
		html+='				</div>';

	}

	html+='				</div>';
	html+='			</div>';
	html+='		</div>';
	html+='		</div>';
	html+='		</div>';
	html+='	</div>';
	html+='</div>';	
	return html;
}

function hideEmail(email) {
    let [username, domain] = email.split("@");
    let hiddenUsername = username.slice(0,2) + "*".repeat(username.length - 2)+username.slice(username.length-2,username.length);
    return hiddenUsername + "@" + domain;
}

function getZadarmaLogs(number){
    $.ajax({
        type: "GET",
        url: BASE_URL + CONTEXT_PATH + `zadarma/v1/get-logs?number=${number}`,
        dataType: "json",
        success: function (response) {
			if(response.status == 'success'){
					let modalContent = zadarmaLogsDataModal(response.logs);
					if($("#zadarmaLogsContent").length > 0){
						$("#zadarmaLogsContent").remove();
					}
					$("body").append(modalContent);
					$("#zadarmaLogsContent").modal("show");
			}else{
				showMessageTheme2(0, response.message)
			}
        },
        error: function (xhr, status, error) {
            console.error("Error fetching logs:", error);
        }
    });
}

function removeRecordingModel(modalId){
	$(".modal-backdrop").remove();
	$("#" + modalId).remove();
}

function viewCallRecording(url) {
    let modalId = "callRecordingModal";
    $("#" + modalId).remove();

    let html = `
        <div id="${modalId}" class="modal fade bd-example-modal-lg fade-scale" tabindex="-1" role="dialog" aria-labelledby="callRecordingLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content border-0">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title font-weight-bold">Call Recording</h5>
                        <button type="button" onClick="removeRecordingModel('${modalId}')" class="close text-white" data-dismiss="modal">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body text-center">
                        <p>Click play to listen to the recording.</p>
                        <audio controls class="w-100">
                            <source src="${url}" type="audio/mpeg">
                            Your browser does not support the audio element.
                        </audio>
                    </div>
                </div>
            </div>
        </div>`;

    $("body").append(html);
    $("#" + modalId).modal("show");
}

function getNum(src, maxNumValue, amountTypeId){
	var value = $(src).val();
	var amountType = $("#"+amountTypeId).val();
	maxNumValue = amountType == "P"? 100:1000;
	if (isNaN(value) || value > maxNumValue) {
		showMessageTheme2(0, "Invalid Amount")
	}
}

var ZadarmaOrWati = null;
var currentPageZadarma = 1;
var currentZadarmaIds = null;
function showZadarmaDetails(zadarmaIds) {
	var body = {
		ids: zadarmaIds,
		pageNo: currentPageZadarma,
		pageCount: 10,
	}
	$.ajax({
		url: BASE_URL + CONTEXT_PATH + "zadarma/v1/get-logs-by-ids",
		type: "POST",
		data: JSON.stringify(body),
		contentType: "application/json",
		success: function (response) {
		try {
			if(response.statusCode === 0){
				ZadarmaOrWati = "zadarma";
				if(currentZadarmaIds != zadarmaIds){
					zadarmaData = [...response.logs,...response.unMatchLogs];
					populateZadarmaRecords(response.logs,response.unMatchLogs,"Zadarma Logs", response.totalPages,zadarmaIds.split(",").length);
				}else{
					zadarmaData = [...response.logs,...response.unMatchLogs];
					renderZadarmaTable(response.logs, response.totalPages,zadarmaIds.split(",").length,[...new Set(response.logs.map((elem,index) => elem.callId)),...new Set(response.unMatchLogs.map((elem,index) => elem.callId))].length);
					renderUnMatchZadarmaTable(response.unMatchLogs);
				}
				currentZadarmaIds = zadarmaIds;
			}else if(response.status === '3'){
				redirectLoginPage();
			}else{
				showMessageTheme2(0, response.message);
			}
		} catch (error) {
			console.log("Error Fetching Data:", error);
			
		}
		}
	});
}

var currentPageMail = 1;
var currentMailIds = null;
function showMailBrodcastDetails(mailIds) {
	var body = {
		ids: mailIds,
		pageNo: currentPageMail,
		pageCount: 10,
	}
	$.ajax({
		url: getURLFor('leads', 'get-broadcast-mail-Log'),
		type: "POST",
		data: JSON.stringify(body),
		contentType: "application/json",
		success: function (response) {
		try {
			if(response.statusCode === 0){
				ZadarmaOrWati = "mail";
				if(currentMailIds != mailIds){
					mailData = [...response.logs,...response.unMatchLogs];
					populateMailRecords(response.logs,response.unMatchLogs,"Mail Logs", response.totalPages,mailIds.split(",").length);
				}else{
					mailData = [...response.logs,...response.unMatchLogs];
					renderMailTable(response.logs, response.totalPages,mailIds.split(",").length,[...new Set(response.logs.map((elem,_) => elem.id)),...new Set(response.unMatchLogs.map((elem,_) => elem.id))].length);
					renderUnMatchMailTable(response.unMatchLogs);
				}
				currentMailIds = mailIds;
			}else if(response.status === '3'){
				redirectLoginPage();
			}else{
				showMessageTheme2(0, response.message);
			}
		} catch (error) {
			console.log("Error Fetching Data:", error);
			
		}
		}
	});
}

var currentPageWati = 1;
var currentWatiIds = null;
function showWatiDetails(watiIds){
	var body = {
		ids: watiIds,
		pageNo: currentPageWati,
		pageCount: 10
	}
	$.ajax({
		url: BASE_URL + CONTEXT_PATH + "wati/api/get-wati-Log",
		type: "POST",
		data: JSON.stringify(body),
		contentType: "application/json",
		success: function (response) {
		try {
			if(response.statusCode === 0){
				ZadarmaOrWati = "wati"
				if(currentWatiIds != watiIds){
					watiData = response.data; 
					populateWatiRecords(response.data,response.unMatchData,"Wati Logs", response.totalPages,watiIds.split(",").length);
				}else{
					watiData = response.data; 
					renderWatiTable(response.data, response.totalPages,watiIds.split(",").length,response.data.map((elem,index) => elem.leadNo).length);
				}
				currentWatiIds = watiIds;
			}else{
				showMessageTheme2(0, response.message);
			}
		} catch (error) {
			console.log("Error Fetching Data:", error);
			
		}
		}
	});
}

var currentPageWhatsapp = 1;
var currentWhatsappIds = null;
function showWhatsappDetails(whatsappIds){
	var startDate=$("#counselorStartDate").val();
	var endDate=$("#counselorEndDate").val();
	 if($("#counselorStartDate").val()=='' && $("#counselorStartDate").val()==undefined){
	   startDate='';
	}
	if($("#counselorEndDate").val()=='' && $("#counselorEndDate").val()==undefined){
		endDate='';
	}
	var body = {
		ids: whatsappIds,
		pageNo: currentPageWhatsapp,
		pageCount: 10,
		searchDateType:$("#searchLeadCounselorType").val(),
		startDate,
		endDate
	}
	$.ajax({
		url: BASE_URL + CONTEXT_PATH + "/international-schooling/api/v1/leads/get-watsApp-chat-by-lead-ids",
		type: "POST",
		data: JSON.stringify(body),
		contentType: "application/json",
		success: function (response) {
		try {
			if(response.statusCode === 0){
				ZadarmaOrWati = "whatsapp"
				if(currentWhatsappIds != whatsappIds){
					whatsappData = response.data;
					populateWhatsappRecords(response.data,response.unMatchData,"Whatsapp Messages", response.totalPages,whatsappIds.split(",").length);
				}else{
					whatsappData = response.data;
					renderWhatsappTable(response.data, response.totalPages,whatsappIds.split(",").length)
					// renderUnMatchWhatsappTable(response.unMatchData)
				}
				currentWhatsappIds = whatsappIds;
			}else{
				showMessageTheme2(0, response.message);
			}		
		} catch (error) {
			console.log("Error Fetching Data:", error);
		}
		}
	});
}

function getFilterLeadNo(searchValue) {
    searchValue = searchValue.trim().toLowerCase();
    
    $("#zadarmaLogModalTableBody tr").each(function () {
        var leadNo = $(this).find("td:nth-child(2)").text().trim().toLowerCase(); // Get Lead No column
        
        if (searchValue === "" || leadNo.includes(searchValue)) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
}
let zadarmaData = [];

function getFilterZadarmaLeadNo(searchValue, totalPages) {
    searchValue = searchValue.trim().toLowerCase();
    const filteredData = zadarmaData.filter(item => 
        item.leadNo.toLowerCase().includes(searchValue)
    );
    renderZadarmaTable(filteredData, totalPages,currentZadarmaIds.split(",").length,[...new Set(zadarmaData.map((elem,index) => elem.callId))].length);
	if(searchValue != ""){
		$(".pagination").hide();
	}else{
		$(".pagination").show();
	}
}

let mailData = [];

function getFilterMailLeadNo(searchValue, totalPages) {
    searchValue = searchValue.trim().toLowerCase();
    const filteredData = mailData.filter(item => 
        item.leadNo.toLowerCase().includes(searchValue)
    );
    renderMailTable(filteredData.filter((data,_) => data.leadNo != ""), totalPages,currentMailIds.split(",").length,[...new Set(mailData.map((elem,_) => elem.id))].length);
	if(searchValue != ""){
		$(".pagination").hide();
	}else{
		$(".pagination").show();
	}
}

function populateZadarmaRecords(data, data2,meetingTitle, totalPages,totalCount){
	$("<style>")
	  .prop("type", "text/css")
	  .html(`
		.recurring-modal-backdrop {
		  position: fixed;
		  top: 0;
		  left: 0;
		  width: 100%;
		  height: 100%;
		  background: rgba(0, 0, 0, 0.5);
		  display: none;
		  z-index: 999;
		}
  
		.recurring-modal {
		  position: fixed;
		  top: 0;
		  right: -90%;
		  width: 90%;
		  height: 100vh;
		  background: white;
		  box-shadow: -2px 0px 10px rgba(0, 0, 0, 0.2);
		  transition: right 0.3s ease-in-out;
		  z-index: 1000;
		}
  
		.recurring-modal.open {
		  right: 0;
		}
  
		.modal-header {
		  display: flex;
		  justify-content: space-between;
		  align-items: center;
		  padding: 15px;
		  background: #007bff;
		  color: white;
		}
  
		.modal-body {
		  padding: 20px;
		}
  
		.session-block {
		  margin-bottom: 15px;
		  border-bottom: 1px solid #ddd;
		  padding-bottom: 10px;
		}
  
		.close-btn {
		  background: transparent;
		  border: none;
		  font-size: 24px;
		  color: white;
		  cursor: pointer;
		}
  
		.play-btn {
		  background: #007bff;
		  color: white;
		  border: none;
		  padding: 5px 10px;
		  cursor: pointer;
		  border-radius: 5px;
		}
  
		.play-btn:hover {
		  background: #0056b3;
		}
  
		.accordion-btn {
		  background: #D7EBFF;
		  padding: 5px 10px;
		  width: 100%;
		  text-align: left;
		  cursor: pointer;
		  font-weight: bold;
		  border-radius: 5px;
		  
		}
  
		.accordion-btn:focus {
		  outline: 0px !important;
		}
  
		.recording-list {
		  padding: 10px;
		  background: #fff;
		  border-radius: 5px;
		}
	  `)
	.appendTo("head");
	var modalContent = `
	  <div id="zadarmaLogBackdrop" class="recurring-modal-backdrop" onclick="closeZadarmaModal();"></div>
	  <div id="zadarmaLogModal" class="recurring-modal">
		<div class="p-3" style="background-color:#027FFF;">
		  <h5 class="mb-0" style="color: white;font-size:18px;font-weight: 700;">${meetingTitle}</h5>
		   <button onclick="closeZadarmaModal();" type="button" class="p-2 cursor" data-dismiss="modal" aria-label="Close" style="position: absolute;left:-30px;top:35px;background-color: white !important;border-radius: 5px 0px 0px 5px;font-size: 35px;border:0px;color:#000;">
			<span aria-hidden="true">&times;</span>
		  </button>
		</div>
		<div class="p-3" style="width:300px; margin-left:auto;">
			<input placeholder="Search" type="text" onchange="getFilterZadarmaLeadNo(this.value, ${totalPages})" class="form-control">
		</div>
		<div style="background-color: #fff; height: 100vh;">
		  <div class="px-5" style="height: 80vh;overflow-y:auto;">
			<table id="recurring-recordings-table" class="w-100 table table-bordered border-radius-table">
			  <thead style="position: sticky;top: 0;z-index: 1;">
				<tr style="font-size: 14px;">
					<th class="p-2 rounded-top-left-10 border-right-0 border-primary" style="background-color:rgb(200, 224, 247); font-weight: normal; color:rgb(38, 146, 253)">Lead No</th>
				  <th class="p-2 border-right-0 border-left-0 border-primary" style="background-color:rgb(200, 224, 247);font-weight: normal; color:rgb(38, 146, 253)">Caller</th>
				  <th class="p-2 border-right-0 border-left-0 border-primary" style="background-color:rgb(200, 224, 247);font-weight: normal; color:rgb(38, 146, 253)">Dailed No</th>
				  <th class="p-2 border-right-0 border-left-0 border-primary" style="background-color:rgb(200, 224, 247);font-weight: normal; color:rgb(38, 146, 253)">Type</th>
				  <th class="p-2 border-right-0 border-left-0 border-primary" style="background-color:rgb(200, 224, 247);font-weight: normal; color:rgb(38, 146, 253)">Call Start</th>
				  <th class="p-2 border-right-0 border-left-0 border-primary" style="background-color:rgb(200, 224, 247);font-weight: normal; color:rgb(38, 146, 253)">Duration (in sec)</th>
				  <th class="p-2 border-right-0 border-left-0 border-primary" style="background-color:rgb(200, 224, 247);font-weight: normal; color:rgb(38, 146, 253)">Status</th>
				  <th class="p-2 rounded-top-right-10 border-left-0 border-primary" style="background-color:rgb(200, 224, 247);font-weight: normal; color:rgb(38, 146, 253)">Action</th>
				</tr>
			  </thead>
			  <tbody id="zadarmaLogModalTableBody"></tbody>
			</table>
			<div id="unMatchZadarmaTable"></div>
			<div id="zadarmaPagination"></div>
		  </div>
		</div>
	  </div>
	`;
	$("body").append(modalContent);
	$("#zadarmaPagination").html(renderPagination(currentPageZadarma, totalPages,totalCount,[...new Set(data.map((elem,index) => elem.callId)),...new Set(data2.map((elem,index) => elem.callId))].length));
    renderZadarmaTable(data, totalPages,totalCount,[...new Set(data.map((elem,index) => elem.callId)),...new Set(data2.map((elem,index) => elem.callId))].length);
	renderUnMatchZadarmaTable(data2)
	setTimeout(() => {
	  $("#zadarmaLogBackdrop").fadeIn(200);
	  $("#zadarmaLogModal").addClass("open");
	  $("body").css("overflow", "hidden");
	}, 50);
}

function renderZadarmaTable(data, totalPages,totalCount,countItemCounts) {
	$("#zadarmaPagination").html(renderPagination(currentPageZadarma, totalPages,totalCount,countItemCounts));
    const groupedData = data.reduce((acc, item) => {
        const key = item.leadNo;
        acc[key] = acc[key] || [];
        acc[key].push(item);
        return acc;
    }, {});

    let modalContent = ``;
    $.each(Object.entries(groupedData), function(index,calls){
		let dynamicIndex = (currentPageZadarma - 1) * 10 + index + 1;
		if(calls[1].length===1){
			modalContent+=
			`<tr id="row_id_${dynamicIndex}">
				<td class="py-2 border-right-0 border-primary border-top-0" style="font-weight: 500;background-color:#fff;">${calls[1][0].leadNo}</td>
				<td class="py-2 border-right-0 border-left-0 border-primary border-top-0" style="font-weight: 500;background-color:#fff;">${calls[1][0].caller}</td>
				<td class="py-2 border-right-0 border-left-0 border-primary border-top-0" style="font-weight: 500;background-color:#fff;">${calls[1][0].dialledNumber}</td>
				<td class="py-2 border-right-0 border-left-0 border-primary border-top-0" style="font-weight: 500;background-color:#fff;">${calls[1][0].type === "O" ? "Outgoing" : "Incoming"}</td>
				<td class="py-2 border-right-0 border-left-0 border-primary border-top-0" style="font-weight: 500;background-color:#fff;">${changeDateFormat(new Date(calls[1][0].callStart.slice(0,19)),'mm-dd-yyyy')} | ${calls[1][0].callStart.slice(10,16)}</td>
				<td class="py-2 border-right-0 border-left-0 border-primary border-top-0" style="font-weight: 500;background-color:#fff;">${calls[1][0].seconds}</td>
				<td class="py-2 border-right-0 border-left-0 border-primary border-top-0" style="font-weight: 500;background-color:#fff;">${calls[1][0].status}</td>
				<td class="py-2 border-left-0 border-primary border-top-0" style="font-weight: 500;background-color:#fff;">
					${calls[1][0].recordings === "" 
					? "N/A"
					: `<button onClick="viewCallRecording('${calls[1][0].recordings}')" class="bg-primary text-white text-center" style="cursor:pointer; border:none; border-radius:4px">Play Recording</button>`}
				</td>
			</tr>`;
		}else{
			modalContent+=
			`<tr id="row_id_${dynamicIndex}" style="border-top-left-radius: 10px; border-bottom-left-radius: 10px; border-bottom: 0; border-color: blue">
				<td class="py-2 border-right-0 border-primary border-top-0" style="font-weight: 500;background-color:#fff;">${calls[0]}</td>
				<td colspan="7" class="py-2 pl-0 pr-2 border-left-0 border-primary border-top-0" style="font-weight: 500;background-color:#fff;">
				<table class="w-100 table mb-0 border">
					<thead style="background-color:#f2f2f2;">
						<tr style="font-size:12px">
							<th class="py-1 px-2 font-weight-bold text-dark border-0">Caller</th>
							<th class="py-1 px-2 font-weight-bold text-dark border-0">Dailed No.</th>
							<th class="py-1 px-2 font-weight-bold text-dark border-0">Type</th>
							<th class="py-1 px-2 font-weight-bold text-dark border-0">Call Start</th>
							<th class="py-1 px-2 font-weight-bold text-dark border-0">Duration (in sec)</th>
							<th class="py-1 px-2 font-weight-bold text-dark border-0">Status</th>
							<th class="py-1 px-2 font-weight-bold text-dark border-0 cursor" onclick="toggleSelfTable(\'row_id_${dynamicIndex}\')">
								Recordiing List 
								<span class="d-inline-block float-right " >
									<i id="row_id_${dynamicIndex}_icon" class="fa fa-angle-up"></i>
								</span>
							</th>
						</tr>
					</thead>
					<tbody id="row_id_${dynamicIndex}_body">`;
						$.each(calls[1], function(i, call){
							modalContent+=
							`<tr>
								<td class="py-1 px-2 font-weight-light" style="font-size:13px;background-color:#fff; border-right: 0; border-left: 0px;">${call.caller}</td>
								<td class="py-1 px-2 font-weight-light" style="font-size:13px;background-color:#fff; border-right: 0; border-left: 0px;">${call.dialledNumber}</td>
								<td class="py-1 px-2 font-weight-light" style="font-size:13px;background-color:#fff; border-right: 0; border-left: 0px;">${call.type === "O" ? "Outgoing" : "Incoming"}</td>
								<td class="py-1 px-2 font-weight-light" style="font-size:13px;background-color:#fff; border-right: 0; border-left: 0px;">${changeDateFormat(new Date(call.callStart.slice(0,19)),'mm-dd-yyyy')} | ${call.callStart.slice(10,16)}</td>
								<td class="py-1 px-2 font-weight-light" style="font-size:13px;background-color:#fff; border-right: 0; border-left: 0px;">${call.seconds}</td>
								<td class="py-1 px-2 font-weight-light" style="font-size:13px;background-color:#fff; border-right: 0; border-left: 0px;">${call.status}</td>
								<td class="py-1 px-2 font-weight-light" style="font-size:13px;background-color:#fff; border-right: 0; border-left: 0px;">
									${call.recordings === "" 
									? "N/A"
									: `<button onClick="viewCallRecording('${call.recordings}')" class="bg-primary text-white text-center" style="cursor:pointer; border:none; border-radius:4px">Play Recording</button>`}
								</td>
							</tr>`;
						});
					modalContent+=`</tbody>
				</table>
			</tr>`;
		}
	});
    $("#zadarmaLogModalTableBody").html(modalContent);
	if (!data || data.length === 0) {
		$("#zadarmaLogModalTableBody").html('<tr><td colspan="9" class="text-center py-5" style="font-size: 16px;font-weight: 700;">No recordings found</td></tr>');
	}
}

function renderUnMatchZadarmaTable(data) {
    let modalContent = ``;

		if(data.length >0){
			modalContent+= `<h1 style="color:#f79797; font-size:14px">No lead number found for these calls.</h1>`;
			modalContent+=
			`<table class="w-100 table mb-0 border border-color-#ff1414 mb-4">
					<thead style="background-color:#f79797;">
						<tr style="font-size:12px">
							<th class="py-1 px-2 font-weight-bold text-dark border-0">Caller</th>
							<th class="py-1 px-2 font-weight-bold text-dark border-0">Dailed No.</th>
							<th class="py-1 px-2 font-weight-bold text-dark border-0">Type</th>
							<th class="py-1 px-2 font-weight-bold text-dark border-0">Call Start</th>
							<th class="py-1 px-2 font-weight-bold text-dark border-0">Duration (in sec)</th>
							<th class="py-1 px-2 font-weight-bold text-dark border-0">Status</th>
							<th class="py-1 px-2 font-weight-bold text-dark border-0" >
								Recording 
							</th>
						</tr>
					</thead>
					<tbody >`;
						$.each(data, function(i, call){
							modalContent+=
							`<tr>
								<td class="py-1 px-2 font-weight-light" style="font-size:13px;background-color:#fff; border-right: 0; border-left: 0px;">${call.caller}</td>
								<td class="py-1 px-2 font-weight-light" style="font-size:13px;background-color:#fff; border-right: 0; border-left: 0px;">${call.dialledNumber}</td>
								<td class="py-1 px-2 font-weight-light" style="font-size:13px;background-color:#fff; border-right: 0; border-left: 0px;">${call.type === "O" ? "Outgoing" : "Incoming"}</td>
								<td class="py-1 px-2 font-weight-light" style="font-size:13px;background-color:#fff; border-right: 0; border-left: 0px;">${changeDateFormat(new Date(call.callStart.slice(0,19)),'mm-dd-yyyy')} | ${call.callStart.slice(10,16)}</td>
								<td class="py-1 px-2 font-weight-light" style="font-size:13px;background-color:#fff; border-right: 0; border-left: 0px;">${call.seconds}</td>
								<td class="py-1 px-2 font-weight-light" style="font-size:13px;background-color:#fff; border-right: 0; border-left: 0px;">${call.status}</td>
								<td class="py-1 px-2 font-weight-light" style="font-size:13px;background-color:#fff; border-right: 0; border-left: 0px;">
									${call.recordings === "" 
									? "N/A"
									: `<button onClick="viewCallRecording('${call.recordings}')" class="bg-primary text-white text-center" style="cursor:pointer; border:none; border-radius:4px">Play Recording</button>`}
								</td>
							</tr>`;
						});
					modalContent+=`</tbody>
				</table>`;
		}
    $("#unMatchZadarmaTable").html(modalContent);
}

function closeZadarmaModal() {
	$("#zadarmaLogModal").removeClass("open");
	$("#zadarmaLogBackdrop").fadeOut(200);
	
	setTimeout(() => {
	  $("#zadarmaLogModal").remove();
	  $("#zadarmaLogBackdrop").remove()
	  $("body").css("overflow", "auto");
	}, 300);
	currentPageZadarma = 1;
	currentZadarmaIds = '';
}


function populateMailRecords(data, data2,meetingTitle, totalPages,totalCount){
	$("<style>")
	  .prop("type", "text/css")
	  .html(`
		.recurring-modal-backdrop {
		  position: fixed;
		  top: 0;
		  left: 0;
		  width: 100%;
		  height: 100%;
		  background: rgba(0, 0, 0, 0.5);
		  display: none;
		  z-index: 999;
		}
  
		.recurring-modal {
		  position: fixed;
		  top: 0;
		  right: -90%;
		  width: 90%;
		  height: 100vh;
		  background: white;
		  box-shadow: -2px 0px 10px rgba(0, 0, 0, 0.2);
		  transition: right 0.3s ease-in-out;
		  z-index: 1000;
		}
  
		.recurring-modal.open {
		  right: 0;
		}
  
		.modal-header {
		  display: flex;
		  justify-content: space-between;
		  align-items: center;
		  padding: 15px;
		  background: #007bff;
		  color: white;
		}
  
		.modal-body {
		  padding: 20px;
		}
  
		.session-block {
		  margin-bottom: 15px;
		  border-bottom: 1px solid #ddd;
		  padding-bottom: 10px;
		}
  
		.close-btn {
		  background: transparent;
		  border: none;
		  font-size: 24px;
		  color: white;
		  cursor: pointer;
		}
  
		.play-btn {
		  background: #007bff;
		  color: white;
		  border: none;
		  padding: 5px 10px;
		  cursor: pointer;
		  border-radius: 5px;
		}
  
		.play-btn:hover {
		  background: #0056b3;
		}
  
		.accordion-btn {
		  background: #D7EBFF;
		  padding: 5px 10px;
		  width: 100%;
		  text-align: left;
		  cursor: pointer;
		  font-weight: bold;
		  border-radius: 5px;
		  
		}
  
		.accordion-btn:focus {
		  outline: 0px !important;
		}
  
		.recording-list {
		  padding: 10px;
		  background: #fff;
		  border-radius: 5px;
		}
	  `)
	.appendTo("head");
	var modalContent = `
	  <div id="mailLogBackdrop" class="recurring-modal-backdrop" onclick="closeMailModal();"></div>
	  <div id="mailLogModal" class="recurring-modal email-wrapper">
		<div class="p-3" style="background-color:#027FFF;">
		  <h5 class="mb-0" style="color: white;font-size:18px;font-weight: 700;">${meetingTitle}</h5>
		   <button onclick="closeMailModal();" type="button" class="p-2 cursor" data-dismiss="modal" aria-label="Close" style="position: absolute;left:-30px;top:35px;background-color: white !important;border-radius: 5px 0px 0px 5px;font-size: 35px;border:0px;color:#000;">
			<span aria-hidden="true">&times;</span>
		  </button>
		</div>
		<div class="p-3" style="width:300px; margin-left:auto;">
			<input placeholder="Search" type="text" onchange="getFilterMailLeadNo(this.value, ${totalPages})" class="form-control">
		</div>
		<div style="background-color: #fff; height: 100vh;">
		  <div class="px-5" style="height: 80vh;overflow-y:auto;">
			<table id="recurring-recordings-table" class="w-100 table table-bordered border-radius-table">
			  <thead style="position: sticky;top: 0;z-index: 1;">
				<tr style="font-size: 14px;">
					<th class="p-2 rounded-top-left-10 border-right-0 border-primary" style="background-color:rgb(200, 224, 247); font-weight: normal; color:rgb(38, 146, 253)">Lead No</th>
				  <th class="p-2 border-right-0 border-left-0 border-primary" style="background-color:rgb(200, 224, 247);font-weight: normal; color:rgb(38, 146, 253)">Mail Send Via</th>
				  <th class="p-2 border-right-0 border-left-0 border-primary" style="background-color:rgb(200, 224, 247);font-weight: normal; color:rgb(38, 146, 253)">Sent To</th>
				  <th class="p-2 border-right-0 border-left-0 border-primary" style="background-color:rgb(200, 224, 247);font-weight: normal; color:rgb(38, 146, 253)">Mail Subject</th>
				  <th class="p-2 border-right-0 border-left-0 border-primary" style="background-color:rgb(200, 224, 247);font-weight: normal; color:rgb(38, 146, 253)">messagesSent</th>
				  <th class="p-2 border-right-0 border-left-0 border-primary" style="background-color:rgb(200, 224, 247);font-weight: normal; color:rgb(38, 146, 253)">Mail Status</th>
				  <th class="p-2 rounded-top-right-10 border-left-0 border-primary" style="background-color:rgb(200, 224, 247);font-weight: normal; color:rgb(38, 146, 253)">Action</th>
				</tr>
			  </thead>
			  <tbody id="mailLogModalTableBody"></tbody>
			</table>
			<div id="unMatchMailTable"></div>
			<div id="mailPagination"></div>
		  </div>
		</div>
	  </div>
	  <div id="emailBroadcastLogsTemplate2" class="modal fade bd-example-modal-lg fade-scale" tabindex="" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
			<div class="modal-dialog modal-md" style='width: 80% !important;'>
				<div class="modal-content border-0">
					<div class="modal-header py-1 text-white bg-primary">
						<p class="modal-title fsize-1 m-0 font-weight-bold" id="modalLabel">Preview</p>
						<button type="button" class="close text-white" onclick="hideEmailTemplate()"><span aria-hidden="true">&times;</span></button>
					</div>
					<div class="modal-body px-1">
						<div class="mx-auto">
							<div class="screen">
								<div class="content">
									<div class="full" id="emailBroadcastLogsTemplatePreview2" style="font-size:13px"></div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>`;
	$("body").append(modalContent);
	$("#mailPagination").html(renderPagination(currentPageMail, totalPages,totalCount,[...new Set(data.map((elem,_) => elem.id)),...new Set(data2.map((elem,_) => elem.id))].length));
    renderMailTable(data, totalPages,totalCount,[...new Set(data.map((elem,_) => elem.id)),...new Set(data2.map((elem,_) => elem.id))].length);
	renderUnMatchMailTable(data2)
	setTimeout(() => {
	  $("#mailLogBackdrop").fadeIn(200);
	  $("#mailLogModal").addClass("open");
	  $("body").css("overflow", "hidden");
	}, 50);
}
function hideEmailTemplate(){
	$('#emailBroadcastLogsTemplate2').modal('hide')
}

function renderMailTable(data, totalPages,totalCount,countItemCounts) {
	$("#mailPagination").html(renderPagination(currentPageMail, totalPages,totalCount,countItemCounts));
    const groupedData = data.reduce((acc, item) => {
        const key = item.leadNo;
        acc[key] = acc[key] || [];
        acc[key].push(item);
        return acc;
    }, {});

    let modalContent = ``;
    $.each(Object.entries(groupedData), function(index,calls){
		let dynamicIndex = (currentPageMail - 1) * 10 + index + 1;
		if(calls[1].length===1){
			modalContent+=
			`<tr id="row_id_${dynamicIndex}">
				<td class="py-2 border-right-0 border-primary border-top-0" style="font-weight: 500;background-color:#fff;">${calls[1][0].leadNo}</td>
				<td class="py-2 border-right-0 border-left-0 border-primary border-top-0" style="font-weight: 500;background-color:#fff;">Brevo</td>
				<td class="py-2 border-right-0 border-left-0 border-primary border-top-0" style="font-weight: 500;background-color:#fff;">${calls[1][0].mail}</td>
				<td class="py-2 border-right-0 border-left-0 border-primary border-top-0" style="font-weight: 500;background-color:#fff;">${calls[1][0].subject}</td>
				<td class="py-2 border-right-0 border-left-0 border-primary border-top-0" style="font-weight: 500;background-color:#fff;">${changeDateFormat(new Date(calls[1][0].sentDateTime.slice(0,19)),'mm-dd-yyyy')} | ${calls[1][0].sentDateTime.slice(10,16)}</td>
				<td class="py-2 border-right-0 border-left-0 border-primary border-top-0" style="font-weight: 500;background-color:#fff;">${calls[1][0].status}</td>
				<td class="py-2 border-left-0 border-primary border-top-0" style="font-weight: 500;background-color:#fff;">
					<button onClick="getEmailBroadcastLogsTemplate2(${calls[1][0].campignId},'${calls[1][0].mail}')" class="bg-primary text-white text-center" style="cursor:pointer; border:none; border-radius:4px">View Broadcast</button>
				</td>
			</tr>`;
		}else{
			modalContent+=
			`<tr id="row_id_${dynamicIndex}" style="border-top-left-radius: 10px; border-bottom-left-radius: 10px; border-bottom: 0; border-color: blue">
				<td class="py-2 border-right-0 border-primary border-top-0" style="font-weight: 500;background-color:#fff;">${calls[0]}</td>
				<td colspan="7" class="py-2 pl-0 pr-2 border-left-0 border-primary border-top-0" style="font-weight: 500;background-color:#fff;">
				<table class="w-100 table mb-0 border">
					<thead style="background-color:#f2f2f2;">
						<tr style="font-size:12px">
							<th class="py-1 px-2 font-weight-bold text-dark border-0">Mail Send Via</th>
							<th class="py-1 px-2 font-weight-bold text-dark border-0">Sent To</th>
							<th class="py-1 px-2 font-weight-bold text-dark border-0">Mail Subject</th>
							<th class="py-1 px-2 font-weight-bold text-dark border-0">messagesSent</th>
							<th class="py-1 px-2 font-weight-bold text-dark border-0">Mail Status</th>
							<th class="py-1 px-2 font-weight-bold text-dark border-0 cursor" onclick="toggleSelfTable(\'row_id_${dynamicIndex}\')">
								Broadcast List 
								<span class="d-inline-block float-right " >
									<i id="row_id_${dynamicIndex}_icon" class="fa fa-angle-up"></i>
								</span>
							</th>
						</tr>
					</thead>
					<tbody id="row_id_${dynamicIndex}_body">`;
						$.each(calls[1], function(i, call){
							modalContent+=
							`<tr>
								<td class="py-1 px-2 font-weight-light" style="font-size:13px;background-color:#fff; border-right: 0; border-left: 0px;">Brevo</td>
								<td class="py-1 px-2 font-weight-light" style="font-size:13px;background-color:#fff; border-right: 0; border-left: 0px;">${call.mail}</td>
								<td class="py-1 px-2 font-weight-light" style="font-size:13px;background-color:#fff; border-right: 0; border-left: 0px;">${call.subject}</td>
								<td class="py-1 px-2 font-weight-light" style="font-size:13px;background-color:#fff; border-right: 0; border-left: 0px;">${changeDateFormat(new Date(call.sentDateTime.slice(0,19)),'mm-dd-yyyy')} | ${call.sentDateTime.slice(10,16)}</td>
								<td class="py-1 px-2 font-weight-light" style="font-size:13px;background-color:#fff; border-right: 0; border-left: 0px;">${call.status}</td>								
								<td class="py-1 px-2 font-weight-light" style="font-size:13px;background-color:#fff; border-right: 0; border-left: 0px;">
									<button onClick="getEmailBroadcastLogsTemplate2(${call.campignId},'${call.mail}')" class="bg-primary text-white text-center" style="cursor:pointer; border:none; border-radius:4px">View Broadcast</button>
								</td>
							</tr>`;
						});
					modalContent+=`</tbody>
				</table>
			</tr>`;
		}
	});
    $("#mailLogModalTableBody").html(modalContent);
	if (!data || data.length === 0) {
		$("#mailLogModalTableBody").html('<tr><td colspan="9" class="text-center py-5" style="font-size: 16px;font-weight: 700;">No recordings found</td></tr>');
	}
}

function renderUnMatchMailTable(data) {
    let modalContent = ``;
		if(data.length >0){
			modalContent+= `<h1 style="color:#f79797; font-size:14px">No lead number found for these mail broadcast.</h1>`;
			modalContent+=
			`<table class="w-100 table mb-0 border border-color-#ff1414 mb-4">
					<thead style="background-color:#f79797;">
						<tr style="font-size:12px">
							<th class="py-1 px-2 font-weight-bold text-dark border-0">Mail Send Via</th>
							<th class="py-1 px-2 font-weight-bold text-dark border-0">Sent To</th>
							<th class="py-1 px-2 font-weight-bold text-dark border-0">Mail Subject</th>
							<th class="py-1 px-2 font-weight-bold text-dark border-0">messagesSent</th>
							<th class="py-1 px-2 font-weight-bold text-dark border-0">Mail Status</th>
							<th class="py-1 px-2 font-weight-bold text-dark border-0">
								Action 
							</th>
						</tr>
					</thead>
					<tbody >`;
						$.each(data, function(i, call){
							modalContent+=
							`<tr>
								<td class="py-1 px-2 font-weight-light" style="font-size:13px;background-color:#fff; border-right: 0; border-left: 0px;">Brevo</td>
								<td class="py-1 px-2 font-weight-light" style="font-size:13px;background-color:#fff; border-right: 0; border-left: 0px;">${call.mail}</td>
								<td class="py-1 px-2 font-weight-light" style="font-size:13px;background-color:#fff; border-right: 0; border-left: 0px;">${call.subject}</td>
								<td class="py-1 px-2 font-weight-light" style="font-size:13px;background-color:#fff; border-right: 0; border-left: 0px;">${changeDateFormat(new Date(call.sentDateTime.slice(0,19)),'mm-dd-yyyy')} | ${call.sentDateTime.slice(10,16)}</td>
								<td class="py-1 px-2 font-weight-light" style="font-size:13px;background-color:#fff; border-right: 0; border-left: 0px;">${call.status}</td>
								<td class="py-1 px-2 font-weight-light" style="font-size:13px;background-color:#fff; border-right: 0; border-left: 0px;">
									<button onClick="getEmailBroadcastLogsTemplate2(${call.campignId},'${call.mail}')" class="bg-primary text-white text-center" style="cursor:pointer; border:none; border-radius:4px">View Broadcast</button>
								</td>
							</tr>`;
						});
					modalContent+=`</tbody>
				</table>`;
		}
    $("#unMatchMailTable").html(modalContent);
}

function closeMailModal() {
	$("#mailLogModal").removeClass("open");
	$("#mailLogBackdrop").fadeOut(200);
	
	setTimeout(() => {
	  $("#mailLogModal").remove();
	  $("#mailLogBackdrop").remove()
	  $("body").css("overflow", "auto");
	}, 300);
	currentPageMail = 1;
	currentMailIds = '';
}


let watiData = []

function getFilterWatiLeadNo(searchValue, totalPages) {
    searchValue = searchValue.trim().toLowerCase();
    const filteredData = watiData.filter(item => 
        item.leadNo.toLowerCase().includes(searchValue)
    );
    renderWatiTable(filteredData, totalPages,currentWatiIds.split(",").length,watiData.map((elem,_) => elem.leadNo).length);
	if(searchValue != ""){
		$(".pagination").hide();
	}else{
		$(".pagination").show();
	}
}

function populateWatiRecords(data,data2, meetingTitle, totalPages,totalCount){
	$("<style>")
	  .prop("type", "text/css")
	  .html(`
		.recurring-modal-backdrop {
		  position: fixed;
		  top: 0;
		  left: 0;
		  width: 100%;
		  height: 100%;
		  background: rgba(0, 0, 0, 0.5);
		  display: none;
		  z-index: 999;
		}
  
		.recurring-modal {
		  position: fixed;
		  top: 0;
		  right: -90%;
		  width: 90%;
		  height: 100vh;
		  background: white;
		  box-shadow: -2px 0px 10px rgba(0, 0, 0, 0.2);
		  transition: right 0.3s ease-in-out;
		  z-index: 1000;
		}
  
		.recurring-modal.open {
		  right: 0;
		}
  
		.modal-header {
		  display: flex;
		  justify-content: space-between;
		  align-items: center;
		  padding: 15px;
		  background: #007bff;
		  color: white;
		}
  
		.modal-body {
		  padding: 20px;
		}
  
		.session-block {
		  margin-bottom: 15px;
		  border-bottom: 1px solid #ddd;
		  padding-bottom: 10px;
		}
  
		.close-btn {
		  background: transparent;
		  border: none;
		  font-size: 24px;
		  color: white;
		  cursor: pointer;
		}
  
		.play-btn {
		  background: #007bff;
		  color: white;
		  border: none;
		  padding: 5px 10px;
		  cursor: pointer;
		  border-radius: 5px;
		}
  
		.play-btn:hover {
		  background: #0056b3;
		}
  
		.accordion-btn {
		  background: #D7EBFF;
		  padding: 5px 10px;
		  width: 100%;
		  text-align: left;
		  cursor: pointer;
		  font-weight: bold;
		  border-radius: 5px;
		  
		}
  
		.accordion-btn:focus {
		  outline: 0px !important;
		}
  
		.recording-list {
		  padding: 10px;
		  background: #fff;
		  border-radius: 5px;
		}
	  `)
	.appendTo("head");
    
	var modalContent = `
	  <div id="watiLogBackdrop" class="recurring-modal-backdrop" onclick="closeWatiModal();"></div>
	  <div id="watiLogModal" class="recurring-modal">
		<div class="p-3" style="background-color:#027FFF;">
		  <h5 class="mb-0" style="color: white;font-size:18px;font-weight: 700;">${meetingTitle}</h5>
		   <button onclick="closeWatiModal();" type="button" class="p-2 cursor" data-dismiss="modal" aria-label="Close" style="position: absolute;left:-30px;top:35px;background-color: white !important;border-radius: 5px 0px 0px 5px;font-size: 35px;border:0px;color:#000;">
			<span aria-hidden="true">&times;</span>
		  </button>
		</div>
		<div class="p-3" style="width:300px; margin-left:auto;">
			<input placeholder="Search" type="text" onchange="getFilterWatiLeadNo(this.value, ${totalPages});" class="form-control">
		</div>
		<div style="background-color: #fff; height: 100vh;">
		  <div class="px-5" style="height: 80vh;overflow-y:auto;">
			<table id="recurring-recordings-table"  class="w-100 table border-radius-table>
			  <thead style="position: sticky;top: 0;z-index: 1;">
				<tr style="font-size: 14px;">
				  <th class="p-2 rounded-top-left-10 border-right-0 border-left-0 border-top-0 border-primary" style="background-color:rgb(200, 224, 247); font-weight: normal; color:rgb(38, 146, 253)">Lead No</th>
				  <th class="p-2 border-right-0 border-top-0 border-left-0 border-primary" style="background-color:rgb(200, 224, 247);font-weight: normal; color:rgb(38, 146, 253); width:300px; max-width:300px;" >Name</th>
				  <th class="p-2 border-right-0 border-top-0 border-left-0 border-primary" style="background-color:rgb(200, 224, 247);font-weight: normal; color:rgb(38, 146, 253); width:200px; max-width:200px;">Delivered Date Time</th>
				  <th class="p-2 border-right-0 border-top-0 border-left-0 border-primary" style="background-color:rgb(200, 224, 247);font-weight: normal; color:rgb(38, 146, 253); width:125px; max-width:125px;">Direction</th>
				  <th class="p-2 border-right-0 border-top-0 border-left-0 border-primary" style="background-color:rgb(200, 224, 247);font-weight: normal; color:rgb(38, 146, 253); width:200px; max-width:200px;">Wati Contact No</th>
				  <th class="p-2 rounded-top-right-10 border-left-0 border-right-0 border-top-0 border-primary" style="background-color:rgb(200, 224, 247);font-weight: normal; color:rgb(38, 146, 253);  width:80px; max-width:80px;">Action</th>
				</tr>
			  </thead>
			  <tbody id="watiLogModalTableBody"></tbody>
			</table>
			<div id="unMatchWatiTable"></div>
			<div id="watiLogsPagination"></div>
		  </div>
		</div>
	  </div>`;

	if($("#watiLogBackdrop").length > 0 || $("#watiLogModal").length > 0 ){
		$("#watiLogBackdrop").remove()
		$("#watiLogModal").remove()
	}
	$("body").append(modalContent);
	if (!data || data.length === 0) {
	  $("#watiLogModalTableBody").html('<tr><td colspan="3" class="text-center py-5" style="font-size: 16px;font-weight: 700;">No recordings found</td></tr>');
	}
	$("#watiLogsPagination").html(renderPagination(currentPageWati, totalPages,totalCount,data.map((elem,index) => elem.leadNo).length));
    renderWatiTable(data, totalPages,totalCount,data.map((elem,index) => elem.leadNo).length);
	setTimeout(() => {
	  $("#watiLogBackdrop").fadeIn(200);
	  $("#watiLogModal").addClass("open");
	  $("body").css("overflow", "hidden");
	}, 50);
}

function renderWatiTable(data, totalPages,totalCount,currentItemCount) {
	$("#watiLogsPagination").html(renderPagination(currentPageWati, totalPages,totalCount,currentItemCount));
	const groupedData = data.reduce((acc, item) => {
		const key = item.leadNo;
		acc[key] = acc[key] || [];
		acc[key].push(item);
		return acc;
	  }, {});

    let modalContent = ``;
    $.each(Object.entries(groupedData), function(index,message){
		let dynamicIndex = (currentPageWati - 1) * 10 + index + 1;
		if(message[1].length===1){
			modalContent += `
			<tr id="row_id_wati_${dynamicIndex}" style="border-top-left-radius: 10px;border-bottom-left-radius: 10px; border-bottom: 0; border-color:blue">
			<td class="py-2 border-right-0 border-primary border-top-0" style="font-weight: 500;background-color:#fff;">${message[1][0].leadNo}</td>
			<td class="py-2 border-right-0 border-left-0 border-primary border-top-0" style="font-weight: 500;background-color:#fff;">${message[1][0].operaterName == ""?"User":message[1][0].operaterName}</td>
			<td class="py-2 border-right-0 border-left-0 border-primary border-top-0" style="font-weight: 500;background-color:#fff;">${changeDateFormat(convertTZ(new Date(message[1][0].created), USER_TIMEZONE),'mm-dd-yyyy')} | ${changeDateFormat(convertTZ(new Date(message[1][0].created), USER_TIMEZONE),'yyyy-mm-dd hh:mm:ss').slice(10,16)}</td>
			<td class="py-2 border-right-0 border-left-0 border-primary border-top-0" style="font-weight: 500;background-color:#fff;">${message[1][0].owner ==="true"?"Outgoing":"Incoming"}</td>
			<td class="py-2 border-right-0 border-left-0 border-primary border-top-0" style="font-weight: 500;background-color:#fff;">${message[1][0].watiNumber}</td>
			<td class="py-2 border-left-0 border-primary border-top-0" style="font-weight: 500;background-color:#fff;">
				<button onClick="showWatiMessages(${JSON.stringify(message[1][0]).replace(/"/g, '&quot;')});" class="bg-primary text-white text-center " style="border:none;border-radius:4px;cursor:pointer;">View</button>
			</td>
			</tr>`;
		}else{
			modalContent+=
			`<tr id="row_id_${dynamicIndex}" style="border-top-left-radius: 10px; border-bottom-left-radius: 10px; border-bottom: 0; border-color: blue">
				<td class="py-2 border-right-0 border-primary border-top-0" style="font-weight: 500;background-color:#fff;">${message[0]}</td>
				<td colspan="5" class="py-2 px-2 border-left-0 border-primary border-top-0" style="font-weight: 500;background-color:#fff;">
				<table class="w-100 table mb-0 border">
					<thead style="background-color:#f2f2f2;">
						<tr style="font-size:12px">
							<th class="py-1 px-2 font-weight-bold text-dark border-0">Name</th>
							<th class="py-1 px-2 font-weight-bold text-dark border-0">Delivered Date Time</th>
							<th class="py-1 px-2 font-weight-bold text-dark border-0">Direction</th>
							<th class="py-1 px-2 font-weight-bold text-dark border-0">Wati Contact No</th>
							<th class="py-1 px-2 font-weight-bold text-dark border-0">Action</th>
						</tr>
					</thead>
					<tbody id="row_id_wati_${dynamicIndex}_body">`;
						$.each(message[1].sort((a, b) => parseFloat(new Date(a.created).getTime()) - parseFloat(new Date(b.created).getTime())), function(i, wati){
							modalContent += `<tr style="border-top-left-radius: 10px;border-bottom-left-radius: 10px; border-bottom: 0; border-color:blue">
								<td class="py-1 px-2 font-weight-light" style="font-size:13px;background-color:#fff; border-right: 0; border-left: 0px;">${wati.operaterName == ""?"User":wati.operaterName}</td>
								<td class="py-1 px-2 font-weight-light" style="font-size:13px;background-color:#fff; border-right: 0; border-left: 0px;">${changeDateFormat(convertTZ(new Date(wati.created), USER_TIMEZONE),'mm-dd-yyyy')} | ${changeDateFormat(convertTZ(new Date(wati.created), USER_TIMEZONE),'yyyy-mm-dd hh:mm:ss').slice(10,16)}</td>
								<td class="py-1 px-2 font-weight-light" style="font-size:13px;background-color:#fff; border-right: 0; border-left: 0px;">${wati.owner ==="true"?"Outgoing":"Incoming"}</td>
								<td class="py-1 px-2 font-weight-light" style="font-size:13px;background-color:#fff; border-right: 0; border-left: 0px;">${wati.watiNumber}</td>
								<td class="py-1 px-2 font-weight-light" style="font-size:13px;background-color:#fff; border-right: 0; border-left: 0px;">
									<button onClick="showWatiMessages(${JSON.stringify(wati).replace(/"/g, '&quot;')});" class="bg-primary text-white text-center " style="border:none;border-radius:4px;cursor:pointer;">View</button>
								</td>
							</tr>`;
						});
					modalContent+=`</tbody>
				</table>
			</tr>`;
		}
	});
    $("#watiLogModalTableBody").html(modalContent);
	if (!data || data.length === 0) {
		$("#watiLogModalTableBody").html('<tr><td colspan="7" class="text-center py-5" style="font-size: 16px;font-weight: 700;">No recordings found</td></tr>');
	}
}


function closeWatiModal() {	
	setTimeout(() => {
	  $("#watiLogModal").remove();
	  $("#watiLogBackdrop").remove()
	  $("body").css("overflow", "auto");
	}, 300);
	currentPageWati = 1;
	currentWatiIds = '';
}

function showWatiMessages(data){
	if($("#watiLogsContent").length > 0){
		$("#watiLogsContent").remove()
	}
	$("body").append(whatsappChatUI(data));
	$("#watiLogsTableData").DataTable({
		theme:"bootstrap4",	 //destroy: true,	
	});
	$("#watiLogsContent").modal("show");
}
function whatsappChatUI(responseData) {
    const messages = [JSON.parse(JSON.stringify(responseData))]
        .filter(item => item.eventType === "message" || item.eventType === "broadcastMessage")
        .sort((a, b) => parseFloat(convertTZ(new Date(a.created), USER_TIMEZONE).getTime()) - parseFloat(convertTZ(new Date(a.created), USER_TIMEZONE).getTime()));

    let html = `
        <style>
            .whatsapp-container {
                max-width: 800px;
                margin: 20px auto;
                background: #e5ddd5;
                border-radius: 15px;
                box-shadow: 0 0 20px rgba(0,0,0,0.1);
                font-family: 'Segoe UI', sans-serif;
                overflow: hidden;
                position: relative;
            }

            .chat-header {
                background: linear-gradient(45deg, #075e54, #128c7e);
                color: white;
                padding: 15px 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid rgba(255,255,255,0.1);
            }

			.hide {
				display: none
			}

            .chat-header h3 {
                margin: 0;
                font-size: 1.2em;
            }

            .chat-header small {
                opacity: 0.8;
                font-size: 0.9em;
            }

            .chat-body {
                padding: 20px;
                height: 500px;
                overflow-y: auto;
                background: url('https://i.pinimg.com/736x/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg');
                background-size: contain;
            }

            .message {
                max-width: 100%;
                margin-bottom: 15px;
                display: flex;
                animation: slideIn 0.3s ease;
            }

            .message.sent {
                justify-content: flex-end;
            }

            .message.received {
                justify-content: flex-start;
            }

            .message-bubble {
				max-width: 70%;
                padding: 12px 18px;
                border-radius: 10px;
                position: relative;
                box-shadow: 0 1px 2px rgba(0,0,0,0.1);
                word-wrap: break-word;
            }

            .sent .message-bubble {
                background: #dcf8c6;
                border-bottom-right-radius: 2px;
            }

            .received .message-bubble {
                background: white;
                border-bottom-left-radius: 2px;
            }

            .message-time {
                font-size: 0.7em;
                color: #666;
                margin-top: 5px;
                text-align: right;
            }
            .message-name {
                font-size: 0.7em;
                color: #666;
                margin-top: 2px;
                text-align: right;
            }

            .message-bubble::after {
                content: '';
                position: absolute;
                width: 10px;
                height: 10px;
                bottom: 0;
            }

            .sent .message-bubble::after {
                right: -10px;
                background: #dcf8c6;
                clip-path: polygon(0 100%, 100% 0, 100% 100%);
            }

            .received .message-bubble::after {
                left: -10px;
                background: white;
                clip-path: polygon(0 0, 100% 100%, 0 100%);
            }

            .status-indicator {
                font-size: 0.8em;
                color: #666;
                margin-left: 5px;
            }

            .status-indicator.read {
                color: #34b7f1;
            }

            .close-btn {
                background: none;
                border: none;
                color: white;
                font-size: 1.5em;
                cursor: pointer;
                opacity: 0.8;
            }

            .close-btn:hover {
                opacity: 1;
            }

            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .status-bar {
                background: #f8f9fa;
                padding: 5px 20px;
                font-size: 0.8em;
                color: #666;
                border-bottom: 1px solid #dee2e6;
            }

            .date-separator {
                text-align: center;
                margin: 20px 0;
                position: relative;
            }

            .date-separator span {
                background: #e5ddd5;
                padding: 5px 15px;
                border-radius: 15px;
                font-size: 0.8em;
                color: #666;
                box-shadow: 0 1px 2px rgba(0,0,0,0.1);
            }
        </style>

        <div id="watiLogsContent" class="modal fade bd-example-modal-lg fade-scale" tabindex="" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-xl" style='width: 80% !important;'>
                <div class="d-flex flex-wrap wati-wrapper">
                    <div class="modal-content border-0 watiLogsTableDiv">
                        <div class="modal-header py-1 bg-primary text-white">
                            <h5 class="modal-title font-weight-bold">Wati Logs</h5>
                            <button type="button" class="close text-white" onclick="selfModalHide('watiLogsContent')">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div class="modal-body pt-1">
                            <div class="flex-grow-1">
                                <div class="chat-body">
    `;

    let previousDate = null;

    messages.length == 0? `<div class="center"><h1>No Chat Yet.</h1><div/>` : messages.forEach((msg) => {
        const isSent = msg.owner === "true" || msg.eventType === "broadcastMessage";
        const date = convertTZ(new Date(msg.created), USER_TIMEZONE);
        const currentDateStr = date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        // Add date separator if date changes
        if (previousDate !== currentDateStr) {
            html += `
                <div class="date-separator">
                    <span>${currentDateStr}</span>
                </div>
            `;
            previousDate = currentDateStr;
        }

        const timeString = date.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit', 
            hour12: true 
        });
        
        const messageText = msg.finalText || msg.text || '';
        const formattedText = messageText
            .replace(/\n/g, '<br>')
            .replace(/\*(.*?)\*/g, '<strong>$1</strong>')
            .replace(/😊/g, '<span>😊</span>')
            .replace(/😇/g, '<span>😇</span>')
            .replace(/🤔/g, '<span>🤔</span>')
            .replace(/🗓️/g, '<span>🗓️</span>')
            .replace(/💙/g, '<span>💙</span>')
            .replace(/🙂/g, '<span>🙂</span>');

        html += `
            <div class="message ${isSent ? 'sent' : 'received'}">
                <div class="message-bubble">
				<div class="message-name ${!isSent?'hide':''}">
					${msg.operaterName === undefined ? "Bot" : msg.operaterName + "(" + msg.watiNumber+ ")" }
				</div>
                    ${formattedText}
                    <div class="message-time">
                        ${timeString}
                    </div>
                </div>
            </div>
        `;
    });

    html += `
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    return html;
}

function showWhatsappMessages(data){
	if($("#watiLogsContent").length > 0){
		$("#watiLogsContent").remove()
	}
	$("body").append(whatsAppChat(data));
	$("#watiLogsTableData").DataTable({
		theme:"bootstrap4",	 //destroy: true,	
	});
	$("#watiLogsContent").modal("show");
}
function whatsAppChat(responseData) {
    const messages = JSON.parse(JSON.stringify(responseData)).sort((a, b) => parseFloat(new Date(a.dateTime).getTime()) - parseFloat(new Date(b.dateTime).getTime()));

    let html = `
        <style>
            .whatsapp-container {
                max-width: 800px;
                margin: 20px auto;
                background: #e5ddd5;
                border-radius: 15px;
                box-shadow: 0 0 20px rgba(0,0,0,0.1);
                font-family: 'Segoe UI', sans-serif;
                overflow: hidden;
                position: relative;
            }

            .chat-header {
                background: linear-gradient(45deg, #075e54, #128c7e);
                color: white;
                padding: 15px 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid rgba(255,255,255,0.1);
            }

			.hide {
				display: none
			}

            .chat-header h3 {
                margin: 0;
                font-size: 1.2em;
            }

            .chat-header small {
                opacity: 0.8;
                font-size: 0.9em;
            }

            .chat-body {
                padding: 20px;
                height: 500px;
                overflow-y: auto;
                background: url('https://i.pinimg.com/736x/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg');
                background-size: contain;
            }

            .message {
                max-width: 100%;
                margin-bottom: 15px;
                display: flex;
                animation: slideIn 0.3s ease;
            }

            .message.sent {
                justify-content: flex-end;
            }

            .message.received {
                justify-content: flex-start;
            }

            .message-bubble {
				max-width: 70%;
                padding: 12px 18px;
                border-radius: 10px;
                position: relative;
                box-shadow: 0 1px 2px rgba(0,0,0,0.1);
                word-wrap: break-word;
            }

            .sent .message-bubble {
                background: #dcf8c6;
                border-bottom-right-radius: 2px;
            }

            .received .message-bubble {
                background: white;
                border-bottom-left-radius: 2px;
            }

            .message-time {
                font-size: 0.7em;
                color: #666;
                margin-top: 5px;
                text-align: right;
            }
            .message-name {
                font-size: 0.7em;
                color: #666;
                margin-top: 2px;
                text-align: right;
            }

            .message-bubble::after {
                content: '';
                position: absolute;
                width: 10px;
                height: 10px;
                bottom: 0;
            }

            .sent .message-bubble::after {
                right: -10px;
                background: #dcf8c6;
                clip-path: polygon(0 100%, 100% 0, 100% 100%);
            }

            .received .message-bubble::after {
                left: -10px;
                background: white;
                clip-path: polygon(0 0, 100% 100%, 0 100%);
            }

            .status-indicator {
                font-size: 0.8em;
                color: #666;
                margin-left: 5px;
            }

            .status-indicator.read {
                color: #34b7f1;
            }

            .close-btn {
                background: none;
                border: none;
                color: white;
                font-size: 1.5em;
                cursor: pointer;
                opacity: 0.8;
            }

            .close-btn:hover {
                opacity: 1;
            }

            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .status-bar {
                background: #f8f9fa;
                padding: 5px 20px;
                font-size: 0.8em;
                color: #666;
                border-bottom: 1px solid #dee2e6;
            }

            .date-separator {
                text-align: center;
                margin: 20px 0;
                position: relative;
            }

            .date-separator span {
                background: #e5ddd5;
                padding: 5px 15px;
                border-radius: 15px;
                font-size: 0.8em;
                color: #666;
                box-shadow: 0 1px 2px rgba(0,0,0,0.1);
            }
        </style>

        <div id="watiLogsContent" class="modal fade bd-example-modal-lg fade-scale" tabindex="" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-xl" style='width: 80% !important;'>
                <div class="d-flex flex-wrap wati-wrapper">
                    <div class="modal-content border-0 watiLogsTableDiv">
                        <div class="modal-header py-1 bg-primary text-white">
                            <h5 class="modal-title font-weight-bold">Whatsapp Messages</h5>
                            <button type="button" class="close text-white" onclick="selfModalHide('watiLogsContent')">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div class="modal-body pt-1">
                            <div class="flex-grow-1">
                                <div class="chat-body">
    `;

    let previousDate = null;

    messages.length == 0? `<div class="center"><h1>No Chat Yet.</h1><div/>` : messages.forEach((msg) => {
        const isSent = msg.direction === "OUTGOING" ? true:false;
        const date =  convertTZ(new Date(msg.dateTime), USER_TIMEZONE)
        const currentDateStr = date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        // Add date separator if date changes
        if (previousDate !== currentDateStr) {
            html += `
                <div class="date-separator">
                    <span>${currentDateStr}</span>
                </div>
            `;
            previousDate = currentDateStr;
        }

        const timeString = date.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit', 
            hour12: true 
        });
        
        const formattedText = msg.message
            .replace(/\n/g, '<br>')
            .replace(/\*(.*?)\*/g, '<strong>$1</strong>')
            .replace(/😊/g, '<span>😊</span>')
            .replace(/😇/g, '<span>😇</span>')
            .replace(/🤔/g, '<span>🤔</span>')
            .replace(/🗓️/g, '<span>🗓️</span>')
            .replace(/💙/g, '<span>💙</span>')
            .replace(/🙂/g, '<span>🙂</span>');

        html += `
            <div class="message ${isSent ? 'sent' : 'received'}">
                <div class="message-bubble">
				<div class="message-name ${!isSent?'hide':''}">
				${msg.direction==="OUTGOING"?msg.createdByUser:msg.sentByNumber}
				</div>
                    ${formattedText}
                    <div class="message-time">
                        ${timeString}
                    </div>
                </div>
            </div>
        `;
    });

    html += `
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    return html;
}


function toggleSelfTable(rowId){
	$("#"+rowId+"_body").slideToggle();
	$("#"+rowId+"_icon").toggleClass("fa-angle-down fa-angle-up");
}

function populateWhatsappRecords(data,data2, meetingTitle, totalPages,totalCount){
	$("<style>")
	  .prop("type", "text/css")
	  .html(`
		.recurring-modal-backdrop {
		  position: fixed;
		  top: 0;
		  left: 0;
		  width: 100%;
		  height: 100%;
		  background: rgba(0, 0, 0, 0.5);
		  display: none;
		  z-index: 999;
		}
  
		.recurring-modal {
		  position: fixed;
		  top: 0;
		  right: -90%;
		  width: 90%;
		  height: 100vh;
		  background: white;
		  box-shadow: -2px 0px 10px rgba(0, 0, 0, 0.2);
		  transition: right 0.3s ease-in-out;
		  z-index: 1000;
		}
  
		.recurring-modal.open {
		  right: 0;
		}
  
		.modal-header {
		  display: flex;
		  justify-content: space-between;
		  align-items: center;
		  padding: 15px;
		  background: #007bff;
		  color: white;
		}
  
		.modal-body {
		  padding: 20px;
		}
  
		.session-block {
		  margin-bottom: 15px;
		  border-bottom: 1px solid #ddd;
		  padding-bottom: 10px;
		}
  
		.close-btn {
		  background: transparent;
		  border: none;
		  font-size: 24px;
		  color: white;
		  cursor: pointer;
		}
  
		.play-btn {
		  background: #007bff;
		  color: white;
		  border: none;
		  padding: 5px 10px;
		  cursor: pointer;
		  border-radius: 5px;
		}
  
		.play-btn:hover {
		  background: #0056b3;
		}
  
		.accordion-btn {
		  background: #D7EBFF;
		  padding: 5px 10px;
		  width: 100%;
		  text-align: left;
		  cursor: pointer;
		  font-weight: bold;
		  border-radius: 5px;
		  
		}
  
		.accordion-btn:focus {
		  outline: 0px !important;
		}
  
		.recording-list {
		  padding: 10px;
		  background: #fff;
		  border-radius: 5px;
		}
	  `)
	.appendTo("head");

	if($("#whatsappLogBackdrop").length > 0 || $("#whatsappLogBackdrop").length > 0 ){
		$("#whatsappLogModal").remove()
		$("#whatsappLogBackdrop").remove()
	}
    
	var modalContent = `
	  <div id="whatsappLogBackdrop" class="recurring-modal-backdrop" onclick="closeWhatsappModal();"></div>
	  <div id="whatsappLogModal" class="recurring-modal">
		<div class="p-3" style="background-color:#027FFF;">
		  <h5 class="mb-0" style="color: white;font-size:18px;font-weight: 700;">${meetingTitle}</h5>
		   <button onclick="closeWhatsappModal();" type="button" class="p-2 cursor" data-dismiss="modal" aria-label="Close" style="position: absolute;left:-30px;top:35px;background-color: white !important;border-radius: 5px 0px 0px 5px;font-size: 35px;border:0px;color:#000;">
			<span aria-hidden="true">&times;</span>
		  </button>
		</div>

		<div class="p-3" style="width:300px; margin-left:auto;">
			<input placeholder="Search" type="text" onchange="getFilterWhatsappLeadNo(this.value, ${totalPages})" class="form-control">
		</div>
  
		<div style="background-color: #fff; height: 100vh;">
		  <div class="px-5" style="height: 80vh;overflow-y:auto;">
			<table id="recurring-recordings-table"  class="w-100 table border-radius-table>
			  <thead style="background-color:rgb(193, 220, 248);position: sticky;top: 0;z-index: 1;">
				<tr style="font-size: 14px;">
					<th class="p-2 rounded-top-left-10 border-right-0 border-left-0 border-top-0 border-primary" style="background-color:rgb(200, 224, 247); font-weight: normal; color:rgb(38, 146, 253)">Lead No</th>
					<th class="p-2 border-right-0 border-top-0 border-left-0 border-primary" style="background-color:rgb(200, 224, 247);font-weight: normal; color:rgb(38, 146, 253)">Message from</th>
					<th class="p-2 border-right-0 border-top-0 border-left-0 border-primary" style="background-color:rgb(200, 224, 247);font-weight: normal; color:rgb(38, 146, 253)">Message to</th>
					<th class="p-2 rounded-top-right-10 border-left-0 border-right-0 border-top-0 border-primary" style="background-color:rgb(200, 224, 247);font-weight: normal; color:rgb(38, 146, 253)">Action</th>
				</tr>
			  </thead>
			  <tbody id="whatsappLogModalTableBody"></tbody>
			</table>
			<div id="whatsappPagination"></div>
		  </div>
		</div>
	  </div>`;
	$("body").append(modalContent);
	$("#whatsappPagination").html(renderPagination(currentPageWhatsapp, totalPages,totalCount,[...new Set(data.map((elem,index) => elem.leadNo))].length));
    renderWhatsappTable(data, totalPages,totalCount);
	// renderUnMatchWhatsappTable(data2)
	setTimeout(() => {
	  $("#whatsappLogBackdrop").fadeIn(200);
	  $("#whatsappLogModal").addClass("open");
	  $("body").css("overflow", "hidden");
	}, 50);
}

function renderWhatsappTable(data, totalPages,totalCount){
	$("#whatsappPagination").html(renderPagination(currentPageWhatsapp, totalPages,totalCount,[...new Set(data.map((elem,index) => elem.leadNo))].length));
    const groupedData = data.reduce((acc, item) => {
        const key = item.leadNo;
        acc[key] = acc[key] || [];
        acc[key].push(item);
        return acc;
    }, {});

    let modalContent = ``;
    $.each(Object.entries(groupedData), function(index,message){
		let dynamicIndex = (currentPageWhatsapp - 1) * 10 + index + 1;
			// $.each(data.sort((a, b) => parseFloat(new Date(a.dateTime).getTime()) - parseFloat(new Date(b.dateTime).getTime())), function(index, message){

			if(message[1].length===1){
				modalContent += `
				<tr style="border-top-left-radius: 10px;border-bottom-left-radius: 10px; border-bottom: 0; border-color:blue">
					<td class="py-2 border-right-0 border-primary border-top-0" style="font-weight: 500;background-color:#fff;">${message[1][0].leadNo}</td>
					<td class="py-2 border-right-0 border-primary border-top-0" style="font-weight: 500;background-color:#fff;">${message[1][0].createdByUser}</td>
					<td class="py-2 border-right-0 border-primary border-top-0" style="font-weight: 500;background-color:#fff;">${message[1][0].channelName}</td>

					<td class="py-2 border-primary border-top-0" style="font-weight: 500;background-color:#fff;">
					<button onClick="showWhatsappMessages(${JSON.stringify(message[1]).replace(/"/g, '&quot;')})" class="bg-primary text-white text-center " style="border:none;border-radius:4px;cursor:pointer;">View</button>
					</td>
				</tr>`
				
			}else{
				modalContent+=
				`<tr id="row_id_${dynamicIndex}" style="border-top-left-radius: 10px; border-bottom-left-radius: 10px; border-bottom: 0; border-color: blue">
					<td class="py-2 border-right-0 border-primary border-top-0" style="font-weight: 500;background-color:#fff;">${message[0]}</td>

					<td class="py-2 border-right-0 border-primary border-top-0" style="font-weight: 500;background-color:#fff;">${message[1][0].createdByUser}</td>
					<td class="py-2 border-right-0 border-primary border-top-0" style="font-weight: 500;background-color:#fff;">${message[1][0].channelName}</td>
					<td class="py-2  border-primary border-top-0" style="font-weight: 500;background-color:#fff;">
					<button onClick="showWhatsappMessages(${JSON.stringify(message[1]).replace(/"/g, '&quot;')})" class="bg-primary text-white text-center " style="border:none;border-radius:4px;cursor:pointer;">View</button>
					</td>
				</tr>`;
			}
	})
	$("#whatsappLogModalTableBody").html(modalContent);
	if (!data || data.length === 0) {
		$("#whatsappLogModalTableBody").html('<tr><td colspan="9" class="text-center py-5" style="font-size: 16px;font-weight: 700;">No recordings found</td></tr>');
	}
}

	
function closeWhatsappModal() {	
	setTimeout(() => {
	  $("#whatsappLogModal").remove();
	  $("#whatsappLogBackdrop").remove()
	  $("body").css("overflow", "auto");
	}, 300);
	currentPageWhatsapp = 1;
	currentWhatsappIds = '';
}

let whatsappData = [];
function getFilterWhatsappLeadNo(searchValue, totalPages){
	searchValue = searchValue.trim().toLowerCase();
	const filteredData = whatsappData.filter(item => 
		item.leadNo.toLowerCase().includes(searchValue)
	);
	renderWhatsappTable(filteredData, totalPages,currentWhatsappIds.split(",").length,whatsappData.map((elem,index) => elem.leadNo).length);
	if(searchValue != ""){
		$(".pagination").hide();
	}else{
		$(".pagination").show();
	}
}

function serverMessageContent(){
	var html=
		'<div class="server-message">'
			+'<span class="msg" id="msgTheme2"></span>'
		+'</div>';
	return html;	
}

function renderPagination(currentPage, totalPages,totalCount,currentItemCount) {
	let paginationHtml = `
		<nav aria-label="Page navigation">
		<ul class="pagination justify-content-center align-items-center">
			<li class="page-item ${currentPage == 1 ? 'disabled' : ''}">
			<button class="page-link" onclick="goToPage(${currentPage - 1})"><i class="fa fa-chevron-left mr-2" style="font-size: 10px;"></i>Previous</button>
			</li>`;

	let startPage = Math.max(1, currentPage - 1);
	let endPage = Math.min(totalPages, currentPage + 1);

	if (startPage > 1) {
		paginationHtml += `
		<li class="page-item">
			<button class="page-link" onclick="goToPage(1)">1</button>
		</li>`;
		if (startPage > 2) {
		paginationHtml += `
			<li class="page-item">
			<span class="page-link" style="background: transparent; border: 0px; padding: 6px 0px;">...</span>
			</li>`;
		}
	}

	for (let i = startPage; i <= endPage; i++) {
		paginationHtml += `
		<li class="page-item ${i == currentPage ? 'active' : ''}">
			<button class="page-link" onclick="goToPage(${i})">${i}</button>
		</li>`;
	}

	if (endPage < totalPages) {
		if (endPage < totalPages - 1) {
		paginationHtml += `
			<li class="page-item">
			<span style="background: transparent; border: 0px; padding: 6px 0px;">...</span>
			</li>`;
		}
		paginationHtml += `
		<li class="page-item">
			<button class="page-link" onclick="goToPage(${totalPages})">${totalPages}</button>
		</li>`;
	}

	paginationHtml += `
			<li class="page-item ${currentPage == totalPages ? 'disabled' : ''}">
			<button class="page-link" onclick="goToPage(${currentPage + 1})">Next<i class="fa fa-chevron-right ml-2" style="font-size: 10px;"></i></button>
			</li>
			<div> &nbsp;&nbsp;&nbsp; ${currentItemCount} out of ${totalCount} records</div>
		</ul>
		
		</nav> `;

	return paginationHtml;
}

function goToPage(page) {
	if(ZadarmaOrWati == 'zadarma'){
		currentPageZadarma = page;
		showZadarmaDetails(currentZadarmaIds);
	}else if(ZadarmaOrWati == 'wati'){
		currentPageWati = page;
		showWatiDetails(currentWatiIds);
	}else if(ZadarmaOrWati == 'mail'){
		currentPageMail = page;
		showMailBrodcastDetails(currentMailIds);
	}else{
		currentPageWhatsapp = page;
		showWhatsappDetails(currentWhatsappIds);
	}
}

function syncZadarmaCall(){
	showMessageTheme2(1,"Call synchronization process started.");
	$("#callSyncRotate").addClass("rotate");
	var syncDate=$("#syncZadarmaDate").val();
	$.ajax({
		url: BASE_URL + CONTEXT_PATH + "zadarma/v1/sync?syncDate="+syncDate,
		type: "GET",
		contentType: "application/json",
		dataType: "json",
		async: true,
		global: false,
        success: function (response) {
			if(response.status == 'success'){
				$("#callSyncRotate").removeClass("rotate");
				callLeadCounselorsList('leadReportSearch',$("#searchLeadCounselorType").val(),'','','listCounselorTbody', false, 0, 0);
			}else{
				$("#callSyncRotate").removeClass("rotate");
				showMessageTheme2(0, response.message)
			}
        },
        error: function (xhr, status, error) {
            console.error("Error fetching logs:", error);
			$("#callSyncRotate").removeClass("rotate");
        }
	});
}


function curentTimeStamp(timeZoneOffset){
	var now = new Date();
	var year = now.getFullYear();
	var month = String(now.getMonth() + 1).padStart(2, '0'); // Add leading zero
	var day = String(now.getDate()).padStart(2, '0');
	var hours = String(now.getHours()).padStart(2, '0');
	var minutes = String(now.getMinutes()).padStart(2, '0');
	var seconds = String(now.getSeconds()).padStart(2, '0');

// Custom formatted date and time
	var formattedDateTime = year+'-'+month+'-'+day+' '+hours+':'+minutes+':'+seconds;
	var mCurrent = moment.tz( formattedDateTime, 'YYYY-MM-DD hh:mm:ss', ''+timeZoneOffset+'');
	var offset='UTC '+mCurrent.format('Z');
	$(".leadInfoTime").text(offset);
	$(".leadDemoTime").text(offset);
	$(".b2bleadInfoTime").text(offset);
	
}

function getLeadDataList(formId, leadFrom, clickFrom, currentPage, typeTheme, newTheme, callbadge, objRights, roleModule ) {
	customLoader(true);
	checkTextBox(formId);
	if($("#"+formId+" #leadStartDateSearch").val()!='' && $("#"+formId+" #leadEndDateSearch").val()!=''){
		if($("#"+formId+" #searchDateType option:selected").val()=='' ){
			//$(".leadErrorText").html('Please select type for date');
			showMessageTheme2(0, 'Please select type for date');
			return false;
		}
	}
	if(moduleId==''){
		moduleId=$("#"+formId+" #leadFromSearchModuleId").val();
	}
	if(clickFrom==''){
		clickFrom=$("#"+formId+" #clickFromSearch").val();
	}
	if(currentPage==''){
		currentPage=$("#"+formId+" #currentPageSearch").val();
	}
	$('#leadAdvanceSearch').modal('hide');
	
	 $.ajax({
		 type : "POST",
		 contentType : "application/json",
		 url : getURLForHTML('/api/v1/leads', 'get-lead-data'),
		 data : JSON.stringify(getCallRequestForAdvanceLeadSearchStudent(formId, objRights.moduleId, leadFrom, clickFrom, currentPage, typeTheme, newTheme, callbadge, objRights.leadType,'Y')),
		 dataType : 'json',
		 global : false,
		 success : function(data) {
			 customLoader(false);
			// console.log(data);
			 if (data['status'] == '0' || data['status'] == '2') {
				//showMessage(true, data['message']);
				showMessageTheme2(0, data['message'],'',true);
				if(objRights.leadType=='B2B'){
					$("#b2b-lead-list").html("");
				}else{
					var html=getB2cLeadHeaderList(data, objRights, roleModule);
					$("#b2c-lead-list").html(html);
				}
			} else {
				if(objRights.leadType=='B2B'){
					var html = getB2bLeadList(data, objRights, roleModule);
					$("#b2b-lead-list").html(html);
				}else{
					var html = getB2cLeadList(data, objRights, roleModule);
					$("#b2c-lead-list").html(html);
					$('[data-toggle="tooltip"]').tooltip();
					var leaddata=data.data;
					for(var i=0;i<leaddata.length;i++){
						var leadsd = leaddata[i];
						//if(leadsd.leadNo=='220525018389'){
							getLeadStatusLog(leadsd.leadNo, 'new-lead', objRights.adminStatus);
						//}
					}
					curentTimeStamp(objRights.timeZoneOffset);

					$(".selectcampain").select2({
						theme:"bootstrap4",
						dropdownParent:"#b2c-lead-list"
					});

					$(".leadSearchCampaign").select2({
						theme:"bootstrap4",
						dropdownParent:"#advanceLeadNewSearchForm"
					});
					$(".leadSearchTemplate").select2({
						theme:"bootstrap4",
						dropdownParent:"#advanceLeadNewSearchForm"
					});
					$(".leadSearchDeliveredStatus").select2({
						theme:"bootstrap4",
						dropdownParent:"#advanceLeadNewSearchForm"
					});
					
				}
				

				$(".follow-up-no").click(function(){
					$(this).find(".fa-angle-down").toggleClass('fa-angle-down fa-angle-up');
					$(this).parent().siblings().find(".fa-angle-up").toggleClass('fa-angle-up fa-angle-down');
					$(this).parent().find(".follow-up-content").slideDown();
					$(this).parent().siblings().find(".follow-up-content").slideUp();
					$(this).parent().addClass("follow-up-accordian-active");
					$(this).parent().siblings().removeClass("follow-up-accordian-active");
				});

				var leadCheckednew="";
				var leadCheckednew1="";
				leadCheckednew = $("#leadNoMove").val();
				leadCheckednew1  = String(leadCheckednew).split(',');
				for (let i = 0; i < leadCheckednew1.length; i++) {
					$("#lead-"+leadCheckednew1[i]).prop("checked",true);
				}

				var demoMovedTrue = '';
				var blankDemo = '';
				$("#selectLeadAll").click(function () {
					var leadnew = $("#leadNoMove").val();
					var chkAll = this;
					
					var chkRows = $(".leadDataList").find(".checkLead");
					chkRows.each(function () {
						$(this)[0].checked = chkAll.checked;
					});
					var leadNo='';
					$.each($("input[name='lead-move-another']:checked"), function(){
						if(leadnew.indexOf($(this).val()) != -1){
						}else{
							leadNo = leadNo+','+$(this).val();
							var checkDemoMoved = $("#checkDemoMoved-"+$(this).val()).val();
							var leadUserId = checkDemoMoved.split('-')[0];
							var demoUserId = checkDemoMoved.split('-')[1];
							if(demoUserId != 0 && leadUserId != demoUserId){
								demoMovedTrue += "moved"
							}else{
								if(demoUserId == 0){
									blankDemo += "blank"; 
								}
							}
						}
					});
					
					leadnew = leadnew + leadNo;
					$("#leadNoMove").val(leadnew);
					if($("#selectLeadAll").is(":checked")){}
					else{
						demoMovedTrue = '';
						blankDemo = '';
						$("#leadNoMove").val('');
					}
					$("#demoMovedTrue").val(demoMovedTrue)
					$("#blankDemo").val(blankDemo)
				});

				$(".checkLead").click(function () {
					var leadnew = $("#leadNoMove").val();
					var chkAll = $("#selectLeadAll");
					chkAll.attr("checked", "checked");
					var chkRows = $("#leadDataList").find(".checkLead");
					$("#leadDataList .checkLead").each(function () {
						if (!$(this).is(":checked")) {
							chkAll.prop('checked', false);
							chkAll.removeAttr("checked", "checked");
							if(leadnew.indexOf($(this).val()) != -1){
								leadnew = leadnew.replace(","+$(this).val(), '')
								var checkDemoMoved = $("#checkDemoMoved-"+$(this).val()).val();
								var leadUserId = checkDemoMoved.split('-')[0];
								var demoUserId = checkDemoMoved.split('-')[1];
								if(demoUserId != 0 && leadUserId != demoUserId){
									demoMovedTrue = demoMovedTrue.replace("moved", "");
								}else{
									if(demoUserId == 0){
										blankDemo = blankDemo.replace("blank", "");
									}
								}
							}
							return;
						}
					});
					var leadNo='';
					$.each($("input[name='lead-move-another']:checked"), function(){
						if(leadnew.indexOf($(this).val()) != -1){
						}else{
							var checkDemoMoved = $("#checkDemoMoved-"+$(this).val()).val();
							var leadUserId = checkDemoMoved.split('-')[0];
							var demoUserId = checkDemoMoved.split('-')[1];
							if(demoUserId != 0 && leadUserId != demoUserId && USER_ID != leadUserId){
								demoMovedTrue += "moved"
							}else{
								if(demoUserId == 0){
									blankDemo += "blank"; 
								}
							}
							leadNo = leadNo+','+$(this).val();
						}  
					});
					leadnew = leadnew + leadNo;
					$("#leadNoMove").val(leadnew);
					$("#demoMovedTrue").val(demoMovedTrue)
					$("#blankDemo").val(blankDemo)
				});

				$("#leadsPagging").on('change',function() {
					getLeadDataList('advanceLeadNewSearchForm', 'advance-search', 'list', '0', 'new', true,'', objRights, roleModule);
				});
			}
			 return false;
		 },
		error : function(e) {
			if (checkonlineOfflineStatus()) {
				return;
			}
			//console.log(e);
			customLoader(false);
		}
	 });
}

function getEmailTemplates() {	
	var moveleadNo = $("#leadNoMove").val();
	if(moveleadNo==''){
		showMessageTheme2(0, 'Please check any one lead','',false);
		return false;
	}

	var leads=$("#leadNoMove").val();
	var selected = new Array();
	$('input[name="lead-move-another"]').each(function() {
		selected.push($(this).val());
   	});
	leads=leads.substring(1,leads.length);

	var request={}
	request['userId']=USER_ID;
	request['leadIds']=leads;

	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLFor('leads','get-broadcast-lead-mail-template'),
		data : JSON.stringify(request),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data['statusCode'] == '0' || data['statusCode'] == '2' || data['statusCode'] == 'E001' || data['statusCode'] == 'E002') {
				showMessageTheme2(0, data['message'],'',false);
			} else {
				emailTemplateContent=data;
				$.each(emailTemplateContent.emailTemplate, function(index, obj) {
					if(obj.customParams != null && obj.customParams != ''){
						$.each(obj.customParams, function(i, param) {
							var placeholder = "{{" + param.paramName + "}}";
							var regex = new RegExp("\\*{{" + param.paramName + "}}\\*", "g");
							if (obj.bodyOriginal.includes("*{{"+param.paramName+"}}*")) {
								var regex = new RegExp("\\*{{" + param.paramName + "}}\\*", "g");
							} else {
								var regex = placeholder;
							}
							obj.body = obj.body.replace(regex, param.paramValue);
							obj.bodyOriginal = obj.bodyOriginal.replace(regex, "<b>"+param.paramValue+"</b>");
						});
					}
				});
				
				var allEmailTemplatesListPopup = $("#allEmailTemplatesList");
				allEmailTemplatesListPopup.html('');
				$("#allEmailTemplatesList").html(customEmailTemplatesList(data.responseBody));
				var isDataTable = $.fn.dataTable.isDataTable("#emailBroadcastTable");
				if(isDataTable){
					$("#emailBroadcastTable").dataTable().fnDestroy();
				}
				$("#emailBroadcastTable").DataTable({
					theme:"bootstrap4",
				});
				$('#customEmailTemplatesList').modal('show');
				
				var userListPopup = $("#userPopDataEmail");
				userListPopup.html(emailBroadcastSendModal(data));

				$("#emailBroadcastSendModal").modal("hide");
				return false;
			}
			return false;
		},
		error : function(e) {
			return false;
		}
	});
}

function viewEmailTemplate(flag, indexNumber, templateName){
	if(flag){
		$("#table_row_"+ templateName).addClass('selected_row').siblings().removeClass('selected_row');
		$(".email-wrapper").addClass("active-email-template");
		$(".email-template").removeClass("hide-email-template");
		$(".email-template").addClass("show-email-template");
		$("#previewEmailTemplate").html('');
		$("#previewEmailTemplateSecond").html('');
		$("#previewEmailTemplateThird").html('');
		setTimeout(function(){
			$("#previewEmailTemplate").html(getViewTemplateEmail(emailTemplateContent.responseBody.templates[indexNumber]));
			$("#previewEmailTemplateSecond").html(getViewTemplateEmail(emailTemplateContent.responseBody.templates[indexNumber]));
			$("#previewEmailTemplateThird").html(getViewTemplateEmail(emailTemplateContent.responseBody.templates[indexNumber]));
		},200)
	}else{
		$(".email-wrapper").removeClass("active-email-template");
		$(".email-template").addClass("hide-email-template");
		$(".email-template").removeClass("show-email-template");
		$("#emailBroadcastLogsModal .modal-dialog").css('margin-left', '');
		$("#emailBroadcastLogsModal .modal-dialog").animate({
			margin: '24px auto'
		}, 300);
	}
}

function gotoBackEmailModal(){
	// if (emailStatusInterval) {
	// 	clearInterval(emailStatusInterval);
	// 	emailStatusInterval = null;
	// }
	$('#allCheckedEmail').prop('checked',false);
	$('input[name="chk-users-lead-email"]').prop('checked',false);
	$('#allCheckedFailedEmail').prop('checked',false);
	$('input[name="chk-users-lead-email-resend"]').prop('checked',false);
	$("#emailBroadcastSendModal").modal("hide");
	$("#customEmailTemplatesList").modal("show");
	viewEmailTemplate(false);
}

function sendEmailNotification(templateName, subject, index, templateId){
	templateName = atob(templateName)
	subject = atob(subject);
	var request={};
	$("#table_row_"+ templateName).addClass('selected_row').siblings().removeClass('selected_row');
	$('#templateNameEmail').html('<b>' + templateName + '</b> ');
	boolval =true;
	$('#viewMethodCallingEmail').html('<a href="javascript:void(0)" class="btn btn-primary btn-sm rounded-circle" onclick="viewEmailTemplate('+boolval+','+index+', `'+templateName+'`);" > <i class="fa fa-eye text-white"></i> </a>');
	$('#confirm_btn_data_email').html('<a id="confirm_btn_email" class="btn btn-primary mr-2" href="javascript:void(0);" >SEND</a>');
	$('#selectionCountEmail').html('<span>Selected- </span><span id="selectedCountEmail">0</span> / <span id="totalCountEmail">0</span>');
	$("#emailBroadcastSendModal").modal("show");
	$("#customEmailTemplatesList").modal("hide");

	var totalCheckboxes = $(".checkToSendEmail").length;
    $("#totalCountEmail").text(totalCheckboxes);
	
	$("#confirm_btn_email").click(function () {
		var sleads ='';
		var leadNo='';
		var selectedEmails = [];
		$.each($("input[name='chk-users-lead-email']:checked"), function(){
			let leadId = $(this).val();
			let email = $(this).data("email");
			leadNo = leadNo+','+$(this).val();
			if (email) selectedEmails.push(email);
		});
		
		sleads = sleads + leadNo;
		var selectedLeads = sleads.substring(1,sleads.length); 
		if(selectedLeads==''){ 
			$('#remarksresetDelete2').modal('hide');
			showMessageTheme2(0, 'Please check any one user to send message','',false);
			return false;
		}else{
			const selectedUsers = emailTemplateContent.users.filter(user => selectedEmails.includes(user.email));
			$("input[name='chk-users-lead-email']:checked").each(function () {
				let email = $(this).data("email");
				let leadId = $(this).val();
				let name = $(this).data("name") || '';
				let grade = $(this).data("grade") || '';
				let leadVerifiedStatus = $(this).data("leadverifiedstatus") || '';
				let mobileNo = $(this).data("mobile") || '';
				let phoneNumber = $(this).data("phone") || '';
				let isdCode = $(this).data("isdcode") || '';

				if (email && !emailTemplateContent.users.find(u => u.email === email)) {
					selectedUsers.push({
						email: email,
						leadId: leadId,
						name: name,
						grade: grade,
						leadVerifiedStatus: leadVerifiedStatus,
						mobileNo: mobileNo,
						phoneNumber: phoneNumber,
						isdCode: isdCode,
					});
				}
			});
			emailTemplateContent.users = selectedUsers;
			if($("#sendConfirmationModal").length >= 1){
				$("#sendConfirmationModal").remove();
			}
			$("body").append(sendConfirmationModal(`sendEmailNotificationToUser(${index}, '${btoa(templateName)}', '${btoa(subject)}', '${selectedLeads}', 'send', '${templateId}')`));
			$("#sendConfirmationModal").modal("show");
			// showWarningMessageShow('Are you sure you want to send this data?','sendEmailNotificationToUser( '+index+',\''+templateName+'\',\''+btoa(subject)+'\',\''+selectedLeads+'\',\'send\',\''+templateId+'\')', 'info-modal-sm');
		}
	});

	$(".checkToSendEmail").click(function(){
		updateSelectionCountEmail();
		var arrChkBox = [];
		if($(".checkToSendEmail:checked").length>0){
			if($(".checkToSendEmail:checked").length == $(".checkToSendEmail").length){
				$("#allCheckedEmail").prop("checked",true);
			}else{
				$("#allCheckedEmail").prop("checked",false);
			}
		}else{
			$("#allCheckedEmail").prop("checked",false);
		}
	});
	$("#allCheckedEmail").click(function(){
		if($(this).prop("checked")){
			$(".checkToSendEmail").prop("checked",true);
		}else{
			$(".checkToSendEmail").prop("checked",false);
		}
		updateSelectionCountEmail();
	});

	function updateSelectionCountEmail(){
        var selectedCount = $(".checkToSendEmail:checked").length;
        $("#selectedCountEmail").text(selectedCount);
    }
}

function sendEmailNotificationToUser(indexNo,templateName, subject, leadID, d_status,templateId) {	
	templateName = atob(templateName)
	subject = atob(subject)
	$("#resetDeleteErrorWarningNo1").click(function(){
		$("#remarksresetDelete2").hide();
	});
	$("#resetDeleteErrorWarningYes1").click(function(){
		$("input#allCheckedEmail").prop('checked', false);
		$("input#allCheckedFailedEmail").prop('checked', false);
		$("input#selectLeadAll").prop('checked', false); 
		$('input[name="chk-users-lead-email"]').prop('checked', false);
		$('input[name="lead-move-another"]').prop('checked', false);
	});
	$("#resetDeleteErrorWarningYes2").click(function(){
		$("input#allCheckedEmail").prop('checked', false);
		$("input#allCheckedFailedEmail").prop('checked', false);
		$("input#selectLeadAll").prop('checked', false); 
		$('input[name="chk-users-lead-email"]').prop('checked', false);
		$('input[name="lead-move-another"]').prop('checked', false);
	});
	$("#customEmailTemplatesList").click(function(){
		$("#selectLeadAll").prop("checked", false);
	});

	$('#templateNameEmail').html('<b>' + templateName + '</b> '); 
	var selectedLeadIds = leadID.split(',');
	var filteredEmailContent = JSON.parse(JSON.stringify(emailTemplateContent));
	filteredEmailContent.users = filteredEmailContent.users.filter(function(user) {
		return selectedLeadIds.includes(user.leadId);
	});

	var request={}
	request['userId']=USER_ID;
	request['templateId']=templateId;
	request['sendBestTime']= $("input[name='mailBroadcastTime']:checked").val() == "now"? false: true;
	request['recipientsUserDetails'] = filteredEmailContent.users.map(user => ({
		email: user.email,
		grade: user.grade,
		fullName: user.name,
		firstName: user.name.split(' ')[0],
		leadId: user.leadId,

	}));
	request['templateSubject']=subject;
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLFor('leads','send-broadcast-lead-mail'),
		data : JSON.stringify(request),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data['statusCode'] == 'EX01' || data['statusCode'] == 'E004' ) {
				showMessageTheme2(0, data['message'],'',false);
				$("input#allCheckedEmail").prop('checked', false);
				$('input[name="chk-users-lead-email"]').prop('checked', false);
				return false;
			} else {
				// if (d_status === 'resend') {
				// 	let selectedEmails = [];
				// 	$(".checkToSendEmailFailed:checked").each(function () {
				// 		let email = $(this).data("email");
				// 		if (email) selectedEmails.push(email);
				// 	});
				
				// 	pendingEmails = emailTemplateContent.users
				// 		.filter(user => selectedEmails.includes(user.email))
				// 		.map(user => user.email);
					
				// 	pendingEmails = [...new Set(pendingEmails)];
				// 	emailTemplateContent.users = emailTemplateContent.users.filter(user => selectedEmails.includes(user.email));
				// } else {
				// 	pendingEmails = emailTemplateContent.users.map(user => user.email);
				// }
				$("#emailBroadcastSendModal").modal("hide");
				$("#customEmailTemplatesList").modal("hide");
				$("#sendConfirmationModal").modal("hide");
				$("input#allCheckedFailedEmail").prop('checked', false);
				$("input#selectLeadAll").prop('checked', false); 
				$('input[name="chk-users-lead-email"]').prop('checked', false);
				$('input[name="lead-move-another"]').prop('checked', false);
				$('#allCheckedFailedEmail').prop('checked', false);
				$('input[name="chk-users-lead-email-resend"]').prop('checked', false);
				$("#successFailedEmailMessagesModal").remove();
				$("body #usrPopDataOnResendEmail").append(`<div id="successFailedEmailMessagesModal" class="modal fade fade-scale" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" data-backdrop="static" aria-hidden="true"></div>`);
				$("#successFailedEmailMessagesModal").html(successFailedEmailMessagesModal(emailTemplateContent));
				successfulEmails = emailTemplateContent.users
				failedOrOtherEmails = [];
				$("#successfulEmailsCount").text(emailTemplateContent.users.length);
				$("#failedEmailsCount").text(0);
				$("#successEmailTableDiv").html(successEmailTableContent());
				$("#failedEmailTableDiv").html(failedEmailTableContent());
				$('#selectionCountOnFailedEmail').html('<span>Selected- </span><span id="selectedCountEmailFailed">0</span> / <span id="totalCountEmailFailed">0</span>');
				var totalCheckboxes = $(".checkToSendEmailFailed").length;
				$("#totalCountEmailFailed").text(totalCheckboxes);

				$(".checkToSendEmailFailed").click(function(){
					updateSelectionCountEmailSF();
					var arrChkBox = [];
					if($(".checkToSendEmailFailed:checked").length>0){
						if($(".checkToSendEmailFailed:checked").length == $(".checkToSendEmailFailed").length){
							$("#allCheckedFailedEmail").prop("checked",true);
						}else{
							$("#allCheckedFailedEmail").prop("checked",false);
						}
					}else{
						$("#allCheckedFailedEmail").prop("checked",false);
					}
				});
				$("#allCheckedFailedEmail").click(function(){
					if($(this).prop("checked")){
						$(".checkToSendEmailFailed").prop("checked",true);
					}else{
						$(".checkToSendEmailFailed").prop("checked",false);
					}
					updateSelectionCountEmailSF();
				});
			
				function updateSelectionCountEmailSF(){
					var selectedCountEmailFailed = $(".checkToSendEmailFailed:checked").length;
					$("#selectedCountEmailFailed").text(selectedCountEmailFailed);
				}
				openSuccessFailedEmailMessages(indexNo, templateName, subject, templateId);
				setTimeout(() => {
					$("#successFailedEmailMessagesModal").modal("show");
				}, 1000);
				// emailStatusInterval = setInterval(function() {
				// 	getStatusOfSentEmails(data.actionId);
				// }, 10000);
			}
		},
		error : function(e) {
			return false;
		}
	});
}

function openSuccessFailedEmailMessages(indexSF,templateName, subject, templateId) {
	if($("#successFailedEmailStyle").length < 1){
		$("head").append(`
			<style id="successFailedEmailStyle">
				#successEmailTable, #failedEmailTable {
					border-collapse: collapse;
					border-radius: 10px;
				}
				#successEmailTable td, th , #failedEmailTable td, th {
					border: 1px solid #f7f7f7;
				}
				#successEmailTable tr:nth-child(odd), #failedEmailTable tr:nth-child(odd) {
					background-color: #F7F7F7;
				}
			</style>
		`)
	}
	$("#successEmailTableDiv").slideDown();
	$("#failedEmailTableDiv").slideUp();
	$("#successEmailTable").dataTable();
	var table = $('#failedEmailTable').DataTable();
	if (table) {
        table.destroy();
    }
	var count=table.rows().count()
	$("#failedEmailTable").dataTable({
		lengthMenu: [[count], [count]],
		lengthChange: false,
		paging: false,
		info: false
    });

	$("#successEmailDiv").css("cursor", "pointer");
	$("#failedEmailDiv").css("cursor", "default");

	$("#chevron_failed_email").removeClass("fa-chevron-up").addClass("fa-chevron-down");
	$("#chevron_success_email").removeClass("fa-chevron-down").addClass("fa-chevron-up");

	$("#successEmailDiv").click(function() {
		$("#successEmailTableDiv").slideDown(500);
		$("#failedEmailTableDiv").slideUp(500);
		$("#failedEmailDiv").css("cursor", "pointer");
		$("#successEmailDiv").css("cursor", "default");

		$("#chevron_success_email").removeClass("fa-chevron-down").addClass("fa-chevron-up");
		$("#chevron_failed_email").removeClass("fa-chevron-up").addClass("fa-chevron-down");
	});

	$("#failedEmailDiv").click(function() {
		$("#failedEmailTableDiv").slideDown(500);
		$("#successEmailTableDiv").slideUp(500);
		$("#successEmailDiv").css("cursor", "pointer");
		$("#failedEmailDiv").css("cursor", "default");

		$("#chevron_failed_email").removeClass("fa-chevron-down").addClass("fa-chevron-up");
		$("#chevron_success_email").removeClass("fa-chevron-up").addClass("fa-chevron-down");
	});

	$('#resendEmailMessagesData').html('<a id="resend_btn_email" class="btn btn-primary px-3 py-2 mr-2 mt-3 float-right" href="javascript:void(0);">Resend</a>');
	$('#selectionCountOnFailedEmail').html('<span>Selected- </span><span id="selectedCountEmailFailed">0</span> / <span id="totalCountEmailFailed">0</span>');
	$('#templateNameEmailSF').html();
	$('#templateNameEmailSF').html('<b>' + templateName + '</b> ');
	boolvalSF =true;
	$('#viewMethodCallingEmailSF').html();
    $('#viewMethodCallingEmailSF').html('<a href="javascript:void(0)" class="btn btn-primary btn-sm rounded-circle" onclick="viewEmailTemplate('+boolvalSF+','+indexSF+', `'+templateName+'`);" > <i class="fa fa-eye text-white"></i> </a>');
	$("#resend_btn_email").click(function () {
		var sleads ='';
		var leadNo='';
		$.each($("input[name='chk-users-lead-email-resend']:checked"), function(){
			leadNo = leadNo+','+$(this).val();
		});
		
		sleads = sleads + leadNo;
		var selectedLeads = sleads.substring(1,sleads.length); 
		if(selectedLeads==''){
			$('#remarksresetDelete2').modal('hide');
			showMessageTheme2(0, 'Please check any one user to send message','',false);
			return false;
		}else{
			// showWarningMessageShow('Are you sure you want to resend the message?','sendEmailNotificationToUser( '+indexSF+',\''+templateName+'\',\''+subject+'\',\''+selectedLeads+'\',\'resend\',\''+templateId+'\')', 'info-modal-sm');
		}
	});

	var totalCheckboxes = $(".checkToSendEmailFailed").length;
    $("#totalCountEmailFailed").text(totalCheckboxes);

	$(".checkToSendEmailFailed").click(function(){
		updateSelectionCountEmailSF();
		var arrChkBox = [];
		if($(".checkToSendEmailFailed:checked").length>0){
			if($(".checkToSendEmailFailed:checked").length == $(".checkToSendEmailFailed").length){
				$("#allCheckedFailedEmail").prop("checked",true);
			}else{
				$("#allCheckedFailedEmail").prop("checked",false);
			}
		}else{
			$("#allCheckedFailedEmail").prop("checked",false);
		}
	});
	$("#allCheckedFailedEmail").click(function(){
		if($(this).prop("checked")){
			$(".checkToSendEmailFailed").prop("checked",true);
		}else{
			$(".checkToSendEmailFailed").prop("checked",false);
		}
		updateSelectionCountEmailSF();
	});

	function updateSelectionCountEmailSF(){
        var selectedCountEmailFailed = $(".checkToSendEmailFailed:checked").length;
        $("#selectedCountEmailFailed").text(selectedCountEmailFailed);
    }
}

function updateEmailLogsLink(leadId){ 
	$("#email_logs_link_"+leadId).show();
}

function getViewTemplateEmail(data){
	const iframeId = "templatePreviewFrame_" + Date.now();
	var html=
		`<div class="main-card card mx-auto" style="height: 400px;">
			<iframe id="${iframeId}" style="width:100%; height:100%; border:none;"></iframe>
		</div>`

		setTimeout(() => {
			const iframe = document.getElementById(iframeId);
			if (iframe && iframe.contentWindow) {
				const doc = iframe.contentWindow.document;
				doc.open();
				doc.write(data.htmlContent);
				doc.close();
			}
		}, 0);
    return html;
}

function getStatusOfSentEmails(actionId) {
	if (pendingEmails.length === 0) return;
	var body = {
		emails: pendingEmails.join(','),
		actionId: actionId
	}
	$.ajax({
		type: "POST",
		contentType : "application/json",
		url: getURLFor('leads', 'get-broadcast-lead-mail-status'),
		data: JSON.stringify(body),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		  success: function (response) {
			successfulEmails = [];
			failedOrOtherEmails = [];
			if (Array.isArray(response.emailAndStatus)) {
				const responseEmails = response.emailAndStatus.map(item => item.email);

				pendingEmails = pendingEmails.filter(email => !responseEmails.includes(email));

				response.emailAndStatus.forEach(item => {
					const user = emailTemplateContent.users.find(u => u.email === item.email);
					if (user) {
						if (item.status.toLowerCase() === "success") {
							successfulEmails.push(user);
						} else {
							failedOrOtherEmails.push(user);
						}
					}
				});

				if (pendingEmails.length === 0) {
					clearInterval(emailStatusInterval);
					emailStatusInterval = null;
					$("#successfulEmailsCount").text(emailTemplateContent.users.length);
					// $("#failedEmailsCount").text(failedOrOtherEmails.length);
					$("#failedEmailsCount").text(0);
					$("#successEmailTableDiv").html(successEmailTableContent());
					$("#failedEmailTableDiv").html(failedEmailTableContent());
					$('#selectionCountOnFailedEmail').html('<span>Selected- </span><span id="selectedCountEmailFailed">0</span> / <span id="totalCountEmailFailed">0</span>');
					var totalCheckboxes = $(".checkToSendEmailFailed").length;
    				$("#totalCountEmailFailed").text(totalCheckboxes);

					$(".checkToSendEmailFailed").click(function(){
						updateSelectionCountEmailSF();
						var arrChkBox = [];
						if($(".checkToSendEmailFailed:checked").length>0){
							if($(".checkToSendEmailFailed:checked").length == $(".checkToSendEmailFailed").length){
								$("#allCheckedFailedEmail").prop("checked",true);
							}else{
								$("#allCheckedFailedEmail").prop("checked",false);
							}
						}else{
							$("#allCheckedFailedEmail").prop("checked",false);
						}
					});
					$("#allCheckedFailedEmail").click(function(){
						if($(this).prop("checked")){
							$(".checkToSendEmailFailed").prop("checked",true);
						}else{
							$(".checkToSendEmailFailed").prop("checked",false);
						}
						updateSelectionCountEmailSF();
					});
				
					function updateSelectionCountEmailSF(){
						var selectedCountEmailFailed = $(".checkToSendEmailFailed:checked").length;
						$("#selectedCountEmailFailed").text(selectedCountEmailFailed);
					}

					$("#preSuccessFailedDiv").css("display", "none");
					$("#finalSuccessFailedDiv").css("display", "flex");
				}
			}
		}
	});
}

function getEmailBroadcastLogs(email, name, leadId){
	var body = {
		email: email,
		schoolId: SCHOOL_ID,
		leadId :leadId,
	}
	$.ajax({
		type: "POST",
		contentType : "application/json",
		url: getURLFor('leads', 'get-broadcast-lead-mail-log'),
		data: JSON.stringify(body),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success: function (response) {
			if(response.statusCode == 0 || response.statusCode == 2){
				showMessageTheme2(0, response.message);
			}else if(response.logArray == "Data not found"){
				showMessageTheme2(0, response.logArray)
			}else{
				if($("#emailBroadcastLogsModal").length == 1){
					$("#emailBroadcastLogsModal").remove();
				}
				$("body").append(emailBroadcastLogsModal(response.logArray, name, email));
				$("#emailBroadcastLogsModal").modal("show");
			}
		}
	});
}

function getEmailBroadcastLogsTemplate2(actionId,userEmail){
	var body = {
		actionId: actionId,
		email: userEmail,
		schoolId: SCHOOL_ID
	}
	$.ajax({
		type: "POST",
		contentType : "application/json",
		url: getURLFor('leads', 'get-broadcast-mail-statistics'),
		data: JSON.stringify(body),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success: function (response) {
			if(response.status == 0){
				showMessageTheme2(0, response.message);
			}else{
				$("#emailBroadcastLogsTemplatePreview2").html(getViewTemplateEmail(response.logObject.body))
				$("#emailBroadcastLogsTemplate2").modal("show");
				$("#emailBroadcastLogsModal .modal-dialog").animate({
					'margin-left': '15%'
				}, 300);
				$(".email-wrapper").addClass("active-email-template");
				$(".email-template").addClass("show-email-template");
				$(".email-template").removeClass("hide-email-template");
			}
		}
	});
}

function getEmailBroadcastLogsTemplate(actionId,userEmail){
	var body = {
		actionId: actionId,
		email: userEmail,
		schoolId: SCHOOL_ID
	}
	$.ajax({
		type: "POST",
		contentType : "application/json",
		url: getURLFor('leads', 'get-broadcast-mail-statistics'),
		data: JSON.stringify(body),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success: function (response) {
			if(response.status == 0){
				showMessageTheme2(0, response.message);
			}else{
				$("#emailBroadcastLogsTemplateWrapper").html(emailBroadcastLogsTemplateContent())
				$("#emailBroadcastLogsTemplatePreview").html(getViewTemplateEmail(response.logObject.body))
				viewEmailTemplate(true);
				$("#emailBroadcastLogsModal .modal-dialog").animate({
					'margin-left': '15%'
				}, 300);
			}
		}
	});
}
