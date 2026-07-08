var STUDENT_PROGRESS_WEEKLY_SCRIPT_LOADED = false;

async function renderStudentProgressDetailPage(){
    var apiResponse = await studentProgressDetailFetch();
    var rows = studentProgressDetailMapRows(apiResponse);
    $("#dashboardContentInHTML").html(getStudentProgressDetailContent({ rows: rows }));
    studentProgressDetailInitDataTable();
}

async function studentProgressDetailFetch(){
    var payload = { userId: USER_ID + "", studentUserId: USER_ID + "" };
    if (typeof isDummyStudentMode === "function" && isDummyStudentMode() && typeof getDummyStudentProgressReportsResponse === "function") {
        return getDummyStudentProgressReportsResponse(payload);
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
    return await callCommonAjax(ajaxReqDetails);
}

function studentProgressDetailMapRows(apiResponse){
    var list = studentProgressDetailResolveList(apiResponse);
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
            reportFrequency: studentProgressDetailGetDateRange(item.reportStartDate, item.reportEndDate),
            publishedDate: item.createdDate || "N/A",
            viewUrl: studentProgressDetailNormalizeUrl(item.playloadUrl || item.payloadUrl || item.reportUrl || "")
        });
    });
    return rows;
}

function studentProgressDetailResolveList(apiResponse){
    if(!apiResponse){ return []; }
    if($.isArray(apiResponse)){ return apiResponse; }
    var details = apiResponse.details || apiResponse.data || apiResponse.response || {};
    if($.isArray(details)){ return details; }
    var listCandidates = [
        details.studentWeeklyProgressReports, details.weeklyProgressReports, details.rows, details.list,
        apiResponse.studentWeeklyProgressReports, apiResponse.weeklyProgressReports, apiResponse.rows, apiResponse.list
    ];
    var resolved = [];
    $.each(listCandidates, function(_, candidate){
        if($.isArray(candidate) && resolved.length === 0){ resolved = candidate; }
    });
    return resolved;
}

function studentProgressDetailGetDateRange(startDate, endDate){
    var startValue = startDate || "N/A";
    var endValue = endDate || "N/A";
    if(startValue === "N/A" && endValue === "N/A"){ return "N/A"; }
    return startValue + " - " + endValue;
}

function studentProgressDetailNormalizeUrl(url){
    if(!url){ return ""; }
    var normalized = (url + "").replace("http://localhost:8080//", "http://localhost:8080/");
    normalized = normalized.replace("https://localhost:8080//", "https://localhost:8080/");
    return normalized;
}

function studentProgressDetailOpenReport(encodedUrl){
    var url = decodeURIComponent(encodedUrl || "");
    if(!url){ return; }
    showAndHideDashboardAndAdditionalContent("additional");
    $("#dashboardContentInHTMLAdditional").html(studentProgressDetailAdditionalLoader());
    customLoader(true);
    if (typeof isDummyStudentMode === "function" && isDummyStudentMode() && typeof getDummyStudentProgressReportHtml === "function" && url.indexOf("dummy-student-progress-report://") === 0) {
        studentProgressDetailRenderDetailHtml(getDummyStudentProgressReportHtml(url));
        customLoader(false);
        return;
    }

    $.ajax({
        type: "GET",
        url: url,
        dataType: "html",
        cache: false,
        timeout: 600000,
        success: function(htmlContent){
            if(htmlContent != ""){
                var stringMessage = htmlContent.split("|");
                if(stringMessage[0] == "FAILED" || stringMessage[0] == "EXCEPTION" || stringMessage[0] == "SESSIONOUT"){
                    if(stringMessage[0] == "SESSIONOUT"){
                        redirectLoginPage();
                    }else{
                        showMessageTheme2(0, stringMessage[1]);
                        showAndHideDashboardAndAdditionalContent("main");
                    }
                    customLoader(false);
                    return false;
                }
            }
            studentProgressDetailRenderDetailHtml(htmlContent);
            customLoader(false);
        },
        error: function(){
            showMessageTheme2(0, "Unable to load progress report detail.");
            customLoader(false);
            showAndHideDashboardAndAdditionalContent("main");
        }
    });
}

function studentProgressDetailDetailWrapper(innerHtml){
    return `<div class="full my-2 d-flex justify-content-end">
            <a href="javascript:void(0)" onclick="showAndHideDashboardAndAdditionalContent('main')" class="btn btn-dark rounded">
                <i class="fa fa-arrow-left mr-1" aria-hidden="true"></i>Back
            </a>
        </div>
        <div class="full">${innerHtml}</div>`;
}

function studentProgressDetailAdditionalLoader(){
    return `<div class="main-card mb-3 card"><div class="card-body text-center">Loading...</div></div>`;
}

function studentProgressDetailExtractBodyHtml(htmlContent){
    if(!htmlContent){ return ""; }
    var lowerHtml = htmlContent.toLowerCase();
    var bodyStart = lowerHtml.indexOf("<body");
    if(bodyStart < 0){ return htmlContent; }
    var bodyStartClose = lowerHtml.indexOf(">", bodyStart);
    var bodyEnd = lowerHtml.lastIndexOf("</body>");
    if(bodyStartClose < 0 || bodyEnd < 0 || bodyEnd <= bodyStartClose){ return htmlContent; }
    return htmlContent.substring(bodyStartClose + 1, bodyEnd);
}

function studentProgressDetailRenderDetailHtml(htmlContent){
    var detailContent = studentProgressDetailExtractBodyHtml(htmlContent);
    var tempDiv = $("<div></div>").html(detailContent);
    var gradebookStyleCss = studentProgressDetailExtractGradebookStyleCss(htmlContent);
    var gradebookInitScript = studentProgressDetailExtractGradebookInitScript(htmlContent);
    var weeklyProgressScriptSrc = "";

    tempDiv.find("script").each(function(){
        var scriptSrc = $(this).attr("src") || "";
        if(scriptSrc && scriptSrc.toLowerCase().indexOf("dashboardweeklyprogress.js") > -1){
            weeklyProgressScriptSrc = scriptSrc;
        }
    });
    tempDiv.find("script").remove();
    tempDiv.find("#commonloaderIdNewLoader, #commonloaderId, #commonloaderBody, .server-message").remove();

    var styleHtml = gradebookStyleCss ? `<style id="studentProgressGradebookStyle">${gradebookStyleCss}</style>` : "";
    $("#dashboardContentInHTMLAdditional").html(studentProgressDetailDetailWrapper(styleHtml + tempDiv.html()));
    studentProgressDetailEnsureWeeklyProgressScriptAndRunInline(weeklyProgressScriptSrc, gradebookInitScript);
}

function studentProgressDetailExtractGradebookStyleCss(htmlContent){
    if(!htmlContent){ return ""; }
    var styleByIdRegex = /<style[^>]*id=["']gradebookSummaryStyleBlock["'][^>]*>([\s\S]*?)<\/style>/i;
    var byIdMatch = htmlContent.match(styleByIdRegex);
    if(byIdMatch && byIdMatch[1]){ return byIdMatch[1]; }
    var firstStyleRegex = /<style[^>]*>([\s\S]*?)<\/style>/i;
    var firstMatch = htmlContent.match(firstStyleRegex);
    return firstMatch && firstMatch[1] ? firstMatch[1] : "";
}

function studentProgressDetailExtractGradebookInitScript(htmlContent){
    if(!htmlContent){ return ""; }
    var scriptRegex = /<script[^>]*id=["']gradebookSummaryInitScript["'][^>]*>([\s\S]*?)<\/script>/i;
    var match = htmlContent.match(scriptRegex);
    return match && match[1] ? match[1] : "";
}

function studentProgressDetailEnsureWeeklyProgressScriptAndRunInline(weeklyProgressScriptSrc, scriptCode){
    var runInlineScript = function(){
        if(!scriptCode){ return; }
        try{ $.globalEval(scriptCode); }catch(e){ console.error("Progress report inline script execution failed:", e); }
    };

    if(typeof callDateWiseGradebokSummary === "function" || STUDENT_PROGRESS_WEEKLY_SCRIPT_LOADED){
        runInlineScript();
        return;
    }
    if(!weeklyProgressScriptSrc){
        runInlineScript();
        return;
    }
    $.getScript(weeklyProgressScriptSrc).always(function(){
        STUDENT_PROGRESS_WEEKLY_SCRIPT_LOADED = true;
        runInlineScript();
    });
}

function studentProgressDetailInitDataTable(){
    if(!$.fn.DataTable){ return; }
    if($.fn.DataTable.isDataTable('#studentProgressDetailTable')){
        $('#studentProgressDetailTable').DataTable().destroy();
    }
    if($("#studentProgressDetailTable tbody tr").length === 0 || $("#studentProgressDetailTable tbody td[colspan]").length > 0){
        return;
    }
    $('#studentProgressDetailTable').DataTable({
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
