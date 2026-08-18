/* ============================================================================
   Student Feedback (Received) — logged-in teacher's own student feedback
     - SUMMARY → POST teacher-evaluation/rating/student-feedback
                 (profile, periods, summary + ratingDistribution, first page)
     - LIST    → POST teacher-evaluation/rating/student-feedback/list
                 (date-filtered + paginated feedback responses; Load more)
     - DETAIL  → POST teacher-evaluation/rating/student-feedback/detail
                 (per-question ratings + comments for one response; modal)
   Feedback is anonymous: the list shows only the overall rating + submitted
   DATE; the modal reveals each question's rating and comment.
   ========================================================================== */

var sfrState = {
    userId:         null,
    periods:        [],
    selectedPeriod: null,
    summary:        {},
    limit:          6,
    nextOffset:     0,
    hasMore:        false,
    totalCount:     0,
    loadedCount:    0,
    loading:        false,
    activeRange:    'all'
};

// ─── On load ────────────────────────────────────────────────────────────────

function studentFeedbackReceivedOnLoad() {
    sfrState.userId = (typeof USER_ID !== 'undefined') ? USER_ID : null;
    sfrState.activeRange = 'all';
    initStudentFeedbackFilters();
    loadStudentFeedbackSummary(true);
}

function initStudentFeedbackFilters() {
    $('#sfrPeriodId, #sfrRange').select2({
        theme: 'bootstrap4',
        minimumResultsForSearch: Infinity,
        width: '100%'
    });

    initStudentFeedbackDatepickers();

    // Period switch → reset date range to full period, reload everything
    $('#sfrPeriodId').on('change', function () {
        var pid = parseInt($(this).val()) || null;
        if (pid && (!sfrState.selectedPeriod || sfrState.selectedPeriod.id != pid)) {
            sfrState.selectedPeriod = (sfrState.periods || []).find(function (p) { return p.id == pid; }) || sfrState.selectedPeriod;
            resetStudentFeedbackDateRange();
            loadStudentFeedbackSummary(false);
        }
    });

    // Date-range switch → reload overview + comments for that range
    $('#sfrRange').on('change', function () {
        sfrState.activeRange = $(this).val() || 'all';
        var isCustom = sfrState.activeRange === 'custom';
        $('#sfrCustomRange').toggleClass('d-none', !isCustom).toggleClass('d-flex', isCustom);
        if (!isCustom) loadStudentFeedbackSummary(false);
    });
}

// ─── Custom-range datepickers (display "Jul 28, 2026", value read as yyyy-mm-dd)

function initStudentFeedbackDatepickers() {
    var $s = $('#sfrStartDate'), $e = $('#sfrEndDate');
    if (!$s.length || typeof $s.datepicker !== 'function') return;

    $s.datepicker('destroy');
    $e.datepicker('destroy');

    var options = { format: 'M dd, yyyy', autoclose: true, todayHighlight: true, orientation: 'bottom auto' };
    $s.datepicker(options);
    $e.datepicker(options);

    // Picking "From" always clears "To" and forces it to be >= "From"
    $s.off('changeDate.sfr').on('changeDate.sfr', function (ev) {
        var start = ev.date || $s.datepicker('getDate');
        $e.datepicker('clearDates');
        $e.datepicker('setStartDate', start || null);
        sfrRefreshField($s);
        sfrRefreshField($e);
    });
    $e.off('changeDate.sfr').on('changeDate.sfr', function () { sfrRefreshField($e); });

    applyStudentFeedbackPickerBounds();
}

// keep both pickers within the selected evaluation period
function applyStudentFeedbackPickerBounds() {
    var p = sfrState.selectedPeriod;
    var $s = $('#sfrStartDate'), $e = $('#sfrEndDate');
    if (!p || !$s.length || typeof $s.datepicker !== 'function') return;

    var start = sfrParseYmd(p.startDate);
    var end   = sfrParseYmd(p.endDate);
    $s.datepicker('setStartDate', start || null).datepicker('setEndDate', end || null);
    var curStart = $s.datepicker('getDate');
    $e.datepicker('setStartDate', curStart || start || null).datepicker('setEndDate', end || null);
}

// re-sync the floating-label "filled" state after a programmatic value change
function sfrRefreshField($el) {
    if (typeof refreshCustomFieldState === 'function') {
        refreshCustomFieldState($el.closest('.custom-field'));
    }
}

// ─── Star / colour helpers (0–2.5 red · 2.6–3.74 yellow · 3.75–5 green) ──────

function sfrStarColor(rating) {
    var r = Number(rating) || 0;
    if (r < 2.6) return '#d93025';
    if (r < 3.75) return '#fbbc04';
    return '#1e8a3c';
}

// distribution band colours — strong (green) · average (amber) · needs (red)
function sfrBandColor(key) {
    if (key === 'strong') return '#1e8a3c';
    if (key === 'average') return '#fbbc04';
    return '#d93025';
}

// fractional fill — 4.8 renders as 4 full stars + one 80%-filled star:
// a grey 5-star row with a colour row clipped to (rating/5)% on top
function sfrStarsHtml(rating, fontSize) {
    var r = Math.max(0, Math.min(5, Number(rating) || 0));
    var color = sfrStarColor(r);
    var pct = (r / 5) * 100;
    var size = fontSize || 15;
    var greyRow = '', colorRow = '';
    for (var i = 0; i < 5; i++) {
        greyRow  += '<i class="fa fa-star" style="color:#e0e0e0"></i>';
        colorRow += '<i class="fa fa-star" style="color:' + color + '"></i>';
    }
    return '<span style="position:relative;display:inline-block;line-height:1;font-size:' + size + 'px;vertical-align:middle">' +
               '<span style="white-space:nowrap">' + greyRow + '</span>' +
               '<span style="position:absolute;top:0;left:0;width:' + pct + '%;overflow:hidden;white-space:nowrap">' + colorRow + '</span>' +
           '</span>';
}

// ─── Date helpers ────────────────────────────────────────────────────────────

function sfrParseYmd(ymd) {
    if (!ymd) return null;
    var p = String(ymd).split('-');
    if (p.length < 3) return null;
    return new Date(parseInt(p[0], 10), parseInt(p[1], 10) - 1, parseInt(p[2], 10));
}

// yyyy-mm-dd → "Jul 14, 2026" via the shared changeDateFormat util
function sfrFmtDate(ymd) {
    var d = sfrParseYmd(ymd);
    return d ? changeDateFormat(d, 'MMM DD, YYYY') : '—';
}

function sfrIsoDate(d) {
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + m + '-' + day;
}

// Resolve the active date-range dropdown to {startDate, endDate} for the list API
function resolveStudentFeedbackDateRange() {
    var period = sfrState.selectedPeriod || {};
    var full = { startDate: period.startDate || null, endDate: period.endDate || null };
    var today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (sfrState.activeRange) {
        case 'today':
            return { startDate: sfrIsoDate(today), endDate: sfrIsoDate(today) };
        case 'yesterday':
            var y = new Date(today);
            y.setDate(y.getDate() - 1);
            return { startDate: sfrIsoDate(y), endDate: sfrIsoDate(y) };
        case 'month':
            var first = new Date(today.getFullYear(), today.getMonth(), 1);
            var last = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            return { startDate: sfrIsoDate(first), endDate: sfrIsoDate(last) };
        case 'custom':
            var cs = $('#sfrStartDate').datepicker('getDate');
            var ce = $('#sfrEndDate').datepicker('getDate');
            return {
                startDate: cs ? sfrIsoDate(cs) : full.startDate,
                endDate:   ce ? sfrIsoDate(ce) : full.endDate
            };
        default:
            return full;
    }
}

function applyStudentFeedbackDateRange() {
    loadStudentFeedbackSummary(false);
}

function sfrEscape(s) {
    return String(s == null ? '' : s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function sfrIsSuccess(response) {
    return response && (response.status === '1' || response.statusCode === 'SUCCESS');
}

// ─── API: summary (profile + overview + first page) ──────────────────────────

async function loadStudentFeedbackSummary(isInitial) {
    var period = sfrState.selectedPeriod;
    var range = resolveStudentFeedbackDateRange();
    var payload = {
        userId:    sfrState.userId,
        periodId:  period ? period.id : null,
        startDate: range.startDate,
        endDate:   range.endDate
    };
    try {
        var response = await callCommonAjax({
            method: 'POST',
            url: APP_BASE_URL + API_VERSION + 'teacher-evaluation/rating/student-feedback',
            body: payload,
            global: true,
            showMessage: false
        });
        if (sfrIsSuccess(response) && response.details) {
            var d = response.details;
            sfrState.periods        = d.periods || [];
            sfrState.selectedPeriod = d.selectedPeriod || sfrState.selectedPeriod;
            sfrState.summary        = d.summary || {};

            renderStudentFeedbackProfile(d.profile || {});

            // period dropdown only needs (re)building on the first load
            if (isInitial) {
                populateStudentFeedbackPeriodSelect(sfrState.periods, sfrState.selectedPeriod ? sfrState.selectedPeriod.id : null);
            }

            renderStudentFeedbackOverview(sfrState.summary);

            // keep the custom-range pickers limited to the selected period
            applyStudentFeedbackPickerBounds();

            // the summary call already returns the first page for the active range
            var pg = d.pagination || {};
            sfrState.totalCount  = pg.totalCount != null ? pg.totalCount : (d.feedbackEntries || []).length;
            sfrState.loadedCount = (d.feedbackEntries || []).length;
            sfrState.nextOffset  = pg.nextOffset != null ? pg.nextOffset : sfrState.loadedCount;
            sfrState.hasMore     = !!pg.hasMore;

            renderStudentFeedbackCards(d.feedbackEntries || [], false);
            updateStudentFeedbackFooter();
        } else {
            showMessageTheme2(0, (response && response.message) ? response.message : 'Failed to load student feedback.');
        }
    } catch (e) {
        showMessageTheme2(0, 'Failed to load student feedback.');
    }
}

function populateStudentFeedbackPeriodSelect(periods, selectedId) {
    var $el = $('#sfrPeriodId');
    if ($el.hasClass('select2-hidden-accessible')) $el.select2('destroy');
    var html = '';
    (periods || []).forEach(function (p) {
        html += '<option value="' + p.id + '">' + (p.periodLabel || ('Period #' + p.id)) + '</option>';
    });
    if (!html) html = '<option value="">No periods</option>';
    $el.html(html);
    if (selectedId != null) $el.val(String(selectedId));
    $el.select2({ theme: 'bootstrap4', minimumResultsForSearch: Infinity, width: '100%' });
    if (typeof refreshCustomFieldState === 'function') {
        refreshCustomFieldState($el.closest('.custom-field'));
    }
}

// ─── Profile header ──────────────────────────────────────────────────────────

function renderStudentFeedbackProfile(profile) {
    var fullName = profile.userFullName || ((typeof USER_FULL_NAME !== 'undefined' && USER_FULL_NAME) ? USER_FULL_NAME : '');
    $('#sfrTeacherName').text(fullName || '—');

    var meta = [];
    if (profile.employmentType) meta.push('<span><i class="fa fa-briefcase mr-1 text-muted"></i>' + sfrEscape(profile.employmentType) + '</span>');
    if (profile.country)        meta.push('<span><i class="fa fa-globe mr-1 text-muted"></i>' + sfrEscape(profile.country) + '</span>');
    if (profile.timezone)       meta.push('<span><i class="fa fa-clock-o mr-1 text-muted"></i>' + sfrEscape(profile.timezone) + '</span>');
    $('#sfrTeacherMeta').html(meta.length ? meta.join('') : '<span class="text-muted">Teacher</span>');

    if (profile.photo) {
        var src = /^https?:\/\//i.test(profile.photo)
            ? profile.photo
            : ((typeof CONTEXT_PATH !== 'undefined' && CONTEXT_PATH) ? CONTEXT_PATH + profile.photo : profile.photo);
        $('#sfrAvatar').html('<img src="' + sfrEscape(src) + '" alt="" style="width:100%;height:100%;object-fit:cover">');
    } else {
        var initials = fullName.split(' ').filter(Boolean).slice(0, 2).map(function (w) { return w[0].toUpperCase(); }).join('');
        $('#sfrAvatar').text(initials || 'T');
    }
}

// ─── Overview: average rating card + rating distribution donut ────────────────

function renderStudentFeedbackOverview(summary) {
    var avg = summary.averageRating != null ? Number(summary.averageRating) : 0;
    var total = summary.responseCount != null ? summary.responseCount : 0;
    var dist = summary.ratingDistribution || [];

    var slices = dist.map(function (b) {
        return {
            key:   b.key,
            label: b.label,
            count: b.count || 0,
            pct:   b.percentage != null ? Math.round(b.percentage) : 0,
            color: sfrBandColor(b.key)
        };
    });

    var legend = slices.map(function (s) {
        return '' +
        '<div class="mb-2">' +
            '<div class="d-flex align-items-center mb-1" style="gap:8px;font-size:12.5px">' +
                '<span style="width:10px;height:10px;border-radius:3px;background:' + s.color + ';flex-shrink:0"></span>' +
                '<span style="flex:1;font-weight:600;color:#5f6368">' + sfrEscape(s.label) + '</span>' +
                '<span style="font-weight:700;color:#1a1a2e">' + s.count +
                    ' <span style="color:#98a2b3;font-weight:600;font-size:11.5px">(' + s.pct + '%)</span></span>' +
            '</div>' +
            '<div style="height:6px;border-radius:4px;background:#f0f2f5;overflow:hidden">' +
                '<div style="height:100%;border-radius:4px;width:' + s.pct + '%;background:' + s.color + '"></div>' +
            '</div>' +
        '</div>';
    }).join('');

    var avgLabel = summary.averageRatingLabel || (avg.toFixed(1) + '/5');

    var avgCard =
        '<div class="col-lg-4 col-md-5 mb-3 d-flex">' +
            '<div class="card w-100" style="border:1px solid #e8eaed;border-top:3px solid var(--pc,#007fff)">' +
                '<div class="card-body">' +
                    '<div class="text-uppercase font-weight-bold mb-2" style="font-size:11px;letter-spacing:.4px;color:#5f6368">Average rating</div>' +
                    '<div style="font-size:34px;font-weight:700;color:#1a1a2e;line-height:1">' + avg.toFixed(1) +
                        '<span style="font-size:15px;color:#5f6368;font-weight:700"> / 5</span></div>' +
                    '<div class="mt-2">' + sfrStarsHtml(avg, 16) + '</div>' +
                '</div>' +
            '</div>' +
        '</div>';

    var distCard =
        '<div class="col-lg-8 col-md-7 mb-3 d-flex">' +
            '<div class="card w-100" style="border:1px solid #e8eaed;border-top:3px solid var(--pc,#007fff)">' +
                '<div class="card-body">' +
                    '<div class="text-uppercase font-weight-bold mb-2" style="font-size:11px;letter-spacing:.4px;color:#5f6368">Rating distribution</div>' +
                    '<div class="d-flex align-items-center flex-wrap" style="gap:24px">' +
                        sfrDonutSvg(slices, total) +
                        '<div style="flex:1;min-width:220px">' + (legend || '<span class="text-muted small">No responses yet.</span>') + '</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>';

    $('#sfrOverview').html(avgCard + distCard);
}

// donut: one rounded arc per non-empty band, sized by share of the total
function sfrDonutSvg(slices, total) {
    var size = 150, cx = size / 2, cy = size / 2, r = 58, strokeW = 18;
    var circumference = 2 * Math.PI * r;
    var active = slices.filter(function (s) { return s.count > 0; });
    var gap = active.length > 1 ? 3 : 0;
    var offset = 0;
    var segs = '';

    if (!total || !active.length) {
        segs = '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="#e8eaed" stroke-width="' + strokeW + '"/>';
    } else {
        active.forEach(function (s) {
            var rawLen = (s.count / total) * circumference;
            var len = Math.max(rawLen - gap, 0);
            var dash = len + ' ' + (circumference - len);
            segs += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="' + s.color + '" stroke-width="' + strokeW +
                    '" stroke-linecap="round" stroke-dasharray="' + dash + '" stroke-dashoffset="' + (-offset) +
                    '" transform="rotate(-90 ' + cx + ' ' + cy + ')"/>';
            offset += rawLen;
        });
    }

    return '' +
    '<div style="position:relative;flex-shrink:0;width:' + size + 'px;height:' + size + 'px">' +
        '<svg width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + ' ' + size + '">' + segs + '</svg>' +
        '<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;pointer-events:none">' +
            '<div style="font-size:24px;font-weight:700;color:#1a1a2e;line-height:1">' + total + '</div>' +
            '<div style="font-size:10px;font-weight:700;color:#98a2b3;text-transform:uppercase;letter-spacing:.4px;margin-top:2px">Total</div>' +
        '</div>' +
    '</div>';
}

// ─── API: filtered / paginated list ─────────────────────────────────────────

function loadMoreStudentFeedback() {
    loadStudentFeedbackList(false);
}

async function loadStudentFeedbackList(reset) {
    if (sfrState.loading) return;
    sfrState.loading = true;

    if (reset) sfrState.nextOffset = 0;

    var period = sfrState.selectedPeriod;
    var range = resolveStudentFeedbackDateRange();

    var payload = {
        userId:    sfrState.userId,
        periodId:  period ? period.id : null,
        startDate: range.startDate,
        endDate:   range.endDate,
        offset:    reset ? 0 : sfrState.nextOffset,
        limit:     sfrState.limit
    };

    var $btn = $('#sfrLoadMoreBtn');
    if (!reset) $btn.prop('disabled', true).html('<i class="fa fa-spinner fa-spin mr-1"></i>Loading…');

    customLoader(true);

    try {
        var response = await callCommonAjax({
            method: 'POST',
            url: APP_BASE_URL + API_VERSION + 'teacher-evaluation/rating/student-feedback/list',
            body: payload,
            global: false,
            showMessage: false
        });
        if (sfrIsSuccess(response) && response.details) {
            var d = response.details;
            var entries = d.feedbackEntries || [];
            var pg = d.pagination || {};

            renderStudentFeedbackCards(entries, !reset);

            sfrState.totalCount  = pg.totalCount != null ? pg.totalCount : entries.length;
            sfrState.loadedCount = reset ? entries.length : (sfrState.loadedCount + entries.length);
            sfrState.nextOffset  = pg.nextOffset != null ? pg.nextOffset : (payload.offset + entries.length);
            sfrState.hasMore     = !!pg.hasMore;

            updateStudentFeedbackFooter();
        } else {
            showMessageTheme2(0, (response && response.message) ? response.message : 'Failed to load feedback.');
        }
    } catch (e) {
        showMessageTheme2(0, 'Failed to load feedback.');
    } finally {
        sfrState.loading = false;
        $btn.prop('disabled', false).text('Load more');
        customLoader(false);
    }
}

// ─── Renderers: feedback response cards + footer ─────────────────────────────

function studentFeedbackCardHtml(f) {
    var rating = Number(f.overallRating) || 0;
    var score = f.overallRatingLabel || (rating.toFixed(1) + '/5');
    var color = sfrStarColor(rating);

    return '' +
    '<div class="col-lg-6 mb-3 d-flex">' +
        '<div class="card w-100 sfr-card" style="border:1px solid #e8eaed;cursor:pointer" onclick="openStudentFeedbackDetail(' + f.feedbackResponseId + ')">' +
            '<div class="card-body p-3 d-flex align-items-center justify-content-between" style="gap:12px">' +
                '<div>' +
                    '<div class="font-weight-bold" style="font-size:13px;color:#1a1a2e">' +
                        '<i class="fa fa-calendar-o text-muted mr-1"></i>' + sfrFmtDate(f.submittedDate) +
                    '</div>' +
                    '<div class="mt-1" style="font-size:12px;font-weight:700;color:var(--pc,#007fff)">' +
                        'View feedback details <i class="fa fa-arrow-right" style="font-size:10px"></i>' +
                    '</div>' +
                '</div>' +
                '<div class="d-inline-flex align-items-center flex-shrink-0" style="gap:8px;background:#f4f6fb;border:1px solid #e8eaed;border-radius:20px;padding:6px 12px">' +
                    sfrStarsHtml(rating, 14) +
                    '<span style="font-size:13px;font-weight:700;color:' + color + '">' + sfrEscape(score) + '</span>' +
                '</div>' +
            '</div>' +
        '</div>' +
    '</div>';
}

function renderStudentFeedbackCards(entries, append) {
    var $grid = $('#sfrGrid');
    if (!append) {
        if (!entries || !entries.length) {
            $grid.html('<div class="col-12 text-center text-muted py-5"><i class="fa fa-comments-o fa-2x mb-2 d-block"></i>No feedback in this period.</div>');
            return;
        }
        $grid.html(entries.map(studentFeedbackCardHtml).join(''));
    } else {
        $grid.append(entries.map(studentFeedbackCardHtml).join(''));
    }
}

function updateStudentFeedbackFooter() {
    if (sfrState.totalCount > 0) {
        $('#sfrResultCount').html('Showing <strong>' + sfrState.loadedCount + '</strong> of <strong>' + sfrState.totalCount + '</strong> feedback responses');
    } else {
        $('#sfrResultCount').text('');
    }
    $('#sfrLoadMoreWrap').toggle(!!sfrState.hasMore);
}

// ─── API: single response detail (modal) ─────────────────────────────────────

async function openStudentFeedbackDetail(feedbackResponseId) {
    if (!feedbackResponseId) return;
    var period = sfrState.selectedPeriod;
    var payload = {
        userId:             sfrState.userId,
        periodId:           period ? period.id : null,
        feedbackResponseId: feedbackResponseId
    };

    $('#sfrDetailStars').html('');
    $('#sfrDetailScore').text('');
    $('#sfrDetailItems').html('<div class="text-center text-muted py-4"><i class="fa fa-spinner fa-spin fa-2x"></i></div>');
    $('#sfrDetailModal').modal('show');

    try {
        var response = await callCommonAjax({
            method: 'POST',
            url: APP_BASE_URL + API_VERSION + 'teacher-evaluation/rating/student-feedback/detail',
            body: payload,
            global: false,
            showMessage: false
        });
        if (sfrIsSuccess(response) && response.details) {
            renderStudentFeedbackDetail(response.details);
        } else {
            $('#sfrDetailItems').html('<div class="text-center text-danger py-4">' +
                sfrEscape((response && response.message) ? response.message : 'Failed to load feedback details.') + '</div>');
        }
    } catch (e) {
        $('#sfrDetailItems').html('<div class="text-center text-danger py-4">Failed to load feedback details.</div>');
    }
}

function renderStudentFeedbackDetail(detail) {
    var rating = Number(detail.overallRating) || 0;
    var score = detail.overallRatingLabel || (rating.toFixed(1) + '/5');
    $('#sfrDetailStars').html(sfrStarsHtml(rating, 16));
    $('#sfrDetailScore').css('color', sfrStarColor(rating)).text(score);

    var items = detail.items || [];
    if (!items.length) {
        $('#sfrDetailItems').html('<div class="text-center text-muted py-4">No questions in this response.</div>');
        return;
    }

    $('#sfrDetailItems').html(items.map(function (it, idx) {
        var r = Number(it.ratingValue) || 0;
        var lbl = it.ratingLabel || (r.toFixed(1) + '/5');
        var seq = it.sequenceNo != null ? it.sequenceNo : (idx + 1);
        var hasComment = it.comment && String(it.comment).trim();
        var comment = hasComment
            ? '<div style="font-size:13px;color:#3c4043;line-height:1.55;background:#f4f6fb;border:1px solid #e8eaed;border-radius:8px;padding:9px 12px">' + sfrEscape(it.comment) + '</div>'
            : '';

        return '' +
        '<div style="border:1px solid #e8eaed;border-radius:10px;padding:12px 14px;margin-bottom:10px">' +
            '<div class="font-weight-bold' + (hasComment ? ' mb-2' : '') + '" style="font-size:13.5px;color:#1a1a2e">' + seq + '. ' + sfrEscape(it.questionText || '') + '</div>' +
            '<div class="d-flex align-items-center' + (hasComment ? ' mb-2' : '') + '" style="gap:8px">' +
                sfrStarsHtml(r, 14) +
                '<span style="font-size:12.5px;font-weight:700;color:' + sfrStarColor(r) + '">' + sfrEscape(lbl) + '</span>' +
            '</div>' +
            comment +
        '</div>';
    }).join(''));
}

// ─── Reset ───────────────────────────────────────────────────────────────────

function resetStudentFeedbackDateRange() {
    sfrState.activeRange = 'all';
    var $s = $('#sfrStartDate'), $e = $('#sfrEndDate');
    if ($s.length && typeof $s.datepicker === 'function') {
        $s.datepicker('clearDates');
        $e.datepicker('clearDates');
    } else {
        $s.val(''); $e.val('');
    }
    sfrRefreshField($s);
    sfrRefreshField($e);
    $('#sfrCustomRange').removeClass('d-flex').addClass('d-none');
    $('#sfrRange').val('all');
    if ($('#sfrRange').hasClass('select2-hidden-accessible')) $('#sfrRange').trigger('change.select2');
}
