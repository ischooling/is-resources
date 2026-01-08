

function getAutoWeeklyProgressList(moduleId, startLimit, activeSession) {
 hideMessageTheme2('');
 
 $.ajax({
	 type : "POST",
	 contentType : APPLICATION_JSON_VALUE,
	 url : getURLForHTML('dashboard','auto-weekly-progress-report-data'),
	 data : JSON.stringify(getRequestForAutoWeeklyProgressList(moduleId, startLimit, activeSession)),
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
			var html=getAutoStudentProgressListHtml(data.swpr);
			$("#autoReportLogBody").html(html);
			// //adminManageUserListpaging
			 var htmlpage=dataProgressListPagging(data);
            $(".autoProgressListpaging").html(htmlpage);

			 
		 }
		 return false;
	 }
 });
}
function getRequestForAutoWeeklyProgressList(moduleId, startLimit, activeSession){
	var data = {};
  	data['moduleId'] = moduleId;
  	data['activeSession'] = activeSession;
  	data['userId'] = USER_ID;
  	data['currentPage']=startLimit;
  	data['recordsPerPage']=10;
	return data;
}

function getAutoStudentProgressListHtml(swprsList){
	var html='';
	if(swprsList.length>0){
		for (let iu = 0; iu < swprsList.length; iu++) {
			const swprss = swprsList[iu];
			html+=`<tr>
				<td class="text-center">${swprss.srNo}</td>
				<td>${swprss.daysType == 0?'':swprss.daysType} ${swprss.daysType == 0?'Custom':'days'}
				(${swprss.reportStartDate} - ${swprss.reportEndDate})</td>
				<td>${swprss.createdDate}</td>
				<td>${swprss.userName}</td>
				<td><a href="javascript:void(0);" class="btn btn-success btn-sm " onclick="callOpenStudentWeeklyReportPopup('${swprss.weeklyReportId}','${USER_ID}','${UNIQUEUUID}','${swprss.courseProviderId!=undefined?swprss.courseProviderId:''}','${swprss.standardId!=undefined?swprss.standardId:''}','${swprss.cron}','view',0);"><i class="fa fa-view"></i>&nbsp;View</a> <a href="javascript:void(0);" class="btn btn-primary btn-sm " onclick="callOpenStudentWeeklyReportPopup('${swprss.weeklyReportId}','${USER_ID}','${UNIQUEUUID}','${swprss.courseProviderId!=undefined?swprss.courseProviderId:''}','${swprss.standardId!=undefined?swprss.standardId:''}','${swprss.cron}','failed',0);"><i class="fa fa-view"></i>&nbsp;Failed</a></td>
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
	hideMessageTheme2('');
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
