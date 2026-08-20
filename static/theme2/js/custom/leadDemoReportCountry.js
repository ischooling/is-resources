function renderLeadDemoReportCountryDashboard(title, roleAndModule, schoolId, userId, userRole) {
    ROLE_MODULE = roleAndModule;
    $('#dashboardContentInHTML').html(getLeadDemoReportCountryContent(title));
    initLeadDemoReportCountryFilters();
    bindLeadDemoReportCountryEvents();
    fetchLeadDemoReportCountryData();
}

function getLeadDemoReportCountryDateRange(rangeType) {
    var now   = new Date();
    var start = new Date();
    var end   = new Date();
    if (rangeType === 'yesterday') {
        start.setDate(now.getDate() - 1);
        end.setDate(now.getDate() - 1);
    } else if (rangeType === 'week') {
        var day = now.getDay();
        start = new Date(now); start.setDate(now.getDate() - day);
        end   = new Date(start); end.setDate(start.getDate() + 6);
    } else if (rangeType === 'month') {
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end   = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    }
    function fmt(d) {
        var mm = ('0' + (d.getMonth() + 1)).slice(-2);
        var dd = ('0' + d.getDate()).slice(-2);
        return d.getFullYear() + '-' + mm + '-' + dd;
    }
    return { startDate: fmt(start), endDate: fmt(end) };
}

function initLeadDemoReportCountryFilters() {
    var today = new Date();
    // Same helper used by the existing (counselor-wise) Lead Demo Report page's Academic Counselor filter.
    $('#leadDemoReportCountryCounselorId').html('<option value="">All Academic Expert</option>');
    callLeadAssignUserList('leadDemoReportCountryFilterForm', 'B2C', 'leadDemoReportCountryCounselorId', true, true, USER_ID);
    $('#leadDemoReportCountryCounselorId').select2({ theme: 'bootstrap4' });

    // Same master list used elsewhere for country filters (option value = country ID).
    if (typeof getAllCountryList === 'function') {
        getAllCountryList('leadDemoReportCountryFilterForm', 'leadDemoReportCountryCountryId');
    }
    $('#leadDemoReportCountryCountryId').select2({ theme: 'bootstrap4' });

    $('#leadDemoReportCountryDateRange').select2({ theme: 'bootstrap4', minimumResultsForSearch: Infinity });

    $('#leadDemoReportCountryStartDate, #leadDemoReportCountryEndDate').datepicker({
        autoclose: true,
        format: 'dd-mm-yyyy',
        todayHighlight: true
    });
    $('#leadDemoReportCountryStartDate').datepicker('setDate', today);
    $('#leadDemoReportCountryEndDate').datepicker('setDate', today);

    $('#leadDemoReportCountryDateRange').off('change.ldrc').on('change.ldrc', function () {
        var val = $(this).val();
        if (val === 'custom') {
            $('#leadDemoReportCountryFromDateCol, #leadDemoReportCountryToDateCol').show();
        } else {
            $('#leadDemoReportCountryFromDateCol, #leadDemoReportCountryToDateCol').hide();
            fetchLeadDemoReportCountryData();
        }
    });
}

function bindLeadDemoReportCountryEvents() {
    $('#leadDemoReportCountrySearchBtn').off('click').on('click', function () {
        fetchLeadDemoReportCountryData();
    });

    $('#leadDemoReportCountryResetBtn').off('click').on('click', function () {
        $('#leadDemoReportCountryDateRange').val('today').trigger('change');
        $('#leadDemoReportCountryFromDateCol, #leadDemoReportCountryToDateCol').hide();
        var today = new Date();
        $('#leadDemoReportCountryStartDate').datepicker('setDate', today);
        $('#leadDemoReportCountryEndDate').datepicker('setDate', today);
        // Only special-rights users can clear this back to "All" — a locked (own-data-only)
        // counselor stays locked through Reset too.
        if (!$('#leadDemoReportCountryCounselorId').prop('disabled')) {
            $('#leadDemoReportCountryCounselorId').val('').trigger('change');
        }
        $('#leadDemoReportCountryCountryId').val('').trigger('change');
        fetchLeadDemoReportCountryData();
    });
}

// The Custom date inputs display/type DD-MM-YYYY; the backend's date-range comparisons expect
// YYYY-MM-DD, so convert before building the request.
function leadDemoReportCountryDDMMYYYYtoYYYYMMDD(ddmmyyyy) {
    var parts = (ddmmyyyy || '').split('-');
    return parts.length === 3 ? (parts[2] + '-' + parts[1] + '-' + parts[0]) : '';
}

function getLeadDemoReportCountryRequestParams() {
    var rangeType = $('#leadDemoReportCountryDateRange').val() || 'today';
    var startDate, endDate;
    if (rangeType === 'custom') {
        startDate = leadDemoReportCountryDDMMYYYYtoYYYYMMDD($('#leadDemoReportCountryStartDate').val()) + ' 00:00';
        endDate   = leadDemoReportCountryDDMMYYYYtoYYYYMMDD($('#leadDemoReportCountryEndDate').val())   + ' 23:59';
    } else {
        var range = getLeadDemoReportCountryDateRange(rangeType);
        startDate = range.startDate + ' 00:00';
        endDate   = range.endDate   + ' 23:59';
    }
    return {
        startDate:   startDate,
        endDate:     endDate,
        schoolId:    SCHOOL_ID,
        userId:      USER_ID,
        counselorId: $('#leadDemoReportCountryCounselorId').val() || '',
        countryId:   $('#leadDemoReportCountryCountryId').val() || ''
    };
}

// clickLeadsLink(...) (leads.js) expects DD-MM-YYYY; the request params above are 'YYYY-MM-DD HH:mm'.
// Derived from the same params used for the actual fetch, not the (hidden-unless-Custom) date inputs,
// so the link always matches whatever range was actually queried — Today/Week/Month included.
function getLeadDemoReportCountryLinkDateRange() {
    var params = getLeadDemoReportCountryRequestParams();
    function toDDMMYYYY(ymd) {
        var parts = (ymd || '').split(' ')[0].split('-');
        return parts.length === 3 ? (parts[2] + '-' + parts[1] + '-' + parts[0]) : '';
    }
    return {
        startDate: toDDMMYYYY(params.startDate),
        endDate: toDDMMYYYY(params.endDate)
    };
}

function fetchLeadDemoReportCountryData() {
    var params = getLeadDemoReportCountryRequestParams();

    customLoader(true);
    $.ajax({
        type: 'POST',
        contentType: APPLICATION_JSON_VALUE,
        url: getURLForHTML('dashboard', 'reports/lead-demo-country'),
        data: JSON.stringify(params),
        dataType: 'json',
        success: function (data) {
            if (!data || data.status === '0' || data.status === '2' || data.status === '3') {
                if (data && data.status === '3') {
                    redirectLoginPage();
                } else {
                    showMessageTheme2(0, (data && data.message) ? data.message : 'Data not found', '', true);
                }
                renderLeadDemoReportCountryTable([]);
                renderLeadDemoReportCountrySummaryCards({});
                return;
            }
            applyLeadDemoReportCountryCounselorLock(data);
            var reportData = data.data || [];
            renderLeadDemoReportCountryTable(reportData);
            renderLeadDemoReportCountrySummaryCards(data);
        },
        error: function () {
            showMessageTheme2(0, 'Unable to fetch lead demo report.', '', true);
            renderLeadDemoReportCountryTable([]);
            renderLeadDemoReportCountrySummaryCards({});
        },
        complete: function () {
            customLoader(false);
        }
    });
}

// Backend enforces this regardless (ADMIN-DASHBOARD-SPACIAL-RIGHTS check in
// formatLeadDemoReportCountryData) — this just reflects that decision in the UI so a locked-out
// counselor sees why they can't pick anyone else.
function applyLeadDemoReportCountryCounselorLock(data) {
    var $counselorEl = $('#leadDemoReportCountryCounselorId');
    if (data.restrictToOwnCounselor) {
        $counselorEl.val(String(data.loggedInCounselorId)).trigger('change');
        $counselorEl.prop('disabled', true);
    } else if ($counselorEl.data('lockApplied')) {
        // Was locked from an earlier fetch (shouldn't normally flip mid-session, but stay safe).
        $counselorEl.prop('disabled', false);
    }
    $counselorEl.data('lockApplied', !!data.restrictToOwnCounselor);
}

function getLeadDemoReportCountryNotEnrolled(data) {
    var totalLead = Number(data && data.totalLead) || 0;
    var enrolled = Number(data && data.enrolled) || 0;
    return Math.max(totalLead - enrolled, 0);
}

function renderLeadDemoReportCountrySummaryCards(data) {
    $('#ldrcCardTotalLead').text(data.totalLead || 0);
    $('#ldrcCardDemoSchedule').text(data.demoSchedule || 0);
    $('#ldrcCardDemoComplete').text(data.demoComplete || 0);
    $('#ldrcCardDemoNoShow').text(data.noShow || 0);
    $('#ldrcCardEnrolled').text(data.enrolled || 0);
    $('#ldrcCardNotEnrolled').text(getLeadDemoReportCountryNotEnrolled(data));
    $('#ldrcCardLeadToDemo').text(getLeadDemoReportCountryLeadToDemoRate(data));
    $('#ldrcCardLeadToConvert').text(getLeadDemoReportCountryLeadToConvertRate(data));
    $('#ldrcCardDemoToConvert').text(getLeadDemoReportCountryDemoToConvertRate(data));
}

function renderLeadDemoReportCountryTable(reportData) {
    // Drop rows where every metric is 0 — a country with nothing to show for the selected filters is
    // just noise in this list, not something worth a row.
    var nonZeroData = (reportData || []).filter(function (item) {
        return (item.totalLead || 0) || (item.demoBook || 0) || (item.demoSchedule || 0) || (item.demoComplete || 0) || (item.noShow || 0) || (item.enrolled || 0);
    });

    // Pre-sort here (highest Total Lead first) instead of relying only on DataTable's `order` option,
    // so the initial S.No numbering always matches what's on screen regardless of DataTable's own
    // column-type auto-detection.
    var sortedData = nonZeroData.slice().sort(function (a, b) {
        return (b.totalLead || 0) - (a.totalLead || 0);
    });

    // Destroy any existing DataTable instance BEFORE touching the DOM — DataTables keeps its own
    // internal row cache once active, so replacing the tbody HTML first (while it's still live) gets
    // ignored/reverted on the next draw. Destroy -> update HTML -> reinit, in that order.
    if ($.fn.DataTable.isDataTable('#leadDemoReportCountryTable')) {
        $('#leadDemoReportCountryTable').DataTable().destroy();
    }

    $('#leadDemoReportCountryTableBody').html(getLeadDemoReportCountryRowHtml(sortedData, getLeadDemoReportCountryLinkDateRange()));

    if (sortedData.length) {
        $('#leadDemoReportCountryTable').DataTable({
            theme: 'bootstrap4',
            pageLength: 20,
            lengthMenu: [10, 20, 50, 100, 200]
        });
    }
    return sortedData;
}
