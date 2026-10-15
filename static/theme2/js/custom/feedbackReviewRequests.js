var frrState = {
    periods: [],
    selectedPeriod: null,
    page: 1,
    size: 20,
    rows: [],
    totalRecords: 0,
    totalPages: 0,
    activeRow: null,
    pendingAction: null,
    pendingRemark: '',
    defaultPeriodApplied: false
};

function feedbackReviewRequestsOnLoad() {
    $('#frrPeriodId, #frrStatus').select2({ theme: 'bootstrap4', minimumResultsForSearch: Infinity, width: '100%' });
    $('#frrPageSize').select2({ theme: 'bootstrap4', minimumResultsForSearch: Infinity, width: '90px' });
    $('#frrPageSize').on('change', function () {
        frrState.size = parseInt($(this).val(), 10) || 20;
        frrState.page = 1;
        loadFeedbackReviewRequests();
    });
    $('#frrSearch').on('keypress', function (e) {
        if (e.which === 13) applyFeedbackReviewFilter();
    });
    loadFeedbackReviewRequests();
}

function frrSuccess(response) {
    return response && (response.status === '1' || response.statusCode === 'SUCCESS');
}

function frrEscape(s) {
    return String(s == null ? '' : s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function frrStatusBadge(status) {
    var s = status || 'Pending';
    var cls = s === 'Excluded' ? 'badge-danger' : (s === 'Genuine' ? 'badge-success' : 'badge-warning');
    return '<span class="badge ' + cls + ' px-2 py-1">' + frrEscape(s) + '</span>';
}

function frrRatingHtml(rating) {
    var r = Number(rating) || 0;
    var color = r < 2.6 ? '#d93025' : (r < 3.75 ? '#fbbc04' : '#1e8a3c');
    return '<span class="font-weight-bold" style="color:' + color + '">' + r.toFixed(1) + '/5</span>';
}

function frrPrettyDate(value) {
    if (!value) return '-';
    var raw = String(value).replace(' ', 'T');
    var d = new Date(raw);
    if (isNaN(d.getTime())) {
        d = new Date(String(value).substring(0, 10) + 'T00:00:00');
    }
    if (isNaN(d.getTime())) return frrEscape(value);
    return d.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: '2-digit',
        year: 'numeric'
    });
}

function frrClassTitle(row) {
    var title = row.classTopic || row.subjectName || row.formLabel || 'Class Feedback';
    return title === row.entityType ? (row.subjectName || row.formLabel || 'Class Feedback') : title;
}

async function loadFeedbackReviewRequests() {
    renderFeedbackReviewLoading();
    customLoader(true);
    try {
        var response = await callCommonAjax({
            method: 'POST',
            url: APP_BASE_URL + API_VERSION + 'teacher-evaluation/rating/student-feedback/review/list',
            body: {
                periodId: frrState.selectedPeriod ? frrState.selectedPeriod.id : null,
                status: $('#frrStatus').val() || '',
                search: $('#frrSearch').val() || '',
                page: frrState.page,
                size: frrState.size
            },
            global: false,
            showMessage: false
        });
        if (!frrSuccess(response) || !response.details) {
            showMessageTheme2(0, response && response.message ? response.message : 'Failed to load review requests.');
            return;
        }
        var d = response.details;
        frrState.rows = d.rows || [];
        frrState.periods = d.periods || frrState.periods || [];
        frrState.totalRecords = d.totalRecords || 0;
        frrState.totalPages = d.totalPages || 0;
        if (!frrState.defaultPeriodApplied && !frrState.selectedPeriod && d.selectedPeriod && d.selectedPeriod.id) {
            frrState.defaultPeriodApplied = true;
            frrState.selectedPeriod = { id: d.selectedPeriod.id };
            frrBuildPeriodSelect(frrState.rows);
        }
        frrBuildPeriodSelect(frrState.rows);
        renderFeedbackReviewRequests();
    } catch (e) {
        showMessageTheme2(0, 'Failed to load review requests.');
    } finally {
        customLoader(false);
    }
}

function frrBuildPeriodSelect(rows) {
    var $el = $('#frrPeriodId');
    var periodMap = {};
    var selectedId = frrState.selectedPeriod ? String(frrState.selectedPeriod.id) : ($el.val() || '');
    $el.find('option').each(function () {
        if (this.value) periodMap[this.value] = $(this).text();
    });
    (frrState.periods || []).forEach(function (p) {
        if (p.id) {
            periodMap[p.id] = (p.periodLabel || ('Period #' + p.id)) +
                (p.roleUnderReview ? ' &middot; ' + p.roleUnderReview : '');
        }
    });
    (rows || []).forEach(function (r) {
        if (r.periodId) {
            periodMap[r.periodId] = (r.periodLabel || ('Period #' + r.periodId)) +
                (r.roleUnderReview ? ' &middot; ' + r.roleUnderReview : '');
        }
    });
    var html = '<option value="">All periods</option>';
    if (selectedId && !periodMap[selectedId]) {
        periodMap[selectedId] = 'Period #' + selectedId;
    }
    Object.keys(periodMap).forEach(function (pid) {
        html += '<option value="' + pid + '">' + periodMap[pid] + '</option>';
    });
    if ($el.hasClass('select2-hidden-accessible')) {
        $el.select2('destroy');
    }
    $el.html(html);
    if (selectedId) {
        $el.val(String(selectedId));
    }
    $el.select2({ theme: 'bootstrap4', minimumResultsForSearch: Infinity, width: '100%' });
    if (typeof refreshCustomFieldState === 'function') {
        refreshCustomFieldState($el.closest('.custom-field'));
    }
    $el.off('change.frr').on('change.frr', function () {
        var pid = parseInt($(this).val()) || null;
        frrState.selectedPeriod = pid ? { id: pid } : null;
        frrState.page = 1;
        loadFeedbackReviewRequests();
    });
}

function renderFeedbackReviewRequests() {
    $('#frrShowing').text(frrState.rows.length);
    $('#frrTotal').text(frrState.totalRecords);

    if (!frrState.rows.length) {
        $('#frrTbody').html('<tr><td colspan="8" class="text-center text-muted py-4">No review requests found.</td></tr>');
        $('#frrPagination').html('');
        return;
    }

    var start = (frrState.page - 1) * frrState.size;
    $('#frrTbody').html(frrState.rows.map(function (r, idx) {
        var reason = r.requestReason ? frrEscape(r.requestReason) : '<span class="text-muted">No reason provided</span>';
        var actionDisabled = r.status !== 'Pending';
        var classTitle = frrClassTitle(r);
        var subjectLine = r.subjectName && r.subjectName !== classTitle ? '<div class="small text-muted">' + frrEscape(r.subjectName) + '</div>' : '';
        var classDate = frrPrettyDate(r.classDate || r.feedbackDate);
        var requestDate = frrPrettyDate(r.requestedDate);
        return '' +
        '<tr>' +
            '<td>' + (start + idx + 1) + '</td>' +
            '<td><div class="font-weight-bold">' + frrEscape(r.teacherName || '-') + '</div></td>' +
            '<td><div class="font-weight-bold">' + frrEscape(r.studentName || '-') + '</div></td>' +
            '<td><div class="font-weight-bold">' + frrEscape(r.formLabel || 'Class Feedback') + '</div>' +
                '<div style="font-size:12px;color:#1a1a2e">' + frrEscape(classTitle) + '</div>' +
                subjectLine +
                '<div class="small text-muted">' + classDate + '</div></td>' +
            '<td>' + frrRatingHtml(r.overallRating) + '<div class="small text-muted">' + (r.questionCount || 0) + ' questions</div></td>' +
            '<td><div style="max-width:260px;white-space:normal">' + reason + '</div><div class="small text-muted mt-1">' + requestDate + '</div></td>' +
            '<td>' + frrStatusBadge(r.status) + (r.adminRemark ? '<div class="small text-muted mt-1" style="max-width:220px;white-space:normal">' + frrEscape(r.adminRemark) + '</div>' : '') + '</td>' +
            '<td class="text-nowrap">' +
                '<button class="btn btn-outline-primary btn-sm mr-1" title="View feedback" onclick="openFeedbackReviewFeedback(' + idx + ')"><i class="fa fa-eye"></i></button>' +
                '<button class="btn btn-outline-dark btn-sm" ' + (actionDisabled ? 'disabled' : '') + ' onclick="openFeedbackReviewAction(' + idx + ')"><i class="fa fa-gavel"></i></button>' +
            '</td>' +
        '</tr>';
    }).join(''));

    renderFeedbackReviewPagination();
}

function renderFeedbackReviewPagination() {
    $('#frrPagination').html(frrState.totalPages > 1 ? renderPaginationCommon(frrState.page, frrState.totalPages, 'feedbackReviewRequests') : '');
}

function goFeedbackReviewPage(page) {
    if (page < 1 || page > frrState.totalPages) return;
    frrState.page = page;
    loadFeedbackReviewRequests();
}

function applyFeedbackReviewFilter() {
    frrState.page = 1;
    loadFeedbackReviewRequests();
}

function resetFeedbackReviewFilter() {
    $('#frrStatus').val('Pending').trigger('change.select2');
    $('#frrSearch').val('');
    $('#frrPageSize').val('20').trigger('change.select2');
    if (frrState.selectedPeriod && frrState.selectedPeriod.id) {
        $('#frrPeriodId').val(String(frrState.selectedPeriod.id)).trigger('change.select2');
    }
    frrState.size = 20;
    frrState.page = 1;
    loadFeedbackReviewRequests();
}

function renderFeedbackReviewLoading() {
    $('#frrShowing').text('...');
    $('#frrTotal').text('...');
    $('#frrPagination').html('');
    $('#frrTbody').html(
        '<tr>' +
            '<td colspan="8" class="text-center text-muted py-4">' +
                '<i class="fa fa-spinner fa-spin mr-2"></i>Loading review requests...' +
            '</td>' +
        '</tr>'
    );
}

function openFeedbackReviewAction(index) {
    var row = frrState.rows[index];
    if (!row) return;
    frrState.activeRow = row;
    $('#frrActionTitle').text('Review request #' + row.id);
    $('#frrActionMeta').html(
        '<strong>' + frrEscape(row.teacherName || '-') + '</strong> disputed feedback from <strong>' +
        frrEscape(row.studentName || '-') + '</strong><br>' +
        frrEscape(frrClassTitle(row)) + ' | ' + frrPrettyDate(row.classDate || row.feedbackDate) + ' | ' + frrRatingHtml(row.overallRating)
    );
    $('#frrActionRemark').val(row.adminRemark || '');
    $('#frrActionModal').modal('show');
}

async function submitFeedbackReviewAction(action) {
    var row = frrState.activeRow;
    if (!row) return;
    var remark = $.trim($('#frrActionRemark').val() || '');
    if (!remark) {
        showMessageTheme2(0, 'Admin remark is required.');
        return;
    }
    frrState.pendingAction = action;
    frrState.pendingRemark = remark;
    var confirmMessage = action === 'Exclude'
        ? 'Are you sure you want to exclude this feedback from rating calculations?'
        : 'Are you sure you want to mark this feedback as genuine?';
    showWarningMessage(confirmMessage, 'confirmFeedbackReviewAction()');
}

async function confirmFeedbackReviewAction() {
    var row = frrState.activeRow;
    var action = frrState.pendingAction;
    var remark = frrState.pendingRemark;
    if (!row || !action || !remark) return;
    $('#frrExcludeBtn, #frrGenuineBtn').prop('disabled', true);
    try {
        var response = await callCommonAjax({
            method: 'POST',
            url: APP_BASE_URL + API_VERSION + 'teacher-evaluation/rating/student-feedback/review/action',
            body: { id: row.id, userId: USER_ID, action: action, remark: remark },
            global: false,
            showMessage: false
        });
        if (frrSuccess(response)) {
            showMessageTheme2(1, response.message || 'Request updated successfully.');
            $('#frrActionModal').modal('hide');
            loadFeedbackReviewRequests();
        } else {
            showMessageTheme2(0, response && response.message ? response.message : 'Failed to update request.');
        }
    } catch (e) {
        showMessageTheme2(0, 'Failed to update request.');
    } finally {
        $('#frrExcludeBtn, #frrGenuineBtn').prop('disabled', false);
        frrState.pendingAction = null;
        frrState.pendingRemark = '';
    }
}

async function openFeedbackReviewFeedback(index) {
    var row = frrState.rows[index];
    if (!row) return;
    $('#frrFeedbackBody').html('<div class="text-center text-muted py-4"><i class="fa fa-spinner fa-spin fa-2x"></i></div>');
    $('#frrFeedbackModal').modal('show');
    try {
        var response = await callCommonAjax({
            method: 'POST',
            url: APP_BASE_URL + API_VERSION + 'teacher-evaluation/rating/student-feedback/detail',
            body: {
                userId: row.teacherUserId,
                periodId: row.periodId,
                feedbackResponseId: row.feedbackResponseId,
                includeExcluded: true
            },
            global: false,
            showMessage: false
        });
        if (!frrSuccess(response) || !response.details) {
            $('#frrFeedbackBody').html('<div class="text-danger text-center py-4">Failed to load feedback details.</div>');
            return;
        }
        var d = response.details;
        var items = d.items || [];
        $('#frrFeedbackBody').html(
            '<div class="d-flex align-items-center justify-content-center mb-3" style="gap:10px;background:#f4f6fb;border-radius:10px;padding:12px">' +
                '<span class="text-uppercase font-weight-bold small text-muted">Overall rating</span>' +
                '<span class="font-weight-bold">' + frrRatingHtml(d.overallRating) + '</span>' +
            '</div>' +
            items.map(function (it, idx2) {
                return '<div style="border:1px solid #e8eaed;border-radius:10px;padding:12px 14px;margin-bottom:10px">' +
                    '<div class="font-weight-bold mb-1">' + (idx2 + 1) + '. ' + frrEscape(it.questionText || '') + '</div>' +
                    '<div class="mb-2">' + frrRatingHtml(it.ratingValue) + '</div>' +
                    (it.comment ? '<div style="background:#f4f6fb;border:1px solid #e8eaed;border-radius:8px;padding:9px 12px">' + frrEscape(it.comment) + '</div>' : '') +
                '</div>';
            }).join('')
        );
    } catch (e) {
        $('#frrFeedbackBody').html('<div class="text-danger text-center py-4">Failed to load feedback details.</div>');
    }
}
