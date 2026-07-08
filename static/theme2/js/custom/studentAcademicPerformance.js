async function renderStudentAcademicPerformancePage(){
    var apiResponse = await studentAcademicPerformanceFetch();
    var rows = studentAcademicPerformanceMapRows(apiResponse, USER_ID + "");
    $("#dashboardContentInHTML").html(getStudentAcademicPerformanceContent({ rows: rows }, apiResponse.details.courseProviderId));
    studentAcademicPerformanceInitDataTable();
}

async function studentAcademicPerformanceFetch(){
    var payload = { userId: USER_ID + "", studentUserId: USER_ID + "" };
    if (typeof isDummyStudentMode === "function" && isDummyStudentMode() && typeof getDummyStudentAcademicPerformanceResponse === "function") {
        return getDummyStudentAcademicPerformanceResponse(payload);
    }
    var ajaxReqDetails = {
        method: "POST",
        url: APP_BASE_URL + SCHOOL_UUID + "/dashboard/parent/student-academic-performance",
        body: payload,
        global: true,
        showMessage: false,
        onFaildResolved: true,
        onSuccessResolved: true
    };
    return await callCommonAjax(ajaxReqDetails);
}

function studentAcademicPerformanceMapRows(apiResponse, studentUserId){
    var list = studentAcademicPerformanceResolveList(apiResponse);
    var rows = [];
    $.each(list || [], function(index, item){
        rows.push({
            studentUserId: studentUserId,
            lmsEnrollmentId: item.lmsEnrollmentId || "",
            lmsCourseId: item.lmsCourseId || "",
            courseName: item.courseName || "N/A",
            scoreText: studentAcademicPerformanceFormatPercent(item.score),
            pace: item.progressPace || "N/A",
            teacherName: item.teacherName || "N/A",
            endDate: item.endDate || "N/A",
            remainingDays: item.remainingDays || "N/A",
            pendingAssignment: item.pendingAssignment !== undefined ? item.pendingAssignment : "N/A",
            progressGradable: item.progressGradable || 0,
            progressAllActivity: item.progressAllActivity || 0,
            teacherGender: item.teacherGender || ""
        });
    });
    return rows;
}

function studentAcademicPerformanceResolveList(apiResponse){
    if(!apiResponse){ return []; }
    if($.isArray(apiResponse)){ return apiResponse; }
    var details = apiResponse.details || apiResponse.data || apiResponse.response || {};
    if($.isArray(details)){ return details; }
    var listCandidates = [
        details.studentAcademicPerformances, details.rows, details.list,
        apiResponse.studentAcademicPerformances, apiResponse.rows, apiResponse.list
    ];
    var resolved = [];
    $.each(listCandidates, function(_, candidate){
        if($.isArray(candidate) && resolved.length === 0){ resolved = candidate; }
    });
    return resolved;
}

function studentAcademicPerformanceFormatPercent(value){
    var percentValue = parseFloat(value || 0);
    if(isNaN(percentValue)){ return "N/A"; }
    return percentValue.toFixed(2) + "%";
}

function studentAcademicPerformanceInitDataTable(){
    if(!$.fn.DataTable){ return; }
    if($.fn.DataTable.isDataTable('#studentAcademicPerformanceTable')){
        $('#studentAcademicPerformanceTable').DataTable().destroy();
    }
    if($("#studentAcademicPerformanceTable tbody tr").length === 0 || $("#studentAcademicPerformanceTable tbody td[colspan]").length > 0){
        return;
    }
    $('#studentAcademicPerformanceTable').DataTable({
        paging: true,
        searching: false,
        ordering: false,
        info: true,
        pageLength: 10,
        lengthChange: false,
        autoWidth: false,
        dom: 't<"d-flex flex-wrap align-items-center justify-content-between px-3 py-2"i p>',
        language: {
            info: "Showing _START_ to _END_ of _TOTAL_ entries",
            paginate: { previous: "Previous", next: "Next" }
        }
    });
}

function studentAcademicPerformanceOpenProgressDetail(studentUserId, lmsEnrollmentId, lmsCourseId){
    if(!studentUserId || !lmsEnrollmentId || !lmsCourseId){ return; }
    showAndHideDashboardAndAdditionalContent("additional");
    $("#dashboardContentInHTMLAdditional").html(getStudentAcademicPerformanceDetailContent());
    $("#dashboardContentInHTMLAdditional #studentGradeHistoryPopup").appendTo("body");
    studentAcademicPerformanceLoadProgressDetail(studentUserId, lmsEnrollmentId, lmsCourseId);
}

function studentAcademicPerformanceLoadProgressDetail(studentUserId, lmsEnrollmentId, lmsCourseId){
    customLoader(true);
    hideMessage('');
    var payload = { studentUserId: studentUserId, lmsUserId: lmsEnrollmentId, entityId: lmsCourseId };
    if (typeof isDummyStudentMode === "function" && isDummyStudentMode() && typeof getDummyStudentAcademicProgressDetailResponse === "function") {
        studentAcademicPerformanceBindProgressDetailData(getDummyStudentAcademicProgressDetailResponse(studentUserId, lmsEnrollmentId, lmsCourseId));
        customLoader(false);
        return;
    }
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: getURLForHTML('dashboard','get-student-progress-report-detail'),
        data: JSON.stringify(payload),
        dataType: "json",
        cache: false,
        timeout: 600000,
        success: function(data){
            if(data && data.code === "SUCCESS"){
                studentAcademicPerformanceBindProgressDetailData(data);
            }else{
                showMessageTheme2(0, data && data.message ? data.message : "Unable to load course progress detail.");
                showAndHideDashboardAndAdditionalContent("main");
            }
            customLoader(false);
        },
        error: function(){
            showMessageTheme2(0, "Unable to load course progress detail.");
            customLoader(false);
            showAndHideDashboardAndAdditionalContent("main");
        }
    });
}

function studentAcademicPerformanceBindProgressDetailData(data){
    $("#totalAssign").html(data.totalAssignment != null ? data.totalAssignment : 0);
    $("#excusedAssign").html(data.excusedAssign != null ? data.excusedAssign : 0);
    $("#submiteAssign").html(data.submiteAssign != null ? data.submiteAssign : 0);
    $("#upcomingAssign").html(data.upcomingAssign != null ? data.upcomingAssign : 0);
    $("#pendingAssign").html(data.pendingAssign != null ? data.pendingAssign : 0);
    $("#passesAssign").html(data.passesAssign != null ? data.passesAssign : 0);
    $("#failedAssign").html(data.failedAssign != null ? data.failedAssign : 0);
    $("#submitBeforeTimeAssign").html(data.submitBeforeTimeAssign != null ? data.submitBeforeTimeAssign : 0);
    $("#submitOntimeAssign").html(data.submitOntimeAssign != null ? data.submitOntimeAssign : 0);
    $("#submitLateAssign").html(data.submitLateAssign != null ? data.submitLateAssign : 0);
    

    var enrollments = data.response && data.response.enrollments ? data.response.enrollments : null;
    var enrollmentList = enrollments && enrollments.enrollment ? enrollments.enrollment : [];
    if(!$.isArray(enrollmentList) || enrollmentList.length === 0){
        $("#studentLmsProgress").html(`<tr><td colspan="9" class="text-center">No record found</td></tr>`);
        return;
    }

    var enrollment = enrollmentList[0] || {};
    var entity = enrollment.entity || {};
    $("#studentAcademicPerformanceCourseName").html(entity.title || "N/A");
    $("#studentAcademicPerformanceScheduleDate").html((enrollment.startdate || "N/A") + " - " + (enrollment.enddate || "N/A"));

    var grades = enrollment.grades || {};
    var gradePercentage = grades.percentage != null ? grades.percentage : 0;
    $("#studentAcademicPerformanceScore").html(gradePercentage + "%");
    $("#studentAcademicPerformanceGradeLetter").html(grades.letter || "N/A");

    var gradablePercent = grades.complete != null ? grades.complete : 0;
    var gradableDone = grades.completedgradable != null ? grades.completedgradable : 0;
    var gradableTotal = grades.gradable != null ? grades.gradable : 0;
    var allPercent = grades.completeall != null ? grades.completeall : 0;
    var allDone = grades.completed != null ? grades.completed : 0;
    var allTotal = grades.completable != null ? grades.completable : 0;
    $("#studentAcademicPerformancePercentActivity").html(getStudentAcademicPerformancePercentActivityHtml(gradablePercent, gradableDone, gradableTotal, allPercent, allDone, allTotal));

    studentAcademicPerformanceBindItemsRows(enrollment.id, grades.items);
}

function studentAcademicPerformanceBindItemsRows(enrollId, itemsData){
    var html = "";
    var items = itemsData && itemsData.item ? itemsData.item : [];
    if(!$.isArray(items) || items.length === 0){
        $("#studentLmsProgress").html(`<tr><td colspan="9" class="text-center">No record found</td></tr>`);
        return;
    }
    $.each(items, function(_, item){
        var submitStatus = "";
        if(item.submissionStatus){
            submitStatus = item.submissionStatus + (item.lateTime ? (" (" + item.lateTime + ")") : "");
        }
        var status = (item.status || item.submissionStatus || "").toUpperCase();
        var statusIcon = "";
        if(status === "SUBMITTED"){
            statusIcon = `<i class="fa fa-check text-success"></i>`;
        }else if(status === "EXCUSED"){
            statusIcon = `<i class="fa fa-times"></i>`;
        }
        var scoreText = item.unitPercent ? (item.unitPercent + "%") : "";
        html += `<tr>
            <td class="text-left">${studentAcademicPerformanceEscapeHtml(item.title || "N/A")}</td>
            <td>${item.duedate || "N/A"}</td>
            <td class="${item.colorDueText || ''}">${item.submitteddate || "N/A"}</td>
            <td>${item.unitTimeSpent || "N/A"}</td>
            <td class="${item.colorDueText || ''}">${studentAcademicPerformanceEscapeHtml(submitStatus || "N/A")}</td>
            <td class="${item.colorScoreText || ''}">${scoreText}</td>
            <td>${item.letter || ""}</td>`;
        if(submitStatus){
            html += `<td><a href="javascript:void(0);" onclick="studentAcademicPerformanceOpenGradeHistoryPopup('${enrollId || ""}','${item.itemid || ""}')"><i class="fa fa-eye"></i>&nbsp;View</a></td>`;
        }else{
            html += `<td></td>`;
        }
        html += `<td class="text-center">${statusIcon || ""}</td>`;
        html += `</tr>`;
    });
    $("#studentLmsProgress").html(html);
}

function studentAcademicPerformanceOpenGradeHistoryPopup(enrollId, itemId){
    if(!enrollId || !itemId){ return; }
    $("#studentGradeHistoryPopup").modal("show");
    studentAcademicPerformanceLoadGradeHistory(enrollId, itemId);
}

function studentAcademicPerformanceLoadGradeHistory(enrollId, itemId){
    customLoader(true);
    hideMessage('');
    var payload = { itemId: itemId, enrollId: enrollId };
    if (typeof isDummyStudentMode === "function" && isDummyStudentMode() && typeof getDummyStudentAcademicGradeHistoryResponse === "function") {
        studentAcademicPerformanceBindGradeHistoryRows(getDummyStudentAcademicGradeHistoryResponse(itemId));
        customLoader(false);
        return;
    }
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: getURLForHTML('dashboard','get-progress-report-grade-history'),
        data: JSON.stringify(payload),
        dataType: "json",
        success: function(data){
            if(data && data.code === "SUCCESS"){
                studentAcademicPerformanceBindGradeHistoryRows(data);
            }else{
                $("#studentGradeHistory").html(`<tr><td colspan="5" class="text-center">No Record</td></tr>`);
                showMessageTheme2(0, data && data.message ? data.message : "Unable to load grade history.");
            }
            customLoader(false);
        },
        error: function(){
            customLoader(false);
            $("#studentGradeHistory").html(`<tr><td colspan="5" class="text-center">No Record</td></tr>`);
            showMessageTheme2(0, "Unable to load grade history.");
        }
    });
}

function studentAcademicPerformanceBindGradeHistoryRows(data){
    var grades = data && data.response ? data.response.grades : null;
    var gradeList = grades && grades.grade ? grades.grade : [];
    if(!$.isArray(gradeList) || gradeList.length === 0){
        $("#studentGradeHistory").html(`<tr><td colspan="5" class="text-center">No Record</td></tr>`);
        return;
    }
    var html = "";
    $.each(gradeList, function(_, grade){
        var achieved = grade.achieved != null ? grade.achieved : "0";
        var possible = grade.possible != null ? grade.possible : "0";
        var lastActivityDate = grade.lastactivitydate != null ? grade.lastactivitydate : "-";
        var firstName = grade.user && grade.user.firstname ? grade.user.firstname : "";
        var lastName = grade.user && grade.user.lastname ? grade.user.lastname : "";
        html += `<tr>
            <td class="text-left">${lastActivityDate}</td>
            <td>${grade.attempts || 0}</td>
            <td>${grade.expTime || "N/A"}</td>
            <td>${achieved}/${possible} <span class="text-success">${grade.percent || "0"}</span></td>
            <td>${studentAcademicPerformanceEscapeHtml((firstName + " " + lastName).trim())}</td>
        </tr>`;
    });
    $("#studentGradeHistory").html(html);
}

function studentAcademicPerformanceEscapeHtml(value){
    if(value === undefined || value === null){ return ""; }
    return (value + "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
