function callStudentListByPartner(formId) {
	var updateTransferMsg =false;
	if($("#"+formId+" #partnerName").val()!=undefined && $("#"+formId+" #partnerName").val()!=""){
		updateTransferMsg=true;
	}
	
	$.ajax({
			type : "POST",
			contentType : "application/json",
			url : getURLForHTML('dashboard', 'get-student-enrolled-partner'),
			data : JSON.stringify(getRequestForPartnerEnrolledList(formId)),
			dataType : 'json',
			cache : false,
			timeout : 600000,
			success : function(data) {
			   console.log(data);
				if (data['status'] == '0' || data['status'] == '2') {
					showMessageTheme2(false, data['message']);
					$("#enroll-list-skeleton").show();
				} else {
					
						$("#enroll-list-skeleton").hide();
						var htmls = B2BStudentListDetails(data.studentList, updateTransferMsg);
						$("#enrolled-list").html(htmls);
						$(".follow-up-no").click(function(){
							$(this).find(".fa-angle-down").toggleClass('fa-angle-down fa-angle-up');
							$(this).parent().siblings().find(".fa-angle-up").toggleClass('fa-angle-up fa-angle-down');
							$(this).parent().find(".follow-up-content").slideDown();
							$(this).parent().siblings().find(".follow-up-content").slideUp();
							$(this).parent().addClass("follow-up-accordian-active");
							$(this).parent().siblings().removeClass("follow-up-accordian-active");
						});
						var payhtml = B2BStudentListCommission(data.studentList);
						$(".studentCommitionList").html(payhtml);
						$("#totalCommissionDate").text(data.currentDate);
						//var html=getLeadMergeDataPopup(data.campainNameList);
						// $('#tblCampaignList').dataTable().fnDestroy();
						// $("#campaignlist").html(html);
						// $('#tblCampaignList').dataTable();
				}
			},
		   error : function(e) {
			   console.log(e);
		   }
	   });
   }

function getRequestForPartnerEnrolledList(formId){
	var data={};
	var enrollmentListFilterDTO = {};
	if($("#"+formId+" #partnerName").val()!=undefined && $("#"+formId+" #partnerName").val()!=""){
		enrollmentListFilterDTO['counselorId']=$("#"+formId+" #partnerName").val();
	}else{
		if($("#"+formId+" #referralCode").val()!=''){
			enrollmentListFilterDTO['counselorId']=USER_ID;
		}else{
			enrollmentListFilterDTO['counselorId']=0;
		}
	}
	enrollmentListFilterDTO['userId']=USER_ID;
	enrollmentListFilterDTO['schoolId']=SCHOOL_ID;
    enrollmentListFilterDTO['referralCode']=$("#"+formId+" #referralCode").val();
    enrollmentListFilterDTO['academicYear']=$("#"+formId+" #academicYear option:selected").text();
    enrollmentListFilterDTO['enrollmentStatus']=$("#"+formId+" #enrollmentStatus").val();
    enrollmentListFilterDTO['gradeId']=$("#"+formId+" #gradeId").val();
    enrollmentListFilterDTO['studentName']=$("#"+formId+" #studentName").val();
	enrollmentListFilterDTO['email']=$("#"+formId+" #email").val();
    enrollmentListFilterDTO['countryId']=$("#"+formId+" #countryId").val();
    enrollmentListFilterDTO['stateId']=$("#"+formId+" #stateId").val();
    enrollmentListFilterDTO['cityId']=$("#"+formId+" #cityId").val();
	enrollmentListFilterDTO['commissionStatus']=$("#"+formId+" #commissionStatus").val();
	enrollmentListFilterDTO['learningProgram']=$("#"+formId+" #learningProgram").val();
	if($("#"+formId+" #paymentDateFrom").val()!=undefined && $("#"+formId+" #paymentDateFrom").val()!='' ){
		var paymentDateFrom = $("#"+formId+" #paymentDateFrom").val();
		//var paydate=paymentDateFrom.split("-")[2]+'-'+paymentDateFrom.split("-")[1]+'-'+paymentDateFrom.split("-")[0];
		enrollmentListFilterDTO['paymentDateFrom']=paymentDateFrom;
	}
	if($("#"+formId+" #paymentDateTo").val()!=undefined && $("#"+formId+" #paymentDateTo").val()!='' ){
		var paymentDateTo = $("#"+formId+" #paymentDateTo").val();
		//var paydate=paymentDateTo.split("-")[2]+'-'+paymentDateTo.split("-")[1]+'-'+paymentDateTo.split("-")[0];
		enrollmentListFilterDTO['paymentDateTo']=paymentDateTo;
	}
	
	//enrollmentListFilterDTO['paymentTitle']=$("#"+formId+" #paymentTitle").val();
	enrollmentListFilterDTO['paymentStatus']=$("#"+formId+" #paymentStatus").val();
	enrollmentListFilterDTO['sortBy']=$("#"+formId+" #sortBy").val();
	enrollmentListFilterDTO['feeStatus']=$("#"+formId+" #feeStatus").val();
	enrollmentListFilterDTO['pageSize']=$("#"+formId+" #pageSize").val();
	data['enrollmentListFilterDTO']=enrollmentListFilterDTO;
	return data;
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



function getRequestForPartnerCommissionRate(formId, userId, learningProgramCode, enrollmentFor){
	if(userId=='' || userId==undefined){
		userId=USER_ID;
	}
	var filterRequest = {};
	var authentication = {};
	authentication['hash'] = getHash();
	authentication['schoolId'] = SCHOOL_ID;
	authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = USER_ROLE;
	authentication['userId'] = userId;
	authentication['learningProgram'] = learningProgramCode;
	authentication['enrollmentFor'] = enrollmentFor;
	filterRequest['authentication'] = authentication;
	return filterRequest;
}

function getPartnerCommissionRate(formId, elementId ,userId) {
	return new Promise(function(resolve, reject){
		$.ajax({
			type : "POST",
			contentType : "application/json",
			url : BASE_URL + CONTEXT_PATH + SCHOOL_UUID +'/dashboard/get-partner-commission-rate',
			data : JSON.stringify(getRequestForPartnerCommissionRate(formId, userId)),
			dataType : 'json',
			global : true,
			success : function(data) {
				if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
					if (data['status'] == '3') {
						redirectLoginPage();
					} 
					return reject()
				}else{
					resolve(data)
	
				}
			},error: function(xhr, status, error) {
				if (checkonlineOfflineStatus()) {
					return;
				}
				console.error('Error: ' + error);
				reject(error);
			}
		});
	});
}

function getPartnerCommissionRateHtml(commissionRates){
		var html="";
		if(commissionRates!=null && commissionRates.length>0){

			for (let c = 0; c < commissionRates.length; c++) {
				const commRate = commissionRates[c];
				var enrolRange=commRate.min_range+'+';
				if(commRate.max_range>0){
					enrolRange=commRate.min_range+'-'+commRate.max_range;
				}
				
				// if(c==1){
				// 	enrolRange='5-10';
				// }else if(c==2 || c==5){
				// 	enrolRange='10-20';
				// }else if(c==3 || c==6){
				// 	enrolRange='20-30';
				// }else if(c==4 || c==8 || c==9){
				// 	enrolRange='30-50';
				// }else if(c==10){
				// 	enrolRange='50+';
				// }
				html=html+'<tr class="td-border-design">'
				+'<td style="border-width:1px;border-color:#eee">'+commRate.standardName+'</td>'
				+'<td style="border-width:1px;border-color:#eee">'+commRate.learningProgramValue+'</td>'
				+'<td style="border-width:1px;border-color:#eee">'+commRate.byPartnerValue+' '+commRate.byPartnerType+'</td>'//
				+'<td style="border-width:1px;border-color:#eee">'+commRate.bySchoolValue+' '+commRate.bySchoolType+'</td>'//
				+'<td style="border-width:1px;border-color:#eee" class="text-center">'+enrolRange+'</td>'
				+'<td style="border-width:1px;border-color:#eee">'+commRate.startDate+'</td>'
				+'<td style="border-width:1px;border-color:#eee">'+(commRate.endDate=='Dec 31, 2999'?'N/A':commRate.endDate)+'</td>'
				+'</tr>';
			}	

		}

		return html;

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

function updateStudentPartnerCommissionRate(studentStandardId, updateStatus, amount, commRate, referralCode) {
	var requestData={};
	var dataList=[];
	if(studentStandardId==''){
		$('.commission_list').each(function(){
			var id=$(this).attr("id");
			if ($("#checkCommission"+id).is(":checked")) {
				var amount=$(this).attr("data-commission");
				var commRate=$(this).attr("data-commission-rate");
				var data={};
				data['userId']=USER_ID;
				data['studentStandardId'] = id;
				data['updateStatus'] = $("#commissionStatus"+id).val();
				data['amount'] = amount;
				data['commRate'] = commRate;
				dataList.push(data);
			} 
		});
	}else{
		var data={};
		data['userId']=USER_ID;
		data['studentStandardId'] = studentStandardId;
		data['updateStatus'] = updateStatus;
		data['amount'] = amount;
		data['commRate'] = commRate;
		dataList.push(data);
	}
	requestData['dataList']=dataList;
	if(amount==''){
		requestData['totalAmount']=$("#totalCommission").text();
	}else{
		requestData['totalAmount']=amount.replace("$ ","");
	}
	
	if(referralCode==''){
		requestData['referralCode']=$("#referralCode").val();
	}else{
		requestData['referralCode']=referralCode;
	}
	

	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : BASE_URL + CONTEXT_PATH + SCHOOL_UUID +'/dashboard/save-transfer-payment',
		data : JSON.stringify(requestData),
		dataType : 'json',
		async : false,
		global : false,
		success : function(data) {
			console.log(data);
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if (data['status'] == '3') {
					redirectLoginPage();
				} else{
					showMessageTheme2(0, data['message']);
				}
			}else{
				showMessageTheme2(1, data['message']);
				$("#updateTransferCommission").modal('hide');
				callStudentListByPartner('partnerEnrollFilterForm');
			}
		},
		error: function(e){
			if (checkonlineOfflineStatus()) {
				return;
			}
		}
	});
	return true;
} 
  


function resetEnrollmentForm(formID){
	$("#"+formID+" #academicYear").val("0").trigger("change");
	$("#"+formID+" #partnerName").val("").trigger("change");
	$("#"+formID+" #enrollmentStatus").val("").trigger("change");
	$("#"+formID+" #gradeId").val("").trigger("change");
	$("#"+formID+" #countryId").val("").trigger("change");
	$("#"+formID+" #stateId").val("").trigger("change");
	$("#"+formID+" #cityId").val("").trigger("change");
	$("#"+formID+" #commissionStatus").val("").trigger("change");
	$("#"+formID+" #learningProgram").val("").trigger("change");
	$("#"+formID+" #paymentStatus").val("").trigger("change");
	$("#"+formID+" #feeStatus").val("").trigger("change");
	$("#"+formID+" #sortBy").val("Desc").trigger("change");
	$("#"+formID+" #studentName").val("");
	$("#"+formID+" #email").val("");
	$("#"+formID+" #pageSize").val("25");
	$("#"+formID+" #paymentDateFrom").val("").datepicker("upadate");
	$("#"+formID+" #paymentDateTo").val("").datepicker("upadate");
}

function getCallTotalCommission(){
	var totalCommission=0.0;
	$('.commission_list').each(function(){
		var id=$(this).attr("id");
		if ($("#checkCommission"+id).is(":checked")) {
			var amount=$(this).attr("data-commission");
			var commRate=$(this).attr("data-commission-rate");
			amount = amount.replace("$ ","");
			totalCommission=totalCommission+parseFloat(amount);
		} 
	});
	return totalCommission;
}


function getRequestForPartnerDetails(formId, userId){
	if(userId=='' || userId==undefined){
		userId=USER_ID;
	}
	var filterRequest = {};
	var authentication = {};
	authentication['hash'] = getHash();
	authentication['schoolId'] = SCHOOL_ID;
	authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = USER_ROLE;
	authentication['userId'] = userId;
	filterRequest['authentication'] = authentication;
	return filterRequest;
}

function getPartnerDashboardDetails(userId) {
	var responseData={};
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : BASE_URL + CONTEXT_PATH + SCHOOL_UUID +'/dashboard/partner-content',
		data : JSON.stringify(getRequestForPartnerDetails(userId)),
		dataType : 'json',
		async : false,
		global : false,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if (data['status'] == '3') {
					redirectLoginPage();
				} 
			}else{
				responseData=data;
			}
		},
		error: function(e){
			if (checkonlineOfflineStatus()) {
				return;
			}
		}
	});
	return responseData;
}

function getPartnerDashboardDetailsData(userId) {
	var responseData={};
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : BASE_URL + CONTEXT_PATH + SCHOOL_UUID +'/dashboard/partner-learning-program-content',
		data : JSON.stringify(getRequestForPartnerDetails(userId)),
		dataType : 'json',
		async : false,
		global : false,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if (data['status'] == '3') {
					redirectLoginPage();
				} 
			}else{
				responseData=data;
			}
		},
		error: function(e){
			if (checkonlineOfflineStatus()) {
				return;
			}
		}
	});
	return responseData;
}


function getCommissionRatesChart(eleID, chartIndexVal, min, max){
	var chartValmin=100;
	var chartValmax=100;
	if(min>0){
		chartValmin=chartValmin-min;
	}
	if(max>0){
		chartValmax=chartValmax-max;
	}
	if(chartValmax>chartValmin){}
	else{
		chartValmax=chartValmin;
	}
	var options = {
		chart: {
		type: 'radialBar',
		height: 200,
		sparkline: {
			enabled: true
		}
		},
		plotOptions: {
		radialBar: {
			startAngle: -90,
			endAngle: 90,
			track: {
			background: "#007fff",
			strokeWidth: '100%',
			},
			hollow: {
			margin: 15,
			size: '75%',
			},
			dataLabels: {
			name: {
				show: true,
				offsetY:  0, // move "Enrollment Range" closer to value
				fontSize: '13px',
				color:"#343a40",
				fontWeight:"300"
			},
			value: {
				show: true,
				fontSize: '24px',
				fontWeight: 'bold',
				offsetY: -35, // move "50+" closer to name
				formatter: function (val) {
				return chartIndexVal;
				}
			}
			}

		}
		},
		fill: {
		//  type: 'gradient',
		//   gradient: {
		//     shade: 'light',
		//     type: "horizontal",
		//     shadeIntensity: 0.5,
		//     background:'#9747ff', // purple
		//     inverseColors: true,
		//     stops: [0, 100]
		//   },
		},
		colors: ['#9747ff'], // blue
		labels: ['Enrollment Range'],
		series: [50] // this controls how much of the semi-circle is filled
	};
	var chart = new ApexCharts($("#"+eleID)[0], options);
	chart.render();
	$("#"+eleID).css({"visibility":"visible","opacity":"1"});
}

function getRequestForReferralCodeAndLink(formId, userId){
	if(userId=='' || userId==undefined){
		userId=USER_ID;
	}
	var filterRequest = {};
	var authentication = {};
	authentication['hash'] = getHash();
	authentication['schoolId'] = SCHOOL_ID;
	authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = USER_ROLE;
	authentication['userId'] = userId;
	filterRequest['authentication'] = authentication;
	return filterRequest;
}

function getReferralCodeAndLinksDetails(userId) {
	var responseData={};
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : BASE_URL + CONTEXT_PATH + SCHOOL_UUID +'/dashboard/referral-and-links',
		data : JSON.stringify(getRequestForReferralCodeAndLink(userId)),
		dataType : 'json',
		async : false,
		success : function(data) {
			responseData=data;
		}
	});
	return responseData;
}


function getEnrollmentChart(eventid, lable, series){
	var options = {
		series: series,//[44, 55, 41, 17],
		labels: lable,//['Grade K - 5', 'Grade 6 - 8', 'Grade 9 - 12', 'Flexy Program'],
		chart: {
			type: 'donut',
			height: 100,
		},
		dataLabels: {
			enabled: false,
		},
		plotOptions: {
			pie: {
				donut: {
					size: '75%',
					style: {
						display:"none"
					},
					labels: {
						show: true,
						name: {
							//show: true,
						},
						//   value: {
						// 	show: true,
						// 	formatter: function (val) {
						// 	  return val
						// 	}
						//   },
						total: {
							show: true,
							label: 'Total',
							fontSize: '13px',
							fontWeight: 400,
						},
					}
				}
			}
		},
		responsive: [{
			breakpoint: 480,
			options: {
				chart: {
					// width: 100+"%",
					height: 150,
					
				},
				legend: {
					show:false,
					position: 'bottom'
				}
			}
		}]
	  };
	var chart = new ApexCharts(document.querySelector("#"+eventid), options);
	chart.render();
	chart.update();
}

function getRequestForPartnerStudentGrade(formId, userId){
	if(userId=='' || userId==undefined){
		userId=USER_ID;
	}
	var filterRequest = {};
	var authentication = {};
	authentication['hash'] = getHash();
	authentication['schoolId'] = SCHOOL_ID;
	authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = USER_ROLE;
	authentication['userId'] = userId;
	filterRequest['authentication'] = authentication;
	return filterRequest;
}

function getPartnerStudentGrade(formId, elementId ,userId, learningProgramCode,enrollmentFor) {
	var responseData={};
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : BASE_URL + CONTEXT_PATH + SCHOOL_UUID +'/dashboard/get-partner-student-list-gradewise',
		data : JSON.stringify(getRequestForPartnerCommissionRate(formId, userId, learningProgramCode, enrollmentFor)),
		dataType : 'json',
		async : false,
		global : false,
		success : function(data) {
			//console.log(data);
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if (data['status'] == '3') {
					redirectLoginPage();
				} 
			}else{
				if(learningProgramCode=='ONE_TO_ONE' && enrollmentFor=='enrollment'){
					var one_to_one=getRegisterDataByGrade(data,'one_to_one');
					getEnrollmentChart(elementId, one_to_one.lable, one_to_one.series);
				}else if(learningProgramCode=='ONE_TO_ONE_FLEX' && enrollmentFor=='enrollment'){
					var fOnetoOne=getRegisterDataByGrade(data,'f_one_to_one');
					getEnrollmentChart(elementId, fOnetoOne.lable, fOnetoOne.series);
				}else if(learningProgramCode=='BATCH' && enrollmentFor=='enrollment'){
					var group=getRegisterDataByGrade(data,'group');
					getEnrollmentChart(elementId, group.lable, group.series);
				}else if(learningProgramCode=='SCHOLARSHIP' && enrollmentFor=='enrollment'){
					var self=getRegisterDataByGrade(data,'self');
					getEnrollmentChart(elementId, self.lable, self.series);
				}else if(learningProgramCode=='SSP' && enrollmentFor=='enrollment'){
					var ssp=getRegisterDataByGrade(data,'ssp');
					getEnrollmentChart(elementId, ssp.lable, ssp.series);
				}else if(learningProgramCode=='SSP' && enrollmentFor=='exact-path-enrollment'){
					var el_ssp=getRegisterDataByGrade(data,'elpss');
					getEnrollmentChart(elementId, el_ssp.lable, el_ssp.series);
				}if(learningProgramCode=='ONE_TO_ONE' && enrollmentFor=='exact-path-enrollment'){
					var el_one_to_one=getRegisterDataByGrade(data,'el_one_to_one');
					getEnrollmentChart(elementId, el_one_to_one.lable, el_one_to_one.series);
				}else if(learningProgramCode=='BATCH' && enrollmentFor=='exact-path-enrollment'){
					var el_group=getRegisterDataByGrade(data,'el_group');
					getEnrollmentChart(elementId, el_group.lable, el_group.series);
				}else if(learningProgramCode=='SCHOLARSHIP' && enrollmentFor=='exact-path-enrollment'){
					var el_self=getRegisterDataByGrade(data,'el_self');
					getEnrollmentChart(elementId, el_self.lable, el_self.series);
				}else if(learningProgramCode=='DUAL_DIPLOMA' && enrollmentFor=='enrollment'){
					var dual=getRegisterDataByGrade(data,'dual');
					getEnrollmentChart(elementId, dual.lable, dual.series);
				}
				// else if(elementId=='chart-pie-enroll-elpss'){
				// 	var self=getRegisterDataByGrade(data,'elpss');
				// 	getEnrollmentChart(elementId, self.lable, self.series);
				// }
				
			}
		},
		error: function(e){
			if (checkonlineOfflineStatus()) {
				return;
			}
		}
	});
	return true;
}

function getRegisterDataByGrade(data, dataType){
	var charSeries=[];
	var series=[];
	var lable=[];
	
	// var grade_k_one_to_one=0;
	// var grade_k_group=0;
	// var grade_k_self=0;
	// var grade_k_ssp=0;
	// var grade_k_elpss=0;
	var grade_k_total=0;
	var grade_k_lableStr="";

	// var grade_6_one_to_one=0;
	// var grade_6_group=0;
	// var grade_6_self=0;
	// var grade_6_ssp=0;
	// var grade_6_elpss=0;
	var grade_6_total=0;
	var grade_6_lableStr="";

	// var grade_9_one_to_one=0;
	// var grade_9_group=0;
	// var grade_9_self=0;
	// var grade_9_ssp=0;
	// var grade_9_elpss=0;
	var grade_9_total=0;
	var grade_9_lableStr="";

	// var grade_f_one_to_one=0;
	// var grade_f_group=0;
	// var grade_f_self=0;
	// var grade_f_ssp=0;
	// var grade_f_elpss=0;
	// var grade_f_total=0;
	var grade_f_lableStr="";
	var grade_f_k_total=0;
	var grade_f_k_lableStr="";

	var grade_f_6_total=0;
	var grade_f_6_lableStr="";

	var grade_f_9_total=0;
	var grade_f_9_lableStr="";

	var grade_du_one_to_one=0;
	var grade_du_group=0;
	var grade_du_self=0;
	var grade_du_ssp=0;
	var grade_du_elpss=0;
	var grade_du_lableStr="";

	var gradeWiseStudentList=data.gradeWiseStudentList;
	if(gradeWiseStudentList.length>0){
		for (let i = 0; i < gradeWiseStudentList.length; i++) {
			const gradeWiseStudent = gradeWiseStudentList[i];
			if(dataType=='dual'){
				if(gradeWiseStudent.standard_id==4
					|| gradeWiseStudent.standard_id==5
					|| gradeWiseStudent.standard_id==6
					|| gradeWiseStudent.standard_id==7
				){
					grade_k_total=grade_k_total+ parseInt(gradeWiseStudent.totalStudent);
				 	grade_k_lableStr="Grade 9 - 12";
				}
			}else if(dataType=='el_one_to_one' || dataType=='el_self'){
				if(gradeWiseStudent.standard_id==11){
					grade_k_total=grade_k_total+ parseInt(gradeWiseStudent.totalStudent);
				 	grade_k_lableStr="Basic | Beginner";
				}else if(gradeWiseStudent.standard_id==1){
					grade_6_total=grade_6_total+ parseInt(gradeWiseStudent.totalStudent);
				 	grade_6_lableStr="Middle | Intermediate";
				}else if(gradeWiseStudent.standard_id==4){
					grade_9_total=grade_9_total+ parseInt(gradeWiseStudent.totalStudent);
				 	grade_9_lableStr="Pro | Advanced";
				}
			}else{

				if(gradeWiseStudent.standard_id==11 || gradeWiseStudent.standard_id==12 
					|| gradeWiseStudent.standard_id==13 || gradeWiseStudent.standard_id==14
					|| gradeWiseStudent.standard_id==15 || gradeWiseStudent.standard_id==16
				){
					grade_k_total=grade_k_total+ parseInt(gradeWiseStudent.totalStudent);
					grade_k_lableStr="Grade K - 5";
				}else if(gradeWiseStudent.standard_id==1 || gradeWiseStudent.standard_id==2 || gradeWiseStudent.standard_id==3){
					grade_6_total=grade_6_total+ parseInt(gradeWiseStudent.totalStudent);
					grade_6_lableStr="Grade 6 - 8";
				}else if(gradeWiseStudent.standard_id==4 
					|| gradeWiseStudent.standard_id==5 
					|| gradeWiseStudent.standard_id==6 
					|| gradeWiseStudent.standard_id==7){
	
						grade_9_total=grade_9_total+ parseInt(gradeWiseStudent.totalStudent);
						grade_9_lableStr="Grade 9 - 12";
	
				}
				else if(gradeWiseStudent.standard_id==9
					|| gradeWiseStudent.standard_id==10
					|| gradeWiseStudent.standard_id==19
					|| gradeWiseStudent.standard_id==20
					|| gradeWiseStudent.standard_id==21
				){
					if(gradeWiseStudent.standard_id==19){
						grade_f_k_total=grade_f_k_total+ parseInt(gradeWiseStudent.totalStudent);
						grade_f_k_lableStr="Grade K - 5" //"Flexy - Elementary School";
					}else if(gradeWiseStudent.standard_id==9){
						grade_f_6_total=grade_f_6_total+ parseInt(gradeWiseStudent.totalStudent);
						grade_f_6_lableStr="Grade 6 - 8"//"Flexy - Middle School";
					}else if(gradeWiseStudent.standard_id==10 || gradeWiseStudent.standard_id==20 || gradeWiseStudent.standard_id==21){
		
						grade_f_9_total=grade_f_9_total+ parseInt(gradeWiseStudent.totalStudent);
						grade_f_9_lableStr="Grade 9 - 12"//"Flexy - High School";
					}
				}
			}
		}

		if(dataType=='dual'){
			series=[grade_k_total];
		}else if(dataType=='f_one_to_one'){
			series=[grade_f_k_total, grade_f_6_total, grade_f_9_total];
		}else{
			series=[grade_k_total, grade_6_total, grade_9_total];
		}
		if(dataType=='dual'){
			lable=[grade_k_lableStr];
		}else if(dataType=='f_one_to_one'){
			lable=[grade_f_k_lableStr, grade_f_6_lableStr, grade_f_9_lableStr];
		}else{
			lable=[grade_k_lableStr, grade_6_lableStr, grade_9_lableStr];
		}

		charSeries['series']=series;
		charSeries['lable']=lable;
		return charSeries;
	}

}
function applyDiscountMsgShow(discountEleID){
	if($("#"+discountEleID).val()=='0'){
		$("#discountMsgTag").html(``);
		$("#discountMsgTag").hide();
		$('#discountMsgTag').attr('data-discount-code','');
		$('#discountMsgTag').attr('data-discount-value','');
		$('#discountMsgTag').attr('data-discount-type','');
	}else{
		var discountType = $("#"+discountEleID+" option:selected").attr(`discounttype`) == 'P'?`%`:` USD`
		$("#discountMsgTag").html(`<b class="full text-success">All enrollments links now have a `+$("#"+discountEleID).val()+discountType+` discount</b>`);
		$("#discountMsgTag").show();
		$('#discountMsgTag').attr('data-discount-code',$("#"+discountEleID+" option:selected").attr(`discountCode`));
		$('#discountMsgTag').attr('data-discount-value',$("#"+discountEleID).val());
		$('#discountMsgTag').attr('data-discount-type',$("#"+discountEleID+" option:selected").attr(`discounttype`));
	}
}


function callB2BDashboardLead(moduleId,leadType) {
	$.ajax({
			type : "POST",
			contentType : "application/json",
			url : getURLForHTML('dashboard', 'b2b-dashboard-lead'),
			data : JSON.stringify(getRequestForB2bDashboard(moduleId,leadType)),
			dataType : 'json',
			cache : false,
			timeout : 600000,
			success : function(data) {
				
				if (data['status'] == '0' || data['status'] == '2') {
					showMessage(true, data['message']);
				} else {
					//console.log(data.leadCountDetailDTO);
					var totalCount = data.leadCountDetailDTO;
					if(totalCount.totalLeads!=''){
						$("#totalB2bLead").text(totalCount.totalLeads);
					}
					if(totalCount.totalConverted!=''){
						$("#convertB2bLead").text(totalCount.totalConverted);
					}
					if(totalCount.unattendedLead!=''){
						$("#unattendedB2bLead").text(totalCount.unattendedLead);
					}
					if(totalCount.followupLead1!=''){
						$("#positiveB2bLead").text(totalCount.followupLead1);
					}
					
					
				}
			},
				error : function(e) {
					console.log(e);
				}
			});
   }
   

   function getRequestForB2bDashboard(moduleId,leadType) {
	var leadCommonDTO={};
	var leadModifyDTO={};
	var leadModifyDetailDTO={};
	var leadStudentDetailDTO={};
	var leadDemoInfo={};
	var leadCallFollowupDTO={};
	var leadCountDetailDTO={};
	leadModifyDTO['schoolId'] = SCHOOL_ID;
	leadModifyDTO['userId'] = USER_ID;
	leadModifyDTO['moduleId'] = moduleId;
	leadModifyDTO['leadFrom'] = 'LEAD';
	leadModifyDTO['clickFrom'] = 'list';
	leadModifyDTO['currentPage'] = 0;
	leadModifyDTO['leadType'] = leadType;
	
	leadCommonDTO['leadModifyDTO']=leadModifyDTO;
	leadCommonDTO['leadModifyDetailDTO']=leadModifyDetailDTO;
	leadCommonDTO['leadStudentDetailDTO']=leadStudentDetailDTO;
	leadCommonDTO['leadDemoInfo']=leadDemoInfo;
	leadCommonDTO['leadCallFollowupDTO']=leadCallFollowupDTO;
	leadCommonDTO['leadCountDetailDTO']=leadCountDetailDTO;
	
	return leadCommonDTO;
}