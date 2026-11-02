/*
 * certificateManagement.js
 * Logic for the Certificates admin module (templates, issuance, issued list).
 * Markup + render helpers live in certificateManagementContent.js.
 * Shared: callCommonAjax / showMessageTheme2 / customLoader, globals
 * SCHOOL_ID / USER_ID / APP_BASE_URL / API_VERSION.
 */

var cfmState = {
    tab: 'templates',
    templates: [],
    issued: [],
    issuedSearch: '',
    issuedStatus: '',
    templateSearch: '',
    bulk: false,
    source: null,        // {entityType, entityId, title}: the activity whose attendees are being issued to
    attendance: null,    // attendees of the activity open in the picker
    attendanceReq: 0,    // newest attendees request (older answers are ignored)
    grades: null,        // grades with enrolled students, for the student filters
    plans: null,         // learning plans with enrolled students, for the Add students filter
    singleStudent: null, // enrolled student a single certificate is issued to
    singleAuto: {},      // values filled in from that student, by field key (cleared again if left unchanged)
    singleMatches: [],   // students listed under the single-recipient search
    singleReq: 0,
    students: [],        // students listed in the Add students picker
    studentPicks: {},    // 'u' + account id -> student ticked in the picker (kept across searches)
    studentsMore: false, // more students matched than were listed
    studentReq: 0,
    requests: [],        // requests listed on the Requests tab
    requestSearch: '',
    approving: null,     // request open in the approve / reject modal
    requestTypes: []
};

var cfmTimers = {};

/* run fn once typing pauses */
function cfmDebounce(name, fn, ms) {
    clearTimeout(cfmTimers[name]);
    cfmTimers[name] = setTimeout(fn, ms || 300);
}

function cfmApiBase() {
    return cfmNormalizeUrl(APP_BASE_URL + API_VERSION + 'certificate/');
}

/* collapse accidental double slashes while preserving the protocol "://" */
function cfmNormalizeUrl(u) {
    var i = (u || '').indexOf('://');
    if (i < 0) { return (u || '').replace(/\/{2,}/g, '/'); }
    return u.substring(0, i + 3) + u.substring(i + 3).replace(/\/{2,}/g, '/');
}

function cfmIsSuccess(response) {
    return response && (response.status === 'SUCCESS' || response.statusCode === '200');
}

function cfmEscape(s) {
    if (s === null || s === undefined) { return ''; }
    return String(s).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
}

/* bootstrap confirm/prompt modal. Resolves { choice: 'ok' | 'alt', value } or null when dismissed.
   o: { title, message, okText, cancelText, altText, tone: 'primary' | 'danger', size: 'sm' | 'md', icon, input: { label, placeholder, maxLength, required, multiline } } */
function cfmDialog(o) {
    return new Promise(function (resolve) {
        if ($('#cfmDialog').length) { safeRemoveModal('#cfmDialog'); }
        $('body').append(cfmDialogHtml(o));
        var $m = $('#cfmDialog');
        var $input = $m.find('#cfmDialogInput');
        var result = null;
        function choose(choice) {
            var value = $input.length ? ($input.val() || '').trim() : undefined;
            if (choice === 'ok' && o.input && o.input.required && !value) {
                $input.addClass('is-invalid').trigger('focus');
                return;
            }
            result = { choice: choice, value: value };
            $m.modal('hide');
        }
        $m.on('click', '[data-cfm-choice]', function () { choose($(this).attr('data-cfm-choice')); });
        $input.on('input', function () { $input.removeClass('is-invalid'); });
        $input.filter('input').on('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); choose('ok'); } });
        $m.on('shown.bs.modal', function () {
            ($input.length ? $input : $m.find('[data-cfm-choice="ok"]')).trigger('focus');
        });
        $m.on('hidden.bs.modal', function () {
            $m.remove();
            syncModalBodyState();
            resolve(result);
        });
        $m.modal('show');
    });
}

function cfmFormatDate(d) {
    if (!d) { return ''; }
    var dt = new Date(d);
    if (isNaN(dt.getTime())) { return ''; }
    return dt.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
}

/* POST to the certificate API with school/user context */
function cfmPost(path, body, withLoader) {
    if (withLoader !== false) { customLoader(true); }
    return callCommonAjax({
        method: 'POST',
        url: cfmApiBase() + path,
        body: $.extend({ schoolId: SCHOOL_ID, userId: USER_ID }, body || {}),
        global: withLoader !== false,
        showMessage: false
    }).then(function (response) {
        if (withLoader !== false) { customLoader(false); }
        return response;
    }, function (err) {
        if (withLoader !== false) { customLoader(false); }
        throw err;
    });
}

function cfmMutate(path, body, okMessage) {
    return cfmPost(path, body, true).then(function (response) {
        if (cfmIsSuccess(response)) {
            if (okMessage) { showMessageTheme2(1, okMessage); }
            return response;
        }
        showMessageTheme2(0, (response && response.message) ? response.message : 'Something went wrong. Please try again.');
        return null;
    }, function () {
        showMessageTheme2(0, 'Something went wrong. Please try again.');
        return null;
    });
}

function certificateManagementOnLoad() {
    if ($('#cfmTemplateModal').length === 0) {
        $('body').append(cfmTemplateModalHtml());
    }
    if ($('#cfmActivityModal').length === 0) {
        $('body').append(cfmActivityModalHtml());
    }
    if ($('#cfmStudentModal').length === 0) {
        $('body').append(cfmStudentModalHtml());
    }
    if ($('#cfmApproveModal').length === 0) {
        $('body').append(cfmApproveModalHtml() + cfmRejectModalHtml() + cfmTypesModalHtml());
    }
    cfmState.tab = 'templates';
    cfmState.bulk = false;
    cfmState.source = null;
    cfmState.singleStudent = null;

    $('#cfmTemplateSearch').off('input').on('input', function () {
        cfmState.templateSearch = (this.value || '').trim().toLowerCase();
        cfmRenderTemplates();
    });
    $('#cfmIssuedSearch').off('input').on('input', function () {
        cfmState.issuedSearch = (this.value || '').trim().toLowerCase();
        cfmRenderIssued();
    });
    $('#cfmIssuedStatus').off('change').on('change', function () {
        cfmState.issuedStatus = this.value || '';
        cfmRenderIssued();
    });
    $('#cfmSheetFile').off('change').on('change', function () {
        if (this.files && this.files[0]) { cfmUploadSheet(this.files[0]); }
    });
    $('#cfmSingleSearch').off('input keydown focus')
        .on('input', function () { cfmDebounce('single', cfmSingleSearchNow); })
        .on('focus', function () { if ($('#cfmSingleResults').children().length) { cfmShowSuggest(null); } })
        .on('keydown', function (e) {
            if (e.key === 'ArrowDown') { e.preventDefault(); $('#cfmSingleResults .cfm-suggest-item').first().focus(); }
            if (e.key === 'Escape') { cfmCloseSuggest(); }
        });
    $('#cfmSingleResults').off('keydown').on('keydown', '.cfm-suggest-item', function (e) {
        if (e.key === 'ArrowDown') { e.preventDefault(); $(this).next('.cfm-suggest-item').focus(); }
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            var prev = $(this).prev('.cfm-suggest-item');
            (prev.length ? prev : $('#cfmSingleSearch')).focus();
        }
        if (e.key === 'Escape') { $('#cfmSingleSearch').focus(); cfmCloseSuggest(); }
    });
    $(document).off('click.cfmSuggest').on('click.cfmSuggest', function (e) {
        if (!$(e.target).closest('.cfm-finder-box').length) { cfmCloseSuggest(); }
    });
    $('#cfmStudentSearch').off('input').on('input', function () { cfmDebounce('students', cfmSearchStudents); });
    $('#cfmRequestSearch').off('input').on('input', function () {
        cfmState.requestSearch = (this.value || '').trim().toLowerCase();
        cfmRenderRequests();
    });

    cfmLoadTemplates();
    cfmLoadPendingCount();
}

function cfmSwitchTab(tab) {
    cfmState.tab = tab;
    $('.cfm-tab').removeClass('active');
    $('.cfm-tab[data-tab="' + tab + '"]').addClass('active');
    $('.cfm-view').removeClass('active');
    $('#cfmView-' + tab).addClass('active');
    if (tab === 'issue') { cfmPopulateIssueTemplates(); }
    if (tab === 'issued') { cfmLoadIssued(); }
    if (tab === 'requests') { cfmLoadRequests(); }
}

/* ---- Templates ---- */

function cfmLoadTemplates() {
    cfmPost('templates/list', {}).then(function (response) {
        cfmState.templates = cfmIsSuccess(response) ? (response.details || []) : [];
        cfmRenderTemplates();
        if (!cfmIsSuccess(response)) {
            showMessageTheme2(0, (response && response.message) ? response.message : 'Failed to load templates.');
        }
    }, function () {
        cfmState.templates = [];
        cfmRenderTemplates();
        showMessageTheme2(0, 'Failed to load templates.');
    });
}

function cfmRenderTemplates() {
    var search = cfmState.templateSearch;
    var list = cfmState.templates.filter(function (t) {
        if (!search) { return true; }
        return (t.templateName && t.templateName.toLowerCase().indexOf(search) >= 0)
            || (t.templateKey && t.templateKey.toLowerCase().indexOf(search) >= 0);
    });
    if (!list.length) {
        $('#cfmTemplateGrid').html('<div class="cfm-empty">No templates yet. Create your first one.</div>');
        return;
    }
    $('#cfmTemplateGrid').html(list.map(cfmTemplateCardHtml).join(''));
}

/* visual templates open in the drag-and-drop editor, hand-written ones in the HTML modal */
function cfmEditTemplate(id) {
    var t = cfmState.templates.filter(function (x) { return x.id === id; })[0];
    if (t && t.editorType === 'VISUAL' && t.layoutJson && typeof cfeOpen === 'function') {
        cfeOpen(t);
    } else {
        cfmOpenTemplateModal(id);
    }
}

function cfmOpenTemplateModal(id) {
    var t = id ? cfmState.templates.filter(function (x) { return x.id === id; })[0] : null;
    $('#cfmTemplateModalTitle').text(t ? 'Edit template' : 'New template');
    $('#cfmTemplateId').val(t ? t.id : '');
    $('#cfmTemplateName').val(t ? (t.templateName || '') : '');
    $('#cfmTemplateCategoryBox').html(cfmCategorySelectHtml('cfmTemplateCategory', t ? (t.category || '') : ''));
    $('#cfmTemplateFormat').val(t ? (t.pageFormat || 'A4') : 'A4');
    $('#cfmTemplateOrientation').val(t ? (t.orientation || 'Landscape') : 'Landscape');
    $('#cfmTemplateStatus').val(t ? (t.status || 'Active') : 'Active');
    $('#cfmTemplateHtml').val(t ? (t.templateHtml || '') : '');
    $('#cfmTemplateModal').modal('show');
}

function cfmSaveTemplate() {
    var name = ($('#cfmTemplateName').val() || '').trim();
    var html = ($('#cfmTemplateHtml').val() || '').trim();
    if (!name) { showMessageTheme2(0, 'Please enter a template name.'); return; }
    if (!html) { showMessageTheme2(0, 'Please provide the template content.'); return; }
    var idVal = $('#cfmTemplateId').val();
    var body = {
        templateId: idVal ? parseInt(idVal, 10) : null,
        templateName: name,
        category: cfmReadCategory('cfmTemplateCategory'),
        pageFormat: $('#cfmTemplateFormat').val(),
        orientation: $('#cfmTemplateOrientation').val(),
        templateStatus: $('#cfmTemplateStatus').val(),
        templateHtml: html
    };
    cfmMutate('templates/save', body, 'Template saved successfully').then(function (response) {
        if (response) {
            $('#cfmTemplateModal').modal('hide');
            cfmLoadTemplates();
        }
    });
}

function cfmToggleTemplateStatus(id, nextStatus) {
    cfmMutate('templates/status', { templateId: id, templateStatus: nextStatus }, 'Template status updated')
        .then(function (response) { if (response) { cfmLoadTemplates(); } });
}

function cfmDeleteTemplate(id) {
    cfmDialog({
        title: 'Delete template', tone: 'danger', icon: 'fa-trash-o', okText: 'Delete', size: 'sm',
        message: 'Are you sure you want to delete this template? Certificates already issued from it are not affected.'
    }).then(function (r) {
        if (!r) { return; }
        cfmMutate('templates/delete', { templateId: id }, 'Template deleted successfully')
            .then(function (response) { if (response) { cfmLoadTemplates(); } });
    });
}

/* ---- Issue ---- */

function cfmIssueTemplate() {
    var id = parseInt($('#cfmIssueTemplate').val(), 10);
    return cfmState.templates.filter(function (t) { return t.id === id; })[0] || null;
}

/* custom fields of the chosen template (e.g. Position); the server lists them per template */
function cfmIssueFields() {
    var t = cfmIssueTemplate();
    return t && t.customFields ? t.customFields : [];
}

function cfmPopulateIssueTemplates() {
    var current = $('#cfmIssueTemplate').val();
    var active = cfmState.templates.filter(function (t) { return t.status !== 'Inactive'; });
    var opts = '<option value="">Select a template…</option>'
        + active.map(function (t) { return '<option value="' + t.id + '">' + cfmEscape(t.templateName) + '</option>'; }).join('');
    $('#cfmIssueTemplate').html(opts);
    if (current && active.some(function (t) { return String(t.id) === current; })) {
        $('#cfmIssueTemplate').val(current);
    }
    if (!$('#cfmIssueDate').val()) {
        $('#cfmIssueDate').val(new Date().toISOString().slice(0, 10));
    }
    cfmRenderIssueDetails();
    cfmLoadGrades();
}

function cfmOnTemplateChange() {
    $('#cfmSheetSummary').empty();
    // a student document (e.g. Character Certificate) names itself when no activity type was typed
    var t = cfmIssueTemplate(), type = t && t.category ? cfmTemplateType(t.category) : null;
    if (type && !($('#cfmActivityType').val() || '').trim()) { $('#cfmActivityType').val(type.label); }
    cfmRenderIssueDetails();
}

/* redraw the custom field inputs and recipient rows for the chosen template, keeping what was typed */
function cfmRenderIssueDetails() {
    $('#cfmCustomShared').html(cfmCustomInputsHtml(cfmIssueFields(), cfmState.bulk, cfmCollectShared()));
    if (!cfmState.bulk) { cfmApplySingleAuto(); }
    cfmRenderRecipientRows(cfmCollectRows());
}

/* a template with {{grade}} / {{academicYear}}: put the picked student's values in those (empty) inputs */
function cfmApplySingleAuto() {
    Object.keys(CFM_ENROLMENT_FIELDS).forEach(function (key) {
        var $input = $('#cfmCustomShared .cfm-custom-shared[data-key="' + key + '"]');
        var value = cfmState.singleStudent ? (cfmState.singleStudent[CFM_ENROLMENT_FIELDS[key]] || '') : '';
        if ($input.length && value && !($input.val() || '').trim()) {
            $input.val(value).removeClass('cfm-missing');
            cfmState.singleAuto[key] = value;
        }
    });
}

/* empties the inputs still holding what was filled in from the previous student */
function cfmClearSingleAuto() {
    Object.keys(cfmState.singleAuto).forEach(function (key) {
        var $input = $('#cfmCustomShared .cfm-custom-shared[data-key="' + key + '"]');
        if ($input.val() === cfmState.singleAuto[key]) { $input.val(''); }
    });
    cfmState.singleAuto = {};
}

function cfmRenderRecipientRows(rows) {
    var fields = cfmIssueFields();
    $('#cfmRecipientRows').html(rows.length
        ? rows.map(function (r) { return cfmRecipientRowHtml(fields, r); }).join('')
        : '<div class="cfm-rec-empty">No recipients yet. Add students by grade or name, add an activity\'s attendees, or upload a sheet.</div>');
    cfmUpdateRecipientCount();
}

function cfmUpdateRecipientCount() {
    var n = $('#cfmRecipientRows .cfm-recipient-row').length;
    $('#cfmRecipientCount').text(n);
    $('#cfmClearRecipients').toggle(n > 0);
    $('#cfmIssueBtn').html('<i class="fa fa-paper-plane-o mr-1"></i> '
        + (cfmState.bulk && n > 1 ? 'Issue ' + n + ' certificates' : 'Issue certificate'));
}

function cfmCollectShared() {
    var values = {};
    $('#cfmCustomShared .cfm-custom-shared').each(function () {
        var v = ($(this).val() || '').trim();
        if (v) { values[$(this).attr('data-key')] = v; }
    });
    return values;
}

function cfmCollectRows() {
    var rows = [];
    $('#cfmRecipientRows .cfm-recipient-row').each(function () {
        var values = {};
        $(this).find('.cfm-recipient-custom').each(function () {
            var v = ($(this).val() || '').trim();
            if (v) { values[$(this).attr('data-key')] = v; }
        });
        var loginId = parseInt($(this).attr('data-login-id'), 10);
        rows.push({
            recipientName: ($(this).find('.cfm-recipient-name').val() || '').trim(),
            recipientEmail: ($(this).find('.cfm-recipient-email').val() || '').trim(),
            recipientLoginId: loginId > 0 ? loginId : null,
            grade: $(this).attr('data-grade') || null,
            contentOverrides: values
        });
    });
    return rows;
}

function cfmSetIssueMode(bulk) {
    cfmState.bulk = !!bulk;
    $('.cfm-seg button').each(function () {
        var on = ($(this).attr('data-mode') === 'bulk') === cfmState.bulk;
        $(this).toggleClass('active', on).attr('aria-pressed', on ? 'true' : 'false');
    });
    $('#cfmSingleBlock').toggle(!cfmState.bulk);
    $('#cfmBulkBlock').toggle(cfmState.bulk);
    cfmCloseSuggest();
    cfmRenderIssueDetails();
}

function cfmAddRecipientRow() {
    $('#cfmRecipientRows .cfm-rec-empty').remove();
    $('#cfmRecipientRows').append(cfmRecipientRowHtml(cfmIssueFields()));
    $('#cfmRecipientRows .cfm-recipient-name').last().focus();
    cfmUpdateRecipientCount();
}

function cfmRemoveRecipientRow(btn) {
    $(btn).closest('.cfm-recipient-row').remove();
    if (!$('#cfmRecipientRows .cfm-recipient-row').length) { cfmRenderRecipientRows([]); }
    cfmUpdateRecipientCount();
}

function cfmClearRecipients() {
    var n = $('#cfmRecipientRows .cfm-recipient-row').length;
    var clear = function () {
        cfmRenderRecipientRows([]);
        $('#cfmSheetSummary').empty();
        cfmClearSource();
    };
    if (!n) { clear(); return; }
    cfmDialog({
        title: 'Remove all recipients', tone: 'danger', icon: 'fa-user-times', okText: 'Remove all', size: 'sm',
        message: 'Remove all ' + n + ' recipient(s) from the list?'
    }).then(function (r) { if (r) { clear(); } });
}

/* add people to the recipients, skipping anyone already there (same account, or same name when there is no account) */
function cfmMergeRecipients(existing, added) {
    var key = function (r) { return r.recipientLoginId ? 'u' + r.recipientLoginId : 'n' + (r.recipientName || '').toLowerCase(); };
    var seen = {};
    existing.forEach(function (r) { seen[key(r)] = 1; });
    return existing.concat(added.filter(function (r) {
        var k = key(r);
        if (seen[k]) { return false; }
        seen[k] = 1;
        return true;
    }));
}

/* ---- enrolled students (grade / name filters) ---- */

function cfmLoadGrades() {
    var fill = function () {
        $('.cfm-grade-select').each(function () {
            var current = $(this).val();
            $(this).html(cfmGradeOptionsHtml(cfmState.grades, 'All grades'));
            if (current) { $(this).val(current); }
        });
    };
    if (cfmState.grades) { fill(); return; }
    cfmPost('students/grades', {}, false).then(function (response) {
        if (!cfmIsSuccess(response)) {
            $('.cfm-grade-select').html('<option value="">All grades</option>');
            return;
        }
        cfmState.grades = response.details || [];
        fill();
    }, function () {
        $('.cfm-grade-select').html('<option value="">All grades</option>');
    });
}

function cfmLoadPlans() {
    var fill = function () {
        var current = $('#cfmStudentPlan').val();
        $('#cfmStudentPlan').html('<option value="">All learning plans</option>' + (cfmState.plans || []).map(function (p) {
            return '<option value="' + cfmEscape(p.key) + '">' + cfmEscape(p.name) + ' (' + p.students + ')</option>';
        }).join(''));
        if (current) { $('#cfmStudentPlan').val(current); }
    };
    if (cfmState.plans) { fill(); return; }
    cfmPost('students/learning-plans', {}, false).then(function (response) {
        cfmState.plans = cfmIsSuccess(response) ? (response.details || []) : [];
        fill();
    }, function () {});
}

/* students of a grade (0 = any) / learning plan ('' = any) and/or matching text; resolves to {students, more} or a message string */
function cfmFetchStudents(grade, text, plan) {
    return cfmPost('students/search', { standardId: grade || null, learningPlan: plan || '', search: text }, false).then(function (response) {
        if (!cfmIsSuccess(response)) { return (response && response.message) || 'Could not load the students.'; }
        return response.details || { students: [] };
    }, function () { return 'Could not load the students.'; });
}

/* html = null reopens the current list */
function cfmShowSuggest(html) {
    var box = $('#cfmSingleResults');
    if (html !== null) { box.html(html || ''); }
    var open = box.children().length > 0;
    box.toggleClass('open', open);
    $('#cfmSingleSearch').attr('aria-expanded', open ? 'true' : 'false');
}

function cfmCloseSuggest() {
    $('#cfmSingleResults').removeClass('open');
    $('#cfmSingleSearch').attr('aria-expanded', 'false');
}

function cfmSingleSearchNow() {
    clearTimeout(cfmTimers.single);
    var text = ($('#cfmSingleSearch').val() || '').trim();
    var grade = parseInt($('#cfmSingleGrade').val(), 10) || 0;
    var req = ++cfmState.singleReq;
    cfmState.singleMatches = [];
    if (!grade && text.length < 2) { cfmShowSuggest(''); return; }
    cfmShowSuggest('<div class="cfm-suggest-note">Searching…</div>');
    cfmFetchStudents(grade, text).then(function (d) {
        if (req !== cfmState.singleReq) { return; }
        if (typeof d === 'string') { cfmShowSuggest('<div class="cfm-suggest-note">' + cfmEscape(d) + '</div>'); return; }
        cfmState.singleMatches = d.students || [];
        var shown = cfmState.singleMatches.slice(0, 50);
        var more = d.more || cfmState.singleMatches.length > shown.length;
        cfmShowSuggest(shown.length
            ? shown.map(cfmSuggestItemHtml).join('') + (more ? '<div class="cfm-suggest-note">More students match: type more of the name.</div>' : '')
            : '<div class="cfm-suggest-note">No enrolled student matches.</div>');
    });
}

function cfmPickSingleStudent(index) {
    var st = cfmState.singleMatches[index];
    if (!st) { return; }
    cfmState.singleStudent = st;
    $('#cfmRecipientName').val(st.recipientName).prop('readonly', true).removeClass('cfm-missing');
    $('#cfmRecipientEmail').val(st.recipientEmail || '');
    $('#cfmSinglePicked').html(cfmSinglePickedHtml(st));
    $('#cfmSingleSearch').val('');
    cfmShowSuggest('');
    cfmClearSingleAuto();
    cfmApplySingleAuto();
}

function cfmClearSingleStudent() {
    cfmClearSingleAuto();
    cfmState.singleStudent = null;
    $('#cfmRecipientName').val('').prop('readonly', false);
    $('#cfmRecipientEmail').val('');
    $('#cfmSinglePicked').empty();
    $('#cfmSingleSearch').focus();
}

function cfmOpenStudentPicker() {
    cfmState.students = [];
    cfmState.studentPicks = {};
    $('#cfmStudentSearch').val('');
    $('#cfmStudentSummary').text('Only currently enrolled students are listed.');
    $('#cfmStudentList').html('<div class="cfm-empty">Choose a grade or learning plan, or type a name.</div>');
    cfmUpdateStudentButton();
    $('#cfmStudentModal').modal('show');
    cfmLoadGrades();
    cfmLoadPlans();
}

function cfmSearchStudents() {
    clearTimeout(cfmTimers.students);
    var text = ($('#cfmStudentSearch').val() || '').trim();
    var grade = parseInt($('#cfmStudentGrade').val(), 10) || 0;
    var plan = $('#cfmStudentPlan').val() || '';
    var req = ++cfmState.studentReq;
    cfmState.students = [];
    cfmState.studentsMore = false;
    if (!grade && !plan && text.length < 2) {
        $('#cfmStudentList').html('<div class="cfm-empty">Choose a grade or learning plan, or type at least 2 letters of a name.</div>');
        cfmUpdateStudentButton();
        return;
    }
    $('#cfmStudentList').html('<div class="cfm-empty">Loading students…</div>');
    cfmFetchStudents(grade, text, plan).then(function (d) {
        if (req !== cfmState.studentReq) { return; }
        if (typeof d === 'string') { $('#cfmStudentList').html('<div class="cfm-empty">' + cfmEscape(d) + '</div>'); return; }
        cfmState.students = d.students || [];
        cfmState.studentsMore = !!d.more;
        cfmRenderStudents();
    });
}

function cfmRenderStudents() {
    var inList = {};
    cfmCollectRows().forEach(function (r) { if (r.recipientLoginId) { inList[r.recipientLoginId] = 1; } });
    var picks = {};
    Object.keys(cfmState.studentPicks).forEach(function (k) { picks[cfmState.studentPicks[k].recipientLoginId] = 1; });
    $('#cfmStudentList').html(cfmStudentTableHtml(cfmState.students, picks, inList));
    cfmUpdateStudentButton();
}

function cfmOnStudentPick(box) {
    var st = cfmState.students[parseInt($(box).attr('data-index'), 10)];
    if (!st) { return; }
    if (box.checked) { cfmState.studentPicks['u' + st.recipientLoginId] = st; } else { delete cfmState.studentPicks['u' + st.recipientLoginId]; }
    $(box).closest('tr').toggleClass('cfm-att-off', !box.checked);
    cfmUpdateStudentButton();
}

function cfmPickAllStudents(on) {
    $('#cfmStudentList .cfm-stu-pick:not(:disabled)').each(function () {
        this.checked = on;
        cfmOnStudentPick(this);
    });
}

function cfmUpdateStudentButton() {
    var n = Object.keys(cfmState.studentPicks).length;
    var boxes = $('#cfmStudentList .cfm-stu-pick:not(:disabled)');
    $('#cfmStuAll').prop('checked', boxes.length > 0 && boxes.filter(':checked').length === boxes.length);
    $('#cfmAddStudentsBtn').prop('disabled', n === 0).text(n ? 'Add ' + n + ' to recipients' : 'Add to recipients');
    var shown = cfmState.students.length;
    if (shown || n) {
        var grade = $('#cfmStudentGrade option:selected').text().replace(/\s*\(\d+\)$/, '');
        var plan = $('#cfmStudentPlan').val() ? $('#cfmStudentPlan option:selected').text().replace(/\s*\(\d+\)$/, '') : '';
        $('#cfmStudentSummary').text(shown + ' student(s) found' + ($('#cfmStudentGrade').val() ? ' in ' + grade : '')
            + (plan ? (($('#cfmStudentGrade').val() ? ', ' : ' in ') + plan) : '')
            + (cfmState.studentsMore ? ' (showing the first ' + shown + ': narrow the search)' : '')
            + (n ? ' · ' + n + ' selected' : ''));
    }
}

/* {grade, academicYear} of a picked student, for a recipient row */
function cfmEnrolmentValues(st) {
    var values = {};
    Object.keys(CFM_ENROLMENT_FIELDS).forEach(function (key) {
        if (st[CFM_ENROLMENT_FIELDS[key]]) { values[key] = st[CFM_ENROLMENT_FIELDS[key]]; }
    });
    return values;
}

function cfmAddPickedStudents() {
    var picked = Object.keys(cfmState.studentPicks).map(function (k) {
        var st = cfmState.studentPicks[k];
        return { recipientName: st.recipientName, recipientEmail: st.recipientEmail || '', recipientLoginId: st.recipientLoginId,
            grade: st.grade || null, contentOverrides: cfmEnrolmentValues(st) };
    });
    if (!picked.length) { return; }
    var existing = cfmCollectRows().filter(function (r) { return r.recipientName; });
    var rows = cfmMergeRecipients(existing, picked);
    cfmRenderRecipientRows(rows);
    $('#cfmStudentModal').modal('hide');
    var noEmail = picked.filter(function (r) { return !r.recipientEmail; }).length;
    showMessageTheme2(noEmail ? 2 : 1, (rows.length - existing.length) + ' student(s) added to the recipients.'
        + (noEmail ? ' ' + noEmail + ' have no email on their account, so theirs cannot be emailed.' : ''));
}

/* ---- Excel / CSV ---- */

function cfmPickSheet() {
    if (!cfmIssueTemplate()) { showMessageTheme2(0, 'Please select a template first.'); return; }
    $('#cfmSheetFile').val('').trigger('click');
}

function cfmUploadSheet(file) {
    var t = cfmIssueTemplate();
    if (!t) { return; }
    if (file.size > 2 * 1024 * 1024) { showMessageTheme2(0, 'The file is larger than 2MB.'); return; }
    var form = new FormData();
    form.append('file', file, file.name);
    form.append('schoolId', SCHOOL_ID);
    form.append('userId', USER_ID);
    form.append('templateId', t.id);
    customLoader(true);
    $.ajax({ url: cfmApiBase() + 'issue/parse-sheet', type: 'POST', data: form, processData: false, contentType: false })
        .then(function (response) {
            customLoader(false);
            if (!cfmIsSuccess(response)) {
                showMessageTheme2(0, (response && response.message) || 'Could not read the file.');
                return;
            }
            var d = response.details || {};
            var loaded = d.recipients || [];
            var existing = cfmCollectRows().filter(function (r) { return r.recipientName; });
            var apply = function (rows) {
                cfmRenderRecipientRows(rows.length ? rows : [{}]);
                $('#cfmSheetSummary').html(cfmSheetSummaryHtml(d));
            };
            if (!existing.length || !loaded.length) { apply(loaded); return; }
            cfmAskReplaceOrAdd(existing.length, loaded.length + ' recipient(s) from the file').then(function (choice) {
                if (choice) { apply(choice === 'replace' ? loaded : cfmMergeRecipients(existing, loaded)); }
            });
        }, function () {
            customLoader(false);
            showMessageTheme2(0, 'Could not read the file.');
        });
}

function cfmCsvCell(v) {
    v = String(v == null ? '' : v);
    if (/^[=+\-@]/.test(v)) { v = '\'' + v; }   // keep spreadsheet apps from running it as a formula
    return /[",\r\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
}

/* a CSV with the columns this template needs, ready to fill in Excel */
function cfmDownloadSampleSheet() {
    var t = cfmIssueTemplate();
    if (!t) { showMessageTheme2(0, 'Please select a template first.'); return; }
    var fields = cfmIssueFields();
    var rows = [
        ['Name', 'Email'].concat(fields.map(function (f) { return f.label; })),
        ['Aisha Khan', 'aisha@example.org'].concat(fields.map(function () { return ''; }))
    ];
    var csv = '﻿' + rows.map(function (r) { return r.map(cfmCsvCell).join(','); }).join('\r\n') + '\r\n';
    var url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    var a = document.createElement('a');
    a.href = url;
    a.download = ((t.templateName || 'certificate').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'certificate') + '-recipients.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
}

/* ---- activity attendees ---- */

function cfmOpenActivityPicker() {
    cfmState.attendance = null;
    $('#cfmAttendeeSummary').empty();
    $('#cfmAttendeeList').html('<div class="cfm-empty">Choose an activity to see who attended its live sessions.</div>');
    $('#cfmAddAttendeesBtn').prop('disabled', true).text('Add to recipients');
    $('#cfmActivitySelect').html('<option value="">Loading…</option>');
    $('#cfmActivityModal').modal('show');
    cfmPost('activities', {}).then(function (response) {
        var list = cfmIsSuccess(response) ? (response.details || []) : [];
        if (!cfmIsSuccess(response)) {
            showMessageTheme2(0, (response && response.message) || 'Could not load the activities.');
        }
        $('#cfmActivitySelect').html((list.length ? '<option value="">Select an activity…</option>' : '<option value="">No activities have started yet</option>')
            + list.map(cfmActivityOptionHtml).join(''));
    }, function () {
        $('#cfmActivitySelect').html('<option value="">Could not load the activities</option>');
    });
}

function cfmLoadAttendees() {
    var id = parseInt($('#cfmActivitySelect').val(), 10);
    var req = ++cfmState.attendanceReq;
    cfmState.attendance = null;
    $('#cfmAddAttendeesBtn').prop('disabled', true).text('Add to recipients');
    $('#cfmAttendeeSummary').empty();
    if (!id) {
        $('#cfmAttendeeList').html('<div class="cfm-empty">Choose an activity to see who attended its live sessions.</div>');
        return;
    }
    $('#cfmAttendeeList').html('<div class="cfm-empty">Loading attendance…</div>');
    cfmPost('activities/attendees', { entityId: id }).then(function (response) {
        if (req !== cfmState.attendanceReq) { return; }
        if (!cfmIsSuccess(response)) {
            $('#cfmAttendeeList').html('<div class="cfm-empty">' + cfmEscape((response && response.message) || 'Could not load the attendance.') + '</div>');
            return;
        }
        cfmState.attendance = response.details || {};
        cfmRenderAttendees();
    }, function () {
        if (req === cfmState.attendanceReq) {
            $('#cfmAttendeeList').html('<div class="cfm-empty">Could not load the attendance.</div>');
        }
    });
}

function cfmMinSessions() {
    return Math.max(1, parseInt($('#cfmMinSessions').val(), 10) || 1);
}

function cfmRenderAttendees() {
    var d = cfmState.attendance;
    if (!d) { return; }
    var people = d.attendees || [];
    var guests = people.filter(function (a) { return !a.recipientLoginId; }).length;
    var issued = people.filter(function (a) { return a.issuedCertCode; }).length;
    $('#cfmAttendeeSummary').html(d.sessionsHeld + ' live session(s) recorded · ' + people.length + ' attendee(s)'
        + (issued ? ' · ' + issued + ' already have a certificate for it' : '')
        + (guests ? ' · ' + guests + ' joined as a guest (no account linked)' : ''));
    $('#cfmAttendeeList').html(cfmAttendeeTableHtml(d, cfmMinSessions()));
    cfmUpdateAttendeeButton();
}

/* re-tick the list for a new minimum (manual ticks are reset) */
function cfmApplyMinSessions() {
    $('#cfmMinSessions').val(cfmMinSessions());
    cfmRenderAttendees();
}

function cfmOnAttendeePick(box) {
    $(box).closest('tr').toggleClass('cfm-att-off', !box.checked);
    cfmUpdateAttendeeButton();
}

function cfmPickAllAttendees(on) {
    $('#cfmAttendeeList .cfm-att-pick').each(function () {
        this.checked = on;
        $(this).closest('tr').toggleClass('cfm-att-off', !on);
    });
    cfmUpdateAttendeeButton();
}

function cfmUpdateAttendeeButton() {
    var all = $('#cfmAttendeeList .cfm-att-pick').length;
    var n = $('#cfmAttendeeList .cfm-att-pick:checked').length;
    $('#cfmAttAll').prop('checked', all > 0 && n === all);
    $('#cfmAddAttendeesBtn').prop('disabled', n === 0).text(n ? 'Add ' + n + ' to recipients' : 'Add to recipients');
}

function cfmAddPickedAttendees() {
    var d = cfmState.attendance;
    if (!d) { return; }
    var picked = [];
    $('#cfmAttendeeList .cfm-att-pick:checked').each(function () {
        var a = (d.attendees || [])[parseInt($(this).attr('data-index'), 10)];
        if (a) {
            picked.push({ recipientName: a.recipientName, recipientEmail: a.recipientEmail || '',
                recipientLoginId: a.recipientLoginId || null, contentOverrides: {} });
        }
    });
    if (!picked.length) { return; }
    var existing = cfmCollectRows().filter(function (r) { return r.recipientName; });
    if (!existing.length) { cfmApplyPickedAttendees(d, picked); return; }
    cfmAskReplaceOrAdd(existing.length, picked.length + ' attendee(s)').then(function (choice) {
        if (choice) { cfmApplyPickedAttendees(d, choice === 'replace' ? picked : cfmMergeRecipients(existing, picked), picked.length); }
    });
}

/* resolves 'replace', 'add', or null when the person closes the modal */
function cfmAskReplaceOrAdd(existingCount, addedLabel) {
    return cfmDialog({
        title: 'Recipients already in the list', icon: 'fa-users', okText: 'Replace list', altText: 'Add below',
        message: 'There are already ' + existingCount + ' recipient(s) in the list. Replace them with the ' + addedLabel
            + ', or add the new ones below the current list?'
    }).then(function (r) { return r ? (r.choice === 'ok' ? 'replace' : 'add') : null; });
}

function cfmApplyPickedAttendees(d, rows, pickedCount) {
    pickedCount = pickedCount || rows.length;
    cfmRenderRecipientRows(rows);
    var act = d.activity || {};
    if (!($('#cfmActivityTitle').val() || '').trim()) { $('#cfmActivityTitle').val(act.title || ''); }
    if (!($('#cfmActivityType').val() || '').trim() && act.activityType) { $('#cfmActivityType').val(act.activityType); }
    cfmState.source = { entityType: 'EXTRA_ACTIVITY_DETAILS', entityId: act.id, title: act.title || 'Untitled activity' };
    $('#cfmSourceInfo').html(cfmSourceInfoHtml(cfmState.source));
    $('#cfmSheetSummary').empty();
    $('#cfmActivityModal').modal('hide');
    showMessageTheme2(1, pickedCount + ' attendee(s) added to the recipients.');
}

function cfmClearSource() {
    cfmState.source = null;
    $('#cfmSourceInfo').empty();
}

/* ---- issue ---- */

function cfmSubmitIssue() {
    var t = cfmIssueTemplate();
    if (!t) { showMessageTheme2(0, 'Please select a template.'); return; }
    var fields = cfmIssueFields();
    var shared = cfmCollectShared();
    var base = {
        templateId: t.id,
        issueDate: $('#cfmIssueDate').val(),
        activityTitle: ($('#cfmActivityTitle').val() || '').trim(),
        activityType: ($('#cfmActivityType').val() || '').trim(),
        contentOverrides: shared,
        sendEmail: $('#cfmSendEmail').is(':checked')
    };
    $('.cfm-scope .cfm-missing').removeClass('cfm-missing');

    if (cfmState.bulk) {
        var recipients = cfmCollectRows().filter(function (r) { return r.recipientName; });
        if (!recipients.length) { showMessageTheme2(0, 'Please add at least one recipient.'); return; }
        // every recipient needs every custom field, from its own row or the shared value
        var incomplete = 0;
        $('#cfmRecipientRows .cfm-recipient-row').each(function () {
            var row = this, missing = false;
            if (!($(row).find('.cfm-recipient-name').val() || '').trim()) { return; }
            var linked = !!$(row).attr('data-login-id');
            fields.forEach(function (f) {
                if (CFM_ENROLMENT_FIELDS[f.key] && linked) { return; }   // the server takes it from their account
                var $input = $(row).find('.cfm-recipient-custom[data-key="' + f.key + '"]');
                if (!($input.val() || '').trim() && !shared[f.key]) { $input.addClass('cfm-missing'); missing = true; }
            });
            if (missing) { incomplete++; }
        });
        if (incomplete) { showMessageTheme2(0, incomplete + ' recipient(s) are missing details (marked in red).'); return; }
        var source = cfmState.source ? { entityType: cfmState.source.entityType, entityId: cfmState.source.entityId } : {};
        cfmMutate('issue/bulk', $.extend({ recipients: recipients }, source, base), null).then(function (response) {
            if (!response) { return; }
            var d = response.details || {};
            var failed = d.failedRecipients || [];
            var msg = (d.issuedCount || 0) + ' certificate(s) issued. PDFs are generating in the background'
                + (base.sendEmail ? '; emails go out as each PDF is ready.' : '.');
            if (failed.length) {
                msg += ' Not issued: ' + failed.slice(0, 3).join('; ') + (failed.length > 3 ? ' and ' + (failed.length - 3) + ' more.' : '.');
            }
            showMessageTheme2(failed.length ? 2 : 1, msg);
            cfmResetIssueForm();
            cfmSwitchTab('issued');
        });
    } else {
        var name = ($('#cfmRecipientName').val() || '').trim();
        if (!name) {
            $('#cfmRecipientName').addClass('cfm-missing');
            showMessageTheme2(0, 'Please pick a student or enter the recipient name.');
            return;
        }
        var missingLabels = fields.filter(function (f) { return !shared[f.key]; }).map(function (f) {
            $('#cfmCustomShared .cfm-custom-shared[data-key="' + f.key + '"]').addClass('cfm-missing');
            return f.label;
        });
        if (missingLabels.length) { showMessageTheme2(0, 'Please fill in: ' + missingLabels.join(', ') + '.'); return; }
        var single = $.extend({ recipientName: name, recipientEmail: ($('#cfmRecipientEmail').val() || '').trim(),
            recipientLoginId: cfmState.singleStudent ? cfmState.singleStudent.recipientLoginId : null }, base);
        cfmMutate('issue/single', single, null).then(function (response) {
            if (!response) { return; }
            var cert = ((response.details || {}).certificates || [])[0] || {};
            if (cert.emailStatus === 'SENT') {
                showMessageTheme2(1, 'Certificate issued and emailed to ' + cert.recipientEmail + '.');
            } else if (cert.emailStatus === 'FAILED' || cert.emailStatus === 'PENDING') {
                showMessageTheme2(2, 'Certificate issued, but the email has not gone out yet. You can resend it from the Issued tab.');
            } else {
                showMessageTheme2(1, 'Certificate issued successfully');
            }
            cfmResetIssueForm();
            cfmSwitchTab('issued');
        });
    }
}

function cfmResetIssueForm() {
    $('#cfmRecipientName, #cfmRecipientEmail, #cfmActivityTitle, #cfmActivityType').val('');
    $('#cfmCustomShared .cfm-custom-shared').val('');
    $('#cfmRecipientName').prop('readonly', false);
    $('#cfmSinglePicked').empty();
    $('#cfmSingleSearch').val('');
    cfmShowSuggest('');
    cfmState.singleStudent = null;
    cfmState.singleAuto = {};
    cfmRenderRecipientRows([]);
    $('#cfmSheetSummary').empty();
    cfmClearSource();
    cfmState.issued = [];
}

/* ---- Issued ---- */

function cfmLoadIssued() {
    cfmPost('list', {}).then(function (response) {
        cfmState.issued = cfmIsSuccess(response) ? (response.details || []) : [];
        cfmRenderIssued();
        if (!cfmIsSuccess(response)) {
            showMessageTheme2(0, (response && response.message) ? response.message : 'Failed to load certificates.');
        }
    }, function () {
        cfmState.issued = [];
        cfmRenderIssued();
        showMessageTheme2(0, 'Failed to load certificates.');
    });
}

function cfmRenderIssued() {
    var search = cfmState.issuedSearch;
    var status = cfmState.issuedStatus;
    var rows = cfmState.issued.filter(function (c) {
        if (status && c.status !== status) { return false; }
        if (!search) { return true; }
        return (c.recipientName && c.recipientName.toLowerCase().indexOf(search) >= 0)
            || (c.certCode && c.certCode.toLowerCase().indexOf(search) >= 0)
            || (c.activityTitle && c.activityTitle.toLowerCase().indexOf(search) >= 0);
    });
    $('#cfmIssuedTableWrap').html(cfmIssuedTableHtml(rows));
}

function cfmRegenerate(id) {
    cfmMutate('regenerate', { certId: id }, 'PDF regeneration started')
        .then(function (response) { if (response) { cfmLoadIssued(); } });
}

function cfmSendEmail(id) {
    cfmMutate('email', { certId: id }, 'Email sent').then(function () { cfmLoadIssued(); });
}

function cfmRevoke(id) {
    cfmDialog({
        title: 'Revoke certificate', tone: 'danger', icon: 'fa-ban', okText: 'Revoke',
        message: 'Are you sure you want to revoke this certificate? It will show as revoked when anyone verifies it.',
        input: { label: 'Reason (optional)', placeholder: 'Why is it being revoked?', maxLength: 255, multiline: true }
    }).then(function (r) {
        if (!r) { return; }
        cfmMutate('revoke', { certId: id, revokeReason: r.value || '' }, 'Certificate revoked')
            .then(function (response) { if (response) { cfmLoadIssued(); } });
    });
}

/* ---- requests from students ---- */

function cfmShowPending(n) {
    $('#cfmPendingBadge').text(n > 99 ? '99+' : n).toggle(n > 0);
}

function cfmLoadPendingCount() {
    cfmPost('requests/list', { status: 'OPEN' }, false).then(function (response) {
        if (cfmIsSuccess(response)) { cfmShowPending((response.details || {}).pending || 0); }
    }, function () {});
}

function cfmLoadRequests() {
    $('#cfmRequestsWrap').html('<div class="cfm-empty">Loading…</div>');
    cfmPost('requests/list', { status: $('#cfmRequestStatus').val() || '' }).then(function (response) {
        if (!cfmIsSuccess(response)) {
            cfmState.requests = [];
            $('#cfmRequestsWrap').html('<div class="cfm-empty">' + cfmEscape((response && response.message) || 'Could not load the requests.') + '</div>');
            return;
        }
        var d = response.details || {};
        cfmState.requests = d.requests || [];
        cfmShowPending(d.pending || 0);
        cfmRenderRequests();
    }, function () {
        $('#cfmRequestsWrap').html('<div class="cfm-empty">Could not load the requests.</div>');
    });
}

function cfmRenderRequests() {
    var q = cfmState.requestSearch;
    var rows = cfmState.requests.filter(function (r) {
        return !q || [r.studentName, r.studentEmail, r.typeName, r.certCode].some(function (v) {
            return v && String(v).toLowerCase().indexOf(q) >= 0;
        });
    });
    $('#cfmRequestsWrap').html(cfmRequestsTableHtml(rows, !!q));
}

function cfmFindRequest(id) {
    return cfmState.requests.filter(function (r) { return r.id === id; })[0] || null;
}

function cfmOpenApprove(id) {
    var r = cfmFindRequest(id);
    if (!r) { return; }
    cfmState.approving = r;
    var active = cfmState.templates.filter(function (t) { return t.status !== 'Inactive'; });
    var preferred = active.some(function (t) { return t.id === r.templateId; }) ? r.templateId : '';
    $('#cfmApproveSummary').html(cfmRequestSummaryHtml(r));
    $('#cfmApproveTemplate').html('<option value="">Select a template…</option>' + active.map(function (t) {
        return '<option value="' + t.id + '">' + cfmEscape(t.templateName) + (t.category ? ' (' + cfmEscape(cfmCategoryLabel(t.category)) + ')' : '') + '</option>';
    }).join('')).val(String(preferred));
    $('#cfmApproveDate').val(new Date().toISOString().slice(0, 10));
    $('#cfmApproveEmailNote').text(r.studentEmail
        ? 'The certificate is emailed to the student (' + r.studentEmail + ') once its PDF is ready, and shows on their My Certificates page.'
        : 'The student has no email on their account: the certificate shows on their My Certificates page.');
    cfmRenderApproveFields();
    $('#cfmApproveModal').modal('show');
}

/* the chosen template's fields, filled from the request: grade and year of the enrolment the student picked, their purpose */
function cfmRenderApproveFields() {
    var r = cfmState.approving || {};
    var id = parseInt($('#cfmApproveTemplate').val(), 10);
    var t = cfmState.templates.filter(function (x) { return x.id === id; })[0];
    var known = { grade: r.gradeLabel || r.grade || '', academicYear: r.academicYear || '', purpose: r.purpose || '' };
    $('#cfmApproveFields').html(t ? cfmCustomInputsHtml(t.customFields || [], false, known) : '');
}

function cfmSubmitApprove() {
    var r = cfmState.approving;
    var templateId = parseInt($('#cfmApproveTemplate').val(), 10);
    if (!r) { return; }
    if (!templateId) { showMessageTheme2(0, 'Please choose a template.'); return; }
    var values = {}, missing = [];
    $('#cfmApproveFields .cfm-custom-shared').each(function () {
        var v = ($(this).val() || '').trim();
        $(this).toggleClass('cfm-missing', !v);
        if (v) { values[$(this).attr('data-key')] = v; } else { missing.push($(this).attr('aria-label')); }
    });
    if (missing.length) { showMessageTheme2(0, 'Please fill in: ' + missing.join(', ') + '.'); return; }
    $('#cfmApproveBtn').prop('disabled', true);
    cfmMutate('requests/approve', { requestId: r.id, templateId: templateId, issueDate: $('#cfmApproveDate').val(),
        contentOverrides: values }, null).then(function (response) {
        $('#cfmApproveBtn').prop('disabled', false);
        if (!response) { cfmLoadRequests(); return; }
        var d = response.details || {};
        showMessageTheme2(1, 'Approved. Certificate ' + (d.certCode || '') + ' issued to ' + (r.studentName || 'the student') + '.');
        $('#cfmApproveModal').modal('hide');
        cfmLoadRequests();
    });
}

/* moves an open request to another stage; the student sees it at once */
function cfmSetStage(id, select) {
    var r = cfmFindRequest(id);
    if (!r) { return; }
    var previous = r.status;
    cfmMutate('requests/status', { requestId: id, status: select.value }, 'Stage updated: the student can see it').then(function (response) {
        if (response) { r.status = select.value; } else { $(select).val(previous); cfmLoadRequests(); }
    });
}

function cfmOpenReject(id) {
    var r = cfmFindRequest(id);
    if (!r) { return; }
    cfmState.approving = r;
    $('#cfmRejectSummary').html(cfmRequestSummaryHtml(r));
    $('#cfmRejectReason').val('').removeClass('cfm-missing');
    $('#cfmRejectModal').modal('show');
}

function cfmSubmitReject() {
    var r = cfmState.approving;
    var reason = ($('#cfmRejectReason').val() || '').trim();
    if (!r) { return; }
    if (!reason) { $('#cfmRejectReason').addClass('cfm-missing'); showMessageTheme2(0, 'Please give the reason.'); return; }
    cfmMutate('requests/reject', { requestId: r.id, rejectReason: reason }, 'Request rejected').then(function (response) {
        if (response) { $('#cfmRejectModal').modal('hide'); }
        cfmLoadRequests();
    });
}

/* ---- request types master ---- */

function cfmTypeTemplates() {
    return cfmState.templates.filter(function (t) { return t.status !== 'Inactive'; });
}

function cfmOpenTypesModal() {
    $('#cfmTypesBody').html('<tr><td colspan="6" class="cfm-empty">Loading…</td></tr>');
    $('#cfmTypesModal').modal('show');
    cfmLoadTypes();
}

function cfmLoadTypes() {
    cfmPost('request-types/list', {}, false).then(function (response) {
        cfmState.requestTypes = cfmIsSuccess(response) ? (response.details || []) : [];
        if (!cfmIsSuccess(response)) {
            $('#cfmTypesBody').html('<tr><td colspan="6" class="cfm-empty">' + cfmEscape((response && response.message) || 'Could not load the request types.') + '</td></tr>');
            return;
        }
        var templates = cfmTypeTemplates();
        $('#cfmTypesBody').html(cfmState.requestTypes.length
            ? cfmState.requestTypes.map(function (t) { return cfmTypeRowHtml(t, templates); }).join('')
            : '<tr class="cfm-types-empty"><td colspan="6" class="cfm-empty">No request types yet: students cannot request certificates.</td></tr>');
    }, function () {
        $('#cfmTypesBody').html('<tr><td colspan="6" class="cfm-empty">Could not load the request types.</td></tr>');
    });
}

function cfmAddTypeRow() {
    $('#cfmTypesBody .cfm-types-empty').remove();
    $('#cfmTypesBody').append(cfmTypeRowHtml({}, cfmTypeTemplates()));
    $('#cfmTypesBody tr').last().find('.cfm-type-name').focus();
}

function cfmSaveType(btn) {
    var $row = $(btn).closest('tr');
    var id = parseInt($row.attr('data-id'), 10) || null;
    var name = ($row.find('.cfm-type-name').val() || '').trim();
    var order = parseInt($row.find('.cfm-type-order').val(), 10);
    if (!name) { $row.find('.cfm-type-name').addClass('cfm-missing').focus(); showMessageTheme2(0, 'Please enter a name.'); return; }
    cfmMutate('request-types/save', { requestTypeId: id, typeName: name,
        templateId: parseInt($row.find('.cfm-type-template').val(), 10) || null,
        askName: $row.find('.cfm-type-ask').is(':checked'), typeActive: $row.find('.cfm-type-active').is(':checked'),
        orderSet: isNaN(order) ? null : order }, 'Request type saved').then(function (response) {
        if (response) { cfmLoadTypes(); }
    });
}

function cfmDeleteType(btn) {
    var $row = $(btn).closest('tr');
    var id = parseInt($row.attr('data-id'), 10);
    if (!id) { return; }
    cfmDialog({
        title: 'Remove request type', tone: 'danger', icon: 'fa-trash-o', okText: 'Remove', size: 'sm',
        message: 'Students will no longer see this option. Requests already made for it are kept.'
    }).then(function (r) {
        if (!r) { return; }
        cfmMutate('request-types/delete', { requestTypeId: id }, 'Request type removed').then(function (response) {
            if (response) { cfmLoadTypes(); }
        });
    });
}

