$(document).ready(function() {

});

function validateRequestForSignupSchoolUpdateProfile(formId){
	if($('#roleType').val().trim()=='SCHOOL_B2B'){
		/*if ($("#"+formId+" #noOfGroupInstitutes").val()=="") {
			showMessage(true, 'No of Group Institutions is required');
			return false
		}*/
//		if ($("#"+formId+" #associatedInstituteName").val().trim()=="") {
//			showMessage(true, 'Associated Institute Name is required');
//			return false
//		}
	}
	
	if (!validateFormAscii(formId)) {
		showMessage(false, 'Please use the English Keyboard while providing information');
		return false
	}
	
	
	if ($("#"+formId+" #affiliating").val().trim()=="") {
		showMessage(true, 'Enter Affiliating/Accrediting body name');
		return false
	}
//	if ($("#"+formId+" #otherAssociations").val().trim()=="") {
//		showMessage(true, 'Enter Other Associations name');
//		return false
//	}
	if($('#roleType').val().trim()=='SCHOOL_B2B'){
		if($('#programOfferedMiddleSchool').is(':checked') && $("#"+formId+" #numberOfStudentMiddleSchool").val()==''){
			showMessage(true, 'No of Students in Middle School is required');
			return false
		}
		if($('#programOfferedHighSchool').is(':checked') && $("#"+formId+" #numberOfStudentHighSchool").val().trim()==''){
			showMessage(true, 'No of Students in High School is required');
			return false
		}
		if($('#programOfferedPostSecondary').is(':checked') && $("#"+formId+" #numberOfStudentPostSecondary").val().trim()==''){
			showMessage(true, 'No of Students in Post Secondary is required');
			return false
		}
		if($('#programOfferedUnderGraduate').is(':checked') && $("#"+formId+" #numberOfStudentUnderGraduate").val().trim()==''){
			showMessage(true, 'No of Students in Under Graduate is required');
			return false
		}
		if($('#programOfferedPostGraduate').is(':checked') && $("#"+formId+" #numberOfStudentPostGraduate").val().trim()==''){
			showMessage(true, 'No of Students in Post Graduate is required');
			return false
		}
		
		if($('#programOfferedVocationalSkillDev').is(':checked') && $("#"+formId+" #numberOfStudentVocationalSkillDev").val().trim()==''){
			showMessage(true, 'No of Students in Vocational Skills is required');
			return false
		}
		if ($("#"+formId+" #numberOfStaffs").val().trim()=="") {
			showMessage(true, 'No of Staffs is required');
			return false
		}
		if ($("#"+formId+" #numberOfClassrooms").val().trim()=="") {
			showMessage(true, 'No of Classrooms is required');
			return false
		}
		if ($("#"+formId+" #totalSchoolArea").val().trim()=="") {
			showMessage(true, 'Total Area of Institute is required');
			return false
		}
		if(!$("#"+formId+" #declration1Stage2").is(':checked') || !$("#"+formId+" #declration2Stage2").is(':checked')){
			showMessage(true, 'Please accept the Declaration');
			return false
		}
	}
	if ($("#"+formId+" #fileupload1Span").html()=='' || $("#"+formId+" #fileupload1Span").html().trim()=='Click here to upload Affiliation/Accreditation certificate') {
		showMessage(true, 'Upload Affiliation/Accreditation certificate');
		return false
	}
	if ($("#"+formId+" #fileupload2Span").html()=='' || $("#"+formId+" #fileupload2Span").html().trim()=='Click here to upload Association certificate') {
		showMessage(true, 'Upload Association certificate');
		return false
	}
	if ($("#"+formId+" #fileupload3Span").html()=='' || $("#"+formId+" #fileupload3Span").html().trim()=='Click here to upload School Licence') {
		showMessage(true, 'Upload School Licence');
		return false
	}
	if ($("#"+formId+" #fileupload4Span").html()=='' || $("#"+formId+" #fileupload4Span").html().trim()=='Click here to upload Front view image') {
		showMessage(true, 'Upload Front view image');
		return false
	}
	if ($("#"+formId+" #fileupload5Span").html()=='' || $("#"+formId+" #fileupload5Span").html().trim()=='Click here to upload Principal room image') {
		showMessage(true, 'Upload Principal room image');
		return false
	}
	if ($("#"+formId+" #fileupload6Span").html()=='' || $("#"+formId+" #fileupload6Span").html().trim()=='Click here to upload Staff room image') {
		showMessage(true, 'Upload Staff room image');
		return false
	}
	if ($("#"+formId+" #fileupload7Span").html()=='' || $("#"+formId+" #fileupload7Span").html().trim()=='Click here to upload Classroom image') {
		showMessage(true, 'Upload Classroom image');
		return false
	}
	if ($("#"+formId+" #fileupload8Span").html()=='' || $("#"+formId+" #fileupload8Span").html().trim()=='Click here to upload Computer lab image') {
		showMessage(true, 'Upload Computer lab image');
		return false
	}
	if ($("#"+formId+" #fileupload9Span").html()=='' || $("#"+formId+" #fileupload9Span").html().trim()=='Click here to upload Playground image') {
		showMessage(true, 'Upload Playground image');
		return false
	}
	if($('#roleType').val()=='SCHOOL_B2B'){
		if ($("#"+formId+" #fileupload10Span").html()=='' || $("#"+formId+" #fileupload10Span").html().trim()=='Click here to upload Library image') {
			showMessage(true, 'Upload Library image');
			return false
		}
	}
	
	return true;
}

function callForSignupSchoolUpdateProfile(formId) {
	hideMessage('');
	if(!validateRequestForSignupSchoolUpdateProfile(formId)){
		tabActiveStatus(3);
		return false;
	}
	$("#nextStep").prop("disabled", true);
	$.ajax({
		type : "POST",
		url : getURLForHTML('school','signup/stage-3'),
		data : encodeURI("request="+JSON.stringify(getRequestForSchoolUpdateProfile(formId))),
		dataType : 'html',
		cache : false,
		timeout : 600000,
		success : function(htmlContent) {
			if(htmlContent!=""){
            	var stringMessage = [];
            	stringMessage = htmlContent.split("|");
        		if(stringMessage[0] == "FAILED" || stringMessage[0] == "EXCEPTION" || stringMessage[0] == "SESSIONOUT"){
            			if(stringMessage[0] == "SESSIONOUT"){
            				redirectLoginPage();
            			}else{
        			showMessage(true, stringMessage[1]);
        			tabActiveStatus(3);
            			}
        		} else {
        			$('#signupStage4Content').html(htmlContent)
        			showMessage(false, 'School profile updated successfully.');
        			tabActiveStatus(4);
        		}
        		$("#nextStep").prop("disabled", false);
        			return false;
			}
		},
		error : function(e) {
			//showMessage(true, e.responseText);
			$("#nextStep").prop("disabled", false);
			tabActiveStatus(3);
		}
	});
}
function getRequestForSchoolUpdateProfile(formId){
	var request = {};
	var authentication = {};
	var requestData = {};
	var schoolUpdateProfileDTO = {};
	if($('#roleType').val().trim()=='SCHOOL_B2B'){
		schoolUpdateProfileDTO['noOfGroupInstitutes'] = $("#"+formId+" #noOfGroupInstitutes").val().trim();
		schoolUpdateProfileDTO['associatedInstituteName'] = escapeCharacters($("#"+formId+" #associatedInstituteName").val().trim());
		if($('#programOfferedMiddleSchool').is(':checked')){
			schoolUpdateProfileDTO['programOfferedMiddleSchool'] = 'Y';
			schoolUpdateProfileDTO['numberOfStudentMiddleSchool'] = $("#"+formId+" #numberOfStudentMiddleSchool").val().trim();
		}else{
			schoolUpdateProfileDTO['programOfferedMiddleSchool'] = 'N';
		}
		if($('#programOfferedHighSchool').is(':checked')){
			schoolUpdateProfileDTO['programOfferedHighSchool'] = 'Y';
			schoolUpdateProfileDTO['numberOfStudentHighSchool'] = $("#"+formId+" #numberOfStudentHighSchool").val().trim();
		}else{
			schoolUpdateProfileDTO['programOfferedHighSchool'] = 'N';
		}
		if($('#programOfferedPostSecondary').is(':checked')){
			schoolUpdateProfileDTO['programOfferedPostSecondary'] = 'Y';
			schoolUpdateProfileDTO['numberOfStudentPostSecondary'] = $("#"+formId+" #numberOfStudentPostSecondary").val().trim();
		}else{
			schoolUpdateProfileDTO['programOfferedPostSecondary'] = 'N';
		}
		if($('#programOfferedUnderGraduate').is(':checked')){
			schoolUpdateProfileDTO['programOfferedUnderGraduate'] = 'Y';
			schoolUpdateProfileDTO['numberOfStudentUnderGraduate'] = $("#"+formId+" #numberOfStudentUnderGraduate").val().trim();
		}else{
			schoolUpdateProfileDTO['programOfferedUnderGraduate'] = 'N';
		}
		if($('#programOfferedPostGraduate').is(':checked')){
			schoolUpdateProfileDTO['programOfferedPostGraduate'] = 'Y';
			schoolUpdateProfileDTO['numberOfStudentPostGraduate'] = $("#"+formId+" #numberOfStudentPostGraduate").val().trim();
		}else{
			schoolUpdateProfileDTO['programOfferedPostGraduate'] = 'N';
		}
		
		if($('#programOfferedVocationalSkillDev').is(':checked')){
			schoolUpdateProfileDTO['programOfferedVocationalSkillDev'] = 'Y';
			schoolUpdateProfileDTO['numberOfStudentVocationalSkillDev'] = $("#"+formId+" #numberOfStudentVocationalSkillDev").val().trim();
		}else{
			schoolUpdateProfileDTO['programOfferedVocationalSkillDev'] = 'N';
		}
		
		schoolUpdateProfileDTO['numberOfStaffs'] = $("#"+formId+" #numberOfStaffs").val().trim();
		schoolUpdateProfileDTO['numberOfClassrooms'] = $("#"+formId+" #numberOfClassrooms").val().trim();
		schoolUpdateProfileDTO['totalSchoolArea'] = $("#"+formId+" #totalSchoolArea").val().trim();
		if($('#declration1Stage2').is(':checked')){
			schoolUpdateProfileDTO['declration1Stage2'] = 'Y';
		}else{
			schoolUpdateProfileDTO['declration1Stage2'] = 'N';
		}
		if($('#declration2Stage2').is(':checked')){
			schoolUpdateProfileDTO['declration2Stage2'] = 'Y';
		}else{
			schoolUpdateProfileDTO['declration2Stage2'] = 'N';
		}
		if($('#declration3Stage2').is(':checked')){
			schoolUpdateProfileDTO['declration3Stage2'] = 'Y';
		}else{
			schoolUpdateProfileDTO['declration3Stage2'] = 'N';
		}
	}
	schoolUpdateProfileDTO['affiliating'] = escapeCharacters($("#"+formId+" #affiliating").val().trim());
	schoolUpdateProfileDTO['otherAssociations'] = escapeCharacters($("#"+formId+" #otherAssociations").val().trim());
	requestData['schoolUpdateProfileDTO'] = schoolUpdateProfileDTO;
	authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = 'SCHOOL';
	authentication['userId'] = $("#"+formId+" #userId").val().trim();
	request['authentication'] = authentication;
	request['requestData'] = requestData;
	return request;
}


