$(document).ready(function() {
	// console.log('dashboardAnnouncement');

});

function validateRequestForSchoolAnnounce(formId){
	if($("#"+formId+" #announceFor").val()==''){
		showMessageTheme2(0, "Please select announcement for");
		return false;
	}

	var selectRole = $("#announceFor").val();
	selectRole = selectRole.toString();
	var str2 = "STUDENT";//.indexOf(str2) != -1
	if(selectRole=="STUDENT"){
		if($("#"+formId+" #enrollType").val()==''){
			showMessageTheme2(0, "Please select enrollment type");
			return false;
		}
	}
	if($("#"+formId+" #announceTitle").val()==''){
		showMessageTheme2(0, "Please enter subject");
		return false;
	}
	
	
	// if($("#"+formId+" #announceStartDate").val()==''){
	// 	showMessageTheme2(0, "Please select date");
	// 	return false;
	// }
	// if($("#"+formId+" #startTimeInHrs").val()==''){
	// 	showMessageTheme2(0, "Please select Start time(hrs)");
	// 	return false;
	// }
	// if($("#"+formId+" #startTimeInMin").val()==''){
	// 	showMessageTheme2(0, "Please select Start time(Min)");
	// 	return false;
	// }
	let isChecked = true; //$("#"+formId+" #checkAnnounceEnd").is(':checked');
	
	if(isChecked){}
	else{
		// if($("#"+formId+" #announceEndDate").val()==''){
		// 	showMessageTheme2(0, "Please select end date");
		// 	return false;
		// }
		// if($("#"+formId+" #endTimeInHrs").val()==''){
		// 	showMessageTheme2(0, "Please select End time(hrs)");
		// 	return false;
		// }
		// if($("#"+formId+" #endTimeInMin").val()==''){
		// 	showMessageTheme2(0, "Please select End time(Min)");
		// 	return false;
		// }
	}
	
	var str = $("#"+formId+" #announceTitle").val();
	if(str.length>100){
		showMessageTheme2(0, "You cannot have more than 100 characters in Subject");
		return false;
	}
	
	if(editor1!=undefined){
		var str = escapeCharacters(editor1.getData());
		if(str==''){
			showMessageTheme2(0, "Please add description ");
			return false;
		}
		// if(str.length>=500){
		// 	showMessageTheme2(0, "You cannot have more than 500 characters in description !");
		// 	return false;
		// }
	}
	
	
	
	
	// if($("#"+formId+" #announceStartDate").val()!='' && $("#"+formId+" #startTimeInHrs").val()!='' && $("#"+formId+" #startTimeInMin").val()!=''){
	// 	var announceDate=$("#"+formId+" #announceStartDate").val();
	// 		announceDate=announceDate.split("-");
	// 	var announcMentDateTime=new Date(announceDate[2]+'/'+announceDate[0]+'/'+announceDate[1]+' '+$("#"+formId+" #startTimeInHrs").val().trim()+':'+$("#"+formId+" #startTimeInMin").val().trim()+':00');
	// 	var currentDate= new Date();
	// 	if(currentDate>announcMentDateTime){
	// 		showMessageTheme2(0, "Please select future time duration");
	// 		return false;
	// 	}
	// 	let isEndChecked = true;//$("#"+formId+" #checkAnnounceEnd").is(':checked');
	// 	if(isEndChecked){}
	// 	else{
	// 		// var announceEndDate=$("#"+formId+" #announceEndDate").val();
	// 		// announceEndDate=announceEndDate.split("-");
	// 		// var announcMentEndDateTime=new Date(announceEndDate[2]+'/'+announceEndDate[0]+'/'+announceEndDate[1]+' '+$("#"+formId+" #endTimeInHrs").val().trim()+':'+$("#"+formId+" #endTimeInMin").val().trim()+':00');
	// 		// if(announcMentDateTime>announcMentEndDateTime){
	// 		// 	showMessageTheme2(0, 'Please select start date must be less then end date');
	// 		// 	return false;
	// 		// }
	// 	}
		
	// }

	
	return true;
}
function submitSchoolAnnounce(formId,moduleId) {
	hideMessageTheme2('');
	if(!validateRequestForSchoolAnnounce(formId)){
		return false;
	}
	var data = {};
	data['userId']=$("#"+formId+" #userId").val();
	data['announceId']=$("#"+formId+" #announceId").val();
	data['enrollType']=$("#"+formId+" #enrollType").select2('val');
	data['announceFor']=$("#"+formId+" #announceFor").val();
	data['standardId']=$("#"+formId+" #standardId").select2('val');
	data['batchId']=$("#"+formId+" #batchId").select2('val');
	data['studentId']=$("#"+formId+" #studentId").select2('val');
	data['schoolId']=$("#"+formId+" #schoolId").val();
	data['subjectId']=$("#"+formId+" #subjectIds").select2('val');
	if($("#" + formId + " #enrollType").val()=='BATCH'){
		data['lmsPlatform']='38,39,40,41';
	}else if($("#" + formId + " #enrollType").val()=='ALL' || $("#" + formId + " #announceFor").val()=='TEACHER'){
		data['lmsPlatform']='37,38,39,40,41';
	}else if($("#" + formId + " #enrollType").val()=='SSP'){
		data['lmsPlatform']='37,40,41';
	}else if($("#" + formId + " #enrollType").val()=='SCHOLARSHIP'){
		data['lmsPlatform']='37,39,40,41';
	}else if($("#" + formId + " #enrollType").val()=='ONE_TO_ONE_FLEX'){
		data['lmsPlatform']='37';
	}else{
		data['lmsPlatform']='37,39,41';
	}
	if($("#" + formId + " #announceFor").val()=='TEACHER'){
		data['lmsPlatform']='37,38,39,40,41';
	}
	data['announceTitle']= $("#"+formId+" #announceTitle").val();
	if($("#" + formId + " #fileupload1Span").text()=='No file chosen...'){
		data['attachment'] = "";
	}else{
		data['attachment'] = $("#" + formId +" #fileupload1Span").text();
	}
	if(editor1!=undefined){
		data['announceRemark']= editor1.getData().trim();
	}
	data['announceStartDate']='';
	data['startTime']=$("#"+formId+" #startTimeInHrs").val()+':'+$("#"+formId+" #startTimeInMin").val()+':00';
	let isEndChecked1 = true;//$("#"+formId+" #checkAnnounceEnd").is(':checked');
		if(isEndChecked1){}
		else{
			// fdata.append('announceEndDate',$("#"+formId+" #announceEndDate").val());
			// fdata.append('endTime',$("#"+formId+" #endTimeInHrs").val()+':'+$("#"+formId+" #endTimeInMin").val()+':00');
		}

	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLForHTML('dashboard','teacher-school-announce-submit'),
		data : JSON.stringify(data),
		dataType : 'json',
		type: "POST",
		// processData: false,
		// contentType: false,
		// enctype: 'multipart/form-data',
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessageTheme2(0, data['message']);
			} else {
				// $('#'+formId+ ' #announceFor').val('').trigger("change");
				$('#announceFor').select2('destroy');
				$('#announceFor').select2({
					theme: 'bootstrap4',
					placeholder: 'Select an option',
					dropdownParent: '#teacherSchoolannounce'
				});

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
				// $('#'+formId)[0].reset();
				resetTeacherSchoolannounce()
				showMessageTheme2(1, data['message']);
				
			}
			return false;
		}
	});
}

function callSubjectNameMultipleList(formId, value, userId,courseProviderId ,userRole, dataType) {
	value = value.toString();
	console.log("Building Subject dropdown", value);
	$.ajax({
			type : "POST",
			contentType : APPLICATION_JSON_VALUE,
			url : getURLForCommon('masters'),
			data : JSON.stringify(getRequestForMaster('formId','SUBJECT-NAME-LIST-BASED-ON-BATCHES',userId,courseProviderId,userRole,dataType, value)),
			dataType : 'json',
			cache : false,
			timeout : 600000,
			async : false,
			success : function(data) {
				if (data['status'] == '0' || data['status'] == '2') {
					showMessageTheme2(0, data['message']);
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
			}
			});
}

function updateSchoolAnnounce(userId,announceId,controllType,moduleId) {
	hideMessageTheme2('');
	
	var fdata = {};
	fdata['userId']=userId;
	fdata['announceId']=announceId;
	fdata['controllType']=controllType;
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLForHTML('dashboard','teacher-school-announce-update'),
		data : JSON.stringify(fdata),
		dataType : 'json',
		//processData: false,
		//contentType: false,
		//enctype: 'multipart/form-data',
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessageTheme2(0, data['message']);
			} else {
				showMessageTheme2(1, data['message']);
				setTimeout(function (){callDashboardPageSchool(moduleId,'school-announce-list');},1000);
			}
			return false;
		}
	});
}
function callAnnounceReplyList(announceId,moduleId) {
	hideMessageTheme2('');
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
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
        			showMessageTheme2(0, stringMessage[1]);
        		} else {
        			$('#announceReplyListContent').html(htmlContent);
        		}
        		return false;
			}
		}
	});
}

function courseProviderList(formId, elementId) {
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLForCommon('masters'),
		data : JSON.stringify(getRequestForMaster('formId','ALL-COURSE-PROVIDER-LIST', 'courseProList')),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		async : false,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessageTheme2(0, data['message']);
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
