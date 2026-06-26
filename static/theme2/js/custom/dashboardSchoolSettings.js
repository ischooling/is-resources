var newId ="";
var ENROLLMENT_COUNTRY_MASTER_LIST = [];
var ENROLLMENT_COUNTRY_SELECTION_SNAPSHOT = [];
var ENROLLMENT_COUNTRY_SELECTED_IDS = [];

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
		contentType : APPLICATION_JSON_VALUE,
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
		}
	});
}



function getAdmissionCycles() {
	var session = $("#sessionList").val();
	$("#stateId").prop("disabled", true);
	$.ajax({
		type : "GET",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLForAdmissionCycle('dashboard', 'admission-cycle', session),
		dataType : 'json',
		async : false,
		success : function(data) {
			 if (data['statusCode'] == '1') {
				 setAdmissionCycleTableData('schoolSettingForm','admissionCycleData', data['admissionCycleDTOList'] );
			} else {
				showMessage(0, data['message'], true)
			}

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
		contentType : APPLICATION_JSON_VALUE,
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
		contentType : APPLICATION_JSON_VALUE,
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
		contentType : APPLICATION_JSON_VALUE,
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

async function loadEnrollmentStandardDocumentSettings() {
	$("#errMsg").text('');
	$("#enrollmentSettingsTable tbody").html('<tr><td colspan="4" class="text-center">Loading...</td></tr>');
	try{
		var schoolId = getEnrollmentSchoolId();
		await loadEnrollmentCountryMasterList();
		var responseData = await callCommonAjax({
			method : "POST",
			url : getURLForHTML('dashboard', 'school-setting-standard-document-setting-data'),
			body : {
				schoolId : schoolId
			},
			global : true,
			showMessage : false
		});
		renderEnrollmentStandardDocumentSettings((responseData && responseData.standardDocumentSettingsJson) ? responseData.standardDocumentSettingsJson : []);
		await loadEnrollmentCountrySelection();
	}catch(error){
		$("#enrollmentSettingsTable tbody").html('<tr><td colspan="4" class="text-center text-danger">Unable to load data</td></tr>');
		$("#errMsg").text('Unable to load enrollment settings.');
	}
}

function renderEnrollmentStandardDocumentSettings(settingsList){
	var settingsMap = {};
	var tableBody = $("#enrollmentSettingsTable tbody");
	settingsList = settingsList || [];
	$.each(settingsList, function(index, setting){
		if(setting && setting.standardId != null){
			settingsMap[String(setting.standardId)] = setting;
		}
	});
	tableBody.html('');
	$.each(SCHOOL_STANDARD_GRADE_MASTER, function(index, grade){
		var setting = settingsMap[grade.key] || {};
		var docsRequired = ((setting.docsRequired || 'N') + '').toUpperCase() === 'Y' ? 'Y' : 'N';
		var docsMandatory = ((setting.docsMandatory || 'N') + '').toUpperCase() === 'Y' ? 'Y' : 'N';
		if(docsRequired === 'N'){
			docsMandatory = 'N';
		}
		tableBody.append(
			'<tr data-standard-id="' + grade.key + '">' +
				'<td class="text-center">' + (index + 1) + '</td>' +
				'<td>' + grade.value + '</td>' +
				'<td>' +
					'<div class="enrollment-toggle-wrap">' +
						'<span class="enrollment-toggle-label">' + (docsRequired === 'Y' ? 'Yes' : 'No') + '</span>' +
						'<label class="enrollment-switch">' +
							'<input type="checkbox" class="enrollment-docs-required"' + (docsRequired === 'Y' ? ' checked' : '') + '>' +
							'<span class="enrollment-switch-slider"></span>' +
						'</label>' +
					'</div>' +
				'</td>' +
				'<td>' +
					'<div class="enrollment-toggle-wrap">' +
						'<span class="enrollment-toggle-label">' + (docsMandatory === 'Y' ? 'Yes' : 'No') + '</span>' +
						'<label class="enrollment-switch">' +
							'<input type="checkbox" class="enrollment-docs-mandatory"' + (docsMandatory === 'Y' ? ' checked' : '') + (docsRequired === 'Y' ? '' : ' disabled') + '>' +
							'<span class="enrollment-switch-slider"></span>' +
						'</label>' +
					'</div>' +
				'</td>' +
			'</tr>'
		);
	});
}

$(document).on('change', '.enrollment-docs-required', function(){
	var isChecked = $(this).is(':checked');
	var currentWrap = $(this).closest('.enrollment-toggle-wrap');
	var mandatoryDropdown = $(this).closest('tr').find('.enrollment-docs-mandatory');
	currentWrap.find('.enrollment-toggle-label').text(isChecked ? 'Yes' : 'No');
	if(isChecked){
		mandatoryDropdown.prop('disabled', false);
	}else{
		mandatoryDropdown.prop('checked', false).prop('disabled', true);
	}
	mandatoryDropdown.closest('.enrollment-toggle-wrap').find('.enrollment-toggle-label').text(mandatoryDropdown.is(':checked') ? 'Yes' : 'No');
});

$(document).on('change', '.enrollment-docs-mandatory', function(){
	$(this).closest('.enrollment-toggle-wrap').find('.enrollment-toggle-label').text($(this).is(':checked') ? 'Yes' : 'No');
});

async function saveEnrollmentStandardDocumentSettings(){
	$("#errMsg").text('');
	var schoolId = getEnrollmentSchoolId();
	var standardDocumentSettingsJson = [];
	$("#enrollmentSettingsTable tbody tr").each(function(){
		var standardId = $(this).attr('data-standard-id');
		if(!standardId){
			return;
		}
		var docsRequired = $(this).find('.enrollment-docs-required').is(':checked') ? 'Y' : 'N';
		var docsMandatory = $(this).find('.enrollment-docs-mandatory').is(':checked') ? 'Y' : 'N';
		if(docsRequired !== 'Y'){
			docsMandatory = 'N';
		}
		standardDocumentSettingsJson.push({
			docsRequired : docsRequired,
			docsMandatory : docsMandatory,
			standardId : String(standardId)
		});
	});

	var ajaxReqDetails = {
		method : "POST",
		url : getURLForHTML('dashboard', 'school-setting-standard-document-setting-addData'),
		body : {
			schoolId : schoolId,
			standardDocumentSettingsJson : standardDocumentSettingsJson
		},
		global : true,
		showMessage : false
	};
	try{
		var responseData = await callCommonAjax(ajaxReqDetails);
		if(responseData && responseData.status === '1'){
			showMessageTheme2(1, responseData.message || 'Standard document settings updated');
			await loadEnrollmentStandardDocumentSettings();
			return responseData;
		}else{
			showMessageTheme2(0, (responseData && responseData.message) ? responseData.message : 'Unable to save enrollment settings.');
			return null;
		}
	}catch(error){
		showMessageTheme2(0, 'Unable to save enrollment settings.');
		return null;
	}
}

function getEnrollmentSchoolId(){
	return parseInt($('#schoolSettigsSelection').val() || SCHOOL_ID, 10);
}

async function loadEnrollmentCountryMasterList(){
	if(ENROLLMENT_COUNTRY_MASTER_LIST.length > 0){
		renderEnrollmentCountrySelectionUI();
		return;
	}
	try{
		var responseData = await callCommonAjax({
			method : "POST",
			url : getURLForCommon('masters'),
			body : getRequestForMaster('formId', 'COUNTRIES-LIST'),
			global : true,
			showMessage : false
		});
		if(responseData && responseData.status !== '0' && responseData.status !== '2' && responseData.mastersData && $.isArray(responseData.mastersData.countries)){
			ENROLLMENT_COUNTRY_MASTER_LIST = $.map(responseData.mastersData.countries, function(country){
				if(!country){
					return null;
				}
				return {
					countryId : String(country.key),
					countryName : country.value
				};
			});
			renderEnrollmentCountrySelectionUI();
		}else{
			$("#enrollmentCountryActionList").html('<div class="text-danger text-center py-2">Unable to load countries.</div>');
		}
	}catch(error){
		$("#enrollmentCountryActionList").html('<div class="text-danger text-center py-2">Unable to load countries.</div>');
	}
}

async function loadEnrollmentCountrySelection(){
	try{
		var responseData = await callCommonAjax({
			method : "POST",
			url : getURLForHTML('dashboard', 'school-setting-enrollment-document-country-data'),
			body : {
				schoolId : getEnrollmentSchoolId()
			},
			global : true,
			showMessage : false
		});
		var selectedCountryIds = [];
		if(responseData && $.isArray(responseData.countries)){
			$.each(responseData.countries, function(index, country){
				if(country && country.countryId != null){
					selectedCountryIds.push(String(country.countryId));
				}
			});
		}
		ENROLLMENT_COUNTRY_SELECTION_SNAPSHOT = selectedCountryIds.slice();
		ENROLLMENT_COUNTRY_SELECTED_IDS = selectedCountryIds.slice();
		renderEnrollmentCountrySelectionUI();
	}catch(error){
		$("#errMsg").text('Unable to load enrollment countries.');
	}
}

function renderEnrollmentCountrySelectionUI(){
	renderEnrollmentSelectedCountries();
	renderEnrollmentCountryActionList();
}

function renderEnrollmentSelectedCountries(){
	var selectedWrapper = $("#enrollmentSelectedCountries");
	selectedWrapper.html('');
	if(ENROLLMENT_COUNTRY_SELECTED_IDS.length < 1){
		selectedWrapper.html('<div class="text-muted text-center py-3">No countries selected</div>');
		return;
	}
	$.each(ENROLLMENT_COUNTRY_SELECTED_IDS, function(index, selectedId){
		var country = getEnrollmentCountryById(selectedId);
		if(!country){
			return;
		}
		selectedWrapper.append(
			'<span class="badge badge-pill badge-primary mr-2 mb-2 px-3 py-2" style="font-size:10px;">' +
				escapeEnrollmentCountryText(country.countryName) +
			'</span>'
		);
	});
}

function renderEnrollmentCountryActionList(){
	var listWrapper = $("#enrollmentCountryActionList");
	var searchKeyword = (($("#enrollmentCountrySearch").val() || '') + '').toLowerCase().trim();
	listWrapper.html('');
	if(ENROLLMENT_COUNTRY_MASTER_LIST.length < 1){
		listWrapper.html('<div class="text-muted text-center py-3">No countries found</div>');
		return;
	}
	var visibleCount = 0;
	$.each(ENROLLMENT_COUNTRY_MASTER_LIST, function(index, country){
		if(searchKeyword !== '' && String(country.countryName || '').toLowerCase().indexOf(searchKeyword) === -1){
			return;
		}
		visibleCount += 1;
		var isSelected = $.inArray(String(country.countryId), ENROLLMENT_COUNTRY_SELECTED_IDS) !== -1;
		listWrapper.append(
			'<div class="d-flex align-items-center justify-content-between border rounded px-2 py-2 mb-2">' +
				'<div class="pr-2" style="font-size:13px; font-weight:500;">' + escapeEnrollmentCountryText(country.countryName) + '</div>' +
				'<button type="button" class="btn btn-sm country-toggle-btn ' + (isSelected ? 'btn-outline-secondary' : 'btn-success') + '" onclick="toggleEnrollmentCountrySelection(\'' + String(country.countryId) + '\');">' +
					(isSelected ? 'Selected' : 'Select') +
				'</button>' +
			'</div>'
		);
	});
	if(visibleCount < 1){
		listWrapper.html('<div class="text-muted text-center py-3">No countries match your search</div>');
	}
}

function toggleEnrollmentCountrySelection(countryId){
	countryId = String(countryId);
	var selectedIndex = $.inArray(countryId, ENROLLMENT_COUNTRY_SELECTED_IDS);
	if(selectedIndex === -1){
		ENROLLMENT_COUNTRY_SELECTED_IDS.push(countryId);
	}else{
		ENROLLMENT_COUNTRY_SELECTED_IDS.splice(selectedIndex, 1);
	}
	renderEnrollmentCountrySelectionUI();
}

function getEnrollmentCountryById(countryId){
	countryId = String(countryId);
	for(var index = 0; index < ENROLLMENT_COUNTRY_MASTER_LIST.length; index++){
		if(String(ENROLLMENT_COUNTRY_MASTER_LIST[index].countryId) === countryId){
			return ENROLLMENT_COUNTRY_MASTER_LIST[index];
		}
	}
	return null;
}

function escapeEnrollmentCountryText(value){
	return $('<div/>').text(value || '').html();
}

async function updateEnrollmentCountries(toggle, countryIds){
	countryIds = $.map(countryIds || [], function(countryId){
		if(countryId == null || countryId === ''){
			return null;
		}
		return parseInt(countryId, 10);
	});
	if(countryIds.length < 1){
		return null;
	}
	try{
		var responseData = await callCommonAjax({
			method : "POST",
			url : getURLForHTML('dashboard', 'school-setting-enrollment-document-country-save'),
			body : {
				schoolId : getEnrollmentSchoolId(),
				toggle : toggle,
				countryIds : countryIds
			},
			global : true,
			showMessage : false
		});
		if(responseData && responseData.status === '1'){
			return responseData;
		}
		showMessageTheme2(0, (responseData && responseData.message) ? responseData.message : 'Unable to update countries.');
		return null;
	}catch(error){
		showMessageTheme2(0, 'Unable to update countries.');
		return null;
	}
}

async function saveEnrollmentSettings(){
	return saveEnrollmentCountries(true);
}

async function saveEnrollmentCountries(skipReload){
	$("#errMsg").text('');
	var selectedCountryIds = $.map(ENROLLMENT_COUNTRY_SELECTED_IDS || [], function(countryId){
		return parseInt(countryId, 10);
	});
	var snapshotCountryIds = $.map(ENROLLMENT_COUNTRY_SELECTION_SNAPSHOT || [], function(countryId){
		return String(countryId);
	});
	var addedCountryIds = $.grep(selectedCountryIds, function(countryId){
		return $.inArray(String(countryId), snapshotCountryIds) === -1;
	});
	var removedCountryIds = $.map(snapshotCountryIds, function(countryId){
		if($.inArray(String(countryId), ENROLLMENT_COUNTRY_SELECTED_IDS) === -1){
			return parseInt(countryId, 10);
		}
		return null;
	});
	if(addedCountryIds.length > 0){
		var countrySaveResponse = await updateEnrollmentCountries('SAVE', addedCountryIds);
		if(!countrySaveResponse){
			if($("#errMsg").length){
				$("body,html").animate({scrollTop: $("#errMsg").offset().top -70}, 800);
			}
			return false;
		}
	}
	if(removedCountryIds.length > 0){
		var countryRemoveResponse = await updateEnrollmentCountries('REMOVE', removedCountryIds);
		if(!countryRemoveResponse){
			if($("#errMsg").length){
				$("body,html").animate({scrollTop: $("#errMsg").offset().top -70}, 800);
			}
			return false;
		}
	}
	ENROLLMENT_COUNTRY_SELECTION_SNAPSHOT = ENROLLMENT_COUNTRY_SELECTED_IDS.slice();
	showMessageTheme2(1, 'Countries Updated');
	if(!skipReload){
		await loadEnrollmentCountrySelection();
	}
	if($("#errMsg").length){
		$("body,html").animate({scrollTop: $("#errMsg").offset().top -70}, 800);
	}
	return true;
}

$(document).on('input', '#enrollmentCountrySearch', function(){
	renderEnrollmentCountryActionList();
});
