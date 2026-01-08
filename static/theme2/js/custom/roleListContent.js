
async function renderRoleListDashboard(title, roleAndModule, SCHOOL_ID, USER_ID,USER_ROLE){
	ROLE_MODULE=roleAndModule;
	var html=await getRoleContent(title);
    $('#dashboardContentInHTML').html(html);
	getAllRolesList(roleAndModule.updated, 0, false);
	callRoleDropdown("roleFormModal",'','parentRole');
	//callSchoolDropdown("roleFormModal",'','schoolId');
	var offlineSchoolLis=schoolList.schoolList
	dropdown = $("#roleFormModal #schoolId");
	dropdown.html('');
	dropdown.append('<option value="0">Select School</option>');
	$.each(offlineSchoolLis, function (k, v) {
		dropdown.append('<option value="' + v.schoolId + '" '+(v.schoolId==SCHOOL_ID?'selected':'')+'>' + v.schoolName + '</option>');
	});

	$("#moduleSearch").on('keyup', function (e) {
		//if (e.key === 'Enter' || e.keyCode === 13) {
			// Do something
			if($("#moduleSearch").val().length>=3){
				getAllRolesList(roleAndModule.updated, 0, false);
			}else if($("#moduleSearch").val().length==0){
				getAllRolesList(roleAndModule.updated, 0, false);
			}
		//}
	});
	$("#roleFormModal #parentRole").select2({
		theme:"bootstrap4",
		dropdownParent:"#roleFormModal"
	});
	
}

function getRoleContent(title){
	var html='<div class="app-page-title mb-3 py-2">'
		+'<div class="page-title-wrapper">'
		+'		<div class="page-title-heading">'
		+'			<div class="page-title-icon">'
		+'				<i class="fas fa-university text-primary"></i>'
		+'			</div>'
		+'			<div>'+title+'</div>'
		+'		</div>'
		+'		<div class="page-title-actions">'
		+'			<button class="btn btn-primary" onclick="roleFormContentModal();">Add New Role</button>'
		+'		</div>'
		+'	</div>'
		+'</div>';
	html+=getRoleContentCard();
	html+=getRoleAddEditPopup();
	return html;
}

function getRoleContentCard(){
	var html='';
		html+='<div class="main-card mb-3 card">';
			html+='<div class="card-body">';
			html+=getRoleDataList();
			html+='</div>';
		html+='</div>';
		
	return html;
}

function getRoleDataList(){
	var html='';
	html+=`
		<div class="row">
			<div class="col-lg-12 col-md-12">
				<div class="d-flex align-items-center flex-wrap justify-content-end mb-2" style="gap:0.5rem">
					<input type="text" name="moduleSearch" id="moduleSearch" class="w-fit-content form-control form-control-sm" placeholder="Search" />
				</div>
				<table class="table table-bordered table-striped border-radius-table font-12 responsive nowrap" id="roleList" style="font-size:12px" >
					<thead class="bg-primary text-white">
						<tr>
							<th>S.No</th>
							<th>Role Type</th>
							<th>Parent Role</th>
							<th>Total Users</th>
							<th class="text-center">Action</th>
						</tr>
					</thead>
					<tbody id="roleListbody"></tbody>
				</table>
			</div>
		</div>
		<div class="rolepaging"></div>`;
		
	return html;
}

function dataRolePagging(datalimit, updated){
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
				+'<a class="page-link" href="javascript:void(0);" onclick="getAllRolesList(\''+updated+'\', \''+(currentPage-1)+'\', false);">Previous</a>'
			 	+'</li>';
			 }
			for (let p = 1; p <= noOfPages; p++) {
				if(p < startPageLimit || p > (noOfPages -1) || (p>=leftLimit && p<rightLimit) ){
					if(p > (noOfPages -1) || (p<leftLimit && p>rightLimit)){
						html+='...';
					}
					html+='<li class="page-item">'
					+'<a href="javascript:void(0);" onclick="getAllRolesList(\''+updated+'\', \''+p+'\', false);" class="page-link '+(p==currentPage?'page-link-active':'')+'">'+p+'</a>'
					+'</li>';
				}else{

				}
			}
			if(currentPage<noOfPages){
				var nextPage=parseInt(currentPage)+1;
				html+='<li class="page-item">'
				+'<a class="page-link" href="javascript:void(0);" onclick="getAllRolesList(\''+updated+'\', \''+nextPage+'\', false);">Next</a>'
				+'</li>';
			}
		html+='</ul>';
	}
	return html;
}

function getRoleAddEditPopup(){
	var html=''
	html+=`<div class="modal fade fade-scale" id="roleFormModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel1">
	<div id="lmsStudentContent" class="modal-dialog modal-dialog-centered box-shadow-none" role="document">
		<div class="modal-content">
			<div class="modal-header py-2 bg-primary text-white">
				<h5 class="modal-title" >Create/Edit Role</h5>
				<button type="button" class="close text-white" data-dismiss="modal"aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>
			<form autocomplete="off" id="roleFormId">
				<div class="modal-body">
					<input type="hidden" name="roleId" id="roleId" value="" />
					<div class="row">
						<div class="col-md-6 col-sm-6 col-12">
							<div class="form-group mb-2">
								<label class="control-label mb-0">Select School</label> 
								<select class="form-control" name="schoolId" id="schoolId" ${SCHOOL_ID !=''?'enable':''} >
									<option value="0">Select School</option>
								</select> 
							</div>
						</div>
						<div class="col-md-6 col-sm-6 col-12">
							<div class="form-group mb-2">
								<label for="roleName" class="control-label mb-0">Role Type Name<span class="text-danger">*</span></label> 
								<input type="text" name="roleName" id="roleName" class="form-control"  required="required">
							</div>
						</div>
						<div class="col-md-6 col-sm-6 col-12">
							<div class="form-group mb-2">
								<label class="control-label mb-0">Parent Role</label> 
								<select class="form-control" name="parentRole" id="parentRole">
	                                <option value="0">Select Parent role</option>
	                            </select> 
							</div>
						</div>
						<div class="col-md-6 col-sm-6 col-12">
							<div class="form-group mb-2">
								<label for="roleActive" class="control-label mb-0">Active/ In-Active<span class="text-danger">*</span></label> 
								<select class="form-control"  name="roleActive" id="roleActive" >
		                            <option value="Y">Active</option>
		                            <option value="N">Inactive</option>
		                        </select>
							</div>
						</div>
					</div>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-primary" onclick="return callRoleCreate('roleFormId','SCHOOL', '${ROLE_MODULE.moduleId}');">Save</button>
				</div>
			</form>
		</div>
	</div>
</div>`;
		return html;
}




