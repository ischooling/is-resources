/*
 * SIS/LMS Sync — client-rendered dashboard module.
 *
 * Replaces the old server-rendered LMSSync.jsp / SyncLMSContent.jsp (opened in a
 * new window via getAsPost). Rendered in-place into #dashboardContentInHTML with
 * a "Back to Dashboard" control, mirroring the Manage User List conversion.
 *
 * Reuses the existing agilixbuzzApi.js helpers (syncLMS, syncLMSProcess,
 * callAgilixbuzzLMSSync, callCourseProviderListForLMSSync, prefill* builders).
 * Adds a Run History table (who/when/outcome/failed-step) with per-run step
 * detail and "Re-run from here" controls backed by /sis-sync/resume.
 */

var __lmsSyncMeta = null;

async function renderLmsSyncDashboard(title, roleAndModule, schoolId, userId, userRole) {
	try {
		customLoader(true);
		var meta = await fetchLmsSyncMeta();
		customLoader(false);
		if (!meta) {
			showMessageTheme2(0, "Unable to load SIS/LMS Sync configuration. Please try again.");
			return;
		}
		var rights = (meta.lmsSyncRights === 'Y');
		var link = meta.onerosterLinkResponse || {};
		var effectiveRole = (meta.userRole || userRole || USER_ROLE || '');

		// Render into the "additional" drill-in div: hide #dashboardContentInHTML,
		// show + populate #dashboardContentInHTMLAdditional. The Back button restores
		// the main dashboard via backToMain() (see below).
		if (typeof showAndHideDashboardAndAdditionalContent === 'function') {
			showAndHideDashboardAndAdditionalContent('additional');
		} else {
			$('#dashboardContentInHTML').hide();
			$('#dashboardContentInHTMLAdditional').show();
		}
		$('#dashboardContentInHTMLAdditional').html(buildLmsSyncShell(title, meta, rights, link, effectiveRole));

		// Tab switching (was inline in SyncLMSContent.jsp).
		$('#lmsUserSyncDiv').hide();
		$('#verifyLmsUserDiv').hide();
		$('#lmsEnrollmentSyncDiv').hide();

		// LMS provider dropdowns for the manual sync tabs.
		callCourseProviderListForLMSSync('lmsSyncForm', 'lmsProviderId', 'LMSUSER');
		callCourseProviderListForLMSSync('lmsSyncForm', 'lmsProviderId1', 'LMSENNROLLMENT');
		callCourseProviderListForLMSSync('lmsSyncForm', 'lmsProviderId2', 'VERIFYLMMSUSER');

		getLMSSyncData('SISSYNC');
		loadLmsSyncHistory(0);
	} catch (e) {
		console.error(e);
		customLoader(false);
		showMessageTheme2(0, "Unable to load SIS/LMS Sync. Please try again.");
	}
}

async function fetchLmsSyncMeta() {
	var meta = await $.ajax({
		type: "POST",
		contentType: APPLICATION_JSON_VALUE,
		url: getURLForHTML("dashboard", "sis-sync-meta"),
		data: JSON.stringify({ schoolId: SCHOOL_ID }),
		dataType: "json",
		global: false,
		async: true,
	});
	if (meta && meta.status == "1") { __lmsSyncMeta = meta; return meta; }
	if (meta && meta.status == "3") { redirectLoginPage(); }
	return null;
}

// Tab show/hide toggle — reimplemented from SyncLMSContent.jsp's inline script.
function getLMSSyncData(type) {
	$("#errMsg").text('');
	$('#sisSyncDiv').toggle(type == 'SISSYNC');
	$('#lmsUserSyncDiv').toggle(type == 'LMSUSER');
	$('#lmsEnrollmentSyncDiv').toggle(type == 'LMSENNROLLMENT');
	$('#verifyLmsUserDiv').toggle(type == 'VERIFYLMMSUSER');
}

function buildLmsSyncShell(title, meta, rights, link, effectiveRole) {
	var schoolOptions = '';
	var schools = meta.schoolSettingses || [];
	for (var i = 0; i < schools.length; i++) {
		var sel = (String(schools[i].schoolId) === String(SCHOOL_ID)) ? ' selected' : '';
		schoolOptions += '<option value="' + schools[i].schoolId + '"' + sel + '>' + escapeHtmlLms(schools[i].schoolName) + '</option>';
	}
	var canDownload = (rights || effectiveRole === 'DIRECTOR');

	var html = '' +
		'<div class="lms-sync-page">' +
		'<div class="app-page-title mb-3 py-2">' +
			'<div class="page-title-wrapper d-flex justify-content-between align-items-center">' +
				'<div class="page-title-heading">' +
					'<div class="page-title-icon"><i class="fas fa-university text-primary"></i></div>' +
					'<div>' + (title || 'SIS/LMS Sync') + '</div>' +
				'</div>' +
				'<a href="javascript:void(0)" class="btn btn-dark rounded" onclick="backToSchoolDashboard()">' +
					'<i class="fa fa-arrow-left mr-1"></i>Back to Dashboard</a>' +
			'</div>' +
		'</div>' +
		'<div class="main-card mb-3 card body-tabs-shadow">' +
		'<div class="card-body">' +
		'<form action="javascript:void(0);" id="lmsSyncForm" name="lmsSyncForm" autocomplete="off">' +
			'<div class="text-center" id="ErrorMsg"><span class="text-warning" style="font-weight:bold;color:red;" id="errMsg"></span></div>' +
			(schools.length ? (
				'<div class="form-row mb-2"><div class="col-xl-3 col-lg-4 col-md-6 col-12">' +
					'<label for="schoolId" class="m-0">School</label>' +
					'<select id="schoolId" name="schoolId" class="form-control">' + schoolOptions + '</select>' +
				'</div></div>'
			) : '<input type="hidden" id="schoolId" value="' + SCHOOL_ID + '"/>') +
			'<ul class="body-tabs body-tabs-layout tabs-animated body-tabs-animated nav">' +
				'<li class="nav-item"><a role="tab" class="nav-link active" id="tab-0" data-toggle="tab" href="javascript:void(0);" onclick="getLMSSyncData(\'SISSYNC\');"><span>SIS sync</span></a></li>' +
				'<li class="nav-item"><a role="tab" class="nav-link" id="tab-1" data-toggle="tab" href="javascript:void(0);" onclick="getLMSSyncData(\'LMSUSER\');"><span>LMS User sync</span></a></li>' +
				'<li class="nav-item"><a role="tab" class="nav-link" id="tab-3" data-toggle="tab" href="javascript:void(0);" onclick="getLMSSyncData(\'VERIFYLMMSUSER\');"><span>Verify LMS User Email</span></a></li>' +
				'<li class="nav-item"><a role="tab" class="nav-link" id="tab-2" data-toggle="tab" href="javascript:void(0);" onclick="getLMSSyncData(\'LMSENNROLLMENT\');"><span>LMS Enrollment Sync</span></a></li>' +
			'</ul>' +
			// ---- SIS sync tab ----
			'<div id="sisSyncDiv">' +
				'<div class="tab-content"><div class="tab-pane tabs-animation fade show active" role="tabpanel"><div class="form-row"><div class="col-12"><div class="position-relative form-group mb-2 mt-2">' +
					(canDownload
						? '<button class="btn btn-primary" id="sisSyncButton" onclick="syncLMS(\'' + (link.token || '') + '\')">Sync in LMS</button>'
						: '<span class="text-muted">You do not have rights to trigger a sync.</span>') +
				'</div></div></div></div></div>' +
				(canDownload ? (
					'<div class="row"><div class="col-12 mb-2"><ul class="d-flex flex-wrap p-0">' +
						'<li class="mr-3"><a target="_blank" href="' + (link.sdsUrl || '#') + '"><i class="fa fa-download"></i>&nbsp;Download SDS CSV</a></li>' +
						'<li class="mr-3"><a target="_blank" href="' + (link.oneroasterUrl || '#') + '"><i class="fa fa-download"></i>&nbsp;Download Oneroster CSV</a></li>' +
					'</ul></div></div>'
				) : '') +
				buildTimeline(canDownload) +
				buildHistorySection() +
			'</div>' +
			// ---- LMS User sync tab ----
			'<div id="lmsUserSyncDiv">' + buildManualSyncTab('lmsProviderId', "callAgilixbuzzLMSSync('lmsSyncForm','USER','lmsProviderId')", 'LMS User Sync',
				'lmsUserSyncResponse', ['S.No', 'LMS Platform', 'External Id', 'LMS User Id', 'User Name', 'Full Name', 'Email', 'Is Sync']) + '</div>' +
			// ---- Verify LMS User Email tab ----
			'<div id="verifyLmsUserDiv">' + buildManualSyncTab('lmsProviderId2', "callAgilixbuzzLMSSync('lmsSyncForm','VERIFYLMMSUSER','lmsProviderId2')", 'Verify LMS User Email',
				'lmsUserEmailVerifyResponse', ['S.No', 'LMS Platform', 'LMS User Id', 'User Name', 'Full Name', 'Email', 'Is Email Verified']) + '</div>' +
			// ---- LMS Enrollment Sync tab ----
			'<div id="lmsEnrollmentSyncDiv">' + buildManualSyncTab('lmsProviderId1', "callAgilixbuzzLMSSync('lmsSyncForm','LMSENNROLLMENT','lmsProviderId1')", 'LMS Enrollment Sync',
				'lmsSyncEnrollmentResponse', ['S.No', 'LMS Platform', 'External Id', 'Enrollment Id', 'Type', 'Course Id', 'Course Name', 'Is Sync']) + '</div>' +
		'</form>' +
		'</div></div>' +
		buildRunDetailModal() +
		'</div>';
	return html;
}

function buildTimeline(canReRun) {
	var steps = [
		{ n: 1, key: 'CSV_DOWNLOAD', label: 'Oneroster CSV downloaded' },
		{ n: 2, key: 'CSV_UPLOAD', label: 'Oneroster CSV uploaded on FTP' },
		{ n: 3, key: 'USER_SYNCED', label: 'LMS User Synced in SMS' },
		{ n: 4, key: 'EMAIL_VERIFIED', label: 'LMS User Email Verified' },
		{ n: 5, key: 'ENROLLMENT_SYNCED', label: 'LMS User Enrollment Synced in SMS' }
	];
	var items = '';
	for (var i = 0; i < steps.length; i++) {
		var s = steps[i];
		var initIcon = (s.n === 1)
			? '<div class="spinner-border spinner-border-sm text-primary" role="status"><span class="sr-only">Loading...</span></div>'
			: '<span><i class="fa fa-clock text-warning"></i></span>';
		var reRun = canReRun
			? '<a href="javascript:void(0)" class="btn btn-sm btn-outline-primary ml-2 lms-rerun-btn" onclick="resumeLmsSync(\'' + s.key + '\')" title="Re-run the workflow starting from this step"><i class="fa fa-redo mr-1"></i>Re-run from here</a>'
			: '';
		items += '' +
			'<div class="vertical-timeline-item vertical-timeline-element"><div class="lms-sync-process-' + s.n + '">' +
				'<span class="vertical-timeline-element-icon bounce-in"><i class="badge badge-dot badge-dot-xl badge-primary"> </i></span>' +
				'<div class="vertical-timeline-element-content bounce-in my-3">' +
					'<h4 class="timeline-title d-flex align-items-center flex-wrap">' + s.label +
						'<span id="process-status-' + s.n + '" class="ml-2">' + initIcon + '</span>' + reRun +
					'</h4>' +
				'</div>' +
			'</div></div>';
	}
	return '<div class="row d-none" id="syncLMSWrapper"><div class="col-12">' +
		'<div class="vertical-without-time vertical-timeline vertical-timeline--animate vertical-timeline--one-column">' +
		items + '</div></div></div>';
}

function buildHistorySection() {
	return '' +
		'<div class="row mt-4"><div class="col-12">' +
			'<div class="d-flex justify-content-between align-items-center mb-2">' +
				'<h5 class="mb-0"><i class="fa fa-history mr-2"></i>Run History</h5>' +
				'<a href="javascript:void(0)" class="btn btn-sm btn-light" onclick="loadLmsSyncHistory(0)"><i class="fa fa-sync mr-1"></i>Refresh</a>' +
			'</div>' +
			'<div class="table-responsive">' +
			'<table class="table table-bordered table-striped mb-1" style="width:100%">' +
				'<thead class="bg-primary text-white"><tr>' +
					'<th>Run</th><th>Started By</th><th>Trigger</th><th>Started At</th><th>Duration</th>' +
					'<th>Started From</th><th>Status</th><th>Failed Step</th><th>Action</th>' +
				'</tr></thead>' +
				'<tbody id="lmsSyncHistoryBody"><tr><td colspan="9" class="text-center text-muted">Loading…</td></tr></tbody>' +
			'</table></div>' +
			'<div id="lmsSyncHistoryPager" class="text-right"></div>' +
		'</div></div>';
}

function buildManualSyncTab(dropdownId, onclick, btnLabel, tableId, headers) {
	var ths = '';
	for (var i = 0; i < headers.length; i++) { ths += '<th>' + headers[i] + '</th>'; }
	return '' +
		'<div class="tab-content"><div class="tab-pane tabs-animation fade show active" role="tabpanel"><div class="form-row">' +
			'<div class="col-xl-2 col-lg-2 col-md-6 col-12"><div class="position-relative form-group mb-2">' +
				'<label for="' + dropdownId + '" class="m-0">LMS Platform</label>' +
				'<select name="' + dropdownId + '" id="' + dropdownId + '" class="form-control"></select>' +
			'</div></div>' +
			'<div class="col-xl-2 col-lg-2 col-md-6 col-12"><div class="position-relative form-group mb-2">' +
				'<button class="mt-4 btn btn-primary" onclick="' + onclick + '">' + btnLabel + '</button>' +
			'</div></div>' +
		'</div></div></div>' +
		'<div class="row"><div class="col-12 mb-2 table-responsive">' +
			'<table id="' + tableId + '" class="table table-bordered table-striped" style="width:100%">' +
				'<thead class="bg-primary text-white"><tr>' + ths + '</tr></thead><tbody></tbody>' +
			'</table>' +
		'</div></div>';
}

function buildRunDetailModal() {
	return '' +
		'<div class="modal fade" id="lmsRunDetailModal" tabindex="-1" role="dialog" aria-hidden="true">' +
			'<div class="modal-dialog modal-xl modal-dialog-scrollable" role="document"><div class="modal-content rounded-10">' +
				'<div class="modal-header py-2 bg-primary text-white d-flex">' +
					'<h5 class="modal-title text-white">Sync Run Detail</h5>' +
					'<button type="button" class="close text-white ml-auto" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
				'</div>' +
				'<div class="modal-body" id="lmsRunDetailBody"></div>' +
			'</div></div>' +
		'</div>';
}

// -------- Run History data + rendering --------------------------------------

var __lmsHistoryPage = 0;

function loadLmsSyncHistory(page) {
	__lmsHistoryPage = page || 0;
	$('#lmsSyncHistoryBody').html('<tr><td colspan="9" class="text-center text-muted">Loading…</td></tr>');
	$.ajax({
		type: "POST",
		contentType: APPLICATION_JSON_VALUE,
		url: getURLForHTML("dashboard", "sis-sync/history") + "?page=" + __lmsHistoryPage + "&size=20",
		data: JSON.stringify({ schoolId: SCHOOL_ID }),
		dataType: "json",
		global: false,
		success: function (data) {
			if (!data || data.status != "1") {
				if (data && data.status == "3") { redirectLoginPage(); return; }
				$('#lmsSyncHistoryBody').html('<tr><td colspan="9" class="text-center text-danger">' + ((data && data.message) || 'Unable to load history.') + '</td></tr>');
				return;
			}
			renderLmsHistoryRows(data.runs || []);
			renderLmsHistoryPager(data.page || 0, data.totalPages || 0);
		},
		error: function () {
			$('#lmsSyncHistoryBody').html('<tr><td colspan="9" class="text-center text-danger">Unable to load history. Please try again.</td></tr>');
		}
	});
}

function renderLmsHistoryRows(runs) {
	if (!runs.length) {
		$('#lmsSyncHistoryBody').html('<tr><td colspan="9" class="text-center text-muted">No sync runs yet.</td></tr>');
		return;
	}
	var rows = '';
	for (var i = 0; i < runs.length; i++) {
		var r = runs[i];
		var canReRun = ($('#sisSyncButton').length > 0); // rights already gated the Sync button
		var reRunFailed = (canReRun && r.failedStep)
			? '<a href="javascript:void(0)" class="btn btn-sm btn-outline-danger ml-1" onclick="resumeLmsSync(\'' + r.failedStep + '\')" title="Re-run from the failed step"><i class="fa fa-redo"></i></a>'
			: '';
		rows += '<tr>' +
			'<td>#' + r.id + '</td>' +
			'<td>' + escapeHtmlLms(r.userName || '') + (r.clientIp ? '<br/><small class="text-muted">' + escapeHtmlLms(r.clientIp) + '</small>' : '') + '</td>' +
			'<td>' + escapeHtmlLms(r.triggeredBy || '') + '</td>' +
			'<td>' + fmtDateTimeLms(r.startedAt) + '</td>' +
			'<td>' + fmtDurationLms(r.durationMs) + '</td>' +
			'<td>' + stepLabelLms(r.startStep) + '</td>' +
			'<td>' + statusBadgeLms(r.overallStatus) + '</td>' +
			'<td>' + (r.failedStep ? stepLabelLms(r.failedStep) : '<span class="text-muted">—</span>') + '</td>' +
			'<td><a href="javascript:void(0)" class="btn btn-sm btn-outline-primary" onclick="viewLmsRun(' + r.id + ')"><i class="fa fa-eye mr-1"></i>View</a>' + reRunFailed + '</td>' +
		'</tr>';
	}
	$('#lmsSyncHistoryBody').html(rows);
}

function renderLmsHistoryPager(page, totalPages) {
	if (totalPages <= 1) { $('#lmsSyncHistoryPager').html(''); return; }
	var prev = page > 0 ? '<button class="btn btn-sm btn-light mr-1" onclick="loadLmsSyncHistory(' + (page - 1) + ')">Prev</button>' : '';
	var next = page < (totalPages - 1) ? '<button class="btn btn-sm btn-light" onclick="loadLmsSyncHistory(' + (page + 1) + ')">Next</button>' : '';
	$('#lmsSyncHistoryPager').html('<span class="text-muted mr-2">Page ' + (page + 1) + ' of ' + totalPages + '</span>' + prev + next);
}

function viewLmsRun(runId) {
	$('#lmsRunDetailBody').html('<div class="text-center text-muted py-4">Loading…</div>');
	$('#lmsRunDetailModal').modal('show');
	$.ajax({
		type: "POST",
		contentType: APPLICATION_JSON_VALUE,
		url: getURLForHTML("dashboard", "sis-sync/history/" + runId),
		data: JSON.stringify({ schoolId: SCHOOL_ID }),
		dataType: "json",
		global: false,
		success: function (data) {
			if (!data || data.status != "1" || !data.run) {
				if (data && data.status == "3") { redirectLoginPage(); return; }
				$('#lmsRunDetailBody').html('<div class="text-danger">' + ((data && data.message) || 'Unable to load run detail.') + '</div>');
				return;
			}
			$('#lmsRunDetailBody').html(renderLmsRunDetail(data.run));
		},
		error: function () {
			$('#lmsRunDetailBody').html('<div class="text-danger">Unable to load run detail. Please try again.</div>');
		}
	});
}

function renderLmsRunDetail(run) {
	var canReRun = ($('#sisSyncButton').length > 0);
	var head = '<div class="row mb-3">' +
		'<div class="col-md-6"><strong>Run:</strong> #' + run.id + '<br/>' +
			'<strong>Started By:</strong> ' + escapeHtmlLms(run.userName || '—') + ' (' + escapeHtmlLms(run.triggeredBy || '') + ')<br/>' +
			'<strong>Client IP:</strong> ' + escapeHtmlLms(run.clientIp || '—') + '<br/>' +
			'<strong>Environment:</strong> ' + escapeHtmlLms(run.environment || '—') + '</div>' +
		'<div class="col-md-6"><strong>Status:</strong> ' + statusBadgeLms(run.overallStatus) + '<br/>' +
			'<strong>Started From:</strong> ' + stepLabelLms(run.startStep) + '<br/>' +
			'<strong>Started At:</strong> ' + fmtDateTimeLms(run.startedAt) + '<br/>' +
			'<strong>Finished At:</strong> ' + fmtDateTimeLms(run.finishedAt) + ' (' + fmtDurationLms(run.durationMs) + ')</div>' +
	'</div>';
	if (run.errorMessage) {
		head += '<div class="alert alert-danger py-2"><strong>Error:</strong> ' + escapeHtmlLms(run.errorMessage) + '</div>';
	}
	var body = '<div class="table-responsive"><table class="table table-bordered table-sm mb-0">' +
		'<thead class="bg-light"><tr><th>Step</th><th>Status</th><th>HTTP</th><th>Start Time</th><th>End Time</th><th>Duration</th><th>Reason / Provider detail</th><th>Action</th></tr></thead><tbody>';
	var steps = run.steps || [];
	for (var i = 0; i < steps.length; i++) {
		var s = steps[i];
		var detail = '';
		if (s.errorMessage) { detail += '<div class="text-danger">' + escapeHtmlLms(s.errorMessage) + '</div>'; }
		if (s.providerDetail) { detail += renderProviderDetail(s.providerDetail); }
		if (!detail) { detail = '<span class="text-muted">—</span>'; }
		var reRun = (canReRun && s.stepKey)
			? '<a href="javascript:void(0)" class="btn btn-sm btn-outline-primary" onclick="$(\'#lmsRunDetailModal\').modal(\'hide\'); resumeLmsSync(\'' + s.stepKey + '\')"><i class="fa fa-redo mr-1"></i>Re-run from here</a>'
			: '';
		body += '<tr>' +
			'<td>' + escapeHtmlLms(s.label || s.stepKey) + '</td>' +
			'<td>' + statusBadgeLms(s.status) + '</td>' +
			'<td>' + (s.httpStatus != null ? s.httpStatus : '<span class="text-muted">—</span>') + '</td>' +
			'<td>' + fmtDateTimeLms(s.startedAt) + '</td>' +
			'<td>' + fmtDateTimeLms(s.finishedAt) + '</td>' +
			'<td>' + fmtDurationLms(s.durationMs) + '</td>' +
			'<td>' + detail + '</td>' +
			'<td>' + reRun + '</td>' +
		'</tr>';
	}
	body += '</tbody></table></div>';
	return head + body;
}

function renderProviderDetail(providerDetail) {
	// providerDetail is a JSON object keyed by lmsProviderId → "Success/Failed <br/> timing".
	try {
		var out = '<ul class="mb-0 pl-3">';
		$.each(providerDetail, function (k, v) {
			var name = (typeof getLmsProviderName === 'function') ? getLmsProviderName(k) : k;
			var cls = (String(v).toLowerCase().indexOf('failed') > -1) ? 'text-danger' : 'text-success';
			out += '<li><span class="' + cls + '"><strong>' + escapeHtmlLms(name) + ':</strong> ' + v + '</span></li>';
		});
		out += '</ul>';
		return out;
	} catch (e) {
		return '<span class="text-muted">—</span>';
	}
}

// -------- Resume / re-run ----------------------------------------------------

function resumeLmsSync(startStep) {
	var token = (__lmsSyncMeta && __lmsSyncMeta.onerosterLinkResponse) ? __lmsSyncMeta.onerosterLinkResponse.token : '';
	var label = stepLabelLms(startStep);
	if (!confirm('Re-initiate the SIS/LMS sync starting from "' + $('<div>').text(label).html() + '"?')) { return; }
	getLMSSyncData('SISSYNC');
	var payload = { schoolId: SCHOOL_ID, accessToken: token, startStep: startStep };
	getDashboardDataBasedUrlAndPayload(true, true, 'sis-sync/resume', payload).then(function (data) {
		if (data && data.status == "1") {
			$("#syncLMSWrapper").removeClass("d-none");
			primeTimelineForResume(startStep);
			if (typeof lmsSyncInterval !== 'undefined' && lmsSyncInterval) { clearInterval(lmsSyncInterval); }
			countCheck = 0;
			lmsSyncInterval = setInterval(syncLMSProcess, 30000);
			showMessageTheme2(1, 'Sync re-initiated from ' + label + '. Refreshing status…');
			setTimeout(function () { loadLmsSyncHistory(0); }, 2000);
		} else if (data && data.status == "3") {
			redirectLoginPage();
		}
	});
}

// Set the timeline icons to reflect a resume: steps before the resume point show
// complete, the resume step spins, later steps wait. Order matches the timeline
// numbering (1 download, 2 upload, 3 user, 4 email verify, 5 enrollment).
function primeTimelineForResume(startStep) {
	var order = { CSV_DOWNLOAD: 1, CSV_UPLOAD: 2, USER_SYNCED: 3, EMAIL_VERIFIED: 4, ENROLLMENT_SYNCED: 5 };
	var from = order[startStep] || 1;
	for (var n = 1; n <= 5; n++) {
		var code = n < from ? 'C' : (n === from ? 'P' : 'W');
		$('.lms-sync-process-' + n + ' #process-status-' + n).html(getSyncLMSProcessStatusContent(code));
	}
}

// -------- Small formatting helpers ------------------------------------------

function backToSchoolDashboard() {
	// Restore the main dashboard content (mirrors backToMain): show
	// #dashboardContentInHTML, hide + clear #dashboardContentInHTMLAdditional.
	if (typeof backToMain === 'function') {
		backToMain('', '');
	} else if (typeof showAndHideDashboardAndAdditionalContent === 'function') {
		showAndHideDashboardAndAdditionalContent('main');
	} else {
		$('#dashboardContentInHTMLAdditional').html('').hide();
		$('#dashboardContentInHTML').show();
	}
}

function stepLabelLms(key) {
	var labels = {
		CSV_DOWNLOAD: 'Oneroster CSV downloaded',
		CSV_UPLOAD: 'Oneroster CSV uploaded on FTP',
		USER_SYNCED: 'LMS User Synced in SMS',
		ENROLLMENT_SYNCED: 'LMS User Enrollment Synced in SMS',
		EMAIL_VERIFIED: 'LMS User Email Verified'
	};
	return escapeHtmlLms(labels[key] || key || '—');
}

function statusBadgeLms(status) {
	var s = (status || '').toUpperCase();
	var map = {
		SUCCESS: 'badge-success', RUNNING: 'badge-info', FAILED: 'badge-danger',
		PARTIAL: 'badge-warning', PENDING: 'badge-secondary', SKIPPED: 'badge-light', C: 'badge-success'
	};
	var cls = map[s] || 'badge-secondary';
	return '<span class="badge ' + cls + '">' + (s || '—') + '</span>';
}

// Server sends UTC datetime strings ("YYYY-MM-DD HH:mm:ss", DATETIME_UTC_FORMATTER).
// Convert to the user's timezone entirely on the browser using timezoneConverter.js,
// displayed with DISPLAY_DATETIME_FORMATTER.
function fmtDateTimeLms(utcStr) {
	if (!utcStr) { return '<span class="text-muted">—</span>'; }
	try {
		var tz = (typeof USER_TIMEZONE !== 'undefined' && USER_TIMEZONE) ? USER_TIMEZONE : moment.tz.guess();
		if (typeof convertUTCToTimezoneAs === 'function') {
			return convertUTCToTimezoneAs(utcStr, DATETIME_UTC_FORMATTER, tz).format(DISPLAY_DATETIME_FORMATTER);
		}
		return moment.utc(utcStr, 'YYYY-MM-DD HH:mm:ss').tz(tz).format('ddd, DD MMM, YYYY hh:mm A');
	} catch (e) { return utcStr; }
}

function fmtDurationLms(ms) {
	if (ms == null) { return '<span class="text-muted">—</span>'; }
	var sec = Math.round(ms / 1000);
	if (sec < 60) { return sec + 's'; }
	var min = Math.floor(sec / 60); var rem = sec % 60;
	if (min < 60) { return min + 'm ' + rem + 's'; }
	var hr = Math.floor(min / 60); return hr + 'h ' + (min % 60) + 'm';
}

function escapeHtmlLms(str) {
	if (str == null) { return ''; }
	return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
