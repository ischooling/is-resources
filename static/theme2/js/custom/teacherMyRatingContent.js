/* ============================================================================
   My Rating (Teacher) — page template
   Data comes from teacher-evaluation/rating/teacher-performance (teacherMyRating.js);
   profile header + rating banner + feedback section cards (details.feedbackSections).
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
    <div class="card mb-3">
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

    <!-- ====================== FEEDBACK SECTIONS (rendered by JS) ====================== -->
    <div id="tmrFeedbackSections"></div>
    `;
}
