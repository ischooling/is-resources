
var LEAD_CATEGORY="B2C";
var ROLE_MODULE="";
var OBJECT_RIGHTS="";
async function renderSchoolReportDashboard(title, roleAndModule, SCHOOL_ID, USER_ID,USER_ROLE, LEAD_CATEGORY){
	//var urlLead = "lead-list?moduleId=" +roleAndModule.moduleId + "&leadFrom=LEAD&clickFrom=list&startDate=&endDate=&country=0&campaign=&currentPage=0&euid=" +ENCRYPTED_USER_ID +"&leadType=" +LEAD_CATEGORY
  	var objRight= await getLeadReportData(roleAndModule.moduleId, USER_ID);
	var objectRights=objRight.objectRights;
	OBJECT_RIGHTS=objectRights;
	var html=getLeadReportMasterContent(title, objectRights);
    $('#dashboardContentInHTML').html(html);



}

function getLeadReportMasterContent(title, objectRights){
	
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
	html+=getMainReportCard(objectRights);
	return html;
}

function getMainReportCard(objRight){
	var html='';
		html+='<div class="main-card mb-3 card">';
			html+='<div class="card-body">';
			html+=getReportsTab(objRight);
			html+='</div>';
		html+='</div>';
		
	return html;
}

function getReportsTab(objRight){
	var html='';
	html+='<form action="javascript:void(0);" id="schoolDataReportForm" name="schoolDataReportForm" autocomplete="off" >'
		+'<div  class="text-center" id="ErrorMsg"><span class="text-warning" style="font-weight:bold;color:red;" id="errMsg"></span> </div>'
		+'<ul class="body-tabs body-tabs-layout tabs-animated body-tabs-animated nav">';
		if(objRight.permissioncolumn=='Y'){
			html+='<li class="nav-item">'
				+'<a role="tab" class="nav-link active" id="tab-1" data-toggle="tab" href="#tab-content-1">'
					+'<span>Lead Report</span>'
				+'</a>'
			+'</li>'
			+'<li class="nav-item">'
				+'<a role="tab" class="nav-link" id="tab-2" data-toggle="tab" href="#tab-content-2">'
					+'<span>Lead chart</span>'
				+'</a>'
			+'</li>';
		}else{
			html+='<li class="nav-item">'
				+'<a role="tab" class="nav-link active" id="tab-2" data-toggle="tab" href="#tab-content-2">'
					+'<span>Lead chart</span>'
				+'</a>'
			+'</li>';
		}
			html+=`<li class="nav-item">
				<a role="tab" class="nav-link" id="tab-3" data-toggle="tab" href="#tab-content-3">
					<span>Time wise Country</span>
				</a>
			</li>
			<li class="nav-item">
				<a role="tab" class="nav-link" id="tab-5" data-toggle="tab" href="#tab-content-5">
					<span>Enrolled List</span>
				</a>
			</li>
			<li class="nav-item">
				<a role="tab" class="nav-link" id="tab-6" data-toggle="tab" href="#tab-content-6">
					<span>School Demo List</span>
				</a>
			</li>`;
			if(objRight.permissioncolumn=='Y'){
				html+=`<li class="nav-item">
					<a role="tab" class="nav-link" id="tab-7" data-toggle="tab" href="#tab-content-7">
						<span>School Enrollment List Day wise</span>
					</a>
				</li>`;
			}
			html+=`<li class="nav-item">
				<a role="tab" class="nav-link" id="tab-8" data-toggle="tab" href="#tab-content-8">
					<span>Lead Detail By Campaign</span>
				</a>
			</li>
		</ul>
		<div class="tab-content p-3 border">`;
		if(objRight.permissioncolumn=='Y'){
			html+='<div class="tab-pane tabs-animation fade show active" id="tab-content-1" role="tabpanel">'
				+'<div class="tabs-animation">';
					html+=getLeadCounselorReportData(objRight);
				html+=`</div>
			</div>
			<div class="tab-pane tabs-animation fade show " id="tab-content-2" role="tabpanel">
				<div class="tabs-animation">`;
				html+=getLeadReportChart(objRight)
				html+=`</div>
			</div>`;
		}else{
			html+=`<div class="tab-pane tabs-animation fade show active" id="tab-content-2" role="tabpanel">
					<div class="tabs-animation">`;
						html+=getLeadReportChart(objRight)
					html+=`</div>
				</div>`;
		}
		html+=`<div class="tab-pane tabs-animation fade show " id="tab-content-3" role="tabpanel">
				<div class="tabs-animation">`
					html+=getLeadCountryTime(objRight);
				html+=`</div>
			</div>
			<div class="tab-pane tabs-animation fade show ${USER_ROLE == 'LEAD_AND_DEMO'?'active':''}" id="tab-content-5" role="tabpanel">
				<div class="tabs-animation">`
					html+=getLeadEnrollmentList(objRight);
				html+=`</div>
			</div>
			<div class="tab-pane tabs-animation fade show " id="tab-content-6" role="tabpanel">
				<div class="tabs-animation">`
					html+=getLeadSchoolDemoList(objRight);
				html+=`</div>
			</div>`;
			if(objRight.permissioncolumn=='Y'){
				html+=`<div class="tab-pane tabs-animation fade show " id="tab-content-7" role="tabpanel">
						<div class="tabs-animation">`
							html+=getLeadEnrollmentYearWise(objRight);
						html+=`</div>
					</div>	`;
			}
			html+=`<div class="tab-pane tabs-animation fade show " id="tab-content-8" role="tabpanel">
				<div class="tabs-animation">`
					html+=getLeadCampaignPriceList(objRight);
				html+=`</div>
			</div>
		</div>
		</form>	`;
		return html;
	}

	function counselorReportPopup(){
		var html='';
		html+=`<div id="counselorReport" class="modal fade bd-example-modal-lg fade-scale" tabindex="" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true" style="top:40px">
		<div class="modal-dialog modal-xl">
		<div class="modal-content" id="counselorRptcontent">
			
		</div>
		</div>
		</div>`;
		return html;
	}

	function getLeadCounselorReportData(objRight){
		var html='';
		html+=`<div class="row" style="align-items: center;">
			<div class="col-md-12 col-lg-2">
				<select class="form-control mr-1" id="searchLeadCounselorReportType" name="searchLeadCounselorReportType">
					<option value="Counselor" ${objRight.searchtype == 'Counselor'?'selected':''}>COUNSELOR</option>
					<option value="Country" ${objRight.searchtype == 'Country'?'selected':''}>COUNTRY</option>
					<option value="Campaign" ${objRight.searchtype == 'CAMPAIGN'?'selected':''}>CAMPAIGN</option>
					<option value="LOGS" ${objRight.searchtype == 'LOGS'?'selected':''}>LOGS</option>
				</select>
			</div>
			<div class="col-md-12 col-lg-2">
				<select class="form-control mr-1" id="searchLeadCounselorType" name="searchLeadCounselorType">
					<option value="DAY" ${objRight.searchtype == 'DAY'?'selected':''}>Today</option>
					<option value="WEEK" ${objRight.searchtype == 'WEEK'?'selected':''}>Week</option>
					<option value="MONTH" ${objRight.searchtype == 'MONTH'?'selected':''}>Month</option>
					<option value="CUSTOM" ${objRight.searchtype == 'CUSTOM'?'selected':''}>Custom</option>
				</select>
			</div>
			<div class="col-md-6 col-lg-3 hidden" id="zadarmaCallSync"> 
				<input type="text" name="syncZadarmaDate" id="syncZadarmaDate" class="hidden" style="width:90px; margin-right: 12px;" readonly onkeydown="return false" />
				<button class=" btn btn-info " onclick="syncZadarmaCall()"><i class="fas fa-sync " id="callSyncRotate"></i></button>
			</div>
			<div class="col-md-6 col-lg-5"> 
				<div class="row" style="align-items: center;">
					<div class="col-md-12 col-lg-6 hidecounselorLead text-center">
						<input type="text" name="counselorStartDate" id="counselorStartDate" style="width:90px; margin-right: 6px;" readonly onkeydown="return false" /> To 
						<input type="text" name="counselorEndDate" id="counselorEndDate" style="width:90px; margin-left: 6px;" readonly onkeydown="return false"  />
					</div>
					<div class="col-md-12 col-lg-6 hidecounselorLead">
						<button class="btn btn-primary" id="btnLeadCounselorWiseSubmit">Submit</button>
					</div> 
				</div>         
			</div>
			<div class="col-md-6 col-lg-3" id="advanceSearchAndExport12"> 
				<button class=" btn btn-info" onclick="openModal('leadReport')"><i class="fa fa-search"></i>&nbsp;Advance Search</button>`;
				if(USER_ROLE == "DIRECTOR"){
					html+=`<button class=" btn btn-success text-white mt-lg-1 btn-full-mobile mb-1" id="exportCounselorLead">Excel Export</button> `
				}
			html+`</div>
			
		</div>
	<hr/>
	<div class="row">
		<div class="col-lg-12 col-md-12">
			<table class="table table-bordered table-striped" id="counselor-list" style="font-size:11px !important" >
				<thead id="listCounselorTfoot"></thead>
				<thead id="listCounselorTheader">
					<tr>
						<th style="5% !important" class="text-center bg-primary text-white">Sr no.</th>
						<th class="text-center bg-primary text-white"><span class="changeHeadText">Academic Counselor</span> Name</th>
						<th class="bg-primary text-white"><span class="text-left">Total Leads</span>   <span class="float-right"> U | D</span> </th>
						<th class="bg-primary text-white"><span class="text-left">Total</span>   <span class="float-right">FB | IG</span></th>
						<th class="text-center bg-primary text-white">Unattended</th>
						<th class="text-center bg-primary text-white">
							<table class="w-100 table mb-0 bg-transparent">
								<tbody>
									<tr>
										<td class="font-10 px-1" style="width:9%;border:0;border-right: 1px solid;border-radius:0 ">Demo Book</br/>Schedule</td>
										<td class="font-10 px-1" style="width:9%;border:0;border-right: 1px solid;border-radius:0 ">Web</td>
										<td class="font-10 px-1" style="width:9%;border:0;border-right: 1px solid;border-radius:0 ">Link</td>
										<td class="font-10 px-1" style="width:9%;border:0;border-right: 1px solid;border-radius:0;">Completed</td>
										<td class="font-10 px-1" style="width:9%;border:0;border-right: 1px solid;border-radius:0;">Confirmed</td>
										<td class="font-10 px-1" style="width:9%;border:0;border-right: 1px solid;border-radius:0;">Not Confirmed</td>
										<td class="font-10 px-1" style="width:9%;border:0;border-right: 1px solid;border-radius:0;">Reschedule</td>
										<td class="font-10 px-1" style="width:9%;border:0;border-right: 1px solid;border-radius:0;">No-Show</td>
										<td class="font-10 px-1" style="width:9%;border:0;border-right: 1px solid;border-radius:0;">Cancelled</td>
										<td class="font-10 px-1" style="width:9%;border:0;border-right: 1px solid;border-radius:0;">Not Interested</td>
										<td class="font-10 px-1" style="width:9%;border:0;border-radius:0;">No Status</td>
									</tr>
								</tbody>
							</table>
						</th>
						<th class="text-center bg-primary text-white">Hot | Warm | Cold</th>
						<th class="text-center bg-primary text-white">Positive Enrollment</th>
						<th class="text-center bg-primary text-white">Reserved</th>
						<th class="text-center bg-primary text-white">Converted</th>
					</tr>
				</thead>
				<thead id="listCounselorTheader_log" class="hidden" >
					<tr>
						<th style="5% !important" class="text-center bg-primary text-white">Sr no.</th>
						<th class="text-center bg-primary text-white"><span class="changeHeadText">Academic Counselor</span> Name</th>
						<th class="text-center bg-primary text-white">Call</th>
						<th class="text-center bg-primary text-white">Wati</th>
						<th class="text-center bg-primary text-white">Whatsapp</th>
						<th class="text-center bg-primary text-white">Mail</th>
					</tr>
				</thead>
				<tbody id="listCounselorTbody"></tbody>
			</table>
		</div>
	</div>`;
	return html;
}

function getLeadReportSearchPopup(objRights){
	var html='';
	html+=`<div id="leadReportSearch" class="modal fade bd-example-modal-lg fade-scale" tabindex="" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
	<input type="hidden" id="callFrom"/>
    <div class="modal-dialog modal-xl">
        <div class="modal-content border-0">
            <div class="modal-header py-2 bg-primary text-white">
                <h5 class="modal-title" >Advance Search</h5>
                <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form action="javascript:void(0);" id="reportLeadSearchForm" name="reportLeadSearchForm" autocomplete='off'>
				<input type="hidden" name="userId" id="userId" value="${USER_ID}">
					<div class="row">
						<div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 mb-1 mt-1">
							<div class="leadErrorText"></div>
						</div>
					</div>
					
					<div class="row">
						<div class="col-xl-3 col-lg-3 col-md-4 col-sm-4 col-12 mb-1 mt-1 acadmicYearDiv">
							<label class="m-0">Academic Year</label>
							<select	name="acadmicYear" id="acadmicYear" class="form-control" >
							<option value="all">All</option>
							</select>
						</div>
						<div class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 mb-1 mt-1 enrollType">
							<label class="m-0">Enrollment Type</label>
							<select	name="enrollmentSearch" id="enrollmentSearch" class="form-control">
								<option value="" >Select</option>
								<option value="fresh" >Fresh</option>
								<option value="reEnroll" >Re-Enroll</option>
							</select>
						</div>
						<div class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 mb-1 mt-1 leadSource">
							<label class="m-0">Lead Source</label>
							<select	name="sourceSearch" id="sourceSearch" class="form-control" multiple ></select>
						</div>
						<div class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 mb-1 mt-1 leadStatus">
							<label class="m-0">Lead Status</label>
							<select name="statusSearch" id="statusSearch" class="form-control" multiple ></select>
						</div>
						
						<div class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 mb-1 mt-1 leadAssign">
							<label class="m-0">Lead Assign To</label>
							 <select name="assignToSearch" id="assignToSearch" class="form-control" multiple></select>
						</div>
						<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-1 mt-1 grade">
							<label class="m-0">Grade</label>
							<select name="gradeSearch" id="gradeSearch" class="form-control" >
							<option value="0">Select Grade</option>`;
							html+=getStandardContent(objRights.schoolId,true, false)
							html+=`</select>
						</div>
						<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-1 mt-1 country">
							<label class="m-0">Country</label>
							<select name="countryId" id="countryId" class="form-control" >
								<option value="0">Select country</option>
								<option value="-1">N/A</option>
							</select>
						</div>
                		<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-1 mt-1 demoAssign">
							<label class="m-0">Demo Assign</label>
							<select	name="leadDemoAssign" id="leadDemoAssign" class="form-control" >
								<option value="0">Select Assign</option>
							</select>
                		</div>
						<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-1 mt-1">
							<label class="m-0">Select Campaign</label>
							<select  name="searchReportCampaign" id="searchReportCampaign" class="form-control searchReportCampaign" multiple ></select>
						</div>
					</div>
				</form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-danger  float-right pr-4 pl-4 ml-2" onclick="reportLeadSearchReset('leadReportSearch')">Reset</button>
				<button type="button" class="btn btn-info  float-right pr-4 pl-4 ml-2" data-dismiss="modal">Close</button>
				<button type="button" class="btn btn-success  float-right pr-4 pl-4" id="btnClickLeadReportSearch" onclick="submitFunction()">Search</button>
            </div>
        </div>
    </div>
</div>`;
return html;
}

function getLeadReportChart(objRights){
	var html='';
	html+=`<div class="row">
		<div class="col-md-12 col-lg-12">
			<div class="d-flex align-items-center flex-wrap justify-content-end" style="gap:0.5rem">
				<select class="form-control form-control-sm mr-1" id="searchtypeTotalLead" name="searchtypeTotalLead" style="width:fit-content">
					<option value="DAY" ${objRights.searchtype == 'DAY'?'selected':''}>Today</option>
					<option value="WEEK" ${objRights.searchtype == 'WEEK'?'selected':''}>Week</option>
					<option value="MONTH" ${objRights.searchtype == 'MONTH'?'selected':''}>Month</option>
					<option value="CUSTOM" ${objRights.searchtype == 'CUSTOM'?'selected':''}>Custom</option>
				</select>
				<div class="hideChartdate">
					<div class="d-flex align-items-center flex-wrap" style="gap:0.5rem">
						<div class="d-inline-flex align-items-center flex-wrap" style="gap:0.5rem">
							<input type="text" name="dataChartStartDate" class="form-control form-control-sm" id="dataChartStartDate" placeholder="Start Date" style="width:100px" readonly onkeydown="return false" />
							<div class="mx-1">To</div>
							<input type="text" name="dataChartEndDate" class="form-control form-control-sm" id="dataChartEndDate" placeholder="End Date" style="width:100px" readonly onkeydown="return false" />
						</div>
						<button class="btn btn-primary" id="btnChartWiseSubmit">Submit</button>
					</div>
				</div>
			</div>
		</div>
	</div>
	<hr/>
	<div class="row">
		<div class="col-lg-6 col-md-12">
		<div class="main-card mb-3 card">
			<div class="card-body">
			<h5 class="card-title">Day Wise</h5>
				<div id="chart-pie-days"></div>
			</div>  
		</div>   
		</div>
		<div class="col-lg-6 col-md-12">
			<div class="main-card mb-3 card">
			<div class="card-body">
				<h5 class="card-title">Lead Source</h5>
				<div id="chart-lead-source"></div>
			</div>   
			</div>   
		</div>
	</div>`;
	return html;
}

function getLeadCountryTime(objRights){
	var html='';
	html+=`<div class="row">
    <div class="col-md-12 col-lg-12">
        <div class="d-flex align-items-center flex-wrap justify-content-end" style="gap:0.5rem">
            <select class="form-control form-control-sm mr-1" id="searchtype" name="searchtype" style="width:fit-content">
                <option value="DAY" ${objRights.searchtype == 'DAY'?'selected':''}>Today</option>
                <option value="WEEK" ${objRights.searchtype == 'WEEK'?'selected':''}>Week</option>
                <option value="MONTH" ${objRights.searchtype == 'MONTH'?'selected':''}>Month</option>
                <option value="CUSTOM" ${objRights.searchtype == 'CUSTOM'?'selected':''}>Custom</option>
            </select>
            <div class="hidetimeCountrydate">
                <div class="d-flex align-items-center flex-wrap" style="gap:0.5rem">
                    <div class="d-inline-flex align-items-center flex-wrap" style="gap:0.5rem">
                        <input type="text" name="dataStartDate" id="dataStartDate" class="form-control form-control-sm" placeholder="Start Date" style="width:100px" readonly onkeydown="return false" />
                        <div class="mx-1">To</div> 
                        <input type="text" name="dataEndDate" id="dataEndDate" class="form-control form-control-sm" placeholder="End Date" style="width:100px" readonly onkeydown="return false" />
                    </div>
                    <button class="btn btn-primary" id="btnTimeCountrySubmit">Submit</button>
                </div>
            </div>
        </div>
    </div>
</div>
<hr/>
<div class="row">
    <div class="col-md-12 col-lg-12">
		<table class="table table-bordered table-striped" style="font-size:12px" >
           <thead>
                <tr>
                    <th style="width:15%">Time (Total Leads)</th>
                    <th class="">Countries (Total Leads)</th>
                </tr>
            </thead>
            <tbody id="timescountry"></tbody>
        </table>
    </div>
</div>`;
return html;
}
function getLeadEnrollmentList(objRights){
	var html='';
	html+=`<div class="row">
    <div class="col-md-12 col-lg-12">
        <div class="d-flex align-items-center flex-wrap justify-content-end" style="gap:0.5rem">
            <select class="form-control form-control-sm mr-1" id="searchStudenttype" name="searchStudenttype" style="width:fit-content">
                <option value="DAY" ${objRights.searchtype == 'DAY'?'selected':''}>Today</option>
                <option value="WEEK" ${objRights.searchtype == 'WEEK'?'selected':''}>Week</option>
                <option value="MONTH" ${objRights.searchtype == 'MONTH'?'selected':''}>Month</option>
                <option value="CUSTOM" ${objRights.searchtype == 'CUSTOM'?'selected':''}>Custom</option>
            </select>
            <div class="hidestudentdate">
                <div class="d-flex align-items-center flex-wrap" style="gap:0.5rem">
                    <div class="d-inline-flex align-items-center flex-wrap" style="gap:0.5rem">
                        <input type="text" name="dataStudentStartDate" class="form-control form-control-sm" id="dataStudentStartDate" placeholder="Start Date" style="width:100px" readonly onkeydown="return false" /> 
                        <div class="mx-1">To</div> 
                        <input type="text" name="dataStudentEndDate" class="form-control form-control-sm mr-1" id="dataStudentEndDate" placeholder="End Date" style="width:100px" readonly onkeydown="return false" />
                    </div>
                    <button class="btn btn-primary" id="btnStudentWiseSubmit">Submit</button>
                </div>
            </div>
            <button class=" btn btn-info" onclick="openModal('enrollmentList')"><i class="fa fa-search"></i>&nbsp;Advance Search</button>
        </div>
    </div>
</div>
<hr/>
<div class="row">
    <div class="col-lg-12 col-md-12">
        <table class="table table-bordered table-striped" id="enrolled-student" style="font-size:12px" >
           <thead>
                <tr>
                    <th class="">Sr no.</th>
                    <th>Student Name<br/>Grade Name</th>
                    <th>Email<br/>Country</th>
                    <th>Parent Name</th>
                    <th>Enrollment Type<br/>Learning Mode</th>
                    <th>Enrollment Date</th>
                    <th>Assign Name</th>
                    <th>System Training Date</th>
                    <th>System Training Status</th>
                </tr>
            </thead>
            <tbody id="enrollLeads"></tbody>
        </table>
    </div>
</div>`;
return html;
}

function getLeadSchoolDemoList(objRights){
	var html='';
	html+=`<div class="row">
    <div class="col-md-12 col-lg-12">
        <div class="d-flex align-items-center flex-wrap justify-content-end" style="gap:0.5rem">
            <select class="form-control form-control-sm mr-1" id="searchSchoolDemoType" name="searchSchoolDemoType" style="width:fit-content">
                <option value="DAY" ${objRights.searchtype == 'DAY'?'selected':''}>Today</option>
                <option value="WEEK" ${objRights.searchtype == 'WEEK'?'selected':''}>Week</option>
                <option value="MONTH" ${objRights.searchtype == 'MONTH'?'selected':''}>Month</option>
                <option value="CUSTOM" ${objRights.searchtype == 'CUSTOM'?'selected':''}>Custom</option>
            </select>
            <div class="hideschooldemo">
                <div class="d-flex align-items-center flex-wrap" style="gap:0.5rem">
                    <div class="d-inline-flex align-items-center flex-wrap" style="gap:0.5rem">
                        <input type="text" name="dataSchoolDemoStartDate" class="form-control form-control-sm" id="dataSchoolDemoStartDate" placeholder="Start Date" style="width:100px" readonly onkeydown="return false" />
                        <div class="mx-1">To</div>
                        <input type="text" name="dataSchoolDemoEndDate" class="form-control form-control-sm" id="dataSchoolDemoEndDate" placeholder="End Date" style="width:100px" readonly onkeydown="return false" />
                    </div>
                    <button class="btn btn-primary" id="btnSchoolDemoWiseSubmit">Submit</button>
                </div>
            </div>
        </div>
    </div>
</div>
<hr/>
<div class="row">
    <div class="col-lg-12 col-md-12">
        <table class="table table-bordered table-striped" id="school-demo-list" style="font-size:12px" >
           <thead>
                <tr>
                    <th style="width:5%" class="text-center bg-primary text-white">Sr no.</th>
                    <th style="width:15%" class="text-center bg-primary text-white">Meeting Date & Time(+05:30)<br/>Meeting From</th>
                    <th style="width:15%" class="text-center bg-primary text-white">Name<br/>Host | Attendee</th>`;
                    if(objRights.permissioncolumn == 'Y'){
						html+='<th style="width:30%" class="text-center bg-primary text-white">Join Time(+05:30)<br/>Host | Attendee</th>';
					}
                        
                   html+=`<th style="width:5%" class="text-center bg-primary text-white">Meeting Status</th>
                    <th style="width:30%" class="text-center bg-primary text-white">Meeting Remarks</th>
                </tr>
            </thead>
            <tbody id="schoolDemoListTbody"></tbody>
        </table>
    </div>
</div>`;
return html;
}

function getLeadEnrollmentYearWise(objRights){
	// <option value="ReEnrollment" ${searchtype eq 'ReEnrollment'?'selected':''}>Re-Enrollment</option>
    // <option value="Campaign" ${searchtype eq 'CAMPAIGN'?'selected':''}>CAMPAIGN</option>
	var html='';
	html+=`<div class="row">
        <div class="col-md-12 col-lg-2">
            <select class="form-control mr-1" id="searchDaywiseReportType" name="searchDaywiseReportType">
                <option value="Enrollment" ${objRights.searchtype == 'Enrollment'?'selected':''}>Fresh Enrollment</option>
                <option value="Leads" ${objRights.searchtype == 'Leads'?'selected':''}>Leads</option>
            </select>
        </div>
        <div class="col-md-12 col-lg-2">
            <select class="form-control mr-1" id="searchDaywise" name="searchDaywise">
                <option value="DAY" ${objRights.searchtype == 'DAY'?'selected':''}>Today</option>
                <option value="WEEK" ${objRights.searchtype == 'WEEK'?'selected':''}>Week</option>
                <option value="MONTH" ${objRights.searchtype == 'MONTH'?'selected':''}>Month Wise</option>
                <option value="CUSTOM" ${objRights.searchtype == 'CUSTOM'?'selected':''}>Custom</option>
            </select>
        </div>
        <div class="col-md-6 col-lg-5"> 
            <div class="row">
                <div class="col-md-12 col-lg-6 hidedaywise text-center">
                    <input type="text" name="daywiseStartDate" id="daywiseStartDate" style="width:90px" readonly /> To 
                    <input type="text" name="daywiseEndDate" id="daywiseEndDate" style="width:90px" readonly />
                </div>
                <div class="col-md-12 col-lg-6 hidedaywise">
                    <button class="btn btn-primary" id="btnDayWiseSubmit">Submit</button>
                </div> 
            </div>         
        </div>
    </div>
<hr/>
<div class="col-sm-12 col-md-12 col-lg-12 px-0">
    <div class="mb-3 card">
        <div class="pt-0 px-0 card-body">
            <div id="chart-enroll-yearwise"></div>
        </div>
    </div>	
</div>`;
return html;
}

function getLeadCampaignPriceList(objRights){
	var utmCampaignList = JSON.parse(objRights.utmCampaignList);	
	var html='';
	html+=`<div class="row">
        <div class="col-md-12 col-lg-12">
            <div class="d-flex align-items-center flex-wrap justify-content-end" style="gap:0.5rem">
                <div class="col-xl-4 col-lg-6 col-md-12 p-0">
                    <select class="form-control  mr-1 searchCampaignType" id="searchCampaignType" name="searchCampaignType" multiple="multiple">`
					for (let u = 0; u < utmCampaignList.length; u++) {
						const elementCamp = utmCampaignList[u];
						html+=` <option value="${elementCamp.key}" data-campaign-name="${elementCamp.value}">${elementCamp.value} (${elementCamp.extra})</option>`;
					}
                   html+=` </select>
                </div>
                <div class="d-inline-flex align-items-center flex-wrap" style="gap:0.5rem">
                    <select class="form-control  mr-1" id="searchLeadCampaignType" name="searchLeadCampaignType" style="width:fit-content">
                        <option value="DAY" ${objRights.searchtype == 'DAY'?'selected':''}>Today</option>
                        <option value="WEEK" ${objRights.searchtype == 'WEEK'?'selected':''}>Week</option>
                        <option value="MONTH" ${objRights.searchtype == 'MONTH'?'selected':''}>Month</option>
                        <option value="CUSTOM" ${objRights.searchtype == 'CUSTOM'?'selected':''}>Custom</option>
                    </select>
                    <div class="hidecampaignLead">
                        <div class="d-flex align-items-center flex-wrap" style="gap:0.5rem">
                            <div class="d-inline-flex align-items-center flex-wrap" style="gap:0.5rem">
                                <input type="text" name="dataLeadCampaignStartDate" class="form-control" placeholder="Start Date" id="dataLeadCampaignStartDate" style="width:100px" readonly onkeydown="return false" />
                                <div class="mx-1">To</div>
                                <input type="text" name="dataLeadCampaignEndDate" class="form-control" placeholder="End Date" id="dataLeadCampaignEndDate" style="width:100px" readonly onkeydown="return false" />
                            </div>
                            <button class="btn btn-primary" id="btnLeadCampaignWiseSubmit">Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-12 col-lg-3">
            
        </div>
    </div>
    <hr/>
<div class="row">
    <div class="col-lg-12 col-md-12 ">
    <div id="accordion" class="accordion-wrapper">
        <table class="table table-bordered table-striped" id="lead-campaign-list" style="font-size:11px !important;" >
         <thead id="listCampaignTfoot"></thead>
           <thead>
                <tr>
                    <th class="text-center bg-primary text-white" style="max-width:70px;min-width:70px">Sr no.</th>
                    <th class="text-center bg-primary text-white">Campaign Name</th>
                    <th class="text-center bg-primary text-white">ACTIVE + IN-ACTIVE = Total Lead | FB API</th>
                    <th class="text-center bg-primary text-white">Amount Spent<br/>Cost per Lead SMS | Cost per Lead FB</th>
                    <th class="text-center bg-primary text-white" style="max-width:590px !important;width:590px">Counselor Name<br/>Lead | Active | In-active</th>
                </tr>
            </thead>
            <tbody id="leadCampaignListTbody">
                <tr>
                    <td colspan="9" class="text-center">
                        <div class="loader-wrapper d-flex justify-content-center align-items-center w-100"><div class="loader">Loading...'
                        <div class="line-scale"><div></div><div></div><div></div><div></div><div></div></div></div> </div>
                    </td>
                </tr>
            </tbody>
        </table>
        </div>
    </div>
</div>`;
return html;
}




