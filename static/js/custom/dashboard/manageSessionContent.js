function getManageSessionTableHeader(role){
	var html=''

	html='<th>S.No.</th><th>LMS Platform</th><th>Student Name/User Name</th><th>Meeting Vendor User</th><th>Grade</th><th>Student ID</th><th>Enroll Status</th>';
	if(SCHOOL_ID==1) {
		html+='<th>Default Enrollment Status</th>';
	}
	html+='<th>Action</th>';
	return '<thead><tr>'+html+'</tr></thead><tbody></tbody>';
}

function getManageSessionTableBody(result, userId, role){
	var html='';
	$.each(result, function(k, v) {
		action='';
		var zoomCommand=getZoomCommandContent('ZOOM', v.aggrigatorStatus,v.aggregatorId,v.userId,v.userKey,v.groupId);
		// var lensCommand=getZoomCommandContent('LENS',v.aggrigatorStatus,v.aggregatorId,v.userId,v.userKey,v.groupId);
		html+=
			'<tr id="sessionSubjectStudent'+v.studentId+'">'
				+'<td>'+v.sno+'</td>'
				+'<td>'+v.courseProviderName+'</td>'
				+'<td>'+v.studentName+'<br/>'+v.userName+'</td>'
				+'<td id="aggrigatorUserId_'+v.userId+'">'+zoomCommand+'</td>'
				+'<td>'+v.gradeName+'</td>'
				+'<td>'+v.rollNo+'</td>'
				+'<td>'+v.enrollStatus+'</td>';
		if(SCHOOL_ID==1) {
			html+='<td>'+v.defaultEnrollmentStatus+'</td>'
		}
		html+=	'<td>'+v.action+'</td>'
			'</tr>';
	});
	return html;
}
function getZoomCommandContent(aggrigatorName, aggrigatorStatus,aggregatorId,aggregatorIdUserId,userKey,groupId){
	// var zoomCommand='';
	// if(aggrigatorStatus=='N'){
	// 	zoomCommand='<a href="javascript:void(0);" onclick="return showAggrigatorStatusPopup(\'Are you sure you want to create the '+aggrigatorName+' user?\', \'create\', '+aggregatorId+', '+aggregatorIdUserId+',\''+aggrigatorName+'\',\''+userKey+'\',\''+groupId+'\');">Create<br></a>'
	// }else if(aggrigatorStatus=='A'){
	// 	if(groupId==''){
	// 		zoomCommand='Invitation sent'
	// 	}else if(groupId!=''){
	// 		zoomCommand='<a href="javascript:void(0);" onclick="return showAggrigatorStatusPopup(\'Are you sure you want to unlink the '+aggrigatorName+' user?\', \'unlink\', '+aggregatorId+', '+aggregatorIdUserId+',\''+aggrigatorName+'\',\''+userKey+'\',\''+groupId+'\');">Unlink<br></a>'
	// 	}
	// }else if(aggrigatorStatus=='U'){
	// 	zoomCommand='<a href="javascript:void(0);" onclick="return showAggrigatorStatusPopup(\'Are you sure you want to create the '+aggrigatorName+' user?\', \'active\', '+aggregatorId+', '+aggregatorIdUserId+',\''+aggrigatorName+'\',\''+userKey+'\',\''+groupId+'\');">Create<br></a>'
	// }
	return aggrigatorName;//+' '+zoomCommand;
}

function getManageSessionFilter(roleAndModule, schoolId, userId, role){
	var html=
	'<div class="col-md-12">'
			+'<div class="filter-wrapper">'
				+'<div class="full">'
				+'<button class="btn btn-sm btn-primary float-right show-filter" onClick="toggleFilter(\'lmsStudentFilter\')"><i class="fa fa-filter"></i>&nbsp;Filter</button>'
				+'</div>'
				+'<form name="lmsStudentFilter" id="lmsStudentFilter" action="javascript:void(0)">'
					+'<div class="filter-fields row">';
						html+=	'<div class="col-md-3 col-sm-6 col-xs-12">'
								+'<label> Start Date</label>'
								+'<input type="text" name="academicYearStartDate" id="academicYearStartDate" class="form-control filterDates" value="" maxlength="10"/>'
								+'</div>'
								+'<div class="col-md-3 col-sm-6 col-xs-12">'
								+'<label>End Date</label>'
								+'<input type="text" name="academicYearEndDate" id="academicYearEndDate" class="form-control filterDates" value="" maxlength="10"/>'
								+'</div>';
						html+='<div class="col-md-3 col-sm-3 col-xs-12">'
										+'<label>Select Learning Program</label>'
										+'<select name="enrollmentType" id="enrollmentType" class="form-control">'
											+'<option value="">Select Learning Program</option>'
											+getLearningProgramContent(schoolId)
										+'</select>'
									+'</div>';

						html+='<div class="col-md-3 col-sm-3 col-xs-12">'
									+'<label>Grade</label>'
									+'<select name="standardId" id="standardId" multiple="multiple" class=" multiselect-dropdown form-control">'
										+'<option value="">Select Grade*</option>'
										+getStandardContent(schoolId,true)
									+'</select>'
								+'</div>';

						html+='<div class="col-md-3 col-sm-3 col-xs-12">'
										+'<label>Select LMS Platform</label>'
										+'<select name="courseProviderId" id="courseProviderId" class="form-control">'
											+getLmsPlatformContent(schoolId)
										+'</select>'
									+'</div>';

						html+='<div class="col-md-3 col-sm-6 col-xs-12">'
							+'<label>Student Name</label>'
							+'<input type="text" name="studentName" id="studentName" class="form-control" value="" maxlength="100" onkeydown="return M.isChars(event);">'
						+'</div>';

						html+='<div class="col-md-3 col-sm-6 col-xs-12">'
									+'<label>Student Email</label>'
									+'<input type="text" name="studentEmail" id="studentEmail" class="form-control" value="" maxlength="100" onkeydown="return M.isEmail(event);"/>'
								+'</div>';
						html+='<div class="col-md-3 col-sm-3 col-xs-12" style="display:'+(role=='TEACHER'?'none':'block')+';">'
							+'<label>Profile Status</label>'
							+'<select name="profileStatus" id="profileStatus" class="form-control">';
						html+='<option value="">Select Profile Status</option>'
								+'<option value="0">Completed</option>'
								+'<option value="1">Withdrawn</option>';
						// html+='</select>'
						// 	+'</div>'
						// 	+'<div class="col-md-2 col-sm-2 col-xs-12">' 
						// 		+'<label>Class Vendor</label>'
						// 		+'<select name="classAggregator" id="classAggregator" class="form-control">'
						// 			+'<option value="">Select</option>'	
						// 			// +'<option value="LENS">LENS</option>'
						// 			+'<option value="ZOOM">ZOOM</option>'
						// 		+'</select>'
						// 	+'</div>'
						// 	+'<div class="col-md-2 col-sm-2 col-xs-12">'
						// 		+'<label>Class Vendor Status</label>'
						// 		+'<select name="classAggregatorCreated" id="classAggregatorCreated" class="form-control">'
						// 			+'<option value="">Select</option>'	
						// 			+'<option value="A">Created</option>'
						// 			+'<option value="U">Unlinked</option>'
						// 			+'<option value="N">Not Created</option>'
						// 			+'<option value="S">Invitation Sent</option>'
						// 		+'</select>'
						// 	+'</div>';
						html+='<div class="col-md-3 col-sm-3 col-xs-12">'
							+'<label>Academic Year Selected</label>'
							+'<select name="academicYearStatus" id="academicYearStatus" class="form-control">'
								+'<option value="">Select Academic Year Selected Status</option>'
								+'<option value="Y">Yes</option>'
								+'<option value="N">No</option>'
							+'</select>'
						+'</div>';
						html+='<div class="col-md-3 col-sm-3 col-xs-12">'
								+'<label>Ongoing Students</label>'
								+'<select name="ongoingStudents" id="ongoingStudents" class="form-control">'
									+'<option value="">Select Ongoing Student Status</option>'	
									+'<option value="Y">Yes</option>'
									+'<option value="N">No</option>'
								+'</select>'
							+'</div>'
							+'<div class="col-md-3 col-sm-3 col-xs-12">'
								+'<label>Sort By</label>'
								+'<select name="sortBy" id="sortBy" class="form-control">'
									+'<option value="DESC">Descending</option>'
									+'<option value="ASC">Ascending</option>'
								+'</select>'
							+'</div>'
							+'<div class="col-md-3 col-sm-3 col-xs-12">'
								+'<label>Page Size</label>'
								+'<input type="text" name="pageSize" id="pageSize" class="form-control" value="25"/>'
							+'</div>'
							+'<div class="col-md-12 col-sm-12 col-xs-12 mt-2">'
								+'<button class="btn btn-sm btn-primary float-right" onclick="advanceManageSessionSearchReset(\'lmsStudentFilter\')"><i class="fa fa-check"></i>&nbsp;Reset</button>'
								+'<button class="btn btn-sm btn-primary float-right" onclick="advanceManageSessionSearch(\'lmsStudentFilter\',\''+roleAndModule.moduleId+'\','+userId+',\''+role+'\');"><i class="fa fa-check"></i>&nbsp;Apply</button>'
							+'</div>'
						+'</div>'
					+'</form>'
				+'</div>'
			+'</div>'
	return html;
}

function getManageSessionUserContent(title, roleAndModule, schoolId, userId, role){
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
								+getManageSessionFilter(roleAndModule,schoolId,userId,role)
							+'</div>'
						+'</div>'
						+'<br>'
						+'<div class="col-md-12">'
							+'<div class="row">'
								+'<div style="width:100%;">'
									+'<div class="tab-content clearfix">'
										+'<div class="row">'
											+'<div id="manageSessionUserContentDiv" style="width:100%;display:inline-block">'
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
		+generateAggrigatorModel('manageSession',roleAndModule.moduleId);
	return html;
}

function manageSessionTable(tableId, role){
	html='<table id="'+tableId+'" class="table table-bordered responsive" style="width:100%;">'
		+getManageSessionTableHeader(role)
	+'</table><br/>';
	return html;
}

function generateAggrigatorModel(callFrom, moduleId){
	var html=
	'<div class="modal fade" id="aggregatorUserModel" tabindex="-1">'
		+'<div class="modal-dialog modal-sm modal-notify" role="document">'
			+'<div class="modal-content text-center">'
				+'<input type="hidden" class="form-control" id="aggregatorId" name="aggregatorId" value="">'
				+'<input type="hidden" class="form-control" id="aggrigatorUserId" name="aggrigatorUserId" value="">'
				+'<input type="hidden" class="form-control" id="aggrigatorCurrentStatus" name="aggrigatorCurrentStatus" value="">'
				+'<input type="hidden" class="form-control" id="aggrigatorMeetingVendor" name="aggrigatorMeetingVendor" value="">'
				+'<div class="modal-header justify-content-center" style="top: 0 !important;width:100% !important;padding: 15px 10px;">'
					+'<p class="heading" style="color: #fff;" id="aggrigatorStatus"></p>'
				+'</div>'
				+'<div id="aggrigatorStatusIcon" class="modal-body delete-modal" style="padding-top:12px">'
				+'</div>'
				+'<div class="modal-footer text-center">'
					+'<div class="text-center" style="margin: 0 auto;">'
						+'<button id="resetAggregatorWarningNo" type="button" class="btn" data-dismiss="modal" style="" onclick="return saveUpdateAggregatorUser(\''+callFrom+'\','+moduleId+');">C</button>'
						+'<button id="resetAggregatorWarningCancel" type="button" class="btn bg-primary" data-dismiss="modal" style="">Close</button>'
					+'</div>'
				+'</div>'
			+'</div>'
		+'</div>'
	+'</div>';
	return html;
}
