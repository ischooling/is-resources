var currentPagePartnerEnrollmentList = 1;
async function partnerEnrollmentStudentsOnLoad(){
	callStudentListByPartnerWLP('partnerEnrollFilterForm');
}
function changeRevenueTypePartner(eleID) {
    var revenueType = $("#" + eleID).find(":selected").attr("data-value-type");
    
    if (revenueType === "date") {
        $(".date-range").hide();
        $("#endDate").prop("disabled", true);
        $("#startDate, #endDate").val("");
        getMonthlyRevenue();
    } else {
        $(".date-range").show();
        $("#endDate").prop("disabled", true);
    }
}

function showAdvanceSearchForm(){
	$("#partnerEnrollFilterForm").stop().slideToggle();
}

function resetEnrollmentForm(formID){
	if(USER_ROLE != "SCHOOL_ADMIN"){
		$("#"+formID+" #schoolName").val("").trigger("change");
		$("#"+formID+" #partnerName").val("").trigger("change");
	}
	$("#"+formID+" #academicYear").val("ALL").trigger("change");
	$("#"+formID+" #subPartner").val("").trigger("change");
	$("#"+formID+" #enrollmentStatus").val("").trigger("change");
	$("#"+formID+" #gradeId").val("").trigger("change");
	$("#"+formID+" #countryId").val("").trigger("change");
	$("#"+formID+" #stateId").val("").trigger("change");
	$("#"+formID+" #cityId").val("").trigger("change");
	$("#"+formID+" #commissionStatus").val("").trigger("change");
	$("#"+formID+" #paymentTitle").val("").trigger("change");
	$("#"+formID+" #learningProgram").val("").trigger("change");
	$("#"+formID+" #paymentStatus").val("").trigger("change");
	$("#"+formID+" #sortBy").val("DESC").trigger("change");
	$("#"+formID+" #studentName").val("");
	$("#"+formID+" #email").val("");
	$("#"+formID+" #pageSize").val("25");
	$("#"+formID+" #paymentDateFrom").val("").datepicker("upadate");
	$("#"+formID+" #paymentDateTo").val("").datepicker("upadate");
}

function callPartnerCountries(formId, value, elementId, preSelected) {
	$("#" + formId + " #" + elementId).html('<option value="">Select country</option>');
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLForCommon('masters'),
		data: JSON.stringify(getRequestForMaster(formId, 'COUNTRIES-LIST', value)),
		dataType: 'json',
		async: false,
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(1, data['message']);
			} else {
				var countries = data['mastersData']['countries']
				$.each(countries, function(k, v) {
					$("#" + formId + " #" + elementId).append('<option dailCode="'+v.extra1+'" dail-country-code="'+v.extra+'" value="'+v.key+'" '+(preSelected==v.key?'selected':'')+'>'+v.value+'</option>');
				});
			}
		}
	});
	return true;
}

function callPartnerListBy(formId, elementId) {
	var data={};
	data['userId']=USER_ID;
	$("#" + formId + " #" + elementId).html('<option dail-referral-code="" value="">Select Partner</option>');
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForHTML('dashboard', 'get-partner-list'),
		data : JSON.stringify(data),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			console.log(data);
			if (data['status'] == '0' || data['status'] == '2') {
				//showMessageTheme2(false, data['message']);
			} else {
				var partnerList = data['partnerList'];
				$.each(partnerList, function(k, v) {
					$("#" + formId + " #" + elementId).append('<option dail-referral-code="'+v.extra+'" value="'+v.key+'">'+v.value+'</option>');
				});
			}
		},
		error : function(e) {
			console.log(e);
		}
	});
}

function getRequestForPartnerEnrolledStudentList(formId){
	var data={};
	var enrollmentListFilterDTO = {};
	if(USER_ROLE == 'SCHOOL_ADMIN' && $("#"+formId+" #schoolName").val() == 'ALL'){
		enrollmentListFilterDTO['schoolId']= SCHOOL_ID;
	}else{
		enrollmentListFilterDTO['schoolId']=$("#"+formId+" #schoolName").val();
	}
	enrollmentListFilterDTO['counselorId']=$("#"+formId+" #partnerName").val();
	enrollmentListFilterDTO['userId']=USER_ID;
    enrollmentListFilterDTO['referralCode']=$("#"+formId+" #referralCode").val();
    enrollmentListFilterDTO['academicYear'] = $("#"+formId+" #academicYear").val() || 'ALL';
    enrollmentListFilterDTO['enrollmentStatus']=$("#"+formId+" #enrollmentStatus").val();
    enrollmentListFilterDTO['gradeId']=$("#"+formId+" #gradeId").val();
    enrollmentListFilterDTO['studentName']=$("#"+formId+" #studentName").val();
	enrollmentListFilterDTO['email']=$("#"+formId+" #email").val();
    enrollmentListFilterDTO['countryId']=$("#"+formId+" #countryId").val();
    enrollmentListFilterDTO['stateId']=$("#"+formId+" #stateId").val();
    enrollmentListFilterDTO['cityId']=$("#"+formId+" #cityId").val();
	enrollmentListFilterDTO['commissionStatus']=$("#"+formId+" #commissionStatus").val();
	enrollmentListFilterDTO['learningProgram']=$("#"+formId+" #learningProgram").val();
	enrollmentListFilterDTO['enrollmentFor']=$("#" + formId + " #learningProgram option:selected").attr("data-enrollmentFor");
	if($("#"+formId+" #paymentDateFrom").val()!=undefined && $("#"+formId+" #paymentDateFrom").val()!='' ){
		var paymentDateFrom = changeDateFormat(new Date($("#"+formId+" #paymentDateFrom").val()), "yyyy-mm-dd");
		enrollmentListFilterDTO['paymentDateFrom']=paymentDateFrom;
	}
	if($("#"+formId+" #paymentDateTo").val()!=undefined && $("#"+formId+" #paymentDateTo").val()!='' ){
		var paymentDateTo = changeDateFormat(new Date($("#"+formId+" #paymentDateTo").val()), "yyyy-mm-dd");
		enrollmentListFilterDTO['paymentDateTo']=paymentDateTo;
	}
	
	enrollmentListFilterDTO['paymentStatus']=$("#"+formId+" #paymentStatus").val();
	enrollmentListFilterDTO['sortBy']=$("#"+formId+" #sortBy").val();
	enrollmentListFilterDTO['paymentTitle']=$("#"+formId+" #paymentTitle").val();
	enrollmentListFilterDTO['pageSize']= $("#"+formId+" #pageSize").val() == "" ? 25 : parseInt($("#"+formId+" #pageSize").val());
	enrollmentListFilterDTO['pageNo']=currentPagePartnerEnrollmentList;
	data['enrollmentListFilterDTO']=enrollmentListFilterDTO;
	return data;
}

function callStudentListByPartnerWLP(formId) {
	if($("#"+formId+" #pageSize").val() == ""){
		showMessageTheme2(2, "Please enter page size");
		return false;
	}else{
		$("#enrolled-list").hide();
		$("#enroll-list-skeleton").show();
	}
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForHTML('dashboard', 'get-partner-enrollment-student-list'),
		data : JSON.stringify(getRequestForPartnerEnrolledStudentList(formId)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : async function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessageTheme2(false, data['message']);
				$("#enroll-list-skeleton").show();
			}else if(data['status'] == '3'){
				redirectLoginPage()
			} else {
				$("#enroll-list-skeleton").hide();
				$("#enrolled-list").show();
				var htmls = await partnerEnrollmentListDetails(data.studentList);
				$("#enrolled-list").html(htmls);
				$("#total_revenue").text(currency + " " +  data.revenueDetails.total_revenue)
				$("#total_amount").text(currency + " " + data.revenueDetails.total_amount);
				$("#pending_amount").text(currency + " " + data.revenueDetails.pending_amount);
				$("#paid_amount").text(currency + " " + data.revenueDetails.paid_amount);
				$(".follow-up-no").click(function(){
					$(this).find(".fa-angle-down").toggleClass('fa-angle-down fa-angle-up');
					$(this).parent().siblings().find(".fa-angle-up").toggleClass('fa-angle-up fa-angle-down');
					$(this).parent().find(".follow-up-content").slideDown();
					$(this).parent().siblings().find(".follow-up-content").slideUp();
					$(this).parent().addClass("follow-up-accordian-active");
					$(this).parent().siblings().removeClass("follow-up-accordian-active");
				});
				$("#totalCommissionDate").text(data.currentDate);
				if(data.studentList.length != 0){
					$("#enrollmentPartnerPaginationContainer").html(renderPaginationCommon(currentPagePartnerEnrollmentList, data.totalPages, "partnerEnrollment"));
				}
			}
		},
		error : function(e) {
			console.log(e);
		}
	});
}

function populateMonths() {
    const currentDate = new Date();
    const $selectElement = $('#revenueType');
    $selectElement.empty();

    const customOption = $('<option></option>', {
        value: '',
        text: 'Custom',
        'data-value-type': 'custom'
    });
    $selectElement.append(customOption);

    for (let i = 4; i >= 0; i--) {
        let date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);

        let monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        let monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        const option = $('<option></option>', {
            value: `${monthStart.toISOString()}|${monthEnd.toISOString()}`,
            text: formatRevenueMonth(date),
            'data-value-type': 'date'
        });

        $selectElement.append(option);
    }

    $selectElement.find('option').last().prop('selected', true);
    getMonthlyRevenue();
}

function formatRevenueMonth(date) {
    return date.toLocaleString('default', { month: 'short', year: 'numeric' });
}

function getMonthlyRevenue() {
    const selectedOption = $('#revenueType').find(':selected');
    const type = selectedOption.attr('data-value-type');

    let revenueStartDate, revenueEndDate;

    if (type === 'date') {
        const [startISO, endISO] = selectedOption.val().split('|');
        revenueStartDate = changeDateFormat(new Date(startISO), 'yyyy-mm-dd');
        revenueEndDate = changeDateFormat(new Date(endISO), 'yyyy-mm-dd');
    } else {
        if (!$("#startDate").val() || !$("#endDate").val()) return;
        revenueStartDate = changeDateFormat(new Date($("#startDate").val()), 'yyyy-mm-dd');
        revenueEndDate = changeDateFormat(new Date($("#endDate").val()), 'yyyy-mm-dd');
    }

    const requestData = {
        userId: USER_ID,
        schoolId: SCHOOL_ID,
        revenueStartDate,
        revenueEndDate,
    };

    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: getURLForHTML('dashboard', 'get-monthly-revenue'),
        data: JSON.stringify(requestData),
        dataType: 'json',
        success: function (data) {
            if (data['status'] === '3') {
                redirectLoginPage();
            } else if (data['status'] !== '0' && data['status'] !== '2') {
                // showMessageTheme2(1, data['message'], '', true);
            }

            if (data.monthlyRevenue !== undefined) {
                const updatedRevenue = `${data.monthlyRevenue}`;
                $('#monthly_amount span').text(updatedRevenue);
            }
        }
    });
}