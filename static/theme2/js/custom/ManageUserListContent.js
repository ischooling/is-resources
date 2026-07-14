/*
 * Manage User List — JS-rendered module shell (Student | Teacher | Parent tabs).
 * Replaces the JSP-rendered ManageProfileContent.jsp / ManageProfile*Content.jsp flow:
 *  - one cached JSON meta call (/dashboard/manage-profile-content-meta) supplies all
 *    dropdown/master data the JSP fragments used to get as model attributes;
 *  - tab shells are built client-side (ManageUserStudentContent.js /
 *    ManageUserTeacherContent.js / ManageUserParentContent.js) so tab switches are
 *    instant, with no server HTML render per click;
 *  - list data endpoints are unchanged (DataTables JSON + chunked advance search).
 */

var __manageUserListMeta = null;

/**
 * Shared chunked server-side DataTable for the Student / Teacher / Parent tabs.
 *
 * DataTables' own pager drives fetching: every draw asks the backend only for
 * the visible page, split into parallel 25-row chunk requests (the backend
 * clamps pageSize to 25). Choosing 200 rows/page → 8 chunk calls; clicking
 * next page fetches that page fresh. The total row count comes from the tab's
 * -meta endpoint once per search.
 *
 * opts:
 *   tableId     - table element id (no '#')
 *   headHtml    - '<thead>…</thead>' matching cells' column count
 *   fetchCount  - async () => total rows (or null when count unavailable)
 *   fetchChunk  - async (offset, size) => array of row objects (or null on error)
 *   rowToCells  - (rowObj, absoluteIndex) => array of cell-HTML strings
 */
function muChunkedDataTable(opts) {
	var tableSel = '#' + opts.tableId;
	if ($.fn.dataTable.isDataTable(tableSel)) {
		$(tableSel).DataTable().destroy();
	}
	$(tableSel).html(opts.headHtml + '<tbody></tbody>').show();

	var cachedTotal = null; // one count per search; page clicks reuse it

	var table = $(tableSel).DataTable({
		serverSide: true,
		processing: false,
		searching: false,   // the filter form is the search — hide the global box
		ordering: false,    // row HTML is composite; server order is the order
		stateSave: false,
		pageLength: 25,
		lengthMenu: [25, 50, 75, 100, 125, 150, 175, 200, 225, 250, 275, 300],
		language: { emptyTable: 'No data available in table' },
		ajax: function (dtRequest, callback) {
			(async function () {
				if (typeof customLoader === 'function') { customLoader(true); }
				try {
					if (cachedTotal === null) {
						var total = null;
						try { total = await opts.fetchCount(); } catch (e) { total = null; }
						cachedTotal = (total === null || isNaN(total)) ? -1 : total;
					}
					var start = dtRequest.start;
					var length = dtRequest.length;
					var toLoad = cachedTotal >= 0 ? Math.min(length, Math.max(0, cachedTotal - start)) : length;
					var numChunks = Math.ceil(toLoad / ADV_STUDENT_SEARCH_CHUNK_SIZE);

					var merged = [];
					if (numChunks > 0) {
						var chunks = await runAdvSearchWithConcurrencyLimit(
							numChunks, ADV_STUDENT_SEARCH_PARALLEL_CHUNKS,
							async function (i) {
								try {
									return await opts.fetchChunk(start + i * ADV_STUDENT_SEARCH_CHUNK_SIZE, ADV_STUDENT_SEARCH_CHUNK_SIZE);
								} catch (e) {
									return null;
								}
							});
						for (var c = 0; c < chunks.length; c++) {
							if (chunks[c]) { merged = merged.concat(chunks[c]); }
						}
					}
					// No usable count: infer one that keeps Next enabled while
					// full pages keep coming back.
					var effectiveTotal = cachedTotal >= 0 ? cachedTotal
						: (merged.length < length ? start + merged.length : start + merged.length + 1);
					var rows = [];
					for (var r = 0; r < Math.min(merged.length, length); r++) {
						rows.push(opts.rowToCells(merged[r], start + r));
					}
					callback({ draw: dtRequest.draw, recordsTotal: effectiveTotal, recordsFiltered: effectiveTotal, data: rows });
				} catch (e) {
					console.error(e);
					callback({ draw: dtRequest.draw, recordsTotal: 0, recordsFiltered: 0, data: [] });
				} finally {
					if (typeof customLoader === 'function') { customLoader(false); }
				}
			})();
		}
	});
	return table;
}

async function fetchManageUserListMeta(moduleId) {
	if (__manageUserListMeta && __manageUserListMeta.moduleId == moduleId) {
		return __manageUserListMeta;
	}
	var request = {
		moduleId: moduleId,
		schoolId: SCHOOL_ID,
		authentication: {
			hash: getHash(),
			userType: "SCHOOL",
			schoolId: SCHOOL_ID,
			schoolUUID: SCHOOL_UUID,
			userId: USER_ID,
		},
	};
	var meta = await $.ajax({
		type: "POST",
		contentType: APPLICATION_JSON_VALUE,
		url: getURLForHTML("dashboard", "manage-profile-content-meta"),
		data: JSON.stringify(request),
		dataType: "json",
		global: false,
		async: true,
	});
	if (meta && meta.status == "1") {
		__manageUserListMeta = meta;
		return meta;
	}
	if (meta && meta.status == "3") {
		redirectLoginPage();
	}
	return null;
}

// Collect Student Info modals — moved from ManageProfileContent.jsp; the option list
// for profileFieldId comes from meta.moduleFilterCommonLabels.
function getManageUserListModals(meta) {
	return '' +
	'<div class="modal fade" id="requestForProfileDataModal">' +
		'<div class="modal-dialog modal-xl" role="document">' +
			'<div class="modal-content rounded-10">' +
				'<div class="modal-header py-2 bg-primary text-white d-flex">' +
					'<h5 class="modal-title text-white">Collect Student Info</h5>' +
					'<button type="button" class="close text-white ml-auto close-with-red-color" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
				'</div>' +
				'<div class="modal-body">' +
					'<form id="studentProfileSettingForm" action="javascript:void(0);" autocomplete="off" class="custom-field-scope">' +
						'<input type="hidden" id="profileSettingId" value="0" />' +
						'<div class="row">' +
							'<div class="col-xl-3 col-lg-4 col-md-6 col-sm-12 mb-3">' +
								'<div class="input-group position-relative custom-field mb-2 mt-3 p-0">' +
									'<select id="learningProgramIds" class="form-control" multiple="multiple" placeholder=" "></select>' +
									'<label for="learningProgramIds">Learning Program</label>' +
								'</div>' +
							'</div>' +
							'<div class="col-xl-3 col-lg-4 col-md-6 col-sm-12 mb-3">' +
								'<div class="input-group position-relative custom-field mb-2 mt-3 p-0">' +
									'<select id="gradeIds" class="form-control" multiple="multiple" placeholder=" "></select>' +
									'<label for="gradeIds">Grade</label>' +
								'</div>' +
							'</div>' +
							'<div class="col-xl-3 col-lg-4 col-md-6 col-sm-12 mb-3">' +
								'<div class="input-group position-relative custom-field mb-2 mt-3 p-0">' +
									'<select id="profileFieldId" class="form-control" multiple="multiple" placeholder=" ">' +
										muProfileFieldOptions(meta.moduleFilterCommonLabels, true) +
									'</select>' +
									'<label for="profileFieldId">Profile Field</label>' +
								'</div>' +
							'</div>' +
							'<div class="col-xl-3 col-lg-4 col-md-6 col-sm-12 mb-3">' +
								'<div class="input-group position-relative custom-field mb-2 mt-3 p-0">' +
									'<select id="scheduleType" class="form-control" onchange="toggleScheduleDateTimeFields()" placeholder=" ">' +
										'<option value="NOW">Now</option>' +
										'<option value="SCHEDULE_LATER">Schedule Later</option>' +
									'</select>' +
									'<label for="scheduleType">Schedule Type</label>' +
								'</div>' +
							'</div>' +
							'<div class="col-xl-3 col-lg-4 col-md-6 col-sm-12 mb-3 schedule-date-time-wrapper">' +
								'<div class="input-group position-relative custom-field mb-2 mt-3 p-0">' +
									'<input type="text" id="scheduleDate" class="form-control datepicker" placeholder=" " readonly onkeydown="return false">' +
									'<label for="scheduleDate">Schedule Date</label>' +
								'</div>' +
							'</div>' +
							'<div class="col-xl-3 col-lg-4 col-md-6 col-sm-12 mb-3 schedule-date-time-wrapper">' +
								'<div class="input-group position-relative custom-field mb-2 mt-3 p-0">' +
									'<select id="scheduleTime" class="form-control" placeholder=" " autocomplete="off"></select>' +
									'<label for="scheduleTime">Schedule Time</label>' +
								'</div>' +
							'</div>' +
							'<div class="col-xl-3 col-lg-4 col-md-6 col-sm-12 mb-3">' +
								'<div class="input-group position-relative custom-field mb-2 mt-3 p-0">' +
									'<select id="mandatoryOption" class="form-control" placeholder=" ">' +
										'<option value="">Select Mandatory Option</option>' +
										'<option value="Y">Mandatory</option>' +
										'<option value="N">Non Mandatory</option>' +
									'</select>' +
									'<label for="mandatoryOption">Mandatory Option</label>' +
								'</div>' +
							'</div>' +
							'<div class="col-12 text-right mt-2">' +
								'<a href="javascript:void(0)" class="btn btn-light mr-2" id="resetStudentProfileSetting" onclick="resetStudentProfileSettingForm()">Reset</a>' +
								'<a href="javascript:void(0)" class="btn btn-success" id="saveStudentProfileSetting" onclick="saveStudentProfileSetting()">Save</a>' +
							'</div>' +
						'</div>' +
					'</form>' +
					'<hr/>' +
					'<div class="table-responsive">' +
						'<table class="table table-bordered table-striped border-radius-table font-12 nowrap" id="studentProfileSettingTable" style="width:100% !important;">' +
							'<thead class="bg-primary text-white">' +
								'<tr><th>S.No</th><th>Learning Program</th><th>Grade</th><th>Profile Field</th><th>Schedule Type</th><th>Schedule Date Time</th><th>Mandatory</th><th>Status</th><th>Action</th></tr>' +
							'</thead>' +
							'<tbody></tbody>' +
						'</table>' +
					'</div>' +
				'</div>' +
			'</div>' +
		'</div>' +
	'</div>' +
	'<div class="modal fade" id="studentProfileSettingConfirmationModal" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static">' +
		'<div class="modal-dialog modal-sm" role="document">' +
			'<div class="modal-content  rounded-10">' +
				'<div class="modal-header py-2 bg-primary text-white d-flex">' +
					'<h5 class="modal-title text-white">Confirmation</h5>' +
					'<button type="button" class="close text-white ml-auto close-with-red-color" data-dismiss="modal" aria-label="Close" onclick="clearStudentProfileSettingConfirmationModal()"><span aria-hidden="true">&times;</span></button>' +
				'</div>' +
				'<div class="modal-body"><h5 class="mb-0 text-center" id="studentProfileSettingConfirmationMessage"></h5></div>' +
				'<div class="modal-footer justify-content-center">' +
					'<button type="button" class="btn btn-light" data-dismiss="modal" onclick="clearStudentProfileSettingConfirmationModal()">No</button>' +
					'<button type="button" class="btn btn-success" onclick="confirmStudentProfileSettingAction()">Yes</button>' +
				'</div>' +
			'</div>' +
		'</div>' +
	'</div>' +
	'<div class="modal fade" id="profileSettingOverwriteConfirmationModal" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static">' +
		'<div class="modal-dialog modal-md" role="document">' +
			'<div class="modal-content rounded-10">' +
				'<div class="modal-header py-2 bg-primary text-white d-flex">' +
					'<h5 class="modal-title text-white">Confirmation</h5>' +
					'<button type="button" class="close text-white ml-auto close-with-red-color" data-dismiss="modal" aria-label="Close" onclick="clearStudentProfileSettingConfirmationModal()"><span aria-hidden="true">&times;</span></button>' +
				'</div>' +
				'<div class="modal-body"><h5 class="mb-0 text-center" id="profileSettingOverwriteConfirmationMessage"></h5></div>' +
				'<div class="modal-footer justify-content-center">' +
					'<button type="button" class="btn btn-light" data-dismiss="modal">No</button>' +
					'<button type="button" class="btn btn-success" onclick="saveProfileSetting()">Yes</button>' +
				'</div>' +
			'</div>' +
		'</div>' +
	'</div>';
}

function getManageUserListTabBar() {
	var tabs = '';
	if (USER_ROLE === 'SCHOOL') {
		tabs +=
			'<li role="presentation" class="active nav-item"><a href="javascript:void(0)" id="studentTabId" data-mu-tab="student" class="nav-link active"><span class="font-weight-semi-bold"><i class="fa fa-user"></i> Student</span></a></li>' +
			'<li role="presentation" class="nav-item"><a href="javascript:void(0)" id="parentTabId" data-mu-tab="parent" class="nav-link"><span class="font-weight-semi-bold"><i class="fa fa-user"></i> Parent</span></a></li>';
	} else {
		tabs +=
			'<li role="presentation" class="nav-item"><a href="javascript:void(0)" id="studentTabId" data-mu-tab="student" class="nav-link active"><span class="font-weight-semi-bold"><i class="fa fa-user"></i> Student</span></a></li>' +
			'<li role="presentation" class="nav-item"><a href="javascript:void(0)" id="teacherTabId" data-mu-tab="teacher" class="nav-link"><span class="font-weight-semi-bold"><i class="fa fa-user"></i> Teacher</span></a></li>' +
			'<li role="presentation" class="nav-item"><a href="javascript:void(0)" id="parentTabId" data-mu-tab="parent" class="nav-link"><span class="font-weight-semi-bold"><i class="fa fa-user"></i> Parent</span></a></li>';
	}
	return tabs;
}

async function renderManageUserTab(tab, meta) {
	// Same flag the old JSP tab links set — DataTables state reload behaves identically.
	if (typeof DEFAULT_SEARCH_STATE !== "undefined") {
		DEFAULT_SEARCH_STATE = true;
	}
	$("#manageUserListTabs a.nav-link").removeClass("active");
	$("#manageUserListTabs a[data-mu-tab='" + tab + "']").addClass("active");
	$(".mu-tab-pane").hide();

	var pane = $("#muTab-" + tab);
	pane.show();
	if (pane.data("mu-rendered")) {
		// Re-sync floating labels for select2 fields when a pane is shown again.
		if (typeof refreshCustomFieldState === "function") {
			pane.find("form.custom-field-scope").each(function () {
				refreshCustomFieldState($(this));
			});
		}
		return;
	}
	if (tab === 'student') {
		pane.html(getManageUserStudentTabContent(meta));
		initManageUserStudentTab(meta);
	} else if (tab === 'teacher') {
		pane.html(getManageUserTeacherTabContent(meta));
		initManageUserTeacherTab(meta);
	} else if (tab === 'parent') {
		pane.html(getManageUserParentTabContent(meta));
		initManageUserParentTab(meta);
	}
	pane.data("mu-rendered", true);
	// Filter show/hide toggle is per-pane markup — (re)bind after each render.
	$('.show-filter').off('click').on('click', function () {
		$(this).closest('.filter-wrapper').find('.filter-fields').stop().slideToggle();
	});
}

async function renderManageUserListDashboard(title, roleAndModule, schoolId, userId, userRole) {
	try {
		customLoader(true);
		var moduleId = roleAndModule && roleAndModule.moduleId ? roleAndModule.moduleId : MODULE_ID;
		var meta = await fetchManageUserListMeta(moduleId);
		customLoader(false);
		if (!meta) {
			showMessageTheme2(0, "Unable to load Manage User List configuration. Please try again.");
			return;
		}
		if ($("#customFieldCss").length < 1 && typeof getCustomFieldCss === "function") {
			$("head").append('<style id="customFieldCss">' + getCustomFieldCss() + '</style>');
		}
		if ($("#manageUserListCss").length < 1) {
			$("head").append('<style id="manageUserListCss">.manage-user-list-page .custom-field-scope .custom-field label:not(.error-msg){left:18px;}</style>');
		}
		var html = '' +
			'<div class="manage-user-list-page">' +
			'<div class="app-page-title mb-3 py-2">' +
				'<div class="page-title-wrapper">' +
					'<div class="page-title-heading">' +
						'<div class="page-title-icon"><i class="pe-7s-users text-primary"></i></div>' +
						'<div>' + (title || 'Manage User List') + '</div>' +
					'</div>' +
				'</div>' +
			'</div>' +
			'<div class="main-card mb-3 card">' +
				'<div class="card-body">' +
					'<div class="card-header card-header-tab-animation mb-3">' +
						'<ul class="nav nav-justified" id="manageUserListTabs">' + getManageUserListTabBar() + '</ul>' +
					'</div>' +
					'<div class="tab-content">' +
						'<div class="mu-tab-pane" id="muTab-student"></div>' +
						'<div class="mu-tab-pane" id="muTab-teacher" style="display:none;"></div>' +
						'<div class="mu-tab-pane" id="muTab-parent" style="display:none;"></div>' +
					'</div>' +
				'</div>' +
			'</div>' +
			getManageUserListModals(meta) +
			'</div>';

		$('#dashboardContentInHTML').html(html);

		$("#manageUserListTabs a[data-mu-tab]").off('click').on('click', function () {
			renderManageUserTab($(this).data('mu-tab'), meta);
		});

		await renderManageUserTab('student', meta);

		// Collect Student Info widgets (from studentProfileCompletingProcess.js).
		if (typeof initStudentProfileSettingSelects === "function") {
			initStudentProfileSettingSelects();
		}
		if (typeof loadStudentProfileSettingList === "function") {
			loadStudentProfileSettingList();
		}
	} catch (e) {
		console.error(e);
		customLoader(false);
		showMessageTheme2(0, "Unable to load Manage User List. Please try again.");
	}
}
