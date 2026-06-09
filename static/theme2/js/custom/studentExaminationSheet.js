var STUDENT_EXAMINATION_SHEET_FILE_PATH = "NA";

async function renderStudentExaminationSheetPage(title){
    var filePath = await studentExaminationSheetFetchFilePath();
    STUDENT_EXAMINATION_SHEET_FILE_PATH = filePath;
    // console.log("renderStudentExaminationSheetPage :: filePath :: ", filePath);
    $("#dashboardContentInHTML").html(getStudentExaminationSheetContent(title || "Student's Examination Schedule", filePath));
}



async function studentExaminationSheetFetchFilePath(){
    var ajaxReqDetails = {
        method: "POST",
        url: APP_BASE_URL + SCHOOL_UUID + "/dashboard/student-examination-details",
        body: { userId: USER_ID + "", studentUserId: USER_ID + "" },
        global: true,
        showMessage: false,
        onFaildResolved: true,
        onSuccessResolved: true
    };

    var response = await callCommonAjax(ajaxReqDetails);
    if(response && response.status == "1" && response.details){
        return response.details;
    }
    return "NA";
}
