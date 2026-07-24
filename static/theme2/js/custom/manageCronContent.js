/**
 * Manage CRON Module — Content Builder
 * SUPER_ADMIN role only.
 * Builds HTML with template literals and injects into #dashboardContentInHTML.
 * No custom colours — uses existing Bootstrap 4 + new-theme-style.css classes so
 * it inherits the per-school theme (ROOTCSS: --pc/--sc, --success/--danger…).
 */

async function renderManageCron(title, roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE) {
    try {
        $('#dashboardContentInHTML').html(getManageCronContent(title));
        loadManageCronStats();
        initManageCronTable();
    } catch (err) {
        if (typeof SMSErrorLogger !== 'undefined') {
            SMSErrorLogger.log({
                errorType: err.name || 'renderManageCronError',
                errorMessage: err.message,
                stackTrace: err.stack,
                pageNo: 'manage-cron'
            });
        }
        console.error('renderManageCron error:', err);
    }
}

function getManageCronContent(title) {
    return `
    <div class="app-page-title mb-3 py-2">
        <div class="page-title-wrapper">
            <div class="page-title-heading">
                <div class="page-title-icon">
                    <i class="fa fa-clock-o" style="color: var(--pc);"></i>
                </div>
                <div>${title}
                    <div class="page-title-subheading" id="cronGateBanner">Checking environment…</div>
                </div>
            </div>
            <div class="page-title-actions">
                <button type="button" class="btn btn-outline-secondary btn-sm mr-2" onclick="openCronLogs('')">
                    <i class="fa fa-history"></i> All run logs
                </button>
                <button type="button" class="btn btn-primary btn-sm" onclick="refreshManageCronTable()">
                    <i class="fa fa-refresh"></i> Refresh
                </button>
            </div>
        </div>
    </div>

    <!-- Metric cards -->
    <div class="row mb-1" id="cronStatsRow">
        ${statCard('cronStatTotal', 'Total crons', 'fa-list', 'var(--pc)')}
        ${statCard('cronStatRanToday', 'Ran today', 'fa-check-circle', 'var(--success)')}
        ${statCard('cronStatFailed', 'Failed (24h)', 'fa-exclamation-triangle', 'var(--danger)')}
        ${statCard('cronStatManual', 'Manual runs today', 'fa-hand-pointer-o', 'var(--sc)')}
    </div>

    <!-- Filters -->
    <div class="main-card mb-3 card">
        <div class="card-header">
            <i class="fa fa-filter mr-2"></i><b>Filters</b>
        </div>
        <div class="card-body">
            <form onsubmit="return false;">
                <div class="row">
                    <div class="col-md-3 col-sm-6">
                        <div class="form-group">
                            <label>Category</label>
                            <select id="cronFCategory" class="form-control">
                                <option value="">All</option>
                                <option>PAYMENT</option><option>STUDENT</option><option>TEACHER</option>
                                <option>MEETING</option><option>ZOOM</option><option>LENS</option>
                                <option>LMS</option><option>LEAD</option><option>NOTIFICATION</option>
                                <option>REPORT</option><option>B2B</option><option>DEMO</option>
                                <option>COURSE</option><option>WATI</option><option>INTEGRATION</option>
                                <option>MAINTENANCE</option><option>ADMIN</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-3 col-sm-6">
                        <div class="form-group">
                            <label>Enabled</label>
                            <select id="cronFEnabled" class="form-control">
                                <option value="">All</option>
                                <option value="Y">Enabled</option>
                                <option value="N">Disabled</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-6 col-sm-12 d-flex align-items-end">
                        <div class="form-group mb-0">
                            <button type="button" class="btn btn-primary btn-sm" onclick="applyManageCronFilters()">
                                <i class="fa fa-search"></i> Apply
                            </button>
                            <button type="button" class="btn btn-outline-secondary btn-sm" onclick="clearManageCronFilters()">
                                <i class="fa fa-times"></i> Clear
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>

    <!-- Crons table -->
    <div class="main-card mb-3 card">
        <div class="card-body">
            <div class="table-responsive">
                <table id="manageCronTable" class="table table-hover table-striped table-bordered w-100"></table>
            </div>
        </div>
    </div>

    ${getRunModalHtml()}
    ${getLogsModalHtml()}
    ${getLogDetailModalHtml()}
    `;
}

function statCard(id, label, icon, color) {
    return `
    <div class="col-md-3 col-sm-6">
        <div class="card mb-3 widget-content">
            <div class="widget-content-wrapper">
                <div class="widget-content-left mr-3">
                    <i class="fa ${icon} fa-2x" style="color:${color};"></i>
                </div>
                <div class="widget-content-left">
                    <div class="widget-heading">${label}</div>
                    <div class="widget-numbers" id="${id}">-</div>
                </div>
            </div>
        </div>
    </div>`;
}

/* ----- Guarded execute modal ----- */
function getRunModalHtml() {
    return `
    <div class="modal fade" id="cronRunModal" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title"><i class="fa fa-exclamation-triangle text-danger mr-2"></i>Run cron manually?</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span>&times;</span></button>
          </div>
          <div class="modal-body">
            <p class="mb-2">You are about to manually trigger
                <b><span id="cronRunName"></span></b> on the <b><span id="cronRunEnv"></span></b> server.
                It runs immediately and is logged against your account.</p>
            <div id="cronRunParamsWrap" class="form-group" style="display:none;">
                <label>Query parameters <small class="text-muted">(optional, e.g. <code>dryRun=true&limit=100</code>)</small></label>
                <input type="text" id="cronRunParams" class="form-control" placeholder="key=value&key2=value2">
            </div>
            <div class="form-group mb-1">
                <label>To confirm, type <b>Execute Cron</b> below</label>
                <input type="text" id="cronConfirmText" class="form-control" autocomplete="off"
                    placeholder="Execute Cron" oninput="validateCronConfirm()">
            </div>
            <div id="cronRunError" class="text-danger small" style="display:none;"></div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary btn-sm" data-dismiss="modal">Cancel</button>
            <button type="button" id="cronRunExecuteBtn" class="btn btn-danger btn-sm" disabled onclick="submitCronRun()">
                <i class="fa fa-play mr-1"></i>Execute
            </button>
          </div>
        </div>
      </div>
    </div>`;
}

/* ----- Run-logs modal (nested DataTable) ----- */
function getLogsModalHtml() {
    return `
    <div class="modal fade" id="cronLogsModal" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title"><i class="fa fa-history mr-2"></i>Run logs<span id="cronLogsTitleSuffix"></span></h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span>&times;</span></button>
          </div>
          <div class="modal-body">
            <div class="table-responsive">
              <table id="cronRunLogTable" class="table table-hover table-striped table-bordered w-100"></table>
            </div>
          </div>
        </div>
      </div>
    </div>`;
}

/* ----- Single run-log detail modal ----- */
function getLogDetailModalHtml() {
    return `
    <div class="modal fade" id="cronLogDetailModal" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title"><i class="fa fa-file-text-o mr-2"></i>Run detail</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span>&times;</span></button>
          </div>
          <div class="modal-body" id="cronLogDetailBody"></div>
        </div>
      </div>
    </div>`;
}

function getCronLogDetailHtml(d) {
    return `
    <table class="table table-sm table-bordered mb-2">
        <tr><th style="width:180px;">Cron</th><td>${escapeHtml(d.displayName || d.cronKey)}<br><code>${escapeHtml(d.cronKey)}</code></td></tr>
        <tr><th>Status</th><td>${getCronStatusBadge(d.status)}</td></tr>
        <tr><th>Triggered by</th><td>${getTriggeredByBadge(d.triggeredBy)} ${escapeHtml(d.userName || '')}</td></tr>
        <tr><th>Environment / IP</th><td>${escapeHtml(d.environment || '-')} / ${escapeHtml(d.clientIp || '-')}</td></tr>
        <tr><th>Params</th><td>${d.requestParams ? '<code>' + escapeHtml(d.requestParams) + '</code>' : '-'}</td></tr>
        <tr><th>Started</th><td>${escapeHtml(d.startedAt || '-')}</td></tr>
        <tr><th>Finished</th><td>${escapeHtml(d.finishedAt || '-')}</td></tr>
        <tr><th>Duration</th><td>${d.durationMs != null ? d.durationMs + ' ms' : '-'}</td></tr>
        <tr><th>HTTP status</th><td>${d.httpStatus != null ? d.httpStatus : '-'}</td></tr>
    </table>
    ${d.errorMessage ? '<div class="alert alert-danger py-2"><b>Error:</b> ' + escapeHtml(d.errorMessage) + '</div>' : ''}
    <label class="mb-1"><b>Response</b></label>
    <pre style="max-height:280px; overflow:auto; background:var(--light); padding:10px; border-radius:4px;">${d.responseSnippet ? escapeHtml(d.responseSnippet) : '(no response captured)'}</pre>`;
}

function getCronStatusBadge(status) {
    switch ((status || '').toUpperCase()) {
        case 'SUCCESS': return '<span class="badge badge-success">Success</span>';
        case 'FAILED':  return '<span class="badge badge-danger">Failed</span>';
        case 'RUNNING': return '<span class="badge badge-warning">Running</span>';
        default:        return '<span class="badge badge-secondary">' + escapeHtml(status || 'Never run') + '</span>';
    }
}

function getTriggeredByBadge(by) {
    if ((by || '').toUpperCase() === 'USER') {
        return '<span class="badge badge-info"><i class="fa fa-user mr-1"></i>User</span>';
    }
    if ((by || '').toUpperCase() === 'SYSTEM') {
        return '<span class="badge badge-secondary"><i class="fa fa-server mr-1"></i>System</span>';
    }
    return '-';
}

/* Reuse a global escapeHtml if another module already defined one; otherwise
   provide ours. Assigned on window to avoid a duplicate top-level declaration. */
window.escapeHtml = window.escapeHtml || function (str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
};
