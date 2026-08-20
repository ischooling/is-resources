var LEAD_DEMO_DASHBOARD_STATE = {
    range: 'today',
    campaign: '',
    country: 0,
    counselor: 0,
    demoStatus: 'CURRENT',
    contacted: '',
    searchText: '',
    leadPage: 0,
    demoPage: 0,
    agingPage: 0,
    pageSize: 10,
    leadShowAll: false,
    demoShowAll: false
};
var LEAD_DEMO_DASHBOARD_CHARTS = {};
var LEAD_DEMO_DASHBOARD_LEAD_REASONS = {};
var LEAD_DEMO_DASHBOARD_LEAD_PRIORITY = {};
var LEAD_DEMO_DASHBOARD_AI_ANALYZED = false;
var LEAD_DEMO_DASHBOARD_AI_LOADING = false;
var LEAD_DEMO_DASHBOARD_AI_PRIORITY_ENABLED = true;
var LEAD_DEMO_DASHBOARD_AI_LAST_FETCH_TIME = 0;
var LEAD_DEMO_DASHBOARD_AI_PRIORITY_MIN_INTERVAL_MS = 20 * 60 * 1000; // matches backend's 20-min AI cache TTL
var LEAD_DEMO_DASHBOARD_AUTO_REFRESH_TIMER = null;
var LEAD_DEMO_DASHBOARD_LEAD_LIST_REFRESH_TIMER = null;

function renderLeadDemoDashboard(title, roleAndModule, schoolId, userId, userRole) {
    ROLE_MODULE = roleAndModule;
    $('#dashboardContentInHTML').html(getLeadDemoDashboardContent(title));
    LEAD_DEMO_DASHBOARD_STATE = {
        range: 'today', campaign: '', country: 0, counselor: 0, demoStatus: 'CURRENT',
        contacted: '', searchText: '', leadPage: 0, demoPage: 0, agingPage: 0, pageSize: 10,
        leadShowAll: false, demoShowAll: false
    };
    LEAD_DEMO_DASHBOARD_LEAD_REASONS = {};
    LEAD_DEMO_DASHBOARD_LEAD_PRIORITY = {};
    LEAD_DEMO_DASHBOARD_AI_ANALYZED = false;
    LEAD_DEMO_DASHBOARD_AI_LOADING = false;
    LEAD_DEMO_DASHBOARD_AI_PRIORITY_ENABLED = true;
    LEAD_DEMO_DASHBOARD_AI_LAST_FETCH_TIME = 0;
    initLeadDemoDashboardFilters();
    bindLeadDemoDashboardEvents();
    setLeadDemoDashboardAutoRefreshTimer(600);
    setLeadDemoDashboardLeadListRefreshTimer();
    fetchLeadDemoDashboardAll();
}

function initLeadDemoDashboardFilters() {
    var today = new Date();

    $('.lddCampaignFilterList').html('<option value="">All Campaigns</option>');
    callCampainList(true, 'lddCampaignFilterList');
    window.setTimeout(function () {
        if ($('#lddCampaignFilter option[value=""]').length === 0) {
            $('#lddCampaignFilter').prepend('<option value="">All Campaigns</option>');
            $('#lddCampaignFilter').val('');
        }
    }, 1500);

    callPCountries('leadDemoDashboardFilterForm', 0, 'lddCountryFilter');
    window.setTimeout(function () {
        $('#lddCountryFilter option[value=""]').text('All Countries');
    }, 1500);

    // Academic Counselor — reuse the same assign-user list function the Lead Demo Report page uses (leads.js);
    // it clears the select, adds "Select Assign" (value 0 = all), then appends each counselor "Name - (email)".
    callLeadAssignUserList('leadDemoDashboardFilterForm', 'B2C', 'lddCounselorFilter', true, true, USER_ID);

    $('#lddDateRange').select2({ theme: 'bootstrap4', minimumResultsForSearch: Infinity, width: '100%' });
    $('#lddCampaignFilter').select2({ theme: 'bootstrap4', width: '100%' });
    $('#lddCountryFilter').select2({ theme: 'bootstrap4', width: '100%' });
    $('#lddCounselorFilter').select2({ theme: 'bootstrap4', width: '100%' });

    $('#lddStartDate, #lddEndDate').datepicker({
        autoclose: true,
        format: 'yyyy-mm-dd',
        todayHighlight: true
    });
    $('#lddStartDate').datepicker('setDate', today);
    $('#lddEndDate').datepicker('setDate', today);
    setLeadDemoDashboardDateLabel();
}

function bindLeadDemoDashboardEvents() {
    // Delegated (not .off/.on on a fixed selector) since these icons live inside content re-rendered
    // per section — a plain .on would stop firing once that section's HTML gets replaced.
    $(document).off('click.lddRefresh').on('click.lddRefresh', '.ldd-section-refresh', function () {
        var section = $(this).data('section');
        if (section) {
            fetchLeadDemoDashboardSection(section);
        }
    });

    $('#lddDateRange').off('change.lddr').on('change.lddr', function () {
        LEAD_DEMO_DASHBOARD_STATE.range = $(this).val();
        if (LEAD_DEMO_DASHBOARD_STATE.range === 'custom') {
            $('#lddFromDateCol, #lddToDateCol').show();
        } else {
            $('#lddFromDateCol, #lddToDateCol').hide();
            LEAD_DEMO_DASHBOARD_STATE.leadPage = 0;
            LEAD_DEMO_DASHBOARD_STATE.demoPage = 0;
            LEAD_DEMO_DASHBOARD_STATE.agingPage = 0;
            resetLeadDemoDashboardAiInsights();
            fetchLeadDemoDashboardAll();
        }
    });

    $('#lddSearchBtn').off('click').on('click', function () {
        LEAD_DEMO_DASHBOARD_STATE.campaign = $('#lddCampaignFilter').val() || '';
        LEAD_DEMO_DASHBOARD_STATE.country = parseInt($('#lddCountryFilter').val(), 10) || 0;
        LEAD_DEMO_DASHBOARD_STATE.counselor = parseInt($('#lddCounselorFilter').val(), 10) || 0;
        LEAD_DEMO_DASHBOARD_STATE.leadPage = 0;
        LEAD_DEMO_DASHBOARD_STATE.demoPage = 0;
        LEAD_DEMO_DASHBOARD_STATE.agingPage = 0;
        resetLeadDemoDashboardAiInsights();
        fetchLeadDemoDashboardAll();
    });

    // Academic Counselor applies immediately on selection (no Search click needed). select2's programmatic
    // updates use the namespaced 'change.select2', so this plain 'change' handler only fires on real user picks.
    $('#lddCounselorFilter').off('change').on('change', function () {
        LEAD_DEMO_DASHBOARD_STATE.counselor = parseInt($(this).val(), 10) || 0;
        LEAD_DEMO_DASHBOARD_STATE.leadPage = 0;
        LEAD_DEMO_DASHBOARD_STATE.demoPage = 0;
        LEAD_DEMO_DASHBOARD_STATE.agingPage = 0;
        resetLeadDemoDashboardAiInsights();
        fetchLeadDemoDashboardAll();
    });

    // Academic Counselor applies immediately on selection (no Search click needed). select2's programmatic
    // updates use the namespaced 'change.select2', so this plain 'change' handler only fires on real user picks.
    $('#lddCounselorFilter').off('change').on('change', function () {
        LEAD_DEMO_DASHBOARD_STATE.counselor = parseInt($(this).val(), 10) || 0;
        LEAD_DEMO_DASHBOARD_STATE.leadPage = 0;
        LEAD_DEMO_DASHBOARD_STATE.demoPage = 0;
        LEAD_DEMO_DASHBOARD_STATE.agingPage = 0;
        resetLeadDemoDashboardAiInsights();
        fetchLeadDemoDashboardAll();
    });

    $('#lddResetBtn').off('click').on('click', function () {
        LEAD_DEMO_DASHBOARD_STATE.range = 'today';
        LEAD_DEMO_DASHBOARD_STATE.campaign = '';
        LEAD_DEMO_DASHBOARD_STATE.country = 0;
        LEAD_DEMO_DASHBOARD_STATE.counselor = 0;
        LEAD_DEMO_DASHBOARD_STATE.demoStatus = 'CURRENT';
        LEAD_DEMO_DASHBOARD_STATE.contacted = '';
        LEAD_DEMO_DASHBOARD_STATE.searchText = '';
        LEAD_DEMO_DASHBOARD_STATE.leadPage = 0;
        LEAD_DEMO_DASHBOARD_STATE.demoPage = 0;
        LEAD_DEMO_DASHBOARD_STATE.agingPage = 0;
        LEAD_DEMO_DASHBOARD_STATE.leadShowAll = false;
        LEAD_DEMO_DASHBOARD_STATE.demoShowAll = false;
        $('#lddDateRange').val('today');
        $('#lddFromDateCol, #lddToDateCol').hide();
        var today = new Date();
        $('#lddStartDate').datepicker('setDate', today);
        $('#lddEndDate').datepicker('setDate', today);
        $('#lddCampaignFilter').val('').trigger('change.select2');
        $('#lddCountryFilter').val('0').trigger('change.select2');
        $('#lddCounselorFilter').val('0').trigger('change.select2');
        $('#lddLeadSearch').val('');
        $('#lddContactFilter').val('');
        $('#lddLeadShowAll').prop('checked', false);
        $('#lddDemoShowAll').prop('checked', false);
        $('#lddDemoChips .ldd-chip').removeClass('active');
        $('#lddDemoChips .ldd-chip[data-status="CURRENT"]').addClass('active');
        $('#lddAutoRefresh').val('600');
        setLeadDemoDashboardAutoRefreshTimer(600);
        $('#lddAiPriorityToggle').prop('checked', true);
        LEAD_DEMO_DASHBOARD_AI_PRIORITY_ENABLED = true;
        resetLeadDemoDashboardAiInsights();
        fetchLeadDemoDashboardAll();
    });

    $('#lddAiInsightsBtn').off('click').on('click', function () {
        fetchLeadDemoDashboardAiInsights();
    });

    $('#lddAiDraftSendEmail').off('click').on('click', function () {
        sendLeadDemoDashboardAiDraftEmail();
    });

    $('#lddAiDraftSave').off('click').on('click', function () {
        saveLeadDemoDashboardAiDraft();
    });

    $('#lddAiDraftCopy').off('click').on('click', function () {
        copyLeadDemoDashboardAiDraft();
    });

    $(document).off('click.lddSignal', '.ldd-signal-header').on('click.lddSignal', '.ldd-signal-header', function () {
        var target = $($(this).data('target'));
        var chevron = $(this).find('.ldd-chevron');
        if (target.is(':visible')) {
            target.slideUp(150);
            chevron.css('transform', '');
        } else {
            target.slideDown(150);
            chevron.css('transform', 'rotate(180deg)');
        }
    });

    $('#lddAutoRefresh').off('change').on('change', function () {
        setLeadDemoDashboardAutoRefreshTimer(parseInt($(this).val(), 10) || 0);
    });

    $('#lddAiPriorityToggle').off('change').on('change', function () {
        LEAD_DEMO_DASHBOARD_AI_PRIORITY_ENABLED = $(this).is(':checked');
        if (LEAD_DEMO_DASHBOARD_AI_PRIORITY_ENABLED) {
            fetchLeadDemoDashboardLeadPriorityAuto(false);
        } else {
            fetchLeadDemoDashboardSection('leadList');
            fetchLeadDemoDashboardSection('demoList');
        }
    });

    $('#lddDemoChips').off('click').on('click', '.ldd-chip', function () {
        $('#lddDemoChips .ldd-chip').removeClass('active');
        $(this).addClass('active');
        LEAD_DEMO_DASHBOARD_STATE.demoStatus = $(this).data('status') || '';
        LEAD_DEMO_DASHBOARD_STATE.demoPage = 0;
        fetchLeadDemoDashboardSection('demoList');
        fetchLeadDemoDashboardLeadPriorityAuto(false, 'demo');
    });

    $('#lddContactFilter').off('change').on('change', function () {
        LEAD_DEMO_DASHBOARD_STATE.contacted = $(this).val() || '';
        LEAD_DEMO_DASHBOARD_STATE.leadPage = 0;
        fetchLeadDemoDashboardSection('leadList');
        fetchLeadDemoDashboardLeadPriorityAuto(false, 'lead');
    });

    $('#lddLeadShowAll').off('change').on('change', function () {
        LEAD_DEMO_DASHBOARD_STATE.leadShowAll = $(this).is(':checked');
        LEAD_DEMO_DASHBOARD_STATE.leadPage = 0;
        fetchLeadDemoDashboardSection('leadList');
        fetchLeadDemoDashboardLeadPriorityAuto(false, 'lead');
    });

    $('#lddDemoShowAll').off('change').on('change', function () {
        LEAD_DEMO_DASHBOARD_STATE.demoShowAll = $(this).is(':checked');
        LEAD_DEMO_DASHBOARD_STATE.demoPage = 0;
        fetchLeadDemoDashboardSection('demoList');
        fetchLeadDemoDashboardLeadPriorityAuto(false, 'demo');
    });

    var lddSearchTimer = null;
    $('#lddLeadSearch').off('keyup').on('keyup', function () {
        var value = $(this).val();
        if (lddSearchTimer) {
            window.clearTimeout(lddSearchTimer);
        }
        lddSearchTimer = window.setTimeout(function () {
            LEAD_DEMO_DASHBOARD_STATE.searchText = value || '';
            LEAD_DEMO_DASHBOARD_STATE.leadPage = 0;
            fetchLeadDemoDashboardSection('leadList');
            fetchLeadDemoDashboardLeadPriorityAuto(false, 'lead');
        }, 400);
    });

}

// Numbered pagination ("Prev, 1, 2, 3 ... N, Next") — used by Lead List, Demo List and the
// Aging Leads table inside "Lead Response Health". gotoFnName is a global function name (called
// with the target 0-based page index) so this same builder works for all three lists.
function getLeadDemoDashboardPageWindow(current, total) {
    var span = 2;
    var pages = [];
    for (var i = 0; i < total; i++) {
        if (i === 0 || i === total - 1 || (i >= current - span && i <= current + span)) {
            pages.push(i);
        } else if (pages[pages.length - 1] !== '...') {
            pages.push('...');
        }
    }
    return pages;
}

function getLeadDemoDashboardPaginationHtml(currentPage, pageSize, totalCount, gotoFnName) {
    var totalPages = Math.max(1, Math.ceil((totalCount || 0) / (pageSize || 10)));
    if (totalPages <= 1) {
        return '';
    }
    var safeCurrent = Math.min(Math.max(currentPage || 0, 0), totalPages - 1);
    var html = '<button type="button" class="btn btn-sm btn-outline-primary" ' + (safeCurrent <= 0 ? 'disabled' : '')
        + ' onclick="' + gotoFnName + '(' + (safeCurrent - 1) + ')">Prev</button>';
    $.each(getLeadDemoDashboardPageWindow(safeCurrent, totalPages), function (_, p) {
        if (p === '...') {
            html += '<span class="text-muted" style="padding:0 4px;">...</span>';
        } else {
            html += '<button type="button" class="btn btn-sm ' + (p === safeCurrent ? 'btn-primary' : 'btn-outline-primary')
                + '" onclick="' + gotoFnName + '(' + p + ')">' + (p + 1) + '</button>';
        }
    });
    html += '<button type="button" class="btn btn-sm btn-outline-primary" ' + (safeCurrent >= totalPages - 1 ? 'disabled' : '')
        + ' onclick="' + gotoFnName + '(' + (safeCurrent + 1) + ')">Next</button>';
    html += '<span class="text-muted" style="font-size:12px; margin-left:6px;">Page ' + (safeCurrent + 1) + ' of ' + totalPages + '</span>';
    return html;
}

function goToLeadDemoDashboardLeadPage(page) {
    LEAD_DEMO_DASHBOARD_STATE.leadPage = Math.max(0, page);
    fetchLeadDemoDashboardSection('leadList');
    fetchLeadDemoDashboardLeadPriorityAuto(false, 'lead');
}

function goToLeadDemoDashboardDemoPage(page) {
    LEAD_DEMO_DASHBOARD_STATE.demoPage = Math.max(0, page);
    fetchLeadDemoDashboardSection('demoList');
    fetchLeadDemoDashboardLeadPriorityAuto(false, 'demo');
}

function goToLeadDemoDashboardAgingPage(page) {
    LEAD_DEMO_DASHBOARD_STATE.agingPage = Math.max(0, page);
    fetchLeadDemoDashboardSection('responseHealth');
}

function getLeadDemoDashboardDateRange() {
    var rangeType = LEAD_DEMO_DASHBOARD_STATE.range;
    if (rangeType === 'custom') {
        return {
            startDate: ($('#lddStartDate').val() || '') + ' 00:00',
            endDate: ($('#lddEndDate').val() || '') + ' 23:59'
        };
    }
    var now = new Date();
    var start = new Date();
    var end = new Date();
    if (rangeType === 'yesterday') {
        start.setDate(now.getDate() - 1);
        end.setDate(now.getDate() - 1);
    } else if (rangeType === 'week') {
        var day = now.getDay();
        start = new Date(now); start.setDate(now.getDate() - day);
        end = new Date(start); end.setDate(start.getDate() + 6);
    } else if (rangeType === 'month') {
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    }
    function fmt(d) {
        var mm = ('0' + (d.getMonth() + 1)).slice(-2);
        var dd = ('0' + d.getDate()).slice(-2);
        return d.getFullYear() + '-' + mm + '-' + dd;
    }
    return { startDate: fmt(start) + ' 00:00', endDate: fmt(end) + ' 23:59' };
}

// Standard display date — "2026-08-12" -> "12-Aug-2026".
function leadDemoDashboardFormatDateStd(dateStr) {
    var ymd = String(dateStr || '').substring(0, 10).split('-');
    if (ymd.length < 3) { return String(dateStr || '').substring(0, 10); }
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var mi = parseInt(ymd[1], 10) - 1;
    if (mi < 0 || mi > 11) { return String(dateStr || '').substring(0, 10); }
    return ymd[2] + '-' + months[mi] + '-' + ymd[0];
}

function setLeadDemoDashboardDateLabel() {
    var range = getLeadDemoDashboardDateRange();
    var labelMap = { today: 'daily view', yesterday: 'daily view', week: 'this week', month: 'this month', custom: 'custom range' };
    var start = leadDemoDashboardFormatDateStd(range.startDate);
    var end = leadDemoDashboardFormatDateStd(range.endDate);
    var datePart = (start === end) ? start : (start + ' to ' + end);
    $('#lddDateLabel').text(datePart + ' · ' + (labelMap[LEAD_DEMO_DASHBOARD_STATE.range] || ''));
}

function getLeadDemoDashboardRequestParams(section) {
    var range = getLeadDemoDashboardDateRange();
    var params = {
        section: section,
        startDate: range.startDate,
        endDate: range.endDate,
        schoolId: SCHOOL_ID,
        userId: USER_ID,
        campaign: LEAD_DEMO_DASHBOARD_STATE.campaign,
        country: LEAD_DEMO_DASHBOARD_STATE.country,
        counselor: LEAD_DEMO_DASHBOARD_STATE.counselor,
        demoStatus: '',
        contacted: '',
        searchText: '',
        page: 0,
        pageSize: LEAD_DEMO_DASHBOARD_STATE.pageSize
    };
    if (section === 'demoList') {
        params.demoStatus = LEAD_DEMO_DASHBOARD_STATE.demoStatus;
        params.page = LEAD_DEMO_DASHBOARD_STATE.demoPage;
        if (LEAD_DEMO_DASHBOARD_STATE.demoShowAll) {
            params.page = 0;
            params.pageSize = 100000;
        }
    }
    if (section === 'leadList') {
        params.contacted = LEAD_DEMO_DASHBOARD_STATE.contacted;
        params.searchText = LEAD_DEMO_DASHBOARD_STATE.searchText;
        params.page = LEAD_DEMO_DASHBOARD_STATE.leadPage;
        if (LEAD_DEMO_DASHBOARD_STATE.leadShowAll) {
            params.page = 0;
            params.pageSize = 100000;
        }
    }
    if (section === 'responseHealth') {
        params.page = LEAD_DEMO_DASHBOARD_STATE.agingPage;
        params.pageSize = 10;
    }
    return params;
}

function fetchLeadDemoDashboardAll(fromAutoRefreshTimer) {
    setLeadDemoDashboardDateLabel();
    fetchLeadDemoDashboardSection('kpis');
    fetchLeadDemoDashboardSection('demoBoard');
    fetchLeadDemoDashboardSection('leadList');
    fetchLeadDemoDashboardSection('demoList');
    fetchLeadDemoDashboardSection('campaignPerf');
    fetchLeadDemoDashboardSection('countryPerf');
    fetchLeadDemoDashboardSection('charts');
    fetchLeadDemoDashboardSection('counselorPerf');
    fetchLeadDemoDashboardSection('responseHealth');
    fetchLeadDemoDashboardLeadPriorityAuto(!!fromAutoRefreshTimer);
}

// ── Auto-refresh (1-min tick refreshes KPIs/lists/charts every time; the AI-priority call
// underneath is separately throttled to once per 20 min — see fetchLeadDemoDashboardLeadPriorityAuto) ──
function setLeadDemoDashboardAutoRefreshTimer(seconds) {
    if (LEAD_DEMO_DASHBOARD_AUTO_REFRESH_TIMER) {
        window.clearInterval(LEAD_DEMO_DASHBOARD_AUTO_REFRESH_TIMER);
        LEAD_DEMO_DASHBOARD_AUTO_REFRESH_TIMER = null;
    }
    if (seconds > 0) {
        LEAD_DEMO_DASHBOARD_AUTO_REFRESH_TIMER = window.setInterval(function () {
            fetchLeadDemoDashboardAll(true);
        }, seconds * 1000);
    }
}

// The Lead List always refreshes on its own fixed 1-minute cadence — independent of the Auto-refresh
// dropdown above — so newly-created leads surface quickly. Runs silently (no spinner) and only re-fetches
// the Lead List section, leaving the rest of the dashboard untouched.
function setLeadDemoDashboardLeadListRefreshTimer() {
    if (LEAD_DEMO_DASHBOARD_LEAD_LIST_REFRESH_TIMER) {
        window.clearInterval(LEAD_DEMO_DASHBOARD_LEAD_LIST_REFRESH_TIMER);
        LEAD_DEMO_DASHBOARD_LEAD_LIST_REFRESH_TIMER = null;
    }
    LEAD_DEMO_DASHBOARD_LEAD_LIST_REFRESH_TIMER = window.setInterval(function () {
        fetchLeadDemoDashboardSection('leadList', true);
    }, 60 * 1000);
}

// silent=true runs the section fetch without the page-wide loader — used for the background
// AI-priority refresh so the list data shows first and the AI columns fill in later without the
// loader spinning a second time.
function fetchLeadDemoDashboardSection(section, silent) {
    // global:false keeps every section OFF the shared full-page overlay; instead each section shows its own
    // small spinner (skipped for silent background refreshes, which quietly update already-rendered data).
    if (!silent) {
        showLeadDemoDashboardSectionLoading(section);
    }
    $.ajax({
        type: 'POST',
        contentType: APPLICATION_JSON_VALUE,
        url: getURLForHTML('dashboard', 'reports/lead-demo-dashboard'),
        data: JSON.stringify(getLeadDemoDashboardRequestParams(section)),
        dataType: 'json',
        cache: false,
        global: false,
        timeout: 600000,
        success: function (data) {
            if (!data || data.status === '0' || data.status === '2' || data.status === '3') {
                if (data && data.status === '3') {
                    redirectLoginPage();
                } else {
                    if (!silent) { showLeadDemoDashboardSectionError(section); }
                    showMessageTheme2(0, (data && data.message) ? data.message : 'Data not found', '', true);
                }
                return;
            }
            renderLeadDemoDashboardSection(section, data.data || {});
        },
        error: function () {
            if (!silent) { showLeadDemoDashboardSectionError(section); }
            showMessageTheme2(0, 'Unable to fetch dashboard data (' + section + ').', '', true);
        }
    });
}

// Per-section loading spinner / error — each dashboard section fills independently, so the page never
// blocks behind the slowest one. "colspan=100" spans any table width without hard-coding column counts.
function leadDemoDashboardSectionSpinnerRow() {
    return '<tr><td colspan="100" class="text-center" style="padding:16px;"><span class="ldd-mini-spin"></span> <span class="text-muted" style="font-size:12px;">Loading…</span></td></tr>';
}
function leadDemoDashboardSectionSpinnerBlock() {
    return '<div class="text-center" style="padding:16px;"><span class="ldd-mini-spin"></span> <span class="text-muted" style="font-size:12px;">Loading…</span></div>';
}
function showLeadDemoDashboardSectionLoading(section) {
    switch (section) {
        case 'kpis':
            $('#lddKpiLeads,#lddKpiNotContacted,#lddKpiDemos,#lddKpiRunning,#lddKpiAwaiting,#lddKpiCompleted,#lddKpiNoShow').html('<span class="ldd-mini-spin"></span>');
            break;
        case 'demoBoard': $('#lddDemoBoard').html(leadDemoDashboardSectionSpinnerBlock()); break;
        case 'leadList': $('#lddLeadTableBody').html(leadDemoDashboardSectionSpinnerRow()); break;
        case 'demoList':
            $('#lddDemoTableBody').html(leadDemoDashboardSectionSpinnerRow());
            $('#lddDemoFilteredHeatmap').html(leadDemoDashboardSectionSpinnerBlock());
            break;
        case 'campaignPerf': $('#lddCampaignTableBody').html(leadDemoDashboardSectionSpinnerRow()); break;
        case 'countryPerf': $('#lddCountryTableBody').html(leadDemoDashboardSectionSpinnerRow()); break;
        case 'charts': $('#lddTrendChart').html(leadDemoDashboardSectionSpinnerBlock()); break;
        case 'counselorPerf': $('#lddCounselorTableBody').html(leadDemoDashboardSectionSpinnerRow()); break;
        case 'responseHealth': $('#lddResponseHealthBody').html(leadDemoDashboardSectionSpinnerBlock()); break;
    }
}
function showLeadDemoDashboardSectionError(section) {
    var rowErr = '<tr><td colspan="100" class="text-center text-danger" style="padding:12px; font-size:12px;">Unable to load — please retry.</td></tr>';
    var blockErr = '<div class="text-center text-danger" style="padding:12px; font-size:12px;">Unable to load — please retry.</div>';
    switch (section) {
        case 'demoBoard': $('#lddDemoBoard').html(blockErr); break;
        case 'leadList': $('#lddLeadTableBody').html(rowErr); break;
        case 'demoList': $('#lddDemoTableBody').html(rowErr); break;
        case 'campaignPerf': $('#lddCampaignTableBody').html(rowErr); break;
        case 'countryPerf': $('#lddCountryTableBody').html(rowErr); break;
        case 'charts': $('#lddTrendChart').html(blockErr); break;
        case 'counselorPerf': $('#lddCounselorTableBody').html(rowErr); break;
        case 'responseHealth': $('#lddResponseHealthBody').html(blockErr); break;
        case 'kpis':
            $('#lddKpiLeads,#lddKpiNotContacted,#lddKpiDemos,#lddKpiRunning,#lddKpiAwaiting,#lddKpiCompleted,#lddKpiNoShow').text('—');
            break;
    }
}

function renderLeadDemoDashboardSection(section, data) {
    switch (section) {
        case 'kpis': renderLeadDemoDashboardKpis(data); break;
        case 'demoBoard': renderLeadDemoDashboardBoard(data.demos || []); break;
        case 'leadList': renderLeadDemoDashboardLeadList(data.leads || [], data.totalCount || 0); break;
        case 'demoList': renderLeadDemoDashboardDemoList(data.demos || [], data.totalCount || 0, data.counselorHourFiltered || []); break;
        case 'campaignPerf': renderLeadDemoDashboardGroupTable(data.campaigns || [], 'lddCampaignTableBody'); break;
        case 'countryPerf': renderLeadDemoDashboardGroupTable(data.countries || [], 'lddCountryTableBody'); break;
        case 'charts': renderLeadDemoDashboardCharts(data); break;
        case 'counselorPerf': renderLeadDemoDashboardCounselors(data.counselors || [], data); break;
        case 'responseHealth': renderLeadDemoDashboardResponseHealth(data || {}); break;
    }
}

// ── Section renderers ─────────────────────────────────────────────────────

function renderLeadDemoDashboardKpis(kpis) {
    $('#lddKpiLeads').text(kpis.totalLeads || 0);
    $('#lddKpiNotContacted').text(kpis.notContacted || 0);
    $('#lddKpiDemos').text(kpis.totalDemos || 0);
    $('#lddKpiRunning').text(kpis.runningDemos || 0);
    $('#lddKpiAwaiting').text(kpis.awaitingDemos || 0);
    $('#lddKpiCompleted').text(kpis.completedDemos || 0);
    $('#lddKpiNoShow').text(kpis.noShowDemos || 0);
    $('#lddKpiConversion').text((kpis.conversionPct || 0) + '%');
    $('#lddKpiLeadConvert').text((kpis.leadConvertPct || 0) + '%');
    $('#lddKpiDemoConvert').text((kpis.demoConvertPct || 0) + '%');
    $('#lddLeadListTotalCount').text('· ' + (kpis.totalLeads || 0) + ' total');
    $('#lddDemoListTotalCount').text('· ' + (kpis.totalDemos || 0) + ' total');
    $('#lddLeadListAvgResponseTime').text(kpis.avgResponse ? '· Avg Response Time ' + kpis.avgResponse : '');
}

function getLeadDemoDashboardStatusBadge(status) {
    var map = {
        UPCOMING: { cls: 'ldd-b-gray', label: 'Upcoming' },
        RUNNING: { cls: 'ldd-b-blue', label: 'Running' },
        AWAITING: { cls: 'ldd-b-purple', label: 'Schedule' },
        COMPLETED: { cls: 'ldd-b-green', label: 'Completed' },
        NO_SHOW: { cls: 'ldd-b-amber', label: 'No-Show' },
        CANCELLED: { cls: 'ldd-b-red', label: 'Cancelled' },
        NOT_DONE: { cls: 'ldd-b-gray', label: 'Not Done' }
    };
    var item = map[status] || { cls: 'ldd-b-gray', label: status || 'N/A' };
    return '<span class="ldd-badge ' + item.cls + '">' + item.label + '</span>';
}

// Shown only for completed demos; recording URL is resolved on click (not eager-loaded per row)
function getLeadDemoDashboardTranscriptButton(demo) {
    if (demo.status !== 'COMPLETED' || !demo.leadId || !demo.hasRecording) {
        return '';
    }
    return ' <button type="button" class="btn btn-sm btn-primary" style="margin-left:6px;" '
        + 'onclick="fetchLeadDemoDashboardTranscript(' + demo.leadId + ', this)">Transcript</button>';
}

function fetchLeadDemoDashboardTranscript(leadId, buttonEl) {
    var $btn = $(buttonEl);
    $btn.prop('disabled', true).text('Loading...');
    $.ajax({
        type: 'POST',
        contentType: APPLICATION_JSON_VALUE,
        url: getURLForHTML('dashboard', 'reports/lead-demo-recording-url'),
        data: JSON.stringify({ leadId: leadId }),
        dataType: 'json',
        cache: false,
        success: function (data) {
            $btn.prop('disabled', false).text('Transcript');
            if (!data || data.status === '0' || data.status === '2' || data.status === '3') {
                if (data && data.status === '3') {
                    redirectLoginPage();
                } else {
                    showMessageTheme2(0, (data && data.message) || 'Unable to fetch transcript.', '', true);
                }
                return;
            }
            if (!data.recordingUrl) {
                showMessageTheme2(0, 'No recording available for this demo.', '', true);
                return;
            }
            showVTTFile(data.recordingUrl, 'Transcript', false);
        },
        error: function () {
            $btn.prop('disabled', false).text('Transcript');
            showMessageTheme2(0, 'Unable to fetch transcript.', '', true);
        }
    });
}

var LEAD_DEMO_DASHBOARD_MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Opens the existing lead-detail page (same getAsPost pattern used in leads.js / AI Email Draft)
// when a Lead No is clicked, in both Lead List and Demo List.
function getLeadDemoDashboardLeadNoLink(leadNo) {
    if (!leadNo) { return 'N/A'; }
    return '<a href="javascript:void(0)" onclick="getAsPost(\'/dashboard/lead-data-list?moduleId=111&leadId=' + leadNo
        + '&leadFrom=LEAD&clickFrom=list&startDate=&endDate=&country=0&campaign=&currentPage=0&euid=' + ENCRYPTED_USER_ID
        + '&leadType=B2C\');">' + leadNo + '</a>';
}

// Converts "yyyy-MM-dd HH:mm:ss" to project standard "dd MMM yyyy hh:mm A", e.g. "10 Jul 2026 09:22 AM"
function getLeadDemoDashboardFormattedDateTime(dateTimeText) {
    if (!dateTimeText) { return ''; }
    var parts = String(dateTimeText).split(' ');
    if (parts.length < 1) { return dateTimeText; }
    var dateParts = parts[0].split('-');
    if (dateParts.length < 3) { return dateTimeText; }
    var year = dateParts[0];
    var month = LEAD_DEMO_DASHBOARD_MONTH_NAMES[parseInt(dateParts[1], 10) - 1] || dateParts[1];
    var day = ('0' + parseInt(dateParts[2], 10)).slice(-2);
    var datePart = day + ' ' + month + ' ' + year;
    if (parts.length < 2) { return datePart; }
    return datePart + ' ' + getLeadDemoDashboardFormattedTime(dateTimeText);
}

// Converts "yyyy-MM-dd HH:mm:ss" (or just "HH:mm:ss") to 12-hour "hh:mm A", e.g. "09:22 AM"
function getLeadDemoDashboardFormattedTime(dateTimeText) {
    if (!dateTimeText) { return ''; }
    var parts = String(dateTimeText).split(' ');
    var timePart = parts.length > 1 ? parts[1] : parts[0];
    var timeSegments = timePart.split(':');
    if (timeSegments.length < 2) { return dateTimeText; }
    var hours = parseInt(timeSegments[0], 10);
    var minutes = timeSegments[1];
    var meridiem = hours >= 12 ? 'PM' : 'AM';
    var hours12 = hours % 12;
    if (hours12 === 0) { hours12 = 12; }
    return ('0' + hours12).slice(-2) + ':' + minutes + ' ' + meridiem;
}

// Converts a MySQL TIME duration ("HH:MM:SS", possibly "D HH:MM:SS" for 24h+) into a friendly
// "Xd Yh", "Xh Ym" or "Ym Zs" style label, e.g. "38 min" or "1h 5m"
function getLeadDemoDashboardFormattedDuration(durationText) {
    if (!durationText) { return '—'; }
    var text = String(durationText).trim();
    var days = 0;
    var timePart = text;
    if (text.indexOf(' ') > -1) {
        var dayParts = text.split(' ');
        days = parseInt(dayParts[0], 10) || 0;
        timePart = dayParts[1];
    }
    var segments = timePart.split(':');
    if (segments.length < 2) { return text; }
    var hours = parseInt(segments[0], 10) || 0;
    var minutes = parseInt(segments[1], 10) || 0;
    var seconds = segments.length > 2 ? (parseInt(segments[2], 10) || 0) : 0;

    if (days > 0) {
        return days + 'd ' + hours + 'h';
    } else if (hours > 0) {
        return hours + 'h ' + minutes + 'm';
    } else if (minutes > 0) {
        return minutes + 'm' + (seconds > 0 ? ' ' + seconds + 's' : '');
    } else if (seconds > 0) {
        return seconds + 's';
    }
    return '—';
}

// Plain single-line join-order text (used by the compact Demo Board cards)
function getLeadDemoDashboardJoinOrderText(demo) {
    var hostTime = getLeadDemoDashboardFormattedTime(demo.hostJoinTime);
    var attendeeTime = getLeadDemoDashboardFormattedTime(demo.attendeeJoinTime);
    if (demo.joinOrder === 'HOST_FIRST') {
        return 'Host ' + hostTime + ' → Attendee ' + attendeeTime;
    } else if (demo.joinOrder === 'ATTENDEE_FIRST') {
        return 'Attendee ' + attendeeTime + ' → Host ' + hostTime;
    } else if (demo.joinOrder === 'HOST_ONLY') {
        return 'Host ' + hostTime + ' → no attendee joined';
    } else if (demo.joinOrder === 'ATTENDEE_ONLY') {
        return 'Attendee ' + attendeeTime + ' → host not joined';
    }
    return '—';
}

// Join order + host-late merged into one sentence/cell (used by the Demo List table)
function getLeadDemoDashboardJoinOrderSentence(demo) {
    var line1 = getLeadDemoDashboardJoinOrderText(demo);
    if (line1 === '—') {
        return '—';
    }

    var line2 = '';
    if (demo.status !== 'UPCOMING' && (demo.hostJoinTime || demo.hostClickTime)) {
        var lateMinutes = demo.hostLateMinutes || 0;
        line2 = lateMinutes <= 0
            ? '<div class="ldd-resp-fast">Host Joined On time</div>'
            : '<div class="ldd-resp-slow">Host Late ' + lateMinutes + ' min late</div>';
    }

    var line3 = '';
    var durationText = getLeadDemoDashboardFormattedDuration(demo.duration);
    if (durationText !== '—') {
        line3 = '<div class="text-muted">Total Duration ' + durationText + '</div>';
    }
    return '<div>' + line1 + '</div>' + line2 + line3;
}

// Attendees column: count on top, attendee's actual join time (ATTENDEE_JOIN_TIME) below when available;
// falls back to ATTENDEE_CLICK_TIME (clicked to join but never actually connected — e.g. No-Show) when there's no join time.
function getLeadDemoDashboardAttendeeCell(demo) {
    if (demo.attendeeJoinTime) {
        return '<div class="text-muted" style="font-size:11px;">Joined: ' + getLeadDemoDashboardFormattedTime(demo.attendeeJoinTime) + '</div>';
    } else if (demo.attendeeClickTime) {
        return '<div class="ldd-resp-slow" style="font-size:11px;">Clicked: ' + getLeadDemoDashboardFormattedTime(demo.attendeeClickTime) + ' (not joined)</div>';
    }
    return '<span class="text-muted">—</span>';
}

function renderLeadDemoDashboardBoard(demos) {
    if (!demos || demos.length === 0) {
        $('#lddDemoBoard').html('<p class="text-muted">No demo found for this filter</p>');
        return;
    }
    // Show the (status-relevant) board cards in chronological order — earliest scheduled time first —
    // so the times read in order instead of being grouped by status. demoTime is "YYYY-MM-DD HH:mm:ss"
    // (assignTimeZone-local), which sorts chronologically as a plain string.
    var sorted = demos.slice().sort(function (a, b) {
        return String(a.demoTime || '').localeCompare(String(b.demoTime || ''));
    });
    var html = '';
    $.each(sorted, function (_, demo) {
        var border = demo.status === 'RUNNING' ? 'border-color:#0f766e;' : '';
        html += '<div class="ldd-demo-card" style="' + border + '">'
            + getLeadDemoDashboardStatusBadge(demo.status)
            + '<p class="ldd-dc-title">' + (demo.leadName ? 'Parent - ' + demo.leadName : 'N/A') + '</p>'
            + '<p class="ldd-dc-meta">' + getLeadDemoDashboardFormattedDateTime(demo.demoTime) + ' · ' + (demo.country || 'N/A') + '</p>'
            + '<p class="ldd-dc-info" style="' + getLeadDemoDashboardBoardHostColor(demo.status) + '">Host: ' + (demo.counselorName || 'N/A') + '</p>'
        + '</div>';
    });
    $('#lddDemoBoard').html(html);
}

function getLeadDemoDashboardBoardHostColor(status) {
    if (status === 'RUNNING') {
        return 'color:#0f766e;';
    }
    if (status === 'AWAITING') {
        return 'color:#6d28d9;';
    }
    return '';
}

// Shown only when an AI-generated per-lead reason is available (after "Analyze with AI")
function getLeadDemoDashboardWhyLink(leadId) {
    if (!leadId || !LEAD_DEMO_DASHBOARD_LEAD_REASONS[leadId]) {
        return '';
    }
    return ' <a href="javascript:void(0);" style="font-size:11px;" onclick="toggleLeadDemoDashboardReasonPopover(this)">Why?</a>'
        + '<div class="ldd-reason-popover" style="display:none;">' + LEAD_DEMO_DASHBOARD_LEAD_REASONS[leadId] + '</div>';
}

function toggleLeadDemoDashboardReasonPopover(linkEl) {
    $(linkEl).next('.ldd-reason-popover').toggle();
}

// AI Priority / Score / Risk / Follow-up Due — populated by the same "Analyze with AI" call as the
// per-lead reasons above (see renderLeadDemoDashboardAiInsightsResult). Shows "Analyzing..." until that
// call completes, and "—" if this specific lead was outside the analyzed page or the call failed.
function getLeadDemoDashboardPriorityBadge(priority) {
    var map = { HIGH: 'ldd-b-red', MEDIUM: 'ldd-b-amber', LOW: 'ldd-b-gray' };
    return '<span class="ldd-badge ' + (map[priority] || 'ldd-b-gray') + '">' + (priority || '—') + '</span>';
}

function getLeadDemoDashboardRiskBadge(risk) {
    var map = { HIGH: 'ldd-b-red', MEDIUM: 'ldd-b-amber', LOW: 'ldd-b-green' };
    return '<span class="ldd-badge ' + (map[risk] || 'ldd-b-gray') + '">' + (risk || '—') + '</span>';
}

function getLeadDemoDashboardAiPriorityCells(leadId) {
    if (!LEAD_DEMO_DASHBOARD_AI_PRIORITY_ENABLED) {
        return {
            priority: '<span class="text-muted font-italic">AI Priority Off</span>',
            score: '—',
            risk: '<span class="text-muted font-italic">AI Priority Off</span>',
            followUp: '—'
        };
    }
    if (LEAD_DEMO_DASHBOARD_AI_LOADING) {
        return {
            priority: '<span class="text-muted font-italic">Analyzing…</span>',
            score: '—',
            risk: '<span class="text-muted font-italic">Analyzing…</span>',
            followUp: '—'
        };
    }
    if (!LEAD_DEMO_DASHBOARD_AI_ANALYZED) {
        return {
            priority: '<span class="text-muted font-italic">Not analyzed</span>',
            score: '—',
            risk: '<span class="text-muted font-italic">Not analyzed</span>',
            followUp: '—'
        };
    }
    var info = leadId ? LEAD_DEMO_DASHBOARD_LEAD_PRIORITY[leadId] : null;
    if (!info) {
        return { priority: '—', score: '—', risk: '—', followUp: '—' };
    }
    return {
        priority: getLeadDemoDashboardPriorityBadge(info.aiPriority),
        score: (info.priorityScore || info.priorityScore === 0) ? info.priorityScore : '—',
        risk: getLeadDemoDashboardRiskBadge(info.riskLevel),
        followUp: info.followUpDueDate ? getLeadDemoDashboardFormattedDateTime(info.followUpDueDate) : '—'
    };
}

// Phase 4 — 3-tier "best time to contact", computed per-lead server-side (see lead.bestTime):
// "country" = this country's own historical best hour (most precise), "global" = cross-country
// pooled pattern applied in this lead's own local time (used when the country alone lacks samples),
// "generic" = plain business-hours fallback (only when there's no usable history at all yet).
function getLeadDemoDashboardBestContactHint(bestTime) {
    if (!bestTime || !bestTime.label) {
        return '';
    }
    var isGeneric = bestTime.confidence === 'generic';
    var cls = isGeneric ? 'text-muted font-italic' : 'text-muted';
    var html = '<div class="' + cls + '" style="font-size:11px; margin-top:4px;"><i class="fa fa-clock-o"></i> Best time: ' + bestTime.label + '</div>';
    if (bestTime.yourTimeLabel) {
        html += '<div class="text-muted" style="font-size:11px;">(' + bestTime.yourTimeLabel.replace(' (local)', '') + ' your time)</div>';
    }
    if (isGeneric) {
        html += '<div class="text-muted font-italic" style="font-size:10px;">(estimated, not enough history yet)</div>';
    }
    return html;
}

// A lead can get re-submitted (a new "Duplicate lead" row pointing PARENT_LEAD_ID back here) when the
// same person inquires again — that resubmission has no remarks of its own and is otherwise invisible
// to the counselor. Surface it as a small reminder on this (the master) lead's row.
function getLeadDemoDashboardDuplicateHint(lead) {
    if (!lead.duplicateCount) {
        return '';
    }
    var latest = lead.latestDuplicateDate ? getLeadDemoDashboardFormattedDateTime(lead.latestDuplicateDate) : '';
    return '<div style="font-size:11px; margin-top:4px; color:#c62828; white-space:normal;"><i class="fa fa-refresh"></i> Re-inquired ' + lead.duplicateCount + 'x</div>'
        + (latest ? '<div style="font-size:11px; color:#c62828; white-space:normal;">last: ' + latest + '</div>' : '');
}

function renderLeadDemoDashboardLeadList(leads, totalCount) {
    var state = LEAD_DEMO_DASHBOARD_STATE;
    var html = '';
    if (!leads || leads.length === 0) {
        html = '<tr><td colspan="12" class="text-center">No records found</td></tr>';
    } else {
        $.each(leads, function (index, lead) {
            LEAD_DEMO_DASHBOARD_LEAD_INFO[lead.leadId] = { leadName: lead.leadName, leadNo: lead.leadNo, country: lead.country };
            var aiCells = getLeadDemoDashboardAiPriorityCells(lead.leadId);
            var contacted = lead.contacted === 'Y';
            var respClass = !contacted ? 'ldd-resp-wait' : (lead.responseSecond <= 600 ? 'ldd-resp-fast' : 'ldd-resp-slow');
            var respText = !contacted ? (lead.responseTime || '') + ' waiting' : (lead.responseTime || '');
            var connectedOnText = contacted && lead.firstContactTime
                ? '<div class="text-muted" style="font-size:11px;">Connected: ' + getLeadDemoDashboardFormattedDateTime(lead.firstContactTime) + '</div>' : '';
            var leadMeta = '<div>' + getLeadDemoDashboardLeadNoLink(lead.leadNo) + '</div>'
                + '<div class="text-muted">' + (lead.email || '—') + '</div>'
                + '<div class="text-muted">' + (lead.phoneNo || '—') + '</div>';
            var campaignCountry = '<div>' + (lead.campaign || 'N/A') + '</div>'
                + '<div class="text-muted">' + (lead.country || 'N/A') + '</div>';
            // A lead can have a LEAD_LOGS entry (contacted='Y') without any real conversation having
            // happened — hasRealFollowup (backed by actual FOLLOW_REMARKS text, not the CALL_STATUS
            // label) is the genuine signal; treat leads without it like not-contacted for the
            // "best time to contact" hint.
            var noRealFollowup = contacted && !lead.hasRealFollowup;
            // Highlight the 5 latest leads (top of the first page) so freshly-arrived leads stand out.
            var latestClass = (state.leadPage === 0 && index < 5) ? ' class="ldd-row-latest"' : '';
            html += '<tr' + latestClass + '>'
                + '<td>' + ((state.leadPage * state.pageSize) + index + 1) + '</td>'
                + '<td style="white-space:nowrap;">' + getLeadDemoDashboardFormattedDateTime(lead.createdDate) + getLeadDemoDashboardDuplicateHint(lead) + '</td>'
                + '<td>' + (lead.leadName || 'N/A') + '</td>'
                + '<td style="white-space:nowrap;">' + leadMeta + '</td>'
                + '<td>' + campaignCountry + '</td>'
                + '<td>' + (contacted
                    ? '<span class="ldd-badge ' + (noRealFollowup ? 'ldd-b-amber' : 'ldd-b-green') + '">'
                        + (noRealFollowup ? 'Pending Follow-up' : (lead.leadStatus || 'Contacted')) + '</span>'
                    : '<span class="ldd-badge ldd-b-red">Not Contacted</span>')
                    + getLeadDemoDashboardBestContactHint(lead.bestTime)
                    + '<div class="text-muted" style="font-size:11px; margin-top:4px;"><i class="fa fa-user-circle-o"></i> ' + (lead.counselorName || '—') + '</div></td>'
                + '<td class="' + respClass + '">' + respText + connectedOnText + '</td>'
                + '<td>' + aiCells.priority + '</td>'
                + '<td class="text-center">' + aiCells.score + getLeadDemoDashboardWhyLink(lead.leadId) + '</td>'
                + '<td>' + aiCells.risk + '</td>'
                + '<td style="white-space:nowrap;">' + aiCells.followUp + '</td>'
                + '<td><button type="button" class="btn btn-sm btn-outline-primary" onclick="openLeadDemoDashboardAiDraft(' + lead.leadId + ')"><i class="fa fa-envelope"></i> AI Draft</button></td>'
            + '</tr>';
        });
    }
    $('#lddLeadTableBody').html(html);
    if (state.leadShowAll) {
        $('#lddLeadPagination').html('<span class="text-muted" style="font-size:12px;">Showing all (' + (leads ? leads.length : 0) + ')</span>');
    } else {
        $('#lddLeadPagination').html(getLeadDemoDashboardPaginationHtml(state.leadPage, state.pageSize, totalCount, 'goToLeadDemoDashboardLeadPage'));
    }
}

function getLeadDemoDashboardRowHighlightClass(status) {
    var map = {
        RUNNING: 'ldd-row-running',
        AWAITING: 'ldd-row-awaiting',
        UPCOMING: 'ldd-row-upcoming',
        COMPLETED: 'ldd-row-completed'
    };
    return map[status] || '';
}

function renderLeadDemoDashboardDemoList(demos, totalCount, counselorHour) {
    var state = LEAD_DEMO_DASHBOARD_STATE;
    renderLeadDemoDashboardFilteredHeatmap(counselorHour || []);
    var html = '';
    if (!demos || demos.length === 0) {
        html = '<tr><td colspan="14" class="text-center">No records found</td></tr>';
    } else {
        $.each(demos, function (index, demo) {
            LEAD_DEMO_DASHBOARD_LEAD_INFO[demo.leadId] = { leadName: demo.leadName, leadNo: demo.leadNo, country: demo.country };
            var aiCells = getLeadDemoDashboardAiPriorityCells(demo.leadId);
            var demoLeadMeta = '<div>' + getLeadDemoDashboardLeadNoLink(demo.leadNo) + '</div>'
                + '<div class="text-muted">' + (demo.email || '—') + '</div>'
                + '<div class="text-muted">' + (demo.phoneNo || '—') + '</div>';
            var demoCampaignCountry = '<div>' + (demo.campaign || 'N/A') + '</div>'
                + '<div class="text-muted">' + (demo.country || 'N/A') + '</div>';
            html += '<tr class="' + getLeadDemoDashboardRowHighlightClass(demo.status) + '">'
                + '<td>' + ((state.demoPage * state.pageSize) + index + 1) + '</td>'
                + '<td style="white-space:nowrap;">' + getLeadDemoDashboardFormattedDateTime(demo.demoTime) + '</td>'
                + '<td>' + (demo.leadName || 'N/A') + '</td>'
                + '<td style="white-space:nowrap;">' + demoLeadMeta + '</td>'
                + '<td>' + demoCampaignCountry + '</td>'
                + '<td>' + (demo.counselorName || 'N/A') + '</td>'
                + '<td style="white-space:nowrap;">' + getLeadDemoDashboardJoinOrderSentence(demo) + '</td>'
                + '<td class="text-center" style="white-space:nowrap;">' + getLeadDemoDashboardAttendeeCell(demo) + '</td>'
                + '<td>' + getLeadDemoDashboardStatusBadge(demo.status) + getLeadDemoDashboardTranscriptButton(demo) + '</td>'
                + '<td>' + aiCells.priority + '</td>'
                + '<td class="text-center">' + aiCells.score + '</td>'
                + '<td>' + aiCells.risk + '</td>'
                + '<td style="white-space:nowrap;">' + aiCells.followUp + '</td>'
                + '<td><button type="button" class="btn btn-sm btn-outline-primary" onclick="openLeadDemoDashboardAiDraft(' + demo.leadId + ')"><i class="fa fa-envelope"></i> AI Draft</button></td>'
            + '</tr>';
        });
    }
    $('#lddDemoTableBody').html(html);
    $('#lddDemoCount').text(demos && demos.length ? '· ' + demos.length + ' shown' : '');
    if (state.demoShowAll) {
        $('#lddDemoPagination').html('<span class="text-muted" style="font-size:12px;">Showing all (' + (demos ? demos.length : 0) + ')</span>');
    } else {
        $('#lddDemoPagination').html(getLeadDemoDashboardPaginationHtml(state.demoPage, state.pageSize, totalCount, 'goToLeadDemoDashboardDemoPage'));
    }
}

// Filter-driven counselor × hour heatmap shown above the Demo List. Cell = total demos booked in that
// hour for the current filter; tooltip adds the completed / no-show breakdown; each row's peak hour is
// ringed. Reuses the same shade/label helpers and cursor tooltip as the session-wide heatmap.
function renderLeadDemoDashboardFilteredHeatmap(counselors) {
    var rows = counselors || [];
    var max = 0;
    $.each(rows, function (_, c) { $.each(c.hours || [], function (_, h) { if ((h.total || 0) > max) { max = h.total || 0; } }); });
    if (max <= 0) {
        $('#lddDemoFilteredHeatmap').html('<div class="text-muted" style="font-size:12px;">No demos in this filter.</div>');
        return;
    }
    var html = '<div style="display:grid; grid-template-columns:130px repeat(24, minmax(0,1fr)); gap:3px; align-items:center;">';
    html += '<div></div>';
    for (var h = 0; h < 24; h++) {
        html += '<div class="text-muted" style="font-size:10px; text-align:center;">' + (h % 3 === 0 ? leadDemoDashboardHourShort(h) : '') + '</div>';
    }
    $.each(rows, function (_, c) {
        var arr = c.hours || [];
        var peak = 0;
        for (var i = 1; i < arr.length; i++) { if ((arr[i].total || 0) > (arr[peak].total || 0)) { peak = i; } }
        html += '<div style="font-size:12px; white-space:nowrap; padding-right:6px; overflow:hidden; text-overflow:ellipsis;">' + (c.counselorName || 'N/A') + '</div>';
        for (var hh = 0; hh < 24; hh++) {
            var t = arr[hh].total || 0, cm = arr[hh].completed || 0, ns = arr[hh].noshow || 0;
            var sh = leadDemoDashboardHeatShade(t, max);
            var isPeak = (hh === peak && t > 0);
            var border = isPeak ? '2px solid #EF9F27' : sh.b;
            var tip = (c.counselorName || '') + ' · ' + leadDemoDashboardHourRange(arr[hh].hour) + ' : ' + t + ' demos · ' + cm + ' completed · ' + ns + ' no-show';
            html += '<div class="ldd-heat-cell ldd-chart-tip" data-tip="' + tip + '" style="height:26px; border-radius:3px; background:' + sh.bg + '; border:' + border + '; display:flex; align-items:center; justify-content:center; font-size:11px; color:' + sh.fg + ';">' + (t > 0 ? t : '') + '</div>';
        }
    });
    html += '</div>';
    $('#lddDemoFilteredHeatmap').html(html);
    leadDemoDashboardBindChartTooltips();
}

function renderLeadDemoDashboardGroupTable(groups, tbodyId) {
    var html = '';
    var totalLeads = 0, totalDemos = 0, totalCompleted = 0, totalNoShow = 0;
    if (!groups || groups.length === 0) {
        html = '<tr><td colspan="7" class="text-center">No records found</td></tr>';
    } else {
        $.each(groups, function (index, group) {
            totalLeads += group.totalLeads || 0;
            totalDemos += group.totalDemos || 0;
            totalCompleted += group.completedDemos || 0;
            totalNoShow += group.noShowDemos || 0;
            html += '<tr>'
                + '<td>' + (index + 1) + '</td>'
                + '<td title="' + (group.name || '') + '">' + (group.name || 'Unknown') + '</td>'
                + '<td class="text-center">' + (group.totalLeads || 0) + '</td>'
                + '<td class="text-center">' + (group.totalDemos || 0) + '</td>'
                + '<td class="text-center" style="color:#0f766e;">' + (group.completedDemos || 0) + '</td>'
                + '<td class="text-center" style="color:#b45309;">' + (group.noShowDemos || 0) + '</td>'
                + '<td><div class="ldd-bar-wrap"><div class="ldd-bar"><div style="width:' + (group.conversionPct || 0) + '%;"></div></div>'
                    + '<span class="text-muted">' + (group.conversionPct || 0) + '%</span></div></td>'
            + '</tr>';
        });
    }
    $('#' + tbodyId).html(html);

    // "lddCampaignTableBody" -> "lddCampaign", "lddCountryTableBody" -> "lddCountry"
    var idPrefix = tbodyId.replace('TableBody', '');
    var totalConvPct = totalLeads > 0 ? Math.round((totalDemos * 100) / totalLeads) : 0;
    $('#' + idPrefix + 'TotalLeads').text(totalLeads);
    $('#' + idPrefix + 'TotalDemos').text(totalDemos);
    $('#' + idPrefix + 'TotalCompleted').text(totalCompleted);
    $('#' + idPrefix + 'TotalNoShow').text(totalNoShow);
    $('#' + idPrefix + 'TotalConvPct').text(totalConvPct + '%');
}

function renderLeadDemoDashboardCounselors(counselors, sectionData) {
    var html = '';
    var totalLeads = 0, totalDemos = 0, totalCompleted = 0, totalNotCompleted = 0, totalNoShow = 0, totalConverted = 0, totalConvertedFY = 0, totalMissed = 0;
    if (!counselors || counselors.length === 0) {
        html = '<tr><td colspan="11" class="text-center">No records found</td></tr>';
    } else {
        $.each(counselors, function (index, counselor) {
            totalLeads += counselor.totalLeads || 0;
            totalDemos += counselor.totalDemos || 0;
            totalCompleted += counselor.completedDemos || 0;
            totalNotCompleted += counselor.notCompletedDemos || 0;
            totalNoShow += counselor.noShowDemos || 0;
            totalConverted += counselor.convertedCount || 0;
            totalConvertedFY += counselor.convertedCountFY || 0;
            totalMissed += counselor.missedConvertibleCount || 0;
            var missedLeads = counselor.missedConvertibleLeads || [];
            var rowId = 'lddMissedDetail' + (counselor.counselorId || index);
            html += '<tr' + (counselor.missedConvertibleFlag ? ' style="background:#fdecea;"' : '') + '>'
                + '<td>' + (index + 1) + '</td>'
                + '<td>' + (counselor.counselorName || 'N/A') + '</td>'
                + '<td class="text-center">' + (counselor.totalLeads || 0) + '</td>'
                + '<td class="text-center">' + (counselor.totalDemos || 0) + '</td>'
                + '<td class="text-center" style="color:#0f766e;">' + (counselor.completedDemos || 0) + '</td>'
                + '<td class="text-center">' + (counselor.notCompletedDemos || 0) + '</td>'
                + '<td class="text-center" style="color:#b45309;">' + (counselor.noShowDemos || 0) + '</td>'
                + '<td class="text-center" style="color:#2e7d32;font-weight:600;">' + (counselor.convertedCount || 0) + '</td>'
                + '<td class="text-center" style="color:#2e7d32;font-weight:600;">' + (counselor.convertedCountFY || 0) + '</td>'
                + '<td class="text-center">' + getLeadDemoDashboardMissedConvertibleCell(counselor, rowId) + '</td>'
                + '<td><div class="ldd-bar-wrap"><div class="ldd-bar"><div style="width:' + (counselor.completionPct || 0) + '%;"></div></div>'
                    + '<span class="text-muted">' + (counselor.completionPct || 0) + '%</span></div></td>'
            + '</tr>';
            if (missedLeads.length) {
                html += '<tr id="' + rowId + '" class="ldd-missed-detail-row" style="display:none;">'
                    + '<td colspan="11">' + getLeadDemoDashboardMissedConvertibleDetail(missedLeads) + '</td>'
                + '</tr>';
            }
        });
    }
    $('#lddCounselorTableBody').html(html);
    var totalConvPct = totalDemos > 0 ? Math.round((totalCompleted * 100) / totalDemos) : 0;
    $('#lddCounselorTotalLeads').text(totalLeads);
    $('#lddCounselorTotalDemos').text(totalDemos);
    $('#lddCounselorTotalCompleted').text(totalCompleted);
    $('#lddCounselorTotalNotCompleted').text(totalNotCompleted);
    $('#lddCounselorTotalNoShow').text(totalNoShow);
    $('#lddCounselorTotalMissed').text(totalMissed);
    $('#lddCounselorTotalConvPct').text(totalConvPct + '%');

    // Total shown is the TRUE grand total (matches real enrollment count) — may be higher than the sum
    // of the visible rows above, since some converted students' referral counselor is no longer active
    // (or has no counselor on file) and so isn't listed individually. The gap is called out via a
    // tooltip rather than silently hidden or attributed to a guessed name.
    var sd = sectionData || {};
    $('#lddCounselorTotalConverted').html(
        (sd.convertedGrandTotal != null ? sd.convertedGrandTotal : totalConverted)
        + getLeadDemoDashboardConvertedGapNote(sd.convertedGap)
    );
    $('#lddCounselorTotalConvertedFY').html(
        (sd.convertedGrandTotalFY != null ? sd.convertedGrandTotalFY : totalConvertedFY)
        + getLeadDemoDashboardConvertedGapNote(sd.convertedGapFY)
    );

    // ── Best Conversion Times by Counselor (fed by the same counselorPerf payload; current session to date) ──
    var convHtml = '';
    var convRows = (counselors || []).filter(function (c) { return (c.bestConversionTimes || []).length; });
    if (!convRows.length) {
        convHtml = '<tr><td colspan="5" class="text-center">No conversion timing data yet</td></tr>';
    } else {
        $.each(convRows, function (i, c) {
            var slots = c.bestConversionTimes || [];
            convHtml += '<tr><td>' + (i + 1) + '</td>'
                + '<td>' + (c.counselorName || 'N/A') + '</td>'
                + getLeadDemoDashboardBestConvCell(slots[0])
                + getLeadDemoDashboardBestConvCell(slots[1])
                + getLeadDemoDashboardBestConvCell(slots[2])
            + '</tr>';
        });
    }
    $('#lddBestConvTimesBody').html(convHtml);

    // Demo Activity sections (fed by the same counselorPerf payload; current session to date)
    renderLeadDemoDashboardDemoActivityOverall(sd.demoActivityOverall || []);
    renderLeadDemoDashboardDemoActivityHeatmap(counselors || []);
    leadDemoDashboardBindChartTooltips();
}

// One "best conversion time" cell — the hour window in bold green + the converted-demo count in muted
// parentheses, or a dash when this counselor has fewer than that many qualifying slots.
function getLeadDemoDashboardBestConvCell(slot) {
    if (!slot) {
        return '<td class="text-center text-muted">&mdash;</td>';
    }
    return '<td class="text-center" style="white-space:nowrap;"><strong style="color:#2e7d32;">' + (slot.label || '')
        + '</strong> <span class="text-muted">(' + (slot.count || 0) + ')</span></td>';
}

// ── Demo Activity by Hour — shared hour-label helpers ──────────────────────
function leadDemoDashboardHour12(h) {
    var ap = h < 12 ? 'AM' : 'PM';
    var hr = h % 12;
    if (hr === 0) { hr = 12; }
    return hr + ' ' + ap;
}
function leadDemoDashboardHourRange(h) {
    return leadDemoDashboardHour12(h) + ' - ' + leadDemoDashboardHour12((h + 1) % 24);
}
function leadDemoDashboardHourShort(h) {
    var ap = h < 12 ? 'a' : 'p';
    var hr = h % 12;
    if (hr === 0) { hr = 12; }
    return hr + ap;
}
// " (19%)" conversion rate suffix for tooltips — blank when there are no demos to divide by.
function leadDemoDashboardConvPct(attended, converted) {
    if (!attended || attended <= 0) { return ''; }
    return ' (' + Math.round((converted * 100) / attended) + '%)';
}
function leadDemoDashboardStatCard(label, value, sub) {
    return '<div style="background:#f6f7f9; border-radius:8px; padding:8px 14px; min-width:140px;">'
        + '<div class="text-muted" style="font-size:12px;">' + label + '</div>'
        + '<div style="font-size:20px; font-weight:600;">' + value + '</div>'
        + '<div class="text-muted" style="font-size:11px;">' + sub + '</div>'
    + '</div>';
}

// Section 1 — overall 24-hour demo distribution as a stacked CSS bar chart (converted at the bottom,
// remaining attended on top), with the busiest hour highlighted in amber and summary stat cards above.
function renderLeadDemoDashboardDemoActivityOverall(hours) {
    hours = hours || [];
    var hasData = false;
    for (var k = 0; k < hours.length; k++) { if ((hours[k].attended || 0) > 0) { hasData = true; break; } }
    if (!hasData) {
        $('#lddDemoHourSummary').html('');
        $('#lddDemoHourOverall').html('<div class="text-muted" style="font-size:12px;">No demo activity this session.</div>');
        return;
    }
    var maxA = 1, totalA = 0, peakIdx = 0, bestConvIdx = 0;
    $.each(hours, function (i, h) {
        var a = h.attended || 0, c = h.converted || 0;
        if (a > maxA) { maxA = a; }
        if (a > (hours[peakIdx].attended || 0)) { peakIdx = i; }
        if (c > (hours[bestConvIdx].converted || 0)) { bestConvIdx = i; }
        totalA += a;
    });
    var chartH = 150;
    var bars = '';
    $.each(hours, function (i, h) {
        var a = h.attended || 0, c = h.converted || 0;
        var barH = Math.round((a / maxA) * chartH);
        var convH = a > 0 ? Math.round((c / a) * barH) : 0;
        var restH = barH - convH;
        var isPeak = (i === peakIdx && a > 0);
        bars += '<div class="ldd-hourbar ldd-chart-tip" data-tip="' + leadDemoDashboardHourRange(h.hour) + ' : ' + a + ' demos, ' + c + ' converted' + leadDemoDashboardConvPct(a, c) + '" style="flex:1; min-width:16px; display:flex; flex-direction:column; align-items:center; justify-content:flex-end;">'
            + '<div class="ldd-hourbar-fill" style="width:70%; height:' + chartH + 'px; display:flex; flex-direction:column; justify-content:flex-end;">'
                + '<div style="height:' + restH + 'px; background:' + (isPeak ? '#FAC775' : '#9FE1CB') + '; border-radius:3px 3px 0 0;"></div>'
                + '<div style="height:' + convH + 'px; background:' + (isPeak ? '#EF9F27' : '#199e70') + ';"></div>'
            + '</div>'
            + '<div class="text-muted" style="font-size:9px; margin-top:3px; height:11px;">' + (h.hour % 3 === 0 ? leadDemoDashboardHourShort(h.hour) : '') + '</div>'
        + '</div>';
    });
    $('#lddDemoHourOverall').html('<div style="display:flex; align-items:flex-end; gap:2px; min-width:600px;">' + bars + '</div>');
    $('#lddDemoHourSummary').html(
        leadDemoDashboardStatCard('Busiest hour', leadDemoDashboardHourRange(hours[peakIdx].hour), (hours[peakIdx].attended || 0) + ' demos')
        + leadDemoDashboardStatCard('Total demos', totalA, 'attended, this session')
        + leadDemoDashboardStatCard('Best-converting hour', leadDemoDashboardHourRange(hours[bestConvIdx].hour), (hours[bestConvIdx].converted || 0) + ' converted')
    );
}

// Section 2 — counselor × hour heatmap. Each cell's shade encodes attended demos in that hour; the
// number shown is attended, the hover tooltip adds conversions, and each row's busiest hour gets a ring.
function leadDemoDashboardHeatShade(v, max) {
    if (v <= 0) { return { bg: '#f4f4f2', fg: '#adadad', b: '0.5px solid #e6e6e6' }; }
    var r = v / max, bg, fg = '#04342C';
    if (r <= 0.2) { bg = '#E1F5EE'; }
    else if (r <= 0.4) { bg = '#9FE1CB'; }
    else if (r <= 0.6) { bg = '#5DCAA5'; }
    else if (r <= 0.8) { bg = '#1D9E75'; fg = '#ffffff'; }
    else { bg = '#0F6E56'; fg = '#ffffff'; }
    return { bg: bg, fg: fg, b: '0.5px solid rgba(0,0,0,0.04)' };
}
function renderLeadDemoDashboardDemoActivityHeatmap(counselors) {
    var rows = (counselors || []).filter(function (c) { return (c.demoActivityByHour || []).length; });
    var max = 0;
    $.each(rows, function (_, c) { $.each(c.demoActivityByHour, function (_, h) { if ((h.attended || 0) > max) { max = h.attended || 0; } }); });
    if (max <= 0) {
        $('#lddDemoHourHeatmap').html('<div class="text-muted" style="font-size:12px;">No demo activity this session.</div>');
        return;
    }
    var html = '<div style="display:grid; grid-template-columns:120px repeat(24, minmax(0,1fr)); gap:3px; align-items:center;">';
    html += '<div></div>';
    for (var h = 0; h < 24; h++) {
        html += '<div class="text-muted" style="font-size:10px; text-align:center;">' + (h % 3 === 0 ? leadDemoDashboardHourShort(h) : '') + '</div>';
    }
    $.each(rows, function (_, c) {
        var arr = c.demoActivityByHour;
        var peak = 0;
        for (var i = 1; i < arr.length; i++) { if ((arr[i].attended || 0) > (arr[peak].attended || 0)) { peak = i; } }
        html += '<div style="font-size:12px; white-space:nowrap; padding-right:6px; overflow:hidden; text-overflow:ellipsis;">' + (c.counselorName || 'N/A') + '</div>';
        for (var hh = 0; hh < 24; hh++) {
            var a = arr[hh].attended || 0, cv = arr[hh].converted || 0;
            var sh = leadDemoDashboardHeatShade(a, max);
            var isPeak = (hh === peak && a > 0);
            var border = isPeak ? '2px solid #EF9F27' : sh.b;
            html += '<div class="ldd-heat-cell ldd-chart-tip" data-tip="' + (c.counselorName || '') + ' · ' + leadDemoDashboardHourRange(arr[hh].hour) + ' : ' + a + ' demos, ' + cv + ' converted' + leadDemoDashboardConvPct(a, cv) + '" style="height:26px; border-radius:3px; background:' + sh.bg + '; border:' + border + '; display:flex; align-items:center; justify-content:center; font-size:11px; color:' + sh.fg + ';">' + (a > 0 ? a : '') + '</div>';
        }
    });
    html += '</div>';
    $('#lddDemoHourHeatmap').html(html);
}

// Custom cursor-following tooltip + hover highlight for the demo-activity chart and heatmap. Bound once
// via event delegation on document, so it keeps working after each re-render replaces the cells/bars.
var LEAD_DEMO_DASHBOARD_CHART_TIP_BOUND = false;
function leadDemoDashboardBindChartTooltips() {
    if (LEAD_DEMO_DASHBOARD_CHART_TIP_BOUND) { return; }
    LEAD_DEMO_DASHBOARD_CHART_TIP_BOUND = true;
    $(document).on('mouseenter', '.ldd-chart-tip', function () {
        var t = $(this).attr('data-tip');
        if (!t) { return; }
        $('#lddChartTooltip').text(t).show();
    }).on('mousemove', '.ldd-chart-tip', function (e) {
        var $tip = $('#lddChartTooltip');
        var tw = $tip.outerWidth() || 0;
        var x = e.clientX + 14, y = e.clientY + 14;
        if (x + tw > window.innerWidth - 8) { x = e.clientX - tw - 14; }
        $tip.css({ left: x + 'px', top: y + 'px' });
    }).on('mouseleave', '.ldd-chart-tip', function () {
        $('#lddChartTooltip').hide();
    });
}

// Native `title` tooltips don't respond to clicks/taps, so this reuses the same click-to-toggle
// popover pattern as the "Why?" AI-reason link elsewhere on this dashboard.
function getLeadDemoDashboardConvertedGapNote(gapCount) {
    if (!gapCount || gapCount <= 0) {
        return '';
    }
    return ' <a href="javascript:void(0);" style="font-size:11px;" onclick="toggleLeadDemoDashboardReasonPopover(this)"><i class="fa fa-info-circle text-muted"></i></a>'
        + '<div class="ldd-reason-popover" style="display:none;">Includes ' + gapCount
        + ' student(s) converted by counselors who are no longer active or have no counselor on file — not shown individually above.</div>';
}

// "Missed Convertible" cell — count (N) + % of that counselor's own genuinely-convertible leads, with
// a red ⚠️ flag when it crosses the threshold (>=25% missed, on at least 3 convertible leads — see
// computeMissedConvertibleByCounselor in ReportUtil.java for the exact scoring rules). Clicking the
// count expands a drill-down row listing the specific leads and which rule(s) they breached.
function getLeadDemoDashboardMissedConvertibleCell(counselor, rowId) {
    var missedCount = counselor.missedConvertibleCount || 0;
    var missedPct = counselor.missedConvertiblePct || 0;
    if (!missedCount) {
        return '<span class="text-muted">0</span>';
    }
    var flag = counselor.missedConvertibleFlag ? ' <span title="Missed % is at or above the 25% threshold">⚠️</span>' : '';
    return '<a href="javascript:void(0);" style="font-weight:600; color:' + (counselor.missedConvertibleFlag ? '#c62828' : '#333') + ';" '
        + 'onclick="$(\'#' + rowId + '\').toggle();">' + missedCount + ' (' + missedPct + '%)</a>' + flag;
}

var LEAD_DEMO_DASHBOARD_MISSED_RULE_COLORS = { severe: '#c62828', moderate: '#b45309' };

function getLeadDemoDashboardMissedConvertibleDetail(missedLeads) {
    var rows = missedLeads.map(function (lead) {
        var rulesHtml = (lead.rulesBreached || []).map(function (rule) {
            var color = LEAD_DEMO_DASHBOARD_MISSED_RULE_COLORS[rule.severity] || '#555';
            return '<span title="' + rule.tooltip.replace(/"/g, '&quot;') + '" style="display:inline-block; margin:1px 4px 1px 0; padding:1px 6px; border-radius:3px; font-size:10px; background:' + color + '1a; color:' + color + ';">'
                + (rule.severity === 'severe' ? '🔴 ' : '🟠 ') + rule.label + '</span>';
        }).join('');
        var reasonsText = (lead.convertibilityReasons || []).join(', ') || '—';
        return '<tr>'
            + '<td>' + getLeadDemoDashboardLeadNoLink(lead.leadNo) + ' <span class="text-muted">' + (lead.leadName || '') + '</span></td>'
            + '<td>' + lead.convertibilityScore + ' <span class="text-muted" style="font-size:11px;">(' + reasonsText + ')</span></td>'
            + '<td>' + rulesHtml + '</td>'
        + '</tr>';
    }).join('');
    return '<div style="padding:8px 4px;">'
        + '<div class="text-muted" style="font-size:11px; text-transform:uppercase; letter-spacing:.03em; margin-bottom:6px;">Missed Convertible Leads</div>'
        + '<table class="table table-sm table-borderless" style="font-size:12px; margin-bottom:0;">'
            + '<thead><tr class="text-muted"><th>Lead</th><th>Convertibility</th><th style="position:relative;">Rules Breached '
                + '<a href="javascript:void(0);" style="font-size:11px;" onclick="toggleLeadDemoDashboardReasonPopover(this)"><i class="fa fa-info-circle text-muted"></i></a>'
                + '<div class="ldd-reason-popover" style="display:none; font-weight:400; text-transform:none; text-align:left; max-width:260px;">'
                    + '<b>Slow First Response</b> &mdash; more than 2h from lead creation to first contact.<br>'
                    + '<b>Insufficient Persistence</b> &mdash; fewer than 3 follow-ups since assigned to this counselor.<br>'
                    + '<b>Follow-up Gap Breach</b> &mdash; 7+ days since last contact (from whichever is later of last contact or assignment date).<br>'
                    + '<b>Post-Demo Silence</b> &mdash; demo attended while this counselor already owned the lead, with zero follow-up after.'
                + '</div>'
            + '</th></tr></thead>'
            + '<tbody>' + rows + '</tbody>'
        + '</table>'
    + '</div>';
}

// "Lead Response Health" — three plain, directly-actionable facts (see
// getLeadDashboardResponseHealthData in ReportUtil.java): at-risk leads right now, the response-time
// distribution (pure counts, no inferred "loss"), and the oldest still-pending leads to work next.
function renderLeadDemoDashboardResponseHealth(data) {
    var totalLeads = (data.fastCount || 0) + (data.mediumCount || 0) + (data.slowCount || 0) + (data.neverCount || 0);
    if (totalLeads === 0) {
        $('#lddResponseHealthBody').html('<p class="text-muted text-center py-3">No leads in this period.</p>');
        return;
    }

    // (A) At risk right now
    var atRiskHtml = '<div class="col-md-4 col-12 mb-3 text-center">'
        + '<div style="font-size:28px; font-weight:700; color:' + ((data.atRiskCount || 0) > 0 ? '#c62828' : '#2e7d32') + ';">' + (data.atRiskCount || 0) + '</div>'
        + '<div class="text-muted" style="font-size:12px;">not contacted for ' + (data.atRiskThresholdHours || 2) + '+ hours (at risk)</div>'
        + (data.atRiskCount > 0 ? '<div class="text-muted" style="font-size:11px; margin-top:2px;">oldest waiting: ' + (data.oldestWait || '—') + '</div>' : '')
        + (data.atRiskByCountry && data.atRiskByCountry.length
            ? '<div class="mt-2" style="font-size:11px;">' + data.atRiskByCountry.map(function (c) {
                return '<span class="ldd-badge ldd-b-red" style="margin:2px;">' + (c.country || 'Unknown') + ': ' + c.count + '</span>';
            }).join('') + '</div>'
            : '')
    + '</div>';

    // (B) Response-time distribution — plain counts, no comparison/inference
    function pct(n) { return totalLeads > 0 ? Math.round((n * 100) / totalLeads) : 0; }
    var distributionHtml = '<div class="col-md-8 col-12 mb-3">'
        + '<div class="text-muted" style="font-size:11px; text-transform:uppercase; letter-spacing:.03em; margin-bottom:6px;">Response Time Distribution</div>'
        + getLeadDemoDashboardResponseHealthBar('Fast (&le;10 min)', data.fastCount || 0, pct(data.fastCount || 0), '#2e7d32')
        + getLeadDemoDashboardResponseHealthBar('Medium (10 min &ndash; 1 hr)', data.mediumCount || 0, pct(data.mediumCount || 0), '#0277bd')
        + getLeadDemoDashboardResponseHealthBar('Slow (&gt; 1 hr)', data.slowCount || 0, pct(data.slowCount || 0), '#b45309')
        + getLeadDemoDashboardResponseHealthBar('Never contacted', data.neverCount || 0, pct(data.neverCount || 0), '#c62828')
    + '</div>';

    // (C) Aging leads — ready-to-work list, paged so all not-yet-contacted leads are reachable
    var agingTotalCount = data.agingTotalCount || 0;
    var agingPageSize = data.agingPageSize || 10;
    var agingHtml = '';
    if (data.agingLeads && data.agingLeads.length) {
        agingHtml = '<div class="col-12">'
            + '<div class="text-muted" style="font-size:11px; text-transform:uppercase; letter-spacing:.03em; margin-bottom:6px;">Oldest Pending Leads (not yet contacted) '
                + '<span style="text-transform:none; font-weight:400;">&mdash; ' + agingTotalCount + ' not-yet-contacted lead(s) total</span></div>'
            + '<div class="table-responsive"><table class="table table-sm table-bordered" style="font-size:12px;">'
                + '<thead><tr class="bg-primary text-white"><th>S.No.</th><th>Lead</th><th>Campaign | Country</th><th>Academic Expert</th><th>Type</th><th>Waiting</th></tr></thead>'
                + '<tbody>'
                + data.agingLeads.map(function (l, i) {
                    return '<tr>'
                        + '<td>' + ((LEAD_DEMO_DASHBOARD_STATE.agingPage * agingPageSize) + i + 1) + '</td>'
                        + '<td>' + (l.leadName || 'N/A') + '<div>' + getLeadDemoDashboardLeadNoLink(l.leadNo) + '</div></td>'
                        + '<td>' + (l.campaign || 'N/A') + '<div class="text-muted">' + (l.country || 'N/A') + '</div></td>'
                        + '<td>' + (l.counselorName || '—') + '</td>'
                        + '<td>' + (l.hasDemo ? '<span class="ldd-badge ldd-b-green">Demo</span>' : '<span class="ldd-badge ldd-b-gray">No Demo</span>') + '</td>'
                        + '<td class="ldd-resp-slow">' + (l.waitTime || '—') + '</td>'
                    + '</tr>';
                }).join('')
                + '</tbody>'
            + '</table></div>'
            + '<div class="d-flex justify-content-end align-items-center flex-wrap ldd-pagination-bar" style="gap:6px; margin-top:6px;">'
                + getLeadDemoDashboardPaginationHtml(LEAD_DEMO_DASHBOARD_STATE.agingPage, agingPageSize, agingTotalCount, 'goToLeadDemoDashboardAgingPage')
            + '</div>'
        + '</div>';
    }

    $('#lddResponseHealthBody').html('<div class="row">' + atRiskHtml + distributionHtml + agingHtml + '</div>');
}

function getLeadDemoDashboardResponseHealthBar(label, count, pctValue, color) {
    return '<div class="d-flex align-items-center mb-1" style="gap:8px;">'
        + '<div style="width:150px;font-size:11px;color:#555;flex-shrink:0;">' + label + '</div>'
        + '<div class="ldd-bar-wrap" style="flex:1;"><div class="ldd-bar"><div style="width:' + pctValue + '%;background:' + color + ';"></div></div></div>'
        + '<div style="width:70px;font-size:11px;color:#555;text-align:right;flex-shrink:0;">' + count + ' (' + pctValue + '%)</div>'
    + '</div>';
}

// ── Charts (ApexCharts — loaded globally in dashboard shell) ──────────────

function destroyLeadDemoDashboardChart(key) {
    if (LEAD_DEMO_DASHBOARD_CHARTS[key]) {
        try { LEAD_DEMO_DASHBOARD_CHARTS[key].destroy(); } catch (e) { /* already gone */ }
        LEAD_DEMO_DASHBOARD_CHARTS[key] = null;
    }
}

function renderLeadDemoDashboardCharts(charts) {
    if (typeof ApexCharts === 'undefined') {
        return;
    }
    // This fetch can resolve after the user has already navigated away (SPA route change tore down
    // #dashboardContentInHTML) or after auto-refresh keeps firing on a torn-down page — mounting into a
    // container that's no longer in the DOM is what throws ApexCharts' "Element not found".
    if ($('#lddTrendChart').length === 0) {
        return;
    }
    var hourly = !!charts.hourlyView;

    var leadTrend = charts.leadTrend || [];
    var demoTrend = charts.demoTrend || [];
    var bucketSet = {};
    $.each(leadTrend, function (_, point) { bucketSet[point.bucket] = true; });
    $.each(demoTrend, function (_, point) { bucketSet[point.bucket] = true; });
    var buckets = Object.keys(bucketSet).sort();
    function seriesFor(trend) {
        var map = {};
        $.each(trend, function (_, point) { map[point.bucket] = point.count; });
        return buckets.map(function (bucket) { return map[bucket] || 0; });
    }
    var bucketLabels = buckets.map(function (bucket) { return hourly ? bucket + ':00' : bucket; });

    destroyLeadDemoDashboardChart('trend');
    LEAD_DEMO_DASHBOARD_CHARTS.trend = new ApexCharts(document.querySelector('#lddTrendChart'), {
        chart: { type: 'area', height: 220, toolbar: { show: false } },
        series: [
            { name: 'Leads', data: seriesFor(leadTrend) },
            { name: 'Demos', data: seriesFor(demoTrend) }
        ],
        xaxis: { categories: bucketLabels, labels: { style: { fontSize: '10px' } } },
        yaxis: { labels: { formatter: function (v) { return Math.round(v); } } },
        colors: ['#4f46e5', '#0f766e'],
        stroke: { curve: 'smooth', width: 2 },
        fill: { type: 'gradient', gradient: { opacityFrom: 0.25, opacityTo: 0.02 } },
        dataLabels: { enabled: false },
        legend: { position: 'bottom' }
    });
    LEAD_DEMO_DASHBOARD_CHARTS.trend.render();
}

// ── AI Insights (Phase 2) ──────────────────────────────────────────────────

function resetLeadDemoDashboardAiInsights() {
    $('#lddAiInsightsSubtitle').text('');
    $('#lddAiInsightsBtn').show().prop('disabled', false).text('Analyze with AI');
    $('#lddAiInsightsBody').html('<p class="text-muted text-center py-3" id="lddAiInsightsIdle">Click "Analyze with AI" to find out why leads aren\'t converting.</p>');
    LEAD_DEMO_DASHBOARD_LEAD_REASONS = {};
    LEAD_DEMO_DASHBOARD_LEAD_PRIORITY = {};
    LEAD_DEMO_DASHBOARD_AI_ANALYZED = false;
    LEAD_DEMO_DASHBOARD_AI_LOADING = false;
    LEAD_DEMO_DASHBOARD_AI_LAST_FETCH_TIME = 0;
}

function fetchLeadDemoDashboardAiInsights() {
    $('#lddAiInsightsBtn').prop('disabled', true).text('Analyzing...');
    $('#lddAiInsightsBody').html('<p class="text-muted text-center py-3"><i class="fa fa-spinner fa-spin"></i> Analyzing leads for this period...</p>');
    LEAD_DEMO_DASHBOARD_AI_LOADING = true;
    fetchLeadDemoDashboardSection('leadList', true);
    fetchLeadDemoDashboardSection('demoList', true);

    var range = getLeadDemoDashboardDateRange();
    var params = {
        startDate: range.startDate,
        endDate: range.endDate,
        schoolId: SCHOOL_ID,
        userId: USER_ID,
        campaign: LEAD_DEMO_DASHBOARD_STATE.campaign,
        country: LEAD_DEMO_DASHBOARD_STATE.country,
        leadContacted: LEAD_DEMO_DASHBOARD_STATE.contacted,
        leadSearchText: LEAD_DEMO_DASHBOARD_STATE.searchText,
        leadPage: LEAD_DEMO_DASHBOARD_STATE.leadShowAll ? 0 : LEAD_DEMO_DASHBOARD_STATE.leadPage,
        leadShowAll: !!LEAD_DEMO_DASHBOARD_STATE.leadShowAll,
        demoStatus: LEAD_DEMO_DASHBOARD_STATE.demoStatus,
        demoPage: LEAD_DEMO_DASHBOARD_STATE.demoShowAll ? 0 : LEAD_DEMO_DASHBOARD_STATE.demoPage,
        demoShowAll: !!LEAD_DEMO_DASHBOARD_STATE.demoShowAll
    };

    $.ajax({
        type: 'POST',
        contentType: APPLICATION_JSON_VALUE,
        url: getURLForHTML('dashboard', 'reports/lead-demo-dashboard-ai-insights'),
        data: JSON.stringify(params),
        dataType: 'json',
        cache: false,
        global: false, // has its own button/card loading state — shouldn't hold up the page-wide loader
        timeout: 60000,
        success: function (data) {
            $('#lddAiInsightsBtn').prop('disabled', false).text('Analyze with AI');
            LEAD_DEMO_DASHBOARD_AI_LOADING = false;
            if (!data || data.status === '0' || data.status === '2' || data.status === '3') {
                if (data && data.status === '3') {
                    redirectLoginPage();
                    return;
                }
                renderLeadDemoDashboardAiInsightsError((data && data.message) || 'Unable to generate insights.');
                return;
            }
            renderLeadDemoDashboardAiInsightsResult(data.data || {}, !!data.cached);
        },
        error: function () {
            $('#lddAiInsightsBtn').prop('disabled', false).text('Analyze with AI');
            LEAD_DEMO_DASHBOARD_AI_LOADING = false;
            renderLeadDemoDashboardAiInsightsError('Unable to generate insights right now.');
        }
    });
}

// Silent, background version of the AI Insights call — only fills the Lead List / Demo List
// AI Priority | Score | Risk | Follow-up Due columns. Does NOT touch the "AI Insights — Why Leads
// Aren't Converting" card or its "Analyze with AI" button, which stay manual-only. Hits the same
// cached endpoint, so a later manual click on that button costs nothing extra (cache hit).
//
// fromAutoRefreshTimer=true (the 1-min background tick) is throttled to at most once per
// LEAD_DEMO_DASHBOARD_AI_PRIORITY_MIN_INTERVAL_MS (20 min, matching the backend cache TTL) so a
// fast refresh interval can never burn extra Anthropic tokens. Direct user actions (pagination,
// filter changes) always fire immediately, since they're a deliberate view change, not just a tick.
// scope: 'lead' | 'demo' | 'both' (default). 'lead'/'demo' only (re)analyze that list's own leads and
// cache under their own key — so changing Lead List's filter/Show All never forces a wasted
// re-analysis of Demo List's untouched leads, and vice versa. 'both' is the full combined pass (used
// on initial page load, date-range/search/reset, the auto-refresh timer, and toggling AI Priority on).
function fetchLeadDemoDashboardLeadPriorityAuto(fromAutoRefreshTimer, scope) {
    if (!LEAD_DEMO_DASHBOARD_AI_PRIORITY_ENABLED) {
        return;
    }
    if (LEAD_DEMO_DASHBOARD_AI_LOADING) {
        return;
    }
    if (fromAutoRefreshTimer && LEAD_DEMO_DASHBOARD_AI_LAST_FETCH_TIME
            && (LEAD_DEMO_DASHBOARD_AI_LAST_FETCH_TIME + LEAD_DEMO_DASHBOARD_AI_PRIORITY_MIN_INTERVAL_MS) > Date.now()) {
        return;
    }
    LEAD_DEMO_DASHBOARD_AI_LAST_FETCH_TIME = Date.now();
    // Caller (page load / filter / pagination handler) already fetches leadList/demoList itself —
    // no need to re-fetch them here just to flip the columns to "Analyzing...".
    LEAD_DEMO_DASHBOARD_AI_LOADING = true;

    var range = getLeadDemoDashboardDateRange();
    var params = {
        startDate: range.startDate,
        endDate: range.endDate,
        schoolId: SCHOOL_ID,
        userId: USER_ID,
        campaign: LEAD_DEMO_DASHBOARD_STATE.campaign,
        country: LEAD_DEMO_DASHBOARD_STATE.country,
        leadContacted: LEAD_DEMO_DASHBOARD_STATE.contacted,
        leadSearchText: LEAD_DEMO_DASHBOARD_STATE.searchText,
        leadPage: LEAD_DEMO_DASHBOARD_STATE.leadShowAll ? 0 : LEAD_DEMO_DASHBOARD_STATE.leadPage,
        leadShowAll: !!LEAD_DEMO_DASHBOARD_STATE.leadShowAll,
        demoStatus: LEAD_DEMO_DASHBOARD_STATE.demoStatus,
        demoPage: LEAD_DEMO_DASHBOARD_STATE.demoShowAll ? 0 : LEAD_DEMO_DASHBOARD_STATE.demoPage,
        demoShowAll: !!LEAD_DEMO_DASHBOARD_STATE.demoShowAll,
        // 'columns' = light both-lists pass for the AI columns only (skips the heavy aggregate
        // "why leads aren't converting" reasons call) so the columns fill in fast in the background.
        // The manual "Analyze with AI" button still sends no scope -> 'both' (reasons + priority).
        priorityScope: scope || 'columns'
    };

    $.ajax({
        type: 'POST',
        contentType: APPLICATION_JSON_VALUE,
        url: getURLForHTML('dashboard', 'reports/lead-demo-dashboard-ai-insights'),
        data: JSON.stringify(params),
        dataType: 'json',
        cache: false,
        global: false, // background call — must never hold up the page-wide loader (this was the pagination hang)
        timeout: 60000,
        success: function (data) {
            LEAD_DEMO_DASHBOARD_AI_LOADING = false;
            LEAD_DEMO_DASHBOARD_AI_ANALYZED = true;
            if (data && data.status !== '0' && data.status !== '2' && data.status !== '3' && data.data) {
                // Merge into the existing map — do NOT reset it, since a scoped ('lead' or 'demo') fetch
                // only returns that side's leads and must leave the other side's already-known results intact.
                $.each(data.data.leadPriority || [], function (_, item) {
                    if (item && item.leadId) {
                        LEAD_DEMO_DASHBOARD_LEAD_PRIORITY[item.leadId] = item;
                    }
                });
            }
            fetchLeadDemoDashboardSection('leadList', true);
            fetchLeadDemoDashboardSection('demoList', true);
        },
        error: function () {
            LEAD_DEMO_DASHBOARD_AI_LOADING = false;
            LEAD_DEMO_DASHBOARD_AI_ANALYZED = true;
            fetchLeadDemoDashboardSection('leadList', true);
            fetchLeadDemoDashboardSection('demoList', true);
        }
    });
}

function renderLeadDemoDashboardAiInsightsError(message) {
    $('#lddAiInsightsBody').html('<p class="text-center py-3" style="color:#c62828;">' + message + ' <a href="javascript:void(0);" onclick="fetchLeadDemoDashboardAiInsights()">Try again</a></p>');
    // Stop showing "Analyzing..." on the Priority/Score/Risk columns since this attempt failed
    LEAD_DEMO_DASHBOARD_AI_ANALYZED = true;
    fetchLeadDemoDashboardSection('leadList', true);
}

function getLeadDemoDashboardSeverityBadge(severity) {
    var map = {
        CRITICAL: { cls: 'ldd-severity-critical', label: 'Critical' },
        MODERATE: { cls: 'ldd-severity-moderate', label: 'Moderate' },
        MINOR: { cls: 'ldd-severity-minor', label: 'Minor' }
    };
    var item = map[(severity || '').toUpperCase()] || { cls: 'ldd-severity-minor', label: severity || 'Info' };
    return '<span class="ldd-severity-badge ' + item.cls + '">' + item.label + '</span>';
}

function renderLeadDemoDashboardAiInsightsResult(result, cached) {
    var totalLeads = result.totalLeads || 0;

    LEAD_DEMO_DASHBOARD_LEAD_REASONS = {};
    $.each(result.leadReasons || [], function (_, item) {
        if (item && item.leadId) {
            LEAD_DEMO_DASHBOARD_LEAD_REASONS[item.leadId] = item.reason;
        }
    });
    LEAD_DEMO_DASHBOARD_LEAD_PRIORITY = {};
    $.each(result.leadPriority || [], function (_, item) {
        if (item && item.leadId) {
            LEAD_DEMO_DASHBOARD_LEAD_PRIORITY[item.leadId] = item;
        }
    });
    LEAD_DEMO_DASHBOARD_AI_ANALYZED = true;
    // Redraw the currently visible Lead List / Demo List pages so "Why?" links and the AI
    // Priority/Score/Risk/Follow-up columns pick up the new data (silent — no page loader)
    fetchLeadDemoDashboardSection('leadList', true);
    fetchLeadDemoDashboardSection('demoList', true);

    if (result.noData) {
        $('#lddAiInsightsSubtitle').text('');
        $('#lddAiInsightsBody').html('<p class="text-center py-3" style="color:#2e7d32;">No non-converted leads to analyze in this period.</p>');
        return;
    }

    var reasons = result.reasons || [];
    $('#lddAiInsightsSubtitle').text('Based on ' + totalLeads + ' leads in this period' + (cached ? ' · cached result' : ''));

    if (!reasons.length) {
        $('#lddAiInsightsBody').html('<p class="text-muted text-center py-3">No clear patterns found for this period.</p>');
        return;
    }

    var html = '<div class="row">';
    $.each(reasons, function (_, reason) {
        var cardCls = reason.severity === 'CRITICAL' ? 'ldd-reason-critical' : (reason.severity === 'MODERATE' ? 'ldd-reason-moderate' : '');
        html += '<div class="col-md-4 col-12 mb-2">'
            + '<div class="ldd-reason-card ' + cardCls + '">'
                + getLeadDemoDashboardSeverityBadge(reason.severity)
                + '<div style="font-size:14px; font-weight:600; margin-bottom:4px;">' + (reason.title || '') + '</div>'
                + '<div class="text-muted" style="font-size:12px; margin-bottom:10px;">' + (reason.detail || '') + '</div>'
                + '<div class="text-muted" style="font-size:11px; text-transform:uppercase; letter-spacing:.03em; margin-bottom:2px;">Recommendation</div>'
                + '<div style="font-size:12px;">' + (reason.recommendation || '') + '</div>'
            + '</div>'
        + '</div>';
    });
    html += '</div>';
    $('#lddAiInsightsBody').html(html);
}

// ── AI Draft (single-lead modal) — reuses the existing AI Email Draft backend
// (get-lead-timeline-summary / save-ai-email-draft / send-ai-draft-email), scoped to one leadId ──
var LEAD_DEMO_DASHBOARD_AI_DRAFT_LEAD_ID = null;
var LEAD_DEMO_DASHBOARD_AI_DRAFT_LEAD_NAME = '';
var LEAD_DEMO_DASHBOARD_AI_DRAFT_CACHE = {};
// leadId -> {leadName, leadNo, country} — filled in as Lead List / Demo List rows render, so the
// modal can show a known-data preview (name/no/country/priority/score/risk/follow-up) immediately
// on open, exactly like the AI Email Draft page does from its own bulk-table row data.
var LEAD_DEMO_DASHBOARD_LEAD_INFO = {};

function openLeadDemoDashboardAiDraft(leadId) {
    LEAD_DEMO_DASHBOARD_AI_DRAFT_LEAD_ID = leadId;
    LEAD_DEMO_DASHBOARD_AI_DRAFT_LEAD_NAME = '';
    $('#lddAiDraftModal').modal('show');

    // Reopening the same lead — show the cached draft instantly, same as the AI Email Draft page does
    var cached = LEAD_DEMO_DASHBOARD_AI_DRAFT_CACHE[leadId];
    if (cached) {
        $('#lddAiDraftLoading').hide();
        renderLeadDemoDashboardAiDraft(cached);
        return;
    }

    // Show whatever we already know about this lead (name/no/country from the row, priority/score/
    // risk/follow-up from the AI Priority column if it's been analyzed) right away — only the actual
    // draft body/signals need to wait on the AI call, same behavior as AI Email Draft.
    renderLeadDemoDashboardAiDraftPreview(leadId);
    $('#lddAiDraftContent').hide();
    $('#lddAiDraftLoading').show().html('<i class="fa fa-spinner fa-spin"></i> Generating draft…');
    fetchLeadDemoDashboardAiDraft(leadId);
}

function renderLeadDemoDashboardAiDraftPreview(leadId) {
    var info = LEAD_DEMO_DASHBOARD_LEAD_INFO[leadId] || {};
    var priorityInfo = LEAD_DEMO_DASHBOARD_LEAD_PRIORITY[leadId] || {};
    $('#lddAiDraftGenInfo').html(
        '<i class="fa fa-user mr-1 text-primary"></i><strong>' + (info.leadName || info.leadNo || 'N/A') + '</strong>'
        + ' &nbsp;|&nbsp; ' + (info.leadNo || '') + (info.country ? ' · ' + info.country : '')
        + ' &nbsp;|&nbsp; Priority: ' + getLeadDemoDashboardPriorityBadge(priorityInfo.aiPriority) + ' (Score: <strong>' + (priorityInfo.priorityScore || priorityInfo.priorityScore === 0 ? priorityInfo.priorityScore : '—') + '</strong>)'
        + ' &nbsp;|&nbsp; Risk: ' + getLeadDemoDashboardRiskBadge(priorityInfo.riskLevel)
        + ' &nbsp;|&nbsp; Follow-up: <strong>' + (priorityInfo.followUpDueDate ? getLeadDemoDashboardFormattedDateTime(priorityInfo.followUpDueDate) : '—') + '</strong>'
    );
    $('#lddAiDraftTo, #lddAiDraftFrom, #lddAiDraftSubject').val('');
    $('#lddAiDraftBody, #lddAiDraftWhatsapp, #lddAiDraftCallPitch').val('');
    $('#lddSignalUrgency, #lddSignalIntent, #lddSignalObjection, #lddSignalNextAction, #lddSignalCrmAlert, #lddSignalReason').text('Generating…');
    $('.ldd-signal-header').each(function () { $($(this).data('target')).hide(); $(this).find('.ldd-chevron').css('transform', ''); });
    $('#lddAiDraftTabs a[href="#lddTabEmail"]').tab('show');
}

function fetchLeadDemoDashboardAiDraft(leadId) {
    // Dedicated dashboard endpoint — works for ANY lead regardless of demo/date status, unlike the
    // AI Email Draft page's own get-lead-timeline-summary (which requires demo activity in range).
    var params = {
        schoolId: SCHOOL_ID,
        userId: USER_ID,
        leadId: leadId
    };
    $.ajax({
        type: 'POST',
        contentType: APPLICATION_JSON_VALUE,
        url: getURLForHTML('/api/v1/leads', 'get-lead-ai-draft-dashboard'),
        data: JSON.stringify(params),
        dataType: 'json',
        cache: false,
        global: false,
        timeout: 60000,
        success: function (data) {
            var rows = Array.isArray(data) ? data : (data && data.data ? data.data : []);
            var d = rows && rows.length ? rows[0] : null;
            if (!d) {
                renderLeadDemoDashboardAiDraftError('Unable to generate a draft for this lead.');
                return;
            }
            LEAD_DEMO_DASHBOARD_AI_DRAFT_CACHE[leadId] = d;
            renderLeadDemoDashboardAiDraft(d);
        },
        error: function () {
            renderLeadDemoDashboardAiDraftError('Unable to generate a draft right now.');
        }
    });
}

function renderLeadDemoDashboardAiDraftError(message) {
    $('#lddAiDraftLoading').html('<p class="text-center py-3" style="color:#c62828;">' + message + '</p>');
}

function renderLeadDemoDashboardAiDraft(d) {
    LEAD_DEMO_DASHBOARD_AI_DRAFT_LEAD_NAME = d.leadName || '';
    $('#lddAiDraftGenInfo').html(
        '<i class="fa fa-user mr-1 text-primary"></i><strong>' + (d.leadName || d.leadNo || 'N/A') + '</strong>'
        + ' &nbsp;|&nbsp; ' + (d.leadNo || '') + (d.country ? ' · ' + d.country : '')
        + ' &nbsp;|&nbsp; Priority: ' + getLeadDemoDashboardPriorityBadge(d.aiPriority) + ' (Score: <strong>' + (d.priorityScore || 0) + '</strong>)'
        + ' &nbsp;|&nbsp; Risk: ' + getLeadDemoDashboardRiskBadge(d.riskLevel)
        + ' &nbsp;|&nbsp; Follow-up: <strong>' + (d.followUpDueDate ? getLeadDemoDashboardFormattedDateTime(d.followUpDueDate) : '—') + '</strong>'
    );
    $('#lddAiDraftTo').val(d.email || '');
    $('#lddAiDraftFrom').val(d.counselorEmail || '');
    $('#lddAiDraftSubject').val(d.emailSubject || '');
    $('#lddAiDraftBody').val(d.emailBody || '');
    $('#lddAiDraftWhatsapp').val(d.whatsappDraft || '');
    $('#lddAiDraftCallPitch').val(d.callPitch || '');
    $('#lddSignalUrgency').text(d.enrollmentUrgency || '—');
    $('#lddSignalIntent').text(d.intentSummary || '—');
    $('#lddSignalObjection').text(d.mainObjection || '—');
    $('#lddSignalNextAction').text(d.nextBestAction || '—');
    $('#lddSignalCrmAlert').text(d.crmAlert || '—');
    $('#lddSignalReason').text(d.explainableReason || '—');
    // Collapse all accordions and switch back to the Email tab each time a (new or cached) draft renders
    $('.ldd-signal-header').each(function () { $($(this).data('target')).hide(); $(this).find('.ldd-chevron').css('transform', ''); });
    $('#lddAiDraftTabs a[href="#lddTabEmail"]').tab('show');
    $('#lddAiDraftLoading').hide();
    $('#lddAiDraftContent').show();
}

function copyLeadDemoDashboardAiDraft() {
    var activeTab = $('#lddAiDraftTabs .nav-link.active').attr('href');
    var text = '';
    if (activeTab === '#lddTabWhatsapp') {
        text = $('#lddAiDraftWhatsapp').val() || '';
    } else if (activeTab === '#lddTabCall') {
        text = $('#lddAiDraftCallPitch').val() || '';
    } else {
        text = $('#lddAiDraftBody').val() || '';
    }
    if (!text) { showMessageTheme2(0, 'Nothing to copy.', '', true); return; }
    var $tmp = $('<textarea>').val(text).appendTo('body').select();
    document.execCommand('copy');
    $tmp.remove();
    showMessageTheme2(1, 'Copied to clipboard.', '', true);
}

function sendLeadDemoDashboardAiDraftEmail() {
    var toEmail = ($('#lddAiDraftTo').val() || '').trim();
    var subject = ($('#lddAiDraftSubject').val() || '').trim();
    var rawBody = ($('#lddAiDraftBody').val() || '').trim();
    if (!toEmail) { showMessageTheme2(0, 'Please enter recipient email address.', '', true); return; }
    if (!subject) { showMessageTheme2(0, 'Please enter email subject.', '', true); return; }
    if (!rawBody) { showMessageTheme2(0, 'Email body cannot be empty.', '', true); return; }

    var params = {
        userId: USER_ID,
        toEmail: toEmail,
        fromEmail: ($('#lddAiDraftFrom').val() || '').trim(),
        subject: subject,
        htmlBody: rawBody.replace(/\n/g, '<br>'),
        userName: LEAD_DEMO_DASHBOARD_AI_DRAFT_LEAD_NAME
    };
    var btn = $('#lddAiDraftSendEmail');
    btn.prop('disabled', true);
    $.ajax({
        type: 'POST',
        contentType: APPLICATION_JSON_VALUE,
        url: getURLForHTML('/api/v1/leads', 'send-ai-draft-email'),
        data: JSON.stringify(params),
        dataType: 'json',
        cache: false,
        success: function (data) {
            btn.prop('disabled', false);
            if (data && (data.status === '1' || data.status === 1)) {
                showMessageTheme2(1, 'Email sent successfully!', '', true);
            } else {
                showMessageTheme2(0, (data && data.message) || 'Unable to send email.', '', true);
            }
        },
        error: function () {
            btn.prop('disabled', false);
            showMessageTheme2(0, 'Unable to send email right now.', '', true);
        }
    });
}

function saveLeadDemoDashboardAiDraft() {
    var params = {
        leadId: LEAD_DEMO_DASHBOARD_AI_DRAFT_LEAD_ID,
        userId: USER_ID,
        schoolId: SCHOOL_ID,
        emailTo: $('#lddAiDraftTo').val(),
        emailSubject: $('#lddAiDraftSubject').val(),
        emailBody: $('#lddAiDraftBody').val(),
        whatsappDraft: $('#lddAiDraftWhatsapp').val(),
        callPitch: $('#lddAiDraftCallPitch').val(),
        draftStatus: 'saved'
    };
    $.ajax({
        type: 'POST',
        contentType: APPLICATION_JSON_VALUE,
        url: getURLForHTML('/api/v1/leads', 'save-ai-email-draft'),
        data: JSON.stringify(params),
        dataType: 'json',
        cache: false,
        success: function (data) {
            if (data && (data.status === '1' || data.status === 1)) {
                showMessageTheme2(1, 'Draft saved.', '', true);
            } else {
                showMessageTheme2(0, (data && data.message) || 'Unable to save draft.', '', true);
            }
        },
        error: function () {
            showMessageTheme2(0, 'Unable to save draft right now.', '', true);
        }
    });
}
