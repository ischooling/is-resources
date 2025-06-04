function advanceLMSUserSearchReset(formId){
	$('#' + formId)[0].reset();
	$("#"+formId+" #standardId").val(" ").trigger('change');
}

function advanceLMSUSerSearch(formId,moduleId, userId, role){
	checkTextBox(formId);
	var argument='?moduleId='+moduleId+'&schoolId='+SCHOOL_ID+'&'+decodeURIComponent($('#'+formId).serialize());
	elementId='manageLMSUserList';
	$.ajax({
		type : "GET",
		contentType : "application/json",
		url : CONTEXT_PATH+UNIQUEUUID+"/dashboard/show-student-lms-list-1"+argument,
		dataType : 'json',
		success : function(data) {
			$('#'+elementId+' > tbody').html('');
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if(data['status'] == '3'){
					redirectLoginPage();
				}else{
					if(tt=='theme1'){
						showMessage(false, data['message']);
					}else{
						showMessageTheme2(0, data['message'],'',true);
					}
				}
			} else {
				$('#manageLMSUserContentDiv').html(manageLMSUserTable(elementId,role));
				$('#'+elementId+' > tbody').append(getManageLMSUserTableBody(data.sessions, userId, role));
				var isDataTable = $.fn.dataTable.isDataTable('#'+elementId);
				if(isDataTable){
					$('#'+elementId).dataTable().fnDestroy();
				}
				$('#'+elementId).DataTable();
			}
			return false;
		}
	});
	bindHover();
}

function advanceLMSUSerSearchPost(formId,moduleId, userId, role){
	elementId='manageLMSUserList';
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : CONTEXT_PATH+UNIQUEUUID+"/dashboard/show-student-lms-list-post",
		data : JSON.stringify(bodyCreate(formId, moduleId, SCHOOL_ID)),
		dataType : 'json',
		success : function(data) {
			$('#'+elementId+' > tbody').html('');
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if(data['status'] == '3'){
					redirectLoginPage();
				}else{
					if(tt=='theme1'){
						showMessage(false, data['message']);
					}else{
						showMessageTheme2(0, data['message'],'',true);
					}
				}
			} else {
				$('#manageLMSUserContentDiv').html(manageLMSUserTable(elementId,role));
				$('#'+elementId+' > tbody').append(getManageLMSUserTableBody(data.sessions, userId, role));
				var isDataTable = $.fn.dataTable.isDataTable('#'+elementId);
				if(isDataTable){
					$('#'+elementId).dataTable().fnDestroy();
				}
				$('#'+elementId).DataTable();
			}
			return false;
		}
	});
	bindHover();
}

function bodyCreate(formId,moduleId, schoolId, UNIQUEUUID){
	var request = {};
	request['moduleId'] = moduleId;
	request['schoolId'] = schoolId;
	request['pageSize'] = $("#"+formId+" #pageSize").val();
	request['activeSession'] = $("#"+formId+" #activeSession").val();
	request['academicYearStartDate'] = $("#"+formId+" #academicYearStartDate").val().trim();
	request['academicYearEndDate'] = $("#"+formId+" #academicYearEndDate").val().trim();
	request['learningProgram'] = $("#"+formId+" #learningProgram").val();
	request['standardId'] = $("#"+formId+" #standardId").val();
	request['courseProviderId'] = $("#"+formId+" #courseProviderId").val();
	request['studentName'] = $("#"+formId+" #studentName").val().trim();
	request['studentEmail'] = $("#"+formId+" #studentEmail").val().trim();
	request['academicYearStatus'] = $("#"+formId+" #academicYearStatus").val();
	request['lmsStatus'] = $("#"+formId+" #lmsStatus").val();
	request['profileStatus'] = $("#"+formId+" #profileStatus").val();
	request['parentDetailsAdded'] = $("#"+formId+" #parentDetailsAdded").val();
	request['enrollmentType'] = $("#"+formId+" #enrollmentType").val();
	request['ongoingStudents'] = $("#"+formId+" #ongoingStudents").val();
	request['studentStringId'] = $("#"+formId+" #studentId").val();
	request['sortBy'] = $("#"+formId+" #sortBy").val();
	request['userId'] = USER_ID;
	return request;

}

function callLMSContentByUserId(parentId, parentUserId, parentLmsId,moduleId){
	console.log('callLMSContentByUserId ManagerUserList page')
	var data={}
	var data={};
	data['parentId']=parentId;
	data['parentUserId']=parentUserId;
	data['parentLmsId']=parentLmsId;
	data['moduleId']=moduleId;
	data['sessionUserId']=USER_ID;
	$.ajax({
		type : "POST",
		contentType:"application/json",
		url : getURLForHTML('dashboard','parent-view-lms-content'),
		data : JSON.stringify(data),
		dataType : 'html',
		success : function(htmlContent) {
			if(htmlContent!=""){
            	var stringMessage = [];
            	stringMessage = htmlContent.split("|");
        		if(stringMessage[0] == "FAILED" || stringMessage[0] == "EXCEPTION" || stringMessage[0] == "SESSIONOUT"){
        			if(stringMessage[0] == "SESSIONOUT"){
        				redirectLoginPage();
        			}else{
        				showMessage(true, stringMessage[1]);
        			}
        		} else {
        			$('#viewStudentLmsContent').html(htmlContent)
        		}
			}
		}
	});
	$('#lmsUserForm #userId1').val(userId);
}

function studentListLmsCreatedContent(elementId, argument, userRole){
	$('#'+elementId).DataTable( {
        "processing": true,
        "serverSide": true,
        "searching": true,
        "pagingType":"full",
        "pageLength": 10,
        "ajax": {
            "url": CONTEXT_PATH+UNIQUEUUID+"/"+"dashboard/show-student-lms-list-1"+argument,
            "data": function ( data ) {
            	//console.log('data '+data)
            }
        },
         "fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
        	//$('tr').addClass(' success:' );
        	$('th').css('color','#464646' );
        },
        "columns": [
	         { "data": "sno", "name" : "sno", "title" : "S.No" },
	         { "data": "courseProviderName", "name" : "courseProviderName" , "title" : "LMS Platform"},
	         { "data": "name", "name" : "name" , "title" : "Student Name"},
	         { "data": "lmsUserName", "name" : "lmsUserName" , "title" : "LMS User Name"},
	         { "data": "userName", "name" : "userName" , "title" : "User Name"},
	         { "data": "gradeName", "name" : "gradeName" , "title" : "Grade"},
	         { "data": "userProfileStatus", "name" : "userStatus", "title" : "SMS/LMS Profile Status"},
	         { "data": "semesterStartDate", "name" : "semesterStartDate" , "title" : "Student Academic Year Start Date"},
	         { "data": "registrationType", "name" : "registrationType" , "title" : "Registration Type"},
	         { "data": "action", "name" : "action1" , "title" : "Action"},
	      // { "data": "action", "name" : "action" , "title" : "Assign Teacher"},
         ]
	});
	if(userRole=='SCHOOL'){
		$('#'+elementId).dataTable().fnSetColumnVis(1,false);
		//$('#'+elementId).dataTable().fnSetColumnVis(4,false);
	}
	$('#'+elementId).dataTable().fnSetFilteringEnterPress();
}