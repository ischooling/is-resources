var max_age = "";

$(document).ready(function() {
	$("#signupParent").submit(function(event) {
		event.preventDefault();
	});
});
$('#signupStage2 #parentEmailId').blur(function(){
	emailCheck($('#signupStage2 #parentEmailId').val(), 'STUDENT');
});
$("#pCountryId").unbind().bind("change",function(){
	$('#pCountryId').valid();
	callStates('signupStage2', this.value, 'pCountryId', 'pStateId', 'pCityId');
	$("#pCityId").html("<option value=''>Select City*</option>");
});
$("#pStateId").unbind().bind("change",function(){
	$('#pStateId').valid();
	callCities('signupStage2', this.value, 'pStateId', 'pCityId');
});
$("#pCityId").unbind().bind("change",function(){
	$('#pCityId').valid();
});
function callForSignUpParents() {
	hideMessage('');
	if(!validateRequestForSignupParent()){
		return false;
	}
	setActiveStep(3);
	showSkeleton(true, "step3");
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : BASE_URL + CONTEXT_PATH + SCHOOL_UUID +'/student/enrollment/save-parent-details',
		data : JSON.stringify(getRequestForSignupParent()),
		dataType : 'json',
		async : true,
		global : false,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if (data['status'] == '3') {
					redirectLoginPage();
				} else {
					if(data['statusCode']=='ELIGIBLE_CUSTOME_PLAN' || data['statusCode']=='REDIRECT_TO_DASHBOOARD'){
						window.location.reload();
					}else{	
						showMessage(false, data['message']);
						setActiveStep(2);
					}
				}
			} else {
				getAllCourseDetails('N','');
				if($('#learingProgramHeader').attr('val')=='ONE_TO_ONE_FLEX'){
					showMessage(1, 'Academic & Communication Details Updated.', '', true);
				}else if($('#learingProgramHeader').html()=='English Learning Program - One to One'){
					showMessage(1, "Communication Details Updated", '', true);
				}else if($('#learingProgramHeader').html()=='English Learning Program - Self Study'){
					showMessage(1, "Communication Details Updated", '', true);
				}else{
					showMessage(1, "Parent's Details Uploaded", '', true);
				}
			}
		},
		error: function(e){
			if (checkonlineOfflineStatus()) {
				return;
			}
		}
	});
}

function validateRequestForSignupParent(){
	hideMessage('');
	
	// if (!validateFormAscii()) {
	// 	showMessage(0, 'Please use the English Keyboard while providing information');
	// 	return false
	// }
	if($('#learingProgramHeader').attr('val')=='ONE_TO_ONE_FLEX' ){
		if ($("#signupStage2 #workingProfession").val()==0 || $("#signupStage2 #workingProfession").val() == '' || $("#signupStage2 #workingProfession").val()==null) {
			showMessage(0, 'Student or a working professional is required');
			return false
		}
		if ($("#signupStage2 #institutionName").val()=="") {
			showMessage(0, 'Name of the School/College/Organization is required.');
			return false
		}
		if ($("#signupStage2 #institutionCountryId").val()==0 || $("#signupStage2 #institutionCountryId").val()=='' || $("#signupStage2 #institutionCountryId").val()==null) {
			showMessage(0, 'Country of the School/College/Organization is required');
			return false
		}
	}else{
		var courseProviderId=$('#courseProviderId').val();
		if(courseProviderId==39){
	
		}else{
			if ($("#signupStage2 #parentFirstName").val()=="") {
				showMessage(0, 'First name is required.');
				return false
			}
			if ($("#signupStage2 #parentlastName").val()=="") {
				showMessage(0, 'Last name is required.');
				return false
			}
			if ($("#signupStage2 #relation").val()==0 || $("#signupStage2 #relation").val()==null) {
				showMessage(0, 'Relation with student is required');
				return false
			}
			if ($("#signupStage2 #parentPhoneNumber").val().length <= 2 && $("#signupStage2 #parentPhoneNumber").val().length > 0) {
				showMessage(0, 'Invalid Phone Number');
				return false
			}
			if ($("#signupStage2 #pCountryId").val()==0 || $("#signupStage2 #pCountryId").val()=='') {
				showMessage(0, 'Country is required');
				return false
			}
			if ($("#signupStage2 #pStateId").val()==0 || $("#signupStage2 #pStateId").val()=='') {
				showMessage(0, 'State/Province is required');
				return false
			}
			if ($("#signupStage2 #pCityId").val()==0 || $("#signupStage2 #pCityId").val()=='') {
				showMessage(0, 'City is required');
				return false
			}
			if ($("#signupStage2 #referralCode").val()=="") {
				// showMessage(0, 'Referral Code is required.');
				// return false
			}
		}
	}
	var pcModeWhatsapp=$('#signupStage2 #pcModeWhatsapp').is(':checked')?'Y':'N';
	var pcModeCall=$('#signupStage2 #pcModeCall').is(':checked')?'Y':'N';
	var pcModeEmail=$('#signupStage2 #pcModeEmail').is(':checked')?'Y':'N';
	if(pcModeWhatsapp == "Y" || pcModeCall == "Y" || pcModeEmail == "Y"){
		
	}else{
		showMessage(0, 'Your preferred communication is required');
		return false
	}
//	if ($("#signupStage2 #countryCodeParent").val()==null) {
//		showMessage(0, 'ISD code is required');
//		return false
//	}
//	if ($("#signupStage2 #parentPhoneNumber").val()=="") {
//		showMessage(0, 'Phone No is required.');
//		return false
//	}

//	if ($("#signupStage2 #contactNumberAlternate").val()!="" ){
//		if ($("#signupStage2 #countryCodeAlternateParent").val()=="" ){
//			showMessage(0, 'Alternate ISD Code is required.');
//			return false
//		}else if ($("#signupStage2 #countryCodeAlternateParent").val()==null ){
//			showMessage(0, 'Alternate ISD Code is required.');
//			return false
//		}
//	}
	return true;
}

function getRequestForSignupParent(){
	var saveParentDetailsRequestDTO = {};
	var authentication = {};
	var signupParentDTO = {};
	signupParentDTO['themeType'] = 'theme2';
	if($('#learingProgramHeader').attr('val')=='ONE_TO_ONE_FLEX' ){
		signupParentDTO['workingProfession'] = $("#signupStage2 #workingProfession").val();
		signupParentDTO['institutionName'] = $("#signupStage2 #institutionName").val();
		signupParentDTO['institutionCountryId'] = $("#signupStage2 #institutionCountryId").val();
	}else{
		signupParentDTO['relationship'] = $("#signupStage2 #relation").val();
		var relations = $("#signupStage2 #relation").val();//$("#signupStage2  #relation option:selected").text();
		if(relations == 'Other'){
			signupParentDTO['otherRelationName'] = $("#signupStage2 #otherName").val();
		}else{
			signupParentDTO['otherRelationName'] ='';
		}
		signupParentDTO['firstName'] = $("#signupStage2 #parentFirstName").val();
		signupParentDTO['middleName'] = $("#signupStage2 #parentMiddletName").val();
		signupParentDTO['lastName'] = $("#signupStage2 #parentlastName").val();
		signupParentDTO['email'] = $("#signupStage2 #parentEmailId").val();
		if ($("#signupStage2 #parentSwitchIntput").is(":checked")){
			signupParentDTO['skipParent'] = "N";
			signupParentDTO['password'] = $("#signupStage2 #parentPassword").val();
			signupParentDTO['parentEmailStatus'] = $("#signupStage2 #parentEmailStatus").val();
		}else{
			signupParentDTO['skipParent'] = "Y";
		}
		signupParentDTO['countryCode'] = $("#signupStage2 #parentCountryDailCode").val();
		signupParentDTO['countryIsdCode2'] = $("#signupStage2 #parentCountryIsd").val();
		signupParentDTO['contactNumber'] = $("#signupStage2 #parentPhoneNumber").val();
		signupParentDTO['gender'] = 'DONOTWANTTOSPECIFY';
		signupParentDTO['countryId'] = $("#signupStage2 #pCountryId").val();
		signupParentDTO['stateId'] = $("#signupStage2 #pStateId").val();
		signupParentDTO['cityId'] = $("#signupStage2 #pCityId").val();
	}

	if($("#signupStage2 #referralCode").length>0){
		signupParentDTO['referralCode'] = $("#signupStage2 #referralCode").val().trim();
	}else{
		signupParentDTO['referralCode'] = '';
	}
	var pcModeWhatsapp=$('#signupStage2 #pcModeWhatsapp').is(':checked')?'Y':'N';
	var pcModeCall=$('#signupStage2 #pcModeCall').is(':checked')?'Y':'N';
	var pcModeEmail=$('#signupStage2 #pcModeEmail').is(':checked')?'Y':'N';
	var communications='W='+pcModeWhatsapp+'|C='+pcModeCall+'|E='+pcModeEmail;
	signupParentDTO['communications']=communications;
	signupParentDTO['responsibleConfirm'] = "Yes";

	authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = 'STUDENT';
	authentication['userId'] = $("#userId").val();
	saveParentDetailsRequestDTO['authentication'] = authentication;
	saveParentDetailsRequestDTO['signupParent'] = signupParentDTO;
	return saveParentDetailsRequestDTO;
}

function emailCheckForParent(parentEmail, module, userId, studentId, parentName) {
	var result="";
	hideMessage('');
		if (!validateEmail(parentEmail)) {
			showMessage(0, 'Parent email is either empty or invalid');
			return false;
		}
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForCommon('is-user-available-for-parent'),
		data : JSON.stringify(getCallRequestForEmailCheckForParent(parentEmail, module, userId, studentId)),
		dataType : 'json',
		async:false,
		global : false,
		success : function(data) {
			if (data['statusCode'] == '0003') {
				showMessage(1, data['message']);
				result = false;
			}else if (data['status'] == '0' || data['status'] == '2') {
				result = data['extra']+'|'+data['extra2'];
			}else if (data['status'] == '3') {
				showMessage(0, data['message']);
				result = false;
			}else{
				result=true;
			}
		},
		error: function(e){
			if (checkonlineOfflineStatus()) {
				return;
			}
		}
	});
	return result;
}
function getCallRequestForEmailCheckForParent(parentEmail, module, userId, studentId, parentName){
	var request = {};
	var authentication = {};
	var data = {};
	data['requestKey'] = 'EMAIL-AVAILABLE';
	data['email'] = parentEmail;
	data['userId'] = userId;
	data['studentId'] = studentId;
	data['parentName'] = parentName;
	authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = module;
	request['authentication'] = authentication;
	request['data'] = data;
	return request;
}

function emailCheckForParentUser(parentEmail, module, userId, studentId, parentName) {
	var result="";
	hideMessage('');
		if (!validateEmail(parentEmail)) {
			showMessage(0, 'Parent email is either empty or invalid');
			return false;
		}
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForCommon('send-otp-for-parent-verification'),
		data : JSON.stringify(getCallRequestForEmailCheckForParentUser(parentEmail, module, userId, studentId)),
		dataType : 'json',
		async:false,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				if(data['extra1']=='Y'){
					result = true;
				}else{
					result = data['extra']+'|'+ data['extra2'];
				}
			}else if (data['status'] == '3') {
				showMessage(0, data['message']);
				result = false;
			}else{
				result=true;
			}
		}
	});
	return result;
}
function getCallRequestForEmailCheckForParentUser(parentEmail, module, userId, studentId){
	var request = {};
	var authentication = {};
	var data = {};
	data['requestKey'] = 'EMAIL-AVAILABLE';
	data['email'] = parentEmail;
	data['userId'] = userId;
	data['schoolId'] = SCHOOL_ID;
	authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = module;
	request['authentication'] = authentication;
	request['data'] = data;
	return request;
}

function mapParentAndAlreadyExistStudent(){
	if (!validateEmail($("#signupStage2 #parentEmailId").val())) {
		showMessage(0, 'Parent email is empty or invalid');
		return false
	}
	if (!validateEmail($("#signupStage2 #verifyMailId").val())) {
		showMessage(0, 'Existing student email is empty or invalid');
		return false
	}
	$.ajax({
		type : "POST",
		url : getURLFor('student','signup/stage-3-mapping-parent-student'),
		data : JSON.stringify(getRequestForSignupParentMapping()),
		dataType : 'json',
		contentType : "application/json",
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(0, data['message']);
			}else{
				showMessage(1, data['message']);
				$('#verifyStudentName').val(data['extra']);
				$('#parentEmailVerifyStatus').val(1);
				$('#parentSwitchIntput').attr("disabled",false);
				if(data['extra1']=='Y'){
					$('#parentSwitchIntput').prop("checked",true);
					$('#parentSwitchIntput').attr("disabled",true);
				}
				populateParentData(data['signupParentDTO'])
			}
			return false;
		}
	});
	return false;
}

function getRequestForSignupParentMapping(){
	var request = {};
	var authentication = {};
	var requestData = {};
	var signupParentStudentMappingDTO = {};
	signupParentStudentMappingDTO['parentEmail'] = $("#signupStage2 #parentEmailId").val();
	signupParentStudentMappingDTO['studentEmail'] = $("#signupStage2 #verifyMailId").val();
	signupParentStudentMappingDTO['studentId'] = $("#signupStage2 #studentId").val();
	requestData['signupParentStudentMappingDTO'] = signupParentStudentMappingDTO;
	authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = 'STUDENT';
	authentication['userId'] = $("#signupStage2 #userId").val();
	request['authentication'] = authentication;
	request['requestData'] = requestData;
	return request;
}
function proceedWithExistingMappings(){
	if(!$("#signupStage2 #checkTerms").prop("checked")){
		showModalMessage(true, 'Please click terms and conditions');
		return false
	}
	$('#parentExistModal').modal('hide');
}

function populateParentData(signupParentDTO){
	$('#signupStage2 #relation').val(signupParentDTO.relationship).trigger('change');
	$('#signupStage2 #otherName').val(signupParentDTO.otherRelationName);
	$('#signupStage2 #parentFirstName').val(signupParentDTO.firstName);
	$('#signupStage2 #parentMiddletName').val(signupParentDTO.middleName);
	$('#signupStage2 #parentlastName').val(signupParentDTO.lastName);
	$('#signupStage2 #parentGender').val(signupParentDTO.gender).trigger('change');
	$('#signupStage2 #responsibleConfirm').val(signupParentDTO.responsibleConfirm);
	$('#signupStage2 #skipParent').val(signupParentDTO.skipParent);
	$('#signupStage2 #countryCodeParent').val('+'+signupParentDTO.countryCode);
	$('#signupStage2 #contactNumber').val(signupParentDTO.contactNumber);
	if(signupParentDTO.countryCodeAlternate != ''){
		$('#signupStage2 #countryCodeAlternateParent').val('+'+signupParentDTO.countryCodeAlternate);
	}
	if(signupParentDTO.contactNumberAlternate != ''){
		$('#signupStage2 #contactNumberAlternate').val(signupParentDTO.contactNumberAlternate);
	}
	disabledParentData(true);
}

function disabledParentData(flag){
	$('#signupStage2 #relation').prop('disabled', flag);
	$('#signupStage2 #otherName').prop('disabled', flag);
	$('#signupStage2 #parentFirstName').prop('disabled', flag);
	$('#signupStage2 #parentMiddletName').prop('disabled', flag);
	$('#signupStage2 #parentlastName').prop('disabled', flag);
	$('#signupStage2 #parentGender').prop('disabled', flag);
	$('#signupStage2 #responsibleConfirm').prop('disabled', flag);
	$('#signupStage2 #skipParent').prop('disabled', flag);
	$('#signupStage2 #parentEmail').prop('disabled', flag);
	$('#signupStage2 #countryCodeParent').prop('disabled', flag);
	$('#signupStage2 #contactNumber').prop('disabled', flag);
	$('#signupStage2 #guardianConfirmation').prop('disabled', flag);
}

function sendOtpForParentUser(parentEmail, parentName, userId) {
	if (!validateEmail(parentEmail)) {
		showMessage(0, 'Parent email is empty or invalid');
		return false
	}
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForCommon('send-otp-for-parent-verification'),
		data : JSON.stringify(getDataForParentOTPVerification(parentEmail,parentName, userId)),
		dataType : 'json',
		async:false,
		success : function(data) {
			 if(data['statusCode']=="1"){
				showMessage(1, data['message'], "", true);
			}else if(data['statusCode']=="4"){
				showMessage(2, data['message'], "", true);
			}else if(data['statusCode']=="0"){
				showMessage(0, data['message'], "", true);
			}else{
				showMessage(0, data['statusCode'], "", true);
			}
		}
	});
}

function getDataForParentOTPVerification(parentEmail, parentName, userId){
	var request = {};
	var authentication = {};
	var requestData = {};
	requestData['userId'] = userId;
	requestData['email'] = parentEmail;
	requestData['schoolId'] = SCHOOL_ID;
	requestData['parentName'] = parentName;
	authentication['hash'] = getHash();
	authentication['schoolId'] = SCHOOL_ID;
	authentication['schoolUUID'] = SCHOOL_UUID;
	request['authentication'] = authentication;
	request['requestData'] = requestData;
	return request;
}

function verifyOtp(){
	if($('#otp').val()=="" ||$('#otp').val()==undefined ){
		showMessage(0, " Invalid Otp ", "",true);
		return false;
	}
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForCommon('verify-otp'),
		data : JSON.stringify(getDataForOtpVerification()),
		dataType : 'json',
		async:false,
		success : function(data) {
			if(data['statusCode'] == "2"){
				$(".otp-process").hide();
				$('#parentUserCreateRequest').show();
				showMessage(1, data['message'], "",true);
			}else if(data['statusCode'] == "0"){
				showMessage(0, data['message'], "",true);
			}else if(data['statusCode'] == "3"){
				showMessage(2, data['message'], "",true);
			}else{
				showMessage(0, data['message'], "",true);
			}
		}
	});
}

function getDataForOtpVerification(){
	var request = {};
	var authentication = {};
	var requestData = {};
	requestData['requestValue'] =  $('#parentEmailId').val();;
	requestData['requestExtra1'] = $('#otp').val().trim();
	authentication['hash'] = getHash();
	authentication['schoolId'] = SCHOOL_ID;
	authentication['schoolUUID'] = SCHOOL_UUID;
	request['authentication'] = authentication;
	request['requestData'] = requestData;
	return request;
}

function addressSameAs(){
	var flag=$('#sameAsStudentLocation').is(':checked');
	if(flag){
		$('#sameAsStudentLocation').prop('disabled', true);
		$('#signupStage2 #pCountryId').val($('#countryId').val()).trigger('change');
		window.setTimeout(function(){
			$('#signupStage2 #pStateId').val($('#stateId').val()).trigger('change');
			$('#signupStage2 #pStateId').prop('disabled',true);
			window.setTimeout(function(){
				$('#signupStage2 #pCityId').val($('#cityId').val()).trigger('change');
				$('#signupStage2 #pCityId').prop('disabled',true).promise().done(function(){
					$('#sameAsStudentLocation').prop('disabled',false);	
				});
			},500);
		},500);
		$('#signupStage2 #pCountryId').prop('disabled',true);
	}else{
		$('#signupStage2 #pCountryId').prop('disabled',false);
		$('#signupStage2 #pStateId').prop('disabled',false);
		$('#signupStage2 #pCityId').prop('disabled',false);
		$('#signupStage2 #pCountryId').val('').trigger('change');
		$('#signupStage2 #pStateId').html('<option value="">Select State/Province*</option>');
		$('#signupStage2 #pCityId').html('<option value="">Select City*</option>');
	}
}

function getRequestForParentSelection(){
	var studentRequestDTO = {};
	studentRequestDTO['userId'] = USER_ID;
	return studentRequestDTO;
}
function callForParentSelection() {
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : BASE_URL + CONTEXT_PATH + SCHOOL_UUID +'/student/enrollment/get-parent-details',
		data : JSON.stringify(getRequestForParentSelection()),
		dataType : 'json',
		async : false,
		global : false,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if (data['status'] == '3') {
					redirectLoginPage();
				} else {
					if(data['statusCode']=='ELIGIBLE_CUSTOME_PLAN' || data['statusCode']=='REDIRECT_TO_DASHBOOARD'){
						window.location.reload();
					}else{
						showMessage(false, data['message']);
					}
				}
            	} else {
				renderParentDetails(data);
				$(".step-2-skeleton").html('');
				$(".step-2-skeleton").hide();
				$("#signupStage2").show();
			}
			$(".prev-btn, .next-btn").removeClass("disabled");
		},
		error: function(e){
			if (checkonlineOfflineStatus()) {
				return;
			}
		}
	});
}