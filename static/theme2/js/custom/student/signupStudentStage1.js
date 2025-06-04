$(document).ready(function(){
	$.validator.addMethod("letterRegex", function(value, element) {
		return this.optional(element) || /^[A-Z-a-z\s]+$/.test(value);
	}, "Field must contain only letters");

	$.validator.addMethod("numberRegex", function(value, element) {
		return this.optional(element) || /^[0-9-]+$/.test(value);
	}, "Field must contain only Numerical and without space");

	$.validator.addMethod("mobileRegex", function(phone_number, element) {
		phone_number = phone_number.replace(/\s+/g, "");
			return this.optional(element) || phone_number.length > 0 &&
				phone_number.match(/^(1-?)?(\([0-9]\d{2}\)|[0-9]\d{0})-?[0-9]\d{1}-?\d{0,12}$/);
	}, "Please enter a valid phone number");

	$.validator.addMethod("dateFormat", function (value, element) {
		var year = value.split('/');
		if ( value.match(/^\d\d?\/\d\d?\/\d\d\d\d$/) && parseInt(year[2]) <= 2002 &&  parseInt(year[2]) >= 1970 && parseInt(year[1]) <= 12){
			return true;
		}else{
			return false;
		}

	},"Please enter a date in the format dd/mm/yyyy");
	
	var currentStep = $(".step.active-step").index();
	var sectionLength = $(".step").length;
	if(currentStep == 0){
		$(".prev-btn").css({"visibility":"hidden", "opacity":"0"});
	}else{
		$(".prev-btn").css({"visibility":"visible", "opacity":"1"});
	}
	if(currentStep+1 == sectionLength ){
		$(".next-btn").hide();
		$(".finish-btn").show(); 
	}else{
		$(".next-btn").show();
		$(".finish-btn").hide(); 
	}
});

function validateRequestForSignupStudent(){
	/*if (!validateFormAscii()) {
		showMessage(0, 'Please use the English Keyboard while providing information');
		return false
	}*/
	if ($("#signupStage1 #firstName").val()=="") {
		showMessage(0, 'First Name is required');
		return false
	}
	if ($("#signupStage1 #lastName").val().trim()=="") {
		showMessage(0, 'Last Name is required');
		return false
	}
	if ($("#signupStage1 #applyStandardId").val().trim()=="") {
		showMessage(0, 'Grade is required');
		return false
	}
	if($('#signupStage1 #dob').val()!=""){
		var dobd =getDateInDateFormat($("#signupStage1 #dob").val());
		dobd = changeDateFormat(dobd, 'mm-dd-yyyy')
		var dob1=dobd.split("-");
		dobd = dobd.split("-").length;
		if(parseInt(dobd)!=3 || parseInt(dob1[1])>31 || parseInt(dob1[0])>12){
			showMessage(0, 'Date of Birth is not valid');
			return false;
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
		}else{
			$('#signupStage1 #checkAge').prop("checked",false);
		}
	}else{
		showMessage(0, 'Please choose your Date of Birth.');
		return false
	}
	if ($("#signupStage1 #gender").val()==0  || $("#signupStage1 #gender").val()=='') {
		showMessage(0, 'Gender is required');
		return false
	}
	if($('#learingProgramHeader').attr('val')=='DUAL_DIPLOMA'){
		if ($("#signupStage1 #studyingSchoolName").val()=="") {
			showMessage(0, 'Student\'s School Name is required');
			return false
		}
		if ($("#signupStage1 #studyingGradeId").val()==0 || $("#signupStage1 #studyingGradeId").val()=='') {
			showMessage(0, 'Student Current Grade is required');
			return false
		}
		if ($("#signupStage1 #countryIdOfSchool").val()==0 || $("#signupStage1 #countryIdOfSchool").val()=='') {
			showMessage(0, 'Country of School is required');
			return false
		}
	}else{
		if ($("#signupStage1 #communicationEmail").val()=="") {
			showMessage(0, 'Email is required');
			return false
		}
		if ($("#signupStage1 #contactNumber").val()=="") {
			showMessage(0, 'Phone No is required');
			return false
		}
		if ($("#signupStage1 #nationality").val()==0 || $("#signupStage1 #nationality").val()=='') {
			showMessage(0, 'Nationality is required');
			return false
		}
	}
	if ($("#signupStage1 #countryId").val()==0 || $("#signupStage1 #countryId").val()=='') {
		showMessage(0, 'Country is required');
		return false
	}
	if ($("#signupStage1 #stateId").val()==0 || $("#signupStage1 #stateId").val()=='') {
		showMessage(0, 'State/Province is required');
		return false
	}
	if ($("#signupStage1 #cityId").val()==0 || $("#signupStage1 #cityId").val()=='') {
		showMessage(0, 'City is required');
		return false
	}
//	if ($("#signupStage1 #countryCodeStudent").val()==null) {
//		showMessage(1, 'ISD code is required');
//		return false
//	}
	return true;
}

function callForSignupStudentDetails() {
	hideMessage('');
	if(!validateRequestForSignupStudent()){
		return false;
	}
	var dobd =getDateInDateFormat($("#signupStage1 #dob").val());
	dobd = changeDateFormat(dobd, 'mm-dd-yyyy')
	var dob1=dobd.split("-");
	dobd = dobd.split("-").length;
	if(parseInt(dobd)!=3 || parseInt(dob1[1])>31 || parseInt(dob1[0])>12){
		showMessage(0, 'Date of Birth is not valid');
		return false;
	}
	var MAX_AGE_LIMIT=29.941173;
	if($('#courseProviderId').val()==39){
		MAX_AGE_LIMIT=60;
	}else{
		MAX_AGE_LIMIT=30;
	}
	var age = M.countAgeNew(dob1[1], dob1[0], dob1[2]);
	if (age > MAX_AGE_LIMIT) {
		showMessage(false, 'Age of student should not be more then '+MAX_AGE_LIMIT+' years');
		return false;
	}
	setActiveStep(2);
	showSkeleton(true, "step2");
	$(".prev-btn, .next-btn").addClass("disabled");
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : BASE_URL + CONTEXT_PATH + SCHOOL_UUID +'/student/enrollment/save-student-details',
		data : JSON.stringify(getRequestForStudent()),
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
						setActiveStep(1);
					}
				}
			} else {
				showMessage(1, 'Student Details Updated.', '', true);
				callForParentSelection();
			}
		},
		error: function(e){
			if (checkonlineOfflineStatus()) {
				return;
			}
		}
	});
}

function getRequestForStudent(){
	var saveStudentDetailsRequestDTO = {};
	var authentication = {};
	var signupStudentDTO = {};
	signupStudentDTO['themeType'] = 'theme2';
	signupStudentDTO['firstName'] = $("#signupStage1 #firstName").val();
	signupStudentDTO['middleName'] = $("#signupStage1 #middleName").val();
	signupStudentDTO['lastName'] = $("#signupStage1 #lastName").val();
	var dobd =getDateInDateFormat($("#signupStage1 #dob").val());
	dobd = changeDateFormat(dobd, 'mm-dd-yyyy')
	signupStudentDTO['dob'] = dobd;
	signupStudentDTO['gender'] = $("#signupStage1 #gender").val();
	signupStudentDTO['countryId'] = $("#signupStage1 #countryId").val();
	signupStudentDTO['stateId'] = $("#signupStage1 #stateId").val();
	signupStudentDTO['cityId'] = $("#signupStage1 #cityId").val();
	signupStudentDTO['standardId'] = $("#signupStage1 #applyStandardId").val() == "" ? null :  $("#signupStage1 #applyStandardId").val();
	signupStudentDTO['communicationEmail'] = $("#signupStage1 #communicationEmail").val();
	signupStudentDTO['nationality'] = $("#signupStage1 #nationality").val();
	signupStudentDTO['countryCode'] = $("#signupStage1 #countryDailCode").val();
	signupStudentDTO['countryIsdCode'] = $("#signupStage1 #countryIsd").val();
	signupStudentDTO['contactNumber'] = $("#signupStage1 #contactNumber").val();
	if($('#learingProgramHeader').attr('val')=='DUAL_DIPLOMA'){
		signupStudentDTO['studyingSchoolName'] = $("#signupStage1 #studyingSchoolName").val();
		signupStudentDTO['studyingGradeId'] = $("#signupStage1 #studyingGradeId").val();
		signupStudentDTO['countryIdOfSchool'] = $("#signupStage1 #countryIdOfSchool").val();
	}
//	signupStudentDTO['countryCode'] = $("#signupStage1 .iti__active").last().attr("data-dial-code");//$.trim($("#signupStage1 #countryCodeStudent option:selected").text().split(" ")[0].replace("+",""));
//	if($("#signupStage1 .iti__active").attr("data-dial-code")==undefined){
//		signupStudentDTO['countryCode'] = $("#signupStage1 #countryDailCode").val();
//	}
//	signupStudentDTO['contactNumber'] = $("#signupStage1 #contactNumber").val();
//	signupStudentDTO['countryIsdCode'] = $("#signupStage1 .iti__active").last().attr("data-country-code");
//	if($("#signupStage1 .iti__active").attr("data-country-code")==undefined){
//		signupStudentDTO['countryIsdCode'] = $("#signupStage1 #countryIsd").val();
//	}
	signupStudentDTO['studyCenter'] = SCHOOL_ID;
	authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = 'STUDENT';
	authentication['userId'] = $("#signupStage1 #userId").val();
	saveStudentDetailsRequestDTO['authentication'] = authentication;
	saveStudentDetailsRequestDTO['signupStudent'] = signupStudentDTO;
	return saveStudentDetailsRequestDTO;
}

function displaySection(sectionNumber){
	hideMessage('');
	setActiveStep(sectionNumber);
}

function calculateAge(){
	$('#signupStage1 #dob').removeClass('is-Empty');
	var studentDOB = $('#signupStage1 #dob').val().split("-");
	var age = M.countAgeNew(studentDOB[1], studentDOB[0], studentDOB[2]);
	if(age>29.941173){
	showMessage(false, 'Age of student should not be more then 30 years');
		return true;
	}
	return true;
}

function maxAge(standardId, enrollmentType){
	if(standardId==''){
		max_age=30;
	}else{
		if(enrollmentType=="ONE_TO_ONE" || enrollmentType=="BATCH"){
			$.ajax({
				type : "POST",
				url : getURLForHTML('student',standardId+'/'+enrollmentType),
				dataType : 'json',
				contentType : "json",
				async : false,
				success : function(data) {
					max_age= data.maxAge;
					return true;
				}
			});
		}else{
			max_age=30;
		}
	}
}

function dobInitalize(schoolId, needToInitalize, courseProviderId){
	// if(1==schoolId){
		var startDate = new Date();
		var endDate = new Date();
		if($("#applyStandardId").val() == "0"){
			$('#dob').attr('disabled',true)
		}else {
			$('#dob').attr('disabled',false)
		}
		if(courseProviderId==39){
			max_age=60;
		}else{
			// var standardId=$("#signupStage2 #applyStandardId").val()
			// var enrollmentType =$("#signupStage2 #resType").val();
			// maxAge(standardId, enrollmentType);
			max_age=30;
		}
		endDate.setFullYear(startDate.getFullYear()-2);
		startDate.setFullYear(startDate.getFullYear()-max_age);
		if(needToInitalize){
			$('#dob').val('')
		}
		
		$('#dob').datepicker('remove')
		$('#dob').datepicker({
		   	autoclose: true,
		   	format: 'M dd, yyyy',
		   	startDate:startDate,
		   	endDate:endDate
		}).on('changeDate', function() {
			$('#dob').valid();
			calculateAge('signupStage1');
		});
	// }else{
	// 	var startDate = new Date();
	// 	var endDate = new Date();
	// 	startDate.setFullYear(startDate.getFullYear()-99);
	// 	 $('#dob').attr('disabled',false)
	// 	$('#dob').datepicker({
	// 	   	autoclose: true,
	// 	   	format: 'M dd, yyyy',
	// 	   	startDate:startDate,
	// 	   	endDate:endDate
	// 	}).on('changeDate', function() {
	// 		$('#dob').valid();
	// 		$('#messageDiv1').html('')
	// 		$('#messageDiv').hide();
	// 		calculateAge('signupStage1');
	// 	});
	// }
}

function getStepsMessage(step){
	html='';
	if(step==0){
		$('#stepsMessage').html('Takes less than 1 minute to complete this step');
	}else if(step==1){
		$('#stepsMessage').html('Takes less than 1 minute to complete this step');
	}else if(step==2){
		$('#stepsMessage').html('Takes less than 2 minutes to complete this step');
	}else if(step==3){
		$('#stepsMessage').html('Takes less than 1 minute to complete this step');
	}else{
		$('#stepsMessage').html('Takes less than 1 minute to complete this step');
	}
}

function getRequestForStudentSelection(){
	var studentRequestDTO = {};
	studentRequestDTO['userId'] = USER_ID;
	return studentRequestDTO;
}

function callForStudentSelection() {
	showSkeleton(true, "step1");
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : BASE_URL + CONTEXT_PATH + SCHOOL_UUID +'/student/enrollment/get-student-details',
		data : JSON.stringify(getRequestForStudentSelection()),
		dataType : 'json',
		async : true,
		global : false,
		success : function(data) {
			if(data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
                if (data['status'] == '3') {
                    redirectLoginPage();
                } else {
					if(data['statusCode']=='ELIGIBLE_CUSTOME_PLAN' || data['statusCode']=='REDIRECT_TO_DASHBOOARD'){
						window.location.reload();
					}else{
						showMessage(false, data['message']);
					}
                }
            }else{
				renderStudentDetails(data);
				$(".step-1-skeleton").hide();
				$("#signupStage1").show();
				// showMessage(1, 'Student Details Updated.', '', true);
			}
		},
		error: function(e){
			if (checkonlineOfflineStatus()) {
				return;
			}
		}
	});
}

function formValdate(formID, mandatory, nonMandatory){
	for(var i=0;i<mandatory.length;i++){
		var mElementType=$("#"+formID+" "+"#"+mandatory[i]).attr("type");
		if($("#"+formID+" "+"#"+mandatory[i]).val()!="" && mElementType!="checkbox" && mElementType!="tel"){
			validEndInvalidField(true, mandatory[i]);
		}else if(mElementType=="checkbox"){
			if($("#"+formID+" "+"#"+mandatory[i]).is(":checked")){
				validEndInvalidField(true, mandatory[i]);
				//return true;
			}else{
				validEndInvalidField(null, mandatory[i]);
				//return false;
			}
		}else if(mElementType=="tel"){
			if($("#"+formID+" "+"#"+mandatory[i]).val().length == 0){
				validEndInvalidField(null, mandatory[i]);
				//return false;
			}else if($("#"+formID+" "+"#"+mandatory[i]).val().length < 3 && $("#"+formID+" "+"#"+mandatory[i]).val().length > 0 ){
				validEndInvalidField(false, mandatory[i]);
				//return false;
			}else{
				validEndInvalidField(true, mandatory[i]);
				//return true;
			}
		}else{
			validEndInvalidField(false, mandatory[i]);
		}	
	}
	for(var j=0;j<nonMandatory.length;j++){
		var nElementType=$("#"+formID+" "+"#"+nonMandatory[j]).attr("type");
		if($("#"+formID+" "+"#"+nonMandatory[j]).val()!="" && nElementType!="checkbox" && nElementType!="tel"){
			validEndInvalidField(true, nonMandatory[j]);
		}else if(nElementType=="checkbox"){
			if($("#"+formID+" "+"#"+nonMandatory[j]).is(":checked")){
				validEndInvalidField(true, nonMandatory[j]);
				//return true;
			}else{
				validEndInvalidField(null, nonMandatory[j]);
				//return false;
			}
		}else if(nElementType=="tel"){
			if($("#"+formID+" "+"#"+nonMandatory[j]).val().length == 0){
				validEndInvalidField(null, nonMandatory[j]);
				//return false;
			}else if($("#"+formID+" "+"#"+nonMandatory[j]).val().length < 3 && $("#"+formID+" "+"#"+nonMandatory[j]).val().length > 0 ){
				validEndInvalidField(false, nonMandatory[j]);
				//return false;
			}else{
				validEndInvalidField(true, nonMandatory[j]);
				//return true;
			}
			
		}else{
			validEndInvalidField(null, nonMandatory[j]);
		}
	}
}

function setActiveStep(step){
	var courseProviderId=$('#courseProviderId').val();
	var sectionLength = $(".step").length;
	$("body .content .step:nth-child("+(step)+")").siblings().removeClass("active-step");
	$("body .content .step:nth-child("+(step)+")").addClass("active-step");
	if(step > sectionLength || step < 1){
		console.log("Invalid Step")
	}
	else if(step == 1){
		
		$('.steps ul li:first-child a img').attr('src',PATH_FOLDER_IMAGE2+'step-1.png');
		if(courseProviderId == 39){
			$('.steps ul li:nth-child(2) a img').attr('src',PATH_FOLDER_IMAGE2+'talking-deactive.png');
		}else{
			$('.steps ul li:nth-child(2) a img').attr('src',PATH_FOLDER_IMAGE2+'step-2-deactive.png');
		}
		$('.steps ul li:nth-child(3) a img').attr('src',PATH_FOLDER_IMAGE2+'step-4-deactive.png');
		$('.steps ul li:nth-child(4) a img').attr('src',PATH_FOLDER_IMAGE2+'step-5-deactive.png');
		$(".prev-btn").css({"visibility":"visible", "opacity":"1"});
		$(".step1, .step2, .step3, .step4").removeClass("done-step");
		$(".prev-btn").css({"visibility":"hidden", "opacity":"0"});
		$(".next-btn").show();
		$(".finish-btn").hide();
	}else if(step == 2){
		$('.steps ul li:first-child a img').attr('src',PATH_FOLDER_IMAGE2+'complete-step.png');
		if(courseProviderId == 39){
			$('.steps ul li:nth-child(2) a img').attr('src',PATH_FOLDER_IMAGE2+'talking-active.png');
		}else{
			$('.steps ul li:nth-child(2) a img').attr('src',PATH_FOLDER_IMAGE2+'step-2.png');
		}
		$('.steps ul li:nth-child(3) a img').attr('src',PATH_FOLDER_IMAGE2+'step-4-deactive.png');
		$('.steps ul li:nth-child(4) a img').attr('src',PATH_FOLDER_IMAGE2+'step-5-deactive.png');
		$(".prev-btn").css({"visibility":"visible", "opacity":"1"});
		$(".step1").addClass("done-step");
		$(".step2, .step3, .step4").removeClass("done-step");
		$(".next-btn").show();
		$(".finish-btn").hide();
	}else if(step == 3){
		$('.steps ul li:first-child a img').attr('src',PATH_FOLDER_IMAGE2+'complete-step.png');
		$('.steps ul li:nth-child(2) a img').attr('src',PATH_FOLDER_IMAGE2+'complete-step.png');
		$('.steps ul li:nth-child(3) a img').attr('src',PATH_FOLDER_IMAGE2+'step-4.png');
		$('.steps ul li:nth-child(4) a img').attr('src',PATH_FOLDER_IMAGE2+'step-5-deactive.png');
		$(".prev-btn").css({"visibility":"visible", "opacity":"1"});
		$(".step1, .step2").addClass("done-step");
		$(".step3, .step4").removeClass("done-step");
		$(".next-btn").show();
		$(".finish-btn").hide();
	}else if(sectionLength == step){
		$('.steps ul li:first-child a img').attr('src',PATH_FOLDER_IMAGE2+'complete-step.png');
		$('.steps ul li:nth-child(2) a img').attr('src',PATH_FOLDER_IMAGE2+'complete-step.png');
		$('.steps ul li:nth-child(3) a img').attr('src',PATH_FOLDER_IMAGE2+'complete-step.png');
		$('.steps ul li:nth-child(4) a img').attr('src',PATH_FOLDER_IMAGE2+'step-5.png');
		$(".prev-btn").css({"visibility":"visible", "opacity":"1"});
		$(".step1, .step2").addClass("done-step");
		$(".step4").removeClass("done-step");
		$(".prev-btn").css({"visibility":"visible", "opacity":"1"});
		$(".next-btn").hide();
		$(".finish-btn").show(); 
	}else{
		$(".prev-btn").css({"visibility":"visible", "opacity":"1"});
		$(".next-btn").show();
		$(".finish-btn").hide(); 
	}
}
function moveStep(moveType){
	var courseProviderId=$('#courseProviderId').val();
	var sectionLength = $(".step").length;
	var currentStep = $(".step.active-step").index()+1;
	if(getSession()){
	if(moveType == "prev"){
		if(currentStep > 1){
			var prevStep = currentStep-1;
		}else{
			var prevStep = currentStep;
		}
	}else{
		var prevStep = currentStep;
	}
	if(sectionLength == currentStep){
		var nextStep = currentStep;
	}else{
		var nextStep = currentStep+1;
	}
	if(moveType == "next"){
		if(prevStep==1){
			var flag = callForSignupStudentDetails('signupStage1');
			if (flag && signupStage1Form.valid()) {
				callForSignupStudentDetails('signupStage1');
			}else{
				return false;
			}
		}else if(prevStep==2){
			var flag = callForSignUpParents('signupStage2');
			if (flag && signupStage2Form.valid() && validateRequestForSignupParent()) {

				var parentEmail = $('#signupStage2 #parentEmailId').val();
				if(parentEmail!=''){
					var userId=$('#userId').val();
					var studentId = $('#signupStage2 #studentId').val();
					var status=emailCheckForParent(parentEmail, 'STUDENT', userId, studentId);
					if(status){

					}else if(status==null){

					}else if(status==false){
						return false;
					}else{
					}
				}
				callForSignUpParents('signupStage2');
			}else{
				return false;
			}
		}else if(prevStep==3){
			if(SHOW_PAYMENT_OPTION=='Y'){
				if(!$('#studentPaymentModal').is(':visible')){
					callForPaymentModeSelection('signupStage3','');
					return false;
				}
			}else{
				if (!validateRequestForPaymentModeSelection('signupStage3', 'signup')) {
					return false;
				}
				choosePaymentOption();
				// $("#studentPaymentModal").modal("hide");
				// setActiveStep(4);
				// callForReviewAndPaymentSelection('Y');
			}
		}
	}
	if(prevStep==1){
		if(currentStep != prevStep && currentStep > prevStep){
			$('.steps ul li:first-child a img').attr('src',PATH_FOLDER_IMAGE2+'step-1.png');
			if(courseProviderId == 39){
				$('.steps ul li:nth-child(2) a img').attr('src',PATH_FOLDER_IMAGE2+'talking-deactive.png');
			}else{
				$('.steps ul li:nth-child(2) a img').attr('src',PATH_FOLDER_IMAGE2+'step-2-deactive.png');
			}
			
			
			$(".step1").removeClass("done-step");
		}else{
			$('.steps ul li:first-child a img').attr('src',PATH_FOLDER_IMAGE2+'complete-step.png');
			
			if(courseProviderId == 39){
				$('.steps ul li:nth-child(2) a img').attr('src',PATH_FOLDER_IMAGE2+'talking-active.png');
			}else{
				$('.steps ul li:nth-child(2) a img').attr('src',PATH_FOLDER_IMAGE2+'step-2.png');
			}
			$(".step1").addClass("done-step");
		}	
		$('.steps ul li:nth-child(3) a img').attr('src',PATH_FOLDER_IMAGE2+'step-4-deactive.png');
		$('.steps ul li:nth-child(4) a img').attr('src',PATH_FOLDER_IMAGE2+'step-5-deactive.png');
		$('.actions > ul > li:first-child').attr('style', 'opacity:0');
		$(".step2 .step3").removeClass("done-step");
	}else if(prevStep==2){
		$('.steps ul li:first-child a img').attr('src',PATH_FOLDER_IMAGE2+'complete-step.png');
		
		$('.steps ul li:nth-child(3) a img').attr('src',PATH_FOLDER_IMAGE2+'step-4.png');
		$('.steps ul li:nth-child(4) a img').attr('src',PATH_FOLDER_IMAGE2+'step-5-deactive.png');
		$('.actions > ul > li:first-child').attr('style', 'opacity:1');
		if(moveType == "next"){
			$(".step2").addClass("done-step");
			$('.steps ul li:nth-child(2) a img').attr('src',PATH_FOLDER_IMAGE2+'complete-step.png');
		}else{
			$(".step2").removeClass("done-step");
			
			if(courseProviderId == 39){
				$('.steps ul li:nth-child(2) a img').attr('src',PATH_FOLDER_IMAGE2+'talking-active.png');
			}else{
				$('.steps ul li:nth-child(2) a img').attr('src',PATH_FOLDER_IMAGE2+'step-2.png');
			}
			$('.steps ul li:nth-child(3) a img').attr('src',PATH_FOLDER_IMAGE2+'step-4-deactive.png');
			$('.steps ul li:nth-child(4) a img').attr('src',PATH_FOLDER_IMAGE2+'step-5-deactive.png');
		}
		$(".step1").addClass("done-step");

		$(".step3").removeClass("done-step");
	}else if(prevStep==3){
		$('.steps ul li:first-child a img').attr('src',PATH_FOLDER_IMAGE2+'complete-step.png');
		$('.steps ul li:nth-child(2) a img').attr('src',PATH_FOLDER_IMAGE2+'complete-step.png');
		if($('#studentPaymentModal').is(':visible')){
			$('.steps ul li:nth-child(3) a img').attr('src',PATH_FOLDER_IMAGE2+'complete-step.png');
			$('.steps ul li:nth-child(4) a img').attr('src',PATH_FOLDER_IMAGE2+'step-5.png');
		}else{
			$('.steps ul li:nth-child(3) a img').attr('src',PATH_FOLDER_IMAGE2+'step-4.png');
			$('.steps ul li:nth-child(4) a img').attr('src',PATH_FOLDER_IMAGE2+'step-5-deactive.png');
		}
		$('.actions > ul > li:first-child').attr('style', 'opacity:1');
		$(".step1, .step2").addClass("done-step");
		$(".step3").removeClass("done-step");
	}
	else if(prevStep==4){
		$(".step1, .step2, .step3").addClass("done-step");
	}
	
	if(moveType == "next"){
		$("body .content .step:nth-child("+(nextStep)+")").addClass("active-step");
		$("body .content .step:nth-child("+(currentStep)+")").removeClass("active-step");
		
		if(nextStep > 1 ){
			$(".prev-btn").css({"visibility":"visible", "opacity":"1"});    
		}else{
			$(".prev-btn").css({"visibility":"hidden", "opacity":"0"});
		} 
		if(nextStep == sectionLength){
			$(".next-btn").hide();
			$(".finish-btn").show(); 
		}
	}else if(moveType == "prev"){
		$("body .content .step:nth-child("+(prevStep)+")").addClass("active-step"); 
		$("body .content .step:nth-child("+(currentStep)+")").removeClass("active-step");
		
		if(prevStep == 1 ){
			$(".prev-btn").css({"visibility":"hidden", "opacity":"0"});
		}else if(prevStep == 3){
			if(SHOW_PAYMENT_OPTION=='Y'){
				if(!$('#studentPaymentModal').is(':visible') || $('#studentPaymentModal').length<1){
					callForPaymentModeSelection('signupStage3','');
				}
			}
		}else{
			$(".prev-btn").css({"visibility":"visible", "opacity":"1"});    
		} 
		if(nextStep == sectionLength){
			$(".next-btn").show();
			$(".finish-btn").hide(); 
		}
	}
}else{
	redirectLoginPage();
}
}

function calculateGradeLabel(){
	var learningLabel = $('#learningLabel').val();
	if(learningLabel!=''){
		if(learningLabel=='B'){
			$('#signupStage1 #applyStandardId').val(11);
		}else if(learningLabel=='I'){
			$('#signupStage1 #applyStandardId').val(1);
		}else if(learningLabel=='A'){
			$('#signupStage1 #applyStandardId').val(4);
		}
	}
}
