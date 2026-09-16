// Student Management > Dashboard  (Student Enrollment Dashboard) - Phase 1
// Logic + AJAX + ApexCharts. HTML in studentEnrollmentDashboardContent.js.
// Endpoint: {schoolUuid}/dashboard/student-enrollment-dashboard  (POST, JSON auto-wrapped as Payload).

var SED_COLORS = {
    brand: '#3d5af1', teal: '#0f766e', violet: '#7c3aed',
    good: '#16a34a', warn: '#c2790a', crit: '#dc2626', faint: '#98a2b3'
};
var SED_CHARTS = {};
var SED_MODULE_ID;
var SED_REGMIX_TYPES = [];   // raw REGISTRATION_TYPE per reg-mix slice
var SED_COUNTRY_MAP = {};    // country name -> id
var SED_GRADE_MAP = {};      // grade name -> id

function renderStudentEnrollmentDashboard(title, roleAndModule, schoolId, userId, userRole) {
    SED_MODULE_ID = (roleAndModule && roleAndModule.moduleId) ? roleAndModule.moduleId : (typeof MODULE_ID !== 'undefined' ? MODULE_ID : '');
    SED_FILTERS_LOADED = false;
    $('#dashboardContentInHTML').html(getStudentEnrollmentDashboardContent(title));
    bindStudentEnrollmentDashboardEvents();
    fetchStudentEnrollmentDashboard();
    fetchStudentEnrollmentFinance();
    fetchStudentEnrollmentInsights();
}

function getRequestForStudentEnrollmentDashboard() {
    var data = {};
    data['schoolId'] = SCHOOL_ID;
    data['userId'] = USER_ID;
    data['moduleId'] = SED_MODULE_ID;
    data['sessionId'] = parseInt($('#sedFilterSession').val(), 10) || 0;   // 0 = current active session
    data['registrationType'] = $('#sedFilterRegType').val() || '';
    data['country'] = parseInt($('#sedFilterCountry').val(), 10) || 0;
    data['grade'] = parseInt($('#sedFilterGrade').val(), 10) || 0;
    return data;
}

function fetchStudentEnrollmentDashboard() {
    $.ajax({
        type: 'POST',
        contentType: APPLICATION_JSON_VALUE,
        url: getURLForHTML('dashboard', 'student-enrollment-dashboard'),
        data: JSON.stringify(getRequestForStudentEnrollmentDashboard()),
        dataType: 'json',
        cache: false,
        timeout: 600000,
        success: function (data) {
            if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
                if (data['status'] == '3') { redirectLoginPage(); return; }
                showMessageTheme2(0, data['message'] || 'Unable to load dashboard.');
                return;
            }
            renderStudentEnrollmentDashboardData(data);
        },
        error: function (xhr, status, error) {
            if (checkonlineOfflineStatus()) { return; }
            console.error('student-enrollment-dashboard error: ' + error);
            showMessageTheme2(0, 'Unable to load dashboard. Please retry.');
        }
    });
}

function renderStudentEnrollmentDashboardData(data) {
    var s = data.summary || {};
    var onb = data.onboarding || {};

    $('#sedSessionLabel').text(data.sessionLabel || '—');
    sedPopulateFilters(data);

    // KPI tiles
    sedSetVal('sedTotal', s.total);
    sedSetVal('sedFresh', s.fresh);
    sedSetVal('sedActive', s.active);
    sedSetVal('sedReEnroll', s.reEnroll);
    sedSetVal('sedWithdrawn', s.withdrawn);
    sedSetVal('sedBooked', s.bookedSeat);
    sedSetVal('sedLearningActive', onb.learningActive);
    // show advance next-grade count inside the Re-Enrollments card (clickable)
    $('[data-sed-kpi="sedReEnroll"] .sed-foot').html('next grade · <b class="sed-adv-link" style="color:#7c3aed;cursor:pointer;text-decoration:underline;">' + Number(s.advance || 0).toLocaleString() + ' advance</b>');

    sedRenderNewReChart(s);
    sedRenderRegMixChart(data.registrationMix || []);
    sedRenderReadiness(onb);
    sedRenderFunnel(onb);
    sedRenderBatchKpis(data.batchSummary || {});
    SED_STATE.onboarding = onb;
    sedTryRenderActions();
}

// Batch KPI tiles + avg
function sedRenderBatchKpis(b) {
    var total = Number(b.total || 0), students = Number(b.students || 0);
    sedSetVal('sedBatTotal', total);
    sedSetVal('sedBatActive', b.active);
    sedSetVal('sedBatTeacher', b.withTeacher);
    sedSetVal('sedBatStudents', students);
    sedSetVal('sedBatFull', b.full);
    $('#sedBatAvg').text(total > 0 ? (students / total).toFixed(1) : '0');
}

function sedSetVal(id, v) {
    $('#' + id).text(Number(v || 0).toLocaleString());
}

/* ---------- charts ---------- */
function sedDonut(sel, labels, series, colors, centerLabel, onClick) {
    if (typeof ApexCharts === 'undefined') { return; }
    if (SED_CHARTS[sel]) { try { SED_CHARTS[sel].destroy(); } catch (e) {} }
    var opt = {
        chart: {
            type: 'donut', height: 230, fontFamily: 'inherit',
            events: { dataPointSelection: function (e, c, cfg) { if (onClick) { onClick(cfg.dataPointIndex); } } }
        },
        series: series, labels: labels, colors: colors,
        stroke: { width: 2, colors: ['#ffffff'] },
        dataLabels: {
            enabled: true, style: { fontSize: '10.5px', fontWeight: '600', colors: ['#fff'] },
            dropShadow: { enabled: true, blur: 2, opacity: .45 },
            formatter: function (val, o) { return o.w.config.series[o.seriesIndex].toLocaleString(); }
        },
        plotOptions: { pie: { donut: { size: '70%', labels: {
            show: true,
            value: { show: true, fontSize: '22px', fontWeight: 700, color: '#1a2233', formatter: function (v) { return Number(v).toLocaleString(); } },
            total: { show: true, label: centerLabel, color: '#98a2b3', fontSize: '11px',
                formatter: function (w) { return w.globals.seriesTotals.reduce(function (a, b) { return a + b; }, 0).toLocaleString(); } }
        } } } },
        legend: { position: 'bottom', fontSize: '11px', labels: { colors: '#5b6577' }, markers: { width: 9, height: 9, radius: 3 } },
        tooltip: { theme: 'dark', style: { fontSize: '12px' } }
    };
    var c = new ApexCharts(document.querySelector(sel), opt);
    c.render();
    SED_CHARTS[sel] = c;
}

function sedRenderNewReChart(s) {
    var metrics = ['fresh', 'reEnroll', 'withdrawn'];
    var titles = ['New Enrollment', 'Re-Enrollment', 'Withdrawn'];
    sedDonut('#sedNewReChart', titles,
        [Number(s.fresh || 0), Number(s.reEnroll || 0), Number(s.withdrawn || 0)],
        [SED_COLORS.teal, SED_COLORS.violet, SED_COLORS.crit], 'Total',
        function (i) { sedOpenDrawer(metrics[i], titles[i]); });
}

// Map raw REGISTRATION_TYPE -> human label (mirrors ReportServiceImpl label CASE).
function sedRegLabel(t) {
    switch ((t || '').toUpperCase()) {
        case 'BATCH': return 'Group';
        case 'ONE_TO_ONE': return 'One-to-One';
        case 'ONE_TO_ONE_FLEX': return 'Flexy';
        case 'SCHOLARSHIP': return 'Self Study';
        case 'SSP': return 'Self Study Plus';
        case 'DUAL_DIPLOMA': return 'Dual Diploma';
        default: return t || 'Other';
    }
}

function sedRenderRegMixChart(mix) {
    var palette = [SED_COLORS.brand, SED_COLORS.teal, SED_COLORS.violet, SED_COLORS.warn, SED_COLORS.good, SED_COLORS.faint, '#e07b1a'];
    var labels = [], series = [], colors = [];
    SED_REGMIX_TYPES = [];
    for (var i = 0; i < mix.length; i++) {
        if (!mix[i].type) { continue; }
        labels.push(sedRegLabel(mix[i].type));
        series.push(Number(mix[i].count || 0));
        colors.push(palette[i % palette.length]);
        SED_REGMIX_TYPES.push(mix[i].type);
    }
    if (series.length === 0) { labels = ['No data']; series = [0]; colors = [SED_COLORS.faint]; }
    sedDonut('#sedRegMixChart', labels, series, colors, 'Students',
        function (i) { if (SED_REGMIX_TYPES[i]) { sedOpenDrawer('enrolledActive', labels[i], { registrationType: SED_REGMIX_TYPES[i] }); } });
}

/* ---------- readiness (segmented bars) ---------- */
function sedSeg(parts) { // parts: [{w, color}]
    var h = '<div class="sed-seg">';
    for (var i = 0; i < parts.length; i++) {
        h += '<i style="width:' + parts[i].w + '%;background:' + parts[i].color + ';"></i>';
    }
    return h + '</div>';
}
function sedPct(n, total) { return total > 0 ? (Number(n || 0) / total * 100) : 0; }

function sedRenderReadiness(o) {
    var total = Number(o.activeTotal || 0);
    $('#sedReadinessHint').text('of ' + total.toLocaleString() + ' active');
    var rows = [
        { name: 'Subject Mapping', segs: [
            { n: o.subjectMapped, label: 'mapped', color: SED_COLORS.good, metric: 'subjectMapped' },
            { n: o.subjectNone, label: 'not mapped', color: SED_COLORS.crit, metric: 'subjectNone' } ] },
        { name: 'LMS Account', segs: [
            { n: o.lmsActive, label: 'active', color: SED_COLORS.good, metric: 'lmsActive' },
            { n: o.lmsNone, label: 'not created', color: SED_COLORS.crit, metric: 'lmsNone' } ] },
        { name: 'Teacher Mapping', segs: [
            { n: o.teacherMapped, label: 'mapped', color: SED_COLORS.good, metric: 'teacherMapped' },
            { n: o.teacherNone, label: 'not mapped', color: SED_COLORS.warn, metric: 'teacherNone' } ] },
        { name: 'Batch Mapping', note: 'group only', denom: Number(o.batchTotal || 0), segs: [
            { n: o.batchMapped, label: 'mapped', color: SED_COLORS.good, metric: 'batchMapped' },
            { n: o.batchNone, label: 'not mapped', color: SED_COLORS.warn, metric: 'batchNone' } ] },
        { name: 'System Training', segs: [
            { n: o.trainingDone, label: 'done', color: SED_COLORS.good, metric: 'trainingDone' },
            { n: o.trainingPending, label: 'pending', color: SED_COLORS.warn, metric: 'trainingPending' },
            { n: o.trainingNone, label: 'not set', color: SED_COLORS.crit, metric: 'trainingNone' } ] },
        { name: 'Transcript', segs: [
            { n: o.transcriptPublished, label: 'published', color: SED_COLORS.teal, metric: 'transcriptPublished' },
            { n: o.transcriptPending, label: 'pending', color: '#e6e9f0', metric: 'transcriptPending' } ] },
        { name: 'Academic Date', segs: [
            { n: o.acadDateSet, label: 'chosen', color: SED_COLORS.good, metric: 'acadDateSet' },
            { n: o.acadDateNone, label: 'not chosen', color: SED_COLORS.crit, metric: 'acadDateNone' } ] }
    ];
    // Fee overdue + Re-enroll pending (moved here from the removed "Action needed" card)
    var feeOverdue = Number((SED_STATE.fee || {}).overdueStudents || 0);
    var reEnrollPending = Number((SED_STATE.insights || {}).reEnrollPending || 0);
    rows.push({ name: 'Fee', segs: [
        { n: Math.max(0, total - feeOverdue), label: 'on time', color: SED_COLORS.good, metric: '' },
        { n: feeOverdue, label: 'overdue', color: SED_COLORS.crit, metric: 'feeOverdue' } ] });
    rows.push({ name: 'Re-enroll · next grade', note: 'eligible, no next-grade payment', segs: [
        { n: reEnrollPending, label: 'pending', color: SED_COLORS.brand, metric: 'reEnrollPending' },
        { n: Math.max(0, total - reEnrollPending), label: '', color: '#eef1f7', metric: '' } ] });
    // Contact: student/parent phone valid vs invalid (bad code like "+ma" / empty)
    rows.push({ name: 'Contact', note: 'student & parent phone', segs: [
        { n: o.contactValid, label: 'valid', color: SED_COLORS.good, metric: 'contactValid' },
        { n: o.contactInvalid, label: 'invalid', color: SED_COLORS.crit, metric: 'contactInvalid' } ] });
    var html = '';
    for (var r = 0; r < rows.length; r++) {
        var row = rows[r], parts = [], vtxt = [];
        var rowDenom = (row.denom !== undefined) ? row.denom : total; // Batch Mapping = over group students only
        for (var i = 0; i < row.segs.length; i++) {
            var seg = row.segs[i];
            parts.push({ w: sedPct(seg.n, rowDenom), color: seg.color });
            if (!seg.label) { continue; }   // spacer segment (bar only, no value text)
            vtxt.push('<span class="sed-onb-v" data-sed-onb="' + seg.metric + '" data-sed-label="' + row.name + ' · ' + seg.label + '">'
                + '<b>' + Number(seg.n || 0).toLocaleString() + '</b> ' + seg.label + '</span>');
        }
        var rowName = row.name + (row.note ? ' <span class="sed-rnote">· ' + row.note + (row.denom !== undefined ? ' (' + Number(row.denom || 0).toLocaleString() + ')' : '') + '</span>' : '');
        html += '<div class="sed-rrow">'
            + '<div class="sed-rtop"><span class="sed-rn">' + rowName + '</span>'
            + '<span class="sed-rv">' + vtxt.join(' · ') + '</span></div>'
            + sedSeg(parts) + '</div>';
    }
    html += '<div class="sed-legend">'
        + '<span class="sed-li"><span class="sed-sw" style="background:' + SED_COLORS.good + '"></span>Done / Active</span>'
        + '<span class="sed-li"><span class="sed-sw" style="background:' + SED_COLORS.warn + '"></span>Pending</span>'
        + '<span class="sed-li"><span class="sed-sw" style="background:' + SED_COLORS.crit + '"></span>Missing</span>'
        + '</div>';
    $('#sedReadiness').html(html);
}

/* ---------- funnel ---------- */
function sedRenderFunnel(o) {
    var steps = [
        { lab: 'Enrolled', n: o.activeTotal, c: SED_COLORS.brand, metric: 'enrolledActive' },
        { lab: 'Subject mapped', n: o.subjectMapped, c: SED_COLORS.teal, metric: 'subjectMapped' },
        { lab: 'LMS created', n: o.lmsActive, c: SED_COLORS.teal, metric: 'lmsActive' },
        { lab: 'Teacher mapped', n: o.teacherMapped, c: SED_COLORS.violet, metric: 'teacherMapped' },
        { lab: 'Training done', n: o.trainingDone, c: SED_COLORS.warn, metric: 'trainingDone' },
        { lab: 'Fully onboarded', n: o.learningActive, c: SED_COLORS.good, metric: 'learningActive' }
    ];
    var max = Number(steps[0].n || 0) || 1;
    var html = '';
    for (var i = 0; i < steps.length; i++) {
        var n = Number(steps[i].n || 0);
        var pct = Math.round(n / max * 100);
        var prev = i === 0 ? n : Number(steps[i - 1].n || 0);
        var conv = i === 0 ? 100 : (prev > 0 ? Math.round(n / prev * 100) : 0);
        html += '<div class="sed-fstep" style="cursor:pointer;" data-sed-metric="' + steps[i].metric + '" data-sed-label="' + steps[i].lab + '">'
            + '<div class="sed-lab"><span class="sed-dot" style="background:' + steps[i].c + '"></span>' + steps[i].lab + '</div>'
            + '<div class="sed-track"><div class="sed-fill" data-w="' + pct + '" style="width:0;background:' + steps[i].c + '">' + pct + '%</div></div>'
            + '<div class="sed-rt"><b>' + n.toLocaleString() + '</b><span>' + (i === 0 ? 'start' : conv + '% of prev') + '</span></div>'
            + '</div>';
    }
    $('#sedFunnel').html(html);
    // animate widths
    setTimeout(function () {
        $('#sedFunnel .sed-fill').each(function () { $(this).css('width', $(this).attr('data-w') + '%'); });
    }, 60);
}

/* ---------- events ---------- */
function bindStudentEnrollmentDashboardEvents() {
    $(document).off('click', '#sedRefreshAll').on('click', '#sedRefreshAll', function () {
        sedFetchAll();
    });
    $(document).off('click', '#sedApply').on('click', '#sedApply', function () {
        sedFetchAll();
    });
    $(document).off('click', '#sedReset').on('click', '#sedReset', function () {
        // back to defaults: current session + all reg-type / country / grade, then reload
        $('#sedFilterSession, #sedFilterRegType, #sedFilterCountry, #sedFilterGrade').each(function () {
            var $s = $(this);
            // session resets to the current/active session, the others to "All"
            $s.val($s.attr('id') === 'sedFilterSession' ? SED_DEFAULT_SESSION : '');
            if ($s.hasClass('select2-hidden-accessible')) { $s.trigger('change.select2'); }
        });
        sedFetchAll();
    });
    $(document).off('click', '[data-sed-kpi]').on('click', '[data-sed-kpi]', function () {
        var metric = SED_KPI_METRIC[$(this).attr('data-sed-kpi')];
        if (!metric) { return; }
        sedOpenDrawer(metric, $(this).find('.sed-cap').text());
    });
    $(document).off('click', '#sedDrawerClose, #sedDrawerOverlay').on('click', '#sedDrawerClose, #sedDrawerOverlay', function () {
        sedCloseDrawer();
    });
    // "of N active" -> active enrolled student list
    $(document).off('click', '#sedReadinessHint').on('click', '#sedReadinessHint', function () {
        sedOpenDrawer('enrolledActive', 'Active enrolled');
    });
    // advance next-grade link inside Re-Enrollments card
    $(document).off('click', '.sed-adv-link').on('click', '.sed-adv-link', function (e) {
        e.stopPropagation();
        sedOpenDrawer('advance', 'Advance next-grade re-enrollments');
    });
    // onboarding funnel step -> student list for that step
    $(document).off('click', '#sedFunnel .sed-fstep').on('click', '#sedFunnel .sed-fstep', function () {
        var metric = $(this).attr('data-sed-metric');
        if (metric) { sedOpenDrawer(metric, $(this).attr('data-sed-label')); }
    });
    // onboarding readiness value (e.g. "142 not mapped") -> student list for that segment
    $(document).off('click', '.sed-onb-v').on('click', '.sed-onb-v', function () {
        var metric = $(this).attr('data-sed-onb');
        if (metric) { sedOpenDrawer(metric, $(this).attr('data-sed-label')); }
    });
    // roll no in the list -> full payment-report student detail (pic1) in a second, wider drawer
    $(document).off('click', '.sed-stu-link').on('click', '.sed-stu-link', function (e) {
        e.stopPropagation();
        sedOpenStudentDetail($(this).attr('data-ssid'), $(this).attr('data-uid'), $(this).attr('data-roll'));
    });
    $(document).off('click', '#sedStuClose, #sedStuOverlay').on('click', '#sedStuClose, #sedStuOverlay', function () {
        sedCloseStudentDetail();
    });
    // batch KPI tile -> batch-info drawer
    $(document).off('click', '.sed-bstat[data-sed-batch]').on('click', '.sed-bstat[data-sed-batch]', function () {
        var f = $(this).attr('data-sed-batch');
        var title = $(this).find('.sed-blab').text() || 'Batches';
        sedOpenBatchDrawer(f, title);
    });
    $(document).off('click', '#sedBatchClose, #sedBatchOverlay').on('click', '#sedBatchClose, #sedBatchOverlay', function () {
        sedCloseBatchDrawer();
    });
    // a batch row -> that batch's student list (popup on top)
    $(document).off('click', '#sedBatchBody .sed-brow').on('click', '#sedBatchBody .sed-brow', function () {
        var bid = $(this).attr('data-bid'); var bn = $(this).attr('data-bname') || 'Batch';
        if (bid) { sedOpenDrawer('batchStudents', 'Batch · ' + bn, { batchId: parseInt(bid, 10) }); }
    });
    // countries table: search filter + clickable Fresh/Re-Enrolled numbers
    $(document).off('input', '#sedCountrySearch').on('input', '#sedCountrySearch', function () {
        sedRenderCountryTable($(this).val());
    });
    $(document).off('click', '#sedCountryBody .sed-cnum').on('click', '#sedCountryBody .sed-cnum', function () {
        var cid = parseInt($(this).attr('data-cid'), 10) || 0;
        var cn = $(this).attr('data-cn') || '';
        var cm = $(this).attr('data-cm');
        sedOpenDrawer(cm, (cm === 'mapNew' ? 'New' : 'Re-Enroll') + ' · ' + cn, cid ? { country: cid } : null);
    });
}

// Phase-2 hook: open the Student List filtered to this group. For now shows an info message.
function sedOpenStudentList(label, count) {
    try {
        showMessageTheme2(1, (label || 'Group') + (count !== undefined ? ' (' + count + ')' : '') + ' — Student List filter coming soon.');
    } catch (e) {
        console.log('Open Student List ->', label, count);
    }
}

/* ============================================================
   Phase 2 : Fee & payment health + Progress distribution
   (separate endpoint so each half loads/retries independently)
   ============================================================ */
function fetchStudentEnrollmentFinance() {
    $.ajax({
        type: 'POST',
        contentType: APPLICATION_JSON_VALUE,
        url: getURLForHTML('dashboard', 'student-enrollment-dashboard-finance'),
        data: JSON.stringify(getRequestForStudentEnrollmentDashboard()),
        dataType: 'json',
        cache: false,
        timeout: 600000,
        success: function (data) {
            if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
                if (data['status'] == '3') { redirectLoginPage(); return; }
                return;
            }
            renderStudentEnrollmentFinanceData(data);
        },
        error: function (xhr, status, error) {
            if (checkonlineOfflineStatus()) { return; }
            console.error('student-enrollment-dashboard-finance error: ' + error);
        }
    });
}

function renderStudentEnrollmentFinanceData(data) {
    sedRenderFeeHealth(data.fee || {});
    sedRenderPlanMix(data.planMix || []);
    sedRenderProgress(data.progress || {});
    SED_STATE.fee = data.fee || {};
    sedTryRenderActions();
}

// Compact number (no currency symbol assumed): 486200 -> "486.2K", 1250000 -> "1.25M"
function sedCompact(n) {
    n = Number(n || 0);
    if (Math.abs(n) >= 1000000) { return (Math.round(n / 100000) / 10).toLocaleString() + 'M'; }
    if (Math.abs(n) >= 1000) { return (Math.round(n / 100) / 10).toLocaleString() + 'K'; }
    return n.toLocaleString();
}

function sedRenderFeeHealth(fee) {
    var boxes = [
        { c: SED_COLORS.good, cap: 'Collected', v: '$' + sedCompact(fee.collected), s: Number(fee.collectedTx || 0).toLocaleString() + ' payments' },
        { c: SED_COLORS.warn, cap: 'Due · upcoming', v: '$' + sedCompact(fee.dueAmount), s: Number(fee.dueStudents || 0).toLocaleString() + ' students' },
        { c: SED_COLORS.crit, cap: 'Overdue', v: '$' + sedCompact(fee.overdueAmount), s: Number(fee.overdueStudents || 0).toLocaleString() + ' students' },
        { c: SED_COLORS.brand, cap: 'Collection rate', v: (Number(fee.collectionRate || 0)) + '%', s: 'collected ÷ billed' }
    ];
    var html = '';
    for (var i = 0; i < boxes.length; i++) {
        html += '<div class="col-6 mb-2">'
            + '<div class="sed-fee-box">'
            + '<div class="sed-fc"><span class="sed-fdot" style="background:' + boxes[i].c + '"></span>' + boxes[i].cap + '</div>'
            + '<div class="sed-fv">' + boxes[i].v + '</div>'
            + '<div class="sed-fs">' + boxes[i].s + '</div>'
            + '</div></div>';
    }
    $('#sedFeeBoxes').html(html);
}

// Map PAY_MODE -> plan label (mirrors ReportServiceImpl PLAN_NAME CASE).
function sedPlanLabel(m) {
    switch ((m || '').trim()) {
        case 'annually': return 'Advantage Plan';
        case 'a_annually': return 'Advance Plan';
        case 'c_annually': return 'Customised Advance';
        case 'threeMonthly': return 'Easy Plan';
        case 'a_installment': return 'Advance Installment';
        case 'c_installment': return 'Customised Installment';
        case 'registration': return 'Book a Seat';
        default: return 'Installment';
    }
}

function sedRenderPlanMix(mix) {
    if (typeof ApexCharts === 'undefined') { return; }
    var sel = '#sedPlanMixChart';
    if (SED_CHARTS[sel]) { try { SED_CHARTS[sel].destroy(); } catch (e) {} }
    // one bar per raw PAY_MODE (backend already groups by PAY_MODE) so click can filter by that mode
    var labels = [], series = [], modes = [];
    for (var i = 0; i < mix.length; i++) {
        labels.push(sedPlanLabel(mix[i].mode));
        series.push(Number(mix[i].count || 0));
        modes.push(mix[i].mode || '');
    }
    if (labels.length === 0) { labels = ['No data']; series = [0]; modes = ['']; }
    var palette = [SED_COLORS.brand, SED_COLORS.teal, SED_COLORS.warn, SED_COLORS.violet, SED_COLORS.good, SED_COLORS.faint, '#e07b1a'];
    var opt = {
        chart: { type: 'bar', height: 150, fontFamily: 'inherit', toolbar: { show: false },
            events: { dataPointSelection: function (e, c, cfg) { var md = modes[cfg.dataPointIndex]; sedOpenDrawer('enrolledActive', labels[cfg.dataPointIndex], md ? { payMode: md } : null); } } },
        series: [{ name: 'Students', data: series }],
        colors: palette.slice(0, labels.length),
        plotOptions: { bar: { horizontal: true, distributed: true, borderRadius: 4, barHeight: '62%' } },
        dataLabels: { enabled: true, style: { fontSize: '10px', fontWeight: '600', colors: ['#fff'] }, offsetX: -4, textAnchor: 'end' },
        legend: { show: false },
        xaxis: { categories: labels, labels: { show: false }, axisBorder: { show: false }, axisTicks: { show: false } },
        yaxis: { labels: { style: { colors: '#5b6577', fontSize: '11px' } } },
        grid: { show: false },
        tooltip: { theme: 'light' }
    };
    var chart = new ApexCharts(document.querySelector(sel), opt);
    chart.render();
    SED_CHARTS[sel] = chart;
}

function sedRenderProgress(p) {
    if (typeof ApexCharts === 'undefined') { return; }
    var sel = '#sedProgressChart';
    if (SED_CHARTS[sel]) { try { SED_CHARTS[sel].destroy(); } catch (e) {} }
    var cats = ['N/A', '0%', '1–25%', '26–50%', '51–75%', '76–99%', '100%'];
    var vals = [Number(p.na || 0), Number(p.b0 || 0), Number(p.b1 || 0), Number(p.b2 || 0), Number(p.b3 || 0), Number(p.b4 || 0), Number(p.b5 || 0)];
    var cols = [SED_COLORS.faint, SED_COLORS.crit, SED_COLORS.warn, SED_COLORS.warn, SED_COLORS.teal, SED_COLORS.good, SED_COLORS.brand];
    var opt = {
        chart: { type: 'bar', height: 280, fontFamily: 'inherit', toolbar: { show: false },
            events: { dataPointSelection: function (e, c, cfg) { sedOpenDrawer('progress' + cfg.dataPointIndex, 'Progress · ' + cats[cfg.dataPointIndex]); } } },
        series: [{ name: 'Students', data: vals }],
        colors: cols,
        plotOptions: { bar: { distributed: true, borderRadius: 5, columnWidth: '56%' } },
        dataLabels: { enabled: true, offsetY: -18, style: { fontSize: '11px', fontWeight: '600', colors: ['#1a2233'] } },
        legend: { show: false },
        xaxis: { categories: cats, labels: { style: { colors: '#5b6577', fontSize: '11px' } } },
        yaxis: { labels: { style: { colors: '#5b6577' }, formatter: function (v) { return Math.round(v); } } },
        grid: { borderColor: '#eef1f7', strokeDashArray: 3 },
        tooltip: { theme: 'light' }
    };
    var chart = new ApexCharts(document.querySelector(sel), opt);
    chart.render();
    SED_CHARTS[sel] = chart;
}

/* ============================================================
   Phase 3 : Trend + Country + Grade + Risk radar + Action panel
   (separate endpoint; action panel builds progressively from
    onboarding[P1] + fee[P2] + insights[P3] as each arrives)
   ============================================================ */
var SED_STATE = { onboarding: null, fee: null, insights: null };

function fetchStudentEnrollmentInsights() {
    $.ajax({
        type: 'POST',
        contentType: APPLICATION_JSON_VALUE,
        url: getURLForHTML('dashboard', 'student-enrollment-dashboard-insights'),
        data: JSON.stringify(getRequestForStudentEnrollmentDashboard()),
        dataType: 'json',
        cache: false,
        timeout: 600000,
        success: function (data) {
            if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
                if (data['status'] == '3') { redirectLoginPage(); return; }
                return;
            }
            renderStudentEnrollmentInsightsData(data);
        },
        error: function (xhr, status, error) {
            if (checkonlineOfflineStatus()) { return; }
            console.error('student-enrollment-dashboard-insights error: ' + error);
        }
    });
}

function renderStudentEnrollmentInsightsData(data) {
    sedRenderTrend(data.trend || []);
    sedRenderCountry(data.countries || []);
    sedRenderCountryMap(data.countriesMap || []);
    sedRenderGrade(data.grades || []);
    sedRenderRisk(data.risk || {});
    SED_STATE.insights = data;
    sedTryRenderActions();
}

// 'YYYY-MM' -> 'Mon 'YY' (e.g. 2026-02 -> Feb '26)
function sedMonthLabel(ym) {
    var m = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var p = (ym || '').split('-');
    if (p.length < 2) { return ym || ''; }
    var idx = parseInt(p[1], 10) - 1;
    return (m[idx] || p[1]) + " '" + p[0].slice(2);
}

function sedRenderTrend(trend) {
    if (typeof ApexCharts === 'undefined') { return; }
    var sel = '#sedTrendChart';
    if (SED_CHARTS[sel]) { try { SED_CHARTS[sel].destroy(); } catch (e) {} }
    var cats = [], fresh = [], re = [];
    for (var i = 0; i < trend.length; i++) {
        cats.push(sedMonthLabel(trend[i].ym));
        fresh.push(Number(trend[i].fresh || 0));
        re.push(Number(trend[i].reEnroll || 0));
    }
    if (cats.length === 0) { cats = ['—']; fresh = [0]; re = [0]; }
    var opt = {
        chart: { type: 'area', height: 260, fontFamily: 'inherit', toolbar: { show: false } },
        series: [{ name: 'New', data: fresh }, { name: 'Re-Enroll', data: re }],
        colors: [SED_COLORS.teal, SED_COLORS.violet],
        stroke: { curve: 'smooth', width: 2.5 },
        fill: { type: 'gradient', gradient: { shadeIntensity: .4, opacityFrom: .35, opacityTo: .03, stops: [0, 95] } },
        markers: { size: 3, hover: { size: 5 } },
        dataLabels: { enabled: true, offsetY: -6, style: { fontSize: '9px', fontWeight: '600', colors: ['#5b6577'] }, background: { enabled: false } },
        xaxis: { categories: cats, labels: { style: { colors: '#5b6577', fontSize: '11px' } }, axisBorder: { color: '#eef1f7' }, axisTicks: { color: '#eef1f7' } },
        yaxis: { labels: { style: { colors: '#5b6577' } } },
        legend: { position: 'top', horizontalAlign: 'right', labels: { colors: '#5b6577' }, markers: { width: 9, height: 9, radius: 3 } },
        grid: { borderColor: '#eef1f7', strokeDashArray: 3 },
        tooltip: { theme: 'light' }
    };
    var chart = new ApexCharts(document.querySelector(sel), opt);
    chart.render();
    SED_CHARTS[sel] = chart;
}

var SED_COUNTRY_LIST = [];   // full country list (for the searchable table)

function sedCEsc(v) {
    return (v === null || v === undefined) ? '' : String(v)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// countries shown as a searchable table (Sr.No | Country | Fresh | Re-Enrolled) instead of a bar chart
function sedRenderCountry(list) {
    SED_COUNTRY_LIST = list || [];
    sedRenderCountryTable($('#sedCountrySearch').val() || '');
}

function sedRenderCountryTable(query) {
    var q = (query || '').toLowerCase().trim();
    var rows = SED_COUNTRY_LIST || [];
    var h = '', sr = 0, totFresh = 0, totRe = 0;
    for (var i = 0; i < rows.length; i++) {
        var name = rows[i].country || 'Unknown';
        if (q && name.toLowerCase().indexOf(q) === -1) { continue; }
        sr++;
        var cid = SED_COUNTRY_MAP[name] || 0;
        var fresh = Number(rows[i].fresh || 0);
        var re = Number(rows[i].reEnroll || 0);
        totFresh += fresh; totRe += re;
        h += '<tr>'
            + '<td>' + sr + '</td>'
            + '<td class="sed-cname">' + sedCEsc(name) + '</td>'
            + '<td class="sed-cnum" data-cm="mapNew" data-cid="' + cid + '" data-cn="' + sedCEsc(name) + '">' + fresh.toLocaleString() + '</td>'
            + '<td class="sed-cnum" data-cm="mapRe" data-cid="' + cid + '" data-cn="' + sedCEsc(name) + '">' + re.toLocaleString() + '</td>'
            + '</tr>';
    }
    if (!h) { h = '<tr><td colspan="4" style="text-align:center;color:#98a2b3;padding:18px;">No countries found</td></tr>'; }
    $('#sedCountryBody').html(h);
    // totals row sits in the thead and follows the search filter
    $('#sedCTotFresh').text(totFresh.toLocaleString());
    $('#sedCTotRe').text(totRe.toLocaleString());
}

function sedRenderGrade(list) {
    if (typeof ApexCharts === 'undefined') { return; }
    var sel = '#sedGradeChart';
    if (SED_CHARTS[sel]) { try { SED_CHARTS[sel].destroy(); } catch (e) {} }
    var cats = [], fresh = [], re = [];
    for (var i = 0; i < list.length; i++) {
        cats.push(list[i].grade || 'N/A');
        fresh.push(Number(list[i].fresh || 0));
        re.push(Number(list[i].reEnroll || 0));
    }
    if (cats.length === 0) { cats = ['No data']; fresh = [0]; re = [0]; }
    var opt = {
        chart: { type: 'bar', height: 430, stacked: true, fontFamily: 'inherit', toolbar: { show: false },
            events: { dataPointSelection: function (e, c, cfg) {
                var gn = cats[cfg.dataPointIndex]; var gid = SED_GRADE_MAP[gn];
                var metric = cfg.seriesIndex === 0 ? 'mapNew' : 'mapRe';
                sedOpenDrawer(metric, (cfg.seriesIndex === 0 ? 'New' : 'Re-Enroll') + ' · ' + gn, gid ? { grade: gid } : null);
            } } },
        series: [{ name: 'New', data: fresh }, { name: 'Re-Enroll', data: re }],
        colors: [SED_COLORS.teal, SED_COLORS.violet],
        plotOptions: { bar: { columnWidth: '60%', borderRadius: 3 } },
        dataLabels: { enabled: true, style: { fontSize: '9px', fontWeight: '600', colors: ['#fff'] } },
        xaxis: { categories: cats, labels: { style: { colors: '#5b6577', fontSize: '11px' }, rotate: -35, hideOverlappingLabels: true }, axisBorder: { color: '#eef1f7' }, axisTicks: { color: '#eef1f7' } },
        yaxis: { labels: { style: { colors: '#5b6577' }, formatter: function (v) { return Math.round(v); } } },
        legend: { position: 'top', horizontalAlign: 'right', labels: { colors: '#5b6577' }, markers: { width: 9, height: 9, radius: 3 } },
        grid: { borderColor: '#eef1f7', strokeDashArray: 3 },
        tooltip: { theme: 'light' }
    };
    var chart = new ApexCharts(document.querySelector(sel), opt);
    chart.render();
    SED_CHARTS[sel] = chart;
}

function sedRenderRisk(risk) {
    $('#sedRiskStudents').text(Number(risk.students || 0).toLocaleString());
    $('#sedRiskRevenue').text('$' + sedCompact(risk.revenue || 0));
    if (typeof ApexCharts === 'undefined') { return; }
    var sel = '#sedOverdueChart';
    if (SED_CHARTS[sel]) { try { SED_CHARTS[sel].destroy(); } catch (e) {} }
    var vals = [Number(risk.aging1 || 0), Number(risk.aging2 || 0), Number(risk.aging3 || 0)];
    var opt = {
        chart: { type: 'bar', height: 120, fontFamily: 'inherit', toolbar: { show: false },
            events: { dataPointSelection: function (e, c, cfg) {
                var labs = ['1–15 days', '16–30 days', '30+ days'];
                var idx = cfg.dataPointIndex;
                sedOpenDrawer('riskOverdue' + (idx + 1), 'LMS risk · ' + (labs[idx] || 'overdue') + ' overdue');
            } } },
        series: [{ name: 'Students', data: vals }],
        colors: [SED_COLORS.warn, '#e07b1a', SED_COLORS.crit],
        plotOptions: { bar: { distributed: true, horizontal: true, borderRadius: 4, barHeight: '58%' } },
        dataLabels: { enabled: true, style: { fontSize: '10px', fontWeight: '600', colors: ['#fff'] }, offsetX: -4, textAnchor: 'end' },
        legend: { show: false },
        xaxis: { categories: ['1–15 days', '16–30 days', '30+ days'], labels: { style: { colors: '#5b6577', fontSize: '11px' } }, axisBorder: { show: false }, axisTicks: { show: false } },
        yaxis: { labels: { style: { colors: '#1a2233', fontSize: '11px' } } },
        grid: { show: false },
        tooltip: { theme: 'light' }
    };
    var chart = new ApexCharts(document.querySelector(sel), opt);
    chart.render();
    SED_CHARTS[sel] = chart;
}

// Progressive action panel: rows appear as their source data (P1/P2/P3) arrives.
function sedActionRow(color, pillLabel, title, desc, count) {
    return '<div class="sed-arow" data-sed-action="' + title + '" data-sed-count="' + count + '">'
        + '<div class="sed-astripe" style="background:' + color + '"></div>'
        + '<div class="sed-abody"><div class="sed-at">' + title + '</div><div class="sed-ad">' + desc + '</div></div>'
        + '<div style="text-align:right;"><div class="sed-acount" style="color:' + color + '">' + Number(count || 0).toLocaleString() + '</div>'
        + '<span class="sed-apill" style="color:' + color + ';background:' + color + '1a;">' + pillLabel + '</span></div>'
        + '</div>';
}

// "Action needed" card was removed; its Fee-overdue + Re-enroll-pending now live in Onboarding readiness.
// Re-render readiness whenever fee / insights arrive so those two bars fill in.
function sedTryRenderActions() {
    if (SED_STATE.onboarding) { sedRenderReadiness(SED_STATE.onboarding); }
}

// delegated click on action rows -> student list (Phase-2 hook)
$(document).off('click', '#sedActions .sed-arow').on('click', '#sedActions .sed-arow', function () {
    var metric = SED_ACTION_METRIC[$(this).attr('data-sed-action')];
    if (!metric) { return; }
    sedOpenDrawer(metric, $(this).attr('data-sed-action'));
});

/* ============================================================
   Right-side student-list drawer (drill-down on a clicked count)
   ============================================================ */
var SED_KPI_METRIC = {
    sedTotal: 'total', sedActive: 'enrolledActive', sedFresh: 'fresh', sedReEnroll: 'reEnroll',
    sedWithdrawn: 'withdrawn', sedBooked: 'bookedSeat', sedLearningActive: 'learningActive'
};
var SED_ACTION_METRIC = {
    'LMS account not created': 'lmsNone',
    'Subject not mapped': 'subjectNone',
    'Teacher not mapped': 'teacherNone',
    'Batch not mapped': 'batchNone',
    'System training pending': 'trainingPending',
    'Academic date not chosen': 'acadDateNone',
    'Fee overdue': 'feeOverdue',
    'Re-enroll pending · next grade': 'reEnrollPending'
};

function sedEnrolLabel(t) {
    switch ((t || '').trim()) {
        case 'REGISTRATION_FRESH': return 'Fresh';
        case 'REGISTRATION_FLEX_COURSE': return 'Fresh (Flex)';
        case 'REGISTRATION_REGISTER': return 'Book a Seat';
        case 'REGISTRATION_NEXT_GRADE': return 'Progression';
        case 'REGISTRATION_REPEAT_GRADE': return 'Repeat Grade';
        case 'REGISTRATION_IMPORVE_GRADES': return 'Individual Course';
        case 'REGISTRATION_COMPLETE_GRADES': return 'Complete Credits';
        default: return t || '-';
    }
}

function sedCloseDrawer() {
    $('#sedDrawer').removeClass('show');
    $('#sedDrawerOverlay').removeClass('show');
}

var SED_DRAWER_METRIC = '';
function sedOpenDrawer(metric, title, extra) {
    SED_DRAWER_METRIC = metric || '';
    $('#sedDrawerTitle').text(title || 'Students');
    $('#sedDrawerCount').html('&nbsp;');
    $('#sedDrawerBody').html('<div class="sed-dload">Loading…</div>');
    $('#sedDrawerOverlay').addClass('show');
    $('#sedDrawer').addClass('show');

    var req = getRequestForStudentEnrollmentDashboard();
    req['metric'] = metric;
    if (extra) { for (var k in extra) { if (extra.hasOwnProperty(k)) { req[k] = extra[k]; } } }
    $.ajax({
        type: 'POST',
        contentType: APPLICATION_JSON_VALUE,
        url: getURLForHTML('dashboard', 'student-enrollment-dashboard-list'),
        data: JSON.stringify(req),
        dataType: 'json',
        cache: false,
        timeout: 600000,
        success: function (data) {
            if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
                if (data['status'] == '3') { redirectLoginPage(); return; }
                $('#sedDrawerBody').html('<div class="sed-dload">Unable to load list.</div>');
                return;
            }
            sedRenderDrawerList(data.students || [], data.proofHeader || '', !!data.proofDate, !!data.proofContact);
        },
        error: function (xhr, status, error) {
            if (checkonlineOfflineStatus()) { return; }
            $('#sedDrawerBody').html('<div class="sed-dload">Unable to load list. Please retry.</div>');
        }
    });
}

// red if the session-end/proof date is today or already passed (i.e. eligible / overdue), green if still upcoming
function sedProofDateColor(txt) {
    var d = new Date(txt);
    if (isNaN(d.getTime())) { return '#16a34a'; }
    var t = new Date(); t.setHours(0, 0, 0, 0);
    d.setHours(0, 0, 0, 0);
    return (d.getTime() <= t.getTime()) ? '#dc2626' : '#16a34a';
}

var SED_DRAWER_DT = null;   // drawer DataTable, so an edited contact cell can be written back

// ---- Contact · invalid drawer: inline edit of the student / parent number -------------------------
// The cell shows the number (red = invalid) plus a pencil; the pencil swaps it for a code + number editor.
function sedContactCell(kind, val, bad, sid, pid) {
    var canEdit = (kind === 'stu') ? (sid > 0) : (pid > 0);
    var h = '<span class="sed-cval" style="font-weight:600;color:' + (bad ? '#dc2626' : '#16a34a') + ';">' + val + '</span>';
    if (canEdit) {
        h += ' <a href="javascript:void(0)" class="sed-cedit" title="Edit number" data-kind="' + kind + '"'
            + ' data-sid="' + sid + '" data-pid="' + pid + '"><i class="fa fa-pencil"></i></a>';
    }
    return h;
}

// "+971 504326614" -> ['971','504326614'];  a lone 6+ digit chunk is the number, not the code
function sedSplitContact(txt) {
    var raw = String(txt || '').replace(/^\+/, '').trim();
    if (!raw || raw === '-') { return ['', '']; }
    var parts = raw.split(/\s+/);
    if (parts.length === 1) {
        var d = parts[0].replace(/\D/g, '');
        return (d.length > 5) ? ['', d] : [d, ''];
    }
    return [parts[0].replace(/\D/g, ''), parts.slice(1).join('').replace(/\D/g, '')];
}

function sedContactEditor(kind, sid, pid, cur) {
    var cc = sedSplitContact(cur);
    return '<span class="sed-cbox" data-kind="' + kind + '" data-sid="' + sid + '" data-pid="' + pid + '">'
        + '<input type="text" class="sed-cin sed-ccode" value="' + cc[0] + '" maxlength="5" placeholder="Code">'
        + '<input type="text" class="sed-cin sed-cnum" value="' + cc[1] + '" maxlength="15" placeholder="Number">'
        + '<a href="javascript:void(0)" class="sed-cok" title="Save"><i class="fa fa-check"></i></a>'
        + '<a href="javascript:void(0)" class="sed-cno" title="Cancel"><i class="fa fa-times"></i></a>'
        + '</span>';
}

function sedBindContactEdit() {
    $(document).off('click', '#sedStudentTable .sed-cedit').on('click', '#sedStudentTable .sed-cedit', function () {
        var $a = $(this), $td = $a.closest('td');
        $td.data('sedPrev', $td.html());
        $td.html(sedContactEditor($a.attr('data-kind'), $a.attr('data-sid'), $a.attr('data-pid'), $td.find('.sed-cval').text()));
        $td.find('.sed-ccode').focus();
    });
    $(document).off('click', '#sedStudentTable .sed-cno').on('click', '#sedStudentTable .sed-cno', function () {
        var $td = $(this).closest('td');
        if ($td.data('sedPrev')) { $td.html($td.data('sedPrev')); }
    });
    $(document).off('keydown', '#sedStudentTable .sed-cin').on('keydown', '#sedStudentTable .sed-cin', function (e) {
        if (e.which === 13) { $(this).closest('td').find('.sed-cok').trigger('click'); }
        else if (e.which === 27) { $(this).closest('td').find('.sed-cno').trigger('click'); }
    });
    $(document).off('click', '#sedStudentTable .sed-cok').on('click', '#sedStudentTable .sed-cok', function () {
        var $td = $(this).closest('td'), $box = $td.find('.sed-cbox');
        var kind = $box.attr('data-kind');
        var code = String($box.find('.sed-ccode').val() || '').replace(/\D/g, '');
        var num = String($box.find('.sed-cnum').val() || '').replace(/\D/g, '');
        if (!code || num.length < 4) {
            if (typeof showMessageTheme2 === 'function') { showMessageTheme2(0, 'Enter a valid country code and number', '', true); }
            return;
        }
        var req = getRequestForStudentEnrollmentDashboard();
        req['studentId'] = parseInt($box.attr('data-sid'), 10) || 0;
        req['parentId'] = parseInt($box.attr('data-pid'), 10) || 0;
        if (kind === 'stu') { req['studentCode'] = code; req['studentNumber'] = num; }
        else { req['parentCode'] = code; req['parentNumber'] = num; }
        $box.find('.sed-cok, .sed-cno').css('pointer-events', 'none');
        $.ajax({
            type: 'POST',
            contentType: APPLICATION_JSON_VALUE,
            url: getURLForHTML('dashboard', 'student-enrollment-dashboard-contact-save'),
            data: JSON.stringify(req),
            dataType: 'json',
            cache: false,
            timeout: 600000,
            success: function (data) {
                if (data['status'] == '3') { redirectLoginPage(); return; }
                if (data['status'] == '0' || data['status'] == '2') {
                    $box.find('.sed-cok, .sed-cno').css('pointer-events', '');
                    if (typeof showMessageTheme2 === 'function') { showMessageTheme2(0, data['message'] || 'Could not save', '', true); }
                    return;
                }
                var html = sedContactCell(kind, '+' + code + ' ' + num, false, req['studentId'], req['parentId']);
                // write it back through DataTables so a redraw (sort / filter / page) keeps the new number
                try { SED_DRAWER_DT.cell($td).data(html).draw(false); }
                catch (e) { $td.html(html); }
                if (typeof showMessageTheme2 === 'function') { showMessageTheme2(1, data['message'] || 'Contact updated', '', true); }
            },
            error: function () {
                $box.find('.sed-cok, .sed-cno').css('pointer-events', '');
                if (typeof checkonlineOfflineStatus === 'function' && checkonlineOfflineStatus()) { return; }
                if (typeof showMessageTheme2 === 'function') { showMessageTheme2(0, 'Could not save. Please retry', '', true); }
            }
        });
    });
}

function sedRenderDrawerList(rows, proofHeader, proofDate, proofContact) {
    $('#sedDrawerCount').text(rows.length.toLocaleString() + ' student' + (rows.length === 1 ? '' : 's'));
    // tear down any previous DataTable before replacing the DOM
    try { if ($.fn.DataTable && $.fn.DataTable.isDataTable('#sedStudentTable')) { $('#sedStudentTable').DataTable().destroy(); } } catch (e) {}
    if (rows.length === 0) {
        $('#sedDrawerBody').html('<div class="sed-dload">No students found.</div>');
        return;
    }
    function sedCEsc(v) { return (v === null || v === undefined) ? '' : String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
    // per-metric proof column(s). Contact metric = TWO columns (Student Contact / Parent Contact), invalid one in red.
    var showProof = !!proofHeader;
    var proofHead = !showProof ? ''
        : (proofContact ? '<th>Student Contact</th><th>Parent Contact</th>'
            : ('<th>' + proofHeader + (proofDate ? ' <span style="font-weight:400;color:#98a2b3;">(eligible)</span>' : '') + '</th>'));
    var h = '<div class="sed-dtwrap"><table id="sedStudentTable" class="sed-dtable" style="width:100%"><thead><tr>'
        + '<th class="n">Sr. No.</th><th>Student ID</th><th>Student Name</th><th>Grade</th><th>Register Type</th><th>Enrollment Type</th><th>Country</th>' + proofHead
        + '</tr></thead><tbody>';
    for (var i = 0; i < rows.length; i++) {
        var r = rows[i];
        var rollCell = (r.rollNo || '-');
        if (r.studentStandardId) {
            rollCell = '<a href="javascript:void(0)" class="sed-stu-link" data-ssid="' + r.studentStandardId + '" data-uid="' + (r.userId || '') + '" data-roll="' + (r.rollNo || '') + '">' + (r.rollNo || '-') + '</a>';
        }
        var proofCells = '';
        if (showProof && proofContact) {
            // [studentContact, studentBad, parentContact, parentBad, studentId, parentId]
            var p = String(r.proof || '').split('~~');
            var sC = sedCEsc(p[0] || '-'), sBad = (p[1] === '1');
            var pC = sedCEsc(p[2] || '-'), pBad = (p[3] === '1');
            var sid = parseInt(p[4], 10) || 0, pid = parseInt(p[5], 10) || 0;
            proofCells = '<td class="sed-cc" style="white-space:nowrap;">' + sedContactCell('stu', sC, sBad, sid, pid) + '</td>'
                + '<td class="sed-cc" style="white-space:nowrap;">' + sedContactCell('par', pC, pBad, sid, pid) + '</td>';
        } else if (showProof) {
            var proofColor = proofDate ? sedProofDateColor(r.proof) : '#5b6577';
            proofCells = '<td style="color:' + proofColor + ';font-weight:600;white-space:nowrap;">' + sedCEsc(r.proof || '-') + '</td>';
        }
        h += '<tr>'
            + '<td class="n">' + (r.sr || (i + 1)) + '</td>'
            + '<td>' + rollCell + '</td>'
            + '<td>' + (r.name || '-') + '</td>'
            + '<td>' + (r.grade || '-') + '</td>'
            + '<td>' + sedRegLabel(r.regType) + '</td>'
            + '<td>' + sedEnrolLabel(r.enrolType) + '</td>'
            + '<td>' + (r.country || '-') + '</td>' + proofCells
            + '</tr>';
    }
    h += '</tbody></table></div>';
    $('#sedDrawerBody').html(h);

    if ($.fn && $.fn.DataTable) {
        try {
            // keep the header pinned by letting DataTables own the vertical scroll
            // base the scroll height on the viewport (drawer is full-height); #sedDrawerBody.height()
            // is unreliable at open time and made the table too short.
            var vh = window.innerHeight || $(window).height() || 800;
            var scrollY = Math.max(240, vh - 275); // drawer header + toolbar(Show/Country/Grade/Search) + scrollHead + info/paginate + paddings
            var dt = SED_DRAWER_DT = $('#sedStudentTable').DataTable({
                pageLength: 25,
                lengthMenu: [[10, 25, 50, 100, 200, 500], [10, 25, 50, 100, 200, 500]],
                order: [[2, 'asc']],
                columnDefs: [{ orderable: false, targets: 0 }], // 6 = Country (shown, and used by the Country filter)
                autoWidth: false,
                destroy: true,
                scrollY: scrollY,
                scrollCollapse: true,
                scrollX: false,
                dom: '<"sed-toolbar"lf>rtip', // length+filters (left) and search (right) in one flex row
                // Sr. No. always follows the displayed (sorted/filtered/paged) order, so it never jumps
                drawCallback: function () {
                    var api = this.api();
                    var start = api.page.info().start;
                    api.column(0, { page: 'current' }).nodes().each(function (cell, i) {
                        cell.innerHTML = start + i + 1;
                    });
                },
                language: { search: '', searchPlaceholder: 'Search students…' }
            });
            sedAddDrawerFilters(dt, rows);
            sedBindContactEdit();
        } catch (e) { console.error('sed DataTable init', e); }
    }
}

// Country + Grade dropdown filters inside the drawer (client-side, exact match), next to search.
function sedAddDrawerFilters(dt, rows) {
    var grades = [], countries = [], gseen = {}, cseen = {};
    for (var k = 0; k < rows.length; k++) {
        var g = (rows[k].grade || '').trim();
        if (g && !gseen[g]) { gseen[g] = 1; grades.push(g); }
        var c = (rows[k].country || '').trim();
        if (c && !cseen[c]) { cseen[c] = 1; countries.push(c); }
    }
    grades.sort(); countries.sort();
    function opts(arr, all) {
        var s = '<option value="">' + all + '</option>';
        for (var i = 0; i < arr.length; i++) { s += '<option value="' + arr[i] + '">' + arr[i] + '</option>'; }
        return s;
    }
    function esc(s) { return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
    var fh = '<span class="sed-dfilt"><label>Country</label><select id="sedFltCountry">' + opts(countries, 'All Country') + '</select></span>'
        + '<span class="sed-dfilt"><label>Grade</label><select id="sedFltGrade">' + opts(grades, 'All Grade') + '</select></span>';
    $('#sedStudentTable').closest('.dataTables_wrapper').find('.dataTables_length').append(fh);
    $('#sedFltCountry').on('change', function () {
        var v = this.value; dt.column(6).search(v ? ('^' + esc(v) + '$') : '', true, false).draw();
    });
    $('#sedFltGrade').on('change', function () {
        var v = this.value; dt.column(3).search(v ? ('^' + esc(v) + '$') : '', true, false).draw();
    });
    // make both searchable (select2), dropdown parented to the drawer so it layers above it
    try {
        if ($.fn && $.fn.select2) {
            $('#sedFltCountry').select2({ theme: 'bootstrap4', width: '160px', dropdownParent: $('#sedDrawer') });
            $('#sedFltGrade').select2({ theme: 'bootstrap4', width: '140px', dropdownParent: $('#sedDrawer') });
        }
    } catch (e) { console.error('sed drawer select2', e); }
}

/* ============================================================
   Filters : master-bound dropdowns + apply/refresh
   ============================================================ */
var SED_FILTERS_LOADED = false;
var SED_DEFAULT_SESSION = ''; // current/active session id, used as the default + Reset target

// Populate Session / Country / Grade dropdowns from master lists (once per screen load).
function sedPopulateFilters(data) {
    if (SED_FILTERS_LOADED) { return; }
    var sess = data.sessions || [], countries = data.countryList || [], grades = data.gradeList || [];
    if (sess.length) {
        var h = '';
        SED_DEFAULT_SESSION = '';
        for (var i = 0; i < sess.length; i++) {
            var isCur = (sess[i].active == 1);
            if (isCur && SED_DEFAULT_SESSION === '') { SED_DEFAULT_SESSION = String(sess[i].id); }
            h += '<option value="' + sess[i].id + '"' + (isCur ? ' selected' : '') + '>'
                + sess[i].name + (isCur ? ' (current)' : '') + '</option>';
        }
        // no active flag? fall back to the first (newest) session as the default
        if (SED_DEFAULT_SESSION === '') { SED_DEFAULT_SESSION = String(sess[0].id); }
        $('#sedFilterSession').html(h);
        $('#sedFilterSession').val(SED_DEFAULT_SESSION);
    }
    if (countries.length) {
        var hc = '<option value="">All Country</option>';
        SED_COUNTRY_MAP = {};
        for (var j = 0; j < countries.length; j++) {
            hc += '<option value="' + countries[j].id + '">' + countries[j].name + '</option>';
            SED_COUNTRY_MAP[countries[j].name] = countries[j].id;
        }
        $('#sedFilterCountry').html(hc);
    }
    if (grades.length) {
        var hg = '<option value="">All Grade</option>';
        SED_GRADE_MAP = {};
        for (var k = 0; k < grades.length; k++) {
            hg += '<option value="' + grades[k].id + '">' + grades[k].name + '</option>';
            SED_GRADE_MAP[grades[k].name] = grades[k].id;
        }
        $('#sedFilterGrade').html(hg);
    }
    sedInitFilterSelects();
    SED_FILTERS_LOADED = true;
}

// Make the filter dropdowns searchable (select2, same as the rest of the app).
function sedInitFilterSelects() {
    if (typeof $.fn === 'undefined' || typeof $.fn.select2 === 'undefined') { return; }
    var defs = [['#sedFilterSession', 'Session'], ['#sedFilterRegType', 'Reg. Type'], ['#sedFilterCountry', 'Country'], ['#sedFilterGrade', 'Grade']];
    for (var i = 0; i < defs.length; i++) {
        var $el = $(defs[i][0]);
        if (!$el.length) { continue; }
        try { if ($el.data('select2')) { $el.select2('destroy'); } } catch (e) {}
        $el.select2({ theme: 'bootstrap4', width: '190px', placeholder: 'All ' + defs[i][1] });
    }
}

// Re-fetch all three sections with the current filter selection.
function sedFetchAll() {
    fetchStudentEnrollmentDashboard();
    fetchStudentEnrollmentFinance();
    fetchStudentEnrollmentInsights();
}

/* ============================================================
   Student detail (pic1) : reuse the payment-report student card
   inside a second, wider right-side drawer. Loaded on demand so
   the dashboard's normal load is unchanged.
   ============================================================ */
var SED_PR_DEPS_LOADED = false;

// Load payment-report scripts + a hidden filter-form scaffold once (idempotent).
function sedEnsurePaymentReportDeps() {
    if (SED_PR_DEPS_LOADED) { return Promise.resolve(); }
    return loadScript([{ role: '', fileName: ['paymentReportContent.js', 'paymentReport.js', 'dashboardManageUser.js'] }])
        .then(function () {
            // getRequestForPaymentReport() reads many filter inputs; inject the real (empty) form
            // so every selector resolves cleanly.
            if (typeof filterStudentPaymentReportForm === 'function' && !$('#sedPRScaffold #studentPaymentForm').length) {
                $('#sedPRScaffold').html(filterStudentPaymentReportForm());
            }
            SED_PR_DEPS_LOADED = true;
        });
}

function sedCloseStudentDetail() {
    $('#sedStuOverlay').removeClass('show');
    $('#sedStuDrawer').removeClass('show');
    $('#sedStuBody').html('');
}

// Open the full payment-report detail card for one student, filtered directly by studentStandardId.
function sedOpenStudentDetail(ssid, uid, roll) {
    if (!ssid) { return; }
    $('#sedStuTitle').text('Student Detail');
    $('#sedStuSub').text(roll ? ('Student ID · ' + roll) : '');
    $('#sedStuBody').html('<div class="sed-dload">Loading…</div>');
    $('#sedStuOverlay').addClass('show');
    $('#sedStuDrawer').addClass('show');

    sedEnsurePaymentReportDeps().then(function () {
        var req = getRequestForPaymentReport('studentPaymentForm', 2, 'N');
        if (req && req.paymentReportRequestDTO) {
            req.paymentReportRequestDTO['studentStandardId'] = parseInt(ssid, 10);
            req.paymentReportRequestDTO['pageNumber'] = 0;
            req.paymentReportRequestDTO['pageSize'] = 1;
            req.paymentReportRequestDTO['type'] = 2;
            // Passing every enroll-status code makes the report LEFT JOIN payments (instead of INNER JOIN)
            // while its OR-filter still matches all students, so a student without a current payment row
            // (e.g. session already ended) loads instead of showing "not found".
            req.paymentReportRequestDTO['enrollStatus'] = [0, 1, 2, 3, 4];
        }
        $.ajax({
            type: 'POST',
            contentType: APPLICATION_JSON_VALUE,
            url: CONTEXT_PATH + UNIQUEUUID + '/dashboard/student-payment-report',
            data: JSON.stringify(req),
            dataType: 'json',
            cache: false,
            timeout: 600000,
            success: function (data) {
                if (data['status'] == '3') { redirectLoginPage(); return; }
                if (!data.reports || !data.reports.length) {
                    $('#sedStuBody').html('<div class="sed-dload">Student detail not found.</div>');
                    return;
                }
                // cardDetailsSummary returns <tr> markup -> wrap in the table id the tab handler expects
                $('#sedStuBody').html('<div class="full overflow-x-auto"><table id="studentPaymentReportTable" class="table"><tbody>'
                    + cardDetailsSummary(data) + '</tbody></table></div>');
                try { if (typeof getWatiTemplatesHtml === 'function' && !$('#sedWatiTemplates').length) { $('body').append('<div id="sedWatiTemplates">' + getWatiTemplatesHtml() + '</div>'); } } catch (e) {}
                try { if (typeof bindPaymentReportTabEvents === 'function') { bindPaymentReportTabEvents(); } } catch (e) {}
                try { $('#sedStuBody [data-toggle="tooltip"]').tooltip({ html: true }); } catch (e) {}
            },
            error: function () {
                if (typeof checkonlineOfflineStatus === 'function' && checkonlineOfflineStatus()) { return; }
                $('#sedStuBody').html('<div class="sed-dload">Unable to load detail. Please retry.</div>');
            }
        });
    }).catch(function (e) {
        console.error('sed student detail deps', e);
        $('#sedStuBody').html('<div class="sed-dload">Unable to load detail.</div>');
    });
}

/* ============================================================
   Enrollment world map (Phase 3) : Leaflet loaded on demand,
   one split badge (New / Re-Enroll) per country at its centroid.
   ============================================================ */
// ISO2 country code -> approximate [lat, lng] centroid (for placing map markers)
var SED_CC_LATLNG = {
    AE:[24.0,54.0],SA:[24.0,45.0],QA:[25.3,51.2],KW:[29.3,47.5],BH:[26.0,50.5],OM:[21.0,57.0],
    IN:[22.0,79.0],PK:[30.0,70.0],BD:[24.0,90.0],LK:[7.9,80.8],NP:[28.4,84.1],
    US:[39.0,-98.0],CA:[56.0,-106.0],MX:[23.0,-102.0],BR:[-10.0,-52.0],CO:[4.6,-74.3],AR:[-34.0,-64.0],
    PE:[-9.2,-75.0],CL:[-35.0,-71.0],VE:[7.0,-66.0],EC:[-1.8,-78.2],
    GB:[54.0,-2.0],IE:[53.4,-8.0],ES:[40.0,-4.0],PT:[39.6,-8.0],FR:[46.0,2.0],DE:[51.0,10.0],
    IT:[42.8,12.6],NL:[52.2,5.5],BE:[50.6,4.6],CH:[46.8,8.2],AT:[47.6,14.1],SE:[62.0,15.0],
    NO:[64.0,11.0],FI:[64.0,26.0],DK:[56.0,10.0],PL:[52.0,19.0],GR:[39.0,22.0],RU:[61.5,105.0],
    UA:[49.0,32.0],RO:[46.0,25.0],TR:[39.0,35.0],
    EG:[26.8,30.8],MA:[31.8,-7.1],DZ:[28.0,3.0],TN:[34.0,9.0],LY:[27.0,17.0],SD:[15.5,30.0],
    NG:[9.1,8.7],KE:[0.2,37.9],GH:[7.9,-1.0],ZA:[-29.0,24.0],ET:[9.1,40.5],TZ:[-6.4,34.9],
    UG:[1.4,32.3],ZW:[-19.0,29.9],ZM:[-13.1,27.8],SN:[14.5,-14.5],CI:[7.5,-5.5],CM:[5.7,12.7],
    JO:[31.2,36.5],LB:[33.9,35.5],SY:[35.0,38.0],IQ:[33.2,43.7],IR:[32.0,53.0],IL:[31.4,35.0],PS:[31.9,35.2],YE:[15.5,47.5],
    CN:[35.9,104.2],JP:[36.2,138.3],KR:[36.5,127.8],TH:[15.0,101.0],VN:[16.2,107.8],MY:[4.2,102.0],
    SG:[1.35,103.8],ID:[-2.5,118.0],PH:[12.9,121.8],MM:[21.9,95.9],KH:[12.6,104.9],HK:[22.3,114.2],TW:[23.7,121.0],
    AU:[-25.0,134.0],NZ:[-42.0,172.0],FJ:[-17.7,178.0],
    AF:[33.9,67.7],KZ:[48.0,68.0],UZ:[41.4,64.6],AZ:[40.4,47.6],GE:[42.3,43.4],AM:[40.1,45.0],
    MN:[46.9,103.8],BT:[27.5,90.4],MV:[3.2,73.2],BN:[4.5,114.7],LA:[19.9,102.5],
    CU:[21.5,-79.0],DO:[19.0,-70.7],GT:[15.8,-90.2],HN:[15.0,-86.5],PA:[8.5,-80.1],CR:[9.7,-83.8],
    BO:[-16.3,-63.6],PY:[-23.4,-58.4],UY:[-32.5,-55.8],JM:[18.1,-77.3],TT:[10.5,-61.3],
    CZ:[49.8,15.5],HU:[47.2,19.5],SK:[48.7,19.7],BG:[42.7,25.5],HR:[45.1,15.5],RS:[44.0,21.0],
    LT:[55.2,23.9],LV:[56.9,24.6],EE:[58.6,25.0],SI:[46.1,14.8],LU:[49.8,6.1],IS:[64.9,-19.0],
    MT:[35.9,14.4],CY:[35.1,33.4],AL:[41.2,20.0],MK:[41.6,21.7],BA:[43.9,17.7],
    NA:[-22.0,17.0],BW:[-22.3,24.7],MZ:[-18.7,35.5],AO:[-11.2,17.9],RW:[-2.0,29.9],
    SV:[13.8,-88.9],CV:[16.0,-24.0],BM:[32.3,-64.8],BS:[24.5,-76.5],TJ:[38.9,71.3],TM:[38.9,59.6],
    KG:[41.2,74.8],GY:[4.9,-58.9],SR:[4.0,-56.0],BZ:[17.2,-88.5],NI:[12.9,-85.2],PR:[18.2,-66.5],
    HT:[19.0,-72.3],GN:[9.9,-9.7],ML:[17.6,-4.0],BF:[12.2,-1.6],NE:[17.6,8.1],TD:[15.4,18.7],
    SO:[5.2,46.2],SS:[7.9,29.7],ER:[15.2,39.8],DJ:[11.8,42.6],MW:[-13.3,34.3],MG:[-18.8,46.9],
    MU:[-20.3,57.6],GA:[-0.8,11.6],CG:[-0.7,15.8],CD:[-2.9,23.7],GM:[13.4,-15.3],SL:[8.5,-11.8],
    LR:[6.4,-9.4],TG:[8.6,0.8],BJ:[9.3,2.3],MR:[20.3,-10.9],LS:[-29.6,28.2],SZ:[-26.5,31.5],
    BI:[-3.4,29.9],GW:[12.0,-15.0],GQ:[1.6,10.4],KM:[-11.6,43.3],SC:[-4.7,55.5],PG:[-6.5,145.0],
    NC:[-21.3,165.5],VU:[-16.0,167.0],WS:[-13.8,-172.1],TO:[-21.2,-175.2],KP:[40.3,127.5],TL:[-8.8,125.7],
    MO:[22.2,113.5],MD:[47.4,28.4],BY:[53.7,27.9],XK:[42.6,20.9],ME:[42.7,19.4],AD:[42.5,1.5],
    MC:[43.7,7.4],LI:[47.2,9.5],SM:[43.9,12.5],GI:[36.1,-5.4],FO:[62.0,-6.8],GL:[71.7,-42.6]
};

var SED_LEAFLET_P = null;
function sedEnsureLeaflet() {
    if (window.L && window.L.map) { return Promise.resolve(); }
    if (SED_LEAFLET_P) { return SED_LEAFLET_P; }
    SED_LEAFLET_P = new Promise(function (resolve, reject) {
        try {
            if (!document.getElementById('sed-leaflet-css')) {
                var lk = document.createElement('link');
                lk.id = 'sed-leaflet-css'; lk.rel = 'stylesheet';
                lk.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
                document.head.appendChild(lk);
            }
            var s = document.createElement('script');
            s.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
            s.onload = function () { resolve(); };
            s.onerror = function () { SED_LEAFLET_P = null; reject(new Error('leaflet load failed')); };
            document.head.appendChild(s);
        } catch (e) { SED_LEAFLET_P = null; reject(e); }
    });
    return SED_LEAFLET_P;
}

var SED_MAP = null, SED_MAP_MARKERS = null;
function sedRenderCountryMap(list) {
    var el = document.getElementById('sedCountryMap');
    if (!el) { return; }
    if (!list || !list.length) { $('#sedMapNote').text('No country data for the current filter.'); return; }
    sedEnsureLeaflet().then(function () {
        // recreate the map if the container was replaced (page re-render)
        if (SED_MAP && SED_MAP.getContainer() !== el) { try { SED_MAP.remove(); } catch (e) {} SED_MAP = null; SED_MAP_MARKERS = null; }
        if (!SED_MAP) {
            SED_MAP = L.map('sedCountryMap', { worldCopyJump: true, scrollWheelZoom: false, minZoom: 1, attributionControl: true }).setView([22, 10], 1.5);
            // OpenStreetMap standard — free, no API key. Crispness handled via CSS filter below.
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                subdomains: 'abc', maxZoom: 12, attribution: '© OpenStreetMap contributors'
            }).addTo(SED_MAP);
        }
        if (SED_MAP_MARKERS) { SED_MAP_MARKERS.clearLayers(); } else { SED_MAP_MARKERS = L.layerGroup().addTo(SED_MAP); }
        var missing = [];
        for (var i = 0; i < list.length; i++) {
            var c = list[i];
            var code = (c.code || '').toUpperCase();
            var ll = SED_CC_LATLNG[code];
            if (!ll) { if (c.country) { missing.push(c.country); } continue; }
            var nw = Number(c.fresh || 0), re = Number(c.reEnroll || 0);
            var html = '<div class="sed-mkr"><b class="sed-mk-new" title="New">' + nw + '</b><b class="sed-mk-re" title="Re-Enroll">' + re + '</b></div>';
            var icon = L.divIcon({ html: html, className: 'sed-mkr-wrap', iconSize: null });
            var m = L.marker(ll, { icon: icon }).addTo(SED_MAP_MARKERS);
            m.bindTooltip((c.country || '') + ' — New ' + nw + ' · Re ' + re, { direction: 'top', offset: [0, -6] });
            (function (cc, n, r) {
                m.on('click', function () {
                    var nm = (cc.country || '').replace(/'/g, ' ');
                    var pop = '<div style="font-weight:700;margin-bottom:5px">' + (cc.country || '') + '</div>'
                        + '<a href="javascript:void(0)" onclick="sedOpenDrawer(\'mapNew\',\'New · ' + nm + '\',{country:' + cc.id + '})">New: <b>' + n + '</b></a><br/>'
                        + '<a href="javascript:void(0)" onclick="sedOpenDrawer(\'mapRe\',\'Re-Enroll · ' + nm + '\',{country:' + cc.id + '})">Re-Enroll: <b>' + r + '</b></a>';
                    L.popup().setLatLng(this.getLatLng()).setContent(pop).openOn(SED_MAP);
                });
            })(c, nw, re);
        }
        setTimeout(function () { try { SED_MAP.invalidateSize(); } catch (e) {} }, 250);
        $('#sedMapNote').text(missing.length ? (missing.length + ' countr' + (missing.length === 1 ? 'y' : 'ies') + ' not plotted (no coordinates): ' + missing.slice(0, 6).join(', ') + (missing.length > 6 ? '…' : '')) : '');
    }).catch(function (e) {
        console.error('sed leaflet', e);
        $('#sedMapNote').text('Map could not load (needs internet access).');
    });
}

/* ============================================================
   Batch-info drawer (opened from a batch KPI). A batch row opens
   that batch's student list on top.
   ============================================================ */
function sedCloseBatchDrawer() {
    $('#sedBatchOverlay').removeClass('show');
    $('#sedBatchDrawer').removeClass('show');
    $('#sedBatchBody').html('');
}

function sedOpenBatchDrawer(filter, title) {
    $('#sedBatchTitle').text(title ? ('Batches · ' + title) : 'Batches');
    $('#sedBatchCount').html('&nbsp;');
    $('#sedBatchBody').html('<div class="sed-dload">Loading…</div>');
    $('#sedBatchOverlay').addClass('show');
    $('#sedBatchDrawer').addClass('show');
    var req = getRequestForStudentEnrollmentDashboard();
    req['batchFilter'] = (filter === 'all') ? '' : (filter || '');
    $.ajax({
        type: 'POST',
        contentType: APPLICATION_JSON_VALUE,
        url: getURLForHTML('dashboard', 'student-enrollment-dashboard-batches'),
        data: JSON.stringify(req),
        dataType: 'json',
        cache: false,
        timeout: 600000,
        success: function (data) {
            if (data['status'] == '3') { redirectLoginPage(); return; }
            sedRenderBatchList(data.batches || []);
        },
        error: function () {
            if (typeof checkonlineOfflineStatus === 'function' && checkonlineOfflineStatus()) { return; }
            $('#sedBatchBody').html('<div class="sed-dload">Unable to load batches. Please retry.</div>');
        }
    });
}

function sedRenderBatchList(rows) {
    $('#sedBatchCount').text(rows.length.toLocaleString() + ' batch' + (rows.length === 1 ? '' : 'es'));
    try { if ($.fn.DataTable && $.fn.DataTable.isDataTable('#sedBatchTable')) { $('#sedBatchTable').DataTable().destroy(); } } catch (e) {}
    if (!rows.length) { $('#sedBatchBody').html('<div class="sed-dload">No batches found for this session.</div>'); return; }
    var h = '<div class="sed-dtwrap"><table id="sedBatchTable" class="sed-btbl" style="width:100%"><thead><tr>'
        + '<th class="n">#</th><th>Batch</th><th>Grade</th><th>Category</th><th>Duration</th><th>Students</th><th>Teacher</th><th>Status</th>'
        + '</tr></thead><tbody>';
    for (var i = 0; i < rows.length; i++) {
        var b = rows[i];
        var lim = Number(b.limit || 0), st = Number(b.students || 0);
        var pct = lim > 0 ? Math.min(100, Math.round(st / lim * 100)) : 0;
        var cap = lim > 0 ? (st + ' / ' + lim) : String(st);
        h += '<tr class="sed-brow" data-bid="' + b.batchId + '" data-bname="' + (b.name || '').replace(/"/g, '') + '">'
            + '<td class="n">' + (i + 1) + '</td>'
            + '<td>' + (b.name || '-') + '</td>'
            + '<td>' + (b.grade || '-') + '</td>'
            + '<td>' + (b.category || '-') + '</td>'
            + '<td style="white-space:nowrap;font-size:11.5px;color:#5b6577;">' + (b.startDate || '-') + (b.endDate ? ' – ' + b.endDate : '') + '</td>'
            + '<td>' + cap + (lim > 0 ? '<div class="sed-bfill"><i style="width:' + pct + '%"></i></div>' : '') + '</td>'
            + '<td>' + (b.hasTeacher ? '<span class="sed-bpill on">Yes</span>' : '<span class="sed-bpill off">No</span>') + '</td>'
            + '<td>' + (b.active ? '<span class="sed-bpill on">Active</span>' : '<span class="sed-bpill off">Inactive</span>') + '</td>'
            + '</tr>';
    }
    h += '</tbody></table></div>';
    $('#sedBatchBody').html(h);
    if ($.fn && $.fn.DataTable) {
        try {
            var vh = window.innerHeight || $(window).height() || 800;
            var scrollY = Math.max(240, vh - 250);
            $('#sedBatchTable').DataTable({
                pageLength: 25, lengthMenu: [[10, 25, 50, 100], [10, 25, 50, 100]],
                order: [[1, 'asc']], columnDefs: [{ orderable: false, targets: 0 }],
                autoWidth: false, destroy: true, scrollY: scrollY, scrollCollapse: true, scrollX: false,
                drawCallback: function () {
                    var api = this.api(); var start = api.page.info().start;
                    api.column(0, { page: 'current' }).nodes().each(function (c, i) { c.innerHTML = start + i + 1; });
                },
                language: { search: '', searchPlaceholder: 'Search batches…' }
            });
        } catch (e) { console.error('sed batch dt', e); }
    }
}
