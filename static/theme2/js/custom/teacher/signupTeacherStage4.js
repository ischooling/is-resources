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

async function getStage4Data() {
    setSteps(4);
    showSkeleton(true, 'step4');
    var payload = { userId: USER_ID };
    const responseData = await getDashboardDataBasedUrlAndPayloadWithParentUrl(true, true, 'get-teacher-signup-agreement-details', payload, '/teacher/signup');
    var agreementDetails = responseData?.details?.teacherAgreementDetails;
    var isValid = isAgreementValid(agreementDetails?.validityEnd);
    if (!isValid) {
        $(".step-4-skeleton").hide();
        $("#teacherSignupStage4").hide();
        $("body").append(contractExpiredModalContent());
        $("#contractExpiredModal").modal("show");
        return;
    }
    $("#teacherSignupContentStage4").html(getContractDetailsContent(responseData));
    signupTeacherStage4OnLoadEvent();
    callLocationDetails('teacherSignupStage4');
    $(".prev-btn").hide();
    $(".next-btn a").text("Accept Contract");
    $(".step-4-skeleton").hide();
    $("#teacherSignupStage4").show();
}

function isAgreementValid(validityEnd) {
    if (!validityEnd) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endDate = new Date(validityEnd);
    endDate.setHours(23, 59, 59, 999);
    return today <= endDate;
}