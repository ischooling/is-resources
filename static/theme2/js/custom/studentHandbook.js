var STUDENT_HANDBOOK_FILE_PATH = "";
async function renderStudentHandbookPage(title){
    STUDENT_HANDBOOK_FILE_PATH = schoolSettingsLinks && schoolSettingsLinks.batchStudHBookUrl ? schoolSettingsLinks.batchStudHBookUrl : "";
    $("#dashboardContentInHTML").html(getStudentHandbookContent(title || "Student Handbook", STUDENT_HANDBOOK_FILE_PATH));
}
function studentHandbookDownloadFile(){
    if(!STUDENT_HANDBOOK_FILE_PATH){
        showMessageTheme2(0, "Handbook file not available.");
        return;
    }
    callWithSession(STUDENT_HANDBOOK_FILE_PATH);
}
