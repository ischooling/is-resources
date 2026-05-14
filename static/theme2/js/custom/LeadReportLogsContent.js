async function renderCounselorLeadLogsDashboard(title, roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE, LEAD_CATEGORY) {
	var objRight = await getLeadReportData(roleAndModule.moduleId, USER_ID, 'report');
	var objectRights = objRight.objectRights;
	OBJECT_RIGHTS = objectRights;

	$('#dashboardContentInHTML').html(getLeadLogsMasterContent(title));
	initializeLeadReportDatepickers();
	initializeLeadLogsPage();
}

function getLeadLogsMasterContent(title) {
	var html = getLeadLogsPageTitle(title);
	html += getLeadLogsCard();
	html += getLeadLogsUserMappingModal();
	html += getLeadLogsActivateConfirmModal();
	return html;
}

function getLeadLogsPageTitle(title) {
	return '<div class="app-page-title mb-3 py-2">'
		+'<div class="page-title-wrapper">'
		+'		<div class="page-title-heading">'
		+'			<div class="page-title-icon">'
		+'				<i class="fas fa-list-alt text-primary"></i>'
		+'			</div>'
		+'			<div>'+title+'</div>'
		+'		</div>'
		+'	</div>'
		+'</div>';
}


function getLeadLogsUserMappingModal() {
	var html = '';
	html += '<div class="modal fade" id="leadLogsUserMappingModal" tabindex="-1" role="dialog" aria-hidden="true">';
	html += '	<div class="modal-dialog modal-lg" role="document">';
	html += '		<div class="modal-content">';
	html += '			<div class="modal-header">';
	html += '				<h5 class="modal-title" id="leadLogsUserMappingModalTitle">Add Lead Logs User</h5>';
	html += '				<button type="button" class="close" data-dismiss="modal" aria-label="Close">';
	html += '					<span aria-hidden="true">&times;</span>';
	html += '				</button>';
	html += '			</div>';
	html += '			<div class="modal-body">';
	html += '				<div id="leadLogsUserMappingForm">';
	html += '					<input type="hidden" id="leadLogsUserMappingId" name="leadLogsUserMappingId" value="0" />';
	html += '					<div class="form-group">';
	html += '						<label class="font-weight-bold mb-1">User</label>';
	html += '						<select class="form-control" id="leadLogsUserId" name="leadLogsUserId"></select>';
	html += '					</div>';
	html += '					<div class="form-group mb-0">';
	html += '						<label class="font-weight-bold mb-1">PBX ID</label>';
	html += '						<input type="text" class="form-control" id="leadLogsPbxId" name="leadLogsPbxId" placeholder="Enter PBX ID e.g. Alwin (109)" />';
	html += '					</div>';
	html += '				</div>';
	html += '				<div id="leadLogsUserMappingListSection" class="hidden">';
	html += '					<hr class="my-3"/>';
	html += '					<div class="table-responsive">';
	html += '					<table class="table table-bordered table-striped table-sm mb-0" style="font-size:12px;">';
	html += '						<thead>';
	html += '							<tr>';
	html += '								<th class="text-center">ID</th>';
	html += '								<th>PBX ID</th>';
	html += '								<th>User</th>';
	html += '								<th class="text-center">User ID</th>';
	html += '								<th class="text-center">Action</th>';
	html += '							</tr>';
	html += '						</thead>';
	html += '						<tbody id="leadLogsUserMappingTbody">';
	html += '							<tr><td colspan="5" class="text-center text-muted">Loading...</td></tr>';
	html += '						</tbody>';
	html += '					</table>';
	html += '					</div>';
	html += '				</div>';
	html += '			</div>';
	html += '			<div class="modal-footer">';
	html += '				<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>';
	html += '				<button type="button" class="btn btn-primary" id="btnSaveLeadLogsUserMapping"><i class="fas fa-user-plus mr-1"></i><span class="leadLogsUserMappingBtnText">Add User</span></button>';
	html += '			</div>';
	html += '		</div>';
	html += '	</div>';
	html += '</div>';
	return html;
}

function getLeadLogsActivateConfirmModal() {
	var html = '';
	html += '<div class="modal fade" id="leadLogsActivateConfirmModal" tabindex="-1" role="dialog" aria-hidden="true">';
	html += '	<div class="modal-dialog modal-sm" role="document">';
	html += '		<div class="modal-content">';
	html += '			<div class="modal-header bg-warning text-white">';
	html += '				<h5 class="modal-title" id="leadLogsActivateConfirmTitle">Confirm Remove</h5>';
	html += '				<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">';
	html += '					<span aria-hidden="true">&times;</span>';
	html += '				</button>';
	html += '			</div>';
	html += '			<div class="modal-body">';
	html += '				<p class="mb-0" id="leadLogsActivateConfirmText">Are you sure you want to remove this user mapping?</p>';
	html += '			</div>';
	html += '			<div class="modal-footer">';
	html += '				<button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">Cancel</button>';
	html += '				<button type="button" class="btn btn-warning btn-sm" id="btnConfirmLeadLogsActivate"><i class="fas fa-trash mr-1"></i><span class="leadLogsActivateConfirmBtnText">Remove</span></button>';
	html += '			</div>';
	html += '		</div>';
	html += '	</div>';
	html += '</div>';
	return html;
}

function getLeadLogsCard() {
	var html = '';
	html += '<div class="main-card mb-3 card">';
	html += '	<div class="card-body">';
	html += getLeadLogsFiltersAndTable();
	html += '	</div>';
	html += '</div>';
	return html;
}

function getLeadLogsFiltersAndTable() {
	return `<div class="row align-items-end">
				<input type="hidden" id="searchLeadCounselorReportType" name="searchLeadCounselorReportType" value="LOGS" />
				<div class="col-12 col-md-6 col-lg-2 mb-2">
					<div class="form-control bg-light text-uppercase font-weight-bold">Lead Logs</div>
				</div>
				<div class="col-12 col-md-6 col-lg-2 mb-2">
					<select class="form-control" id="searchLeadCounselorType" name="searchLeadCounselorType">
						<option value="DAY">Today</option>
						<option value="WEEK">Week</option>
						<option value="MONTH">Month</option>
						<option value="CUSTOM">Custom</option>
					</select>
				</div>
				<div class="col-12 col-md-6 col-lg-1 mb-2" id="zadarmaCallSync">
					<input type="text" name="syncZadarmaDate" id="syncZadarmaDate" class="form-control hidden" readonly onkeydown="return false" />
					<button class="btn btn-info btn-block" onclick="syncLeadLogsZadarmaCall()">
						<i class="fas fa-sync" id="callSyncRotate"></i>
					</button>
				</div>
				<div class="col-12 col-lg-5 mb-2">
					<div class="row align-items-end">
						<div class="col-12 col-md-5 hidecounselorLead mb-2 mb-md-0">
							<label class="m-0 d-block mb-1">Start Date</label>
							<input type="text" name="counselorStartDate" id="counselorStartDate" class="form-control" readonly onkeydown="return false" />
						</div>
						<div class="col-12 col-md-5 hidecounselorLead mb-2 mb-md-0">
							<label class="m-0 d-block mb-1">End Date</label>
							<input type="text" name="counselorEndDate" id="counselorEndDate" class="form-control" readonly onkeydown="return false" />
						</div>
						<div class="col-12 col-md-2 hidecounselorLead">
							<button class="btn btn-primary btn-block" id="btnLeadCounselorWiseSubmit">Submit</button>
						</div>
					</div>
				</div>
				<div class="col-12 col-lg-2 mb-2">
					<button class="btn btn-primary btn-sm btn-block" id="btnOpenLeadLogsUserMappingModal">
						<i class="fas fa-user-plus mr-1"></i>Add User
					</button>
				</div>
			</div>
	<hr/>
	<div class="row">
		<div class="col-lg-12 col-md-12 p-0">
			<table class="table table-bordered table-striped" id="counselor-list" style="font-size:11px !important">
				<thead id="listCounselorTfoot"></thead>
				<thead id="listCounselorTheader_log">
					<tr>
						<th style="5% !important" class="text-center bg-primary text-white">Sr no.</th>
						<th class="text-center bg-primary text-white"><span class="changeHeadText">User</span> Name</th>
						<th class="text-center bg-primary text-white">Call | Call Hippo</th>
						<th class="text-center bg-primary text-white">Wati</th>
						<th class="text-center bg-primary text-white">Gupshup</th>
						<th class="text-center bg-primary text-white">Whatsapp</th>
						<th class="text-center bg-primary text-white">Mail</th>
						<th class="text-center bg-primary text-white">Action</th>
					</tr>
				</thead>
				<tbody id="listCounselorTbody"></tbody>
			</table>
		</div>
	</div>`;
}

async function initializeLeadLogsPage() {
	$(".changeHeadText").text('User');

	if($("#syncZadarmaDate").length){
		$("#syncZadarmaDate").datepicker({
			format : 'yyyy-mm-dd',
			autoclose: true
		}).datepicker('setDate', new Date());
	}

	initializeLeadLogsUserMappingSection();
	reloadLeadLogsDashboardReport();

	$("#searchLeadCounselorType").off("change.leadLogs").on("change.leadLogs", function(){
		if($("#searchLeadCounselorType").val() == 'CUSTOM'){
			$(".hidecounselorLead").css({"display":"block"});
			$("#zadarmaCallSync").addClass('hidden');
		}else{
			$(".hidecounselorLead").css({"display":"none"});
			reloadLeadLogsDashboardReport();
		}
	});

	$("#btnLeadCounselorWiseSubmit").off("click.leadLogs").on("click.leadLogs", function(){
		var startDate = $("#counselorStartDate").val();
		var endDate = $("#counselorEndDate").val();

		if($("#counselorStartDate").val() == '' && $("#counselorStartDate").val() == undefined){
			showMessageTheme2(0, 'Please choose start date', '', true);
			return false;
		}
		if($("#counselorEndDate").val() == '' && $("#counselorEndDate").val() == undefined){
			showMessageTheme2(0, 'Please choose end date', '', true);
			return false;
		}

		callLeadLogsCounselorsList('leadReportSearch', $("#searchLeadCounselorType").val(), startDate, endDate, 'listCounselorTbody');
	});
}

function callLeadLogsCounselorsList(formId, modeSearch, startDate, endDate, elementId) {
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLForHTML('dashboard', 'get-lead-list-counselor'),
		data : JSON.stringify(getRequestForLeadLogsCounselor(formId, modeSearch, startDate, endDate)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			$("#leadReportSearch").modal('hide');
			if (data['status'] == '0' || data['status'] == '2') {
				showMessageTheme2(0, data['message']);
				return;
			}

			$("#zadarmaCallSync").toggleClass('hidden', modeSearch !== 'DAY');
			$("#" + elementId).html(getLeadLogsCounselorHtml(data));
			$("#listCounselorTfoot").html(getLeadLogsFootHtml(data));
		}
	});
}

function getRequestForLeadLogsCounselor(formId, modeSearch, startDate, endDate) {
	var leadCommonDTO = {};
	var leadModifyDTO = {};
	var leadStudentDetailDTO = {};
	var leadModifyDetailDTO = {};
	var leadDemoInfo = {};
	var leadCallFollowupDTO = {};

	leadModifyDTO['schoolId'] = SCHOOL_ID;
	leadModifyDTO['userId'] = USER_ID;
	leadModifyDTO['searchDateType'] = modeSearch;
	leadModifyDTO['assignTos'] = $("#" + formId + " #assignToSearch").val();
	leadModifyDTO['leadStartDate'] = startDate;
	leadModifyDTO['leadEndDate'] = endDate;
	leadModifyDTO['leadSources'] = $("#" + formId + " #sourceSearch").val();
	leadModifyDTO['leadStatuses'] = $("#" + formId + " #statusSearch").val();
	leadStudentDetailDTO['standard'] = $("#" + formId + " #gradeSearch").val();
	leadDemoInfo['demoAssignTo'] = $("#" + formId + " #leadDemoAssign").val();
	leadModifyDetailDTO['acadmicYear'] = $("#" + formId + " #acadmicYear").val();
	leadStudentDetailDTO['country'] = $("#" + formId + " #countryId").val();
	leadModifyDetailDTO['utmCampaigns'] = $("#" + formId + " #searchCampaign").val();

	leadCommonDTO['leadModifyDTO'] = leadModifyDTO;
	leadCommonDTO['leadModifyDetailDTO'] = leadModifyDetailDTO;
	leadCommonDTO['leadStudentDetailDTO'] = leadStudentDetailDTO;
	leadCommonDTO['leadDemoInfo'] = leadDemoInfo;
	leadCommonDTO['leadCallFollowupDTO'] = leadCallFollowupDTO;
	leadCommonDTO['reportType'] = 'LOGS';

	return leadCommonDTO;
}

function getLeadLogsCounselorHtml(data) {
	var leadListCounselor = data && data.leadListCounselor ? data.leadListCounselor : [];
	var htmlRet = "";

	if (!leadListCounselor.length) {
		return '<tr><td colspan="8" class="text-center">No Record</td></tr>';
	}

	for (var ind = 0; ind < leadListCounselor.length; ind++) {
		var leadCounselor = leadListCounselor[ind];
		var mappingRow = getLeadLogsMappingByUserId(leadCounselor.assignTo);
		var actionHtml = getLeadLogsTableActionHtml(mappingRow);
		htmlRet += '<tr>';
		htmlRet += '<td class="text-center">' + (ind + 1) + '</td>';
		htmlRet += '<td style="vertical-align: top !important;" class="text-left">' + sanitizeLeadLogsText(leadCounselor.assignName) + '</td>';
		htmlRet += '<td style="vertical-align: top !important;" class="text-center"><button onClick="showZadarmaDetails(\'' + sanitizeLeadLogsJsValue(leadCounselor.zadarma) + '\')" style="border: none; outline: none; cursor: pointer;" class="bg-success text-white text-center badge font-12">' + sanitizeLeadLogsText(leadCounselor.zadarmaCount) + '</button>&nbsp;|&nbsp;<button onClick="showCallhippoDetails(\'' + sanitizeLeadLogsJsValue(leadCounselor.callhippo) + '\')" style="border: none; outline: none; cursor: pointer;" class="bg-info text-white text-center badge font-12">' + sanitizeLeadLogsText(leadCounselor.callhippoCount) + '</button></td>';
		htmlRet += '<td style="vertical-align: top !important;" class="text-center"><button onClick="showWatiDetails(\'' + sanitizeLeadLogsJsValue(leadCounselor.wati) + '\')" style="border: none; outline: none; cursor: pointer;" class="bg-warning text-white text-center badge font-12">' + sanitizeLeadLogsText(leadCounselor.watiCount) + '</button></td>';
		htmlRet += '<td style="vertical-align: top !important;" class="text-center"><button onClick="showGupshupBroadcastDetails(\'' + sanitizeLeadLogsJsValue(leadCounselor.gupshupIds) + '\')" style="border: none; outline: none; cursor: pointer;" class="bg-success text-white text-center badge font-12">' + sanitizeLeadLogsText(leadCounselor.gupshupCount) + '</button></td>';
		htmlRet += '<td style="vertical-align: top !important;" class="text-center"><button onClick="showWhatsappDetails(\'' + sanitizeLeadLogsJsValue(leadCounselor.whatsappIds) + '\')" style="border: none; outline: none; cursor: pointer;" class="bg-primary text-white text-center badge font-12">' + sanitizeLeadLogsText(leadCounselor.whatsappCount) + '</button></td>';
		htmlRet += '<td style="vertical-align: top !important;" class="text-center"><button onClick="showMailBrodcastDetails(\'' + sanitizeLeadLogsJsValue(leadCounselor.mailIds) + '\')" style="border: none; outline: none; cursor: pointer;" class="bg-info text-white text-center badge font-12">' + sanitizeLeadLogsText(leadCounselor.mailCount) + '</button></td>';
		htmlRet += '<td style="vertical-align: top !important;" class="text-center">' + actionHtml + '</td>';
		htmlRet += '</tr>';
	}

	return htmlRet;
}

function getLeadLogsFootHtml(data) {
	var leadListCounselor = data && data.leadListCounselor ? data.leadListCounselor : [];
	var zadarmatotal = 0;
	var callhippototal = 0;
	var watitotal = 0;
	var gupshuptotal = 0;
	var whatsapptotal = 0;
	var mailtotal = 0;

	for (var ind = 0; ind < leadListCounselor.length; ind++) {
		var leadCounselor = leadListCounselor[ind];
		zadarmatotal += leadCounselor.zadarmaCount || 0;
		callhippototal += leadCounselor.callhippoCount || 0;
		watitotal += leadCounselor.watiCount || 0;
		gupshuptotal += leadCounselor.gupshupCount || 0;
		whatsapptotal += leadCounselor.whatsappCount || 0;
		mailtotal += leadCounselor.mailCount || 0;
	}

	var htmlRet = '';
	htmlRet += '<tr style="font-size:11px;background-color: #c9def3 !important;">';
	htmlRet += '<th class="text-center"></th>';
	htmlRet += '<th style="vertical-align: top !important;" class="text-center">Total</th>';
	htmlRet += '<th style="vertical-align: top !important;" class="text-center">' + zadarmatotal + ' / ' + callhippototal + '</th>';
	htmlRet += '<th style="vertical-align: top !important;" class="text-center">' + watitotal + '</th>';
	htmlRet += '<th style="vertical-align: top !important;" class="text-center">' + gupshuptotal + '</th>';
	htmlRet += '<th style="vertical-align: top !important;" class="text-center">' + whatsapptotal + '</th>';
	htmlRet += '<th style="vertical-align: top !important;" class="text-center">' + mailtotal + '</th>';
	htmlRet += '<th></th>';
	htmlRet += '</tr>';
	return htmlRet;
}

function showGupshupBroadcastDetails(ids){
	if(!ids){
		showMessageTheme2(0, 'No Gupshup broadcast logs');
		return;
	}
	var request = { ids: ids };
	$.ajax({
		type: 'POST',
		contentType: APPLICATION_JSON_VALUE,
		url: getURLFor('leads', 'get-broadcast-log-by-ids'),
		data: JSON.stringify(request),
		dataType: 'json',
		success: function(response){
			if(response.statusCode !== 'S001'){
				showMessageTheme2(0, response.message || 'No broadcast logs');
				return;
			}
			renderGupshupBroadcastDetailsModal(response.data || []);
		}
	});
}

function renderGupshupBroadcastDetailsModal(rows){
	$('#gupshupBroadcastDetailsModal').remove();
	var body = '';
	if(!rows || !rows.length){
		body = '<tr><td colspan="8" class="text-center">No records</td></tr>';
	}else{
		for(var i = 0; i < rows.length; i++){
			var r = rows[i];
			var statusBadge = (r.deliveredStatus === 'SUCCESS')
				? '<span class="badge badge-success text-white">SUCCESS</span>'
				: '<span class="badge badge-danger text-white">' + (r.deliveredStatus || 'FAILED') + '</span>';
			var sentFromVal = r.sentFrom || '';
			var sentFromBadgeClass = (r.entityType === 'STUDENT_LIST') ? 'badge-info' : (r.entityType === 'TEACHER_LIST' ? 'badge-warning' : 'badge-primary');
			var leadNoCell = (r.entityType === 'LEAD_LIST') ? (r.leadNo || '-') : '-';
			body += '<tr>'
				+ '<td>' + (i+1) + '</td>'
				+ '<td>' + leadNoCell + '</td>'
				+ '<td>' + (r.templateName || '') + '</td>'
				+ '<td>' + (r.leadName || '') + ' | ' + (r.entityId || '') + '</td>'
				+ '<td>' + (r.contactNo || '') + '</td>'
				+ '<td><span class="badge ' + sentFromBadgeClass + ' text-white">' + sentFromVal + '</span></td>'
				+ '<td>' + statusBadge + (r.reason ? '<div class="small text-danger">' + r.reason + '</div>' : '') + '</td>'
				+ '<td>' + (r.deliveredDatetime || '') + '</td>'
				+ '</tr>';
		}
	}
	var html = '<div class="modal fade" id="gupshupBroadcastDetailsModal" role="dialog">'
		+ '<div class="modal-dialog modal-xl">'
		+ '<div class="modal-content">'
		+ '<div class="modal-header py-2 bg-primary text-white">'
		+ '<h5 class="modal-title">Gupshup Broadcast Logs</h5>'
		+ '<button type="button" class="close text-white" data-dismiss="modal">&times;</button>'
		+ '</div>'
		+ '<div class="modal-body">'
		+ '<table class="table table-bordered font-12">'
		+ '<thead><tr class="bg-primary text-white">'
		+ '<th>Sr no.</th><th>Lead No</th><th>Template</th><th>Recipient</th><th>Contact</th><th>Sent From</th><th>Status</th><th>Delivered At</th>'
		+ '</tr></thead>'
		+ '<tbody>' + body + '</tbody>'
		+ '</table>'
		+ '</div>'
		+ '<div class="modal-footer"><button type="button" class="btn btn-danger" data-dismiss="modal">Close</button></div>'
		+ '</div></div></div>';
	$('body').append(html);
	$('#gupshupBroadcastDetailsModal').modal('show');
}

function syncLeadLogsZadarmaCall() {
	showMessageTheme2(1, "Call synchronization process started.");
	$("#callSyncRotate").addClass("rotate");
	var syncDate = $("#syncZadarmaDate").val();

	$.ajax({
		url: BASE_URL + CONTEXT_PATH + "zadarma/v1/sync?syncDate=" + syncDate,
		type: "GET",
		contentType: APPLICATION_JSON_VALUE,
		dataType: "json",
		async: true,
		global: false,
		success: function (response) {
			$("#callSyncRotate").removeClass("rotate");
			if (response.status == 'success') {
				reloadLeadLogsDashboardReport();
				return;
			}
			showMessageTheme2(0, response.message);
		}
	});
}

async function initializeLeadLogsUserMappingSection() {
	await loadLeadLogsUserOptions();
	await loadLeadLogsUserMappings();

	$("#btnOpenLeadLogsUserMappingModal").off("click.leadLogsUserMapOpen").on("click.leadLogsUserMapOpen", function(){
		resetLeadLogsUserMappingForm();
		$("#leadLogsUserMappingModal").modal('show');
	});

	$("#btnSaveLeadLogsUserMapping").off("click.leadLogsUserMap").on("click.leadLogsUserMap", async function(){
		await saveLeadLogsUserMapping();
	});

	$("#btnConfirmLeadLogsActivate").off("click.leadLogsActivate").on("click.leadLogsActivate", async function(){
		await confirmLeadLogsActivateAction();
	});
}

async function loadLeadLogsUserOptions() {
	var leadType = OBJECT_RIGHTS && OBJECT_RIGHTS.leadType ? '' + OBJECT_RIGHTS.leadType + '' : 'B2C';
	var discardPermission = OBJECT_RIGHTS && OBJECT_RIGHTS.discardPermission ? OBJECT_RIGHTS.discardPermission : false;

	await callLeadAssignUserList('leadLogsUserMappingForm', leadType, 'leadLogsUserId', true, discardPermission, USER_ID, false, SCHOOL_ID);
	$("#leadLogsUserMappingForm #leadLogsUserId option:first").text('Select User');

	if ($("#leadLogsUserMappingForm #leadLogsUserId").hasClass("select2-hidden-accessible")) {
		$("#leadLogsUserMappingForm #leadLogsUserId").select2("destroy");
	}

	$("#leadLogsUserMappingForm #leadLogsUserId").select2({
		width: '100%',
		placeholder: 'Select User'
	});
}

function getLeadLogsUserMappingPayload(extraData) {
	var payload = {};
	var authentication = {};
	authentication["hash"] = getHash();
	authentication["schoolId"] = SCHOOL_ID;
	authentication["schoolUUID"] = SCHOOL_UUID;
	authentication["userType"] = "COMMON";
	authentication["userId"] = USER_ID;
	payload["authentication"] = authentication;

	if(extraData){
		Object.keys(extraData).forEach(function(key){
			payload[key] = extraData[key];
		});
	}

	return payload;
}

async function loadLeadLogsUserMappings() {
	leadLogsUserMappingIndex = {};
	$("#leadLogsUserMappingTbody").html('<tr><td colspan="5" class="text-center text-muted">Loading...</td></tr>');

	try {
		var response = await getDashboardDataBasedUrlAndPayloadWithParentUrl(true, false, 'get-zadarma-user-mappings', getLeadLogsUserMappingPayload({}), 'api/v1/leads');
		if (!isLeadLogsUserMappingSuccess(response) && response.message) {
			$("#leadLogsUserMappingTbody").html('<tr><td colspan="5" class="text-center text-danger">'+sanitizeLeadLogsText(response.message)+'</td></tr>');
			return;
		}
		var rows = response && response.data ? response.data : [];
		var html = '';

		if (!rows.length) {
			html = '<tr><td colspan="5" class="text-center text-muted">No user mapping found.</td></tr>';
		} else {
			$.each(rows, function(index, row){
				leadLogsUserMappingIndex[row.id] = row;
				html += '<tr>';
				html += '	<td class="text-center">'+sanitizeLeadLogsText(row.id)+'</td>';
				html += '	<td>'+sanitizeLeadLogsText(row.pbxId)+'</td>';
				html += '	<td>'+sanitizeLeadLogsText(row.userName)+'</td>';
				html += '	<td class="text-center">'+sanitizeLeadLogsText(row.userId)+'</td>';
				html += '	<td class="text-center">';
				html += '		<button class="btn btn-sm btn-info mr-1" onclick="openLeadLogsEditUserMapping('+row.id+')"><i class="fas fa-edit mr-1"></i>Edit</button>';
				html += '		<button class="btn btn-sm btn-warning" onclick="openLeadLogsActivateConfirmModal(' + row.id + ')"><i class="fas fa-trash mr-1"></i>Remove</button>';
				html += '	</td>';
				html += '</tr>';
			});
		}

		$("#leadLogsUserMappingTbody").html(html);
	} catch (error) {
		$("#leadLogsUserMappingTbody").html('<tr><td colspan="5" class="text-center text-danger">Unable to load user mapping data.</td></tr>');
	}
}

async function saveLeadLogsUserMapping() {
	var mappingId = parseInt($("#leadLogsUserMappingId").val(), 10) || 0;
	var userId = $("#leadLogsUserId").val();
	var pbxId = $.trim($("#leadLogsPbxId").val());
	var existingMapping = getLeadLogsMappingByUserId(userId);
	var isAddMode = mappingId <= 0;
	var shouldReactivateExisting = isAddMode && existingMapping && existingMapping.id;

	if (!userId || userId === '0') {
		showMessageTheme2(0, 'Please select user', '', true);
		return false;
	}

	try {
		var savePayload = {
			userId: parseInt(userId, 10),
			pbxId: pbxId
		};
		if (mappingId > 0) {
			savePayload.id = mappingId;
		} else if (shouldReactivateExisting) {
			savePayload.id = parseInt(existingMapping.id, 10);
			savePayload.activate = 'Y';
		}

		var response = await getDashboardDataBasedUrlAndPayloadWithParentUrl(true, false, 'save-zadarma-user-mapping', getLeadLogsUserMappingPayload(savePayload), 'api/v1/leads');

		if (!isLeadLogsUserMappingSuccess(response)) {
			showMessageTheme2(0, response.message || 'Unable to save user mapping', '', true);
			return false;
		}

		showMessageTheme2(1, response.message || (mappingId > 0 ? 'User mapping saved successfully' : (shouldReactivateExisting ? 'User mapping saved successfully' : 'User mapping saved successfully')), '', true);
		resetLeadLogsUserMappingForm();
		$("#leadLogsUserMappingModal").modal('hide');
		await loadLeadLogsUserMappings();
		reloadLeadLogsDashboardReport();
	} catch (error) {
		showMessageTheme2(1, 'Unable to save user mapping', '', true);
	}
}

async function updateLeadLogsUserMappingActivate(id, activate) {
	try {
		var response = await getDashboardDataBasedUrlAndPayloadWithParentUrl(true, false, 'update-zadarma-user-mapping-activate', getLeadLogsUserMappingPayload({
			id: parseInt(id, 10),
			activate: normalizeLeadLogsActivateValue(activate)
		}), 'api/v1/leads');

		if (!isLeadLogsUserMappingSuccess(response)) {
			showMessageTheme2(0, response.message || 'Unable to remove user mapping', '', true);
			return false;
		}

		showMessageTheme2(1, response.message || 'User mapping status remove successfully', '', true);
		await loadLeadLogsUserMappings();
		reloadLeadLogsDashboardReport();
	} catch (error) {
		showMessageTheme2(0, 'Unable to remove user mapping status', '', true);
	}
}

var leadLogsActivateMappingId = 0;
var leadLogsActivateValue = 'Y';
var leadLogsUserMappingIndex = {};

function openLeadLogsActivateConfirmModal(id, activate) {
	leadLogsActivateMappingId = parseInt(id, 10) || 0;
	leadLogsActivateValue = 'N';
	$("#leadLogsActivateConfirmTitle").text('Confirm Remove');
	$("#leadLogsActivateConfirmText").text('Are you sure you want to remove this user mapping?');
	$("#btnConfirmLeadLogsActivate")
		.removeClass('btn-success btn-warning')
		.addClass('btn-warning');
	$("#btnConfirmLeadLogsActivate i").attr('class', 'fas fa-trash mr-1');
	$("#btnConfirmLeadLogsActivate .leadLogsActivateConfirmBtnText").text('Remove');
	$("#leadLogsActivateConfirmModal").modal('show');
}

function openLeadLogsActivateConfirmModalByUserId(userId) {
	var row = getLeadLogsMappingByUserId(userId);
	if (!row || !row.id) {
		showMessageTheme2(1, 'Selected mapping not found', '', true);
		return false;
	}

	openLeadLogsActivateConfirmModal(row.id);
}

function openLeadLogsEditUserMappingByUserId(userId) {
	var mappingId = getLeadLogsMappingIdByUserId(userId);
	if (!mappingId) {
		showMessageTheme2(0, 'Selected mapping not found', '', true);
		return false;
	}

	openLeadLogsEditUserMapping(mappingId);
}

function openLeadLogsEditUserMapping(id) {
	var mappingId = parseInt(id, 10) || 0;
	var row = leadLogsUserMappingIndex[mappingId];
	if (!row) {
		showMessageTheme2(1, 'Selected mapping not found', '', true);
		return false;
	}

	$("#leadLogsUserMappingId").val(mappingId);
	$("#leadLogsUserId").val(String(row.userId)).trigger('change');
	$("#leadLogsPbxId").val(row.pbxId || '');
	$("#leadLogsUserMappingModalTitle").text('Edit Lead Logs User');
	$("#btnSaveLeadLogsUserMapping").removeClass('btn-primary').addClass('btn-warning');
	$("#btnSaveLeadLogsUserMapping i").attr('class', 'fas fa-edit mr-1');
	$("#btnSaveLeadLogsUserMapping .leadLogsUserMappingBtnText").text('Update User');
	$("#leadLogsUserMappingModal").modal('show');
}

async function confirmLeadLogsActivateAction() {
	if (!leadLogsActivateMappingId) {
		$("#leadLogsActivateConfirmModal").modal('hide');
		return false;
	}

	var currentId = leadLogsActivateMappingId;
	var currentActivate = leadLogsActivateValue;
	leadLogsActivateMappingId = 0;
	leadLogsActivateValue = 'Y';
	$("#leadLogsActivateConfirmModal").modal('hide');
	await updateLeadLogsUserMappingActivate(currentId, currentActivate);
}

function reloadLeadLogsDashboardReport() {
	var filterType = $("#searchLeadCounselorType").val() || 'DAY';

	if (filterType === 'CUSTOM') {
		var startDate = $("#counselorStartDate").val();
		var endDate = $("#counselorEndDate").val();
		if (startDate && endDate) {
			callLeadLogsCounselorsList('leadReportSearch', filterType, startDate, endDate, 'listCounselorTbody');
		}
		return;
	}

	callLeadLogsCounselorsList('leadReportSearch', filterType, '', '', 'listCounselorTbody');
}

function resetLeadLogsUserMappingForm() {
	$("#leadLogsUserMappingId").val('0');
	$("#leadLogsPbxId").val('');
	$("#leadLogsUserId").val('0').trigger('change');
	$("#leadLogsUserMappingListSection").addClass('hidden');
	$("#leadLogsUserMappingModalTitle").text('Add Lead Logs User');
	$("#btnSaveLeadLogsUserMapping").removeClass('btn-warning').addClass('btn-primary');
	$("#btnSaveLeadLogsUserMapping i").attr('class', 'fas fa-user-plus mr-1');
	$("#btnSaveLeadLogsUserMapping .leadLogsUserMappingBtnText").text('Add User');
}

function isLeadLogsUserMappingSuccess(response) {
	if (!response) {
		return false;
	}
	return response.status === 'success' || String(response.statusCode) === '0';
}

function sanitizeLeadLogsText(value) {
	if (value === null || value === undefined) {
		return '';
	}
	return String(value)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

function sanitizeLeadLogsJsValue(value) {
	return String(value === null || value === undefined ? '' : value)
		.replace(/\\/g, '\\\\')
		.replace(/'/g, "\\'");
}

function getLeadLogsMappingIdByUserId(userId) {
	var row = getLeadLogsMappingByUserId(userId);
	return row && row.id ? parseInt(row.id, 10) || 0 : 0;
}

function getLeadLogsMappingByUserId(userId) {
	var parsedUserId = parseInt(userId, 10) || 0;
	var mappingIds = Object.keys(leadLogsUserMappingIndex);

	for (var ind = 0; ind < mappingIds.length; ind++) {
		var row = leadLogsUserMappingIndex[mappingIds[ind]];
		if ((parseInt(row.userId, 10) || 0) === parsedUserId) {
			return row;
		}
	}

	return null;
}

function getLeadLogsTableActionHtml(mappingRow) {
	if (!mappingRow || !mappingRow.id) {
		return '<span class="text-muted">No Mapping</span>';
	}

	var mappingId = parseInt(mappingRow.id, 10) || 0;
	return '<button onClick="openLeadLogsEditUserMapping(' + mappingId + ')" class="btn btn-info btn-sm mr-1">Edit</button>'
		+ '<button onClick="openLeadLogsActivateConfirmModal(' + mappingId + ')" class="btn btn-warning btn-sm"><i class="fas fa-trash mr-1"></i>Remove</button>';
}

function normalizeLeadLogsActivateValue(value) {
	return String(value || 'Y').toUpperCase() === 'N' ? 'N' : 'Y';
}
