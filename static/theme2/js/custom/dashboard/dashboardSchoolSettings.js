

var newId ="";
function getSchoolSettingDetails() {
	var schoolId=$('#schoolSettigsSelection').val();
	hideMessage('');
	$.ajax({
		type : "GET",
		url : getURLForHTML('dashboard','school-settings-details'),
		data : "SCHOOLID="+schoolId,
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
        			}else {
        				showMessage(true, stringMessage[1]);
        			}
        		} else {
        			$('#schoolSettingsContent').hide();
        			$('#schoolSettingsOnChangeData').html(htmlContent);
        			$('#schoolSettingsOnChangeData').show();
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

function saveSchoolSettings(formId, schoolId, updateFor) {
	hideMessage('');
	if(!validateRequestForSchoolSettings(formId, schoolId, updateFor)){
		return false;
	}
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForHTML('dashboard','send-referralcode-to-user'),
		data : JSON.stringify(getRequestForUserReferral(formId, moduleId,isForSpecificUser)),
		dataType : 'json',
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				showMessage(true, data['message']);
				$('#sendReferralModal').modal('hide');
			}
			return false;
		}
	});
}

function validateRequestForSchoolSettings(formId, schoolId, updateFor){
	return true;
}

function getRequestForUserReferral(formId, schoolId, updateFor){
	var request = {};
	var authentication = {};
	var counselorReferralDTO = {};
	var emailStr = "";

	counselorReferralDTO['id'] = $("#"+formId+" #referralSendId").val();
	counselorReferralDTO['counselorId'] = $("#"+formId+" #counselorId").val();
	counselorReferralDTO['referralCode'] = $("#"+formId+" #referralCode").val();
	//counselorReferralDTO['emailId'] = $("#"+formId+" #emailId").val();
	$("input[name='emailId']").each(function() {
		emailStr = emailStr + $(this).val()+",";
	});
	counselorReferralDTO['emailId'] = emailStr;
	authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = moduleId;
	authentication['userId'] = $("#"+formId+" #userId").val();
	request['authentication'] = authentication;
	request['data'] = counselorReferralDTO;

	return request;
}

function saveSchoolSettingData(formId, moduleName, settingId,schoolId){

	$("#errMsg").text('');
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForHTML('dashboard','save-school-setting-lms-role-pg-data'),
		data : JSON.stringify(getRequestForSaveSchoolSettingData(formId,moduleName, settingId,schoolId)),
		dataType : 'json',
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				$("#errMsg").text(data['message'])
				$("body,html").animate({scrollTop: $("#errMsg").offset().top -70}, 800);
			} else {
				$("#errMsg").text(data['message'])
				$("body,html").animate({scrollTop: $("#errMsg").offset().top -70}, 800);
			}
			return false;
		}
	});
}

function getRequestForSaveSchoolSettingData(formId,moduleName,settingId,schoolId){
	request = {};
	var authentication = {};
	//var requestData = {};
	var schoolSettingLmsDTO = {};
	if(moduleName=='PG'){
		schoolSettingLmsDTO['gatewayName'] = $("#"+formId+" #paymentGateway").val();
		schoolSettingLmsDTO['gatewayMode'] = $("#"+formId+" #gatewayMode").val();
		schoolSettingLmsDTO['endpointUrl'] = $("#"+formId+" #endPointUrl").val();
		schoolSettingLmsDTO['merchantEmail'] = $("#"+formId+" #merchantEmail").val();
		schoolSettingLmsDTO['secretKey'] = $("#"+formId+" #secretKey").val();
		schoolSettingLmsDTO['clientId'] = $("#"+formId+" #clientId").val();
		schoolSettingLmsDTO['paymentModeIp'] =$("#"+formId+" #paymentModeIp").val();
		if($("#"+formId+" #pgStatus").val() =='ACTIVE'){
			schoolSettingLmsDTO['status'] = 'Y';
		}else{
			schoolSettingLmsDTO['status'] = 'N';
		}
	}else if(moduleName=='LMSSM'){
		schoolSettingLmsDTO['domainId'] = $("#"+formId+" #domainId").val();
		schoolSettingLmsDTO['domainName'] = $("#"+formId+" #domainName").val();
		schoolSettingLmsDTO['lmsLoginUrl'] = $("#"+formId+" #lmsLoginUrl").val();
		schoolSettingLmsDTO['userSpace'] = $("#"+formId+" #userSpace").val();
		schoolSettingLmsDTO['prefixStudent'] = $("#"+formId+" #prefixStudent").val();
		schoolSettingLmsDTO['prefixTeacher'] = $("#"+formId+" #prefixTeacher").val();
		schoolSettingLmsDTO['prefixAdmin'] = $("#"+formId+" #prefixAdmin").val();
		if($("#"+formId+" #schoolLmsStatus").val() =='ACTIVE'){
			schoolSettingLmsDTO['status'] = 'Y';
		}else{
			schoolSettingLmsDTO['status'] = 'N';
		}
		var lmsProvider = $("#"+formId+" #lmsProviderId").val();
		if(lmsProvider === 'Buzz'){
			schoolSettingLmsDTO['lmsProviderId'] = 31;
		}else if(lmsProvider =='Agilix Buzz'){
			schoolSettingLmsDTO['lmsProviderId'] =1;
		}else if(lmsProvider =='Odysseyware'){
			schoolSettingLmsDTO['lmsProviderId'] = 2;
		}else if(lmsProvider =='BUZZ-GC'){
			schoolSettingLmsDTO['lmsProviderId'] = 37;
		}else if(lmsProvider ==='BUZZ'){
			schoolSettingLmsDTO['lmsProviderId'] = 36;
		}else if(lmsProvider =='BUZZ-GR'){
			schoolSettingLmsDTO['lmsProviderId'] = 38;
		}else if(lmsProvider =='Exact-Path'){
			schoolSettingLmsDTO['lmsProviderId'] = 39;
		}else if(lmsProvider =='Edmentum-Canvas'){
			schoolSettingLmsDTO['lmsProviderId'] = 40;
		}else if(lmsProvider =='Courseware'){
			schoolSettingLmsDTO['lmsProviderId'] = 41;
		}else{
			schoolSettingLmsDTO['lmsProviderId'] = 41;
		}
	}else if(moduleName=='LMSRM'){
		schoolSettingLmsDTO['roleName'] = $("#"+formId+" #rolelmsRoleName"+settingId).val();
		schoolSettingLmsDTO['roleLmsId'] = $("#"+formId+" #roleLmsId"+settingId).val();
		if($("#"+formId+" #roleLmsStatus"+settingId).val() =='ACTIVE'){
			schoolSettingLmsDTO['status'] = 'Y';
		}else{
			schoolSettingLmsDTO['status'] = 'N';
		}
		var lmsProvider = $("#"+formId+" #rolelmsProvider"+settingId).val();
		if(lmsProvider === 'Buzz'){
			schoolSettingLmsDTO['lmsProviderId'] = 31;
		}else if(lmsProvider =='Agilix Buzz'){
			schoolSettingLmsDTO['lmsProviderId'] =1;
		}else if(lmsProvider =='Odysseyware'){
			schoolSettingLmsDTO['lmsProviderId'] = 2;
		}else if(lmsProvider =='BUZZ-GC'){
			schoolSettingLmsDTO['lmsProviderId'] = 37;
		}else if(lmsProvider ==='BUZZ'){
			schoolSettingLmsDTO['lmsProviderId'] = 36;
		}else if(lmsProvider =='BUZZ-GR'){
			schoolSettingLmsDTO['lmsProviderId'] = 38;
		}else if(lmsProvider =='Exact-Path'){
			schoolSettingLmsDTO['lmsProviderId'] = 39;
		}else if(lmsProvider =='Edmentum-Canvas'){
			schoolSettingLmsDTO['lmsProviderId'] = 40;
		}else if(lmsProvider =='Courseware'){
			schoolSettingLmsDTO['lmsProviderId'] = 41;
		}else{
			schoolSettingLmsDTO['lmsProviderId'] = 41;
		}
	}else if(moduleName=='SSO'){
		schoolSettingLmsDTO['schoolUuid'] = $("#"+formId+" #schoolUuid").val();
		schoolSettingLmsDTO['schoolName'] = $("#"+formId+" #schoolDisplayName").val();
		schoolSettingLmsDTO['address'] = $("#"+formId+" #schoolAddress").val();
		schoolSettingLmsDTO['contactEmail'] = $("#"+formId+" #contactEmail").val();
		schoolSettingLmsDTO['whatsAppCode'] = $("#"+formId+" #whatsAppCode").val();
		schoolSettingLmsDTO['whatsAppContact'] = $("#"+formId+" #whatsAppContact").val();
		schoolSettingLmsDTO['schoolContactCode'] = $("#"+formId+" #schoolContactCode").val();
		schoolSettingLmsDTO['schoolContact'] = $("#"+formId+" #contactNumber").val();
		schoolSettingLmsDTO['landlineCode'] = $("#"+formId+" #lanlineCode").val();
		schoolSettingLmsDTO['landlineContact'] = $("#"+formId+" #landlineContact").val();
		schoolSettingLmsDTO['schoolTimeZone'] = $("#"+formId+" #schoolTimezone").val();

	}else if(moduleName=='SSL'){
		schoolSettingLmsDTO['schoolWebsite'] = $("#"+formId+" #website").val();
		schoolSettingLmsDTO['logoUrl'] = $("#"+formId+" #logoUrl").val();
		schoolSettingLmsDTO['emailLogoUrl'] = $("#"+formId+" #emailLogoUrl").val();
		schoolSettingLmsDTO['favIconUrl'] = $("#"+formId+" #favUrl").val();
		schoolSettingLmsDTO['signupUrl'] = $("#"+formId+" #signupUrl").val();
		schoolSettingLmsDTO['ticketRaisedUrl'] = $("#"+formId+" #ticketRaisedUrl").val();
		schoolSettingLmsDTO['termsOfUserUrl'] = $("#"+formId+" #termsUrl").val();
		schoolSettingLmsDTO['privacyPolicyUrl'] = $("#"+formId+" #privacyPolicyUrl").val();
		schoolSettingLmsDTO['contactUsActive'] = $("#"+formId+" #contactUsStatus").val();
		schoolSettingLmsDTO['contactUsUrl'] = $("#"+formId+" #contactUsUrl").val();
		schoolSettingLmsDTO['instagramUrl'] = $("#"+formId+" #instagramUrl").val();
		schoolSettingLmsDTO['fbUrl'] = $("#"+formId+" #facebookUrl").val();
		schoolSettingLmsDTO['pintrestUrl'] = $("#"+formId+" #pintrestUrl").val();
		schoolSettingLmsDTO['twitterUrl'] = $("#"+formId+" #twitterUrl").val();
		schoolSettingLmsDTO['linkdinUrl'] = $("#"+formId+" #linkedinUrl").val();
		schoolSettingLmsDTO['codeConductUrl'] = $("#"+formId+" #codeConductUrl").val();
		schoolSettingLmsDTO['studHBookUrl'] = $("#"+formId+" #stdtHandbokUrl").val();
		schoolSettingLmsDTO['chatBoatActive'] = $("#"+formId+" #chatbotStatus").val();
		schoolSettingLmsDTO['chatBoatUrl'] = $("#"+formId+" #chatbotUrl").val();

	}else if(moduleName=='SSM'){
		schoolSettingLmsDTO['senderEmail'] = $("#"+formId+" #senderEmail").val();
		schoolSettingLmsDTO['emailForClassRoomSession'] = $("#"+formId+" #classroomEmail").val();
		schoolSettingLmsDTO['emailForDemoCouncelling'] = $("#"+formId+" #demoEmail").val();
		schoolSettingLmsDTO['emailForStudentInstallmentFee'] = $("#"+formId+" #feeEmail").val();
		schoolSettingLmsDTO['emailForPpcRequest'] = $("#"+formId+" #ppcEmail").val();
		schoolSettingLmsDTO['emailForClientSignup'] = $("#"+formId+" #signupEmail").val();
		schoolSettingLmsDTO['emailForHiring'] = $("#"+formId+" #hiringEmail").val();
		schoolSettingLmsDTO['emailAccountName'] = $("#"+formId+" #accountNameEmail").val();
		schoolSettingLmsDTO['emailAccountAdminName'] = $("#"+formId+" #accountAdminEmail").val();
		schoolSettingLmsDTO['emailAccountSupport'] = $("#"+formId+" #supportEmail").val();
		schoolSettingLmsDTO['emailOtherAdmin'] = $("#"+formId+" #otherAdminEmail").val();
		schoolSettingLmsDTO['technicalEmail'] = $("#"+formId+" #technicalEmail").val();
		schoolSettingLmsDTO['emailAccountForAuditor'] = $("#"+formId+" #auditorEmail").val();
		schoolSettingLmsDTO['withdrawalRequestAdmin'] = $("#"+formId+" #withdrawalRequestAdmin").val();

	}else if(moduleName=='SST'){
		schoolSettingLmsDTO['vendorId'] = $("#"+formId+" #vendorId").val();
		schoolSettingLmsDTO['showSubjectCostOnSignup'] = $("#"+formId+" #showSubjectCost").val();
		schoolSettingLmsDTO['flexEnrollment'] = $("#"+formId+" #flexEnrollment").val();
		schoolSettingLmsDTO['schoolEnrollment'] = $("#"+formId+" #schoolEnrollment").val();
		schoolSettingLmsDTO['letterHeadImg'] = $("#"+formId+" #letterHead").val();
		schoolSettingLmsDTO['teachAgreementSign'] = $("#"+formId+" #teacherAgreementSign").val();
		schoolSettingLmsDTO['courseProviderName'] = $("#"+formId+" #coureProviderName").val();

	}
	schoolSettingLmsDTO['schoolId'] = schoolId;
	schoolSettingLmsDTO['moduleName'] = moduleName;
	schoolSettingLmsDTO['id'] = settingId;
	request['schoolSettingLmsDTO'] = schoolSettingLmsDTO;
	authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
	request['authentication'] = authentication;
	//request['requestData'] = requestData;

	return request;
}

function lmsProviderChagedDetails(schoolId) {
	var lmsProvider=36;
	if($('#lmsProviderId').val()=='Agilix Buzz'){
		lmsProvider=1;
	}else if($('#lmsProviderId').val()=='Odysseyware'){
		lmsProvider=2;
	}else if($('#lmsProviderId').val()==='Buzz'){
		lmsProvider=31;
	}else if($('#lmsProviderId').val()==='BUZZ'){
		lmsProvider=36
	}else if($('#lmsProviderId').val()==='BUZZ-GC'){
		lmsProvider=37
	}else if($('#lmsProviderId').val()==='BUZZ-GR'){
		lmsProvider=38
	}else if($('#lmsProviderId').val() =='Exact-Path'){
		lmsProvider=39
	}else if($('#lmsProviderId').val() =='Courseware'){
		lmsProvider=40
	}
	hideMessage('');
	$.ajax({
		type : "GET",
		url : getURLForHTML('dashboard','school-setting-lms-details'),
		data : "SCHOOLID="+schoolId+"&lmsProviderId="+lmsProvider,
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
        			}else {
        				showMessage(true, stringMessage[1]);
        			}
        		} else {
        			$('#schoolSettingsContent').hide();
        			$('#schoolSettingsOnChangeData').html(htmlContent);
        			$('#schoolSettingsOnChangeData').show();
        			if(lmsProvider==1){
        				$('#lmsProviderId').val('Agilix Buzz')
        			}else if(lmsProvider==2){
        				$('#lmsProviderId').val('Odysseyware')
        			}else if(lmsProvider==31){
        				$('#lmsProviderId').val('Buzz')
        			}else{
        				$('#lmsProviderId').val('FLVS')
        			}
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



function getAdmissionCycles() {
	var session = $("#sessionList").val();
	$("#stateId").prop("disabled", true);
	$.ajax({
		type : "GET",
		contentType : "application/json",
		url : getURLForAdmissionCycle('dashboard', 'admission-cycle', session),
		dataType : 'json',
		async : false,
		success : function(data) {
			 if (data['statusCode'] == '1') {
				 setAdmissionCycleTableData('schoolSettingForm','admissionCycleData', data['admissionCycleDTOList'] );
			} else {
				showMessage(0, data['message'], true)
			}

		},
		error : function(e) {
			/* $("#stateId").prop("disabled", false); */
		}
	});
	return true;
}

function saveEditAdmissionCycle(formId, id){
	if(!validateAdmissionCycleData(formId)){
		return false;
	}
	console.log('schoolsettings');
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForAdmissionCycle('dashboard', 'admission-cycle', ''),
		data : JSON.stringify(getDataForAdmissionCycle(formId, id)),
		dataType : 'json',
		async : false,
		success : function(data) {
			 if (data['statusCode'] == '001') {
				 showMessageTheme2(1, data['status'],"",  true);
				 clearDataForSaveEditAdmissionCycle(formId);
				 return true;
			} else {
				showMessageTheme2(0, data['status'],"", true)
				return false;
			}

		},
		error : function(e) {
			/* $("#stateId").prop("disabled", false); */
		}
	});
}

function validateAdmissionCycleData(formId){





	if($("#"+formId+" #groupName").val()=="" || $("#"+formId+" #groupName").val()==null){
		showMessageTheme2(2, ' Please Enter Group Name',"", true);
		return false;
	}
	if($("#"+formId+" #semesterStartDate1").val()=="" || $("#"+formId+" #semesterStartDate1").val()==null){
		showMessageTheme2(2, ' Please select semester 1 start date',"", true);
		return false;
	}
	if($("#"+formId+" #semesterEndDate1").val()=="" || $("#"+formId+" #semesterEndDate1").val()==null){
		showMessageTheme2(2, ' Please select semester 1 end date.',"", true);
		return false;
	}
	if($("#"+formId+" #semesterStartDate2").val()=="" || $("#"+formId+" #semesterStartDate2").val()==null){
		showMessageTheme2(2, ' Please select semester 2 start date.',"", true);
		return false;
	}
	if($("#"+formId+" #semesterEndDate2").val()=="" || $("#"+formId+" #semesterEndDate2").val()==null){
		showMessageTheme2(2, ' Please select semester 2 end date.',"", true);
		return false;
	}
	if($("#"+formId+" #LateAppFeeDate").val()=="" || $("#"+formId+" #LateAppFeeDate").val()==null){
		showMessageTheme2(2, ' Please select Late Fee Start Date.',"", true);
		return false;
	}
	if($("#"+formId+" #LateAppFeeDateEnd").val()=="" || $("#"+formId+" #LateAppFeeDateEnd").val()==null){
		showMessageTheme2(2, ' Please Select Late Fee End Date.',"", true);
		return false;
	}
	if($("#"+formId+" #discountSem1").val()=="" || $("#"+formId+" #discountSem1").val()==null){
		showMessageTheme2(2, ' Please Discount % For Annual Plan before start of 1st day of academic year.',"", true);
		return false;
	}
	if($("#"+formId+" #discountSem2").val()=="" || $("#"+formId+" #discountSem2").val()==null){
		showMessageTheme2(2, ' Please Discount % For Annual Plan before start of second semester.',"", true);
		return false;
	}


	var start1Arr = $("#semesterStartDate1").val().split("-");
	var start1Date= new Date(start1Arr[2], start1Arr[0]-1, start1Arr[1]);

	var end1Arr = $("#semesterEndDate1").val().split("-");
	var end1Date= new Date(end1Arr[2], end1Arr[0]-1, end1Arr[1]);

	var start2Arr = $("#semesterStartDate2").val().split("-");
	start2Date = new Date(start2Arr[2], start2Arr[0]-1, start2Arr[1]);

	var end2Arr = $("#semesterEndDate2").val().split("-");
	end2Date = new Date(end2Arr[2], end2Arr[0]-1, end2Arr[1]);

	if((start1Date>end1Date)|| start1Date==end1Date){
		showMessageTheme2(2, ' Semester 1 start date must be before semester 1 end date',"", true);
		return false
	}
	if((start2Date>	end2Date)|| start2Date==end2Date){
		showMessageTheme2(2, ' Semester 2 start date must be before semester 2 end date',"", true);
		return false
	}
	if((end1Date>start2Date )|| end1Date==start2Date){
		showMessageTheme2(2, ' Semester 2 start date must be after semester 1 end date',"", true);
		return false
	}



	var lateFeeStartArr = $("#LateAppFeeDate").val().split("-");

	lateFeeStartDate = new Date(lateFeeStartArr[2], lateFeeStartArr[0]-1, lateFeeStartArr[1]);

	var lateFeeEndArr = $("#LateAppFeeDateEnd").val().split("-");
	lateFeeEndDate = new Date(lateFeeEndArr[2], lateFeeEndArr[0]-1, lateFeeEndArr[1]);

	if(lateFeeStartDate>lateFeeEndDate || lateFeeStartDate==lateFeeEndDate ){
		showMessageTheme2(2, ' Late Fee Start Date Must be Before Late Fee End Date',"", true);
		return false
	}
	return true;
}

function getDataForAdmissionCycle(formId, id){
	var schoolId=$('#schoolSettigsSelection').val();
	 newId = $("#admissionCycleId").val();
	var request = {};
	var authentication = {};
	var requestData = {};

	var admissionCycleDTO = {};
	admissionCycleDTO['id']=newId;
	admissionCycleDTO['schoolId']=schoolId;
	admissionCycleDTO['groupName'] = $("#"+formId+" #groupName").val().trim();
	admissionCycleDTO['semesterOneStartDateString'] = $("#"+formId+" #semesterStartDate1").val().trim();
	admissionCycleDTO['semesterOneEndDateString'] = $("#"+formId+" #semesterEndDate1").val().trim();
	
	admissionCycleDTO['feeRule1Batch'] = $("#"+formId+" #feeRule1Batch").val().trim();
	admissionCycleDTO['feeRule1OneToOne'] = $("#"+formId+" #feeRule1OneToOne").val().trim();
	admissionCycleDTO['feeRule1Scholarship'] = $("#"+formId+" #feeRule1Scholarship").val().trim();
	admissionCycleDTO['feeStructureForRule1'] = $("#"+formId+" #feeStructureForRule1").val().trim();
	
	admissionCycleDTO['semesterTwoStartDateString'] = $("#"+formId+" #semesterStartDate2").val().trim();
	admissionCycleDTO['semesterTwoEndDateString'] = $("#"+formId+" #semesterEndDate2").val().trim();
	
	admissionCycleDTO['feeRule2Batch'] = $("#"+formId+" #feeRule2Batch").val().trim();
	admissionCycleDTO['feeRule2OneToOne'] = $("#"+formId+" #feeRule2OneToOne").val().trim();
	admissionCycleDTO['feeRule2Scholarship'] = $("#"+formId+" #feeRule2Scholarship").val().trim();
	admissionCycleDTO['feeStructureForRule2'] = $("#"+formId+" #feeStructureForRule2").val().trim();
	
	admissionCycleDTO['lateAppFeeStartDateString'] = $("#"+formId+" #LateAppFeeDate").val().trim();
	admissionCycleDTO['lateAppFeeEndDateString'] = $("#"+formId+" #LateAppFeeDateEnd").val().trim();
	admissionCycleDTO['admissionStatus'] = null;
	admissionCycleDTO['session'] =null;
	admissionCycleDTO['discountOne'] = $("#"+formId+" #discountSem1").val().trim();
	admissionCycleDTO['discountTwo'] = $("#"+formId+" #discountSem2").val().trim();
	admissionCycleDTO['allowAdmissionStatus'] = $("#"+formId+" #admissionStatus").val().trim();

	requestData['admissionCycleDTO'] = admissionCycleDTO;
	authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = "STUDENT";
	request['authentication'] = authentication;
	request['requestData'] = requestData;
	return request;
}

function clearDataForSaveEditAdmissionCycle(formId){
	$("#admissionCycleId").val("");
	newId="";
	$("#"+formId+" #groupName").val("");
	$("#"+formId+" #semesterStartDate1").val("");
	$("#"+formId+" #semesterEndDate1").val("");
	$("#"+formId+" #semesterStartDate2").val("");
	
	$("#"+formId+" #feeRule1Batch").val("");
	$("#"+formId+" #feeRule1OneToOne").val("");
	$("#"+formId+" #feeRule1Scholarship").val("");
	$("#"+formId+" #feeStructureForRule1").val("");
	
	$("#"+formId+" #semesterEndDate2").val("");
	$("#"+formId+" #LateAppFeeDate").val("");
	
	$("#"+formId+" #feeRule2Batch").val("");
	$("#"+formId+" #feeRule2OneToOne").val("");
	$("#"+formId+" #feeRule2Scholarship").val("");
	$("#"+formId+" #feeStructureForRule2").val("");
	
	$("#"+formId+" #LateAppFeeDateEnd").val("");
	$("#"+formId+" #discountSem1").val("");
	$("#"+formId+" #discountSem2").val("");
	$("#"+formId+" #admissionStatus").val("Y").trigger('change');

}


function dltAdmissionCycle(id){
	console.log('schoolsettings');
	$.ajax({
		type : "GET",
		contentType : "application/json",
		url : getURLForAdmissionCycle('dashboard', 'dlt-admission-cycle', id),
		dataType : 'json',
		async : false,
		success : function(data) {
			 if (data['statusCode'] == '1') {
				 showMessageTheme2(1, data['message'],"",  true)

				 return true;
			} else {
				showMessageTheme2(0, data['message'],"", true)
				return false;
			}

		},
		error : function(e) {
			/* $("#stateId").prop("disabled", false); */
		}
	});

}



function setAdmissionCycleTableData(formId, tableId, tableData){
	admissionCycle = $("#"+tableId+ " tbody");
	admissionCycle.html('');
	if (tableData != '') {
		var count =1;
		$.each(tableData, function(k, i) {
			var status= i.allowAdmissionStatus=="Y"? 'Active' : 'Inactive';
			admissionCycle.append('<tr>'
			  + '<td style="text-align: center;">'+count+'</td>'
			  + '<td>'+i.groupName+'</td>'
			  + '<td>'+i.durationSem1+'</td>'
			  + '<td>'+i.durationSem2+'</td>'
			  + '<td>'+i.lateFeeDuration+'</td>'
			  + '<td>'+i.discountOne+'</td>'
			  + '<td>'+i.discountTwo+'</td>'
			  + '<td>'+status+'</td>'
			  + '<td><a class="mt-2 btn btn-primary" href="javascript:void(0);" id="editAdmissionCycle" name="editAdmissionCycle" onclick=\'editAdmissionCycle('+i.id+');\'>Edit</a></td>'
		+'</tr>');
			count+=1;
		});
	}
}

function editAdmissionCycle(id){
	console.log('schoolsettings');
	$.ajax({
		type : "get",
		contentType : "application/json",
		url : getURLForAdmissionCycle('dashboard', 'get-admission-cycle', id),
		dataType : 'json',
		async : false,
		success : function(data) {
			 if (data['statusCode'] == '1') {
				// showMessageTheme2(1, data['status'],"",  true)
				 setvaluesForEditAdmissionCycle(data['admissionCycleDTOList'][0], schoolSettingForm, id)
				 return true;
			} else {
				showMessageTheme2(0, "Error Occured in Editing Admission Cycle","", true)
				return false;
			}

		},
		error : function(e) {
			/* $("#stateId").prop("disabled", false); */
		}
	});

}

function setvaluesForEditAdmissionCycle(admissionCycle, formId){
	$("#groupName").val(admissionCycle.groupName);

	$("#admissionCycleId").val(admissionCycle.id);

	var dob1=(admissionCycle.semesterOneStartDateString).split("-");
	var dob2=new Date(parseInt(dob1[2]),parseInt(dob1[0])-1,parseInt(dob1[1]));
	$("#semesterStartDate1").datepicker().datepicker("setDate", dob2);

	var sem1end = (admissionCycle.semesterOneEndDateString).split("-");
	var sem1EndDate = new Date(parseInt(sem1end[2]),parseInt(sem1end[0])-1,parseInt(sem1end[1]));
	$("#semesterEndDate1").datepicker().datepicker("setDate", sem1EndDate);

	$("#feeRule1Batch").val(admissionCycle.feeRule1Batch);
	$("#feeRule1OneToOne").val(admissionCycle.feeRule1OneToOne);
	$("#feeRule1Scholarship").val(admissionCycle.feeRule1Scholarship);
	$("#feeStructureForRule1").val(admissionCycle.feeStructureForRule1);

	var sem2start = (admissionCycle.semesterTwoStartDateString).split("-");
	var sem2startDate = new Date(parseInt(sem2start[2]),parseInt(sem2start[0])-1,parseInt(sem2start[1]));
	$("#semesterStartDate2").datepicker().datepicker("setDate", sem2startDate);

	var sem2end = (admissionCycle.semesterTwoEndDateString).split("-");
	var sem2endDate = new Date(parseInt(sem2end[2]),parseInt(sem2end[0])-1,parseInt(sem2end[1]));
	$("#semesterEndDate2").datepicker().datepicker("setDate", sem2endDate);

	$("#feeRule2Batch").val(admissionCycle.feeRule2Batch);
	$("#feeRule2OneToOne").val(admissionCycle.feeRule2OneToOne);
	$("#feeRule2Scholarship").val(admissionCycle.feeRule2Scholarship);
	$("#feeStructureForRule2").val(admissionCycle.feeStructureForRule2);
	
	var lateFee = (admissionCycle.lateAppFeeStartDateString).split("-");
	var lateFeeDate = new Date(parseInt(lateFee[2]),parseInt(lateFee[0])-1,parseInt(lateFee[1]));
	$("#LateAppFeeDate").datepicker().datepicker("setDate", lateFeeDate);

	var lateFeeEnd = (admissionCycle.lateAppFeeEndDateString).split("-");
	var lateFeeEndDate = new Date(parseInt(lateFeeEnd[2]),parseInt(lateFeeEnd[0])-1,parseInt(lateFeeEnd[1]));
	$("#LateAppFeeDateEnd").datepicker().datepicker("setDate", lateFeeEndDate);


	$("#admissionStatus").val(admissionCycle.allowAdmissionStatus).trigger('change');
	$("#discountSem1").val(admissionCycle.discountOne);
	$("#discountSem2").val(admissionCycle.discountTwo);
	return true;
}