

function getQuestionDashboardContent(title,roleAndModule,SCHOOL_ID,USER_ID,USER_ROLE){
	var html =getQuestionContent(title);
	$('#dashboardContentInHTML').html(html);
	
	getQuestionList(USER_ID, 0, 30)
}

function initCustomeModal(){
	var modalElementId='modelQuestionContentIdContent';
	$('#'+modalElementId).html('');
}

function getQuestionContent(title){
    var html =` <div class="app-page-title mb-3 py-2">
	<div class="page-title-wrapper">
		<div class="page-title-heading">
			<div class="page-title-icon"> <i class="fa fa-calendar-plus text-primary"> </i> </div>
			<div>${title}</div>
		</div>
		<div class="page-title-actions">
			<a href="javascript:void(0)" onclick="showQuestionFormModel(0)" class="btn btn-primary">Create Question</a>
		</div>
	</div>
</div>
<div class="main-card mb-3">
	<div class="card">
		<div class="card-body">
			<div class="d-flex align-items-center flex-wrap justify-content-end mb-2" style="gap:0.5rem">
				<input type="text" name="questionDataSearch" id="questionDataSearch" class="w-fit-content form-control form-control-sm" placeholder="Search" />
			</div>
			<table class="table table-bordered table-striped responsive dt-responsive" id="questionListTbl">
				<thead>
					<tr>
						<th>Sr. No</th>
						<th>Event Name</th>
						<th>Question Category</th>
						<th>Question</th>
						<th>Element Name</th>
						<th>Parent Question</th>
						<th>Activate</th>
						<th>Create Date</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody id="questionListBody"></tbody>
			</table>
		</div>
		<div class="questionpaging"></div>
	</div>
</div>	`
;
html+=questionSaveModal();
html+=getQuestionContentModal();
return html;
}

function questionSaveModal(){
	var html =`<div class="modal fade fade-scale" id="questionFormModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-modal="true">
		<div class="modal-dialog modal-lg" role="document">
			<div class="modal-content">
				<div class="modal-header pt-2 pb-2 theme-bg text-white">
					<h5 class="modal-title text-white" id="feedback_title">Question Title</h5>
					<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">×</span>
					</button>
				</div>
				<div class="modal-body">
					<form id="questionForm" class="col-lg-12 mx-auto custom-field-scope" method="post" action="javascript:void(0);" novalidate="novalidate">
						<input type="hidden" name="questionId" id="questionId" value="" />
						<div class="row">
							<div class="col-lg-4">
								<div class="position-relative custom-field mb-2 mt-3 p-0">
									<select name="eventId" id="eventId" class="form-control">
										<option value="">Select event</option>
									</select>
									<label for="eventId">Event Type</label>
								</div>
							</div>
							<div class="col-lg-4">
								<div class="position-relative custom-field mb-2 mt-3 p-0">
									<select name="questionType" id="questionType" class="form-control" disabled>
										<option value="">--Select--</option>
										<option value="0" selected>Non Optional</option>
										<option value="1">Optional</option>
									</select>
									<label for="questionType">Question Type</label>
								</div>
							</div>
							<div class="col-lg-4">
								<div class="position-relative custom-field mb-2 mt-3 p-0">
									<select name="mandatory" id="mandatory" class="form-control" disabled>
										<option value="">--Select--</option>
										<option value="1">Mandatory</option>
										<option value="0" selected>Non Mandatory</option>
									</select>
									<label for="mandatory">Question Mandatory</label>
								</div>
							</div>
							<div class="col-lg-4">
								<div class="position-relative custom-field mb-2 mt-3 p-0">
									<select name="questionElementType" id="questionElementType" class="form-control" disabled>
										<option value="4" selected>RATING</option>
									</select>
									<label for="questionElementType">Element Type</label>
								</div>
							</div>
							<div class="col-lg-4">
								<div class="position-relative custom-field mb-2 mt-3 p-0">
									<select name="questionCategory" id="questionCategory" class="form-control" disabled>
										<option value="">Question Category</option>
										<option value="0" selected>Single</option>
										<option value="1">Multiple</option>
									</select>
									<label for="questionCategory">Question Category</label>
								</div>
							</div>
							<div class="col-lg-12">
								<div class="position-relative custom-field mb-2 mt-3 p-0">
									<input type="text" class="form-control" id="question" name="question" placeholder=" ">
									<label for="question">Question</label>
								</div>
							</div>
						
							<div class="col-lg-8" style="display:none;">
								<label for="answerLabel">Label</label>
								<div class="inc">
									<div class="row">
										<div class="col-md-6">
											<div class="position-relative custom-field mb-2 mt-3 p-0">
												<input type="text" class="form-control" name="answerLabel" placeholder=" ">
												<label>Answer Label</label>
											</div>
										</div>
										<div class="col-md-6">
											<button type="button" class="btn btn-primary" name="addNewLabel" id="addNewLabel" value="Add">+</button>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-lg-3">
								<div class="position-relative custom-field mb-2 mt-3 p-0">
									<select name="questionActive" id="questionActive" class="form-control">
										<option value="1">Active</option>
										<option value="0">Inactive</option>
									</select>
									<label>Active/ Inactive </label>
								</div>
							</div>
							<div class="col-lg-4">
								
							</div>
						</div>
					</form>
				</div>
				<div class="modal-footer">
					<div class="text-center" style="margin: 0 auto;">
						<button type="submit" class="btn btn-primary" name="submit" id="questionSubmit" value="Submit">Submit</button>
						<button id='resetDeleteErrorWarningCancel' type="button" class="btn btn-primary" data-dismiss="modal" >Close</button>
					</div>
				</div>
			</div>
		</div>	
	</div>`;
return html
}


function dataquestionPagging(datalimit, userId){
	var noOfPages = datalimit.noOfPage;
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
				+'<a class="page-link" href="javascript:void(0);" onclick="getQuestionList(\''+userId+'\',\''+(currentPage-1)+'\', 30);">Previous</a>'
			 	+'</li>';
			 }
			for (let p = 1; p <= noOfPages; p++) {
				if(p < startPageLimit || p > (noOfPages -1) || (p>=leftLimit && p<rightLimit) ){
					if(p > (noOfPages -1) || (p<leftLimit && p>rightLimit)){
						html+='...';
					}
					html+='<li class="page-item">'
					+'<a href="javascript:void(0);" onclick="getQuestionList(\''+userId+'\', \''+p+'\', 30);" class="page-link '+(p==currentPage?'page-link-active':'')+'">'+p+'</a>'
					+'</li>';
				}else{

				}
			}
			if(currentPage<noOfPages){
				var nextPage=parseInt(currentPage)+1;
				html+='<li class="page-item">'
				+'<a class="page-link" href="javascript:void(0);" onclick="getQuestionList(\''+userId+'\', \''+nextPage+'\', 30);">Next</a>'
				+'</li>';
			}
		html+='</ul>';
	}
	return html;
}

function reviewSearchReset(formid){
	$("#startDateSearch").val('')
	$("#endDateSearch").val('')
}


function getQuestionContentModal(){
	
	var html=`<div class="modal fade fade-scale" id="modelQuestionContentId" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-modal="true">
	    <div class="modal-dialog modal-lg">
	        <div class="modal-content">
	            <div class="modal-header">
	                <h5 class="modal-title" id="modelQuestionContentIdTitle">Modal title</h5>
	                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
	                    <span aria-hidden="true">&times;</span>
	                </button>
	            </div>
	            <div id="modelQuestionContentIdContent" class="modal-body"></div>
				
	            <div class="modal-footer">
	                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
	            </div>
	        </div>
	    </div>
	</div>`;
	return html;
}
