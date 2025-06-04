function validateRequestForSDSSync(formId, studentTeacherMappingId, studentId, teacherId, subjectId, sdsLogId) {
	return true;
}

function getRequestForSDSSync(formId, studentTeacherMappingId, studentId, teacherId, subjectId, sdsLogId) {
	var  SDSSyncRequest= {};
	var studentTeacherMappingIds=[];
	var mapping={};
	mapping['studentTeacherMappingId']=studentTeacherMappingId;
	mapping['teacherId']=teacherId;
	mapping['studentId']=studentId;
	mapping['subjectId']=subjectId;
	studentTeacherMappingIds.push(mapping);
	SDSSyncRequest['studentTeacherMappingIds'] = studentTeacherMappingIds;
	SDSSyncRequest['schoolId']=SCHOOL_ID;
	return SDSSyncRequest;
}

function callSDSSync(formId, studentTeacherMappingId, studentId, teacherId, subjectId, sdsLogId) {
	//hideMessage('');
	customLoader(true);
	if (!validateRequestForSDSSync(formId, studentTeacherMappingId, studentId, teacherId, subjectId, sdsLogId)) {
		customLoader(false);
		return false;
	}
	
	$.ajax({
		global : false,
		type : "POST",
		contentType : "application/json",
		url : getURLFor('sds-sync','enrollment'),
		data : JSON.stringify(getRequestForSDSSync(formId, studentTeacherMappingId, studentId, teacherId, subjectId, sdsLogId)),
		dataType : 'json',
		timeout : 900000,
		success : function(data) {
			customLoader(false);
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				showMessage(true, data['message']);
				if(data['status'] == '3'){
					redirectLoginPage();
				}
			} else {
				showMessage(true, data['message']);
				$('#'+sdsLogId).html(buildLog(data.response));
			}
			return false;
		},
		error : function(e) {
			if (checkonlineOfflineStatus()) {
				return;
			}else{
				showMessage(0, TECHNICAL_GLITCH);
			}
			customLoader(false);
		}
	});
}

function buildLog(response){
	var sdsLogContent='';
	$.each(response, function(k, v) {
		sdsLogContent+='Team Name: <strong>'+v.teamName+'</strong><br>';
		sdsLogContent+='Team Status: <strong>'+v.teamStatus+'</strong><br>';
		sdsLogContent+='Last Team Sync Date &amp; Time: <strong>'+v.teamUpdatedDate+'</strong><br>';
		sdsLogContent+='Last Team Sync By: <strong>'+v.teamUpdatedByName+'</strong>';
		sdsLogContent+='Sync Status: <strong>'+v.allSync+'</strong>';
	});
	return sdsLogContent;
}