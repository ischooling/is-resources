$('.edit-field-btn').on('click', function(e){
	var fieldValue = $(this).parent().find('.field-value').text();
	fieldValue = $.trim(fieldValue);
	if($(this).prev().hasClass('iti--allow-dropdown')){
	  var string1= fieldValue;
	  string1 = string1.split('-')[1];
	  $(this).parent().find('.field-input').addClass('visible').attr('value', string1);
	}else{
	  $(this).parent().find('.field-input').addClass('visible').attr('value', fieldValue);
	}
	$(this).hide().parent().find('.save-field-btn').addClass('visible');
	$(this).hide().parent().find('.cancel-field-btn').addClass('visible');
	$(this).parent().find('.field-value').addClass('hide-value');
	$(this).parent().find('.iti--allow-dropdown, .select2').addClass('visible')
});

$(document).on('dragstart dragover drop', function(event) { event.preventDefault(); });
function getRequestForUpdateProfile(src,keyId,userId,studentStandardId,moduleId){
	var requestProfile = {};
	var authentication = {};
	var requestProfileData = {};
	requestProfileData['studentStandardId']=studentStandardId;
	requestProfileData['keyId']=keyId;
	if(keyId=='employeeType'){
		if($('#employeeTypeStartDate').val()==''){
			showMessageTheme2(0,"Please enter employee Type Start Date.",'',false);
			return false;
		}
		requestProfileData['employeeStartDate'] = $('#employeeTypeStartDate').val();
	}
	if(keyId=='phoneNumber' || keyId=='alternatePhoneNumber' || keyId=='parentContact' || keyId=='alternateParentPhoneNumber' || keyId=='payPalPhoneNumber' ){
		var valId ="";
		var lent=$('#'+keyId).val().indexOf("-")
		if(lent>0){
			var valPhoneId = $('#'+keyId).val().split("-")[1];
		}else{
			var valPhoneId = $('#'+keyId).val();
			if(valPhoneId==""){
				showMessageTheme2(2,' Either field value is invalid or empty.','',false);
				return false;
			}
		}
		requestProfileData['fieldValue']=escapeCharacters(valPhoneId);
	}
	if(keyId=='alternateEmail'){
		var valEmailId = $('#'+keyId).val();
		if(valEmailId=="" || !validateEmail(valEmailId)){
			showMessageTheme2(2,' Either field value is invalid or empty.','',false);
			return false;
		}
		requestProfileData['fieldValue']=valEmailId;
	}
	if(keyId=='specialization' || keyId=='preferredSubjectName' || keyId=='lastsubTaught'){
		requestProfileData['fieldValue']=$('#'+keyId).val().toString();
	}else if(keyId=='phoneNumber'){
		requestProfileData['countryCode']=$('#phoneCountryCode').val();//$(".stuPhoneNumber .iti__active").last().attr("data-country-code");
		requestProfileData['countryIsdCode']=$('#phoneDailCode').val();//$(".stuPhoneNumber .iti__active").last().attr("data-dial-code");
	}else if(keyId=='educationSpecialization'){
		requestProfileData['fieldValue']=$('#educationSpecialization').val();//$(".stuPhoneNumber .iti__active").last().attr("data-dial-code");
	}else if(keyId=='alternatePhoneNumber'){
		requestProfileData['countryCode']= $('#alternateCountryCode').val();//$(".stuAlternatePhoneNumber .iti__active").last().attr("data-country-code");
		requestProfileData['countryIsdCode']=$('#alternateDailCode').val();//$(".stuAlternatePhoneNumber .iti__active").last().attr("data-dial-code");
	}else if(keyId=='parentContact'){
		requestProfileData['countryCode']=$('#parentPhoneCountryCode').val();//$(".stuParentPhoneNumber .iti__active").last().attr("data-country-code");
		requestProfileData['countryIsdCode']=$('#parentPhoneDailCode').val();//$(".stuParentPhoneNumber .iti__active").last().attr("data-dial-code");
	}else if(keyId=='alternateParentPhoneNumber'){
		requestProfileData['countryCode']=$('#alternateParentPhoneCountryCode').val();//$(".stuAlternateParentPhoneNumber .iti__active").last().attr("data-country-code");
		requestProfileData['countryIsdCode']=$('#alternateParentPhoneDailCode').val();//$(".stuAlternateParentPhoneNumber .iti__active").last().attr("data-dial-code");
	}else if(keyId=='payPalPhoneNumber'){
		requestProfileData['countryCode']=$('#payPalCountryCode').val();
		requestProfileData['countryIsdCode']=$('#payPalDailCode').val();
	}else if(keyId=='countrySection'){
		requestProfileData['countryId']=$('#countryId').val();
		requestProfileData['stateId']=$('#stateId').val();
		requestProfileData['cityId']=$('#cityId').val();
	}else if(keyId=='countrySectionParent'){
		requestProfileData['countryId']=$('#pCountryId').val();
		requestProfileData['stateId']=$('#pStateId').val();
		requestProfileData['cityId']=$('#pCityId').val();
	}else if(keyId=='totalTeacheingExperience'){
		requestProfileData['yearValue']=$("#yearExp").val();
		requestProfileData['monthValue']=$("#monthExp").val();
	}else if(keyId=='lastOrgGradeName'){
		if($('#lastGradeK').val().length>0){
			requestProfileData['fieldValue']=$('#lastGradeK').val().toString();
		}else if($('#lastGradeM').val().length>0){
			requestProfileData['fieldValue']=$('#lastGradeM').val().toString();
		}else if($('#lastGradeH').val().length>0){
			requestProfileData['fieldValue']=$('#lastGradeH').val().toString();
		}
	}else if(keyId=='preferredGradeName'){
		if($('#prefGradeK').val().length>0){
			requestProfileData['fieldValue']=$('#prefGradeK').val().toString();
		}else if($('#prefGradeM').val().length>0){
			requestProfileData['fieldValue']=$('#prefGradeM').val().toString();
		}else if($('#prefGradeH').val().length>0){
			requestProfileData['fieldValue']=$('#prefGradeH').val().toString();
		}
	}else if(keyId=='otherRelation'|| keyId=='relationType'){
		requestProfileData['fieldValue']=$("#relationType").val();
		requestProfileData['fieldValue1']=toTitleCase($("#otherRelation").val());
	}else if(keyId=='parentEmailSmsLmsCreation'){
		requestProfileData['fieldValue']=encode($("#parentPassword").val());
	}else if(keyId=='pEmailOtp'){
		requestProfileData['fieldValue']=$("#parentEmailId").val().trim();
	}else if(keyId=='pEmailOtpVerify'){
		requestProfileData['fieldValue']=$("#parentEmailId").val().trim();
		requestProfileData['fieldValue1']=$("#otp").val();
	}else if(keyId=='pStudEmailMappedVerify'){
		requestProfileData['fieldValue']=$("#parentEmailId").val().trim();
		requestProfileData['fieldValue1']=$("#verifyMailId").val().trim();
	}else if(keyId=="parentEmailLmsCreation"){
		requestProfileData['fieldValue']=$("#parentEmailId").val().trim();
	}else if(keyId=='switchParentStudEmailId'){
		requestProfileData['fieldValue']=$('#swipeParentId').val().trim();
		requestProfileData['fieldValue1']= $('#studID option:selected ').attr('attrStudentEmail').trim();
		requestProfileData['studUserId']=$('#studID').val();
		requestProfileData['parentId']=$('#swipeParentId').attr("attrparentid");
	}else if(keyId=='preferredcommunication'){
		var pcWhatsapp=$('#pcWhatsapp').is(':checked')?'Y':'N';
		var pcCall=$('#pcCall').is(':checked')?'Y':'N';
		var pcEmail=$('#pcEmail').is(':checked')?'Y':'N';
		fieldValue='W='+pcWhatsapp+'|'+'C='+pcCall+'|'+'E='+pcEmail;
		requestProfileData['fieldValue']=fieldValue;
	}else{
		if(keyId=='firstName' || keyId=='middleName' || keyId=='lastName'
		|| keyId=='pFirstName' || keyId=='pMiddleName' || keyId=='pLastName'
		|| keyId=='lastOrgName' || keyId=='lastJobTitle' || keyId=='address' || keyId=='otherSkills'
		|| keyId=='designation' || keyId=='departmentId' || keyId=='acPersonName' || keyId=='bankName'
		|| keyId=='bankBranchName' || keyId=='bankBranchAddress' || keyId=='otherBankDetails' || keyId=='otherProfessionalCourse'
		|| keyId=='otherSpecialization' || keyId=='anyOtherLanguages' || keyId=='references1' || keyId=='references2'
		|| keyId=='specialization' || keyId=='postGraduationSubjects' || keyId=='graduationSubjects'){
			requestProfileData['fieldValue']=escapeCharacters($('#'+keyId).val());
		}else if(keyId=='describeYourself' || keyId=='lastOrgJobDiscription'){
			requestProfileData['fieldValue']=escapeCharacters(toSentenceCase($('#'+keyId).val()));
		}else{
			requestProfileData['fieldValue']=escapeCharacters($('#'+keyId).val());
		}
	}
	authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = moduleId;
	authentication['userId'] = userId;
	requestProfile['authentication'] = authentication;
	requestProfile['requestProfileData'] = requestProfileData;
	return requestProfile;
}

function validateFields(keyId, fieldValue){
	if(keyId=='phoneNumber'){
		if(fieldValue==''|| fieldValue==undefined){
			showMessageTheme2(0,"Contact number is mandatory.",'',false);
			return false;
		}
	}else if(keyId=='gender' || keyId=='parentGender'){
		if(fieldValue==''|| fieldValue==undefined ||fieldValue==0){
			showMessageTheme2(0,"Please choose gender.",'',false);
			return false;
		}
	}else if(fieldValue=='Select Nationality'){
		showMessageTheme2(0," Please choose nationality to proceed.",'',false);
		return false;
	}else if(keyId=='admissonDate' || keyId=='joiningDate'){
		if(fieldValue==''|| fieldValue==undefined ||fieldValue==0){
			showMessageTheme2(0,"Either field value is invalid or empty.",'',false);
			return false;
		}
	}else if(keyId=='dob'){
		if(fieldValue==''|| fieldValue==undefined ||fieldValue==0){
			showMessageTheme2(0,"Either field value is invalid or empty.",'',false);
			return false;
		}
	}else if(keyId=='countrySection'){
		if( $("#countryId").val()==undefined ||$("#countryId").val()==0 || $("#countryId").val()==''){
			showMessageTheme2(0," Please choose country to proceed.",'',false);
			return false;
		}else if( $("#stateId").val()==undefined ||$("#stateId").val()==0 || $("#stateId").val()==''){
			showMessageTheme2(0,"Please choose state to proceed.",'',false);
			return false;
		}else if( $("#cityId").val()==undefined ||$("#cityId").val()==0 || $("#cityId").val()==''){
			showMessageTheme2(0,"Please choose city to proceed.",'',false);
			return false;
		}
	}else if(keyId=='countrySectionParent'){
		if( $("#pCountryId").val()==undefined ||$("#pCountryId").val()==0 || $("#pCountryId").val()==''){
			showMessageTheme2(0," Please choose country to proceed.",'',false);
			return false;
		}else if( $("#pStateId").val()==undefined ||$("#pStateId").val()==0 || $("#pStateId").val()==''){
			showMessageTheme2(0,"Please choose state to proceed.",'',false);
			return false;
		}else if( $("#pCityId").val()==undefined ||$("#pCityId").val()==0 || $("#pCityId").val()==''){
			showMessageTheme2(0,"Please choose city to proceed.",'',false);
			return false;
		}
	}else if(keyId=="totalTeacheingExperience"){
		if($("#yearExp").val()==undefined || $("#yearExp").val()=='' || $("#yearExp").val()==0){
			// if( $("#monthExp").val()==undefined || $("#monthExp").val()=='' || $("#monthExp").val()==0){
				showMessageTheme2(0,"Please select total teaching experience in month.",'',false);
				return false;
			// }
		}
	}else if(keyId=="preferredGradeName"){
		if($('#prefGradeK').val().length==0 && $('#prefGradeM').val().length==0 && $('#prefGradeH').val().length==0){
			showMessageTheme2(0,"Please select preferred grades.",'',false);
			return false;
		}
	}else if(keyId=="lastOrgGradeName"){
		if($('#lastGradeK').val().length==0 && $('#lastGradeM').val().length==0 && $('#lastGradeH').val().length==0){
			showMessageTheme2(0,"Please select current/Last Organization grades.",'',false);
			return false;
		}
	}else if(keyId=="specialization"){
		if($('#specialization').val().length==0){
			showMessageTheme2(0,"Please select specialization subjects.",'',false);
			return false;
		}
	}else if(keyId=="preferredSubjectName"){
		if($('#preferredSubjectName').val().length==0){
			showMessageTheme2(0,"Please select Preferred Courses.",'',false);
			return false;
		}
	}else if(keyId=="lastsubTaught"){
		if($('#lastsubTaught').val().length==0){
			showMessageTheme2(0,"Please select Courses Taught.",'',false);
			return false;
		}
	}else if(keyId=="emailId" || keyId=="altEmailId" || keyId=="alternateEmail" ||keyId=="parentEmailId"|| keyId=="offEmailId" || keyId=="payPalEmail"){
		if (!validateEmail($('#'+keyId).val())){
			showMessageTheme2(0,"Email is either empty or invalid.",'',false);
			return false;
		}
	}else if(keyId=='otherRelation'|| keyId=='relationType'){
		var viewValue='';
		if('Other'== $('#relationType').val()){
			if($('#otherRelation').val()=='' || $('#otherRelation').val()==undefined){
				showMessageTheme2(0,"Please Enter relation type.",'',false);
				return false;
			}
		}
	}else if(keyId=='sendUserVerificationEmail' || keyId=='verifyUserEmail' || keyId=='pMiddleName' || keyId=='middleName'|| keyId=='pLastName'|| keyId=='lastName' || keyId=='switchParentStudEmailId' || keyId=='reserveASeat' || keyId=='bookASeatNextGradeOpted' || keyId=='advanceGradeOpted'){

	}else if(keyId=="parentEmailSmsLmsCreation"){
		if (!validPassword($("#parentPassword").val())) {
			showMessageTheme2(0,"Please Enter parent password.",'',false);
			return false;
		}
		if (!validPassword($("#confirmPassword").val())) {
			showMessageTheme2(0,"Please Enter parent confirm password.",'',false);
			return false;
		}
		if($('#parentPassword').val().trim()!= $('#confirmPassword').val().trim()){
				showMessageTheme2(0,"Password and Confirm Password do not match.",'',false);
				return false;
		}

		var pass=$("#parentPassword").val();
		if(pass != undefined){
			if (!(pattern.test(pass))) {
				showMessageTheme2(0,"Passwords must match all requirements.",'',false);
				return false
			}
		}
	}else if(keyId=="parentEmailLmsCreation"){
		if (!validateEmail($('#parentEmailId').val())){
			showMessageTheme2(0,"Email is either empty or invalid.",'',false);
			return false;
		}
	}else  if(keyId=='pEmailOtp'){
		if (!validateEmail($('#parentEmailId').val())){
			showMessageTheme2(0,"Email is either empty or invalid.",'',false);
			return false;
		}
	}else  if(keyId=='pEmailOtpVerify'){
		if (!validateEmail($('#parentEmailId').val())){
			showMessageTheme2(0,"Email is either empty or invalid.",'',false);
			return false;
		}
		if($('#otp').val()==undefined || $('#otp').val()==''){
			showMessageTheme2(0,"Either Otp value is invalid or empty.",'',false);
			return false;
		}
	}else if(keyId=='pStudEmailMappedVerify'){
		if (!validateEmail($('#parentEmailId').val())){
			showMessageTheme2(0,"Email is either empty or invalid.",'',false);
			return false;
		}
		if (!validateEmail($('#verifyMailId').val())){
			showMessageTheme2(0,"Email is either empty or invalid.",'',false);
			return false;
		}
	}else{
		if(fieldValue==''|| fieldValue==undefined ||fieldValue==0){
			showMessageTheme2(0,"Either field value is invalid or empty.",'',false);
			return false;
		}
	}

 	return true;
}

function verifyUser(status,userId,roleModuleId,moduleId){
	console.log("inside verifyUser function ");
	var data={};
    data['status']=status;
	data['userId']=userId;
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForHTML('dashboard','verify-unverify-user-profile'),
		data : JSON.stringify(data),
		dataType : 'json',
		success : function(data) {
			console.log("response data is:", data);
			if (data['status'] == '0' || data['status'] == '2') {
				showMessageTheme2(0, data['message'],'',false);
			} else {
				if(status=='verify'){
					$('#unverifyStatus').addClass("d-inline-block");
					$('#verifyStatus').addClass("d-none");
					$('#verifyStatus').removeClass("d-inline-block");
				}else{
					$('#unverifyStatus').addClass("d-none");
					$('#unverifyStatus').removeClass("d-inline-block");
					$('#verifyStatus').addClass("d-inline-block");
				}
				showMessageTheme2(1, data['message'],'',false);
			}
			return false;
		}
	});
}

function applyChanges(src, keyId,userId,studentStandardId,roleModuleId,moduleId, showWarning){
	if(!getSession()){
		showMessageTheme2(0, "Your session has been timed out, please login again",'',false);
		redirectLoginPage();
		return false;
	}
	var fieldValue = $(src).parent().find('.field-input').val();
	if(keyId=='firstName' || keyId=='middleName' || keyId=='lastName'
		|| keyId=='pFirstName' || keyId=='pMiddleName' || keyId=='pLastName'
		|| keyId=='lastOrgName' || keyId=='lastJobTitle' || keyId=='address' || keyId=='otherSkills'
		|| keyId=='designation' || keyId=='departmentId' || keyId=='acPersonName' || keyId=='bankName'
		|| keyId=='bankBranchName' || keyId=='bankBranchAddress' || keyId=='otherBankDetails' || keyId=='otherProfessionalCourse'
		|| keyId=='otherSpecialization' || keyId=='anyOtherLanguages' || keyId=='references1' || keyId=='references2'
		|| keyId=='specialization' || keyId=='postGraduationSubjects' || keyId=='graduationSubjects' || keyId=='educationSpecialization'){
			/*fieldValue = toTitleCase(fieldValue);*/
	}else if(keyId=='describeYourself' || keyId=='lastOrgJobDiscription'){
		fieldValue = fieldValue;
	}else if(keyId=='countryTimezoneId' && !showWarning ){
		fieldValue =src;
	}else if(keyId == 'preferredcommunication'){
		var pcWhatsapp=$('#pcWhatsapp').is(':checked')?'Y':'N';
		var pcCall=$('#pcCall').is(':checked')?'Y':'N';
		var pcEmail=$('#pcEmail').is(':checked')?'Y':'N';
		if(pcWhatsapp == "Y" || pcCall == "Y" || pcEmail == "Y"){
			fieldValue='W='+pcWhatsapp+'|'+'C='+pcCall+'|'+'E='+pcEmail;
		}else{
			showMessageTheme2(0, 'Your preferred communication is required','',false);
			return false
		}
	}
	if(showWarning) {
		if(keyId=='countryTimezoneId' && moduleId=='student' ){
			showWarningMessageShow('You are about to change the timezone of the user. Please note that all future booked classes of the user will be updated to the new timezone.','applyChanges(\''+fieldValue+'\',\''+keyId+'\',\''+userId+'\',\''+studentStandardId+'\',\''+roleModuleId+'\',\''+moduleId+'\',false)',false);
			return false;
		}else if(keyId=='countryTimezoneId' && moduleId=='teacher' ){
			showWarningMessageShow('You are about to change the timezone of the teacher. Please note that all future classes of the teacher (recurring and normal) in the old time zone will be updated to the new timezone.','applyChanges(\''+fieldValue+'\',\''+keyId+'\',\''+userId+'\',\''+roleModuleId+'\',\''+moduleId+'\',false)',false);
			return false;
		}
	}
	console.log("Field Value",fieldValue)
	hideMessageTheme2('');
	if(!validateFields(keyId,fieldValue)){
		return false;
	}
	  $.ajax({
			type : "POST",
			contentType : "application/json",
			url : getURLForHTML('dashboard','update-user-profile-content'),
			data : JSON.stringify(getRequestForUpdateProfile(src, keyId, userId, studentStandardId,moduleId)),
			dataType : 'json',
			success : function(data) {
				console.log("response data is:", data);
				if (data['status'] == '0' || data['status'] == '2') {
					showMessageTheme2(0, data['message'],'',false);
				} else {
					if(keyId=='phoneNumber' || keyId=='alternatePhoneNumber' ||  keyId=='parentContact' ||keyId=='alternateParentPhoneNumber' ||keyId=='payPalPhoneNumber'){
						var isdCode="";
						if(keyId=='phoneNumber'){
							isdCode=$('#phoneDailCode').val()+'-';//$(".stuPhoneNumber .iti__active").last().attr("data-dial-code")+'-';
						}else if( keyId=='alternatePhoneNumber'){
							isdCode=$('#alternateDailCode').val()+'-';//$(".stuAlternatePhoneNumber .iti__active").last().attr("data-dial-code")+'-';
						}else if( keyId=='parentContact'){
							isdCode=$('#parentPhoneDailCode').val()+'-';//$(".stuParentPhoneNumber .iti__active").last().attr("data-dial-code")+'-';
						}else if( keyId=='alternateParentPhoneNumber'){
							isdCode=$('#alternateParentPhoneDailCode').val()+'-';//$(".stuAlternateParentPhoneNumber .iti__active").last().attr("data-dial-code")+'-';
						}else if( keyId=='payPalPhoneNumber'){
							isdCode=$('#payPalDailCode').val()+'-';//$(".stuAlternateParentPhoneNumber .iti__active").last().attr("data-dial-code")+'-';
						}
						console.log("Isd Code",isdCode);
						$(src).removeClass('visible').parent().find('.edit-field-btn').show();
						$(src).parent().find('.field-value').removeClass('hide-value').text(isdCode+fieldValue);
						$(src).parent().find('.field-input, .iti--allow-dropdown, .select2').removeClass('visible')
						$(src).parent().find('.cancel-field-btn').removeClass('visible');
					}else if(keyId=='preferredcommunication'){
						$(src).removeClass('visible').parent().find('.edit-field-btn').show();
						$(src).parent().find('.field-value').removeClass('hide-value').text(fieldValue);
						$(src).parent().find('.cancel-field-btn').removeClass('visible');
						
					}else if(keyId=='gender' || keyId=='parentGender'){
						if(fieldValue=='DONOTWANTTOSPECIFY'){
							fieldValue="Don't want to specify";
						}
						$(src).removeClass('visible').parent().find('.edit-field-btn').show();
						$(src).parent().find('.field-value').removeClass('hide-value').text(fieldValue);
						$(src).parent().find('.field-input, .iti--allow-dropdown, .select2').removeClass('visible')
						$(src).parent().find('.cancel-field-btn').removeClass('visible');
						if($('#isProfileUplaoded').val()==0 && keyId=='gender'){
							var profilePic="Profile-picture.jpg"
							if(fieldValue=='DONOTWANTTOSPECIFY'){
								fieldValue="Don't want to specify";
								profilePic="Profile-picture.jpg"
							}else if(fieldValue=='MALE'){
								 profilePic="male-profile.png"
							}else if(fieldValue=='FEMALE'){
								profilePic="female-profile.png"
							}
							$('.profile-pic').attr('src', PATH_FOLDER_IMAGE2+profilePic);
							$('#dropDownProfileImage').attr('src', PATH_FOLDER_IMAGE2+profilePic);
							$('#topProfileImage').attr('src', PATH_FOLDER_IMAGE2+profilePic);
						}
					}else if(keyId=='countrySection'){
						$('.countryName').text($('#countryId option:selected').text()).removeClass('hide-value');
						$('.cityName').text($('#cityId option:selected').text()).removeClass('hide-value');
						$('.stateName').text($('#stateId option:selected').text()).removeClass('hide-value');
						$(src).parent().find('.cancel-field-btn').removeClass('visible');
						$(src).parent().find('.field-input, .iti--allow-dropdown, .select2').removeClass('visible');
						$(src).removeClass('visible').parent().find('.edit-field-btn').show();
						$('.save-country').addClass('d-none');
					}else if(keyId=='studyingGradeId'){
						$('.studyingGradeName').text($('#studyingGradeId option:selected').text()).removeClass('hide-value');
						$(src).parent().find('.cancel-field-btn').removeClass('visible');
						$(src).parent().find('.field-input, .iti--allow-dropdown, .select2').removeClass('visible');
						$(src).removeClass('visible').parent().find('.edit-field-btn').show();
					}else if(keyId=='countryIdOfSchool'){
						$('.countryNameOfSchool').text($('#countryIdOfSchool option:selected').text()).removeClass('hide-value');
						$(src).parent().find('.cancel-field-btn').removeClass('visible');
						$(src).parent().find('.field-input, .iti--allow-dropdown, .select2').removeClass('visible');
						$(src).removeClass('visible').parent().find('.edit-field-btn').show();
					}else if(keyId=='countrySectionParent'){
						$('.countryNameParent').text($('#pCountryId option:selected').text()).removeClass('hide-value');
						$('.cityNameParent').text($('#pCityId option:selected').text()).removeClass('hide-value');
						$('.stateNameParent').text($('#pStateId option:selected').text()).removeClass('hide-value');
						$(src).parent().find('.cancel-field-btn').removeClass('visible');
						$(src).parent().find('.field-input, .iti--allow-dropdown, .select2').removeClass('visible');
						$(src).removeClass('visible').parent().find('.edit-field-btn').show();
						$('.save-country-Parent').addClass('d-none');
					}else if(keyId=='admissonDate'){
						var adDate=$('#admissonDate').val();
						// adDate=adDate.split('-');
						// var selectedDate=new Date(adDate[0]+'/'+adDate[1]+'/'+adDate[2]);
						// var selectedDate2 = selectedDate.toString().split(" ");
						$('.admissionViewDate').text(adDate).removeClass('hide-value');
						$(src).parent().find('.cancel-field-btn').removeClass('visible');
						$(src).parent().find('.field-input').removeClass('visible');
						$(src).removeClass('visible').parent().find('.edit-field-btn').show();
					}else if(keyId=='dob'){
						var adDate=$('#dob').val();
						// adDate=adDate.split('-');
						// var selectedDate=new Date(adDate[0]+'/'+adDate[1]+'/'+adDate[2]);
						// var selectedDate2 = selectedDate.toString().split(" ");
						$('.dobViewDate').text(adDate).removeClass('hide-value');
						$(src).parent().find('.cancel-field-btn').removeClass('visible');
						$(src).parent().find('.field-input').removeClass('visible');
						$(src).removeClass('visible').parent().find('.edit-field-btn').show();
					}else if(keyId=='reserveASeat'){
						$('.reserveASeatName').text($('#reserveASeat option:selected').text()).removeClass('hide-value');
						$(src).parent().find('.cancel-field-btn').removeClass('visible');
						$(src).parent().find('.field-input, .iti--allow-dropdown, .select2').removeClass('visible');
						$(src).removeClass('visible').parent().find('.edit-field-btn').show();
					}else if(keyId=='bookASeatNextGradeOpted'){
						hidePermissionAndApprovalModal();
						$('.reserveASeatNextGradeName').text($('#bookASeatNextGradeOpted option:selected').text()).removeClass('hide-value');
						$("#"+src).parent().find('.cancel-field-btn').removeClass('visible');
						$("#"+src).parent().find('.field-input, .iti--allow-dropdown, .select2').removeClass('visible');
						$("#"+src).removeClass('visible').parent().find('.edit-field-btn').show();
						if($('#bookASeatNextGradeOpted option:selected').text()=='Yes'){
							$('.advanceNextGradeName').html('No');
							$('#advanceGradeOpted').val('0')
						}else if($('#bookASeatNextGradeOpted option:selected').text()=='No'){
							// $('.advanceNextGradeName').html('No');
							// $('#advanceGradeOpted').val('0')
						}
					}else if(keyId=='advanceGradeOpted'){
						hidePermissionAndApprovalModal();
						$('.advanceNextGradeName').text($('#advanceGradeOpted option:selected').text()).removeClass('hide-value');
						$("#"+src).parent().find('.cancel-field-btn').removeClass('visible');
						$("#"+src).parent().find('.field-input, .iti--allow-dropdown, .select2').removeClass('visible');
						$("#"+src).removeClass('visible').parent().find('.edit-field-btn').show();
						if($('#bookASeatNextGradeOpted option:selected').text()=='Yes'){
							$('.reserveASeatNextGradeName').html('No');
							$('#bookASeatNextGradeOpted').val('0')
						}else if($('#bookASeatNextGradeOpted option:selected').text()=='No'){
							// $('.reserveASeatNextGradeName').html('No');
							// $('#bookASeatNextGradeOpted').val('0')
						}
					}else if(keyId=='specialization'){
						$('.specilZViewSubject').text(data['extra']).removeClass('hide-value');
						$(src).parent().find('.cancel-field-btn').removeClass('visible');
						$(src).parent().find('.field-input, .iti--allow-dropdown, .select2').removeClass('visible');
						$(src).removeClass('visible').parent().find('.edit-field-btn').show();
					}else if(keyId=='totalTeacheingExperience'){
						$('.totalTeacheingExpView').text(data['extra']).removeClass('hide-value');
						$(src).parent().find('.cancel-field-btn').removeClass('visible');
						$(src).parent().find('.field-input, .iti--allow-dropdown, .select2').removeClass('visible');
						$(src).removeClass('visible').parent().find('.edit-field-btn').show();
					}else if(keyId=='preferredSubjectName'){
						$('.preferredSubjectNameView').text(data['extra']).removeClass('hide-value');
						$(src).parent().find('.cancel-field-btn').removeClass('visible');
						$(src).parent().find('.field-input, .iti--allow-dropdown, .select2').removeClass('visible');
						$(src).removeClass('visible').parent().find('.edit-field-btn').show();
					}else if(keyId=='lastsubTaught'){
						$('.lastsubTaughtView').text(data['extra']).removeClass('hide-value');
						$(src).parent().find('.cancel-field-btn').removeClass('visible');
						$(src).parent().find('.field-input, .iti--allow-dropdown, .select2').removeClass('visible');
						$(src).removeClass('visible').parent().find('.edit-field-btn').show();
					}else if(keyId=='lastOrgGradeName'){
						$('.lastOrgGradeNameView').text(data['extra']).removeClass('hide-value');
						$(src).parent().find('.cancel-field-btn').removeClass('visible');
						$(src).parent().find('.field-input, .iti--allow-dropdown, .select2').removeClass('visible');
						$(src).removeClass('visible').parent().find('.edit-field-btn').show();
					}else if(keyId=='preferredGradeName'){
						$('.prefGradeNameView').text(data['extra']).removeClass('hide-value');
						$(src).parent().find('.cancel-field-btn').removeClass('visible');
						$(src).parent().find('.field-input, .iti--allow-dropdown, .select2').removeClass('visible');
						$(src).removeClass('visible').parent().find('.edit-field-btn').show();
					}else if(keyId=='departmentId'){
						$('.departmentNameView').text($('#'+keyId).val()).removeClass('hide-value');
						$(src).parent().find('.cancel-field-btn').removeClass('visible');
						$(src).parent().find('.field-input, .iti--allow-dropdown, .select2').removeClass('visible');
						$(src).removeClass('visible').parent().find('.edit-field-btn').show();
					}else if(keyId=='countryTimezoneId'){
						$('.countryTimezoneView').text(data['extra']).removeClass('hide-value');
						$('.timeZoneSavedStatus').text("");
						$('.cancel-field-btn').removeClass('visible');
						$('.field-input, .iti--allow-dropdown, .select2').removeClass('visible');
						$('.save-field-btn').removeClass('visible').parent().find('.edit-field-btn').show();
					}else if(keyId=='designation'){
						$('.designationView').text($('#'+keyId).val()).removeClass('hide-value');
						$(src).parent().find('.cancel-field-btn').removeClass('visible');
						$(src).parent().find('.field-input, .iti--allow-dropdown, .select2').removeClass('visible');
						$(src).removeClass('visible').parent().find('.edit-field-btn').show();
					}else if(keyId=='otherRelation'|| keyId=='relationType'){
						var viewValue='';
						if('Other'== $('#relationType').val()){
							viewValue=toTitleCase($('#otherRelation').val());
						}else{
							viewValue=$('#relationType').val();
						}
						$('.relationTypeView').text(viewValue).removeClass('hide-value');
						$(src).parent().find('.cancel-field-btn').removeClass('visible');
						$(src).parent().find('.field-input, .iti--allow-dropdown, .select2').removeClass('visible');
						$(src).removeClass('visible').parent().find('.edit-field-btn').show();
						$(".otherRelationDiv").hide();
					}else if(keyId=='joiningDate'){
						var adDate=$('#joiningDate').val();
						adDate=adDate.split('-');
						var selectedDate=new Date(adDate[0]+'/'+adDate[1]+'/'+adDate[2]);
						var selectedDate2 = selectedDate.toString().split(" ");
						$('.joiningDateView').text(selectedDate2[1]+", "+selectedDate2[2]+" "+selectedDate2[3]).removeClass('hide-value');
						$(src).parent().find('.cancel-field-btn').removeClass('visible');
						$(src).parent().find('.field-input').removeClass('visible');
						$(src).removeClass('visible').parent().find('.edit-field-btn').show();
					}else if(keyId=='employeeType'){
						var conversionDate = $("#employeeTypeStartDate").val();
						conversionDate=conversionDate.split('-');
						var selectedDate=new Date(conversionDate[0]+'/'+conversionDate[1]+'/'+conversionDate[2]);
						var selectedDate2 = selectedDate.toString().split(" ");
						var employeeType = $("#employeeType").val();
						$('.employee_type').text(employeeType).removeClass('hide-value');
						$('.employee_type_start_date').text(selectedDate2[1]+", "+selectedDate2[2]+" "+selectedDate2[3]);
						$(src).parent().find('.field-value').removeClass('hide-value');
						$(src).parent().find('.field-input, .iti--allow-dropdown, .select2').removeClass('visible')
						$(src).parent().find('.cancel-field-btn').removeClass('visible');
						$(src).removeClass('visible').parent().find('.edit-field-btn').show();
					}else if(keyId=='parentEmailId'){
						if (data['statusCode'] == 'ST001') {
							$('.stu-confirmation').show();
							$("#studentEmailId").html(data['extra']);
							$('.parentCreationCheck').css("display","none");
							$('.parentLmsCreationCheck').css("display","none");
							$('.parentOtpcheck').css("display","none");
							$(src).parent().find('.field-value').removeClass('hide-value').text(fieldValue);
							$(src).parent().find('.field-input, .iti--allow-dropdown, .select2').removeClass('visible')
							$(src).parent().find('.cancel-field-btn').removeClass('visible');
							$(src).parent().find('.save-field-btn').removeClass('visible');
							$(src).parent().find('.edit-field-btn').removeClass('visible');
						}else if (data['statusCode'] == 'ST002') {
							$('.parentCreationCheck').css("display","none");
							$('.parentLmsCreationCheck').css("display","none");
							$('.parentEmailswipe').css("display","none");
							$('.parentOtpcheck').css("display","none");
							$('.parentOtpcheck').css("display","block");
							$(src).parent().find('.field-value').removeClass('hide-value').text(fieldValue);
							$(src).parent().find('.field-input, .iti--allow-dropdown, .select2').removeClass('visible')
							$(src).parent().find('.cancel-field-btn').removeClass('visible');
							$(src).parent().find('.save-field-btn').removeClass('visible');
							$(src).parent().find('.edit-field-btn').removeClass('visible');
						}else{
							$('.parentOtpcheck').css("display","none");
							$('.parentCreationCheck').css("display","none");
							$('.parentLmsCreationCheck').css("display","none");
							$('.parentEmailswipe').css("display","none");
							if (data['extra'] == 'N') {
								$('.parentCreationCheck').css("display","block");
							}else if (data['extra1'] == 'N') {
								$('.parentLmsCreationCheck').css("display","block");
							}
							$(src).removeClass('visible').parent().find('.edit-field-btn').show();
							$(src).parent().find('.field-value').removeClass('hide-value').text(fieldValue);
							$(src).parent().find('.field-input, .iti--allow-dropdown, .select2').removeClass('visible')
							$(src).parent().find('.cancel-field-btn').removeClass('visible');
						}
					}else if(keyId=='parentEmailSmsLmsCreation'){
						$('.parentSmsCreatedView').text('Yes').removeClass('hide-value');
						$('.parentLmsCreatedView ').text('Yes').removeClass('hide-value');
						if (data['extra'] == 'Y') {
							$('.parentLmsStatusView').text('Active').removeClass('hide-value');
						}else{
							$('.parentLmsStatusView').text('Inactive').removeClass('hide-value');
						}
						$('.parentCreationCheck').css("display","none");
						$('.separate-user-for-parent').slideUp()
					}else if(keyId=='parentEmailLmsCreation'){
						$('.parentSmsCreatedView').text('Yes').removeClass('hide-value');
						$('.parentLmsCreatedView ').text('Yes').removeClass('hide-value');
						if (data['extra'] == 'Y') {
							$('.parentLmsStatusView').text('Active').removeClass('hide-value');
						}else{
							$('.parentLmsStatusView').text('Inactive').removeClass('hide-value');
						}
						$('.parentLmsCreationCheck').css("display","none");
						$('.separate-lms-user-for-parent').css("display","none");
					}else if(keyId=='pEmailOtp'){

					}else if(keyId=='pEmailOtpVerify'){
						$('.parentOtpcheck').css("display","none");
						$('.parentCreationCheck').css("display","block");
					}else if(keyId=='pStudEmailMappedVerify'){
						$('.stu-confirmation').hide();
						$('.parentOtpcheck').css("display","none");
						$('.parentCreationCheck').css("display","none");
						$('.parentLmsCreationCheck').css("display","none");
						$('.parentEmailswipe').css("display","none");
						if (data['extra'] == 'N') {
							$('.parentCreationCheck').css("display","block");
						}else if (data['extra1'] == 'N') {
							$('.parentLmsCreationCheck').css("display","block");
						}
					}else if(keyId=='switchParentStudEmailId'){
						$('#studID').prop('disabled', false);
						$('#updatedStudEmail').text('');
						$('#updatedParentEmail').text('');
						$('.swap-Id-Wrapper').addClass('d-none');
					    $('.studParntswipedata').css("display","none");
						$('#switchParentEmail').prop('checked', false);
						$('#parentEmailId').removeClass('visible').parent().find('.edit-field-btn').show();
						if (data['statusCode'] == '1') {
							$('.emailIdView').text(data['extra']).removeClass('hide-value');;
						}
						$('#swipeParentId').val(data['extra1']);
						$('.parentEmailswipe').css("display","none");
						$('.parentEmailIdView').text(data['extra1']).removeClass('hide-value');;
					}else{
						$(src).removeClass('visible').parent().find('.edit-field-btn').show();
						if(keyId=='sendUserVerificationEmail' || keyId=='verifyUserEmail'){
							$(src).parent().find('.field-value').removeClass('hide-value').html(fieldValue+'<i class="fa fa-check text-success ml-2"></i>');
							window.location.reload();
						}else{
							$(src).parent().find('.field-value').removeClass('hide-value').text(fieldValue);
						}
						$(src).parent().find('.field-input, .iti--allow-dropdown, .select2').removeClass('visible')
						$(src).parent().find('.cancel-field-btn').removeClass('visible');
					}
					if (data['statusCode'] == 'ST001') {
					}else{
						showMessageTheme2(1, data['message'],'',false);
					}
				}

				return false;
			}
		});
}

//  select dropdown script
$(document).mouseup(function(e){
  var optionContainer = $(".select-option-wrapper");
  // if (!optionContainer.is(e.target) && optionContainer.has(e.target).length === 0){
  if (!optionContainer.is(e.target)){
      optionContainer.hide().removeClass('edge');

  }
});

$(function () {
    $(".select-option-input").on('click', function (e) {
      $(this).parent().find('.select-option-wrapper').show();
        if ($('.select-option-wrapper').length) {
            var scrollTop = $(window).scrollTop();
            var elm = $(this).parent();
            var dropdownHeight = $(this).parent().find('.select-option-wrapper').height()
            var off = elm.offset();
            var l = off.top;
            var docH = $(window).height();
            var currentElementOffset = l - scrollTop;
            var bottom = docH - currentElementOffset - elm.height();
           if (bottom > dropdownHeight) {
                $(this).parent().find('.select-option-wrapper').removeClass('edge');

            } else {
                $(this).parent().find('.select-option-wrapper').addClass('edge');
            }
        }
    });
});

function reserveAndEnrollmentSeat(flag){
	return flag;
}

$('.select-option-wrapper .option').click(function(){
  var selectedValue = $(this).text();
  $(this).parent().closest('.select-option-field').find('.select-option-input').val(selectedValue)
});

//
$('.show-stu-confirmation').click(function(){
  $('.stu-confirmation').slideDown();
});
//cancel field functionality
$('.cancel-field-btn').on('click', function(){
	if($(this).parent().hasClass('preferredCommunication')){
		$(this).parent().find('.save-field-btn').removeClass('visible');
		$(this).removeClass('visible').parent().find('.edit-field-btn').show();
		$(this).parent().find('.field-value').removeClass('hide-value').text(fieldValue);
	}else if($(this).parent().hasClass('empConvEmptype')){
		var conversionDate = $('.employee_type_start_date').text();
		var employeeType = $(".employee_type").text();
		$('.employee_type_start_date').removeClass('hide-value').text(conversionDate);
		$('.employee_type').removeClass('hide-value').text(employeeType);
		$(this).parent().find('.save-field-btn').removeClass('visible');
		$(this).removeClass('visible').parent().find('.edit-field-btn').show();
		$(this).parent().find('.field-input, .iti--allow-dropdown, .select2').removeClass('visible');
	}else if($(this).parent().hasClass('verificationMail')){
		fieldValueHTML = $(".emailIdView").html();
		$(this).parent().find('.save-field-btn').removeClass('visible');
		$(this).removeClass('visible').parent().find('.edit-field-btn').show();
		$(this).parent().find('.field-input').attr('value', fieldValue).removeClass('visible');
		$(this).parent().find('.field-value').removeClass('hide-value').html(fieldValue);
	}
	else{
		var fieldValue = $(this).parent().find('.field-value').text();
		var cancelFieldValue = fieldValue.split('-')[1];
		$(this).parent().find('.save-field-btn').removeClass('visible');
		$(this).removeClass('visible').parent().find('.edit-field-btn').show();
		$(this).parent().find('.field-value').removeClass('hide-value').text(fieldValue);
		$(this).parent().find('.iti--allow-dropdown, .select2').val(cancelFieldValue).removeClass('visible');
		$(this).parent().find('.field-input').attr('value', fieldValue).removeClass('visible');
		$(".otherRelationDiv").hide()
	}
 });
 
$(".multiselect-dropdown").select2({
    theme: "bootstrap4",
    placeholder: "Select an option"
});
$(".multiselect-dropdown_special").select2({
    theme: "bootstrap4",
    maximumSelectionLength: 5,
    placeholder: "Select an option"
});
$(".multiselect_dropdown_pref_courses").select2({
    theme: "bootstrap4",
    maximumSelectionLength: 5,
    placeholder: "Select an option"
});
$(".multiselect_course_taught").select2({
    theme: "bootstrap4",
    maximumSelectionLength: 5,
    placeholder: "Select an option"
});

$(".multiselectDropdown").select2({
    theme: "bootstrap4",
    placeholder: "Select an option"
});
$(".multiselectDropdown1").select2({
    theme: "bootstrap4",
    placeholder: "Select an option"
});
$(".multiselectDropdown2").select2({
    theme: "bootstrap4",
    placeholder: "Select an option"
});
$(".multiselectDropdown3").select2({
    theme: "bootstrap4",
    placeholder: "Select an option"
});
$(".multiselectDropdown4").select2({
    theme: "bootstrap4",
    placeholder: "Select an option"
});
$(".multiselectDropdown5").select2({
    theme: "bootstrap4",
    placeholder: "Select an option"
});
$(".title-select-dropdown-lms").select2({
    theme: "bootstrap4",
    placeholder: "Select an option",
	dropdownParent: ".lmsPlatformWrapper"
});
$(".title-select-dropdown-register").select2({
    theme: "bootstrap4",
    placeholder: "Select an option",
	dropdownParent: ".registrationTypeWrapper"
});
$(".title-select-dropdown-standard").select2({
    theme: "bootstrap4",
    placeholder: "Select an option",
	dropdownParent: ".standardIdWrapper"
});

$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
	var tabID = $(this).attr('tabid');
	changeSelect(tabID)

});
function changeSelect(tabID) {
	$('.multiselectDropdown').select2({
	    theme: "bootstrap4",
	    placeholder: "Select an option"
    }).change(function (e) {
    	e.preventdefault;
         var gradesLength = $('.multiselectDropdown :selected').length;
         if(gradesLength > 0){
        	  $('#middleSchool select').prop('disabled', true);
        	  $('#highSchool select').prop('disabled', true);
          }
         else{
        	 $('#middleSchool select').prop('disabled', false);
       	  	$('#highSchool select').prop('disabled', false);
         }
        });
	$('.multiselectDropdown1').select2({
	    theme: "bootstrap4",
	    placeholder: "Select an option"
    }).change(function (e) {
    	e.preventdefault;
        var gradesLength = $('.multiselectDropdown1 :selected').length;
        if(gradesLength > 0){
        	  $('#kindergarten select').prop('disabled', true);
        	  $('#highSchool select').prop('disabled', true);
          }
       else{
    	    $('#kindergarten select').prop('disabled', false);
      	  	$('#highSchool select').prop('disabled', false);
        }
        });
	$('.multiselectDropdown2').select2({
	    theme: "bootstrap4",
	    placeholder: "Select an option"
    }).change(function (e) {
    	e.preventdefault;
        var gradesLength = $('.multiselectDropdown2 :selected').length;
        if(gradesLength > 0){
        	  $('#kindergarten select').prop('disabled', true);
        	  $('#middleSchool select').prop('disabled', true);
          }
        else{
        	$('#kindergarten select').prop('disabled', false);
      	  	$('#middleSchool select').prop('disabled', false);
        }
        });

	$('.multiselectDropdown3').select2({
	    theme: "bootstrap4",
	    placeholder: "Select an option"
    }).change(function (e) {
    	e.preventdefault;
         var gradesLength = $('.multiselectDropdown3 :selected').length;
         if(gradesLength > 0){
        	  $('#currentMiddleSchool select').prop('disabled', true);
        	  $('#currentHighSchool select').prop('disabled', true);
          }
         else{
        	 $('#currentMiddleSchool select').prop('disabled', false);
       	  	$('#currentHighSchool select').prop('disabled', false);
         }
        });
	$('.multiselectDropdown4').select2({
	    theme: "bootstrap4",
	    placeholder: "Select an option"
    }).change(function (e) {
    	e.preventdefault;
        var gradesLength = $('.multiselectDropdown4 :selected').length;
        if(gradesLength > 0){
        	  $('#currentKindergartenSchool select').prop('disabled', true);
        	  $('#currentHighSchool select').prop('disabled', true);
          }
       else{
    	    $('#currentKindergartenSchool select').prop('disabled', false);
      	  	$('#currentHighSchool select').prop('disabled', false);
        }
        });
	$('.multiselectDropdown5').select2({
	    theme: "bootstrap4",
	    placeholder: "Select an option"
    }).change(function (e) {
    	e.preventdefault;
        var gradesLength = $('.multiselectDropdown5 :selected').length;
        if(gradesLength > 0){
        	  $('#currentKindergartenSchool select').prop('disabled', true);
        	  $('#currentMiddleSchool select').prop('disabled', true);
          }
        else{
        	$('#currentKindergartenSchool select').prop('disabled', false);
      	  	$('#currentMiddleSchool select').prop('disabled', false);
        }
        });
	/*alert("#" +tabID)*/
	$("#" +tabID).find('.select2').addClass('visible');
}

$('.save-field-btn').on('click', function(){
	$(".multiselect-dropdown").select2("close");
});
$(".select_dropdown").select2({
    theme: "bootstrap4",
    placeholder: "Select an option",
     minimumResultsForSearch: Infinity
});
function getCompulsorySubjectByUserId(userId){
	$.ajax({
		type : "GET",
		contentType : "application/json",
		url : getURLForHTML('dashboard', 'get-compulsory-subjects'+'?userId='+userId),
		dataType : 'json',
		success : function(data) {
			var changedGrade=$('#standardId option:selected').text();
			var htmlContent='<div class="Profile-field-row"><p class="m-0"><b>Courses ('+changedGrade+')</b></p><div class="scroll-course-list scrollbar-container ps"><ol class="ml-0">';
			$.each(data.subjects, function(k, v) {
				htmlContent+='<li>'+v.subject+'</li>';
			});
			htmlContent+='</ol><div class="ps__rail-x" style="left: 0px; bottom: 0px;"><div class="ps__thumb-x" tabindex="0" style="left: 0px; width: 0px;"></div></div><div class="ps__rail-y" style="top: 0px; right: 0px;"><div class="ps__thumb-y" tabindex="0" style="top: 0px; height: 0px;"></div></div></div></div>';
			$('.compulsorySubjectsdiv').html(htmlContent);
		}
	});
}

function getBankDetailsByUserId(userId, onlyEdit){
	$.ajax({
		type : "GET",
		contentType : "application/json",
		url : getURLForHTML('dashboard', 'bank-details/'+userId),
		dataType : 'json',
		success : function(data) {
			var bankDetails = JSON.parse(data.bankDetails)
			$('#profileViewOnlyContent').html(teacherBankDetailsView(bankDetails));
			if(onlyEdit){
				$("#teacherProfileContentDiv").after(teacherBankDetialsContent(bankDetails,userId));
			}

			$("#accountHolderCountryId").unbind().bind("change", function () {
				$('#accountHolderCountryId').valid();
				callStates('bankDetailsForm', this.value, 'accountHolderCountryId','accountHolderStateId','accountHolderCityId');
				$("#accountHolderCityId").html("<option value=''>Select City*</option>");
			});
			$("#accountHolderStateId").unbind().bind("change", function () {
				$('#accountHolderStateId').valid();
				callCities('bankDetailsForm', this.value, 'accountHolderStateId','accountHolderCityId');
			});
			$("#accountHolderCityId").unbind().bind("change", function () {
				$('#accountHolderCityId').valid();
			});

			$("#bankCountryId").unbind().bind("change", function () {
				$('#bankCountryId').valid();
				callStates('bankDetailsForm', this.value, 'bankCountryId','bankStateId','bankCityId');
				$("#bankCityId").html("<option value=''>Select City*</option>");
			});
			$("#bankStateId").unbind().bind("change", function () {
				$('#bankStateId').valid();
				callCities('bankDetailsForm', this.value, 'bankStateId','bankCityId');
			});
			$("#bankCityId").unbind().bind("change", function () {
				$('#bankCityId').valid();
			});
		}
	});
}

function updateBankDetails(formId,userId) {
	if($("#"+formId+" #accountCurrency").val()==''){
		showMessageTheme2(0, 'Please choose account currency.', "", true);
		return false
	}
	if($("#"+formId+" #accountNumber").val()==''){
		showMessageTheme2(0, 'Account number can\'t blank.', "", true);
		return false
	}
	if($("#"+formId+" #accountCategory").val()==''){
		showMessageTheme2(0, 'Please choose account type.', "", true);
		return false
	}
	
	if($("#"+formId+" #accountHolderFirstName").val()==''){
		showMessageTheme2(0, 'Account holder first name can\'t blank.', "", true);
		return false
	}

	if($("#"+formId+" #accountHolderLastName").val()==''){
		showMessageTheme2(0, 'Account holder last name can\'t blank.', "", true);
		return false
	}

	if($("#"+formId+" #accountHolderAddress").val()==''){
		showMessageTheme2(0, 'Account holder address can\'t blank.', "", true);
		return false
	}

	if($("#"+formId+" #accountHolderCountryId").val()==null || $("#"+formId+" #accountHolderCountryId").val()==''){
		showMessageTheme2(0, 'Please choose account holder country.', "", true);
		return false
	}

	if($("#"+formId+" #accountHolderStateId").val()==null || $("#"+formId+" #accountHolderStateId").val()==''){
		showMessageTheme2(0, 'Please choose account holder state.', "", true);
		return false
	}

	if($("#"+formId+" #accountHolderCityId").val()==null || $("#"+formId+" #accountHolderCityId").val()==''){
		showMessageTheme2(0, 'Please choose account holder city.', "", true);
		return false
	}

	if($("#"+formId+" #accountHolderPostal").val()==''){
		showMessageTheme2(0, 'Account holder postal code can\'t blank.', "", true);
		return false
	}

	if($("#"+formId+" #accountHolderPhone").val()==''){
		showMessageTheme2(0, 'Account holder phone number can\'t blank.', "", true);
		return false
	}

	if(!validateEmail($("#"+formId+" #accountHolderEmail").val())){
		showMessageTheme2(0, 'Account holder Email can\'t blank.', "", true);
		return false
	}
	
	if($("#"+formId+" #bankName").val()==''){
		showMessageTheme2(0, 'Bank name can\'t blank.', "", true);
		return false
	}
	
	if($("#"+formId+" #bankBranchName").val()==''){
		showMessageTheme2(0, 'Bank branch name can\'t blank.', "", true);
		return false
	}

	if($("#"+formId+" #bankBranchAddress").val()==''){
		showMessageTheme2(0, 'Bank branch address can\'t blank.', "", true);
		return false
	}
	
	if($("#"+formId+" #bankCountryId").val()==null || $("#"+formId+" #bankCountryId").val()==''){
		showMessageTheme2(0, 'Please choose bank country.', "", true);
		return false
	}

	if($("#"+formId+" #bankStateId").val()==null || $("#"+formId+" #bankStateId").val()==''){
		showMessageTheme2(0, 'Please choose bank state.', "", true);
		return false
	}

	if($("#"+formId+" #bankCityId").val()==null || $("#"+formId+" #bankCityId").val()==''){
		showMessageTheme2(0, 'Please choose bank city.', "", true);
		return false
	}

	if($("#"+formId+" #bankPostal").val()==''){
		showMessageTheme2(0, 'Bank postal code can\'t blank.', "", true);
		return false
	}
	
	// if($("#"+formId+" #bankIfsc").val()==''){
	// 	showMessageTheme2(0, 'Bank IFSC code can\'t blank.', "", true);
	// 	return false
	// }

	if ($("#"+formId+" #fileupload5Span").html()=='' || $("#"+formId+" #fileupload5Span").html()=='No file Selected*') {
		showMessageTheme2(0, 'Upload document for Address Proof.', "", true);
		return false
	}
	if ($("#"+formId+" #fileupload6Span").html()=='' || $("#"+formId+" #fileupload6Span").html()=='No file Selected*') {
		showMessageTheme2(0, 'Please upload Passport.',"",  true);
		return false
	}
	var flag = false;
	$.ajax({
		type : "POST",
		url : getURLForHTML('dashboard', 'save-bank-details'),
		data : JSON.stringify(getRequestForBankDetails(formId, userId)),
		dataType : 'json',
		contentType : "application/json",
		async : false,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				showMessageTheme2(0, data['message'],"",  false);
				if(data['status'] == '3'){
					redirectLoginPage();
				}
			} else {
				showMessageTheme2(1, data['message'],"",  false);
				getBankDetailsByUserId(USER_ID,false);
			}
		}
	});
	return flag;
}

function getRequestForBankDetails(formId, userId){
	// var request = {};
	// var authentication = {};
	// var requestData = {};
	var bankDetails = {};
	var accountType = "BANK_ACCOUNT";
	bankDetails['userId'] = userId;
	bankDetails['accountType'] = accountType;
	bankDetails['accountCurrency'] = $("#"+formId+" #accountCurrency").val();
	bankDetails['accountNumber'] = $("#"+formId+" #accountNumber").val();
	bankDetails['iban'] = $("#"+formId+" #iban").val();
	bankDetails['accountCategory'] = $("#"+formId+" #accountCategory").val();
	bankDetails['accountHolderFirstName'] = toTitleCase($("#"+formId+" #accountHolderFirstName").val());
	bankDetails['accountHolderMiddleName'] = toTitleCase($("#"+formId+" #accountHolderMiddleName").val());
	bankDetails['accountHolderLastName'] = toTitleCase($("#"+formId+" #accountHolderLastName").val());
	bankDetails['accountHolderAddress'] = toTitleCase($("#"+formId+" #accountHolderAddress").val());
	bankDetails['accountHolderCountryId'] = $("#"+formId+" #accountHolderCountryId").val();
	bankDetails['accountHolderStateId'] = $("#"+formId+" #accountHolderStateId").val();
	bankDetails['accountHolderCityId'] = $("#"+formId+" #accountHolderCityId").val();
	bankDetails['accountHolderPostal'] = $("#"+formId+" #accountHolderPostal").val();
	bankDetails['accountHolderPhone'] = $("#"+formId+" #accountHolderPhone").val();
	bankDetails['accountHolderEmail'] = $("#"+formId+" #accountHolderEmail").val();

	bankDetails['bankName'] = toTitleCase($("#"+formId+" #bankName").val());
	bankDetails['bankBranchName'] = toTitleCase($("#"+formId+" #bankBranchName").val());
	bankDetails['bankBranchAddress'] = escapeCharacters(toTitleCase($("#"+formId+" #bankBranchAddress").val()));
	bankDetails['bankCountryId'] = $("#"+formId+" #bankCountryId").val();
	bankDetails['bankStateId'] = $("#"+formId+" #bankStateId").val();
	bankDetails['bankCityId'] = $("#"+formId+" #bankCityId").val();
	bankDetails['bankPostal'] = $("#"+formId+" #bankPostal").val();
	bankDetails['swiftCode'] = $("#"+formId+" #swiftCode").val();
	bankDetails['bankIfsc'] = $("#"+formId+" #bankIfsc").val();
	bankDetails['routeNumber'] = $("#"+formId+" #routeNumber").val();

	bankDetails['accountNumber'] = $("#"+formId+" #accountNumber").val();
	bankDetails['otherDetails'] = toSentenceCase($("#"+formId+" #otherDetails").val());
		
	bankDetails['payPalEmail'] = $("#"+formId+" #paypalEmailId").val();
	
	// requestData['teacherPaymentInfoDTO'] = bankDetails;
	// authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
	// authentication['userType'] = 'TEACHER';
	// authentication['userId'] = $('#userIdAgreement').val();
	// request['authentication'] = authentication;
	// request['requestData'] = requestData;
	return bankDetails;
}

function saveDocs(userId, studentStandardId, docType){
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForHTML('dashboard','save-docs'),
		data : JSON.stringify(getAllDataAndRecords(userId, studentStandardId)),
		dataType : 'json',
		async : false,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if(data['status'] == '3'){
					showMessageTheme2(0, data['MESSAGE'],'',true);
					redirectLoginPage();
				}else{
					if(tt=='theme1'){
						showMessage(false, data['MESSAGE']);
					}else{
						showMessageTheme2(0, data['MESSAGE'],'',true);
					}
				}
			} else {
				var doctype = "";
				$.each(data['LIST_OF_DOC'], function(key,value){
					var doctype = value.DOCUMENT_PATH.split(".").pop();
					if(data['LIST_OF_DOC'][key].DOCUMENT_PATH.split(".").pop() != "pdf"){
						//$("#"+data['LIST_OF_DOC'][key].IMG_ID).attr("src",data['LIST_OF_DOC'][key].DOCUMENT_PATH);
						$("#"+value['IMG_ID']).parent().parent().find(".upload-btn-wrapper").hide();
						if(USER_ROLE == 'STUDENT'){
							$("#"+value['IMG_ID']).parent().parent().find(".removeDocBtn").hide();
						}
					}else{
						$("#uploadFile .upload_pdf .pre_upload_pdf").remove();
						$("#uploadFile .upload_pdf#pre_upload_pdf_div").append('<object type="application/pdf" class="pre_upload_pdf full" style="height: 400px;" data="'+data['LIST_OF_DOC'][key].DOCUMENT_PATH+'"></object>');

						$("#uploadFile .upload_pdf a.download-pdf-btn").attr("href",base64URL);
						$("#uploadFile .upload_pdf").removeClass("d-none");
						$("#uploadFile .upload_img").addClass("d-none");
						$("#"+value['IMG_ID']).parent().parent().find(".upload-btn-wrapper").hide();
						if(USER_ROLE == 'STUDENT'){
							$("#"+value['IMG_ID']).parent().parent().find(".removeDocBtn").hide();
						}
					}
				});
				$('.removeDocBtn').each(function(){
					if($(this).attr('style').replace(/\s/g, '') != 'display:none' && $(this).attr('style').replace(/\s/g, '') != 'display:none;'){
					  $("#allDocsNotUploaded").hide();
					  $("#allDocsUploaded").show();
					}else{
					  $("#allDocsNotUploaded").show();
					  $("#allDocsUploaded").hide();
					  return false;
					}
				});
				if(docType == "Profile Image"){
					showMessageTheme2(1, 'Profile image uploaded successfully','',true);
				}else{
					showMessageTheme2(1, 'Document(s) uploaded','',true);
					setTimeout(function(){customLoader(true); window.location.reload();},2000);
				}
			}
		},
		error : function(e) {
			console.log(e)
		}
	});

}

function removeUploadImage(src, inputId, thumbId, type, studentStandardId){
	if($("#"+thumbId).attr("src").split(":")[0]=="https" || $("#"+thumbId).attr("src").split(":")[0]=="http"){
		var data={};
    	data['userId']=USER_ID;
		data['studentStandardId']=studentStandardId;
		data['type']=type;
		$.ajax({
			type : "POST",
			contentType : "application/json",
			url : getURLForHTML('dashboard','delete-uploaded-docs'),
			data : JSON.stringify(data),
			dataType : 'json',
			async : false,
			success : function(data) {
				if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
					if(data['status'] == '3'){
						redirectLoginPage();
					}else{
						if(tt=='theme1'){
							showMessage(false, data['MESSAGE']);
						}else{
							showMessageTheme2(0, data['MESSAGE'],'',true);
						}
					}
				} else {
					// Do here 
					showMessageTheme2(1, 'Document(s) removed','',true);
				}
			},
			error : function(e) {
				console.log(e)
			}
		});
	}
	for (var i=0; i < uploadDocs.length; i++) {
		if (uploadDocs[i].docType === type) {
			uploadDocs.splice(i, 1);
			console.log(uploadDocs);
		}
	}
	$("#"+inputId).val("");
	$("#"+thumbId).attr("src", PATH_FOLDER_IMAGE2+'no-image.jpg'+SCRIPT_VERSION);
	$("#"+thumbId).attr("thumbtype","img")
	$("#"+inputId+"div").attr("data-base64url",PATH_FOLDER_IMAGE2+'no-image.jpg'+SCRIPT_VERSION);
	$("#"+inputId+"div").show();
	$('#' + inputId+'Remove').hide();
	$('.removeDocBtn').each(function(index){
		if($(this).attr('style') == 'display: none'){
			$("#allDocsNotUploaded").show();
			$("#allDocsUploaded").hide();
		}else{
			$("#allDocsNotUploaded").show();
			$("#allDocsUploaded").hide();
		}
	});
}

function getAllDataAndRecords(userId, studentStandardId){
	var uploadRequestDTO = {};
	var documentUploads = uploadDocs;

	uploadRequestDTO['userId'] = userId;
	uploadRequestDTO['studentStandardId'] = studentStandardId;
	uploadRequestDTO['documentUploads'] = documentUploads;
	return uploadRequestDTO;
}

function editPreferenceTime(startTime, endTime){
	startTime = removeLeadingZero('startTime',startTime);
	endTime = removeLeadingZero('endTime',endTime);
	var startTimeValues=[];
	var endTimeValues=[];
	$("#preferedStartTime option").each(function(){
		startTimeValues.push($(this).val())
	});
	
	$("#viewTimePreferenceWrapper").hide();
	$("#editTimePreferenceWrapper").show();
	$("#editTimePreferenceWrapper .select2").addClass("visible");
	$(".profile-wrapper #editTimePreferenceWrapper .select2").css({"position":"inherit !important"});
	$(".profile-wrapper #editTimePreferenceWrapper .select2-selection__arrow").css({"right":".375rem"});
	if ($.inArray(startTime, startTimeValues) !== -1) {
		$("#preferedStartTime").val(startTime).trigger("change");
		$("#preferedEndTime option").each(function(){
			endTimeValues.push($(this).val())
		});
	} else {
		$("#preferedStartTime").val("").trigger("change");
		$("#preferedEndTime option").each(function(){
			endTimeValues.push($(this).val())
		});
	}
	if ($.inArray(endTime, endTimeValues) !== -1) {
		$("#preferedEndTime").val(endTime).trigger("change");
	} else {
		$("#preferedEndTime").val("").trigger("change");
	}
}
function backViewPreferedTime(){
	$("#viewTimePreferenceWrapper").show();
	$("#editTimePreferenceWrapper").hide();
}
function removeLeadingZero(typeTime,time) {
	// Split the time into its components
	var parts = time.split(' ');
	var timePart = parts[0];
	var meridiem = parts[1];
	var [hours, minutes] = timePart.split(':');
	hours = parseInt(hours, 10);
	if(typeTime == "endTime"){
		var newTimeStr = hours + ':' + minutes + '_' + meridiem;
	}else{
		var newTimeStr = hours + ':' + minutes + ' ' + meridiem;
	}
	
	return newTimeStr;
}


var countId=[];
var selectedCoursesID = [];
var mandatoryFields=[];
var GRADES_TAUGHT = new Array();
var SUBJECTS_TAUGHT = new Array();
var GRADES_TAUGHT_NAMES = new Array();
var SUBJECTS_TAUGHT_NAMES = new Array();
var subjectsTaught = SUBJECTS_TAUGHT;
var applySubejctflag = false;
var applyGradeflag = false;
var academicUploadDocsObj = [];
async function showSelectedCourseList(){
	var me = $(this);
	if(me.data('requestRunning')){
		return false;
	}
	me.data('requestRunning', true);

	if(!applySubejctflag){
		var payload = {};
		payload['userId'] = USER_ID;
		responseData = await getDashboardDataBasedUrlAndPayloadWithParentUrl(false, false, 'get-teacher-signup-subject-details', payload, '/teacher/signup');
		if(responseData.statusCode == "SUCCESS"){
			$("#select_course").remove();
			$("body").append(courseSelectionModal(responseData.details));
			elementary_subjects= responseData.details.subjectDetails.elementrySelectedSubject;
			middleSchool_subjects= responseData.details.subjectDetails.middleSelectedSubject;
			highSchool_subjects= responseData.details.subjectDetails.highSelectedSubject;
			SUBJECTS_TAUGHT_BACKUP=responseData.details.subjectDetails.elementrySelectedSubject.concat(responseData.details.subjectDetails.middleSelectedSubject, responseData.details.subjectDetails.highSelectedSubject);
        	SUBJECTS_TAUGHT=responseData.details.subjectDetails.elementrySelectedSubject.concat(responseData.details.subjectDetails.middleSelectedSubject, responseData.details.subjectDetails.highSelectedSubject);
			$(".elementary-0").val(responseData.details.subjectDetails.elementrySelectedSubject).trigger("change");
			$(".middle-school-0").val(responseData.details.subjectDetails.middleSelectedSubject).trigger("change");
			$(".high-school-0").val(responseData.details.subjectDetails.highSelectedSubject).trigger("change");
			var selectedCourseArray = responseData.details.subjectDetails.elementrySelectedSubject.concat(responseData.details.subjectDetails.middleSelectedSubject,responseData.details.subjectDetails.highSelectedSubject)
			if(selectedCourseArray.length>0){
				$(".selected_course_containter").show();
			}
			var course_Category_Id = $('.custom-tab-wrapper li.active-tab a').attr('id');
			var course_Category = $(".courses-category-wrapper").find("#"+course_Category_Id+"C").find('ul.course-list li.active-tab').attr('coursetype');
			coursesDropdonw(course_Category, course_Category_Id);
		}
	}
	$("#select_course").modal("show");
	me.data('requestRunning', false)
	$('.custom-tab-wrapper li a:not(:first)').addClass('inactive');
	$('.custom-tab-item').hide();
	$('.custom-tab-item:first').show();
	$('.custom-tab-wrapper li a').click(function(){
		var tabID = $(this).attr('id')
			tabFullForm = $(this).attr('full-form')
		if($(this).hasClass('inactive')){ //this is the start of our condition 
			$('.custom-tab-wrapper li a').addClass('inactive');           
			$('.custom-tab-wrapper li').removeClass('active-tab');           
			$(this).removeClass('inactive');
			$(this).parent().addClass('active-tab');
			$('.custom-tab-item').hide();
			$('#'+tabID+"C").find('.active-tab > .course-list-wrapper').show()
			$('#'+ tabID + 'C').fadeIn();
		}
	});
	$('.course-tabs-format ul.course-list li a:not(:first)').addClass('inactive');
	$('.elementary_course_item .course-list-wrapper').hide();
	$('.elementary_course_item:first .course-list-wrapper').show();
	$('.course-tabs-format ul.course-list li a').click(function(){
		var tabID = $(this).attr('id'),
		tabParent = $(this).parent().closest('.custom-tab-item').attr('id');
		if($(this).hasClass('inactive')){ //this is the start of our condition 
			$('.course-tabs-format ul.course-list li a').addClass('inactive');           
			$("#"+tabParent).find('.elementary_course_item').removeClass('active-tab');           
			$(this).removeClass('inactive');
			$(this).parent().addClass('active-tab').find('.elementary-wrapper').slideDown('fast');
			$('.elementary_course_item .course-list-wrapper').hide();
			$('#'+ tabID + 'C').slideDown();
		}
	});
}

function selectedCourseCategory(){
	var course_Category_Id = $('.custom-tab-wrapper li.active-tab a').attr('id');
    var course_Category = $(".courses-category-wrapper").find("#"+course_Category_Id+"C").find('ul.course-list li.active-tab').attr('coursetype');
    coursesDropdonw(course_Category, course_Category_Id);
}

function coursesDropdonw(course_type, course_category){
	var course_List = $("."+course_type).select2({
	placeholder: "Select Course",
	allowClear: true,
	minimumResultsForSearch: -1,
	dropdownParent: $('.'+course_type+'-wrapper')
      
   }).change(function(){
	   
   }).on("select2:closing", function(e) {
       e.preventDefault();
   }).on("select2:closed", function(e) {
       course_List.select2("open");
   }).on('select2:select', function(e) {
	   var selectedCourseHTML="";
	   var data = e.params.data;
	   if(!countId.includes(data.id)){
		data.id =  data.id.replace(/\s+/g, '');
	    selectedCourseHTML = "<li class='select2-selection__choice'> <span courseId='"+data.id+"' class='select2-selection__choice__display'>"+ data.text+"</span> </li>"
	    countId.push(data.id);
	   }
	    if(!subjectsTaught.includes(data.id,0)){
       		subjectsTaught.splice(subjectsTaught.length, 0, data.id);
       		if(course_category=='elementary' &&  elementary_subjects.find_by_id(data.id)==false){
       			elementary_subjects.push(data.text)
       		} else if(course_category=='middle_school' && middleSchool_subjects.find_by_id(data.id)==false){
       			middleSchool_subjects.push(data.text)
       		}else{
       			if(highSchool_subjects.find_by_id(data.id)==false){
       			highSchool_subjects.push(data.text);
       			}
       		} 
       	}
	  	// var selectedGradeType = $(this).parent().closest('li').attr('coursetype'); 
		// if(!gradesTaught.includes(selectedGradeType)){
	  	// 	gradesTaught.push(selectedGradeType);
	  	// }
		if(!selectedCoursesID.includes(data.id)){
			selectedCoursesID.push(data.id)
		}
		
	  	$('.elementary_selected_course').append(selectedCourseHTML);
	  	var selected_course_wrapper_length = $('.selected_courses li .course-category-wrapper > ul li').length ;
        var selected_course_length = $('.elementary_selected_course'+' .select2-selection__choice').length;
        if(selected_course_length > 0){
           $('.selected_course_containter').show();
           $('.elementary_selected_course').parent().closest('li').show().addClass('selectedCategory');
        }
        else if(selected_course_wrapper_length < 1){
           $('.selected_course_containter').hide();
           $('.elementary_selected_course').parent().closest('li').hide();
        }
        else{
           $('.elementary_selected_course').parent().closest('li').hide();
       	}
	  	
   }).on('select2:unselect', function(e) {
       var data = e.params.data;
       subjectsTaught.remove_by_value(data.id);
       var selectedGradeType = $(this).parent().closest('li').attr('coursetype');
       var unSelectedCourse = data.id.replace(/\s+/g, '');;
       var selectedGrade = $(".selected_course_wrapper").find("[courseid='" + unSelectedCourse + "']").parent().remove();
       //gradesTaught.remove_by_value(selectedGradeType);
       elementary_subjects.remove_by_object_id(data.id);
	   middleSchool_subjects.remove_by_object_id(data.id);
       highSchool_subjects.remove_by_object_id(data.id);
       countId.remove_by_value(data.id);
       var selected_course_wrapper_length = $('.selected_courses li .course-category-wrapper > ul li').length;
       var selected_course_length = $('.elementary_selected_course .select2-selection__choice').length;
       if(selected_course_length > 0){
           $('.selected_course_containter').show();
           $('.elementary_selected_course').parent().closest('li').show().addClass('selectedCategory');
       }
       else if(selected_course_wrapper_length < 1){
           $('.selected_course_containter').hide();
           $('.elementary_selected_course').parent().closest('li').hide();
       }
       else{
           $('.elementary_selected_course').parent().closest('li').hide();
       }
   }); 
   course_List.select2("open");
}
Array.prototype.remove_by_object_id = function (val) {
  for (var i = 0; i < this.length; i++) {
    if (this[i].replace(/\s+/g, '') === val.replace(/\s+/g, '')) {
      this.splice(i, 1);
      i--;
    }
  }
  return this;
}
Array.prototype.find_by_id = function (val) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] === val) {
      return true
    }
  }
  return false;
}
	
Array.prototype.remove_by_value = function (val) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] === val) {
      this.splice(i, 1);
      i--;
    }
  }
  return this;
}


  
async function getSelectedSubjectes(){
	if(elementary_subjects.concat(middleSchool_subjects, highSchool_subjects).length != 0){
		SUBJECTS_TAUGHT=subjectsTaught;
		$("#select_course").modal('hide');
		applySubejctflag = true;
		var subjectList = {"elementrySelectedSubject": elementary_subjects, "middleSelectedSubject": middleSchool_subjects, "highSelectedSubject": highSchool_subjects}
		var payload = {};
		payload['userId'] = USER_ID;
		payload['subjectList'] = subjectList;
		responseData = await getDashboardDataBasedUrlAndPayloadWithParentUrl(false, false, 'save-subject-from-teacher-profile', payload, '/teacher/signup');
		if(responseData.statusCode == "SUCCESS"){
			showMessageTheme2(1, responseData.message);
			$(".lastsubTaughtView").text(elementary_subjects.concat(middleSchool_subjects, highSchool_subjects).join(", ").replace("All Courses - Language Arts, Mathematics, Science, Technology, Art", 'Language Arts, Mathematics, Science, Technology, Art'));
		}else{
			showMessageTheme2(0, responseData.message);
		}
	}else{
		showMessageTheme2(0, "Please Select Courses Taught");
	}
	// selectedCategoryLength = $('.selected_courses li.selectedCategory').length;
	// for(i=1; i<=selectedCategoryLength; i++){
	// 	var selectedCategoryType = $('.selected_courses li:nth-child('+ i + ')').attr('coursecategorytype');
	// 	courseCategoryType.push(selectedCategoryType)
	// }
	// $('.selected_courses li').attr('coursecategorytype');
	
}

function showCourseList(){
    var course_Category_Id = $('.custom-tab-wrapper li.active-tab a').attr('id');
    var course_Category = $(".courses-category-wrapper").find("#"+course_Category_Id+"C").find('ul.course-list li.active-tab').attr('coursetype');
	$('#select_course').modal('show');
	coursesDropdonw(course_Category, course_Category_Id);
}

function changeLearingProgramGradePlatform(src, studentStandardId){
	var data={};
	data['userId']=USER_ID;
	data['studentStandardId']=studentStandardId;
	data['standardId']=$('#standardId').val();
	data['learningProgram']=$('#learningProgram').val();
	data['courseProviderId']=$('#courseProviderId').val();
	
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForHTML('dashboard','delete-uploaded-docs'),
		data : JSON.stringify(data),
		dataType : 'json',
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if(data['status'] == '3'){
					redirectLoginPage();
				}else{
					if(tt=='theme1'){
						showMessage(false, data['MESSAGE']);
					}else{
						showMessageTheme2(0, data['MESSAGE'],'',true);
					}
				}
			} else {
				showMessageTheme2(1, 'Document(s) removed','',true);
			}
		},
		error : function(e) {
			console.log(e)
		}
	});
}


function showLearningProgamGradePlatformModal() {
	$("#changeLearingProgramGradeModal").modal('show');
}
function openConfirmSaveModal(){
	$("#confirmSaveModal").modal('show');
}
function changeLearningProgamGradePlatformModal(studentStandardId, currentLearningProgram, currentStandardId, currentLmsPlatform){
	var newLearningProgram=$('#registrationType').val();
	var newStandardId=$('#standardId').val();
	var newCourseProviderId=$('#lmsPlatform').val();
	// if(currentLearningProgram==newLearningProgram && currentStandardId==newStandardId && currentLmsPlatform==newLmsPlatform){
	// 	showMessageTheme2(0,"To proceed this request, please change Learning Progam or Grade or LMS Platform",'',false);
	// 	return false;
	// }
	var data = {};
	data['schoolId'] = SCHOOL_ID;
	data['userId'] = USER_ID;
	data['studentStandardId'] = studentStandardId;
	data['learningProgram'] = newLearningProgram;
	data['standardId'] = newStandardId;
	data['courseProviderId'] = newCourseProviderId;
	var currentEnrollmentFor='enrollment';
	if(currentLmsPlatform==39){
		currentEnrollmentFor='exact-path-enrollment';
	}
	data['enrollmentFor'] = currentEnrollmentFor;

	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLForHTML('dashboard', 'change-learning-program-grade-platform'),
		data: JSON.stringify(data),
		dataType: 'json',
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if (data['status'] == '3') {
					redirectLoginPage();
				} else {
					showMessageTheme2(false, data['message'], '', true);
				}
			} else {
				$("#confirmSaveModal").modal('hide');
				$("#changeLearingProgramGradeModal").modal('hide');
				$("#lmsPlatformText").text($('#lmsPlatform option:selected').text());
				$("#learningProgramText").text($('#registrationType option:selected').text());
				$("#standardIdText").text($('#standardId option:selected').text());
				if($('#lmsPlatform option:selected').val()==39){
					$(".standardViewName").html($('#lmsPlatform option:selected').text()+' | '+$('#registrationType option:selected').text());
				}else{
					$(".standardViewName").html($('#standardId option:selected').text()+' | '+$('#registrationType option:selected').text());
				}
				$(".compulsorySubjectsdiv").html(courseDetails(data.details.subjects, $('#standardId option:selected').text()))
				if($('#registrationType').val()=='DUAL_DIPLOMA'){
					$("#dualDiplomaAdditionalDetails").show();
				}else if($('#registrationType').val()=='ONE_TO_ONE_FLEX'){
					$("#dualDiplomaAdditionalDetails").hide();
				}else{
					$("#dualDiplomaAdditionalDetails").hide();
				}
				showMessageTheme2(true, 'Profile updated successfully', '', true);
			}
		}
	});
}

function courseDetails(subjectsList, grade){
	var html=
		`<p class="m-0">
			<b>Courses ( ${grade} )</b>
		</p>
		<div class="scroll-course-list scrollbar-container ps--active-y ps">
			<ol class="ml-0">`;
				$.each(subjectsList, function(i, v){
					html+=`<li>${v}</li>`;
				});
			html+=`</ol>
		</div>`;
	return html;

}