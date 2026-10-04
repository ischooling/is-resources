var EMAIL_RECOVERY_ACTIVE_TAB = "unverified";
var EMAIL_RECOVERY_LIST_REQUEST = null;
var EMAIL_RECOVERY_REQUEST_ID = 0;
var EMAIL_RECOVERY_PAGE_NO = {
    unverified: 0,
    captured: 0
};
var EMAIL_RECOVERY_TOTALS = {
    unverified: null,
    captured: null,
    ready: null
};
var EMAIL_RECOVERY_FILTER_KEY = "";
var EMAIL_RECOVERY_COUNTS_REQUEST = null;

function initEmailRecovery() {
    EMAIL_RECOVERY_ACTIVE_TAB = "unverified";
    $("#dashboardContentInHTML").html(getEmailRecoveryContent("Email Recovery"));
    $("#emailRecoveryStartDate").datepicker({ autoclose: true, format: "yyyy-mm-dd" });
    $("#emailRecoveryEndDate").datepicker({ autoclose: true, format: "yyyy-mm-dd" });
    $("#emailRecoveryDuration").select2({ theme: "bootstrap4", minimumResultsForSearch: Infinity });
    $("#emailRecoveryDuration").on("change", function () {
        toggleEmailRecoveryDateFields();
    });
    $(".email-recovery-subject-field").addClass("d-none");
    if (typeof refreshCustomFieldState === "function") {
        refreshCustomFieldState($("#emailRecoveryFilterForm"));
    }
    var resizeTimer;
    $(window).off("resize.emailRecovery").on("resize.emailRecovery", function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            var table = $("#emailRecoveryTableWrapper table.email-recovery-table");
            if (table.length && $.fn.dataTable.isDataTable(table[0])) {
                table.DataTable().columns.adjust();
            }
        }, 250);
    });
    toggleEmailRecoveryDateFields();
    resetEmailRecoveryCountCache();
    loadEmailRecoveryActiveTab();
    loadEmailRecoveryCounts();
}

function toggleEmailRecoveryDateFields() {
    if ($("#emailRecoveryDuration").val() === "custom") {
        $(".email-recovery-date-fields").removeClass("d-none");
    } else {
        $(".email-recovery-date-fields").addClass("d-none");
    }
    if (typeof refreshCustomFieldState === "function") {
        refreshCustomFieldState($("#emailRecoveryFilterForm"));
    }
}

function switchEmailRecoveryTab(tab, skipLoad) {
    EMAIL_RECOVERY_ACTIVE_TAB = tab;
    if (!skipLoad) {
        EMAIL_RECOVERY_PAGE_NO[tab] = 0;
    }
    $(".email-recovery-page").toggleClass("is-captured", tab === "captured");
    $("#emailRecoveryTabs .nav-link").removeClass("active").attr("aria-selected", "false");
    $("#emailRecoveryTabs .nav-link[data-target='" + tab + "']").addClass("active").attr("aria-selected", "true");
    if (tab === "captured") {
        $(".email-recovery-subject-field").removeClass("d-none");
    } else {
        $(".email-recovery-subject-field").addClass("d-none");
    }
    if (!skipLoad) {
        loadEmailRecoveryList(tab, EMAIL_RECOVERY_TOTALS[tab] == null);
    }
}

function loadEmailRecoveryActiveTab() {
    EMAIL_RECOVERY_PAGE_NO[EMAIL_RECOVERY_ACTIVE_TAB] = 0;
    if (EMAIL_RECOVERY_ACTIVE_TAB === "captured") {
        loadEmailRecoveryCapturedList();
    } else {
        loadEmailRecoveryUnverifiedList();
    }
}

function searchEmailRecovery() {
    resetEmailRecoveryCountCache();
    EMAIL_RECOVERY_PAGE_NO[EMAIL_RECOVERY_ACTIVE_TAB] = 0;
    loadEmailRecoveryList(EMAIL_RECOVERY_ACTIVE_TAB, true);
    loadEmailRecoveryCounts();
}

function getEmailRecoveryPayload() {
    var dates = getEmailRecoveryDates();
    return {
        email: ($("#emailRecoveryEmail").val() || "").trim(),
        subject: ($("#emailRecoverySubject").val() || "").trim(),
        startDate: dates.startDate,
        endDate: dates.endDate,
        pageNo: String(EMAIL_RECOVERY_PAGE_NO[EMAIL_RECOVERY_ACTIVE_TAB] || 0),
        pageSize: ($("#emailRecoveryPageSize").val() || "25").trim(),
        schoolId: SCHOOL_ID,
        includeCounts: true
    };
}

function getEmailRecoveryDates() {
    var duration = $("#emailRecoveryDuration").val();
    var today = new Date();
    var start = "";
    var end = "";
    if (duration === "today") {
        start = formatEmailRecoveryDate(today);
        end = start;
    } else if (duration === "yesterday") {
        today.setDate(today.getDate() - 1);
        start = formatEmailRecoveryDate(today);
        end = start;
    } else if (duration === "week") {
        end = formatEmailRecoveryDate(today);
        today.setDate(today.getDate() - 6);
        start = formatEmailRecoveryDate(today);
    } else if (duration === "custom") {
        start = getEmailRecoveryPickerDate("#emailRecoveryStartDate");
        end = getEmailRecoveryPickerDate("#emailRecoveryEndDate");
    }
    return { startDate: start, endDate: end };
}

function getEmailRecoveryPickerDate(selector) {
    var pickerDate = $(selector).datepicker("getDate");
    if (pickerDate) {
        return formatEmailRecoveryDate(pickerDate);
    }
    return ($(selector).val() || "").trim();
}

function formatEmailRecoveryDate(date) {
    var month = String(date.getMonth() + 1).padStart(2, "0");
    var day = String(date.getDate()).padStart(2, "0");
    return date.getFullYear() + "-" + month + "-" + day;
}

function loadEmailRecoveryUnverifiedList() {
    loadEmailRecoveryList("unverified", EMAIL_RECOVERY_TOTALS.unverified == null);
}

function loadEmailRecoveryCapturedList() {
    loadEmailRecoveryList("captured", EMAIL_RECOVERY_TOTALS.captured == null);
}

function loadEmailRecoveryList(tab, includeCounts) {
    var currentFilterKey = getEmailRecoveryFilterKey();
    if (EMAIL_RECOVERY_FILTER_KEY !== currentFilterKey) {
        EMAIL_RECOVERY_FILTER_KEY = currentFilterKey;
        EMAIL_RECOVERY_TOTALS.unverified = null;
        EMAIL_RECOVERY_TOTALS.captured = null;
        EMAIL_RECOVERY_TOTALS.ready = null;
        EMAIL_RECOVERY_PAGE_NO.unverified = 0;
        EMAIL_RECOVERY_PAGE_NO.captured = 0;
        includeCounts = true;
    }
    var payload = getEmailRecoveryPayload();
    payload.includeCounts = includeCounts !== false;
    if ($("#emailRecoveryDuration").val() === "custom" &&
            (!payload.startDate || !payload.endDate || payload.startDate > payload.endDate)) {
        showMessageTheme2(0, "Select a valid start and end date");
        return;
    }
    if (!/^[0-9]+$/.test(payload.pageSize) || Number(payload.pageSize) < 1) {
        showMessageTheme2(0, "Record limit must be a positive whole number");
        return;
    }
    var requestId = ++EMAIL_RECOVERY_REQUEST_ID;
    if (EMAIL_RECOVERY_LIST_REQUEST) {
        EMAIL_RECOVERY_LIST_REQUEST.abort();
    }
    var existingTable = $("#emailRecoveryTableWrapper table.email-recovery-table");
    if (existingTable.length && $.fn.dataTable.isDataTable(existingTable[0])) {
        existingTable.DataTable().destroy();
    }
    $("#emailRecoveryTableWrapper").attr("aria-busy", "true").empty();
    EMAIL_RECOVERY_LIST_REQUEST = $.ajax({
        contentType: APPLICATION_JSON_VALUE,
        type: "POST",
        url: getURLForHTML("dashboard", "email-recovery-" + tab + "-list"),
        data: JSON.stringify(payload),
        success: function (data) {
            if (requestId !== EMAIL_RECOVERY_REQUEST_ID || !$("#emailRecoveryTableWrapper").length) { return; }
            updateEmailRecoveryCounts(data);
            if (data["status"] === "0" || data["status"] === "2") {
                showMessageTheme2(0, data["message"]);
                $("#emailRecoveryTableWrapper").html(getEmailRecoveryErrorState());
                return false;
            }
            var list = data["list"] || [];
            var totalCount = getEmailRecoveryTotalCount(tab, data);
            if (list.length < 1) {
                $("#emailRecoveryTableWrapper").html(getEmailRecoveryEmptyState() + renderEmailRecoveryPager(tab, totalCount));
                return false;
            }
            $("#emailRecoveryTableWrapper").html((tab === "captured" ? renderEmailRecoveryCapturedTable(list) : renderEmailRecoveryUnverifiedTable(list))
                    + renderEmailRecoveryPager(tab, totalCount));
            initEmailRecoveryDataTable(tab === "captured" ? "#emailRecoveryCapturedTable" : "#emailRecoveryUnverifiedTable", list.length);
            return false;
        },
        error: function (xhr, status) {
            if (status !== "abort" && requestId === EMAIL_RECOVERY_REQUEST_ID) {
                $("#emailRecoveryTableWrapper").html(getEmailRecoveryErrorState());
            }
        },
        complete: function () {
            if (requestId === EMAIL_RECOVERY_REQUEST_ID) {
                EMAIL_RECOVERY_LIST_REQUEST = null;
                $("#emailRecoveryTableWrapper").attr("aria-busy", "false");
            }
        }
    });
}

function updateEmailRecoveryCounts(data) {
    if (data && data.unverifiedCount != undefined) {
        EMAIL_RECOVERY_TOTALS.unverified = Number(data.unverifiedCount) || 0;
        $("#emailRecoveryUnverifiedCount").text(EMAIL_RECOVERY_TOTALS.unverified);
    }
    if (data && data.capturedCount != undefined) {
        EMAIL_RECOVERY_TOTALS.captured = Number(data.capturedCount) || 0;
        $("#emailRecoveryCapturedCount").text(EMAIL_RECOVERY_TOTALS.captured);
    }
    if (data && data.readyToResendCount != undefined) {
        EMAIL_RECOVERY_TOTALS.ready = Number(data.readyToResendCount) || 0;
        $("#emailRecoveryReadyCount").text(EMAIL_RECOVERY_TOTALS.ready);
    }
}

function initEmailRecoveryDataTable(tableId, rowCount) {
    if (!rowCount) {
        return;
    }
    if ($.fn.dataTable.isDataTable(tableId)) {
        $(tableId).dataTable().fnDestroy();
    }
    $(tableId).dataTable({
        scrollX: true,
        bFilter: false,
        autoWidth: false,
        lengthChange: false,
        paging: false,
        info: false,
        order: [],
        columnDefs: [{ targets: -1, orderable: false }],
        dom: 't'
    });
}

function getEmailRecoveryTotalCount(tab, data) {
    if (tab === "captured") {
        if (data && data.capturedCount != undefined) {
            return Number(data.capturedCount) || 0;
        }
        return Number(EMAIL_RECOVERY_TOTALS.captured) || 0;
    }
    if (data && data.unverifiedCount != undefined) {
        return Number(data.unverifiedCount) || 0;
    }
    return Number(EMAIL_RECOVERY_TOTALS.unverified) || 0;
}

function renderEmailRecoveryPager(tab, totalCount) {
    var pageSize = Number(($("#emailRecoveryPageSize").val() || "25").trim());
    var pageNo = EMAIL_RECOVERY_PAGE_NO[tab] || 0;
    var totalPages = pageSize > 0 ? Math.ceil(totalCount / pageSize) : 0;
    var from = totalCount > 0 ? (pageNo * pageSize) + 1 : 0;
    var to = Math.min((pageNo + 1) * pageSize, totalCount);
    var previousDisabled = pageNo <= 0 ? " disabled" : "";
    var nextDisabled = pageNo >= totalPages - 1 ? " disabled" : "";
    return `
        <div class="email-recovery-table-footer">
            <div class="dataTables_info">Showing ${from} to ${to} of ${totalCount} entries</div>
            <ul class="pagination">
                <li class="paginate_button page-item previous${previousDisabled}">
                    <button type="button" class="page-link" ${previousDisabled ? "disabled" : ""} onclick="goToEmailRecoveryPage('${tab}', ${pageNo - 1})">Previous</button>
                </li>
                ${renderEmailRecoveryPageNumbers(tab, pageNo, totalPages)}
                <li class="paginate_button page-item next${nextDisabled}">
                    <button type="button" class="page-link" ${nextDisabled ? "disabled" : ""} onclick="goToEmailRecoveryPage('${tab}', ${pageNo + 1})">Next</button>
                </li>
            </ul>
        </div>`;
}

function getEmailRecoveryPageWindow(current, total) {
    var pages = [];
    var span = 1;
    for (var i = 0; i < total; i++) {
        if (i === 0 || i === total - 1 || (i >= current - span && i <= current + span)) {
            pages.push(i);
        } else if (pages[pages.length - 1] !== "...") {
            pages.push("...");
        }
    }
    return pages;
}

function renderEmailRecoveryPageNumbers(tab, pageNo, totalPages) {
    if (totalPages < 1) {
        return '<li class="paginate_button page-item active"><button type="button" class="page-link" disabled>0</button></li>';
    }
    var html = "";
    var pages = getEmailRecoveryPageWindow(pageNo, totalPages);
    for (var i = 0; i < pages.length; i++) {
        var page = pages[i];
        if (page === "...") {
            html += '<li class="paginate_button page-item disabled"><span class="page-link">...</span></li>';
        } else {
            html += '<li class="paginate_button page-item ' + (page === pageNo ? "active" : "") + '">'
                    + '<button type="button" class="page-link" ' + (page === pageNo ? "disabled" : "")
                    + " onclick=\"goToEmailRecoveryPage('" + tab + "', " + page + ")\">" + (page + 1) + "</button></li>";
        }
    }
    return html;
}

function goToEmailRecoveryPage(tab, pageNo) {
    if (pageNo < 0) {
        return false;
    }
    EMAIL_RECOVERY_PAGE_NO[tab] = pageNo;
    switchEmailRecoveryTab(tab, true);
    loadEmailRecoveryList(tab, false);
    return false;
}

function getEmailRecoveryFilterKey() {
    var payload = getEmailRecoveryPayload();
    return [payload.email, payload.subject, payload.startDate, payload.endDate, payload.schoolId, payload.pageSize].join("|");
}

function resetEmailRecoveryCountCache() {
    EMAIL_RECOVERY_FILTER_KEY = getEmailRecoveryFilterKey();
    EMAIL_RECOVERY_TOTALS.unverified = null;
    EMAIL_RECOVERY_TOTALS.captured = null;
    EMAIL_RECOVERY_TOTALS.ready = null;
}

function loadEmailRecoveryCounts() {
    var payload = getEmailRecoveryPayload();
    payload.includeCounts = true;
    payload.countScope = EMAIL_RECOVERY_ACTIVE_TAB === "captured" ? "unverifiedReady" : "captured";
    var currentFilterKey = getEmailRecoveryFilterKey();
    if (EMAIL_RECOVERY_COUNTS_REQUEST) {
        EMAIL_RECOVERY_COUNTS_REQUEST.abort();
    }
    EMAIL_RECOVERY_COUNTS_REQUEST = $.ajax({
        contentType: APPLICATION_JSON_VALUE,
        type: "POST",
        global: false,
        url: getURLForHTML("dashboard", "email-recovery-counts"),
        data: JSON.stringify(payload),
        success: function (data) {
            if (currentFilterKey === EMAIL_RECOVERY_FILTER_KEY) {
                updateEmailRecoveryCounts(data);
            }
        },
        complete: function () {
            EMAIL_RECOVERY_COUNTS_REQUEST = null;
        }
    });
}

function getEmailRecoveryEmptyState() {
    return '<div class="email-recovery-state text-muted"><i class="fa fa-inbox" aria-hidden="true"></i><strong>No records found</strong></div>';
}

function getEmailRecoveryErrorState() {
    return '<div class="email-recovery-state"><i class="fa fa-exclamation-circle" aria-hidden="true"></i><strong>Unable to load emails</strong><button type="button" class="btn btn-sm btn-outline-primary" onclick="loadEmailRecoveryActiveTab()"><i class="fa fa-refresh" aria-hidden="true"></i> Retry</button></div>';
}

function renderEmailRecoveryUnverifiedTable(list) {
    var rows = "";
    var serialOffset = (EMAIL_RECOVERY_PAGE_NO.unverified || 0) * Number(($("#emailRecoveryPageSize").val() || "25").trim());
    for (var i = 0; i < list.length; i++) {
        var row = list[i];
        rows += `
            <tr>
                <td>${serialOffset + i + 1}</td>
                <td class="email-recovery-email" data-label="Email address">${safeEmailRecoveryText(row.email)}</td>
                <td data-label="Verification"><span class="badge badge-warning">${safeEmailRecoveryText(row.verifiedStatus)}</span></td>
                <td class="email-recovery-date" data-label="Checked date">${safeEmailRecoveryText(row.checkedDate)}</td>
                <td data-label="Captured emails">${row.capturedCount || 0}</td>
                <td class="email-recovery-date" data-label="Last captured">${safeEmailRecoveryText(row.lastCapturedAt)}</td>
                <td data-label="Actions"><div class="email-recovery-row-actions">
                    <button type="button" class="btn btn-sm btn-success" title="Verify email" aria-label="Verify email" onclick="confirmEmailRecoveryVerify('${escapeEmailRecoveryJs(row.email)}')">
                        <i class="fa fa-check"></i>
                    </button>
                    <button type="button" class="btn btn-sm btn-outline-primary" title="View captured emails" aria-label="View captured emails" onclick="openEmailRecoveryCapturedForEmail('${escapeEmailRecoveryJs(row.email)}')">
                        <i class="fa fa-envelope-open"></i>
                    </button>
                </div></td>
            </tr>`;
    }
    return `
        <table class="table table-bordered table-striped border-radius-table font-12 email-recovery-table" id="emailRecoveryUnverifiedTable">
            <thead class="bg-primary text-white">
                <tr>
                    <th>S. No.</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Checked Date</th>
                    <th>Captured Count</th>
                    <th>Last Captured</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>`;
}

function renderEmailRecoveryCapturedTable(list) {
    var rows = "";
    var serialOffset = (EMAIL_RECOVERY_PAGE_NO.captured || 0) * Number(($("#emailRecoveryPageSize").val() || "25").trim());
    for (var i = 0; i < list.length; i++) {
        var row = list[i];
        var isVerified = row.isVerified === 1;
        var resendButton = isVerified
            ? `<button type="button" class="btn btn-sm btn-success" title="Resend email" aria-label="Resend email" onclick="confirmEmailRecoveryResend(${row.emailLogId})"><i class="fa fa-paper-plane"></i></button>`
            : `<button type="button" class="btn btn-sm btn-secondary" title="Verify email before resending" aria-label="Verify email before resending" disabled><i class="fa fa-lock"></i></button>`;
        rows += `
            <tr>
                <td>${serialOffset + i + 1}</td>
                <td class="email-recovery-email" data-label="Email address">${formatEmailRecoveryEmails(row.email)}</td>
                <td class="email-recovery-subject" data-label="Subject">${safeEmailRecoveryText(row.subject)}</td>
                <td class="email-recovery-date" data-label="Captured at">${safeEmailRecoveryText(row.createdAt)}</td>
                <td data-label="Verification"><span class="badge ${isVerified ? "badge-success" : "badge-warning"}">${safeEmailRecoveryText(row.verifiedStatus)}</span></td>
                <td data-label="Attachment">${safeEmailRecoveryText(row.attachment)}</td>
                <td data-label="Provider">${safeEmailRecoveryText(row.serviceBy)}</td>
                <td data-label="Mail status">${safeEmailRecoveryText(row.mailStatus)}</td>
                <td data-label="Actions"><div class="email-recovery-row-actions">
                    <a href="${BASE_URL + CONTEXT_PATH + UNIQUEUUID}/dashboard/email-content/${SCHOOL_ID}?payload=${row.urlParameters}" target="_blank" rel="noopener" class="btn btn-sm btn-outline-primary" title="View email" aria-label="View email">
                        <i class="fa fa-eye"></i>
                    </a>
                    ${resendButton}
                </div></td>
            </tr>`;
    }
    return `
        <table class="table table-bordered table-striped border-radius-table font-12 email-recovery-table" id="emailRecoveryCapturedTable">
            <thead class="bg-primary text-white">
                <tr>
                    <th>S. No.</th>
                    <th>Email</th>
                    <th>Subject</th>
                    <th>Captured At</th>
                    <th>Verification</th>
                    <th>Attachment</th>
                    <th>Provider</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>`;
}

function confirmEmailRecoveryVerify(email) {
    if (!email) {
        showMessageTheme2(0, "Invalid email");
        return false;
    }
    return showWarningMessageShow(
        "Are you sure you want to verify this email?",
        "changeEmailRecoveryStatus('" + escapeEmailRecoveryJs(email) + "', 1)"
    );
}

function changeEmailRecoveryStatus(email, status) {
    $.ajax({
        contentType: APPLICATION_JSON_VALUE,
        type: "POST",
        url: getURLForHTML("dashboard", "email-recovery-change-status"),
        data: JSON.stringify({ email: email, status: status, schoolId: SCHOOL_ID }),
        success: function (data) {
            showMessageTheme2(data["status"] === "1" ? 1 : 0, data["message"]);
            if (data["status"] === "1") {
                loadEmailRecoveryActiveTab();
            }
            return false;
        }
    });
}

function confirmEmailRecoveryResend(emailLogId) {
    if (!emailLogId) {
        showMessageTheme2(0, "Invalid email log");
        return false;
    }
    return showWarningMessageShow(
        "Are you sure you want to resend this captured email?",
        "resendEmailRecoveryCaptured(" + emailLogId + ")"
    );
}

function resendEmailRecoveryCaptured(emailLogId) {
    $.ajax({
        contentType: APPLICATION_JSON_VALUE,
        type: "POST",
        url: getURLForHTML("dashboard", "email-recovery-resend"),
        data: JSON.stringify({ emailLogId: emailLogId, schoolId: SCHOOL_ID }),
        success: function (data) {
            showMessageTheme2(data["status"] === "1" ? 1 : 0, data["message"]);
            if (data["status"] === "1") {
                loadEmailRecoveryCapturedList();
            }
            return false;
        }
    });
}

function openEmailRecoveryCapturedForEmail(email) {
    $("#emailRecoveryEmail").val(email);
    if (typeof refreshCustomFieldState === "function") {
        refreshCustomFieldState($("#emailRecoveryFilterForm"));
    }
    EMAIL_RECOVERY_PAGE_NO.captured = 0;
    switchEmailRecoveryTab("captured", true);
    loadEmailRecoveryCapturedList();
}

function resetEmailRecoveryFilters() {
    $("#emailRecoveryFilterForm")[0].reset();
    $("#emailRecoveryDuration").val("yesterday").trigger("change");
    $("#emailRecoveryStartDate").datepicker("setDate", null);
    $("#emailRecoveryEndDate").datepicker("setDate", null);
    EMAIL_RECOVERY_PAGE_NO.unverified = 0;
    EMAIL_RECOVERY_PAGE_NO.captured = 0;
    resetEmailRecoveryCountCache();
    loadEmailRecoveryActiveTab();
    loadEmailRecoveryCounts();
}

function formatEmailRecoveryEmails(value) {
    return safeEmailRecoveryText(value).split(",").map(function (email) {
        return email.trim();
    }).join("<br>");
}

function safeEmailRecoveryText(value) {
    if (value == null || value == undefined || value === "") {
        return "N/A";
    }
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function escapeEmailRecoveryJs(value) {
    return String(value || "").replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}
