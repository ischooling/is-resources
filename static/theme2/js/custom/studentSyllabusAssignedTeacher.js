async function renderStudentSyllabusAssignedTeacherPage(){
    var apiResponse = await studentAssignedTeacherFetchList();
    var rows = studentAssignedTeacherMapRows(apiResponse);
    $("#dashboardContentInHTML").html(getStudentSyllabusAssignedTeacherContent({ rows: rows }));
    studentAssignedTeacherInitDataTable();
}

async function studentAssignedTeacherFetchList(){
    var payload = { userId: USER_ID + "", studentUserId: USER_ID + "" };
    var ajaxReqDetails = {
        method: "POST",
        url: APP_BASE_URL + SCHOOL_UUID + "/dashboard/parent/student-assgined-teacher",
        body: payload,
        global: true,
        showMessage: false,
        onFaildResolved: true,
        onSuccessResolved: true
    };
    return await callCommonAjax(ajaxReqDetails);
}

function studentAssignedTeacherMapRows(apiResponse){
    var rowList = studentAssignedTeacherResolveList(apiResponse);
    var rows = [];
    $.each(rowList || [], function(index, item){
        rows.push({
            courseName: item.selectedCourses || item.courseName || item.subjectName || item.subject || item.course || "N/A",
            teacherName: item.teacherAssignedForTeacherSupport || item.teacherName || item.assignedTeacherName || item.teacherFullName || item.teacherSupportName || item.facultyName || "N/A"
        });
    });
    return rows;
}

function studentAssignedTeacherResolveList(apiResponse){
    if(!apiResponse){
        return [];
    }
    if($.isArray(apiResponse)){
        return apiResponse;
    }
    var details = apiResponse.details || apiResponse.data || apiResponse.response || {};
    if($.isArray(details)){
        return details;
    }
    var listCandidates = [
        details.assignedTeachers, details.assignedTeacherList, details.studentAssignedTeacherList, details.teacherAssignedList, details.teacherSupportList, details.list, details.rows,
        apiResponse.assignedTeachers, apiResponse.assignedTeacherList, apiResponse.studentAssignedTeacherList, apiResponse.teacherAssignedList, apiResponse.list
    ];
    var resolved = [];
    $.each(listCandidates, function(index, candidate){
        if($.isArray(candidate) && resolved.length === 0){
            resolved = candidate;
        }
    });
    return resolved;
}

function studentAssignedTeacherInitDataTable(){
    if(!$.fn.DataTable){
        return;
    }
    if($.fn.DataTable.isDataTable('#studentAssignedTeacherTable')){
        $('#studentAssignedTeacherTable').DataTable().destroy();
    }
    if($("#studentAssignedTeacherTable tbody tr").length === 0 || $("#studentAssignedTeacherTable tbody td[colspan]").length > 0){
        return;
    }
    var tableObj = $('#studentAssignedTeacherTable').DataTable({
        paging: true,
        searching: true,
        ordering: false,
        info: true,
        pageLength: 10,
        lengthChange: false,
        autoWidth: false,
        dom: 't<"d-flex flex-wrap align-items-center justify-content-between px-3 py-2"i p>',
        language: {
            info: "Showing _START_-_END_ of _TOTAL_ entries",
            paginate: { previous: "Previous", next: "Next" }
        }
    });
    $("#studentAssignedTeacherSearch").off("keyup").on("keyup", function(){
        tableObj.search($(this).val()).draw();
    });
}
