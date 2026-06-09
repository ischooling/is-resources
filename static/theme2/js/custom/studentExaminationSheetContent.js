function getStudentExaminationSheetContent(title, filePath){
    var safeTitle = title || "Student's Examination Schedule";
    var hasFile = !!filePath && filePath !== "NA";

    return `<div class="app-page-title mb-3 py-2">
        <div class="page-title-wrapper">
            <div class="page-title-heading">
                <div class="page-title-icon"><img src="${PATH_FOLDER_IMAGE2}/Icon/sidebar/Examination_Schedule_icon.png" style="max-width:200px; width: 90%; margin-right: auto; display: flex;"></div>
                <div>${safeTitle}</div>
            </div>
        </div>
    </div>
    <div class="main-card mb-3 card">
        <div class="card-body">
            <div class="full hide-tab">
                ${hasFile ? `<iframe src="https://mozilla.github.io/pdf.js/web/viewer.html?file=${filePath}" type="application/pdf" width="100%" height="500" style="overflow:auto;"></iframe>` : `<h4 class="text-center">Your Examination Schedule is going to upload soon.</h4>`}
            </div>
        </div>
    </div>`;
}
