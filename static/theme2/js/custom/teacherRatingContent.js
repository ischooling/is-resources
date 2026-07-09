/* ============================================================================
   Teacher Rating — page templates
   - getTeacherRatingPageContent     → LIST page (#dashboardContentInHTML)
   - getTeacherRatingDetailPageContent → DETAIL page (#dashboardContentInHTMLAdditional)
   ========================================================================== */

function getTeacherRatingPageContent(title) {
    return `
    <div class="custom-field-scope">
    <div class="app-page-title mb-3 py-2">
        <div class="page-title-wrapper">
            <div class="page-title-heading">
                <div class="page-title-icon">
                    <i class="fa fa-star text-primary"></i>
                </div>
                <div><span class="text-primary welcome-name-text">${title}</span></div>
            </div>
        </div>
    </div>

    <!-- ====================== FILTERS ====================== -->
    <div class="card shadow-sm mb-3">
        <div class="card-body">
            <div class="row align-items-end">
                <div class="col-md-3 mb-2">
                    <div class="form-group custom-field mb-0">
                        <select class="form-control" id="trFilterPeriodId"></select>
                        <label class="font-weight-bold mb-1">Evaluation Period</label>
                    </div>
                </div>
                <div class="col-md-2 mb-2">
                    <div class="form-group custom-field mb-0">
                        <select class="form-control" id="trFilterDateRange">
                            <option value="full" selected>Full Period</option>
                            <option value="today">Today</option>
                            <option value="yesterday">Yesterday</option>
                            <option value="thismonth">This Month</option>
                            <option value="custom">Custom</option>
                        </select>
                        <label class="font-weight-bold mb-1">Date Range</label>
                    </div>
                </div>
                <div class="col-md-2 mb-2 trCustomDateWrap" style="display:none">
                    <div class="form-group custom-field mb-0">
                        <input type="text" class="form-control" id="trFilterStartDate" placeholder="Start date" autocomplete="off" readonly>
                        <label class="font-weight-bold mb-1">Start Date</label>
                    </div>
                </div>
                <div class="col-md-2 mb-2 trCustomDateWrap" style="display:none">
                    <div class="form-group custom-field mb-0">
                        <input type="text" class="form-control" id="trFilterEndDate" placeholder="End date" autocomplete="off" readonly>
                        <label class="font-weight-bold mb-1">End Date</label>
                    </div>
                </div>
                <div class="col-md-2 mb-2">
                    <div class="form-group custom-field mb-0">
                        <select class="form-control" id="trFilterEligibility">
                            <option value="All">All</option>
                            <option value="Eligible">Eligible</option>
                            <option value="NotEligible">Not Eligible</option>
                        </select>
                        <label class="font-weight-bold mb-1">Eligibility</label>
                    </div>
                </div>
                <div class="col-md-2 mb-2">
                    <div class="form-group custom-field mb-0">
                        <input type="text" class="form-control" id="trFilterSearch" placeholder="Teacher name" autocomplete="off">
                        <label class="font-weight-bold mb-1">Teacher Name</label>
                    </div>
                </div>
                <div class="col-12 col-md-auto mb-2">
                    <button class="btn btn-success btn-lg mr-2" onclick="applyTeacherRatingFilter()"><i class="fa fa-search mr-1"></i>Search</button>
                    <button class="btn btn-danger btn-lg" onclick="resetTeacherRatingFilter()">Reset</button>
                </div>
            </div>
        </div>
    </div>

    <!-- ====================== SUMMARY STAT CARDS ====================== -->
    <div class="row mb-3" id="trSummaryCards">
        <div class="col-md-3 col-6 mb-2">
            <div class="main-card card h-100">
                <div class="card-body py-2">
                    <div class="small text-muted text-uppercase font-weight-bold" style="letter-spacing:.4px">Total Teachers</div>
                    <div class="h4 mb-0 mt-1" id="trStatTotal">0</div>
                    <div class="small text-muted">Evaluated this period</div>
                </div>
            </div>
        </div>
        <div class="col-md-3 col-6 mb-2">
            <div class="main-card card h-100">
                <div class="card-body py-2">
                    <div class="small text-muted text-uppercase font-weight-bold" style="letter-spacing:.4px">Eligible</div>
                    <div class="h4 mb-0 mt-1 text-success" id="trStatEligible">0</div>
                    <div class="small text-muted"><span id="trStatEligibleSub">of 0</span></div>
                </div>
            </div>
        </div>
        <div class="col-md-3 col-6 mb-2">
            <div class="main-card card h-100">
                <div class="card-body py-2">
                    <div class="small text-muted text-uppercase font-weight-bold" style="letter-spacing:.4px">Avg Overall</div>
                    <div class="h4 mb-0 mt-1" id="trStatAvgOverall">0%</div>
                    <div class="small text-muted">Across eligible teachers</div>
                </div>
            </div>
        </div>
        <div class="col-md-3 col-6 mb-2">
            <div class="main-card card h-100">
                <div class="card-body py-2">
                    <div class="small text-muted text-uppercase font-weight-bold" style="letter-spacing:.4px">Responses</div>
                    <div class="h4 mb-0 mt-1" id="trStatResponses">0</div>
                    <div class="small text-muted">This period</div>
                </div>
            </div>
        </div>
    </div>

    <!-- ====================== TOP PERFORMERS / NEEDS ATTENTION ====================== -->
    <div class="row mb-3" id="trPerfSection">
        <div class="col-md-6 mb-2">
            <div class="font-weight-bold mb-2 text-center"><i class="fa fa-trophy text-success mr-1"></i>Top Performers</div>
            <div class="row" id="trTopPerformers"></div>
        </div>
        <div class="col-md-6 mb-2">
            <div class="font-weight-bold mb-2 text-center"><i class="fa fa-exclamation-triangle text-danger mr-1"></i>Needs Attention</div>
            <div class="row" id="trNeedsAttention"></div>
        </div>
    </div>

    <!-- ====================== TEACHER TABLE ====================== -->
    <div class="main-card card">
        <div class="card-body table-responsive">
            <div class="d-flex align-items-center mb-2" style="max-width: 100px;">
                <div class="form-group custom-field mb-0" style="width:90px">
                    <select class="form-control" id="trFilterPageSize">
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </select>
                    <label class="font-weight-bold mb-1">Size</label>
                </div>
            </div>
            <table class="table table-bordered border-radius-table font-12" id="teacherRatingTable" style="width:100%">
                <thead class="bg-primary text-white">
                    <tr id="trTableThead">
                        <th>#</th>
                        <th>Teacher</th>
                        <!-- group columns get injected here dynamically -->
                        <th>Overall</th>
                        <th>Responses</th>
                        <th>Eligibility</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody id="teacherRatingTbody"></tbody>
            </table>
            <div id="trPagination"></div>
        </div>
    </div>
    </div>

    `;
}


function getTeacherRatingResponsesModalHtml() {
    return `
    <style>
        /* theme CSS hides select2 text whenever the checked option's value is ""
           (even with .is-filled) — for these dropdowns "" IS a real choice
           (All Forms / All Parameters / Default Order), so force it visible */
        #teacherRatingResponsesModal .custom-field.is-filled .select2-selection__rendered{
            color:var(--custom-field-value, #3c4043) !important;
        }
    </style>
    <div class="modal fade" id="teacherRatingResponsesModal" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-xl shadow-none" role="document" style="max-width:96vw">
            <div class="modal-content">
                <div class="modal-header bg-primary text-white flex-wrap">
                    <div style="flex:1;min-width:200px">
                        <h5 class="modal-title mb-1"><i class="fa fa-comments mr-2"></i>Responses — <span id="trRespUserName">—</span></h5>
                        <div class="small"><i class="fa fa-file-text-o mr-1"></i><span id="trRespFormsSummary">All forms</span></div>
                    </div>
                    <button type="button" class="close" data-dismiss="modal"><i class="fa fa-times mr-1"></i></button>
                </div>
                <div class="modal-body p-0 custom-field-scope">

                    <!-- Filters -->
                    <div class="p-3 border-bottom bg-light">
                        <div class="row align-items-end">
                            <!-- is-filled: default option is a real choice (not a placeholder),
                                 so keep the label floated and the value visible even when val="" -->
                            <div class="col-md-2 mb-2">
                                <div class="form-group custom-field mb-0 is-filled">
                                    <select class="form-control" id="trRespFormId">
                                        <option value="">All Forms</option>
                                    </select>
                                    <label class="font-weight-bold mb-1">Form</label>
                                </div>
                            </div>
                            <div class="col-md-2 mb-2">
                                <div class="form-group custom-field mb-0">
                                    <select class="form-control" id="trRespPeriodId">
                                        <option value="">Select Period</option>
                                    </select>
                                    <label class="font-weight-bold mb-1">Evaluation Period</label>
                                </div>
                            </div>
                            <div class="col-md-2 mb-2">
                                <div class="form-group custom-field mb-0 is-filled">
                                    <select class="form-control" id="trRespDateRange">
                                        <option value="full" selected>Full Period</option>
                                        <option value="today">Today</option>
                                        <option value="yesterday">Yesterday</option>
                                        <option value="thismonth">This Month</option>
                                        <option value="custom">Custom</option>
                                    </select>
                                    <label class="font-weight-bold mb-1">Date Range</label>
                                </div>
                            </div>
                            <div class="col-md-2 mb-2 trRespCustomDateWrap" style="display:none">
                                <div class="form-group custom-field mb-0">
                                    <input type="text" class="form-control" id="trRespStartDate" placeholder="Start" autocomplete="off" readonly>
                                    <label class="font-weight-bold mb-1">Start Date</label>
                                </div>
                            </div>
                            <div class="col-md-2 mb-2 trRespCustomDateWrap" style="display:none">
                                <div class="form-group custom-field mb-0">
                                    <input type="text" class="form-control" id="trRespEndDate" placeholder="End" autocomplete="off" readonly>
                                    <label class="font-weight-bold mb-1">End Date</label>
                                </div>
                            </div>
                            <div class="col-md-2 mb-2">
                                <div class="form-group custom-field mb-0 is-filled">
                                    <select class="form-control" id="trRespParameterId">
                                        <option value="">All Parameters</option>
                                    </select>
                                    <label class="font-weight-bold mb-1">Parameter</label>
                                </div>
                            </div>
                            <div class="col-md-2 mb-2">
                                <div class="form-group custom-field mb-0 is-filled">
                                    <select class="form-control" id="trRespSortBy">
                                        <option value="">Default Order</option>
                                        <option value="score_desc">Highest Score First</option>
                                        <option value="score_asc">Lowest Score First</option>
                                    </select>
                                    <label class="font-weight-bold mb-1">Sort By</label>
                                </div>
                            </div>
                            <div class="col-12 col-md-auto mb-2">
                                <button class="btn btn-success btn-lg mr-2" onclick="applyTeacherRatingResponsesFilter()"><i class="fa fa-search mr-1"></i>Search</button>
                                <button class="btn btn-danger btn-lg" onclick="resetTeacherRatingResponsesFilter()">Reset</button>
                            </div>
                        </div>
                    </div>

                    <!-- Tabs -->
                    <ul class="nav nav-tabs px-3 pt-2 mb-0" id="trRespTabs">
                        <li class="nav-item">
                            <a class="nav-link active" id="trRespTabQuestions" href="#" onclick="switchTeacherRatingResponsesTab('questions'); return false;">Questions</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" id="trRespTabParameters" href="#" onclick="switchTeacherRatingResponsesTab('parameters'); return false;">Parameters</a>
                        </li>
                    </ul>

                    <!-- Questions view -->
                    <div id="trRespViewQuestions">
                        <div class="p-3" style="max-height:65vh;overflow-y:auto;background:#f5f7fa">
                            <div class="table-responsive shadow-sm rounded" style="background:#fff">
                                <table class="table table-bordered border-radius-table font-12 mb-0" style="width:100%">
                                    <thead class="bg-primary text-white" style="position:sticky;top:0;z-index:2">
                                        <tr>
                                            <th style="width:40px">#</th>
                                            <th>Question</th>
                                            <th>Group / Parameter</th>
                                            <th class="text-center" style="width:110px">Avg Rating</th>
                                            <th class="text-center" style="width:90px">Avg Score</th>
                                            <th class="text-center" style="width:90px">Responses</th>
                                            <th class="text-center" style="width:40px"></th>
                                        </tr>
                                    </thead>
                                    <tbody id="trRespQuestionsTbody"></tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <!-- Parameters view (hierarchical: group → params) -->
                    <div id="trRespViewParameters" style="display:none">
                        <div class="p-3" style="max-height:65vh;overflow-y:auto;background:#f5f7fa">
                            <div id="trRespParametersBody"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
}


function getTeacherRatingDetailPageContent() {
    return `
    <div class="custom-field-scope">
    <div class="mb-2">
        <button class="btn btn-link p-0" onclick="backToTeacherRatingList()"><i class="fa fa-arrow-left mr-1"></i>Back to Teacher Rating</button>
    </div>

    <!-- ====================== PROFILE HEADER ====================== -->
    <div class="main-card card mb-3">
        <div class="card-body d-flex align-items-center flex-wrap" style="gap:16px">
            <div id="trdAvatarWrap"></div>
            <div style="flex:1;min-width:240px">
                <div class="h5 mb-1" id="trdName">—</div>
                <div class="d-flex flex-wrap" style="gap:14px;font-size:12px;color:#5f6368" id="trdMeta"></div>
            </div>
        </div>
    </div>

    <!-- ====================== FILTERS ====================== -->
    <div class="card shadow-sm mb-3">
        <div class="card-body">
            <div class="row align-items-end">
                <div class="col-md-3 mb-2">
                    <div class="form-group custom-field mb-0">
                        <select class="form-control" id="trdFilterPeriodId"></select>
                        <label class="font-weight-bold mb-1">Evaluation Period</label>
                    </div>
                </div>
                <div class="col-md-2 mb-2">
                    <div class="form-group custom-field mb-0">
                        <select class="form-control" id="trdFilterDateRange">
                            <option value="full" selected>Full Period</option>
                            <option value="today">Today</option>
                            <option value="yesterday">Yesterday</option>
                            <option value="thismonth">This Month</option>
                            <option value="custom">Custom</option>
                        </select>
                        <label class="font-weight-bold mb-1">Date Range</label>
                    </div>
                </div>
                <div class="col-md-2 mb-2 trdCustomDateWrap" style="display:none">
                    <div class="form-group custom-field mb-0">
                        <input type="text" class="form-control" id="trdFilterStartDate" placeholder="Start date" autocomplete="off" readonly>
                        <label class="font-weight-bold mb-1">Start Date</label>
                    </div>
                </div>
                <div class="col-md-2 mb-2 trdCustomDateWrap" style="display:none">
                    <div class="form-group custom-field mb-0">
                        <input type="text" class="form-control" id="trdFilterEndDate" placeholder="End date" autocomplete="off" readonly>
                        <label class="font-weight-bold mb-1">End Date</label>
                    </div>
                </div>
                <div class="col-12 col-md-auto mb-2">
                    <button class="btn btn-success btn-lg mr-2" onclick="applyTeacherRatingDetailFilter()"><i class="fa fa-search mr-1"></i>Search</button>
                    <button class="btn btn-danger btn-lg" onclick="resetTeacherRatingDetailFilter()">Reset</button>
                </div>
            </div>
        </div>
    </div>

    <!-- ====================== SUMMARY STAT CARDS (built by JS as flex row) ====================== -->
    <div class="d-flex flex-wrap flex-xl-nowrap mb-3" id="trdStatRow" style="gap:12px"></div>

    <!-- ====================== SCORE BREAKDOWN + ELIGIBILITY ====================== -->
    <div class="row mb-3">
        <div class="col-md-6 mb-2">
            <div class="main-card card h-100">
                <div class="card-body d-flex align-items-center" style="gap:20px">
                    <div id="trdScoreRing" style="position:relative;width:110px;height:110px;flex-shrink:0">
                        <svg width="110" height="110" viewBox="0 0 110 110" style="transform:rotate(-90deg)">
                            <circle cx="55" cy="55" r="48" fill="none" stroke="#e0e0e0" stroke-width="10"/>
                            <circle id="trdRingFill" cx="55" cy="55" r="48" fill="none" stroke="#1e8a3c" stroke-width="10" stroke-linecap="round" stroke-dasharray="301.59" stroke-dashoffset="301.59"/>
                        </svg>
                        <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center">
                            <div style="font-size:22px;font-weight:500;line-height:1" id="trdRingValue">—</div>
                            <div style="font-size:11px;color:#5f6368">Overall</div>
                        </div>
                    </div>
                    <div style="flex:1;min-width:0">
                        <div class="font-weight-bold mb-2">Score Breakdown</div>
                        <div id="trdScoreSplits"></div>
                        <div class="small text-muted mt-2">
                            Min param: <strong id="trdThreshParam">—</strong>
                            · Min overall: <strong id="trdThreshOverall">—</strong>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-6 mb-2">
            <div class="main-card card h-100">
                <div class="card-body" id="trdEligibilityCard">
                </div>
            </div>
        </div>
    </div>

    <!-- ====================== SUB-CRITERIA (per group) ====================== -->
    <div id="trdGroupCards"></div>

    <!-- ====================== PARAMETER BREAKDOWN TABLE ====================== -->
    <div class="main-card card mb-3">
        <div class="card-header bg-light py-2">
            <span class="font-weight-bold text-primary">Parameter Breakdown</span>
        </div>
        <div class="card-body table-responsive">
            <table class="table table-bordered border-radius-table font-12" id="trdParamTable" style="width:100%">
                <thead class="bg-primary text-white">
                    <tr>
                        <th>#</th>
                        <th>Parameter</th>
                        <th>Group</th>
                        <th>Evaluated By</th>
                        <th>Weight (in group)</th>
                        <th>Score</th>
                        <th>vs Threshold</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody id="trdParamTbody"></tbody>
            </table>
        </div>
    </div>

    <!-- ====================== CHARTS ====================== -->
    <div class="row mb-3">
        <div class="col-md-6 mb-2">
            <div class="main-card card h-100">
                <div class="card-header bg-light py-2"><span class="font-weight-bold text-primary">Parameter vs Threshold</span></div>
                <div class="card-body"><div id="trdBarChart"></div></div>
            </div>
        </div>
        <div class="col-md-6 mb-2">
            <div class="main-card card h-100">
                <div class="card-header bg-light py-2"><span class="font-weight-bold text-primary">Performance Radar</span></div>
                <div class="card-body"><div id="trdRadarChart"></div></div>
            </div>
        </div>
    </div>
    </div>
    `;
}
