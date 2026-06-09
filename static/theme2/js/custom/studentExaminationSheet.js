var STUDENT_EXAMINATION_SHEET_FILE_PATH = "NA";

async function renderStudentExaminationSheetPage(title){
    var filePath = await studentExaminationSheetFetchFilePath();
    STUDENT_EXAMINATION_SHEET_FILE_PATH = filePath;
    // console.log("renderStudentExaminationSheetPage :: filePath :: ", filePath);
    await getPdfViewerEndpoint(filePath);
    $("#dashboardContentInHTML").html(getStudentExaminationSheetContent(title || "Student's Examination Schedule", filePath));
}

async function getPdfViewerEndpoint(filePath){
    try {
        var url = APP_BASE_URL + "pdf-viewer?file=" + encodeURIComponent(filePath);
        // console.log("testPdfViewerEndpoint :: calling url :: ", url);
        var response = await fetch(url);
        // console.log("testPdfViewerEndpoint :: status :: ", response.status);
        // console.log("testPdfViewerEndpoint :: content-type :: ", response.headers.get("content-type"));
        var text = await response.url;
        // console.log("testPdfViewerEndpoint :: response (first 500 chars) :: ", text.substring(0, 500));
    } catch(e) {
        console.error("testPdfViewerEndpoint :: error :: ", e);
    }
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

function getPdfViewerUrl(pdfUrl) {
    return APP_BASE_URL +
        "static/pdfjs/web/viewer.html?file=" +
        encodeURIComponent(APP_BASE_URL + "pdf-proxy?url=" + encodeURIComponent(pdfUrl));
}
