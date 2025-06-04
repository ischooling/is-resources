function getClassroomHeader(role){
	
	var html=''
	if(role!='TEACHER'){
		html='<th>S.No.</th><th>'+(USER_ROLE=='DIRECTOR'?"ID/":"")+'Student ID/Student Name'+(USER_ROLE=='DIRECTOR'?"/Email":"")+'/Application No/Teacher Name'+(USER_ROLE=='DIRECTOR'?"/Email":"")+'</th><th>Course Name/Grade</th><th>Title</th><th>Student Timezone</th><th>Teacher Timezone</th><th>Admin Timezone</th><th>Link Generation Status</th><th width="175px">Join Class/Class ID/Passcode</th><th>Update Class Status</th><th>Booking Status</th><th>Added By</th><th>Class Type</th><th>Action</th>';
	}else{
		html='<th>S.No.</th><th>Student Name</th><th>Course Name/Grade</th><th>Title</th><th>Student Timezone</th><th>Teacher Timezone</th><th>Update Class Status</th><th>Added By</th><th>Class Type</th><th>Action</th>';
	}
	return '<thead><tr>'+html+'</tr></thead><tbody></tbody>';
}

function getClassroomBody(result, userId, role, resetMeetingRights){
	var html='';
	$.each(result, function(k, v) {
		joinClassStatus = "Link not generated yet";
		if (v.externalMeetingUrl != '' && v.externalMeetingUrlCreated != '') {
			joinClassStatus = "External Link Added<br/> Link created On: " + v.externalMeetingUrlCreated;
		} else if (v.externalMeetingUrl != '' && v.externalMeetingUrlCreated == '') {
			joinClassStatus = "External Link Added";
		} else if (v.meetingUrl != '') {
			joinClassStatus = "Successfully Generated";
		}

		joinClass = '';
		if (SCHOOL_ID == 1) {
			if (v.meetingCurStatus == 'Y') {
				if (v.meetingUrl !== '') {
					if(v.meetingVendor=='ZOOM'){
						if('TEACHER'==role){
							joinClass+='<a href="javascript:void(0);" onclick="classDetailsOnModal(\''+v.eventUrl+'\');">Join Class</a>';
						}else{
							joinClass+='<a href="javascript:void(0);" onclick="classDetailsOnModal(\''+v.meetingUrl+'\');">Start Class as Teacher</a>';
							joinClass+='<br><a href="javascript:void(0);" onclick="classDetailsOnModal(\''+v.eventUrl+'\');">Start Class as Admin</a>';
						}
						joinClass+='<br/>ID: '+v.meetingIdVendor+'<br/>PWD: '+v.meetingPassword;
					}else{
						joinClass+='<a href="javascript:void(0);" onclick="classDetailsOnModal(\''+v.meetingUrl+'\');">Join Class</a>';
					}
				}
			}else if(v.meetingCurStatus=='N'){
				if(v.studentName!='N/A' || v.meetingType=='PTM' || v.meetingType=='CUSTOM'){
					joinClass+='Session not started yet'+'<br/>';
				}
			} else if (v.meetingCurStatus == 'E') {
				joinClass += 'Session Expired' + '<br/>';
			} else if (v.meetingCurStatus == 'F') {
				joinClass += 'Session Ended' + '<br/>';
			}
		}else{
			if(v.externalMeetingUrl!=''){
				joinClass+='<a id="joinClass'+v.meetingId+'" href="'+v.externalMeetingUrl+'" target="_blank"><i data-toggle="tooltip" title="Join Class" class="fa fa-video"></i></a>';
				joinClass+=' | ';
				joinClass+='<a id="_createLink'+v.meetingId+'" href="javascript:void(0);"  onclick="meetingUrlModalTeacher('+v.meetingId+','+userId+',\''+v.externalMeetingUrl+'\',\''+v.mailSendStatus+'\',\''+ v.urlRemarks+'\')"><i data-toggle="tooltip" title="View Comments" class="fa fa-eye"></i></a>';
			}else{
				if(v.meetingCurStatus=='Y'){
					if(v.meetingUrl!==''){
						if(v.meetingVendor=='ZOOM'){
							if('TEACHER'==role){
								joinClass+='<a href="'+v.eventUrl+'" target="_blank">Join Class</a>';
							}else{
								joinClass+='<a href="'+v.eventUrl+'" target="_blank">Join Class</a>';
								joinClass+='<a href="'+v.meetingUrl+'" target="_blank">Start Class</a>';
							}
							joinClass += '<br/>(' + v.meetingIdVendor + '/' + v.meetingPassword + ')';
						} else {
							joinClass += '<a href="' + v.meetingUrl + '" target="_blank">Join Class</a>';
						}
					}
				}else if(v.meetingCurStatus=='N'){
					if(v.studentName!='N/A' || v.meetingType=='PTM' || v.meetingType=='CUSTOM'){
						joinClass+='Session not started yet'+'<br/>';
					}
				} else if (v.meetingCurStatus == 'E') {
					joinClass += 'Session Expired' + '<br/>';
				} else if (v.meetingCurStatus == 'F') {
					joinClass += 'Session Ended' + '<br/>';
				}
			}
		}

		if(v.meetingCurStatus=='N' || v.meetingCurStatus=='Y'){
			if(v.externalMeetingUrl!=''){
				if(v.meetingType=='CUSTOM'){
					joinClass += '<input type="text" id="hiddenForCopy'+v.meetingId+'" class="position-absolute" value="'+v.externalMeetingUrl+'" style="opacity:0;top:0;left:0"/>';
					joinClass += '<a href="' + v.meetingUrl + '" target="_blank">Join Class</a>';
					joinClass+=' | ';
					joinClass+='<a id="_createLink'+v.meetingId+'" href="javascript:void(0);"  class="btn btn-sm btn-primary" onclick="copyToClipboard(\'hiddenForCopy'+v.meetingId+'\')">Copy custom Url</a>';
				}else{
					joinClass+='<a id="joinClass'+v.meetingId+'" href="'+v.externalMeetingUrl+'"  class="btn btn-sm btn-success" target="_blank"><i data-toggle="tooltip" title="Join Class" class="fa fa-video"></i></a>';
					joinClass+=' | ';
					joinClass+='<a id="_createLink'+v.meetingId+'" href="javascript:void(0);"  class="btn btn-sm btn-primary" onclick="meetingUrlModalTeacher('+v.meetingId+','+userId+',\''+v.externalMeetingUrl+'\',\''+v.mailSendStatus+'\',\''+ v.urlRemarks+'\')"><i data-toggle="tooltip" title="View Comments" class="fa fa-eye"></i></a>';
				}
			}else if(v.meetingUrl!==''){
				//joinClass+='<a href="'+v.meetingUrl+'" target="_blank">Join Class</a>';
			}else if(v.meetingCurStatus!='F'){
				if(v.studentName!='N/A'){
					// joinClass+='<a id="createLink'+v.meetingId+'" href="javascript:void(0);" class="btn btn-sm btn-primary mr-1"  onclick="meetingUrlModalTeacher('+v.meetingId+','+userId+',\''+v.externalMeetingUrl+'\',\''+v.mailSendStatus+'\',\''+v.urlRemarks+'\')"><i data-toggle="tooltip" title="Create Class Link" class="fa fa-plus"></i></a>';
					if('STUDENT'!=role){
						createClassroomSessionContent='<a id="createClassLink'+v.meetingId+'" href="javascript:void(0);" class="btn btn-sm btn-success" onclick="createGotoMeetingLink('+userId+','+v.meetingId+','+roleAndModule.moduleId+',\''+v.meetingType+'\')">Create Meeting Link</a>';
						joinClass+=createClassroomSessionContent;
					}
				}
			}
		}
		updateClassroomSessionContent='';
		resetClassroomSessionContent='';
		meetingResultContent='';
		if(v.meetingResult!=''){
			meetingResultContent='<strong>'+v.meetingResult+'</strong><br/>';
			updateClassroomSessionContent='<a id="updateStatus'+v.meetingId+'" href="javascript:void(0);" class="btn btn-sm btn-primary" onclick="meetingResultModal('+v.meetingId+','+userId+',\''+v.meetingResult+'\',\''+v.meetingCurStatus+'\',\''+role+'\')">Change</a>';
			if(resetMeetingRights=='Y'){
				resetClassroomSessionContent='<a id="resetClass'+v.meetingId+'" href="javascript:void(0);" onclick="submitMeetingForStudentSessionSlots(\''+v.meetingId+'\',\'SCHOOL\',\'RESET\',\''+roleAndModule.moduleId+'\', \'STUDENT_DOUBT_SESSION\',\''+role+'\');">Reset Class</a>';
			}
		}else{
			updateClassroomSessionContent='<a id="updateStatus'+v.meetingId+'" href="javascript:void(0);" class="btn btn-sm btn-success" onclick="meetingResultModal('+v.meetingId+','+userId+',\''+v.meetingResult+'\',\''+v.meetingCurStatus+'\',\''+role+'\')">Update Class Status</a>';
		}
		markSession = '';
		if (meetingResultContent == '' || 'TEACHER' != role) {
			isUpdate = false;
			if (v.bookedDate == 'N/A') {
				markSession = v.bookedDate;
			} else {
				if (v.meetingResult != '') {
					if (v.revokeChangedStatus == 'Y') {
						markSession += meetingResultContent;
						if ('ADMIN'==role || 'SUPER_ADMIN' == role || 'SCHOOL' == role || 'DIRECTOR' == role || 'SCHOOL_ADMIN' == role ) {
							markSession+=' | ';
							markSession+=updateClassroomSessionContent;
							markSession+=' | ';
							markSession+=resetClassroomSessionContent;
						}
						isUpdate = true;
					} else {
						if ('ADMIN' == role || 'SUPER_ADMIN' == role || 'SCHOOL' == role || 'DIRECTOR' == role || 'SCHOOL_ADMIN' == role) {
							if (v.meetingResult != '') {
								markSession += meetingResultContent + ' | ';
							}
							markSession += updateClassroomSessionContent;
							isUpdate = true;
							markSession+=' | ';
							markSession+=resetClassroomSessionContent;
						} else {
							if (v.isStatusUpdate == 1 && !isUpdate) {
								markSession += updateClassroomSessionContent + '<br/>';
								isUpdate = true;
							} else {
								markSession += meetingResultContent;
								if (roleAndModule.updated == 'Y' && !isUpdate) {
									markSession += updateClassroomSessionContent + '<br/>';
									isUpdate = true;
								}
							}
							if ((v.meetingCurStatus == 'F' || v.meetingCurStatus == 'E') && roleAndModule.updated == 'Y' && !isUpdate) {
								markSession += updateClassroomSessionContent + '<br/>';
								isUpdate = true;
							}
							if (v.externalMeetingUrl != '' && roleAndModule.updated == 'Y' && v.mailSendStatus == 'Y' && !isUpdate) {
								markSession += updateClassroomSessionContent
								isUpdate = true;
							}
						}
					}
				} else {
					// if ('ADMIN'==role || 'SUPER_ADMIN' == role || 'SCHOOL' == role || 'DIRECTOR' == role || 'SCHOOL_ADMIN' == role ) {
					// 	markSession+=updateClassroomSessionContent;
					// 	isUpdate = true;
					// } else {
					// 	if (markSession==''){
					// 		if ( v.mailSendStatus=='Y' && v.externalMeetingUrl!='' && roleAndModule.updated=='Y') {
					// 			markSession+=updateClassroomSessionContent;
					// 			isUpdate = true;
					// 		}
					// 		if ((v.meetingCurStatus=='E' || v.meetingCurStatus=='F') && roleAndModule.updated=='Y' && !isUpdate) {
					// 			markSession+=updateClassroomSessionContent;
					// 			isUpdate = true;
					// 		}
					// 	}
					// }
					markSession += updateClassroomSessionContent;
					isUpdate = true;
					markSession+=' | ';
					markSession+=resetClassroomSessionContent;
				}
			}
		} else {
			markSession += meetingResultContent;
		}

		action='';
		if(v.externalMeetingUrl!=''){
			if(v.mailSendStatus=='Y'){
				action+='<i data-toggle="tooltip" title="Mail Already Sent" class="fa fa-check"></i> | <a class="btn btn-sm btn-primary" id="sendMail'+v.meetingId+'" href="javascript:void(0);" onclick="sendMailModel('+v.meetingId+','+userId+',\'' +v.externalMeetingUrl+'\',\'' +v.mailSendStatus+'\')"><i data-toggle="tooltip" title="ReSend Mail" class="fa fa-paper-plane"></i></a>';
			}else if(v.mailSendStatus=='N' || mailSendStatus=='N/A'){
				action+='<a class="btn btn-sm btn-primary" id="sendMail'+v.meetingId+'" href="javascript:void(0);" onclick="sendMailModel('+v.meetingId+','+userId+',\'' +v.externalMeetingUrl+'\',\''+v.mailSendStatus+'\')"><i data-toggle="tooltip" title="Send Mail\" class="fa fa-paper-plane"></i></a>';
			}
			//action+=' | ';
		}
		if(roleAndModule.deleted=='Y'){
			if (v.bookedDate=='N/A') {
				action+='<a class="btn btn-sm btn-primary" href="javascript:void(0);" onclick="showWarningMessage(\'Are you sure you want to delete?\',\'submitRequestDemoMeetingSlots(\\\'teacherMeetingSlotsForm\\\',\\\'TEACHER\\\',\\\'EDIT\\\',\\\''+v.meetingId+'\\\',\\\'DELETESLOTFROMTEACHER\\\','+roleAndModule.moduleId+','+userId+')\')"><i class="fa fa-trash"></i></a>';
			}
		}
		if (action == '' || v.meetingType == 'CUSTOM') {
			action = 'N/A';
		}
		// className=k%2==0?'even':'odd';
		className = '';
		studentTeacher = '';
		if('TEACHER'==role){
			studentTeacher=v.studentName;//+'<br>'+v.teacherName;
		}else{
			studentTeacher=(USER_ROLE=='DIRECTOR'?v.meetingId+' | '+v.meetingIdVendor+'<br><br>':'') +v.studentStringId+"<br/>" +v.studentName+'<br>'+(USER_ROLE=='DIRECTOR'?v.studentEmail:'')+'<br><br>'+v.applicationNo+"<br/>"+v.teacherName+'<br>'+v.teacherOfficialEmail+'<br>'+(USER_ROLE=='DIRECTOR'?v.teacherEmail:'')+'<br>';
		}
		courseStandard = v.subjectName + '<br>' + v.standardName;
		//'/'+v.meetingId+'/'+v.bookedDate+
		html+=
			'<tr id="classrommTr'+v.meetingId+'" class="'+className+'">'
				+'<td class="text-center">'
					+v.sno;
				// if(USER_ROLE=='DIRECTOR'){
				// 	html+='/'+v.meetingId;
				// }else{
				// 	html+='/'+v.meetingId;
				// }
				html+='</td>'
				+'<td>'+studentTeacher+'</td>'
				+'<td>'+courseStandard+'</td>'
				+'<td>'+v.meetingSubject+'</td>'
				+'<td>'+v.studentTimezone+'</td>'
				+'<td>'+v.teacherTimezone+'</td>';
				if('TEACHER'!=role){
					html+='<td>'+v.adminTimezone+'</td>'
					+'<td><span class="linkStatus'+v.meetingId+'">'+joinClassStatus+'</span></td>'
					+'<td class="position-relative joinView'+v.meetingId+'">'+joinClass+'</td>';
				}
		html+='<td class="markSession'+v.meetingId+'">'+markSession+'</td>';
				if('TEACHER'!=role){
					html+='<td>'+v.classStatus+'</td>';
				}
				html+='<td>'+v.addedBy+'</td>'
				+'<td>'+v.classType+'</td>'
				+'<td class="text-center classAction'+v.meetingId+'">'+action+'</td>'
			'</td>';
	});
	return html;
}
function getClassroomSessionFilter(roleAndModule, schoolId, userId, role){
	var html=
	'<div class="filter-wrapper">'
		+'<div class="full">'
		+'<button class="btn btn-sm btn-primary float-right show-filter" onClick="toggleFilter(\'classroomSessionFilter\')"><i class="fa fa-filter"></i>&nbsp;Advance Search</button>'
		+'</div>'
		+'<form name="classroomSessionFilter" id="classroomSessionFilter" action="javascript:void(0)">'
			+'<div class="filter-fields d-flex flex-wrap">';
				if(role!='TEACHER'){
					html+='<div class="col-md-3 col-sm-3 col-xs-12">'
								+'<label>Select Learning Program</label>'
								+'<select name="enrollmentType" id="enrollmentType" class="form-control">'
									+'<option value="">Select Learning Program</option>'
									+getLearningProgramContent(schoolId)
								+'</select>'
							+'</div>';
				}
				
				html+='<div class="col-md-3 col-sm-3 col-xs-12">'
							+'<label>Select Class For</label>'
							+'<select name="classCreateFor" id="classCreateFor" class="form-control">'
								+'<option value="ALL" selected>ALL</option>'
								+'<option value="STUDENT_DOUBT_SESSION">Student</option>'
								+'<option value="PTM">PTM</option>'
								+'<option value="CUSTOM">CUSTOM</option>'
							+'</select>'
						+'</div>';
				html+='<div class="col-md-3 col-sm-3 col-xs-12">'
						+'<label>Grade</label>'
						+'<select name="standardId" id="standardId" class="form-control">'
							+'<option value="">Select Grade</option>'
							+getStandardContent(schoolId,false, false)
						+'</select>'
					+'</div>';
				if(role!='TEACHER'){
					html+='<div class="col-md-3 col-sm-3 col-xs-12">'
								+'<label>Select LMS Platform</label>'
								+'<select name="courseProviderId" id="courseProviderId" class="form-control">'
									+getLmsPlatformContent(schoolId)
								+'</select>'
							+'</div>';
				}
				html+='<div class="col-md-3 col-sm-6 col-xs-12">'
						+'<label>Student Name</label>'
						+'<input type="text" name="studentName" id="studentName" class="form-control" value="" maxlength="100" onkeydown="return M.isChars(event);">'
					+'</div>';
				if(role!='TEACHER'){
					html+='<div class="col-md-3 col-sm-6 col-xs-12">'
						+'<label>Student ID</label>'
						+'<input type="text" name="studentId" id="studentId" class="form-control" value="" maxlength="100">'
					+'</div>'
					+'<div class="col-md-3 col-sm-6 col-xs-12">'
								+'<label>Student Email</label>'
								+'<input type="text" name="studentEmail" id="studentEmail" class="form-control" value="" maxlength="100" onkeydown="return M.isEmail(event);"/>'
					+'</div>';
				}
				html+='<div class="col-md-3 col-sm-6 col-xs-12">'
					+'<label>Course Name</label>'
					+'<input type="text" name="subjectIds" id="subjectIds" class="form-control" value="" maxlength="40" onkeydown="return M.isChars(event);">'
				+'</div>';
				if(role!='TEACHER'){
					html+='<div class="col-md-3 col-sm-6 col-xs-12">'
						+'<label>Teacher Name</label>'
						+'<input type="text" name="teacherName" id="teacherName" class="form-control" value="" maxlength="100" onkeydown="return M.isChars(event);">'
					+'</div>'
					+'<div class="col-md-3 col-sm-6 col-xs-12">'
						+'<label>Employee ID</label>'
						+'<input type="text" name="employeeId" id="employeeId" class="form-control" value="" maxlength="100"/>'
					+'</div>'
					+'<div class="col-md-3 col-sm-6 col-xs-12">'
						+'<label>Teacher Email</label>'
						+'<input type="text" name="teacherEmail" id="teacherEmail" class="form-control" value="" maxlength="100" onkeydown="return M.isEmail(event);"/>'
					+'</div>'
					+'<div class="col-md-3 col-sm-3 col-xs-12">'
						+'<label>Booking Status</label>'
						+'<select name="classStatus" id="classStatus" class="form-control">'
							+'<option value="">Select Booking Status</option>'
							+'<option value="B">Booked</option>'
							// +'<option value="A">Available</option>'
						+'</select>'
					+'</div>'
					+'<div class="col-md-3 col-sm-3 col-xs-12">'
						+'<label>Class Status</label>'
						+'<select name="markStatus" id="markStatus" class="form-control">'
							+'<option value="">Select Class Status</option>'
							+'<option value="NU">Not Updated</option>'
							+'<option value="Completed">Completed</option>'
							+'<option value="Reschedule Session">Reschedule Class</option>'
							+'<option value="Missed by Student">Missed by Student</option>'
							+'<option value="Missed by Teacher">Missed by Teacher</option>'
						+'</select>'
					+'</div>';
				}
				html+='<div class="col-md-3 col-sm-6 col-xs-12">'
					+'<label>Class Start Date</label>'
					+'<input type="text" name="classStartDate" id="classStartDate" class="form-control filterDates" value="" maxlength="10"/>'
				+'</div>'
				// +'<div class="col-md-3 col-sm-6 col-12 mb-2">'
				// 	+'<label>Class Start Time</label>'
				// 	+'<select name="classStartTime" id="classStartTime" class="form-control">'
				// 	+'<option value="" disabled selected>HH</option>'
				// 		+getHoursAndMins(23,1)
				// 	+'</select>'
				// +'</div>'
				+'<div class="col-md-3 col-sm-6 col-12 mb-2">'
					+'<label>Class End Date</label>'
					+'<input type="text" name="classEndDate" id="classEndDate" class="form-control filterDates" value="" maxlength="10"/>'
				+'</div>'
				// +'<div class="col-md-3 col-sm-6 col-12 mb-2">'
				// 	+'<label>Class End Time</label>'
				// 	+'<select name="classEndTime" id="classEndTime" class="form-control">'
				// 	+'<option value="" disabled selected>HH</option>'
				// 		+getHoursAndMins(23,1)
				// 	+'</select>'
				// +'</div>'
				+'<div class="col-md-3 col-sm-3 col-xs-12" style="display:'+(role=='TEACHER'?'none':'block')+';">'
					+'<label>Search By</label>'
					+'<select name="searchBy" id="searchBy" class="form-control">';
						if(role!='TEACHER'){
							html+='<option value="A">Admin</option>'
							+'<option value="S">Student</option>'
							+'<option value="T">Teacher</option>';
						}else{
							html+='<option value="S">Student</option>';
						}
			html+='</select>'
				+'</div>'
				+'<div class="col-md-3 col-sm-3 col-xs-12">'
					+'<label>Sort By</label>'
					+'<select name="sortBy" id="sortBy" class="form-control">'
						+'<option value="DESC">Descending</option>'
						+'<option value="ASC">Ascending</option>'
					+'</select>'
				+'</div>'
				+'<div class="col-md-3 col-sm-6 col-xs-12">'
					+'<label>Page Size</label>'
							+'<input type="text" name="pageSize" id="pageSize" class="form-control" value="25"/>'
						+'</div>'
						+'<div class="col-md-12 col-sm-12 col-xs-12 mt-2 text-right">'
							+'<button class="btn btn-sm btn-success mr-2" onclick="advanceClassroomSearch(\'classroomSessionFilter\',\''+roleAndModule.moduleId+'\','+userId+',\''+role+'\');"><i class="fa fa-check"></i>&nbsp;Search</button>'
							+'<button class="btn btn-sm btn-primary" onclick="advanceManageClassroomSearchReset(\'classroomSessionFilter\')"><i class="fa fa-check"></i>&nbsp;Reset</button>'
						+'</div>'
					+'</div>'
				+'</form>'
			+'</div>';
	return html;
}

function getManageSessionContent(title, roleAndModule, schoolId, userId, role) {
	var html =
		'<div class="row">'
			+'<div class="col-md-12 col-lg-12 col-sm-12">'
				+'<div class="card">'
					+'<div class="card-header card-header-primary">'
						+'<h4 class="card-title">'+title+'</h4>'
					+'</div>'
					+'<div class="card-body">'
						+'<div class="row">'
							+'<div class="col-lg-12 col-md-12 col-sm-12 col-12">'
							+getClassroomSessionFilter(roleAndModule,schoolId,userId,role)
							+'</div>'
						+'</div>'
						+'<br>'
						+'<div class="col-md-12">'
							+'<div class="row">'
								+'<div style="width:100%;">'
									+'<div class="tab-content clearfix">'
										+'<div class="row">'
											+'<div id="manageSessionContentDiv" style="width:100%;display:inline-block">'
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

function getManageSessionContentTeacher(title, roleAndModule, schoolId, userId, role){
	var html=
	'<div class="app-page-title">'
		+'<div class="page-title-wrapper">'
			+'<div class="page-title-heading">'
				+'<div class="page-title-icon"><i class="fas fa-user-cog text-primary"></i></div>'
				+'<div>'+title+'</div>'
			+'</div>';
			if(roleAndModule.added=='Y'){
				html+='<div class="page-title-actions">';
				html+='<div class="d-inline-block dropdown"> ';
				//html+='<a href="javascript:void(0);" onclick="deletemeetingSlotModal();" class="btn btn-primary fa-pull-right meetingSlotAdd ml-1">Delete Session Slot</a>';
				//html+='<a href="javascript:void(0);" onclick="meetingSlotModal();" class="btn btn-primary fa-pull-right meetingSlotAdd ml-1">Add New Session Slot</a></p> ';
				html+='</div>';
				html+='</div>';
			}
		html+='</div>'
	+'</div>'
	+'<div class="main-card mb-3 card">'
		+'<div class="card-body">'
			+getClassroomSessionFilter(roleAndModule,schoolId,userId,role)
			+'<br>'
			+'<div class="col-md-12 mt-3 p-0">'
				+'<div id="manageSessionContentDiv" style="width:100%;display:inline-block">'
				+'</div>'
			+'</div>'
		+'</div>'
	+'</div>'
			
	return html;
}

function manageClassroomTable(tableId, role){
	html='<table id="'+tableId+'" class="table table-striped table-bordered responsive dt-responsive" style="width:100%;">'
		+getClassroomHeader(role)
	+'</table><br/>';
	return html;
}
function getUpdateManageMeetingResultModal(roleAndModule, role){
	var html=
	'<div class="modal fade bs-example-modal-lg" tabindex="-1" role="dialog" id="updateMeetingResultModal">'
		+'<div class="modal-dialog modal-md">'
			+'<form name="updateMeetingResultForm" id="updateMeetingResultForm">'
				+'<div class="modal-content">'
					+'<input type="hidden" class="form-control" id="userId" name="userId" value="">'
					+'<input type="hidden" class="form-control" id="meetingId" name="meetingId" value="">'
					+'<input type="hidden" class="form-control" id="meetingCurStatus" name="meetingCurStatus" value="">'
					+'<div class="modal-header p-2 bg-primary text-white">'
						+'<h5 class="modal-title" id="myLargeModalLabel">Update Class Status</h5>'
						+'<button type="button" class="close" data-dismiss="modal" aria-hidden="true" style="color:#fff;">x</button>'
					+'</div>'
					+'<div class="modal-body">'
						+'<div class="col-md-12 col-sm-12 col-12">'
							+'<div class="form-group">'
								+'<label>Update Class Status</label> '
								+'<select class="form-control" name="meetingResult" id="meetingResult" required>'
								+'</select>'
							+'</div>'
						+'</div>'
					+'</div>'
					+'<div class="modal-footer">';
						if(roleAndModule.updated=='Y'){
							html+='<button type="button" class="send btn btn-primary  text-left meetingSaveResult" onClick="updateClassroomSession(\''+roleAndModule.moduleId+'\',\''+role+'\');"><i class="fa fa-envelope-o"></i> Save</button>';
						}
						html+='<button type="button" class="btn btn-danger waves-effect text-right" data-dismiss="modal">Close</button>'
					+'</div>'
				+'</div>'
			+'</form>'
		+'</div>'
	+'</div>';
	return html;
}

function getMeetingUrlModal(roleAndModule, role){
	var html=
	'<div class="modal fade bs-example-modal-lg" tabindex="-1" role="dialog" id="meetingUrlModal">'
	   +'<div class="modal-dialog modal-md">'
			+'<form name="meetingUrlForm" id="meetingUrlForm">'
				+'<div class="modal-content" style="border: none; border-radius: 1px">'
					+'<input type="hidden" class="form-control" id="userId" name="userId" value="">'
					+'<input type="hidden" class="form-control" id="meetingId" name="meetingId" value="">'
					+'<input type="hidden" class="form-control" id="mailSendStatus" name="mailSendStatus" value="">'
					+'<div class="modal-header text-white theme-bg py-2">'
						+'<h5 class="modal-title" id="myLargeModalLabel">Class Link</h5>'
						+'<button type="button" class="close" data-dismiss="modal" style="color: #fff;">×</button>'
					+' </div>'
					+'<div class="modal-body">'
						+'<div class="col-md-12 col-sm-12 col-12">'
							+'<div class="form-group">'
								+'<label>Class Link</label>'
							   +'<input type="text" class="form-control" id="meetingUrl" name="meetingUrl" maxlength=150 value="">'
							+'</div>'
						+'</div>'
					   +'<div class="col-md-12 col-sm-12 col-12">'
							+'<div class="form-group">'
								+'<label>Remarks</label>'
								+'<input type="text" class="form-control" id="remarks" name="remarks" maxlength=200 value="">'
							+'</div>'
						+'</div>'
				+'</div>'
				+'<div style="text-align:center;"  id="note">'
					+'<p>Note: Once the link is added, you won\'t be able to change the link.</p>'
				+'</div>'
				   +'<div class="modal-footer">';
						if(roleAndModule.added=='Y'){
							html+='<button type="button" id="saveMeetingUrl" class="send btn btn-primary  text-left meetingUrl" onClick="saveClassroomSessionMeetingUrl(\''+roleAndModule.moduleId+'\',\''+role+'\');"><i class="fa fa-envelope-o"></i> Save</button>';
						}
						html+='<button type="button" class="btn btn-danger waves-effect text-right" data-dismiss="modal">Close</button>'
					+'</div>'
				+'</div>'
			+'</form>'
		+'</div>'
	+'</div>';
	return html;
}

function getSendMailModal(roleAndModule, role){
	var html=
	'<div class="modal fade bs-example-modal-lg" tabindex="-1" role="dialog" id="sendMailModal">'
		+'<div class="modal-dialog modal-md">'
			+'<form name="sendMailForm" id="sendMailForm">'
				+'<div class="modal-content">'
					+'<input type="hidden" class="form-control" id="userId" name="userId" value="">'
					+'<input type="hidden" class="form-control" id="meetingId" name="meetingId" value="">'
					+'<div class="modal-header theme-bg py-2">'
						+'<h5 class="modal-title text-white" id="myLargeModalLabel">Send Mail</h5>'
						+'<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">'
							+'<span aria-hidden="true">×</span>'
						+'</button>'
					+'</div>'
					+'<div class="modal-body">'
						+'<h5 class="text-center m-0">Are you sure you want to send this mail?</h5>'
					+'</div>'
					+'<div class="modal-footer py-2">';
						if(roleAndModule.added=='Y'){
							html+='<button type="button" class="send btn btn-primary  text-left sendMail" onClick="sendClassroomSessionMail(\''+roleAndModule.moduleId+'\',\''+role+'\');"><i class="fa fa-envelope-o"></i> Yes</button>';
						}
						html+='<button type="button" class="btn btn-danger waves-effect text-right" data-dismiss="modal">No</button>'
					+'</div>'
				+'</div>'
			+'</form>'
		+'</div>'
	+'</div>';
	return html;
}

function getPublicRecordModal(roleAndModule, role) {
	var html =
		'<div class="modal fade bs-example-modal-lg" tabindex="-1" role="dialog" id="publishRecordModal">'
		+ '<div class="modal-dialog modal-md">'
		+ '<form name="publishRecordForm" id="publishRecordForm">'
		+ '<div class="modal-content" style="border: none; border-radius: 1px">'
		+ '<input type="hidden" class="form-control" id="userId" name="userId" value="">'
		+ '<input type="hidden" class="form-control" id="meetingId" name="meetingId" value="">'
		+ '<input type="hidden" class="form-control" id="meetingStrId" name="meetingStrId" value="">'
		+ '<div class="modal-header text-center">'
		+ '<h4 class="modal-title" id="myLargeModalLabel"><span id="publishHeadId"></span> Recording</h4>'
		+ '<button type="button" class="close" data-dismiss="modal" aria-hidden="true" style="color:#fff;">x</button>'
		+ '</div>'
		+ '<div style="text-align:center;">'
		+ '<p>Are you sure you want to <span id="publishId"></span> Recording?</p>'
		+ '</div>'
		+ '<div class="modal-footer">';
	if (roleAndModule.added == 'Y') {
		html += '<button type="button" class="send btn btn-primary  text-left publishRecord" onClick="publishClassroomSession(\'' + roleAndModule.moduleId + '\',\'' + role + '\');"><i class="fa fa-envelope-o"></i> Yes</button>';
	}
	html += '<button type="button" class="btn btn-danger waves-effect text-right" data-dismiss="modal">No</button>'
		+ '</div>'
		+ '</div>'
		+ '</form>'
		+ '</div>'
		+ '</div>';
	return html;
}

function getRevokeModal(roleAndModule, role) {
	var html =
		'<div class="modal fade bs-example-modal-lg" tabindex="-1" role="dialog" id="revokeModal">'
		+ '<div class="modal-dialog modal-md">'
		+ '<form name="revokeForm" id="revokeForm">'
		+ '<div class="modal-content" style="border: none; border-radius: 1px">'
		+ '<input type="hidden" class="form-control" id="userId" name="userId" value="">'
		+ '<input type="hidden" class="form-control" id="meetingId" name="meetingId" value="">'
		+ '<input type="hidden" class="form-control" id="meetingStrId" name="meetingStrId" value="">'
		+ '<div class="modal-header text-center">'
		+ '<h4 class="modal-title" id="myLargeModalLabel"><span id="publishHeadId"></span> Revoke</h4>'
		+ '<button type="button" class="close" data-dismiss="modal" aria-hidden="true" style="color:#fff;">x</button>'
		+ '</div>'
		+ '<div style="text-align:center;">'
		+ '<p>Are you sure you want to Revoke?</p>'
		+ '</div>'
		+ '<div class="modal-footer">';
	if (roleAndModule.added == 'Y') {
		html += '<button type="button" class="send btn btn-primary  text-left meetingRevoke" onClick="revokeClassroomSession(\'' + roleAndModule.moduleId + '\',\'' + role + '\');"><i class="fa fa-envelope-o"></i> Yes</button>';
	}
	html += '<button type="button" class="btn btn-danger waves-effect text-right" data-dismiss="modal">No</button>'
		+ '</div>'
		+ '</div>'
		+ '</form>'
		+ '</div>'
		+ '</div>';
	return html;
}


function getAllClassSkeleton(){
	var html=
	`<div class="app-page-title">
		<div class="page-title-wrapper">
			<div class="page-title-heading">
				<div class="page-title-icon skeleton"></div>
				<span style="width:75px; height:30px" class="skeleton d-inline-block rounded mr-2"></span>
			</div>
			<div class="page-title-actions">
				<div class="d-inline-block dropdown"> </div>
			</div>
		</div>
	</div>
	<div class="main-card mb-3 card">
		<div class="card-body">
			<div class="filter-wrapper">
				<div class="full text-right">
					<span style="width:95px; height:30px" class="skeleton d-inline-block rounded mr-2"></span>
				</div>
				<div>
					<div class="filter-fields d-flex flex-wrap">
						<div class="col-md-3 col-sm-3 col-xs-12">
							<div style="height:38px" class="skeleton mb-3"></div>
						</div>
						<div class="col-md-3 col-sm-3 col-xs-12">
							<div style="height:38px" class="skeleton mb-3"></div>
						</div>
						<div class="col-md-3 col-sm-6 col-xs-12">
							<div style="height:38px" class="skeleton mb-3"></div>
						</div>
						<div class="col-md-3 col-sm-6 col-xs-12">
							<div style="height:38px" class="skeleton mb-3"></div>
						</div>
						<div class="col-md-3 col-sm-6 col-xs-12">
							<div style="height:38px" class="skeleton mb-3"></div>
						</div>
						<div class="col-md-3 col-sm-6 col-12 mb-2">
							<div style="height:38px" class="skeleton mb-3"></div>
						</div>
						<div class="col-md-3 col-sm-3 col-xs-12">
							<div style="height:38px" class="skeleton mb-3"></div>
						</div>
						<div class="col-md-3 col-sm-6 col-xs-12">
							<div style="height:38px" class="skeleton mb-3"></div>
						</div>
						<div class="col-md-12 col-sm-12 col-xs-12 mt-2 text-right">
							<span style="width:74px; height:30px" class="skeleton d-inline-block rounded mr-2"></span>
							<span style="width:74px; height:30px" class="skeleton d-inline-block rounded"></span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>`;
	return html;
}