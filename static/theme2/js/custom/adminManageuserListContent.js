
async function renderAdminManageUserListDashboard(title, roleAndModule, SCHOOL_ID, USER_ID,USER_ROLE){
  	
	ROLE_MODULE=roleAndModule;
	var html= await getAdminManageUserListContent(title);
    $('#dashboardContentInHTML').html(html);
	callRoleDropdown("adminFilter",'','roleUser');
	getAdminUserList('adminFilter',ROLE_MODULE.moduleId, 0);

	$("#btmSearchUsers").on("click", function(){
		getAdminUserList('adminFilter',ROLE_MODULE.moduleId, 0);
	});
	$("#adminFilter #roleUser").select2({
		theme:"bootstrap4",
		dropdownParent:"#adminFilter"
	});
	$('.show-filter').on('click', function(){
		$('.filter-fields').stop().slideToggle();
	});	
	$("#adminUserSearch").on('keyup', function (e) {
		if($("#adminUserSearch").val().length>=3){
			getAdminUserList('adminFilter',ROLE_MODULE.moduleId, 0);
		}else if($("#adminUserSearch").val().length==0){
			getAdminUserList('adminFilter',ROLE_MODULE.moduleId, 0);
		}
	});
}

function getAdminManageUserListContent(title){
	var html='<div class="app-page-title mb-3 py-2">'
		+'<div class="page-title-wrapper">'
		+'		<div class="page-title-heading">'
		+'			<div class="page-title-icon">'
		+'				<i class="fas fa-university text-primary"></i>'
		+'			</div>'
		+'			<div>'+title+'</div>'
		+'		</div>'
		+'		<div class="page-title-actions"></div>'
		+'	</div>'
		+'</div>';
	html+=getAdminManageUserListContentCard();
	return html;
}

function getAdminManageUserListContentCard(){
	var html='';
		html+='<div class="main-card mb-3 card">';
			html+='<div class="card-body">';
			html+=getAdminManageUserList();
			html+='</div>';
			
		html+='</div>';
		html+='<div id="viewAdminLmsContent"></div>';
		html+=getUserActivity();
		html+='<div id="studentSemesterStartDateEntryHTML"></div>';
		html+=getShowMessageAdminUser();
	return html;
}

function getAdminManageUserList(){
	var html='';
	html+=`
		<div class="row">
			<div class="col-lg-12 col-md-12">`;
				html+=getFilterForm()
				+`<div class="table-responsive">
				<div class="d-flex align-items-center flex-wrap justify-content-end mb-2" style="gap:0.5rem">
					<input type="text" name="adminUserSearch" id="adminUserSearch" class="w-fit-content form-control form-control-sm" placeholder="Search" />
				</div>
					<table class="table table-bordered table-striped border-radius-table font-12 responsive" id="adminManageUserList" style="width:100% !important" >
						<thead>
							<tr class="bg-primary text-white">
								<th class="font-weight-normal border-bottom-0 vertical-align-middle rounded-top-left-10">S.No</th>
								<th class="font-weight-normal border-bottom-0 vertical-align-middle">Name</th>
								<th class="font-weight-normal border-bottom-0 vertical-align-middle">User Name</th>
								<th class="font-weight-normal border-bottom-0 vertical-align-middle">One Time Password</th>
								<th class="font-weight-normal border-bottom-0 vertical-align-middle">Role</th>
								<th class="font-weight-normal border-bottom-0 vertical-align-middle text-center">Go To Meeting User</th>
								<th class="font-weight-normal border-bottom-0 vertical-align-middle">Referral Code</th>
								<th class="font-weight-normal border-bottom-0 vertical-align-middle">Profile Status</th>
								<th class="font-weight-normal border-bottom-0 vertical-align-middle">Added Date</th>
								<th class="font-weight-normal border-bottom-0 vertical-align-middle rounded-top-right-10 text-center">Action</th>
							</tr>
						</thead>
						<tbody id="adminManageUserListbody"></tbody>
					</table>
				</div>
			</div>
		</div>
		<div class="adminManageUserListpaging"></div>`;
		
	return html;
}

function getFilterForm(){
	// ${userClickFrom}
	var html=''
	html+=`<div class="filter-wrapper">
		<button class="btn btn-sm btn-primary float-right show-filter"><i class="fa fa-filter"></i>&nbsp;Filter</button>
		<form name="adminFilter" id="adminFilter" action="javascript:void(0)">
			<input type="hidden" name="userClickFrom" id="userClickFrom" value="common" />
			<div class="filter-fields rounded-10" style="display:none">
				<div class="row px-3">
					<div class="col-md-4 col-sm-6 col-xs-12">
						<label>Name</label>
						<input type="text" name="Name" style="text-transform:capitalize" id="Name" class="form-control" value=""  />
					</div>
					<div class="col-md-4 col-sm-6 col-xs-12">
						<label>User Name</label>
						<input type="text" name="userName" style="text-transform:capitalize" id="userName" class="form-control" value=""  />
					</div>
					<div class="col-md-4 col-sm-6 col-xs-12">
						<label>Role Type</label>
						<select name="roleUser" id="roleUser" class="form-control" >
							<option value="0">Select Role</option>
						</select>
					</div>
					<div class="col-md-4 col-sm-4 col-xs-12">
						<label>Added date</label>
						<input type="text" name="addedDate" class="form-control" id="addedDate" readonly onkeydown="return false">
					</div>
					<div class="col-md-4 col-sm-6 col-xs-12">
						<label>Status</label>
						<select class="form-control" name="userActive" id="userActive">
							<option value="">Select Status</option>
							<option value="Y" selected="">Active</option>
							<option value="N">Inactive</option>
						</select>
					</div>
					<div class="col-md-4 col-sm-2 col-xs-12">
						<label>Page Size</label>
						<input type="text" name="pageSize" style="text-transform:capitalize" id="pageSize" class="form-control" value="25"  />
					</div>
					<div class="col-md-12 col-sm-12 col-xs-12 mt-2 text-right">
						<button class="btn btn-sm btn-danger  mr-1" onclick="searchAdminFilterReset('adminFilter')"><i class="fa fa-undo"></i>&nbsp;Reset</button>
						<button class="btn btn-sm btn-success " id="btmSearchUsers"><i class="fa fa-search"></i>&nbsp;Search</button>
					</div>
				</div>
			</div>
		</form>
	</div>`;
	return html;
}

function getUserActivity(){
	var html='';
	html+=`
	<div id="divHistoryRemarks"></div>
	<div id="userActivityHTML"></div>
	<div class="modal fade" id="commonCommentsLogsModel" role="dialog">
		<div class="modal-dialog modal-lg" style="margin-top:70px;">
			<div class="modal-content">
				<div class="modal-header" style="width: 97%; margin: 0 auto; border-radius: 0;position:relative;top:-25px;">
					<h5 class="modal-title text-white" style="margin-left: 30px;" id="commonCommentTitle">Past Comments</h5>
					<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close" style="margin-right: 5px;margin-top: -5px;">
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


function getShowMessageAdminUser(){
	var html='';
	html+=`<div class="modal fade" id="showMessageAdminCreateUser" tabindex="-1">
	<div class="modal-dialog modal-sm modal-notify" role="document">
		<div class="modal-content text-center">
			<input type="hidden" class="form-control" id="userIdforGoto" name="userId" value="">
			<input type="hidden" class="form-control" id="gotoId" name="gotoUserIfd" value="">
			<input type="hidden" class="form-control" id="meetingvendor" name="meetingvendor" value="LENS">
			<div class="modal-header justify-content-center"
				style="top: 0 !important;width:100% !important;padding: 15px 10px;">
				<p class="heading" style="color: #fff;" id="gotoMeetingUserstatus"></p>
			</div>
			<div id="statusMessage-1" class="modal-body delete-modal" style="padding-top:12px"></div>
			<div class="modal-footer text-center">
				<div class="text-center" style="margin: 0 auto;">
					<button id='resetDeleteErrorWarningNo' type="button" class="btn" data-dismiss="modal" style="" onclick="return saveUpdateGotomeetingUser('userPage',${moduleId});">No</button>
					<button id='resetDeleteErrorWarningCancel' type="button" class="btn btn-primary" data-dismiss="modal" >Close</button>
				</div>
			</div>
		</div>
	</div>
</div>`;
	return html;
}

function dataAdminUserPagging(datalimit){
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
				+'<a class="page-link" href="javascript:void(0);" onclick="getAdminUserList(\'adminFilter\',\''+ROLE_MODULE.moduleId+'\', \''+(currentPage-1)+'\');">Previous</a>'
			 	+'</li>';
			 }
			for (let p = 1; p <= noOfPages; p++) {
				if(p < startPageLimit || p > (noOfPages -1) || (p>=leftLimit && p<rightLimit) ){
					if(p > (noOfPages -1) || (p<leftLimit && p>rightLimit)){
						html+='...';
					}
					html+='<li class="page-item">'
					+'<a href="javascript:void(0);" onclick="getAdminUserList(\'adminFilter\',\''+ROLE_MODULE.moduleId+'\', \''+(p)+'\');" class="page-link '+(p==currentPage?'page-link-active':'')+'">'+p+'</a>'
					+'</li>';
				}else{

				}
			}
			if(currentPage<noOfPages){
				var nextPage=parseInt(currentPage)+1;
				html+='<li class="page-item">'
				+'<a class="page-link" href="javascript:void(0);" onclick="getAdminUserList(\'adminFilter\',\''+ROLE_MODULE.moduleId+'\', \''+(nextPage)+'\');">Next</a>'
				+'</li>';
			}
		html+='</ul>';
	}
	return html;
}


function getViewAdminUserLmsCredaintial(data){
	var studentlmsList= data.studentlmsList;
	var html=
		`<div class="modal fade" id="adminViewLmsEntryModel" role="dialog">
			<div class="modal-dialog modal-xl">
				<div class="modal-content">
					<div class="modal-header py-2 bg-primary text-white">
						<h5 class="modal-title ">Manage LMS Content : ${data.userName}</h5>
						<button type="button" class="close text-white" data-dismiss="modal">&times;</button>
					</div>
					<div class="modal-body">
						<div id="adminViewEditLMSData"></div>
						<div class="full mb-2">
							<a id="lmsContentSave" href="javascript:void(0);"  class="btn btn-primary " style="display:none;" onclick="saveUserEditedLmsContent('studentLmsContentForm','SAVE')">Save</a>`;
							if((data.lmsRole != 'STUDENT' && data.lmsRole != 'PARENT') && (data.sessionUserSchoolId == 1 || data.sessionUserSchoolId == 4 )){
								html+=
								`<a id="lmsContentAddNewUser" href="javascript:void(0);"  class="btn btn-primary blue-bg pull-right" style="display:block;"  onclick="return callForAdminLMSContent('${data.userId}','ADDNEW','0','0')">Add New</a>
								<a id="lmsContentAdd" href="javascript:void(0);"  class="btn btn-primary blue-bg pull-right" style="display:none;" onclick="saveUserEditedLmsContent('studentLmsContentForm','ADD')">Confirm & Add </a>`;
							}
						html+=
						`</div>
						<div class="table-responsive">
							<table class="table table-bordered table-striped border-radius-table font-12 responsive nowrap" id="studentLmsContent" style="width:100%">
								<thead>
									<tr class="bg-primary text-white">
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
											<td>${lms.lmsUserName}/<span class="${lms.lmsId}">${lms.lmsUsrId}</span>${data.lmsPasswordShowPermission == 'true'?'<br/>'+ lms.password :''}</td>
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
													<button type="button" class="btn btn-danger  dropdown-toggle  btn-sm"
														data-toggle="dropdown" aria-haspopup="true"
														aria-expanded="false" data-toggle="tooltip" title="Action" style="background-color:var(--pc) !important;border-color:var(--pc);box-shadow:none;">
														<i class="fa fa-ellipsis-v"></i>
													</button>
													<div class="dropdown-menu">`;
														if(ROLE_MODULE.updated=='Y'){
															if(lms.lmsStatus == 1){
																html+=`<a href="javascript:void(0);" class="dropdown-item" onclick="return callForAdminLMSContent('${lms.userId}','EDIT','${lms.courseProviderId}','${lms.lmsId}')"  data-toggle="tooltip" title=" Edit Data "><i class="fa fa-edit"></i>&nbsp;Edit</a>`;
															}
														}
														if(ROLE_MODULE.updated=='Y'){
															if(lms.courseProviderName!='' && lms.lmsStatus == 1){
																html+=`<a href="javascript:void(0);" class="dropdown-item"  onclick="return addlmsContent('emailUser','${lms.userId}','87','${lms.lmsId}')" data-toggle="tooltip" title="Send Mail"><i class="fa fa-envelope"></i>&nbsp;Send Mail</a>`;
															}
														}
														if(ROLE_MODULE.updated=='Y'){
															if(lms.lmsUsrId!=''){
																if(data.lmsRole == 'STUDENT'){
																	html+=`<a href="javascript:void(0);" class="dropdown-item" onclick="return showWarningMessageShow('Are you sure you want to sync this data? Syncing this data will create a new user/update user details for the student in the LMS?',' callAgilixbuzzSyncUser(\\\'\\\',\\\'${data.lmsRole}\\\',\\\'UU\\\',\\\'${lms.lmsId}\\\',\\\'${lms.courseProviderId}\\\')')" data-toggle="tooltip" title="Sync student user"><i class="pe-7s-refresh-2 bold"></i>&nbsp;Sync student user</a>`;
																}else if(data.lmsRole == 'PARENT'){
																	html+=`<a href="javascript:void(0);" class="dropdown-item" onclick="return showWarningMessageShow('Are you sure you want to sync this data? Syncing this data will create a new user/update user details for the parent in the LMS?',' callAgilixbuzzSyncUser(\\\'\\\',\\\'${data.lmsRole}\\\',\\\'UU\\\',\\\'${lms.lmsId}\\\',\\\'${lms.courseProviderId}\\\')')" data-toggle="tooltip" title="Sync parent user "><i class="pe-7s-refresh-2 bold"></i>&nbsp;Sync parent user</a>`;
																}else if(data.lmsRole == 'TEACHER'){
																	html+=`<a href="javascript:void(0);" class="dropdown-item" onclick="return showWarningMessageShow('Are you sure you want to sync this data? Syncing this data will create a new user/update user details for the teacher in the LMS?',' callAgilixbuzzSyncUser(\\\'\\\',\\\'${data.lmsRole}\\\',\\\'UU\\\',\\\'${lms.lmsId}\\\',\\\'${lms.courseProviderId}\\\')')" data-toggle="tooltip" title="Sync teacher user"><i class="pe-7s-refresh-2 bold"></i>&nbsp;Sync teacher user</a>`;
																}else {
																	html+=`<a href="javascript:void(0);" class="dropdown-item" onclick="return showWarningMessageShow('Are you sure you want to sync this data? Syncing this data will create a new user/update user details for the admin in the LMS?',' callAgilixbuzzSyncUser(\\\'\\\',\\\'${data.lmsRole}\\\',\\\'UU\\\',\\\'${lms.lmsId}\\\',\\\'${lms.courseProviderId}\\\')')" data-toggle="tooltip" title="Sync admin user"><i class="pe-7s-refresh-2 bold"></i>&nbsp;Sync admin user</a>`;
																}
																html+=`<a href="javascript:void(0);" class="dropdown-item" onclick="return showWarningMessageShow('Are you sure you want to verify user mail? After verify user email user will get all notification from LMS.',' callAgilixbuzzSyncUser(\\\'\\\',\\\'${data.lmsRole}\\\',\\\'VUM\\\',\\\'${lms.lmsId}\\\',\\\'${lms.courseProviderId}\\\')')" data-toggle="tooltip" title="Verify user email in LMS"><i class="fa fa-check-circle"></i>&nbsp;Verify user email in LMS</a>`;
															}else{
																if(data.lmsRole == 'STUDENT'){
																	html+=`<a href="javascript:void(0);" class="dropdown-item" onclick="return showWarningMessageShow('Are you sure you want to sync this data? Syncing this data will create a new user/update user details for the student in the LMS?',' callAgilixbuzzSyncUser(\\\'\\\',\\\'${data.lmsRole}\\\',\\\'CU\\\',\\\'${lms.lmsId}\\\',\\\'${lms.courseProviderId}\\\')')" data-toggle="tooltip" title="Sync student user "><i class="pe-7s-refresh-2 bold"></i>&nbsp;Sync student user</a>`;
																}else if(data.lmsRole == 'PARENT'){
																	html+=`<a href="javascript:void(0);" class="dropdown-item" onclick="return showWarningMessageShow('Are you sure you want to sync this data? Syncing this data will create a new user/update user details for the parent in the LMS?',' callAgilixbuzzSyncUser(\\\'\\\',\\\'${data.lmsRole}\\\',\\\'CU\\\',\\\'${lms.lmsId}\\\',\\\'${lms.courseProviderId}\\\')')" data-toggle="tooltip" title="Sync parent user "><i class="pe-7s-refresh-2 bold"></i>&nbsp;Sync parent user</a>`;
																}else if(data.lmsRole == 'TEACHER'){
																	html+=`<a href="javascript:void(0);" class="dropdown-item" onclick="return showWarningMessageShow('Are you sure you want to sync this data? Syncing this data will create a new user/update user details for the teacher in the LMS?',' callAgilixbuzzSyncUser(\\\'\\\',\\\'${data.lmsRole}\\\',\\\'CU\\\',\\\'${lms.lmsId}\\\',\\\'${lms.courseProviderId}\\\')')" data-toggle="tooltip" title="Sync teacher user"><i class="pe-7s-refresh-2 bold"></i>&nbsp;Sync teacher user</a>`;
																}else {
																	html+=`<a href="javascript:void(0);" class="dropdown-item" onclick="return showWarningMessageShow('Are you sure you want to sync this data? Syncing this data will create a new user/update user details for the admin in the LMS?',' callAgilixbuzzSyncUser(\\\'\\\',\\\'${data.lmsRole}\\\',\\\'UU\\\',\\\'${lms.lmsId}\\\',\\\'${lms.courseProviderId}\\\')')" data-toggle="tooltip" title="Sync admin user"><i class="pe-7s-refresh-2 bold"></i>&nbsp;Sync admin user</a>`;
																}
															}
															html+=
																`<a href="javascript:void(0);" class="dropdown-item" id="pullDownEnrollment" onclick="return showWarningMessageShow('Are you sure you want to pull down data from LMS? Pull down data will update userlmsid in SMS.',' callAgilixbuzzSyncUser(\\\'\\\',\\\'${data.lmsRole}\\\',\\\'PULLUSER\\\',\\\'${lms.lmsId}\\\',\\\'${lms.courseProviderId}\\\')')" data-toggle="tooltip" title="Pull lmsuserid"><i class="fa fa-angle-double-down"></i>&nbsp;Pull lmsuserid</a>
																<a id="lmsuserInactive${lms.lmsId}" class="dropdown-item" style="display:${lms.lmsStatus == 1?'inline-block;':'none;'}" href="javascript:void(0);"  onclick="return callForAdminLMSContent('${lms.userId}','INACTIVE','${lms.courseProviderId}','${lms.lmsId}')"  data-toggle="tooltip" title=" Inactivate LMS "><i class="fa fa-toggle-on"></i>&nbsp;Inactivate LMS</a>
																<a id="lmsuserActive${lms.lmsId}" class="dropdown-item" style="display:${lms.lmsStatus == 0?'inline-block;':'none;'}" href="javascript:void(0);"  onclick="return callForAdminLMSContent('${lms.userId}','ACTIVE','${lms.courseProviderId}','${lms.lmsId}')"  data-toggle="tooltip" title=" Activate LMS "><i class="fa fa-toggle-off"></i>&nbsp;Activate LMS</a>`;
														}
														if(ROLE_MODULE.viewed=='Y'){
															html+=`<a href="javascript:void(0);" class="dropdown-item" onclick="return callForAdminLMSContent('${lms.userId}','VIEW','${lms.courseProviderId}','${lms.lmsId}')"><span class="view"><i class="fa fa-eye"></i>&nbsp;View</a>`;
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