async function renderStudentSyllabusAssignedTeacherPage(){
    var apiResponse = await studentAssignedTeacherFetchList();
    var rows = studentAssignedTeacherMapRows(apiResponse);
    $("#dashboardContentInHTML").html(getStudentSyllabusAssignedTeacherContent({ rows: rows }));
    studentAssignedTeacherInitDataTable();
}

async function studentAssignedTeacherFetchList(){
    if(typeof isDummyStudentMode === "function" && isDummyStudentMode() && typeof getDummyStudentAssignedTeacherResponse === "function"){
        return getDummyStudentAssignedTeacherResponse();
    }
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
        var courseName = item.selectedCourses || item.courseName || item.subjectName || item.subject || item.course || "N/A";
        rows.push({
            courseName: courseName,
            teacherName: item.teacherAssignedForTeacherSupport || item.teacherName || item.assignedTeacherName || item.teacherFullName || item.teacherSupportName || item.facultyName || "N/A",
            lmsUserId: item.lmsUserId || "",
            lmsCourseId: item.lmsCourseId || ""
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

function studentAssignedTeacherOpenCourseCalendar(element, lmsUserId, lmsCourseId){
    var courseName = element && element.nodeType === 1 ? ($(element).attr("data-course-name") || $(element).text()) : "";
    studentAssignedTeacherEnsureCourseCalendarDrawer();
    $("#studentCourseCalendarDrawerTitle").html("Course Calendar: "+studentAssignedTeacherEscapeHtml(courseName || ""));
    if(!lmsUserId || !lmsCourseId){
        $("#studentCourseCalendarDrawerBody").html(`<div class="alert alert-warning m-3">Course calendar is not available for this course.</div>`);
        $("#studentCourseCalendarDrawer").modal("show");
        return false;
    }
    $("#studentCourseCalendarDrawerBody").html(studentAssignedTeacherCourseCalendarLoaderHtml());
    $("#studentCourseCalendarDrawer").modal("show");
    studentAssignedTeacherLoadCourseCalendar(lmsUserId, lmsCourseId);
    return false;
}

function studentAssignedTeacherEnsureCourseCalendarDrawer(){
    if($("#studentCourseCalendarDrawer").length > 0){
        return;
    }
    $("body").append(`<style id="studentCourseCalendarStyle">
        #studentCourseCalendarDrawer {
            overflow: hidden !important;
        }
        #studentCourseCalendarDialog {
            position: fixed;
            top: 50%;
            left: 50%;
            width: calc(100% - 56px);
            max-width: 1180px;
            margin: 0;
            transform: translate(-50%, -50%);
        }
        #studentCourseCalendarDrawer .modal-content {
            max-height: calc(100vh - 64px);
            border-radius: 6px;
            box-shadow: 0 18px 45px rgba(15,23,42,.28);
            overflow: hidden;
        }
        #studentCourseCalendarDrawerBody {
            max-height: calc(100vh - 130px);
            overflow-y: auto;
            padding: 0;
            background: #fff;
        }
        .student-course-module-wrapper {
            padding: 20px 24px 28px;
        }
        .student-course-module {
            background: #f3f3f3;
            margin-bottom: 16px;
        }
        .student-course-module-head {
            display: flex;
            align-items: center;
            min-height: 64px;
            padding: 8px 16px;
            color: #202124;
            cursor: pointer;
        }
        .student-course-module-toggle {
            width: 40px;
            text-align: center;
            font-size: 22px;
            color: #1f1f1f;
            flex: 0 0 40px;
        }
        .student-course-module.collapsed .student-course-module-items {
            display: none;
        }
        .student-course-module-folder {
            width: 52px;
            height: 52px;
            border-radius: 3px;
            background: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 18px;
            color: #1976d2;
            font-size: 28px;
            flex: 0 0 52px;
        }
        .student-course-module-title {
            flex: 1;
            min-width: 0;
            font-size: 18px;
            font-weight: 500;
            line-height: 1.25;
            margin: 0;
        }
        .student-course-due-date-heading {
            min-width: 155px;
            text-align: right;
            color: #5f6368;
            font-size: 14px;
            font-weight: 700;
            margin-left: 16px;
        }
        .student-course-module-item {
            display: flex;
            align-items: center;
            min-height: 58px;
            padding: 8px 22px 8px 92px;
            background: #fff;
            border-bottom: 1px solid #f1f3f4;
        }
        .student-course-module-item:last-child {
            border-bottom: 0;
        }
        .student-course-module-item.active-item {
            background: #f3f3f3;
        }
        .student-course-content-icon {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #1976d2;
            font-size: 22px;
            position: relative;
            margin-right: 18px;
            flex: 0 0 36px;
        }
        .student-course-module-item.active-item .student-course-content-icon {
            background: #fff;
        }
        .student-course-status-dot {
            position: absolute;
            top: -2px;
            right: -2px;
            width: 15px;
            height: 15px;
            border-radius: 50%;
            background: #07820f;
            color: #fff;
            font-size: 9px;
            line-height: 15px;
            text-align: center;
        }
        .student-course-content-title {
            flex: 1;
            min-width: 0;
            font-size: 17px;
            line-height: 1.3;
            color: #202124;
            margin: 0;
        }
        .student-course-due-date {
            min-width: 155px;
            text-align: right;
            color: #5f6368;
            font-size: 14px;
            font-weight: 600;
            margin-left: 16px;
        }
        @media (max-width: 767px) {
            #studentCourseCalendarDialog {
                width: calc(100% - 20px);
            }
            .student-course-module-wrapper {
                padding: 14px 10px 22px;
            }
            .student-course-module-head {
                padding: 8px;
            }
            .student-course-module-folder {
                width: 44px;
                height: 44px;
                margin-right: 12px;
                font-size: 24px;
            }
            .student-course-module-title,
            .student-course-content-title {
                font-size: 15px;
            }
            .student-course-due-date-heading {
                display: none;
            }
            .student-course-module-item {
                padding: 8px 10px 8px 48px;
                align-items: flex-start;
            }
            .student-course-content-icon {
                margin-right: 12px;
            }
            .student-course-due-date {
                min-width: 0;
                text-align: left;
                margin: 4px 0 0;
            }
        }
    </style>
    <div class="modal fade" id="studentCourseCalendarDrawer" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog" id="studentCourseCalendarDialog" role="document">
            <div class="modal-content border-0">
                <div class="modal-header text-white py-2 bg-primary">
                    <div>
                        <h5 class="modal-title mb-0 font-16" id="studentCourseCalendarDrawerTitle">Course Details</h5>
                    </div>
                    <button type="button" class="close text-white opacity-100" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body p-0" id="studentCourseCalendarDrawerBody"></div>
            </div>
        </div>
    </div>`);
}

function studentAssignedTeacherPositionCourseCalendarDrawer(element){
    var $dialog = $("#studentCourseCalendarDialog");
    if(!$dialog.length || !element || element.nodeType !== 1){
        return;
    }
    var $element = $(element);
    var elementOffset = $element.offset();
    var modalWidth = Math.min(760, Math.max(320, $(window).width() - 32));
    var left = elementOffset.left + $element.outerWidth() + 12;
    var pointerCss = { left: "-7px", right: "auto", boxShadow: "-2px 2px 5px rgba(15,23,42,.12)" };
    if(left + modalWidth > $(window).scrollLeft() + $(window).width() - 12){
        left = elementOffset.left - modalWidth - 12;
        pointerCss = { left: "auto", right: "-7px", boxShadow: "2px -2px 5px rgba(15,23,42,.12)" };
    }
    if(left < $(window).scrollLeft() + 12){
        left = $(window).scrollLeft() + 12;
    }
    var top = elementOffset.top - 24;
    var maxTop = $(window).scrollTop() + $(window).height() - 120;
    if(top > maxTop){
        top = maxTop;
    }
    if(top < $(window).scrollTop() + 12){
        top = $(window).scrollTop() + 12;
    }
    $dialog.css({
        width: modalWidth + "px",
        maxWidth: modalWidth + "px",
        left: left + "px",
        top: top + "px"
    });
    $dialog.find(".student-course-calendar-pointer").css(pointerCss);
}

async function studentAssignedTeacherLoadCourseCalendar(lmsUserId, lmsCourseId){
    hideMessage('');
    var payload = { userId: USER_ID + "", studentUserId: USER_ID + "", lmsUserId: lmsUserId, lmsCourseId: lmsCourseId };
    try {
        var data = await callCommonAjax({
            method: "POST",
            url: APP_BASE_URL + SCHOOL_UUID + "/dashboard/parent/student-course-content",
            body: payload,
            global: false,
            showMessage: false,
            onFaildResolved: true,
            onSuccessResolved: true
        });
        if(data && data.status === "1"){
            studentAssignedTeacherBindCourseCalendar(data);
        }else{
            $("#studentCourseCalendarDrawerBody").html(`<div class="alert alert-danger m-3">Unable to load course calendar.</div>`);
        }
    } catch (e) {
        $("#studentCourseCalendarDrawerBody").html(`<div class="alert alert-danger m-3">Unable to load course calendar.</div>`);
    }
}

function studentAssignedTeacherCourseCalendarLoaderHtml(){
    return `<div class="py-5 text-center">
        <div class="spinner-border text-primary mb-2" role="status" style="width:2rem;height:2rem;">
            <span class="sr-only">Loading...</span>
        </div>
        <div class="font-12 text-muted">Loading course calendar...</div>
    </div>`;
}

function studentAssignedTeacherBindCourseCalendar(data){
    var details = data && data.details ? data.details : {};
    $("#studentCourseCalendarDrawerBody").html(studentAssignedTeacherCourseContentModules(details.modules || []));
}

function studentAssignedTeacherCourseContentModules(modules){
    if(!$.isArray(modules) || modules.length < 1){
        return `<div class="p-3 text-center">No course content found</div>`;
    }
    var html = `<div class="student-course-module-wrapper">`;
    $.each(modules, function(moduleIndex, moduleData){
        var items = moduleData.items || [];
        html += `<div class="student-course-module">
            <div class="student-course-module-head" onclick="studentAssignedTeacherToggleCourseModule(this)">
                <div class="student-course-module-toggle"><i class="fa fa-angle-down"></i></div>
                <div class="student-course-module-folder"><i class="fa fa-folder-o"></i></div>
                <h3 class="student-course-module-title">${studentAssignedTeacherEscapeHtml(moduleData.moduleName || "Module")}</h3>
                <div class="student-course-due-date-heading">Targeted Due Date</div>
            </div>
            <div class="student-course-module-items">`;
        if(!$.isArray(items) || items.length < 1){
            html += `<div class="student-course-module-item">
                <div class="student-course-content-icon"><i class="fa fa-list-alt"></i></div>
                <p class="student-course-content-title text-muted">No content found</p>
                <div class="student-course-due-date">N/A</div>
            </div>`;
        }
        $.each(items, function(itemIndex, item){
            var activeClass = moduleIndex === 0 && itemIndex === 0 ? " active-item" : "";
            var lmsProviderUrl = item.lmsProviderUrl || item.lmsProviderURL || item.lmsProviderurl || "";
            var isPayLmsPaymentPending = item.isPayLmsPaymentPending || "";
            html += `<div class="student-course-module-item${activeClass}">
                <div class="student-course-content-icon">
                    <i class="fa fa-list-alt"></i>
                    <span class="student-course-status-dot"><i class="fa fa-check"></i></span>
                </div>
                <p class="student-course-content-title">
                    <a href="javascript:void(0)" class="text-primary" onclick="return redirectLmsFromStudentCourse(this,'${studentAssignedTeacherEscapeAttr(isPayLmsPaymentPending)}','${studentAssignedTeacherEscapeAttr(lmsProviderUrl)}')">${studentAssignedTeacherEscapeHtml(item.contentName || "N/A")}</a>
                </p>
                <div class="student-course-due-date">${studentAssignedTeacherEscapeHtml(item.dueDate || "N/A")}</div>
            </div>`;
        });
        html += `</div></div>`;
    });
    html += `</div>`;
    return html;
}

function studentAssignedTeacherToggleCourseModule(headerElement){
    var moduleElement = $(headerElement).closest(".student-course-module");
    moduleElement.toggleClass("collapsed");
    var icon = moduleElement.find(".student-course-module-toggle i").first();
    icon.toggleClass("fa-angle-down", !moduleElement.hasClass("collapsed"));
    icon.toggleClass("fa-angle-right", moduleElement.hasClass("collapsed"));
    return false;
}

function studentAssignedTeacherEscapeHtml(value){
    return value == null ? "" : (value + "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function studentAssignedTeacherEscapeAttr(value){
    return studentAssignedTeacherEscapeHtml(value).replace(/`/g, "&#96;");
}
