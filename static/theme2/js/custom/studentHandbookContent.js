function getStudentHandbookContent(title, filePath){
    var handbookImage = SCHOOL_ID == 1 ? (PATH_FOLDER_IMAGE + "handbook.jpg") : (PATH_FOLDER_IMAGE + "student-handbook.jpg");
    var policyLink = SCHOOL_ID == 1 ? "https://internationalschooling.org/student-policies-and-code-of-conduct/" : (filePath || "javascript:void(0)");
    var safeTitle = title || "Student Handbook";
    var hasFile = !!filePath;

    return `
    <div class="app-page-title mb-3 py-2">
        <div class="page-title-wrapper">
            <div class="page-title-heading">
                <div class="page-title-icon"><img src="${PATH_FOLDER_IMAGE2}/Icon/sidebar/Child_Handbook.png" style="max-width:200px; width: 90%; margin-right: auto; display: flex;"></div>
                <div>${safeTitle}</div>
            </div>
        </div>
    </div>
    <div class="main-card mb-3 card">
        <div class="card-body">
            <div class="text-center">
                <a href="javascript:void(0);">
                    <img src="${handbookImage}" width="250" alt="Student Handbook">
                </a>
                <p class="mt-5 mb-4">
                    <a href="javascript:void(0)" onclick="studentHandbookDownloadFile()" class="btn btn-primary px-4 py-2 rounded-pill ${!hasFile ? "disabled" : ""}" ${!hasFile ? "aria-disabled='true'" : ""}>Download Handbook</a>
                </p>
                <div class="pt-2">
                    It is the responsibility of the student and the parent to keep a check on the updated terms and policies of the school.
                    <a href="${policyLink}" target="_blank">Click Here</a>
                    to know more.
                </div>
            </div>
        </div>
    </div>`;
}
