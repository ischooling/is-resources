var schoolSettingsLinks;
async function renderEnrollmentPartnerPage(UNIQUEUUID, MAINTENANCEDOWNTIME,payload){
	schoolSettingsLinks = await getSchoolSettingsLinks(SCHOOL_ID);
	var data = getEnrollmentPartnerDetails(payload);
	if(data['trackerPageUrl']!=null){
		window.location.href=data['trackerPageUrl']
	}else{
		$("body").append(renderEnrollmentPartnerPageContent(UNIQUEUUID, MAINTENANCEDOWNTIME,payload));
		$("#countryId").select2({
			// placeholder: "Select a country",
			theme:"bootstrap4",
		}).on("change", function(){
			callStates('enrollmentPartnerForm', this.value, 'countryId');
			callCities('enrollmentPartnerForm', this.value, 'stateId');
		});
		$("#stateId").select2({
			// placeholder: "Select a state",
			theme:"bootstrap4",
		}).on("change", function(){
			callCities('enrollmentPartnerForm', this.value, 'stateId');
		});
		$("#cityId").select2({
			// placeholder: "Select a city",
			theme:"bootstrap4",
		});
		$("#workingCountries").select2({
			// placeholder: "Select country",
			theme:"bootstrap4",
		}).on('change',function(){
			$("#numberOFCountries").val($(this).val().length);
		});
		$("#industryId").select2({
			// placeholder: "Select an Industry",
			theme:"bootstrap4",
		}).on('change', function(){
			if($(this).val() == "99"){
				$(".industrySpecify-wrapper").show();
				$(".industry-type-wrapper").removeClass('w-100');
				$(".industry-type-wrapper").addClass('w-50');
			}else{
				$(".industrySpecify-wrapper").hide();
				$(".industry-type-wrapper").addClass('w-100');
				$(".industry-type-wrapper").removeClass('w-50');
			}
		});
		$("#experienceId").select2({
			placeholder: "Select years of experience",
			theme:"bootstrap4",
		});
		$("#operatingCountries").select2({
			theme:"bootstrap4",
		}).on('change',function(){
			$("#numberOFoperatingCountries").val($(this).val().length);
		});
		$("#noOfEmployee").select2({
			theme:"bootstrap4",
		});
		$("#establishmentYear").select2({
			// placeholder: "Select a year of establishment",
			theme:"bootstrap4",
		});
	
		var inputContact = document.querySelector("#whatsappNumber");
		itiContcat = window.intlTelInput(inputContact, {
			separateDialCode: true,
		});
		// inputContact.setCountry('US');
		inputContact.addEventListener('countrychange', function (e) {
			$('#whatsappIsoCode').val(itiContcat.getSelectedCountryData().iso2);
			$('#whatsappIsdCode').val(itiContcat.getSelectedCountryData().dialCode);
		});
	
		var inputContact1 = document.querySelector("#phoneNumber");
		itiContcat1 = window.intlTelInput(inputContact1, {
			separateDialCode: true,
		});
		// inputContact1.setCountry('US');
		inputContact1.addEventListener('countrychange', function (e) {
			$('#phoneIsoCode').val(itiContcat1.getSelectedCountryData().iso2);
			$('#phoneIsdCode').val(itiContcat1.getSelectedCountryData().dialCode);
		});
		if($("#asAnIndividual").prop("checked")){
			$(".individual-field").show();
			$(".organization-field").hide();
		}else if($("#behalfOfCompanyOrganization").prop("checked")){
			$(".organization-field").show();
			$(".individual-field").hide();
		}else{
			$(".individual-field").show();
			$(".organization-field").hide();
		}
		// Set Default From Value below
		setDefaultFormValues(data);
		formElementDisabled(data,"enrollmentPartnerForm");
		$(".iti__country-list").css({"z-index":"10"});
		$(".custom-control").css({"min-width":"85px"});
	}
}

function renderEnrollmentPartnerPageContent(UNIQUEUUID, MAINTENANCEDOWNTIME,payload){
	var data = getEnrollmentPartnerDetails(payload);
	var html=enrollmentPartnerBasicDetails(data)
			+showMessageContent()			
	return html;
}

function enrollmentPartnerBasicDetails(data){
	// var schoolSettingsTechnical = getSchoolSettingsTechnical(SCHOOL_ID);
	
	var html=
	'<div class="app-main w-100" style="padding-bottom: 60px;">'
		+'<form id="enrollmentPartnerForm">'
			+'<div class="app-main__inner pt-1">'
				+'<div class="full text-center mt-3">'
					+'<a href="'+schoolSettingsLinks.schoolWebsite+'" target="blank">'
						+'<img src="'+schoolSettingsLinks.logoUrl+''+SCRIPT_VERSION+'" width="350px" class="new-logo-2024" />'
					+'</a>'
				+'</div>'
				+'<div class="full text-center mt-5 mb-2">'
					+'<span class="d-inline-block bg-primary py-2 px-3 font-weight-semi-bold text-white rounded">Interest Form For Partnership</span>'
				+'</div>'
				+'<div class="full px-sm-4 px-0 font-size-md mt-2">'
					+'<div class="col-12 px-sm-2 px-0">'
						+'<input type="hidden" id="b2bAssignTo" value="'+data.b2bAssignTo+'">'
						+'<input type="hidden" id="b2bleadId" value="'+data.details.b2bleadId+'">'
						+'<input type="hidden" id="phoneIsdCode" value="'+data.details.phoneIsdCode+'">'
						+'<input type="hidden" id="phoneIsoCode" value="'+data.details.phoneIsoCode+'">'

						+'<input type="hidden" id="whatsappIsoCode" value="'+data.details.whatsappIsoCode+'">'
						+'<input type="hidden" id="whatsappIsdCode" value="'+data.details.whatsappIsdCode+'">'
						+'<div class="row align-items-center">'
							+'<p class="mb-0 ml-3">Filling this Interest Form</p>'
							+'<div class="col-xl-4 col-lg-12 col-md-12 col-sm-12 col-12 mt-2 mt-md-0 ml-4">'
								+'<div class="full custom-radio custom-control p-0">'
									+'<input type="radio" id="asAnIndividual" name="partner_type" value="I" class="mt-1 custom-control-input" onclick="chooseTypeOfPartner(this)" '+(data.details.partnerType =='I'?"checked":"")+' tabindex="1">'
									+'<label for="asAnIndividual" class="d-flex custom-control-label align-items-center mb-0">As an Individual</label>'
								+'</div>'
							+'</div>'
							+'<div class="col-xl-4 col-lg-12 col-md-12 col-sm-12 col-12 mt-2 mt-md-0">'
								+'<div class="full custom-radio custom-control">'
									+'<input type="radio" id="behalfOfCompanyOrganization" name="partner_type" value="O" class="mt-1 custom-control-input" onclick="chooseTypeOfPartner(this)" '+(data.details.partnerType =='O'?"checked":"")+' tabindex="2">'
									+'<label for="behalfOfCompanyOrganization" class="d-flex custom-control-label align-items-center mb-0">On behalf of my Company | Organization | Institution</label>'
								+'</div>'
							+'</div>'
						+'</div>'
						// +'<hr class="mb-0">'
						// +'<hr class="m-0">'
					+'</div>'
					// +'<div class="col-12">'
					// 	+'<div class="row">'
					// 		+'<div class="col-12">'
					// 			+'<p class="text-primary m-0 font-weight-semi-bold">What is your full name?* 1</p>'
					// 		+'</div>'
					// 	+'</div>'
					// +'</div>'
				+'</div>'
			+'</div>'
			+'<div class="full">'
				+'<hr class="my-1">'
				+'<div class="app-main__inner pt-0">'
					+'<div class="full px-sm-4 px-0 font-size-md">'
						+'<div class="col-12 px-sm-2 px-0">'
							+'<div class="row">'
								+'<div class="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12 mb-2">'
									+'<label class="m-0">First Name*</label>'
									+'<input type="text" id="firstName" name="firstName" value="'+data.details.firstName+'" class="form-control" required autocomplete="off" tabindex="3">'
									+'<p class="m-0" id="firstNameError"></p>'
								+'</div>'
								+'<div class="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12 mb-2">'
									+'<label class="m-0">Middle Name</label>'
									+'<input type="text" id="middleName" name="middleName" value="'+data.details.middleName+'" class="form-control" autocomplete="off" tabindex="4">'
								+'</div>'
								+'<div class="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12 mb-2">'
									+'<label class="m-0">Last Name*</label>'
									+'<input type="text" id="lastName" name="lastName" value="'+data.details.lastName+'"  class="form-control" required autocomplete="off" tabindex="5">'
									+'<p class="m-0" id="lastNameError"></p>'
								+'</div>'
								// +'<div class="col-12 my-1">'
								// 	+'<p class="text-primary m-0 font-weight-semi-bold">Contact Details*</p>'
								// +'</div>'
								+'<div class="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12 mb-2 position-relative">'
									+'<label class="m-0">Mobile Number*</label>'
									+'<input type="tel" id="whatsappNumber" name="whatsappNumber" value="'+data.details.whatsappNumber+'" data-ISO-code="'+data.details.whatsappIsoCode+'" '+(data.details.otpVerifiedByWhatsapp=='W'?'disabled':'')+' onkeyup="checkSameAsIsDasble(this, \'sameAsWhatsappNumber\')" class="form-control" required autocomplete="off" tabindex="6">'
									+'<p class="m-0" id="whatsappNumberError"></p>';
									if(data.details.otpVerifiedByWhatsapp=='W' || data.details.otpVerifiedByWhatsapp=='N'){
										if(data.details.otpVerifiedByWhatsapp=='W'){
											html+='<img src="'+PATH_FOLDER_IMAGE+'watsapp-icon.png" width="16px" style="position:absolute;right:40px;top:33px" />';
										}
										html+='<img src="'+PATH_FOLDER_IMAGE2+'payment-sucess.png" width="16px" style="position:absolute;right:20px;top:33px"/>'
									}
								html+=
								'</div>'
								+'<div class="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12 mb-2">'
									+'<label class="m-0">Alternate Phone Number</label>'
									+'<input type="tel" id="phoneNumber" name="phoneNumber" value="'+data.details.phoneNumber+'" data-ISO-code="'+data.details.phoneIsoCode+'" class="form-control" required autocomplete="off" tabindex="7">'
									+'<p class="m-0" id="phoneNumberError"></p>'
									// +'<div class="full custom-checkbox custom-control">'
									// 	+'<input type="checkbox" id="sameAsWhatsappNumber" name="sameAsWhatsappNumber" class="custom-control-input" onclick="sameAsWhatsApp(this,'+data.details.whatsappNumber+')" '+(data.details.sameAsWhatsapp=='Y'?'checked':'')+' tabindex="8">'
									// 	+'<label for="sameAsWhatsappNumber" class="d-flex custom-control-label align-items-center mt-1">Same as Phone Number</label>'
									// +'</div>'
								+'</div>'
								+'<div class="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12 mb-2 position-relative">'
									+'<label class="m-0">Email*</label>'
									+'<input type="email" id="email" name="email" value="'+data.details.email+'" class="form-control" '+(data.details.otpVerifiedByWhatsapp=='E'?'disabled':'')+' required autocomplete="off" tabindex="9">'
									+'<p class="m-0" id="emailError"></p>';
									if(data.details.otpVerifiedByWhatsapp=='E'){
										html+='<img src="'+PATH_FOLDER_IMAGE2+'payment-sucess.png" width="16px" style="position:absolute;right:20px;top:33px"/>'
									}
								html+=
								'</div>'
								+'<div class="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12 mb-2">'
									+'<label class="m-0">Country*</label>'
									+'<select id="countryId" name="countryId" class="form-control" required autocomplete="off" tabindex="10">'
										// +'<option></option>';
										$.each(data.details.contries, function(k, v){
											html+='<option value="'+v.key+'" data-ISO-code="'+v.extra+'">'+v.value+'</option>';
										});
									html+='</select>'
									+'<p class="m-0" id="countryIdError"></p>'
								+'</div>'
								+'<div class="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12 mb-2">'
									+'<label class="m-0">State*</label>'
									+'<select id="stateId" name="stateId" class="form-control" autocomplete="off" tabindex="11">'
										// +'<option></option>';
										$.each(data.details.states, function(k, v){
											html+='<option value="'+v.key+'">'+v.value+'</option>';
										});
									html+='</select>'
									+'<p class="m-0" id="stateIdError"></p>'
								+'</div>'
								+'<div class="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12 mb-2">'
									+'<label class="m-0">City*</label>'
									+'<select id="cityId" name="cityId" class="form-control" required autocomplete="off" tabindex="12">'
										// +'<option></option>';
										$.each(data.details.cities, function(k, v){
											html+='<option value="'+v.key+'">'+v.value+'</option>';
										});
									html+='</select>'
									+'<p class="m-0" id="cityIdError"></p>'
								+'</div>'
								// +'<div class="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12 individual-field">'
								// 	+'<p class="text-primary m-0 font-weight-semi-bold">Kindly specify how many countries you actively work in*</p>'
								// 	+'<div class="row">'
								// 		+'<div class="col-xl-8 col-lg-8 col-md-8 col-sm-12 col-12 mb-2">'
								// 			+'<label class="m-0">Select Countries:*</label>'
								// 			+'<select id="workingCountries" name="workingCountries" class="form-control" required autocomplete="off" multiple="multiple" tabindex="13">'
								// 				+'<option></option>';
								// 				$.each(data.details.contries, function(k, v){
								// 					html+='<option value="'+v.key+'" data-ISO-code="'+v.extra+'">'+v.value+'</option>';
								// 				});
								// 			html+='</select>'
								// 			+'<p class="m-0" id="workingCountriesError"></p>'
								// 		+'</div>'
								// 		+'<div class="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12 mb-2">'
								// 			+'<label class="m-0">Total No of Countries:*</label>'
								// 			+'<input type="text" id="numberOFCountries" name="numberOFCountries" value="'+data.details.workInCountries.length+'" class="form-control" disabled>'
								// 			+'<p class="m-0" id="numberOFCountriesError"></p>'
								// 		+'</div>'
								// 	+'</div>'
								// +'</div>'
								+'<div class="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12 mb-2 individual-field">'
									// +'<p class="text-primary m-0 font-weight-semi-bold">Which Industry do you work in?*</p>'
									+'<div class="d-flex">'
										+'<div class="w-100 industry-type-wrapper">'
											+'<label class="m-0">Select industry do you work in*</label>'
											+'<select id="industryId" name="industryId" class="form-control" required autocomplete="off" tabindex="14">'
												// +'<option></option>';
												$.each(data.details.industries, function(k, v){
													html+='<option value="'+v.key+'">'+v.value+'</option>';
												});
											html+='</select>'
											+'</select>'
											+'<p class="m-0" id="industryIdError"></p>'
										+'</div>'
										// +'<div class="w-100 ml-4 industrySpecify-wrapper" style="display:none">'
										// 	+'<label class="m-0">Please Specify*</label>'
										// 	+'<input type="text" id="otherIndustry" name="otherIndustry" value="'+(data.details.industryId=='99'?data.details.industryOther:"")+'" class="form-control" rows="2" required tabindex="15"/>'
										// 	+'<p class="m-0" id="otherIndustryError"></p>'
										// +'</div>'
									+'</div>'
								+'</div>'
								// +'<div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 mb-2 individual-field">'
								// 	+'<p class="text-primary m-0 font-weight-semi-bold">Years of experience in the current industry*</p>'
								// 	+'<label class="m-0">Select Years:*</label>'
								// 	+'<select id="experienceId" name="experienceId" class="form-control" required autocomplete="off" tabindex="16">'
								// 		+'<option></option>';
								// 		$.each(data.details.experiences, function(k, v){
								// 			html+='<option value="'+v.key+'">'+v.value+'</option>';
								// 		});
								// 	html+='</select>'
								// 	+'<p class="m-0" id="experienceIdError"></p>'
								// +'</div>'
								+'<div class="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12 mb-2 organization-field">'
									// +'<p class="text-primary m-0 font-weight-semi-bold">Name of the Organization/Company*</p>'
									+'<label class="m-0">Name of the Company | Organization | Institution*</label>'
									+'<input type="text" id="organizationName" name="organizationName" value="'+data.details.organizationName+'"class="form-control" required autocomplete="off" tabindex="17">'
									+'<p class="m-0" id="organizationNameError"></p>'
								+'</div>'
								+'<div class="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12 mb-2 organization-field">'
									// +'<p class="text-primary m-0 font-weight-semi-bold">What is your designation at the Organization/Company*</p>'
									+'<label class="m-0">Designation*</label>'
									+'<input type="text" id="designation" name="designation" value="'+data.details.designation+'"class="form-control" required autocomplete="off" tabindex="18">'
									+'<p class="m-0" id="designationError"></p>'
								+'</div>'
								+'<div class="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12 mb-2 organization-field">'
									// +'<p class="text-primary m-0 font-weight-semi-bold">Year of establishment of your Organization/Company*</p>'
									+'<label class="m-0">Year of establishment*</label>'
									+'<select id="establishmentYear" name="establishmentYear" class="form-control" required autocomplete="off" tabindex="19">'
										// +'<option></option>';
										for(var i = 1980;i<=new Date().getFullYear();i++){
											html+='<option value="'+i+'">'+i+'</option>';
										}
									html+='</select>'
									+'<p class="m-0" id="establishmentYearError"></p>'
								+'</div>'
								// +'<div class="col-xl-8 col-lg-8 col-md-12 col-sm-12 col-12 organization-field">'
								// 	+'<p class="text-primary m-0 font-weight-semi-bold">In which countries does your Organization/Company operate?*</p>'
								// 	+'<div class="row">'
								// 		+'<div class="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12 mb-2">'
								// 			+'<label class="m-0">In which countries does your Company | Organization | Institution operate?*</label>'
								// 			+'<select id="operatingCountries" name="operatingCountries" class="form-control" required autocomplete="off" multiple="multiple" tabindex="20">';
								// 				$.each(data.details.contries, function(k, v){
								// 					html+='<option value="'+v.key+'" data-ISO-code="'+v.extra+'">'+v.value+'</option>';
								// 				});
								// 			html+='</select>'
								// 			+'<p class="m-0" id="operatingCountriesError"></p>'
								// 		+'</div>'
								// 		+'<div class="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12 mb-2">'
								// 			+'<label class="m-0">Total No. of Countries:*</label>'
								// 			+'<input type="text" id="numberOFoperatingCountries" name="numberOFoperatingCountries" value="'+data.details.workInCountries.length+'" class="form-control" disabled>'
								// 			+'<p class="m-0" id="numberOFoperatingCountriesError"></p>'
								// 		+'</div>'
										
								// 	+'</div>'
								// +'</div>'
								+'<div class="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12 mb-2 organization-field">'
									// +'<p class="text-primary m-0 font-weight-semi-bold">What is the total number of employees?*</p>'
									+'<label class="m-0">Total number of employees*</label>'
									+'<select id="noOfEmployee" name="noOfEmployee" class="form-control" required autocomplete="off" tabindex="21">'
										// +'<option></option>';
										$.each(data.details.employees, function(k, v){
											html+='<option value="'+v.key+'">'+v.value+'</option>';
										});
									html+='</select>'
									+'</select>'
									+'<p class="m-0" id="noOfEmployeeError"></p>'
								+'</div>'
								+'<div class="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12 mb-2 organization-field mt-2">'
									+'<div class="full">'
										+'<label class="">What is the type of your Company | Organization | Institution?*</label>'
										+'<div class="d-flex flex-wrap flex-column flex-md-row gap-5">'
											+'<div class="custom-radio custom-control mr-2">'
												+'<input type="radio" id="NP" name="organizationType" value="N" class="mt-1 custom-control-input"  '+(data.details.organizationType =='N'?'checked':'')+' tabindex="22">'
												+'<label for="NP" class="custom-control-label">Not-For-Profit</label>'
											+'</div>'
											+'<div class="custom-radio custom-control mr-2">'
												+'<input type="radio" id="PM" name="organizationType" value="P" class="mt-1 custom-control-input" '+(data.details.organizationType =='P'?'checked':'')+' tabindex="23">'
												+'<label for="PM" class="custom-control-label">Profit Making</label>'
											+'</div>'
										+'</div>'
										+'<p class="m-0" id="organizationTypeError"></p>'
									+'</div>'
								+'</div>'
								
								+'<div class="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12 mb-2 organization-field mt-2">'
									+'<div class="full">'
										+'<label class="">Is your Company | Organization | Institution registered? If yes,*</label>'
										+'<div class="d-flex flex-wrap flex-column flex-md-row gap-5">'
											// +'<div class="custom-radio custom-control mr-2">'
											// 	+'<input type="radio" id="PvtLTd" name="companyRegistration" value="1" class="mt-1 custom-control-input" '+(data.details.companyRegistrationId =='1'?'checked':'')+' tabindex="24">'
											// 	+'<label for="PvtLTd" class="custom-control-label">Pvt. Ltd</label>'
											// +'</div>'
											+'<div class="custom-radio custom-control mr-2">'
												+'<input type="radio" id="LLC" name="companyRegistration" value="2" class="mt-1 custom-control-input" '+(data.details.companyRegistrationId =='2'?'checked':'')+' tabindex="25">'
												+'<label for="LLC" class="custom-control-label">LLC</label>'
											+'</div>'
											+'<div class="custom-radio custom-control mr-2">'
												+'<input type="radio" id="LLP" name="companyRegistration" value="3" class="mt-1 custom-control-input" '+(data.details.companyRegistrationId =='3'?'checked':'')+' tabindex="26">'
												+'<label for="LLP" class="custom-control-label">LLP</label>'
											+'</div>'
											+'<div class="custom-radio custom-control mr-2">'
												+'<input type="radio" id="corporation" name="companyRegistration" value="5" class="mt-1 custom-control-input" '+(data.details.companyRegistrationId =='5'?'checked':'')+' tabindex="27">'
												+'<label for="corporation" class="custom-control-label">Corporation</label>'
											+'</div>'
											+'<div class="custom-radio custom-control mr-2">'
												+'<input type="radio" id="notRegistered" name="companyRegistration" value="7" class="mt-1 custom-control-input" '+(data.details.companyRegistrationId =='7'?'checked':'')+' tabindex="27">'
												+'<label for="notRegistered" class="custom-control-label">Not Registered</label>'
											+'</div>'
											+'<div class="custom-radio custom-control mr-2">'
												+'<input type="radio" id="otherCompany" name="companyRegistration" value="6" class="mt-1 custom-control-input" '+(data.details.companyRegistrationId =='6'?'checked':'')+' tabindex="28">'
												+'<label for="otherCompany" class="custom-control-label">Other</label>'
											+'</div>'
										+'</div>'
										// +'<div class="d-flex">'
										// 	+'<div class="custom-radio custom-control mr-2">'
										// 		+'<input type="radio" id="LLP" name="companyRegistration" value="3" class="mt-1 custom-control-input" '+(data.details.companyRegistrationId =='3'?'checked':'')+' tabindex="26">'
										// 		+'<label for="LLP" class="custom-control-label">LLP</label>'
										// 	+'</div>'
										// 	+'<div class="custom-radio custom-control mr-2">'
										// 		+'<input type="radio" id="CT" name="companyRegistration" value="4" class="mt-1 custom-control-input" '+(data.details.companyRegistrationId =='4'?'checked':'')+' tabindex="27">'
										// 		+'<label for="CT" class="custom-control-label">Charitable Trust</label>'
										// 	+'</div>'
										// +'</div>'
										+'<p class="m-0" id="companyRegistrationError"></p>'
									+'</div>'
								+'</div>'
								+'<div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 mb-2 additional-information-wrapper">'
									// +'<p class="text-primary mb-0 font-weight-semi-bold">Any additional information you would like to share?</p>'
									+'<label class="m-0">Tell us more about your Company | Organization | Institution*</label>'
									// +'<input type="text" id="additionalInfo" name="additionalInfo" value="'+data.details.additionalInfo+'" class="form-control">'
									+'<textarea id="additionalInfo" name="additionalInfo" oninput="liveWordCount(this);" value="'+data.details.additionalInfo+'" class="form-control">'+data.details.additionalInfo+'</textarea>'
									+'<small id="additionalInfoWordCount" class="d-block mt-1">0 / 25 words minimum</small>'
									+'<p class="m-0" id="additionalInfoError"></p>'
								+'</div>'
								+'<div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 mt-2">'
									+'<div class="full">'
										+'<p class="m-0 font-weight-semi-bold font-size-md organization-field">I, '+data.details.firstName+' '+data.details.lastName+', am filling this form to express my interest in partnering with '+SCHOOL_NAME+'</p>'
									+'</div>'
								+'</div>'
								+'<div class="col-12 text-center">'
										+'<a href="javascript:void(0)" class="btn btn-primary mt-md-3 mt-0" onclick="saveEnrollmentPartnerDetails(\'enrollmentPartnerForm\')">';
										if(data.b2bAssignTo>0){
											html+='Submit';
										}else{
											html+='Submit';
										}
										html+='</a>'
										+'<p id="serverError" class="server-error" style="font-weight:bold"></p>'
								+'</div>'
							+'</div>'
						+'</div>'
					+'</div>'
				+'</div>'
			+'</div>'
		+'</form>'
	+'</div>'
	+'<div class="app-wrapper-footer position-fixed w-100 bg-white" style="bottom: 0; z-index: 20;">'
		+'<div class="app-footer">'
			+'<div class="app-footer__inner">'
				+'<p class="text-center" style="margin: 0">Copyright © '+new Date().getFullYear() +' - '+SCHOOL_NAME+' - All Rights Reserved.</p>'
			+'</div>'
		+'</div>'
	+'</div>';
	return html;
}

function showMessageContent(){
	var html='<div class="server-message">'
				+'<span class="msg" id="msgTheme2"></span>'
			+'</div>';
		return html;
}

async function renderEnrollmentPartnerThankyouPage(MAINTENANCEDOWNTIME,payload){
	schoolSettingsLinks = await getSchoolSettingsLinks(SCHOOL_ID);
	$("body").append(renderEnrollmentPartnerThankyouPageContent(MAINTENANCEDOWNTIME,payload));
}

function renderEnrollmentPartnerThankyouPageContent(MAINTENANCEDOWNTIME,payload){
	var html=
		'<div class="app-main w-100" style="padding-bottom: 60px;">'
			+'<div class="app-main__inner pt-1">'
				+'<div class="full text-center mt-3">'
					+'<a href="'+schoolSettingsLinks.schoolWebsite+'" target="blank">'
						+'<img src="'+schoolSettingsLinks.logoUrl+''+SCRIPT_VERSION+'" width="350px" class="new-logo-2024" />'
					+'</a>'
				+'</div>'
				// +'<div class="full text-center mt-3 mb-2">'
				// 	+'<span class="d-inline-block bg-primary py-2 px-3 font-weight-semi-bold text-white rounded">Interest Form For Partnership 2</span>'
				// +'</div>'
				+'<div class="col-xl-9 col-lg-11 col-md-12 col-sm-12 col-11 mx-auto mt-3" style="z-index:1">'
					+'<div class="full text-center mt-4 border border-primary rounded-15 p-4" style="border-width:2px !important;background:rgba(255, 255, 255, 0.4)">'
						+'<img src="'+PATH_FOLDER_IMAGE2+'enrollment-partner-thankyou.png" class="enrollment-partner-thankyou-img"/>'
						+'<h5 class="my-2 enrollment-partner-thankyou-msg font-16">Thank you so much for expressing your interest in partnering with us. Your interest form has been successfully submitted and is under review.</h5>'
						+'<h5 class="font-16">Our Partnerships Division will get in touch with you shortly.</h5>'
						+'<h5 class="font-16">Thank you for trusting and choosing International Schooling!</h5>'
					+'</div>'
				+'</div>'
			+'</div>'
			+'<div class="text-center mt-2">'
				+'<p>To track the status, click below or reach out to us at <a href="mailto:partnerships@internationalschooling.org">partnerships@internationalschooling.org</a></p>'
				+'<a href="'+BASE_URL+CONTEXT_PATH +SCHOOL_UUID+ "/enrollment-partner-tracker?payload="+payload+'" class="btn btn-primary mb-3">Track Your Status</a>'
			+'</div>'
			// +'<div class="bottom-bg">'
			// 	+'<img src="'+PATH_FOLDER_IMAGE2+'enrollment-partner-thankyou-bottom-bg.png" width="100%" style="position:fixed;left:0;right:0;bottom:0;"/>'
			// +'</div>'
		+'</div>'
		+'<div class="app-wrapper-footer position-fixed w-100 bg-white" style="bottom: 0; z-index: 20;">'
			+'<div class="app-footer">'
				+'<div class="app-footer__inner">'
					+'<p class="text-center" style="margin: 0">Copyright © '+new Date().getFullYear() +' - '+SCHOOL_NAME+' - All Rights Reserved.</p>'
				+'</div>'
			+'</div>'
		+'</div>'
	return html;	
}

async function renderEnrollmentPartnerTracker(UNIQUEUUID, MAINTENANCEDOWNTIME,payload){
	schoolSettingsLinks = await getSchoolSettingsLinks(SCHOOL_ID);
	var data = getEnrollmentPartnerTracker(payload);
	$("body").append(renderEnrollmentPartnerTrackerContent(UNIQUEUUID, MAINTENANCEDOWNTIME,payload, data));
	console.log(data)
	$(document).ready(function(){
		$('[data-toggle="popover"]').popover()
	})
}

function renderEnrollmentPartnerTrackerContent(UNIQUEUUID, MAINTENANCEDOWNTIME,payload, data){
	var html=
		'<div class="app-main w-100 pb-3 enrollment-tracker-wrapper" style="padding-bottom: 60px;">'
			+'<div class="app-main__inner pt-1">'
				+'<div class="full text-center mt-3 position-relative" style="z-index:1">'
					+'<a href="'+schoolSettingsLinks.schoolWebsite+'" target="blank">'
						+'<img src="'+schoolSettingsLinks.logoUrl+''+SCRIPT_VERSION+'" width="350px" class="new-logo-2024" />'
					+'</a>'
				+'</div>'
				// +'<div class="full text-center mt-3 position-relative mb-3">'
				// 	+'<span class="d-inline-block bg-primary py-2 px-3 font-weight-semi-bold text-white rounded">PARTNERSHIP WITH '+SCHOOL_NAME.toUpperCase()+'</span>'
				// +'</div>'
				+'<div class="col-xl-9 col-lg-11 col-md-12 col-sm-12 col-11 mx-auto mt-5" style="z-index:1">'
					+'<div class="vertical-time-icons vertical-timeline vertical-timeline--animate vertical-timeline--one-column timeline-blue-line mx-auto py-0" style="width:fit-content;">'
						+'<div class="vertical-timeline-item vertical-timeline-element mb-4">'
							+'<h6 class="vertical-step-count">Step 1</h6>'
							+'<div>'
								+'<div class="vertical-timeline-element-icon bounce-in">'
									+'<div class="timeline-icon box-shadow-none justify-content-center '+(data.applicationReceived.status=="done"? 'border-success bg-success':((data.applicationReceived.status=="pending")?'border-light bg-light':'border-danger bg-danger'))+'">'
										+'<i class="'+(data.applicationReceived.status=='failed'?'lnr-cross-circle':'lnr-checkmark-circle')+' text-white m-0" style="font-size:30px;"></i>'
									+'</div>'
								+'</div>'
								+'<div class="vertical-timeline-element-content bounce-in card p-2 rounded-10 " style="width:fit-content">'
									+'<h6 class="font-weight-semi-bold m-0 '+(data.applicationReceived.status=="done"? 'text-primary':((data.applicationReceived.status=="pending")?'text-light':'text-danger'))+'">Fill the basic information'
										// +'<div class="mb-2 mr-2 btn-group">'
										// 	+'&nbsp;<i aria-haspopup="true" aria-expanded="false" data-toggle="dropdown"  class="fa fa-exclamation-circle dropdown-toggle text-primary"></i>'
										// 	+'<div tabindex="-1" role="menu" aria-hidden="true" class="px-2 dropdown-menu" x-placement="bottom-start" style="position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(0px, 32px, 0px);">'
										// 		+'<p>nt-size:75%;line-height:0;position:relative;vertical-align:baseline}sup{top:-.5em}sub{bottom:-.25em}img{border:0}svg:not(:root){overflow:hidden}figure{margin:1em 40px}hr{-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;height:0}pre{overflow:auto}code,kbd,pre,samp{font-family:monospace,monospace;font-size:1em}button,input,optgroup,</p>'
										// 	+'</div>'
										// +'</div>'
									+'</h6>'
									+'<p class="mt-1 mb-0 '+(data.applicationReceived.status=="pending"? 'text-light':'')+'">'+data.applicationReceived.processDate+'</p>'
								+'</div>'
							+'</div>'
						+'</div>'
						+'<div class="vertical-timeline-item vertical-timeline-element mb-4">'
							+'<h6 class="vertical-step-count">Step 2</h6>'
							+'<div>'
								+'<div class="vertical-timeline-element-icon bounce-in">'
									+'<div class="timeline-icon box-shadow-none justify-content-center '+(data.applicationUnderReview.status=="done"? 'border-success bg-success':((data.applicationUnderReview.status=="pending")?'border-light bg-light':'border-danger bg-danger'))+'">'
										+'<i class="'+(data.applicationUnderReview.status=='failed'?'lnr-cross-circle':'lnr-checkmark-circle')+' text-white m-0" style="font-size:30px;"></i>'
									+'</div>'
								+'</div>'
								+'<div class="vertical-timeline-element-content bounce-in card p-2 rounded-10 " style="width:fit-content">'
									+'<h6 class="font-weight-semi-bold m-0 '+(data.applicationUnderReview.status=="done"? 'text-primary':((data.applicationUnderReview.status=="pending")?'text-light':'text-danger'))+'">'+data.applicationUnderReview.heading+''
									// +'<h6 class="font-weight-semi-bold m-0 '+(data.applicationUnderReview.status=="done"? 'text-primary':((data.applicationUnderReview.status=="pending")?'text-light':'text-danger'))+'">Fill the interest form'
										// +'<div class="mb-2 mr-2 btn-group">'
										// 	+'&nbsp;<i aria-haspopup="true" aria-expanded="false" data-toggle="dropdown"  class="fa fa-exclamation-circle dropdown-toggle text-primary"></i>'
										// 	+'<div tabindex="-1" role="menu" aria-hidden="true" class="px-2 dropdown-menu" x-placement="bottom-start" style="position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(0px, 32px, 0px);">'
										// 		+'<p>nt-size:75%;line-height:0;position:relative;vertical-align:baseline}sup{top:-.5em}sub{bottom:-.25em}img{border:0}svg:not(:root){overflow:hidden}figure{margin:1em 40px}hr{-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;height:0}pre{overflow:auto}code,kbd,pre,samp{font-family:monospace,monospace;font-size:1em}button,input,optgroup,</p>'
										// 	+'</div>'
										// +'</div>'
									+'</h6>'
									+'<p class="mt-1 mb-0 '+(data.applicationUnderReview.status=="pending"? 'text-light':'')+'">'+data.applicationUnderReview.processDate+'</p>'
								+'</div>'
							+'</div>'
						+'</div>'
						+'<div class="vertical-timeline-item vertical-timeline-element mb-4">'
							+'<h6 class="vertical-step-count">Step 3</h6>'
							+'<div>'
								+'<div class="vertical-timeline-element-icon bounce-in">'
									+'<div class="timeline-icon box-shadow-none justify-content-center '+(data.reviewStatus.status=="done"? 'border-success bg-success':((data.reviewStatus.status=="pending")?'border-light bg-light':'border-danger bg-danger'))+'">'
										+'<i class="'+(data.reviewStatus.status=='failed'?'lnr-cross-circle':'lnr-checkmark-circle')+' text-white m-0" style="font-size:30px;"></i>'
									+'</div>'
								+'</div>'
								+'<div class="vertical-timeline-element-content bounce-in card p-2 rounded-10" style="width:fit-content">'
									+'<h6 class="font-weight-semi-bold m-0 '+(data.reviewStatus.status=="done"? 'text-primary':((data.reviewStatus.status=="pending")?'text-light':'text-danger'))+'">'+data.reviewStatus.heading+''
									+'</h6>'
									if(data.reviewStatus.trackers.length>0){
										html+=
										'<div class="vertical-time-simple vertical-without-time vertical-timeline vertical-timeline--animate vertical-timeline--one-column">';
											$.each(data.reviewStatus.trackers, function (k, tracker) {
												html+=
												'<div class="vertical-timeline-item dot-success dot-with-check vertical-timeline-element">'
													+'<div>'
														+'<span class="vertical-timeline-element-icon bounce-in"></span>'
														+'<div class="vertical-timeline-element-content bounce-in ml-4">'
															+'<h4 class="font-size-md text-uppercase font-weight-semi-bold mb-0">'+tracker.heading+'</h4>'
															+'<p>'+tracker.processDate+'</p>'
														+'</div>'
													+'</div>'
												+'</div>';
											});
										html+='</div>'
									}
								html+='</div>'
							+'</div>'
						+'</div>'
						+'<div class="vertical-timeline-item vertical-timeline-element mb-4">'
							+'<h6 class="vertical-step-count">Step 4</h6>'
							+'<div>'
								+'<div class="vertical-timeline-element-icon bounce-in">'
									+'<div class="timeline-icon box-shadow-none justify-content-center '+(data.contractStatus.status=="done"? 'border-success bg-success':((data.contractStatus.status=="pending")?'border-light bg-light':'border-danger bg-danger'))+'">'
										+'<i class="'+(data.contractStatus.status=='failed'?'lnr-cross-circle':'lnr-checkmark-circle')+' text-white m-0" style="font-size:30px;"></i>'
									+'</div>'
								+'</div>'
								+'<div class="vertical-timeline-element-content bounce-in card p-2 rounded-10" style="width:fit-content">'
									+'<h6 class="font-weight-semi-bold m-0 '+(data.contractStatus.status=="done"? 'text-primary':((data.contractStatus.status=="pending")?'text-light':'text-danger'))+'">'+data.contractStatus.heading+''
									+'</h6>'
									+'<p class="mt-1 mb-0 '+(data.contractStatus.status=="pending"? 'text-light':'')+'">'+data.contractStatus.processDate+'</p>'
								+'</div>'
							+'</div>'
						+'</div>'
						+'<div class="vertical-timeline-item vertical-timeline-element mb-4">'
							+'<h6 class="vertical-step-count">Step 5</h6>'
							+'<div>'
								+'<div class="vertical-timeline-element-icon bounce-in">'
									+'<div class="timeline-icon box-shadow-none justify-content-center '+(data.trainingAndWorking.status=="done"? 'border-success bg-success':((data.trainingAndWorking.status=="pending")?'border-light bg-light':'border-danger bg-danger'))+'">'
										+'<i class="'+(data.trainingAndWorking.status=='failed'?'lnr-cross-circle':'lnr-checkmark-circle')+' text-white m-0" style="font-size:30px;"></i>'
									+'</div>'
								+'</div>'
								+'<div class="vertical-timeline-element-content bounce-in card p-2 rounded-10" style="width:fit-content">'
									+'<h6 class="font-weight-semi-bold m-0 '+(data.trainingAndWorking.status=="done"? 'text-success':((data.trainingAndWorking.status=="pending")?'text-light':'text-danger'))+'">'+data.trainingAndWorking.heading+''
									// +'<h6 class="font-weight-semi-bold m-0 '+(data.trainingAndWorking.status=="done"? 'text-success':((data.trainingAndWorking.status=="pending")?'text-light':'text-danger'))+'">Training & Start Working'
										// +'<div class="mb-2 mr-2 btn-group">'
										// 	+'&nbsp;<i aria-haspopup="true" aria-expanded="false" data-toggle="dropdown"  class="fa fa-exclamation-circle dropdown-toggle text-primary"></i>'
										// 	+'<div tabindex="-1" role="menu" aria-hidden="true" class="px-2 dropdown-menu" x-placement="bottom-start" style="position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(0px, 32px, 0px);">'
										// 		+'<p>nt-size:75%;line-height:0;position:relative;vertical-align:baseline}sup{top:-.5em}sub{bottom:-.25em}img{border:0}svg:not(:root){overflow:hidden}figure{margin:1em 40px}hr{-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;height:0}pre{overflow:auto}code,kbd,pre,samp{font-family:monospace,monospace;font-size:1em}button,input,optgroup,</p>'
										// 	+'</div>'
										// +'</div>'
									+'</h6>'
									+'<p class="mt-1 mb-0 '+(data.trainingAndWorking.status=="pending"? 'text-light':'')+'">'+data.trainingAndWorking.processDate+'</p>'
								+'</div>'
							+'</div>'
						+'</div>'
					+'</div>'
				+'</div>'
			+'</div>'
			+'<div class="bottom-bg">'
				+'<img src="'+PATH_FOLDER_IMAGE2+'enrollment-partner-thankyou-bottom-bg.png" width="100%" style="position:fixed;left:0;right:0;bottom:0;"/>'
			+'</div>'
		+'</div>'
		+'<div class="app-wrapper-footer position-fixed w-100 bg-white" style="bottom: 0; z-index: 20;">'
			+'<div class="app-footer">'
				+'<div class="app-footer__inner">'
					+'<p class="text-center" style="margin: 0">Copyright © '+new Date().getFullYear() +' - '+SCHOOL_NAME+' - All Rights Reserved.</p>'
				+'</div>'
			+'</div>'
		+'</div>'
	return html;
}

