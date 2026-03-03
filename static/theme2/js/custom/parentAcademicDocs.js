async function renderParentAcademicDocsPage(){
    var students = parentAcademicDocsResolveStudentsFromGlobal();
    if(students.length === 0){
        $("#dashboardContentInHTML").html(`<div class="main-card mb-3 card"><div class="card-body text-center">No student found</div></div>`);
        return;
    }
    await parentAcademicDocsRenderByStudent(parentAcademicDocsResolveInitialStudentId(students));
}

function parentAcademicDocsResolveStudentsFromGlobal(){
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

async function parentAcademicDocsRenderByStudent(studentUserId){
    ACTIVE_STUDENT_ID = studentUserId;
    var apiResponse = await parentAcademicDocsFetchByStudent(studentUserId);
    var students = parentAcademicDocsResolveStudentsFromGlobal();
    var rows = parentAcademicDocsMapRows(apiResponse);

    $("#dashboardContentInHTML").html(getParentAcademicDocsContent({
        students: students,
        selectedStudentUserId: studentUserId,
        tabData: { studentBasicDetails: students },
        rows: rows
    }));
    parentAcademicDocsSetActiveStudentThumb(studentUserId);
    parentAcademicDocsOnLoadEvent();
    parentAcademicDocsInitDataTable();
}

async function parentAcademicDocsFetchByStudent(studentUserId){
    var payload = { userId: USER_ID + "", studentUserId: studentUserId + "" };
    var ajaxReqDetails = {
        method: "POST",
        url: APP_BASE_URL + SCHOOL_UUID + "/dashboard/parent/student-academic-details",
        body: payload,
        global: true,
        showMessage: false,
        onFaildResolved: true,
        onSuccessResolved: true
    };
    return await callCommonAjax(ajaxReqDetails);
}

function parentAcademicDocsMapRows(apiResponse){
    var rowList = parentAcademicDocsResolveList(apiResponse);
    var rows = [];
    $.each(rowList || [], function(index, item){
        rows.push({
            batch: item.sessionName || "N/A",
            grade: item.gradeName || "N/A",
            learningProgram: item.learningProgram || "N/A",
            showTranscript: item.showTranscript || "N",
            transcriptUrl: item.transcriptUrl || "",
            diplomaUrl: item.deplomaUrl || item.diplomaUrl || "",
            academicVerificationUrl: item.academicVerficationUrl || item.academicVerificationUrl || ""
        });
    });
    return rows;
}

function parentAcademicDocsResolveList(apiResponse){
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
    var listCandidates = [details.academicDocuments, details.list, details.rows, apiResponse.academicDocuments, apiResponse.list, apiResponse.rows];
    var resolved = [];
    $.each(listCandidates, function(index, candidate){
        if($.isArray(candidate) && resolved.length === 0){
            resolved = candidate;
        }
    });
    return resolved;
}

async function parentAcademicDocsOnStudentTabClick(studentUserId){
    if(!studentUserId){
        return;
    }
    if(String(studentUserId) === String(ACTIVE_STUDENT_ID)){
        return;
    }
    await parentAcademicDocsRenderByStudent(studentUserId);
}

function parentAcademicDocsResolveInitialStudentId(students){
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

function parentAcademicDocsSetActiveStudentThumb(studentUserId){
    $(".student-thumb").removeClass("active active-student");
    $(".student-" + studentUserId).addClass("active active-student");
}

function parentAcademicDocsOnLoadEvent(){
    if($.fn.slick){
        if($('.user-slider').hasClass('slick-initialized')){
            $('.user-slider').slick('unslick');
        }
        $('.user-slider').slick({
            slidesToShow: parentAcademicDocsGetSlidesToShow(),
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

function parentAcademicDocsInitDataTable(){
    if(!$.fn.DataTable){
        return;
    }
    if($.fn.DataTable.isDataTable('#parentAcademicDocsTable')){
        $('#parentAcademicDocsTable').DataTable().destroy();
    }
    if($("#parentAcademicDocsTable tbody tr").length === 0 || $("#parentAcademicDocsTable tbody td[colspan]").length > 0){
        return;
    }
    $('#parentAcademicDocsTable').DataTable({
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

function parentAcademicDocsGetSlidesToShow(){
    var containerWidth = $('.parent-tab-slider-wrapper').width();
    var itemWidth = 220;
    var slides = Math.floor(containerWidth / itemWidth);
    return slides > 0 ? slides : 1;
}
