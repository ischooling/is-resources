console.log('nextSession')
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
		contentType: APPLICATION_JSON_VALUE,
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
				$('#registrationType').val(data.registrationType);
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
	studentCourseDetailsInfoDTO['requestFromMigration']='Y';
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
	$(".payment-option-modal-title").text('Payment Option Available');
	$(".thank_trusting").show();
	var payMode='annually';
	if(radioId=='dtl-one'){
		payMode='annually';
		$('#annual-course-fee-details, .annual-course-fee-details').show()
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
		$('#annual-course-fee-details, .annual-course-fee-details').hide()
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
		$('#annual-course-fee-details, .annual-course-fee-details').hide()
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
		$('#annual-course-fee-details, .annual-course-fee-details').hide()
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
		$('#annual-course-fee-details, .annual-course-fee-details').hide()
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
		$('#annual-course-fee-details, .annual-course-fee-details').hide()
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
		$('#annual-course-fee-details, .annual-course-fee-details').hide()
		$('.installment3-course-fee-details').hide()
		$('#installment5-course-fee-details').hide()
		$('#installment6-course-fee-details').hide()
		$('#installment9-course-fee-details').hide()
		$('#installment12-course-fee-details').hide()
		$('#book-seat-fee-details, #BookEnrollmentSeat').hide()
		$('#custom-course-fee-details').show()
	}else if(radioId=='dtl-registration'){
		payMode='registration';
		$('#annual-course-fee-details, .annual-course-fee-details').hide()
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

async function submitCourse(partnerEnrollmentFlag, enrollmentType) {
	if(enrollmentType == "REGISTRATION_REPEAT_GRADE"){
		if(MIGRATION_DATA.registrationType == "ONE_TO_ONE" || MIGRATION_DATA.registrationType == "BATCH" || MIGRATION_DATA.registrationType == "SCHOLARSHIP" || MIGRATION_DATA.registrationType == "SSP"){
			// $("#selectedSubjects").val(MIGRATION_DATA.migrationOptionsForImproveGrade[0].selectedSubjects);
			$("#selectedSubjects").attr("data-entiresubject",MIGRATION_DATA.migrationOptionsForImproveGrade[0].selectedSubjects);
			$("#totalCreditInput").val($("#selectedSubjects").val().split(",").length);
			$('#totalCredit').attr('totalCredit',$("#totalCreditInput").val());
		}
	}else {
		if(TAKE_INDIVIDUAL_COURSE && $("#selectedSubjects").attr("data-individual") != $("#selectedSubjects").val()){
			$("#selectedSubjects").attr("data-individual",$("#selectedSubjects").val());
		}
	}
	
	if(enrollmentType ==  undefined || enrollmentType == null){
		//alert("optimize function");
	}else{
		$("#enrollmentType").val(enrollmentType);
	}
	var flag = validateRequestForPaymentModeSelection();
	if (flag) {
		if(GRADE_FEE_DONE){
			//callForReviewAndPaymentSelection('Y');
			choosePaymentOption(partnerEnrollmentFlag);
		}else{
			if(ADVANCE_FEE_PAID || $('#studentPaymentModal').is(':visible') ){
				callForReviewAndPaymentSelection('Y');
			}else if(partnerEnrollmentFlag == "P" || SHOW_PAYMENT_OPTION == 'N'){
				choosePaymentOption(partnerEnrollmentFlag);
				// callForReviewAndPaymentSelection('Y', partnerEnrollmentFlag);
			}else{
				callForPaymentModeSelection('nextSessionCourseModal','');
				return false;
			}
		}
		
	}
	return false;
}

function backCourseSelection(pageNumber, changePaymentPlanfalg) {
	if (pageNumber == 1) {
		TAKE_INDIVIDUAL_COURSE=false;
		displaySection2();
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
	$("#studentPaymentModal").modal("hide");
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
	studentCourseDetailsInfoDTO['enrollmentType'] = $("#enrollmentType").val();
	studentCourseDetailsInfoDTO['registrationType'] = $("#registrationType").val();
	studentCourseDetailsInfoDTO['requestFromMigration']='Y';
	return studentCourseDetailsInfoDTO;
}

function callForPaymentModeSelection(formId, callFrom) {
	hideMessage('');
	
	if(!validateRequestForPaymentModeSelection()){
		return false;
	}
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : BASE_URL+CONTEXT_PATH+SCHOOL_UUID+'/student/migration/get-payment-details',
		data : JSON.stringify(getRequestForPaymentModeSelection(formId,callFrom)),
		dataType : 'json',
		success : async function(data) {
			
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
                if (data['status'] == '3') {
                    redirectLoginPage();
                } else {
					if(data['statusCode']=='ELIGIBLE_ADVANCE_PLAN'){
						choosePaymentOption();
					}else if(data['statusCode']=='ELIGIBLE_CUSTOME_PLAN' || data['statusCode']=='REDIRECT_TO_DASHBOOARD'){
						showMessageTheme2(0, data['message'], '', true);
						window.setTimeout(function(){window.location.reload();},2000);
						
					}else{
						showMessageTheme2(0, data['message'], '', true);
					}
                }
			window.setTimeout(function(){
				$('#studentPaymentModal').modal('hide');
			},1000);
            } else {
				if(GRADE_FEE_DONE){
					showMessageTheme2(1, data['message'], '', true);
				}
				await renderPaymentMode(data);
				showSkeleton(true, "fee-details-modal");
				await paymentModalContentWithData(data);
				$(".step-feeDetails-skeleton").hide();
				$(".feeDetailsContentDiv").show();
				$('#payMode').val(data.paymentMode);
				selectPaymentmentMethod();
				$(".radio-payment-option input:radio[name=payModeCheckboxes]").unbind().bind("change", function(){
					radioBtnChecked();
				});
				// selectPaymentmentMethod(true)
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
	$($radios).parent().find("label").addClass("bg-light-primary primary-border-color");
	$($radios).parent().siblings().find("label").removeClass("bg-light-primary primary-border-color");
	$($radios).parent().find(".checkbox-border").addClass("primary-border-color");
	$($radios).parent().find(".check").addClass("bg-primary");
	$(".amount").removeClass("text-primary");
	$('.payment-item input:radio[name=payModeCheckboxes]:not(:checked)').parent().find(".checkbox-border").removeClass("primary-border-color");
	// $($radios).parent().find(".amount").addClass("text-primary");
};

$(window).on("load", function(){
	radioBtnChecked()
});


function choosePaymentOption(partnerEnrollmentFlag) {
	console.log('choosePaymentOption');
	var flag=true;
	if(SHOW_PAYMENT_OPTION=='Y'){
		if($("#pay-one").length>0 || $("#pay-three").length>0 || $("#pay-registration").length>0 || $("#pay-custom").length>0){
			if($("#pay-one").prop("checked") == true || $("#pay-three").prop("checked") == true || $("#pay-registration").prop("checked") == true || $("#pay-custom").prop("checked") == true){
				
			} else{
				showMessageTheme2(0,'Please choose payment mode','',true);
				flag=false;
			}
		}
	}
	if(flag){
		$.ajax({
			type : "POST",
			contentType : APPLICATION_JSON_VALUE,
			url : BASE_URL+CONTEXT_PATH+SCHOOL_UUID+'/student/migration/choose-payment-plan',
			data : JSON.stringify(getRequestForChoosePaymentOption()),
			dataType : 'json',
			// global:false,
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
					if(GRADE_FEE_DONE){
						// showMessageTheme2(1, 'Courses Updated.', '', true);
						showSkeleton(true, "step4");
						if(SHOW_PAYMENT_OPTION=='Y'){
							$("#studentPaymentModal").modal("hide");
						}
						callForReviewAndPaymentSelection('Y', partnerEnrollmentFlag);
						if(SHOW_PAYMENT_OPTION=='Y'){
							showMessageTheme2(1, 'Payment Mode Selected.', '', true);
							hideModalMessage();
						}else{
							showMessageTheme2(1, 'Course Selected.', '', true);
						}
					}else{
						if(TAKE_INDIVIDUAL_COURSE){
							callForReviewAndPaymentSelection('Y', partnerEnrollmentFlag);
						}else{
							checkPayment("", data.userPaymentDetailsId, SCHOOL_ID);
							// getPaymentGatewaysOptions(SCHOOL_ID, SCHOOL_ID, data.userPaymentDetailsId, 'USER', USER_ID, USER_ID);
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

function getRequestForChoosePaymentOption(){
	var feePaymentPlanDTO={};
	feePaymentPlanDTO['userId'] = $("#userId").val();
	feePaymentPlanDTO['paymentMode'] = $("#payMode").val();
	feePaymentPlanDTO['requestFromMigration']='Y';
	return feePaymentPlanDTO;
}

function getRequestForReviewAndPaymentSelection(reloadRequired){
	var studentRequestDTO = {};
	studentRequestDTO['userId'] = USER_ID;
	studentRequestDTO['reloadRequired'] = reloadRequired;
	studentRequestDTO['requestFromMigration'] = 'Y';
	return studentRequestDTO;
}


function callForReviewAndPaymentSelection(reloadRequired, partnerEnrollmentFlag, signupType) {
	customLoader(true)
	hideMessage('');
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : BASE_URL+CONTEXT_PATH+SCHOOL_UUID+'/student/migration/get-student-review-details',
		data : JSON.stringify(getRequestForReviewAndPaymentSelection(reloadRequired)),
		dataType : 'json',
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
				getReviewAndPayRendered(data, partnerEnrollmentFlag, signupType);
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
		contentType : APPLICATION_JSON_VALUE,
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
		contentType : APPLICATION_JSON_VALUE,
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
	$('#goToDashboardWarningMessage').modal({ backdrop: 'static', keyboard: false });
	$('#submitApplicationWarning').modal("hide");
}

async function showPaymentModal() {
	hideModalMessage('');
	if($('#signupType').val() == 'Online' ){
		if(SHOW_PAYMENT_OPTION=='Y'){
			await callLocationForPaymentPromise();
			// if ($("#payMode").val() == 'registration') {
			// 	// $('#courseFeeModalTNC').modal('hide');
			// 	// $('#bookAnEnrollmentTNC').modal('show');
			// 	// $("#bookAnEnrollmentTNC .modal-dialog").css({"transform":"translateY(-45%)"})
			// 	var schoolId = $('.payabledetails').attr('schoolId');
			// 	var userPaymentDetailsId = $('.payabledetails').attr('userPaymentDetailsId');
			// 	checkPayment("", userPaymentDetailsId, schoolId);
			// } else {
				var schoolId = $('.payabledetails').attr('schoolId');
				var userPaymentDetailsId = $('.payabledetails').attr('userPaymentDetailsId');
				var entityType = $('.payabledetails').attr('entityType');
				var entityId = $('.payabledetails').attr('entityId');
				var paidByUserId = $('.payabledetails').attr('paidByUserId');
				getPaymentGatewaysOptions(schoolId, schoolId, userPaymentDetailsId, entityType, entityId, paidByUserId);
			// }
		} else {
			$('#submitApplicationWarning').modal({ backdrop: 'static', keyboard: false })
			$('#goToDashboardWarningMessage').hide();
		}
	}else{
		$('#submitApplicationWarning').modal({ backdrop: 'static', keyboard: false })
		$('#goToDashboardWarningMessage').hide();
	}
}
function logoutConfimation(flag, url){
	if(flag){
		window.location.href = url;
	}else{
		$("#logoutSignupModal").modal("hide");
	}
}

var RE_ENROLLMENT_TIMER=false;
// function reEnrollmentCountdown(data, onUpdate, onExpire) {
// 	const targetTime = new Date(data.progressionDiscountDueDate + " 23:59:00").getTime();
// 	//convertDatetimeWithFormat(obj.start, obj.timezone, USER_TIMEZONE, DATE_UTC+'T'+TIME_UTC)
// 	var reEnrollmentCountdownInterval = setInterval(function () {
// 		var currentTime = new Date().getTime();
		
// 		var distance = targetTime - currentTime;

// 		if (distance <= 0) {
// 			clearInterval(reEnrollmentCountdownInterval);
// 			onUpdate({days: "00",hours: "00",minutes: "00",seconds: "00",});
// 			if(onExpire) {
// 				onExpire();
// 			}
// 			return;
// 		}
// 		else{
// 			if($("#reEnrollmentDiscountWrapper").length>0){
// 				if(!RE_ENROLLMENT_TIMER){
// 					// $($("#reEnrollmentDiscountWrapper")).html(
// 					// 	`<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-success text-center font-18"><span class="">Re-Enrollment</span> <b>Discount of ${schoolSettingsTechnical.currencySymbol}${data.progressionDiscount}</b> <span class="">Available for a Limited Time Only</span></div>
// 					// 	<div class="w-100 text-center font-weight-semi-bold mt-2 mb-1">Valid Till Date: ${changeDateFormat(new Date(data.progressionDiscountDueDate), DISPLAY_DATE_FORMATTER)}</div>
// 					// 	<div id="reEnrollmentCountdown" class="w-100 mb-2"></div>`
// 					// );
// 					$("#reEnrollmentDiscountWrapper").removeClass("opacity-0");
// 					RE_ENROLLMENT_TIMER=true;
// 				}else{
// 					$("#reEnrollmentDiscountWrapper").removeClass("opacity-0");
// 				}
// 			}
// 		}

// 		var days = Math.floor(distance / (1000 * 60 * 60 * 24));
// 		var hours = Math.floor(
// 			(distance % (1000 * 60 * 60 * 24)) /
// 			(1000 * 60 * 60)
// 		);
// 		var minutes = Math.floor(
// 			(distance % (1000 * 60 * 60)) /
// 			(1000 * 60)
// 		);
// 		var seconds = Math.floor(
// 			(distance % (1000 * 60)) / 1000
// 		);
// 		onUpdate(
// 			{
// 				days: String(days).padStart(2, "0"),
// 				hours: String(hours).padStart(2, "0"),
// 				minutes: String(minutes).padStart(2, "0"),
// 				seconds: String(seconds).padStart(2, "0"),
// 			}
// 		);

// 	}, 1000);
// 	return function () {
// 	clearInterval(reEnrollmentCountdownInterval);
// 	};
// }
var reEnrollmentCountdownInterval;
function reEnrollmentCountdown(data, onUpdate, onExpire) {

    // Example:
    // USER_TIMEZONE = "Asia/Amman"

    const USER_TIMEZONE = window.USER_TIMEZONE || "UTC";

    // Convert target date into user timezone
    const targetDateString = `${data.progressionDiscountDueDate} 23:59:59`;

    const targetTime = new Date(targetDateString).getTime();

    reEnrollmentCountdownInterval = setInterval(function () {

        // Current time according to user timezone
        const currentTime = new Date(
            new Date().toLocaleString("en-US", {
                timeZone: USER_TIMEZONE
            })
        ).getTime();

        var distance = targetTime - currentTime;

        if (distance <= 0) {

            clearInterval(reEnrollmentCountdownInterval);

            onUpdate({
                days: "00",
                hours: "00",
                minutes: "00",
                seconds: "00",
            });

            if (onExpire) {
                onExpire();
            }

            return;

        } else {

            if ($("#reEnrollmentDiscountWrapper").length > 0) {

                if (!RE_ENROLLMENT_TIMER) {

                    $("#reEnrollmentDiscountWrapper").removeClass("opacity-0");

                    RE_ENROLLMENT_TIMER = true;

                } else {

                    $("#reEnrollmentDiscountWrapper").removeClass("opacity-0");

                }
            }
        }

        var days = Math.floor(distance / (1000 * 60 * 60 * 24));

        var hours = Math.floor(
            (distance % (1000 * 60 * 60 * 24)) /
            (1000 * 60 * 60)
        );

        var minutes = Math.floor(
            (distance % (1000 * 60 * 60)) /
            (1000 * 60)
        );

        var seconds = Math.floor(
            (distance % (1000 * 60)) / 1000
        );

        onUpdate({
            days: String(days).padStart(2, "0"),
            hours: String(hours).padStart(2, "0"),
            minutes: String(minutes).padStart(2, "0"),
            seconds: String(seconds).padStart(2, "0"),
        });

    }, 1000);

    return function () {
        clearInterval(reEnrollmentCountdownInterval);
    };
}

function getMigrationCountdownWapper(data){
	PROGRESSION_DISCOUNT =data.progressionDiscount;
	var html=``;
	if(data.progressionDiscount > 0){
		html+=
		`${/*
			
		*/''}
		<div class="container text-center mt-3">
			<div class="d-inline-block text-white rounded-10 p-2 shadow scale-animate" style="background: #33AB57;background:linear-gradient(90deg,rgba(51, 171, 87, 1) 0%, rgba(70, 182, 76, 1) 50%, rgba(89, 193, 65, 1) 100%);">
				<div class="border btn-dashed border-light rounded py-3 px-4">
					<h6 class="font-weight-semi-bold mb-0">
						RE-ENROLL NOW &amp; SAVE
					</h6>
					<h4 class="font-weight-bold mb-0">
						${(schoolSettingsTechnical.currencySymbol == "$" ? "USD ":"")}${data.progressionDiscount}
					</h4>
				</div>
			</div>
		</div>
		<div class="w-100 opacity-0" id="reEnrollmentDiscountWrapper">
			${/*<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-success text-center font-18"><b>Re-Enrollment Discount of ${schoolSettingsTechnical.currencySymbol}${data.progressionDiscount} Available for a Limited Time Only </b></div>*/''}
			<div class="w-100 text-center font-weight-bold mt-4 mb-1 text-dark font-16">⏱️ Offer Ends on: <span class="text-danger font-weight-bold">${changeDateFormat(new Date(data.progressionDiscountDueDate), DISPLAY_DATE_ONLY)}</span></div>
			<div id="reEnrollmentCountdown" class="w-100 mb-2"></div>
		</div>
		`;
	}
	
	return html;
}
