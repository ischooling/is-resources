/**
 * SMS Error Log Module — Content Builder
 * DIRECTOR role only.
 * Builds HTML using template literals and injects into #dashboardContentInHTML.
 * No custom CSS — uses only existing Bootstrap 4 + new-theme-style.css classes.
 */

async function renderSmsErrorLog(title, roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE) {
    try {
        $('#dashboardContentInHTML').html(getSmsErrorLogContent(title, roleAndModule));
        initSmsErrorLogTable();
    } catch (err) {
        if (typeof SMSErrorLogger !== 'undefined') {
            SMSErrorLogger.log({
                errorType: err.name || 'renderSmsErrorLogError',
                errorMessage: err.message,
                stackTrace: err.stack,
                pageNo: 'sms-error-log'
            });
        }
        console.error('renderSmsErrorLog error:', err);
    }
}

function getSmsErrorLogContent(title, roleAndModule) {
    return `
    <!-- Page Title -->
    <div class="app-page-title mb-3 py-2">
        <div class="page-title-wrapper">
            <div class="page-title-heading">
                <div class="page-title-icon">
                    <i class="fa fa-bug text-danger"></i>
                </div>
                <div>${title}</div>
            </div>
            <div class="page-title-actions">
                <button type="button" class="btn btn-danger btn-sm" onclick="refreshSmsErrorLogTable()">
                    <i class="fa fa-refresh"></i> Refresh
                </button>
            </div>
        </div>
    </div>

    <!-- Filters Card -->
    <div class="main-card mb-3 card">
        <div class="card-header">
            <i class="fa fa-filter mr-2"></i><b>Filters</b>
            <div class="btn-actions-pane-right">
                <button type="button" class="btn btn-link btn-sm" data-toggle="collapse"
                    data-target="#smsErrorLogFilters" aria-expanded="true">
                    <i class="fa fa-chevron-up"></i>
                </button>
            </div>
        </div>
        <div id="smsErrorLogFilters" class="collapse show">
            <div class="card-body">
                <form id="smsErrorLogFilterForm" onsubmit="return false;">
                    <div class="row">
                        <div class="col-md-3 col-sm-6">
                            <div class="form-group">
                                <label>Date From</label>
                                <input type="date" id="errDateFrom" class="form-control form-control-sm">
                            </div>
                        </div>
                        <div class="col-md-3 col-sm-6">
                            <div class="form-group">
                                <label>Date To</label>
                                <input type="date" id="errDateTo" class="form-control form-control-sm">
                            </div>
                        </div>
                        <div class="col-md-2 col-sm-6">
                            <div class="form-group">
                                <label>School ID</label>
                                <input type="number" id="errSchoolId" class="form-control form-control-sm" placeholder="All Schools">
                            </div>
                        </div>
                        <div class="col-md-2 col-sm-6">
                            <div class="form-group">
                                <label>User ID</label>
                                <input type="number" id="errUserId" class="form-control form-control-sm" placeholder="All Users">
                            </div>
                        </div>
                        <div class="col-md-2 col-sm-6">
                            <div class="form-group">
                                <label>Module ID</label>
                                <input type="number" id="errModuleId" class="form-control form-control-sm" placeholder="All Modules">
                            </div>
                        </div>
                        <div class="col-md-2 col-sm-6">
                            <div class="form-group">
                                <label>HTTP Status</label>
                                <select id="errHttpStatus" class="form-control form-control-sm">
                                    <option value="">All</option>
                                    <option value="400">400 - Bad Request</option>
                                    <option value="401">401 - Unauthorized</option>
                                    <option value="403">403 - Forbidden</option>
                                    <option value="404">404 - Not Found</option>
                                    <option value="408">408 - Timeout</option>
                                    <option value="429">429 - Too Many Requests</option>
                                    <option value="500">500 - Server Error</option>
                                    <option value="502">502 - Bad Gateway</option>
                                    <option value="503">503 - Service Unavailable</option>
                                    <option value="504">504 - Gateway Timeout</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-md-3 col-sm-6">
                            <div class="form-group">
                                <label>App Version</label>
                                <input type="text" id="errAppVersion" class="form-control form-control-sm" placeholder="e.g. 1.1.0">
                            </div>
                        </div>
                        <div class="col-md-4 col-sm-12">
                            <div class="form-group">
                                <label>Error Message</label>
                                <input type="text" id="errErrorMessage" class="form-control form-control-sm" placeholder="Search in error message...">
                            </div>
                        </div>
                        <div class="col-md-12">
                            <button type="button" class="btn btn-primary btn-sm mr-2" onclick="applySmsErrorLogFilters()">
                                <i class="fa fa-search mr-1"></i>Search
                            </button>
                            <button type="button" class="btn btn-secondary btn-sm" onclick="clearSmsErrorLogFilters()">
                                <i class="fa fa-times mr-1"></i>Clear Filters
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Data Table Card -->
    <div class="main-card mb-3 card">
        <div class="card-body">
            <table id="smsErrorLogTable" class="table table-bordered responsive nowrap" style="width:100%">
                <thead>
                    <tr>
                        <th>Created At</th>
                        <th>School ID</th>
                        <th>User ID</th>
                        <th>Role ID</th>
                        <th>Module ID</th>
                        <th>Page No</th>
                        <th>HTTP Status</th>
                        <th>Error Message</th>
                        <th>App Version</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
    </div>

    <!-- Error Detail Modal -->
    <div class="modal fade" id="smsErrorDetailModal" tabindex="-1" role="dialog"
         aria-labelledby="smsErrorDetailModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl modal-dialog-scrollable" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="smsErrorDetailModalLabel">
                        <i class="fa fa-bug mr-2 text-danger"></i>Error Details
                    </h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body" id="smsErrorDetailModalBody">
                    <div class="text-center py-4">
                        <i class="fa fa-spinner fa-spin fa-2x text-primary"></i>
                        <p class="mt-2">Loading...</p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
    `;
}


function getSmsErrorDetailHtml(d) {
    var httpBadge = getHttpStatusBadge(d.httpStatus);
    return `
    <div class="row">
        <div class="col-md-6">
            <table class="table table-bordered table-sm">
                <tbody>
                    <tr><th width="35%">Error UUID</th><td><small>${d.errorUuid || '-'}</small></td></tr>
                    <tr><th>Created At</th><td>${d.createdAt || '-'}</td></tr>
                    <tr><th>School ID</th><td>${d.schoolId || '-'}</td></tr>
                    <tr><th>User ID</th><td>${d.userId || '-'}</td></tr>
                    <tr><th>Role</th><td>${d.userRole || '-'}</td></tr>
                    <tr><th>Module ID</th><td>${d.moduleId || '-'}</td></tr>
                    <tr><th>Page No</th><td>${d.pageNo || '-'}</td></tr>
                    <tr><th>HTTP Status</th><td>${httpBadge}</td></tr>
                    <tr><th>Error Type</th><td>${d.errorType || '-'}</td></tr>
                    <tr><th>App Version</th><td>${d.appVersion || '-'}</td></tr>
                    <tr><th>Source</th><td>${d.source || '-'}</td></tr>
                    <tr><th>Environment</th><td>${d.environment || '-'}</td></tr>
                    <tr><th>Client IP</th><td>${d.clientIp || '-'}</td></tr>
                    <tr><th>Session ID</th><td><small>${d.sessionId || '-'}</small></td></tr>
                </tbody>
            </table>
        </div>
        <div class="col-md-6">
            <table class="table table-bordered table-sm">
                <tbody>
                    <tr><th>Current URL</th><td><small style="word-break:break-all;">${d.currentUrl || '-'}</small></td></tr>
                    <tr><th>User Agent</th><td><small>${d.userAgent || '-'}</small></td></tr>
                    <tr><th>Request Params</th><td><small>${d.requestParams || '-'}</small></td></tr>
                    <tr><th>Error Hash</th><td><small>${d.errorHash || '-'}</small></td></tr>
                </tbody>
            </table>
        </div>
    </div>
    <div class="row">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <span><b>Error Message</b></span>
                    <button class="btn btn-sm btn-outline-secondary" onclick="smsErrCopyText('smsDetailErrorMsg', this)">
                        <i class="fa fa-copy mr-1"></i>Copy
                    </button>
                </div>
                <div class="card-body">
                    <pre id="smsDetailErrorMsg" class="pre-scrollable mb-0">${escapeHtml(d.errorMessage || '')}</pre>
                </div>
            </div>
        </div>
    </div>
    <div class="row mt-3">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <span><b>Stack Trace</b></span>
                    <button class="btn btn-sm btn-outline-secondary" onclick="smsErrCopyText('smsDetailStackTrace', this)">
                        <i class="fa fa-copy mr-1"></i>Copy
                    </button>
                </div>
                <div class="card-body">
                    <pre id="smsDetailStackTrace" class="pre-scrollable mb-0" style="max-height:300px;">${escapeHtml(d.stackTrace || '')}</pre>
                </div>
            </div>
        </div>
    </div>`;
}

function getHttpStatusBadge(status) {
    if (!status) return '<span class="badge badge-secondary">N/A</span>';
    if (status >= 500) return `<span class="badge badge-danger">${status}</span>`;
    if (status >= 400) return `<span class="badge badge-warning">${status}</span>`;
    if (status >= 300) return `<span class="badge badge-info">${status}</span>`;
    return `<span class="badge badge-success">${status}</span>`;
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function smsErrCopyText(elementId, btn) {
    var text = document.getElementById(elementId).innerText;
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(function() {
            var orig = btn.innerHTML;
            btn.innerHTML = '<i class="fa fa-check mr-1"></i>Copied!';
            setTimeout(function() { btn.innerHTML = orig; }, 2000);
        });
    } else {
        var ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
    }
}
