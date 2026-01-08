
var OBJECT_RIGHTS="";
var schoolSettingsTechnical;
var courseTypeList;
var gradeList
var PRESERVE_CURRENT_SUBJECTS='';
var PRESERVE_CURRENT_PLACEMENT_SUBJECTS='';
async function renderApprovedTeacherDashboard(title, roleAndModule, SCHOOL_ID, USER_ID,USER_ROLE, ids, types,callFrom){
	schoolSettingsTechnical = await getSchoolSettingsTechnical(SCHOOL_ID);
  	var objRight= await getApprovedTeacherBesicData(roleAndModule.moduleId, USER_ID, SCHOOL_ID, ids,types, callFrom);
	var objectRights=objRight.objectRights;
	OBJECT_RIGHTS=objectRights;
	courseTypeList=JSON.parse(OBJECT_RIGHTS.courseTypeList);
	gradeList=JSON.parse(OBJECT_RIGHTS.gradeList);
	
	var html= await getApprovedTeacherListContent(title, roleAndModule.moduleId);
    $('#dashboardContentInHTML').html(html);
	// callRoleDropdown("adminFilter",'','roleUser');
	if(callFrom=='withdraw'){
		getWithdrawTeacherList(roleAndModule.moduleId, USER_ID, SCHOOL_ID, ids, types, 0) ;
	}else{
		getApprovedTeacherList(roleAndModule.moduleId, USER_ID, SCHOOL_ID, ids, types, 0) ;
	}
	
	courseProviderList('assignSubjectsTeacher','courseProvider');
	// getSessionMasterList('autoStudentSearchForm', 'acadmicYear', false);
	// getAutoWeeklyProgressList(roleAndModule.moduleId, 0,0);
	// $("#autoStudentSearchForm #standardId").select2({
	// 	theme:"bootstrap4",
	// 	dropdownParent:"#autoStudentSearchForm"
	// });
	$("#cancelSubject").unbind('click').bind('click', function(){
		$('#standardId').val('0');
		$('#courseName').val('');
		$("#assignSubjectsTeacher").modal("hide");
	});

	$(".selectedSubject").html('');

	$(document).ready(function() {
		// bindFileUploadNew1('1', '2','${userId}',3);
		var startDate = new Date();
		startDate.setMonth(startDate.getMonth() - 3);

		var endDate = new Date();
		$('#paymentDate').datepicker({
			autoclose : true,
			format : 'mm-dd-yyyy',
			startDate : startDate,
			endDate : endDate
		});
		startDate = new Date();
		startDate.setYear(startDate.getYear() - 1);

		endDate = new Date();
		$('#paymentDateSearch').datepicker({
			autoclose : true,
			format : 'mm-dd-yyyy',
			startDate : startDate,
			endDate : endDate
		});
		bindFileUploadNew1('1', '2','${userId}',4);
		var startDate = new Date();
		startDate.setMonth(startDate.getMonth() - 3);


	});

	$("#teacherSearch").on('keyup', function (e) {
		if($("#teacherSearch").val().length>=3){
			if(callFrom=='withdraw'){
				getWithdrawTeacherList(roleAndModule.moduleId, USER_ID, SCHOOL_ID, ids, types, 0) ;
			}else{
				getApprovedTeacherList(roleAndModule.moduleId, USER_ID, SCHOOL_ID, ids, types, 0) ;
			}
		}else if($("#teacherSearch").val().length==0){
			if(callFrom=='withdraw'){
				getWithdrawTeacherList(roleAndModule.moduleId, USER_ID, SCHOOL_ID, ids, types, 0) ;
			}else{
				getApprovedTeacherList(roleAndModule.moduleId, USER_ID, SCHOOL_ID, ids, types, 0) ;
			}
		}
	});

	$("#approvePagging").on('change', function (e) {
		if(callFrom=='withdraw'){
			getWithdrawTeacherList(roleAndModule.moduleId, USER_ID, SCHOOL_ID, ids, types, 0) ;
		}else{
			getApprovedTeacherList(roleAndModule.moduleId, USER_ID, SCHOOL_ID, ids, types, 0) ;
		}
	});	
}

function getApprovedTeacherListContent(title, moduleId){
	var html='<div class="app-page-title mb-3 py-2">'
		+'<div class="page-title-wrapper">'
		+'		<div class="page-title-heading">'
		+'			<div class="page-title-icon">'
		+'				<i class="fas fa-university text-primary"></i>'
		+'			</div>'
		+'			<div>'+title+'</div>'
		+'		</div>'
		+'		<div class="page-title-actions">'
		+'		</div>'
		+'	</div>'
		+'</div>';
	html+=getApprovedTeacherListContentCard(moduleId);
	return html;
}

function getApprovedTeacherListContentCard(moduleId){
	var html=`<div class="main-card mb-3 card">
	<div class="card-body">
	<input type="hidden" class="form-control" id="userId" name="userId" value="">`
	html+=getApprovedTeachersList()
	html+=`</div>
	</div>`;
	html+=getAssignSubjectsTeacher();
	html+=getUserActivity();
	html+=getCommonPaymentModel();
	html+=getCommonAddPaymentModel();
	html+=getTeacherAddBufferAvailaibilityModel();
	html+=getTeacherOfficialModel();
	html+=getTeacherAgreementModal(moduleId);
	html+=getShowMessageCreateUser();
		
	return html;
}

function getApprovedTeachersList(){
	var html=`
		<div class="row">
			<div class="col-lg-12 col-md-12">
				<div class="table-responsive">
					
					<div class="d-flex align-items-center flex-wrap justify-content-end mb-2" style="gap:0.5rem">
						<div class="btn-actions-pane-left">
							<select name="approvePagging" id="approvePagging" class="form-control form-control-sm ml-1">
								<option value="10" >10</option>
								<option value="25" >25</option>
								<option value="50">50</option>
								<option value="100">100</option>
							</select>
						</div>	
						<div class="btn-actions-pane-right">
							<input type="text" name="teacherSearch" id="teacherSearch" class="w-fit-content form-control form-control-sm" placeholder="Search" />
						</div>
					</div>
					<table id="myApprovedTeacher" class="table table-bordered table-striped border-radius-table font-12 responsive nowrap" style="width:100%">
						<thead class="bg-primary text-white">
							<tr>
								<th style="text-align:center;">S.No</th>`;
								if(OBJECT_RIGHTS.withDraw=='N'){
									html+='<th>Teacher Details</th>';
								}else{
									html+='<th>Name</th>'
										+'<th>User Name</th>';
								}
								html+=`<th>Application No.</th>
								<th>Employee Type<br/>Employment Conversion Date</th>
								<th>Course Suffix</th>`;
								if(schoolSettingsTechnical.meetingProvServiceReq=='Y'){
									html+='<th>Meeting Vendor User</th>';
								}
							
								html+=`<th>Profile Status</th>
								<th>View Profile</th>`;
								if(roleAndModule.viewed=='Y'){
									html+=`<th>Activity Log</th>
									<th>Action</th>`;
								}
							html+=`</tr>
						</thead>
						<tbody id="approvedTeacherBody">
						</tbody>
					</table>
				</div>
			</div>
		</div>
		
		<div class="approvedTeacherListpaging"></div>
		<div id="viewStudentLmsContent"></div>`;
	return html;
}

function getUserActivity(){
	var html=`<div id="divHistoryRemarks"></div>
	<div id="userActivityHTML"></div>
	<div class="modal fade" id="commonCommentsLogsModel" role="dialog">
		<div class="modal-dialog modal-lg" style="margin-top:70px;">
			<div class="modal-content">
				<div class="modal-header py-2 bg-primary text-white">
					<h5 class="modal-title" id="commonCommentTitle">Past Comments</h5>
					<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div id="commonCommentsLogsModelContents" class="modal-body" style="height:500px;overflow:auto;">
					
				</div>
			</div>
		</div>
	</div>`;
	return html;
}

function getAssignSubjectsTeacher(){
	var html=`<div class="modal fade" id="assignSubjectsTeacher"  role="dialog" aria-labelledby="currentSubjectModalLabel" aria-hidden="true">
	<div class="modal-dialog modal-xl" role="document">
		<div class="modal-content" style="margin:60px auto;">
			<div class="modal-header py-2 bg-primary text-white" >
				<h5 class="modal-title" id="currentSubjectModalLabel">Assign Courses</h5>
			</div>
			<div class="modal-body overflow-y-auto" style="max-height:400px;">
				<input type="hidden" name="userId" id="userId"/>
				<div class="row mb-2">
					<div class="col-lg-2 col-md-4 col-sm-6 col-12">
						<label>LMS Platform:  </label>
						<select id="courseProvider"  name="courseProvider" class="form-control">
						</select>
					</div>
					<div class="col-lg-2 col-md-4 col-sm-6 col-12">
						<label for="inputState">Course Type</label> 
						<select id="courseType" class="form-control">`;
						for (let c = 0; c < courseTypeList.length; c++) {
							const courseType = courseTypeList[c];
							html+=`<option value="${courseType.metaKey}" >${courseType.metaValue}</option>`;
						}
						html+=`</select>
					</div>
					<div class="col-lg-2 col-md-4 col-sm-6 col-12">
						<label for="inputState">Grade</label> 
						<select id="standardId" class="form-control">
							<option value="0">Choose Grade</option>`
							for (let g = 0; g < gradeList.length; g++) {
							const grade = gradeList[g];
							html+=`<option value="${grade.key}" >${grade.value}</option>`;
						}
						html+=`</select>
					</div>
					<div class="col-lg-2 col-md-4 col-sm-6 col-12">
						<label>Course Name:</label>
						<input type="text" name="courseName" id="courseName" class="form-control" autocomplete="off"/>
					</div>
					<div class="col-lg-2 col-md-4 col-sm-6 col-12">					
						<label>Flex:</label>
						<select id="flaxStatus" class="form-control">
							<option value="No">No</option>
							<option value="Yes">Yes</option>
						</select>
					</div>	
					<div class="col-lg-2 col-md-4 col-sm-6 col-12">
						<label class="full">&nbsp;</label>
						<button type="button" class="btn btn-md btn-success" id="subjectSearchGo" onclick="subjectSearchGofun()"> Go </button>
					</div>
				</div>
				<div class="row">
					<div class="col-lg-5 col-md-12 col-sm-12 col-12" id="teacherAddCourseSelectionlist"></div>
					<div class="col-lg-7 col-md-12 col-sm-12 col-12" id="teacherAssignedCourse"></div>
				</div>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-danger " id="cancelSubject" style="float:left;">Cancel</button>
				<button type="button" class="btn btn-success" id="saveSubject" onclick="callForUpdateCourseFee(${roleAndModule.moduleId},${SCHOOL_ID});" style="margin-right:12px;">Update Course</button>
			</div>
		</div>
	</div>
</div> `;
	return html;
}

function getCommonPaymentModel(){
	var html=`<div class="modal fade" id="commonPaymentModel" role="dialog">
	<div class="modal-dialog modal-xl" style="max-width:1000px !important;">
		<div class="modal-content">
			<div class="modal-header py-2 bg-primary text-white">
				<h5 class="modal-title" id="commonPaymentModelTitle">Payment History</h5>
				<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>
			<div class="modal-body" style="max-height: 500px; overflow: auto;">
					<form id="searchpaymentHistory" name="searchpaymentHistory" action="javascript:void(0);" method="post">
						<div class="row">
						<div class="col-lg-5 col-md-5 col-sm-4 col-12">
							<div class="form-group">
								<label>Date</label>
								<input type="hidden" class="form-control" id="entityIdSearch" value="">
								<input type="hidden" class="form-control" id="entityNameSearch" value="">
								<input type="text" class="form-control" id="paymentDateSearch" placeholder="Payment Date" readonly onkeydown="return false">
							</div>
						</div>
						<div class="col-lg-5 col-md-5 col-sm-4 col-12">
							<div class="form-group">
								<label>Payment Method</label>
								<select id="paymentModeSearch" name="paymentModeSearch" class="form-control" style="width: 100%;">
									<option value=""></option>
									<option value="PayPal">PayPal</option>
									<option value="Bank Transfer">Bank Transfer</option>
								</select>
							</div>
						</div>
						<div class="col-lg-2 col-md-2 col-sm-4 col-12 text-center">
							<label class="full">&nbsp;</label>
							<button type="submit" class="btn btn-success btn-lg " onclick="searchPaymentHistory('searchpaymentHistory', '', 'TEACHER')">Apply</button>
						</div>
						</div>
					</form>
				
				<div style="clear: both"></div>
				<hr>
				<br>
				<div id="commonPaymentModelContents"></div>
			</div>
		</div>
	</div>
</div>`;
return html;
}

function getCommonAddPaymentModel(){
	var html=`<div class="modal fade" id="commonAddPaymentModel" role="dialog">
	<div class="modal-dialog modal-lg" style="margin-top: 70px;">
		<div class="modal-content">
			<div class="modal-header py-2 bg-primary text-white" >
				<h5 class="modal-title" id="commonAddPaymentModelTitle">Add Payment History</h5>
				<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>
			<div id="commonAddPaymentModelContents" class="modal-body">
				<form class="pay-his" id="addPaymentHistory" name="addPaymentHistory" action="javascript:void(0);" method="post">
					<div class="row">
						<div class="col-md-12 text-center">
							<p class="" style="font-size: 12px; text-align: center; margin: 0; height: 25px;" id="modalMessageNew"></p>
						</div>
						<div class="col-md-6">
							<div class="form-group">
								<label>Teacher Name</label>
								<input type="text" id="userName" class="form-control" name="userName" value="" disabled>
								<input type="hidden" id="paymentId" class="form-control" name="paymentId" value="">
								<input type="hidden" id="userId" class="form-control" name="userId" value="${USER_ID}" >
								<input type="hidden" id="entityId" class="form-control" name="entityId" value="" >
								<input type="hidden" id="entityName" class="form-control" name="entityName" value="">
							</div>
						</div>
						<div class="col-md-6">
							<div class="form-group">
								<label>Payment Date</label>
								<input type="text" id="paymentDate" class="form-control" name="paymentDate" value="" readonly onkeydown="return false">
							</div>
						</div>
						<div class="col-md-6">
							<div class="form-group">
								<label>Payment Mode</label>
								<select id="paymentMode" name="paymentMode" class="form-control">
									<option value="">Select Payment Mode</option>
									<option value="PayPal">PayPal</option>
									<option value="Bank Transfer">Bank Transfer</option>
								</select>
							</div>
						</div>
						<div class="col-md-6">
							<div class="form-group">
								<label>Payment Amount</label>
								<div class="row">
									<div class="col-md-4">
										<select id="paymentCurrency" name="paymentCurrency" class="form-control">
											<option value="">Select Currency</option>
											<option value="USD">USD</option>
											<option value="INR">INR</option>
										</select>
									</div>
									<div class="col-md-8">
										<input type="text" class="form-control" id="paymentAmount" name="paymentAmount" value="" placeholder="Amount" maxlength="7" onkeydown="return M.floatDigit(event);">
									</div>
								</div>
							</div>
						</div>
						<div class="col-md-6">
							<div class="form-group">
								<label>Remark</label>
								<textarea id="remarks" name="remarks" class="form-control" rows="2" cols="" placeholder="Add remarks, if any" maxlength="250"></textarea>
							</div>
						</div>
						<div class="col-md-6">
							<label>Attachment</label>
							<span class="fileName" style="display: none;"></span>
							<div class="upload-btn-wrapper d-flex box-shadow-none">
								<div class="file-btn flex-grow-1 position-relative">
									<span id="fileName1" class="fileName" style="display: none;"></span> 
									<input type="file" class="position-absolute opacity-0 w-100" name="fileupload1" id="fileupload1" value="Attachment" style="z-index:1;left:0;height:33px"/> 
									<span class="btn primary-bg white-txt-color w-100">Upload</span>
								</div>
								<div id="divshowDocument1" style="display: none;">
									<div>
										<a id="showDocument1" href="javascript:showDocument(\'\');" class="btn btn-success text-white mx-2" target="_self" data-toggle="tooltip" title="View"> 
											<i class="fa fa-eye"></i>
										</a>
									</div>
								</div>
								<div id="divdeleteDocument1"  style="display: none;">
									<div>
										<a id="deleteDocument1" href="javascript.void(0)" class="btn btn-danger text-white" data-toggle="tooltip" title="Delete"> 
											<i class="fa fa-trash"></i>
										</a>
									</div>
								</div>
							</div>
						</div>
						<div class="col-md-12 text-center">`;
							if(roleAndModule.added=='Y' ||roleAndModule.updated=='Y'){
								html+=`<button class="btn btn-primary" style="margin-top: 20px;" onclick="savePaymentHistory('addPaymentHistory', 'add', '', '');">Save</button>`;
							}
						html+=`</div>
					</div>
				</form>
			</div>
		</div>
	</div>
</div>`;
return html;
}

function getTeacherAddBufferAvailaibilityModel(){
	var html=`<div class="modal fade bs-example-modal-lg" tabindex="-1" role="dialog" id="teacherAddBufferAvailaibilityModel">
		<div class="modal-dialog modal-md">
			<div class="modal-content" style="border: none; border-radius: 1px;">
				<form name="teacherAddBufferAvailabilityForm" id="teacherAddBufferAvailabilityForm">
					<input type="hidden" class="form-control" id="userId" name="userId" value="">
					<input type="hidden" class="form-control" id="teacherId" name="teacherId" value="">
					<div class="modal-header py-2 bg-primary text-center text-white">
						<h5 class="modal-title" id="myLargeModalLabel">Add/Edit Buffer Hours to Add Availaibility.</h5>
						<button type="button" class="close text-white" data-dismiss="modal" aria-hidden="true">&times;</button>
					</div>
					<div class="modal-body">
						<div class="form-group col-md-12">
							<label>Buffer Hours</label>
							<input type="text" class="form-control" id="bufferHours" name="bufferHours" maxlength="3" onkeydown="return M.digit(event);" >
						</div>
						<div class="col-md-12">`;
							if(roleAndModule.added=='Y'){
								html+=`<button type="button" class="send btn btn-primary  text-left" id="submit" onclick="return saveTeacherBufferHoursToAddAvailability('teacherAddBufferAvailabilityForm','${roleAndModule.moduleId}');"><i class="fa fa-envelope"></i>&nbsp;Save</button>`;
							}	
						html+=`</div>
					</div>
				</form>
			</div>
		</div>
	</div>`;
	return html;
}

function getTeacherOfficialModel(){
	var html=`<div class="modal fade bs-example-modal-lg" tabindex="-1" role="dialog" id="teacherOfficialModel">
	<div class="modal-dialog modal-md">
		<div class="modal-content" style="border: none; border-radius: 1px;">
			<form name="teacherOfficialMailForm" id="teacherOfficialMailForm">
				<input type="hidden" class="form-control" id="userId" name="userId" value="">
				<input type="hidden" class="form-control" id="teacherId" name="teacherId" value="">
				<input type="hidden" class="form-control" id="teamMeetingId" name="teamMeetingId" value="">
				<div class="modal-header py-2 bg-primary text-center text-white">
					<h5 class="modal-title" id="myLargeModalLabel">Add/Edit Official Email</h5>
					<button type="button" class="close text-white" data-dismiss="modal" aria-hidden="true">&times;</button>
				</div>
				<div class="modal-body">
					<div class="form-group col-md-12">
						<label>Email/Team/Zoom User Name</label>
						<input type="text" class="form-control" id="officialEmailId" name="officialEmailId" pattern="^([A-Za-z0-9_\-\.])+@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$" maxlength="100" value="">
					</div>
					<div class="form-group col-md-12">
						<label>Confirm Email/Team/Zoom User Name</label>
						<input type="text" class="form-control" id="confirmOfficialEmailId" name="confirmOfficialEmailId" pattern="^([A-Za-z0-9_\-\.])+@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$" maxlength="100" value="">
					</div>
					<div class="form-group col-md-12">
						<label>Zoom Password</label>
						<input type="text" class="form-control" id="zoomPassword" name="zoomPassword" maxlength="100" value="">
					</div>
					<div class="form-group col-md-12" id="teamUserCreationDiv">
						<strong style="margin-top: 5px; display: inline-block;">Do you want to create a TEAM user for Teacher?</strong>
							<label class="switch ml-2">
							<input id="teamUserCheck" class="switch-input" type="checkbox" value="No">
							<span class="switch-label" data-on="YES" data-off="No"></span>
							<span class="switch-handle"></span>
						</label>
					</div>
					<div class="form-group col-md-12 paswrd" style="display:none">
						<label>Team Password</label>
						<input type="text" class="form-control" id="teamPassword" name="teamPassword" maxlength="100" value="">
					</div>
					<div class="form-group col-md-12 paswrd" style="display:none">
						<label>Team Confirm Password</label>
						<input type="text" class="form-control" id="confirmTeamPassword" name="confirmTeamPassword" maxlength="100" value="">
					</div>
					<div class="col-md-12">`;
						if(roleAndModule.added=='Y'){
							html+=`<button type="button" class="send btn btn-success " id="submit" onclick="return saveTeacherOfficialMail('teacherOfficialMailForm','TEACHER','ADD','','${moduleId}');"><i class="fa fa-envelope"></i>&nbsp;Save </button>`;
						}
						html+=`<button type="button" class="btn btn-danger ml-2" data-dismiss="modal">Close</button>
					</div>
				</div>
			</form>
		</div>
	</div>
</div>`;
return html;
}

function getTeacherAgreementModal(moduleId){
	var html=`<div class="modal fade " id="teacherAgreementModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel1">
		<div class="modal-dialog modal-xl" role="document">
			<div class="modal-content">
				<div class="modal-header py-2 bg-primary text-white">
					<h5 class="modal-title">Teacher Agreement</h5>
					<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body" style="max-height:500px;overflow:auto;">
					<section id="section-linebox" class="text-left"></section>
				</div>
				<div class="modal-footer text-right">
					<button type="button" class="btn btn-primary" id="saveAgreement" onclick="return submitTeacherAgreement('teacherEditAgreement','','${moduleId}',1);">Save Draft</button>
					<button type="button" class="btn btn-success" id="saveAndConfirmAgreement" onclick="return submitTeacherAgreement('teacherEditAgreement','','${moduleId}',2);">Save and Confirm</button>
					${/*<button type="button" class="btn btn-success" id="saveAgreement" onclick="return submitTeacherAgreement('teacherEditAgreement','','${moduleId}','2');">save Agreement</button> */''}
				</div>
			</div>
		</div>
	</div>`;
	return html;
}

function getShowMessageCreateUser(){
	var html=`<div class="modal fade" id="showMessageCreateUser" tabindex="-1">
	<div class="modal-dialog modal-sm modal-notify" role="document">
		<div class="modal-content text-center">
		<input type="hidden" class="form-control" id="userIdforGoto" name="userId" value="">
		<input type="hidden" class="form-control" id="gotoId" name="gotoUserIfd" value="">
		<input type="hidden" class="form-control" id="meetingvendor" name="meetingvendor" value="">
			<div class="modal-header justify-content-center"
				style="top: 0 !important;width:100% !important;padding: 15px 10px;">
				<p class="heading" style="color: #fff;" id="gotoMeetingUserstatus"></p>
			</div>
			<div id="statusMessage-1" class="modal-body delete-modal" style="padding-top:12px">

			</div>
			<div class="modal-footer text-center">
				<div class="text-center" style="margin: 0 auto;">
					<button id='resetDeleteErrorWarningNo' type="button" class="btn" data-dismiss="modal" style="" onclick="return saveUpdateGotomeetingUser('teacherPage',${moduleId});">No</button>
					<button id='resetDeleteErrorWarningCancel' type="button" class="btn bg-primary text-white" data-dismiss="modal" style="">Close</button>
				</div>
			</div>
		</div>
	</div>
</div>`;
return html;
}
function dataApprovedTeacherListPagging(datalimit, moduleId,  userId, schoolId, ids, types){
	var noOfPages = datalimit.noOfPages;
	var currentPage = datalimit.currentPage;
	var showPageLimit = 2;
	var leftLimit=currentPage-showPageLimit;
	var rightLimit=currentPage+showPageLimit+1;
	var startPageLimit=5;
	var html='';
	if(noOfPages>1){
		html+='<ul class="pagination">';
			if(currentPage != 1){
				html+='<li class="page-item">'
				+'<a class="page-link" href="javascript:void(0);" onclick="getApprovedTeacherList(\''+moduleId+'\',  \''+userId+'\', \''+schoolId+'\', \''+ids+'\', \''+types+'\', \''+(currentPage-1)+'\');">Previous</a>'
			 	+'</li>';
			 }
			for (let p = 1; p <= noOfPages; p++) {
				if(p < startPageLimit || p > (noOfPages -1) || (p>=leftLimit && p<rightLimit) ){
					if(p > (noOfPages -1) || (p<leftLimit && p>rightLimit)){
						html+='...';
					}
					html+='<li class="page-item">'
					+'<a href="javascript:void(0);" onclick="getApprovedTeacherList(\''+moduleId+'\',  \''+userId+'\', \''+schoolId+'\', \''+ids+'\', \''+types+'\', \''+(p)+'\');" class="page-link '+(p==currentPage?'page-link-active':'')+'">'+p+'</a>'
					+'</li>';
				}else{

				}
			}
			if(currentPage<noOfPages){
				var nextPage=parseInt(currentPage)+1;
				html+='<li class="page-item">'
				+'<a class="page-link" href="javascript:void(0);" onclick="getApprovedTeacherList(\''+moduleId+'\',  \''+userId+'\', \''+schoolId+'\', \''+ids+'\', \''+types+'\', \''+(nextPage)+'\');">Next</a>'
				+'</li>';
			}
		html+='</ul>';
	}
	return html;
}
function dataWithdrawTeacherListPagging(datalimit, moduleId,  userId, schoolId, ids, types){
	var noOfPages = datalimit.noOfPages;
	var currentPage = datalimit.currentPage;
	var showPageLimit = 2;
	var leftLimit=currentPage-showPageLimit;
	var rightLimit=currentPage+showPageLimit+1;
	var startPageLimit=5;
	var html='';
	if(noOfPages>1){
		html+='<ul class="pagination">';
			if(currentPage != 1){
				html+='<li class="page-item">'
				+'<a class="page-link text-primary" href="javascript:void(0);" onclick="getWithdrawTeacherList(\''+moduleId+'\',  \''+userId+'\', \''+schoolId+'\', \''+ids+'\', \''+types+'\', \''+(currentPage-1)+'\');">Previous</a>'
			 	+'</li>';
			 }
			for (let p = 1; p <= noOfPages; p++) {
				if(p < startPageLimit || p > (noOfPages -1) || (p>=leftLimit && p<rightLimit) ){
					if(p > (noOfPages -1) || (p<leftLimit && p>rightLimit)){
						html+='...';
					}
					html+='<li class="page-item">'
					+'<a href="javascript:void(0);" onclick="getWithdrawTeacherList(\''+moduleId+'\',  \''+userId+'\', \''+schoolId+'\', \''+ids+'\', \''+types+'\', \''+(p)+'\');" class="page-link'+(p==currentPage?' page-link-active bg-primary':' text-primary')+'">'+p+'</a>'
					+'</li>';
				}else{

				}
			}
			if(currentPage<noOfPages){
				var nextPage=parseInt(currentPage)+1;
				html+='<li class="page-item">'
				+'<a class="page-link text-primary" href="javascript:void(0);" onclick="getWithdrawTeacherList(\''+moduleId+'\',  \''+userId+'\', \''+schoolId+'\', \''+ids+'\', \''+types+'\', \''+(nextPage)+'\');">Next</a>'
				+'</li>';
			}
		html+='</ul>';
	}
	return html;
}