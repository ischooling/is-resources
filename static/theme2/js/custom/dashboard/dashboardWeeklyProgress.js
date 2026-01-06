$(document).ready(function() {
	
});
var subReportType= "";
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
		contentType:APPLICATION_JSON_VALUE,
		url : getURLForHTML('dashboard','send-mail-student-weekly-progress-report'),
		data : JSON.stringify(data),
		dataType : 'html',
		cache : false,
		timeout : 600000,
		success : function(htmlContent) {
			alert("Progress report has been sent");
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
	hideMessageTheme2('');
	var data={};
	data['studentId']=studentId;
	data['standardId']=standardId;
	data['userId']=USER_ID;
	$.ajax({
		type : "POST",
		contentType:APPLICATION_JSON_VALUE,
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
        				showMessageTheme2(true, stringMessage[1]);
        			}
        		} else {
        			$('#swprUploadModuleContents').html(htmlContent);
        		}
        		return false;
			}
		}
	});
}
function uploadSWPRCSV(formId, studentId, standardId) {
	hideMessageTheme2('');
	if($('#semesterId').val()==''){
		showMessageTheme2(true, 'Please select session');
		return false;
	}
	if($('#reportId').val()==''){
		showMessageTheme2(true, 'Please select Report Type');
		return false;
	}
	if($('#frequencyDate').val()==''){
		showMessageTheme2(true, 'Please select weekly report date');
		return false;
	}
	if($('#fileupload1Hash').val()==''){
		showMessageTheme2(true, 'Please upload csv file');
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
		contentType:APPLICATION_JSON_VALUE,
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
        				showMessageTheme2(true, stringMessage[1]);
        			}
        		}else{
        			showMessageTheme2(false, stringMessage[1]);
        		}
        		setTimeout(function(){
					hideMessageTheme2('');
					callSWPRForUpload('SWPRUploadForm', studentId, standardId);
				}, 3100);
        		return false;
			}
		}
	});
}

function sendMailStudentGradebookSummary(payload, uploadId, startdate, enddate){
	subReportType=$("#subReportTypevalue").val();
	//goAhead('send-mail-student-weekly-progress-report?studentId='+studentId+'&uploadId='+uploadId+'&forDownload=false', '');
	var data={};
	data['data']=payload;
	data['uploadId']=uploadId;
	data['forDownload']='false';
	data['startdate']=startdate;
	data['enddate']=enddate;
	data['subReportType']=subReportType;
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLForHTML('dashboard','send-mail-student-get-user-gradebook/'+UNIQUEUUID),
		data : JSON.stringify(data),
		dataType : 'html',
		success : function(htmlContent) {
			alert("Progress report has been sent");
		}
	});
}


function callDateWiseGradebokSummary(lmsUserId,lmsProId,stuserId) {
	var startdate = $("#startdate").val();
	var enddate = $("#enddate").val();
	if(startdate=='' && enddate==''){
		showMessageTheme2(0, 'Please select report start date and end date','', false);
		return false;
	} 
	var selectedDate=new Date(startdate);
	var selectedDate2=new Date(enddate);
	
	if(selectedDate>selectedDate2){
		showMessageTheme2(0, 'Please select start date must be less then end date','', false);
		return false;
	}
	customLoader(true)
	hideMessageTheme2('');
	var data={};
	data['lmsUserId']=lmsUserId;
	data['lmsProId']=lmsProId;
	data['stuserId']=stuserId;
	data['startdate']=startdate;
	data['enddate']=enddate;

	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLForHTML('dashboard','get-user-gradebook-content'),
		data : JSON.stringify(data),
		dataType : 'html',
		cache : false,
		timeout : 600000,
		success : function(htmlContent) {
			customLoader(false)
			if(htmlContent!=""){
            	var stringMessage = [];
            	stringMessage = htmlContent.split("|");
        		if(stringMessage[0] == "FAILED" || stringMessage[0] == "EXCEPTION" || stringMessage[0] == "SESSIONOUT" ){
        			showMessageTheme2(true, stringMessage[1]);
        		} else {
        			$("#enrollMentGrade").html(htmlContent);
        		}
        		return false;
			}
		}
	});
}


function callOpenStudentWeeklyReportPopup(weeklyReportId, userId, uniueId, courseProviderId, studentStandardId, isCron, reportType, startLimit){
	if(reportType === 'view'){
		if(startLimit==0 && !$("#autoMailStudent").hasClass('show')){	
			$("#autoMailStudent").modal('hide');
		}
		$("#isCron").val(isCron);
	}else{
		$("#autoFailedMailStudent").modal('hide');
	}
	getStudentMailHistory(weeklyReportId, userId, uniueId, courseProviderId, studentStandardId, isCron, reportType,'', startLimit);
	$("#weeklyReportSearch").on('keyup', function (e) {
		if($("#weeklyReportSearch").val().length>=3){
			getStudentMailHistory(weeklyReportId, userId, uniueId, courseProviderId, studentStandardId, isCron, reportType ,'', startLimit);
		}else if($("#weeklyReportSearch").val().length==0){
			getStudentMailHistory(weeklyReportId, userId, uniueId, courseProviderId, studentStandardId, isCron, reportType ,'', startLimit);
		}
	});
}
function callFilterdStudentWeeklyReport(weeklyReportId, userId, uniueId, courseProviderId, studentStandardId, isCron, reportType, startLimit){
	weeklyReportId = $("#reportID").val();
	isCron = $("#isCron").val()!=undefined?$("#isCron").val():false;
	var isFilter = $("#reportFilter").val();
	getStudentMailHistory(weeklyReportId, userId, uniueId, courseProviderId, studentStandardId, isCron, reportType ,isFilter, startLimit);
}

function getStudentMailHistory(weeklyReportId, userId, uniueId, courseProviderId, studentStandardId, isCron, reportType, isFilter, startLimit) {
	hideMessageTheme2('');
	customLoader(true);
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLForHTML('dashboard','mail-student-weekly-progress'),
		data : JSON.stringify(getRequestForWeeklyReportStudent(weeklyReportId, userId, uniueId, courseProviderId, studentStandardId, isCron, reportType, isFilter, startLimit)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			//console.log(data);
			customLoader(false);
			if (data['status'] == '0' || data['status'] == '2') {
				showMessageTheme2(true, data['message']);
			} else {
				if(reportType === 'view'){
					//showMessageTheme2(false, data['message']);
					//$("#autoWeeklyMailStudent").dataTable().fnDestroy();
					$("#studentReportSendMail").html("");
					var weeklyStudent = data['studentWeeklyList'];
					if(weeklyStudent!=undefined){
						//console.log(weeklyStudent);
						var htmlTable = "";
						var inc=1;
						for(var i=0;i<weeklyStudent.length;i++){
							htmlTable  = htmlTable + "<tr>";
							htmlTable  = htmlTable + "<td> "+weeklyStudent[i]['srNo']+"</td>";
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
						$(".studentProgressListpaging").html(dataStudentProgressPagging(data, isCron, reportType, weeklyReportId));
						//$("#autoWeeklyMailStudent").DataTable();
						if(!$("#autoMailStudent").hasClass('show')){
							$("#autoMailStudent").modal('show');
						}
					}
				}else{
					$("#autoFailedWeeklyMailStudent").dataTable().fnDestroy();
					$("#studentFailedReportSendMail").html("");
					var weeklyStudent = data['studentWeeklyList'];
					//console.log(weeklyStudent);
					var htmlTable = "";
					var inc=1;
					for(var i=0;i<weeklyStudent.length;i++){
						studentIds.push(weeklyStudent[i]['studentId']);
						htmlTable  = htmlTable + "<tr>";
						htmlTable  = htmlTable + "<td>"+weeklyStudent[i]['srNo']+"</td>";
						htmlTable  = htmlTable + "<td>"+weeklyStudent[i]['courseProviderName']+"</td>";
						htmlTable  = htmlTable + "<td>"+weeklyStudent[i]['studentName']+"</td>";
						htmlTable  = htmlTable + "<td>"+weeklyStudent[i]['studentStringId']+"</td>";
						htmlTable  = htmlTable + "<td>"+weeklyStudent[i]['grade']+"</td>";
						htmlTable  = htmlTable + "<td>"+weeklyStudent[i]['createdDate']+"</td>";
						htmlTable  = htmlTable + "<td><a href='javascript:void(0);' onclick = \"sendMailStudentGradebookSummary('"+weeklyReportId+"','"+weeklyStudent[i]['payload']+"','"+weeklyStudent[i]['uploadId']+"','"+weeklyStudent[i]['startDate']+"','"+weeklyStudent[i]['endDate']+"','weekly')\" data-toggle=\"tooltip\" title=\" Send Report\"><i class=\"fa fa-view\"></i>&nbsp;Resend Report</a></td>";
						htmlTable = htmlTable + "<input type='hidden' class='studentsId' value='"+weeklyStudent[i]['studentId']+"'/>"
						htmlTable  = htmlTable + "</tr>";
						inc = inc +1;
					}
					$("#sendAllMail").attr('onclick',"return showWarningMessageForGenerate('Are you sure you want to generate the report?','againSendAllFailedMail("+weeklyReportId+")')")
					$("#studentFailedReportSendMail").html(htmlTable);
					$(".studentFaildProgressListpaging").html(dataStudentProgressPagging(data, isCron, reportType, weeklyReportId));
					$("#autoFailedWeeklyMailStudent").DataTable();
					$("#autoFailedMailStudent").modal('show');
				}
				$("#reportID").val(weeklyReportId);
			}

			
			
		}
	});
} 

function getRequestForWeeklyReportStudent(weeklyReportId, userId, uniueId, courseProviderId, studentStandardId, isCron, reportType, isFilter, startLimit) {
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
	studentWeeklyDTO['currentPage'] = startLimit;
	studentWeeklyDTO['weeklyReportSearch']=$("#weeklyReportSearch").val();
	request['studentWeeklyDTO'] =studentWeeklyDTO;
    return request;
}


function showWarningMessageForGenerate(warningMessage, functionName){
	if($('#startReportDate').val()==''){
		showMessageTheme2(true, 'Please select Start report date');
		return false;
	}

	if($('#endReportDate').val()==''){
		showMessageTheme2(true, 'Please select End report date');
		return false;
	}
	var startTime = new Date($('#startReportDate').val());
	var endTime = new Date($('#endReportDate').val());

	if(startTime > endTime){
		showMessageTheme2(true, 'Report start date must be less than Report end date.');
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


function callAutoWeeklyStudent(formId, userId) {
	hideMessage('');
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLForHTML('dashboard','auto-weekly-progress-report-api'),
		data : JSON.stringify(getRequestForWeeklyReport(formId, userId)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessageTheme2(true, data['message']);
			} else {
				$("#generateReportTable, #generateReport").show();
				//showMessageTheme2(false, data['message']);
				var weeklyStudent = data['studentWeeklyDTOList'];
				if(weeklyStudent!=null){
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
		contentType : APPLICATION_JSON_VALUE,
		url : getURLForHTML('dashboard','auto-weekly-progress-report-send-api'),
		data : JSON.stringify(getRequestForWeeklyReportSendMail(formId, userId, uniueId)),
		dataType : 'json',
		cache : false,
		timeout : 10000,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessageTheme2(true, data['message']);
			} else {
				showMessageTheme2(false, data['message']);
				$("#autoViewModule").modal('hide');
				$("#autoFailedMailStudent").modal('hide');
				$(".modal-backdrop").remove();
				$("body").removeClass("modal-open");
				$("body").css({"padding-left":"0px"});
				
				getAutoWeeklyProgressList(roleModuleId, 0, 0)
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

