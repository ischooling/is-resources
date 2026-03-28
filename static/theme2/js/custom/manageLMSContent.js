
var LMS_ROLE_MODULE='';
function getLMSClassroomHeader(role){
	var html=''
	if(role!='TEACHER'){
		html='<th>S.No.</th>'
			+'<th>LMS Platform/Learning Program</th>'
			+'<th>Student Details</th>'
			+'<th>Parent Details</th>'
			+'<th>SMS/LMS Profile Status</th>'
			+'<th>Student Academic Year Start Date</th>'
			+'<th>Action</th>';
	}else{
		html='<th>S.No.</th>'
			+'<th>Student Name</th>'
			+'<th>Course Name/Grade</th>'
			+'<th>Student Timezone</th>'
			+'<th>Teacher Timezone</th>'
			+'<th>Link Generation Status</th>'
			+'<th>Join Class</th>'
			+'<th>Update Class Status</th>'
			+'<th>Class Status</th>'
			+'<th>Action</th>';
	}
	return '<thead class="bg-primary text-white"><tr>'+html+'</tr></thead><tbody></tbody>';
}

function getManageLMSUserTableBody(result, userId, role){

	var html='';
	$.each(result, function(k, v) {
		action='';
		html+=
			'<tr id="lmsUserTr'+v.studentId+'">'
				+'<td>'+v.sno+'</td>'
				+'<td>'
					+'LMS Platform: '+v.courseProviderName+'<br/>'
					+'Learning Program: '+v.registrationType+'<br/>'
					+'Enrollment Type: '+v.enrollementType+'<br/>'
				+'</td>'
				+'<td>'
					+'Student Id: '+v.studentStringId+'<br/>'
					+'Name: '+v.name+'<br/>'
					+'User Name: '+v.lmsUserName+'<br/>'
					+'Grade: '+v.gradeName+'<br/>'
				+'</td>'
				+'<td>'
					+'Name: '+v.parentName+'<br/>'
					+'Email: '+v.parentEmail+'<br/>'
					+'Contact No: '+v.parentContact+'<br/>'
					+'Preferred Communication: '+v.communication+'<br/>'
				+'</td>'
				+'<td>'+v.userProfileStatus+'</td>'
				+'<td>'+v.semesterStartDate+'</td>'
		html+=	'<td>'+v.action+'</td>'
			'</tr>';
	});
	return html;
}

function getManageLMSFilter(roleAndModule, schoolId, userId, role){
	LMS_ROLE_MODULE=roleAndModule;
	var html=
	'<div class="filter-wrapper">'
		+'<div class="full">'
			+'<button class="btn btn-sm btn-primary float-right show-filter" onClick="toggleFilter(\'lmsStudentFilter\')"><i class="fa fa-filter"></i>&nbsp;Filter</button>'
		+'</div>'
		
		+'<form name="lmsStudentFilter" id="lmsStudentFilter" action="javascript:void(0)">'
			+'<div class="filter-fields d-flex flex-wrap">'
				html+='<div class="col-md-3 col-sm-3 col-xs-12">'
						+'<label>Academic Year</label>'
						+'<select name="activeSession" id="activeSession" class="form-control"></select>'
				+'</div>'
				+'<div class="col-md-3 col-sm-6 col-xs-12">'
					+'<label> Start Date</label>'
					+'<input type="text" name="academicYearStartDate" id="academicYearStartDate" class="form-control filterDates" value="" maxlength="10" readonly onkeydown="return false" />'
				+'</div>'
				+'<div class="col-md-3 col-sm-6 col-xs-12">'
					+'<label>End Date</label>'
					+'<input type="text" name="academicYearEndDate" id="academicYearEndDate" class="form-control filterDates" value="" maxlength="10" readonly onkeydown="return false" />'
				+'</div>'
				+'<div class="col-md-3 col-sm-3 col-xs-12">'
					+'<label>Select Learning Program</label>'
					+'<select name="learningProgram" id="learningProgram" class="form-control">'
						+'<option value="">Select Learning Program</option>'
						+getLearningProgramContent(schoolId)
					+'</select>'
				+'</div>'
				+'<div class="col-md-3 col-sm-3 col-xs-12">'
					+'<label>Grade</label>'
					+'<select name="standardId" id="standardId" multiple="multiple" class="form-control">'
						+'<option value="" disabled>Select Grade*</option>'
						+getStandardContent(schoolId,true, false)
					+'</select>'
				+'</div>'
				+'<div class="col-md-3 col-sm-3 col-xs-12">'
					+'<label>Select LMS Platform</label>'
					+'<select name="courseProviderId" id="courseProviderId" class="form-control">'
						+getLmsPlatformContent(schoolId)
					+'</select>'
				+'</div>'
				+'<div class="col-md-3 col-sm-6 col-xs-12">'
					+'<label>Student Id</label>'
					+'<input type="text" name="studentId" id="studentId" class="form-control" value="" maxlength="100"">'
				+'</div>'
				+'<div class="col-md-3 col-sm-6 col-xs-12">'
					+'<label>Student Name</label>'
					+'<input type="text" name="studentName" id="studentName" class="form-control" value="" maxlength="100" onkeydown="return M.isChars(event);">'
				+'</div>'
				+'<div class="col-md-3 col-sm-3 col-xs-12">'
					+'<label>Academic Year Selected</label>'
					+'<select name="academicYearStatus" id="academicYearStatus" class="form-control">'
						+'<option value="">Select Academic Year Selected Status</option>'
						+'<option value="Y">Yes</option>'
						+'<option value="N">No</option>'
					+'</select>'
				+'</div>'
				+'<div class="col-md-3 col-sm-3 col-xs-12">'
					+'<label>LMS Status</label>'
					+'<select name="lmsStatus" id="lmsStatus" class="form-control">'
						+'<option value="">Select LMS Status</option>'
						+'<option value="1">Active</option>'
						+'<option value="0">Inactive</option>'
					+'</select>'
				+'</div>'
				+'<div class="col-md-3 col-sm-3 col-xs-12" style="display:'+(role=='TEACHER'?'none':'block')+';">'
					+'<label>Profile Status</label>'
					+'<select name="profileStatus" id="profileStatus" class="form-control">'
						+'<option value="">Select Profile Status</option>'
						+'<option value="0">Completed</option>'
						+'<option value="1">Withdrawn</option>'
					+'</select>'
				+'</div>'
				+'<div class="col-md-3 col-sm-3 col-xs-12">'
					+'<label>Parent Details added?</label>'
					+'<select name="parentDetailsAdded" id="parentDetailsAdded" class="form-control">'
						+'<option value="">Select</option>'
						+'<option value="N">None or Partially Added (One or two details missing)</option>'
						//+'<option value="P">Partially Added</option>'
						+'<option value="A">All added</option>'
					+'</select>'
				+'</div>'
				+'<div class="col-md-3 col-sm-3 col-xs-12">'
					+'<label>Enrollment Type</label>'
					+'<select name="enrollmentType" id="enrollmentType" class="form-control">'
						+'<option value="">Select</option>'
						+'<option value="N">New</option>'
						+'<option value="R">Re-Enrollment</option>'
					+'</select>'
				+'</div>'
				+'<div class="col-md-3 col-sm-3 col-xs-12">'
						+'<label>Ongoing Students</label>'
						+'<select name="ongoingStudents" id="ongoingStudents" class="form-control">'
							+'<option value="">Select Ongoing Students Status</option>'	
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
				+'<div class="col-md-3 col-sm-6 col-xs-12">'
					+'<label>Page Size</label>'
					+'<input type="text" name="pageSize" id="pageSize" class="form-control" value="25"/>'
				+'</div>'
				+'<div class="col-md-12 col-sm-12 col-xs-12 mt-2 text-right">'
					+'<button class="btn btn-danger  mr-2" onclick="advanceLMSUserSearchReset(\'lmsStudentFilter\')"><i class="fa fa-undo"></i>&nbsp;Reset</button>'
					+'<button class="btn btn-success  mr-2" onclick="advanceLMSUSerSearchPost(\'lmsStudentFilter\',\''+roleAndModule.moduleId+'\','+userId+',\''+role+'\');"><i class="fa fa-search"></i>&nbsp;Search</button>'
				+'</div>'
			+'</div>'
		+'</form>'
	+'</div>';
	
	return html;
}


function getManageLmsUserContent(title, roleAndModule, schoolId, userId, role){
	
	var html=
	`<div class="app-page-title mb-3 py-2">
		<div class="page-title-wrapper">
			<div class="page-title-heading">
				<div class="page-title-icon"> <i class="fa fa-user-plus text-primary"> </i> </div>
				<div>${title}</div>
			</div>
		</div>
	</div>`;
		
	html+='<div class="main-card mt-3 mb-3 card body-tabs-shadow">'
		+'<div class="card-body">'
			+'<div class="row">'
				+'<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">';

			html+='</div>'
			+'</div>'
			+'<div class="full">'
				+getManageLMSFilter(roleAndModule,schoolId,userId,role)
			+'</div>'
			+'<div class="tab-content mt-4">'
				+'<div id="manageLMSUserContentDiv" style="width:100%;display:inline-block"></div>'
				+'<div id="viewStudentLmsContent"></div>'
				+'<div id="studentAssighnTeacherSupportContent"></div>'
			+'</div>'
		+'</div>'
	+'</div>';

	return html;
}

function manageLMSUserTable(tableId, role){
	html='<table id="'+tableId+'" class="table table-bordered table-striped border-radius-table font-12 responsive nowrap" style="width:100%;">'
		+getLMSClassroomHeader(role)
	+'</table><br/>';
	return html;
}

function getViewLmsCredaintial(data){
	var studentlmsList= data.studentlmsList;
	var html=
		`<div class="modal fade" id="studentViewLmsEntryModel" role="dialog">
			<div class="modal-dialog modal-xl">
				<div class="modal-content">
					<div class="modal-header py-2 bg-primary text-white">
						<h5 class="modal-title ">Manage LMS Content : ${data.userName} </h5>
						<button type="button" class="close text-white" data-dismiss="modal">&times;</button>
					</div>
					 <div id="studentViewEditLMSData"></div>
						<div class="col-lg-12" >
							<p class="full">
								<a id="lmsContentSave" href="javascript:void(0);"  class="btn btn-primary blue-bg pull-right" style="display:none;" onclick="saveUserEditedLmsContent('studentLmsContentForm','SAVE')">Save</a>`;
								if(data.lmsRole == 'TEACHER' || (data.lmsRole != 'STUDENT' && data.lmsRole != 'PARENT')){
									html+=
									`<a id="lmsContentAddNewUser" href="javascript:void(0);"  class="btn btn-primary blue-bg pull-right mt-3" style="display:block;"  onclick="return callForLMSContent('${data.userId}','ADDNEW','0','0')">Add New</a>
									<a id="lmsContentAdd" href="javascript:void(0);"  class="btn btn-primary blue-bg pull-right" style="display:none;" onclick="saveUserEditedLmsContent('studentLmsContentForm','ADD')">Confirm & Add </a>`
								}
							html+=`</p>
						</div>
						<br />
						<div class="col-md-12">
							<div style="full">
								<table class="table table-bordered table-striped border-radius-table font-12 responsive nowrap" id="studentLmsContent" style="width:100%">
									<thead class="bg-primary text-white">
										<tr>
										<th class="text-center">S.No</th>
										<th>LMS Platform</th>
										<th>LMS User Name/LMS User Id ${data.sessionUserRole == 'DIRECTOR'?'<br/>LMS Password':''}</th>
										<th>Created Date</th>
										<th>Mail Sent Status</th>
										<th>Action</th>
									</tr>
								</thead>
								<tbody>`;
								var si=1	
								for (let s = 0; s < studentlmsList.length; s++) {
									const lms = studentlmsList[s];
									html+=`<tr>
										<td style="text-align: center;">${si++}</td>
										<td>${lms.courseProviderName}</td>
										<td>${lms.lmsUserName}/<span class="${lms.lmsId}">${lms.lmsUsrId}</span>${data.lmsPasswordShowPermission ==true?'<br/>'+ lms.password :''}</td>
										<td>${lms.lmsCreatedDate}</td>
										<td>`;
										if(lms.emailSentStatus == 0){
											html+=`No`;
										}else{
											html+=`Yes`;
										}
										html+=`</td>
										<td>
											<div class="btn-group">
												<button type='button' id='lms-button' class='btn btn-primary btn-sm  dropdown-toggle' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false' data-toggle='tooltip' title='Action'><i class='fa fa-ellipsis-v'></i></button>
												<div class='dropdown-menu'>`;
													if(ROLE_MODULE.updated=='Y'){
														if(lms.lmsStatus == 1){
															html+=
															`<a href="javascript:void(0);" class="dropdown-item"  onclick="return callForLMSContent('${lms.userId}','EDIT','${lms.courseProviderId}','${lms.lmsId}')">
																<i class="fa fa-edit"></i>&nbsp;Edit Data
															</a>`;
														}
													}
													if(ROLE_MODULE.updated=='Y'){
														if(lms.courseProviderName!='' && lms.lmsStatus == 1){
															html+=
															`<a href="javascript:void(0);"  class="dropdown-item" onclick="return addlmsContent('emailUser','${lms.userId}','87','${lms.lmsId}')">
																<i class="fa fa-envelope"></i>&nbsp;Send Mail 
															</a>`;
														}
													}
													if(ROLE_MODULE.updated=='Y'){
														if(lms.lmsUsrId!=''){
															if(data.lmsRole == 'STUDENT'){
																html+=
																`<a href="javascript:void(0);" class="dropdown-item" onclick="return showWarningMessageShow('Are you sure you want to sync this data? Syncing this data will create a new user/update user details for the student in the LMS?',' callAgilixbuzzSyncUser(\\\'\\\',\\\'${data.lmsRole}\\\',\\\'UU\\\',\\\'${lms.lmsId}\\\',\\\'${lms.courseProviderId}\\\')')">
																	<i class="pe-7s-refresh-2 bold"></i>&nbsp;Sync student user
																</a>`;
															}else if(data.lmsRole == 'PARENT'){
																html+=
																`<a href="javascript:void(0);" class="dropdown-item" onclick="return showWarningMessageShow('Are you sure you want to sync this data? Syncing this data will create a new user/update user details for the parent in the LMS?',' callAgilixbuzzSyncUser(\\\'\\\',\\\'${data.lmsRole}\\\',\\\'UU\\\',\\\'${lms.lmsId}\\\',\\\'${lms.courseProviderId}\\\')')">
																	<i class="pe-7s-refresh-2 bold"></i>&nbsp;Sync parent user
																</a>`;
															}else if(data.lmsRole == 'TEACHER'){
																html+=
																`<a href="javascript:void(0);" class="dropdown-item" onclick="return showWarningMessageShow('Are you sure you want to sync this data? Syncing this data will create a new user/update user details for the teacher in the LMS?',' callAgilixbuzzSyncUser(\\\'\\\',\\\'${data.lmsRole}\\\',\\\'UU\\\',\\\'${lms.lmsId}\\\',\\\'${lms.courseProviderId}\\\')')">
																	<i class="pe-7s-refresh-2 bold"></i>&nbsp;Sync teacher user
																</a>`;
															}else {
																html+=
																`<a href="javascript:void(0);" class="dropdown-item" onclick="return showWarningMessageShow('Are you sure you want to sync this data? Syncing this data will create a new user/update user details for the admin in the LMS?',' callAgilixbuzzSyncUser(\\\'\\\',\\\'${data.lmsRole}\\\',\\\'UU\\\',\\\'${lms.lmsId}\\\',\\\'${lms.courseProviderId}\\\')')">
																	<i class="pe-7s-refresh-2 bold"></i>&nbsp;Sync admin user
																</a>`;
															}
															html+=
																`<a href="javascript:void(0);" class="dropdown-item" onclick="return showWarningMessageShow('Are you sure you want to verify user mail? After verify user email user will get all notification from LMS.',' callAgilixbuzzSyncUser(\\\'\\\',\\\'${data.lmsRole}\\\',\\\'VUM\\\',\\\'${lms.lmsId}\\\',\\\'${lms.courseProviderId}\\\')')">
																	<i class="fa fa-check-circle"></i>&nbsp;Verify user email in LMS
																</a>`;
														}else{
															if(data.lmsRole == 'STUDENT'){
																html+=
																`<a href="javascript:void(0);" class="dropdown-item" onclick="return showWarningMessageShow('Are you sure you want to sync this data? Syncing this data will create a new user/update user details for the student in the LMS?',' callAgilixbuzzSyncUser(\\\'\\\',\\\'${data.lmsRole}\\\',\\\'CU\\\',\\\'${lms.lmsId}\\\',\\\'${lms.courseProviderId}\\\')')">
																	<i class="pe-7s-refresh-2 bold"></i>&nbsp;Sync student user
																</a>`;
															}else if(data.lmsRole == 'PARENT'){
																html+=
																`<a href="javascript:void(0);" class="dropdown-item" onclick="return showWarningMessageShow('Are you sure you want to sync this data? Syncing this data will create a new user/update user details for the parent in the LMS?',' callAgilixbuzzSyncUser(\\\'\\\',\\\'${data.lmsRole}\\\',\\\'CU\\\',\\\'${lms.lmsId}\\\',\\\'${lms.courseProviderId}\\\')')">
																	<i class="pe-7s-refresh-2 bold"></i>&nbsp;Sync parent user 
																</a>`;
															}else if(data.lmsRole == 'TEACHER'){
																html+=
																`<a href="javascript:void(0);" class="dropdown-item" onclick="return showWarningMessageShow('Are you sure you want to sync this data? Syncing this data will create a new user/update user details for the teacher in the LMS?',' callAgilixbuzzSyncUser(\\\'\\\',\\\'${data.lmsRole}\\\',\\\'CU\\\',\\\'${lms.lmsId}\\\',\\\'${lms.courseProviderId}\\\')')">
																	<i class="pe-7s-refresh-2 bold"></i>&nbsp;Sync teacher user
																</a>`;
															}else {
																html+=
																`<a href="javascript:void(0);" class="dropdown-item" onclick="return showWarningMessageShow('Are you sure you want to sync this data? Syncing this data will create a new user/update user details for the admin in the LMS?',' callAgilixbuzzSyncUser(\\\'\\\',\\\'${data.lmsRole}\\\',\\\'UU\\\',\\\'${lms.lmsId}\\\',\\\'${lms.courseProviderId}\\\')')">
																	<i class="pe-7s-refresh-2 bold"></i>&nbsp;Sync admin user
																</a>`;
															}
														}
														html+=
															`<a href="javascript:void(0);" class="dropdown-item" id="pullDownEnrollment" onclick="return showWarningMessageShow('Are you sure you want to pull down data from LMS? Pull down data will update userlmsid in SMS.',' callAgilixbuzzSyncUser(\\\'\\\',\\\'${data.lmsRole}\\\',\\\'PULLUSER\\\',\\\'${lms.lmsId}\\\',\\\'${lms.courseProviderId}\\\')')">
																<i class="fa fa-angle-double-down"></i>&nbsp;Pull lmsuserid
															</a>
															<a href="javascript:void(0);" class="dropdown-item" id="lmsuserInactive${lms.lmsId}" style="display:${lms.lmsStatus == 1?'inline-block;':'none;'}" onclick="return callForAdminLMSContent('${lms.userId}','INACTIVE','${lms.courseProviderId}','${lms.lmsId}')">
																<i class="fa fa-toggle-on"></i>&nbsp;Inactivate LMS 
															</a>
															<a href="javascript:void(0);" class="dropdown-item" id="lmsuserActive${lms.lmsId}" style="display:${lms.lmsStatus == 0?'inline-block;':'none;'}" onclick="return callForAdminLMSContent('${lms.userId}','ACTIVE','${lms.courseProviderId}','${lms.lmsId}')">
																<i class="fa fa-toggle-off"></i>&nbsp;Activate LMS
															</a>`;
													}
													if(ROLE_MODULE.viewed=='Y'){
														html+=
														`<a href="javascript:void(0);" class="dropdown-item" onclick="return callForLMSContent('${lms.userId}','VIEW','${lms.courseProviderId}','${lms.lmsId}')">
															<i class="fa fa-eye"></i>&nbsp;View
														</a>`;
													}
												html+=`</div>
											</div>
											
										</td>
									</tr>`;
									
								}
									html+=`</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>`;
		return html;
}
