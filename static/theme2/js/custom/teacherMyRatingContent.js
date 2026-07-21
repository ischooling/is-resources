/* ============================================================================
   My Rating (Teacher) — page template
   Data comes from teacher-evaluation/rating/teacher-performance (teacherMyRating.js);
   only the profile header + rating banner are visualised, rest is coming soon.
   ========================================================================== */

function getTeacherMyRatingPageContent(title) {
    return `
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

    <!-- ====================== TEACHER HEADER ====================== -->
    <div class="card shadow-sm mb-3">
        <div class="card-body py-3 d-flex align-items-center" style="gap:14px">
            <div id="tmrAvatar" class="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center font-weight-bold" style="width:48px;height:48px;font-size:18px;flex-shrink:0"></div>
            <div style="flex:1;min-width:240px">
                <div class="font-weight-bold" style="font-size:18px;line-height:1.2" id="tmrTeacherName"></div>
                <div class="d-flex flex-wrap mt-1" style="gap:14px;font-size:12px;color:#5f6368" id="tmrTeacherMeta"></div>
            </div>
        </div>
    </div>

    <!-- ====================== RATING BANNER (rendered by JS) ====================== -->
    <div id="tmrBanner"></div>

    <!-- ====================== COMING SOON ====================== -->
    <div class="main-card card">
        <div class="card-body text-center py-5">
            <i class="fa fa-bar-chart fa-3x text-primary mb-3"></i>
            <h5 class="font-weight-bold">More insights coming soon</h5>
            <p class="text-muted mb-0">Monthly performance, classroom analytics and parameter-wise feedback will appear here soon.</p>
            <div class="d-inline-flex align-items-center text-left mt-3 rounded px-3 py-2" style="gap:8px;background:#e8f0fe">
                <i class="fa fa-info-circle text-primary"></i>
                <span style="font-size:14px;color:#212529"><strong>Note:</strong> Higher response rates give a fuller, fairer picture of your performance. Encourage your students to complete their feedback after each class.</span>
            </div>
        </div>
    </div>
    `;
}
