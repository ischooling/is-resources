function callUserActivity(formId, userId, showActivityLog, showLoginHistoryLog,roleModuleId) {
	console.log('theme2');
	hideMessage('');
	if(roleModuleId==undefined){
		roleModuleId=userId;
	}
	var data={};
	data['userId']=userId;
	data['sessionUserId']=USER_ID;
	data['showActivityLog']=showActivityLog;
	data['showLoginHistoryLog']=showLoginHistoryLog;
	data['moduleId']=roleModuleId;
	data['themetype']='theme2';
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForHTML('dashboard','user-activity'),
		data : JSON.stringify(data),
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
        			$('#userActivityHTML').html(htmlContent);
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
function callUserActivityLogs(callFor,roleModuleId){
	var userId=$('#userActivityUserId').html();
	if(roleModuleId==undefined){
		roleModuleId=$('#userActivityUserId').html();
	}
	$('#activityLogTab').removeClass('active');
	//$('#activityLogTab').removeClass('inactive-tab');
	$('#activityHistoryTab').removeClass('active');
	//$('#activityHistoryTab').removeClass('inactive-tab');
	if(callFor=='activity-logs'){
		$('#activityLogTab').addClass('active');
		//$('#activityHistoryTab').addClass('inactive-tab');
		callForDashboardData('formIdIfAny','remarks-history-content?sessionUserId='+USER_ID+'&userId='+userId+'&moduleId='+roleModuleId+'&tt=theme2','userActivityContent');
	}else if(callFor=='login-history'){
		//$('#activityLogTab').addClass('inactive-tab');
		$('#activityHistoryTab').addClass('active');
		callForDashboardData('formIdIfAny','attendance-content?userId='+userId+'&type=modal&moduleId='+roleModuleId+'&tt=theme2', 'userActivityContent');
	}
}
function callActivityByEntityIdAndName(entityId, entityName, title){
	callForCommonComments('commonCommentsLogsForm', 'add', entityId, entityName, title);
}