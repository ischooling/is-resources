/**
 * Manage CRON Module — DataTable + actions
 * SUPER_ADMIN role only.
 * Handles: cron list, header stats, guarded manual execution, run-log history.
 */

var manageCronTable = null;
var cronRunLogTable = null;
var cronRunContext = {};                 // { cronKey, displayName, endpointPath }
var cronCurrentEnv = '';                  // deployment mode, from the stats call
var CRON_CONFIRM_PHRASE = 'Execute Cron';

function manageCronBaseUrl() {
    return CONTEXT_PATH + SCHOOL_UUID + '/dashboard/';
}

/* ------------------------------------------------------------ header stats */
function loadManageCronStats() {
    $.ajax({
        url: manageCronBaseUrl() + 'manage-cron-stats',
        type: 'GET',
        dataType: 'json',
        success: function (res) {
            var s = (res && res.stats) || {};
            cronCurrentEnv = res && res.environment ? res.environment : '';
            $('#cronStatTotal').text(s.totalCrons != null ? s.totalCrons : 0);
            $('#cronStatRanToday').text(s.ranToday != null ? s.ranToday : 0);
            $('#cronStatFailed').text(s.failed24h != null ? s.failed24h : 0);
            $('#cronStatManual').text(s.manualRunsToday != null ? s.manualRunsToday : 0);

            var banner = $('#cronGateBanner');
            if (res && res.executionAllowed) {
                var ipNote = res.ipEnforced
                    ? (res.ipLogOnly
                        ? ' · IP gate LOG-ONLY (not enforced) · seen IP ' + escapeHtml(res.serverIp)
                        : ' · IP-gated · server IP ' + escapeHtml(res.serverIp))
                    : ' · IP gate off';
                banner.html('<span class="text-success"><i class="fa fa-shield mr-1"></i>' +
                    escapeHtml(res.environment) + ' — cron execution enabled' + ipNote + '</span>');
            } else {
                banner.html('<span class="text-warning"><i class="fa fa-exclamation-circle mr-1"></i>' +
                    escapeHtml(res ? res.environment : '') +
                    ' — cron execution is disabled in this environment</span>');
            }
        },
        error: function () {
            $('#cronGateBanner').text('Could not load environment status.');
        }
    });
}

/* ------------------------------------------------------------- crons table */
function initManageCronTable() {
    if ($.fn.DataTable.isDataTable('#manageCronTable')) {
        $('#manageCronTable').DataTable().destroy();
        manageCronTable = null;
    }
    manageCronTable = $('#manageCronTable').DataTable({
        autoWidth: false,
        processing: true,
        serverSide: true,
        responsive: true,
        pagingType: 'full_numbers',
        lengthMenu: [[25, 50, 100], [25, 50, 100]],
        pageLength: 25,
        ajax: {
            url: manageCronBaseUrl() + 'manage-cron-data',
            type: 'POST',
            data: function (d) {
                d.orderColumn = cronColumnName(d.order && d.order[0] ? d.order[0].column : 1);
                d.fCategory = $('#cronFCategory').val() || '';
                d.fEnabled = $('#cronFEnabled').val() || '';
                return d;
            }
        },
        columns: [
            {
                data: 'displayName', title: 'Cron',
                render: function (data, type, row) {
                    return '<div>' + escapeHtml(data || row.cronKey) +
                        '<br><code class="small">' + escapeHtml(row.cronKey) + '</code></div>';
                }
            },
            { data: 'category', title: 'Category', defaultContent: '-' },
            {
                data: 'cronExpression', title: 'Schedule', defaultContent: '-', orderable: false,
                render: function (data) {
                    return data ? '<code class="small">' + escapeHtml(data) + '</code>'
                        : '<span class="text-muted">—</span>';
                }
            },
            {
                data: 'lastRunAt', title: 'Last run', defaultContent: '-',
                render: function (data, type, row) {
                    if (!data) return '<span class="text-muted">Never</span>';
                    return escapeHtml(data) + '<br><small class="text-muted">' +
                        (row.lastDurationMs != null ? row.lastDurationMs + ' ms' : '') + '</small>';
                }
            },
            {
                data: 'lastStatus', title: 'Status', defaultContent: '-', orderable: false,
                render: function (data) { return getCronStatusBadge(data); }
            },
            {
                data: 'lastTriggeredBy', title: 'Run by', defaultContent: '-', orderable: false,
                render: function (data, type, row) {
                    return getTriggeredByBadge(data) +
                        (row.lastUserName ? ' <small>' + escapeHtml(row.lastUserName) + '</small>' : '');
                }
            },
            {
                data: 'enabled', title: 'Enabled', orderable: false,
                render: function (data) {
                    return data ? '<span class="badge badge-success">Yes</span>'
                        : '<span class="badge badge-secondary">No</span>';
                }
            },
            {
                data: null, title: 'Action', orderable: false, searchable: false,
                render: function (data, type, row) {
                    var runBtn = '<button class="btn btn-danger btn-sm mr-1" ' +
                        (row.enabled ? '' : 'disabled ') +
                        'onclick=\'openCronRunModal(' + JSON.stringify(row).replace(/'/g, '&#39;') + ')\'>' +
                        '<i class="fa fa-play"></i> Run</button>';
                    var logBtn = '<button class="btn btn-outline-secondary btn-sm" ' +
                        'onclick="openCronLogs(\'' + encodeURIComponent(row.cronKey) + '\')">' +
                        '<i class="fa fa-history"></i> Logs</button>';
                    return runBtn + logBtn;
                }
            }
        ],
        language: {
            processing: '<i class="fa fa-spinner fa-spin fa-2x" style="color:var(--pc);"></i>',
            emptyTable: 'No crons found.',
            zeroRecords: 'No matching crons found.'
        },
        order: [[0, 'asc']]
    });
    applyMinCharSearch('#manageCronTable', manageCronTable, 4);
}

/**
 * Replace DataTables' default search (fires every keystroke) with one that only
 * searches once at least `minChars` characters are typed — or when cleared.
 */
function applyMinCharSearch(tableSelector, tableApi, minChars) {
    var $input = $(tableSelector + '_filter input');
    var timer = null;
    $input.off();
    $input.on('keyup search input paste cut', function () {
        var value = this.value || '';
        clearTimeout(timer);
        timer = setTimeout(function () {
            if (value.length >= minChars || value.length === 0) {
                if (tableApi.search() !== value) {
                    tableApi.search(value).draw();
                }
            }
        }, 350);
    });
    $input.attr('placeholder', minChars + '+ chars to search');
}

function cronColumnName(idx) {
    var cols = ['displayName', 'category', 'cronExpression', 'lastRunAt', 'lastStatus', 'lastTriggeredBy', 'enabled', ''];
    return cols[idx] || 'displayName';
}

function applyManageCronFilters() {
    if (manageCronTable) manageCronTable.ajax.reload(null, true);
}

function clearManageCronFilters() {
    $('#cronFCategory').val('');
    $('#cronFEnabled').val('');
    if (manageCronTable) manageCronTable.search('').ajax.reload(null, true);
}

function refreshManageCronTable() {
    loadManageCronStats();
    if (manageCronTable) manageCronTable.ajax.reload(null, false);
}

/* --------------------------------------------------- guarded manual run */
function openCronRunModal(row) {
    cronRunContext = row || {};
    $('#cronRunName').text(row.displayName || row.cronKey);
    $('#cronRunEnv').text(cronCurrentEnv || 'current');
    $('#cronConfirmText').val('');
    $('#cronRunParams').val(row.defaultParams || '');
    $('#cronRunError').hide().text('');
    $('#cronRunExecuteBtn').prop('disabled', true);
    if (row.requiresParams === 'Y') {
        $('#cronRunParamsWrap').show();
    } else {
        $('#cronRunParamsWrap').hide();
    }
    $('#cronRunModal').modal('show');
}

function validateCronConfirm() {
    var ok = $('#cronConfirmText').val() === CRON_CONFIRM_PHRASE;
    $('#cronRunExecuteBtn').prop('disabled', !ok);
}

function submitCronRun() {
    if ($('#cronConfirmText').val() !== CRON_CONFIRM_PHRASE) {
        $('#cronRunError').text('Type "' + CRON_CONFIRM_PHRASE + '" exactly to confirm.').show();
        return;
    }
    var btn = $('#cronRunExecuteBtn');
    btn.prop('disabled', true).html('<i class="fa fa-spinner fa-spin mr-1"></i>Running…');

    $.ajax({
        url: manageCronBaseUrl() + 'manage-cron-run',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            cronKey: cronRunContext.cronKey,
            confirmationText: $('#cronConfirmText').val(),
            params: $('#cronRunParams').val() || ''
        }),
        success: function (res) {
            $('#cronRunModal').modal('hide');
            if (typeof showMessageTheme2 === 'function') {
                showMessageTheme2(1, res.message || 'Cron triggered.');
            } else {
                alert(res.message || 'Cron triggered.');
            }
            // Give the async run a moment, then refresh list + stats.
            setTimeout(refreshManageCronTable, 1500);
        },
        error: function (xhr) {
            var msg = 'Failed to run cron.';
            try { msg = JSON.parse(xhr.responseText).message || msg; } catch (e) {}
            $('#cronRunError').text(msg).show();
        },
        complete: function () {
            btn.html('<i class="fa fa-play mr-1"></i>Execute');
            validateCronConfirm();
        }
    });
}

/* ------------------------------------------------------------- run logs */
function openCronLogs(cronKeyEncoded) {
    var cronKey = cronKeyEncoded ? decodeURIComponent(cronKeyEncoded) : '';
    $('#cronLogsTitleSuffix').text(cronKey ? ' — ' + cronKey : ' — all crons');
    $('#cronLogsModal').modal('show');
    initCronRunLogTable(cronKey);
}

function initCronRunLogTable(cronKey) {
    if ($.fn.DataTable.isDataTable('#cronRunLogTable')) {
        $('#cronRunLogTable').DataTable().destroy();
        cronRunLogTable = null;
    }
    cronRunLogTable = $('#cronRunLogTable').DataTable({
        autoWidth: false,
        processing: true,
        serverSide: true,
        responsive: true,
        pagingType: 'full_numbers',
        lengthMenu: [[25, 50, 100], [25, 50, 100]],
        pageLength: 25,
        ajax: {
            url: manageCronBaseUrl() + 'manage-cron-logs-data',
            type: 'POST',
            data: function (d) {
                d.orderColumn = cronLogColumnName(d.order && d.order[0] ? d.order[0].column : 0);
                d.fCronKey = cronKey || '';
                return d;
            }
        },
        columns: [
            { data: 'startedAt', title: 'Started', defaultContent: '-' },
            {
                data: 'displayName', title: 'Cron', defaultContent: '-',
                render: function (data, type, row) { return escapeHtml(data || row.cronKey); }
            },
            { data: 'status', title: 'Status', render: function (d) { return getCronStatusBadge(d); } },
            {
                data: 'triggeredBy', title: 'Run by',
                render: function (d, t, row) {
                    return getTriggeredByBadge(d) + (row.userName ? ' <small>' + escapeHtml(row.userName) + '</small>' : '');
                }
            },
            { data: 'clientIp', title: 'IP', defaultContent: '-' },
            {
                data: 'durationMs', title: 'Duration', defaultContent: '-',
                render: function (d) { return d != null ? d + ' ms' : '-'; }
            },
            {
                data: null, title: 'Action', orderable: false, searchable: false,
                render: function (d, t, row) {
                    return '<button class="btn btn-outline-secondary btn-sm" onclick="openCronLogDetail(' +
                        row.id + ')"><i class="fa fa-eye"></i> View</button>';
                }
            }
        ],
        language: {
            processing: '<i class="fa fa-spinner fa-spin fa-2x" style="color:var(--pc);"></i>',
            emptyTable: 'No runs recorded yet.'
        },
        order: [[0, 'desc']]
    });
    applyMinCharSearch('#cronRunLogTable', cronRunLogTable, 4);
}

function cronLogColumnName(idx) {
    var cols = ['startedAt', 'displayName', 'status', 'triggeredBy', '', 'durationMs', ''];
    return cols[idx] || 'startedAt';
}

function openCronLogDetail(id) {
    $('#cronLogDetailBody').html(
        '<div class="text-center py-4"><i class="fa fa-spinner fa-spin fa-2x" style="color:var(--pc);"></i></div>');
    $('#cronLogDetailModal').modal('show');
    $.ajax({
        url: manageCronBaseUrl() + 'manage-cron-log-detail?id=' + id,
        type: 'GET',
        dataType: 'json',
        success: function (data) { $('#cronLogDetailBody').html(getCronLogDetailHtml(data)); },
        error: function () {
            $('#cronLogDetailBody').html('<div class="alert alert-danger">Failed to load run detail.</div>');
        }
    });
}
