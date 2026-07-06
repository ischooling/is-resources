var AI_EMAIL_DRAFT_STATE = {
    drafts: {},        // leadId -> draft object (in-session edits)
    allData: [],       // raw API response array
    sortField: 'followUpDueDate',
    sortDir: 'asc'
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

    // Counselor dropdown — await data load, then init select2 so it picks up options correctly
    $('#aiEmailDraftCounselorFilter').html('<option value="">All Academic Counselor</option>');
    if (typeof callLeadAssignUserList === 'function') {
        await callLeadAssignUserList('aiEmailDraftFilterForm', 'B2C', 'aiEmailDraftCounselorFilter', true, true, USER_ID);
    }
    // Non-admin: lock dropdown to own counselor ID
    var isAdmin = (USER_ROLE === 'DIRECTOR' || USER_ROLE === 'SUPER_ADMIN');
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
        fetchAiEmailDrafts();
    });

    $('#aiEmailDraftResetBtn').off('click').on('click', function () {
        $('#aiEmailDraftDateType').val('TODAY').trigger('change');
        $('#aiEmailDraftPriorityFilter').val('').trigger('change');
        $('#aiEmailDraftStatusFilter').val('').trigger('change');
        $('#aiEmailDraftCountryFilter').val('').trigger('change');
        $('#aiEmailDraftCampaignFilter').val('').trigger('change');
        var isAdmin = (USER_ROLE === 'DIRECTOR' || USER_ROLE === 'SUPER_ADMIN');
        if (isAdmin) {
            $('#aiEmailDraftCounselorFilter').val('').trigger('change');
        }
        $('.aed-custom-date-col').hide();
        if ($.fn.datepicker) {
            var today = new Date();
            $('#aiEmailDraftFromDate').datepicker('setDate', today);
            $('#aiEmailDraftToDate').datepicker('setDate', today);
        }
        AI_EMAIL_DRAFT_STATE.drafts = {};
        AI_EMAIL_DRAFT_STATE.allData = [];
        renderAiEmailDraftTable([]);
        updateAiEmailDraftCards([]);
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
        userId:   USER_ID
    };
    if (dateType === 'CUSTOM') {
        params.startDate = ($('#aiEmailDraftFromDate').val() || '') + ' 00:00';
        params.endDate   = ($('#aiEmailDraftToDate').val()   || '') + ' 23:59';
    }
    // Read counselor value even if dropdown is disabled
    var $counselorEl = $('#aiEmailDraftCounselorFilter');
    var counselorId  = $counselorEl.val() || $counselorEl.data('lockedValue') || '';
    if (!counselorId && $counselorEl.prop('disabled')) counselorId = String(USER_ID);
    if (counselorId) params.counselorId = counselorId;
    var countryVal  = $('#aiEmailDraftCountryFilter').val()   || '';
    var campaignVal = $('#aiEmailDraftCampaignFilter').val()  || '';
    if (countryVal)  params.countryId = countryVal;
    if (campaignVal) params.campaign = campaignVal;
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
            if (!singleLeadId && rows.length > 0 && rows[0].counselorCounts) {
                renderCounselorCountBoxes(rows[0].counselorCounts);
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
        var priorityBadge = getPriorityBadge(d.aiPriority);
        var riskBadge     = getRiskBadge(d.riskLevel);
        var statusBadge   = getDraftStatusBadge(d.draftStatus);
        var subjectPreview = (d.emailSubject || '').substring(0, 45) + ((d.emailSubject || '').length > 45 ? '…' : '');

        html += '<tr>'
            + '<td>' + (idx + 1) + '</td>'
            + '<td>' + esc(d.leadNo || d.leadId) + (d.grade ? '<br><small class="text-muted">' + esc(d.grade) + '</small>' : '') + '</td>'
            + '<td>' + esc(d.country) + (d.utmCampaign ? '<br><small class="text-muted">' + esc(d.utmCampaign) + '</small>' : '') + '</td>'
            + '<td>' + esc(d.counselorName) + '</td>'
            + '<td>' + esc(d.leadStatus) + '</td>'
            + '<td class="text-center">' + esc(d.demodatetime || '—') + '</td>'
            + '<td class="text-center">' + priorityBadge + '</td>'
            + '<td class="text-center"><strong>' + (d.priorityScore || 0) + '</strong></td>'
            + '<td class="text-center">' + riskBadge + '</td>'
            + '<td class="text-center">' + esc(formatAedDate(d.followUpDueDate) || '—') + '</td>'
            + '<td style="max-width:180px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="' + esc(d.emailSubject) + '">' + esc(d.emailSubject || '—') + '</td>'
            + '<td class="text-center">' + statusBadge + '</td>'
            + '<td class="text-center"><button class="btn btn-primary btn-sm aed-open-modal-btn" style="height:28px;line-height:28px;padding:0 12px;font-size:12px;white-space:nowrap;" data-leadid="' + esc(d.leadId) + '"><i class="fa fa-envelope-open mr-1"></i>Open</button></td>'
            + '</tr>';
    });

    $('#aiEmailDraftTableBody').html(html);

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
        + ' &nbsp;|&nbsp; Follow-up: <strong>' + esc(formatAedDate(d.followUpDueDate) || '—') + '</strong>'
        + ' &nbsp;|&nbsp; <i class="fa fa-clock-o mr-1"></i>' + esc(formatAedDateTime(d.generatedAt) || '')
    );
    $('#aedModalLabel').html('<i class="fa fa-envelope mr-2"></i>AI Email Draft — ' + esc(d.leadNo || d.leadId));

    // close all accordions, reset feedback
    $('.aed-signal-header').each(function () { $($(this).data('target')).hide(); $(this).find('.aed-chevron').css('transform', ''); });
    $('#aedFeedbackPanel').hide();
    $('#aedModalFeedbackToggle').removeClass('active');
    $('#aedDraftTabs a[href="#aedTabEmail"]').tab('show');

    // If full draft not yet loaded (emailBody empty) → show loading state then auto-fetch full draft
    if (!d.emailBody) {
        var loadingMsg = '<div class="text-center py-4 text-muted" style="font-size:13px;"><i class="fa fa-spinner fa-spin fa-lg mr-2 text-primary"></i>Generating full draft… please wait (~15-30s)</div>';
        $('#aedModalTo').val(d.email || d.emailTo || '');
        $('#aedModalSubject').val(d.emailSubject || '');
        $('#aedModalBody').val('');
        $('#aedModalWhatsapp').val('');
        $('#aedModalCallPitch').val('');
        $('#aedTabEmail').html(loadingMsg);
        $('#aedTabWhatsapp').html(loadingMsg);
        $('#aedTabCall').html(loadingMsg);
        $('#aedSignalUrgency,#aedSignalIntent,#aedSignalObjection,#aedSignalCompetitor,#aedSignalNextAction,#aedSignalCrmAlert,#aedSignalReason').text('Generating…');
        $('#aedModalSave,#aedModalCopy,#aedModalMarkReviewed,#aedModalSendEmail').prop('disabled', true);
        $('#aiEmailDraftModal').modal('show');

        // Auto-trigger full draft fetch for this lead
        fetchFullDraft(d.leadId, lang);
        return;
    }

    // Full draft already available — populate normally
    populateModalContent(d);
    $('#aiEmailDraftModal').modal('show');
}

function populateModalContent(d) {
    // Restore tab content (may have been replaced by loading spinner)
    restoreModalTabs();

    $('#aedModalTo').val(d.email || d.emailTo || '');
    $('#aedModalSubject').val(d.emailSubject || '');
    $('#aedModalBody').val(d.emailBody || '');
    $('#aedModalWhatsapp').val(d.whatsappDraft || '');
    $('#aedModalCallPitch').val(d.callPitch || '');
    $('#aedSignalUrgency').text(d.enrollmentUrgency    || '—');
    $('#aedSignalIntent').text(d.intentSummary         || '—');
    $('#aedSignalObjection').text(d.mainObjection      || '—');
    $('#aedSignalCompetitor').text(d.competitorSignals || '—');
    $('#aedSignalNextAction').text(d.nextBestAction    || '—');
    $('#aedSignalCrmAlert').text(d.crmAlert            || '—');
    $('#aedSignalReason').text(d.explainableReason     || '—');
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

function fetchFullDraft(leadId, forcedLanguage) {
    var dateType = $('#aiEmailDraftDateType').val() || 'TODAY';
    var params = { schoolId: SCHOOL_ID, dateType: dateType, dataType: 'DEMO', userId: USER_ID, leadId: leadId };
    if (forcedLanguage && forcedLanguage !== 'English') params.forcedLanguage = forcedLanguage;
    var $counselorEl = $('#aiEmailDraftCounselorFilter');
    var counselorId  = $counselorEl.val() || $counselorEl.data('lockedValue') || '';
    if (!counselorId && $counselorEl.prop('disabled')) counselorId = String(USER_ID);
    if (counselorId) params.counselorId = counselorId;
    var ctry2 = $('#aiEmailDraftCountryFilter').val()  || '';
    var camp2 = $('#aiEmailDraftCampaignFilter').val() || '';
    if (ctry2)  params.countryId = ctry2;
    if (camp2) params.campaign = camp2;

    $.ajax({
        type: 'POST', contentType: APPLICATION_JSON_VALUE,
        url: getURLForHTML('/api/v1/leads', 'get-lead-timeline-summary'),
        data: JSON.stringify(params), dataType: 'json',
        success: function (data) {
            var rows = Array.isArray(data) ? data : [];
            // Find the specific lead we requested, not just rows[0]
            var r = rows.find(function (x) { return String(x.leadId) === String(leadId); });
            if (!r) {
                restoreModalTabs();
                showMessageTheme2(0, 'Could not generate full draft. Please try Re-generate.', '', true);
                $('#aedModalSave,#aedModalCopy,#aedModalMarkReviewed,#aedModalSendEmail').prop('disabled', false);
                return;
            }
            // If emailBody still empty (AI timed out), show error
            if (!r.emailBody) {
                restoreModalTabs();
                showMessageTheme2(0, 'AI timed out generating draft. Please click Re-generate.', '', true);
                $('#aedModalSave,#aedModalCopy,#aedModalMarkReviewed,#aedModalSendEmail').prop('disabled', false);
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
            restoreModalTabs();
            showMessageTheme2(0, 'Error generating full draft. Please try Re-generate.', '', true);
            $('#aedModalSave,#aedModalCopy,#aedModalMarkReviewed,#aedModalSendEmail').prop('disabled', false);
        }
    });
}

function saveAiEmailDraftEdits(draftStatus, onSuccess) {
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
            if (data && data.status === '1') {
                showMessageTheme2(1, data.message || 'Saved.', '', true);
            } else {
                showMessageTheme2(0, (data && data.message) || 'Error saving draft.', '', true);
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
    if (!counselorId2 && $counselorEl2.prop('disabled')) counselorId2 = String(USER_ID);
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
    var toEmail  = $('#aedModalTo').val().trim();
    var subject  = $('#aedModalSubject').val().trim();
    var rawBody  = $('#aedModalBody').val().trim();

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
        userId:   USER_ID,
        toEmail:  toEmail,
        subject:  subject,
        htmlBody: htmlBody,
        userName: userName
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
                    saveAiEmailDraftEdits('email_sent');
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
