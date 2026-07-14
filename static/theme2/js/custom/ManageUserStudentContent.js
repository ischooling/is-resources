/*
 * Manage User List — Student tab (JS-rendered).
 * Replaces WEB-INF/views/theme2/dashboard/ManageProfileStudentContent.jsp.
 * The Search button uses the chunked advanceStudentSearch() loader from
 * dashboardManageUser.js (count via /advance-student-search-meta, then parallel
 * 25-row chunk requests appended progressively).
 */

function muStudentSessionOptions(sessions) {
	var html = '<option value="0">ALL</option>';
	(sessions || []).forEach(function (s) {
		html += '<option value="' + s.sessionId + '"' + (s.active === 'Y' ? ' selected' : '') + '>' + s.sessionName + '</option>';
	});
	return html;
}

function muStudentEnrollTypeOptions(schoolId) {
	var sid = String(schoolId);
	if (sid === '3' || sid === '4') {
		return '<option value="ONE_TO_ONE">One-to-One Learning</option>';
	}
	if (sid === '5') {
		return '<option value="">Select Enroll Type</option>' +
			'<option value="BATCH">Group Learning</option>' +
			'<option value="ONE_TO_ONE">One-to-One Learning</option>';
	}
	return '<option value="">Select Enroll Type</option>' +
		'<option value="ONE_TO_ONE">One-to-One Learning</option>' +
		'<option value="BATCH">Group Learning</option>' +
		'<option value="SCHOLARSHIP">Self Study Learning</option>' +
		'<option value="SSP">Self Study Plus</option>' +
		'<option value="ONE_TO_ONE_FLEX">Flexy Learning Program</option>' +
		'<option value="DUAL_DIPLOMA">Dual Diploma</option>';
}

// Builds the grouped Profile Field options (parent rows become <optgroup> when they
// have children — mirrors the JSTL loops in the old JSP).
function muProfileFieldOptions(labels, useCommonName) {
	labels = labels || [];
	var html = '';
	labels.forEach(function (parentField) {
		if (parentField.parentId !== 0) {
			return;
		}
		var children = labels.filter(function (child) { return child.parentId === parentField.id; });
		if (children.length > 0) {
			html += '<optgroup label="' + parentField.labelName + '">';
			children.forEach(function (child) {
				var value = useCommonName ? child.commonName : child.fieldId;
				var text = useCommonName ? child.commonName : child.labelName;
				html += '<option value="' + value + '">' + text + '</option>';
			});
			html += '</optgroup>';
		} else {
			var parentValue = useCommonName
				? (parentField.commonName ? parentField.commonName : parentField.labelName)
				: parentField.fieldId;
			html += '<option value="' + parentValue + '">' + parentField.labelName + '</option>';
		}
	});
	return html;
}

function getManageUserStudentTabContent(meta) {
	var isSchool5 = String(meta.schoolId) === '5';
	var lmsOptions = '<option value="">Select LMS Platform</option>';
	(meta.courseProviderList || []).forEach(function (cp) {
		lmsOptions += '<option value="' + cp.key + '">' + cp.value + '</option>';
	});
	var standardOptions = '<option value="">Select Grade</option>';
	(meta.standardList || []).forEach(function (std) {
		standardOptions += '<option value="' + std.standardId + '">' + std.standardName + '</option>';
	});
	var timeZoneFields = '';
	if (!isSchool5) {
		timeZoneFields =
			'<div class="col-md-3 col-sm-3 col-12 custom-field">' +
				'<select name="countryTimezoneFromId" id="countryTimezoneFromId" class="form-control">' + muTeacherTimeZoneOptions(meta.timeZoneList) + '</select>' +
				'<label>TimeZone From</label>' +
			'</div>' +
			'<div class="col-md-3 col-sm-3 col-12 custom-field">' +
				'<select name="countryTimezoneToId" id="countryTimezoneToId" class="form-control">' + muTeacherTimeZoneOptions(meta.timeZoneList) + '</select>' +
				'<label>TimeZone To</label>' +
			'</div>';
	}
	var addProfileFieldButton = meta.showProfileFieldAddButton
		? '<button class="btn btn-outline-primary " onclick="openDynamicBuilder();"><i class="fa fa-plus"></i>&nbsp;Add Profile Fields</button>'
		: '';

	return '' +
	'<div class="row">' +
		'<div class="col-md-12">' +
			'<div class="filter-wrapper">' +
				'<div class="full text-right">' +
					'<button class="btn btn-sm btn-primary float-right show-filter"><i class="fa fa-filter"></i>&nbsp;Filter</button>' +
				'</div>' +
				'<form name="studentFilter" id="studentFilter" class="custom-field-scope mu-filter" action="javascript:void(0)">' +
					'<input type="hidden" name="userClickFrom" id="userClickFrom" value="list" />' +
					'<div class="filter-fields rounded">' +
						'<div class="row px-3">' +
							'<div class="col-md-3 col-sm-3 col-12 custom-field">' +
								'<select name="activeSession" id="activeSession" class="form-control">' + muStudentSessionOptions(meta.sessions) + '</select>' +
								'<label>Academic Year</label>' +
							'</div>' +
							'<div class="col-md-3 col-sm-3 col-12 custom-field">' +
								'<select name="filterLmsPlatform" id="filterLmsPlatform" class="form-control">' + lmsOptions + '</select>' +
								'<label>Select LMS Platform</label>' +
							'</div>' +
							'<div class="col-md-3 col-sm-3 col-12 custom-field">' +
								'<select name="filterEnrollType" id="filterEnrollType" class="form-control">' + muStudentEnrollTypeOptions(meta.schoolId) + '</select>' +
								'<label>Select Enroll Type</label>' +
							'</div>' +
							'<div class="col-md-3 col-sm-3 col-12 custom-field">' +
								'<select name="filterBookEnrollment" id="filterBookEnrollment" class="form-control">' +
									'<option value="">Select Booked an Enrollment Seat Status</option>' +
									'<option value="Y">Yes</option>' +
									'<option value="E">Expired</option>' +
									'<option value="N">No</option>' +
								'</select>' +
								'<label>Booked an Enrollment Seat?</label>' +
							'</div>' +
							'<div class="col-md-3 col-sm-3 col-12 custom-field">' +
								'<select name="filterEnrollStatus" id="filterEnrollStatus" class="form-control" multiple="multiple">' +
									'<option value="4">Completed-New-Enrollment</option>' +
									'<option value="5">Completed-Re-Enrollment</option>' +
									'<option value="1">Withdrawn</option>' +
									'<option value="2">Partial entry - New enrollment</option>' +
									'<option value="3">Partial entry - Re-enrollment</option>' +
								'</select>' +
								'<label>Enroll Status</label>' +
							'</div>' +
							timeZoneFields +
							'<div class="col-md-3 col-sm-3 col-12 custom-field">' +
								'<select name="filterStandardId" id="filterStandardId" class="form-control">' + standardOptions + '</select>' +
								'<label>Grade</label>' +
							'</div>' +
							'<div class="col-md-3 col-sm-6 col-12 custom-field">' +
								'<input type="text" name="emailId" id="emailId" class="form-control" value="" placeholder="Email" maxlength="40" onkeydown="return M.isEmail(event);" />' +
								'<label>Email</label>' +
							'</div>' +
							'<div class="col-md-3 col-sm-6 col-12 custom-field">' +
								'<input type="text" name="mobileNo" style="text-transform:capitalize" id="mobileNo" class="form-control" value="" placeholder="Contact no" />' +
								'<label>Contact no</label>' +
							'</div>' +
							'<div class="col-md-3 col-sm-6 col-12 custom-field">' +
								'<input type="text" name="studentId" style="text-transform:capitalize" id="studentId" class="form-control" value="" placeholder="Student Id">' +
								'<label>Student Id</label>' +
							'</div>' +
							'<div class="col-md-3 col-sm-6 col-12 custom-field">' +
								'<input type="text" name="studName" style="text-transform:capitalize" id="studName" class="form-control" value="" placeholder="Student Name" maxlength="40" onkeydown="return M.isChars(event);">' +
								'<label>Student Name</label>' +
							'</div>' +
							'<div class="col-md-3 col-sm-3 col-12 custom-field">' +
								'<select name="countryId" id="countryId" class="form-control">' + muCountryOptions(meta.countryList) + '</select>' +
								'<label>Country</label>' +
							'</div>' +
							'<div class="col-md-3 col-sm-3 col-12 custom-field">' +
								'<select name="filterStateId" id="filterStateId" class="form-control"><option value="">Select State</option></select>' +
								'<label>State</label>' +
							'</div>' +
							'<div class="col-md-3 col-sm-3 col-12 custom-field">' +
								'<select name="filterCityId" id="filterCityId" class="form-control"><option value="">Select City</option></select>' +
								'<label>City</label>' +
							'</div>' +
							'<div class="col-md-6 col-sm-12 col-12 custom-field">' +
								'<select id="filterProfileFieldId" class="form-control" multiple="multiple">' + muProfileFieldOptions(meta.moduleFilterLabels, false) + '</select>' +
								'<label>Profile Field</label>' +
							'</div>' +
							'<div class="col-md-3 col-sm-6 col-12 custom-field">' +
								'<select name="filterProfileFieldValue" id="filterProfileFieldValue" class="form-control">' +
									'<option value="Y" selected>Yes</option>' +
									'<option value="N">No</option>' +
								'</select>' +
								'<label>Profile Field Value</label>' +
							'</div>' +
							'<div class="col-md-6 col-sm-12 col-12 mt-2 text-left">' +
								addProfileFieldButton +
								'<button class="btn btn-primary" onclick="profileSetting();"><i class="fa fa-cog"></i>&nbsp;Collect Student Info</button>' +
							'</div>' +
							'<div class="col-md-6 col-sm-12 col-12 mt-2 text-right">' +
								'<button class="btn btn-danger  mr-2" onclick="advanceStudentSearchReset(\'studentFilter\')"><i class="fa fa-undo"></i>&nbsp;Reset</button>' +
								'<button class="btn btn-success " onclick="advanceStudentSearchJson(\'studentFilter\',\'' + meta.moduleId + '\');"><i class="fa fa-search"></i>&nbsp;Search</button>' +
							'</div>' +
						'</div>' +
					'</div>' +
				'</form>' +
			'</div>' +
		'</div>' +
	'</div>' +
	'<div id="manageStudent" class="pt-3">' +
		'<table id="manageProfileStudentContent" class="table table-bordered table-striped border-radius-table font-12 responsive nowrap" style="width:100%"></table><br/>' +
		'<div id="studentSemesterStartDateEntryHTML"></div>' +
	'</div>' +
	'<div class="modal fade bd-example-modal-lg fade-scale" id="updateReferralCodeModal" tabindex="-1" aria-hidden="true">' +
		'<div class="modal-dialog modal-md" role="document">' +
			'<div class="modal-content">' +
				'<div class="modal-header py-2 bg-primary text-white">' +
					'<h5 class="modal-title">Update Referral Code</h5>' +
					'<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
				'</div>' +
				'<div class="modal-body">' +
					'<div class="full">' +
						'<input type="hidden" name="studentStandardId" id="studentStandardId"/>' +
						'<input class="form-control" type="text" name="newReferralCode" id="newReferralCode"/>' +
					'</div>' +
					'<div class="full text-right">' +
						'<a href="javascript:void(0)" class="btn btn-primary mt-1" onclick="saveNewReferralCode();">Update</a>' +
					'</div>' +
				'</div>' +
			'</div>' +
		'</div>' +
	'</div>';
}

// null/undefined → '' (org.json drops null bean properties entirely, so most
// blanks arrive as undefined).
function muNv(value) {
	return value === null || value === undefined ? '' : value;
}

// <thead> for the JSON-rendered student search table (mirrors
// ManageAdvanceSearchStudentContent.jsp).
function buildStudentSearchTableHead(schoolId) {
	return '<thead><tr class="bg-primary text-white">' +
		'<th>S. No.</th>' +
		(String(schoolId) === '5' ? '<th>Group/Semester Date</th>' : '') +
		'<th>Student profile</th>' +
		'<th>Parent Details</th>' +
		'<th>LMS Platform/Learning Program</th>' +
		'<th>Payment Mode</th>' +
		'<th>SMS/LMS Profile status</th>' +
		'<th>Last profile update</th>' +
		'<th>Counselor Name/ Referral Code</th>' +
		'<th>Action</th>' +
	'</tr></thead>';
}

// Cell array from a ManageProfileStudentDTO (mirrors ManageAdvanceSearchStudentRows.jsp,
// non-batch branch) — feeds the shared muChunkedDataTable. rowIndex is ABSOLUTE
// across pages so S.No. stays continuous.
function buildStudentSearchRowCells(student, rowIndex, schoolId) {
	var cells = [String(rowIndex + 1)];
	if (String(schoolId) === '5') {
		cells.push(muNv(student.groupName) !== ''
			? muNv(student.groupName) + '<br/> ' + muNv(student.semStartEnd)
			: 'N/A');
	}
	var emailCell = muNv(student.emailId) === muNv(student.userName)
		? muNv(student.emailId) + '<br/>'
		: muNv(student.emailId) + '<br/>' + muNv(student.userName) + '<br/>';
	cells.push(
		'Student Id: ' + muNv(student.rollNumber) + '<br/>' +
		muNv(student.name) + '<br/>' +
		muNv(student.standard) + '<br/>' +
		emailCell +
		muNv(student.countryCode) + ' ' + muNv(student.mobileNumber) + '<br/>' +
		muNv(student.cityName) + '/ ' + muNv(student.stateName) + '/ ' + muNv(student.countryName) + '<br/>' +
		muNv(student.timeZone) + ' ' + muNv(student.timeOffSet) + ' <b title="Manual" class="text-success">' + muNv(student.timeZoneSavedStatus) + '</b><br/>');
	cells.push('Parent Name: ' + muNv(student.parentName) + '<br/>Email: ' + muNv(student.parentEmail) + '<br/>Contact Number: ' + muNv(student.parentContactNumber) + '<br/>Preferred Communication: ' + muNv(student.parentPreferredCommunications));
	cells.push('LMS Platform: ' + muNv(student.courseProviderName) + '<br/>' + muNv(student.registrationType));
	cells.push(muNv(student.paymentMode));
	cells.push(muNv(student.profileStatus) + '<br>LMS Status: ' + muNv(student.lmsStatus) + '<br/>Admission Status: ' + (muNv(student.admissionStatus) === '' ? 'N/A' : student.admissionStatus));
	cells.push(muNv(student.createDate));
	cells.push(muNv(student.referralCode));
	cells.push(muNv(student.action));
	return cells;
}

function advStudentSearchDataAjax(requestObj) {
	return $.ajax({
		type: "POST",
		contentType: APPLICATION_JSON_VALUE,
		url: getURLForHTML("dashboard", "advance-student-search-data"),
		data: JSON.stringify(requestObj),
		dataType: "json",
		global: false,
		async: true,
	});
}

// Pure-API student search driven by the DataTables pager: on Search, a
// server-side DataTable is (re)created; every page draw fetches only the
// visible page as parallel 25-row chunks (muChunkedDataTable in
// ManageUserListContent.js). Count comes from /advance-student-search-meta.
// The BATCH enroll-type flow (Add Classroom modal) still uses the legacy JSP path.
function advanceStudentSearchJson(formId, moduleId) {
	checkTextBox(formId);
	var baseRequest = getCallRequestForadvanceStudentSearch(formId, moduleId, 'theme2');
	if ((baseRequest.studentDetailDTO.enrollType || '') === 'BATCH') {
		return advanceStudentSearch(formId, moduleId, 'theme2');
	}
	hideMessage("");
	var schoolId = SCHOOL_ID;

	function buildChunkRequest(offset, size) {
		var req = JSON.parse(JSON.stringify(baseRequest));
		// Backend uses page as the raw LIMIT offset.
		req.studentDetailDTO.page = offset;
		req.studentDetailDTO.pageSize = size;
		return req;
	}

	muChunkedDataTable({
		tableId: 'manageProfileStudentContent',
		headHtml: buildStudentSearchTableHead(schoolId),
		fetchCount: async function () {
			var meta = await advStudentSearchAjax(baseRequest, true).catch(function () { return null; });
			return (meta && meta.status == "1" && meta.totalRows != null) ? parseInt(meta.totalRows, 10) : null;
		},
		fetchChunk: async function (offset, size) {
			var resp = await advStudentSearchDataAjax(buildChunkRequest(offset, size)).catch(function () { return null; });
			if (resp && resp.status == "3") {
				redirectLoginPage();
				return null;
			}
			if (resp && resp.status == "1") {
				if (resp.schoolId != null) { schoolId = resp.schoolId; }
				return resp.data || [];
			}
			return null;
		},
		rowToCells: function (student, absoluteIndex) {
			return buildStudentSearchRowCells(student, absoluteIndex, schoolId);
		}
	});
	return false;
}

function initManageUserStudentTab(meta) {
	$('#studentFilter select').not('#filterEnrollStatus, #filterProfileFieldId').select2({ theme: "bootstrap4" });
	$('#studentFilter #filterEnrollStatus').select2({
		theme: "bootstrap4",
		placeholder: "Enroll Status",
		width: "100%",
	});
	$('#studentFilter #filterProfileFieldId').select2({
		theme: "bootstrap4",
		placeholder: "Select Profile Field",
	});
	if (typeof refreshCustomFieldState === "function") {
		refreshCustomFieldState($("#studentFilter"));
	}
	$('#studentFilter select').on('change select2:select select2:clear', function () {
		if (typeof refreshCustomFieldState === "function") {
			refreshCustomFieldState($("#studentFilter"));
		}
	});
	$('#studentFilter #countryId').on('change', function () {
		callStatesNew("studentFilter", this.value, 'countryId', "filterStateId");
	});
	$("#studentFilter #filterStateId").on("change", function () {
		$('#studentFilter #filterStateId').valid();
		callCitiesNew('studentFilter', this.value, 'filterStateId', 'filterCityId');
	});
}
