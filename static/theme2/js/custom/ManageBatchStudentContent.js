/*
 * Manage Group Students — JS-rendered module shell.
 * Replaces the JSP-rendered DashboardManageBatchStudent.jsp / AddBatchStudent.jsp flow:
 *  - one JSON call (/dashboard/manage-batch-student-data) supplies the classroom list plus
 *    all the dropdown/master data (timezone, grade, active session, module rights) the JSP
 *    fragments used to receive as model attributes;
 *  - the page shell, classroom table, action dropdowns, validation modals and the Add
 *    Classroom modal are all built client-side here — no server HTML render per click;
 *  - the classroom list is small (classrooms per school), so a single fetch + client-side
 *    DataTable is used rather than the chunked advance-search pattern.
 *  - all row-action functions (callBatchSubjectAndTeacherMapping, callStudentBatchTransfer,
 *    callBatchExaminationSheetModule, createBatchByStudent, editBatchDetails, …) stay in
 *    dashboardSchoolBatches.js and are called from the JS-rendered rows unchanged.
 */

var __manageBatchStudentData = null;
var __batchRegHandlersBound = false;

async function fetchManageBatchStudentData(moduleId) {
	var ajaxReqDetails = {
		method: "POST",
		url: getURLForHTML("dashboard", "manage-batch-student-data"),
		body: {
			moduleId: moduleId,
			schoolId: SCHOOL_ID,
		},
		global: false,
		showMessage: false,
	};
	// callCommonAjax handles the session-out (status '3') redirect itself.
	var data = await callCommonAjax(ajaxReqDetails);
	if (data && data.status == "1") {
		__manageBatchStudentData = data;
		return data;
	}
	return null;
}

// Escape a value for safe use inside an HTML attribute / text node.
function batchEsc(value) {
	if (value === undefined || value === null) {
		return "";
	}
	return String(value)
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");
}

// Escape a value for safe use inside a single-quoted JS string in an inline handler.
function batchJsArg(value) {
	if (value === undefined || value === null) {
		return "";
	}
	return String(value).replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

// One classroom row — mirrors the <c:forEach> row markup of DashboardManageBatchStudent.jsp.
function buildBatchRowHtml(batch, index, moduleId, added) {
	var batchId = batch.batchId;
	var name = batchJsArg(batch.batchName);
	var standardId = batch.standardId;
	var isMain = batch.batchCategory === "MAIN_BATCH";

	var category = isMain ? "Main Classroom " : " Extra Classes Batch ";
	var grade = isMain ? batchEsc(batch.standardName) + " " : " N/A ";

	var actions = "";
	actions += '<a href="javascript:void(0);" class="dropdown-item" onclick="return callBatchSubjectAndTeacherMapping(\'formId\',\'' + batchId + '\',\'' + name + '\',\'' + standardId + '\',\'Assign\',' + moduleId + ');"><i class="fa fa-cogs"></i>&nbsp;&nbsp;Assign Teacher</a>';
	actions += '<a href="javascript:void(0);" class="dropdown-item" onclick="return callBatchSubjectAndTeacherMapping(\'formId\',\'' + batchId + '\',\'' + name + '\',\'' + standardId + '\',\'View\',' + moduleId + ');"><i class="fa fa-cogs"></i>&nbsp;&nbsp;View Assigned Teacher</a>';
	if (isMain) {
		actions += '<a href="javascript:void(0);" class="dropdown-item" onclick="return callStudentBatchTransfer(\'formId\',\'' + batchId + '\',\'' + name + '\',\'' + standardId + '\',\'Add\',' + moduleId + ');"><i class="fa fa-users"></i>&nbsp;&nbsp;Add Students</a>';
		actions += '<a href="javascript:void(0);" class="dropdown-item" onclick="return callStudentBatchTransfer(\'formId\',\'' + batchId + '\',\'' + name + '\',\'' + standardId + '\',\'Move\',' + moduleId + ');"><i class="fa fa-cogs"></i>&nbsp;&nbsp;Move Student\'s Classroom</a>';
		actions += '<a href="javascript:void(0);" class="dropdown-item" onclick="return callStudentBatchTransfer(\'formId\',\'' + batchId + '\',\'' + name + '\',\'' + standardId + '\',\'Extra Class\',' + moduleId + ');"><i class="fa fa-users"></i>&nbsp;&nbsp;Join Extra Class</a>';
	}
	if (batch.totalStudent == 0) {
		var deleteCall = "callStudentBatchTransfer(\\'formId\\'," + batchId + ",\\'" + name + "\\'," + standardId + ",\\'Delete\\'," + moduleId + ")";
		actions += '<a href="javascript:void(0);" class="dropdown-item" onclick="return showWarningMessage(\'Are you sure you want to delete batch?\', \'' + deleteCall + '\');"><i class="fa fa-trash"></i>&nbsp;&nbsp;Delete Batch</a>';
	}
	actions += '<a href="javascript:void(0);" class="dropdown-item" onclick="return callStudentBatchTransfer(\'formId\',\'' + batchId + '\',\'' + name + '\',\'' + standardId + '\',\'Edit\',' + moduleId + ');"><i class="fa fa-edit"></i>&nbsp;&nbsp;View/Edit Classroom Details</a>';
	actions += '<a href="javascript:void(0);" class="dropdown-item" onclick="return callBatchExaminationSheetModule(\'formId\',\'' + batchId + '\',\'' + name + '\',\'' + standardId + '\',\'ExamSheet\',' + moduleId + ');"><i class="fa fa-upload"></i>&nbsp;&nbsp;Upload Examination Schedule</a>';
	actions += '<a href="javascript:void(0);" class="dropdown-item" onclick="getBatchDetails(\'' + batchId + '\',' + moduleId + ')"><i class="fa fa-eye"></i>&nbsp;View Batch Details</a>';
	actions += '<a href="javascript:void(0);" class="dropdown-item" id="registrationAction_' + batchId + '" data-enabled="' + batchEsc(batch.enableRegistration) + '" onclick="handleRegistrationAction(\'' + batchId + '\',\'\')"><i class="fas fa-toggle-on"></i>&nbsp;&nbsp;<span class="reg-text"></span></a>';

	var row = "";
	row += '<tr>';
	row += '<td>' + (index + 1) + '</td>';
	row += '<td>' + batchEsc(batch.batchName) + '<br/>' + batchEsc(batch.meetingVendor) + '/' + batchEsc(batch.joiningType) + '</td>';
	row += '<td>' + category + '</td>';
	row += '<td>' + grade + '</td>';
	row += '<td>' + batchEsc(batch.batchStartDate) + ' - ' + batchEsc(batch.batchEndDate) + ' (' + batchEsc(batch.timeHrsFrom) + ')<br/>' + batchEsc(batch.timeZoneFromName) + ' - ' + batchEsc(batch.timeZoneToName) + '</td>';
	row += '<td>' + batchEsc(batch.totalStudent) + '</td>';
	row += '<td>';
	row += '<div class="dropdown">';
	row += '<button class="btn btn-danger dropdown-toggle btn-sm" style="background-color:var(--pc) !important;border-color:var(--pc);box-shadow:none;" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"><i class="fa fa-ellipsis-v"></i></button>';
	row += '<ul class="dropdown-menu"><li>' + actions + '</li></ul>';
	row += '</div>';
	row += '</td>';
	row += '</tr>';
	return row;
}

function getBatchTimezoneOptionsHtml(timeZoneList) {
	var html = '<option value="">Select Time Zone</option>';
	if (timeZoneList) {
		for (var i = 0; i < timeZoneList.length; i++) {
			var tz = timeZoneList[i];
			html += '<option value="' + batchEsc(tz.key) + '" data-timezone="' + batchEsc(tz.extra4) + '">(' + batchEsc(tz.extra) + ') - ' + batchEsc(tz.value) + '</option>';
		}
	}
	return html;
}

function getBatchGradeOptionsHtml(gradeList) {
	var html = '<option value="0">Select Grade</option>';
	if (gradeList) {
		for (var i = 0; i < gradeList.length; i++) {
			html += '<option value="' + batchEsc(gradeList[i].key) + '">' + batchEsc(gradeList[i].value) + '</option>';
		}
	}
	return html;
}

// Add Classroom modal — from AddBatchStudent.jsp.
function getBatchAddModalHtml(data) {
	var addedFlag = data.roleAndModule && data.roleAndModule.added === "Y";
	var moduleId = data.roleAndModule ? data.roleAndModule.moduleId : data.moduleId;

	var hoursOptions = '<option value="">HH</option><option value="00">00</option>';
	for (var h = 1; h <= 23; h++) {
		var hv = h > 9 ? String(h) : "0" + h;
		hoursOptions += '<option value="' + hv + '">' + hv + '</option>';
	}
	var minOptions = '<option value="">MM</option>';
	for (var m = 0; m <= 59; m += 5) {
		var mv = m > 9 ? String(m) : "0" + m;
		minOptions += '<option value="' + mv + '">' + mv + '</option>';
	}
	var durationOptions = '<option value="">Please select batch duration</option>';
	for (var d = 1; d <= 12; d++) {
		durationOptions += '<option value="' + d + '">' + d + (d === 1 ? ' Hour' : ' Hours') + '</option>';
	}
	var vendorOptions = SCHOOL_ID != 5
		? '<option value="LENS" selected>LENS</option>'
		: '<option value="External">External</option>';

	return '' +
	'<div class="modal fade" id="addBatchModal" role="dialog">' +
		'<div class="modal-dialog modal-xl">' +
			'<form name="batchForm" id="batchForm" class="custom-field-scope" action="javascript:void(0);">' +
				'<div class="modal-content border-0">' +
					'<div class="modal-header py-2 bg-primary text-white">' +
						'<h5 class="modal-title">Add Classroom</h5>' +
						'<button type="button" class="close text-white" data-dismiss="modal">&times;</button>' +
					'</div>' +
					'<div class="modal-body">' +
						'<input type="hidden" class="form-control" id="userId" name="userId" value="' + batchEsc(USER_ID) + '">' +
						'<input type="hidden" class="form-control" id="selectStudentIds" name="selectStudentIds" />' +
						'<input type="hidden" class="form-control" id="standardId" name="standardId" />' +
						'<input type="hidden" class="form-control" id="callFrom" name="callFrom" />' +
						'<input type="hidden" class="form-control" id="timeZoneFrom" name="timeZoneFrom" />' +
						'<input type="hidden" class="form-control" id="timeZoneTo" name="timeZoneTo" />' +
						'<input type="hidden" class="form-control" id="sessionId" name="sessionId" />' +
						'<div class="row">' +
							'<div class="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">' +
								'<div class="form-group custom-field">' +
									'<input type="text" class="form-control" id="batchName" name="batchName" placeholder=" " onkeydown="return M.isAddressLine(event);" />' +
									'<label for="batchName">Classroom Name</label>' +
								'</div>' +
							'</div>' +
							'<div class="col-xl-2 col-lg-4 col-md-6 col-sm-12 col-12" id="batchCategoryDiv">' +
								'<div class="form-group custom-field">' +
									'<select class="form-control" id="batchCategory" name="batchCategory" onchange="return changeCategory()">' +
										'<option value="">Select Classroom Category</option>' +
										'<option value="MAIN_BATCH">Main Batch</option>' +
										'<option value="EXTRA_CLASS_BATCH">Extra Classes Batch</option>' +
									'</select>' +
									'<label for="batchCategory">Classroom Category</label>' +
								'</div>' +
							'</div>' +
							'<div class="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12" id="countryTimezoneFromIdDiv">' +
								'<div class="form-group custom-field">' +
									'<select name="countryTimezoneFromId" id="countryTimezoneFromId" class="form-control">' + getBatchTimezoneOptionsHtml(data.timeZoneList) + '</select>' +
									'<label for="countryTimezoneFromId">TimeZone From</label>' +
								'</div>' +
							'</div>' +
							'<div class="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12" id="countryTimezoneToIdDiv">' +
								'<div class="form-group custom-field">' +
									'<select name="countryTimezoneToId" id="countryTimezoneToId" class="form-control">' + getBatchTimezoneOptionsHtml(data.timeZoneList) + '</select>' +
									'<label for="countryTimezoneToId">TimeZone To</label>' +
								'</div>' +
							'</div>' +
							'<div class="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12" id="gradeDiv">' +
								'<div class="form-group custom-field">' +
									'<select class="form-control" id="standardId" name="standardId" onchange="setStandardId(this.value)">' + getBatchGradeOptionsHtml(data.gradeList) + '</select>' +
									'<label for="standardId">Select Grade</label>' +
								'</div>' +
							'</div>' +
							'<div class="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">' +
								'<div class="form-group custom-field">' +
									'<input type="text" class="form-control" id="batchStartDate" name="batchStartDate" placeholder=" " readonly onkeydown="return false" />' +
									'<label for="batchStartDate">Start Date</label>' +
								'</div>' +
							'</div>' +
							'<div class="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">' +
								'<div class="form-group custom-field">' +
									'<input type="text" class="form-control" id="batchEndDate" name="batchEndDate" placeholder=" " readonly onkeydown="return false" />' +
									'<label for="batchEndDate">End Date</label>' +
								'</div>' +
							'</div>' +
							'<div class="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">' +
								'<div class="form-group custom-field">' +
									'<input type="text" class="form-control" id="batchHolidayDate" name="batchHolidayDate" placeholder=" " readonly onkeydown="return false" />' +
									'<label for="batchHolidayDate">Blackout Date</label>' +
								'</div>' +
							'</div>' +
							'<div class="col-xl-2 col-lg-4 col-md-6 col-sm-12 col-12">' +
								'<div class="form-group">' +
									'<div class="d-flex align-items-center">' +
										'<div class="d-inline-block w-50 batchStartTimeDiv form-group custom-field mb-0">' +
											'<select id="timeHrsFrom" name="timeHrsFrom" class="form-control" style="padding: 0 15px;" onchange="getTimeFrom(this.value);">' + hoursOptions + '</select>' +
											'<label for="timeHrsFrom">HH</label>' +
										'</div>' +
										'<span class="d-inline-block w-fit-content mx-2 font-weight-bold">:</span>' +
										'<div class="d-inline-block w-50 batchEndTimeDiv form-group custom-field mb-0">' +
											'<select id="timeMinFrom" name="timeMinFrom" class="form-control" style="padding: 0 15px;">' + minOptions + '</select>' +
											'<label for="timeMinFrom">MM</label>' +
										'</div>' +
									'</div>' +
								'</div>' +
							'</div>' +
							'<div class="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">' +
								'<div class="form-group custom-field batchDurationDiv">' +
									'<select class="form-control" name="batchDuration" id="batchDuration">' + durationOptions + '</select>' +
									'<label for="batchDuration">Classroom Duration (in Hours)</label>' +
								'</div>' +
							'</div>' +
							'<div class="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">' +
								'<div class="form-group custom-field">' +
									'<input type="text" class="form-control" id="batchPeriodTime" name="batchPeriodTime" placeholder=" " onkeydown="return M.digit(event);" />' +
									'<label for="batchPeriodTime">Period Time (In Minutes)</label>' +
								'</div>' +
							'</div>' +
							'<div class="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">' +
								'<div class="form-group custom-field timeIntervalDiv">' +
									'<select class="form-control" name="timeInterval" id="timeInterval">' +
										'<option value="0">Please select Buffer Time</option>' +
										'<option value="5">5 Minutes</option>' +
										'<option value="10">10 Minutes</option>' +
										'<option value="15">15 Minutes</option>' +
										'<option value="20">20 Minutes</option>' +
										'<option value="25">25 Minutes</option>' +
										'<option value="30">30 Minutes</option>' +
									'</select>' +
									'<label for="timeInterval">Buffer Time Between Two Periods</label>' +
								'</div>' +
							'</div>' +
							'<div class="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">' +
								'<div class="form-group custom-field meetingVendorDiv">' +
									'<select class="form-control" name="meetingVendor" id="meetingVendor" onchange="return changeVendor(\'batchForm\', \'meetingVendor\', \'batchLink\')">' + vendorOptions + '</select>' +
									'<label for="meetingVendor">Meeting Vendor</label>' +
								'</div>' +
							'</div>' +
							'<div class="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">' +
								'<div class="form-group custom-field joiningTypeDiv">' +
									'<select disabled class="form-control" name="joiningType" id="joiningType" onchange="return changeJoiningType(\'batchForm\', \'batchLink\')">' +
										'<option value="Multiple" selected>Multiple</option>' +
										'<option value="Single">Single</option>' +
									'</select>' +
									'<label for="joiningType">Joining Type</label>' +
								'</div>' +
							'</div>' +
							'<div class="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12 hide">' +
								'<div class="form-group custom-field">' +
									'<input type="text" class="form-control" id="batchLink" name="batchLink" placeholder=" " readonly />' +
									'<label for="batchLink">Enter Classroom Link</label>' +
								'</div>' +
							'</div>' +
						'</div>' +
					'</div>' +
					'<div class="modal-footer text-right">' +
						'<button type="button" class="btn btn-danger " data-dismiss="modal">Close</button>' +
						(addedFlag ? '<button type="button" class="send btn btn-primary batchCreate" id="proceed" onclick="return createBatchByStudent(\'batchForm\',\'STUDENT\',' + moduleId + ');">Proceed</button>' : '') +
					'</div>' +
				'</div>' +
			'</form>' +
		'</div>' +
	'</div>';
}

// The two teacher/class validation modals + generic user-activity containers
// (from DashboardManageBatchStudent.jsp and the CommonUserActivity.jsp include).
function getBatchStudentModalsHtml() {
	return '' +
	'<div id="batchSubjectTeacherSupportContent"></div>' +
	'<div class="modal fade" id="recurringClassShowModel" role="dialog" aria-labelledby="recurringClassShowModelLabel">' +
		'<div class="modal-dialog modal-xl" role="document">' +
			'<div class="modal-content">' +
				'<div class="modal-header py-2 bg-primary text-white">' +
					'<h5 class="modal-title" id="recurringClassShowModelLabel">Validate Batch Teacher Mapping Class</h5>' +
					'<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
				'</div>' +
				'<div class="modal-body" style="max-height:480px;margin-top:0 !important; overflow-x:auto">' +
					'<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 p-0">' +
						'<div class="full" id="availaibilityHeading"><h5 class="font-weight-semi-bold">Teacher\'s Availability Details</h5></div>' +
						'<div class="table-responsive" style="max-height: 400px;">' +
							'<table class="table table-bordered table-striped border-radius-table font-12 nowrap" id="teacherAvailabilityTable" style="display: none;width:100%;min-width: 1000px;">' +
								'<thead class="position-sticky" style="top:0;left:0;z-index: 10;">' +
									'<tr class="bg-primary text-white"><th>Teacher Availability</th><th>Class Timing</th><th>Status</th></tr>' +
								'</thead>' +
								'<tbody id="teacherAvailabilityTbody"></tbody>' +
							'</table>' +
						'</div>' +
					'</div>' +
				'</div>' +
			'</div>' +
		'</div>' +
	'</div>' +
	'<div class="modal fade" id="recurringClassShowModelValidation" role="dialog" aria-labelledby="recurringClassShowModelValidationLabel">' +
		'<div class="modal-dialog modal-xl" role="document">' +
			'<div class="modal-content">' +
				'<div class="modal-header py-2 bg-primary text-white">' +
					'<h5 class="modal-title" id="recurringClassShowModelValidationLabel">Validate Batch Teacher Mapping Class</h5>' +
					'<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
				'</div>' +
				'<div class="modal-body" style="max-height:480px;margin-top:0 !important; overflow-x:auto">' +
					'<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 p-0">' +
						'<div class="full"><h5 class="font-weight-semi-bold">Class Validation Details</h5></div>' +
						'<div class="table-responsive">' +
							'<table class="table table-bordered table-striped border-radius-table font-12 nowrap mb-2" style="min-width: 1000px;width: 100%;">' +
								'<thead>' +
									'<tr class="bg-primary text-white"><th class="text-center">S.No</th><th>Subject Name</th><th>Teacher Name</th><th>Teacher Meeting Time</th><th>Availability Status</th><th>Reason of Availability Status</th></tr>' +
								'</thead>' +
								'<tbody id="trRecurring"></tbody>' +
							'</table>' +
						'</div>' +
					'</div>' +
				'</div>' +
			'</div>' +
		'</div>' +
	'</div>' +
	'<div id="divHistoryRemarks"></div>' +
	'<div id="userActivityHTML"></div>' +
	'<div class="modal fade" id="commonCommentsLogsModel" role="dialog">' +
		'<div class="modal-dialog modal-lg">' +
			'<div class="modal-content">' +
				'<div class="modal-header py-2 bg-primary text-white">' +
					'<h5 class="modal-title" id="commonCommentTitle">Past Comments</h5>' +
					'<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
				'</div>' +
				'<div id="commonCommentsLogsModelContents" class="modal-body" style="height:500px;overflow:auto;"></div>' +
			'</div>' +
		'</div>' +
	'</div>';
}

function initManageBatchStudentTable() {
	var table = $("#manageBatches").DataTable({
		"select": true,
		"processing": true,
		"serverSide": false,
		"pagingType": "full",
		"pageLength": 10,
		"search": { "smart": false, "regex": false },
	});
	$("#manageBatches").on('page.dt', function () {
		table.responsive.recalc();
	});
	$('#manageBatches').dataTable().fnSetFilteringEnterPress();
}

async function renderManageBatchStudentDashboard(title, roleAndModule, schoolId, userId, userRole) {
	try {
		customLoader(true);
		var moduleId = roleAndModule && roleAndModule.moduleId ? roleAndModule.moduleId : MODULE_ID;
		var data = await fetchManageBatchStudentData(moduleId);
		customLoader(false);
		if (!data) {
			showMessageTheme2(0, "Unable to load Manage Group Students. Please try again.");
			return;
		}

		if ($("#manageBatchStudentCss").length < 1) {
			$("head").append('<style id="manageBatchStudentCss">.active{ color:green} .inactive{ color:red} .cus_btn{padding:8px 18px;}</style>');
		}

		var rowsHtml = "";
		if (data.batches) {
			for (var i = 0; i < data.batches.length; i++) {
				rowsHtml += buildBatchRowHtml(data.batches[i], i, moduleId, data.roleAndModule && data.roleAndModule.added === "Y");
			}
		}

		var sessionName = data.session ? (data.session.sessionName || "") : "";
		var sessionId = data.session ? (data.session.sessionId || "") : "";

		var html = '' +
			'<div class="app-page-title mb-3 py-2">' +
				'<div class="page-title-wrapper">' +
					'<div class="page-title-heading">' +
						'<div class="page-title-icon"><i class="fas fa-user-cog text-primary"></i></div>' +
						'<div>' + (title || 'Manage Group Students') + '</div>' +
					'</div>' +
					'<div class="btn-actions-pane-right">' +
						'<a onclick="callBatchModal()" href="javascript:void(0);" class="btn cus_btn btn-primary fa-pull-right extraClassBatchAdd">&nbsp;Add Classroom</a>' +
					'</div>' +
				'</div>' +
			'</div>' +
			'<div class="main-card mt-3 mb-3 card body-tabs-shadow">' +
				'<div class="card-body">' +
					'<input type="hidden" class="form-control" id="year" name="year" value="" />' +
					'<input type="hidden" id="needToAddTimePreferrence" name="needToAddTimePreferrence"/>' +
					'<input type="hidden" id="saveForcefully" name="saveForcefully"/>' +
					'<input type="hidden" id="sessionMaster" name="sessionMaster" value="' + batchEsc(sessionName) + '"/>' +
					'<input type="hidden" id="sessionId" name="sessionId" value="' + batchEsc(sessionId) + '"/>' +
					'<br>' +
					'<div style="width:100%;display:inline-block">' +
						'<table class="table table-bordered table-striped border-radius-table font-12 responsive nowrap" id="manageBatches" style="width:100% !important">' +
							'<thead>' +
								'<tr class="bg-primary text-white">' +
									'<th>S. No.</th>' +
									'<th>Classroom Name<br/>Meeting Vendor/Joining Type</th>' +
									'<th>Classroom Category</th>' +
									'<th>Grade</th>' +
									'<th>Start Date - End Date (Time)<br/>Timezone</th>' +
									'<th>Total Student</th>' +
									'<th>Action</th>' +
								'</tr>' +
							'</thead>' +
							'<tbody>' + rowsHtml + '</tbody>' +
						'</table>' +
					'</div>' +
				'</div>' +
			'</div>' +
			getBatchStudentModalsHtml() +
			getBatchAddModalHtml(data);

		$('#dashboardContentInHTML').html(html);

		initManageBatchStudentTable();
		initBatchAddModal();
		bindBatchRegistrationHandlers();
	} catch (e) {
		console.error(e);
		customLoader(false);
		showMessageTheme2(0, "Unable to load Manage Group Students. Please try again.");
	}
}

/* ------------------------------------------------------------------ *
 * Functions moved verbatim from the old JSP inline <script> blocks.  *
 * ------------------------------------------------------------------ */

// View Batch Details — fully JS-rendered, in-window in #dashboardContentInHTMLAdditional with a
// Back button. Fetches JSON from /dashboard/batch-report-content-data, builds the report content
// client-side (student details + subjects + batch list + calendar shell), then boots the JS
// calendar via calendarDates(). Replaces the BatchReportContent.jsp fragment.
async function getBatchDetails(batchId, moduleId) {
	showAndHideDashboardAndAdditionalContent("additional");
	$("#dashboardContentInHTMLAdditional").html('<div class="main-card mb-3 card"><div class="card-body text-center">Loading...</div></div>');
	customLoader(true);
	var ajaxReqDetails = {
		method: "POST",
		url: getURLForHTML('dashboard', 'batch-report-content-data'),
		body: { userId: USER_ID, batchId: batchId, moduleId: moduleId },
		global: false,
		showMessage: false,
	};
	var data = await callCommonAjax(ajaxReqDetails);
	customLoader(false);
	if (!data || data.status != "1") {
		if (!(data && data.status == "3")) {
			showMessageTheme2(0, (data && data.message) ? data.message : "Unable to load batch details. Please try again.");
			showAndHideDashboardAndAdditionalContent("main");
		}
		return;
	}
	$("#dashboardContentInHTMLAdditional").html(getBatchDetailsWrapper(getBatchReportContentHtml(data)));
	// Boot the JS calendar (batchCalendarRender.js) — same seed the JSP inline script used.
	$("#inActDate").val(data.disabledDate || '');
	$("#monthTitle").html(batchEsc(data.monthName) + ' - ' + batchEsc(data.year));
	calendarDates('calendarWeek', data.firstDateOfMonth, 'Month', data.batchUserId, data.batchId);
}

// In-window month-title reload (was getBatchMonthDetails → location.reload in the JSP).
function getBatchMonthDetails(batchId) {
	getBatchDetails(batchId, MODULE_ID);
}

// Client render of BatchReportContent.jsp from the JSON payload.
function getBatchReportContentHtml(data) {
	var hasBatchId = data.batchId && data.batchId != 0;
	var info = data.studentInfo || {};

	var infoTiles = '';
	if (!hasBatchId) {
		infoTiles +=
			'<div class="col-lg-4 col-xl-4 col-md-6 col-sm-12 col-12"><div class="card mb-2 widget-content card-btm-border border-primary p-2"><div class="widget-content-wrapper">' +
				'<div class="widget-content-left"><div class="widget-heading fsize-1 text-primary">Name</div><div class="widget-subheading opacity-10  fsize-1">' + batchEsc(info.userName) + '</div></div>' +
				'<div class="widget-content-right"><div class="widget-numbers text-primary"><span><i class="pe-7s-user"></i></span></div></div>' +
			'</div></div></div>';
		if (data.reportFor === 'STUDENT') {
			infoTiles += '<div class="col-lg-4 col-xl-4 col-md-6 col-sm-12 col-12"><div class="card mb-2 widget-content card-btm-border border-danger p-2"><div class="widget-content-wrapper"><div class="widget-content-left"><div class="widget-heading text-danger fsize-1">Grade</div><div class="widget-subheading opacity-10  fsize-1">' + batchEsc(info.standardName) + '</div></div><div class="widget-content-right"><div class="widget-numbers text-danger"><span><i class="pe-7s-study"></i></span></div></div></div></div></div>';
		} else if (data.reportFor === 'TEACHER') {
			infoTiles += '<div class="col-lg-4 col-xl-4 col-md-6 col-sm-12 col-12"><div class="card mb-2 widget-content card-btm-border border-danger p-2"><div class="widget-content-wrapper"><div class="widget-content-left"><div class="widget-heading text-danger fsize-1">Official Email</div><div class="widget-subheading opacity-10  fsize-1">' + batchEsc(info.offemail) + '</div></div><div class="widget-content-right"><div class="widget-numbers text-danger"><span><i class="pe-7s-study"></i></span></div></div></div></div></div>';
		}
		infoTiles += '<div class="col-lg-4 col-xl-4 col-md-12 col-sm-12 col-12"><div class="card mb-2 widget-content card-btm-border border-success p-2"><div class="widget-content-wrapper"><div class="widget-content-left"><div class="widget-heading text-success fsize-1">Email</div><div class="widget-subheading opacity-10  fsize-1">' + batchEsc(info.email) + '</div></div><div class="widget-content-right"><div class="widget-numbers text-success"><span><i class="pe-7s-id"></i></span></div></div></div></div></div>';
	}

	var subjectItems = '';
	var subjects = data.subjects || [];
	for (var i = 0; i < subjects.length; i++) {
		var s = subjects[i];
		var active = s.lmsSynchStatus === 'active';
		subjectItems += '<li class=" mb-1 mr-1"><div class="icon-wrapper full h-auto mt-1"><div class="icon-wrapper-bg bg-secondary rounded"></div>' +
			'<div class=" ' + (active ? 'text-white bg-secondary' : 'text-secondary') + '  pt-1 pb-1 pr-1 pl-1"><i class="pe-7s-notebook fsize-1"></i>' +
			(active ? '<span>' + batchEsc(s.subjectName) + '&nbsp;<i class="pe-7s-check fsize-1"></i></span>' : '<span>' + batchEsc(s.subjectName) + '</span>') +
			'</div></div></li>';
	}

	var batches = data.batches || [];
	var batchRows = '';
	var lastEnd = '', lastStart = '';
	for (var b = 0; b < batches.length; b++) {
		var bt = batches[b];
		batchRows += '<tr><td>' + batchEsc(bt.batchName) + '</td><td>' + batchEsc(bt.startTime) + '</td><td>' + batchEsc(bt.endTime) + '</td><td><span id="batch-timezone">' + batchEsc(bt.batchTimezone) + '</span></td></tr>';
		if (b === batches.length - 1) {
			lastEnd = bt.endDate || bt.endTime;
			lastStart = bt.startDate || bt.startTime;
		}
	}
	var batchHidden = batches.length
		? '<input type="hidden" name="batchEndDate" id="batchEndDate" value="' + batchEsc(lastEnd) + '"><input type="hidden" name="batchStartDate" id="batchStartDate" value="' + batchEsc(lastStart) + '"><input type="hidden" name="batchId" id="batchId" value="' + batchEsc(data.batchId) + '">'
		: '';

	return '' +
	'<div class="container-fluid px-2 px-md-3">' +
		'<div class="mb-3 card">' +
			'<div class="card-header"><h5>' + batchEsc(data.pageTitle) + '</h5></div>' +
			'<div class="card-body"><div class="row">' +
				infoTiles +
				'<div class="col-lg-12 col-xl-12"><div class="card mb-2 widget-content card-btm-border border-secondary p-2"><div class="widget-content-wrapper"><div class="widget-content-left">' +
					'<div class="widget-heading text-secondary fsize-1">Subject List' +
						'<div class="d-inline-block pull-right">' +
							'<span class="d-inline-block ml-2 mr-2"><label class="d-inline-block p-1 border-secondary border bg-secondary mb-0 mt-2"></label><label class="d-inline-block font-weight-normal">Synced with LMS</label></span>' +
							'<span class="d-inline-block ml-2"><label class="d-inline-block p-1 border-secondary opacity-2 border bg-secondary mb-0 mt-2"></label><label class="d-inline-block font-weight-normal">Not Synced with LMS</label></span>' +
						'</div>' +
					'</div>' +
					'<div class="widget-subheading opacity-10  fsize-1"><ul class="d-flex flex-wrap p-0 mb-0 w-100">' + subjectItems + '</ul></div>' +
				'</div><div class="widget-content-right"><div class="widget-numbers text-secondary"><span><i class="pe-7s-notebook"></i></span></div></div></div></div></div>' +
				'<div class="col-lg-12 col-xl-12"><div class="card mb-2 widget-content card-btm-border border-secondary p-2"><div class="widget-content-left full">' +
					'<div class="widget-heading text-secondary fsize-1 mb-2">Batch List</div>' +
					'<table class="table table-bordered dt-responsive dataTable batchTable" style="width:100%">' +
						'<thead><tr><th>Batch Name</th><th>Start Time</th><th>End Time</th><th>Time Zone</th></tr></thead>' +
						'<tbody>' + batchRows + '</tbody>' +
					'</table>' + batchHidden +
				'</div></div></div>' +
			'</div></div>' +
		'</div>' +
		'<input type="hidden" name="roleModuleId" id="roleModuleId" value="' + batchEsc(data.moduleId) + '">' +
		'<input type="hidden" name="weekCount" id="weekCount" value="' + batchEsc(data.dayOfWeekCount) + '">' +
		'<input type="hidden" name="dateCategory" id="dateCategory" value="">' +
		'<input type="hidden" id="timezone" name="timezone" value="' + batchEsc(data.schoolTimeZone) + '">' +
		'<input type="radio" class="form-control" id="meetingCategory" name="meetingCategory" value="1" text="Month" checked="checked" style="display:none">' +
		'<div class="mb-3 card">' +
			'<div class="col-md-12 text-center mt-3"><h3 class="cal-title"><a href="javascript:void(0)" onclick="getBatchMonthDetails(\'' + batchEsc(data.batchId) + '\')" id="monthTitle"></a></h3></div>' +
			'<div class="col-md-12 arrowBtn"><div class="btn-group pull-right" role="group" aria-label="Basic example">' +
				'<a href="javascript:void(0);" id="preVisitMonth" class="btn btn-primary btn-sm" style="background-color: var(--pc);border-color: #3378b7 !important;"><i class="fa fa-angle-left"></i></a>' +
				'<a href="javascript:void(0);" id="nextVisitMonth" class="btn btn-primary btn-sm" style="background-color: var(--pc);border-color: #3378b7 !important;"><i class="fa fa-angle-right"></i></a>' +
			'</div></div>' +
			'<div class="col-md-12 table-responsive text-center" id="calendarWeek"></div>' +
		'</div>' +
	'</div>';
}

// Wraps the fetched report fragment with a Back button that returns to the main content.
function getBatchDetailsWrapper(innerHtml) {
	return '<div class="full my-2 d-flex justify-content-end">' +
		'<a href="javascript:void(0)" onclick="showAndHideDashboardAndAdditionalContent(\'main\')" class="btn btn-dark rounded">' +
			'<i class="fa fa-arrow-left mr-1" aria-hidden="true"></i>Back' +
		'</a>' +
	'</div>' +
	'<div class="full">' + innerHtml + '</div>';
}

function callBatchModal() {
	$("#addBatchModal").modal({ backdrop: 'static', keyboard: false });
	$("#batchForm #batchCategory").val('EXTRA_CLASS_BATCH');
	$("#batchForm #batchCategory").trigger('change');
	$("#batchForm #gradeDiv").hide();
	$("#batchForm #sessionMaster").val($('#sessionMaster').val());
	$("#batchForm #sessionId").val($('#sessionId').val());
	$("#batchForm #callFrom").val('ManageBatch');
}

// Add Classroom modal wiring — from AddBatchStudent.jsp's inline script.
var startDate = new Date();
function refreshBatchSelect2FieldState(selectField) {
	var field = $(selectField);
	var value = field.val();
	if ($.isArray(value)) {
		value = value.join('');
	}
	value = value == undefined || value == null ? '' : value.toString().trim();
	var customField = field.closest('.custom-field');
	var hasValue = false;
	customField.find('input:not([type="hidden"]), select, textarea').each(function () {
		var fieldValue = $(this).val();
		if ($.isArray(fieldValue)) {
			fieldValue = fieldValue.join('');
		}
		fieldValue = fieldValue == undefined || fieldValue == null ? '' : fieldValue.toString().trim();
		if (fieldValue !== '' && fieldValue !== '0') {
			hasValue = true;
			return false;
		}
	});
	var rendered = field.next('.select2-container').find('.select2-selection__rendered');
	var label = customField.find('label:not(.error-msg)').first();
	customField.toggleClass('active has-value', hasValue);
	rendered.css('color', hasValue ? '' : 'transparent');
	label.css('left', '16px');
	if (typeof refreshCustomFieldState === 'function') {
		refreshCustomFieldState(customField);
	}
}

function initBatchFormSelect2() {
	if (typeof $.fn.select2 !== 'function') {
		return;
	}
	var parent = $('#addBatchModal .modal-body');
	$('#batchForm select').each(function () {
		var selectField = $(this);
		if (selectField.data('select2')) {
			selectField.select2('destroy');
		}
		selectField.select2({
			theme: 'bootstrap4',
			dropdownParent: parent
		});
		selectField.next('.select2-container').css({
			'width': '100%',
			'min-height': '44px',
			'position': 'relative',
			'z-index': '1'
		}).find('.select2-selection--single').css({
			'height': '44px',
			'min-height': '44px',
			'padding': '0',
			'display': 'flex',
			'align-items': 'center'
		}).find('.select2-selection__rendered').each(function () {
			this.style.setProperty('height', '42px');
			this.style.setProperty('line-height', '42px', 'important');
			this.style.setProperty('padding-top', '0');
			this.style.setProperty('padding-bottom', '0');
		});
		refreshBatchSelect2FieldState(selectField);
		selectField.on('change select2:select select2:clear', function () {
			refreshBatchSelect2FieldState(this);
		});
	});
	if (typeof refreshCustomFieldState === 'function') {
		refreshCustomFieldState($('#batchForm'));
	}
}

function getTimeFrom(fromStart) {
	var html = '<option value=""></option>';
	for (var i = (parseInt(fromStart) + 1); i <= 23; i++) {
		if (i > 9) {
			html += '<option value="' + i + '">' + i + '</option>';
		} else {
			html += '<option value="0' + i + '">0' + i + '</option>';
		}
	}
}

function changeCategory() {
	if ($('#batchCategory').val() == 'MAIN_BATCH') {
		$("#batchForm #gradeDiv").show();
	} else {
		$("#batchForm #gradeDiv").hide();
	}
	if (typeof refreshCustomFieldState === 'function') {
		refreshCustomFieldState($('#batchForm'));
	}
}

function setStandardId(standardId) {
	$("#batchForm #standardId").val(standardId);
}

// Initialise the Add Classroom modal's datepickers/select2 after it is injected.
function initBatchAddModal() {
	startDate = new Date();
	$('#batchStartDate').datepicker({
		autoclose: true,
		format: 'mm-dd-yyyy',
		startDate: startDate,
	}).on('changeDate change', function () {
		if (typeof refreshCustomFieldState === 'function') {
			refreshCustomFieldState($('#batchForm'));
		}
	});
	$('#batchEndDate').datepicker({
		autoclose: true,
		format: 'mm-dd-yyyy',
		startDate: startDate,
	}).on('changeDate change', function () {
		if (typeof refreshCustomFieldState === 'function') {
			refreshCustomFieldState($('#batchForm'));
		}
	});
	$("#batchHolidayDate").datepicker({
		format: 'mm-dd-yyyy',
		startDate: startDate,
		multidate: true,
	}).on('changeDate change', function () {
		if (typeof refreshCustomFieldState === 'function') {
			refreshCustomFieldState($('#batchForm'));
		}
	});
	if (typeof refreshCustomFieldState === 'function') {
		refreshCustomFieldState($('#batchForm'));
	}
	initBatchFormSelect2();
}

// Enable/disable-registration confirm flow — from DashboardManageBatchStudent.jsp.
var regEntityId = null;
var regNextValue = "N";
var regFlag = null;

function handleRegistrationAction(id, flag) {
	const actionEl = $("#registrationAction_" + id);
	const isEnabled = actionEl.data("enabled") === "Y";

	regEntityId = id;
	regNextValue = isEnabled ? "N" : "Y";
	regFlag = flag;

	if (!$("#registrationConfirmModal").length) {
		$("body").append(registrationConfirmModal());
	}

	const msg = isEnabled
		? "Do you want to disable registration?"
		: "Do you want to enable registration?";

	$("#registrationConfirmMsg").text(msg);
	$("#registrationConfirmModal").modal("show");
}

function registrationConfirmModal() {
	return `
  <div class="modal fade" id="registrationConfirmModal" tabindex="-1">
    <div class="modal-dialog modal-sm modal-dialog-centered">
      <div class="modal-content">

        <div class="modal-header bg-primary text-white">
          <h5 class="modal-title">Confirm</h5>
          <button type="button" class="close text-white" data-dismiss="modal">
            <span>&times;</span>
          </button>
        </div>

        <div class="modal-body text-center">
          <p id="registrationConfirmMsg"></p>
        </div>

        <div class="modal-footer justify-content-center">
          <button class="btn btn-secondary" data-dismiss="modal">No</button>
          <button class="btn btn-primary" id="confirmRegistrationBtn">Yes</button>
        </div>

      </div>
    </div>
  </div>`;
}

function setRegistrationText(batchId) {
	const el = document.getElementById("registrationAction_" + batchId);
	if (!el) return;

	const enabled = el.dataset.enabled === "Y";

	el.querySelector(".reg-text").innerText =
		enabled ? "Disable Registration" : "Enable Registration";
}

// Bind the delegated registration handlers once per page lifetime.
function bindBatchRegistrationHandlers() {
	if (__batchRegHandlersBound) {
		return;
	}
	__batchRegHandlersBound = true;

	$(document).on("click", "#confirmRegistrationBtn", function () {
		const btn = $(this);
		btn.prop("disabled", true);

		$.ajax({
			url: getURLForHTML('dashboard', 'api/update-registration'),
			type: "POST",
			contentType: "application/json",
			data: JSON.stringify({
				id: regEntityId,
				enableRegistration: regNextValue,
				extraActivityFlag: regFlag
			}),
			success: function () {
				showMessage(false, "Updated successfully");

				const newValue = regNextValue === "Y";

				$("#registrationStatus_" + regEntityId)
					.text(newValue ? "Enabled" : "Disabled");

				const actionEl = $("#registrationAction_" + regEntityId);
				actionEl
					.data("enabled", regNextValue)
					.attr("data-enabled", regNextValue);

				setRegistrationText(regEntityId);
				$("#registrationConfirmModal").modal("hide");
			},
			error: function () {
				showMessage(true, "Something went wrong");
			},
			complete: function () {
				btn.prop("disabled", false);
			}
		});
	});

	$(document).on("shown.bs.dropdown", ".dropdown", function () {
		const actionEl = $(this).find("[id^='registrationAction_']")[0];
		if (!actionEl) return;

		const batchId = actionEl.id.replace("registrationAction_", "");
		setRegistrationText(batchId);
	});
}
