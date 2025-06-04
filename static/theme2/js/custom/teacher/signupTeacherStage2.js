
function signupTeacherStage2OnLoadEvent(signupTeacher){
	signupTeacher = signupTeacher.details.teacher;
	formValdate('teacherSignupStage2', mandatoryFields, []);
	var scriptExecuted = false;
	if(!scriptExecuted){
		// COUNTRY CODE SCRIPT
		inputContact = document.querySelector("#phone_no");
		itiContcat = window.intlTelInput(inputContact);
		itiContcat.setCountry(signupTeacher.countryData =='' ? 'US' : signupTeacher.countryData);
		inputContact.addEventListener('countrychange', function(e) {
			$('#countryData').val(itiContcat.getSelectedCountryData().iso2);
			$('#countryIsd').val(itiContcat.getSelectedCountryData().dialCode); 
		});
		scriptExecuted = true;
	}
	
	$("#teacherFirstName").blur(function() {
		if ($("#teacherFirstName").val().trim()=="") {
			$("#teacherFirstName").valid();
			validEndInvalidField(null, "teacherFirstName");
			//showMessage(0, 'First Name is required');
			return false
		}else{
			validEndInvalidField(true, "teacherFirstName");
		}
	});
	$("#teacherMiddleName").blur(function() {
		if ($("#teacherMiddleName").val().trim()=="") {
			validEndInvalidField(null, "teacherMiddleName");
			return false
		}else{
			validEndInvalidField(true, "teacherMiddleName");
		}
	});
	$("#teacherLastName").blur(function() {
		if ($("#teacherLastName").val().trim()=="") {
			$("#teacherLastName").valid();
			validEndInvalidField(null, "teacherLastName");
			return false
		}else{
			validEndInvalidField(true, "teacherLastName");
		}
	});
	$("#phone_no").blur(function() {
		if ($("#phone_no").val().trim()=="") {
			$("#phone_no").valid();
			validEndInvalidField(null, "phone_no");
			return false
		}else{
			validEndInvalidField(true, "phone_no");
		}
	});
	$("#teacherGender").change(function() {
		if ($("#teacherGender").val().trim()=="") {
			$("#teacherGender").valid();
			validEndInvalidField(null, "teacherGender");
			return false
		}else{
			validEndInvalidField(true, "teacherGender");
		}
	});
	$("#countryId").on("change", function() {
		if($(this).val() != null){
			$('#countryId').valid();
			var selectedCountry =  $('option:selected', this).attr("dail-country-code");
			if($('#countryId').valid()){
				validEndInvalidField(true, "countryId");
			}
			if(selectedCountry !=undefined && selectedCountry != ''){
				itiContcat.setCountry(selectedCountry);
			}else{
				$("#stateId").html("<option value=''>Select State/Province*</option>");
			}
			callStates('teacherSignupStage2', this.value, 'countryId');
			$("#cityId").html("<option value=''>Select City*</option>");
			validEndInvalidField(null, "cityId");
			validEndInvalidField(null, "stateId");
		}else{
			$(this).val('');
			$('#countryId').valid();
		}
	});
	$("#stateId").on("change", function() {
		if($(this).val() != null){
			$('#stateId').valid();
			callCities('teacherSignupStage2', this.value, 'stateId');
			validEndInvalidField(true, "stateId");
			validEndInvalidField(null, "cityId");
		}else{
			$(this).val('');
			$('#stateId').valid();
		}
	});
	$("#cityId").on("change", function() {
		if($(this).val() != null){
			$('#cityId').valid();
			validEndInvalidField(true, "cityId");
		}else{
			$(this).val('');
			$('#cityId').valid();
		}
	});

	var startDate = new Date();
    startDate.setFullYear(startDate.getFullYear()-99);
    
    var endDate = new Date();
    endDate.setFullYear(endDate.getFullYear()-18);
    $('#teacherDob').datepicker({
        autoclose : true,
        format : 'M dd, yyyy',
        startDate:startDate,
        endDate:endDate
    }).on('change', function(){
		if ($(this).val().trim()=="") {
			$("#teacherDob").valid();
			validEndInvalidField(null, "teacherDob");
			return false
		}else{
			validEndInvalidField(true, "teacherDob");
		}
	});
}

async function callForSignupTeacherBasicDetailsForm(formId) {
	var flag = false;
	if(!calculateAge(formId)){
		showMessage(2, ' Date of birth range should be between 18 to 99',"", true);
		return false;
	}
	hideMessage('');
	// var flag=false;
	$("#nextStep").prop("disabled", true);
	const requestData = getRequestForTeacherBasicDetails(formId);
	const saveResponse = await getDashboardDataBasedUrlAndPayloadWithParentUrl(true, false, 'save-basic-details', requestData, 'teacher/signup');
	if(saveResponse.statusCode == "SUCCESS"){
		showMessage(1, 'Basic information updated successfully.',"", true);
		getStage3Data();
		flag = true;
	}else{
		showMessage(0, saveResponse.message,"", true);
		flag = false;
	}
	return flag;
}


function getRequestForTeacherBasicDetails(formId){
	var request = {};
	var authentication = {};
	var teacherDetails = {};
	teacherDetails['firstName'] = toTitleCase($("#"+formId+" #teacherFirstName").val());
	teacherDetails['middleName'] = toTitleCase($("#"+formId+" #teacherMiddleName").val());
	teacherDetails['lastName'] = toTitleCase($("#"+formId+" #teacherLastName").val());
	teacherDetails['dob'] = changeDateFormat(new Date($("#"+formId+" #teacherDob").val()), "mm-dd-yyyy");
	teacherDetails['gender'] = $("#"+formId+" #teacherGender").val();
	teacherDetails['countryData'] = $("#"+formId+" #countryData").val()==null || $("#"+formId+" #countryData").val()=='' ? 'us' :  $("#"+formId+" #countryData").val();
	teacherDetails['countryCode'] = $("#"+formId+" #countryIsd").val()==null ||$('#countryIsd').val()=="+null" || $("#"+formId+" #countryIsd").val()=='' ? '1' : $("#"+formId+" #countryIsd").val();
	teacherDetails['contactNumber'] = $("#"+formId+" #phone_no").val();
	teacherDetails['communicationEmail'] = $("#"+formId+" #teacherEmailId").val();
	teacherDetails['countryId'] = $("#"+formId+" #countryId").val();
	teacherDetails['stateId'] = $("#"+formId+" #stateId").val();
	teacherDetails['cityId'] = $("#"+formId+" #cityId").val();
	authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = 'TEACHER';
	authentication['userId'] = $("#"+formId+" #userId").val();
	request['authentication'] = authentication;
	request['teacherDetails'] = teacherDetails;
	return request;
}

function calculateAge(formId){
	var dobd = changeDateFormat(new Date($("#"+formId+" #teacherDob").val()), "mm-dd-yyyy");
	var dob1=dobd.split("-");
	dobd = dobd.split("-").length;
	if(parseInt(dobd)!=3 || parseInt(dob1[1])>31 || parseInt(dob1[0])>12){
		showMessage(0, 'Date of Birth is not valid');
		return false
	}
	var age = M.countAgeNew(dob1[1], dob1[0], dob1[2]);
	if(age<=17.93070676512557 || age>98.98807333666286){
		return false
	}
	return true;
}

var mandatoryFields=[];
function autoSelectDropDownTeacherBasicInformation(formId, signupTeacher){
	if(signupTeacher.countryId != ""){
		mandatoryFields.push("countryId");
	}
	$('#'+formId+' #teacherFirstName').val(signupTeacher.firstName).promise().done(function(){
		if ($("#teacherFirstName").val().trim()=="") {
			validEndInvalidField(null, "teacherFirstName");
			return false
		}else{
			validEndInvalidField(true, "teacherFirstName");
		}
	});
	$('#'+formId+' #teacherMiddleName').val(signupTeacher.middleName).promise().done(function(){
		if ($("#teacherMiddleName").val().trim()=="") {
			validEndInvalidField(null, "teacherMiddleName");
			return false
		}else{
			validEndInvalidField(true, "teacherMiddleName");
		}
	});
	$('#'+formId+' #teacherLastName').val(signupTeacher.lastName).promise().done(function(){
		if ($("#teacherLastName").val().trim()=="") {
			validEndInvalidField(null, "teacherLastName");
			return false
		}else{
			validEndInvalidField(true, "teacherLastName");
		}
	});
	$('#'+formId+' #teacherDob').val(signupTeacher?.dob != "" ? changeDateFormat(new Date(signupTeacher?.dob), "MMM-dd-yyyy") : "").promise().done(function(){
		if ($("#teacherDob").val().trim()=="") {
			validEndInvalidField(null, "teacherDob");
			return false
		}else{
			validEndInvalidField(true, "teacherDob");
		}
	});
	$('#'+formId+' #teacherEmailId').val(signupTeacher.communicationEmail).promise().done(function(){
		if ($("#teacherEmailId").val().trim()=="") {
			validEndInvalidField(null, "teacherEmailId");
			return false
		}else{
			validEndInvalidField(true, "teacherEmailId");
		}
	});
	$('#'+formId+' #phone_no').val(signupTeacher.contactNumber).promise().done(function(){
		if ($("#phone_no").val().trim()=="") {
			validEndInvalidField(null, "phone_no");
			return false
		}else{
			validEndInvalidField(true, "phone_no");
		}
	});
	$('#'+formId+' #countryId').val(signupTeacher.countryId).trigger('change');
	if(signupTeacher.countryId == ""){
		$('#'+formId+' #countryId').attr('disabled',false);
	}
	if(signupTeacher.stateId != ""){
		$('#'+formId+' #stateId').val(signupTeacher.stateId).trigger('change');
		mandatoryFields.push("stateId");
	}
	if(signupTeacher.cityId != ""){
		$('#'+formId+' #cityId').val(signupTeacher.cityId).trigger('change');
		mandatoryFields.push("cityId");
	}
	if(signupTeacher.gender != '' && signupTeacher.gender != null){
		$('#'+formId+' #teacherGender').val(signupTeacher.gender).trigger('change');
	}
	$('#'+formId+' #maritalStatus').val(signupTeacher.maritalStatus).trigger('change');
	$('#'+formId+' #countryData').val(signupTeacher.countryData).trigger('change');
	$('#'+formId+' #countryIsd').val(signupTeacher.countryCode).trigger('change');
	if(signupTeacher.firstName != ""){
		mandatoryFields.push("teacherFirstName");
	}
	if(signupTeacher.middleName != ""){
		mandatoryFields.push("teacherMiddleName");
	}
	if(signupTeacher.lastName != ""){
		mandatoryFields.push("teacherLastName");
	}
	if(signupTeacher.dob != ""){
		mandatoryFields.push("teacherDob");
	}
	if(signupTeacher.gender != ""){
		mandatoryFields.push("teacherGender");
	}
	if(signupTeacher.communicationEmail != ""){
		mandatoryFields.push("teacherEmailId");
	}
	if(signupTeacher.contactNumber != ""){
		mandatoryFields.push("phone_no");
	}
}

async function getStage2Data(step){
	if(step == '2'){
		setSteps(2);
		showSkeleton(true, "step2");
	}else{
		showSkeleton(true, 'step1');
	}
	var payload = {};
	payload['userId'] = USER_ID;
	responseData = await getDashboardDataBasedUrlAndPayloadWithParentUrl(false, false, 'get-teacher-basic-details', payload, '/teacher/signup');
	$("#teacherSignupContentStage2").html(getTeacherBasicInfoContent(responseData));
	$(".step-1-skeleton").hide();
	$("#teacherSignupStage2").show();
	signupTeacherStage2OnLoadEvent(responseData);
	$('.select_dropdown').select2();
	callCountriesOption("teacherSignupStage2", responseData.details.teacher.countryId, "countryId", responseData.details.teacher.countryId);
	//callStates("teacherSignupStage2", responseData.details.teacher.countryId, "countryId", "stateId", "cityId");
	$("#teacherSignupStage2 #stateId").val(responseData.details.teacher.stateId).trigger('change');
	//callCities("teacherSignupStage2", responseData.details.teacher.stateId, "stateId", "cityId");
	autoSelectDropDownTeacherBasicInformation('teacherSignupStage2', responseData.details.teacher); 
}