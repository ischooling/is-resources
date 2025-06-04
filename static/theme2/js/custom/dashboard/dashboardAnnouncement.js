function validateRequestForSchoolAnnounce(formId){
	if($("#"+formId+" #announceFor").val()==''){
		showMessage(1, "Please select announce for");
		return false;
	}

	var selectRole = $("#announceFor").val();
	selectRole = selectRole.toString();
	var str2 = "STUDENT";
	if(selectRole.indexOf(str2) != -1){
		if($("#"+formId+" #enrollType").val()==''){
			showMessage(1, "Please select enrollment type");
			return false;
		}
	}
	
	if($("#"+formId+" #announceTitle").val()==''){
		showMessage(1, "Please enter subject");
		return false;
	}
	
	var str = $("#"+formId+" #announceTitle").val();
	if(str.length>100){
		showMessage(1, "You cannot have more than 100 characters! now your char length is "+str.length);
		return false;
	}
	
	if(editor1!=undefined){
		var str = escapeCharacters(editor1.getData());
		console.log(str);
		if(str==''){
			showMessage(1, "Please add description ");
			return false;
		}
		if(str.length>400){
			showMessage(1, "You cannot have more than 250 characters! now your char length is "+str.length);
			return false;
		}
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

	// 	var announceEndDate=$("#"+formId+" #announceEndDate").val();
	// 	announceEndDate=announceEndDate.split("-");
	// 	var announcMentEndDateTime=new Date(announceEndDate[2]+'/'+announceEndDate[0]+'/'+announceEndDate[1]+' '+$("#"+formId+" #endTimeInHrs").val().trim()+':'+$("#"+formId+" #endTimeInMin").val().trim()+':00');
	// 	if(announcMentDateTime>announcMentEndDateTime){
	// 		showMessage(1, 'Please select start date must be less then end date');
	// 		return false;
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
	fdata.append('announceFor',$("#"+formId+" #announceFor").select2('val'));
	fdata.append('standardId',$("#"+formId+" #standardId").select2('val'));
	fdata.append('batchId',$("#"+formId+" #batchId").select2('val'));
	fdata.append('studentId',$("#"+formId+" #studentId").select2('val'));
	fdata.append('schoolId',SCHOOL_ID);
	fdata.append('announceTitle',escapeCharacters($("#"+formId+" #announceTitle").val()));
	fdata.append('attachment', $("#"+formId+" #fileuploadAnnounce").get(0).files[0]);
	if(editor1!=undefined){
		fdata.append('announceRemark',escapeCharacters(editor1.getData()));
	}
	fdata.append('announceStartDate',$("#"+formId+" #announceStartDate").val());
	fdata.append('startTime',$("#"+formId+" #startTimeInHrs").val()+':'+$("#"+formId+" #startTimeInMin").val()+':00');
	fdata.append('announceEndDate',$("#"+formId+" #announceEndDate").val());
	fdata.append('endTime',$("#"+formId+" #endTimeInHrs").val()+':'+$("#"+formId+" #endTimeInMin").val()+':00');

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
				$('#'+formId+ ' #enrollType').val('').trigger("change");
				$('#'+formId+ ' #announceFor').val('').trigger("change");
				$('#'+formId+ ' #standardId').val('').trigger("change");
				$('#'+formId+ ' #batchId').val('').trigger("change");
				$('#'+formId+ ' #studentId').val('').trigger("change");
				$("#"+formId+" #batchId").html('');
				$("#"+formId+" #studentId").html('');
				$("#"+formId+" #fileupload1Span").text('No file chosen...');
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

function updateSchoolAnnounce(userId,announceId,controllType,moduleId) {
	hideMessage('');
	
	var fdata = new FormData();
	fdata.append('userId',userId);
	fdata.append('announceId',announceId);
	fdata.append('controllType',controllType);
	$.ajax({
		type : "POST",
		url : getURLForHTML('dashboard','teacher-school-announce-update'),
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
