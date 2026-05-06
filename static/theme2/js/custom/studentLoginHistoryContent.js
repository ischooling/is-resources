function getStudentLoginHistoryContent(pageData){
    var studentName = pageData.studentName ? pageData.studentName : "";
    return `
    <div class="app-page-title mb-3 py-2">
        <div class="page-title-wrapper">
            <div class="page-title-heading">
                <div class="page-title-icon"><img src="https://staging.internationalschooling.org/static/theme2/images//Icon/sidebar/Login_History.png" style="max-width:200px; width: 90%; margin-right: auto; display: flex;"></div>
                <div>Login History - ${studentName || "N/A"}</div> 
            </div>
        </div>
    </div>
    ${pageData.backAction ? `<div class="full my-2 d-flex justify-content-end">
        <a href="javascript:void(0)" onclick="${pageData.backAction}" class="btn btn-dark rounded">
            <i class="fa fa-arrow-left mr-1" aria-hidden="true"></i>Back
        </a>
    </div>` : ""}
    <div class="full">
        <div class="row mb-3">
            <div class="col-xl-4 col-lg-4 col-md-6 col-12 mb-3">
                ${getStudentLoginSummaryCard("First Login", pageData.summary.firstLoginDate, pageData.summary.firstLoginTime, "calendar-check-o", "success")}
            </div>
            <div class="col-xl-4 col-lg-4 col-md-6 col-12 mb-3">
                ${getStudentLoginSummaryCard("Last Login | Duration", pageData.summary.lastLogin, pageData.summary.lastLoginDuration, "clock-o", "warning")}
            </div>
            <div class="col-xl-4 col-lg-4 col-md-6 col-12 mb-3">
                ${getStudentLoginSummaryCard("Total Login | Duration", "Till Now", pageData.summary.totalLoginDuration, "line-chart", "primary")}
            </div>
        </div>

        <div class="main-card mb-3 card rounded-10 border py-3">
            <div class="card-body p-0">
                <div class="d-flex flex-wrap align-items-center justify-content-between">
                    <h4 class="mb-2 mb-md-0 ml-3 font-20 font-weight-bold">Log in Sessions</h4>
                    <div class="mr-3" style="width:260px;max-width:100%;">
                        <input type="text" id="studentLoginHistorySearch" class="form-control" placeholder="Search sessions...">
                    </div>
                </div>
                <div class="table-responsive">
                    <table class="table font-12 nowrap dt-responsive" id="studentLoginHistoryTable" style="width:100%;">
                        <thead class="bg-primary text-white">
                            <tr>
                                <th class="pl-3">S.No</th>
                                <th>Log in Date | Time</th>
                                <th>Log out Date | Time</th>
                                <th>Location</th>
                                <th>Duration</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${getStudentLoginHistoryRowsHtml(pageData.sessions)}
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
                    <span class="font-weight-normal">If you notice any suspicious login activity or unrecognized locations, please contact your administrator immediately. Your account security is important to us.</span>
                </p>
            </div>
        </div>
    </div>`;
}

function getStudentLoginSummaryCard(label, mainValue, subValue, icon, iconClass){
    var iconStyle = "bg-light-primary text-primary";
    if(iconClass == "success"){
        iconStyle = "bg-light-success text-success";
    }else if(iconClass == "warning"){
        iconStyle = "bg-light-warning text-warning";
    }
    return `<div class="card p-3 h-100">
            <div class="d-flex justify-content-between align-items-start mb-3">
                <h5 class="mb-0">${label}</h5>
                <span class="circle d-flex align-items-center justify-content-center ${iconStyle}" style="width:42px;height:42px;">
                    <i class="fa fa-${icon} font-18" aria-hidden="true"></i>
                </span>
            </div>
            <div class="h4 mb-1">${mainValue || "N/A"}</div>
            <div class="text-${iconClass == "warning" ? "warning" : iconClass}">${subValue || "N/A"}</div>
        </div>`;
}

function getStudentLoginHistoryRowsHtml(sessions){
    var rowsHtml = "";
    $.each(sessions || [], function(index, row){
        var durationValue = row.duration || "N/A";
        var durationClass = durationValue !== "N/A" ? "text-primary" : "";
        rowsHtml += `<tr>
                <td class="pl-3">${index + 1}</td>
                <td><i class="fa fa-sign-in text-success mr-1"></i>${row.loginDateTime || "N/A"}</td>
                <td><i class="fa fa-sign-out text-danger mr-1"></i>${row.logoutDateTime || "N/A"}</td>
                <td>${row.location || "N/A"}</td>
                <td class="${durationClass}">${durationValue}</td>
            </tr>`;
    });
    if(!rowsHtml){
        rowsHtml = `<tr><td colspan="5" class="text-center">No login history found</td></tr>`;
    }
    return rowsHtml;
}
