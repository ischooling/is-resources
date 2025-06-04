
function getRequestForEnrollmentPartnerTrackerDetails(payload){
	var request = {};
	request['payload'] = payload;
	request['timezone'] = getSystemTimezone();
	return request;
}
function getEnrollmentPartnerTracker(payload) {
	var responseData={};
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : BASE_URL + CONTEXT_PATH + SCHOOL_UUID +'/enrollment-partner/tracker',
		data : JSON.stringify(getRequestForEnrollmentPartnerTrackerDetails(payload)),
		dataType : 'json',
		async : false,
		global : false,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if (data['status'] == '3') {
					redirectLoginPage();
				} else {
					showMessage(false, data['message']);
				}
            	} else {
				responseData=data;
			}
		},
		error: function(e){
			if (checkonlineOfflineStatus()) {
				return;
			}
		}
	});
	return responseData;
}

function getEnrollmentPartnerDetails(payload) {
	var responseData={};
	$.ajax({
		type : "GET",
		contentType : "application/json",
		url : BASE_URL + CONTEXT_PATH + SCHOOL_UUID +'/enrollment-partner/details?payload='+payload,
		dataType : 'json',
		async : false,
		global : false,
		success : function(data) {
			console.log(data)
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				showMessage(false, data['message']);
				responseData=data;
            	} else {
				responseData=data;
			}
		},
		error: function(e){
			if (checkonlineOfflineStatus()) {
				return;
			}
		}
	});
	return responseData;
}

function getRequestForEnrollmentPartnerDetails(formId){
	var request = {};
	request['b2bAssignTo'] = $('#'+formId+' #b2bAssignTo').val();
	request['b2bleadId'] = $('#'+formId+' #b2bleadId').val();
	request['partnerType'] = $('input[name="partner_type"]:checked').val();

	request['firstName'] = $('#'+formId+' #firstName').val();
	request['middleName'] = $('#'+formId+' #middleName').val();
	request['lastName'] = $('#'+formId+' #lastName').val();

	request['email'] = $('#'+formId+' #email').val();
	request['countryId'] = $('#'+formId+' #countryId').val();
	request['stateId'] = $('#'+formId+' #stateId').val();
	request['cityId'] = $('#'+formId+' #cityId').val();
	
	request['phoneIsdCode'] = $('#'+formId+' #phoneIsdCode').val();
	request['phoneNumber'] = getPlaneFormattedPhone($('#'+formId+' #phoneNumber').val());
	request['phoneIsoCode'] = $('#'+formId+' #phoneIsoCode').val();

	request['whatsappIsdCode'] = $('#'+formId+' #whatsappIsdCode').val();
	request['whatsappNumber'] = getPlaneFormattedPhone($('#'+formId+' #whatsappNumber').val());
	request['whatsappIsoCode'] = $('#'+formId+' #whatsappIsoCode').val();
	
	
	if('I'==$('input[name="partner_type"]:checked').val()){
		request['workingCountries'] = $('#'+formId+' #workingCountries').val();//check how data captured
		request['industryId'] = $('#'+formId+' #industryId').val();
		if($('#'+formId+' #industryId').val()==99){
			request['otherIndustry'] = $('#'+formId+' #otherIndustry').val();
		}
		request['experienceId'] = $('#'+formId+' #experienceId').val();
	}else if('O'==$('input[name="partner_type"]:checked').val()){
		request['organizationName'] = $('#'+formId+' #organizationName').val();
		request['designation'] = $('#'+formId+' #designation').val();
		request['operatingCountries'] = $('#'+formId+' #operatingCountries').val();//check how data captured
		request['establishmentYear'] = $('#'+formId+' #establishmentYear').val();
		request['noOfEmployee'] = $('#'+formId+' #noOfEmployee').val();
		request['organizationType'] = $('input[name="organizationType"]:checked').val();
		request['companyRegistration'] = $('input[name="companyRegistration"]:checked').val();
	}
	request['additionalInfo'] = $('#'+formId+' #additionalInfo').val();
	return request;
}

function saveEnrollmentPartnerDetails(formId) {
	if(!enrollmentPartnerFormVaidation(formId)){
		return false;
	}
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : BASE_URL + CONTEXT_PATH + SCHOOL_UUID +'/enrollment-partner/save',
		data : JSON.stringify(getRequestForEnrollmentPartnerDetails(formId)),
		dataType : 'json',
		async : false,
		global : false,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if (data['status'] == '3') {
					redirectLoginPage();
				} else {
					showMessageTheme2(0,data['message'])

				}
            	} else {
				if($('#'+formId+' #b2bAssignTo').val()>0){
					showMessageTheme2(1,data['message'])
				}else{
					window.location.href=BASE_URL +CONTEXT_PATH+SCHOOL_UUID+ '/enrollment-partner-thankyou?payload='+data['payload']
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

function chooseTypeOfPartner(src){
	if($(src).val()=="I"){
		$(".individual-field").show();
		$(".organization-field").hide();
		$(".additional-information-wrapper").toggleClass('col-xl-6 col-lg-6 col-md-6 col-xl-12 col-lg-12 col-md-12 ')
	}else{
		$(".organization-field").show();
		$(".individual-field").hide();
		$(".additional-information-wrapper").toggleClass('col-xl-12 col-lg-12 col-md-12 col-xl-6 col-lg-6 col-md-6 ')
	}
}

function sameAsWhatsApp(src, phoneNo){
	var whatsAppNumberValue = $('#whatsappNumber').val();
	var whatsAppNumberdialCode = $('#whatsappNumber').attr('data-ISO-code');
	var phoneNumberdialCode = $('#phoneNumber').attr('data-ISO-code');
	if ($(src).is(":checked")) {
		$('#phoneNumber').val(whatsAppNumberValue);
		if(!$("#whatsappNumber").prop("disabled")){
			$('#whatsappNumber').attr('disabled', true).css({ "background": "#e3e3e3" });
		}
		if ($("#phoneNumber").length > 0) {
			if(!$("#phoneNumber").prop("disabled")){
				$('#phoneNumber').attr('disabled', true).css({ "background": "#e3e3e3" });
			}
			itiContcat1.setCountry('');
			itiContcat1.setCountry(whatsAppNumberdialCode);
		}
	} else {
		if ($("#phoneNumber").length > 0) {
			$('#phoneNumber').val(phoneNo);
			$('#phoneNumber').attr('disabled', false).css({ "background": "#fff" });
			itiContcat1.setCountry('');
			itiContcat1.setCountry(phoneNumberdialCode);
		}
		// $('#whatsappNumber').attr('disabled', true).css({ "background": "#fff" });

	}
}

function setDefaultFormValues(data){
	var workInCountries=[];
	var operatingCountries=[];
	$.each(data.details.workInCountries, function(k,v){
		workInCountries.push(v.key);
	});
	$.each(data.details.operatingCountries, function(k,v){
		operatingCountries.push(v.key);
	});
	itiContcat.setCountry(data.details.whatsappIsoCode);
	itiContcat1.setCountry(data.details.phoneIsoCode);
	$("#countryId").val(data.details.countryId).trigger("change");
	$("#stateId").val(data.details.stateId).trigger("change");
	$("#cityId").val(data.details.cityId).trigger("change");
	$("#noOfEmployee").val(data.details.noOfEmployees).trigger("change");
	$("#operatingCountries").val(operatingCountries).trigger("change");
	$("#workingCountries").val(workInCountries).trigger("change");
	$("#establishmentYear").val(data.details.establishmentYear).trigger("change");
	$("#experienceId").val(data.details.experienceId).trigger("change");
	$("#industryId").val(data.details.industryId).trigger("change");
}

function enrollmentPartnerFormVaidation(formId){
	var formSubmissionflag = true;
	if($("#"+formId+" #firstName").val() == undefined || $("#"+formId+" #firstName").val() == null || $("#"+formId+" #firstName").val() == ''){
		formvalidationMsg(false, 'First Name is required','firstNameError');
		formSubmissionflag= false;
	}
	if($("#"+formId+" #lastName").val() == undefined || $("#"+formId+" #lastName").val() == null || $("#"+formId+" #lastName").val() == ''){
		formvalidationMsg(false, 'Last Name is required','lastNameError');
		formSubmissionflag= false;
	}
	if($("#"+formId+" #whatsappNumber").val() == undefined || $("#"+formId+" #whatsappNumber").val() == null || $("#"+formId+" #whatsappNumber").val() == ''){
		formvalidationMsg(false, 'WhatsApp Number is required','whatsappNumberError');
		formSubmissionflag= false;
	}
	// if($("#"+formId+" #phoneNumber").val() == undefined || $("#"+formId+" #phoneNumber").val() == null || $("#"+formId+" #phoneNumber").val() == ''){
	// 	formvalidationMsg(false, 'Phone Number is required','phoneNumberError');
	// 	formSubmissionflag= false;
	// }
	if($("#"+formId+" #email").val() == undefined || $("#"+formId+" #email").val() == null || $("#"+formId+" #email").val() == ''){
		formvalidationMsg(false, 'Email is required','emailError');
		formSubmissionflag= false;
	}
	if($("#"+formId+" #countryId").val() == undefined || $("#"+formId+" #countryId").val() == null || $("#"+formId+" #countryId").val() == ''){
		formvalidationMsg(false, 'Country is required','countryIdError');
		formSubmissionflag= false;
	}
	if($("#"+formId+" #stateId").val() == undefined || $("#"+formId+" #stateId").val() == null || $("#"+formId+" #stateId").val() == ''){
		formvalidationMsg(false, 'State/Province is required','stateIdError');
		formSubmissionflag= false;
	}
	if($("#"+formId+" #cityId").val() == undefined || $("#"+formId+" #cityId").val() == null || $("#"+formId+" #cityId").val() == ''){
		formvalidationMsg(false, 'City is required','cityIdError');
		formSubmissionflag= false;
	}
	
	if($('input[name="partner_type"]:checked').val()=='I'){
		if($("#"+formId+" #workingCountries").val() == undefined || $("#"+formId+" #workingCountries").val() == null || $("#"+formId+" #workingCountries").val().length == '0'){
			formvalidationMsg(false, 'Actively Working Countries are required','workingCountriesError');
			formSubmissionflag= false;
		}
		// if($("#"+formId+" #numberOFoperatingCountries").val() == undefined || $("#"+formId+" #numberOFoperatingCountries").val() == null || $("#"+formId+" #numberOFoperatingCountries").val() == ''){
		// 	showMessageTheme2(0, 'Last Name is either empty or invalid');
		// 	return false;
		// }
		if($("#"+formId+" #industryId").val() == undefined || $("#"+formId+" #industryId").val() == null || $("#"+formId+" #industryId").val() == ''){
			formvalidationMsg(false, 'Industry is required','industryIdError');
			formSubmissionflag= false;
		}
		if($('#'+formId+' #industryId').val()==99){
			if($("#"+formId+" #otherIndustry").val() == undefined || $("#"+formId+" #otherIndustry").val() == null || $("#"+formId+" #otherIndustry").val() == ''){
				formvalidationMsg(false, 'Years of Experience is required','otherIndustryError');
				formSubmissionflag= false;
			}
		}
		if($("#"+formId+" #experienceId").val() == undefined || $("#"+formId+" #experienceId").val() == null || $("#"+formId+" #experienceId").val() == ''){
			formvalidationMsg(false, 'Years of Experience is required','experienceIdError');
			formSubmissionflag= false;
		}
		
	}else if($('input[name="partner_type"]:checked').val()=='O'){
		if($("#"+formId+" #organizationName").val() == undefined || $("#"+formId+" #organizationName").val() == null || $("#"+formId+" #organizationName").val() == ''){
			formvalidationMsg(false, 'Name of Organization/Company is required','organizationNameError');
			formSubmissionflag= false;
		}
		if($("#"+formId+" #designation").val() == undefined || $("#"+formId+" #designation").val() == null || $("#"+formId+" #designation").val() == ''){
			formvalidationMsg(false, 'Designation is required','designationError');
			formSubmissionflag= false;
		}
		if($("#"+formId+" #operatingCountries").val() == undefined || $("#"+formId+" #operatingCountries").val() == null || $("#"+formId+" #operatingCountries").val().length == '0'){
			formvalidationMsg(false, 'Actively Operating Countries are required','operatingCountriesError');
			formSubmissionflag= false;
		}
		if($("#"+formId+" #establishmentYear").val() == undefined || $("#"+formId+" #establishmentYear").val() == null || $("#"+formId+" #establishmentYear").val() == ''){
			formvalidationMsg(false, 'Year of Establishment is required','establishmentYearError');
			formSubmissionflag= false;
		}
		if($("#"+formId+" #noOfEmployee").val() == undefined || $("#"+formId+" #noOfEmployee").val() == null || $("#"+formId+" #noOfEmployee").val() == ''){
			formvalidationMsg(false, 'Total No. of Employees is required','noOfEmployeeError');
			formSubmissionflag= false;
		}
		if($('input[name="organizationType"]:checked').val() == undefined || $('input[name="organizationType"]:checked').val() == null || $('input[name="organizationType"]:checked').length<1){
			formvalidationMsg(false, 'Type of Organization/Company is required','organizationTypeError');
			formSubmissionflag= false;
		}
		if($('input[name="companyRegistration"]:checked').val() == undefined || $('input[name="companyRegistration"]:checked').val() == null || $('input[name="companyRegistration"]:checked').length<1){
			formvalidationMsg(false, 'Registration Type of Organization/Company is required','companyRegistrationError');
			formSubmissionflag= false;
		}
	}
	return formSubmissionflag;
}

function checkSameAsIsDasble(src, disabledEle){
	if($(src).val().length>5){
		$("#"+disabledEle).attr('disabled', false);
	}else{
		$("#"+disabledEle).attr('disabled', true);
	}
}

function formvalidationMsg(type,msg,errorEle){
	if(type){
		$("#"+errorEle).show();
		$("#"+errorEle).text(msg);
		$("#"+errorEle).addClass("valid-element");
		$("#"+errorEle).removeClass("invalid-element");
	}else{
		$("#"+errorEle).show();
		$("#"+errorEle).text(msg);
		$("#"+errorEle).addClass("invalid-element");
		$("#"+errorEle).removeClass("valid-element");
	}
}

function formElementDisabled(data, formId){
	if($("#"+formId+" #firstName").val() != undefined && $("#"+formId+" #firstName").val() != null && $("#"+formId+" #firstName").val() != ''){
		if(!data['edit']){
			$("#"+formId+" #firstName").attr("disabled",true);
		}
	}
	if($("#"+formId+" #middleName").val() != undefined && $("#"+formId+" #middleName").val() != null && $("#"+formId+" #middleName").val() != ''){
		// $("#"+formId+" #middleName").attr("disabled",true);
	}
	if($("#"+formId+" #lastName").val() != undefined && $("#"+formId+" #lastName").val() != null && $("#"+formId+" #lastName").val() != ''){
		if(!data['edit']){
			$("#"+formId+" #lastName").attr("disabled",true);
		}
	}
	if($("#"+formId+" #whatsappNumber").val() != undefined && $("#"+formId+" #whatsappNumber").val() != null && $("#"+formId+" #whatsappNumber").val() != ''){
		if(!data['edit']){
			$("#"+formId+" #whatsappNumber").attr("disabled",true);
		}else{
			$("#"+formId+" #whatsappNumber").attr("disabled",false);
		}
	}
	if($("#"+formId+" #phoneNumber").val() != undefined && $("#"+formId+" #phoneNumber").val() != null && $("#"+formId+" #phoneNumber").val() != ''){
		// $("#"+formId+" #phoneNumber").attr("disabled",true);
	}
	if($("#"+formId+" #phoneNumber").val() != undefined && $("#"+formId+" #phoneNumber").val() != null && $("#"+formId+" #phoneNumber").val() != '' && $("#"+formId+" #whatsappNumber").val() != undefined && $("#"+formId+" #whatsappNumber").val() != null && $("#"+formId+" #whatsappNumber").val() != ''){
		// if(!data['edit']){
		// 	$('input[name="sameAsWhatsappNumber"]').attr("disabled",true);
		// }
	}
	if($("#"+formId+" #email").val() != undefined && $("#"+formId+" #email").val() != null && $("#"+formId+" #email").val() != ''){
		if(!data['edit']){
			$("#"+formId+" #email").attr("disabled",true);
		}else{
			$("#"+formId+" #email").attr("disabled",false);
		}
	}
	if($("#"+formId+" #countryId").val() != undefined && $("#"+formId+" #countryId").val() != null && $("#"+formId+" #countryId").val() != ''){
		if(!data['edit']){
			$("#"+formId+" #countryId").attr("disabled",true);
		}
	}
	if($("#"+formId+" #stateId").val() != undefined && $("#"+formId+" #stateId").val() != null && $("#"+formId+" #stateId").val() != ''){
		if(!data['edit']){
			$("#"+formId+" #stateId").attr("disabled",true);
		}
	}
	if($("#"+formId+" #cityId").val() != undefined && $("#"+formId+" #cityId").val() != null && $("#"+formId+" #cityId").val() != ''){
		if(!data['edit']){
			$("#"+formId+" #cityId").attr("disabled",true);
		}
	}
	if($("#"+formId+" #workingCountries").val() != undefined && $("#"+formId+" #workingCountries").val() != null && $("#"+formId+" #workingCountries").val().length != '0'){
		// $("#"+formId+" #workingCountries").attr("disabled",true);
	}
	if($("#"+formId+" #industryId").val() != undefined && $("#"+formId+" #industryId").val() != null && $("#"+formId+" #industryId").val() != ''){
		// $("#"+formId+" #industryId").attr("disabled",true);
	}
	if($('#'+formId+' #industryId').val()==99){
		if($("#"+formId+" #otherIndustry").val() != undefined && $("#"+formId+" #otherIndustry").val() != null && $("#"+formId+" #otherIndustry").val() != ''){
			// $("#"+formId+" #otherIndustry").attr("disabled",true);
		}
	}
	if($("#"+formId+" #experienceId").val() != undefined && $("#"+formId+" #experienceId").val() != null && $("#"+formId+" #experienceId").val() != ''){
		// $("#"+formId+" #experienceId").attr("disabled",true);
	}
	if($("#"+formId+" #organizationName").val() != undefined && $("#"+formId+" #organizationName").val() != null && $("#"+formId+" #organizationName").val() != ''){
		// $("#"+formId+" #organizationName").attr("disabled",true);
	}
	if($("#"+formId+" #designation").val() == undefined || $("#"+formId+" #designation").val() == null || $("#"+formId+" #designation").val() == ''){
		// $("#"+formId+" #designation").attr("disabled",true);
	}
	if($("#"+formId+" #operatingCountries").val() != undefined && $("#"+formId+" #operatingCountries").val() != null && $("#"+formId+" #operatingCountries").val().length != '0'){
		// $("#"+formId+" #operatingCountries").attr("disabled",true);
	}
	if($("#"+formId+" #establishmentYear").val() != undefined && $("#"+formId+" #establishmentYear").val() != null && $("#"+formId+" #establishmentYear").val() != ''){
		// $("#"+formId+" #establishmentYear").attr("disabled",true);
	}
	if($("#"+formId+" #noOfEmployee").val() != undefined && $("#"+formId+" #noOfEmployee").val() != null && $("#"+formId+" #noOfEmployee").val() != ''){
		// $("#"+formId+" #noOfEmployee").attr("disabled",true);
	}
	if($('input[name="organizationType"]:checked').val() != undefined && $('input[name="organizationType"]:checked').val() != null && $('input[name="organizationType"]:checked').length>0){
		// $('input[name="organizationType"]').attr("disabled",true);
	}
	if($('input[name="companyRegistration"]:checked').val() != undefined && $('input[name="companyRegistration"]:checked').val() != null && $('input[name="companyRegistration"]:checked').length>0){
		// $('input[name="companyRegistration"]').attr("disabled",true);
	}
	if($("#"+formId+" #additionalInfo").val() != undefined && $("#"+formId+" #additionalInfo").val() != null && $("#"+formId+" #additionalInfo").val() != ''){
		// $("#"+formId+" #additionalInfo").attr("disabled",true);
	}
	// if($('input[name="partner_type"]:checked').val()=='I'){
	// }else if($('input[name="partner_type"]:checked').val()=='O'){
	// }
}

function showServerError(isError, formId, elementId, errorMessage) {
	$('#' + formId + ' #' + elementId).html(errorMessage);
	if (isError) {
		$('#' + formId + ' #' + elementId).removeClass('server-success');
		$('#' + formId + ' #' + elementId).addClass('server-error');
	} else {
		$('#' + formId + ' #' + elementId).addClass('server-success');
		$('#' + formId + ' #' + elementId).removeClass('server-error');
	}
}