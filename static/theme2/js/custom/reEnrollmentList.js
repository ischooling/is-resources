// Re-Enrollment list — logic (AJAX + render + filters + server-side paging).
// Rendered via adminController 're-enrollment-list' -> renderReEnrollmentList(...).

var REEL_SESSIONS_LOADED = false;
var REEL_DEFAULT_SESSION = '';
var REEL_PAGE = 0;
var REEL_TOTAL = 0;
var REEL_CARD_METRIC = '';   // active summary-card drill-down (empty = full list)

function renderReEnrollmentList(title, roleAndModule, schoolId, userId, userRole) {
    $('#dashboardContentInHTML').html(getReEnrollmentListContent(title));
    REEL_SESSIONS_LOADED = false;
    REEL_PAGE = 0;
    bindReEnrollmentEvents();
    reEnrollInitDatePickers();
    reEnrollFetch(0);
}

// bootstrap-datepicker (same "M d, yyyy" style as the payment-report page)
function reEnrollInitDatePickers() {
    try {
        if (!($.fn && $.fn.datepicker)) { return; }
        $('#reelStart').datepicker({ autoclose: true, format: 'M d, yyyy', todayHighlight: true, orientation: 'bottom' })
            .on('changeDate', function () {
                $('#reelEnd').datepicker('setStartDate', new Date($(this).val()));
            });
        $('#reelEnd').datepicker({ autoclose: true, format: 'M d, yyyy', orientation: 'bottom' });
    } catch (e) { /* datepicker optional */ }
}

// "Sep 14, 2026" (datepicker text) -> "2026-09-14" for the backend
function reEnrollToYmd(v) {
    if (!v) { return ''; }
    var d = new Date(v);
    if (isNaN(d.getTime())) { return ''; }
    var m = ('0' + (d.getMonth() + 1)).slice(-2);
    var day = ('0' + d.getDate()).slice(-2);
    return d.getFullYear() + '-' + m + '-' + day;
}

function getRequestForReEnrollment(pageNumber) {
    var req = {
        userId: (typeof USER_ID !== 'undefined' ? USER_ID : 0),
        schoolId: (typeof SCHOOL_ID !== 'undefined' ? SCHOOL_ID : 0),
        sessionId: parseInt($('#reelSession').val(), 10) || 0,
        dateType: $('#reelDateType').val() || 'PAYMENT_DATE',
        startDate: reEnrollToYmd($('#reelStart').val()),
        endDate: reEnrollToYmd($('#reelEnd').val()),
        enrolType: $('#reelEnrolType').val() || '',
        advPayment: $('#reelAdv').val() || '',
        progress: $('#reelProgress').val() || '',
        search: ($('#reelSearch').val() || '').trim(),
        cardMetric: REEL_CARD_METRIC || '',
        pageNumber: pageNumber || 0,
        pageSize: parseInt($('#reelPageSize').val(), 10) || 25
    };
    if ((pageNumber || 0) > 0) { req.knownTotal = REEL_TOTAL; }
    return req;
}

function reEnrollClearCard() { REEL_CARD_METRIC = ''; $('.reel-card-click').removeClass('reel-card-active'); }

function bindReEnrollmentEvents() {
    $(document).off('click', '#reelApply').on('click', '#reelApply', function () { reEnrollClearCard(); reEnrollFetch(0); });
    $(document).off('keydown', '#reelSearch').on('keydown', '#reelSearch', function (e) { if (e.which === 13) { reEnrollClearCard(); reEnrollFetch(0); } });
    $(document).off('change', '#reelPageSize').on('change', '#reelPageSize', function () { reEnrollFetch(0); });
    // click a summary card -> filter the table to that subset (click again to clear)
    $(document).off('click', '.reel-card-click').on('click', '.reel-card-click', function () {
        var m = $(this).attr('data-metric');
        if (!m) { return; }
        REEL_CARD_METRIC = (REEL_CARD_METRIC === m) ? '' : m;
        $('.reel-card-click').removeClass('reel-card-active');
        if (REEL_CARD_METRIC) { $(this).addClass('reel-card-active'); }
        reEnrollFetch(0);
    });
    $(document).off('click', '#reelReset').on('click', '#reelReset', function () {
        reEnrollClearCard();
        $('#reelSession').val(REEL_DEFAULT_SESSION || '0');
        $('#reelDateType').val('PAYMENT_DATE');
        $('#reelStart').val(''); $('#reelEnd').val('');
        try { if ($.fn && $.fn.datepicker) { $('#reelStart').datepicker('update', ''); $('#reelEnd').datepicker('update', ''); } } catch (e) {}
        $('#reelEnrolType').val(''); $('#reelAdv').val(''); $('#reelProgress').val('');
        $('#reelSearch').val(''); $('#reelPageSize').val('25');
        if ($('#reelSession').hasClass('select2-hidden-accessible')) { $('#reelSession').trigger('change.select2'); }
        reEnrollFetch(0);
    });
    // pager (delegated)
    $(document).off('click', '#reelPager a.page-link').on('click', '#reelPager a.page-link', function (e) {
        e.preventDefault();
        var p = parseInt($(this).attr('data-page'), 10);
        if (!isNaN(p)) { reEnrollFetch(p); }
    });
    // student id -> payment-report detail drawer
    $(document).off('click', '.reel-stu-link').on('click', '.reel-stu-link', function (e) {
        e.stopPropagation();
        reEnrollOpenStudentDetail($(this).attr('data-ssid'), $(this).attr('data-uid'), $(this).attr('data-roll'));
    });
    $(document).off('click', '#reelStuClose, #reelStuOverlay').on('click', '#reelStuClose, #reelStuOverlay', function () {
        $('#reelStuOverlay').removeClass('show');
        $('#reelStuDrawer').removeClass('show');
        $('#reelStuBody').html('');
    });
}

/* ============================================================
   Student detail drawer — reuse the payment-report card (pic1).
   Payment JS loaded on demand so the page load stays light.
   ============================================================ */
var REEL_PR_DEPS_LOADED = false;

function reEnrollEnsurePaymentReportDeps() {
    if (REEL_PR_DEPS_LOADED) { return Promise.resolve(); }
    return loadScript([{ role: '', fileName: ['paymentReportContent.js', 'paymentReport.js', 'dashboardManageUser.js'] }])
        .then(function () {
            // getRequestForPaymentReport() reads many filter inputs; inject the real (empty) form so every selector resolves
            if (typeof filterStudentPaymentReportForm === 'function' && !$('#reelPRScaffold #studentPaymentForm').length) {
                $('#reelPRScaffold').html(filterStudentPaymentReportForm());
                try {
                    // select2-init the scaffold selects so getRequestForPaymentReport's .select2('val') works,
                    // and pre-select ALL enroll statuses so every request (summary + lazy tabs) LEFT-JOINs payments
                    if ($.fn && $.fn.select2) { $('#reelPRScaffold select').select2({ theme: 'bootstrap4', width: '200px' }); }
                    $('#reelPRScaffold #enrollStatus').val(['0', '1', '2', '3', '4']).trigger('change');
                } catch (e) { console.error('reel scaffold init', e); }
            }
            REEL_PR_DEPS_LOADED = true;
        });
}

function reEnrollOpenStudentDetail(ssid, uid, roll) {
    if (!ssid) { return; }
    $('#reelStuTitle').text('Student Detail');
    $('#reelStuSub').text(roll ? ('Student ID · ' + roll) : '');
    $('#reelStuBody').html('<div class="reel-dload">Loading…</div>');
    $('#reelStuOverlay').addClass('show');
    $('#reelStuDrawer').addClass('show');

    reEnrollEnsurePaymentReportDeps().then(function () {
        var req = getRequestForPaymentReport('studentPaymentForm', 2, 'N');
        if (req && req.paymentReportRequestDTO) {
            req.paymentReportRequestDTO['studentStandardId'] = parseInt(ssid, 10);
            req.paymentReportRequestDTO['pageNumber'] = 0;
            req.paymentReportRequestDTO['pageSize'] = 1;
            req.paymentReportRequestDTO['type'] = 2;
            // enrollStatus makes the report LEFT JOIN payments so a student without a current payment row still loads
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
                    $('#reelStuBody').html('<div class="reel-dload">Student detail not found.</div>');
                    return;
                }
                $('#reelStuBody').html('<div class="full overflow-x-auto"><table id="studentPaymentReportTable" class="table"><tbody>'
                    + cardDetailsSummary(data) + '</tbody></table></div>');
                try { if (typeof getWatiTemplatesHtml === 'function' && !$('#reelWatiTemplates').length) { $('body').append('<div id="reelWatiTemplates">' + getWatiTemplatesHtml() + '</div>'); } } catch (e) {}
                try { if (typeof bindPaymentReportTabEvents === 'function') { bindPaymentReportTabEvents(); } } catch (e) {}
                try { $('#reelStuBody [data-toggle="tooltip"]').tooltip({ html: true }); } catch (e) {}
            },
            error: function () {
                if (typeof checkonlineOfflineStatus === 'function' && checkonlineOfflineStatus()) { return; }
                $('#reelStuBody').html('<div class="reel-dload">Unable to load detail. Please retry.</div>');
            }
        });
    }).catch(function (e) {
        console.error('reel student detail deps', e);
        $('#reelStuBody').html('<div class="reel-dload">Unable to load detail.</div>');
    });
}

function reEnrollFetch(pageNumber) {
    REEL_PAGE = pageNumber || 0;
    $('#reelBody').html('<tr><td colspan="18" class="reel-empty">Loading…</td></tr>');
    var req = getRequestForReEnrollment(REEL_PAGE);
    $.ajax({
        type: 'POST',
        contentType: APPLICATION_JSON_VALUE,
        url: getURLForHTML('dashboard', 're-enrollment-list'),
        data: JSON.stringify(req),
        dataType: 'json',
        cache: false,
        timeout: 600000,
        success: function (data) {
            if (data['status'] == '3') { redirectLoginPage(); return; }
            if (data['status'] == '0' || data['status'] == '2') {
                $('#reelBody').html('<tr><td colspan="18" class="reel-empty">Unable to load data.</td></tr>');
                return;
            }
            if (!REEL_SESSIONS_LOADED) {
                reEnrollPopulateSessions(data.sessions || []);
                REEL_SESSIONS_LOADED = true;
                // default to the current/active session on first load, then reload once
                if (REEL_DEFAULT_SESSION && String($('#reelSession').val()) !== String(REEL_DEFAULT_SESSION)) {
                    $('#reelSession').val(REEL_DEFAULT_SESSION);
                    if ($('#reelSession').hasClass('select2-hidden-accessible')) { $('#reelSession').trigger('change.select2'); }
                    reEnrollFetch(0);
                    return;
                }
            }
            REEL_TOTAL = Number(data.count || 0);
            if (data.summary && Object.keys(data.summary).length) { reEnrollRenderCards(data.summary); }
            reEnrollRenderRows(data.data || [], req.pageNumber, req.pageSize);
            reEnrollRenderCount(REEL_TOTAL, req.pageNumber, req.pageSize);
            reEnrollRenderPager(REEL_TOTAL, req.pageNumber, req.pageSize);
        },
        error: function () {
            if (typeof checkonlineOfflineStatus === 'function' && checkonlineOfflineStatus()) { return; }
            $('#reelBody').html('<tr><td colspan="18" class="reel-empty">Unable to load data. Please retry.</td></tr>');
        }
    });
}

function reEnrollPopulateSessions(sessions) {
    var h = '<option value="0">All Session</option>';
    REEL_DEFAULT_SESSION = '';
    for (var i = 0; i < sessions.length; i++) {
        var s = sessions[i];
        var cur = (s.active == 1);
        if (cur && REEL_DEFAULT_SESSION === '') { REEL_DEFAULT_SESSION = String(s.id); }
        h += '<option value="' + s.id + '">' + s.name + (cur ? ' (current)' : '') + '</option>';
    }
    $('#reelSession').html(h);
    try {
        if ($.fn && $.fn.select2) { $('#reelSession').select2({ theme: 'bootstrap4', width: '100%' }); }
    } catch (e) { /* select2 optional */ }
}

function reEnrollEsc(v) {
    return (v === null || v === undefined) ? '' : String(v)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function reEnrollRenderCards(s) {
    function card(num, label, bg, color, metric) {
        var active = (metric && REEL_CARD_METRIC === metric) ? ' reel-card-active' : '';
        return '<div class="reel-card reel-card-click' + active + '" data-metric="' + (metric || '') + '" style="background:' + bg + '">'
            + '<div class="reel-cnum" style="color:' + color + '">' + Number(num || 0).toLocaleString() + '</div>'
            + '<div class="reel-clab" style="color:' + color + '">' + label + '</div></div>';
    }
    var g1 = '<div class="reel-cgrp"><div class="reel-clabel">Total Students</div><div class="reel-cards">'
        + card(s.total, 'Total Students', '#eef2ff', '#3730a3', 'total')
        + card(s.group, 'Group', '#e7f0ff', '#1e5fd6', 'group')
        + card(s.oneToOne, 'One-to-One', '#e6f7f4', '#0e8a7d', 'oneToOne')
        + card(s.other, 'Other', '#f3f0fb', '#6d4bb3', 'other')
        + card(s.fresh, 'Fresh', '#e9f7ee', '#1f9d55', 'fresh')
        + card(s.totalReEnroll, 'Re-Enrollment', '#eaf1ff', '#2b62d6', 'reEnrollment')
        + '</div></div>';
    // "Eligible Students · next session" row hidden for now (fresh queries to come)
    // var g2 = '<div class="reel-cgrp"><div class="reel-clabel">Eligible Students · next session</div><div class="reel-cards">'
    //     + card(s.eligible, 'Eligible (session ended)', '#fff4e5', '#b26a00', 'eligible')
    //     + card(s.eligReEnroll, 'Re-Enrolled', '#e7f6ec', '#16a34a', 'reEnrolled')
    //     + card(s.eligAdvance, 'Advance Payment', '#eaf1ff', '#2b62d6', 'advance')
    //     + card(s.eligPending, 'Pending', '#fdeaea', '#c0392b', 'pending')
    //     + '</div></div>';
    $('#reelCards').html(g1);
}

function reEnrollRenderRows(rows, pageNumber, pageSize) {
    if (!rows.length) {
        $('#reelBody').html('<tr><td colspan="19" class="reel-empty">No students found for the selected filters.</td></tr>');
        return;
    }
    var srBase = (pageNumber || 0) * (pageSize || 25);
    var h = '';
    for (var i = 0; i < rows.length; i++) {
        var r = rows[i];
        var adv = (r.advPayment === 'Y')
            ? '<span class="reel-badge reel-adv-y">Advance Paid</span>'
            : '<span class="reel-badge reel-adv-n">No</span>';
        var prog = (r.avgProgress === '' || r.avgProgress === null) ? '-' : (r.avgProgress + '%');
        var idCell = reEnrollEsc(r.rollNo || '-');
        if (r.studentStandardId) {
            idCell = '<a href="javascript:void(0)" class="reel-stu-link" data-ssid="' + r.studentStandardId + '" data-uid="' + (r.userId || '') + '" data-roll="' + reEnrollEsc(r.rollNo || '') + '">' + reEnrollEsc(r.rollNo || '-') + '</a>';
        }
        h += '<tr>'
            + '<td class="reel-n">' + (srBase + i + 1) + '</td>'
            + '<td>' + idCell + '</td>'
            + '<td>' + reEnrollEsc(r.name || '-') + '</td>'
            + '<td>' + reEnrollEsc(r.email || '-') + '</td>'
            + '<td>' + reEnrollEsc(r.contact || '-') + '</td>'
            + '<td>' + reEnrollEsc(r.parentName || '-') + '</td>'
            + '<td>' + reEnrollEsc(r.parentEmail || '-') + '</td>'
            + '<td>' + reEnrollEsc(r.parentContact || '-') + '</td>'
            + '<td>' + reEnrollEsc(r.country || '-') + '</td>'
            + '<td>' + reEnrollEsc(r.grade || '-') + '</td>'
            + '<td>' + reEnrollEsc(r.regType || '-') + '</td>'
            + '<td>' + reEnrollEsc(r.enrolType || '-') + '</td>'
            + '<td>' + reEnrollEsc(r.payDate || '-') + '</td>'
            + '<td>' + reEnrollEsc(r.semStart || r.acadStart || '-') + '</td>'
            + '<td>' + reEnrollEsc(r.acadEnd || '-') + '</td>'
            + '<td>' + prog + '</td>'
            + '<td>' + reEnrollEsc(r.profileStatus || '-') + '</td>'
            + '<td>' + reEnrollEsc(r.lastLogout || '-') + '</td>'
            + '<td>' + adv + '</td>'
            + '</tr>';
    }
    $('#reelBody').html(h);
}

function reEnrollRenderCount(total, pageNumber, pageSize) {
    if (total === 0) { $('#reelCount').text('0 students'); return; }
    var from = pageNumber * pageSize + 1;
    var to = Math.min((pageNumber + 1) * pageSize, total);
    $('#reelCount').text('Showing ' + from + ' to ' + to + ' of ' + total.toLocaleString() + ' students');
}

function reEnrollRenderPager(total, pageNumber, pageSize) {
    var pages = Math.ceil(total / pageSize);
    if (pages <= 1) { $('#reelPager').html(''); return; }
    function li(label, page, opts) {
        opts = opts || {};
        var cls = 'page-item' + (opts.active ? ' active' : '') + (opts.disabled ? ' disabled' : '');
        var a = opts.disabled ? '<span class="page-link">' + label + '</span>'
            : '<a class="page-link" href="javascript:void(0)" data-page="' + page + '">' + label + '</a>';
        return '<li class="' + cls + '">' + a + '</li>';
    }
    var h = '';
    h += li('Prev', pageNumber - 1, { disabled: pageNumber <= 0 });
    var start = Math.max(0, pageNumber - 2);
    var end = Math.min(pages - 1, pageNumber + 2);
    if (start > 0) { h += li('1', 0, {}); if (start > 1) { h += li('…', 0, { disabled: true }); } }
    for (var p = start; p <= end; p++) { h += li(String(p + 1), p, { active: p === pageNumber }); }
    if (end < pages - 1) { if (end < pages - 2) { h += li('…', 0, { disabled: true }); } h += li(String(pages), pages - 1, {}); }
    h += li('Next', pageNumber + 1, { disabled: pageNumber >= pages - 1 });
    $('#reelPager').html(h);
}
