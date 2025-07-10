function signupTeacherStage3OnLoadEvent(){
	FULL_NAME=$("#teacherSignupStage1 #teacherFirstName").val()+" "+$('#teacherSignupStage1 #teacherMiddleName').val()+" "+$('#teacherSignupStage1 #teacherLastName').val();
	$("#fullName").text(FULL_NAME);
	$('.accordion li:first-child .a-content').show();
	$('.accordion .a-title').click(function() {
		$(this).parent().closest('li').find('.a-content').slideToggle();
		$(this).find('.plus-icon').toggleClass('fa-minus fa-plus')
		$(this).parent().closest('li').siblings().find('.plus-icon').removeClass('fa-minus')
		$(this).parent().closest('li').siblings().find('.plus-icon').addClass('fa-plus')
		$(this).parent().closest('li').siblings().find('.a-content').slideUp();
	});
	getTeacherSignupDetailInReviewStage();
}

function checkLinkValid(e, src){
	var url = $(src).attr("href").trim();
	try {
		if (!url.startsWith("http") && !url.includes('://')) {
			throw new Error('URL is invalid');
		}

		if (url.includes(' ')) {
			throw new Error("URL contains spaces.");
		}

		if ((url.match(/https?:\/\//g) || []).length > 1) {
			throw new Error("Multiple URLs detected.");
		}

		new URL(url);
	} catch (error) {
		e.preventDefault();
		showMessageTheme2(0, `Invalid Link: '${url}'`)
	}
}

function previewFillSectionTeacher1(){
	var phonecode = $('#countryIsd').val() == "+null" ? 1 : $('#countryIsd').val();
	var cCode = $('#teacherSignupStage1 #countryCode option:selected').text();

	
	$('#editStage2FirstName').text(toTitleCase($("#teacherSignupStage1 #teacherFirstName").val()));
	$('#editStage2MiddleName').text(toTitleCase($('#teacherSignupStage1 #teacherMiddleName').val()));
	$('#editStage2LastName').text(toTitleCase($('#teacherSignupStage1 #teacherLastName').val()));
	$('#editStage2Country').text($('#teacherSignupStage1 #countryId option:selected').text());
	$('#editStage2State').text($('#teacherSignupStage1 #stateId option:selected').text());
	$('#editStage2City').text($('#teacherSignupStage1 #cityId option:selected').text());
	$('#editStage2Gender').text($('#teacherSignupStage1 #teacherGender option:selected').text());
	var dob =$('#teacherSignupStage1 #teacherDob').val().split('-');
	$('#editStage2Dob').text(dob);
	$('#editStage2Email').text($('#teacherSignupStage1 #teacherEmailId').val());
	$('#editStage2Phoneno').text("+" + phonecode + " "+$('#teacherSignupStage1 #phone_no').val() );
}
function previewFillSectionTeacher2(){
	$('#editStage3highestQualificationId').text($("#teacherSignupStage2 #highestQualificationId  option:selected").text());
	$('#editStage3teacherSupportingDocumentCertificate').text($('#teacherSignupStage2 #fileupload1Span').html());
	$('#editStage3lastOrganizationName').text(toTitleCase($('#teacherSignupStage2 #lastOrganizationName').val()));
	$('#editStage3teacherSubjectSpecialization').text(toTitleCase($('#teacherSignupStage2 #teacherSubjectSpecialization').val()));
	if($('#teacherSignupStage2 #currentlyWorking').is(':checked')){
		$('#editStage3currentlyWorkingHere').text('Yes');
	}else{
		$('#editStage3currentlyWorkingHere').text('No');
	}
	$('#edittotalExperianceFromYYYY').text($('#teacherSignupStage2 #totalExperianceFromYYYY option:selected').text());
	$('#edittotalExperianceFromMM').text($('#teacherSignupStage2 #totalExperianceFromMM option:selected').text());
	
	$('#editStage3lastJobFromYYYY').text($('#teacherSignupStage2 #lastJobFromYYYY option:selected').text());
	$('#editStage3lastJobFromMM').text($('#teacherSignupStage2 #lastJobFromMM option:selected').text());
	if($('#teacherSignupStage2 #lastJobToYYYY  option:selected').text()!='' || $('#teacherSignupStage2 #lastJobToYYYY  option:selected').text()!='YYYY*'){
		$('#editStage3lastJobToYYYY').text($('#teacherSignupStage2 #lastJobToYYYY  option:selected').text());
		$('#editStage3lastJobToMM').text($('#teacherSignupStage2 #lastJobToMM option:selected').text());
	}else{
		$('#editStage3lastJobToYYYY').text('Present');
	}
	if($('#editStage3currentlyWorkingHere').text()=='Yes'){
		$('#editStage3lastJobToYYYY').text('Present');
		$('#editStage3lastJobToMM').text('');
	}
	
	$('#editStage3lastJobDesc').text(toSentenceCase($('#teacherSignupStage2 #lastJobDesc').val()));
	$("#editCoursesTaught").text(SUBJECTS_TAUGHT.map(subject => subject.replace("All Courses - Language Arts, Mathematics, Science, Technology, Art", "Language Arts, Mathematics, Science, Technology, Art")).join(", "));
	var selectedGrade = getGradesNameByIds(GRADES_TAUGHT).map(function(grade) {
		return grade.value;
	}).join(", ");
	$("#editGradesTaught").text(selectedGrade);
	
	$('#editStage3teacherSupportingDocumentAcademic').text($("#teacherSignupStage2 #fileupload2Span").html());
	$('#editStage3teacherSupportingDocumentExperiance').text(
		($("#teacherSignupStage2 #fileupload3Span").html() == undefined || $("#teacherSignupStage2 #fileupload3Span").html() === "" || $("#teacherSignupStage2 #fileupload3Span").html() === "Upload Proof of last Work-Experience")
		? "NA" 
		: $("#teacherSignupStage2 #fileupload3Span").html()
	);
	$('#editStage3teacherSupportingDocumentCV').text($("#teacherSignupStage2 #fileupload1Span").html());
	$('#editStage3teacherPassport').text($("#teacherSignupStage2 #fileupload4Span").html());
	
	if($('#teacherSignupStage2 #editStage3optionsCheckboxes').is(':checked')){
		$('#editStage3optionsCheckboxes').text('Y');
	}else{
		$('#editStage3optionsCheckboxes').text('N');
	}
	if($("#teacherSignupStage2 #demoVedioLink").length <= 0){
		const approvedMeetingAttempt = selectedDemoMeetingAttempt;
		$('#editStage3teacherDemoVedioLink').html(`
			<a href="javascript:void(0);" class="btn btn-sm btn-primary"
			onclick="openDemoRecordingModal(demoRecordingUrlMap['${approvedDemoRowKey}'], '${approvedMeetingAttempt}');">
				View
			</a>
		`);
	}else{
		$('#editStage3teacherDemoVedioLink').html('<a onclick="checkLinkValid(event, this)" class="primary-txt-color" href="'+$('#teacherSignupStage2 #demoVedioLink').val()+'" target="blank">View</a>');
	}
}

function getTeacherSignupDetailInReviewStage() {
	previewFillSectionTeacher1();
	previewFillSectionTeacher2();
}
function getRequestForPendingApproval(){
	var request = {};
	var authentication = {};
	var data = {};
	data['requestKey'] = 'SEND_MAIL_FOR_PENDING_APPROVAL';
	data['requestValue'] = '1';
	authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = 'TEACHER';
	authentication['userId'] = USER_ID;
	request['authentication'] = authentication;
	request['data'] = data;
	return request;
}
function submitSignupTeacherReviewAndApproval(){
	hideMessage('');
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForHTML('teacher','signup/profile-confirmation'),
		data : JSON.stringify(getRequestForPendingApproval()),
		dataType : 'json',
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessageTheme2(0, stringMessage[1]);
			}else{
				$('#submitInterviewSlotModal').modal('hide');
				showMessageTheme2(1, 'Request has been sent successfully for approval');
				setTimeout(() => {
					$('#inReviewForTeacherDetailsModal').modal({backdrop: 'static', keyboard: false});
				}, 500);
				$('#teacherFullName').html($("#teacherSignupStage1 #teacherFirstName").val()+ " "+ $('#teacherSignupStage1 #teacherMiddleName').val()+" "+$('#teacherSignupStage1 #teacherLastName').val());
			}
		},
		error : function(e) {
			$("#nextStep").prop("disabled", false);
		}
	});
}

async function getStage3Data(response){
	if(response != undefined){
		SUBJECTS_TAUGHT = response.elementrySelectedSubject.concat(response.middleSelectedSubject, response.highSelectedSubject);
		SUBJECTS_TAUGHT_BACKUP = SUBJECTS_TAUGHT;
	}
	setSteps(3);
	showSkeleton(true, 'step3');
	await getStage1Data();
	$("#teacherSignupContentStage3").html(getTeacherReviewAndApprovalContent());
	signupTeacherStage3OnLoadEvent();
	if(signupPage == 4){
		$("#submitInterviewSlotModal").modal('hide');
		$('#inReviewForTeacherDetailsModal').modal({backdrop: 'static', keyboard: false});
	}
	$(".step-3-skeleton").hide();
	$("#teacherSignupStage3").show();
}