async function renderParentSyllabusAssignedTeacherPage(){
    var students = parentAssignedTeacherResolveStudentsFromGlobal();
    if(students.length === 0){
        $("#dashboardContentInHTML").html(`<div class="main-card mb-3 card"><div class="card-body text-center">No student found</div></div>`);
        return;
    }
    await parentAssignedTeacherRenderByStudent(parentAssignedTeacherResolveInitialStudentId(students));
}

function parentAssignedTeacherResolveStudentsFromGlobal(){
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

async function parentAssignedTeacherRenderByStudent(studentUserId){
    ACTIVE_STUDENT_ID = studentUserId;
    var students = parentAssignedTeacherResolveStudentsFromGlobal();
    var apiResponse = await parentAssignedTeacherFetchAssignedTeacherList(studentUserId);
    var rows = parentAssignedTeacherMapRows(apiResponse);

    $("#dashboardContentInHTML").html(getParentSyllabusAssignedTeacherContent({
        students: students,
        selectedStudentUserId: studentUserId,
        tabData: { studentBasicDetails: students },
        rows: rows
    }));
    parentAssignedTeacherSetActiveStudentThumb(studentUserId);
    parentAssignedTeacherOnLoadEvent();
    parentAssignedTeacherInitDataTable();
}

async function parentAssignedTeacherFetchAssignedTeacherList(studentUserId){
    var payload = {
        userId: USER_ID + "",
        studentUserId: studentUserId + ""
    };
    var ajaxReqDetails = {
        method: "POST",
        url: APP_BASE_URL + SCHOOL_UUID + "/dashboard/parent/student-assgined-teacher",
        body: payload,
        global: true,
        showMessage: false,
        onFaildResolved: true,
        onSuccessResolved: true
    };
    return await dummyGetParentAssignedTeacherList(studentUserId, ajaxReqDetails);
}

function parentAssignedTeacherMapRows(apiResponse){
    var rowList = parentAssignedTeacherResolveList(apiResponse);
    var rows = [];
    $.each(rowList || [], function(index, item){
        rows.push({
            courseName: item.selectedCourses || item.courseName || item.subjectName || item.subject || item.course || "N/A",
            teacherName: item.teacherAssignedForTeacherSupport || item.teacherName || item.assignedTeacherName || item.teacherFullName || item.teacherSupportName || item.facultyName || "N/A",
            teacherGender: item.teacherGender ||"N/A"
        });
    });
    return rows;
}

function parentAssignedTeacherResolveList(apiResponse){
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

async function parentAssignedTeacherOnStudentTabClick(studentUserId){
    if(!studentUserId){
        return;
    }
    if(String(studentUserId) === String(ACTIVE_STUDENT_ID)){
        return;
    }
    await parentAssignedTeacherRenderByStudent(studentUserId);
}

function parentAssignedTeacherResolveInitialStudentId(students){
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

function parentAssignedTeacherSetActiveStudentThumb(studentUserId){
    $(".student-thumb").removeClass("active active-student");
    $(".student-" + studentUserId).addClass("active active-student");
}

function parentAssignedTeacherOnLoadEvent(){
    if($.fn.slick){
        if($('.user-slider').hasClass('slick-initialized')){
            $('.user-slider').slick('unslick');
        }
        $('.user-slider').slick({
            slidesToShow: parentAssignedTeacherGetSlidesToShow(),
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

function parentAssignedTeacherInitDataTable(){
    if(!$.fn.DataTable){
        return;
    }
    if($.fn.DataTable.isDataTable('#parentAssignedTeacherTable')){
        $('#parentAssignedTeacherTable').DataTable().destroy();
    }
    if($("#parentAssignedTeacherTable tbody tr").length === 0 || $("#parentAssignedTeacherTable tbody td[colspan]").length > 0){
        return;
    }
    var parentAssignedTeacherTable = $('#parentAssignedTeacherTable').DataTable({
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
    // $("#parentAssignedTeacherSearch").off("keyup").on("keyup", function(){
    //     parentAssignedTeacherTable.search($(this).val()).draw();
    // });
}

function parentAssignedTeacherGetSlidesToShow(){
    var containerWidth = $('.parent-tab-slider-wrapper').width();
    var itemWidth = 220;
    var slides = Math.floor(containerWidth / itemWidth);
    return slides > 0 ? slides : 1;
}
