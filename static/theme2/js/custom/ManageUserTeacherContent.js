/*
 * Manage User List — Teacher tab (JS-rendered).
 * Replaces WEB-INF/views/theme2/dashboard/ManageProfileTeacherContent.jsp.
 * Search results load as parallel 25-row chunks (same practice as the student
 * advance search / Lead List): one count call to /advance-teacher-search-meta,
 * then bounded-concurrency chunk calls to /advance-teacher-search.
 */

function muTeacherTimeZoneOptions(timeZoneList) {
	var html = '<option value="">Select Time Zone</option>';
	(timeZoneList || []).forEach(function (tz) {
		html += '<option value="' + tz.key + '" data-timezone="' + (tz.extra4 || '') + '">(' + (tz.extra || '') + ') - ' + tz.value + '</option>';
	});
	return html;
}

function muCountryOptions(countryList) {
	var html = '<option value="">Select Country</option>';
	(countryList || []).forEach(function (c) {
		html += '<option value="' + c.key + '">' + c.value + '</option>';
	});
	return html;
}

function getManageUserTeacherTabContent(meta) {
	var timeZoneFields = '';
	if (String(meta.schoolId) !== '5') {
		timeZoneFields =
			'<div class="col-md-4 col-sm-6 col-12 custom-field">' +
				'<select name="teacherCountryTimezoneFromId" id="teacherCountryTimezoneFromId" class="form-control">' + muTeacherTimeZoneOptions(meta.timeZoneList) + '</select>' +
				'<label>TimeZone From</label>' +
			'</div>' +
			'<div class="col-md-4 col-sm-6 col-12 custom-field">' +
				'<select name="teacherCountryTimezoneToId" id="teacherCountryTimezoneToId" class="form-control">' + muTeacherTimeZoneOptions(meta.timeZoneList) + '</select>' +
				'<label>TimeZone To</label>' +
			'</div>';
	}
	return '' +
	'<div class="row">' +
		'<div class="col-md-12 mb-3">' +
			'<div class="filter-wrapper">' +
				'<div class="full text-right">' +
					'<button class="btn btn-sm btn-primary float-right show-filter"><i class="fa fa-filter"></i>&nbsp;Filter</button>' +
				'</div>' +
				'<form name="teacherFilter" id="teacherFilter" class="custom-field-scope mu-filter" action="javascript:void(0)">' +
					'<input type="hidden" name="userClickFrom" id="userClickFrom" value="list" />' +
					'<div class="filter-fields rounded">' +
						'<div class="row px-3">' +
							'<div class="col-md-4 col-sm-6 col-12 custom-field">' +
								'<select name="filterEnrollStatus" id="teacherFilterEnrollStatus" class="form-control">' +
									'<option value="">Select Profile Status</option>' +
									'<option value="0">On Boarded</option>' +
									'<option value="1">Withdrawn</option>' +
									'<option value="2">Partial entry</option>' +
									'<option value="3">Under Training</option>' +
									'<option value="4">On Hold</option>' +
								'</select>' +
								'<label>Profile Status</label>' +
							'</div>' +
							timeZoneFields +
							'<div class="col-md-4 col-sm-6 col-12 custom-field">' +
								'<input type="text" name="teacherName" style="text-transform:capitalize" id="teacherName" class="form-control" value="" placeholder="Teacher Name" maxlength="40" onkeydown="return M.isChars(event);">' +
								'<label>Teacher Name</label>' +
							'</div>' +
							'<div class="col-md-4 col-sm-6 col-12 custom-field">' +
								'<input type="text" name="applicationNo" style="text-transform:capitalize" id="applicationNo" class="form-control" value="" placeholder="Application No" maxlength="40" >' +
								'<label>Application No</label>' +
							'</div>' +
							'<div class="col-md-4 col-sm-6 col-12 custom-field">' +
								'<input type="text" name="emailId" id="emailId" class="form-control" value="" placeholder="Email" maxlength="60" onkeydown="return M.isEmail(event);" />' +
								'<label>Email</label>' +
							'</div>' +
							'<div class="col-md-4 col-sm-6 col-12 custom-field">' +
								'<input type="text" name="mobileNo" style="text-transform:capitalize" id="mobileNo" class="form-control" value="" placeholder="Contact no"  />' +
								'<label>Contact no</label>' +
							'</div>' +
							'<div class="col-md-4 col-sm-6 col-12 custom-field">' +
								'<select name="teacherCountryId" id="teacherCountryId" class="form-control">' + muCountryOptions(meta.countryList) + '</select>' +
								'<label>Country</label>' +
							'</div>' +
							'<div class="col-md-4 col-sm-6 col-12 custom-field">' +
								'<select name="teacherFilterStateId" id="teacherFilterStateId" class="form-control"><option value="">Select State</option></select>' +
								'<label>State</label>' +
							'</div>' +
							'<div class="col-md-4 col-sm-6 col-12 custom-field">' +
								'<select name="teacherFilterCityId" id="teacherFilterCityId" class="form-control"><option value="">Select City</option></select>' +
								'<label>City</label>' +
							'</div>' +
							'<div class="col-md-4 col-sm-6 col-12 custom-field">' +
								'<select name="filterEmployeeType" id="filterEmployeeType" class="form-control">' +
									'<option value="">Select Employee Type</option>' +
									'<option value="0">Full Time</option>' +
									'<option value="1">Part Time</option>' +
									'<option value="2">Not Available</option>' +
								'</select>' +
								'<label>Employee Type</label>' +
							'</div>' +
							'<div class="col-md-12 col-sm-12 col-12 mt-2 text-right">' +
								'<button class="btn btn-danger  mr-2" onclick="advanceTeacherSearchReset(\'teacherFilter\')"><i class="fa fa-undo"></i>&nbsp;Reset</button>' +
								'<button class="btn btn-success " onclick="advanceTeacherSearchChunked(\'teacherFilter\',\'' + meta.moduleId + '\');"><i class="fa fa-search"></i>&nbsp;Search</button>' +
							'</div>' +
						'</div>' +
					'</div>' +
				'</form>' +
			'</div>' +
		'</div>' +
	'</div>' +
	'<table id="manageProfileTeacherContent" class="table table-bordered table-striped border-radius-table font-12 responsive nowrap" style="width:100%; display: none;">' +
		'<thead>' +
			'<tr class="bg-primary text-white">' +
				'<th class="font-weight-normal border-bottom-0 vertical-align-middle rounded-top-left-10">S.No.</th>' +
				'<th class="font-weight-normal border-bottom-0 vertical-align-middle">Teacher Details</th>' +
				'<th class="font-weight-normal border-bottom-0 vertical-align-middle">Employee Type</th>' +
				'<th class="font-weight-normal border-bottom-0 vertical-align-middle">Assigned Courses</th>' +
				'<th class="font-weight-normal border-bottom-0 vertical-align-middle">Specialization</th>' +
				'<th class="font-weight-normal border-bottom-0 vertical-align-middle">Profile Status</th>' +
				'<th class="font-weight-normal border-bottom-0 vertical-align-middle">Agreement</th>' +
				'<th class="font-weight-normal border-bottom-0 vertical-align-middle rounded-top-right-10">Action</th>' +
			'</tr>' +
		'</thead>' +
		'<tbody></tbody>' +
	'</table><br/>' +
	'<div class="modal fade " id="teacherAgreementModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel1">' +
		'<div class="modal-dialog modal-xl" role="document">' +
			'<div class="modal-content">' +
				'<div class="modal-header py-2 bg-primary text-white">' +
					'<h5 class="modal-title">Teacher Agreement</h5>' +
					'<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
				'</div>' +
				'<div class="modal-body" style="max-height:500px;overflow:auto;">' +
					'<section id="section-linebox" class="text-left"></section>' +
				'</div>' +
			'</div>' +
		'</div>' +
	'</div>' +
	'<div class="modal fade " id="teacherAssignSubjectModal" tabindex="-1" role="dialog" aria-labelledby="teacherAssignModalLabel1">' +
		'<div class="modal-dialog modal-lg" role="document">' +
			'<div class="modal-content">' +
				'<div class="modal-header py-2 bg-primary text-white">' +
					'<h5 class="modal-title">Teacher Subject</h5>' +
					'<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
				'</div>' +
				'<div class="modal-body" id="assignSubjectToTeacher"></div>' +
			'</div>' +
		'</div>' +
	'</div>';
}

function initManageUserTeacherTab(meta) {
	$('#teacherFilter select').select2({
		theme: "bootstrap4",
		width: "100%",
	});
	if (typeof refreshCustomFieldState === "function") {
		refreshCustomFieldState($("#teacherFilter"));
	}
	$('#teacherFilter input, #teacherFilter select').on('input change blur select2:select select2:clear', function () {
		if (typeof refreshCustomFieldState === "function") {
			refreshCustomFieldState($("#teacherFilter"));
		}
	});
	$('#teacherFilter #teacherCountryId').on('change', function () {
		callStatesNew("teacherFilter", this.value, 'teacherCountryId', "teacherFilterStateId");
	});
	$("#teacherFilter #teacherFilterStateId").on("change", function () {
		callCitiesNew('teacherFilter', this.value, 'teacherFilterStateId', 'teacherFilterCityId');
	});
}

// Cell array for a teacher search result — feeds the shared muChunkedDataTable.
// rowIndex is the ABSOLUTE index across all pages so S.No. stays continuous.
function buildTeacherSearchRowCells(value, rowIndex, formId, moduleId) {
	return [
		(rowIndex + 1) + '.',
		''
		+ value.applicationNo + '<br/>'
		+ value.name + '<br/>'
		+ value.emailId + '<br/>'
		+ value.contactNo + '<br/>'
		+ value.cityName + '/ ' + value.stateName + '/ ' + value.countryName + '<br/>'
		+ value.timeZone + ' ' + value.timeOffSet + '<br/>',
		value.employeeType,
		(value.assignCourseList > 0
			? '<a href="javascript:void(0);" onclick="return getTeacherSubjectList(' + value.userId + ');"><i class="fa fa-eye"></i></a>'
			: "N/A"),
		(value.specialization === "N/A"
			? "N/A"
			: value.specialization.split(',')
				.map(function (s) { return s.trim(); })
				.filter(function (s) { return s.length > 0; })
				.join('<br>')),
		value.profileStatus,
		(value.agreementUrlDownload === "N/A" && value.agreementUrlView === "N/A"
			? 'N/A'
			: (value.agreementUrlDownload !== "N/A"
				? '<a href="' + value.agreementUrlDownload + '" target="_blank"><i class="fa fa-download"></i></a>'
				: '')
			+ (value.agreementUrlDownload !== "N/A" && value.agreementUrlView !== "N/A" ? ' | ' : '')
			+ (value.agreementUrlView !== "N/A"
				? '<a href="' + value.agreementUrlView + '" target="_blank"><i class="fa fa-eye"></i></a>'
				: '')),
		''
		+ '<div class="btn-group">'
		+ '<button type="button" class="btn btn-primary  dropdown-toggle  btn-sm" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" title="Action"><i class="fa fa-ellipsis-v"></i></button>'
		+ '<div class="dropdown-menu" x-placement="bottom-start">'
		+ '<a href="' + value.profileView + '" target="_blank" class="dropdown-item"><i class="fa fa-eye"></i>&nbsp;View Profile</a>'
		+ '<a href="javascript:void(0);" class="dropdown-item" onclick="return callUserActivity(\'' + formId + '\',\'' + value.userId + '\',\'true\',\'true\',' + moduleId + ');"><i class="fa fa-cogs"></i>&nbsp;&nbsp;User Activity</a>'
		+ (value.batchReport === "N/A"
			? ""
			: '<a href="' + value.batchReport + '" target="_blank" class="dropdown-item"><i class="fa fa-eye"></i>&nbsp;View Batches</a>')
		+ (value.sendMail === "1" || value.sendMail === "false"
			? ""
			: '<a href="javascript:void(0);" class="dropdown-item" onclick="return sendEmailForCommon(' + value.userId + ');"><i class="fa fa-envelope"></i>&nbsp;&nbsp;Send Email</a>')
		+ '<a href="' + value.userLogUrl + '" target="_blank" class="dropdown-item"><i class="fa fa-eye"></i>&nbsp;Teacher Logs</a>'
		+ (value.spoofLink === "Y"
			? '<a href="javascript:void(0);" class="dropdown-item" onclick="return openSpoofUrlModal(\'U\',\'' + value.userId + '\',\'' + (value.name || '').replace(/'/g, "\\'") + '\',\'teacher\');"><i class="fa fa-eye"></i>&nbsp;View as Teacher</a>'
			: '')
		+ (value.meetingCount <= 0
			? ""
			: '<a href="javascript:void(0);" class="dropdown-item" onclick="showWarningMessageShow(\'Are you sure you want to re-attempt recordings?\', \'enableReattemptRecording(' + value.userId + ')\');"><i class="fa fa-cogs"></i>&nbsp;&nbsp;Flush Recording</a>')
		+ '</div>'
		+ '</div>'
	];
}

// <thead> for the teacher search table (same 8 columns as the static markup).
function buildTeacherSearchTableHead() {
	return '<thead><tr class="bg-primary text-white">' +
		'<th class="font-weight-normal border-bottom-0 vertical-align-middle rounded-top-left-10">S.No.</th>' +
		'<th class="font-weight-normal border-bottom-0 vertical-align-middle">Teacher Details</th>' +
		'<th class="font-weight-normal border-bottom-0 vertical-align-middle">Employee Type</th>' +
		'<th class="font-weight-normal border-bottom-0 vertical-align-middle">Assigned Courses</th>' +
		'<th class="font-weight-normal border-bottom-0 vertical-align-middle">Specialization</th>' +
		'<th class="font-weight-normal border-bottom-0 vertical-align-middle">Profile Status</th>' +
		'<th class="font-weight-normal border-bottom-0 vertical-align-middle">Agreement</th>' +
		'<th class="font-weight-normal border-bottom-0 vertical-align-middle rounded-top-right-10">Action</th>' +
	'</tr></thead>';
}

function advTeacherSearchAjax(requestObj, asMeta) {
	var url = asMeta ? ("advance-teacher-search-meta/" + UNIQUEUUID) : ("advance-teacher-search/" + UNIQUEUUID);
	return $.ajax({
		type: "POST",
		contentType: APPLICATION_JSON_VALUE,
		url: getURLForHTML("dashboard", url),
		data: JSON.stringify(requestObj),
		dataType: "json",
		global: false,
		async: true,
	});
}

// Teacher search driven by the DataTables pager (same pipeline as the Student
// tab): each page draw fetches only the visible page as parallel 25-row chunks
// via muChunkedDataTable; count from /advance-teacher-search-meta.
function advanceTeacherSearchChunked(formId, moduleId) {
	checkTextBox(formId);
	hideMessage("");
	var baseRequest = getCallRequestForadvanceTeacherSearch(formId, moduleId);

	function buildChunkRequest(offset, size) {
		var req = JSON.parse(JSON.stringify(baseRequest));
		// Backend uses page as the raw LIMIT offset.
		req.teacherDetailsDTO.page = offset;
		req.teacherDetailsDTO.pageSize = size;
		return req;
	}

	muChunkedDataTable({
		tableId: 'manageProfileTeacherContent',
		headHtml: buildTeacherSearchTableHead(),
		fetchCount: async function () {
			var meta = await advTeacherSearchAjax(baseRequest, true).catch(function () { return null; });
			return (meta && meta.status == "1" && meta.totalRows != null) ? parseInt(meta.totalRows, 10) : null;
		},
		fetchChunk: async function (offset, size) {
			var resp = await advTeacherSearchAjax(buildChunkRequest(offset, size), false).catch(function () { return null; });
			return (resp && resp.status === "success" && resp.manageProfileTeacher) ? resp.manageProfileTeacher : null;
		},
		rowToCells: function (teacher, absoluteIndex) {
			return buildTeacherSearchRowCells(teacher, absoluteIndex, formId, moduleId);
		}
	});
	return false;
}
