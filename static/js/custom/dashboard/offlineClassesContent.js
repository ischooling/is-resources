function getOfflineClassTableHeader(role){
	var html='<th>S.No.</th><th>Class URL</th><th>Class Type/User Name/Email</th><th>Meeting Vendor/Meeting ID/Password/Subject</th><th>Host/Alt Host</th>';
	html+='<th>Action</th>';
	return '<thead><tr>'+html+'</tr></thead><tbody></tbody>';
}

function getOfflineClassTableBody(result, userId, role){
	var html='';
	$.each(result, function(k, v) {
		var action=''
		if(v.status=='Deleted'){
			action=v.status;
		}else{
			action='<div class="btn-group">'
			+'<button type="button" class="btn btn-danger dropdown-toggle  btn-sm" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-toggle="tooltip" title="Action" style="background-color:#001173 !important;border-color:#001173;box-shadow:none;">'
				+'<i class="fa fa-ellipsis-v"></i>'
			+'</button>'
			+'<div class="dropdown-menu">'
				+'<a href="javascript:void(0);" onclick="showWarningMessage(\'Are you sure you want to delete?\',\'deleteOfflineClasses('+v.offlineId+')\');" class="dropdown-item" onclick="">Delete</a>'
			+'</div>'
		}
	+'</div>';
		var sno = parseInt(k)+1;
		// var zoomCommand=getZoomCommandContent(v.aggrigatorStatus,v.aggregatorId,v.userId,v.userKey,v.groupId);
		var url='';
		if(v.meetingVendor=='ZOOM'){
			url+='<button value="'+v.joinMeetingUrl+'" id="start_url_'+sno+'j"  onclick="copyURL(\'start_url_'+sno+'j\', \'start-copy-msg-'+sno+'j\')" class="btn btn-primary btn-sm">Copy Join URL</button> <b class="start-copy-msg-'+sno+'j"></b><br/>';
		}else{
			url+='<button value="'+v.startMeetingUrl+'" id="start_url_'+sno+'"  onclick="copyURL(\'start_url_'+sno+'\', \'start-copy-msg-'+sno+'\')" class="btn btn-primary btn-sm">Copy URL</button> <b class="start-copy-msg-'+sno+'"></b><br/>';
		}
		if('TEACHER'==role){
			url+='<button id="sms_url_'+sno+'" onclick="joinOfflineMeeting('+v.userId+', '+v.offlineId+')" class="btn btn-primary btn-sm">Start Class</button>';
		}else{
			url+='<button value="'+v.smsUrl+'" id="start_url_'+sno+'S"  onclick="copyURL(\'start_url_'+sno+'S\', \'start-copy-msg-'+sno+'S\')" class="btn btn-primary btn-sm">Copy Start Class</button> <b class="start-copy-msg-'+sno+'S"></b><br/>';
		}
		html+=
			'<tr id="offlineClasses'+v.offlineId+'">'
				+'<td>'+sno+'</td>'
				+'<td>'+url+'</td>'
				+'<td>'+v.classType+'<br>'+v.userName+'<br>'+v.officialEmail+'</td>'
				+'<td>'+v.meetingVendor+'<br/>'+v.meetingId+'<br/>'+v.meetingPassword+'<br/>'+v.meetingSubject+'</td>'
				+'<td>'+v.hostEmail+'<br/>'+v.alternativeHosts+'</td>'
				+'<td id="actionOfflineClasses'+v.offlineId+'">'+action+'</td>'
			'</tr>';
	});
	return html;
}

function getOfflineClassFilter(roleAndModule, schoolId, userId, role){
	var html=
	'<div class="col-md-12">'
			+'<div class="filter-wrapper">'
				+'<div class="full mb-4">'
					+'<button class="btn btn-sm btn-primary float-right show-filter" onClick="showOfflineClassModel(\'offlineClassAdd\', \'offlineClassesModal\')"><i class="fa fa-plus"></i>&nbsp;Add Links</button>'
					+'<button class="btn btn-sm btn-primary float-right show-filter" onClick="toggleFilter(\'offlineClassFilter\')"><i class="fa fa-filter"></i>&nbsp;Filter</button>'
				+'</div>'
				+'<form name="offlineClassFilter" id="offlineClassFilter" action="javascript:void(0)">'
					+'<div class="filter-fields row">';
						html+=
						'<div class="col-md-4 col-sm-4 col-xs-12">'
							+'<label>Select Teacher</label>'
							+'<select name="userId" id="userId" class="form-control">'
								+getLmsPlatformContent(schoolId)
							+'</select>'
						+'</div>'
						+'<div class="col-md-2 col-sm-2 col-xs-12">'
							+'<label>Class Type</label>'
							+'<select name="classType" id="classType" class="form-control">'
								+'<option value="">Select Class Type</option>'
								+'<option value="G">Group Learning</option>'
								+'<option value="O">One-to-One Learning</option>'
								+'<option value="R">Recurring Class</option>'
								+'<option value="A">Admin Task</option>'
							+'</select>'
						+'</div>'
						+'<div class="col-md-2 col-sm-2 col-xs-12">'
							+'<label>Meeting ID</label>'
							+'<input type="text" name="meetingId" id="meetingId" class="form-control" value="" maxlength="100">'
						+'</div>'
						+'<div class="col-md-2 col-sm-2 col-xs-12">'
							+'<label>Sort By</label>'
							+'<select name="sortBy" id="sortBy" class="form-control">'
								+'<option value="DESC">Descending</option>'
								+'<option value="ASC">Ascending</option>'
							+'</select>'
						+'</div>'
						+'<div class="col-md-2 col-sm-2 col-xs-12">'
							+'<label>Page Size</label>'
							+'<input type="text" name="pageSize" id="pageSize" class="form-control" value="25"/>'
						+'</div>'
						+'<div class="col-md-12 col-sm-12 col-xs-12 mt-2">'
							+'<button class="btn btn-sm btn-primary float-right" onclick="offlineClassSearchReset(\'offlineClassFilter\')"><i class="fa fa-refresh"></i>&nbsp;Reset</button>'
							+'<button class="btn btn-sm btn-primary float-right" onclick="advanceofflineClassSearch(\'offlineClassFilter\',\'offlineClassesTable\',\''+roleAndModule.moduleId+'\','+userId+',\''+role+'\');"><i class="fa fa-check"></i>&nbsp;Apply</button>'
						+'</div>'
					+'</div>'
				+'</form>'
			+'</div>'
		+'</div>'
	return html;
}

function getOfflineClassContent(title, roleAndModule, schoolId, userId, role){
	var html=
		'<div class="row m-0">'
			+'<div class="col-md-12 col-lg-12 col-sm-12">'
				+'<div class="card">'
					+'<div class="card-header card-header-primary">'
						+'<h4 class="card-title">'+title+'</h4>'
					+'</div>'
					+'<div class="card-body">'
						+'<div class="row">'
							+'<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">';

						html+='</div>'
						+'</div>'
						+'<div class="row">'
							+'<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">'
								+getOfflineClassFilter(roleAndModule,schoolId,userId,role)
							+'</div>'
						+'</div>'
						+'<br>'
						+'<div class="col-md-12">'
							+'<div class="row">'
								+'<div style="width:100%;">'
									+'<div class="tab-content clearfix">'
										+'<div class="row">'
											+'<div id="offlineMeetingContentDiv" style="width:100%;display:inline-block">'
											+'</div>'
											+'<div id="studentSemesterStartDateEntryHTML1">'
											+'</div>'
										+'</div>'
									+'</div>'
								+'</div>'
							+'</div>'
						+'</div>'
					+'</div>'
				+'</div>'
			+'</div>'
		+'</div>'
		+offlineClassContent();
	return html;
}

function offlineClassTable(tableId, role){
	html='<table id="'+tableId+'" class="table table-bordered responsive dt-responsive" style="width:100%;">'
		+getOfflineClassTableHeader(role)
	+'</table><br/>';
	return html;
}

function offlineClassContent(){
	var html='<div class="modal fade" id="offlineClassesModal" data-backdrop="static" role="dialog">'
		+'<div class="modal-dialog modal-lg">'
			+'<div class="modal-content">'
				+'<div class="modal-header">'
					+'<h4 class="modal-title">Add Links</h4>'
					+'<button type="button" class="close" data-dismiss="modal" style="color: #fff;">×</button>'
				+'</div>'
				+'<form id="offlineClassAdd" name="offlineClassAdd">'
					+'<div class="col-lg-12 col-md-12 col-sm-12 col-12 col-xs-12 mb-4">'
						+'<div class="row">'
							+'<div class="col-lg-4 col-md-4 col-sm-6 col-12 col-xs-12">'
								+'<div class="full"><label title="mandatory">Select Teacher Name </label><sup>*<sup></div>'
								+'<select class="form-control teacher-name-dropdown" id="userIdOfflineClass" name="userIdOfflineClass" onchange="showOfflineAddContent();">'
								+'</select>'
							+'</div>'
						+'</div>'
					+'</div>'
					+'<div class="offline-classes-container mt-4" style="display:none">'
						+'<div class="col-lg-12 col-md-12 col-sm-12 col-12 col-xs-12 offline-classes-wrapper">'
							+'<div class="row clone-row-offline-classes mb-4">'
								+'<div class="col-lg-5 col-md-5 col-sm-5 col-12 col-xs-12">'
									+'<div class="full"><label title="mandatory">Select Class Type </label><sup>*<sup></div>'
									+'<select class="form-control class-type-dorpdown" name="" id="class_Type_1" title="Select Class Type">'
										+'<option selected disabled>Select Class Type</option>'
										+'<option value="G">Group Learning</option>'
										+'<option value="O">One-to-One Learning</option>'
										+'<option value="R">Recurring Class</option>'
										+'<option value="A">Admin Task</option>'
									+'</select>'
								+'</div>'
								+'<div class="col-lg-5 col-md-5 col-sm-5 col-12 col-xs-12">'
									+'<div class="full"><label title="mandatory">Enter Meeting ID </label><sup>*<sup></div>'
									+'<div class="full">'
										+'<input type="text" class="form-control meeting-id pr-4" value="" id="meetingId_1" title="Enter Meeting Valid ID"/>'
										// +'<span class="meeting-id-check">'
										// 	+'<i class="fa fa-check text-success fa-2x"></i>'
										// 	+'<i class="fa fa-times text-danger fa-2x"></i>'
										// +'</span>'
									+'</div>'
								+'</div>'
								+'<div class="col-lg-2 col-md-2 col-sm-2 col-12 col-xs-12">'
									+'<button class="btn btn-lg btn-danger float-right delete-row-btn" onclick="deleteRow(this)" style="display:none"><i class="fa fa-times"></i>&nbsp;&nbsp;Delete</button>'
								+'</div>'
							+'</div>'
						+'</div>'
						+'<div class="col-lg-12 col-md-12 col-sm-12 col-12 col-xs-12 addMoreRowBtn">'
							+'<button class="btn btn-lg btn-primary float-right" onclick="return cloneRowOfflineClasses();"><i class="fa fa-plus"></i>&nbsp;&nbsp;Add More</button>'
							+'<button class="btn btn-lg btn-primary float-right" onclick="return saveOfflineClasses(\'offlineClassAdd\', \'offlineClassesModal\');"><i class="fa fa-plus"></i>&nbsp;&nbsp;Save</button>'
						+'</div>'
					+'</div>'
				+'</form>'
			+'</div>'
		+'</div>'
	+'</div>';
	return html;
}

function offlineClassUploaded(formId, elementId, status){
	var html=
		'<span class="meeting-id-check">'
			+'<i class="fa '+(status=='1'?"fa-check text-success":"fa-times text-danger")+' fa-2x"></i>'
		+'</span>'
	$('#'+formId+' #'+elementId).parent().append(html);
}