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
                <div class="page-title-icon"><i class="pe-7s-video text-primary"></i></div>
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
            <li class="nav-item"><a class="nav-link" href="javascript:void(0)" data-tab="camera" onclick="cqTab('camera')"><i class="fa fa-video-camera mr-1"></i>AI Insights</a></li>
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
        <div class="cq-pane" id="cqPane-camera" hidden></div>
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
    #cqRoot .cq-vc-head { font-size: 15px; font-weight: 600; margin-bottom: 6px; }
    #cqRoot .cq-vc-intro { border: 1px dashed #ced4da; border-radius: .5rem; padding: 16px 18px; margin-top: 4px; }
    #cqRoot .cq-vc-saved { font-size: 11px; font-weight: 600; padding: 3px 9px; border-radius: 10px; background: #e7f6ef; color: #0f6e56; white-space: nowrap; }
    #cqRoot .cq-vc-tiles { display: grid; grid-template-columns: repeat(auto-fit, minmax(125px, 1fr)); gap: 10px; margin-bottom: 18px; }
    #cqRoot .cq-vc-tile { display: flex; align-items: center; gap: 10px; background: var(--light, #f8f9fa); border-radius: .5rem; padding: 10px 12px; min-width: 0; }
    #cqRoot .cq-vc-tile svg { flex: none; }
    #cqRoot .cq-vc-tile .n { font-size: 24px; font-weight: 700; line-height: 1.15; font-variant-numeric: tabular-nums; }
    #cqRoot .cq-vc-tile .l { font-size: 12px; font-weight: 400; color: var(--gray, #6c757d); }
    #cqRoot .cq-vc-grid { display: grid; grid-template-columns: minmax(170px, 230px) minmax(0, 1fr) 150px; gap: 14px; align-items: center; }
    #cqRoot .cq-vc-row { padding: 10px 0; border-top: 1px solid #eef0f3; }
    #cqRoot .cq-vc-av { width: 34px; height: 34px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; flex: none; font-size: 12px; font-weight: 700; background: #eef0f3; color: #495057; }
    #cqRoot .cq-vc-av.t { background: var(--plc); color: var(--pc); }
    #cqRoot .cq-vc-cells { display: flex; gap: 2px; }
    #cqRoot .cq-vc-cell { flex: 1; min-width: 3px; height: 18px; padding: 0; border: 0; border-radius: 2px; cursor: pointer; }
    #cqRoot .cq-vc-cell:hover, #cqRoot .cq-vc-cell:focus { outline: 2px solid #343a40; outline-offset: 1px; }
    #cqRoot .cq-vc-cell.o, #cqRoot .cq-vc-key i.o { background: #1d9e75; }
    #cqRoot .cq-vc-cell.x, #cqRoot .cq-vc-key i.x { background: #d85a30; }
    #cqRoot .cq-vc-cell.u, #cqRoot .cq-vc-key i.u { background: #ef9f27; }
    #cqRoot .cq-vc-cell.a, #cqRoot .cq-vc-key i.a { background: #f1f3f5; box-shadow: inset 0 0 0 1px #dfe3e8; }
    #cqRoot .cq-vc-pct { font-size: 18px; font-weight: 700; font-variant-numeric: tabular-nums; color: var(--cq-c); }
    #cqRoot .cq-vc-bgbar { display: flex; height: 6px; border-radius: 3px; overflow: hidden; background: #f1f3f5; margin: 4px 0 2px; }
    #cqRoot .cq-vc-bgbar .v, #cqRoot .cq-vc-key i.v { background: #534ab7; }
    #cqRoot .cq-vc-bgbar .b, #cqRoot .cq-vc-key i.b { background: #7f77dd; }
    #cqRoot .cq-vc-bgbar .r, #cqRoot .cq-vc-key i.r { background: #afa9ec; }
    #cqRoot .cq-vc-key i { display: inline-block; width: 10px; height: 10px; border-radius: 2px; margin: 0 4px 0 12px; vertical-align: -1px; }
    #cqRoot .cq-vc-det { background: var(--light, #f8f9fa); border-radius: .5rem; padding: 8px 12px; margin-top: 10px; font-size: 13px; }
    @media (max-width: 767px) { #cqRoot .cq-vc-grid { grid-template-columns: 1fr; } }
    #cqRoot .cq-range select { min-width: 130px; }
    #cqRoot .cq-range input[type=date] { width: 150px; }
    #cqRoot .cq-ms { position: relative; }
    #cqRoot .cq-ms-btn { min-width: 170px; display: flex; align-items: center; justify-content: space-between; gap: 8px; text-align: left; background: #fff; }
    #cqRoot .cq-ms-panel { position: absolute; top: 100%; left: 0; z-index: 20; margin-top: 4px; min-width: 220px; background: #fff; border: 1px solid #dee2e6; border-radius: .4rem; box-shadow: 0 6px 18px rgba(0,0,0,.08); padding: 6px; }
    #cqRoot .cq-ms-panel label { display: flex; align-items: center; gap: 8px; padding: 6px 8px; margin: 0; border-radius: .3rem; cursor: pointer; font-size: 13px; font-weight: 400; }
    #cqRoot .cq-ms-panel label:hover { background: var(--light, #f8f9fa); }
    #cqRoot .cq-ms-foot { display: flex; justify-content: space-between; border-top: 1px solid #eef0f3; margin-top: 4px; padding: 6px 8px 2px; font-size: 12px; }
    #cqRoot .cq-cam-filters { display: flex; flex-wrap: wrap; gap: 12px; align-items: flex-end; }
    #cqRoot .cq-cam-filters label.small { display: block; margin-bottom: 2px; color: var(--gray, #6c757d); }
    #cqRoot .cq-cam-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 10px; margin: 14px 0; }
    #cqRoot .cq-cam-stat { background: var(--light, #f8f9fa); border-radius: .5rem; padding: 10px 14px; }
    #cqRoot .cq-cam-stat .n { font-size: 22px; font-weight: 700; line-height: 1.2; font-variant-numeric: tabular-nums; }
    #cqRoot .cq-cam-cost { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); border: 1px solid #e2e5e9; border-radius: .5rem; overflow: hidden; margin-bottom: 14px; background: #fff; }
    #cqRoot .cq-cam-cost > div { padding: 12px 16px; border-right: 1px solid #e2e5e9; }
    #cqRoot .cq-cam-cost > div:last-child { border-right: 0; }
    #cqRoot .cq-cam-cost .n { font-size: 22px; font-weight: 700; font-variant-numeric: tabular-nums; }
    #cqRoot .cq-cam-run { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; border: 1px solid #e2e5e9; border-radius: .5rem; padding: 12px 16px; margin-bottom: 14px; background: #fff; }
    #cqRoot .cq-cam-badge { font-size: 11px; font-weight: 600; padding: 2px 9px; border-radius: 10px; white-space: nowrap; }
    #cqRoot .cq-cam-badge.SAVED { background: #e7f6ef; color: #0f6e56; }
    #cqRoot .cq-cam-badge.CHECKING { background: #fff4de; color: #8a5a00; }
    #cqRoot .cq-cam-badge.NOT_CHECKED { background: #eef0f3; color: #495057; }
    #cqRoot .cq-cam-badge.FAILED { background: #fdecef; color: var(--cq-critical); }
    #cqRoot .cq-cam-badge.NO_VIDEO { background: #f6f6f6; color: #868e96; }
    #cqRoot .cq-cam-table td, #cqRoot .cq-cam-table th { vertical-align: middle; }
    #cqRoot .cq-in-card { border: 1px solid #e2e5e9; border-radius: .5rem; padding: 12px 16px; margin-bottom: 14px; background: #fff; }
    #cqRoot .cq-in-title { font-size: 14px; font-weight: 600; margin-bottom: 8px; }
    #cqRoot .cq-in-list { list-style: none; padding: 0; margin: 0; }
    #cqRoot .cq-in-list li { display: flex; gap: 10px; padding: 5px 0; border-bottom: 1px solid #f0f0f0; font-size: 13px; overflow-wrap: anywhere; }
    #cqRoot .cq-in-list li:last-child { border-bottom: 0; }
    #cqRoot .cq-in-at { flex: none; font-variant-numeric: tabular-nums; white-space: nowrap; }
    #cqRoot .cq-in-bar { height: 6px; border-radius: 3px; overflow: hidden; background: #f1f3f5; margin: 4px 0 2px; }
    #cqRoot .cq-in-bar span { display: block; height: 100%; background: var(--pc); }
    #cqRoot .cq-in-strip { position: relative; height: 22px; border-radius: 4px; background: #f1f3f5; overflow: hidden; margin: 4px 0 2px; }
    #cqRoot .cq-in-strip button { position: absolute; top: 0; bottom: 0; padding: 0; border: 0; border-right: 1px solid #fff; cursor: pointer; }
    #cqRoot .cq-in-strip button:hover, #cqRoot .cq-in-strip button:focus { outline: 2px solid #343a40; outline-offset: -2px; }
    #cqRoot .cq-in-k-SLIDES { background: #534ab7; }
    #cqRoot .cq-in-k-WHITEBOARD { background: #1d9e75; }
    #cqRoot .cq-in-k-DOCUMENT { background: #378add; }
    #cqRoot .cq-in-k-VIDEO { background: #ef9f27; }
    #cqRoot .cq-in-k-OTHER { background: #868e96; }
    #cqRoot .cq-in-k-NOTHING { background: #e9ecef; }
    #cqRoot .cq-in-ans { color: var(--cq-healthy); margin-top: 2px; }
    #cqRoot .cq-in-cost { font-size: 12px; color: var(--gray, #6c757d); white-space: nowrap; font-variant-numeric: tabular-nums; }
    @media (max-width: 767px) { #cqRoot .cq-vc-grid[style] { grid-template-columns: 1fr !important; } }
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
