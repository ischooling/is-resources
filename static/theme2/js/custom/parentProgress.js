var PARENT_PROGRESS_WEEKLY_SCRIPT_LOADED = false;
var PARENT_PROGRESS_ALL_ROWS = [];
var PARENT_PROGRESS_FILTER_VIEW = null;

async function renderParentProgressPage(){
    var students = parentProgressResolveStudentsFromGlobal();
    if(students.length === 0){
        $("#dashboardContentInHTML").html(`<div class="main-card mb-3 card"><div class="card-body text-center">No student found</div></div>`);
        return;
    }
    await parentProgressRenderByStudent(parentProgressResolveInitialStudentId(students));
}

function parentProgressResolveStudentsFromGlobal(){
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

async function parentProgressRenderByStudent(studentUserId){
    ACTIVE_STUDENT_ID = studentUserId;
    var apiResponse = await parentProgressFetchByStudent(studentUserId);
    var students = parentProgressResolveStudentsFromGlobal();
    var rows = parentProgressMapRows(apiResponse);
    PARENT_PROGRESS_ALL_ROWS = rows;
    PARENT_PROGRESS_FILTER_VIEW = null;
    $("#dashboardContentInHTML").html(getParentProgressContent({
        students: students,
        selectedStudentUserId: studentUserId,
        tabData: { studentBasicDetails: students },
        rows: rows
    }));
    parentProgressSetActiveStudentThumb(studentUserId);
    parentProgressOnLoadEvent();
    parentProgressInitDataTable();
}

async function parentProgressFetchByStudent(studentUserId, startDate, endDate){
    var payload = { userId: USER_ID + "", studentUserId: studentUserId + "" };
    if(startDate && endDate){
        payload.startDate = startDate;
        payload.endDate = endDate;
    }
    var ajaxReqDetails = {
        method: "POST",
        url: APP_BASE_URL + SCHOOL_UUID + "/dashboard/parent/weekly-progress-reports-detail",
        body: payload,
        global: true,
        showMessage: false,
        onFaildResolved: true,
        onSuccessResolved: true
    };
    return await dummyGetParentProgressData(studentUserId, ajaxReqDetails);
}

function parentProgressMapRows(apiResponse){
    var list = parentProgressResolveList(apiResponse);
    var rows = [];
    $.each(list || [], function(index, item){
        var reportType = "Weekly Progress Report";
        if(item.daysType == 14 || item.daysType == 15){
            reportType = "Biweekly Progress Report";
        }else if(item.daysType == 28 || item.daysType == 30){
            reportType = "Monthly Progress Report";
        }
        rows.push({
            reportType: reportType,
            reportFrequency: parentProgressGetDateRange(item.reportStartDate, item.reportEndDate),
            publishedDate: item.createdDate || "N/A",
            viewUrl: parentProgressNormalizeUrl(item.playloadUrl || item.payloadUrl || item.reportUrl || "")
        });
    });
    return rows;
}

function parentProgressResolveList(apiResponse){
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
        details.studentWeeklyProgressReports, details.weeklyProgressReports, details.rows, details.list,
        apiResponse.studentWeeklyProgressReports, apiResponse.weeklyProgressReports, apiResponse.rows, apiResponse.list
    ];
    var resolved = [];
    $.each(listCandidates, function(index, candidate){
        if($.isArray(candidate) && resolved.length === 0){
            resolved = candidate;
        }
    });
    return resolved;
}

function parentProgressGetDateRange(startDate, endDate){
    var startValue = startDate || "N/A";
    var endValue = endDate || "N/A";
    if(startValue === "N/A" && endValue === "N/A"){
        return "N/A";
    }
    return startValue + " - " + endValue;
}

function parentProgressNormalizeUrl(url){
    if(!url){
        return "";
    }
    var normalized = (url + "").replace("http://localhost:8080//", "http://localhost:8080/");
    normalized = normalized.replace("https://localhost:8080//", "https://localhost:8080/");
    return normalized;
}

function parentProgressOpenReport(encodedUrl){
    var url = decodeURIComponent(encodedUrl || "");
    if(!url){
        return;
    }
    showAndHideDashboardAndAdditionalContent("additional");
    $("#dashboardContentInHTMLAdditional").html(parentProgressAdditionalLoader());
    customLoader(true);

    return dummyOpenParentProgressReport(url);
}

function parentProgressDetailWrapper(innerHtml){
    return `<div class="full mb-2 d-flex justify-content-end">
            <a href="javascript:void(0)" onclick="showAndHideDashboardAndAdditionalContent('main')" class="btn btn-dark rounded">
                <i class="fa fa-arrow-left mr-1" aria-hidden="true"></i>Back
            </a>
        </div>
        <div class="full">${innerHtml}</div>`;
}

function parentProgressAdditionalLoader(){
    return `<div class="main-card mb-3 card"><div class="card-body text-center">Loading...</div></div>`;
}

function parentProgressExtractBodyHtml(htmlContent){
    if(!htmlContent){
        return "";
    }
    var lowerHtml = htmlContent.toLowerCase();
    var bodyStart = lowerHtml.indexOf("<body");
    if(bodyStart < 0){
        return htmlContent;
    }
    var bodyStartClose = lowerHtml.indexOf(">", bodyStart);
    var bodyEnd = lowerHtml.lastIndexOf("</body>");
    if(bodyStartClose < 0 || bodyEnd < 0 || bodyEnd <= bodyStartClose){
        return htmlContent;
    }
    return htmlContent.substring(bodyStartClose + 1, bodyEnd);
}

function parentProgressRenderDetailHtml(htmlContent){
    var detailContent = parentProgressExtractBodyHtml(htmlContent);
    var tempDiv = $("<div></div>").html(detailContent);
    var gradebookStyleCss = parentProgressExtractGradebookStyleCss(htmlContent);
    var gradebookInitScript = parentProgressExtractGradebookInitScript(htmlContent);
    var weeklyProgressScriptSrc = "";

    tempDiv.find("script").each(function(){
        var scriptSrc = $(this).attr("src") || "";
        if(scriptSrc && scriptSrc.toLowerCase().indexOf("dashboardweeklyprogress.js") > -1){
            weeklyProgressScriptSrc = scriptSrc;
        }
    });
    tempDiv.find("script").remove();
    tempDiv.find("#commonloaderIdNewLoader, #commonloaderId, #commonloaderBody, .server-message").remove();

    var styleHtml = gradebookStyleCss ? `<style id="parentProgressGradebookStyle">${gradebookStyleCss}</style>` : "";
    $("#dashboardContentInHTMLAdditional").html(parentProgressDetailWrapper(styleHtml + tempDiv.html()));
    parentProgressEnsureWeeklyProgressScriptAndRunInline(weeklyProgressScriptSrc, gradebookInitScript);
}

function parentProgressExtractGradebookStyleCss(htmlContent){
    if(!htmlContent){
        return "";
    }
    var styleByIdRegex = /<style[^>]*id=["']gradebookSummaryStyleBlock["'][^>]*>([\s\S]*?)<\/style>/i;
    var byIdMatch = htmlContent.match(styleByIdRegex);
    if(byIdMatch && byIdMatch[1]){
        return byIdMatch[1];
    }
    var firstStyleRegex = /<style[^>]*>([\s\S]*?)<\/style>/i;
    var firstMatch = htmlContent.match(firstStyleRegex);
    return firstMatch && firstMatch[1] ? firstMatch[1] : "";
}

function parentProgressExtractGradebookInitScript(htmlContent){
    if(!htmlContent){
        return "";
    }
    var scriptRegex = /<script[^>]*id=["']gradebookSummaryInitScript["'][^>]*>([\s\S]*?)<\/script>/i;
    var match = htmlContent.match(scriptRegex);
    return match && match[1] ? match[1] : "";
}

function parentProgressEnsureWeeklyProgressScriptAndRunInline(weeklyProgressScriptSrc, scriptCode){
    var runInlineScript = function(){
        if(!scriptCode){
            return;
        }
        try{
            $.globalEval(scriptCode);
        }catch(e){
            console.error("Progress report inline script execution failed:", e);
        }
    };

    if(typeof callDateWiseGradebokSummary === "function" || PARENT_PROGRESS_WEEKLY_SCRIPT_LOADED){
        runInlineScript();
        return;
    }
    if(!weeklyProgressScriptSrc){
        runInlineScript();
        return;
    }
    $.getScript(weeklyProgressScriptSrc).always(function(){
        PARENT_PROGRESS_WEEKLY_SCRIPT_LOADED = true;
        runInlineScript();
    });
}

async function parentProgressOnStudentTabClick(studentUserId){
    if(!studentUserId){
        return;
    }
    if(String(studentUserId) === String(ACTIVE_STUDENT_ID)){
        return;
    }
    await parentProgressRenderByStudent(studentUserId);
}

function parentProgressResolveInitialStudentId(students){
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

function parentProgressSetActiveStudentThumb(studentUserId){
    $(".student-thumb").removeClass("active active-student");
    $(".student-" + studentUserId).addClass("active active-student");
}

function parentProgressOnLoadEvent(){
    if($.fn.datepicker){
        $("#progressStartDate").datepicker({autoclose: true, format: 'M d, yyyy', container: 'body'});
        $("#progressEndDate").datepicker({autoclose: true, format: 'M d, yyyy', container: 'body'});
    }
    if($.fn.slick){
        if($('.user-slider').hasClass('slick-initialized')){
            $('.user-slider').slick('unslick');
        }
        $('.user-slider').slick({
            slidesToShow: parentProgressGetSlidesToShow(),
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

function parentProgressInitDataTable(){
    if(!$.fn.DataTable){
        return;
    }
    if($.fn.DataTable.isDataTable('#parentProgressTable')){
        $('#parentProgressTable').DataTable().destroy();
    }
    if($("#parentProgressTable tbody tr").length === 0 || $("#parentProgressTable tbody td[colspan]").length > 0){
        return;
    }
    $('#parentProgressTable').DataTable({
        paging: true,
        searching: false,
        ordering: true,
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

function parentProgressGetSlidesToShow(){
    var containerWidth = $('.parent-tab-slider-wrapper').width();
    var itemWidth = 220;
    var slides = Math.floor(containerWidth / itemWidth);
    return slides > 0 ? slides : 1;
}

async function parentProgressViewFilter(src, filterType){
    PARENT_PROGRESS_FILTER_VIEW = filterType;
    $(".progress-view-button").removeClass("active");
    $(src).addClass("active");
    $(".progress-custom-filter-form").css("visibility","hidden");
    await parentProgressApplyFilter();
}

function parentProgressShowCustomFilter(src){
    PARENT_PROGRESS_FILTER_VIEW = "custom";
    $(".progress-view-button").removeClass("active");
    $(src).addClass("active");
    $(".progress-custom-filter-form").css("visibility","visible");
}

async function parentProgressApplyFilter(){
    var startDate = "", endDate = "";
    if(PARENT_PROGRESS_FILTER_VIEW === "agendaMonth"){
        startDate = moment().startOf('month').format('YYYY-MM-DD');
        endDate = moment().endOf('month').format('YYYY-MM-DD');
    }else if(PARENT_PROGRESS_FILTER_VIEW === "agendaWeek"){
        startDate = moment().startOf('week').format('YYYY-MM-DD');
        endDate = moment().endOf('week').format('YYYY-MM-DD');
    }else if(PARENT_PROGRESS_FILTER_VIEW === "custom"){
        var startVal = $("#progressStartDate").val();
        var endVal = $("#progressEndDate").val();
        if(!startVal || !endVal){
            return;
        }
        startDate = moment(new Date(startVal)).format('YYYY-MM-DD');
        endDate = moment(new Date(endVal)).format('YYYY-MM-DD');
    }
    var apiResponse = await parentProgressFetchByStudent(ACTIVE_STUDENT_ID, startDate, endDate);
    var rows = parentProgressMapRows(apiResponse);
    PARENT_PROGRESS_ALL_ROWS = rows;
    parentProgressUpdateTable(rows);
}

function parentProgressUpdateTable(rows){
    if($.fn.DataTable && $.fn.DataTable.isDataTable('#parentProgressTable')){
        $('#parentProgressTable').DataTable().destroy();
    }
    $("#parentProgressTable tbody").html(getParentProgressRowsHtml(rows));
    parentProgressInitDataTable();
}
