function validateAndStartTeachersAdminTask(formId,moduleId, userId, role){
	var argument='?moduleId='+moduleId+'&schoolId='+SCHOOL_ID+'&userId='+userId;
	var data={};
          data['moduleId']=moduleId;
          data['schoolId']=SCHOOL_ID;
          data['userId']=USER_ID;
	$.ajax({
		type : "POST",
        contentType : "application/json",
		//url : CONTEXT_PATH+UNIQUEUUID+"/dashboard/start-admin-task"+argument,
		url : getURLForHTML('dashboard','start-admin-task'),
		dataType : 'json',
		data : JSON.stringify(data),
		success : function(data) {
			//$('#'+elementId+' > tbody').html('');
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if(data['status'] == '3'){
					redirectLoginPage();data['reason']
				}else{
					//code to show modal failed
					$("body").append(startTaskModal(data['reason']));
					$("#startTaskModal .modal-body").html(modalBodyContent(data['reason']));
				    $("#startTaskModal .modal-footer").html(modalFooterConent(data['reason']));
					$("#startTaskModal").modal("show");
				}
			} else {
				//code to show modal with success and pr0ceed
				$("body").append(startTaskModal(data['reason']));
				$("#startTaskModal .modal-body").html(modalBodyContent(data['reason']));
				$("#startTaskModal .modal-footer").html(modalFooterConent(data['reason']));
				$("#startTaskModal").modal("show");
			}
			return false;
		}
	});
	bindHover();

}

function proceedForStartAdminTask(meetingVendor){
	var requestUrl=BASE_URL+CONTEXT_PATH+SCHOOL_UUID+'/dashboard/proceed-to-admin-task/'+UNIQUEUUID+'/'+meetingVendor;
	$.ajax({
		type : "GET",
		contentType : "application/json",
		url : requestUrl,
		dataType : 'json',
		async : true,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if (data['status'] == '3') {
					redirectLoginPage();
				} else {
					showMessage(false, data['message']);
				}
			} else {
				$('#classJoinInSameWindowModal').remove();
				$("body").append(calendarMeetingLinkValidate());
				$("#startTaskModal").modal("hide");
				$('#classJoinInSameWindowModal').modal({backdrop: 'static', keyboard: false});
				$('#classJoinInSameWindowBody').html(AdminTaskModalWarnings(data));
				window.setTimeout(function () { $('#classJoinInSameWindowModal').modal('hide');}, data['meetingJoinModalHideMin']*10000);
				window.open(data.canJoindateStart,"_blank");
			}
		}
	});
}


function prepareClassJoinRequest(){
	var lensExternalUserRequest = {};
	lensExternalUserRequest['schoolId'] = SCHOOL_ID;
	lensExternalUserRequest['profile'] = 'teacher';
	return lensExternalUserRequest;
}

function advanceTeacherAdminTasksSearch(formId,moduleId, userId, role){
	if(role!='TEACHER'){
		if($('#'+formId+' #userId').val()=='' || $('#'+formId+' #userId').val()==0){
			showMessage(false,'Please Select Teacher.');
			return false;
		}
	}
	//var argument='?moduleId='+moduleId+'&schoolId='+SCHOOL_ID+'&'+$('#'+formId).serialize();
	elementId='manageAdminTasksList';


	var data={};
          data['moduleId']=moduleId;
		  data['taskStartDate']=$("#"+formId+" #taskStartDate").val();
		  data['taskEndDate']=$("#"+formId+" #taskEndDate").val();
		  data['sortBy']=$("#"+formId+" #sortBy").val();
		  data['pageSize']=$("#"+formId+" #pageSize").val();
          data['schoolId']=SCHOOL_ID;
          data['userId']=$('#'+formId+' #userId').val();

		$.ajax({
		type : "POST",
		contentType : "application/json",
		//url : CONTEXT_PATH+UNIQUEUUID+"/dashboard/show-admin-task-list"+argument,
		url : getURLForHTML('dashboard','show-admin-task-list'),
		data : JSON.stringify(data),
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
				$('#manageLMSUserContentDiv').html(manageAdminTasksTable(elementId,role,data.userTimezone));
				$('#'+elementId+' > tbody').append(getManageAdminTasksTableBody(data.sessions, userId, role));
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

function callLMSContentByUserId(parentId, parentUserId, parentLmsId,moduleId){
	console.log('callLMSContentByUserId ManagerUserList page')
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