/**
 * Class Quality (Teacher Management) — page shell and templates.
 * Logic lives in classQuality.js. Colours come only from the per-school theme (ROOTCSS --pc/--sc/--plc)
 * and the base status variables (--success/--warning/--danger, Bootstrap --orange).
 */

async function renderClassQuality(title, roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE) {
    try {
        $('#dashboardContentInHTML').html(getClassQualityContent(title));
        cqInit();
    } catch (err) {
        if (typeof SMSErrorLogger !== 'undefined') {
            SMSErrorLogger.log({
                errorType: err.name || 'renderClassQualityError',
                errorMessage: err.message,
                stackTrace: err.stack,
                pageNo: 'class-quality'
            });
        }
        console.error('renderClassQuality error:', err);
    }
}

function getClassQualityContent(title) {
    return `
    ${cqStyles()}
    <div id="cqRoot">
    <div class="app-page-title mb-3 py-2">
        <div class="page-title-wrapper">
            <div class="page-title-heading">
                <div class="page-title-icon"><i class="fa fa-check-square-o" style="color: var(--pc);"></i></div>
                <div>${cqEsc(title)}
                    <div class="page-title-subheading">Session quality from LENS, plus our attendance rules</div>
                </div>
            </div>
            <div class="page-title-actions cq-range" id="cqRangeBar">
                <div class="btn-group btn-group-sm mr-2" role="group" aria-label="Date range">
                    <button type="button" class="btn btn-outline-primary active" data-days="7" onclick="cqSetDays(7, this)">7D</button>
                    <button type="button" class="btn btn-outline-primary" data-days="15" onclick="cqSetDays(15, this)">15D</button>
                    <button type="button" class="btn btn-outline-primary" data-days="30" onclick="cqSetDays(30, this)">30D</button>
                </div>
                <label class="sr-only" for="cqFrom">From</label>
                <input type="date" id="cqFrom" class="form-control form-control-sm cq-date" onchange="cqCustomRange()">
                <span class="mx-1 text-muted">to</span>
                <label class="sr-only" for="cqTo">To</label>
                <input type="date" id="cqTo" class="form-control form-control-sm cq-date" onchange="cqCustomRange()">
            </div>
        </div>
    </div>

    <div id="cqBanner"></div>

    <div id="cqMain">
        <ul class="nav nav-tabs cq-tabs mb-3" role="tablist">
            <li class="nav-item"><a class="nav-link active" href="javascript:void(0)" data-tab="overview" onclick="cqTab('overview')">Overview</a></li>
            <li class="nav-item"><a class="nav-link" href="javascript:void(0)" data-tab="sessions" onclick="cqTab('sessions')">Sessions</a></li>
            <li class="nav-item"><a class="nav-link" href="javascript:void(0)" data-tab="teachers" onclick="cqTab('teachers')">Teacher reports</a></li>
            <li class="nav-item"><a class="nav-link" href="javascript:void(0)" data-tab="settings" onclick="cqTab('settings')">Settings</a></li>
        </ul>

        <div class="cq-pane" id="cqPane-overview"></div>

        <div class="cq-pane" id="cqPane-sessions" hidden>
            <div class="main-card mb-3 card">
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-2 col-sm-6 form-group">
                            <label for="cqFHealth">Health</label>
                            <select id="cqFHealth" class="form-control form-control-sm">
                                <option value="">All</option>
                                <option value="HEALTHY">Healthy</option>
                                <option value="QUICK_MONITORING">Quick monitoring</option>
                                <option value="REVIEW_RECOMMENDED">Review recommended</option>
                                <option value="CRITICAL">Critical</option>
                            </select>
                        </div>
                        <div class="col-md-2 col-sm-6 form-group">
                            <label for="cqFReview">Review</label>
                            <select id="cqFReview" class="form-control form-control-sm">
                                <option value="">All</option>
                                <option value="PENDING">Not reviewed</option>
                                <option value="REVIEWED">Reviewed</option>
                                <option value="REJECTED">Rejected</option>
                                <option value="ESCALATED">Escalated</option>
                            </select>
                        </div>
                        <div class="col-md-2 col-sm-6 form-group">
                            <label for="cqFKind">Session kind</label>
                            <select id="cqFKind" class="form-control form-control-sm">
                                <option value="">All</option>
                                ${Object.keys(CQ_KINDS).map(k => `<option value="${k}">${CQ_KINDS[k]}</option>`).join('')}
                            </select>
                        </div>
                        <div class="col-md-2 col-sm-6 form-group">
                            <label for="cqFAnalysis">Checked by</label>
                            <select id="cqFAnalysis" class="form-control form-control-sm">
                                <option value="">All</option>
                                <option value="ANALYSED">AI scores</option>
                                <option value="RULES">Attendance only</option>
                                <option value="PENDING">Not checked yet</option>
                            </select>
                        </div>
                        <div class="col-md-2 col-sm-6 form-group">
                            <label for="cqFFlag">Flag</label>
                            <select id="cqFFlag" class="form-control form-control-sm">
                                <option value="">Any</option>
                                ${Object.keys(CQ_FLAGS).map(k => `<option value="${k}">${CQ_FLAGS[k]}</option>`).join('')}
                            </select>
                        </div>
                        <div class="col-md-2 col-sm-6 form-group">
                            <label for="cqFTag">Reviewer tag</label>
                            <select id="cqFTag" class="form-control form-control-sm"><option value="">Any</option></select>
                        </div>
                    </div>
                    <div class="d-flex flex-wrap align-items-center" style="gap:12px">
                        <div class="custom-control custom-checkbox">
                            <input type="checkbox" class="custom-control-input" id="cqFBookmarked">
                            <label class="custom-control-label" for="cqFBookmarked"><i class="fa fa-star text-warning"></i> Only my bookmarks</label>
                        </div>
                        <button type="button" class="btn btn-primary btn-sm" onclick="cqReloadSessions()"><i class="fa fa-search"></i> Apply</button>
                        <button type="button" class="btn btn-outline-secondary btn-sm cq-edit-only" onclick="cqExport()"><i class="fa fa-download"></i> Export</button>
                    </div>
                    <div id="cqTeacherFilterNote" class="small text-muted" hidden></div>
                </div>
            </div>
            <div class="main-card mb-3 card">
                <div class="card-body cq-table-wrap">
                    <table id="cqSessionsTable" class="table table-hover table-striped table-bordered w-100"></table>
                </div>
            </div>
        </div>

        <div class="cq-pane" id="cqPane-teachers" hidden></div>
        <div class="cq-pane" id="cqPane-settings" hidden></div>
    </div>

    <div id="cqDetail" hidden></div>
    </div>

    <div class="modal fade" id="cqReviewModal" tabindex="-1" role="dialog" aria-labelledby="cqReviewTitle" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="cqReviewTitle">Review</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                </div>
                <div class="modal-body">
                    <p id="cqReviewHelp" class="text-muted small mb-2"></p>
                    <label for="cqReviewReason">Reason</label>
                    <textarea id="cqReviewReason" class="form-control" rows="4" maxlength="1000"></textarea>
                    <div id="cqReviewError" class="text-danger small mt-2" hidden></div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" id="cqReviewSave" onclick="cqSubmitReview()">Save</button>
                </div>
            </div>
        </div>
    </div>`;
}

function cqStyles() {
    return `<style>
    #cqRoot { --cq-healthy: var(--success, green); --cq-quick: var(--warning, #f7b924); --cq-review: var(--orange, #fd7e14); --cq-critical: var(--danger, #d92550); }
    #cqRoot .cq-range { display: flex; align-items: center; flex-wrap: wrap; gap: 4px; }
    #cqRoot .cq-date { width: 150px; }
    #cqRoot .cq-tabs .nav-link { color: var(--gray, #6c757d); font-weight: 500; }
    #cqRoot .cq-tabs .nav-link.active { color: var(--pc); border-bottom: 2px solid var(--pc); }
    #cqRoot .cq-cards { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; margin-bottom: 16px; }
    @media (max-width: 991px) { #cqRoot .cq-cards { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
    @media (max-width: 575px) { #cqRoot .cq-cards { grid-template-columns: minmax(0, 1fr); } }
    #cqRoot .cq-card { background: #fff; border: 1px solid #dee2e6; border-left: 3px solid var(--cq-c); border-radius: .25rem; padding: 14px 16px; }
    #cqRoot .cq-card .cq-num { font-size: 28px; font-weight: 700; color: var(--cq-c); font-variant-numeric: tabular-nums; }
    #cqRoot .cq-card .cq-of { font-size: 13px; color: var(--gray, #6c757d); margin-left: 4px; }
    #cqRoot .cq-card .cq-lbl { font-weight: 600; color: var(--cq-c); }
    #cqRoot .cq-card .cq-sub { font-size: 12px; color: var(--gray, #6c757d); }
    #cqRoot .cq-grid2 { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; margin-bottom: 16px; }
    @media (max-width: 767px) { #cqRoot .cq-grid2 { grid-template-columns: minmax(0, 1fr); } }
    #cqRoot .cq-grid2 > .card { margin: 0; min-width: 0; }
    #cqRoot .cq-pill { display: inline-block; padding: 2px 9px; border-radius: 10px; font-size: 11px; font-weight: 600; color: #fff; background: var(--cq-c); white-space: nowrap; }
    #cqRoot .cq-pill.cq-quick { color: #212529; }
    #cqRoot .cq-healthy { --cq-c: var(--cq-healthy); }
    #cqRoot .cq-quick { --cq-c: var(--cq-quick); }
    #cqRoot .cq-review { --cq-c: var(--cq-review); }
    #cqRoot .cq-critical { --cq-c: var(--cq-critical); }
    #cqRoot .cq-pending { --cq-c: var(--gray, #6c757d); }
    #cqRoot .cq-flag { display: inline-block; padding: 1px 7px; margin: 1px 2px 1px 0; border-radius: 4px; font-size: 11px; background: var(--plc); color: var(--sc); }
    #cqRoot .cq-score { font-weight: 700; font-variant-numeric: tabular-nums; }
    #cqRoot .cq-score.good { color: var(--cq-healthy); } #cqRoot .cq-score.mid { color: #9a6b00; } #cqRoot .cq-score.bad { color: var(--cq-critical); }
    #cqRoot .cq-dist { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; font-size: 12px; }
    #cqRoot .cq-dist .cq-bar { flex: 1; height: 12px; background: var(--light, #eee); border-radius: 6px; overflow: hidden; min-width: 0; }
    #cqRoot .cq-dist .cq-bar > span { display: block; height: 100%; background: var(--cq-c); }
    #cqRoot .cq-row { display: flex; justify-content: space-between; align-items: center; padding: 7px 0; border-bottom: 1px solid #f0f0f0; gap: 8px; }
    #cqRoot .cq-row:last-child { border-bottom: 0; }
    #cqRoot .cq-detail { display: grid; grid-template-columns: minmax(0, 55%) minmax(0, 45%); gap: 16px; }
    @media (max-width: 991px) { #cqRoot .cq-detail { grid-template-columns: minmax(0, 1fr); } }
    #cqRoot .cq-detail > div { min-width: 0; }
    #cqRoot .cq-video { background: #111; border-radius: .25rem; aspect-ratio: 16 / 9; width: 100%; max-width: 100%; display: flex; align-items: center; justify-content: center; color: #bbb; }
    #cqRoot .cq-video video { width: 100%; height: 100%; border-radius: .25rem; }
    #cqRoot .cq-hl { display: flex; gap: 6px; overflow-x: auto; padding: 8px 0; }
    #cqRoot .cq-hl button { flex: 0 0 auto; max-width: 180px; text-align: left; font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    #cqRoot .cq-big { font-size: 52px; font-weight: 700; line-height: 1; font-variant-numeric: tabular-nums; color: var(--cq-c); }
    #cqRoot .cq-metric { padding: 12px 0; border-bottom: 1px solid #f0f0f0; }
    #cqRoot .cq-metric:last-child { border-bottom: 0; }
    #cqRoot .cq-metric .cq-analysis { font-size: 13px; color: #495057; margin-top: 4px; line-height: 1.55; }
    #cqRoot .cq-flagged { font-size: 10px; font-weight: 700; letter-spacing: .5px; padding: 2px 6px; border-radius: 4px; background: var(--cq-critical); color: #fff; }
    #cqRoot .cq-chip { font-size: 10px; font-weight: 600; padding: 1px 6px; border-radius: 4px; background: var(--light, #eee); color: var(--gray, #6c757d); }
    #cqRoot .cq-chip.ai { background: var(--plc); color: var(--pc); }
    #cqRoot .cq-chip.rule { background: var(--slc, #f9f3fb); color: var(--sc); border: 1px solid #dee2e6; }
    #cqRoot .cq-cat { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--sc); border-bottom: 2px solid var(--pc); padding-bottom: 4px; margin: 18px 0 6px; }
    #cqRoot .cq-up { color: var(--cq-healthy); } #cqRoot .cq-down { color: var(--cq-critical); }
    #cqRoot .cq-table-wrap { overflow-x: auto; }
    #cqRoot .cq-weight { width: 80px; }
    #cqRoot .cq-skel { color: var(--gray, #6c757d); padding: 24px; text-align: center; }
    #cqRoot .cq-dtabs { margin-top: 12px; }
    #cqRoot .cq-dtabs .nav-link { color: var(--gray, #6c757d); font-weight: 500; padding: 6px 12px; }
    #cqRoot .cq-dtabs .nav-link.active { color: var(--pc); border-bottom: 2px solid var(--pc); }
    #cqRoot .cq-dpane { background: #fff; border: 1px solid #dee2e6; border-top: 0; border-radius: 0 0 .25rem .25rem; padding: 12px 16px; margin-bottom: 16px; }
    #cqRoot .cq-fact { display: flex; justify-content: space-between; gap: 12px; padding: 7px 0; border-bottom: 1px solid #f0f0f0; }
    #cqRoot .cq-fact:last-child { border-bottom: 0; }
    #cqRoot .cq-fact b { font-variant-numeric: tabular-nums; text-align: right; }
    #cqRoot .cq-hlist { display: flex; gap: 10px; padding: 10px 0; border-bottom: 1px solid #f0f0f0; align-items: flex-start; }
    #cqRoot .cq-hlist:last-child { border-bottom: 0; }
    #cqRoot .cq-hlist .btn { flex: 0 0 auto; }
    #cqRoot .cq-hlist > div { min-width: 0; flex: 1; }
    #cqRoot .cq-transcript { max-height: 420px; overflow-y: auto; }
    #cqRoot .cq-tline { padding: 4px 6px; border-radius: 4px; font-size: 13px; line-height: 1.5; overflow-wrap: anywhere; }
    #cqRoot .cq-tline.t { background: var(--plc); }
    #cqRoot .cq-tline a { font-variant-numeric: tabular-nums; margin-right: 6px; }
    #cqRoot .cq-headline { font-weight: 600; color: var(--sc); }
    #cqRoot .cq-star { background: none; border: 1px solid #dee2e6; border-radius: .25rem; padding: 3px 10px; color: var(--gray, #6c757d); font-size: 13px; }
    #cqRoot .cq-star.on { color: #9a6b00; border-color: var(--warning, #f7b924); background: #fff8e1; }
    #cqRoot .cq-star-mark { color: var(--warning, #f7b924); margin-right: 4px; }
    #cqRoot .cq-open { font-size: 11px; font-weight: 700; letter-spacing: .5px; padding: 2px 8px; border-radius: 10px; background: #fdecef; color: var(--cq-critical); }
    #cqRoot .cq-tag { display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; margin: 2px 4px 2px 0; border-radius: 12px; font-size: 12px; background: var(--plc); color: var(--sc); border: 1px solid #dee2e6; }
    #cqRoot .cq-tag.esc { background: #fff3e0; color: #8a4b00; border-color: var(--orange, #fd7e14); }
    #cqRoot .cq-tag button { border: 0; background: none; padding: 0 0 0 2px; line-height: 1; color: inherit; font-size: 14px; }
    #cqRoot .cq-nt { text-decoration: line-through; opacity: .6; }
    #cqRoot .cq-ntnote { font-size: 12px; color: var(--gray, #6c757d); }
    #cqRoot .cq-ntbtn { font-size: 11px; padding: 1px 8px; }
    #cqRoot .cq-verdict { border-top: 3px solid var(--pc); }
    #cqRoot .cq-activity { font-size: 12px; padding: 5px 0; border-bottom: 1px solid #f0f0f0; overflow-wrap: anywhere; }
    #cqRoot .cq-activity:last-child { border-bottom: 0; }
    #cqRoot .cq-clipform { background: var(--light, #f8f9fa); border: 1px solid #dee2e6; border-radius: .25rem; padding: 10px; margin-top: 8px; }
    #cqRoot .cq-clipform input[type=text].cq-time { width: 80px; display: inline-block; }
    #cqRoot .cq-subhead { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--gray, #6c757d); margin: 14px 0 2px; }
    </style>`;
}

function cqEsc(v) {
    if (v === null || v === undefined) return '';
    return String(v).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
}

var CQ_HEALTH = {
    HEALTHY: { label: 'Healthy', cls: 'cq-healthy', desc: 'No flags' },
    QUICK_MONITORING: { label: 'Quick monitoring', cls: 'cq-quick', desc: '1–2 flags' },
    REVIEW_RECOMMENDED: { label: 'Review recommended', cls: 'cq-review', desc: '3+ flags' },
    CRITICAL: { label: 'Critical', cls: 'cq-critical', desc: 'Severe flag present' }
};

var CQ_REVIEW = { PENDING: 'Not reviewed', REVIEWED: 'Reviewed', REJECTED: 'Rejected', ESCALATED: 'Escalated' };

/* How each line of a session's review trail reads. */
var CQ_ACTIVITY = {
    NOTE: 'added a note', TAG_ADDED: 'tagged', TAG_REMOVED: 'removed the tag', NOT_TRUE: 'marked not true',
    NOT_TRUE_UNDONE: 'removed the not-true mark on', CLIP_ADDED: 'added a clip', CLIP_REMOVED: 'removed the clip',
    REVIEWED: 'marked it reviewed', REJECTED: 'rejected the evaluation', ESCALATED: 'escalated it', REOPENED: 'reopened it',
    SCORE_EDITED: 'edited a score'
};

/* Sessions "Flag" filter. Keys mirror the flag types in ClassQualityDashboardService.FLAG_LABELS. */
var CQ_FLAGS = {
    NO_STUDENT_JOINED: 'No student joined', SHORT_SESSION: 'Short session', TEACHER_LATE: 'Teacher late',
    LATE_ENTRY: 'Late entry', DROP_OFF: 'Drop-off', MULTIPLE_DEVICES: 'Multiple devices',
    STUDENT_CAMERA_OFF: 'Student camera off', PERSONAL_CONTACT: 'Personal contact shared',
    STUDENT_MISCONDUCT: 'Student misconduct', FLAGGED_METRIC: 'Any flagged metric'
};

/* Mirrors ClassQualityKinds.LABELS. */
var CQ_KINDS = { ONE_TO_ONE: '1:1 class', CUSTOM: 'Custom class', GROUP: 'Group class', DEMO: 'Demo', PTM: 'Parent–teacher meeting', ACTIVITY: 'Activity' };

var CQ_CATEGORY = {
    RELATIONSHIP: 'Relationship & conduct', ENGAGEMENT: 'Engagement & participation', INSTRUCTION: 'Instruction',
    STRUCTURE: 'Structure & objectives', HYGIENE: 'Hygiene & readiness', DEMO_CONVERSION: 'Demo conversion'
};

function cqHealthPill(health, analysis) {
    if (analysis === 'PENDING') return '<span class="cq-pill cq-pending">Not checked yet</span>';
    var h = CQ_HEALTH[health];
    if (!h) return '<span class="text-muted">—</span>';
    return '<span class="cq-pill ' + h.cls + '">' + h.label + '</span>' +
        (analysis === 'RULES' ? '<div class="small text-muted">attendance only</div>' : '');
}

function cqScoreHtml(score, scale) {
    if (score === null || score === undefined) return '<span class="text-muted">—</span>';
    var n = Number(score), pct = scale === 10 ? n * 10 : n;
    var cls = pct >= 75 ? 'good' : pct >= 60 ? 'mid' : 'bad';
    return '<span class="cq-score ' + cls + '">' + (scale === 10 ? n.toFixed(1) : Math.round(n)) + '</span>';
}

function cqChange(change, suffix) {
    if (change === null || change === undefined) return '<span class="text-muted">—</span>';
    var n = Number(change);
    if (n === 0) return '<span class="text-muted">no change</span>';
    var up = n > 0;
    return '<span class="' + (up ? 'cq-up' : 'cq-down') + '"><i class="fa fa-arrow-' + (up ? 'up' : 'down') + '"></i> ' +
        Math.abs(n).toFixed(1) + (suffix || '') + '</span>';
}
