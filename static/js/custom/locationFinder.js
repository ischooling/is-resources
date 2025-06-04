var defaultLocation='{"as":"AS10029 SHYAM SPECTRA PVT LTD","city":"New Delhi","country":"India","countryCode":"IN","isp":"Shyam Spectra Pvt Ltd","lat":28.6331,"lon":77.2207,"org":"Shyam Spectra Pvt Ltd","query":"125.63.99.243","region":"DL","regionName":"National Capital Territory of Delhi","status":"success","timezone":"Asia/Kolkata","zip":"110055"}';

function callLocationDetailsFill(formId, data){
	if(data!=undefined && data !=''){
		if($("#"+formId+" #countryTimezoneId").length){
			$("#countryTimezoneId").val(data.timezone)
		}
		if($("#"+formId+"Alternet #countryTimezoneId").length){
			$("#"+formId+"Alternet #countryTimezoneId").val(data.timezone)
		}
		if($("#"+formId+" #chooseDate").length){
			$("#"+formId+" #chooseDate").datepicker().datepicker("setDate", new Date());
		}
		chooseValueByElement('isdCodeMobileNo', data.country);
		chooseValueByElement('isdCodeWhatsupNo', data.country);
		$("#"+formId+" #location").val(JSON.stringify(data));
		if($("#"+formId+"Alternet #location").length){
			$("#"+formId+"Alternet #location").val($("#"+formId+" #location").val());
		}
	}
}
function callLocationDetails(formId){
	if(LOCATION_SERVICE_BYPASS=='true'){
		callLocationDetailsFill(formId, JSON.parse(DEFAULT_LOCATION))
	}else{
		$.ajax({
			global: false,
			type : "GET",
			url : PRO_IP_API_URL,
			success : function(data) {
				callLocationDetailsFill(formId, data)
			},
			error: function(e){
				if (checkonlineOfflineStatus()) {
					return;
				}
			}
		});
	}
}

function callLocationAndSelectCountry(formId){
	return true;
}
function callLocationAndSelectCountryNewFill(formId, data){
	if($('#'+formId+' #countryTimezoneId').length){
		$('#'+formId+' #countryTimezoneId').select2();
	}
	if(data!=undefined && data !=''){
		if($("#"+formId+" #countryTimezoneId").length){
			$('#countryTimezoneId').val(data.timezone).trigger('change')
		}
		if($("#"+formId+" #chooseDate").length){
			$("#"+formId+" #chooseDate").datepicker().datepicker("setDate", new Date());
		}
		chooseValueByElement('isdCodeMobileNo', data.country);
		chooseValueByElement('isdCodeWhatsupNo', data.country);
		chooseCountryElement('countryId', data.country);
		setTimeout(function(){
			$('#countryId').trigger('change');
		},500)
		$("#"+formId+" #location").val(JSON.stringify(data));
		if($("#"+formId+"Alternet #location").length){
			$("#"+formId+"Alternet #location").val($("#"+formId+" #location").val());
		}
//		if($('#email').is(":disabled") && $('#confirmEmail').is(":disabled")){
//		}else if(SCHOOL_ID ==1 && $("#signupMode").length>0 && ($("#signupMode").val()=='SCHOLARSHIP' || $("#signupMode").val()=='ONE_TO_ONE')){
//		}
		// if(SCHOOL_ID ==1 && moduleId=='STUDENT'){
		// 	checkRequestIsEligibleForEnrollment(formId, moduleId, $("#signupMode").val().trim(), SCHOOL_ID, data.timezone, data.country, $("#email").val());
		// }
	}
}

function callLocationAndSelectCountryNew(formId){
	if(LOCATION_SERVICE_BYPASS=='true'){
		callLocationAndSelectCountryNewFill(formId, JSON.parse(DEFAULT_LOCATION))
	}else{
		$.ajax({
			global: false,
			type : "GET",
			url : PRO_IP_API_URL,
			success : function(data) {
				callLocationAndSelectCountryNewFill(formId, data)
			},
			error: function(e){
				if (checkonlineOfflineStatus()) {
					return;
				}
			}
		});
	}
}

function callLocationAndSelectCountryNew1Fill(formId, type, data,flag,countryCode, countryCodeW){
	createSelect2Element(formId, 'countryTimezoneId');
	var schoolId= $("#schoolId").val();
	if(data!=undefined && data !=''){
		if("admin"==type){
			inputContact = document.querySelector("#userphone");
			itiContcat = window.intlTelInput(inputContact,{
				separateDialCode:true,
			});
			if($("#isdCodeMobileNoIcon").val()==null || $("#isdCodeMobileNoIcon").val()==''){
				itiContcat.setCountry(data.countryCode);
			}else{
				itiContcat.setCountry($("#isdCodeMobileNoIcon").val());
			}
			if($('#isdCodeMobileNoIcon').val()==null || $('#isdCodeMobileNoIcon').val()==''){
				$('#isdCodeMobileNoIcon').val(itiContcat.getSelectedCountryData().iso2);
			}
			if($('#isdCodeMobileNo').val()==null || $('#isdCodeMobileNo').val()==''){
				$('#isdCodeMobileNo').val(itiContcat.getSelectedCountryData().dialCode);
			}
			inputContact.addEventListener('countrychange', function(e) {
				console.log("itiContcat=>", itiContcat.getSelectedCountryData());
				$('#isdCodeMobileNoIcon').val(itiContcat.getSelectedCountryData().iso2);
				$('#isdCodeMobileNo').val(itiContcat.getSelectedCountryData().dialCode);
			});
			
			inputContact1 = document.querySelector("#wtspNumber");
			itiContcat1 = window.intlTelInput(inputContact1,{
				separateDialCode:true,
			});
			if($('#isdCodeWhatsupNoIcon').val()==null || $('#isdCodeWhatsupNoIcon').val()==''){
				itiContcat1.setCountry(data.countryCode);
			}else{
				itiContcat1.setCountry($("#isdCodeWhatsupNoIcon").val());
			}
			if($('#isdCodeWhatsupNoIcon').val()==null || $('#isdCodeWhatsupNoIcon').val()==''){
				$('#isdCodeWhatsupNoIcon').val(itiContcat1.getSelectedCountryData().iso2);
			}
			if($('#isdCodeWhatsupNo').val()==null || $('#isdCodeWhatsupNo').val()==''){
				$('#isdCodeWhatsupNo').val(itiContcat1.getSelectedCountryData().dialCode);
			}
			inputContact1.addEventListener('countrychange', function(e) {
				console.log("itiContcat=>", itiContcat1.getSelectedCountryData());
				$('#isdCodeWhatsupNoIcon').val(itiContcat1.getSelectedCountryData().iso2);
				$('#isdCodeWhatsupNo').val(itiContcat1.getSelectedCountryData().dialCode);
			});
			$('#newDateslected').val($('#newDateslected option:first-child').val()).trigger('change');
		}else if("evaluation"==type){
			if(schoolId!=undefined && schoolId==1){
				if(flag){
					inputContact = document.querySelector("#studentContactNo");
					itiContcat = window.intlTelInput(inputContact,{
						separateDialCode:true,
					});
					if($("#isdCodeStudentIcon").val()==null || $("#isdCodeStudentIcon").val()==''){
						itiContcat.setCountry(data.countryCode);
					}else{
						itiContcat.setCountry($("#isdCodeStudentIcon").val());
					}
					if($('#isdCodeStudentIcon').val()==null || $('#isdCodeStudentIcon').val()==''){
						$('#isdCodeStudentIcon').val(itiContcat.getSelectedCountryData().iso2);
					}
					if($('#isdCodeStudent').val()==null || $('#isdCodeStudent').val()==''){
						$('#isdCodeStudent').val(itiContcat.getSelectedCountryData().dialCode);
					}
					inputContact.addEventListener('countrychange', function(e) {
						console.log("itiContcat=>", itiContcat.getSelectedCountryData());
						$('#isdCodeStudentIcon').val(itiContcat.getSelectedCountryData().iso2);
						$('#isdCodeStudent').val(itiContcat.getSelectedCountryData().dialCode);
					});
		
					inputContact2 = document.querySelector("#wtspNumber");
					itiContcat2 = window.intlTelInput(inputContact2,{
						separateDialCode:true,
					});
					
					if($('#isdCodeWtspIcon').val()==null || $('#isdCodeWtspIcon').val()==''){
						itiContcat2.setCountry(data.countryCode);
					}else{
						itiContcat2.setCountry($("#isdCodeWtspIcon").val());
					}
					if($('#isdCodeWtspIcon').val()==null || $('#isdCodeWtspIcon').val()==''){
						$('#isdCodeWtspIcon').val(itiContcat2.getSelectedCountryData().iso2);
					}
					if($('#isdCodeWtsp').val()==null || $('#isdCodeWtsp').val()==''){
						$('#isdCodeWtsp').val(itiContcat2.getSelectedCountryData().dialCode);
					}
					inputContact2.addEventListener('countrychange', function(e) {
						console.log("itiContcat=>", itiContcat2.getSelectedCountryData());
						$('#isdCodeWtspIcon').val(itiContcat2.getSelectedCountryData().iso2);
						$('#isdCodeWtsp').val(itiContcat2.getSelectedCountryData().dialCode);
					});
				}
			}else{
				if(flag){
					inputContact = document.querySelector("#studentContactNo");
					itiContcat = window.intlTelInput(inputContact,{
						separateDialCode:true,
						//disabled: true
					});
					if($("#autoDialCode").val()!=null && $("#autoDialCode").val()!=''){
						itiContcat.setCountry($("#autoDialCode").val());
					}else if($("#isdCodeStudentIcon").val()==null || $("#isdCodeStudentIcon").val()==''){
						itiContcat.setCountry(data.countryCode);
					}else{
						itiContcat.setCountry($("#isdCodeStudentIcon").val());
					}
					if($('#isdCodeStudentIcon').val()==null || $('#isdCodeStudentIcon').val()==''){
						$('#isdCodeStudentIcon').val(itiContcat.getSelectedCountryData().iso2);
					}
					if($('#isdCodeStudent').val()==null || $('#isdCodeStudent').val()==''){
						$('#isdCodeStudent').val(itiContcat.getSelectedCountryData().dialCode);
					}
					inputContact.addEventListener('countrychange', function(e) {
						console.log("itiContcat=>", itiContcat.getSelectedCountryData());
						$('#isdCodeStudentIcon').val(itiContcat.getSelectedCountryData().iso2);
						$('#isdCodeStudent').val(itiContcat.getSelectedCountryData().dialCode);
					});
		
					inputContact2 = document.querySelector("#wtspNumber");
					itiContcat2 = window.intlTelInput(inputContact2,{
						separateDialCode:true,
						//disabled: true
					});
					
					if($("#autoDialCode").val()!=null && $("#autoDialCode").val()!=''){
						itiContcat2.setCountry($("#autoDialCode").val());
					}else if($('#isdCodeWtspIcon').val()==null || $('#isdCodeWtspIcon').val()==''){
						itiContcat2.setCountry(data.countryCode);
					}else{
						itiContcat2.setCountry($("#isdCodeWtspIcon").val());
					}
					if($('#isdCodeWtspIcon').val()==null || $('#isdCodeWtspIcon').val()==''){
						$('#isdCodeWtspIcon').val(itiContcat2.getSelectedCountryData().iso2);
					}
					if($('#isdCodeWtsp').val()==null || $('#isdCodeWtsp').val()==''){
						$('#isdCodeWtsp').val(itiContcat2.getSelectedCountryData().dialCode);
					}
					inputContact2.addEventListener('countrychange', function(e) {
						$('#isdCodeWtspIcon').val(itiContcat2.getSelectedCountryData().iso2);
						$('#isdCodeWtsp').val(itiContcat2.getSelectedCountryData().dialCode);
					});
				}
			}
		}else{
			if(flag){
				chooseValueByElement('isdCodeMobileNo', data.country);
				chooseValueByElement('isdCodeWhatsupNo', data.country);
			}
		}
		if(flag){
			if($('#countryId').length>0){
				//chooseCountryElement('countryId', data.country);
				if($("#countryId").length){
					if($('#countryId').val()==null || $('#countryId').val()==''){
						$('#countryId').val(data.country).trigger('change')
					}
				}
			}
		}
		if(flag){
			if($('#stateId').length>0){
				//chooseCountryElement('stateId', data.country);
				$('#stateId').val(data.country).trigger('change')
			}
		}
		if("evaluation"==type && schoolId!=undefined && schoolId!=1){
			if($("#autoCountryTimeZoneId").val()!=null && $("#autoCountryTimeZoneId").val()!=''){
				$('#countryTimezoneId').val($("#autoCountryTimeZoneId").val()).trigger('change')
			}
		}else{
			$('#countryTimezoneId').val(data.timezone).trigger('change')
		}
		
		if($("#"+formId+" #chooseDate").length){
			$("#"+formId+" #chooseDate").datepicker().datepicker("setDate", new Date());
			freeslotsList(formId,true,type)
		}
		$("#"+formId+" #location").val(JSON.stringify(data));
		if($("#"+formId+"Alternet #location").length){
			$("#"+formId+"Alternet #location").val($("#"+formId+" #location").val());
		}
	}else{
		defaultIsdCodePopulation(formId, type, countryCode, countryCodeW);
	}
}
function defaultIsdCodePopulation(formId, type, countryCode, countryCodeW){
	if("admin"==type){
	}else if("evaluation"==type){
		inputContact = document.querySelector("#studentContactNo");
		itiContcat = window.intlTelInput(inputContact);
		itiContcat.setCountry(countryCode);
		inputContact.addEventListener('countrychange', function(e) {
			$('#isdCodeStudentIcon').val(itiContcat.getSelectedCountryData().iso2);
			$('#isdCodeStudent').val(itiContcat.getSelectedCountryData().dialCode);
		});
		
		inputContact2 = document.querySelector("#wtspNumber");
		itiContcat2 = window.intlTelInput(inputContact2);
		itiContcat2.setCountry(countryCodeW);
		inputContact2.addEventListener('countrychange', function(e) {
			$('#isdCodeWtspIcon').val(itiContcat2.getSelectedCountryData().iso2);
			$('#isdCodeWtsp').val(itiContcat2.getSelectedCountryData().dialCode);
		});
		if("evaluation"==type && schoolId!=undefined && schoolId!=1){
			if($("#autoCountryTimeZoneId").val()!=null && $("#autoCountryTimeZoneId").val()!=''){
				$('#countryTimezoneId').val($("#autoCountryTimeZoneId").val()).trigger('change')
			}
		}
	}else{
		
	}
}
function callLocationAndSelectCountryNew1(formId, type, flag,countryCode, countryCodeW){
	if(countryCode==''){
		countryCode='US';
		if($("#" + formId + " #isdCodeStudent").length>0){
			$("#" + formId + " #isdCodeStudent").val(1);
			$("#" + formId + " #isdCodeStudentIcon").val(countryCode)
		}
	}
	if(countryCodeW==''){
		countryCodeW='US';
		if($("#" + formId + " #isdCodeWtsp").length>0){
			$("#" + formId + " #isdCodeWtsp").val(1);
			$("#" + formId + " #isdCodeWtspIcon").val(countryCodeW)	
		}
	}
	if(LOCATION_SERVICE_BYPASS=='true'){
		callLocationAndSelectCountryNew1Fill(formId, type, JSON.parse(DEFAULT_LOCATION),flag,countryCode, countryCodeW)
	}else{
		$.ajax({
			global: false,
			type : "GET",
			url : PRO_IP_API_URL,
			success : function(data) {
				callLocationAndSelectCountryNew1Fill(formId, type, data,flag,countryCode, countryCodeW)
			},
			error: function(e){
				if (checkonlineOfflineStatus()) {
					return;
				}	
			}
		});
	}
}

// function callLocationAndSelectTimeZoneFillSession(formId, data){
// 	console.log('callLocationAndSelectTimeZoneFillSession data :'+JSON.stringify(data))
// 	if($("#"+formId+" #countryTimezoneId").length){
// 		$("#"+formId+" #countryTimezoneId").select2({});
// 	}
// 	if(data!=undefined && data !=''){
// 		$("#"+formId+" #countryTimezoneId").val(data.timezone).trigger('change')
// 		$("#"+formId+" #location").val(JSON.stringify(data));
// 	}
// }
// function callLocationAndSelectTimeZoneSession(formId){
// 	if(LOCATION_SERVICE_BYPASS=='true'){
// 		callLocationAndSelectTimeZoneFillSession(formId, JSON.parse(DEFAULT_LOCATION))
// 	}else{
// 		$.ajax({
// 			global: false,
// 			type : "GET",
// 			url : PRO_IP_API_URL,
// 			success : function(data) {
// 				callLocationAndSelectTimeZoneFillSession(formId, data)
// 			}
// 		});
// 	}
// }

function callLocationAndSelectTimeZoneFill(formId, data){
	if($("#"+formId+" #countryTimezoneId").length){
		$("#"+formId+" #countryTimezoneId").select2({
			theme: "bootstrap4",
			dropdownParent: "#"+formId,
		});
	}
	if(data!=undefined && data !=''){
		console.log('callLocationAndSelectTimeZoneFill data :'+JSON.stringify(data))
		$("#"+formId+" #countryTimezoneId").val(data.timezone).trigger('change')
		$("#"+formId+" #location").val(JSON.stringify(data));
	}
}

function callLocationAndSelectTimeZone(formId){
	if(LOCATION_SERVICE_BYPASS=='true'){
		callLocationAndSelectTimeZoneFill(formId, JSON.parse(DEFAULT_LOCATION))
	}else{
		$.ajax({
			global: false,
			type : "GET",
			url : PRO_IP_API_URL,
			success : function(data) {
				callLocationAndSelectTimeZoneFill(formId, data)
			},
			error: function(e){
				if (checkonlineOfflineStatus()) {
					return;
				}
			}
		});
	}
}

function callLocationAndSelectCountryStateCity(formId, type, countryId, stateId, cityId){
	if(LOCATION_SERVICE_BYPASS=='true'){
		callLocationAndSelectCountryStateCityFill(formId, type, JSON.parse(DEFAULT_LOCATION), countryId, stateId, cityId)
	}else{
		$.ajax({
			global: false,
			type : "GET",
			url : PRO_IP_API_URL,
			success : function(data) {
				callLocationAndSelectCountryStateCityFill(formId, type, data, countryId, stateId, cityId)
			},
			error: function(e){
				if (checkonlineOfflineStatus()) {
					return;
				}
			}
		});
	}
}

function callLocationAndSelectCountryStateCityFill(formId, type, data, countryId, stateId, cityId){
	if(data!=undefined && data !=''){
		if("evaluation"==type){
			if($('#'+countryId).length){
				autoSelectElementByValue('countryId', data.country);
				//$('#'+countryId).trigger('change');
				callStates(formId, $('#'+countryId).val(),'' );
				
			}
			if($('#'+stateId).length){
				autoSelectElementByValue('stateId', data.country);
			}
		}
	}
}

function autoSelectElementByValue(elementId, value){
	if($('#'+elementId).length){
		$('#'+elementId+' option').map(function () {
			var currentValue = $(this).text();
			if (currentValue === value){
				return this;
			}
		}).attr('selected', 'selected');
	}
}

function callLocationForPayment(){
	if(LOCATION_SERVICE_BYPASS=='true'){
		callLocationForPaymentFill(JSON.parse(DEFAULT_LOCATION))
	}else{
		$.ajax({
			global: false,
			type : "GET",
			url : PRO_IP_API_URL,
			success : function(data) {
				callLocationForPaymentFill(data)
			},
			error: function(e){
				if (checkonlineOfflineStatus()) {
					return;
				}
			}
		});
	}
}
function callLocationForPaymentFill(data){
	if(data!=undefined && data !=''){
		$("#location").val(JSON.stringify(data));
	}
}