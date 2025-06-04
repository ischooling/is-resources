$(document).ready(function(){
$("#studentDetailsDiv").hide();
$(".add-row").unbind('click').bind("click", function(){
       var x = document.getElementById("ct_blah").rows.length;
       if (x<5) {
        var $lastRow = $("[id$=blah] tr:not('.ui-widget-header'):last");
        var $newRow = $lastRow.clone('');
        $newRow.find(":text").val("");
        $lastRow.after($newRow);
       }
       else{
        alert('You have reached maximum limit');
       };
	});

	$("#startDate").datepicker({
		format : 'M dd, yyyy',
	    autoclose: true,
	});

	$("#endDate").datepicker({
		format : 'M dd, yyyy',
	    autoclose: true,
	});
	$('#assignedGradeStudentDetailsDiv').hide();
	$('#assignedgradeStudentDiv').hide();
	$('#assignedTotalStudentDetailsDiv').hide();

})
function getURLForattendance(apiType, suffixUrl) {
	return BASE_URL+CONTEXT_PATH+apiType + '/' + suffixUrl;
}
function getTeacherCompensationDetails(formId, moduleId,controlType){
	var teacherId = $("#teacherId").val();
	$("#errorStart").text('');
	$("#errorEnd").text('');
	if($("#startDate").val()==''){
		$("#errorStart").text("Please select start date");
		return false;
	}
	if($("#endDate").val()==''){
		$("#errorEnd").text("Please select end date");
		return false;
	}
	$("#studentDetailsDiv").hide();
	var strtDT = new Date($("#startDate").val());
	var endDT = new Date($("#endDate").val());

	var startDate = changeDateFormat(strtDT, 'yyyy-mm-dd');
	var endDate = changeDateFormat(endDT, 'yyyy-mm-dd');
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForHTML('dashboard','teacher-assigned-grade-student-data'),
		data : JSON.stringify(getRequestForTeacherAssignedDetails(teacherId,startDate,endDate,controlType )),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				return "redirect:/common/login";
			} else {
				$('#assignedgradeStudentDiv').show();
				getAssignedGradeStudentTeacher(data['teacherAssignGradeDTO'])
			}
			return false;
		},
		error : function(e) {
			//showMessage(true, e.responseText);
			return false;
		}
	});

}
function getAssignedGradeStudentTeacher(teacherAssignGradeDTO){

	$('#assignedGradeStudentDetailsDiv').hide();
	$('#assignedTotalStudentDetailsDiv').hide();
	$('#assignedgradeStudentTable tbody').html('');
				assignedgradeStudentTableTr = '<tr>'
				+'<td data-label="Total" text-color="#fff" style="background-color:#3f6ad8 !important">'
				+'<a href="javascript:void(0);" style="color:#fff !important" onclick="showAssingedPersonalizedStudentTable(\'ONE_TO_ONE\')">'
				+	teacherAssignGradeDTO.countOfStudents+'</a></td>'
				+'<td data-label="Total" text-color="#fff" style="background-color:#3f6ad8 !important" >'
				+'<a href="javascript:void(0);" style="color:#fff !important" onclick="showAssingedBatchStudentTable(\'BATCH\')">'
				+ teacherAssignGradeDTO.countOfBatches+' ('+	 teacherAssignGradeDTO.countOfStudentsInBatches+')</a></td>'
				+'<td data-label="Total" text-color="#fff" style="background-color:#3f6ad8 !important">'
				+'<a href="javascript:void(0);" style="color:#fff !important" onclick="showAssingedPersonalizedStudentTable(\'SCHOLARSHIP\')">'
				+	teacherAssignGradeDTO.countOfAcceleratedStudents+'</a></td>'
				+'<td data-label="Total" text-color="#fff" style="background-color:#3f6ad8 !important">'
				+'<a href="javascript:void(0);" style="color:#fff !important" onclick="showAssingedPersonalizedStudentTable(\'ONE_TO_ONE_FLEX\')">'
				+	teacherAssignGradeDTO.countOfFlexStudents+'</a></td>'
				+'</tr>'
				$('#assignedgradeStudentTable tbody').append(assignedgradeStudentTableTr);
}

function showAssingedPersonalizedStudentTable(controlType){
	$("#studentDetailsDiv").hide();
	var teacherId = $("#teacherId").val();
	var strtDT = new Date($("#startDate").val());
	var endDT = new Date($("#endDate").val());

	var startDate = changeDateFormat(strtDT, 'yyyy-mm-dd');
	var endDate = changeDateFormat(endDT, 'yyyy-mm-dd');

	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForHTML('dashboard','teacher-assigned-total-student-data'),
		data : JSON.stringify(getRequestForTeacherAssignedDetails(teacherId, startDate, endDate,controlType)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				return "redirect:/common/login";
			} else {

				if(data['teacherAssignGradeDTOList'].length>0){
					$('#assignedGradeStudentDetailsDiv').show();
					$('#assignedTotalStudentDetailsDiv').hide();
					$('#assignedGradeStudentDetailsTable tbody').html('');
					var sno=0;
					$.each(data['teacherAssignGradeDTOList'], function(k, stud) {
						sno++;
						assignedGradeStudentDetailsTableTr='<tr >'
												+'<td>'+sno+'</td>'
												+'<td>'+stud.gradeName+'</td>'
												+'<td>'
												+'<a href="javascript:void(0);" class="btn btn-sm btn-primary text-white" '
												+'onclick="showPersonalizedStudentCompDetailsTable('+teacherId+',\''+startDate+'\',\''+endDate+'\','+stud.standardId+', \'SOME\')">'
												+ stud.countOfStudents+'</a></td>'
											+'</tr>';
						//console.log(v.entityId)
						$('#assignedGradeStudentDetailsTable tbody').append(assignedGradeStudentDetailsTableTr);
					});
					var showDetails ='<tr > <td colspan="3" class="text-right">'
					+'<a href="javascript:void(0);" class="btn btn-sm btn-primary text-white" '
												+'onclick="showPersonalizedStudentCompDetailsTable('+teacherId+',\''+startDate+'\',\''+endDate+'\', 0 ,\'ALL\')">'
					+'SHOW ALL </td></tr>';
					$('#assignedGradeStudentDetailsTable tbody').append(showDetails);
				}else{
					$('#assignedGradeStudentDetailsDiv').hide();
				}

			}
			return false;
		},
		error : function(e) {
			//showMessage(true, e.responseText);
			return false;
		}
	});

}
function showPersonalizedStudentCompDetailsTable(teacherId,startDate,endDate,standardId,controlType){

	$("#studentDetailsDiv").show();
	var data = {
		'teacherId' : teacherId,
		'standardId' : standardId,
		'controlType' : controlType,
		'startDate' : startDate,
		'endDate' : endDate
	}
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForHTML('dashboard','teacher-student-compensation'),
		data : JSON.stringify(data),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
				if (data['status'] == '0' || data['status'] == '2') {
					return "redirect:/common/login";
				} else {
						if(data['teacherCompensationPartTime'].length>0){
							$('#studentDetailsTable tbody').html('');
							var sno=0;
							$.each(data['teacherCompensationPartTime'], function(k, tc) {
								sno++;
								studentDetailsTableTr='<tr >'
														+'<td>'+sno+'</td>'
														+'<td>'+tc.studentName+'</td> <td>'+tc.standardName+'</td>';
														if(tc.subjectId==0){
															studentDetailsTableTr= studentDetailsTableTr+'<td>'+tc.standardName+'</td>';
														}else{
															studentDetailsTableTr= studentDetailsTableTr+'<td>'+tc.subjectName+'</td>';
														}

													/*	studentDetailsTableTr= studentDetailsTableTr+'<td>'+tc.startDate+'</td>';

														if(tc.endDate=='Dec 31, 2999'){
															studentDetailsTableTr= studentDetailsTableTr+'<td>N/A</td>';
														}else{
															studentDetailsTableTr= studentDetailsTableTr+'<td>'+tc.endDate+'</td>';
														} */

													studentDetailsTableTr= studentDetailsTableTr+'<td>'+tc.enrollStartDate+'</td>';
													if(tc.enrollEndDate=='Dec 31, 2999'){
															studentDetailsTableTr= studentDetailsTableTr+'<td>N/A</td>';
														}else{
															studentDetailsTableTr= studentDetailsTableTr+'<td>'+tc.enrollEndDate+'</td>';
														}

													studentDetailsTableTr=studentDetailsTableTr+'</tr>';
														/* +'<td>'+tc.finalAmount+'</td>' */

								//console.log(v.entityId)
								$('#studentDetailsTable tbody').append(studentDetailsTableTr);
							});
						}
				}
				return false;
			},
		error : function(e) {
			//showMessage(true, e.responseText);
			return false;
		}
	});
}

function showAssingedBatchStudentTable(controlType){
	var teacherId = $("#teacherId").val();
	var strtDT = new Date($("#startDate").val());
	var endDT = new Date($("#endDate").val());

	var startDate = changeDateFormat(strtDT, 'yyyy-mm-dd');
	var endDate = changeDateFormat(endDT, 'yyyy-mm-dd');

	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForHTML('dashboard','teacher-assigned-total-student-data'),
		data : JSON.stringify(getRequestForTeacherAssignedDetails(teacherId, startDate, endDate,controlType)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				return "redirect:/common/login";
			} else {

				if(data['teacherAssignGradeDTOList'].length>0){
					$('#assignedGradeStudentDetailsDiv').hide();
					$('#assignedTotalStudentDetailsDiv').show();
					$('#assignedTotalStudentDetailsTable tbody').html('');
					var sno=0;
					$.each(data['teacherAssignGradeDTOList'], function(k, stud) {
						sno++;
						assignedTotalStudentDetailsTableTr='<tr >'
												+'<td>'+sno+'</td>'
												+'<td>'+stud.gradeName+'</td>'
												+'<td>'+stud.batchName+'</td>'
											+'</tr>';
						//console.log(v.entityId)
						$('#assignedTotalStudentDetailsTable tbody').append(assignedTotalStudentDetailsTableTr);
					});
				}else{
					$('#assignedGradeStudentDetailsDiv').hide();
					$('#assignedTotalStudentDetailsDiv').show();
				}

			}
			return false;
		},
		error : function(e) {
			//showMessage(true, e.responseText);
			return false;
		}
	});

}
function getRequestForTeacherAssignedDetails(teacherId, startDate, endDate,controlType){
	console.log('getRequestForTeacherComp');
	var request = {};
	var authentication = {};
	var requestData = {};
	var teacherCompensationDTO = {};
	teacherCompensationDTO['schoolId']= SCHOOL_ID;
	teacherCompensationDTO['teacherId']=teacherId;
	teacherCompensationDTO['startDate']=startDate;
	teacherCompensationDTO['endDate']=endDate;

	teacherCompensationDTO['controlType']=controlType;

	authentication['hash'] = getHash();
	authentication['schoolId'] = SCHOOL_ID;
	authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = "SCHOOL";
	authentication['userId'] = $("#userId").val();
	request['authentication'] = authentication;
	request['teacherCompensationDTO'] = teacherCompensationDTO;
	return request;
}

function saveTeacherComp(formId,moduleId,teacherId,standardId,controlType, roleModuleId, teacherCompId,index,employeType) {
	hideMessage('');
	if(!validateRequestForTeacherComp(formId,teacherId,standardId,controlType,index,employeType)){
		return false;
	}
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForHTML('dashboard','save-teacher-compensation'),
		data : JSON.stringify(getRequestForTeacherComp(formId, moduleId,teacherId,standardId,controlType, teacherCompId, index,employeType)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				showMessage(true, data['message']);
				$('#teacherCompInfoModal').modal('hide')
				setTimeout(function(){ callTeacherCompModal(teacherId, standardId) }, 1000);
				setTimeout(function(){ setStartDate(index) }, 1000);
			}
			return false;
		},
		error : function(e) {
			//showMessage(true, e.responseText);
			return false;
		}
	});
}
function getRequestForTeacherComp(formId,moduleId,teacherId,standardId,controlType,teacherCompId,index,emloyeeType){
	console.log('getRequestForTeacherComp');
	var request = {};
	var authentication = {};
	var requestData = {};
	var teacherCompensationDTO = {};
	teacherCompensationDTO['schoolId']=$("#"+formId+" #schoolId").val();
	teacherCompensationDTO['teacherId']=teacherId;
	teacherCompensationDTO['standardId']=standardId;
	teacherCompensationDTO['teacherCompId']=teacherCompId;
	teacherCompensationDTO['emplyeeType']=emloyeeType;
	if(emloyeeType=="Full-Time"){
		teacherCompensationDTO['noOfSession']=$("#"+formId+" #noOfSessionFT_"+index).val();
		teacherCompensationDTO['amountInr']=$("#"+formId+" #amountInrFT_"+index).val();
		teacherCompensationDTO['amountUsd']=$("#"+formId+" #amountUsdFT_"+index).val();
		teacherCompensationDTO['basicFeeCalculated']=$("#"+formId+" #amountCalculatedFT_"+index).val();
		teacherCompensationDTO['perClassAmount']=$("#"+formId+" #perClassAmountCalculatedFT_"+index).val();
		teacherCompensationDTO['gradingAmount']=$("#"+formId+" #totalGradingCalculatedFT_"+index).val();
		teacherCompensationDTO['perClassAmountInPercentage']=$("#"+formId+" #perclassAmountFT_"+index).val();
		teacherCompensationDTO['gradingAmountInPercentage']=$("#"+formId+" #gradingAmountFT_"+index).val();
		teacherCompensationDTO['startDate']=$("#"+formId+" .startCompDateFT_"+index).val().split("-")[2]+'-'+$("#"+formId+" .startCompDateFT_"+index).val().split("-")[0]+'-'+$("#"+formId+" .startCompDateFT_"+index).val().split("-")[1];
		if($("#"+formId+" .endCompDateFT_"+index).val()!=''){
			teacherCompensationDTO['endDate']=$("#"+formId+" .endCompDateFT_"+index).val().split("-")[2]+'-'+$("#"+formId+" .endCompDateFT_"+index).val().split("-")[0]+'-'+$("#"+formId+" .endCompDateFT_"+index).val().split("-")[1];
		}
	}else{
		teacherCompensationDTO['noOfSession']=$("#"+formId+" #noOfSession_"+index).val();
		teacherCompensationDTO['sessionType']=$("#"+formId+" #sessionType_"+index).val();
		teacherCompensationDTO['durationComp']=$("#"+formId+" #durationSession_"+index).val();
		teacherCompensationDTO['amountInr']=$("#"+formId+" #amountInr_"+index).val();
		teacherCompensationDTO['amountUsd']=$("#"+formId+" #amountUsd_"+index).val();
		teacherCompensationDTO['basicFeeCalculated']=$("#"+formId+" #amountCalculated_"+index).val();
		teacherCompensationDTO['perClassAmount']=$("#"+formId+" #perClassAmountCalculated_"+index).val();
		teacherCompensationDTO['gradingAmount']=$("#"+formId+" #totalGradingCalculated_"+index).val();
		teacherCompensationDTO['perClassAmountInPercentage']=$("#"+formId+" #perclassAmount_"+index).val();
		teacherCompensationDTO['gradingAmountInPercentage']=$("#"+formId+" #gradingAmount_"+index).val();
		teacherCompensationDTO['startDate']=$("#"+formId+" .startCompDate_"+index).val().split("-")[2]+'-'+$("#"+formId+" .startCompDate_"+index).val().split("-")[0]+'-'+$("#"+formId+" .startCompDate_"+index).val().split("-")[1];
		if($("#"+formId+" .endCompDate_"+index).val()!=''){
			teacherCompensationDTO['endDate']=$("#"+formId+" .endCompDate_"+index).val().split("-")[2]+'-'+$("#"+formId+" .endCompDate_"+index).val().split("-")[0]+'-'+$("#"+formId+" .endCompDate_"+index).val().split("-")[1];
		}
	}
	teacherCompensationDTO['controlType']=controlType;

	authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = moduleId;
	authentication['userId'] = $("#userId").val();
	request['authentication'] = authentication;
	request['teacherCompensationDTO'] = teacherCompensationDTO;
	return request;
}
function validateRequestForTeacherComp(formId,teacherId,standardId,controlType,index,employeType){

	if(controlType != 'edit'){
		showMessage(true,"Invalid control type.");
		return false;
	}
	if(teacherId==0){
		showMessage(true,"Teacher is required.");
		return false
	}
	if(standardId==0){
		showMessage(true,"Grade is required.");
		return false
	}
	if(employeType=="Full-Time"){
		if($("#"+formId+" #noOfSessionFT_"+index).val()=="" || $("#"+formId+" #noOfSessionFT_"+index).val()=="0"){
			showMessage(true,"Please enter Hours per week.");
			return false
		}
		if($("#"+formId+" #amountInrFT_"+index).val()=="" && $("#"+formId+" #amountUsdFT_"+index).val()==""){
			showMessage(true,"Basic Salary field is mandatory.");
			return false
		}
		if($("#"+formId+" #perclassAmountFT_"+index).val()=="" || $("#"+formId+" #perclassAmountFT_"+index).val()==0){
			showMessage(true,"Per Class Amount in Percentage field is mandatory.");
			return false
		}
		if($("#"+formId+" #perclassAmountFT_"+index).val()!='' && $("#"+formId+" perclassAmountFT_"+index).val()!=undefined && $("#"+formId+" perclassAmountFT_"+index).val()!=0){
			if($("#perclassAmountFT_"+index).val()>100){
				showMessage(true,"Per Class Amount Percentage can not be more than 100.");
				return false;
			}
		}
		if($("#"+formId+" .startCompDateFT_"+index).val()==''){
			showMessage(true,"Start Date is required.");
			return false
		}

		if($("#"+formId+" .endCompDateFT_"+index).val()!=''){
			if($("#"+formId+" .startCompDateFT_"+index).val()>$("#"+formId+" .endCompDateFT_"+index).val()){
				showMessage(true,"End Date must be greater than start date.");
				return false
			}
		}
	}else{
		if($("#"+formId+" #noOfSession_"+index).val()=="" || $("#"+formId+" #noOfSession_"+index).val()=="0"){
		if(employeType=="Full-Time"){
			showMessage(true,"Please enter Hours per week.");
		}else{
			showMessage(true,"Please enter No of session.");
		}
		return false
	}

	if($("#"+formId+" #sessionType_"+index).val()==''){
		showMessage(true,"Session type is required.");
		return false
	}
	if($("#"+formId+" #durationSession_"+index).val()=='0'){
		showMessage(true,"Duration of Complimentary session is required.");
		return false
	}

	if($("#"+formId+" #amountInr_"+index).val()==""){
		showMessage(true,"Amount field is mandatory.");
		return false
	}
	if($("#"+formId+" #amountUsd_"+index).val()==""){
		showMessage(true,"Amount field is mandatory.");
		return false
	}
	if($("#"+formId+" #perclassAmount_"+index).val()=="" || $("#"+formId+" #perclassAmount_"+index).val()==0){
		showMessage(true,"Per Class Amount in Percentage field is mandatory.");
		return false
	}
	if($("#"+formId+" #perclassAmount_"+index).val()!='' && $("#"+formId+" perclassAmount_"+index).val()!=undefined && $("#"+formId+" perclassAmount_"+index).val()!=0){
		if($("#perclassAmount_"+index).val()>100){
			showMessage(true,"Per Class Amount Percentage can not be more than 100.");
			return false;
		}
	}
	if($("#"+formId+" .startCompDate_"+index).val()==''){
		showMessage(true,"Start Date is required.");
		return false
	}

	if($("#"+formId+" .endCompDate_"+index).val()!=''){
		if($("#"+formId+" .startCompDate_"+index).val()>$("#"+formId+" .endCompDate_"+index).val()){
			showMessage(true,"End Date must be greater than start date.");
			return false
		}
	}
	}

	return true;
}


function callAddButton(){
	var status = $('#paySlipStatusBox').val();
	console.log("payslip status ",status);
	if(status != 'Published'){
		$('#cloneRowBtnPartTime').show();
		$('#cloneRowBtnFullTime').show();
		$('#cloneRowBtnBatchPartTime').show();
		$('#cloneRowBtnBatchFullTime').show();
	}else{
		$('#cloneRowBtnPartTime').hide();
		$('#cloneRowBtnFullTime').hide();
		$('#cloneRowBtnBatchPartTime').show();
		$('#cloneRowBtnBatchFullTime').show();
	}
}

function submitTeacherCompensation(formId, moduleId) {
	var teacherId = $("#teacherId").val();
	$("#errorStart").text('');
	$("#errorEnd").text('');
	if($("#startDate").val()==''){
		$("#errorStart").text("Please select start date");
		return false;
	}
	if($("#endDate").val()==''){
		$("#errorEnd").text("Please select end date");
		return false;
	}
	$('#modeOfPayment').val("");
	var strtDT = new Date($("#startDate").val());
	var endDT = new Date($("#endDate").val());
	var startDate = changeDateFormat(strtDT, 'yyyy-mm-dd');
	var endDate = changeDateFormat(endDT, 'yyyy-mm-dd');
	var data = {
		'teacherId' : teacherId,
		'startDate' : startDate,
		'endDate' : endDate,
		'forDownload' : false,
		'moduleId' : moduleId
	}
	var actionUrl='?teacherId='+teacherId+'&startDate='+startDate+'&endDate='+endDate+'&forDownload='+false+'&modeOfPayment='+'&moduleId='+moduleId;
	url = 'getAsPost(\'/dashboard/teacher-monthly-pay-slip-content'+actionUrl+'\')';
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForHTML('dashboard','teacher-compensation-calculation'),
		data : JSON.stringify(data),
		dataType : 'html',
		success : function(htmlContent) {
			if(htmlContent!=""){
            	var stringMessage = [];
            	stringMessage = htmlContent.split("|");
        		if(stringMessage[0] == "FAILED" || stringMessage[0] == "EXCEPTION" || stringMessage[0] == "SESSIONOUT" ){
        			$("#errorCmpile").text(stringMessage[1]);
        		} else {
        			// $("#teacher-compensation").show();
        			$('#teacher-compensation-partime-fulltime-content').html(htmlContent);
        			$("#teacherMonthlyPaySlip").attr("onclick", url);
					$('#teacherMonthlyPaySlip').hide();
        			callAddButton();
        			$('html, body').animate({
						scrollTop: $("#generateRequestForTeacherCompensation").offset().top
					}, 500);
					$("#teacherCalculationPartTime").DataTable({
						fixedHeader: {
				            header: true,
				            footer: true
				        }
					});
					$("#teacherCalculationFullTime").DataTable({
						fixedHeader: {
				            header: true,
				            footer: true
				        }
					});
				}
        		return false;
			}
			return false;
		},
		error : function(e) {
			//showMessage(true, e.responseText);
		}
	});
}

//function teacherMonthlyPaySlipContent(formId, moduleId) {
//	var teacherId = $("#teacherId").val();
//	var startDate = $("#startDate").val().split("-")[2]+'-'+$("#startDate").val().split("-")[0]+'-'+$("#startDate").val().split("-")[1];
//	var endDate = $("#endDate").val().split("-")[2]+'-'+$("#endDate").val().split("-")[0]+'-'+$("#endDate").val().split("-")[1];
//	var actionUrl='?teacherId='+teacherId+'&startDate='+startDate+'&endDate='+endDate;
//	url = CONTEXT_PATH+UNIQUEUUID+"/"+"dashboard/teacher-monthly-pay-slip-content"+actionUrl;
//	goAhead(url, '');
//}

function getPublishMonthlyPaySlip(teacherId,startDate,endDate,publishDate,modeOfPayment){
	var request = {};
	var authentication = {};
	var requestData = {};
	var publishPaySlipDTO = {};
	publishPaySlipDTO['startDate'] =startDate;
	publishPaySlipDTO['endDate'] =endDate;
	publishPaySlipDTO['teacherId'] = teacherId;
	publishPaySlipDTO['publishDate'] = publishDate;
	publishPaySlipDTO['modeOfTransfer'] = modeOfPayment;
	authentication['hash'] = getHash();
	authentication['schoolId'] = SCHOOL_ID;
	authentication['schoolUUID'] = SCHOOL_UUID;
	request['authentication'] = authentication;
	request['publishPaySlipDTO'] = publishPaySlipDTO;
	return request;
}

function publishMonthlyPaySlip(teacherId,startDate,endDate,modeOfPayment){
	if($("#publishDate").val()=='' || $("#publishDate").val()==undefined){
		alert("Please select publish date.");
		return false;
	}
	var publishDate = $("#publishDate").val().split("-")[2]+'-'+$("#publishDate").val().split("-")[0]+'-'+$("#publishDate").val().split("-")[1];
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLFor('/dashboard','publish-teacher-monthly-pay-slip'),
		data : JSON.stringify(getPublishMonthlyPaySlip(teacherId,startDate,endDate,publishDate,modeOfPayment)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				alert(data['message']);
			} else {
				alert(data['message']);
				$('#publishTeacherPaySlipDiv').hide();
			}
			return false;
		},
		error : function(e) {
			//showMessage(true, e.responseText);
			return false;
		}
	});
}
function addPartTimeCompensation(){
	$(".clone-row-wrapper").show();
	var serialNo = $('#teacherCalculationPartTime > tbody > tr').not('.btn-row').length;
	$('.clone-row-part-time tr .serialNumber').html(serialNo)
	var cloneRow = $('.clone-row-part-time').html();
	$('#teacherCalculationPartTime > tbody').find('tr:last').after(cloneRow).promise().done(function(){
		// Set Start Date //
		var selectedStartDate=changeDateFormat(new Date($('#startDate').val()), 'mm-dd-yyyy').split("-");
		var setStartDate = new Date(parseInt(selectedStartDate[2]),parseInt(selectedStartDate[0]-1),parseInt(selectedStartDate[1]));
	    var startDate=new Date(parseInt(selectedStartDate[2]),parseInt(selectedStartDate[0]-1),parseInt(1));
			startDate.setMonth(startDate.getMonth());
			console.log(startDate);
	    var endDate=new Date(parseInt(selectedStartDate[2]),parseInt(selectedStartDate[0]-1),parseInt(1));
			endDate.setMonth(endDate.getMonth()+1);
			endDate.setDate(endDate.getDate()-1);
			console.log(endDate);

		// Set End Date //
		var selectedEndMonthDate=changeDateFormat(new Date($('#endDate').val()), 'mm-dd-yyyy').split("-");
		var endMonth = new Date(parseInt(selectedEndMonthDate[2]),parseInt(selectedEndMonthDate[0]-1),parseInt(selectedEndMonthDate[1]));
	    var endMonthStartDate = new Date(parseInt(selectedEndMonthDate[2]),parseInt(selectedEndMonthDate[0]-1),parseInt(1));
	    endMonth.setMonth(endMonth.getMonth());
		var endMonthEndDate=new Date(parseInt(selectedEndMonthDate[2]),parseInt(selectedEndMonthDate[0]-1),parseInt(1));
			endMonthEndDate.setMonth(endMonthEndDate.getMonth()+1);
			endMonthEndDate.setDate(endMonthEndDate.getDate()-1);


		$(".cloneStartDate").datepicker({
			startDate: startDate,
			endDate: endDate,
			format : 'M dd, yyyy',
		    autoclose: true,
		});
		/* $(".cloneStartDate").datepicker().datepicker("setDate", setStartDate); */
		$(".cloneEndDate").datepicker({
			startDate: endMonthStartDate,
		    endDate: endMonthEndDate,
		    format : 'M dd, yyyy',
		    autoclose: true,
		});
		/* $(".cloneEndDate").datepicker().datepicker("setDate", endMonth); */
	});
}
function addFullTimeCompensation(){
	$(".clone-row-wrapper-full-time").show();
	var serialNo = parseInt($('#teacherCalculationFullTime > tbody > tr').length)+1;
	$('.clone-row-full-time tr .serialNumber').html(serialNo)
	var cloneRow = $('.clone-row-full-time').html();
	$('#teacherCalculationFullTime > tbody').append(cloneRow).promise().done(function(){
		// Set Start Date //
		var selectedStartDate=changeDateFormat(new Date($('#startDate').val()), 'mm-dd-yyyy').split("-");
		var setStartDate = new Date(parseInt(selectedStartDate[2]),parseInt(selectedStartDate[0]-1),parseInt(selectedStartDate[1]));
	    var startDate=new Date(parseInt(selectedStartDate[2]),parseInt(selectedStartDate[0]-1),parseInt(1));
			startDate.setMonth(startDate.getMonth());
			console.log(startDate);
	    var endDate=new Date(parseInt(selectedStartDate[2]),parseInt(selectedStartDate[0]-1),parseInt(1));
			endDate.setMonth(endDate.getMonth()+1);
			endDate.setDate(endDate.getDate()-1);
			console.log(endDate);

		// Set End Date //
		var selectedEndMonthDate=changeDateFormat(new Date($('#endDate').val()), 'mm-dd-yyyy').split("-");
		var endMonth = new Date(parseInt(selectedEndMonthDate[2]),parseInt(selectedEndMonthDate[0]-1),parseInt(selectedEndMonthDate[1]));
	    var endMonthStartDate = new Date(parseInt(selectedEndMonthDate[2]),parseInt(selectedEndMonthDate[0]-1),parseInt(1));
	    endMonth.setMonth(endMonth.getMonth());
		var endMonthEndDate=new Date(parseInt(selectedEndMonthDate[2]),parseInt(selectedEndMonthDate[0]-1),parseInt(1));
			endMonthEndDate.setMonth(endMonthEndDate.getMonth()+1);
			endMonthEndDate.setDate(endMonthEndDate.getDate()-1);


		$(".cloneStartDate").datepicker({
			startDate: startDate,
			endDate: endDate,
			format : 'M dd, yyyy',
		    autoclose: true,
		});
		/* $(".cloneStartDate").datepicker().datepicker("setDate", setStartDate); */
		$(".cloneEndDate").datepicker({
			startDate: endMonthStartDate,
		    endDate: endMonthEndDate,
		    format : 'M dd, yyyy',
		    autoclose: true,
		});
		/* $(".cloneEndDate").datepicker().datepicker("setDate", endMonth); */
	});
}

function addBatchCompensation(employeeType){
	$(".clone-row-wrapper-batch-"+employeeType).show();
	var serialNo = parseInt($('#teacherCalculationBatch'+employeeType+' > tbody > tr').length)+1;
	$('.clone-row-batch-'+employeeType+' tr .serialNumber').html(serialNo)
	var cloneRow = $('.clone-row-batch-'+employeeType).html();
	$('#teacherCalculationBatch'+employeeType+' > tbody').append(cloneRow).promise().done(function(){
		// Set Start Date //
		var selectedStartDate=changeDateFormat(new Date($('#startDate').val()), 'mm-dd-yyyy').split("-");
		var setStartDate = new Date(parseInt(selectedStartDate[2]),parseInt(selectedStartDate[0]-1),parseInt(selectedStartDate[1]));
	    var startDate=new Date(parseInt(selectedStartDate[2]),parseInt(selectedStartDate[0]-1),parseInt(1));
			startDate.setMonth(startDate.getMonth());
			console.log(startDate);
	    var endDate=new Date(parseInt(selectedStartDate[2]),parseInt(selectedStartDate[0]-1),parseInt(1));
			endDate.setMonth(endDate.getMonth()+1);
			endDate.setDate(endDate.getDate()-1);
			console.log(endDate);

		// Set End Date //
		var selectedEndMonthDate=changeDateFormat(new Date($('#endDate').val()), 'mm-dd-yyyy').split("-");
		var endMonth = new Date(parseInt(selectedEndMonthDate[2]),parseInt(selectedEndMonthDate[0]-1),parseInt(selectedEndMonthDate[1]));
	    var endMonthStartDate = new Date(parseInt(selectedEndMonthDate[2]),parseInt(selectedEndMonthDate[0]-1),parseInt(1));
	    endMonth.setMonth(endMonth.getMonth());
		var endMonthEndDate=new Date(parseInt(selectedEndMonthDate[2]),parseInt(selectedEndMonthDate[0]-1),parseInt(1));
			endMonthEndDate.setMonth(endMonthEndDate.getMonth()+1);
			endMonthEndDate.setDate(endMonthEndDate.getDate()-1);


		$(".cloneStartDate").datepicker({
			startDate: startDate,
			endDate: endDate,
			format : 'M dd, yyyy',
		    autoclose: true,
		});
		/* $(".cloneStartDate").datepicker().datepicker("setDate", setStartDate); */
		$(".cloneEndDate").datepicker({
			startDate: endMonthStartDate,
		    endDate: endMonthEndDate,
		    format : 'M dd, yyyy',
		    autoclose: true,
		});
		/* $(".cloneEndDate").datepicker().datepicker("setDate", endMonth); */
	});
}

function changeModeOfPaymentTeacherCompensation(){
	if($('#modeOfPayment').val()==""){
		$("#errorModeOfPayment").text("Please select Mode of Transfer.");
		$('#teacherMonthlyPaySlip').hide();
		return false;
	}
	$('#teacherMonthlyPaySlip').attr('onclick', $('#teacherMonthlyPaySlip').attr('onclick').split('modeOfPayment=')[0]+'modeOfPayment='+$('#modeOfPayment').val()+'\')')
	$('#teacherMonthlyPaySlip').show();
};

function getStudentGradeAndSubjects(src, teacherId, studentId){
	$("#errorAddPayment").text('');
	resetDropdown($(src).parent().parent().find('.studentSubject'), 'Select Course');
	resetDropdown($(src).parent().parent().find('.studentGrade'), 'Grade');
	if(studentId=="" || studentId==undefined){
		return false;
	}
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForCommon('masters'),
		data : JSON.stringify(getRequestForMaster('formId', 'SUBJECT-LIST-BY-STUDENT-TEACHER-ID',teacherId, studentId)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				var result = data['mastersData']['studentSubjectList'];
				var dropdown = $(src).parent().parent().find('.studentSubject');
				var dropdown2 = $(src).parent().parent().find('.studentGrade');
				dropdown.html('');
				dropdown.append('<option value="0">Select Course</option>');
				dropdown2.html('');
				$.each(result, function(k, v) {
					if(v.extra<11){
						dropdown.append('<option value="' + v.key + '">' + v.value +' </option>');
						dropdown.prop('disabled', false)
					}else{
						dropdown.append('<option value="' + v.extra + '">' + v.extra1 +' </option>');
						dropdown.val( v.extra);
						dropdown.prop('disabled', true)
					}
					dropdown2.append('<option value="' + v.extra + '">' + v.extra1 +' </option>');
					dropdown2.prop('disabled', true)
				});

			}
		},
		error : function(e) {
			$("#courseId").prop("disabled", false);
		}
	});
}

function getBatchGradeAndSubjects(src, teacherId, batchId, employeeType){
	$("#errorAddPaymentBatch"+employeeType).text('');
	resetDropdown($(src).parent().parent().find('.studentSubject'), 'Select Course');
	resetDropdown($(src).parent().parent().find('.studentGrade'), 'Grade');
	if(batchId=="" || batchId==undefined){
		return false;
	}
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForCommon('masters'),
		data : JSON.stringify(getRequestForMaster('formId', 'SUBJECT-LIST-BY-BATCH-TEACHER-ID', teacherId, batchId)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				var result = data['mastersData']['studentSubjectList'];
				var dropdown = $(src).parent().parent().find('.studentSubject');
				var dropdown2 = $(src).parent().parent().find('.studentGrade');
				dropdown.html('');
				dropdown.append('<option value="0">Select Course</option>');
				dropdown2.html('');
				$.each(result, function(k, v) {
					if(v.extra<11){
						dropdown.append('<option value="' + v.key + '">' + v.value +' </option>');
						dropdown.prop('disabled', false)
					}else{
						dropdown.append('<option value="' + v.extra + '">' + v.extra1 +' </option>');
						dropdown.val( v.extra);
						dropdown.prop('disabled', true)
					}
					dropdown2.append('<option value="' + v.extra + '">' + v.extra1 +' </option>');
					dropdown2.prop('disabled', true)
				});

			}
		},
		error : function(e) {
			$("#courseId").prop("disabled", false);
		}
	});
}

function saveTeacherLeavesAndDeductionData(tgcId){
$("#errorLeaveAndDeduction").text('');
var data ={
	'tgcId' : tgcId,
	'leavesAvailed' : $('.leavesAvailed').val(),
	'paidLeaves' : $('.paidLeaves').val(),
	'lopDays' : $('.lopDays').val(),
	'deductedAmount' : parseFloat($('.deductedAmount').val()).toFixed(2),
	'deductedAmountOld' : parseFloat($('.deductedAmountOld').val()).toFixed(2)
} 


	$.ajax({
		type : "POST",
		url : getURLForHTML('dashboard','save-deducted-amount-data'),
		contentType : 'application/json',
		data : JSON.stringify(data),
		dataType : 'html',
		cache : false,
		timeout : 600000,
		success : function(htmlContent) {
			if(htmlContent!=""){
            	var stringMessage = [];
            	stringMessage = htmlContent.split("|");
        		if(stringMessage[0] == "FAILED" || stringMessage[0] == "EXCEPTION" || stringMessage[0] == "SESSIONOUT" ){
        			$("#errorLeaveAndDeduction").text(stringMessage[1]);
        		} else {
        			$("#errorLeaveAndDeduction").text(stringMessage[1]);
        			$('.leavesAvailed').val($('.leavesAvailed').val());
        			$('.paidLeaves').val($('.paidLeaves').val());
        			$('.lopDays').val($('.lopDays').val());
        			$('.deductedAmount').val(parseFloat($('.deductedAmount').val()).toFixed(2));
        			if(parseFloat($('.deductedAmountOld').val()).toFixed(2) !=parseFloat($('.deductedAmount').val()).toFixed(2)){
	        			$('#totalPayWithdeduction').text(parseFloat(parseFloat($('#totalPayWithdeduction').text())-parseFloat($('.deductedAmount').val()).toFixed(2)).toFixed(2));
        			}
        			setTimeout(function(){$("#errorLeaveAndDeduction").text('');}, 3000);
        		}
        		return false;
			}
		},
		error : function(e) {
			return false;
		}
	});

}

function saveTeacherAdditionalPaymentData(src, formId,teacherId,controlType, roleModuleId, employementType) {
	$("#errorAddPayment"+employementType).text('');
	$("#errorAddPayment"+employementType).removeClass('text-warning');
	$("#errorAddPayment"+employementType).removeClass('text-danger');
	$("#errorAddPayment"+employementType).removeClass('text-success');
	if(!validateRequestForTeacherAdditionalPayment(src, formId,teacherId,controlType, employementType)){
		return false;
	}

	var sessionCount= 0;
	if($(src).parent().parent().find('.sessionCount').val()!='' && $(src).parent().parent().find('.sessionCount').val() != undefined){
		sessionCount= $(src).parent().parent().find('.sessionCount').val()
	}
	var gradingCount=0;
	if($(src).parent().parent().find('.gradingCount').val()!='' && $(src).parent().parent().find('.gradingCount').val() != undefined){
		gradingCount= $(src).parent().parent().find('.gradingCount').val();
	}

	var studentName = $(src).parent().parent().find('.studentName option:selected').text();
	var studentGrade = $(src).parent().parent().find('.studentGrade option:selected').text();
	var course=  $(src).parent().parent().find('.studentSubject option:selected').text();
	var perClassAmount= $(src).parent().parent().find('.perClassAmount').val();
	var gradingAmount= $(src).parent().parent().find('.gradingAmount').val();
	var elementId = 'teacherCalculationPartTime';
	var serialNo = $('#teacherCalculationPartTime > tbody > tr').not('.btn-row').length;


	var planName= $(src).parent().parent().find('.planName').val();
	var startDate = $(src).parent().parent().find('.cloneStartDate').val() ;
	var endDate = $(src).parent().parent().find('.cloneEndDate').val() ;
	var basicFee= $(src).parent().parent().find('.basicFee').val();

	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForHTML('dashboard','save-teacher-additional-payment'),
		data : JSON.stringify(getRequestForTeacherAdditionalPayment(src, formId, teacherId,controlType, employementType)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				$("#errorAddPayment"+employementType).text(data['message']);
				$("#errorAddPayment"+employementType).addClass('text-danger');
			} else {
				$("#errorAddPayment"+employementType).text(data['message']);
				$("#errorAddPayment"+employementType).addClass('text-success');
				if(employementType=='Part-Time'){
					var partTimeTable = $("#teacherCalculationPartTime").DataTable();
					var tNow = parseInt($("#totalStudent").html())+1;
					partTimeTable.row.add([
							tNow,
							studentName ==='' || studentName ==='Select Student' ? ['N/A'] :[studentName+'<br/>'+studentGrade+'<br/>'+course],
							startDate+'<br/>'+endDate+'<br/>'+planName,
							basicFee,
							sessionCount,
							perClassAmount,
							gradingCount,
							gradingAmount,
							('<div class="d-flex flex-wrap">'+basicFee
									+ '<span data-toggle="tooltip" title="Be sure before deleting the entry!" class="btn btn-sm btn-danger delete-part-time-row ml-auto p-1" style="font-size: 10px" id="deleteAdditionalPayment" onclick="deleteTeacherAdditionalPayment('+data['taplId']+', \'Part-Time\', this,'+basicFee+','+sessionCount+','+gradingCount+',\'teacherCalculationPartTime\')">'
									+ '&#x2715;</span></div>')]).draw(false);

					var isDataTable = $.fn.dataTable.isDataTable('#'+elementId);
					console.log(elementId+ ' = ' +isDataTable);
					if(isDataTable){
						$('#'+elementId).dataTable().fnDestroy();
					}

					var tNow = parseInt($("#totalStudent").html())+1;
					$("#totalStudent").html(tNow);
					var tp = 0;
					if($("#totalPay").html()!=undefined && $("#totalPay").html()!=NaN && $("#totalPay").html()!=''){
						tp=$("#totalPay").html();
					}
					var tPayNow = parseFloat(parseFloat(tp)+parseFloat(basicFee)).toFixed(2);
					$("#totalPay").html(tPayNow);
					var sessionTotalNow = parseInt($("#sessionTotalSpan").html())+parseInt(sessionCount);
					$("#sessionTotalSpan").html(sessionTotalNow);
					var gradingTotalNow = parseInt($("#gradingTotalSpan").html())+parseInt(gradingCount);
					$("#gradingTotalSpan").html(gradingTotalNow);
					var totalAssignmentNow = parseInt($("#totalAssignmentSpan").html())+parseInt(gradingCount);
					$("#totalAssignmentSpan").html(totalAssignmentNow);
					$('#totalPayWithdeduction').text(parseFloat(parseFloat($('#totalPayWithdeduction').text())+parseFloat(basicFee)).toFixed(2));
					/*setTimeout(function(){$("#errorAddPayment").text('');}, 2000);*/
					$(".clone-row-wrapper").hide();
					$('#'+elementId).DataTable();
				}else if(employementType=='Full-Time'){
					var fullTimeTable = $("#teacherCalculationFullTime").DataTable();
					var tNow = parseInt($("#totalStudentFT").html())+1;
					fullTimeTable.row.add([
							tNow,
							studentName ==='' || studentName ==='Select Student' ? ['N/A'] :[studentName+'<br/>'+studentGrade+'<br/>'+course],
							startDate+'<br/>'+endDate+'<br/>'+planName,
							basicFee,
							sessionCount,
							perClassAmount,
							gradingCount,
							gradingAmount,
							('<div class="d-flex flex-wrap">'+basicFee
									+ '<span data-toggle="tooltip" title="Be sure before deleting the entry!" class="btn btn-sm btn-danger ml-auto p-1" style="font-size: 10px" id="deleteAdditionalPayment" onclick="deleteTeacherAdditionalPayment('+data['taplId']+', \'Full-Time\',  this,'+basicFee+','+sessionCount+','+gradingCount+',\'teacherCalculationFullTime\')">'
									+ '&#x2715;</span></div>')]).draw(false);

						$("#totalStudentFT").html(tNow);
						var bs = 0;
						if($("#totalPayFullTimeSpan").html()!='' && $("#totalPayFullTimeSpan").html() != undefined){
							bs = $("#totalPayFullTimeSpan").html();
						}
						var tPayNow = parseFloat(parseFloat(bs)+parseFloat(basicFee)).toFixed(2);
						$("#totalPayFullTimeSpan").text(tPayNow);
						var sessionTotalNow = parseInt($("#sessionTotalSpanFT").html())+parseInt(sessionCount);
						$("#sessionTotalSpanFT").html(sessionTotalNow);
						var gradingTotalNow = parseInt($("#gradingTotalSpanFT").html())+parseInt(gradingCount);
						$("#gradingTotalSpanFT").html(gradingTotalNow);
						var totalAssignmentNow = parseInt($("#totalAssignmentSpanFT").html())+parseInt(gradingCount);
						$("#totalAssignmentSpanFT").html(totalAssignmentNow);
						$('#totalPayWithdeduction').text(parseFloat(parseFloat($('#totalPayWithdeduction').text())+parseFloat(basicFee)).toFixed(2));
						$('#teacherCalculationFullTime tbody .clone-row-wrapper-full-time').remove();
						//$(".clone-row-wrapper-full-time").hide();
				}else if(employementType=='Batch-Part-Time'){
					var batchPartTimeTable = $("#teacherCalculationBatchPartTime").DataTable();
					var tNow = parseInt($("#totalStudentBPT").html())+1;
					batchPartTimeTable.row.add([
							tNow,
							studentName ==='' || studentName ==='Select Batch' ? ['N/A'] :[studentName+'<br/>'+studentGrade+'<br/>'+course],
							startDate+'<br/>'+endDate+'<br/>'+planName,
							basicFee,
							sessionCount,
							perClassAmount,
							gradingCount,
							gradingAmount,
							('<div class="d-flex flex-wrap">'+basicFee
									+ '<span data-toggle="tooltip" title="Be sure before deleting the entry!" class="btn btn-sm btn-danger delete-part-time-row ml-auto p-1" style="font-size: 10px" id="deleteAdditionalPayment" onclick="deleteTeacherAdditionalPayment('+data['taplId']+', \'Batch-Part-Time\', this,'+basicFee+','+sessionCount+','+gradingCount+',\'teacherCalculationBatchPartTime\')">'
									+ '&#x2715;</span></div>')]).draw(false);

					var isDataTable = $.fn.dataTable.isDataTable('#'+elementId);
					console.log(elementId+ ' = ' +isDataTable);
					if(isDataTable){
						$('#'+elementId).dataTable().fnDestroy();
					}

					var tNow = parseInt($("#totalStudentBPT").html())+1;
					$("#totalStudentBPT").html(tNow);
					var tp = 0;
					if($("#totalPayBPT").html()!=undefined && $("#totalPayBPT").html()!=NaN && $("#totalPayBPT").html()!=''){
						tp=$("#totalPay").html();
					}
					var tPayNow = parseFloat(parseFloat(tp)+parseFloat(basicFee)).toFixed(2);
					$("#totalPayBPT").html(tPayNow);
					var sessionTotalNow = parseInt($("#sessionTotalSpan").html())+parseInt(sessionCount);
					$("#sessionTotalSpanBPT").html(sessionTotalNow);
					var gradingTotalNow = parseInt($("#gradingTotalSpan").html())+parseInt(gradingCount);
					$("#gradingTotalSpanBPT").html(gradingTotalNow);
					var totalAssignmentNow = parseInt($("#totalAssignmentSpan").html())+parseInt(gradingCount);
					$("#totalAssignmentSpanBPT").html(totalAssignmentNow);
					$('#totalPayWithdeduction').text(parseFloat(parseFloat($('#totalPayWithdeduction').text())+parseFloat(basicFee)).toFixed(2));
					/*setTimeout(function(){$("#errorAddPayment").text('');}, 2000);*/
					$(".clone-row-wrapper-batch-PartTime").hide();
					$('#'+elementId).DataTable();
				}else if(employementType=='Batch-Full-Time'){
					var batchFullTimeTable = $("#teacherCalculationBatchFullTime").DataTable();
					var tNow = parseInt($("#totalStudentBFT").html())+1;
					batchFullTimeTable.row.add([
							tNow,
							studentName ==='' || studentName ==='Select Batch' ? ['N/A'] :[studentName+'<br/>'+studentGrade+'<br/>'+course],
							startDate+'<br/>'+endDate+'<br/>'+planName,
							basicFee,
							sessionCount,
							perClassAmount,
							gradingCount,
							gradingAmount,
							('<div class="d-flex flex-wrap">'+basicFee
									+ '<span data-toggle="tooltip" title="Be sure before deleting the entry!" class="btn btn-sm btn-danger ml-auto p-1" style="font-size: 10px" id="deleteAdditionalPayment" onclick="deleteTeacherAdditionalPayment('+data['taplId']+', \'Batch-Full-Time\', this,'+basicFee+','+sessionCount+','+gradingCount+',\'teacherCalculationBatchFullTime\')">'
									+ '&#x2715;</span></div>')]).draw(false);

						$("#totalStudentBFT").html(tNow);
						var bs = 0;
						if($("#totalPayBatchFullTimeSpan").html()!='' && $("#totalPayBatchFullTimeSpan").html() != undefined){
							bs = $("#totalPayBatchFullTimeSpan").html();
						}
						var tPayNow = parseFloat(parseFloat(bs)+parseFloat(basicFee)).toFixed(2);
						$("#totalPayBatchFullTimeSpan").text(tPayNow);
						var sessionTotalNow = parseInt($("#sessionTotalSpan").html())+parseInt(sessionCount);
						$("#sessionTotalSpanBFT").html(sessionTotalNow);
						var gradingTotalNow = parseInt($("#gradingTotalSpan").html())+parseInt(gradingCount);
						$("#gradingTotalSpanBFT").html(gradingTotalNow);
						var totalAssignmentNow = parseInt($("#totalAssignmentSpan").html())+parseInt(gradingCount);
						$("#totalAssignmentSpanBFT").html(totalAssignmentNow);
						$('#totalPayWithdeduction').text(parseFloat(parseFloat($('#totalPayWithdeduction').text())+parseFloat(basicFee)).toFixed(2));
						$('#teacherCalculationBatchFullTime tbody .clone-row-wrapper-batch-FullTime').remove();
						//$(".clone-row-wrapper-full-time").hide();
				}
			}
			return false;
		},
		error : function(e) {
			return false;
		}
	});
}

function calculateBasicFee(src){
	var perClassAmount=$(src).parent().parent().find('.perClassAmount').val();
	var gradingAmount = $(src).parent().parent().find('.gradingAmount').val();
	if(perClassAmount=='' || perClassAmount==undefined){
	perClassAmount=0;
	}
	if(gradingAmount=='' || gradingAmount==undefined){
	gradingAmount=0;
	}
	BasicFe = parseFloat(parseFloat(perClassAmount) + parseFloat(gradingAmount)).toFixed(2);
	$(src).parent().parent().find('.basicFee').val(BasicFe);
}

function getRequestForTeacherAdditionalPayment(src, formId,teacherId,controlType, employementType){

	console.log('getRequestForTeacherAdditionalPayment');
	var request = {};
	var authentication = {};
	var teacherCompensationDTO = {};
	teacherCompensationDTO['schoolId']=$("#"+formId+" #schoolId").val();
	teacherCompensationDTO['teacherId']=teacherId;
	var standardId =$(src).parent().parent().find('.studentGrade').val();
	var studentId =$(src).parent().parent().find('.studentName').val();
	var studentSubjectId=$(src).parent().parent().find('.studentSubject').val();
	teacherCompensationDTO['employementType']= employementType;
	teacherCompensationDTO['standardId']= standardId;
	teacherCompensationDTO['studentId']=studentId;
	teacherCompensationDTO['subjectId']=studentSubjectId;
	if(employementType=='Part-Time'){
		if((standardId==undefined || standardId=="") && (studentId==undefined ||studentId=="") &&(studentSubjectId ==undefined || studentSubjectId =="")){
			teacherCompensationDTO['employementType']="Part-Time-Without-Student-Details";
		}
	}else if(employementType=='Full-Time'){
		if((standardId==undefined || standardId=="") && (studentId==undefined ||studentId=="") &&(studentSubjectId ==undefined || studentSubjectId =="")){
			teacherCompensationDTO['employementType']="Full-Time-Without-Student-Details";
		}
	}


	teacherCompensationDTO['planId']=$(src).parent().parent().find('.planName').val();
	teacherCompensationDTO['sessionCount']=$(src).parent().parent().find('.sessionCount').val();
	teacherCompensationDTO['gradingCount']=$(src).parent().parent().find('.gradingCount').val();
	teacherCompensationDTO['basicAmountPerClass']=$(src).parent().parent().find('.perClassAmount').val();
	teacherCompensationDTO['basicAmountGrading']=$(src).parent().parent().find('.gradingAmount').val();
	teacherCompensationDTO['finalAmount']=$(src).parent().parent().find('.basicFee').val();
	var sd = $(src).parent().parent().find('.cloneStartDate').val();

	var startDate = changeDateFormat(new Date(sd), 'yyyy-mm-dd');
	teacherCompensationDTO['startDate']=startDate;

	var ed = $(src).parent().parent().find('.cloneEndDate').val();
	var endDate = changeDateFormat(new Date(ed), 'yyyy-mm-dd');
	teacherCompensationDTO['endDate']=endDate;

	teacherCompensationDTO['controlType']=controlType;

	authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
	request['authentication'] = authentication;
	request['teacherCompensationDTO'] = teacherCompensationDTO;
	return request;
}
//
//resetDropdown($(src).parent().parent().find('.studentSubject'), 'Select Subject');
//resetDropdown($(src).parent().parent().find('.studentGrade'), 'Grade');

function validateRequestForTeacherAdditionalPayment(src, formId,teacherId,controlType, employementType){
	$("#errorAddPayment"+employementType).text('');
	if(teacherId==0){
		$("#errorAddPayment"+employementType).text("Teacher is required.");
		return false
	}
//	if(employementType=='Part-Time'){
//
//		if($(src).parent().parent().find('.studentName')==null || $(src).parent().parent().find('.studentName')==''){
//			$("#errorAddPayment").text("Please select student.");
//			return false
//		}
//		if($(src).parent().parent().find('.studentGrade')==null || $(src).parent().parent().find('.studentGrade')==''){
//			$("#errorAddPayment").text("Please select Grade.");
//			return false
//		}
//		if($(src).parent().parent().find('.studentSubject')==null || $(src).parent().parent().find('.studentSubject')==''){
//			$("#errorAddPayment").text("Please select subject.");
//			return false
//		}
//	}
	if($(src).parent().parent().find('.planName').val().trim()=='') {
		$("#errorAddPayment"+employementType).text("Remarks is required.");
		$("#errorAddPayment"+employementType).addClass('text-danger');
		return false
	}
	if($(src).parent().parent().find('.cloneStartDate').val().trim()=='') {
		$("#errorAddPayment"+employementType).addClass('text-danger');
		$("#errorAddPayment"+employementType).text("Start Date is required.");
		return false
	}
	if($(src).parent().parent().find('.cloneEndDate').val().trim()=='') {
		$("#errorAddPayment"+employementType).addClass('text-danger');
		$("#errorAddPayment"+employementType).text("End Date is required.");
		return false
	}
	if($(src).parent().parent().find('.basicFee').val().trim()=='') {
		$("#errorAddPayment"+employementType).addClass('text-danger');
		$("#errorAddPayment"+employementType).text("Basic fee is mandatory.");
		return false
	}
	return true;
}


function deleteTeacherAdditionalPayment(taplId, compensationType, src, basicFee,sessionCount,gradingCount, tableID){

	$("#errorAddPayment"+compensationType).text('');
	var data ={
		'taplId':taplId,
		'compensationType' : compensationType
	}
	$.ajax({
		type : "POST",
		contentType : 'application/json',
		url : getURLForHTML('dashboard','delete-teacher-additional-payment'),
		data : JSON.stringify(data),
		dataType : 'html',
		cache : false,
		timeout : 600000,
		success : function(htmlContent) {
			if(htmlContent!=""){
            	var stringMessage = [];
            	stringMessage = htmlContent.split("|");
        		if(stringMessage[0] == "FAILED" || stringMessage[0] == "EXCEPTION" || stringMessage[0] == "SESSIONOUT" ){
        			$("#errorAddPayment"+compensationType).text(stringMessage[1]);
        		} else {
        			$("#errorAddPayment"+compensationType).text(stringMessage[1]);
        			if(compensationType=='Full-Time'){
						var tNow = parseInt($("#totalStudentFT").html())-1;
						$("#totalStudentFT").html(tNow);
        				if($("#totalPayFullTimeSpan").html()!='' && $("#totalPayFullTimeSpan").html() !=undefined && $("#totalPayFullTimeSpan").html()!=NaN){
        					bs= parseFloat($("#totalPayFullTimeSpan").html());
        				}
				        var tPayNow = parseFloat(parseFloat(bs)-parseFloat(basicFee)).toFixed(2);
						$("#totalPayFullTimeSpan").html(tPayNow);
						var sessionTotalNow = parseInt($("#sessionTotalSpanFT").html())-parseInt(sessionCount);
						$("#sessionTotalSpanFT").html(sessionTotalNow);
						var gradingTotalNow = parseInt($("#gradingTotalSpanFT").html())-parseInt(gradingCount);
						$("#gradingTotalSpanFT").html(gradingTotalNow);
						var totalAssignmentNow = parseInt($("#totalAssignmentSpanFT").html())-parseInt(gradingCount);
						$("#totalAssignmentSpanFT").html(totalAssignmentNow);
						$('#totalPayWithdeduction').text(parseFloat(parseFloat($('#totalPayWithdeduction').text())-parseFloat(basicFee)).toFixed(2));
      				 }else if(compensationType=='Part-Time'){
						var tNow = parseInt($("#totalStudent").html())-1;
						$("#totalStudent").html(tNow);
						var tPayNow = parseFloat(parseFloat($("#totalPay").html())-parseFloat(basicFee)).toFixed(2);
						$("#totalPay").html(tPayNow);
						var sessionTotalNow = parseInt($("#sessionTotalSpan").html())-parseInt(sessionCount);
						$("#sessionTotalSpan").html(sessionTotalNow);
						var gradingTotalNow = parseInt($("#gradingTotalSpan").html())-parseInt(gradingCount);
						$("#gradingTotalSpan").html(gradingTotalNow);
						var totalAssignmentNow = parseInt($("#totalAssignmentSpan").html())-parseInt(gradingCount);
						$("#totalAssignmentSpan").html(totalAssignmentNow);
						$('#totalPayWithdeduction').text(parseFloat(parseFloat($('#totalPayWithdeduction').text())-parseFloat(basicFee)).toFixed(2));

     				 }else if(compensationType=='Batch-Full-Time'){
						var tNow = parseInt($("#totalStudentBFT").html())-1;
						$("#totalStudentBFT").html(tNow);
        				if($("#totalPayBatchFullTimeSpan").html()!='' && $("#totalPayBatchFullTimeSpan").html() !=undefined && $("#totalPayBatchFullTimeSpan").html()!=NaN){
        					bs= parseFloat($("#totalPayBatchFullTimeSpan").html());
        				}
				        var tPayNow = parseFloat(parseFloat(bs)-parseFloat(basicFee)).toFixed(2);
						$("#totalPayBatchFullTimeSpan").html(tPayNow);
						var sessionTotalNow = parseInt($("#sessionTotalSpanBFT").html())-parseInt(sessionCount);
						$("#sessionTotalSpanBFT").html(sessionTotalNow);
						var gradingTotalNow = parseInt($("#gradingTotalSpanBFT").html())-parseInt(gradingCount);
						$("#gradingTotalSpanBFT").html(gradingTotalNow);
						var totalAssignmentNow = parseInt($("#totalAssignmentSpanBFT").html())-parseInt(gradingCount);
						$("#totalAssignmentSpanBFT").html(totalAssignmentNow);
						$('#totalPayWithdeduction').text(parseFloat(parseFloat($('#totalPayWithdeduction').text())-parseFloat(basicFee)).toFixed(2));
      				 }else if(compensationType=='Batch-Part-Time'){
						var tNow = parseInt($("#totalStudentBPT").html())-1;
						$("#totalStudentBPT").html(tNow);
						var tPayNow = parseFloat(parseFloat($("#totalPayBPT").html())-parseFloat(basicFee)).toFixed(2);
						$("#totalPayBPT").html(tPayNow);
						var sessionTotalNow = parseInt($("#sessionTotalSpanBPT").html())-parseInt(sessionCount);
						$("#sessionTotalSpanBPT").html(sessionTotalNow);
						var gradingTotalNow = parseInt($("#gradingTotalSpanBPT").html())-parseInt(gradingCount);
						$("#gradingTotalSpanBPT").html(gradingTotalNow);
						var totalAssignmentNow = parseInt($("#totalAssignmentSpanBPT").html())-parseInt(gradingCount);
						$("#totalAssignmentSpanBPT").html(totalAssignmentNow);
						$('#totalPayWithdeduction').text(parseFloat(parseFloat($('#totalPayWithdeduction').text())-parseFloat(basicFee)).toFixed(2));

     				 }


     				 $("#"+tableID).dataTable().fnDestroy();
     				 var table = $('#'+tableID).DataTable();
     				 table.row($(src).closest('tr')).remove().draw(false);
     				 $.each($('#'+tableID+' tbody tr td:first-child'),function(index){
      					$(this).html(index+1);

   					 });
    				table.rows().invalidate();
					setTimeout(function(){$("#errorAddPayment"+compensationType).text('');}, 3000);
        		}
        		return false;
			}
		},
		error : function(e) {
			return false;
		}
	});
}


function calculatePercentageOfBasicSalary(data, index, callFrom){
	if($("#perclassAmount_"+index).val()!='' && $("#perclassAmount_"+index).val()!=undefined && $("#perclassAmount_"+index).val()!=0){
		if($("#perclassAmount_"+index).val()>100){
			$("#perclassAmount_"+index).val('0');
			showMessage(true,"Per Class Amount Percentage can not be more than 100.");
			return false;
		}
	}
	var basicFee = 0;
	var session =0;
	if($("#noOfSession_"+index).val()!='' && $("#noOfSession_"+index).val()!=undefined){
		session=$("#noOfSession_"+index).val();
	}
	if(callFrom == 'BASIC_CAL' ){
		if($("#amountInr_"+index).val()!='' && $("#amountInr_"+index).val()!=undefined){
					basicFee=$("#amountInr_"+index).val();
		}else{
			if($("#amountUsd_"+index).val()!='' && $("#amountUsd_"+index).val()!=undefined){
				basicFee=$("#amountUsd_"+index).val();
			}
		}

		$("#amountCalculated_"+index).val(parseFloat(parseFloat(basicFee)/parseFloat(session)).toFixed(2));
		basicFee = $("#amountCalculated_"+index).val();
		if($("#perclassAmount_"+index).val()!='' && $("#perclassAmount_"+index).val()!=undefined && $("#perclassAmount_"+index).val()!=0){
				data = $("#perclassAmount_"+index).val();
				$("#gradingAmount_"+index).val(100-data);
				var per = parseFloat(basicFee* data/100).toFixed(2);
				var grad =parseFloat(basicFee* (100-data)/100).toFixed(2);
				$("#perClassAmountCalculated_"+index).val(per);
				$("#totalGradingCalculated_"+index).val(grad);
		}

	}
	if(callFrom == 'BASIC'){

		if(data!='' && data!=undefined && data!=null){
			if($("#amountInr_"+index).val()!='' && $("#amountInr_"+index).val()!=undefined){
					basicFee=$("#amountInr_"+index).val();
				}else{
					if($("#amountUsd_"+index).val()!='' && $("#amountUsd_"+index).val()!=undefined){
						basicFee=$("#amountUsd_"+index).val();
					}
				}
				if(callFrom == 'BASIC'){
					$("#amountCalculated_"+index).val(parseFloat(parseFloat(basicFee)/parseFloat(session)).toFixed(2));
				}else{
					$("#amountCalculated_"+index).val(parseFloat(parseFloat(basicFee)/(parseFloat(session)*4)).toFixed(2));
				}
				basicFee = $("#amountCalculated_"+index).val();
			if($("#perclassAmount_"+index).val()!='' && $("#perclassAmount_"+index).val()!=undefined && $("#perclassAmount_"+index).val()!=0){
				data = $("#perclassAmount_"+index).val();
				$("#gradingAmount_"+index).val(100-data);
				var per = parseFloat(basicFee* data/100).toFixed(2);
				var grad =parseFloat(basicFee* (100-data)/100).toFixed(2);
				$("#perClassAmountCalculated_"+index).val(per);
				$("#totalGradingCalculated_"+index).val(grad);
			}

		}

	}else{
		if(data!='' && data!=undefined && data!=null && callFrom != 'BASIC_CAL'){
			$("#gradingAmount_"+index).val(100-data);
			basicFee=$("#amountCalculated_"+index).val();
			var per = parseFloat(basicFee* data/100).toFixed(2);
			var grad =parseFloat(basicFee* (100-data)/100).toFixed(2);
			$("#perClassAmountCalculated_"+index).val(per);
			$("#totalGradingCalculated_"+index).val(grad);
		}
	}
}

function calculatePercentageOfBasicSalaryFT(data, index, callFrom){
	if($("#perclassAmountFT_"+index).val()!='' && $("#perclassAmountFT_"+index).val()!=undefined && $("#perclassAmountFT_"+index).val()!=0){
		if($("#perclassAmountFT_"+index).val()>100){
			$("#perclassAmountFT_"+index).val('0');
			showMessage(true,"Per Class Amount Percentage can not be more than 100.");
			return false;
		}
	}
	var basicFee = 0;
	var session =0;
	if($("#noOfSessionFT_"+index).val()!='' && $("#noOfSessionFT_"+index).val()!=undefined){
		session=$("#noOfSessionFT_"+index).val();
	}
	if(callFrom == 'BASIC_CAL_FT'){
		if($("#amountInrFT_"+index).val()!='' && $("#amountInrFT_"+index).val()!=undefined){
					basicFee=$("#amountInrFT_"+index).val();
		}else{
			if($("#amountUsdFT_"+index).val()!='' && $("#amountUsdFT_"+index).val()!=undefined){
				basicFee=$("#amountUsdFT_"+index).val();
			}
		}

		$("#amountCalculatedFT_"+index).val(parseFloat(parseFloat(parseFloat(basicFee)*12)/(parseFloat(session)*52)).toFixed(2));

		basicFee = $("#amountCalculatedFT_"+index).val();
		if($("#perclassAmountFT_"+index).val()!='' && $("#perclassAmountFT_"+index).val()!=undefined && $("#perclassAmountFT_"+index).val()!=0){
				data = $("#perclassAmountFT_"+index).val();
				$("#gradingAmountFT_"+index).val(100-data);
				var per = parseFloat(basicFee* data/100).toFixed(2);
				var grad =parseFloat(basicFee* (100-data)/100).toFixed(2);
				$("#perClassAmountCalculatedFT_"+index).val(per);
				$("#totalGradingCalculatedFT_"+index).val(grad);
		}

	}
	if(callFrom == 'BASIC_FT'){

		if(data!='' && data!=undefined && data!=null){
			if($("#amountInrFT_"+index).val()!='' && $("#amountInrFT_"+index).val()!=undefined){
					basicFee=$("#amountInrFT_"+index).val();
				}else{
					if($("#amountUsdFT_"+index).val()!='' && $("#amountUsdFT_"+index).val()!=undefined){
						basicFee=$("#amountUsdFT_"+index).val();
					}
				}

				$("#amountCalculatedFT_"+index).val(parseFloat(parseFloat(parseFloat(basicFee)*12)/(parseFloat(session)*52)).toFixed(2));

				basicFee = $("#amountCalculatedFT_"+index).val();
			if($("#perclassAmountFT_"+index).val()!='' && $("#perclassAmountFT_"+index).val()!=undefined && $("#perclassAmountFT_"+index).val()!=0){
				data = $("#perclassAmountFT_"+index).val();
				$("#gradingAmountFT_"+index).val(100-data);
				var per = parseFloat(basicFee* data/100).toFixed(2);
				var grad =parseFloat(basicFee* (100-data)/100).toFixed(2);
				$("#perClassAmountCalculatedFT_"+index).val(per);
				$("#totalGradingCalculatedFT_"+index).val(grad);
			}

		}

	}else{
		if(data!='' && data!=undefined && data!=null && callFrom != 'BASIC_CAL_FT'){
			$("#gradingAmountFT_"+index).val(100-data);
			basicFee=$("#amountCalculatedFT_"+index).val();
			var per = parseFloat(basicFee* data/100).toFixed(2);
			var grad =parseFloat(basicFee* (100-data)/100).toFixed(2);
			$("#perClassAmountCalculatedFT_"+index).val(per);
			$("#totalGradingCalculatedFT_"+index).val(grad);
		}
	}
}

function showSetTeacherCompensationContent(elementId, argument) {
	var table = $('#' + elementId).DataTable(
			{
				"processing" : true,
				"serverSide" : true,
				"searching" : true,
				"pageLength" : 10,
				"pagingType":"full",
				"ajax" : {
					"url" : CONTEXT_PATH +UNIQUEUUID+"/"+ "dashboard/set-teacher-compenstaion-table-content-1"+ argument,
					"data" : function(data) {
						console.log('data ' + JSON.stringify(data));
					}
				},
				"fnRowCallback" : function(nRow, aData, iDisplayIndex,
						iDisplayIndexFull) {
				},
				"columns" : [ {
					"data" : "sno",
					"name" : "sno",
					"title" : "S.No"
				},
				{
					"data" : "userName",
					"name" : "userName",
					"title" : "User Name"
				},
				{
					"data" : "message",
					"name" : "message",
					"title" : "Maintenance Message"
				},
				{
					"data" : "marquee",
					"name" : "marquee",
					"title" : "Marquee"
				},
				{
					"data" : "mail",
					"name" : "mail",
					"title" : "Mail"
				},
				{
					"data" : "createdDate",
					"name" : "createdDate",
					"title" : "Created Date"
				},
				{
					"data" : "action",
					"name" : "action",
					"title" : "Action"
				}
				]
			});
	$('#' + elementId).on('page.dt',function(){
		table.responsive.recalc();
	})
	$('#' + elementId).dataTable().fnSetFilteringEnterPress();
}



function callShowSessionByStudent(userId, stuUserId, startDate, endDate, schoolPersonId, subjectId, callFrom) {
	hideMessage('');
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForHTML('dashboard','show-session-class-by-student'),
		data : JSON.stringify(getRequestForStudentSessionByStudent(userId, stuUserId, startDate, endDate, schoolPersonId, subjectId,callFrom)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				//console.log(data['meetingList']);
				var htmlv ="";
				if(data['meetingList']!=null){
					var meetingList = data['meetingList'];
					console.log(meetingList);
					for(var i=0; i<meetingList.length;i++){
						var startTime = meetingList[i]['startTime']!=null?meetingList[i]['startTime']:'N/A';
						var attendanceDuration = meetingList[i]['attendanceDuration']!=null?meetingList[i]['attendanceDuration']:'N/A';
						htmlv = htmlv + " <tr>";
						htmlv = htmlv + " <td>"+meetingList[i]['schoolPersonName']+"</td>";
						htmlv = htmlv + " <td>"+meetingList[i]['name']+"</td>";
						htmlv = htmlv + " <td>"+meetingList[i]['subjectName']+"</td>";
						htmlv = htmlv + " <td>"+meetingList[i]['meetingJoinDate']+"</td>";
						htmlv = htmlv + " <td>"+startTime+"</td>";
						htmlv = htmlv + " <td>"+attendanceDuration+"</td>";
						htmlv = htmlv + " </tr>";
					}
					$("#sessionComplete").html(htmlv);
				}
				//showMessage(false, data['message']);
				$("#openShowSessionClass").modal('show');
			}
		},
		error : function(e) {
			console.log(e)
			return false;
		}
	});
}

function getRequestForStudentSessionByStudent(userId, stuUserId, startDate, endDate, schoolPersonId, subjectId, callFrom){
	var request = {};
	var authentication = {};
	var requestData = {};
	var meetingSlotDTO = {};

	meetingSlotDTO['meetingPersoneId'] = stuUserId;
	meetingSlotDTO['schoolPersonId'] = schoolPersonId;
	meetingSlotDTO['subjectId'] = subjectId;
	meetingSlotDTO['startDate'] = startDate;
	meetingSlotDTO['endDate'] = endDate;
	meetingSlotDTO['controllType'] =callFrom;

	requestData['meetingSlotDTO'] = meetingSlotDTO;
	authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userId'] = userId;
	request['authentication'] = authentication;
	request['requestData'] = requestData;
	return request;
}

function getAttendanceByTeacher(meetingType,attendanceCompiled,officialEmail, meetingVendor){
var url = "";
	if(meetingVendor=="TEAM"){
		url = 'api-team-meeting-attendess?attendanceType='+meetingType+'&attendanceCompiled='+attendanceCompiled+'&officialEmail='+officialEmail;
	}else if(meetingVendor=="ZOOM"){
		url = 'api-zoom-meeting-attendess?officialEmail='+officialEmail+'&meetingLinkId=&meetingfromDate=&meetingtoDate=';
	}
	$("#errorCmpile").text("");
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForattendance('crons',url),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(false, data['message']);
				$("#errorCmpile").text("Error while fetching attendance").removeClass("text-success").addClass("text-danger");
			} else {
				showMessage(true, data['message']);
				$("#errorCmpile").text("Class attendance fetched successfully").removeClass("text-danger").addClass("text-success");;
			}
			return false;
		},
		error : function(e) {
			//showMessage(true, e.responseText);
			return false;
		}
	});
}

function getStudentLmsGrade(userid,startdate,enddate, newTheme) {
	customLoader(false);
	$(".ball-clip-rotate").removeClass('loader-hide');
	if(newTheme){
		hideMessageTheme2('');
	}
	
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForHTML('dashboard','get-total-grading?euid='+userid+'&startDateFilter='+startdate+'&endDateFilter='+enddate),
		dataType : 'JSON',
		success : function(data) {
			customLoader(false);
			$(".ball-clip-rotate").addClass('loader-hide');
			//showMessageTheme2(0, data['message'],'',true);
			$('#plstudent').text(data['plsubmiteAssign'])
			$('#glstudent').text(data['glsubmiteAssign'])

			$('#plcomplete').text(data['plgradingAssign']);
			$('#glcomplete').text(data['glgradingAssign']);
			var plPendingstudent = parseInt(data['plsubmiteAssign'])-parseInt(data['plgradingAssign']);
			$('#plpending').text(plPendingstudent);
			var glPendingstudent = parseInt(data['glsubmiteAssign'])-parseInt(data['glgradingAssign']);
			$('#glpending').text(glPendingstudent);
		}
	});
}

function callZoomRecording(formId, meetingid, reportId, meetingtype) {
    //console.log("callSchoolCalendar", userId);
	var urlparam = '?meetingid='+meetingid+'&reportId='+reportId+'&meetingtype='+meetingtype
    $.ajax({
            type : "GET",
            contentType : "application/json",
            url : getURLForattendance('crons', 'zoom-meeting-recording'+urlparam),
            //data : JSON.stringify(getRequestForzoomRecording(formId, userId,startdate, enddate)),
            dataType : 'json',
            cache : false,
            timeout : 600000,
            async : false,
            success : function(data) {
				if (data['status'] == '0' || data['status'] == '2') {
                    showMessage(true, data['message']);
                } else {
                }
            },
                error : function(e) {
                    console.log(e);
                }
            });
}

function editAttendance(attendanceid, attendminuts, remark, calltype, startdate, callFrom) {
	customLoader(true);
	if(tt=='theme1'){
		hideMessage('');
	}else{
		hideMessageTheme2('');
	}
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForHTML('report','edit-attendance-zoom'),
		dataType : 'JSON',
		data : JSON.stringify(getSaveAttendanceRequest(attendanceid, attendminuts, remark, calltype)),
		success : function(data) {
			customLoader(false);
			if (data['statusCode'] == '0' || data['statusCode'] == '2') {
				if(tt=='theme1'){
					showMessage(false, data['message']);
				}else{
					showMessageTheme2(0, data['message'],'',true);
				}
			}else{
				if(tt=='theme1'){
					showMessage(false, data['message']);
				}else{
					showMessageTheme2(1, data['message'],'',true);
				}
				if(callFrom!='classreview'){
					$("#addattenanceform")[0].reset();
					$("#addmoreAttendance").modal('hide');
					if(USER_ROLE=='TEACHER'){
						callTeacherAttendance('','myAttendanceReport',''+startdate+'','Month', ''+USER_ID+'');
					}else{
						//location.reload(true);
					}
				}
			}
			return false;
		}
	});
	
	return false;
}

function getSaveAttendanceRequest(attendanceid, attendminuts,remark,  calltype){
	if(calltype=='save'){
		if($('#atttimeHrsFrom').val()=='' || $('#atttimeHrsFrom').val()==undefined){
			if(tt=='theme1'){
				showMessage(true, "Please select start hours");
			}else{
				showMessageTheme2(0, "Please select start hours",'',true);
			}
			return false;
		}
		if($('#atttimeMinFrom').val()=='' || $('#atttimeMinFrom').val()==undefined){
			if(tt=='theme1'){
				showMessage(true, "Please select start minutes");
			}else{
				showMessageTheme2(0, "Please select start minutes",'',true);
			}
			return false;
		}
		if($('#atttimeSecFrom').val()=='' || $('#atttimeSecFrom').val()==undefined){
			if(tt=='theme1'){
				showMessage(true, "Please select start second");
			}else{
				showMessageTheme2(0, "Please select start second",'',true);
			}
			return false;
		}
		
		if($('#atttimeHrsTo').val()=='' || $('#atttimeHrsTo').val()==undefined){
			if(tt=='theme1'){
				showMessage(true, "Please select end hours");
			}else{
				showMessageTheme2(0, "Please select end hours",'',true);
			}
			return false;
		}
		if($('#atttimeMinTo').val()=='' || $('#atttimeMinTo').val()==undefined){
			if(tt=='theme1'){
				showMessage(true, "Please select end minutes");
			}else{
				showMessageTheme2(0, "Please select end minutes",'',true);
			}
			return false;
		}
		if($('#atttimeSecTo').val()=='' || $('#atttimeSecTo').val()==undefined){
			if(tt=='theme1'){
				showMessage(true, "Please select start second");
			}else{
				showMessageTheme2(0, "Please select start second",'',true);
			}
			return false;
		}
		if($('#attmeetingtopic').val()=='' || $('#attmeetingtopic').val()==undefined){
			if(tt=='theme1'){
				showMessage(true, "Please fill meeting topic");
			}else{
				showMessageTheme2(0, "Please fill meeting topic",'',true);
			}
			return false;
		}
		if($('#attremark').val()=='' || $('#attremark').val()==undefined){
			if(tt=='theme1'){
				showMessage(true, "Please fill remark");
			}else{
				showMessageTheme2(0, "Please fill remark",'',true);
			}
			return false;
		}
		// if($('#attrecordingurl').val()=='' || $('#attrecordingurl').val()==undefined){
		// 	if(tt=='theme1'){
		// 		showMessage(true, "Please fill meeting recording url");
		// 	}else{
		// 		showMessageTheme2(0, "Please fill meeting recording url",'',true);
		// 	}
		// 	return false;
		// }
		// if($('#attrecordingPasscode').val()=='' || $('#attrecordingPasscode').val()==undefined){
		// 	if(tt=='theme1'){
		// 		showMessage(true, "Please fill recording passcode");
		// 	}else{
		// 		showMessageTheme2(0, "Please fill recording passcode",'',true);
		// 	}
		// 	return false;
		// }
		if($('#attmeetingid').val()=='' || $('#attmeetingid').val()==undefined){
			if(tt=='theme1'){
				showMessage(true, "Please fill meeting id");
			}else{
				showMessageTheme2(0, "Please fill meeting id",'',true);
			}
			return false;
		}
	}


	var attendanceRecording = {};
	attendanceRecording['calltype'] = calltype;
	if(attendanceid=='' && attendanceid==undefined){
		attendanceRecording['rattendid'] = $('#rattendid').val();
	}else{
		attendanceRecording['rattendid'] = attendanceid;
	}
	if(attendminuts=='' || attendminuts==undefined){
		var strtdate = $('#attendancedate').val()+' '+$('#atttimeHrsFrom').val()+':'+$('#atttimeMinFrom').val()+':'+$('#atttimeSecFrom').val()
		var date1 = new Date(strtdate);
		var leavetime = $('#attendancedate').val()+' '+$('#atttimeHrsTo').val()+':'+$('#atttimeMinTo').val()+':'+$('#atttimeSecTo').val()
		var date2 = new Date(leavetime);

		var diffMs = (date2 - date1); // milliseconds
		var diffDays = Math.floor(diffMs / 86400000); // days
		var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
		var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
		var seconds = Math.round((Math.abs(diffMs) / 1000));
		console.log(diffDays + " days, " + diffHrs + " hours, " + diffMins + " minutes until )");
		attendanceRecording['jointimes'] = strtdate;
		attendanceRecording['endTimes'] = leavetime;
		attendanceRecording['durations'] = seconds;
	}else{
		attendanceRecording['durations'] = attendminuts;
	}
	if($('#attmeetingid').val()!='' && $('#attmeetingid').val()!=undefined){
		attendanceRecording['meetingId'] = $('#attmeetingid').val().replaceAll(' ','');
	}
	if($('#attmeetingtopic').val()!='' && $('#attmeetingtopic').val()!=undefined){
		attendanceRecording['meetingtopic'] = $('#attmeetingtopic').val();
	}
	if($('#attremark').val()!='' && $('#attremark').val()!=undefined){
		attendanceRecording['comments'] = escapeCharacters($('#attremark').val());
	}else{
		attendanceRecording['comments']= escapeCharacters(remark);
	}
	if($('#attrecordingurl').val()!='' && $('#attrecordingurl').val()!=undefined){
		attendanceRecording['recordingUrl'] = $('#attrecordingurl').val();
		attendanceRecording['recordingPlayPasscode'] = $('#attrecordingPasscode').val();
	}
	attendanceRecording['meetingType'] = "E";
	attendanceRecording['meetingstatus'] = "A";
	attendanceRecording['schoolId'] = SCHOOL_ID;
	attendanceRecording['userId'] = USER_ID;
	attendanceRecording['teacherUserId']=$("#teacherUserId").val();
	console.log(attendanceRecording);
	return attendanceRecording;
}


function editAttendanceComments(attendanceid, remarkid, remarkStatus, calltype) {
	customLoader(true);
	if(tt=='theme1'){
		hideMessage('');
	}else{
		hideMessageTheme2('');
	}
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForHTML('report','edit-attendance-comment'),
		dataType : 'JSON',
		data : JSON.stringify(getSaveAttendanceCommentRequest(attendanceid, remarkid, remarkStatus, calltype)),
		success : function(data) {
			customLoader(false);
			if (data['statusCode'] == '0' || data['statusCode'] == '2') {
				if(tt=='theme1'){
					showMessage(false, data['message']);
				}else{
					showMessageTheme2(0, data['message'],'',true);
				}
			}else{
				if(tt=='theme1'){
					showMessage(false, data['message']);
				}else{
					showMessageTheme2(1, data['message'],'',true);
				}
			}
			return false;
		}
	});
	
	return false;
}

function getSaveAttendanceCommentRequest(attendanceid, remarkid, remarkStatus, calltype){
	var attendanceRemarks = {};
	attendanceRemarks['calltype'] = calltype;
	attendanceRemarks['attendid'] = attendanceid;
	attendanceRemarks['remarkId'] = remarkid;
	attendanceRemarks['remarkStatus'] = remarkStatus;
	attendanceRemarks['schoolId'] = SCHOOL_ID;
	attendanceRemarks['userId'] = USER_ID;
	console.log(attendanceRemarks);
	return attendanceRemarks;
}