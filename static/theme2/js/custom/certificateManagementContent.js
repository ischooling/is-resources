/*
 * certificateManagementContent.js
 * Markup + render helpers for the Certificates admin module.
 * Rendered into #dashboardContentInHTML by initCertificateManagement().
 * Logic lives in certificateManagement.js (cfm* functions, globals
 * SCHOOL_ID / USER_ID / APP_BASE_URL / API_VERSION).
 */

/* certificate types: a template's CATEGORY; the student documents are also what students can request */
var CFM_TEMPLATE_TYPES = [
    { group: 'Student documents', items: [
        { key: 'CHARACTER_CERTIFICATE', label: 'Character Certificate' },
        { key: 'CONFIRMATION_OF_STUDIES', label: 'Confirmation of Studies' },
        { key: 'ACADEMIC_VERIFICATION', label: 'Academic Verification' },
        { key: 'TRANSFER_CERTIFICATE', label: 'Transfer Certificate' }] },
    { group: 'Awards and activities', items: [
        { key: 'EXTRA_CURRICULAR', label: 'Participation' },
        { key: 'ACHIEVEMENT', label: 'Achievement' },
        { key: 'SESSION_ATTENDANCE', label: 'Attendance' },
        { key: 'APPRECIATION', label: 'Appreciation' },
        { key: 'COMPLETION', label: 'Completion' }] }
];

/* fields filled in from a linked student's current enrolment (the server does the same when left empty) */
var CFM_ENROLMENT_FIELDS = { grade: 'gradeLabel', academicYear: 'academicYear' };

function cfmTemplateType(key) {
    var found = null;
    CFM_TEMPLATE_TYPES.forEach(function (g) { g.items.forEach(function (t) { if (t.key === key) { found = t; } }); });
    return found;
}

function cfmCategoryLabel(category) {
    var t = cfmTemplateType(category);
    return t ? t.label : (category || '');
}

/* type dropdown plus a text box for any other name; read it back with cfmReadCategory(id) */
function cfmCategorySelectHtml(id, value, inputClass) {
    var known = !value || !!cfmTemplateType(value);
    var groups = CFM_TEMPLATE_TYPES.map(function (g) {
        return '<optgroup label="' + cfmEscape(g.group) + '">' + g.items.map(function (t) {
            return '<option value="' + t.key + '"' + (t.key === value ? ' selected' : '') + '>' + cfmEscape(t.label) + '</option>';
        }).join('') + '</optgroup>';
    }).join('');
    return '<select id="' + id + '" class="' + (inputClass || '') + '" aria-label="Certificate type" onchange="$(\'#' + id + 'Other\').toggle(this.value === \'OTHER\').focus()">'
        + '<option value=""' + (value ? '' : ' selected') + '>No type</option>' + groups
        + '<option value="OTHER"' + (known ? '' : ' selected') + '>Other…</option></select>'
        + '<input type="text" id="' + id + 'Other" class="' + (inputClass || '') + '" placeholder="Type name" aria-label="Other type name" maxlength="100"'
        + ' value="' + (known ? '' : cfmEscape(value)) + '"' + (known ? ' style="display:none;"' : '') + ' />';
}

function cfmReadCategory(id) {
    var v = $('#' + id).val() || '';
    return v === 'OTHER' ? ($('#' + id + 'Other').val() || '').trim() : v;
}

function getCertificateManagementPageContent(title) {
    return `
    <div class="custom-field-scope cfm-scope">
        <style>
            .cfm-scope .cfm-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;}
            .cfm-scope .cfm-title{font-size:20px;font-weight:600;color:#2b2f42;}
            .cfm-scope .cfm-sub{font-size:13px;color:#7a7f95;margin-top:2px;}
            .cfm-scope .cfm-tabs{display:flex;gap:6px;border-bottom:1px solid #e6e8f0;margin-bottom:18px;}
            .cfm-scope .cfm-tab{border:0;background:transparent;padding:10px 16px;font-size:14px;color:#7a7f95;cursor:pointer;border-bottom:2px solid transparent;}
            .cfm-scope .cfm-tab.active{color:var(--pc,#16aaff);border-bottom-color:var(--pc,#16aaff);font-weight:600;}
            .cfm-scope .cfm-view{display:none;}
            .cfm-scope .cfm-view.active{display:block;}
            .cfm-scope .cfm-toolbar{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px;flex-wrap:wrap;}
            .cfm-scope .cfm-search{min-width:220px;padding:8px 12px;border:1px solid #d7dae8;border-radius:8px;}
            .cfm-scope #cfmIssuedSearch{min-width:260px;flex:0 1 320px;padding:9px 12px;font-size:13px;}
            .cfm-scope .cfm-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px;}
            .cfm-scope .cfm-card{border:1px solid #e6e8f0;border-radius:10px;padding:16px;background:#fff;}
            .cfm-scope .cfm-card h4{margin:0 0 4px;font-size:15px;color:#2b2f42;}
            .cfm-scope .cfm-chip{display:inline-block;font-size:11px;font-weight:500;line-height:1.5;padding:2px 9px;border-radius:20px;background:var(--pc,#16aaff);color:#fff;margin:0 4px 4px 0;white-space:nowrap;}
            .cfm-scope .cfm-chip.cfm-neutral{background:#e9ecef;color:#212529;}
            .cfm-scope .cfm-chip.cfm-warning{background:#f7b924;color:#212529;}
            .cfm-scope .cfm-chip.cfm-inactive,.cfm-scope .cfm-chip.cfm-revoked{background:#d92550;color:#fff;}
            .cfm-scope .cfm-chip.cfm-valid{background:green;color:#fff;}
            .cfm-scope .cfm-card{display:flex;flex-direction:column;}
            .cfm-scope .cfm-card-actions{margin-top:auto;padding-top:12px;display:flex;gap:8px;flex-wrap:wrap;}
            .cfm-scope .cfm-btn{border:0;border-radius:8px;padding:7px 14px;font-size:13px;line-height:1.4;cursor:pointer;white-space:nowrap;transition:filter .15s ease;}
            .cfm-scope .cfm-btn:hover{filter:brightness(.92);}
            .cfm-scope .cfm-btn:disabled{opacity:.55;cursor:not-allowed;filter:none;}
            .cfm-scope .cfm-btn-sm{padding:4px 10px;font-size:12px;}
            .cfm-scope .cfm-btn-primary{background:var(--pc,#16aaff);color:#fff;}
            .cfm-scope .cfm-btn-light{background:#e9ecef;color:#212529;}
            .cfm-scope .cfm-btn-danger{background:#d92550;color:#fff;}
            .cfm-scope a.cfm-btn{display:inline-block;text-decoration:none;}
            .cfm-scope a.cfm-btn-light,.cfm-scope a.cfm-btn-light:hover{color:#212529;}
            .cfm-scope table.cfm-table{width:100%;border-collapse:collapse;background:#fff;}
            .cfm-scope #cfmIssuedTableWrap{overflow-x:auto;border:1px solid #eef0f6;border-radius:8px;}
            .cfm-scope .cfm-table th,.cfm-scope .cfm-table td{text-align:left;padding:10px 12px;border-bottom:1px solid #eef0f6;font-size:13px;vertical-align:middle;}
            .cfm-scope .cfm-table th{color:#fff;font-weight:600;background:var(--pc,#16aaff);white-space:nowrap;}
            .cfm-scope .cfm-table tbody tr:hover td{background:#f8f9fb;}
            .cfm-scope .cfm-table .cfm-nowrap{white-space:nowrap;}
            .cfm-scope .cfm-email-cell{min-width:200px;}
            .cfm-scope .cfm-email-cell .cfm-email-addr{font-size:12px;color:#555b70;word-break:break-all;margin-bottom:4px;}
            .cfm-scope .cfm-email-cell .cfm-email-actions{display:flex;align-items:center;gap:6px;flex-wrap:wrap;}
            .cfm-scope .cfm-email-cell .cfm-chip{margin:0;}
            .cfm-scope .cfm-form-row{display:flex;gap:14px;flex-wrap:wrap;margin-bottom:14px;}
            .cfm-scope .cfm-field{flex:1;min-width:200px;display:flex;flex-direction:column;}
            .cfm-scope .cfm-field label{font-size:12px;color:#7a7f95;margin-bottom:4px;}
            .cfm-scope .cfm-field input,.cfm-scope .cfm-field select,.cfm-scope .cfm-field textarea{padding:8px 10px;border:1px solid #d7dae8;border-radius:8px;font-size:13px;}
            .cfm-scope .cfm-empty{padding:40px;text-align:center;color:#9aa0b5;}
            .cfm-scope .cfm-recipient-row{display:flex;gap:10px;margin-bottom:8px;flex-wrap:wrap;}
            .cfm-scope .cfm-recipient-row input{flex:1;min-width:140px;padding:7px 9px;border:1px solid #d7dae8;border-radius:7px;font-size:13px;}
            .cfm-scope .cfm-recipient-row input.cfm-missing{border-color:#d05050;background:#fff6f6;}
            .cfm-scope .cfm-custom-box{border:1px dashed color-mix(in srgb, var(--pc,#16aaff) 35%, white);border-radius:8px;padding:12px;margin-bottom:14px;background:color-mix(in srgb, var(--pc,#16aaff) 4%, white);}
            .cfm-scope .cfm-custom-box h6{margin:0 0 8px;font-size:13px;color:#2b2f42;}
            .cfm-scope .cfm-sheet-bar{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin:6px 0 10px;}
            .cfm-scope .cfm-sheet-summary{font-size:13px;border-radius:8px;padding:10px 12px;margin-bottom:10px;background:color-mix(in srgb, var(--pc,#16aaff) 8%, white);color:#2b2f42;}
            .cfm-scope .cfm-sheet-summary ul{margin:6px 0 0 18px;padding:0;}
            .cfm-scope .cfm-check{display:flex;align-items:center;gap:8px;font-size:13px;color:#2b2f42;cursor:pointer;margin:12px 0 0;}
            .cfm-scope .cfm-modal-box{max-width:760px;}
            .cfm-scope .cfm-source{display:flex;align-items:center;gap:8px;flex-wrap:wrap;font-size:13px;border-radius:8px;padding:8px 12px;margin-bottom:10px;background:#f5f6fa;border-left:3px solid green;color:#212529;}
            .cfm-scope .cfm-source > i{color:green;}
            .cfm-scope .cfm-source button{border:0;background:transparent;color:#212529;cursor:pointer;font-size:16px;line-height:1;padding:0 4px;margin-left:auto;}
            .cfm-scope .cfm-att-wrap{max-height:380px;overflow:auto;border:1px solid #eef0f6;border-radius:8px;}
            .cfm-scope .cfm-att-wrap .cfm-table th{position:sticky;top:0;background:var(--pc,#16aaff);z-index:1;}
            .cfm-scope .cfm-att-wrap tr.cfm-att-off td{color:#9aa0b5;}
            .cfm-scope .cfm-att-note{font-size:12px;color:#7a7f95;margin:8px 0;}
            .cfm-scope .cfm-badge{display:inline-block;min-width:18px;padding:0 6px;margin-left:6px;border-radius:10px;background:#d05050;color:#fff;font-size:11px;line-height:18px;text-align:center;}
            .cfm-scope .cfm-req-sub{font-size:12px;color:#7a7f95;word-break:break-all;}
            .cfm-scope .cfm-chip.cfm-pending{background:#fff4e0;color:#9a6200;}
            .cfm-scope .cfm-chip.cfm-muted{background:#f1f2f6;color:#7a7f95;}
            .cfm-scope .cfm-req-actions{display:flex;gap:6px;flex-wrap:wrap;align-items:center;}
            .cfm-scope .cfm-stage{padding:7px 8px;border:1px solid #f0d59b;background:#fff8ea;color:#7a5200;border-radius:8px;font-size:13px;}
            .cfm-scope .cfm-summary{border:1px solid #e3e6f3;background:#fafbff;border-radius:10px;padding:10px 14px;margin-bottom:14px;font-size:13px;color:#2b2f42;}
            .cfm-scope .cfm-summary div{margin:2px 0;}
            .cfm-scope .cfm-types td{vertical-align:middle;}
            .cfm-scope .cfm-types input[type=text],.cfm-scope .cfm-types select{width:100%;padding:6px 8px;border:1px solid #d7dae8;border-radius:7px;font-size:13px;}
            .cfm-scope .cfm-types input[type=number]{width:64px;padding:6px 8px;border:1px solid #d7dae8;border-radius:7px;font-size:13px;}
            .cfm-scope .cfm-issue{max-width:980px;padding:22px 24px;}
            .cfm-scope .cfm-section{font-size:14px;font-weight:600;color:#2b2f42;display:flex;align-items:center;gap:8px;margin:4px 0 14px;}
            .cfm-scope .cfm-section ~ .cfm-section{margin-top:22px;padding-top:18px;border-top:1px solid #eef0f6;}
            .cfm-scope .cfm-step{width:22px;height:22px;border-radius:50%;background:var(--pc,#16aaff);color:#fff;font-size:12px;display:inline-flex;align-items:center;justify-content:center;}
            .cfm-scope .cfm-seg{display:inline-flex;background:#f1f2f9;border-radius:10px;padding:4px;margin-bottom:16px;}
            .cfm-scope .cfm-seg button{border:0;background:transparent;border-radius:8px;padding:7px 16px;font-size:13px;color:#555b70;cursor:pointer;}
            .cfm-scope .cfm-seg button.active{background:var(--pc,#16aaff);color:#fff;font-weight:600;box-shadow:0 1px 3px rgba(43,47,66,.12);}
            .cfm-scope .cfm-finder{border:1px solid color-mix(in srgb, var(--pc,#16aaff) 20%, white);border-radius:10px;padding:14px;background:color-mix(in srgb, var(--pc,#16aaff) 4%, white);margin-bottom:14px;}
            .cfm-scope .cfm-finder > label{font-size:12px;color:#7a7f95;margin-bottom:6px;display:block;}
            .cfm-scope .cfm-finder-row{display:flex;gap:10px;flex-wrap:wrap;}
            .cfm-scope .cfm-finder-row select{flex:0 0 200px;max-width:100%;padding:8px 10px;border:1px solid #d7dae8;border-radius:8px;font-size:13px;background:#fff;}
            .cfm-scope .cfm-finder-box{position:relative;flex:1;min-width:220px;}
            .cfm-scope .cfm-finder-box > i{position:absolute;left:11px;top:50%;transform:translateY(-50%);color:#9aa0b5;pointer-events:none;}
            .cfm-scope .cfm-finder-box input{width:100%;padding:8px 10px 8px 32px;border:1px solid #d7dae8;border-radius:8px;font-size:13px;}
            .cfm-scope .cfm-suggest{display:none;position:absolute;left:0;right:0;top:calc(100% + 4px);z-index:20;background:#fff;border:1px solid color-mix(in srgb, var(--pc,#16aaff) 20%, white);border-radius:10px;box-shadow:0 8px 24px rgba(43,47,66,.14);max-height:300px;overflow:auto;}
            .cfm-scope .cfm-suggest.open{display:block;}
            .cfm-scope .cfm-suggest-item{display:flex;align-items:center;gap:8px;width:100%;border:0;background:#fff;text-align:left;padding:9px 12px;font-size:13px;cursor:pointer;border-bottom:1px solid #f3f4f9;}
            .cfm-scope .cfm-suggest-item:hover,.cfm-scope .cfm-suggest-item:focus{background:color-mix(in srgb, var(--pc,#16aaff) 8%, white);outline:none;}
            .cfm-scope .cfm-suggest-item small{color:#9aa0b5;margin-left:auto;word-break:break-all;text-align:right;}
            .cfm-scope .cfm-suggest-note{padding:10px 12px;font-size:12px;color:#7a7f95;}
            .cfm-scope .cfm-linked{display:flex;align-items:center;gap:8px;flex-wrap:wrap;font-size:13px;border-radius:8px;padding:8px 12px;margin-bottom:12px;background:color-mix(in srgb, var(--pc,#16aaff) 8%, white);color:#2b2f42;}
            .cfm-scope .cfm-linked .cfm-warn{display:inline-block;background:#f7b924;color:#212529;border-radius:6px;padding:1px 8px;font-size:12px;}
            .cfm-scope .cfm-link-btn{border:0;border-radius:6px;background:var(--pc,#16aaff);color:#fff;cursor:pointer;font-size:12px;padding:4px 10px;margin-left:auto;transition:filter .15s ease;}
            .cfm-scope .cfm-link-btn:hover{filter:brightness(.92);}
            .cfm-scope .cfm-field input[readonly]{background:#f5f6fa;color:#555b70;}
            .cfm-scope .cfm-rec-head{display:flex;align-items:center;gap:8px;margin:12px 0 8px;font-size:13px;color:#2b2f42;}
            .cfm-scope .cfm-rec-head .cfm-link-btn{background:#d92550;}
            .cfm-scope .cfm-recipient-row{align-items:center;}
            .cfm-scope .cfm-row-tag{flex:0 0 auto;font-size:11px;padding:2px 9px;border-radius:20px;background:green;color:#fff;white-space:nowrap;}
            .cfm-scope .cfm-rec-empty{padding:22px;text-align:center;color:#9aa0b5;border:1px dashed #d7dae8;border-radius:10px;font-size:13px;margin-bottom:10px;}
            .cfm-scope .cfm-att-wrap tr.cfm-att-in td{color:#9aa0b5;}
            @media (max-width:600px){.cfm-scope .cfm-issue{padding:16px;}.cfm-scope .cfm-finder-row select{flex:1 1 100%;}.cfm-scope .cfm-seg{display:flex;}.cfm-scope .cfm-seg button{flex:1;}}
        </style>

        <div class="cfm-header">
            <div>
                <div class="cfm-title"><i class="fa fa-certificate mr-2"></i>${title}</div>
                <div class="cfm-sub">Design templates, issue certificates, and manage what has been issued.</div>
            </div>
        </div>

        <div class="cfm-tabs">
            <button type="button" class="cfm-tab active" data-tab="templates" onclick="cfmSwitchTab('templates')"><i class="fa fa-file-text-o mr-1"></i> Templates</button>
            <button type="button" class="cfm-tab" data-tab="issue" onclick="cfmSwitchTab('issue')"><i class="fa fa-paper-plane-o mr-1"></i> Issue</button>
            <button type="button" class="cfm-tab" data-tab="issued" onclick="cfmSwitchTab('issued')"><i class="fa fa-list mr-1"></i> Issued</button>
            <button type="button" class="cfm-tab" data-tab="requests" onclick="cfmSwitchTab('requests')"><i class="fa fa-inbox mr-1"></i> Requests<span class="cfm-badge" id="cfmPendingBadge" style="display:none;"></span></button>
        </div>

        <!-- Templates -->
        <div class="cfm-view active" id="cfmView-templates">
            <div class="cfm-toolbar">
                <input type="text" class="cfm-search" id="cfmTemplateSearch" placeholder="Search templates…" />
                <div>
                    <button type="button" class="cfm-btn cfm-btn-light" onclick="cfmOpenTemplateModal(0)" title="Write the template as HTML (advanced)"><i class="fa fa-code mr-1"></i> HTML</button>
                    <button type="button" class="cfm-btn cfm-btn-primary" onclick="cfeOpenPageModal('new')"><i class="fa fa-plus mr-1"></i> New template</button>
                </div>
            </div>
            <div class="cfm-grid" id="cfmTemplateGrid"><div class="cfm-empty">Loading…</div></div>
        </div>

        <!-- Issue -->
        <div class="cfm-view" id="cfmView-issue">
            ${getCertificateIssueFormHtml()}
        </div>

        <!-- Issued -->
        <div class="cfm-view" id="cfmView-issued">
            <div class="cfm-toolbar">
                <input type="text" class="cfm-search" id="cfmIssuedSearch" placeholder="Search by name, code or activity…" />
                <select class="cfm-search" id="cfmIssuedStatus" style="min-width:160px;">
                    <option value="">All statuses</option>
                    <option value="Valid">Valid</option>
                    <option value="Revoked">Revoked</option>
                </select>
                <button type="button" class="cfm-btn cfm-btn-light" onclick="cfmLoadIssued()"><i class="fa fa-refresh mr-1"></i> Refresh</button>
            </div>
            <div id="cfmIssuedTableWrap"><div class="cfm-empty">Loading…</div></div>
        </div>

        <!-- Requests from students -->
        <div class="cfm-view" id="cfmView-requests">
            <div class="cfm-toolbar">
                <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;">
                    <select class="cfm-search" id="cfmRequestStatus" style="min-width:190px;" aria-label="Status" onchange="cfmLoadRequests()">
                        <option value="OPEN">Open (needs action)</option>
                        <option value="PENDING">Requested</option>
                        <option value="UNDER_REVIEW">Under review</option>
                        <option value="GENERATING">Generating certificate</option>
                        <option value="DISPATCHING">Dispatching</option>
                        <option value="APPROVED">Certificate generated</option>
                        <option value="REJECTED">Rejected</option>
                        <option value="CANCELLED">Cancelled by student</option>
                        <option value="">All</option>
                    </select>
                    <input type="text" class="cfm-search" id="cfmRequestSearch" placeholder="Search student or certificate…" />
                </div>
                <div>
                    <button type="button" class="cfm-btn cfm-btn-light" onclick="cfmLoadRequests()"><i class="fa fa-refresh mr-1"></i> Refresh</button>
                    <button type="button" class="cfm-btn cfm-btn-light" onclick="cfmOpenTypesModal()"><i class="fa fa-sliders mr-1"></i> Request types</button>
                </div>
            </div>
            <div id="cfmRequestsWrap" style="overflow-x:auto;"><div class="cfm-empty">Loading…</div></div>
        </div>
    </div>`;
}

function getCertificateIssueFormHtml() {
    return `
    <div class="cfm-card cfm-issue">
        <div class="cfm-section"><span class="cfm-step">1</span> Certificate</div>
        <div class="cfm-form-row">
            <div class="cfm-field">
                <label for="cfmIssueTemplate">Template</label>
                <select id="cfmIssueTemplate" onchange="cfmOnTemplateChange()"><option value="">Select a template…</option></select>
            </div>
            <div class="cfm-field">
                <label for="cfmIssueDate">Issue date</label>
                <input type="date" id="cfmIssueDate" />
            </div>
        </div>
        <div class="cfm-form-row">
            <div class="cfm-field">
                <label for="cfmActivityTitle">Activity title</label>
                <input type="text" id="cfmActivityTitle" placeholder="e.g. Inter-School Debate 2026" />
            </div>
            <div class="cfm-field">
                <label for="cfmActivityType">Activity type</label>
                <input type="text" id="cfmActivityType" placeholder="e.g. Extra-curricular / Session" />
            </div>
        </div>

        <div id="cfmCustomShared"></div>

        <div class="cfm-section"><span class="cfm-step">2</span> Recipients</div>
        <div class="cfm-seg" role="group" aria-label="How many recipients">
            <button type="button" class="active" data-mode="single" aria-pressed="true" onclick="cfmSetIssueMode(false)"><i class="fa fa-user mr-1"></i> One student</button>
            <button type="button" data-mode="bulk" aria-pressed="false" onclick="cfmSetIssueMode(true)"><i class="fa fa-users mr-1"></i> Many students</button>
        </div>

        <div id="cfmSingleBlock">
            <div class="cfm-finder">
                <label for="cfmSingleSearch">Find a student</label>
                <div class="cfm-finder-row">
                    <select id="cfmSingleGrade" class="cfm-grade-select" aria-label="Grade" onchange="cfmSingleSearchNow()"><option value="">All grades</option></select>
                    <div class="cfm-finder-box">
                        <i class="fa fa-search" aria-hidden="true"></i>
                        <input type="search" id="cfmSingleSearch" placeholder="Type a name or email…" autocomplete="off"
                            role="combobox" aria-expanded="false" aria-controls="cfmSingleResults" aria-autocomplete="list" />
                        <div id="cfmSingleResults" class="cfm-suggest" role="listbox"></div>
                    </div>
                </div>
                <div class="cfm-att-note" style="margin-bottom:0;">Only currently enrolled students are listed; their name and email come from their account. Not a student? Type the details below.</div>
            </div>
            <div id="cfmSinglePicked"></div>
            <div class="cfm-form-row">
                <div class="cfm-field">
                    <label for="cfmRecipientName">Recipient name</label>
                    <input type="text" id="cfmRecipientName" placeholder="Full name" />
                </div>
                <div class="cfm-field">
                    <label for="cfmRecipientEmail">Recipient email (optional)</label>
                    <input type="email" id="cfmRecipientEmail" placeholder="name@example.com" />
                </div>
            </div>
        </div>

        <div id="cfmBulkBlock" style="display:none;">
            <div class="cfm-sheet-bar">
                <button type="button" class="cfm-btn cfm-btn-primary" onclick="cfmOpenStudentPicker()"><i class="fa fa-graduation-cap mr-1"></i> Add students</button>
                <button type="button" class="cfm-btn cfm-btn-light" onclick="cfmOpenActivityPicker()"><i class="fa fa-users mr-1"></i> Add activity attendees</button>
                <button type="button" class="cfm-btn cfm-btn-light" onclick="cfmPickSheet()"><i class="fa fa-file-excel-o mr-1"></i> Upload Excel / CSV</button>
                <button type="button" class="cfm-btn cfm-btn-light" onclick="cfmDownloadSampleSheet()"><i class="fa fa-download mr-1"></i> Sample sheet</button>
                <input type="file" id="cfmSheetFile" accept=".xlsx,.xls,.csv" style="display:none;" />
            </div>
            <div id="cfmSourceInfo"></div>
            <div id="cfmSheetSummary"></div>
            <div class="cfm-rec-head">
                <b>Recipients</b> <span class="cfm-chip" id="cfmRecipientCount">0</span>
                <button type="button" class="cfm-link-btn" id="cfmClearRecipients" onclick="cfmClearRecipients()" style="display:none;">Remove all</button>
            </div>
            <div id="cfmRecipientRows"></div>
            <button type="button" class="cfm-btn cfm-btn-light" onclick="cfmAddRecipientRow()"><i class="fa fa-plus mr-1"></i> Type a recipient</button>
        </div>

        <label class="cfm-check"><input type="checkbox" id="cfmSendEmail" /> Email each certificate to its recipient (when an email address is given)</label>

        <div style="margin-top:18px;">
            <button type="button" class="cfm-btn cfm-btn-primary" id="cfmIssueBtn" onclick="cfmSubmitIssue()"><i class="fa fa-paper-plane-o mr-1"></i> Issue certificate</button>
        </div>
    </div>`;
}

function cfmTemplateCardHtml(t) {
    var statusChip = (t.status === 'Inactive')
        ? '<span class="cfm-chip cfm-inactive">Inactive</span>'
        : '<span class="cfm-chip cfm-valid">Active</span>';
    var category = t.category ? '<span class="cfm-chip cfm-neutral">' + cfmEscape(cfmCategoryLabel(t.category)) + '</span>' : '';
    var editor = '<span class="cfm-chip">' + (t.editorType === 'VISUAL' ? 'Visual' : 'HTML') + '</span>';
    var toggleLabel = (t.status === 'Inactive') ? 'Activate' : 'Deactivate';
    var nextStatus = (t.status === 'Inactive') ? 'Active' : 'Inactive';
    return `
    <div class="cfm-card">
        <h4>${cfmEscape(t.templateName)}</h4>
        <div style="margin:4px 0 6px;">${statusChip}${editor}${category}<span class="cfm-chip cfm-neutral">${cfmEscape(t.pageFormat || 'A4')} ${cfmEscape(t.orientation || '')}</span></div>
        <div style="font-size:12px;color:#7a7f95;word-break:break-all;">Key: ${cfmEscape(t.templateKey || '')}</div>
        <div class="cfm-card-actions">
            <button type="button" class="cfm-btn cfm-btn-primary" onclick="cfmEditTemplate(${t.id})"><i class="fa fa-pencil mr-1"></i> Edit</button>
            <button type="button" class="cfm-btn cfm-btn-light" onclick="cfmToggleTemplateStatus(${t.id}, '${nextStatus}')">${toggleLabel}</button>
            <button type="button" class="cfm-btn cfm-btn-danger" onclick="cfmDeleteTemplate(${t.id})"><i class="fa fa-trash-o mr-1"></i> Delete</button>
        </div>
    </div>`;
}

function cfmIssuedTableHtml(rows) {
    if (!rows || !rows.length) {
        return '<div class="cfm-empty">No certificates issued yet.</div>';
    }
    var body = rows.map(function (c) {
        var statusChip = (c.status === 'Revoked')
            ? '<span class="cfm-chip cfm-revoked">Revoked</span>'
            : '<span class="cfm-chip cfm-valid">Valid</span>';
        var pdf;
        if (c.pdfUrl && c.pdfStatus !== 'FAILED') {
            pdf = '<a class="cfm-btn cfm-btn-light cfm-btn-sm" href="' + cfmEscape(c.pdfUrl) + '" target="_blank" rel="noopener"><i class="fa fa-file-pdf-o mr-1"></i> PDF</a>';
        } else if (c.pdfStatus === 'FAILED') {
            pdf = '<span class="cfm-chip cfm-inactive">Failed</span>'
                + (c.status === 'Revoked' ? ''
                    : ' <button type="button" class="cfm-btn cfm-btn-light cfm-btn-sm" onclick="cfmRegenerate(' + c.id + ')">Retry</button>');
        } else {
            // the server refuses a retry while the job is still in the queue (< 10 min)
            pdf = '<span class="cfm-chip cfm-warning">Generating…</span>'
                + (c.status === 'Revoked' ? ''
                    : ' <button type="button" class="cfm-btn cfm-btn-light cfm-btn-sm" title="Retry if stuck" onclick="cfmRegenerate(' + c.id + ')">Retry</button>');
        }
        var revokeBtn = (c.status === 'Revoked') ? ''
            : '<button type="button" class="cfm-btn cfm-btn-danger cfm-btn-sm" onclick="cfmRevoke(' + c.id + ')"><i class="fa fa-ban mr-1"></i> Revoke</button>';
        return `<tr>
            <td class="cfm-nowrap">${cfmEscape(c.certCode || '')}</td>
            <td>${cfmEscape(c.recipientName || '')}</td>
            <td>${c.activityTitle ? cfmEscape(c.activityTitle) : '<span style="color:#9aa0b5;">—</span>'}</td>
            <td>${c.templateName ? cfmEscape(c.templateName) : '<span style="color:#9aa0b5;">—</span>'}</td>
            <td class="cfm-nowrap">${cfmFormatDate(c.issueDate)}</td>
            <td>${statusChip}</td>
            <td class="cfm-nowrap">${pdf}</td>
            <td class="cfm-email-cell">${cfmEmailCellHtml(c)}</td>
            <td class="cfm-nowrap">${revokeBtn}</td>
        </tr>`;
    }).join('');
    return `
    <table class="cfm-table">
        <thead><tr>
            <th>Code</th><th>Recipient</th><th>Activity</th><th>Template</th><th>Issued</th><th>Status</th><th>File</th><th>Email</th><th>Action</th>
        </tr></thead>
        <tbody>${body}</tbody>
    </table>`;
}

/* one bulk recipient: name, email and one input per custom field of the template */
function cfmRecipientRowHtml(fields, r) {
    r = r || {};
    var values = r.contentOverrides || {};
    var custom = (fields || []).map(function (f) {
        // a linked student's grade / academic year is filled in from their account when left empty
        var hint = CFM_ENROLMENT_FIELDS[f.key] && r.recipientLoginId ? f.label + ' (from their account)' : f.label;
        return '<input type="text" class="cfm-recipient-custom" data-key="' + cfmEscape(f.key) + '" placeholder="'
            + cfmEscape(hint) + '" aria-label="' + cfmEscape(f.label) + '" value="' + cfmEscape(values[f.key] || '') + '" />';
    }).join('');
    var tag = r.recipientLoginId
        ? '<span class="cfm-row-tag" title="Linked to this person\'s account: it shows on their My Certificates page">'
            + (r.grade ? cfmEscape(r.grade) : 'Account') + '</span>'
        : '';
    return '<div class="cfm-recipient-row"' + (r.recipientLoginId ? ' data-login-id="' + parseInt(r.recipientLoginId, 10) + '"' : '')
        + (r.grade ? ' data-grade="' + cfmEscape(r.grade) + '"' : '') + '>'
        + '<input type="text" class="cfm-recipient-name" placeholder="Full name" aria-label="Full name" style="flex:2;" value="' + cfmEscape(r.recipientName || '') + '" />'
        + tag
        + '<input type="email" class="cfm-recipient-email" placeholder="Email (optional)" aria-label="Email" style="flex:2;" value="' + cfmEscape(r.recipientEmail || '') + '" />'
        + custom
        + '<button type="button" class="cfm-btn cfm-btn-danger" onclick="cfmRemoveRecipientRow(this)" aria-label="Remove recipient">&times;</button>'
        + '</div>';
}

/* custom field inputs above the recipients: required details (single) or values shared by everyone (bulk) */
function cfmCustomInputsHtml(fields, bulk, values) {
    if (!fields || !fields.length) { return ''; }
    values = values || {};
    var inputs = fields.map(function (f) {
        return '<div class="cfm-field"><label>' + cfmEscape(f.label) + (bulk ? '' : ' *') + '</label>'
            + '<input type="text" class="cfm-custom-shared" data-key="' + cfmEscape(f.key) + '" aria-label="' + cfmEscape(f.label)
            + '" value="' + cfmEscape(values[f.key] || '') + '" /></div>';
    }).join('');
    var title = bulk
        ? 'Same for everyone <span style="font-weight:400;color:#7a7f95;">— a value in a recipient row below overrides it</span>'
        : 'Certificate details';
    return '<div class="cfm-custom-box"><h6>' + title + '</h6><div class="cfm-form-row" style="margin-bottom:0;">' + inputs + '</div></div>';
}

/* what came out of an uploaded sheet: loaded rows, skipped rows and column problems */
function cfmSheetSummaryHtml(d) {
    var errors = d.errors || [];
    var notes = errors.slice(0, 10).map(cfmEscape);
    if (errors.length > 10) { notes.push('…and ' + (errors.length - 10) + ' more'); }
    if (d.studentsMatched) {
        notes.push('<b>' + d.studentsMatched + '</b> row(s) without an email were matched by name to an enrolled student; their email was taken from the account.');
    }
    if ((d.ambiguousNames || []).length) {
        notes.push('More than one enrolled student is called ' + d.ambiguousNames.slice(0, 5).map(function (n) { return '<b>' + cfmEscape(n) + '</b>'; }).join(', ')
            + (d.ambiguousNames.length > 5 ? ' and ' + (d.ambiguousNames.length - 5) + ' more' : '') + ': add their email, or pick them with Add students.');
    }
    if ((d.missingColumns || []).length) {
        notes.push('No column for <b>' + d.missingColumns.map(cfmEscape).join(', ')
            + '</b>: fill it in "Same for everyone" or in each row.');
    }
    if ((d.ignoredColumns || []).length) {
        notes.push('Ignored columns: ' + d.ignoredColumns.map(cfmEscape).join(', '));
    }
    return '<div class="cfm-sheet-summary"><b>' + (d.recipients || []).length + '</b> recipient(s) loaded from '
        + (d.totalRows || 0) + ' row(s).' + (notes.length ? '<ul><li>' + notes.join('</li><li>') + '</li></ul>' : '') + '</div>';
}

/* the activity a bulk issue is linked to (its attendees were added) */
function cfmSourceInfoHtml(source) {
    if (!source) { return ''; }
    return '<div class="cfm-source"><i class="fa fa-link"></i><span>Linked to the activity <b>' + cfmEscape(source.title)
        + '</b>: the certificates are recorded against it and show on each student\'s My Certificates page.</span>'
        + '<button type="button" onclick="cfmClearSource()" aria-label="Unlink the activity" title="Unlink">&times;</button></div>';
}

function cfmActivityOptionHtml(a) {
    var label = (a.title || 'Untitled activity') + (a.activityType && a.activityType !== a.title ? ' · ' + a.activityType : '')
        + (a.startDate ? ' · ' + cfmFormatDate(a.startDate) : '');
    return '<option value="' + a.id + '">' + cfmEscape(label) + '</option>';
}

/* is this attendee ticked when the list opens? enough sessions, no certificate yet, and not staff at a student activity */
function cfmAttendeeDefaultOn(a, minSessions, activityFor) {
    var staff = /TEACHER|ADMIN/i.test(a.role || '');
    return a.sessionsAttended >= minSessions && !a.issuedCertCode && !(staff && !/teacher/i.test(activityFor || ''));
}

function cfmAttendeeTableHtml(d, minSessions) {
    var people = d.attendees || [];
    if (!people.length) {
        return '<div class="cfm-empty">No one has joined this activity\'s live sessions yet.</div>';
    }
    var activityFor = (d.activity || {}).activityFor;
    var body = people.map(function (a, i) {
        var on = cfmAttendeeDefaultOn(a, minSessions, activityFor);
        var tags = (a.recipientLoginId ? '' : ' <span class="cfm-chip cfm-neutral" title="Joined without their own link: the certificate will not show on any My Certificates page">Guest</span>')
            + (/TEACHER|ADMIN/i.test(a.role || '') ? ' <span class="cfm-chip cfm-neutral">Staff</span>' : '')
            + (a.issuedCertCode ? ' <span class="cfm-chip cfm-valid" title="Already issued for this activity">Has ' + cfmEscape(a.issuedCertCode) + '</span>' : '');
        return '<tr class="' + (on ? '' : 'cfm-att-off') + '">'
            + '<td><input type="checkbox" class="cfm-att-pick" data-index="' + i + '"' + (on ? ' checked' : '')
            + ' aria-label="Select ' + cfmEscape(a.recipientName) + '" onchange="cfmOnAttendeePick(this)" /></td>'
            + '<td>' + cfmEscape(a.recipientName) + tags + '</td>'
            + '<td style="word-break:break-all;">' + (a.recipientEmail ? cfmEscape(a.recipientEmail) : '<span style="color:#9aa0b5;">—</span>') + '</td>'
            + '<td>' + a.sessionsAttended + (d.sessionsHeld ? ' / ' + d.sessionsHeld : '') + '</td>'
            + '<td>' + (a.minutesAttended || 0) + ' min</td>'
            + '</tr>';
    }).join('');
    return '<div class="cfm-att-wrap"><table class="cfm-table"><thead><tr>'
        + '<th><input type="checkbox" id="cfmAttAll" aria-label="Select everyone" onchange="cfmPickAllAttendees(this.checked)" /></th>'
        + '<th>Name</th><th>Email</th><th>Sessions</th><th>Time</th></tr></thead><tbody>' + body + '</tbody></table></div>';
}

function cfmActivityModalHtml() {
    return `
    <div class="modal fade" id="cfmActivityModal" tabindex="-1" role="dialog" aria-labelledby="cfmActivityModalTitle">
      <div class="modal-dialog cfm-modal-box" role="document">
        <div class="modal-content custom-field-scope cfm-scope">
          <div class="modal-header">
            <h5 class="modal-title" id="cfmActivityModalTitle">Add activity attendees</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">&times;</button>
          </div>
          <div class="modal-body">
            <div class="cfm-form-row">
              <div class="cfm-field" style="flex:3;"><label for="cfmActivitySelect">Activity</label>
                <select id="cfmActivitySelect" onchange="cfmLoadAttendees()"><option value="">Loading…</option></select>
              </div>
              <div class="cfm-field" style="flex:1;min-width:140px;"><label for="cfmMinSessions">Min. sessions attended</label>
                <input type="number" id="cfmMinSessions" min="1" value="1" onchange="cfmApplyMinSessions()" />
              </div>
            </div>
            <div id="cfmAttendeeSummary" class="cfm-att-note"></div>
            <div id="cfmAttendeeList"><div class="cfm-empty">Choose an activity to see who attended its live sessions.</div></div>
          </div>
          <div class="modal-footer">
            <button type="button" class="cfm-btn cfm-btn-light" data-dismiss="modal">Cancel</button>
            <button type="button" class="cfm-btn cfm-btn-primary" id="cfmAddAttendeesBtn" onclick="cfmAddPickedAttendees()" disabled>Add to recipients</button>
          </div>
        </div>
      </div>
    </div>`;
}

function cfmGradeOptionsHtml(grades, firstLabel) {
    return '<option value="">' + cfmEscape(firstLabel) + '</option>' + (grades || []).map(function (g) {
        return '<option value="' + g.standardId + '">' + cfmEscape(g.name) + ' (' + g.students + ')</option>';
    }).join('');
}

/* one suggestion under the single-recipient student search */
function cfmSuggestItemHtml(st, i) {
    return '<button type="button" class="cfm-suggest-item" role="option" data-index="' + i + '" onclick="cfmPickSingleStudent(' + i + ')">'
        + '<span><b>' + cfmEscape(st.recipientName) + '</b>' + (st.grade ? ' <span class="cfm-chip cfm-neutral">' + cfmEscape(st.grade) + '</span>' : '') + '</span>'
        + '<small>' + (st.recipientEmail ? cfmEscape(st.recipientEmail) : 'no email') + '</small></button>';
}

/* the student a single certificate is linked to */
function cfmSinglePickedHtml(st) {
    if (!st) { return ''; }
    return '<div class="cfm-linked"><i class="fa fa-graduation-cap" aria-hidden="true"></i><span>Student <b>' + cfmEscape(st.recipientName) + '</b>'
        + (st.grade ? ' · ' + cfmEscape(st.grade) : '') + ': the certificate will show on their My Certificates page.'
        + (st.recipientEmail ? '' : ' <span class="cfm-warn">No email on their account; add one below to email it.</span>') + '</span>'
        + '<button type="button" class="cfm-link-btn" onclick="cfmClearSingleStudent()">Change</button></div>';
}

/* students found in the Add students picker; inList = account ids already in the recipients */
function cfmStudentTableHtml(students, picks, inList) {
    if (!students.length) {
        return '<div class="cfm-empty">No enrolled student matches.</div>';
    }
    var body = students.map(function (st, i) {
        var already = !!inList[st.recipientLoginId];
        var on = !already && !!picks[st.recipientLoginId];
        return '<tr class="' + (already ? 'cfm-att-in' : (on ? '' : 'cfm-att-off')) + '">'
            + '<td><input type="checkbox" class="cfm-stu-pick" data-index="' + i + '"' + (on ? ' checked' : '') + (already ? ' disabled' : '')
            + ' aria-label="Select ' + cfmEscape(st.recipientName) + '" onchange="cfmOnStudentPick(this)" /></td>'
            + '<td>' + cfmEscape(st.recipientName) + (already ? ' <span class="cfm-chip cfm-valid">In the list</span>' : '') + '</td>'
            + '<td>' + cfmEscape(st.grade || '') + (st.learningPlan ? '<div class="cfm-att-note" style="margin:2px 0 0;">' + cfmEscape(st.learningPlan) + '</div>' : '') + '</td>'
            + '<td style="word-break:break-all;">' + (st.recipientEmail ? cfmEscape(st.recipientEmail) : '<span class="cfm-chip cfm-inactive" title="The certificate cannot be emailed">No email</span>') + '</td>'
            + '</tr>';
    }).join('');
    return '<div class="cfm-att-wrap"><table class="cfm-table"><thead><tr>'
        + '<th><input type="checkbox" id="cfmStuAll" aria-label="Select all shown" onchange="cfmPickAllStudents(this.checked)" /></th>'
        + '<th>Name</th><th>Grade / plan</th><th>Email</th></tr></thead><tbody>' + body + '</tbody></table></div>';
}

function cfmStudentModalHtml() {
    return `
    <div class="modal fade" id="cfmStudentModal" tabindex="-1" role="dialog" aria-labelledby="cfmStudentModalTitle">
      <div class="modal-dialog cfm-modal-box" role="document">
        <div class="modal-content custom-field-scope cfm-scope">
          <div class="modal-header">
            <h5 class="modal-title" id="cfmStudentModalTitle">Add students</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">&times;</button>
          </div>
          <div class="modal-body">
            <div class="cfm-form-row" style="margin-bottom:6px;">
              <div class="cfm-field" style="flex:1;min-width:180px;"><label for="cfmStudentGrade">Grade</label>
                <select id="cfmStudentGrade" class="cfm-grade-select" onchange="cfmSearchStudents()"><option value="">Loading…</option></select>
              </div>
              <div class="cfm-field" style="flex:1;min-width:180px;"><label for="cfmStudentPlan">Learning plan</label>
                <select id="cfmStudentPlan" class="cfm-plan-select" onchange="cfmSearchStudents()"><option value="">All learning plans</option></select>
              </div>
              <div class="cfm-field" style="flex:2;"><label for="cfmStudentSearch">Name or email</label>
                <input type="search" id="cfmStudentSearch" placeholder="Search students…" autocomplete="off" />
              </div>
            </div>
            <div id="cfmStudentSummary" class="cfm-att-note">Only currently enrolled students are listed.</div>
            <div id="cfmStudentList"><div class="cfm-empty">Choose a grade or learning plan, or type a name.</div></div>
          </div>
          <div class="modal-footer">
            <button type="button" class="cfm-btn cfm-btn-light" data-dismiss="modal">Cancel</button>
            <button type="button" class="cfm-btn cfm-btn-primary" id="cfmAddStudentsBtn" onclick="cfmAddPickedStudents()" disabled>Add to recipients</button>
          </div>
        </div>
      </div>
    </div>`;
}

/* ---- requests from students ---- */

var CFM_REQUEST_STATUS = {
    PENDING: ['Requested', 'cfm-pending'], UNDER_REVIEW: ['Under review', 'cfm-pending'], GENERATING: ['Generating certificate', 'cfm-pending'],
    DISPATCHING: ['Dispatching', 'cfm-pending'], PROCESSING: ['Being issued', 'cfm-pending'], APPROVED: ['Certificate generated', 'cfm-valid'],
    REJECTED: ['Rejected', 'cfm-inactive'], CANCELLED: ['Cancelled', 'cfm-muted']
};
/* stages an admin moves an open request through; the student sees them (Approve gives "Certificate generated") */
var CFM_REQUEST_STAGES = [['PENDING', 'Requested'], ['UNDER_REVIEW', 'Under review'], ['GENERATING', 'Generating certificate'],
    ['DISPATCHING', 'Dispatching (physical copy)']];

function cfmRequestIsOpen(r) {
    return CFM_REQUEST_STAGES.some(function (s) { return s[0] === r.status; });
}

function cfmStageSelectHtml(r) {
    return '<select class="cfm-stage" aria-label="Stage shown to the student" onchange="cfmSetStage(' + r.id + ', this)">'
        + CFM_REQUEST_STAGES.map(function (s) {
            return '<option value="' + s[0] + '"' + (s[0] === r.status ? ' selected' : '') + '>' + s[1] + '</option>';
        }).join('') + '</select>';
}

function cfmRequestStatusHtml(status) {
    var s = CFM_REQUEST_STATUS[status] || [status || '', 'cfm-muted'];
    return '<span class="cfm-chip ' + s[1] + '">' + cfmEscape(s[0]) + '</span>';
}

function cfmRequestGradeText(r) {
    return [r.gradeLabel || r.grade, r.academicYear].filter(function (v) { return v; }).join(' · ');
}

function cfmRequestsTableHtml(rows, filtered) {
    if (!rows.length) {
        return '<div class="cfm-empty">' + (filtered ? 'No request matches your search.' : 'No requests here.') + '</div>';
    }
    var body = rows.map(function (r) {
        var actions;
        if (cfmRequestIsOpen(r)) {
            actions = '<div class="cfm-req-actions">' + cfmStageSelectHtml(r)
                + '<button type="button" class="cfm-btn cfm-btn-primary" onclick="cfmOpenApprove(' + r.id + ')" title="Issue the certificate (final stage)">Approve</button>'
                + '<button type="button" class="cfm-btn cfm-btn-danger" onclick="cfmOpenReject(' + r.id + ')">Reject</button></div>';
        } else if (r.status === 'APPROVED') {
            actions = r.certCode ? '<span class="cfm-req-sub">' + cfmEscape(r.certCode) + '</span>' : '';
        } else if (r.status === 'REJECTED') {
            actions = '<span class="cfm-req-sub" title="Reason given">' + cfmEscape(r.rejectReason || '') + '</span>';
        } else {
            actions = '';
        }
        return '<tr>'
            + '<td><b>' + cfmEscape(r.studentName || '') + '</b><div class="cfm-req-sub">' + cfmEscape(r.studentEmail || 'no email') + '</div></td>'
            + '<td>' + cfmEscape(r.typeName || '') + '</td>'
            + '<td>' + cfmEscape(cfmRequestGradeText(r)) + '</td>'
            + '<td style="max-width:220px;">' + (r.purpose ? cfmEscape(r.purpose) : '<span style="color:#9aa0b5;">—</span>') + '</td>'
            + '<td>' + cfmFormatDate(r.requestedAt) + '</td>'
            + '<td>' + (cfmRequestIsOpen(r) ? '' : cfmRequestStatusHtml(r.status)) + '</td>'
            + '<td>' + actions + '</td></tr>';
    }).join('');
    return '<table class="cfm-table"><thead><tr><th>Student</th><th>Certificate</th><th>Grade</th><th>Purpose</th><th>Requested</th><th>Status</th><th>Stage / action</th></tr></thead>'
        + '<tbody>' + body + '</tbody></table>';
}

/* what the admin is about to approve */
function cfmRequestSummaryHtml(r) {
    return '<div class="cfm-summary"><div><b>' + cfmEscape(r.studentName || '') + '</b> asks for a <b>' + cfmEscape(r.typeName || '') + '</b></div>'
        + (cfmRequestGradeText(r) ? '<div>For ' + cfmEscape(cfmRequestGradeText(r)) + '</div>' : '')
        + (r.purpose ? '<div>Purpose: ' + cfmEscape(r.purpose) + '</div>' : '')
        + '<div class="cfm-req-sub">Requested ' + cfmFormatDate(r.requestedAt) + ' · ' + cfmEscape(r.studentEmail || 'no email on the account') + '</div></div>';
}

function cfmApproveModalHtml() {
    return `
    <div class="modal fade" id="cfmApproveModal" tabindex="-1" role="dialog" aria-labelledby="cfmApproveTitle">
      <div class="modal-dialog cfm-modal-box" role="document">
        <div class="modal-content custom-field-scope cfm-scope">
          <div class="modal-header">
            <h5 class="modal-title" id="cfmApproveTitle">Approve request</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">&times;</button>
          </div>
          <div class="modal-body">
            <div id="cfmApproveSummary"></div>
            <div class="cfm-form-row">
              <div class="cfm-field"><label for="cfmApproveTemplate">Template</label><select id="cfmApproveTemplate" onchange="cfmRenderApproveFields()"></select></div>
              <div class="cfm-field" style="flex:0 0 180px;min-width:160px;"><label for="cfmApproveDate">Issue date</label><input type="date" id="cfmApproveDate" /></div>
            </div>
            <div id="cfmApproveFields"></div>
            <div class="cfm-att-note" id="cfmApproveEmailNote"></div>
          </div>
          <div class="modal-footer">
            <button type="button" class="cfm-btn cfm-btn-light" data-dismiss="modal">Cancel</button>
            <button type="button" class="cfm-btn cfm-btn-primary" id="cfmApproveBtn" onclick="cfmSubmitApprove()"><i class="fa fa-check mr-1"></i> Approve and issue</button>
          </div>
        </div>
      </div>
    </div>`;
}

function cfmRejectModalHtml() {
    return `
    <div class="modal fade" id="cfmRejectModal" tabindex="-1" role="dialog" aria-labelledby="cfmRejectTitle">
      <div class="modal-dialog" role="document" style="max-width:520px;">
        <div class="modal-content custom-field-scope cfm-scope">
          <div class="modal-header">
            <h5 class="modal-title" id="cfmRejectTitle">Reject request</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">&times;</button>
          </div>
          <div class="modal-body">
            <div id="cfmRejectSummary"></div>
            <div class="cfm-field"><label for="cfmRejectReason">Reason (the student sees this and gets it by email) *</label>
              <textarea id="cfmRejectReason" rows="3" maxlength="500" placeholder="e.g. Your fees for this year are pending."></textarea></div>
          </div>
          <div class="modal-footer">
            <button type="button" class="cfm-btn cfm-btn-light" data-dismiss="modal">Cancel</button>
            <button type="button" class="cfm-btn cfm-btn-danger" onclick="cfmSubmitReject()">Reject request</button>
          </div>
        </div>
      </div>
    </div>`;
}

/* one editable row of the request types master; t = {} for a new one */
function cfmTypeRowHtml(t, templates) {
    var opts = '<option value="">Choose when approving</option>' + templates.map(function (x) {
        return '<option value="' + x.id + '"' + (x.id === t.templateId ? ' selected' : '') + '>' + cfmEscape(x.templateName) + '</option>';
    }).join('');
    return '<tr data-id="' + (t.id || '') + '">'
        + '<td><input type="number" class="cfm-type-order" min="0" value="' + (t.orderSet != null ? parseInt(t.orderSet, 10) : '') + '" aria-label="Order" /></td>'
        + '<td><input type="text" class="cfm-type-name" maxlength="150" value="' + cfmEscape(t.typeName || '') + '" placeholder="e.g. Bonafide Certificate" aria-label="Name" /></td>'
        + '<td><select class="cfm-type-template" aria-label="Template">' + opts + '</select></td>'
        + '<td style="text-align:center;"><input type="checkbox" class="cfm-type-ask"' + (t.askName ? ' checked' : '') + ' aria-label="Student types a name" /></td>'
        + '<td style="text-align:center;"><input type="checkbox" class="cfm-type-active"' + (t.id && !t.active ? '' : ' checked') + ' aria-label="Students can request it" /></td>'
        + '<td><div class="cfm-req-actions"><button type="button" class="cfm-btn cfm-btn-primary" onclick="cfmSaveType(this)">Save</button>'
        + (t.id ? '<button type="button" class="cfm-btn cfm-btn-danger" onclick="cfmDeleteType(this)" aria-label="Remove">&times;</button>' : '') + '</div></td></tr>';
}

function cfmTypesModalHtml() {
    return `
    <div class="modal fade" id="cfmTypesModal" tabindex="-1" role="dialog" aria-labelledby="cfmTypesTitle">
      <div class="modal-dialog" role="document" style="max-width:920px;">
        <div class="modal-content custom-field-scope cfm-scope">
          <div class="modal-header">
            <h5 class="modal-title" id="cfmTypesTitle">Request types</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">&times;</button>
          </div>
          <div class="modal-body">
            <div class="cfm-att-note" style="margin-top:0;">What students can choose when they request a certificate. Untick <b>Shown</b> to hide one;
              <b>Ask name</b> lets the student type what they need (like "Others"). The template is offered first when you approve.</div>
            <div style="overflow-x:auto;"><table class="cfm-table cfm-types"><thead><tr><th>Order</th><th>Name</th><th>Template</th><th>Ask name</th><th>Shown</th><th></th></tr></thead>
              <tbody id="cfmTypesBody"><tr><td colspan="6" class="cfm-empty">Loading…</td></tr></tbody></table></div>
            <button type="button" class="cfm-btn cfm-btn-light" style="margin-top:10px;" onclick="cfmAddTypeRow()"><i class="fa fa-plus mr-1"></i> Add request type</button>
          </div>
          <div class="modal-footer"><button type="button" class="cfm-btn cfm-btn-light" data-dismiss="modal">Done</button></div>
        </div>
      </div>
    </div>`;
}

function cfmEmailCellHtml(c) {
    var chip = {
        PENDING: '<span class="cfm-chip cfm-warning" title="Sent once the PDF is ready">Waiting</span>',
        SENT: '<span class="cfm-chip cfm-valid" title="' + cfmEscape(cfmFormatDate(c.emailedAt)) + '">Sent</span>',
        FAILED: '<span class="cfm-chip cfm-inactive">Failed</span>'
    }[c.emailStatus] || '';
    if (!c.recipientEmail) { return '<span style="color:#9aa0b5;">—</span>'; }
    var canSend = c.status !== 'Revoked' && c.pdfStatus === 'READY' && c.emailStatus !== 'PENDING';
    var label = (c.emailStatus === 'SENT' || c.emailStatus === 'FAILED') ? 'Resend' : 'Send';
    return '<div class="cfm-email-addr">' + cfmEscape(c.recipientEmail) + '</div><div class="cfm-email-actions">' + chip
        + (canSend ? '<button type="button" class="cfm-btn cfm-btn-light cfm-btn-sm" onclick="cfmSendEmail(' + c.id + ')"><i class="fa fa-envelope-o mr-1"></i> ' + label + '</button>' : '')
        + '</div>';
}

/* confirm / input modal markup; opened by cfmDialog */
function cfmDialogHtml(o) {
    var tone = o.tone === 'danger' ? 'danger' : 'primary';
    var icon = o.icon || (tone === 'danger' ? 'fa-exclamation-triangle' : 'fa-question-circle');
    var message = cfmEscape(o.message || '').replace(/\n/g, '<br>');
    var input = '';
    if (o.input) {
        var attrs = 'id="cfmDialogInput" class="form-control" maxlength="' + (o.input.maxLength || 250) + '" placeholder="' + cfmEscape(o.input.placeholder || '') + '"';
        input = '<div class="form-group mb-0 mt-3"><label for="cfmDialogInput" style="font-size:13px;font-weight:600;color:#212529;">' + cfmEscape(o.input.label || '') + '</label>'
            + (o.input.multiline ? '<textarea ' + attrs + ' rows="3"></textarea>' : '<input type="text" ' + attrs + ' autocomplete="off" />')
            + '<div class="invalid-feedback">This is required.</div></div>';
    }
    return `
    <div class="modal fade fade-scale" id="cfmDialog" tabindex="-1" role="dialog" aria-labelledby="cfmDialogTitle">
      <div class="modal-dialog ${o.size === 'sm' ? 'modal-sm' : 'modal-md'} modal-dialog-centered box-shadow-none" role="document">
        <div class="modal-content">
          <div class="modal-header pt-2 pb-2 bg-${tone} text-white">
            <h5 class="modal-title" id="cfmDialogTitle"><i class="fa ${icon} mr-2" aria-hidden="true"></i>${cfmEscape(o.title || 'Please confirm')}</h5>
            <button type="button" class="close text-white${tone === 'danger' ? ' close-with-red-color' : ''}" style="opacity:1;" data-dismiss="modal" aria-label="Close">&times;</button>
          </div>
          <div class="modal-body">
            <p class="mb-0" style="font-size:14px;color:#212529;">${message}</p>${input}
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-light" data-dismiss="modal">${cfmEscape(o.cancelText || 'Cancel')}</button>
            ${o.altText ? '<button type="button" class="btn btn-info" data-cfm-choice="alt">' + cfmEscape(o.altText) + '</button>' : ''}
            <button type="button" class="btn btn-${tone}" data-cfm-choice="ok">${cfmEscape(o.okText || 'OK')}</button>
          </div>
        </div>
      </div>
    </div>`;
}

function cfmTemplateModalHtml() {
    return `
    <div class="modal fade" id="cfmTemplateModal" tabindex="-1" role="dialog">
      <div class="modal-dialog cfm-modal-box" role="document">
        <div class="modal-content custom-field-scope cfm-scope">
          <div class="modal-header">
            <h5 class="modal-title" id="cfmTemplateModalTitle">New template</h5>
            <button type="button" class="close" data-dismiss="modal">&times;</button>
          </div>
          <div class="modal-body">
            <input type="hidden" id="cfmTemplateId" />
            <div class="cfm-form-row">
              <div class="cfm-field"><label>Template name</label><input type="text" id="cfmTemplateName" /></div>
              <div class="cfm-field"><label for="cfmTemplateCategory">Certificate type</label><div id="cfmTemplateCategoryBox" style="display:flex;flex-direction:column;gap:6px;"></div></div>
            </div>
            <div class="cfm-form-row">
              <div class="cfm-field"><label>Page format</label>
                <select id="cfmTemplateFormat"><option>A4</option><option>Letter</option><option>Legal</option></select>
              </div>
              <div class="cfm-field"><label>Orientation</label>
                <select id="cfmTemplateOrientation"><option>Landscape</option><option>Portrait</option></select>
              </div>
              <div class="cfm-field"><label>Status</label>
                <select id="cfmTemplateStatus"><option>Active</option><option>Inactive</option></select>
              </div>
            </div>
            <div class="cfm-field" style="margin-bottom:12px;">
              <label>Template HTML — use {{recipientName}}, {{activityTitle}}, {{issueDate}}, {{certCode}}, {{grade}}, {{academicYear}}, {{schoolName}}, {{qrCodeImage}}</label>
              <textarea id="cfmTemplateHtml" rows="10" placeholder="<div style='...'>Awarded to {{recipientName}} …</div>"></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="cfm-btn cfm-btn-light" data-dismiss="modal">Cancel</button>
            <button type="button" class="cfm-btn cfm-btn-primary" onclick="cfmSaveTemplate()">Save template</button>
          </div>
        </div>
      </div>
    </div>`;
}
