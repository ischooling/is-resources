async function renderStudentLoginHistoryPage(){
    var pageData = await studentLoginHistoryBuildPageData();
    $("#dashboardContentInHTML").html(getStudentLoginHistoryContent(pageData));
    studentLoginHistoryInitDataTable();
}

async function studentLoginHistoryBuildPageData(){
    var attendanceApiResponse = await studentLoginHistoryFetchAttendance();
    var attendanceDTO = studentLoginHistoryResolveAttendanceDTO(attendanceApiResponse);
    var firstLoginParts = (attendanceDTO.firstLogin || "").split(" ");
    var firstLoginDate = firstLoginParts.length > 0 ? firstLoginParts.slice(0, 3).join(" ") : "N/A";
    var firstLoginTime = firstLoginParts.length > 3 ? firstLoginParts.slice(3).join(" ") : (attendanceDTO.firstLogin || "N/A");
    var studentName = studentLoginHistoryResolveStudentName(attendanceDTO, attendanceApiResponse);

    return {
        studentName: studentName,
        summary: {
            firstLoginDate: firstLoginDate || "N/A",
            firstLoginTime: firstLoginTime || "N/A",
            lastLogin: attendanceDTO.lastLogin || "N/A",
            lastLoginDuration: attendanceDTO.duration || "N/A",
            totalLoginDuration: attendanceDTO.totalLoginDuretion || "N/A"
        },
        sessions: studentLoginHistoryMapSessions(attendanceDTO.loginHistories || attendanceDTO.loginHistoryDTOList || [])
    };
}

async function studentLoginHistoryFetchAttendance(){
    var payload = { userId: USER_ID + "", studentUserId: USER_ID + "" };
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

function studentLoginHistoryResolveAttendanceDTO(apiResponse){
    if(!apiResponse){
        return {};
    }
    if(apiResponse.details && apiResponse.details.loginHistories){
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

function studentLoginHistoryResolveStudentName(attendanceDTO, apiResponse){
    var studentName = attendanceDTO.studentName
        || attendanceDTO.studentFullName
        || attendanceDTO.fullName
        || attendanceDTO.userFullName
        || attendanceDTO.name
        || attendanceDTO.userName
        || (apiResponse && apiResponse.studentName)
        || (apiResponse && apiResponse.details && (apiResponse.details.studentName || apiResponse.details.studentFullName || apiResponse.details.fullName))
        || (apiResponse && apiResponse.data && (apiResponse.data.studentName || apiResponse.data.studentFullName || apiResponse.data.fullName))
        || (typeof USER_FULL_NAME !== "undefined" ? USER_FULL_NAME : "");
    return $.trim(studentName || "");
}

function studentLoginHistoryMapSessions(list){
    var sessions = [];
    $.each(list || [], function(index, row){
        var status = row.status || ((row.logOutTime && row.logOutTime !== "N/A") ? "COMPLETED" : "ACTIVE");
        sessions.push({
            loginDateTime: row.loginTime || "N/A",
            logoutDateTime: row.logOutTime || "N/A",
            location: row.loginLocation || "N/A",
            duration: row.totalLoginDuretion || "N/A",
            status: status
        });
    });
    return sessions;
}

function studentLoginHistoryInitDataTable(){
    if(!$.fn.DataTable){
        return;
    }
    if($.fn.DataTable.isDataTable('#studentLoginHistoryTable')){
        $('#studentLoginHistoryTable').DataTable().destroy();
    }
    if($("#studentLoginHistoryTable tbody tr").length === 0 || $("#studentLoginHistoryTable tbody td[colspan]").length > 0){
        return;
    }
    var studentLoginHistoryTable = $('#studentLoginHistoryTable').DataTable({
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
    $("#studentLoginHistorySearch").off("keyup").on("keyup", function(){
        studentLoginHistoryTable.search($(this).val()).draw();
    });
}
