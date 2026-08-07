/* ============================================================================
   Student Feedback (Received) — page template
   Data comes from studentFeedbackReceived.js:
     - SUMMARY → POST teacher-evaluation/rating/student-feedback
     - LIST    → POST teacher-evaluation/rating/student-feedback/list
   Profile header + period selector + anonymity notice + slim summary bar +
   filter bar (parameter/question/rating/sort/search) + anonymous feedback cards.
   ========================================================================== */

function getStudentFeedbackReceivedPageContent(title) {
    return `
    <div class="custom-field-scope">

    <div class="app-page-title mb-3 py-2">
        <div class="page-title-wrapper">
            <div class="page-title-heading">
                <div class="page-title-icon">
                    <i class="fa fa-comments text-primary"></i>
                </div>
                <div>
                    <span class="text-primary welcome-name-text">${title}</span>
                    <div class="page-title-subheading">what your students said this period</div>
                </div>
            </div>
        </div>
    </div>

    <!-- ====================== PROFILE HEADER + PERIOD ====================== -->
    <div class="main-card card mb-3">
        <div class="card-body py-3 d-flex align-items-center flex-wrap" style="gap:16px">
            <div id="sfrAvatar" class="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center font-weight-bold" style="width:48px;height:48px;font-size:18px;flex-shrink:0;overflow:hidden"></div>
            <div style="flex:1;min-width:220px">
                <div class="font-weight-bold" style="font-size:18px;line-height:1.2" id="sfrTeacherName"></div>
                <div class="d-flex flex-wrap mt-1" style="gap:14px;font-size:12px;color:#5f6368" id="sfrTeacherMeta"></div>
            </div>
            <div class="form-group custom-field mb-0" style="flex:0 0 220px;max-width:220px">
                <select class="form-control" id="sfrPeriodId"></select>
                <label class="font-weight-bold mb-1">Evaluation Period</label>
            </div>
        </div>
    </div>

    <!-- ====================== ANONYMITY NOTICE ====================== -->
    <div class="d-flex align-items-center mb-3" style="gap:10px;background:#e8f0fe;border:1px solid #bbdefb;border-radius:10px;padding:12px 16px">
        <i class="fa fa-eye-slash" style="font-size:18px;color:#1565c0;flex-shrink:0"></i>
        <div style="font-size:12px;color:#1a1a2e;line-height:1.5">
            <strong>Student identities are kept private.</strong> Feedback is shown anonymously — you can see the rating, the question, the comment and the date it was submitted, but never who wrote it or the exact time. This keeps feedback honest and protects your students.
        </div>
    </div>

    <!-- ====================== SLIM SUMMARY BAR ====================== -->
    <div class="card mb-3" style="border:1px solid #e8eaed">
        <div class="card-body py-2 d-flex align-items-center flex-wrap" style="gap:20px">
            <div class="d-flex align-items-center" style="gap:8px">
                <i class="fa fa-star" style="font-size:18px;color:#1565c0"></i>
                <div><span style="font-size:16px;font-weight:700" id="sfrMiniAvg">0.0</span> <span style="font-size:11px;color:#5f6368;text-transform:uppercase;letter-spacing:.4px">Avg rating</span></div>
                <span id="sfrMiniStars" style="line-height:1"></span>
            </div>
            <div style="width:1px;height:26px;background:#e8eaed"></div>
            <div class="d-flex align-items-center" style="gap:8px">
                <i class="fa fa-comments" style="font-size:18px;color:#1565c0"></i>
                <div><span style="font-size:16px;font-weight:700" id="sfrMiniCount">0</span> <span style="font-size:11px;color:#5f6368;text-transform:uppercase;letter-spacing:.4px">Responses</span></div>
            </div>
            <div style="width:1px;height:26px;background:#e8eaed"></div>
            <div class="d-flex align-items-center" style="gap:8px">
                <i class="fa fa-thumbs-up" style="font-size:18px;color:#1565c0"></i>
                <div><span style="font-size:16px;font-weight:700" id="sfrMiniPos">0%</span> <span style="font-size:11px;color:#5f6368;text-transform:uppercase;letter-spacing:.4px">Rated 4&#9733; &amp; above</span></div>
            </div>
        </div>
    </div>

    <!-- ====================== FILTER BAR ====================== -->
    <div class="card shadow-sm mb-3">
        <div class="card-body">
            <div class="d-flex align-items-center mb-2" style="gap:7px">
                <i class="fa fa-sliders text-primary"></i>
                <span class="font-weight-bold text-uppercase" style="font-size:12px;letter-spacing:.4px">Filter feedback</span>
            </div>
            <div class="row align-items-end">
                <div class="col-md-3 mb-2">
                    <div class="form-group custom-field mb-0 is-filled">
                        <select class="form-control" id="sfrParam"></select>
                        <label class="font-weight-bold mb-1">Parameter</label>
                    </div>
                </div>
                <div class="col-md-3 mb-2">
                    <div class="form-group custom-field mb-0 is-filled">
                        <select class="form-control" id="sfrQuestion"></select>
                        <label class="font-weight-bold mb-1">Question</label>
                    </div>
                </div>
                <div class="col-md-2 mb-2">
                    <div class="form-group custom-field mb-0 is-filled">
                        <select class="form-control" id="sfrRating">
                            <option value="all">All ratings</option>
                            <option value="pos">Positive (4&#9733; &amp; above)</option>
                            <option value="neg">Needs attention (3&#9733; &amp; below)</option>
                        </select>
                        <label class="font-weight-bold mb-1">Rating</label>
                    </div>
                </div>
                <div class="col-md-2 mb-2">
                    <div class="form-group custom-field mb-0 is-filled">
                        <select class="form-control" id="sfrSort">
                            <option value="recent">Most recent</option>
                            <option value="highest">Highest rated</option>
                            <option value="lowest">Lowest rated</option>
                        </select>
                        <label class="font-weight-bold mb-1">Sort by</label>
                    </div>
                </div>
                <div class="col-md-2 mb-2">
                    <div class="form-group custom-field mb-0">
                        <input type="text" class="form-control" id="sfrSearch" placeholder="Search comment" autocomplete="off">
                        <label class="font-weight-bold mb-1">Search Comment</label>
                    </div>
                </div>
                <div class="col-12 col-md-auto mb-2 ml-md-auto text-md-right">
                    <button class="btn btn-success btn-lg mr-2" onclick="applyStudentFeedbackFilter()"><i class="fa fa-search mr-1"></i>Search</button>
                    <button class="btn btn-danger btn-lg" onclick="resetStudentFeedbackFilter()"><i class="fa fa-refresh mr-1"></i>Reset</button>
                </div>
            </div>
        </div>
    </div>

    <!-- ====================== RESULT COUNT + FEEDBACK GRID ====================== -->
    <div class="small text-muted mb-2" id="sfrResultCount"></div>
    <div class="row" id="sfrGrid"></div>

    <div class="text-center mt-3" id="sfrLoadMoreWrap" style="display:none">
        <button class="btn btn-outline-primary" id="sfrLoadMoreBtn" onclick="loadMoreStudentFeedback()">Load more feedback</button>
    </div>

    </div>
    `;
}
