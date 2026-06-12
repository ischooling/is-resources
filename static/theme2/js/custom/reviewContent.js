

function getReviewDashboardContent(title,roleAndModule,SCHOOL_ID,USER_ID,USER_ROLE){
	var html =getReviewContent(title);
	$('#dashboardContentInHTML').html(html);
	//getReview(USER_ID, "", 0, 0, 50);
    getSessionMasterList('reviewPopupSearchForm', 'acadmicYear', true);
	callForFeedbackQuestionViewList(USER_ID, 0, 30)

	$('#startDateSearch').datepicker({
			autoclose: true,
			format: 'dd-mm-yyyy',
			container: '#reviewPopupSearchForm',
	});

	$('#endDateSearch').datepicker({
		autoclose: true,
		format: 'dd-mm-yyyy',
		container: '#reviewPopupSearchForm',
	});

	$("#btnClickFeedbackSearch").on('click', function(){
		callForFeedbackQuestionViewList(USER_ID, 0, 30)
		$('#reviewPopupSearch').modal('hide');
	})

	 $("#questionDataSearch").on('keyup', function (e) {
        if($("#questionDataSearch").val().length>=3){
            callForFeedbackQuestionViewList(USER_ID, 0, 30)
        }else if($("#questionDataSearch").val().length==0){
            callForFeedbackQuestionViewList(USER_ID, 0, 30)
        }
    });


}

function getReviewContent(title){
    var html =` <div class="app-page-title mb-3 py-2">
	<div class="page-title-wrapper">
		<div class="page-title-heading">
			<div class="page-title-icon"> <i class="fa fa-calendar-plus text-primary"> </i> </div>
			<div>${title}</div>
		</div>
	</div>
</div>
<div class="main-card mb-3">
	<div class="card">
		<div class="card-body">
			<div class="d-flex align-items-center flex-wrap justify-content-end mb-2" style="gap:0.5rem">
				<button class=" btn btn-info mr-2" onclick="reviewAdvSearchModel()"><i class="fa fa-search"></i>&nbsp;Advance Search</button>
				<input type="text" name="questionDataSearch" id="questionDataSearch" class="w-fit-content form-control form-control-sm" placeholder="Search" />
			</div>
			<div id="accordion" class="accordion-wrapper">
				
				<table class="table table-bordered table-striped responsive dt-responsive" id="feedbackReviewTbl">
					<thead>
						<tr>
							<th class="bg-primary text-white">S.No</th>
							<th class="bg-primary text-white">Event Name</th>
							<th class="bg-primary text-white">Total Question</th>
							<th class="bg-primary text-white">Send Email Request Count</th>
							<th class="bg-primary text-white">Mail Send Count</th>
							<th class="bg-primary text-white">Clicked Count</th>
							<th class="bg-primary text-white">Replied Count</th>
						</tr>
					</thead>
					<tbody id="feedbackReviewTbody"></tbody>
				</table>
			</div>
		</div>
	</div>
</div>	`
;
html+=reviewModal();
html+=getReviewSearchPopup();
return html;
}



function reviewModal(){
	var html =`
	<div class="modal fade fade-scale" id="reviewModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-modal="true">
	<div class="modal-dialog modal-lg" role="document">
		<div class="modal-content">
			<div class="modal-header pt-2 pb-2 theme-bg text-white">
				<h5 class="modal-title text-white" id="feedback_title">Feedback Title</h5>
				<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">×</span>
				</button>
			</div>
			<div class="modal-body">
				<div class="d-flex align-items-center flex-wrap justify-content-end mb-2" style="gap:0.5rem">
					<input type="text" name="reviewDataSearch" id="reviewDataSearch" class="w-fit-content form-control form-control-sm" placeholder="Search" />
				</div>
				<table class="table table-bordered table-striped responsive dt-responsive" id="answerReview">
					<thead>
						<tr>
							<th>S.No.</th>
							<th>User name</th>
							<th>Reply</th>
						</tr>
					</thead>
					<tbody id="answerReviewTbody"></tbody>
				</table>
			</div>
			<div class="reviewpaging"></div>
		</div>
	</div>
</div>`;
return html
}


function dataReviewPagging(datalimit,eventId, evSrno, userId, questionId){
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
				+'<a class="page-link" href="javascript:void(0);" onclick="getReview(\''+userId+'\',\''+eventId+'\', \''+evSrno+'\', \'SUMMARY\', \''+questionId+'\',\''+(currentPage-1)+'\', 50);">Previous</a>'
			 	+'</li>';
			 }
			for (let p = 1; p <= noOfPages; p++) {
				if(p < startPageLimit || p > (noOfPages -1) || (p>=leftLimit && p<rightLimit) ){
					if(p > (noOfPages -1) || (p<leftLimit && p>rightLimit)){
						html+='...';
					}
					html+='<li class="page-item">'
					+'<a href="javascript:void(0);" onclick="getReview(\''+userId+'\',\''+eventId+'\', \''+evSrno+'\',\'SUMMARY\', \''+questionId+'\', \''+p+'\', 50);" class="page-link '+(p==currentPage?'page-link-active':'')+'">'+p+'</a>'
					+'</li>';
				}else{

				}
			}
			if(currentPage<noOfPages){
				var nextPage=parseInt(currentPage)+1;
				html+='<li class="page-item">'
				+'<a class="page-link" href="javascript:void(0);" onclick="getReview(\''+userId+'\',\''+eventId+'\', \''+evSrno+'\',\'SUMMARY\', \''+questionId+'\', \''+nextPage+'\', 50);">Next</a>'
				+'</li>';
			}
		html+='</ul>';
	}
	return html;
}

function getReviewSearchPopup(){
	var html='';
	html+=`<div id="reviewPopupSearch" class="modal fade bd-example-modal-lg fade-scale" tabindex="" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl">
        <div class="modal-content border-0">
            <div class="modal-header py-2 bg-primary text-white">
                <h5 class="modal-title" >Advance Search</h5>
                <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form action="javascript:void(0);" id="reviewPopupSearchForm" name="reviewPopupSearchForm" autocomplete='off' class="custom-field-scope">
				<input type="hidden" name="userId" id="userId" value="${USER_ID}">
					<div class="row">
						<div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 mb-1 mt-1">
							<div class="leadErrorText"></div>
						</div>
					</div>
					<div class="row">
						<div class="col-xl-3 col-lg-3 col-md-4 col-sm-4 col-12 mb-1 mt-1 acadmicYearDiv">
							<div class="position-relative custom-field mb-2 mt-3 p-0">
								<select name="acadmicYear" id="acadmicYear" class="form-control">
									<option value="all">All</option>
								</select>
								<label class="m-0">Academic Year</label>
							</div>
						</div>
						<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-1 mt-1">
							<div class="position-relative custom-field mb-2 mt-3 p-0">
								<input type="text" name="startDateSearch" id="startDateSearch" class="form-control datepicker" readonly onkeydown="return false" placeholder=" ">
								<label class="m-0">Start Date</label>
							</div>
						</div>
						<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-1 mt-1">
							<div class="position-relative custom-field mb-2 mt-3 p-0">
								<input type="text" name="endDateSearch" id="endDateSearch" class="form-control datepicker" readonly onkeydown="return false" placeholder=" ">
								<label class="m-0">To Date</label>
							</div>
						</div>
					</div>
				</form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-danger  float-right pr-4 pl-4 ml-2" onclick="reviewSearchReset('reviewPopupSearchForm')">Reset</button>
				<button type="button" class="btn btn-info  float-right pr-4 pl-4 ml-2" data-dismiss="modal">Close</button>
				<button type="button" class="btn btn-success  float-right pr-4 pl-4" id="btnClickFeedbackSearch" >Search</button>
            </div>
        </div>
    </div>
</div>`;
return html;
}
function reviewSearchReset(formid){
	$("#startDateSearch").val('')
	$("#endDateSearch").val('')
}
