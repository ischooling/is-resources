function getStudentParentLoginHistoryContent(pageData){
    var html = `
        <div class="full">
            ${getParentLoginHistoryTabSliderContent(pageData.students, pageData.selectedStudentUserId)}

            <div id="parentLoginSummarySection"></div>

            <div class="main-card mb-3 card rounded-15">
                <div class="card-body">
                    <div class="d-flex p-3 flex-wrap border rounded-top-left-10 rounded-top-right-10 align-items-center">
                        <h4 class="m-0 text-dark font-weight-bold font-20 ">Log in Sessions</h4>
                        <div class="ml-auto" style="width:260px;max-width:100%;">
                            <input type="text" id="parentLoginHistorySearch" class="form-control form-control-sm" placeholder="Search sessions...">
                        </div>
                    </div>
                    <div class="table-responsive">
                        <table class="table font-12 nowrap dt-responsive border" id="parentLoginHistoryTable" style="width: 100%;,margin-top:0px important">
                            <thead class="bg-primary text-white">
                                <tr>
                                    <th class="pl-3">S.No</th>
                                    <th>Log in Date | Time</th>
                                    <th>Log out Date | Time</th>
                                    <th>Location</th>
                                    <th>Duration</th>
                                </tr>
                            </thead>
                            <tbody id="parentLoginHistoryBody">
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div class="card mt-3 mb-2" style="border:1px solid #bcd4fb;background:#f4f8ff;">
                <div class="card-body py-3">
                    <p class="mb-0 text-primary font-weight-semi-bold">
                        <i class="fa fa-shield mr-2" aria-hidden="true"></i>
                        Security Notice:
                        <span class="font-weight-normal">
                            If you notice any suspicious log in activity or unrecognized locations, please contact your administrator immediately. Your account security is important to us.
                        </span>
                    </p>
                </div>
            </div>
        </div>`;
    return html;
}

function getParentLoginHistoryTabSliderContent(studentList, selectedStudentUserId){
    var backupStudentList = STUDENT_LIST;
    var commonSliderHtml = getStudentTabSliderContent({ studentBasicDetails: studentList || [] }, "parentLoginHistoryOnStudentTabClick");
    commonSliderHtml = commonSliderHtml.replace(/<span>\s*Child\s*\d+\s*:\s*([^<]+)<\/span>/gi, `<span>$1's Log in History</span>`);
    STUDENT_LIST = backupStudentList;
    var isParentActive = String(selectedStudentUserId) === String(USER_ID);
    var parentAvatar = `<div class="circle d-flex align-items-center justify-content-center font-weight-semi-bold font-12 text-white bg-primary" style="width:25px;height:25px;">${getUserInitialsCommon(USER_FULL_NAME || "Parent", "PA")}</div>`;
    var parentTabHtml = `<li class="nav-item">
            <a href="javascript:void(0)" class="nav-link p-1 pr-3 bg-white gap-5 student-thumb student-${USER_ID} parent-login-student-tab-btn ${isParentActive ? "active-student active" : ""}" onclick="parentLoginHistoryOnStudentTabClick('${USER_ID}')" style="padding-left: 30px !important;">
                ${parentAvatar}
                <span>Parent Log in History</span>
            </a>
        </li>`;
    return commonSliderHtml.replace(`<ul class="nav nav-tabs user-slider justify-content-center">`, `<ul class="nav nav-tabs user-slider justify-content-center">${parentTabHtml}`);
}

function getParentLoginSummarySection(summary){
    return `<div class="row mb-3">
        <div class="col-xl-4 col-lg-4 col-md-6 col-12 mb-3">
            ${getParentLoginSummaryCard("First Log in", summary.firstLoginDate, summary.firstLoginTime, "calendar-check-o", "success")}
        </div>
        <div class="col-xl-4 col-lg-4 col-md-6 col-12 mb-3">
            ${getParentLoginSummaryCard("Last Log in | Duration", summary.lastLogin, summary.lastLoginDuration, "clock-o", "warning")}
        </div>
        <div class="col-xl-4 col-lg-4 col-md-6 col-12 mb-3">
            ${getParentLoginSummaryCard("Total Log in | Duration", "Till Now", summary.totalLoginDuration, "line-chart", "primary")}
        </div>
    </div>`;
}

function getParentLoginSummaryCard(label, mainValue, subValue, icon, iconClass){
    var iconStyle = "bg-light-primary text-primary";
    if(iconClass == "success"){
        iconStyle = "bg-light-success text-success";
    }else if(iconClass == "warning"){
        iconStyle = "bg-light-warning text-warning";
    }
    var html = `
        <div class="card p-3 h-100 rounded-10">
            <div class="d-flex justify-content-between align-items-center">
                <h5 class="mb-0 font-14 font-weight-semi-bold">${label}</h5>
                <span class="rounded-5 d-flex align-items-center justify-content-center ${iconStyle}" style="width:42px;height:42px;">
                    <i class="fa fa-${icon} font-18" aria-hidden="true"></i>
                </span>
            </div>
            <div class="font-18 font-weight-bold text-dark mb-1">${mainValue || "N/A"}</div>
            <div class="text-${iconClass == "warning" ? "warning" : iconClass}">${subValue || "N/A"}</div>
        </div>`;
    return html;
}

function getParentLoginHistoryRowsHtml(sessions){
    var rowsHtml = "";
    $.each(sessions || [], function(index, row){
        var durationValue = row.duration || "N/A";
        var durationClass = durationValue !== "N/A" ? "text-primary" : "";
        rowsHtml += `
            <tr>
                <td class="pl-3">${index + 1}</td>
                <td><i class="fa fa-sign-in text-success mr-1"></i>${row.loginDateTime || "N/A"}</td>
                <td><i class="fa fa-sign-out text-danger mr-1"></i>${row.logoutDateTime || "N/A"}</td>
                <td>${row.location || "N/A"}</td>
                <td class="${durationClass}">${durationValue}</td>
            </tr>`;
    });
    if(!rowsHtml){
        rowsHtml = `<tr><td colspan="5" class="text-center">No log in history found</td></tr>`;
    }
    return rowsHtml;
}