/* ============================================================================
   Student Feedback (Received) — page template
   Data comes from studentFeedbackReceived.js:
     - SUMMARY → POST teacher-evaluation/rating/student-feedback
                 (profile, periods, summary + rating distribution, first page)
     - LIST    → POST teacher-evaluation/rating/student-feedback/list
                 (date-filtered + paginated feedback responses)
     - DETAIL  → POST teacher-evaluation/rating/student-feedback/detail
                 (per-question ratings + comments for one response — modal)
   Feedback is anonymous: only the overall rating and submitted DATE are shown
   in the list; the modal reveals each question's rating and comment.
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
    <div class="d-flex align-items-start mb-3" style="gap:10px;background:#e6f4ea;border:1px solid #b7e0c4;border-radius:10px;padding:12px 16px">
        <i class="fa fa-eye-slash" style="font-size:18px;color:#1e8a3c;flex-shrink:0;margin-top:1px"></i>
        <div style="font-size:12px;color:#1a1a2e;line-height:1.5">
            <strong>Student identities are kept private.</strong> Feedback is shown anonymously — you can see the rating, the question, the comment and the date it was submitted, but never who wrote it or the exact time. This keeps feedback honest and protects your students.
        </div>
    </div>

    <!-- ====================== OVERVIEW (avg + distribution) ====================== -->
    <div class="row" id="sfrOverview"></div>

    <!-- ====================== SECTION HEAD + DATE FILTER ====================== -->
    <div class="d-flex align-items-center justify-content-between flex-wrap mb-2" style="gap:12px">
        <h5 class="font-weight-bold text-primary mb-0" style="font-size:16px">All feedback comments</h5>
        <div class="d-flex align-items-end flex-wrap" style="gap:8px">
            <div class="form-group custom-field mb-0 is-filled" style="flex:0 0 170px;max-width:170px">
                <select class="form-control" id="sfrRange">
                    <option value="all">Full period</option>
                    <option value="today">Today</option>
                    <option value="yesterday">Yesterday</option>
                    <option value="month">This month</option>
                    <option value="custom">Custom range</option>
                </select>
                <label class="font-weight-bold mb-1">Date range</label>
            </div>
            <div id="sfrCustomRange" class="d-none align-items-end" style="gap:8px">
                <div class="form-group custom-field mb-0" style="flex:0 0 150px;max-width:150px">
                    <input type="text" class="form-control" id="sfrStartDate" placeholder=" " autocomplete="off" onkeydown="return false" style="background:#fff;cursor:pointer">
                    <label class="font-weight-bold mb-1">From</label>
                </div>
                <div class="form-group custom-field mb-0" style="flex:0 0 150px;max-width:150px">
                    <input type="text" class="form-control" id="sfrEndDate" placeholder=" " autocomplete="off" onkeydown="return false" style="background:#fff;cursor:pointer">
                    <label class="font-weight-bold mb-1">To</label>
                </div>
                <button class="btn btn-success d-flex align-items-center justify-content-center px-4 mb-0" style="height:48px" onclick="applyStudentFeedbackDateRange()"><i class="fa fa-search"></i></button>
            </div>
        </div>
    </div>

    <!-- ====================== RESULT COUNT + FEEDBACK GRID ====================== -->
    <div class="small text-muted mb-2" id="sfrResultCount"></div>
    <div class="row" id="sfrGrid"></div>

    <div class="text-center mt-3" id="sfrLoadMoreWrap" style="display:none">
        <button class="btn btn-outline-primary" id="sfrLoadMoreBtn" onclick="loadMoreStudentFeedback()">Load more</button>
    </div>

    <!-- ====================== FEEDBACK DETAIL MODAL ====================== -->
    <div class="modal fade" id="sfrDetailModal" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable shadow-none" role="document">
            <div class="modal-content shadow-none">
                <div class="modal-header py-2 bg-primary text-white">
                    <h5 class="modal-title"><i class="fa fa-comments mr-2"></i>Feedback Details</h5>
                    <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true"><i class="fa fa-times"></i></span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="d-flex align-items-center justify-content-center flex-wrap mb-3" style="gap:10px;background:#f4f6fb;border-radius:10px;padding:12px">
                        <span class="text-uppercase font-weight-bold" style="font-size:12px;letter-spacing:.4px;color:#5f6368">Overall rating</span>
                        <span id="sfrDetailStars"></span>
                        <span class="font-weight-bold" id="sfrDetailScore" style="font-size:13px"></span>
                    </div>
                    <div id="sfrDetailItems"></div>
                    <p class="d-flex align-items-center justify-content-center text-muted mt-2 mb-0" style="gap:6px;font-size:12px">
                        <i class="fa fa-user-circle-o"></i> Identity hidden to protect student privacy
                    </p>
                </div>
            </div>
        </div>
    </div>

    </div>
    `;
}
