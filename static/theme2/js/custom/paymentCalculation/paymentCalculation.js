var currency = '$ ';
if (SCHOOL_ID == 5) {
	currency = 'R ';
}

function getRequestForPaymentDetails() {
	var paymentCalculationRequest = {};
	paymentCalculationRequest['uniqueId'] = UNIQUEUUID;
	paymentCalculationRequest['userId'] = $('#studentDetailsId').attr('userId')
	paymentCalculationRequest['studentStandardId'] = $('#studentDetailsId').attr('studentStandardId')
	return paymentCalculationRequest;
}

function getPaymentDetails() {
	customLoader(true);
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLForHTML('dashboard', 'custom-fee-calculation-process/'),
		data: JSON.stringify(getRequestForPaymentDetails()),
		dataType: 'json',
		global: false,
		success: function (data) {
			customLoader(false);
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if (data['status'] == '3') {
					redirectLoginPage()
				} else {
					if (data['statusCode'] == 'E002') {
						$('#eligible').hide();
						$('#notEligible').show();
						$('.studentDetails').html(data['message'])
					} else {
						$('#eligible').show();
						$('#notEligible').hide();
						showMessageTheme2(0, data['message'], '', true);
					}
				}
			} else {
				$('#eligible').show();
				$('#notEligible').hide();
				var paymentDetails = data['paymentDetails'];
				var customPlan = paymentDetails['customPlan'];
				var studentDetails = paymentDetails['studentDetails'];
				var selectedCourseDetails = paymentDetails['selectedCourseDetails'];
				$('.studentDetails').html(studentDetails['enrollmentType'] + ' | ' + studentDetails['grade'] + ' | ' + studentDetails['learingPlan'] + ' | ' + studentDetails['studentName']);
				var thead = '<tr><th>S.No</th><th>Course Name</th><th class="text-center">AP/H/REG/ADV</th><th class="text-right">Credit</th><th class="text-right">Course Fee</th><th class="text-right">Material Fee</th></tr>'
				$("#selectedCourses thead").append(thead);

				var sno = 0;
				$.each(selectedCourseDetails['courses'], function (k, v) {
					sno += 1;
					var tr = '<tr><td>' + sno + '</td><td>' + v.name + '</td><td class="text-center">' + v.courseType + '</td><td class="text-right">' + v.creditLimit.toFixed(1) + '</td><td class="text-right">' + v.courseFeeString + '</td><td class="text-right">' + v.materialFeeString + '</td></tr>'
					$("#selectedCourses tbody").append(tr);
				});
				var tr = '<tr><td colspan="3" class="text-right"><b>Total:</b></td><td class="text-right"><b>' + parseFloat(selectedCourseDetails['totalCredits']).toFixed(1) + '</b></td><td class="text-right"><b></b></td><td class="text-right"><b></b></td></tr>'
				$("#selectedCourses tbody").append(tr);
				$('#defaultPlanName').html(selectedCourseDetails['defaultPlanName'])
				$('#enrollmentFeeString').html(selectedCourseDetails['enrollmentFeeString'])
				$('#bookAnEnrollmentFeeString').html(selectedCourseDetails['bookAnEnrollmentFeeString'])
				if (selectedCourseDetails['bookAnEnrollmentStatus']['expiryStatus'] == 'expired') {
					$('.enrollmentFeePaidType').html('(expired)');
				} else if (selectedCourseDetails['bookAnEnrollmentStatus']['expiryStatus'] == 'nonExpired') {
					$('.enrollmentFeePaidType').html('(Paid - Expiry date: ' + selectedCourseDetails['bookAnEnrollmentStatus']['expiryDate'] + ')');
				} else {
					$('.enrollmentFeePaidType').html('(Not Paid)');
				}
				$('#courseFeeString').html(selectedCourseDetails['courseFeeString'])
				$('#planDiscountString').html(selectedCourseDetails['planDiscountString'])
				$('#scholarshipDiscountString').html(selectedCourseDetails['scholarshipDiscountString'])
				$('#extraCourseFeeString').html(selectedCourseDetails['extraCourseFeeString'])
				$('#materialFeeString').html(selectedCourseDetails['materialFeeString'])
				$('.payableFeeString').html(selectedCourseDetails['payableFeeString'])

				$('#minimumPayment').html(customPlan['firstPaymentAmount'])
				$('#firstInstallmentHidden').val(customPlan['firstPaymentAmount'])
				$('#paymentModeHidden').val(selectedCourseDetails['paymentMode'])
				$('#planDiscountHidden').val(selectedCourseDetails['planDiscount'])
				$('#materialFeeHidden').val(selectedCourseDetails['materialFee'])
				$('#payableFeeHidden').val(selectedCourseDetails['payableFee'])
				if (selectedCourseDetails['userOnProgresss']) {
					$('.enrollmentFeeStringDiv').hide();
					$('.bookAnEnrollmentFeeStringDiv').css('display', 'table-row');
				} else {
					$('.enrollmentFeeStringDiv').css('display', 'table-row');
					$('.bookAnEnrollmentFeeStringDiv').hide();
				}
				if (selectedCourseDetails['paymentMode'] == 'annually') {
					$('#payableFeeAnnually').val(selectedCourseDetails['payableFee'].toFixed(2))
					$('#payableFeeInstallment').val(parseFloat(selectedCourseDetails['payableFee'] + selectedCourseDetails['planDiscount']).toFixed(2))
					$('#payableFee').val($('#payableFeeAnnually').val())
				} else {
					$('#payableFeeAnnually').val(parseFloat(selectedCourseDetails['payableFee'] - selectedCourseDetails['planDiscount']).toFixed(2))
					$('#payableFeeInstallment').val(selectedCourseDetails['payableFee'].toFixed(2))
					$('#payableFee').val($('#payableFeeInstallment').val())
				}
				console.log('bookAnEnrollmentStatus: ' + selectedCourseDetails['bookAnEnrollmentStatus'])

				$('#customePlanId').val(customPlan['customePlanId']);
				$('#studentStandardId').val(customPlan['studentStandardId']);

				$('#customPaymentPlan').html('<option value="c_annually">Advantage Plan</option><option value="c_installment">Easy Plan</option>')
				$('#customPaymentPlan').val(customPlan['customPlanNamme']);

				$('#premiumPercentage').val(customPlan['premiumPercentage'].toFixed(2) + '%');
				$('#premiumAmount').val(customPlan['premiumAmount'].toFixed(2))
				$('#payableFeeAfterPremium').val(customPlan['payableFeeAfterPremium'].toFixed(2))
				$('#discountPercentage').val(customPlan['discountPercentage'].toFixed(2) + '%');
				$('#discountAmount').val(customPlan['discountAmount'].toFixed(2))
				$('#payableFeeAfterDiscount').val(customPlan['payableAmountAfterDiscount'].toFixed(2))

				$('#firstInstallmentPercentage').val(customPlan['firstPaymentPercentage'].toFixed(2) + '%');
				$('#firstInstallment').val(customPlan['firstPaymentAmount'].toFixed(2))
				$('#remainingPayableFee').val(customPlan['remainingAmount'].toFixed(2))

				$('#noOfInstallment').html('<option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option>');
				$('#noOfInstallment').val(customPlan['noOfInstallment'])
				$('#durationWithin').html('<option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option>');
				$('#durationWithin').val(customPlan['durationWithin'])
				$('#gapBetweenTwoIntstallment').val(customPlan['gapBetweenTwoIntstallment'])
				$('#tentativeFirstPayDate').val(customPlan['tentativeFirstPayDate'])

				$('#discountApplicableFor').val(customPlan['discountApplicableFor'])

				if (customPlan['customePlanId'] == 0) {
					customPlanChange()
					generateDiscountApplicableFor(true)
				} else {
					generateDiscountApplicableFor(false)
					if (paymentDetails['schedulePayments'] != null) {
						$('#paymentScheduleDiv').show();
						var index = 0;
						var totalPayableFee = 0.0;
						$.each(paymentDetails['schedulePayments'], function (k, v) {
							index += 1;
							singleIntallment(v.id, index, v.schedulePayDate, v.paymentTitle, v.payAmount,v.paymentLink, true);
							totalPayableFee += v.payAmount;
						});
						totalPayableFee = parseFloat(totalPayableFee).toFixed(2);
						singleIntallment('', '', '', '', totalPayableFee,'', false)
					} else {
						generateSchedule();
					}
				}
				if (customPlan['status'] != 'C') {
					var confirmFunction = "showWarningMessageShow('Are you sure you want to save the payment details? Please note you will not be able to edit them once saved.','saveCustomPaymentPlan(\\\'C\\\')',false)";
					//<button class="btn btn-success btn-sm mr-1" onClick="saveCustomPaymentPlan(\'S\')">Save</button>
					$('#saveNConfirm').html('<button class="btn btn-outline-success btn-sm" onClick="' + confirmFunction + '">Save & Confirm</button>')
				} else {
					$('.card-body *').prop('disabled', true);
					var confirmFunction = "showWarningMessageShow('Are you sure you want to delete the custom payment details?','saveCustomPaymentPlan(\\\'D\\\')',false)";
					$('#saveNConfirm').html('<button class="btn btn-danger btn-sm" onClick="' + confirmFunction + '">Delete custom payment</button>')
				}
			}
		},
		error: function (e) {
			if (checkonlineOfflineStatus()) {
				return;
			}else{
				showMessageTheme2(0, e.responseText, '', true);
			}
		}
	});
}

function customPlanChange() {
	var payableFee = $('#payableFee').val()
	var planDiscount = $('#planDiscountHidden').val()
	var paymentMode = $('#paymentModeHidden').val()
	var customPaymentPlan = $('#customPaymentPlan').val()
	console.log('payableFee ' + payableFee)
	console.log('planDiscount ' + planDiscount)
	console.log('paymentMode ' + paymentMode)
	console.log('customPaymentPlan ' + customPaymentPlan)
	if (customPaymentPlan == 'c_annually') {
		if (paymentMode == 'annyally') {
			$('#payableFee').val($('#payableFeeInstallment').val())
		} else {
			$('#payableFee').val($('#payableFeeAnnually').val())
		}
	} else if (customPaymentPlan == 'c_installment') {
		if (paymentMode == 'annyally') {
			$('#payableFee').val($('#payableFeeAnnually').val())
		} else {
			$('#payableFee').val($('#payableFeeInstallment').val())
		}
	}
	calculatePremiumAmount();
}

function calculatePremiumAmount() {
	var payableFee = $('#payableFee').val();
	var premiumAmount = $('#premiumAmount').val();
	if (premiumAmount == '') {
		premiumAmount = 0.00;
	} else if (parseFloat(premiumAmount) > parseFloat(payableFee)) {
		premiumAmount = payableFee;
	}
	var premiumPercentage = parseFloat((premiumAmount * 100) / payableFee);
	var payableFeeAfterPremium = parseFloat(payableFee) + parseFloat(premiumAmount);
	$('#payableFeeAfterPremium').val(parseFloat(payableFeeAfterPremium).toFixed(2));
	$('#premiumAmount').val(premiumAmount);
	$('#premiumPercentage').val(parseFloat(premiumPercentage).toFixed(2) + '%');
	calculateDiscountAmount();
}

function premiumPercentageChange() {
	var premiumPercentage = $('#premiumPercentage').val()
	var payableFee = $('#payableFee').val();
	if (premiumPercentage == '') {
		premiumPercentage = 0.00;
	} else if (parseFloat(premiumPercentage) > parseFloat(100.00)) {
		premiumPercentage = 100.00;
	}
	var premiumAmount = parseFloat((payableFee * premiumPercentage * 0.01));
	$('#premiumAmount').val(premiumAmount.toFixed(2))
	var payableFeeAfterPremium = parseFloat(payableFee) + parseFloat(premiumAmount);
	$('#payableFeeAfterPremium').val(parseFloat(payableFeeAfterPremium).toFixed(2))
	$('#premiumPercentage').val(parseFloat(premiumPercentage).toFixed(2));
}

function calculateDiscountAmount() {

	var payableFeeAfterPremium = $('#payableFeeAfterPremium').val();
	var discountAmount = $('#discountAmount').val();
	if (discountAmount == '') {
		discountAmount = 0.00;
	} else if (parseFloat(discountAmount) > parseFloat(payableFeeAfterPremium)) {
		discountAmount = payableFeeAfterPremium
	}
	var discountPercentage = parseFloat((discountAmount * 100) / payableFeeAfterPremium);
	var payableFeeAfterDiscount = payableFeeAfterPremium - discountAmount;
	$('#payableFeeAfterDiscount').val(parseFloat(payableFeeAfterDiscount).toFixed(2))
	$('#discountAmount').val(discountAmount);
	$('#discountPercentage').val(parseFloat(discountPercentage).toFixed(2) + '%');
	firstIntallmentFlatChange();
}

function discountercentageChange() {
	var discountPercentage = $('#discountPercentage').val()
	var payableFeeAfterPremium = $('#payableFeeAfterPremium').val();
	if (discountPercentage == '') {
		discountPercentage = 0.00;
	} else if (parseFloat(discountPercentage) > parseFloat(100.00)) {
		discountPercentage = 100.00;
	}
	var discountAmount = parseFloat((payableFeeAfterPremium * discountPercentage * 0.01));
	var payableFeeAfterDiscount = parseFloat(payableFeeAfterPremium) - parseFloat(discountAmount);
	$('#payableFeeAfterDiscount').val(parseFloat(payableFeeAfterDiscount).toFixed(2))
	$('#discountAmount').val(parseFloat(discountAmount).toFixed(2));
	$('#discountPercentage').val(parseFloat(discountPercentage).toFixed(2));
}

function firstIntallmentFlatChange() {
	var firstInstallment = $('#firstInstallment').val();
	var payableFeeAfterDiscount = $('#payableFeeAfterDiscount').val();
	var firstInstallmentHidden = $('#firstInstallmentHidden').val();
	if (firstInstallment == '') {
		firstInstallment = firstInstallmentHidden;
		$('#firstInstallment').val(firstInstallment);
	} else if (parseFloat(firstInstallment) < parseFloat(firstInstallmentHidden)) {
		firstInstallment = firstInstallmentHidden;
		$('#firstInstallment').val(firstInstallment);
	} else if (parseFloat(firstInstallment) > parseFloat(payableFeeAfterDiscount)) {
		firstInstallment = payableFeeAfterDiscount
		$('#firstInstallment').val(firstInstallment);
	}
	var remainingPayableFee = parseFloat(payableFeeAfterDiscount) - parseFloat(firstInstallment)
	$('#remainingPayableFee').val(parseFloat(remainingPayableFee).toFixed(2))
	var firstInstallmentPercentage = parseFloat((firstInstallment * 100) / payableFeeAfterDiscount);
	$('#firstInstallmentPercentage').val(parseFloat(firstInstallmentPercentage).toFixed(2) + '%');
	generateInstallments();
}
function firstIntallmentPercentageChange() {
	var firstInstallmentPercentage = $('#firstInstallmentPercentage').val()
	var payableFeeAfterDiscount = $('#payableFeeAfterDiscount').val();
	var firstInstallment = parseFloat((payableFeeAfterDiscount * firstInstallmentPercentage * 0.01));
	$('#firstInstallment').val(firstInstallment.toFixed(2))
	var remainingPayableFee = parseFloat(payableFeeAfterDiscount) - parseFloat(firstInstallment)
	$('#remainingPayableFee').val(parseFloat(remainingPayableFee).toFixed(2))
}

function generateInstallments() {
	generateInstallmentsWithinDuration()
	generateDiscountApplicableFor(true)
}

function generateInstallmentsWithinDuration() {
	var noOfInst = $('#noOfInstallment').val()
	var gapBetweenTwoIntstallment = 1;
	if (noOfInst == 1) {

	} else {
		var durationWithin = $('#durationWithin').val()
		var noOfDays = durationWithin * 30;
		gapBetweenTwoIntstallment = parseFloat(noOfDays / (noOfInst)).toFixed(0)
	}
	$('#gapBetweenTwoIntstallment').val(gapBetweenTwoIntstallment)
}

function generateDiscountApplicableFor(flag) {
	var noOfInst = $('#noOfInstallment').val()
	var options = '<option value="D">Distribute on all remaining installment</option>'
	for (startIndex = 2; startIndex <= noOfInst; startIndex++) {
		if (startIndex == 1) {
			options += '<option value="1">1st Installment</option>';
		} else if (startIndex == 2) {
			options += '<option value="2">2nd Installment</option>';
		} else if (startIndex == 3) {
			options += '<option value="3">3rd Installment</option>';
		} else if (startIndex == 4) {
			options += '<option value="4">4th Installment</option>';
		} else if (startIndex == 5) {
			options += '<option value="5">5th Installment</option>';
		} else if (startIndex == 6) {
			options += '<option value="6">6th Installment</option>';
		} else if (startIndex == 7) {
			options += '<option value="7">7th Installment</option>';
		} else if (startIndex == 8) {
			options += '<option value="8">8th Installment</option>';
		} else if (startIndex == 9) {
			options += '<option value="9">9th Installment</option>';
		} else if (startIndex == 10) {
			options += '<option value="10">10th Installment</option>';
		}
	}
	$('#discountApplicableFor').html(options)
	if (flag) {
		generateSchedule()
	}
}

function generateSchedule() {
	$('#paymentScheduleDiv').show();
	$("#paymentScheduleTable tbody").html('');
	var noOfInst = ($('#noOfInstallment').val() - 1)
	var gapBetweenTwoIntstallment = $('#gapBetweenTwoIntstallment').val()
	var durationWithin = $('#durationWithin').val()
	//var scheduleDate=$('#tentativeFirstPayDate').val()
	var scheduleDate = getDateInDateFormat($('#tentativeFirstPayDate').val())
	//scheduleDate = new Date(scheduleDate[2], scheduleDate[0]-1, scheduleDate[1]);

	var payableFeeAfterPremium = $('#payableFeeAfterPremium').val();
	var firstInstallment = $('#firstInstallment').val();
	var remainingPayableFee = parseFloat(payableFeeAfterPremium) - parseFloat(firstInstallment);

	var discountAmount = $('#discountAmount').val();
	var payableFeeAfterDiscount = $('#payableFeeAfterDiscount').val();
	var discountApplicableFor = $('#discountApplicableFor').val();
	var intallmentFee = 0.00
	var totalFeeForInstallments = 0.00;
	if (discountApplicableFor == 'D') {
		totalFeeForInstallments = parseFloat(remainingPayableFee) - parseFloat(discountAmount);
	} else {
		totalFeeForInstallments = parseFloat(remainingPayableFee);
	}
	intallmentFee = parseFloat(totalFeeForInstallments / noOfInst);
	// if(discountApplicableFor=='D'){
	// 	intallmentFee=parseFloat(totalFeeForInstallments/noOfInst).toFixed(2)
	// }else{
	// 	intallmentFee=parseFloat(totalFeeForInstallments/noOfInst).toFixed(2)
	// }

	var totalPayableFee = 0.00
	for (index = 1; index <= (noOfInst + 1); index++) {
		var scheduleFee = '';
		if (index == 1) {
			scheduleFee += parseFloat(firstInstallment).toFixed(2);
			totalPayableFee += parseFloat(firstInstallment);
		} else {
			scheduleDate.setDate((parseInt(scheduleDate.getDate()) + parseInt(gapBetweenTwoIntstallment)))
			if (discountApplicableFor == 'D') {
				scheduleFee += intallmentFee.toFixed(2);
				totalPayableFee += parseFloat(intallmentFee);
			} else {
				if (discountApplicableFor == index) {
					scheduleFee += (intallmentFee - discountAmount).toFixed(2);
					totalPayableFee += parseFloat(intallmentFee - discountAmount);
				} else {
					scheduleFee += intallmentFee.toFixed(2);
					totalPayableFee += parseFloat(intallmentFee);
				}
			}
		}
		singleIntallment(index, index, changeDateFormat(scheduleDate, 'MMM-dd-yyyy'), getPaymentTitleCalculation(index, durationWithin), scheduleFee,'', true)
	}
	totalPayableFee = parseFloat(totalPayableFee).toFixed(2);
	singleIntallment('', '', '', '', totalPayableFee,'', false)
}

function getPaymentTitleCalculation(index, durationWithin) {
	var gradeName = "Course Fee";
	if($("#forGradeId option:selected").text()!=undefined && $("#forGradeId option:selected").text()!=null && $("#forGradeId option:selected").text()!=''){
		gradeName = $("#forGradeId option:selected").text();
	}
	var gradeNameCustom = $(".studentDetails").text();
	if(gradeNameCustom!=undefined && gradeNameCustom!=null && gradeNameCustom!=''){
		var data = [];
		data = gradeNameCustom.split("|");
		gradeName = data[1];
	}
	if ($('#noOfInstallment').val() == 1) {
		return gradeName+' - One Time Payment';
	}
	if (index == 1) {
		return gradeName+' - 1<sup>st</sup> of ' + durationWithin + ' Months Installment';
	} else if (index == 2) {
		return gradeName+' - 2<sup>nd</sup> of ' + durationWithin + ' Months Installment';
	} else if (index == 3) {
		return gradeName+' - 3<sup>rd</sup> of ' + durationWithin + ' Months Installment';
	} else if (index == 4) {
		return gradeName+' - 4<sup>th</sup> of ' + durationWithin + ' Months Installment';
	} else if (index == 5) {
		return gradeName+' - 5<sup>th</sup> of ' + durationWithin + ' Months Installment';
	} else if (index == 6) {
		return gradeName+' - 6<sup>th</sup> of ' + durationWithin + ' Months Installment';
	} else if (index == 7) {
		return gradeName+' - 7<sup>th</sup> of ' + durationWithin + ' Months Installment';
	} else if (index == 8) {
		return gradeName+' - 8<sup>th</sup> of ' + durationWithin + ' Months Installment';
	} else if (index == 9) {
		return gradeName+' - 9<sup>th</sup> of ' + durationWithin + ' Months Installment';
	} else if (index == 10) {
		return gradeName+' - 10<sup>th</sup> of ' + durationWithin + ' Months Installment';
	}
}

function singleIntallment(id, index, scheduleDate, paymentTitle, scheduleFee, paymentLink, islastRow) {
	var tr = '<tr>'
		+ '<td class="text-center" id="updid' + id + '">' + index + '</td>';
	if (islastRow) {
		tr += '<td class="text-center schedulePayDate" style="max-width:96px">'
			+ '<input type="text" placeholder="Please select schedule date" class="paymentScheduleDate" value="' + scheduleDate + '" style="max-width:96px"/>'
			+ '</td>';
	} else {
		tr += '<td class="text-center schedulePayDate">&nbsp;</td>';
	}
	if (islastRow) {
		tr += '<td class="text-center paymentTitle" >' + paymentTitle + '</td>';
	} else {
		tr += '<td class="text-right paymentTitle" >Calculated Course Fee</td>';
	}

	if (islastRow) {
		tr += '<td class="text-right scheduleFeeInput" style="max-width:100px">'
			+ '<span class="d-flex align-items-center">'
			+ currency + '<input type="text" class="text-right ml-1 installmentValue" id="' + id + '-installmentValue" value="' + scheduleFee + '" style="max-width:80px" onblur="totalInstallmentAmount(\'paymentScheduleTable\',\'totalFeeAlternate\')"/>'
			+ '<span>'
			+ '</td>';
	} else {
			if(id == '' ){
				tr += '<td class="text-right scheduleFee">' + currency + '<span id="totalFeeAlternate">' + scheduleFee + '</span>' + '</td>';
			}else{
				tr += '<td class="text-right scheduleFee">' + currency + '<span>' + scheduleFee + '</span>' + '</td>';
			}
	}
	if (islastRow) {
		tr += '<td class="text-center" id="paymentLink' + index + '">';
		if(paymentLink!=null && paymentLink!=''){
			tr+='<span><input type="text" id="paymentCopyLink' + index + '" style="float:right; opacity:0; height:0;padding:0;" value="'+paymentLink+'">'+'<a href="javascript:void(0)" class="btn btn-primary btn-sm" onclick="copyToClipboard(\'paymentCopyLink' + index + '\')"><i class="fa fa-clone" aria-hidden="true">Copy Payment Link</i></a></span>';
		}else{
			tr+='NA';
		}
		+'</td>';
	}else{
		tr += '<td class="text-center">&nbsp;</td>';
	}
	tr += '</tr>';
	$("#paymentScheduleTable tbody").append(tr);
	$(".paymentScheduleDate").datepicker({
		startDate: new Date(),
		format: 'M d, yyyy',
		todayHighlight: true
	});
}


function totalInstallmentAmount(tableID, totalFeeElement) {
	var totalAmountIndividual = 0.00
	$('#' + tableID + ' tbody tr td.scheduleFeeInput .installmentValue').each(function () {
		totalAmountIndividual = parseFloat(parseFloat(totalAmountIndividual) + parseFloat($(this).val())).toFixed(2)
	});
	$('#' + tableID + ' #' + totalFeeElement).text(totalAmountIndividual)
	var paymentMode = $('#paymentMode').val();
	if (paymentMode == 'a_annually') {
	} else if (paymentMode == 'a_installment') {
		$('.ad_installment1').html(currency + getNumberWithPrecision($('#ad_installment1').val(), 2));
	} else if (paymentMode == 'a_partially') {
	}
}

function generatePercentage(elementId, start, end, diff) {
	var options = '<option value="0.00">Select</option>'
	for (index = start; end >= index;) {
		options += '<option value="' + index.toFixed(2) + '">' + (index * 100).toFixed(0) + '%</option>'
		index += parseFloat(diff)
	}
	$('#' + elementId).html(options);
}

function saveCustomPaymentPlan(status) {
	if(status=='D'){

	}else{
		var totalAmount = $('#totalFeeAlternate').text();
		if (parseFloat(totalAmount) != parseFloat($("#payableFeeAfterDiscount").val())) {
			showMessageTheme2(0, 'Please note the Calculated Course Fee and the Net Payable Fee do not match');
			return false;
		}
	}
	customLoader(true);
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLForHTML('dashboard', 'custom-fee-calculation-save/'),
		data: JSON.stringify(getRequestForSaveCustomPaymentPlan(status)),
		dataType: 'json',
		global: false,
		success: function (data) {
			customLoader(false);
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if (data['status'] == '3') {
					redirectLoginPage()
				} else {
					showMessageTheme2(0, data['message'], '', true);
				}
			} else {
				setCopyPaymentLink(data.paymentLinks)
				showMessageTheme2(1, data['message'], '', true);
				if (status == 'C') {
					$('.card-body *').prop('disabled', true);
				} else if (status == 'D') {
					$('#saveNConfirm').html('');
					setTimeout(function () {
						window.location.reload();
					}, 2000);
				}
			}
		},
		error: function (e) {
			if (checkonlineOfflineStatus()) {
				return;
			}else{
				showMessageTheme2(0, e.responseText, '', true);
			}
		}
	});
}

function setCopyPaymentLink(paymentListArray){
	if(paymentListArray!=null && paymentListArray.length>0){
		for(i=0;i<paymentListArray.length;i++){
			$("#paymentLink"+(i+1)).html('<span>'+'<input type="text" id="paymentCopyLink' + (i+1) + '" style="float:right; opacity:0; height:0;padding:0;" value="'+paymentListArray[i]+'">'+'<a href="javascript:void(0)" class="btn btn-primary btn-sm" onclick="copyToClipboard(\'paymentCopyLink' + (i+1) + '\')"><i class="fa fa-clone" aria-hidden="true">Copy Payment Link</i></a>'+'</span>');
		}
	}
}
function getRequestForSaveCustomPaymentPlan(status) {
	var request = {};
	var saveCustomPlan = {};
	saveCustomPlan['Id'] = $('#customePlanId').val();
	saveCustomPlan['schoolId'] = SCHOOL_ID
	saveCustomPlan['studentStandardId'] = $('#studentStandardId').val();

	
	saveCustomPlan['payableFee'] = $('#payableFee').val();
	saveCustomPlan['firstPaymentType'] = $('#firstPaymentType').val();
	saveCustomPlan['firstPaymentPercentage'] = $('#firstInstallmentPercentage').val().replace('%', '');
	saveCustomPlan['firstPaymentAmount'] = $('#firstInstallment').val();
	saveCustomPlan['remainingAmount'] = $('#remainingPayableFee').val();
	saveCustomPlan['premiumType'] = $('#premiumType').val();
	saveCustomPlan['premiumPercentage'] = $('#premiumPercentage').val().replace('%', '');
	saveCustomPlan['premiumAmount'] = $('#premiumAmount').val();
	saveCustomPlan['payableFeeAfterPremium'] = $('#payableFeeAfterPremium').val();
	saveCustomPlan['discountType'] = $('#discountType').val();
	saveCustomPlan['discountPercentage'] = $('#discountPercentage').val().replace('%', '');
	saveCustomPlan['discountAmount'] = $('#discountAmount').val();
	saveCustomPlan['payableAmountAfterDiscount'] = $('#payableFeeAfterDiscount').val();
	saveCustomPlan['noOfInstallment'] = $('#noOfInstallment').val();
	saveCustomPlan['durationWithin'] = $('#durationWithin').val();
	saveCustomPlan['gapBetweenTwoIntstallment'] = $('#gapBetweenTwoIntstallment').val();
	saveCustomPlan['tentativeFirstPayDate'] = $('#tentativeFirstPayDate').val();
	saveCustomPlan['discountApplicableFor'] = $('#discountApplicableFor').val();

	var schedulePayments = [];
	$("#paymentScheduleTable tbody tr").each(function () {
		if ($(this).find(".paymentScheduleDate").val() != undefined && $(this).find(".paymentScheduleDate").val() != '') {
			if ($(this).find("td:first-child").attr("id") != "updid") {
				var schedulePayment = {};
				if ($(this).attr("#id") != undefined) {
					schedulePayment['id'] = $(this).find("td:first-child").attr("id");
				}
				schedulePayment['schedulePayDate'] = $(this).find(".paymentScheduleDate").val();
				schedulePayment['paymentTitle'] = $(this).find(".paymentTitle").html();
				schedulePayment['payAmount'] = $(this).find(".installmentValue").val();
				schedulePayments.push(schedulePayment);
			}
		}
	});
	if(schedulePayments.length>1){
		saveCustomPlan['customPlanNamme'] = 'c_installment';
	}else{
		saveCustomPlan['customPlanNamme'] = 'c_annually';
	}
	var savePaymentCalculationRequest = {}
	savePaymentCalculationRequest['uniqueId'] = UNIQUEUUID;
	savePaymentCalculationRequest['status'] = status;
	savePaymentCalculationRequest['studentStandardId'] = $('#studentStandardId').val();
	savePaymentCalculationRequest['saveCustomPlan'] = saveCustomPlan;
	savePaymentCalculationRequest['schedulePayments'] = schedulePayments;
	request['request'] = savePaymentCalculationRequest;
	return request;
}

function applyGradeFee(src, controlFrom) {
	var learningProgram=$(src).val();
	console.log('learningProgram =>'+learningProgram);
	if(controlFrom=='LP'){
		if(learningProgram=='ONE_TO_ONE_FLEX' || learningProgram=='DUAL_DIPLOMA'){
			$('#courseFee').removeAttr('disabled');
		}else{
			$('#courseFee').attr('disabled','disabled');
		}
		
		if(learningProgram=='ONE_TO_ONE_FLEX'){
			actualGrades=['13','14','15','16','17'];
			$('#forGradeId').html(getGrades(getGradesData(actualGrades)));
		}else{
			actualGrades=[];
			var forGradeId=$('#forGradeIdHidden').val();
			if(learningProgram=='DUAL_DIPLOMA'){
				if(forGradeId>=10){
					actualGrades.push(forGradeId-1);
				}
				actualGrades.push(forGradeId);
			}else{
				if($('#currentLearningProgramHidden').val()=='ONE_TO_ONE_FLEX'){
					if(forGradeId==19){
						actualGrades=[1,2,3,4,5,6,7,8,9,10,11,12];
					}else if(forGradeId==9){
						actualGrades=[6,7,8,9,10,11,12];
					}else if(forGradeId==10 || forGradeId==21 || forGradeId==22){
						actualGrades=[9,10,11,12];
					}
				}else{
					actualGrades.push(forGradeId-1);
					actualGrades.push(forGradeId);
				}
			}
			$('#forGradeId').html(getGrades(getGradesData(actualGrades)));
			$("#forGradeId option").filter(function() {
				return $(this).text() =='Grade '+forGradeId;
			}).prop("selected", true);
		}
	}
	var responseData = getGradeFeeDetails();
	$('#paymentMode').val('a_annually');
	var gradeFee = responseData.standardFee;
	if (gradeFee != null) {
		var courseFee = parseFloat(gradeFee.annualFee + gradeFee.registrationFee + gradeFee.additionalFee)
		$('#courseFee').val(getNumberWithPrecision(courseFee, 2));
		$('#planDiscount').val(getNumberWithPrecision(gradeFee.annualDiscount, 2));
		if($('#learningProgram').val()=='SCHOLARSHIP' || $('#learningProgram').val()=='SSP'){
			$('#progressionDiscount').val('0.00');
		} else {
			$('#progressionDiscount').val(getNumberWithPrecision(gradeFee.progressionDiscount, 2));
		}
		var alreadyPaid = $('#paymentMode').find(':selected').attr('alreadyPaid');
		$('#alreadyPaid').val(getNumberWithPrecision(alreadyPaid, 2));
		
		$('#paymentMode').html(getPaymentOptionDetails(gradeFee.annualDiscount, alreadyPaid));
	} else {
		$('#courseFee').val('0.00');
		$('#transactionCharge').val('0.00');
		$('#progressionDiscount').val('0.00');
		$('#planDiscount').val('0.00');
		$('#additionalDiscount').val('0.00');
		$('#alreadyPaid').val('0.00');
	}
	$('#creditLimitId').html('Course Fee');
	$('#courseFee').attr('placeholder', 'Course Fee');
	calculatePayableAdvanceFee();
	getAdvanceFeeDetailsContent()
}
function getRequestForGradeFees() {
	var advancePaymentCalculationRequest = {};
	advancePaymentCalculationRequest['schoolId'] = SCHOOL_ID;
	advancePaymentCalculationRequest['gradeId'] = $('#forGradeId').val();
	advancePaymentCalculationRequest['learningProgram'] = $('#learningProgram').val()
	var courseProviderId=37;
	if($('#learningProgram').val()=='BATCH'){
		courseProviderId=38;
	}else if($('#learningProgram').val()=='SCHOLARSHIP' || $('#learningProgram').val()=='SSP'){
		if($('#forGradeId').val()>=11 && $('#forGradeId').val()>=17){
			courseProviderId=37;
		}else{
			courseProviderId=40;
		}
	}
	advancePaymentCalculationRequest['courseProviderId'] = courseProviderId;
	var request = {};
	request['request'] = advancePaymentCalculationRequest
	return request;
}

function getGradeFeeDetails() {
	var responseData = {};
	customLoader(true);
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLForHTML('dashboard', 'standard-fee/'),
		data: JSON.stringify(getRequestForGradeFees()),
		dataType: 'json',
		global: false,
		async: false,
		success: function (data) {
			customLoader(false);
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if (data['status'] == '3') {
					redirectLoginPage()
				} else {
					if (data['statusCode'] == 'E002') {
						$('#eligible').hide();
						$('#notEligible').show();
						$('.studentDetails').html(data['message'])
					} else {
						$('#eligible').show();
						$('#notEligible').hide();
						showMessageTheme2(0, data['message'], '', true);
					}
				}
			} else {
				responseData = data;
			}
		},
		error: function (e) {
			if (checkonlineOfflineStatus()) {
				return;
			}else{
				showMessageTheme2(0, e.responseText, '', true);
			}
		}
	});
	return responseData;
}

function getRequestForAdvancePaymentDetails(studentStandardId) {
	var advancePaymentCalculationRequest = {};
	advancePaymentCalculationRequest['uniqueId'] = UNIQUEUUID;
	advancePaymentCalculationRequest['studentStandardId'] = studentStandardId;
	return advancePaymentCalculationRequest;
}

function getAdvancePaymentDetails(studentStandardId) {
	var responseData = {};
	customLoader(true);
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLForHTML('dashboard', 'advance-fee-calculation-process/'),
		data: JSON.stringify(getRequestForAdvancePaymentDetails(studentStandardId)),
		dataType: 'json',
		global: false,
		async: false,
		success: function (data) {
			customLoader(false);
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if (data['status'] == '3') {
					redirectLoginPage()
				} else {
					if (data['statusCode'] == 'E002') {
						$('#eligible').hide();
						$('#notEligible').show();
						$('.studentDetails').html(data['message'])
					} else {
						$('#eligible').show();
						$('#notEligible').hide();
						showMessageTheme2(0, data['message'], '', true);
					}
				}
			} else {
				responseData = data;
			}
		},
		error: function (e) {
			if (checkonlineOfflineStatus()) {
				return;
			} else {
				showMessageTheme2(0, e.responseText, '', true);
			}
		}
	});
	return responseData;
}

function getAdvanceFeeDetailsContent() {
	var selectedPlan = $('#paymentMode').val();
	var planDiscount = $('#paymentMode').find(':selected').attr('planDiscount');
	var alreadyPaid = $('#paymentMode').find(':selected').attr('alreadyPaid');
	$('#planDiscount').val(getNumberWithPrecision(planDiscount, 2));
	$('#alreadyPaid').val(getNumberWithPrecision(alreadyPaid, 2));
	calculatePayableAdvanceFee();
	getAdvanceFeeDetailsContentDetails(selectedPlan, '');
}

function getAdvanceFeeDetailsContentDetails(selectedPlan, responseData) {
	$("#oneTimeFeeContentDiv, #installmentFeeContentDiv, #partialFeeContentDiv").addClass("d-none");
	if (selectedPlan == 'a_annually') {
		$("#oneTimeFeeContentDiv").removeClass("d-none");
	} else if (selectedPlan == 'a_installment') {
		$("#installmentFeeContentDiv").removeClass("d-none");
	} else if (selectedPlan == 'a_partially') {
		$("#partialFeeContentDiv").removeClass("d-none")
	}
	recalculateAccourdingToSelectedPlan(selectedPlan, responseData);
}

function recalculateAccourdingToSelectedPlan(selectedPlan, responseData) {
	if (selectedPlan == 'a_annually') {
		$('#oneTimeFeeContentDiv').html(getOnetimeFeeContent(responseData));
	} else if (selectedPlan == 'a_installment') {
		$('#installmentFeeContentDiv').html(getIntallmentFeeContent(responseData));
	} else if (selectedPlan == 'a_partially') {
		$('#partialFeeContentDiv').html(getPartialFeeContent(responseData));
		$('#paymentScheduleDiv').show();
		$("#paymentScheduleTablePartial").show();
		$('#noOfInstallment').html('<option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option>');
		$('#durationWithin').html('<option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option>');
		if (responseData != '' && responseData.schedulePayments != null) {
			$.each(responseData.schedulePayments, function (k, installment) {
				if (k == 0) {
					$('#firstInstallment').val(installment.payAmount);
				}
			});
			$('#noOfInstallment').val(responseData.noOfInstallment)
			$('#durationWithin').val(responseData.durationWithin)
			$('#gapBetweenTwoIntstallment').val(responseData.gapBetweenTwoIntstallment)
			// $('#tentativeFirstPayDate').val(responseData.tentativeFirstPayDate)
			$('#discountApplicableFor').val(responseData.discountApplicableFor)
		}
		generateDiscountApplicableForAdv(false);
	}
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
		// console.log(responseData)
		// if(responseData){
		// 	generateScheduleAdv(responseData);
		// }else{
		// 	generateScheduleAdv();
		// }
		generateScheduleAdv(responseData);
		
	});
	if (responseData == '') {
		$('.dataPicker').datepicker('setDate', new Date());
	} else {
		$('.dataPicker').datepicker('setDate', responseData.firstScheduledDate);
	}
	if (selectedPlan == 'a_annually' || selectedPlan == 'a_installment') {
		$("#installment1").datepicker({
			startDate: startDate,
			endDate: endDate,
			format: 'M d, yyyy',
			autoclose: true,
			todayHighlight: true
		}).on('changeDate', function () {
			if (responseData['advanceFeeStatus'] != 'C') {
				generateTentativeScheduleDate(selectedPlan);
			}
		});

		$("#installment2, #installment3").datepicker({
			startDate: startDate,
			endDate: endDate,
			format: 'M d, yyyy',
			autoclose: true,
			todayHighlight: true
		});
	}
	if (selectedPlan == 'a_annually') {

	} else if (selectedPlan == 'a_installment') {
		if (responseData['advanceFeeStatus'] != 'C') {
			generateTentativeScheduleDate(selectedPlan);
		}
	} else if (selectedPlan == 'a_partially') {
		if (responseData == '') {
			generateInstallmentsAdv();
		}
	}
}

function generateTentativeScheduleDate(selectedPlan) {
	var selectedDate = $('#installment1').val();
	if (selectedPlan == 'a_installment') {
		var scheduleDateInsallment2 = new Date(selectedDate);
		scheduleDateInsallment2.setDate(scheduleDateInsallment2.getDate() + (30 + 1));
		var scheduleDateInsallment3 = new Date(selectedDate);
		scheduleDateInsallment3.setDate(scheduleDateInsallment3.getDate() + (60 + 1));
		$('#installment2').datepicker("setDate", changeDateFormat(scheduleDateInsallment2, 'MMM-dd-yyyy'));
		$('#installment3').datepicker("setDate", changeDateFormat(scheduleDateInsallment3, 'MMM-dd-yyyy'));
	} else if (selectedPlan == 'a_partially') {

	}
}

function calculatePayableAdvanceFee() {
	var courseFee = getVauleAsNumber('courseFee');
	var transactionCharge = getVauleAsNumber('transactionCharge');
	var progressionDiscount = getVauleAsNumber('progressionDiscount');
	var planDiscount = getVauleAsNumber('planDiscount');
	var additionalDiscount = 0.00;//getVauleAsNumber('additionalDiscount');
	var alreadyPaid = getVauleAsNumber('alreadyPaid');
	var payableFee = parseFloat(courseFee) + parseFloat(transactionCharge) - parseFloat(progressionDiscount) - parseFloat(planDiscount) - parseFloat(additionalDiscount) - parseFloat(alreadyPaid);
	if (parseFloat(getVauleAsNumber('additionalDiscount')) >= parseFloat(payableFee)) {
		$('#payableFee').html('<b>0.00</b>');
	} else {
		$('#payableFee').html('<b>' + getNumberWithPrecision(parseFloat(payableFee) - parseFloat(getVauleAsNumber('additionalDiscount')), 2) + '</b>');
	}
	$('#payableFee').attr('payableFee-data', payableFee)

	var selectedPlan = $('#paymentMode').val();
	if (selectedPlan == 'a_annually') {
		var additionalDiscount = getVauleAsNumber('additionalDiscount');
		if (additionalDiscount <= payableFee) {
			payableFee = parseFloat(payableFee) - parseFloat(additionalDiscount);
		} else {
			payableFee = 0.0;
		}
		$('.installment1, .scheduleFee').val(getNumberWithPrecision(payableFee, 2));
		$('#ad_installment1').val(getNumberWithPrecision(payableFee, 2));
		$('.ad_installment1').html(currency + getNumberWithPrecision(payableFee, 2));
	} else if (selectedPlan == 'a_installment') {
		var payableFee = parseFloat($('#payableFee').attr('payableFee-data'));
		var installment1 = parseFloat(payableFee) * 0.40;
		var installment2 = parseFloat(payableFee) * 0.30;
		var installment3 = parseFloat(payableFee) * 0.30;
		var additionalDiscount = getVauleAsNumber('additionalDiscount');
		if (additionalDiscount > 0) {
			if (additionalDiscount <= installment3) {
				installment3 = parseFloat(installment3) - parseFloat(additionalDiscount);
			} else {
				additionalDiscount = parseFloat(additionalDiscount) - parseFloat(installment3);
				if (additionalDiscount <= installment2) {
					installment2 = parseFloat(installment2) - parseFloat(additionalDiscount)
					installment3 = 0.0;
				} else {
					additionalDiscount = parseFloat(additionalDiscount) - parseFloat(installment2) - parseFloat(installment3);
					if (additionalDiscount <= installment1) {
						installment1 = parseFloat(installment1) - parseFloat(additionalDiscount)
						installment2 = 0.00;
						installment3 = 0.00;
					} else {
						installment1 = 0.00;
						installment2 = 0.00;
						installment3 = 0.00;
					}
				}
			}
		}
		installment1 = getNumberWithPrecision(installment1, 2);
		installment2 = getNumberWithPrecision(installment2, 2);
		installment3 = getNumberWithPrecision(installment3, 2);
		$('#ad_installment1').val(installment1);
		$('#ad_installment2').val(installment2);
		$('#ad_installment3').val(installment3);
		$('.ad_installment1').html(currency + installment1);
		$('#installmentFinalPaybleFee').html($("#payableFee").text())
	} else if (selectedPlan == 'a_partially') {
		generateInstallmentsAdv();
	}
	firstIntallmentFlatChangeAdv();
}
function saveAdvanceFeeDetails(status) {
	if (status == 'D') {
		$('.card-body *').prop('disabled', false);
	}
	var paymentMode = $('#paymentMode').val();
	if (paymentMode == 'a_annually') {
		totalAmount = $('#payableFee').text()
	} else if (paymentMode == 'a_installment') {
		totalAmount = $('#installmentFinalPaybleFee').html();
	} else if (paymentMode == 'a_partially') {
		totalAmount = $('#ad_partially_fee').html();
	}
	if (status == 'D') {
		$('.card-body *').prop('disabled', true);
	}
	if ((status == 'S' || status == 'C') && parseFloat(totalAmount) != parseFloat($("#payableFee b").text())) {
		showMessageTheme2(0, 'Please note the Calculated Course Fee and the Net Payable Fee do not match')
	} else {
		var feePlan = $("#paymentMode").val();
		var firstInstallmentValue = parseFloat($("#firstInstallment").val());
		if (firstInstallmentValue != 0 || feePlan != 'a_partially') {
			customLoader(true);
			$.ajax({
				type: "POST",
				contentType: "application/json",
				url: getURLForHTML('dashboard', 'advance-fee-calculation-save/'),
				data: JSON.stringify(getRequestForSaveAdvanceFeeDetails(status)),
				dataType: 'json',
				global: false,
				success: function (data) {

					if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
						if (data['status'] == '3') {
							redirectLoginPage()
						} else {
							showMessageTheme2(0, data['message'], '', true);
						}
					} else {
						showMessageTheme2(1, data['message'], '', true);
						if (status == 'C') {
							// $('.card-body *').prop('disabled', true);
							setTimeout(function () {
								window.location.reload();
								customLoader(false);
							}, 3000);
						} else if (status == 'D') {
							$('#saveNConfirm').html('');
							setTimeout(function () {
								window.location.reload();
								customLoader(false);
							}, 2000);
						} else {
							customLoader(false);
						}
					}
				},
				error: function (e) {
					if (checkonlineOfflineStatus()) {
						return;
					} else {
						showMessageTheme2(0, e.responseText, '', true);
					}
				}
			});
		} else {
			showMessageTheme2(2, "1st Installment Fee amount can not be zero.");
		}
	}

}

function getRequestForSaveAdvanceFeeDetails(status) {
	if (status == 'D' || status == 'C') {
		$('.card-body *').prop('disabled', false);
	}
	var request = {};
	var saveAdvanceFee = {};

	saveAdvanceFee['schoolId'] = SCHOOL_ID
	saveAdvanceFee['studentStandardId'] = $('#studentDetailsId').attr('studentstandardid');

	saveAdvanceFee['learningProgram'] = $('#learningProgram').val();
	saveAdvanceFee['registrationType'] = 'REGISTRATION_NEXT_GRADE'//$('#registrationType').val();
	saveAdvanceFee['paymentMode'] = $('#paymentMode').val();
	saveAdvanceFee['forGradeId'] = $('#forGradeId').val();

	saveAdvanceFee['courseFee'] = $('#courseFee').val();
	saveAdvanceFee['transactionCharge'] = $('#transactionCharge').val();
	saveAdvanceFee['progressionDiscount'] = $('#progressionDiscount').val();
	saveAdvanceFee['planDiscount'] = $('#planDiscount').val();
	saveAdvanceFee['additionalDiscount'] = $('#additionalDiscount').val();
	saveAdvanceFee['alreadyPaid'] = $('#alreadyPaid').val();
	saveAdvanceFee['payableFee'] = $('#payableFee').attr('payableFee-data');
	var saveAdvanceFeeRequest = {}
	var schedulePayments = [];
	var elementId = '';
	if ($('#paymentMode').val() == 'a_annually') {
		elementId = 'paymentScheduleTableOnetime';
	} else if ($('#paymentMode').val() == 'a_installment') {
		elementId = 'paymentScheduleTableInstallment';
	} else if ($('#paymentMode').val() == 'a_partially') {
		elementId = 'paymentScheduleTablePartial';
		var saveAdvanceFeePartial = {}
		saveAdvanceFeePartial['noOfInstallment'] = $('#noOfInstallment').val();
		saveAdvanceFeePartial['durationWithin'] = $('#durationWithin').val();
		saveAdvanceFeePartial['gapBetweenTwoIntstallment'] = $('#gapBetweenTwoIntstallment').val();
		saveAdvanceFeePartial['tentativeFirstPayDate'] = $('#tentativeFirstPayDate').val();
		saveAdvanceFeePartial['discountApplicableFor'] = $('#discountApplicableFor').val();
		saveAdvanceFeeRequest['saveAdvanceFeePartial'] = saveAdvanceFeePartial;
	}

	$('#' + elementId + ' tbody tr').each(function () {
		if ($(this).find(".schedulePayDate").val() != undefined && $(this).find(".schedulePayDate").val() != '') {
			var schedulePayment = {};
			if ($(this).find(".id").attr('updid') != undefined) {
				schedulePayment['id'] = $(this).find(".id").attr('updid');
			}
			schedulePayment['schedulePayDate'] = $(this).find(".schedulePayDate").val();
			schedulePayment['paymentTitle'] = $(this).find(".paymentTitle").html();
			schedulePayment['payAmount'] = $(this).find(".installmentValue").val();
			schedulePayments.push(schedulePayment);
		}
	});
	saveAdvanceFeeRequest['id'] = $('#advanceFeeId').val();
	saveAdvanceFeeRequest['uniqueId'] = UNIQUEUUID;
	saveAdvanceFeeRequest['studentStandardId'] = $('#studentDetailsId').attr('studentstandardid');
	saveAdvanceFeeRequest['status'] = status;

	saveAdvanceFeeRequest['saveAdvanceFee'] = saveAdvanceFee;
	saveAdvanceFeeRequest['schedulePayments'] = schedulePayments;
	$('.card-body *:not(.card-body .btn)').prop('disabled', true);
	request['request'] = saveAdvanceFeeRequest;
	return request;
}

function firstIntallmentFlatChangeAdv() {
	var firstInstallment = $('#firstInstallment').val();
	var payableFee = $('#payableFee').attr('payableFee-data');
	var firstInstallmentHidden = $('#firstInstallmentHidden').val();
	if (firstInstallment == '') {
		firstInstallment = firstInstallmentHidden;
		$('#firstInstallment').val(firstInstallment);
	} else if (parseFloat(firstInstallment) < parseFloat(firstInstallmentHidden)) {
		firstInstallment = firstInstallmentHidden;
		$('#firstInstallment').val(firstInstallment);
	} else if (parseFloat(firstInstallment) > parseFloat(payableFee)) {
		firstInstallment = payableFee
		$('#firstInstallment').val(firstInstallment);
	}
	var remainingPayableFee = parseFloat(payableFee) - parseFloat(firstInstallment)
	$('#remainingPayableFee').val(parseFloat(remainingPayableFee).toFixed(2))
	var firstInstallmentPercentage = parseFloat((firstInstallment * 100) / payableFee);
	//$('#firstInstallmentPercentage').val(parseFloat(firstInstallmentPercentage).toFixed(2)+'%');
	generateInstallmentsAdv();
}

function generateInstallmentsAdv() {
	generateInstallmentsWithinDurationAdv()
	generateDiscountApplicableForAdv(true)
}
function generateInstallmentsWithinDurationAdv() {
	var noOfInst = $('#noOfInstallment').val()
	var gapBetweenTwoIntstallment = 1;
	if (noOfInst == 1) {

	} else {
		var durationWithin = $('#durationWithin').val()
		var noOfDays = durationWithin * 30;
		gapBetweenTwoIntstallment = parseFloat(noOfDays / (noOfInst)).toFixed(0)
	}
	$('#gapBetweenTwoIntstallment').val(gapBetweenTwoIntstallment)
}

function generateDiscountApplicableForAdv(flag) {
	var noOfInst = $('#noOfInstallment').val()
	var options = '<option value="D">Distribute on all remaining installment</option>'
	for (startIndex = 2; startIndex <= noOfInst; startIndex++) {
		if (startIndex == 1) {
			options += '<option value="1">1st Installment</option>';
		} else if (startIndex == 2) {
			options += '<option value="2">2nd Installment</option>';
		} else if (startIndex == 3) {
			options += '<option value="3">3rd Installment</option>';
		} else if (startIndex == 4) {
			options += '<option value="4">4th Installment</option>';
		} else if (startIndex == 5) {
			options += '<option value="5">5th Installment</option>';
		} else if (startIndex == 6) {
			options += '<option value="6">6th Installment</option>';
		} else if (startIndex == 7) {
			options += '<option value="7">7th Installment</option>';
		} else if (startIndex == 8) {
			options += '<option value="8">8th Installment</option>';
		} else if (startIndex == 9) {
			options += '<option value="9">9th Installment</option>';
		} else if (startIndex == 10) {
			options += '<option value="10">10th Installment</option>';
		}
	}
	$('#discountApplicableFor').html(options)
	if (flag) {
		generateScheduleAdv()
	}
}

function generateScheduleAdv(responseData) {
	if ($('#paymentMode').val() == 'a_partially') {
		$('#paymentScheduleDiv').show();
		$("#paymentScheduleTablePartial").show();
		$("#paymentScheduleTablePartial tbody").html('');
		// $("#paymentInstallmentTable tbody").html('');
		var noOfInst = ($('#noOfInstallment').val() - 1)
		var gapBetweenTwoIntstallment = $('#gapBetweenTwoIntstallment').val()
		var durationWithin = $('#durationWithin').val()
		//var scheduleDate=$('#tentativeFirstPayDate').val()
		var currentDate = new Date();
		var formattedDate = currentDate.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
		var scheduleDate = getDateInDateFormat(formattedDate)
		//scheduleDate = new Date(scheduleDate[2], scheduleDate[0]-1, scheduleDate[1]);

		var payableFeeAfterPremium = $('#payableFee').attr('payableFee-data');
		var firstInstallment = $('#firstInstallment').val();
		var remainingPayableFee = parseFloat(payableFeeAfterPremium) - parseFloat(firstInstallment);
		if ($('#additionalDiscount').val() == '') {
			var discountAmount = 0;
		} else {
			var discountAmount = $('#additionalDiscount').val();
		}

		var discountApplicableFor = $('#discountApplicableFor').val();
		var intallmentFee = 0.00
		var totalFeeForInstallments = 0.00;
		if (discountApplicableFor == 'D') {
			if (discountAmount >= remainingPayableFee) {
				totalFeeForInstallments = 0.00
			} else {
				totalFeeForInstallments = parseFloat(remainingPayableFee) - parseFloat(discountAmount);
			}
		} else {
			totalFeeForInstallments = parseFloat(remainingPayableFee);
		}
		intallmentFee = parseFloat(totalFeeForInstallments / noOfInst);
		// if(discountApplicableFor=='D'){
		// 	intallmentFee=parseFloat(totalFeeForInstallments/noOfInst).toFixed(2)
		// }else{
		// 	intallmentFee=parseFloat(totalFeeForInstallments/noOfInst).toFixed(2)
		// }
		var totalPayableFee = 0.00
		for (index = 1; index <= (noOfInst + 1); index++) {
			var scheduleFee = '';
			if (index == 1) {
				scheduleFee += parseFloat(firstInstallment).toFixed(2);
				totalPayableFee += parseFloat(firstInstallment);
			} else {
				scheduleDate.setDate((parseInt(scheduleDate.getDate()) + parseInt(gapBetweenTwoIntstallment)))
				if (discountApplicableFor == 'D') {
					scheduleFee += intallmentFee.toFixed(2);
					totalPayableFee += parseFloat(intallmentFee);
				} else {
					if (discountApplicableFor == index) {
						if (discountAmount >= intallmentFee) {
							scheduleFee = 0.00
						} else {
							scheduleFee += (intallmentFee - discountAmount).toFixed(2);
						}
						totalPayableFee += parseFloat(intallmentFee - discountAmount);
					} else {
						scheduleFee += intallmentFee.toFixed(2);
						totalPayableFee += parseFloat(intallmentFee);
					}
				}
			}
			if(responseData != undefined && responseData.schedulePayments != null ){
				singleIntallmentAdv(index, index, changeDateFormat(scheduleDate, 'MMM-dd-yyyy'), getPaymentTitleCalculation(index, durationWithin), scheduleFee, responseData.schedulePayments[index-1].paymentLink, true)
			}else{
				singleIntallmentAdv(index, index, changeDateFormat(scheduleDate, 'MMM-dd-yyyy'), getPaymentTitleCalculation(index, durationWithin), scheduleFee, '', true)
			}
			
		}
		totalPayableFee = parseFloat(totalPayableFee).toFixed(2);
		singleIntallmentAdv('', '', '', '', totalPayableFee,'', false)
	}
}

function singleIntallmentAdv(id, index, scheduleDate, paymentTitle, scheduleFee, paymentLink, islastRow) {
	var tr =
		'<tr id="updid' + id + '">'
		+ '<td class="text-center">' + index + '</td>';
	if (scheduleDate != '') {
		tr += '<td class="text-center"><input class="form-control dataPicker schedulePayDate" text="text" id="dataPicker' + index + '"/></td>';
	} else {
		tr += '<td class="text-center"></td>';
	}
	if (paymentTitle != '') {
		tr += '<td class="paymentTitle">' + paymentTitle + ' - Advance</td>';
	} else {
		tr += '<td class="text-right"><b>Final Payable Fee</b></td>';
	}
	if (islastRow) {
		tr += '<td class="text-right scheduleFeeInput" style="max-width:100px">'
			+ '<span class="d-flex align-items-center">'
				+ currency + '<input type="text" class="text-right ml-1 installmentValue" id="' + id + '-ad-installmentValue" value="' + scheduleFee + '" style="max-width:80px" onblur="totalInstallmentAmount(\'paymentScheduleTablePartial\',\'ad_partially_fee\')"/>'
			+ '</span>'
			+ '</td>';
	} else {
		tr += '<td class="text-right scheduleFee">' + currency + '<span id="ad_partially_fee">' + scheduleFee + '</span>' + '</td>';
	}
	if (islastRow) {
		tr += '<td class="text-right">' + scheduleDate + '</td>';
		} else {
			tr += '<td>'+scheduleDate+'</td>';
		}
	if (islastRow) {
		if(paymentLink) {
			tr += '<td class="text-center" id="paymentLink'+(index)+'">'
				+'<span>'
					+'<input type="text" id="paymentCopyLink'+(index)+'" style="float:right; opacity:0; height:0;padding:0;" value="'+paymentLink+'">'
					+'<a href="javascript:void(0)" class="btn btn-primary btn-sm" onclick="copyToClipboard(\'paymentCopyLink' + (index) + '\')"><i class="fa fa-clone" aria-hidden="true">Copy Payment Link</i></a>'
				+'</span>'
			+'</td>';
		} else {
			tr +='<td class="text-center" id="paymentLink"'+index+'>NA</td>';
		}
		
	} else {
		tr +='<td class="text-center" id="paymentLink"'+index+'>&nbsp;</td>';
	}
	tr += '</tr>'
	$("#paymentScheduleTablePartial tbody").append(tr);
	$('#dataPicker' + index).datepicker({
		format: 'M d, yyyy',
		autoclose: true,
		todayHighlight: true
	});
	var installmentDate = new Date(scheduleDate);
	$('#dataPicker' + index).datepicker('setDate', installmentDate);
	if (scheduleDate != '') {
		var installment_tr = '<tr><td class="installment"></td><td class="text-right scheduleFee" >' + scheduleFee + '</td>';
		if (index == 1) {
			installment_tr += '<td class="text-right">' + scheduleFee + '</td>';
		} else {
			installment_tr += '<td>&nbsp;</td>';
		}
		installment_tr += '</tr>';
		$("#paymentInstallmentTable tbody").append(installment_tr);
		var ordinals = ["st", "nd", "rd", "th"];
		$(".installment").each(function (index) {
			var number = index + 1;
			var ordinalIndex = (number - 1) % 10 < 4 ? (number - 1) % 10 : 3;
			$(this).text(number + ordinals[ordinalIndex] + ' Installment');
		});
	}
}