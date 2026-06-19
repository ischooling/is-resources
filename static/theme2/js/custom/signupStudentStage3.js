var STUDENT_DOCS_REQUIRED = "N";
var STUDENT_DOCS_MANDATORY = "N";
var STUDENT_DOCS_FLOW_DONE = false;
var STUDENT_DOCS_CURRENT_STANDARD_ID = "";
var STUDENT_DOCS_FILE_STORE = {};
var STUDENT_DOCS_PENDING_PAYLOAD = null;
var STUDENT_DOCS_SUBMITTED = "N";
var STUDENT_DOCS_VERIFIED = "N";
var STUDENT_DOCS_STATUS_LOADED = false;
var STUDENT_DOCS_PREVIEW_BLOB_URL = "";
var STUDENT_DOCS_VERIFICATION_MODAL_RETRY = 0;
var STUDENT_DOCS_STATUS_PROMISE = null;
var STUDENT_DOCS_LAST_STATUS_SEQ = 0;
var STUDENT_DOCS_COURSE_DETAILS_SEQ = 0;
var STUDENT_DOCS_FEATURE_ENABLED = null;
var STUDENT_DOC_CAMERA_STREAM = null;
var STUDENT_DOCS_SUBMITTED_COUNT = 0;
var STUDENT_DOCS_VERIFIED_COUNT = 0;
var STUDENT_DOCS_IS_REUPLOAD_FLOW = false;
var STUDENT_DOCS_SERVER_RESPONSE = null;
var STUDENT_DOCS_UNVERIFIED_MAP = {};
var STUDENT_DOCS_AUTO_OPEN_REUPLOAD = false;
var STUDENT_DOCS_ENROLLMENT_STATE = "";
var IS_DOCUMENT_SKIP = false;

function isStudentEnrollmentDocumentsEnabled(){
	if(STUDENT_DOCS_FEATURE_ENABLED !== null){
		return STUDENT_DOCS_FEATURE_ENABLED === true;
	}
	try{
		if(typeof getSettingsByTypeAndKey === "function"){
			var response = getSettingsByTypeAndKey("CONFIGURATION","ENABLE_STUDENT_ENROLLMENT_DOCUMENTS");
			var parsed = (typeof response === "string") ? JSON.parse(response) : response;
			var metaValue = (parsed && parsed.data && parsed.data.metaValue != null) ? parsed.data.metaValue : "";
			STUDENT_DOCS_FEATURE_ENABLED = (metaValue.toString().toLowerCase() === "true");
			return STUDENT_DOCS_FEATURE_ENABLED === true;
		}
	}catch(e){}
	STUDENT_DOCS_FEATURE_ENABLED = false;
	return false;
}

function toggleChangeGradeVisibility(){
	try{
		if(STUDENT_DOCS_VERIFIED === "Y"){
			$(".change-grade").hide();
		}else{
			$(".change-grade").show();
		}
	}catch(e){}
}

function isStudentDocumentReuploadFlow(){
	return STUDENT_DOCS_IS_REUPLOAD_FLOW === true;
}

function syncStudentDocumentStatusMeta(data){
	data = data || {};
	STUDENT_DOCS_SUBMITTED_COUNT = parseInt(data.submittedCount || STUDENT_DOCS_SUBMITTED_COUNT || 0, 10) || 0;
	STUDENT_DOCS_VERIFIED_COUNT = parseInt(data.verifiedCount || STUDENT_DOCS_VERIFIED_COUNT || 0, 10) || 0;
}

function getStudentEnrollmentDocsState(){
	return (STUDENT_DOCS_ENROLLMENT_STATE || "").toString().toUpperCase();
}

function applyStudentEnrollmentDocsState(enrollmentDocsState){
	STUDENT_DOCS_ENROLLMENT_STATE = (enrollmentDocsState || "").toString().toUpperCase();
	STUDENT_DOCS_AUTO_OPEN_REUPLOAD = false;
	if(STUDENT_DOCS_ENROLLMENT_STATE === "PAYMENT"){
		STUDENT_DOCS_REQUIRED = "N";
		STUDENT_DOCS_MANDATORY = "N";
		STUDENT_DOCS_IS_REUPLOAD_FLOW = false;
		STUDENT_DOCS_FLOW_DONE = true;
	}else if(STUDENT_DOCS_ENROLLMENT_STATE === "UNDER_VERIFICATION"){
		STUDENT_DOCS_IS_REUPLOAD_FLOW = false;
		STUDENT_DOCS_FLOW_DONE = true;
	}else if(STUDENT_DOCS_ENROLLMENT_STATE === "REUPLOAD"){
		STUDENT_DOCS_IS_REUPLOAD_FLOW = true;
		STUDENT_DOCS_FLOW_DONE = false;
		STUDENT_DOCS_AUTO_OPEN_REUPLOAD = true;
	}else if(STUDENT_DOCS_ENROLLMENT_STATE === "UPLOAD"){
		STUDENT_DOCS_IS_REUPLOAD_FLOW = false;
		STUDENT_DOCS_FLOW_DONE = false;
	}
	updateStudentDocumentStepActionButtons();
}

function updateStudentDocumentStepActionButtons(){
	var currentStep = $(".step.active-step").index() + 1;
	var actionsList = $(".actions > ul");
	if(actionsList.length < 1){
		return;
	}
	if(currentStep === 3 && getStudentEnrollmentDocsState() === "PAYMENT" && STUDENT_DOCS_VERIFIED == "Y"){
		$(".prev-btn").hide();
		actionsList.css({
			"display":"flex",
			"justify-content":"flex-end",
			"align-items":"center",
			"gap":"12px"
		});
	}else{
		$(".prev-btn").show();
		actionsList.css({
			"display":"",
			"justify-content":"",
			"align-items":"",
			"gap":""
		});
	}
}

function getStudentServerDocumentKey(doc){
	if(!doc){
		return "";
	}
	if(parseInt(doc.fileType, 10) === 78){
		return "passport";
	}
	if(parseInt(doc.fileType, 10) === 79){
		return "dob";
	}
	if(parseInt(doc.fileType, 10) === 80 && doc.standardId){
		return "acad_" + doc.standardId;
	}
	return "doc_" + (doc.id || "");
}

function isStudentDocumentMarkedUnverified(doc){
	if(!doc){
		return false;
	}
	var isDocumentVerified = (doc.isDocumentVerified || "").toString().toUpperCase();
	if(isDocumentVerified === "N"){
		return true;
	}
	if(isDocumentVerified === "Y"){
		return false;
	}
	return ((doc.isVerificationRequired || "N") + "").toString().toUpperCase() === "Y";
}

function getStudentDocumentBuckets(documentsResponse){
	var attachments = (documentsResponse && documentsResponse.attachments) ? documentsResponse.attachments : {};
	var rawDocs = (documentsResponse && documentsResponse.documents) ? documentsResponse.documents : [];
	var personalDocs = [];
	var academicDocs = [];
	var unverifiedMap = {};
	var unnamedDocs = [];

	if(attachments.passportSizePhotoURL){
		personalDocs.push({
			key: "passport",
			label: "Passport Size Photo",
			url: attachments.passportSizePhotoURL,
			name: attachments.passportSizePhotoName || attachments.passportSizePhotoDocumentName || "file"
		});
	}
	if(attachments.dobProofURL){
		personalDocs.push({
			key: "dob",
			label: "DOB Proof",
			url: attachments.dobProofURL,
			name: attachments.dobProofName || attachments.dobProofDocumentName || "file"
		});
	}
	// if(attachments.previousYearDocsURL){
	// 	personalDocs.push({
	// 		key: "previousYear",
	// 		label: "Previous Year Docs",
	// 		url: attachments.previousYearDocsURL,
	// 		name: attachments.previousYearDocsName || attachments.previousYearDocsDocumentName || "file",
	// 		isDocumentVerified: "Y"
	// 	});
	// }

	$.each(rawDocs, function(i, doc){
		var key = getStudentServerDocumentKey(doc);
		var standardName = $.trim(doc.standardName || "");
		var documentName = $.trim(doc.documentName || "");
		var isUnverified = isStudentDocumentMarkedUnverified(doc);
		if(key === "passport" || key === "dob"){
			if(isUnverified){
				unverifiedMap[key] = doc;
			}
			return;
		}
		if(key.indexOf("acad_") === 0){
			academicDocs.push(doc);
			if(isUnverified){
				unverifiedMap[key] = doc;
			}
			return;
		}
		if(!standardName && !documentName && !doc.standardId){
			unnamedDocs.push(doc);
			return;
		}
		academicDocs.push(doc);
	});

	var fallbackPersonalKeys = [];
	$.each(personalDocs, function(i, item){
		if((item.key === "passport" || item.key === "dob") && !unverifiedMap[item.key]){
			fallbackPersonalKeys.push(item.key);
		}
	});
	$.each(unnamedDocs, function(i, doc){
		var isUnverified = isStudentDocumentMarkedUnverified(doc);
		if(!isUnverified){
			return;
		}
		var fallbackKey = fallbackPersonalKeys.shift();
		if(fallbackKey){
			unverifiedMap[fallbackKey] = doc;
		}
	});

	$.each(personalDocs, function(i, item){
		if(!item.isDocumentVerified){
			item.isDocumentVerified = unverifiedMap[item.key] ? "N" : "Y";
		}
	});

	return {
		personalDocs: personalDocs,
		academicDocs: academicDocs,
		unverifiedMap: unverifiedMap
	};
}

function clearStudentDocumentHighlightStates(){
	$("#studentDocumentUploadModal .student-doc-reupload-target").removeClass("border border-danger rounded p-2");
	$("#studentDocumentUploadModal .student-doc-reupload-label").removeClass("text-danger");
	$("#studentDocumentUploadModal .student-doc-reupload-note").remove();
}

function resetStudentDocumentsModalTransientState(){
	STUDENT_DOCS_FILE_STORE = {};
	STUDENT_DOCS_PENDING_PAYLOAD = null;
	$("#studentDocumentUploadModal input[type='file']").val("");
	$("#studentDocPassportFileName").text("Passport Size Photo");
	$("#studentDocDobFileName").text($.trim($("#studentDocDobProofType").val()) !== "" ? "Upload your file" : "Select proof type first");
	$("#studentDocPassportView, #studentDocPassportRemove, #studentDocDobView, #studentDocDobRemove").hide();
	$("#studentDocPassportCameraBtn").show();
	setStudentPassportPreviewImage("");
	$("[id^='studentAcademicFileName_acad_']").text("Upload your file");
	$("[id^='studentAcademicView_acad_'], [id^='studentAcademicRemove_acad_']").hide();
}

function markStudentDocumentForReupload(docKey, noteText){
	var noteHtml = '<div class="student-doc-reupload-note text-danger font-12 mt-1"><i class="fa fa-exclamation-circle mr-1"></i>' + (noteText || "Re-upload required") + '</div>';
	if(docKey === "passport"){
		$("#studentDocPassportWrap").addClass("student-doc-reupload-target border border-danger rounded p-2");
		$("#studentDocPassportWrap").find("label:first").addClass("student-doc-reupload-label");
		if($("#studentDocPassportWrap").find(".student-doc-reupload-note").length < 1){
			$("#studentDocPassportWrap").append(noteHtml);
		}
	}else if(docKey === "dob"){
		$("#studentDocDobWrap").addClass("student-doc-reupload-target border border-danger rounded p-2");
		$("#studentDocDobWrap").find("label:first").addClass("student-doc-reupload-label");
		if($("#studentDocDobWrap").find(".student-doc-reupload-note").length < 1){
			$("#studentDocDobWrap").append(noteHtml);
		}
	}else{
		var row = $("#studentAcademicFile_" + docKey).closest(".student-academic-doc-item");
		row.addClass("student-doc-reupload-target border border-danger");
		row.find(".student-academic-doc-title:first").addClass("student-doc-reupload-label");
		if(row.find(".student-doc-reupload-note").length < 1){
			row.find(".student-academic-doc-body:first").append(noteHtml);
		}
		var collapseEl = row.find(".collapse");
		if(collapseEl.length > 0){
			collapseEl.collapse("show");
		}
	}
}

function setStudentPassportPreviewImage(imageSrc){
	$("#studentDocPassportPreviewImage").attr("src", imageSrc || PATH_FOLDER_IMAGE2+'male-profile.png');
}

function triggerStudentDocFileInput(inputId){
	$("#" + inputId).trigger("click");
}

function openStudentDocCameraFromTrigger(event){
	if(event){
		event.preventDefault();
		event.stopPropagation();
	}
	openStudentDocCameraModal();
}

function updateStudentDocumentModalPanelLayout(showPersonalSection, showAcademicSection){
	var personalColumn = $("#studentPersonalDocsColumn");
	var academicColumn = $("#studentAcademicDocsColumn");
	personalColumn.toggle(!!showPersonalSection);
	academicColumn.toggle(!!showAcademicSection);
	personalColumn.removeClass("col-lg-5 col-lg-12").addClass(showAcademicSection && showPersonalSection ? "col-lg-5" : "col-lg-12");
	academicColumn.removeClass("col-lg-7 col-lg-12").addClass(showAcademicSection && showPersonalSection ? "col-lg-7" : "col-lg-12");
}

function populateStudentDocumentReuploadData(documentsResponse){
	STUDENT_DOCS_SERVER_RESPONSE = documentsResponse || {};
	var documentBuckets = getStudentDocumentBuckets(documentsResponse || {});
	STUDENT_DOCS_UNVERIFIED_MAP = documentBuckets.unverifiedMap || {};
	clearStudentDocumentHighlightStates();

	if(!isStudentDocumentReuploadFlow() || Object.keys(STUDENT_DOCS_UNVERIFIED_MAP).length < 1){
		return;
	}

	$.each(STUDENT_DOCS_UNVERIFIED_MAP, function(key, doc){
		if(key === "dob"){
			if(doc.documentName){
				$("#studentDocDobProofType").val(doc.documentName);
			}
		}else if(key.indexOf("acad_") === 0){
			if(doc.documentName){
				$("#studentDocName_" + key).val(doc.documentName);
				syncStudentDocSuggestionState(key);
			}
			if(doc.schoolName){
				$("#studentSchoolName_" + key).val(doc.schoolName);
			}
			if(doc.boardName){
				$("#studentBoardName_" + key).val(doc.boardName);
			}
			if(doc.passingYear){
				$("#studentPassingYear_" + key).val(doc.passingYear);
			}
		}
		markStudentDocumentForReupload(key, "This document is invalid. Please re-upload.");
	});
}

function tryAutoOpenStudentReuploadModal(){
	if(STUDENT_DOCS_AUTO_OPEN_REUPLOAD && isStudentDocumentReuploadFlow() && $("#studentDocumentUploadModal").length > 0){
		STUDENT_DOCS_AUTO_OPEN_REUPLOAD = false;
		window.setTimeout(function(){
			openStudentDocumentsModal();
		}, 250);
	}
}

function showWarningMessageForNTAA(warningMessage, functionName) {
	if (functionName == '') {
		$('#noTeacherAssistanceAvailableYes').hide();
		$('#noTeacherAssistanceAvailableNo').hide();
	} else {
		$('#noTeacherAssistanceAvailableYes').show();
		$('#noTeacherAssistanceAvailableNo').show();
	}
	functionName = "$('#noTeacherAssistanceAvailable').modal('hide');window.setTimeout(function(){" + functionName + ";},1000);";
	if (warningMessage != '') {
		$('#noTeacherAssistanceAvailableMessage').html(warningMessage);
	}
	$('#noTeacherAssistanceAvailableYes').attr('onclick', functionName);
	$('#noTeacherAssistanceAvailable').modal('show');
	$('#creditsLimitsOverModal, #creditsLimitsModal').modal('hide');
}
function showWarningMessageForAPCourses(warningMessage, functionName) {
	if (functionName == '') {
		$('#apCourseSelectionWarningClose').hide();
	} else {
		$('#apCourseSelectionWarningClose').show();
	}
	functionName = "$('#apCourseSelectionWarning').modal('hide');window.setTimeout(function(){" + functionName + ";},1000);";
	if (warningMessage != '') {
		$('#statusMessage-2').html(warningMessage);
	}
	$('#apCourseSelectionWarningClose').attr('onclick', functionName);
	var functionNameNo = "$('#apCourseSelectionWarning').modal('hide');apCourseSelectionFlag=false;";
	$('#apCourseSelectionWarningNo').attr('onclick', functionNameNo);
	$('#apCourseSelectionWarning').modal('show');
}

function creditLimitOver(standardId, totalCredit){
	var min_limit=$('#signupStage3 #standardId').attr('min_limit');
	var max_limit=$('#signupStage3 #standardId').attr('max_limit');
	var upper_band=$('#signupStage3 #standardId').attr('upper_band');
	if(parseFloat(totalCredit)>parseFloat(max_limit)){
		return true;
	}
	return false;
}

function assignEvent(indexPosition, subjectId, courseId, tabActive, userReachedMaxLimit, courseCreditLimit, courseSelectedCredit, subjectCredit, remarks, courseType, flagType, standardId, totalCredit,courseFee) {
	if (subjectId == '') {
		showMessageTheme2(2, 'Please select a course then click on the add button.');
		return false;
	}
	var creditLimitWarning=false;
	var creditsLimitsOver=false;
	// var creditsLimitsOver=creditLimitOver(standardId, totalCredit);
	if(flagType == 'add'){
		if(parseFloat($('#totalCreditInput').val())>=parseFloat($('#signupStage3 #standardId').attr('upper_band'))){
			showMessageTheme2(2, 'You can select a maximum of '+$('#signupStage3 #standardId').attr('upper_band')+' credits.');
			return false;
		}
		if(parseFloat($('#totalCreditInput').val())>=parseFloat($('#signupStage3 #standardId').attr('max_limit'))){
			creditsLimitsOver=true
		}
	}
	if(flagType == 'add' && $("#oneTimeModal").val() == "false"){
		if(creditsLimitsOver){
			creditLimitWarning=true;
		}
	}
	if(creditLimitWarning){
		// var functionName = "addCourseLimits('" + indexPosition + "','" + subjectId + "','" + courseId + "','" + tabActive + "','" + userReachedMaxLimit + "','" + courseCreditLimit + "','" + courseSelectedCredit + "','" + subjectCredit + "','" + remarks + "','" + courseType + "','" + courseFee + "');updateCourseLimit();";
		$("#addCourseLimitBtn").attr("onclick",'updateCourseLimit();');
		var creditsLimitsModalMessage=$('#totalCredit').text()+'. Now extra fee will be charged for choosing extra courses.'
		$('#creditsLimitsModalMessage').html(creditsLimitsModalMessage);
		$("#creditsLimitsModal").modal("show");
	}
	if(creditsLimitsOver){
		if(SHOW_PAYMENT_OPTION=='Y'){
			var creditsLimitsOverModalMessage='Extra fee of '+courseFee+' will be charged for selecting '+$('#course_name_'+subjectId).text()+'. Kindly confirm this selection.';
			$('#creditsLimitsOverModalMessage').html(creditsLimitsOverModalMessage);
			if(!creditLimitWarning){
				$("#creditsLimitsOverModal").modal("show");
			}
			var functionName = "addCourseLimits('" + indexPosition + "','" + subjectId + "','" + courseId + "','" + tabActive + "','" + userReachedMaxLimit + "','" + courseCreditLimit + "','" + courseSelectedCredit + "','" + subjectCredit + "','" + remarks + "','" + courseType + "','" + courseFee + "');";
			$("#addCourseOverLimitBtn").attr("onclick",functionName)
		}else{
			var functionName = "addCourseLimits('" + indexPosition + "','" + subjectId + "','" + courseId + "','" + tabActive + "','" + userReachedMaxLimit + "','" + courseCreditLimit + "','" + courseSelectedCredit + "','" + subjectCredit + "','" + remarks + "','" + courseType + "','" + courseFee + "');";
			$("#addCourseOverLimitBtn").attr("onclick",functionName)
			$("#addCourseOverLimitBtn").trigger('click');
		}
	}else{
		var functionName = "addCourse('" + subjectId + "','" + courseId + "','" + tabActive + "','" + userReachedMaxLimit + "','" + courseCreditLimit + "','" + courseSelectedCredit + "','" + subjectCredit + "','" + remarks + "','" + courseType + "','" + courseFee + "');";
		$('#add_course_' + courseId + '_' + indexPosition).attr('onclick', functionName);
		addCourse(subjectId, courseId, tabActive, userReachedMaxLimit, courseCreditLimit, courseSelectedCredit, subjectCredit, remarks, courseType,courseFee)
	}
}

function addCourseLimits(indexPosition, subjectId, courseId, tabActive, userReachedMaxLimit, courseCreditLimit, courseSelectedCredit, subjectCredit, remarks, courseType,courseFee){
	var functionName = "addCourse('" + subjectId + "','" + courseId + "','" + tabActive + "','" + userReachedMaxLimit + "','" + courseCreditLimit + "','" + courseSelectedCredit + "','" + subjectCredit + "','" + remarks + "','" + courseType + "','" + courseFee + "');";
	$('#add_course_' + courseId + '_' + indexPosition).attr('onclick', functionName);
	$("#creditsLimitsOverModal").modal("hide");	
	addCourse(subjectId, courseId, tabActive, userReachedMaxLimit, courseCreditLimit, courseSelectedCredit, subjectCredit, remarks, courseType,courseFee)
}

function addCourse(subjectId, courseId, tabActive, userReachedMaxLimit, courseCreditLimit, courseSelectedCredit, subjectCredit, remarks, courseType,courseFee) {
	if (subjectId == '') {
		showMessageTheme2(2, 'Please select a course then click on the add button.');
		return false;
	}
	if (SCHOOL_ID == 1) {
		if (courseType == 'Advanced Placement' && !apCourseSelectionFlag) {
			apCourseSelectionFlag = true
			functionName = "addCourse('" + subjectId + "','" + courseId + "','" + tabActive + "','" + userReachedMaxLimit + "','" + courseCreditLimit + "','" + courseSelectedCredit + "','" + subjectCredit + "','" + remarks + "','" + courseType + "','" + courseFee + "');";
			showWarningMessageForAPCourses('', functionName)
			return false;
		}
	}
	if (remarks == 0) {
		functionName = "addCourse('" + subjectId + "','" + courseId + "','" + tabActive + "','" + userReachedMaxLimit + "','" + courseCreditLimit + "','" + courseSelectedCredit + "','" + subjectCredit + "','1','" + courseType + "','" + courseFee + "');";
		showWarningMessageForNTAA('', functionName);
		return false;
	}
	var selectedSubjects = $('#selectedSubjects').val() + ',' + subjectId;
	$('#selectedSubjects').val(selectedSubjects)
	if ($('.modal-backdrop').length > 0) {
		$('.modal-backdrop').remove();
	}
	$("#controlType").val('add');
	getAllCourseDetails('N', courseId);
}

function removeCourse(subjectId, courseId, activeTab) {
	var selectedSubjects = $('#selectedSubjects').val().trim();
	selectedSubjects = selectedSubjects.split(',');
	// console.log('selectedSubjects remove '+selectedSubjects);
	selectedSubjects = selectedSubjects.filter(subId => subId !== subjectId)
	selectedSubjects = selectedSubjects.join(',');
	// console.log('selectedSubjects remove '+selectedSubjects);
	$('#selectedSubjects').val(selectedSubjects);
	$(".course-category").find("div[seletedsubject='" + subjectId + "']").addClass("slideout-animation").removeClass("slide-animation");
	setTimeout(function () {
		$(".course-category").find("div[seletedsubject='" + subjectId + "']").hide();
	}, 800);
	$("#controlType").val('remove');
	getAllCourseDetails('N', courseId);

}

function removeAllCourseWarning() {
	var selectedCourseLength = $(".course-category > div.course-item").length;
	if (selectedCourseLength > 0) {
		$("#removeAllCoruses").modal('show');
	} else {
		return false;
	}
}

function removeAllCourse() {
	$('#selectedSubjects').val("");
	$("#removeAllCoruses").modal("hide");
	$("body").find(".modal-backdrop.fade").remove();
	$("body").removeClass("modal-open");
	$("#controlType").val('remove');
	getAllCourseDetails('N', '');
	// $(".step3").removeClass("done-step");
	apCourseSelectionFlag = false;
}

async function showPaymentTermCondMode(src) {
	var schoolId = $(src).attr('schoolId');
	var userPaymentDetailsId = $(src).attr('userPaymentDetailsId');
	var entityType = $(src).attr('entityType');
	var entityId = $(src).attr('entityId');
	var paidByUserId = $(src).attr('paidByUserId');
	await getPaymentGatewaysOptions(schoolId, schoolId, userPaymentDetailsId, entityType, entityId, paidByUserId);
	$("#bookAnEnrollmentTNC").modal("hide");
}
async function showPaymentModal() {
	hideModalMessage('');
	if($('#signupType').val() == 'Online' ){
		var payload = {
			'userId' : USER_ID
		}; 
		var responseData = await getDashboardDataBasedUrlAndPayloadWithParentUrl(true,true,'get-commission-pay-by',payload,'student/enrollment');
		SHOW_PAYMENT_OPTION = responseData.showPaymentOption;
		if(SHOW_PAYMENT_OPTION=='Y'){
			await callLocationForPaymentPromise();
			if ($("#payMode").val() == 'registration') {
				// $('#courseFeeModalTNC').modal('hide');
				// $('#bookAnEnrollmentTNC').modal('show');
				// $("#bookAnEnrollmentTNC .modal-dialog").css({"transform":"translateY(-45%)"})
				var schoolId = $('.payabledetails').attr('schoolId');
				var userPaymentDetailsId = $('.payabledetails').attr('userPaymentDetailsId');
				checkPayment("", userPaymentDetailsId, schoolId);
			} else {
				var schoolId = $('.payabledetails').attr('schoolId');
				var userPaymentDetailsId = $('.payabledetails').attr('userPaymentDetailsId');
				var entityType = $('.payabledetails').attr('entityType');
				var entityId = $('.payabledetails').attr('entityId');
				var paidByUserId = $('.payabledetails').attr('paidByUserId');
				getPaymentGatewaysOptions(schoolId, schoolId, userPaymentDetailsId, entityType, entityId, paidByUserId);
			}
		} else {
			$('#submitApplicationWarning').modal({ backdrop: 'static', keyboard: false })
			$('#goToDashboardWarningMessage').hide();
		}
	}else{
		$('#submitApplicationWarning').modal({ backdrop: 'static', keyboard: false })
		$('#goToDashboardWarningMessage').hide();
	}
}

function getAllCourseDetails(isGradeChange, courseId) {
	$("#commonloaderId, #commonloaderBody").show();
	var docsStatusSeq = ++STUDENT_DOCS_COURSE_DETAILS_SEQ;
	var standardId = $("#signupStage3 #standardId").val();
	if (isGradeChange == 'Y') {
		$('#selectedSubjects').val('');
	}
	if (standardId == '' || standardId == 0) {
		$('#courseSubjectDetails').html('')
	}
	
	//$("#addAndRemoveLoader").css({ "display": "block" });
	$.ajax({
		type: "POST",
		contentType: APPLICATION_JSON_VALUE,
		url: BASE_URL + CONTEXT_PATH + SCHOOL_UUID +'/student/enrollment/course-details-by-standard-id',
		data: JSON.stringify(getRequestForCourseSelection(courseId)),
		dataType: 'json',
		async: true,
		global: true,
		success: function (data) {
			updateStudentDocumentRequirements(data);
			// Call once per course-details call only when status isn't already known from JSP.
			if(isStudentEnrollmentDocumentsEnabled()){
				if(!STUDENT_DOCS_STATUS_LOADED){
					loadStudentDocumentsStatus(true, docsStatusSeq);
				}else if(getStudentEnrollmentDocsState() === "UNDER_VERIFICATION"){
					openStudentDocsUnderVerificationModal();
				}
			}else{
				STUDENT_DOCS_STATUS_LOADED = true;
				STUDENT_DOCS_REQUIRED = "N";
				STUDENT_DOCS_MANDATORY = "N";
				STUDENT_DOCS_SUBMITTED = "N";
				STUDENT_DOCS_VERIFIED = "N";
				STUDENT_DOCS_FLOW_DONE = true;
				toggleChangeGradeVisibility();
			}
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if (data['status'] == '3') {
					redirectLoginPage();
				} else if(data['statusCode'] == "FLAGGED"){
					$("#flaggedModal").remove();
					$("body").append(flaggedModalContent(data));
					$("#flaggedModal").modal("show");
					// $(".step-3-skeleton").hide();
					// $("#signupStage3").hide();
					// $("#signupStage2").show();
					// setActiveStep(2);
					// $(".prev-btn, .next-btn").removeClass("disabled");
				} else {
					if (data['statusCode'] == 'ELIGIBLE_CUSTOME_PLAN' || data['statusCode'] == 'REDIRECT_TO_DASHBOOARD') {
						window.location.reload();
					} else {
						showMessageTheme2(false, data['message']);
					}
				}
			} else {
				$("#creditsLimitsModal, #creditsLimitsOverModal").modal("hide");
				showMessageTheme2(true, data['message']);
				$(".step-3-skeleton").html('');
				$(".step-3-skeleton").hide('');
				$("#signupStage3").show();
				renderCourseSelectionContent(data);
				if(courseId == null || courseId == undefined || courseId ==''){
					$.each(data.availableCourses, function(i,v){
						if(v.subjects.length > 0){
							courseId = v.courseId;
							return false;
						}
					})
				}
				showSpecificContentNew('ft_courses', courseId);
				$('#courseFirstListOpen').val(1);
				$("#addAndRemoveLoader").css({ "display": "none" });
				if($('.learingProgramHeader').attr('val')=='ONE_TO_ONE_FLEX' ){
					var dob=$('#dob').val();
					$('#applyStandardId').val($('#signupStage3 #gradeId').val()).trigger('change');
					$('#dob').val(dob);
				}
			}
			$(".prev-btn, .next-btn").removeClass("disabled");
			$("#commonloaderId, #commonloaderBody").hide();
		},
		error: function(e){
			if (checkonlineOfflineStatus()) {
				return;
			}
		}
	});
}
function updateCourseLimit(){
	var standardId=$('#signupStage3 #standardId').val();
	var totalCredit=$('#totalCreditInput').val();
	var creditsLimitsOver=creditLimitOver(standardId, totalCredit);
	if(creditsLimitsOver){
		$("#oneTimeModal").val(true);
	}else{
		$("#oneTimeModal").val(false);
	}
	$('#creditsLimitsModal').modal('hide');
	setTimeout(function(){
		$('#creditsLimitsOverModal').modal('show');
	},500)
}

function getRequestForCourseSelection(courseId) {
	var studentCourseDetailsInfoDTO = {};
	studentCourseDetailsInfoDTO['userId'] = $('#userId').val();
	studentCourseDetailsInfoDTO['courseId'] = courseId;
	studentCourseDetailsInfoDTO['callFrom'] = 'signup';
	if ($("#signupStage3 #standardId").length > 0) {
		studentCourseDetailsInfoDTO['standardId'] = $("#signupStage3 #standardId").val();
	}
	if ($("#selectedSubjects").length > 0) {
		studentCourseDetailsInfoDTO['selectedSubjects'] = $("#selectedSubjects").val();
	} else {
		studentCourseDetailsInfoDTO['selectedSubjects'] = '';
	}
	studentCourseDetailsInfoDTO['controlType'] = $("#controlType").val();
	if($("#courseCategory").length){
		var preferredCourseId=[];
		preferredCourseId.push($("#courseCategory").val());
		studentCourseDetailsInfoDTO['preferredCourseId']=preferredCourseId;
	}
	return studentCourseDetailsInfoDTO;
}

function activeTabList(courseHeadId) {
	//$(this).parent().closest('li').find('.a-content').slideToggle();
	//$('.accordion li:first-child .a-content').slideToggle();
	$(".courseSelectId-" + courseHeadId).parent().closest('li').find('.a-content').slideToggle();
	$(".courseSelectId-" + courseHeadId).parent().closest('li').siblings().find('.a-content').slideUp();
	$(".courseSelectId-" + courseHeadId).parent().closest('li').find('.plus-icon').toggleClass('fa-minus fa-plus')
	$(".courseSelectId-" + courseHeadId).parent().closest('li').siblings().find('.plus-icon').removeClass('fa-minus')
	$(".courseSelectId-" + courseHeadId).parent().closest('li').siblings().find('.plus-icon').removeClass('fa-plus')
	$(".courseSelectId-" + courseHeadId).parent().closest('li').siblings().find('.a-content').slideUp();
}

function showSpecificContentNew(tabId, liId) {
	$('.custom-tab-wrapper li a').addClass('inactive');
	$('#' + tabId).removeClass("inactive");
	$('#' + tabId).parent().addClass("active-tab").siblings().removeClass("active-tab");
	//$('#'+tabId).parent().parent().next().find('#'+tabId+'C').show().siblings().hide();
	if (tabId == 'ft_courses') {
		$("#ft_coursesC").show();
		$("#ap_coursesC").hide();
		$("#cs_coursesC").hide();
		$("#cte_coursesC").hide();
		$("#hon_coursesC").hide();
		$("#adv_coursesC").hide();
	} else if (tabId == 'ap_courses') {
		$("#ft_coursesC").hide();
		$("#ap_coursesC").show();
		$("#cs_coursesC").hide();
		$("#cte_coursesC").hide();
		$("#hon_coursesC").hide();
		$("#adv_coursesC").hide();
	} else if (tabId == 'cs_courses') {
		$("#ft_coursesC").hide();
		$("#ap_coursesC").hide();
		$("#cs_coursesC").show();
		$("#cte_coursesC").hide();
		$("#hon_coursesC").hide();
		$("#adv_coursesC").hide();
	} else if (tabId == 'cte_courses') {
		$("#ft_coursesC").hide();
		$("#ap_coursesC").hide();
		$("#cs_coursesC").hide();
		$("#cte_coursesC").show();
		$("#hon_coursesC").hide();
		$("#adv_coursesC").hide();
	} else if (tabId == 'hon_courses') {
		$("#ft_coursesC").hide();
		$("#ap_coursesC").hide();
		$("#cs_coursesC").hide();
		$("#cte_coursesC").hide();
		$("#hon_coursesC").show();
		$("#adv_coursesC").hide();
	} else if (tabId == 'adv_courses') {
		$("#ft_coursesC").hide();
		$("#ap_coursesC").hide();
		$("#cs_coursesC").hide();
		$("#cte_coursesC").hide();
		$("#hon_coursesC").hide();
		$("#adv_coursesC").show();
	}
	//$('.accordion li:first-child .a-content').show();
	activeTabList(liId);
	
	//	$('#'+tabId).parent().parent().next().find('#'+tabId+'C').find('#'+liId).siblings().find(".a-content").slideUp()
	//	$('#'+tabId).parent().parent().next().find('#'+tabId+'C').find('#'+liId+' .a-content').show()
}

function validateRequestForPaymentOption(formId) {
	return true;
}


function choosePaymentOption() {
	var flag=true;
	if(SHOW_PAYMENT_OPTION=='Y'){
		if ($("#pay-one").prop("checked") == true || $("#pay-three").prop("checked") == true || $("#pay-registration").prop("checked") == true || $("#pay-custom").prop("checked") == true) {
			hideModalMessage('');
		} else {
			showMessageTheme2(0, 'Please choose payment mode');
			flag=false;
		}
	}
	setActiveStep(4);
	showSkeleton(true, "step4");
	if(flag){
		$.ajax({
			type: "POST",
			contentType: APPLICATION_JSON_VALUE,
			url: BASE_URL + CONTEXT_PATH + SCHOOL_UUID +'/student/enrollment/choose-payment-plan',
			data: JSON.stringify(getRequestForChoosePaymentOption()),
			dataType: 'json',
			global: false,
			success: function (data) {
				if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
					if (data['status'] == '3') {
						redirectLoginPage();
					} else if(data['statusCode'] == "FLAGGED"){
						$("#flaggedModal").remove();
						$("body").append(flaggedModalContent(data));
						$("#flaggedModal").modal("show");
						// $(".step-3-skeleton").hide();
						// $("#signupStage3").hide();
						// $("#signupStage2").show();
						// setActiveStep(2);
						// $(".prev-btn, .next-btn").removeClass("disabled");
					} else {
						if (data['statusCode'] == 'ELIGIBLE_CUSTOME_PLAN' || data['statusCode'] == 'REDIRECT_TO_DASHBOOARD') {
							window.location.reload();
						} else {
							showMessageTheme2(false, data['message']);
							//setActiveStep(3);
						}
					}
				} else {
					if(SHOW_PAYMENT_OPTION=='Y'){
						$("#studentPaymentModal").modal("hide");
					}
					setActiveStep(4);
					callForReviewAndPaymentSelection('Y');
					var windowWidth = $(window).width();
					
					if(SHOW_PAYMENT_OPTION=='Y'){
						if(windowWidth >580){
							showMessageTheme2(1, ' Superb! Just one step left. (✓)', '', true);
						}else{
							$("#showMessageInPopup #msgText").text('Superb! Just one step left');
							$("#showMessageInPopup").modal("show");
							setTimeout(function(){
								$("#showMessageInPopup").modal("hide");
							},3000);
						}
						hideModalMessage();
					}else{
						if(windowWidth >580){
							showMessageTheme2(1, ' Superb! Just one step left. (✓)', '', true);
						}else{
							$("#showMessageInPopup #msgText").text('Superb! Just one step left');
							$("#showMessageInPopup").modal("show");
							setTimeout(function(){
								$("#showMessageInPopup").modal("hide");
							},3000);
						}
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
}

function getRequestForChoosePaymentOption() {
	var feePaymentPlanDTO = {};
	feePaymentPlanDTO['userId'] = $("#userId").val();
	feePaymentPlanDTO['paymentMode'] = $("#payMode").val();
	return feePaymentPlanDTO;
}

function displayScholorshipDetails(radioId) {
	var payMode = 'annually';
	if (radioId == 'dtl-one') {
		payMode = 'annually';
		$('#annual-course-fee-details').show()
		$('.installment3-course-fee-details').hide()
		$('#installment5-course-fee-details').hide()
		$('#installment6-course-fee-details').hide()
		$('#installment9-course-fee-details').hide()
		$('#installment10-course-fee-details').hide()
		$('#installment12-course-fee-details').hide()
		$('#book-seat-fee-details, #BookEnrollmentSeat').hide()
	} else if (radioId == 'dtl-two') {
		payMode = 'twoMonthly';
		$('#annual-course-fee-details').hide()
		$('.installment3-course-fee-details').show()
		$('#installment5-course-fee-details').hide()
		$('#installment6-course-fee-details').hide()
		$('#installment9-course-fee-details').hide()
		$('#installment10-course-fee-details').hide()
		$('#installment12-course-fee-details').hide()
		$('#book-seat-fee-details, #BookEnrollmentSeat').hide()
		$('#custom-course-fee-details').hide()
	} else if (radioId == 'dtl-three') {
		payMode = 'threeMonthly';
		$('#annual-course-fee-details').hide()
		$('.installment3-course-fee-details').show()
		$('#installment5-course-fee-details').hide()
		$('#installment6-course-fee-details').hide()
		$('#installment9-course-fee-details').hide()
		$('#installment10-course-fee-details').hide()
		$('#installment12-course-fee-details').hide()
		$('#book-seat-fee-details, #BookEnrollmentSeat').hide()
		$('#custom-course-fee-details').hide()
	} else if (radioId == 'dtl-five') {
		payMode = 'fiveMonthly';
		$('#annual-course-fee-details').hide()
		$('.installment3-course-fee-details').hide()
		$('#installment5-course-fee-details').show()
		$('#installment6-course-fee-details').hide()
		$('#installment9-course-fee-details').hide()
		$('#installment10-course-fee-details').hide()
		$('#installment12-course-fee-details').hide()
		$('#book-seat-fee-details, #BookEnrollmentSeat').hide()
		$('#custom-course-fee-details').hide()
	} else if (radioId == 'dtl-six') {
		payMode = 'sixMonthly';
		$('#annual-course-fee-details').hide()
		$('.installment3-course-fee-details').show()
		$('#installment5-course-fee-details').hide()
		$('#installment6-course-fee-details').hide()
		$('#installment9-course-fee-details').hide()
		$('#installment10-course-fee-details').hide()
		$('#installment12-course-fee-details').hide()
		$('#book-seat-fee-details, #BookEnrollmentSeat').hide()
		$('#custom-course-fee-details').hide()
	} else if (radioId == 'dtl-nine') {
		payMode = 'nineMonthlly';
		$('#annual-course-fee-details').hide()
		$('.installment3-course-fee-details').hide()
		$('#installment5-course-fee-details').hide()
		$('#installment6-course-fee-details').hide()
		$('#installment9-course-fee-details').show()
		$('#installment10-course-fee-details').hide()
		$('#installment12-course-fee-details').hide()
		$('#book-seat-fee-details, #BookEnrollmentSeat').hide()
		$('#custom-course-fee-details').hide()
	} else if (radioId == 'dtl-ten') {
		payMode = 'tenMonthly';
		$('#annual-course-fee-details').hide()
		$('.installment3-course-fee-details').hide()
		$('#installment5-course-fee-details').hide()
		$('#installment6-course-fee-details').hide()
		$('#installment9-course-fee-details').hide()
		$('#installment10-course-fee-details').show()
		$('#installment12-course-fee-details').hide()
		$('#custom-course-fee-details').hide()
		$('#book-seat-fee-details, #BookEnrollmentSeat').hide()
	} else if (radioId == 'dtl-custom') {
		payMode = 'c_annually';
		$('#annual-course-fee-details').hide()
		$('.installment3-course-fee-details').hide()
		$('#installment5-course-fee-details').hide()
		$('#installment6-course-fee-details').hide()
		$('#installment9-course-fee-details').hide()
		$('#installment12-course-fee-details').hide()
		$('#book-seat-fee-details, #BookEnrollmentSeat').hide()
		$('#custom-course-fee-details').show()
	} else if (radioId == 'dtl-registration') {
		payMode = 'registration';
		$('#annual-course-fee-details').hide()
		$('.installment3-course-fee-details').hide()
		$('#installment5-course-fee-details').hide()
		$('#installment6-course-fee-details').hide()
		$('#installment9-course-fee-details').hide()
		$('#installment12-course-fee-details').hide()
		$('#custom-course-fee-details').hide()
		$('#book-seat-fee-details, #BookEnrollmentSeat').show()
	}
	$('#payMode').val(payMode);
	$('#payMode').attr('data-paymode', payMode);
}

function callForProgressionToDashboard() {
	var flag = false;
	hideModalMessage('');
	$.ajax({
		type: "POST",
		contentType: APPLICATION_JSON_VALUE,
		url: BASE_URL + CONTEXT_PATH + SCHOOL_UUID +'/student/proceed-to-dashboard',
		data: JSON.stringify(getRequestForProgressionToDashboard()),
		dataType: 'json',
		async: false,
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if (data['status'] == '3') {
					redirectLoginPage();
				} else {
					if($('#signupType').val() == 'Online' ){
						if (reloadRequired) {
							if (data['statusCode'] == 'ELIGIBLE_ADVANCE_PLAN') {
	
							} else if (data['statusCode'] == 'ELIGIBLE_CUSTOME_PLAN' || data['statusCode'] == 'REDIRECT_TO_DASHBOOARD') {
								window.location.reload();
							} else {
								showMessageTheme2(false, data['message']);
							}
						}

					}else{
						applicationSubmittedModalOffline();
					}
				}
			} else {
				if($('#signupType').val() == 'Online' ){
					goAhead(data.redirectUrl, '');
				}else{
					if($('#userId').val()==USER_ID){
						applicationSubmittedModalOffline();
					}else{
						$('#submitApplicationWarning').modal("hide");
						showMessageTheme2(true, 'Student has been successfully enrolled');
						window.setTimeout(function(){
							if(schoolSettingsOffice.schoolType == "WLP"){
								backToDedicatedModule('partner-enrollment-students-wlp');
							}else{
								backToDedicatedModule('partner-enrollment-list');
							}
						},1000);
					}
				}
			}
		}
	});
	return flag;
}

function getRequestForProgressionToDashboard() {
	var proceedToDashboardRequest = {};
	proceedToDashboardRequest['userId'] = $('#userId').val();
	return proceedToDashboardRequest;
}

function proceedToChangeGrade() {
	$('#changeSelectedGrade').modal('hide')
	displaySection(1);
}

function cancelToChangeGrade() {
	$('#changeSelectedGrade').modal('hide')
}

function changeSelectedGrade() {
	$('#changeSelectedGrade').modal("show");
}

function radioBtnChecked() {
	var $radios = $('.payment-item input:radio[name=payModeCheckboxes]:checked');
	$($radios).parent().find("label").addClass("primary-bg");
	$($radios).parent().siblings().find("label").removeClass("primary-bg");
}

$(window).on("load", function () {
	radioBtnChecked()
});

function upgradeCourse(categoryId, fromCourseId, toCourseId, warningMessage) {
	$("#upgradeCoruses #upgradeCorusesMessage").html(warningMessage)
	var changeCourseYesFunction = 'confirmUpgradeCourse(' + categoryId + ',' + fromCourseId + ',' + toCourseId + ')';
	$('#changeCourseYes').attr('onclick', changeCourseYesFunction);
	var changeCourseNoFunction = '$("#upgradeCoruses").modal("hide")';
	$('#changeCourseNo').attr('onclick', changeCourseNoFunction);
	if(SHOW_PAYMENT_OPTION=='Y'){
		$("#upgradeCoruses").modal("show");
	}else{
		$('#changeCourseYes').trigger('click');
	}
}

function confirmUpgradeCourse(categoryId, fromCourseId, toCourseId) {
	var selectedSubjects = $('#selectedSubjects').val().trim();
	selectedSubjects = selectedSubjects.split(',');
	selectedSubjects = selectedSubjects.filter(subId => parseInt(subId) != parseInt(fromCourseId));
	selectedSubjects.push(toCourseId);
	selectedSubjects = selectedSubjects.join(',');
	$('#selectedSubjects').val(selectedSubjects);
	$("#upgradeCoruses").modal("hide");
	if ($(".modal-backdrop").length > 0) {
		$(".modal-backdrop").remove();
		$("body").removeClass('modal-open');
		$("body").css({ "padding-right": "0" })
	}
	$("#controlType").val('add');
	getAllCourseDetails('N', categoryId);
}

function removeSlideAnimationClass() {
	$(".selected-course-list .course-category .course-item:last-child").removeClass("slide-animation");
}

$(function () {
	$('[data-toggle="tooltip"]').tooltip()
});

$("#pay-registration").unbind("click").bind("click", (function () {
	$('#signupStage3 #payMode').val('registration');
	$("#dtl-registration").show(350);
	$("#dtl-one, #dtl-three, #dtl-five, #dtl-six, #dtl-nine").hide(350);
}));

function validateRequestForPaymentModeSelection(formId, callForm) {
	if (($('#signupStage3 #standardId').val() >= 11 && $('#signupStage3 #standardId').val() <= 17) || $('#signupStage3 #standardId').val() == 8) {
		return true;
	}
	var MIN_LIMIT = $('#signupStage3 #standardId').attr('min_limit');
	var MAX_LIMIT = $('#signupStage3 #standardId').attr('max_limit');
	var upper_band=$('#signupStage3 #standardId').attr('upper_band');
	var totalCredit = parseFloat($('#totalCredit').attr('totalCredit'));
	if (parseFloat(totalCredit) < parseFloat(MIN_LIMIT)) {
		showMessageTheme2(0, 'Please select a minimum of ' + MIN_LIMIT + ' credits.');
		return false;
	} else if (parseFloat(totalCredit) > parseFloat(upper_band)) {
		showMessageTheme2(0, 'You can select a maximum of ' + upper_band + ' credits.');
		return false;
	}
	return true;
}

function getRequestForPaymentModeSelection(formId, courseId) {
	var studentCourseDetailsInfoDTO = {};
	studentCourseDetailsInfoDTO['userId'] = $('#userId').val();
	studentCourseDetailsInfoDTO['courseId'] = courseId;
	studentCourseDetailsInfoDTO['callFrom'] = 'signup';
	if ($("#signupStage3 #standardId").length > 0) {
		studentCourseDetailsInfoDTO['standardId'] = $("#signupStage3 #standardId").val();
	}
	if ($("#selectedSubjects").length > 0) {
		studentCourseDetailsInfoDTO['selectedSubjects'] = $("#selectedSubjects").val();
	} else {
		studentCourseDetailsInfoDTO['selectedSubjects'] = '';
	}
	studentCourseDetailsInfoDTO['controlType'] = $("#controlType").val();
	return studentCourseDetailsInfoDTO;
}

function callForPaymentModeSelection(formId, callFrom) {
	hideMessage('');
	if (!validateRequestForPaymentModeSelection(formId, callFrom)) {
		return false;
	}
	$.ajax({
		type: "POST",
		contentType: APPLICATION_JSON_VALUE,
		url: BASE_URL + CONTEXT_PATH + SCHOOL_UUID +'/student/enrollment/get-payment-details',
		data: JSON.stringify(getRequestForPaymentModeSelection(formId, callFrom)),
		dataType: 'json',
		async: true,
		global: false,
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if (data['status'] == '3') {
					redirectLoginPage();
				}else if(data['statusCode'] == "FLAGGED"){
					$("#flaggedModal").remove();
					$("body").append(flaggedModalContent(data));
					$("#flaggedModal").modal("show");
					// $(".step-3-skeleton").hide();
					// $("#signupStage3").hide();
					// $("#signupStage2").show();
					// setActiveStep(2);
					// $(".prev-btn, .next-btn").removeClass("disabled");
				} else {
					if (data['statusCode'] == 'ELIGIBLE_CUSTOME_PLAN' || data['statusCode'] == 'REDIRECT_TO_DASHBOOARD') {
						window.location.reload();
					} else {
						showMessageTheme2(false, data['message']);
						window.setTimeout(function () {
							$('#studentPaymentModal').modal('hide');
						}, 1000);
					}
				}
			} else {
				renderPaymentMode();
				showSkeleton(true, "fee-details-modal");
				paymentModalContentWithData(data);
				$(".step-feeDetails-skeleton").hide();
				$(".feeDetailsContentDiv").show();
				$('#payMode').val(data.paymentMode);
				$(".radio-payment-option input:radio[name=payModeCheckboxes]").unbind().bind("change", function () {
					radioBtnChecked();
				});
				selectPaymentmentMethod(true);
			}
		},
		error: function(e){
			if (checkonlineOfflineStatus()) {
				return;
			}
		}
	});
}

function selectPaymentmentMethod(isBack) {

	if ($('#payMode').val() == '') {
		$('#payMode').val('annually');
	}
	if ($('#payMode').val().trim() == 'annually') {
		$("#pay-one").trigger('click');
		displayScholorshipDetails('dtl-one');
		if (isBack) {
			var extraCourseLength = $("#annually_extra .extra-course-ol li").length;
			for (var i = 1; i <= extraCourseLength; i++) {
				$("#annually_extra_price .extra-course-price-ul li:nth-child(" + i + ")").css({ "justify-content": "flex-end", "display": "flex", "align-items": "flex-end" })
			}
			var extraCourseLength = $("#annually_external .external-course-ol li").length;
			for (var j = 1; j <= extraCourseLength; j++) {
				$("#annually_external_price .external-course-price-ul li:nth-child(" + j + ")").css({ "justify-content": "flex-end", "height": $("#annually_external .external-course-ol li:nth-child(" + j + ")").css("height"), "display": "flex", "align-items": "flex-end" })
			}
		}
	} else if ($('#payMode').val().trim() == 'twoMonthly') {
		$("#pay-three").trigger('click');
		displayScholorshipDetails('dtl-two');
	} else if ($('#payMode').val().trim() == 'twoMonthly' || $('#payMode').val().trim() == 'threeMonthly' || $('#payMode').val() == 'sixMonthly') {
		$("#pay-three").trigger('click');
		displayScholorshipDetails('dtl-three');
	} else if ($('#payMode').val() == 'c_installment' || $('#payMode').val() == 'c_annually') {
		$("#pay-custom").trigger('click');
		displayScholorshipDetails('dtl-custom');
	} else if ($('#payMode').val().trim() == 'registration') {
		$("#pay-registration").trigger('click');
		displayScholorshipDetails('dtl-registration');
	}
	//$('#studentPaymentModal').modal('show');
}

function getRequestForReviewAndPaymentSelection(reloadRequired) {
	var studentRequestDTO = {};
	studentRequestDTO['userId'] = $('#userId').val();
	studentRequestDTO['reloadRequired'] = reloadRequired;
	return studentRequestDTO;
}

function callForReviewAndPaymentSelection(reloadRequired) {
	hideMessage('');
	$('#studentPaymentModal').modal('hide');
	showSkeleton(true, "step4");
	$(".prev-btn, .next-btn, .finish-btn").addClass("disabled");
	$.ajax({
		type: "POST",
		contentType: APPLICATION_JSON_VALUE,
		url: BASE_URL + CONTEXT_PATH + SCHOOL_UUID +'/student/enrollment/get-student-review-details',
		data: JSON.stringify(getRequestForReviewAndPaymentSelection(reloadRequired)),
		dataType: 'json',
		async: true,
		global: false,
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if (data['status'] == '3') {
					redirectLoginPage();
				} else {
					if (reloadRequired) {
						if (data['statusCode'] == 'ELIGIBLE_CUSTOME_PLAN' || data['statusCode'] == 'REDIRECT_TO_DASHBOOARD') {
							window.location.reload();
						} else {
							showMessageTheme2(false, data['message']);
							setActiveStep(3);
							$("#studentPaymentModal").modal("show");
						}
					}
				}
			} else {
				$(".step-4-skeleton").html('');
				$(".step-4-skeleton").hide('');
				$("#signupStage4Content").show();
				getReviewAndPayRendered(data);
			}
			$(".prev-btn, .next-btn, .finish-btn").removeClass("disabled");
		},
		error: function(e){
			if (checkonlineOfflineStatus()) {
				return;
			}
		}
	});
}

function getSignupStatus() {
	if (!signupStageStatusInitiated) {
		if(ENVIRONMENT!='dev'){
			window.setInterval(function () { getSignupStatusFinal() }, 180000);
		}
	}
}
function getSignupStatusFinal() {
	try {
		$.ajax({
			type: "GET",
			contentType: APPLICATION_JSON_VALUE,
			url: BASE_URL + CONTEXT_PATH + SCHOOL_UUID +'/student/enrollment-stage-status?uniqueId=' + UNIQUEUUID,
			dataType: 'json',
			global: false,
			success: function (data) {
				if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
					if (data['status'] == '3') {
						redirectLoginPage();
						return true;
					}
				} else {
					window.location.replace(data['redirectUri']);
					return true;
				}
				return false;
			},
			error : function(e) {
				if (checkonlineOfflineStatus()) {
					return;
				}
				console.log("Error while calling API : " + JSON.stringify(e));
			}
		});
	} catch (error) {
		console.log("exception while calling API : " + JSON.stringify(error));
	}
}

function addRecommendedCourse(src){
	var allChecked = true;
	var $src = $(src);
	var $btn = $src.parent();
	var isAlreadySelected = $src.hasClass('add-recommended-course-already-selected');
	var isNew = $src.hasClass('add-recommended-course-not-mandatory');

	if($src.prop("checked")){
		$btn.find("span").html('<span>Remove&nbsp;<i class="fa fa-trash"></i></span>');
		$btn.addClass("btn-danger").removeClass("primary-bg");
		$src.attr("data-checked", "true");
	} else {
		if (isAlreadySelected) {
			$src.removeAttr("data-checked");
			$btn.find("span").html('<span><i class="fa fa-plus"></i>&nbsp;Add Back</span>');
		} else {
			$btn.find("span").html('<span><i class="fa fa-plus"></i>&nbsp;Add</span>');
		}
		$btn.removeClass("btn-danger").addClass("primary-bg");
		$src.removeAttr("data-checked");
	}

	$('.add-recommended-course-not-mandatory, .add-recommended-course-already-selected').each(function () {
		if (!$(this).prop('checked')) {
			allChecked = false;
		}
	});

	if(allChecked){
		$("#addAllRecommendedCourse").hide();
		$("#reomveAllRecommendedCourse").show();
	}else{
		$("#reomveAllRecommendedCourse").hide();
		$("#addAllRecommendedCourse").show();
	}
	updateConfirmButtonState();
}

// function addAllRecommendedCourse(){
// 	$("#addAllRecommendedCourse").hide();
// 	$("#reomveAllRecommendedCourse").show();
// 	$('.add-recommended-course-not-mandatory').prop('checked', true);
// 	$(".add-recommended-course-not-mandatory").parent().find("span").html('<span>Remove&nbsp;<i class="fa fa-trash"></i></span>');
// 	$(".add-recommended-course-not-mandatory").parent().addClass("btn-danger");
// 	$(".add-recommended-course-not-mandatory").parent().removeClass("primary-bg");
// 	$("#confirmAndAddRecommendedCourse").attr("disabled",false);
// 	$("#confirmAndAddRecommendedCourse").addClass("primary-bg");
// 	$("#confirmAndAddRecommendedCourse").removeClass("btn-light");
// }
// function reomveAllRecommendedCourse(){
// 	$("#reomveAllRecommendedCourse").hide();
// 	$("#addAllRecommendedCourse").show();
// 	$(".add-recommended-course-not-mandatory").prop('checked', false);
// 	$(".add-recommended-course-not-mandatory").parent().find("span").html('<span><i class="fa fa-plus"></i>&nbsp;Add</span>');
// 	$(".add-recommended-course-not-mandatory").parent().addClass("primary-bg");
// 	$(".add-recommended-course-not-mandatory").parent().removeClass("btn-danger");
// 	if($(".add-recommended-course-mandatory").length <1){
// 		$("#confirmAndAddRecommendedCourse").attr("disabled",true);
// 		$("#confirmAndAddRecommendedCourse").removeClass("primary-bg");
// 		$("#confirmAndAddRecommendedCourse").addClass("btn-light");
// 	}
// }

function addAllRecommendedCourse() {
	$("#addAllRecommendedCourse").hide();
	$("#reomveAllRecommendedCourse").show();

	$(".add-recommended-course-not-mandatory, .add-recommended-course-already-selected").each(function () {
		if (!$(this).prop('checked')) {
			$(this).prop('checked', true);
			$(this).parent().find("span").html('<span>Remove&nbsp;<i class="fa fa-trash"></i></span>');
			$(this).parent().addClass("btn-danger").removeClass("primary-bg");
		}
	});

	updateConfirmButtonState();
}

function reomveAllRecommendedCourse() {
	$("#reomveAllRecommendedCourse").hide();
	$("#addAllRecommendedCourse").show();

	$(".add-recommended-course-not-mandatory, .add-recommended-course-already-selected").each(function () {
		$(this).prop('checked', false);
		const $btn = $(this).parent();

		if ($(this).hasClass("add-recommended-course-already-selected")) {
			$btn.find("span").html('<span><i class="fa fa-plus"></i>&nbsp;Add Back</span>');
		} else {
			$btn.find("span").html('<span><i class="fa fa-plus"></i>&nbsp;Add</span>');
		}

		$btn.addClass("primary-bg").removeClass("btn-danger");
		$(this).removeAttr("data-checked");
	});

	updateConfirmButtonState(); // ✅ Important
}

function confirmAndAddRecommendedCourse(){
	var checkedItems = $('.add-recommended-course:checked');
	var checkedItemIds = checkedItems.map(function() {
	  return this.value;
	}).get();
	return checkedItemIds.join(",");
}

function recommendedCourse() {
	hideMessage('');
	// showSkeleton(true, "step4");
	$("#commonloaderId, #commonloaderBody").show();
	$.ajax({
		type: "POST",
		contentType: APPLICATION_JSON_VALUE,
		url: BASE_URL + CONTEXT_PATH + SCHOOL_UUID +'/student/recommended-courses',
		data: JSON.stringify(getRequestForReviewAndPaymentSelection('')),
		dataType: 'json',
		async: true,
		global: false,
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if (data['status'] == '3') {
					redirectLoginPage();
				} else {
					// if (reloadRequired) {
					// 	if (data['statusCode'] == 'ELIGIBLE_CUSTOME_PLAN' || data['statusCode'] == 'REDIRECT_TO_DASHBOOARD') {
					// 		window.location.reload();
					// 	} else {
					// 		showMessageTheme2(false, data['message']);
					// 	}
					// }
				}
			} else {
				// $(".step-4-skeleton").html('');
				renderCustomizedCourse(data)
			}
			$("#commonloaderId, #commonloaderBody").hide();
		},
		error: function(e){
			if (checkonlineOfflineStatus()) {
				return;
			}
		}
	});
}

function chooseRecomendedCourse() {
	var existingSubjects = ($("#selectedSubjects").val() || '').split(',').map(id => id.trim()).filter(id => id !== '');
	var newSubjects = confirmAndAddRecommendedCourse().split(',').map(id => id.trim()).filter(id => id !== '');
	var mergedSubjects = [...new Set([...existingSubjects, ...newSubjects])];
	$('#selectedSubjects').val(mergedSubjects.join(','));
	$('#selectedSubjects').val(confirmAndAddRecommendedCourse());
	$("#recommendedCourseModal").modal("hide");
	$("#controlType").val('add');
	getAllCourseDetails('N', '');
	apCourseSelectionFlag = false;
}

const getPathNameForUrl = (url) => {
	return url
	.replace("https://internationalschooling.org/course-catalog/", "")
	.replaceAll("/", "");
};

function openCourseDetailModal(courseDescriptionUrl, subjectName) {
    if (!$('#courseDetailModal').length) {
        $('body').append(`
          <div class="modal fade" id="courseDetailModal" tabindex="-1" aria-labelledby="courseDetailModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
              <div class="modal-content">
                <div class="modal-header" style="display: flex;width: 100%;justify-content: space-between;align-items: center;color: WHITE;background: #277fff;border-radius: 5px 5px 0px 0px;">
                  <h5 class="modal-title" id="courseDetailModalLabel"></h5>
                  <button onclick="closeCourseDetailModal()" type="button" class="btn-close" style="background: transparent;border: 0px;" data-bs-dismiss="modal" aria-label="Close"><i class="fa fa-times" style="color: #FFF;font-size: 16px;"></i></button>
                </div>
                <div class="modal-body">
                  <div id="courseDetailContent" class="p-3">
                    <p>Loading...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `);
    }

    const urlPath = getPathNameForUrl(courseDescriptionUrl);
    const requestBody = { url: urlPath };

    const modalElement = $('#courseDetailModal');
    const modalTitle = $('#courseDetailModalLabel');
    const modalContent = $('#courseDetailContent');

    modalTitle.text(subjectName);
    modalContent.html("<p>Loading...</p>");
    modalElement.modal('show');
    $.ajax({
        url: BASE_URL+CONTEXT_PATH+SCHOOL_UUID+"/dashboard/get-course-summary",
        method: "POST",
        contentType: APPLICATION_JSON_VALUE,
        data: JSON.stringify(requestBody),
        success: function (response) {
            const data = JSON.parse(response);
			const overview = data.data  || "No overview available.";
            modalContent.html(`
                <p>${overview}</p>
            `);
        }
    });
	return false;
}

function closeCourseDetailModal(){
	$("#courseDetailModal").modal('hide');
}

function updateStudentDocumentRequirements(data){
	if(!data){
		return;
	}
	var incomingStandardId = (data.standardId || (data.details && data.details.standardId) || $("#signupStage3 #standardId").val() || "").toString();
	var isStandardChanged = (STUDENT_DOCS_CURRENT_STANDARD_ID !== "" && (STUDENT_DOCS_CURRENT_STANDARD_ID !== incomingStandardId));
	if(isStandardChanged){
		STUDENT_DOCS_FLOW_DONE = false;
		STUDENT_DOCS_FILE_STORE = {};
		STUDENT_DOCS_PENDING_PAYLOAD = null;
		STUDENT_DOCS_STATUS_LOADED = false;
		STUDENT_DOCS_REQUIRED = "N";
		STUDENT_DOCS_MANDATORY = "N";
		STUDENT_DOCS_SUBMITTED = "N";
		STUDENT_DOCS_VERIFIED = "N";
		STUDENT_DOCS_ENROLLMENT_STATE = "";
		updateStudentDocumentStepActionButtons();
	}
	STUDENT_DOCS_CURRENT_STANDARD_ID = incomingStandardId;
}

async function loadStudentDocumentsStatus(showVerificationModal, courseDetailsSeq, force){
	if(!isStudentEnrollmentDocumentsEnabled()){
		STUDENT_DOCS_STATUS_LOADED = true;
		STUDENT_DOCS_REQUIRED = "N";
		STUDENT_DOCS_MANDATORY = "N";
		STUDENT_DOCS_SUBMITTED = "N";
		STUDENT_DOCS_VERIFIED = "N";
		STUDENT_DOCS_SUBMITTED_COUNT = 0;
		STUDENT_DOCS_VERIFIED_COUNT = 0;
		STUDENT_DOCS_IS_REUPLOAD_FLOW = false;
		STUDENT_DOCS_FLOW_DONE = true;
		STUDENT_DOCS_ENROLLMENT_STATE = "PAYMENT";
		toggleChangeGradeVisibility();
		updateStudentDocumentStepActionButtons();
		return;
	}
	if(courseDetailsSeq && courseDetailsSeq === STUDENT_DOCS_LAST_STATUS_SEQ && !force){
		return;
	}
	if(courseDetailsSeq){
		STUDENT_DOCS_LAST_STATUS_SEQ = courseDetailsSeq;
	}

	// single-flight: if request already running, wait for it and optionally show modal
	if(STUDENT_DOCS_STATUS_PROMISE){
		try{
			await STUDENT_DOCS_STATUS_PROMISE;
		}catch(e){}
		if(showVerificationModal && getStudentEnrollmentDocsState() === "UNDER_VERIFICATION"){
			openStudentDocsUnderVerificationModal();
		}
		return;
	}

	STUDENT_DOCS_STATUS_PROMISE = (async function(){
	var userId = ($("#userId").val() || USER_ID || "").toString();
	if(userId === ""){
		STUDENT_DOCS_STATUS_LOADED = true;
		return;
	}
	var encodedUserId = "";
	try{
		encodedUserId = btoa(userId);
	}catch(e){
		STUDENT_DOCS_STATUS_LOADED = true;
		return;
	}

	try{
		var ajaxReqDetails = {
			method: "GET",
			url: BASE_URL + CONTEXT_PATH + "/student/enrollment/get-documents-status?payload=" + encodeURIComponent(encodedUserId),
			global: false,
			showMessage: false
		};
		var data = await callCommonAjax(ajaxReqDetails);
		if(!data){
			STUDENT_DOCS_STATUS_LOADED = true;
			return;
		}

		STUDENT_DOCS_CURRENT_STANDARD_ID = (data.standardId || STUDENT_DOCS_CURRENT_STANDARD_ID || "").toString();
		STUDENT_DOCS_REQUIRED = (data.docsRequired || "N").toString().toUpperCase();
		STUDENT_DOCS_MANDATORY = (data.docsMandatory || "N").toString().toUpperCase();
		STUDENT_DOCS_SUBMITTED = (data.docsSubmitted || "N").toString().toUpperCase();
		STUDENT_DOCS_VERIFIED = (data.docsVerified || "N").toString().toUpperCase();
		syncStudentDocumentStatusMeta(data);
		applyStudentEnrollmentDocsState(data.enrollmentDocsState || "PAYMENT");
		var admissionStatus = (data.admissionStatus || "").toString().toLowerCase();
		if(admissionStatus === "enrollment confirm" || admissionStatus === "enrollment confirmed"){
			applyStudentEnrollmentDocsState("PAYMENT");
		}
		STUDENT_DOCS_STATUS_LOADED = true;
		toggleChangeGradeVisibility();
		if(showVerificationModal && getStudentEnrollmentDocsState() === "UNDER_VERIFICATION"){
			openStudentDocsUnderVerificationModal();
		}else if(getStudentEnrollmentDocsState() === "REUPLOAD"){
			tryAutoOpenStudentReuploadModal();
		}
	}catch(e){
		STUDENT_DOCS_STATUS_LOADED = true;
	}
	})();

	try{
		await STUDENT_DOCS_STATUS_PROMISE;
	}finally{
		STUDENT_DOCS_STATUS_PROMISE = null;
	}
}

function openStudentDocsUnderVerificationModal(){
	if($("#studentDocsUnderVerificationModal").length < 1){
		// Modal markup is appended dynamically; retry a few times.
		if(STUDENT_DOCS_VERIFICATION_MODAL_RETRY < 12){
			STUDENT_DOCS_VERIFICATION_MODAL_RETRY++;
			window.setTimeout(function(){
				openStudentDocsUnderVerificationModal();
			}, 250);
		}
		return;
	}
	STUDENT_DOCS_VERIFICATION_MODAL_RETRY = 0;
	$("#studentDocsUnderVerificationModal").modal({backdrop: "static", keyboard: false});
}

function getFileExtFromUrl(url){
	try{
		var clean = (url || "").split("?")[0];
		return clean.split(".").pop().toLowerCase();
	}catch(e){
		return "pdf";
	}
}

async function getStudentUploadedDocumentsResponse(){
	var userId = (USER_ID || $("#userId").val() || "").toString();
	if(userId === ""){
		return null;
	}
	var encodedUserId = "";
	try{ encodedUserId = btoa(userId); }catch(e){ return null; }
	var url = BASE_URL + CONTEXT_PATH + "/student/enrollment/get-documents?payload=" + encodeURIComponent(encodedUserId);
	try{
		var ajaxReqDetails = {
			method: "GET",
			url: url,
			global: false,
			showMessage: false
		};
		return await callCommonAjax(ajaxReqDetails);
	}catch(e){
		return null;
	}
}

function getStudentUnverifiedDocumentMapFromResponse(documentsResponse){
	return getStudentDocumentBuckets(documentsResponse || {}).unverifiedMap || {};
}

async function bindStudentEnrollmentDocumentsToUnderVerification(){
		var container = $("#studentUploadedDocsTableBlock");
		if(container.length < 1){
			container = $("#studentDocsVerificationData");
		}
		if(container.length < 1){
			return;
		}
		container.addClass("d-none").html("");
		var data = await getStudentUploadedDocumentsResponse();
		if(!data){
			return;
		}

		var documentBuckets = getStudentDocumentBuckets(data);
		var docs = documentBuckets.academicDocs || [];
		var personal = documentBuckets.personalDocs || [];
		populateStudentDocumentReuploadData(data);

		if(personal.length < 1 && docs.length < 1){
			return;
		}

		let html = `
			<div class="card" style="border:1px solid #e6ebf2;border-radius:10px;">
				<div class="card-body" style="padding:12px 12px 10px;">
					<div style="font-weight:600;color:#2d3648;font-size:14px;">Previously Submitted Documents</div>
					<div class="text-muted" style="font-size:12px;margin-top:2px;">You can view your uploaded documents here.</div>
				</div>
			</div>
		`;

		if(personal.length > 0 || docs.length > 0){
			html += `
				<div class="table-responsive" style="border:1px solid #e6ebf2;border-radius:10px; overflow-x:auto; overflow-y:hidden; -webkit-overflow-scrolling:touch; width:100%; display:block;">
					<table class="table table-sm mb-0" style="min-width:760px; width:100%;">
						<thead class="thead-light">
							<tr>
								<th style="min-width:120px;">Type</th>
								<th style="min-width:160px;">Document</th>
								<th style="min-width:190px;">Name</th>
								<th style="min-width:90px;">Year</th>
								<th style="min-width:90px;">Verified</th>
								<th style="min-width:90px;"></th>
							</tr>
						</thead>
						<tbody>
			`;
			$.each(personal, function(i,item){
				var ext = getFileExtFromUrl(item.url);
				var verified = (item.isDocumentVerified || "N").toString().toUpperCase();
				html += `
					<tr style="${verified === "N" ? 'background:#fff5f5;' : ''}">
						<td>Personal</td>
						<td>${item.label || ""}</td>
						<td>${item.name || "-"}</td>
						<td>-</td>
						<td>${verified === "Y" ? '<span class="text-success">Yes</span>' : '<span class="text-danger font-weight-bold">No - Re-upload</span>'}</td>
						<td>
							${item.url ? `<button type="button" class="btn btn-primary btn-sm"
								data-file-extension="${ext}"
								data-attachment-url="${item.url}"
								onclick="viewAttachmentInModal(this, 'studentDocPreviewModal')">View</button>` : ""}
						</td>
					</tr>
				`;
			});
			$.each(docs, function(i,d){
				var fileUrl = d.fileUrl || "";
				var ext = getFileExtFromUrl(fileUrl);
				var verified = (d.isDocumentVerified || "N").toString().toUpperCase();
				html += `
					<tr style="${verified === "N" ? 'background:#fff5f5;' : ''}">
						<td>${d.standardName || ""}</td>
						<td>${d.documentName || ""}</td>
						<td>${d.fileName || d.documentOriginalName || d.uploadFileName || "-"}</td>
						<td>${d.passingYear || ""}</td>
						<td>${verified === "Y" ? '<span class="text-success">Yes</span>' : '<span class="text-danger font-weight-bold">No - Re-upload</span>'}</td>
						<td>
							${fileUrl ? `<button type="button" class="btn btn-primary btn-sm"
								data-file-extension="${ext}"
								data-attachment-url="${fileUrl}"
								onclick="viewAttachmentInModal(this, 'studentDocPreviewModal')">View</button>` : ""}
						</td>
					</tr>
				`;
			});
			html += `
						</tbody>
					</table>
				</div>
			`;
		}

		container.removeClass("d-none").html(html);
}

$(document).on("shown.bs.modal", "#studentDocumentUploadModal", function(){
	if(typeof bindStudentEnrollmentDocumentsToUnderVerification === "function"){
		bindStudentEnrollmentDocumentsToUnderVerification();
	}
});

$(document).on("show.bs.collapse", "#studentAcademicDocsContainer .collapse", function(){
	$(this).closest(".student-academic-doc-item").find(".fa-angle-down:first").removeClass("fa-angle-down").addClass("fa-angle-up");
});

$(document).on("hide.bs.collapse", "#studentAcademicDocsContainer .collapse", function(){
	$(this).closest(".student-academic-doc-item").find(".fa-angle-up:first").removeClass("fa-angle-up").addClass("fa-angle-down");
});

$(document).on("hidden.bs.modal", "#studentDocumentUploadModal", function(){
	resetStudentDocumentsModalTransientState();
});

	$(document).on("hidden.bs.modal", "#studentDocPreviewModal", function(){
		if(STUDENT_DOCS_PREVIEW_BLOB_URL && STUDENT_DOCS_PREVIEW_BLOB_URL.indexOf("blob:") === 0){
			try{ URL.revokeObjectURL(STUDENT_DOCS_PREVIEW_BLOB_URL); }catch(e){}
		}
		STUDENT_DOCS_PREVIEW_BLOB_URL = "";
		$("#studentDocPreviewModal .upload_img img").attr("src", "");
		$("#studentDocPreviewModal .upload_pdf .pre_upload_pdf").remove();
	});

async function handleCourseSelectionStepThreeProceed(){
	if(!IS_DOCUMENT_SKIP){
		// if(!STUDENT_DOCS_STATUS_LOADED){
			await loadStudentDocumentsStatus(false, null, false);
		// }
		if(getStudentEnrollmentDocsState() === "UNDER_VERIFICATION"){
			openStudentDocsUnderVerificationModal();
			return false;
		}
		if(getStudentEnrollmentDocsState() === "UPLOAD" || getStudentEnrollmentDocsState() === "REUPLOAD"){
			openStudentDocumentsModal();
			return false;
		}
	}
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
	}
	return false;
}

function getStudentDocGradeByOrder(orderBy){
	return SCHOOL_STANDARD_GRADE_MASTER.find(function(grade){
		return parseInt(grade.orderBy) === parseInt(orderBy);
	});
}

function isFlexyAcademicDocumentFlow(standardId){
	var grade = SCHOOL_STANDARD_GRADE_MASTER.find(function(item){
		return item.key.toString() === (standardId || "").toString();
	});
	if(!grade){
		return false;
	}
	var orderBy = parseInt(grade.orderBy, 10) || 0;
	return orderBy >= 14 && orderBy <= 18;
}

function getRequiredAcademicDocumentGrades(standardId){
	var grade = SCHOOL_STANDARD_GRADE_MASTER.find(function(item){
		return item.key.toString() === standardId.toString();
	});
	if(!grade){
		return [];
	}
	var orderBy = parseInt(grade.orderBy);
	if(orderBy <= 1){
		return [];
	}
	if(orderBy >= 2 && orderBy <= 11){
		var prev = getStudentDocGradeByOrder(orderBy - 1);
		return prev ? [prev] : [];
	}
	if(orderBy === 12){
		return [getStudentDocGradeByOrder(10), getStudentDocGradeByOrder(11)].filter(Boolean);
	}
	if(orderBy === 13){
		return [getStudentDocGradeByOrder(10), getStudentDocGradeByOrder(11), getStudentDocGradeByOrder(12)].filter(Boolean);
	}
	if(orderBy >= 14 && orderBy <= 18){
		var previousFlexyGrade = getStudentDocGradeByOrder(orderBy - 1);
		return previousFlexyGrade ? [previousFlexyGrade] : [];
	}
	return [];
}

function getAcademicDocRowHtml(gradeInfo, index){
	var rowKey = "acad_" + gradeInfo.key;
	var titleHtml = 'Academic Document ' + index;
	if(!isFlexyAcademicDocumentFlow(STUDENT_DOCS_CURRENT_STANDARD_ID)){
		titleHtml += ' <small class="text-muted">(' + gradeInfo.value + ')</small>';
	}
	var collapseId = "studentAcademicCollapse_" + rowKey;
	var headingId = "studentAcademicHeading_" + rowKey;
	return ''
	+'<div class="student-academic-doc-item border mb-3" style="border-color:#dce8f8 !important; border-radius:12px; background:linear-gradient(180deg,#ffffff 0%,#fbfdff 100%);">'
		+'<div class="student-academic-doc-head px-3 py-3 d-flex align-items-center justify-content-between" id="'+headingId+'" role="button" data-toggle="collapse" data-target="#'+collapseId+'" aria-expanded="'+(index === 1 ? 'true' : 'false')+'" aria-controls="'+collapseId+'">'
			+'<h5 class="student-academic-doc-title mb-0" style="font-size:16px; color:#132238; font-weight:700;">'+titleHtml+'</h5>'
			+'<i class="fa fa-angle-down text-primary"></i>'
		+'</div>'
		+'<div id="'+collapseId+'" class="collapse '+(index === 1 ? 'show' : '')+'" data-parent="#studentAcademicDocsContainer">'
			+'<div class="student-academic-doc-body px-3 pb-3">'
			+'<div class="row">'
				+'<div class="col-xl-4 col-lg-6 col-md-12 mb-3">'
					+'<label class="mb-1">Document Name <span class="text-danger">*</span></label>'
					+'<input type="text" class="form-control" id="studentDocName_'+rowKey+'" placeholder="Enter document name" onkeyup="syncStudentDocSuggestionState(\''+rowKey+'\')" />'
					+'<div class="mt-2" id="studentDocSuggestion_'+rowKey+'">'
						+'<span class="student-doc-suggestion">#suggestion</span>'
						+'<span class="student-doc-chip active" data-value="Degree" onclick="applyStudentDocSuggestion(\''+rowKey+'\', \'Degree\')">Degree</span>'
						+'<span class="student-doc-chip" data-value="Marksheet" onclick="applyStudentDocSuggestion(\''+rowKey+'\', \'Marksheet\')">Marksheet</span>'
					+'</div>'
				+'</div>'
				+'<div class="col-xl-4 col-lg-6 col-md-12 mb-3">'
					+'<label class="mb-1">School Name <span class="text-danger">*</span></label>'
					+'<input type="text" class="form-control" id="studentSchoolName_'+rowKey+'" placeholder="Enter school name" />'
				+'</div>'
				+'<div class="col-xl-4 col-lg-6 col-md-12 mb-3">'
					+'<label class="mb-1">Board Name <span class="text-danger">*</span></label>'
					+'<input type="text" class="form-control" id="studentBoardName_'+rowKey+'" placeholder="Enter board name" />'
				+'</div>'
				+'<div class="col-xl-4 col-lg-6 col-md-12 mb-0">'
					+'<label class="mb-1">Passing Year <span class="text-danger">*</span></label>'
					+'<input type="text" class="form-control" maxlength="4" id="studentPassingYear_'+rowKey+'" placeholder="YYYY" onkeydown="return M.digit(event);" />'
				+'</div>'
				+'<div class="col-xl-8 col-lg-12 col-md-12 mb-0">'
					+'<label class="mb-1">Document Upload <span class="text-danger">*</span></label>'
					+'<div class="d-flex align-items-center">'
						+'<div class="upload-btn-wrapper flex-fill mr-1">'
							+'<input class="file-input" type="file" id="studentAcademicFile_'+rowKey+'" onchange="onStudentDocUploadChange(this, \''+rowKey+'\', \'studentAcademicView_'+rowKey+'\')" />'
							+'<span class="btn btn-light border w-100 text-left mt-0" style="font-size:12px; border-radius:10px;"><i class="fa fa-file-text-o mr-1 primary-txt-color"></i><span class="text-muted" id="studentAcademicFileName_'+rowKey+'">Upload your file</span></span>'
						+'</div>'
						+'<button type="button" class="btn btn-primary btn-sm ml-1 mt-0" id="studentAcademicView_'+rowKey+'" style="display:none;" onclick="viewStudentDocFile(\''+rowKey+'\', this)"><i class="fa fa-eye"></i></button>'
						+'<button type="button" class="btn btn-danger btn-sm ml-1 mt-0" id="studentAcademicRemove_'+rowKey+'" style="display:none;" onclick="removeStudentDocFile(\''+rowKey+'\')"><i class="fa fa-trash"></i></button>'
					+'</div>'
				+'</div>'
			+'</div>'
			+'</div>'
		+'</div>'
	+'</div>';
}

function applyStudentDocSuggestion(rowKey, value){
	$("#studentDocName_"+rowKey).val(value);
	$("#studentDocSuggestion_"+rowKey+" .student-doc-chip").removeClass("active");
	$("#studentDocSuggestion_"+rowKey+" .student-doc-chip[data-value='"+value+"']").addClass("active");
}

function syncStudentDocSuggestionState(rowKey){
	var currentValue = $.trim($("#studentDocName_"+rowKey).val()).toLowerCase();
	var suggestionContainer = $("#studentDocSuggestion_"+rowKey);
	suggestionContainer.find(".student-doc-chip").removeClass("active");
	if(currentValue === "degree"){
		suggestionContainer.find(".student-doc-chip[data-value='Degree']").addClass("active");
	}else if(currentValue === "marksheet"){
		suggestionContainer.find(".student-doc-chip[data-value='Marksheet']").addClass("active");
	}
}

function syncStudentDobUploadState(){
	var hasDobProofType = $.trim($("#studentDocDobProofType").val()) !== "";
	$("#studentDocDobFile").prop("disabled", !hasDobProofType);
	if(hasDobProofType){
		if(!STUDENT_DOCS_FILE_STORE.dob){
			$("#studentDocDobFileName").text("Upload your file");
		}
	}else{
		$("#studentDocDobFile").val("");
		delete STUDENT_DOCS_FILE_STORE.dob;
		$("#studentDocDobFileName").text("Select proof type first");
		$("#studentDocDobView, #studentDocDobRemove").hide();
	}
}

async function openStudentDocumentsModal(){
	var standardId = ($("#signupStage3 #standardId").val() || STUDENT_DOCS_CURRENT_STANDARD_ID || "").toString();
	STUDENT_DOCS_CURRENT_STANDARD_ID = standardId;
	STUDENT_DOCS_FILE_STORE = {};
	STUDENT_DOCS_PENDING_PAYLOAD = null;
	clearStudentDocumentHighlightStates();
	$("#studentDocDobProofType").val("");
	$("#studentDocPassportFileName").text("Passport Size Photo");
	$("#studentDocDobFileName").text("Select proof type first");
	$("#studentDocPassportView, #studentDocPassportRemove, #studentDocDobView, #studentDocDobRemove").hide();
	$("#studentDocPassportCameraBtn").show();
	setStudentPassportPreviewImage("");
	syncStudentDobUploadState();
	var requiredGrades = getRequiredAcademicDocumentGrades(standardId);
	var reuploadTargetMap = {};
	if(isStudentDocumentReuploadFlow()){
		var uploadedDocumentsResponse = await getStudentUploadedDocumentsResponse();
		if(uploadedDocumentsResponse){
			STUDENT_DOCS_SERVER_RESPONSE = uploadedDocumentsResponse;
			reuploadTargetMap = getStudentUnverifiedDocumentMapFromResponse(uploadedDocumentsResponse);
		}
	}
	var showPassportUpload = !isStudentDocumentReuploadFlow() || !!reuploadTargetMap.passport;
	var showDobUpload = !isStudentDocumentReuploadFlow() || !!reuploadTargetMap.dob;
	$("#studentDocPassportWrap").toggle(showPassportUpload);
	$("#studentDocDobWrap").toggle(showDobUpload);
	$("#studentPersonalDocsSection").toggle(showPassportUpload || showDobUpload);
	var html = '';
	var visibleGradeIndex = 0;
	$.each(requiredGrades, function(index, gradeInfo){
		var rowKey = "acad_" + gradeInfo.key;
		if(isStudentDocumentReuploadFlow() && !reuploadTargetMap[rowKey]){
			return;
		}
		visibleGradeIndex += 1;
		html += getAcademicDocRowHtml(gradeInfo, visibleGradeIndex);
	});
	$("#studentAcademicDocsContainer").html(html || '<p class="text-muted mb-0">No previous academic document required for selected grade.</p>');
	$("#studentAcademicDocsSection").toggle(html !== '');
	updateStudentDocumentModalPanelLayout(showPassportUpload || showDobUpload, html !== '');
	if(isStudentDocumentReuploadFlow()){
		$("#studentDocumentUploadModal .modal-title span").text("Re-upload Student Documents");
		$("#studentDocumentUploadModal .modal-title small").text("Some of your documents were not verified. Re-upload the required documents below.");
	}else{
		$("#studentDocumentUploadModal .modal-title span").text("Upload Student Documents");
		$("#studentDocumentUploadModal .modal-title small").text("Kindly upload your required documents.");
	}
	$("#studentDocSkipBtn").toggle(STUDENT_DOCS_MANDATORY !== "Y");
	if(isStudentDocumentReuploadFlow() && STUDENT_DOCS_SERVER_RESPONSE){
		populateStudentDocumentReuploadData(STUDENT_DOCS_SERVER_RESPONSE);
	}
	syncStudentDobUploadState();
	$("#studentDocumentUploadModal").modal("show");
}

function isValidStudentDocFile(file){
	var allowed = /^(image\/(png|jpe?g)|application\/pdf)$/i;
	if(!allowed.test(file.type)){
		showMessageTheme2(0, "Please upload files in following formats (jpg, jpeg, pdf or png).");
		return false;
	}
	if(file.size > (5 * 1024 * 1024)){
		showMessageTheme2(0, "Please upload maximum 5MB file in size.");
		return false;
	}
	return true;
}

function readFileAsBase64Data(file){
	return new Promise(function(resolve, reject){
		var reader = new FileReader();
		reader.onload = function(e){
			var base64Raw = e.target.result.split(',')[1];
			resolve(base64Raw);
		};
		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
}

async function onStudentDocUploadChange(src, docKey){
	var file = src.files && src.files[0] ? src.files[0] : null;
	if(!file){
		return;
	}
	if(!isValidStudentDocFile(file)){
		$(src).val('');
		return;
	}
	var base64Content = await readFileAsBase64Data(file);
	var resolvedFileType = "80";
	if(docKey === "passport"){
		resolvedFileType = "78";
	}else if(docKey === "dob"){
		resolvedFileType = "79";
	}
	STUDENT_DOCS_FILE_STORE[docKey] = {
		fileName: file.name,
		fileType: resolvedFileType,
		fileContent: base64Content,
		mimeType: file.type
	};
	if(docKey === "passport"){
		$("#studentDocPassportFileName").text(file.name);
		$("#studentDocPassportView, #studentDocPassportRemove").show();
		if(file.type && file.type.indexOf("image/") === 0){
			setStudentPassportPreviewImage("data:" + file.type + ";base64," + base64Content);
		}else{
			setStudentPassportPreviewImage("");
		}
	}else if(docKey === "dob"){
		$("#studentDocDobFileName").text(file.name);
		$("#studentDocDobView, #studentDocDobRemove").show();
	}else{
		$("#studentAcademicFileName_"+docKey).text(file.name);
		$("#studentAcademicView_"+docKey+", #studentAcademicRemove_"+docKey).show();
	}
}

function removeStudentDocFile(docKey){
	delete STUDENT_DOCS_FILE_STORE[docKey];
	if(docKey === "passport"){
		$("#studentDocPassportFile").val('');
		$("#studentDocPassportFileName").text("Passport Size Photo");
		$("#studentDocPassportView, #studentDocPassportRemove").hide();
		setStudentPassportPreviewImage("");
	}else if(docKey === "dob"){
		$("#studentDocDobFile").val('');
		$("#studentDocDobFileName").text($.trim($("#studentDocDobProofType").val()) !== "" ? "Upload your file" : "Select proof type first");
		$("#studentDocDobView, #studentDocDobRemove").hide();
	}else{
		$("#studentAcademicFile_"+docKey).val('');
		$("#studentAcademicFileName_"+docKey).text("Upload your file");
		$("#studentAcademicView_"+docKey+", #studentAcademicRemove_"+docKey).hide();
	}
}

function viewStudentDocFile(docKey, srcBtn){
	var doc = STUDENT_DOCS_FILE_STORE[docKey];
	if(!doc || !doc.fileContent){
		return;
	}
	var mimeType = doc.mimeType || "application/octet-stream";
	var blob = base64ContentToBlob(doc.fileContent, mimeType);
	var blobUrl = URL.createObjectURL(blob);

	var ext = "pdf";
	if(mimeType && mimeType.indexOf("image/") === 0){
		ext = (mimeType.indexOf("png") > -1) ? "png" : "jpg";
	}

	// Prefer same-page preview (Test.jsp style via main.js -> viewAttachmentInModal).
	if(typeof viewAttachmentInModal === "function" && $("#studentDocPreviewModal").length > 0){
		if(!srcBtn){
			srcBtn = document.getElementById("studentAcademicView_"+docKey) ||
				document.getElementById("studentDocPassportView") ||
				document.getElementById("studentDocDobView");
		}
		if(srcBtn){
			if(STUDENT_DOCS_PREVIEW_BLOB_URL && STUDENT_DOCS_PREVIEW_BLOB_URL.indexOf("blob:") === 0){
				try{ URL.revokeObjectURL(STUDENT_DOCS_PREVIEW_BLOB_URL); }catch(e){}
			}
			STUDENT_DOCS_PREVIEW_BLOB_URL = blobUrl;
			$(srcBtn).attr("data-file-extension", ext);
			$(srcBtn).attr("data-attachment-url", blobUrl);
			viewAttachmentInModal(srcBtn, "studentDocPreviewModal");
			return;
		}
	}

	// Fallback
	window.open(blobUrl, "_blank");
}

function base64ContentToBlob(base64Content, mimeType){
	var byteCharacters = atob(base64Content);
	var byteArrays = [];
	for (var offset = 0; offset < byteCharacters.length; offset += 512) {
		var slice = byteCharacters.slice(offset, offset + 512);
		var byteNumbers = new Array(slice.length);
		for (var i = 0; i < slice.length; i++) {
			byteNumbers[i] = slice.charCodeAt(i);
		}
		byteArrays.push(new Uint8Array(byteNumbers));
	}
	return new Blob(byteArrays, { type: mimeType });
}

function getAcademicDocInputValue(rowKey, key){
	return $.trim($("#"+key+"_"+rowKey).val());
}

function validateStudentDocPayload(attachments){
	if(isStudentDocumentReuploadFlow()){
		if(STUDENT_DOCS_FILE_STORE.dob && !$("#studentDocDobProofType").val()){
			showMessageTheme2(0, "Please select Date of Birth proof type.");
			return false;
		}
		return true;
	}
	if(STUDENT_DOCS_MANDATORY === "Y"){
		if(!STUDENT_DOCS_FILE_STORE.passport){
			showMessageTheme2(0, "Passport size photo is mandatory.");
			return false;
		}
		if(!$("#studentDocDobProofType").val()){
			showMessageTheme2(0, "Please select Date of Birth proof type.");
			return false;
		}
		if(!STUDENT_DOCS_FILE_STORE.dob){
			showMessageTheme2(0, "Date of Birth proof document is mandatory.");
			return false;
		}
	}
	if(STUDENT_DOCS_FILE_STORE.dob && !$("#studentDocDobProofType").val()){
		showMessageTheme2(0, "Please select Date of Birth proof type.");
		return false;
	}
	if(STUDENT_DOCS_MANDATORY !== "Y" && attachments.length === 0){
		showMessageTheme2(0, "Please upload at least one document or click Skip.");
		return false;
	}
	return true;
}

function getStudentReuploadMeta(docKey){
	var existingDoc = STUDENT_DOCS_UNVERIFIED_MAP[docKey] || {};
	return {
		isReupload: isStudentDocumentReuploadFlow() ? "Y" : "N",
		attachmentId: existingDoc.attachmentId || existingDoc.id || null
	};
}

function buildStudentDocumentsPayload(){
	var payload = {
		userId: parseInt($("#userId").val()),
		attachments: []
	};
	if(STUDENT_DOCS_FILE_STORE.passport){
		var passportMeta = getStudentReuploadMeta("passport");
		payload.attachments.push({
			isReupload: passportMeta.isReupload,
			attachmentId: passportMeta.attachmentId,
			fileName: STUDENT_DOCS_FILE_STORE.passport.fileName,
			fileType: 78,
			fileContent: STUDENT_DOCS_FILE_STORE.passport.fileContent
		});
	}
	if(STUDENT_DOCS_FILE_STORE.dob){
		var dobMeta = getStudentReuploadMeta("dob");
		payload.attachments.push({
			isReupload: dobMeta.isReupload,
			attachmentId: dobMeta.attachmentId,
			dobProof: $("#studentDocDobProofType").val(),
			fileName: STUDENT_DOCS_FILE_STORE.dob.fileName,
			fileType: 79,
			fileContent: STUDENT_DOCS_FILE_STORE.dob.fileContent
		});
	}
	var requiredGrades = getRequiredAcademicDocumentGrades(STUDENT_DOCS_CURRENT_STANDARD_ID);
	$.each(requiredGrades, function(index, gradeInfo){
		var rowKey = "acad_" + gradeInfo.key;
		var uploaded = STUDENT_DOCS_FILE_STORE[rowKey];
		var documentName = getAcademicDocInputValue(rowKey, "studentDocName");
		var schoolName = getAcademicDocInputValue(rowKey, "studentSchoolName");
		var boardName = getAcademicDocInputValue(rowKey, "studentBoardName");
		var passingYear = getAcademicDocInputValue(rowKey, "studentPassingYear");
		if(uploaded){
			var academicMeta = getStudentReuploadMeta(rowKey);
			payload.attachments.push({
				isReupload: academicMeta.isReupload,
				attachmentId: academicMeta.attachmentId,
				standardId: parseInt(gradeInfo.key),
				documentName: documentName,
				schoolName: schoolName,
				boardName: boardName,
				passingYear: parseInt(passingYear),
				fileName: uploaded.fileName,
				fileType: 80,
				fileContent: uploaded.fileContent
			});
		}
	});
	return payload;
}

function validateAcademicDocumentsForMandatory(){
	if(isStudentDocumentReuploadFlow()){
		if(STUDENT_DOCS_UNVERIFIED_MAP.passport && !STUDENT_DOCS_FILE_STORE.passport){
			showMessageTheme2(0, "Please re-upload Passport Size Photo.");
			return false;
		}
		if(STUDENT_DOCS_UNVERIFIED_MAP.dob){
			if(!$("#studentDocDobProofType").val()){
				showMessageTheme2(0, "Please select Date of Birth proof type.");
				return false;
			}
			if(!STUDENT_DOCS_FILE_STORE.dob){
				showMessageTheme2(0, "Please re-upload Date of Birth proof document.");
				return false;
			}
		}
	}
	var requiredGrades = getRequiredAcademicDocumentGrades(STUDENT_DOCS_CURRENT_STANDARD_ID);
	for(var i=0; i<requiredGrades.length; i++){
		var gradeInfo = requiredGrades[i];
		var rowKey = "acad_" + gradeInfo.key;
		var documentName = getAcademicDocInputValue(rowKey, "studentDocName");
		var schoolName = getAcademicDocInputValue(rowKey, "studentSchoolName");
		var boardName = getAcademicDocInputValue(rowKey, "studentBoardName");
		var passingYear = getAcademicDocInputValue(rowKey, "studentPassingYear");
		var uploadedDoc = STUDENT_DOCS_FILE_STORE[rowKey];
		if(isStudentDocumentReuploadFlow()){
			if(!STUDENT_DOCS_UNVERIFIED_MAP[rowKey]){
				continue;
			}
			if(!uploadedDoc){
				showMessageTheme2(0, "Please re-upload academic document file for "+gradeInfo.value+".");
				return false;
			}
		}
		var hasAnyValue = (documentName !== "" || schoolName !== "" || boardName !== "" || passingYear !== "" || !!uploadedDoc);
		if(STUDENT_DOCS_MANDATORY !== "Y" && !hasAnyValue){
			continue;
		}
		if(documentName === "" || schoolName === "" || boardName === "" || passingYear === ""){
			showMessageTheme2(0, isFlexyAcademicDocumentFlow(STUDENT_DOCS_CURRENT_STANDARD_ID) ? "Please fill all academic documents." : "Please fill all academic document details for "+gradeInfo.value+".");
			return false;
		}
		if(!/^\d{4}$/.test(passingYear)){
			showMessageTheme2(0, "Passing year must be a 4 digit year for "+gradeInfo.value+".");
			return false;
		}
		if(!uploadedDoc){
			showMessageTheme2(0, isFlexyAcademicDocumentFlow(STUDENT_DOCS_CURRENT_STANDARD_ID) ? "Please upload academic document file." : "Please upload academic document file for "+gradeInfo.value+".");
			return false;
		}
	}
	return true;
}

function confirmStudentDocumentsSubmit(){
	var payload = buildStudentDocumentsPayload();
	if(!validateStudentDocPayload(payload.attachments)){
		return;
	}
	if(!validateAcademicDocumentsForMandatory()){
		return;
	}
	STUDENT_DOCS_PENDING_PAYLOAD = payload;
	$("#studentDocSubmitConfirmModal").modal("show");
}

async function submitStudentDocumentsToServer(){
	$("#studentDocSubmitConfirmModal").modal("hide");
	var payload = STUDENT_DOCS_PENDING_PAYLOAD || buildStudentDocumentsPayload();
	if(!validateStudentDocPayload(payload.attachments)){
		return;
	}
	if(!validateAcademicDocumentsForMandatory()){
		return;
	}
	var ajaxReqDetails = {
		method: "POST",
		url: BASE_URL + CONTEXT_PATH + "student/enrollment/save-documents",
		body: payload,
		global: true,
		showMessage: true
	};
	var responseData = await callCommonAjax(ajaxReqDetails);
	if(responseData && !(responseData.status == '0' || responseData.status == '2' || responseData.status == '3')){
		STUDENT_DOCS_FLOW_DONE = true;
		STUDENT_DOCS_PENDING_PAYLOAD = null;
		STUDENT_DOCS_SUBMITTED = "Y";
		STUDENT_DOCS_VERIFIED = "N";
		applyStudentEnrollmentDocsState("UNDER_VERIFICATION");
		showMessageTheme2(1, responseData.message || "Documents submitted successfully.");
		var openAfterHide = function(){
			window.setTimeout(function(){
				loadStudentDocumentsStatus(true, null, true);
				openStudentDocsUnderVerificationModal();
			}, 250);
		};
		if($("#studentDocumentUploadModal").is(":visible")){
			$("#studentDocumentUploadModal").one("hidden.bs.modal", function(){
				openAfterHide();
			});
			$("#studentDocumentUploadModal").modal("hide");
		}else{
			openAfterHide();
		}
	}
}

function skipStudentDocumentsFlow(){
	if(STUDENT_DOCS_MANDATORY === "Y"){
		showMessageTheme2(0, "Document submission is mandatory for this grade.");
		return false;
	}
	openStudentDocumentSkipDeclarationModal();
	return true;
}

function resetStudentDocSkipDeclarationModal(){
	$("#studentDocSkipDeclarationCheckbox").prop("checked", false);
	$("#studentDocSkipAcceptBtn").prop("disabled", true).removeClass("btn-success").addClass("btn-light");
}

function openStudentDocumentSkipDeclarationModal(){
	if($("#studentDocSkipDeclarationModal").length < 1){
		showMessageTheme2(0, "Declaration modal is unavailable. Please refresh and try again.");
		return false;
	}
	resetStudentDocSkipDeclarationModal();
	$("#studentDocSkipDeclarationModal").appendTo("body");
	$("#studentDocSkipDeclarationModal").modal("show");
	window.setTimeout(function(){
		$("#studentDocSkipDeclarationModal").css("z-index", "1065");
		$(".modal-backdrop").last().css("z-index", "1060");
	}, 120);
	if($("#studentDocumentUploadModal").is(":visible")){
		$("#studentDocumentUploadModal").css("z-index", "1050");
	}
	return true;
}

function closeStudentDocumentSkipDeclarationModal(){
	$("#studentDocSkipDeclarationModal").modal("hide");
}

function confirmStudentDocumentsSkipFlow(){
	if(!$("#studentDocSkipDeclarationCheckbox").is(":checked")){
		showMessageTheme2(0, "Please accept the declaration to continue.");
		return false;
	}
	STUDENT_DOCS_FLOW_DONE = true;
	IS_DOCUMENT_SKIP = true;
	$("#studentDocSkipDeclarationModal").one("hidden.bs.modal", function(){
		$("#studentDocumentUploadModal").modal("hide");
	});
	closeStudentDocumentSkipDeclarationModal();
	return true;
}

$(document).on("change", "#studentDocSkipDeclarationCheckbox", function(){
	var isChecked = $(this).is(":checked");
	$("#studentDocSkipAcceptBtn").prop("disabled", !isChecked);
	if(isChecked){
		$("#studentDocSkipAcceptBtn").removeClass("btn-light").addClass("btn-success");
	}else{
		$("#studentDocSkipAcceptBtn").removeClass("btn-success").addClass("btn-light");
	}
});

$(document).on("hidden.bs.modal", "#studentDocSkipDeclarationModal", function(){
	$(this).css("z-index", "");
	$("#studentDocumentUploadModal").css("z-index", "");
	resetStudentDocSkipDeclarationModal();
});

async function openStudentDocCameraModal(){
	if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
		showMessageTheme2(0, "Camera is not supported on this browser.");
		return;
	}
	try {
		STUDENT_DOC_CAMERA_STREAM = await navigator.mediaDevices.getUserMedia({
			video: { facingMode: { ideal: "environment" } },
			audio: false
		});
		var video = document.getElementById("studentDocCameraVideo");
		video.srcObject = STUDENT_DOC_CAMERA_STREAM;
		$("#studentDocCameraModal").modal("show");
	} catch (e) {
		showMessageTheme2(0, "Camera permission blocked or unavailable.");
	}
}

function stopStudentDocCamera(){
	if(STUDENT_DOC_CAMERA_STREAM){
		STUDENT_DOC_CAMERA_STREAM.getTracks().forEach(function(track){ track.stop(); });
		STUDENT_DOC_CAMERA_STREAM = null;
	}
	var video = document.getElementById("studentDocCameraVideo");
	if(video){
		video.srcObject = null;
	}
}

function readBlobAsBase64(blob){
	return new Promise(function(resolve, reject){
		var reader = new FileReader();
		reader.onload = function(e){
			resolve(e.target.result.split(',')[1]);
		};
		reader.onerror = reject;
		reader.readAsDataURL(blob);
	});
}

async function compressCapturedImageBlob(blob, maxBytes){
	if(blob.size <= maxBytes){
		return blob;
	}
	var imgData = "data:image/jpeg;base64," + await readBlobAsBase64(blob);
	var img = await new Promise(function(resolve, reject){
		var tmp = new Image();
		tmp.onload = function(){ resolve(tmp); };
		tmp.onerror = reject;
		tmp.src = imgData;
	});
	var canvas = document.createElement("canvas");
	var ctx = canvas.getContext("2d");
	var scale = 1;
	var quality = 0.9;
	var resultBlob = blob;
	for(var i=0;i<10;i++){
		var width = Math.max(400, Math.floor(img.width * scale));
		var height = Math.max(400, Math.floor(img.height * scale));
		canvas.width = width;
		canvas.height = height;
		ctx.drawImage(img, 0, 0, width, height);
		resultBlob = await new Promise(function(resolve){
			canvas.toBlob(function(output){ resolve(output); }, "image/jpeg", quality);
		});
		if(resultBlob && resultBlob.size <= maxBytes){
			break;
		}
		if(quality > 0.55){
			quality -= 0.1;
		}else{
			scale *= 0.85;
		}
	}
	return resultBlob || blob;
}

async function captureStudentDocPhoto(){
	var video = document.getElementById("studentDocCameraVideo");
	if(!video || !video.videoWidth || !video.videoHeight){
		showMessageTheme2(0, "Unable to capture image. Please try again.");
		return;
	}
	var canvas = document.createElement("canvas");
	canvas.width = video.videoWidth;
	canvas.height = video.videoHeight;
	canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
	var capturedBlob = await new Promise(function(resolve){
		canvas.toBlob(function(blob){ resolve(blob); }, "image/jpeg", 0.95);
	});
	if(!capturedBlob){
		showMessageTheme2(0, "Unable to capture image. Please try again.");
		return;
	}
	var finalBlob = await compressCapturedImageBlob(capturedBlob, 5 * 1024 * 1024);
	if(finalBlob.size > (5 * 1024 * 1024)){
		showMessageTheme2(0, "Captured image is still above 5MB. Please retake with lower resolution.");
		return;
	}
	var fileName = "passport_camera_" + new Date().getTime() + ".jpg";
	STUDENT_DOCS_FILE_STORE.passport = {
		fileName: fileName,
		fileType: "78",
		fileContent: await readBlobAsBase64(finalBlob),
		mimeType: "image/jpeg"
	};
	$("#studentDocPassportFile").val("");
	$("#studentDocPassportFileName").text(fileName);
	$("#studentDocPassportView, #studentDocPassportRemove").show();
	setStudentPassportPreviewImage("data:image/jpeg;base64," + STUDENT_DOCS_FILE_STORE.passport.fileContent);
	$("#studentDocCameraModal").modal("hide");
}

$(document).on("hidden.bs.modal", "#studentDocCameraModal", function(){
	stopStudentDocCamera();
});

function callForApplicationSubmit() {
	var flag = false;
	hideModalMessage('');
	if($('#signupType').val() == 'Online' ){
		$.ajax({
			type: "POST",
			contentType: APPLICATION_JSON_VALUE,
			url: BASE_URL + CONTEXT_PATH + SCHOOL_UUID +'/student/submit-application',
			data: JSON.stringify(getRequestForApplicationSubmit()),
			dataType: 'json',
			async: false,
			success: function (data) {
				if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
					if (data['status'] == '3') {
						redirectLoginPage();
					} else {
						showMessageTheme2(false, data['message']);
					}
				} else {
					showMessageTheme2(true, 'Thank you! Your application has been successfully submitted');
					if($('#signupType').val() == 'Online' ){
						applicationSubmittedModal(data.details.contactEmail);
					}
				}
			}
		});
	}else{
		callForProgressionToDashboard()
	}
	return flag;
}

function getRequestForApplicationSubmit() {
	var applicationSubmitRequest = {};
	applicationSubmitRequest['userId'] = $('#userId').val();
	return applicationSubmitRequest;
}

function applicationSubmittedModal(contactEmail){
	$('#submitApplicationMsg').html('Your enrollment application is under review. For any further queries, reach out to <a class="priamry-txt-color" href="mailto:'+contactEmail+'">'+contactEmail+'</a>');
	$('#goToDashboardWarningMessage').modal({ backdrop: 'static', keyboard: false })
	$('#submitApplicationWarning').modal("hide");
}

function applicationSubmittedModalOffline(){
	$('#submitApplicationMsg').html('Your enrollment application is under review. For any further queries');
	$('#goToDashboardWarningMessage').modal({ backdrop: 'static', keyboard: false })
	$('#submitApplicationWarning').modal("hide");
}

function switchGrade(){
	var standardId = $('#signupStage3 #gradeId').val();
	if($('#signupStage3 #standardId').val().trim()==standardId){
		$('#signupStage3 #standardId').val(standardId);
	}else{
		if($('#selectedSubjects').val().trim()!=''){
			$('#gradeChangeWarning').remove();
			$("body").append(switchFlexyGradeWarningModal());
			if(standardId==19){
				$('#gradeChangeWarningMessage').html('You are about to switch to Elementary School courses. Please note that your course selection will be lost. Do you wish to proceed?');
			}else if(standardId==9){
				$('#gradeChangeWarningMessage').html('You are about to switch to Middle School courses. Please note that your course selection will be lost. Do you wish to proceed?');
			}else if(standardId==10){
				$('#gradeChangeWarningMessage').html('You are about to switch to High School courses. Please note that your course selection will be lost. Do you wish to proceed?');
			}else if(standardId==20){
				$('#gradeChangeWarningMessage').html('You are about to switch to Credit Recovery courses. Please note that your course selection will be lost. Do you wish to proceed?');
			}else if(standardId==21){
				$('#gradeChangeWarningMessage').html('You are about to switch to Advanced Placement courses. Please note that your course selection will be lost. Do you wish to proceed?');
			}else {
			}
			$('#gradeChangeWarningYes').attr("onclick", "switchGradeYes('"+standardId+"')");
			$('#gradeChangeWarningNo').attr("onclick", "switchGradeNo('"+standardId+"')");
			$('#gradeChangeWarning').modal('show');
		}else{
			switchGradeYes();
		}
	}
}

function switchGradeYes(){
	$("#signupStage3 #standardId").val($("#signupStage3 #gradeId").val())
	$('#gradeChangeWarning').modal('hide');
	$("#selectedSubjects").val("");
	$("#controlType").val("remove");
	getAllCourseDetails('Y', '')
}

function switchGradeNo(standardId){
	$('#gradeChangeWarning').modal('hide');
	$("#gradeId").val($("#signupStage3 #standardId").val()).trigger("change");
}

function signupLogout(){
	$("#logoutSignupModal").modal("show");
}
function logoutConfimation(flag, url){
	if(flag){
		window.location.href = url;
	}else{
		$("#logoutSignupModal").modal("hide");
	}
}

function toggleAddRemoveAllBtn() {
	let allSelectable = $('.add-recommended-course-not-mandatory, .add-recommended-course-already-selected');
	let allSelected = $('.add-recommended-course-not-mandatory:checked, .add-recommended-course-already-selected:checked');

	if (allSelectable.length > 0 && allSelectable.length === allSelected.length) {
		$("#addAllRecommendedCourse").hide();
		$("#reomveAllRecommendedCourse").show();
	} else {
		$("#reomveAllRecommendedCourse").hide();
		$("#addAllRecommendedCourse").show();
	}
}

function updateConfirmButtonState() {
	let hasChange = false;

	$(".add-recommended-course-already-selected, .add-recommended-course-not-mandatory").each(function () {
		const originallyChecked = $(this).data("checked") === true;
		const currentlyChecked = $(this).prop("checked");

		if (originallyChecked != currentlyChecked) {
			hasChange = true;
			return false;
		}
	});

	if (hasChange) {
		$("#confirmAndAddRecommendedCourse").attr("disabled", false).addClass("primary-bg").removeClass("btn-light");
	} else {
		$("#confirmAndAddRecommendedCourse").attr("disabled", true).removeClass("primary-bg").addClass("btn-light");
	}
}

	function viewAttachmentInModal(src, modalId){
	    var uploadFileType = $(src).attr("data-file-extension");
	    var attachmentType = (uploadFileType && ["png","jpg","jpeg"].includes(uploadFileType.toLowerCase())) ? "I" : "P";
	  
	    var base64URL = $(src).attr('data-attachment-url');
	    var blobUrl = "";

	    if (base64URL.startsWith("data:")) {
	      // Some signup pages don't load main.js; keep a safe local fallback.
	      if(typeof window !== "undefined" && typeof window.base64ToBlob !== "function"){
	        window.base64ToBlob = function(base64DataURL){
	          try{
	            var parts = (base64DataURL || "").split(",");
	            var meta = parts[0] || "";
	            var b64 = (parts[1] || parts[0] || "").replace(/\s/g, "");
	            var mime = "application/octet-stream";
	            var m = meta.match(/data:([^;]+);base64/i);
	            if(m && m[1]){
	              mime = m[1];
	            }
	            var binary = atob(b64);
	            var len = binary.length;
	            var bytes = new Uint8Array(len);
	            for(var i=0;i<len;i++){
	              bytes[i] = binary.charCodeAt(i);
	            }
	            return new Blob([bytes], {type: mime});
	          }catch(e){
	            return new Blob([], {type: "application/octet-stream"});
	          }
	        };
	      }
	      var blob  = base64ToBlob(base64URL);
	      blobUrl = URL.createObjectURL(blob);
	    } else {
	      blobUrl = base64URL;
	    }
  
    if (attachmentType == "I") {
      $("#" + modalId + " .upload_img img").attr('src', blobUrl);
      $("#" + modalId + ' .upload_img').removeClass("d-none");
      $("#" + modalId + " .upload_pdf").addClass("d-none");
    } else if (attachmentType == "P") {
      $("#" + modalId + " .upload_pdf .pre_upload_pdf").remove();
      $("#" + modalId + " .upload_pdf#pre_upload_pdf_div")
        .append('<object type="application/pdf" class="pre_upload_pdf full" style="height: 400px;" data="'+blobUrl+'"></object>');
  
      $("#" + modalId + " .upload_pdf a.download-pdf-btn").attr("href", blobUrl);
      $("#" + modalId + " .upload_pdf").removeClass("d-none");
      $("#" + modalId + ' .upload_img').addClass("d-none");
    } else {
      $("#" + modalId + " .upload_pdf .pre_upload_pdf").remove();
      $("#" + modalId + " .upload_pdf#pre_upload_pdf_div")
        .append('<object type="application/pdf" class="pre_upload_pdf full" style="height: 400px;" data="'+blobUrl+'"></object>');
  
      $("#" + modalId + " .upload_pdf a.download-pdf-btn").attr("href", blobUrl);
      $("#" + modalId + " .upload_pdf").removeClass("d-none");
      $("#" + modalId + ' .upload_img').addClass("d-none");
    }
  
    $("#" + modalId).modal("show");
}
