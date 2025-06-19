function showSkeleton (isShow, skeletonType){
	if(isShow && skeletonType == "step1"){
		$(".step-1-skeleton").html(skeletonStudent());
		$(".step-1-skeleton").show();
		$("#signupStage1").hide();
	}else if(isShow && skeletonType == "step2"){
		$(".step-2-skeleton").html(skeletonParent());
		$(".step-2-skeleton").show();
		$("#signupStage2").hide();
	}else if(isShow && skeletonType == "step3"){
		$(".step-3-skeleton").html(skeletonCourseSelection());
		$(".step-3-skeleton").show();
		$("#signupStage3").hide();
	}else if(isShow && skeletonType == "fee-details-modal"){
		$(".step-feeDetails-skeleton").show();
		$(".feeDetailsContentDiv").hide();
	}else if(isShow && skeletonType == "step4"){
		$(".step-4-skeleton").html(skeletonReviewPayment());
		$(".step-4-skeleton").show();
		$("#signupStage4Content").hide();
	}
}

var signupStage1Form = '';
var signupStage2Form = '';
async function renderEnrollmentPage(courseProviderId, signupPage, UNIQUEUUID, moduleName, programLabel, moduleId, learningProgram, isFirstPayment, MAINTENANCEDOWNTIME) {
	if (DEPLOYMENT_MODE == 'PROD') {
	    //<!-- Google Tag Manager (noscript) -->
	    $("body").html('<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PGC67T7" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>');
 
	    //<!-- End Google Tag Manager (noscript) -->
	    //<!-- Facebook Pixel Code -->
	    $("body").append('<noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=2630519373836959&ev=PageView&noscript=1"/></noscript>')
	    //<!-- End Facebook Pixel Code -->
	}
	var html = await generateEnrollmentContent(courseProviderId, UNIQUEUUID, moduleName, programLabel, moduleId, learningProgram, isFirstPayment, MAINTENANCEDOWNTIME)
	$("body").append(html);
	$("#formSteps").append(signupModals());
	signupStage1Form = $('#signupStage1');
	signupStage2Form = $('#signupStage2');
	signupStage1Form.validate({
	    rules: {
		   firstName: {
			  required: true,
		   },
		   middleName: {
		   },
		   lastName: {
			  required: true,
		   },
		   dob: {
			  required: true
			  //dateFormat:true
		   },
		   gender: {
			  required: true,
		   },
		   countryId: {
			  required: true,
		   },
		   stateId: {
			  required: true,
		   },
		   cityId: {
			  required: true,
		   },
		   emailId: {
			  required: true,
			  email: true
		   },
		   nationality: {
			  required: true,
		   },
		   applyStandardId: {
			  required: true,
		   },
		   contactNumber: {
			  required: true,
			  mobileRegex: true,
			  minlength: 5,
			  maxlength: 15
		   }
 
	    },
	    messages: {
		   firstName: {
			  required: "Please enter first name",
		   },
		   lastName: {
			  required: "Please enter last name",
		   },
		   dob: {
			  required: "Please enter date of birth"
		   },
		   gender: {
			  required: "Please select gender"
		   },
		   countryId: {
			  required: "Please select country"
		   },
		   stateId: {
			  required: "Please select state/province"
		   },
		   cityId: {
			  required: "Please select city"
		   },
		   emailId: {
			  required: "Please enter email"
		   },
		   applyStandardId: {
			  required: "Please select the Grade",
		   },
		   nationality: {
			  required: "Please select the Nationality",
		   },
		   contactNumber: {
			  required: "Please enter phone number"
		   }
 
	    }
	});
	signupStage2Form.validate({
	    rules: {
		   parentFirstName: {
			  required: true,
 
		   },
		   parentMiddletName: {
		   },
		   parentlastName: {
			  required: true,
		   },
		   parentGender: "required",
		   relation: {
			  required: true,
		   },
		   otherName: {
			  required: true
		   },
		   // responsible:"required",
		   parentPhoneNumber: {
			  required: false,
			  mobileRegex: true,
			  minlength: 5,
			  maxlength: 15
		   },
		   wishSameParent: "required",
		   pCountryId: {
			  required: true,
		   },
		   pStateId: {
			  required: true,
		   },
		   pCityId: {
			  required: true,
		   }
	    },
	    messages: {
		   parentFirstName: {
			  required: "Please enter first name",
		   },
		   parentlastName: {
			  required: "Please enter last name",
		   },
		   parentGender: {
			  required: "Please select gender",
		   },
		   relation: {
			  required: "Please select relation",
		   },
		   otherName: {
			  required: "Please enter other relation"
		   },
		   pCountryId: {
			  required: "Please select country"
		   },
		   pStateId: {
			  required: "Please select state/province"
		   },
		   pCityId: {
			  required: "Please select city"
		   }
	    }
	});
	if (signupPage >= 1) {
	    callForStudentSelection();
	}
	if (signupPage >= 2) {
	    callForParentSelection();
	}
	if (signupPage >= 3) {
	    getAllCourseDetails('N', '');
	}
	if (signupPage == 4) {
	    callForReviewAndPaymentSelection('N');
	}
	setActiveStep(signupPage);
	getSignupStatus();
 
 
	if (signupPage > 0) {
	    setActiveTab(signupPage);
	}
	$('.dt-responsive tbody tr td:first-child').addClass('dtr-control');
 }

async function generateEnrollmentContent(courseProviderId,UNIQUEUUID, moduleName, programLabel, moduleId, learningProgram, MAINTENANCEDOWNTIME){
	// var schoolSettingsTechnical = await getSchoolSettingsTechnical(SCHOOL_ID);
	var schoolSettingsLinks = await getSchoolSettingsLinks(SCHOOL_ID);
	var html=
	'<div class="wrapper-style">'
		+'<a class="tab-and-mobile-logout-btn primary-bg" href="javascript:void(0)" onclick="signupLogout()"><i class="zmdi zmdi-power"></i> Log out</a>'
		+'<section class="full">'
			+'<div class="full mb-2">'
				+'<div class="logo">'
					+'<a href="'+schoolSettingsLinks.schoolWebsite+'" target="blank">'
						+'<img src="'+schoolSettingsLinks.logoUrl+SCRIPT_VERSION+'" alt="'+schoolSettingsLinks.schoolWebsite+'" target="blank">'
					+'</a>'
				+'</div>'
			+'</div>'
			+'<section class="full text-center">'
				+'<h1 class="form-heading white-txt-color alternate-bg page-heading" id="learingProgramHeader" val="'+learningProgram+'" >';
					if(moduleId == 'STUDENT'){
						html+=programLabel;
					} else {
						html+=moduleName;
					}
				html+='</h1>'
			+'</section>'
			+'<div class="timer" id="stepsMessage">Takes less than 1 minute to complete this step</div>'
		+'</section>'
		+'<input type="hidden" id="courseProviderId" value="'+courseProviderId+'" />'
		+'<div class="fixed-button one-btn">'
			+'<a class="primary-bg white-txt-color" href="'+BASE_URL+CONTEXT_PATH+SCHOOL_UUID+'/common/logout/'+UNIQUEUUID+'" class="tab-and-mobile-logout-btn primary-bg"><i class="zmdi zmdi-power"></i> Log out</i></a>'
		+'</div>';
		if(MAINTENANCEDOWNTIME !=''){
			html+='<div class="full">'
					+'<marquee id="marqueeDiv" direction="left" style="color: red" width="100%">'+MAINTENANCEDOWNTIME+'</marquee>'
				+'</div>';
		}
		html+='<div id="messageDiv" class="server-error-message">'
			+'<span id="messageDiv1" class="msg error"><i class="fa fa-times"></i> Error Message </span>'
		+'</div>'
		+'<div id="formSteps">'
			+'<div class="steps clearfix">'
				+'<ul role="tablist">'
					+'<li role="tab" aria-disabled="false" class="first current" aria-selected="true">'
						+'<a id="steps-uid-0-t-0" href="#steps-uid-0-h-0" aria-controls="steps-uid-0-p-0">'
							+'<span class="current-info audible">current step: </span>'
							+'<span class="number">1.</span>'
							+'<img src="'+PATH_FOLDER_IMAGE2+'step-1.png" alt="">'
							+'<span class="step-order">Step 1</span>'
						+'</a>'
						+'<span class="step-arrow step1"></span>'
					+'</li>'
					+'<li role="tab" aria-disabled="false">'
						+'<a id="steps-uid-0-t-1" href="#steps-uid-0-h-1" aria-controls="steps-uid-0-p-1">'
							+'<span class="number">2.</span>';
							if(courseProviderId == 39){
								html+='<img src="'+PATH_FOLDER_IMAGE2+'talking-deactive.png" alt="">';
							}else{
								html+='<img src="'+PATH_FOLDER_IMAGE2+'step-2-deactive.png" alt="">';
							}
							
							html+='<span class="step-order">Step 2</span>'
						+'</a>'
						+'<span class="step-arrow step2"></span>'
					+'</li>'
					+'<li role="tab" aria-disabled="false">'
						+'<a id="steps-uid-0-t-2" href="#steps-uid-0-h-2" aria-controls="steps-uid-0-p-2">'
							+'<span class="number">3.</span>'
							+'<img src="'+PATH_FOLDER_IMAGE2+'step-4-deactive.png" alt="">'
							+'<span class="step-order">Step 3</span>'
						+'</a>'
						+'<span class="step-arrow step3"></span>'
					+'</li>'
					+'<li role="tab" aria-disabled="false" class="last">'
						+'<a id="steps-uid-0-t-3" href="#steps-uid-0-h-3" aria-controls="steps-uid-0-p-3">'
							+'<span class="number">4.</span>'
							+'<img src="'+PATH_FOLDER_IMAGE2+'step-5-deactive.png" alt="">'
							+'<span class="step-order">Step 4</span>'
						+'</a>'
					+'</li>'
				+'</ul>'
			+'</div>'
			+'<div class="content">'
				+'<section id="step-1" class="step active-step">'
					+'<div class="full step-1-skeleton skeleton-wrapper"></div>'
					+'<form id="signupStage1" name="signupStage1" method="post" autocomplete="off" action="javascript:void(0);" style="display:none;">'
						+'<div id="signupStage1Content" style="display:inline-block;width: 100%;"></div>'
					+'</form>'
				+'</section>'
				
				+'<section id="step-2" class="step">'
					+'<div class="full step-2-skeleton skeleton-wrapper"></div>'
					+'<form id="signupStage2" name="signupStage2" method="post" autocomplete="off" action="javascript:void(0);">'
						+'<div id="signupStage2Content" style="display: inline-block;width: 100%;"></div>'
					+'</form>'
				+'</section>'
				
				+'<section id="step-3" class="step">'
					+'<div class="full step-3-skeleton skeleton-wrapper"></div>'
					+'<form id="signupStage3" name="signupStage3" method="post" autocomplete="off" action="javascript:void(0);">'
						+'<div id="signupStage3Content" style="display: inline-block;width: 100%;"></div>'
					+'</form>'
				+'</section>'
				
				+'<section id="step-4" class="step">'
					+'<div class="full step-4-skeleton skeleton-wrapper"></div>'
					+'<div id="signupStage4Content" style="display: inline-block;width: 100%;"></div>'
				+'</section>'
				
			+'</div>'
			+'<div class="actions clearfix">'
				+'<ul role="menu" aria-label="Pagination">'
					+'<li class="prev-btn"  style="opacity:0;visibility: hidden;">'
						+'<a href="javascript:void(0)" class="primary-bg white-txt-color white-hov-bg primary-hov-border-color primary-hov-txt" role="menuitem" onclick="moveStep(\'prev\')" >Back</a>'
					+'</li>'
					+'<li class="next-btn">'
						+'<a href="javascript:void(0)"class="primary-bg white-txt-color white-hov-bg primary-hov-border-color primary-hov-txt"role="menuitem" onclick="moveStep(\'next\')">Next</a>'
					+'</li>'
					+'<li class="finish-btn" style="display: none;">'
						+'<a href="javascript:void(0)"class="primary-bg white-txt-color white-hov-bg primary-hov-border-color primary-hov-txt"role="menuitem" onclick="moveStep(\'finish\');showPaymentTermCondMode();">'+(SHOW_PAYMENT_OPTION=='Y'?'Pay':'Submit Application')+'</a>'
					+'</li>'
				+'</ul>'
			+'</div>'
		+'</div>'
	+'</div>';
	 if(SCHOOL_ID==1){
		html+='<div id="commonloaderId" class="unique-loader loader-bg" style="display:none;">'
			+'<img src="'+PATH_FOLDER_IMAGE2+'loader-new.gif" alt="${SCHOOL_NAME} Loader" class="new-loader-2024" />'
		+'</div>';
	 }else{
		html+='<div id="commonloaderIdNewLoader" class="loader-wrapper d-flex justify-content-center align-items-center loader-style hide-loader">'
			+'<div class="ball-rotate">'
				+'<div style="background-color: rgb(247, 185, 36);"></div>'
			+'</div>'
			+'<p>Loading ...</p>'
		+'</div>';
	 }
	
	html+=logOutModalContent()
	return html;
}

function renderStudentDetails(data){
	var signupStudent = data.signupStudent;
	var scriptExecuted = false;
	$('#signupStage1Content').html(getStudentDetailsContent(data));
	if(signupStudent.gender != null && signupStudent.gender!=''){
		$('#signupStage1 #gender').val(signupStudent.gender);
	}
	if(signupStudent.standardId != null && signupStudent.standardId>0){
		$('#signupStage1 #applyStandardId').val(signupStudent.standardId);
	}
	if(signupStudent.courseProviderId==39){
		var learningLabel='';
		if(signupStudent.standardId>=1 && signupStudent.standardId<=3){
			learningLabel='I'
		}else if(signupStudent.standardId>=4 && signupStudent.standardId<=7){
			learningLabel='A'
		}else if(signupStudent.standardId>=11 && signupStudent.standardId<=16){
			learningLabel='B'
		}
		$('#signupStage1 #learningLabel').val(learningLabel);
	}
	$("#applyStandardId").unbind('change').bind('change',function(){
		$('#applyStandardId').valid();
		dobInitalize(SCHOOL_ID,true, signupStudent.courseProviderId)	
	});
	dobInitalize(SCHOOL_ID,false,signupStudent.courseProviderId)
	$("#signupStage1 #gender option[value='TRANSGENDER']").remove();
	createSelect2Element('signupStage1', 'gender')
	createSelect2Element('signupStage1', 'countryId')
	createSelect2Element('signupStage1', 'stateId')
	createSelect2Element('signupStage1', 'cityId')
	createSelect2Element('signupStage1', 'nationality')
	if($('#learingProgramHeader').attr('val')=='DUAL_DIPLOMA'){
		$('#signupStage1 #studyingGradeId').val(signupStudent.studyingGradeId);
		createSelect2Element('signupStage1', 'studyingGradeId')
		createSelect2Element('signupStage1', 'countryIdOfSchool')
	}
	if(signupStudent.courseProviderId==39){
		createSelect2Element('signupStage1', 'learningLabel');
	}else{
		createSelect2Element('signupStage1', 'applyStandardId');
	}

	if(!scriptExecuted){
		inputContact = document.querySelector("#contactNumber");
		itiContcat = window.intlTelInput(inputContact);
		if(signupStudent.countryCode == '' || signupStudent.countryCode == undefined || signupStudent.countryCode == null){
			itiContcat.setCountry('us');
		}else{
			itiContcat.setCountry(signupStudent.countryCode);
		}
		inputContact.addEventListener('countrychange', function(e) {
			$('#countryIsd').val(itiContcat.getSelectedCountryData().iso2);
			$('#countryDailCode').val(itiContcat.getSelectedCountryData().dialCode);
		});
		scriptExecuted = true;
	}
	$("#firstName").blur(function() {
		if ($("#signupStage1 #firstName").val().trim()=="") {
			$('#firstName').valid();
			validEndInvalidField(null, "firstName");
			//showMessage(0, 'First Name is required');
			return false
		}else{
			validEndInvalidField(true, "firstName");
		}
	});
	$("#middleName").blur(function() {
		if ($("#signupStage1 #middleName").val().trim()=="") {
			validEndInvalidField(null, "middleName");
			return false
		}else{
			validEndInvalidField(true, "middleName");
		}
	});
	$("#lastName").blur(function() {
		$('#lastName').valid();
		if ($("#signupStage1 #lastName").val().trim()=="") {
			validEndInvalidField(null, "lastName");
			//showMessage(0, 'Last Name is required');
			return false
		}else{
			validEndInvalidField(true, "lastName");
		}
	});

	$("#studyingSchoolName").blur(function() {
		$('#studyingSchoolName').valid();
		if ($("#signupStage1 #studyingSchoolName").val().trim()=="") {
			validEndInvalidField(null, "studyingSchoolName");
			//showMessage(0, 'Last Name is required');
			return false
		}else{
			validEndInvalidField(true, "studyingSchoolName");
		}
	});

	$("#studyingGradeId").on("change",function(){
		$('#studyingGradeId').valid();
		if ($("#signupStage1 #studyingGradeId").val()=="") {
			validEndInvalidField(null, "studyingGradeId");
			//showMessage(0, 'Gendar is required');
			return false
		}else{
			validEndInvalidField(true, "studyingGradeId");
		}
	});

	$("#countryIdOfSchool").on("change",function(){
		$('#countryIdOfSchool').valid();
		if ($("#signupStage1 #countryIdOfSchool").val()=="") {
			validEndInvalidField(null, "countryIdOfSchool");
			//showMessage(0, 'Gendar is required');
			return false
		}else{
			validEndInvalidField(true, "countryIdOfSchool");
		}
	});
	
	$("#dob").on("change", function() {
		if($('#signupStage1 #dob').val()!=""){
			var dobd =getDateInDateFormat($("#signupStage1 #dob").val());
			dobd = changeDateFormat(dobd, 'mm-dd-yyyy')
			var dob1=dobd.split("-");
			dobd = dobd.split("-").length;
			if(parseInt(dobd)!=3 || parseInt(dob1[1])>31 || parseInt(dob1[0])>12){
				//showMessage(0, 'Date of Birth is not valid');
				validEndInvalidField(false, "dob");
				return false;
			}else{
				validEndInvalidField(true, "dob");
				return true;
			}
			var age = M.countAgeNew(dob1[1], dob1[0], dob1[2]);
			if(age<12.927800723458905){
	//			if ($("#signupStage1 #checkAge").is(':checked')){
	//
	//			}else{
	//				showMessage(1, 'Please confirm that your age is less than 13 years by selecting the checkbox');
	//				$('#signupStage1 #ageOfThirteen').show();
	//				return false
	//			}
			}
		}else if($('#signupStage1 #dob').val()==""){
			//showMessage(0, 'Please choose your Date of Birth.');
			validEndInvalidField(null, "dob");
			$('#dob').valid();
			return false
		}
		else{
			validEndInvalidField(true, "dob");
		}
	});
	$("#applyStandardId").on("change",function(){
		if ($("#signupStage1 #applyStandardId").val()=="") {
			validEndInvalidField(null, "applyStandardId");
			$('#applyStandardId').valid();
			if(!$('#signupStage1 #dob').parent().hasClass("false")){
				validEndInvalidField(null, "dob");
			}
			//showMessage(0, 'Grade Name is required');
			return false
		}else{
			validEndInvalidField(true, "applyStandardId");
			if(!$('#signupStage1 #dob').parent().hasClass("false")){
				$("#dob").valid();
				validEndInvalidField(null, "dob");
			}
		}
	});
	$("#gender").on("change",function(){
		$('#gender').valid();
		if ($("#signupStage1 #gender").val()=="") {
			validEndInvalidField(null, "gender");
			//showMessage(0, 'Gendar is required');
			return false
		}else{
			validEndInvalidField(true, "gender");
		}
	});

	$("#nationality").on("change",function(){
		$('#nationality').valid();
		if ($("#signupStage1 #nationality").val()=="") {
			validEndInvalidField(null, "nationality");
			//showMessage(0, 'Gendar is required');
			return false
		}else{
			validEndInvalidField(true, "nationality");
		}
	});
	$("#contactNumber").unbind().bind("change",function(){
		$('#contactNumber').valid();
		if ($("#signupStage1 #contactNumber").val().length < 5 && $("#signupStage1 #contactNumber").val().length > 0 ) {
			validEndInvalidField(false, "contactNumber");
			return false
		}
		if ($("#signupStage1 #contactNumber").val().trim()=="" || $("#signupStage1 #contactNumber").val().length == 0 ) {
			validEndInvalidField(null, "contactNumber");
			//showMessage(0, 'Gendar is required');
			return false
		}else{
			validEndInvalidField(true, "contactNumber");
		}
	});
	var mandatoryFields=[];
	var nonMandatoryFields=[];
	if(signupStudent.firstName !=''){
		mandatoryFields.push('firstName');
	}
	if(signupStudent.middleName !=''){
		nonMandatoryFields.push('middleName');
	}
	if(signupStudent.lastName !=''){
		mandatoryFields.push('lastName');
	}
	if (signupStudent.standardId !=null && signupStudent.standardId > 0){
		mandatoryFields.push('applyStandardId');
	}
	if(signupStudent.dob !=''){
		mandatoryFields.push('dob');
	}
	if(signupStudent.gender!=null && signupStudent.gender!=''){
		mandatoryFields.push('gender');
	}
	if(signupStudent.countryId!=null && signupStudent.countryId>0){
		mandatoryFields.push('countryId');
	}
	if(signupStudent.stateId!=null && signupStudent.stateId>0){
		mandatoryFields.push('stateId');
	}	
	if(signupStudent.cityId !=null && signupStudent.cityId>0){
		mandatoryFields.push('cityId');
	}
	if(signupStudent.communicationEmail!=''){
		mandatoryFields.push('communicationEmail');
	}
	if(signupStudent.contactNumber!=''){
		mandatoryFields.push('contactNumber');
	}
	if(signupStudent.nationality!='' && signupStudent.nationality != undefined && signupStudent.nationality != null){
		mandatoryFields.push('nationality');
	}
	if(signupStudent.studyingSchoolName!='' && signupStudent.studyingSchoolName != undefined && signupStudent.studyingSchoolName != null){
		mandatoryFields.push('studyingSchoolName');
	}
	if(signupStudent.studyingSchoolName!='' && signupStudent.studyingSchoolName != undefined && signupStudent.studyingSchoolName != null){
		mandatoryFields.push('studyingGradeId');
	}
	if(signupStudent.countryNameOfSchool!='' && signupStudent.countryNameOfSchool != undefined && signupStudent.countryNameOfSchool != null){
		mandatoryFields.push('countryIdOfSchool');
	}
	if(mandatoryFields.length>0){
		formValdate('signupStage1', mandatoryFields, []);
	}
	if(nonMandatoryFields.length>0){
		formValdate('signupStage1', [], nonMandatoryFields);
	}
	$("#countryId").on("change",function(){
		$('#countryId').valid();
		var selectedCountry =  $('option:selected', this).attr("dail-country-code");
		callStates('signupStage1', this.value, 'countryId', 'stateId', 'cityId');
		if( selectedCountry !=undefined && selectedCountry != ''){
			itiContcat.setCountry(selectedCountry);
		}else{
			$("#stateId").html("<option value=''>Select State/Province*</option>");
		}
		$("#cityId").html("<option value=''>Select City*</option>");
		checkCSCValidation(selectedCountry, "countryId", "Country");
		checkCSCValidation("", "stateId", "State/Province*");
		checkCSCValidation("", "cityId", "City");
		//$("#signupStage1").valid()
		$('#stateId').valid();
		$('#cityId').valid();
	});
	
	$("#stateId").on("change",function(){
		var selectedState =  $('option:selected', this).attr("value");
		$('#stateId').valid();
		checkCSCValidation($("#signupStage1 #stateId").val(), "stateId", "State/Province*");
		checkCSCValidation("", "cityId", "City");
		callCities('signupStage1', this.value, 'stateId', 'cityId');
		if(selectedState == ''){
			$("#cityId").html("<option value=''>Select City*</option>");
		}
		$('#cityId').valid();
	
	});
	$("#cityId").on("change",function(){
		checkCSCValidation($("#signupStage1 #cityId").val(), "cityId", "City");
		$('#cityId').valid();
	});
}

function getStudentDetailsContent(data){
	var tabindex=0;
	var signupStudent = data.signupStudent;
	var html =
	'<h3 class="alternate-txt-color">Student Details</h3>'
			+'<input type="hidden" id="userId" value="'+data.userId+'" />'
			+'<input type="hidden" id="countryDailCode" value="'+signupStudent.countryIsdCode+'" />'
			+'<input type="hidden" id="countryIsd" value="'+signupStudent.countryCode+'" />'
			+'<input type="hidden" name="location" id="location" value="" />'
			+'<div class="form-row">'
				+'<div class="form-holder valid-field">'
					+'<i class="zmdi zmdi-account"></i>'
					+'<input type="text" name="firstName" style="text-transform:capitalize" id="firstName" class="form-control-field" value="'+signupStudent.firstName+'" maxlength="40" '+(data.paymentStatus=='SUCCESS'?'disabled':'')+' onkeydown="return M.isChars(event);" placeholder="First Name*" tabindex="'+(++tabindex)+'">'
				+'</div>'
				+'<div class="form-holder valid-field">'
					+'<i class="zmdi zmdi-account"></i>'
					+'<input type="text" name="middleName" style="text-transform:capitalize" id="middleName" class="form-control-field" value="'+signupStudent.middleName+'" maxlength="40" '+(data.paymentStatus=='SUCCESS'?'disabled':'')+' onkeydown="return M.isChars(event);" placeholder="Middle Name" tabindex="'+(++tabindex)+'">'
				+'</div>'
				+'<div class="form-holder valid-field">'
					+'<i class="zmdi zmdi-account"></i>'
					+'<input type="text" name="lastName" style="text-transform:capitalize" id="lastName" class="form-control-field" value="'+signupStudent.lastName+'" maxlength="40" '+(data.paymentStatus=='SUCCESS'?'disabled':'')+' onkeydown="return M.isChars(event);" placeholder="Last Name*" tabindex="'+(++tabindex)+'">'
				+'</div>'
			+'</div>'
			+'<div class="form-row">'
				+'<div class="form-holder valid-field">'
					+'<i class="zmdi zmdi-book"></i>';
					if(data.signupStudent.courseProviderId==39){
						html+='<select name="learningLabel" id="learningLabel" tabindex="'+(++tabindex)+'" onchange="calculateGradeLabel()">'
						+getLearningLabel()
						+'</select>'
						+'<select name="applyStandardId" id="applyStandardId" tabindex="'+(++tabindex)+'" style="display:none;">'
						+getOptions(data.signupStudent.grades, data.signupStudent.standardId)
						+'</select>';
					}else{
						html+='<select name="applyStandardId" id="applyStandardId" tabindex="'+(++tabindex)+'">'
						+'<option value="">Select Grade</option>'
						+getOptions(data.signupStudent.grades, data.signupStudent.standardId)
						+'</select>';
					}
				html+='</div>'
				+'<div class="form-holder valid-field">'
					+'<i class="zmdi zmdi-account-calendar"></i>'
					+'<input type="text" name="dob" id="dob" class="form-control-field" value="'+signupStudent.dob+'" placeholder="Date of Birth* (MMM dd, yyyy)" onkeydown="return false" tabindex="'+(++tabindex)+'" readonly>'
				+'</div>'
				+'<div class="form-holder valid-field">'
					+'<i class="zmdi zmdi-male-female"></i>'
					+'<select name="gender" id="gender" required tabindex="'+(++tabindex)+'" '+(data.paymentStatus=='SUCCESS'?'disabled':'')+'>'
						+getGenderContent()
					+'</select>'
				+'</div>'
			+'</div>'
			+'<div class="form-row">'
				+'<div class="form-holder valid-field">'
					+'<i class="zmdi zmdi-email"></i>'
					+'<input type="email" name="communicationEmail" id="communicationEmail" class="form-control-field" value="'+signupStudent.communicationEmail+'" disabled placeholder="Email*" tabindex="'+(++tabindex)+'">'
				+'</div>'
				+'<div class="form-holder password valid-field">'
					+'<i class="zmdi zmdi-smartphone-android"></i>'
					+'<input type="tel" name="contactNumber" id="contactNumber"  class="form-control-field" maxlength="15" value="'+signupStudent.contactNumber+'" onkeydown="return M.digit(event);" placeholder="Phone Number*" tabindex="'+(++tabindex)+'">'
				+'</div>'
				+'<div class="form-holder valid-field">'
					+'<i class="zmdi zmdi-pin"></i>'
					+'<select name="nationality" id="nationality" required tabindex="'+(++tabindex)+'">'
						+'<option value="">Select Nationality*</option>'
						+getNationalityOption(signupStudent.countries, signupStudent.nationality)
					+'</select>'
					+'<span style="color:#444;position:absolute;top:100%;left:0">You must have a valid ID of your nationality<span>'
				+'</div>'
			+'</div>'
			+'<div class="form-row mb-2">'
				+'<strong>Student\'s Current Location</strong>'
			+'</div>'
			+'<div class="form-row">'
				+'<div class="form-holder valid-field">'
					+'<i class="zmdi zmdi-pin"></i>'
					+'<select name="countryId" id="countryId" required  tabindex="'+(++tabindex)+'" '+(data.schoolId==5?'disabled':'')+'>'
						+'<option value="">Select Country*</option>'
						+getCountriesOption(signupStudent.countries, signupStudent.countryId)
					+'</select>'
				+'</div>'
				+'<div class="form-holder valid-field">'
					+'<i class="zmdi zmdi-pin"></i>'
					+'<select name="stateId" id="stateId" required  tabindex="'+(++tabindex)+'">'
						+'<option value="">Select State/Province*</option>'
						+getStatesOption(signupStudent.states, signupStudent.stateId)
					+'</select>'
				+'</div>'
				+'<div class="form-holder valid-field">'
					+'<i class="zmdi zmdi-pin"></i>'
					+'<select name="cityId" id="cityId" required tabindex="'+(++tabindex)+'">'
						+'<option value="">Select City*</option>'
						+getCitiesOption(signupStudent.cities, signupStudent.cityId)
					+'</select>'
				+'</div>'
			+'</div>';
			if($('#learingProgramHeader').attr('val')=='DUAL_DIPLOMA'){
				html+=
				'<div class="form-row mb-2">'
					+'<strong>Current School Details</strong>'
				+'</div>'
				+'<div class="form-row">'
					+'<div class="form-holder valid-field">'
						+'<i class="zmdi zmdi-graduation-cap"></i>'
						+'<input type="text" name="studyingSchoolName" id="studyingSchoolName" class="form-control-field" value="'+signupStudent.studyingSchoolName+'" placeholder="Student\'s School Name*" tabindex="'+(++tabindex)+'">'
					+'</div>'
					+'<div class="form-holder valid-field">'
						+'<i class="zmdi zmdi zmdi-book"></i>'
						+'<select name="studyingGradeId" id="studyingGradeId" tabindex="'+(++tabindex)+'">'
							+'<option value="0">Student Current Grade*</option>'
							+getStandardContentForDualDimploma(data.signupStudent.studyingGradeId)
						+'</select>'
					+'</div>'
					+'<div class="form-holder valid-field">'
						+'<i class="zmdi zmdi-pin"></i>'
						+'<select name="countryIdOfSchool" id="countryIdOfSchool" required tabindex="'+(++tabindex)+'">'
							+'<option value="">Select Country of School*</option>'
							+getCountriesOption(signupStudent.countries, signupStudent.countryIdOfSchool)
						+'</select>'
					+'</div>'
				+'</div>';
			}
		return html;
}

function renderParentDetails(data){
	var signupParent = data.signupParent;
	var scriptExecuted1 = false;
	$('#signupStage2Content').html(getParentDetailsContent(data));
	if($('#learingProgramHeader').attr('val')=='ONE_TO_ONE_FLEX' ){
		$('#signupStage2 #workingProfession').val(signupParent.workingProfession);
		$('#signupStage2 #institutionCountryId').val(signupParent.institutionCountryId);
		createSelect2Element('signupStage2','workingProfession');
		createSelect2Element('signupStage2','institutionCountryId');
	}else{
		$("#relation").unbind('change').bind('change',function(){
			$('#relation').valid();
		});
		$("#signupStage2 #relation option[value='Other']").remove();
		autoSelectDropDownParentDetails(signupParent);
		createSelect2Element('signupStage2','pCountryId');
		createSelect2Element('signupStage2','pStateId');
		createSelect2Element('signupStage2','pCityId');
		createSelect2Element('signupStage2', 'relation')
		createSelect2Element('signupStage2', 'parentGender');
		if(!scriptExecuted1){
			inputParentPhone = document.querySelector("#parentPhoneNumber");
			itiParent = window.intlTelInput(inputParentPhone);
			if(signupParent.countryIsdCode2!=null && signupParent.countryIsdCode2!=''){
				itiParent.setCountry(signupParent.countryIsdCode2);
			}else{
				//itiParent.setCountry($("#pCountryId option:selected").attr('dail-country-code'));
			}
			inputParentPhone.addEventListener('countrychange', function(e) {
				$('#parentCountryIsd').val(itiParent.getSelectedCountryData().iso2);
				$('#parentCountryDailCode').val(itiParent.getSelectedCountryData().dialCode);
			});
			scriptExecuted1 = true
		}
		$("#parentFirstName").blur(function() {
			if ($("#signupStage2 #parentFirstName").val().trim()=="") {
				validEndInvalidField(null, "parentFirstName");
				//showMessage(0, 'First Name is required');
				return false
			}else{
				validEndInvalidField(true, "parentFirstName");
			}
		});
		$("#parentMiddletName").blur(function() {
			if ($("#signupStage2 #parentMiddletName").val().trim()=="") {
				validEndInvalidField(null, "parentMiddletName");
				return false
			}else{
				validEndInvalidField(true, "parentMiddletName");
			}
		});
		$("#parentlastName").blur(function() {
			if ($("#signupStage2 #parentlastName").val().trim()=="") {
				validEndInvalidField(null, "parentlastName");
				//showMessage(0, 'Last Name is required');
				return false
			}else{
				validEndInvalidField(true, "parentlastName");
			}
		});
		$("#relation").on("change", function() {
			if ($("#signupStage2 #relation").val()=="") {
				validEndInvalidField(null, "relation");
				//showMessage(0, 'Last Name is required');
				return false
			}else{
				validEndInvalidField(true, "relation");
			}
		});
		$("#parentEmailId").blur(function() {
			if ($("#signupStage2 #parentEmailId").val().trim()=="") {
				validEndInvalidField(null, "parentEmailId");
				return true
			}else if (!validateEmail($("#signupStage2 #parentEmailId").val().trim())) {
				//showMessage(false, 'Email is either empty or invalid');
				validEndInvalidField(false, "parentEmailId");
				return false
			}else{
				validEndInvalidField(true, "parentEmailId");
			}
		});
		$("#parentPhoneNumber").blur(function() {
			if ($("#signupStage2 #parentPhoneNumber").val().length < 5 && $("#signupStage2 #parentPhoneNumber").val().length > 0 ) {
				validEndInvalidField(false, "parentPhoneNumber");
				return false
			}
			if ($("#signupStage2 #parentPhoneNumber").val().trim()=="" || $("#signupStage2 #parentPhoneNumber").val().length == 0 ) {
				validEndInvalidField(null, "parentPhoneNumber");
				//showMessage(0, 'Gendar is required');
				return false
			}else{
				validEndInvalidField(true, "parentPhoneNumber");
			}
		});
	}

	$("#referralCode").blur(function() {
		if ($("#signupStage2 #referralCode").val().trim()=="") {
			validEndInvalidField(null, "referralCode");
			return true
		}else{
			validEndInvalidField(true, "referralCode");
		}
	});
	$("#pcModeWhatsapp").on("change", function(){
		if($("#signupStage2 #pcModeWhatsapp").is(":checked") || $("#signupStage2 #pcModeCall").is(":checked") || $("#signupStage2 #pcModeEmail").is(":checked")){
			validEndInvalidField(true, "pcModeWhatsapp");
			return true
		}else{
			validEndInvalidField(null, "pcModeWhatsapp");
			return false
		}
	});
	$("#pcModeCall").on("change", function(){
		if($("#signupStage2 #pcModeWhatsapp").is(":checked") || $("#signupStage2 #pcModeCall").is(":checked") || $("#signupStage2 #pcModeEmail").is(":checked")){
			validEndInvalidField(true, "pcModeWhatsapp");
			return true
		}else{
			validEndInvalidField(null, "pcModeWhatsapp");
			return false
		}
	});
	$("#pcModeEmail").on("change", function(){
		if($("#signupStage2 #pcModeWhatsapp").is(":checked") || $("#signupStage2 #pcModeCall").is(":checked") || $("#signupStage2 #pcModeEmail").is(":checked")){
			validEndInvalidField(true, "pcModeWhatsapp");
			return true
		}else{
			validEndInvalidField(null, "pcModeWhatsapp");
			return false
		}
	});
	
	var pMandatoryFields=[];
	var pNonMandatoryFields=[];
	if($('#learingProgramHeader').attr('val')=='ONE_TO_ONE_FLEX' ){
		if(signupParent.workingProfession!=''){
			pMandatoryFields.push('workingProfession');
		}
		if(signupParent.institutionName!=''){
			pMandatoryFields.push('institutionName');
		}
		if(signupParent.institutionCountryId!=''){
			pMandatoryFields.push('institutionCountryId');
		}
	}else{
		if(signupParent.firstName!=''){
			pMandatoryFields.push('parentFirstName');
		}
		if(signupParent.lastName!=''){
			pMandatoryFields.push('parentlastName');
		}
		if(signupParent.relationship!=''){
			pMandatoryFields.push('relation');
		}
		if(signupParent.countryId!=null && signupParent.countryId>0){
			pMandatoryFields.push('pCountryId');
		}
		if(signupParent.stateId!=null && signupParent.stateId>0){
			pMandatoryFields.push('pStateId');
		}
		if(signupParent.cityId!=null && signupParent.cityId>0){
			pMandatoryFields.push('pCityId');
		}
		if(signupParent.communicationWhatsApp!=''){
			pMandatoryFields.push('pcModeWhatsapp');
		}
		if(signupParent.communicationCall!=''){
			pMandatoryFields.push('pcModeCall');
		}
		if(signupParent.communicationEmail!=''){
			pMandatoryFields.push('pcModeEmail');
		}
		if(signupParent.middleName!=''){
			pNonMandatoryFields.push('parentMiddletName');
		}
		if(signupParent.email!=''){
			pNonMandatoryFields.push('parentEmailId');
		}
		if(signupParent.contactNumber!=''){
			pNonMandatoryFields.push('parentPhoneNumber');
		}
		if(signupParent.referralCode!=''){
			pNonMandatoryFields.push('referralCode');
		}
	}

	if(pMandatoryFields.length>0){
		formValdate('signupStage2', pMandatoryFields, []);
	}
	if(pNonMandatoryFields.length>0){
		formValdate('signupStage2', [], pNonMandatoryFields);
	}
	if($('#learingProgramHeader').attr('val')=='ONE_TO_ONE_FLEX' ){

	}else{
		$("#pCountryId").on("change",function(){
			var selectedCountry =  $('option:selected', this).attr("dail-country-code");
			if(selectedCountry != undefined && selectedCountry != ''){
				$('#pCountryId').valid();
				itiParent.setCountry(selectedCountry);
				callStates('signupStage2', this.value, 'pCountryId', 'pStateId', 'pCityId');
				$("#pCityId").html("<option value=''>Select City*</option>");
			}else{
				$("#pStateId").html("<option value=''>Select State/Province*</option>");
				$("#pCityId").html("<option value=''>Select City*</option>");
			}
			pCheckCSCValidation(selectedCountry, "pCountryId", "Country");
			pCheckCSCValidation("", "pStateId", "State/Province");
			pCheckCSCValidation("", "pCityId", "City");
			$("#signupStage2").valid()
		});
	
		$("#pStateId").on("change",function(){
			var selectedState =  $('option:selected', this).attr("value");
			$('#pStateId').valid();
			pCheckCSCValidation($("#signupStage2 #pStateId").val(), "pStateId", "State/Province");
			pCheckCSCValidation("", "pCityId", "City");
			callCities('signupStage2', this.value, 'pStateId', 'pCityId');
			if(selectedState == ''){
				$("#pCityId").html("<option value=''>Select City*</option>");
			}
			$('#pCityId').valid();
		});
		$("#pCityId").on("change",function(){
			if($('#pCityId').val() != undefined || $('#pCityId').val() != null){
				$('#pCityId').valid();
			}
			pCheckCSCValidation($("#signupStage2 #pCityId").val(), "pCityId", "pCityId");
		});
	}
}

function autoSelectDropDownParentDetails(signupParent){
	$('#signupStage2 #relation').val(signupParent.relationship);
	$('#signupStage2 #responsibleConfirm').val(signupParent.responsibleConfirm);

	$('#signupStage2 #pCountryId').val(signupParent.countryId);
	if(signupParent.countryId==null || signupParent.countryId==''){
		$('#signupStage2 #pCountryId').attr('disabled',false);
	}
	if(signupParent.stateId==null || signupParent.stateId==''){
		$('#signupStage2 #pStateId').val(signupParent.stateId);
	}
	if(signupParent.cityId==null || signupParent.cityId==''){
		$('#signupStage2 #pCityId').val(signupParent.cityId);
	}
	if($('#countryId').val() == $('#pCountryId').val() && $('#stateId').val() == $('#pStateId').val() && $('#cityId').val() == $('#pCityId').val()){
		$('#signupStage2 #sameAsStudentLocation').prop('checked',true);
		$('#signupStage2 #pCountryId').prop('disabled',true);
		$('#signupStage2 #pStateId').prop('disabled',true);
		$('#signupStage2 #pCityId').prop('disabled',true);
	}
}

function getParentDetailsContent(data){
	var tabindex=30;
	var signupParent = data.signupParent;
	var courseProviderId=$('#courseProviderId').val();
	var hideClass='';
	if(courseProviderId==39){
		hideClass='hide';
	}
	var html ='';
	var parentHeaderLabel='';
	if(courseProviderId==39){
		parentHeaderLabel='Communication Details';
	}else{
		if($('#learingProgramHeader').attr('val')=='ONE_TO_ONE_FLEX'){
			parentHeaderLabel='Academic & Communication Details';
		}else{
			parentHeaderLabel='Parent / Guardian Details';
		}
	}
	html+='<h3 class="alternate-txt-color">'+parentHeaderLabel+'</h3>'
	+'<input type="hidden" id="studentId" value="'+data.studentId+'">';
	if($('#learingProgramHeader').attr('val')=='ONE_TO_ONE_FLEX' ){
		html+=
		'<div class="form-row">'
			+'<div class="form-holder valid-field">'
				+'<i class="zmdi zmdi-account"></i>'
				+'<select name="workingProfession" id="workingProfession" class="form-control-field" required  tabindex="'+(++tabindex)+'">'
					+'<option value="" disabled selected>Are you a student or a working professional?*</option>'
					+'<option value="SS">School Student</option>'
					+'<option value="CS">College Student</option>'
					+'<option value="WP">Working Professional</option>'
				+'</select>'
			+'</div>'
			+'<div class="form-holder valid-field">'
				+'<i class="zmdi zmdi-account"></i>'
				+'<input type="text" name="institutionName" id="institutionName" class="form-control-field" value="'+signupParent.institutionName	+'" placeholder="Name of the School/College/Organization*" tabindex="'+(++tabindex)+'">'
			+'</div>'
			+'<div class="form-holder valid-field">'
				+'<i class="zmdi zmdi-pin"></i>'
				+'<select name="institutionCountryId" id="institutionCountryId" class="form-control-field" required  tabindex="'+(++tabindex)+'">'
					+'<option value="0" disabled selected>Country of the School/College/Organization*</option>' 
					+getCountriesOption(signupParent.countries, signupParent.countryId)
				+'</select>'
			+'</div>'
			+'</div>';
	}else{
		html+=
		'<input type="hidden" id="parentCountryIsd" value="'+signupParent.countryIsdCode2+'">'
		+'<input type="hidden" id="parentCountryDailCode" value="'+signupParent.countryCode+'">'
		+'<div class="form-row '+hideClass+'">'
			+'<div class="form-holder valid-field">'
				+'<i class="zmdi zmdi-account"></i>'
				+'<input type="text" class="form-control-field" style="text-transform:capitalize" name="parentFirstName" id="parentFirstName"  value="'+signupParent.firstName+'" maxlength="40"  onkeydown="return M.isChars(event);" placeholder="First Name*" tabindex="'+(++tabindex)+'">'
			+'</div>'
			+'<div class="form-holder valid-field">'
				+'<i class="zmdi zmdi-account"></i>'
				+'<input type="text" class="form-control-field" style="text-transform:capitalize" name="parentMiddletName" id="parentMiddletName"  name="parentMiddletName" value="'+signupParent.middleName+'" maxlength="40"  onkeydown="return M.isChars(event);" placeholder="Middle Name" tabindex="'+(++tabindex)+'">'
			+'</div>'
			+'<div class="form-holder valid-field">'
				+'<i class="zmdi zmdi-account"></i>'
				+'<input type="text" class="form-control-field" style="text-transform:capitalize" name="parentlastName" id="parentlastName" name="parentlastName" value="'+signupParent.lastName+'" maxlength="40"  onkeydown="return M.isChars(event);" placeholder="Last Name*" tabindex="'+(++tabindex)+'">'
			+'</div>'
		+'</div>'
		+'<div class="form-row '+hideClass+'">'
			+'<div class="form-holder valid-field">'
				+'<i class="zmdi zmdi-map"></i>'
				+'<select name="relation" id="relation" required tabindex="15">'
					+getRelationshipContent()
				+'</select>'
			+'</div>'
			+'<div class="form-holder valid-field bottom-error-message">'
				+'<i class="zmdi zmdi-email"></i>'
				+'<i class="zmdi zmdi-check-circle verified-mail-id"></i>'
				+'<input type="email" class="form-control-field parent-email" id="parentEmailId" name="parentEmailId" placeholder="Parent Email (Optional)" value="'+signupParent.email+'" autocomplete="off" tabindex="'+(++tabindex)+'" >'
				+'<a href="javascript:void(0)" class="input-over-btn send-mail-btn primary-bg white-txt-color" onclick="resendOtp();">Verify Mail</a>'
			+'</div>'
			+'<div class="form-holder valid-field bottom-error-message">'
				+'<i class="zmdi zmdi-smartphone-android"></i>'
				+'<input type="tel" class="form-control-field parent-phone" name="parentPhoneNumber" id="parentPhoneNumber" maxlength="15" placeholder="Parent Phone Number (Optional)" value="'+signupParent.contactNumber+'" autocomplete="off" onkeydown="return M.digit(event);" tabindex="'+(++tabindex)+'">'
			+'</div>'
		+'</div>'
		+'<div class="form-row m-0 '+hideClass+'">'
			+'<strong>Parent\'s Current Location</strong>'
		+'</div>'
		+'<div class="form-row mb-2 '+hideClass+'">'
			+'<label for="sameAsStudentLocation" class="f-13">'
				+'<input id="sameAsStudentLocation" class="m-0" tabindex="'+(++tabindex)+'" type="checkbox" onclick="addressSameAs()" />'
				+' Same as student location'
			+'</label>'
		+'</div>'
		+'<div class="form-row '+hideClass+'">'
			+'<div class="form-holder valid-field">'
				+'<i class="zmdi zmdi-pin"></i>'
				+'<select name="pCountryId" id="pCountryId" tabindex="'+(++tabindex)+'">'
					+'<option value="">Select Country*</option>'
					+getCountriesOption(signupParent.countries, signupParent.countryId)
				+'</select>'
			+'</div>'
			+'<div class="form-holder valid-field">'
				+'<i class="zmdi zmdi-pin"></i>'
				+'<select name="pStateId" id="pStateId"   tabindex="'+(++tabindex)+'">'
					+'<option value="">Select State/Province*</option>'
					+getStatesOption(signupParent.states, signupParent.stateId)
				+'</select>'
			+'</div>'
			+'<div class="form-holder valid-field">'
				+'<i class="zmdi zmdi-pin"></i>'
				+'<select name="pCityId" id="pCityId"  tabindex="'+(++tabindex)+'">'
					+'<option value="">Select City*</option>'
					+getCitiesOption(signupParent.cities, signupParent.cityId)
				+'</select>'
			+'</div>'
		+'</div>';
	}
	html+=	
	'<div class="form-row m-0 justify-content-center">';
		if(courseProviderId!=39){
			// html+='<div class="form-holder valid-field '+hideClass+'">'
			// 	+'<input type="text" class="form-control-field" name="referralCode" id="referralCode" placeholder="Referral Code (Optional)" value="'+signupParent.referralCode+'" tabindex="'+(++tabindex)+'">'
			// +'</div>'
			// +'<div class="form-holder mb-0" style="height: 0px;">&nbsp;</div>';
		}
		html+='<div class="form-holder text-center" style="width:100%">'
			+'<strong>Your Preferred Communication&nbsp;</strong>'
			+'<b>(You may choose more than one)</b>'
			+'<div>'
				+'<label class="cursor communication-mode text-dark valid-field" for="pcModeWhatsapp">'
					+'<input id="pcModeWhatsapp" name="pcModeWhatsapp" type="checkbox" value="whatsapp" '+(signupParent.communicationWhatsApp=='Y'?'checked':'')+' tabindex="'+(++tabindex)+'">'
					+'<span>WhatsApp</span> '
					+'<img src="'+PATH_FOLDER_IMAGE+'watsapp-icon.png" width="16px" />'
				+'</label>'
				+'<label class="cursor communication-mode text-dark" for="pcModeCall">'
					+'<input id="pcModeCall" name="pcModeCall" type="checkbox" value="call" '+(signupParent.communicationCall=='Y'?'checked':'')+' tabindex="'+(++tabindex)+'">'
					+'<span>Call</span><i class="fa fa-phone"></i>'
				+'</label>'
				+'<label class="cursor communication-mode text-dark" for="pcModeEmail">'
					+'<input id="pcModeEmail" name="pcModeEmail" type="checkbox" value="email" '+(signupParent.communicationEmail=='Y'?'checked':'')+' tabindex="'+(++tabindex)+'">'
					+'<span>Email</span><i class="fa fa-envelope"></i>'
				+'</label>'
			+'</div>'
		+'</div>'
	+'</div>';
	return html;
		
}

function renderCourseSelectionContent(csr){
	$('#signupStage3Content').html(getCourseSelectionContent(csr));
	if($('#learingProgramHeader').attr('val')=='ONE_TO_ONE_FLEX' ){
		$('#gradeId').val(csr.standardId);
	}
	$('[data-toggle="tooltip"]').tooltip({
		html: true
	});
	$('[data-toggle="tooltip"]').on('show.bs.tooltip', function () {
        $(".form-row .form-holder.selected-course-view").css({"overflow-x":"visible"});
	});
	$('[data-toggle="tooltip"]').on('hide.bs.tooltip', function () {
        $(".form-row .form-holder.selected-course-view").css({"overflow-x":"hidden"});
	});
	var mandatoryCount=0;
	var totalSelectedCourseCount=csr.selectedSubjects!=null?csr.selectedSubjects.length:0;
	$.each(csr.selectedSubjects, function(k, courseDetails) {
		if(courseDetails.courseTypeOriginal == 'Advanced Placement'){
			apCourseSelectionFlag=true;
		}
		if(courseDetails.courseMandatory==1){
			mandatoryCount++;
		}
	});
	if(totalSelectedCourseCount==mandatoryCount){
		$('.removeAllCourses').hide()
	}
	setTimeout(function(){
		removeSlideAnimationClass();
	},1500);

	
$('.accordion .a-title').unbind().bind('click', function(){
	$(this).parent().closest('li').find('.a-content').stop().slideToggle();
	$(this).find('.plus-icon').toggleClass('fa-minus fa-plus')
	$(this).parent().closest('li').siblings().find('.plus-icon').removeClass('fa-plus');
	$(this).parent().closest('li').siblings().find('.plus-icon').removeClass('fa-minus');
	$(this).parent().closest('li').siblings().find('.a-content').slideUp();
});

$('.custom-tab-wrapper li a:not(:first)').addClass('inactive');
$('.custom-tab-item').hide();
$('.custom-tab-item:first').show();
$('.custom-tab-wrapper li a').unbind().bind('click', function(){
	var tabID = $(this).attr('id'), tabFullForm = $(this).attr('full-form')
	if ($(this).hasClass('inactive')) {
		$('.custom-tab-wrapper li a').addClass('inactive');
		$('.custom-tab-wrapper li').removeClass('active-tab');
		$(this).removeClass('inactive')
		$(this).parent().addClass('active-tab')

		$('.custom-tab-item').hide();
		$('#' + tabID + 'C').slideDown('slow');
		$('.accordion li:first-child .a-content').show();
	}
});
// $(".course-radio-btn-wrapper ul li").unbind().bind('click', function(){
// 	if($('.course-radio-btn-wrapper ul li input').is(":checked", true) ){
// 		$(this).parent().parent().removeClass('deactive-course-selection')
// 	}
// })

$("#noTeacherAssistanceAvailableNo").on("click", function(){
	$(".course-check-box input").prop("checked", false);
});

$('.course-name').click(function(){
	if($(this).hasClass('open-dropdown')){
		$(this).parent().css({"border-color":"#dcdcdc"});
		$(this).parent().parent().css({"border-color":"#dcdcdc"});
		$(this).parent().parent().siblings().find('.bg-border').css({"border-color":"#e6d7fb", "background":"transparent"});
		$(this).parent().parent().siblings().css({"border-color":"#e6d7fb"});
		// $('.course-radio-btn-wrapper').parent().find(".course-name a").css({"color":"#333"});
	}
	else{
		$(this).parent().css({"border-color":"#e6d7fb"});
		$(this).parent().parent().css({"border-color":"#e6d7fb"});
	}
	// if($(this).parent().parent().find('.course-radio-btn-wrapper').hasClass('open')){
	// 	$('.course-radio-btn-wrapper.open').parent().find(".course-name a").css({"color":"#333"});
	// 	$('.course-radio-btn-wrapper.open').parent().find('.bg-border').css({"background":"#dcdcdc"});
	// 	$('.course-radio-btn-wrapper.open').parent().siblings().find('.course-check-box input').prop("checked", false);
	// }else{
	// 	$('.course-radio-btn-wrapper').parent().find(".course-name a").css({"color":"#333"});	
	// }
});
// $('.course-radio-btn-wrapper.open').parent().find(".course-name a").css({"color":"#333"});
// $('.course-radio-btn-wrapper.open').parent().find('.bg-border').css({"background":"#dcdcdc"});
// $('.course-radio-btn-wrapper.open').parent().css({"border-color":"#dcdcdc"});

}

function getCourseSelectionContent(csr){
	var html='';
	if(csr.standardId!=8){
	}
	html+=
	'<h3 class="mb-1 select-grade-title">';
		if(csr.courseProviderId == 39){
			html+='<span class="alternate-txt-color">YOUR COURSES FOR</span>';
		}else{
			if(csr.registrationType == 'BATCH'){
				html+='<span class="alternate-txt-color">YOUR COURSES FOR</span>';
			}else{
				html+='<span class="alternate-txt-color">COURSE SELECTION FOR</span>';
			}
		}
		if(csr.courseProviderId == 39){
			html+=
			'<span class="change-grade primary-bg" data-toggle="tooltip" title="Change selected grade">';
				var learningLabel='Basic | Beginner';
				if(csr.standardId>=1 && csr.standardId<=3){
					learningLabel='Middle | Intermediate'
				}else if(csr.standardId>=4 && csr.standardId<=7){
					learningLabel='Pro | Advanced'
				}else if(csr.standardId>=11 && csr.standardId<=16){
					learningLabel='Basic | Beginner'
				}
			html+= learningLabel
			+'</span>';
		}else{
			if($('#learingProgramHeader').attr('val')=='ONE_TO_ONE_FLEX' ){
				html+=
					'<div class="form-holder valid-field" style="margin-left:5px">'
					+'<i class="zmdi zmdi-book"></i>'
					+'<select name="gradeId" id="gradeId" class="form-control-field" onchange="switchGrade()" style="width:250px;height:28px;line-height:20px">'
						+'<option value="">Select Grade</option>'
						+getStandardContentForFlexy()
					+'</select>'
				+'</div>';
			}else{
				var grade = csr.standardName.split(" ");
				grade = grade[1];
				html+=
				'<span class="alternate-txt-color">&nbsp;'+csr.standardName+'</span>'
				+'<span class="change-grade primary-bg" onclick="changeSelectedGrade()">'
					+'Change Grade <i class="fa fa-exchange" aria-hidden="true"></i>'
				+'</span>';
			}
		}	
		html+=
	'</h3>';
	if(csr.standardId!=null && csr.standardId>0){
		html+=
		'<div id="courseSubjectDetails">'
		+'<input type="hidden" id="standardId" name="standardId" value="'+csr.standardId+'" min_limit="'+csr.minCourseLimit+'" max_limit="'+csr.maxCourseLimit+'" upper_band="'+csr.upperBandLimit+'">'
		+'<input type="hidden" id="selectedSubjects" name="selectedSubjects" value="'+csr.selectedSubjectsAsString+'">'
		+'<input type="hidden" id="payMode" name="payMode" value="'+csr.paymentMode+'" data-paymode="'+csr.paymentMode+'">'
		+'<input type="hidden" id="controlType" name="controlType" value="">'
		+'<input type="hidden" id="totalCreditInput" name="totalCreditInput" value="'+csr.totalCredit+'">';
		+'<input type="hidden" id="enrollmentType" name="enrollmentType" value="'+csr.enrollmentType+'">'
		+'<input type="hidden" id="registrationType" name="registrationType" value="'+csr.registrationType+'">'
		// +'<input type="hidden" id="courseProviderId" name="courseProviderId" value="'+csr.courseProviderId+'">'
		
			// if(csr.standardId<11 || csr.standardId<9 || csr.standardId<10 || csr.standardId<19 || csr.standardId<20 || csr.standardId<21){
				if(csr.courseProviderId==39){

				}else{
					if(csr.minCourseLimit>csr.totalCredit){
						html+=
						'<div class="" style="margin-bottom:0px">'+
							'<div class="form-holder w-100 selected-course-view">';
								var labelHtml='';
								if(csr.minCourseLimit>csr.totalCredit){
									labelHtml+='YOU NEED A MINIMUM OF '+csr.minCourseLimit+' CREDITS';
								}
								if(labelHtml!=''){
									html+=
									'<div class="full">'
										+'<h3 class="use-credit white-txt-color alternate-bg">'
											+labelHtml
										'</h3>'
									+'</div>';
								}
							html+=
							'</div>'
						+'</div>';
					}
				}
			// }
			
			if(csr.requiredFixedCourses){
				html+=
				'<div class="course-img-wrapper" style="min-height:275px;">'
					+'<div class="form-row" style="justify-content: space-between;">';
						html+='<div class="form-holder selected-course-view" style="width:100%">'
							+'<div class="fixed-item full">'
								+'<div class="full selected-course primary-bg primary-border-color head">'
									+'<h4 id="totalCredit" totalCredit="'+csr.totalCredit+'" class="title angle-arrow primary-bg white-txt-color">';
										if(csr.selectedSubjects!=null && csr.selectedSubjects.length>0){
											if(csr.registrationType=='BATCH' || csr.courseProviderId == 39){
												html+=csr.selectedSubjects.length;
												html+=' Mandatory / Fixed ';
												if(csr.selectedSubjects.length>1){
													html+=' Courses worth '+csr.totalCredit+' credits';
												}else{
													html+=' Course worth '+csr.totalCredit+' credit';
												}
												
											}else{
												html+='You have '+csr.selectedSubjects.length;
												if(csr.selectedSubjects.length>1){
													html+=' Courses worth '+csr.totalCredit+' credits';
												}else{
													html+=' Course worth '+csr.totalCredit+' credit';
												}
											}
										}else{
											html+='Please select a course';
										}
									html+=
									'</h4>';
									// 
									// if(csr.selectedSubjects!=null && csr.selectedSubjects.length>0){
									// 	html+='<span class="removeAllCourses" title="Remove All Selected Courses" onclick="removeAllCourseWarning()">Remove ALL&nbsp;<i class="fa fa-trash"></i></span>';
									// }
								html+='</div>'
								+'<div class="full selected-course-view">'
									+'<div class="selected-course primary-border-color">'
										+'<div class="selected-course-list">';
											if(csr.selectedSubjects!=null && csr.selectedSubjects.length>0){
												html+=
												'<div class="course-category">';
													$.each(csr.selectedSubjects, function(k, courseDetails) {
														html+=
														'<div class="course-item'+(csr.controlType=="add" && csr.lastCourseId == courseDetails.courseId?' slide-animation':'')+'" seletedSubject="'+courseDetails.courseId+'">'
															+'<span class="count">'+(k+1)+'.&nbsp;</span>'
															+'<div class="selected_course_name">'
																+'<div class="course-icon"></div>'
																+'<div class="course-name-wrapper">'
																	+'<h4 class="course-name">'
																		+ courseDetails.courseName + ' (' + courseDetails.creditScore + ' Credit) '
																		+'<span class="price">'
																			+' <b>';
																				if(csr.showCourseFee =='Y'){
																					html+=courseDetails.coursePriceSelectedString;
																				}
																				html+=
																			'</b>'
																		+'</span>'
																	+'</h4>'
																+'</div>'
																+'<div class="add-course-btn">'
																	// +'<span class="white-txt-color mr-1"><i class="fa fa-check"></i></span>';
																	if(courseDetails.upgradeCourses!=null && courseDetails.upgradeCourses.length>0){
																		$.each(courseDetails.upgradeCourses, function(k, upgradeCourse) {
																			html+=
																			'<span class="1 remove-icon upgradeCourses primary-txt-color"';
																				if(upgradeCourse.warningMessage==''){
																					html+='onclick="confirmUpgradeCourse('+courseDetails.categoryId+','+courseDetails.courseId+','+upgradeCourse.courseId+')">';
																				}else{
																					html+='onclick="upgradeCourse('+courseDetails.categoryId+','+courseDetails.courseId+','+upgradeCourse.courseId+',\''+upgradeCourse.warningMessage+'\')">';
																				}
																				html+=upgradeCourse.buttonLabel;
																				if(courseDetails.courseTypeOriginal == 'Regular'){
																					html+=' <i class="fa fa-arrow-up" title="'+upgradeCourse.buttonLabel+'"></i>';
																				}else{
																					html+=' <i class="fa fa-arrow-down" title="'+upgradeCourse.buttonLabel+'"></i>';
																				}
																			html+=
																			'</span>';
																			if(upgradeCourse.courseType == "ADV"){
																				html+='<span class="alternate-txt-color white-bg upgradeCourses" style="display:inline-block;border-radius:4px;" data-toggle="tooltip" title="Advanced courses have more assessments & assignments as compared to regular courses and contribute to a higher GPA."><i class="fa fa-info-circle m-0"></i></span>';
																			}else if(upgradeCourse.courseType == "HON"){
																				html+='<span class="alternate-txt-color white-bg upgradeCourses" style="display:inline-block;border-radius:4px;" data-toggle="tooltip" title="Honors courses have more assessments & assignments as compared to regular courses and contribute to a higher GPA."><i class="fa fa-info-circle m-0"></i></span>';
																			};
																		});
																	}
																	
																	if(courseDetails.courseDescriptionUrl != null && courseDetails.courseDescriptionUrl!=''){
																		//html+='<a href="'+courseDetails.courseDescriptionUrl+'" target="_blank" class="white-txt-color" style="font-weight:400;text-decoration:underline;display:inline-block;padding:0px 5px;font-size:13px">View Course Details</a>';
																		html+=`<a href="javaScript:void(0);" onclick="openCourseDetailModal('`+courseDetails.courseDescriptionUrl+`', '`+courseDetails.courseName+`')" class="white-txt-color" style="font-weight:400;text-decoration:underline;display:inline-block;padding:0px 5px;font-size:13px">Course Summary</a>`;
																	}
																html+=
																'</div>'
															+'</div>'
														+'</div>';
													});
												html+=
													'<div id="addAndRemoveLoader" class="loader-bg" style="display: none;">'
														+'<div class="loader">Please Wait... <span></span></div>'
													+'</div>'
												+'</div>';
												if(csr.courseMaterialFeeDetails!=null && csr.courseMaterialFeeDetails.totalEntityFee>0){
													html+=
													'<div class="course-category">'
														+'<span class="category-name">External Material Fee</span>'
														+'<div class="course-item">'
															+'<div class="course-name-wrapper" id="totalEntityFee">';
															$.each(csr.courseMaterialFeeDetails.description, function(k, desc) {
																html+=
																'<h4 class="course-name">'
																	+desc
																+'</h4>';
															});
															html+=
															'</div>'
														+'</div>'
														+'<div class="course-item">'
															+'<div class="course-name-wrapper">'
																+'<h4 class="course-name">External Material Fee: <span class="price"> '+csr.courseMaterialFeeDetails.totalEntityFeeString+'</span></h4>'
															+'</div>'
														+'</div>'
													+'</div>';
												}
											}
										html+=
										'</div>'
									+'</div>'
								+'</div>'
							+'</div>'
						+'</div>'		
					+'</div>'
				+'</div>';
			}else {
				html+=
				'<div class="course-selection-wrapper" style="min-height:275px; display:'+((csr.requiredFixedCourses)?"none;":"block;")+'">'
					+'<div class="form-row" style="justify-content: space-between;">';
						//+'<div class="form-holder selected-course-view">'
							if(csr.registrationType !='BATCH' && csr.courseProviderId != 39){
								html+='<div class="form-holder selected-course-view">';
							}else{
								html+='<div class="form-holder selected-course-view" style="width:100%">';
							}
							html+='<div class="fixed-item full">'
								+'<div class="full selected-course primary-bg primary-border-color head">'
									+'<h4 id="totalCredit" totalCredit="'+csr.totalCredit+'" class="title angle-arrow primary-bg white-txt-color">';
										if(csr.selectedSubjects!=null && csr.selectedSubjects.length>0){
											if(csr.registrationType=='BATCH' || csr.courseProviderId == 39){
												html+=csr.selectedSubjects.length;
												html+=' Mandatory / Fixed ';
												if(csr.selectedSubjects.length>1){
													html+=' Courses worth '+csr.totalCredit+' credits';
												}else{
													html+=' Course worth '+csr.totalCredit+' credit';
												}
											}else{
												html+='You have '+csr.selectedSubjects.length;
												if(csr.selectedSubjects.length>1){
													html+=' Courses worth '+csr.totalCredit+' credits';
												}else{
													html+=' Course worth '+csr.totalCredit+' credit';
												}
											}
										}else{
											html+='Please select a course';
										}
									html+=
									'</h4>';
									if(csr.selectedSubjects!=null && csr.selectedSubjects.length>0){
										html+='<span class="removeAllCourses" title="Remove All Selected Courses" onclick="removeAllCourseWarning()">Remove ALL&nbsp;<i class="fa fa-trash"></i></span>';
									}
								html+=
								'</div>'
								+'<div class="full selected-course-view">'
									+'<div class="selected-course primary-border-color">'
										+'<div class="selected-course-list">';
											if(csr.selectedSubjects!=null && csr.selectedSubjects.length>0){
												html+=
												'<div class="course-category">';
													$.each(csr.selectedSubjects, function(k, courseDetails) {
														html+=
														'<div class="course-item'+(csr.controlType=="add" && csr.lastCourseId == courseDetails.courseId?' slide-animation':'')+'" seletedSubject="'+courseDetails.courseId+'">'
															+'<span class="count">'+(k+1)+'.&nbsp;</span>'
															+'<div class="selected_course_name">'
																+'<div class="course-icon"></div>'
																+'<div class="course-name-wrapper">'
																	+'<h4 class="course-name">'
																		+ courseDetails.courseName + ' (' + courseDetails.creditScore + ' Credit) '
																		+'<span class="price">'
																			+' <b class="ml-3">';
																				if(csr.showCourseFee =='Y'){
																					html+=courseDetails.coursePriceSelectedString;
																				}
																				html+=
																			'</b>'
																		+'</span>'
																	+'</h4>'
																+'</div>'
																+'<div class="add-course-btn">';
																	// +'<span class="white-txt-color mr-1"><i class="fa fa-check"></i></span>';
																	if(courseDetails.upgradeCourses!=null && courseDetails.upgradeCourses.length>0){
																		$.each(courseDetails.upgradeCourses, function(k, upgradeCourse) {
																			html+=
																			'<span class="remove-icon upgradeCourses primary-txt-color"';
																				if(upgradeCourse.warningMessage==''){
																					html+='onclick="confirmUpgradeCourse('+courseDetails.categoryId+','+courseDetails.courseId+','+upgradeCourse.courseId+')">';
																				}else{
																					html+='onclick="upgradeCourse('+courseDetails.categoryId+','+courseDetails.courseId+','+upgradeCourse.courseId+',\''+upgradeCourse.warningMessage+'\')">';
																				}
																				html+=upgradeCourse.buttonLabel;
																				if(courseDetails.courseTypeOriginal == 'Regular'){
																					html+=' <i class="fa fa-arrow-up" title="'+upgradeCourse.buttonLabel+'"></i>';
																				}else{
																					html+=' <i class="fa fa-arrow-down" title="'+upgradeCourse.buttonLabel+'"></i>';
																				}
																			html+=
																			'</span>';
																			if(upgradeCourse.courseType == "ADV"){
																				html+='<span class="alternate-txt-color white-bg upgradeCourses" style="display:inline-block;border-radius:4px;" data-toggle="tooltip" title="Advanced courses have more assessments & assignments as compared to regular courses and contribute to a higher GPA."><i class="fa fa-info-circle m-0"></i></span>';
																			}else if(upgradeCourse.courseType == "HON"){
																				html+='<span class="alternate-txt-color white-bg upgradeCourses" style="display:inline-block;border-radius:4px;" data-toggle="tooltip" title="Honors courses have more assessments & assignments as compared to regular courses and contribute to a higher GPA."><i class="fa fa-info-circle m-0"></i></span>';
																			};
																		});
																	}
																	if(courseDetails.courseMandatory==1){
																		if(csr.registrationType != 'BATCH' && csr.courseProviderId != 39){
																			html+= '<span class="mandatory-btn">Mandatory</span>';
																		}else{
																			// if(courseDetails.courseDescriptionUrl!=null && courseDetails.courseDescriptionUrl!=''){
																				// html+='<a href="'+courseDetails.courseDescriptionUrl+'" target="_blank" class="white-txt-color" style="font-weight:400;text-decoration:underline;display:inline-block;padding:0px 5px;font-size:13px">View Course Details</a>';
																			// }
																			if(courseDetails.courseDescriptionUrl!=null && courseDetails.courseDescriptionUrl!=''){
																				// html+='<a href="'+courseDetails.courseDescriptionUrl+'" target="_blank" class="white-txt-color" style="font-weight:400;text-decoration:underline;display:inline-block;padding:0px 5px;font-size:13px">View Course Details</a>';
																				html+=`<a href="javaScript:void(0);" onclick="openCourseDetailModal('`+courseDetails.courseDescriptionUrl+`', '`+courseDetails.courseName+`')" class="white-txt-color" style="font-weight:400;text-decoration:underline;display:inline-block;padding:0px 5px;font-size:13px">Course Summary</a>`;
																			}
																		}
																	}else if(courseDetails.courseMandatory==0){
																		html+= '<span class="remove-icon removeAllCourses" onclick="removeCourse(\''+courseDetails.courseId+'\',\''+courseDetails.categoryId+'\',\'ft_courses\')">Remove <i class="fa fa-trash" title="Remove Course"></i></span>';
																	}
																html+=
																'</div>'
															+'</div>'
														+'</div>';
													});
												html+=
													'<div id="addAndRemoveLoader" class="loader-bg" style="display: none;">'
														+'<div class="loader">Please Wait... <span></span></div>'
													+'</div>'
												+'</div>';
												if(csr.courseMaterialFeeDetails!=null && csr.courseMaterialFeeDetails.totalEntityFee>0){
													html+=
													'<div class="course-category">'
														+'<span class="category-name">External Material Fee</span>'
														+'<div class="course-item">'
															+'<div class="course-name-wrapper" id="totalEntityFee">';
															$.each(csr.courseMaterialFeeDetails.description, function(k, desc) {
																html+=
																'<h4 class="course-name">'
																	+desc
																+'</h4>';
															});
															html+=
															'</div>'
														+'</div>'
														+'<div class="course-item">'
															+'<div class="course-name-wrapper">'
																+'<h4 class="course-name">External Material Fee: <span class="price"> '+csr.courseMaterialFeeDetails.totalEntityFeeString+'</span></h4>'
															+'</div>'
														+'</div>'
													+'</div>';
												}
											}
										html+=
										'</div>'
									+'</div>'
								+'</div>'
							+'</div>'
						+'</div>';
						var availeCourseForSelection=false;
						$.each(csr.availableCourses, function(availableCoursesLoop, courseDetails) {
							if(courseDetails.subjects.length>0){
								availeCourseForSelection=true;
							}
						});
						if(availeCourseForSelection){
							html+=
							'<div class="form-holder course-selection-list">'
								+'<ul class="custom-tab-wrapper">'
									+'<li class="active-tab primary-bg white-txt-color">'
										+'<a href="javascript:void(0)" id="ft_courses">'
											+'<label class="full_form">';
											if(csr.minCourseLimit>csr.totalCredit){
												if(csr.maxCourseLimit-csr.totalCredit <= 1){
													html+='PLEASE SELECT A COURSE ';
												}else{
													html+='PLEASE SELECT COURSES ';
												}
												if(csr.totalCredit<csr.maxCourseLimit){
													if(csr.totalCredit==0){
														html+='WORTH '+(csr.minCourseLimit);
													}else{
														html+='WORTH '+(csr.maxCourseLimit-csr.totalCredit);
													}
												}
												if(csr.maxCourseLimit-csr.totalCredit <= 1){
													html+=' CREDIT';
												}else{
													html+=' CREDITS';
												}
											}else{
												html+='SELECT EXTRA COURSES';
											}
											html+='<br>'
												+'<span style="font-size:12px">';
													if(csr.registrationType == 'SCHOLARSHIP'){
														html+=
														'(PLEASE NOTE - LIVE CLASSES ARE NOT OFFERED IN THIS PROGRAM)';
													}
													
												html+='</span>'
											+'</label>';
											if(csr.eligibleForRecommendedCourse){
												html+='<button class="btn white-bg primary-txt-color pull-right" style="margin:0px;font-weight:bold;padding:4px !important;text-transform:capitalize;box-shadow:0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.70);font-size:13px" onclick="recommendedCourse()">Add Recommended Courses</button>'
											}
										html+=
										'</a>'
									+'</li>'
								+'</ul>'
								+'<div id="ft_coursesC" class="full-time-courses custom-tab-item">'
									+'<div class="course-selection-list">'
										+'<ul class="accordion">';
											$.each(csr.availableCourses, function(availableCoursesLoop, courseDetails) {
												if(courseDetails.subjects.length>0){
													html+=
													'<li>'
														+'<div class="student-details-info">'
															+'<div class="full">'
																+'<h4 id="'+(availableCoursesLoop+1)+'" class="a-title courseSelectId-'+courseDetails.courseId+'" courseCreditLimit="'+courseDetails.courseCreditLimit+'" parentSubjectId="'+courseDetails.parentSubjectId+'">'
																	+courseDetails.courseName;
																	if(courseDetails.courseDescription!=null && courseDetails.courseDescription!=''){
																		html+='<i class="fa fa-info-circle" data-toggle="tooltip" title="'+courseDetails.courseDescription+'"></i>';
																	}
																	html+=
																	'<i class="fa plus-icon fa-angle-down primary-txt-color"></i>'
																+'</h4>'
															+'</div>'
															+'<div class="a-content'+(courseDetails.subjects>6?'overflow-auto':'')+'">';
																$.each(courseDetails.subjects, function(loop1, subject) {
																	html+=
																	'<div class="course-item border-around theme-border">'
																		+'<div class="course-icon"><i class="fa fa-book"></i></div>'
																			+'<div class="course-name-wrapper bg-border">'
																				+'<h4 class="course-name open-dropdown">'
																					+'<div  style="margin-right:auto">'
																						+'<label id="course_name_'+subject.subjectId+'" for="course_id_'+subject.subjectId+'" class="m-0 course-type-title primary-txt-color">'
																							+subject.subjectName
																						+'</label>'
																						+'<ul class="no-teacher">';
																							if(subject.remarks == '0' && csr.registrationType != 'SCHOLARSHIP'){
																								html+='<li style="float:none;">&#8226; This course does not offer live classes</li>';
																							}
																							if(SHOW_PAYMENT_OPTION=='Y'){
																								if(subject.materialFee >0 ){
																									html+='<li style="float:none;">&#8226; '+subject.materialFeeString+' extra for External Materials.</li>';
																								}
																								if($('#learingProgramHeader').attr('val')!='ONE_TO_ONE_FLEX'){
																									if(subject.additionalFee !=null && subject.additionalFee > 0){
																										var creditsLimitsOver=creditLimitOver(csr.standardId, csr.totalCredit);
																										if(creditsLimitsOver){
																											html+='<li style="float:none;">&#8226; '+subject.subjectPriceString+' extra for '+subject.courseType+' Courses.</li>';
																										}else{
																											html+='<li style="float:none;">&#8226; '+subject.additionalFeeString+' extra for '+subject.courseType+' Courses.</li>';
																										}
																									}
																								}
																							}
																						html+=
																						'</ul>'
																					+'</div>'
																					+'<div style="display: flex;flex-direction: column;justify-content: center;align-items: center;width: 15%;text-align: center;">'
																						+'<label class="m-0 course-type-title primary-txt-color pull-right">';
																							if(csr.showCourseFee =='Y'){
																								html+=`<p>`+subject.subjectPriceString+`</p>`;
																							}
																							html+=
																							subject.subjectCredit+' Credit&nbsp;'
																						+'</label>';
																						if(subject.courseDescriptionUrl!=null && subject.courseDescriptionUrl!=''){
																							html+=`<a href="javaScript:void(0);" onclick="openCourseDetailModal('`+subject.courseDescriptionUrl+`', '`+subject.subjectName+`')" class="view-course-details theme-text">Course Summary</a>`;
																							// html+=`<a href="javascriptVoid(0);" onclick="openCourseDetailModal('`+subject.courseDescriptionUrl+`', '`+subject.subjectName+`')" class="btn btn-sm" style="background-color:transparent;font-size:8px;margin:0px;box-shadow:0px 0px;color:#007fff;">Course Summary</a>`;
																						}
																					html+=
																					'</div>'
																					+'<div>'
																						+'<label for="course_id_'+subject.subjectId+'" class="m-0 add-course-button primary-bg secondary-hov-bg white-txt-color">'
																							+'<input class="add-course-checkbox" id="course_id_'+subject.subjectId+'"'
																							+' value="'+subject.subjectId+'" onclick="assignEvent('+(loop1+1)+','+subject.subjectId+','+courseDetails.courseId+',\'ft_courses\','+courseDetails.userReachedMaxLimit+','+courseDetails.courseCreditLimit+','+courseDetails.courseSelectedCredit+','+subject.subjectCredit+','+(csr.registrationType=='SCHOLARSHIP' ? 1 : subject.remarks)+',\''+subject.courseType+'\',\'add\','+csr.standardId+','+csr.totalCredit+',\''+subject.courseFeeString+'\')" type="radio" name="course_id_'+courseDetails.courseId+'">'
																							+'<p><i class="fa fa-plus white-txt-color" title="add Course"></i></p>'
																							+'<p>Add</p>'
																						+'</label>'
																					+'</div>'
																				+'</h4>'
																			+'</div>'
																	+'</div>';
																});
																html+=
															'</div>'
														+'</div>'
													+'</li>';
												}
											});
										html+=
										'</ul>'
									+'</div>'
								+'</div>'
							+'</div>';
						}
					html+=
					'</div>';
					// if(csr.registrationType =='BATCH'  || csr.courseProviderId == 39){
					// 	html+='<div class="form-row sfd" style="justify-content: space-between;">'
					// 		+'<div class="add-course-from-dashboard-notes primary-txt-color text-center theme-border">'
					// 			+'You can add more courses from your dashboard for an extra fee after your enrollment is confirmed.'
					// 		+'</div>'
					// 	+'</div>';
					// }
				html+='</div>'
			}
		+'</div>';
	}
	return html;
}

function renderPaymentMode(){
	$('#payment-selection-details').html(getPaymentModeContent())
	$("#studentPaymentModal").modal("show");
	//selectPaymentmentMethod(true);
}

function signupModals(){
	var html =
	'<div class="modal fade" id="noTeacherAssistanceAvailable" tabindex="-1">'
		+'<div class="modal-dialog modal-sm modal-dialog-centered" role="document"style="box-shadow:none; width:450px; max-width:100%;">'
			+'<div class="modal-content text-center">'
				+'<div class="modal-header justify-content-center" style="width:100% !important; padding: 0 0 !important; height: 45px; border:none;">'
					+'<i class="fa fa-info" style="color: #fff !important; background: #f44336;padding: 20px 30px; border-radius: 50%; font-size: 40px; margin-top: -46px; margin-bottom: 20px;"></i>'
				+'</div>'
				+'<div id="statusMessage-1" class="modal-body delete-modal">'
					+'<p class="heading" style="color: #f44336;font-family: arial; font-size: 18px; line-height: 28px; letter-spacing: 0.3px;" id="noTeacherAssistanceAvailableMessage">';
						if(SCHOOL_ID==1){
							html+='This course does not offer live classes. Do you wish to select this course?';
						}else{
							html+='This course does not offer live classes. Do you wish to select this course?';
						}
					html+=
					'</p>'
				+'</div>'
				+'<div class="modal-footer text-center" style="border:none; padding:0; margin-bottom:15px;">'
					+'<div class="text-center" style="margin: 0 auto;">'
						+'<button id="noTeacherAssistanceAvailableYes" type="button" class="btn" style="color:#f44336 !important;border:1px solid #f44336 !important;background:transparent !important;">I understand and agree</button>'
						+'<button id="noTeacherAssistanceAvailableNo" type="button" class="btn btn-danger" data-dismiss="modal">No</button>'
					+'</div>'
				+'</div>'
			+'</div>'
		+'</div>'
	+'</div>'

	+'<div class="modal fade" id="apCourseSelectionWarning" tabindex="-1">'
		+'<div class="modal-dialog modal-sm modal-dialog-centered" role="document"style="box-shadow:none; width:450px; max-width:100%;">'
			+'<div class="modal-content text-center">'
				+'<div class="modal-header justify-content-center" style="width:100% !important; padding: 0 0 !important;height: 45px; border:none;">'
					+'<i class="fa fa-info" style="color: #fff !important; background: #f44336;padding: 20px 30px;border-radius: 50%; font-size: 40px; margin-top: -46px; margin-bottom: 20px;"></i>'
				+'</div>'
				+'<div id="statusMessage-2" class="modal-body delete-modal">'
					+'<p class="heading" style="color: #f44336;font-family: arial; font-size: 18px; line-height: 28px; letter-spacing: 0.3px;" id="apCourseSelectionWarningMessage">'
						+SCHOOL_NAME+' is approved by College Board to offer AP courses. Kindly '
						+'<a target="_blank" href="https://about.collegeboard.org/contact-us" style="color: #007fff !important;">contact</a>'
						+' an authorized test centre for AP exams. AP courses are college level and approved by the College Board.'
					+'</p>'
				+'</div>'
				+'<div class="modal-footer text-center" style="border:none; padding:0; margin-bottom:15px;">'
					+'<div class="text-center" style="margin: 0 auto;">'
						+'<button id="apCourseSelectionWarningClose" type="button" class="btn" style="color:#f44336 !important;border:1px solid #f44336 !important;background:transparent !important;" data-dismiss="modal">I understand and agree</button>'
						+'<button id="apCourseSelectionWarningNo" type="button" class="btn btn-danger" data-dismiss="modal">No</button>'
					+'</div>'
				+'</div>'
			+'</div>'
		+'</div>'
	+'</div>'

	+'<div class="modal fade" id="removeAllCoruses">'
		+'<div class="modal-dialog modal-sm modal-dialog-centered" role="document" style="box-shadow: none; width: 450px; max-width: 100%;">'
			+'<div class="modal-content text-center">'
				+'<div class="modal-header justify-content-center" style="width: 100% !important; padding: 0 0 !important; height: 45px; border: none;"></div>'
					+'<div class="modal-body delete-modal">'
						+'<i class="fa fa-info" style="color: #fff !important; background: #f44336; border-radius: 50%; font-size: 40px; position: absolute; top: -85px; right: 0; left: 0; margin: 0 auto; width: 75px; line-height: 75px;"></i>'
						+'<p class="heading" style="color: #f44336; font-family: arial; font-size: 18px; line-height: 28px; letter-spacing: 0.3px;" id="removeAllCorusesMessage">Are you sure you want to remove all selected courses?</p>'
					+'</div>'
					+'<div class="modal-footer text-center" style="border: none; padding: 0; margin-bottom: 15px;">'
						+'<div class="text-center" style="margin: 0 auto;">'
							+'<button type="button" class="btn" style="color: #f44336 !important; border: 1px solid #f44336 !important; background: transparent !important;"onclick="removeAllCourse()">Yes</button>'
							+'<button type="button" class="btn btn-danger" data-dismiss="modal">No</button>'
						+'</div>'
					+'</div>'
			+'</div>'
		+'</div>'
	+'</div>'
	+'<div class="modal fade" id="creditsLimitsModal">'
		+'<div class="modal-dialog modal-sm modal-dialog-centered" role="document" style="box-shadow: none; width: 450px; max-width: 100%;">'
			+'<div class="modal-content text-center">'
				+'<div class="modal-header justify-content-center" style="width: 100% !important; padding: 0 0 !important; height: 45px; border: none;"></div>'
					+'<div class="modal-body delete-modal">'
						+'<input type="hidden"  id="oneTimeModal" name="oneTimeModal" value="false">'
						+'<i class="fa fa-info" style="color: #fff !important; background: #f44336; border-radius: 50%; font-size: 40px; position: absolute; top: -85px; right: 0; left: 0; margin: 0 auto; width: 75px; line-height: 75px;"></i>'
						+'<p class="heading" style="color: #f44336; font-family: arial; font-size: 18px; line-height: 28px; letter-spacing: 0.3px;" id="creditsLimitsModalMessage">You have selected 6 courses worth 6 credits. Now extra fee will be charged for choosing extra courses.</p>'
					+'</div>'
					+'<div class="modal-footer text-center" style="border: none; padding: 0; margin-bottom: 15px;">'
						+'<div class="text-center" style="margin: 0 auto;">'
							+'<button type="button" id="addCourseLimitBtn" data-dismiss="modal" class="btn" style="color: #f44336 !important; border: 1px solid #f44336 !important; background: transparent !important;"onclick="updateCourseLimit()">I UNDERSTAND AND AGREE</button>'
							+'<button type="button" class="btn btn-danger" data-dismiss="modal">CLOSE</button>'
						+'</div>'
					+'</div>'
			+'</div>'
		+'</div>'
	+'</div>'
	+'<div class="modal fade" id="creditsLimitsOverModal">'
		+'<div class="modal-dialog modal-sm modal-dialog-centered" role="document" style="box-shadow: none; width: 450px; max-width: 100%;">'
			+'<div class="modal-content text-center">'
				+'<div class="modal-header justify-content-center" style="width: 100% !important; padding: 0 0 !important; height: 45px; border: none;"></div>'
					+'<div class="modal-body delete-modal">'
						+'<i class="fa fa-info" style="color: #fff !important; background: #001b47; border-radius: 50%; font-size: 40px; position: absolute; top: -85px; right: 0; left: 0; margin: 0 auto; width: 75px; line-height: 75px;"></i>'
						+'<p class="heading" style="color: #001b47; font-family: arial; font-size: 18px; line-height: 28px; letter-spacing: 0.3px;" id="creditsLimitsOverModalMessage"></p>'
					+'</div>'
					+'<div class="modal-footer text-center" style="border: none; padding: 0; margin-bottom: 15px;">'
						+'<div class="text-center" style="margin: 0 auto;">'
							+'<button type="button" id="addCourseOverLimitBtn" class="btn" style="color: #001b47 !important; border: 1px solid #001b47 !important; background: transparent !important;">Confirm & Add</button>'
							+'<button type="button" class="btn" style="background:#001b47" data-dismiss="modal">CLOSE</button>'
						+'</div>'
					+'</div>'
			+'</div>'
		+'</div>'
	+'</div>'
	+'<div class="modal fade" id="changeSelectedGrade">'
		+'<div class="modal-dialog modal-md modal-dialog-centered" role="document" >'
			+'<div class="modal-content text-center">'
				+'<div class="modal-header justify-content-center" style="width: 100% !important; padding: 0 0 !important; height: 45px; border: none;"></div>'
				+'<div class="modal-body delete-modal">'
					+'<i aria-hidden="true" class="fa fa-exchange alternate-bg white-txt-color" style="border-radius: 50%; font-size: 40px; position: absolute; top: -85px; right: 0; left: 0; margin: 0 auto; width: 75px; line-height: 75px;"></i>'
					+'<p class="heading alternate-txt-color"id="changeSelectedGradeMessage">Are you sure you want to change the grade? <br> You will be re-directed to Step 1 of the enrollment process.</p>'
				+'</div>'
				+'<div class="modal-footer text-center" style="border: none; padding: 0; margin-bottom: 15px;">'
					+'<div class="text-center" style="margin: 0 auto;">'
						+'<button type="button" class="btn alternate-txt-color" style="border: 1px solid #001b47 !important; background: transparent !important;" onclick="proceedToChangeGrade()">Yes</button>'
						+'<button type="button" class="btn" data-dismiss="modal" style="background:#001b47;">No</button>'
					+'</div>'
				+'</div>'
			+'</div>'
		+'</div>'
	+'</div>'

	+'<div class="modal fade" id="upgradeCoruses">'
		+'<div class="modal-dialog modal-sm modal-dialog-centered" role="document" style="box-shadow: none; width: 450px; max-width: 100%;">'
			+'<div class="modal-content text-center">'
				+'<div class="modal-header justify-content-center" style="width: 100% !important; padding: 0 0 !important; height: 45px; border: none;"></div>'
				+'<div class="modal-body delete-modal">'
					+'<i class="fa fa-check alternate-bg" style="color: #fff !important; border-radius: 50%; font-size: 40px; position: absolute; top: -85px; right: 0; left: 0; margin: 0 auto; width: 75px; line-height: 75px;"></i>'
					+'<p class="heading alternate-txt-color" id="upgradeCorusesMessage" style="color: green; font-family: arial; font-size: 18px; line-height: 28px; letter-spacing: 0.3px;"></p>'
				+'</div>'
				+'<div class="modal-footer text-center" style="border: none; padding: 0; margin-bottom: 15px;">'
					+'<div class="text-center" style="margin: 0 auto;">'
						+'<button id="changeCourseYes" type="button" class="btn alternate-txt-color" style="border: 1px solid #001b47 !important; background: transparent !important;">Upgrade</button>'
						+'<button id="changeCourseNo" type="button" class="btn white-txt-primary" style=" border: 1px solid #001b47 !important; background: #001b47 !important;" data-dismiss="modal">No</button>'
					+'</div>'
				+'</div>'
			+'</div>'
		+'</div>'
	+'</div>'
	+'<div class="modal fade" id="submitApplicationWarning">'
		+'<div class="modal-dialog modal-sm modal-dialog-centered" role="document" style="box-shadow: none; width: 450px; max-width: 100%;">'
			+'<div class="modal-content text-center">'
				+'<div class="modal-header justify-content-center" style="width: 100% !important; padding: 0 0 !important; height: 45px; border: none;"></div>'
					+'<div class="modal-body delete-modal">'
						+'<i class="fa fa-info" style="color: #fff !important; background: #f44336; border-radius: 50%; font-size: 40px; position: absolute; top: -85px; right: 0; left: 0; margin: 0 auto; width: 75px; line-height: 75px;"></i>'
						+'<p class="heading" style="color: #f44336; font-family: arial; font-size: 18px; line-height: 28px; letter-spacing: 0.3px;">Are you sure you want to submit your application form? Once you proceed, the details entered during the enrollment process will not be changed.</p>'
					+'</div>'
					+'<div class="modal-footer text-center" style="border: none; padding: 0; margin-bottom: 15px;">'
						+'<div class="text-center" style="margin: 0 auto;">'
							+'<button type="button" class="btn" style="color: #f44336 !important; border: 1px solid #f44336 !important; background: transparent !important;"onclick="callForApplicationSubmit()">Yes</button>'
							+'<button type="button" class="btn btn-danger" data-dismiss="modal">No</button>'
						+'</div>'
					+'</div>'
			+'</div>'
		+'</div>'
	+'</div>'
	+'<div id="payment-selection-details"></div>';
	return html;
}

function getPaymentModeContent(){
	var html=
	'<div class="modal fade theme-modal fade-scale max-size-modal" id="studentPaymentModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static" data-keyboard="false">'
		+'<div class="modal-dialog modal-lg" role="document">'
			+'<div class="modal-content">'
				+'<div class="modal-header primary-bg white-txt-color">'
					+'<h4 class="modal-title " style=" margin-left: 10px;">Fee Details</h4>'
					+'<button type="button" class="close close-with-red-color" aria-label="Close" data-dismiss="modal" style="margin-right: 5px;"><span style="color: #fff;">&times;</span></button>'
				+'</div>'
				+'<div class="modal-body" style="display:inline-block;width:100%;">'
					+skeletonFeeDetails()
				+'</div>'
			+'</div>'
		+'</div>'
	+'</div>';
	return html;
}

function paymentModalContentWithData(cdrDTO){
	$(".feeDetailsContentDiv").remove();
	var html =
	'<div class="col-md-12 col-sm-12 col-xs-12 feeDetailsContentDiv">'
		+'<div class="label-floating feePayMode">'
			+'<div class="col-md-12 col-sm-12 col-xs-12 p-0">'
				+'<div class="payment-item">';
				if(cdrDTO.bookASeatOpted == 1 && cdrDTO.enrollmentFee.enrollmentFee>0 && !cdrDTO.bookAnEnrollmentPaidStatus){
					html+=
					'<div class="radio radio-payment-option white-txt-color">'
						+'<input id="pay-registration" value="1" type="radio" name="payModeCheckboxes">'
						+'<label for="pay-registration" class="primary-border-color" onclick="displayScholorshipDetails(\'dtl-registration\');">'
							+'<span class="circle primary-border-color"></span>'
							+'<span class="check primary-bg-checked"></span>'
							+'<span class="checked-font-style primary-txt-color" style="margin-left: 35px; line-height:21px" id="payFive"> <b> Reserve an Enrollment Seat</b><br>'
								+'('+cdrDTO.enrollmentFee.enrollmentFeeString+')'
							+'</span>'
						+'</label>'
					+'</div>';
				}
				if(cdrDTO.oneTimePayment!=''){
					html+=
					'<div class="radio radio-payment-option white-txt-color">'
						+'<input id="pay-one" value="1" type="radio" name="payModeCheckboxes">'
						+'<label for="pay-one" class="primary-border-color" onclick="displayScholorshipDetails(\''+cdrDTO.oneTimePayment.paymentKey+'\');">'
							+'<span class="circle primary-border-color"></span>'
							+'<span class="check primary-bg-checked"></span>'
							+'<span class="checked-font-style primary-txt-color" style="margin-left: 35px; line-height:21px" id="payOne">';
								if(cdrDTO.oneTimePayment.paymentOptionDiscount>0){
									html+='<b>'+cdrDTO.oneTimePayment.paymentMode+' & save '
									+cdrDTO.oneTimePayment.paymentOptionDiscountString+'</b><br>';
								}else{
									html+='<b>'+cdrDTO.oneTimePayment.paymentMode+'</b><br>';
								}
								html+=
								cdrDTO.oneTimePayment.payableFeeString
							+'</span>'
						+'</label>'
					+'</div>';
				}
				if(cdrDTO.monthlyFeeDetails!=null && cdrDTO.monthlyFeeDetails!=''){
					html+=
					'<div class="radio radio-payment-option white-txt-color">'
						+'<input id="pay-three" value="2" type="radio" name="payModeCheckboxes">'
						+'<label for="pay-three" class="primary-border-color" onclick="displayScholorshipDetails(\''+cdrDTO.monthlyFeeDetails.paymentKey+'\');">'
							+'<span class="circle primary-border-color"></span>'
							+'<span class="check primary-bg-checked"></span>'
							+'<span class="checked-font-style primary-txt-color" style="margin-left: 35px; line-height:21px">'
								+'<b>';
								// +cdrDTO.monthlyFeeDetails.paymentMode;
								// if(cdrDTO.schoolId==5){
								// 	html+='(4 Installments, every 3 months)';
								// }else{
									html+='Pay in easy installments';
								// }
								html+='</b><br>'+cdrDTO.monthlyFeeDetails.payableFeeString
							+'</span>'
						+'</label>'
					+'</div>';
				}
				if(cdrDTO.customPaymentEnabled!=''){
					html+=
					'<div class="radio radio-payment-option white-txt-color">'
						+'<input id="pay-custom" value="5" type="radio" name="payModeCheckboxes">'
						+'<label for="pay-custom" class="primary-border-color" onclick="displayScholorshipDetails(\''+cdrDTO.advanceFeeDetails.paymentKey+'\');">'
							+'<span class="circle primary-border-color"></span>'
							+'<span class="check primary-bg-checked"></span>'
							+'<span class="checked-font-style primary-txt-color" style="margin-left: 35px; line-height:21px">'
								+'<b>Customized plan (Pay in easy installments)</b> <br>'
								+paymentCalculationResponse.paymentDetails.totalPayableAmountString
							+'</span>'
						+'</label>'
					+'</div>';
				}
				html+=
				'</div>'
			+'</div>';
			html+=
			'<div class="col-md-12 col-sm-12 col-xs-12 p-0">'
				+'<div class="row">'
					+'<div class="col-md-12 col-sm-12 col-xs-12">'
						+'<div class="scholarship-details">'
							+'<div class="row">'
								+'<div class="col-md-12">'
									+'<div class="table-responsive">';
									if(cdrDTO.bookASeatOpted == 1 && cdrDTO.enrollmentFee.enrollmentFee>0 && !cdrDTO.bookAnEnrollmentPaidStatus){
										html+=
										'<table id="book-seat-fee-details" class="table table-bordered table-striped" style="display: none;">'
											+'<thead class="theme-bg primary-bg white-txt-color" style="color: #fff;">'
												+'<tr>'
													+'<th style="width: 60%;">Description</th>'
													+'<th style="width: 20%;text-align:center"><span class="previewPaymentOption"></span> Fee ('+cdrDTO.currencyIsoCode+')</th>'
													+'<th style="width: 20%; text-align:center">Total Fee</th>'
												+'</tr>'
											+'</thead>'
											+'<tbody>'
												+getBookAnEnrollmentTable(cdrDTO)
											+'</tbody>'
										+'</table>'
										+'<div id="BookEnrollmentSeat">Reserve an Enrollment Seat Fee of&nbsp;<b>'+cdrDTO.enrollmentFee.enrollmentFeeString+'</b>&nbsp;is non-refundable.</div>';
									}
									if(cdrDTO.oneTimePayment!=''){
										html+=
										'<table id="annual-course-fee-details" class="table table-bordered table-striped without_h_scroll" style="display: none;">'
											+'<thead class="theme-bg primary-bg white-txt-color">'
												+'<tr>'
													+'<th style="width: 60%;">Description</th>'
													+'<th style="width: 20%;text-align:center"><span class="previewPaymentOption"></span> Fee ('+cdrDTO.currencyIsoCode+')</th>'
													+'<th style="width: 20%; text-align:center">Total Fee</th>'
												+'</tr>'
											+'</thead>'
											+'<tbody>'
												+getAnnualPaymentTable(cdrDTO);
											+'</tbody>'
										+'</table>';
									}
									if(cdrDTO.monthlyFeeDetails!=null && cdrDTO.monthlyFeeDetails!=''){
										html+=
										'<table id="installment3-course-fee-details" class="installment3-course-fee-details table table-bordered table-striped without_h_scroll" style="display: none;">'
											+'<thead class="theme-bg primary-bg white-txt-color">'
												+'<tr>'
													+'<th style="width: 60%;">Description</th>'
													+'<th style="width: 20%;text-align:center"><span class="previewPaymentOption"></span> Fee ('+cdrDTO.currencyIsoCode+')</th>'
													+'<th style="width: 20%; text-align:center">Total Fee</th>'
												+'</tr>'
											+'</thead>'
											+'<tbody>'
												+getMonthlyPaymentTable(cdrDTO)
											+'</tbody>'
										+'</table>'
										+'<div class="full installment3-course-fee-details" style="display: none;">'
											+'<div>'
												+'<h3 class="primary-txt-color" style="margin-bottom:0 !important;text-align:left">FEE SCHEDULE</h3>'
											+'</div>'
											+'<table class="table table-bordered table-striped without_h_scroll">'
												+'<thead class="theme-bg primary-bg white-txt-color">'
													+'<tr>'
														+'<th style="width: 60%;">DESCRIPTION</th>'
														+'<th style="width: 20%;text-align:center"><span class="previewPaymentOption"></span>TOTAL FEE</th>'
														+'<th style="width: 20%; text-align:center">PAYING NOW</th>'
													+'</tr>'
												+'</thead>'
												+'<tbody>'
													+monthlyFeeShchedule(cdrDTO)
												+'</tbody>'
											+'</table>'
										+'</div>';
									}
									if(cdrDTO.paymentCalculationResponse!=''){
										html+=
										'<table id="custom-course-fee-details" class="table table-bordered table-striped without_h_scroll" style="display: none;">'
											+'<thead class="theme-bg primary-bg white-txt-color">'
												+'<tr>'
													+'<th style="width: 60%;">Description</th>'
													+'<th style="width: 20%;text-align:center"><span class="previewPaymentOption"></span> Fee ('+cdrDTO.currencyIsoCode+')</th>'
													+'<th style="width: 20%; text-align:center">Total Fee</th>'
												+'</tr>'
											+'</thead>'
											+'<tbody>'
												+getCustomizedPaymentTable(cdrDTO)
											+'</tbody>'
										+'</table>';
									}
									html+=
									'</div>'
								+'</div>'
							+'</div>'
						+'</div>'
						+'<div>'
							+'<p><b>Thank you so much for trusting and choosing '+SCHOOL_NAME+'.</b></p>'
						+'</div>'
					+'</div>'
					+'<div class="col-md-12 col-sm-12 col-xs-12">'
						+'<div class="row">'
							+'<div class="col-md-10"></div>'
							+'<div class="col-md-2 text-right">'
								+'<button type="button" class="btn theme-bg primary-bg white-txt-color" onclick="choosePaymentOption();">Next</button>'
							+'</div>'
						+'</div>'
					+'</div>'
				+'</div>'
			+'</div>'
		+'</div>'
	+'</div>';
	$("#studentPaymentModal .modal-body").append(html);
	
}

function getReviewAndPayRendered(data){
	$('#signupStage4Content').show();
	$('#signupStage4Content').html(getReviewAndPayContent(data));
	$('.accordion .a-title').unbind().bind('click', function(){
		$(this).parent().closest('li').find('.a-content').stop().slideToggle();
		$(this).find('.plus-icon').toggleClass('fa-minus fa-plus')
		$(this).parent().closest('li').siblings().find('.plus-icon').removeClass('fa-minus')
		$(this).parent().closest('li').siblings().find('.plus-icon').addClass('fa-plus')
		$(this).parent().closest('li').siblings().find('.a-content').slideUp();
	});

	if(data.pgs!=null || data.pgswu!=null || data.pgswt!=null){
		bindFileUploadNew1('8', '32', data.userId, 4);
		bindFileUploadNew1('9', '33', data.userId, 4);
		if(data.isOptedAlternetPaymentMethod==1){
			$('#logout_modal_logout').modal('show');
		}else if(data.isOptedAlternetPaymentMethod==2){
			$('#wu_payment_warning').modal('show');
		}
	}

	$('.nav-tabs li a').click(function(){
		hideModalMessage('');
	})
	$('a').click(function(){
		$("[data-toggle='tooltip']").tooltip('hide');
	});
	$('.modal-body').on('scroll', function(){
		$("[data-toggle='tooltip']").tooltip('hide');
	});
	// if(data.schoolId==5){
	// 	var scriptEle = document.createElement("script");
	// 	scriptEle.setAttribute("src", "https://js.yoco.com/sdk/v1/yoco-sdk-web.js");
	// 	document.body.appendChild(scriptEle);

	// 	var yocoData = data.yocoData;
	// 	function initiateYocoPaymentGateway(){
	// 		var yoco = new window.YocoSDK({
	// 			publicKey : data.pgs.clientId,
	// 		});
	// 		var checkoutButton = document.querySelector('#yocopaymentbutton');
	// 		checkoutButton.addEventListener('click', function() {
	// 			$('#callPaymentStudentModal').modal('hide');
	// 			yoco.showPopup({
	// 				amountInCents : yocoData.amountInCents,
	// 				currency : yocoData.currency,
	// 				name : yocoData.name,
	// 				description : yocoData.name,
	// 				customer : {
	// 					email: yocoData.email,
	// 					phone: yocoData.phone,
	// 					firstName: yocoData.firstName,
	// 					lastName: yocoData.lastName
	// 				},
	// 				callback : function(result) {
	// 					// This function returns a token that your server can use to capture a payment
	// 					if (result.error) {
	// 						const errorMessage = result.error.message;
	// 						// alert(yocoData.failureUrl+" , errorMessage = "+errorMessage);
	// 						window.location.replace(yocoData.failureUrl);
	// 					} else {
	// 						//alert(yocoData.successsUrl+'&yocoToken='+result.id);
	// 						window.location.replace(yocoData.successsUrl+'&yocoToken='+result.id);
	// 					}
	// 					// In a real integration - you would now pass this chargeToken back to your
	// 					// server along with the order/basket that the customer has purchased.
	// 				}
	// 			})
	// 		});
	// 	}
	// 	customLoader(true);
	// 	window.setTimeout(function(){customLoader(false);initiateYocoPaymentGateway();},1000)
	// }
	if(SHOW_PAYMENT_OPTION=='Y'){

	}else{
		if(data.applicationSubmitted=='Y'){
			applicationSubmittedModal(data.contactEmail);
		}
	}
	if($("#logoutSignupModal").length<1){
		$("body").append(logOutModalContent());
	}
}

function getReviewAndPayContent(data){
	var html=
	'<h4></h4>'
	+'<section>'
		+'<h3 class="alternate-txt-color">Kindly Review your details</h3>'
		+'<div class="form-row">'
			+'<div class="form-holder w-100">'
				+'<div class="full">'
					+'<ul class="accordion mob-scroll">'
						+'<li>'
							+studentDetailsPreview(data)
						+'</li>'
						+'<li>'
							+parentDetailsPreview(data)
						+'</li>'
						+'<li>'
							+courseDetailsPreview(data)
						+'</li>'
					+'</ul>';
					// if(data.returnUrl !=''){
					// 	html+=
					// 	'<hr>'
					// 	+'<div class="edit-btn" style="margin-bottom:20px;">'
					// 		+'<a class="primary-bg white-txt-color" target="_blank" href="'+data.returnUrl+'">Download Reserve an Enrollment Seat Receipt <i class="fa fa-download"></i></a>';
					// 	+'</div>';
					// 	if(data.paymentExpire !=''){
					// 		html+='<div><strong>Note: </strong>Please note that the enrollment seat will be valid till <strong>'+data.expiryDate+'</strong>  after which you will have to pay the course fee in full to complete the enrollment process.</div>';
					// 	}
					// 	html+=
					// 	'<hr>';
					// }
					if(SHOW_PAYMENT_OPTION=='Y'){
						html+=feePaymentReview(data)
					}
					html+=
				'</div>'
			+'</div>'
		+'</div>'
	+'</section>'
	//+courseFeeModal(data)
	+bookAnEnrollmentTNCModal(data)
	+callPaymentStudentModal(data)
	// +commonYocoCheckout(data)
	+referenceNumberModal(data)
	+logoutModalLogout(data)
	//+wuPaymentWarningModal(data)
	// +k12EnrollFeeModal(data)
	+goToDashboardWarningMessageModal(data)
	// +smoovPayContent(data);
	return html;
}

function studentDetailsPreview(data){
	var signupStudent=data.signupStudent;
	var html =
	'<div class="student-details-info">'
		+'<div class="full">'
			+'<h4 class="a-title">Student Details <i class="fa plus-icon fa-plus"></i></h4>'
			+'<div class="h_scroll primary-bg">'
				+'<img src="'+PATH_FOLDER_IMAGE2+'h_scroll.png">'
			+'</div>'
		+'</div>'
		+'<div class="a-content" style="display: none;">'
			+'<div class="table-responsive">'
				+'<table class="table-style">'
					+'<tbody>'
						+'<tr>'
							+'<th>Name</th>'
							+'<td>'+signupStudent.firstName+' '+signupStudent.middleName+' '+signupStudent.lastName+'</td>'
						+'</tr>'
						+'<tr>'
							+'<th>Date of Birth</th>'
							+'<td>'+signupStudent.dob+'</td>'
						+'</tr>'
						+'<tr>'
							+'<th>Gender</th>'
							+'<td>'
								+signupStudent.genderName
							+'</td>'
						+'</tr>'
						+'<tr>'
							+'<th>Email</th>'
							+'<td>'+signupStudent.communicationEmail+'</td>'
						+'</tr>'
						+'<tr>'
							+'<th>Phone Number</th>'
							+'<td>';
								if(signupStudent.contactNumber==null || signupStudent.contactNumber==''){
									html+='N/A';
								}else{
									html+=
									'+'+signupStudent.countryIsdCode+'&nbsp;'+signupStudent.contactNumber;
								}
							html+=
							'</td>'
						+'</tr>'
						+'<tr>'
							+'<th>Nationality</th>'
							+'<td>'+signupStudent.nationality+'</td>'
						+'</tr>'
						+'<tr>'
							+'<th>Country | State | City</th>'
							+'<td>'+signupStudent.countryName+ " | " +signupStudent.stateName+ " | " +signupStudent.cityName+'</td>'
						+'</tr>'
						if($('#learingProgramHeader').attr('val')=='DUAL_DIPLOMA'){
							html+=
							+'<tr>'
								+'<th>Student\'s School Name</th>'
								+'<td>'+signupStudent.studyingSchoolName+'</td>'
							+'</tr>'
							+'<tr>'
								+'<th>Student Current Grade</th>'
								+'<td>'+signupStudent.studyingGradeName+'</td>'
							+'</tr>'
							+'<tr>'
								+'<th>Country of School</th>'
								+'<td>'+signupStudent.countryNameOfSchool+'</td>'
							+'</tr>';
						}
						html+=
					'</tbody>'
				+'</table>'
			+'</div>';
			if(!data.customPaymentEnabled){
				html+=
				'<div class="edit-btn">'
					+'<button class="primary-bg white-txt-color" onclick="displaySection(1)">Edit <i class="fa fa-edit"></i></button>'
				+'</div>';
			}
			html+=
		'</div>'
	+'</div>';
	return html;
}

function parentDetailsPreview(data){
	var signupParent=data.signupParent;
	var courseProviderId=data.signupStudent.courseProviderId;
	var html =
	'<div class="student-parent-info">'
		+'<div class="full">'
			+'<h4 class="a-title">';
			if($('#learingProgramHeader').attr('val')=='ONE_TO_ONE_FLEX' ){
				html+='Academic & Communication Details';
			}else{
				if(data.signupStudent.courseProviderId==39){
					html+='Communication Details';
				}else{
					html+='Parent/Guardian Details';
				}
			}
			html+=
			'<i class="fa plus-icon fa-plus"></i></h4>'
			+'<div class="h_scroll primary-bg">'
				+'<img src="'+PATH_FOLDER_IMAGE2+'h_scroll.png">'
			+'</div>'
		+'</div>'
		+'<div class="a-content" style="display: none;">'
			+'<div class="table-responsive">'
				+'<table class="table-style">'
					+'<tbody>';
						if($('#learingProgramHeader').attr('val')=='ONE_TO_ONE_FLEX' ){
							html+=
							'<tr>'
								+'<th>Student or a working professional</th>'
								+'<td>'+signupParent.workingProfessionName+'</td>'
							+'</tr>'
							+'<tr>'
								+'<th>Name of the School/College/Organization</th>'
								+'<td>'+signupParent.institutionName+'</td>'
							+'</tr>'
							+'<tr>'
								+'<th>Country of the School/College/Organization</th>'
								+'<td>'+signupParent.institutionCountryName+'</td>'
							+'</tr>';
						}else{
							if(data.signupStudent.courseProviderId==39){
	
							}else{
								html+=
								'<tr>'
									+'<th>Name</th>'
									+'<td>'+signupParent.firstName+' '+signupParent.middleName+' '+signupParent.lastName+'</td>'
								+'</tr>'
								+'<tr>'
									+'<th>Relation with student</th>'
									+'<td>'+signupParent.relationshipName+'</td>'
								+'</tr>'
								+'<tr>'
									+'<th>Email</th>'
									+'<td>';
										if(signupParent.email == null || signupParent.email==''){
											html+='N/A';
										}else{
											html+=signupParent.email;
										}
									html+=
									'</td>'
								+'</tr>'
								+'<tr>'
									+'<th>Phone Number</th>'
									+'<td>';
										if(signupParent.contactNumber==null || signupParent.contactNumber==''){
											html+='N/A';
										}else{
											html+=
											'+'+signupParent.countryCode+'&nbsp;'+signupParent.contactNumber;
										}
									html+=
									'</td>'
								+'</tr>'
								+'<tr>'
									+'<th>Country | State | City</th>'
									+'<td>'+signupParent.countryName+ " | " +signupParent.stateName+ " | " +signupParent.cityName+'</td>'
								+'</tr>'
								+'<tr>'
									+'<th>Referral Code</th>'
									+'<td>';
									if(signupParent.referralCode==null || signupParent.referralCode==''){
										html+='N/A';
									}else{
										html+=signupParent.referralCode;
									}
									html+=
									'</td>'
								+'</tr>';
							}
						}
						html+=
						'<tr>'
							+'<th>Preferred Communication</th>'
							+'<td>'
								+'<div class="full d-flex">'
									+'<label class="communication-mode text-dark" for="pcModeWhatsapp">';
										if(signupParent.communicationWhatsApp == "Y"){
											html+='<input type="checkbox" value="whatsapp" checked disabled>';
										}else{
											html+='<input type="checkbox" value="whatsapp" disabled>';
										}
										html+='<span>WhatsApp</span>'
										+'<img src="'+PATH_FOLDER_IMAGE+'watsapp-icon.png" width="16px" /></i>'
									+'</label>'
									+'<label class="communication-mode text-dark" for="pcModeCall">';
										if(signupParent.communicationCall == "Y"){
											html+='<input type="checkbox" value="call" checked disabled>';
										}else{
											html+='<input type="checkbox" value="call" disabled>';
										}
										html+='<span>Call</span><i class="fa fa-phone" style="position: static;transform: inherit;"></i>'
									+'</label>'
									+'<label class="communication-mode text-dark" for="pcModeEmail">';
										if(signupParent.communicationEmail == "Y"){
											html+='<input type="checkbox" value="email" checked disabled>';
										}else{
											html+='<input type="checkbox" value="email" disabled>';
										}
										html+='<span>Email</span><i class="fa fa-envelope" style="position: static;transform: inherit;"></i>'
									+'</label>'
								+'</div>'
							+'</td>'
						+'</tr>'
					+'</tbody>'
				+'</table>'
			+'</div>';
			if(!data.customPaymentEnabled){
				html+=
				'<div class="edit-btn">'
					+'<button class="primary-bg white-txt-color" onclick="displaySection(2)">Edit <i class="fa fa-edit"></i></button>'
				+'</div>';
			}
			html+=
		'</div>'
	+'</div>';
	return html;
}

function courseDetailsPreview(data){
	var signupCourse=data.signupCourse;
	var html =
	'<div class="student-courses-info">'
		+'<div class="full">'
			+'<h4 class="a-title">Selected Courses <i class="fa fa-plus plus-icon"></i></h4>'
			+'<div class="h_scroll primary-bg">'
				+'<img src="'+PATH_FOLDER_IMAGE2+'h_scroll.png">'
			+'</div>'
		+'</div>'
		+'<div class="a-content" style="'+(SHOW_PAYMENT_OPTION == 'N'?"display:block":"")+'">'
			+'<div class="table-responsive course-selection-wrapper" style="display:block;">'
				+'<h3 class="selected-grade" style="margin-bottom:15px; font-size:16px">';
					if(data.signupStudent.courseProviderId==39){
						html+='Exact-Path';
					}else{
						html+=signupCourse.standardName;
					}
				html+=
				'</h3>'
				+'<table class="table-style">'
					+'<thead>'
						+'<tr>'
							+'<th>Course Name</th>';
							if($.inArray(signupCourse.standardId, [17,11,12,13,14,15,16]) == -1) {
								html+='<th>Credit</th>';
							}
							html+=
						'</tr>'
					+'</thead>'
					+'<tbody>';
						$.each(signupCourse.courseDTO, function(k, courseDt) {
							if(courseDt.courseName.startsWith('Spanish') && (data.schoolId==1 || data.schoolId==3) && data.standardId>=11 && data.standardId<=17){

							}else{
								html+=
								'<tr>'
									+'<td>'+courseDt.courseName+'</td>';
									if($.inArray(signupCourse.standardId, [17,11,12,13,14,15,16]) == -1) {
										html+='<td>'+courseDt.creditScore+'</td>';
									}
								html+=
								'</tr>';
							}
						});
					html+='</tbody>';
					if($.inArray(signupCourse.standardId, [17,11,12,13,14,15,16]) == -1) {
						html+=
						'<tfoot>'
							+'<tr>'
								+'<th>Total Credit</th>'
								+'<th>'+signupCourse.totalCredit+'</th>'
							+'</tr>'
						+'</tfoot>';
					}
				html+='</table>'
			+'</div>';
			if(!data.customPaymentEnabled){
				html+=
				'<div class="edit-btn">'
					+'<button class="primary-bg white-txt-color" onclick="displaySection(3)">Edit <i class="fa fa-edit"></i></button>'
				+'</div>';
			}
			html+=
		'</div>'
	+'</div>';
	return html;
}
		
function feePaymentReview(data){
	var signupCourse=data.signupCourse;
	var cdrDTO=data.feePaymentDetailsResponse;
	var html=
	'<div class="full amount-description">'
		+'<h3 style="margin-bottom:15px;" class="alternate-txt-color">'
			+data.feeSetionTitile;
			if(!data.customPaymentEnabled){
				if(cdrDTO.monthlyFeeDetails!=null && cdrDTO.monthlyFeeDetails.monthlyFees.length>0){
					html+='<span class="primary-bg change-grade" onclick="moveStep(\'prev\')">Change Plan <i class="fa fa-exchange"></i></span>';
				}
			}
			
		html+='</h3>'
		+'<div class="table-responsive">'
			+'<table class="table-style">'
				+'<thead>'
					+'<tr>'
						+'<th class="th" style="width:60%">Description</th>'
						+'<th class="th" style="text-align:center;width:20%">Fee ('+data.currencyIsoCode+')</th>'
						+'<th class="th" style="text-align:center;width:20%">Total Fee</th>'
					+'</tr>'
				+'</thead>'
				+'<tbody>';
				if(signupCourse.payMode == 'registration'){
					html+=getBookAnEnrollmentTable(cdrDTO);
				}else if(signupCourse.payMode == 'annually'){
					html+=getAnnualPaymentTable(cdrDTO);
				}else if(signupCourse.payMode == 'twoMonthly' || signupCourse.payMode == 'threeMonthly' || signupCourse.payMode == 'sixMonthly'){
					html+=getMonthlyPaymentTable(cdrDTO);
				}else if(signupCourse.payMode == 'c_installment' || signupCourse.payMode == 'c_annually'){
					html+=getCustomizedPaymentTable(cdrDTO);
				}
				html+=
				'</tbody>'
			+'</table>';
			if(signupCourse.payMode == 'twoMonthly' || signupCourse.payMode == 'threeMonthly' || signupCourse.payMode == 'sixMonthly'){
				html+=
				'<div>'
					+'<br/>'
					+'<h3 class="primary-txt-color" style="margin-bottom:0 !important;text-align:left">FEE SCHEDULE</h3>'
				+'</div>'
				+'<table class="table-style">'
					+'<thead>'
						+'<tr>'
							+'<th class="th" style="width:60%">DESCRIPTION</th>'
							+'<th class="th" style="text-align:center;width:20%">TOTAL FEE</th>'
							+'<th class="th" style="text-align:center;width:20%">PAYING NOW</th>'
						+'</tr>'
					+'</thead>'
					+'<tbody>'
						+monthlyFeeShchedule(cdrDTO)
					'</tbody>'
				+'</table>';
			}	
		html+='</div>'
	+'</div>';
	return html;
}

function getBookAnEnrollmentTable(cdrDTO){
	var html=
		// '<tr>'
		// 	+'<td>Reserve an Enrollment Seat</td>'
		// 	+'<td style="text-align:right">'+cdrDTO.enrollmentFee.enrollmentFeeString+'</td>'
		// 	+'<td style="text-align:right">'+cdrDTO.enrollmentFee.enrollmentFeeString+'</td>'
		// +'</tr>'
		'<tr>'
			+'<td><b>Payable Fee</b></td>'
			+'<td style="text-align:right">'+cdrDTO.enrollmentFee.enrollmentFeeString+'</td>'
			+'<td style="text-align:right">'+cdrDTO.enrollmentFee.enrollmentFeeString+'</td>'
		+'</tr>';
		
	return html;
}

function commonPaymentTable(cdrDTO, prefix){
	var html =
	// '<tr>'
	// 	+'<td>'+cdrDTO.enrollmentFee.label+'</td>'
	// 	+'<td style="text-align:right">'
	// 		+cdrDTO.enrollmentFee.enrollmentFeeString
	// 	+'</td>'
	// 	+'<td style="text-align:right">'
	// 		+cdrDTO.enrollmentFee.enrollmentFeeString
	// 	+'</td>'
	// +'</tr>'+
	'<tr>';
		if(cdrDTO.enrollmentFee.enrollmentFee>0){
			if($('#learingProgramHeader').attr('val')=='ONE_TO_ONE_FLEX' || $('#learingProgramHeader').attr('val')=='DUAL_DIPLOMA' ){
				html+='<td>Course Fee</td>';
			}else{
				html+='<td>Total Fee (Enrollment Fee + Course Fee)</td>';

			}
		}else{
			html+='<td>Total Course Fee</td>';
		}
		if($('#learingProgramHeader').attr('val')=='ONE_TO_ONE_FLEX' || $('#learingProgramHeader').attr('val')=='DUAL_DIPLOMA' ){
			var courseFeeActucal = parseFloat(cdrDTO.courseFee)-parseFloat(cdrDTO.enrollmentFee.enrollmentFee);
			var courseFeeActucalWithCurrency=currency+' '+parseFloat(courseFeeActucal).toFixed(2);
			html+=
			'<td style="text-align:right">'+courseFeeActucalWithCurrency+'</td>'
			+'<td style="text-align:right">'+courseFeeActucalWithCurrency+'</td>';
		}else{
			html+=
			'<td style="text-align:right">'+cdrDTO.courseFeeString+'</td>'
			+'<td style="text-align:right">'+cdrDTO.courseFeeString+'</td>'
		}
		html+=
	'</tr>';
	if(cdrDTO.courseExtraFeeDetails!=null && cdrDTO.courseExtraFeeDetails.totalEntityFee>0){
		html+=
		'<tr>'
			+'<td>';
				if(cdrDTO.courseExtraFeeDetails!=null && cdrDTO.courseExtraFeeDetails.totalEntityFee>0){
					html+=
					'<div id="'+prefix+'_extra">'
						+'<span>Extra Course Fee</span>'
						+'<ol class="extra-course-ol">';
							$.each(cdrDTO.courseExtraFeeDetails.description, function(k, desc) {
								html+='<li class="extra-course-name">'+desc+'</li>';
							});
							html+=
						'</ol>'
						+'<span>Total Extra Course Fee</span>'
					+'</div>';
				}
			html+=
			'</td>'
			+'<td>';
				if(cdrDTO.courseExtraFeeDetails!=null && cdrDTO.courseExtraFeeDetails.totalEntityFee>0){
					html+=
					'<div id="'+prefix+'_extra_price">'
					+'<span>&nbsp;</span>'
					+'<ul class="extra-course-price-ul">';
						$.each(cdrDTO.courseExtraFeeDetails.entityFees, function(k, fee) {
							html+='<li class="extra-course-price" style="text-align:right"> + '+fee+'</li>';
						});
						html+=
					'</ul>'
				+'</div>';
				}
			html+=
			'</td>'
			+'<td style="vertical-align:bottom;text-align:right"> + '+cdrDTO.courseExtraFeeDetails.totalEntityFeeString+'</td>'
		+'</tr>';
	}
	if(cdrDTO.courseMaterialFeeDetails!=null && cdrDTO.courseMaterialFeeDetails.totalEntityFee>0){
		html+=
		'<tr>'
			+'<td>';
				if(cdrDTO.courseMaterialFeeDetails!=null && cdrDTO.courseMaterialFeeDetails.totalEntityFee>0){
					html+=
					'<div id="'+prefix+'_external_material">'
						+'<span>External Material Fee</span>'
						+'<ol class="external-course-ol">';
							$.each(cdrDTO.courseMaterialFeeDetails.description, function(k, desc) {
								html+='<li class="external-course-name">'+desc+'</li>';
							});
							html+=
						'</ol>'
						+'<span>Total External Material Fee</span>'
					+'</div>';
				}
			html+=
			'</td>'
			+'<td>';
				if(cdrDTO.courseMaterialFeeDetails!=null && cdrDTO.courseMaterialFeeDetails.totalEntityFee>0){
					html+=
					'<div id="'+prefix+'_external_material_price">'
						+'<span>&nbsp;</span>'
						+'<ul class="external-course-price-ul">';
							$.each(cdrDTO.courseMaterialFeeDetails.entityFees, function(k, fee) {
								html+='<li class="external-course-price" style="text-align:right"> + '+fee+'</li>';
							});
							html+=
						'</ul>'
					+'</div>';
				}
			html+=
			'</td>'
			+'<td style="vertical-align:bottom;text-align:right"> + '+cdrDTO.courseMaterialFeeDetails.totalEntityFeeString+'</td>'
		+'</tr>';
	}
	if(cdrDTO.feeAlreayPaid!=null && cdrDTO.feeAlreayPaid.totalEntityFee>0){
		html+=
		'<tr>'
			+'<td>';
				if(cdrDTO.feeAlreayPaid!=null && cdrDTO.feeAlreayPaid.totalEntityFee>0){
					html+=
					'<div id="'+prefix+'_feeAlreadyPaidDesc">'
						+'<span>Fee Already Paid</span>'
						+'<ol class="extra-course-ol">';
							$.each(cdrDTO.feeAlreayPaid.description, function(k, desc) {
								html+='<li class="extra-course-name">'+desc+'</li>';
							});
							html+=
						'</ol>'
						+'<span>Total Paid</span>'
					+'</div>';
				}
			html+=
			'</td>'
			+'<td>';
				if(cdrDTO.feeAlreayPaid!=null && cdrDTO.feeAlreayPaid.totalEntityFee>0){
					html+=
					'<div id="'+prefix+'_feeAlreadyPaidDescPrice">'
					+'<span>&nbsp;</span>'
					+'<ul class="extra-course-price-ul">';
						$.each(cdrDTO.feeAlreayPaid.entityFees, function(k, fee) {
							html+='<li class="extra-course-price" style="text-align:right"> - '+fee+'</li>';
						});
						html+=
					'</ul>'
				+'</div>';
				}
			html+=
			'</td>'
			+'<td style="vertical-align:bottom;text-align:right"> - '+cdrDTO.feeAlreayPaid.totalEntityFeeString+'</td>'
		+'</tr>';
	}
	return html;
}

function getAnnualPaymentTable(cdrDTO){
	var html= commonPaymentTable(cdrDTO,'annually');
	// if(cdrDTO.schoolId==1 || cdrDTO.schoolId==3 || cdrDTO.schoolId==3){
		if(cdrDTO.oneTimePayment!=null && cdrDTO.oneTimePayment.youSave!=null){
			if(cdrDTO.oneTimePayment.youSave.description!=null && cdrDTO.oneTimePayment.youSave.description.length>0){
				html+=
				'<tr>'
					+'<td>'
						+'<span>Fee Waiver & Discounts</span>'
						+'<ol>';
						$.each(cdrDTO.oneTimePayment.youSave.description, function(k, desc) {
							html+='<li>'+desc+'</li>';
						});
						html+=
						'</ol>'
						+'<span>Total You Saved</span>'
					+'</td>'
					+'<td>'
						+'<span>&nbsp;</span>'
						+'<ul style="margin:0">';
						$.each(cdrDTO.oneTimePayment.youSave.entityFees, function(k, fee) {
							html+='<li style="text-align:right"> - '+fee+'</li>';
						});
						html+=
						'</ul>'
					+'</td>'
					+'<td style="vertical-align:bottom;text-align:right"> - '+cdrDTO.oneTimePayment.youSave.totalEntityFeeString+'</td>'
				+'</tr>';
			}
		}
		if($('#learingProgramHeader').attr('val')=='ONE_TO_ONE_FLEX' || $('#learingProgramHeader').attr('val')=='DUAL_DIPLOMA' ){
			if(cdrDTO.enrollmentFee.enrollmentFee>0){
				html+=
				'<tr>'
					+'<td>Enrollment Fee</td>'
					+'<td style="text-align:right">'+cdrDTO.enrollmentFee.enrollmentFeeString+'</td>'
					+'<td style="text-align:right">'+cdrDTO.enrollmentFee.enrollmentFeeString+'</td>'
				+'</tr>';
			}
		}
		html+=
		'<tr>'
			+'<td>'
				+'<strong>Payable Fee</strong>'
			+'</td>'
			+'<td style="text-align:right"><b>'+cdrDTO.oneTimePayment.payableFeeString+'</b></td>'
			+'<td style="text-align:right"><b>'+cdrDTO.oneTimePayment.payableFeeString+'</b></td>'
		+'</tr>';
	// }else if(cdrDTO.schoolId==4){
	// }else if(cdrDTO.schoolId==5){
	// }
	return html;
}

function getMonthlyPaymentTable(cdrDTO){
	var html= commonPaymentTable(cdrDTO,'monthly');
	// if(cdrDTO.schoolId==1 || cdrDTO.schoolId==3 || cdrDTO.schoolId==3){
		showPayableFee=false;
		if(cdrDTO.monthlyFeeDetails!=null && cdrDTO.monthlyFeeDetails.youSave!=null){
			if(cdrDTO.monthlyFeeDetails.youSave.description!=null &&  cdrDTO.monthlyFeeDetails.youSave.description.length>0){
				html+=
				'<tr>'
					+'<td>'
						+'<span>Fee Waiver & Discounts</span>'
						+'<ol>';
						$.each(cdrDTO.monthlyFeeDetails.youSave.description, function(k, desc) {
							html+='<li>'+desc+'</li>';
						});
						html+=
						'</ol>'
						+'<span>Total You Saved</span>'
					+'</td>'
					+'<td>'
						+'<span>&nbsp;</span>'
						+'<ul style="margin:0">';
						$.each(cdrDTO.monthlyFeeDetails.youSave.entityFees, function(k, fee) {
							html+='<li style="text-align:right"> - '+fee+'</li>';
						});
						html+=
						'</ul>'
					+'</td>'
					+'<td style="vertical-align:bottom;text-align:right"> - '+cdrDTO.monthlyFeeDetails.youSave.totalEntityFeeString+'</td>'
				+'</tr>';
				showPayableFee=true;
			}
		}
		if(cdrDTO.courseExtraFeeDetails!=null && cdrDTO.courseExtraFeeDetails.totalEntityFee>0){
			showPayableFee=true;
		}
		if(cdrDTO.feeAlreayPaid!=null && cdrDTO.feeAlreayPaid.totalEntityFee>0){
			showPayableFee=true;
		}
		if(showPayableFee){
			html+=
			'<tr>'
				+'<td>'
					+'<strong>Payable Fee</strong>'
				+'</td>'
				+'<td style="text-align:right"><b>'+cdrDTO.monthlyFeeDetails.payableFeeString+'</b></td>'
				+'<td style="text-align:right"><b>'+cdrDTO.monthlyFeeDetails.payableFeeString+'</b></td>'
			+'</tr>';
		}
	// }else if(cdrDTO.schoolId==4){
	// }else if(cdrDTO.schoolId==5){
	// }
	return html;
}

function monthlyFeeShchedule(cdrDTO){
	var html = '';
		$.each(cdrDTO.monthlyFeeDetails.monthlyFees, function(k, monthlyFee) {
			html+=
			'<tr>'
				+'<td>'
					+monthlyFee.paymentLabel
				+'</td>'
				+'<td style="text-align:right"><b>'+monthlyFee.amountString+'</b></td>'
				+'<td style="text-align:right"><b>';
				if(k==0){
					html+=monthlyFee.amountString;
				}
				html+=
				'</b></td>'
			+'</tr>';
		});
		
	return html;
}

function getCustomizedPaymentTable(data){
	var html='';
	if(data.customPaymentEnabled){
		var paymentDetails = data.paymentCalculationResponse.paymentDetails
		$.each(paymentDetails.schedulePayments, function(loop, schedulePayment) {
			html+=
			'<tr>'
				+'<td>'
					+schedulePayment.paymentTitle
					+' '
					+(loop==0?' (to be paid at the time of enrollment)':'')
				+'</td>'
				+'<td style="text-align:right">'
					+schedulePayment.payAmountString
				+'</td>'
				+'<td style="text-align:right">'
					+schedulePayment.payAmountString
				+'</td>'
			+'</tr>';
		});
		html+=
		'<tr>'
			+'<td><strong>Payable Fee</strong></td>'
			+'<td style="text-align:right">'
				+'<strong>';
					// if(paymentDetails.schedulePayments!=null
					// 	 && paymentDetails.schedulePayments.length>1){
					// 	$.each(paymentDetails.schedulePayments, function(loop, schedulePayment) {
					// 		html+=schedulePayment.payAmountString;
					// 		var isLastElement = loop == paymentDetails.schedulePayments.length -1;
					// 		if(!isLastElement){
					// 			html+=' + ';
					// 		}else{
					// 			html+=' = ';
					// 		}
					// 	});
					// }
					html+=paymentDetails.totalPayableAmountString
				+'</strong>'
			+'</td>'
			+'<td style="text-align:right">'
				+'<strong>'
					html+=paymentDetails.totalPayableAmountString
				+'<strong>'
			+'</td>'
		+'</tr>';
	}
	$('#custom-payment-button').show();
	return html;
}

// function courseFeeModal(data){
// 	var html ='';
// 	if(data.pgs!=null || data.pgswu!=null || data.pgswt!=null){
// 		html='<div class="modal fade theme-modal fade-scale " id="courseFeeModalTNC" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static" data-keyboard="false">'
// 			+'<div class="modal-dialog modal-lg" role="document" style="top:50%;transform: translateY(-50%);">'
// 				+'<div class="modal-content" style="border-radius: 0; border: 0; margin-top:0 !important;">'
// 					+'<div class="modal-header theme-header white-text" style="width: 97%; margin: 0 auto; border-radius: 0;position:relative;top:-25px;">'
// 						+'<h4 class="modal-title" style="color: #fff; margin-left: 10px;">Further to my Enrollment with '+SCHOOL_NAME+', I agree to comply with the following as stated below, without any exceptions:</h4>'
// 						+'<button type="button" class="close" data-dismiss="modal" style="color:#fff">×</button>'
// 					+'</div>'
// 					+'<div class="modal-body" style="height:auto; max-height:60vh; overflow:auto;">'
// 						+'<!-<p class="scroll-down" style="margin-top:5px;"><a href="#" class="animat=e"></a></p> -->'
// 						+'<form id="signupStage4" name="signupCourse" method="post" autocomplete="off">'
// 							+'<div class="full theme-text scroll-down-animatoin">'
// 								+'<h4><i class="fa fa-arrow-down faa-falling animated"></i></h4>'
// 							+'</div>'
// 							+'<div class="agree">'
// 								+'<ol>'
// 									+'<li>I will submit only original academic work, documents and materials.</li>'
// 									+'<li>I will complete all academic work/tasks independently without any support from any other individual(s) or resources.</li>'
// 									+'<li>I agree to be reviewed by '+SCHOOL_NAME+' (or its authorized individuals/bodies) to review/verify the authenticity (or quantity/parameters) of my academic work at any point during my learning period (or after completion of learning period or even after issuance of qualification certificates).</li>'
// 									+'<li>I agree that if my academic work (or any of its components as prescribed/required by '+SCHOOL_NAME+' for my particular course/grade/subject of study) is found to be misrepresented, counterfeit, copied, incomplete (or if there is a mismatch between the quality/quantity/nature of my academic work and the parameters prescribed/required by International Schooling), then my enrollment will be cancelled with immediate effect (irrespective of which stage my enrollment/learning is and even after the completion of my academic work) and I will not hold '+SCHOOL_NAME+' (or its authorized individuals/bodies) responsible/liable for the above actions taken by '+SCHOOL_NAME+'.</li>'
// 									+'<li>I may be asked to provide additional information, proof, material in support of the information provided by me (especially related to but not limited to academic credentials, coursework and other relevant information in support of my eligibility/candidature with '+SCHOOL_NAME+') especially if the information provided by me is incomplete, inconsistent (or with discrepancies) or not as per the prescribed requirements of '+SCHOOL_NAME+'.</li>'
// 									+'<li>I agree to complete all the credit/course requirements (including assessments) in the prescribed time/duration to earn my credits, in the absence of which I shall not be awarded any credits and I take complete responsibility of completing my coursework to be awarded credits (or my failure to earn credit due to the non-adherence to prescribed requirements of '+SCHOOL_NAME+') for the same.</li>'
// 									+'<li>I will not misrepresent any facts or details to '+SCHOOL_NAME+' and not forge/misrepresent any documents, signatures or credentials and any deviation from the above (or from any other truthful representation of details) shall render my candidature to be cancelled (null/void) by '+SCHOOL_NAME+' with immediate effect upon discovery of such misrepresentation(s).</li>'
// 									+'<li>I understand that all materials of International Schooling (including but not limited to all study materials used by me during my learning/coursework) are the sole and complete property of '+SCHOOL_NAME+' and I will not make any ‘commercial’ use of any of the '+SCHOOL_NAME+' courses, assignments, audio-visual resources, materials or any other collaterals.</li>'
// 									+'<li>It’s the responsibility of students and parents to go through the website for any upcoming notifications.</li>'
// 								+'</ol>'
// 								+'<div class="modal-footer" style="text-align: left;">'
// 									// +'<%--<div class="col-sm-2 col-xs-12" style="flex:1">'
// 									// 	+'<img src="'+PATH_FOLDER_IMAGE2+data.pgName+'.png" align="left" width="150px">'
// 									// +'</div> --%>'
// 									+'<div class="col-sm-12 col-xs-12" style="flex: 1; display: flex; align-items: center">'
// 										+'<span class="col-sm-12 col-xs-12">'
// 											+'<input type="checkbox" id="chkval" name="chkval" class="checkbox-lg" />'
// 											+'<label for="chkval" style="position:relative;top:-0.5px;color:#333;cursor:pointer">By clicking (ticking) the box here, I agree to abide by the above mentioned policies/points</label>'
// 										+'</span>'
// 										+'<button type="button" id="payTabData" class="btn btn-success" data-dismiss="modal" disabled="disabled" onclick="callSigninStudentPay(this,\'signup\');">Proceed</button>'
// 									+'</div>'
// 								+'</div>'
// 							+'</div>'
// 						+'</form>'
// 					+'</div>'
// 				+'</div>'
// 			+'</div>'
// 		+'</div>'
// 	}
// 	return html;
// }
			
function bookAnEnrollmentTNCModal(data){
	var html ='';
	if(data.pgs!=null || data.pgswu!=null || data.pgswt!=null){
		html+='<div class="modal fade theme-modal fade-scale" id="bookAnEnrollmentTNC" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static" data-keyboard="false">'
			+'<div class="modal-dialog modal-lg" role="document" style="top:50%;transform: translateY(-50%);">'
				+'<div class="modal-content" style="border-radius: 0; border: 0; margin-top:0 !important;">'
					+'<div class="modal-header theme-header white-text primary-bg white-txt-color" style="width: 97%; margin: 0 auto; border-radius: 0;position:relative;top:-25px;">'
						+'<h4 class="modal-title" style="color: #fff; margin-left: 10px;padding-right: 20px;"> Further to my successful completion of the ‘Reserve an Enrollment Seat’ process with '+SCHOOL_NAME+',  I agree to comply with the following as stated below, without any exceptions:</h4>'
						+'<button type="button" class="close" data-dismiss="modal" style="color:#fff">×</button>'
					+'</div>'
					+'<div class="modal-body" style="height:auto; max-height:60vh; overflow:auto;">'
						+'<form id="signupStage4" name="signupCourse" method="post" autocomplete="off">'
							+'<div class="agree">'
								+'<ol>'
									+'<li>I understand that by paying the ‘Reserve an Enrollment Seat’ Fee, I am only reserving my Enrollment Seat at '+SCHOOL_NAME+' and I will only get access to the learning platform once the Course Fee is paid in full.</li>'
									+'<li>I may be asked to provide additional information, and documents ( including but not limited to Age Proof, Address Proof, and Last Academic Proof) in support of the information provided by me (especially related to but not limited to academic credentials, coursework and other relevant information in support of my eligibility/candidature with '+SCHOOL_NAME+') especially if the information provided by me is incomplete, inconsistent (or with discrepancies) or not as per the prescribed requirements of '+SCHOOL_NAME+'.</li>'
									+'<li>I will not misrepresent any facts or details to '+SCHOOL_NAME+'. and not forge/misrepresent any documents, signatures, or credentials and any deviation from the above (or from any other truthful representation of details) shall render my candidature to be canceled (null/void) by '+SCHOOL_NAME+' with immediate effect upon discovery of such misrepresentation(s).</li>'
									+'<li>I understand that all materials of '+SCHOOL_NAME+' (including but not limited to all study materials used by me during my learning/coursework) are the sole and complete property of '+SCHOOL_NAME+' and I will not make any ‘commercial’ use of any of the '+SCHOOL_NAME+' courses, assignments, audio-visual resources, materials, or any other collaterals.</li>'
									+'<li>I understand that the ‘Reserve an Enrollment Seat’ amount will be deducted from the Course Fee (which is subject to changes) once paid.</li>'
									+'<li>Under any circumstances/conditions, the fee paid for ‘Reserve an Enrollment Seat’ is non-refundable, non-transferable and non-adjustable.</li>'
									// +'<li>‘Reserve an Enrollment Seat’ fee is valid till '+data.bookEnrollmentDuration+' days from the date of payment. My candidature shall be rendered null/void in case I fail to complete the Enrollment process.</li>'
									+'<li>It is my responsibility, as a student (or parent/guardian), to regularly check the website for any upcoming notifications. I understand and agree that '+SCHOOL_NAME+' will not send me notifications or updates separately.</li>'
									+'<li>'+SCHOOL_NAME+' reserves the right to amend, limit or revoke this offer at any time prior to purchase and accepts no responsibility for any technical issues resulting in the failure to pay.</li>'
								+'</ol>'
								+'<div class="modal-footer" style="text-align: left;">'
									// +'<div class="col-sm-2 col-xs-12" style="flex:1">'
									// 	+'<img src="'+PATH_FOLDER_IMAGE2+data.pgName+'.png'+SCRIPT_VERSION+'" align="left">'
									// +'</div>'
									+'<div class="col-sm-12 col-xs-12" style="flex: 1; display: flex; align-items: center">'
										+'<span class="col-sm-12 col-xs-12" style="flex: auto;">'
										+'<input type="checkbox" id="chkvalBook" class="checkbox-lg" name="chkvalBook" style="text-align: left">'
											+'<label for="chkvalBook" style="position:relative;top:-0.5px;color:#333;cursor:pointer"> I confirm that I have read and agree to the above-mentioned fee refund policy and terms & conditions</label>'
										+'</span>'
										+'<button type="button" id="payTabData" class="btn btn-success"data-dismiss="modal" disabled="disabled"onclick="callSigninStudentPay(this,\'signup\');">Pay Now</button>'
									+'</div>'
								+'</div>'
							+'</div>'
						+'</form>'
					+'</div>'
				+'</div>'
			+'</div>'
		+'</div>';
	}
	return html;
}

function callPaymentStudentModal(data){
	var html ='';
	if(data.pgs!=null || data.pgswu!=null || data.pgswt!=null || data.pgsCash!=null || data.pgsAlternate!=null){
		html=
		'<div id="callPaymentStudentModal" class="modal theme-modal fade payment-opiton-modal" role="dialog" data-backdrop="static" data-keyboard="false" style="overflow: auto;">'
			+'<div class="modal-dialog modal-lg">'
				+'<div class="modal-content">'
					+'<div class="modal-header primary-bg white-txt-color" style="padding: 10px;">'
						+'<button type="button" class="close close-with-red-color" data-dismiss="modal" aria-label="Close">'
							+'<span aria-hidden="true" style="color: #fff;">×</span>'
						+'</button>'
						+'<h4 class="modal-title" style="font-size: 14px">&nbsp;</h4>'
					+'</div>'
					+'<div class="modal-body" style="margin-top: 0 !important; position: relative; padding: 15px !important;">'
						+'<section class="payment-option-wrapper">'
							+'<div class="full">'
								+'<h4 class="section-heading primary-bg-before primary-bg-after">PAYMENT OPTIONS AVAILABLE</h4>'
								+'<span style="width:100%;display:inline-block"><i class="fa fa-star text-primary"></i>&nbsp;'+SCHOOL_NAME+' is trusted by the safest and most reputed payment '+(SCHOOL_ID==1?'gateways, banks and wallets':'gateway and bank')+'</span>'
								// +'<button type="button" class="close" data-dismiss="modal" style="margin-top: -50px; color: #fff">&times; 2</button>'
							+'</div>'
							+'<div class="tab-wrapper">'
								+'<div class="payment-tabs">'
									+'<ul class="nav-tabs" role="tablist">';
										if(data.pgs!=null){
											html+=
											'<li role="presentation" class="'+(data.pgs!=null?"active":"")+' primary-bg-active">'
												// +'<a href="#credit-card-payment" aria-controls="uploadTab" role="tab" data-toggle="tab" class="payment-option-itme active-tab primary-border-color ">Pay via '+data.pgs.gatewayName+'</a>'
												+'<a href="#credit-card-payment" aria-controls="uploadTab" role="tab" data-toggle="tab" class="payment-option-itme active-tab primary-border-color ">Option 1: Pay via '+data.pgs.gatewayLabel+'</a>'
											+'</li>';
										}
										if(data.pgswu!=null){
											html+=
											'<li class="tab-item '+(data.pgs==null?"active":"")+' primary-bg-active primary-border-color">'
												+'<a href="#westernUnion" aria-controls="browseTab" role="tab" data-toggle="tab" class="payment-option-itme primary-border-color">'+data.pgswu.gatewayLabel+'</a>'
											+'</li>';
										}
										if(data.pgswt!=null){
											if(SCHOOL_ID == 6){
												html+=
												'<li class="tab-item '+(data.pgs==null && data.pgswu==null?"active":"")+' primary-bg-active">'
													+'<a href="#wire-payment" aria-controls="browseTab" role="tab" data-toggle="tab" class="payment-option-itme primary-border-color">'+data.pgswt.gatewayLabel+'</a>'
												+'</li>';
											}else{
												html+=
												'<li class="tab-item '+(data.pgs==null && data.pgswu==null?"active":"")+' primary-bg-active">'
													+'<a href="#wire-payment" aria-controls="browseTab" role="tab" data-toggle="tab" class="payment-option-itme primary-border-color">'+data.pgswt.gatewayLabel+'</a>'
												+'</li>';
											}
										}
										if(data.pgsAlternate!=null){
											html+=
											'<li class="tab-item primary-border-color'+(data.pgs==null && data.pgswu==null?"active":"")+' primary-bg-active">'
												// +'<a href="#alternate-payment" aria-controls="browseTab" role="tab" data-toggle="tab" class="payment-option-itme primary-border-color">Pay via '+toTitleCase(data.pgsAlternate.gatewayName)+'</a>'
												+'<a href="#alternate-payment" aria-controls="browseTab" role="tab" data-toggle="tab" class="payment-option-itme primary-border-color">Option 2: Pay via '+toTitleCase(data.pgsAlternate.gatewayName)+'</a>'
											+'</li>';
										}
										if(data.pgsCash!=null){
											html+=
											'<li class="tab-item primary-bg-active">'
												+'<a href="#cash-payment" aria-controls="browseTab" role="tab" data-toggle="tab" class="payment-option-itme primary-border-color">'+data.pgsCash.gatewayLabel+'</a>'
											+'</li>';
										}
										html+=
									'</ul>'
								+'</div>'
								+'<div class="payment-option tab-content">'
									+'<div role="tabpanel" id="credit-card-payment" class="tab-pane '+(data.pgs!=null?"active":"")+' credit-card-payment flex-item primary-border-color">'
										+'<div id="primary-pg" style="display:block;">'
											+'<div class="payment-icon lg">';
												if(data.pgName=='STRIPE'){
													html+='<img src="'+PATH_FOLDER_IMAGE+'STRIPE.png">';
												}else if(data.pgName=='Smoovpay'){
													html+='<img src="'+PATH_FOLDER_IMAGE+'SMOOVPAY.png">';
												}else if(data.pgName=='Airwallex'){
													html+='<img src="'+PATH_FOLDER_IMAGE+'AIRWALLEX.png">';
												}else if(data.pgName=='WELLSFARGO'){
													html+='<img src="'+PATH_FOLDER_IMAGE+'wells_fargo.png">';
												}
												html+=
											'</div>'
											+'<div class="payment-icon m-0">'
												+'<div class="payment-method-icon">'
													+'<img src="'+PATH_FOLDER_IMAGE+'visa.png">'
													+'<p>Visa</p>'
												+'</div>'
												+'<div class="payment-method-icon">'
													+'<img src="'+PATH_FOLDER_IMAGE+'master-card.png">'
													+'<p>Mastercard</p>'
												+'</div>'
											+'</div>';
											// +'<div class="payment-icon">'
											// 	+'<h3 class="fw-600">PAYMENT METHOD</h3>'
											// 	+'<img src="'+PATH_FOLDER_IMAGE+'visa.png">'
											// 	+'<img src="'+PATH_FOLDER_IMAGE+'master-card.png">'
											// +'</div>';
											// if(data.enrollmentType!='REGISTRATION_REGISTER'){
											// 	html+='<p>Your SMS profile will be created instantly after successful payment</p>';
											// }
											if(data.schoolId==1 || data.schoolId==2){
												html+=
												'<div class="payment-icon " style="margin-top:0;margin-bottom:10px;justify-content:flex-end">'
													+'<div class="smoov lg primary-bg white-txt-color" onclick="callCommonPaymentGateway(\'signupStage4\',\'student\',\'type=REGISTRATION_SUBJECT_FEE&userId='+data.userId+'&payId='+data.userPaymentDetailsId+'&paymentType='+data.paymentType+'&paymentByUserId='+data.paymentByUserId+'&entityType='+data.entityType+'&entityId='+data.entityId+'\', \''+data.pgs.gatewayName+'\');">'
														+'<span class="paypal-button-text" optional="" style="font-size: 18px; color:#fff; vertical-align: bottom;">Pay Now</span>'
													+'</div>'
												+'</div>';
											}
											if(data.cr !=null && data.pgs.gatewayName=='Smoovpay'){
												html+=
												'<div class="full">'
													+'<p>Our payment partner will display the Course Fees in Singapore Dollars on the payment page. The current Singapore Dollar rate is:</p>'
													+'<p> <strong>1 '+data.fromCurrency+' = '+data.cr.conversionRation+' '+data.toCurrency+'</strong> </p>'
													+'<p> <strong>Total payable fee: '+data.finalPayableAmountAfterCalculation+' '+data.toCurrency+'</strong></p>'
												+'</div>';
											}
											if(data.pgs != null && data.pgs.gatewayName=='Smoovpay'){
												html+=
												'<div class="payment-icon " style="margin-top:0;margin-bottom:10px;justify-content:flex-end">'
													+'<div class="smoov lg primary-bg white-txt-color" onclick="callCommonPaymentGateway(\'signupStage4\',\'student\',\'type=REGISTRATION_SUBJECT_FEE&userId='+data.userId+'&payId='+data.userPaymentDetailsId+'&paymentType='+data.paymentType+'&paymentByUserId='+data.paymentByUserId+'&entityType='+data.entityType+'&entityId='+data.entityId+'\', \''+data.pgs.gatewayName+'\');">'
														+'<span class="paypal-button-text" optional="" style="font-size: 18px; color:#fff; vertical-align: bottom;">Pay Now</span>'
													+'</div>'
												+'</div>';
											}else if(data.pgs != null && data.pgs.gatewayName=='Airwallex'){
												html+=commonAirwallexCheckout(data);
											}else if(data.pgs != null && data.pgs.gatewayName=='YOCO'){
												html+=commonYocoCheckout(data);
											}
											html+=
										'</div>'
									+'</div>';
									if(data.pgswu!=null){
										html+=
										'<div role="tabpanel" id="westernUnion" class="tab-pane '+(data.pgs==null?'active':'')+' credit-card-payment flex-item primary-border-color">'
											+'<div class="payment-icon lg">'
												+'<img src="'+PATH_FOLDER_IMAGE+'/convera-logo.svg">'
												+'<p>&nbsp;</p>'
												+'<h4 class="full fw-600 text-left">Payment Processing Time:</h4>'
												+'<strong class="full fw-600">Card Payments: Upto 3 business days</strong>'
												+'<strong class="full fw-600">Bank Transfer: 2-7 business days</strong>'
											+'</div>'
											+'<div class="payment-icon" style="margin-bottom:0">'
												+'<h3 class="fw-600 text-left">Pay money from the comfort of your own home – Reliable, convenient international money transfer using your home/local currency</h3>'
												+'<p>&nbsp;</p>'
												+'<div class="row">'
													+'<div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">'
														+'<ul class="full mt-4">'
															+'<li>'
																+'<h4 class="fw-600 text-left full">Step 1</h4>'
																+'<strong class="full">Select your preferred currency and click on Get Quote</strong>'
															+'</li>'
															+'<p style="margin:0">&nbsp;</p>'
															+'<li>'
																+'<h4 class="fw-600 text-left full">Step 2</h4>'
																+'<strong class="full">Verify your details – Student Name, Registered Email.</strong>'
															+'</li>'
															+'<li>'
																+'<br/>'
																+'<p>You can use a wide variety of services to complete your transactions. You can pay with your bank account or a credit/debit card* or use cash at your nearest in-person Convera agent location.</p>'
															+'</li>'
														+'</ul>'
													+'</div>'
													+'<div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">'
														//+'<iframe width="100%" height="225" src="https://www.youtube.com/embed/6XcIHVAaa04" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
													+'</div>'
												+'</div>'
											+'</div>'
											+'<div class="payment-icon m-0">'
												+'<div class="payment-method-icon">'
													+'<img src="'+PATH_FOLDER_IMAGE+'visa.png">'
													+'<p>Visa</p>'
												+'</div>'
												+'<div class="payment-method-icon">'
													+'<img src="'+PATH_FOLDER_IMAGE+'master-card.png">'
													+'<p>Mastercard</p>'
												+'</div>'
											+'</div>'		
											// +'<div class="payment-icon" style="margin-top:0">'
											// 	+'<h3 class="fw-600">We accept Mastercard and Visa</h3>'
											// 	+'<img src="'+PATH_FOLDER_IMAGE+'visa.png">'
											// 	+'<img src="'+PATH_FOLDER_IMAGE+'master-card.png">'
											// +'</div>'
											+'<div class="payment-icon" style="margin-top:0;margin-bottom:10px;justify-content:flex-end">'
												+'<div class="smoov lg primary-bg white-txt-color" onclick="callCommonPaymentGateway(\'signupStage4\',\'student\',\'type=INSTALLMENT-FEE&userId='+data.userId+'&payId='+data.userPaymentDetailsId+'&paymentType='+data.paymentType+'&paymentByUserId='+data.paymentByUserId+'&entityType='+data.entityType+'&entityId='+data.entityId+'\', \'CONVERA\');">'
													+'<span class="paypal-button-text" optional="" style="font-size: 18px; color:#fff; vertical-align: bottom;" >Pay Now</span>'
												+'</div>'
											+'</div>'
										+'</div>';
									}
									if(data.pgswt!=null){
										html+=
										'<div role="tabpanel" id="wire-payment" class="tab-pane '+(data.pgs==null && data.pgswu ==null?'active':'')+' wire-payment flex-item primary-border-color">'
											+'<div class="payment-icon lg" style="mragin-top:0">';
											// if(SCHOOL_ID != 6){
											// 	html +='<img src="'+PATH_FOLDER_IMAGE+'wt.png">';
											// }
											html += 
											'</div>'
											+'<div class="full">';
												if(SCHOOL_ID == 1){
													html+=
													'<p>If you choose this method, please add US $35.00 to cover the bank’s fees for wire transfer charges. Here are the banking instructions for your payment:</p>'
													+'<ul>'
														+'<li>'
															+'<strong>BIC Name: Oversea-Chinese BankingCorporation Limited</strong>'
														+'</li>'
														+'<li>'
															+'<strong>Bank Address: 63 Chulia Street, #11-01, OCBC Centre East, Singapore - 049514</strong>'
														+'</li>'
														+'<li>'
															+'<strong>Swift Code: OCBCSGSG </strong>'
														+'</li>'
														+'<li>'
															+'<strong>Bank Code: 7339 </strong>'
														+'</li>'
														+'<li>'
															+'<strong>Branch Code: 503</strong></li>'
														+'<li>'
															+'<strong>Account Name: INTERNATIONAL SCHOOLING PTE. LTD.</strong>'
														+'</li>'
														+'<li>'
															+'<strong>Account Number: 503396020301</strong>'
														+'</li>'
													+'</ul>';
												}else if(SCHOOL_ID == 2){
													html+=
													'<p>Here are the banking instructions for your payment:</p>'
													+'<ul>'
														+'<li>'
															+'<strong>Bank: Your Bank</strong>'
														+'</li>'
														+'<li>'
															+'<strong>Account Name: Your School Name</strong>'
														+'</li>'
														+'<li>'
															+'<strong>Account Number: 99999999</strong>'
														+'</li>'
														+'<li>'
															+'<strong>Branch Code: abc123</strong>'
														+'</li>'
													+'</ul>';
												}else if(SCHOOL_ID == 5){
													html+=
													'<p>Here are the banking instructions for your payment:</p>'
													+'<ul>'
														+'<li>'
															+'<strong>Bank: FNB Bank</strong>'
														+'</li>'
														+'<li>'
															+'<strong>Account Name: ANCHORED EDUCATION (PTY) LTD</strong>'
														+'</li>'
														+'<li>'
															+'<strong>Account Number: 62861814385</strong>'
														+'</li>'
														+'<li>'
															+'<strong>Branch Code: 250655</strong>'
														+'</li>'
													+'</ul>';
												}else if(SCHOOL_ID == 6){
													html+=
													'<p>Here are the banking instructions for your payment:</p>'
													+'<ul>'
														+'<li>'
															+'<strong>Provide your bank details</strong>'
														+'</li>'
													+'</ul>';
												}else{
													html+=
													'<p>Here are the banking instructions for your payment:</p>'
													+'<ul>'
														+'<li>'
															+'<strong>Provide your bank details</strong>'
														+'</li>'
													+'</ul>';
												}
												html+=
												'<p>Please clearly identify Student Name and City/State/Country in the reference information that accompanies the wire transfer, so that we can properly credit your account.</p>'
												+'<p>Your SMS profile will be created after the complete payment is processed in '+SCHOOL_NAME+'\'s bank Account</p>'
											+'</div>'
											+'<div class="payment-form">'
												+'<div id="wirePaymentForm" name="wirePaymentForm">'
													+'<input type="hidden" name="userPaymentDetailsId" id="userPaymentDetailsId" value="'+data.userPaymentDetailsId+'" />'
													+'<input type="hidden" name="paymentTitle" id="paymentTitle" value="'+data.paymentTitle+'" />'
													+'<ul>'
														+'<li>'
															+'<label>Payable Fee &nbsp;<b> '+data.currencyIsoCode+'</b></label>'
															+'<input type="text" name="wireTransferAmount" disabled placeholder="Fee" id="wireTransferAmount" required="" value="'+data.wireTransferAmount+'">'
														+'</li>'
														+'<li>'
															+'<label>Reference Number</label>'
															+'<input type="text" id="referenceNumber" name="referenceNumber" placeholder="Reference Number" maxlength="150" required="" onKeyDown="hideModalMessage(\'\');">'
														+'</li>'
														+'<li>'
															+'<label>Proof of Payment</label>'
															+'<div class="upload-btn-wrapper">'
																+'<div class="file-btn">'
																	+'<span id="fileName9" class="fileName" style="display: none;"></span> '
																	+'<input type="file" name="fileupload9" id="fileupload9" value="Upload Proof of Payment"/> '
																	+'<span class="btn primary-bg white-txt-color">Upload Proof of Payment</span>'
																+'</div>'
																+'<div id="divshowDocument9" class="custom-btn" style="display: none;">'
																	+'<div>'
																		+'<a id="showDocument9" href="javascript:showDocument(\'\');" target="_self" data-toggle="tooltip" title="View"> '
																			+'<i class="fa fa-eye"></i>'
																		+'</a>'
																	+'</div>'
																+'</div>'
																+'<div id="divdeleteDocument9" class="custom-btn" style="display: none;">'
																	+'<div>'
																		+'<a id="deleteDocument9" href="javascript.void(0)" data-toggle="tooltip" title="Delete"> '
																			+'<i class="fa fa-trash"></i>'
																		+'</a>'
																	+'</div>'
																+'</div>'
																+'<p>Please upload files in following formats (jpg, jpeg, pdf or png) with maximum size of 5 MB</p>'
															+'</div>'
														+'</li>'
														+'<li>'
															+'<label>&nbsp;</label>'
															+'<div class="pay-now-btn primary-border-color">'
																+'<span class="btn ref-no-btn primary-bg white-txt-color" data-toggle="modal" onclick="callStudentTransferSubmitSignup(\'wirePaymentForm\',2,\'signup\','+data.paymentByUserId+',\''+data.pgswt.gatewayName+'\');">Submit</span>'
															+'</div>'
														+'</li>'
													+'</ul>'
												+'</div>'
											+'</div>'
										+'</div>';
									}
									if(data.pgsCash!=null){
										html+=
										'<div role="tabpanel" id="cash-payment" class="tab-pane cash-payment flex-item primary-border-color">'
											+'<div class="payment-icon lg" style="mragin-top:0">'
												+'<img src="'+PATH_FOLDER_IMAGE+'Cash.png">'
											+'</div>'
											+'<div class="full">'
												+'<p> Pay by cash</p>'
											+'</div>'
											+'<div class="payment-form">'
												+'<div id="cashPaymentForm" name="cashPaymentForm">'
													+'<input type="hidden" name="userPaymentDetailsId" id="userPaymentDetailsId" value="'+data.userPaymentDetailsId+'" />'
													+'<input type="hidden" name="paymentTitle" id="paymentTitle" value="'+data.paymentTitle+'" />'
													+'<ul>'
														+'<li>'
															+'<label>Payable Fee &nbsp;<b> '+data.currencyIsoCode+'</b></label>'
															+'<input type="text" name="wireTransferAmount" disabled placeholder="Fee" id="wireTransferAmount" required="" value="'+data.finalPayableAmount+'">'
														+'</li>'
														+'<li>'
															+'<label>Reference Number</label>'
															+'<input type="text" id="referenceNumber" name="referenceNumber" placeholder="Reference Number" maxlength="150" required="" onKeyDown="hideModalMessage(\'\');">'
														+'</li>'
														+'<li>'
															+'<label>Proof of Payment</label>'
															+'<div class="upload-btn-wrapper">'
																+'<div class="file-btn">'
																	+'<span id="fileName8" class="fileName" style="display: none;"></span> '
																	+'<input type="file" name="fileupload8" id="fileupload8" value="Upload Proof of Payment"/> '
																	+'<span class="btn primary-bg white-txt-color">Upload Proof of Payment</span>'
																+'</div>'
																+'<div id="divshowDocument8" class="custom-btn" style="display: none;">'
																	+'<div>'
																		+'<a id="showDocument8" href="javascript:showDocument(\'\');" target="_self" data-toggle="tooltip" title="View"> '
																			+'<i class="fa fa-eye"></i>'
																		+'</a>'
																	+'</div>'
																+'</div>'
																+'<div id="divdeleteDocument8" class="custom-btn" style="display: none;">'
																	+'<div>'
																		+'<a id="deleteDocument8" href="javascript.void(0)" data-toggle="tooltip" title="Delete"> '
																			+'<i class="fa fa-trash"></i>'
																		+'</a>'
																	+'</div>'
																+'</div>'
																+'<p>Please upload files in following formats (jpg, jpeg, pdf or png) with maximum size of 5 MB</p>'
															+'</div>'
														+'</li>'
														+'<li>'
															+'<label>&nbsp;</label>'
															+'<div class="pay-now-btn primary-border-color">'
																+'<span class="btn ref-no-btn primary-bg white-txt-color" data-toggle="modal" onclick="callStudentTransferSubmitSignup(\'cashPaymentForm\',2,\'signup\','+data.paymentByUserId+',\''+data.pgsCash.gatewayName+'\');">Submit</span>'
															+'</div>'
														+'</li>'
													+'</ul>'
												+'</div>'
											+'</div>'
										+'</div>';
									}
									if(data.pgsAlternate!=null){
										html+=
										'<div role="tabpanel" id="alternate-payment" class="tab-pane '+(data.pgs==null && data.pgswu ==null?'active':'')+' alternate-payment flex-item primary-border-color">'
											+'<div id="alternate-pg">'
												+'<div class="payment-icon lg">';
													if(data.pgsAlternate.gatewayName=='Stripe'){
														html+='<img src="'+PATH_FOLDER_IMAGE+'STRIPE.png">';
													}else if(data.pgsAlternate.gatewayName=='Smoovpay'){
														html+='<img src="'+PATH_FOLDER_IMAGE+'SMOOVPAY.png">';
													}else if(data.pgsAlternate.gatewayName=='Airwallex'){
														html+='<img src="'+PATH_FOLDER_IMAGE+'AIRWALLEX.png">';
													}else if(data.pgsAlternate.gatewayName=='WELLSFARGO'){
														html+='<img src="'+PATH_FOLDER_IMAGE+'wells_fargo.png">';
													}else if(data.pgsAlternate.gatewayName=='Cash'){
														html+='<img src="'+PATH_FOLDER_IMAGE+'Cash.png">';
													}
													html+=
												'</div>'
												// +'<div class="payment-icon">'
												// 	+'<h3 class="fw-600">We accept Mastercard and Visa</h3>'
												// 	+'<img src="'+PATH_FOLDER_IMAGE+'visa.png">'
												// 	+'<img src="'+PATH_FOLDER_IMAGE+'master-card.png">'
												// +'</div>';
												// +'<div class="payment-icon m-0">'
												// 	+'<h5 class="fw-600">PAYMENT METHODS</h5>'
												// +'</div>'
												+'<div class="payment-icon m-0">'
													+'<div class="payment-method-icon">'
														+'<img src="'+PATH_FOLDER_IMAGE+'visa.png">'
														+'<p>Visa</p>'
													+'</div>'
													+'<div class="payment-method-icon">'
														+'<img src="'+PATH_FOLDER_IMAGE+'master-card.png">'
														+'<p>Mastercard</p>'
													+'</div>'
													+'<div class="payment-method-icon">'
														+'<img src="'+PATH_FOLDER_IMAGE+'american-express.png">'
														+'<p>American Express</p>'
													+'</div>'
													+'<div class="payment-method-icon">'
														+'<img src="'+PATH_FOLDER_IMAGE+'Union-Pay.png">'
														+'<p>UnionPay</p>'
													+'</div>'
													+'<div class="payment-method-icon">'
														+'<img src="'+PATH_FOLDER_IMAGE+'JCB-Pay.png">'
														+'<p>JCB</p>'
													+'</div>'
													+'<div class="payment-method-icon">'
														+'<img src="'+PATH_FOLDER_IMAGE+'Apple-Pay.png">'
														+'<p>Apple Pay</p>'
													+'</div>'
													+'<div class="payment-method-icon">'
														+'<img src="'+PATH_FOLDER_IMAGE+'g-pay.png">'
														+'<p>Google Pay</p>'
													+'</div>'
													+'<div class="payment-method-icon">'
														+'<img src="'+PATH_FOLDER_IMAGE+'we-chat-pay.png">'
														+'<p>WeChat Pay</p>'
													+'</div>'
													+'<div class="payment-method-icon">'
														+'<img src="'+PATH_FOLDER_IMAGE+'alipay.webp">'
														+'<p>Alipay</p>'
													+'</div>'
													+'<div class="payment-method-icon">'
														+'<img src="'+PATH_FOLDER_IMAGE+'bancontact-pay.svg">'
														+'<p>Bancontact</p>'
													+'</div>'
													+'<div class="payment-method-icon">'
														+'<img src="'+PATH_FOLDER_IMAGE+'my-bank-pay.png">'
														+'<p>MyBank</p>'
													+'</div>'
													+'<div class="payment-method-icon">'
														+'<img src="'+PATH_FOLDER_IMAGE+'ideal-pay.png">'
														+'<p>iDEAL</p>'
													+'</div>'
													+'<div class="payment-method-icon">'
														+'<img src="'+PATH_FOLDER_IMAGE+'klarna-pay.png">'
														+'<p>Sofort</p>'
													+'</div>'
													+'<div class="payment-method-icon">'
														+'<img src="'+PATH_FOLDER_IMAGE+'pay-easy.png">'
														+'<p>Pay-easy</p><p class="blink-bg-warning text-dark p-0"><span class="blink-text">Coming soon</span></p>'
													+'</div>'
													+'<div class="payment-method-icon">'
														+'<img src="'+PATH_FOLDER_IMAGE+'Konbini-pay.png">'
														+'<p>Konbini</p><p class="blink-bg-warning text-dark p-0"><span class="blink-text">Coming soon</span></p>'
													+'</div>'
													+'<div class="payment-method-icon">'
														+'<img src="'+PATH_FOLDER_IMAGE+'kakao-pay.png">'
														+'<p>Kakao Pay</p><p class="blink-bg-warning text-dark p-0"><span class="blink-text">Coming soon</span></p>'
													+'</div>'
												+'</div>';
												// if(data.enrollmentType!='REGISTRATION_REGISTER'){
												// 	html+='<p>Your SMS profile will be created instantly after successful payment</p>';
												// }
												if(data.cr && data.pgsAlternate.gatewayName=="Smoovpay"){
													html+=
													'<div class="full">'
														+'<p>Our payment partner will display the Course Fees in Singapore Dollars on the payment page. The current Singapore Dollar rate is:</p>'
														+'<p> <strong>1 '+data.fromCurrency+' = '+data.cr.conversionRation+' '+data.toCurrency+'</strong> </p>'
														+'<p> <strong>Total payable fee: '+data.finalPayableAmountAfterCalculation+' '+data.toCurrency+'</strong></p>'
													+'</div>';
												}
												if(data.pgsAlternate.gatewayName=='Airwallex'){
													
												}
												html+=
												'<div class="payment-icon " style="margin-top:0;margin-bottom:10px;justify-content:flex-end">'
													+'<div class="smoov lg primary-bg white-txt-color" onclick="callCommonPaymentGateway(\'signupStage4\',\'student\',\'type=REGISTRATION_SUBJECT_FEE&userId='+data.userId+'&payId='+data.userPaymentDetailsId+'&paymentType='+data.paymentType+'&paymentByUserId='+data.paymentByUserId+'&entityType='+data.entityType+'&entityId='+data.entityId+'\', \''+data.pgsAlternate.gatewayName+'\');">'
														+'<span class="paypal-button-text" optional="" style="font-size: 18px; color:#fff; vertical-align: bottom;">Pay Now</span>'
													+'</div>'
												+'</div>'
											+'</div>'
										+'</div>';
									}
									html+=
								'</div>'
							+'</div>'
						+'</section>'
					+'</div>'
				+'</div>'
			+'</div>'
		+'</div>';
	}
	return html;	
}

function commonYocoCheckout(data){
	var html = '';
	if(data.yocoData != null){
		html+=
		'<div class="payment-icon " style="margin-top:0;margin-bottom:10px;justify-content:flex-end" style="display:none;">'
			+'<div id="yocopaymentbutton" class="smoov lg primary-bg white-txt-color">'
				+'<span class="paypal-button-text" optional="" style="font-size: 18px; color:#fff; vertical-align: bottom;">Pay Now</span>'
			+'</div>'
		+'</div>';
	}
	return html;
}

function commonAirwallexCheckout(data){
	var html = 
	'<div class="payment-icon " style="margin-top:0;margin-bottom:10px;justify-content:flex-end">'
		+'<div id="hpp" class="smoov lg primary-bg white-txt-color" onclick="callCommonPaymentGateway(\'signupStage4\',\'student\',\'type=REGISTRATION_SUBJECT_FEE&userId='+data.userId+'&payId='+data.userPaymentDetailsId+'&paymentType='+data.paymentType+'&paymentByUserId='+data.paymentByUserId+'&entityType='+data.entityType+'&entityId='+data.entityId+'\', \''+data.pgsAlternate.gatewayName+'\');">'
			+'<span class="paypal-button-text" optional="" style="font-size: 18px; color:#fff; vertical-align: bottom;">Pay Now</span>'
		+'</div>'
	+'</div>';
	return html;
}

function referenceNumberModal(data){
	var html = '';
	if(data.pgs!=null || data.pgswu!=null || data.pgswt!=null){
		html+='<div class="modal fade theme-modal fade-scale " id="reference_number" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static" data-keyboard="false">'
			+'<div class="modal-dialog modal-lg" role="document" style="top:50%;transform: translateY(-50%);">'
				+'<div class="modal-content" style="border-radius: 0; border: 0; margin-top:0 !important;">'
					+'<div class="modal-header theme-header white-text" style="width: 97%; margin: 0 auto; border-radius: 0;position:relative;top:-25px;">'
						+'<h4 class="modal-title" style="color: #fff; margin-left: 10px;">Confirmation!</h4>'
						+'<button type="button" class="close" data-dismiss="modal" aria-label="Close">'
							+'<span aria-hidden="true" style="color: #fff;">×</span>'
						+'</button>'
					+'</div>'
					+'<div class="modal-body" style="height:auto; max-height:60vh; overflow:auto;">'
						+'<div class="full form">'
							+'<h4 class="modal-title fw-600">Are you sure you want to submit this reference number? Once submitted, you won’t be able to change this number again.</h4>'
							+'<hr/>'
							+'<div class="full text-right">'
								+'<button type="button" class="btn bg-primary text-white" id="proceedStudentPayment" data-dismiss="modal" style="background: #5cb85c !important">Yes</button>'
								+'<button type="button" class="btn bg-primary text-white" id="cancelStudentPayment" data-dismiss="modal" style="background: #da5652 !important">No</button>'
							+'</div>'
						+'</div>'
					+'</div>'
				+'</div>'
			+'</div>'
		+'</div>';
	}
	return html;	
}

function logoutModalLogout(data){
	var html = '';
	if(data.pgs!=null || data.pgswu!=null || data.pgswt!=null){
		html='<div class="modal fade theme-modal fade-scale " id="logout_modal_logout" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static" data-keyboard="false">'
			+'<div class="modal-dialog modal-lg" role="document" style="top:50%;transform: translateY(-50%);">'
				+'<div class="modal-content" style="border-radius: 0; border: 0; margin-top:0 !important;">'
					+'<div class="modal-header theme-header white-text" style="width: 97%; margin: 0 auto; border-radius: 0;position:relative;top:-25px;">'
						+'<h4 class="modal-title" style="color: #fff; margin-left: 10px;">Payment Under Review</h4>'
					+'</div>'
					+'<div class="modal-body" style="height:auto; max-height:60vh; overflow:auto;">'
						+'<div class="full text-center">'
							+'<br/>'
							+'<h2 class="modal-title  text-center fw-600 " style="margin-bottom: 15px;">Your payment is under review.</h2>'
							+'<h4 class="modal-title  text-center">';
								if(data.enrollmentType!='REGISTRATION_REGISTER'){
									html+='You will be able to access the dashboard once the payment is received.';
								}
								html+=
								'You can contact us at ' 
								+'<b>'
									+' <a href="mailto:'+data.contactEmail+'" target="_blank">'+data.contactEmail+'</a>'
								+'</b> for more information'
							+'</h4>'
							+'<br/>'
							+'<p class="text-center">'
								+'<button type="button" class="btn bg-primary text-white" onclick="logout();">Log out</button>'
							+'</p>'
						+'</div>'
					+'</div>'
				+'</div>'
			+'</div>'
		+'</div>';
	}
	return html;	
}

// function wuPaymentWarningModal(data){
// 	var html = '';
// 	if(data.pgswu!=null){
// 		html='<div class="modal fade theme-modal fade-scale " id="wu_payment_warning" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static" data-keyboard="false">'
// 			+'<div class="modal-dialog modal-lg" role="document" style="top:50%;transform: translateY(-50%);">'
// 				+'<div class="modal-content" style="border-radius: 0; border: 0; margin-top:0 !important;">'
// 					+'<div class="modal-header theme-header white-text" style="width: 97%; margin: 0 auto; border-radius: 0;position:relative;top:-25px;">'
// 						+'<h4 class="modal-title" style="color: #fff; margin-left: 10px;">Payment Under Verification</h4>'
// 					+'</div>'
// 					+'<div class="modal-body" style="height:auto; max-height:60vh; overflow:auto;">'
// 						+'<div class="full text-center">'
// 							+'<br/>'
// 							+'<h2 class="modal-title  text-center fw-600" style="margin-bottom: 15px;">Your payment is under verification.</h2>'
// 							+'<h4 class="modal-title  text-center">';
// 							if(data.enrollmentType!='REGISTRATION_REGISTER'){
// 								html+='Your payment is under verification. You will be able to access the dashboard once the payment is received.';
// 							}else{
// 								html+='Your payment is under verification.';
// 							}
// 							html+=
// 								'You can contact us at '
// 								+'<b> <a href="mailto:'+data.contactEmail+'" target="_blank">'+data.contactEmail+'</a></b>'
// 								+'for more information'
// 							+'</h4>'
// 							+'If you would like to choose another payment method, kindly <a href="javascript:void(0);" onclick="$(\'#wu_payment_warning\').modal(\'hide\');callSigninStudentPay(this,\'signup\');" class="anchor-color">click here</a>'
// 							+'<br/>'
// 							+'<p class="text-center">'
// 								+'<button type="button" class="btn bg-primary text-white" onclick="logout();">Log out</button>'
// 							+'</p>'
// 						+'</div>'
// 					+'</div>'
// 				+'</div>'
// 			+'</div>'
// 		+'</div>';
// 	}
// 	return html;
// }

// function k12EnrollFeeModal(data){
// 	var html = '';
// 	if(data.pgs!=null || data.pgswu!=null || data.pgswt!=null){
// 		html='<div class="modal fade theme-modal fade-scale " id="k12EnrollFee" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static" data-keyboard="false">'
// 			+'<div class="modal-dialog modal-lg" role="document" style="top:50%;transform: translateY(-50%);">'
// 				+'<div class="modal-content" style="border-radius: 0; border: 0; margin-top:0 !important;">'
// 					+'<div class="modal-header theme-header white-text" style="width: 97%; margin: 0 auto; border-radius: 0;position:relative;top:-25px;">'
// 						+'<h4 class="modal-title" style="color: #fff; margin-left: 10px;">Registration with '+SCHOOL_NAME+'</h4>'
// 					+'</div>'
// 					+'<div class="modal-body" style="height:auto; max-height:60vh; overflow:auto;">'
// 						+'<form id="signupStage4" name="signupCourse" method="post" autocomplete="off">'
// 							+'<div class="agree">'
// 								+'<span style="margin-top: 25px; width: 100%; padding: 25px; color: #0056ad; font-weight: 550; font-size: 15px; line-height: 30px; background: #ebf5ff; float: left;">'
// 									+'We confirm your online payment of '
// 									+'<span style="color: #0e0f10; font-size: 17px;">US $100.0</span> '
// 									+'is completed successfully. Your enrollment seat has been successfully booked. You can download the receipt by clicking on the button below.<br> '
// 									+'<span style="text-align: center; padding: 0 0 0 0 0">';
// 										if(data.returnUrl!=null){
// 											html+='<a target="_blank" href="'+data.returnUrl+'" class="btn btn-default btn-md" style="width: 100%;">Download Reserve an Enrollment Seat receipt</a>';
// 										}
// 										html+=
// 									'</span>'
// 									+'<br/>'
// 									+'You can contact us at <u>'+data.contactEmail+'</u> for more information regarding elementary enrollment.'
// 								+'</span>'
// 								+'<p class="text-center">'
// 									+'<button type="button" class="btn bg-primary text-white" onclick="logout();">Log out</button>'
// 								+'</p>'
// 							+'</div>'
// 						+'</form>'
// 					+'</div>'
// 				+'</div>'
// 			+'</div>'
// 		+'</div>';
// 	}
// 	return html;	
// }

function goToDashboardWarningMessageModal(data){
	var html='<div class="modal fade theme-modal fade-scale " id="goToDashboardWarningMessage" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static" data-keyboard="false">'
		+'<div class="modal-dialog modal-md" role="document" style="top:50%;transform: translateY(-50%);">'
			+'<div class="modal-content" style="border-radius: 0; border: 0; margin-top:0 !important;">'
				+'<div class="modal-header modal-header primary-bg white-txt-color">'
					+'<h4 class="modal-title" style="color: #fff; margin-left: 10px;">Application Under Review</h4>'
				+'</div>'
				+'<div class="modal-body" style="height:auto; max-height:60vh; overflow:auto;">'
					+'<div class="full form">'
						+'<h4 class="modal-title fw-600 text-center" id="submitApplicationMsg"></h4>'
						+'<hr />'
						+'<div class="full text-center">'
							+'<button type="button" class="btn theme-bg primary-hov-bg text-white" onclick="logoutConfimation(true, \''+BASE_URL+CONTEXT_PATH+SCHOOL_UUID+'/common/logout/'+UNIQUEUUID+'\')" >Log out</button>'
						+'</div>'
					+'</div>'
				+'</div>'
			+'</div>'
		+'</div>'
	+'</div>';
	return html;
}

// function smoovPayContent(data){
// 	var html =
// 		'<form id="smoovpayForm" action="" method="post">'
// 			+'<input type="hidden" name="action" value="pay" />'
// 			+'<input type="hidden" name="currency" value="'+data.currencyIsoCode+'" />'
// 			+'<input type="hidden" name="version" value="2.0" />'
// 			+'<input type="hidden" name="item_name_1" value="" />'
// 			+'<input type="hidden" name="item_description_1" value="" />'
// 			+'<input type="hidden" name="item_quantity_1" value="" />'
// 			+'<input type="hidden" name="item_amount_1" value="" />'
// 			+'<input type="hidden" name="merchant" value="" />'
// 			+'<input type="hidden" name="ref_id" value="" />'
// 			+'<input type="hidden" name="delivery_charge" value="" />'
// 			+'<input type="hidden" name="tax_amount" value="" />'
// 			+'<input type="hidden" name="tax_percentage" value="" />'
// 			+'<input type="hidden" name="total_amount" value="" />'
// 			+'<input type="hidden" name="str_url" value="" />'
// 			+'<input type="hidden" name="success_url" value="" />'
// 			+'<input type="hidden" name="cancel_url" value="" />'
// 			+'<input type="hidden" name="signature" value="" />'
// 			+'<input type="hidden" name="signature_algorithm" value="" />'
// 			+'<input type="hidden" name="submit v2" alt="SmoovPay!" />'
// 			+'<input type="hidden" name="skip_success_page" value="1" />'
// 		+'</form>';
// 	return html;	
// }

function skeletonStudent(){
	var html=
	'<h3 class="alternate-txt-color">Student Details</h3>'
	+'<div class="step1-skeleton">'
		+'<div class="form-row">'
			+'<div class="form-holder skeleton" style="height:42px"></div>'
			+'<div class="form-holder skeleton" style="height:42px"></div>'
			+'<div class="form-holder skeleton" style="height:42px"></div>'
		+'</div>'
		+'<div class="form-row">'
			+'<div class="form-holder skeleton" style="height:42px"></div>'
			+'<div class="form-holder skeleton" style="height:42px"></div>'
			+'<div class="form-holder skeleton" style="height:42px"></div>'
		+'</div>'
		+'<div class="form-row mb-2 skeleton" style="width:125px;height:21px"></div>'
		+'<div class="form-row">'
			+'<div class="form-holder skeleton" style="height:42px"></div>'
			+'<div class="form-holder skeleton" style="height:42px"></div>'
			+'<div class="form-holder skeleton" style="height:42px"></div>'
		+'</div>'
		+'<div class="form-row">'
			+'<div class="form-holder skeleton" style="height:42px"></div>'
			+'<div class="form-holder skeleton" style="height:42px"></div>'
		+'</div>'
	+'</div>';
	return html;
}

function skeletonParent(){
	var html=
	'<h3></h3>'
	+'<div class="step2-skeleton">'
		+'<div class="form-row">'
			+'<div class="form-holder skeleton" style="height:42px"></div>'
			+'<div class="form-holder skeleton" style="height:42px"></div>'
			+'<div class="form-holder skeleton" style="height:42px"></div>'
		+'</div>'
		+'<div class="form-row">'
			+'<div class="form-holder skeleton" style="height:42px"></div>'
			+'<div class="form-holder skeleton" style="height:42px"></div>'
			+'<div class="form-holder skeleton" style="height:42px"></div>'
		+'</div>'
		+'<div class="form-row mb-2 skeleton" style="width:125px;height:36px"></div>'
		+'<div class="form-row">'
			+'<div class="form-holder skeleton" style="height:42px"></div>'
			+'<div class="form-holder skeleton" style="height:42px"></div>'
			+'<div class="form-holder skeleton" style="height:42px"></div>'
		+'</div>'
		+'<div class="form-row">'
			+'<div class="form-holder skeleton" style="height:42px"></div>'
			+'<div class="form-holder" style="height:42px"></div>'
			+'<div class="form-holder skeleton" style="height:42px"></div>'
		+'</div>'
	+'</div>';
	return html;
}

function skeletonCourseSelection(){
	var html=
	'<h3 class="mb-1 select-grade-title">'
		+'<span>YOUR COURSES IN</span>'
		
	+'</h3>'
	+'<div class="step3-skeleton">'
		+'<div class="skeleton" style="height:39px;margin-bottom:25px"></div>'
		+'<div class="form-row">'
			+'<div class="form-holder selected-course-view" style="padding:20px; margin-right:20px;min-height:250px;background:#f6f6f6;">'
				+'<ul>'
					+'<li class="skeleton" style="margin-bottom:5px;height: 21px;"></li>'
					+'<li class="skeleton" style="margin-bottom:5px;height: 21px;"></li>'
					+'<li class="skeleton" style="margin-bottom:5px;height: 21px;"></li>'
					+'<li class="skeleton" style="margin-bottom:5px;height: 21px;"></li>'
					+'<li class="skeleton" style="margin-bottom:5px;height: 21px;"></li>'
					+'<li class="skeleton" style="margin-bottom:5px;height: 21px;"></li>'
					+'<li class="skeleton" style="margin-bottom:5px;height: 21px;"></li>'
					+'<li class="skeleton" style="margin-bottom:5px;height: 21px;"></li>'
				+'</ul>'
			+'</div>'
			+'<div class="form-holder selected-course-view" style="padding:20px; margin-right:20px; min-height:250px;background:#f6f6f6;">'
				+'<ul>'
					+'<li class="skeleton" style="margin-bottom:5px;height: 37px;"></li>'
					+'<li class="skeleton" style="margin-bottom:5px;height: 37px;"></li>'
					+'<li class="skeleton" style="margin-bottom:5px;height: 37px;"></li>'
					+'<li class="skeleton" style="margin-bottom:5px;height: 37px;"></li>'
					+'<li class="skeleton" style="margin-bottom:5px;height: 37px;"></li>'
					+'<li class="skeleton" style="margin-bottom:5px;height: 37px;"></li>'
				+'</ul>'
			+'</div>'
		+'</div>'
	+'</div>';
	return html;
}

function skeletonFeeDetails(){
	var html =
	'<div class="full step-feeDetails-skeleton">'
		+'<div class="fee-details-skeletion">'
			+'<div class="payment-item">'
				+'<div class="radio-payment-option skeleton" style="height:88px;border-right:2px solid #fff;"></div>'
				+'<div class="radio-payment-option skeleton" style="height:88px"></div>'
			+'</div>'
			+'<div class="table-responsive">'
				+'<table class="table table-bordered table-striped without_h_scroll" style="">'
					+'<thead class="theme-bg primary-bg white-txt-color">'
						+'<tr>'
						+'<th style="width: 60%;" class="skeleton">&nbsp;</th>'
						+'<th style="width: 20%;" class="skeleton">&nbsp;</th>'
						+'<th style="width: 20%;" class="skeleton">&nbsp;</th>'
						+'</tr>'
					+'</thead>'
					+'<tbody>'
						+'<tr>'
							+'<td class="skeleton" height="31px"></td>'
							+'<td class="skeleton" height="31px"></td>'
							+'<td class="skeleton" height="31px"></td>'
						+'</tr>'
						+'<tr>'
							+'<td class="skeleton" height="31px"></td>'
							+'<td class="skeleton" height="31px"></td>'
							+'<td class="skeleton" height="31px"></td>'

						+'</tr>'
						+'<tr>'
							+'<td class="skeleton" height="85px"></td>'
							+'<td class="skeleton" height="85px"></td>'
							+'<td class="skeleton" height="85px"></td>'
							
						+'</tr>'
						+'<tr>'
							+'<td class="skeleton" height="85px"></td>'
							+'<td class="skeleton" height="85px"></td>'
							+'<td class="skeleton" height="85px"></td>'
						+'</tr>'
						+'<tr>'
							+'<td class="skeleton" height="31px"></td>'
							+'<td class="skeleton" height="31px"></td>'
							+'<td class="skeleton" height="31px"></td>'
						+'</tr>'
					+'</tbody>'
				+'</table>'
			+'</div>'
			+'<div class="full">'
				+'<div class="form-holder skeleton" style="height:22px;width:75%"></div>'
			+'</div>'
		+'</div>'
	+'</div>';
	return html
}

function skeletonReviewPayment(){
	var html=
	'<h3>Kindly Review your details</h3>'
	+'<div class="step1-skeleton">'
		+'<div class="form-row">'
			+'<div class="form-holder skeleton" style="height:42px"></div>'
			+'<div class="form-holder skeleton" style="height:42px"></div>'
			+'<div class="form-holder skeleton" style="height:42px"></div>'
		+'</div>'
		+'<div class="form-row">'
			+'<div class="form-holder skeleton" style="height:42px"></div>'
			+'<div class="form-holder skeleton" style="height:42px"></div>'
			+'<div class="form-holder skeleton" style="height:42px"></div>'
		+'</div>'
		+'<div class="form-row mb-2 skeleton" style="width:125px;height:21px"></div>'
		+'<div class="form-row">'
			+'<div class="form-holder skeleton" style="height:42px"></div>'
			+'<div class="form-holder skeleton" style="height:42px"></div>'
			+'<div class="form-holder skeleton" style="height:42px"></div>'
		+'</div>'
		+'<div class="form-row">'
			+'<div class="form-holder skeleton" style="height:42px"></div>'
			+'<div class="form-holder skeleton" style="height:42px"></div>'
		+'</div>'
	+'</div>';
	return html;
}

function renderCustomizedCourse(data){
	$('#recommendedCourseModal').remove();
	$("#signupStage3Content").append(recommendedCourseModalContent(data));
	recommendedCourseContent(data);
	$("#recommendedCourseModal").modal("show");
}

function recommendedCourseContent(data){
	var html='';
	$('#recomendedCourses tbody').html(html);
	var courses='';
	var totalCredit = 0;

	var selectedSubjects = ($("#selectedSubjects").val() || '').split(',').map(id => id.trim());

	$.each(data.recommendedCourses, function(k, recommendedCourse) {
		courses+=recommendedCourse.subjectId+',';
		totalCredit+=(parseFloat(recommendedCourse.subjectCredit));
		html+=
		'<tr>'
			+'<td>'+(k+1)+'.</td>'
			+'<td>'
				+recommendedCourse.subjectName
			+'</td>'
			+'<td>'
				+recommendedCourse.subjectCredit
			+'</td>'
			+'<td class="text-center">';
				if(recommendedCourse.courseMandatory === 1 ){
					html+='<label for="add_recommended_course_id_'+(k+1)+'" class="btn btn-sm btn-success white-txt-color" style="margin:0" disabled>'
							+'<input type="checkbox" class="add-recommended-course add-recommended-course-mandatory" id="add_recommended_course_id_'+(k+1)+'" value="'+recommendedCourse.subjectId+'" style="opacity:0;width:1px;height:1px" checked disabled>'
						+'<span>Mandatory</span></label>';
				}else if (selectedSubjects.includes(String(recommendedCourse.subjectId))) {
					html += '<label for="add_recommended_course_id_'+(k+1)+'" class="btn btn-sm btn-danger white-txt-color" style="margin:0">'
						+ '<input type="checkbox" class="add-recommended-course add-recommended-course-already-selected" id="add_recommended_course_id_'+(k+1)+'" value="'+recommendedCourse.subjectId+'" style="opacity:0;width:1px;height:1px" checked data-checked="true" onchange="addRecommendedCourse(this)">'
						+ '<span>Remove&nbsp;<i class="fa fa-trash"></i></span></label>';
				}else{
					html+='<label for="add_recommended_course_id_'+(k+1)+'" class="btn btn-sm primary-bg white-txt-color" style="margin:0">'
						+'<input type="checkbox" class="add-recommended-course add-recommended-course-not-mandatory" id="add_recommended_course_id_'+(k+1)+'" value="'+recommendedCourse.subjectId+'" style="opacity:0;width:1px;height:1px" data-checked="false" onchange="addRecommendedCourse(this)">'
					+'<span><i class="fa fa-plus"></i>&nbsp;Add</span></label>';
				}
			html+='</td>'
		+'</tr>';
	});
	html+=
	'<tr>'
		+'<td>&nbsp;</td>'
		+'<td><b>Total Credit</b></td>'
		+'<td><b>'
			+totalCredit
		+'</b></td>'
		+'<td>&nbsp;</td>'
	+'</tr>';
	$('#recomendedCourses tbody').html(html);
	$('#recomendedCourses').attr('courses',courses);
	toggleAddRemoveAllBtn();
	updateConfirmButtonState();
}

function recommendedCourseModalContent(data){
	var html=
	'<div class="modal fade" id="recommendedCourseModal" tabindex="-1">'
		+'<div class="modal-dialog modal-md modal-dialog-centered" role="document">'
			+'<div class="modal-content">'
				+'<div class="modal-header primary-bg white-txt-color" style="display:flex;justify-content:space-between;border-top-left-radius:6px;border-top-right-radius:6px">'
					+'<h5 class="modal-title">Recommended Courses</h5>'
					+'<button type="button" class="close" data-dismiss="modal" aria-label="Close">'
						+'<span aria-hidden="true">×</span>'
					+'</button>'
				+'</div>'
				+'<div  class="modal-body" courses="">'
					+'<h4 class="full text-center mb-2"><b>We recommend these courses for '+data.gradeName+'</b></h4>'
					+'<table id="recomendedCourses" class="table recommend-course-table" courses="">'
						+'<thead>'
							+'<tr class="primary-bg white-txt-color">'
								+'<th>S.No.</th>'
								+'<th>Course Name</th>'
								+'<th>Credits</th>'
								+'<th class="text-center">'
										+'<label id="addAllRecommendedCourse" class="btn btn-sm white-bg primary-txt-color" style="margin:0" onclick="addAllRecommendedCourse()">'
											+'<span>Add All</span>'
										+'</label>'
										+'<label id="reomveAllRecommendedCourse" class="btn btn-sm btn-danger text-white" style="margin:0;display:none" onclick="reomveAllRecommendedCourse()">'
											+'<span>Remove All</span>'
										+'</label>'
								+'</th>'
							+'</tr>'
						+'</thead>'
						+'<tbody>'
						+'</tbody>'
					+'</table>'
					+'<p class="m-0"><b>Note: By adding the above recommended courses, your current course selection will be replaced. You can still add or remove courses.</b</p>'
				+'</div>';
				var confirmBtn = false;
				$.each(data.recommendedCourses, function(k, subject){
					if(subject.courseMandatory === 1){
						confirmBtn=true;
						return false;
					}
				});
				if(confirmBtn){
					html+='<div class="modal-footer py-2" style="background-color:#f8f9fa;border-top:1px solid #e9ecef;">'
						+'<a href="javascript:void(0)" class="btn primary-bg text-white;" id="confirmAndAddRecommendedCourse" onclick="chooseRecomendedCourse()"><b>Confirm</b></a>'
					+'</div>';
				}else{
					html+='<div class="modal-footer py-2" style="background-color:#f8f9fa;border-top:1px solid #e9ecef;">'
						+'<a href="javascript:void(0)" class="btn btn-light text-white;" id="confirmAndAddRecommendedCourse" onclick="chooseRecomendedCourse()" disabled><b>Confirm</b></a>'
					+'</div>';
				}
				
				
			html+='</div>'
		+'</div>'
	+'</div>';
	return html;
}

function logOutModalContent(){
	var html=
	// '<div class="modal fade theme-modal fade-scale max-size-modal" id="logoutSignupModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static" data-keyboard="false">'
	// 	+'<div class="modal-dialog modal-md modal-dialog-centered box-shadow-none" role="document">'
	// 		+'<div class="modal-content">'
	// 			// +'<div class="modal-header primary-bg white-txt-color">'
	// 			// 	+'<h4 class="modal-title " style=" margin-left: 10px;">Fee Details</h4>'
	// 			// 	+'<button type="button" class="close" aria-label="Close" data-dismiss="modal" style="margin-right: 5px;"><span style="color: #fff;">&times;</span></button>'
	// 			// +'</div>'
	// 			+'<div class="modal-body text-center" style="display:inline-block;width:100%;">'
	// 				+'<br/>'
	// 				+'<h3 class="form-heading alternate-txt-color"></h3>'
	// 				+'<a href="javascript:void(0)" class="btn primary-bg white-txt-color btn-sm">Yes</a>'
	// 				+'<a href="javascript:void(0)" class="btn primary-bg white-txt-color btn-sm" onclick="logoutConfimation(false)">No</a>'
	// 			+'</div>'
	// 		+'</div>'
	// 	+'</div>'
	// +'</div>';
	'<div class="modal fade" id="logoutSignupModal">'
		+'<div class="modal-dialog modal-sm modal-dialog-centered" role="document" style="box-shadow: none; width: 450px; max-width: 100%;">'
			+'<div class="modal-content text-center">'
				+'<div class="modal-header justify-content-center" style="width: 100% !important; padding: 0 0 !important; height: 45px; border: none;"></div>'
					+'<div class="modal-body delete-modal">'
						+'<i class="zmdi zmdi-power alternate-bg" style="color: #fff !important; border-radius: 50%; font-size: 40px; position: absolute; top: -85px; right: 0; left: 0; margin: 0 auto; width: 75px; line-height: 75px;"></i>'
						+'<p class="heading alternate-txt-color" style=" font-family: arial; font-size: 18px; line-height: 28px; letter-spacing: 0.3px;">Are you sure you want to logout?</p>'
					+'</div>'
					+'<div class="modal-footer text-center" style="border: none; padding: 0; margin-bottom: 15px;">'
						+'<div class="text-center" style="margin: 0 auto;">'
							+'<button type="button" data-dismiss="modal" class="btn alternate-txt-color" style="border: 1px solid #001b47 !important; background: transparent !important;"  onclick="logoutConfimation(true, \''+BASE_URL+CONTEXT_PATH+SCHOOL_UUID+'/common/logout/'+UNIQUEUUID+'\')">Yes</button>'
							+'<button type="button" class="btn" data-dismiss="modal" style="background:#001b47;">No</button>'
						+'</div>'
					+'</div>'
			+'</div>'
		+'</div>'
	+'</div>';
	return html;
}

function switchFlexyGradeWarningModal(){
	var html=
	`<div class="modal fade" id="gradeChangeWarning" data-backdrop="static">'
		<div class="modal-dialog modal-md modal-dialog-centered" role="document" >
			<div class="modal-content text-center">
				<div class="modal-header justify-content-center" style="width: 100% !important; padding: 0 0 !important; height: 45px; border: none;"></div>
				<div class="modal-body delete-modal">
					<i aria-hidden="true" class="fa fa-exchange alternate-bg white-txt-color" style="border-radius: 50%; font-size: 40px; position: absolute; top: -85px; right: 0; left: 0; margin: 0 auto; width: 75px; line-height: 75px;"></i>
					<p class="heading alternate-txt-color" id="gradeChangeWarningMessage"></p>
				</div>
				<div class="modal-footer text-center" style="border: none; padding: 0; margin-bottom: 15px;">
					<div class="text-center" style="margin: 0 auto;">
						<button type="button" id="gradeChangeWarningYes" class="btn alternate-txt-color" style="border: 1px solid #001b47 !important; background: transparent !important;">Yes</button>
						<button type="button" id="gradeChangeWarningNo" class="btn" data-dismiss="modal" style="background:#001b47;color:white">No</button>
					</div>
				</div>
			</div>
		</div>
	</div>`;
	return html;
}