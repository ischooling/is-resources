var STUDENT_ACADEMIC_TIMELINE_MOCK_DATA = {};

async function renderStudentAcademicTimelinePage(pageData){
    debugger
    var resolvedData = await studentAcademicTimelineResolvePageData(pageData);
    ensureStudentAcademicTimelineStyles();
    if($("#dashboardContentInHTMLAdditional").length > 0){
        $("#dashboardContentInHTML").hide();
        $("#dashboardContentInHTMLAdditional").html(getStudentAcademicTimelinePageWrapper(resolvedData)).show();
    }else{
        $("#dashboardContentInHTML").html(getStudentAcademicTimelinePageWrapper(resolvedData));
    }
    studentAcademicTimelineBindEvents();
}

async function studentAcademicTimelineResolvePageData(pageData){
    var payload =  studentAcademicTimelineGetPayloadFromUrl(pageData);
   
    try{
        var responseData = await getDashboardDataBasedUrlAndPayload(true, true, "enrollment-timeline", payload);
        if(responseData && $.isPlainObject(responseData.pageData)){
            return responseData.pageData;
        }
    }catch(error){
        console.error("Enrollment timeline data fetch failed", error);
    }
    return {};
}

function studentAcademicTimelineGetPayloadFromUrl(pageData){
    var data= {}
    data["moduleId"] = pageData.moduleId;
    data["studentStandardId"] = pageData.studentStandardId;
    data["studentUserId"] = pageData.studentUserId;

     return data;
}

function ensureStudentAcademicTimelineStyles(){
    if($("#studentAcademicTimelineStyle").length > 0){
        return;
    }
    var localCssPath = (typeof BASE_URL !== "undefined" ? BASE_URL : window.location.origin + "/")
        + (typeof CONTEXT_PATH !== "undefined" ? CONTEXT_PATH : "")
        + "static/theme2/css/";
    var baseCssPath = localCssPath;
    var scriptVersion = typeof SCRIPT_VERSION !== "undefined" ? SCRIPT_VERSION : "";
    $("head").append('<link id="studentAcademicTimelineStyle" rel="stylesheet" href="' + baseCssPath + 'studentAcademicTimeline.css' + scriptVersion + '">');
}

function getStudentAcademicTimelinePageWrapper(pageData){
    return getStudentAcademicTimelineContent(pageData);
}

function backFromStudentAcademicTimelinePage(){
    if($("#dashboardContentInHTMLAdditional").length > 0 && $("#dashboardContentInHTML").length > 0){
        backToMain('manageAdvanceStudentContent');
        return;
    }
    if(window.opener && !window.opener.closed){
        window.close();
        return;
    }
    window.history.back();
}

function getStudentAcademicTimelineContent(pageData){
    var student = studentAcademicTimelineResolveStudentData(pageData);
    return `
        <div class="student-academic-timeline full mt-3" style="max-width:1120px;margin:0 auto;">
            <div class="main-card mb-3 card rounded-10 border py-3">
                <div class="card-body">
                    ${studentAcademicTimelineHeaderHtml(pageData, student)}
                </div>
            </div>
            <div class="main-card mb-3 card rounded-10 border py-3">
                <div class="card-body">
                    ${studentAcademicTimelineMetricsHtml(pageData.metrics, student)}
                </div>
            </div>
            <div class="sat-timeline">
                ${studentAcademicTimelineItemsHtml(pageData.timeline)}
            </div>
        </div>`;
}

function studentAcademicTimelineResolveStudentData(pageData){
    var student = $.isPlainObject(pageData.student) ? pageData.student : {};
    var resolvedName = student.name || student.studentName || student.fullName || student.userFullName || student.userName
        || studentAcademicTimelineJoinName(student.fName || student.firstName, student.mName || student.middleName, student.lName || student.lastName)
        || "Student";
    var resolvedStudentId = student.studentId || student.studentCode || student.studentUniqueId || student.userId
        || pageData.studentId || (pageData.currentStandard ? pageData.currentStandard.rollNo : "") || "N/A";
    var resolvedGraduationStatus = student.graduationStatus || pageData.graduationStatus || "Enrolled";
    var resolvedGraduationDate = student.graduationDate || pageData.graduationDate || "In progress";
    var resolvedCreditsEarned = student.creditsEarned != null ? student.creditsEarned : (pageData.creditsEarned != null ? pageData.creditsEarned : 0);
    var resolvedCreditsTotal = student.creditsTotal != null ? student.creditsTotal : (pageData.creditsTotal != null ? pageData.creditsTotal : resolvedCreditsEarned);
    var resolvedCumulativeGpa = student.cumulativeGpa || pageData.cumulativeGpa || "0.0";

    return {
        initials: student.initials || studentAcademicTimelineBuildInitials(resolvedName),
        name: resolvedName,
        studentId: resolvedStudentId,
        graduationStatus: resolvedGraduationStatus,
        graduationDate: resolvedGraduationDate,
        creditsEarned: resolvedCreditsEarned,
        creditsTotal: resolvedCreditsTotal,
        cumulativeGpa: resolvedCumulativeGpa
    };
}

function studentAcademicTimelineJoinName(firstName, middleName, lastName){
    var parts = [];
    $.each([firstName, middleName, lastName], function(index, value){
        if(value){
            var trimmedValue = $.trim(String(value));
            if(trimmedValue){
                parts.push(trimmedValue);
            }
        }
    });
    return parts.join(" ");
}

function studentAcademicTimelineBuildInitials(fullName){
    if(!fullName){
        return "ST";
    }
    var parts = $.trim(String(fullName)).split(/\s+/);
    if(!parts.length){
        return "ST";
    }
    var first = parts[0].charAt(0).toUpperCase();
    var second = (parts.length > 1 ? parts[parts.length - 1].charAt(0) : first).toUpperCase();
    return first + second;
}

function studentAcademicTimelineGetLocalAssetUrl(relativePath){
    var baseUrl = (typeof BASE_URL === "string" && BASE_URL) ? BASE_URL : (window.location.origin + "/");
    var contextPath = (typeof CONTEXT_PATH === "string" && CONTEXT_PATH) ? CONTEXT_PATH : "";
    var normalizedRelativePath = (relativePath || "").replace(/^\/+/, "");

    if(baseUrl.charAt(baseUrl.length - 1) !== "/"){
        baseUrl += "/";
    }
    contextPath = contextPath.replace(/^\/+|\/+$/g, "");
    return baseUrl + (contextPath ? contextPath + "/" : "") + normalizedRelativePath;
}

function studentAcademicTimelineHeaderHtml(pageData, student){
    var logoUrl = studentAcademicTimelineGetLocalAssetUrl("static/theme2/images/is_logo_2026_blue.png");
    return `
        <div class="sat-brand mb-3">
            <div class="sat-brand-logo-wrap">
                <img class="sat-brand-logo" src="${logoUrl}" alt="International Schooling">
            </div>
            <div class="sat-page-head">${pageData.pageTitle}</div>
        </div>
        <div class="sat-profile-card">
            <div class="sat-profile-main">
                <div class="sat-profile-identify">
                    <div class="sat-avatar">${studentAcademicTimelineEscape(student.initials)}</div>
                    <div>
                        <div class="sat-student-name">${studentAcademicTimelineEscape(student.name)}</div>
                        <div class="sat-student-meta">Student ID: ${studentAcademicTimelineEscape(student.studentId)}</div>
                    </div>
                </div>
                <div class="sat-profile-chips">
                    <span class="sat-chip sat-chip-success">${studentAcademicTimelineEscape(student.graduationStatus)} - ${studentAcademicTimelineEscape(student.graduationDate)}</span>
                    <span class="sat-chip sat-chip-primary">${studentAcademicTimelineEscape(student.creditsEarned)} / ${studentAcademicTimelineEscape(student.creditsTotal)} Credits</span>
                    <span class="sat-chip sat-chip-warning">Cumulative GPA: ${studentAcademicTimelineEscape(student.cumulativeGpa)}</span>
                </div>
            </div>
        </div>`;
}

function studentAcademicTimelineMetricsHtml(metrics, student){
    var topCourseGradeLabel = studentAcademicTimelineResolveTopCourseGradeLabel(metrics, student);
    var summaryHtml = "";
    $.each(metrics.summaryCards || [], function(index, summary){
        summaryHtml += `
            <div class="sat-summary-card">
                <div class="sat-summary-label">${studentAcademicTimelineEscape(summary.label)}</div>
                <div class="sat-summary-value-row">
                    <div class="sat-summary-value">${studentAcademicTimelineEscape(summary.value)}</div>
                    ${summary.change ? `<div class="sat-summary-change ${studentAcademicTimelineEscape(summary.tone || "primary")}">${summary.changeIcon === "down" ? "▼" : "▲"}${studentAcademicTimelineEscape(summary.change || "")}</div>` : ""}
                </div>
                <div class="sat-summary-note">${studentAcademicTimelineEscape(summary.note || "")}</div>
            </div>`;
    });
    return `
        <div class="sat-metrics-shell">
        <div class="d-flex flex-wrap align-items-center justify-content-between mb-3">
            <div>
                <div class="sat-section-title">Progression metrics <span class="sat-section-muted">${studentAcademicTimelineEscape(student.name)} | ${studentAcademicTimelineEscape(student.studentId)}</span></div>
            </div>
            <div class="text-muted font-12"><i class="fa fa-chevron-down"></i></div>
        </div>
        <div class="sat-metrics-grid">
            <div class="sat-chart-card">
                <div class="sat-chart-header">
                    <div class="sat-chart-title">GPA trend</div>
                </div>
                ${studentAcademicTimelineBarChartHtml(metrics.gpaTrend, "sat-bar", "primary")}
            </div>
            <div class="sat-chart-card">
                <div class="sat-chart-header">
                    <div class="sat-chart-title">Avg score / year</div>
                </div>
                ${studentAcademicTimelineBarChartHtml(metrics.avgScoreTrend, "sat-bar sat-bar-score", "success")}
            </div>
            <div class="sat-chart-card">
                <div class="sat-chart-header">
                    <div class="sat-chart-title">Attendance %</div>
                </div>
                ${studentAcademicTimelineBarChartHtml(metrics.attendanceTrend, "sat-bar sat-bar-attendance", "warning")}
            </div>
        </div>
        <div class="sat-summary-grid">
            ${summaryHtml}
        </div>
        <div class="sat-highlight-grid">
            <div class="sat-highlight-card">
                <div class="sat-summary-label">Top course  - ${studentAcademicTimelineEscape(topCourseGradeLabel)}</div>
                <div class="sat-summary-value mb-2" style="font-size:15px;">${studentAcademicTimelineEscape(metrics.capstone.title)}</div>
                <div class="sat-summary-note">${studentAcademicTimelineEscape(metrics.capstone.score)} • ${studentAcademicTimelineEscape(metrics.capstone.note)}</div>
            </div>
            <div class="sat-highlight-card">
                <div class="sat-summary-label">Overall progress</div>
                <div class="sat-summary-note" style="font-size:9px;color:#9e9e9e;margin-top:5px;">${studentAcademicTimelineEscape(metrics.overallProgress || 0)}% to graduation</div>
                <div class="sat-progress-track"><div class="sat-progress-fill" style="width:${metrics.overallProgress}%;"></div></div>
            </div>
        </div>
        </div>`;
}

function studentAcademicTimelineResolveTopCourseGradeLabel(metrics, student){
    var labels = metrics && metrics.gpaTrend && $.isArray(metrics.gpaTrend.labels) ? metrics.gpaTrend.labels : [];
    if(labels.length > 0){
        return studentAcademicTimelineFormatGradeLabel(labels[labels.length - 1]);
    }
    var fromStudent = student && (student.currentGrade || student.grade || student.standardName);
    if(fromStudent){
        return String(fromStudent);
    }
    var activeLabel = metrics && metrics.gpaTrend && metrics.gpaTrend.activeLabel ? String(metrics.gpaTrend.activeLabel) : "";
    if(!activeLabel){
        return "Current Grade";
    }
    return studentAcademicTimelineFormatGradeLabel(activeLabel);
}

function studentAcademicTimelineFormatGradeLabel(label){
    var normalized = String(label || "").toUpperCase().replace(/\s+/g, "");
    if(normalized === "KG"){
        return "KG";
    }
    var match = normalized.match(/^G(\d+)$/);
    if(match){
        return "Grade " + match[1];
    }
    return String(label || "Current Grade");
}

function studentAcademicTimelineBarChartHtml(chartData, barClass, activeTone){
    chartData = studentAcademicTimelineExpandChartData(chartData);
    var barsHtml = "";
    var normalizedActiveLabel = studentAcademicTimelineNormalizeGradeLabel(chartData.activeLabel || "");
    var highlightLabelsMap = {};
    $.each(chartData.highlightLabels || [], function(index, label){
        highlightLabelsMap[studentAcademicTimelineNormalizeGradeLabel(label)] = true;
    });
    var activeIndex = -1;
    $.each(chartData.labels || [], function(index, label){
        if(normalizedActiveLabel && studentAcademicTimelineNormalizeGradeLabel(label) === normalizedActiveLabel){
            activeIndex = index;
            return false;
        }
    });
    if(activeIndex < 0){
        activeIndex = (chartData.values || []).length - 1;
    }
    var activeFillClass = "sat-bar-fill-active-primary";
    if(activeTone === "success"){
        activeFillClass = "sat-bar-fill-active-success";
    }else if(activeTone === "warning"){
        activeFillClass = "sat-bar-fill-active-warning";
    }
    $.each(chartData.values || [], function(index, value){
        var label = chartData.labels && chartData.labels[index] ? chartData.labels[index] : "";
        var normalizedLabel = studentAcademicTimelineNormalizeGradeLabel(label);
        var activeClass = index === activeIndex ? "is-active" : "";
        if(activeClass === "" && highlightLabelsMap[normalizedLabel]){
            activeClass = "is-history-highlight";
        }
        var currentBarClass = index === activeIndex ? (barClass + " " + activeFillClass) : barClass;
        barsHtml += `
            <div class="sat-bar-wrap ${activeClass}">
                <div class="sat-bar-shell">
                    <div class="${currentBarClass}" style="height:${value}%;"></div>
                </div>
                <div class="sat-bar-label">${studentAcademicTimelineEscape(label)}</div>
            </div>`;
    });
    return `<div class="sat-bars">${barsHtml}</div>`;
}

function studentAcademicTimelineItemsHtml(items){
    var html = "";
    $.each(items || [], function(index, item){
        html += studentAcademicTimelineItemHtml(item, index);
    });
    return html;
}

function studentAcademicTimelineItemHtml(item, index){
    var isExpanded = !!item.expanded;
    return `
        <div class="sat-item">
            <span class="sat-dot ${studentAcademicTimelineEscape(item.categoryClass)}"></span>
            <div class="sat-item-card">
                <div class="sat-item-header" onclick="studentAcademicTimelineToggle('${studentAcademicTimelineEscape(item.id)}')">
                    <div class="sat-item-title-wrap">
                        <span class="sat-item-badge ${studentAcademicTimelineEscape(item.categoryClass)}">${studentAcademicTimelineEscape(item.category)}</span>
                        <div>
                            <div class="sat-item-title">${studentAcademicTimelineEscape(item.title)}</div>
                            <div class="sat-item-meta">
                                ${item.daysLabel ? `<span>${studentAcademicTimelineEscape(item.daysLabel)}</span>` : ""}
                                <span>${studentAcademicTimelineEscape(item.eventDate || "")}</span>
                            </div>
                        </div>
                    </div>
                    <div class="sat-item-toggle" id="studentAcademicTimelineToggleIcon-${studentAcademicTimelineEscape(item.id)}">${isExpanded ? "−" : "+"}</div>
                </div>
                <div class="sat-item-body ${isExpanded ? "" : "sat-hidden"}" id="studentAcademicTimelineBody-${studentAcademicTimelineEscape(item.id)}">
                    ${studentAcademicTimelineBodyHtml(item, index)}
                </div>
            </div>
        </div>`;
}

function studentAcademicTimelineBodyHtml(item){
    var html = "";
    $.each(item.detailGroups || [], function(index, group){
        html += `<div class="sat-detail-grid">${studentAcademicTimelineDetailCellsHtml(group.columns)}</div>`;
    });

    if(item.courseTable){
        html += studentAcademicTimelineTableHtml(item.courseTable);
    }
    if(item.feeDetails || item.documents){
        html += `
            <div class="sat-bottom-grid">
                ${item.feeDetails ? studentAcademicTimelineFeeHtml(item.feeDetails) : ""}
                ${item.documents ? studentAcademicTimelineDocumentsHtml(item.documents) : ""}
            </div>`;
    }
    if(item.checklist){
        html += studentAcademicTimelineChecklistHtml(item.checklist);
    }
    if(item.people){
        html += studentAcademicTimelinePeopleHtml(item.people);
    }
    return html || `<div class="sat-detail-grid"><div class="sat-detail-cell"><div class="sat-detail-value">No additional details available.</div></div></div>`;
}

function studentAcademicTimelineDetailCellsHtml(columns){
    var html = "";
    $.each(columns || [], function(index, column){
        var valueHtml = studentAcademicTimelineEscape(column.value || "N/A");
        if(String(column.value).toLowerCase() === "submitted"){
            if(column.actionUrl){
                valueHtml = `Submitted <a href="javascript:void(0)" class="sat-inline-link" onclick="studentAcademicTimelineOpenPreview('${studentAcademicTimelineEscapeAttr(column.actionUrl)}')">View</a>`;
            }else{
                valueHtml = `Submitted <span class="sat-inline-link">View</span>`;
            }
        }else if(String(column.value).toLowerCase() === "view receipt"){
            if(column.actionUrl){
                valueHtml = `<a href="javascript:void(0)" class="sat-inline-link" onclick="callWithSession('${studentAcademicTimelineEscapeAttr(column.actionUrl)}')">View receipt</a>`;
            }else{
                valueHtml = `<span class="sat-inline-link">View receipt</span>`;
            }
        }
        html += `
            <div class="sat-detail-cell">
                <div class="sat-detail-label">${studentAcademicTimelineEscape(column.label || "")}</div>
                <div class="sat-detail-value">${valueHtml}</div>
            </div>`;
    });
    return html;
}

function studentAcademicTimelineTableHtml(tableData){
    var headHtml = "";
    var bodyHtml = "";
    $.each(tableData.headers || [], function(index, header){
        headHtml += `<th>${studentAcademicTimelineEscape(header)}</th>`;
    });
    $.each(tableData.rows || [], function(index, row){
        bodyHtml += "<tr>";
        $.each(row || [], function(cellIndex, cell){
            if(tableData.headers[cellIndex] === "Grade"){
                bodyHtml += `<td><span class="sat-grade-pill">${studentAcademicTimelineEscape(cell)}</span></td>`;
            }else{
                bodyHtml += `<td>${studentAcademicTimelineEscape(cell)}</td>`;
            }
        });
        bodyHtml += "</tr>";
    });
    return `
        <div class="sat-table-wrap">
            <table class="table sat-table">
                <thead><tr>${headHtml}</tr></thead>
                <tbody>${bodyHtml}</tbody>
            </table>
        </div>`;
}

function studentAcademicTimelineFeeHtml(feeDetails){
    return `
        <div class="sat-subcard">
            <div class="sat-subcard-title">Fee details</div>
            <div class="sat-mini-grid">
                ${studentAcademicTimelineDetailCellsHtml(feeDetails)}
            </div>
        </div>`;
}

function studentAcademicTimelineDocumentsHtml(documents){
    var html = "";
    $.each(documents || [], function(index, documentItem){
        var viewActionUrl = documentItem.viewActionUrl || "";
        var downloadActionUrl = documentItem.downloadActionUrl || "";
        html += `
            <div class="sat-doc-item">
                <div>
                    <div class="font-weight-bold">${studentAcademicTimelineEscape(documentItem.name)}</div>
                    <div class="sat-doc-meta">Issued: ${studentAcademicTimelineEscape(documentItem.issuedOn)} • ${studentAcademicTimelineEscape(documentItem.code)}</div>
                </div>
                <div class="sat-doc-actions">
                    <a href="javascript:void(0)" title="View" onclick="studentAcademicTimelineOpenDocument('${studentAcademicTimelineEscapeAttr(viewActionUrl)}', false)"><i class="fa fa-eye"></i></a>
                    <a href="javascript:void(0)" title="Download" onclick="studentAcademicTimelineOpenDocument('${studentAcademicTimelineEscapeAttr(downloadActionUrl)}', true)"><i class="fa fa-download"></i></a>
                </div>
            </div>`;
    });
    return `
        <div class="sat-subcard">
            <div class="sat-subcard-title">Documents issued</div>
            ${html}
        </div>`;
}

function studentAcademicTimelineOpenDocument(actionUrl, isDownload){
    if(!actionUrl){
        return;
    }
    if(typeof getAsPost === "function"){
        getAsPost(actionUrl);
        return;
    }
    var targetUrl = actionUrl;
    if(actionUrl.charAt(0) === "/"){
        targetUrl = (typeof BASE_URL !== "undefined" ? BASE_URL : window.location.origin + "/")
            + (typeof CONTEXT_PATH !== "undefined" ? CONTEXT_PATH : "")
            + (typeof SCHOOL_UUID !== "undefined" ? SCHOOL_UUID : "")
            + actionUrl;
    }
    window.open(targetUrl, isDownload ? "_self" : "_blank");
}

function studentAcademicTimelineEnsurePreviewModal(){
    if($("#studentAcademicTimelinePreviewModal").length > 0){
        return;
    }
    var modalHtml = `
        <div class="modal fade fade-scale" id="studentAcademicTimelinePreviewModal" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog modal-md box-shadow-none" role="document">
                <div class="modal-content">
                    <div class="modal-header pt-2 pb-2 bg-primary justify-content-between flex-wrap">
                        <h6 class="heading text-white mb-0">Preview File</h6>
                        <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body m-0 py-2" style="margin-top:0 !important">
                        <div id="studentAcademicTimelinePreviewImgWrap" class="full text-center d-none">
                            <img id="studentAcademicTimelinePreviewImg" class="w-100" src="" alt="Preview"/>
                        </div>
                        <div id="studentAcademicTimelinePreviewPdfWrap" class="full text-center d-none">
                            <div class="full">
                                <a href="" target="_blank" id="studentAcademicTimelinePreviewDownload" class="btn btn-sm btn-primary mb-2 pull-right" download>Download</a>
                            </div>
                            <object id="studentAcademicTimelinePreviewPdf" type="application/pdf" class="full" style="height:400px;width:100%;" data=""></object>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    $("body").append(modalHtml);
}

function studentAcademicTimelineOpenPreview(actionUrl){
    if(!actionUrl){
        return;
    }
    studentAcademicTimelineEnsurePreviewModal();
    var extension = (actionUrl.split("?")[0].split(".").pop() || "").toLowerCase();
    var isPdf = extension === "pdf";
    var imgWrap = $("#studentAcademicTimelinePreviewImgWrap");
    var pdfWrap = $("#studentAcademicTimelinePreviewPdfWrap");
    var img = $("#studentAcademicTimelinePreviewImg");
    var pdf = $("#studentAcademicTimelinePreviewPdf");
    var download = $("#studentAcademicTimelinePreviewDownload");
    if(isPdf){
        imgWrap.addClass("d-none");
        img.attr("src", "");
        pdf.attr("data", actionUrl);
        download.attr("href", actionUrl);
        pdfWrap.removeClass("d-none");
    }else{
        pdfWrap.addClass("d-none");
        pdf.attr("data", "");
        img.attr("src", actionUrl);
        imgWrap.removeClass("d-none");
    }
    $("#studentAcademicTimelinePreviewModal").modal("show");
}

function studentAcademicTimelineEscapeAttr(value){
    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/'/g, "&#39;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

function studentAcademicTimelineChecklistHtml(items){
    var html = "";
    $.each(items || [], function(index, item){
        var label = $.isPlainObject(item) ? item.label : item;
        var isChecked = $.isPlainObject(item) ? !!item.checked : true;
        var iconClass = isChecked ? "fa fa-check-square-o" : "fa fa-square-o";
        html += `<div class="sat-check"><i class="${iconClass}"></i>${studentAcademicTimelineEscape(label)}</div>`;
    });
    return `<div class="sat-checklist">${html}</div>`;
}

function studentAcademicTimelinePeopleHtml(people){
    var html = '<div class="sat-people">';
    $.each(people || [], function(index, person){
        html += `
            <div class="sat-person">
                <div class="sat-person-role">${studentAcademicTimelineEscape(person.role)}</div>
                <div class="sat-detail-grid">${studentAcademicTimelineDetailCellsHtml(person.values)}</div>
            </div>`;
    });
    html += "</div>";
    return html;
}

function studentAcademicTimelineToggle(itemId){
    var body = $("#studentAcademicTimelineBody-" + itemId);
    var icon = $("#studentAcademicTimelineToggleIcon-" + itemId);
    if(body.length < 1){
        return;
    }
    body.toggleClass("sat-hidden");
    icon.text(body.hasClass("sat-hidden") ? "+" : "−");
}

function studentAcademicTimelineBindEvents(){
    $(".student-academic-timeline [data-toggle='tooltip']").tooltip && $(".student-academic-timeline [data-toggle='tooltip']").tooltip();
}

function studentAcademicTimelineEscape(value){
    return $("<div>").text(value == null ? "" : value).html();
}

function studentAcademicTimelineNormalizeGradeLabel(label){
    return String(label || "").toLowerCase().replace(/\s+/g, "");
}

function studentAcademicTimelineExpandChartData(chartData){
    var labels = (chartData && chartData.labels) ? chartData.labels.slice() : [];
    var values = (chartData && chartData.values) ? chartData.values.slice() : [];
    var activeLabel = chartData && chartData.activeLabel ? chartData.activeLabel : "";
    var highlightLabels = (chartData && chartData.highlightLabels) ? chartData.highlightLabels.slice() : [];
    var canonicalLabels = ["KG"];
    for(var grade = 1; grade <= 12; grade++){
        canonicalLabels.push("G" + grade);
    }

    if(labels.length >= canonicalLabels.length){
        return chartData;
    }

    var labelToValue = {};
    $.each(labels, function(index, label){
        labelToValue[studentAcademicTimelineNormalizeGradeLabel(label)] = values[index];
    });

    var expandedValues = [];
    var currentMax = values.length ? Math.max.apply(null, values) : 80;
    $.each(canonicalLabels, function(index, label){
        var normalizedLabel = studentAcademicTimelineNormalizeGradeLabel(label);
        if(labelToValue[normalizedLabel] != null){
            expandedValues.push(labelToValue[normalizedLabel]);
            return;
        }
        var ratio = canonicalLabels.length > 1 ? (index / (canonicalLabels.length - 1)) : 1;
        var derivedValue = Math.round(14 + (currentMax - 14) * ratio);
        expandedValues.push(Math.max(10, Math.min(98, derivedValue)));
    });

    return {
        labels: canonicalLabels,
        values: expandedValues,
        activeLabel: activeLabel,
        highlightLabels: highlightLabels
    };
}

function studentAcademicTimelineExtractGradeNumber(label){
    var match = String(label || "").toUpperCase().match(/G\s*([0-9]+)/);
    return match ? parseInt(match[1], 10) : null;
}
