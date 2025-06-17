$(document).ready(function() {
	console.log('dashboardAnnouncement');

});

function validateRequestForSchoolAnnounce(formId){
	if($("#"+formId+" #announceFor").val()==''){
		showMessage(1, "Please select announcement for");
		return false;
	}

	var selectRole = $("#announceFor").val();
	selectRole = selectRole.toString();
	var str2 = "STUDENT";//.indexOf(str2) != -1
	if(selectRole=="STUDENT"){
		if($("#"+formId+" #enrollType").val()==''){
			showMessage(1, "Please select enrollment type");
			return false;
		}
	}
	if($("#"+formId+" #announceTitle").val()==''){
		showMessage(1, "Please enter subject");
		return false;
	}
	
	
	// if($("#"+formId+" #announceStartDate").val()==''){
	// 	showMessage(1, "Please select date");
	// 	return false;
	// }
	// if($("#"+formId+" #startTimeInHrs").val()==''){
	// 	showMessage(1, "Please select Start time(hrs)");
	// 	return false;
	// }
	// if($("#"+formId+" #startTimeInMin").val()==''){
	// 	showMessage(1, "Please select Start time(Min)");
	// 	return false;
	// }
	let isChecked = true; //$("#"+formId+" #checkAnnounceEnd").is(':checked');
	
	if(isChecked){}
	else{
		// if($("#"+formId+" #announceEndDate").val()==''){
		// 	showMessage(1, "Please select end date");
		// 	return false;
		// }
		// if($("#"+formId+" #endTimeInHrs").val()==''){
		// 	showMessage(1, "Please select End time(hrs)");
		// 	return false;
		// }
		// if($("#"+formId+" #endTimeInMin").val()==''){
		// 	showMessage(1, "Please select End time(Min)");
		// 	return false;
		// }
	}
	
	var str = $("#"+formId+" #announceTitle").val();
	if(str.length>100){
		showMessage(1, "You cannot have more than 100 characters in Subject");
		return false;
	}
	
	if(editor1!=undefined){
		var str = escapeCharacters(editor1.getData());
		if(str==''){
			showMessage(1, "Please add description ");
			return false;
		}
		// if(str.length>=500){
		// 	showMessage(1, "You cannot have more than 500 characters in description !");
		// 	return false;
		// }
	}
	
	
	
	
	// if($("#"+formId+" #announceStartDate").val()!='' && $("#"+formId+" #startTimeInHrs").val()!='' && $("#"+formId+" #startTimeInMin").val()!=''){
	// 	var announceDate=$("#"+formId+" #announceStartDate").val();
	// 		announceDate=announceDate.split("-");
	// 	var announcMentDateTime=new Date(announceDate[2]+'/'+announceDate[0]+'/'+announceDate[1]+' '+$("#"+formId+" #startTimeInHrs").val().trim()+':'+$("#"+formId+" #startTimeInMin").val().trim()+':00');
	// 	var currentDate= new Date();
	// 	if(currentDate>announcMentDateTime){
	// 		showMessage(1, "Please select future time duration");
	// 		return false;
	// 	}
	// 	let isEndChecked = true;//$("#"+formId+" #checkAnnounceEnd").is(':checked');
	// 	if(isEndChecked){}
	// 	else{
	// 		// var announceEndDate=$("#"+formId+" #announceEndDate").val();
	// 		// announceEndDate=announceEndDate.split("-");
	// 		// var announcMentEndDateTime=new Date(announceEndDate[2]+'/'+announceEndDate[0]+'/'+announceEndDate[1]+' '+$("#"+formId+" #endTimeInHrs").val().trim()+':'+$("#"+formId+" #endTimeInMin").val().trim()+':00');
	// 		// if(announcMentDateTime>announcMentEndDateTime){
	// 		// 	showMessage(1, 'Please select start date must be less then end date');
	// 		// 	return false;
	// 		// }
	// 	}
		
	// }

	
	return true;
}
function submitSchoolAnnounce(formId,moduleId) {
	hideMessage('');
	if(!validateRequestForSchoolAnnounce(formId)){
		return false;
	}
	var fdata = new FormData();
	fdata.append('userId',$("#"+formId+" #userId").val());
	fdata.append('announceId',$("#"+formId+" #announceId").val());
	fdata.append('enrollType',$("#"+formId+" #enrollType").select2('val'));
	fdata.append('announceFor',$("#"+formId+" #announceFor").val());
	fdata.append('standardId',$("#"+formId+" #standardId").select2('val'));
	fdata.append('batchId',$("#"+formId+" #batchId").select2('val'));
	fdata.append('studentId',$("#"+formId+" #studentId").select2('val'));
	fdata.append('schoolId',$("#"+formId+" #schoolId").val());
	fdata.append('subjectId',$("#"+formId+" #subjectIds").select2('val'));
	if($("#" + formId + " #enrollType").val()=='BATCH'){
		fdata.append('lmsPlatform','38,39,40,41');
	}else if($("#" + formId + " #enrollType").val()=='ALL' || $("#" + formId + " #announceFor").val()=='TEACHER'){
		fdata.append('lmsPlatform','37,38,39,40,41');
	}else if($("#" + formId + " #enrollType").val()=='SSP'){
		fdata.append('lmsPlatform','37,40,41');
	}else if($("#" + formId + " #enrollType").val()=='SCHOLARSHIP'){
		fdata.append('lmsPlatform','37,39,40,41');
	}else if($("#" + formId + " #enrollType").val()=='ONE_TO_ONE_FLEX'){
		fdata.append('lmsPlatform','37');
	}else{
		fdata.append('lmsPlatform','37,39,41');
	}
	if($("#" + formId + " #announceFor").val()=='TEACHER'){
		fdata.append('lmsPlatform','37,38,39,40,41');
	}
	
	fdata.append('announceTitle',escapeCharacters($("#"+formId+" #announceTitle").val()));
	fdata.append('attachment', $("#"+formId+" #fileuploadAnnounce").get(0).files[0]);
	if(editor1!=undefined){
		fdata.append('announceRemark',escapeCharacters(editor1.getData()));
	}
	fdata.append('announceStartDate','');
	fdata.append('startTime',$("#"+formId+" #startTimeInHrs").val()+':'+$("#"+formId+" #startTimeInMin").val()+':00');
	let isEndChecked1 = true;//$("#"+formId+" #checkAnnounceEnd").is(':checked');
		if(isEndChecked1){}
		else{
			// fdata.append('announceEndDate',$("#"+formId+" #announceEndDate").val());
			// fdata.append('endTime',$("#"+formId+" #endTimeInHrs").val()+':'+$("#"+formId+" #endTimeInMin").val()+':00');
		}

	$.ajax({
		type : "POST",
		url : getURLForHTML('dashboard','teacher-school-announce-submit'),
		data : fdata,
		dataType : 'json',
		type: "POST",
		processData: false,
		contentType: false,
		enctype: 'multipart/form-data',
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				$('#'+formId+ ' #announceFor').val('').trigger("change");
				$('#'+formId+ ' #enrollType').val('').trigger("change");
				$('#'+formId+ ' #lmsPlatform').val('').trigger("change");
				$('#'+formId+ ' #standardId').val('').trigger("change");
				$('#'+formId+ ' #batchId').val('').trigger("change");
				$('#'+formId+ ' #studentId').val('').trigger("change");
				$("#"+formId+" #batchId").html('');
				$("#"+formId+" #studentId").html('');
				$("#"+formId+" #fileupload1Span").text('No file chosen...');
				$("#"+formId+" #checkAnnounceEnd").prop('checked', false);
				$("#"+formId+" #endDateDiv").show();
				$("#"+formId+" #endTimeStartDiv").show();
				initEditor(1, 'mymceAnnounce','Please start here', true);
				$('#'+formId)[0].reset();
				showMessage(false, data['message']);
				
			}
			return false;
		},
		error : function(e) {
			//showMessage(true, e.responseText);
			return false;
		}
	});
}

function callSubjectNameMultipleList(formId, value, userId,courseProviderId ,userRole, dataType) {
	value = value.toString();
	console.log("Building Subject dropdown", value);
	$.ajax({
			type : "POST",
			contentType : "application/json",
			url : getURLForCommon('masters'),
			data : JSON.stringify(getRequestForMaster('formId','SUBJECT-NAME-LIST-BASED-ON-BATCHES',userId,courseProviderId,userRole,dataType, value)),
			dataType : 'json',
			cache : false,
			timeout : 600000,
			async : false,
			success : function(data) {
				if (data['status'] == '0' || data['status'] == '2') {
					showMessage(true, data['message']);
				} else {
					var result = data['mastersData']['courseList'];
					console.log(result);
					var dropdown = $("#"+formId+" #subjectIds");
					dropdown.html('');
					$.each(result, function(k, v) {
						dropdown.append('<option value="' + v.key + '">'
								+ v.value + ' </option>');
					});
				}
			},
				error : function(e) {
					console.log(e);
				}
			});
}

function updateSchoolAnnounce(userId,announceId,controllType,moduleId) {
	hideMessage('');
	
	var fdata = {};
	fdata['userId']=userId;
	fdata['announceId']=announceId;
	fdata['controllType']=controllType;
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForHTML('dashboard','teacher-school-announce-update'),
		data : JSON.stringify(fdata),
		dataType : 'json',
		//processData: false,
		//contentType: false,
		//enctype: 'multipart/form-data',
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				showMessage(false, data['message']);
				setTimeout(function (){callDashboardPageSchool(moduleId,'school-announce-list');},1000);
			}
			return false;
		},
		error : function(e) {
			//showMessage(true, e.responseText);
			return false;
		}
	});
}
function callAnnounceReplyList(announceId,moduleId) {
	hideMessage('');
	$.ajax({
		type : "POST",
		contentType : 'application/json',
		url : getURLForHTML('dashboard','teacher-announce-reply'),
		data : JSON.stringify({"announceId":announceId}),
		dataType : 'html',
		cache : false,
		timeout : 600000,
		success : function(htmlContent) {
			if(htmlContent!=""){
            	var stringMessage = [];
            	stringMessage = htmlContent.split("|");
        		if(stringMessage[0] == "FAILED" || stringMessage[0] == "EXCEPTION" || stringMessage[0] == "SESSIONOUT" ){
        			showMessage(true, stringMessage[1]);
        		} else {
        			$('#announceReplyListContent').html(htmlContent);
        		}
        		return false;
			}
		},
		error : function(e) {
			console.log(e)
			return false;
		}
	});
}

function courseProviderList(formId, elementId) {
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForCommon('masters'),
		data : JSON.stringify(getRequestForMaster('formId','ALL-COURSE-PROVIDER-LIST', 'courseProList')),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		async : false,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				var result = data['mastersData']['courseList'];
				var dropdown = $('#'+formId+' #'+elementId);
				dropdown.html('');
				//dropdown.append('<option value="">Select LMS Platform</option>');
				$.each(result, function(k, v) {
					if(v.key==36 || v.key==37 || v.key==38 || v.key==39 || v.key==40 || v.key==41){
						dropdown.append('<option value="' + v.key + '">' + v.value + ' </option>');
						//dropdown.prop("disabled",true)
					}
				});
			}
		}
	});
}
