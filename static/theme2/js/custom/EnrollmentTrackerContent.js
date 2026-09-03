/*
 * Enrollment Tracker — JS-rendered module (Student Management > Enrollment Tracker).
 * Ported from the enrollment_tracker.html mock, wired to real endpoints:
 *   /dashboard/enrollment-tracker-meta   (cards + dropdowns, cached)
 *   /dashboard/enrollment-tracker-counts (card counts for current session/filters)
 *   /dashboard/enrollment-tracker-count  (filtered row total — DataTable pager)
 *   /dashboard/enrollment-tracker-data   (one filtered page)
 *   /dashboard/enrollment-tracker-detail (side-panel)
 * Spoof reuses the existing {schoolId}/create-spoof-url/{UNIQUEUUID} endpoint.
 *
 * Base rows = New ∪ Re-Enrollment partial students. The four status conditions
 * (payment/course/student/parent) are independent chips, not a single step.
 * The list uses a real serverSide jQuery DataTable; card counts follow the session filter.
 */

var __etMeta = null;
var etTable = null;
var etState = { moduleId: null, cardKey: null, countTotal: 0, countSig: null };

// Chunked loading: a page of N rows is fetched as N/25 parallel 25-row requests,
// capped at ET_PARALLEL_CHUNKS concurrent, so 200 rows = 8 requests in flight (~1 round-trip).
var ET_CHUNK_SIZE = 25;
var ET_PARALLEL_CHUNKS = 8;

// Run `count` tasks via fn(i), at most `limit` concurrently; results returned in order.
async function etRunChunks(count, limit, fn) {
	var results = new Array(count);
	var next = 0;
	async function worker() {
		while (true) {
			var i = next++;
			if (i >= count) { return; }
			results[i] = await fn(i);
		}
	}
	var workers = [];
	for (var w = 0; w < Math.min(limit, count); w++) { workers.push(worker()); }
	await Promise.all(workers);
	return results;
}

var ET_CARDS = [
	{ key: 'newenroll', label: 'New Enrollment', icon: '<i class="fa fa-user-plus"></i>', cls: 'et-ic-green', countKey: 'newEnrollment' },
	{ key: 'reenroll', label: 'Re-Enrollment', icon: '<i class="fa fa-refresh"></i>', cls: 'et-ic-blue', countKey: 'reEnrollment' },
	{ key: 'payment', label: 'Payment Pending', icon: '<i class="fa fa-credit-card"></i>', cls: 'et-ic-yellow', countKey: 'paymentPending' },
	{ key: 'course', label: 'Course Selection', icon: '<i class="fa fa-book"></i>', cls: 'et-ic-orange', countKey: 'courseSelection' },
	{ key: 'parent', label: 'Parent Details', icon: '<i class="fa fa-users"></i>', cls: 'et-ic-pink', countKey: 'parentDetails' },
	{ key: 'student', label: 'Student Details', icon: '<i class="fa fa-graduation-cap"></i>', cls: 'et-ic-purple', countKey: 'studentDetails' },
	{ key: 'live', label: 'Live Enrollment', icon: '<i class="fa fa-play-circle"></i>', cls: 'et-ic-green', countKey: 'liveEnrollment' }
];

function etAuth() {
	return {
		hash: typeof getHash === 'function' ? getHash() : '',
		userType: 'SCHOOL',
		schoolId: SCHOOL_ID,
		schoolUUID: SCHOOL_UUID,
		userId: USER_ID
	};
}

function etPost(suffix, body) {
	return $.ajax({
		type: 'POST',
		contentType: APPLICATION_JSON_VALUE,
		url: getURLForHTML('dashboard', suffix),
		data: JSON.stringify(body),
		dataType: 'json',
		global: false,
		async: true
	});
}

function etEsc(v) {
	if (v === null || v === undefined) { return ''; }
	return String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function etInitials(name) {
	if (!name) { return '?'; }
	return name.trim().split(/\s+/).map(function (w) { return w.charAt(0); }).join('').toUpperCase().slice(0, 2);
}

async function etFetchMeta(moduleId) {
	if (__etMeta && __etMeta.moduleId == moduleId) { return __etMeta; }
	var meta = await etPost('enrollment-tracker-meta', {
		moduleId: moduleId,
		schoolId: SCHOOL_ID,
		authentication: etAuth()
	}).catch(function () { return null; });
	if (meta && meta.status == '1') { __etMeta = meta; return meta; }
	if (meta && meta.status == '3') { redirectLoginPage(); }
	return null;
}

function etCurrentFilters() {
	return {
		sessionId: parseInt($('#etSession').val() || '0', 10) || 0,
		enrollmentType: $('#etEnrollmentType').val() || '',
		discountStatus: $('#etDiscountStatus').val() || '',
		counselorUserId: parseInt($('#etCounselor').val() || '0', 10) || 0,
		standardId: parseInt($('#etGrade').val() || '0', 10) || 0,
		countryId: parseInt($('#etCountry').val() || '0', 10) || 0,
		startHours: $('#etStartHours').val() === '' ? '' : parseInt($('#etStartHours').val(), 10),
		endHours: $('#etEndHours').val() === '' ? '' : parseInt($('#etEndHours').val(), 10),
		search: $('#etSearch').val() || ''
	};
}

function etRequestBody(extra) {
	return $.extend({
		moduleId: etState.moduleId,
		schoolId: SCHOOL_ID,
		cardKey: etState.cardKey || '',
		authentication: etAuth()
	}, etCurrentFilters(), extra || {});
}

/* ---------- Cards ---------- */

function etCardsHtml(counts) {
	counts = counts || {};
	return ET_CARDS.map(function (c) {
		var active = etState.cardKey === c.key ? ' et-card-active' : '';
		return '' +
			'<div class="et-card' + active + '" data-et-card="' + c.key + '">' +
			'<div class="et-card-icon ' + c.cls + '">' + c.icon + '</div>' +
			'<div class="et-card-label">' + c.label + '</div>' +
			'<div class="et-card-num">' + (counts[c.countKey] != null ? counts[c.countKey] : 0) + '</div>' +
			'<div class="et-card-view">View details →</div>' +
			'</div>';
	}).join('');
}

async function etRefreshCounts() {
	var resp = await etPost('enrollment-tracker-counts', etRequestBody()).catch(function () { return null; });
	if (resp && resp.status == '3') { redirectLoginPage(); return; }
	if (resp && resp.status == '1' && resp.counts) {
		if (__etMeta) { __etMeta.counts = resp.counts; }
		$('#etCardsRow').html(etCardsHtml(resp.counts));
		etBindCards();
	}
}

/* ---------- Filter dropdowns ---------- */

function etFilterOptions(meta) {
	var sessions = '<option value="0">All Sessions</option>';
	(meta.sessions || []).forEach(function (s) {
		var sel = (meta.activeSessionId && s.sessionId == meta.activeSessionId) ? ' selected'
			: (!meta.activeSessionId && s.active === 'Y' ? ' selected' : '');
		sessions += '<option value="' + s.sessionId + '"' + sel + '>' + etEsc(s.sessionName) + '</option>';
	});
	var grades = '<option value="0">All Grades</option>';
	(meta.standards || []).forEach(function (g) {
		grades += '<option value="' + g.standardId + '">' + etEsc(g.standardName) + '</option>';
	});
	var countries = '<option value="0">All Countries</option>';
	(meta.countries || []).forEach(function (c) {
		countries += '<option value="' + c.key + '">' + etEsc(c.value) + '</option>';
	});
	var counselors = '<option value="0">All Counselors</option>';
	(meta.counselors || []).forEach(function (c) {
		counselors += '<option value="' + c.userId + '">' + etEsc(c.name) + '</option>';
	});
	var enrollTypes = '<option value="">All Types</option>';
	(meta.enrollmentTypes || []).forEach(function (t) {
		enrollTypes += '<option value="' + etEsc(t) + '">' + etEsc(t) + '</option>';
	});
	var disc = '<option value="">All</option>';
	(meta.discountStatuses || []).forEach(function (d) {
		disc += '<option value="' + etEsc(d) + '">' + etEsc(d) + '</option>';
	});
	return { sessions: sessions, grades: grades, countries: countries, counselors: counselors, enrollTypes: enrollTypes, disc: disc };
}

function etShellHtml(meta) {
	var o = etFilterOptions(meta);
	return '' +
	'<div class="et-page">' +
		'<div class="app-page-title mb-3 py-2"><div class="page-title-wrapper"><div class="page-title-heading">' +
			'<div class="page-title-icon"><i class="pe-7s-graph3 text-primary"></i></div>' +
			'<div>Enrollment Tracker</div>' +
		'</div></div></div>' +

		'<div class="et-cards" id="etCardsRow">' + etCardsHtml(meta.counts) + '</div>' +

		'<div class="main-card mb-3 card"><div class="card-body">' +
			'<div class="et-filters custom-field-scope">' +
				'<div class="et-filter-grid">' +
					'<div class="et-field custom-field"><label>Session</label><select id="etSession" class="form-control form-control-sm">' + o.sessions + '</select></div>' +
					'<div class="et-field custom-field"><label>Enrollment Type</label><select id="etEnrollmentType" class="form-control form-control-sm">' + o.enrollTypes + '</select></div>' +
					'<div class="et-field custom-field"><label>Discount Status</label><select id="etDiscountStatus" class="form-control form-control-sm">' + o.disc + '</select></div>' +
					'<div class="et-field custom-field"><label>Counselor</label><select id="etCounselor" class="form-control form-control-sm">' + o.counselors + '</select></div>' +
					'<div class="et-field custom-field"><label>Grade</label><select id="etGrade" class="form-control form-control-sm">' + o.grades + '</select></div>' +
					'<div class="et-field custom-field"><label>Country</label><select id="etCountry" class="form-control form-control-sm">' + o.countries + '</select></div>' +
					'<div class="et-field custom-field"><label>Active Between (Hrs)</label>' +
						'<div style="display:flex;gap:6px;">' +
							'<input type="number" min="0" id="etStartHours" class="form-control form-control-sm" placeholder="Start">' +
							'<input type="number" min="0" id="etEndHours" class="form-control form-control-sm" placeholder="End">' +
						'</div>' +
					'</div>' +
					'<div class="et-field custom-field"><label>Search</label><input type="text" id="etSearch" class="form-control form-control-sm" placeholder="Name, ID or Email"></div>' +
				'</div>' +
				'<div class="et-filter-actions">' +
					'<button class="btn btn-sm btn-light" id="etClear">Clear All</button>' +
					'<button class="btn btn-sm btn-primary" id="etApply">Apply Filters</button>' +
				'</div>' +
			'</div>' +
			'<div class="table-responsive">' +
				'<table id="etTable" class="table table-bordered table-striped font-12 et-table nowrap" style="width:100%"></table>' +
			'</div>' +
		'</div></div>' +
	'</div>' +
	etDrawerHtml();
}

function etDrawerHtml() {
	return '' +
	'<div class="et-overlay" id="etOverlay"></div>' +
	'<div class="et-detail-panel" id="etDetailPanel">' +
		'<div class="et-dp-head"><div><h3 id="etDpName">-</h3><small id="etDpId">-</small></div>' +
			'<button class="et-dp-close" id="etDpClose">✕</button></div>' +
		'<div class="et-dp-body">' +
			'<div class="et-dp-title">🧑 Student Information</div>' +
			'<div class="et-dp-row"><span>Student Name</span><span id="etDpFullName">-</span></div>' +
			'<div class="et-dp-row"><span>Student ID</span><span id="etDpFullId">-</span></div>' +
			'<div class="et-dp-row"><span>Parent Name</span><span id="etDpParent">-</span></div>' +
			'<div class="et-dp-row"><span>Grade</span><span id="etDpGrade">-</span></div>' +
			'<div class="et-dp-row"><span>Counselor</span><span id="etDpCounselor">-</span></div>' +
			'<div class="et-dp-row"><span>Country</span><span id="etDpCountry">-</span></div>' +
			'<div class="et-dp-row"><span>Live</span><span id="etDpLive">-</span></div>' +
			'<div class="et-dp-title">🕒 Enrollment Timeline</div>' +
			'<ul class="et-timeline" id="etDpTimeline"></ul>' +
			'<div class="et-dp-title">🎁 Discount Information</div>' +
			'<div class="et-dp-row"><span>Eligibility Date</span><span id="etDpEligDate">-</span></div>' +
			'<div class="et-dp-row"><span>Expiry Date</span><span id="etDpExpDate">-</span></div>' +
			'<div class="et-dp-row"><span>Days Remaining</span><span id="etDpDaysRem">-</span></div>' +
			'<div class="et-dp-row"><span>Status</span><span id="etDpDiscStatus">-</span></div>' +
		'</div>' +
		'<div class="et-dp-footer">' +
			'<button class="btn btn-primary btn-block" id="etSpoofBtn"><i class="fa fa-eye"></i> View as Student</button>' +
		'</div>' +
	'</div>';
}

/* ---------- Cell renderers ---------- */

function etChip(label, cls) {
	return '<span class="et-chip ' + cls + '">' + etEsc(label) + '</span>';
}

// Green tick when the step is done, red cross when not.
function etStatusItem(label, done) {
	var icon = done
		? '<i class="fa fa-check-circle et-ok"></i>'
		: '<i class="fa fa-times-circle et-no"></i>';
	return '<span class="et-status-item">' + icon + ' ' + label + '</span>';
}

// Checklist with tick/cross per step.
//   New Enrollment : Student Details -> Parent Details -> Course Selection -> Payment
//   Re-Enrollment  : <enrollment-type label> -> Course Selection -> Payment (no Student/Parent)
function etStatusChips(row) {
	if (row.enrollmentType === 'New Enrollment') {
		return etStatusItem('Student Details', row.studentDetails) +
			etStatusItem('Parent Details', row.parentDetails) +
			etStatusItem('Course Selection', !row.coursePending) +
			etStatusItem('Payment', !row.paymentPending);
	}
	// Re-Enrollment: the enrollment-type step is done only once re-enrollment has started
	// (an active partial row); a marks-published candidate shows a cross until then.
	return etStatusItem(row.enrollmentTypeLabel || 'Enrollment Type', row.reEnrollStarted) +
		etStatusItem('Course Selection', !row.coursePending) +
		etStatusItem('Payment', !row.paymentPending);
}

// Swap a broken/missing profile image for the student's initials.
function etAvatarFallback(img) {
	var p = img.parentNode;
	if (p) { p.textContent = img.getAttribute('data-initials') || '?'; }
}

function etStudentCell(row) {
	// Dot + "Online" text are always rendered (hidden when not live) so the 20s poll can toggle them in place.
	var liveDisplay = row.live ? 'inline-block' : 'none';
	var liveBadge = ' <span class="et-live-dot" data-et-live-uid="' + (row.userId || '') + '"'
		+ ' title="Live now" style="display:' + liveDisplay + ';"></span>'
		+ '<span class="et-live-txt" data-et-live-uid="' + (row.userId || '') + '"'
		+ ' style="display:' + liveDisplay + ';"> Online</span>';
	// Email shown only for users allowed by CONFIGURATION/EMAIL_SEARCH_FILTER_RIGHTS.
	var emailAllowed = (typeof isEmailSearchFilterAllowed === 'function') && isEmailSearchFilterAllowed();
	var studentIdLine = row.studentId ? '<div class="et-stu-id">' + etEsc(row.studentId) + '</div>' : '';
	var emailLine = (emailAllowed && row.email)
		? '<div class="et-stu-id">' + etEsc(row.email) + '</div>' : '';
	// Profile photo with initials fallback if the image is missing/broken.
	var avatarInner = row.profileImage
		? '<img src="' + etEsc(row.profileImage) + '" alt="" data-initials="' + etEsc(etInitials(row.name))
			+ '" onerror="etAvatarFallback(this)"/>'
		: etEsc(etInitials(row.name));
	return '<div class="et-stu-cell"><div class="et-stu-avatar">' + avatarInner + '</div>' +
		'<div><div class="et-stu-name">' + etEsc(row.name) + liveBadge + '</div>' +
		studentIdLine + emailLine + '</div></div>';
}

function etDiscountCell(row) {
	if (!row.discountStatus || row.discountStatus === 'N/A') { return 'N/A'; }
	return row.discountStatus === 'Active'
		? '<span class="et-disc-active">Active</span>'
		: '<span class="et-disc-expired">Expired</span>';
}

function etExpiryCell(row) {
	if (!row.expiryDate) { return '–'; }
	var d = row.daysRemaining;
	var ok = d != null && d >= 0;
	var sub = (d == null) ? '(Expired)'
		: (d >= 0 ? '(' + d + ' Days Left)' : '(Expired ' + Math.abs(d) + ' Days Ago)');
	return etEsc(row.expiryDate) + '<div class="et-expiry-sub ' + (ok ? 'left' : 'gone') + '">' + sub + '</div>';
}

/* ---------- DataTable ---------- */

function etInitTable() {
	if ($.fn.dataTable.isDataTable('#etTable')) {
		$('#etTable').DataTable().destroy();
	}
	etTable = $('#etTable').DataTable({
		serverSide: true,
		processing: true,
		searching: false,
		ordering: false,
		stateSave: false,
		scrollX: true,
		pageLength: 25,
		lengthMenu: [25, 50, 75, 100, 125, 150, 175, 200],
		language: { emptyTable: 'No matching students found. Try adjusting your filters.' },
		ajax: function (dtParams, callback) {
			(async function () {
				if (typeof customLoader === 'function') { customLoader(true); }
				try {
					var start = dtParams.start;
					var length = dtParams.length;
					var numChunks = Math.ceil(length / ET_CHUNK_SIZE);

					// Count is cached per filter signature so page/size changes don't re-count.
					var sig = JSON.stringify(etCurrentFilters()) + '|' + (etState.cardKey || '');
					var countPromise = (etState.countSig === sig)
						? Promise.resolve(etState.countTotal)
						: etPost('enrollment-tracker-count', etRequestBody()).then(function (r) {
							if (r && r.status == '3') { redirectLoginPage(); }
							return (r && r.status == '1') ? parseInt(r.totalRows, 10) : 0;
						}).catch(function () { return 0; });

					// All 25-row chunks of the requested page, fetched in parallel.
					var chunksPromise = etRunChunks(numChunks, ET_PARALLEL_CHUNKS, async function (i) {
						var r = await etPost('enrollment-tracker-data',
							etRequestBody({ page: start + i * ET_CHUNK_SIZE, pageSize: ET_CHUNK_SIZE }))
							.catch(function () { return null; });
						if (r && r.status == '3') { redirectLoginPage(); return []; }
						return (r && r.status == '1') ? (r.data || []) : [];
					});

					var settled = await Promise.all([countPromise, chunksPromise]);
					var total = settled[0];
					if (isNaN(total)) { total = 0; }
					etState.countSig = sig;
					etState.countTotal = total;

					var rows = [];
					settled[1].forEach(function (chunk) { if (chunk) { rows = rows.concat(chunk); } });

					callback({ draw: dtParams.draw, recordsTotal: total, recordsFiltered: total, data: rows });
				} catch (e) {
					console.error('etTable ajax', e);
					callback({ draw: dtParams.draw, recordsTotal: 0, recordsFiltered: 0, data: [] });
				} finally {
					if (typeof customLoader === 'function') { customLoader(false); }
				}
			})();
		},
		columns: [
			{ title: 'Student Name / ID', data: null, render: function (row) { return etStudentCell(row); } },
			{ title: 'Enrollment Type', data: 'enrollmentType', render: function (v) {
				return '<span class="' + (v === 'New Enrollment' ? 'et-enroll-new' : 'et-enroll-re') + '">' + etEsc(v) + '</span>';
			} },
			{ title: 'Status', data: null, render: function (row) { return etStatusChips(row); } },
			{ title: 'Discount', data: null, render: function (row) { return etDiscountCell(row); } },
			{ title: 'Eligibility Date', data: 'eligibilityDate', render: function (v) { return etEsc(v) || '–'; } },
			{ title: 'Offer Expiry', data: null, render: function (row) { return etExpiryCell(row); } },
			{ title: 'Counselor', data: 'counselor', render: function (v) { return etEsc(v) || '–'; } },
			{ title: 'Grade', data: 'grade', render: function (v) { return etEsc(v) || '–'; } },
			{ title: 'Country', data: 'country', render: function (v) { return etEsc(v) || '–'; } },
			{ title: 'Last Activity', data: 'timeAtStep', render: function (v) {
				var value = etEsc(v);
				return value ? value + ' before' : '–';
			} },
			{ title: 'Actions', data: null, orderable: false, render: function () {
				return '<button class="btn btn-sm btn-light et-view-btn" title="View"><i class="fa fa-eye"></i></button>';
			} }
		],
		createdRow: function (tr, rowData) {
			$(tr).attr('data-et-id', rowData.studentStandardId);
		}
	});

	// Detail opens only on the View (eye) action button, not on the whole row.
	$('#etTable tbody').off('click', '.et-view-btn').on('click', '.et-view-btn', function (e) {
		e.stopPropagation();
		var data = etTable.row($(this).closest('tr')).data();
		if (data && data.studentStandardId) { etOpenDetail(data.studentStandardId); }
	});
}

function etReload() {
	if (etTable) { etTable.ajax.reload(null, false); }
}

/* ---------- Detail panel ---------- */

async function etOpenDetail(studentStandardId) {
	customLoader(true);
	var resp = await etPost('enrollment-tracker-detail', etRequestBody({ studentStandardId: studentStandardId }))
		.catch(function () { return null; });
	customLoader(false);
	if (resp && resp.status == '3') { redirectLoginPage(); return; }
	if (!resp || resp.status != '1' || !resp.detail) {
		showMessageTheme2(0, (resp && resp.message) || 'This enrollment record is no longer available.');
		return;
	}
	var d = resp.detail;
	$('#etDpName').text(d.name || '-');
	$('#etDpId').text(d.studentId || '-');
	$('#etDpFullName').text(d.name || '-');
	$('#etDpFullId').text(d.studentId || '-');
	$('#etDpParent').text(d.parent || '-');
	$('#etDpGrade').text(d.grade || '-');
	$('#etDpCounselor').text(d.counselor || '-');
	$('#etDpCountry').text(d.country || '-');
	$('#etDpLive').html(d.live ? '<span class="et-disc-active">Live now</span>' : 'Offline');
	$('#etDpEligDate').text(d.eligibilityDate || 'N/A');
	$('#etDpExpDate').text(d.expiryDate || 'N/A');
	$('#etDpDaysRem').text(d.daysRemaining == null ? 'N/A'
		: (d.daysRemaining >= 0 ? d.daysRemaining + ' Days' : 'Expired ' + Math.abs(d.daysRemaining) + ' Days Ago'));
	$('#etDpDiscStatus').text(d.discountStatus || 'N/A');

	var tl = (d.timeline || []).map(function (s) {
		var cls = s.status === 'DONE' ? 'et-tl-done' : (s.status === 'CURRENT' ? 'et-tl-current' : 'et-tl-pending');
		var dot = s.status === 'DONE' ? '✓' : '';
		return '<li><div class="et-tl-dot ' + cls + '">' + dot + '</div>' +
			'<div><div class="et-tl-title">' + etEsc(s.title) + '</div>' +
			'<div class="et-tl-time">' + (s.status === 'DONE' ? 'Completed' : 'Pending') + '</div></div></li>';
	}).join('');
	$('#etDpTimeline').html(tl);

	$('#etDetailPanel').data('userId', d.userId);
	$('#etDetailPanel').data('userName', d.name || '');
	$('#etDetailPanel, #etOverlay').addClass('et-show');
}

function etCloseDetail() {
	$('#etDetailPanel, #etOverlay').removeClass('et-show');
}

// Opens the shared "View as Learner" spoof-URL modal (masterContent.js).
function etSpoof() {
	var userId = $('#etDetailPanel').data('userId');
	var userName = $('#etDetailPanel').data('userName') || '';
	if (!userId) { showMessageTheme2(0, 'No user linked to this record.'); return; }
	if (typeof openSpoofUrlModal !== 'function') { showMessageTheme2(0, 'View-as-Learner is unavailable.'); return; }
	etCloseDetail();
	openSpoofUrlModal('U', String(userId), userName, 'learner');
}

/* ---------- Wiring ---------- */

function etBindCards() {
	$('#etCardsRow .et-card').off('click').on('click', function () {
		var key = $(this).attr('data-et-card');
		// etState.cardKey = etState.cardKey === key ? null : key;
		etState.cardKey =  key;
		$('#etCardsRow .et-card').removeClass('et-card-active');
		if (etState.cardKey) { $(this).addClass('et-card-active'); }
		etReload();
	});
}

function etBindEvents() {
	etBindCards();
	$('#etApply').off('click').on('click', async function () { await etRefreshCounts(); etReload(); });
	$('#etSession').off('change').on('change', async function () { await etRefreshCounts(); etReload(); });
	$('#etClear').off('click').on('click', async function () {
		$('#etEnrollmentType,#etDiscountStatus,#etCounselor,#etGrade,#etCountry').each(function () { $(this).prop('selectedIndex', 0); });
		$('#etSearch').val('');
		$('#etStartHours, #etEndHours').val('');
		// keep Session on its active default rather than "All"
		etState.cardKey = null;
		$('#etCardsRow .et-card').removeClass('et-card-active');
		await etRefreshCounts();
		etReload();
	});
	$('#etSearch').off('keydown').on('keydown', function (e) { if (e.which === 13) { etReload(); } });
	$('#etDpClose').off('click').on('click', etCloseDetail);
	$('#etOverlay').off('click').on('click', etCloseDetail);
	$('#etSpoofBtn').off('click').on('click', etSpoof);
}

function etInjectCss() {
	if ($('#etTrackerCss').length) { return; }
	$('head').append('<style id="etTrackerCss">' +
	'.et-cards{display:grid;grid-template-columns:repeat(7,1fr);gap:10px;margin-bottom:16px;}' +
	'@media (max-width:1400px){.et-cards{grid-template-columns:repeat(4,1fr);}}' +
	'@media (max-width:900px){.et-cards{grid-template-columns:repeat(2,1fr);}}' +
	'.et-card{background:#fff;border:1px solid #e5e9f0;border-radius:10px;padding:12px;cursor:pointer;transition:box-shadow .15s;}' +
	'.et-card:hover{box-shadow:0 4px 14px rgba(0,0,0,.08);}' +
	'.et-card-active{outline:2px solid #2563eb;}' +
	'.et-card-icon{width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:15px;margin-bottom:6px;}' +
	'.et-card-icon i{line-height:1;}' +
	'.et-ic-green{background:#e8f8ee;color:#16a34a;}.et-ic-blue{background:#e7f0ff;color:#2563eb;}.et-ic-yellow{background:#fff7e0;color:#b45309;}.et-ic-orange{background:#fff1e6;color:#c2410c;}.et-ic-pink{background:#fdeaf0;color:#db2777;}.et-ic-purple{background:#f1ecfd;color:#7c3aed;}' +
	'.et-card-label{font-size:12px;color:#6b7280;margin-bottom:2px;}.et-card-num{font-size:20px;font-weight:700;}.et-card-view{font-size:11px;color:#2563eb;font-weight:600;}' +
	'.et-filter-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:10px;}' +
	'@media (max-width:1100px){.et-filter-grid{grid-template-columns:repeat(2,1fr);}}' +
	'.et-filters.custom-field-scope .custom-field{position:relative;margin-bottom:0;}' +
	'.et-filters.custom-field-scope .custom-field label{display:block;font-size:11px;color:#6b7280;margin-bottom:3px;font-weight:600;}' +
	'.et-filters.custom-field-scope .custom-field select,.et-filters.custom-field-scope .custom-field input{height:34px;border:1px solid #d7dfec;border-radius:8px;background-color:#fff;color:#111827;box-shadow:none;}' +
	'.et-filters.custom-field-scope .custom-field select:focus,.et-filters.custom-field-scope .custom-field input:focus{border-color:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,.12);}' +
	'.et-filters.custom-field-scope .custom-field input::placeholder{color:#9ca3af;}' +
	'.et-filter-actions{display:flex;justify-content:flex-end;gap:8px;margin-bottom:12px;}' +
	'.et-table tbody tr{cursor:pointer;}' +
	'.et-stu-cell{display:flex;align-items:center;gap:8px;}' +
	'.et-stu-avatar{width:28px;height:28px;border-radius:50%;background:#dbe4f3;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#1d4ed8;flex-shrink:0;overflow:hidden;}' +
	'.et-stu-avatar img{width:100%;height:100%;border-radius:50%;object-fit:cover;}' +
	'.et-stu-name{font-weight:600;}.et-stu-id{color:#6b7280;font-size:11px;}' +
	'.et-enroll-new{color:#16a34a;font-weight:600;}.et-enroll-re{color:#2563eb;font-weight:600;}' +
	'.et-chip{display:inline-block;padding:2px 8px;border-radius:12px;font-size:11px;font-weight:600;margin:1px;}' +
	'.et-chip-yellow{background:#fff7e0;color:#b45309;}.et-chip-orange{background:#fff1e6;color:#c2410c;}.et-chip-purple{background:#f1ecfd;color:#7c3aed;}.et-chip-pink{background:#fdeaf0;color:#db2777;}.et-chip-green{background:#e8f8ee;color:#16a34a;}.et-chip-blue{background:#e7f0ff;color:#2563eb;}.et-chip-muted{background:#eef1f5;color:#6b7280;}' +
	'.et-status-item{display:block;font-size:12px;line-height:1.7;white-space:nowrap;}.et-status-item .et-ok{color:#16a34a;}.et-status-item .et-no{color:#dc2626;}' +
	'.et-disc-active{color:#16a34a;font-weight:600;}.et-disc-expired{color:#dc2626;font-weight:600;}' +
	'.et-expiry-sub{font-size:11px;}.et-expiry-sub.left{color:#16a34a;}.et-expiry-sub.gone{color:#dc2626;}' +
	'.et-live-dot{display:inline-block;width:8px;height:8px;border-radius:50%;background:#16a34a;margin-left:4px;}' +
	'.et-live-txt{font-size:11px;color:#16a34a;font-weight:600;margin-left:3px;}' +
	'.et-overlay{position:fixed;inset:0;background:rgba(15,20,30,.35);display:none;z-index:1040;}' +
	'.et-overlay.et-show{display:block;}' +
	'.et-detail-panel{position:fixed;top:0;right:0;height:100vh;width:380px;max-width:90vw;background:#fff;box-shadow:-8px 0 30px rgba(0,0,0,.15);transform:translateX(100%);transition:transform .25s ease;z-index:1050;overflow-y:auto;}' +
	'.et-detail-panel.et-show{transform:translateX(0);}' +
	'.et-dp-head{background:#2563eb;color:#fff;padding:16px 18px;display:flex;justify-content:space-between;align-items:flex-start;position:sticky;top:0;}' +
	'.et-dp-head h3{margin:0;font-size:16px;}.et-dp-head small{opacity:.85;font-size:12px;}' +
	'.et-dp-close{background:transparent;border:none;color:#fff;font-size:18px;cursor:pointer;}' +
	'.et-dp-body{padding:16px 18px;}' +
	'.et-dp-title{font-size:13px;font-weight:700;margin:16px 0 8px;}' +
	'.et-dp-row{display:flex;justify-content:space-between;font-size:13px;padding:5px 0;border-bottom:1px dashed #f0f2f6;}' +
	'.et-dp-row span:first-child{color:#6b7280;}.et-dp-row span:last-child{font-weight:600;text-align:right;}' +
	'.et-timeline{list-style:none;margin:0;padding:0;}' +
	'.et-timeline li{display:flex;gap:10px;padding-bottom:14px;}' +
	'.et-tl-dot{width:20px;height:20px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:11px;color:#fff;}' +
	'.et-tl-done{background:#16a34a;}.et-tl-current{background:#fff;border:2px solid #f59e0b;}.et-tl-pending{background:#fff;border:2px solid #e5e9f0;}' +
	'.et-tl-title{font-size:13px;font-weight:600;}.et-tl-time{font-size:11px;color:#6b7280;}' +
	'.et-dp-footer{padding:16px 18px 24px;}' +
	'</style>');
}

/* ---------- Live status polling (every 20s) ---------- */

var ET_LIVE_POLL_MS = 20000;
var etLiveTimer = null;

function etStopLivePolling() {
	if (etLiveTimer) { clearInterval(etLiveTimer); etLiveTimer = null; }
}

function etStartLivePolling() {
	etStopLivePolling();
	etLiveTimer = setInterval(etLiveTick, ET_LIVE_POLL_MS);
}

async function etLiveTick() {
	// Auto-stop once the module DOM is gone (navigated away); pause while tab is backgrounded.
	if ($('#etTable').length === 0) { etStopLivePolling(); return; }
	if (document.hidden) { return; }

	var uids = [];
	$('#etTable tbody .et-live-dot[data-et-live-uid]').each(function () {
		var u = parseInt($(this).attr('data-et-live-uid'), 10);
		if (u) { uids.push(u); }
	});

	var resp = await etPost('enrollment-tracker-live', etRequestBody({ visibleUserIds: uids }))
		.catch(function () { return null; });
	if (!resp) { return; }
	if (resp.status == '3') { etStopLivePolling(); redirectLoginPage(); return; }
	if (resp.status != '1') { return; }

	var liveSet = {};
	(resp.liveUserIds || []).forEach(function (u) { liveSet[String(u)] = true; });
	$('#etTable tbody .et-live-dot[data-et-live-uid], #etTable tbody .et-live-txt[data-et-live-uid]').each(function () {
		var u = $(this).attr('data-et-live-uid');
		$(this).css('display', liveSet[String(u)] ? 'inline-block' : 'none');
	});
	if (resp.liveCount != null) {
		$('#etCardsRow .et-card[data-et-card="live"] .et-card-num').text(resp.liveCount);
		if (__etMeta && __etMeta.counts) { __etMeta.counts.liveEnrollment = resp.liveCount; }
	}
}

async function renderEnrollmentTracker(title, roleAndModule, schoolId, userId, userRole) {
	try {
		customLoader(true);
		var moduleId = roleAndModule && roleAndModule.moduleId ? roleAndModule.moduleId : MODULE_ID;
		// Full reset so opening the module from the menu always starts fresh (no stale
		// DataTable instance, cached meta/counts, open drawer, or active card filter).
		if (etTable && $.fn.dataTable.isDataTable('#etTable')) {
			try { etTable.destroy(); } catch (e) { /* ignore */ }
		}
		etTable = null;
		etStopLivePolling();
		$('#etDetailPanel, #etOverlay').removeClass('et-show');
		etState.moduleId = moduleId;
		etState.cardKey = null;
		etState.countSig = null;
		etState.countTotal = 0;
		__etMeta = null;
		var meta = await etFetchMeta(moduleId);
		customLoader(false);
		if (!meta) {
			showMessageTheme2(0, 'Unable to load Enrollment Tracker configuration. Please try again.');
			return;
		}
		etInjectCss();
		$('#dashboardContentInHTML').html(etShellHtml(meta));
		etBindEvents();
		etInitTable();
		etStartLivePolling();
	} catch (e) {
		console.error('renderEnrollmentTracker', e);
		customLoader(false);
		showMessageTheme2(0, 'Unable to load Enrollment Tracker. Please try again.');
	}
}
