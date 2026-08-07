/* ============================================================================
   Student Feedback (Received) — logged-in teacher's own student feedback
     - SUMMARY → POST teacher-evaluation/rating/student-feedback
                 (profile, periods, summary, parameter/question options + first page)
     - LIST    → POST teacher-evaluation/rating/student-feedback/list
                 (filtered + paginated feedback entries, drives Search & Load more)
   Feedback is anonymous: only rating, question, comment and submitted DATE are shown.
   ========================================================================== */

var sfrState = {
    userId:         null,
    role:           'Teacher',
    periods:        [],
    selectedPeriod: null,
    summary:        {},
    parameters:     [],
    questions:      [],
    limit:          6,
    nextOffset:     0,
    hasMore:        false,
    totalCount:     0,
    loadedCount:    0,
    loading:        false
};

// ─── On load ────────────────────────────────────────────────────────────────

function studentFeedbackReceivedOnLoad() {
    sfrState.userId = (typeof USER_ID !== 'undefined') ? USER_ID : null;
    initStudentFeedbackFilters();
    loadStudentFeedbackSummary(true);
}

function initStudentFeedbackFilters() {
    $('#sfrPeriodId, #sfrParam, #sfrQuestion, #sfrRating, #sfrSort').select2({
        theme: 'bootstrap4',
        minimumResultsForSearch: Infinity,
        width: '100%'
    });

    // Period switch → reload the whole summary for that period
    $('#sfrPeriodId').on('change', function () {
        var pid = parseInt($(this).val()) || null;
        if (pid && (!sfrState.selectedPeriod || sfrState.selectedPeriod.id != pid)) {
            sfrState.selectedPeriod = (sfrState.periods || []).find(function (p) { return p.id == pid; }) || sfrState.selectedPeriod;
            loadStudentFeedbackSummary(false);
        }
    });

    // Parameter change only rebuilds the (dependent) question dropdown — it does
    // NOT re-filter. Filters apply only when Search is clicked / Enter is pressed.
    $('#sfrParam').on('change', function () {
        populateStudentFeedbackQuestionDropdown();
    });

    $('#sfrSearch').on('keypress', function (e) {
        if (e.which === 13) applyStudentFeedbackFilter();
    });
}

// ─── Star / colour helpers (0–2.5 red · 2.6–3.74 yellow · 3.75–5 green) ──────
// Same tiers as trStarColor / tmrStarColor used across the evaluation module.

function sfrStarColor(rating) {
    var r = Number(rating) || 0;
    if (r < 2.6) return '#d93025';
    if (r < 3.75) return '#fbbc04';
    return '#1e8a3c';
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
    return '<span style="position:relative;display:inline-block;line-height:1;font-size:' + size + 'px;letter-spacing:2px;vertical-align:middle">' +
               '<span style="white-space:nowrap">' + greyRow + '</span>' +
               '<span style="position:absolute;top:0;left:0;width:' + pct + '%;overflow:hidden;white-space:nowrap">' + colorRow + '</span>' +
           '</span>';
}

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

function sfrEscape(s) {
    return String(s == null ? '' : s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function sfrIsSuccess(response) {
    return response && (response.status === '1' || response.statusCode === 'SUCCESS');
}

// ─── API: summary (profile + options + first page) ──────────────────────────

async function loadStudentFeedbackSummary(isInitial) {
    var period = sfrState.selectedPeriod;
    var payload = {
        userId:          sfrState.userId,
        periodId:        period ? period.id : null,
        roleUnderReview: sfrState.role,
        startDate:       period ? period.startDate : null,
        endDate:         period ? period.endDate : null
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
            sfrState.parameters     = d.parameters || [];
            sfrState.questions      = d.questions || [];

            renderStudentFeedbackProfile(d.profile || {});

            // period dropdown only needs (re)building on the first load
            if (isInitial) {
                populateStudentFeedbackPeriodSelect(sfrState.periods, sfrState.selectedPeriod ? sfrState.selectedPeriod.id : null);
            }

            renderStudentFeedbackMini(sfrState.summary);

            // fresh summary → filters back to defaults, rebuild option lists
            resetStudentFeedbackFilterFields();
            populateStudentFeedbackParamDropdown();
            populateStudentFeedbackQuestionDropdown();

            // the summary call already returns the first (unfiltered) page
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

// ─── Profile header + slim summary ──────────────────────────────────────────

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

function renderStudentFeedbackMini(summary) {
    var avg = summary.averageRating != null ? Number(summary.averageRating) : 0;
    $('#sfrMiniAvg').text(avg.toFixed(1));
    $('#sfrMiniStars').html(sfrStarsHtml(avg));
    $('#sfrMiniCount').text(summary.responseCount != null ? summary.responseCount : 0);
    $('#sfrMiniPos').text((summary.positivePercentage != null ? Math.round(summary.positivePercentage) : 0) + '%');
}

// ─── Filter dropdown population ──────────────────────────────────────────────

function populateStudentFeedbackParamDropdown() {
    var $el = $('#sfrParam');
    if ($el.hasClass('select2-hidden-accessible')) $el.select2('destroy');

    var total = 0;
    (sfrState.parameters || []).forEach(function (p) { total += (p.count || 0); });
    if (!total && sfrState.summary && sfrState.summary.responseCount != null) total = sfrState.summary.responseCount;

    var html = '<option value="all">All parameters</option>';
    (sfrState.parameters || []).forEach(function (p) {
        html += '<option value="' + p.parameterId + '">' + sfrEscape(p.parameterName) + ' (' + (p.count || 0) + ')</option>';
    });
    $el.html(html).val('all');
    $el.select2({ theme: 'bootstrap4', minimumResultsForSearch: Infinity, width: '100%' });
    if (typeof refreshCustomFieldState === 'function') refreshCustomFieldState($el.closest('.custom-field'));
}

// Question dropdown depends on the selected parameter; always resets to "All questions"
function populateStudentFeedbackQuestionDropdown() {
    var $el = $('#sfrQuestion');
    if ($el.hasClass('select2-hidden-accessible')) $el.select2('destroy');

    var paramVal = $('#sfrParam').val();
    var list = (sfrState.questions || []).filter(function (q) {
        return paramVal === 'all' || String(q.parameterId) === String(paramVal);
    });

    var html = '<option value="all">All questions</option>';
    list.forEach(function (q) {
        var lbl = (paramVal === 'all' && q.parameterName)
            ? (q.parameterName + ' — ' + q.questionText)
            : q.questionText;
        html += '<option value="' + q.questionId + '">' + sfrEscape(lbl) + ' (' + (q.count || 0) + ')</option>';
    });
    $el.html(html).val('all');
    $el.select2({ theme: 'bootstrap4', minimumResultsForSearch: Infinity, width: '100%' });
    if (typeof refreshCustomFieldState === 'function') refreshCustomFieldState($el.closest('.custom-field'));
}

// ─── API: filtered / paginated list ─────────────────────────────────────────

function applyStudentFeedbackFilter() {
    loadStudentFeedbackList(true);
}

function loadMoreStudentFeedback() {
    loadStudentFeedbackList(false);
}

async function loadStudentFeedbackList(reset) {
    if (sfrState.loading) return;
    sfrState.loading = true;

    if (reset) sfrState.nextOffset = 0;

    var period   = sfrState.selectedPeriod;
    var paramVal = $('#sfrParam').val();
    var qVal     = $('#sfrQuestion').val();

    var payload = {
        userId:          sfrState.userId,
        periodId:        period ? period.id : null,
        roleUnderReview: sfrState.role,
        startDate:       period ? period.startDate : null,
        endDate:         period ? period.endDate : null,
        parameterId:     (paramVal && paramVal !== 'all') ? parseInt(paramVal, 10) : null,
        questionId:      (qVal && qVal !== 'all') ? parseInt(qVal, 10) : null,
        ratingType:      $('#sfrRating').val() || 'all',
        sortBy:          $('#sfrSort').val() || 'recent',
        search:          ($('#sfrSearch').val() || '').trim(),
        offset:          reset ? 0 : sfrState.nextOffset,
        limit:           sfrState.limit
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
        $btn.prop('disabled', false).text('Load more feedback');
        customLoader(false);
    }
}

// ─── Renderers: feedback cards + footer ──────────────────────────────────────

function studentFeedbackCardHtml(f) {
    var rating  = Number(f.ratingValue) || 0;
    var hasComment = f.comment && String(f.comment).trim();
    var comment = hasComment
        ? '<div style="font-size:13px;color:#3c4043;line-height:1.6;background:#fafafa;border-left:3px solid #1565c0;border-radius:0 8px 8px 0;padding:10px 14px">' + sfrEscape(f.comment) + '</div>'
        : '<div style="font-size:13px;color:#9aa0a6;font-style:italic;background:#fafafa;border-left:3px solid #dadce0;border-radius:0 8px 8px 0;padding:10px 14px">Rated without a written comment.</div>';

    return '' +
    '<div class="col-lg-6 mb-3 d-flex">' +
        '<div class="card w-100" style="border:1px solid #e8eaed">' +
            '<div class="card-body p-3 d-flex flex-column">' +
                '<div class="d-flex align-items-center mb-2" style="gap:12px">' +
                    '<div class="rounded-circle d-flex align-items-center justify-content-center" style="width:40px;height:40px;background:#e8f0fe;flex-shrink:0">' +
                        '<i class="fa fa-user" style="color:#1565c0"></i>' +
                    '</div>' +
                    '<div>' +
                        '<div class="font-weight-bold d-flex align-items-center" style="font-size:13px;gap:6px">' +
                            sfrEscape(f.anonymousLabel || 'Anonymous Student') +
                            '<i class="fa fa-lock text-muted" style="font-size:12px" title="Identity hidden"></i>' +
                        '</div>' +
                        '<div class="text-muted d-flex align-items-center mt-1" style="font-size:11px;gap:4px">' +
                            '<i class="fa fa-calendar-o"></i>' + sfrFmtDate(f.submittedDate) +
                        '</div>' +
                    '</div>' +
                    '<div class="ml-auto text-right" style="flex-shrink:0">' +
                        '<div>' + sfrStarsHtml(rating) + '</div>' +
                        '<div class="text-muted mt-1" style="font-size:11px">' + rating.toFixed(1) + ' / 5</div>' +
                    '</div>' +
                '</div>' +
                (f.parameterName
                    ? '<span class="d-inline-flex align-items-center align-self-start text-uppercase font-weight-bold mb-2" style="gap:5px;background:#f1f3f4;color:#3c4043;font-size:10px;padding:3px 10px;border-radius:20px;letter-spacing:.3px"><i class="fa fa-tag"></i>' + sfrEscape(f.parameterName) + '</span>'
                    : '') +
                '<div class="d-flex align-items-start mb-2" style="gap:6px;font-size:12px;color:#1565c0;font-weight:600;line-height:1.45">' +
                    '<i class="fa fa-question-circle" style="margin-top:1px;flex-shrink:0"></i>' +
                    '<span>' + sfrEscape(f.questionText || '') + '</span>' +
                '</div>' +
                comment +
            '</div>' +
        '</div>' +
    '</div>';
}

function renderStudentFeedbackCards(entries, append) {
    var $grid = $('#sfrGrid');
    if (!append) {
        if (!entries || !entries.length) {
            $grid.html('<div class="col-12 text-center text-muted py-5"><i class="fa fa-search fa-2x mb-2 d-block"></i>No feedback matches your filters.</div>');
            return;
        }
        $grid.html(entries.map(studentFeedbackCardHtml).join(''));
    } else {
        $grid.append(entries.map(studentFeedbackCardHtml).join(''));
    }
}

function updateStudentFeedbackFooter() {
    if (sfrState.totalCount > 0) {
        $('#sfrResultCount').html('Showing <strong>' + sfrState.loadedCount + '</strong> of <strong>' + sfrState.totalCount + '</strong> feedback entries');
    } else {
        $('#sfrResultCount').text('');
    }
    $('#sfrLoadMoreWrap').toggle(!!sfrState.hasMore);
}

// ─── Reset ───────────────────────────────────────────────────────────────────

// resets only the field values/UI (no reload) — used on fresh summary loads
function resetStudentFeedbackFilterFields() {
    $('#sfrRating').val('all');
    $('#sfrSort').val('recent');
    $('#sfrSearch').val('');
    if ($('#sfrRating').hasClass('select2-hidden-accessible')) $('#sfrRating').trigger('change.select2');
    if ($('#sfrSort').hasClass('select2-hidden-accessible'))   $('#sfrSort').trigger('change.select2');
}

function resetStudentFeedbackFilter() {
    $('#sfrParam').val('all');
    if ($('#sfrParam').hasClass('select2-hidden-accessible')) $('#sfrParam').trigger('change.select2');
    populateStudentFeedbackQuestionDropdown();
    resetStudentFeedbackFilterFields();
    applyStudentFeedbackFilter();
}
