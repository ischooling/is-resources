function signupTeacherStage4OnLoadEvent(){
	previewFillDeclaration();
}

function previewFillSection(){
	$('#editStage2FirstNamePopup').text(toTitleCase($("#teacherSignupStage1 #teacherFirstName").val()));
	$('#editStage2MiddleNamePopup').text(toTitleCase($('#teacherSignupStage1 #teacherMiddleName').val()));
	$('#editStage2LastNamePopup').text(toTitleCase($('#teacherSignupStage1 #teacherLastName').val()));
}

function previewFillDeclaration(){
	var date = new Date().toDateString().substring(4);
	$('#editStage6Date').text(date);
}

async function getStage4Data(){
	setSteps(4);
	showSkeleton(true, 'step4');
	var payload = {};
	payload['userId'] = USER_ID;
	responseData = await getDashboardDataBasedUrlAndPayloadWithParentUrl(true, true, 'get-teacher-signup-agreement-details', payload, '/teacher/signup');
	$("#teacherSignupContentStage4").html(getContractDetailsContent(responseData));
	signupTeacherStage4OnLoadEvent();
	$(".prev-btn").hide();
	$(".step-4-skeleton").hide();
	$("#teacherSignupStage4").show();
}