function callChoiceForStudentModel() {
	$('#choiceForStudentModel').modal('show');
}

function callChoiceForStudentModelRepeatersPAndC() {
	$('#choiceForStudentModelRepeaters').modal('hide');
	$('#choiceForStudentModelRepeatersPAndC').modal('show');
}
function callChoiceForStudentModelRepeatersPAndCBack(data) {
	$('#choiceForStudentModelRepeatersPAndC').modal('hide');
	callChoiceForStudentModelRepeaters(data);
}
function callChoiceForStudentModelRepeaters(data) {
	if (data == 'improve') {
		$('#choiceIndividualCourseComplete').hide();
		$('#choiceIndividualCourseImprove').show();
	} else {
		$('#choiceIndividualCourseComplete').show();
		$('#choiceIndividualCourseImprove').hide();
	}
	$('#choiceForStudentModelRepeaters').modal('show');
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
	functionName = "$('#apCourseSelectionWarning').modal('hide');window.setTimeout(function(){" + functionName + "},1000);";
	if (warningMessage != '') {
		$('#statusMessage-2').html(warningMessage);
	}
	$('#apCourseSelectionWarningClose').attr('onclick', functionName);
	var functionNameNo = "$('#apCourseSelectionWarning').modal('hide');apCourseSelectionFlag=false;";
	$('#apCourseSelectionWarningNo').attr('onclick', functionNameNo);
	$('#apCourseSelectionWarning').modal('show');
}

function creditLimitOver(standardId, totalCredit){
	var min_limit=$('#standardId').attr('min_limit');
	var max_limit=$('#standardId').attr('max_limit');
	var upper_band=$('#standardId').attr('upper_band');
	if(parseFloat(totalCredit)>parseFloat(max_limit)){
		return true;
	}
	return false;
}

function assignEvent(indexPosition, subjectId, courseId, tabActive, userReachedMaxLimit, courseCreditLimit, courseSelectedCredit, subjectCredit, remarks, courseType, flagType, standardId, totalCredit,courseFee) {
	if (subjectId == '') {
		showMessageTheme2(2, 'Please select a course then click on the add button.', '', true);
		return false;
	}
	var creditLimitWarning=false;
	var creditsLimitsOver=false;
	// var creditsLimitsOver=creditLimitOver(standardId, totalCredit);
	if(flagType == 'add'){
		if(parseFloat($('#totalCreditInput').val())>=parseFloat($('#standardId').attr('upper_band'))){
			showMessageTheme2(2, 'You can select a maximum of '+$('#standardId').attr('upper_band')+' credits.');
			return false;
		}
		if(parseFloat($('#totalCreditInput').val())>=parseFloat($('#standardId').attr('max_limit'))){
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
			$("#addCourseOverLimitBtn").attr("onclick",functionName);
		}else{
			var functionName = "addCourseLimits('" + indexPosition + "','" + subjectId + "','" + courseId + "','" + tabActive + "','" + userReachedMaxLimit + "','" + courseCreditLimit + "','" + courseSelectedCredit + "','" + subjectCredit + "','" + remarks + "','" + courseType + "','" + courseFee + "');";
			$("#addCourseOverLimitBtn").attr("onclick",functionName);
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
	addCourse(subjectId, courseId, tabActive, userReachedMaxLimit, courseCreditLimit, courseSelectedCredit, subjectCredit, remarks, courseType,courseFee)
}

function addCourse(subjectId, courseId, tabActive, userReachedMaxLimit, courseCreditLimit, courseSelectedCredit, subjectCredit, remarks, courseType,courseFee) {
	// console.log('courseCreditLimit ' + courseCreditLimit + ', courseSelectedCredit ' + courseSelectedCredit + ', subjectCredit ' + subjectCredit + ', remarks ' + remarks + ', courseType ' + courseType)
	if (subjectId == '') {
		showMessageTheme2(2, 'Please select a course then click on the add button.', '', true);
		return false;
	}
	if (tabActive == 'ap_courses') {
		/*if(parseFloat($('#creditCountAdvance').val())>=3.0){
			showMessageTheme2(2, 'Please select courses worth at most 3 academic credits from AP Courses.','',true);
			return false;
		}*/
	}
	if(SCHOOL_ID==1){
		if(courseType=='Advanced Placement' && !apCourseSelectionFlag){
			apCourseSelectionFlag=true
			functionName="addCourse('"+subjectId+"','"+courseId+"','"+tabActive+"','"+userReachedMaxLimit+"','"+courseCreditLimit+"','"+courseSelectedCredit+"','"+subjectCredit+"','"+remarks+"','"+courseType+"','"+courseFee+"');";
			showWarningMessageForAPCourses('',functionName)
			return false;
		}
	}
	if(remarks == 0){
		functionName="addCourse('"+subjectId+"','"+courseId+"','"+tabActive+"','"+userReachedMaxLimit+"','"+courseCreditLimit+"','"+courseSelectedCredit+"','"+subjectCredit+"','1','"+courseType+"','"+courseFee+"');";
		showWarningMessageForNTAA('',functionName);
		return false;
	}
	var selectedSubjects = $('#selectedSubjects').val();
	selectedSubjects = selectedSubjects.split(',');
	selectedSubjects.push(subjectId);
	selectedSubjects = selectedSubjects.join(',');
	// console.log('selectedSubjects add ' + selectedSubjects);
	$('#selectedSubjects').val(selectedSubjects);
	$("#controlType").val('add');
	getAllCourseDetails('N', courseId);
}

function removeCourse(subjectId, courseId, activeTab) {
	var selectedSubjects = $('#selectedSubjects').val().trim();
	selectedSubjects = selectedSubjects.split(',');
	selectedSubjects = selectedSubjects.filter(subId => subId !== subjectId)
	selectedSubjects = selectedSubjects.join(',');
	// console.log('selectedSubjects remove ' + selectedSubjects);
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

function getAllCourseDetails(isGradeChange, courseId) {
	if($("#divNextSessionCourseWrapper .migration-Content").length<1){
		$("#divNextSessionCourseChoose").html(`<div class="migration-Content"><div class="full step-3-skeleton skeleton-wrapper"></div></div>`);
		showSkeleton(true, "step3");
	}
	var standardId = $("#standardId").val();
	if (isGradeChange == 'Y') {
		$('#selectedSubjects').val('');
	}
	if (standardId == '' || standardId == 0) {
		$('#courseSubjectDetails').html('')
	}
	$("#addAndRemoveLoader").removeClass("hide-loader");
	//customLoader(true);
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: BASE_URL + CONTEXT_PATH +SCHOOL_UUID+ '/student/migration/course-details-by-standard-id',
		data: JSON.stringify(getRequestForCourseSelection(courseId)),
		dataType: 'json',
		global: false,
		success: function (data) {
			customLoader(false);
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if (data['status'] == '3') {
					$("#addAndRemoveLoader").removeClass("loader-bg");
					$("#addAndRemoveLoader").addClass("hide-loader");
					redirectLoginPage();
				} else {
					if(data['statusCode']=='ELIGIBLE_ADVANCE_PLAN'){

					}else if (data['statusCode'] == 'ELIGIBLE_CUSTOME_PLAN' || data['statusCode'] == 'REDIRECT_TO_DASHBOOARD') {
						window.location.reload();
					} else {
						showMessageTheme2(0, data['message'], '', true);
					}
				}
			} else {
				ADVANCE_FEE_PAID=data.advanceFeePaid;
				showMessageTheme2(1, data['message'], '', true);
				if($("#pageHeading > input").length<1){
					$("#pageHeading").html(getStudentMigrationHeader(data));
				}
				$('#gradeId').val(data.standardId);
				$('#courseProviderId').val(data.courseProviderId);
				$('#standardId').attr('min_limit',data.minCourseLimitMigration);
				$('#standardId').attr('max_limit',data.maxCourseLimitMigration);
				$('#standardId').attr('upper_band',data.upperBandLimitMigration);
				$('#selectedSubjects').val(data.selectedSubjectsAsString);
				$('#payMode').val(data.paymentMode);
				// if($('#registrationType').val() == "ONE_TO_ONE_FLEX"){
				// 	$('#divNextSessionCourseChoose').html(migrationCourseSelection(data));
					$('#totalCreditInput').val(data.totalCredit);
				// 	$('#selectedSubjects').val(data.selectedSubjectsAsString);
				// }else{
					renderCourseSelectionContent(data);
				// }
				if(courseId == null || courseId == undefined || courseId ==''){
					$.each(data.availableCourses, function(i,v){
						if(v.subjects.length > 0){
							courseId = v.courseId;
							return false;
						}
					})
				}
				$(".step-2-skeleton, .step-3-skeleton").html('');
				$("#courseSubjectDetails").show();
				showSpecificContentNew('ft_courses', courseId);
				
				$("#creditsLimitsModal, #creditsLimitsOverModal").modal("hide");
				if($(".modal.fade.show").length<1){
					$("body .modal-backdrop").remove();
					$("body").removeClass("modal-open");
					$("body").css({"padding-right":"0px"});
				}
				$("#addAndRemoveLoader").removeClass("loader-bg");
				$("#addAndRemoveLoader").addClass("hide-loader");
			}
		},
		error: function(e){
			if (checkonlineOfflineStatus()) {
				return;
			}
		}
	});
}

function getRequestForCourseSelection(courseId) {
	var studentCourseDetailsInfoDTO = {};
	studentCourseDetailsInfoDTO['userId'] = USER_ID;
	studentCourseDetailsInfoDTO['courseId'] = courseId;
	studentCourseDetailsInfoDTO['callFrom'] = 'dashboard';
	if ($("#standardId").length > 0) {
		studentCourseDetailsInfoDTO['standardId'] = $("#standardId").val();
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

function updateCourseLimit(){
	var standardId=$('#standardId').val();
	var totalCredit=$('#totalCreditInput').val();
	var creditsLimitsOver=creditLimitOver(standardId, totalCredit);
	if(creditsLimitsOver){
		$("#oneTimeModal").val(true);
	}else{
		$("#oneTimeModal").val(false);
	}
	$('#creditsLimitsModal').modal('hide');
	$('.modal-backdrop').remove();
	setTimeout(function(){
		$('#creditsLimitsOverModal').modal('show');
	}, 1000);
}



function activeTabList(courseHeadId) {
	$(".courseSelectId-" + courseHeadId).parent().closest('li').find('.a-content').slideToggle();
	$(".courseSelectId-" + courseHeadId).find('.plus-icon').toggleClass('fa-minus fa-plus')
	$(".courseSelectId-" + courseHeadId).parent().closest('li').siblings().find('.plus-icon').removeClass('fa-minus')
	$(".courseSelectId-" + courseHeadId).parent().closest('li').siblings().find('.plus-icon').addClass('fa-plus')
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
	} else if (tabId == 'ap_courses') {
		$("#ft_coursesC").hide();
		$("#ap_coursesC").show();
		$("#cs_coursesC").hide();
		$("#cte_coursesC").hide();
	} else if (tabId == 'cs_courses') {
		$("#ft_coursesC").hide();
		$("#ap_coursesC").hide();
		$("#cs_coursesC").show();
		$("#cte_coursesC").hide();
	} else if (tabId == 'cte_courses') {
		$("#ft_coursesC").hide();
		$("#ap_coursesC").hide();
		$("#cs_coursesC").hide();
		$("#cte_coursesC").show();

	}
	//$('.accordion li:first-child .a-content').show();
	activeTabList(liId);
	//	$('#'+tabId).parent().parent().next().find('#'+tabId+'C').find('#'+liId).siblings().find(".a-content").slideUp()
	//	$('#'+tabId).parent().parent().next().find('#'+tabId+'C').find('#'+liId+' .a-content').show()
}
function displayScholorshipDetails(radioId){
	var payMode='annually';
	if(radioId=='dtl-one'){
		payMode='annually';
		$('#annual-course-fee-details').show()
		$('.installment3-course-fee-details').hide()
		$('#installment5-course-fee-details').hide()
		$('#installment6-course-fee-details').hide()
		$('#installment9-course-fee-details').hide()
		$('#installment10-course-fee-details').hide()
		$('#installment12-course-fee-details').hide()
		$('#book-seat-fee-details, #BookEnrollmentSeat').hide()
	}else if(radioId=='dtl-three'){
		payMode='threeMonthly';
		if(SCHOOL_ID==5){
			payMode='sixMonthly';
		}
		$('#annual-course-fee-details').hide()
		$('.installment3-course-fee-details').show()
		$('#installment5-course-fee-details').hide()
		$('#installment6-course-fee-details').hide()
		$('#installment9-course-fee-details').hide()
		$('#installment10-course-fee-details').hide()
		$('#installment12-course-fee-details').hide()
		$('#book-seat-fee-details, #BookEnrollmentSeat').hide()
		$('#custom-course-fee-details').hide()
	}else if(radioId=='dtl-five'){
		payMode='fiveMonthly';	
		$('#annual-course-fee-details').hide()
		$('.installment3-course-fee-details').hide()
		$('#installment5-course-fee-details').show()
		$('#installment6-course-fee-details').hide()
		$('#installment9-course-fee-details').hide()
		$('#installment10-course-fee-details').hide()
		$('#installment12-course-fee-details').hide()
		$('#book-seat-fee-details, #BookEnrollmentSeat').hide()
		$('#custom-course-fee-details').hide()
	}else if(radioId=='dtl-six'){
		payMode='sixMonthly';
		$('#annual-course-fee-details').hide()
		$('.installment3-course-fee-details').hide()
		$('#installment5-course-fee-details').hide()
		$('#installment6-course-fee-details').show()
		$('#installment9-course-fee-details').hide()
		$('#installment10-course-fee-details').hide()
		$('#installment12-course-fee-details').hide()
		$('#book-seat-fee-details, #BookEnrollmentSeat').hide()
		$('#custom-course-fee-details').hide()
	}else if(radioId=='dtl-nine'){
		payMode='nineMonthlly';
		$('#annual-course-fee-details').hide()
		$('.installment3-course-fee-details').hide()
		$('#installment5-course-fee-details').hide()
		$('#installment6-course-fee-details').hide()
		$('#installment9-course-fee-details').show()
		$('#installment10-course-fee-details').hide()
		$('#installment12-course-fee-details').hide()
		$('#book-seat-fee-details, #BookEnrollmentSeat').hide()
		$('#custom-course-fee-details').hide()
	}else if(radioId=='dtl-ten'){
		payMode='tenMonthly';
		$('#annual-course-fee-details').hide()
		$('.installment3-course-fee-details').hide()
		$('#installment5-course-fee-details').hide()
		$('#installment6-course-fee-details').hide()
		$('#installment9-course-fee-details').hide()
		$('#installment10-course-fee-details').show()
		$('#installment12-course-fee-details').hide()
		$('#custom-course-fee-details').hide()
		$('#book-seat-fee-details, #BookEnrollmentSeat').hide()
	}else if(radioId=='dtl-custom'){
		payMode='c_annually';
		$('#annual-course-fee-details').hide()
		$('.installment3-course-fee-details').hide()
		$('#installment5-course-fee-details').hide()
		$('#installment6-course-fee-details').hide()
		$('#installment9-course-fee-details').hide()
		$('#installment12-course-fee-details').hide()
		$('#book-seat-fee-details, #BookEnrollmentSeat').hide()
		$('#custom-course-fee-details').show()
	}else if(radioId=='dtl-registration'){
		payMode='registration';
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
	$('#payMode').attr('data-paymode',payMode);
}

// function cancelPaymentOption(flag) {
// 	if ($("input:radio[name='payModeCheckboxes']").is(":checked")) {

// 	} else {
// 		showMessageTheme2(0, 'Please choose payment option', '', true);
// 		return false;
// 	}
// 	$('#studentPaymentModal').modal('hide');

// 	if (flag) {
// 		window.setTimeout(function () {
// 			callForNextSessionCourseDetails('nextSessionCourseModal', '3');
// 		}, 500);
// 	}
// }

function selectPaymentmentMethod(isBack) {
	if($('#payMode').val()==''){
		$('#payMode').val('annually');
	}
	if ($('#payMode').val().trim() == 'annually') {
		$("#pay-one").trigger('click');
		displayScholorshipDetails('dtl-one');
		if(isBack){
			var extraCourseLength = $("#annually_extra .extra-course-ol li").length;
			for(var i =1;i<=extraCourseLength;i++){
				$("#annually_extra_price .extra-course-price-ul li:nth-child("+i+")").css({"justify-content":"flex-end","height":$("#annually_extra .extra-course-ol li:nth-child("+i+")").css("height"), "display":"flex","align-items":"flex-end"})
			}
			var extraCourseLength = $("#annually_external .external-course-ol li").length;
			for(var j =1;j<=extraCourseLength;j++){
				$("#annually_external_price .external-course-price-ul li:nth-child("+j+")").css({"justify-content":"flex-end","height":$("#annually_external .external-course-ol li:nth-child("+j+")").css("height"), "display":"flex","align-items":"flex-end"})
			}
		}
	} else if ($('#payMode').val().trim() == 'threeMonthly' || $('#payMode').val() == 'sixMonthly') {
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

function validateRequestForPaymentModeSelection() {
	if (($('#standardId').val() >= 11 && $('#standardId').val() <= 17) || $('#standardId').val() == 8) {
		return true;
	}
	var MIN_LIMIT = $('#standardId').attr('min_limit');
	var MAX_LIMIT = $('#standardId').attr('max_limit');
	var upper_band=$('#standardId').attr('upper_band');
	var totalCredit = parseFloat($('#totalCredit').attr('totalCredit'));
	var enrollmentType=$('#enrollmentType').val()
	if(enrollmentType=='REGISTRATION_NEXT_GRADE' 
		|| enrollmentType=='REGISTRATION_REPEAT_GRADE' 
		|| enrollmentType=='REGISTRATION_REGISTER'){
		if (parseFloat(totalCredit) < parseFloat(MIN_LIMIT)) {
			showMessageTheme2(0,'Please select a minimum of ' + MIN_LIMIT + ' credits.','',true);
			return false;
		} else if (parseFloat(totalCredit) > parseFloat(upper_band)) {
			showMessageTheme2(0,'You can select a maximum of ' + upper_band + ' credits.','',true);
			return false;
		}
	}else if(enrollmentType=='REGISTRATION_IMPORVE_GRADES'){
		if(totalCredit==0){
			showMessageTheme2(0,'Please select a minimum of 1.0 credits.','',true);
			return false
		}
	}else if(enrollmentType=='REGISTRATION_COMPLETE_GRADES'){
		if(totalCredit==0){
			showMessageTheme2(0,'Please select a minimum of 1.0 credits.','',true);
			return false
		}
	}
	return true;
}

function validateRequestForPaymentOption(formId) {
	return true;
}

function submitCourse() {
	var flag = validateRequestForPaymentModeSelection();
	if (flag) {
		if(ADVANCE_FEE_PAID || $('#studentPaymentModal').is(':visible')){
			callForReviewAndPaymentSelection('Y');
		}else{
			callForPaymentModeSelection('nextSessionCourseModal','');
			return false;
		}
	}
	return false;
}

function backCourseSelection(pageNumber, changePaymentPlanfalg) {
	if (pageNumber == 1) {
		displaySection1();
	} else if (pageNumber == 2) {
		displaySection2();
		if(changePaymentPlanfalg){
			submitCourse()
		}
	} else if (pageNumber == 3) {
		displaySection3();
	}
}

function displaySection1() {
	$('#divNextSession').show();
	$('#divNextSessionCourseChoose, #divNextSessionCourseWrapper').hide();
	$('#divNextSessionCourseReview').hide();
	$(".btn-finish").hide();
}

function displaySection2() {
	$('#divNextSession').hide();
	$('#divNextSessionCourseChoose, #divNextSessionCourseWrapper').show();
	$('#divNextSessionCourseReview').hide();
	$(".btn-finish").hide();
}

function displaySection3() {
	$('#divNextSession').hide();
	$('#divNextSessionCourseChoose, #divNextSessionCourseWrapper').hide();
	$('#divNextSessionCourseReview').show();
	$(".btn-finish").show();
}

function removeSlideAnimationClass(){
	$(".selected-course-list .course-category .course-item:last-child").removeClass("slide-animation");
} 

function getRequestForPaymentModeSelection(formId,courseId){
	var studentCourseDetailsInfoDTO = {};
	studentCourseDetailsInfoDTO['userId'] = USER_ID;
	studentCourseDetailsInfoDTO['courseId'] = courseId;
	studentCourseDetailsInfoDTO['callFrom'] = 'dashboard';
	if ($("#standardId").length > 0) {
		studentCourseDetailsInfoDTO['standardId'] = $("#standardId").val();
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
	
	if(!validateRequestForPaymentModeSelection()){
		return false;
	}
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : BASE_URL+CONTEXT_PATH+SCHOOL_UUID+'/student/migration/get-payment-details',
		data : JSON.stringify(getRequestForPaymentModeSelection(formId,callFrom)),
		dataType : 'json',
		global : false,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
                if (data['status'] == '3') {
                    redirectLoginPage();
                } else {
					if(data['statusCode']=='ELIGIBLE_ADVANCE_PLAN'){
						choosePaymentOption();
					}else if(data['statusCode']=='ELIGIBLE_CUSTOME_PLAN' || data['statusCode']=='REDIRECT_TO_DASHBOOARD'){
						window.location.reload();
					}else{
						showMessageTheme2(0, data['message'], '', true);
					}
                }
			window.setTimeout(function(){
				$('#studentPaymentModal').modal('hide');
			},1000);
            } else {
			  	showMessageTheme2(1, data['message'], '', true);
				renderPaymentMode();
				showSkeleton(true, "fee-details-modal");
				paymentModalContentWithData(data);
				$(".step-feeDetails-skeleton").hide();
				$(".feeDetailsContentDiv").show();
				$('#payMode').val(data.paymentMode);
				$(".radio-payment-option input:radio[name=payModeCheckboxes]").unbind().bind("change", function(){
					radioBtnChecked();
				});
				selectPaymentmentMethod(true)
			}
		},
		error: function(e){
			if (checkonlineOfflineStatus()) {
				return;
			}
		}
	});
}

function radioBtnChecked() {
	var $radios = $('.payment-item input:radio[name=payModeCheckboxes]:checked');
	$($radios).parent().find("label").addClass("primary-bg");
	$($radios).parent().siblings().find("label").removeClass("primary-bg");
};

$(window).on("load", function(){
	radioBtnChecked()
});

function choosePaymentOption() {
	var flag=true;
	if(SHOW_PAYMENT_OPTION=='Y'){
		if($("#pay-one").prop("checked") == true || $("#pay-three").prop("checked") == true || $("#pay-registration").prop("checked") == true || $("#pay-custom").prop("checked") == true){
			
		} else{
			showMessageTheme2(0,'Please choose payment mode','',true);
			flag=false;
		}
	}
	if(flag){
		$.ajax({
			type : "POST",
			contentType : "application/json",
			url : BASE_URL+CONTEXT_PATH+SCHOOL_UUID+'/student/migration/choose-payment-plan',
			data : JSON.stringify(getRequestForChoosePaymentOption()),
			dataType : 'json',
			global:false,
			success : function(data) {
				if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
					if (data['status'] == '3') {
						$('#studentPaymentModal').modal('hide');
						redirectLoginPage();
					} else {
						if(data['statusCode']=='ELIGIBLE_ADVANCE_PLAN'){
	
						}else if(data['statusCode']=='ELIGIBLE_CUSTOME_PLAN' || data['statusCode']=='REDIRECT_TO_DASHBOOARD'){
							window.location.reload();
						}else{
							showMessageTheme2(0, data['message'], '', true);
						}
					}
				} else {
					// showMessageTheme2(1, 'Courses Updated.', '', true);
					showSkeleton(true, "step4");
					if(SHOW_PAYMENT_OPTION=='Y'){
						$("#studentPaymentModal").modal("hide");
					}
					callForReviewAndPaymentSelection('Y');
					if(SHOW_PAYMENT_OPTION=='Y'){
						showMessageTheme2(1, 'Payment Mode Selected.', '', true);
						hideModalMessage();
					}else{
						showMessageTheme2(1, 'Course Selected.', '', true);
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

function getRequestForChoosePaymentOption(){
	var feePaymentPlanDTO={};
	feePaymentPlanDTO['userId'] = $("#userId").val();
	feePaymentPlanDTO['paymentMode'] = $("#payMode").val();
	return feePaymentPlanDTO;
}

function getRequestForReviewAndPaymentSelection(reloadRequired){
	var studentRequestDTO = {};
	studentRequestDTO['userId'] = USER_ID;
	studentRequestDTO['reloadRequired'] = reloadRequired;
	return studentRequestDTO;
}

function callForReviewAndPaymentSelection(reloadRequired) {
	hideMessage('');
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : BASE_URL+CONTEXT_PATH+SCHOOL_UUID+'/student/migration/get-student-review-details',
		data : JSON.stringify(getRequestForReviewAndPaymentSelection(reloadRequired)),
		dataType : 'json',
		global : false,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
                if (data['status'] == '3') {
                    redirectLoginPage();
                } else {
					if(reloadRequired){
						if(data['statusCode']=='ELIGIBLE_ADVANCE_PLAN'){

						}else if(data['statusCode']=='ELIGIBLE_CUSTOME_PLAN' || data['statusCode']=='REDIRECT_TO_DASHBOOARD'){
							window.location.reload();
						}else{
							showMessageTheme2(0, data['message'], '', true);
							$("#studentPaymentModal").modal("show");
						}
					}
                }
            } else {
				getReviewAndPayRendered(data);
			}
		},
		error: function(e){
			if (checkonlineOfflineStatus()) {
				return;
			}
		}
	});
}
function upgradeCourse(categoryId, fromCourseId, toCourseId, warningMessage){
	$("#upgradeCoruses #upgradeCorusesMessage").html(warningMessage)
	var changeCourseYesFunction='confirmUpgradeCourse('+categoryId+','+fromCourseId+','+toCourseId+')';
	$('#changeCourseYes').attr('onclick',changeCourseYesFunction);
	var changeCourseNoFunction='$("#upgradeCoruses").modal("hide")';
	$('#changeCourseNo').attr('onclick',changeCourseNoFunction);
	if(SHOW_PAYMENT_OPTION=='Y'){
		$("#upgradeCoruses").modal("show");
	}else{
		$('#changeCourseYes').trigger('click');
	}
}

function confirmUpgradeCourse(categoryId, fromCourseId, toCourseId){
	var selectedSubjects = $('#selectedSubjects').val().trim();
	selectedSubjects = selectedSubjects.split(',');
	selectedSubjects = selectedSubjects.filter(subId => parseInt(subId) != parseInt(fromCourseId) );
	selectedSubjects.push(toCourseId);
	selectedSubjects=selectedSubjects.join(',');
	// console.log('selectedSubjects confirmUpgradeCourse '+selectedSubjects);
	$('#selectedSubjects').val(selectedSubjects);
	$("#upgradeCoruses").modal("hide");
	if($(".modal-backdrop").length>0){
		$(".modal-backdrop").remove();
		$("body").removeClass('modal-open');
		$("body").css({"padding-right":"0"})
	}
	$("#controlType").val('add');
	getAllCourseDetails('N',categoryId);
}

function addRecommendedCourse(src){
	var allChecked = true;
	if($(src).prop("checked")){
		$(src).parent().find("span").html('<span>Remove&nbsp;<i class="fa fa-trash"></i></span>');
		$(src).parent().addClass("bg-danger");
		$(src).parent().removeClass("primary-bg");
		if($('.add-recommended-course-not-mandatory:checked').length > 0 ){
			$("#confirmAndAddRecommendedCourse").addClass("bg-success");
			$("#confirmAndAddRecommendedCourse").removeClass("btn-light");
			$("#confirmAndAddRecommendedCourse").attr("disabled",false);
		}
	}else{
		$(src).parent().find("span").html('<span><i class="fa fa-plus"></i>&nbsp;Add</span>');
		$(src).parent().addClass("primary-bg");
		$(src).parent().removeClass("bg-danger");
		if($('.add-recommended-course-not-mandatory:checked').length == 0 ){
			$("#confirmAndAddRecommendedCourse").removeClass("bg-success");
			$("#confirmAndAddRecommendedCourse").addClass("btn-light");
			$("#confirmAndAddRecommendedCourse").attr("disabled",true);
		}
	}
	$('.add-recommended-course-not-mandatory').each(function(){
		if(!$(this).prop('checked')){
			allChecked = false;
		}
	});
	if(allChecked){
		$("#addAllRecommendedCourse").hide();
		$("#reomveAllRecommendedCourse").show();
		$("#confirmAndAddRecommendedCourse").addClass("bg-success");
		$("#confirmAndAddRecommendedCourse").removeClass("btn-light");
	}else{
		$("#reomveAllRecommendedCourse").hide();
		$("#addAllRecommendedCourse").show();
	}
}

function addAllRecommendedCourse(){
	$("#addAllRecommendedCourse").hide();
	$("#reomveAllRecommendedCourse").show();
	$(".add-recommended-course-not-mandatory").prop('checked', true);
	$(".add-recommended-course-not-mandatory").parent().find("span").html('<span>Remove&nbsp;<i class="fa fa-trash"></i></span>');
	$(".add-recommended-course-not-mandatory").parent().addClass("bg-danger");
	$(".add-recommended-course-not-mandatory").parent().removeClass("primary-bg");
	$("#confirmAndAddRecommendedCourse").attr("disabled",false);
	$("#confirmAndAddRecommendedCourse").addClass("bg-success");
	$("#confirmAndAddRecommendedCourse").removeClass("btn-light");
}
function reomveAllRecommendedCourse(){
	$("#reomveAllRecommendedCourse").hide();
	$("#addAllRecommendedCourse").show();
	$(".add-recommended-course-not-mandatory").prop('checked', false);
	$(".add-recommended-course-not-mandatory").parent().find("span").html('<span><i class="fa fa-plus"></i>&nbsp;Add</span>');
	$(".add-recommended-course-not-mandatory").parent().addClass("primary-bg");
	$(".add-recommended-course-not-mandatory").parent().removeClass("bg-danger");
	if($(".add-recommended-course-mandatory").length <1){
		$("#confirmAndAddRecommendedCourse").attr("disabled",true);
		$("#confirmAndAddRecommendedCourse").removeClass("bg-success");
		$("#confirmAndAddRecommendedCourse").addClass("btn-light");
	}
	
	
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
	// $("#commonloaderId, #commonloaderBody").show();
	customLoader(true);
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : BASE_URL+CONTEXT_PATH+SCHOOL_UUID+'/student/recommended-courses',
		data : JSON.stringify(getRequestForReviewAndPaymentSelection('')),
		dataType : 'json',
		async : true,
		global : false,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
                if (data['status'] == '3') {
                    redirectLoginPage();
                } else {
				// if(reloadRequired){
				// 	if(data['statusCode']=='ELIGIBLE_ADVANCE_PLAN'){

				// 	}else if(data['statusCode']=='ELIGIBLE_CUSTOME_PLAN' || data['statusCode']=='REDIRECT_TO_DASHBOOARD'){
				// 		window.location.reload();
				// 	}else{
				// 		showMessageTheme2(0, data['message'], '', true);
				// 	}
				// }
                }
            } else {
				// $(".step-4-skeleton").html('');
				renderCustomizedCourse(data)
			}
			customLoader(false);
			// $("#commonloaderId, #commonloaderBody").hide();
		},
		error: function(e){
			if (checkonlineOfflineStatus()) {
				return;
			}
		}
	});
}
function chooseRecomendedCourse() {
	$('#selectedSubjects').val(confirmAndAddRecommendedCourse());
	$("#recommendedCourseModal").modal("hide");
	$("#controlType").val('add');
	getAllCourseDetails('N', '');
	apCourseSelectionFlag = false;
}

function callForProgressionToDashboard() {
	var flag=false;
	hideModalMessage('');
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : BASE_URL+CONTEXT_PATH+SCHOOL_UUID+'/student/proceed-to-dashboard',
		data : JSON.stringify(getRequestForProgressionToDashboard()),
		dataType : 'json',
		async : false,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
                if (data['status'] == '3') {
                    redirectLoginPage();
                } else {
					// if(reloadRequired){
						if(data['statusCode']=='ELIGIBLE_ADVANCE_PLAN'){

						}else if(data['statusCode']=='ELIGIBLE_CUSTOME_PLAN' || data['statusCode']=='REDIRECT_TO_DASHBOOARD'){
							window.location.reload();
						}else{
							showMessageTheme2(0, data['message'], '', true);
						}
					// }
                }
            } else {
				goAhead(data.redirectUrl, '');
			}
		}
	});
	return flag;
}

function getRequestForProgressionToDashboard(){
	var proceedToDashboardRequest = {};
	proceedToDashboardRequest['userId'] = USER_ID;
	return proceedToDashboardRequest;
}

function callForApplicationSubmit() {
	var flag = false;
	hideModalMessage('');
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url : BASE_URL + CONTEXT_PATH + SCHOOL_UUID +'/student/migration/submit-application',
		data: JSON.stringify(getRequestForApplicationSubmit()),
		dataType: 'json',
		async: false,
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if (data['status'] == '3') {
					redirectLoginPage();
				} else {
					showMessageTheme2(0, data['message'], '', true);
				}
			} else {
				applicationSubmittedModal(data.details.contactEmail);
			}
		}
	});
	return flag;
}

function getRequestForApplicationSubmit() {
	var applicationSubmitRequest = {};
	applicationSubmitRequest['userId'] = USER_ID;
	return applicationSubmitRequest;
}

function applicationSubmittedModal(contactEmail){
	$('#submitApplicationMsg').html('Your enrollment application is under review. For any further queries, reach out to <a class="priamry-txt-color" href="mailto:'+contactEmail+'">'+contactEmail+'</a>');
	$('#goToDashboardWarningMessage').modal({ backdrop: 'static', keyboard: false })
	$('#submitApplicationWarning').modal("hide");
}