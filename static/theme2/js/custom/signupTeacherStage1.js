
// Human-readable message for an intl-tel-input v29.2 getValidationError() code.
// See https://intl-tel-input.com/docs/types#validationerror for the full enum.
if (typeof window.getIntlPhoneValidationMessage !== 'function') {
	window.getIntlPhoneValidationMessage = function(validationError) {
		switch (validationError) {
			case "INVALID_COUNTRY_CODE":
				return 'Please select a valid country code';
			case "TOO_SHORT":
				return 'Phone number is too short for the selected country';
			case "TOO_LONG":
				return 'Phone number is too long for the selected country';
			case "IS_POSSIBLE_LOCAL_ONLY":
			case "INVALID_LENGTH":
			default:
				return 'Please enter a valid phone number for the selected country';
		}
	};
}

// True while the teacher stage-1 form is being programmatically prefilled. While
// set, the #countryId change handler must NOT push the address country onto the
// phone widget (the phone country comes from the saved countryData instead).
var TEACHER_STAGE1_INIT_IN_PROGRESS = false;

function signupTeacherStage1OnLoadEvent(signupTeacher){
	TEACHER_STAGE1_INIT_IN_PROGRESS = true;
	signupTeacher = signupTeacher.details.teacher;
	formValdate('teacherSignupStage1', mandatoryFields, []);
	var scriptExecuted = false;
	if(!scriptExecuted){
		// COUNTRY CODE SCRIPT
		inputContact = document.querySelector("#phone_no");
		if(inputContact == null || inputContact == undefined || inputContact == '') {
			
		}else{
			// General required "Phone Number": init via the shared master helper
			// (searchable dropdown, no separate dial code, no format-as-you-type,
			// length validation). Default number types are kept.
			var teacherInitialCountry = (IGNORECOUNTRYARRAY.includes(signupTeacher.countryData) || signupTeacher.countryData == '' || signupTeacher.countryData == undefined || signupTeacher.countryData == null)
				? 'us' : signupTeacher.countryData;
			itiContcat = initPhoneInputV29(inputContact, {
				initialCountry: teacherInitialCountry,
				onCountryChange: function (country) {
					$('#countryData').val(country ? country.iso2 : '');
					$('#countryIsd').val(country ? country.dialCode : '');
					if(typeof refreshCustomFieldState === "function"){
						refreshCustomFieldState($(inputContact).closest(".custom-field"));
					}
				}
			});
			clearContactNumberOnCountryChange(inputContact);
			scriptExecuted = true;
		}
	}

	$("#teacherFirstName").blur(function() {
		if ($("#teacherFirstName").val().trim()=="") {
			$("#teacherFirstName").valid();
			validEndInvalidField(null, "teacherFirstName");
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
			// Green only if valid for the selected country (correct format), else red cross.
			var _valEnabledT = (typeof isPhoneValidationEnabled !== 'function') || isPhoneValidationEnabled();
			var _validT = (typeof itiIsValidNumber === 'function') ? itiIsValidNumber(itiContcat) : null;
			if (_valEnabledT && _validT === false) {
				validEndInvalidField(false, "phone_no");
			} else {
				validEndInvalidField(true, "phone_no");
			}
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
				if(IGNORECOUNTRYARRAY.includes(selectedCountry)) {
					selectedCountry	= "US";
				}
				// NOTE: The ADDRESS country dropdown no longer overrides the PHONE
				// widget's country. They are independent — the phone country is
				// chosen in the phone widget's own dropdown and loaded from the saved
				// countryData. Auto-syncing address -> phone repeatedly reset a
				// correctly chosen phone country (e.g. India) to the address country
				// (e.g. Sri Lanka / Singapore) on prefill and stored the wrong one.
			}else{
				$("#stateId").html("<option value=''>Select Province/State*</option>");
			}
			callStates('teacherSignupStage1', this.value, 'countryId');
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
			callCities('teacherSignupStage1', this.value, 'stateId');
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
		container: '#datepickerModalView',
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
		$("#datepickerModal").modal("hide");
	});
}

$(document).on('show.bs.modal', function(e) {
    if(e.target.id == "teacherDob" || e.target.id == "teacherDob"){
        $("#datepickerModal").modal("show");
    }
});
$(document).on('keyup', function(e) {
    if (e.key === 'Tab') {
        if ($.trim($('#datepickerModalView').html()) === '') {
            $('#datepickerModal').modal('hide');
        }
    }
});

async function callForSignupTeacherBasicDetailsForm(formId) {
	var flag = false;
	if(!calculateAge(formId)){
		showMessageTheme2(2, ' Date of birth range should be between 18 to 99');
		return false;
	}
	if($("#countryId").val() == ""){
		showMessageTheme2(0, "Select Country");
		return false;
	}
	if($("#stateId").val() == ""){
		showMessageTheme2(0, "Select State");
		return false;
	}
	if($("#cityId").val() == ""){
		showMessageTheme2(0, "Select City");
		return false;
	}
	if($("#phone_no").val().trim() == ""){
		showMessageTheme2(0, "Phone No is required");
		return false;
	}
	// intl-tel-input v29.2 country-aware validation (utils are bundled synchronously via
	// intlTelInputWithUtils, so isValidNumber()/getValidationError() are safe to call here
	// with no extra async wait) - blocks an invalid number for the selected country from save.
	var _phoneValEnabled = (typeof isPhoneValidationEnabled !== 'function') || isPhoneValidationEnabled();
	var _phoneValid = (typeof itiIsValidNumber === 'function') ? itiIsValidNumber(itiContcat) : (itiContcat && itiContcat.isValidNumber());
	if (_phoneValEnabled && typeof itiContcat !== 'undefined' && itiContcat && _phoneValid === false) {
		showMessageTheme2(0, getIntlPhoneValidationMessage(itiContcat.getValidationError()));
		return false;
	}
	hideMessage('');
	$("#nextStep").prop("disabled", true);
	const requestData = getRequestForTeacherBasicDetails(formId);
	const saveResponse = await getDashboardDataBasedUrlAndPayloadWithParentUrl(true, true, 'save-basic-details', requestData, 'teacher/signup');
	if(saveResponse.statusCode == "SUCCESS"){
		showMessageTheme2(1, 'Personal details updated successfully.');
		getStage2Data();
		const firstName = $("#teacherFirstName").val().trim();
		const middleName = $("#teacherMiddleName").val().trim();
		const lastName = $("#teacherLastName").val().trim();
		USER_FULL_NAME = [firstName, middleName, lastName].filter(Boolean).join(" ");
		flag = true;
	}else{
		showMessageTheme2(0, saveResponse.message);
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
		showMessageTheme2(0, 'Date of Birth is not valid');
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
	if(signupTeacher.uploadNetSpeedTestSSName != "" && signupTeacher.uploadNetSpeedTestSSName != undefined){
		$("#fileupload11Span").closest(".valid-field").addClass("true");
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
	if(signupTeacher.uploadNetSpeedTestSSName != ""){
		mandatoryFields.push("fileupload11");
	}
}

async function getStage1Data(step){
	mandatoryFields=[];
	if(step == '2'){
		setSteps(2);
		showSkeleton(true, "step2");
	}else{
		showSkeleton(true, 'step1');
	}
	var payload = {};
	payload['userId'] = USER_ID;
	responseData = await getDashboardDataBasedUrlAndPayloadWithParentUrl(true, true, 'get-teacher-basic-details', payload, '/teacher/signup');
	$("#teacherSignupContentStage1").html(getTeacherBasicInfoContent(responseData));
	$(".step-1-skeleton").hide();
	$("#teacherSignupStage1").show();
	signupTeacherStage1OnLoadEvent(responseData);
	$('.select_dropdown').select2();
	await callCountriesOption("teacherSignupStage1", responseData.details.teacher.countryId, "countryId", responseData.details.teacher.countryId);
	$("#teacherSignupStage1 #stateId").val(responseData.details.teacher.stateId).trigger('change');
	autoSelectDropDownTeacherBasicInformation('teacherSignupStage1', responseData.details.teacher);
	// Prefill done. Re-assert the PHONE country from the saved countryData (the
	// address-country change triggers above may have nudged it) and restore the
	// national number, then re-enable the address->phone sync for real user
	// changes. Guarded so it only runs when a saved phone country exists.
	try {
		var _savedPhoneCountry = responseData.details.teacher.countryData;
		if (typeof itiContcat !== "undefined" && itiContcat && _savedPhoneCountry &&
			_savedPhoneCountry != "" && !IGNORECOUNTRYARRAY.includes(_savedPhoneCountry)) {
			itiSetCountry(itiContcat, _savedPhoneCountry);
			var _savedNumber = responseData.details.teacher.contactNumber || "";
			var _savedDigits = String(_savedNumber).replace(/\D/g, "");
			if (_savedDigits && $("#teacherSignupStage1 #phone_no").val().replace(/\D/g, "") !== _savedDigits) {
				var _phoneEl = document.querySelector("#teacherSignupStage1 #phone_no") || document.querySelector("#phone_no");
				if (_phoneEl) {
					_phoneEl.removeAttribute("maxlength");
					_phoneEl.removeAttribute("data-max-digits");
				}
				$("#teacherSignupStage1 #phone_no").val(_savedDigits);
				if (typeof attachPhoneLengthLimit === "function" && _phoneEl && _phoneEl.intlTelInputInstance) {
					attachPhoneLengthLimit(_phoneEl, _phoneEl.intlTelInputInstance);
				}
			}
		}
	} catch (e) {}
	TEACHER_STAGE1_INIT_IN_PROGRESS = false;
}