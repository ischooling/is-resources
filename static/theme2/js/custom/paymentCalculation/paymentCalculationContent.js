function notEligibleForRequest(userId, schoolWebsite, logoUrl, copyrightYear, copyrightUrl) {
var html=
	'<div class="app-container app-theme-white body-tabs-shadow fixed-header fixed-sidebar">'
	+'<div class="sticky-header">'
		+'<div class="app-header header-shadow">'
		+'<div class="app-header__logo" style="order:0">'
			+'<a href="' + schoolWebsite + '" target="blank"	class="logo-src" style="background:url(' + logoUrl + SCRIPT_VERSION + ');"></a>'
			+'</div>'
			+'<div style="align-items: center;display: flex; margin-left: auto;padding-right:20px;">'
				+'<a href="' + CONTEXT_PATH + SCHOOL_UUID + '/common/logout/' + UNIQUEUUID + '?from=dashboard" class="btn-pill btn-shadow btn-shine btn btn-primary">Log out</a>'
			+'</div>'
		+'</div>'
	+'</div>'
	+'<div class="app-main pt-0 pb-0 mt-5" id="studentDetailsId" userid="'+userId+'">'
		+'<div class="col p-0 mt-2">'
			+'<div class="app-main__inner p-1">';
			if (MAINTENANCEDOWNTIME != '') {
				html +=
				'<div class="marquee">'
				+ '<marquee id="marqueeDiv" direction="left" style="color: red" width="100%">' + MAINTENANCEDOWNTIME + '</marquee>'
				+ '</div>';
			}
			html+='<div class="">'
					+'<div class="col-lg-12 col-md-12 col-sm-12 col-12 p-1 mt-4">'
						+'<div class="main-card card " style="overflow-x:hidden">'
							+'<div class="card-body p-1">'
								+'<div id="notEligible" class="" style="display:block;">'
									+'<div class="full mb-1">'
										+'<h4 class="font-weight-semi-bold text-primary studentDetails">Student is not eligible for customization</h4>'
									+'</div>'
								+'</div>'
								+'<hr class="my-2">'
							+'</div>'
						+'</div>'
					+'</div>'
				+'</div>'
			+'</div>'
		+'</div>'
	+'</div>'
	+'<div class="app-wrapper-footer">'
		+'<div class="app-footer">'
		+'<div class="app-footer__inner">'
		+ '<p style="margin: 0">' + copyrightYear + ' © ' + copyrightUrl + '</p>'
		+'</div>'
		+'</div>'
	+'</div>'
+'</div>';
$('body').append(html);
}

function renderCustomPayment(userId, studentStandardId, schoolWebsite, logoUrl, copyrightYear, copyrightUrl) {
	$('body').append(customPaymentContent(userId, studentStandardId, schoolWebsite, logoUrl, copyrightYear, copyrightUrl));
	var startDate = new Date();
	var endDate = new Date();
	startDate.setDate(endDate.getDate() - 30);
	endDate.setDate(endDate.getDate() + 180);
	$(".dataPicker").datepicker({
		startDate: startDate,
		endDate: endDate,
		format: 'M d, yyyy',
		autoclose: true,
		todayHighlight: true
	}).on('changeDate', function (selected) {
		generateSchedule();
	});
	getPaymentDetails();
}

function customPaymentContent(userId, studentStandardId, schoolWebsite, logoUrl, copyrightYear, copyrightUrl) {
	var html =
		'<div class="app-container app-theme-white body-tabs-shadow fixed-header fixed-sidebar">'
		+ '<div class="sticky-header">'
		+ '<div class="app-header header-shadow">'
		+ '<div class="app-header__logo" style="order:0">'
		+ '<a href="' + schoolWebsite + '" target="blank"	class="logo-src" style="background:url(' + logoUrl + SCRIPT_VERSION + ');"></a>'
		+ '</div>'
		+ '<div style="align-items: center;display: flex; margin-left: auto;padding-right:20px;">'
		+ '<a href="' + CONTEXT_PATH + SCHOOL_UUID + '/common/logout/' + UNIQUEUUID + '?from=dashboard" class="btn-pill btn-shadow btn-shine btn btn-primary">Log out</a>'
		+ '</div>'
		+ '</div>'
		+ '</div>'
		+ '<div class="app-main pt-0 pb-0 mt-5" id="studentDetailsId" userId="' + userId + '" studentStandardId="' + studentStandardId + '">'
		+ '<div class="col p-0 mt-2">'
		+ '<div class="app-main__inner p-1">';
	if (MAINTENANCEDOWNTIME != '') {
		html +=
			'<div class="marquee">'
			+ '<marquee id="marqueeDiv" direction="left" style="color: red" width="100%">' + MAINTENANCEDOWNTIME + '</marquee>'
			+ '</div>';
	}
	html +=
		'<div class="">'
		+ '<div class="col-lg-12 col-md-12 col-sm-12 col-12 p-1 mt-4">'
		+ '<div class="main-card card " style="overflow-x:hidden">'
		+ '<div class="card-body p-1">'
		+ '<div id="notEligible" class="" style="display:none;">'
		+ '<div class="full mb-1">'
		+ '<h4 class="font-weight-semi-bold text-primary studentDetails">N/A</h4>'
		+ '</div>'
		+ '</div>'
		+ '<div id="eligible" style="display:none;">'
		+ '<div class="full mb-1">'
		+ '<h6 class="font-weight-semi-bold text-primary studentDetails mb-1">N/A</h6>'
		+ '</div>'
		+ '<div class="row" style="background:#f6f6f6">'
		+ '<div class="col-lg-6 col-md-6 col-sm-12 col-12">'
		+ '<table id="selectedCourses" class="table table-striped table-bordered dt-responsive nowrap courseSelectedTable" style="width:100%">'
		+ '<thead></thead><tbody></tbody>'
		+ '</table>'
		+ '</div>'
		+ '<div class="col-lg-6 col-md-6 col-sm-12 col-12">'
		+ '<table class="table table-striped table-bordered dt-responsive nowrap courseSelectedTable " style="width:100%">'
		+ '<tbody>'
		+ '<tr class="mb-2 p-1 ">'
		+ '<td class="m-0">Preferred Plan:</td>'
		+ '<td class="text-right"><b>&nbsp;<span id="defaultPlanName">--</span></b></td>'
		+ '</tr>'
		+ '<tr class="mb-2 p-1">'
		+ '<td class="m-0">Course Fee:</td>'
		+ '<td class="text-right"><b>&nbsp;<span id="courseFeeString">--</span></b></td>'
		+ '</tr>'
		+ '<tr class="mb-2 p-1">'
		+ '<td class="m-0">Extra Course Fee:</td>'
		+ '<td class="text-right"><b>&nbsp;<span id="extraCourseFeeString">--</span></b></td>'
		+ '</tr>'
		+ '<tr class="mb-2 p-1">'
		+ '<td class="m-0">Plan Discount:</td>'
		+ '<td class="text-right"><b>&nbsp;<span id="planDiscountString">--</span></b></td>'
		+ '</tr>'
		+ '<tr class="mb-2 p-1">'
		+ '<td class="m-0">Scholarship Discount:</td>'
		+ '<td class="text-right"><b>&nbsp;<span id="scholarshipDiscountString">--</span></b></td>'
		+ '</tr>'

		+ '<tr class="mb-2 p-1">'
		+ '<td class="m-0">Material Fee:</td>'
		+ '<td class="text-right"><b>&nbsp;<span id="materialFeeString">--</span></b></td>'
		+ '</tr>'
		+ '<tr class="mb-2 p-1 enrollmentFeeStringDiv">'
		+ '<td class="m-0">Enrollment Fee:<span class="enrollmentFeePaidType">--</span></td>'
		+ '<td class="text-right"><b>&nbsp;<span id="enrollmentFeeString">--</span></b></td>'
		+ '</tr>'
		+ '<tr class="mb-2 p-1 bookAnEnrollmentFeeStringDiv">'
		+ '<td class="m-0">Reserve an Enrollment Seat:<span class="enrollmentFeePaidType">--</span></td>'
		+ '<td class="text-right"><b>&nbsp;<span id="bookAnEnrollmentFeeString">--</span></b></td>'
		+ '</tr>'
		+ '<tr class="mb-2 p-1 enrollmentFeeStringDiv">'
		+ '<td class="m-0">Net Payable Fee'
		//<!-- (Enrollment Fee + Course Fee after Discount + Material Fee) -->
		+ ':</td>'
		+ '<td class="text-right"><b>&nbsp;<span class="payableFeeString">--</span></b></td>'
		+ '</tr>'
		+ '<tr class="mb-2 p-1 bookAnEnrollmentFeeStringDiv">'
		+ '<td class="m-0">Payable Fee'
		//<!-- (Reserve an Enrollment Seat + Course Fee after Discount + Material Fee) -->
		+ ':</td>'
		+ '<td class="text-right"><b>&nbsp;<span class="payableFeeString">--</span></b></td>'
		+ '</tr>'
		+ '</tbody>'
		+ '</table>'
		+ '</div>'
		+ '</div>'
		+ '<hr class="my-2">'
		+ '<div class="" style="display: flex;flex-wrap: wrap;">'
		+ '<div class="col-lg-4 col-md-4 col-sm-6 col-12 p-0" style="display:none;">'
		+ '<input type="text" id="customePlanId" name="customePlanId" class="form-control" value="" disabled/>'
		+ '<input type="text" id="studentStandardId" name="studentStandardId" class="form-control" value="" disabled/>'
		+ 'paymentModeHidden: <input type="text" id="paymentModeHidden" name="paymentModeHidden" class="form-control" value="" disabled/>'
		+ 'firstInstallmentHidden: <input type="text" id="firstInstallmentHidden" name="firstInstallmentHidden" class="form-control" value="" disabled/>'
		+ 'materialFeeHidden: <input type="text" id="materialFeeHidden" name="materialFeeHidden" class="form-control" value="" disabled/>'
		+ 'planDiscountHidden: <input type="text" id="planDiscountHidden" name="planDiscountHidden" class="form-control" value="" disabled/>'
		+ 'payableFeeHidden: <input type="text" id="payableFeeHidden" name="payableFeeHidden" class="form-control" value="" disabled/>'

		+ 'payableFeeAnnually: <input type="text" id="payableFeeAnnually" name="payableFeeAnnually" class="form-control" value="" disabled/>'
		+ 'payableFeeInstallment: <input type="text" id="payableFeeInstallment" name="payableFeeInstallment" class="form-control" value="" disabled/>'
		+ '</div>'
		+ '<div class="col-lg-4 col-md-4 col-sm-6 col-12 p-0">'
		+ '<table class="table table-striped table-bordered dt-responsive nowrap">'
		+ '<thead>'
		+ '<tr>'
		+ '<th colspan="2" class="text-center">Apply Custom Payment Rule</th>'
		+ '</tr>'
		+ '</thead>'
		+ '<tbody>'
		+ '<tr>'
		+ '<td>Custom Payment Plan</td>'
		+ '<td width="200px">'
		+ '<div class="d-flex align-items-center">'
		+ '<div class="col-lg-1 col-md-1 col-sm-2 col-2 text-center p-0">'
		+ '<b>&nbsp;</b>'
		+ '</div>'
		+ '<select id="customPaymentPlan" name="customPaymentPlan" class="form-control select2Dropdown" onChange="customPlanChange()">'
		+ '</select>'
		+ '</div>'
		+ '</td>'
		+ '</tr>'
		+ '<tr>'
		+ '<td>Custom Payable Fee</td>'
		+ '<td width="200px">'
		+ '<div class="d-flex align-items-center">'
		+ '<div class="col-lg-1 col-md-1 col-sm-2 col-2 text-center p-0">'
		+ '<b>&nbsp;</b>'
		+ '</div>'
		+ '<input type="text" id="payableFee" name="payableFee" class="form-control" value="" disabled/>'
		+ '</div>'
		+ '</td>'
		+ '</tr>'
		+ '<tr>'
		+ '<td>Premium on Payable Fee</td>'
		+ '<td width="200px">'
		+ '<div class="d-flex align-items-center">'
		+ '<div class="col-lg-2 col-md-2 col-sm-2 col-2 text-center p-0">'
		+ '<b>+</b>'
		+ '</div>'
		+ '<input type="text" id="premiumAmount" name="premiumAmount" class="form-control" value="" onkeyup="calculatePremiumAmount();" />'
		+ '<input type="text" id="premiumPercentage" name="premiumPercentage" class="form-control" value="" min="1" max="100" onkeyup="premiumPercentageChange()" disabled />'
		+ '</div>'
		+ '</td>'
		+ '</tr>'
		+ '<tr>'
		+ '<td>'
		+ '<label>Payable Fee after Premium</label>'
		+ '</td>'
		+ '<td width="200px">'
		+ '<div class="d-flex align-items-center">'
		+ '<div class="col-lg-2 col-md-2 col-sm-2 col-2 text-center p-0">'
		+ '<b>=</b>'
		+ '</div>'
		+ '<input type="text" id="payableFeeAfterPremium" name="payableFeeAfterPremium" class="form-control" value="" disabled/>'
		+ '</div>'
		+ '</td>'
		+ '</tr>'
		+ '<tr>'
		+ '<td>'
		+ '<label>Discount on Payable Fee</label>'
		+ '</td>'
		+ '<td width="200px">'
		+ '<div class="d-flex align-items-center">'
		+ '<div class="col-lg-2 col-md-2 col-sm-2 col-2 text-center p-0">'
		+ '<b>-</b>'
		+ '</div>'
		+ '<input type="text" id="discountAmount" name="discountAmount" class="form-control" value="" onkeyup="calculateDiscountAmount();"/>'
		+ '<input type="text" id="discountPercentage" name="discountPercentage" class="form-control" value="" min="1" max="100" onkeyup="discountercentageChange()" disabled/>'
		+ '</div>'
		+ '</td>'
		+ '</tr>'
		+ '<tr>'
		+ '<td>'
		+ '<label>Net Payable Fee</label>'
		+ '</td>'
		+ '<td width="200px">'
		+ '<div class="d-flex align-items-center">'
		+ '<div class="col-lg-2 col-md-2 col-sm-2 col-2 text-center p-0">'
		+ '<b>=</b>'
		+ '</div>'
		+ '<input type="text" id="payableFeeAfterDiscount" name="payableFeeAfterDiscount" class="form-control" value="" disabled/>'
		+ '</div>'
		+ '</td>'
		+ '</tr>'
		+ '</tbody>'
		+ '</table>'
		+ '</div>'
		+ '<div class="col-lg-4 col-md-4 col-sm-6 col-12 p-0" style="background: #edf3f6;">'
		+ '<table class="table table-striped table-bordered dt-responsive nowrap">'
		+ '<thead>'
		+ '<tr>'
		+ '<th colspan="2" class="text-center">Installments</th>'
		+ '</tr>'
		+ '</thead>'
		+ '<tbody>'
		+ '<tr>'
		+ '<td>'
		+ '<label>1<sup>st</sup> installment <b>(minimum: <span id="minimumPayment"></span>)</b></label>'
		+ '</td>'
		+ '<td width="200px">'
		+ '<div class="d-flex align-items-center">'
		+ '<input type="text" id="firstInstallment" name="firstInstallment" class="form-control" value="" onkeydown="return M.floatDigit(event);" onblur="firstIntallmentFlatChange()"/>'
		+ '<input type="text" id="firstInstallmentPercentage" name="firstInstallmentPercentage" class="form-control" value="" onkeydown="return M.floatDigit(event);" onkeyup="firstIntallmentPercentageChange()" disabled/>'
		+ '</div>'
		+ '</td>'
		+ '</tr>'
		+ '<tr style="display:none;">'
		+ '<td>'
		+ '<label>Remaining Payable Fee</label>'
		+ '</td>'
		+ '<td width="200px">'
		+ '<div class="d-flex align-items-center">'
		+ '<input type="text" id="remainingPayableFee" name="remainingPayableFee" class="form-control" value="" onkeydown="return M.floatDigit(event);" disabled/>'
		+ '</div>'
		+ '</td>'
		+ '</tr>'
		+ '<tr>'
		+ '<td>'
		+ '<label>Number of Installment(Including 1<sup>st</sup> installment)</label>'
		+ '</td>'
		+ '<td width="200px">'
		+ '<div class="d-flex align-items-center">'
		+ '<select id="noOfInstallment" name="noOfInstallment" class="form-control select2Dropdown" onChange="generateInstallments()">'
		+ '</select>'
		+ '</div>'
		+ '</td>'
		+ '</tr>'
		+ '<tr>'
		+ '<td>'
		+ '<label class="full">Over a period of (in months)</label>'
		+ '</td>'
		+ '<td width="200px">'
		+ '<select id="durationWithin" name="durationWithin" class="form-control select2Dropdown" onChange="generateInstallments()">'
		+ '</select>'
		+ '</td>'
		+ '</tr>'
		+ '<tr>'
		+ '<td>'
		+ '<label class="full">Gap between two installments</label>'
		+ '</td>'
		+ '<td width="200px">'
		+ '<input type="text" id="gapBetweenTwoIntstallment" name="gapBetweenTwoIntstallment" class="form-control" value="" onkeydown="return M.floatDigit(event);" disabled/>'
		+ '</td>'
		+ '</tr>'
		+ '<tr>'
		+ '<td>'
		+ '<label class="full">Tentative Schedule data of 1st Installment</label>'
		+ '</td>'
		+ '<td width="200px">'
		+ '<input type="text" id="tentativeFirstPayDate" name="tentativeFirstPayDate" class="form-control dataPicker" value=""/>'
		+ '</td>'
		+ '</tr>'
		+ '<tr>'
		+ '<td>'
		+ '<label class="full">Discount on Remaining Payable Fee after Premium</label>'
		+ '</td>'
		+ '<td width="200px">'
		+ '<select id="discountApplicableFor" name="discountApplicableFor" class="form-control select2Dropdown" onChange="generateSchedule()"></select>'
		+ '</td>'
		+ '</tr>'
		+ '<tr style="display:none">'
		+ '<td>'
		+ '<button class="btn btn-outline-success btn-sm" id="generateScheduleBtn" name="generateScheduleBtn" onClick="generateSchedule()">Generate Schedule</button>'
		+ '</td>'
		+ '</tr>'
		+ '</tbody>'
		+ '</table>'
		+ '</div>'
		+ '<div class="col-lg-4 col-md-4 col-sm-6 col-12 p-0">'
		+ '<div class="full">'
		+ '<table id="paymentScheduleTable" class="table mb-0 table-bordered table-striped paymentScheduleTable">'
		+ '<thead>'
		+ '<tr>'
		+ '<th class="text-center">S. No.</th>'
		+ '<th class="text-center">Schedule Date</th>'
		+ '<th class="text-center">Payment Title</th>'
		+ '<th class="text-center">Payable Fee</th>'
		+ '<th class="text-center">Payment Link</th>'
		+ '</tr>'
		+ '</thead>'
		+ '<tbody>'
		+ '</tbody>'
		+ '</table>'
		+ '</div>'
		+ '</div>'
		+ '</div>'
		+ '</div>'
		+ '<hr class="my-2">'
		+ '<div id="paymentScheduleDiv" class=" " style="display:none;">'
		+ '<div class="row">'
		+ '<div class="col-lg-10 col-md-8 col-sm-12 col-12">'
		+ '<p class="mb-1 line-height-12">'
		+ '<b class="text-danger font-12 ">NOTE: Once the Custom Payment Plan is "Saved and Confirmed", the Grade, Learning Program, and Course Selection will be locked for the student. The student will only pay the fees after the custom payment is finalized. Please make sure all grade/program/course details selected by the student are final before saving the plan.</b>'
		+ '</p>'
		+ '<p class="mb-1 line-height-12">'
		+ '<b class="text-danger font-12 ">In case of any changes, please flush the custom payment plan and recalculate it to accommodate the changes.</b>'
		+ '</p>'
		+ '</div>'
		+ '<div id="saveNConfirm" class="col-lg-2 col-md-4 col-sm-12 col-12 text-right">'
		+ '</div>'
		+ '</div>'
		+ '</div>'
		+ '</div>'
		+ '</div>'
		+ '</div>'
		+ '</div>'
		+ '</div>'
		+ '</div>'
		+ '</div>'
		+ '<div class="app-wrapper-footer">'
		+ '<div class="app-footer">'
		+ '<div class="app-footer__inner">'
		+ '<p style="margin: 0">' + copyrightYear + ' © ' + copyrightUrl + '</p>'
		+ '</div>'
		+ '</div>'
		+ '</div>'
		+ '</div>'
		+ '<div id="commonloaderIdNewLoader" class="loader-wrapper d-flex justify-content-center align-items-center loader-style hide-loader">';
		// + '<div class="loader primary-border-top-color">';
	if (SCHOOL_ID == 1) {
		html +='<img src="'+PATH_FOLDER_IMAGE2+'loader-new.gif" alt="'+SCHOOL_NAME+' Loader" class="new-loader-2024" />';
	} else {
		html+=
			'<div class="ball-rotate">'
			+ '<div style="background-color: rgb(247, 185, 36);"></div>'
			+ '</div>'
			+ '<p>Loading ...</p>';
	}
	html +=
		//'</div>'
		'</div>'
		+ '<div class="server-message">'
		+ '<span class="msg notification" id="msgTheme2"><i class="fa fa-info"></i> </span>'
		+ '</div>'
		+ '<div class="modal fade-scale" id="remarksresetDelete1" tabindex="-1">'
		+ '<div class="modal-dialog modal-md modal-dialog-centered box-shadow-none" role="document">'
		+ '<div class="modal-content">'
		+ '<div class="modal-header pt-2 pb-2 bg-info justify-content-center">'
		+ '<h5 class="heading text-white text-center" id="warningMessage1">Are you sure?</h5>'
		+ '</div>'
		+ '<div id="statusMessage-1" class="modal-body delete-modal text-center">'
		+ '<i class="fas fa-sync fa-4x text-info"></i>'
		+ '</div>'
		+ '<div class="modal-footer">'
		+ '<div class="m-auto">'
		+ '<button id="resetDeleteErrorWarningYes1" type="button" class="btn btn-outline-info mr-1">Yes</button>'
		+ '<button id="resetDeleteErrorWarningNo1" type="button" class="btn btn-info mr-1" data-dismiss="modal">No</button>'
		+ '<button id="resetDeleteErrorWarningCancel1" type="button" class="btn btn-success" data-dismiss="modal">Close</button>'
		+ '</div>'
		+ '</div>'
		+ '</div>'
		+ '</div>'
		+ '</div>';
	return html;
}

function renderAdvancePayment(userId, studentStandardId, schoolWebsite, logoUrl, copyrightYear, copyrightUrl) {
	var responseData = getAdvancePaymentDetails(studentStandardId);
	$('body').append(customAdvanceContent(responseData, userId, studentStandardId, schoolWebsite, logoUrl, copyrightYear, copyrightUrl));
	var advanceFeeDetails = responseData.advanceFeeDetails;
	if (responseData['advanceFeeStatus'] != 'C') {
		$('#learningProgram').val('');
	}else{
		$('#learningProgram').val(advanceFeeDetails.learningPlan);
	}
	$('#currentLearningProgramHidden').val(advanceFeeDetails.learningPlan);
	if(advanceFeeDetails.learningPlan=='ONE_TO_ONE_FLEX'){
		actualGrades=['13','14','15','16','17'];
		$('#forGradeId').html(getGrades(getGradesData(actualGrades)));
		$('#forGradeId').val(advanceFeeDetails.forGradeId);
		$('#forGradeIdHidden').val(advanceFeeDetails.forGradeId);
		var eligibleGradeForDualDiploma=[9,10,20,21];
		if(jQuery.inArray(parseInt($('#forGradeIdHidden').val()), eligibleGradeForDualDiploma)<0){
			$("#learningProgram option[value='DUAL_DIPLOMA']").remove();
		}
	}else{
		actualGrades=[];
		var forGradeId=advanceFeeDetails.forGradeName.split(' ')[1];
		actualGrades.push(forGradeId-1);
		actualGrades.push(forGradeId);
		$('#forGradeId').html(getGrades(getGradesData(actualGrades)));
		$("#forGradeId option").filter(function() {
			return $(this).text() =='Grade '+forGradeId;
		}).prop("selected", true);
		$('#forGradeId').val(advanceFeeDetails.forGradeId);
		$('#forGradeIdHidden').val($("#forGradeId :selected").text().split(' ')[1]);
		var eligibleGradeForDualDiploma=[9,10,11,12];
		if(jQuery.inArray(parseInt($('#forGradeIdHidden').val()), eligibleGradeForDualDiploma)<0){
			$("#learningProgram option[value='DUAL_DIPLOMA']").remove();
		}
	}

	$('#paymentMode').val(advanceFeeDetails.paymentMode);

	$('#courseFee').val(getNumberWithPrecision(advanceFeeDetails.courseFee, 2));
	$('#transactionCharge').val(getNumberWithPrecision(advanceFeeDetails.transactionCharge, 2));
	if (advanceFeeDetails.learningPlan == 'SCHOLARSHIP') {
		$('#progressionDiscount').val('0.00');
	} else {
		$('#progressionDiscount').val(getNumberWithPrecision(advanceFeeDetails.progressionDiscount, 2));
	}
	$('#planDiscount').val(getNumberWithPrecision(advanceFeeDetails.planDiscount, 2));
	$('#additionalDiscount').val(getNumberWithPrecision(advanceFeeDetails.additionalDiscount, 2));
	$('#alreadyPaid').val(getNumberWithPrecision(advanceFeeDetails.alreadyPaid, 2));
	$('#payableFee').html('<b>' + getNumberWithPrecision(advanceFeeDetails.payableFee, 2) + '</b>');
	$('#payableFee').attr('payablefee-data', getNumberWithPrecision(advanceFeeDetails.payableFee, 2));
	getAdvanceFeeDetailsContentDetails(advanceFeeDetails.paymentMode, responseData);

	if (responseData['alreadyPaid']) {
		$('#saveNConfirm').html('');
		$('#paymentMode').attr('disabled', true);
	} else {
		if (responseData['advanceFeeStatus'] != 'C') {
			// var confirmFunction = "showWarningMessageShow('Are you sure you want to save the advance payment details? Please note you will not be able to edit them once saved.','saveAdvanceFeeDetails(\\\'C\\\')',false)";
			//<button class="btn btn-success btn-sm mr-1" onClick="saveAdvanceFeeDetails(\'S\')">Save</button>
			$('#saveNConfirm').html('<button class="btn btn-outline-success btn-sm" onClick="validateAdvancePayment()">Save & Confirm</button>')
		} else {
			$('.card-body *').prop('disabled', true);
			var advanceFeeDetails = "showWarningMessageShow('Are you sure you want to delete the advance payment details?','saveAdvanceFeeDetails(\\\'D\\\')',false)";
			$('#saveNConfirm').html('<button class="btn btn-danger btn-sm" onClick="' + advanceFeeDetails + '">Delete advance payment</button>')
		}
	}
}

function customAdvanceContent(responseData, userId, studentStandardId, schoolWebsite, logoUrl, copyrightYear, copyrightUrl) {
	var advanceFeeDetails = responseData.advanceFeeDetails;
	var html =
		'<div class="app-container app-theme-white body-tabs-shadow fixed-header fixed-sidebar">'
		+ '<div class="sticky-header">'
		+ '<div class="app-header header-shadow">'
		+ '<div class="app-header__logo" style="order:0">'
		+ '<a href="' + schoolWebsite + '" target="blank" class="logo-src" style="background:url(' + logoUrl + SCRIPT_VERSION + ');"></a>'
		+ '</div>'
		+ '<div style="align-items: center;display: flex; margin-left: auto;padding-right:20px;">'
		+ '<a href="' + CONTEXT_PATH + SCHOOL_UUID + '/common/logout/' + UNIQUEUUID + '?from=dashboard" class="btn-pill btn-shadow btn-shine btn btn-primary">Log out</a>'
		+ '</div>'
		+ '</div>'
		+ '</div>'
		+ '<div class="app-main pt-0 pb-0 mt-5" id="studentDetailsId" userId="' + userId + '" studentStandardId="' + studentStandardId + '">'
		+ '<div class="col p-0 mt-2">'
		+ '<div class="app-main__inner p-1">';
	if (MAINTENANCEDOWNTIME != '') {
		html +=
			'<div class="marquee">'
			+ '<marquee id="marqueeDiv" direction="left" style="color: red" width="100%">' + MAINTENANCEDOWNTIME + '</marquee>'
			+ '</div>';
	}
	html +=
		'<div class="col-lg-12 col-md-12 col-sm-12 col-12 mt-2">'
		+ '<div class="card">'
		+ '<div class="card-header bg-primary text-white" >'
		+ '<h4 class="m-0">Advance Payment | ' + advanceFeeDetails.studentName + '</h4>'
		+ '</div>'
		+ '<div class="card-body pt-0 pb-1">'
		+ '<div class="row">'
		+ '<div class="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12">'
		+ '<div class="card is-water-mark full mt-2">'
		+ '<div class="card-body col py-1">'
		+ '<div class="full">'
		+ '<div class="row">'
		+ '<div class="col-lg-12 col-mg-12 col-sm-12 col-12">'
		+ '<div class="position-relative form-group mb-0">'
		+ '<label class="m-0">Select Learnining Program</label>'
		+ '<input type="hidden" id="firstInstallmentHidden" name="firstInstallmentHidden" class="form-control" value="" disabled="">'
		+ '<input type="hidden" id="forGradeIdHidden" name="forGradeIdHidden" class="form-control" value="" disabled="">'
		+ '<input type="hidden" id="currentLearningProgramHidden" name="currentLearningProgramHidden" class="form-control" value="" disabled="">'
		+ '<select id="learningProgram" class="form-control py-1" style="height:inherit" onChange="applyGradeFee(this,\'LP\')">'
		+ '<option value="">Select Learning Program</option>'
		+ getLearningProgramContent(SCHOOL_ID)
		+ '</select>'
		+ '</div>'
		+ '</div>'
		+ '<div class="col-lg-12 col-mg-12 col-sm-12 col-12">'
		+ '<div class="position-relative form-group mb-0">'
		+ '<label class="m-0">Select Grade</label>'
		+ '<select id="forGradeId" class="form-control py-1" style="height:inherit" onChange="applyGradeFee(this,\'G\')">'
		+ getStandardContent(SCHOOL_ID, false, false)
		+ '</select>'
		+ '</div>'
		+ '</div>'
		+ '<div class="col-lg-12 col-mg-12 col-sm-12 col-12">'
		+ '<div class="position-relative form-group mb-0">'
		+ '<label class="m-0">Fee Plan</label>'
		+ '<select id="paymentMode" class="form-control py-1" style="height:inherit" onchange="getAdvanceFeeDetailsContent()">'
		+ getPaymentOptionDetails(advanceFeeDetails.planDiscount, advanceFeeDetails.alreadyPaid)
		+ '</select>'
		+ '</div>'
		+ '</div>'
		+ '<div class="col-lg-12 col-mg-12 col-sm-12 col-12">'
		+ '<div class="position-relative form-group mb-0">';
	html += '<label class="m-0">Course Fee</label>'
		+ '<input id="courseFee" value="" placeholder="Course Fee" type="text" class="form-control text-right py-1" style="height:inherit" onkeyup="calculatePayableAdvanceFee()" disabled>'
		+ '</div>'
		+ '</div>'
		+ '<div class="col-lg-12 col-mg-12 col-sm-12 col-12">'
		+ '<div class="position-relative form-group mb-0">'
		+ '<label class="m-0">Transaction Charges</label>'
		+ '<input id="transactionCharge" value="" placeholder="Transaction Charges" type="text" class="form-control text-right py-1" style="height:inherit" onkeyup="calculatePayableAdvanceFee()">'
		+ '</div>'
		+ '</div>'
		+ '<div class="col-lg-12 col-mg-12 col-sm-12 col-12">'
		+ '<div class="position-relative form-group mb-0">'
		+ '<label class="m-0">Progression Discount</label>'
		+ '<input id="progressionDiscount" value="" placeholder="Progression Discount" type="text" class="form-control text-right py-1" style="height:inherit" onkeyup="calculatePayableAdvanceFee()">'
		+ '</div>'
		+ '</div>'
		+ '<div class="col-lg-12 col-mg-12 col-sm-12 col-12">'
		+ '<div class="position-relative form-group mb-0">'
		+ '<label class="m-0">Plan Discount</label>'
		+ '<input id="planDiscount" value="" placeholder="Plan Discount" type="text" class="form-control text-right py-1" style="height:inherit" onkeyup="calculatePayableAdvanceFee()">'
		+ '</div>'
		+ '</div>'
		+ '<div class="col-lg-12 col-mg-12 col-sm-12 col-12">'
		+ '<div class="position-relative form-group mb-0">'
		+ '<label class="m-0">Additional Discount</label>'
		+ '<input id="additionalDiscount" value="" placeholder="Additional Discount" type="text" class="form-control text-right py-1" style="height:inherit" onkeyup="calculatePayableAdvanceFee()">'
		+ '</div>'
		+ '</div>'
		+ '<div class="col-lg-12 col-mg-12 col-sm-12 col-12">'
		+ '<div class="position-relative form-group mb-0">'
		+ '<label class="m-0">Already Paid</label>'
		+ '<input id="alreadyPaid" value="" placeholder="Already Paid" type="text" class="form-control text-right py-1" style="height:inherit" onkeyup="calculatePayableAdvanceFee()">'
		+ '</div>'
		+ '</div>'
		+ '</div>'
		+ '<table class="table table-bordered mb-1 mt-1" cellpadding="1">'
		+ '<tbody>'
		+ '<tr>'
		+ '<td class="p-1"><b>Final Payable Fee</b></td>'
		+ '<td class="p-1 text-right pr-2" id="payableFee" payableFee-data=""></td>'
		+ '</tr>'
		+ '</tbody>'
		+ '</table>'
		+ '</div>'
		+ '</div>'
		+ '</div>'
		+ '</div>'
		+ '<div class="col-xl-8 col-lg-8 col-md-12 col-sm-12 col-12">'
		+ '<div class="full d-none" id="partialFeeContentDiv"></div>'
		+ '<div class="full d-none" id="installmentFeeContentDiv"></div>'
		+ '<div class="full d-none" id="oneTimeFeeContentDiv"></div>'
		+ '<div class="col-lg-12 col-md-12 col-sm-12 col-12 mt-2 px-0" id="paymentScheduleDiv">'
		+ '<p class="font-weight-bold mb-1" style="font-size:14px;">NOTE: Once the Advance Payment is "Saved and Confirmed", the Grade and Learning Program will be locked for the student. The student will only pay the fees after the advance payment is finalized. Please make sure all grade/program selected by the student are final before saving the plan.</p>'
		+ '<p class="font-weight-bold mb-1" style="font-size:14px;">In case of any changes, please flush the advance payment plan and recalculate it to accommodate the changes.</p>'
		+ '<div id="saveNConfirm" class="full mt-1 mb-2 text-right">'
		+ '</div>'
		+ '</div>'
		+ '</div>'
		+ '</div>'
		+ '</div>'
		+ '</div>'
		+ '</div>'
		+ '</div>'
		+ '</div>'
		+ '</div>'
		+ '<div class="app-wrapper-footer">'
		+ '<div class="app-footer">'
		+ '<div class="app-footer__inner">'
		+ '<p style="margin: 0">' + copyrightYear + ' © ' + copyrightUrl + '</p>'
		+ '</div>'
		+ '</div>'
		+ '</div>'
		+ '</div>'
		+ '<div id="commonloaderIdNewLoader" class="loader-wrapper d-flex justify-content-center align-items-center loader-style hide-loader">'
		// + '<div class="loader primary-border-top-color">';
	if (SCHOOL_ID == 1) {
		html +=
			// '<div class="full">'
			// + '<img src="' + PATH_FOLDER_IMAGE2 + 'is_loader.gif" alt="' + SCHOOL_NAME + ' Loader"/>'
			// + '</div>';
			`
				<img src="`+PATH_FOLDER_IMAGE2+`loader-new.gif" alt="`+SCHOOL_NAME+` Loader" class="new-loader-2024" />
			`
	} else {
		html +=
			'<div class="ball-rotate">'
			+ '<div style="background-color: rgb(247, 185, 36);"></div>'
			+ '</div>'
			+ '<p>Loading ...</p>'
	}
	html +=
		'</div>'
		+ '</div>'
		+ '<div class="server-message">'
			+ '<span class="msg notification" id="msgTheme2"><i class="fa fa-info"></i> </span>'
		+ '</div>'
		+ '<div class="modal fade-scale" id="remarksresetDelete1" tabindex="-1">'
			+ '<div class="modal-dialog modal-md modal-dialog-centered box-shadow-none" role="document">'
				+ '<div class="modal-content">'
					+ '<div class="modal-header pt-2 pb-2 bg-info justify-content-center">'
						+ '<h5 class="heading text-white text-center" id="warningMessage1">Are you sure?</h5>'
					+ '</div>'
					+ '<div id="statusMessage-1" class="modal-body delete-modal text-center">'
						+ '<i class="fas fa-sync fa-4x text-info"></i>'
					+ '</div>'
					+ '<div class="modal-footer">'
						+ '<div class="m-auto">'
							+ '<button id="resetDeleteErrorWarningYes1" type="button" class="btn btn-outline-info mr-1">Yes</button>'
							+ '<button id="resetDeleteErrorWarningNo1" type="button" class="btn btn-info mr-1" data-dismiss="modal">No</button>'
							+ '<button id="resetDeleteErrorWarningCancel1" type="button" class="btn btn-success" data-dismiss="modal">Close</button>'
						+ '</div>'
					+ '</div>'
				+ '</div>'
			+ '</div>'
		+ '</div>'
		+'<div id="messageDiv" class="server-error-message">'
			+'<span id="messageDiv1" class="msg error"><i class="fa fa-times"></i> Error Message </span>'
		+'</div>';
	return html;
}

function getOnetimeFeeContent(responseData) {
	var gradeName = $("#forGradeId option:selected").text();
	var html =
		'<div class="card is-water-mark full mt-2 py-1">'
		+ '<div class="card-body col py-1">'
		+ '<div class="full mb-1">'
		+ '<h6 class="text-primary font-weight-bold">FEE SCHEDULE</h6>'
		+ '</div>'
		+ '<div class="full" style="overflow-x:auto">'
		+ '<table id="paymentScheduleTableOnetime" class="table table-bordered" style="min-width:560px">'
		+ '<thead>'
		+ '<tr class="bg-primary text-white">'
		+ '<th>S.No.</th>'
		+ '<th width="125px">SCHEDULE DATE</th>'
		+ '<th>DESCRIPTION</th>'
		+ '<th width="75px">TOTAL FEE</th>';
	if (responseData != '' && responseData['alreadyPaid']) {
		html += '<th width="100px">PAID DATE</th>';
	} else {
		html += '<th width="100px">PAYING NOW</th>';
	}
	html+='<th width="75px">PAYMENT LINK</th>';
	html +=
		'</tr>'
		+ '</thead>'
		+ '<tbody>';
	if (responseData == '' || responseData.schedulePayments == null) {
		var installment1 = getNumberWithPrecision($('#payableFee').text(), 2);
		html +=
			'<tr>'
			+ '<td class="text-center">1.</td>'
			+ '<td><input type="text" id="installment1" class="form-control dataPicker schedulePayDate" value=""/></td>'
			+ '<td class="paymentTitle">'+gradeName+' - One Time Payment - Advance</td>'
			+ '<td class="text-right installment1 scheduleFeeInput d-flex align-items-center">' + currency + '<input type="text" class="installmentValue ml-1" id="ad_installment1" value="' + installment1 + '" readonly ></td>'
			+ '<td class="text-right scheduleFee ad_installment1">' + currency + installment1 + '</td>'
			+ '<td class="text-center">NA</td>'
			+ '</tr>';
	} else {
		var totalAmount = 0.00;
		$.each(responseData.schedulePayments, function (k, installment) {
			// var installment1=currency+getNumberWithPrecision(responseData.totalPayableAmount,2);
			html +=
				'<tr updid="' + installment.id + '">'
				+ '<td class="text-center">' + (k + 1) + '.</td>';
			if (installment.payAmount != null) {
				totalAmount += parseFloat(installment.payAmount);
			}
			if (responseData['alreadyPaid'] || responseData['advanceFeeStatus'] == 'C' || responseData['advanceFeeStatus'] == 'S') {
				html += '<td>' + installment.schedulePayDate + '</td>';
			} else {
				html += '<td><input type="text" id="installment' + (k + 1) + '" class="form-control ' + (k == 0 ? 'dataPicker' : '') + ' schedulePayDate" value=""/></td>';
			}
			html +=
				'<td class="paymentTitle">' + installment.paymentTitle + '</td>'
				+ '<td class="text-right installment' + (k + 1) + ' scheduleFeeInput d-flex align-items-center">' + currency + '<input type="text" class="installmentValue ml-1" id="ad_installment' + (k + 1) + '" value="' + (installment.payAmount != null ? installment.payAmount.toFixed(2) : 0.00) + '"></td>'
			if (responseData['alreadyPaid']) {
				html += '<td class="text-right">' + installment.paymentDate + '</td>';
			} else {
				html += '<td>&nbsp;</td>';
			}
			if (installment.paymentLink) {
				html += '<td class="text-center" id="paymentLink'+(k+1)+'">'
					+'<span>'
						+'<input type="text" id="paymentCopyLink'+(k+1)+ '" style="float:right; opacity:0; height:0;padding:0;" value="'+installment.paymentLink+'">'
						+'<a href="javascript:void(0)" class="btn btn-primary btn-sm" onclick="copyToClipboard(\'paymentCopyLink' + (k+1) + '\')"><i class="fa fa-clone" aria-hidden="true">Copy Payment Link</i></a>'
					+'</span>'
				+'</td>';
			} else {
				html += '<td class="text-center" id="paymentLink"'+(k+1)+'>NA</td>';
			}
			html +=
				'</tr>';
		});
		if (responseData.schedulePayments.length > 1) {
			html += '<tr>'
				+ '<td class="text-center">&nbsp;</td>'
				+ '<td>&nbsp;</td>'
				+ '<td class="text-right"><b>Final Payable Fee</b></td>'
				+ '<td class="text-right">' + currency + '<span id="installmentFinalPaybleFee">' + totalAmount.toFixed(2) + '</span></td>'
				+ '<td>&nbsp;</td>'
				+ '</tr>';
		}
	}
	html +=
		'</tbody>'
		+ '</table>'
		+ '</div>'
		+ '</div>'
		+ '</div>';
	return html;
}

function getIntallmentFeeContent(responseData) {
	var gradeName = $("#forGradeId option:selected").text();
	var html =
		'<div class="card is-water-mark full mt-2 py-1">'
		+ '<div class="card-body col py-1">'
		+ '<div class="full mb-1">'
		+ '<h6 class="text-primary font-weight-bold">FEE SCHEDULE</h6>'
		+ '</div>'
		+ '<div class="full" style="overflow-x:auto">'
		+ '<table id="paymentScheduleTableInstallment" class="table table-bordered" style="min-width:560px">'
		+ '<thead>'
		+ '<tr class="bg-primary text-white">'
		+ '<th>S.No.</th>'
		+ '<th style="width:130px">SCHEDULE DATE</th>'
		+ '<th>DESCRIPTION</th>'
		+ '<th width="80px">TOTAL FEE</th>';
	if (responseData != '' && responseData['alreadyPaid']) {
		html += '<th width="100px">PAID DATE</th>';
	} else {
		html += '<th width="100px">PAYING NOW</th>';
	}
	html += '<th width="100px">PAYMENT LINK</th>';
	html +=
		'</tr>'
		+ '</thead>'
		+ '<tbody>';
	if (responseData == '' || responseData.schedulePayments == null) {
		var installment1 = getNumberWithPrecision((parseFloat($('#payableFee').text()) * 0.40), 2);
		var installment2 = getNumberWithPrecision((parseFloat($('#payableFee').text()) * 0.30), 2);
		var installment3 = getNumberWithPrecision((parseFloat($('#payableFee').text()) * 0.30), 2);
		var totalAmount = parseFloat(installment1) + parseFloat(installment2) + parseFloat(installment3);
		html +=
			'<tr>'
			+ '<td class="text-center">1.</td>'
			+ '<td><input type="text" id="installment1" class="form-control dataPicker schedulePayDate" value=""/></td>'
			+ '<td class="paymentTitle">'+gradeName+' - 1<sup>st</sup> of 3 Months Installment - Advance</td>'
			+ '<td class="text-right installment1 scheduleFeeInput d-flex align-items-center">' + currency + '<input type="text" class="installmentValue ml-1" id="ad_installment1" value="' + installment1 + '" onblur="totalInstallmentAmount(\'paymentScheduleTableInstallment\', \'installmentFinalPaybleFee\')" /></td>'
			+ '<td class="text-right installment1 scheduleFee ad_installment1">' + currency + installment1 + '</td>'
			+ '<td id="paymentLink1">NA</td>'
			+ '</tr>'
			+ '<tr>'
			+ '<td class="text-center">2.</td>'
			+ '<td><input type="text" id="installment2" class="form-control dataPicker schedulePayDate" value=""/></td>'
			+ '<td class="paymentTitle">'+gradeName+' - 2<sup>nd</sup> of 3 Months Installment - Advance</td>'
			+ '<td class="text-right installment2 scheduleFeeInput d-flex align-items-center">' + currency + '<input type="text" class="installmentValue ml-1" id="ad_installment2" value="' + installment2 + '" onblur="totalInstallmentAmount(\'paymentScheduleTableInstallment\', \'installmentFinalPaybleFee\')" /></td>'
			+ '<td>&nbsp;</td>'
			+ '<td id="paymentLink2">NA</td>'
			+ '</tr>'
			+ '<tr>'
			+ '<td class="text-center">3.</td>'
			+ '<td><input type="text" id="installment3" class="form-control dataPicker schedulePayDate" value=""/></td>'
			+ '<td class="paymentTitle">'+gradeName+' - 3<sup>rd</sup> of 3 Months Installment - Advance</td>'
			+ '<td class="text-right installment3 scheduleFeeInput d-flex align-items-center">' + currency + '<input type="text" class="installmentValue ml-1" id="ad_installment3" value="' + installment3 + '" onblur="totalInstallmentAmount(\'paymentScheduleTableInstallment\', \'installmentFinalPaybleFee\')" /></td>'
			+ '<td>&nbsp;</td>'
			+ '<td id="paymentLink3">NA</td>'
			+ '</tr>'
			+ '<tr>'
			+ '<td class="text-center">&nbsp;</td>'
			+ '<td>&nbsp;</td>'
			+ '<td class="text-right"><b>Final Payable Fee</b></td>'
			+ '<td class="text-right">' + currency + '<span id="installmentFinalPaybleFee">' + totalAmount.toFixed(2) + '</span></td>'
			+ '<td>&nbsp;</td>'
			+ '</tr>';
	} else {
		var totalAmount = 0.00;
		$.each(responseData.schedulePayments, function (k, installment) {
			html +=
				'<tr updid="' + installment.id + '">'
						+ '<td class="text-center">' + (k + 1) + '.</td>';
					if (responseData['alreadyPaid'] || responseData['advanceFeeStatus'] == 'C' || responseData['advanceFeeStatus'] == 'S') {
						html += '<td>' + installment.schedulePayDate + '</td>';
					} else {
						html += '<td><input type="text" id="installment' + (k + 1) + '" class="form-control ' + (k == 0 ? 'dataPicker' : '') + ' schedulePayDate" value=""/></td>';
					}
					html +=
						'<td class="paymentTitle">' + installment.paymentTitle + '</td>'
						+ '<td class="text-right installment3 scheduleFee"><input type="text" id="AD_Installment' + (k + 1) + '" class="form-control installmentValue" value="' + (installment.payAmount != null ? installment.payAmount.toFixed(2) : 0.00) + '"/></td>';
					if (installment.payAmount != null) {
						totalAmount += parseFloat(installment.payAmount);
					}
					if (responseData['alreadyPaid'] || responseData['advanceFeeStatus'] == 'C' || responseData['advanceFeeStatus'] == 'S') {
						html += '<td class="text-right">' + installment.paymentDate + '</td>';
					} else {
						html += '<td>SCHEDULED</td>';
					}
					if (installment.paymentLink) {
						html += '<td class="text-center" id="paymentLink"'+(k+1)+'>'
							+'<span>'
								+'<input type="text" id="paymentCopyLink'+(k+1)+'" style="float:right; opacity:0; height:0;padding:0;" value="'+installment.paymentLink+'">'
								+'<a href="javascript:void(0)" class="btn btn-primary btn-sm" onclick="copyToClipboard(\'paymentCopyLink' + (k+1) + '\')"><i class="fa fa-clone" aria-hidden="true">Copy Payment Link</i></a>'
							+'</span>'
						+'</td>';
					} else {
						html += '<td class="text-center" id="paymentLink"'+(k+1)+'>NA</td>';
					}
					html +=
				'</tr>';
		});
		if (responseData.schedulePayments.length > 1) {
			html += '<tr>'
				+ '<td class="text-center">&nbsp;</td>'
				+ '<td>&nbsp;</td>'
				+ '<td class="text-right"><b>Final Payable Fee</b></td>'
				+ '<td class="text-right">' + currency + '<span id="installmentFinalPaybleFee">' + totalAmount.toFixed(2) + '</span></td>'
				+ '<td>&nbsp;</td>'
				+ '<td>&nbsp;</td>'
				+ '</tr>';
		}
	}
	html +=
		'</tbody>'
		+ '</table>'
		+ '</div>'
		+ '</div>'
		+ '</div>';
	return html;
}

function getPartialFeeContent(responseData) {
	
	var html =
		'<div class="card is-water-mark full mt-2 py-1">'
		+ '<div class="card-body col py-1 py-1" style="height:inherit">'
		+ '<div class="full">'
		+ '<h6 class="text-primary font-weight-bold mb-1">INSTALLMENT</h6>'
		+ '</div>'
		+ '<div class="full" style="overflow-x:auto">'
		+ '<table id="paymentScheduleTable" class="table table-bordered mb-1" style="min-width:450px">'
		+ '<tbody>'
		+ '<tr>'
		+ '<td>1st installment</td>'
		+ '<td style="width:100px">'
		+ '<input type="text" id="firstInstallment" name="firstInstallment" class="form-control" value="0.00" style="height:inherit" onkeydown="return M.floatDigit(event);" onblur="firstIntallmentFlatChangeAdv()"/>'
		+ '</td>'
		+ '</tr>'
		+ '<tr>'
		+ '<td>Number of Installment(Including 1st installment)</td>'
		+ '<td style="width:100px">'
		+ '<select name="noOfInstallment" id="noOfInstallment" class="form-control py-1" style="height:inherit" onchange="generateInstallmentsAdv()">'
		+ '</select>'
		+ '</td>'
		+ '</tr>'
		+ '<tr>'
		+ '<td>Over a period of (in months)</td>'
		+ '<td style="width:100px">'
		+ '<select name="durationWithin" id="durationWithin" class="form-control py-1" style="height:inherit" onchange="generateInstallmentsAdv()">'
		+ '</select>'
		+ '</td>'
		+ '</tr>'
		+ '<tr>'
		+ '<td>Gap between two installments (in days)</td>'
		+ '<td style="width:100px">'
		+ '<input name="gapBetweenTwoIntstallment" id="gapBetweenTwoIntstallment" value="" type="text" class="form-control py-1" style="height:inherit" return M.floatDigit(event);" disabled>'
		+ '</td>'
		+ '</tr>'
		// +'<tr>'
		// 	+'<td>Tentative Schedule date of 1st Installment</td>'
		// 	+'<td>'
		// 		+'<input id="tentativeFirstPayDate" name="tentativeFirstPayDate" value="" placeholder="" type="text" class="form-control py-1 dataPicker" style="height:inherit">'
		// 	+'</td>'
		// +'</tr>'
		+ '<tr>'
		+ '<td>Discount on Payable Fee</td>'
		+ '<td style="width:200px">'
		+ '<select id="discountApplicableFor" name="discountApplicableFor" class="form-control" style="height:inherit" onchange="generateScheduleAdv()">'
		+ '</select>'
		+ '</td>'
		+ '</tr>'
		+ '</tbody>'
		+ '</table>'
		+ '</div>'
		+ '<div class="full"><h6 class="text-primary font-weight-bold mb-1">FEE SCHEDULE</h6></div>'
		+ '<div class="full"style="overflow-x:auto">'
		+ '<table class="table table-bordered mb-1" id="paymentScheduleTablePartial" style="display:none;min-width:560px">'
		+ '<thead>'
		+ '<tr class="bg-primary text-white">'
		+ '<th>S.No.</th>'
		+ '<th style="width:130px">SCHEDULE DATE</th>'
		+ '<th>PAYMENT TITLE</th>'
		+ '<th width="80px">TOTAL FEE</th>';
	if (responseData != '' && responseData['alreadyPaid']) {
		html += '<th width="100px">PAID DATE</th>';
	} else {
		html += '<th width="100px">PAYING NOW</th>';
	}
	html+='<th width="80px">PAYMENT LINK</th>'
	html +=
		'</tr>'
		+ '</thead>'
	+ '<tbody>';
	if (responseData != '' && responseData.schedulePayments != null) {
		$.each(responseData.schedulePayments, function (k, installment) {
			if (k == 0) {
				$('#firstInstallment').val(getNumberWithPrecision(installment.payAmount, 2));
			}
			html +=
				'<tr updid="' + installment.id + '">'
						+ '<td class="text-center">' + (k + 1) + '.</td>';
						if (responseData['alreadyPaid']) {
							html += '<td>' + installment.schedulePayDate + '</td>';
						} else {
							html += '<td><input type="text" id="installment' + (k + 1) + '" class="form-control ' + (k == 0 ? 'dataPicker' : '') + ' schedulePayDate" value=""/></td>';
						}
						html +='<td class="paymentTitle">' + installment.paymentTitle + '</td>'
							+ '<td class="text-right installment3 scheduleFee">' + installment.payAmount + '</td>';
						if (responseData['alreadyPaid'] != undefined) {
							html += '<td class="text-right">' + installment.paymentDate + '</td>';
						} else {
							html += '<td>SCHEDULED</td>';
						}
						// if(!responseData['alreadyPaid']){
						// 	html+='<td>safd</td>';
						// }
						if(installment.paymentLink) {
							html += '<td class="text-center" id="paymentLink'+(k+1)+'">'
								+'<span>'
									+'<input type="text" id="paymentCopyLink'+(k+1)+'" style="float:right; opacity:0; height:0;padding:0;" value="'+installment.paymentLink+'">'
									+'<a href="javascript:void(0)" class="btn btn-primary btn-sm" onclick="copyToClipboard(\'paymentCopyLink' + (k+1) + '\')"><i class="fa fa-clone" aria-hidden="true">Copy Payment Link</i></a>'
								+'</span>'
							+'</td>';
						} else {
							html +='<td class="text-center" id="paymentLink"'+(k+1)+'>NA</td>';
						}
			html +='</tr>';
		});
	}
	html +=
		'</tbody>'
		+ '</table>'
		+ '</div>'
		+ '<div class="full">'
		+ '<table class="table table-bordered" id="paymentInstallmentTable" style="display:none">'
		+ '<thead>'
		+ '<tr class="bg-primary text-white">'
		+ '<th width="400px">DESCRIPTION</th>'
		+ '<th>TOTAL FEE</th>'
		+ '<th>PAYING NOW</th>'
		+ '</tr>'
		+ '</thead>'
		+ '<tbody>'
		+ '</tbody>'
		+ '</table>'
		+ '</div>'
		+ '</div>'
		+ '</div>';
	return html;
}
function getPaymentOptionDetails(planDiscount, alreadyPaid) {
	var html =
		'<option value="a_annually" planDiscount="' + planDiscount + '" alreadyPaid="' + alreadyPaid + '">One Time</option>'
		+ '<option value="a_installment" planDiscount="0.00" alreadyPaid="' + alreadyPaid + '">Installment</option>'
		+ '<option value="a_partially" planDiscount="0.00" alreadyPaid="' + alreadyPaid + '">Partial Payment</option>';
	return html;
}

function validateAdvancePayment(){
	if($('#learningProgram').val()==''){
		showMessageTheme2(0, 'Select Learning Program', '', false);
		return false;
	}
	showWarningMessageShow('Are you sure you want to save the advance payment details? Please note you will not be able to edit them once saved.','saveAdvanceFeeDetails(\'C\')',false)
}