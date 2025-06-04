function callStudentListByCounselor(formId) {
	var updateTransferMsg =false;
	if($("#"+formId+" #partnerName").val()!=undefined && $("#"+formId+" #partnerName").val()!=""){
		updateTransferMsg=true;
	}
	
	$.ajax({
			type : "POST",
			contentType : "application/json",
			url : getURLForHTML('dashboard', 'get-student-enrolled-counselor'),
			data : JSON.stringify(getRequestForCounselorEnrolledList(formId)),
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
						var htmls = B2CStudentListDetails(data.studentList, updateTransferMsg);
						$("#enrolled-list").html(htmls);
						$(".follow-up-no").click(function(){
							$(this).find(".fa-angle-down").toggleClass('fa-angle-down fa-angle-up');
							$(this).parent().siblings().find(".fa-angle-up").toggleClass('fa-angle-up fa-angle-down');
							$(this).parent().find(".follow-up-content").slideDown();
							$(this).parent().siblings().find(".follow-up-content").slideUp();
							$(this).parent().addClass("follow-up-accordian-active");
							$(this).parent().siblings().removeClass("follow-up-accordian-active");
						});
						var payhtml = B2CStudentListCommission(data.studentList);
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

function getRequestForCounselorEnrolledList(formId){
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

function callCounselorCountries(formId, value, elementId, preSelected) {
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



function getRequestForCounselorCommissionRate(formId, userId, learningProgramCode, enrollmentFor){
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

function getCounselorCommissionRate(formId, elementId ,userId) {
	return new Promise(function(resolve, reject){
		$.ajax({
			type : "POST",
			contentType : "application/json",
			url : BASE_URL + CONTEXT_PATH + SCHOOL_UUID +'/dashboard/get-counselor-commission-rate',
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
					resolve(data);
					customLoader(false);
					// console.log("sdaf",)
					// var htmls = getPartnerCommissionRateHtml(data.commissionRates);
					// $('#commitRateTbl').dataTable().fnDestroy();
					// $("#"+elementId).html(htmls);
					// $('#commitRateTbl').dataTable({
					// 	/* Disable initial sort */
					// 	"order": []
					// });
	
				}
			},error: function(xhr, status, error) {
				if (checkonlineOfflineStatus()) {
					return;
				}
				console.error('Error: ' + error);
				reject(error);
				customLoader(false);
			}
		});
	});
}

function getCounselorCommissionRateHtml(commissionRates){
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

function updateStudentCounselorCommissionRate(studentStandardId, updateStatus, amount, commRate, referralCode) {
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


function getRequestForCounselorDetails(formId, userId){
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

function getCounselorDetails(userId) {
	var responseData={};
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : BASE_URL + CONTEXT_PATH + SCHOOL_UUID +'/dashboard/counselor-content',
		data : JSON.stringify(getRequestForCounselorDetails(userId)),
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

function getCounselorDashboardDetailsData(userId) {
	var responseData={};
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : BASE_URL + CONTEXT_PATH + SCHOOL_UUID +'/dashboard/counselor-learning-program-content',
		data : JSON.stringify(getRequestForCounselorDetails(userId)),
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



function getRequestForCounselorStudentGrade(formId, userId){
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

function getCounselorStudentGrade(formId, elementId ,userId, learningProgramCode,enrollmentFor) {
	var responseData={};
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : BASE_URL + CONTEXT_PATH + SCHOOL_UUID +'/dashboard/get-counselor-student-list-gradewise',
		data : JSON.stringify(getRequestForCounselorCommissionRate(formId, userId, learningProgramCode, enrollmentFor)),
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
					var one_to_one=getCounselorRegisterDataByGrade(data,'one_to_one');
					getCounselorEnrollmentChart(elementId, one_to_one.lable, one_to_one.series);
				}else if(learningProgramCode=='ONE_TO_ONE_FLEX' && enrollmentFor=='enrollment'){
					var fOnetoOne=getCounselorRegisterDataByGrade(data,'f_one_to_one');
					getCounselorEnrollmentChart(elementId, fOnetoOne.lable, fOnetoOne.series);
				}else if(learningProgramCode=='BATCH' && enrollmentFor=='enrollment'){
					var group=getCounselorRegisterDataByGrade(data,'group');
					getCounselorEnrollmentChart(elementId, group.lable, group.series);
				}else if(learningProgramCode=='SCHOLARSHIP' && enrollmentFor=='enrollment'){
					var self=getCounselorRegisterDataByGrade(data,'self');
					getCounselorEnrollmentChart(elementId, self.lable, self.series);
				}else if(learningProgramCode=='SSP' && enrollmentFor=='enrollment'){
					var ssp=getCounselorRegisterDataByGrade(data,'ssp');
					getCounselorEnrollmentChart(elementId, ssp.lable, ssp.series);
				}else if(learningProgramCode=='SSP' && enrollmentFor=='exact-path-enrollment'){
					var el_ssp=getCounselorRegisterDataByGrade(data,'elpss');
					getCounselorEnrollmentChart(elementId, el_ssp.lable, el_ssp.series);
				}if(learningProgramCode=='ONE_TO_ONE' && enrollmentFor=='exact-path-enrollment'){
					var el_one_to_one=getCounselorRegisterDataByGrade(data,'el_one_to_one');
					getCounselorEnrollmentChart(elementId, el_one_to_one.lable, el_one_to_one.series);
				}else if(learningProgramCode=='BATCH' && enrollmentFor=='exact-path-enrollment'){
					var el_group=getCounselorRegisterDataByGrade(data,'el_group');
					getCounselorEnrollmentChart(elementId, el_group.lable, el_group.series);
				}else if(learningProgramCode=='SCHOLARSHIP' && enrollmentFor=='exact-path-enrollment'){
					var el_self=getCounselorRegisterDataByGrade(data,'el_self');
					getCounselorEnrollmentChart(elementId, el_self.lable, el_self.series);
				}else if(learningProgramCode=='DUAL_DIPLOMA' && enrollmentFor=='enrollment'){
					var dual=getCounselorRegisterDataByGrade(data,'dual');
					getCounselorEnrollmentChart(elementId, dual.lable, dual.series);
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

function getCounselorEnrollmentChart(eventid, lable, series){
	
	var options = {
		series: series,//[44, 55, 41, 17],
		labels: lable,//['Grade K - 5', 'Grade 6 - 8', 'Grade 9 - 12', 'Flexy Program'],
		chart: {
			type: 'donut',
			height: 100,
			style: {
				fontSize: '10px', // <-- Resize total label here
				fontWeight: 600,   // Optional: bold
				color: '#000'      // Optional: custom color
			  }
		},
		dataLabels: {
			enabled: false,
		},
		plotOptions: {
			pie: {
			  donut: {
				size: '75%',
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
					// formatter: function (w) {
					//   return w.globals.seriesTotals.reduce((a, b) => {
					// 	return a + b
					//   }, 0)
					// }
				  },

				}
			  }
			}
		  },
		responsive: [{
			breakpoint: 480,
			options: {
			chart: {
				width: 200
			},
			legend: {
				position: 'bottom'
			}
			}
		}]
	  };

	  var chart = new ApexCharts(document.querySelector("#"+eventid), options);
	  chart.render();
	  chart.update();
}

function getCounselorRegisterDataByGrade(data, dataType){
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

		// if(dataType=='one_to_one'){
		// 	series=[grade_k_one_to_one, grade_6_one_to_one, grade_9_one_to_one];
		// }else if(dataType=='group'){
		// 	series=[grade_k_group, grade_6_group, grade_9_group];
		// }else if(dataType=='self'){
		// 	series=[grade_k_self, grade_6_self, grade_9_self];
		// }else if(dataType=='ssp'){
		// 	series=[grade_k_ssp, grade_6_ssp, grade_9_ssp];
		// }else if(dataType=='elpss'){
		// 	series=[grade_k_elpss, grade_6_elpss, grade_9_elpss];
		// }else 
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

function resetCounselorCommissionRate(formId){
	$("#"+formId+" #byPartnerType").val("P");
	$("#"+formId+" #byPartnerValue").val("");
	$("#"+formId+" #bySchoolType").val("P");
	$("#"+formId+" #bySchoolValue").val("");
	$("#"+formId+" #bySchoolPartnerType").val("P");
	$("#"+formId+" #bySchoolPartnerValue").val("");
	$("#"+formId+" #learningProgram").val("A").trigger("change");
	$("#"+formId+" #standardId").val("").trigger("change");
	$("#"+formId+" #startDate").val("").datepicker("update");
	$("#"+formId+" #endDate").val("").datepicker("update");
	$("#"+formId+" #enrollRange").val("0").trigger("change");
}

function resetCounselorFilterByForm(formId){
	$("#"+formId+" #learningProgramFilter").val("").trigger("change");
	$("#"+formId+" #standardIdFilter").val("").trigger("change");
}

function getCounselorCommissionRatesChart(eleID, chartIndexVal, min, max){
	// var chartValmin=max+min;
	// var chartValmax=100;
	// if(min>0){
	// 	chartValmin=chartValmin-min;
	// }
	// if(max>0){
	// 	chartValmax=chartValmax-max;
	// }
	// if(chartValmax>chartValmin){}
	// else{
	// 	chartValmax=chartValmin;
	// }

	if(chartIndexVal!="undefined"){
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
					fontSize: '14px'
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
			colors: ['#3c92ff'], // blue
			labels: ['Enrollment Range'],
			series: [0] // this controls how much of the semi-circle is filled
		};
		var chart = new ApexCharts($("#"+eleID)[0], options);
		chart.render();
		$("#"+eleID).css({"visibility":"visible","opacity":"1"});
	}

}
function getCounselorPartnerCommissionRatesChart(eleID, chartIndexVal, min, max){
	// var chartValmin=max+min;
	// var chartValmax=100;
	// if(min>0){
	// 	chartValmin=chartValmin-min;
	// }
	// if(max>0){
	// 	chartValmax=chartValmax-max;
	// }
	// if(chartValmax>chartValmin){}
	// else{
	// 	chartValmax=chartValmin;
	// }

	if(chartIndexVal!="undefined"){
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
					fontSize: '14px'
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

}
function validateCounselorCommissionRate(formId){
	hideMessage('');
	if ($("#"+formId+" #byPartnerType").val()=="") {
		showMessageTheme2(0, 'Lead Provided By Partner type required.', '', true);
		return false
	}
	if ($("#"+formId+" #byPartnerValue").val()=="") {
		showMessageTheme2(0, 'Commission rate required.', '', true);
		return false
	}
	// if ($("#"+formId+" #bySchoolType").val()=="") {
	// 	showMessageTheme2(0, 'Lead Provided By IS required.', '', true);
	// 	return false
	// }
	// if ($("#"+formId+" #bySchoolValue").val()=="") {
	// 	showMessageTheme2(0, 'Commission rate required.', '', true);
	// 	return false
	// }
	// if ($("#"+formId+" #bySchoolValue").val()=="") {
	// 	showMessageTheme2(0, 'Commission rate required.', '', true);
	// 	return false
	// }
	
	if ($("#"+formId+" #learningProgram").val()=='') {
		showMessageTheme2(0, 'Learning program is required', '', true);
		return false
	}
	if ($("#"+formId+" #learningProgram").val()=='A') {

	}else{
		if ($("#"+formId+" #standardId").val()=='') {
			showMessageTheme2(0, 'Grade is required', '', true);
			return false
		}
	}
	if ($("#"+formId+" #startDate").val()=="") {
		showMessageTheme2(0, 'Applicable From Date required.', '', true);
		return false
	}
	// if ($("#"+formId+" #endDate").val()=="") {
	// 	showMessageTheme2(0, 'Applicable Till Date required.', '', true);
	// 	return false
	// }
	return true;
}


function getRequestForSaveCounselorCommissionRate(formId){
	var request = {};
	var commissionRate = {};
	commissionRate['assignTo'] =  $("#"+formId+" #assignTo").val();
	commissionRate['byPartnerType'] =  $("#"+formId+" #byPartnerType").val();
	commissionRate['byPartnerValue'] =  $("#"+formId+" #byPartnerValue").val();
	commissionRate['bySchoolType'] =  $("#"+formId+" #bySchoolType").val();
	commissionRate['bySchoolValue'] =  $("#"+formId+" #bySchoolValue").val();

	commissionRate['bySchoolPartnerType'] =  $("#"+formId+" #bySchoolPartnerType").val();
	commissionRate['bySchoolPartnerValue'] =  $("#"+formId+" #bySchoolPartnerValue").val();
	var learningPrograms=[];
	learningPrograms.push($("#"+formId+" #learningProgram").val());
	commissionRate['learningPrograms'] = learningPrograms;
	var isAllGrade=$("#"+formId+" #standardId").val().find((element) => element == 'A');
	if(isAllGrade!= undefined || isAllGrade=='A' || isAllGrade==''){
		var learningProgramValue = $('#'+formId+' #learningProgram').val();
		if(learningProgramValue=='A'){
			commissionRate['standardIds'] = [0];
		}else{
			if(learningProgramValue=='ONE_TO_ONE_FLEX'){
				commissionRate['standardIds'] = [19,9,10,20,21];
			}else if(learningProgramValue=='BATCH'){
				commissionRate['standardIds'] = [11,12,13,14,15,16,1,2,3,4,5,6,7];
			}else{
				commissionRate['standardIds'] = [11,12,13,14,15,16,1,2,3,4,5,6,7];
			}
		}
	}else{
		commissionRate['standardIds'] =  $("#"+formId+" #standardId").val();
	}
	commissionRate['enrollRange'] =  $("#"+formId+" #enrollRange").val();
	commissionRate['startDate'] =  $("#"+formId+" #startDate").val();
	commissionRate['endDate'] =  $("#"+formId+" #endDate").val()!=undefined?$("#"+formId+" #endDate").val():"";
	var authentication = {};
	authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = USER_ROLE;
	authentication['userId'] = USER_ID;
	request['authentication'] = authentication;
	request['commissionRate'] = commissionRate;
	return request;
}


function saveCounselorCommissionRate(formId) {
	hideMessage('');
	if(!validateCounselorCommissionRate(formId)){
		return false;
	}
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : BASE_URL + CONTEXT_PATH + SCHOOL_UUID +'/dashboard/save-counselor-commission-rate',
		data : JSON.stringify(getRequestForSaveCounselorCommissionRate(formId)),
		dataType : 'json',
		async : false,
		global : false,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if (data['status'] == '3') {
					redirectLoginPage();
				} else {
					showMessageTheme2(0, data['message'], '', false);
				}
			}else{
				showMessageTheme2(1, data['message'], '', true);
			}
		},
		error: function(e){
			if (checkonlineOfflineStatus()) {
				return;
			}
		}
	});
}

function getCounselorCommissionRateFilter(formId){
	var data=fetchCounselorCommissionRate(formId);
	var html=getFilteredCounselorCommissionRateContent(formId, data);
	$('#commissionRateFilteredData > tbody').html(html);
	$(".datepicker").datepicker({
		autoclose: true,
		format: 'M d, yyyy',
	});
	if($("#learningProgramFilter").val().length != null && $("#learningProgramFilter").val().length != undefined && $("#learningProgramFilter").val().length != 0 && $("#standardIdFilter").val().length != null && $("#standardIdFilter").val().length != undefined && $("#standardIdFilter").val().length != 0){
		$(".bulkEditBtn").show("show");
		$(".commissionTable thead > tr th:last-child, .commissionTable tbody > tr td:last-child").show();
		$(".commissionTable thead > tr th:nth-last-child(2)").removeClass("rounded-top-right-10");
		$(".bulk-update-and-cancel-btn").hide();
	}
}
function getFilteredCounselorCommissionRateContent(formId, data){
	var html = '';
	$.each(data.commissionRates, function(k,commissionRate){
		var range = commissionRate.min_range+'+';
		if(commissionRate.max_range>0){
			range=commissionRate.min_range+'-'+commissionRate.max_range;
		}
		html+=
		'<tr class="td-border-design border-color-gray" commissionRateId="'+commissionRate.id+'">'
			+'<td class="border-width-1">'+(k+1)+'</td>'
			+'<td class="border-width-1">'+commissionRate.standardName+'</td>'
			+'<td class="border-width-1">'+commissionRate.learningProgramValue+'</td>'
			+'<td class="p-0 border-width-1">'
				+'<table class="table m-0" style="table-layout: fixed; max-width: 270px;">'
					+'<tbody>'
						+'<tr>'
							+'<td class="border-left-0 border-bottom-0">'
								+'<div class="edit-value">'+(commissionRate.byPartnerType=='F'?'Amount in USD':'Percentage')+'</div>'
								+'<div class="edit-value-element" style="display: none;">'
									+'<select name="byPartnerType_'+commissionRate.id+'" id="byPartnerType_'+commissionRate.id+'" class="form-control byPartnerType">'
										+'<option value="P" '+(commissionRate.byPartnerType=='P'?'selected':'')+'>Percentage</option>'
										+'<option value="F" '+(commissionRate.byPartnerType=='F'?'selected':'')+'>Amount in USD without $ sign</option>'
									+'</select>'
								+'</div>'
							+'</td>'
							+'<td class="border-right-0 border-bottom-0">'
								+'<div class="edit-value">'+(commissionRate.byPartnerType=='F'?'$':'')+commissionRate.byPartnerValue+(commissionRate.byPartnerType=='F'?'':'')+'</div>'
								+'<div class="edit-value-element font-12" style="display: none;">'
								+'<input type="text" name="byPartnerValue_'+commissionRate.id+'" id="byPartnerValue_'+commissionRate.id+'" value="'+commissionRate.byPartnerValue+'" class="form-control byPartnerValue">'
								+'</div>'
							+'</td>'
						+'</tr>'
					+'</tbody>'
				+'</table>'
			+'</td>'
			+'<td class="p-0 border-width-1">'
				+'<table class="table m-0" style="table-layout: fixed;max-width: 270px;">'
					+'<tbody>'
						+'<tr>'
							+'<td class="border-left-0 border-bottom-0">'
								+'<div class="edit-value">'+(commissionRate.bySchoolType=='F'?'Amount in USD':'Percentage')+'</div>'
								+'<div class="edit-value-element" style="display: none;">'
									+'<select name="bySchoolType_'+commissionRate.id+'" id="bySchoolType_'+commissionRate.id+'" class="form-control bySchoolType">'
									+'<option value="P" '+(commissionRate.bySchoolType=='P'?'selected':'')+'>Percentage</option>'
									+'<option value="F" '+(commissionRate.bySchoolType=='F'?'selected':'')+'>Amount in USD without $ sign</option>'
									+'</select>'
								+'</div>'
							+'</td>'
							+'<td class="border-right-0 border-bottom-0">'
							+'<div class="edit-value">'+(commissionRate.bySchoolType=='F'?'$':'')+commissionRate.bySchoolValue+(commissionRate.bySchoolType=='F'?'':'')+'</div>'
								+'<div class="edit-value-element font-12" style="display: none;">'
								+'<input type="text" name="bySchoolValue_'+commissionRate.id+'" id="bySchoolValue_'+commissionRate.id+'" value="'+commissionRate.bySchoolValue+'" class="form-control bySchoolValue">'
								+'</div>'
							+'</td>'
						+'</tr>'
					+'</tbody>'
				+'</table>'
			+'</td>'
			+'<td class="p-0 border-width-1">'
				+'<table class="table m-0" style="table-layout: fixed;max-width: 270px;">'
					+'<tbody>'
						+'<tr>'
							+'<td class="border-left-0 border-bottom-0">'
								+'<div class="edit-value">'+(commissionRate.bySchoolPartnerType=='F'?'Amount in USD':'Percentage')+'</div>'
								+'<div class="edit-value-element" style="display: none;">'
									+'<select name="bySchoolPartnerType_'+commissionRate.id+'" id="bySchoolPartnerType_'+commissionRate.id+'" class="form-control bySchoolPartnerType">'
									+'<option value="P" '+(commissionRate.bySchoolPartnerType=='P'?'selected':'')+'>Percentage</option>'
									+'<option value="F" '+(commissionRate.bySchoolPartnerType=='F'?'selected':'')+'>Amount in USD without $ sign</option>'
									+'</select>'
								+'</div>'
							+'</td>'
							+'<td class="border-right-0 border-bottom-0">'
							+'<div class="edit-value">'+(commissionRate.bySchoolPartnerType=='F'?'$':'')+commissionRate.bySchoolPartnerValue+(commissionRate.bySchoolPartnerType=='F'?'':'')+'</div>'
								+'<div class="edit-value-element font-12" style="display: none;">'
								+'<input type="text" name="bySchoolPartnerValue_'+commissionRate.id+'" id="bySchoolPartnerValue_'+commissionRate.id+'" value="'+commissionRate.bySchoolPartnerValue+'" class="form-control bySchoolPartnerValue">'
								+'</div>'
							+'</td>'
						+'</tr>'
					+'</tbody>'
				+'</table>'
			+'</td>'
			+'<td class="border-width-1">'
				+'<div class="edit-value">'+range+'</div>'
				+'<div class="edit-value-element" style="display: none;">'
					+'<select name="enrollRange_'+commissionRate.id+'" id="enrollRange_'+commissionRate.id+'" class="form-control bySchoolType">'
						+'<option value="0">Select Range</option>'
						+'<option value="1-5" '+((commissionRate.min_range+'-'+commissionRate.max_range)=='1-5'?'selected':'')+'>1-5</option>'
						+'<option value="6-10" '+((commissionRate.min_range+'-'+commissionRate.max_range)=='6-10'?'selected':'')+'>6-10</option>'
						+'<option value="11-20" '+((commissionRate.min_range+'-'+commissionRate.max_range)=='11-20'?'selected':'')+'>11-20</option>'
						+'<option value="21-30" '+((commissionRate.min_range+'-'+commissionRate.max_range)=='21-30'?'selected':'')+'>21-30</option>'
						+'<option value="31-50" '+((commissionRate.min_range+'-'+commissionRate.max_range)=='31-50'?'selected':'')+' >31-50</option>'
						+'<option value="50-0" '+((commissionRate.min_range+'-'+commissionRate.max_range)=='50-0'?'selected':'')+'>50+</option>'
					+'</select>'
					+'</div>'
			+'</td>'
			+'<td class="border-width-1">'
				+'<div class="edit-value">'+commissionRate.startDate+'</div>'
				+'<div class="edit-value-element" style="display: none;">'
					+'<input type="text" name="startDate" id="startDate_'+commissionRate.id+'" value="'+commissionRate.startDate+'" class="datepicker form-control startDate">'
				+'</div>'
			+'</td>'
			+'<td class="border-width-1">'
				+'<div class="edit-value">'+commissionRate.endDate+'</div>'
				+'<div class="edit-value-element" style="display: none;">'
					+'<input type="text" name="endDate" id="endDate_'+commissionRate.id+'" value="'+commissionRate.endDate+'" class="datepicker form-control endDate">'
				+'</div>'
			+'</td>'
			+'<td class="text-center border-width-1">'
				+'<a href="javascript:void(0)" class="text-decoration-none text-primary edit-value" onclick="editRow(this)">'
					+'<i class="fa fa-edit"></i>'
				+'</a>&nbsp;'
				+'<a href="javascript:void(0)" class="text-decoration-none text-primary edit-value" onclick="getCommissionRateLogs('+commissionRate.id+')">'
					+'<i class="fa fa-history"></i>'
				+'</a>'
				+'<div class="edit-value-element" style="display: none;">'
					+'<a href="javascript:void(0)" class="text-decoration-none btn btn-primary btn-sm mb-2" onclick="cancelEitRow(this)">'
						+'cancel'
					+'</a>'
					+'<br/>'
					+'<a href="javascript:void(0)" class="text-decoration-none btn btn-success btn-sm" onclick="updateCommissionRate(\'filterCounselorCommissionRate\','+commissionRate.id+')">'
						+'Update'
					+'</a>'
				+'</div>'
			+'</td>'
		+'</tr>'
	});
	return html;
}

function getRequestForFilterCounselorCommissionRate(formId){
	var filterRequest = {};
	var filter = {};
	filter['assignTo'] =  $("#filterCounselorCommissionRate #assignToFilter").val();
	var learningPrograms=[];
	learningPrograms.push($("#"+formId+" #learningProgramFilter").val());
	filter['learningPrograms'] = learningPrograms;
	var isAllGrade=$("#"+formId+" #standardIdFilter").val().find((element) => element == 'A');
	if(isAllGrade!= undefined || isAllGrade=='A' || isAllGrade==''){
		var learningProgramValue = $('#'+formId+' #learningProgramFilter').val();

		if(learningProgramValue=='A'){
			filter['standardIds'] = [0];
		}else{
			if(learningProgramValue=='ONE_TO_ONE_FLEX'){
				filter['standardIds'] = [19,9,10,20,21];
			}else if(learningProgramValue=='BATCH'){
				filter['standardIds'] = [11,12,13,14,15,16,1,2,3,4,5,6,7];
			}else{
				filter['standardIds'] = [11,12,13,14,15,16,1,2,3,4,5,6,7,8];
			}
		}
		
	}else{
		filter['standardIds'] =  $("#"+formId+" #standardIdFilter").val();
	}
	var authentication = {};
	authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = USER_ROLE;
	authentication['userId'] = USER_ID;
	filterRequest['authentication'] = authentication;
	filterRequest['filter'] = filter;
	return filterRequest;
}

function fetchCounselorCommissionRate(formId) {
	if($("#"+formId+" #learningProgramFilter").val().length==0){
		showMessageTheme2(0, 'Select Learning program', '', true);
		return false
	}
	if ($("#"+formId+" #learningProgramFilter").val()=='A') {

	}else{
		if($("#"+formId+" #standardIdFilter").val().length==0){
			showMessageTheme2(0, 'Select Grade', '', true);
			return false
		}
	}
	var responseData={};
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : BASE_URL + CONTEXT_PATH + SCHOOL_UUID +'/dashboard/filter-counselor-commission-rate',
		data : JSON.stringify(getRequestForFilterCounselorCommissionRate(formId)),
		dataType : 'json',
		async : false,
		global : false,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if (data['status'] == '3') {
					redirectLoginPage();
				} else {
					showMessageTheme2(0, data['message'], '', true);
				}
			}else{
				responseData=data;
				showMessageTheme2(1, 'Commission rate based on filter criteria', '', true);
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



function getRequestForLeadList(moduleId ,leadFrom, clickFrom, startDate, endDate, country, campaign, currentPage, userId, leadType){
	if(userId=='' || userId==undefined){
		userId=USER_ID;
	}
	var data={};
	data['userId']=userId;
	data['moduleId'] = moduleId;
	data['leadFrom'] = leadFrom;
	data['clickFrom'] = clickFrom;
	data['startDate'] = startDate;
	data['endDate'] = endDate;
	data['country'] = country;
	data['campaign'] = campaign;
	data['currentPage'] = currentPage;
	data['leadType'] = leadType;
	return data;
}

function getLeadListData(moduleId ,leadFrom, clickFrom, startDate, endDate, country, campaign, currentPage, userId, leadType) {
	//"lead-list?moduleId=" +roleAndModule.moduleId + "&leadFrom=LEAD&clickFrom=list&startDate=&endDate=&country=0&campaign=&currentPage=0&euid=" +ENCRYPTED_USER_ID +"&leadType=" +LEAD_CATEGORY
	return new Promise(function(resolve, reject){
		$.ajax({
			type : "POST",
			contentType : "application/json",
			url : BASE_URL + CONTEXT_PATH + SCHOOL_UUID +'/dashboard/lead-list',
			data : JSON.stringify(getRequestForLeadList(moduleId ,leadFrom, clickFrom, startDate, endDate, country, campaign, currentPage, userId, leadType)),
			dataType : 'json',
			async:true,
			global : true,
			success : function(data) {
				console.log(data);
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

	
