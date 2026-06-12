
async function renderLeadAssignDashboard(title, roleAndModule, SCHOOL_ID, USER_ID,USER_ROLE){
  	var objRight= await getLeadAssignData(roleAndModule.moduleId, USER_ID);
	var objectRights=objRight.objectRights;
	OBJECT_RIGHTS=objectRights;
	//console.log(OBJECT_RIGHTS);

	// ROLE_MODULE=roleAndModule;
	var html=await getLeadAssignContent(title, objectRights);
    $('#dashboardContentInHTML').html(html);
	getLeadAssignUser(objectRights);

	
	$("#formdate").val(todayLeadAssignDate());
	$('#formdate').datepicker({
		container: '#leadCounselorDataForm',
		autoclose: true,
		format: 'mm-dd-yyyy',
	}).on('changeDate', function() {
		var dateFrom=this.value;
		getLeadAssignUser(objectRights);
	});

	$("#saveLeadAssignUser").on('click', function(){
		if(!validateLeadRuleConfig('leadAssignCounselor')){
			return false;
		}
		saveLeadAssignToCounselor(USER_ID,'leadAssignCounselor','', 'LEAD');
	});

 	$(".up,.down").click(function(){
        var row = $(this).parents("tr:first");
        if ($(this).is(".up")) {
            row.insertBefore(row.prev());
        } else {
            row.insertAfter(row.next());
        }
		$('table > tbody  > tr').each(function(index, tr) { 
		   $(this).find("td .rowindex").text(index)
		});

    });


	$("#learningProgram").select2({
		theme:"bootstrap4",
		dropdownParent: "#counselorSetCommitionPopup"
	});
	$("#standardId").select2({
		theme:"bootstrap4",
		dropdownParent: "#counselorSetCommitionPopup"
	});

	$("#learningProgramFilter").select2({
		theme:"bootstrap4",
		dropdownParent: "#counselorSetCommitionPopup"
	});
	$("#standardIdFilter").select2({
		theme:"bootstrap4",
		dropdownParent: "#counselorSetCommitionPopup"
	});

	$(".datepicker").datepicker({
		startDate: new Date(),
		format : 'M dd, yyyy',
		autoclose: true,
	});

	getGradesByLearningProgram('saveCounselorCommissionRateForm','learningProgram','standardId','counselorSetCommitionPopup');
	//getGradesByLearningProgram('filterCounselorCommissionRate','standardIdFilter','standardId','counselorSetCommitionPopup');


}


function getLeadAssignContent(title, objectRights){
	var html=
		`<div class="app-page-title mb-3 py-2">
			<div class="page-title-wrapper">
				<div class="page-title-heading">
					<div class="page-title-icon">
						<i class="fas fa-university text-primary"></i>
					</div>
					<div>${title}</div>
				</div>
			</div>
		</div>`
	+getLeadAssignContentCard(objectRights);
	return html;
}

function getLeadAssignContentCard(objectRights){
	var html='';
		html+='<div class="main-card mb-3 card">';
			html+='<div class="card-body">';
			html+=getLeadAssignDataList(objectRights);
			html+='</div>';
		html+='</div>';
		html+='<div id="scheduleMessageContent"></div>';
		html+='<div id="schedulePingMessageContent"></div>';
		html+=getCounselorSetCommitionPopup();
		html+=getCounselorCommissionRateLogs();
	return html;
}

function getLeadAssignDataList(objectRights){
	var countryList=JSON.parse(objectRights.countryList);
	var campaignList=JSON.parse(objectRights.utmCampaignList);
	var html='';
	html+=`
		<div class="row">
			<div class="col-lg-12 col-md-12 col-sm-12 col-12">
				<form class="form-horizontal w-100" method="post" action="javascript:void(0);" id="leadCounselorDataForm">
					<input type="hidden" name="leadId" id="leadId" value="0" />
					<div class="table-responsive">
						<table class="table table-bordered table-striped border-radius-table font-12 responsive nowrap text-center" id="leadAssignCounselor" style="width:100%;min-width:1200px;font-size:11px">
							<thead class="bg-primary text-white">
								<tr>
									<th class="font-weight-normal border-bottom-0 vertical-align-middle rounded-top-left-10" style="width:18% !important">Academic Expert Name<br/>Roles</th>
									<th class="font-weight-normal border-bottom-0 vertical-align-middle" style="width:5% !important">Order</th>
									<th class="font-weight-normal border-bottom-0 vertical-align-middle" style="width:10% !important">Lead | Demo Limit</th>
									<th class="font-weight-normal border-bottom-0 vertical-align-middle" style="width:5% !important">Active | Inactive </th>
									<th class="font-weight-normal border-bottom-0 vertical-align-middle" style="width:15% !important">Countries<div class="dropdown d-inline-block" style="font-size:11px !important" id="activeCountries">`+getActiveCountry(countryList)+`</div></th>
									<th class="font-weight-normal border-bottom-0 vertical-align-middle" style="width:15% !important">Campaigns<div class="dropdown d-inline-block" style="font-size:11px !important" id="activeCampaign">`+getActiveCampaign(campaignList)+`</div></th>
									<th class="font-weight-normal border-bottom-0 vertical-align-middle" style="width:15% !important">SGT(+08:00)
										<br/>
										<input type="text" class="form-control form-control-sm" name="formdate" id="formdate" readonly onkeydown="return false">
										<br/>Auto + User + Other = (Lead + Demo = Total) / Today
									</th>
									<th class="font-weight-normal border-bottom-0 vertical-align-middle rounded-top-right-10" style="width:15% !important">Availability | Commission</th>				
								</tr>
							</thead>
							<tbody id="leadAssignUserList">
								
							</tbody>
						</table>
					</div>
				</form>	
			</div>
			<div class="col-12 text-right">
				<button class="btn btn-success " id="saveLeadAssignUser">Save</button>
			</div>
		</div>`;
	return html;
}
function getActiveCountry(countryList){
	var html=`
	<button type="button" aria-haspopup="true" aria-expanded="true" data-toggle="dropdown" class="dropdown-toggle btn btn-sm btn-primary"><i class="fa fa-info-circle text-white"></i></button> 
		<div tabindex="-1" role="menu" aria-hidden="true" class="dropdown-menu-xl dropdown-menu" x-placement="bottom-start" style="font-size: 11px !important; position: absolute; top: 16px; left: 0px; will-change: top, left;">
			<div class="menu-header-content"><h5 class="text-center ">Active Countries of Last 7 days</h5></div>
				<div class="grid-menu grid-menu-3col">
					<div class="no-gutters row">
						<div class="col-sm-12 col-xl-12 pt-0" style="max-height: 200px;overflow-y: auto;">
							<table class="row-height-small" style="width:100%;">
								<thead class="table-head-sticky">
								<tr>
									<th>S. No.</th> 
									<th>Country Name</th>
									<th>Lead No.</th>
								</tr>	
								</thead>
								<tbody style="font-size:10px">`;
									var ci=1;
									for (let c = 0; c < countryList.length; c++) {
										const country = countryList[c];
										html+=`<tr>
											<td class="border-0">${ci++}</td>
											<td class="border-0">${country.value}</td>
											<td class="border-0">${country.extra}</td>
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

function getActiveCampaign(campaignList){
	var html=`<button type="button" aria-haspopup="true" aria-expanded="true" data-toggle="dropdown" class="dropdown-toggle btn btn-sm btn-primary"><i class="fa fa-info-circle text-white"></i></button> 
		<div tabindex="-2" role="menu" aria-hidden="true" class="dropdown-menu-xl dropdown-menu" x-placement="bottom-start" style="font-size: 11px !important; position: absolute; top: 16px; left: 0px; will-change: top, left;">
			<div class="menu-header-content"><h5 class="text-center ">Active Campaigns of Last 7 days</h5></div>
				<div class="grid-menu grid-menu-3col">
					<div class="no-gutters row">
						<div class="col-sm-12 col-xl-12 pt-0" style="max-height: 200px;overflow-y: auto;">
							<table class="row-height-small" style="width:100%;">
								<thead class="table-head-sticky">
								<tr>
									<th>S. No.</th>
									<th>Campaign Name</th>
									<th>Lead No.</th>
								</tr>	
								</thead>
								<tbody style="font-size:10px">`;
									var ci=1;
									for (let c = 0; c < campaignList.length; c++) {
										const camp = campaignList[c];
										html+=`<tr>
											<td class="border-0">${ci++}</td>
											<td class="border-0">${camp.value}</td>
											<td class="border-0">${camp.extra}</td>
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



function getCounselorSetCommitionPopup(){
	var html=`
	<div class="modal fade" id="counselorSetCommitionPopup" role="dialog" aria-labelledby="counselorSetCommitionPopupModalLabel" data-backdrop="static" aria-modal="true" >
    <div class="modal-dialog modal-xl" role="document" style="max-width: 500px;">
        <div class="modal-content">
			<div class="modal-header align-items-center py-2 bg-primary text-white">
				<h5 class="cal-title m-0">Set Commission</h5>
				<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
			</div>
            <div class="modal-body">
				<div class="tab-pane" id="setCounselorCommissionRate" role="tabpanel" style="">
					<div class="card-header card-header-tabe">
						<ul class="nav">
							<li class="nav-item"><a data-toggle="tab" id="addFormPopup" href="#addForm" class="nav-link active">Add Commission</a></li>
							<li class="nav-item"><a data-toggle="tab" id="filterByPopup" href="#filterBy" class="nav-link">Filter By</a></li>
						</ul>
					</div>
					<div class="tab-content p-4">
						<div class="tab-pane active p-1 bg-light-primary border border-primary rounded-10 card" id="addForm" role="tabpanel">
							<div class="col-12 mt-2 mb-2">
								<form id="saveCounselorCommissionRateForm" autocomplete="off" action="javascript:void(0);" class="custom-field-scope">
									<input type="hidden" name="assignTo" id="assignTo" value=""  class="form-control">
									<div class="row align-items-end">
										<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12 mb-2 pr-0">
											<small class="text-muted d-block mb-1">Commission By School</small>
											<div class="d-flex flex-nowrap" style="gap:6px">
												<div class="custom-field mb-0" style="flex:1 1 0; min-width:0;">
													<select name="byPartnerType" id="byPartnerType" class="form-control">
														<option value="P">Percentage</option>
														<option value="F">Amount in USD without $ sign</option>
													</select>
													<label for="byPartnerType" class="m-0 d-block mb-0">Type</label>
												</div>
												<div class="custom-field mb-0" style="flex:0 0 70px">
													<input type="text" name="byPartnerValue" id="byPartnerValue" value="" onkeyup="getNum(this,'','byPartnerType')" placeholder=" " class="form-control">
													<label for="byPartnerValue" class="m-0 d-block mb-0">Value</label>
												</div>
											</div>
										</div>
										<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12 mb-2 pr-0">
											<small class="text-muted d-block mb-1">Commission By Partner (Through IS)</small>
											<div class="d-flex flex-nowrap" style="gap:6px">
												<div class="custom-field mb-0" style="flex:1 1 0; min-width:0;">
													<select name="bySchoolType" id="bySchoolType" class="form-control">
														<option value="P">Percentage</option>
														<option value="F">Amount in USD without $ sign</option>
													</select>
													<label for="bySchoolType" class="m-0 d-block mb-0">Type</label>
												</div>
												<div class="custom-field mb-0" style="flex:0 0 70px">
													<input type="text" name="bySchoolValue" id="bySchoolValue" value="" onkeyup="getNum(this,'','byPartnerType')" placeholder=" " class="form-control">
													<label for="bySchoolValue" class="m-0 d-block mb-0">Value</label>
												</div>
											</div>
										</div>
										<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12 mb-2 pr-0">
											<small class="text-muted d-block mb-1">Commission By Partner (Direct Enrollment)</small>
											<div class="d-flex flex-nowrap" style="gap:6px">
												<div class="custom-field mb-0" style="flex:1 1 0; min-width:0;">
													<select name="bySchoolPartnerType" id="bySchoolPartnerType" class="form-control">
														<option value="P">Percentage</option>
														<option value="F">Amount in USD without $ sign</option>
													</select>
													<label for="bySchoolPartnerType" class="m-0 d-block mb-0">Type</label>
												</div>
												<div class="custom-field mb-0" style="flex:0 0 70px">
													<input type="text" name="bySchoolPartnerValue" id="bySchoolPartnerValue" value="" onkeyup="getNum(this,'','bySchoolPartnerValue')" placeholder=" " class="form-control">
													<label for="bySchoolPartnerValue" class="m-0 d-block mb-0">Value</label>
												</div>
											</div>
										</div>
										<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12 mb-2">
											<div class="custom-field mb-0">
												<select name="learningProgram" id="learningProgram" class="form-control" onchange="getGradesByLearningProgram('saveCounselorCommissionRateForm','learningProgram','standardId','counselorSetCommitionPopup')">
													<option value="A" selected>All Program</option>
													<option value="ONE_TO_ONE">One-to-One Learning</option>
													<option value="BATCH">Group Learning</option>
													<option value="SCHOLARSHIP">Self Study Learning</option>
													<option value="SSP">Self Study Plus</option>
													<option value="ONE_TO_ONE_FLEX">Flexy Learning Program</option>
												</select>
												<label for="learningProgram" class="m-0 d-block mb-0">Select Learning Program</label>
											</div>
										</div>
										<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12 mb-2">
											<div class="custom-field mb-0">
												<select name="standardId" id="standardId" class="form-control" multiple="multiple">
												</select>
												<label for="standardId" class="m-0 d-block mb-0">Select Grade</label>
											</div>
										</div>
										<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12 mb-2">
											<small class="text-muted d-block mb-1">Enrollment Min/Max Range</small>
											<div class="d-flex" style="gap:6px">
												<div class="custom-field mb-0" style="flex:1 1 0">
													<input type="text" class="form-control" id="enrollRangeMin" name="enrollRangeMin" placeholder=" " value="" onkeydown="return M.digit(event);" maxlength="5" />
													<label for="enrollRangeMin" class="m-0 d-block mb-0">Min</label>
												</div>
												<div class="custom-field mb-0" style="flex:1 1 0">
													<input type="text" class="form-control" id="enrollRangeMax" name="enrollRangeMax" placeholder=" " value="" onkeydown="return M.digit(event);" maxlength="5" />
													<label for="enrollRangeMax" class="m-0 d-block mb-0">Max</label>
												</div>
											</div>
										</div>
										<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12 mb-2">
											<div class="custom-field mb-0">
												<input type="text" name="startDate" id="startDate" class="datepicker form-control" placeholder=" " readonly>
												<label for="startDate" class="m-0 d-block mb-0">Applicable From</label>
											</div>
										</div>
										<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12 mb-2 text-left d-flex align-items-center" style="gap:6px">
											<a href="javascript:void(0)" onclick="saveCounselorCommissionRate('saveCounselorCommissionRateForm')" class="btn btn-success btn-lg">Add Commission</a>
											<a href="javascript:void(0)" onclick="resetCounselorCommissionRate('saveCounselorCommissionRateForm')" class="btn btn-primary btn-lg">Reset</a>
										</div>
									</div>
								</form>
							</div>
						</div>	
						<div class="tab-pane" id="filterBy" role="tabpanel">
						<form id="filterCounselorCommissionRate" autocomplete="off" action="javascript:void(0);" class="custom-field-scope">
						<input type="hidden" name="assignToFilter" id="assignToFilter" value=""  class="form-control">
							<div class="full p-1 bg-light-primary border border-primary rounded-10 card">
								<div class="col-12 mt-2 mb-2">
									<div class="row align-items-center">
										<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12 mb-2">
											<div class="custom-field mb-0">
												<select name="learningProgramFilter" id="learningProgramFilter" class="form-control" onchange="getGradesByLearningProgram('filterCounselorCommissionRate','learningProgramFilter','standardIdFilter','counselorSetCommitionPopup')">
													<option value="">Select Learning Program</option>
													<option value="A">All Program</option>
													<option value="ONE_TO_ONE">One-to-One Learning</option>
													<option value="BATCH">Group Learning</option>
													<option value="SCHOLARSHIP">Self Study Learning</option>
													<option value="SSP">Self Study Plus</option>
													<option value="ONE_TO_ONE_FLEX">Flexy Learning Program</option>
												</select>
												<label for="learningProgramFilter" class="m-0 d-block mb-0">Select Learning Program</label>
											</div>
										</div>
										<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12 mb-2">
											<div class="custom-field mb-0">
												<select name="standardIdFilter" id="standardIdFilter" class="form-control" multiple="multiple">
												</select>
												<label for="standardIdFilter" class="m-0 d-block mb-0">Select Grade</label>
											</div>
										</div>
										<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12 mb-2 text-left d-flex align-items-center" style="gap:6px">
											<a href="javascript:void(0)" onclick="resetCounselorFilterByForm('filterCounselorCommissionRate')" class="btn btn-primary">Reset</a>
											<a href="javascript:void(0)" onclick="getCounselorCommissionRateFilter('filterCounselorCommissionRate', false)" class="btn btn-success">Find</a>
										</div>
									</div>
								</div>
							</div>
							<div class="full text-right my-4">
								<a href="javascript:void(0)" class="btn btn-primary bulkEditBtn" onclick="bulkEdit()" style="display:none">Bulk Edit</a>
							</div>
							<div class="full table-responsive">
								<table class="table table-bordered font-12 border-radius-table text-center commissionTable" style="min-width:1380px;width:100%" id="commissionRateFilteredData">
									<thead class="bg-primary">
										<tr>
											<th class="text-white bold rounded-top-left-10 border-bottom-0 border-primary" style="border-top-color:transparent;border-right-color:#fff !important">S.No.</th>
											<th class="text-white bold border-bottom-0">Grade</th>
											<th class="text-white bold border-bottom-0 text-center">Learning Program</th>
											<th class="text-white bold border-bottom-0 text-center" style="width: 210px;">Commission By School</th>
											<th class="text-white bold border-bottom-0 text-center" style="width: 210px;">Commission By Partner<br/>(Through IS)</th>
											<th class="text-white bold border-bottom-0 text-center" style="width: 210px;">Commission By Partner<br/>(Direct enrollment)</th>
											<th class="text-white bold border-bottom-0 text-center">Enrollment Min/Max Range</th>
											<th class="text-white bold border-bottom-0 text-center">Applicable From</th>
											<th class="text-white bold border-bottom-0 text-center">Applicable Till</th>
											<th class="text-white bold border-bottom-0 rounded-top-right-10" style="border-top-color:transparent;border-right-color:transparent">Action</th>
										</tr>
									</thead>
									<tbody class="last-tr-fist-and-last-td-rounded"></tbody>
								</table>
								<div class="full text-right bulk-update-and-cancel-btn mb-4" style="display: none;">
									<a href="javascript:void(0)" class="text-decoration-none btn btn-primary mr-2" onclick="cancelEitAllRow()">Cancel</a>
									<a href="javascript:void(0)" class="text-decoration-none btn btn-success" onclick="updateCommissionRate('filterCounselorCommissionRate','')">Update</a>
								</div>
							</div>
						</form>
						</div>	
					</div>
				</div>
			</div>
        </div>
    </div>
</div>`;
return html;

}

function getCounselorCommissionRateLogs(){
	var html=`
		<div id="counselorCommissionRateLogs" class="modal right-slide-modal fade" tabindex="" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
		<div class="modal-dialog modal-xl">
			<div class="modal-content border-0">
				<div class="modal-header py-0 text-white card-header card-header-tabe">
					<h5 class="text-dark modal-title">Commission Rate Logs</h5>
					<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body overflow-auto">
					<div class="full table-responsive">
						<table class="table table-bordered font-12 table-striped border-radius-table" id="commissionRateLogsTable">
							<thead class="bg-primary">
								<tr>
								<th class="text-white bold rounded-top-left-10 border-bottom-0 border-primary" style="border-top-color:transparent;border-right-color:#fff !important">S.No.</th>
								<th class="text-white bold border-bottom-0">Grade</th>
								<th class="text-white bold border-bottom-0 text-center">Learning Program</th>
								<th class="text-white bold border-bottom-0 text-center" style="width: 270px;">Commission - Lead Provided By Partner</th>
								<th class="text-white bold border-bottom-0 text-center" style="width: 270px;">Commission - Lead Provided By Is</th>
								<th class="text-white bold border-bottom-0 text-center">Applicable From</th>
								<th class="text-white bold border-bottom-0 text-center">Applicable Till</th>
								<th class="text-white bold border-bottom-0 text-center">Update By</th>
								<th class="text-white bold border-bottom-0 rounded-top-right-10" style="border-top-color:transparent;border-right-color:transparent">Update At</th>
								</tr>
							<thead>
							<tbody class="last-tr-fist-and-last-td-rounded">
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	</div>`;
	return html;
}


function getSelectGrade(id, selectedValues){
	var selValues = selectedValues.replace("'","");
	var selectValue = selValues.split(',');
	$('#'+id).val(selectValue).trigger("change");
}
function getSelectCountries(id, selectedValues){
	var selValues = selectedValues.replace("'","");
	var selectValue = selValues.split(',');
	$('#'+id).val(selectValue).trigger("change");
}
function getSelectCampain(id, selectedValues){
	var selValues = selectedValues.replace("'","");
	var selectValue = selValues.split(',');
	$('#'+id).val(selectValue).trigger("change");
}

function getAvailability(userId){
	// $("#timeAvailabilityPopup").modal("show");
	getAsPost('/timeavailability/time-availability?moduleId=182&schoolId=' + SCHOOL_ID +'&euid='+userId);
	customLoader(false)
}

function todayLeadAssignDate(){
	var d = new Date();
	var day = d.getDate();
	var month = d.getMonth() + 1;
	var year = d.getFullYear();
	if (day < 10) {
		day = "0" + day;
	}
	if (month < 10) {
		month = "0" + month;
	}
	var date = month + "-" + day + "-" + year ;
	return date;
}


function editRow(src){
	$(src).parent().closest("tr").find(".edit-value").hide();
	$(src).parent().closest("tr").find(".edit-value-element").show();
}
function cancelEitRow(src){
	$(src).parent().closest("tr").find(".edit-value").show();
	$(src).parent().closest("tr").find(".edit-value-element").hide();
}
function bulkEdit(){
	$(".commissionTable").find(".edit-value").hide();
	$(".commissionTable").find(".edit-value-element").show();
	$(".bulk-update-and-cancel-btn").show();
	$(".commissionTable > thead > tr > th:last-child, .commissionTable > tbody > tr > td:last-child").hide();
	$(".commissionTable > thead > tr th:nth-last-child(2)").addClass("rounded-top-right-10");
	$(".commissionTable tbody tr:nth-last-child(1) td:nth-last-child(2)").addClass("rounded-bottom-right-10");
}
function cancelEitAllRow(){
	$(".commissionTable").find(".edit-value").show();
	$(".commissionTable").find(".edit-value-element").hide();
	$(".bulk-update-and-cancel-btn").hide();
	$(".commissionTable thead > tr th:last-child, .commissionTable tbody > tr td:last-child").show();
	$(".commissionTable thead > tr th:nth-last-child(2)").removeClass("rounded-top-right-10");
	$(".commissionTable tbody > tr:nth-last-child(1) td:nth-last-child(2)").removeClass("rounded-bottom-right-10");
}

function activeCounselor(chckValue, userId, orderBy) {
		if (chckValue=='N') {
			chckValue='Y';
		}else if (chckValue=='Y') {
			chckValue='N';
		}
		saveInactiveAssignCounselor(userId, chckValue, orderBy, 'LEAD', true);
	}
