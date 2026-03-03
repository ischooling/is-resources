async function renderStudentParentLoginHistoryPage(){
    var students = parentLoginHistoryGetGlobalStudents();
    if(students.length === 0){
        showMessageTheme2(0, "No student found");
        $("#dashboardContentInHTML").html(`<div class="main-card mb-3 card"><div class="card-body text-center">No student found</div></div>`);
        return;
    }

    var initialUserId = parentLoginHistoryResolveInitialUserId(students);
    $("#dashboardContentInHTML").html(getStudentParentLoginHistoryContent({
        students: students,
        selectedStudentUserId: initialUserId
    }));
    parentLoginHistoryOnLoadEvent();
    await parentLoginHistoryRenderByStudent(initialUserId, false);
}

function parentLoginHistoryGetGlobalStudents(){
    if(typeof STUDENT_LIST === "undefined" || !STUDENT_LIST){
        return [];
    }
    if($.isArray(STUDENT_LIST)){
        return STUDENT_LIST;
    }
    if($.isArray(STUDENT_LIST.studentBasicDetails)){
        return STUDENT_LIST.studentBasicDetails;
    }
    if(STUDENT_LIST.data && $.isArray(STUDENT_LIST.data.studentBasicDetails)){
        return STUDENT_LIST.data.studentBasicDetails;
    }
    return [];
}

function parentLoginHistoryResolveInitialUserId(students){
    var activeId = (typeof ACTIVE_STUDENT_ID !== "undefined" && ACTIVE_STUDENT_ID !== null) ? (ACTIVE_STUDENT_ID + "") : "";
    if(!activeId){
        return USER_ID + "";
    }
    var existsInStudentList = false;
    $.each(students || [], function(index, student){
        if(String(student.userId) === activeId){
            existsInStudentList = true;
            return false;
        }
    });
    return existsInStudentList ? activeId : (USER_ID + "");
}

async function parentLoginHistoryOnStudentTabClick(studentUserId){
    if(!studentUserId){
        return;
    }
    if($(".student-" + studentUserId).hasClass("active")){
        return;
    }
    var shouldStoreActiveStudentId = String(studentUserId) !== String(USER_ID);
    await parentLoginHistoryRenderByStudent(studentUserId, shouldStoreActiveStudentId);
}

async function parentLoginHistoryRenderByStudent(studentUserId, shouldStoreActiveStudentId){
    if(shouldStoreActiveStudentId){
        ACTIVE_STUDENT_ID = studentUserId;
    }
    parentLoginHistorySetActiveStudentThumb(studentUserId);
    customLoader(true);
    try{
        var attendanceApiResponse = await parentLoginHistoryFetchAttendance(studentUserId);
        if(!parentLoginHistoryIsSuccess(attendanceApiResponse)){
            parentLoginHistoryBindEmptyData();
            showMessageTheme2(0, parentLoginHistoryGetErrorMessage(attendanceApiResponse));
            return;
        }
        var pageData = parentLoginHistoryBuildPageData(attendanceApiResponse);
        $("#parentLoginSummarySection").html(getParentLoginSummarySection(pageData.summary));
        parentLoginHistoryReinitializeDataTable();
        $("#parentLoginHistoryBody").html(getParentLoginHistoryRowsHtml(pageData.sessions));
        parentLoginHistoryInitializeDataTable();
    }catch(e){
        parentLoginHistoryBindEmptyData();
        showMessageTheme2(0, "Unable to load login history.");
    }finally{
        customLoader(false);
    }
}

async function parentLoginHistoryFetchAttendance(studentUserId){
    var payload = { userId: USER_ID + "", studentUserId: studentUserId + "" };
    var ajaxReqDetails = {
        method: "POST",
        url: APP_BASE_URL + SCHOOL_UUID + "/dashboard/parent/student-attendance",
        body: payload,
        global: true,
        showMessage: false,
        onFaildResolved: true,
        onSuccessResolved: true
    };
    return await callCommonAjax(ajaxReqDetails);
}

function parentLoginHistoryBuildPageData(apiResponse){
    var attendanceDTO = parentLoginHistoryResolveAttendanceDTO(apiResponse);
    var firstLoginParts = (attendanceDTO.firstLogin || "").split(" ");
    var firstLoginDate = firstLoginParts.length > 0 ? firstLoginParts.slice(0, 3).join(" ") : "N/A";
    var firstLoginTime = firstLoginParts.length > 3 ? firstLoginParts.slice(3).join(" ") : (attendanceDTO.firstLogin || "N/A");
    return {
        summary: {
            firstLoginDate: firstLoginDate || "N/A",
            firstLoginTime: firstLoginTime || "N/A",
            lastLogin: attendanceDTO.lastLogin || "N/A",
            lastLoginDuration: attendanceDTO.duration || "N/A",
            totalLoginDuration: attendanceDTO.totalLoginDuretion || "N/A"
        },
        sessions: parentLoginHistoryMapSessions(attendanceDTO.loginHistories || attendanceDTO.loginHistoryDTOList || [])
    };
}

function parentLoginHistoryResolveAttendanceDTO(apiResponse){
    if(!apiResponse){
        return {};
    }
    if(apiResponse.details){
        return apiResponse.details;
    }
    if(apiResponse.attendanceDTO){
        return apiResponse.attendanceDTO;
    }
    if(apiResponse.response && apiResponse.response.attendanceDTO){
        return apiResponse.response.attendanceDTO;
    }
    if(apiResponse.data && apiResponse.data.attendanceDTO){
        return apiResponse.data.attendanceDTO;
    }
    if(apiResponse.data && apiResponse.data.loginHistoryDTOList){
        return apiResponse.data;
    }
    if(apiResponse.loginHistoryDTOList){
        return apiResponse;
    }
    return {};
}

function parentLoginHistoryMapSessions(list){
    var sessions = [];
    $.each(list || [], function(index, row){
        sessions.push({
            loginDateTime: row.loginTime || "N/A",
            logoutDateTime: row.logOutTime || "N/A",
            location: row.loginLocation || "N/A",
            duration: row.totalLoginDuretion || "N/A"
        });
    });
    return sessions;
}

function parentLoginHistoryIsSuccess(response){
    if(!response){
        return false;
    }
    if(response.status != undefined){
        return String(response.status) === "1" || String(response.status).toUpperCase() === "SUCCESS";
    }
    if(response.code){
        return String(response.code).toUpperCase() === "SUCCESS";
    }
    if(response.responseStatus && response.responseStatus.status != undefined){
        return String(response.responseStatus.status) === "1";
    }
    return !!(response.details || response.attendanceDTO || response.data);
}

function parentLoginHistoryGetErrorMessage(response){
    if(response && response.message){
        return response.message;
    }
    if(response && response.responseStatus && response.responseStatus.message){
        return response.responseStatus.message;
    }
    return "Unable to load login history.";
}

function parentLoginHistoryBindEmptyData(){
    $("#parentLoginSummarySection").html(getParentLoginSummarySection({
        firstLoginDate: "N/A",
        firstLoginTime: "N/A",
        lastLogin: "N/A",
        lastLoginDuration: "N/A",
        totalLoginDuration: "N/A"
    }));
    parentLoginHistoryReinitializeDataTable();
    $("#parentLoginHistoryBody").html(getParentLoginHistoryRowsHtml([]));
}

function parentLoginHistorySetActiveStudentThumb(studentUserId){
    $(".student-thumb").removeClass("active active-student");
    $(".student-" + studentUserId).addClass("active active-student");
}

function parentLoginHistoryOnLoadEvent(){
    if($("#attendanceTabStyle").length < 1){
        $("head").append(`<style id="attendanceTabStyle">.attendance-tab.active{background:#409f5b !important;color:#fff !important}</style>`);
    }
    if($.fn.slick){
        if($('.user-slider').hasClass('slick-initialized')){
            $('.user-slider').slick('unslick');
        }
        $('.user-slider').slick({
            slidesToShow: parentLoginHistoryGetSlidesToShow(),
            slidesToScroll: 1,
            infinite: false,
            arrows: true,
            responsive: [
                {breakpoint: 992, settings: {slidesToShow: 3}},
                {breakpoint: 768, settings: {slidesToShow: 2}},
                {breakpoint: 576, settings: {slidesToShow: 1}}
            ]
        });
    }
    parentLoginHistoryReinitializeDataTable();
}

function parentLoginHistoryReinitializeDataTable(){
    if(!$.fn.DataTable){
        return;
    }
    if($.fn.DataTable.isDataTable('#parentLoginHistoryTable')){
        $('#parentLoginHistoryTable').DataTable().destroy();
    }
}

function parentLoginHistoryInitializeDataTable(){
    if(!$.fn.DataTable){
        return;
    }
    if($("#parentLoginHistoryTable tbody tr").length === 0 || $("#parentLoginHistoryTable tbody td[colspan]").length > 0){
        return;
    }
    var tableObj = $('#parentLoginHistoryTable').DataTable({
        paging: true,
        searching: true,
        ordering: false,
        info: true,
        pageLength: 10,
        lengthChange: false,
        autoWidth: false,
        dom: 't<"d-flex flex-wrap align-items-center justify-content-between px-3 py-2"i p>',
        language: {
            info: "Showing _START_-_END_ of _TOTAL_ sessions",
            paginate: { previous: "Previous", next: "Next" }
        }
    });
    $("#parentLoginHistorySearch").val("");
    tableObj.search("").draw();
    $("#parentLoginHistorySearch").off("keyup").on("keyup", function(){
        tableObj.search($(this).val()).draw();
    });
}

function parentLoginHistoryGetSlidesToShow() {
    var containerWidth = $('.parent-tab-slider-wrapper').width();
    var itemWidth = 220;
    var slides = Math.floor(containerWidth / itemWidth);
    return slides > 0 ? slides : 1;
}
