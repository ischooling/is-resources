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
		showMessage(2, 'Please select a course then click on the add button.');
		return false;
	}
	var creditLimitWarning=false;
	var creditsLimitsOver=false;
	// var creditsLimitsOver=creditLimitOver(standardId, totalCredit);
	if(flagType == 'add'){
		if(parseFloat($('#totalCreditInput').val())>=parseFloat($('#standardId').attr('upper_band'))){
			showMessage(2, 'You can select a maximum of '+$('#standardId').attr('upper_band')+' credits.');
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
		showMessage(2, 'Please select a course then click on the add button.');
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

function showPaymentTermCondMode() {
	hideModalMessage('');
	if(SHOW_PAYMENT_OPTION=='Y'){
		callLocationForPayment();
		if ($("#payMode").val() == 'registration') {
			if ($('#bookAnEnrollmentTNC').length > 0) {
				$('#courseFeeModalTNC').modal('hide');
				$('#bookAnEnrollmentTNC').modal('show');
			} else {
				showMessage(0, 'No payment gateway enabled, please contact administrator!');
			}
		} else {
			if ($('#callPaymentStudentModal').length > 0) {
				$('#callPaymentStudentModal').modal({ backdrop: 'static', keyboard: false })
			} else {
				showMessage(0, 'No payment gateway enabled, please contact administrator!');
			}
		}
	} else {
		
		$('#submitApplicationWarning').modal({ backdrop: 'static', keyboard: false })
		$('#goToDashboardWarningMessage').hide();
	}
}

function getAllCourseDetails(isGradeChange, courseId) {
	$("#commonloaderId").show();
	var standardId = $("#standardId").val();
	if (isGradeChange == 'Y') {
		$('#selectedSubjects').val('');
	}
	if (standardId == '' || standardId == 0) {
		$('#courseSubjectDetails').html('')
	}
	
	//$("#addAndRemoveLoader").css({ "display": "block" });
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: BASE_URL + CONTEXT_PATH + SCHOOL_UUID +'/student/enrollment/course-details-by-standard-id',
		data: JSON.stringify(getRequestForCourseSelection(courseId)),
		dataType: 'json',
		async: true,
		global: false,
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if (data['status'] == '3') {
					redirectLoginPage();
				} else {
					if (data['statusCode'] == 'ELIGIBLE_CUSTOME_PLAN' || data['statusCode'] == 'REDIRECT_TO_DASHBOOARD') {
						window.location.reload();
					} else {
						showMessage(false, data['message']);
					}
				}
			} else {
				$("#creditsLimitsModal, #creditsLimitsOverModal").modal("hide");
				showMessage(true, data['message']);
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
				if($('#learingProgramHeader').attr('val')=='ONE_TO_ONE_FLEX' ){
					var dob=$('#dob').val();
					$('#applyStandardId').val($('#gradeId').val()).trigger('change');
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
	var standardId=$('#standardId').val();
	var totalCredit=$('#totalCreditInput').val();
	var creditsLimitsOver=creditLimitOver(standardId, totalCredit);
	if(creditsLimitsOver){
		$("#oneTimeModal").val(true);
	}else{
		$("#oneTimeModal").val(false);
	}
	$('#creditsLimitsModal').modal('hide');
	$('#creditsLimitsOverModal').modal('show');
}

function getRequestForCourseSelection(courseId) {
	var studentCourseDetailsInfoDTO = {};
	studentCourseDetailsInfoDTO['userId'] = USER_ID;
	studentCourseDetailsInfoDTO['courseId'] = courseId;
	studentCourseDetailsInfoDTO['callFrom'] = 'signup';
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
			showMessage(0, 'Please choose payment mode');
			flag=false;
		}
	}
	if(flag){
		$.ajax({
			type: "POST",
			contentType: "application/json",
			url: BASE_URL + CONTEXT_PATH + SCHOOL_UUID +'/student/enrollment/choose-payment-plan',
			data: JSON.stringify(getRequestForChoosePaymentOption()),
			dataType: 'json',
			global: false,
			success: function (data) {
				if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
					if (data['status'] == '3') {
						redirectLoginPage();
					} else {
						if (data['statusCode'] == 'ELIGIBLE_CUSTOME_PLAN' || data['statusCode'] == 'REDIRECT_TO_DASHBOOARD') {
							window.location.reload();
						} else {
							showMessage(false, data['message']);
							//setActiveStep(3);
						}
					}
				} else {
					if(SHOW_PAYMENT_OPTION=='Y'){
						$("#studentPaymentModal").modal("hide");
					}
					setActiveStep(4);
					callForReviewAndPaymentSelection('Y');
					if(SHOW_PAYMENT_OPTION=='Y'){
						showMessage(1, 'Payment Mode Selected.');
						hideModalMessage();
					}else{
						showMessage(1, 'Course Selected.');
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
		contentType: "application/json",
		url: BASE_URL + CONTEXT_PATH + SCHOOL_UUID +'/student/proceed-to-dashboard',
		data: JSON.stringify(getRequestForProgressionToDashboard()),
		dataType: 'json',
		async: false,
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if (data['status'] == '3') {
					redirectLoginPage();
				} else {
					if (reloadRequired) {
						if (data['statusCode'] == 'ELIGIBLE_ADVANCE_PLAN') {

						} else if (data['statusCode'] == 'ELIGIBLE_CUSTOME_PLAN' || data['statusCode'] == 'REDIRECT_TO_DASHBOOARD') {
							window.location.reload();
						} else {
							showMessage(false, data['message']);
						}
					}
				}
			} else {
				goAhead(data.redirectUrl, '');
			}
		}
	});
	return flag;
}

function getRequestForProgressionToDashboard() {
	var proceedToDashboardRequest = {};
	proceedToDashboardRequest['userId'] = USER_ID;
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
	if (($('#standardId').val() >= 11 && $('#standardId').val() <= 17) || $('#standardId').val() == 8) {
		return true;
	}
	var MIN_LIMIT = $('#standardId').attr('min_limit');
	var MAX_LIMIT = $('#standardId').attr('max_limit');
	var upper_band=$('#standardId').attr('upper_band');
	var totalCredit = parseFloat($('#totalCredit').attr('totalCredit'));
	if (parseFloat(totalCredit) < parseFloat(MIN_LIMIT)) {
		showMessage(0, 'Please select a minimum of ' + MIN_LIMIT + ' credits.');
		return false;
	} else if (parseFloat(totalCredit) > parseFloat(upper_band)) {
		showMessage(0, 'You can select a maximum of ' + upper_band + ' credits.');
		return false;
	}
	return true;
}

function getRequestForPaymentModeSelection(formId, courseId) {
	var studentCourseDetailsInfoDTO = {};
	studentCourseDetailsInfoDTO['userId'] = USER_ID;
	studentCourseDetailsInfoDTO['courseId'] = courseId;
	studentCourseDetailsInfoDTO['callFrom'] = 'signup';
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
	if (!validateRequestForPaymentModeSelection(formId, callFrom)) {
		return false;
	}
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: BASE_URL + CONTEXT_PATH + SCHOOL_UUID +'/student/enrollment/get-payment-details',
		data: JSON.stringify(getRequestForPaymentModeSelection(formId, callFrom)),
		dataType: 'json',
		async: true,
		global: false,
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if (data['status'] == '3') {
					redirectLoginPage();
				} else {
					if (data['statusCode'] == 'ELIGIBLE_CUSTOME_PLAN' || data['statusCode'] == 'REDIRECT_TO_DASHBOOARD') {
						window.location.reload();
					} else {
						showMessage(false, data['message']);
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
	studentRequestDTO['userId'] = USER_ID;
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
		contentType: "application/json",
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
							showMessage(false, data['message']);
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
			contentType: "application/json",
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
		contentType: "application/json",
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
					// 		showMessage(false, data['message']);
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
        contentType: "application/json",
        data: JSON.stringify(requestBody),
        success: function (response) {
            const data = JSON.parse(response);
            modalContent.html(`
                <p>${data.data.OVERVIEW || "No overview available."}</p>
            `);
        },
        error: function (error) {
            console.error("Error fetching course details:", error);
        },
    });
	return false;
}

function closeCourseDetailModal(){
	$("#courseDetailModal").modal('hide');
}

function callForApplicationSubmit() {
	var flag = false;
	hideModalMessage('');
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: BASE_URL + CONTEXT_PATH + SCHOOL_UUID +'/student/submit-application',
		data: JSON.stringify(getRequestForApplicationSubmit()),
		dataType: 'json',
		async: false,
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if (data['status'] == '3') {
					redirectLoginPage();
				} else {
					showMessage(false, data['message']);
				}
			} else {
				showMessage(true, 'Thank you! Your application has been successfully submitted');
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


function switchGrade(){
	var standardId = $('#gradeId').val();
	if($('#standardId').val().trim()==standardId){
		$('#standardId').val(standardId);
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
	$("#standardId").val($("#gradeId").val())
	$('#gradeChangeWarning').modal('hide');
	$("#selectedSubjects").val("");
	$("#controlType").val("remove");
	getAllCourseDetails('Y', '')
}

function switchGradeNo(standardId){
	$('#gradeChangeWarning').modal('hide');
	$("#gradeId").val($("#standardId").val()).trigger("change");
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