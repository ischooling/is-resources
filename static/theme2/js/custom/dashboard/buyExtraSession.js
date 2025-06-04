$(document).ready(function(){
	var globalSessionCount;
	var globalChoosePlan;
	// add(number, planId, subjectCalculate, ${ sessionMinValue },${ monthlyPlanCount })
	// inititateBuyExtraClass(this, subjectCalculate, ${ singlePlanCount },${ sessionMinValue },${ monthlyPlanCount })
});
$(window).resize(function () {
	if ($(window).outerWidth() > 769) {
		$('.course-type-list li').parent().css({ "background": "#fff" });
		$('.course-type-list li ').find('.active').parent().css({ "background": "#fff" });
	}
	else {
		$('.course-type-list li ').find('.active').parent().css({ "background": "#e8eeff" });
	}
});

function inititateBuyExtraClass(src, subjectCalculate, singlePlanCount, sessionMinValue, monthlyPlanCount){
	var choosePlan = src.find('input').attr('id');
	console.log("plan ", choosePlan);
	if (choosePlan == 'plan-one') {
		if ($('#plan-one').prop('checked') == true) {
			var cuntValueExisting = subjectCalculate.planCount1;
			if (cuntValueExisting == singlePlanCount || ((cuntValueExisting + parseInt(sessionMinValue)) > singlePlanCount)) {
				$("#planId").val("");
				$("#courseTypeMessage").html("");
				showMessageTheme2(0, " Extra classes cannot be more than " + singlePlanCount, '', false);
			}else {
				var amount = $('#plan-one').val();
				$("#planId").val('plan-one');
				$("#planCount").val('${sessionMinValue}');
				cuntValueExisting = cuntValueExisting + parseInt(sessionMinValue);
				$("#totalPlanCount").val(cuntValueExisting);
				console.log("amount=>", amount);

				src.addClass('active');
				$("#count1").html(1);
				var slideMsg = sessionMinValue+" extra ${sessionMinValue>1?'classes':'class'} - $" + amount;
				if (SCHOOL_ID == 5) {
					amount = 200;
					slideMsg = sessionMinValue +" extra ${sessionMinValue>1?'classes':'class'} - R" + amount;
				}
				$("#amount").val(amount);
				$("#planAmount").val(amount);
				$("#courseTypeMessage").html(slideMsg);
				$('.course-type-message').addClass('slide-message');
				src.parent().find('.classroom-control-btn').removeClass('hide-control-btn');
				if ($(window).outerWidth() < 769) {
					src.parent().css({ "background": "#e8eeff" });
				}
			}
			$('#choosePlanStartDate').hide();
			$('#choosePlanEndDate').hide();
			$('#planEndDateHeading').hide();
			$('#planStartDateHeading').hide();
			globalSessionCount = parseInt(sessionMinValue);
			globalChoosePlan = "plan-one";
			$('#choosePlanStartDate').val('');
			$('#choosePlanEndDate').val('');
			planStartDate(globalSessionCount, globalChoosePlan);
		}else {
			src.parent().siblings().find('.classroom-session').removeClass('active');
			src.parent().siblings().find('.classroom-control-btn').addClass('hide-control-btn');
			src.parent().siblings().css({ "background": "#fff" });
		}
	}else if (choosePlan == 'plan-two') {
		if ($('#plan-two').prop('checked') == true) {
			var cuntValueExisting = subjectCalculate.planCount2
			if (cuntValueExisting == monthlyPlanCount || ((cuntValueExisting + parseInt(sessionMinValue)) > monthlyPlanCount)) {
				$("#planId").val("");
				$("#courseTypeMessage").html("");
				showMessageTheme2(0, " Classes cannot be more than " + monthlyPlanCount + " in a week", '', false);
			}else {
				var amount = $('#plan-two').val();
				$("#planId").val('plan-two');
				$("#amount").val(amount);
				$("#planAmount").val(amount);
				$("#planCount").val('${sessionMinValue}');
				cuntValueExisting = cuntValueExisting + parseInt(sessionMinValue);
				$("#totalPlanCount").val(cuntValueExisting);
				console.log("amount=>", amount);
				src.addClass('active');
				$("#count2").html(1);
				var slideMsg = sessionMinValue+" extra ${sessionMinValue>1?'classes':'class'} per week for 1 month- $" + amount;
				$("#courseTypeMessage").html(slideMsg);
				$('.course-type-message').addClass('slide-message');
				src.parent().find('.classroom-control-btn').removeClass('hide-control-btn');
				if ($(window).outerWidth() < 769) {
					src.parent().css({ "background": "#e8eeff" });
				}
				globalSessionCount = parseInt(sessionMinValue);
				globalChoosePlan = "plan-two";
				$('#choosePlanStartDate').show();
				$('#choosePlanEndDate').show();
				$('#planEndDateHeading').show();
				$('#planStartDateHeading').show();
				$('#choosePlanStartDate').val('');
				$('#choosePlanEndDate').val('');
				planStartDate(globalSessionCount, globalChoosePlan);
			}
		} else {
			src.parent().siblings().find('.classroom-session').removeClass('active');
			src.parent().siblings().find('.classroom-control-btn').addClass('hide-control-btn');
			src.parent().siblings().css({ "background": "#fff" });
		}
	} else if (choosePlan == 'plan-three') {
		if ($('#plan-three').prop('checked') == true) {
			var cuntValueExisting = subjectCalculate.planCount3;
			if (cuntValueExisting == monthlyPlanCount || ((cuntValueExisting + parseInt(sessionMinValue)) > monthlyPlanCount)) {
				$("#planId").val("");
				$("#courseTypeMessage").html("");
				showMessageTheme2(0, " Classes cannot be more than " + monthlyPlanCount + " in a week", '', false);
			}else {
				var amount = $('#plan-three').val();
				$("#planId").val('plan-three');
				$("#amount").val(amount);
				$("#planAmount").val(amount);
				$("#planCount").val('${sessionMinValue}');
				cuntValueExisting = cuntValueExisting + parseInt(sessionMinValue);
				$("#totalPlanCount").val(cuntValueExisting);
				console.log("amount=>", amount);
				src.addClass('active');
				$("#count3").html(1);
				var slideMsg = sessionMinValue+" extra ${sessionMinValue>1?'classes':'class'} per week for 5 months- $" + amount;
				$("#courseTypeMessage").html(slideMsg);
				$('.course-type-message').addClass('slide-message');
				src.parent().find('.classroom-control-btn').removeClass('hide-control-btn');
				if ($(window).outerWidth() < 769) {
					src.parent().css({ "background": "#e8eeff" });
				}
				globalSessionCount = parseInt(sessionMinValue);
				globalChoosePlan = "plan-three";
				$('#choosePlanStartDate').show();
				$('#choosePlanEndDate').show();
				$('#planEndDateHeading').show();
				$('#planStartDateHeading').show();
				$('#choosePlanStartDate').val('');
				$('#choosePlanEndDate').val('');
				planStartDate(globalSessionCount, globalChoosePlan);
			}
		} else {
			src.parent().siblings().find('.classroom-session').removeClass('active');
			src.parent().siblings().find('.classroom-control-btn').addClass('hide-control-btn');
			src.parent().siblings().css({ "background": "#fff" });
		}
	} else if (choosePlan == 'plan-four') {
		if ($('#plan-four').prop('checked') == true) {
			var cuntValueExisting = subjectCalculate.planCount4;
			if (cuntValueExisting == monthlyPlanCount || ((cuntValueExisting + parseInt(sessionMinValue)) > monthlyPlanCount)) {
				$("#planId").val("");
				$("#courseTypeMessage").html("");
				showMessageTheme2(0, " Classes cannot be more than " + monthlyPlanCount + " in a week", '', false);
			}else {
				var amount = $('#plan-four').val();
				$("#planId").val('plan-four');
				$("#amount").val(amount);
				$("#planAmount").val(amount);
				$("#planCount").val('${sessionMinValue}');
				cuntValueExisting = cuntValueExisting + parseInt(sessionMinValue);
				$("#totalPlanCount").val(cuntValueExisting);
				console.log("amount=>", amount);
				src.addClass('active');
				$("#count4").html(1);
				var slideMsg = sessionMinValue+" extra ${sessionMinValue>1?'classes':'class'} per week for 10 months- $" + amount;
				$("#courseTypeMessage").html(slideMsg);
				$('.course-type-message').addClass('slide-message');
				src.parent().find('.classroom-control-btn').removeClass('hide-control-btn');
				if ($(window).outerWidth() < 769) {
					src.parent().css({ "background": "#e8eeff" });
				}
				globalSessionCount = parseInt(sessionMinValue);
				globalChoosePlan = "plan-four";
				$('#choosePlanStartDate').show();
				$('#choosePlanEndDate').show();
				$('#planEndDateHeading').show();
				$('#planStartDateHeading').show();
				$('#choosePlanStartDate').val('');
				$('#choosePlanEndDate').val('');
				planStartDate(globalSessionCount, globalChoosePlan);
			}
		} else {
			src.parent().siblings().find('.classroom-session').removeClass('active');
			src.parent().siblings().find('.classroom-control-btn').addClass('hide-control-btn');
			src.parent().siblings().css({ "background": "#fff" });
		}
	} else if (choosePlan == 'discoveryAddOn') {
		if ($('#discoveryAddOn').prop('checked') == true) {
			var cuntValueExisting = 1;
			var amount = $('#discoveryAddOn').val();
			$("#planId").val('discoveryAddOn');
			$("#planCount").val(1);
			$("#totalPlanCount").val(cuntValueExisting);
			console.log("amount=>", amount);

			src.addClass('active');
			$("#count1").html(1);
			var slideMsg = "Discovery Education Add-on - $" + amount;
			if (SCHOOL_ID == 5) {
				//amount=200;
				slideMsg = "Discovery Education Add-on - R" + amount;
			}
			$("#amount").val(amount);
			$("#planAmount").val(amount);
			$("#courseTypeMessage").html(slideMsg);
			$('.course-type-message').addClass('slide-message');
			src.parent().find('.classroom-control-btn').removeClass('hide-control-btn');
			if ($(window).outerWidth() < 769) {
				src.parent().css({ "background": "#e8eeff" });
			}
			//}
			$('#choosePlanStartDate').hide();
			$('#choosePlanEndDate').hide();
			$('#planEndDateHeading').hide();
			$('#planStartDateHeading').hide();
			$('#choosePlanStartDate').val('');
			$('#choosePlanEndDate').val('');
			//globalSessionCount =1;
			//globalChoosePlan="plan-one";
			//planStartDate(globalSessionCount,globalChoosePlan);
		} else {
			src.parent().siblings().find('.classroom-session').removeClass('active');
			src.parent().siblings().find('.classroom-control-btn').addClass('hide-control-btn');
			src.parent().siblings().css({ "background": "#fff" });
		}
	}
}

function planStartDate(countValue, planName) {
	$('#choosePlanStartDate').prop('disabled', false);
	$('#choosePlanStartDate').datepicker("destroy");
	var startDate = new Date();
	console.log("total session taken", countValue);
	if (countValue > 5) {
		startDate.setDate(startDate.getDate() + 6);
	} else {
		startDate.setDate(startDate.getDate() + 1);
	}
	$('#choosePlanStartDate').datepicker({
		autoclose: true,
		format: 'yyyy-mm-dd',
		startDate: startDate,
	}).on('changeDate', function (selected) {
		planEndDate(planName);
	});
}

function planEndDate(planName) {
	var selectedDate = $('#choosePlanStartDate').val();
	console.log("Start Date was", selectedDate);
	$('#choosePlanEndDate').prop('disabled', false);
	$('#choosePlanEndDate').val('');
	$('#choosePlanEndDate').datepicker('setDate', null);
	$('#choosePlanEndDate').data('datepicker').remove();
	var endDate = new Date(selectedDate);
	if (planName == 'plan-four') {
		endDate.setMonth(endDate.getMonth() + 10);
		console.log("nsacbna", endDate.getMonth());
		yr = endDate.getFullYear(),
			month = endDate.getMonth() < 9 ? '0' + (parseInt(endDate.getMonth()) + 1) : (parseInt(endDate.getMonth()) + 1),
			day = endDate.getDate() < 10 ? '0' + endDate.getDate() : endDate.getDate(),
			newDate = yr + '-' + month + '-' + day;
		console.log("End Date", newDate);
		$('#choosePlanEndDate').val(newDate);
		$('#choosePlanEndDate').prop('disabled', false);
	} else if (planName == 'plan-two') {
		endDate.setMonth(endDate.getMonth() + 1);
		console.log("month ", endDate.getMonth());
		yr = endDate.getFullYear(),
			month = endDate.getMonth() < 9 ? '0' + (parseInt(endDate.getMonth()) + 1) : (parseInt(endDate.getMonth()) + 1),
			day = endDate.getDate() < 10 ? '0' + endDate.getDate() : endDate.getDate(),
			newDate = yr + '-' + month + '-' + day;
		console.log("Month ", month)
		console.log("End Date ", newDate);
		$('#choosePlanEndDate').val(newDate);
		$('#choosePlanEndDate').prop('disabled', false);
	} else if (planName == 'plan-three') {
		endDate.setMonth(endDate.getMonth() + 5);
		yr = endDate.getFullYear(),
			month = endDate.getMonth() < 9 ? '0' + (parseInt(endDate.getMonth()) + 1) : (parseInt(endDate.getMonth()) + 1),
			day = endDate.getDate() < 10 ? '0' + endDate.getDate() : endDate.getDate(),
			newDate = yr + '-' + month + '-' + day;
		console.log("End Date ", newDate);
		$('#choosePlanEndDate').val(newDate);
		$('#choosePlanEndDate').prop('disabled', false);
	}
}

function subtract(number, planId, sessionMinValue) {
	var amount = $('#' + planId).val();
	if (SCHOOL_ID == 5) {
		amount = 200;
	}
	var slideMsg = "";
	var countValue = parseInt($("#count" + number).text());
	var totalPlanCount = parseInt($("#totalPlanCount").val());
	var plancount = parseInt($("#planCount").val()) - parseInt(sessionMinValue);
	countValue = countValue - 1;
	totalPlanCount = totalPlanCount - parseInt(sessionMinValue);
	amount = amount * countValue;
	$("#planId").val(planId);
	$("#amount").val(amount);
	$("#planAmount").val(amount);
	$("#planCount").val(plancount);
	console.log("countValue ::" + countValue)
	$("#count" + number).html(countValue);
	$("#totalPlanCount").val(totalPlanCount);
	if (countValue == 0) {
		$('#' + planId).parent().removeClass('active');
		$('#subt' + number).parent().addClass('hide-control-btn');
		$("#planId").val("");
		$("#courseTypeMessage").html(slideMsg);
	} else {
		if ("plan-one" == planId) {
			slideMsg = plancount + " extra " + (plancount > 1 ? 'classes' : 'class') + " - $" + amount;
		} else if ("plan-two" == planId) {
			slideMsg = plancount + " extra " + (plancount > 1 ? 'classes' : 'class') + " per week for 1 month- $" + amount;
		} else if ("plan-three" == planId) {
			slideMsg = plancount + " extra " + (plancount > 1 ? 'classes' : 'class') + " per week for 5 months- $" + amount;
		} else if ("plan-four" == planId) {
			slideMsg = plancount + " extra " + (plancount > 1 ? 'classes' : 'class') + " per week for 10 months- $" + amount;
		}
		if (SCHOOL_ID == 5) {
			slideMsg = plancount + " extra " + (plancount > 1 ? 'classes' : 'class') + " - R" + amount;
		}
		$("#courseTypeMessage").html(slideMsg);
		$('.course-type-message').addClass('slide-message');
	}
	globalSessionCount = plancount;
	globalChoosePlan = planId;
	$('#choosePlanStartDate').datepicker('setDate', null);
	$('#choosePlanStartDate').val('');
	$('#choosePlanEndDate').val('');
	planStartDate(globalSessionCount, globalChoosePlan);
}

function add(number, planId, subjectCalculate, sessionMinValue) {
	var countValue = parseInt($("#count" + number).text());
	var plancount = parseInt($("#planCount").val());
	globalSessionCount = parseInt($("#planCount").val());  // parseInt($("#count"+number).text());
	var cuntValueExisting = 0;
	if ("plan-one" == planId) {
		cuntValueExisting = subjectCalculate.planCount1;
		if (cuntValueExisting != 0) {
			if (cuntValueExisting == singlePlanCount || ((cuntValueExisting + parseInt(sessionMinValue)) > singlePlanCount)) {
				showMessageTheme2(0, " Extra classes cannot be more than " + singlePlanCount, '', false);
			}else {
				cuntValueExisting = cuntValueExisting + plancount;
				if (cuntValueExisting == singlePlanCount || ((cuntValueExisting + parseInt(sessionMinValue)) > singlePlanCount)) {
					showMessageTheme2(0, " Extra classes cannot be more than " + singlePlanCount, '', false);
				}else {
					increment(countValue, number, planId, cuntValueExisting, sessionMinValue);
				}
			}
		} else {
			if (plancount == singlePlanCount || ((plancount + parseInt(sessionMinValue)) > singlePlanCount)) {
				showMessageTheme2(0, " Extra classes cannot be more than " + singlePlanCount, '', false);
			}else {
				cuntValueExisting = parseInt($("#totalPlanCount").val());
				increment(countValue, number, planId, cuntValueExisting, sessionMinValue);
			}
		}
	} else if ("plan-two" == planId) {
		cuntValueExisting = subjectCalculate.planCount2
		if (cuntValueExisting != 0) {
			if (cuntValueExisting == monthlyPlanCount || ((cuntValueExisting + parseInt(sessionMinValue)) > monthlyPlanCount)) {
				showMessageTheme2(0, " Extra classes cannot be more than " + monthlyPlanCount + " in a week", '', false);
			}else {
				cuntValueExisting = cuntValueExisting + plancount;
				if (cuntValueExisting == monthlyPlanCount || ((cuntValueExisting + parseInt(sessionMinValue)) > monthlyPlanCount)) {
					showMessageTheme2(0, " Extra classes cannot be more than " + monthlyPlanCount + " in a week", '', false);
				}else {
					increment(countValue, number, planId, cuntValueExisting, sessionMinValue);
				}
			}
		} else {
			if (plancount == monthlyPlanCount || ((plancount + parseInt(sessionMinValue)) > monthlyPlanCount)) {
				showMessageTheme2(0, " Extra classes cannot be more than " + monthlyPlanCount + " in a week", '', false);
			}else {
				cuntValueExisting = parseInt($("#totalPlanCount").val());
				increment(countValue, number, planId, cuntValueExisting, sessionMinValue);
			}
		}
	} else if ("plan-three" == planId) {
		cuntValueExisting = subjectCalculate.planCount3;
		if (cuntValueExisting != 0) {
			if (cuntValueExisting == monthlyPlanCount || ((cuntValueExisting + parseInt(sessionMinValue)) > monthlyPlanCount)) {
				showMessageTheme2(0, " Extra classes cannot be more than " + monthlyPlanCount + " in a week", '', false);
			}else {
				cuntValueExisting = cuntValueExisting + plancount;
				if (cuntValueExisting == monthlyPlanCount || ((cuntValueExisting + parseInt(sessionMinValue)) > monthlyPlanCount)) {
					showMessageTheme2(0, " Extra classes cannot be more than " + monthlyPlanCount + " in a week", '', false);
				}else {
					increment(countValue, number, planId, cuntValueExisting, sessionMinValue);
				}
			}
		} else {
			if (plancount == monthlyPlanCount || ((plancount + parseInt(sessionMinValue)) > monthlyPlanCount)) {
				showMessageTheme2(0, " Extra classes cannot be more than " + monthlyPlanCount + " in a week", '', false);
			}else {
				cuntValueExisting = parseInt($("#totalPlanCount").val());
				increment(countValue, number, planId, cuntValueExisting, sessionMinValue);
			}
		}
	} else if ("plan-four" == planId) {
		cuntValueExisting = subjectCalculate.planCount4;
		if (cuntValueExisting != 0) {
			if (cuntValueExisting == monthlyPlanCount || ((cuntValueExisting + parseInt(sessionMinValue)) > monthlyPlanCount)) {
				showMessageTheme2(0, " Extra classes cannot be more than " + monthlyPlanCount + " in a week", '', false);
			}else {
				cuntValueExisting = cuntValueExisting + plancount;
				if (cuntValueExisting == monthlyPlanCount || ((cuntValueExisting + parseInt(sessionMinValue)) > monthlyPlanCount)) {
					showMessageTheme2(0, " Extra classes cannot be more than " + monthlyPlanCount + " in a week", '', false);
				}else {
					increment(countValue, number, planId, cuntValueExisting, sessionMinValue);
				}
			}
		} else {
			if (plancount == monthlyPlanCount || ((plancount + parseInt(sessionMinValue)) > monthlyPlanCount)) {
				showMessageTheme2(0, " Extra classes cannot be more than " + monthlyPlanCount + " in a week", '', false);
			}else {
				cuntValueExisting = parseInt($("#totalPlanCount").val());
				increment(countValue, number, planId, cuntValueExisting, sessionMinValue);
			}
		}
	}
	globalChoosePlan = planId;
	$('#choosePlanStartDate').val('');
	$('#choosePlanEndDate').val('');
	planStartDate(globalSessionCount, globalChoosePlan);
}

function increment(countValue, number, planId, cuntValueExisting, sessionMinValue) {
	var amount = $('#' + planId).val();
	if (SCHOOL_ID == 5) {
		amount = 200;
	}
	countValue = countValue + 1;
	amount = amount * countValue;
	var plancount = parseInt($("#planCount").val()) + parseInt(sessionMinValue);
	cuntValueExisting = cuntValueExisting + parseInt(sessionMinValue);
	$("#planId").val(planId);
	$("#amount").val(amount);
	$("#planAmount").val(amount);
	$("#planCount").val(plancount);
	$("#totalPlanCount").val(cuntValueExisting);
	console.log("countValue ::" + countValue)
	$("#count" + number).html(countValue);
	var slideMsg = "";
	if ("plan-one" == planId) {
		slideMsg = plancount + " extra " + (plancount > 1 ? 'classes' : 'class') + " - $" + amount;
	} else if ("plan-two" == planId) {
		slideMsg = plancount + " extra classes per week for 1 month- $" + amount;
	} else if ("plan-three" == planId) {
		slideMsg = plancount + " extra classes per week for 5 months- $" + amount;
	} else if ("plan-four" == planId) {
		slideMsg = plancount + " extra classes per week for 10 months- $" + amount;
	}
	if (SCHOOL_ID == 5) {
		slideMsg = plancount + " extra " + (plancount > 1 ? 'classes' : 'class') + " - R" + amount;
	}
	$("#courseTypeMessage").html(slideMsg);
	$('.course-type-message').addClass('slide-message');
	globalSessionCount = plancount;
}
//});