
var LEAD_CATEGORY="B2C";
async function renderLeadSettingDashboard(title, roleAndModule, SCHOOL_ID, USER_ID,USER_ROLE, LEAD_CATEGORY){
	//var urlLead = "lead-list?moduleId=" +roleAndModule.moduleId + "&leadFrom=LEAD&clickFrom=list&startDate=&endDate=&country=0&campaign=&currentPage=0&euid=" +ENCRYPTED_USER_ID +"&leadType=" +LEAD_CATEGORY
  	var objRight= await getLeadReportData(roleAndModule.moduleId, USER_ID, 'settings');
	var objectRights=objRight.objectRights;
	OBJECT_RIGHTS=objectRights;
	var html=getLeadSettingsMasterContent(title, objectRights);
    $('#dashboardContentInHTML').html(html);
	
	getCountryRightTimeList(objectRights);
	if (window.CRMNotify && typeof window.CRMNotify.initSettingsPanel === 'function') {
		window.CRMNotify.initSettingsPanel({
			userId: USER_ID,
			usersApiUrl: '/api/crm/notification-settings/users'
		});
	}
	

}

function getLeadSettingsMasterContent(title, objectRights){
	
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
		html+=getMainSettingCard(objectRights);
		//html+=counselorReportPopup();
		//html+=getLeadReportSearchPopup(objectRights);
		return html;
}

function getMainSettingCard(objRight){
	var html='';
		html+='<div class="main-card mb-3 card">';
			html+='<div class="card-body">';
			html+=getSettingTab(objRight);
			html+='</div>';
		html+='</div>';
		html+=getDiscardCountryRightTimeModel();
		
	return html;
}

function getSettingTab(objRight){
	var html='';
	html+='<form action="javascript:void(0);" id="schoolDataReportForm" name="schoolDataReportForm" autocomplete="off" >'
		+'<div  class="text-center" id="ErrorMsg"><span class="text-warning" style="font-weight:bold;color:red;" id="errMsg"></span> </div>'
		+'<ul class="body-tabs body-tabs-layout tabs-animated body-tabs-animated nav">';
			html+=`<li class="nav-item">
				<a role="tab" class="nav-link active" id="tab-1" data-toggle="tab" href="#tab-content-1">
					<span>Right Time to Call</span>
				</a>
			</li><li class="nav-item">
				<a role="tab" class="nav-link" id="tab-2" data-toggle="tab" href="#tab-content-2">
					<span>Lead Category</span>
				</a>
			</li><li class="nav-item">
				<a role="tab" class="nav-link" id="tab-3" data-toggle="tab" href="#tab-content-3">
					<span>Notification Control</span>
				</a>
			</li><li class="nav-item">
				<a role="tab" class="nav-link" id="tab-4" data-toggle="tab" href="#tab-content-4" onclick="getAICallScheduleList()">
					<span>AI Call Settings</span>
				</a>
			</li>
		</ul>
		<div class="tab-content p-3 border">`;
			html+=`<div class="tab-pane tabs-animation fade show active" id="tab-content-1" role="tabpanel">
					<div class="tabs-animation">`;
						html+=getCountrySetTime(objRight)
					html+=`</div></div>
				<div class="tab-pane tabs-animation fade" id="tab-content-2" role="tabpanel">
					<div class="tabs-animation">`;
						html+=getLeadCategoryPriority(objRight)
					html+=`</div></div>
				<div class="tab-pane tabs-animation fade" id="tab-content-3" role="tabpanel">
					<div class="tabs-animation">`;
						html+=getNotificationControlContent()
					html+=`</div></div>
				<div class="tab-pane tabs-animation fade" id="tab-content-4" role="tabpanel">
					<div class="tabs-animation">
						<div class="row mb-2">
							<div class="col-12 text-right">
								<button type="button" class="btn btn-primary btn-sm" onclick="addAICallTimezoneRow()">
									<i class="fa fa-plus"></i> Add Country
								</button>
							</div>
						</div>
						<div id="ai-call-schedule-list">
							<div class="text-center text-muted py-3">Loading...</div>
						</div>
					</div>
				</div>
		</div>
		</form>	`;
		return html;
	}

	function getCountrySetTime(objRight){
		var html='';
		html+=`<div class="row">
		<div class="col-lg-6 col-md-12 p-0">
			<table class="table table-bordered table-striped" id="country-time-list" style="font-size:11px !important" >
				<thead>
					<tr>
						<th class="text-center bg-primary text-white">Sr no.</th>
						<th class="text-center bg-primary text-white" >Country Name</th>
						<th class="bg-primary text-white">Time </th>
						<th class="bg-primary text-white"> </th>
					</tr>
				</thead>
				<tbody id="countryRightCallList"></tbody>
			</table>
		</div>
		<div class="col-lg-6 col-md-12 p-0"></div>
	</div>`;
	return html;
}

function getLeadCategoryPriority(objRight){
	var priorityList = objRight.priorityList;
	
		var html='';
		html+=`<div class="row">
		<div class="col-lg-6 col-md-12 p-0">
			<table class="table table-bordered table-striped" id="country-time-list" style="font-size:11px !important" >
				<thead>
					<tr>
						<th class="text-center bg-primary text-white">Sr no.</th>
						<th class="text-center bg-primary text-white" >Priority Name</th>
						<th class="bg-primary text-white">Min Range </th>
						<th class="bg-primary text-white">Max Range</th>
						<th class="bg-primary text-white">Unit</th>
						<th class="bg-primary text-white"></th>
					</tr>
				</thead>
				<tbody id="priority-list">`;
					if(priorityList!=null && priorityList.length>0){
						var i=1;
						for (let k = 0; k < priorityList.length; k++) {
							const priority = priorityList[k];
							html+=`<tr>
									<td>${i++}</td>
									<td>${priority.priority}</td>
									<td><input type="text" class="form-control form-control-sm" name="minRange" id="minRange_${priority.priorityId}"  value="${priority.minRange}"/></td>
									<td><input type="text" class="form-control form-control-sm" name="maxRange" id="maxRange_${priority.priorityId}" value="${priority.maxRange}"/></td>
									<td>
										<select class="form-control form-control-sm" name="leadCateUnit" id="leadCateUnit_${priority.priorityId}">
											<option value="per" ${priority.rangeUnit=='per'?'selected':''}>%</option>
											<option value="price" ${priority.rangeUnit=='price'?'selected':''}>Price</option>
										</select>
									</td>
									<td><a href="javascript:void(0);" data-toggle="tooltip" data-placement="top" data-original-title="Discard" onclick="return updatePriority('${priority.priorityId}')">Update</a></td>
								</tr>`;
						}
					}
				html+=`</tbody>
			</table>
		</div>
		<div class="col-lg-6 col-md-12 p-0"></div>
	</div>`;
	return html;
}

function getDiscardCountryRightTimeModel() {
	var html='';
	html+=`<div class="modal fade" id="discardCountryRightTime">
		<div class="modal-dialog modal-md modal-notify modal-danger" role="document">
			<div class="modal-content">
				<div class="modal-header py-2 bg-primary text-white">
					<h5 class="modal-title" >Are you sure you want to discard this Country Right Time to call?</h5>
				</div>
				<div id="statusMessage-2" class="modal-body delete-modal" style="padding-top:12px">
					<p><b>You are discarding the following Country Right Time to call:</b></p>
					<p><b>Country Name: </b> <span id="countryName"></span></p>
					<p><b>Right Time to Call: </b> <span id="rightTimeTocall"></span></p>
				</div>
				<div class="modal-footer text-center">
					<div style="width:100%;float:left; text-align:right">	
						<button type="button" class="btn btn-primary" id='discardLeadWarningYes'>Yes</button>
						<button type="button" class="btn btn-danger  waves-effect text-right" data-dismiss="modal">No</button>
					</div>
				</div>
			</div>
		</div>
	</div>`;
	return html;
}

function getNotificationControlContent() {
	if (window.CRMNotify && typeof window.CRMNotify.getSettingsPanelMarkup === 'function') {
		return window.CRMNotify.getSettingsPanelMarkup(USER_ID);
	}
	return '<div class="alert alert-warning mb-0">Notification controls are unavailable right now.</div>';
}

function leadConvertTo24Hour(time12) {
    let [time, modifier] = time12.split(' ');
    let [hours, minutes] = time.split(':');
    if (modifier.toLowerCase() === 'pm' && hours !== '12') {
        hours = parseInt(hours, 10) + 12;
    }
    if (modifier.toLowerCase() === 'am' && hours === '12') {
        hours = '00';
    }
    return `${hours.toString().padStart(2, '0')}:${minutes}:00`;
}



