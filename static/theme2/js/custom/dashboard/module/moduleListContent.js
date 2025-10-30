
var ROLE_MODULE="";
var OBJECT_RIGHTS="";
async function renderModuleListDashboard(title, roleAndModule, SCHOOL_ID, USER_ID,USER_ROLE){
	ROLE_MODULE=roleAndModule;
	var html=await getModuleContent(title);
    $('#dashboardContentInHTML').html(html);
	getAllModulesList(roleAndModule.updated, 0, false);
	callModuleDropdown("moduleFormModal",'','parentModule');

	$("#moduleSearch").on('keyup', function (e) {
		//if (e.key === 'Enter' || e.keyCode === 13) {
			// Do something
			if($("#moduleSearch").val().length>=3){
				getAllModulesList(roleAndModule.updated, 0, false);
			}else if($("#moduleSearch").val().length==0){
				getAllModulesList(roleAndModule.updated, 0, false);
			}
//}
	});
	$("#moduleFormModal #parentModule").select2({
		theme:"bootstrap4",
		dropdownParent:"#moduleFormModal"
	});

}

function moduleFormContentModal(){
		$('#moduleFormModal #moduleName').val('');
		$('#moduleFormModal #pageLink').val('');
		$('#moduleFormModal #moduleIcon').val('');
		$('#moduleFormModal #moduleType').val('');
		$('#moduleFormModal #parentModule').val('');
		/* $('#moduleFormModal #orderSet').val(''); */
		$('#moduleFormModal #moduleActive').val('Y');
		$("#standardDiv").hide();
		$("#course").hide();
		$("#placementCourse").hide();
		$("#placementGradeDiv").hide();
		$('#moduleFormModal').modal('show');
	}
function getModuleContent(title){
	var html='<div class="app-page-title mb-3 py-2">'
		+'<div class="page-title-wrapper">'
		+'		<div class="page-title-heading">'
		+'			<div class="page-title-icon">'
		+'				<i class="fas fa-university text-primary"></i>'
		+'			</div>'
		+'			<div>'+title+'</div>'
		+'		</div>'
		+'		<div class="page-title-actions">'
		+'			<button class="btn btn-primary" onclick="moduleFormContentModal();">Add New Module</button>'
		+'		</div>'
		+'	</div>'
		+'</div>';
	html+=getModuleContentCard();
	html+=getModuleAddEditPopup();
	return html;
}

function getModuleContentCard(){
	var html='';
		html+='<div class="main-card mb-3 card">';
			html+='<div class="card-body">';
			html+=getModuleDataList();
			html+='</div>';
		html+='</div>';
		
	return html;
}

function getModuleDataList(){
	var html='';
	html+=`
		<div class="row">
			<div class="col-lg-12 col-md-12">
				<div class="d-flex align-items-center flex-wrap justify-content-end mb-2" style="gap:0.5rem">
					<input type="text" name="moduleSearch" id="moduleSearch" class="w-fit-content form-control form-control-sm" placeholder="Search" />
				</div>
				<div class="table-responsive">
					<table class="table table-bordered table-striped border-radius-table font-12 responsive nowrap" id="moduleList" style="font-size:12px;width:100%" >
						<thead>
							<tr class="bg-primary text-white">
								<th class="font-weight-normal border-bottom-0 vertical-align-middle rounded-top-left-10">S.No</th>
								<th class="font-weight-normal border-bottom-0 vertical-align-middle text-center">Module Icon</th>
								<th class="font-weight-normal border-bottom-0 vertical-align-middle">Module Name</th>
								<th class="font-weight-normal border-bottom-0 vertical-align-middle">Page Link</th>
								<th class="font-weight-normal border-bottom-0 vertical-align-middle">Module Type</th>
								<th class="font-weight-normal border-bottom-0 vertical-align-middle">Order</th>
								<th class="font-weight-normal border-bottom-0 vertical-align-middle text-center">Status</th>
								<th class="font-weight-normal border-bottom-0 vertical-align-middle rounded-top-right-10 text-center">Action</th>
							</tr>
						</thead>
						<tbody id="moduleListbody"></tbody>
					</table>
				</div>
			</div>
		</div>
		<div class="modulepaging"></div>`;
		
	return html;
}

function dataPagging(datalimit, updated){
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
				+'<a class="page-link" href="javascript:void(0);" onclick="getAllModulesList(\''+updated+'\', \''+(currentPage-1)+'\', false);">Previous</a>'
			 	+'</li>';
			 }
			for (let p = 1; p <= noOfPages; p++) {
				if(p < startPageLimit || p > (noOfPages -1) || (p>=leftLimit && p<rightLimit) ){
					if(p > (noOfPages -1) || (p<leftLimit && p>rightLimit)){
						html+='...';
					}
					html+='<li class="page-item">'
					+'<a href="javascript:void(0);" onclick="getAllModulesList(\''+updated+'\', \''+p+'\', false);" class="page-link '+(p==currentPage?'page-link-active':'')+'">'+p+'</a>'
					+'</li>';
				}else{

				}
			}
			if(currentPage<noOfPages){
				var nextPage=parseInt(currentPage)+1;
				html+='<li class="page-item">'
				+'<a class="page-link" href="javascript:void(0);" onclick="getAllModulesList(\''+updated+'\', \''+nextPage+'\', false);">Next</a>'
				+'</li>';
			}
		html+='</ul>';
	}
	return html;
}

function getModuleAddEditPopup(){
	var html=''
	html+=`<div class="modal fade " id="moduleFormModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel1" data-backdrop="static">
			<div  class="modal-dialog" role="document">
				<div class="modal-content">
					<div class="modal-header py-2 bg-primary text-white">
						<h5 class="modal-title">Add/Edit Module</h5>
						<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">&times;</span>
						</button>
					</div>
					<div class="modal-body">
						<form autocomplete="off" id="moduleFormId">
						<input type="hidden" name="moduleId" id="moduleId" value="" />
							<div class="row">
								<div class="col-md-6">
									<div class="form-group">
										<label for="moduleName" class="control-label">Module Name<span style="color: red;">*</span></label> 
										<input type="text" name="moduleName" id="moduleName" class="form-control"  required="required">
									</div>
								</div>
								<div class="col-md-6">
									<div class="form-group">
										<label for="pageLink" class="control-label" >Page Link <span style="color: red;">*</span></label> 
										<input type="text" name="pageLink" id="pageLink" class="form-control"  required="required">
									</div>
								</div>
								<div class="col-md-6">
									<div class="form-group">
										<label for="moduleIcon" class="control-label" >Module Icon <span style="color: red;">*</span></label> 
			                            <input type="text" name="moduleIcon" id="moduleIcon" class="form-control"  required="required">
									</div>
								</div>
								<div class="col-md-6">
									<div class="form-group">
										<label for="email" class="control-label" >Module Type <span style="color: red;">*</span></label> 
											<select class="form-control" name="moduleType" id="moduleType" required="required">
				                                <option value="">Select Module Type</option>
				                                <option value="M">Main Module</option>
				                                <option value="S">Sub Module</option>
				                            </select>
									</div>
								</div>
								
								 <div class="col-md-6">
									<div class="form-group">
										<label class="control-label">Parent Module<span style="color: red;">*</span></label> 
										<select class="form-control" name="parentModule" id="parentModule">
			                            </select> 
									</div>
								</div> 
								<div class="col-md-6" >
									<div class="form-group" >
										<label class="control-label">Order Number<span style="color: red;">*</span></label> 
			                             <input type="text" name="orderSet" id="orderSet" class="form-control"   disabled>  
									</div>
								</div>
								<div class="col-md-6">
									<div class="form-group">
										<label for="email" class="control-label"
											>Status <span
											style="color: red;">*</span></label> 
											<select class="form-control"  name="moduleActive" id="moduleActive" disabled>
					                        	<option selected >Select Status</option>
					                            <option value="Y">Active</option>
					                            <option value="N">Inactive</option>
					                        </select>
									</div>
								</div>
							</div>

						</form>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-primary" onclick="return callModuleCreate('moduleFormId','SCHOOL',${ROLE_MODULE.moduleId});">Save</button>
					</div>
				</div>
			</div>
		</div>`;
		return html;
}




