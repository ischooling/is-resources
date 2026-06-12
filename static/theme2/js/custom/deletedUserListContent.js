
async function renderDeletedUserListDashboard(title, roleAndModule, SCHOOL_ID, USER_ID,USER_ROLE){
	ROLE_MODULE=roleAndModule;
	addDeletedFilterCustomFieldCss();
	var html=await getDeletedUserListContent(title);
    $('#dashboardContentInHTML').html(html);
	callRoleDropdown("deletedFilter",'','roleUser');
	getDeletedUserList('deletedFilter',ROLE_MODULE.moduleId, 0);

	$("#deletedSearchUsers").on("click", function(){
		getDeletedUserList('deletedFilter',ROLE_MODULE.moduleId, 0);
	});

	$("#deleteUserSearch").on('keyup', function (e) {
		if (e.key === 'Enter' || e.keyCode === 13) {
			// Do something
			getDeletedUserListByTextSearch('deletedFilter',ROLE_MODULE.moduleId, 0);
		}
	});

	$("#deletedFilter #roleUser").select2({
		theme:"bootstrap4",
		dropdownParent:"#deletedFilter",
		width:"100%"
	});
	if(typeof refreshCustomFieldState === 'function'){
		refreshCustomFieldState($("#deletedFilter"));
		setTimeout(function(){
			refreshCustomFieldState($("#deletedFilter"));
		}, 300);
	}
	$('.show-filter').on('click', function(){
		$('.filter-fields').stop().slideToggle();
	});
}

function addDeletedFilterCustomFieldCss(){
	if($("#deletedFilterCustomFieldCss").length < 1){
		$("head").append(`<style id="deletedFilterCustomFieldCss">
			#deletedFilter .custom-field .select2.select2-container--bootstrap4,
			#deletedFilter .custom-field .select2-container{
				position:relative;
				width:100% !important;
				z-index:1 !important;
			}
			#deletedFilter .custom-field label:not(.error-msg){
				position:absolute;
				z-index:20 !important;
				background:#fff;
			}
			#deletedFilter .custom-field .select2-selection__rendered{
				line-height:26px !important;
			}
		</style>`);
	}
}

function getDeletedUserListContent(title){
	var html='<div class="app-page-title mb-3 py-2">'
		+'<div class="page-title-wrapper">'
		+'		<div class="page-title-heading">'
		+'			<div class="page-title-icon">'
		+'				<i class="fas fa-university text-primary"></i>'
		+'			</div>'
		+'			<div>'+title+'</div>'
		+'		</div>'
		+'	</div>'
		+'</div>';
	html+=getDeletedUserListContentCard();
	return html;
}

function getDeletedUserListContentCard(){
	var html='';
		html+='<div class="main-card mb-3 card">';
			html+='<div class="card-body">';
			html+=getDeletedUserDetailList();
			html+='</div>';
			
		html+='</div>';
		html+='<div id="viewStudentLmsContent"></div>';
		html+=getDeletedUserActivity();
		html+='<div id="studentSemesterStartDateEntryHTML"></div>';
		html+=getShowMessageCreateUser();
	return html;
}

function getDeletedUserDetailList(){
	var html='';
	html+=`
		<div class="row">
			<div class="col-lg-12 col-md-12">`

				html+=getDeltedUserFilterForm();
				
				html+=`<br/><br/><div class="d-flex align-items-center flex-wrap justify-content-end mb-2" style="gap:0.5rem">
					<input type="text" name="deleteUserSearch" id="deleteUserSearch" class="w-fit-content form-control form-control-sm">
				</div>`;
				html+=`<table class="table table-bordered border-radius-table table-striped responsive nowrap font-12" id="DeletedUserList" style="width:100%">
				<thead>
						<tr class="bg-primary text-white">
							<th>S.No</th>
							<th>Role Type</th>
							<th>Email</th>
							<th>Student Id</th>
							<th>User Name</th>
							<th class="text-center">Action</th>
						</tr>
					</thead>
					<tbody id="deletedUserListbody"></tbody>
				</table>
			</div>
		</div>
		<div id="deletedUserListpaging"></div>`;
		
	return html;
}

function getDeltedUserFilterForm(){
	// ${userClickFrom}
	var html=''
	html+=`<div class="filter-wrapper">
		<button class="btn btn-sm btn-primary float-right show-filter"><i class="fa fa-filter"></i>&nbsp;Filter</button>
		<form name="deletedFilter" id="deletedFilter" class="custom-field-scope" action="javascript:void(0)">
			<input type="hidden" name="userClickFrom" id="userClickFrom" value="common" />
			<div class="filter-fields rounded">
				<div class="row px-3">
				<div class="col-md-4 col-sm-6 col-12">
					<div class="custom-field">
						<select name="roleUser" id="roleUser" class="form-control" >
							<option value="0">Select Role</option>
						</select>
						<label for="roleUser">Role Type</label>
					</div>
				</div>
				<div class="col-md-3 col-sm-6 col-12">
					<div class="custom-field">
						<input type="text" name="emailId" id="emailId" class="form-control" value="" maxlength="40" placeholder=" " />
						<label for="emailId">Email ID</label>
					</div>
				</div>
				<div class="col-md-3 col-sm-6 col-12">
					<div class="custom-field">
						<input type="text" name="userName" id="userName" class="form-control" value="" placeholder=" " />
						<label for="userName">User Name</label>
					</div>
				</div>
				
				<div class="col-md-3 col-sm-6 col-12">
					<div class="custom-field">
						<input type="text" name="pageSize"  id="pageSize" class="form-control" value="10" placeholder=" " />
						<label for="pageSize">Page Size</label>
					</div>
				</div>
				<div class="col-md-12 col-sm-12 col-12 mt-2 text-right">
					<button type="button" class="btn btn-danger  pr-4 pl-4 mr-2" onclick="advanceSearchDeleteReset('deletedFilter'); if(typeof refreshCustomFieldState === 'function'){setTimeout(function(){refreshCustomFieldState($('#deletedFilter'));}, 0);}"><i class="fa fa-undo"></i>&nbsp;Reset</button>
					<button type="button" class="btn btn-success  pr-4 pl-4" id="deletedSearchUsers"><i class="fa fa-search"></i>&nbsp;Search</button>
				</div>
			</div>
			</div>
		</form>
	</div>`;
	return html;
}

function getDeletedUserActivity(){
	var html='';
	html+=`
	<div id="divHistoryRemarks"></div>
	<div id="userActivityHTML"></div>
	<div class="modal fade" id="commonCommentsLogsModel" role="dialog">
		<div class="modal-dialog modal-lg" style="margin-top:70px;">
			<div class="modal-content">
				<div class="modal-header" style="width: 97%; margin: 0 auto; border-radius: 0;position:relative;top:-25px;">
					<h5 class="modal-title" style="color: #fff; margin-left: 30px;" id="commonCommentTitle">Past Comments</h5>
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


function getShowMessageCreateUser(){
	var html='';
	html+=`<div class="modal fade" id="showMessageCreateUser" tabindex="-1">
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
					<button id='resetDeleteErrorWarningCancel' type="button" class="btn bg-primary text-white" data-dismiss="modal" >Close</button>
				</div>
			</div>
		</div>
	</div>
</div>`;
	return html;
}

function dataDeletedUserPagging(datalimit){
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
				+'<a class="page-link" href="javascript:void(0);" onclick="getDeletedUserList(\'deletedFilter\',\''+ROLE_MODULE.moduleId+'\', \''+(currentPage-1)+'\');">Previous</a>'
			 	+'</li>';
			 }
			for (let p = 1; p <= noOfPages; p++) {
				if(p < startPageLimit || p > (noOfPages -1) || (p>=leftLimit && p<rightLimit) ){
					if(p > (noOfPages -1) || (p<leftLimit && p>rightLimit)){
						html+='...';
					}
					html+='<li class="page-item">'
					+'<a href="javascript:void(0);" onclick="getDeletedUserList(\'deletedFilter\',\''+ROLE_MODULE.moduleId+'\', \''+(p)+'\');" class="page-link '+(p==currentPage?'page-link-active':'')+'">'+p+'</a>'
					+'</li>';
				}else{

				}
			}
			if(currentPage<noOfPages){
				var nextPage=parseInt(currentPage)+1;
				html+='<li class="page-item">'
				+'<a class="page-link" href="javascript:void(0);" onclick="getDeletedUserList(\'deletedFilter\',\''+ROLE_MODULE.moduleId+'\', \''+(nextPage)+'\');">Next</a>'
				+'</li>';
			}
		html+='</ul>';
	}
	return html;
}
