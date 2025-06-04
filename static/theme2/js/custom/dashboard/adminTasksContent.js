function getAdminTaskTableHeader(role, userTimezone){
	var html=''
	if(role!='TEACHER'){
		html='<th>S.No.</th>'
			+'<th>Date</th>'
			+'<th>Start Time - End Time ('+userTimezone+')</th>'
			// +'<th>Title</th>'
			+'<th>Duration</th>';
	}else{
		html='<th>S.No.</th>'
			+'<th>Date</th>'
			+'<th>Start Time - End Time</th>'
			// +'<th>Title</th>'
			+'<th>Duration</th>';
			
	}
	return '<thead><tr>'+html+'</tr></thead><tbody></tbody>';
}

function getManageAdminTasksTableBody(result, userId, role){
	var html='';
	$.each(result, function(k, v) {
		action='';
		html+=
			'<tr id="adminTaskTr'+v.sno+'">'
				+'<td>'+v.sno+'</td>'
				+'<td>'+v.joinDate+'</td>'
				+'<td>'+v.startTime+' - '+v.endTime;
				// if(role!='TEACHER'){
				// 	html+=' ('+v.teacherTimezone+')';
				// }
				html+='</td>'
				// +'<td>'+v.title+'</td>'
				+'<td>'+convertMsToTime(v.duration*1000)+'</td>'
			+'</tr>';
	});
	return html;
}

function getAdminTasksFilter(roleAndModule, schoolId, userId, role){
	var html=
	'<div class="row">'
		+'<div class="col-md-12">'
			+'<div class="filter-wrapper">'
			    if(role=='TEACHER'){
					html+='<div id="showMessage" class="font-weight-bold full text-center text-primary"></div>';
				}
				if(role=='TEACHER'){
					html+='<div id="showGuideLine" class="full">'
							+'<h5>Getting Started with Admin Tasks</h5>'
							+'<ol>'
								+'<li>To start an admin task, simply click the "Start Admin Task" button below.</li>'
								+'<li>You will then be redirected to the International Schooling Class App, where your admin task will start automatically.</li>'
								+'<li>This session will be auto-recorded to ensure accurate tracking of your working hours.</li>'
								+'<li>Please note that if you already have a scheduled class in your calendar at that time, you won\'t be able to start the admin task.</li>'
								+'<li>You will not be required to add these admin tasks from the "Add Links" menu.</li>'
							+'</ol>'
						+'</div>';
				}
				html+='<div class="d-block">';
					if(role=='TEACHER'){
						html+='<div class="full text-right"><button id="startAdminTaskButton" class="btn btn-primary px-4 font-size-lg" onclick="validateAndStartTeachersAdminTask(\'adminTaskFilter\',\''+roleAndModule.moduleId+'\','+userId+',\''+role+'\');">Start Admin Task</button></div>';
					}
					if(tt == "theme1"){
						html+='';
					}else{
						html+='<h5>Search below for your past Admin Tasks</h5>';
					}
					
				html+='</div>'
				+'<form name="adminTaskFilter" id="adminTaskFilter" action="javascript:void(0)">';
					{tt == "theme1"? html+='<div class="filter-fields row">':html+='<div class="filter-fields d-flex flex-wrap">'}
						if(role!='TEACHER'){
							html+='<div class="col-md-3 col-sm-6 col-12">'
									+'<label>Select Teacher</label>'
									+'<select name="userId" id="userId" class="form-control">'
									+'</select>'
								+'</div>';
						}
						html+='<div class="col-md-3 col-sm-6 col-12">'
							+'<label> Start Date</label>'
							+'<input type="text" name="taskStartDate" id="taskStartDate" class="form-control filterDates" value="" maxlength="10"/>'
						+'</div>'
						+'<div class="col-md-3 col-sm-6 col-12">'
							+'<label>End Date</label>'
							+'<input type="text" name="taskEndDate" id="taskEndDate" class="form-control filterDates" value="" maxlength="10"/>'
						+'</div>'
						+'<div class="col-md-3 col-sm-3 col-12">'
							+'<label>Sort By</label>'
							+'<select name="sortBy" id="sortBy" class="form-control">'
								+'<option value="DESC">Descending</option>'
								+'<option value="ASC">Ascending</option>'
							+'</select>'
						+'</div>'
						+'<div class="col-md-3 col-sm-6 col-12">'
							+'<label>Page Size</label>'
							+'<input type="text" name="pageSize" id="pageSize" class="form-control" value="25"/>'
						+'</div>'
						+'<div class="col-md-12 col-sm-12 col-12 mt-2">'
							+'<button class="btn btn-sm btn-success float-right" onclick="advanceTeacherAdminTasksSearch(\'adminTaskFilter\',\''+roleAndModule.moduleId+'\','+userId+',\''+role+'\');"><i class="fa fa-check"></i>&nbsp;Apply</button>'
						+'</div>'
					+'</div>'
				+'</form>'
			+'</div>'
		+'</div>'
	+'</div>';
	return html;
}

function callChangePasswordModal(userId){
	var data={};
	data['userId']=userId;
	data['moduleId']=14;
	data['sessionUserId']=USER_ID;
	$.ajax({
		type : "POST",
		contentType: "application/json",
		url : getURLForHTML('dashboard','student-view-lms-content'),
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

function getAdminTaskContent(title, roleAndModule, schoolId, userId, role){
	var html='';
		if(tt != "theme1"){
			html+='<div class="app-page-title">'
					+'<div class="page-title-wrapper">'
						+'<div class="page-title-heading">'
							+'<div class="page-title-icon">'
								+'<i class="pe-7s-note2 icon-gradient bg-mean-fruit"></i>'
							+'</div>'
							+'<div>'+title+'</div>'
						+'</div>'
					+'</div>'
				+'</div>'
		}
		
		html+='<div class="row">'
			+'<div class="col-md-12 col-lg-12 col-sm-12">'
				+'<div class="main-card mb-3 card">';
					if(tt == "theme1"){
						html+='<div class="card-header card-header-primary">'
							+'<h4 class="card-title">'+title+'</h4>'
						+'</div>'
					}
					html+='<div class="card-body">'
						+'<div class="row">'
							+'<div class="col-lg-12 col-md-12 col-sm-12 col-12">';

						html+='</div>'
						+'</div>'
						+'<div class="row">'
							+'<div class="col-lg-12 col-md-12 col-sm-12 col-12">'
								+getAdminTasksFilter(roleAndModule,schoolId,userId,role)
							+'</div>'
						+'</div>'
						+'<br>'
						+'<div class="col-md-12">'
							+'<div class="row">'
								+'<div style="width:100%;">'
									+'<div class="tab-content clearfix">'
										+'<div class="row">'
											+'<div id="manageLMSUserContentDiv" style="width:100%;display:inline-block">'
											+'</div>'
										+'</div>'
									+'</div>'
								+'</div>'
							+'</div>'
						+'</div>'
					+'</div>'
				+'</div>'
			+'</div>'
		+'</div>';
	return html;
}

function manageAdminTasksTable(tableId, role, userTimezone){
	html='<table id="'+tableId+'" class="table table-bordered responsive" style="width:100%;">'
		+getAdminTaskTableHeader(role, userTimezone)
	+'</table><br/>';
	return html;
}
function startTaskModal(reason){
	var html =
		'<div class="modal fade" role="dialog" id="startTaskModal">'
			+'<div class="modal-dialog modal-md">'
				+'<div class="modal-content">'
					+'<div class="modal-header text-white theme-bg py-2">'
						+'<h5 class="modal-title" id="myLargeModalLabel">Start Admin Task</h5>'
						+'<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">'
							+'<span aria-hidden="true">×</span>'
						+'</button>'
					+'</div>'
					+'<div class="modal-body">'
					    
					+'</div>'
					+'<div class="modal-footer">'
						
					+'</div>'
				+'</div>'
			+'</div>'
		+'</div>';
		return html;
}

function modalBodyContent ( reason ){
	var html = "";
	if(reason==null || reason==undefined || reason==''){
		html+='<h6><b>You are about to start an admin task, please note that once the task is started your time will be recorded</b></h6>';
	}else{
		html+='<h6><b>You have classes scheduled at this time.<span>If you still wish to start the admin task, click on the "Proceed" button below,please note that once the task is started your time will be recorded.</span></b></h6><br>'
			+'<table class="table table-bordered">'
				+'<thead>'
					+'<tr>'
						+'<th>Class Details</th>'
					+'</tr>'
				+'</thead>'
				+'<tbody>'
					+'<tr>'
						+'<td>'+reason+'</td>'
					+'</tr>'
				+'</tbody>'
			+'</table>'
		;
	}
	return html;
}
function modalFooterConent(reason){
	var html = "";
	
	html+='<a href="javascript:void(0)" class="btn btn-success float-right" onclick="proceedForStartAdminTask(\'LENS\');">Proceed</a>';
	
	return html;
}