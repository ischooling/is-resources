/*
 * Manage User List — Parent tab (JS-rendered).
 * Filter form + pager-driven chunked DataTable, mirroring the Student tab:
 * count via /advance-parent-search-meta, rows as parallel 25-row chunks via
 * /advance-parent-search-data (muChunkedDataTable in ManageUserListContent.js).
 */

function getManageUserParentTabContent(meta) {
	var timeZoneFields =
		'<div class="col-md-3 col-sm-6 col-12 custom-field">' +
			'<select name="parentCountryTimezoneFromId" id="parentCountryTimezoneFromId" class="form-control">' + muTeacherTimeZoneOptions(meta.timeZoneList) + '</select>' +
			'<label>TimeZone From</label>' +
		'</div>' +
		'<div class="col-md-3 col-sm-6 col-12 custom-field">' +
			'<select name="parentCountryTimezoneToId" id="parentCountryTimezoneToId" class="form-control">' + muTeacherTimeZoneOptions(meta.timeZoneList) + '</select>' +
			'<label>TimeZone To</label>' +
		'</div>';

	return '' +
	'<div class="row">' +
		'<div class="col-md-12 mb-3">' +
			'<div class="filter-wrapper">' +
				'<div class="full text-right">' +
					'<button class="btn btn-sm btn-primary float-right show-filter"><i class="fa fa-filter"></i>&nbsp;Filter</button>' +
				'</div>' +
				'<form name="parentFilter" id="parentFilter" class="custom-field-scope mu-filter" action="javascript:void(0)">' +
					'<input type="hidden" name="userClickFrom" id="userClickFrom" value="list" />' +
					'<div class="filter-fields rounded">' +
						'<div class="row px-3">' +
							'<div class="col-md-3 col-sm-6 col-12 custom-field">' +
								'<input type="text" name="parentName" style="text-transform:capitalize" id="parentName" class="form-control" value="" placeholder="Parent Name" maxlength="60" onkeydown="return M.isChars(event);" />' +
								'<label>Parent Name</label>' +
							'</div>' +
							'<div class="col-md-3 col-sm-6 col-12 custom-field">' +
								'<input type="text" name="emailId" id="emailId" class="form-control" value="" placeholder="Email" maxlength="60" onkeydown="return M.isEmail(event);" />' +
								'<label>Email</label>' +
							'</div>' +
							'<div class="col-md-3 col-sm-6 col-12 custom-field">' +
								'<input type="text" name="mobileNo" id="mobileNo" class="form-control" value="" placeholder="Contact no" />' +
								'<label>Contact no</label>' +
							'</div>' +
							'<div class="col-md-3 col-sm-6 col-12 custom-field">' +
								'<select name="parentCountryId" id="parentCountryId" class="form-control">' + muCountryOptions(meta.countryList) + '</select>' +
								'<label>Country</label>' +
							'</div>' +
							'<div class="col-md-3 col-sm-6 col-12 custom-field">' +
								'<select name="parentFilterStateId" id="parentFilterStateId" class="form-control"><option value="">Select State</option></select>' +
								'<label>State</label>' +
							'</div>' +
							'<div class="col-md-3 col-sm-6 col-12 custom-field">' +
								'<select name="parentFilterCityId" id="parentFilterCityId" class="form-control"><option value="">Select City</option></select>' +
								'<label>City</label>' +
							'</div>' +
							timeZoneFields +
							'<div class="col-md-12 col-sm-12 col-12 mt-2 text-right">' +
								'<button class="btn btn-danger mr-2" onclick="advanceParentSearchReset(\'parentFilter\')"><i class="fa fa-undo"></i>&nbsp;Reset</button>' +
								'<button class="btn btn-success" onclick="advanceParentSearchChunked(\'parentFilter\',\'' + meta.moduleId + '\');"><i class="fa fa-search"></i>&nbsp;Search</button>' +
							'</div>' +
						'</div>' +
					'</div>' +
				'</form>' +
			'</div>' +
		'</div>' +
	'</div>' +
	'<table id="manageProfileParentContent" class="table table-bordered table-striped border-radius-table font-12 responsive nowrap" style="width:100%; display:none;"></table><br/>';
}

function initManageUserParentTab(meta) {
	$('#parentFilter select').select2({ theme: "bootstrap4", width: "100%" });
	if (typeof refreshCustomFieldState === "function") {
		refreshCustomFieldState($("#parentFilter"));
	}
	$('#parentFilter input, #parentFilter select').on('input change blur select2:select select2:clear', function () {
		if (typeof refreshCustomFieldState === "function") {
			refreshCustomFieldState($("#parentFilter"));
		}
	});
	$('#parentFilter #parentCountryId').on('change', function () {
		callStatesNew("parentFilter", this.value, 'parentCountryId', "parentFilterStateId");
	});
	$('#parentFilter #parentFilterStateId').on('change', function () {
		callCitiesNew('parentFilter', this.value, 'parentFilterStateId', 'parentFilterCityId');
	});
}

// <thead> for the parent search table.
function buildParentSearchTableHead() {
	return '<thead><tr class="bg-primary text-white">' +
		'<th>S.No.</th>' +
		'<th>Parent Name</th>' +
		'<th>Email / User Name</th>' +
		'<th>Student Details</th>' +
		'<th>Profile Status</th>' +
		'<th>Action</th>' +
	'</tr></thead>';
}

// Cell array from a ManageProfileParentDTO. sno from the server is ignored;
// the shared adapter passes an absolute index so numbering stays continuous.
function buildParentSearchRowCells(p, absoluteIndex) {
	var email = muNv(p.emailId);
	var userName = muNv(p.userName);
	var emailCell = (userName && userName !== email) ? (email + '<br/>' + userName) : email;
	return [
		String(absoluteIndex + 1),
		muNv(p.name),
		emailCell,
		muNv(p.studentProfile) === '' ? 'N/A' : p.studentProfile,
		muNv(p.profileStatus),
		muNv(p.action)
	];
}

// Builds the encrypted-free request the parent search endpoints expect.
function getCallRequestForAdvanceParentSearch(formId, moduleId) {
	var dto = {
		moduleId: moduleId,
		userClickFrom: $("#" + formId + " #userClickFrom").val(),
		parentName: $("#" + formId + " #parentName").val(),
		email: $("#" + formId + " #emailId").val(),
		contactNo: $("#" + formId + " #mobileNo").val(),
		timZoneFrom: $("#" + formId + " #parentCountryTimezoneFromId option:selected").attr("data-timezone"),
		timZoneTo: $("#" + formId + " #parentCountryTimezoneToId option:selected").attr("data-timezone")
	};
	// Only send numeric location filters when actually chosen (empty string
	// would fail Integer deserialization on the DTO).
	var countryId = $("#" + formId + " #parentCountryId").val();
	var stateId = $("#" + formId + " #parentFilterStateId").val();
	var cityId = $("#" + formId + " #parentFilterCityId").val();
	if (countryId) { dto.countryId = countryId; }
	if (stateId) { dto.stateId = stateId; }
	if (cityId) { dto.cityId = cityId; }

	return {
		moduleId: moduleId,
		parentDetailDTO: dto,
		authentication: {
			hash: getHash(),
			userType: "SCHOOL",
			schoolId: SCHOOL_ID,
			schoolUUID: SCHOOL_UUID,
			userId: USER_ID
		}
	};
}

function advParentSearchAjax(requestObj, asMeta) {
	return $.ajax({
		type: "POST",
		contentType: APPLICATION_JSON_VALUE,
		url: getURLForHTML("dashboard", asMeta ? "advance-parent-search-meta" : "advance-parent-search-data"),
		data: JSON.stringify(requestObj),
		dataType: "json",
		global: false,
		async: true
	});
}

// Parent search driven by the DataTables pager (same pipeline as Student/Teacher).
function advanceParentSearchChunked(formId, moduleId) {
	checkTextBox(formId);
	hideMessage("");
	var baseRequest = getCallRequestForAdvanceParentSearch(formId, moduleId);

	function buildChunkRequest(offset, size) {
		var req = JSON.parse(JSON.stringify(baseRequest));
		req.parentDetailDTO.page = offset;   // raw LIMIT offset
		req.parentDetailDTO.pageSize = size;
		return req;
	}

	muChunkedDataTable({
		tableId: 'manageProfileParentContent',
		headHtml: buildParentSearchTableHead(),
		fetchCount: async function () {
			var meta = await advParentSearchAjax(baseRequest, true).catch(function () { return null; });
			return (meta && meta.status == "1" && meta.totalRows != null) ? parseInt(meta.totalRows, 10) : null;
		},
		fetchChunk: async function (offset, size) {
			var resp = await advParentSearchAjax(buildChunkRequest(offset, size), false).catch(function () { return null; });
			if (resp && resp.status == "3") {
				redirectLoginPage();
				return null;
			}
			return (resp && resp.status == "1") ? (resp.data || []) : null;
		},
		rowToCells: function (parent, absoluteIndex) {
			return buildParentSearchRowCells(parent, absoluteIndex);
		}
	});
	return false;
}

function advanceParentSearchReset(formId) {
	$("#" + formId)[0].reset();
	$("#" + formId + " #parentName").val("");
	$("#" + formId + " #emailId").val("");
	$("#" + formId + " #mobileNo").val("");
	$("#" + formId + " #parentCountryId").val("").trigger("change");
	$("#" + formId + " #parentFilterStateId").val("").trigger("change");
	$("#" + formId + " #parentFilterCityId").val("").trigger("change");
	$("#" + formId + " #parentCountryTimezoneFromId").val("").trigger("change");
	$("#" + formId + " #parentCountryTimezoneToId").val("").trigger("change");
}
