function getDeletedUserList(formId, moduleId, startLimit) {
	if(!getSession()){
		redirectLoginPage();
		return false;
	}
 hideMessageTheme2('');
 $.ajax({
	 type : "POST",
	 contentType : APPLICATION_JSON_VALUE,
	 url : getURLForHTML('dashboard','deleted-user-list'),
	 data : JSON.stringify(getRequestForDeletedUserList(formId, moduleId, startLimit)),
	 dataType : 'json',
	 cache : false,
	 timeout : 600000,
	 success : function(data) {
		console.log(data);
		 if (data['status'] == '0' || data['status'] == '2') {
			 showMessageTheme2(0, data['message'],'',true);
		 } else {
			 //showMessageTheme2(1, data['message'],'',true);
			//  setTimeout(function(){
			// 	 location.reload();
			//  }, 1500);
			var html=getDeletedUserListHtml(data.deletedUserList,data.currentPage);
			$("#deletedUserListbody").html(html);
			//deletedUserListpaging
            var htmlpage=dataDeletedUserPagging(data);
            $("#deletedUserListpaging").html(htmlpage);

			 
		 }
		 return false;
	 }
 });
}

function getDeletedUserListByTextSearch(formId, moduleId, startLimit) {
hideMessageTheme2('');

$.ajax({
	type : "POST",
	contentType : APPLICATION_JSON_VALUE,
	url : getURLForHTML('dashboard','deleted-user-list-by-text-search'),
	data : JSON.stringify(getRequestForDeletedUserList(formId, moduleId, startLimit)),
	dataType : 'json',
	cache : false,
	timeout : 600000,
	success : function(data) {
		console.log(data);
		if (data['status'] == '0' || data['status'] == '2') {
			showMessageTheme2(0, data['message'],'',true);
		} else {
			//showMessageTheme2(1, data['message'],'',true);
			//  setTimeout(function(){
			// 	 location.reload();
			//  }, 1500);
			var html=getDeletedUserListHtml(data.deletedUserList,data.currentPage);
			$("#deletedUserListbody").html(html);
			//deletedUserListpaging
			var htmlpage=dataDeletedUserPagging(data);
			$("#deletedUserListpaging").html(htmlpage);
		}
		return false;
	}
});
}

function getRequestForDeletedUserList(formId, moduleId, startLimit){
	var deletedRequestBody = {};
  	deletedRequestBody['moduleId'] = moduleId;
  	deletedRequestBody['emailId'] = $("#"+formId+" #emailId").val();
	deletedRequestBody['userName'] = $("#"+formId+" #userName").val();
	deletedRequestBody['roleId'] = $("#"+formId+" #roleUser").val();
  	deletedRequestBody['userId'] = USER_ID;
  	deletedRequestBody['currentPage']=startLimit;
  	deletedRequestBody['recordsPerPage']=$("#"+formId+" #pageSize").val();
	deletedRequestBody['deleteUserByTextSearch']=$("#deleteUserSearch").val();
	return deletedRequestBody;
}

function getDeletedUserListHtml(deletedUserList,currentPage){
	var html='';
	if(deletedUserList.length>0){
		for (let iu = 0; iu < deletedUserList.length; iu++) {
			const deleteUserInfo = deletedUserList[iu];
			html+=`<tr>	
                <td>${((currentPage-1)*10)+(iu + 1)}</td>
                <td>${deleteUserInfo.roleType}</td>
                <td>${deleteUserInfo.emailId}</td>
                <td>${deleteUserInfo.studentStringId}</td>
                <td>${deleteUserInfo.userName}</td>
                <td style="text-align:center;">
					<a href="javascript:void(0);" class="btn btn-danger  btn-sm"
						onclick="showWarningMessage('Are you sure you want to delete?', 'deleteAllUserData(${deleteUserInfo.userId}, ${deleteUserInfo.schoolId}, ${moduleId})');">
						Delete&nbsp;<i class="fa fa-trash"></i>
					</a>
				</td>
            </tr>`;
		}
	}
	return html;
}

function callManageLmsPasswordModal(userId){
		var data={};
		data['userId']=userId;
		data['moduleId']=ROLE_MODULE.moduleId;
		data['sessionUserId']=USER_ID;
		data['themeType']="theme2";
		$.ajax({
			type : "POST",
			contentType: APPLICATION_JSON_VALUE,
			url : getURLForHTML('dashboard','student-view-lms-content'),
			data : JSON.stringify(data),
			dataType : 'json',
			success : function(data) {
				if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
					if(data['status'] == '3'){
						redirectLoginPage();
					}else{
						showMessageTheme2(0, data['message'],'',true);
					}
				} else {
					var html =getViewLmsCredaintial(data);
					$('#viewStudentLmsContent').html(html);
					$("#studentViewLmsEntryModel").modal("show")
				}
			}
		});
		$('#lmsUserForm #userId1').val(userId);
	}

	function addlmsContent(controlType,studentId,roleModuleId,lmsId) {
	hideMessage('');
	console.log(controlType);
	if(lmsId==undefined){
		lmsId=0;
	}
	var data={};
	data['studentId']=studentId;
	data['controlType']=controlType;
	data['lmsId']=lmsId;
	data['userId']=USER_ID;
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLForHTML('dashboard','add-lms-Content'),
		data : JSON.stringify(data),
		dataType : 'html',
		cache : false,
		success : function(htmlContent) {
			if(htmlContent!=""){
            	var stringMessage = [];
            	stringMessage = htmlContent.split("|");
        		console.log('stringMessage: '+stringMessage);
            	if(stringMessage[0] == "FAILED" || stringMessage[0] == "EXCEPTION" || stringMessage[0] == "SESSIONOUT" ){
            		showMessageTheme2(true, stringMessage[1]);
        		}else{
        			showMessageTheme2(true, stringMessage[1]);
        			if(controlType=="email"){
        				setTimeout(function(){
        					callDashboardPageSchool(roleModuleId,'manage-lms-user');
        				}, 1000);
        			}else if(controlType=="emailUser"){
        				setTimeout(function(){ $('#studentViewLmsEntryModel').modal('hide'); }, 1000)
        			}
        		}
    			return false;
			}
		}
	});
}

function deleteAllUserData(userId, schoolId, roleModuleId) {
    var data = {
        userId: userId,
        schoolId: schoolId
    };

    $.ajax({
        url: getURLForHTML('dashboard', 'delete-user-content'),
        type: 'POST',
        contentType: APPLICATION_JSON_VALUE,
        data: JSON.stringify(data),
		dataType : 'json',
        success: function(response) {
            if (response['status'] == '0' || response['status'] == '2' || response['status'] == '3') {
                if (response['status'] == '3') {
                    redirectLoginPage();
                } else {
                    showMessageTheme2(0, response['message'], '', true);
                }
            } else {
                showMessageTheme2(1, response['message'], '', true);
                setTimeout(function () {
                    callDashboardPageSchool(roleModuleId, "delete-user");
                }, 1000);
            }
        },
        error: function() {
            showMessageTheme2(0, 'Something went wrong while deleting user.', '', true);
        }
    });
}


