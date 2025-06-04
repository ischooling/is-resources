function signupTeacherStage4OnLoadEvent(){
	FULL_NAME=$("#teacherSignupStage2 #teacherFirstName").val()+" "+$('#teacherSignupStage2 #teacherMiddleName').val()+" "+$('#teacherSignupStage2 #teacherLastName').val();
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
		showMessage(0, `Invalid Link: '${url}'`)
	}
}

function previewFillSectionTeacher1(){
	var phonecode = $('#countryIsd').val() == "+null" ? 1 : $('#countryIsd').val();
	var cCode = $('#teacherSignupStage2 #countryCode option:selected').text();

	
	$('#editStage2FirstName').text(toTitleCase($("#teacherSignupStage2 #teacherFirstName").val()));
	$('#editStage2MiddleName').text(toTitleCase($('#teacherSignupStage2 #teacherMiddleName').val()));
	$('#editStage2LastName').text(toTitleCase($('#teacherSignupStage2 #teacherLastName').val()));
	$('#editStage2Country').text($('#teacherSignupStage2 #countryId option:selected').text());
	$('#editStage2State').text($('#teacherSignupStage2 #stateId option:selected').text());
	$('#editStage2City').text($('#teacherSignupStage2 #cityId option:selected').text());
	$('#editStage2Gender').text($('#teacherSignupStage2 #teacherGender option:selected').text());
	var dob =$('#teacherSignupStage2 #teacherDob').val().split('-');
	$('#editStage2Dob').text(dob);
	$('#editStage2Email').text($('#teacherSignupStage2 #teacherEmailId').val());
	$('#editStage2Phoneno').text("+" + phonecode + " "+$('#teacherSignupStage2 #phone_no').val() );
}
function previewFillSectionTeacher2(){
	$('#editStage3highestQualificationId').text($("#teacherSignupStage3 #highestQualificationId  option:selected").text());
	$('#editStage3teacherSupportingDocumentCertificate').text($('#teacherSignupStage3 #fileupload1Span').html());
	$('#editStage3lastOrganizationName').text(toTitleCase($('#teacherSignupStage3 #lastOrganizationName').val()));
	$('#editStage3teacherSubjectSpecialization').text(toTitleCase($('#teacherSignupStage3 #teacherSubjectSpecialization').val()));
	if($('#teacherSignupStage3 #currentlyWorking').is(':checked')){
		$('#editStage3currentlyWorkingHere').text('Yes');
	}else{
		$('#editStage3currentlyWorkingHere').text('No');
	}
	$('#edittotalExperianceFromYYYY').text($('#teacherSignupStage3 #totalExperianceFromYYYY option:selected').text());
	$('#edittotalExperianceFromMM').text($('#teacherSignupStage3 #totalExperianceFromMM option:selected').text());
	
	$('#editStage3lastJobFromYYYY').text($('#teacherSignupStage3 #lastJobFromYYYY option:selected').text());
	$('#editStage3lastJobFromMM').text($('#teacherSignupStage3 #lastJobFromMM option:selected').text());
	if($('#teacherSignupStage3 #lastJobToYYYY  option:selected').text()!='' || $('#teacherSignupStage3 #lastJobToYYYY  option:selected').text()!='YYYY*'){
		$('#editStage3lastJobToYYYY').text($('#teacherSignupStage3 #lastJobToYYYY  option:selected').text());
		$('#editStage3lastJobToMM').text($('#teacherSignupStage3 #lastJobToMM option:selected').text());
	}else{
		$('#editStage3lastJobToYYYY').text('Present');
	}
	if($('#editStage3currentlyWorkingHere').text()=='Yes'){
		$('#editStage3lastJobToYYYY').text('Present');
		$('#editStage3lastJobToMM').text('');
	}
	
	$('#editStage3lastJobDesc').text(toSentenceCase($('#teacherSignupStage3 #lastJobDesc').val()));
	$("#editCoursesTaught").text(SUBJECTS_TAUGHT.map(subject => subject.replace("All Courses - Language Arts, Mathematics, Science, Technology, Art", "Language Arts, Mathematics, Science, Technology, Art")).join(", "));
	var selectedGrade = getGradesNameByIds(GRADES_TAUGHT).map(function(grade) {
		return grade.value;
	}).join(", ");
	$("#editGradesTaught").text(selectedGrade);
	
	$('#editStage3teacherSupportingDocumentAcademic').text($("#teacherSignupStage3 #fileupload2Span").html());
	$('#editStage3teacherSupportingDocumentExperiance').text(
		($("#teacherSignupStage3 #fileupload3Span").html() == undefined || $("#teacherSignupStage3 #fileupload3Span").html() === "" || $("#teacherSignupStage3 #fileupload3Span").html() === "Upload Proof of last Work-Experience")
		? "NA" 
		: $("#teacherSignupStage3 #fileupload3Span").html()
	);
	$('#editStage3teacherSupportingDocumentCV').text($("#teacherSignupStage3 #fileupload1Span").html());
	$('#editStage3teacherPassport').text($("#teacherSignupStage3 #fileupload4Span").html());
	
	if($('#teacherSignupStage3 #editStage3optionsCheckboxes').is(':checked')){
		$('#editStage3optionsCheckboxes').text('Y');
	}else{
		$('#editStage3optionsCheckboxes').text('N');
	}
	$('#editStage3teacherDemoVedioLink').html('<a onclick="checkLinkValid(event, this)" class="primary-txt-color" href="'+$('#teacherSignupStage3 #demoVedioLink').val()+'" target="blank">View</a>');
}


function getTeacherSignupDetailInReviewStage() {
	previewFillSectionTeacher1();
	previewFillSectionTeacher2();
}
function callForSignupTeacherReviewAndApproval(formId) {
	$('#submitReviewForTeacherDetailsModal').modal('show');
	tabActiveStatus(3);
	signupPage=4;
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
				showMessage(0, stringMessage[1],"", true);
			}else{
				$('#submitInterviewSlotModal').modal('hide');
				showMessage(1, 'Request has been sent successfully for approval',"", true);
				$('#inReviewForTeacherDetailsModal').modal({backdrop: 'static', keyboard: false});
				$('#teacherFullName').html($("#teacherSignupStage2 #teacherFirstName").val()+ " "+ $('#teacherSignupStage2 #teacherMiddleName').val()+" "+$('#teacherSignupStage2 #teacherLastName').val());
			}
		},
		error : function(e) {
			//showMessage(0, e.responseText,"", true);
			$("#nextStep").prop("disabled", false);
		}
	});
}

async function getStage4Data(response){
	if(response != undefined){
		SUBJECTS_TAUGHT = response.elementrySelectedSubject.concat(response.middleSelectedSubject, response.highSelectedSubject);
		SUBJECTS_TAUGHT_BACKUP = SUBJECTS_TAUGHT;
	}
	setSteps(3);
	showSkeleton(true, 'step3');
	await getStage2Data();
	$("#teacherSignupContentStage4").html(getTeacherReviewAndApprovalContent());
	signupTeacherStage4OnLoadEvent();
	if(signupPage == 4){
		$("#submitInterviewSlotModal").modal('hide');
		$('#inReviewForTeacherDetailsModal').modal({backdrop: 'static', keyboard: false});
	}
	$(".step-3-skeleton").hide();
	$("#teacherSignupStage4").show();
}