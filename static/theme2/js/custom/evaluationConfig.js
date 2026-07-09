var CURRENT_EVALUATION_CONFIG_TAB = 'period';
var CURRENT_PARAM_CONFIG_SUBTAB   = 'main';   // 'main' | 'forms'
var evaluationPeriodList = [];

// ─── On load ────────────────────────────────────────────────────────────────

function evaluationConfigOnLoad() {
    initEvaluationConfigSelects();
    initEvaluationConfigDatepickers();
    loadEvaluationPeriods({});
}

function initEvaluationConfigSelects() {
    $('#periodRoleUnderReview').select2({ theme: 'bootstrap4', minimumResultsForSearch: Infinity, dropdownParent: $('#evaluationPeriodModal') });
    $('#filterPeriodRole').select2({ theme: 'bootstrap4', minimumResultsForSearch: Infinity });
    $('#filterPeriodStatus').select2({ theme: 'bootstrap4', minimumResultsForSearch: Infinity });

    // ── Parameter Configuration tab (native custom-field selects + chip period selector) ──
    $('#parameterSearch').on('keyup', function (e) { if (e.keyCode === 13) applyParameterSearch(); });
    $('#groupFormSearch').on('keyup', function (e) { if (e.keyCode === 13) applyGroupFormSearch(); });
    $('#gfmFormId').on('change', renderGroupFormPreview);
}

function initEvaluationConfigDatepickers() {
    $('#periodStartDate, #periodEndDate, #filterPeriodStartDate, #filterPeriodEndDate').datepicker({
        autoclose: true,
        format: 'M dd, yyyy',
        todayHighlight: true,
        container: 'body',
        orientation: 'bottom auto'
    });

    // End date cannot be before the selected start date (form + filter)
    $('#periodStartDate').on('changeDate clearDate', function (e) {
        // Changing the start date clears the end date so it must be re-picked.
        $('#periodEndDate').val('').datepicker('update', '');
        $('#periodEndDate').datepicker('setStartDate', e.date || null);
    });
    $('#filterPeriodStartDate').on('changeDate clearDate', function (e) {
        // Changing the start date clears the end date so it must be re-picked.
        $('#filterPeriodEndDate').val('').datepicker('update', '');
        $('#filterPeriodEndDate').datepicker('setStartDate', e.date || null);
    });
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────

function switchEvaluationConfigTab(tab) {
    CURRENT_EVALUATION_CONFIG_TAB = tab;
    if (tab === 'period') {
        $('#evaluationConfigPeriodPanel').show();
        $('#evaluationConfigParamPanel').hide();
        $('#ecPeriodTab').addClass('active');
        $('#ecParamTab').removeClass('active');
        $('#addEvaluationPeriodBtn').show();
    } else {
        $('#evaluationConfigPeriodPanel').hide();
        $('#evaluationConfigParamPanel').show();
        $('#ecPeriodTab').removeClass('active');
        $('#ecParamTab').addClass('active');
        $('#addEvaluationPeriodBtn').hide();
        paramConfigOnShow();
    }
}

function switchParamConfigSubtab(sub) {
    CURRENT_PARAM_CONFIG_SUBTAB = sub;
    var isMain = sub === 'main';
    $('#paramConfigMainSubpanel').toggle(isMain);
    $('#paramConfigFormsSubpanel').toggle(!isMain);
    $('#ecParamMainSubtab').toggleClass('active', isMain);
    $('#ecParamFormsSubtab').toggleClass('active', !isMain);
}

// ─── Filter ─────────────────────────────────────────────────────────────────

function applyPeriodFilter() {
    loadEvaluationPeriods({
        roleUnderReview: $('#filterPeriodRole').val() || '',
        status:          $('#filterPeriodStatus').val() || '',
        startDate:       getDatepickerYmd('#filterPeriodStartDate'),
        endDate:         getDatepickerYmd('#filterPeriodEndDate')
    });
}

function resetPeriodFilter() {
    $('#filterPeriodRole').val('').trigger('change');
    $('#filterPeriodStatus').val('').trigger('change');
    $('#filterPeriodStartDate').val('').datepicker('update', '');
    $('#filterPeriodEndDate').val('').datepicker('update', '');
    $('#filterPeriodEndDate').datepicker('setStartDate', null);
    loadEvaluationPeriods({});
}

// ─── API: list ──────────────────────────────────────────────────────────────

async function loadEvaluationPeriods(filters) {
    var payload = {
        roleUnderReview: (filters && filters.roleUnderReview) || '',
        status:          (filters && filters.status) || '',
        startDate:       (filters && filters.startDate) || '',
        endDate:         (filters && filters.endDate) || ''
    };
    try {
        var response = await callCommonAjax({
            method: 'POST',
            url: APP_BASE_URL + API_VERSION + 'teacher-evaluation/period/list',
            body: payload,
            global: true,
            showMessage: false
        });
        if (isEvaluationSuccess(response)) {
            evaluationPeriodList = response.details || [];
            renderEvaluationPeriodTbody(evaluationPeriodList);
        } else {
            showMessageTheme2(0, (response && response.message) ? response.message : 'Failed to load evaluation periods.');
            renderEvaluationPeriodTbody([]);
        }
    } catch (e) {
        showMessageTheme2(0, 'Failed to load evaluation periods.');
        renderEvaluationPeriodTbody([]);
    }
}

// ─── API: save / update ───────────────────────────────────────────────────────

async function saveEvaluationPeriod() {
    var id                  = $('#periodId').val();
    var roleUnderReview     = $('#periodRoleUnderReview').val();
    var startDateObj        = $('#periodStartDate').val() ? $('#periodStartDate').datepicker('getDate') : null;
    var endDateObj          = $('#periodEndDate').val()   ? $('#periodEndDate').datepicker('getDate')   : null;
    var minParamThreshold   = $('#periodMinParamThreshold').val();
    var minOverallThreshold = $('#periodMinOverallThreshold').val();
    // New periods are always Draft; editing keeps the period's current status (Go Live / backend changes it).
    var status              = 'Draft';
    if (id) {
        var existing = evaluationPeriodList.find(function (p) { return p.id == id; });
        status = existing ? existing.status : 'Draft';
    }

    if (!roleUnderReview)   { showMessageTheme2(0, 'Role under review is required.');        return; }
    if (!startDateObj)      { showMessageTheme2(0, 'Start date is required.');               return; }
    if (!endDateObj)        { showMessageTheme2(0, 'End date is required.');                 return; }
    if (minParamThreshold === '' || minParamThreshold == null)     { showMessageTheme2(0, 'Min param threshold is required.');   return; }
    if (minOverallThreshold === '' || minOverallThreshold == null) { showMessageTheme2(0, 'Min overall threshold is required.'); return; }
    if (+minParamThreshold < 0 || +minParamThreshold > 100)        { showMessageTheme2(0, 'Min param threshold must be between 0 and 100.');   return; }
    if (+minOverallThreshold < 0 || +minOverallThreshold > 100)    { showMessageTheme2(0, 'Min overall threshold must be between 0 and 100.'); return; }
    if (endDateObj && endDateObj < startDateObj) { showMessageTheme2(0, 'End date cannot be before start date.'); return; }

    var startDate = changeDateFormat(startDateObj, 'yyyy-mm-dd');
    var endDate   = endDateObj ? changeDateFormat(endDateObj, 'yyyy-mm-dd') : '';

    var payload = {
        id:                  id ? parseInt(id) : null,
        userId:              USER_ID,
        roleUnderReview:     roleUnderReview,
        startDate:           startDate,
        endDate:             endDate,
        minParamThreshold:   parseFloat(minParamThreshold),
        minOverallThreshold: parseFloat(minOverallThreshold),
        status:              status || 'Draft'
    };

    try {
        var response = await callCommonAjax({
            method: 'POST',
            url: APP_BASE_URL + API_VERSION + 'teacher-evaluation/period/save',
            body: payload,
            global: true,
            showMessage: false
        });
        if (isEvaluationSuccess(response)) {
            showMessageTheme2(1, response.message || 'Evaluation period saved successfully.');
            $('#evaluationPeriodModal').modal('hide');
            resetEvaluationPeriodForm();
            loadEvaluationPeriods({});
        } else {
            showMessageTheme2(0, (response && response.message) ? response.message : 'Failed to save evaluation period.');
        }
    } catch (e) {
        showMessageTheme2(0, 'Failed to save evaluation period.');
    }
}

// ─── Edit / Reset ───────────────────────────────────────────────────────────

function openEvaluationPeriodModal() {
    resetEvaluationPeriodForm();
    $('#evaluationPeriodModal').modal('show');
}

function editEvaluationPeriod(id) {
    var period = evaluationPeriodList.find(function (p) { return p.id == id; });
    if (!period) { showMessageTheme2(0, 'Period not found.'); return; }

    $('#periodId').val(period.id);
    $('#periodRoleUnderReview').val(period.roleUnderReview || '').trigger('change');

    var startObj = parseYmd(period.startDate);
    var endObj   = parseYmd(period.endDate);
    if (startObj) { $('#periodStartDate').datepicker('update', startObj); }
    else { $('#periodStartDate').val('').datepicker('update', ''); }
    $('#periodEndDate').datepicker('setStartDate', startObj || null);
    if (endObj) { $('#periodEndDate').datepicker('update', endObj); }
    else { $('#periodEndDate').val('').datepicker('update', ''); }

    $('#periodMinParamThreshold').val(period.minParamThreshold != null ? period.minParamThreshold : '');
    $('#periodMinOverallThreshold').val(period.minOverallThreshold != null ? period.minOverallThreshold : '');

    $('#periodFormTitle').text('Edit Evaluation Period');
    $('#periodSaveBtn').text('Update');
    refreshCustomFieldState();
    $('#evaluationPeriodModal').modal('show');
}

function resetEvaluationPeriodForm() {
    $('#periodId').val('');
    $('#evaluationPeriodForm')[0].reset();
    $('#periodRoleUnderReview').val('').trigger('change');
    $('#periodStartDate').val('').datepicker('update', '');
    $('#periodEndDate').val('').datepicker('update', '');
    $('#periodEndDate').datepicker('setStartDate', null);
    $('#periodFormTitle').text('Add Evaluation Period');
    $('#periodSaveBtn').text('Save');
    refreshCustomFieldState();
}

// ─── Renderer ─────────────────────────────────────────────────────────────────

function renderEvaluationPeriodTbody(data) {
    if ($.fn.DataTable.isDataTable('#evaluationPeriodTable')) {
        $('#evaluationPeriodTable').DataTable().clear().destroy();
    }
    var html = '';
    if (!data || data.length === 0) {
        html = '<tr><td colspan="9" class="text-center text-muted">No records found</td></tr>';
    } else {
        $.each(data, function (i, item) {
            var actions = '<div class="d-flex flex-nowrap align-items-center" style="gap:4px">';
            if (item.status === 'Draft') {
                actions += '<button class="btn btn-success btn-sm text-nowrap" onclick="openGoLiveModal(' + item.id + ')"><i class="fa fa-play mr-1"></i>Go Live</button>';
            }
            if (item.editable !== false && item.status !== 'Locked') {
                actions += '<button class="btn btn-primary btn-sm" onclick="editEvaluationPeriod(' + item.id + ')" title="Edit"><i class="fa fa-edit"></i></button>';
            }
            actions += '</div>';
            html += `<tr>
                <td>${i + 1}</td>
                <td>${item.periodLabel || getPeriodRangeLabel(item)}</td>
                <td>${formatEvalDate(item.startDate)}</td>
                <td>${formatEvalDate(item.endDate)}</td>
                <td>${item.roleUnderReview || 'N/A'}</td>
                <td><strong>${item.minParamThreshold != null ? item.minParamThreshold + '%' : 'N/A'}</strong></td>
                <td><strong>${item.minOverallThreshold != null ? item.minOverallThreshold + '%' : 'N/A'}</strong></td>
                <td>${getPeriodStatusBadge(item.status)}</td>
                <td class="text-nowrap">${actions}</td>
            </tr>`;
        });
    }
    $('#evaluationPeriodTbody').html(html);
    if (data && data.length > 0) {
        $('#evaluationPeriodTable').DataTable({ destroy: true, ordering: false, autoWidth: false });
    }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isEvaluationSuccess(response) {
    return response && (response.status === '1' || response.statusCode === 'SUCCESS');
}

// Parse an 'yyyy-mm-dd' string into a local Date (no timezone shift).
function parseYmd(ymd) {
    if (!ymd) return null;
    var p = String(ymd).split('-');
    if (p.length < 3) return null;
    return new Date(parseInt(p[0], 10), parseInt(p[1], 10) - 1, parseInt(p[2], 10));
}

// Display an 'yyyy-mm-dd' string as MMM-dd-yyyy (e.g. Jul 01, 2026).
function formatEvalDate(ymd) {
    var d = parseYmd(ymd);
    return d ? changeDateFormat(d, 'MMM-dd-yyyy') : '—';
}

// Read a datepicker's selected date as an 'yyyy-mm-dd' string for the API.
function getDatepickerYmd(selector) {
    if (!$(selector).val()) return '';
    var d = $(selector).datepicker('getDate');
    return d ? changeDateFormat(d, 'yyyy-mm-dd') : '';
}

function getPeriodStatusBadge(status) {
    var map = { Active: 'badge-success', Draft: 'badge-warning', Locked: 'badge-secondary', Inactive: 'badge-danger' };
    var cls = map[status] || 'badge-secondary';
    return '<span class="badge ' + cls + '">' + (status || 'N/A') + '</span>';
}

function getPeriodLabel(startDate) {
    if (!startDate) return 'N/A';
    var parts = startDate.split('-');
    if (parts.length < 2) return startDate;
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var monthIdx = parseInt(parts[1], 10) - 1;
    return (months[monthIdx] || '') + ' ' + parts[0];
}

// Period range label, e.g. "Jul 25 – Aug 25" or "Aug 25 —" (open-ended).
function getPeriodRangeLabel(period) {
    if (!period || !period.startDate) return 'N/A';
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var s = parseYmd(period.startDate);
    var startLbl = months[s.getMonth()] + ' ' + String(s.getFullYear()).slice(2);
    if (!period.endDate) return startLbl + ' —';
    var e = parseYmd(period.endDate);
    e.setDate(e.getDate() + 1);
    return startLbl + ' – ' + months[e.getMonth()] + ' ' + String(e.getFullYear()).slice(2);
}


/* ════════════════════════════════════════════════════════════════════════════
   GO LIVE  +  DELETE
   ════════════════════════════════════════════════════════════════════════════ */

var goLivePendingId = null;
var goLivePreview   = null;   // last go-live/preview details, used by execGoLive to build the save payload

async function fetchPeriodGroups(periodId) {
    try {
        var r = await callCommonAjax({ method: 'POST', url: APP_BASE_URL + API_VERSION + 'teacher-evaluation/group/list', body: { periodId: periodId }, global: true, showMessage: false });
        return isEvaluationSuccess(r) ? (r.details || []) : [];
    } catch (e) { return []; }
}

async function fetchPeriodParameters(periodId) {
    try {
        var r = await callCommonAjax({ method: 'POST', url: APP_BASE_URL + API_VERSION + 'teacher-evaluation/parameter/list', body: { periodId: periodId, search: '' }, global: true, showMessage: false });
        return isEvaluationSuccess(r) ? (r.details || []) : [];
    } catch (e) { return []; }
}

// Open the Go Live modal — server-driven via user-rating/period/go-live/preview.
async function openGoLiveModal(periodId) {
    var period = evaluationPeriodList.find(function (p) { return p.id == periodId; });
    if (!period) { showMessageTheme2(0, 'Period not found.'); return; }
    if (period.status !== 'Draft') { showMessageTheme2(0, 'Only draft periods can go live.'); return; }

    goLivePendingId = periodId;
    goLivePreview   = null;
    $('#goLiveTitle').text('Going Live: ' + (period.periodLabel || getPeriodRangeLabel(period)));
    $('#goLiveBody').html('<div class="text-center text-muted py-4"><i class="fa fa-spinner fa-spin fa-2x d-block mb-2"></i>Loading go-live options…</div>');
    $('#goLiveFooter').html('<button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">Cancel</button>');
    $('#goLiveModal').modal('show');

    try {
        var response = await callCommonAjax({
            method: 'POST',
            url: APP_BASE_URL + API_VERSION + 'user-rating/period/go-live/preview',
            body: { periodId: periodId, roleUnderReview: period.roleUnderReview },
            global: true,
            showMessage: false
        });
        if (!isEvaluationSuccess(response)) {
            $('#goLiveBody').html('<div class="alert alert-danger">' + ((response && response.message) || 'Failed to load go-live options.') + '</div>');
            return;
        }
        goLivePreview = response.details || {};
        renderGoLivePreview(goLivePreview);
    } catch (e) {
        $('#goLiveBody').html('<div class="alert alert-danger">Failed to load go-live options.</div>');
    }
}

function renderGoLivePreview(details) {
    var active = details.currentActivePeriod;
    var groups = details.groups || [];
    // "Inheritance available" = server flag AND we actually have groups to copy
    var hasInherit = details.inheritanceAvailable === true && groups.length > 0;

    var body = '';
    if (active) {
        body += '<div class="alert alert-warning py-2"><i class="fa fa-lock mr-1"></i>Current active period <strong>' +
                    (active.periodLabel || getPeriodRangeLabel(active)) +
                '</strong> will be locked.</div>';
    }
    if (hasInherit) {
        body += '<div class="font-weight-bold mb-2">Inherit from ' + (active ? (active.periodLabel || getPeriodRangeLabel(active)) : 'previous period') + ':</div>';
        body += renderGoLiveInheritTree(groups);
    } else if (active) {
        body += '<div class="text-muted py-2">No groups / parameters to inherit.</div>';
    } else {
        body += '<div class="text-muted py-2">No previous active period to inherit from.</div>';
    }
    $('#goLiveBody').html(body);

    var footer = '<button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">Cancel</button>';
    if (hasInherit) {
        footer += '<button type="button" class="btn btn-outline-success btn-sm" onclick="execGoLive(false)">Go Live without inheritance</button>';
    }
    footer += '<button type="button" class="btn btn-success btn-sm" onclick="execGoLive(' + (hasInherit ? 'true' : 'false') + ')"><i class="fa fa-play mr-1"></i>Go Live</button>';
    $('#goLiveFooter').html(footer);
}

function renderGoLiveInheritTree(groups) {
    var html = '<div class="mb-2"><label class="font-weight-bold text-success mb-0" style="cursor:pointer">' +
                    '<input type="checkbox" id="goLiveSelectAll" checked onchange="toggleGoLiveAll(this)" class="mr-1">Select all' +
                '</label></div>';
    $.each(groups, function (i, g) {
        var params = g.parameters || [];
        var forms  = g.forms || [];
        var gChecked = g.selected !== false;
        html += '<div class="border rounded mb-2">';
        // Group header
        html += '<label class="d-flex align-items-start mb-0 p-2 bg-light" style="cursor:pointer">' +
                    '<input type="checkbox" class="gl-group mr-2 mt-1" value="' + g.sourceGroupId + '"' + (gChecked ? ' checked' : '') + ' onchange="toggleGoLiveGroup(this)">' +
                    '<span><strong>' + (g.groupName || '') + '</strong>' +
                        '<br><small class="text-muted">Group weight: ' + (g.groupWeight || 0) + '% · ' + params.length + ' params' +
                            (forms.length ? ' · ' + forms.length + ' form' + (forms.length !== 1 ? 's' : '') : '') +
                        '</small>' +
                    '</span>' +
                '</label>';
        // Parameters
        $.each(params, function (j, p) {
            var pChecked = p.selected !== false;
            html += '<label class="d-flex align-items-start mb-0 p-2 pl-5 border-top" style="cursor:pointer">' +
                        '<input type="checkbox" class="gl-param mr-2 mt-1" data-group="' + g.sourceGroupId + '" value="' + p.sourceEvaluationParameterId + '"' + (pChecked ? ' checked' : '') + '>' +
                        '<span>' + (p.parameterName || '') +
                            '<br><small class="text-muted">' + (p.evaluatedBy || '') + ' · ' + (p.weightInGroup || 0) + '%</small>' +
                        '</span>' +
                    '</label>';
        });
        // Mapped forms (copied automatically — no per-form toggle)
        if (forms.length) {
            html += '<div class="p-2 pl-5 border-top" style="background:#fafbfc">' +
                        '<div class="small text-muted mb-1"><i class="fa fa-info-circle mr-1"></i>Mapped forms (copied automatically):</div>';
            forms.forEach(function (f) {
                var label = f.formLabel || f.formCode || ('Form #' + f.feedbackFormId);
                html += '<div class="small"><i class="fa fa-file-text-o mr-1 text-muted"></i>' + label + '</div>';
            });
            html += '</div>';
        }
        html += '</div>';
    });
    return html;
}

function toggleGoLiveAll(el) {
    $('#goLiveBody .gl-group, #goLiveBody .gl-param').prop('checked', el.checked);
}

function toggleGoLiveGroup(el) {
    $('#goLiveBody .gl-param[data-group="' + $(el).val() + '"]').prop('checked', el.checked);
}

// Actually go live — POST to user-rating/period/go-live with the selected inheritance tree.
async function execGoLive(withInheritance) {
    var period = evaluationPeriodList.find(function (p) { return p.id == goLivePendingId; });
    if (!period) { showMessageTheme2(0, 'Period not found.'); return; }

    var payload;
    if (withInheritance) {
        // Collect selected groups + params from the checkbox tree
        var selectedGroups = [];
        $('#goLiveBody .gl-group:checked').each(function () {
            var sourceGroupId = parseInt($(this).val());
            var params = [];
            $('#goLiveBody .gl-param[data-group="' + sourceGroupId + '"]:checked').each(function () {
                params.push({ sourceEvaluationParameterId: parseInt($(this).val()), selected: true });
            });
            selectedGroups.push({ sourceGroupId: sourceGroupId, selected: true, parameters: params });
        });
        payload = {
            userId:          USER_ID,
            periodId:        period.id,
            roleUnderReview: period.roleUnderReview,
            inheritConfig:   true,
            sourcePeriodId:  goLivePreview && goLivePreview.currentActivePeriod ? goLivePreview.currentActivePeriod.id : null,
            groups:          selectedGroups
        };
    } else {
        payload = {
            userId:          USER_ID,
            periodId:        period.id,
            roleUnderReview: period.roleUnderReview,
            inheritConfig:   false,
            groups:          []
        };
    }

    try {
        var response = await callCommonAjax({
            method: 'POST',
            url: APP_BASE_URL + API_VERSION + 'user-rating/period/go-live',
            body: payload,
            global: true,
            showMessage: false
        });
        if (isEvaluationSuccess(response)) {
            var det = response.details || {};
            var msg = response.message || 'Period is now live.';
            if (det.copiedSummary) {
                var s = det.copiedSummary;
                msg += ' · ' + s.groupsCopied + ' group' + (s.groupsCopied !== 1 ? 's' : '') +
                       ', ' + s.parametersCopied + ' parameter' + (s.parametersCopied !== 1 ? 's' : '') +
                       ', ' + s.formsCopied + ' form' + (s.formsCopied !== 1 ? 's' : '') + ' copied.';
            }
            showMessageTheme2(1, msg);
            $('#goLiveModal').modal('hide');
            loadEvaluationPeriods({});
        } else {
            showMessageTheme2(0, (response && response.message) ? response.message : 'Failed to go live.');
        }
    } catch (e) {
        showMessageTheme2(0, 'Failed to go live.');
    }
}


/* ════════════════════════════════════════════════════════════════════════════
   PARAMETER CONFIGURATION
   ════════════════════════════════════════════════════════════════════════════ */

var paramConfigPeriods = [];
var paramConfigSelectedPeriodId = null;   // a period id (number) or 'all'
var paramGroupList = [];
var paramOptions = { groups: [], parameters: [], evaluatorRoles: [], roleParameterMappings: [] };
var parameterList = [];
var paramGroupColors = ['#1a73e8', '#7b1fa2', '#00897b', '#e65100', '#c62828', '#558b2f'];
var wtDraft = { groups: [], subParams: {} };
var wtLocked = { groups: {}, subs: {} };
var wtConfig = null;   // last-fetched weightage/config response.details (source of truth for the modal)

// ─── On show ──────────────────────────────────────────────────────────────────

async function paramConfigOnShow() {
    // Reapply the last-selected sub-tab so re-entering the tab lands on the
    // right sub-panel; defaults to 'main' on first visit.
    switchParamConfigSubtab(CURRENT_PARAM_CONFIG_SUBTAB || 'main');
    await loadParamConfigPeriods();
}

async function loadParamConfigPeriods() {
    try {
        var response = await callCommonAjax({
            method: 'POST',
            url: APP_BASE_URL + API_VERSION + 'teacher-evaluation/period/list',
            body: { roleUnderReview: '', status: '', startDate: '', endDate: '' },
            global: true,
            showMessage: false
        });
        paramConfigPeriods = isEvaluationSuccess(response) ? (response.details || []) : [];
    } catch (e) {
        paramConfigPeriods = [];
    }

    // default selection: keep previous if still valid, else the Active period, else first, else 'all'
    var keep = paramConfigSelectedPeriodId === 'all' ||
        (paramConfigSelectedPeriodId && paramConfigPeriods.some(function (p) { return p.id == paramConfigSelectedPeriodId; }));
    if (!keep) {
        var active = paramConfigPeriods.find(function (p) { return p.status === 'Active'; });
        paramConfigSelectedPeriodId = active ? active.id : (paramConfigPeriods.length ? paramConfigPeriods[0].id : 'all');
    }
    renderParamPeriodSelector();
    await renderParamConfigView();
}

function renderParamPeriodSelector() {
    var allSel = paramConfigSelectedPeriodId === 'all';
    var html = '<button type="button" class="btn btn-sm ' + (allSel ? 'btn-primary' : 'btn-outline-secondary') + '" style="border-radius:20px" onclick="selectParamPeriod(\'all\')"><i class="fa fa-list mr-1"></i>All</button>';
    // Order: Draft → Active → Locked → anything else.
    var statusRank = { Draft: 0, Active: 1, Locked: 2 };
    var sorted = paramConfigPeriods.slice().sort(function (a, b) {
        var ra = statusRank[a.status] != null ? statusRank[a.status] : 3;
        var rb = statusRank[b.status] != null ? statusRank[b.status] : 3;
        if (ra !== rb) return ra - rb;
        return (a.startDate || '') > (b.startDate || '') ? 1 : -1;
    });
    $.each(sorted, function (i, p) {
        var sel = paramConfigSelectedPeriodId == p.id;
        var dot = p.status === 'Active' ? '#1e8a3c' : p.status === 'Draft' ? '#f9a825' : '#9aa0a6';
        // white ring keeps the status dot visible on the selected (blue) chip
        html += '<button type="button" class="btn btn-sm ' + (sel ? 'btn-primary' : 'btn-outline-secondary') + '" style="border-radius:20px" onclick="selectParamPeriod(' + p.id + ')">' +
            '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:' + dot + ';margin-right:6px;box-shadow:0 0 0 1.5px rgba(255,255,255,.9);vertical-align:middle"></span>' +
            (p.periodLabel || getPeriodRangeLabel(p)) + ' · ' + (p.roleUnderReview || '') + '</button>';
    });
    $('#paramPeriodSelector').html(html);
}

function selectParamPeriod(id) {
    paramConfigSelectedPeriodId = (id === 'all') ? 'all' : parseInt(id);
    renderParamPeriodSelector();
    renderParamConfigView();
}

function getSelectedParamPeriod() {
    if (paramConfigSelectedPeriodId === 'all') return null;
    return paramConfigPeriods.find(function (p) { return p.id == paramConfigSelectedPeriodId; }) || null;
}

function isSelectedParamPeriodLocked() {
    var p = getSelectedParamPeriod();
    return !!(p && p.status === 'Locked');
}

async function renderParamConfigView() {
    var isAll = paramConfigSelectedPeriodId === 'all';
    var period = getSelectedParamPeriod();
    var status = period ? period.status : '';
    var frozen = status === 'Locked';
    var isDraft = status === 'Draft';
    // groups, parameters and group forms are set up on Draft (pre-go-live) and Active periods
    var canEdit = !isAll && (status === 'Active' || status === 'Draft');

    var banner = '';
    if (frozen) banner = '<div class="alert alert-info py-2"><i class="fa fa-lock mr-1"></i>This period is locked. Groups, parameters, and weights are read-only.</div>';
    $('#paramConfigInfoBanner').html(banner);

    $('#paramGroupCard').toggle(canEdit);
    $('#addParameterBtn').toggle(canEdit);

    if (isAll) {
        $('#configWeightageBtn').hide();
    } else {
        $('#configWeightageBtn').show();
        // Draft: not configurable yet — backend doesn't accept weight edits before go-live.
        $('#configWeightageBtn').prop('disabled', isDraft);
        $('#configWeightageBtn').attr('title', isDraft ? 'Available after this period goes live' : '');
        $('#configWeightageLabel').text(frozen ? 'View Weightage' : 'Configure Weightage');
    }

    // Add Form button: only on Active period
    $('#addGroupFormBtn').toggle(canEdit);

    if (isAll) {
        paramGroupList = [];
        parameterList = await loadAllParameters();
        groupFormList = await loadAllGroupForms();
        renderParameterTbody(parameterList);
        renderGroupFormTbody(groupFormList);
        $('#paramWeightBanner').html('');
        return;
    }
    if (!period) {
        paramGroupList = []; parameterList = []; groupFormList = [];
        renderParamGroupTbody([]); renderParameterTbody([]); renderGroupFormTbody([]);
        $('#paramWeightBanner').html('');
        return;
    }
    await loadParameterOptions();
    await loadParamGroups();
    await loadParameters('');
    await loadGroupFormOptions();
    await loadGroupForms('');
}

async function loadAllParameters() {
    var all = [];
    for (var i = 0; i < paramConfigPeriods.length; i++) {
        var rows = await fetchPeriodParameters(paramConfigPeriods[i].id);
        all = all.concat(rows || []);
    }
    return all;
}

async function reloadParamGroupsAndParams() {
    await loadParameterOptions();
    await loadParamGroups();
    await loadParameters($('#parameterSearch').val() || '');
    await loadGroupFormOptions();
    await loadGroupForms($('#groupFormSearch').val() || '');
}

// ─── API: groups ──────────────────────────────────────────────────────────────

async function loadParamGroups() {
    try {
        var response = await callCommonAjax({
            method: 'POST',
            url: APP_BASE_URL + API_VERSION + 'teacher-evaluation/group/list',
            body: { periodId: paramConfigSelectedPeriodId },
            global: true,
            showMessage: false
        });
        if (isEvaluationSuccess(response)) {
            paramGroupList = response.details || [];
            renderParamGroupTbody(paramGroupList);
        } else {
            showMessageTheme2(0, (response && response.message) ? response.message : 'Failed to load groups.');
            renderParamGroupTbody([]);
        }
    } catch (e) {
        showMessageTheme2(0, 'Failed to load groups.');
        renderParamGroupTbody([]);
    }
}

async function addParamGroup() {
    if (paramConfigSelectedPeriodId === 'all' || !paramConfigSelectedPeriodId) { showMessageTheme2(0, 'Select a period first.'); return; }
    var name = $('#newGroupName').val().trim();
    if (!name) { showMessageTheme2(0, 'Group name is required.'); return; }
    var payload = { id: null, userId: USER_ID, periodId: paramConfigSelectedPeriodId, groupName: name, weight: 0, status: 'Active' };
    try {
        var response = await callCommonAjax({ method: 'POST', url: APP_BASE_URL + API_VERSION + 'teacher-evaluation/group/save', body: payload, global: true, showMessage: false });
        if (isEvaluationSuccess(response)) {
            showMessageTheme2(1, response.message || 'Parameter group saved successfully.');
            $('#newGroupName').val(''); refreshCustomFieldState();
            await reloadParamGroupsAndParams();
        } else {
            showMessageTheme2(0, (response && response.message) ? response.message : 'Failed to save group.');
        }
    } catch (e) { showMessageTheme2(0, 'Failed to save group.'); }
}

function openGroupEdit(id) {
    var g = paramGroupList.find(function (x) { return x.id == id; });
    if (!g) { showMessageTheme2(0, 'Group not found.'); return; }
    $('#egmId').val(g.id);
    $('#egmName').val(g.groupName || '');
    $('#egmStatus').val(g.status || 'Active');
    refreshCustomFieldState();
    $('#groupEditModal').modal('show');
}

async function saveGroupEdit() {
    var id = $('#egmId').val();
    var name = $('#egmName').val().trim();
    var status = $('#egmStatus').val();
    if (!name) { showMessageTheme2(0, 'Group name is required.'); return; }
    var g = paramGroupList.find(function (x) { return x.id == id; });
    var payload = {
        id:        parseInt(id),
        userId:    USER_ID,
        periodId:  paramConfigSelectedPeriodId,
        groupName: name,
        weight:    g ? (g.weight || 0) : 0,   // weight is managed via Configure Weightage
        status:    status || 'Active'
    };
    try {
        var response = await callCommonAjax({ method: 'POST', url: APP_BASE_URL + API_VERSION + 'teacher-evaluation/group/save', body: payload, global: true, showMessage: false });
        if (isEvaluationSuccess(response)) {
            showMessageTheme2(1, response.message || 'Parameter group saved successfully.');
            $('#groupEditModal').modal('hide');
            await reloadParamGroupsAndParams();
        } else {
            showMessageTheme2(0, (response && response.message) ? response.message : 'Failed to save group.');
        }
    } catch (e) { showMessageTheme2(0, 'Failed to save group.'); }
}

function renderParamGroupTbody(data) {
    if ($.fn.DataTable.isDataTable('#paramGroupTable')) {
        $('#paramGroupTable').DataTable().clear().destroy();
    }
    var frozen = isSelectedParamPeriodLocked();
    var html = '';
    if (!data || data.length === 0) {
        html = '<tr><td colspan="6" class="text-center text-muted">No groups yet. Add one above.</td></tr>';
    } else {
        $.each(data, function (i, g) {
            var color = paramGroupColors[i % paramGroupColors.length];
            var w = g.weight != null ? g.weight : 0;
            var weightCell = '<strong class="text-primary">' + w + '%</strong>' +
                '<div class="progress mt-1" style="height:6px;width:90px"><div class="progress-bar" role="progressbar" style="width:' + Math.min(w, 100) + '%;background:' + color + '"></div></div>';
            var action = (g.editable === false || frozen)
                ? ''
                : '<button class="btn btn-primary btn-sm" onclick="openGroupEdit(' + g.id + ')" title="Edit"><i class="fa fa-edit"></i></button>';
            html += `<tr style="${g.status === 'Inactive' ? 'opacity:.6' : ''}">
                <td>${i + 1}</td>
                <td class="font-weight-bold">${g.groupName || 'N/A'}</td>
                <td>${weightCell}</td>
                <td><span class="badge badge-info">${g.subParams != null ? g.subParams : 0}</span></td>
                <td>${getPeriodStatusBadge(g.status)}</td>
                <td class="text-nowrap">${action}</td>
            </tr>`;
        });
    }
    $('#paramGroupTbody').html(html);
    if (data && data.length > 0) {
        $('#paramGroupTable').DataTable({ destroy: true, ordering: false, searching: false, paging: false, info: false, autoWidth: false });
    }
    renderParamWeightBanner();
}

// ─── API: parameter options ───────────────────────────────────────────────────

async function loadParameterOptions() {
    try {
        var response = await callCommonAjax({
            method: 'POST',
            url: APP_BASE_URL + API_VERSION + 'teacher-evaluation/parameter/options',
            body: { periodId: paramConfigSelectedPeriodId },
            global: true,
            showMessage: false
        });
        if (isEvaluationSuccess(response)) {
            var d = response.details || {};
            paramOptions = {
                groups:               d.groups || [],
                parameters:           d.parameters || [],
                evaluatorRoles:       d.evaluatorRoles || [],
                roleParameterMappings: d.roleParameterMappings || []
            };
        } else {
            paramOptions = { groups: [], parameters: [], evaluatorRoles: [], roleParameterMappings: [] };
        }
    } catch (e) {
        paramOptions = { groups: [], parameters: [], evaluatorRoles: [], roleParameterMappings: [] };
    }
}

// ─── API: parameters ──────────────────────────────────────────────────────────

function applyParameterSearch() {
    loadParameters($('#parameterSearch').val() || '');
}

async function loadParameters(search) {
    try {
        var response = await callCommonAjax({
            method: 'POST',
            url: APP_BASE_URL + API_VERSION + 'teacher-evaluation/parameter/list',
            body: { periodId: paramConfigSelectedPeriodId, search: search || '' },
            global: true,
            showMessage: false
        });
        if (isEvaluationSuccess(response)) {
            parameterList = response.details || [];
            renderParameterTbody(parameterList);
        } else {
            showMessageTheme2(0, (response && response.message) ? response.message : 'Failed to load parameters.');
            renderParameterTbody([]);
        }
    } catch (e) {
        showMessageTheme2(0, 'Failed to load parameters.');
        renderParameterTbody([]);
    }
}

// Opens the shared parameter modal (#parameterModal) in "add" mode.
// saveParameter() already handles both add and edit — it sends id:null when
// #epmId is blank, which is the add case.
function openAddParameterModal() {
    if (paramConfigSelectedPeriodId === 'all' || !paramConfigSelectedPeriodId) {
        showMessageTheme2(0, 'Select a period first.');
        return;
    }
    $('#epmId').val('');
    populateGroupOptions('#epmGroupId');
    $('#epmGroupId').prop('disabled', false).val('');
    populateParamNameOptions('#epmName');
    $('#epmName').prop('disabled', false).val('');
    populateEvaluatorOptions('#epmName', '#epmEvaluatedBy');
    $('#epmEvaluatedBy').prop('disabled', false).val('');
    $('#epmStatus')
        .html('<option value="Active">Active</option><option value="Inactive">Inactive</option>')
        .prop('disabled', false)
        .val('Active');
    $('#epmSaveBtn').show();
    $('#parameterModalTitle').text('Add Parameter');
    refreshCustomFieldState();
    $('#parameterModal').modal('show');
}

async function saveParameter() {
    var id                     = $('#epmId').val();
    var groupId                = $('#epmGroupId').val();
    var performanceParameterId = $('#epmName').val();
    var evaluatedByRoleId      = $('#epmEvaluatedBy').val();
    var status                 = $('#epmStatus').val();

    if (paramConfigSelectedPeriodId === 'all' || !paramConfigSelectedPeriodId) { showMessageTheme2(0, 'Select a period first.'); return; }
    if (!groupId)                { showMessageTheme2(0, 'Parameter group is required.'); return; }
    if (!performanceParameterId) { showMessageTheme2(0, 'Parameter name is required.'); return; }
    if (!evaluatedByRoleId)      { showMessageTheme2(0, 'Evaluated by is required.'); return; }

    var existing = parameterList.find(function (x) { return x.id == id; });
    var payload = {
        id:                     id ? parseInt(id) : null,
        userId:                 USER_ID,
        periodId:               paramConfigSelectedPeriodId,
        groupId:                parseInt(groupId),
        performanceParameterId: parseInt(performanceParameterId),
        evaluatedByRoleId:      parseInt(evaluatedByRoleId),
        weightInGroup:          existing ? (existing.weightInGroup || 0) : 0,   // weight set via Configure Weightage
        status:                 status || 'Active'
    };
    try {
        var response = await callCommonAjax({ method: 'POST', url: APP_BASE_URL + API_VERSION + 'teacher-evaluation/parameter/save', body: payload, global: true, showMessage: false });
        if (isEvaluationSuccess(response)) {
            showMessageTheme2(1, response.message || 'Parameter saved successfully.');
            $('#parameterModal').modal('hide');
            await reloadParamGroupsAndParams();
        } else {
            showMessageTheme2(0, (response && response.message) ? response.message : 'Failed to save parameter.');
        }
    } catch (e) { showMessageTheme2(0, 'Failed to save parameter.'); }
}

function openParameterEdit(id) {
    var p = parameterList.find(function (x) { return x.id == id; });
    if (!p) { showMessageTheme2(0, 'Parameter not found.'); return; }
    fillParameterModal(p, false);
}

function openParameterView(id) {
    var p = parameterList.find(function (x) { return x.id == id; });
    if (!p) { showMessageTheme2(0, 'Parameter not found.'); return; }
    fillParameterModal(p, true);
}

function fillParameterModal(p, readOnly) {
    $('#epmId').val(p.id);
    if (readOnly) {
        $('#epmGroupId').html('<option>' + (p.groupName || '') + '</option>').prop('disabled', true);
        $('#epmName').html('<option>' + (p.parameterName || '') + '</option>').prop('disabled', true);
        $('#epmEvaluatedBy').html('<option>' + (p.evaluatedBy || '') + '</option>').prop('disabled', true);
        $('#epmStatus').html('<option>' + (p.status || '') + '</option>').prop('disabled', true);
        $('#epmSaveBtn').hide();
        $('#parameterModalTitle').text('View Parameter');
    } else {
        populateGroupOptions('#epmGroupId'); $('#epmGroupId').prop('disabled', false).val(p.groupId);
        populateParamNameOptions('#epmName'); $('#epmName').prop('disabled', false).val(p.performanceParameterId);
        populateEvaluatorOptions('#epmName', '#epmEvaluatedBy'); $('#epmEvaluatedBy').prop('disabled', false).val(p.evaluatedByRoleId);
        $('#epmStatus').html('<option value="Active">Active</option><option value="Inactive">Inactive</option>').prop('disabled', false).val(p.status || 'Active');
        $('#epmSaveBtn').show();
        $('#parameterModalTitle').text('Edit Parameter');
    }
    refreshCustomFieldState();
    $('#parameterModal').modal('show');
}

function getActiveOptionGroups() {
    return (paramOptions.groups || []).filter(function (g) { return g.status === 'Active'; });
}

function populateGroupOptions(selector) {
    var html = '<option value="">Select Group</option>';
    $.each(getActiveOptionGroups(), function (i, g) {
        html += '<option value="' + g.id + '">' + g.groupName + '</option>';
    });
    $(selector).html(html);
}

function populateParamNameOptions(selector) {
    var html = '<option value="">Select Parameter</option>';
    $.each(paramOptions.parameters || [], function (i, p) {
        html += '<option value="' + p.value + '">' + p.label + '</option>';
    });
    $(selector).html(html);
}

// Always offer every evaluator role, regardless of the chosen parameter
// (roleParameterMappings-based filtering is intentionally not applied for now).
function populateEvaluatorOptions(nameSelector, evalSelector) {
    var roles = paramOptions.evaluatorRoles || [];
    var html = '<option value="">Select Evaluator</option>';
    $.each(roles, function (i, r) {
        html += '<option value="' + r.value + '">' + r.label + '</option>';
    });
    $(evalSelector).html(html);
}

function renderParameterTbody(data) {
    if ($.fn.DataTable.isDataTable('#parameterTable')) {
        $('#parameterTable').DataTable().clear().destroy();
    }
    $('#parameterCount').text(data && data.length ? '(' + data.length + ')' : '');
    var readOnly = paramConfigSelectedPeriodId === 'all' || isSelectedParamPeriodLocked();
    var html = '';
    if (!data || data.length === 0) {
        html = '<tr><td colspan="8" class="text-center text-muted">No parameters found</td></tr>';
    } else {
        $.each(data, function (i, p) {
            var actions = '<div class="d-flex flex-nowrap" style="gap:4px">';
            actions += '<button class="btn btn-outline-secondary btn-sm" onclick="openParameterView(' + p.id + ')" title="View"><i class="fa fa-eye"></i></button>';
            if (!readOnly && p.editable !== false) {
                actions += '<button class="btn btn-primary btn-sm" onclick="openParameterEdit(' + p.id + ')" title="Edit"><i class="fa fa-edit"></i></button>';
            }
            actions += '</div>';
            html += `<tr style="${p.status === 'Inactive' ? 'opacity:.6' : ''}">
                <td>${i + 1}</td>
                <td><span class="badge badge-light border">${p.groupName || 'N/A'}</span></td>
                <td class="font-weight-bold">${p.parameterName || 'N/A'}</td>
                <td><span class="badge badge-info">${p.evaluatedBy || 'N/A'}</span></td>
                <td><strong class="text-primary">${p.weightInGroup != null ? p.weightInGroup + '%' : 'N/A'}</strong></td>
                <td><span class="badge badge-secondary">${p.responses != null ? p.responses : 0}</span></td>
                <td>${getPeriodStatusBadge(p.status)}</td>
                <td class="text-nowrap">${actions}</td>
            </tr>`;
        });
    }
    $('#parameterTbody').html(html);
    if (data && data.length > 0) {
        $('#parameterTable').DataTable({ destroy: true, ordering: false, searching: false, info: false, autoWidth: false });
    }
    renderParamWeightBanner();
}

// ─── Weight validation banner ─────────────────────────────────────────────────

function renderParamWeightBanner() {
    var el = $('#paramWeightBanner');
    var period = getSelectedParamPeriod();
    if (!period || period.status !== 'Active') { el.html(''); return; }

    var groups = (paramGroupList || []).filter(function (g) { return g.status === 'Active'; });
    if (!groups.length) { el.html(''); return; }

    var issues = [];
    var gTotal = groups.reduce(function (a, g) { return a + (g.weight || 0); }, 0);
    if (Math.round(gTotal) !== 100) {
        issues.push('Group weights total <strong>' + gTotal + '%</strong> (need 100%)');
    }
    groups.forEach(function (g) {
        var subs = (parameterList || []).filter(function (p) { return p.groupId === g.id && p.status === 'Active'; });
        if (subs.length) {
            var sTotal = subs.reduce(function (a, p) { return a + (p.weightInGroup || 0); }, 0);
            if (Math.round(sTotal) !== 100) {
                issues.push('<strong>' + g.groupName + '</strong> sub-params total ' + sTotal + '% (need 100%)');
            }
        }
    });

    el.html(issues.length
        ? '<div class="alert alert-warning py-2"><i class="fa fa-exclamation-triangle mr-1"></i>' + issues.join('<br>') + '</div>'
        : '');
}


/* ════════════════════════════════════════════════════════════════════════════
   CONFIGURE WEIGHTAGE  (two-tier: group weights + sub-parameter weights)
   ════════════════════════════════════════════════════════════════════════════ */

async function openWeightageModal() {
    if (paramConfigSelectedPeriodId === 'all' || !paramConfigSelectedPeriodId) { showMessageTheme2(0, 'Select a period.'); return; }
    var period = getSelectedParamPeriod();
    if (period && period.status === 'Draft') { showMessageTheme2(0, 'Weightage is available after the period goes live.'); return; }

    try {
        var response = await callCommonAjax({
            method: 'POST',
            url: APP_BASE_URL + API_VERSION + 'user-rating/weightage/config',
            body: { periodId: paramConfigSelectedPeriodId },
            global: true,
            showMessage: false
        });
        if (!isEvaluationSuccess(response)) {
            showMessageTheme2(0, (response && response.message) ? response.message : 'Failed to load weightage.');
            return;
        }
        var cfg = response.details || {};
        if (!cfg.groups || !cfg.groups.length) {
            showMessageTheme2(0, 'No groups to configure for this period.');
            return;
        }
        wtConfig = cfg;
        seedWtDraftFromConfig(cfg);

        // "Frozen" = period locked OR API says not editable (both come from server)
        var frozen = cfg.locked === true || cfg.editable === false;
        var label = cfg.periodLabel || (period ? getPeriodRangeLabel(period) : '');
        $('#weightageTitle').text((frozen ? 'View' : 'Configure') + ' Weightage — ' + label);
        $('#weightageSaveBtn').toggle(!frozen);
        renderWeightageModal(frozen);
        $('#weightageModal').modal('show');
    } catch (e) {
        showMessageTheme2(0, 'Failed to load weightage.');
    }
}

// Build the draft edit-state from a weightage/config response.
// wtDraft item ids track the server ids that weightage/save expects — group.id === groupId,
// sub.id === evaluationParameterId — so save can round-trip cleanly.
function seedWtDraftFromConfig(cfg) {
    wtDraft = { groups: [], subParams: {} };
    wtLocked = { groups: {}, subs: {} };
    (cfg.groups || []).forEach(function (g) {
        wtDraft.groups.push({ id: g.groupId, name: g.groupName, weight: g.groupWeight || 0 });
        wtDraft.subParams[g.groupId] = (g.parameters || []).map(function (p) {
            return {
                id:     p.evaluationParameterId,
                name:   p.parameterName,
                weight: p.weightInGroup || 0
            };
        });
    });
}

function renderWeightageModal(ro) {
    var h = '<div class="text-muted font-weight-bold mb-2" style="font-size:12px;letter-spacing:.4px">GROUP WEIGHTS</div>';
    var gTotal = wtDraft.groups.reduce(function (a, g) { return a + g.weight; }, 0);
    wtDraft.groups.forEach(function (g) {
        var lk = !!wtLocked.groups[g.id];
        h += '<div class="d-flex align-items-center mb-2" style="gap:10px">';
        h += '<div class="font-weight-bold text-truncate" style="flex:0 0 40%;min-width:0" title="' + g.name + '">' + g.name + '</div>';
        if (!ro) h += '<button type="button" class="btn btn-sm ' + (lk ? 'btn-primary' : 'btn-outline-secondary') + '" style="flex-shrink:0" onclick="toggleWtGroupLock(' + g.id + ')"><i class="fa fa-' + (lk ? 'lock' : 'unlock') + '"></i></button>';
        h += '<input type="number" min="0" max="100" class="form-control form-control-sm text-center" style="width:70px;flex-shrink:0" data-wtg="' + g.id + '" value="' + g.weight + '"' + (ro || lk ? ' disabled' : ' oninput="onGrpWtInput(' + g.id + ',this)" onblur="updateWeightageUI()"') + '>';
        h += '<span class="text-muted" style="flex-shrink:0">%</span>';
        h += '<div class="progress" style="flex:1 1 auto;height:8px;min-width:0"><div class="progress-bar" data-wtg-bar="' + g.id + '" style="width:' + Math.min(g.weight, 100) + '%;background:' + (g.weight > 0 ? '#1a73e8' : '#e0e0e0') + '"></div></div>';
        h += '</div>';
    });
    if (!ro) h += '<div class="text-right mb-2"><button type="button" class="btn btn-outline-primary btn-sm" onclick="distEqualGrp()"><i class="fa fa-balance-scale mr-1"></i>Distribute Equally</button></div>';
    var gOk = Math.round(gTotal) === 100;
    var gCol = gOk ? '#1e8a3c' : gTotal > 100 ? '#d93025' : '#f57c00';
    h += '<div class="d-flex justify-content-between font-weight-bold"><span>Group Total</span><span id="wtGrpTotalVal" style="color:' + gCol + '">' + gTotal + '%' + (gOk ? ' ✓' : '') + '</span></div>';
    h += '<div class="progress mt-1 mb-3" style="height:10px"><div class="progress-bar" id="wtGrpTotalBar" style="width:' + Math.min(gTotal, 100) + '%;background:' + gCol + '"></div></div>';
    h += '<hr>';
    h += '<div class="text-muted font-weight-bold mb-2" style="font-size:12px;letter-spacing:.4px">SUB-PARAMETER WEIGHTS (PER GROUP)</div>';

    var allSubValid = true;
    wtDraft.groups.forEach(function (g, gi) {
        var subs = wtDraft.subParams[g.id] || [];
        var sTotal = subs.reduce(function (a, s) { return a + s.weight; }, 0);
        var sOk = Math.round(sTotal) === 100;
        if (subs.length && !sOk) allSubValid = false;
        var color = paramGroupColors[gi % paramGroupColors.length];
        h += '<div class="border rounded mb-2">';
        h += '<div class="d-flex align-items-center px-3 py-2 bg-light" style="gap:8px"><i class="fa fa-folder" style="color:' + color + '"></i><span class="flex-grow-1 font-weight-bold">' + g.name + '</span><span class="font-weight-bold" data-wts-total="' + g.id + '" style="color:' + (sOk ? '#1e8a3c' : sTotal > 100 ? '#d93025' : '#f57c00') + '">' + sTotal + '%' + (sOk ? ' ✓' : '') + '</span></div>';
        h += '<div class="px-3 py-2">';
        if (!subs.length) h += '<div class="text-center text-muted py-2" style="font-size:12px">No active parameters in this group.</div>';
        subs.forEach(function (s) {
            var slk = !!((wtLocked.subs[g.id] || {})[s.id]);
            h += '<div class="d-flex align-items-center mb-2" style="gap:10px">';
            h += '<div class="text-truncate" style="flex:0 0 40%;min-width:0;font-size:13px" title="' + s.name + '">' + s.name + '</div>';
            if (!ro) h += '<button type="button" class="btn btn-sm ' + (slk ? 'btn-primary' : 'btn-outline-secondary') + '" style="flex-shrink:0" onclick="toggleWtSubLock(' + g.id + ',' + s.id + ')"><i class="fa fa-' + (slk ? 'lock' : 'unlock') + '"></i></button>';
            h += '<input type="number" min="0" max="100" class="form-control form-control-sm text-center" style="width:70px;flex-shrink:0" data-wts="' + g.id + '_' + s.id + '" value="' + s.weight + '"' + (ro || slk ? ' disabled' : ' oninput="onSubWtInput(' + g.id + ',' + s.id + ',this)" onblur="updateWeightageUI()"') + '>';
            h += '<span class="text-muted" style="flex-shrink:0">%</span>';
            h += '<div class="progress" style="flex:1 1 auto;height:6px;min-width:0"><div class="progress-bar" data-wts-bar="' + g.id + '_' + s.id + '" style="width:' + Math.min(s.weight, 100) + '%;background:' + color + '"></div></div>';
            h += '</div>';
        });
        if (!ro && subs.length) h += '<div class="text-right"><button type="button" class="btn btn-link btn-sm p-0" onclick="distEqualSub(' + g.id + ')"><i class="fa fa-balance-scale mr-1"></i>Equal</button></div>';
        h += '</div></div>';
    });

    $('#weightageBody').html(h);
    $('#weightageSaveBtn').prop('disabled', !(gOk && allSubValid));
}

function toggleWtGroupLock(id) { wtLocked.groups[id] = !wtLocked.groups[id]; renderWeightageModal(false); }
function toggleWtSubLock(gid, sid) { if (!wtLocked.subs[gid]) wtLocked.subs[gid] = {}; wtLocked.subs[gid][sid] = !wtLocked.subs[gid][sid]; renderWeightageModal(false); }

function onGrpWtInput(id, el) {
    var nv = Math.max(0, Math.min(100, parseInt(el.value) || 0));
    if (el.value !== '' && parseInt(el.value) !== nv) el.value = nv;
    var item = wtDraft.groups.find(function (g) { return g.id === id; });
    var diff = nv - item.weight; item.weight = nv;
    if (diff !== 0) {
        var adj = wtDraft.groups.filter(function (g) { return g.id !== id && !wtLocked.groups[g.id]; });
        redistributeArr(adj, diff);
    }
    updateWeightageUI(el);
}

function onSubWtInput(gid, sid, el) {
    var nv = Math.max(0, Math.min(100, parseInt(el.value) || 0));
    if (el.value !== '' && parseInt(el.value) !== nv) el.value = nv;
    var subs = wtDraft.subParams[gid];
    var item = subs.find(function (s) { return s.id === sid; });
    var diff = nv - item.weight; item.weight = nv;
    if (diff !== 0) {
        var lks = wtLocked.subs[gid] || {};
        var adj = subs.filter(function (s) { return s.id !== sid && !lks[s.id]; });
        redistributeArr(adj, diff);
    }
    updateWeightageUI(el);
}

// In-place refresh of the weightage modal (values, bars, totals) without rebuilding the
// DOM — a full renderWeightageModal() on each keystroke destroys the focused input.
// activeEl (the input being typed in) is skipped so typing isn't interrupted.
function updateWeightageUI(activeEl) {
    var body = document.getElementById('weightageBody');
    if (!body) return;
    var gTotal = wtDraft.groups.reduce(function (a, g) { return a + g.weight; }, 0);
    var gOk = Math.round(gTotal) === 100;
    var gCol = gOk ? '#1e8a3c' : gTotal > 100 ? '#d93025' : '#f57c00';
    wtDraft.groups.forEach(function (g) {
        var inp = body.querySelector('input[data-wtg="' + g.id + '"]');
        if (inp && inp !== activeEl) inp.value = g.weight;
        var bar = body.querySelector('[data-wtg-bar="' + g.id + '"]');
        if (bar) { bar.style.width = Math.min(g.weight, 100) + '%'; bar.style.background = g.weight > 0 ? '#1a73e8' : '#e0e0e0'; }
    });
    var tv = document.getElementById('wtGrpTotalVal');
    if (tv) { tv.style.color = gCol; tv.innerHTML = gTotal + '%' + (gOk ? ' ✓' : ''); }
    var tb = document.getElementById('wtGrpTotalBar');
    if (tb) { tb.style.width = Math.min(gTotal, 100) + '%'; tb.style.background = gCol; }

    var allSubValid = true;
    wtDraft.groups.forEach(function (g) {
        var subs = wtDraft.subParams[g.id] || [];
        var sTotal = subs.reduce(function (a, s) { return a + s.weight; }, 0);
        var sOk = Math.round(sTotal) === 100;
        if (subs.length && !sOk) allSubValid = false;
        var st = body.querySelector('[data-wts-total="' + g.id + '"]');
        if (st) { st.style.color = sOk ? '#1e8a3c' : sTotal > 100 ? '#d93025' : '#f57c00'; st.innerHTML = sTotal + '%' + (sOk ? ' ✓' : ''); }
        subs.forEach(function (s) {
            var inp = body.querySelector('input[data-wts="' + g.id + '_' + s.id + '"]');
            if (inp && inp !== activeEl) inp.value = s.weight;
            var bar = body.querySelector('[data-wts-bar="' + g.id + '_' + s.id + '"]');
            if (bar) bar.style.width = Math.min(s.weight, 100) + '%';
        });
    });
    $('#weightageSaveBtn').prop('disabled', !(gOk && allSubValid));
}

function redistributeArr(arr, diff) {
    if (!arr.length) return;
    var total = arr.reduce(function (a, x) { return a + x.weight; }, 0), td = -diff;
    for (var i = 0; i < arr.length; i++) {
        var share = total > 0 ? Math.round((arr[i].weight / total) * td) : Math.round(td / arr.length);
        if (i === arr.length - 1) {
            var given = arr.slice(0, i).reduce(function (a, x) { return a + (x._d || 0); }, 0);
            share = td - given;
        }
        arr[i]._d = share;
        arr[i].weight = Math.max(0, Math.min(100, arr[i].weight + share));
    }
    arr.forEach(function (x) { delete x._d; });
}

function distEqualGrp() {
    var ul = wtDraft.groups.filter(function (g) { return !wtLocked.groups[g.id]; });
    var lt = wtDraft.groups.filter(function (g) { return !!wtLocked.groups[g.id]; }).reduce(function (a, g) { return a + g.weight; }, 0);
    var rem = 100 - lt; if (!ul.length) return;
    var each = Math.floor(rem / ul.length), lo = rem - each * ul.length;
    ul.forEach(function (g, i) { g.weight = each + (i < lo ? 1 : 0); });
    renderWeightageModal(false);
}

function distEqualSub(gid) {
    var subs = wtDraft.subParams[gid], lks = wtLocked.subs[gid] || {};
    var ul = subs.filter(function (s) { return !lks[s.id]; });
    var lt = subs.filter(function (s) { return !!lks[s.id]; }).reduce(function (a, s) { return a + s.weight; }, 0);
    var rem = 100 - lt; if (!ul.length) return;
    var each = Math.floor(rem / ul.length), lo = rem - each * ul.length;
    ul.forEach(function (s, i) { s.weight = each + (i < lo ? 1 : 0); });
    renderWeightageModal(false);
}

// Single batched save — one POST for all groups + parameters.
async function saveWeightage() {
    if (paramConfigSelectedPeriodId === 'all' || !paramConfigSelectedPeriodId) { showMessageTheme2(0, 'Select a period.'); return; }
    var payload = {
        userId:   USER_ID,
        periodId: paramConfigSelectedPeriodId,
        groups:   wtDraft.groups.map(function (g) {
            return {
                groupId:     g.id,
                groupWeight: g.weight,
                parameters:  (wtDraft.subParams[g.id] || []).map(function (s) {
                    return { evaluationParameterId: s.id, weightInGroup: s.weight };
                })
            };
        })
    };
    try {
        var response = await callCommonAjax({
            method: 'POST',
            url: APP_BASE_URL + API_VERSION + 'user-rating/weightage/save',
            body: payload,
            global: true,
            showMessage: false
        });
        if (isEvaluationSuccess(response)) {
            var det = response.details || {};
            var msg = det.saveSummary || response.message || 'Weightage saved successfully.';
            showMessageTheme2(1, msg);
            $('#weightageModal').modal('hide');
            // Save returns the fresh config in details.config — keep it cached so the next
            // open reflects the just-saved state without another round-trip.
            if (det.config) wtConfig = det.config;
            await reloadParamGroupsAndParams();
        } else {
            showMessageTheme2(0, (response && response.message) ? response.message : 'Failed to save weightage.');
        }
    } catch (e) {
        showMessageTheme2(0, 'Failed to save weightage.');
    }
}

async function openWeightLog() {
    if (paramConfigSelectedPeriodId === 'all' || !paramConfigSelectedPeriodId) { showMessageTheme2(0, 'Select a period first.'); return; }

    // Show shell immediately so the user sees something while the API resolves
    $('#weightLogCount').text('');
    $('#weightLogBody').html('<div class="text-center text-muted py-5"><i class="fa fa-spinner fa-spin fa-2x d-block mb-2"></i>Loading logs…</div>');
    $('#weightLogModal').modal('show');

    try {
        var response = await callCommonAjax({
            method: 'POST',
            url: APP_BASE_URL + API_VERSION + 'user-rating/weightage/logs',
            body: { periodId: paramConfigSelectedPeriodId },
            global: false,
            showMessage: false
        });
        if (isEvaluationSuccess(response)) {
            renderWeightLogModal(response.details || {});
        } else {
            $('#weightLogBody').html('<div class="text-center text-danger py-4">' + ((response && response.message) || 'Failed to load logs.') + '</div>');
        }
    } catch (e) {
        $('#weightLogBody').html('<div class="text-center text-danger py-4">Failed to load logs.</div>');
    }
}

function renderWeightLogModal(details) {
    var logs = details.logs || [];
    var totalLogs = details.totalLogs != null ? details.totalLogs : logs.length;
    var totalChanges = details.totalChanges != null ? details.totalChanges : 0;
    $('#weightLogCount').text('(' + totalLogs + ' log' + (totalLogs !== 1 ? 's' : '') + ' · ' + totalChanges + ' change' + (totalChanges !== 1 ? 's' : '') + ')');

    if (!logs.length) {
        $('#weightLogBody').html('<div class="text-center text-muted py-5"><i class="fa fa-history fa-2x d-block mb-2"></i>No weight changes yet.</div>');
        return;
    }

    var h = '';
    logs.forEach(function (log, idx) {
        h += '<div class="border-bottom py-3 px-3">';
        // Log header — who / when / how many changes
        h += '<div class="d-flex justify-content-between align-items-center mb-2 flex-wrap" style="gap:8px">' +
                '<div>' +
                    '<span class="badge badge-primary mr-2">#' + (logs.length - idx) + '</span>' +
                    '<span class="font-weight-bold">' + (log.changedByName || 'Unknown') + '</span>' +
                    '<span class="badge badge-light border ml-2">' + (log.changeCount || 0) + ' change' + (log.changeCount !== 1 ? 's' : '') + '</span>' +
                '</div>' +
                '<small class="text-muted"><i class="fa fa-clock-o mr-1"></i>' + (log.changedAt || '') + '</small>' +
            '</div>';

        // Individual changes
        (log.changes || []).forEach(function (c) {
            var isGroup = c.itemType === 'GROUP';
            var typeBadge = isGroup
                ? '<span class="badge badge-info" style="min-width:80px">Group</span>'
                : '<span class="badge badge-secondary" style="min-width:80px">Parameter</span>';
            var name = isGroup
                ? (c.groupName || '—')
                : ((c.parameterName || '—') + ' <small class="text-muted">in ' + (c.groupName || '—') + '</small>');
            var dir = c.changeDirection === 'INCREASED' ? { cls: 'text-success', icon: 'fa-arrow-up' }
                    : c.changeDirection === 'DECREASED' ? { cls: 'text-danger',  icon: 'fa-arrow-down' }
                    : { cls: 'text-muted', icon: 'fa-minus' };
            var deltaTxt = (c.deltaWeight > 0 ? '+' : '') + c.deltaWeight + '%';
            h += '<div class="d-flex align-items-center px-2 py-1 flex-wrap" style="gap:8px;font-size:13px">' +
                    typeBadge +
                    '<span class="flex-grow-1 font-weight-bold" style="min-width:180px">' + name + '</span>' +
                    '<span class="text-danger" style="text-decoration:line-through">' + c.oldWeight + '%</span>' +
                    '<i class="fa fa-long-arrow-right text-muted"></i>' +
                    '<span class="text-success font-weight-bold">' + c.newWeight + '%</span>' +
                    '<span class="' + dir.cls + ' font-weight-bold" style="min-width:60px;text-align:right"><i class="fa ' + dir.icon + ' mr-1"></i>' + deltaTxt + '</span>' +
                '</div>';
        });
        h += '</div>';
    });
    $('#weightLogBody').html(h);
}


/* ════════════════════════════════════════════════════════════════════════════
   GROUP FORMS  (feedback form → parameter group mapping)
   ════════════════════════════════════════════════════════════════════════════ */

var groupFormList = [];
var groupFormOptions = { groups: [], forms: [] };

async function loadGroupFormOptions() {
    try {
        var response = await callCommonAjax({
            method: 'POST',
            url: APP_BASE_URL + API_VERSION + 'teacher-evaluation/group-form/options',
            body: { periodId: paramConfigSelectedPeriodId },
            global: true, showMessage: false
        });
        if (isEvaluationSuccess(response)) {
            var d = response.details || {};
            groupFormOptions = { groups: d.groups || [], forms: d.forms || [] };
        } else {
            groupFormOptions = { groups: [], forms: [] };
        }
    } catch (e) {
        groupFormOptions = { groups: [], forms: [] };
    }
}

function applyGroupFormSearch() {
    loadGroupForms($('#groupFormSearch').val() || '');
}

async function loadGroupForms(search) {
    try {
        var response = await callCommonAjax({
            method: 'POST',
            url: APP_BASE_URL + API_VERSION + 'teacher-evaluation/group-form/list',
            body: { periodId: paramConfigSelectedPeriodId, search: search || '' },
            global: true, showMessage: false
        });
        if (isEvaluationSuccess(response)) {
            groupFormList = response.details || [];
            renderGroupFormTbody(groupFormList);
        } else {
            showMessageTheme2(0, (response && response.message) ? response.message : 'Failed to load group forms.');
            renderGroupFormTbody([]);
        }
    } catch (e) {
        showMessageTheme2(0, 'Failed to load group forms.');
        renderGroupFormTbody([]);
    }
}

async function loadAllGroupForms() {
    var all = [];
    for (var i = 0; i < paramConfigPeriods.length; i++) {
        try {
            var r = await callCommonAjax({
                method: 'POST',
                url: APP_BASE_URL + API_VERSION + 'teacher-evaluation/group-form/list',
                body: { periodId: paramConfigPeriods[i].id, search: '' },
                global: true, showMessage: false
            });
            if (isEvaluationSuccess(r)) all = all.concat(r.details || []);
        } catch (e) { /* ignore one period's failure */ }
    }
    return all;
}

function renderGroupFormTbody(data) {
    if ($.fn.DataTable.isDataTable('#groupFormTable')) {
        $('#groupFormTable').DataTable().clear().destroy();
    }
    $('#groupFormCount').text(data && data.length ? '(' + data.length + ')' : '');
    var readOnly = paramConfigSelectedPeriodId === 'all' || isSelectedParamPeriodLocked();
    var html = '';
    if (!data || data.length === 0) {
        html = '<tr><td colspan="9" class="text-center text-muted">No forms mapped yet.</td></tr>';
    } else {
        $.each(data, function (i, m) {
            var action = (!readOnly && m.editable !== false)
                ? '<button class="btn btn-primary btn-sm" onclick="openGroupFormEdit(' + m.id + ')" title="Edit"><i class="fa fa-edit"></i></button>'
                : '';
            html += `<tr style="${m.status === 'Inactive' ? 'opacity:.6' : ''}">
                <td>${i + 1}</td>
                <td><span class="badge badge-light border">${m.groupName || 'N/A'}</span></td>
                <td class="font-weight-bold">${m.formLabel || 'N/A'}</td>
                <td><code>${m.formCode || ''}</code></td>
                <td><span class="badge badge-info">${m.feedbackType || 'N/A'}</span></td>
                <td>${m.feedbackViewType || 'N/A'}</td>
                <td><small class="text-muted">${m.mappedEvents || '—'}</small></td>
                <td>${getPeriodStatusBadge(m.status)}</td>
                <td class="text-nowrap">${action}</td>
            </tr>`;
        });
    }
    $('#groupFormTbody').html(html);
    if (data && data.length > 0) {
        $('#groupFormTable').DataTable({ destroy: true, ordering: false, searching: false, info: false, autoWidth: false });
    }
}

function populateGroupFormGroupOptions(selected) {
    var html = '<option value="">Select Group</option>';
    $.each(groupFormOptions.groups || [], function (i, g) {
        if (g.status !== 'Active') return;
        html += '<option value="' + g.id + '">' + g.groupName + '</option>';
    });
    $('#gfmGroupId').html(html).val(selected || '');
}

function populateGroupFormFormOptions(selected) {
    var html = '<option value="">Select Form</option>';
    $.each(groupFormOptions.forms || [], function (i, f) {
        html += '<option value="' + f.id + '">' + (f.label || f.code) + ' (' + (f.code || '') + ')</option>';
    });
    $('#gfmFormId').html(html).val(selected || '');
}

function renderGroupFormPreview() {
    var id = $('#gfmFormId').val();
    if (!id) { $('#gfmFormPreview').html(''); return; }
    var f = (groupFormOptions.forms || []).find(function (x) { return x.id == id; });
    if (!f) { $('#gfmFormPreview').html(''); return; }
    var rows = [
        ['Feedback Type', f.feedbackType || '—'],
        ['View Type', f.feedbackViewType || '—'],
        ['Roles', f.roles || '—'],
        ['Mapped Events', f.mappedEvents || '—']
    ];
    var h = '<div class="border rounded p-2 bg-light"><div class="small font-weight-bold text-muted mb-1">FORM DETAILS</div>';
    rows.forEach(function (r) {
        h += '<div class="d-flex justify-content-between" style="font-size:12px"><span class="text-muted">' + r[0] + '</span><span class="font-weight-bold">' + r[1] + '</span></div>';
    });
    h += '</div>';
    $('#gfmFormPreview').html(h);
}

async function openGroupFormAdd() {
    if (paramConfigSelectedPeriodId === 'all' || !paramConfigSelectedPeriodId) { showMessageTheme2(0, 'Select a period.'); return; }
    await loadGroupFormOptions();
    if (!(groupFormOptions.groups || []).some(function (g) { return g.status === 'Active'; })) {
        showMessageTheme2(0, 'Add an active group first.'); return;
    }
    $('#gfmId').val('');
    populateGroupFormGroupOptions('');
    populateGroupFormFormOptions('');
    $('#gfmStatus').val('Active');
    $('#gfmFormPreview').html('');
    $('#groupFormModalTitle').text('Add Form to Group');
    $('#gfmSaveBtn').text('Save');
    refreshCustomFieldState();
    $('#groupFormModal').modal('show');
}

async function openGroupFormEdit(id) {
    await loadGroupFormOptions();
    var m = groupFormList.find(function (x) { return x.id == id; });
    if (!m) { showMessageTheme2(0, 'Mapping not found.'); return; }
    $('#gfmId').val(m.id);
    populateGroupFormGroupOptions(m.groupId);
    populateGroupFormFormOptions(m.feedbackFormId);
    $('#gfmStatus').val(m.status || 'Active');
    renderGroupFormPreview();
    $('#groupFormModalTitle').text('Edit Group Form');
    $('#gfmSaveBtn').text('Save Changes');
    refreshCustomFieldState();
    $('#groupFormModal').modal('show');
}

async function saveGroupForm() {
    var id     = $('#gfmId').val();
    var gid    = $('#gfmGroupId').val();
    var fid    = $('#gfmFormId').val();
    var status = $('#gfmStatus').val();
    if (!gid) { showMessageTheme2(0, 'Parameter group is required.'); return; }
    if (!fid) { showMessageTheme2(0, 'Feedback form is required.'); return; }

    var payload = {
        id:             id ? parseInt(id) : null,
        userId:         USER_ID,
        periodId:       paramConfigSelectedPeriodId,
        groupId:        parseInt(gid),
        feedbackFormId: parseInt(fid),
        status:         status || 'Active'
    };
    try {
        var response = await callCommonAjax({
            method: 'POST',
            url: APP_BASE_URL + API_VERSION + 'teacher-evaluation/group-form/save',
            body: payload, global: true, showMessage: false
        });
        if (isEvaluationSuccess(response)) {
            showMessageTheme2(1, response.message || 'Group form mapping saved successfully.');
            $('#groupFormModal').modal('hide');
            await loadGroupForms($('#groupFormSearch').val() || '');
        } else {
            showMessageTheme2(0, (response && response.message) ? response.message : 'Failed to save group form mapping.');
        }
    } catch (e) {
        showMessageTheme2(0, 'Failed to save group form mapping.');
    }
}
