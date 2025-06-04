function signupTeacherStage5OnLoadEvent(){
	previewFillDeclaration();
}

function previewFillSection(){
	$('#editStage2FirstNamePopup').text(toTitleCase($("#teacherSignupStage2 #teacherFirstName").val()));
	$('#editStage2MiddleNamePopup').text(toTitleCase($('#teacherSignupStage2 #teacherMiddleName').val()));
	$('#editStage2LastNamePopup').text(toTitleCase($('#teacherSignupStage2 #teacherLastName').val()));
}

function previewFillDeclaration(){
	var date = new Date().toDateString().substring(4);
	$('#editStage6Date').text(date);
}

async function getStage5Data(){
	setSteps(4);
	showSkeleton(true, 'step4')
	reviewDone = true;
	var payload = {};
	payload['userId'] = USER_ID;
	responseData = await getDashboardDataBasedUrlAndPayloadWithParentUrl(false, false, 'get-teacher-signup-agreement-details', payload, '/teacher/signup');
	$("#teacherSignupContentStage5").html(getContractDetailsContent(responseData));
	signupTeacherStage5OnLoadEvent();
	$(".prev-btn").hide();
	$(".step-4-skeleton").hide();
	$("#teacherSignupStage5").show();
}