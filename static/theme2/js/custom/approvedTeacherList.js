function getApprovedTeacherBesicData(moduleId, userId, schoolId, ids, types, callFrom) {
	if(userId=='' || userId==undefined){
		userId=USER_ID;
	}
	var data={};
	data['ids']=ids;
	data['types']=types;
	data['userId']=userId;
	data['moduleId'] = moduleId;
	data['schoolId'] = schoolId;
	data['callFrom'] = callFrom;
	return new Promise(function(resolve, reject){
		$.ajax({
			type : "POST",
			contentType : APPLICATION_JSON_VALUE,
			url : BASE_URL + CONTEXT_PATH + SCHOOL_UUID +'/dashboard/get-approved-teacher-basic-data',
			data : JSON.stringify(data),
			dataType : 'json',
			async:true,
			global : true,
			success : function(data) {
				//console.log(data);
				if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
					if (data['status'] == '3') {
						redirectLoginPage();
					} 
					return reject()
				}else{
					resolve(data)
	
				}
			}
		});
	});
}

function getApprovedTeacherList(moduleId, userId, schoolId, ids, types, currentPage) {
 hideMessageTheme2('');
 if(userId=='' || userId==undefined){
		userId=USER_ID;
	}
	var data={};
	data['ids']=ids;
	data['types']=types;
	data['userId']=userId;
	data['moduleId'] = moduleId;
	data['schoolId'] = schoolId;
	data['currentPage'] = currentPage;
	data['recordsPerPage'] = $("#approvePagging").val();
	data['teacherSearch'] = $("#teacherSearch").val()!=undefined?$("#teacherSearch").val():"";
 $.ajax({
	 type : "POST",
	 contentType : APPLICATION_JSON_VALUE,
	 url : getURLForHTML('dashboard','teacher-profile-approved-list'),
	 data : JSON.stringify(data),
	 dataType : 'json',
	 cache : false,
	 timeout : 600000,
	 success : function(data) {
		console.log(data);
		 if (data['status'] == '0' || data['status'] == '2') {
			 showMessageTheme2(0, data['message'],'',true);
		 } else {
			
			var html=getApprovedTeacherListHtml(data.teahcerRequestList);
			$("#approvedTeacherBody").html(html);
			showDropdownCustomView('myApprovedTeacher');
			 var htmlpage=dataApprovedTeacherListPagging(data, moduleId,  userId, schoolId, ids, types);
            $(".approvedTeacherListpaging").html(htmlpage);

			 
		 }
		 return false;
	 }
 });
}

function getWithdrawTeacherList(moduleId, userId, schoolId, ids, types, currentPage) {
 hideMessageTheme2('');
 if(userId=='' || userId==undefined){
		userId=USER_ID;
	}
	var data={};
	data['ids']=ids;
	data['types']=types;
	data['userId']=userId;
	data['moduleId'] = moduleId;
	data['schoolId'] = schoolId;
	data['currentPage'] = currentPage;
	data['recordsPerPage'] = $("#approvePagging").val();
	data['teacherSearch'] = $("#teacherSearch").val()!=undefined?$("#teacherSearch").val():"";

 $.ajax({
	 type : "POST",
	 contentType : APPLICATION_JSON_VALUE,
	 url : getURLForHTML('dashboard','teacher-profile-withdraw-list'),
	 data : JSON.stringify(data),
	 dataType : 'json',
	 cache : false,
	 timeout : 600000,
	 success : function(data) {
		console.log(data);
		 if (data['status'] == '0' || data['status'] == '2') {
			 showMessageTheme2(0, data['message'],'',true);
		 } else {
			
			var html=getApprovedTeacherListHtml(data.teahcerRequestList);
			$("#approvedTeacherBody").html(html);
			showDropdownCustomView('myApprovedTeacher')
			var htmlpage=dataWithdrawTeacherListPagging(data, moduleId,  userId, schoolId, ids, types);
            $(".approvedTeacherListpaging").html(htmlpage);

			 
		 }
		 return false;
	 },
	 error : function(e) {
		 //showMessageTheme2(0, e.responseText);
		 return false;
	 }
 });
}


function getApprovedTeacherListHtml(teahcerRequestList){
	var html='';
	if(teahcerRequestList.length>0){
		for (let iu = 0; iu < teahcerRequestList.length; iu++) {
			const teacherRequest = teahcerRequestList[iu];
			var teacherFirstReset=teacherRequest.teacherFirstReset;
			html+=
			`<tr>
				<td style="text-align:center;">${teacherRequest.srNo}</td>`;
				if(OBJECT_RIGHTS.withDraw=='N'){
					html+=`<td>${teacherRequest.name}<br/>${teacherRequest.userName}<br/>${teacherRequest.timeZone}</td>`;
				}else{
					html+=`<td>${teacherRequest.name}<br/>${teacherRequest.timeZone}</td>
						<td>${teacherRequest.userName}</td>`;
				}

				html+=`<td>${teacherRequest.applicationNo}</td>
				<td>${teacherRequest.employeeType!=undefined?teacherRequest.employeeType:''}<br/>${teacherRequest.employeeStartDate!=undefined?teacherRequest.employeeStartDate:''}</td>
				<td id="course-suffix-${teacherRequest.userId}">${teacherRequest.courseSuffix!=undefined?teacherRequest.courseSuffix:''}</td>`;
				if(schoolSettingsTechnical.meetingProvServiceReq == 'Y'){
					html+=`<td>`;
					if(teacherRequest.meetingVendorZ == 'ZOOM'){
						html+=`<br/>ZOOM:`;
						if(teacherRequest.zoomMeetingUserStatus == 'create'){
							html+=`<a href="javascript:void(0);" onclick="return showTeacherStatusPopup('Are you sure you want to create the ${teacherRequest.meetingVendorZ} user?', 'create', '${teacherRequest.zoomMeetingId}', '${teacherRequest.userId}','${teacherRequest.meetingVendorZ}');">Create</a>`;
						}else if(teacherRequest.zoomMeetingUserStatus == 'Inactive'){
							html+=`<a href="javascript:void(0);" onclick="return showTeacherStatusPopup('Are you sure you want to Activate the ${teacherRequest.meetingVendorZ} user?', 'Inactive', '${teacherRequest.zoomMeetingId}','${teacherRequest.userId}','${teacherRequest.meetingVendorZ}');">Activate</a>`;
						}else{
							html+=`<a href="javascript:void(0);" onclick="return showTeacherStatusPopup('Are you sure you want to Deactivate the ${teacherRequest.meetingVendorZ} user?','Active', '${teacherRequest.zoomMeetingId}','${teacherRequest.userId}','${teacherRequest.meetingVendorZ}');">Deactivate</a>`;
						}
					}
					html+=`</td>`;
				}
				
				html+=`<td>${teacherRequest.profileStatus!=undefined?teacherRequest.profileStatus:''}</td>
				<td><a href="javascript:void(0);" onclick="getAsPost('/dashboard/profile-view-content?userId=${teacherRequest.userId}&moduleId=${teacherRequest.mangeUserListModId}&actionType=1a')" class="waves-effect">Click here</a></td>`;
				if(roleAndModule.viewed=='Y'){
					html+=
					`<td>
						<a onclick="return callUserActivity('formId','${teacherRequest.userId}','true','false',${moduleId});" href="javascript:void(0);" class="waves-effect">Click here</a>
					</td>
					<td style="text-align: center">
						<div class="btn-group">
							<button type="button" class="btn btn-primary  dropdown-toggle  btn-sm"
								data-toggle="dropdown" aria-haspopup="true"
								aria-expanded="false" data-toggle="tooltip" title="Action">
								<i class="fa fa-ellipsis-v"></i>
							</button>
							<div class="dropdown-menu">`;
								if(OBJECT_RIGHTS.withDraw=='N'){
									if(ROLE_MODULE.updated=='Y' || ROLE_MODULE.added=='Y'){
										html+=`<a class="dropdown-item" onclick="getAssignedSubjectToTeacher('${teacherRequest.userId}');" href="javascript:void(0);"><i class="fa fa-book"></i>&nbsp; Assign Courses</a>`;
									}
									if(SCHOOL_ID != 4){
										if(ROLE_MODULE.viewed=='Y'){
											html+=`<a class="dropdown-item" onclick="callForPaymentHistory(true,'paymentForm', 'view', '${teacherRequest.teacherId}','TEACHER','','');" href="javascript:void(0);"><i class="fa fa-money-bill"></i>&nbsp; Payment History</a>`;
										}
									}
									if(ROLE_MODULE.updated=='Y' || ROLE_MODULE.added=='Y'){
										if(SCHOOL_ID != 4){
											html+=`<a class="dropdown-item" onclick="showAddPaymentForm('addNewPayment', 'add', '${teacherRequest.teacherId}','TEACHER','${teacherRequest.name}');" href="javascript:void(0);"><i class="fa fa-dollar-sign"></i>&nbsp; Add Payment Entry</a>`;
										}
										html+=`<a class="dropdown-item" onclick="callTeacherOfficialEmailModal('${teacherRequest.teacherId}','${teacherRequest.userId}','${teacherRequest.officialEmail}','${teacherRequest.gotoMeetingIdT}','${teacherRequest.gotoMeetingPasswordT}','${teacherRequest.zoomMeetingPassword}','${teacherRequest.teamMeetingUserStatus}' );" href="javascript:void(0);"><i class="fa fa-envelope"></i>&nbsp; Add/Edit Official Email</a>`;
										if(teacherRequest.officialEmail!=''){
											html+=`<a class="dropdown-item" onclick="return showWarningMessage('Are you sure you want to delete?','saveTeacherOfficialMail(\\\'teacherOfficialMailForm\\\',\\\'TEACHER\\\',\\\'DELETE\\\',\\\'${teacherRequest.teacherId}\\\',\\\'${moduleId}\\\') '); " href="javascript:void(0);"><i class="fa fa-trash"></i>&nbsp; Remove Official Email</a>`;
										}
									}
									if(SCHOOL_ID != 4){
										if(USER_ROLE=='SCHOOL_ADMIN' || USER_ROLE=='DIRECTOR' || USER_ROLE=='FIN_ADMIN'){
											if(ROLE_MODULE.updated=='Y' || ROLE_MODULE.added=='Y'){
												html+=`<a class="dropdown-item" target="_blank" href="${teacherRequest.teacherCompUrl}"><i class="fa fa-dollar-sign"></i>&nbsp;Teacher Salary</a>`;
											}
										}
									}
									if(ROLE_MODULE.updated=='Y' || ROLE_MODULE.added=='Y'){
										html+=`<a class="dropdown-item" onclick="return showWarningMessage('Are you sure you want to withdraw?','saveTeacherOfficialMail(\\\'teacherOfficialMailForm\\\',\\\'TEACHER\\\',\\\'WITHDRAW\\\', \\\'${teacherRequest.teacherId}\\\',\\\'${moduleId}\\\',\\\'approved\\\') '); " href="javascript:void(0);"><i class="fa fa-edit"></i>&nbsp;Withdraw Teacher</a>`;
									}
									if(teacherRequest.blockUnblockStatus == 'N' && (ROLE_MODULE.updated=='Y' || ROLE_MODULE.added=='Y')){
										html+=`<a class="dropdown-item" onclick="return showWarningMessage('Are you sure you want to Block','saveTeacherOfficialMail(\\\'teacherOfficialMailForm\\\',\\\'TEACHER\\\',\\\'BLOCK\\\',\\\'${teacherRequest.teacherId}\\\',\\\'${moduleId}\\\',\\\'approved\\\') '); " href="javascript:void(0);"><i class="fa fa-edit"></i>&nbsp;Block Teacher</a>`;
									}
									if(teacherRequest.blockUnblockStatus == 'Y' && (ROLE_MODULE.updated=='Y' || ROLE_MODULE.added=='Y')){
										html+=`<a class="dropdown-item" onclick="return showWarningMessage('Are you sure you want to Unblock','saveTeacherOfficialMail(\\\'teacherOfficialMailForm\\\',\\\'TEACHER\\\',\\\'UNBLOCK\\\',\\\'${teacherRequest.teacherId}\\\',\\\'${moduleId}\\\',\\\'approved\\\') '); " href="javascript:void(0);"><i class="fa fa-edit"></i>&nbsp;Unblock Teacher</a>`;
									}
								}
								if(OBJECT_RIGHTS.withDraw=='Y'){
									if(ROLE_MODULE.updated=='Y' || ROLE_MODULE.added=='Y'){
										html+=`<a class="dropdown-item" onclick="return showWarningMessage('Are you sure you want to activate?','saveTeacherOfficialMail(\\\'teacherOfficialMailForm\\\',\\\'TEACHER\\\',\\\'ACTIVATE\\\',\\\'${teacherRequest.teacherId}\\\',\\\'${moduleId}\\\',\\\'withdraw\\\') '); " href="javascript:void(0);"><i class="fa fa-edit"></i>&nbsp;Activate Teacher</a>
												<a class="dropdown-item" target="_blank" href="${teacherRequest.teacherCompUrl}"><i class="fa fa-dollar-sign"></i>&nbsp;Teacher Salary</a>`;
									}
									
								}
								if(ROLE_MODULE.updated=='Y' || ROLE_MODULE.added=='Y'){
									// html+=`<a class="dropdown-item" onclick="return callSchoolInneraction('teacher-agreement','?userId=${teacherRequest.userId}&controlType=editAgain&moduleId=${ROLE_MODULE.moduleId}','section-linebox');" href="javascript:void(0);"><i class="fa fa-edit"></i>&nbsp;Edit Agreement</a>`;
								}
								if(teacherRequest.teacherFirstReset == '0' &&(ROLE_MODULE.updated=='Y' || ROLE_MODULE.added=='Y')){
									html+=`<a class="dropdown-item" href="javascript:void(0);" onclick="return callChangePasswordModal('${teacherRequest.userId}');"><i class="fa fa-edit"></i>&nbsp;Manage LMS Credentials</a>`;
								}
								if(teacherRequest.courseSuffix == 'N/A'){
									html+=`<a class="dropdown-item" href="javascript:void(0);" onclick="return generateCourseSuffix('${teacherRequest.userId}');"><i class="fa fa-edit"></i>&nbsp;Generate Course Suffix</a>`;
								}
								if((ROLE_MODULE.updated=='Y' || ROLE_MODULE.added=='Y') &&  (teacherRequest.gotoMeetingUserId!="" && teacherRequest.gotoMeetingUserId != '0')){
									html+=`<a class="dropdown-item"  href="javascript:void(0);" onclick="return saveTeacherOfficialMail('teacherOfficialMailForm','TEACHER','REFRESH_TOKEN','${teacherRequest.teacherId}','${ROLE_MODULE.moduleId}','Refresh_Token');"><i class="fa fa-edit"></i>&nbsp;Refresh Token</a>`;
								}
								if(teacherRequest.showPaySlipOption == 'Y' && ROLE_MODULE.viewed == 'Y'){
									html+=`<a class="dropdown-item"  target="_blank" href="${teacherRequest.teacherPaySlipUrl}"><i class="fa fa-dollar-sign"></i>&nbsp;Pay Slips</a>`;
								}	
								if(ROLE_MODULE.updated=='Y' || ROLE_MODULE.added=='Y'){
									// html+=`<a class="dropdown-item" onclick="return callSchoolInneraction('teacher-agreement','?userId=${teacherRequest.userId}&controlType=editAgain&moduleId=${ROLE_MODULE.moduleId}','section-linebox');" href="javascript:void(0);"><i class="fa fa-edit"></i>&nbsp;Edit Agreement</a>`;
									html+=`<a class="dropdown-item" onclick="addTeacherContract('${teacherRequest.userId}', '${teacherRequest.name}', '${teacherRequest.email}', '${teacherRequest.contractId}')" href="javascript:void(0);"><i class="fa fa-edit"></i>&nbsp;Edit Agreement</a>`;
									if(teacherRequest.showPtmOption == 'Y'){
										html+=`<a class="dropdown-item"   href="javascript:void(0);" onclick="return showWarningMessage('Are you sure you want to inactive book a PTM Option?','activateInactiveBookaClassForPtmAndCustom(\\\'teacherOfficialMailForm\\\',\\\'TEACHER\\\',\\\'PTM\\\',\\\'${teacherRequest.teacherId}\\\',\\\'${moduleId}\\\',\\\'N\\\') '); "><i class="fa fa-edit"></i>&nbsp;Inactive Book a PTM Option</a>`;
									}else{
										html+=`<a class="dropdown-item"   href="javascript:void(0);" onclick="return showWarningMessage('Are you sure you want to activate book a PTM Option?','activateInactiveBookaClassForPtmAndCustom(\\\'teacherOfficialMailForm\\\',\\\'TEACHER\\\',\\\'PTM\\\',\\\'${teacherRequest.teacherId}\\\',\\\'${moduleId}\\\',\\\'Y\\\') '); "><i class="fa fa-edit"></i>&nbsp;Activate Book a PTM Option</a>`;
									}
									if(teacherRequest.showCustomOption == 'Y'){
										html+=`<a class="dropdown-item"   href="javascript:void(0);" onclick="return showWarningMessage('Are you sure you want to inactive create custom class Option?','activateInactiveBookaClassForPtmAndCustom(\\\'teacherOfficialMailForm\\\',\\\'TEACHER\\\',\\\'CUSTOM\\\',\\\'${teacherRequest.teacherId}\\\',\\\'${moduleId}\\\',\\\'N\\\') '); "><i class="fa fa-edit"></i>&nbsp;Inactive Create Custom Class Option</a>`;
									}else{
										html+=`<a class="dropdown-item"   href="javascript:void(0);" onclick="return showWarningMessage('Are you sure you want to activate create custom class Option?','activateInactiveBookaClassForPtmAndCustom(\\\'teacherOfficialMailForm\\\',\\\'TEACHER\\\',\\\'CUSTOM\\\',\\\'${teacherRequest.teacherId}\\\',\\\'${moduleId}\\\',\\\'Y\\\') '); "><i class="fa fa-edit"></i>&nbsp;Activate Create Custom Class Option</a>`;
									}
									html+=`<a class="dropdown-item" onclick="callTeacherAddBufferAvailaibilitylModal('${teacherRequest.teacherId}','${teacherRequest.userId}','${teacherRequest.bufferHoursToAddAvailability == undefined ? "" : teacherRequest.bufferHoursToAddAvailability}');" href="javascript:void(0);"><i class="fa fa-edit"></i>&nbsp; Add/Edit Buffer Hours to Add Availability</a>`;

								}
							html+=`</div>
						</div>
					</td>`;
				}
			html+=`</tr>`;
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
function removeLi(id){
	$('#selectedSubject-'+id).remove();
	$("#subjectId-"+id).removeClass("bg-success text-white greenDiv");
	$('#subjectStartDate-'+id).val('');
}
function generateCourseSuffix(userId){
	const data = {userId}
	$.ajax({
		type : "POST",
		contentType: APPLICATION_JSON_VALUE,
		url : getURLForHTML('dashboard','generate-course-suffix'),
		data : JSON.stringify(data),
		dataType : 'json',
		success : function(data) {
			if(data.status !== 1){
				showMessageTheme2(0, data.message);
				return;
			}
			showMessageTheme2(1, data.message);
			const suffix = data.suffix;
			const id = "#course-suffix-"+userId;
			$(id).html(suffix)
		}
	});
}

function subjectSearchGofun(){
	getSubjectListToTeacher($("#userId").val());
}