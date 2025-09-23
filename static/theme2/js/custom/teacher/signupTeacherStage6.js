var bankUploadDocsObj = [];

function signupTeacherStage6OnLoadEvent(){
	$('#accountCurrency').html(getCurrenciesOption());
	$('#accountCategory').html(getAccountCategoriesOption());
	callCountriesOption("teacherSignupStage6", '', "accountHolderCountryId", '');
	callStates("teacherSignupStage6", '', "accountHolderCountryId", "accountHolderStateId", "accountHolderCityId");
	$("#teacherSignupStage6 #accountHolderStateId").val($("#accountHolderStateId").val()).trigger('change');
	callCities("teacherSignupStage6", $("#accountHolderStateId").val(), "accountHolderStateId", "accountHolderCityId");

	callCountriesOption("teacherSignupStage6", '', "bankCountryId", '');
	callStates("teacherSignupStage6", '', "bankCountryId", "bankStateId", "bankCityId");
	$("#teacherSignupStage6 #bankStateId").val($("#bankStateId").val()).trigger('change');
	callCities("teacherSignupStage6", $("#bankStateId").val(), "bankStateId", "bankCityId");

	$("#accountHolderCountryId").unbind().bind("change", function () {
		$('#accountHolderCountryId').valid();
		callStates('teacherSignupStage6', this.value, 'accountHolderCountryId','accountHolderStateId','accountHolderCityId');
		$("#accountHolderCityId").html("<option value=''>Select City*</option>");
		validEndInvalidField(null, "accountHolderCityId");
		validEndInvalidField(null, "accountHolderStateId");
	});
	$("#accountHolderStateId").unbind().bind("change", function () {
		$('#accountHolderStateId').valid();
		callCities('teacherSignupStage6', this.value, 'accountHolderStateId','accountHolderCityId');
		validEndInvalidField(null, "accountHolderCityId");
	});
	$("#accountHolderCityId").unbind().bind("change", function () {
		$('#accountHolderCityId').valid();
	});

	$("#bankCountryId").unbind().bind("change", function () {
		$('#bankCountryId').valid();
		callStates('teacherSignupStage6', this.value, 'bankCountryId','bankStateId','bankCityId');
		$("#bankCityId").html("<option value=''>Select City*</option>");
		validEndInvalidField(null, "bankStateId");
		validEndInvalidField(null, "bankCityId");
	});
	$("#bankStateId").unbind().bind("change", function () {
		$('#bankStateId').valid();
		callCities('teacherSignupStage6', this.value, 'bankStateId','bankCityId');
		validEndInvalidField(null, "bankCityId");
	});
	$("#bankCityId").unbind().bind("change", function () {
		$('#bankCityId').valid();
	});

	$("#accountCurrency").change(function() {
		if ($("#accountCurrency").val().trim()=="") {
			validEndInvalidField(null, "accountCurrency");
			return false
		}else{
			validEndInvalidField(true, "accountCurrency");
		}
	});
	$("#accountNumber").blur(function() {
		if ($("#accountNumber").val().trim()=="") {
			validEndInvalidField(null, "accountNumber");
			return false
		}else{
			validEndInvalidField(true, "accountNumber");
		}
	});
	$("#iban").blur(function() {
		if ($("#iban").val().trim()=="") {
			validEndInvalidField(null, "iban");
			return false
		}else{
			validEndInvalidField(true, "iban");
		}
	});
	$("#accountCategory").change(function() {
		if ($("#accountCategory").val().trim()=="") {
			validEndInvalidField(null, "accountCategory");
			return false
		}else{
			validEndInvalidField(true, "accountCategory");
		}
	});
	$("#accountHolderFirstName").blur(function() {
		if ($("#accountHolderFirstName").val().trim()=="") {
			validEndInvalidField(null, "accountHolderFirstName");
			return false
		}else{
			validEndInvalidField(true, "accountHolderFirstName");
		}
	});
	$("#accountHolderMiddleName").blur(function() {
		if ($("#accountHolderMiddleName").val().trim()=="") {
			validEndInvalidField(null, "accountHolderMiddleName");
			return false
		}else{
			validEndInvalidField(true, "accountHolderMiddleName");
		}
	});
	$("#accountHolderLastName").blur(function() {
		if ($("#accountHolderLastName").val().trim()=="") {
			validEndInvalidField(null, "accountHolderLastName");
			return false
		}else{
			validEndInvalidField(true, "accountHolderLastName");
		}
	});
	$("#accountHolderAddress").blur(function() {
		if ($("#accountHolderAddress").val().trim()=="") {
			validEndInvalidField(null, "accountHolderAddress");
			return false
		}else{
			validEndInvalidField(true, "accountHolderAddress");
		}
	});
	$("#accountHolderCountryId").change(function() {
		if ($("#accountHolderCountryId").val().trim()=="") {
			validEndInvalidField(null, "accountHolderCountryId");
			return false
		}else{
			validEndInvalidField(true, "accountHolderCountryId");
		}
	});
	$("#accountHolderStateId").change(function() {
		if ($("#accountHolderStateId").val().trim()=="") {
			validEndInvalidField(null, "accountHolderStateId");
			return false
		}else{
			validEndInvalidField(true, "accountHolderStateId");
		}
	});
	$("#accountHolderCityId").change(function() {
		if ($("#accountHolderCityId").val().trim()=="") {
			validEndInvalidField(null, "accountHolderCityId");
			return false
		}else{
			validEndInvalidField(true, "accountHolderCityId");
		}
	});
	$("#accountHolderPostal").blur(function() {
		if ($("#accountHolderPostal").val().trim()=="") {
			validEndInvalidField(null, "accountHolderPostal");
			return false
		}else{
			validEndInvalidField(true, "accountHolderPostal");
		}
	});
	$("#accountHolderPhone").blur(function() {
		if ($("#accountHolderPhone").val().trim()=="") {
			validEndInvalidField(null, "accountHolderPhone");
			return false
		}else{
			validEndInvalidField(true, "accountHolderPhone");
		}
	});
	$("#accountHolderEmail").blur(function() {
		if ($("#accountHolderEmail").val().trim()=="") {
			validEndInvalidField(null, "accountHolderEmail");
			return false
		}else{
			validEndInvalidField(true, "accountHolderEmail");
		}
	});
	$("#bankName").blur(function() {
		if ($("#bankName").val().trim()=="") {
			validEndInvalidField(null, "bankName");
			return false
		}else{
			validEndInvalidField(true, "bankName");
		}
	});
	$("#bankBranchName").blur(function() {
		if ($("#bankBranchName").val().trim()=="") {
			validEndInvalidField(null, "bankBranchName");
			return false
		}else{
			validEndInvalidField(true, "bankBranchName");
		}
	});
	$("#bankBranchAddress").blur(function() {
		if ($("#bankBranchAddress").val().trim()=="") {
			validEndInvalidField(null, "bankBranchAddress");
			return false
		}else{
			validEndInvalidField(true, "bankBranchAddress");
		}
	});
	$("#bankCountryId").change(function() {
		if ($("#bankCountryId").val().trim()=="") {
			validEndInvalidField(null, "bankCountryId");
			return false
		}else{
			validEndInvalidField(true, "bankCountryId");
		}
	});
	$("#bankStateId").change(function() {
		if ($("#bankStateId").val().trim()=="") {
			validEndInvalidField(null, "bankStateId");
			return false
		}else{
			validEndInvalidField(true, "bankStateId");
		}
	});
	$("#bankCityId").change(function() {
		if ($("#bankCityId").val().trim()=="") {
			validEndInvalidField(null, "bankCityId");
			return false
		}else{
			validEndInvalidField(true, "bankCityId");
		}
	});
	$("#bankPostal").blur(function() {
		if ($("#bankPostal").val().trim()=="") {
			validEndInvalidField(null, "bankPostal");
			return false
		}else{
			validEndInvalidField(true, "bankPostal");
		}
	});
	$("#otherDetails").blur(function() {
		if ($("#otherDetails").val().trim()=="") {
			validEndInvalidField(null, "otherDetails");
			return false
		}else{
			validEndInvalidField(true, "otherDetails");
		}
	});
	$("#swiftCode").blur(function() {
		if ($("#swiftCode").val().trim()=="") {
			validEndInvalidField(null, "swiftCode");
			return false
		}else{
			validEndInvalidField(true, "swiftCode");
		}
	});
	$("#bankIfsc").blur(function() {
		if ($("#bankIfsc").val().trim()=="") {
			validEndInvalidField(null, "bankIfsc");
			return false
		}else{
			validEndInvalidField(true, "bankIfsc");
		}
	});
	$("#routeNumber").blur(function() {
		if ($("#routeNumber").val().trim()=="") {
			validEndInvalidField(null, "routeNumber");
			return false
		}else{
			validEndInvalidField(true, "routeNumber");
		}
	});
}

function callForSignupTeacherAgreement(formId, userId, agreementLogId, controlType) {
	if (!$('#agreementDeclarationConfirm').is(':checked')) {
		showMessageTheme2(2, ' Please Accept the Declaration.');
		return false
	}
	if(userId==''){
		userId=$('#'+formId+ ' #userIdAgreement').val()
	}
	if(agreementLogId==''){
	agreementLogId=$('#'+formId+ ' #agreementLogId').val()
	}
	if(controlType==''){
		controlType=$('#'+formId+ ' #agreementAcceptanceFrom').val()
	}
	var flag = false;
	var data={}
	data['userId']=userId;
	data['agreementLogId']=agreementLogId;
	data['agreementLogId']=agreementLogId;
	data['controlType']=controlType;

	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLForHTML('teacher/signup','save-Teacher-Declaration'),
		data : JSON.stringify(data),
		dataType : 'json',
		async:false,
		success : function(response) {
			if(response.statusCode == "FAILED"){
				if(response.status == "3"){
					redirectLoginPage();
				}else if(response.status == "0" || response.status == "3"){
					showMessageTheme2(0, response.message,"", true);
				}
				flag=false;
			}else{
				if(controlType=='SIGNUP'){
					getStage5Data();
				}else{
					$('#teacherAgreementModal').modal('hide');
					if($('#showTimePrefModal').val() == "true"){
						$("#timePreferencePopup").modal("show");
					}else{
						$("#timePreferencePopup").modal("hide");	
					}
				}
				showMessageTheme2(1, 'Teacher Agreement details updated successfully.',"", true);
				flag=true;
			}
		}
	});
	return flag;
}

function callForSignupTeacherAccountAndContact(formId) {
    return new Promise((resolve, reject) => {
        let flag = false;

        if ($("#" + formId + " #accountCurrency").val() == '') {
            showMessageTheme2(2, 'Please choose account currency.');
            return false;
        }
        if ($("#" + formId + " #accountNumber").val() == '') {
            showMessageTheme2(2, 'Account number can\'t be blank.');
            return false;
        }
        if ($("#" + formId + " #accountCategory").val() == '') {
            showMessageTheme2(2, 'Please choose account type.');
            return false;
        }
        if ($("#" + formId + " #accountHolderFirstName").val() == '') {
            showMessageTheme2(2, 'Account holder first name can\'t be blank.');
            return false;
        }
        if ($("#" + formId + " #accountHolderLastName").val() == '') {
            showMessageTheme2(2, 'Account holder last name can\'t be blank.');
            return false;
        }
        if ($("#" + formId + " #accountHolderAddress").val() == '') {
            showMessageTheme2(2, 'Account holder address can\'t be blank.');
            return false;
        }
        if ($("#" + formId + " #accountHolderCountryId").val() == null || $("#" + formId + " #accountHolderCountryId").val() == '') {
            showMessageTheme2(2, 'Please choose account holder country.');
            return false;
        }
        if ($("#" + formId + " #accountHolderStateId").val() == null || $("#" + formId + " #accountHolderStateId").val() == '') {
            showMessageTheme2(2, 'Please choose account holder state.');
            return false;
        }
        if ($("#" + formId + " #accountHolderCityId").val() == null || $("#" + formId + " #accountHolderCityId").val() == '') {
            showMessageTheme2(2, 'Please choose account holder city.');
            return false;
        }
        if ($("#" + formId + " #accountHolderPostal").val() == '') {
            showMessageTheme2(2, 'Account holder postal code can\'t be blank.');
            return false;
        }
        if ($("#" + formId + " #accountHolderPhone").val() == '') {
            showMessageTheme2(2, 'Account holder phone number can\'t be blank.');
            return false;
        }
        if (!validateEmail($("#" + formId + " #accountHolderEmail").val())) {
            showMessageTheme2(2, 'Invalid Email.');
            return false;
        }
        if ($("#" + formId + " #bankName").val() == '') {
            showMessageTheme2(2, 'Bank name can\'t be blank.');
            return false;
        }
        if ($("#" + formId + " #bankBranchName").val() == '') {
            showMessageTheme2(2, 'Bank branch name can\'t be blank.');
            return false;
        }
        if ($("#" + formId + " #bankBranchAddress").val() == '') {
            showMessageTheme2(2, 'Bank branch address can\'t be blank.');
            return false;
        }
        if ($("#" + formId + " #bankCountryId").val() == null || $("#" + formId + " #bankCountryId").val() == '') {
            showMessageTheme2(2, 'Please choose bank country.');
            return false;
        }
        if ($("#" + formId + " #bankStateId").val() == null || $("#" + formId + " #bankStateId").val() == '') {
            showMessageTheme2(2, 'Please choose bank state.');
            return false;
        }
        if ($("#" + formId + " #bankCityId").val() == null || $("#" + formId + " #bankCityId").val() == '') {
            showMessageTheme2(2, 'Please choose bank city.');
            return false;
        }
        if ($("#" + formId + " #bankPostal").val() == '') {
            showMessageTheme2(2, 'Bank postal code can\'t be blank.');
            return false;
        }
        if ($("#" + formId + " #fileupload5Span").html() == '' || $("#" + formId + " #fileupload5Span").html() == 'No file Selected*') {
            showMessageTheme2(2, 'Upload document for Address Proof.');
            return false;
        }

        $.ajax({
            type: "POST",
            contentType: APPLICATION_JSON_VALUE,
            url: getURLForHTML('teacher/signup', '/save-teacher-bank-details'),
            data: JSON.stringify(getRequestForTeacherAccountAndContact(formId)),
            dataType: 'json',
            success: function (response) {
                if (response.statusCode === "FAILED") {
                    if (response.status === "3") {
                        redirectLoginPage();
                    } else {
                        showMessageTheme2(0, response.message);
                    }
                    return reject(flag);
                } else {
					showMessageTheme2(1, "Redirecting to Dashboard");
                    setTimeout(function () {
                        goAhead(BASE_URL + CONTEXT_PATH + SCHOOL_UUID + "/dashboard/teacher/" + UNIQUEUUID, '');
                    }, 1000);
                    flag = true;
                    return resolve(flag);
                }
            }
        });
    });
}

function getRequestForTeacherAccountAndContact(formId){
	var request = {};
	var authentication = {};
	var teacherPaymentInfoDTO = {};
	
	var accountType = "BANK_ACCOUNT";
	
	teacherPaymentInfoDTO['userId'] = USER_ID;
	teacherPaymentInfoDTO['attachments'] = bankUploadDocsObj;
	teacherPaymentInfoDTO['accountType'] = accountType;
	teacherPaymentInfoDTO['accountCurrency'] = $("#"+formId+" #accountCurrency").val();
	teacherPaymentInfoDTO['accountNumber'] = $("#"+formId+" #accountNumber").val();
	teacherPaymentInfoDTO['iban'] = $("#"+formId+" #iban").val();
	teacherPaymentInfoDTO['accountCategory'] = $("#"+formId+" #accountCategory").val();
	teacherPaymentInfoDTO['accountHolderFirstName'] = toTitleCase($("#"+formId+" #accountHolderFirstName").val());
	teacherPaymentInfoDTO['accountHolderMiddleName'] = toTitleCase($("#"+formId+" #accountHolderMiddleName").val());
	teacherPaymentInfoDTO['accountHolderLastName'] = toTitleCase($("#"+formId+" #accountHolderLastName").val());
	teacherPaymentInfoDTO['accountHolderAddress'] = toTitleCase($("#"+formId+" #accountHolderAddress").val());
	teacherPaymentInfoDTO['accountHolderCountryId'] = $("#"+formId+" #accountHolderCountryId").val();
	teacherPaymentInfoDTO['accountHolderStateId'] = $("#"+formId+" #accountHolderStateId").val();
	teacherPaymentInfoDTO['accountHolderCityId'] = $("#"+formId+" #accountHolderCityId").val();
	teacherPaymentInfoDTO['accountHolderPostal'] = $("#"+formId+" #accountHolderPostal").val();
	teacherPaymentInfoDTO['accountHolderPhone'] = $("#"+formId+" #accountHolderPhone").val();
	teacherPaymentInfoDTO['accountHolderEmail'] = $("#"+formId+" #accountHolderEmail").val();

	teacherPaymentInfoDTO['bankName'] = toTitleCase($("#"+formId+" #bankName").val());
	teacherPaymentInfoDTO['bankBranchName'] = toTitleCase($("#"+formId+" #bankBranchName").val());
	teacherPaymentInfoDTO['bankBranchAddress'] = escapeCharacters(toTitleCase($("#"+formId+" #bankBranchAddress").val()));
	teacherPaymentInfoDTO['bankCountryId'] = $("#"+formId+" #bankCountryId").val();
	teacherPaymentInfoDTO['bankStateId'] = $("#"+formId+" #bankStateId").val();
	teacherPaymentInfoDTO['bankCityId'] = $("#"+formId+" #bankCityId").val();
	teacherPaymentInfoDTO['bankPostal'] = $("#"+formId+" #bankPostal").val();
	teacherPaymentInfoDTO['swiftCode'] = $("#"+formId+" #swiftCode").val();
	teacherPaymentInfoDTO['bankIfsc'] = $("#"+formId+" #bankIfsc").val();
	teacherPaymentInfoDTO['routeNumber'] = $("#"+formId+" #routeNumber").val();
	teacherPaymentInfoDTO['accountNumber'] = $("#"+formId+" #accountNumber").val();
	teacherPaymentInfoDTO['otherDetails'] = toSentenceCase($("#"+formId+" #otherDetails").val());
	teacherPaymentInfoDTO['payPalEmail'] = $("#"+formId+" #paypalEmailId").val();
	authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = 'TEACHER';
	authentication['userId'] = USER_ID;
	request['authentication'] = authentication;
	request['data'] = teacherPaymentInfoDTO;
	return request;
}

async function getStage6Data(){
	setSteps(6);
	showSkeleton(true, "step6");
	reviewDone = true;
	$("#teacherSignupContentStage6").html(getTeacherBankAccountDetails());
	signupTeacherStage6OnLoadEvent();
	$(".step-6-skeleton").hide();
	$("#teacherSignupStage6").show();
}