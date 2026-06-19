/**
 * SMS Error Log Module — DataTable Logic
 * DIRECTOR role only.
 * Handles: DataTable init, filters, detail modal, export.
 */

var smsErrorLogTable = null;

function initSmsErrorLogTable() {
    if ($.fn.DataTable.isDataTable('#smsErrorLogTable')) {
        $('#smsErrorLogTable').DataTable().destroy();
        smsErrorLogTable = null;
    }

    var dataUrl = CONTEXT_PATH + SCHOOL_UUID + '/dashboard/sms-error-log-data';

    smsErrorLogTable = $('#smsErrorLogTable').DataTable({
        processing:  true,
        serverSide:  true,
        responsive:  true,
        pagingType:  'full_numbers',
        lengthMenu:  [[10, 25, 50, 100], [10, 25, 50, 100]],
        pageLength:  25,
        dom: '<"row mb-2"<"col-sm-6"B><"col-sm-6"f>>rt<"row mt-2"<"col-sm-6"l><"col-sm-6 text-right"ip>>',
        buttons: [
            {
                extend:    'excelHtml5',
                text:      '<i class="fa fa-file-excel-o mr-1"></i>Excel',
                className: 'btn btn-success btn-sm',
                title:     'SMS Error Logs',
                exportOptions: { columns: [0,1,2,3,4,5,6,7,8] }
            },
            {
                extend:    'csvHtml5',
                text:      '<i class="fa fa-file-text-o mr-1"></i>CSV',
                className: 'btn btn-info btn-sm',
                title:     'SMS Error Logs',
                exportOptions: { columns: [0,1,2,3,4,5,6,7,8] }
            }
        ],
        ajax: {
            url:  dataUrl,
            type: 'POST',
            data: function(d) {
                d.dateFrom     = $('#errDateFrom').val()    || '';
                d.dateTo       = $('#errDateTo').val()      || '';
                d.fSchoolId    = $('#errSchoolId').val()    || '';
                d.fUserId      = $('#errUserId').val()      || '';
                d.fModuleId    = $('#errModuleId').val()    || '';
                d.fHttpStatus  = $('#errHttpStatus').val()  || '';
                d.fAppVersion  = $('#errAppVersion').val()  || '';
            },
            error: function(xhr) {
                if (typeof SMSErrorLogger !== 'undefined') {
                    SMSErrorLogger.log({
                        errorType:    'SmsErrorLogTableAjaxError',
                        errorMessage: 'DataTable AJAX failed: ' + xhr.status + ' ' + xhr.statusText,
                        httpStatus:   xhr.status,
                        pageNo:       'sms-error-log'
                    });
                }
                console.error('SMS Error Log DataTable AJAX error:', xhr.status, xhr.statusText);
            }
        },
        columns: [
            {
                data:           'createdAt',
                title:          'Created At',
                defaultContent: '-',
                render: function(data) {
                    return data || '-';
                }
            },
            { data: 'schoolId',    title: 'School ID',   defaultContent: '-' },
            { data: 'userId',      title: 'User ID',      defaultContent: '-' },
            { data: 'userRole',    title: 'Role',         defaultContent: '-' },
            { data: 'moduleId',    title: 'Module ID',    defaultContent: '-' },
            { data: 'pageNo',      title: 'Page No',      defaultContent: '-' },
            {
                data:           'httpStatus',
                title:          'HTTP Status',
                defaultContent: '-',
                render: function(data) {
                    return getHttpStatusBadge(data);
                }
            },
            {
                data:  'errorMessage',
                title: 'Error Message',
                render: function(data) {
                    if (!data) return '-';
                    var short = data.length > 80 ? data.substring(0, 80) + '...' : data;
                    return '<span title="' + escapeHtml(data) + '">' + escapeHtml(short) + '</span>';
                }
            },
            { data: 'appVersion', title: 'App Version', defaultContent: '-' },
            {
                data:       null,
                title:      'Action',
                orderable:  false,
                searchable: false,
                render: function(data, type, row) {
                    return '<button class="btn btn-primary btn-sm" onclick="openSmsErrorDetail(' + row.id + ')">' +
                           '<i class="fa fa-eye mr-1"></i>View</button>';
                }
            }
        ],
        language: {
            processing: '<i class="fa fa-spinner fa-spin fa-2x text-primary"></i>',
            emptyTable: 'No error logs found.',
            zeroRecords: 'No matching error logs found.'
        },
        order: [[0, 'desc']]
    });

    // Re-calc responsive on page change
    $('#smsErrorLogTable').on('page.dt', function() {
        if (smsErrorLogTable && smsErrorLogTable.responsive) {
            smsErrorLogTable.responsive.recalc();
        }
    });
}

function applySmsErrorLogFilters() {
    if (smsErrorLogTable) {
        smsErrorLogTable.ajax.reload(null, true);
    }
}

function clearSmsErrorLogFilters() {
    $('#errDateFrom').val('');
    $('#errDateTo').val('');
    $('#errSchoolId').val('');
    $('#errUserId').val('');
    $('#errModuleId').val('');
    $('#errHttpStatus').val('');
    $('#errAppVersion').val('');
    if (smsErrorLogTable) {
        smsErrorLogTable.search('').ajax.reload(null, true);
    }
}

function refreshSmsErrorLogTable() {
    if (smsErrorLogTable) {
        smsErrorLogTable.ajax.reload(null, false);
    }
}

function openSmsErrorDetail(id) {
    $('#smsErrorDetailModalBody').html(
        '<div class="text-center py-4"><i class="fa fa-spinner fa-spin fa-2x text-primary"></i><p class="mt-2">Loading...</p></div>'
    );
    $('#smsErrorDetailModal').modal('show');

    var detailUrl = CONTEXT_PATH + SCHOOL_UUID + '/dashboard/sms-error-log-detail?id=' + id;

    $.ajax({
        url:      detailUrl,
        type:     'GET',
        dataType: 'json',
        success:  function(data) {
            $('#smsErrorDetailModalBody').html(getSmsErrorDetailHtml(data));
        },
        error: function(xhr) {
            $('#smsErrorDetailModalBody').html(
                '<div class="alert alert-danger">Failed to load error details. Please try again.</div>'
            );
            if (typeof SMSErrorLogger !== 'undefined') {
                SMSErrorLogger.log({
                    errorType:   'SmsErrorDetailAjaxError',
                    errorMessage: 'Detail fetch failed for id=' + id + ', status=' + xhr.status,
                    httpStatus:   xhr.status,
                    pageNo:       'sms-error-log'
                });
            }
        }
    });
}
