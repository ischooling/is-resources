/* ============================================================================
   Teacher Rating
   - LIST  → POST teacher-evaluation/rating/list
   - DETAIL → POST teacher-evaluation/rating/detail
   ========================================================================== */

var trState = {
    role:           'Teacher',
    periods:        [],
    selectedPeriod: null,
    pageSize:       10,
    pageNo:         1,
    rows:           [],
    groupColumns:   [],
    totalRecords:   0,
    totalPages:     0
};

var trDetailState = {
    userId:         null,
    periods:        [],
    selectedPeriod: null,
    detail:         null,
    barChart:       null,
    radarChart:     null
};

// ─── On load ────────────────────────────────────────────────────────────────

function teacherRatingOnLoad() {
    // fresh visit → back to page 1 with the default page size
    trState.pageNo = 1;
    trState.pageSize = 10;
    initTeacherRatingFilters();
    loadTeacherRatingList(true);
}

function initTeacherRatingFilters() {
    $('#trFilterPeriodId, #trFilterDateRange, #trFilterEligibility').select2({
        theme: 'bootstrap4',
        minimumResultsForSearch: Infinity,
        width: '100%'
    });

    $('#trFilterPageSize').select2({
        theme: 'bootstrap4',
        minimumResultsForSearch: Infinity,
        width: '90px'
    });

    $('#trFilterPageSize').on('change', function () {
        trState.pageSize = parseInt($(this).val()) || 10;
        trState.pageNo = 1;
        loadTeacherRatingList(false);
    });

    $('#trFilterSearch').on('keypress', function (e) {
        if (e.which === 13) applyTeacherRatingFilter();
    });

    $('#trFilterStartDate, #trFilterEndDate').datepicker({
        autoclose: true,
        format: 'M dd, yyyy',
        todayHighlight: true,
        container: 'body'
    });
    $('#trFilterStartDate').on('changeDate clearDate', function (e) {
        $('#trFilterEndDate').val('').datepicker('update', '');
        var period = trState.selectedPeriod;
        var pEnd = period ? trParseYmd(period.endDate) : null;
        // end date can't go before start, and can't exceed the period's end
        $('#trFilterEndDate').datepicker('setStartDate', e.date || (period ? trParseYmd(period.startDate) : null));
        $('#trFilterEndDate').datepicker('setEndDate', pEnd || null);
    });

    $('#trFilterDateRange').on('change', function () {
        var v = $(this).val();
        $('.trCustomDateWrap').toggle(v === 'custom');
        if (v !== 'custom') {
            $('#trFilterStartDate, #trFilterEndDate').val('').datepicker('update', '');
        } else {
            // applying period bounds whenever Custom is opened
            trUpdateListDatepickerBounds();
        }
    });

    $('#trFilterPeriodId').on('change', function () {
        var pid = parseInt($(this).val()) || null;
        if (pid && (!trState.selectedPeriod || trState.selectedPeriod.id != pid)) {
            trState.selectedPeriod = (trState.periods || []).find(function (p) { return p.id == pid; }) || trState.selectedPeriod;
            // reset date range to Full Period when the period switches
            $('#trFilterDateRange').val('full').trigger('change.select2');
            $('.trCustomDateWrap').hide();
            trUpdateListDatepickerBounds();
            trState.pageNo = 1;
            loadTeacherRatingList(false);
        }
    });
}

function applyTeacherRatingFilter() {
    trState.pageNo = 1;
    loadTeacherRatingList(false);
}

function resetTeacherRatingFilter() {
    $('#trFilterDateRange').val('full').trigger('change.select2');
    $('.trCustomDateWrap').hide();
    $('#trFilterStartDate, #trFilterEndDate').val('').datepicker('update', '');
    $('#trFilterEligibility').val('All').trigger('change.select2');
    $('#trFilterSearch').val('');
    $('#trFilterPageSize').val('10').trigger('change.select2');
    trState.pageSize = 10;
    trState.pageNo = 1;
    loadTeacherRatingList(false);
}

function trUpdateListDatepickerBounds() {
    var period = trState.selectedPeriod;
    if (!period) return;
    var s = trParseYmd(period.startDate);
    var e = trParseYmd(period.endDate);
    $('#trFilterStartDate').datepicker('setStartDate', s || null).datepicker('setEndDate', e || null);
    $('#trFilterEndDate').datepicker('setStartDate', s || null).datepicker('setEndDate', e || null);
}

// ─── Date-range resolution ─────────────────────────────────────────────────

function trResolveDateRange(rangeVal, customStart, customEnd, period) {
    // Full Period (default) → use the selected period's full startDate/endDate
    var pS = period ? trParseYmd(period.startDate) : null;
    var pE = period ? (trParseYmd(period.endDate) || trLastDayOfMonth(pS)) : null;
    if (!rangeVal || rangeVal === 'full') {
        return {
            start: pS ? changeDateFormat(pS, 'yyyy-mm-dd') : '',
            end:   pE ? changeDateFormat(pE, 'yyyy-mm-dd') : ''
        };
    }
    var today = new Date(), sd = null, ed = null;
    if (rangeVal === 'today')      { sd = ed = today; }
    else if (rangeVal === 'yesterday') { var y = new Date(today); y.setDate(y.getDate() - 1); sd = ed = y; }
    else if (rangeVal === 'thismonth') { sd = new Date(today.getFullYear(), today.getMonth(), 1); ed = new Date(today.getFullYear(), today.getMonth() + 1, 0); }
    else if (rangeVal === 'custom') {
        if (customStart) sd = $(customStart).datepicker('getDate');
        if (customEnd)   ed = $(customEnd).datepicker('getDate');
    }
    // clamp to period bounds
    if (pS && sd && sd < pS) sd = pS;
    if (pE && ed && ed > pE) ed = pE;
    return {
        start: sd ? changeDateFormat(sd, 'yyyy-mm-dd') : (pS ? changeDateFormat(pS, 'yyyy-mm-dd') : ''),
        end:   ed ? changeDateFormat(ed, 'yyyy-mm-dd') : (pE ? changeDateFormat(pE, 'yyyy-mm-dd') : '')
    };
}

function trParseYmd(ymd) {
    if (!ymd) return null;
    var p = String(ymd).split('-');
    if (p.length < 3) return null;
    return new Date(parseInt(p[0], 10), parseInt(p[1], 10) - 1, parseInt(p[2], 10));
}

function trLastDayOfMonth(d) {
    if (!d) return null;
    return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

function trFormatYmdDisplay(ymd) {
    var d = trParseYmd(ymd);
    return d ? changeDateFormat(d, 'MMM-dd-yyyy') : '—';
}

function trIsSuccess(response) {
    return response && (response.status === '1' || response.statusCode === 'SUCCESS');
}

function trGroupColor(index) {
    var colors = ['#1a73e8', '#7b1fa2', '#00897b', '#e65100', '#c62828', '#558b2f'];
    return colors[index % colors.length];
}

function trStatusMeta(status) {
    if (status === 'Pass') {
        return {
            label: 'Pass',
            badgeClass: 'badge-success',
            color: '#1e8a3c'
        };
    }
    if (status === 'No Response') {
        return {
            label: 'No Response',
            badgeClass: 'badge-secondary',
            color: '#6c757d'
        };
    }
    return {
        label: 'Fail',
        badgeClass: 'badge-danger',
        color: '#d93025'
    };
}

// parameter/overall score colors (not for group scores):
// >= threshold green, within 10 below amber, else red — e.g. 75+ / 65–74 / <65
function trScoreColor(score, threshold) {
    if (score == null) return '#9aa0a6';
    if (score >= threshold) return '#1e8a3c';
    if (score >= (threshold - 10)) return '#f57c00';
    return '#d93025';
}

// detail-page status badge — amber-tier scores (within 10 below threshold,
// the orange bar) read "Need Improvement" instead of a hard "Fail"
function trDetailStatusMeta(p) {
    if (p.status === 'Pass' || p.status === 'No Response') return trStatusMeta(p.status);
    var threshold = p.threshold != null ? p.threshold : 75;
    if (p.score != null && p.score >= (threshold - 10)) {
        return {
            label: 'Need Improvement',
            badgeClass: 'text-white',
            badgeStyle: 'background:#f57c00',   // same orange as the bar
            color: '#f57c00'
        };
    }
    return trStatusMeta(p.status);
}

function trEligibilityBadge(eligible) {
    return eligible
        ? '<span class="badge badge-success"><i class="fa fa-check-circle mr-1"></i>Eligible</span>'
        : '<span class="badge badge-danger"><i class="fa fa-times-circle mr-1"></i>Not Eligible</span>';
}

function trAvatarHtml(photo, fullName, size) {
    size = size || 34;
    var safeName = (fullName || '').replace(/"/g, '&quot;');
    var initials = (fullName || '?').split(' ').map(function (s) { return (s || '').charAt(0); }).slice(0, 2).join('').toUpperCase() || '?';
    if (typeof photo === 'string' && photo.trim()) {
        var normalizedPhoto = photo.trim();
        var src = /^https?:\/\//i.test(normalizedPhoto)
            ? normalizedPhoto
            : (CONTEXT_PATH ? (CONTEXT_PATH + normalizedPhoto) : normalizedPhoto);
        return '<img src="' + src + '" alt="' + safeName + '" onerror="this.replaceWith(Object.assign(document.createElement(\'div\'),{className:\'tr-avatar\',innerText:\'' + initials + '\',style:\'width:' + size + 'px;height:' + size + 'px;border-radius:50%;background:#1a73e8;color:#fff;display:inline-flex;align-items:center;justify-content:center;font-weight:500;font-size:12px\'}))" style="width:' + size + 'px;height:' + size + 'px;border-radius:50%;object-fit:cover">';
    }
    return '<span class="tr-avatar" style="width:' + size + 'px;height:' + size + 'px;border-radius:50%;background:#1a73e8;color:#fff;display:inline-flex;align-items:center;justify-content:center;font-weight:500;font-size:' + Math.round(size * 0.4) + 'px">' + initials + '</span>';
}

function trPeriodLabel(period) {
    if (!period) return 'N/A';
    if (period.periodLabel) return period.periodLabel + (period.roleUnderReview ? ' · ' + period.roleUnderReview : '');
    return (period.startDate || '') + ' – ' + (period.endDate || '');
}

// ─── API: list ──────────────────────────────────────────────────────────────

async function loadTeacherRatingList(isInitial) {
    var period = trState.selectedPeriod;
    var range = trResolveDateRange(
        $('#trFilterDateRange').val() || '',
        '#trFilterStartDate', '#trFilterEndDate',
        period
    );
    var payload = {
        periodId:        period ? period.id : null,
        roleUnderReview: trState.role,
        startDate:       range.start,
        endDate:         range.end,
        eligibility:     $('#trFilterEligibility').val() || 'All',
        search:          ($('#trFilterSearch').val() || '').trim(),
        page:            trState.pageNo,
        size:            trState.pageSize
    };
    try {
        var response = await callCommonAjax({
            method: 'POST',
            url: APP_BASE_URL + API_VERSION + 'teacher-evaluation/rating/list',
            body: payload,
            global: true,
            showMessage: false
        });
        if (trIsSuccess(response)) {
            var d = response.details || {};
            trState.periods        = d.periods || [];
            trState.selectedPeriod = d.selectedPeriod || trState.selectedPeriod;
            trState.rows           = d.rows || [];
            trState.groupColumns   = d.groupColumns || [];
            trState.totalRecords   = d.totalRecords || 0;
            trState.totalPages     = d.totalPages || 0;

            if (isInitial) {
                populateTeacherRatingPeriodSelect('#trFilterPeriodId', trState.periods, trState.selectedPeriod ? trState.selectedPeriod.id : null);
                trUpdateListDatepickerBounds();
            }
            renderTeacherRatingSummary(d.summary || {});
            renderTeacherRatingPerformers(d.topPerformers || [], d.needsAttention || []);
            renderTeacherRatingTable();
        } else {
            showMessageTheme2(0, (response && response.message) ? response.message : 'Failed to load teacher ratings.');
            renderTeacherRatingTable();
        }
    } catch (e) {
        showMessageTheme2(0, 'Failed to load teacher ratings.');
        renderTeacherRatingTable();
    }
}

function populateTeacherRatingPeriodSelect(selector, periods, selectedId) {
    var $el = $(selector);
    // select2 was initialised on an empty select, so swapping options via .html()
    // doesn't sync — destroy first, repopulate, then reinit
    if ($el.hasClass('select2-hidden-accessible')) {
        $el.select2('destroy');
    }
    var html = '<option value="">Select Period</option>';
    (periods || []).forEach(function (p) {
        html += '<option value="' + p.id + '">' +
                (p.periodLabel || ('Period #' + p.id)) +
                (p.roleUnderReview ? ' · ' + p.roleUnderReview : '') +
                '</option>';
    });
    $el.html(html);
    if (selectedId != null) $el.val(String(selectedId));
    $el.select2({
        theme: 'bootstrap4',
        minimumResultsForSearch: Infinity,
        width: '100%'
    });
    // .val() fires no change event, so the theme never adds .has-value to the
    // wrapper and its CSS keeps the select2 text invisible — refresh it manually
    if (typeof refreshCustomFieldState === 'function') {
        refreshCustomFieldState($el.closest('.custom-field'));
    }
}

// ─── Renderers: list page ──────────────────────────────────────────────────

function renderTeacherRatingSummary(summary) {
    $('#trStatTotal').text(summary.totalUsers != null ? summary.totalUsers : 0);
    $('#trStatEligible').text(summary.eligibleUsers != null ? summary.eligibleUsers : 0);
    $('#trStatEligibleSub').text('of ' + (summary.totalUsers != null ? summary.totalUsers : 0));
    $('#trStatAvgOverall').text((summary.averageOverall != null ? summary.averageOverall : 0) + '%');
    $('#trStatResponses').text(summary.responses != null ? summary.responses : 0);
}

function renderTeacherRatingPerformers(top, needs) {
    var threshold = trState.selectedPeriod && trState.selectedPeriod.minOverallThreshold != null ? trState.selectedPeriod.minOverallThreshold : 75;
    function card(item, palette) {
        var color = trScoreColor(item.overallScore, threshold);
        var rankBadge = '<span class="badge badge-light border ml-2">#' + (item.rank || '') + '</span>';
        var elig = item.eligible
            ? '<span class="badge badge-success mt-1"><i class="fa fa-check-circle mr-1"></i>Eligible</span>'
            : '<span class="badge badge-danger mt-1"><i class="fa fa-times-circle mr-1"></i>Not Eligible</span>';
        return '<div class="col-md-4 col-12 mb-2">' +
                '<div class="main-card card h-100" style="cursor:pointer" onclick="openTeacherRatingDetail(' + item.userId + ')">' +
                    '<div class="card-body p-2 d-flex align-items-center" style="gap:10px">' +
                        trAvatarHtml(item.photo, item.userFullName, 40) +
                        '<div style="flex:1;min-width:0">' +
                            '<div class="font-weight-bold text-truncate" title="' + (item.userFullName || '') + '">' + (item.userFullName || '—') + '</div>' +
                            '<div style="color:' + color + ';font-weight:500">' + (item.overallScore != null ? item.overallScore + '%' : '—') + '</div>' +
                            elig +
                        '</div>' +
                        rankBadge +
                    '</div>' +
                '</div>' +
            '</div>';
    }
    var topHtml = (top && top.length) ? top.map(function (x) { return card(x, 'top'); }).join('') : '<div class="col-12"><div class="text-muted small px-2">No top performers yet.</div></div>';
    var needsHtml = (needs && needs.length) ? needs.map(function (x) { return card(x, 'needs'); }).join('') : '<div class="col-12"><div class="text-muted small px-2">No one needs attention.</div></div>';
    $('#trTopPerformers').html(topHtml);
    $('#trNeedsAttention').html(needsHtml);
}

function renderTeacherRatingTable() {
    if ($.fn.DataTable.isDataTable('#teacherRatingTable')) {
        $('#teacherRatingTable').DataTable().clear().destroy();
    }

    // 1) Dynamic header
    var thHtml = '<th>#</th><th>Teacher</th>';
    var groupCols = trState.groupColumns || [];
    groupCols.forEach(function (g) {
        thHtml += '<th>' +
            (g.groupName || '') +
            (g.weight != null ? ' <small>(' + g.weight + '%)</small>' : '') +
            '</th>';
    });
    thHtml += '<th>Overall</th><th>Rating</th><th>Responses</th><th>Eligibility</th><th>Action</th>';
    $('#trTableThead').html(thHtml);

    // 2) Body
    var data = trState.rows || [];
    var threshold = trState.selectedPeriod && trState.selectedPeriod.minOverallThreshold != null ? trState.selectedPeriod.minOverallThreshold : 75;
    var html = '';
    if (!data.length) {
        var colspan = 7 + groupCols.length;
        html = '<tr><td colspan="' + colspan + '" class="text-center text-muted py-4">No records found</td></tr>';
    } else {
        data.forEach(function (row, idx) {
            html += '<tr>';
            html += '<td>' + ((trState.pageNo - 1) * trState.pageSize + idx + 1) + '</td>';
            html += '<td><div class="d-flex align-items-center" style="gap:8px">' + trAvatarHtml(row.photo, row.userFullName, 32) +
                    '<span class="font-weight-bold">' + (row.userFullName || '—') + '</span></div></td>';
            groupCols.forEach(function (g, gi) {
                var color = trGroupColor(gi);
                var score = row.groupScoreMap && row.groupScoreMap[g.groupId] != null
                            ? row.groupScoreMap[g.groupId]
                            : (function () {
                                var match = (row.groupScores || []).find(function (x) { return x.groupId === g.groupId; });
                                return match ? match.score : null;
                            })();
                html += '<td><strong style="color:' + color + '">' + (score != null ? score + '%' : '—') + '</strong></td>';
            });
            var overallColor = trScoreColor(row.overallScore, threshold);
            html += '<td><span class="badge badge-light border" style="font-size:12px;color:' + overallColor + '">' + (row.overallScore != null ? row.overallScore + '%' : '—') + '</span></td>';
            html += '<td>' + (row.overallRating != null
                        ? '<span style="font-size:13px;line-height:1;white-space:nowrap">' + trStarsHtml(row.overallRating) + '</span>' +
                          '<span class="small text-muted ml-1" style="vertical-align:middle">' + Number(row.overallRating).toFixed(1) + '</span>'
                        : '<span class="text-muted">—</span>') + '</td>';
            html += '<td><a href="javascript:void(0)" class="text-primary" onclick="openTeacherRatingResponsesModal(' + row.userId + ', \'' + trEscapeAttr(row.userFullName) + '\')"><u>' + (row.responses != null ? row.responses : 0) + '</u></a></td>';
            var elig = row.eligible
                ? '<span class="badge badge-success" title="' + (row.eligibilityReason || '') + '"><i class="fa fa-check-circle mr-1"></i>Eligible</span>'
                : '<span class="badge badge-danger" title="' + (row.eligibilityReason || '') + '"><i class="fa fa-times-circle mr-1"></i>Not Eligible</span>';
            html += '<td>' + elig + '</td>';
            html += '<td><button class="btn btn-outline-primary btn-sm" onclick="openTeacherRatingDetail(' + row.userId + ')" title="View"><i class="fa fa-eye"></i></button></td>';
            html += '</tr>';
        });
    }
    $('#teacherRatingTbody').html(html);
    if (data.length) {
        $('#teacherRatingTable').DataTable({
            destroy: true,
            ordering: false,
            searching: false,
            paging: false,
            info: false,
            autoWidth: false
        });
    }

    // 3) Pagination (server-side — DataTable paging stays off)
    $('#trPagination').html(trState.totalPages > 1 ? renderPaginationCommon(trState.pageNo, trState.totalPages, 'teacherRating') : '');
}

/* ════════════════════════════════════════════════════════════════════════════
   VIEW RESPONSES MODAL
   POST teacher-evaluation/rating/responses
   ════════════════════════════════════════════════════════════════════════════ */

var TR_ACCORDION_MS = 300;   // slide-open / slide-close duration for every accordion row

var trRespState = {
    userId:      null,
    userName:    '',
    periodId:    null,
    periods:     [],
    forms:       [],
    parameters:  [],
    tab:         'questions',
    questionRows:  [],
    parameterRows: [],
    initialized: false
};

function trEscapeAttr(s) { return String(s == null ? '' : s).replace(/"/g, '&quot;'); }

// star color tiers: 1–2.5 red, 2.6–3.5 yellow, 3.6–5 green
function trStarColor(rating) {
    var r = Number(rating) || 0;
    if (r <= 2.5) return '#d93025';
    if (r <= 3.5) return '#fbbc04';
    return '#1e8a3c';
}

function trStarsHtml(rating) {
    // fractional fill — 4.8 renders as 4 full stars + one 80%-filled star:
    // a grey 5-star row with a color row clipped to (rating/5)% on top
    var r = Math.max(0, Math.min(5, Number(rating) || 0));
    var color = trStarColor(r);
    var pct = (r / 5) * 100;
    var greyRow = '', colorRow = '';
    for (var i = 0; i < 5; i++) {
        greyRow  += '<i class="fa fa-star" style="color:#e0e0e0"></i>';
        colorRow += '<i class="fa fa-star" style="color:' + color + '"></i>';
    }
    return '<span style="position:relative;display:inline-block;line-height:1;vertical-align:middle">' +
               '<span style="white-space:nowrap">' + greyRow + '</span>' +
               '<span style="position:absolute;top:0;left:0;width:' + pct + '%;overflow:hidden;white-space:nowrap">' + colorRow + '</span>' +
           '</span>';
}

function ensureTeacherRatingResponsesModal() {
    var $m = $('#teacherRatingResponsesModal');
    // Must be a direct child of <body> — if it lives inside a hidden container
    // (e.g. #dashboardContentInHTML while the detail view is open), Bootstrap
    // shows the backdrop but the modal itself stays invisible.
    if ($m.length && $m.parent().is('body')) return;
    if ($m.length) $m.remove();
    $('body').append(getTeacherRatingResponsesModalHtml());
    trRespState.initialized = false;
}

function openTeacherRatingResponsesModal(userId, userName) {
    ensureTeacherRatingResponsesModal();

    // Resolve user context — from explicit args, else detail-page state
    if (userId == null && trDetailState && trDetailState.userId) {
        userId = trDetailState.userId;
        userName = userName ||
                   (trDetailState.detail && trDetailState.detail.profile && trDetailState.detail.profile.userFullName) ||
                   '';
    }
    if (userId == null) {
        showMessageTheme2(0, 'Please select a teacher first.');
        return;
    }

    trRespState.userId   = userId;
    trRespState.userName = userName || '';

    // Prefer detail-page selection if we're currently on the detail page
    var period = (trDetailState && trDetailState.userId == userId && trDetailState.selectedPeriod)
                    ? trDetailState.selectedPeriod
                    : trState.selectedPeriod;
    trRespState.periodId = period ? period.id : null;
    trRespState.periods  = (trDetailState && trDetailState.periods && trDetailState.periods.length)
                                ? trDetailState.periods
                                : (trState.periods || []);

    $('#trRespUserName').text(trRespState.userName || '—');
    $('#trRespFormsSummary').text('All forms');

    // Reset filter values
    $('#trRespFormId').val('');
    $('#trRespParameterId').val('');
    $('#trRespSortBy').val('');
    $('#trRespDateRange').val('full');
    $('.trRespCustomDateWrap').hide();
    $('#trRespStartDate, #trRespEndDate').val('');

    initTeacherRatingResponsesFilters();
    populateTeacherRatingPeriodSelect('#trRespPeriodId', trRespState.periods, trRespState.periodId);

    // Fire and show
    $('#teacherRatingResponsesModal').modal('show');
    trRespState.tab = 'questions';
    switchTeacherRatingResponsesTab('questions');
    loadTeacherRatingResponses();
}

function initTeacherRatingResponsesFilters() {
    if (trRespState.initialized) return;
    trRespState.initialized = true;

    $('#trRespFormId, #trRespParameterId, #trRespSortBy, #trRespDateRange').select2({
        theme: 'bootstrap4',
        minimumResultsForSearch: Infinity,
        width: '100%',
        dropdownParent: $('#teacherRatingResponsesModal')
    });

    $('#trRespStartDate, #trRespEndDate').datepicker({
        autoclose: true,
        format: 'M dd, yyyy',
        todayHighlight: true,
        container: '#teacherRatingResponsesModal',
        orientation: 'bottom auto'
    });
    $('#trRespStartDate').on('changeDate clearDate', function (e) {
        $('#trRespEndDate').val('').datepicker('update', '');
        var period = trRespGetSelectedPeriod();
        var pEnd = period ? trParseYmd(period.endDate) : null;
        $('#trRespEndDate').datepicker('setStartDate', e.date || (period ? trParseYmd(period.startDate) : null));
        $('#trRespEndDate').datepicker('setEndDate', pEnd || null);
    });

    $('#trRespDateRange').on('change', function () {
        var v = $(this).val();
        $('.trRespCustomDateWrap').toggle(v === 'custom');
        if (v !== 'custom') {
            $('#trRespStartDate, #trRespEndDate').val('').datepicker('update', '');
        } else {
            trUpdateRespDatepickerBounds();
        }
    });

    $('#trRespPeriodId').on('change', function () {
        var pid = parseInt($(this).val()) || null;
        if (pid && pid !== trRespState.periodId) {
            trRespState.periodId = pid;
            $('#trRespDateRange').val('full').trigger('change.select2');
            $('.trRespCustomDateWrap').hide();
            trUpdateRespDatepickerBounds();
            loadTeacherRatingResponses();
        }
    });
}

function trRespGetSelectedPeriod() {
    return (trRespState.periods || []).find(function (p) { return p.id == trRespState.periodId; }) || null;
}

function trUpdateRespDatepickerBounds() {
    var period = trRespGetSelectedPeriod();
    if (!period) return;
    var s = trParseYmd(period.startDate);
    var e = trParseYmd(period.endDate);
    $('#trRespStartDate').datepicker('setStartDate', s || null).datepicker('setEndDate', e || null);
    $('#trRespEndDate').datepicker('setStartDate', s || null).datepicker('setEndDate', e || null);
}

function applyTeacherRatingResponsesFilter() {
    loadTeacherRatingResponses();
}

function resetTeacherRatingResponsesFilter() {
    $('#trRespFormId').val('').trigger('change.select2');
    $('#trRespParameterId').val('').trigger('change.select2');
    $('#trRespSortBy').val('').trigger('change.select2');
    $('#trRespDateRange').val('full').trigger('change.select2');
    $('.trRespCustomDateWrap').hide();
    $('#trRespStartDate, #trRespEndDate').val('').datepicker('update', '');
    loadTeacherRatingResponses();
}

function switchTeacherRatingResponsesTab(tab) {
    trRespState.tab = tab;
    if (tab === 'questions') {
        $('#trRespTabQuestions').addClass('active');
        $('#trRespTabParameters').removeClass('active');
        $('#trRespViewQuestions').show();
        $('#trRespViewParameters').hide();
    } else {
        $('#trRespTabQuestions').removeClass('active');
        $('#trRespTabParameters').addClass('active');
        $('#trRespViewQuestions').hide();
        $('#trRespViewParameters').show();
    }
}

async function loadTeacherRatingResponses() {
    var period = trRespGetSelectedPeriod();
    var range = trResolveDateRange(
        $('#trRespDateRange').val() || 'full',
        '#trRespStartDate', '#trRespEndDate',
        period
    );
    var formVal  = $('#trRespFormId').val();
    var paramVal = $('#trRespParameterId').val();
    var payload = {
        periodId:        trRespState.periodId,
        userId:          trRespState.userId,
        roleUnderReview: trState.role,
        startDate:       range.start,
        endDate:         range.end,
        formId:          formVal  ? parseInt(formVal)  : null,
        parameterId:     paramVal ? parseInt(paramVal) : null,
        sortBy:          $('#trRespSortBy').val() || ''
    };
    try {
        var response = await callCommonAjax({
            method: 'POST',
            url: APP_BASE_URL + API_VERSION + 'teacher-evaluation/rating/responses',
            body: payload,
            global: true,
            showMessage: false
        });
        if (trIsSuccess(response)) {
            var d = response.details || {};
            trRespState.forms         = d.forms || [];
            trRespState.parameters    = d.parameters || [];
            trRespState.questionRows  = d.questionRows || [];
            trRespState.parameterRows = d.parameterRows || [];

            // Header profile name may become authoritative from response
            if (d.profile && d.profile.userFullName) {
                trRespState.userName = d.profile.userFullName;
                $('#trRespUserName').text(trRespState.userName);
            }

            // Header summary
            var formLabel = formVal
                ? (trRespState.forms.find(function (f) { return String(f.value) === String(formVal); }) || {}).label || 'All forms'
                : ('All forms · ' + trRespState.forms.length + ' forms');
            $('#trRespFormsSummary').text(formLabel);

            populateRespOptionSelect('#trRespFormId',      'All Forms',      trRespState.forms,      formVal);
            populateRespOptionSelect('#trRespParameterId', 'All Parameters', trRespState.parameters, paramVal);

            renderTeacherRatingResponsesQuestions(trRespState.questionRows);
            renderTeacherRatingResponsesParameters(trRespState.parameterRows);
        } else {
            showMessageTheme2(0, (response && response.message) ? response.message : 'Failed to load responses.');
            renderTeacherRatingResponsesQuestions([]);
            renderTeacherRatingResponsesParameters([]);
        }
    } catch (e) {
        showMessageTheme2(0, 'Failed to load responses.');
        renderTeacherRatingResponsesQuestions([]);
        renderTeacherRatingResponsesParameters([]);
    }
}

function populateRespOptionSelect(selector, allLabel, options, preserveVal) {
    var $el = $(selector);
    if ($el.hasClass('select2-hidden-accessible')) {
        $el.select2('destroy');
    }
    var html = '<option value="">' + allLabel + '</option>';
    (options || []).forEach(function (o) {
        html += '<option value="' + trEscapeAttr(o.value) + '">' + (o.label || '') + '</option>';
    });
    $el.html(html);
    if (preserveVal) $el.val(String(preserveVal));
    $el.select2({
        theme: 'bootstrap4',
        minimumResultsForSearch: Infinity,
        width: '100%',
        dropdownParent: $('#teacherRatingResponsesModal')
    });
    if (typeof refreshCustomFieldState === 'function') {
        refreshCustomFieldState($el.closest('.custom-field'));
    }
}

function renderTeacherRatingResponsesQuestions(rows) {
    var html = '';
    if (!rows || !rows.length) {
        html = '<tr><td colspan="7" class="text-center text-muted py-4">No responses found</td></tr>';
    } else {
        rows.forEach(function (r, i) {
            var scoreClass = (r.averageScore != null && r.averageScore >= 75) ? 'text-success'
                             : (r.averageScore != null && r.averageScore >= 50) ? 'text-warning' : 'text-danger';
            var qId = r.questionId;
            // Subtle zebra so long lists don't melt together
            var zebra = i % 2 === 0 ? '#ffffff' : '#fbfcfd';
            html += '<tr class="tr-resp-q-row" data-qid="' + qId + '" data-zebra="' + zebra + '"' +
                            ' style="cursor:pointer;background:' + zebra + ';transition:background .15s"' +
                            ' onmouseover="if(!this.classList.contains(\'is-expanded\'))this.style.background=\'#eef4fb\'"' +
                            ' onmouseout="if(!this.classList.contains(\'is-expanded\'))this.style.background=this.dataset.zebra"' +
                            ' onclick="toggleTeacherRatingRespQuestion(' + qId + ')">' +
                        '<td>' + (i + 1) + '</td>' +
                        '<td>' +
                            '<div class="font-weight-bold">' + (r.questionText || '—') + '</div>' +
                            '<div class="small text-muted">' + (r.formLabel || '') + '</div>' +
                        '</td>' +
                        '<td>' +
                            '<div>' + (r.parameterName || '—') + '</div>' +
                            '<div class="small text-muted">' + (r.groupName || '') + '</div>' +
                        '</td>' +
                        '<td class="text-center">' +
                            '<div style="font-size:14px;line-height:1">' + trStarsHtml(r.averageRating) + '</div>' +
                            '<div class="small text-muted mt-1">' + (r.averageRating != null ? r.averageRating.toFixed(1) : '—') + '/5</div>' +
                        '</td>' +
                        '<td class="text-center font-weight-bold ' + scoreClass + '">' + (r.averageScore != null ? r.averageScore + '%' : '—') + '</td>' +
                        '<td class="text-center">' + (r.responseCount != null ? r.responseCount : 0) + '</td>' +
                        '<td class="text-center"><i class="fa fa-chevron-down text-muted" id="trRespQIcon-' + qId + '"></i></td>' +
                    '</tr>' +
                    '<tr class="tr-resp-q-detail" id="trRespQDetailRow-' + qId + '" style="display:none">' +
                        '<td colspan="7" class="p-0" style="background:#eaf2ff;border-left:4px solid #1a73e8">' +
                            // Padding-less wrapper is what we animate — keeps the slide smooth
                            // inside a <td> (padding on the inner div doesn't participate in the animation).
                            '<div id="trRespQDetailWrap-' + qId + '" style="display:none;overflow:hidden">' +
                                '<div class="p-3" id="trRespQDetailBody-' + qId + '"></div>' +
                            '</div>' +
                        '</td>' +
                    '</tr>';
        });
    }
    $('#trRespQuestionsTbody').html(html);
}

/* ─── Top-level Questions row expansion (Questions tab) ─────────────────── */

function toggleTeacherRatingRespQuestion(qId) {
    var $row  = $('#trRespQDetailRow-' + qId);
    var $wrap = $('#trRespQDetailWrap-' + qId);
    var $body = $('#trRespQDetailBody-' + qId);
    var $icon = $('#trRespQIcon-' + qId);
    var $qRow = $('.tr-resp-q-row[data-qid="' + qId + '"]');
    if ($wrap.is(':visible')) {
        // Animate the wrapper (no padding, overflow:hidden) then hide the whole tr
        $wrap.slideUp(TR_ACCORDION_MS, 'swing', function () { $row.hide(); });
        $qRow.removeClass('is-expanded').css('background', $qRow.attr('data-zebra') || '');
        $icon.removeClass('text-primary fa-chevron-up').addClass('text-muted fa-chevron-down');
        return;
    }
    $qRow.addClass('is-expanded').css('background', '#eaf2ff');
    $icon.removeClass('text-muted fa-chevron-down').addClass('text-primary fa-chevron-up');
    if (!$body.data('loaded')) {
        $body.html(trRespLoadingHtml('Loading evaluators…'));
        loadRespQuestionDetail(qId, '#trRespQDetailBody-' + qId);
    }
    $row.show();
    $wrap.stop(true, true).slideDown(TR_ACCORDION_MS, 'swing');
}

/* ─── Question detail API + evaluator card grid renderer ────────────────── */

async function loadRespQuestionDetail(qId, containerSelector) {
    var period = trRespGetSelectedPeriod();
    var range = trResolveDateRange(
        $('#trRespDateRange').val() || 'full',
        '#trRespStartDate', '#trRespEndDate',
        period
    );
    var payload = {
        periodId:        trRespState.periodId,
        userId:          trRespState.userId,
        roleUnderReview: trState.role,
        startDate:       range.start,
        endDate:         range.end,
        questionId:      qId
    };
    try {
        var response = await callCommonAjax({
            method: 'POST',
            url: APP_BASE_URL + API_VERSION + 'user-rating/rating/responses/question-detail',
            body: payload,
            global: false,
            showMessage: false
        });
        if (trIsSuccess(response)) {
            var d = response.details || {};
            renderRespEvaluators(d.evaluators || [], containerSelector);
        } else {
            $(containerSelector).html('<div class="text-center text-danger py-3">Failed to load evaluators.</div>');
        }
    } catch (e) {
        $(containerSelector).html('<div class="text-center text-danger py-3">Failed to load evaluators.</div>');
    }
}

function renderRespEvaluators(evaluators, containerSelector) {
    var $body = $(containerSelector);
    if (!evaluators || !evaluators.length) {
        $body.html('<div class="text-center text-muted py-3">No evaluators yet</div>');
        $body.data('loaded', true);
        return;
    }
    var html = '<div class="row" style="row-gap:8px">';
    evaluators.forEach(function (ev) {
        var r = Number(ev.ratingValue) || 0;
        var name  = ev.evaluatorName || 'Evaluator';
        var initials = name.split(' ').map(function (s) { return (s || '').charAt(0); }).slice(0, 2).join('').toUpperCase() || '?';
        // Photo-first avatar; on load error, swap the <img> for an initials badge in-place
        var avatarHtml;
        if (ev.evaluatorPhoto) {
            var src = ev.evaluatorPhoto.indexOf('http') === 0
                        ? ev.evaluatorPhoto
                        : (CONTEXT_PATH ? (CONTEXT_PATH + ev.evaluatorPhoto) : ev.evaluatorPhoto);
            avatarHtml = '<img src="' + trEscapeAttr(src) + '" alt="' + trEscapeAttr(name) + '"' +
                            ' style="width:36px;height:36px;border-radius:50%;object-fit:cover;flex-shrink:0;border:1px solid #e0e0e0"' +
                            ' onerror="this.outerHTML=\'<span style=&quot;width:36px;height:36px;border-radius:50%;background:#1a73e8;color:#fff;display:inline-flex;align-items:center;justify-content:center;font-weight:600;flex-shrink:0;font-size:12px&quot;>' + initials + '</span>\'">';
        } else {
            avatarHtml = '<span style="width:36px;height:36px;border-radius:50%;background:#1a73e8;color:#fff;display:inline-flex;align-items:center;justify-content:center;font-weight:600;flex-shrink:0;font-size:12px">' + initials + '</span>';
        }
        var comment = ev.comment
            ? '<div class="small text-muted mt-1" style="font-style:italic;line-height:1.35"><i class="fa fa-quote-left mr-1" style="opacity:.5"></i>' + trEscapeAttr(ev.comment) + '</div>'
            : '';
        html += '<div class="col-md-3 col-sm-6 col-12 mb-2">' +
                    '<div class="border rounded p-2 h-100 bg-white d-flex" style="gap:10px">' +
                        avatarHtml +
                        '<div style="flex:1;min-width:0">' +
                            '<div class="font-weight-bold text-truncate" title="' + trEscapeAttr(name) + '">' + name + '</div>' +
                            '<div style="font-size:13px;line-height:1">' + trStarsHtml(r) + '</div>' +
                            comment +
                        '</div>' +
                    '</div>' +
                '</div>';
    });
    html += '</div>';
    $body.html(html);
    $body.data('loaded', true);
}

function trRespLoadingHtml(msg) {
    return '<div class="text-center text-muted py-3"><i class="fa fa-spinner fa-spin mr-2"></i>' + (msg || 'Loading…') + '</div>';
}

function renderTeacherRatingResponsesParameters(rows) {
    var $body = $('#trRespParametersBody');
    if (!rows || !rows.length) {
        $body.html('<div class="text-center text-muted py-5">No parameter data found</div>');
        return;
    }

    // Group parameter rows by groupId
    var groupsMap = {};
    var groupOrder = [];
    rows.forEach(function (r) {
        if (!groupsMap[r.groupId]) {
            groupsMap[r.groupId] = { groupId: r.groupId, groupName: r.groupName, params: [] };
            groupOrder.push(r.groupId);
        }
        groupsMap[r.groupId].params.push(r);
    });

    // Compute group aggregates (weighted by responseCount when available)
    groupOrder.forEach(function (gid) {
        var g = groupsMap[gid];
        var respSum = 0, scoreWeighted = 0, ratingWeighted = 0, questionSum = 0;
        g.params.forEach(function (p) {
            var w = p.responseCount || 1;
            respSum += (p.responseCount || 0);
            scoreWeighted += (p.averageScore || 0) * w;
            ratingWeighted += (p.averageRating || 0) * w;
            questionSum += (p.questionCount || 0);
        });
        var wSum = g.params.reduce(function (a, p) { return a + (p.responseCount || 1); }, 0);
        g.avgScore  = wSum > 0 ? +(scoreWeighted / wSum).toFixed(1) : 0;
        g.avgRating = wSum > 0 ? +(ratingWeighted / wSum).toFixed(1) : 0;
        g.paramCount = g.params.length;
        g.questionCount = questionSum;
        g.responseCount = respSum;
    });

    var html = '';
    groupOrder.forEach(function (gid, gi) {
        var g = groupsMap[gid];
        var color = trGroupColor(gi);
        // Soft tint for group header — derived from the group's brand color
        var headerBg = trHexToRgba(color, 0.08);
        var scoreCls = g.avgScore >= 75 ? 'text-success' : (g.avgScore >= 50 ? 'text-warning' : 'text-danger');

        html += '<div class="mb-3 shadow-sm rounded" style="background:#fff;border:1px solid #e0e3e7;border-left:4px solid ' + color + ';overflow:hidden">';
        // Group header (clickable)
        html += '<div class="d-flex align-items-center p-3" style="gap:12px;cursor:pointer;background:' + headerBg + '" onclick="toggleTeacherRatingRespGroup(' + gid + ')">' +
                    '<i class="fa fa-folder" style="color:' + color + ';font-size:20px"></i>' +
                    '<div style="flex:1;min-width:0">' +
                        '<div class="font-weight-bold text-truncate" style="font-size:14px">' + (g.groupName || '') + '</div>' +
                        '<div class="small text-muted">' + g.paramCount + ' params · ' + g.questionCount + ' questions · ' + g.responseCount + ' responses</div>' +
                    '</div>' +
                    '<div class="font-weight-bold ' + scoreCls + '" style="font-size:18px">' + (g.avgScore != null ? g.avgScore + '%' : '—') + '</div>' +
                    '<i class="fa fa-chevron-down text-muted" id="trRespGroupIcon-' + gid + '"></i>' +
                '</div>';

        // Parameters body (collapsible) — sits on a slightly grey backdrop so nested cards stand out
        html += '<div id="trRespGroupBody-' + gid + '" style="background:#fafbfc">';
        g.params.forEach(function (p, pi) {
            var pid = p.parameterId;
            var pScoreCls = (p.averageScore != null && p.averageScore >= 75) ? 'text-success'
                            : (p.averageScore != null && p.averageScore >= 50) ? 'text-warning' : 'text-danger';
            var topBorder = pi === 0 ? 'border-top:1px solid #e0e3e7' : 'border-top:1px solid #eef0f2';
            html += '<div class="tr-resp-param" data-pid="' + pid + '" style="' + topBorder + ';background:#fff;transition:background .15s"' +
                            ' onmouseover="if(!this.classList.contains(\'is-expanded\'))this.style.background=\'#f6f8fb\'"' +
                            ' onmouseout="if(!this.classList.contains(\'is-expanded\'))this.style.background=\'#fff\'">' +
                        // Parameter row (click → expand nested questions)
                        '<div class="d-flex align-items-center p-3" style="gap:12px;flex-wrap:wrap;cursor:pointer" onclick="toggleTeacherRatingRespParameter(' + pid + ')">' +
                            '<div style="flex:1;min-width:200px">' +
                                '<div class="font-weight-bold">' + (p.parameterName || '') + '</div>' +
                                '<div class="small text-muted">' + (p.questionCount != null ? p.questionCount + ' questions · ' : '') + (p.responseCount != null ? p.responseCount + ' responses' : '') + '</div>' +
                            '</div>' +
                            '<div class="text-center" style="min-width:110px">' +
                                '<div style="font-size:14px;line-height:1">' + trStarsHtml(p.averageRating) + '</div>' +
                                '<div class="small text-muted mt-1">' + (p.averageRating != null ? p.averageRating.toFixed(1) : '—') + '/5</div>' +
                            '</div>' +
                            '<div class="font-weight-bold ' + pScoreCls + '" style="min-width:60px;text-align:right">' + (p.averageScore != null ? p.averageScore + '%' : '—') + '</div>' +
                            '<i class="fa fa-chevron-down text-muted ml-2" id="trRespParamIcon-' + pid + '"></i>' +
                        '</div>' +
                        // Nested questions container (loaded lazily via parameter-detail API)
                        '<div id="trRespParamBody-' + pid + '" data-gcolor="' + color + '" style="display:none;background:#f0f3f7;border-top:1px solid #e0e3e7"></div>' +
                    '</div>';
        });
        html += '</div>';
        html += '</div>';
    });

    $body.html(html);
}

// Convert a hex color to an rgba() string at the given alpha
function trHexToRgba(hex, alpha) {
    var h = String(hex || '').replace('#', '');
    if (h.length === 3) h = h.split('').map(function (c) { return c + c; }).join('');
    var r = parseInt(h.substring(0, 2), 16) || 0;
    var g = parseInt(h.substring(2, 4), 16) || 0;
    var b = parseInt(h.substring(4, 6), 16) || 0;
    return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
}

function toggleTeacherRatingRespGroup(groupId) {
    var $body = $('#trRespGroupBody-' + groupId);
    var $icon = $('#trRespGroupIcon-' + groupId);
    if ($body.is(':visible')) {
        $body.slideUp(TR_ACCORDION_MS, 'swing');
        $icon.removeClass('fa-chevron-up').addClass('fa-chevron-down');
    } else {
        $body.slideDown(TR_ACCORDION_MS, 'swing');
        $icon.removeClass('fa-chevron-down').addClass('fa-chevron-up');
    }
}

/* ─── Parameter row expansion (Parameters tab, level 2) ─────────────────── */

function toggleTeacherRatingRespParameter(paramId) {
    var $body = $('#trRespParamBody-' + paramId);
    var $icon = $('#trRespParamIcon-' + paramId);
    var $wrap = $('.tr-resp-param[data-pid="' + paramId + '"]');
    if ($body.is(':visible')) {
        $body.slideUp(TR_ACCORDION_MS, 'swing');
        $icon.removeClass('text-primary fa-chevron-up').addClass('text-muted fa-chevron-down');
        $wrap.removeClass('is-expanded').css('background', '#fff');
        return;
    }
    $icon.removeClass('text-muted fa-chevron-down').addClass('text-primary fa-chevron-up');
    $wrap.addClass('is-expanded').css('background', '#eef4fb');
    if (!$body.data('loaded')) {
        $body.html(trRespLoadingHtml('Loading questions…'));
        $body.slideDown(TR_ACCORDION_MS, 'swing');
        loadRespParameterDetail(paramId);
    } else {
        $body.slideDown(TR_ACCORDION_MS, 'swing');
    }
}

async function loadRespParameterDetail(paramId) {
    var period = trRespGetSelectedPeriod();
    var range = trResolveDateRange(
        $('#trRespDateRange').val() || 'full',
        '#trRespStartDate', '#trRespEndDate',
        period
    );
    var param = (trRespState.parameterRows || []).find(function (r) { return r.parameterId == paramId; });
    if (!param) return;
    var payload = {
        periodId:        trRespState.periodId,
        userId:          trRespState.userId,
        roleUnderReview: trState.role,
        startDate:       range.start,
        endDate:         range.end,
        groupId:         param.groupId,
        parameterId:     paramId
    };
    try {
        var response = await callCommonAjax({
            method: 'POST',
            url: APP_BASE_URL + API_VERSION + 'user-rating/rating/responses/parameter-detail',
            body: payload,
            global: false,
            showMessage: false
        });
        if (trIsSuccess(response)) {
            var d = response.details || {};
            renderRespParameterQuestions(paramId, d.questions || []);
        } else {
            $('#trRespParamBody-' + paramId).html('<div class="text-center text-danger py-3">Failed to load questions.</div>');
        }
    } catch (e) {
        $('#trRespParamBody-' + paramId).html('<div class="text-center text-danger py-3">Failed to load questions.</div>');
    }
}

function renderRespParameterQuestions(paramId, questions) {
    var $body = $('#trRespParamBody-' + paramId);
    if (!questions.length) {
        $body.html('<div class="text-center text-muted py-3">No questions</div>');
        $body.data('loaded', true);
        return;
    }
    var color = $body.data('gcolor') || '#1a73e8';
    var html = '<div class="p-2" style="padding-left:32px !important">';
    questions.forEach(function (q, qi) {
        var qId = q.questionId;
        var scoreCls = (q.averageScore != null && q.averageScore >= 75) ? 'text-success'
                       : (q.averageScore != null && q.averageScore >= 50) ? 'text-warning' : 'text-danger';
        html += '<div class="tr-resp-pq mb-1 rounded" data-qid="' + qId + '" style="background:#fff;border:1px solid #e0e3e7;overflow:hidden;transition:background .15s">' +
                    // Nested question row (level 3) — click loads evaluators
                    '<div class="d-flex align-items-center py-2 px-3" style="gap:12px;flex-wrap:wrap;cursor:pointer;border-left:3px solid ' + color + '"' +
                            ' onmouseover="if(!this.parentNode.classList.contains(\'is-expanded\'))this.parentNode.style.background=\'#f6f8fb\'"' +
                            ' onmouseout="if(!this.parentNode.classList.contains(\'is-expanded\'))this.parentNode.style.background=\'#fff\'"' +
                            ' onclick="toggleTeacherRatingRespNestedQuestion(' + qId + ')">' +
                        '<div style="flex:1;min-width:200px">' +
                            '<div style="font-weight:500">' + (q.questionText || '') + '</div>' +
                            '<div class="small text-muted">' + (q.formLabel || '') + (q.responseCount != null ? ' · ' + q.responseCount + ' responses' : '') + '</div>' +
                        '</div>' +
                        '<div class="text-center" style="min-width:110px">' +
                            '<div style="font-size:14px;line-height:1">' + trStarsHtml(q.averageRating) + '</div>' +
                            '<div class="small text-muted mt-1">' + (q.averageRating != null ? q.averageRating.toFixed(1) : '—') + '/5</div>' +
                        '</div>' +
                        '<div class="font-weight-bold ' + scoreCls + '" style="min-width:60px;text-align:right">' + (q.averageScore != null ? q.averageScore + '%' : '—') + '</div>' +
                        '<i class="fa fa-chevron-down text-muted ml-2" id="trRespPQIcon-' + qId + '"></i>' +
                    '</div>' +
                    // Nested evaluator body — visually anchored under this question
                    '<div id="trRespPQBody-' + qId + '" style="display:none;background:#eaf2ff;border-top:1px solid #cfe0ff;padding:12px"></div>' +
                '</div>';
    });
    html += '</div>';
    $body.html(html);
    $body.data('loaded', true);
}

/* ─── Nested question expansion inside a parameter (Parameters tab, level 3) ── */

function toggleTeacherRatingRespNestedQuestion(qId) {
    var $body = $('#trRespPQBody-' + qId);
    var $icon = $('#trRespPQIcon-' + qId);
    var $wrap = $('.tr-resp-pq[data-qid="' + qId + '"]');
    if ($body.is(':visible')) {
        $body.slideUp(TR_ACCORDION_MS, 'swing');
        $icon.removeClass('text-primary fa-chevron-up').addClass('text-muted fa-chevron-down');
        $wrap.removeClass('is-expanded').css('background', '#fff');
        return;
    }
    $icon.removeClass('text-muted fa-chevron-down').addClass('text-primary fa-chevron-up');
    $wrap.addClass('is-expanded').css('background', '#eef4fb');
    if (!$body.data('loaded')) {
        $body.html(trRespLoadingHtml('Loading evaluators…'));
        $body.slideDown(TR_ACCORDION_MS, 'swing');
        loadRespQuestionDetail(qId, '#trRespPQBody-' + qId);
    } else {
        $body.slideDown(TR_ACCORDION_MS, 'swing');
    }
}


/* ════════════════════════════════════════════════════════════════════════════
   DETAIL PAGE
   ════════════════════════════════════════════════════════════════════════════ */

function openTeacherRatingDetail(userId) {
    trDetailState.userId = userId;
    trDetailState.selectedPeriod = trState.selectedPeriod;   // seed with list-page selection
    trDetailState.periods = trState.periods;
    showAndHideDashboardAndAdditionalContent('additional');
    $('#dashboardContentInHTMLAdditional').html(getTeacherRatingDetailPageContent());
    trScrollToTop();
    initTeacherRatingDetailFilters();
    populateTeacherRatingPeriodSelect('#trdFilterPeriodId', trDetailState.periods, trDetailState.selectedPeriod ? trDetailState.selectedPeriod.id : null);
    loadTeacherRatingDetail();
}

function backToTeacherRatingList() {
    if (trDetailState.barChart) { try { trDetailState.barChart.destroy(); } catch (e) {} trDetailState.barChart = null; }
    if (trDetailState.radarChart) { try { trDetailState.radarChart.destroy(); } catch (e) {} trDetailState.radarChart = null; }
    showAndHideDashboardAndAdditionalContent('main');
    trScrollToTop();
    // list DOM (filters, page size, page number, rows) survives the detail
    // view untouched — no reload needed
}

function trScrollToTop() {
    // Reset scroll on the window and any scrollable dashboard container so the
    // new view lands at the top instead of inheriting the previous scroll offset.
    try { window.scrollTo({ top: 0, behavior: 'auto' }); } catch (e) { window.scrollTo(0, 0); }
    $('html, body').scrollTop(0);
    $('#dashboardContentInHTML, #dashboardContentInHTMLAdditional, .app-main__inner, .app-main, .app-container').scrollTop(0);
}

function initTeacherRatingDetailFilters() {
    $('#trdFilterPeriodId, #trdFilterDateRange').select2({
        theme: 'bootstrap4',
        minimumResultsForSearch: Infinity,
        width: '100%'
    });
    $('#trdFilterStartDate, #trdFilterEndDate').datepicker({
        autoclose: true,
        format: 'M dd, yyyy',
        todayHighlight: true,
        container: 'body'
    });
    $('#trdFilterStartDate').on('changeDate clearDate', function (e) {
        $('#trdFilterEndDate').val('').datepicker('update', '');
        var period = trDetailState.selectedPeriod;
        var pEnd = period ? trParseYmd(period.endDate) : null;
        $('#trdFilterEndDate').datepicker('setStartDate', e.date || (period ? trParseYmd(period.startDate) : null));
        $('#trdFilterEndDate').datepicker('setEndDate', pEnd || null);
    });
    $('#trdFilterDateRange').on('change', function () {
        if ($(this).val() === 'custom') trUpdateDetailDatepickerBounds();
        trdSyncDateInputs();
    });
    $('#trdFilterPeriodId').on('change', function () {
        var pid = parseInt($(this).val()) || null;
        if (pid && (!trDetailState.selectedPeriod || trDetailState.selectedPeriod.id != pid)) {
            trDetailState.selectedPeriod = (trDetailState.periods || []).find(function (p) { return p.id == pid; }) || trDetailState.selectedPeriod;
            // reset date range to Full Period on period switch
            $('#trdFilterDateRange').val('full').trigger('change.select2');
            $('#trdFilterStartDate, #trdFilterEndDate').val('').datepicker('update', '');
            trUpdateDetailDatepickerBounds();
            trdSyncDateInputs();
            loadTeacherRatingDetail();
        }
    });
    trUpdateDetailDatepickerBounds();
    trdSyncDateInputs();
}

// Start/End date inputs only appear for the Custom range; opening Custom
// seeds them with the period's full range as a starting point
function trdSyncDateInputs() {
    var isCustom = ($('#trdFilterDateRange').val() || 'full') === 'custom';
    $('.trdCustomDateWrap').toggle(isCustom);
    if (!isCustom) return;
    // opening Custom with empty dates → seed with the period's full range
    if (!$('#trdFilterStartDate').val() && !$('#trdFilterEndDate').val()) {
        var range = trResolveDateRange('full', null, null, trDetailState.selectedPeriod);
        // set start first — its changeDate handler clears the end date
        $('#trdFilterStartDate').datepicker('update', range.start ? trParseYmd(range.start) : '');
        $('#trdFilterEndDate').datepicker('update', range.end ? trParseYmd(range.end) : '');
    }
}

function trUpdateDetailDatepickerBounds() {
    var period = trDetailState.selectedPeriod;
    if (!period) return;
    var s = trParseYmd(period.startDate);
    var e = trParseYmd(period.endDate);
    $('#trdFilterStartDate').datepicker('setStartDate', s || null).datepicker('setEndDate', e || null);
    $('#trdFilterEndDate').datepicker('setStartDate', s || null).datepicker('setEndDate', e || null);
}

function applyTeacherRatingDetailFilter() {
    loadTeacherRatingDetail();
}

function resetTeacherRatingDetailFilter() {
    $('#trdFilterDateRange').val('full').trigger('change.select2');
    $('#trdFilterStartDate, #trdFilterEndDate').val('').datepicker('update', '');
    trUpdateDetailDatepickerBounds();
    trdSyncDateInputs();
    loadTeacherRatingDetail();
}

async function loadTeacherRatingDetail() {
    var period = trDetailState.selectedPeriod;
    var range = trResolveDateRange(
        $('#trdFilterDateRange').val() || '',
        '#trdFilterStartDate', '#trdFilterEndDate',
        period
    );
    var payload = {
        periodId:        period ? period.id : null,
        userId:          trDetailState.userId,
        roleUnderReview: trState.role,
        startDate:       range.start,
        endDate:         range.end
    };
    try {
        var response = await callCommonAjax({
            method: 'POST',
            url: APP_BASE_URL + API_VERSION + 'teacher-evaluation/rating/detail',
            body: payload,
            global: true,
            showMessage: false
        });
        if (trIsSuccess(response)) {
            trDetailState.detail = response.details || {};
            if (trDetailState.detail.selectedPeriod) {
                trDetailState.selectedPeriod = trDetailState.detail.selectedPeriod;
                trUpdateDetailDatepickerBounds();
                trdSyncDateInputs();
            }
            renderTeacherRatingDetail();
        } else {
            showMessageTheme2(0, (response && response.message) ? response.message : 'Failed to load rating detail.');
        }
    } catch (e) {
        showMessageTheme2(0, 'Failed to load rating detail.');
    }
}

function renderTeacherRatingDetailCharts(d) {
    if (typeof ApexCharts === 'undefined') return;

    var bar = d.groupThresholdChart || {};
    if (trDetailState.barChart) { try { trDetailState.barChart.destroy(); } catch (e) {} trDetailState.barChart = null; }
    $('#trdBarChart').empty();
    var barOptions = {
        chart: { type: 'bar', height: 460, toolbar: { show: false } },
        series: [{ name: 'Score', data: bar.scoreValues || [] }],
        xaxis: {
            categories: bar.labels || [],
            labels: { rotate: -25, style: { fontSize: '10px' } }
        },
        yaxis: { min: 0, max: 100, tickAmount: 5, labels: { formatter: function (v) { return v + '%'; } } },
        plotOptions: { bar: { borderRadius: 4, columnWidth: '55%' } },
        // per-bar color from the parameter score scheme (green / amber / red)
        colors: [function (ctx) {
            var t = (bar.thresholdValues || [])[ctx.dataPointIndex];
            return trScoreColor(ctx.value, t != null ? t : 75);
        }],
        dataLabels: { enabled: false },
        tooltip: { y: { formatter: function (v) { return v + '%'; } } },
        annotations: {
            yaxis: ((bar.thresholdValues || []).length ? [{
                y: bar.thresholdValues[0],
                borderColor: '#d93025',
                strokeDashArray: 4,
                label: { borderColor: '#d93025', style: { color: '#fff', background: '#d93025' }, text: 'Threshold ' + bar.thresholdValues[0] + '%' }
            }] : [])
        }
    };
    try {
        trDetailState.barChart = new ApexCharts(document.querySelector('#trdBarChart'), barOptions);
        trDetailState.barChart.render();
    } catch (e) { /* noop */ }

    var radar = d.performanceRadarChart || {};
    // chart arrays are index-aligned with parameterBreakdown — drop the
    // parameters without any response so they don't drag the radar to 0
    var radarLabels     = radar.labels || [];
    var radarScores     = radar.scoreValues || [];
    var radarThresholds = radar.thresholdValues || [];
    var breakdown = d.parameterBreakdown || [];
    if (breakdown.length === radarLabels.length) {
        var fLabels = [], fScores = [], fThresholds = [];
        breakdown.forEach(function (p, i) {
            if (p.status !== 'No Response') {
                fLabels.push(radarLabels[i]);
                fScores.push(radarScores[i]);
                fThresholds.push(radarThresholds[i]);
            }
        });
        radarLabels = fLabels; radarScores = fScores; radarThresholds = fThresholds;
    }
    if (trDetailState.radarChart) { try { trDetailState.radarChart.destroy(); } catch (e) {} trDetailState.radarChart = null; }
    $('#trdRadarChart').empty();
    var radarOptions = {
        chart: { type: 'radar', height: 460, toolbar: { show: false }, offsetY: 10 },
        series: [
            { name: 'Score',     data: radarScores },
            { name: 'Threshold', data: radarThresholds }
        ],
        // ApexCharts radar picks up axis categories, not a top-level `labels` prop
        xaxis: {
            categories: radarLabels,
            labels: {
                show: true,
                style: { fontSize: '11px', colors: ['#5f6368'] },
                formatter: function (val) {
                    var s = String(val || '');
                    return s.length > 18 ? s.slice(0, 18) + '…' : s;
                }
            }
        },
        yaxis: { show: true, min: 0, max: 100, tickAmount: 4, labels: { formatter: function (v) { return v + ''; } } },
        colors: ['#1a73e8', '#d93025'],
        stroke: { width: [2, 2], dashArray: [0, 4] },
        fill: { opacity: [0.25, 0] },
        markers: { size: 4, hover: { size: 6 } },
        plotOptions: {
            radar: {
                size: 170,
                polygons: {
                    strokeColors: '#e0e0e0',
                    connectorColors: '#e0e0e0',
                    fill: { colors: ['transparent', '#f8f9fa'] }
                }
            }
        },
        tooltip: { y: { formatter: function (v) { return v + '%'; } } },
        legend: { position: 'bottom', markers: { width: 10, height: 10 } }
    };
    try {
        trDetailState.radarChart = new ApexCharts(document.querySelector('#trdRadarChart'), radarOptions);
        trDetailState.radarChart.render();
    } catch (e) { /* noop */ }
}

function renderTeacherRatingDetail() {
    var d = trDetailState.detail || {};
    var period = d.selectedPeriod || trDetailState.selectedPeriod || {};
    var summary = d.summary || {};
    var groups = d.groups || [];

    var profile = d.profile || {};
    $('#trdAvatarWrap').html(trAvatarHtml(profile.photo, profile.userFullName, 56));
    $('#trdName').text(profile.userFullName || '—');
    var metaParts = [];
    if (profile.employmentType) metaParts.push('<span><i class="fa fa-briefcase mr-1 text-muted"></i>Type: <span class="badge badge-info">' + profile.employmentType + '</span></span>');
    if (profile.country) metaParts.push('<span><i class="fa fa-globe mr-1 text-muted"></i>Country: <strong>' + profile.country + '</strong></span>');
    if (profile.timezone) metaParts.push('<span><i class="fa fa-clock-o mr-1 text-muted"></i>Timezone: <strong>' + profile.timezone + '</strong></span>');
    if (profile.workingHoursLabel || profile.workingHours != null) metaParts.push('<span><i class="fa fa-clock-o mr-1 text-muted"></i>Working Hours: <strong>' + (profile.workingHoursLabel || (profile.workingHours + ' hrs / mo')) + '</strong></span>');
    if (profile.salaryLabel || profile.salary != null) metaParts.push('<span><i class="fa fa-money mr-1 text-muted"></i>Salary: <strong>' + (profile.salaryLabel || ('$' + profile.salary + ' / mo')) + '</strong></span>');
    $('#trdMeta').html(metaParts.join(''));

    var overall = summary.overallScore != null ? summary.overallScore : 0;
    var totalParams = summary.respondedParameterCount != null
        ? summary.respondedParameterCount
        : (d.parameterBreakdown || []).filter(function (p) { return p && p.score != null; }).length;
    var overallColor = trScoreColor(summary.overallScore, summary.minOverallThreshold || 0);
    var CARD_STYLE = 'flex:1 1 0;min-width:180px';
    var statHtml = '';

    statHtml += '<div class="main-card card" style="' + CARD_STYLE + '"><div class="card-body py-2">' +
                    '<div class="small text-muted text-uppercase font-weight-bold" style="letter-spacing:.4px">Overall Score</div>' +
                    '<div class="h4 mb-0 mt-1" style="color:' + overallColor + '">' + (summary.overallScore != null ? summary.overallScore + '%' : '—') + '</div>' +
                    '<div class="small text-muted">Min: ' + (summary.minOverallThreshold != null ? summary.minOverallThreshold + '%' : '—') + '</div>' +
                '</div></div>';
    if (summary.overallRating != null) {
        statHtml += '<div class="main-card card" style="' + CARD_STYLE + '"><div class="card-body py-2">' +
                        '<div class="small text-muted text-uppercase font-weight-bold" style="letter-spacing:.4px">Overall Rating</div>' +
                        '<div class="h4 mb-0 mt-1">' + Number(summary.overallRating).toFixed(1) + '<span class="small text-muted"> / 5</span></div>' +
                        '<div style="font-size:13px;line-height:1;white-space:nowrap">' + trStarsHtml(summary.overallRating) + '</div>' +
                    '</div></div>';
    }
    groups.forEach(function (g, i) {
        var color = trGroupColor(i);
        statHtml += '<div class="main-card card" style="' + CARD_STYLE + '"><div class="card-body py-2">' +
                        '<div class="small text-muted text-uppercase font-weight-bold text-truncate" style="letter-spacing:.4px" title="' + (g.groupName || '') + '">' + (g.groupName || '') + '</div>' +
                        '<div class="h4 mb-0 mt-1" style="color:' + color + '">' + (g.score != null ? g.score + '%' : '—') + '</div>' +
                        '<div class="small text-muted">Weight: ' + (g.weight != null ? g.weight + '%' : '—') + '</div>' +
                    '</div></div>';
    });
    statHtml += '<div class="main-card card" style="' + CARD_STYLE + '"><div class="card-body py-2">' +
                    '<div class="small text-muted text-uppercase font-weight-bold" style="letter-spacing:.4px">Responses</div>' +
                    '<div class="h4 mb-0 mt-1">' + (summary.responses != null ? summary.responses : 0) + '</div>' +
                    '<a href="javascript:void(0)" class="small text-primary" onclick="openTeacherRatingResponsesModal()"><u>View responses</u></a>' +
                '</div></div>';
    statHtml += '<div class="main-card card" style="' + CARD_STYLE + '"><div class="card-body py-2">' +
                    '<div class="small text-muted text-uppercase font-weight-bold" style="letter-spacing:.4px">Below Threshold</div>' +
                    '<div class="h4 mb-0 mt-1">' + (summary.belowThresholdCount != null ? summary.belowThresholdCount : 0) + '</div>' +
                    '<div class="small text-muted">of ' + totalParams + ' params</div>' +
                '</div></div>';
    $('#trdStatRow').html(statHtml);

    var ringR = 48;
    var circumference = 2 * Math.PI * ringR;
    var dashOffset = circumference - (Math.max(0, Math.min(100, overall)) / 100) * circumference;
    $('#trdRingFill').attr('stroke-dasharray', circumference.toFixed(2)).attr('stroke-dashoffset', dashOffset.toFixed(2))
        .attr('stroke', overallColor);
    $('#trdRingValue').text((summary.overallScore != null ? summary.overallScore : '—') + (summary.overallScore != null ? '%' : '')).css('color', overallColor);

    var splitsHtml = '';
    groups.forEach(function (g, i) {
        var score = g.score != null ? g.score : 0;
        splitsHtml += '<div class="d-flex align-items-center mb-2" style="gap:10px">' +
                        '<div style="font-size:12px;color:#5f6368;flex:1;min-width:0" class="text-truncate">' + (g.groupName || '') + ' (' + (g.weight != null ? g.weight + '%' : '—') + ')</div>' +
                        '<div class="progress" style="flex:2;height:8px"><div class="progress-bar" style="width:' + Math.min(score, 100) + '%;background:' + trScoreColor(g.score, summary.minOverallThreshold != null ? summary.minOverallThreshold : 75) + ' !important"></div></div>' +
                        '<div style="font-weight:500;font-size:13px;width:50px;text-align:right">' + (g.score != null ? g.score + '%' : '—') + '</div>' +
                    '</div>';
    });
    $('#trdScoreSplits').html(splitsHtml);
    $('#trdThreshParam').text((summary.minParamThreshold != null ? summary.minParamThreshold + '%' : '—'));
    $('#trdThreshOverall').text((summary.minOverallThreshold != null ? summary.minOverallThreshold + '%' : '—'));

    var below = summary.belowThresholdCount || 0;
    var eligIcon = summary.eligible
        ? '<i class="fa fa-check-circle text-success" style="font-size:22px"></i>'
        : '<i class="fa fa-times-circle text-danger" style="font-size:22px"></i>';
    var eligTitle = summary.eligible
        ? '<span class="text-success">Eligible</span>'
        : '<span class="text-danger">Not Eligible</span>';
    var eligSub = (summary.minParamThreshold != null ? summary.minParamThreshold + '% per parameter' : '') +
                  ((summary.minParamThreshold != null && summary.minOverallThreshold != null) ? ' · ' : '') +
                  (summary.minOverallThreshold != null ? summary.minOverallThreshold + '% overall' : '');
    var eligDetail;
    if (summary.eligible) {
        eligDetail = '<div class="text-success mt-2">All parameters meet the threshold.</div>';
    } else {
        // list every parameter that fell below its threshold, like the mock:
        // "Parameter Name (Group Name)  ........  73%"
        var belowParams = (d.parameterBreakdown || []).filter(function (p) { return p.status === 'Below Threshold'; });
        var belowListHtml = '';
        belowParams.forEach(function (p) {
            belowListHtml += '<div class="d-flex align-items-center py-2" style="gap:12px;border-bottom:1px solid #fce8e6">' +
                                '<div style="flex:1;min-width:0" class="text-truncate">' +
                                    '<span class="font-weight-bold">' + (p.parameterName || '—') + '</span> ' +
                                    '<span class="text-muted">(' + (p.groupName || '') + ')</span>' +
                                '</div>' +
                                '<div class="font-weight-bold" style="color:' + trScoreColor(p.score, p.threshold != null ? p.threshold : (summary.minParamThreshold || 75)) + '">' + (p.scoreLabel || (p.score != null ? p.score + '%' : '—')) + '</div>' +
                            '</div>';
        });
        var overallBoxHtml = '';
        if (summary.overallScore != null && summary.minOverallThreshold != null && summary.overallScore < summary.minOverallThreshold) {
            overallBoxHtml = '<div class="mt-2 rounded px-3 py-2" style="background:#fef7e0;color:#b06000;font-weight:500">' +
                                'Overall ' + summary.overallScore + '% &lt; ' + summary.minOverallThreshold + '%' +
                             '</div>';
        }
        eligDetail = (belowListHtml ? '<div class="mt-2">' + belowListHtml + '</div>' : '') + overallBoxHtml;
        if (!eligDetail) {
            eligDetail = '<div class="text-danger mt-2">' + (summary.eligibilityReason || (below + ' parameter(s) below threshold.')) + '</div>';
        }
    }
    $('#trdEligibilityCard').html(
        '<div class="d-flex align-items-start" style="gap:12px">' +
            eligIcon +
            '<div style="flex:1;min-width:0">' +
                '<div class="font-weight-bold">' + eligTitle + '</div>' +
                '<div class="small text-muted">' + eligSub + '</div>' +
                eligDetail +
            '</div>' +
        '</div>'
    );

    var groupCardsHtml = '';
    groups.forEach(function (g, gi) {
        var groupColor = trGroupColor(gi);
        var subsHtml = '';
        (g.parameters || []).forEach(function (p) {
            var pScore = p.score != null ? p.score : 0;
            var threshold = p.threshold != null ? p.threshold : 0;
            var statusMeta = trDetailStatusMeta(p);
            var barColor = p.status === 'No Response' ? '#adb5bd' : trScoreColor(pScore, threshold);
            var barWidth = p.status === 'No Response' ? 0 : Math.min(pScore, 100);
            subsHtml += '<div class="d-flex align-items-center py-2 px-3 border-bottom" style="gap:12px">' +
                            '<div style="flex:1;min-width:0" class="text-truncate">' + (p.parameterName || '') + '</div>' +
                            '<div class="progress" style="flex:1;height:8px;max-width:200px"><div class="progress-bar" style="width:' + barWidth + '%;background:' + barColor + ' !important"></div></div>' +
                            '<div style="width:60px;text-align:right;font-weight:500;color:' + (p.status === 'No Response' ? '#adb5bd' : barColor) + '">' + (p.status === 'No Response' ? '—' : (pScore + '%')) + '</div>' +
                            '<div style="width:110px;text-align:center"><span class="badge ' + statusMeta.badgeClass + '" style="white-space:nowrap;' + (statusMeta.badgeStyle || '') + '">' + statusMeta.label + '</span></div>' +
                        '</div>';
        });
        groupCardsHtml += '<div class="main-card card mb-3">' +
                            '<div class="card-body p-0">' +
                                '<div class="d-flex align-items-center p-3 border-bottom" style="gap:16px">' +
                                    '<div style="min-width:120px">' +
                                        '<div style="color:' + groupColor + ';font-size:22px;font-weight:500">' + (g.score != null ? g.score + '%' : '—') + '</div>' +
                                        '<div class="small text-muted">' + (g.groupName || '') + '</div>' +
                                        '<div class="small text-muted">Weight: ' + (g.weight != null ? g.weight + '%' : '—') + '</div>' +
                                    '</div>' +
                                    '<div class="font-weight-bold">Sub-criteria Ratings</div>' +
                                '</div>' +
                                subsHtml +
                            '</div>' +
                        '</div>';
    });
    $('#trdGroupCards').html(groupCardsHtml);
    renderTeacherRatingDetailParamTable(d.parameterBreakdown || []);
    renderTeacherRatingDetailCharts(d);
}

function renderTeacherRatingDetailParamTable(rows) {
    if ($.fn.DataTable.isDataTable('#trdParamTable')) {
        $('#trdParamTable').DataTable().clear().destroy();
    }
    var html = '';
    if (!rows.length) {
        html = '<tr><td colspan="8" class="text-center text-muted py-3">No parameters</td></tr>';
    } else {
        rows.forEach(function (p, i) {
            var statusMeta = trDetailStatusMeta(p);
            var scoreText = p.status === 'No Response' ? '—' : (p.score != null ? p.score + '%' : '—');
            var scoreWidth = p.status === 'No Response' ? 0 : Math.min(p.score || 0, 100);
            var scoreColor = p.status === 'No Response' ? statusMeta.color : trScoreColor(p.score, p.threshold != null ? p.threshold : 75);
            html += '<tr>' +
                        '<td>' + (i + 1) + '</td>' +
                        '<td class="font-weight-bold">' + (p.parameterName || '—') + '</td>' +
                        '<td><span class="badge badge-light border">' + (p.groupName || '—') + '</span></td>' +
                        '<td><span class="badge badge-info">' + (p.evaluatedBy || '—') + '</span></td>' +
                        '<td><strong class="text-primary">' + (p.weightInGroup != null ? p.weightInGroup + '%' : '—') + '</strong></td>' +
                        '<td><div class="d-flex align-items-center" style="gap:8px">' +
                            '<strong style="color:' + scoreColor + ';min-width:42px">' + scoreText + '</strong>' +
                            '<div class="progress flex-grow-1" style="height:6px;min-width:60px"><div class="progress-bar" style="width:' + scoreWidth + '%;background:' + scoreColor + ' !important"></div></div>' +
                        '</div></td>' +
                        '<td><span style="color:' + scoreColor + ';font-weight:500">' + (p.vsThreshold || '—') + '</span></td>' +
                        '<td><span class="badge ' + statusMeta.badgeClass + '" style="white-space:nowrap;' + (statusMeta.badgeStyle || '') + '">' + statusMeta.label + '</span></td>' +
                    '</tr>';
        });
    }
    $('#trdParamTbody').html(html);
    if (rows.length) {
        $('#trdParamTable').DataTable({ destroy: true, ordering: false, searching: false, paging: false, info: false, autoWidth: false });
    }
}
