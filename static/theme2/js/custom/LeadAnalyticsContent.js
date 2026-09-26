/*
 * Lead Analytics — duplicate-lead merge queue (JS-rendered module, no JSP).
 *
 *  Phase 1: roles with the module assigned, B2C only, read-only. Two tabs:
 *   - Merge queue (default): stat row, scan freshness + Run scan, preset views
 *     (Needs attention / All high / Review medium), filters, 25-row chunked list
 *     sorted by priority tier then score; clicking a row expands the side-by-side
 *     comparison inline (one open at a time).
 *   - Insights: duplicates by source, by match type, groups found per scan.
 *
 *  Rendered from adminController.js contentHandlers ('lead-analytics'). POSTs send
 *  plain JSON and override the global encrypt-wrap beforeSend (controller reads
 *  @RequestBody directly). Colours come from theme vars (--pc etc.).
 */

var __la = {
	view: 'ENROLLED', offset: 0, hasMore: false, loading: false, openGroupId: null,
	summary: null, pollTimer: null, observer: null, insightsLoaded: false
};
var LA_PAGE_SIZE = 25;

/** Presets = the report's cases (queue order). Exact email/phone repeats are in the lead list's "Multiple time apply". */
var LA_CASES = [
	{ key: 'ENROLLED', label: 'Already enrolled', hint: 'Lead matches an active student / parent account' },
	{ key: 'SAME_STUDENT', label: 'Same student', hint: 'Same child applied again with a different mobile / email' },
	{ key: 'SWAPPED', label: 'Name swapped', hint: "Parent's name on one lead is the student's name on the other" },
	{ key: 'SIBLINGS_IP', label: 'Siblings (same IP)', hint: 'Same IP within 7 days, different children' },
	{ key: 'SAME_PARENT', label: 'Same parent', hint: 'Same parent name, new contact' },
	{ key: 'REVIEW', label: 'Review', hint: 'Weaker possible matches' },
	{ key: 'DOUBLE_ENTRY', label: 'Double entry', hint: 'Two rows with one lead number (saved twice)' }
];

/** Field-by-field status chips: ✔ match, ≈ near / partial, ✘ different; fields missing on a side are left out. */
function laChips(fieldsJson) {
	var f;
	try { f = typeof fieldsJson === 'string' ? JSON.parse(fieldsJson) : fieldsJson; } catch (e) { f = null; }
	if (!f) { return ''; }
	var labels = [['student', 'Student'], ['parent', 'Parent'], ['mobile', 'Mobile'], ['email', 'Email'],
		['dob', 'DOB'], ['grade', 'Grade'], ['ip', 'IP']];
	var marks = { Y: ['y', '✔'], '~': ['p', '≈'], N: ['n', '✘'] };
	var h = '';
	labels.forEach(function (l) {
		var m = marks[f[l[0]]];
		if (m) { h += '<span class="la-chip ' + m[0] + '">' + laEsc(l[1]) + ' ' + m[1] + '</span>'; }
	});
	return h ? '<div class="la-chips">' + h + '</div>' : '';
}

function leadAnalyticsUrl(action, id) {
	var url = BASE_URL + CONTEXT_PATH + SCHOOL_UUID + '/dashboard/lead-analytics/' + action;
	if (id !== undefined && id !== null && id !== '') { url += '/' + id; }
	return url + '/' + UNIQUEUUID;
}

function laEsc(v) {
	if (v === undefined || v === null) { return ''; }
	return String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function laDash(v) { return (v === undefined || v === null || v === '') ? '<span class="text-muted">—</span>' : laEsc(v); }

function laPost(action, id, body) {
	return new Promise(function (resolve, reject) {
		$.ajax({
			url: leadAnalyticsUrl(action, id), type: 'POST', contentType: 'application/json',
			data: body ? JSON.stringify(body) : '{}', dataType: 'json', global: false,
			// Bypass the global encrypt-wrap beforeSend — controller reads @RequestBody directly.
			beforeSend: function (xhr) { xhr.setRequestHeader('UNIQUEUUID', UNIQUEUUID); },
			success: function (res) {
				if (res && res.status == '3') { redirectLoginPage(); return; }
				resolve(res);
			},
			error: function (xhr, s, e) { reject(e); }
		});
	});
}

function laAgo(ts) {
	if (!ts) { return 'never'; }
	var mins = Math.max(0, Math.round((Date.now() - new Date(ts).getTime()) / 60000));
	if (mins < 1) { return 'just now'; }
	if (mins < 60) { return mins + 'm ago'; }
	var h = Math.round(mins / 60);
	return h < 48 ? h + 'h ago' : Math.round(h / 24) + 'd ago';
}

function laDate(ts) {
	if (!ts) { return ''; }
	var d = new Date(ts);
	return isNaN(d.getTime()) ? '' : d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
}

/* ------------------------------------------------------------------ entry */
async function renderLeadAnalytics(title, roleAndModule, schoolId, userId, userRole) {
	laStopPolling();
	__la.view = 'ENROLLED'; __la.openGroupId = null; __la.insightsLoaded = false;
	laInjectCss();
	try {
		customLoader(true);
		var sum = await laPost('summary');
		customLoader(false);
		if (!sum || sum.status != '1') {
			$('#dashboardContentInHTML').html('<div class="main-card mb-3 card"><div class="card-body">'
				+ laEsc((sum && sum.message) || 'Unable to load Lead Analytics. Please try again.') + '</div></div>');
			return;
		}
		__la.summary = sum;
		$('#dashboardContentInHTML').html(laBuildShell(title || 'Lead Analytics', sum));
		laBindEvents();
		laRenderStats(sum);
		laLoadQueue(true);
		if (sum.lastRun && sum.lastRun.status === 'RUNNING') { laStartPolling(); }
	} catch (e) {
		customLoader(false);
		showMessageTheme2(0, 'Unable to load Lead Analytics. Please check your connection and try again.');
	}
}

function laInjectCss() {
	if ($('#leadAnalyticsCss').length) { return; }
	$('head').append('<style id="leadAnalyticsCss">'
		+ '.la-stats{display:flex;flex-wrap:wrap;gap:22px;align-items:baseline}'
		+ '.la-stat{font-size:13px;color:var(--gray)}.la-stat b{font-size:18px;color:var(--gray-dark);margin-right:4px;font-weight:600}'
		+ '.la-stat.la-danger b{color:var(--danger)}'
		+ '.la-presets .btn{border-radius:18px;margin:0 6px 6px 0}'
		+ '.la-presets .btn.active{background:var(--pc);border-color:var(--pc);color:var(--white)}'
		+ '.la-filters .form-control{height:32px;font-size:13px}'
		+ '.la-table td,.la-table th{font-size:13px;vertical-align:top}'
		+ '.la-row{cursor:pointer}.la-row:hover{background:rgba(0,0,0,.02)}'
		+ '.la-row.la-open{background:rgba(0,0,0,.035)}'
		+ '.la-pill{display:inline-block;font-size:11px;padding:2px 9px;border-radius:10px;margin:1px 2px 1px 0;white-space:nowrap}'
		/* tiers: 1 conflict, 2 existing student, 3 stage clash, 4 existing parent, 5 recent, 6 review */
		/* case tiers: 1 enrolled, 2 same student, 3 swapped, 4 siblings (IP), 5 same parent, 6 review, 7 double entry */
		+ '.la-t1{background:var(--light);color:var(--success);border:1px solid var(--success)}'
		+ '.la-t2,.la-t3,.la-t7{background:var(--light);color:var(--danger);border:1px solid var(--danger)}'
		+ '.la-t4,.la-t5{background:var(--light);color:var(--warning);border:1px solid var(--warning)}'
		+ '.la-t6{background:var(--light);color:var(--gray-dark)}'
		+ '.la-chips{margin-top:3px}.la-chip{display:inline-block;font-size:11px;margin:1px 6px 1px 0;white-space:nowrap}'
		+ '.la-chip.y{color:var(--success)}.la-chip.n{color:var(--danger)}.la-chip.p{color:var(--warning)}.la-chip.m{color:var(--gray)}'
		+ '.la-cmp .la-fam{background:var(--light)}'
		+ '.la-sib,.la-master{background:var(--plc);color:var(--pc)}'
		+ '.la-muted{font-size:11px;color:var(--gray)}'
		+ '.la-detail>td{background:rgba(0,0,0,.02);padding:12px 14px!important}'
		+ '.la-cmp{width:100%;border-collapse:collapse;background:var(--white)}'
		+ '.la-cmp th,.la-cmp td{border:1px solid var(--light);padding:6px 8px;font-size:12px}'
		+ '.la-cmp th{background:var(--light)}.la-cmp td.la-hit{color:var(--success);font-weight:600;box-shadow:inset 3px 0 0 var(--success)}'
		+ '.la-bar-row{display:grid;grid-template-columns:150px 1fr 50px;gap:8px;align-items:center;font-size:12px;margin-bottom:6px}'
		+ '.la-bar{height:9px;border-radius:5px;background:var(--pc)}'
		+ '.la-sentinel{height:1px}'
		+ '@media (max-width:767px){.la-bar-row{grid-template-columns:100px 1fr 40px}.la-stats{gap:12px}}'
		+ '</style>');
}

function laBuildShell(title, sum) {
	var opt = function (list, label) {
		var h = '<option value="">' + laEsc(label) + '</option>';
		(list || []).forEach(function (o) { h += '<option value="' + laEsc(o.id) + '">' + laEsc(o.name) + '</option>'; });
		return h;
	};
	return ''
		+ '<div class="main-card mb-3 card"><div class="card-body">'
		+ '<h5 class="card-title mb-3">' + laEsc(title) + ' <span class="la-muted">B2C · duplicate leads</span></h5>'
		+ '<ul class="nav nav-tabs" id="laTabs">'
		+ '<li class="nav-item"><a class="nav-link active" data-toggle="tab" href="#laTabQueue">Merge queue</a></li>'
		+ '<li class="nav-item"><a class="nav-link" data-toggle="tab" href="#laTabInsights">Insights</a></li>'
		+ '</ul>'
		+ '<div class="tab-content pt-3">'
		/* queue tab */
		+ '<div class="tab-pane active" id="laTabQueue">'
		+ '<div class="d-flex flex-wrap justify-content-between align-items-center mb-3">'
		+ '<div class="la-stats" id="laStats"></div>'
		+ '<div class="d-flex align-items-center mt-2 mt-md-0">'
		+ '<span class="la-muted mr-2" id="laFreshness"></span>'
		+ '<select class="form-control form-control-sm mr-2" id="laSession" style="width:auto" title="Session Master lead window to scan">'
		+ laSessionOptions(sum) + '</select>'
		+ '<button type="button" class="btn btn-sm btn-primary" id="laRunScan"><i class="fa fa-sync-alt"></i> Run scan</button>'
		+ '</div></div>'
		+ '<div class="d-flex flex-wrap justify-content-between align-items-start">'
		+ '<div class="la-presets" id="laPresets">'
		+ LA_CASES.map(function (c, i) {
			return '<button type="button" class="btn btn-sm btn-outline-secondary' + (i === 0 ? ' active' : '') + '" data-view="'
				+ c.key + '" title="' + laEsc(c.hint) + '">' + laEsc(c.label) + ' · <span data-count="' + c.key + '">0</span></button>';
		}).join('')
		+ '</div>'
		+ '<div class="la-filters form-row" style="max-width:100%">'
		+ '<div class="col-6 col-md-auto mb-2"><select class="form-control" id="laCounselor">' + opt(sum.counselors, 'All counselors') + '</select></div>'
		+ '<div class="col-6 col-md-auto mb-2"><select class="form-control" id="laSource">' + opt(sum.sources, 'All sources') + '</select></div>'
		+ '<div class="col-6 col-md-auto mb-2"><select class="form-control" id="laCountry">' + opt(sum.countries, 'All countries') + '</select></div>'
		+ '<div class="col-6 col-md-auto mb-2"><input type="date" class="form-control" id="laFrom" title="Latest lead created from"></div>'
		+ '<div class="col-6 col-md-auto mb-2"><input type="date" class="form-control" id="laTo" title="Latest lead created to"></div>'
		+ '<div class="col-6 col-md-auto mb-2"><input type="search" class="form-control" id="laSearch" placeholder="Name, phone, email, lead no"></div>'
		+ '</div></div>'
		+ '<div class="table-responsive"><table class="table la-table mb-0">'
		+ '<thead><tr><th style="width:24px"></th><th>Priority</th><th>Lead</th><th>Why they match</th><th>Matched record</th><th>Counselors</th></tr></thead>'
		+ '<tbody id="laQueueBody"></tbody></table></div>'
		+ '<div class="la-sentinel" id="laSentinel"></div>'
		+ '<div class="text-center la-muted py-2" id="laQueueFoot"></div>'
		+ '</div>'
		/* insights tab */
		+ '<div class="tab-pane" id="laTabInsights"><div id="laInsightsBody" class="la-muted">Loading insights…</div></div>'
		+ '</div></div></div>';
}

/** Session picker: defaults to the session of the last scan, else the active session. */
function laSessionOptions(sum) {
	var selected = String((sum.lastRun && sum.lastRun.sessionId) || sum.activeSessionId || '');
	var h = '';
	(sum.sessions || []).forEach(function (o) {
		var label = o.name + (String(o.id) === String(sum.activeSessionId) ? ' (active)' : '');
		h += '<option value="' + laEsc(o.id) + '"' + (String(o.id) === selected ? ' selected' : '') + '>' + laEsc(label) + '</option>';
	});
	return h || '<option value="">No session with lead dates</option>';
}

function laRenderStats(sum) {
	$('#laStats').html(''
		+ '<span class="la-stat"><b>' + Number(sum.groups || 0).toLocaleString() + '</b>groups</span>'
		+ '<span class="la-stat"><b>' + Number(sum.leads || 0).toLocaleString() + '</b>leads</span>'
		+ '<span class="la-stat la-danger"><b>' + Number((sum.caseCounts || {}).ENROLLED || 0).toLocaleString() + '</b>already enrolled</span>'
		+ '<span class="la-stat"><b>' + Number(sum.siblings || 0).toLocaleString() + '</b>possible siblings</span>');
	var counts = sum.caseCounts || {};
	LA_CASES.forEach(function (c) {
		$('#laPresets [data-count="' + c.key + '"]').text(Number(counts[c.key] || 0).toLocaleString());
	});
	laRenderFreshness(sum.lastRun);
}

function laRenderFreshness(run) {
	var $f = $('#laFreshness'), $b = $('#laRunScan');
	$('#laSession').prop('disabled', !!(run && run.status === 'RUNNING'));
	if (!run) {
		$f.html('<i class="fa fa-clock"></i> No scan yet');
		$b.prop('disabled', false).html('<i class="fa fa-sync-alt"></i> Run scan');
		return;
	}
	if (run.status === 'RUNNING') {
		$f.html('<i class="fa fa-spinner fa-spin"></i> Scanning leads…');
		$b.prop('disabled', true).text('Scanning…');
		return;
	}
	var when = laAgo(run.finishedAt || run.startedAt);
	if (run.status === 'FAILED') {
		$f.html('<span class="text-danger" title="' + laEsc(run.message) + '">Last scan failed ' + laEsc(when) + '</span>');
	} else {
		$f.html('<i class="fa fa-clock"></i> ' + (run.sessionName ? 'Session ' + laEsc(run.sessionName) + ' leads · ' : '')
			+ 'updated ' + laEsc(when) + ' · ' + Number(run.leadsScanned || 0).toLocaleString() + ' leads scanned');
	}
	$b.prop('disabled', false).html('<i class="fa fa-sync-alt"></i> Run scan');
}

/* ------------------------------------------------------------------ queue */
function laFilters() {
	return {
		view: __la.view,
		counselorId: $('#laCounselor').val() || null,
		source: $('#laSource').val() || null,
		countryId: $('#laCountry').val() || null,
		createdFrom: $('#laFrom').val() || null,
		createdTo: $('#laTo').val() || null,
		search: $.trim($('#laSearch').val() || '') || null,
		offset: __la.offset,
		limit: LA_PAGE_SIZE
	};
}

async function laLoadQueue(reset) {
	if (__la.loading) { return; }
	if (reset) {
		__la.offset = 0; __la.hasMore = false; __la.openGroupId = null;
		$('#laQueueBody').html('<tr><td colspan="6" class="text-center la-muted py-4">Loading…</td></tr>');
	}
	__la.loading = true;
	try {
		var res = await laPost('queue', null, laFilters());
		if (!res || res.status != '1') {
			if (reset) { $('#laQueueBody').html(''); }
			showMessageTheme2(0, (res && res.message) || 'Could not load the merge queue. Please try again.');
			return;
		}
		if (reset) { $('#laQueueBody').html(''); }
		var html = '';
		(res.rows || []).forEach(function (r) { html += laRowHtml(r); });
		$('#laQueueBody').append(html);
		__la.offset += (res.rows || []).length;
		__la.hasMore = !!res.hasMore;
		laRenderFoot();
	} catch (e) {
		showMessageTheme2(0, 'Could not load the merge queue. Please check your connection and try again.');
	} finally {
		__la.loading = false;
	}
}

function laRenderFoot() {
	var $foot = $('#laQueueFoot');
	if (__la.offset === 0) {
		var noScan = !__la.summary || !__la.summary.lastRun;
		$('#laQueueBody').html('<tr><td colspan="6" class="text-center la-muted py-4">'
			+ (noScan ? 'No scan has run yet. Click “Run scan” to find duplicate leads.'
				: 'No duplicate groups match this view and filters.') + '</td></tr>');
		$foot.html('');
		return;
	}
	$foot.html(__la.hasMore
		? 'Showing ' + __la.offset + ' · <a href="javascript:void(0)" id="laMore">load more</a>'
		: 'Showing all ' + __la.offset);
}

function laRowHtml(r) {
	var tierCls = 'la-t' + (r.priorityTier || 6);
	return '<tr class="la-row" data-group="' + laEsc(r.groupId) + '">'
		+ '<td><i class="fa fa-chevron-right la-chev"></i></td>'
		+ '<td><span class="la-pill ' + tierCls + '">' + laEsc(r.priorityLabel) + '</span>'
		+ (r.siblingSuspect ? '<span class="la-pill la-sib">sibling?</span>' : '')
		+ '<div class="la-muted">score ' + laEsc(r.maxScore) + ' · ' + laEsc((r.band || '').toLowerCase()) + '</div></td>'
		+ '<td>' + laDash(r.masterName) + ' · ' + laEsc(r.masterLeadNo) + ' <span class="la-muted">#' + laEsc(r.masterLeadId) + '</span>'
		+ '<div class="la-muted">' + laEsc(r.masterReason) + '</div></td>'
		+ '<td>' + laDash(r.summary) + laChips(r.fields) + '</td>'
		+ '<td>' + (r.familyLabel
			? laEsc(r.familyLabel) + (r.familyType === 'PARENT' ? ' <span class="la-pill la-sib">new child?</span>' : '')
			: laEsc(r.leadCount) + ' leads') + '</td>'
		+ '<td>' + laDash(r.counselors) + '</td>'
		+ '</tr>';
}

async function laToggleGroup($row) {
	var groupId = String($row.data('group'));
	var wasOpen = __la.openGroupId === groupId;
	$('.la-detail').remove();
	$('.la-row').removeClass('la-open').find('.la-chev').removeClass('fa-chevron-down').addClass('fa-chevron-right');
	__la.openGroupId = null;
	if (wasOpen) { return; }

	__la.openGroupId = groupId;
	$row.addClass('la-open').find('.la-chev').removeClass('fa-chevron-right').addClass('fa-chevron-down');
	var $detail = $('<tr class="la-detail"><td colspan="6"><span class="la-muted">Loading leads…</span></td></tr>');
	$row.after($detail);
	try {
		var res = await laPost('group', groupId);
		if (__la.openGroupId !== groupId) { return; } // user opened another row meanwhile
		if (!res || res.status != '1') {
			$detail.find('td').html('<span class="text-danger">' + laEsc((res && res.message) || 'Could not load this group.') + '</span>');
			return;
		}
		$detail.find('td').html(laDetailHtml(res));
	} catch (e) {
		$detail.find('td').html('<span class="text-danger">Could not load this group. Please try again.</span>');
	}
}

/** Normalizers mirror the server just enough to highlight matching cells. */
function laNormPhone(p) { var d = String(p || '').replace(/\D/g, '').replace(/^0+/, ''); return d.length >= 7 ? d.slice(-9) : ''; } // same 9-digit key as the server
function laNormEmail(e) {
	e = String(e || '').trim().toLowerCase();
	var at = e.indexOf('@'); if (at <= 0) { return ''; }
	var local = e.slice(0, at).split('+')[0], dom = e.slice(at + 1);
	if (dom === 'gmail.com' || dom === 'googlemail.com') { local = local.replace(/\./g, ''); dom = 'gmail.com'; }
	return local + '@' + dom;
}
function laNormText(t) { return String(t || '').toLowerCase().replace(/[^a-z0-9]/g, ''); }

function laDetailHtml(res) {
	var leads = res.leads || [];
	var family = res.family || [];
	var count = function (map, v) { if (v) { map[v] = (map[v] || 0) + 1; } };
	var phones = {}, emails = {}, names = {}, dobs = {};
	var addPerson = function (phoneList, emailList, name, dob) {
		var seenP = {}, seenE = {};
		phoneList.forEach(function (p) { var n = laNormPhone(p); if (n && !seenP[n]) { seenP[n] = 1; count(phones, n); } });
		emailList.forEach(function (e) { var n = laNormEmail(e); if (n && !seenE[n]) { seenE[n] = 1; count(emails, n); } });
		count(names, laNormText(name));
		count(dobs, dob || '');
	};
	leads.forEach(function (l) { addPerson([l.phone, l.altPhone], [l.email, l.altEmail], l.studentName, l.dob); });
	family.forEach(function (f) { addPerson([f.phone], [f.email], f.recordType === 'STUDENT' ? f.name : '', f.dob); });

	var hitPhone = function (v) { return phones[laNormPhone(v)] > 1; };
	var hitEmail = function (v) { return emails[laNormEmail(v)] > 1; };
	var hitName = function (v) { return v && names[laNormText(v)] > 1; };
	var hitDob = function (v) { return v && dobs[v] > 1; };
	var cell = function (v, hit, extraCls) {
		var cls = [extraCls || '', v && hit ? 'la-hit' : ''].join(' ').trim();
		return '<td' + (cls ? ' class="' + cls + '"' : '') + '>' + laDash(v) + '</td>';
	};

	/* rows: [label, leadValue(l), leadHit(l), familyValue(f), familyHit(f)] */
	var rows = [
		['Student', function (l) { return l.studentName; }, function (l) { return hitName(l.studentName); },
			function (f) { return f.recordType === 'STUDENT' ? f.name : null; }, function (f) { return hitName(f.name); }],
		['Name from demo', function (l) { return l.demoStudentName; }, function () { return false; }, null, null],
		['Name from meeting summary', function (l) {
			return l.meetingStudentName || l.meetingParentNames
				? [l.meetingStudentName, l.meetingParentNames ? 'parent ' + l.meetingParentNames : ''].filter(Boolean).join(' · ')
				: null;
		}, function () { return false; }, null, null],
		['Parent / guardian', function (l) { return l.guardianName; }, function () { return false; },
			function (f) { return f.recordType === 'PARENT' ? f.name : null; }, function () { return false; }],
		['Parent from demo', function (l) { return l.demoParentNames; }, function () { return false; }, null, null],
		['Children on account', null, null,
			function (f) { return f.recordType === 'PARENT' ? (f.childNames || 'none mapped') : null; }, function () { return false; }],
		['Phone', function (l) { return l.phone; }, function (l) { return hitPhone(l.phone); },
			function (f) { return f.phone; }, function (f) { return hitPhone(f.phone); }],
		['Alt phone', function (l) { return l.altPhone; }, function (l) { return hitPhone(l.altPhone); }, null, null],
		['Email', function (l) { return l.email; }, function (l) { return hitEmail(l.email); },
			function (f) { return f.email; }, function (f) { return hitEmail(f.email); }],
		['Alt email', function (l) { return l.altEmail; }, function (l) { return hitEmail(l.altEmail); }, null, null],
		['DOB', function (l) { return l.dob; }, function (l) { return hitDob(l.dob); },
			function (f) { return f.dob; }, function (f) { return hitDob(f.dob); }],
		['Grade', function (l) { return l.grade; }, function () { return false; }, null, null],
		['Stage · Counselor', function (l) { return (l.stage || '—') + ' · ' + (l.counselor || 'Unassigned'); }, function () { return false; }, null, null],
		['Lead details', function (l) {
			return [l.age ? 'Age ' + l.age : '', l.whatsappVerified ? 'WhatsApp ' + l.whatsappVerified : '', l.learningProgram || '']
				.filter(Boolean).join(' · ');
		}, function () { return false; }, null, null],
		['Source', function (l) { return l.source; }, function () { return false; }, null, null],
		['Location', function (l) { return [l.city, l.country].filter(Boolean).join(', '); }, function () { return false; }, null, null],
		['Created', function (l) { return laDate(l.createdDate); }, function () { return false; }, null, null]
	];

	var dupNos = {}; // lead numbers shared by more than one row = double entry
	leads.forEach(function (l) { count(dupNos, l.leadNo); });
	var h = '<div class="table-responsive"><table class="la-cmp"><thead><tr><th>Field</th>';
	leads.forEach(function (l) {
		h += '<th>' + laEsc(l.leadNo) + ' <span class="la-muted">#' + laEsc(l.leadId) + '</span>'
			+ (dupNos[l.leadNo] > 1 ? ' <span class="la-pill la-t1">double entry</span>' : '')
			+ (l.master && leads.length > 1 ? ' <span class="la-pill la-master">master</span>' : '')
			+ ' <span class="la-pill la-sib">lead</span></th>';
	});
	family.forEach(function (f) {
		var head = f.recordType === 'STUDENT'
			? 'Student · ' + (f.rollNo || 'no roll no')
			: 'Parent';
		h += '<th class="la-fam">' + laEsc(head) + ' <span class="la-pill la-t2">existing</span>'
			+ (f.recordType === 'PARENT' && f.newChild ? ' <span class="la-pill la-sib">new child?</span>' : '')
			+ '<div class="la-muted">matches ' + laEsc(f.leadNo) + ' #' + laEsc(f.leadId) + '</div></th>';
	});
	h += '</tr></thead><tbody>';
	rows.forEach(function (r) {
		var leadVals = leads.map(function (l) { return r[1] ? r[1](l) : null; });
		var famVals = family.map(function (f) { return r[3] ? r[3](f) : null; });
		if (!leadVals.concat(famVals).some(function (v) { return v; })) { return; } // hide rows empty everywhere
		h += '<tr><td class="font-weight-bold">' + laEsc(r[0]) + '</td>';
		leads.forEach(function (l, i) { h += cell(leadVals[i], r[2] && r[2](l)); });
		family.forEach(function (f, i) { h += cell(famVals[i], r[4] && r[4](f), 'la-fam'); });
		h += '</tr>';
	});
	var span = leads.length + family.length;
	leads.forEach(function (l) {
		if (l.demoSummary) {
			h += '<tr><td class="font-weight-bold">Demo summary · ' + laEsc(l.leadNo) + '</td><td colspan="' + span + '" class="la-muted">'
				+ laEsc(l.demoSummary) + '</td></tr>';
		}
		if (l.meetingSummary) {
			h += '<tr><td class="font-weight-bold">Meeting summary · ' + laEsc(l.leadNo) + '</td><td colspan="' + span + '" class="la-muted">'
				+ laEsc(l.meetingSummary) + '</td></tr>';
		}
	});
	h += '</tbody></table></div>';

	var pill = function (text, score, reasons) {
		var tip = '';
		try {
			tip = JSON.parse(reasons || '[]').map(function (x) {
				return (x.text || x.rule) + ' ' + (x.points > 0 ? '+' : '') + x.points;
			}).join(', ');
		} catch (e) { tip = ''; }
		return '<span class="la-pill la-sib" title="' + laEsc(tip) + '">' + text + ' · ' + laEsc(score) + '</span> ';
	};
	h += '<div class="la-muted mt-3 mb-1">Why they match</div><div>';
	(res.pairs || []).forEach(function (p) {
		h += '<div class="mb-1">' + pill(laEsc(p.leadNoA) + ' #' + laEsc(p.leadIdA) + ' ↔ ' + laEsc(p.leadNoB) + ' #' + laEsc(p.leadIdB)
			+ ': ' + laEsc(p.summary), p.score, p.reasons) + laChips(p.fields) + '</div>';
	});
	family.forEach(function (f) {
		var who = f.recordType === 'STUDENT' ? 'student ' + (f.rollNo || f.name || '') : 'parent ' + (f.name || '');
		h += '<div class="mb-1">' + pill(laEsc(f.leadNo) + ' ↔ ' + laEsc(who) + ': ' + laEsc(f.summary), f.score, f.reasons)
			+ laChips(f.fields) + '</div>';
	});
	h += '</div>';

	var master = leads.filter(function (l) { return l.master; })[0] || leads[0] || {};
	h += '<div class="mt-3 d-flex flex-wrap align-items-center">'
		+ '<button type="button" class="btn btn-sm btn-outline-primary mr-2 mb-1 la-copy" data-leadno="' + laEsc(master.leadNo) + '">'
		+ '<i class="fa fa-copy"></i> Copy lead no</button>';
	if (leads.length > 1) {
		h += '<button type="button" class="btn btn-sm btn-outline-secondary mr-2 mb-1" disabled>Merge</button>'
			+ '<button type="button" class="btn btn-sm btn-outline-secondary mr-2 mb-1" disabled>Not duplicate</button>'
			+ '<button type="button" class="btn btn-sm btn-outline-secondary mr-2 mb-1" disabled>Sibling</button>';
	}
	if (family.length) {
		h += '<button type="button" class="btn btn-sm btn-outline-secondary mr-2 mb-1" disabled>Mark as existing family</button>';
	}
	h += '<span class="la-muted">' + (family.length ? 'Existing-family matches are mark-only. ' : '')
		+ 'Actions arrive in phase 2.</span></div>';
	return h;
}

/* ------------------------------------------------------------------ scan */
async function laRunScan() {
	$('#laRunScan').prop('disabled', true).text('Starting…');
	try {
		var sessionId = $('#laSession').val();
		var res = await laPost('scan', null, { sessionId: sessionId ? Number(sessionId) : null });
		if (!res || res.status != '1') {
			showMessageTheme2(0, (res && res.message) || 'Could not start the scan. Please try again.');
			laRenderFreshness(__la.summary && __la.summary.lastRun);
			if (res && /already running/i.test(res.message || '')) { laStartPolling(); }
			return;
		}
		showMessageTheme2(1, res.message || 'Scan started.');
		laRenderFreshness({ status: 'RUNNING' });
		laStartPolling();
	} catch (e) {
		showMessageTheme2(0, 'Could not start the scan. Please check your connection and try again.');
		laRenderFreshness(__la.summary && __la.summary.lastRun);
	}
}

function laStartPolling() {
	laStopPolling();
	laRenderFreshness({ status: 'RUNNING' });
	__la.pollTimer = setInterval(async function () {
		if (!$('#laTabQueue').length) { laStopPolling(); return; } // user left the module
		try {
			var sum = await laPost('summary');
			if (!sum || sum.status != '1' || !sum.lastRun || sum.lastRun.status === 'RUNNING') { return; }
			laStopPolling();
			__la.summary = sum;
			laRenderStats(sum);
			__la.insightsLoaded = false;
			laLoadQueue(true);
			if (sum.lastRun.status === 'FAILED') {
				showMessageTheme2(0, 'The scan failed. ' + (sum.lastRun.message || ''));
			} else {
				showMessageTheme2(1, 'Scan finished: ' + Number(sum.groups || 0).toLocaleString() + ' duplicate groups found.');
			}
		} catch (e) { /* keep polling */ }
	}, 5000);
}

function laStopPolling() {
	if (__la.pollTimer) { clearInterval(__la.pollTimer); __la.pollTimer = null; }
}

/* ------------------------------------------------------------------ insights */
async function laLoadInsights() {
	if (__la.insightsLoaded) { return; }
	try {
		var res = await laPost('insights');
		if (!res || res.status != '1') {
			$('#laInsightsBody').html('<span class="text-danger">' + laEsc((res && res.message) || 'Could not load insights.') + '</span>');
			return;
		}
		__la.insightsLoaded = true;
		var bars = function (title, rows, empty) {
			var max = 0; (rows || []).forEach(function (r) { max = Math.max(max, r.count); });
			var h = '<div class="col-md-4 mb-3"><div class="font-weight-bold mb-2" style="font-size:13px">' + laEsc(title) + '</div>';
			if (!rows || !rows.length) { return h + '<div class="la-muted">' + laEsc(empty) + '</div></div>'; }
			rows.forEach(function (r) {
				var w = max ? Math.max(3, Math.round(r.count * 100 / max)) : 0;
				h += '<div class="la-bar-row"><span title="' + laEsc(r.label) + '" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'
					+ laEsc(r.label) + '</span><div class="la-bar" style="width:' + w + '%"></div><span>'
					+ Number(r.count).toLocaleString() + '</span></div>';
			});
			return h + '</div>';
		};
		$('#laInsightsBody').removeClass('la-muted').html('<div class="row">'
			+ bars('Duplicate groups by lead source', res.bySource, 'No groups yet.')
			+ bars('Groups by match type', res.byMatchType, 'No groups yet.')
			+ bars('Groups found per scan', res.byRun, 'No completed scans yet.')
			+ '</div>');
	} catch (e) {
		$('#laInsightsBody').html('<span class="text-danger">Could not load insights. Please check your connection and try again.</span>');
	}
}

/* ------------------------------------------------------------------ events */
function laBindEvents() {
	$('#laPresets').on('click', 'button', function () {
		$('#laPresets button').removeClass('active');
		$(this).addClass('active');
		__la.view = $(this).data('view');
		laLoadQueue(true);
	});
	$('#laCounselor, #laSource, #laCountry, #laFrom, #laTo').on('change', function () { laLoadQueue(true); });
	var t = null;
	$('#laSearch').on('input', function () {
		clearTimeout(t);
		t = setTimeout(function () { laLoadQueue(true); }, 400);
	});
	$('#laQueueBody').on('click', '.la-row', function () { laToggleGroup($(this)); });
	$('#laQueueBody').on('click', '.la-copy', function (e) {
		e.stopPropagation();
		var no = $(this).data('leadno');
		if (navigator.clipboard) {
			navigator.clipboard.writeText(String(no)).then(function () {
				showMessageTheme2(1, 'Lead no ' + no + ' copied — search it in the B2C lead list.');
			}, function () { showMessageTheme2(0, 'Could not copy. Lead no: ' + no); });
		} else {
			showMessageTheme2(1, 'Lead no: ' + no);
		}
	});
	$('#laQueueFoot').on('click', '#laMore', function () { if (__la.hasMore) { laLoadQueue(false); } });
	$('#laRunScan').on('click', laRunScan);
	$('#laTabs a[href="#laTabInsights"]').on('shown.bs.tab', laLoadInsights);

	// Infinite scroll: load the next chunk when the sentinel under the table comes into view.
	if (__la.observer) { __la.observer.disconnect(); }
	if ('IntersectionObserver' in window) {
		__la.observer = new IntersectionObserver(function (entries) {
			if (entries[0].isIntersecting && __la.hasMore && !__la.loading && $('#laTabQueue').hasClass('active')) {
				laLoadQueue(false);
			}
		});
		__la.observer.observe(document.getElementById('laSentinel'));
	}
}
