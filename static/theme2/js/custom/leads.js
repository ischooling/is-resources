
var watiTemplateContent;
var emailTemplateContent;
// var emailStatusInterval = null;
// var pendingEmails = [];
var successfulEmails = [];
var failedOrOtherEmails = [];
var editor;
$(function () {
	// $('[data-toggle="tooltip"]').tooltip()
});

function validateRequestForLeadSave(formId, newTheme, leadFrom, leadType){
 hideMessage('');
 var flag=true;
 if(leadFrom=='leadlist'){
	 if ($("#"+formId+" #leadUpdateSource").val()==null || $("#"+formId+" #leadUpdateSource").val()=='0') {
		showMessageTheme2(0, "Please select Lead Source",'',true);
		 return false;
	 }
 }else if(leadFrom=='leadlistPopup' || leadFrom=='new-leadlistPopup'){
	if($("#"+formId+" #countrolType").val()!='edit'){

		if ($("#"+formId+" #leadSource").val()==null || $("#"+formId+" #leadSource").val()=='0' || $("#"+formId+" #leadSource").val()=='') {
			showMessageTheme2(0, "Please select Lead Source",'',true);
			return false;
		}
		if(leadType!='B2B'){
			if ($("#"+formId+" #leadGrade").val()==null || $("#"+formId+" #leadGrade").val()=='') {
				showMessageTheme2(0, 'Please choose grade','',true);
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
			showMessageTheme2(0, "Please choose ISD Code",'',true);
			return false;
		}
	 }


	if (leadType!='B2B' && ($("#"+formId+" #leadGuardfname").val()==null || $("#"+formId+" #leadGuardfname").val()=='')) {
		 showMessageTheme2(0, "Please enter Parent First Name",'',true);
		 return false;
	}

	if($("#"+formId+" #countrolType").val()!='edit'){
		if ($("#"+formId+" #leadStatus").val()==null || $("#"+formId+" #leadStatus").val()=='') {
			showMessageTheme2(0, 'Please choose Lead Status','',true);
			return false;
		}
		if ($("#"+formId+" #leadAssignTo").val()==null || $("#"+formId+" #leadAssignTo").val()==0) {
			showMessageTheme2(0, 'Please select Lead Assigned To','',true);
			return false;
		}
	}
	if(leadType!='B2B'){
		if ($("#"+formId+" #leadPriority").val()==null || $("#"+formId+" #leadPriority").val()=='') {
			showMessageTheme2(0, "Please Select Lead Priority",'',true);
			return false;
		}
	}
	 
 }else if(leadFrom=='dashboard'){
	 if ($("#"+formId+" #leadSource").val()==null || $("#"+formId+" #leadSource").val()=='0') {
		 showMessageTheme2(0, "Please select Lead Source",'',true);
		 return false;
	 }
	 if ($("#"+formId+" #phoneNo").val()==null || $("#"+formId+" #phoneNo").val()=='') {
		showMessageTheme2(0, "Please enter phone no",'',true);
		 return false;
	 }
	 if ($("#"+formId+" #leadAssignTo").val()==null || $("#"+formId+" #leadAssignTo").val()==0) {
		 showMessageTheme2(0, 'Please select Lead Assigned To','',true);
		 return false;
	 }
 }else{
 	if(formId!='leadMergeDataPopupForm' && formId!='leadMergeDataPopupB2BForm'){
		 if ($("#"+formId+" #leadSource").val()==null || $("#"+formId+" #leadSource").val()=='0') {
			showMessageTheme2(0, "Please select Lead Source",'',true);
			return false;
		 }
		
	
		if ($("#"+formId+" #leademailId").val()==null || $("#"+formId+" #leademailId").val()=='') {

			if ($("#"+formId+" #phoneNo").val()==null || $("#"+formId+" #phoneNo").val()=='') {
				showMessageTheme2(0, "Please enter email or phone no",'',true);
				return false;
			}
			showMessageTheme2(0, "Please enter email",'',true);
			return false;
		}
		if ($("#"+formId+" #leademailId").val()!=null && $("#"+formId+" #leademailId").val()!='') {
			if (!validateEmail($("#"+formId+" #leademailId").val())) {
				showMessageTheme2(0, "Email is either empty or invalid",'',true);
				return false
			}
		}
	
		if ($("#"+formId+" #phoneNo").val()==null || $("#"+formId+" #phoneNo").val()=='') {
			if ($("#"+formId+" #phoneNo").val()==null || $("#"+formId+" #phoneNo").val()=='') {
				showMessageTheme2(0, "Please enter email or phone no",'',true);
				return false;
			}
			showMessageTheme2(0, "Please enter phone no",'',true);
			return false;
		}
		if($("#"+formId+" #phoneNo").val()!='' && $("#"+formId+" #phoneNo").val()!=null){
			if ($("#"+formId+" #isdCode").val()==null || $("#"+formId+" #isdCode").val()=='0') {
				showMessageTheme2(0, "Please choose ISD Code",'',true);
				return false;
			}
		}
	 
		if ($("#"+formId+" #leadGuardfname").val()==null || $("#"+formId+" #leadGuardfname").val()=='') {
			showMessageTheme2(0, "Please enter Parent First Name",'',true);
			return false;
		}
	
		if ($("#"+formId+" #leadStatus").val()==null || $("#"+formId+" #leadStatus").val()=='') {
			showMessageTheme2(0, 'Please choose Lead Status','',true);
			return false;
		}
		if ($("#"+formId+" #leadAssignTo").val()==null || $("#"+formId+" #leadAssignTo").val()==0) {
			showMessageTheme2(0, 'Please select Lead Assigned To','',true);
			return false;
		}
		if ($("#"+formId+" #leadRemark").val()==null || $("#"+formId+" #leadRemark").val()=='') {
			showMessageTheme2(0, 'Please fill Lead Remarks','',true);
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
 hideMessageTheme2('');
 if(!validateRequestForLeadSave(formId, newTheme, leadFrom, leadType)){
	 return false;
 }
 $.ajax({
	 type : "POST",
	 contentType : APPLICATION_JSON_VALUE,
	 url : getURLFor('leads','save-leads-form-data'),
	 data : JSON.stringify(getRequestForLeadSave(formId, leadFrom, leadType)),
	 dataType : 'json',
	 cache : false,
	 timeout : 600000,
	 success : function(data) {
		 if (data['status'] == '0' || data['status'] == 'FAILED' || data['status'] == 'EXCEPTION' || data['status'] == 'SESSIONOUT' ) {
			showMessageTheme2(0, data['message'],'',true);
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
						 var urlSend = '/dashboard/lead-data-list?moduleId='+moduleId+'&leadId=0&leadFrom=LEAD&clickFrom=list&startDate=&endDate=&country=0&campaign=&currentPage=0&euid='+ENCRYPTED_USER_ID+'&leadType='+leadType
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
			 $("#"+formId+" #leadPriority").val(0).trigger('change');
			 $("#leadNoMove").val('');
			 $("#leadDataList .checkLead").prop('checked', false);
		 }
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
	leadStudentDetailDTO['age'] = $("#"+formId+" #leadAge").val();
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
	leadStudentDetailDTO['relationType'] = $("#"+formId+" #relationType").val();
	
	leadModifyDTO['leadAddName'] = $("#"+formId+" #leadAdder").val();
	leadModifyDTO['controlType'] = $("#"+formId+" #countrolType").val();
	leadModifyDTO['assignTo'] = $("#"+formId+" #leadAssignTo").val();
	//leadModifyDTO['leadStatus'] = $("#"+formId+" #leadStatus").val();
	leadCallFollowupDTO['leadFollowStatus'] = $("#"+formId+" #leadStatus").val();
	leadModifyDTO['leadStatus'] =$("#"+formId+" #leadStatus").val();
	leadModifyDTO['parentleadId'] = $("#"+formId+" #parentleadId").val();
	leadModifyDetailDTO['remarks'] = escapeCharacters($("#leadRemark").val());
	leadCallFollowupDTO['leadTagging'] = $("#"+formId+" #leadTagging").val();
	leadModifyDetailDTO['priority'] = $("#"+formId+" #leadPriority").val();
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
	leadStudentDetailDTO['age'] = $("#"+formId+" #leadAge").val();
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
	leadStudentDetailDTO['relationType'] = $("#"+formId+" #relationType").val();

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

	// if(leadType=='B2B'){
	// 	var leadStaus = $("#"+formId+" #leadStatus").val();
	// 	var epdetailStatus = $("#"+formId+" #epdetailStatus").val();
	// 	if(leadStaus=='Converted & On Boarding | Hot'){
	// 		if(epdetailStatus!='Y'){
	// 			showMessageTheme2(0, 'Please update the Enrollment Partner Form before creating the partner dashboard.','',true);
	// 			return false;
	// 		}
	// 	}
 	// }
	 
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
function submitLeadFollowupSave(formId,roleModuleId, leadFrom, newTheme, modalId, objRights, roleAndModule, followupWithoutMail) {
 $('.errorLeadCls').css( "display", "none" );
 $('.errorLeadCls').removeClass('success');
 $('#errorMessageLead').html('');
 var leadType=$("#"+formId+" #leadType").val();
 hideMessageTheme2('');
 //hideMessage('');
 if(!validateRequestForLeadFollowupSave(formId, newTheme, leadType)){
	 return false;
 }
	let isRemarkMandatory = $("#" + formId + " #followupRemarks").attr("isRemarkMendatory") === "true";

	if (isRemarkMandatory) {
		let minRemarkCount = parseInt($("#" + formId + " #followupRemarks").attr("minlength"), 0) || 0;
		let remarkValue = $("#" + formId + " #followupRemarks").val().trim();
		if(remarkValue.length == 0){
			showMessageTheme2(0, 'Please enter remark.','',true);
			return false;
		}
		if (remarkValue.length < minRemarkCount) {
			showMessageTheme2(0, 'Remarks must be at least ' + minRemarkCount + ' characters.', '', true);
			return false;
		} else {
			let counterId = "#" + formId + " #followupRemarksCounter";
			$(counterId).removeClass().addClass("text-muted");
			$(counterId).html(remarkValue.length + ' / ' + minRemarkCount);
		}
	}
	
 $.ajax({
	 type : "POST",
	 contentType : APPLICATION_JSON_VALUE,
	 url : getURLFor('leads','save-leads-followup'),
	 data : JSON.stringify(getRequestForLeadFollowupSave(formId, followupWithoutMail)),
	 dataType : 'json',
	 cache : false,
	 timeout : 600000,
	 success : function(data) {
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
			 $("#followupRemarksCounter").hide()
			 //getPendingNotCall();
			 setTimeout(function(){ 
				 $("#followupform").modal('hide');
			 }, 300);
			 
		 }
		 return false;
	 }
 });
}
function getRequestForLeadFollowupSave(formId, followupWithoutMail){
	var leadAddFormRequestDTO = {};
	var authentication = {};
	var leadCommonDTO = {};
	var leadModifyDTO={};
	var leadModifyDetailDTO={};
	var leadCallFollowupDTO={};
	var leadDemoInfo={};
	if(followupWithoutMail == 'Y'){
		leadCallFollowupDTO['followupWithoutMail'] = 'Y'
	}else{
		leadCallFollowupDTO['followupWithoutMail'] = 'N'
	}
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
		|| $("#"+formId+" #leadStatus").val()=='Not Answering' || $("#"+formId+" #leadStatus").val()=='Not reachable' 
		|| $("#"+formId+" #leadStatus").val()=='Switch off' 
	 ){
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
	if($("#"+formId+" #leadStatus").val()=='Assigned Working' ){
		leadCallFollowupDTO['callBadge'] ='gray';
	}
	if($("#"+formId+" #leadStatus").val()=='Basic Details not Filled | Cold'){
		leadCallFollowupDTO['callBadge'] ='darkgreen';
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
 hideMessage('');
 $.ajax({
	 type : "POST",
	 contentType : APPLICATION_JSON_VALUE,
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
	 contentType : APPLICATION_JSON_VALUE,
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
	 }
 });
}

function discardRawDemoData(leadsource, leadRawId, roleModuleId, userId) {
 hideMessage('');
 $.ajax({
	 type : "POST",
	 contentType : APPLICATION_JSON_VALUE,
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
	 contentType : APPLICATION_JSON_VALUE,
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
	 contentType : APPLICATION_JSON_VALUE,
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
	 contentType : APPLICATION_JSON_VALUE,
	 url : getURLFor('leads','send-lead-notcall-cron'),
	 dataType : 'json',
	 cache : false,
	 timeout : 600000,
	 async:false,
	 success : function(data) {
		 if(data!=""){
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
	 contentType : APPLICATION_JSON_VALUE,
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
					 showMessageTheme2(1, data['message'],'',false);
					 $('#leadAdvanceSearch').modal('show');
				 }
			 } else {
				 //$('#'+formId)[0].reset();
				  $('#leadAdvanceSearch').modal('hide');
				  $('#leadSourceList').html(htmlContent);
				
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
 leadModifyDTO['clickBy'] = callbadge;
 var strText = escapeCharacters($("#"+formId+" #leadFullSearch").val());
 //strText = strText.replace(' ', '');
 if(strText!=undefined){
	 strText = strText.replace('+', '');  
 }else{
	strText='';
 }
 leadModifyDTO['leadFullSearch'] = strText;  
 if(strText!='' && strText!='0'){
	leadFrom="advance-search";
 }
 
 leadModifyDTO['showAllLeadsData'] = $("#"+formId+" #restrictedDataShow").val()!=undefined?$("#"+formId+" #restrictedDataShow").val():''; //'restricted';
 leadModifyDTO['leadNo'] = $("#"+formId+" #leadNoSearch").val()!=undefined?$("#"+formId+" #leadNoSearch").val():'';
 if(leadType==''){
	leadType=$("#"+formId+" #leadType").val()
 }
 leadModifyDTO['directEntryStatus']=$("#"+formId+" #advancedformclick").val();
 leadModifyDTO['leadType']=leadType;
 //leadModifyDTO['leadSource'] = $("#"+formId+" #leadSourceSearch").val();
 leadModifyDTO['leadSources'] = $("#"+formId+" #leadSourceSearch").val()!=undefined?$("#"+formId+" #leadSourceSearch").val():'';
//  var leadOtheer=$("#"+formId+" #leadSourceSearch").val()!=undefined?$("#"+formId+" #leadSourceSearch option:selected").text():'';
//  leadOtheer=(leadOtheer=='Select Source'?'':leadOtheer);
//  leadModifyDTO['leadOtherList'] =leadOtheer;
 //leadModifyDTO['assignTo'] = $("#"+formId+" #leadAssignToSearch option:selected").val();
 leadModifyDTO['assignTos'] = $("#"+formId+" #leadAssignToSearch").val()!=undefined?$("#"+formId+" #leadAssignToSearch").val():'';
 //leadModifyDTO['leadStatus'] = $("#"+formId+" #leadStatusSearch").val();
 leadModifyDTO['leadStatuses'] = $("#"+formId+" #leadStatusSearch").val();
 leadModifyDTO['leadCallback'] = $("#"+formId+" #leadCallback").val();
 leadModifyDTO['leadAdderId'] = $("#"+formId+" #leadCreatedBy").val();
 leadModifyDTO['leadSupportTo'] = $("#"+formId+" #leadSupportTo option:selected").val()!=undefined?$("#"+formId+" #leadSupportTo option:selected").val():'';
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

 leadStudentDetailDTO['stdFname'] = $("#"+formId+" #leadstdfnameSearch").val();
 leadStudentDetailDTO['gurdianFname'] = $("#"+formId+" #leadParentfnameSearch").val();
 leadStudentDetailDTO['country'] = $("#"+formId+" #countryId option:selected").val();
 leadStudentDetailDTO['countryList'] = $("#"+formId+" #countryIds").val()!=undefined?$("#"+formId+" #countryIds").val():'';
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

 let selectedValues = $("#"+formId+" #leadTagSearch option:selected").map(function() {
  return $(this).attr('data-shorttag');
}).get();
 leadCallFollowupDTO['leadTaggingRemark'] = selectedValues 
 //$("#"+formId+" #leadTagSearch option:selected").attr('data-shorttag');

 //  if($("#"+formId+" #leadStatusSearch").val()=='SCHOLARSHIP'){
	 // 	 leadCommonDTO['sbsbStatus']="Y";
	 //  }else if($("#"+formId+" #leadStatusSearch").val()=='Unassigned'){
		 // 	 //leadFrom = "RAW";
		 //  }else{
			 // 	 leadCommonDTO['sbsbStatus']="N";
			 //  }
leadModifyDetailDTO['acadmicYear'] = $("#"+formId+" #leadAcadmicYear").val()!=undefined?$("#"+formId+" #leadAcadmicYear").val():'';
leadModifyDetailDTO['priority'] = $("#"+formId+" #leadPriority").val()!=undefined?$("#"+formId+" #leadPriority").val():'';
leadModifyDetailDTO['utmSource'] = $("#"+formId+" #utmSourceSearch").val()!=undefined?$("#"+formId+" #utmSourceSearch").val():'';
//leadModifyDetailDTO['utmCampaign'] = $("#"+formId+" #leadSearchCampaign").val();
if($("#"+formId+" #campaignName").val()!=undefined && $("#campaignName").val()!=''){
	leadModifyDetailDTO['utmCampaigns'] = [$("#"+formId+" #campaignName").val()];
}else{
	leadModifyDetailDTO['utmCampaigns'] = $("#"+formId+" #leadSearchCampaign").val()!=undefined?$("#"+formId+" #leadSearchCampaign").val():[];
}
leadModifyDetailDTO['utmDescriptions'] = $("#"+formId+" #leadSearchAdSet").val()!=undefined?$("#"+formId+" #leadSearchAdSet").val():[];
leadModifyDetailDTO['leadTemplate'] = $("#"+formId+" #leadSearchTemplate").val()!=undefined?$("#"+formId+" #leadSearchTemplate").val():[];
leadModifyDetailDTO['deliveredStatus'] = $("#"+formId+" #leadSearchDeliveredStatus").val()!=undefined?$("#"+formId+" #leadSearchDeliveredStatus").val():'';

leadDemoInfo['demoAssignTo'] = $("#"+formId+" #leadDemoAssignSearch option:selected").val()!=undefined?$("#"+formId+" #leadDemoAssignSearch option:selected").val():'';
leadDemoInfo['demoBookedType'] = $("#"+formId+" #leadDemoBookType option:selected").val()!=undefined?$("#"+formId+" #leadDemoBookType option:selected").val():'';
leadDemoInfo['callAgent'] = $("#"+formId+" #leadCallByAgent option:selected").val()!=undefined?$("#"+formId+" #leadCallByAgent option:selected").val():'';

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
leadModifyDTO['totalFollowupPendingCount'] = $("#"+formId+" #leadFollwoupDays").val()!=undefined?$("#"+formId+" #leadFollwoupDays").val():'0';	
 
 if(currentPage==undefined){
	 currentPage=0;
 }
 leadModifyDetailDTO['newTheme'] = typeTheme;
 leadModifyDetailDTO['moduleId'] = moduleId;
 leadModifyDetailDTO['schoolUUID'] = SCHOOL_UUID;
 var zadarmaCallDone="";
 var zselectedValue = $('input[name="checkLeadForZCall"]:checked').val();
 if(zselectedValue!=undefined && zselectedValue!=""){
	zadarmaCallDone=zselectedValue;
 }
 leadModifyDetailDTO['zadarmaCallDone'] = zadarmaCallDone;
 leadModifyDTO['leadFrom']=leadFrom;
 leadModifyDTO['clickFrom']=clickFrom;//$("#"+formId+" #clickFrom").val();
 leadModifyDTO['userId']=USER_ID;
 leadModifyDTO['schoolId']=SCHOOL_ID;
 leadModifyDTO['leadPartnerType']= $("#"+formId+" #leadPartnerTypeSearch").val();
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
 return leadAddFormRequestDTO;
}



function advanceLeadSearchStudentReset(formId, leadType){
	$("#"+formId+" #leadNoSearch").val('').trigger('change');
	$("#"+formId+" #leadSourceSearch").val('').trigger('change');
	$("#"+formId+" #leadStatusSearch").val('').trigger('change');
	$("#"+formId+" #leadFullSearch").val('');
	$("#"+formId+" #leadFollwoupDays").val('');
	$("#"+formId+" #leadDemoBookType").val('');
	$("#"+formId+" #leadCallByAgent").val('');
	
	$('#'+formId+' input[name="checkLeadForZCall"]').prop('checked', false);
 
	if(leadType=='B2B'){
		$("#"+formId+" #leadPartnerTypeSearch").val('');
	}else{
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
	$("#"+formId+" #leadSearchCampaign").val(0).trigger('change');
	$("#"+formId+" #leadSearchAdSet").val('').trigger('change');
	$("#"+formId+" #leadCallback").val("").trigger('change');
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
	 contentType : APPLICATION_JSON_VALUE,
	 url : getURLFor('leads','lead-move'),
	 data : JSON.stringify(getRequestForMoveLeadsData(userId)),
	 dataType : 'json',
	 cache : false,
	 timeout : 600000,
	 success : function(data) {
		 if (data['statusCode'] == '0' || data['statusCode'] == '2') {
			showMessageTheme2(0, data['message'],'',true);
		 } else {
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
			
			 $("#leadDemoSchoolMove").val("1").trigger("change");
			 $("#moveRemarks").val("");
		 }
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
	 contentType:APPLICATION_JSON_VALUE,
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


function saveLeadAssignToCounselor(userId, tblId, callFrom, forUse) {
customLoader(true);
 hideMessageTheme2('');
 $.ajax({
	 type : "POST",
	 contentType : APPLICATION_JSON_VALUE,
	 url : getURLFor('leads','save-assign-lead-tocounselor'),
	 data : JSON.stringify(getRequestForLeadAssignToCounselor(userId, tblId, callFrom, forUse)),
	 dataType : 'json',
	 cache : false,
	 timeout : 600000,
	 success : function(data) {
		 if (data['status'] == '0' || data['status'] == '2') {
			 showMessageTheme2(0, data['message'],'',true);
		 } else {
			showMessageTheme2(1, data['message'],'',true);
			if(forUse=='ORIENT'){
				getOrientaionAssignUser();
			}else if(forUse == 'INITIAL-INTERVIEW'){
				getTeacherInterviewAssign();
			}else{
				getLeadAssignUser(OBJECT_RIGHTS);
			}
			 
		 }
		 customLoader(false);
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
			var countryPriorityRules = $(this).find("td .leadCountryPriorityRules").val();
			if(countryPriorityRules!=undefined && countryPriorityRules!=''){
				leadLastCall['leadCountryPriorityRules'] = countryPriorityRules;
			}
			var campaignPriorityRules = $(this).find("td .leadCampaignPriorityRules").val();
			if(campaignPriorityRules!=undefined && campaignPriorityRules!=''){
				leadLastCall['leadCampaignPriorityRules'] = campaignPriorityRules;
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
	 contentType : APPLICATION_JSON_VALUE,
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
			 getLeadAssignUser(OBJECT_RIGHTS);
			 
		 }
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
	 contentType : APPLICATION_JSON_VALUE,
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
		 contentType : APPLICATION_JSON_VALUE,
		 url : getURLForHTML('dashboard', 'student-enroll-stage'),
		 data : JSON.stringify(getRequestForStudentSignupStage(formId, userId)),
		 dataType : 'json',
		 cache : false,
		 timeout : 600000,
		 success : function(data) {
			 if (data['status'] == '0' || data['status'] == '2') {
				 //showMessageTheme2(false, data['message']);
			 } else {
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
					 tblehtml = tblehtml + " <button class=\" btn btn-primary\">View</button></div></td> ";
					 tblehtml = tblehtml + " </tr> ";
				 }
				 $('#todyEnrollStatusTbody').html(tblehtml);
			 }
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
		 contentType : APPLICATION_JSON_VALUE,
		 url : getURLForHTML('dashboard', 'get-demo-count-report'),
		 data : JSON.stringify(getRequestForDemoCountDetails(formId, userId)),
		 dataType : 'json',
		 cache : false,
		 timeout : 600000,
		 success : function(data) {
			 if (data['status'] == '0' || data['status'] == '2') {
				 //showMessageTheme2(false, data['message']);
			 } else {
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
		 contentType : APPLICATION_JSON_VALUE,
		 url : getURLForHTML('dashboard', 'get-lead-count-report'),
		 data : JSON.stringify(getRequestForLeadCountDetails(formId, userId)),
		 dataType : 'json',
		 cache : false,
		 timeout : 600000,
		 success : function(data) {
			 if (data['status'] == '0' || data['status'] == '2') {
				 //showMessageTheme2(false, data['message']);
			 } else {
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
	if(columnPermission==true){
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
		 contentType : APPLICATION_JSON_VALUE,
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
				 if(controlType=='add'){
					$("#leadFormText").text("Add new lead");
				 }else if(controlType=='addLeadClone'){
					$("#leadFormText").text("Add clone lead");
				 }else if(controlType=='edit'){
					$("#leadFormText").text("Update lead");
				 }
				 callLeadStatusList(''+formId+'',leadType,'leadStatus', false);
				 callLeadSourceList(''+formId+'',leadType,'leadSource', true);
				 
				 getTggingMasterList(''+formId+'', 'leadTagging');
				 getPriorityMasterList(''+formId+'', 'leadPriority');
				 $("#"+formId+" #leadTagging").select2({
					theme:"bootstrap4",
					dropdownParent:"#"+formId
				});

				$("#"+formId+" #leadSupportTo").select2({
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
						$("#"+formId+" #leadAge").val(leadDemo.leadStudentDetailDTO.age);
						
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
							   $('#'+formId+' #pCountryCodeAlter').val(itiAltPhoneNumber.getSelectedCountryData().iso2);
							   $('#'+formId+' #isdCodeAlter').val(itiAltPhoneNumber.getSelectedCountryData().dialCode);
						   });
						   if(leadDemo.leadStudentDetailDTO.isdCountryCodeAlter!=null || leadDemo.leadStudentDetailDTO.isdCountryCodeAlter !=''){
							   itiAltPhoneNumber.setCountry($('#'+formId+' #pCountryCodeAlter').val());
						   }
						   callPCountries(''+formId+'', 0, 'countryId',''+leadDemo.leadStudentDetailDTO.country+'');
						  // $("#"+formId+" #countryId").val(leadDemo.leadStudentDetailDTO.country).trigger('change');
						   
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
					callLeadAssignUserList(''+formId+'',''+leadType+'','leadSupportTo', true, columnPermission, USER_ID, false);
					setTimeout(function() {
						$("#"+formId+" #leadAssignTo").val(data.leadDashboardCommon.leadCommonDTO[0].leadModifyDTO.assignTo).trigger('change');
						$("#"+formId+" #leadStatus").val(leadDemo.leadModifyDTO.leadStatus).trigger('change');
						$("#"+formId+" #leadSupportTo").val(data.leadDashboardCommon.leadCommonDTO[0].leadModifyDTO.leadSupportTo).trigger('change');
						$("#"+formId+" #leadTagging").val(leadDemo.leadCallFollowupDTO.leadTagging).trigger('change');
						$("#"+formId+" #leadPriority").val(leadDemo.leadModifyDetailDTO.priority).trigger('change');
					}, 1000);
					setTimeout(function () {
						callStates(formId, leadDemo.leadStudentDetailDTO.country, 'countryId');
						$("#"+formId+" #stateId").val(leadDemo.leadStudentDetailDTO.state).trigger('change');
					  }, 1000);
					setTimeout(function () {
						callCities(formId, leadDemo.leadStudentDetailDTO.state, 'stateId');
						$("#"+formId+" #cityId").val(leadDemo.leadStudentDetailDTO.city).trigger('change');
					  }, 1000); 
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
		 contentType : APPLICATION_JSON_VALUE,
		 url : getURLForHTML('dashboard', 'get-lead-count-gradewise-report'),
		 data : JSON.stringify(getRequestForLeadCountGradeWiseDetails(formId, userId)),
		 dataType : 'json',
		 cache : false,
		 timeout : 600000,
		 success : function(data) {
			 if (data['status'] == '0' || data['status'] == '2') {
				 //showMessageTheme2(false, data['message']);
			 } else {
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


function callGetOpenFollowup(formId, leadId, userId, controlType, currentPage, modalId, leadType, epdetailUpdateStatus,remarkMendatory,minRemarkCount) {
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
 $(document).on("input", ".followupRemarks_"+leadId, function () {
	let val = $(this).val();
	let minlength = $(this).attr("minlength");
	let counterId = "#followupRemarksCounter"

	// update counter live
	$(counterId).text(val.length + " / "+ minlength);

	// visual feedback
	if (val.length < minlength) {
		$(this).addClass("is-invalid");
		$(counterId).attr("class", "text-red");
	} else {
		$(this).removeClass("is-invalid");
		$(counterId).attr("class", "text-success");
	}
 });

 $.ajax({
		 type : "POST",
		 contentType : APPLICATION_JSON_VALUE,
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
						let isremarkMendatory = (remarkMendatory && (minRemarkCount > 0))
						if(isremarkMendatory){
							
							$("#"+formId+" #followupRemarksCounter").html('0 / '+ minRemarkCount)
							$("#"+formId+" #followupRemarks").addClass('followupRemarks_'+leadId)
							$("#"+formId+" #followupRemarks").attr("minlength", minRemarkCount).attr("required", true).attr("isRemarkMendatory", true);
						}else{
							$("#"+formId+" #followupRemarksCounter").hide()
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
	 contentType : APPLICATION_JSON_VALUE,
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
		 contentType : APPLICATION_JSON_VALUE,
		 url : getURLForHTML('dashboard', 'get-lead-demo-count'),
		 data : JSON.stringify(getRequestForLeadDemoCountDetails(formId, userId)),
		 dataType : 'json',
		 cache : false,
		 timeout : 600000,
		 success : function(data) {
			 if (data['status'] == '0' || data['status'] == '2') {
				 //showMessageTheme2(false, data['message']);
			 } else {
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
 var requestData = {};
 requestData['schoolId'] = SCHOOL_ID;
 requestData['assignTo'] = assignTo;

 $.ajax({
	 type : "POST",
	 contentType : APPLICATION_JSON_VALUE,
	 url : getURLForHTML('dashboard','counselor-ping-lead-schedule'),
	 data : JSON.stringify(requestData),
	 dataType : 'json',
	 cache : false,
	 timeout : 600000,
	 async:false,
	 success : function(response) {
		console.log(response)
		 if (!response) {
			 return false;
		 }
		 if(response.status == '3'){
			 redirectLoginPage();
			 return false;
		 }
		 if(response.status == '0' || response.status == '2'){
			 showMessage(true, response.message || 'Unable to fetch ping lead schedule.');
			 return false;
		 }

		 var htmlContent = '';
		 if(typeof getLeadPingPopupContent === 'function'){
			 htmlContent = getLeadPingPopupContent(response, OBJECT_RIGHTS);
		 }
		 if(htmlContent && htmlContent !== ''){
			 $('#schedulePingMessageContent').html(htmlContent);
			// $(".custom-overlay, .fixed-message-card").show();
			$("#leadPingShowPopup").modal('show')
		 }else{
			 $('#schedulePingMessageContent').html('');
			// $(".custom-overlay, .fixed-message-card").hide();
			$("#leadPingShowPopup").modal('hide')
		 }
		 return false;
	 }
 });
}

function closeNotification(clicked_id){
	var notificationLength = $('.notification-message').length;
	$("."+clicked_id).remove();
	if(notificationLength < 2){
		$('.custom-overlay').hide();
		$("body").removeClass("position-fixed");
	}
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
			contentType : APPLICATION_JSON_VALUE,
			url : getURLForHTML('dashboard', 'calculate-tolead'),
			data : JSON.stringify(getRequestForLeadCalculate(formId, dataType)),
			dataType : 'json',
			cache : false,
			timeout : 600000,
			success : function(data) {
				if (data['status'] == '0' || data['status'] == '2') {
					//showMessageTheme2(false, data['message']);
				} else {
					var bindHtml = getLeadCalculatorHtml(data);
					$("#leadCalculateTbody").html(bindHtml);
					$("#dataMode").html($("#activeDataMode").val());
					$('html, body').animate({
						scrollTop: $("#leadTargetCalculate").offset().top
					}, 800);
					
				}
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
			contentType : APPLICATION_JSON_VALUE,
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
			}
			});
   }

   function callLeadAndEnrollmentWithCountry(modeSearch, startDate, endDate) {
	$.ajax({
			type : "POST",
			contentType : APPLICATION_JSON_VALUE,
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
			contentType : APPLICATION_JSON_VALUE,
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
				contentType : APPLICATION_JSON_VALUE,
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
				contentType : APPLICATION_JSON_VALUE,
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
			contentType : APPLICATION_JSON_VALUE,
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
			contentType : APPLICATION_JSON_VALUE,
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
			contentType : APPLICATION_JSON_VALUE,
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

function showBasicDetailsMailWarning(b2bLeadId, title) {
	$('#warningSendBadicDetailsModel').remove();
	var html=
	'<div class="modal fade" id="warningSendBadicDetailsModel">'
		+'<div class="modal-dialog modal-md modal-notify modal-danger" role="document" style="max-width:500px;">'
			+'<div class="modal-content">'
				+'<div class="modal-body text-center">'
					+'<h5 class="modal-title py-4" >Are you sure you want to send '+title+' mail?</h5>'
					+'<div style="full text-center">'
						+'<button type="button" class="btn btn-primary mr-2" id="discardSendBasicDetailsWarningYes" onclick="sendBasicDetailsMail(' + b2bLeadId + ');">Yes</button>'
						+'<button type="button" class="btn btn-danger  waves-effect text-right" data-dismiss="modal">No</button>'
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
		contentType : APPLICATION_JSON_VALUE,
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
					+'<h5 class="modal-title py-4" >Are you sure you want to resend login details mail?</h5>'
					+'<div style="full text-center">'
						+'<button type="button" class="btn btn-primary mr-2" id="discardSendBasicDetailsWarningYes" onclick="resendB2BWelcomeMail(' + b2bLeadId + ');">Yes</button>'
						+'<button type="button" class="btn btn-danger  waves-effect text-right" data-dismiss="modal">No</button>'
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
		contentType : APPLICATION_JSON_VALUE,
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
		}
	});
}

function callLeadStatusList(formId, value, elementId, keyStatus) {
	hideMessageTheme2('');
	$.ajax({
		type: "POST",
		contentType: APPLICATION_JSON_VALUE,
		url: getURLForCommon('masters'),
		data: JSON.stringify(getRequestForMaster(formId, 'LEAD-STATUS-LIST', value)),
		dataType: 'json',
		cache: false,
		timeout: 600000,
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessageTheme2(true, data['message']);
			} else {
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
		contentType : APPLICATION_JSON_VALUE,
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
 $.ajax({
		 type : "POST",
		 contentType : APPLICATION_JSON_VALUE,
		 url : getURLForHTML('/api/v1/leads', 'get-lead-marge'),
		 data : JSON.stringify(getRequestForMergeLeadIds(formId, leadId, userId, leadType)),
		 dataType : 'json',
		 cache : false,
		 timeout : 600000,
		 success : function(data) {
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
							
							$("#"+formId+" #leadSource").val(leadDemo.leadModifyDTO.leadSource).trigger('change');
							$("#"+formId+" #leadGrade").val(leadDemo.leadStudentDetailDTO.standard);
							$("#"+formId+" #leadDOB").val(leadDemo.leadStudentDetailDTO.stdDob);
							$("#"+formId+" #leadGender").val(leadDemo.leadStudentDetailDTO.gender);
							$("#"+formId+" #leademailId").val(leadDemo.leadStudentDetailDTO.email);
							$("#"+formId+" #phoneNo").val(leadDemo.leadStudentDetailDTO.phoneNo);
							$("#"+formId+" #leademailAlternet").val(leadDemo.leadStudentDetailDTO.emailAlternet);

							$("#"+formId+" #leadAge").val(leadDemo.leadStudentDetailDTO.age);
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
						   
							
							// if(leadType=='B2B'){
							// 	$("#"+formId+" #leadAssignTo").val(leadDemo.leadModifyDTO.assignTo).trigger('change');
							// 	//$("#"+formId+" #leadStatus").val(leadDemo.leadModifyDTO.leadStatus);
							// }else{
							//    $("#"+formId+" #leadAssignTo").val(leadDemo.leadModifyDTO.assignTo)
							//    $("#"+formId+" #leadStatus").val(leadDemo.leadModifyDTO.leadStatus);
							// }
							$("#"+formId+" #leadAssignTo").val(leadDemo.leadModifyDTO.assignTo).trigger('change');
							$("#"+formId+" #leadStatus").val(leadDemo.leadModifyDTO.leadStatus).trigger('change');

							$("#"+formId+" #leadSupportTo").val(leadDemo.leadStudentDetailDTO.relationType);
							$("#"+formId+" #countrolType").val(controlType);
							var leadMergeList =  data['leadDashboardCommon']['leadCommonDTO'];
							if(leadMergeList.length>0){
								$("#"+formId+" #mergeLeads").val(leadId);
								$("#mergeleadlist").html('');
								var htmld= getLeadMergeDataHtml(leadMergeList, leadDemo.leadModifyDTO.leadId, leadType);
								$("#mergeleadlist").html(htmld);
								clickRedioForMergeLead(formId, modalId, leadType);
							}
					   }
					}
				}
			 }
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

function getLeadMergeDataHtml(mergeLeadList, lid, leadType){
	var htmlLead="";
	htmlLead=htmlLead+'<table class="table table-bordered table-striped" style="font-size:11px;">';
	if(leadType=='B2B'){
		htmlLead=htmlLead+'<thead><tr><th>S. No.</th><th>Lead No<br/>Lead Source</th><th>Lead Status<br/>Lead Assign</th><th>Name<br/>Organization Name<br/>City | Country</th><th>Contact Info</th></tr></thead>';
	}else{
		htmlLead=htmlLead+'<thead><tr><th>S. No.</th><th>Lead No<br/>Lead Source</th><th>Lead Status<br/>Lead Assign</th><th>Child Name<br/>Grade<br/>City | Country</th><th>Contact Info</th></tr></thead>';
	}
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
			htmlLead=htmlLead+'<td>'+leads.leadStudentDetailDTO.stdFname+' '+leads.leadStudentDetailDTO.stdMname+' '+leads.leadStudentDetailDTO.stdLname+'';
			if(leadType=='B2B'){
				htmlLead=htmlLead+'<br/>'+(leads.leadStudentDetailDTO.relationType!=''?leads.leadStudentDetailDTO.relationType:'N/A');
			}else{
				htmlLead=htmlLead+'<br/>'+(leads.leadStudentDetailDTO.standardName!=''?leads.leadStudentDetailDTO.standardName:'N/A');
			}

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
		contentType : APPLICATION_JSON_VALUE,
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
	//console.log("callCampainList")
	data={};
	data['schoolId']=SCHOOL_ID;
	$.ajax({
			type : "POST",
			contentType : APPLICATION_JSON_VALUE,
			url : getURLForHTML('/api/v1/leads', 'get-campaign-list'),
			data : JSON.stringify(data),
			dataType : 'json',
			cache : false,
			timeout : 600000,
			success : function(data) {//console.log('get-campaign-list data :: ' + data);
				if (data['status'] == '0' || data['status'] == '2') {
					showMessageTheme2(0, data['message']);
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
		contentType : APPLICATION_JSON_VALUE,
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



function getPartnerLeadById(formId, leadId, modalId, partnerDefaultSettings) {
 	$.ajax({
		 type : "POST",
		 contentType : APPLICATION_JSON_VALUE,
		 url : getURLForHTML('/api/v1/leads', 'get-lead-data-byid'),
		 data : JSON.stringify(getRequestForPartnerByLeadId(formId, leadId)),
		 dataType : 'json',
		 cache : false,
		 timeout : 600000,
		 success : async function(data) {
			 if (data['status'] == '0' || data['status'] == '2') {
				 showMessage(true, data['message']);
			 } else {
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
						var phoneNumber = document.querySelector("#"+formId+" #phoneNo");
						if (phoneNumber && phoneNumber.parentNode) {
							if (itiPhoneNumber && typeof itiPhoneNumber.destroy === 'function') {
								try {
									itiPhoneNumber.destroy();
								} catch (e) {
									console.warn("Ignore destroy error:", e);
								}
							}
						}
						itiPhoneNumber = window.intlTelInput(phoneNumber, {
							//separateDialCode: true,
						});
						itiPhoneNumber.setCountry($('#'+formId+' #pCountryCode').val());
						phoneNumber.addEventListener('countrychange', function(e) {
							//console.log("itiPhone=>", itiPhoneNumber.getSelectedCountryData());
							$('#'+formId+' #pCountryCode').val(itiPhoneNumber.getSelectedCountryData().iso2);
							$('#'+formId+' #isdCode').val(itiPhoneNumber.getSelectedCountryData().dialCode);
						});

						$("#"+formId+" #countryId").val(leadDemo.leadStudentDetailDTO.country).trigger("change");
						setTimeout(function () {
							callStates(formId, leadDemo.leadStudentDetailDTO.country, 'countryId');
							$("#"+formId+" #stateId").val(leadDemo.leadStudentDetailDTO.state).trigger("change");
							$("#"+formId+" #stateId").attr("disabled","disabled");
						}, 1000);
						setTimeout(function () {
							callCities(formId, leadDemo.leadStudentDetailDTO.state, 'stateId');
							$("#"+formId+" #cityId").val(leadDemo.leadStudentDetailDTO.city).trigger("change");
							$("#"+formId+" #cityId").attr("disabled","disabled");
							$("#"+formId+" #partnerType").val(leadDemo.leadModifyDTO.partnerTypeId);
							$("#"+formId+" #originalTimezone").val(leadDemo.leadModifyDTO.originalPartnerTimzone).trigger('change');
						}, 1000);
						var originalPartnerType = leadDemo.leadStudentDetailDTO.originalPartnerType;
						$("#"+formId+" #originalPartnerType").val(originalPartnerType);
						if(originalPartnerType != null && originalPartnerType != ''){
							$("#"+formId+" #originalPartnerType").attr('disabled', true);
						}else{
							$("#"+formId+" #originalPartnerType").removeAttr('disabled');
							setTimeout(() => {
								$('#setCommissionRateTab, #feeStructureTab, #officeContactDetailsTab, #enrollRegTab, #paymentOptionsTab, #themeTab').hide();
							}, 300);
							$('#originalPartnerType').on('change', function () {
							  updateFieldsBasedOnPartnerType();
							});
						}
						// if(leadDemo.leadStudentDetailDTO.originalPartnerType == "WLP"){
						// 	$("#setDiscount, #setDiscountTab").attr("style","");
						// 	$("#setCommissionRate, #setCommissionRateTab").hide();
						// }else if(leadDemo.leadStudentDetailDTO.originalPartnerType == "GP"){
						// 	$("#setCommissionRate, #setCommissionRateTab").attr("style","");
						// 	$("#setDiscount, #setDiscountTab").hide();
						// }
						$("#"+formId+" #commissionPayout").val(leadDemo.leadModifyDTO.commissionPayout);
						$("#"+formId+" #whiteLabel").val(leadDemo.leadModifyDTO.whiteLabel);
						$("#"+formId+" #enrollingStudent").val(leadDemo.leadModifyDTO.enrollingStudent);
						if(leadDemo.leadModifyDTO.pschoolId != null && leadDemo.leadModifyDTO.pschoolId != undefined && leadDemo.leadModifyDTO.pschoolId != ''){
							$("#pSchoolId").val(leadDemo.leadModifyDTO.pschoolId);
							// $("#feeStructureLearningProgram").append(getLearningProgramAndCourseProviderMappingBySchoolId(leadDemo.leadModifyDTO.pschoolId));
							// selectCourseProvider();
						}
						if($("#pSchoolId").val() == ''){
							$('#setCommissionRateTab, #feeStructureTab, #enrollRegTab, #paymentOptionsTab, #themeTab').hide();
						}
						//await initEnrollReg();
						updateFieldsBasedOnPartnerType();
						updatePartnerProgressBar();
						$("#partnerProgressBar").hide()
							$("#partnerProgressBar").removeClass("d-flex")

						if(originalPartnerType == "GP" || originalPartnerType == "EPER"){
							if(partnerDefaultSettings != "PARENT"){
								$("#officeContactDetailsTab").hide();
								$("#setCommissionRateTab, #feeStructureTab, #paymentOptionsTab").show();
							}else{
								$("#officeContactDetailsTab").hide();
								$("#setCommissionRateTab, #feeStructureTab, #paymentOptionsTab").hide();
							}
						}else if(originalPartnerType == "WLP"){
							$("#partnerProgressBar").show()
							$("#partnerProgressBar").addClass("d-flex")
						}
				   }
				}
				$("#"+modalId).modal('show');
			 }
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

function createPartnerUser(formId, leadId, modalId, partnerTypeId, epdetailUpdateStatus, partnerDefaultSettings, partnerType){
	// if(epdetailUpdateStatus!='Y'){
	// 	showMessageTheme2(0, 'Please update the Enrollment Partner Form before creating the partner dashboard.','',true);
	// }else{
		renderPartnerCotent(partnerTypeId, partnerDefaultSettings, partnerType);
		getPartnerLeadById(formId, leadId, modalId, partnerDefaultSettings);
	// }
	
}


function savePatnerWithReferralCode(formId, elementId) {
	hideMessageTheme2('');
	if($("#"+formId+" #countryId").val()=='' 
		|| $("#"+formId+" #countryId").val()==undefined){
		showMessageTheme2(0, 'Please select Country');
		return false;
	}
	if($("#"+formId+" #stateId").val()=='' 
		|| $("#"+formId+" #stateId").val()==undefined){
		showMessageTheme2(0, 'Please select State');
		return false;
	}
	if($("#"+formId+" #cityId").val()=='' 
		|| $("#"+formId+" #cityId").val()==undefined){
		showMessageTheme2(0, 'Please select Location City');
		return false;
	}
	if($("#"+formId+" #partnerType").val()=='' 
		|| $("#"+formId+" #partnerType").val()==undefined){
		showMessageTheme2(0, 'Please select Location Partner Type');
		return false;
	}
	if($("#"+formId+" #originalPartnerType").val()=='' 
		||  $("#"+formId+" #originalPartnerType").val()==undefined){
		showMessageTheme2(0, 'Please select Partner Type');
		return false;
	}
	if($("#"+formId+" #originalTimezone").val()=='' 
		||  $("#"+formId+" #originalTimezone").val()==undefined){
		showMessageTheme2(0, 'Please select Timezone');
		return false;
	}

	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLForHTML('dashboard', 'save-referralcode-partner'),
		data : JSON.stringify(getRequestForPartnerWithReferral(formId)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : async function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessageTheme2(0, data['message']);
			} else {
				$("#originalPartnerType").attr('disabled', true);
				updateTabsVisibility();
				showMessageTheme2(1, data['message']);
				if($("#originalPartnerType").val() != 'WLP'){
					await saveLearningPrograms();
				}
				if($("#originalPartnerType").val() == "WLP"){
					$("#saveCommissionRateForm #learningProgram").html(`<option value="A" selected="" data-select2-id="1432">All Program</option>`);
					$("#saveCommissionRateForm #standardId").html(`<option value="A">ALL Grade</option>`);
				}
			}
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
	data['isSubPartner']=false;
	return data;
}

function getOfficeContentsDetails(formId){
	var requestData = {
		"schoolId":$("#pSchoolId").val(),
		"rowleadId":$("#partnerUserB2BSaveForm #rawLeadId").val()
	}
	$.ajax({
		type: "GET",
		contentType: "application/json",
		url: getURLForHTML('dashboard', 'get-office-contact-details?payload='+encode(JSON.stringify(requestData))),
		dataType: 'json',
		success: function(data){
			if(data['status'] == '1'){
				$("#"+formId+" #officeFacebook").val(data.details.officeFacebook);
				$("#"+formId+" #officeInsta").val(data.details.officeInsta);
				$("#"+formId+" #officeLinkedin").val(data.details.officeLinkedin);
				$("#"+formId+" #officeX").val(data.details.officeX);
				$("#"+formId+" #schoolWebsite").val(data.details.schoolWebsite);
				$("#"+formId+" #officeYoutube").val(data.details.officeYoutube);
				$("#"+formId+" #officeContactUs").val(data.details.contactUsUrl);
				$("#"+formId+" #schoolTimezone").val(data.details.schoolTimezone).trigger('change');
				$("#"+formId+" #officeContactNumber").val(data.details.schoolContact);
				$("#"+formId+" #officeContactEmail").val(data.details.contactEmail);
				$("#"+formId+" #superAdminEmail").val(data.details.schoolEmail);
				$("#"+formId+" #supportNumber").val(data.details.supportNumber);
				$("#"+formId+" #officeCountryId").val(data.details.officeCountryId).change();
				$("#"+formId+" #officeStateId").val(data.details.officeStateId).change();
				$("#"+formId+" #officeCityId").val(data.details.officeCityId).change();
				$("#"+formId+" #supportNumWtsCheck").prop("checked",  data.details.supportNumWtsCheck == 'Y');
				$("#"+formId+" #officeContactNumWtsCheck").prop("checked", data.details.officeContactNumWtsCheck == 'Y');
				$("#"+formId+" #officeAddres").val(data.details.officeAddres);
				$("#"+formId+" #supportEmail").val(data.details.supportEmail);
				$("#"+formId+" #schoolName").val(data.details.schoolName);
				if(data.details.schoolContactCountryCode !=  undefined){
					itiSchoolContactNumber.setCountry(data.details.schoolContactCountryCode);
				}
				if(data.details.supportNumberCountryCode !=  undefined){
					itiSchoolSupportNumber.setCountry(data.details.supportNumberCountryCode);
				}

				if($("#"+formId+" #schoolName").val() == null || $("#"+formId+" #schoolName").val() == undefined || $("#"+formId+" #schoolName").val() == ''){
					$("#"+formId+" #createUpdatePartnerContactBtn").text("Create")
				}else{
					$("#"+formId+" #createUpdatePartnerContactBtn").text("Update")
				}
				return data;
			} else {
				showMessageTheme2(0, data['message']);
			}
		},
		error: function (e) {
			console.log("ERROR ::", e);
		}
	});
}


function getUpdateOfficeContentDetails(formId){
	if($("#officeContactEmail").val() == null || $("#officeContactEmail").val() == undefined || $("#officeContactEmail").val() == ""){
		showMessageTheme2(0, "Please enter the office contact email")
		return false;
	}
	if($("#officeContactNumber").val() == null || $("#officeContactNumber").val() == undefined || $("#officeContactNumber").val() == ""){
		showMessageTheme2(0, "Please enter the office contact number")
		return false;
	}
	if($("#supportEmail").val() == null || $("#supportEmail").val() == undefined || $("#supportEmail").val() == ""){
		showMessageTheme2(0, "Please enter the support email")
		return false;
	}
	if($("#supportNumber").val() == null || $("#supportNumber").val() == undefined || $("#supportNumber").val() == ""){
		showMessageTheme2(0, "Please enter the support number")
		return false;
	}
	if($("#schoolName").val() == null || $("#schoolName").val() == undefined || $("#schoolName").val() == ""){
		showMessageTheme2(0, "Please enter the school name")
		return false;
	}
	if($("#schoolTimezone").val() == null || $("#schoolTimezone").val() == undefined || $("#schoolTimezone").val() == ""){
		showMessageTheme2(0, "Please enter the school timezone")
		return false;
	}
	if($("#schoolWebsite").val() == null || $("#schoolWebsite").val() == undefined || $("#schoolWebsite").val() == ""){
		showMessageTheme2(0, "Please enter the school website")
		return false;
	}
	if($("#officeCountryId").val() == null || $("#officeCountryId").val() == undefined || $("#officeCountryId").val() == ""){
		showMessageTheme2(0, "Please enter the country")
		return false;
	}
	if($("#officeStateId").val() == null || $("#officeStateId").val() == undefined || $("#officeStateId").val() == ""){
		showMessageTheme2(0, "Please enter the state")
		return false;
	}
	if($("#officeCityId").val() == null || $("#officeCityId").val() == undefined || $("#officeCityId").val() == ""){
		showMessageTheme2(0, "Please enter the city")
		return false;
	}
	if($("#officeContactUs").val() == null || $("#officeContactUs").val() == undefined || $("#officeContactUs").val() == ""){
		showMessageTheme2(0, "Please enter the contact us")
		return false;
	}
	if($("#superAdminEmail").val() == null || $("#superAdminEmail").val() == undefined || $("#superAdminEmail").val() == ""){
		showMessageTheme2(0, "Please enter the super admin email")
		return false;
	}
	if($("#officeAddres").val() == null || $("#officeAddres").val() == undefined || $("#officeAddres").val() == ""){
		showMessageTheme2(0, "Please enter the address")
		return false;
	}
	// if($("#officeContactNumberCountryCode").val() == null || $("#officeContactNumberCountryCode").val() == undefined || $("#officeContactNumberCountryCode").val() == ""){
	// 	showMessageTheme2(0, "Please enter the city")
	// 	return false;
	// }
	// if($("#officeContactNumberDailCode").val() == null || $("#officeContactNumberDailCode").val() == undefined || $("#officeContactNumberDailCode").val() == ""){
	// 	showMessageTheme2(0, "Please enter the contact us")
	// 	return false;
	// }
	// if($("#supportNumberCountryCode").val() == null || $("#supportNumberCountryCode").val() == undefined || $("#supportNumberCountryCode").val() == ""){
	// 	showMessageTheme2(0, "Please enter the super admin email")
	// 	return false;
	// }
	// if($("#supportNumberDailCode").val() == null || $("#supportNumberDailCode").val() == undefined || $("#supportNumberDailCode").val() == ""){
	// 	showMessageTheme2(0, "Please enter the address")
	// 	return false;
	// }
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLForHTML('dashboard', 'update-office-contact-details'),
		data: JSON.stringify(requestDataForOfficeContentDetails(formId)),
		dataType: 'json',
		success: async function(data){
			if (data['status'] == '0' || data['status'] == '2') {
				showMessageTheme2(0 , data.message ,'')
			}else{
				showMessageTheme2(1 , data.message ,'');
				$("#pSchoolId").val(data["pSchoolId"]);
				$("#enrollRegTab").show();
				$("#createUpdatePartnerContactBtn").text("Next");
				$('#enrollRegTab').tab('show');
				await saveLearningPrograms();
				setTimeout(async function(){
					await initEnrollReg();
				}, 1000)
				
				updatePartnerProgressBar();

			}
		},
		error: function (e) {
			console.log("ERROR ::", e);
		}
	});
}

function requestDataForOfficeContentDetails(formId){
	var requestdata = {
		"schoolId": $("#pSchoolId").val(),
		"logInUserId":USER_ID,
		"rowLeadId":$('#partnerUserB2BSaveForm #rawLeadId').val(),
		'officeFacebook':$("#"+formId+" #officeFacebook").val(),
		'officeInsta':$("#"+formId+" #officeInsta").val(),
		'officeLinkedin':$("#"+formId+" #officeLinkedin").val(),
		'officeX':$("#"+formId+" #officeX").val(),
		'schoolWebsite':$("#"+formId+" #schoolWebsite").val(),
		'officeYoutube':$("#"+formId+" #officeYoutube").val(),
		'contactUsUrl':$("#"+formId+" #officeContactUs").val(),
		'schoolTimezone':$("#"+formId+" #schoolTimezone").val(),
		'schoolContact':$("#"+formId+" #officeContactNumber").val(),
		'schoolContactCountryCode':$("#"+formId+" #officeContactNumberCountryCode").val(),
		'schoolContactDailCode':$("#"+formId+" #officeContactNumberDailCode").val(),
		'contactEmail':$("#"+formId+" #officeContactEmail").val(),
		'supportEmail':$("#"+formId+" #supportEmail").val(),
		'schoolEmail':$("#"+formId+" #superAdminEmail").val(),
		'supportNumber':$("#"+formId+" #supportNumber").val(),
		'supportNumberCountryCode':$("#"+formId+" #supportNumberCountryCode").val(),
		'supportNumberDailCode':$("#"+formId+" #supportNumberDailCode").val(),
		'officeCountryId':$("#"+formId+" #officeCountryId").val(),
		'officeStateId':$("#"+formId+" #officeStateId").val(),
		'officeCityId':$("#"+formId+" #officeCityId").val(),
		'supportNumWtsCheck':$("#"+formId+" #supportNumWtsCheck").is(":checked")?'Y':'N',
		'officeContactNumWtsCheck':$("#"+formId+" #officeContactNumWtsCheck").is(":checked")?'Y':'N',
		'officeAddres':$("#"+formId+" #officeAddres").val(),
		'schoolName':$("#"+formId+" #schoolName").val()
		
	}
	return requestdata;
}

function callPCountries(formId, value, elementId, preSelected) {
	if(formId=='country-time-list'){
	}else{
		$("#" + formId + " #" + elementId).html('<option value="">Select country*</option>');
	}
	$.ajax({
		type: "POST",
		contentType: APPLICATION_JSON_VALUE,
		url: getURLForCommon('masters'),
		data: JSON.stringify(getRequestForMaster(formId, 'COUNTRIES-LIST', value)),
		dataType: 'json',
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(1, data['message']);
			} else {
				var countries = data['mastersData']['countries']
				if(formId=='country-time-list'){
					$("#" + formId + " #" + elementId).append('<option value="0" selected>All</option>');
				}
				$.each(countries, function(k, v) {
					$("#" + formId + " #" + elementId).append('<option dailCode="'+v.extra1+'" dail-country-code="'+v.extra+'" value="'+v.key+'" '+(preSelected==v.key?'selected':'')+'>'+v.value+'</option>');
				});
				
				
			}
		}
	});
	return true;
}


function getPartnerTypeList(formId, value,elementId, preSelected, partnerTypeId, partnerDefaultSettings) {
	$("#" + formId + " #" + elementId).html('<option value="">Select Partner type*</option>');
	$.ajax({
		type: "POST",
		contentType: APPLICATION_JSON_VALUE,
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
					$("#" + formId + " #" + elementId).append('<option value="'+v.key+'" '+(preSelected==v.key?'selected':'')+'>'+v.value+'</option>');
				});
				if(partnerDefaultSettings == "PARENT"){
					if(partnerTypeId != null && partnerTypeId != undefined && partnerTypeId != "" && partnerTypeId != "1"){
						for(var i=(parseInt(partnerTypeId)-1);i>=1;i--){
							$("#" + formId + " #" + elementId+" option[value='"+i+"']").remove();
						}
					}
				}
			}
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
		contentType : APPLICATION_JSON_VALUE,
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
		contentType : APPLICATION_JSON_VALUE,
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
		contentType : APPLICATION_JSON_VALUE,
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
	contentType : APPLICATION_JSON_VALUE,
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



function submitFollowupSaveFromLeadList(formId, leadId,  leadType, roleModuleId, callFrom,remarkMendatory,minRemarkCount) {
	hideMessageTheme2('');
	let isRemarkMendatory = (remarkMendatory && (minRemarkCount > 0))
	if ($('#leadStatus-'+leadId).val()==undefined || $('#leadStatus-'+leadId).val()=='') {
		showMessageTheme2(0, 'Please select lead Status','',true);
		return false;
	}
	var leadStatus =$('#leadStatus-'+leadId).val();
	var remark='';
	if(isRemarkMendatory){
		if ($('#followupRemarks-'+leadId).val()==undefined || $('#followupRemarks-'+leadId).val().trim()=='') {
			showMessageTheme2(0, 'Please fill followup Remarks','',true);
			return false;
		}else if($('#followupRemarks-'+leadId).val().trim().length < minRemarkCount){
			showMessageTheme2(0,'Remarks must be at least ' + minRemarkCount + ' characters.','',true);
			return false;
		}else{
			let counterId = "#leadListRemarksCounter_" +leadId;
			$(counterId).attr("class", "text-muted");
			$(counterId).html('0 / '+ minRemarkCount);
		}
	}
	if($('#followupRemarks-'+leadId).val()!=''){
		remark=escapeCharacters($('#followupRemarks-'+leadId).val());
	}
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
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
				if(leadStatus=='Follow-up Meeting Booked' || leadStatus=='Follow-up Meeting Completed' || leadStatus=='Follow-up Meeting Reschedule' || leadStatus=='Follow-up Meeting cancelled'){}
				else{
					$(".demo-status-row-"+leadId).html(data['extra4']);
				}

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
				var $leadRow = $('.lead-row-'+leadId).closest('tr');
				if (leadStatus === 'Red Flag') {
					$leadRow.addClass('red-flag-lead').css('pointer-events', 'none');
				} else {
					$leadRow.removeClass('red-flag-lead').css('pointer-events', '');
				}
			}
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
		   || leadStatus=='Not Answering' || leadStatus=='Not reachable' || leadStatus=='Switch off' 
		 ){
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
	   if(leadStatus=='Assigned Working'){
		   leadCallFollowupDTO['callBadge'] ='gray';
	   }
	   if(leadStatus=='Basic Details not Filled | Cold'){
		   leadCallFollowupDTO['callBadge'] ='darkgreen';
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
		contentType : APPLICATION_JSON_VALUE,
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
		contentType : APPLICATION_JSON_VALUE,
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
		contentType : APPLICATION_JSON_VALUE,
		url : getURLFor('leads','get-wati-templates'),
		data : JSON.stringify(request),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data['statusCode'] == '0' || data['statusCode'] == '2'  || data['status'] == '0' || data['status'] == '2'  || data['statusCode'] == 'E001' || data['statusCode'] == 'E002') {
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
		contentType : APPLICATION_JSON_VALUE,
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
				if(value.header != null && value.header.mediaFromPC!=null && value.header.mediaFromPC!=''){
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


function callLeadDemoList(modeSearch, startDate, endDate) {
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
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
			var meetingStatus=studentEnroll.meetingStatus;
			if(studentEnroll.meetingStatus=='PENDING'){
				meetingStatus='No Status';
			}else if(studentEnroll.meetingStatus=='NOTATTENDED'){
				meetingStatus='No Show';
			}else if(studentEnroll.meetingStatus=='COMPLETED'){
				meetingStatus='Completed';
			}else if(studentEnroll.meetingStatus=='CANCELLED'){
				meetingStatus='Cancelled';
			}else if(studentEnroll.meetingStatus=='RESCHEDULE'){
				meetingStatus='Reschedule';
			}
			htmlRet +="<tr>";
			htmlRet +="<td>"+(sr++)+"</td>";
			htmlRet +="<td style=\"vertical-align: top !important;\">"+studentEnroll.demoDate+"<br/>"+studentEnroll.demoStartTime+" - "+studentEnroll.demoEndTime+"<br/>"+studentEnroll.meetingFrom+"</td>";
			htmlRet +="<td style=\"vertical-align: top !important;\"><b>"+studentEnroll.assignName+" | "+studentEnroll.meetingPersoneName+"</b><br/>"+studentEnroll.email+"</td>";
			if(!studentEnroll.searchUser){
				htmlRet +="<td style=\"vertical-align: top !important;\">";
				if(meetingJoinTimeList.length>0){
					htmlRet +="<div style='max-height:220px; overflow-y:auto;'>";
					htmlRet +="<table class=\"table table-bordered table-striped\" style=\"width:100%; border-collapse:collapse;\">";
					htmlRet +="<thead style='position:sticky; top:0; background:#fff; z-index:2;'><tr><th style='position:sticky; top:0; background:#fff; width:170px;'>Host</th><th style='position:sticky; top:0; background:#fff; width:170px;'>Attendee</th></tr></thead>";
					htmlRet +="<tbody>";
					var bgcolor="";
					for (let mi = 0; mi < meetingJoinTimeList.length; mi++) {
						const meetingTime = meetingJoinTimeList[mi];
						if(meetingTime.joinType=='host'){
							htmlRet +="<tr><td class='"+bgcolor+"'>"+meetingTime.clickTime+"<br/><span style=\"font-size:10px\">"+meetingTime.city+" | "+meetingTime.country+" | "+meetingTime.timeZone.replace('/','-')+"</span></td><td> - </td></tr>";
						}else{
							htmlRet +="<tr><td> - </td><td class='"+bgcolor+"'>"+meetingTime.clickTime+"<br/><span style=\"font-size:9px\">"+meetingTime.city+" | "+meetingTime.country+" | "+meetingTime.timeZone.replace('/','-')+"</span></td></tr>";
						}
					}
					htmlRet +="</tbody></table>";
					htmlRet +="</div>";
				}
				htmlRet +="</td>";
			}
			htmlRet +="<td style=\"vertical-align: top !important;\">"+meetingStatus+"</td>";
			htmlRet +="<td style=\"vertical-align: top !important;\">"+studentEnroll.meetingRemark+"</td>";
			htmlRet +="</tr>";

		}
	}
	return htmlRet;
}


function callEnrollmentListDaywise(reportType, modeSearch, startDate, endDate) {
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
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
						if(ind==(enrollList.length-1)){
							attrMonth.push(enrollMonth.meetingDate);
						}
					}else{
							var enrollDaywise = enrollMonth.enrollDayList;
							if(enrollDaywise.length>0){
								for (let t = 0; t < enrollDaywise.length; t++) {
									var studentEnroll = enrollDaywise[t];
									if(colType=='Enrollment'){
										data.push(studentEnroll.enrollDaywise);
										if(ind==(enrollList.length-1)){
											var mdate = studentEnroll.meetingDate.replace(", "+yearName, "");
											//studentEnroll.weekday
											if(modeSearch=='DAY'){
												attrMonth.push(mdate);
											}else if(modeSearch=='WEEK'){
												attrMonth.push(mdate);
											}else{
												attrMonth.push(mdate);
											}
										}
									}else if(colType=='Leads'){
										data.push(studentEnroll.leadDaywise);
										if(ind==(enrollList.length-1)){
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

function callLeadCampaignList(modeSearch, startDate, endDate, campaignName, eventid, assignTo, callFrom) {

	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLForHTML('dashboard', 'get-lead-list-campaign'),
		data : JSON.stringify(getRequestForLeadCampaign(modeSearch,startDate, endDate, campaignName, assignTo)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			//console.log(data);
			
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				var leadListCampaign=data.leadListCampaign;
				if(modeSearch!='campaign-wise'){
					if(leadListCampaign.length>0){
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
						var httmlTop = getLeadCampaignWiseHtml(data);
						$("#leadCampaignListTbody").html(httmlTop);
					}
				}else{
					console.log(leadListCampaign);
					var startDate='';
					var totalLead=0;
					var spent = 0.0;
					var cpc = 0.0;
					var ctr = 0.0;
					var reach = 0.0;
					var frequency = 0.0;
					var perLeadFbSpent=0.0;
					var lConversion=0.0;
					var lScore=0.0;
					var lScoreColor='';			
					var ctrbgColor='';
					var cprbgcolor='';
					var cpcbgcolor='';
					var freqbgColor='';
					var campaignStatusColor='';
					var campaignStatusMsg='';	
					var campaignEfStatusColor='';
					var campaignEfStatusMsg='';	
					if(leadListCampaign.length>0){
						var leadCampaign=leadListCampaign[0];
						startDate=leadCampaign.startDate;
						totalLead=leadCampaign.totalFbLead;
						spent = parseFloat(leadCampaign.totalSpend);
						cpc = parseFloat(leadCampaign.cpc);
						ctr = parseFloat(leadCampaign.ctr);
						reach = parseInt(leadCampaign.reach);
						frequency = parseFloat(leadCampaign.frequency);
						lScore = parseFloat(leadCampaign.lScore);
						lConversion=parseFloat(leadCampaign.lConversion);

						perLeadFbSpent=0;
						if(leadCampaign.totalFbLead!=''){
							perLeadFbSpent=spent/parseInt(leadCampaign.totalFbLead);
						}

						lScoreColor='';
						if(lScore>=80){
							lScoreColor='bg-success';
						}else if(lScore>=50 && lScore<80){
							lScoreColor='bg-warning';
						}else if(lScore<50){
							lScoreColor='bg-danger';
						}

						ctrbgColor='';
						if(ctr>=1){
							ctrbgColor='bg-success';
						}else if(ctr>0.56 && ctr<0.99){
							ctrbgColor='bg-warning';
						}else if(ctr<0.56){
							ctrbgColor='bg-danger';
						}

						cpcbgcolor='';
						if(cpc>=5){
							cpcbgcolor='bg-danger';
						}else{
							cpcbgcolor='bg-success';
						}

						cprbgcolor='';
						if(perLeadFbSpent>=25){
							cprbgcolor='bg-danger';
						}else {
							cprbgcolor='bg-success';
						}

						freqbgColor='';
						if(frequency<3){
							freqbgColor='bg-success';
						}else {
							freqbgColor='bg-danger';
						}
						if(leadCampaign.campaignStatus=='ACTIVE'){
							campaignStatusColor='bg-success';
							campaignStatusMsg='Active';
						}else if(leadCampaign.campaignStatus=='PAUSED'){
							campaignStatusColor='bg-warning';	
							campaignStatusMsg='Paused';
						}else if(leadCampaign.campaignStatus=='DELETED' || leadCampaign.campaignStatus=='ARCHIVED'){
							campaignStatusColor='bg-danger';
							campaignStatusMsg='Inactive';
						}
						if(leadCampaign.campaignEffectiveStatus=='ACTIVE'){
							campaignEfStatusColor='bg-success';
							campaignEfStatusMsg='Actively delivering';
						}else if(leadCampaign.campaignEffectiveStatus=='PAUSED'){
							campaignEfStatusColor='bg-warning';
							campaignEfStatusMsg='Paused';
						}else if(leadCampaign.campaignEffectiveStatus=='IN_PROCESS'){
							campaignEfStatusColor='bg-warning';
							campaignEfStatusMsg='Updating';
						}else if(leadCampaign.campaignEffectiveStatus=='WITH_ISSUES'){
							campaignEfStatusColor='bg-warning';
							campaignEfStatusMsg='Not delivering due to some issues';
						}
					}
					$(".campaign-name").html(leadCampaign.campaignName);
					htm=`
					<tr><td>Start Date</td><td class="text-center">${startDate}</td><td class="text-center">Campaign Launch Date</td><td>-</td></tr>
					<tr><td>Total Leads</td><td class="text-center">${totalLead}</td><td class="text-center">Higher is Better</td><td></td></tr>
					<tr><td>Amount Spent</td><td class="text-center">$ ${spent}</td><td class="text-center"><$ 1000</td><td></td></tr>
					<tr><td>CTR (Click Through Rate)</td><td class="text-center">${ctr.toFixed(2)}%</td><td class="text-center">>= 0.56% (Ideal: 1%+)</td><td class="${ctrbgColor}"></td></tr>
					<tr><td>CPC (Cost Per click) </td><td class="text-center">$ ${cpc.toFixed(2)}</td><td class="text-center">< $5</td><td class="${cpcbgcolor}"></td></tr>
					<tr><td>CPR (Cost Per Result)</td><td class="text-center">$ ${perLeadFbSpent.toFixed(2)}</td><td class="text-center">$17 - $25</td><td class="${cprbgcolor}"></td></tr>
					<tr><td>Frequency</td><td class="text-center">${frequency.toFixed(2)}</td><td class="text-center">< 3 (Best: 1-2)</td><td class="${freqbgColor}"></td></tr>
					<tr><td>Conversion /Lead Quality</td><td class="text-center">${lConversion.toFixed(2)}/${lScore.toFixed(2)}</td><td class="text-center"></td><td class="${lScoreColor}"></td></tr>
					<tr><td>Campaign Status</td><td class="text-center">${campaignStatusMsg}</td><td class="text-center"></td><td class="${campaignStatusColor}"></td></tr>
					<tr><td>Campaign Effective Status</td><td class="text-center">${campaignEfStatusMsg}</td><td class="text-center"></td><td class="${campaignEfStatusColor}"></td></tr>`;
					$("#campaignReportTbody").html(htm);
					$("#campaignScorePopup").modal('show');
				}
			}
		}
		});
}
   

function getRequestForLeadCampaign(modeSearch,startDate, endDate, campaignName, assignTo) {
	var authentication = {};
	var leadReportRequest = {};
	leadReportRequest['schoolId'] = SCHOOL_ID;
	leadReportRequest['modeSearch'] = modeSearch;
	leadReportRequest['startDate'] = startDate;
	leadReportRequest['endDate'] = endDate;
	leadReportRequest['assignTo'] = assignTo;
	leadReportRequest['email'] = $("#searchLeadCampaignEmail").val()!=undefined ? $("#searchLeadCampaignEmail").val().trim() : '';
	
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
	if(modeSearch=='campaign-wise'){
		leadReportRequest['reportType']="CAMPAIGN-LIST";
	}
	var countryIds=[];
		if($("#searchCountryType").val()!='' && $("#searchCountryType").val()!=undefined){
			countryIds=$("#searchCountryType").val();
		}
		leadReportRequest['countryIds'] = countryIds;

   
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
	var hideCounselorSection = $("#lead-campaign-list").data("hideCounselorSection") === "Y";
	var activeLead=0;
	var inActiveLead=0;
	var facebooklead=0;
	var facebookActivelead=0;
	var facebookInactivelead=0;

	if(leadListCampaign.length>0){
		var ctrbgColor='';
		var cprbgcolor='';
		var cpcbgcolor='';	
		var freqbgColor='';
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
			var cpc = parseFloat(leadCampaign.cpc);
			var ctr = parseFloat(leadCampaign.ctr);
			var reach = parseInt(leadCampaign.reach);
			var frequency = parseFloat(leadCampaign.frequency);
			var perLeadSmsSpent=spent/parseInt(leadCampaign.totalLead);
			var perLeadFbSpent=0;
			if(leadCampaign.totalFbLead!=''){
				perLeadFbSpent=spent/parseInt(leadCampaign.totalFbLead);
			}

			ctrbgColor='';
			if(ctr>=1){
				ctrbgColor='bg-success';
			}else if(ctr>0.56 && ctr<0.99){
				ctrbgColor='bg-warning';
			}else if(ctr<0.56){
				ctrbgColor='bg-danger';
			}
			

			cprbgcolor='';
			if(perLeadFbSpent>=25){
				cprbgcolor='bg-danger';
			}else {
				cprbgcolor='bg-success';
			}

			cpcbgcolor='';
			if(cpc>=5){
				cpcbgcolor='bg-danger';
			}else{
				cpcbgcolor='bg-success';
			}

			freqbgColor='';
			if(frequency<3){
				freqbgColor='bg-success';
			}else {
				freqbgColor='bg-danger';
			}


			var classTr=(leadCampaign.activeStatus=='N'?'bg-warning':'');
			htmlRet +="<tr class=\""+classTr+"\" style=\"border-bottom:1px solid;border-radius:0;\">";
			htmlRet +="<td class=\"text-center\" style=\"vertical-align: top !important;max-width:40px !important;min-width:40px\">"+(sr)+"</td>";
			// htmlRet +="<td style=\"vertical-align: top !important;min-width:250px\" ><a href=\"javascript:void(0)\" data-target=\"#collapseOne"+sr+"\" data-toggle=\"collapse\" aria-expanded=\"false\" aria-controls=\"collapse"+sr+"\" class=\"collapsed\"  onclick=\"getListLeadCampaign('"+leadCampaign.campaignName+"','"+sr+"','');\">"+leadCampaign.campaignName+"</a></td>";
			
			// htmlRet +="<td style=\"vertical-align: top !important;min-width:250px\" class=\"text-center\">";
			// htmlRet +="<span class=\"bg-success text-white text-center  badge font-12\">"+leadCampaign.totalActiveLead+"</span> + <span class=\"bg-warning text-white text-center badge font-12\">"+leadCampaign.totalInactiveLead+"</span> = <span class=\"badge badge-primary font-12\">"+leadCampaign.totalLead+"</span> | <span class=\"badge badge-info  text-center font-12\">"+leadCampaign.totalFbLead+"</span></td>";
			// htmlRet +="<td style=\"vertical-align: top !important;min-width:180px\" class=\"text-center\">";
			// htmlRet +="<span class=\"badge badge-pill badge-dark font-10\">$"+leadCampaign.totalSpend+"</span><br/>";
			// htmlRet +="<span class=\"badge badge-pill badge-primary font-10\">$"+perLeadSmsSpent.toFixed(2)+"</span> | ";
			// htmlRet +="<span class=\"badge badge-pill badge-info font-10\">$"+perLeadFbSpent.toFixed(2)+"</span> ";
			// htmlRet +="</td>";
			htmlRet +="<td colspan=\"3\"  style=\"vertical-align: top !important\">";
				htmlRet +="<span class=\"font-14\"><a href=\"javascript:void(0)\" data-target=\"#collapseOne"+sr+"\" data-toggle=\"collapse\" aria-expanded=\"false\" aria-controls=\"collapse"+sr+"\" class=\"collapsed\"  onclick=\"getListLeadCampaign('"+leadCampaign.campaignName+"','"+sr+"','');\">"+leadCampaign.campaignName+"</a></span>";
				htmlRet +="<span class=\"float-right\"><span class=\"bg-success text-white text-center  badge font-10\">"+leadCampaign.totalActiveLead+"</span> + <span class=\"bg-warning text-white text-center badge font-10\">"+leadCampaign.totalInactiveLead+"</span> = <span class=\"badge badge-primary font-10\">"+leadCampaign.totalLead+"</span> | <span class=\"badge badge-info  text-center font-10\">"+leadCampaign.totalFbLead+"</span></span>";
				htmlRet +="<table class=\"w-100 table mb-0 bg-transparent\" style=\"table-layout:fixed;border-collapse:separate;border-spacing:0;\">";
				htmlRet +="<tbody>";
				htmlRet += "<tr style=\"background-color:#d3d1d1 !important\">";
				
				htmlRet += "<td style=\"width:11%;border:0;border-right:1px solid #7f7f7f;border-radius:0;padding:6px 4px;white-space:nowrap;\" class=\"badge font-10 my-0\">Reach</td>";
				htmlRet += "<td style=\"width:11%;border:0;border-right:1px solid #7f7f7f;border-radius:0;padding:6px 4px;white-space:nowrap;\" class=\"badge font-10 my-0\">Impressions</td>";
				htmlRet += "<td style=\"width:11%;border:0;border-right:1px solid #7f7f7f;border-radius:0;padding:6px 4px;white-space:nowrap;\" class=\"badge font-10 my-0\">Frequency</td>";
				htmlRet += "<td style=\"width:11%;border:0;border-right:1px solid #7f7f7f;border-radius:0;padding:6px 4px;white-space:nowrap;\" class=\"badge font-10 my-0\">CPR</td>";
				htmlRet += "<td style=\"width:11%;border:0;border-right:1px solid #7f7f7f;border-radius:0;padding:6px 4px;white-space:nowrap;\" class=\"badge font-10 my-0\">Spent</td>";
				htmlRet += "<td style=\"width:11%;border:0;border-right:1px solid #7f7f7f;border-radius:0;padding:6px 4px;white-space:nowrap;\" class=\"badge font-10 my-0\">Results</td>";
				htmlRet += "<td style=\"width:11%;border:0;border-right:1px solid #7f7f7f;border-radius:0;padding:6px 4px;white-space:nowrap;\" class=\"badge font-10 my-0\">CPC</td>";
				htmlRet += "<td style=\"width:11%;border:0;border-right:1px solid #7f7f7f;border-radius:0;padding:6px 4px;white-space:nowrap;\" class=\"badge font-10 my-0\">CTR</td>";
				htmlRet += "<td style=\"width:11%;border:0;padding:6px 4px;white-space:nowrap;\" class=\"badge font-10 my-0\"></td>";

				htmlRet +="</tr>";
				htmlRet += "<tr>";
				
				htmlRet += "<td style=\"width:11%;border:0;border-right:1px solid #7f7f7f;border-radius:0;padding:7px 4px;white-space:nowrap;\" class=\"badge font-10 my-0\">"+reach+"</td>";
				htmlRet += "<td style=\"width:11%;border:0;border-right:1px solid #7f7f7f;border-radius:0;padding:7px 4px;white-space:nowrap;\" class=\"badge font-10 my-0\">"+leadCampaign.impressions+"</td>";
				htmlRet += "<td style=\"width:11%;border:0;border-right:1px solid #7f7f7f;border-radius:0;padding:7px 4px;white-space:nowrap;\" class=\"badge font-10 my-0 "+freqbgColor+"\">"+frequency.toFixed(2)+"</td>";
				htmlRet += "<td style=\"width:11%;border:0;border-right:1px solid #7f7f7f;border-radius:0;padding:7px 4px;white-space:nowrap;\" class=\"badge font-10 my-0 "+cprbgcolor+"\">$"+perLeadFbSpent.toFixed(2)+"</td>";
				htmlRet += "<td style=\"width:11%;border:0;border-right:1px solid #7f7f7f;border-radius:0;padding:7px 4px;white-space:nowrap;\" class=\"badge font-10 my-0\">$"+leadCampaign.totalSpend+"</td>";
				htmlRet += "<td style=\"width:11%;border:0;border-right:1px solid #7f7f7f;border-radius:0;padding:7px 4px;white-space:nowrap;\" class=\"badge font-10 my-0\">"+leadCampaign.totalFbLead+"</td>";
				htmlRet += "<td style=\"width:11%;border:0;border-right:1px solid #7f7f7f;border-radius:0;padding:7px 4px;white-space:nowrap;\" class=\"badge font-10 my-0 "+cpcbgcolor+"\">$"+cpc.toFixed(2)+"</td>";
				htmlRet += "<td style=\"width:11%;border:0;border-right:1px solid #7f7f7f;border-radius:0;padding:7px 4px;white-space:nowrap;\" class=\"badge font-10 my-0 "+ctrbgColor+"\">"+ctr.toFixed(2)+"%</td>";
				htmlRet += "<td style=\"width:11%;border:0;padding:7px 4px;white-space:nowrap;\" class=\"badge font-10 my-0\">";
				htmlRet += "<a href=\"javascript:void(0)\" onClick=\"openCampaignModal('"+leadCampaign.campaignName+"')\" <i class=\"fa fa-eye fa-2x\"></a><br/>";
				htmlRet += "<span class=\"font-10 bold\">"+leadCampaign.campaignStatus+"</span>";
				htmlRet += "</td>";

				htmlRet +="</tr>";
				htmlRet +="</tbody>";
				htmlRet +="</table>";
			
			htmlRet +="</td>";
			
			if(!hideCounselorSection){
				htmlRet +="<td class=\"rounded-bottom-right-10\">";
				var sizeCounselor=(leadCampaign.assignNames.length);
				sizeCounselor="<b>"+sizeCounselor+"</b> "+(leadCampaign.assignNames.length>1?' Counselors':'Counselor')+" with <b>$"+(perLeadSmsSpent*parseInt(leadCampaign.totalLead)).toFixed(2)+"</b>";
				htmlRet +="<span>"+sizeCounselor+" </span>";
				htmlRet+="<span class=\"float-right\">Demo Booked: <b>"+leadCampaign.totalDemoLead+"</b> | Completed: <b>"+leadCampaign.totalDemoDone+"</b> | Enrolled: <b>"+leadCampaign.totalConverted+"</b></span>";
				htmlRet +="<div class=\"d-flex overflow-x-auto\" style=\"max-width:550px;\">";
				if(leadCampaign.assignNames.length>0){
					for (let s = 0; s < leadCampaign.assignNames.length; s++) {
						const assignNameobj = leadCampaign.assignNames[s];
						htmlRet +="<div class=\"border bg-white rounded-5 w-100 mr-2 recommended-teacher-thumb\" style=\"max-width:230px;min-width:230px;\" id=\"clone\" data-order=\"3\">";
						
						htmlRet +="<div class=\"card-body d-flex px-2 pt-2 align-items-center pb-0\">";
						htmlRet +="<span><img width=\"42\" class=\"avatar-icon\" src=\""+assignNameobj.profilePic+"\" alt=\"\" /></span>";
						htmlRet +="<div class=\"pl-1\"><div class=\"teacher-name font-weight-semi-bold font-size-md\"><a href=\"javascript:void(0)\" onclick=\"getListLeadCampaign('"+leadCampaign.campaignName+"','"+sr+"','"+assignNameobj.assignTo+"');\">"+assignNameobj.assignName+"</a></div>";
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
			}
			htmlRet +="</tr>";
			
			htmlRet +="<tr data-parent=\"#accordion\" id=\"collapseOne"+sr+"\" class=\"collapse campaign-tr-"+sr+"\"><td colspan=\""+(hideCounselorSection ? "4" : "9")+"\" >";
			htmlRet +="<table class=\"table\" id=\"leadListByCamp"+sr+"\" style=\"font-size:11px;min-width:450px\">";
			htmlRet +="<thead>";
			htmlRet +="<tr>";
			htmlRet +="<th style=\"5% !important\" class=\"text-center bg-primary text-white\">Sr no.</th>";
            htmlRet +="<th class=\"text-center bg-primary text-white\">Lead No.<br/>Student Name<br/>Grade</th>";
            htmlRet +="<th class=\"text-center bg-primary text-white\">Email<br/>Country<br/>Create Date Time</th>";
            // htmlRet +="<th class=\"text-center bg-primary text-white\">Parent's Name<br/>Phone No.</th>";
            htmlRet +="<th class=\"text-center bg-primary text-white\">Ad_set<br/>Ad_Name</th>";
            htmlRet +="<th class=\"text-center bg-primary text-white\">Counselor Name<br/>Lead Status</th>";
            // htmlRet +="<th class=\"text-center bg-primary text-white\">Demo Booked</th>";
            htmlRet +="<th class=\"text-center bg-primary text-white\">Last Remarks</th>";
			htmlRet +="</tr>";
			htmlRet +="</thead>";
			htmlRet +="<tbody class=\"campaign-td-"+sr+"\"></tbody>";
			htmlRet +="</table>";
			htmlRet +="</td></tr>";
			

			sr=sr+1;

		}

	}else{
			htmlRet +="<tr>";
			htmlRet +="<td colspan=\""+(hideCounselorSection ? "4" : "9")+"\" class=\"text-center\">No Record</td>";
			htmlRet +="</tr>";	

	}
	return htmlRet;
}

function getCampaignFooterTotal(data){


	var leadListCampaign=data.leadListCampaign;
	var htmlRet ="";
	var sr=1;
	var hideCounselorSection = $("#lead-campaign-list").data("hideCounselorSection") === "Y";
	var totalLeads=0;
	var totalActiveLeads=0;
	var totalInactiveLeads=0;
	var totalFBLeads=0;
	var totalFbSpend=0;

	var totalCpc = 0;
	var totalCtr = 0;

	var totalDemo=0;
	var totalDemoDone=0;
	var totalWebDemo=0;
	var totalCopyDemo=0;
	var totalConvert=0;

	if(leadListCampaign.length>0){
		for (let ind = 0; ind < leadListCampaign.length; ind++) {
			const leadCampaign = leadListCampaign[ind];
			totalLeads=totalLeads+ parseInt(leadCampaign.totalLead);
			totalActiveLeads=totalActiveLeads+ parseInt(leadCampaign.totalActiveLead);
			totalInactiveLeads=totalInactiveLeads+parseInt(leadCampaign.totalInactiveLead);
			totalFBLeads=totalFBLeads+parseInt(leadCampaign.totalFbLead);
			totalFbSpend=totalFbSpend+ parseFloat(leadCampaign.totalSpend);
			totalCpc=totalCpc+ parseFloat(leadCampaign.cpc);
			totalCtr=totalCtr+ parseFloat(leadCampaign.ctr);

			totalDemo=totalDemo+ parseInt(leadCampaign.totalDemoLead);
			totalDemoDone=totalDemoDone+ parseInt(leadCampaign.totalDemoDone);
			totalWebDemo=totalWebDemo+parseInt(leadCampaign.totalWebDemoLead);
			totalCopyDemo=totalCopyDemo+parseInt(leadCampaign.totalCopyDemoLead);
			totalConvert=totalConvert+ parseFloat(leadCampaign.totalConverted);
		}
		var spent = totalFbSpend.toFixed(2);
		var cpc = totalCpc.toFixed(2);
		var ctr = totalCtr.toFixed(2);
		var perLeadSmsSpent=spent/totalLeads;
		var perLeadFbSpent=spent/totalFBLeads;

		htmlRet +="<tr style=\"font-size:14px;background-color: #c9def3 !important;\">";
		htmlRet +="<th class=\"text-center\"></th>";
		htmlRet +="<th style=\"vertical-align: top !important;\" class=\"text-center\">Total</th>";
		htmlRet +="<th style=\"vertical-align: top !important;\" class=\"text-center\">$"+totalFbSpend.toFixed(2)+"</th>";//"+totalActiveLeads+" + "+totalInactiveLeads+" = "+totalLeads+" | "+totalFBLeads+"
		htmlRet +="<th style=\"vertical-align: top !important;\" class=\"text-center\">";
		// htmlRet +="<span>$"+cpc+"</span> | <span>"+ctr+"%</span>"
		htmlRet+="<span class=\"float-right\">"+totalActiveLeads+" + "+totalInactiveLeads+" = "+totalLeads+" | "+totalFBLeads+"</span>"
		htmlRet +="</th>";
		if(!hideCounselorSection){
			htmlRet +="<th style=\"vertical-align: top !important;\" class=\"text-center\">Demo Booked: <b>"+totalDemo+"</b> | By Website: <b>"+totalWebDemo+"</b> | By Link: <b>"+totalCopyDemo+"</b> | Demo Completed: <b>"+totalDemoDone+"</b> | Enrolled: <b>"+totalConvert+"</b></td>";
		}
		htmlRet +="</tr>";
	}
	return htmlRet;
}

function getListLeadCampaign(campaignName, eventid, assignTo){
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
	
	callLeadCampaignList($("#searchLeadCampaignType").val(), startDate, endDate,campaignName,eventid, assignTo);
}

function getLeadListCampaignWiseHtml(data){
	var leadListCampaign=data.leadListCampaign;
	var htmlRet ="";
	var sr=1;

	if(leadListCampaign.length>0){
		
		for (let ind = 0; ind < leadListCampaign.length; ind++) {
			const leadCampaign = leadListCampaign[ind];
			var bgLeadcolor = '';
			var totalLeadScore=parseFloat(leadCampaign.totalLeadScore);
			if(totalLeadScore>=80 && totalLeadScore<=100){
				bgLeadcolor = 'bg-success text-white';
			}else if(totalLeadScore>=60 && totalLeadScore<80){
				bgLeadcolor = 'bg-warning text-white';
			}else{
				bgLeadcolor = 'bg-danger text-white';
			}
			var urlSend = '/dashboard/lead-data-list?moduleId=111&leadId='+leadCampaign.leadno+'&leadFrom=LEAD&clickFrom=list&startDate=&endDate=&country=0&campaign=&currentPage=0&euid='+ENCRYPTED_USER_ID+'&leadType=B2C';
			//var totalLeadLink="clickLeadsLink('"+urlClick+"','', '','list','', '')";
//			<a href=\"javascript:void(0)\" onclick=\"getAsPost('"+urlSend+"');\">
			htmlRet +="<tr class="+(leadCampaign.activeStatus=='N'?'bg-warning':'')+">";
			htmlRet +="<td class=\"text-center\">"+(sr++)+"</td>";
			htmlRet +="<td style=\"vertical-align: top !important;\"><a href=\"javascript:void(0)\" onclick=\"getAsPost('"+urlSend+"');\">"+leadCampaign.leadno+"</a><br/><span class=\"child_name\">"+leadCampaign.childName+"</span><br/>"+leadCampaign.grade+"</td>";
			htmlRet +="<td style=\"vertical-align: top !important;\"><span class=\"child_email\">"+leadCampaign.email+"</span><br/>"+leadCampaign.country+"<br/>"+leadCampaign.assignDate+"</td>";
			htmlRet +="<td style=\"vertical-align: top !important;\">"+leadCampaign.fbAddSet+"<br/>"+leadCampaign.fbAdd+"</td>";
			htmlRet +="<td style=\"vertical-align: top !important;\">"+leadCampaign.assignName+"<br/>"+leadCampaign.leadStatus+"<br/><span class="+bgLeadcolor+">"+leadCampaign.totalLeadScore+"</span></td>";
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


async function callTotalCountLeads(formId, moduleId, leadFrom, clickFrom, currentPage, typeTheme, newTheme, callbadge, leadType, activeLead, totalfollowup, callFrom) {
    if (moduleId == '') {
        moduleId = $("#" + formId + " #leadFromSearchModuleId").val();
    }
    if (clickFrom == '') {
        clickFrom = $("#" + formId + " #clickFromSearch").val();
    }
    if (currentPage == '') {
        currentPage = $("#" + formId + " #currentPageSearch").val();
    }

    const payload = getCallRequestForAdvanceLeadSearchStudent(formId, moduleId, leadFrom, clickFrom, currentPage, typeTheme, newTheme, callbadge, leadType, activeLead);

    try {
        const data = await getDashboardDataBasedUrlAndPayload(false, false, 'get-total-lead', payload);

        customLoader(false);

        if (data.status === '0' || data.status === '2') {
            showMessage(true, data.message);
        } else {
            if (leadType === 'B2B') {
                if (callFrom === 'new-lead') {
                    getTotalB2BLeads(data);
                } else {
                    const htmlt = getB2BLeadTotalCount(data, moduleId);
                    $("#b2b-total-head").html(htmlt);
                    $("#b2bLeadCount").html(htmlt);
                }
            } else if (leadType === 'B2C') {
                if (callFrom === 'new-lead') {
                    getTotalB2CLeads(data);
                } else {
                    const htmlt = getLeadTotalCountList(data, moduleId, totalfollowup, callFrom);
                    const htmhot = getLeadTotalHotCountList(data, moduleId, callFrom);

                    if (activeLead === 'Y') {
                        $("#total-lead-active-tr").html(htmlt);
                        $("#total-active-hotlead").html(htmhot);
                    } else {
                        $("#total-lead-inactive-tr").html(htmlt);
                        $("#total-inactive-hotlead").html(htmhot);
                    }
                }
            } else {
                const htmlt = getB2BLeadTotalCount(data, moduleId);
                $("#b2bLeadCount").html(htmlt);
            }
        }
    } catch (err) {
        console.error("Error in callTotalCountLeads:", err);
        showMessage(true, "Something went wrong while fetching lead counts.");
    }
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

async function getLeadStatusLog(leadno, callFrom, adminStatus) {
    try {
        var request = {
            leadno: leadno,
            adminStatus: adminStatus,
            leadsFollowCount: $("#leadsFollowCount").val()
        };
        var data = await getDashboardDataBasedUrlAndPayloadWithParentUrl(false, false, 'lead-status-log', request, 'api/v1/leads');

        if (!data) return;

        var leadTagging = "<b>" + data.leadTagging + "</b>";
        $(".leadtagstatus_" + leadno).html(leadTagging);

        if (data.status === '0' || data.status === '2') {
            // showMessageTheme2(0, data.message, '', true);
            return;
        }

        var html = '';

        if (callFrom === 'new-lead') {
            var incS = 1;
            for (var l = 0; l < data.data.length; l++) {
                var leadCall = data.data[l];
				
				//console.log(leadCall);

                html += '<li class="' + (l === 0 ? 'follow-up-accordian-active' : '') + '">'
                    + '<span class="cursor follow-up-no text-primary p-2 text-center border-primary full bold">'
                    + '<label class="float-left">' + (incS++) + '</label> ' + (leadCall.leadStatus)
                    + '<br/><span style="font-size:10px">' + (leadCall.statusDate) + '</span>'
                    + ' <i class="fa ' + (l === 0 ? 'fa-angle-up' : 'fa-angle-down') + ' float-right" style="line-height: 20px;"></i></span>'
                    + '<div class="follow-up-content text-center" style="' + (l === 0 ? 'display: block' : '') + '">'
                        + '<div class="dropdown d-inline-block text-center my-2" style="position: inherit;">'
                            + '<button type="button" aria-haspopup="true" aria-expanded="false" data-toggle="dropdown" class="dropdown-toggle btn btn-sm btn-primary">View Follow Up</button>'
                            + '<div tabindex="-1" role="menu" aria-hidden="true" class="dropdown-menu-md dropdown-menu p-2" x-placement="bottom-start" style="position: absolute; transform: translate3d(0px, 32px, 0px); font-size:11px;">'
                                + '<table class="w-100">'
                                    + '<tr><th class="p-1 border-0">Last Followup Date:</th><td class="p-1 border-0" id="connectedTh">' + (leadCall.statusDate) + '</td></tr>'
                                    + '<tr><th class="p-1 border-0">Connected Through:</th><td class="p-1 border-0" id="connectedTh">' + (leadCall.leadFollowup) + '</td></tr>'
                                    + '<tr><th class="p-1 border-0">Connected With:</th><td class="p-1 border-0" id="connectWith">' + (leadCall.tocall) + '</td></tr>'
                                    + '<tr><th class="p-1 border-0">Next Follow-up:</th><td class="p-1 border-0" id="nextFollowStatus">'
                                        + (leadCall.callStatus !== '' ? leadCall.callStatus : '')
                                        + (leadCall.nextCallDate !== '' ? leadCall.nextCallDate : '')
                                    + '</td></tr>'
									+ '<tr><th class="p-1 border-0">Follow by:</th><td class="p-1 border-0" id="rFollowby">' + (leadCall.followupByName) + '</td></tr>'
                                    + '<tr><th class="p-1 border-0">Remarks:</th><td class="p-1 border-0 text-justify" id="callRemark" style="max-width: 250px;">'
                                        + (leadCall.remarks !== '' ? leadCall.remarks : 'N/A') + '</td></tr>'
                                + '</table>'
                            + '</div>'
                        + '</div>'
                    + '</div>'
                + '</li>';
            }
            $(".followup-remark-" + leadno).html(html);

            $(".follow-up-no").off("click").on("click", function () {
                $(this).find(".fa-angle-down").toggleClass('fa-angle-down fa-angle-up');
                $(this).parent().siblings().find(".fa-angle-up").toggleClass('fa-angle-up fa-angle-down');
                $(this).parent().find(".follow-up-content").slideDown();
                $(this).parent().siblings().find(".follow-up-content").slideUp();
                $(this).parent().addClass("follow-up-accordian-active");
                $(this).parent().siblings().removeClass("follow-up-accordian-active");
            });

        } else {
            var brtg = 1;
            html += '<div style="height:100px;overflow-y:auto">';
            for (var i = 0; i < data.data.length; i++) {
                if (brtg > 3) {
                    html += '<br/>';
                    brtg = 1;
                }
                html += '<span style="font-size:12px;" data-toggle="tooltip" data-placement="top">'
                    + '<div class="d-inline-block">'
                        + '<p class="m-0 text-dark"><i class="fa fa-check-circle" style="color:green;"></i><b>' + data.data[i].leadStatus + '</b></p>'
                        + '<p class="m-0 text-dark" style="padding-left:12px">' + data.data[i].statusDate + '</p>'
                    + '</div>'
                + '</span>&nbsp;&nbsp;';
                brtg++;
            }
            html += '</div>';
            $(".leadstatus_" + leadno).html(html);
        }
    } catch (error) {
        console.error("Error in getLeadStatusLog:", error);
    }
}


function callB2CDashboardLead(moduleId,leadType) {
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
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
		contentType: APPLICATION_JSON_VALUE,
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
		}
	});
}

function callUTMSourceList(formId, value, elementId, keyStatus) {
	$.ajax({
		type: "POST",
		contentType: APPLICATION_JSON_VALUE,
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
		}
	});
}

function getRequestForLeadAssign(formId, key, value,  discardPermission,  requestExtra, schoolId) {
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
  if(schoolId){
  authentication["schoolId"] = schoolId;
  }else{
	  authentication["schoolId"] = SCHOOL_ID;
  }
  authentication["schoolUUID"] = SCHOOL_UUID;
  authentication["userType"] = "COMMON";
  request["authentication"] = authentication;
  request["requestData"] = requestData;
  return request;
}

async function callLeadAssignUserList(formId, value, elementId, keyStatus, discardPermission, userId, selectStatus, schoolId) {
    hideMessageTheme2('');
    customLoader(false);
	
    const payload = getRequestForLeadAssign(formId, 'LEAD-ASSIGN-USER-LIST', value, discardPermission, userId, schoolId);

    try {
        const data = await getDashboardDataBasedUrlAndPayloadWithParentUrl(true, true, 'masters', payload, 'api/v1/common');

        if (data.status === '0' || data.status === '2') {
            showMessageTheme2(true, data.message);
            return null;
        }

        const result = data.mastersData.data;
        const $dropdown = $("#" + formId + " #" + elementId);
        $dropdown.html('');
        $dropdown.append('<option value="0">Select Assign</option>');

        $.each(result, function(k, v) {
            if (keyStatus) {
                if (discardPermission) {
                    $dropdown.append(`<option value="${v.key}">${v.value} - (${v.extra})</option>`);
                } else {
                    if (selectStatus) {
                        $dropdown.append(`<option value="${v.key}" ${v.key == userId ? 'selected' : ''}>${v.value} - (${v.extra})</option>`);
                    } else {
                        $dropdown.append(`<option value="${v.key}">${v.value} - (${v.extra})</option>`);
                    }
                }
            } else {
                $dropdown.append(`<option value="${v.value}">${v.value}</option>`);
            }
        });

        return result;
    } catch (err) {
        console.error("Error occurred:", err);
        throw err;
    }
}




function callLeadCounselorsList(formId, modeSearch, startDate, endDate, elementId, sublistStatus, countryId, campaignId ) {
	if(sublistStatus){
		customLoader(false)
	}
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLForHTML('dashboard', 'get-lead-list-counselor'),
		data : JSON.stringify(getRequestForCounselorLead(formId, modeSearch,startDate, endDate, sublistStatus, countryId, campaignId)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			//console.log(data);
			$("#leadReportSearch").modal('hide');
			if (data['status'] == '0' || data['status'] == '2') {
				showMessageTheme2(0, data['message']);
			} else {
				var counselorReportType = $("#searchLeadCounselorReportType").val();
				var leadListCounselor=data.leadListCounselor;
				if(leadListCounselor.length>0){
					var httmlTop = getLeadCounselorHtml(data, startDate, endDate, counselorReportType, sublistStatus, countryId, campaignId);
					$("#"+elementId).html(httmlTop);
					if(!sublistStatus){
						$("#counselor-list-footer").removeClass("d-none");
						var httmlFoot = "";
						$("#advanceSearchAndExport12").removeClass('hidden');
						$("#listCounselorTheader").removeClass('hidden');
						$("#zadarmaCallSync").addClass('hidden');
						httmlFoot += getLeadCounselorFootHtml(data, false);
						getLeadCounselorFootHtml(data, true);
						$("#listCounselorTfoot").html(httmlFoot);
					}else{
						var foots = elementId.split("-")[1];
						var httmlFoot = "";
						$("#advanceSearchAndExport12").removeClass('hidden');
						$("#listCounselorTheader").removeClass('hidden');
						httmlFoot += getLeadCounselorFootHtml(data, false);
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
	var urlSend = '/dashboard/lead-data-list?moduleId='+moduleId+'&leadId=0&leadFrom=LEAD&clickFrom='+leadFrom+'&startDate=&endDate=&country=0&campaign=&currentPage=0&euid='+ENCRYPTED_USER_ID;
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
			if(leadCounselor.totalLead!=0){
				var totalDivide=(leadCounselor.enrollment/leadCounselor.totalLead)*100;
				totalDivide=totalDivide.toFixed(2);
			}else{
				totalDivide=0;
			}
			

			var urlClick="/dashboard/lead-data-list?moduleId=" + moduleId +"&leadId=0&leadFrom=LEAD&currentPage=0&euid=" +ENCRYPTED_USER_ID + "&leadType=B2C";
			
			var totalLeadLink="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','list-"+assignTo+"','"+countryId+"', '"+campaignId+"')";
			var uniqueLeadLink="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','unique-"+assignTo+"','"+countryId+"', '"+campaignId+"')";
			var duplicateLeadLink="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','duplicate-"+assignTo+"','"+countryId+"', '"+campaignId+"')";
			var facebookleadLink="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','facebooklead-"+assignTo+"','"+countryId+"', '"+campaignId+"')";
			var FbleadLink="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','fblead-"+assignTo+"','"+countryId+"', '"+campaignId+"')";
			var igleadLink="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','iglead-"+assignTo+"','"+countryId+"', '"+campaignId+"')";

			var unattendedLink="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','unattendedLead-"+assignTo+"','"+countryId+"', '"+campaignId+"')";
			
			var demoLeadLink="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','demoLead-"+assignTo+"-demo','"+countryId+"', '"+campaignId+"')";
			var demoLeadDoneLink="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','demodone-"+assignTo+"-demo','"+countryId+"', '"+campaignId+"')";
			var demoLeadPendingLink="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','demoPending-"+assignTo+"-demo','"+countryId+"', '"+campaignId+"')";
			var demoLeadCancelLink="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','demoCancel-"+assignTo+"-demo','"+countryId+"', '"+campaignId+"')";
			var demoLeadInterestLink="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','demoInterested-"+assignTo+"-demo','"+countryId+"', '"+campaignId+"')";
			var demoLeadNotIntrestedLink="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','demoNotInterested-"+assignTo+"-demo','"+countryId+"', '"+campaignId+"')";
			var demoLeadRescheduleLink="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','demoReschedule-"+assignTo+"-demo','"+countryId+"', '"+campaignId+"')";
			var demoLeadNotShowLink="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','demoNotShow-"+assignTo+"-demo','"+countryId+"', '"+campaignId+"')";
			var demoLeadNotConfirm="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','demoNotConfirm-"+assignTo+"-demo','"+countryId+"', '"+campaignId+"')";
			var demoLeadWebsiteLink="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','totalWebsiteDemo-"+assignTo+"-demo','"+countryId+"', '"+campaignId+"')";
			var demoLeadCopyLink="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','totalCopyUrlDemo-"+assignTo+"-demo','"+countryId+"', '"+campaignId+"')";

			var bookDemoLeadLink="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','demoLead-"+assignTo+"-book','"+countryId+"', '"+campaignId+"')";
			var bookDemoLeadDoneLink="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','demodone-"+assignTo+"-book','"+countryId+"', '"+campaignId+"')";
			var bookDemoLeadPendingLink="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','demoPending-"+assignTo+"-book','"+countryId+"', '"+campaignId+"')";
			var bookDemoLeadCancelLink="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','demoCancel-"+assignTo+"-book','"+countryId+"', '"+campaignId+"')";
			var bookDemoLeadInterestLink="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','demoInterested-"+assignTo+"-book','"+countryId+"', '"+campaignId+"')";
			var bookDemoLeadNotIntrestedLink="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','demoNotInterested-"+assignTo+"-book','"+countryId+"', '"+campaignId+"')";
			var bookDemoLeadRescheduleLink="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','demoReschedule-"+assignTo+"-book','"+countryId+"', '"+campaignId+"')";
			var bookDemoLeadNotShowLink="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','demoNotShow-"+assignTo+"-book','"+countryId+"', '"+campaignId+"')";
			var bookDemoLeadNotConfirm="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','demoNotConfirm-"+assignTo+"-book','"+countryId+"', '"+campaignId+"')";
			var bookDemoLeadWebsiteLink="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','totalWebsiteDemo-"+assignTo+"-book','"+countryId+"', '"+campaignId+"')";
			var bookDemoLeadCopyLink="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','totalCopyUrlDemo-"+assignTo+"-book','"+countryId+"', '"+campaignId+"')";


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
				
				demoLeadLink="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','demoLead-"+assignTo+"-demo','"+countryId+"', '"+campaignId+"')";
				demoLeadDoneLink="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','demodone-"+assignTo+"-demo','"+countryId+"', '"+campaignId+"')";
				demoLeadPendingLink="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','demoPending-"+assignTo+"-demo','"+countryId+"', '"+campaignId+"')";
				demoLeadCancelLink="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','demoCancel-"+assignTo+"-demo','"+countryId+"', '"+campaignId+"')";
				demoLeadInterestLink="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','demoInterested-"+assignTo+"-demo','"+countryId+"', '"+campaignId+"')";
				demoLeadNotIntrestedLink="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','demoNotInterested-"+assignTo+"-demo','"+countryId+"', '"+campaignId+"')";
				demoLeadRescheduleLink="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','demoReschedule-"+assignTo+"-demo','"+countryId+"', '"+campaignId+"')";
				demoLeadNotShowLink="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','demoNotShow-"+assignTo+"-demo','"+countryId+"', '"+campaignId+"')";
				demoLeadNotConfirm="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','demoNotConfirm-"+assignTo+"-demo','"+countryId+"', '"+campaignId+"')";
				demoLeadWebsiteLink="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','totalWebsiteDemo-"+assignTo+"-demo','"+countryId+"', '"+campaignId+"')";
				demoLeadCopyLink="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','totalCopyUrlDemo-"+assignTo+"-demo','"+countryId+"', '"+campaignId+"')";


				bookDemoLeadLink="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','demoLead-"+assignTo+"-book','"+countryId+"', '"+campaignId+"')";
				bookDemoLeadDoneLink="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','demodone-"+assignTo+"-book','"+countryId+"', '"+campaignId+"')";
				bookDemoLeadPendingLink="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','demoPending-"+assignTo+"-book','"+countryId+"', '"+campaignId+"')";
				bookDemoLeadCancelLink="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','demoCancel-"+assignTo+"-book','"+countryId+"', '"+campaignId+"')";
				bookDemoLeadInterestLink="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','demoInterested-"+assignTo+"-book','"+countryId+"', '"+campaignId+"')";
				bookDemoLeadNotIntrestedLink="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','demoNotInterested-"+assignTo+"-book','"+countryId+"', '"+campaignId+"')";
				bookDemoLeadRescheduleLink="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','demoReschedule-"+assignTo+"-book','"+countryId+"', '"+campaignId+"')";
				bookDemoLeadNotShowLink="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','demoNotShow-"+assignTo+"-book','"+countryId+"', '"+campaignId+"')";
				bookDemoLeadNotConfirm="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','demoNotConfirm-"+assignTo+"-book','"+countryId+"', '"+campaignId+"')";
				bookDemoLeadWebsiteLink="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','totalWebsiteDemo-"+assignTo+"-book','"+countryId+"', '"+campaignId+"')";
				bookDemoLeadCopyLink="clickLeadsLink('"+urlClick+"','"+startDate+"', '"+endDate+"','totalCopyUrlDemo-"+assignTo+"-book','"+countryId+"', '"+campaignId+"')";


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
				}else{
					var uniqLead=(leadCounselor.totalLead-leadCounselor.duplicateLeadCount);
					htmlRet +="<td style=\"vertical-align: top !important;background-color:#3f6ad8 !important;color:#fff;\" class=\"\"> ";
					htmlRet +="<div class='d-flex align-items-center'>"
						htmlRet +="<span class='d-flex'><a href=\"javascript:void(0);\" class=\"text-white\" onclick=\""+totalLeadLink+"\">"+leadCounselor.totalLead+"</a></span>"
						htmlRet +="<span class='d-inline-flex ml-auto'><a href=\"javascript:void(0);\" class=\"text-white\" onclick=\""+uniqueLeadLink+"\">"+(uniqLead>0?uniqLead:0) +"</a> | <a href=\"javascript:void(0);\" class=\"text-white\" onclick=\""+duplicateLeadLink+"\">"+leadCounselor.duplicateLeadCount+"</a></span>"
					+"</div></td>"
				}
			}
			htmlRet +="<td style=\"vertical-align: top !important;\" class=\"text-center\">";
			htmlRet +="<div class='d-flex align-items-center'>"
			htmlRet +="<span class='d-flex'><a href=\"javascript:void(0);\"  onclick=\""+facebookleadLink+"\">"+leadCounselor.totalFbLead+"</a></span>"
			htmlRet +="<span class='d-inline-flex ml-auto'><a href=\"javascript:void(0);\"  onclick=\""+FbleadLink+"\">"+leadCounselor.fb_total +"</a> | <a href=\"javascript:void(0);\"  onclick=\""+igleadLink+"\">"+leadCounselor.ig_total+"</a></span>"
			htmlRet +="</div></td>";
			htmlRet +="<td style=\"vertical-align: top !important;\" class=\"text-center\"><a href=\"javascript:void(0);\" onclick=\""+unattendedLink+"\">"+leadCounselor.unattended+"</a></td>";
			htmlRet +="<td style=\"vertical-align: top !important;background-color:#f3f39e !important;color:#343a40;\" class=\"text-center\">";
			htmlRet +="<table class=\"w-100 table mb-0 bg-transparent\">";
			htmlRet +="<tbody>";


				// ---------- SH row ----------
				htmlRet += "<tr style=\"background-color: #e9d45a;\">";
				htmlRet += "<td style=\"width:9%;border:0;border-right:1px solid;border-radius:0;\" class=\"badge font-10 my-0\">";
				htmlRet += "<span style=\"margin-right: 30px;\">S</span><a href=\"javascript:void(0);\" onclick=\"" + demoLeadLink + "\">" + leadCounselor.totalDemo + "</a></td>";
				htmlRet += "<td style=\"width:9%;border:0;border-right:1px solid;border-radius:0;\" class=\"badge font-10 my-0\">";
				htmlRet += "<a href=\"javascript:void(0);\" onclick=\"" + demoLeadWebsiteLink + "\">" + leadCounselor.totalWebDemo + "</a></td>";
				htmlRet += "<td style=\"width:9%;border:0;border-right:1px solid;border-radius:0;\" class=\"badge font-10 my-0\">";
				htmlRet += "<a href=\"javascript:void(0);\" onclick=\"" + demoLeadCopyLink + "\">" + leadCounselor.totalLinkDemo + "</a></td>";
				htmlRet += "<td style=\"width:9%;border:0;border-right:1px solid;border-radius:0;\" class=\"badge font-10 my-0\">";
				htmlRet += "<a href=\"javascript:void(0);\" onclick=\"" + demoLeadDoneLink + "\">" + leadCounselor.totalDemoDone + "</a></td>";
				htmlRet += "<td style=\"width:9%;border:0;border-right:1px solid;border-radius:0;\" class=\"badge font-10 my-0\">";
				htmlRet += "<a href=\"javascript:void(0);\" onclick=\"" + demoLeadInterestLink + "\">" + leadCounselor.totalDemoInterested + "</a></td>";
				htmlRet += "<td style=\"width:9%;border:0;border-right:1px solid;border-radius:0;\" class=\"badge font-10 my-0\">";
				htmlRet += "<a href=\"javascript:void(0);\" onclick=\"" + demoLeadNotConfirm + "\">" + leadCounselor.totalDemoNotConfirm + "</a></td>";
				htmlRet += "<td style=\"width:9%;border:0;border-right:1px solid;border-radius:0;\" class=\"badge font-10 my-0\">";
				htmlRet += "<a href=\"javascript:void(0);\" onclick=\"" + demoLeadRescheduleLink + "\">" + leadCounselor.totalDemoReschedule + "</a></td>";
				htmlRet += "<td style=\"width:9%;border:0;border-right:1px solid;border-radius:0;\" class=\"badge font-10 my-0\">";
				htmlRet += "<a href=\"javascript:void(0);\" onclick=\"" + demoLeadNotShowLink + "\">" + leadCounselor.totalDemoNotShow + "</a></td>";
				htmlRet += "<td style=\"width:9%;border:0;border-right:1px solid;border-radius:0;\" class=\"badge font-10 my-0\">";
				htmlRet += "<a href=\"javascript:void(0);\" onclick=\"" + demoLeadCancelLink + "\">" + leadCounselor.totalDemoCancel + "</a></td>";
				htmlRet += "<td style=\"width:9%;border:0;border-right:1px solid;border-radius:0;\" class=\"badge font-10 my-0\">";
				htmlRet += "<a href=\"javascript:void(0);\" onclick=\"" + demoLeadNotIntrestedLink + "\">" + leadCounselor.totalDemoNotInterested + "</a></td>";
				htmlRet += "<td style=\"width:9%;border:0;border-radius:0;\" class=\"badge font-10 my-0\">";
				htmlRet += "<a href=\"javascript:void(0);\" onclick=\"" + demoLeadPendingLink + "\">" + leadCounselor.totalDemoPending + "</a></td>";
				htmlRet += "</tr>";

				// ---------- BK row ----------
				htmlRet += "<tr style=\"border-top: 1px solid #000;\">";
				htmlRet += "<td style=\"width:9%;border:0;border-right:1px solid;border-radius:0;\" class=\"badge font-10 my-0\">";
				htmlRet += "<span style=\"margin-right: 30px;\">B</span><a href=\"javascript:void(0);\" onclick=\"" + bookDemoLeadLink + "\">" + leadCounselor.totalBookDemo + "</a></td>";
				htmlRet += "<td style=\"width:9%;border:0;border-right:1px solid;border-radius:0;\" class=\"badge font-10 my-0\">";
				htmlRet += "<a href=\"javascript:void(0);\" onclick=\"" + bookDemoLeadWebsiteLink + "\">" + leadCounselor.totalBookWebDemo + "</a></td>";
				htmlRet += "<td style=\"width:9%;border:0;border-right:1px solid;border-radius:0;\" class=\"badge font-10 my-0\">";
				htmlRet += "<a href=\"javascript:void(0);\" onclick=\"" + bookDemoLeadCopyLink + "\">" + leadCounselor.totalBookLinkDemo + "</a></td>";
				htmlRet += "<td style=\"width:9%;border:0;border-right:1px solid;border-radius:0;\" class=\"badge font-10 my-0\">";
				htmlRet += "<a href=\"javascript:void(0);\" onclick=\"" + bookDemoLeadDoneLink + "\">" + leadCounselor.totalBookDemoDone + "</a></td>";
				htmlRet += "<td style=\"width:9%;border:0;border-right:1px solid;border-radius:0;\" class=\"badge font-10 my-0\">";
				htmlRet += "<a href=\"javascript:void(0);\" onclick=\"" + bookDemoLeadInterestLink + "\">" + leadCounselor.totalBookDemoInterested + "</a></td>";
				htmlRet += "<td style=\"width:9%;border:0;border-right:1px solid;border-radius:0;\" class=\"badge font-10 my-0\">";
				htmlRet += "<a href=\"javascript:void(0);\" onclick=\"" + bookDemoLeadNotConfirm + "\">" + leadCounselor.totalBookDemoNotConfirm + "</a></td>";
				htmlRet += "<td style=\"width:9%;border:0;border-right:1px solid;border-radius:0;\" class=\"badge font-10 my-0\">";
				htmlRet += "<a href=\"javascript:void(0);\" onclick=\"" + bookDemoLeadRescheduleLink + "\">" + leadCounselor.totalBookDemoReschedule + "</a></td>";
				htmlRet += "<td style=\"width:9%;border:0;border-right:1px solid;border-radius:0;\" class=\"badge font-10 my-0\">";
				htmlRet += "<a href=\"javascript:void(0);\" onclick=\"" + bookDemoLeadNotShowLink + "\">" + leadCounselor.totalBookDemoNotShow + "</a></td>";
				htmlRet += "<td style=\"width:9%;border:0;border-right:1px solid;border-radius:0;\" class=\"badge font-10 my-0\">";
				htmlRet += "<a href=\"javascript:void(0);\" onclick=\"" + bookDemoLeadCancelLink + "\">" + leadCounselor.totalBookDemoCancel + "</a></td>";
				htmlRet += "<td style=\"width:9%;border:0;border-right:1px solid;border-radius:0;\" class=\"badge font-10 my-0\">";
				htmlRet += "<a href=\"javascript:void(0);\" onclick=\"" + bookDemoLeadNotIntrestedLink + "\">" + leadCounselor.totalBookDemoNotInterested + "</a></td>";
				htmlRet += "<td style=\"width:9%;border:0;border-radius:0;\" class=\"badge font-10 my-0\">";
				htmlRet += "<a href=\"javascript:void(0);\" onclick=\"" + bookDemoLeadPendingLink + "\">" + leadCounselor.totalBookDemoPending + "</a></td>";
				htmlRet += "</tr>";

				
				
				htmlRet +="</tbody>"
				htmlRet +="</table>";
				htmlRet +="</td>";
				htmlRet +="<td style=\"vertical-align: top !important;\" class=\"text-center\"><span class=\"text-center mx-1 font-10 font-weight-bold\"><a href=\"javascript:void(0);\" class=\"text-success\" onclick=\""+hotLink+"\">"+leadCounselor.totalHot+"</a></span> | <span class=\"text-center mx-1 font-10 font-weight-bold\"><a href=\"javascript:void(0);\" class=\"text-warning\" onclick=\""+warmLink+"\">"+leadCounselor.totalWarm+"</a></span> | <span class=\"text-center mx-1 font-10 font-weight-bold\"><a href=\"javascript:void(0);\" class=\"text-primary\" onclick=\""+coldLink+"\">"+leadCounselor.totalCold+"</a></span></td>";
				htmlRet +="<td style=\"vertical-align: top !important;background-color:#efd597;\" class=\"text-center\"><a href=\"javascript:void(0);\" onclick=\""+positiveLink+"\">"+leadCounselor.positiveEnroll+"</a></td>";
				htmlRet +="<td style=\"vertical-align: top !important;\" class=\"text-center\"><a href=\"javascript:void(0);\" onclick=\""+bookseatLink+"\">"+leadCounselor.reserved+"</a></td>";
				htmlRet +="<td style=\"vertical-align: top !important;background-color:#c4d38a;\" class=\"text-center\"><a href=\"javascript:void(0);\" onclick=\""+convertLink+"\">"+leadCounselor.enrollment+"</a></td>";
				htmlRet +="<td style=\"vertical-align: top !important;background-color:#e7f1c2;\" class=\"text-center\">"+totalDivide+"%</td>";
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

	var totalWebDemo=0;
	var totalLinkDemo=0;
	var totalDemo=0;
	var totalDemoDone=0;
	var totalDemoPending=0;
	var totalDemoCancel=0;
	var totalDemoInterested=0;
	var totalDemoNotInterested=0;
	var totalDemoNotShow=0;
	var totalDemoReschedule=0;
	var totalDemoNotConfirm=0;

	var totalBookWebDemo=0;
	var totalBookLinkDemo=0;
	var totalBookDemo=0;
	var totalBookDemoDone=0;
	var totalBookDemoPending=0;
	var totalBookDemoCancel=0;
	var totalBookDemoInterested=0;
	var totalBookDemoNotInterested=0;
	var totalBookDemoNotShow=0;
	var totalBookDemoReschedule=0;
	var totalBookDemoNotConfirm=0;

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

			totalWebDemo+=leadCounselor.totalWebDemo;
			totalLinkDemo+=leadCounselor.totalLinkDemo;
			totalDemo+=leadCounselor.totalDemo;
			totalDemoDone+=leadCounselor.totalDemoDone;
			totalDemoPending+=leadCounselor.totalDemoPending;
			totalDemoCancel+=leadCounselor.totalDemoCancel;
			totalDemoReschedule+=leadCounselor.totalDemoReschedule;
			totalDemoInterested+=leadCounselor.totalDemoInterested;
			totalDemoNotInterested+=leadCounselor.totalDemoNotInterested;
			totalDemoNotShow+=leadCounselor.totalDemoNotShow;
			totalDemoNotConfirm+=leadCounselor.totalDemoNotConfirm;

			totalBookWebDemo+=leadCounselor.totalBookWebDemo;
			totalBookLinkDemo+=leadCounselor.totalBookLinkDemo;
			totalBookDemo+=leadCounselor.totalBookDemo;
			totalBookDemoDone+=leadCounselor.totalBookDemoDone;
			totalBookDemoPending+=leadCounselor.totalBookDemoPending;
			totalBookDemoCancel+=leadCounselor.totalBookDemoCancel;
			totalBookDemoReschedule+=leadCounselor.totalBookDemoReschedule;
			totalBookDemoInterested+=leadCounselor.totalBookDemoInterested;
			totalBookDemoNotInterested+=leadCounselor.totalBookDemoNotInterested;
			totalBookDemoNotShow+=leadCounselor.totalBookDemoNotShow;
			totalBookDemoNotConfirm+=leadCounselor.totalBookDemoNotConfirm;

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
	var totalDivide=0;
	if(totalLeads!=0){
		var totalDivide=(enrollment/totalLeads)*100;
		totalDivide=totalDivide.toFixed(2);
	}else{
		totalDivide=0;
	}
	htmlRet +="<th class=\"text-center\"></th>";
	htmlRet +="<th style=\"vertical-align: bottom !important;\" class=\"text-center\">Total</th>";
	htmlRet +="<th style=\"vertical-align: bottom !important;\" class=\"\"><span class=\"text-left\">"+totalLeads+"</span>  <span class=\"float-right\">"+(uniqLead>0?uniqLead:0) +"  |  "+duplicateLeadCount+"</span></th>";
	htmlRet +="<th style=\"vertical-align: bottom !important;\" class=\"text-center\"><span class=\"text-left\">"+totalFbLeads+"</span>  <span class=\"float-right\">"+fbtotal +"  |  "+igtotal+"</span></td>";
	htmlRet +="<th style=\"vertical-align: bottom !important;\" class=\"text-center\">"+unattended+"</td>";
	htmlRet +="<th style=\"vertical-align: bottom !important;\" class=\"text-center\">";
	htmlRet +="<table class=\"table w-100 mb-0 bg-transparent\">";
	htmlRet +="<tbody>";

	// 🔹 Scheduled (Sh) Row
	htmlRet += "<tr>";
	htmlRet += "<td style=\"width:9%;border:0;border-right:1px solid;border-radius:0;\" class=\"badge font-10 my-0\"><span style=\"margin-right: 30px;\">S</span>" + totalDemo + "</td>";
	htmlRet += "<td style=\"width:9%;border:0;border-right:1px solid;border-radius:0;\" class=\"badge font-10 my-0\">" + totalWebDemo + "</td>";
	htmlRet += "<td style=\"width:9%;border:0;border-right:1px solid;border-radius:0;\" class=\"badge font-10 my-0\">" + totalLinkDemo + "</td>";
	htmlRet += "<td style=\"width:9%;border:0;border-right:1px solid;border-radius:0;\" class=\"badge font-10 my-0\">" + totalDemoDone + "</td>";
	htmlRet += "<td style=\"width:9%;border:0;border-right:1px solid;border-radius:0;\" class=\"badge font-10 my-0\">" + totalDemoInterested + "</td>";
	htmlRet += "<td style=\"width:9%;border:0;border-right:1px solid;border-radius:0;\" class=\"badge font-10 my-0\">" + totalDemoNotConfirm + "</td>";
	htmlRet += "<td style=\"width:9%;border:0;border-right:1px solid;border-radius:0;\" class=\"badge font-10 my-0\">" + totalDemoReschedule + "</td>";
	htmlRet += "<td style=\"width:9%;border:0;border-right:1px solid;border-radius:0;\" class=\"badge font-10 my-0\">" + totalDemoNotShow + "</td>";
	htmlRet += "<td style=\"width:9%;border:0;border-right:1px solid;border-radius:0;\" class=\"badge font-10 my-0\">" + totalDemoCancel + "</td>";
	htmlRet += "<td style=\"width:9%;border:0;border-right:1px solid;border-radius:0;\" class=\"badge font-10 my-0\">" + totalDemoNotInterested + "</td>";
	htmlRet += "<td style=\"width:9%;border:0;border-radius:0;\" class=\"badge font-10 my-0\">" + totalDemoPending + "</td>";
	htmlRet += "</tr>";

	// 🔹 Booked (Bk) Row
	htmlRet += "<tr style=\"border-top: 1px solid #000\">";
	htmlRet += "<td style=\"width:9%;border:0;border-right:1px solid;border-radius:0;\" class=\"badge font-10 my-0\"><span style=\"margin-right: 30px;\">B</span>" + totalBookDemo + "</td>";
	htmlRet += "<td style=\"width:9%;border:0;border-right:1px solid;border-radius:0;\" class=\"badge font-10 my-0\">" + totalBookWebDemo + "</td>";
	htmlRet += "<td style=\"width:9%;border:0;border-right:1px solid;border-radius:0;\" class=\"badge font-10 my-0\">" + totalBookLinkDemo + "</td>";
	htmlRet += "<td style=\"width:9%;border:0;border-right:1px solid;border-radius:0;\" class=\"badge font-10 my-0\">" + totalBookDemoDone + "</td>";
	htmlRet += "<td style=\"width:9%;border:0;border-right:1px solid;border-radius:0;\" class=\"badge font-10 my-0\">" + totalBookDemoInterested + "</td>";
	htmlRet += "<td style=\"width:9%;border:0;border-right:1px solid;border-radius:0;\" class=\"badge font-10 my-0\">" + totalBookDemoNotConfirm + "</td>";
	htmlRet += "<td style=\"width:9%;border:0;border-right:1px solid;border-radius:0;\" class=\"badge font-10 my-0\">" + totalBookDemoReschedule + "</td>";
	htmlRet += "<td style=\"width:9%;border:0;border-right:1px solid;border-radius:0;\" class=\"badge font-10 my-0\">" + totalBookDemoNotShow + "</td>";
	htmlRet += "<td style=\"width:9%;border:0;border-right:1px solid;border-radius:0;\" class=\"badge font-10 my-0\">" + totalBookDemoCancel + "</td>";
	htmlRet += "<td style=\"width:9%;border:0;border-right:1px solid;border-radius:0;\" class=\"badge font-10 my-0\">" + totalBookDemoNotInterested + "</td>";
	htmlRet += "<td style=\"width:9%;border:0;border-radius:0;\" class=\"badge font-10 my-0\">" + totalBookDemoPending + "</td>";
	htmlRet += "</tr>";

	
	htmlRet +="</tbody>";
	htmlRet +="</table>";
	htmlRet +="</th>";
	htmlRet +="<th style=\"vertical-align: bottom !important;\" class=\"text-center\">"+totalHot+" | "+totalWarm+" | "+totalCold+"</th>";
	htmlRet +="<th style=\"vertical-align: bottom !important;\" class=\"text-center\">"+positiveEnroll+"</th>";
	htmlRet +="<th style=\"vertical-align: bottom !important;\" class=\"text-center\">"+reserved+"</th>";
	htmlRet +="<th style=\"vertical-align: bottom !important;\" class=\"text-center\">"+enrollment+"</th>";
	htmlRet +="<th style=\"vertical-align: bottom !important;\" class=\"text-center\">"+totalDivide+"%</th>";
	htmlRet +="</tr>";
	return htmlRet;
}

function getDropdownTable(listId, totallead, duplicateLeadCount, totalLeadLink, uniqueLeadLink, duplicateLeadLink){
	var html='';
	html+='<div class="dropdown full">';
    html+='<button type="button"  aria-haspopup="true" aria-expanded="false" data-toggle="dropdown" class="dropdown-toggle btn btn-sm full" style="width:100px;background-color:#3f6ad8 !important;color:#fff; padding:0px"><span class=\"float-left\"><a href=\"javascript:void(0)\" style=\"color:#fff !important\" class=\"not-underline\" onclick="'+totalLeadLink+'">'+totallead+'</a></span> <span class="float-right"><a href=\"javascript:void(0)\" style=\"color:#fff !important\" class=\"not-underline\" onclick="'+uniqueLeadLink+'">'+(totallead-duplicateLeadCount) +'</a>  |  <a href=\"javascript:void(0)\" style=\"color:#fff !important\" class=\"not-underline\" onclick="'+duplicateLeadLink+'">'+duplicateLeadCount+'</a><i class="fa fa-caret-down" ></i></span></button>';
    html+='<div tabindex="-1" role="menu" aria-hidden="true" class="dropdown-menu-xl dropdown-menu" x-placement="bottom-start" style="position: absolute; will-change: transform; top: 0px; left: -60px; transform: translate3d(0px, 33px, 0px);">';
    html+='<table class="table table-bordered table-striped" id="sub-counselor-list-'+listId+'" style="font-size:11px !important; width:1300px;" >';
    html+='<thead>';
	html+='<tr>';
	html+='<th style="5% !important" class="text-center bg-primary text-white">Sr no.</th>';
	html+='<th class="text-center bg-primary text-white">Academic Expert</th>';
	html+='<th class="bg-primary text-white">Total    U | D </th>';
	html+='<th class="bg-primary text-white">Total    FB | IG </th>';
	html+='<th class="text-center bg-primary text-white">Unattended</th>';
	html+='<th class="text-center bg-primary text-white">';
	html+='<table class="w-100 table mb-0 bg-transparent">';
	html+='<tbody>';
	html+='<tr>';
	html+='<td class="font-10 px-1" style="width:9%;border:0;border-right: 1px solid;border-radius:0 ">Demo Schedule(S)<br/>Booked(B)</td>';
	html+='<td class="font-10 px-1" style="width:9%;border:0;border-right: 1px solid;border-radius:0 ">Web</td>';
	html+='<td class="font-10 px-1" style="width:9%;border:0;border-right: 1px solid;border-radius:0 ">Link</td>';
	html+='<td class="font-10 px-1" style="width:9%;border:0;border-right: 1px solid;border-radius:0;">Completed</td>';
	html+='<td class="font-10 px-1" style="width:9%;border:0;border-right: 1px solid;border-radius:0;">Confirmed</td>';
	html+='<td class="font-10 px-1" style="width:9%;border:0;border-right: 1px solid;border-radius:0;">Not Confirmed</td>';
	html+='<td class="font-10 px-1" style="width:9%;border:0;border-right: 1px solid;border-radius:0;">Reschedule</td>';
	html+='<td class="font-10 px-1" style="width:9%;border:0;border-right: 1px solid;border-radius:0;">No-Show</td>';
	html+='<td class="font-10 px-1" style="width:9%;border:0;border-right: 1px solid;border-radius:0;">Cancelled</td>';
	html+='<td class="font-10 px-1" style="width:9%;border:0;border-right: 1px solid;border-radius:0;">Not Interested</td>';
	html+='<td class="font-10 px-1" style="width:9%;border:0;border-radius:0;">No Status</td>';
	html+='</tr>';
	html+='</tbody>';
	html+='</table>';
	html+='</th>';
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
		contentType : APPLICATION_JSON_VALUE,
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
        }
    });
}

function getCallHippoLogs(number){
    $.ajax({
        type: "GET",
        url: BASE_URL + CONTEXT_PATH + `callhippo/v1/get-logs?number=${number}`,
        dataType: "json",
        success: function (response) {
			if(response.status == 'success'){
				let modalContent = callHippoLogsDataModal(response.logs);
				if($("#callHippoLogsContent").length > 0){
					$("#callHippoLogsContent").remove();
				}
				$("body").append(modalContent);
				$("#callHippoLogsContent").modal("show");
			}else{
				showMessageTheme2(0, response.message)
			}
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
var zadarmaData = [];
function showZadarmaDetails(zadarmaIds) {
	var body = {
		ids: zadarmaIds,
		filterType: $('#sortzadarmalogs').val(),
		pageNo: currentPageZadarma,
		pageCount: $('#zadarmaPagging').val(),
	}
	$.ajax({
		url: BASE_URL + CONTEXT_PATH + "zadarma/v1/get-logs-by-ids",
		type: "POST",
		data: JSON.stringify(body),
		contentType: APPLICATION_JSON_VALUE,
		success: function (response) {
		try {
			if(response.statusCode === 0){
				ZadarmaOrWati = "zadarma";
				if(currentZadarmaIds != zadarmaIds){
					zadarmaData = response.logs;
					populateZadarmaRecords(response.logs,response.unMatchLogs,"Zadarma Logs", response.totalPages,response.totalCount);
				}else{
					zadarmaData = response.logs;
					renderZadarmaTable(response.logs);
					renderUnMatchZadarmaTable(response.unMatchLogs);
					$("#zadarmaPagination").html(renderPagination(currentPageZadarma, response.totalPages,response.totalCount,[...new Set(response.logs.map((elem,index) => elem.callId)),...new Set(response.unMatchLogs.map((elem,index) => elem.callId))].length));
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

function showZadarmaSortDetails() {
	var body = {
		ids: currentZadarmaIds,
		filterType: $('#sortzadarmalogs').val(),
		pageNo: 1,
		pageCount: $('#zadarmaPagging').val(),
	}
	$.ajax({
		url: BASE_URL + CONTEXT_PATH + "zadarma/v1/get-logs-by-ids",
		type: "POST",
		data: JSON.stringify(body),
		contentType: APPLICATION_JSON_VALUE,
		success: function (response) {
			try {
				if(response.statusCode === 0){
					ZadarmaOrWati = "zadarma";
					zadarmaData = response.logs;
					renderZadarmaTable(response.logs);
					renderUnMatchZadarmaTable(response.unMatchLogs);
					$("#zadarmaPagination").html(renderPagination(currentPageZadarma, response.totalPages,response.totalCount,[...new Set(response.logs.map((elem,index) => elem.callId)),...new Set(response.unMatchLogs.map((elem,index) => elem.callId))].length));
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


var currentPageCallhippo = 1;
var currentCallhippoIds = null;
var callhippoData = [];

function showCallhippoDetails(callhippoIds) {
	var body = {
		ids: callhippoIds,
		filterType: $('#sortcallhippologs').val(),
		pageNo: currentPageCallhippo,
		pageCount: $('#callhippoPagging').val(),
	}
	$.ajax({
		url: BASE_URL + CONTEXT_PATH + "callhippo/v1/get-logs-by-ids",
		type: "POST",
		data: JSON.stringify(body),
		contentType: APPLICATION_JSON_VALUE,
		success: function (response) {
		try {
			if(response.statusCode === 0){
				ZadarmaOrWati = "callhippo";
				if(currentCallhippoIds != callhippoIds){
					callhippoData = response.logs;
					populateCallhippoRecords(response.logs,response.unMatchLogs,"CallHippo Logs", response.totalPages,response.totalCount);
				}else{
					callhippoData = response.logs;
					renderCallhippoTable(response.logs);
					renderUnMatchCallhippoTable(response.unMatchLogs);
					$("#callhippoPagination").html(renderPagination(currentPageCallhippo, response.totalPages,response.totalCount,[...new Set(response.logs.map((elem,index) => elem.callId)),...new Set(response.unMatchLogs.map((elem,index) => elem.callId))].length));
				}
				
				currentCallhippoIds = callhippoIds;
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

function showCallhippoSortDetails() {
	var body = {
		ids: currentCallhippoIds,
		filterType: $('#sortcallhippologs').val(),
		pageNo: 1,
		pageCount: $('#callhippoPagging').val(),
	}
	$.ajax({
		url: BASE_URL + CONTEXT_PATH + "callhippo/v1/get-logs-by-ids",
		type: "POST",
		data: JSON.stringify(body),
		contentType: APPLICATION_JSON_VALUE,
		success: function (response) {
			try {
				if(response.statusCode === 0){
					ZadarmaOrWati = "callhippo";
					callhippoData = response.logs;
					renderCallhippoTable(response.logs);
					renderUnMatchCallhippoTable(response.unMatchLogs);
					$("#callhippoPagination").html(renderPagination(currentPageCallhippo, response.totalPages,response.totalCount,[...new Set(response.logs.map((elem,index) => elem.id)),...new Set(response.unMatchLogs.map((elem,index) => elem.id))].length));
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
		contentType: APPLICATION_JSON_VALUE,
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
var watiData = []
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
		contentType: APPLICATION_JSON_VALUE,
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
		contentType: APPLICATION_JSON_VALUE,
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


function getFilterLeadNo(searchValue) {
    searchValue = searchValue.trim().toLowerCase();
    
    $("#callhippoLogModalTableBody tr").each(function () {
        var leadNo = $(this).find("td:nth-child(2)").text().trim().toLowerCase(); // Get Lead No column
        
        if (searchValue === "" || leadNo.includes(searchValue)) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
}


function getFilterZadarmaLeadNo(searchValue, totalPages,totalCount) {
    searchValue = searchValue.trim().toLowerCase();
    const filteredData = zadarmaData.filter(item => 
        item.leadNo.toLowerCase().includes(searchValue)
    );
    renderZadarmaTable(filteredData, totalPages,totalCount);
	if(searchValue != ""){
		$(".pagination").hide();
		$("#unMatchZadarmaTable").hide();
	}else{
		$(".pagination").show();
		$("#unMatchZadarmaTable").show();
	}
}


function getFilterCallHippoLeadNo(searchValue) {
    searchValue = searchValue.trim().toLowerCase();
    
    $("#callhippoLogModalTableBody tr").each(function () {
        var leadNo = $(this).find("td:nth-child(2)").text().trim().toLowerCase(); // Get Lead No column
        
        if (searchValue === "" || leadNo.includes(searchValue)) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
}

function getFilterCallhippoLeadNo(searchValue, totalPages,totalCount) {
    searchValue = searchValue.trim().toLowerCase();
    const filteredData = callhippoData.filter(item => 
        item.leadNo.toLowerCase().includes(searchValue)
    );
    renderCallhippoTable(filteredData, totalPages,totalCount);
	if(searchValue != ""){
		$(".pagination").hide();
		$("#unMatchCallhippoTable").hide();
	}else{
		$(".pagination").show();
		$("#unMatchCallhippoLogTable").show();
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
		<div class="p-3 d-flex px-5" style="margin-left:auto; justify-content: space-between;">
			<select name="zadarmaPagging" id="zadarmaPagging" class="mr-2 w-5 px-2 rounded-lg" onchange="showZadarmaSortDetails()">
				<option value="10" selected="">10</option>
				<option value="25">25</option>
				<option value="50">50</option>
				<option value="100">100</option>
			</select>
			<div class="d-flex" style="width:450px;">
				<select class="form-control mr-2 w-50" id="sortzadarmalogs" name="sortzadarmalogs" onchange="showZadarmaSortDetails()">
					<option value="ALL" selected="">All</option>
					<option value="ATTENDED">Attended Call</option>
					<option value="UNATTENDED">Un Attended Call</option>
				</select>
				<input placeholder="Search" type="text" class="w-50 px-2" onkeydown="getFilterZadarmaLeadNo(this.value, ${totalPages}, ${totalCount})" class="form-control">
			</div>
		</div>
		<div style="background-color: #fff; height: 100vh;">
		  <div class="px-5" style="height: 80vh;overflow-y:auto;">
			<table id="recurring-recordings-table" class="w-100 table table-bordered border-radius-table">
			  <thead style="position: sticky;top: 0;z-index: 1;">
				<tr style="font-size: 14px;">
					<th class="p-2 rounded-top-left-10 border-right-0 border-primary" style="background-color:rgb(200, 224, 247); font-weight: normal; color:rgb(38, 146, 253)">Lead No</th>
				  <th class="p-2 border-right-0 border-left-0 border-primary" style="background-color:rgb(200, 224, 247);font-weight: normal; color:rgb(38, 146, 253)">Caller</th>
				  <th class="p-2 border-right-0 border-left-0 border-primary" style="background-color:rgb(200, 224, 247);font-weight: normal; color:rgb(38, 146, 253)">Dialed No</th>
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
    renderZadarmaTable(data);
	renderUnMatchZadarmaTable(data2)
	$("#zadarmaPagination").html(renderPagination(currentPageZadarma, totalPages,totalCount,[...new Set(data.map((elem,index) => elem.callId)),...new Set(data2.map((elem,index) => elem.callId))].length));
	setTimeout(() => {
	  $("#zadarmaLogBackdrop").fadeIn(200);
	  $("#zadarmaLogModal").addClass("open");
	  $("body").css("overflow", "hidden");
	}, 50);
}

function renderZadarmaTable(data) {
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
							<th class="py-1 px-2 font-weight-bold text-dark border-0">Dialed No.</th>
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
							<th class="py-1 px-2 font-weight-bold text-dark border-0">Dialed No.</th>
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


function populateCallhippoRecords(data, data2,meetingTitle, totalPages,totalCount){
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
	  <div id="callhippoLogBackdrop" class="recurring-modal-backdrop" onclick="closeZadarmaModal();"></div>
	  <div id="callhippoLogModal" class="recurring-modal">
		<div class="p-3" style="background-color:#027FFF;">
		  <h5 class="mb-0" style="color: white;font-size:18px;font-weight: 700;">${meetingTitle}</h5>
		   <button onclick="closeCallhippoModal();" type="button" class="p-2 cursor" data-dismiss="modal" aria-label="Close" style="position: absolute;left:-30px;top:35px;background-color: white !important;border-radius: 5px 0px 0px 5px;font-size: 35px;border:0px;color:#000;">
			<span aria-hidden="true">&times;</span>
		  </button>
		</div>
		<div class="p-3 d-flex px-5" style="margin-left:auto; justify-content: space-between;">
			<select name="callhippoPagging" id="callhippoPagging" class="mr-2 w-5 px-2 rounded-lg" onchange="showCallhippoSortDetails()">
				<option value="10" selected="">10</option>
				<option value="25">25</option>
				<option value="50">50</option>
				<option value="100">100</option>
			</select>
			<div class="d-flex" style="width:450px;">
				<select class="form-control mr-2 w-50" id="sortcallhippologs" name="sortcallhippologs" onchange="showCallhippoSortDetails()">
					<option value="ALL" selected="">All</option>
					<option value="ATTENDED">Attended Call</option>
					<option value="UNATTENDED">Un Attended Call</option>
				</select>
				<input placeholder="Search" type="text" class="w-50 px-2" onkeydown="getFilterCallhippoLeadNo(this.value, ${totalPages}, ${totalCount})" class="form-control">
			</div>
		</div>
		<div style="background-color: #fff; height: 100vh;">
		  <div class="px-5" style="height: 80vh;overflow-y:auto;">
			<table id="recurring-recordings-table" class="w-100 table table-bordered border-radius-table">
			  <thead style="position: sticky;top: 0;z-index: 1;">
				<tr style="font-size: 14px;">
					<th class="p-2 rounded-top-left-10 border-right-0 border-primary" style="background-color:rgb(200, 224, 247); font-weight: normal; color:rgb(38, 146, 253)">Lead No</th>
				  <th class="p-2 border-right-0 border-left-0 border-primary" style="background-color:rgb(200, 224, 247);font-weight: normal; color:rgb(38, 146, 253)">Caller</th>
				  <th class="p-2 border-right-0 border-left-0 border-primary" style="background-color:rgb(200, 224, 247);font-weight: normal; color:rgb(38, 146, 253)">Dialed No</th>
				  <th class="p-2 border-right-0 border-left-0 border-primary" style="background-color:rgb(200, 224, 247);font-weight: normal; color:rgb(38, 146, 253)">Type</th>
				  <th class="p-2 border-right-0 border-left-0 border-primary" style="background-color:rgb(200, 224, 247);font-weight: normal; color:rgb(38, 146, 253)">Call Start</th>
				  <th class="p-2 border-right-0 border-left-0 border-primary" style="background-color:rgb(200, 224, 247);font-weight: normal; color:rgb(38, 146, 253)">Duration</th>
				  <th class="p-2 border-right-0 border-left-0 border-primary" style="background-color:rgb(200, 224, 247);font-weight: normal; color:rgb(38, 146, 253)">Status</th>
				  <th class="p-2 rounded-top-right-10 border-left-0 border-primary" style="background-color:rgb(200, 224, 247);font-weight: normal; color:rgb(38, 146, 253)">Action</th>
				</tr>
			  </thead>
			  <tbody id="callhippoLogModalTableBody"></tbody>
			</table>
			<div id="unMatchCallhippoTable"></div>
			<div id="callhippoPagination"></div>
		  </div>
		</div>
	  </div>
	`;
	$("body").append(modalContent);
    renderCallhippoTable(data);
	renderUnMatchCallhippoTable(data2)
	$("#callhippoPagination").html(renderPagination(currentPageCallhippo, totalPages,totalCount,[...new Set(data.map((elem,index) => elem.id)),...new Set(data2.map((elem,index) => elem.id))].length));
	setTimeout(() => {
	  $("#callhippoLogBackdrop").fadeIn(200);
	  $("#callhippoLogModal").addClass("open");
	  $("body").css("overflow", "hidden");
	}, 50);
}

function renderCallhippoTable(data) {
    const groupedData = data.reduce((acc, item) => {
        const key = item.leadNo;
        acc[key] = acc[key] || [];
        acc[key].push(item);
        return acc;
    }, {});

    let modalContent = ``;
    $.each(Object.entries(groupedData), function(index,calls){
		let dynamicIndex = (currentPageCallhippo - 1) * 10 + index + 1;
		if(calls[1].length===1){
			modalContent+=
			`<tr id="row_id_${dynamicIndex}">
				<td class="py-2 border-right-0 border-primary border-top-0" style="font-weight: 500;background-color:#fff;">${calls[1][0].leadNo}</td>
				<td class="py-2 border-right-0 border-left-0 border-primary border-top-0" style="font-weight: 500;background-color:#fff;">${calls[1][0].caller}</td>
				<td class="py-2 border-right-0 border-left-0 border-primary border-top-0" style="font-weight: 500;background-color:#fff;">${calls[1][0].dialledNumber}</td>
				<td class="py-2 border-right-0 border-left-0 border-primary border-top-0" style="font-weight: 500;background-color:#fff;">${calls[1][0].type}</td>
				<td class="py-2 border-right-0 border-left-0 border-primary border-top-0" style="font-weight: 500;background-color:#fff;">${changeDateFormat(convertTZ(new Date(calls[1][0].callStart), USER_TIMEZONE),'mm-dd-yyyy')} | ${changeDateFormat(convertTZ(new Date(calls[1][0].callStart), USER_TIMEZONE),'yyyy-mm-dd hh:mm:ss').slice(10,16)}</td>
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
							<th class="py-1 px-2 font-weight-bold text-dark border-0">Dialed No.</th>
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
								<td class="py-1 px-2 font-weight-light" style="font-size:13px;background-color:#fff; border-right: 0; border-left: 0px;">${call.type}</td>
								<td class="py-1 px-2 font-weight-light" style="font-size:13px;background-color:#fff; border-right: 0; border-left: 0px;">${changeDateFormat(convertTZ(new Date(call.callStart), USER_TIMEZONE),'mm-dd-yyyy')} | ${changeDateFormat(convertTZ(new Date(call.callStart), USER_TIMEZONE),'yyyy-mm-dd hh:mm:ss').slice(10,16)}</td>
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
    $("#callhippoLogModalTableBody").html(modalContent);
	if (!data || data.length === 0) {
		$("#callhippoLogModalTableBody").html('<tr><td colspan="9" class="text-center py-5" style="font-size: 16px;font-weight: 700;">No recordings found</td></tr>');
	}
}

function renderUnMatchCallhippoTable(data) {
    let modalContent = ``;

		if(data.length >0){
			modalContent+= `<h1 style="color:#f79797; font-size:14px">No lead number found for these calls.</h1>`;
			modalContent+=
			`<table class="w-100 table mb-0 border border-color-#ff1414 mb-4">
					<thead style="background-color:#f79797;">
						<tr style="font-size:12px">
							<th class="py-1 px-2 font-weight-bold text-dark border-0">Caller</th>
							<th class="py-1 px-2 font-weight-bold text-dark border-0">Dialed No.</th>
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
								<td class="py-1 px-2 font-weight-light" style="font-size:13px;background-color:#fff; border-right: 0; border-left: 0px;">${call.type}</td>
								<td class="py-1 px-2 font-weight-light" style="font-size:13px;background-color:#fff; border-right: 0; border-left: 0px;">${changeDateFormat(convertTZ(new Date(call.callStart), USER_TIMEZONE),'mm-dd-yyyy')} | ${changeDateFormat(convertTZ(new Date(call.callStart), USER_TIMEZONE),'yyyy-mm-dd hh:mm:ss').slice(10,16)}</td>
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
    $("#unMatchCallhippoTable").html(modalContent);
}

function closeCallhippoModal() {
	$("#callhippoLogModal").removeClass("open");
	$("#callhippoLogBackdrop").fadeOut(200);
	
	setTimeout(() => {
	  $("#callhippoLogModal").remove();
	  $("#callhippoLogBackdrop").remove()
	  $("body").css("overflow", "auto");
	}, 300);
	currentPageCallhippo = 1;
	currentCallhippoIds = '';
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
	var modalContent = `
	  <div id="watiLogBackdrop" class="recurring-modal-backdrop" onclick="closeWatiModal();"></div>
	  <div id="watiLogModal" class="recurring-modal right-slide-modal">
		<div class="p-3" style="background-color:#027FFF;">
		  <h5 class="mb-0" style="color: white;font-size:18px;font-weight: 700;">${meetingTitle}</h5>
		   <button onclick="closeWatiModal();" type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
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
	$("body").append(whatsappChatUI2(data));
	$("#watiLogsTableData").DataTable({
		theme:"bootstrap4",	 //destroy: true,	
	});
	$("#watiLogsContent").modal("show");
}
function whatsappChatUI2(responseData) {
    const messages = [JSON.parse(JSON.stringify(responseData))]
        .filter(item => item.eventType === "message" || item.eventType === "broadcastMessage")
        .sort((a, b) => parseFloat(convertTZ(new Date(a.created), USER_TIMEZONE).getTime()) - parseFloat(convertTZ(new Date(a.created), USER_TIMEZONE).getTime()));

    let html = `
        <div id="watiLogsContent" class="modal fade bd-example-modal-lg fade-scale" tabindex="" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-xl" style='width: 80% !important;'>
                <div class="d-flex flex-wrap wati-wrapper">
                    <div class="modal-content border-0 watiLogsTableDiv">
                        <div class="modal-header py-1 bg-primary text-white">
                            <h5 class="modal-title font-weight-bold">Wati Logs</h5>
                            <button type="button" class="close text-white" onclick="selfModalHide('watiLogsContent')">
                                <span aria-hidden="true">&times;</span>
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
        <div id="watiLogsContent" class="modal fade bd-example-modal-lg fade-scale" tabindex="" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-xl" style='width: 80% !important;'>
                <div class="d-flex flex-wrap wati-wrapper">
                    <div class="modal-content border-0 watiLogsTableDiv">
                        <div class="modal-header py-1 bg-primary text-white">
                            <h5 class="modal-title font-weight-bold">Whatsapp Messages</h5>
                            <button type="button" class="close text-white" onclick="selfModalHide('watiLogsContent')">
                                <span aria-hidden="true">&times;</span>
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
	}else if(ZadarmaOrWati == 'callhippo'){
		currentPageCallhippo = page;
		showCallhippoDetails(currentCallhippoIds);
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

async function getLeadDataList(formId, leadFrom, clickFrom, currentPage, typeTheme, newTheme, callbadge, objRights, roleModule) {
	try {
	  customLoader(true);
	  checkTextBox(formId);

	  if ($("#" + formId + " #leadStartDateSearch").val() !== '' && $("#" + formId + " #leadEndDateSearch").val() !== '') {
		if ($("#" + formId + " #searchDateType option:selected").val() === '') {
		  showMessageTheme2(0, 'Please select type for date');
		  return false;
		}
	  }
  
	  if (moduleId === '') {
		moduleId = $("#" + formId + " #leadFromSearchModuleId").val();
	  }
	  if (clickFrom === '') {
		clickFrom = $("#" + formId + " #clickFromSearch").val();
	  }
	  if (currentPage === '') {
		currentPage = $("#" + formId + " #currentPageSearch").val();
	  }
  
	  $('#leadAdvanceSearch').modal('hide');
	//   console.log("start time :" + new Date());
	  if(objRights.clickByLead!=undefined){
		callbadge=objRights.clickByLead;
	  }
	  
	  const payload = getCallRequestForAdvanceLeadSearchStudent(formId, objRights.moduleId, leadFrom, clickFrom, currentPage, typeTheme, newTheme, callbadge, objRights.leadType, 'Y');
  
	  const data = await getDashboardDataBasedUrlAndPayloadWithParentUrl(true, true, 'get-lead-data', payload, 'api/v1/leads');
  
	//   console.log("start success time :" + new Date());
	  customLoader(false);
  
	  if (data['status'] == '0' || data['status'] == '2') {
		showMessageTheme2(0, data['message'], '', true);
  
		if (objRights.leadType == 'B2B') {
		  $("#b2b-lead-list").html("");
		} else {
		  const html = getB2cLeadHeaderList(data, objRights, roleModule);
		  $("#b2c-lead-list").html(html);
		}
	  } else {
		if($("#advanceLeadNewSearchForm #campaignName").val()) {
		  $("#advanceLeadNewSearchForm #leadSearchCampaign").val($("#advanceLeadNewSearchForm #campaignName").val()).trigger('change');
		}

		if (objRights.leadType == 'B2B') {
		  const html = getB2bLeadList(data, objRights, roleModule);
		  $("#b2b-lead-list").html(html);
		  $('#b2b-lead-list').off('click', '.follow-up-no').on('click', '.follow-up-no', function () {
			$(this).find(".fa-angle-down").toggleClass('fa-angle-down fa-angle-up');
			$(this).parent().siblings().find(".fa-angle-up").toggleClass('fa-angle-up fa-angle-down');
			$(this).parent().find(".follow-up-content").slideDown();
			$(this).parent().siblings().find(".follow-up-content").slideUp();
			$(this).parent().addClass("follow-up-accordian-active");
			$(this).parent().siblings().removeClass("follow-up-accordian-active");
		  });
		} else {
		  const html = getB2cLeadList(data, objRights, roleModule);
		  $("#b2c-lead-list").html(html);
		  $('[data-toggle="tooltip"]').tooltip();
  
		  const leaddata = data.data || [];
		  for(var i=0;i<leaddata.length;i++){
			var leadsd = leaddata[i];
			getLeadStatusLog(leadsd.leadNo, 'new-lead', objRights.adminStatus);
			getLeadStartTimer(leadsd.assignLeadDatetime, leadsd.leadId);
			updateLeadHoldIndicator(leadsd.leadId, leadsd.lockStatus === 'ACTIVE', leadsd);
			getUpdateLeadCurrentTime(leadsd, leadsd.leadId);
			getLeadStatusLogHistory(leadsd.leadId);
		  }
		  curentTimeStamp(data.objectRights.timeZoneOffset);
		  $(".selectcampain").select2({ theme: "bootstrap4", dropdownParent: "#b2c-lead-list" });
		  $(".leadSearchCampaign").select2({ theme: "bootstrap4", dropdownParent: "#advanceLeadNewSearchForm" });
		  $(".leadSearchTemplate").select2({ theme: "bootstrap4", dropdownParent: "#advanceLeadNewSearchForm" });
		  $(".leadSearchDeliveredStatus").select2({ theme: "bootstrap4", dropdownParent: "#advanceLeadNewSearchForm" });

		  $(".leadStatus-followup").select2({
			theme:"bootstrap4",
			dropdownParent:"#b2c-lead-list"
		 });

	var leadid=0;
	$(document).on("input", ".lead_list_remarks", function () {
		let val = $(this).val();
		let minlength = $(this).attr("minlength");
		let elementItems = $(this).attr("data-leadid");
		let counterId = "#leadListRemarksCounter_" +elementItems;

		// update counter live
		$(counterId).text(val.length + " / "+ minlength);

		// visual feedback
		if (val.length < minlength) {
			$(this).addClass("is-invalid");
			$(counterId).attr("class", "text-red");
		} else {
			$(this).removeClass("is-invalid");
			$(counterId).attr("class", "text-success");
		}
	});
	$(".followupRemarks-suggestion").on("keyup", function() {
        let text = $(this).val();
		leadid=$(this).attr("data-leadid");
        let cursorPos = this.selectionStart;
        let beforeCursor = text.substring(0, cursorPos);

        // Regex: detect if user is typing #word
        let match = beforeCursor.match(/#(\w*)$/);

        if (match) {
            let query = match[1].toLowerCase();

            // Filter hashtags
            let results = HASHTAGLIST.filter(tag => tag.extra.toLowerCase().startsWith(query));

            if (results.length > 0) {
                let suggestionHtml = results.map(r => `<div class="item cursor my-1 text-primary-on-hover">#${r.extra}</div>`).join("");
                let offset = $("#followupRemarks-"+leadid).position(); // to position dropdown near textarea
                $("#suggestions-"+leadid).css({
                    top: offset.top + $("#followupRemarks-"+leadid).outerHeight(),
                    left: offset.left
                }).html(suggestionHtml).show();
            } else {
                $("#suggestions-"+leadid).hide();
            }
        } else {
            $("#suggestions-"+leadid).hide();
        }


		$(document).on("click", ".suggestionslead .item", function() {
			let chosen = $(this).text();
			let leadid = $(this).closest(".suggestionslead").attr("id").split("-")[1];
			let textarea = $("#followupRemarks-" + leadid)[0];
			let cursorPos = textarea.selectionStart;
			let text = $("#followupRemarks-" + leadid).val();
		
			let before = text.substring(0, cursorPos).replace(/#\w*$/, chosen);
			let after = text.substring(cursorPos);
		
			$("#followupRemarks-" + leadid).val(before + after);
			$("#suggestions-" + leadid).hide();
		});

		
    });

	


}
  
		$('#b2c-lead-list').off('click', '.follow-up-no').on('click', '.follow-up-no', function () {
		  $(this).find(".fa-angle-down").toggleClass('fa-angle-down fa-angle-up');
		  $(this).parent().siblings().find(".fa-angle-up").toggleClass('fa-angle-up fa-angle-down');
		  $(this).parent().find(".follow-up-content").slideDown();
		  $(this).parent().siblings().find(".follow-up-content").slideUp();
		  $(this).parent().addClass("follow-up-accordian-active");
		  $(this).parent().siblings().removeClass("follow-up-accordian-active");
		});
  
		let leadCheckednew = $("#leadNoMove").val() || "";
		let leadCheckedArr = String(leadCheckednew).split(',');
		for (let lead of leadCheckedArr) {
		  $("#lead-" + lead).prop("checked", true);
		}
  		var demoMovedTxtTrue='';
		var blankDemoTxt='';
		$("#selectLeadAll").off('click').on('click', function () {
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
						demoMovedTxtTrue += "moved"
					}else{
						if(demoUserId == 0){
							blankDemoTxt += "blank"; 
						}
					}
				}
			});
			
			leadnew = leadnew + leadNo;
			$("#leadNoMove").val(leadnew);
			if($("#selectLeadAll").is(":checked")){}
			else{
				demoMovedTxtTrue = '';
				blankDemoTxt = '';
				$("#leadNoMove").val('');
			}
			$("#demoMovedTrue").val(demoMovedTxtTrue)
			$("#blankDemo").val(blankDemoTxt)
		});
  
		$(".checkLead").off('click').on('click', function () {
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
							demoMovedTxtTrue = demoMovedTxtTrue.replace("moved", "");
						}else{
							if(demoUserId == 0){
								blankDemoTxt = blankDemoTxt.replace("blank", "");
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
						demoMovedTxtTrue += "moved"
					}else{
						if(demoUserId == 0){
							blankDemoTxt += "blank"; 
						}
					}
					leadNo = leadNo+','+$(this).val();
				}  
			});
			leadnew = leadnew + leadNo;
			$("#leadNoMove").val(leadnew);
			$("#demoMovedTrue").val(demoMovedTxtTrue)
			$("#blankDemo").val(blankDemoTxt)
		});
  
		$("#leadsPagging").off('change').on('change', function () {
		  getLeadDataList('advanceLeadNewSearchForm', 'advance-search', 'list', '0', 'new', true, '', objRights, roleModule);
		});
	  }
  
	//   console.log("data success bind time :" + new Date());
	  return false;
  
	} catch (e) {
	  if (checkonlineOfflineStatus()) return;
	  console.error(e);
	  customLoader(false);
	}
  }
  

function getEmailTemplates(type) {	
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
	request['leadListType']=type;
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
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
		}
	});
}

function viewEmailTemplate(flag, indexNumber, templateName){
	if(flag){
		$("#table_row_"+ templateName).addClass('selected_row').siblings().removeClass('selected_row');
		$(".email-wrapper").addClass("active-email-template");
		$(".email-template").removeClass("hide-email-template").addClass("show-email-template");
		$("#customEmailTemplatesList > .modal-dialog").css({
			"transition": "transform 0.3s ease",
			"transform": "translateX(-200px)"
		});
		$("#previewEmailTemplate, #previewEmailTemplateSecond, #previewEmailTemplateThird").html('');
		setTimeout(function () {
			$("#previewEmailTemplate").html(getViewTemplateEmail(emailTemplateContent.responseBody.templates[indexNumber]));
            $("#previewEmailTemplateSecond").html(getViewTemplateEmail(emailTemplateContent.responseBody.templates[indexNumber]));
            $("#previewEmailTemplateThird").html(getViewTemplateEmail(emailTemplateContent.responseBody.templates[indexNumber]))
		},200);
	}else{
		$(".email-wrapper").removeClass("active-email-template");
		$(".email-template").addClass("hide-email-template").removeClass("show-email-template");
		$(".modal-dialog").css({
			"transform": "translateX(0)"
		});
		$(".modal-dialog").removeAttr("style");
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
	templateName = decode2(templateName)
	subject = decode2(subject);
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
			$("body").append(sendConfirmationModal(`sendEmailNotificationToUser(${index}, '${encode2(templateName)}', '${encode2(subject)}', '${selectedLeads}', 'send', '${templateId}')`));
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
	templateName = decode2(templateName)
	subject = decode2(subject)
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
		contentType : APPLICATION_JSON_VALUE,
		url : getURLFor('leads','send-broadcast-lead-mail'),
		data : JSON.stringify(request),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data['statusCode'] == 'EX01' || data['statusCode'] == 'E004' ||  data['statusCode'] == 'FAILED' || data['statusCode'] == '0' ||  data['status'] == '0') {
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
		contentType : APPLICATION_JSON_VALUE,
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
		contentType : APPLICATION_JSON_VALUE,
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
		contentType : APPLICATION_JSON_VALUE,
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
		contentType : APPLICATION_JSON_VALUE,
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


function callDeviceCount(modeSearch, chartId, startDate, endDate, leadDemoStatus) {
	data={};
	data['modeSearch']=modeSearch;
	data['startDate']=startDate;
	data['endDate']=endDate;
	data['leadDemoStatus']=leadDemoStatus;
	data['userId']=USER_ID;
	data['schoolId']=SCHOOL_ID;

	$.ajax({
			type : "POST",
			contentType : APPLICATION_JSON_VALUE,
			url : getURLForHTML('dashboard', 'lead-device-total'),
			data : JSON.stringify(data),
			dataType : 'json',
			cache : false,
			timeout : 600000,
			success : function(data) {
				if (data['status'] == '0' || data['status'] == '2') {
					showMessage(true, data['message']);
				} else {
					if(leadDemoStatus=='Y'){
						getLeadsDeviceCountChart(data, chartId);
						getLeadsBrowserCountChart(data,'');
						getLeadsDeviceTypeCountChart(data,'');
					}else{
						getLeadsDeviceCountChart(data, chartId);
						getLeadsBrowserCountChart(data, '-demo');
						getLeadsDeviceTypeCountChart(data, '-demo');
					}
				}
			}
		});
	}
	   
	
	
	function getLeadsDeviceCountChart(data, chartId){
	
		var options = {
			series: [data.webTotal, data.mobileTotal],
			chart: {
				width: '85%',
				type: 'pie',
			},
			labels: ["Desktop", "Mobile"],
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


function getLeadsDeviceTypeCountChart(data, chartIdSufix){
	
		var options = {
			series: [ data.winTotal, data.macTotal, data.androidTotal, data.iphoneTotal, data.ipodTotal],
			chart: {
				width: '85%',
				type: 'pie',
			},
			labels: ["Windows", "MacOs", "Android", "iPhone", "iPod" ],
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
	
			
		var chart = new ApexCharts(document.querySelector("#chart-pie-device-type"+chartIdSufix), options);
		chart.render();   
		chart.update();
	
		
	}



	
	function getLeadsBrowserCountChart(data,chartIdSufix){
	
			var options = {
				series: [data.chromeTotal, data.fireFoxTotal, data.safariTotal, data.edgeTotal, data.otherTotal],
				labels: ['Chrome','FireFox','Safari','Edge','Other'],
				chart: {
					type: 'donut',
					width: '85%',
					height:360
				},
				responsive: [{
					breakpoint: 480,
					options: {
						legend: {
							position: 'bottom'
						}
					}
					}]	
        	};
			
		var chart = new ApexCharts(document.querySelector("#chart-pie-browser"+chartIdSufix), options);
		chart.render();   
		chart.update();
	
		
	}

async function getB2BContractDetails(b2bleadId, type, publishedContractId){
    var payload = {};
    payload['b2bleadId'] = parseInt(b2bleadId);
    if(type == "edit" && parseInt(publishedContractId) > 0){
        payload['contractId'] = parseInt(publishedContractId);
        payload['actionType'] = "V";
    }
	payload = "?payload="+encode(JSON.stringify(payload))
	responseData = await getDashboardDataBasedUrlAndPayloadWithParentUrlGET(true, true, 'partner-contract-details'+payload, '');
	responseData = responseData.details;
	if($("#b2bContractModal").length==1){
		$("#b2bContractModal").remove();
	}
	$("body").append(createB2BAddContractModal(responseData))
	if(responseData.contractStatus == "" || responseData.contractStatus == "P"){
		$("#publishContractDetailsBtn").hide();
	}else{
		$("#publishContractDetailsBtn").show();
	}
	if($("#viewB2BContractModal").length==1){
		$("#viewB2BContractModal").remove();
	}
	$("body").append(viewB2BContractModal())	
	var cleanedCommentData = cleanBase64Images(responseData.commentData);
	$("#editorData").html(cleanedCommentData);
	$("#b2bContractModal").modal("show");
	$("#contractDuration").val(responseData.durationYears);
	$("#validityDuration").val(responseData.validityDays);
	$("#contractStartDate").datepicker({
		autoclose: true,
		format: 'M dd, yyyy',
		startDate: new Date()
	});
	$("#contractEndDate").datepicker({
		autoclose: true,
		format: 'M dd, yyyy',
		startDate: new Date()
	});
	getAllCountryList('addContractForm','partnerCountryId');
	$('#partnerCountryId').select2({
        theme:"bootstrap4",
    }).on("change", function(){
        var selectedCountryID= $(this).val()
        callStates('addContractForm',selectedCountryID, 'partnerCountryId', 'partnerStateId', 'partnerCityId')
        if ($("#partnerStateId").hasClass("select2-hidden-accessible")) {
            $("#partnerStateId").select2("destroy");
        }
        $("#partnerStateId").select2({
            theme:"bootstrap4",
        });
        $("#partnerStateId").attr("disabled",false);
    });
    $("#partnerStateId").select2({
        theme:"bootstrap4",
    }).on("change", function(){
        var selectedStateID= $(this).val()
        callCities('addContractForm',selectedStateID, 'partnerStateId', 'partnerCityId')
        if ($("#partnerCityId").hasClass("select2-hidden-accessible")) {
            $("#partnerCityId").select2("destroy");
        }
        $("#partnerCityId").select2({
            theme:"bootstrap4",
        });
        $("#partnerCityId").attr("disabled",false);
    });
    $("#partnerCityId").select2({
        theme:"bootstrap4",
    });

	editor = new Jodit('#contractComment', {
		width: 794, // A4 width in pixels
    	height: 400, 
		toolbarSticky: true,
		uploader: { insertImageAsBase64URI: true },
		toolbarAdaptive: false,
		// buttons: [
		// 	'source', '|',
		// 	'bold', 'italic', 'underline', '|',
		// 	'ul', 'ol', '|',
		// 	'outdent', 'indent', '|',
		// 	'font', 'fontsize', 'brush', 'paragraph', '|',
		// 	'image', 'table', 'link', '|',
		// 	'align', 'undo', 'redo', '|',
		// 	'hr', 'eraser', 'fullsize'
		// ],
		events: {
			afterInit: function () {
				const observer = new MutationObserver(() => {
				const keepBtn = Array.from(document.querySelectorAll('.jodit-ui-button__text')).find(btn => btn.textContent.trim() === 'Keep');
					if(keepBtn) {
						keepBtn.addEventListener('click', function () {
						setTimeout(() => {
							tableCenter();

						}, 1500);
						}, { once: true });
						observer.disconnect();
					}
				});
				observer.observe(document.body, {
					childList: true,
					subtree: true
				});
			}
		}
	});

	// commentData will be disabled when these field are empty
	const requiredFields = [
		"#firstPartnerName",
		"#firstPartnerDesignation",
		"#contractPartnerType",
		"#partnerName",
		"#partnerEmail",
		"#partnerDesignation",
		"#partnerCountryId",
		"#partnerStateId",
		"#partnerCityId"
	];
	function areAllFieldsFilled() {
		return requiredFields.every(sel => {
			let val = $(sel).val();
			return val !== undefined && val !== null && val.toString().trim() !== "";
		});
	}
	function toggleEditorState() {
		if (areAllFieldsFilled()) {
			editor.setReadOnly(false);
		} else {
			editor.setReadOnly(true);
		}
	}
	requiredFields.forEach(sel => {
		$(document).on("input change", sel, toggleEditorState);
	});
	toggleEditorState();

	// signature upload when commentData is not empty
	function isEditorEmpty(editor) {
		const val = editor.value.trim();
		return (
			val === "" ||
			val === "<p><br></p>" ||
			val.replace(/<p>|<\/p>|&nbsp;|\s/g, "") === ""
		);
	}
	function hasSignatureFile() {
		const input = $("#recipientSignatureUpload")[0];
		if (input && input.files && input.files.length > 0) {
			return true;
		}
		const labelText = $("#recipientSignatureUpload")
			.next(".custom-file-label")
			.text()
			.trim();
	
		return labelText !== "" && labelText !== "Choose file...";
	}
	function toggleContractDependencies(editor) {
		const emptyEditor = isEditorEmpty(editor);
		const hasFile = hasSignatureFile();
	
		$("#recipientSignatureUpload").prop("disabled", emptyEditor).toggleClass("cursor", !emptyEditor);
		if(emptyEditor){
			$("#recipientSignatureUpload").val("").next(".custom-file-label").text("Choose file...").end()
		}else{
			var $leftImg = $("#leftSignatureBox img");
			if ($leftImg.length) {
				var fileName = $leftImg.attr("data-name") || "Choose file...";
				$("#recipientSignatureUpload").next(".custom-file-label").text(fileName);
			}
		}
		const leftImgName = $("#leftSignatureBox img").attr("data-name");
		if (!emptyEditor) {
			if (hasFile || (leftImgName && leftImgName !== "Choose file...")) {
				$("#previewContractBtn").show();
			} else {
				$("#previewContractBtn").hide();
			}
		} else {
			$("#previewContractBtn").hide();
		}
	}
	editor.events.on("change", function () {
		toggleContractDependencies(editor);
	});
	$(document).on("change", "#recipientSignatureUpload", function () {
		toggleContractDependencies(editor);
	});

	$("#validityStartDate").datepicker({
		autoclose: true,
		format: 'M dd, yyyy',
		startDate: new Date()
	})
	$("#validityEndDate").datepicker({
		autoclose: true,
		format: 'M dd, yyyy',
		startDate: new Date()
	});
	getTimeForDropdownContent('addContractForm', 'validityStartTime', 15);
	getTimeForDropdownContent('addContractForm', 'validityEndTime', 15);
	$("#contractPartnerType").val(responseData.partnerType).trigger("change");
	$("#partnerCountryId").val(responseData.countryId).trigger("change");
	$("#partnerStateId").val(responseData.stateId).trigger("change");
	$("#partnerCityId").val(responseData.cityId).trigger("change");
	if(responseData.durationStart != ""){
		$("#contractStartDate").val(convertU2L(responseData.durationStart, USER_TIMEZONE, DISPLAY_DATE_ONLY)).datepicker("update");
	}
	if(responseData.durationEnd != ""){
		$("#contractEndDate").val(convertU2L(responseData.durationEnd, USER_TIMEZONE, DISPLAY_DATE_ONLY)).datepicker("update");
	}
	editor.setEditorValue(cleanedCommentData);	
	setTimeout(function() {
		var $editorContent = $(".jodit-workplace").length ? $(".jodit-workplace") : $("#editorData");
		var $leftImg = $editorContent.find("#leftSignatureBox img");
		if($leftImg.length && $leftImg.attr("data-name")){
		  $("#recipientSignatureUpload").next(".custom-file-label").text($leftImg.attr("data-name"));
		}
		toggleContractDependencies(editor);
	  }, 500);
	if(responseData.validityStart != ""){
		$("#validityStartDate").val(convertU2L(responseData.validityStart, USER_TIMEZONE, DISPLAY_DATE_ONLY)).datepicker("update");
	}
	if(responseData.validityEnd != ""){
		$("#validityEndDate").val(convertU2L(responseData.validityEnd, USER_TIMEZONE, DISPLAY_DATE_ONLY)).datepicker("update");
	}
	$("#contractId").val(responseData.contractId);
	$("#b2bLeadId").val(responseData.b2bLeadId);
	
	$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
		if ($(e.target).attr('href') === '#emailLogs') {
			getEmailLogList("", "");
		}
	});
	bindContractFormEvents(responseData.partnerOrgType);
	editor.events.on("beforePaste", function (e, pasteData) {
		replaceContractPlaceholders(editor, pasteData);
	});
	editor.events.on("change", function () {
		replaceContractPlaceholders(editor);
	});
}

function tableCenter(){
	$(".jodit-container table").each(function(){
        const table = $(this);
        const styleWidth = table.css('width') || this.attr('width') || '';
        const isFullWidth = styleWidth.trim() === '100%' || (styleWidth.endsWith('%') && parseFloat(styleWidth) >= 100);
        if (!isFullWidth) {
            table.css({
                'margin-left': 'auto',
                'margin-right': 'auto',
                'display': 'table'
            });
        }
    });
	setTimeout(function(){
		$('.jodit-container *, #contractComment *').each(function() {
			// Loop through all attributes
			$.each(this.attributes, function() {
				if (this.name === 'onmouseover' || this.name === 'onmouseout' || this.name == "onmouseout") {
					$(this.ownerElement).removeAttr(this.name);
				}
			});
			$(".MsoCommentReference, .msocomanchor").remove();
		});
		document.querySelectorAll('.jodit-container *, #contractComment *').forEach(el => {
			if (el.hasAttribute('onmouseover')) {
			el.removeAttribute('onmouseover');
			}
			if (el.hasAttribute('onmouseout')) {
			el.removeAttribute('onmouseout');
			}
		});

	});
}

function validateAddContractForm(formId){
	if($("#"+formId+" #firstPartnerName").val() == null || $("#"+formId+" #firstPartnerName").val() == undefined || $("#"+formId+" #firstPartnerName").val() == ""){
		showMessageTheme2(0, "1st party representative name required");
		return false;
	}
	if($("#"+formId+" #firstPartnerDesignation").val() == null || $("#"+formId+" #firstPartnerDesignation").val() == undefined || $("#"+formId+" #firstPartnerDesignation").val() == ""){
		showMessageTheme2(0, "1st party representative designation required");
		return false;
	}
	if($("#"+formId+" #contractPartnerType").val() == null || $("#"+formId+" #contractPartnerType").val() == undefined || $("#"+formId+" #contractPartnerType").val() == ""){
		showMessageTheme2(0, "Partner type required");
		return false;
	}
	if($("#"+formId+" #partnerName").val() == null || $("#"+formId+" #partnerName").val() == undefined || $("#"+formId+" #partnerName").val() == ""){
		showMessageTheme2(0, "2nd partner representative name required");
		return false;
	}
	if($("#"+formId+" #partnerEmail").val() == null || $("#"+formId+" #partnerEmail").val() == undefined || $("#"+formId+" #partnerEmail").val() == ""){
		if (!validateEmail($("#partnerEmail").val())){
			showMessageTheme2(0,"Email is either empty or invalid.",'',false);
			return false;
		}
	}
	if($("#"+formId+" #partnerDesignation").val() == null || $("#"+formId+" #partnerDesignation").val() == undefined || $("#"+formId+" #partnerDesignation").val() == ""){
		showMessageTheme2(0, "2nd partner representative designation required");
		return false;
	}
	if($("#"+formId+" #partnerCountryId").val() == null || $("#"+formId+" #partnerCountryId").val() == undefined || $("#"+formId+" #partnerCountryId").val() == ""){
		showMessageTheme2(0, "Country required");
		return false;
	}
	if($("#"+formId+" #partnerStateId").val() == null || $("#"+formId+" #partnerStateId").val() == undefined || $("#"+formId+" #partnerStateId").val() == ""){
		showMessageTheme2(0, "State required");
		return false;
	}
	if($("#"+formId+" #partnerCityId").val() == null || $("#"+formId+" #partnerCityId").val() == undefined || $("#"+formId+" #partnerCityId").val() == ""){
		showMessageTheme2(0, "City required");
		return false;
	}
	if($("#"+formId+" #contractStartDate").val() == null || $("#"+formId+" #contractStartDate").val() == undefined || $("#"+formId+" #contractStartDate").val() == ""){
		showMessageTheme2(0, "Contract duration start date required");
		return false;
	}
	if (
		$("#"+formId+" #contractDuration").val() == null || 
		$("#"+formId+" #contractDuration").val() == undefined || 
		$("#"+formId+" #contractDuration").val() === "" || 
		$("#"+formId+" #contractDuration").val() === "0"
	) {
		showMessageTheme2(0, "Contract duration start date required");
		return false;
	}
	if($("#"+formId+" #contractEndDate").val() == null || $("#"+formId+" #contractEndDate").val() == undefined || $("#"+formId+" #contractEndDate").val() == ""){
		showMessageTheme2(0, "Contract duration end date required");
		return false;
	}
	if(editor.getEditorValue() == null || editor.getEditorValue() == undefined || editor.getEditorValue() == "" || editor.getEditorValue() == "<p><br></p>"){
		showMessageTheme2(0, "Comment required");
		return false;
	}
	if($("label[for='recipientSignatureUpload']").text() == "Choose file..."){
		showMessageTheme2(0, "Please upload your signature");
		return false;
	}
	// if($("#recipientSignatureUpload").val() == ""){
	// 	showMessageTheme2(0, "Please upload your signature");
	// 	return false;
	// }
	if($("#"+formId+" #validityStartDate").val() == null || $("#"+formId+" #validityStartDate").val() == undefined || $("#"+formId+" #validityStartDate").val() == ""){
		showMessageTheme2(0, "Validity start date required");
		return false;
	}
	if (
		$("#"+formId+" #validityDuration").val() == null || 
		$("#"+formId+" #validityDuration").val() == undefined || 
		$("#"+formId+" #validityDuration").val() === "" || 
		$("#"+formId+" #validityDuration").val() === "0"
	) {
		showMessageTheme2(0, "Validity duration required");
		return false;
	}
	if($("#"+formId+" #validityEndDate").val() == null || $("#"+formId+" #validityEndDate").val() == undefined || $("#"+formId+" #validityEndDate").val() == ""){
		showMessageTheme2(0, "Validity end date required");
		return false;
	}
	return true;
}

function getAddContractPayload(formId, b2bLeadId) {
    var requestData = {
		firstPartyRepresentative: $("#" + formId + " #firstPartnerName").val(),
		firstPartyDesignation: $("#" + formId + " #firstPartnerDesignation").val(),
        partnerType: $("#" + formId + " #contractPartnerType").val(),
        name: $("#" + formId + " #partnerName").val(),
        email: $("#" + formId + " #partnerEmail").val(),
        secondPartyDesignation: $("#" + formId + " #partnerDesignation").val(),
        countryId: parseInt($("#" + formId + " #partnerCountryId").val()),
        stateId: parseInt($("#" + formId + " #partnerStateId").val()),
        cityId: parseInt($("#" + formId + " #partnerCityId").val()),
        durationStart: convertLocalToUTCWithRequiredFormat($("#" + formId + " #contractStartDate").val() + ' 00:00 AM',DISPLAY_DATE_AND_TIME,USER_TIMEZONE,DATETIME_UTC_FORMATTER),
        durationEnd: convertLocalToUTCWithRequiredFormat($("#" + formId + " #contractEndDate").val() + ' 23:59 PM',DISPLAY_DATE_AND_TIME,USER_TIMEZONE,DATETIME_UTC_FORMATTER),
		durationYears: parseInt($("#contractDuration").val()),
        commentData: editor.getEditorValue(),
        validityStart: convertLocalToUTCWithRequiredFormat($("#" + formId + " #validityStartDate").val() + ' 00:00 AM',DISPLAY_DATE_AND_TIME,USER_TIMEZONE,DATETIME_UTC_FORMATTER),
        validityEnd: convertLocalToUTCWithRequiredFormat($("#" + formId + " #validityEndDate").val() + ' 23:59 PM',DISPLAY_DATE_AND_TIME,USER_TIMEZONE,DATETIME_UTC_FORMATTER),
		validityDays: parseInt($("#validityDuration").val()),
        sessionUserId: parseInt(USER_ID),
        actionType: "D",
        b2bLeadId: parseInt(b2bLeadId),
        pUserId: parseInt($("#" + formId + " #contractPartnerType").attr("data-partner-user-id")),
        entityId: parseInt(b2bLeadId),
        entityType: "B2B_REQUEST"
    };

    return requestData;
}

async function saveContractDetails(formId, b2bLeadId){
	if(validateAddContractForm(formId)){
		var payload = getAddContractPayload(formId, b2bLeadId);
		var data = await getDashboardDataBasedUrlAndPayloadWithParentUrlForContract(true, "Contract save successfully","save-partner-contract-details", payload, "");
		if (data.status == '0' || data.status == '2' || data.status == '3') {
			showMessageTheme2(0, data.message);
		}else{
			showMessageTheme2(1, data.message);
			$("#contractId").val(data.contractId);
			$("#b2bLeadId").val(data.b2bLeadId);
			if(data.status == "1"){
				tableCenter();
				$("#publishContractDetailsBtn").show();
				showMessageTheme2(1, data.message);
			}
		}
	}
}

async function publishContractDetails() {
	if($("#contractId").val() == null || $("#contractId").val() == undefined || $("#contractId").val() == ""){
		showMessageTheme2(0, "Contract ID required");
		return false;
	}
	var b2bLeadId = $("#b2bLeadId").val();
	var payload ={
		actionType:"P",
		b2bLeadId:parseInt(b2bLeadId),
		contractId:parseInt($("#contractId").val()),
		sessionUserId:USER_ID
	}
	var response =  await getDashboardDataBasedUrlAndPayloadWithParentUrlForContract(true, true,"save-partner-contract-details", payload, "");
	if (response.status == '0' || response.status == '2' || response.status == '3') {
		showMessageTheme2(0, response.message);
	}else{
		showMessageTheme2(1, response.message);
		$("#b2bContractModal").modal("hide");
		$("#addContractB2b_" + b2bLeadId).addClass("d-none");
		$("#addContractB2b_" + b2bLeadId).removeClass("d-inline-block");
		$("#editContractB2b_" + b2bLeadId).removeClass("d-none");
		// $("#publishContractDetailsBtn").hide();
	}
}


async function getEmailLogList(requestType, contractId){
	var payload = {};
	if(requestType == "V"){
		payload['b2bleadId'] = parseInt($("#b2bLeadId").val());
		payload['contractId'] = parseInt(contractId);
		payload['actionType'] = "V";
		payload = "?payload="+encode(JSON.stringify(payload));
		responseData = await getDashboardDataBasedUrlAndPayloadWithParentUrlGET(true, true, 'partner-contract-details'+payload, '');
		$("#viewB2BContractModal .modal-body").html(viewContractModalBody(responseData.details));
		var cleanedCommentData = cleanBase64Images(responseData.details.commentData);
		$("#viewB2BContractModal #editorData").html(cleanedCommentData);
		$("#viewB2BContractModal").modal("show");
	}else{
		payload['b2bleadId'] = parseInt($("#b2bLeadId").val());
		payload = "?payload="+encode(JSON.stringify(payload));
		responseData = await getDashboardDataBasedUrlAndPayloadWithParentUrlGET(true, false, 'get-all-partner-contracts'+payload, '');
		if (responseData.status == '0' || responseData.status == '2' || responseData.status == '3') {
			showMessageTheme2(0, responseData.message);
		}else{
			var html=``;
			if(responseData.details.length>0){
				$.each(responseData.details, function(i,v){
					html+=
					`<tr>
						<td class="text-center">${i+1}</td>
						<td class="text-center">
							<a href="javascript:void(0)" class="btn btn-sm btn-primary" onclick="getEmailLogList(\'V\',\'${v.contractId}\')">
								<i class="fa fa-eye"></i>&nbsp;View
							</a>
						</td>
						<td class="text-center">${v.publishedDate == ""? "N/A":convertU2L(v.publishedDate, USER_TIMEZONE, DISPLAY_DATE_ONLY)}</td>
						<td class="text-center">
							<span>${v.validityStart == ""? "N/A":convertU2L(v.validityStart, USER_TIMEZONE, DISPLAY_DATE_ONLY)} To ${v.validityEnd == ""? "N/A":convertU2L(v.validityEnd, USER_TIMEZONE, DISPLAY_DATE_ONLY)}</span>
						</td>
						<td class="text-center">${v.createdByName}</td>
						<td class="text-center">${v.acceptDate == ""? "N/A":convertU2L(v.acceptDate, USER_TIMEZONE, DISPLAY_DATE_ONLY)}</td>
					</tr>`;
				});
				$("#emailLogsTable #emailLogsTableBody").html(html);
			}else{
				html+=
					`<tr>
						<td class="text-center" colspan="6">No record found</td>
					</tr>`
				$("#emailLogsTable #emailLogsTableBody").html(html)
			}
		}
	}
	
	// console.log("email log", responseData);
	
	if(requestType != "V"){
		
	}
}

function viewContractModalBody(data){
	var html=
	`<div class="full">
		<div class="full">
			<img src="${schoolSettingsLinks.logoUrl+SCRIPT_VERSION}" style="max-width:300px;width:100%"/>
		</div>
		<div class="w-100 d-flex justify-content-between my-4">
			<div>
				<p class="m-0">${data.name}</p>
				<p class="m-0">${data.countryName}</p>
				<p class="m-0">${data.stateName}</p>
				<p class="m-0">${data.cityName}</p>
			</div>
			<div calss="ml-auto">
				<p class="m-0"><b>Date: </b>${data.createdAt == ""? "N/A":convertU2L(data.createdAt, USER_TIMEZONE, DISPLAY_DATE_ONLY)}</p>`;
				if(data.createdAt != ""){
					var time = data.createdAt;
					time=time.split(" ");
					time = time[1].split(":");
					html+=`<p class="m-0"><b>Time: </b>${data.createdAt == ""? "N/A":`${time[0]}:${time[1]}${time[0]>=12?"PM" : "AM"}`}</p>`;
				}
			html+=`</div>
		</div>
		<div id="editorData"></div>
		${/*<div class="full">
			<div class="signuture py-3">
				<img src="${PATH_FOLDER_IMAGE2}paulsignature.png${SCRIPT_VERSION}" style="max-width:120px;width:100%"/>
			</div>
			<div class="signuture">
				<p class="m-0">${data.createdByName}</p>
				<p class="m-0">${data.schoolName}</p>
				<p class="m-0">(Authorised Signatory for International Schooling)</p>
			</div>
		</div>*/''}
		<div class="full mt-4">
			<div class="d-flex">
				<p class="m-0"><b>Address:</b> ${data.schoolLocation}</p>
				${/*<p class="m-0 ml-auto">${data.name}</p>*/''}
			</div>
			
			${data.publishedDate != ""? `<p class="m-0"><b>Date:</b> ${changeDateFormat(new Date(data.publishedDate), "MMM dd, yyyy hh:mm A")}</p>`:``}
		</div>
	</div>`;
	return html;
}

function calculateContractEndDate() {
    var startDate = $("#contractStartDate").val();
    var duration = parseInt($("#contractDuration").val());
    if (startDate && duration) {
        var sDate = new Date(startDate);
        var eDate = new Date(sDate);
        eDate.setFullYear(sDate.getFullYear() + duration);
        var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var endDateFormatted = monthNames[eDate.getMonth()] + " " + (eDate.getDate() > 9 ? eDate.getDate() : "0" + eDate.getDate()) + ", " + eDate.getFullYear();
        $("#contractEndDate").val(endDateFormatted);
    } else {
        $("#contractEndDate").val("");
    }
}
function calculateValidityEndDate() {
    var startDate = $("#validityStartDate").val();
    var duration = parseInt($("#validityDuration").val());
    if (startDate && duration) {
        var sDate = new Date(startDate);
        var eDate = new Date(sDate);
        eDate.setDate(sDate.getDate() + duration);
        var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var endDateFormatted = monthNames[eDate.getMonth()] + " " + (eDate.getDate() > 9 ? eDate.getDate() : "0" + eDate.getDate()) + ", " + eDate.getFullYear();
        $("#validityEndDate").val(endDateFormatted);
    } else {
        $("#validityEndDate").val("");
    }
}

function signatureTable(partnerType, organisationName) {
	var $editorContent = $("#editorData").length ? $("#editorData") : $(".jodit-workplace");
	if ($editorContent.find("#leftSignatureBox").length || $editorContent.find("#rightSignatureBox").length) {
		return;
	}
	var resellerName = "";
	var resellerBracket = "";
	if (partnerType === "I" && !organisationName) {
		resellerName = $("#partnerName").val();
		resellerBracket = "(As Individual)";
	} else if (partnerType === "O") {
		resellerName = organisationName || $("#partnerName").val();
		var shortForm = resellerName
			.split(/\s+/)
			.map(w => w[0])
			.join("")
			.toUpperCase();
		resellerBracket = `(${shortForm})`;
	} else {
		resellerName = $("#partnerName").val();
		resellerBracket = "(Reseller)";
	}
	var html = `
	  <table border="1" style="border-collapse:collapse; width:100%; text-align:center;">
		<tbody>
		  <tr>
			<td style="width:50%; padding:10px; vertical-align:top;">
			  For <b>INTERNATIONAL SCHOOLING PTE. LTD.</b><br/>
			  (ISPL)
			  <div id="leftSignatureBox" style="margin-top:40px; min-height:80px;"></div>
			  <p style="margin:0;"><i>(Signature)</i></p>
			</td>
			<td style="width:50%; padding:10px; vertical-align:top;">
			  For <b><span id="resellerName" class="txt-capitalize-case">${resellerName}</span></b><br/>
			  ${resellerBracket}
			  <div id="rightSignatureBox" style="margin-top:40px; min-height:80px;"></div>
			  <p style="margin:0;"><i>(Signature)</i></p>
			</td>
		  </tr>
		  <tr>
			<td style="padding:10px; text-align:left; font-size:14px;">
			  Authorized Signatory - <span id="leftSignatoryName" class="txt-capitalize-case">${$("#firstPartnerName").val()}</span><br/>
			  Designation – <span id="leftDesignation" class="txt-capitalize-case">${$("#firstPartnerDesignation").val()}</span><br/>
			  Date: <span id="leftDate">${changeDateFormat(new Date(), "MMM-dd-yyyy")}</span>
			</td>
			<td style="padding:10px; text-align:left; font-size:14px;">
			  Authorized Signatory - <span id="rightSignatoryName" class="txt-capitalize-case">${$("#partnerName").val()}</span><br/>
			  Designation – <span id="rightDesignation" class="txt-capitalize-case">${$("#partnerDesignation").val()}</span><br/>
			  Date: <span id="rightDate">____</span>
			</td>
		  </tr>
		</tbody>
	  </table>
	  <br/>`;
	editor.s.setCursorIn(editor.editor, false); 
	editor.s.insertHTML(html);
}

function bindContractFormEvents(partnerType) {
	if (partnerType == "I") {
		$("#partnerName").off("input").on("input", function () {
			$("#resellerName").text($(this).val());
			$("#rightSignatoryName").text($(this).val());
		});
	} else {
		$("#partnerName").off("input").on("input", function () {
			$("#rightSignatoryName").text($(this).val());
		});
	}
	$("#firstPartnerName").off("input").on("input", function () {
		$("#leftSignatoryName").text($(this).val());
	});
	$("#firstPartnerDesignation").off("input").on("input", function () {
		$("#leftDesignation").text($(this).val());
	});
	$("#partnerDesignation").off("input").on("input", function () {
		$("#rightDesignation").text($(this).val());
	});
}

function replaceContractPlaceholders(editor, pasteData) {
	const firstPartner = $("#firstPartnerName").val() || "";
	const secondPartner = $("#partnerName").val() || "";

	const replacements = [
	  { regex: /#FIRST_PARTY_NAME#/gi, value: firstPartner },
	  { regex: /#SECOND_PARTY_NAME#/gi, value: secondPartner }
	];
  
	if (pasteData?.html) {
	  replacements.forEach(r => {
		pasteData.html = pasteData.html.replace(r.regex, r.value);
	  });
	  return;
	}
  
	let content = editor.value || "";
	replacements.forEach(r => {
	  content = content.replace(r.regex, r.value);
	});
  
	if (content !== editor.value) {
	  editor.value = content;
	}
}



// function checkPreviewButtonVisibility() {
//     var editorContent = $("#editorData").text().trim() || $(".jodit-wysiwyg").text().trim();
//     var hasFile = $("#recipientSignatureUpload")[0].files.length > 0;
//     if (editorContent.length > 0 && hasFile) {
//         $("#previewContractBtn").show();
//     } else {
//         $("#previewContractBtn").hide();
//     }
// }

	
function getEnrollmentPartnerPaymentDetails() {
	if($("#originalPartnerType").val() == "WLP"){
		entityId = $('#pSchoolId').val();
		entityType = "SCHOOL";
	}else{
		entityId = $("#partnerUserB2BSaveForm #rawLeadId").val();
		entityType = "INDIVIDUAL";
	}
	let payload = {
		entityId,
		entityType
	}
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: BASE_URL + CONTEXT_PATH + '/' + SCHOOL_ID + '/dashboard/get-partner-payment-options',
		dataType: 'json',
		data : JSON.stringify(payload),
		async: false,
		success: function (data) {
			console.log(data);
			if (data.status) {
				let isStripeActive = false;
				let isAirwallexActive = false;
				$("#paymentOptions").html(paymentOptionsContent(data.pgList));
				$.each(data.pgList, function (index, item) {
					if (!Array.isArray(item.paymentGatway)) {
						if (item.getwayName == 'WIRETRANSFER') {
							$('#WIRETRANSFER').prop("checked", item.active == 'Y').prop("initValue", item.active == 'Y').prop("paymentId", item.id);
						} else if (item.getwayName == 'CASH') {
							$('#CASH').prop("checked", item.active == 'Y').prop("initValue", item.active == 'Y').prop("paymentId", item.id);
						}
						else if (item.getwayName == 'GENERATE_FEE') {
							$('#GENERATE_FEE').prop("checked", item.generateFeeReceiptFromSystem == 'Y').prop("initValue", item.generateFeeReceiptFromSystem == 'Y');
						}
						else if (item.getwayName == 'ENROLLMENT_PAYMENT') {
							$('#ENROLLMENT_PAYMENT').prop("checked", item.showPaymentAtEnrollment == 'Y').prop("initValue", item.showPaymentAtEnrollment == 'Y');
						}
					}else{
						$.each(item.paymentGatway, function(i,v){
							if (v.getwayName.toUpperCase() == 'STRIPE') {
								isStripeActive = v.active == 'Y';
								$('#STRIPE').prop("checked", isStripeActive).prop("initValue", isStripeActive).prop("paymentId", v.id);
							} else if (v.getwayName.toUpperCase() == 'AIRWALLEX') {
								isAirwallexActive = v.active == 'Y';
								$('#AIRWALLEX').prop("checked", isAirwallexActive).prop("initValue", isAirwallexActive).prop("paymentId", v.id);
							}
						});
					}
				});
				let finalToggle = (isStripeActive || isAirwallexActive);

				$('#PAYMENTGATEWAY').prop("checked", finalToggle);

				if (finalToggle) {
					$('#paymentGatewaysDiv').show();
				}
			} else {
				showMessageTheme2(0, data.message);
			}
		}
	});
}

function getUpdatePartnerPaymentRequest() {
	
		

	console.log(PAYMENTGETWAY)
    const payload = {};
    const updateRequest = [];

    PAYMENTGETWAY.forEach(id => {
        const element = $('#' + id);
        const initValue = element.prop("initValue");
        const isChecked = element.is(":checked");
        const paymentId = element.prop("paymentId");

        if (paymentId && initValue !== isChecked) {
            updateRequest.push({
                id: parseInt(paymentId),
                value: isChecked ? 'Y' : 'N'
            });
        }
    });
	payload["updateRequest"] = updateRequest;
	if($("#originalPartnerType").val() == "WLP"){
		entityId = $('#pSchoolId').val();
		entityType = "SCHOOL";
	}else{
		entityId = $("#partnerUserB2BSaveForm #rawLeadId").val();
		entityType = "INDIVIDUAL";
	}
	payload['entityId'] = entityId;
	payload['entityType'] = entityType;
	payload['generateFeeReceiptFromSystem']=$("#GENERATE_FEE").is(":checked") ? 'Y' : 'N';
	payload['showPaymentAtEnrollment']=$("#ENROLLMENT_PAYMENT").is(":checked") ? 'Y' : 'N';

    console.log("Update Request →", updateRequest);
    return JSON.stringify(payload);
}

function updateEnrollmentPartnerPaymentDetails() {
    let schoolId = $('#pSchoolId').val();
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: BASE_URL + CONTEXT_PATH + '/' + SCHOOL_ID + '/dashboard/update-partner-payment-options',
        data: getUpdatePartnerPaymentRequest(),
        dataType: 'json',
        async: false,
        success: function (data) {
            if (data.status == "1") {
                showMessageTheme2(1, data.message);

                PAYMENTGETWAY.forEach(id => {
                    const el = $('#' + id);
                    el.prop("initValue", el.is(":checked"));
                });
				if($("#originalPartnerType").val() == 'WLP'){
					$("#themeTab").tab("show");
					updatePartnerProgressBar();
				}
            } else {
                showMessageTheme2(0, data.message);
            }
        },
        error: function (e) {
            showMessageTheme2(0, 'Exception');
        }
    });
}

async function callLeadAssignUserListBySchoolId(formId, value, elementId, keyStatus, discardPermission, userId, selectStatus) {
    hideMessageTheme2('');
    customLoader(false);
	let schoolId = $("#leadDemoSchoolMove").val();
    const payload = getRequestForLeadAssign(formId, 'LEAD-ASSIGN-USER-LIST', value, discardPermission, userId, schoolId);

    try {
        const data = await getDashboardDataBasedUrlAndPayloadWithParentUrl(true, true, 'masters', payload, 'api/v1/common');

        if (data.status === '0' || data.status === '2') {
            showMessageTheme2(true, data.message);
            return null;
        }

        const result = data.mastersData.data;
        const $dropdown = $("#" + formId + " #" + elementId);
        $dropdown.html('');
        $dropdown.append('<option value="0">Select Assign</option>');

        $.each(result, function(k, v) {
            if (keyStatus) {
                if (discardPermission) {
                    $dropdown.append(`<option value="${v.key}">${v.value} - (${v.extra})</option>`);
                } else {
                    if (selectStatus) {
                        $dropdown.append(`<option value="${v.key}" ${v.key == userId ? 'selected' : ''}>${v.value} - (${v.extra})</option>`);
                    } else {
                        $dropdown.append(`<option value="${v.key}">${v.value} - (${v.extra})</option>`);
                    }
                }
            } else {
                $dropdown.append(`<option value="${v.value}">${v.value}</option>`);
            }
        });

        return result;
    } catch (err) {
        console.error("Error occurred:", err);
        throw err;
    }
}

function callCounselorReview(modeSearch, eventId, startDate, endDate) {
	data={};
	data['modeSearch']=modeSearch;
	data['startDate']=startDate;
	data['endDate']=endDate;
	data['userId']=USER_ID;
	data['schoolId']=SCHOOL_ID;

	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLForHTML('dashboard', 'lead-counselor-review'),
		data : JSON.stringify(data),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			console.log("counselor review", data);
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				if(data.modeSearch=='CUSTOM'){
					$(".hideReviewdate").css({"display":"block"});
					$("#dataReviewStartDate").val(data.startDate);
					$("#dataReviewEndDate").val(data.endDate);
					$("#searchReviewtype").val(data.modeSearch);
				}
				var html=getLeadCounselorReviewHtml(data.counselorReviewList);
				$("#"+eventId).html(html);
			}
		}
	});
}

function getLeadCounselorReviewHtml(counselorReviewList){
	var html = '<tr>';
	if(counselorReviewList.length > 0){
		var ind=1;
		var finalScore=0;	
		var totalFinalScore=0;
		var totalLeadRating=0;
		$.each(counselorReviewList, function(i,v){
			html+=`<tr>`;
			html+=`<td class="text-center">${ind}</td>`;
			html+=`<td class="text-left">${v.assignName}</td>`;

			var leadData1 = v.leadData;

			if(leadData1.length > 0){
				$.each(leadData1, function(j, ld){
					var headTitleName='';
					if(ld.dataType=='RESPONSE-TYPE'){
						headTitleName='Response Time';
					}else if(ld.dataType=='LEAD-DEMO'){
						headTitleName='Lead Demo';
					}else if(ld.dataType=='DEMO-ENROLL'){
						headTitleName='Demo to Enroll';
					}else if(ld.dataType=='LEAD-ENROLL'){	
						headTitleName='Lead to Enroll';
					}else if(ld.dataType=='MEETING-JOIN'){
						headTitleName='Meeting Join';
					}else if(ld.dataType=='ENROLL-TIME'){
						headTitleName='Enroll Time';
					}

					if(ld.dataType=='RESPONSE-TYPE' || ld.dataType=='LEAD-DEMO' || ld.dataType=='DEMO-ENROLL'
						|| ld.dataType=='LEAD-ENROLL' || ld.dataType=='MEETING-JOIN' || ld.dataType=='ENROLL-TIME'){
						html+=`<td class="text-center"><a href="javascript:void(0);"  onclick="callCounselorDetailReview('CUSTOM','${v.assignTo}', 'leadCounselorDetailReviewtbl', '', '', '${headTitleName}', '${ld.dataType}','0','10');">${ld.finalScore>=0 ? ld.finalScore : '-'} /10</a></td>`;
					}else{
						html+=`<td class="text-center">0</td>`;
					}

					finalScore+=parseFloat(ld.finalScore>=0 ? ld.finalScore : 0);
					if(ld.finalScore>=0){
						totalLeadRating+=1;
					}
				});
				if(finalScore>=0 && totalLeadRating){
					totalFinalScore	=finalScore/totalLeadRating;
				}else{
					totalFinalScore=0;
				}
				var bgColorStype='bg-secondary text-white';
				if(totalFinalScore>=8){
					bgColorStype='bg-success text-white';
				}else if(totalFinalScore>=5 && totalFinalScore<8){
					bgColorStype='bg-warning';
				}else{
					bgColorStype='bg-danger text-white';
				}
				html+=`<td class="text-center font-weight-bold ${bgColorStype}">${Number((totalFinalScore).toFixed(1))} /10</td>`;
				ind++;
				totalFinalScore=0;
				finalScore=0;
				totalLeadRating=0;
			}else{
				totalFinalScore=0;
				finalScore=0;
				totalLeadRating=0
			}
			html+=`</tr>`;
			
		});
		
	}else{
		html+=`<tr><td class="text-center" colspan="8">No record found</td></tr>`;
	}
	return html;
	
}

function renderB2bAttachment(discardPermission, userId, leadId){
	var html=b2bAttachmentModal(discardPermission, userId, leadId)+getChatImageCropContent()+pdfPreview()+deleteWarning();
	$('#b2bAttachmentUploadWrapper').html(html);
	//initChatCrop()
	$("#b2bAttachmentDate").datepicker({
		format : 'M dd, yyyy',
	    autoclose: true,
	});
	uploadedB2bAttachmentsLogs(discardPermission, userId, leadId)
	$('#b2bAttachmentModal').modal({ backdrop: 'static', keyboard: false })
}

function getRequestForB2bAttachments(userId, leadId, documentsFor){
	var b2bAttachmentRequest = {};
	b2bAttachmentRequest['userId'] = userId;
	b2bAttachmentRequest['entityId'] = leadId;
	b2bAttachmentRequest['entityType'] = 'LEADS';
	b2bAttachmentRequest['documentsFor'] = documentsFor;
	return b2bAttachmentRequest;
}

function getB2bAttachmentDetails(userId, leadId, documentsFor) {
	var responseData={};
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : BASE_URL + CONTEXT_PATH + SCHOOL_UUID +'/api/v1/leads/b2b-attachment-details',
		data : JSON.stringify(getRequestForB2bAttachments(userId, leadId, documentsFor)),
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

function getRequestForB2bAttachmentLog(userId, leadId, documentsFor){
	var b2bAttachmentRequest = {};
	b2bAttachmentRequest['entityType'] = 'LEADS';
	b2bAttachmentRequest['entityId'] = leadId;
	b2bAttachmentRequest['userId'] = userId;
	b2bAttachmentRequest['b2bAttachmentName'] = $('#b2bAttachmentName').val();
	b2bAttachmentRequest['b2bAttachmentDate'] = $('#b2bAttachmentDate').val();
	b2bAttachmentRequest['uploadDocuments'] = getUploadedDocuments();
	return b2bAttachmentRequest;
}
function saveB2bAttachmentLogs(discardPermission, userId, leadId, documentsFor, dataInputID, uploadInputDivId){
	if ($("#b2bAttachmentName").val()=='') {
		showMessageTheme2(0, 'Enter Document Name','',true);
		return false
	}
	if ($("#"+dataInputID).val()=='') {
		showMessageTheme2(0, 'Select date.','',true);
		return false
	}
	if ($("#"+uploadInputDivId).attr("uploaded")!='Y') {
		showMessageTheme2(0, 'Please upload a document.','',true);
		return false
	}
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : BASE_URL + CONTEXT_PATH + SCHOOL_UUID +'/api/v1/leads/save-b2b-attachment-log',
		data : JSON.stringify(getRequestForB2bAttachmentLog(userId, leadId, documentsFor)),
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
				uploadedB2bAttachmentsLogs(discardPermission, userId, leadId);
				resetB2bAttachmentFormElement();
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
	function ensureMultipleTimeApplyBlinkStyle() {
		if (document.getElementById('multiple-time-apply-blink-style')) {
			return;
		}
		var style = document.createElement('style');
		style.id = 'multiple-time-apply-blink-style';
		style.textContent =
			'@keyframes multipleTimeApplyBlink {' +
				'0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(190, 24, 93, 0.20); transform: scale(1); }' +
				'50% { opacity: 0.9; box-shadow: 0 0 0 10px rgba(217, 70, 239, 0.32); transform: scale(1.05); }' +
			'}' +
			'.multiple-time-apply-blink {' +
				'animation: multipleTimeApplyBlink 1.1s ease-in-out infinite;' +
				'background: linear-gradient(135deg, #c026d3, #a21caf) !important;' +
				'border-color: #86198f !important;' +
				'color: #fff !important;' +
				'font-weight: 700;' +
			'}';
		document.head.appendChild(style);
	}

	async function getLeadStatusLogHistory(leadId) {
    try {
        var request = {
            leadId: leadId
        };
        var data = await getDashboardDataBasedUrlAndPayloadWithParentUrl(false, false, 'lead-status-log-history', request, 'api/v1/leads');

        if (!data) return;

		console.log(data);

        // var leadTagging = "<b>" + data.leadTagging + "</b>";
        // $(".leadtagstatus_" + leadno).html(leadTagging);

        if (data.status === '0' || data.status === '2') {
            // showMessageTheme2(0, data.message, '', true);
            return;
        }
        if(data.data.length>1){
			ensureMultipleTimeApplyBlinkStyle();
			var sr=1;
			var html=''
			html+=`<div class="dropdown d-inline-block">
					<button type="button" aria-haspopup="true" aria-expanded="false" data-toggle="dropdown" class="dropdown-toggle btn btn-sm btn-primary multiple-time-apply-blink">Multiple time apply (${data.data.length})</button>
					<div tabindex="-1" role="menu" aria-hidden="true" class="dropdown-menu-xl dropdown-menu" x-placement="top-start" style="position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(-111px, -384px, 0px);">
					<table style="font-size:11px !important; width:1300px;"><tbody>
					<tr><th class="text-center bg-primary text-white">Sr. No.</th>
					<th class="text-center bg-primary text-white">Lead No</th>
					<th class="text-center bg-primary text-white">Lead Name</th>
					<th class="text-center bg-primary text-white">Source</th>
					<th class="text-center bg-primary text-white">Campaign</th>
					<th class="text-center bg-primary text-white">Ad</th>
					<th class="text-center bg-primary text-white">Ad Set</th>
					<th class="text-center bg-primary text-white">Lead Date</th>
					<th class="text-center bg-primary text-white">Active</th>
					<th class="text-center bg-primary text-white">Added Type</th></tr>`;
				for (let i = 0; i < data.data.length; i++) {
					const leadDatass = data.data[i];
					html+=`<tr><td class="text-center">${sr}</td>
					<td>${leadDatass.leadNo}</td>
					<td>${leadDatass.leadName}</td>
					<td>${leadDatass.sourceName}</td>
					<td>${leadDatass.utmCampaign}</td>
					<td>${leadDatass.utmMedium}</td>
					<td>${leadDatass.utmDescription}</td>
					<td>${leadDatass.edate}</td>
					<td>${leadDatass.activeStatus}</td>
					<td>${leadDatass.addedType}</td></tr>`;
					sr=sr+1;
				}
					html+=`</tbody></table></div>`;

			$(".leadMultipletimes_" + leadId).html(html);
		}


    } catch (error) {
        console.error("Error in getLeadStatusLog:", error);
    }
}
