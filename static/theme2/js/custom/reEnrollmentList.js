// Re-Enrollment list — logic (AJAX + render + filters + server-side paging).
// Rendered via adminController 're-enrollment-list' -> renderReEnrollmentList(...).

var REEL_SESSIONS_LOADED = false;
var REEL_DEFAULT_SESSION = '';
var REEL_PAGE = 0;
var REEL_TOTAL = 0;
var REEL_CARD_METRIC = '';   // active summary-card drill-down (empty = full list)
// count-box list drawer state
var REEL_CARD_LIST_CM = '';
var REEL_CARD_LIST_SESS = '';
var REEL_CARD_LIST_TITLE = '';
var REEL_CARD_LIST_TOTAL = 0;
var REEL_COUNTRIES = [];      // popup filter options (from summary)
var REEL_GRADES = [];
var REEL_CARD_FILTERS_READY = false;

function renderReEnrollmentList(title, roleAndModule, schoolId, userId, userRole) {
    $('#dashboardContentInHTML').html(getReEnrollmentListContent(title));
    REEL_SESSIONS_LOADED = false;
    REEL_PAGE = 0;
    bindReEnrollmentEvents();
    reEnrollInitDatePickers();
    reEnrollInitParentSelect();
    reEnrollFetch(0);
}

// searchable parent filter (select2 + AJAX, min 3 chars) — picking a parent lists all of their children
function reEnrollInitParentSelect() {
    try {
        if (!($.fn && $.fn.select2)) { return; }
        $('#reelParent').select2({
            theme: 'bootstrap4',
            width: '100%',
            allowClear: true,
            placeholder: 'Type 3+ letters — name / email / contact…',
            minimumInputLength: 3,
            language: { inputTooShort: function () { return 'Type at least 3 characters'; }, searching: function () { return 'Searching…'; }, noResults: function () { return 'No parent found'; } },
            ajax: {
                delay: 300,
                // reuse the app's JSON POST (global beforeSend wraps it into {payload:encode(...)})
                transport: function (params, success, failure) {
                    var term = (params.data && params.data.term) ? params.data.term : '';
                    var $req = $.ajax({
                        type: 'POST',
                        contentType: APPLICATION_JSON_VALUE,
                        url: getURLForHTML('dashboard', 're-enrollment-parent-suggest'),
                        data: JSON.stringify({
                            userId: (typeof USER_ID !== 'undefined' ? USER_ID : 0),
                            schoolId: (typeof SCHOOL_ID !== 'undefined' ? SCHOOL_ID : 0),
                            term: term
                        }),
                        dataType: 'json',
                        cache: false
                    });
                    $req.then(success, failure);
                    return $req;   // jqXHR has .abort() so select2 can cancel stale searches
                },
                processResults: function (res) {
                    var items = (res && res.data) ? res.data : [];
                    return { results: items.map(function (p) { return { id: p.value, text: p.text }; }) };
                }
            }
        });
        // apply/clear the parent filter -> reload list
        $('#reelParent').off('select2:select select2:clear').on('select2:select select2:clear', function () {
            reEnrollClearCard();
            reEnrollFetch(0);
        });
    } catch (e) { /* select2 optional */ }
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
        parentSearch: ($('#reelParent').val() || '').trim(),
        cardMetric: REEL_CARD_METRIC || '',
        pageNumber: pageNumber || 0,
        pageSize: parseInt($('#reelPageSize').val(), 10) || 25
    };
    if ((pageNumber || 0) > 0) { req.knownTotal = REEL_TOTAL; }
    return req;
}

function reEnrollClearCard() { REEL_CARD_METRIC = ''; $('.reel-card-click').removeClass('reel-card-active'); }

function bindReEnrollmentEvents() {
    // filter panel collapse/expand (closed by default)
    $(document).off('click', '#reelFilterToggle').on('click', '#reelFilterToggle', function () {
        $('#reelFilterBox').stop(true, true).slideToggle(150);
        $(this).toggleClass('active');
    });
    $(document).off('click', '#reelApply').on('click', '#reelApply', function () { reEnrollClearCard(); reEnrollFetch(0); });
    $(document).off('keydown', '#reelSearch').on('keydown', '#reelSearch', function (e) { if (e.which === 13) { reEnrollClearCard(); reEnrollFetch(0); } });
    $(document).off('change', '#reelPageSize').on('change', '#reelPageSize', function () { reEnrollFetch(0); });
    $(document).off('click', '#reelExportExcel').on('click', '#reelExportExcel', function () { reEnrollExport('excel'); });
    $(document).off('click', '#reelExportCsv').on('click', '#reelExportCsv', function () { reEnrollExport('csv'); });
    // click a count box -> open the right-side list drawer for that metric
    $(document).off('click', '.reel-card-click').on('click', '.reel-card-click', function () {
        reelCardListOpen($(this).attr('data-cm') || '', $(this).attr('data-sess') || '', $(this).attr('data-title') || 'Students');
    });
    $(document).off('click', '#reelReset').on('click', '#reelReset', function () {
        reEnrollClearCard();
        $('#reelSession').val(REEL_DEFAULT_SESSION || '0');
        $('#reelDateType').val('PAYMENT_DATE');
        $('#reelStart').val(''); $('#reelEnd').val('');
        try { if ($.fn && $.fn.datepicker) { $('#reelStart').datepicker('update', ''); $('#reelEnd').datepicker('update', ''); } } catch (e) {}
        $('#reelEnrolType').val(''); $('#reelAdv').val(''); $('#reelProgress').val('');
        $('#reelSearch').val(''); $('#reelPageSize').val('25');
        try { $('#reelParent').val(null).trigger('change.select2'); } catch (e) { $('#reelParent').val(''); }
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
        reEnrollOpenStudentDetail($(this).attr('data-ssid'), $(this).attr('data-uid'), $(this).attr('data-roll'),
            $(this).attr('data-name'), $(this).attr('data-grade'), $(this).attr('data-reg'), $(this).attr('data-enrol'));
    });
    $(document).off('click', '#reelStuClose, #reelStuOverlay').on('click', '#reelStuClose, #reelStuOverlay', function () {
        $('#reelStuOverlay').removeClass('show');
        $('#reelStuDrawer').removeClass('show');
        $('#reelStuBody').html('');
    });
    // count-box list drawer: close + pager
    $(document).off('click', '#reelListClose, #reelListOverlay').on('click', '#reelListClose, #reelListOverlay', function () {
        $('#reelListOverlay').removeClass('show');
        $('#reelListDrawer').removeClass('show');
    });
    $(document).off('click', '#reelCardPager a.page-link').on('click', '#reelCardPager a.page-link', function (e) {
        e.preventDefault();
        var p = parseInt($(this).attr('data-page'), 10);
        if (!isNaN(p)) { reelCardListFetch(p); }
    });
    // popup filters -> refetch from page 0
    $(document).off('change', '#reelCardCountry, #reelCardGrade, #reelCardProgress, #reelCardAdv')
        .on('change', '#reelCardCountry, #reelCardGrade, #reelCardProgress, #reelCardAdv', function () {
            if (REEL_CARD_FILTERS_READY) { reelCardListFetch(0); }
        });
    $(document).off('keydown', '#reelCardSearch').on('keydown', '#reelCardSearch', function (e) {
        if (e.which === 13 && REEL_CARD_FILTERS_READY) { reelCardListFetch(0); }
    });
    // grade/country breakup number -> open popup filtered to that grade/country + metric
    $(document).off('click', '.reel-bclick').on('click', '.reel-bclick', function () {
        var id = $(this).attr('data-id');
        if (!id) { return; }
        var kind = $(this).attr('data-bk');
        var metric = $(this).attr('data-metric');
        var name = $(this).attr('data-name') || '';
        var label = (metric === 'total' ? 'Active' : (metric === 'reEnrolledNext' ? 'Re-enrolled' : 'Pending')) + ' · ' + name;
        // id can be a CSV of ids (a grade/country name may map to several ids) -> filter by ALL of them
        var ids = String(id).split(',');
        var preset = (kind === 'grade') ? { grade: ids } : (kind === 'country') ? { country: ids } : { progress: id };
        reelCardListOpen(metric, '', label, preset);
    });
    $(document).off('click', '#reelCardFilterReset').on('click', '#reelCardFilterReset', function () {
        $('#reelCardProgress').val(''); $('#reelCardAdv').val(''); $('#reelCardSearch').val('');
        try { $('#reelCardCountry').val(null).trigger('change.select2'); $('#reelCardGrade').val(null).trigger('change.select2'); }
        catch (e) { $('#reelCardCountry').val([]); $('#reelCardGrade').val([]); }
        reelCardListFetch(0);
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

function reEnrollOpenStudentDetail(ssid, uid, roll, name, grade, reg, enrol) {
    if (!ssid) { return; }
    // header styled like the student-list strip (pic3): uppercase pipe-separated tags on top, bold name below
    var tags = [];
    if (roll) { tags.push(roll); }
    if (enrol) { tags.push(enrol); }
    if (grade) { tags.push(grade); }
    if (reg) { tags.push(reg); }
    $('#reelStuSub').text(tags.join(' | ').toUpperCase());
    $('#reelStuTitle').text((name || 'Student Detail').toUpperCase());
    $('#reelStuAvatar').hide().attr('src', '');
    $('#reelStuIcons').empty();
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
                reEnrollFillHeaderFromCard();
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
    $('#reelBody').html('<tr><td colspan="20" class="reel-empty">Loading…</td></tr>');
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
                $('#reelBody').html('<tr><td colspan="20" class="reel-empty">Unable to load data.</td></tr>');
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
            if (data.summary && Object.keys(data.summary).length) {
                if (data.summary.filterCountries) { REEL_COUNTRIES = data.summary.filterCountries; }
                if (data.summary.filterGrades) { REEL_GRADES = data.summary.filterGrades; }
                reEnrollRenderCards(data.summary);
            }
            reEnrollRenderRows(data.data || [], req.pageNumber, req.pageSize);
            reEnrollRenderCount(REEL_TOTAL, req.pageNumber, req.pageSize);
            reEnrollRenderPager(REEL_TOTAL, req.pageNumber, req.pageSize);
        },
        error: function () {
            if (typeof checkonlineOfflineStatus === 'function' && checkonlineOfflineStatus()) { return; }
            $('#reelBody').html('<tr><td colspan="20" class="reel-empty">Unable to load data. Please retry.</td></tr>');
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
    // clickable count box -> opens the right-side list drawer for that metric
    function card(num, label, bg, color, metric, sess, title) {
        return '<div class="reel-card reel-card-click" data-cm="' + (metric || '') + '" data-sess="' + (sess || '') + '" data-title="' + reEnrollEsc(title || label) + '" style="background:' + bg + '">'
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
    // ---- Progression row : selected session base -> next session re-enrolled / pending (display-only) ----
    function pcard(num, label, bg, color) {
        return '<div class="reel-card" style="background:' + bg + '">'
            + '<div class="reel-cnum" style="color:' + color + '">' + num + '</div>'
            + '<div class="reel-clab" style="color:' + color + '">' + label + '</div></div>';
    }
    var g2 = '';
    if (s.progBase !== undefined && s.progBase !== null) {
        var pbase = Number(s.progBase || 0);
        var selName = ($('#reelSession option:selected').text() || '').replace(/\s*\(current\)\s*$/, '').trim();
        // clickable box: fresh students of the SAME year who booked advance / next-grade
        var faCard = (s.freshAdvance !== undefined && s.freshAdvance !== null)
            ? card(s.freshAdvance, 'Fresh → Re-Enrolled (same year)', '#fff4e5', '#b26a00', 'freshAdvance', '', 'Fresh → Re-Enrolled (same year)' + (selName ? (' · ' + selName) : ''))
            : '';
        var activeCard = card(pbase, 'Active Students', '#eef2ff', '#3730a3', 'total', '', 'Active Students' + (selName ? (' · ' + selName) : ''));
        if (s.progHasNext == 1) {
            var pre = Number(s.progReEnroll || 0);
            var ppend = Number(s.progPending || 0);
            var rePct = pbase > 0 ? (pre / pbase * 100) : 0;
            var pendPct = pbase > 0 ? (ppend / pbase * 100) : 0;
            var nextName = s.progNextName || 'next session';
            var head = 'Re-Enrollment Progression' + (selName ? (' · ' + selName) : '') + ' → ' + nextName;
            g2 = '<div class="reel-cgrp"><div class="reel-clabel">' + reEnrollEsc(head) + '</div><div class="reel-cards">'
                + activeCard
                + card(pre, 'Re-Enrolled · ' + rePct.toFixed(1) + '%', '#e7f6ec', '#16a34a', 'reEnrollment', (s.progNextId || ''), 'Re-Enrolled · ' + nextName)
                + card(ppend, 'Pending · ' + pendPct.toFixed(1) + '%', '#fdeaea', '#c0392b', 'pendingNext', '', 'Pending · ' + (selName || 'selected session'))
                + faCard
                + '</div></div>';
        } else {
            var head2 = 'Re-Enrollment Progression' + (selName ? (' · ' + selName) : '') + ' → no next session';
            g2 = '<div class="reel-cgrp"><div class="reel-clabel">' + reEnrollEsc(head2) + '</div><div class="reel-cards">'
                + activeCard
                + pcard('—', 'Re-Enrolled', '#eef1f4', '#98a2b3')
                + pcard('—', 'Pending', '#eef1f4', '#98a2b3')
                + faCard
                + '</div></div>';
        }
    }
    // ---- grade-wise + country-wise breakup (two tables in one row) ----
    var g3 = '';
    var gradeSec = reEnrollBreakupSection('Grade wise', 'Grade', 'grade', s.gradeBreakup);
    var countrySec = reEnrollBreakupSection('Country wise', 'Country', 'country', s.countryBreakup);
    var progressSec = reEnrollBreakupSection('Progress wise', 'Progress', 'progress', s.progressBreakup);
    if (gradeSec || countrySec) {
        g3 += '<div class="reel-breakrow">' + gradeSec + countrySec + '</div>';
    }
    if (progressSec) {
        g3 += '<div class="reel-breakrow">' + progressSec + '</div>';
    }
    $('#reelCards').html(g1 + g2 + g3);
}

// one breakup table (Grade wise / Country wise): Name | Active | Re-enroll (next) | % | Pending
// numeric cells are clickable -> open the popup list filtered to that grade/country + metric
function reEnrollBreakupSection(title, nameCol, kind, rows) {
    if (!rows) { return ''; }
    var body = '', tActive = 0, tRe = 0, tPend = 0;
    for (var i = 0; i < rows.length; i++) {
        var r = rows[i];
        var active = Number(r.active || 0);
        var re = Number(r.reEnroll || 0);
        var pend = Number(r.pending || 0);
        tActive += active; tRe += re; tPend += pend;
        var pct = active > 0 ? (re / active * 100) : 0;
        var tier = pct >= 50 ? 'reel-b5' : pct >= 40 ? 'reel-b4' : pct >= 30 ? 'reel-b3' : pct >= 20 ? 'reel-b2' : pct > 0 ? 'reel-b1' : '';
        var id = reEnrollEsc(r.id || '');
        var nm = reEnrollEsc(r.name || '');
        function bcell(val, metric, cls) {
            return '<td class="reel-bclick ' + (cls || '') + '" data-bk="' + kind + '" data-id="' + id + '" data-metric="' + metric + '" data-name="' + nm + '">' + val + '</td>';
        }
        body += '<tr class="' + tier + '">'
            + '<td class="reel-bname">' + reEnrollEsc(r.name || '-') + '</td>'
            + bcell(active.toLocaleString(), 'total')
            + bcell(re.toLocaleString(), 'reEnrolledNext')
            + '<td class="reel-bpct">' + pct.toFixed(1) + '%</td>'
            + bcell(pend.toLocaleString(), 'pendingNext')
            + '</tr>';
    }
    if (!body) { body = '<tr><td colspan="5" class="reel-bempty">No data</td></tr>'; }
    var tPct = tActive > 0 ? (tRe / tActive * 100) : 0;
    // grand totals sit in their own grey row above the blue heading row
    var totalRow = '<tr class="reel-btotr">'
        + '<th>Total</th>'
        + '<th>' + tActive.toLocaleString() + '</th>'
        + '<th>' + tRe.toLocaleString() + '</th>'
        + '<th>' + tPct.toFixed(1) + '%</th>'
        + '<th>' + tPend.toLocaleString() + '</th>'
        + '</tr>';
    return '<div class="reel-breakcol">'
        + '<div class="reel-bhead">' + reEnrollEsc(title) + '</div>'
        + '<div class="reel-bwrap"><table class="reel-btbl"><thead>'
        + totalRow
        + '<tr class="reel-blblr">'
        + '<th>' + reEnrollEsc(nameCol) + '</th><th>Active</th><th>Re-enrolled</th><th>%</th><th>Pending</th>'
        + '</tr></thead><tbody>' + body + '</tbody></table></div>'
        + '</div>';
}

// Advance column has three states: ADV = advance / seat booked, SUCCESS = paid re-enrollment
// (normal fee on a real enrollment row), N = neither. 'Y' is the old flag, kept for safety.
function reEnrollAdvLabel(v) {
    if (v === 'ADV' || v === 'Y') { return 'Advance Paid'; }
    if (v === 'SUCCESS') { return 'Success'; }
    return 'No';
}
function reEnrollAdvBadge(v) {
    var cls = (v === 'ADV' || v === 'Y') ? 'reel-adv-y' : (v === 'SUCCESS') ? 'reel-adv-s' : 'reel-adv-n';
    return '<span class="reel-badge ' + cls + '">' + reEnrollAdvLabel(v) + '</span>';
}

// builds the <tr> rows HTML (shared by the main table and the count-box list drawer)
function reEnrollRowsHtml(rows, srBase) {
    var h = '';
    for (var i = 0; i < rows.length; i++) {
        var r = rows[i];
        var adv = reEnrollAdvBadge(r.advPayment);
        var prog = (r.avgProgress === '' || r.avgProgress === null) ? '-' : (r.avgProgress + '%');
        var idCell = reEnrollEsc(r.rollNo || '-');
        if (r.studentStandardId) {
            idCell = '<a href="javascript:void(0)" class="reel-stu-link" data-ssid="' + r.studentStandardId + '" data-uid="' + (r.userId || '') + '" data-roll="' + reEnrollEsc(r.rollNo || '') + '" data-name="' + reEnrollEsc(r.name || '') + '" data-grade="' + reEnrollEsc(r.grade || '') + '" data-reg="' + reEnrollEsc(r.regType || '') + '" data-enrol="' + reEnrollEsc(r.enrolType || '') + '">' + reEnrollEsc(r.rollNo || '-') + '</a>';
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
            + '<td>' + reEnrollEsc(r.transcriptIssue || '-') + '</td>'
            + '<td>' + prog + '</td>'
            + '<td>' + reEnrollEsc(r.profileStatus || '-') + '</td>'
            + '<td>' + reEnrollEsc(r.lastLogout || '-') + '</td>'
            + '<td>' + adv + '</td>'
            + '</tr>';
    }
    return h;
}

function reEnrollRenderRows(rows, pageNumber, pageSize) {
    if (!rows.length) {
        $('#reelBody').html('<tr><td colspan="20" class="reel-empty">No students found for the selected filters.</td></tr>');
        return;
    }
    $('#reelBody').html(reEnrollRowsHtml(rows, (pageNumber || 0) * (pageSize || 25)));
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

// ---- Export (CSV / Excel) — fetches ALL rows for the CURRENT filters, then downloads client-side ----
// column order matches the on-screen table (Sr. No. added first).
var REEL_EXPORT_COLS = [
    { h: 'Sr. No.' },
    { h: 'Student ID', k: 'rollNo' },
    { h: 'Name', k: 'name' },
    { h: 'Email', k: 'email' },
    { h: 'Contact', k: 'contact' },
    { h: 'Parent Name', k: 'parentName' },
    { h: 'Parent Email', k: 'parentEmail' },
    { h: 'Parent Contact', k: 'parentContact' },
    { h: 'Country', k: 'country' },
    { h: 'Grade', k: 'grade' },
    { h: 'Reg Type', k: 'regType' },
    { h: 'Enrolment Type', k: 'enrolType' },
    { h: 'Pay Date', k: 'payDate' },
    { h: 'Academic Start', k: 'semStart' },
    { h: 'Academic End', k: 'acadEnd' },
    { h: 'Transcript Issue', k: 'transcriptIssue' },
    { h: 'Avg Progress', k: 'avgProgress' },
    { h: 'Profile Status', k: 'profileStatus' },
    { h: 'Last Logout', k: 'lastLogout' },
    { h: 'Advance', k: 'advance' }
];

function reEnrollExportVal(r, col, idx) {
    if (col.h === 'Sr. No.') { return String(idx + 1); }
    if (col.h === 'Academic Start') { return (r.semStart || r.acadStart || ''); }
    if (col.h === 'Avg Progress') {
        return (r.avgProgress === '' || r.avgProgress === null || r.avgProgress === undefined) ? '' : (r.avgProgress + '%');
    }
    if (col.h === 'Advance') { return reEnrollAdvLabel(r.advPayment); }
    var v = r[col.k];
    return (v === null || v === undefined) ? '' : String(v);
}

function reEnrollExport(type) {
    var $btn = (type === 'csv') ? $('#reelExportCsv') : $('#reelExportExcel');
    if ($btn.data('busy')) { return; }
    var orig = $btn.html();
    $btn.data('busy', true).addClass('disabled').html('<i class="fa fa-spinner fa-spin"></i>&nbsp;Preparing…');

    // request all matching rows for the current filters (page 0, big page size)
    var req = getRequestForReEnrollment(0);
    req.pageSize = Math.max(1, Number(REEL_TOTAL) || 0) || 100000;
    if (req.pageSize > 100000) { req.pageSize = 100000; }
    delete req.knownTotal;

    $.ajax({
        type: 'POST',
        contentType: APPLICATION_JSON_VALUE,
        url: getURLForHTML('dashboard', 're-enrollment-list'),
        data: JSON.stringify(req),
        dataType: 'json',
        cache: false,
        timeout: 600000,
        success: function (data) {
            $btn.data('busy', false).removeClass('disabled').html(orig);
            if (data && data['status'] == '3') { redirectLoginPage(); return; }
            var rows = (data && data.data) ? data.data : [];
            if (!rows.length) { alert('No records to export for the selected filters.'); return; }
            if (type === 'csv') { reEnrollDownloadCsv(rows); }
            else { reEnrollDownloadExcel(rows); }
        },
        error: function () {
            $btn.data('busy', false).removeClass('disabled').html(orig);
            if (typeof checkonlineOfflineStatus === 'function' && checkonlineOfflineStatus()) { return; }
            alert('Unable to export. Please retry.');
        }
    });
}

function reEnrollCsvCell(v) {
    return '"' + String(v === null || v === undefined ? '' : v).replace(/"/g, '""') + '"';
}

function reEnrollExportFileName(ext) {
    var d = new Date();
    var stamp = d.getFullYear() + ('0' + (d.getMonth() + 1)).slice(-2) + ('0' + d.getDate()).slice(-2);
    return 're-enrollment-list-' + stamp + '.' + ext;
}

function reEnrollTriggerDownload(blob, fileName) {
    var link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(function () { try { URL.revokeObjectURL(link.href); } catch (e) {} }, 1000);
}

function reEnrollDownloadCsv(rows) {
    var lines = [REEL_EXPORT_COLS.map(function (c) { return reEnrollCsvCell(c.h); }).join(',')];
    for (var i = 0; i < rows.length; i++) {
        var r = rows[i];
        lines.push(REEL_EXPORT_COLS.map(function (c) { return reEnrollCsvCell(reEnrollExportVal(r, c, i)); }).join(','));
    }
    // BOM so Excel opens UTF-8 (accents in names) correctly
    var blob = new Blob(['\ufeff' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
    reEnrollTriggerDownload(blob, reEnrollExportFileName('csv'));
}

function reEnrollDownloadExcel(rows) {
    var html = '<table border="1"><thead><tr>';
    for (var c = 0; c < REEL_EXPORT_COLS.length; c++) { html += '<th>' + reEnrollEsc(REEL_EXPORT_COLS[c].h) + '</th>'; }
    html += '</tr></thead><tbody>';
    for (var i = 0; i < rows.length; i++) {
        var r = rows[i];
        html += '<tr>';
        for (var j = 0; j < REEL_EXPORT_COLS.length; j++) {
            // prefix with a space keeps Excel from mangling long IDs / +country codes into numbers
            html += '<td style="mso-number-format:\'\\@\'">' + reEnrollEsc(reEnrollExportVal(r, REEL_EXPORT_COLS[j], i)) + '</td>';
        }
        html += '</tr>';
    }
    html += '</tbody></table>';
    var blob = new Blob(['<html><head><meta charset="utf-8"></head><body>' + html + '</body></html>'], { type: 'application/vnd.ms-excel' });
    reEnrollTriggerDownload(blob, reEnrollExportFileName('xls'));
}

// pull the real profile avatar + view/WhatsApp icons from the reused payment-report card
// (the .card-header-title strip is hidden via CSS) into our compact drawer header — full pic2 strip.
function reEnrollFillHeaderFromCard() {
    try {
        var $img = $('#reelStuBody .user-header-img').first();
        if ($img.length && $img.attr('src')) {
            $('#reelStuAvatar').attr('src', $img.attr('src')).show();
        }
        var $strip = $('#reelStuBody .card-header-title').first();
        var $icons = $strip.find('a[data-original-title="view profile"], a[data-original-title="Open WhatsApp chat"]');
        if ($icons.length) {
            // clone keeps the inline onclick handlers (global fns already loaded with the card)
            $('#reelStuIcons').empty().append($icons.clone());
            try { $('#reelStuIcons [data-toggle="tooltip"]').tooltip({ html: true }); } catch (e) {}
        }
    } catch (e) { /* header enrichment is best-effort */ }
}

/* ============================================================
   Count-box list drawer — opens the paged list for a clicked box.
   ============================================================ */
function reelCardListOpen(cm, sess, title, preset) {
    REEL_CARD_LIST_CM = cm || '';
    REEL_CARD_LIST_SESS = sess || '';
    REEL_CARD_LIST_TITLE = title || 'Students';
    REEL_CARD_LIST_TOTAL = 0;
    $('#reelListTitle').text(REEL_CARD_LIST_TITLE);
    $('#reelListSub').html('&nbsp;');
    $('#reelCardBody').html('<tr><td colspan="20" class="reel-empty">Loading…</td></tr>');
    $('#reelCardPager').html('');
    reelCardInitFilters(preset);
    $('#reelListOverlay').addClass('show');
    $('#reelListDrawer').addClass('show');
    reelCardListFetch(0);
}

// build the popup's own filters (country/grade searchable multi-select, progress, advance)
// preset (optional): {grade:[ids]} or {country:[ids]} to pre-apply a grade/country filter
function reelCardInitFilters(preset) {
    REEL_CARD_FILTERS_READY = false;   // suppress change-handler while we (re)build the controls
    // populate options once
    function fill($sel, items) {
        var h = '';
        for (var i = 0; i < (items || []).length; i++) { h += '<option value="' + reEnrollEsc(items[i].id) + '">' + reEnrollEsc(items[i].text) + '</option>'; }
        $sel.html(h);
    }
    fill($('#reelCardCountry'), REEL_COUNTRIES);
    fill($('#reelCardGrade'), REEL_GRADES);
    // start fresh: country/grade cleared; progress/advance inherit the outer selection so the popup matches the card
    // (a progress preset from the "Progress wise" section overrides the inherited value)
    $('#reelCardProgress').val((preset && preset.progress != null) ? preset.progress : ($('#reelProgress').val() || ''));
    $('#reelCardAdv').val($('#reelAdv').val() || '');
    $('#reelCardSearch').val($('#reelSearch').val() || '');
    var gradeVal = (preset && preset.grade) ? preset.grade : null;
    var countryVal = (preset && preset.country) ? preset.country : null;
    try {
        if ($.fn && $.fn.select2) {
            $('#reelCardCountry').select2({ theme: 'bootstrap4', width: '100%', placeholder: 'All countries', allowClear: true, dropdownParent: $('#reelListDrawer') });
            $('#reelCardGrade').select2({ theme: 'bootstrap4', width: '100%', placeholder: 'All grades', allowClear: true, dropdownParent: $('#reelListDrawer') });
            $('#reelCardCountry').val(countryVal).trigger('change.select2');
            $('#reelCardGrade').val(gradeVal).trigger('change.select2');
        } else {
            $('#reelCardCountry').val(countryVal || []);
            $('#reelCardGrade').val(gradeVal || []);
        }
    } catch (e) { /* select2 optional */ }
    REEL_CARD_FILTERS_READY = true;
}

function reelCardListFetch(pageNumber) {
    var page = pageNumber || 0;
    var req = getRequestForReEnrollment(page);
    req.cardMetric = REEL_CARD_LIST_CM;                       // the clicked box's metric
    if (REEL_CARD_LIST_SESS) { req.sessionId = parseInt(REEL_CARD_LIST_SESS, 10) || req.sessionId; }
    // popup's own filters
    req.country = ($('#reelCardCountry').val() || []);
    req.grade = ($('#reelCardGrade').val() || []);
    req.progress = ($('#reelCardProgress').val() || '');
    req.advPayment = ($('#reelCardAdv').val() || '');
    req.search = (($('#reelCardSearch').val() || '').trim());
    if (page > 0) { req.knownTotal = REEL_CARD_LIST_TOTAL; } else { delete req.knownTotal; }
    $('#reelCardBody').html('<tr><td colspan="20" class="reel-empty">Loading…</td></tr>');
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
                $('#reelCardBody').html('<tr><td colspan="20" class="reel-empty">Unable to load data.</td></tr>');
                return;
            }
            if (page === 0) { REEL_CARD_LIST_TOTAL = Number(data.count || 0); }
            var rows = data.data || [];
            var pageSize = req.pageSize || 25;
            if (!rows.length) {
                $('#reelCardBody').html('<tr><td colspan="20" class="reel-empty">No students found.</td></tr>');
            } else {
                $('#reelCardBody').html(reEnrollRowsHtml(rows, page * pageSize));
            }
            try { $('#reelListDrawer .reel-tablewrap').scrollTop(0).scrollLeft(0); } catch (e) {}
            var from = REEL_CARD_LIST_TOTAL === 0 ? 0 : (page * pageSize + 1);
            var to = Math.min(REEL_CARD_LIST_TOTAL, page * pageSize + rows.length);
            $('#reelListSub').text('Showing ' + from + ' to ' + to + ' of ' + REEL_CARD_LIST_TOTAL.toLocaleString() + ' students');
            reelCardListRenderPager(REEL_CARD_LIST_TOTAL, page, pageSize);
        },
        error: function () {
            if (typeof checkonlineOfflineStatus === 'function' && checkonlineOfflineStatus()) { return; }
            $('#reelCardBody').html('<tr><td colspan="20" class="reel-empty">Unable to load data. Please retry.</td></tr>');
        }
    });
}

function reelCardListRenderPager(total, pageNumber, pageSize) {
    var pages = Math.max(1, Math.ceil(total / (pageSize || 25)));
    if (pages <= 1) { $('#reelCardPager').html(''); return; }
    function li(label, page, opt) {
        opt = opt || {};
        var cls = 'page-item' + (opt.disabled ? ' disabled' : '') + (opt.active ? ' active' : '');
        var a = opt.disabled
            ? '<span class="page-link">' + label + '</span>'
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
    $('#reelCardPager').html(h);
}
