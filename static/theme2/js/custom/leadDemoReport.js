var LEAD_DEMO_REPORT_STATE = {
    page: 0,
    pageSize: 20,
    totalCount: 0,
    initializingPagination: false
};

function renderLeadDemoReportDashboard(title, roleAndModule, schoolId, userId, userRole) {
    ROLE_MODULE = roleAndModule;
    $('#dashboardContentInHTML').html(getLeadDemoReportContent(title));
    initLeadDemoReportFilters();
    bindLeadDemoReportEvents();
    fetchLeadDemoReportData(0);
}

function initLeadDemoReportFilters() {
    var today = new Date();
    $('#leadDemoReportCounselorId').html('<option value="">All Counselor</option>');
    callLeadAssignUserList('leadDemoReportFilterForm', 'B2C', 'leadDemoReportCounselorId', true, true, USER_ID);

    $('#leadDemoReportCounselorId').select2({
        theme: 'bootstrap4'
    });
    $('#leadDemoReportStatus').select2({
        theme: 'bootstrap4',
        minimumResultsForSearch: Infinity
    });

    $('#leadDemoReportStartDate, #leadDemoReportEndDate').datepicker({
        autoclose: true,
        format: 'yyyy-mm-dd',
        todayHighlight: true
    });

    $('#leadDemoReportStartDate').datepicker('setDate', today);
    $('#leadDemoReportEndDate').datepicker('setDate', today);
    $('#leadDemoReportStartTime').val('00:00');
    $('#leadDemoReportEndTime').val('23:59');
}

function bindLeadDemoReportEvents() {
    $('#leadDemoReportSearchBtn').off('click').on('click', function() {
        fetchLeadDemoReportData(0);
    });

    $('#leadDemoReportResetBtn').off('click').on('click', function() {
        LEAD_DEMO_REPORT_STATE.page = 0;
        $('#leadDemoReportStatus').val('').trigger('change');
        $('#leadDemoReportCounselorId').val('').trigger('change');
        $('#leadDemoReportSearchText').val('');
        var today = new Date();
        $('#leadDemoReportStartDate').datepicker('setDate', today);
        $('#leadDemoReportEndDate').datepicker('setDate', today);
        $('#leadDemoReportStartTime').val('00:00');
        $('#leadDemoReportEndTime').val('23:59');
        fetchLeadDemoReportData(0);
    });

    $('#leadDemoReportSearchText').off('keyup').on('keyup', function(e) {
        if (e.keyCode === 13) {
            fetchLeadDemoReportData(0);
        }
    });

    $('#leadDemoReportExportCsv').off('click').on('click', function() {
        exportLeadDemoReport('csv');
    });

    $('#leadDemoReportExportExcel').off('click').on('click', function() {
        exportLeadDemoReport('excel');
    });
}

function getLeadDemoReportRequestParams(page) {
    var startTime =  '00:00';//$('#leadDemoReportStartTime').val() ||
    var endTime =  '23:59';//$('#leadDemoReportEndTime').val() ||
    var startDate = ($('#leadDemoReportStartDate').val() || '') + ' ' + startTime;
    var endDate = ($('#leadDemoReportEndDate').val() || '') + ' ' + endTime;
    var params = {
        startDate: startDate,
        endDate: endDate,
        schoolId: SCHOOL_ID,
        demoAssignUserId: $('#leadDemoReportCounselorId').val() || '',
        status: $('#leadDemoReportStatus').val() || '',
        page: page,
        pageSize: LEAD_DEMO_REPORT_STATE.pageSize
    };
    console.log('Request Params:', params);
    return params;
}

function fetchLeadDemoReportData(page) {
    LEAD_DEMO_REPORT_STATE.page = page;
    var params = getLeadDemoReportRequestParams(page);

    customLoader(true);
    $.ajax({
        type: 'POST',
        contentType: APPLICATION_JSON_VALUE,
        url: getURLForHTML('dashboard', 'reports/lead-demo'),
        data: JSON.stringify(params),
        dataType: 'json',
        success: function(data) {
            console.log(data)
            if (!data || data.status === '0' || data.status === '2' || data.status === '3') {
                if (data && data.status === '3') {
                    redirectLoginPage();
                } else {
                    showMessageTheme2(0, (data && data.message) ? data.message : 'Data not found', '', true);
                }
                renderLeadDemoReportTable([], page);
                setLeadDemoReportPagination(0, page);
                return;
            }
            var reportData = data.data || [];
            LEAD_DEMO_REPORT_STATE.totalCount = data.count || 0;
            renderLeadDemoReportTable(reportData, page);
            setLeadDemoReportPagination(LEAD_DEMO_REPORT_STATE.totalCount, page);
        },
        error: function() {
            showMessageTheme2(0, 'Unable to fetch lead demo report.', '', true);
            renderLeadDemoReportTable([], page);
            setLeadDemoReportPagination(0, page);
        },
        complete: function() {
            customLoader(false);
        }
    });
}

function renderLeadDemoReportTable(reportData, page) {
    $('#leadDemoReportTableBody').html(getLeadDemoReportRowHtml(reportData, page, LEAD_DEMO_REPORT_STATE.pageSize));
    $('#leadDemoReportCountValue').text(LEAD_DEMO_REPORT_STATE.totalCount);
}

function setLeadDemoReportPagination(totalCount, currentPage) {
    var totalPages = Math.ceil((totalCount || 0) / LEAD_DEMO_REPORT_STATE.pageSize);
    if (totalPages <= 1) {
        $('#leadDemoReportPagination').empty();
        return;
    }
    if ($('#leadDemoReportPagination').data('twbs-pagination')) {
        $('#leadDemoReportPagination').twbsPagination('destroy');
    }
    LEAD_DEMO_REPORT_STATE.initializingPagination = true;
    $('#leadDemoReportPagination').twbsPagination({
        totalPages: totalPages,
        visiblePages: 5,
        startPage: currentPage + 1,
        first: 'First',
        prev: 'Prev',
        next: 'Next',
        last: 'Last',
        onPageClick: function(event, page) {
            if (LEAD_DEMO_REPORT_STATE.initializingPagination) {
                LEAD_DEMO_REPORT_STATE.initializingPagination = false;
                return;
            }
            var apiPage = page - 1;
            if (apiPage !== LEAD_DEMO_REPORT_STATE.page) {
                fetchLeadDemoReportData(apiPage);
            }
        }
    });
}

function exportLeadDemoReport(type) {
    var params = getLeadDemoReportRequestParams(0);
    params.pageSize = 10000;
    var finalPayload = params;
    customLoader(true);
    $.ajax({
        type: 'POST',
        contentType: APPLICATION_JSON_VALUE,
        url: getURLForHTML('dashboard', 'reports/lead-demo'),
        data: JSON.stringify(finalPayload),
        dataType: 'json',
        success: function(data) {
            var reportData = (data && data.data) ? data.data : [];
            if (reportData.length === 0) {
                showMessageTheme2(0, 'No data available to export.', '', true);
                return;
            }
            if (type === 'csv') {
                downloadLeadDemoReportCsv(reportData);
            } else {
                downloadLeadDemoReportExcel(reportData);
            }
        },
        error: function() {
            showMessageTheme2(0, 'Unable to export report.', '', true);
        },
        complete: function() {
            customLoader(false);
        }
    });
}

function downloadLeadDemoReportCsv(rows) {
    var header = ['Counselor', 'Total Demo', 'Demo Done', 'Demo Not Done', 'No Status Update', 'Status Updated', 'Host Not Join', 'Attendee Not Join', 'Attendee Before Click', 'Host Wait Avg', 'Response Avg', 'User Wise Demo Done', 'Cancelled', 'Not Show', 'Demo Not Confirm', 'Reschedule'];
    var csv = [header.join(',')];
    $.each(rows, function(_, item) {
        csv.push([
            sanitizeCsvValue(item.counselorName),
            item.totalDemo || 0,
            item.demoDone || 0,
            item.demoNotDone || 0,
            item.noStatusUpdate || 0,
            item.statusUpdated || 0,
            item.hostNotJoin || 0,
            item.attendeeNotJoin || 0,
            item.attendeeBeforeClick || 0,
            sanitizeCsvValue(item.hostJoinWaitingForAttendeeAvg || '00:00:00'),
            sanitizeCsvValue(item.responseTimeAvg || '00:00:00'),
            item.userWiseDemoDone || 0,
            item.cancelledDemo || 0,
            item.notShowDemo || 0,
            item.demoNotConfirm || 0,
            item.rescheduleDemo || 0
        ].join(','));
    });
    var blob = new Blob([csv.join('\n')], { type: 'text/csv;charset=utf-8;' });
    var link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'lead-demo-report.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function downloadLeadDemoReportExcel(rows) {
    var html = '<table border="1"><tr>'
        + '<th>Counselor</th><th>Total Demo</th><th>Demo Done</th><th>Demo Not Done</th><th>No Status Update</th>'
        + '<th>Status Updated</th><th>Host Not Join</th><th>Attendee Not Join</th><th>Attendee Before Click</th>'
        + '<th>Host Wait Avg</th><th>Response Avg</th><th>User Wise Demo Done</th><th>Cancelled</th>'
        + '<th>Not Show</th><th>Demo Not Confirm</th><th>Reschedule</th></tr>';
    $.each(rows, function(_, item) {
        html += '<tr>'
            + '<td>' + (item.counselorName || 'N/A') + '</td>'
            + '<td>' + (item.totalDemo || 0) + '</td>'
            + '<td>' + (item.demoDone || 0) + '</td>'
            + '<td>' + (item.demoNotDone || 0) + '</td>'
            + '<td>' + (item.noStatusUpdate || 0) + '</td>'
            + '<td>' + (item.statusUpdated || 0) + '</td>'
            + '<td>' + (item.hostNotJoin || 0) + '</td>'
            + '<td>' + (item.attendeeNotJoin || 0) + '</td>'
            + '<td>' + (item.attendeeBeforeClick || 0) + '</td>'
            + '<td>' + (item.hostJoinWaitingForAttendeeAvg || '00:00:00') + '</td>'
            + '<td>' + (item.responseTimeAvg || '00:00:00') + '</td>'
            + '<td>' + (item.userWiseDemoDone || 0) + '</td>'
            + '<td>' + (item.cancelledDemo || 0) + '</td>'
            + '<td>' + (item.notShowDemo || 0) + '</td>'
            + '<td>' + (item.demoNotConfirm || 0) + '</td>'
            + '<td>' + (item.rescheduleDemo || 0) + '</td>'
            + '</tr>';
    });
    html += '</table>';
    var blob = new Blob([html], { type: 'application/vnd.ms-excel' });
    var link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'lead-demo-report.xls';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function sanitizeCsvValue(value) {
    var parsedValue = value || '';
    return '"' + String(parsedValue).replace(/"/g, '""') + '"';
}
