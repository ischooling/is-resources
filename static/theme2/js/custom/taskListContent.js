
async function renderTaskListDashboard(title, roleAndModule, SCHOOL_ID, USER_ID,USER_ROLE){
	ROLE_MODULE=roleAndModule;
	var objRight= await getTaskData(roleAndModule.moduleId, USER_ID);
	var objectRights=objRight.objectRights;
	OBJECT_RIGHTS=objectRights;
	var html=await getTasksContent(title, objectRights);
    $('#dashboardContentInHTML').html(html);
	$(".fromTime").select2({
			theme:"bootstrap4",
	});
	$(".toTime").select2({
		theme:"bootstrap4",
	});
	getAllTaskList(USER_ID, 0, 0, true);
	

$("#dataStartDate").datepicker({
	format : 'dd-mm-yyyy',
	autoclose: true,
});
$("#dataEndDate").datepicker({
	format : 'dd-mm-yyyy',
	autoclose: true,
});
$("#taskDate").datepicker({
    format : 'dd-mm-yyyy',
    startDate: "-1d",
    endDate: new Date(),
    autoclose: true,
}).datepicker("setDate", changeDateFormat(new Date(),"dd-mm-yyyy"));

$(".hidedate").css({"display":"none"})
	$("#searchtypeTotalLead").on("change", function(){
		if($("#searchtypeTotalLead").val()=='CUSTOM'){
			$(".hidedate").css({"display":"block"});
		}else{
			$(".hidedate").css({"display":"none"})
			getAllTaskList(USER_ID, 0, 0, true);
			
		}
	});

	$("#btnWiseSubmit").on("click",function(){
        var startDate = $("#dataStartDate").val();
        var endDate = $("#dataEndDate").val();
        var searchCountrytype = $("#searchtypeTotalLead").val();
        if($("#dataStartDate").val()=='' && $("#dataStartDate").val()==undefined){
            showMessageTheme2(1, 'Please choose start date','',true);
		        return false;
        }
        if($("#dataEndDate").val()=='' && $("#dataEndDate").val()==undefined){
            showMessageTheme2(1, 'Please choose end date','',true);
		        return false;
        }
		getAllTaskList(USER_ID, 0, 0, true);
    });
	initEditor(1, 'description','Please start here', false);
}

function taskFormContentModal(formId){
		$("#"+formId+" #taskname").val('')
		$("#"+formId+" #fromTime").val('').trigger('change')
		$("#"+formId+" #toTime").val('').trigger('change')
		$("#"+formId+" #status").val('PENDING')
		$("#"+formId+" #description").val('')
		editor1.setData('');
		getAllTaskList(USER_ID, 0, 0, true);
		$('#adminAddTaskpopup').modal('show');
	}
function getTasksContent(title, objectRights){
	var html='<div class="app-page-title mb-3 py-2">'
		+'<div class="page-title-wrapper">'
		+'		<div class="page-title-heading">'
		+'			<div class="page-title-icon">'
		+'				<i class="fas fa-university text-primary"></i>'
		+'			</div>'
		+'			<div>'+title+'</div>'
		+'		</div>'
		+'		<div class="page-title-actions">'
		+'			<button class="btn btn-primary" onclick="taskFormContentModal(\'adminAddTask\');">Add Task</button>'
		+'		</div>'
		+'	</div>'
		+'</div>';
	html+=getTasksContentCard(objectRights);
	html+=getAdminAddTask(objectRights);
	return html;
}

function getTasksContentCard(objectRights){
	var html='';
		html+='<div class="main-card mb-3 card">';
			html+='<div class="card-body">';
			html+=getTaskDataList();
			html+='</div>';
		html+='</div>';
		
	return html;
}

function getTaskDataList(){
	
	var html='';
	html+=`
		<div class="row">
			<div class="col-lg-12 col-md-12">
				<div class="d-flex align-items-center flex-wrap justify-content-end mb-2" style="gap:0.5rem">
					<select class="form-control form-control-sm mr-1 mb-2" id="searchtypeTotalLead" name="searchtypeTotalLead" style="width:fit-content">
							<option value="DAY" >Today</option>
							<option value="WEEK" >Week</option>
							<option value="MONTH" >Month</option>
							<option value="CUSTOM">Custom</option>
						</select>
						<div class="hidedate">
							<div class="d-flex align-items-center flex-wrap" style="gap:0.5rem">
								<div class="d-inline-flex align-items-center flex-wrap" style="gap:0.5rem">
									<input type="text" name="dataStartDate" class="form-control form-control-sm" id="dataStartDate" placeholder="Start Date" style="width:100px" readonly onkeydown="return false" />
									<div class="mx-1">To</div>
									<input type="text" name="dataEndDate" class="form-control form-control-sm" id="dataEndDate" placeholder="End Date" style="width:100px" readonly onkeydown="return false" />
								</div>
								<button class="btn btn-primary" id="btnWiseSubmit">Submit</button>
							</div>
						</div>
					</div>
				</div>
				<div class="table-responsive">
					<table class="table table-bordered table-striped border-radius-table font-12 responsive nowrap task-list-table" id="adminTaskList" style="font-size:12px;width:100%" >
						<thead>
							<tr class="bg-primary text-white">
								<th class="font-weight-normal border-bottom-0 vertical-align-middle rounded-top-left-10">S.No</th>
								<th class="font-weight-normal border-bottom-0 vertical-align-middle">Task Name</th>
								<th class="font-weight-normal border-bottom-0 vertical-align-middle">Time</th>
								<th class="font-weight-normal border-bottom-0 vertical-align-middle text-center">Status</th>
								<th class="font-weight-normal border-bottom-0 vertical-align-middle">Description</th>
								<th class="font-weight-normal border-bottom-0 vertical-align-middle rounded-top-right-10 text-center">Action</th>
							</tr>
						</thead>
						<tbody id="adminTaskTbody"></tbody>
					</table>
				</div>
			</div>
		</div>
		`;
		
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

function getAdminAddTask(objectRights){
	timeslotlist=objectRights.timeslotlist
	var html=`<div id="adminAddTaskpopup" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-modal="true" data-backdrop="static" data-keyboard="false">
		<div class="modal-dialog modal-xl">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" id="adminTaskTitle">Task</h5>
					<button type="button" class="close" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">×</span>
					</button>
				</div>
				<div class="modal-body">
				<form id="counselorAddTask">
				<input type="hidden" name="taskid" id="taskid" value="" />
				<input type="hidden" name="assignto" id="assignto" value="${USER_ID}" />
						<div class="row">
							<div class="col-xl-3 col-lg-3 col-md-3 col-sm-12 mb-2">
								<label for="taskname">Task Name</label>
								<input type="text" id="taskname" class="form-control" maxlength="500"/>
							</div>
							<div class="col-xl-2 col-lg-2 col-md-4 col-sm-12 mb-2">
								<label>Task Date (DD-MM-YYYY)</label>
								<div class="d-flex align-items-center">
									<input type="text" id="taskDate" class="form-control" readonly onkeydown="return false"/>
								</div>
							</div>
							<div class="col-xl-3 col-lg-3 col-md-4 col-sm-12 mb-2">
								<label>Time</label>
								<div class="d-flex align-items-center">
									<select class="form-control font-12 mr-2 fromTime" id="fromTime">
										<option value="">Start Time</option>`
										if(timeslotlist.length>0){
											for (let i = 0; i < timeslotlist.length; i++) {
												const timeopt = timeslotlist[i];
												var startTime=convertTo24Hour(timeopt);
												//var strSelect = (preStartTime==startTime)?'selected':'';
												html+=`<option value="${startTime}" >${timeopt}</option>`;
											}
										}
									html+=`</select>
									<span class="mx-1">-</span>
									<select class="form-control font-12 toTime" id="toTime">
										<option value="">End Time</option>`
										if(timeslotlist.length>0){
											for (let i = 0; i < timeslotlist.length; i++) {
												const timeopt = timeslotlist[i];
												var startTime=convertTo24Hour(timeopt);
												//var strSelect = (preEndTime==startTime)?'selected':'';
												html+=`<option value="${startTime}" >${timeopt}</option>`;
											}
										}
									html+=`</select>
								</div>
							</div>
							<div class="col-xl-3 col-lg-4 col-md-4 col-sm-12 mb-2">
								<label for="status">Status</label>
								<select class="form-control font-12" id="status">
									<option value="PENDING">Pending</option>
									<option value="IN-PROCESS">In-Process</option>
									<option value="COMPLETED">Completed</option>
								</select>
							</div>
							<div class="col-12 mb-3">
								<label for="description">Description</label>
								<textarea id="description" class="form-control" rows="5"></textarea>
							</div>
						</div>
						<a href="javascript:void(0)" class="btn btn-lg btn-primary saveTask mb-3 float-right" onclick="saveTask('counselorAddTask','add','0','admin');">Save</a>
					</form>
				</div>
			</div>
		</div>
	</div>`;
	return html;
}




