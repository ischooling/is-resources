/**
 * Class Quality (Teacher Management) — data loading, rendering and actions.
 * Endpoints: {SCHOOL_UUID}/dashboard/class-quality/... (reads are GET; writes are POST with the global
 * {payload} wrapping from $.ajaxSetup). Every value from the server is escaped with cqEsc before it is shown.
 */

var cq = {
    from: '', to: '', tab: 'overview', canEdit: false, enabled: false,
    charts: {}, sessionsTable: null, teachersTable: null, teacherFilter: null, teacherReport: null,
    detail: null, editing: false, dtab: 'facts', transcript: null, tagCatalog: [], draft: null, clipStop: null
};

function cqBase() {
    return CONTEXT_PATH + SCHOOL_UUID + '/dashboard/class-quality/';
}

/* ------------------------------------------------------------------ setup */

function cqInit() {
    cqSetDays(7, $('#cqRangeBar [data-days="7"]')[0], true);
    cqGet('status', {}, function (res) {
        cq.canEdit = !!res.canEdit;
        cq.enabled = !!res.enabled;
        $('#cqRoot .cq-edit-only').prop('hidden', !cq.canEdit);
        cqLoadTags();
        $('#cqBanner').html(cq.enabled ? '' :
            '<div class="alert alert-warning"><i class="fa fa-pause-circle mr-1"></i>Class Quality is switched off, so new sessions are not checked as their recordings finish. ' +
            (cq.canEdit ? 'Turn it on in <a href="javascript:void(0)" onclick="cqTab(\'settings\')">Settings</a>; past sessions can be filled in there with Build from existing data.'
                : 'Ask an administrator to turn it on.') + '</div>');
        cqTab('overview');
    }, function () {
        $('#cqMain').html('<div class="alert alert-danger">You do not have access to Class Quality, or it could not be loaded. Reload the page and try again.</div>');
    });
}

function cqDateStr(d) {
    var m = d.getMonth() + 1, day = d.getDate();
    return d.getFullYear() + '-' + (m < 10 ? '0' : '') + m + '-' + (day < 10 ? '0' : '') + day;
}

function cqSetDays(days, btn, silent) {
    var to = new Date(), from = new Date();
    from.setDate(to.getDate() - (days - 1));
    cq.from = cqDateStr(from);
    cq.to = cqDateStr(to);
    $('#cqFrom').val(cq.from);
    $('#cqTo').val(cq.to);
    $('#cqRangeBar .btn-group .btn').removeClass('active');
    if (btn) $(btn).addClass('active');
    if (!silent) cqRefresh();
}

function cqCustomRange() {
    var f = $('#cqFrom').val(), t = $('#cqTo').val();
    if (!f || !t) return;
    if (f > t) {
        cqToast(false, 'Start date must be on or before the end date.');
        return;
    }
    cq.from = f;
    cq.to = t;
    $('#cqRangeBar .btn-group .btn').removeClass('active');
    cqRefresh();
}

function cqRefresh() {
    if (!$('#cqDetail').prop('hidden')) return;
    cqTab(cq.tab);
}

function cqTab(name) {
    cq.tab = name;
    cqCloseDetail(true);
    $('#cqRoot .cq-tabs .nav-link').removeClass('active');
    $('#cqRoot .cq-tabs .nav-link[data-tab="' + name + '"]').addClass('active');
    $('#cqRoot .cq-pane').prop('hidden', true);
    $('#cqPane-' + name).prop('hidden', false);
    if (name === 'overview') cqLoadOverview();
    else if (name === 'sessions') cqLoadSessions();
    else if (name === 'teachers') cqLoadTeachers();
    else if (name === 'settings') cqLoadSettings();
}

/* ------------------------------------------------------------------ ajax */

// global: false keeps the app-wide ajaxError handler from covering the module's own message with its
// "technical glitch" pop-up; the $.ajaxSetup beforeSend ({payload} wrapping) still runs.
function cqGet(path, params, ok, fail) {
    $.ajax({
        url: cqBase() + path, type: 'GET', dataType: 'json', data: params, global: false,
        success: function (res) { ok(res); },
        error: function (xhr) {
            if (fail) fail(xhr);
            else cqToast(false, cqErr(xhr, 'This could not be loaded. Please try again.'));
        }
    });
}

function cqPost(path, body, ok, fail) {
    $.ajax({
        url: cqBase() + path, type: 'POST', contentType: 'application/json', dataType: 'json', global: false,
        data: JSON.stringify(body),
        success: function (res) { ok(res); },
        error: function (xhr) {
            var msg = cqErr(xhr, 'This could not be saved. Please try again.');
            if (fail) fail(msg);
            else cqToast(false, msg);
        }
    });
}

function cqErr(xhr, fallback) {
    try {
        var m = JSON.parse(xhr.responseText).message;
        if (m) return m;
    } catch (e) { /* not JSON */ }
    if (xhr && xhr.status === 403) return 'You do not have permission to do this.';
    if (xhr && xhr.status === 0) return 'No connection to the server. Check your network and try again.';
    return fallback;
}

function cqToast(ok, msg) {
    if (typeof showMessageTheme2 === 'function') showMessageTheme2(ok ? 1 : 0, cqEsc(msg));
}

function cqLoading(target) {
    $(target).html('<div class="cq-skel"><i class="fa fa-spinner fa-spin mr-1"></i>Loading…</div>');
}

/** A theme variable as #rrggbb. ApexCharts cannot shade named colours such as the theme's "green". */
function cqColor(name, fallback) {
    var root = document.getElementById('cqRoot');
    if (!root) return fallback;
    var probe = document.createElement('span');
    probe.style.color = 'var(' + name + ')';
    root.appendChild(probe);
    var rgb = getComputedStyle(probe).color;
    root.removeChild(probe);
    var m = rgb && rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (!m) return fallback;
    return '#' + [m[1], m[2], m[3]].map(function (x) { return ('0' + Number(x).toString(16)).slice(-2); }).join('');
}

function cqChart(id, options) {
    if (cq.charts[id]) { try { cq.charts[id].destroy(); } catch (e) { /* already gone */ } }
    var el = document.getElementById(id);
    if (!el) return;
    if (typeof ApexCharts === 'undefined') {
        el.innerHTML = '<div class="text-muted small">Charts are not available on this page.</div>';
        return;
    }
    cq.charts[id] = new ApexCharts(el, options);
    cq.charts[id].render();
}

function cqShortDay(day) {
    var d = new Date(day + 'T00:00:00');
    return isNaN(d) ? day : d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
}

/* ------------------------------------------------------------------ overview */

function cqLoadOverview() {
    cqLoading('#cqPane-overview');
    cqGet('summary', { from: cq.from, to: cq.to }, function (res) {
        cqRenderOverview(res.data);
    }, function (xhr) {
        $('#cqPane-overview').html('<div class="alert alert-danger">' + cqEsc(cqErr(xhr, 'The overview could not be loaded.')) + '</div>');
    });
}

function cqCard(cls, num, of, label, sub) {
    return '<div class="cq-card ' + cls + '"><div><span class="cq-num">' + num + '</span>' +
        (of ? '<span class="cq-of">' + of + '</span>' : '') + '</div><div class="cq-lbl">' + label +
        '</div><div class="cq-sub">' + sub + '</div></div>';
}

function cqRenderOverview(s) {
    var checked = s.checkedSessions || 0, ai = s.aiScoredSessions || 0;
    var noAi = '<div class="text-muted small py-4 text-center">No AI quality scores yet — these sessions have attendance checks only.</div>';
    var html = '<div class="cq-cards">' +
        cqCard('cq-healthy', s.healthy, 'of ' + checked, 'Healthy', 'No flags · AI scores: ' + ai + ' of ' + checked) +
        cqCard('cq-quick', s.quickMonitoring, '', 'Quick monitoring', '1–2 flags · ' + s.reviewedQuick + ' reviewed') +
        cqCard('cq-review', s.reviewRecommended, '', 'Review recommended', '3+ flags · ' + s.reviewedReview + ' reviewed') +
        cqCard('cq-critical', s.critical, '', 'Critical', 'Severe flag · ' + s.reviewedCritical + ' reviewed') +
        '</div>';

    if (!checked) {
        html += '<div class="alert alert-info"><i class="fa fa-info-circle mr-1"></i>No sessions have been checked between ' +
            cqEsc(s.from) + ' and ' + cqEsc(s.to) + '.' + (s.waitingSessions ? ' ' + s.waitingSessions + ' session(s) are waiting to be checked.' : '') +
            (cq.canEdit ? ' To fill in past sessions, use <a href="javascript:void(0)" onclick="cqTab(\'settings\')">Build from existing data</a> in Settings.' : '') + '</div>';
    } else if (!ai) {
        html += '<div class="alert alert-light border small"><i class="fa fa-info-circle mr-1"></i>Health and flags come from our attendance checks ' +
            '(punctuality, late entry, drop-off, devices). AI quality scores will appear once a scoring source is connected.</div>';
    }

    html += '<div class="cq-grid2">' +
        '<div class="card"><div class="card-body"><h6 class="mb-1">Sessions by day</h6><div class="small text-muted mb-2">Checked sessions, stacked by health</div><div id="cqChartDays"></div></div></div>' +
        '<div class="card"><div class="card-body"><h6 class="mb-1">Overall score trend</h6><div class="small text-muted mb-2">Daily average of AI-scored sessions' +
        (s.averageScore != null ? ' · period average <b>' + Number(s.averageScore).toFixed(1) + '</b>' : '') + '</div>' +
        (ai ? '<div id="cqChartTrend"></div>' : noAi) + '</div></div>' +
        '</div><div class="cq-grid2">' +
        '<div class="card"><div class="card-body"><h6 class="mb-1">Teachers needing attention</h6><div class="small text-muted mb-2">Most critical and review sessions</div>' +
        cqAttention(s.attention) + '</div></div>' +
        '<div class="card"><div class="card-body"><h6 class="mb-1">Score distribution</h6><div class="small text-muted mb-2">Overall score of ' + ai + ' AI-scored sessions</div>' +
        (ai ? cqDistribution(s.distribution, ai) : noAi) + '</div></div></div>';
    $('#cqPane-overview').html(html);

    var days = s.byDay || [];
    cqChart('cqChartDays', {
        chart: { type: 'bar', stacked: true, height: 240, toolbar: { show: false } },
        series: [
            { name: 'Healthy', data: days.map(function (d) { return d.healthy; }) },
            { name: 'Quick monitoring', data: days.map(function (d) { return d.quickMonitoring; }) },
            { name: 'Review recommended', data: days.map(function (d) { return d.reviewRecommended; }) },
            { name: 'Critical', data: days.map(function (d) { return d.critical; }) }
        ],
        colors: [cqColor('--cq-healthy', 'green'), cqColor('--cq-quick', '#f7b924'), cqColor('--cq-review', '#fd7e14'), cqColor('--cq-critical', '#d92550')],
        xaxis: { categories: days.map(function (d) { return cqShortDay(d.day); }) },
        dataLabels: { enabled: false }, legend: { position: 'bottom' }, plotOptions: { bar: { columnWidth: '60%' } }
    });
    cqChart('cqChartTrend', {
        chart: { type: 'line', height: 240, toolbar: { show: false }, zoom: { enabled: false } },
        series: [{ name: 'Average score', data: days.map(function (d) { return d.averageScore; }) }],
        colors: [cqColor('--pc', '#007fff')], stroke: { width: 3, curve: 'smooth' }, markers: { size: 3 },
        xaxis: { categories: days.map(function (d) { return cqShortDay(d.day); }) },
        yaxis: { min: 0, max: 100, tickAmount: 5 }, dataLabels: { enabled: false }
    });
}

function cqAttention(list) {
    if (!list || !list.length) return '<div class="text-muted small">No teacher has critical or review sessions in this period.</div>';
    return list.map(function (t) {
        var badge = t.critical ? '<span class="cq-pill cq-critical">' + t.critical + ' critical</span>' : '';
        badge += t.review ? ' <span class="cq-pill cq-review">' + t.review + ' review</span>' : '';
        return '<div class="cq-row"><a href="javascript:void(0)" onclick="cqTab(\'teachers\'); cqOpenTeacher(' + Number(t.teacherUserId) + ')">' +
            cqEsc(t.teacherName) + '</a><span>' + badge + '</span></div>';
    }).join('');
}

function cqDistribution(buckets, total) {
    var cls = ['cq-healthy', 'cq-healthy', 'cq-quick', 'cq-review', 'cq-review', 'cq-critical'];
    return (buckets || []).map(function (b, i) {
        var pct = total ? Math.round(b.count * 100 / total) : 0;
        return '<div class="cq-dist ' + cls[i] + '"><span style="width:52px">' + cqEsc(b.label) +
            '</span><div class="cq-bar"><span style="width:' + pct + '%"></span></div><span style="width:34px;text-align:right">' + b.count + '</span></div>';
    }).join('');
}

/* ------------------------------------------------------------------ sessions */

var CQ_SESSION_COLS = ['sessionStart', 'teacherName', 'title', 'studentCount', '', 'teacherTalkPct', 'overallScore', 'healthStatus', 'reviewStatus', 'flagCount', ''];

/** Why a session has no AI score, in a few words for the sessions list. */
var CQ_AI_SHORT = { NO_TRANSCRIPT: 'No transcript', TOO_SHORT: 'Too short', NO_SHOW: 'Teacher no-show', FAILED: 'AI failed', RETRY: 'AI retrying' };

/** Metrics our code works out from the transcript rather than from attendance. */
var CQ_TRANSCRIPT_METRICS = { NAME_USAGE: true, STUDENTS_SPOKE: true };

/** Metrics nothing feeds yet: they cannot be switched on until a data source exists. */
var CQ_NO_DATA = { CAMERA_ON: 'No camera data yet', VIRTUAL_BACKGROUND: 'No camera data yet' };

/** Why a session has no transcript: S3 deletes it with the recording after 180 days. */
function cqNoTranscriptText() {
    return cq.detail && cq.detail.recordingNote ? 'The transcript was deleted after 180 days, with the recording.'
        : 'LENS has no transcript for this session.';
}

function cqLoadSessions() {
    cqTeacherNote();
    if (cq.sessionsTable) {
        cq.sessionsTable.ajax.reload();
        return;
    }
    cq.sessionsTable = $('#cqSessionsTable').DataTable({
        autoWidth: false, processing: true, serverSide: true, responsive: true, pagingType: 'full_numbers',
        lengthMenu: [[25, 50, 100], [25, 50, 100]], pageLength: 25, order: [[0, 'desc']],
        language: { emptyTable: 'No sessions match these filters in the selected dates.', search: 'Search teacher, session or subject:' },
        ajax: {
            url: cqBase() + 'sessions', type: 'GET',
            data: function (d) {
                d.orderColumn = CQ_SESSION_COLS[d.order && d.order[0] ? d.order[0].column : 0] || 'sessionStart';
                d.from = cq.from;
                d.to = cq.to;
                d.health = $('#cqFHealth').val() || '';
                d.review = $('#cqFReview').val() || '';
                d.kind = $('#cqFKind').val() || '';
                d.analysis = $('#cqFAnalysis').val() || '';
                d.flag = $('#cqFFlag').val() || '';
                d.tagId = $('#cqFTag').val() || '';
                d.bookmarked = $('#cqFBookmarked').prop('checked') ? 'Y' : '';
                d.teacherUserId = cq.teacherFilter ? cq.teacherFilter.id : '';
                delete d.columns;
                return d;
            },
            dataSrc: function (json) {
                if (json && json.status === 'ERROR') cqToast(false, json.message || 'Sessions could not be loaded.');
                return (json && json.data) || [];
            },
            error: function (xhr) { cqToast(false, cqErr(xhr, 'Sessions could not be loaded. Please try again.')); }
        },
        columns: [
            { data: 'sessionStart', title: 'Date', defaultContent: '—', render: function (d) { return cqEsc(d); } },
            { data: 'teacherName', title: 'Teacher', defaultContent: '—', render: function (d) { return cqEsc(d || 'Unknown teacher'); } },
            {
                data: 'title', title: 'Session', render: function (d, t, r) {
                    var sub = [r.gradeName, r.subjectName].filter(Boolean).map(cqEsc).join(' · ');
                    var tags = r.tags || [];
                    return (r.bookmarked ? '<i class="fa fa-star cq-star-mark" title="Bookmarked by you" aria-label="Bookmarked by you"></i>' : '') +
                        cqEsc(d || 'Session') + (r.kindLabel && r.kindLabel !== d ? ' <span class="cq-chip">' + cqEsc(r.kindLabel) + '</span>' : '') +
                        (sub ? '<br><small class="text-muted">' + sub + '</small>' : '') +
                        (tags.length ? '<br>' + tags.slice(0, 2).map(function (t) { return '<span class="cq-tag">' + cqEsc(t) + '</span>'; }).join('') +
                            (tags.length > 2 ? '<small class="text-muted">+' + (tags.length - 2) + '</small>' : '') : '');
                }
            },
            { data: 'studentCount', title: 'Students', defaultContent: '—' },
            { data: 'actualMinutes', title: 'Length', orderable: false, render: function (d, t, r) { return cqLength(d, r.durationMinutes); } },
            {
                data: 'teacherTalkPct', title: '<span title="Share of the talking done by the teacher, from the transcript">Talk %</span>', defaultContent: '—',
                render: function (d) { return d != null ? Number(d) + '%' : '<span class="text-muted">—</span>'; }
            },
            {
                data: 'overallScore', title: 'Score', render: function (d, t, r) {
                    if (r.analysisStatus === 'ANALYSED') return cqScoreHtml(d, 100);
                    return CQ_AI_SHORT[r.aiStatus] ? '<span class="small text-muted">' + cqEsc(CQ_AI_SHORT[r.aiStatus]) + '</span>' : '<span class="text-muted">—</span>';
                }
            },
            { data: 'healthStatus', title: 'Health', render: function (d, t, r) { return cqHealthPill(d, r.analysisStatus); } },
            { data: 'reviewStatus', title: 'Review', render: function (d) { return cqReviewBadge(d); } },
            {
                data: 'flags', title: 'Flags', render: function (d, t, r) {
                    var list = (d || []).map(function (f) { return '<span class="cq-flag">' + cqEsc(f) + '</span>'; }).join('');
                    var more = r.flagCount > (d || []).length ? ' <small class="text-muted">+' + (r.flagCount - d.length) + '</small>' : '';
                    return list ? list + more : '<span class="text-muted">—</span>';
                }
            },
            {
                data: 'id', title: 'Action', orderable: false, searchable: false, render: function (d) {
                    return '<button type="button" class="btn btn-primary btn-sm" onclick="cqOpenSession(' + Number(d) + ')">View</button>';
                }
            }
        ]
    });
}

/** "48 of 60 min": how long the class ran (LENS) against the slot booked. */
function cqLength(actual, booked) {
    if (actual == null && !booked) return '<span class="text-muted">—</span>';
    if (actual == null) return '<span class="text-muted">' + Number(booked) + ' min booked</span>';
    var short = booked && actual < booked * 0.5;
    return '<span' + (short ? ' class="cq-down"' : '') + '>' + Number(actual) + (booked ? ' of ' + Number(booked) : '') + ' min</span>';
}

function cqReloadSessions() {
    if (cq.sessionsTable) cq.sessionsTable.ajax.reload();
}

function cqReviewBadge(s) {
    var cls = s === 'REJECTED' ? 'badge-danger' : s === 'ESCALATED' ? 'badge-warning' : s === 'REVIEWED' ? 'badge-success' : 'badge-light';
    return '<span class="badge ' + cls + '">' + cqEsc(CQ_REVIEW[s] || s || 'Not reviewed') + '</span>';
}

function cqTeacherNote() {
    var n = $('#cqTeacherFilterNote');
    if (!cq.teacherFilter) { n.prop('hidden', true).empty(); return; }
    n.prop('hidden', false).html('Showing sessions for <b>' + cqEsc(cq.teacherFilter.name) +
        '</b> · <a href="javascript:void(0)" onclick="cqClearTeacherFilter()">show all teachers</a>');
}

function cqClearTeacherFilter() {
    cq.teacherFilter = null;
    cqTeacherNote();
    cqReloadSessions();
}

function cqExport() {
    var search = cq.sessionsTable ? cq.sessionsTable.search() : '';
    cqPost('export', {
        from: cq.from, to: cq.to, health: $('#cqFHealth').val() || null, review: $('#cqFReview').val() || null,
        kind: $('#cqFKind').val() || null, flag: $('#cqFFlag').val() || null,
        tagId: $('#cqFTag').val() ? Number($('#cqFTag').val()) : null, bookmarked: $('#cqFBookmarked').prop('checked') ? 'Y' : null,
        teacherUserId: cq.teacherFilter ? cq.teacherFilter.id : null, search: search || null
    }, function (res) { cqToast(true, res.message || 'Export started.'); });
}

/* ------------------------------------------------------------------ session detail */

function cqOpenSession(id) {
    cq.editing = false;
    $('#cqMain, #cqRangeBar').prop('hidden', true);
    $('#cqDetail').prop('hidden', false);
    cqLoading('#cqDetail');
    window.scrollTo(0, 0);
    cqGet('sessions/' + Number(id), {}, function (res) {
        if (!cq.detail || cq.detail.id !== res.data.id) {
            cq.dtab = 'facts';
            cq.transcript = null;
        }
        cq.detail = res.data;
        cqRenderDetail();
    }, function (xhr) {
        $('#cqDetail').html(cqBackLink() + '<div class="alert alert-danger">' + cqEsc(cqErr(xhr, 'This session could not be loaded.')) + '</div>');
    });
}

function cqCloseDetail(silent) {
    if ($('#cqDetail').prop('hidden')) return;
    $('#cqDetail').prop('hidden', true).empty();
    $('#cqMain, #cqRangeBar').prop('hidden', false);
    cq.detail = null;
    cq.editing = false;
    if (!silent && cq.tab === 'sessions') cqReloadSessions();
}

function cqBackLink() {
    return '<a href="javascript:void(0)" class="d-inline-block mb-3" onclick="cqCloseDetail()"><i class="fa fa-arrow-left mr-1"></i>Back</a>';
}

function cqRenderDetail() {
    var d = cq.detail;
    var html = cqBackLink() + '<div id="cqDHead">' + cqDetailHead(d) + '</div>' +
        '<div class="cq-detail"><div>' + cqVideo(d) + cqDetailTabs(d) + '</div><div id="cqDRight">' + cqDetailRight(d) + '</div></div>' +
        '<div id="cqVerdict">' + cqVerdictPanel(d, false) + '</div>' +
        (d.canEdit ? '<div class="d-flex flex-wrap mb-4" style="gap:8px" id="cqActions">' + cqActionButtons() + '</div>' : '');
    $('#cqDetail').html(html);
    cqDetailTab(cq.dtab);
}

/** Re-reads the session and redraws everything except the video, which keeps playing where it was. */
function cqRefreshDetail() {
    var id = cq.detail && cq.detail.id;
    if (!id) return;
    cqGet('sessions/' + Number(id), {}, function (res) {
        if (!cq.detail || cq.detail.id !== id) return;
        var note = $('#cqNote').val();
        cq.detail = res.data;
        cq.editing = false;
        $('#cqDHead').html(cqDetailHead(cq.detail));
        $('#cqDRight').html(cqDetailRight(cq.detail));
        $('#cqVerdict').html(cqVerdictPanel(cq.detail, true));
        $('#cqNote').val(note || '');
        $('#cqActions').html(cqActionButtons());
        $('#cqDetail .cq-dtabs .nav-link[data-dtab="highlights"]').text(cqHighlightsLabel(cq.detail));
        cqDetailTab(cq.dtab);
    });
}

/** Attention items (flag types and flagged metrics) nobody has marked not true yet. */
function cqOpenItems(d) {
    var marks = cqMarks(d);
    var types = {};
    (d.flags || []).forEach(function (f) { if (!marks['FLAG|' + f.type]) types[f.type] = true; });
    return Object.keys(types).length + (d.metrics || []).filter(function (m) { return m.flagged && !marks['METRIC|' + m.code]; }).length;
}

function cqMarks(d) {
    var out = {};
    ((d.review || {}).notTrue || []).forEach(function (m) { out[m.itemType + '|' + m.itemKey] = m; });
    return out;
}

function cqDetailHead(d) {
    var rv = d.review || {};
    var length = d.actualMinutes != null ? d.actualMinutes + (d.durationMinutes ? ' of ' + d.durationMinutes : '') + ' min'
        : (d.durationMinutes ? d.durationMinutes + ' min booked' : null);
    var meta = [d.teacherName, d.gradeName, d.subjectName, d.sessionStart, length,
        d.studentCount != null ? d.studentCount + ' student' + (d.studentCount === 1 ? '' : 's') : null]
        .filter(function (x) { return x !== null && x !== undefined && x !== ''; }).map(cqEsc).join(' · ');
    var open = d.reviewStatus === 'PENDING' ? cqOpenItems(d) : 0;
    var html = '<div class="d-flex flex-wrap align-items-center mb-1" style="gap:8px"><h5 class="mb-0">' + cqEsc(d.title || 'Session') + '</h5>' +
        cqHealthPill(d.healthStatus, d.analysisStatus) + (d.kindLabel && d.kindLabel !== d.title ? '<span class="cq-chip">' + cqEsc(d.kindLabel) + '</span>' : '') +
        cqReviewBadge(d.reviewStatus) + (open ? '<span class="cq-open">' + open + ' FLAG' + (open === 1 ? '' : 'S') + ' OPEN</span>' : '') +
        '<button type="button" id="cqStar" class="cq-star ml-auto' + (rv.bookmarked ? ' on' : '') + '" aria-pressed="' + !!rv.bookmarked +
        '" onclick="cqBookmark()"><i class="fa fa-star' + (rv.bookmarked ? '' : '-o') + ' mr-1"></i>' + (rv.bookmarked ? 'Bookmarked' : 'Bookmark') + '</button></div>' +
        '<div class="small text-muted mb-2">' + meta + '</div>' +
        ((rv.tags || []).length ? '<div class="mb-2">' + rv.tags.map(cqTagChipRO).join('') + '</div>' : '');
    if (d.analysisStatus === 'PENDING') {
        html += '<div class="alert alert-info"><i class="fa fa-hourglass-half mr-1"></i>This session has not been checked yet. ' +
            'Checks run after the recording is ready.</div>';
    }
    if (d.reviewStatus && d.reviewStatus !== 'PENDING') {
        html += '<div class="alert alert-light border small mb-3"><b>' + cqEsc(CQ_REVIEW[d.reviewStatus]) + '</b>' +
            (d.reviewedByName ? ' by ' + cqEsc(d.reviewedByName) : '') + (d.reviewedAt ? ' on ' + cqEsc(d.reviewedAt) : '') +
            (d.reviewReason ? ': ' + cqEsc(d.reviewReason) : '') + '</div>';
    }
    return html;
}

function cqDetailRight(d) {
    var h = CQ_HEALTH[d.healthStatus];
    var analysed = d.analysisStatus === 'ANALYSED';
    return '<div class="card mb-3"><div class="card-body">' +
        '<div class="d-flex align-items-center" style="gap:12px"><div class="' + (analysed && h ? h.cls : 'cq-pending') + '"><span class="cq-big">' +
        (analysed && d.overallScore != null ? Math.round(d.overallScore) : '—') + '</span> <span class="text-muted">/ 100</span></div>' +
        '<div><div class="cq-headline">' + cqEsc(d.headline || '') + '</div>' +
        (d.teacherRecentAverage != null ? '<div class="small text-muted">' + cqEsc(d.teacherName || 'Teacher') + '\'s recent average: ' + Math.round(d.teacherRecentAverage) + '</div>' : '') +
        '</div></div>' +
        (d.originalOverallScore != null && d.overallScore != null && Number(d.originalOverallScore) !== Number(d.overallScore)
            ? '<div class="small text-muted mt-1">Changed by a reviewer · originally ' + Math.round(d.originalOverallScore) + '</div>' : '') +
        cqAiLine(d) +
        (d.aiSummary ? '<div class="cq-subhead">What happened</div><p class="mb-0">' + cqEsc(d.aiSummary) + '</p>' : '') +
        '</div></div>' + cqAttentionCard(d) +
        '<div class="card mb-3"><div class="card-body" id="cqMetrics">' + cqMetrics(d) + '</div></div>';
}

/** Claude scoring state, with Score / Re-score for reviewers when it is allowed. */
function cqAiLine(d) {
    var ai = d.ai || {};
    var btn = ai.canRescore ? '<button type="button" class="btn btn-outline-primary btn-sm ml-auto" id="cqRescoreBtn" onclick="cqRescore()">' +
        '<i class="fa fa-magic mr-1"></i>' + (ai.status === 'DONE' ? 'Re-score with AI' : 'Score with AI') + '</button>' : '';
    var showNote = d.canEdit && !ai.canRescore && ai.rescoreNote && ['DONE', 'FAILED', 'RETRY', 'NO_TRANSCRIPT'].indexOf(ai.status) >= 0;
    return '<div class="d-flex flex-wrap align-items-center mt-2" style="gap:8px"><span class="small text-muted"><i class="fa fa-magic mr-1"></i>' +
        cqEsc(ai.label || '') + (ai.scoredAt ? ' ' + cqEsc(ai.scoredAt) : '') + '</span>' + btn + '</div>' +
        (showNote ? '<div class="small text-muted mt-1">' + cqEsc(ai.rescoreNote) + '</div>' : '');
}

function cqRescore() {
    var btn = $('#cqRescoreBtn').prop('disabled', true);
    cqPost('sessions/' + Number(cq.detail.id) + '/rescore', {}, function (res) {
        cqToast(true, res.message || 'Scoring started.');
    }, function (msg) {
        btn.prop('disabled', false);
        cqToast(false, msg);
    });
}

/** "Marked not true by Asha · reason · Undo" under an item. */
function cqMarkLine(mark, type, key) {
    return '<div class="cq-ntnote"><i class="fa fa-ban mr-1"></i>Marked not true' + (mark.byName ? ' by ' + cqEsc(mark.byName) : '') +
        (mark.reason ? ' — “' + cqEsc(mark.reason) + '”' : '') + (mark.at ? ' · ' + cqEsc(mark.at) : '') +
        (cq.detail.canEdit ? ' · <a href="javascript:void(0)" onclick="cqNotTrueUndo(\'' + cqEsc(type) + '\', \'' + cqEsc(key) + '\')">Undo</a>' : '') + '</div>';
}

function cqNotTrueButton(type, key) {
    return cq.detail.canEdit && !cq.editing ? '<button type="button" class="btn btn-outline-secondary cq-ntbtn" onclick="cqNotTrueAsk(this, \'' +
        cqEsc(type) + '\', \'' + cqEsc(key) + '\')">Not true</button>' : '';
}

/**
 * Flags and flagged metrics together, worst first — what a reviewer should look at. Flags of one kind are one row
 * ("Late entry · 8 students"), so the count matches the session's flag count. Each row can be marked "Not true".
 */
function cqAttentionCard(d) {
    var marks = cqMarks(d);
    var flagged = (d.metrics || []).filter(function (m) { return m.flagged || marks['METRIC|' + m.code]; });
    var groups = [], byKey = {};
    (d.flags || []).forEach(function (f) {
        if (!byKey[f.type]) {
            byKey[f.type] = { type: f.type, label: f.label, severity: f.severity, items: [] };
            groups.push(byKey[f.type]);
        }
        byKey[f.type].items.push(f);
    });
    var n = groups.length + flagged.length;
    if (!n) return '';
    var open = cqOpenItems(d);
    var sevCls = { CRITICAL: 'badge-danger', MAJOR: 'badge-warning', MINOR: 'badge-secondary' };
    var html = '<div class="card mb-3"><div class="card-body"><h6>Needs attention · ' + open +
        (open !== n ? ' <span class="small text-muted">(' + (n - open) + ' marked not true)</span>' : '') + '</h6>';
    html += groups.map(function (g) {
        var mark = marks['FLAG|' + g.type];
        var people = g.items.filter(function (f) { return f.userName; }).length;
        var count = g.items.length > 1 ? ' <span class="text-muted">· ' + g.items.length + (people === g.items.length ? ' students' : '') + '</span>' : '';
        var lines = g.items.slice(0, 5).map(function (f) {
            return '<div class="d-flex justify-content-between small text-muted" style="gap:8px"><span>' + cqEsc(f.description || '') + '</span>' +
                (f.timestampSeconds != null ? '<a href="javascript:void(0)" class="text-nowrap" onclick="cqSeek(' + Number(f.timestampSeconds) + ')"><i class="fa fa-play-circle mr-1"></i>' + cqEsc(f.timestampLabel) + '</a>' : '') + '</div>';
        }).join('') + (g.items.length > 5 ? '<div class="small text-muted">and ' + (g.items.length - 5) + ' more — see Highlights or Students</div>' : '');
        return '<div class="cq-row" style="display:block"><div class="d-flex align-items-center" style="gap:6px"><span class="' + (mark ? 'cq-nt' : '') + '">' +
            '<span class="badge ' + (sevCls[g.severity] || 'badge-light') + ' mr-1">' + cqEsc(g.severity) + '</span><b>' + cqEsc(g.label) + '</b>' + count + '</span>' +
            '<span class="ml-auto">' + (mark ? '' : cqNotTrueButton('FLAG', g.type)) + '</span></div>' +
            (mark ? cqMarkLine(mark, 'FLAG', g.type) : '') + '<div class="' + (mark ? 'cq-nt' : '') + '">' + lines + '</div></div>';
    }).join('');
    html += flagged.map(function (m) {
        var mark = marks['METRIC|' + m.code];
        return '<div class="cq-row" style="display:block"><div class="d-flex align-items-center" style="gap:6px"><span class="' + (mark ? 'cq-nt' : '') + '">' +
            '<span class="cq-flagged mr-1">FLAGGED</span><b>' + cqEsc(m.name) + '</b> ' + cqScoreHtml(m.score, 10) + ' <span class="small text-muted">/ 10</span></span>' +
            '<span class="ml-auto">' + (mark ? '' : cqNotTrueButton('METRIC', m.code)) + '</span></div>' +
            (m.analysis ? '<div class="small text-muted">' + cqEsc(m.analysis) + '</div>' : '') + (mark ? cqMarkLine(mark, 'METRIC', m.code) : '') + '</div>';
    }).join('');
    return html + '</div></div>';
}

/** Opens a one-line form under the item: an optional reason and Mark not true. */
function cqNotTrueAsk(btn, type, key) {
    var row = $(btn).closest('.cq-row, .cq-metric');
    if (row.find('.cq-ntform').length) return;
    row.append('<div class="cq-ntform d-flex flex-wrap mt-2" style="gap:6px"><input type="text" class="form-control form-control-sm" style="max-width:300px" maxlength="500" ' +
        'placeholder="Why is it not true? (optional)" aria-label="Why is it not true"><button type="button" class="btn btn-danger btn-sm" onclick="cqNotTrueSave(this, \'' +
        cqEsc(type) + '\', \'' + cqEsc(key) + '\')">Mark not true</button><button type="button" class="btn btn-link btn-sm" onclick="$(this).closest(\'.cq-ntform\').remove()">Cancel</button>' +
        '<span class="text-danger small align-self-center cq-nterr"></span></div>');
    row.find('.cq-ntform input').focus();
}

function cqNotTrueSave(btn, type, key) {
    var form = $(btn).closest('.cq-ntform');
    $(btn).prop('disabled', true);
    cqPost('sessions/' + Number(cq.detail.id) + '/verdict', { itemType: type, itemKey: key, notTrue: true, reason: form.find('input').val() || null }, function (res) {
        cqToast(true, res.message || 'Marked not true.');
        cqRefreshDetail();
    }, function (msg) {
        $(btn).prop('disabled', false);
        form.find('.cq-nterr').text(msg);
    });
}

function cqNotTrueUndo(type, key) {
    cqPost('sessions/' + Number(cq.detail.id) + '/verdict', { itemType: type, itemKey: key, notTrue: false }, function (res) {
        cqToast(true, res.message || 'Mark removed.');
        cqRefreshDetail();
    });
}

/* ------------------------------------------------------------------ bookmark (personal) */

function cqBookmark() {
    var rv = cq.detail.review || {};
    var on = !rv.bookmarked;
    $('#cqStar').prop('disabled', true);
    cqPost('sessions/' + Number(cq.detail.id) + '/bookmark', { on: on }, function (res) {
        rv.bookmarked = on;
        cq.detail.review = rv;
        $('#cqStar').prop('disabled', false).toggleClass('on', on).attr('aria-pressed', String(on))
            .html('<i class="fa fa-star' + (on ? '' : '-o') + ' mr-1"></i>' + (on ? 'Bookmarked' : 'Bookmark'));
        cqToast(true, res.message || (on ? 'Bookmarked.' : 'Bookmark removed.'));
    }, function (msg) {
        $('#cqStar').prop('disabled', false);
        cqToast(false, msg);
    });
}

/* ------------------------------------------------------------------ session detail tabs */

function cqHighlightsLabel(d) {
    var n = cqTimed(d.highlights).length + ((d.review || {}).clips || []).length;
    return 'Highlights' + (n ? ' ' + n : '');
}

function cqDetailTabs(d) {
    var people = (d.participants || []).filter(function (p) { return p.role === 'Student'; }).length;
    var tabs = [['facts', 'Session facts'], ['highlights', cqHighlightsLabel(d)], ['transcript', 'Transcript'],
        ['chat', 'Chat'], ['students', 'Students' + (people ? ' ' + people : '')]];
    return '<ul class="nav nav-tabs cq-dtabs" role="tablist">' + tabs.map(function (t) {
        return '<li class="nav-item"><a class="nav-link" href="javascript:void(0)" role="tab" data-dtab="' + t[0] + '" onclick="cqDetailTab(\'' + t[0] + '\')">' + t[1] + '</a></li>';
    }).join('') + '</ul><div class="cq-dpane" id="cqDPane" role="tabpanel"></div>';
}

function cqDetailTab(name) {
    var d = cq.detail;
    if (!d) return;
    cq.dtab = name;
    $('#cqDetail .cq-dtabs .nav-link').removeClass('active').attr('aria-selected', 'false');
    $('#cqDetail .cq-dtabs .nav-link[data-dtab="' + name + '"]').addClass('active').attr('aria-selected', 'true');
    var pane = $('#cqDPane');
    if (name === 'highlights') pane.html(cqHighlightList(d));
    else if (name === 'transcript') cqTranscriptPane(pane);
    else if (name === 'chat') cqChatPane(pane);
    else if (name === 'students') pane.html(cqAttendance(d));
    else cqFactsPane(pane);
}

function cqTimed(list) {
    return (list || []).filter(function (x) { return x.timestampSeconds !== null && x.timestampSeconds !== undefined; });
}

function cqFact(label, value) {
    return '<div class="cq-fact"><span>' + cqEsc(label) + '</span><b>' + value + '</b></div>';
}

function cqFactsPane(pane) {
    var d = cq.detail, a = d.attendance || {};
    var teacher = (d.participants || []).filter(function (p) { return p.role === 'Teacher'; })[0];
    var html = cqFact('Class length', d.actualMinutes != null ? cqLength(d.actualMinutes, d.durationMinutes) : '—') +
        cqFact('Teacher joined', !teacher ? '<span class="text-muted">not in attendance</span>'
            : teacher.lateMinutes ? '<span class="cq-down">' + teacher.lateMinutes + ' min late</span>' : 'On time') +
        cqFact('Students present', a.studentsPresent != null ? a.studentsPresent : '—') +
        cqFact('Joined on time / late', (a.studentsOnTime != null ? a.studentsOnTime : '—') + ' / ' + (a.studentsLate != null ? a.studentsLate : '—')) +
        cqFact('Average minutes in class', a.averageMinutesPresent != null ? a.averageMinutesPresent : '—') +
        '<div class="cq-subhead">From the transcript</div><div id="cqTFacts"><div class="small text-muted py-2"><i class="fa fa-spinner fa-spin mr-1"></i>Reading the transcript…</div></div>';
    pane.html(html);
    cqLoadTranscript(function (t) {
        if (!t.available) {
            $('#cqTFacts').html('<div class="small text-muted py-2">' + cqEsc(cqNoTranscriptText()) + '</div>');
            return;
        }
        var f = t.facts || {};
        var none = '<span class="text-muted">—</span>';
        $('#cqTFacts').html(
            cqFact('Teacher talk share', f.teacherTalkPct != null ? f.teacherTalkPct + '%' : none) +
            cqFact('Students who spoke', f.studentsWhoSpoke != null ? f.studentsWhoSpoke : none) +
            cqFact('Questions the teacher asked', f.questionsAsked != null ? f.questionsAsked : none) +
            cqFact('Longest the teacher talked without a break', f.longestMonologueSeconds != null ? cqClock(f.longestMonologueSeconds) : none) +
            (f.teacherTalkPct == null ? '<div class="small text-muted mt-1">The teacher\'s name was not found among the speakers, so teacher figures cannot be worked out.</div>' : ''));
    }, function (msg) {
        $('#cqTFacts').html('<div class="small text-danger py-2">' + cqEsc(msg) + '</div>');
    });
}

function cqClock(sec) {
    var n = Math.max(0, Math.round(Number(sec) || 0)), m = Math.floor(n / 60), s2 = n % 60;
    return m + ':' + (s2 < 10 ? '0' : '') + s2;
}

/** The transcript is fetched from LENS storage once per session view and kept while the view is open. */
function cqLoadTranscript(ok, fail) {
    var id = cq.detail.id;
    if (cq.transcript && cq.transcript.id === id) {
        ok(cq.transcript.data);
        return;
    }
    cqGet('sessions/' + Number(id) + '/transcript', {}, function (res) {
        if (!cq.detail || cq.detail.id !== id) return;
        cq.transcript = { id: id, data: res.data };
        ok(res.data);
    }, function (xhr) {
        fail(cqErr(xhr, 'The transcript could not be loaded. Please try again.'));
    });
}

function cqHighlightList(d) {
    var tone = { CRITICAL: 'danger', MAJOR: 'warning', INFO: 'success' };
    var items = cqTimed(d.highlights).map(function (x) {
        return { at: Number(x.timestampSeconds), html: '<div class="cq-hlist"><button type="button" class="btn btn-sm btn-outline-' + (tone[x.severity] || 'primary') +
            '" onclick="cqSeek(' + Number(x.timestampSeconds) + ')" aria-label="Play from ' + cqEsc(x.timestampLabel) + '"><i class="fa fa-play"></i> ' +
            cqEsc(x.timestampLabel) + '</button><div><b>' + cqEsc(x.label) + '</b>' +
            (x.description ? '<div class="small text-muted">' + cqEsc(x.description) + '</div>' : '') + '</div></div>' };
    });
    ((d.review || {}).clips || []).forEach(function (c) {
        items.push({ at: Number(c.start), html: '<div class="cq-hlist"><button type="button" class="btn btn-sm btn-outline-info" onclick="cqPlayClip(' + Number(c.start) + ', ' + Number(c.end) +
            ')" aria-label="Play clip ' + cqEsc(c.title) + '"><i class="fa fa-film"></i> ' + cqEsc(c.startLabel) + '–' + cqEsc(c.endLabel) + '</button><div><b>Clip: ' + cqEsc(c.title) + '</b>' +
            '<div class="small text-muted">' + (c.byName ? cqEsc(c.byName) + ' · ' : '') + cqEsc(c.at || '') + '</div>' +
            (c.note ? '<div class="small">' + cqEsc(c.note) + '</div>' : '') + '</div>' +
            (d.canEdit ? '<button type="button" class="btn btn-link btn-sm text-danger" onclick="cqDeleteClip(' + Number(c.id) + ')" aria-label="Remove clip ' + cqEsc(c.title) + '"><i class="fa fa-trash"></i></button>' : '') +
            '</div>' });
    });
    items.sort(function (a, b) { return a.at - b.at; });
    var html = items.length ? items.map(function (x) { return x.html; }).join('')
        : '<div class="small text-muted py-2">No highlights yet. Moments worth watching come with AI scoring; attendance flags are under Needs attention.</div>';
    if (d.canEdit) {
        html += '<div id="cqClipBox"><button type="button" class="btn btn-outline-primary btn-sm mt-2" onclick="cqClipForm()"><i class="fa fa-plus mr-1"></i>Clip a moment</button></div>';
    }
    return html;
}

/** Plays the clip and stops at its end. */
function cqPlayClip(start, end) {
    var v = document.getElementById('cqVideo');
    if (!v) { cqToast(false, 'The recording is not available for this session yet.'); return; }
    if (cq.clipStop) v.removeEventListener('timeupdate', cq.clipStop);
    cq.clipStop = function () {
        if (v.currentTime >= end) {
            v.pause();
            v.removeEventListener('timeupdate', cq.clipStop);
            cq.clipStop = null;
        }
    };
    v.addEventListener('timeupdate', cq.clipStop);
    cqSeek(start);
}

/** "1:02:03", "2:03" or "123" as seconds; NaN when it is not a time. */
function cqParseClock(text) {
    var t = String(text || '').trim();
    if (!/^\d+(:\d{1,2}){0,2}$/.test(t)) return NaN;
    return t.split(':').reduce(function (total, part) { return total * 60 + Number(part); }, 0);
}

function cqClipForm() {
    var v = document.getElementById('cqVideo');
    var start = v ? Math.floor(v.currentTime || 0) : 0;
    $('#cqClipBox').html('<div class="cq-clipform"><div class="d-flex flex-wrap align-items-end mb-2" style="gap:8px">' +
        '<div><label class="small mb-0" for="cqClipStart">Start</label><br><input type="text" id="cqClipStart" class="form-control form-control-sm cq-time" value="' + cqClock(start) + '"></div>' +
        '<div><label class="small mb-0" for="cqClipEnd">End</label><br><input type="text" id="cqClipEnd" class="form-control form-control-sm cq-time" value="' + cqClock(start + 30) + '"></div>' +
        '<button type="button" class="btn btn-link btn-sm" onclick="cqClipNow(\'cqClipStart\')">Start = video time</button>' +
        '<button type="button" class="btn btn-link btn-sm" onclick="cqClipNow(\'cqClipEnd\')">End = video time</button></div>' +
        '<label class="small mb-0" for="cqClipTitle">Title</label><input type="text" id="cqClipTitle" class="form-control form-control-sm mb-2" maxlength="150" placeholder="e.g. Great recap at the end">' +
        '<label class="small mb-0" for="cqClipNote">Note (optional)</label><input type="text" id="cqClipNote" class="form-control form-control-sm mb-2" maxlength="500">' +
        '<div class="d-flex flex-wrap align-items-center" style="gap:8px"><button type="button" class="btn btn-primary btn-sm" id="cqClipSave" onclick="cqSaveClip()">Save clip</button>' +
        '<button type="button" class="btn btn-link btn-sm" onclick="cqDetailTab(\'highlights\')">Cancel</button><span id="cqClipError" class="text-danger small"></span></div></div>');
    $('#cqClipTitle').focus();
}

function cqClipNow(field) {
    var v = document.getElementById('cqVideo');
    $('#' + field).val(cqClock(v ? Math.floor(v.currentTime || 0) : 0));
}

function cqSaveClip() {
    var start = cqParseClock($('#cqClipStart').val()), end = cqParseClock($('#cqClipEnd').val());
    if (isNaN(start) || isNaN(end)) { $('#cqClipError').text('Write times like 12:40 or 1:02:05.'); return; }
    $('#cqClipSave').prop('disabled', true);
    cqPost('sessions/' + Number(cq.detail.id) + '/clips', { start: start, end: end, title: $('#cqClipTitle').val() || null, note: $('#cqClipNote').val() || null }, function (res) {
        cqToast(true, res.message || 'Clip saved.');
        cqRefreshDetail();
    }, function (msg) {
        $('#cqClipSave').prop('disabled', false);
        $('#cqClipError').text(msg);
    });
}

function cqDeleteClip(clipId) {
    cqPost('sessions/' + Number(cq.detail.id) + '/clips/' + Number(clipId) + '/delete', {}, function (res) {
        cqToast(true, res.message || 'Clip removed.');
        cqRefreshDetail();
    });
}

function cqTranscriptPane(pane) {
    pane.html('<div class="small text-muted py-2"><i class="fa fa-spinner fa-spin mr-1"></i>Reading the transcript…</div>');
    cqLoadTranscript(function (t) {
        if (cq.dtab !== 'transcript') return;
        if (!t.available) {
            pane.html('<div class="small text-muted py-2">' + cqEsc(cqNoTranscriptText()) + '</div>');
            return;
        }
        pane.html('<input type="search" class="form-control form-control-sm mb-2" placeholder="Search the transcript" aria-label="Search the transcript" oninput="cqFilterTranscript(this.value)">' +
            '<div class="small text-muted mb-1">' + t.lines.length + ' lines · teacher lines are shaded · click a time to play from there</div>' +
            '<div class="cq-transcript" id="cqTranscript">' + t.lines.map(function (l) {
                return '<div class="cq-tline' + (l.teacher ? ' t' : '') + '"><a href="javascript:void(0)" onclick="cqSeek(' + Number(l.at) + ')">' + cqEsc(l.clock) + '</a>' +
                    (l.speaker ? '<b>' + cqEsc(l.speaker) + ':</b> ' : '') + cqEsc(l.text) + '</div>';
            }).join('') + '</div>');
    }, function (msg) {
        pane.html('<div class="small text-danger py-2">' + cqEsc(msg) + '</div>');
    });
}

/** The class chat, fetched from LENS storage once per session view. LENS keeps a chat file only when the chat was used. */
function cqChatPane(pane) {
    var id = cq.detail.id;
    if (cq.chat && cq.chat.id === id) {
        cqRenderChat(pane, cq.chat.data);
        return;
    }
    if (cq.detail.hasChat === 'N') {
        cqRenderChat(pane, { available: false });
        return;
    }
    pane.html('<div class="small text-muted py-2"><i class="fa fa-spinner fa-spin mr-1"></i>Reading the chat…</div>');
    cqGet('sessions/' + Number(id) + '/chat', {}, function (res) {
        cq.chat = { id: id, data: res.data };
        if (cq.dtab === 'chat' && cq.detail && cq.detail.id === id) cqRenderChat(pane, res.data);
    }, function (xhr) {
        if (cq.dtab === 'chat') pane.html('<div class="small text-danger py-2">' + cqEsc(cqErr(xhr, 'The chat could not be loaded. Please try again.')) + '</div>');
    });
}

function cqRenderChat(pane, c) {
    if (!c || !c.available) {
        pane.html('<div class="small text-muted py-2">No chat in this class.</div>');
        return;
    }
    pane.html('<div class="small text-muted mb-1">' + c.messages.length + ' message' + (c.messages.length === 1 ? '' : 's') +
        ' · times are from the start of the meeting · click a time to play from there</div>' +
        '<div class="cq-transcript">' + c.messages.map(function (m) {
            return '<div class="cq-tline"><a href="javascript:void(0)" onclick="cqSeek(' + Number(m.at) + ')">' + cqEsc(m.clock) + '</a>' +
                (m.speaker ? '<b>' + cqEsc(m.speaker) + ':</b> ' : '') + cqEsc(m.text) + '</div>';
        }).join('') + '</div>');
}

function cqFilterTranscript(q) {
    var term = String(q || '').toLowerCase();
    $('#cqTranscript .cq-tline').each(function () {
        this.hidden = term !== '' && this.textContent.toLowerCase().indexOf(term) < 0;
    });
}

/** Shown only while scores are being edited; the verdict panel holds the review actions. */
function cqActionButtons() {
    if (!cq.editing) return '';
    return '<button type="button" class="btn btn-primary" onclick="cqSaveScores()"><i class="fa fa-save mr-1"></i>Save scores</button>' +
        '<button type="button" class="btn btn-outline-secondary" onclick="cqEditScores(false)">Cancel</button>' +
        '<span id="cqEditError" class="text-danger small align-self-center"></span>';
}

/* ------------------------------------------------------------------ verdict: tags, note, save / close / reject */

function cqLoadTags(done) {
    cqGet('tags', {}, function (res) {
        cq.tagCatalog = res.data || [];
        var sel = $('#cqFTag'), cur = sel.val();
        sel.html('<option value="">Any</option>' + cq.tagCatalog.map(function (t) {
            return '<option value="' + Number(t.id) + '">' + cqEsc(t.name) + '</option>';
        }).join('')).val(cur || '');
        if (done) done();
    }, function () { /* the tag filter stays at Any */ });
}

function cqTagName(id) {
    var t = cq.tagCatalog.filter(function (x) { return x.id === id; })[0];
    if (t) return t;
    return ((cq.detail.review || {}).tags || []).filter(function (x) { return x.id === id; })[0] || { id: id, name: 'Tag' };
}

function cqTagChipRO(t) {
    return '<span class="cq-tag' + (t.setsStatus === 'ESCALATED' ? ' esc' : '') + '">' + cqEsc(t.name) + '</span>';
}

function cqTagChips() {
    var d = cq.draft;
    var html = d.tagIds.map(function (id) {
        var t = cqTagName(id);
        return '<span class="cq-tag' + (t.setsStatus === 'ESCALATED' ? ' esc' : '') + '">' + cqEsc(t.name) +
            '<button type="button" onclick="cqRemoveTag(' + Number(id) + ')" aria-label="Remove tag ' + cqEsc(t.name) + '">&times;</button></span>';
    }).join('') + d.newTags.map(function (name, i) {
        return '<span class="cq-tag">' + cqEsc(name) + ' <small>(new)</small><button type="button" onclick="cqRemoveNewTag(' + i + ')" aria-label="Remove tag ' + cqEsc(name) + '">&times;</button></span>';
    }).join('');
    return html || '<span class="small text-muted">No tags yet.</span>';
}

function cqTagOptions() {
    return '<option value="">+ Add a tag</option>' + cq.tagCatalog.filter(function (t) { return cq.draft.tagIds.indexOf(t.id) < 0; })
        .map(function (t) { return '<option value="' + Number(t.id) + '">' + cqEsc(t.name) + '</option>'; }).join('');
}

function cqRedrawTags() {
    $('#cqTagChips').html(cqTagChips());
    $('#cqTagPick').html(cqTagOptions());
}

function cqAddTag(id) {
    var n = Number(id);
    if (n && cq.draft.tagIds.indexOf(n) < 0) cq.draft.tagIds.push(n);
    cqRedrawTags();
}

function cqRemoveTag(id) {
    cq.draft.tagIds = cq.draft.tagIds.filter(function (x) { return x !== id; });
    cqRedrawTags();
}

function cqRemoveNewTag(i) {
    cq.draft.newTags.splice(i, 1);
    cqRedrawTags();
}

/** Typing a name and pressing Enter adds that tag, creating it when no tag has that name. */
function cqCreateTag(input) {
    var name = $.trim($(input).val());
    if (!name) return;
    if (name.length > 50) { $('#cqVerdictError').text('A tag name can be at most 50 characters.'); return; }
    var existing = cq.tagCatalog.filter(function (t) { return t.name.toLowerCase() === name.toLowerCase(); })[0];
    if (existing) cqAddTag(existing.id);
    else if (cq.draft.newTags.map(function (x) { return x.toLowerCase(); }).indexOf(name.toLowerCase()) < 0) cq.draft.newTags.push(name);
    $(input).val('');
    $('#cqVerdictError').text('');
    cqRedrawTags();
}

function cqVerdictPanel(d, keepDraft) {
    var rv = d.review || {};
    if (!keepDraft || !cq.draft || cq.draft.id !== d.id) {
        cq.draft = { id: d.id, tagIds: (rv.tags || []).map(function (t) { return t.id; }), newTags: [] };
    }
    var marks = (rv.notTrue || []).length;
    var html = '<div class="card mb-3 cq-verdict"><div class="card-body">';
    if (d.canEdit) {
        html += '<div class="d-flex flex-wrap align-items-center mb-2" style="gap:8px"><h6 class="mb-0">Your verdict — tag it</h6><span class="small text-muted">· ' +
            (marks ? marks + ' item' + (marks === 1 ? '' : 's') + ' marked not true' : 'nothing marked not true') + '</span></div>' +
            '<div id="cqTagChips" class="mb-2">' + cqTagChips() + '</div>' +
            '<div class="d-flex flex-wrap mb-2" style="gap:8px"><select id="cqTagPick" class="form-control form-control-sm" style="max-width:220px" aria-label="Add a tag" onchange="cqAddTag(this.value)">' +
            cqTagOptions() + '</select><input type="text" id="cqTagNew" class="form-control form-control-sm" style="max-width:240px" maxlength="50" placeholder="Create a tag, press Enter" ' +
            'aria-label="Create a tag" onkeydown="if (event.key === \'Enter\') { event.preventDefault(); cqCreateTag(this); }"></div>' +
            '<label for="cqNote" class="small text-muted mb-1">Notes</label><textarea id="cqNote" class="form-control form-control-sm mb-2" rows="3" maxlength="1000" ' +
            'placeholder="Make notes about this session — what you saw, what to coach, anything the next reviewer should know."></textarea>' +
            '<div class="d-flex flex-wrap align-items-center" style="gap:8px"><button type="button" class="btn btn-primary btn-sm cq-vbtn" onclick="cqSaveVerdict(\'REVIEWED\')">' +
            '<i class="fa fa-check mr-1"></i>Save &amp; close</button><button type="button" class="btn btn-outline-primary btn-sm cq-vbtn" onclick="cqSaveVerdict(\'SAVE\')">Save, keep open</button>' +
            '<span id="cqVerdictError" class="text-danger small"></span><button type="button" class="btn btn-outline-danger btn-sm ml-auto cq-vbtn" onclick="cqRejectEvaluation()">' +
            'Reject (AI got it wrong)</button></div>';
    } else {
        html += '<h6>Reviewer tags</h6>' + ((rv.tags || []).length ? rv.tags.map(cqTagChipRO).join('') : '<div class="small text-muted">No tags yet.</div>');
    }
    return html + cqActivity(rv.activity) + '</div></div>';
}

function cqActivity(list) {
    var html = '<div class="cq-subhead">Activity</div>';
    if (!list || !list.length) return html + '<div class="small text-muted">No reviewer activity yet.</div>';
    return html + '<div style="max-height:240px;overflow-y:auto">' + list.map(function (a) {
        var quoted = a.action === 'NOTE' || a.action === 'REJECTED';
        return '<div class="cq-activity"><b>' + cqEsc(a.byName || 'Someone') + '</b> ' + cqEsc(CQ_ACTIVITY[a.action] || a.action.toLowerCase()) +
            (a.detail ? (quoted ? ': “' + cqEsc(a.detail) + '”' : ' ' + cqEsc(a.detail)) : '') + ' <span class="text-muted">· ' + cqEsc(a.at || '') + '</span></div>';
    }).join('') + '</div>';
}

function cqPostVerdict(action, reason, ok, fail) {
    var body = { action: action, reason: reason || null, tagIds: cq.draft.tagIds, newTags: cq.draft.newTags, note: $('#cqNote').val() || null };
    cqPost('sessions/' + Number(cq.detail.id) + '/review', body, function (res) {
        if (body.newTags.length) cqLoadTags();
        ok(res);
    }, fail);
}

function cqSaveVerdict(action) {
    $('#cqVerdictError').text('');
    $('.cq-vbtn').prop('disabled', true);
    cqPostVerdict(action, null, function (res) {
        $('.cq-vbtn').prop('disabled', false);
        cqToast(true, res.message || 'Saved.');
        if (action === 'REVIEWED') cqCloseDetail();
        else {
            // Saved: start the next edit from what the server now holds (new tags have ids).
            cq.draft = null;
            $('#cqNote').val('');
            cqRefreshDetail();
        }
    }, function (msg) {
        $('.cq-vbtn').prop('disabled', false);
        $('#cqVerdictError').text(msg);
    });
}

function cqRejectEvaluation() {
    $('#cqReviewTitle').text('Reject this evaluation');
    $('#cqReviewHelp').text('Say what the AI got wrong. This is kept with the session so the scoring can be corrected. Your tags and note are saved too.');
    $('#cqReviewReason').val('').removeClass('is-invalid');
    $('#cqReviewError').prop('hidden', true).text('');
    $('#cqReviewModal').modal('show');
}

/** Recordings with a playable link; archived ones (Glacier) have none until restored. */
function cqPlayable(d) {
    return (d.recordings || []).filter(function (r) { return !!r.url; });
}

function cqVideo(d) {
    if (d.recordingNote) return '<div class="cq-video"><span><i class="fa fa-trash-o mr-1"></i>' + cqEsc(d.recordingNote) + '</span></div>';
    var all = d.recordings || [];
    var recs = cqPlayable(d);
    if (!all.length) return '<div class="cq-video">Recording not available yet</div>';
    if (!recs.length) {
        var restoring = all.some(function (r) { return r.storageClass === 'RESTORING'; });
        return '<div class="cq-video"><div class="text-center px-3"><div><i class="fa fa-snowflake-o mr-1"></i>The recording is archived (Glacier).</div>' +
            (restoring ? '<div class="small mt-1"><i class="fa fa-spinner fa-spin mr-1"></i>Restore in progress, usually ready within a few minutes. Reopen the session then.</div>'
                : d.canEdit ? '<button type="button" class="btn btn-light btn-sm mt-2" id="cqRestoreBtn" onclick="cqRestore(' + Number(all[0].id) + ')">Restore recording</button>'
                    : '<div class="small mt-1">A reviewer can restore it.</div>') + '</div></div>';
    }
    var views = recs.length > 1 ? '<div class="btn-group btn-group-sm mt-2 flex-wrap" role="group" aria-label="Recording layout">' +
        recs.map(function (r, i) {
            return '<button type="button" class="btn btn-outline-secondary' + (i === 0 ? ' active' : '') + '" onclick="cqPart(' + i + ', this)">' + cqEsc(r.view || ('Recording ' + (i + 1))) + '</button>';
        }).join('') + '</div>' : '';
    return '<div class="cq-video"><video id="cqVideo" controls preload="metadata" src="' + cqEsc(recs[0].url) + '" onerror="cqVideoError()"></video></div>' + views;
}

function cqVideoError() {
    cqToast(false, 'This recording could not be loaded. Close and reopen the session to get a fresh link.');
}

function cqRestore(recordingId) {
    var btn = $('#cqRestoreBtn').prop('disabled', true);
    cqPost('sessions/' + Number(cq.detail.id) + '/recordings/restore', { recordingId: recordingId }, function (res) {
        cqToast(true, res.message || 'Restore requested.');
        btn.replaceWith('<div class="small mt-1"><i class="fa fa-spinner fa-spin mr-1"></i>Restore in progress, usually ready within a few minutes. Reopen the session then.</div>');
    }, function (msg) {
        btn.prop('disabled', false);
        cqToast(false, msg);
    });
}

function cqPart(i, btn) {
    var r = cqPlayable(cq.detail)[i];
    var v = document.getElementById('cqVideo');
    if (!r || !v) return;
    // Every layout is the same class, so carry the position over to the new one.
    var at = v.currentTime || 0, playing = !v.paused;
    v.src = r.url;
    v.addEventListener('loadedmetadata', function () {
        v.currentTime = at;
        if (playing) v.play().catch(function () { /* autoplay blocked; position is still set */ });
    }, { once: true });
    $(btn).addClass('active').siblings().removeClass('active');
}

function cqSeek(sec) {
    var v = document.getElementById('cqVideo');
    if (!v) { cqToast(false, 'The recording is not available for this session yet.'); return; }
    v.currentTime = Number(sec) || 0;
    v.play && v.play().catch(function () { /* autoplay blocked; position is still set */ });
    v.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function cqAttendance(d) {
    var a = d.attendance || {};
    var people = d.participants || [];
    var html = '<div><div>' +
        '<div class="d-flex flex-wrap mb-2" style="gap:24px">' +
        '<div><div class="h4 mb-0">' + (a.studentsPresent != null ? a.studentsPresent : '—') + '</div><div class="small text-muted">Students present</div></div>' +
        '<div><div class="h4 mb-0">' + (a.studentsOnTime != null ? a.studentsOnTime : '—') + '</div><div class="small text-muted">Joined on time</div></div>' +
        '<div><div class="h4 mb-0">' + (a.studentsLate != null ? a.studentsLate : '—') + '</div><div class="small text-muted">Late</div></div>' +
        '<div><div class="h4 mb-0">' + (a.averageMinutesPresent != null ? a.averageMinutesPresent : '—') + '</div><div class="small text-muted">Avg minutes in class</div></div></div>';
    if (!people.length) return html + '<div class="text-muted small">No attendance was recorded for this session.</div></div></div>';
    html += '<div class="cq-table-wrap"><table class="table table-sm mb-0"><thead><tr><th>Name</th><th>Role</th><th>Joined</th><th>Minutes</th><th>Late</th><th>Talk time</th><th>Devices</th></tr></thead><tbody>';
    html += people.map(function (p) {
        return '<tr><td>' + cqEsc(p.name) + '</td><td>' + cqEsc(p.role) + '</td><td class="text-nowrap">' + cqEsc(p.firstJoin) +
            '</td><td>' + (p.minutesPresent != null ? p.minutesPresent : '—') + '</td><td>' + (p.lateMinutes ? p.lateMinutes + ' min' : '—') +
            '</td><td>' + cqTalkTime(p.talkTimeSeconds) + '</td><td>' + (p.connections || 1) + '</td></tr>';
    }).join('');
    return html + '</tbody></table></div><div class="small text-muted mt-1">Talk time comes from the LENS transcript, matched by the name each person used in Zoom. ' +
        'It shows "—" until the transcript has been read.</div></div></div>';
}

/** "4 min 10 s", "35 s" or "—". */
function cqTalkTime(sec) {
    if (sec == null) return '—';
    var n = Math.max(0, Math.round(Number(sec) || 0));
    if (n < 60) return n + ' s';
    return Math.floor(n / 60) + ' min' + (n % 60 ? ' ' + (n % 60) + ' s' : '');
}

function cqMetrics(d) {
    var all = d.metrics || [];
    if (!all.length) return '<div class="text-muted">No metrics are switched on.</div>';
    if (cq.editing) {
        var html = '', lastCat = null;
        all.forEach(function (m) {
            if (m.category !== lastCat) {
                html += '<div class="cq-cat">' + cqEsc(CQ_CATEGORY[m.category] || m.category) + '</div>';
                lastCat = m.category;
            }
            html += cqMetricRow(m);
        });
        return html;
    }
    // Worst first, as reviewers read it: flagged, then the lowest scores; metrics without a score are listed once.
    var scored = all.filter(function (m) { return m.score != null; }).sort(function (a, b) {
        return (b.flagged - a.flagged) || (Number(a.score) - Number(b.score));
    });
    var unscored = all.filter(function (m) { return m.score == null; });
    var html2 = '<div class="d-flex align-items-center"><h6 class="mb-0">All ' + all.length + ' metrics — worst first</h6>' +
        (d.canEdit ? '<a href="javascript:void(0)" class="ml-auto small" onclick="cqEditScores(true)"><i class="fa fa-pencil mr-1"></i>Edit scores</a>' : '') +
        '</div>' + scored.map(cqMetricRow).join('');
    if (unscored.length) {
        html2 += '<div class="cq-subhead">Not scored yet · ' + unscored.length + '</div><div class="small text-muted">' +
            unscored.map(function (m) { return cqEsc(m.name); }).join(', ') + '. These need AI scoring.</div>';
    }
    return html2;
}

function cqMetricRow(m) {
    var chip = m.scoredBy === 'SMS' ? '<span class="cq-chip rule">' + (CQ_TRANSCRIPT_METRICS[m.code] ? 'Transcript rule' : 'Attendance rule') + '</span>'
        : '<span class="cq-chip ' + (m.sourceType === 'AI' ? 'ai' : 'rule') + '">' + (m.sourceType === 'AI' ? 'AI' : 'Rule-based') + '</span>';
    var html = '<div class="cq-metric"><div class="d-flex flex-wrap align-items-center" style="gap:6px"><b>' + cqEsc(m.name) + '</b>' + chip;
    if (cq.editing) {
        html += '<input type="number" class="form-control form-control-sm ml-auto cq-weight" min="0" max="10" step="0.5" aria-label="Score for ' + cqEsc(m.name) +
            '" data-metric="' + Number(m.metricConfigId) + '" data-orig="' + (m.score != null ? m.score : '') + '" value="' + (m.score != null ? m.score : '') + '"> <span class="small text-muted">/ 10</span>';
    } else {
        var mark = m.score != null ? cqMarks(cq.detail)['METRIC|' + m.code] : null;
        html += '<span class="ml-auto' + (mark ? ' cq-nt' : '') + '">' + cqScoreHtml(m.score, 10) + ' <span class="small text-muted">/ 10</span></span>' +
            (m.flagged && !mark ? '<span class="cq-flagged">FLAGGED</span>' : '') + (m.score != null && !mark ? cqNotTrueButton('METRIC', m.code) : '');
    }
    html += '</div>';
    if (!cq.editing && m.score != null && cqMarks(cq.detail)['METRIC|' + m.code]) html += cqMarkLine(cqMarks(cq.detail)['METRIC|' + m.code], 'METRIC', m.code);
    if (m.analysis) html += '<div class="cq-analysis">' + cqEsc(m.analysis) + '</div>';
    else if (m.score == null) html += '<div class="cq-analysis text-muted">Not scored yet.</div>';
    if (cq.editing) {
        html += '<textarea class="form-control form-control-sm mt-2" rows="2" maxlength="1000" placeholder="Your comment (optional)" aria-label="Comment for ' + cqEsc(m.name) +
            '" data-comment="' + Number(m.metricConfigId) + '" data-orig="' + cqEsc(m.reviewerComment || '') + '">' + cqEsc(m.reviewerComment || '') + '</textarea>';
    } else if (m.reviewerComment || m.edited) {
        html += '<div class="small mt-1"><i class="fa fa-user-circle-o mr-1"></i>' + (m.edited ? 'Edited' + (m.editedAt ? ' ' + cqEsc(m.editedAt) : '') +
            (m.originalScore != null ? ' · was ' + Number(m.originalScore).toFixed(1) : '') : '') + (m.reviewerComment ? ' — ' + cqEsc(m.reviewerComment) : '') + '</div>';
    }
    return html + '</div>';
}

function cqEditScores(on) {
    cq.editing = !!on;
    $('#cqMetrics').html(cqMetrics(cq.detail));
    $('#cqActions').html(cqActionButtons());
    if (on) document.getElementById('cqMetrics').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function cqSaveScores() {
    var changes = [], error = null;
    $('#cqMetrics input[data-metric]').each(function () {
        var id = Number($(this).data('metric'));
        var raw = $(this).val();
        var orig = String($(this).attr('data-orig'));
        var commentEl = $('#cqMetrics textarea[data-comment="' + id + '"]');
        var comment = commentEl.val();
        var commentChanged = comment !== commentEl.attr('data-orig');
        if (raw === '' && !commentChanged) return;
        var n = Number(raw);
        if (raw === '' || isNaN(n) || n < 0 || n > 10) {
            $(this).addClass('is-invalid');
            error = 'Scores must be numbers between 0 and 10.';
            return;
        }
        $(this).removeClass('is-invalid');
        var scoreChanged = orig === '' || Number(orig) !== n;
        if (scoreChanged || commentChanged) {
            changes.push({ metricConfigId: id, score: n, comment: comment || null });
        }
    });
    if (error) { $('#cqEditError').text(error); return; }
    if (!changes.length) { $('#cqEditError').text('Nothing has changed.'); return; }
    cqPost('sessions/' + Number(cq.detail.id) + '/scores', { scores: changes }, function (res) {
        cqToast(true, res.message || 'Scores saved.');
        cqRefreshDetail();
    }, function (msg) { $('#cqEditError').text(msg); });
}

function cqSubmitReview() {
    var reason = $.trim($('#cqReviewReason').val());
    if (!reason) {
        $('#cqReviewReason').addClass('is-invalid');
        $('#cqReviewError').prop('hidden', false).text('Please say what the AI got wrong.');
        return;
    }
    var btn = $('#cqReviewSave').prop('disabled', true);
    cqPostVerdict('REJECTED', reason, function (res) {
        btn.prop('disabled', false);
        $('#cqReviewModal').modal('hide');
        cqToast(true, res.message || 'Saved.');
        cqCloseDetail();
    }, function (msg) {
        btn.prop('disabled', false);
        $('#cqReviewError').prop('hidden', false).text(msg);
    });
}

/* ------------------------------------------------------------------ teachers */

function cqLoadTeachers() {
    cqLoading('#cqPane-teachers');
    cqGet('teachers', { from: cq.from, to: cq.to }, function (res) {
        var rows = res.teachers || [];
        var html = '<div class="main-card card mb-3"><div class="card-body"><div class="small text-muted mb-2">' + cqEsc(res.from) + ' to ' + cqEsc(res.to) +
            ', compared with ' + cqEsc(res.previousFrom) + ' to ' + cqEsc(res.previousTo) + '. Checked sessions are counted; the average score uses AI-scored sessions only. ' +
            'Click a teacher to see their report.</div>' +
            '<div class="cq-table-wrap"><table id="cqTeachersTable" class="table table-hover table-striped table-bordered w-100"></table></div></div></div>';
        $('#cqPane-teachers').html(html);
        cq.teachersTable = $('#cqTeachersTable').DataTable({
            data: rows, autoWidth: false, responsive: true, pageLength: 25, order: [[5, 'desc'], [4, 'desc']],
            language: { emptyTable: 'No checked sessions in this period.' },
            columns: [
                {
                    data: 'teacherName', title: 'Teacher', render: function (d, t, r) {
                        return t === 'display' ? '<a href="javascript:void(0)" onclick="cqOpenTeacher(' + Number(r.teacherUserId) + ')">' + cqEsc(d) + '</a>' : d;
                    }
                },
                { data: 'sessions', title: 'Sessions' },
                {
                    data: 'healthy', title: 'Healthy', render: function (d, t, r) {
                        return t === 'display' ? d + (r.healthRatio != null ? ' <small class="text-muted">(' + r.healthRatio + '%)</small>' : '') : d;
                    }
                },
                { data: 'quickMonitoring', title: 'Monitor' },
                { data: 'review', title: 'Review' },
                { data: 'critical', title: 'Critical' },
                { data: 'reviewed', title: 'Reviewed' },
                { data: 'bookmarked', title: 'My bookmarks', render: function (d, t) { return t === 'display' && d ? '<i class="fa fa-star cq-star-mark"></i>' + d : (d || 0); } },
                { data: 'averageScore', title: 'Avg score', render: function (d, t) { return t === 'display' ? cqScoreHtml(d, 100) : (d == null ? -1 : d); } },
                { data: 'scoreChange', title: 'vs previous', render: function (d, t) { return t === 'display' ? cqChange(d) : (d == null ? 0 : d); } },
                {
                    data: 'topFlags', title: 'Top flags', orderable: false, render: function (d) {
                        return (d || []).map(function (f) { return '<span class="cq-flag">' + cqEsc(f.label) + ' ×' + Number(f.count) + '</span>'; }).join('') ||
                            '<span class="text-muted">—</span>';
                    }
                },
                {
                    data: 'teacherUserId', title: 'Action', orderable: false, render: function (d) {
                        return '<button type="button" class="btn btn-primary btn-sm" onclick="cqOpenTeacher(' + Number(d) + ')">View report</button>';
                    }
                }
            ]
        });
    }, function (xhr) {
        $('#cqPane-teachers').html('<div class="alert alert-danger">' + cqEsc(cqErr(xhr, 'Teacher reports could not be loaded.')) + '</div>');
    });
}

function cqOpenTeacher(id) {
    cqLoading('#cqPane-teachers');
    cqGet('teachers/' + Number(id), { from: cq.from, to: cq.to }, function (res) {
        cqRenderTeacher(res.data);
    }, function (xhr) {
        $('#cqPane-teachers').html('<a href="javascript:void(0)" onclick="cqLoadTeachers()"><i class="fa fa-arrow-left mr-1"></i>All teachers</a>' +
            '<div class="alert alert-danger mt-2">' + cqEsc(cqErr(xhr, 'This report could not be loaded.')) + '</div>');
    });
}

function cqRenderTeacher(r) {
    cq.teacherReport = r;
    var s = r.stats || {};
    var html = '<a href="javascript:void(0)" onclick="cqLoadTeachers()" class="d-inline-block mb-2"><i class="fa fa-arrow-left mr-1"></i>All teachers</a>' +
        '<div class="d-flex flex-wrap align-items-center justify-content-between mb-2" style="gap:8px"><div><h5 class="mb-0">' + cqEsc(r.teacherName || 'Teacher') + '</h5>' +
        '<div class="small text-muted">' + cqEsc(r.from) + ' to ' + cqEsc(r.to) + ' · compared with ' + cqEsc(r.previousFrom) + ' to ' + cqEsc(r.previousTo) + '</div></div>' +
        '<button type="button" class="btn btn-outline-primary btn-sm" onclick="cqTeacherSessions()">' +
        '<i class="fa fa-list mr-1"></i>All sessions</button></div>' +
        '<div class="cq-cards">' +
        cqCard('cq-pending', s.sessions || 0, '', 'Sessions', 'Previous period: ' + (s.previousSessions || 0)) +
        cqCard('cq-healthy', s.averageScore != null ? Math.round(s.averageScore) : '—', '', 'Average score', 'Change: ' + cqChange(s.scoreChange)) +
        cqCard('cq-healthy', s.healthRatio != null ? s.healthRatio + '%' : '—', '', 'Healthy sessions', (s.healthy || 0) + ' of ' + (s.sessions || 0) + ' sessions') +
        cqCard('cq-critical', s.critical || 0, '', 'Critical', 'Previous period: ' + (s.previousCritical || 0)) + '</div>' +
        '<div class="cq-grid2"><div class="card"><div class="card-body"><h6>Score trend</h6>' +
        ((r.trend || []).some(function (d) { return d.averageScore != null; }) ? '<div id="cqChartTeacher"></div>'
            : '<div class="text-muted small py-4 text-center">No AI quality scores yet — these sessions have attendance checks only.</div>') + '</div></div>' +
        '<div class="card"><div class="card-body"><h6>Top flags</h6>' + cqTopFlags(r.topFlags) + '</div></div></div>' +
        '<div class="card mb-3"><div class="card-body"><h6>Metrics this period</h6><div class="cq-table-wrap"><table class="table table-sm mb-0"><thead><tr><th>Metric</th><th>Average</th><th>Previous</th><th>Change</th><th>Flagged</th></tr></thead><tbody>' +
        ((r.metricTrends || []).map(function (m) {
            return '<tr><td>' + cqEsc(m.name) + '</td><td>' + cqScoreHtml(m.average, 10) + '</td><td>' + (m.previousAverage != null ? Number(m.previousAverage).toFixed(1) : '—') +
                '</td><td>' + cqChange(m.change) + '</td><td>' + (m.flagged || 0) + '</td></tr>';
        }).join('') || '<tr><td colspan="5" class="text-muted">No scored metrics in this period.</td></tr>') +
        '</tbody></table></div></div></div>' +
        cqTeacherNotes(r) +
        '<div class="card mb-3"><div class="card-body"><h6>Recent sessions</h6>' + ((r.recentSessions || []).map(function (x) {
            return '<div class="cq-row"><div><a href="javascript:void(0)" onclick="cqOpenSession(' + Number(x.id) + ')">' + cqEsc(x.title || 'Session') + '</a>' +
                '<div class="small text-muted">' + cqEsc(x.sessionStart) + '</div></div><div>' +
                (x.analysisStatus === 'ANALYSED' ? cqScoreHtml(x.overallScore, 100) + ' ' : '') + cqHealthPill(x.healthStatus, x.analysisStatus) + '</div></div>';
        }).join('') || '<div class="text-muted small">No sessions in this period.</div>') + '</div></div>';
    $('#cqPane-teachers').html(html);
    var days = r.trend || [];
    cqChart('cqChartTeacher', {
        chart: { type: 'line', height: 220, toolbar: { show: false }, zoom: { enabled: false } },
        series: [{ name: 'Average score', data: days.map(function (d) { return d.averageScore; }) }],
        colors: [cqColor('--pc', '#007fff')], stroke: { width: 3, curve: 'smooth' }, markers: { size: 3 },
        xaxis: { categories: days.map(function (d) { return cqShortDay(d.day); }) }, yaxis: { min: 0, max: 100, tickAmount: 5 },
        dataLabels: { enabled: false }
    });
}

/** Reviewer tags and the latest notes on this teacher's sessions — the coaching picture. */
function cqTeacherNotes(r) {
    var tags = r.tags || [], notes = r.notes || [];
    var html = '<div class="card mb-3"><div class="card-body"><h6>Reviewer notes &amp; tags</h6>';
    html += tags.length ? '<div class="mb-2">' + tags.map(function (t) { return '<span class="cq-tag">' + cqEsc(t.name) + ' ×' + Number(t.count) + '</span>'; }).join('') + '</div>' : '';
    html += notes.length ? notes.map(function (n) {
        return '<div class="cq-activity"><a href="javascript:void(0)" onclick="cqOpenSession(' + Number(n.sessionId) + ')">' + cqEsc(n.sessionTitle || 'Session') + '</a>' +
            ' <span class="text-muted">· ' + cqEsc(n.sessionStart || '') + '</span><div>“' + cqEsc(n.note) + '”</div><div class="text-muted">' +
            cqEsc(n.byName || 'Someone') + ' · ' + cqEsc(n.at || '') + '</div></div>';
    }).join('') : (tags.length ? '' : '<div class="small text-muted">No reviewer notes or tags on this teacher\'s sessions in this period.</div>');
    return html + '</div></div>';
}

function cqTopFlags(list) {
    if (!list || !list.length) return '<div class="text-muted small">No flags in this period.</div>';
    var cls = { CRITICAL: 'cq-critical', MAJOR: 'cq-review', MINOR: 'cq-quick' };
    return list.map(function (f) {
        return '<div class="cq-row"><span>' + cqEsc(f.label) + '</span><span class="cq-pill ' + (cls[f.severity] || 'cq-review') + '">' + f.count + ' session' + (f.count === 1 ? '' : 's') + '</span></div>';
    }).join('');
}

function cqTeacherSessions() {
    var r = cq.teacherReport;
    if (!r) return;
    cq.teacherFilter = { id: r.teacherUserId, name: r.teacherName || 'this teacher' };
    cqTab('sessions');
}

/* ------------------------------------------------------------------ settings */

function cqLoadSettings() {
    cqLoading('#cqPane-settings');
    cqGet('settings', {}, function (res) { cqRenderSettings(res.data); }, function (xhr) {
        $('#cqPane-settings').html('<div class="alert alert-danger">' + cqEsc(cqErr(xhr, 'Settings could not be loaded.')) + '</div>');
    });
}

function cqRenderSettings(s) {
    var dis = s.canEdit ? '' : ' disabled';
    var html = (s.canEdit ? '' : '<div class="alert alert-light border small">You can view these settings. Changing them needs edit rights on Class Quality.</div>') +
        cqBackfillCard(s.canEdit) +
        '<div class="card mb-3"><div class="card-body"><h6>Module and attendance rules</h6><div class="small text-muted mb-2">Rules run after each recording; changes apply to sessions checked from now on.</div>';
    var aiRules = [];
    (s.rules || []).forEach(function (r) {
        var id = 'cqRule_' + r.key;
        if (r.key.indexOf('AI_') === 0) {
            aiRules.push(r);
            return;
        }
        if (r.type === 'KINDS') {
            var on = (r.value || '').split(',');
            html += '<div class="cq-row" style="align-items:flex-start"><span>' + cqEsc(r.label) +
                '<div class="small text-muted">Interviews, trainings and staff meetings are never checked.</div></span><div style="min-width:190px">' +
                Object.keys(CQ_KINDS).map(function (k) {
                    return '<div class="custom-control custom-checkbox"><input type="checkbox" class="custom-control-input cq-kind" id="cqKind_' + k +
                        '" value="' + k + '"' + (on.indexOf(k) >= 0 ? ' checked' : '') + dis + ' onchange="cqSaveKinds(this)">' +
                        '<label class="custom-control-label" for="cqKind_' + k + '">' + cqEsc(CQ_KINDS[k]) + '</label></div>';
                }).join('') + '</div></div>';
            return;
        }
        html += cqRuleRow(r, dis);
    });
    html += '</div></div>' + cqAiCard(aiRules, dis) + cqTagSettings(s) + '<div class="card mb-3"><div class="card-body"><h6>Session scoring</h6><div class="small text-muted mb-2">' +
        'Metrics that make up the overall score, and their weights. Changes apply to sessions scored from now on, so past scores stay comparable.</div>';
    var lastCat = null, demoHeading = false;
    (s.metrics || []).forEach(function (m) {
        if (m.demoOnly && !demoHeading) {
            html += '<h6 class="mt-4 mb-0">Demo-session metrics <span class="small text-muted">Scored only on demo sessions</span></h6>';
            demoHeading = true;
        }
        if (m.category !== lastCat) {
            html += '<div class="cq-cat">' + cqEsc(CQ_CATEGORY[m.category] || m.category) + '</div>';
            lastCat = m.category;
        }
        var id = 'cqMetric_' + Number(m.id);
        var sources = (m.dataSources || '').split(',').filter(Boolean).map(function (x) { return '<span class="cq-chip">' + cqEsc(x.trim()) + '</span>'; }).join(' ');
        // Switched-off metrics with no data source stay off; one already on can still be switched off.
        var noData = CQ_NO_DATA[m.code] && !m.activated ? CQ_NO_DATA[m.code] : null;
        if (noData) sources += ' <span class="cq-chip">' + cqEsc(noData) + '</span>';
        html += '<div class="cq-row"><div class="d-flex" style="gap:10px;min-width:0"><div class="custom-control custom-switch">' +
            '<input type="checkbox" class="custom-control-input" id="' + id + '"' + (m.activated ? ' checked' : '') + (noData ? ' disabled' : dis) +
            ' onchange="cqSaveMetric(' + Number(m.id) + ', {activated: this.checked ? \'Y\' : \'N\'}, this)"><label class="custom-control-label" for="' + id + '"><span class="sr-only">' + cqEsc(m.name) + ' on</span></label></div>' +
            '<div style="min-width:0"><b>' + cqEsc(m.name) + '</b> <span class="cq-chip ' + (m.sourceType === 'AI' ? 'ai' : 'rule') + '">' + (m.sourceType === 'AI' ? 'AI' : 'Rule-based') + '</span> ' +
            sources + (m.scoredBy === 'SMS' ? ' <span class="cq-chip rule">' + (CQ_TRANSCRIPT_METRICS[m.code] ? 'Worked out from the transcript' : 'Our attendance data') + '</span>' : '') +
            (m.notTrue30 ? ' <span class="cq-chip" style="background:#fdecef;color:var(--cq-critical)" title="Times reviewers marked this metric not true in the last 30 days">Marked not true ×' + Number(m.notTrue30) + ' (30 days)</span>' : '') +
            '<div class="small text-muted">' + cqEsc(m.description) + '</div></div></div>' +
            '<div class="text-nowrap"><label class="small text-muted mb-0 mr-1" for="' + id + '_w">Weight</label><input type="number" id="' + id + '_w" class="form-control form-control-sm d-inline-block cq-weight" min="0.1" max="10" step="0.1" value="' +
            cqEsc(m.weight) + '"' + dis + ' onchange="cqSaveMetric(' + Number(m.id) + ', {weight: Number(this.value)}, this)"></div></div>';
    });
    $('#cqPane-settings').html(html + '</div></div>');
    cqBackfillLoad();
    cqAiUsageLoad();
}

/** One setting: a switch (YN), a date (DATE) or a whole number (INT). */
function cqRuleRow(r, dis) {
    var id = 'cqRule_' + r.key;
    var control = r.type === 'YN'
        ? '<div class="custom-control custom-switch"><input type="checkbox" class="custom-control-input" id="' + id + '"' + (r.value === 'Y' ? ' checked' : '') + dis +
          ' onchange="cqSaveRule(\'' + r.key + '\', this.checked ? \'Y\' : \'N\', this)"><label class="custom-control-label" for="' + id + '"></label></div>'
        : r.type === 'DATE'
        ? '<input type="date" class="form-control form-control-sm" style="max-width:170px" id="' + id + '" value="' + cqEsc(r.value) + '"' + dis +
          ' onchange="cqSaveRule(\'' + r.key + '\', this.value, this)">'
        : '<input type="number" class="form-control form-control-sm cq-weight" id="' + id + '" min="' + r.min + '" max="' + r.max + '" value="' + cqEsc(r.value) + '"' + dis +
          ' onchange="cqSaveRule(\'' + r.key + '\', this.value, this)">';
    return '<div class="cq-row"><label class="mb-0" for="' + id + '">' + cqEsc(r.label) + (r.type === 'INT' ? ' <span class="small text-muted">(' + r.min + '–' + r.max + ')</span>' : '') + '</label>' + control + '</div>';
}

/** Claude scoring settings, with this month's usage filled in by cqAiUsageLoad. */
function cqAiCard(rules, dis) {
    if (!rules.length) return '';
    return '<div class="card mb-3"><div class="card-body"><h6>AI scoring (Claude)</h6><div class="small text-muted mb-2">' +
        'Claude reads each session\'s transcript and chat once and scores the AI metrics. Every answer is stored and reused, so a session is only sent ' +
        'again when a reviewer clicks Re-score. Student names are replaced with placeholders before anything is sent.</div>' +
        '<div id="cqAiUsage" class="mb-2"><div class="small text-muted"><i class="fa fa-spinner fa-spin mr-1"></i>Loading usage…</div></div>' +
        rules.map(function (r) { return cqRuleRow(r, dis); }).join('') + '</div></div>';
}

function cqAiUsageLoad() {
    if (!$('#cqAiUsage').length) return;
    cqGet('settings/ai-usage', {}, function (res) {
        var u = res.data || {};
        var cost = u.costUsd != null ? '$' + Number(u.costUsd).toFixed(2) : '—';
        $('#cqAiUsage').html((u.keyConfigured ? '' : '<div class="alert alert-warning small mb-2"><i class="fa fa-key mr-1"></i>' +
                'The Claude API key is not set (SETTINGS: CONFIGURATION / ANTHROPIC_API_KEY), so nothing is sent yet.</div>') +
            '<div class="d-flex flex-wrap" style="gap:24px">' +
            '<div><div class="h5 mb-0">' + Number(u.calls || 0) + '</div><div class="small text-muted">Calls this month</div></div>' +
            '<div><div class="h5 mb-0">' + Number(u.succeeded || 0) + '</div><div class="small text-muted">Scored</div></div>' +
            '<div><div class="h5 mb-0' + (u.failed ? ' cq-down' : '') + '">' + Number(u.failed || 0) + '</div><div class="small text-muted">Failed</div></div>' +
            '<div><div class="h5 mb-0">' + cost + '</div><div class="small text-muted">Estimated cost this month</div></div>' +
            '<div><div class="h5 mb-0">' + Number(u.todayAutomatic || 0) + ' / ' + Number(u.dailyMax || 0) + '</div><div class="small text-muted">Automatic today (all schools)</div></div>' +
            '</div><div class="small text-muted mt-1">Model ' + cqEsc(u.model || '') + '. Cost is an estimate from list prices; the Anthropic Console shows the bill.</div>');
    }, function (xhr) {
        $('#cqAiUsage').html('<div class="small text-danger">' + cqEsc(cqErr(xhr, 'AI usage could not be loaded.')) + '</div>');
    });
}

function cqTagSettings(s) {
    var dis = s.canEdit ? '' : ' disabled';
    var html = '<div class="card mb-3"><div class="card-body"><h6>Reviewer tags</h6><div class="small text-muted mb-2">Tags reviewers add to sessions. ' +
        'Hidden tags stay on sessions already tagged but are no longer offered. Built-in tags can be hidden, not renamed.</div>';
    (s.tags || []).forEach(function (t) {
        var id = 'cqTag_' + Number(t.id);
        html += '<div class="cq-row"><div class="d-flex align-items-center flex-wrap" style="gap:8px;min-width:0">' +
            (t.system || !s.canEdit ? '<b>' + cqEsc(t.name) + '</b>'
                : '<input type="text" class="form-control form-control-sm" style="max-width:220px" maxlength="50" value="' + cqEsc(t.name) + '" aria-label="Tag name" onchange="cqSaveTag(' + Number(t.id) + ', {name: this.value}, this)">') +
            (t.system ? '<span class="cq-chip">Built-in</span>' : '') + (t.setsStatus === 'ESCALATED' ? '<span class="cq-chip">Sets the session to Escalated</span>' : '') +
            '<span class="small text-muted">' + Number(t.uses) + ' session' + (t.uses === 1 ? '' : 's') + '</span></div>' +
            '<div class="custom-control custom-switch"><input type="checkbox" class="custom-control-input" id="' + id + '"' + (t.activated ? ' checked' : '') + dis +
            ' onchange="cqSaveTag(' + Number(t.id) + ', {activated: this.checked ? \'Y\' : \'N\'}, this)"><label class="custom-control-label" for="' + id + '">Shown</label></div></div>';
    });
    if (s.canEdit) {
        html += '<div class="d-flex flex-wrap mt-2" style="gap:8px"><input type="text" id="cqNewTag" class="form-control form-control-sm" style="max-width:240px" maxlength="50" placeholder="New tag name" aria-label="New tag name">' +
            '<button type="button" class="btn btn-outline-primary btn-sm" onclick="cqSaveTag(null, {name: $(\'#cqNewTag\').val()}, document.getElementById(\'cqNewTag\'))">Add tag</button></div>';
    }
    return html + '</div></div>';
}

function cqSaveTag(id, change, el) {
    var body = { id: id, name: change.name !== undefined ? change.name : null, activated: change.activated || null };
    cqPost('settings/tag', body, function (res) {
        cqToast(true, res.message || 'Tag saved.');
        cqLoadTags();
        cqLoadSettings();
    }, function (msg) {
        cqToast(false, msg);
        cqLoadSettings();
    });
}

function cqSaveKinds(el) {
    var kinds = $('#cqPane-settings .cq-kind:checked').map(function () { return this.value; }).get();
    if (!kinds.length) {
        $(el).prop('checked', true);
        cqToast(false, 'Choose at least one kind of session to check.');
        return;
    }
    cqSaveRule('INCLUDED_SESSION_KINDS', kinds.join(','), el);
}

/* ------------------------------------------------------------------ build from existing data */

var cqBackfillTimer = null;

function cqBackfillCard(canEdit) {
    var to = new Date(), from = new Date();
    from.setDate(to.getDate() - 29);
    return '<div class="card mb-3"><div class="card-body"><h6>Build from existing data</h6>' +
        '<div class="small text-muted mb-2">Runs the attendance checks over past sessions so the dashboard has history. Newest sessions first; ' +
        'safe to run again (sessions already checked are refreshed). A month usually takes under a minute. Up to 184 days per run.</div>' +
        (canEdit ? '<div class="d-flex flex-wrap align-items-end mb-2" style="gap:8px">' +
            '<div><label class="small mb-0" for="cqBfFrom">From</label><input type="date" id="cqBfFrom" class="form-control form-control-sm cq-date" value="' + cqDateStr(from) + '"></div>' +
            '<div><label class="small mb-0" for="cqBfTo">To</label><input type="date" id="cqBfTo" class="form-control form-control-sm cq-date" value="' + cqDateStr(to) + '"></div>' +
            '<button type="button" class="btn btn-primary btn-sm" id="cqBfStart" onclick="cqBackfillStart()"><i class="fa fa-play mr-1"></i>Start</button>' +
            '<button type="button" class="btn btn-outline-danger btn-sm" id="cqBfStop" onclick="cqBackfillStop()" hidden><i class="fa fa-stop mr-1"></i>Stop</button>' +
            '<span id="cqBfError" class="text-danger small"></span></div>' : '') +
        '<div id="cqBfStatus" class="small text-muted">Loading the last run…</div></div></div>';
}

function cqBackfillLoad() {
    cqGet('backfill', {}, function (res) { cqBackfillRender(res.data); }, function () {
        $('#cqBfStatus').text('The last run could not be loaded.');
    });
}

function cqBackfillRender(r) {
    clearTimeout(cqBackfillTimer);
    if (!$('#cqBfStatus').length) return;
    var running = r && r.status === 'RUNNING';
    $('#cqBfStart').prop('disabled', running);
    $('#cqBfStop').prop('hidden', !running).prop('disabled', !!(r && r.stopRequested));
    if (!r) {
        $('#cqBfStatus').text('No run yet.');
        return;
    }
    var badge = { RUNNING: 'badge-primary', DONE: 'badge-success', STOPPED: 'badge-secondary', FAILED: 'badge-danger' }[r.status] || 'badge-light';
    var html = '<div class="mb-1"><span class="badge ' + badge + ' mr-1">' + cqEsc(r.status) + '</span>' + cqEsc(r.from) + ' to ' + cqEsc(r.to) +
        (r.triggeredBy === 'CRON' ? ' · nightly catch-up' : '') + ' · started ' + cqEsc(r.startedAt) +
        (r.finishedAt ? ' · finished ' + cqEsc(r.finishedAt) : '') + '</div>';
    if (running) {
        html += '<div class="progress mb-1" style="height:8px"><div class="progress-bar" role="progressbar" style="width:' + Number(r.percent) +
            '%" aria-valuenow="' + Number(r.percent) + '" aria-valuemin="0" aria-valuemax="100"></div></div>' +
            '<div>' + r.processed + ' of ' + r.total + ' sessions · ' + r.checked + ' checked · ' + r.skipped + ' skipped · ' + r.failed + ' failed' +
            (r.stopRequested ? ' · stopping…' : '') + '</div>' + (r.message ? '<div>' + cqEsc(r.message) + '</div>' : '');
        cqBackfillTimer = setTimeout(function () {
            if (!$('#cqPane-settings').prop('hidden')) cqBackfillLoad();
        }, 3000);
    } else if (r.message) {
        html += '<div>' + cqEsc(r.message) + '</div>';
    }
    $('#cqBfStatus').removeClass('text-muted').html(html);
}

function cqBackfillStart() {
    var from = $('#cqBfFrom').val(), to = $('#cqBfTo').val();
    $('#cqBfError').text('');
    if (!from || !to) { $('#cqBfError').text('Choose a start and an end date.'); return; }
    if (from > to) { $('#cqBfError').text('Start date must be on or before the end date.'); return; }
    $('#cqBfStart').prop('disabled', true);
    cqPost('backfill/start', { from: from, to: to }, function (res) {
        cqToast(true, res.message || 'Started.');
        cqBackfillLoad();
    }, function (msg) {
        $('#cqBfStart').prop('disabled', false);
        $('#cqBfError').text(msg);
    });
}

function cqBackfillStop() {
    $('#cqBfStop').prop('disabled', true);
    cqPost('backfill/stop', {}, function (res) {
        cqToast(true, res.message || 'Stopping.');
        cqBackfillLoad();
    }, function (msg) {
        $('#cqBfStop').prop('disabled', false);
        cqToast(false, msg);
    });
}

function cqSaveRule(key, value, el) {
    cqPost('settings/rule', { key: key, value: String(value) }, function (res) {
        cqToast(true, res.message || 'Setting saved.');
        if (key === 'MODULE_ENABLED') {
            cq.enabled = value === 'Y';
            cqInitBannerOnly();
        }
    }, function (msg) {
        cqToast(false, msg);
        cqLoadSettings();
    });
}

function cqInitBannerOnly() {
    $('#cqBanner').html(cq.enabled ? '' : '<div class="alert alert-warning"><i class="fa fa-pause-circle mr-1"></i>Class Quality is switched off, so new sessions are not checked as their recordings finish.</div>');
}

function cqSaveMetric(id, change, el) {
    var body = $.extend({ id: id }, change);
    if (change.weight !== undefined && (isNaN(change.weight) || change.weight <= 0 || change.weight > 10)) {
        cqToast(false, 'The weight must be more than 0 and at most 10.');
        cqLoadSettings();
        return;
    }
    cqPost('settings/metric', body, function (res) { cqToast(true, res.message || 'Metric saved.'); }, function (msg) {
        cqToast(false, msg);
        cqLoadSettings();
    });
}
