var AI_EMAIL_DRAFT_STATE = {
    drafts: {},        // leadId -> draft object (in-session edits)
    allData: [],       // raw API response array (current page only)
    sortField: 'followUpDueDate',
    sortDir: 'asc',
    page: 1,
    pageSize: 10,
    allCounselorAccess: false,
    totalPages: 1,
    totalRecords: 0
};

// ── Entry point ────────────────────────────────────────────────────────────────

async function renderAiEmailDraftDashboard(title, roleAndModule, schoolId, userId, userRole) {
    ROLE_MODULE = roleAndModule;
    $('#dashboardContentInHTML').html(getAiEmailDraftContent(title));
    await initAiEmailDraftFilters();
    bindAiEmailDraftEvents();
    loadAiDraftLearningCount();
    // Auto-load last 7 days on page open
    $('#aiEmailDraftDateType').val('WEEK').trigger('change');
    fetchAiEmailDrafts();
}

function loadAiDraftLearningCount() {
    var params = { userId: USER_ID, schoolId: SCHOOL_ID };
    $.ajax({
        type: 'POST', contentType: APPLICATION_JSON_VALUE,
        url: getURLForHTML('/api/v1/leads', 'get-ai-draft-learning'),
        data: JSON.stringify(params), dataType: 'json',
        success: function (data) {
            // ADMIN-DASHBOARD-SPACIAL-RIGHTS se aata hai — role se andaza lagana band
            AI_EMAIL_DRAFT_STATE.allCounselorAccess = !!(data && data.allCounselorAccess);
            if (AI_EMAIL_DRAFT_STATE.allCounselorAccess) {
                // filter init isse pehle chal kar apni ID select kar chuka hota hai — use hata do
                $('#aiEmailDraftCounselorFilter')
                    .prop('disabled', false)
                    .removeData('lockedValue')
                    .val('')
                    .trigger('change');
            }
            if (data && data.learning) {
                var count = Array.isArray(data.learning) ? data.learning.length : 0;
                $('#aedLearningCount').text(count);
            }
        }
    });
}

// ── Filter init ────────────────────────────────────────────────────────────────

async function initAiEmailDraftFilters() {
    $('#aiEmailDraftDateType').select2({ theme: 'bootstrap4', minimumResultsForSearch: Infinity });
    $('#aiEmailDraftPriorityFilter').select2({ theme: 'bootstrap4', minimumResultsForSearch: Infinity });
    $('#aiEmailDraftStatusFilter').select2({ theme: 'bootstrap4', minimumResultsForSearch: Infinity });
    // Country dropdown — load from master (value = country ID)
    if (typeof getAllCountryList === 'function') {
        getAllCountryList('aiEmailDraftFilterForm', 'aiEmailDraftCountryFilter');
    }
    $('#aiEmailDraftCountryFilter').select2({ theme: 'bootstrap4' });

    // Campaign dropdown — load from master
    if (typeof callMasterCampainList === 'function') {
        callMasterCampainList('aiEmailDraftFilterForm', '', 'aiEmailDraftCampaignFilter');
    }
    $('#aiEmailDraftCampaignFilter').select2({ theme: 'bootstrap4' });

    // Exclude Status — LEAD-STATUS-LIST master se (multi select)
    if (typeof callLeadStatusList === 'function') {
        callLeadStatusList('aiEmailDraftFilterForm', 'B2C', 'aiEmailDraftExcludeStatus', false);
    }
    setTimeout(function () {
        $('#aiEmailDraftExcludeStatus option[value="0"]').remove();   // "Select Status" multi-select me nahi chahiye
        $('#aiEmailDraftExcludeStatus').select2({ theme: 'bootstrap4', placeholder: 'Exclude Status', allowClear: true });
    }, 800);

    // Lead Status (include) — LEAD-STATUS-LIST master se (multi select); Exclude ka ulta
    if (typeof callLeadStatusList === 'function') {
        callLeadStatusList('aiEmailDraftFilterForm', 'B2C', 'aiEmailDraftLeadStatus', false);
    }
    setTimeout(function () {
        $('#aiEmailDraftLeadStatus option[value="0"]').remove();   // "Select Status" multi-select me nahi chahiye
        $('#aiEmailDraftLeadStatus').select2({ theme: 'bootstrap4', placeholder: 'Lead Status', allowClear: true });
    }, 800);

    // Counselor dropdown — await data load, then init select2 so it picks up options correctly
    $('#aiEmailDraftCounselorFilter').html('<option value="">All Academic Counselor</option>');
    if (typeof callLeadAssignUserList === 'function') {
        await callLeadAssignUserList('aiEmailDraftFilterForm', 'B2C', 'aiEmailDraftCounselorFilter', true, true, USER_ID);
    }
    // Non-admin: lock dropdown to own counselor ID
    var isAdmin = (USER_ROLE === 'DIRECTOR' || USER_ROLE === 'SUPER_ADMIN')
               || AI_EMAIL_DRAFT_STATE.allCounselorAccess === true;
    if (!isAdmin) {
        $('#aiEmailDraftCounselorFilter').val(String(USER_ID)).prop('disabled', true);
    }
    $('#aiEmailDraftCounselorFilter').select2({ theme: 'bootstrap4' });

    // Custom date pickers
    if ($.fn.datepicker) {
        var today = new Date();
        $('#aiEmailDraftFromDate, #aiEmailDraftToDate').datepicker({ autoclose: true, format: 'yyyy-mm-dd', todayHighlight: true });
        $('#aiEmailDraftFromDate').datepicker('setDate', today);
        $('#aiEmailDraftToDate').datepicker('setDate', today);
    }

    // Show/hide custom date cols on date type change
    $('#aiEmailDraftDateType').off('change.aeddt').on('change.aeddt', function () {
        if ($(this).val() === 'CUSTOM') {
            $('.aed-custom-date-col').show();
        } else {
            $('.aed-custom-date-col').hide();
        }
    });
}

// ── Events ─────────────────────────────────────────────────────────────────────

function bindAiEmailDraftEvents() {
    $('#aiEmailDraftGenerateBtn').off('click').on('click', function () {
        AI_EMAIL_DRAFT_STATE.page = 1;
        fetchAiEmailDrafts();
    });

    // page size badalte hi pehle page se dobara load (pager dobara render hota hai, isliye delegated)
    $(document).off('change.aedps', '#aiEmailDraftPageSize').on('change.aedps', '#aiEmailDraftPageSize', function () {
        AI_EMAIL_DRAFT_STATE.pageSize = parseInt($(this).val(), 10) || 10;
        AI_EMAIL_DRAFT_STATE.page = 1;
        fetchAiEmailDrafts();
    });

    $('#aiEmailDraftLeadNoFilter').off('keypress.aedln').on('keypress.aedln', function (e) {
        if (e.which === 13) { e.preventDefault(); $('#aiEmailDraftGenerateBtn').trigger('click'); }
    });

    $('#aiEmailDraftResetBtn').off('click').on('click', function () {
        $('#aiEmailDraftDateType').val('TODAY').trigger('change');
        $('#aiEmailDraftPriorityFilter').val('').trigger('change');
        $('#aiEmailDraftStatusFilter').val('').trigger('change');
        $('#aiEmailDraftCountryFilter').val('').trigger('change');
        $('#aiEmailDraftCampaignFilter').val('').trigger('change');
        $('#aiEmailDraftLeadNoFilter').val('');
        AI_EMAIL_DRAFT_STATE.pageSize = 10;
        $('#aiEmailDraftExcludeStatus').val(null).trigger('change');
        $('#aiEmailDraftLeadStatus').val(null).trigger('change');
        var isAdmin = (USER_ROLE === 'DIRECTOR' || USER_ROLE === 'SUPER_ADMIN')
                   || AI_EMAIL_DRAFT_STATE.allCounselorAccess === true;
        if (isAdmin) {
            $('#aiEmailDraftCounselorFilter').val('').trigger('change');
        }
        $('.aed-custom-date-col').hide();
        if ($.fn.datepicker) {
            var today = new Date();
            $('#aiEmailDraftFromDate').datepicker('setDate', today);
            $('#aiEmailDraftToDate').datepicker('setDate', today);
        }
        // chal rahi background backfill / draft request ko bhi rok do, warna wo reset ke baad
        // purana data wapas memory me likh deti hai
        AED_BACKFILL.token++;
        AED_BACKFILL.queue = [];
        AED_BACKFILL.running = 0;
        AED_BACKFILL.active = false;
        AED_DRAFT_REQ.token++;

        AI_EMAIL_DRAFT_STATE.drafts = {};
        AI_EMAIL_DRAFT_STATE.allData = [];
        AI_EMAIL_DRAFT_STATE.page = 1;
        AI_EMAIL_DRAFT_STATE.totalPages = 1;
        AI_EMAIL_DRAFT_STATE.totalRecords = 0;
        renderAiEmailDraftTable([]);
        updateAiEmailDraftCards([]);
        $('#aiEmailDraftPagination').html('');
    });

    $('#aedSortPriority').off('click').on('click', function () {
        toggleSort('aiPriority');
    });

    $('#aedSortScore').off('click').on('click', function () {
        toggleSort('priorityScore');
    });

    $('#aedSortFollowUp').off('click').on('click', function () {
        toggleSort('followUpDueDate');
    });

    // accordion toggles in modal
    $(document).off('click.aed', '.aed-signal-header').on('click.aed', '.aed-signal-header', function () {
        var target = $($(this).data('target'));
        var chevron = $(this).find('.aed-chevron');
        if (target.is(':visible')) {
            target.slideUp(150);
            chevron.css('transform', '');
        } else {
            target.slideDown(150);
            chevron.css('transform', 'rotate(180deg)');
        }
    });

    // modal action buttons
    $('#aedModalSave').off('click').on('click', function () { saveAiEmailDraftEdits('saved'); });
    $('#aedModalCopy').off('click').on('click', copyAiEmailDraft);
    $('#aedModalRegenerate').off('click').on('click', function () { regenerateAiEmailDraft(); });

    // "Generate Draft" — draft tabhi banta hai jab counselor maange
    $(document).off('click.aedgen', '#aedGenerateDraftBtn').on('click.aedgen', '#aedGenerateDraftBtn', function () {
        var leadId = $('#aiEmailDraftModal').data('leadid');
        if (!leadId) { return; }
        var lang = $('#aedModalLanguage').val() || 'English';
        var busy = '<div class="text-center py-4 text-muted" style="font-size:13px;">'
                 + '<i class="fa fa-spinner fa-spin fa-lg mr-2 text-primary"></i>Generating draft… please wait (~10-15s)</div>';
        $('#aedTabEmail,#aedTabWhatsapp,#aedTabCall').html(busy);
        fetchFullDraft(leadId, lang);
    });
    $('#aedModalSendEmail').off('click').on('click', sendAiDraftEmail);

    // Feedback panel toggle
    $(document).off('click.aedfb', '#aedModalFeedbackToggle').on('click.aedfb', '#aedModalFeedbackToggle', function () {
        var $panel = $('#aedFeedbackPanel');
        if ($panel.is(':visible')) {
            $panel.slideUp(150);
            $(this).removeClass('active');
        } else {
            $panel.slideDown(150);
            $(this).addClass('active');
            $('#aedCounselorFeedback').focus();
        }
    });
    $(document).off('click.aedfbc', '#aedFeedbackClear').on('click.aedfbc', '#aedFeedbackClear', function () {
        $('#aedCounselorFeedback').val('');
    });
    $(document).off('click.aedfbr', '#aedModalRegenerateWithFeedback').on('click.aedfbr', '#aedModalRegenerateWithFeedback', function () {
        var feedback = $('#aedCounselorFeedback').val().trim();
        if (!feedback) { showMessageTheme2(0, 'Please write your feedback before applying.', '', true); return; }
        regenerateAiEmailDraft(feedback);
    });

    $(document).off('click.aedsl', '#aedModalSaveLearning').on('click.aedsl', '#aedModalSaveLearning', function () {
        var feedback = $('#aedCounselorFeedback').val().trim();
        if (!feedback) { showMessageTheme2(0, 'Please write your feedback first.', '', true); return; }
        saveAiDraftLearning(feedback);
    });

    // AI Learning button — open modal
    $('#aedLearningOpenBtn').off('click.aedlt').on('click.aedlt', function () {
        loadAiDraftLearningList();
        $('#aedLearningModal').modal('show');
    });

    // Counselor counts panel toggle
    $('#aedCounselorCountsToggle').off('click.aedct').on('click.aedct', function () {
        var $panel = $('#aedCounselorCountsPanel');
        var $chevron = $('.aed-counselor-chevron');
        if ($panel.is(':visible')) {
            $panel.slideUp(150);
            $chevron.css('transform', '');
        } else {
            $panel.slideDown(150);
            $chevron.css('transform', 'rotate(180deg)');
        }
    });

    // filter changes re-render table from cached data
    $('#aiEmailDraftPriorityFilter, #aiEmailDraftStatusFilter, #aiEmailDraftCountryFilter, #aiEmailDraftCampaignFilter').off('change.aedfilter').on('change.aedfilter', function () {
        renderAiEmailDraftTable(AI_EMAIL_DRAFT_STATE.allData);
    });
}

// ── Fetch ──────────────────────────────────────────────────────────────────────

function fetchAiEmailDrafts(singleLeadId, forcedLanguage) {
    var dateType = $('#aiEmailDraftDateType').val() || 'TODAY';
    var params = {
        schoolId: SCHOOL_ID,
        dateType:  dateType,
        dataType:  'DEMO',
        userId:   USER_ID,
        page:     singleLeadId ? 1 : (AI_EMAIL_DRAFT_STATE.page || 1),
        pageSize: AI_EMAIL_DRAFT_STATE.pageSize || 10
    };
    // list turant aaye — AI wale fields background me bharte hain (Lead & Demo Dashboard jaisa)
    if (!singleLeadId) { params.skipAi = true; }
    if (dateType === 'CUSTOM') {
        params.startDate = ($('#aiEmailDraftFromDate').val() || '') + ' 00:00';
        params.endDate   = ($('#aiEmailDraftToDate').val()   || '') + ' 23:59';
    }
    // Read counselor value even if dropdown is disabled
    var $counselorEl = $('#aiEmailDraftCounselorFilter');
    var counselorId  = $counselorEl.val() || $counselorEl.data('lockedValue') || '';
    // special-rights wale user ki apni id zabardasti mat bhejo — unhe sabka data milna chahiye
    if (!counselorId && $counselorEl.prop('disabled') && !AI_EMAIL_DRAFT_STATE.allCounselorAccess) {
        counselorId = String(USER_ID);
    }
    if (counselorId) params.counselorId = counselorId;
    var countryVal  = $('#aiEmailDraftCountryFilter').val()   || '';
    var campaignVal = $('#aiEmailDraftCampaignFilter').val()  || '';
    if (countryVal)  params.countryId = countryVal;
    if (campaignVal) params.campaign = campaignVal;
    // Search — Lead No / naam / email / phone, kuch bhi. Diya ho to date range ignore hota hai (backend me)
    var searchVal = ($('#aiEmailDraftLeadNoFilter').val() || '').trim();
    if (searchVal) params.search = searchVal;
    // Exclude Status — in statuses wali leads list se bahar rahengi
    var excludeStatusVals = $('#aiEmailDraftExcludeStatus').val() || [];
    excludeStatusVals = excludeStatusVals.filter(function (v) { return v && v !== '0'; });
    if (excludeStatusVals.length) params.excludeStatus = excludeStatusVals.join(',');
    // Lead Status (include) — sirf inhi status wali leads aayengi
    var leadStatusVals = $('#aiEmailDraftLeadStatus').val() || [];
    leadStatusVals = leadStatusVals.filter(function (v) { return v && v !== '0'; });
    if (leadStatusVals.length) params.leadStatus = leadStatusVals.join(',');
    if (singleLeadId)   params.leadId = singleLeadId;
    if (forcedLanguage) params.forcedLanguage = forcedLanguage;

    $('#aiEmailDraftTableBody').html('<tr><td colspan="13" class="text-center py-5"><i class="fa fa-spinner fa-spin fa-2x text-primary"></i><div class="mt-2 text-muted" style="font-size:13px;">AI is analysing lead timelines and generating drafts… this may take a moment.</div></td></tr>');
    $('#aiEmailDraftGenerateBtn').prop('disabled', true).html('<i class="fa fa-spinner fa-spin mr-1"></i> Generating…');
    console.log('[AI DRAFT] Fetching drafts with params:', params);
    $.ajax({
        type: 'POST',
        contentType: APPLICATION_JSON_VALUE,
        url: getURLForHTML('/api/v1/leads', 'get-lead-timeline-summary'),
        data: JSON.stringify(params),
        dataType: 'json',
        success: function (data) {
            var rows = Array.isArray(data) ? data : (data && data.data ? data.data : []);
            if (!rows.length && data && data.status === '3') { redirectLoginPage(); return; }
            if (!rows.length && data && data.status === '0') {
                showMessageTheme2(0, (data.message) ? data.message : 'No leads found.', '', true);
                return;
            }
            if (!singleLeadId) {
                AI_EMAIL_DRAFT_STATE.allData = rows;
            } else {
                rows.forEach(function (r) {
                    if (forcedLanguage) r.forcedLanguage = forcedLanguage;
                    var idx = AI_EMAIL_DRAFT_STATE.allData.findIndex(function (x) { return x.leadId === r.leadId; });
                    if (idx >= 0) AI_EMAIL_DRAFT_STATE.allData[idx] = r;
                    else AI_EMAIL_DRAFT_STATE.allData.push(r);
                    AI_EMAIL_DRAFT_STATE.drafts[r.leadId] = Object.assign({}, r);
                });
            }
            renderAiEmailDraftTable(AI_EMAIL_DRAFT_STATE.allData);
            updateAiEmailDraftCards(AI_EMAIL_DRAFT_STATE.allData);
            if (!singleLeadId) { aedStartAiBackfill(); }
            if (!singleLeadId && rows.length > 0 && rows[0].counselorCounts) {
                renderCounselorCountBoxes(rows[0].counselorCounts);
            }
            if (!singleLeadId) {
                AI_EMAIL_DRAFT_STATE.page         = (rows.length > 0 && rows[0].currentPage) || 1;
                AI_EMAIL_DRAFT_STATE.totalPages   = (rows.length > 0 && rows[0].totalPages)  || 1;
                AI_EMAIL_DRAFT_STATE.totalRecords = (rows.length > 0 && rows[0].totalRecords) || 0;
                renderAiEmailDraftPagination();
            }
            if (singleLeadId) {
                var fresh = AI_EMAIL_DRAFT_STATE.drafts[singleLeadId];
                if (fresh) openAiEmailDraftModal(fresh);
                showMessageTheme2(1, 'Draft re-generated successfully.', '', true);
            }
        },
        error: function () {
            showMessageTheme2(0, 'Unable to generate AI email drafts.', '', true);
        },
        complete: function () {
            $('#aiEmailDraftGenerateBtn').prop('disabled', false).html('<i class="fa fa-magic mr-1"></i> Generate Drafts');
        }
    });
}

// ── AI backfill ──────────────────────────────────────────────────────────────
// List bina AI ke turant aati hai; jin rows me AI fields khali hain unhe yahan se
// 3-3 karke bhara jata hai (har lead ka sirf table-field wala chhota AI call).
var AED_BACKFILL = { queue: [], running: 0, active: false, token: 0, attempts: {} };
var AED_BACKFILL_MAX_TRIES = 3;
var AED_BACKFILL_CONCURRENCY = 3;

function aedNeedsAi(d) {
    // 'pending' = AI chala hi nahi (server ne sirf fallback bhara). emailSubject ko check me
    // nahi rakhte — AI kabhi khali subject deta hai, us par baar-baar retry bekaar hai.
    return d.draftStatus === 'pending' || d.draftStatus === 'error' || !d.aiPriority;
}

function aedStartAiBackfill() {
    AED_BACKFILL.token++;
    var myToken = AED_BACKFILL.token;
    var pend = (AI_EMAIL_DRAFT_STATE.allData || []).filter(aedNeedsAi);
    // jinke paas transcript hai unhe pehle — unka analysis sabse zyada kaam ka hota hai
    pend.sort(function (a, b) { return (b.transcript ? 1 : 0) - (a.transcript ? 1 : 0); });
    AED_BACKFILL.queue    = pend.map(function (d) { return d.leadId; });
    AED_BACKFILL.attempts = {};
    AED_BACKFILL.running = 0;
    AED_BACKFILL.active  = AED_BACKFILL.queue.length > 0;
    if (!AED_BACKFILL.active) { return; }
    renderAiEmailDraftTable(AI_EMAIL_DRAFT_STATE.allData);   // "Analyzing…" dikhane ke liye
    for (var i = 0; i < AED_BACKFILL_CONCURRENCY; i++) { aedBackfillNext(myToken); }
}

function aedBackfillNext(myToken) {
    if (myToken !== AED_BACKFILL.token) { return; }            // filter/page badal gaya
    if (!AED_BACKFILL.queue.length) {
        if (AED_BACKFILL.running === 0) {
            AED_BACKFILL.active = false;
            renderAiEmailDraftTable(AI_EMAIL_DRAFT_STATE.allData);
            updateAiEmailDraftCards(AI_EMAIL_DRAFT_STATE.allData);
        }
        return;
    }
    var leadId = AED_BACKFILL.queue.shift();
    AED_BACKFILL.attempts[leadId] = (AED_BACKFILL.attempts[leadId] || 0) + 1;
    AED_BACKFILL.running++;

    var dateType = $('#aiEmailDraftDateType').val() || 'TODAY';
    var params = {
        schoolId: SCHOOL_ID, dataType: 'DEMO', userId: USER_ID,
        dateType: dateType, page: 1, pageSize: AI_EMAIL_DRAFT_STATE.pageSize || 10,
        leadId: String(leadId), bulkOnly: true
    };
    if (dateType === 'CUSTOM') {
        params.startDate = ($('#aiEmailDraftFromDate').val() || '') + ' 00:00';
        params.endDate   = ($('#aiEmailDraftToDate').val()   || '') + ' 23:59';
    }
    var $cEl = $('#aiEmailDraftCounselorFilter');
    var cId  = $cEl.val() || ($cEl.prop('disabled') ? String(USER_ID) : '');
    if (cId) { params.counselorId = cId; }

    $.ajax({
        type: 'POST', contentType: APPLICATION_JSON_VALUE,
        url: getURLForHTML('/api/v1/leads', 'get-lead-timeline-summary'),
        data: JSON.stringify(params), dataType: 'json', timeout: 120000,
        global: false,   // background call — poore page ka loader mat dikhao
        success: function (data) {
            var rows = Array.isArray(data) ? data : (data && data.data ? data.data : []);
            rows.forEach(function (r) {
                var idx = AI_EMAIL_DRAFT_STATE.allData.findIndex(function (x) { return x.leadId == r.leadId; });
                if (idx >= 0) {
                    AI_EMAIL_DRAFT_STATE.allData[idx] = Object.assign({}, AI_EMAIL_DRAFT_STATE.allData[idx], r);
                }
                // table render drafts[] ko pehle dekhta hai — usme purani copy padi ho to
                // backfill ka naya data dikhta hi nahi, isliye wahan bhi merge kar dete hain
                if (AI_EMAIL_DRAFT_STATE.drafts[r.leadId]) {
                    AI_EMAIL_DRAFT_STATE.drafts[r.leadId] = Object.assign({}, AI_EMAIL_DRAFT_STATE.drafts[r.leadId], r);
                }
            });
            if (myToken === AED_BACKFILL.token) { renderAiEmailDraftTable(AI_EMAIL_DRAFT_STATE.allData); }
        },
        complete: function () {
            // abhi bhi pending hai (AI fail/timeout) to dobara koshish — max 3 baar
            var cur = (AI_EMAIL_DRAFT_STATE.allData || []).find(function (x) { return x.leadId == leadId; });
            if (cur && aedNeedsAi(cur) && (AED_BACKFILL.attempts[leadId] || 0) < AED_BACKFILL_MAX_TRIES
                && myToken === AED_BACKFILL.token) {
                AED_BACKFILL.queue.push(leadId);
            }
            AED_BACKFILL.running--;
            aedBackfillNext(myToken);
        }
    });
}

// Last follow-up: date + chhota remark; lamba ho to "more" se poora remark expand row me
function aedLastFollowUpCell(d) {
    var date = d.lastFollowUpDate ? '<div style="font-size:11.5px;font-weight:600;">' + esc(d.lastFollowUpDate) + '</div>' : '';
    var rem  = (d.lastRemark || '').trim();
    if (!date && !rem) { return '<span class="text-muted">—</span>'; }
    if (!rem) { return date; }
    var short = rem.length > 60 ? rem.substring(0, 60) + '…' : rem;
    var more  = rem.length > 60
        ? ' <a href="javascript:void(0)" class="aed-analysis-toggle" data-leadid="' + esc(d.leadId) + '" '
          + 'style="font-size:11px;">more</a>'
        : '';
    return date + '<div class="text-muted" style="font-size:11.5px;line-height:1.4;">' + esc(short) + more + '</div>';
}

// Follow-up date nikal chuki ho to laal + "overdue" — counselor ko turant dikhe
function aedFollowUpCell(dateStr) {
    var txt = formatAedDate(dateStr) || '—';
    if (!dateStr) { return txt; }
    var d = new Date(dateStr);
    if (isNaN(d.getTime())) { return txt; }
    var today = new Date(); today.setHours(0, 0, 0, 0);
    d.setHours(0, 0, 0, 0);
    if (d < today) {
        return '<span style="color:#c62828;font-weight:600;">' + txt + '</span>'
             + '<br><small style="color:#c62828;">overdue</small>';
    }
    return txt;
}

// AI ka text list ki tarah dikhe: "(1) .. (2) .." ya "1." ya "-" ko <ol>/<ul> me badalta hai
function aedRichText(v) {
    if (!v) return '—';
    var raw = String(v).replace(/\s+/g, ' ').trim();

    // (1) ... (2) ... (3) ...
    var parts = raw.split(/\(\s*\d+\s*\)\s*/);
    if (parts.length >= 3) {
        var intro = (parts.shift() || '').trim();
        var lis = parts.map(function (x) {
            return '<li style="margin-bottom:4px;">' + esc(x.replace(/[;,]\s*$/, '').trim()) + '</li>';
        }).join('');
        return (intro ? '<div style="margin-bottom:6px;">' + esc(intro) + '</div>' : '')
             + '<ol style="margin:0;padding-left:18px;">' + lis + '</ol>';
    }

    // har line "1." / "1)" / "-" / "•" se shuru ho
    var lines = String(v).split(/\n+/).map(function (x) { return x.trim(); }).filter(Boolean);
    var marked = lines.filter(function (l) { return /^(\d+[\).]|[-•*])\s+/.test(l); });
    if (lines.length > 1 && marked.length >= 2) {
        var lis2 = lines.map(function (l) {
            return '<li style="margin-bottom:4px;">' + esc(l.replace(/^(\d+[\).]|[-•*])\s+/, '')) + '</li>';
        }).join('');
        return '<ul style="margin:0;padding-left:18px;">' + lis2 + '</ul>';
    }

    return esc(v).replace(/\n/g, '<br>');
}

// AI Analysis — wahi sections jo modal me dikhte hain, listing me expand karke
function aedAnalysisHtml(d) {
    // wahi global esc() jo table render karti hai
    var items = [
        ['fa-clock-o',      'Enrollment Urgency',      d.enrollmentUrgency],
        ['fa-users',        'Parent / Student Intent', d.intentSummary],
        ['fa-exclamation-triangle', 'Main Objection',  d.mainObjection],
        ['fa-random',       'Competitor Signals',      d.competitorSignals],
        ['fa-rocket',       'Next Best Action',        d.nextBestAction],
        ['fa-bell',         'CRM Alert / Task',        d.crmAlert],
        ['fa-info-circle',  'Why This Recommendation', d.explainableReason]
    ].filter(function (x) { return x[2]; });

    var lastRem = (d.lastRemark || '').trim();
    var remBlock = lastRem
        ? '<div style="flex:1 1 100%;background:#fffdf5;border:1px solid #f0e6c8;border-radius:6px;padding:10px 12px;">'
          + '<div style="font-size:11px;font-weight:700;color:#8a6d1f;margin-bottom:4px;">'
          + '<i class="fa fa-comment-o mr-1"></i>Last Follow-up Remark'
          + (d.lastFollowUpDate ? ' — ' + esc(d.lastFollowUpDate) : '') + '</div>'
          + '<div style="font-size:12px;color:#333;line-height:1.5;">' + aedRichText(lastRem) + '</div>'
          + '</div>'
        : '';

    if (!items.length && (d.lastRemark || '').trim()) {
        return '<div class="d-flex flex-wrap" style="gap:10px;">' + remBlock + '</div>';
    }
    if (!items.length) {
        return '<div class="text-muted" style="font-size:12px;">'
             + '<i class="fa fa-info-circle mr-1"></i>AI Analysis is not ready yet. '
             + 'Click "Open" — the analysis is generated along with the draft and will appear here.'
             + '</div>';
    }

    var cards = items.map(function (x) {
        return '<div style="flex:1 1 320px;min-width:260px;background:#fff;border:1px solid #e6eaf2;border-radius:6px;padding:10px 12px;">'
             + '<div style="font-size:11px;font-weight:700;color:#3d5af1;margin-bottom:4px;">'
                 + '<i class="fa ' + x[0] + ' mr-1"></i>' + x[1]
             + '</div>'
             + '<div style="font-size:12px;color:#333;line-height:1.5;">' + aedRichText(x[2]) + '</div>'
             + '</div>';
    }).join('');

    return '<div class="d-flex flex-wrap" style="gap:10px;">' + remBlock + cards + '</div>';
}

// ── Pagination (page size UI se: 10/20/50/100 — see AiEmailDraftUtil.getLeadsTimeLine) ──

function renderAiEmailDraftPagination() {
    var page  = AI_EMAIL_DRAFT_STATE.page || 1;
    var total = AI_EMAIL_DRAFT_STATE.totalPages || 1;
    var records = AI_EMAIL_DRAFT_STATE.totalRecords || 0;
    if (records === 0) {
        $('#aiEmailDraftPagination').html('');
        return;
    }
    var size  = AI_EMAIL_DRAFT_STATE.pageSize || 10;
    var from  = ((page - 1) * size) + 1;
    var to    = Math.min(page * size, records);

    $('#aiEmailDraftPageSize').val(String(size));   // top-left dropdown ko state ke saath rakho

    // page numbers — 5 ka window
    var start = Math.max(1, page - 2);
    var end   = Math.min(total, start + 4);
    start = Math.max(1, end - 4);
    var pageBtns = '';
    for (var i = start; i <= end; i++) {
        pageBtns += '<button type="button" class="btn ' + (i === page ? 'btn-primary' : 'btn-outline-secondary')
                 + ' aed-page-btn" data-page="' + i + '">' + i + '</button>';
    }

    var html = ''
        + '<div class="d-flex flex-wrap align-items-center justify-content-between" '
             + 'style="width:100%;gap:10px;border-top:1px solid #eee;padding-top:10px;">'
            + '<span class="text-muted" style="font-size:12px;white-space:nowrap;">'
                + 'Showing ' + from + '&ndash;' + to + ' of ' + records + ' lead(s)'
            + '</span>'
            + '<div class="btn-group btn-group-sm" role="group" style="white-space:nowrap;">'
                + '<button type="button" class="btn btn-outline-secondary" id="aiEmailDraftPrevPage" '
                    + (page <= 1 ? 'disabled' : '') + '><i class="fa fa-chevron-left"></i></button>'
                + pageBtns
                + '<button type="button" class="btn btn-outline-secondary" id="aiEmailDraftNextPage" '
                    + (page >= total ? 'disabled' : '') + '><i class="fa fa-chevron-right"></i></button>'
            + '</div>'
        + '</div>';
    $('#aiEmailDraftPagination').html(html);
    $('#aiEmailDraftPrevPage').off('click').on('click', function () { changeAiEmailDraftPage(page - 1); });
    $('#aiEmailDraftNextPage').off('click').on('click', function () { changeAiEmailDraftPage(page + 1); });
    $('.aed-page-btn').off('click').on('click', function () { changeAiEmailDraftPage(parseInt($(this).attr('data-page'), 10)); });
}

function changeAiEmailDraftPage(newPage) {
    if (newPage < 1 || newPage > (AI_EMAIL_DRAFT_STATE.totalPages || 1)) return;
    AI_EMAIL_DRAFT_STATE.page = newPage;
    fetchAiEmailDrafts();
}

// ── Render table ───────────────────────────────────────────────────────────────

function renderAiEmailDraftTable(rows) {
    var priorityFilter  = $('#aiEmailDraftPriorityFilter').val()  || '';
    var statusFilter    = $('#aiEmailDraftStatusFilter').val()    || '';
    var countryFilter   = $('#aiEmailDraftCountryFilter').val()   || '';
    var campaignFilter  = $('#aiEmailDraftCampaignFilter').val()  || '';

    var filtered = (rows || []).filter(function (r) {
        var d = AI_EMAIL_DRAFT_STATE.drafts[r.leadId] || r;
        if (priorityFilter && d.aiPriority !== priorityFilter)          return false;
        if (statusFilter   && d.draftStatus !== statusFilter)           return false;
        if (campaignFilter && (d.utmCampaign || '') !== campaignFilter) return false;
        return true;
    });

    if (AI_EMAIL_DRAFT_STATE.sortField) {
        var sf  = AI_EMAIL_DRAFT_STATE.sortField;
        var dir = AI_EMAIL_DRAFT_STATE.sortDir === 'asc' ? 1 : -1;
        filtered.sort(function (a, b) {
            var da = AI_EMAIL_DRAFT_STATE.drafts[a.leadId] || a;
            var db = AI_EMAIL_DRAFT_STATE.drafts[b.leadId] || b;
            var va = da[sf] || '', vb = db[sf] || '';
            if (sf === 'priorityScore') { va = parseInt(va) || 0; vb = parseInt(vb) || 0; }
            // Always push empty values to the bottom regardless of sort direction
            if (!va && vb) return 1;
            if (va && !vb) return -1;
            if (va < vb) return -1 * dir;
            if (va > vb) return 1 * dir;
            return 0;
        });
    }

    if (filtered.length === 0) {
        $('#aiEmailDraftTableBody').html('<tr><td colspan="13" class="text-center text-muted py-4">No drafts found.</td></tr>');
        return;
    }

    var html = '';
    filtered.forEach(function (row, idx) {
        var d = AI_EMAIL_DRAFT_STATE.drafts[row.leadId] || row;
        var pending = AED_BACKFILL.active && aedNeedsAi(d);
        var wait = '<span class="text-muted font-italic" style="font-size:11px;">Analyzing…</span>';
        var priorityBadge = pending ? wait : getPriorityBadge(d.aiPriority);
        var riskBadge     = pending ? wait : getRiskBadge(d.riskLevel);
        var statusBadge   = getDraftStatusBadge(d.draftStatus);
        var subjectPreview = (d.emailSubject || '').substring(0, 45) + ((d.emailSubject || '').length > 45 ? '…' : '');

        var hasAnalysis = !!(d.enrollmentUrgency || d.intentSummary || d.mainObjection
                          || d.competitorSignals || d.nextBestAction || d.crmAlert || d.explainableReason);

        html += '<tr>'
            + '<td style="white-space:nowrap;">' + (idx + 1)
                + '<a href="javascript:void(0)" class="aed-analysis-toggle ml-1" data-leadid="' + esc(d.leadId) + '" '
                  + 'title="AI Analysis dekhein" style="color:' + (hasAnalysis ? '#3d5af1' : '#b9bfcc') + ';">'
                  + '<i class="fa fa-chevron-down"></i></a>'
            + '</td>'
            + '<td><a href="javascript:void(0)" onclick="getAsPost(\'/dashboard/lead-data-list?moduleId=111&leadId=' + esc(d.leadNo || d.leadId) + '&leadFrom=LEAD&clickFrom=list&startDate=&endDate=&country=0&campaign=&currentPage=0&euid=' + ENCRYPTED_USER_ID + '&leadType=B2C\');">' + esc(d.leadNo || d.leadId) + '</a>'
                + (d.leadName ? '<br><span style="font-weight:600;">' + esc(d.leadName) + '</span>' : '')
                + (d.grade ? '<br><small class="text-muted">' + esc(d.grade) + '</small>' : '')
            + '</td>'
            + '<td>' + esc(d.country)
                + (d.utmCampaign ? '<br><small class="text-muted">' + esc(d.utmCampaign) + '</small>' : '')
                + (d.email ? '<br><small class="text-muted"><i class="fa fa-envelope-o mr-1"></i>' + esc(d.email) + '</small>' : '')
                + (d.phoneNo ? '<br><small class="text-muted"><i class="fa fa-phone mr-1"></i>' + esc(d.phoneNo) + '</small>' : '')
            + '</td>'
            + '<td style="max-width:170px;">' + esc(d.counselorName)
                + (d.demodatetime ? '<br><small class="text-muted">' + esc(d.demodatetime) + '</small>' : '')
            + '</td>'
            + '<td style="max-width:230px;">' + esc(d.leadStatus)
                + '<div style="margin-top:3px;">' + aedLastFollowUpCell(d) + '</div>'
            + '</td>'
            + '<td class="text-center">' + priorityBadge + '</td>'
            + '<td class="text-center">' + (pending ? '—' : '<strong>' + (d.priorityScore || 0) + '</strong>') + '</td>'
            + '<td class="text-center">' + riskBadge + '</td>'
            + '<td class="text-center">' + aedFollowUpCell(d.followUpDueDate) + '</td>'
            + '<td style="max-width:180px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="' + esc(d.emailSubject) + '">' + esc(d.emailSubject || '—') + '</td>'
            + '<td class="text-center">' + statusBadge + '</td>'
            + '<td class="text-center" style="white-space:nowrap;">'
                + '<button class="btn btn-primary btn-sm aed-open-modal-btn" style="height:28px;line-height:28px;padding:0 12px;font-size:12px;white-space:nowrap;" data-leadid="' + esc(d.leadId) + '"><i class="fa fa-envelope-open mr-1"></i>Open</button>'
                + (d.transcript
                    ? '<button class="btn btn-outline-primary btn-sm aed-transcript-btn ml-1" style="height:28px;line-height:28px;padding:0 10px;font-size:12px;white-space:nowrap;" data-url="' + esc(d.transcript) + '" title="Demo transcript"><i class="fa fa-file-text-o mr-1"></i>Transcript</button>'
                    : '')
            + '</td>'
            + '</tr>'
            + '<tr class="aed-analysis-row" data-leadid="' + esc(d.leadId) + '" style="display:none;background:#f7f9ff;">'
                + '<td colspan="12" style="padding:12px 16px;">' + aedAnalysisHtml(d) + '</td>'
            + '</tr>';
    });

    $('#aiEmailDraftTableBody').html(html);

    $('#aiEmailDraftTableBody').off('click.aedan').on('click.aedan', '.aed-analysis-toggle', function () {
        var id  = $(this).attr('data-leadid');
        var $row = $('.aed-analysis-row[data-leadid="' + id + '"]');
        var $ico = $(this).find('i');
        $row.toggle();
        $ico.toggleClass('fa-chevron-down fa-chevron-up');
    });

    $('#aiEmailDraftTableBody').off('click.aedtr').on('click.aedtr', '.aed-transcript-btn', function (e) {
        e.stopPropagation();
        var url = $(this).attr('data-url') || '';
        if (!url) { showMessageTheme2(0, 'Transcript is not available for this lead.', '', true); return; }
        if (typeof showVTTFile === 'function') {
            showVTTFile(url, 'Transcript', false);
        } else {
            showMessageTheme2(0, 'Transcript viewer failed to load. Please refresh the page.', '', true);
        }
    });

    $('#aiEmailDraftTableBody').off('click.aed').on('click.aed', '.aed-open-modal-btn', function () {
        var leadId = $(this).data('leadid');
        var d = AI_EMAIL_DRAFT_STATE.drafts[leadId] || AI_EMAIL_DRAFT_STATE.allData.find(function (x) { return x.leadId == leadId; });
        if (d) openAiEmailDraftModal(d);
    });
}

// ── Cards ─────────────────────────────────────────────────────────────────────

function renderCounselorCountBoxes(counselorCountsJson) {
    var $container = $('#aedCounselorBoxes');
    if (!$container.length) return;
    try {
        var list = typeof counselorCountsJson === 'string' ? JSON.parse(counselorCountsJson) : counselorCountsJson;
        if (!list || !list.length) {
            $container.html('<div class="text-muted" style="font-size:12px;">No counselor data available.</div>');
            return;
        }
        var filtered = list.filter(function (c) { return c.totalLeads > 0; });
        if (!filtered.length) {
            $container.html('<div class="text-muted" style="font-size:12px;">No counselor data available.</div>');
            return;
        }
        var html = '';
        filtered.forEach(function (c) {
            html += '<div style="background:#f4f6fb;border:1px solid #dce3f3;border-radius:8px;padding:8px 14px;min-width:140px;text-align:center;">'
                  +   '<div style="font-size:11px;font-weight:600;color:#3d5af1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:150px;" title="' + esc(c.counselorName) + '">' + esc(c.counselorName) + '</div>'
                  +   '<div style="margin-top:4px;font-size:11px;color:#555;">'
                  +     '<span style="color:#333;font-weight:600;">' + (c.totalLeads || 0) + '</span> Leads'
                  +     ' &nbsp;|&nbsp; '
                  +     '<span style="color:#28a745;font-weight:600;">' + (c.completedDemo || 0) + '</span> Demo'
                  +   '</div>'
                  + '</div>';
        });
        $container.html(html);
    } catch(e) {
        $container.html('<div class="text-muted" style="font-size:12px;">Could not load counselor data.</div>');
    }
}

function updateAiEmailDraftCards(rows) {
    var total = 0, high = 0, medium = 0, reviewed = 0;
    var totalLeadsCount = 0;
    (rows || []).forEach(function (r) {
        var d = AI_EMAIL_DRAFT_STATE.drafts[r.leadId] || r;
        total++;
        if (d.aiPriority === 'HIGH')   high++;
        if (d.aiPriority === 'MEDIUM') medium++;
        if (d.draftStatus === 'reviewed') reviewed++;
    });
    // Read counts from first row (set by backend)
    if (rows && rows.length > 0) {
        totalLeadsCount   = rows[0].totalLeadsCount   || 0;
    }
    if (totalLeadsCount > 0) {
        $('#aedCardTotal').html(totalLeadsCount + ' <span style="color:#aaa;font-weight:400;">|</span> ' + total);
        $('#aedCardTotalLabel').text('Total Leads | Complete Demo');
    } else {
        $('#aedCardTotal').text(0 | 0);
        $('#aedCardTotalLabel').text('Total Leads | Complete Demo');
    }
    $('#aedCardHigh').text(high);
    $('#aedCardMedium').text(medium);
    $('#aedCardReviewed').text(reviewed);
}

// ── Modal ─────────────────────────────────────────────────────────────────────

function openAiEmailDraftModal(d) {
    $('#aiEmailDraftModal').data('leadid', d.leadId);

    // Language init
    var lang = d.forcedLanguage || 'English';
    if ($.fn.select2) {
        if ($('#aedModalLanguage').hasClass('select2-hidden-accessible')) {
            $('#aedModalLanguage').select2('destroy');
        }
        $('#aedModalLanguage').select2({ theme: 'bootstrap4', dropdownParent: $('#aiEmailDraftModal'), width: '150px' });
    }
    $('#aedModalLanguage').val(lang).trigger('change');

    // Lead info row at top
    var priorityBadge = getPriorityBadge(d.aiPriority);
    var riskBadge     = getRiskBadge(d.riskLevel);
    $('#aedModalGenInfo').html(
        '<i class="fa fa-user mr-1 text-primary"></i><strong>' + esc(d.leadNo || d.leadId) + '</strong>'
        + ' &nbsp;|&nbsp; Priority: ' + priorityBadge + ' (Score: <strong>' + (d.priorityScore || 0) + '</strong>)'
        + ' &nbsp;|&nbsp; Risk: ' + riskBadge
        + ' &nbsp;|&nbsp; Follow-up: <strong>' + aedFollowUpCell(d.followUpDueDate) + '</strong>'
        + ' &nbsp;|&nbsp; <i class="fa fa-clock-o mr-1"></i>' + esc(formatAedDateTime(d.generatedAt) || '')
    );
    $('#aedModalLabel').html('<i class="fa fa-envelope mr-2"></i>AI Email Draft — ' + esc(d.leadNo || d.leadId));

    // close all accordions, reset feedback
    $('.aed-signal-header').each(function () { $($(this).data('target')).hide(); $(this).find('.aed-chevron').css('transform', ''); });
    $('#aedFeedbackPanel').hide();
    $('#aedModalFeedbackToggle').removeClass('active');
    $('#aedDraftTabs a[href="#aedTabEmail"]').tab('show');

    // Draft apne aap nahi banta — counselor jab chahe tab "Generate Draft" dabaye.
    if (!d.emailBody) {
        var askMsg = '<div class="text-center py-4" style="font-size:13px;">'
            + '<div class="text-muted mb-2"><i class="fa fa-envelope-o mr-1"></i>No draft generated yet for this lead.</div>'
            + '<button type="button" class="btn btn-primary btn-sm px-3" id="aedGenerateDraftBtn">'
            + '<i class="fa fa-magic mr-1"></i>Generate Draft</button>'
            + '<div class="text-muted mt-2" style="font-size:11px;">Takes about 10-15 seconds.</div>'
            + '</div>';
        $('#aedModalTo').val(d.email || d.emailTo || '');
        $('#aedModalFrom').val(d.counselorEmail || '');
        $('#aedModalSubject').val(d.emailSubject || '');
        $('#aedModalBody').val('');
        $('#aedModalWhatsapp').val('');
        $('#aedModalCallPitch').val('');
        $('#aedTabEmail').html(askMsg);
        $('#aedTabWhatsapp').html(askMsg);
        $('#aedTabCall').html(askMsg);
        // jo analysis pehle se hai wo dikha do, warna '—'
        $('#aedSignalUrgency').html(aedRichText(d.enrollmentUrgency));
        $('#aedSignalIntent').html(aedRichText(d.intentSummary));
        $('#aedSignalObjection').html(aedRichText(d.mainObjection));
        $('#aedSignalCompetitor').html(aedRichText(d.competitorSignals));
        $('#aedSignalNextAction').html(aedRichText(d.nextBestAction));
        $('#aedSignalCrmAlert').html(aedRichText(d.crmAlert));
        $('#aedSignalReason').html(aedRichText(d.explainableReason));
        $('#aedModalSave,#aedModalCopy,#aedModalMarkReviewed,#aedModalSendEmail').prop('disabled', true);
        $('#aedModalRegenerate').hide();     // draft hi nahi hai to "Re-generate" ka matlab nahi
        aedRenderFollowupForm(d);
        $('#aiEmailDraftModal').modal('show');
        return;
    }
    $('#aedModalRegenerate').show();

    // Full draft already available — populate normally
    populateModalContent(d);
    aedRenderFollowupForm(d);
    $('#aiEmailDraftModal').modal('show');
}

// Lead status update form — Lead List wala hi submitFollowupSaveFromLeadList() use karta hai.
// Wo function #leadStatus-<leadId> / #followupRemarks-<leadId> dhoondta hai aur success par
// lead-list ke kuch elements chhuta hai, isliye wahi id/class yahan bhi bana dete hain.
var AED_MIN_REMARK = 20;

function aedRenderFollowupForm(d) {
    var $body = $('#aedFollowupBody');
    if (!$body.length) return;
    var id = d.leadId;

    $body.html(
        '<select id="leadStatus-' + id + '" name="leadStatus-' + id + '" class="form-control form-control-sm mb-2">'
            + '<option value="">Select Status</option>'
        + '</select>'
        + '<textarea id="followupRemarks-' + id + '" name="followupRemarks-' + id + '" rows="2" '
            + 'class="form-control form-control-sm" placeholder="Follow-up remarks (min ' + AED_MIN_REMARK + ' characters)"></textarea>'
        + '<small id="leadListRemarksCounter_' + id + '" class="text-muted">0 / ' + AED_MIN_REMARK + '</small>'
        + '<div class="text-right mt-2">'
            + '<button type="button" class="btn btn-info btn-sm px-3" id="aedFollowupSaveBtn">'
                + '<i class="fa fa-check mr-1"></i>Follow-up</button>'
        + '</div>'
        // lead-list ke DOM hooks — na hone par us function me JS error aata hai
        + '<div style="display:none;">'
            + '<span class="nextSchedule-' + id + '"></span><span class="nextFollow-' + id + '"></span>'
            + '<span class="leadlist-status-' + id + '"></span><span class="leadlist-remark-' + id + '"></span>'
            + '<span class="demo-status-row-' + id + '"></span>'
            + '<div class="lead-row-' + id + ' aed-hook"></div>'
            + '<div class="lead-row-td-' + id + ' aed-hook"></div>'
        + '</div>'
    );

    // status list wahi master se
    if (typeof callLeadStatusList === 'function') {
        callLeadStatusList('followupSaveForm', 'B2C', 'leadStatus-' + id, false);
    }

    // remark counter
    $('#followupRemarks-' + id).off('input.aedfc').on('input.aedfc', function () {
        var len = ($(this).val() || '').trim().length;
        $('#leadListRemarksCounter_' + id)
            .attr('class', len >= AED_MIN_REMARK ? 'text-success' : 'text-muted')
            .html(len + ' / ' + AED_MIN_REMARK);
    });

    $('#aedFollowupSaveBtn').off('click.aedfs').on('click.aedfs', function () {
        if (typeof submitFollowupSaveFromLeadList !== 'function') {
            showMessageTheme2(0, 'Follow-up action failed to load. Please refresh the page.', '', true);
            return;
        }
        submitFollowupSaveFromLeadList('followupSaveForm', String(id), 'B2C', '111', 'new-lead', true, AED_MIN_REMARK);
    });
}

function populateModalContent(d) {
    // Restore tab content (may have been replaced by loading spinner)
    restoreModalTabs();

    $('#aedModalTo').val(d.email || d.emailTo || '');
    $('#aedModalFrom').val(d.counselorEmail || '');
    $('#aedModalSubject').val(d.emailSubject || '');
    $('#aedModalBody').val(d.emailBody || '');
    $('#aedModalWhatsapp').val(d.whatsappDraft || '');
    $('#aedModalCallPitch').val(d.callPitch || '');
    $('#aedSignalUrgency').html(aedRichText(d.enrollmentUrgency));
    $('#aedSignalIntent').html(aedRichText(d.intentSummary));
    $('#aedSignalObjection').html(aedRichText(d.mainObjection));
    $('#aedSignalCompetitor').html(aedRichText(d.competitorSignals));
    $('#aedSignalNextAction').html(aedRichText(d.nextBestAction));
    $('#aedSignalCrmAlert').html(aedRichText(d.crmAlert));
    $('#aedSignalReason').html(aedRichText(d.explainableReason));
    $('#aedModalSave,#aedModalCopy,#aedModalMarkReviewed,#aedModalSendEmail').prop('disabled', false);
    // Token usage display
    var inTok = d.inputTokens || 0, outTok = d.outputTokens || 0;
    if (inTok || outTok) {
        $('#aedTokenInfo').html('<i class="fa fa-bolt mr-1"></i>Tokens: <strong>' + (inTok + outTok) + '</strong> (in:' + inTok + ' out:' + outTok + ')');
    } else {
        $('#aedTokenInfo').html('<i class="fa fa-bolt mr-1"></i><span style="color:#bbb;">Tokens: cached</span>');
    }
}

function restoreModalTabs() {
    // Restore tab panes if they were replaced by loading spinner
    if ($('#aedTabEmail').find('textarea').length === 0) {
        $('#aedTabEmail').html(
            '<div class="mb-2"><label style="font-size:11px;font-weight:600;color:#555;margin-bottom:3px;">TO</label>'
            + '<input type="text" class="form-control form-control-sm" id="aedModalTo" placeholder="Recipient email" /></div>'
            + '<div class="mb-2"><label style="font-size:11px;font-weight:600;color:#555;margin-bottom:3px;">FROM</label>'
            + '<input type="text" class="form-control form-control-sm" id="aedModalFrom" placeholder="Counselor email" /></div>'
            + '<div class="mb-2"><label style="font-size:11px;font-weight:600;color:#555;margin-bottom:3px;">SUBJECT</label>'
            + '<input type="text" class="form-control form-control-sm" id="aedModalSubject" placeholder="Email subject" /></div>'
            + '<div class="mb-2"><label style="font-size:11px;font-weight:600;color:#555;margin-bottom:3px;">BODY</label>'
            + '<textarea class="form-control" id="aedModalBody" rows="10" style="font-size:13px;line-height:1.6;resize:vertical;"></textarea></div>'
        );
    }
    if ($('#aedTabWhatsapp').find('textarea').length === 0) {
        $('#aedTabWhatsapp').html(
            '<div class="mb-2"><label style="font-size:11px;font-weight:600;color:#555;margin-bottom:3px;">WHATSAPP MESSAGE</label>'
            + '<textarea class="form-control" id="aedModalWhatsapp" rows="14" style="font-size:13px;line-height:1.6;resize:vertical;"></textarea></div>'
        );
    }
    if ($('#aedTabCall').find('textarea').length === 0) {
        $('#aedTabCall').html(
            '<div class="mb-2"><label style="font-size:11px;font-weight:600;color:#555;margin-bottom:3px;">CALL PITCH (Academic Counselor Guide)</label>'
            + '<textarea class="form-control" id="aedModalCallPitch" rows="14" style="font-size:13px;line-height:1.6;resize:vertical;"></textarea></div>'
        );
    }
}

var AED_DRAFT_REQ = { token: 0 };

function fetchFullDraft(leadId, forcedLanguage, attempt, token) {
    attempt = attempt || 1;
    // naya request (Open / Re-generate) shuru hote hi token badal jata hai, isliye purani
    // koshish ka jawab ya uski queued retry UI ko dobara loading me nahi dal sakti
    if (!token) { token = ++AED_DRAFT_REQ.token; }
    var dateType = $('#aiEmailDraftDateType').val() || 'TODAY';
    var params = { schoolId: SCHOOL_ID, dateType: dateType, dataType: 'DEMO', userId: USER_ID, leadId: leadId };
    // CUSTOM par dates bhi bhejni zaroori hain, warna server date parse par gir jata tha
    if (dateType === 'CUSTOM') {
        params.startDate = ($('#aiEmailDraftFromDate').val() || '') + ' 00:00';
        params.endDate   = ($('#aiEmailDraftToDate').val()   || '') + ' 23:59';
    }
    if (forcedLanguage && forcedLanguage !== 'English') params.forcedLanguage = forcedLanguage;
    var $counselorEl = $('#aiEmailDraftCounselorFilter');
    var counselorId  = $counselorEl.val() || $counselorEl.data('lockedValue') || '';
    // special-rights wale user ki apni id zabardasti mat bhejo — unhe sabka data milna chahiye
    if (!counselorId && $counselorEl.prop('disabled') && !AI_EMAIL_DRAFT_STATE.allCounselorAccess) {
        counselorId = String(USER_ID);
    }
    if (counselorId) params.counselorId = counselorId;
    var ctry2 = $('#aiEmailDraftCountryFilter').val()  || '';
    var camp2 = $('#aiEmailDraftCampaignFilter').val() || '';
    if (ctry2)  params.countryId = ctry2;
    if (camp2) params.campaign = camp2;

    $.ajax({
        type: 'POST', contentType: APPLICATION_JSON_VALUE,
        url: getURLForHTML('/api/v1/leads', 'get-lead-timeline-summary'),
        data: JSON.stringify(params), dataType: 'json', timeout: 180000,
        success: function (data) {
            if (token !== AED_DRAFT_REQ.token) { return; }   // purana jawab — ignore
            var rows = Array.isArray(data) ? data : (data && data.data ? data.data : []);
            // Find the specific lead we requested, not just rows[0]
            var r = rows.find(function (x) { return String(x.leadId) === String(leadId); });
            if (!r || !r.emailBody) {
                aedFullDraftFallback(leadId, forcedLanguage, attempt, token);
                return;
            }
            // Merge full draft into allData and drafts
            var idx = AI_EMAIL_DRAFT_STATE.allData.findIndex(function (x) { return String(x.leadId) === String(leadId); });
            if (idx >= 0) {
                AI_EMAIL_DRAFT_STATE.allData[idx] = Object.assign({}, AI_EMAIL_DRAFT_STATE.allData[idx], r);
            }
            AI_EMAIL_DRAFT_STATE.drafts[leadId] = Object.assign({}, idx >= 0 ? AI_EMAIL_DRAFT_STATE.allData[idx] : r);
            var fresh = AI_EMAIL_DRAFT_STATE.drafts[leadId];
            restoreModalTabs();
            populateModalContent(fresh);
        },
        error: function () {
            if (token !== AED_DRAFT_REQ.token) { return; }
            aedFullDraftFallback(leadId, forcedLanguage, attempt, token);
        }
    });
}

// Draft na bane to: pehli baar chup-chaap dobara koshish; phir bhi na ho to modal
// khali chhodne ke bajaye jo data hai wahi dikhao + saaf, non-scary message.
function aedFullDraftFallback(leadId, forcedLanguage, attempt, token) {
    if (token && token !== AED_DRAFT_REQ.token) { return; }     // beech me naya request aa gaya
    if ((attempt || 1) < 2) {
        setTimeout(function () {
            if (token && token !== AED_DRAFT_REQ.token) { return; }
            // is beech draft mil chuka ho to dobara mat maango
            var have = AI_EMAIL_DRAFT_STATE.drafts[leadId];
            if (have && have.emailBody) { return; }
            fetchFullDraft(leadId, forcedLanguage, (attempt || 1) + 1, token);
        }, 1200);
        return;
    }
    restoreModalTabs();
    var d = AI_EMAIL_DRAFT_STATE.drafts[leadId]
         || (AI_EMAIL_DRAFT_STATE.allData || []).find(function (x) { return String(x.leadId) === String(leadId); });
    if (d) { populateModalContent(d); }     // subject/analysis jo mila hai wo to dikhe
    $('#aedModalSave,#aedModalCopy,#aedModalMarkReviewed,#aedModalSendEmail').prop('disabled', false);
    showMessageTheme2(0, 'Draft could not be generated. Please click Re-generate or try again in a moment.', '', true);
}

function saveAiEmailDraftEdits(draftStatus, onSuccess, suppressToast) {
    var leadId = $('#aiEmailDraftModal').data('leadid');
    if (!leadId) return;
    // Guard: if jQuery event object was accidentally passed, ignore it
    var status = (draftStatus && typeof draftStatus === 'string') ? draftStatus : 'saved';
    var base = AI_EMAIL_DRAFT_STATE.drafts[leadId]
            || AI_EMAIL_DRAFT_STATE.allData.find(function (x) { return x.leadId == leadId; })
            || {};
    var updated = Object.assign({}, base, {
        emailTo:       $('#aedModalTo').val(),
        emailSubject:  $('#aedModalSubject').val(),
        emailBody:     $('#aedModalBody').val(),
        whatsappDraft: $('#aedModalWhatsapp').val(),
        callPitch:     $('#aedModalCallPitch').val(),
        forcedLanguage: $('#aedModalLanguage').val() || '',
        draftStatus:   status
    });
    AI_EMAIL_DRAFT_STATE.drafts[leadId] = updated;

    var params = {
        leadId:        parseInt(leadId),
        userId:        USER_ID,
        schoolId:      SCHOOL_ID,
        emailTo:       updated.emailTo || '',
        emailSubject:  updated.emailSubject || '',
        emailBody:     updated.emailBody || '',
        whatsappDraft: updated.whatsappDraft || '',
        callPitch:     updated.callPitch || '',
        forcedLanguage: updated.forcedLanguage || '',
        draftStatus:   status
    };
    $.ajax({
        type: 'POST', contentType: APPLICATION_JSON_VALUE,
        url: getURLForHTML('/api/v1/leads', 'save-ai-email-draft'),
        data: JSON.stringify(params), dataType: 'json',
        success: function (data) {
            if (!suppressToast) {
                if (data && data.status === '1') {
                    showMessageTheme2(1, data.message || 'Saved.', '', true);
                } else {
                    showMessageTheme2(0, (data && data.message) || 'Error saving draft.', '', true);
                }
            }
            renderAiEmailDraftTable(AI_EMAIL_DRAFT_STATE.allData);
            updateAiEmailDraftCards(AI_EMAIL_DRAFT_STATE.allData);
            if (typeof onSuccess === 'function') onSuccess();
        },
        error: function () {
            showMessageTheme2(0, 'Network error while saving draft.', '', true);
        }
    });
}

function copyAiEmailDraft() {
    var activeTab = $('#aedDraftTabs .nav-link.active').attr('href');
    var text = '';
    if (activeTab === '#aedTabEmail') {
        text = 'Subject: ' + $('#aedModalSubject').val() + '\n\n' + $('#aedModalBody').val();
    } else if (activeTab === '#aedTabWhatsapp') {
        text = $('#aedModalWhatsapp').val();
    } else if (activeTab === '#aedTabCall') {
        text = $('#aedModalCallPitch').val();
    }
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(function () {
            showMessageTheme2(1, 'Copied to clipboard.', '', true);
        });
    } else {
        var ta = $('<textarea>').val(text).appendTo('body').select();
        document.execCommand('copy');
        ta.remove();
        showMessageTheme2(1, 'Copied.', '', true);
    }
}

function regenerateAiEmailDraft(counselorFeedback) {
    var leadId = $('#aiEmailDraftModal').data('leadid');
    if (!leadId) return;
    var forcedLanguage = $('#aedModalLanguage').val() || '';
    var hasFeedback = counselorFeedback && counselorFeedback.trim();

    // disable buttons, show inline spinner — do NOT close modal
    var $regenBtn   = $('#aedModalRegenerate');
    var $applyBtn   = $('#aedModalRegenerateWithFeedback');
    $regenBtn.prop('disabled', true).html('<i class="fa fa-spinner fa-spin mr-1"></i> Generating…');
    $applyBtn.prop('disabled', true).html('<i class="fa fa-spinner fa-spin mr-1"></i> Generating…');
    $('#aedModalSave, #aedModalCopy, #aedModalMarkReviewed').prop('disabled', true);
    $('#aedModalTo, #aedModalSubject, #aedModalBody, #aedModalWhatsapp, #aedModalCallPitch').prop('disabled', true);

    var $counselorEl2 = $('#aiEmailDraftCounselorFilter');
    var counselorId2  = $counselorEl2.val() || $counselorEl2.data('lockedValue') || '';
    if (!counselorId2 && $counselorEl2.prop('disabled') && !AI_EMAIL_DRAFT_STATE.allCounselorAccess) {
        counselorId2 = String(USER_ID);
    }
    var params = {
        schoolId: SCHOOL_ID,
        dateType:  $('#aiEmailDraftDateType').val() || 'TODAY',
        dataType:  'DEMO',
        userId:    USER_ID,
        leadId:    leadId
    };
    if (counselorId2)   params.counselorId = counselorId2;
    if (forcedLanguage) params.forcedLanguage = forcedLanguage;
    if (hasFeedback)    params.counselorFeedback = counselorFeedback.trim();
    var ctry3 = $('#aiEmailDraftCountryFilter').val()  || '';
    var camp3 = $('#aiEmailDraftCampaignFilter').val() || '';
    if (ctry3)  params.countryId = ctry3;
    if (camp3)  params.campaign = camp3;

    $.ajax({
        type: 'POST',
        contentType: APPLICATION_JSON_VALUE,
        url: getURLForHTML('/api/v1/leads', 'get-lead-timeline-summary'),
        data: JSON.stringify(params),
        dataType: 'json',
        success: function (data) {
            var rows = Array.isArray(data) ? data : (data && data.data ? data.data : []);
            var fresh = rows.find(function (r) { return String(r.leadId) === String(leadId); });
            if (fresh) {
                if (forcedLanguage) fresh.forcedLanguage = forcedLanguage;
                // update state
                var idx = AI_EMAIL_DRAFT_STATE.allData.findIndex(function (x) { return String(x.leadId) === String(leadId); });
                if (idx >= 0) AI_EMAIL_DRAFT_STATE.allData[idx] = fresh;
                else AI_EMAIL_DRAFT_STATE.allData.push(fresh);
                AI_EMAIL_DRAFT_STATE.drafts[leadId] = Object.assign({}, fresh);
                // refresh modal content in-place and hide feedback panel
                openAiEmailDraftModal(fresh);
                $('#aedFeedbackPanel').hide();
                $('#aedModalFeedbackToggle').removeClass('active');
                renderAiEmailDraftTable(AI_EMAIL_DRAFT_STATE.allData);
                updateAiEmailDraftCards(AI_EMAIL_DRAFT_STATE.allData);
                showMessageTheme2(1, hasFeedback ? 'Draft re-generated with your feedback.' : 'Draft re-generated successfully.', '', true);
            } else {
                showMessageTheme2(0, 'Re-generate failed — lead not found in response.', '', true);
            }
        },
        error: function () {
            showMessageTheme2(0, 'Unable to re-generate draft.', '', true);
        },
        complete: function () {
            $regenBtn.prop('disabled', false).html('<i class="fa fa-refresh mr-1"></i>Re-generate');
            $applyBtn.prop('disabled', false).html('<i class="fa fa-magic mr-1"></i>Apply Feedback &amp; Re-generate');
            $('#aedModalSave, #aedModalCopy, #aedModalMarkReviewed').prop('disabled', false);
            $('#aedModalTo, #aedModalSubject, #aedModalBody, #aedModalWhatsapp, #aedModalCallPitch').prop('disabled', false);
        }
    });
}

// ── Sort ──────────────────────────────────────────────────────────────────────

function toggleSort(field) {
    if (AI_EMAIL_DRAFT_STATE.sortField === field) {
        AI_EMAIL_DRAFT_STATE.sortDir = AI_EMAIL_DRAFT_STATE.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
        AI_EMAIL_DRAFT_STATE.sortField = field;
        AI_EMAIL_DRAFT_STATE.sortDir = 'desc';
    }
    renderAiEmailDraftTable(AI_EMAIL_DRAFT_STATE.allData);
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function getPriorityBadge(p) {
    var map = { HIGH: 'danger', MEDIUM: 'warning', LOW: 'secondary' };
    return '<span class="badge badge-' + (map[p] || 'secondary') + '">' + (p || '—') + '</span>';
}

function getRiskBadge(r) {
    if (!r || typeof r !== 'string') return '<span class="badge badge-secondary">—</span>';
    // AI sometimes returns verbose text like "MEDIUM — reason..." — extract just HIGH/MEDIUM/LOW
    var level = 'MEDIUM';
    var upper = r.toUpperCase();
    if (upper.indexOf('HIGH') !== -1)   level = 'HIGH';
    else if (upper.indexOf('LOW') !== -1) level = 'LOW';
    else if (upper.indexOf('MEDIUM') !== -1) level = 'MEDIUM';
    var map = { HIGH: 'danger', MEDIUM: 'warning', LOW: 'success' };
    return '<span class="badge badge-' + map[level] + '">' + level + '</span>';
}

function getDraftStatusBadge(s) {
    var map = {
        'generated':  { color: 'primary', label: 'GENERATED' },
        'saved':      { color: 'warning', label: 'SAVED' },
        'reviewed':   { color: 'success', label: 'REVIEWED' },
        'email_sent': { color: 'info',    label: 'EMAIL SENT' }
    };
    var key = (s && typeof s === 'string') ? s.toLowerCase().trim() : '';
    var entry = map[key];
    if (!entry) return '<span class="badge badge-secondary">—</span>';
    return '<span class="badge badge-' + entry.color + '">' + entry.label + '</span>';
}

function esc(v) {
    if (v == null) return '';
    return String(v)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

// Date helpers — project standard: DD-Mon-YYYY (e.g. 30-Jun-2026)
var AED_MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function formatAedDate(val) {
    if (!val) return '';
    var d = new Date(val);
    if (isNaN(d.getTime())) return val;
    return d.getDate() + '-' + AED_MONTHS[d.getMonth()] + '-' + d.getFullYear();
}

function formatAedDateTime(val) {
    if (!val) return '';
    var d = new Date(val);
    if (isNaN(d.getTime())) return val;
    var hh = String(d.getHours()).padStart(2, '0');
    var mm = String(d.getMinutes()).padStart(2, '0');
    return d.getDate() + '-' + AED_MONTHS[d.getMonth()] + '-' + d.getFullYear() + ' ' + hh + ':' + mm;
}

function saveAiDraftLearning(feedback) {
    var $btn = $('#aedModalSaveLearning');
    $btn.prop('disabled', true).html('<i class="fa fa-spinner fa-spin mr-1"></i>Saving…');

    var params = { userId: USER_ID, schoolId: SCHOOL_ID, feedback: feedback };
    $.ajax({
        type: 'POST',
        contentType: APPLICATION_JSON_VALUE,
        url: getURLForHTML('/api/v1/leads', 'save-ai-draft-learning'),
        data: JSON.stringify(params),
        dataType: 'json',
        success: function (data) {
            if (data && (data.status === '1' || data.status === 1)) {
                var total = data.totalRules || '';
                $('#aedLearningStatus').html('<i class="fa fa-check-circle mr-1"></i>Saved! ' + (total ? total + ' rule(s) now active — AI will use these for all future drafts.' : '')).show();
                $('#aedLearningCount').text((total || '?') + ' rules');
                showMessageTheme2(1, data.message || 'Learning saved successfully.', '', true);
            } else {
                showMessageTheme2(0, (data && data.message) ? data.message : 'Failed to save learning.', '', true);
            }
        },
        error: function () { showMessageTheme2(0, 'Unable to save learning.', '', true); },
        complete: function () { $btn.prop('disabled', false).html('<i class="fa fa-graduation-cap mr-1"></i>Save as Learning'); }
    });
}

function loadAiDraftLearningList() {
    $('#aedLearningList').html('<div class="text-muted" style="font-size:12px;"><i class="fa fa-spinner fa-spin mr-1"></i> Loading…</div>');
    var params = { userId: USER_ID, schoolId: SCHOOL_ID };
    $.ajax({
        type: 'POST',
        contentType: APPLICATION_JSON_VALUE,
        url: getURLForHTML('/api/v1/leads', 'get-ai-draft-learning'),
        data: JSON.stringify(params),
        dataType: 'json',
        success: function (data) {
            if (data && (data.status === '1' || data.status === 1) && data.learning) {
                var arr = data.learning;
                $('#aedLearningCount').text(arr.length + ' rules');
                if (!arr.length) {
                    $('#aedLearningList').html('<div class="text-muted" style="font-size:12px;"><i class="fa fa-info-circle mr-1"></i>No saved learning rules yet.</div>');
                    return;
                }
                var html = '';
                for (var i = 0; i < arr.length; i++) {
                    var entry = arr[i];
                    var feedbackText = (typeof entry === 'object') ? (entry.feedback || '') : String(entry);
                    var addedAt = (typeof entry === 'object' && entry.addedAt) ? ' <span style="color:#999;font-size:10px;">(' + entry.addedAt + ')</span>' : '';
                    html += '<div class="d-flex align-items-start mb-2 p-2" style="background:#f1f8e9;border-radius:6px;border:1px solid #c5e1a5;">'
                        + '<i class="fa fa-check-circle text-success mr-2 mt-1" style="flex-shrink:0;"></i>'
                        + '<div style="font-size:12px;flex:1;">' + esc(feedbackText) + addedAt + '</div>'
                        + '<button class="btn btn-outline-danger btn-xs ml-2 aed-delete-learning" data-index="' + i + '" style="flex-shrink:0;font-size:11px;padding:1px 6px;" title="Delete this rule"><i class="fa fa-trash"></i></button>'
                    + '</div>';
                }
                $('#aedLearningList').html(html);

                $('#aedLearningList').off('click.aeddl').on('click.aeddl', '.aed-delete-learning', function () {
                    var idx = parseInt($(this).data('index'));
                    if (!confirm('Delete this learning rule? The AI will no longer use it for future drafts.')) return;
                    deleteAiDraftLearningEntry(idx);
                });
            } else {
                $('#aedLearningList').html('<div class="text-muted" style="font-size:12px;">No saved learning rules yet.</div>');
            }
        },
        error: function () { $('#aedLearningList').html('<div class="text-danger" style="font-size:12px;">Error loading learning rules.</div>'); }
    });
}

function deleteAiDraftLearningEntry(index) {
    var params = { userId: USER_ID, schoolId: SCHOOL_ID, index: index };
    $.ajax({
        type: 'POST',
        contentType: APPLICATION_JSON_VALUE,
        url: getURLForHTML('/api/v1/leads', 'delete-ai-draft-learning-entry'),
        data: JSON.stringify(params),
        dataType: 'json',
        success: function (data) {
            if (data && (data.status === '1' || data.status === 1)) {
                showMessageTheme2(1, 'Learning rule deleted.', '', true);
                loadAiDraftLearningList();
            } else {
                showMessageTheme2(0, (data && data.message) ? data.message : 'Delete failed.', '', true);
            }
        },
        error: function () { showMessageTheme2(0, 'Unable to delete learning rule.', '', true); }
    });
}

function sendAiDraftEmail() {
    var toEmail   = $('#aedModalTo').val().trim();
    var fromEmail = $('#aedModalFrom').val().trim();
    var subject   = $('#aedModalSubject').val().trim();
    var rawBody   = $('#aedModalBody').val().trim();

    if (!toEmail) { showMessageTheme2(0, 'Please enter recipient email address.', '', true); return; }
    if (!subject) { showMessageTheme2(0, 'Please enter email subject.', '', true); return; }
    if (!rawBody) { showMessageTheme2(0, 'Email body cannot be empty.', '', true); return; }

    // Strip trailing signature block added by AI
    var htmlBody = rawBody
        .replace(/[\r\n]+Warm regards[\s\S]*$/i, '')
        .replace(/[\r\n]+Best regards[\s\S]*$/i, '')
        .replace(/[\r\n]+Kind regards[\s\S]*$/i, '')
        .replace(/[\r\n]+Sincerely[\s\S]*$/i, '')
        .trim();

    // Get lead name for #USER_NAME# template placeholder
    var leadId = $('#aiEmailDraftModal').data('leadid');
    var d = (leadId && AI_EMAIL_DRAFT_STATE.drafts[leadId]) || {};
    var userName = d.leadName || '';

    var btn = $('#aedModalSendEmail');
    btn.prop('disabled', true).html('<i class="fa fa-spinner fa-spin mr-1"></i> Sending…');

    var params = {
        userId:    USER_ID,
        toEmail:   toEmail,
        fromEmail: fromEmail,
        subject:   subject,
        htmlBody:  htmlBody,
        userName:  userName
    };

    $.ajax({
        type: 'POST',
        contentType: APPLICATION_JSON_VALUE,
        url: getURLForHTML('/api/v1/leads', 'send-ai-draft-email'),
        data: JSON.stringify(params),
        dataType: 'json',
        success: function (data) {
            if (data && (data.status === '1' || data.status === 1)) {
                showMessageTheme2(1, 'Email sent successfully!', '', true);
                var leadId = $('#aiEmailDraftModal').data('leadid');
                if (leadId) {
                    var d = AI_EMAIL_DRAFT_STATE.drafts[leadId]
                         || AI_EMAIL_DRAFT_STATE.allData.find(function(x){ return x.leadId == leadId; });
                    if (d) { d.draftStatus = 'email_sent'; }
                    saveAiEmailDraftEdits('email_sent', null, true);
                    renderAiEmailDraftTable(AI_EMAIL_DRAFT_STATE.allData);
                    updateAiEmailDraftCards(AI_EMAIL_DRAFT_STATE.allData);
                }
            } else {
                showMessageTheme2(0, (data && data.message) ? data.message : 'Failed to send email.', '', true);
            }
        },
        error: function () {
            showMessageTheme2(0, 'Unable to send email. Please try again.', '', true);
        },
        complete: function () {
            btn.prop('disabled', false).html('<i class="fa fa-paper-plane mr-1"></i> Send Email');
        }
    });
}
