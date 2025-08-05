
var ROLE_MODULE="";
var OBJECT_RIGHTS="";
async function renderAutoProgressReportDashboard(title, roleAndModule, SCHOOL_ID, USER_ID,USER_ROLE){
  	//var objRight= await getLeadReportData(roleAndModule.moduleId, USER_ID);
	//var objectRights=objRight.objectRights;
	ROLE_MODULE=roleAndModule;
	var html=await getAutoProgressReportListContent(title);
    $('#dashboardContentInHTML').html(html);
	// callRoleDropdown("adminFilter",'','roleUser');
	courseProviderList('autoStudentSearchForm','lmsPlatform');
	getSessionMasterList('autoStudentSearchForm', 'acadmicYear', false);
	getAutoWeeklyProgressList(ROLE_MODULE.moduleId, 0,0);
	$("#autoStudentSearchForm #standardId").select2({
		theme:"bootstrap4",
		dropdownParent:"#autoStudentSearchForm"
	});
	
	$("#startReportDate").datepicker({
		format : 'M dd, yyyy',
	    autoclose: true,
		"setDate": new Date(),
	}).on('changeDate', function() {
		var reporttype = $("#reporttype").val();
		if(reporttype==0){
		}else{
			var dobd =getDateInDateFormat(this.value);
			dobd = changeDateFormat(dobd, 'mm-dd-yyyy')
			var strtDate = new Date(dobd);
			var intdays = parseInt($("#reporttype").val(), 10);
			strtDate.setDate(strtDate.getDate() + (intdays-1));
			$("#endReportDate").val(getDateStringFormat(strtDate));
		}
	});
	

	$("#endReportDate").datepicker({
		format : 'M dd, yyyy',
	    autoclose: true,
		"setDate": new Date(),
	});
		
		//.on('changeDate', function (selected) {
	var strtDate = new Date();
	$("#startReportDate").val(getDateStringFormat(strtDate));
	var intdays = parseInt($("#reporttype").val(), 10);
	strtDate.setDate(strtDate.getDate() + (intdays-1));
	$("#endReportDate").val(getDateStringFormat(strtDate));

	$("#reporttype").on('change',function(){
		var reporttype = $("#reporttype").val();
		if(reporttype>0){
			if($("#startReportDate").val()==''){
				var strtDate = new Date();
				$("#startReportDate").val(getDateStringFormat(strtDate));
				var intdays = parseInt($("#reporttype").val(), 10);
				strtDate.setDate(strtDate.getDate() + (intdays-1));
				$("#endReportDate").val(getDateStringFormat(strtDate));
			}else{
				var dobd =getDateInDateFormat($("#startReportDate").val());
				dobd = changeDateFormat(dobd, 'mm-dd-yyyy');
				var date = new Date(dobd);
				var days = parseInt($("#reporttype").val(), 10);
				date.setDate(date.getDate() + (days-1));
				$("#endReportDate").val(getDateFormat(date));
			}
		}else if(reporttype==15){
			
		}else{
			$("#startReportDate").val('');
			$("#endReportDate").val('');
		}
	});

	
	

$("#checkAllStudent").trigger("change");

$("#checkAllStudent").unbind().bind('change',function() {
    if (this.checked) {
        $(".checkAllStd").each(function() {
            this.checked=true;
            //$("#studentWeek"+$(this).val()).val(1);
        });
    } else {
        $(".checkAllStd").each(function() {
            this.checked=false;
            //$("#studentWeek"+$(this).val()).val(0);
        });
    }
});

$(".checkAllStd").unbind().bind('click',function () {
    if ($(this).is(":checked")) {
        var isAllChecked = 0;
        //$("#studentWeek"+$(this).val()).val(1);
        $(".checkAllStd").each(function() {
            if (!this.checked)
                isAllChecked = 1;
        });

        if (isAllChecked == 0) {
            $("#checkAllStudent").prop("checked", true);
        }     
    }
    else {
        $("#checkAllStudent").prop("checked", false);
        //$("#studentWeek"+$(this).val()).val(0);
    }
});

	
	// $("#btmSearchUsers").on("click", function(){
	// 	getAdminUserList('adminFilter',ROLE_MODULE.moduleId, 0);
	// });

	// $("#adminFilter #roleUser").select2({
	// 	theme:"bootstrap4",
	// 	dropdownParent:"#adminFilter"
	// });
}
function getDateFormat(dateObject) {
		var d = new Date(dateObject);
		var day = d.getDate();
		var month = d.getMonth() + 1;
		var year = d.getFullYear();
		if (day < 10) {
			day = "0" + day;
		}
		if (month < 10) {
			month = "0" + month;
		}
		var date = month + "-" + day + "-" + year;
		return date;
	}

	function getDateStringFormat(dateObject) {
		var d = new Date(dateObject);
		var dts = d.toString().split(" ")[1]+ " "+d.toString().split(" ")[2]+", "+d.toString().split(" ")[3];
		return dts;
	}
function openAutoProgresspopUp(){
	$("#autoViewModule").modal('show');
}
function getAutoProgressReportListContent(title){
	var html='<div class="app-page-title mb-3 py-2">'
		+'<div class="page-title-wrapper">'
		+'		<div class="page-title-heading">'
		+'			<div class="page-title-icon">'
		+'				<i class="fas fa-university text-primary"></i>'
		+'			</div>'
		+'			<div>'+title+'</div>'
		+'		</div>'
		+'		<div class="page-title-actions">'
		+'			<a href="#" onclick="return openAutoProgresspopUp();" class="btn btn-primary">Generate Bulk Reports</a>'
		+'		</div>'
		+'	</div>'
		+'</div>';
	html+=getAutoStudentProgressListContentCard();
	return html;
}

function getAutoStudentProgressListContentCard(){
	var html='';
		html+='<div class="main-card mb-3 card">';
		html+='<div class="card-body">';
		html+=getAutoStudentProgressList();
		// Don't know why is use bhagat
		// html+='<div id="generateReport"></div>';
		// html+='</div>';
		html+='</div>';
		html+=getResetProgressReport();
		html+=getAutoViewModule();
		html+=getAutoMailStudent();
		html+=getFaildStudents();
	return html;
}

function getAutoStudentProgressList(){
	var html='';
	html+=`
		<div class="row">
			<div class="col-lg-12 col-md-12">
				<table class="table table-bordered table-striped border-radius-table font-12 responsive nowrap" id="autoWeeklyReportTable" style="width:100%;">
					<thead class="bg-primary text-white">
						<tr>
							<th class="text-center">S.No</th>
							<th>Frequency (Start Date - End Date) </th>
							<th>Generation Date</th>
							<th>Generated By</th>
							<th class="text-center">Student List</th>
						</tr>
					</thead>
					<tbody id="autoReportLogBody"></tbody>
				</table>
			</div>
		</div>
		
		<div class="autoProgressListpaging"></div>`;
		
	return html;
}


function getResetProgressReport(){
	var html='';
	html+=`<div class="modal fade" id="resetProgressReport" tabindex="-1">
	<div class="modal-dialog modal-sm modal-notify modal-danger" role="document">
		<div class="modal-content text-center">
			<div class="modal-header bg-info justify-content-center"
				style="top: 0 !important;width:100% !important; !important; padding: 15px 10px;">
				<p class="heading" style="color: #fff;" id="warningMessage">Are you sure?</p>
			</div>
			<div id="statusMessage-1" class="modal-body delete-modal" style="padding-top:12px">
				<i class="fa fa-sync fa-4x" style="color:#337ab7 !important;"></i>
			</div>
			<div class="modal-footer text-center">
				<div class="text-center" style="margin: 0 auto;">
					<button id='generateReportWarningYes' type="button" class="btn" style="color:#59b2ff !important;border:1px solid #337ab7 !important;background:transparent !important">Yes</button>
					<button id='generateReportWarningNo' type="button" class="btn" data-dismiss="modal" style="color:#59b2ff !important;border:1px solid #337ab7 !important;background:transparent !important">No</button>
					<button id='generateReportWarningCancel' type="button" class="btn btn-default" data-dismiss="modal" style="">Close</button>
				</div>
			</div>
		</div>
	</div>
</div>`;
	return html;
}


function getAutoViewModule(){
	var html='';
	html+=`<div class="modal fade" id="autoViewModule" role="dialog">
	<div class="modal-dialog modal-xl">
		<div class="modal-content">
			<div class="modal-header py-2 bg-primary text-white">
				<h5 id="swprUploadModelTitleView" class="modal-title"></h5>
				<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>
			<div id="autoProgressContents" class="modal-body">
				<form action="javascript:void(0);" class="m-0" id="autoStudentSearchForm" name="autoStudentSearchForm" autocomplete='off'>
					<div class="row">
						<div class="col-xl-3 col-lg-3 col-md-6 col-sm-3 col-12">
							<label>Academic Year<sup>*</sup></label>
							<select	name="acadmicYear" id="acadmicYear" class="form-control"></select>
						</div>
						<div class="col-xl-3 col-lg-3 col-md-6 col-sm-3 col-12">
							<label>LMS Platform<sup>*</sup></label>
							<select name="lmsPlatform" id="lmsPlatform" class="form-control"></select>
						</div>
						<div class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
							<label>Select grade<sup>*</sup></label>
							<select name="standardId" id="standardId" class="form-control">
								<option value="">Select Grade</option>`;
								html+=getStandardContent(SCHOOL_ID,true, false)
							html+=`</select>
						</div>
						<div class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 field-icon-dev">
							<label>Student Email</label>
							<input type="text" class="form-control" name="userNameOrEmail" id="userNameOrEmail" value="" autocomplete="off" />
						</div>
						<div class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
							<label>Student Name</label>
							<input type="text" class="form-control" name="studentName" id="studentName" value="" autocomplete="off"  />
						</div>
						<div class="col-12 text-right">
							<button class="btn btn-success  proceedRecurringClassbtn" type="submit" onclick="callAutoWeeklyStudent('autoStudentSearchForm','${USER_ID}')" ><i class="fa fa-search"></i>&nbsp;Search</button>
						</div>
					</div>
				</form>	
				<div class="full" id="generateReport" style="display:none">
					<div class="row">
						<div class="col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
							<label>Select Report Type<sup>*</sup></label>
							<select name="reporttype" id="reporttype" class="form-control"  required>
								<option value="7">Every 7 days</option>	
								<option value="15">Every 15 days</option>	
								<option value="30">Every 30 days</option>	
								<option value="0">Custom</option>	
							</select>
						</div>
						<div class="col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
							<label class="bmd-label-floating">Report Start Date:</label> 
							<input type="text" class="form-control" id="startReportDate" name="startReportDate" autocomplete="off" readonly onkeydown="return false" />
						</div>
						<div class="col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
							<label class="bmd-label-floating">Report End Date:</label> 
							<input type="text" class="form-control" id="endReportDate" name="endReportDate" autocomplete="off" readonly onkeydown="return false" />
						</div>
						<div class="col-lg-3 col-md-3 col-sm-3 col-12">
							<button class="btn btn-success sendMailbtn" type="submit"  onclick="return showWarningMessageForGenerate('Are you sure you want to generate the report?','callAutoWeeklyStudentSendMail(\\\'autoStudentSendForm\\\',\\\'${USER_ID}\\\',\\\'${UNIQUEUUID}\\\',\\\'${moduleId}\\\')')" > Generate Report</button>
						</div>
						<div class="progress-bulk-report-table full" id="generateReportTable"  style="display:none;max-height:350px;overflow-y:auto;">
							<table class="table table-bordered table-striped border-radius-table font-12 responsive nowrap" id="autoWeeklyStudent">
								<thead>
									<tr>
										<th>Sr.No.</th>
										<th class="text-center"> 
											<input type="checkbox" name="checkAllStudent" id="checkAllStudent" value="all" />
											Check All
										</th>
										<th>Learning Program/LMS Platform </th>
										<th>Student Name</th>
										<th>Grade</th>
									</tr>
								</thead>
								<tbody id="autoStudentReportLog"></tbody>		
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>`;
	return html;
}

function getAutoMailStudent(){
	var html=`
<div class="modal fade" id="autoMailStudent" role="dialog" >
	<div class="modal-dialog modal-xl">
		<div class="modal-content">
			<div class="modal-header py-2 bg-primary text-white" >
				<h5 id="swprUploadModelTitleView" class="modal-title"></h5>
				<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>
			<div class="modal-body">
				<div class="row">
					<div class="col-lg-3 col-md-4 col-sm-6 col-12 mb-2">
						<input type="hidden" id="reportID"/>
						<select id="reportFilter" class="form-control" onchange="callFilterdStudentWeeklyReport('','${USER_ID}','${UNIQUEUUID}','','','','view',0);">
							<option value="all" selected >All</option>
							<option value="success">Success</option>
							<option value="failed">Failed</option>
						</select>
					</div>
					<div class="col-lg-12 col-md-12 col-sm-12 col-12 mb-2">
					<div class="d-flex align-items-center flex-wrap justify-content-end mb-2" style="gap:0.5rem">
						<input type="text" name="weeklyReportSearch" id="weeklyReportSearch" class="w-fit-content form-control form-control-sm" placeholder="Search" />
					</div>
						<table class="table table-bordered responsive nowrap" id="autoWeeklyMailStudent" style="width:100%;">
						<thead>
							<tr>
								<th style="text-align: center; font-weight: bold">S. No.</th>
								<th style="font-weight: bold">Learning Program/LMS Platform </th>
								<th style="font-weight: bold">Student Name</th>
								<th style="font-weight: bold">Student ID</th>
								<th style="font-weight: bold">Grade</th>
								<th style="font-weight: bold">View</th>
								<th style="font-weight: bold">Mail Sent</th>
								<th style="font-weight: bold">Blank Report</th>
								<th style="font-weight: bold">Mail Sent Date Time</th>
							</tr>
						</thead>
						<tbody id="studentReportSendMail">
							
						</tbody>
					</table>
					</div>
					<div class="studentProgressListpaging"></div>
				</div>
				
			</div>
		</div>
	</div>
</div>`;
return html;
}

function getFaildStudents(){
	var html=`<div class="modal fade" id="autoFailedMailStudent" role="dialog" >
	<div class="modal-dialog modal-xl">
		<div class="modal-content">
			<div class="modal-header py-2 bg-primary text-white">
				<h5 id="swprUploadModelTitleView" class="modal-title"></h5>
				<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>
			<div class="modal-body">
				<div class="row">
					<div class="col-lg-12 col-md-12 col-sm-12 col-12 mb-2">
						<table class="table table-bordered responsive nowrap" id="autoFailedWeeklyMailStudent" style="width:100%;">
						<thead>
							<tr>
								<th style="text-align: center; font-weight: bold">S. No.</th>
								<th style="font-weight: bold">Learning Program/LMS Platform </th>
								<th style="font-weight: bold">Student Name</th>
								<th style="font-weight: bold">Student ID</th>
								<th style="font-weight: bold">Grade</th>
								<th style="font-weight: bold">Mail Sent Date Time</th>
								<th style="font-weight: bold">Action</th>
							</tr>
						</thead>
						<tbody id="studentFailedReportSendMail">
							
						</tbody>
						
					</table>
					</div>
					<div class="studentFaildProgressListpaging"></div>
					<div class="col-12 text-right">
						<button class="btn btn-primary proceedRecurringClassbtn" id="sendAllMail" type="submit" > <i class="fa fa-check"></i>Send All</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>`;
return html;
}

function dataProgressListPagging(datalimit){
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
				+'<a class="page-link" href="javascript:void(0);" onclick="getAutoWeeklyProgressList(\''+ROLE_MODULE.moduleId+'\', \''+(currentPage-1)+'\',0);">Previous</a>'
			 	+'</li>';
			 }
			for (let p = 1; p <= noOfPages; p++) {
				if(p < startPageLimit || p > (noOfPages -1) || (p>=leftLimit && p<rightLimit) ){
					if(p > (noOfPages -1) || (p<leftLimit && p>rightLimit)){
						html+='...';
					}
					html+='<li class="page-item">'
					+'<a href="javascript:void(0);" onclick="getAutoWeeklyProgressList(\''+ROLE_MODULE.moduleId+'\', \''+(p)+'\',0);" class="page-link '+(p==currentPage?'page-link-active':'')+'">'+p+'</a>'
					+'</li>';
				}else{

				}
			}
			if(currentPage<noOfPages){
				var nextPage=parseInt(currentPage)+1;
				html+='<li class="page-item">'
				+'<a class="page-link" href="javascript:void(0);" onclick="getAutoWeeklyProgressList(\''+ROLE_MODULE.moduleId+'\', \''+(nextPage)+'\',0);">Next</a>'
				+'</li>';
			}
		html+='</ul>';
	}
	return html;
}

function dataStudentProgressPagging(datalimit, isCron, reportType, weeklyReportId){
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
				+'<a class="page-link" href="javascript:void(0);" onclick="callOpenStudentWeeklyReportPopup(\''+weeklyReportId+'\',\''+USER_ID+'\', \''+UNIQUEUUID+'\',\'\',\'\',\''+isCron+'\',\''+reportType+'\',\''+(currentPage-1)+'\');">Previous</a>'
			 	+'</li>';
			 }
			for (let p = 1; p <= noOfPages; p++) {
				if(p < startPageLimit || p > (noOfPages -1) || (p>=leftLimit && p<rightLimit) ){
					if(p > (noOfPages -1) || (p<leftLimit && p>rightLimit)){
						html+='...';
					}
					html+='<li class="page-item">'
					+'<a href="javascript:void(0);" onclick="callOpenStudentWeeklyReportPopup(\''+weeklyReportId+'\',\''+USER_ID+'\', \''+UNIQUEUUID+'\',\'\',\'\',\''+isCron+'\',\''+reportType+'\',\''+(p)+'\');" class="page-link '+(p==currentPage?'page-link-active':'')+'">'+p+'</a>'
					+'</li>';
				}else{

				}
			}
			if(currentPage<noOfPages){
				var nextPage=parseInt(currentPage)+1;
				html+='<li class="page-item">'
				+'<a class="page-link" href="javascript:void(0);" onclick="callOpenStudentWeeklyReportPopup(\''+weeklyReportId+'\',\''+USER_ID+'\', \''+UNIQUEUUID+'\',\'\',\'\',\'\',\''+reportType+'\',\''+(nextPage)+'\');">Next</a>'
				+'</li>';
			}
		html+='</ul>';
	}
	return html;
}







