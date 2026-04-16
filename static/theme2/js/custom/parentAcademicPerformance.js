async function renderParentAcademicPerformancePage(){
    var students = parentAcademicPerformanceResolveStudentsFromGlobal();
    if(students.length === 0){
        $("#dashboardContentInHTML").html(`<div class="main-card mb-3 card"><div class="card-body text-center">No student found</div></div>`);
        return;
    }
    await parentAcademicPerformanceRenderByStudent(parentAcademicPerformanceResolveInitialStudentId(students));
}

function parentAcademicPerformanceResolveStudentsFromGlobal(){
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
    if($.isArray(STUDENT_LIST.students)){
        return STUDENT_LIST.students;
    }
    return [];
}

async function parentAcademicPerformanceRenderByStudent(studentUserId){
    ACTIVE_STUDENT_ID = studentUserId;
    var apiResponse = await parentAcademicPerformanceFetchByStudent(studentUserId);
    var students = parentAcademicPerformanceResolveStudentsFromGlobal();
    var rows = parentAcademicPerformanceMapRows(apiResponse, studentUserId);
    $("#dashboardContentInHTML").html(getParentAcademicPerformanceContent({
        students: students,
        selectedStudentUserId: studentUserId,
        tabData: { studentBasicDetails: students },
        rows: rows,
        courseProviderId: apiResponse.details.courseProviderId
    }));
    parentAcademicPerformanceSetActiveStudentThumb(studentUserId);
    parentAcademicPerformanceOnLoadEvent();
    parentAcademicPerformanceInitDataTable();
}

async function parentAcademicPerformanceFetchByStudent(studentUserId){
    var payload = { userId: USER_ID + "", studentUserId: studentUserId + "" };
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

function parentAcademicPerformanceMapRows(apiResponse, studentUserId){
    var list = parentAcademicPerformanceResolveList(apiResponse);
    var rows = [];
    $.each(list || [], function(index, item){
        rows.push({
            studentUserId: studentUserId,
            lmsEnrollmentId: item.lmsEnrollmentId || "",
            lmsCourseId: item.lmsCourseId || "",
            courseName: item.courseName || "N/A",
            scoreText: parentAcademicPerformanceFormatPercent(item.score),
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

function parentAcademicPerformanceResolveList(apiResponse){
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
        details.studentAcademicPerformances, details.rows, details.list,
        apiResponse.studentAcademicPerformances, apiResponse.rows, apiResponse.list
    ];
    var resolved = [];
    $.each(listCandidates, function(index, candidate){
        if($.isArray(candidate) && resolved.length === 0){
            resolved = candidate;
        }
    });
    return resolved;
}

function parentAcademicPerformanceFormatPercent(value){
    var percentValue = parseFloat(value || 0);
    if(isNaN(percentValue)){
        return "N/A";
    }
    return percentValue.toFixed(2) + "%";
}

async function parentAcademicPerformanceOnStudentTabClick(studentUserId){
    if(!studentUserId){
        return;
    }
    if(String(studentUserId) === String(ACTIVE_STUDENT_ID)){
        return;
    }
    await parentAcademicPerformanceRenderByStudent(studentUserId);
}

function parentAcademicPerformanceResolveInitialStudentId(students){
    var activeId = (typeof ACTIVE_STUDENT_ID !== "undefined" && ACTIVE_STUDENT_ID !== null) ? (ACTIVE_STUDENT_ID + "") : "";
    if(!activeId){
        return students[0].userId;
    }
    var found = false;
    $.each(students || [], function(index, student){
        if(String(student.userId) === activeId){
            found = true;
            return false;
        }
    });
    return found ? activeId : students[0].userId;
}

function parentAcademicPerformanceSetActiveStudentThumb(studentUserId){
    $(".student-thumb").removeClass("active active-student");
    $(".student-" + studentUserId).addClass("active active-student");
}

function parentAcademicPerformanceOnLoadEvent(){
    if($.fn.slick){
        if($('.user-slider').hasClass('slick-initialized')){
            $('.user-slider').slick('unslick');
        }
        $('.user-slider').slick({
            slidesToShow: parentAcademicPerformanceGetSlidesToShow(),
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
}

function parentAcademicPerformanceInitDataTable(){
    if(!$.fn.DataTable){
        return;
    }
    if($.fn.DataTable.isDataTable('#parentAcademicPerformanceTable')){
        $('#parentAcademicPerformanceTable').DataTable().destroy();
    }
    if($("#parentAcademicPerformanceTable tbody tr").length === 0 || $("#parentAcademicPerformanceTable tbody td[colspan]").length > 0){
        return;
    }
    $('#parentAcademicPerformanceTable').DataTable({
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

function parentAcademicPerformanceGetSlidesToShow(){
    var containerWidth = $('.parent-tab-slider-wrapper').width();
    var itemWidth = 220;
    var slides = Math.floor(containerWidth / itemWidth);
    return slides > 0 ? slides : 1;
}

function parentAcademicPerformanceOpenProgressDetail(studentUserId, lmsEnrollmentId, lmsCourseId){
    if(!studentUserId || !lmsEnrollmentId || !lmsCourseId){
        return;
    }
    showAndHideDashboardAndAdditionalContent("additional");
    $("#dashboardContentInHTMLAdditional").html(getParentAcademicPerformanceDetailContent());
    $("#dashboardContentInHTMLAdditional #studentGradeHistoryPopup").appendTo("body");
    parentAcademicPerformanceLoadProgressDetail(studentUserId, lmsEnrollmentId, lmsCourseId);
}

function parentAcademicPerformanceLoadProgressDetail(studentUserId, lmsEnrollmentId, lmsCourseId){
    customLoader(true);
    hideMessage('');
    var payload = { studentUserId: studentUserId, lmsUserId: lmsEnrollmentId, entityId: lmsCourseId };
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
                parentAcademicPerformanceBindProgressDetailData(data);
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

function parentAcademicPerformanceBindProgressDetailData(data){
    var totalAssignment = data.totalAssignment != null ? data.totalAssignment : 0;
    var excusedAssign = data.excusedAssign != null ? data.excusedAssign : 0;
    var submiteAssign = data.submiteAssign != null ? data.submiteAssign : 0;
    var upcomingAssign = data.upcomingAssign != null ? data.upcomingAssign : 0;
    var pendingAssign = data.pendingAssign != null ? data.pendingAssign : 0;
    var passesAssign = data.passesAssign != null ? data.passesAssign : 0;
    var failedAssign = data.failedAssign != null ? data.failedAssign : 0;
    var submitBeforeTimeAssign = data.submitBeforeTimeAssign != null ? data.submitBeforeTimeAssign : 0;
    var submitOntimeAssign = data.submitOntimeAssign != null ? data.submitOntimeAssign : 0;
    var submitLateAssign = data.submitLateAssign != null ? data.submitLateAssign : 0;
    var gradeByTeacher = data.gradeByTeacher != null ? data.gradeByTeacher : 0;

    $("#totalAssign").html(totalAssignment);
    $("#excusedAssign").html(excusedAssign);
    $("#submiteAssign").html(submiteAssign);
    $("#upcomingAssign").html(upcomingAssign);
    $("#pendingAssign").html(pendingAssign);
    $("#passesAssign").html(passesAssign);
    $("#failedAssign").html(failedAssign);
    $("#submitBeforeTimeAssign").html(submitBeforeTimeAssign);
    $("#submitOntimeAssign").html(submitOntimeAssign);
    $("#submitLateAssign").html(submitLateAssign);
    if(USER_ROLE !== "STUDENT"){
        $("#gradeByTeacher").html(gradeByTeacher);
    }

    var enrollments = data.response && data.response.enrollments ? data.response.enrollments : null;
    var enrollmentList = enrollments && enrollments.enrollment ? enrollments.enrollment : [];
    if(!$.isArray(enrollmentList) || enrollmentList.length === 0){
        $("#studentLmsProgress").html(`<tr><td colspan="${USER_ROLE !== "STUDENT" ? "10" : "9"}" class="text-center">No record found</td></tr>`);
        return;
    }

    var enrollment = enrollmentList[0] || {};
    var entity = enrollment.entity || {};
    $("#parentAcademicPerformanceCourseName").html(entity.title || "N/A");
    $("#parentAcademicPerformanceScheduleDate").html((enrollment.startdate || "N/A") + " - " + (enrollment.enddate || "N/A"));

    var grades = enrollment.grades || {};
    var gradePercentage = grades.percentage != null ? grades.percentage : 0;
    $("#parentAcademicPerformanceScore").html(gradePercentage + "%");
    $("#parentAcademicPerformanceGradeLetter").html(grades.letter || "N/A");

    var gradablePercent = grades.complete != null ? grades.complete : 0;
    var gradableDone = grades.completedgradable != null ? grades.completedgradable : 0;
    var gradableTotal = grades.gradable != null ? grades.gradable : 0;
    var allPercent = grades.completeall != null ? grades.completeall : 0;
    var allDone = grades.completed != null ? grades.completed : 0;
    var allTotal = grades.completable != null ? grades.completable : 0;
    $("#parentAcademicPerformancePercentActivity").html(getParentAcademicPerformancePercentActivityHtml(gradablePercent, gradableDone, gradableTotal, allPercent, allDone, allTotal));

    parentAcademicPerformanceBindItemsRows(enrollment.id, grades.items);
}

function parentAcademicPerformanceBindItemsRows(enrollId, itemsData){
    var html = "";
    var items = itemsData && itemsData.item ? itemsData.item : [];
    if(!$.isArray(items) || items.length === 0){
        $("#studentLmsProgress").html(`<tr><td colspan="${USER_ROLE !== "STUDENT" ? "10" : "9"}" class="text-center">No record found</td></tr>`);
        return;
    }
    $.each(items, function(index, item){
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
            <td class="text-left">${parentAcademicPerformanceEscapeHtml(item.title || "N/A")}</td>
            <td>${item.duedate || "N/A"}</td>
            <td class="${item.colorDueText || ''}">${item.submitteddate || "N/A"}</td>
            <td>${item.unitTimeSpent || "N/A"}</td>
            <td class="${item.colorDueText || ''}">${parentAcademicPerformanceEscapeHtml(submitStatus || "N/A")}</td>
            <td class="${item.colorScoreText || ''}">${scoreText}</td>
            <td>${item.letter || ""}</td>`;
        if(USER_ROLE !== "STUDENT"){
            html += `<td>${item.teacherGradeStatus || "N"}</td>`;
        }
        if(submitStatus){
            html += `<td><a href="javascript:void(0);" onclick="parentAcademicPerformanceOpenGradeHistoryPopup('${enrollId || ""}','${item.itemid || ""}')"><i class="fa fa-eye"></i>&nbsp;View</a></td>`;
        }else{
            html += `<td></td>`;
        }
        html += `<td class="text-center">${statusIcon || ""}</td>`;
        html += `</tr>`;
    });
    $("#studentLmsProgress").html(html);
}

function parentAcademicPerformanceOpenGradeHistoryPopup(enrollId, itemId){
    if(!enrollId || !itemId){
        return;
    }
    $("#studentGradeHistoryPopup").modal("show");
    parentAcademicPerformanceLoadGradeHistory(enrollId, itemId);
}

function parentAcademicPerformanceLoadGradeHistory(enrollId, itemId){
    customLoader(true);
    hideMessage('');
    var payload = { itemId: itemId, enrollId: enrollId };
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: getURLForHTML('dashboard','get-progress-report-grade-history'),
        data: JSON.stringify(payload),
        dataType: "json",
        success: function(data){
            if(data && data.code === "SUCCESS"){
                parentAcademicPerformanceBindGradeHistoryRows(data);
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

function parentAcademicPerformanceBindGradeHistoryRows(data){
    var grades = data && data.response ? data.response.grades : null;
    var gradeList = grades && grades.grade ? grades.grade : [];
    if(!$.isArray(gradeList) || gradeList.length === 0){
        $("#studentGradeHistory").html(`<tr><td colspan="5" class="text-center">No Record</td></tr>`);
        return;
    }
    var html = "";
    $.each(gradeList, function(index, grade){
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
            <td>${parentAcademicPerformanceEscapeHtml((firstName + " " + lastName).trim())}</td>
        </tr>`;
    });
    $("#studentGradeHistory").html(html);
}

function parentAcademicPerformanceEscapeHtml(value){
    if(value === undefined || value === null){
        return "";
    }
    return (value + "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
