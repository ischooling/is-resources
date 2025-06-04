$(document).ready(function() {
	
});
function sendSWPREmail(studentId, uploadId){
	$('#sendSWPR').attr('disabled','disabled');
	//goAhead('send-mail-student-weekly-progress-report?studentId='+studentId+'&uploadId='+uploadId+'&forDownload=false', '');
	var data={};
	data['studentId']=studentId;
	data['uploadId']=uploadId;
	data['userId']=USER_ID;
	data['schoolUUID']=schoolUUID;
	data['forDownload']='false';
	$.ajax({
		type : "POST",
		contentType:"application/json",
		url : getURLForHTML('dashboard','send-mail-student-weekly-progress-report'),
		data : JSON.stringify(data),
		dataType : 'html',
		cache : false,
		timeout : 600000,
		success : function(htmlContent) {
			alert("Progress report has been sent");
		},
		error : function(e) {
			$('#sendSWPR').removeAttr('disabled','disabled');
			//showMessage(true, TECHNICAL_GLITCH);
			return false;
		}
	});
}

function setCalenderDate(disbleDates){
	console.log($('#semesterId :selected').attr('semesterDateStart')+' - '+$('#semesterId :selected').attr('semesterDateEnd'));
	var startDate = new Date($('#semesterId :selected').attr('semesterDateStart'));
	//startDate.setMonth(startDate.getMonth() - 5);
	var endDate = new Date($('#semesterId :selected').attr('semesterDateEnd'));
	endDate.setDate(endDate.getDate() + 7);
	console.log(startDate+' - '+endDate);
	$("#frequencyDate").datepicker("remove");
	$('#frequencyDate').val('');
	$("#frequencyDate").datepicker({
    	startDate : startDate,
		endDate : endDate,
		format : 'mm-dd-yyyy',
        autoclose: true,
        daysOfWeekDisabled: disbleDates,
    });
}
function showSWPRForUpload(studentId, studentName, standardId){
	$('#swprUploadModelTitleUpload').html('Upload Weekly Progress Report for '+studentName)
	callSWPRForUpload('SWPRUploadForm', studentId, standardId);
	$('#swprUploadModule').modal('show');
}
function showSWPRForView(studentId, studentName, standardId){
	$('#swprUploadModelTitleView').html('View Weekly Progress Report for '+studentName)
	callSWPRForUpload('SWPRUploadForm', studentId, standardId);
	$('#swprViewModule').modal('show');
}
function callSWPRForUpload(formId, studentId, standardId) {
	hideMessage('');
	var data={};
	data['studentId']=studentId;
	data['standardId']=standardId;
	data['userId']=USER_ID;
	$.ajax({
		type : "POST",
		contentType:"application/json",
		url : getURLForHTML('dashboard','get-swpr-for-upload'),
		data : JSON.stringify(data),
		dataType : 'html',
		cache : false,
		timeout : 600000,
		success : function(htmlContent) {
			if(htmlContent!=""){
            	var stringMessage = [];
            	stringMessage = htmlContent.split("|");
        		if(stringMessage[0] == "FAILED" || stringMessage[0] == "EXCEPTION" || stringMessage[0] == "SESSIONOUT" ){
        			if(stringMessage[0] == "SESSIONOUT"){
        				redirectLoginPage();
        			}else {
        				showMessage(true, stringMessage[1]);
        			}
        		} else {
        			$('#swprUploadModuleContents').html(htmlContent);
        		}
        		return false;
			}
		},
		error : function(e) {
			//showMessage(true, TECHNICAL_GLITCH);
			return false;
		}
	});
}

var studentIds = [];

function uploadSWPRCSV(formId, studentId, standardId) {
	hideMessage('');
	if($('#semesterId').val()==''){
		showMessage(true, 'Please select session');
		return false;
	}
	if($('#reportId').val()==''){
		showMessage(true, 'Please select Report Type');
		return false;
	}
	if($('#frequencyDate').val()==''){
		showMessage(true, 'Please select weekly report date');
		return false;
	}
	if($('#fileupload1Hash').val()==''){
		showMessage(true, 'Please upload csv file');
		return false;
	}
	var frequencyDate =$('#frequencyDate').val();
	frequencyDate = frequencyDate.split('-');
	var uploadDate = frequencyDate[2]+'-'+frequencyDate[0]+'-'+frequencyDate[1];
	var startDate = $('#startDate').val();
	if (startDate == undefined) {
		var uploadstartDate = null;
	} else {
		startDate = startDate.split('-');
		var uploadstartDate = startDate[2] + '-' + startDate[0] + '-'+ startDate[1];
		
	}
	var endDate =$('#endDate').val();
	if (endDate== undefined) {
		var uploadendDate = null;
	} else {
		endDate = endDate.split('-');
		var uploadendDate = endDate[2]+'-'+endDate[0]+'-'+endDate[1];
		
	}
	var retrievedDate =$('#retrievedDate').val();
	if (retrievedDate== undefined) {
		var uploadRetrievedDate = null;
	} else {
		retrievedDate = retrievedDate.split('-');
		var uploadRetrievedDate = retrievedDate[2]+'-'+retrievedDate[0]+'-'+retrievedDate[1];
		
	}
	var semesterId=$('#semesterId').val();
	if($('#semesterId').val()==undefined){
		semsterId=0;
	}
	var data={};
	 data['studentId']=studentId;
	 data['uploadHashId']=$('#fileupload1Hash').val();
	 data['semesterId']=semsterId;
	 data['uploadDate']=uploadDate;
	 data['standardId']=standardId;
	 data['reportId']=$('#reportId').val();
	 data['uploadstartDate']=uploadstartDate;
	 data['uploadendDate']=uploadendDate;
	 data['uploadRetrievedDate']=uploadRetrievedDate;
	 data['userId']=USER_ID;
	$.ajax({
		type : "POST",
		contentType:"application/json",
		url : getURLForHTML('dashboard','upload-student-weekly-progress-report'),
		data : JSON.stringify(data),
		dataType : 'html',
		cache : false,
		timeout : 600000,
		success : function(htmlContent) {
			if(htmlContent!=""){
            	var stringMessage = [];
            	stringMessage = htmlContent.split("|");
        		if(stringMessage[0] == "FAILED" || stringMessage[0] == "EXCEPTION" || stringMessage[0] == "SESSIONOUT" ){
        			if(stringMessage[0] == "SESSIONOUT"){
        				redirectLoginPage();
        			}else {
        				showMessage(true, stringMessage[1]);
        			}
        		}else{
        			showMessage(false, stringMessage[1]);
        		}
        		setTimeout(function(){
					hideMessage('');
					callSWPRForUpload('SWPRUploadForm', studentId, standardId);
				}, 3100);
        		return false;
			}
		},
		error : function(e) {
		//	showMessage(true, TECHNICAL_GLITCH);
			return false;
		}
	});
}


function callAutoWeeklyStudent(formId, userId) {
	hideMessage('');
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForHTML('dashboard','auto-weekly-progress-report-api'),
		data : JSON.stringify(getRequestForWeeklyReport(formId, userId)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				$("#generateReportTable, #generateReport").show();
				//showMessage(false, data['message']);
				var weeklyStudent = data['studentWeeklyDTOList'];
				console.log(weeklyStudent);
				var htmlTable = "";
				var inc=1;
				for(var i=0;i<weeklyStudent.length;i++){
					htmlTable  = htmlTable + "<tr>";
					htmlTable  = htmlTable + "<td>"+(i+1)+"</td>";
					htmlTable  = htmlTable + "<td><input type=\"checkbox\" class=\"checkAllStd\" name=\"studentWeek"+weeklyStudent[i]['studentId']+"[]\" id=\"studentWeek"+weeklyStudent[i]['studentId']+"\"  value="+weeklyStudent[i]['studentId']+" /> </td>";
					htmlTable  = htmlTable + "<td>"+weeklyStudent[i]['courseProviderName']+"</td>";
					htmlTable  = htmlTable + "<td>"+weeklyStudent[i]['studentName']+"</td>";
					htmlTable  = htmlTable + "<td>"+weeklyStudent[i]['grade']+"</td>";
					htmlTable  = htmlTable + "</tr>";
				}
				$("#autoStudentReportLog").html(htmlTable);
				
			}
		}
	});
}

function getRequestForWeeklyReport(formId, userId) {
	var studentWeeklyDTO = {};
	var request = {};
    studentWeeklyDTO['userId'] =userId;
    studentWeeklyDTO['schoolId'] = SCHOOL_ID;
	studentWeeklyDTO['courseProviderId']= $("#"+formId+" #lmsPlatform").val();
	studentWeeklyDTO['standardId']= $("#"+formId+" #standardId").val();
	studentWeeklyDTO['email']= $("#"+formId+" #userNameOrEmail").val();
	studentWeeklyDTO['studentName']= $("#"+formId+" #studentName").val();
	request['studentWeeklyDTO']=studentWeeklyDTO;
    return request;
}

function callAutoWeeklyStudentSendMail(formId, userId, uniueId, roleModuleId) {
	

	hideMessage('');
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForHTML('dashboard','auto-weekly-progress-report-send-api'),
		data : JSON.stringify(getRequestForWeeklyReportSendMail(formId, userId, uniueId)),
		dataType : 'json',
		cache : false,
		timeout : 10000,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				showMessage(false, data['message']);
				$("#autoViewModule").modal('hide');
				$("#autoFailedMailStudent").modal('hide');
				$(".modal-backdrop").remove();
				$("body").removeClass("modal-open");
				$("body").css({"padding-left":"0px"});
				
				getActiveSession();
				// callDashboardPageSchool(roleModuleId,'auto-progress-report');
			}
		}
	});
}
function againSendAllFailedMail(reportId) {
	hideMessage('');
	var data={};
	data['attempt']=2;
	data['reportId']=reportId;
	$.ajax({
		type : "GET",
		contentType : "text/plain",
		url : BASE_URL+CONTEXT_PATH+'crons/auto-weekly-progress-report-send-api',
		data : JSON.stringify(data),
		dataType : 'html',
		cache : false,
		timeout : 10000,
		success : function(data) {
				$("#autoFailedMailStudent").modal('hide');
		},
		error: function(error){
			console.log(error);
		}
	});
}

function getRequestForWeeklyReportSendMail(formId, userId, uniueId) {
	var studentWeeklyDTO = {};
	var request={};
	var stuIds=[];
    studentWeeklyDTO['userId'] =userId;
    studentWeeklyDTO['schoolId'] = SCHOOL_ID;
	studentWeeklyDTO['uniueId']=uniueId;
	studentWeeklyDTO['daysType']=$("#reporttype").val();
	var startReportDate =getDateInDateFormat($("#startReportDate").val());
	startReportDate = changeDateFormat(startReportDate, 'mm-dd-yyyy');
	studentWeeklyDTO['reportStartDate']= startReportDate;
	var endReportDate =getDateInDateFormat($("#endReportDate").val());
	endReportDate = changeDateFormat(endReportDate, 'mm-dd-yyyy');
	studentWeeklyDTO['reportEndDate']= endReportDate;

	$(".checkAllStd").each(function() {
		if (this.checked) {
			stuIds.push(parseInt($(this).val()));
		}
	});
	if(stuIds.length <= 0){
		studentWeeklyDTO['studentUserIds']=studentIds;
	}else{
		studentWeeklyDTO['studentUserIds']=stuIds;
	}
	
	request['studentWeeklyDTO']=studentWeeklyDTO
    return request;
}

function callOpenStudentWeeklyReportPopup(weeklyReportId, userId, uniueId, courseProviderId, studentStandardId, isCron, reportType){
	if(reportType === 'view'){
		$("#autoMailStudent").modal('hide');
		$("#isCron").val(isCron);
	}else{
		$("#autoFailedMailStudent").modal('hide');
	}
	getStudentMailHistory(weeklyReportId, userId, uniueId, courseProviderId, studentStandardId, isCron, reportType);
}

function callFilterdStudentWeeklyReport(weeklyReportId, userId, uniueId, courseProviderId, studentStandardId, isCron, reportType){
	weeklyReportId = $("#reportID").val();
	isCron = $("#isCron").val();
	var isFilter = $("#reportFilter").val();
	getStudentMailHistory(weeklyReportId, userId, uniueId, courseProviderId, studentStandardId, isCron, reportType ,isFilter);
}

function getStudentMailHistory(weeklyReportId, userId, uniueId, courseProviderId, studentStandardId, isCron, reportType, isFilter) {
	hideMessage('');
	customLoader(true);
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForHTML('dashboard','mail-student-weekly-progress'),
		data : JSON.stringify(getRequestForWeeklyReportStudent(weeklyReportId, userId, uniueId, courseProviderId, studentStandardId, isCron, reportType, isFilter)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			customLoader(false);
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				if(reportType === 'view'){
					//showMessage(false, data['message']);
					$("#autoWeeklyMailStudent").dataTable().fnDestroy();
					$("#studentReportSendMail").html("");
					var weeklyStudent = data['studentWeeklyDTOList'];
					console.log(weeklyStudent);
					var htmlTable = "";
					var inc=1;
					for(var i=0;i<weeklyStudent.length;i++){
						htmlTable  = htmlTable + "<tr>";
						htmlTable  = htmlTable + "<td> "+inc+"</td>";
						htmlTable  = htmlTable + "<td>"+weeklyStudent[i]['courseProviderName']+"</td>";
						htmlTable  = htmlTable + "<td>"+weeklyStudent[i]['studentName']+"</td>";
						htmlTable  = htmlTable + "<td>"+weeklyStudent[i]['studentStringId']+"</td>";
						htmlTable  = htmlTable + "<td>"+weeklyStudent[i]['grade']+"</td>";
						htmlTable  = htmlTable + "<td><a href="+weeklyStudent[i]['playloadUrl']+" target=\"_blank\" data-toggle=\"tooltip\" title=\"View and Send Report\"><i class=\"fa fa-eye\"></i></a></td>";
						if(weeklyStudent[i]['mailStatus']=='Y'){
							htmlTable  = htmlTable + "<td><i class=\"fa fa-check\"></i></td>";
						}else{
							htmlTable  = htmlTable + "<td><i class=\"fa fa-times\"></i></td>";
						}
						if(weeklyStudent[i]['mailStatus']=='B' || weeklyStudent[i]['mailStatus']=='N'){
							htmlTable  = htmlTable + "<td>Yes</td>";
						}else{
							htmlTable  = htmlTable + "<td>No</td>";
						}
						htmlTable  = htmlTable + "<td>"+weeklyStudent[i]['createdDate']+"</td>";
						htmlTable  = htmlTable + "</tr>";
						inc = inc +1;
					}
					$("#studentReportSendMail").html(htmlTable);
					$("#autoWeeklyMailStudent").DataTable();
					$("#autoMailStudent").modal('show');
				}else{
					$("#autoFailedWeeklyMailStudent").dataTable().fnDestroy();
					$("#studentFailedReportSendMail").html("");
					var weeklyStudent = data['studentWeeklyDTOList'];
					console.log(weeklyStudent);
					var htmlTable = "";
					var inc=1;
					for(var i=0;i<weeklyStudent.length;i++){
						studentIds.push(weeklyStudent[i]['studentId']);
						htmlTable  = htmlTable + "<tr>";
						htmlTable  = htmlTable + "<td> "+inc+"</td>";
						htmlTable  = htmlTable + "<td>"+weeklyStudent[i]['courseProviderName']+"</td>";
						htmlTable  = htmlTable + "<td>"+weeklyStudent[i]['studentName']+"</td>";
						htmlTable  = htmlTable + "<td>"+weeklyStudent[i]['studentStringId']+"</td>";
						htmlTable  = htmlTable + "<td>"+weeklyStudent[i]['grade']+"</td>";
						// htmlTable  = htmlTable + "<td><a href="+weeklyStudent[i]['playloadUrl']+" target=\"_blank\" data-toggle=\"tooltip\" title=\"View and Send Report\"><i class=\"fa fa-eye\"></i></a></td>";
						// if(weeklyStudent[i]['mailStatus']=='Y'){
						// 	htmlTable  = htmlTable + "<td><i class=\"fa fa-check\"></i></td>";
						// }else{
						// 	htmlTable  = htmlTable + "<td><i class=\"fa fa-times\"></i></td>";
						// }
						// if(weeklyStudent[i]['mailStatus']=='B'){
						// 	htmlTable  = htmlTable + "<td>Yes</td>";
						// }else{
						// 	htmlTable  = htmlTable + "<td>No</td>";
						// }
						htmlTable  = htmlTable + "<td>"+weeklyStudent[i]['createdDate']+"</td>";
						htmlTable  = htmlTable + "<td><a href='javascript:void(0);' onclick = \"sendMailStudentGradebookSummery('"+weeklyReportId+"','"+weeklyStudent[i]['payload']+"','"+weeklyStudent[i]['uploadId']+"','"+weeklyStudent[i]['startDate']+"','"+weeklyStudent[i]['endDate']+"','weekly')\" data-toggle=\"tooltip\" title=\" Send Report\"><i class=\"fa fa-view\"></i>&nbsp;Resend Report</a></td>";
						htmlTable = htmlTable + "<input type='hidden' class='studentsId' value='"+weeklyStudent[i]['studentId']+"'/>"
						htmlTable  = htmlTable + "</tr>";
						inc = inc +1;
					}
					$("#sendAllMail").attr('onclick',"return showWarningMessageForGenerate('Are you sure you want to generate the report?','againSendAllFailedMail("+weeklyReportId+")')")
					$("#studentFailedReportSendMail").html(htmlTable);
					$("#autoFailedWeeklyMailStudent").DataTable();
					$("#autoFailedMailStudent").modal('show');
				}
				$("#reportID").val(weeklyReportId);
			}
			
		},
		error : function(e) {
			customLoader(false);
		}
	});
} 


function sendMailStudentGradebookSummery(reportId, payload, uploadId, startdate, enddate,subReportType){
	//goAhead('send-mail-student-weekly-progress-report?studentId='+studentId+'&uploadId='+uploadId+'&forDownload=false', '');
	var data={};
	data['data']=payload;
	data['uploadId']=uploadId;
	data['forDownload']='false';
	data['startdate']=startdate;
	data['enddate']=enddate;
	data['subReportType']=subReportType;
	data['reportId']=reportId;

	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForHTML('dashboard','send-mail-student-get-user-gradebook/'+UNIQUEUUID),
		data : JSON.stringify(data),
		dataType : 'html',
		success : function(htmlContent) {
			alert("Progress report has been sent");
		},
		error : function(e) {
			$('#sendSWPR').removeAttr('disabled','disabled');
			//showMessage(true, TECHNICAL_GLITCH);
			return false;
		}
	});
}

function getRequestForWeeklyReportStudent(weeklyReportId, userId, uniueId, courseProviderId, studentStandardId, isCron, reportType, isFilter) {
	var studentWeeklyDTO = {};
	var request={};
    studentWeeklyDTO['userId']=userId;
    studentWeeklyDTO['schoolId']=SCHOOL_ID;
	studentWeeklyDTO['weeklyReportId']=weeklyReportId;
	studentWeeklyDTO['uniueId']=uniueId;
	studentWeeklyDTO['reportType']=reportType;
	studentWeeklyDTO['courseProviderId']=courseProviderId;
	studentWeeklyDTO['standardId']=studentStandardId;
	studentWeeklyDTO['cron'] = isCron;
	studentWeeklyDTO['isFilter'] = isFilter;
	request['studentWeeklyDTO'] =studentWeeklyDTO;
    return request;
}


function showWarningMessageForGenerate(warningMessage, functionName){
	if($('#startReportDate').val()==''){
		showMessage(true, 'Please select Start report date');
		return false;
	}

	if($('#endReportDate').val()==''){
		showMessage(true, 'Please select End report date');
		return false;
	}
	var startTime = new Date($('#startReportDate').val());
	var endTime = new Date($('#endReportDate').val());

	if(startTime > endTime){
		showMessage(true, 'Report start date must be less than Report end date.');
		return false;
	}
	if(functionName==''){
		$('#generateReportWarningYes').hide();
		$('#generateReportWarningNo').hide();
		$('#generateReportWarningCancel*').show();
	}else{
		$('#generateReportWarningYes').show();
		$('#generateReportWarningNo').show();
		$('#generateReportWarningCancel*').hide();
	}
	functionName = "$('#resetProgressReport').modal('hide');"+functionName+";";
    $('#warningMessage').html(warningMessage);
	$('#generateReportWarningYes').attr('onclick',functionName);
	$('#resetProgressReport').modal('show');
}

