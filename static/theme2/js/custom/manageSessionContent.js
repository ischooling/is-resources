
function getManageSessionTableHeader(role) {
	var html = ''

	html = '<th>S.No.</th><th>LMS Platform</th><th>Learning Program</th><th>Student Name</th><th>Grade</th><th>Student ID</th>';
	if(isEmailSearchFilterAllowed()){
		html += '<th>Email ID</th>';
	}
	html += '<th>Enroll Status</th>';
	if (SCHOOL_ID == 1) {
		html += '<th>Default Enrollment Status</th>';
	}
	html += '<th>Action</th>';
	return '<thead class="bg-primary text-white"><tr>' + html + '</tr></thead><tbody></tbody>';
}

function getManageSessionTableBody(result, userId, role) {
	var html = '';
	$.each(result, function (k, v) {
		action = '';
		// var zoomCommand = getZoomCommandContent('ZOOM', v.aggrigatorStatus, v.aggregatorId, v.userId, v.userKey, v.groupId);
		// var lensCommand = getZoomCommandContent('LENS', v.lensStatus, v.lensAggregatorId, v.userId, v.lensUserKey, v.lensGroupId);
		html +=
			'<tr id="sessionSubjectStudent' + v.studentId + '">'
			+ '<td>' + v.sno + '</td>'
			+ '<td>' + v.courseProviderName + '</td>'
			+ '<td>' + v.learningProgram + '</td>'
			+ '<td>' + v.studentName + '</td>'
			// + '<td>'
			// + zoomCommand
			// + '</td>'
			+ '<td>' + v.gradeName + '</td>'
			+ '<td>' + v.rollNo + '</td>';
		if(isEmailSearchFilterAllowed()){
			html += '<td>' + (v.emailId || '') + '</td>';
		}
		html += '<td>' + v.enrollStatus + '</td>';
		if (SCHOOL_ID == 1) {
			html += '<td>' + v.defaultEnrollmentStatus + '</td>'
		}
		html += '<td>' + v.action + '</td>'
		'</tr>';
	});
	return html;
}
function getZoomCommandContent(aggrigatorName, aggrigatorStatus, aggregatorId, aggregatorIdUserId, userKey, groupId) {
	
	return aggrigatorName;
}

var MS_LEARNING_PROGRAM_OPTIONS = '';
var MS_PLATFORM_CLS = {
	ONE_TO_ONE: 'one-to-one', BATCH: 'group', SCHOLARSHIP: 'self-study',
	SSP: 'self-study-plus', ONE_TO_ONE_FLEX: 'flexy', DUAL_DIPLOMA: 'dual-diploma'
};

// Row "learningProgram" label -> card class ("One-to-One Learning" -> one-to-one, ...).
function msPlatformClsFromLabel(label) {
	if (MS_PLATFORM_CLS[label]) { return MS_PLATFORM_CLS[label]; }
	var p = String(label || '').toLowerCase();
	if (p.indexOf('flex') !== -1) { return 'flexy'; }
	if (p.indexOf('one') !== -1) { return 'one-to-one'; }
	if (p.indexOf('group') !== -1) { return 'group'; }
	if (p.indexOf('plus') !== -1) { return 'self-study-plus'; }
	if (p.indexOf('self study') !== -1 || p.indexOf('scholarship') !== -1) { return 'self-study'; }
	if (p.indexOf('dual') !== -1) { return 'dual-diploma'; }
	return '';
}

// "Students by Learning Platform" cards under the filter form: hidden until Search, counts start at 0.
function msPlatformSectionHtml(optionsHtml) {
	var cards = '';
	var re = /<option\s+value="([^"]*)"[^>]*>([^<]*)<\/option>/g;
	var m;
	while ((m = re.exec(optionsHtml || '')) !== null) {
		if (!m[1]) { continue; }
		var cls = MS_PLATFORM_CLS[m[1]] || 'default';
		cards += '<div class="mu-platform-card mu-platform-card-' + cls + '" data-enroll-type="' + m[1] + '" data-cls="' + cls + '" onclick="msSelectPlatformCard(this)">'
			+ '<div class="mu-platform-card-icon"><i class="fa fa-user"></i></div>'
			+ '<div>'
				+ '<div class="mu-platform-card-count">0</div>'
				+ '<div class="mu-platform-card-label">' + m[2] + '</div>'
			+ '</div>'
		+ '</div>';
	}
	return '<div class="col-md-12">'
		+ '<div class="mu-platform-section mt-3" id="msPlatformSection" style="display:none;">'
			+ '<div class="mu-platform-section-head">'
				+ '<h6 class="mu-platform-title">Students by Learning Platform</h6>'
				+ '<div class="mu-platform-total">Total<span class="mu-platform-total-count" id="msPlatformTotalCount">0</span></div>'
			+ '</div>'
			+ '<div class="mu-platform-cards" id="msPlatformCards">' + cards + '</div>'
		+ '</div>'
	+ '</div>';
}

// Card filter on the already-loaded table: DataTables row filter on the "Learning Program"
// column (index 2), so paging and the "Showing x of y" info follow the filter. No server call.
var MS_ACTIVE_PLATFORM_CLS = '';
var MS_PLATFORM_FILTER_REGISTERED = false;

function msApplyPlatformFilter(cls) {
	MS_ACTIVE_PLATFORM_CLS = cls || '';
	if (!$.fn.dataTable) {
		return;
	}
	if (!MS_PLATFORM_FILTER_REGISTERED) {
		MS_PLATFORM_FILTER_REGISTERED = true;
		$.fn.dataTable.ext.search.push(function (settings, data) {
			if (settings.nTable.id !== 'manageStudentSession' || !MS_ACTIVE_PLATFORM_CLS) {
				return true;
			}
			return msPlatformClsFromLabel(data[2]) === MS_ACTIVE_PLATFORM_CLS;
		});
	}
	if ($.fn.dataTable.isDataTable('#manageStudentSession')) {
		$('#manageStudentSession').DataTable().draw();
	}
}

// Shows the section; a new search clears the card filter. The counts come from msLoadPlatformCounts.
function msRenderPlatformCounts() {
	MS_ACTIVE_PLATFORM_CLS = '';
	$('#msPlatformCards .mu-platform-card').removeClass('active');
	$('#msPlatformSection').show();
}

// Counts per learning program for the search filters, from the server — Page Size only limits the table rows,
// never these counts. A program with no matching rows is absent from the response, so every card is reset to 0 first.
function msLoadPlatformCounts(payloadObj) {
	$.ajax({
		type: "POST",
		contentType: APPLICATION_JSON_VALUE,
		url: CONTEXT_PATH + UNIQUEUUID + "/dashboard/student-manage-session-platform-counts",
		data: JSON.stringify(payloadObj),
		dataType: 'json',
		global: false,
		async: true
	}).done(function (resp) {
		if (!resp || resp.status != "1") { return; }
		var counts = resp.counts || {};
		var byCls = {};
		Object.keys(counts).forEach(function (type) {
			var cls = MS_PLATFORM_CLS[type] || 'default';
			byCls[cls] = (byCls[cls] || 0) + counts[type];
		});
		$('#msPlatformCards .mu-platform-card').each(function () {
			$(this).find('.mu-platform-card-count').text(byCls[this.getAttribute('data-cls')] || 0);
		});
		$('#msPlatformTotalCount').text(resp.total != null ? resp.total : 0);
	});
}

// Clicking a card shows only that learning program's rows; clicking it again shows all.
function msSelectPlatformCard(cardEl) {
	var wasActive = cardEl.classList.contains('active');
	$('#msPlatformCards .mu-platform-card').removeClass('active');
	if (!wasActive) {
		cardEl.classList.add('active');
	}
	msApplyPlatformFilter(wasActive ? '' : cardEl.getAttribute('data-cls'));
}

function getManageSessionFilter(roleAndModule, schoolId, userId, role) {
	MS_LEARNING_PROGRAM_OPTIONS = getLearningProgramContent(schoolId);
	var emailFilterField = (typeof isEmailSearchFilterAllowed === 'function' && isEmailSearchFilterAllowed())
		? '<div class="col-md-3 col-sm-6 col-12">'
		+ '<div class="input-group position-relative custom-field mb-2 mt-3 p-0">'
		+ '<input type="text" name="studentEmailSearch" id="studentEmailSearch" class="form-control" value="" maxlength="100" placeholder=" "/>'
		+ '<label for="studentEmailSearch">Email ID</label>'
		+ '</div>'
		+ '</div>'
		: '';
	var html =
		'<div class="col-md-12">'
		+ '<div class="filter-wrapper">'
		+ '<div class="full">'
		+ '<button class="btn btn-sm btn-primary float-right show-filter" onClick="toggleFilter(\'lmsStudentFilter\')"><i class="fa fa-filter"></i>&nbsp;Filter</button>'
		+ '</div>'
		+ '<form name="lmsStudentFilter" id="lmsStudentFilter" class="custom-field-scope" action="javascript:void(0)">'
		+ '<div class="filter-fields row custom-field-scope">'
		+ '<div class="col-md-3 col-sm-3 col-12">'
		+ '<div class="input-group position-relative custom-field mb-2 mt-3 p-0">'
		+ '<select name="sessionId" id="sessionId" class="form-control"></select>'
		+ '<label for="sessionId">Select Academic Year</label>'
		+ '</div>'
		+ '</div>'
		+ '<div class="col-md-3 col-sm-6 col-12">'
		+ '<div class="input-group position-relative custom-field mb-2 mt-3 p-0">'
		+ '<input type="text" name="academicYearStartDate" id="academicYearStartDate" class="form-control filterDates" value="" maxlength="10" readonly onkeydown="return false" placeholder=" " />'
		+ '<label for="academicYearStartDate"> Start Date</label>'
		+ '</div>'
		+ '</div>'
		+ '<div class="col-md-3 col-sm-6 col-12">'
		+ '<div class="input-group position-relative custom-field mb-2 mt-3 p-0">'
		+ '<input type="text" name="academicYearEndDate" id="academicYearEndDate" class="form-control filterDates" value="" maxlength="10" readonly onkeydown="return false" placeholder=" " />'
		+ '<label for="academicYearEndDate">End Date</label>'
		+ '</div>'
		+ '</div>'
		+ '<div class="col-md-3 col-sm-3 col-12">'
		+ '<div class="input-group position-relative custom-field mb-2 mt-3 p-0">'
		+ '<select name="enrollmentType" id="enrollmentType" class="form-control">'
		+ '<option value="">Select Learning Program</option>'
		+ MS_LEARNING_PROGRAM_OPTIONS
		+ '</select>'
		+ '<label for="enrollmentType">Select Learning Program</label>'
		+ '</div>'
		+ '</div>'
		+ '<div class="col-md-3 col-sm-3 col-12">'
		+ '<div class="input-group position-relative custom-field mb-2 mt-3 p-0">'
		+ '<select name="standardId" id="standardId" multiple="multiple" class="multiselect-dropdown form-control">'
		+ '<option value="">Select Grade*</option>'
		+ getStandardContent(schoolId, true, false)
		+ '</select>'
		+ '<label for="standardId">Grade</label>'
		+ '</div>'
		+ '</div>'
		+ '<div class="col-md-3 col-sm-3 col-12">'
		+ '<div class="input-group position-relative custom-field mb-2 mt-3 p-0">'
		+ '<select name="courseProviderId" id="courseProviderId" class="form-control">'
		+ getLmsPlatformContent(schoolId)
		+ '</select>'
		+ '<label for="courseProviderId">Select LMS Platform</label>'
		+ '</div>'
		+ '</div>'
		+ '<div class="col-md-3 col-sm-6 col-12">'
		+ '<div class="input-group position-relative custom-field mb-2 mt-3 p-0">'
		+ '<input type="text" name="studentId" id="studentId" class="form-control" value="" maxlength="100"" placeholder=" "/>'
		+ '<label for="studentId">Student ID</label>'
		+ '</div>'
		+ '</div>'
		+ emailFilterField
		+ '<div class="col-md-3 col-sm-6 col-12">'
		+ '<div class="input-group position-relative custom-field mb-2 mt-3 p-0">'
		+ '<input type="text" name="studentName" id="studentName" class="form-control" value="" maxlength="100" onkeydown="return M.isChars(event);" placeholder=" ">'
		+ '<label for="studentName">Student Name</label>'
		+ '</div>'
		+ '</div>'
		+ '<div class="col-md-3 col-sm-3 col-12" style="display:' + (role == 'TEACHER' ? 'none' : 'block') + ';">'
		+ '<div class="input-group position-relative custom-field mb-2 mt-3 p-0">'
		+ '<select name="profileStatus" id="profileStatus" class="form-control">'
		+ '<option value="">Select Profile Status</option>'
		+ '<option value="0">Completed</option>'
		+ '<option value="1">Withdrawn</option>'
		+ '</select>'
		+ '<label for="profileStatus">Profile Status</label>'
		+ '</div>'
		+ '</div>'

		// + '<div class="col-md-3 col-sm-3 col-12">'
		// 	+ '<label>Class Vendor</label>'
		// 	+ '<select name="classAggregator" id="classAggregator" class="form-control">'
		// 		+ '<option value="">Select</option>'
		// 		// + '<option value="LENS">LENS</option>'
		// 		+ '<option value="ZOOM">ZOOM</option>'
		// 	+ '</select>'
		// + '</div>'

		// + '<div class="col-md-3 col-sm-3 col-12">'
		// 	+ '<label>Class Vendor Status</label>'
		// 	+ '<select name="classAggregatorCreated" id="classAggregatorCreated" class="form-control">'
		// 		+ '<option value="">Select</option>'
		// 		+ '<option value="A">Created</option>'
		// 		+ '<option value="U">Unlinked</option>'
		// 		+ '<option value="N">Not Created</option>'
		// 		+ '<option value="S">Invitation Sent</option>'
		// 	+ '</select>'
		// + '</div>'
		+'<div class="col-md-3 col-sm-3 col-12">'
							+'<div class="input-group position-relative custom-field mb-2 mt-3 p-0">'
							+'<select name="academicYearStatus" id="academicYearStatus" class="form-control">'
								+'<option value="">Select Academic Year Selected Status</option>'
								+'<option value="Y">Yes</option>'
								+'<option value="N">No</option>'
							+'</select>'
							+'<label for="academicYearStatus">Academic Year Selected</label>'
							+'</div>'
						+'</div>'
		+ '<div class="col-md-3 col-sm-3 col-12">'
		+ '<div class="input-group position-relative custom-field mb-2 mt-3 p-0">'
		+ '<select name="ongoingStudents" id="ongoingStudents" class="form-control">'
		+ '<option value="">Select Ongoing Student Status</option>'
		+ '<option value="Y">Yes</option>'
		+ '<option value="N">No</option>'
		+ '</select>'
		+ '<label for="ongoingStudents">Ongoing Students</label>'
		+ '</div>'
		+ '</div>'
		+ '<div class="col-md-3 col-sm-3 col-12">'
		+ '<div class="input-group position-relative custom-field mb-2 mt-3 p-0">'
		+ '<select name="sortBy" id="sortBy" class="form-control">'
		+ '<option value="DESC">Descending</option>'
		+ '<option value="ASC">Ascending</option>'
		+ '</select>'
		+ '<label for="sortBy">Sort By</label>'
		+ '</div>'
		+ '</div>'
		+ '<div class="col-md-3 col-sm-3 col-12">'
		+ '<div class="input-group position-relative custom-field mb-2 mt-3 p-0">'
		+ '<input type="text" name="pageSize" id="pageSize" class="form-control" value="25" placeholder=" "/>'
		+ '<label for="pageSize">Page Size</label>'
		+ '</div>'
		+ '</div>'
		+ '<div class="col-md-12 col-sm-12 col-12 mt-2 text-right">'
		+ '<button class="btn btn-danger   mr-2" onclick="advanceManageSessionSearchReset(\'lmsStudentFilter\')"><i class="fa fa-undo"></i>&nbsp;Reset</button>'
		+ '<button class="btn btn-success  " onclick="advanceManageSessionSearch(\'lmsStudentFilter\',\'' + roleAndModule.moduleId + '\',' + userId + ',\'' + role + '\');"><i class="fa fa-search"></i>&nbsp;Search</button>'
		+ '</div>'
		+ '</div>'
		+ '</form>'
		+ '</div>'
		+ '</div>';
	return html;
}

function getManageSessionUserContent(title, roleAndModule, schoolId, userId, role) {
	var html=
		`<div class="app-page-title mb-3 py-2">
			<div class="page-title-wrapper">
				<div class="page-title-heading">
					<div class="page-title-icon"> <i class="fa fa-user-plus text-primary"> </i> </div>
					<div>${title}</div>
				</div>
			</div>
		</div>`;
		html+='<div class="main-card mt-3 mb-3 card body-tabs-shadow">'
			+'<div class="card-body">'
				+'<div class="row">'
					+'<div class="col-lg-12 col-md-12 col-sm-12 col-12"></div>'
				+'</div>'
				+'<div class="row">'
					+'<div class="col-lg-12 col-md-12 col-sm-12 col-12">'
						+getManageSessionFilter(roleAndModule, schoolId, userId, role)
					+'</div>'
					+msPlatformSectionHtml(MS_LEARNING_PROGRAM_OPTIONS)
				+'</div>'
				+'<br>'
				+'<div class="col-md-12">'
					+'<div class="row">'
						+'<div style="width:100%;">'
							+'<div class="tab-content clearfix">'
								+'<div id="manageSessionUserContentDiv" style="width:100%;display:inline-block"></div>'
								+'<div id="studentSemesterStartDateEntryHTML1"></div>'
							+'</div>'
						+'</div>'
					+'</div>'
				+'</div>'
			+'</div>'
		+'</div>'
		+generateAggrigatorModel('manageSession', roleAndModule.moduleId);

	if(typeof refreshCustomFieldState === 'function'){
		setTimeout(function(){
			refreshCustomFieldState($("#lmsStudentFilter"));
		}, 0);
	}

	return html;
}

function manageSessionTable(tableId, role) {
	html = '<table id="' + tableId + '" class="table table-bordered table-striped border-radius-table font-12 responsive" style="width:100%;">'
		+ getManageSessionTableHeader(role)
		+ '</table><br/>';
	return html;
}

function generateAggrigatorModel(callFrom, moduleId) {
	var html =
		'<div class="modal fade" id="aggregatorUserModel" tabindex="-1">'
		+ '<div class="modal-dialog modal-sm modal-notify" role="document">'
		+ '<div class="modal-content text-center">'
		+ '<input type="hidden" class="form-control" id="aggregatorId" name="aggregatorId" value="">'
		+ '<input type="hidden" class="form-control" id="aggrigatorUserId" name="aggrigatorUserId" value="">'
		+ '<input type="hidden" class="form-control" id="aggrigatorCurrentStatus" name="aggrigatorCurrentStatus" value="">'
		+ '<input type="hidden" class="form-control" id="aggrigatorMeetingVendor" name="aggrigatorMeetingVendor" value="">'
		+ '<div class="modal-header justify-content-center" style="top: 0 !important;width:100% !important;padding: 15px 10px;">'
		+ '<p class="heading" style="color: #fff;" id="aggrigatorStatus"></p>'
		+ '</div>'
		+ '<div id="aggrigatorStatusIcon" class="modal-body delete-modal" style="padding-top:12px">'
		+ '</div>'
		+ '<div class="modal-footer text-center">'
		+ '<div class="text-center" style="margin: 0 auto;">'
		+ '<button id="resetAggregatorWarningNo" type="button" class="btn" data-dismiss="modal" style="" onclick="return saveUpdateAggregatorUser(\'' + callFrom + '\',' + moduleId + ');">C</button>'
		+ '<button id="resetAggregatorWarningCancel" type="button" class="btn bg-primary " data-dismiss="modal" style="">Close</button>'
		+ '</div>'
		+ '</div>'
		+ '</div>'
		+ '</div>'
		+ '</div>';
	return html;

}
