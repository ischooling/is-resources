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

function sendMailStudentGradebookSummery(payload, uploadId, startdate, enddate){
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


function callDateWiseGradebokSummery(lmsUserId,lmsProId,stuserId) {
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
	hideMessage('');
	var data={};
	data['lmsUserId']=lmsUserId;
	data['lmsProId']=lmsProId;
	data['stuserId']=stuserId;
	data['startdate']=startdate;
	data['enddate']=enddate;

	$.ajax({
		type : "POST",
		contentType : "application/json",
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
        			showMessage(true, stringMessage[1]);
        		} else {
        			$("#enrollMentGrade").html(htmlContent);
        		}
        		return false;
			}
		},
		error : function(e) {
			console.log(e)
		//	showMessage(true, TECHNICAL_GLITCH);
			return false;
		}
	});
}



