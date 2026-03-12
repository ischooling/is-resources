async function renderTeacherLoginHistoryPage(){
    var pageData = await teacherLoginHistoryBuildPageData();
    $("#dashboardContentInHTML").html(getTeacherLoginHistoryContent(pageData));
    teacherLoginHistoryInitDataTable();
}

async function teacherLoginHistoryBuildPageData(){
    var attendanceApiResponse = await teacherLoginHistoryFetchAttendance();
    var attendanceDTO = teacherLoginHistoryResolveAttendanceDTO(attendanceApiResponse);
    var firstLoginParts = (attendanceDTO.firstLogin || "").split(" ");
    var firstLoginDate = firstLoginParts.length > 0 ? firstLoginParts.slice(0, 3).join(" ") : "N/A";
    var firstLoginTime = firstLoginParts.length > 3 ? firstLoginParts.slice(3).join(" ") : (attendanceDTO.firstLogin || "N/A");
    var teacherName = teacherLoginHistoryResolveTeacherName(attendanceDTO, attendanceApiResponse);

    return {
        teacherName: teacherName,
        summary: {
            firstLoginDate: firstLoginDate || "N/A",
            firstLoginTime: firstLoginTime || "N/A",
            lastLogin: attendanceDTO.lastLogin || "N/A",
            lastLoginDuration: attendanceDTO.duration || "N/A",
            totalLoginDuration: attendanceDTO.totalLoginDuretion || "N/A"
        },
        sessions: teacherLoginHistoryMapSessions(attendanceDTO.loginHistories || attendanceDTO.loginHistoryDTOList || [])
    };
}

async function teacherLoginHistoryFetchAttendance(){
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

function teacherLoginHistoryResolveAttendanceDTO(apiResponse){
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

function teacherLoginHistoryResolveTeacherName(attendanceDTO, apiResponse){
    var teacherName = attendanceDTO.teacherName
        || attendanceDTO.teacherFullName
        || attendanceDTO.fullName
        || attendanceDTO.userFullName
        || attendanceDTO.name
        || attendanceDTO.userName
        || (apiResponse && apiResponse.teacherName)
        || (apiResponse && apiResponse.details && (apiResponse.details.teacherName || apiResponse.details.teacherFullName || apiResponse.details.fullName))
        || (apiResponse && apiResponse.data && (apiResponse.data.teacherName || apiResponse.data.teacherFullName || apiResponse.data.fullName))
        || (typeof USER_FULL_NAME !== "undefined" ? USER_FULL_NAME : "");
    return $.trim(teacherName || "");
}

function teacherLoginHistoryMapSessions(list){
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

function teacherLoginHistoryInitDataTable(){
    if(!$.fn.DataTable){
        return;
    }
    if($.fn.DataTable.isDataTable('#teacherLoginHistoryTable')){
        $('#teacherLoginHistoryTable').DataTable().destroy();
    }
    if($("#teacherLoginHistoryTable tbody tr").length === 0 || $("#teacherLoginHistoryTable tbody td[colspan]").length > 0){
        return;
    }
    var teacherLoginHistoryTable = $('#teacherLoginHistoryTable').DataTable({
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
    $("#teacherLoginHistorySearch").off("keyup").on("keyup", function(){
        teacherLoginHistoryTable.search($(this).val()).draw();
    });
}
