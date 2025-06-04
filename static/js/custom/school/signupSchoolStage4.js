$(document).ready(function() {
});
function previewFillSectionSchool1(){
	$('#editStage2Country').text($('#signupStage2 #countryId option:selected').text());
	$('#editStage2State').text($('#signupStage2 #stateId option:selected').text());
	$('#editStage2City').text($('#signupStage2 #cityId option:selected').text());
	$('#editStage2TypeOfschool').text($('#signupStage2 #typeOfSchool option:selected').text());
	$('#editStage2SchoolName').text($('#signupStage2 #schoolName').val().trim());
	$('#editStage2SchoolAddressLine1').text($('#signupStage2 #addressAddress1').val().trim());
	$('#editStage2SchoolAddressLine2').text($("#signupStage2 #addressAddress2").val().trim());
	$('#editStage2SchoolZipcode').text($('#signupStage2 #pincode').val().trim());
	$('#editStage2YearOfEstablishment').text($('#signupStage2 #yearOfEstablishment option:selected').text());
	$('#editStage2SchoolWebSite').text($("#signupStage2 #website").val().trim());
	$('#editStage2SchoolEmailAddress').text($('#signupStage2 #email').val().trim());
	$('#editStage2InstituteHeadName').text($('#signupStage2 #instituteHeadName').val().trim());
	$('#editStage2InstituteHeadTitle').text($('#signupStage2 #instituteHeadTitle').val().trim());
	
	var isd1 = $('#signupStage2 #countryCode option:selected').text().split(" ");
	
	
	$('#editStage2SchoolContactNumber').text(isd1[0] + ' ' + $('#signupStage2 #contactNumber').val().trim());
	$('#editStage2FirstName').text($('#signupStage2 #firstName').val().trim());
	$('#editStage2LastName').text($('#signupStage2 #lastName').val().trim());
	
	if($('#signupStage2 #countryCodeAlternate option:selected').text()!=""){
		var isd2 = $('#signupStage2 #countryCodeAlternate option:selected').text().split(" ");
		$('#editStage2SchoolAlternetContactNumber').text(isd2[0] + ' ' + $('#signupStage2 #contactNumberAlternate').val().trim());
	}
	var isd3 = $('#signupStage2 #contactPersonStdCode option:selected').text().split(" ");
	$('#editStage2ContactEmailAddress').text($('#signupStage2 #communicationEmail').val().trim());
	$('#editStage2NumberOfStudent').text($('#signupStage2 #numberOfStudent option:selected').text());
	$('#editStage2NumberOfStaffs').text($('#signupStage2 #numberOfStaffs option:selected').text());
	$('#editStage2NumberOfClassrooms').text($('#signupStage2 #numberOfClassrooms option:selected').text());
	$('#editStage2TotalSchoolArea').text($('#signupStage2 #totalSchoolArea option:selected').text());
	$('#editStage2ContactPersonPhoneNo').text(isd3[0] + ' ' + $('#signupStage2 #contactPersonPhoneNo').val().trim());
	$('#editStage2ContactPersonDesignation').text($('#signupStage2 #contactPersonDesignation').val().trim());
}
function previewFillSectionSchool2(){
	$('#editStage3NoOfGroupInstitutes').text($('#signupStage3 #noOfGroupInstitutes').val().trim());
	$('#editStage3AssociatedInstituteName').text($('#signupStage3 #associatedInstituteName').val().trim());
	
	$('#editStage3ProgramOffered1').text("Middle School: "+($('#signupStage3 #numberOfStudentMiddleSchool').val().trim()!=''?$('#signupStage3 #numberOfStudentMiddleSchool').val().trim():'NA'));
	$('#editStage3ProgramOffered2').text("High School: "+($('#signupStage3 #numberOfStudentHighSchool').val().trim()!=''?$('#signupStage3 #numberOfStudentHighSchool').val().trim():'NA'));
	$('#editStage3ProgramOffered3').text("Post-Secondary: "+($('#signupStage3 #numberOfStudentPostSecondary').val().trim()!=''?$('#signupStage3 #numberOfStudentPostSecondary').val().trim():'NA'));
	$('#editStage3ProgramOffered4').text("Under Graduate: "+($('#signupStage3 #numberOfStudentUnderGraduate').val().trim()!=''?$('#signupStage3 #numberOfStudentUnderGraduate').val().trim():'NA'));
	$('#editStage3ProgramOffered5').text("Post-Graduate: "+($('#signupStage3 #numberOfStudentPostGraduate').val().trim()!=''?$('#signupStage3 #numberOfStudentPostGraduate').val().trim():'NA'));
	$('#editStage3ProgramOffered6').text("Vocational/Skills: "+($('#signupStage3 #numberOfStudentVocationalSkillDev').val().trim()!=''?$('#signupStage3 #numberOfStudentVocationalSkillDev').val().trim():'NA'));
	
	$('#editStage3NoOfStaffs').text($('#signupStage3 #numberOfStaffs').val().trim());
	$('#editStage3NoOfClassrooms').text($('#signupStage3 #numberOfClassrooms').val().trim());
	$('#editStage3TotalAreaOfInstitution').text($('#signupStage3 #totalSchoolArea').val().trim());
	
	$('#editStage3Affiliating').text($('#signupStage3 #affiliating').val().trim());
    $('#editStage3uploadDocumentAffiliatingName').text($('#signupStage3 #fileupload1Span').html());
    $('#editStage3OtherAssociations').text($('#signupStage3 #otherAssociations').val().trim());
    $('#editStage3uploadDocumentOtherAssociationName').text($('#signupStage3 #fileupload2Span').html());
    $('#editStage3uploadDocumentSchoolLicenceName').text($('#signupStage3 #fileupload3Span').html());
    $('#editStage3uploadDocumentFrontViewName').text($('#signupStage3 #fileupload4Span').html());
    $('#editStage3uploadDocumentPrincipalRoomName').text($('#signupStage3 #fileupload5Span').html());
    $('#editStage3uploadDocumentStaffRoomName').text($('#signupStage3 #fileupload6Span').html());
    $('#editStage3uploadDocumentClassRoomName').text($('#signupStage3 #fileupload7Span').html());
    $('#editStage3uploadDocumentComputerLabName').text($('#signupStage3 #fileupload8Span').html());
    $('#editStage3uploadDocumentPlaygroundName').text($('#signupStage3 #fileupload9Span').html());
}


function getSchoolSignupDetailInReviewStage() {
	previewFillSectionSchool1();
	previewFillSectionSchool2();
	
}
function getRequestForPendingApproval(formId){
	var request = {};
	var authentication = {};
	var requestData = {};
	var schoolReviewAndApprovalDTO = {};
	schoolReviewAndApprovalDTO['userId'] = $("#"+formId+" #userId").val().trim();
	requestData['schoolReviewAndApprovalDTO'] = schoolReviewAndApprovalDTO;
	authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = 'SCHOOL';
	authentication['userId'] = $("#"+formId+" #userId").val().trim();
	request['authentication'] = authentication;
	request['requestData'] = requestData;
	return request;
}
function callForSignupSchoolReviewAndApproval(formId){
	hideMessage('');
	$.ajax({
		type : "POST",
		url : getURLForHTML('school','signup/stage-4'),
		data : "request="+JSON.stringify(getRequestForPendingApproval(formId)),
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
        			showMessage(false, 'School request updated successfully.');
        			$('#submitReviewForSchoolDetailsModal').modal('show');
    				$('#submitReviewForSchoolDetailsModal').modal({backdrop: 'static', keyboard: false})
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