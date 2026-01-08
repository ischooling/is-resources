var B2BSubPartnerPhoneNo;
var itiB2BSubPartnerPhoneNo;
function B2BSubPartnerPageEvent(formId){
	B2BSubPartnerPhoneNo= document.querySelector("#"+formId+" #B2BSubPartnerPhoneNo");
	itiB2BSubPartnerPhoneNo = window.intlTelInput(B2BSubPartnerPhoneNo, {
		//separateDialCode: true,
	});
	itiB2BSubPartnerPhoneNo.setCountry($('#'+formId+' #B2BSubPartnerPCountryCode').val());
	B2BSubPartnerPhoneNo.addEventListener('countrychange', function(e) {
		$('#'+formId+' #B2BSubPartnerPCountryCode').val(itiB2BSubPartnerPhoneNo.getSelectedCountryData().iso2);
		$('#'+formId+' #B2BSubPartnerIsdCode').val(itiB2BSubPartnerPhoneNo.getSelectedCountryData().dialCode);
	});
	
	initializeCountryStateCity(formId, "", "", "");
  	getAllTimeZoneForPartner("countryTimezoneId");
	if($("#"+formId+" #B2BSubPartnerType").hasClass("select2-hidden-accessible")){
        $("#B2BSubPartnerType").select2("destroy");
    }
	$("#"+formId+" #B2BSubPartnerType").select2({
		theme:"bootstrap4"
	});
	if($("#"+formId+" #countryTimezoneId").hasClass("select2-hidden-accessible")){
        $("#countryTimezoneId").select2("destroy");
    }
	$("#"+formId+" #countryTimezoneId").select2({
		theme:"bootstrap4"
	});
	if($("#"+formId+" #B2BSubPartnerCommission").hasClass("select2-hidden-accessible")){
        $("#B2BSubPartnerCommission").select2("destroy");
    }
	$("#"+formId+" #B2BSubPartnerCommission").select2({
		theme:"bootstrap4"
	});
	// $("#"+formId+" #commissionStandardId").select2({
	// 	theme:"bootstrap4"
	// });
	// $("#"+formId+" #commissionlearningProgram").select2({
	// 	theme:"bootstrap4"
	// });
	
}


function addB2BSubPartner(formId){
	$("#addB2BSubPartnerModal").modal("show");
	$("#"+formId)[0].reset();
	$("#"+formId+" #countryId").val("").trigger("change");
	$("#"+formId+" #B2BSubPartnerType").val("").trigger("change");
	$("#"+formId+" #countryTimezoneId").val("").trigger("change");
	$("#"+formId+" #saveSubPartnerBtn").text("Create").attr("alreadySubPartnerCreadted", "N");
	$("#"+formId).find("#B2BSubPartnerName, #B2BSubPartnerEmail, #B2BSubPartnerPhoneNo, #countryId, #stateId, #cityId").prop("disabled", false);
}

function validateRequestForAddSubPartnerSave(formId){
	if ($("#"+formId+" #B2BSubPartnerName").val()==null || $("#"+formId+" #B2BSubPartnerName").val() == undefined || $("#"+formId+" #B2BSubPartnerName").val()=='') {
		showMessageTheme2(0, "First name is required",'',true);
		return false;
	}
	if ($("#"+formId+" #B2BSubPartnerLName").val()==null || $("#"+formId+" #B2BSubPartnerLName").val() == undefined || $("#"+formId+" #B2BSubPartnerLName").val()=='') {
		showMessageTheme2(0, "Last name is required",'',true);
		return false;
	}
	if ($("#"+formId+" #B2BSubPartnerEmail").val()==null || $("#"+formId+" #B2BSubPartnerEmail").val() == undefined || $("#"+formId+" #B2BSubPartnerEmail").val()=='') {
		showMessageTheme2(0, "Email is required",'',true);
		return false;
	}
	if ($("#"+formId+" #B2BSubPartnerPhoneNo").val()==null || $("#"+formId+" #B2BSubPartnerPhoneNo").val() == undefined || $("#"+formId+" #B2BSubPartnerPhoneNo").val()=='') {
		showMessageTheme2(0, "Mobile Number is required",'',true);
		return false;
	}
	if ($("#"+formId+" #countryId").val()==null || $("#"+formId+" #countryId").val() == undefined || $("#"+formId+" #countryId").val()=='') {
		showMessageTheme2(0, "Country is required",'',true);
		return false;
	}
	if ($("#"+formId+" #stateId").val()==null || $("#"+formId+" #stateId").val() == undefined || $("#"+formId+" #stateId").val()=='') {
		showMessageTheme2(0, "State is required",'',true);
		return false;
	}
	if ($("#"+formId+" #cityId").val()==null || $("#"+formId+" #cityId").val() == undefined || $("#"+formId+" #cityId").val()=='') {
		showMessageTheme2(0, "City is required",'',true);
		return false;
	}
	if ($("#"+formId+" #B2BSubPartnerType").val()==null || $("#"+formId+" #B2BSubPartnerType").val() == undefined || $("#"+formId+" #B2BSubPartnerType").val()=='') {
		showMessageTheme2(0, "Location Partner Type is required",'',true);
		return false;
	}
	if ($("#"+formId+" #countryTimezoneId").val()==null || $("#"+formId+" #countryTimezoneId").val() == undefined || $("#"+formId+" #countryTimezoneId").val()=='') {
		showMessageTheme2(0, "Timezone is required",'',true);
		return false;
	}
	return true;
}

function getRequestForAddSubPartnerSave(formId) {
    var authentication = {};
	var leadModifyDTO = {};
	var leadModifyDetailDTO = {};
	var leadDemoInfo = {};
	var leadStudentDetailDTO = {};
	var leadCallFollowupDTO = {};
	var leadCommonDTO = {};
    authentication['hash'] = getHash();
	authentication['schoolId'] = SCHOOL_ID;
	authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userId'] = USER_ID;
	authentication['userType'] = 'COMMON';
    
    
    leadModifyDTO['isUserWise'] = false;
    leadModifyDTO['isLeadSearch'] = false;
    leadModifyDTO['leadType'] = "B2B";
    leadModifyDTO['leadSource'] = $("#"+formId+" #leadSource").val();
    leadModifyDTO['leadId'] = "";
    leadModifyDTO['controlType'] = "add";
    leadModifyDTO['assignTo'] = $("#"+formId+" #leadAssignTo").val();
    leadModifyDTO['leadStatus'] = $("#"+formId+" #leadStatus").val();
    leadModifyDTO['parentleadId'] = "";
    leadModifyDTO['leadDataFrom'] = "leadlistPopup";
    leadModifyDetailDTO['remarks'] = "";
    leadModifyDetailDTO['mergeLeadsId'] = "";
    leadStudentDetailDTO['email'] = $("#"+formId+" #B2BSubPartnerEmail").val();
    leadStudentDetailDTO['isdCountryCode'] = $("#"+formId+" #B2BSubPartnerPCountryCode").val();
    leadStudentDetailDTO['isdCode'] = $("#"+formId+" #B2BSubPartnerIsdCode").val();
    leadStudentDetailDTO['phoneNo'] = $("#"+formId+" #B2BSubPartnerPhoneNo").val();
    leadStudentDetailDTO['emailAlternet'] = "";
    leadStudentDetailDTO['isdCountryCodeAlter'] = "";
    leadStudentDetailDTO['isdCodeAlter'] = "";
    leadStudentDetailDTO['phoneNoAlter'] = "";
    leadStudentDetailDTO['stdFname'] = $("#"+formId+" #B2BSubPartnerName").val();
    leadStudentDetailDTO['stdMname'] = $("#"+formId+" #B2BSubPartnerMName").val();
    leadStudentDetailDTO['stdLname'] = $("#"+formId+" #B2BSubPartnerLName").val();
    leadStudentDetailDTO['country'] = $("#"+formId+" #countryId").val();
    leadStudentDetailDTO['state'] = $("#"+formId+" #stateId").val();
    leadStudentDetailDTO['city'] = $("#"+formId+" #cityId").val();
    leadStudentDetailDTO['relationType'] = "";
	leadCallFollowupDTO['leadFollowStatus'] = $("#"+formId+" #leadStatus").val();
	leadCallFollowupDTO['leadFollowStatus'] = $("#"+formId+" #leadStatus").val();


	leadCommonDTO['leadModifyDTO'] = leadModifyDTO;
    leadCommonDTO['leadModifyDetailDTO'] = leadModifyDetailDTO;
    leadCommonDTO['leadDemoInfo'] = leadDemoInfo;
    leadCommonDTO['leadStudentDetailDTO'] = leadStudentDetailDTO;
    leadCommonDTO['leadCallFollowupDTO'] = leadCallFollowupDTO;
    
    var payload = {
        "authentication": authentication,
        "leadCommonDTO": leadCommonDTO,
        "uploadDocuments": []
    };
    console.log(JSON.stringify(payload, null, 2));
    return payload;
}

function saveB2BSubPartnerDetails(formId) {
	if($("#"+formId+" #saveSubPartnerBtn").attr("alreadySubPartnerCreadted") == "Y"){
		B2BsavePatnerWithReferralCode(formId);
		return false;
	}
	hideMessageTheme2('');
	if(!validateRequestForAddSubPartnerSave(formId)){
		return false;
	}
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLFor('leads','save-leads-form-data'),
		data : JSON.stringify(getRequestForAddSubPartnerSave(formId)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : async function(data) {
			if (data['status'] == '0' || data['status'] == 'FAILED' || data['status'] == 'EXCEPTION' || data['status'] == 'SESSIONOUT' ) {
				showMessageTheme2(0, data['message'],'',true);
			} 
			else{
				showMessageTheme2(1, data['message'],'',true);
				$("#leadId").val(data.extra1);
				$("#rawLeadId").val(data.extra);
				B2BsavePatnerWithReferralCode(formId);
			}
			return false;
		}
 	});
}


function getRequestForAddSubPartnerWithReferral(formId){
	var data = {};
	data['userId']=USER_ID;
	data['schoolId']=SCHOOL_ID;
	data['leadId']=$("#"+formId+" #leadId").val();
	data['rawLeadId']=$("#"+formId+" #rawLeadId").val();
	data['fname']=$("#"+formId+" #B2BSubPartnerName").val();
	data['mname']=$("#"+formId+" #B2BSubPartnerMName").val();
	data['lname']=$("#"+formId+" #B2BSubPartnerLName").val();
	if($("#"+formId+" #B2BSubPartnerName").val()!='' && $("#"+formId+" #B2BSubPartnerMName").val()!='' && $("#"+formId+" #B2BSubPartnerLName").val()!=''){
		data['userFullName']=$("#"+formId+" #B2BSubPartnerName").val()+' '+$("#"+formId+" #B2BSubPartnerMName").val()+' '+$("#"+formId+" #B2BSubPartnerLName").val();
	}else if($("#"+formId+" #B2BSubPartnerName").val()!='' && $("#"+formId+" #B2BSubPartnerLName").val()!=''){
		data['userFullName']=$("#"+formId+" #B2BSubPartnerName").val()+' '+$("#"+formId+" #B2BSubPartnerLName").val();
	}else{
		data['userFullName']=$("#"+formId+" #B2BSubPartnerName").val();
	}
	data['email']=$("#"+formId+" #B2BSubPartnerEmail").val();
	data['partnerType']=$("#"+formId+" #B2BSubPartnerType").val();
	data['countryId']=$("#"+formId+" #countryId").val();
	data['stateId']=$("#"+formId+" #stateId").val();
	data['cityId']=$("#"+formId+" #cityId").val();
	// data['originalPartnerType']=$("#"+formId+" #originalPartnerType").val();
	data['originalTimezoneId']=$("#"+formId+" #countryTimezoneId option:selected").attr("custom_timezone_id");
	data['originalTimezone']=$("#"+formId+" #countryTimezoneId").val();
	data['commissionPayout']="SWP";
	data['defaultSetting']=$("#"+formId+" #B2BSubPartnerCommission").val();
	data['whiteLabel']="NWL";
	data['enrollingStudent']="FIS";
	data['isSubPartner']=true;
	return data;
}



function B2BsavePatnerWithReferralCode(formId) {
	hideMessageTheme2('');
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLForHTML('dashboard', 'save-referralcode-partner'),
		data : JSON.stringify(getRequestForAddSubPartnerWithReferral(formId)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : async function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessageTheme2(0, data['message']);
			} else {
				console.log(data)
				showMessageTheme2(1, data['message']);
				$("#"+formId)[0].reset();
				if($("#"+formId+" #saveSubPartnerBtn").attr("alreadySubPartnerCreadted") != "Y"){
					$("#"+formId+" #countryId").val("").trigger("change");
					$("#"+formId+" #B2BSubPartnerType").val("").trigger("change");
					$("#"+formId+" #countryTimezoneId").val("").trigger("change");
				}
				$("#addB2BSubPartnerModal").modal("hide");
				// updateTabsVisibility();
				// if($("#originalPartnerType").val() != 'WLP'){
				// 	await saveLearningPrograms();
				// }
				var payload = {};
				payload['userId'] = USER_ID;
    			responseData = await getDashboardDataBasedUrlAndPayloadWithParentUrl(true, true, 'get-all-subpartner-by-user-id',payload,'');
				$("#B2BSubPartnerListTable #B2BSubPartnerListTableBody").html(getB2BSubPartnerListTableBody(responseData))
			}
		}
	});
}

function getRequestForSubPartnerByLeadId(formId, leadId) {
    return {
        authentication: {
			hash: getHash(),
			schoolId: SCHOOL_ID,
			schoolUUID: SCHOOL_UUID,
			userId: USER_ID,
			userType: 'COMMON'
		},
        leadCommonDTO: {
            leadModifyDTO: {
                isUserWise: false,
                isLeadSearch: true,
                leadId: leadId,
                clickFrom: 'ByIdSearch',
                schoolId: SCHOOL_ID,
                leadType: 'B2B',
                controlType: 'edit',
                leadFrom: 'list'
            }
        }
    };
}

function getSubPartnerLeadById(formId, leadId, modalId) {
 	$.ajax({
		 type : "POST",
		 contentType : APPLICATION_JSON_VALUE,
		 url : getURLForHTML('/api/v1/leads', 'get-lead-data-byid'),
		 data : JSON.stringify(getRequestForSubPartnerByLeadId(formId, leadId)),
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
					   	$("#"+formId+" #leadId").val(leadDemo.leadModifyDTO.leadId);
						$("#"+formId+" #rawLeadId").val(leadDemo.leadDemoInfo.rawLeadId);
						$("#"+formId+" #B2BSubPartnerEmail").val(leadDemo.leadStudentDetailDTO.email);
						$("#"+formId+" #B2BSubPartnerName").val(leadDemo.leadStudentDetailDTO.stdFname);
						$("#"+formId+" #B2BSubPartnerMName").val(leadDemo.leadStudentDetailDTO.stdMname);
						$("#"+formId+" #B2BSubPartnerLName").val(leadDemo.leadStudentDetailDTO.stdLname);
						$("#"+formId+" #B2BSubPartnerPhoneNo").val(leadDemo.leadStudentDetailDTO.phoneNo);
						if(leadDemo.leadStudentDetailDTO.isdCountryCode==null || leadDemo.leadStudentDetailDTO.isdCountryCode==''){
							$('#'+formId+' #B2BSubPartnerPCountryCode').val('us');
							$('#'+formId+' #B2BSubPartnerIsdCode').val('1');
						}else{
							$("#"+formId+" #B2BSubPartnerPCountryCode").val(leadDemo.leadStudentDetailDTO.isdCountryCode);
							$("#"+formId+" #B2BSubPartnerIsdCode").val(leadDemo.leadStudentDetailDTO.isdCode);
						}
						var B2BSubPartnerPhoneNo = document.querySelector("#"+formId+" #B2BSubPartnerPhoneNo");
						if (B2BSubPartnerPhoneNo && B2BSubPartnerPhoneNo.parentNode) {
							if (itiB2BSubPartnerPhoneNo && typeof itiB2BSubPartnerPhoneNo.destroy === 'function') {
								try {
									itiB2BSubPartnerPhoneNo.destroy();
								} catch (e) {
									console.warn("Ignore destroy error:", e);
								}
							}
						}
						itiB2BSubPartnerPhoneNo = window.intlTelInput(B2BSubPartnerPhoneNo, {
							//separateDialCode: true,
						});
						itiB2BSubPartnerPhoneNo.setCountry($('#'+formId+' #B2BSubPartnerPCountryCode').val());
						B2BSubPartnerPhoneNo.addEventListener('countrychange', function(e) {
							$('#'+formId+' #B2BSubPartnerPCountryCode').val(itiB2BSubPartnerPhoneNo.getSelectedCountryData().iso2);
							$('#'+formId+' #B2BSubPartnerIsdCode').val(itiB2BSubPartnerPhoneNo.getSelectedCountryData().dialCode);
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
							$("#"+formId+" #B2BSubPartnerType").val(leadDemo.leadModifyDTO.partnerTypeId).trigger("change");
							$("#"+formId+" #countryTimezoneId").val(leadDemo.leadModifyDTO.originalPartnerTimzone).trigger('change');
						}, 1000);
						$("#"+formId+" #saveSubPartnerBtn").text("Update").attr("alreadySubPartnerCreadted", "Y");
						$("#" + formId).find("#B2BSubPartnerName, #B2BSubPartnerEmail, #B2BSubPartnerPhoneNo, #countryId, #stateId, #cityId").prop("disabled", true);
					}
				}
				$("#"+modalId).modal("show");
			 }
		 }
	});
}