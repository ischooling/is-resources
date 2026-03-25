function getParentAcademicPerformanceContent(pageData){
    var backupStudentList = STUDENT_LIST;
    var sliderHtml = getStudentTabSliderContent(pageData.tabData, 'parentAcademicPerformanceOnStudentTabClick');
    STUDENT_LIST = backupStudentList;
    var html = `
        <div class="full">
            ${sliderHtml}

            <div class="main-card mb-3 card rounded-10 border py-3">
                <div class="card-body p-0">
                    <div class="d-flex flex-wrap align-items-center justify-content-between">
                        <h4 class="mb-2 mb-md-0 ml-3 font-20 font-weight-bold">Academic Performance</h4>
                    </div>
                    <div class="table-responsive">
                        <table class="table font-12 nowrap dt-responsive" id="parentAcademicPerformanceTable" style="width:100%;">
                            <thead class="bg-primary text-white">
                                <tr>
                                    <th class="pl-3">Course Name</th>
                                    <th>Score</th>
                                    <!--<th>Pace</th>-->
                                    <th>Teacher Name</th>
                                    <th>End Date</th>
                                    <th>Remaining Days</th>
                                    <th>Pending Assignment</th>
                                    <th>Progress (gradable)</th>
                                    <th>Progress (all activities)</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${getParentAcademicPerformanceRowsHtml(pageData.rows)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>`;
    return html;
}

function getParentAcademicPerformanceRowsHtml(rows){
    var rowsHtml = "";
    $.each(rows || [], function(index, row){
        var courseHtml = row.courseName;
        if(row.lmsEnrollmentId && row.lmsCourseId){
            courseHtml = `<a href="javascript:void(0)" class="text-primary" onclick="parentAcademicPerformanceOpenProgressDetail('${row.studentUserId}','${row.lmsEnrollmentId}','${row.lmsCourseId}')">${courseHtml}</a>`;
        }
        rowsHtml += `
            <tr>
                <td class="pl-3">${courseHtml}</td>
                <td>${row.scoreText}</td>
                <!--<td>${getParentAcademicPerformancePaceHtml(row.pace)}</td>-->
                <td>${getSalutationByGender(row.teacherGender)} ${row.teacherName}</td>
                <td>${row.endDate}</td>
                <td>${row.remainingDays}</td>
                <td>${row.pendingAssignment}</td>
                <td>${getParentAcademicPerformanceProgressHtml(row.progressGradable)}</td>
                <td>${getParentAcademicPerformanceProgressHtml(row.progressAllActivity)}</td>
            </tr>`;
    });
    if(!rowsHtml){
        rowsHtml = `<tr><td colspan="9" class="text-center">No academic performance found</td></tr>`;
    }
    return rowsHtml;
}

function getParentAcademicPerformancePaceHtml(pace){
    var value = (pace || "N/A").toUpperCase();
    var textClass = "text-dark";
    var label = pace || "N/A";
    var imageName = "still.png";
    var imageStyle = "width:24px;height:24px;object-fit:contain;";

    if(value === "GREEN"){
        textClass = "text-success";
        label = "Ahead";
        imageName = "forward.gif";
        imageStyle="width:27px;height:27px;object-fit:contain;";
    }else if(value === "YELLOW"){
        textClass = "text-primary";
        label = "On Track";
        imageName = "still.png";
        imageStyle="width:24px;height:24px;object-fit:contain;";
    }else if(value === "RED"){
        textClass = "text-danger";
        label = "Behind";
        imageName = "behind.gif";
        imageStyle="width:24px;height:24px;object-fit:contain;";
    }

    var imageUrl = PATH_FOLDER_IMAGE2 + imageName;
    return `<div class="d-flex align-items-center ${textClass}">
        <img src="${imageUrl}" alt="${label}" style="${imageStyle}">
        <span class="ml-2">${label}</span>
    </div>`;
}

function getParentAcademicPerformanceProgressHtml(value){
    var progressValue = parseFloat(value || 0);
    if(isNaN(progressValue)){
        progressValue = 0;
    }
    if(progressValue < 0){
        progressValue = 0;
    }
    if(progressValue > 100){
        progressValue = 100;
    }
    return `<div class="d-flex align-items-center">
        <div class="progress mr-1" style="height:18px;min-width:130px;">
            <div class="progress-bar bg-primary" role="progressbar" style="width:${progressValue}%;" aria-valuenow="${progressValue}" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
        <strong>${progressValue.toFixed(0)}%</strong>
    </div>`;
}

function getParentAcademicPerformanceDetailContent(){
    var gradeByTeacherHeaderHtml = USER_ROLE !== "STUDENT" ? `<th>Grade By Teacher</th>` : "";
    var gradeByTeacherCellHtml = USER_ROLE !== "STUDENT" ? `<td><span id="gradeByTeacher">0</span></td>` : "";
    return `<div class="full mb-2 d-flex justify-content-end">
            <a href="javascript:void(0)" onclick="showAndHideDashboardAndAdditionalContent('main')" class="btn btn-dark rounded">
                <i class="fa fa-arrow-left mr-1" aria-hidden="true"></i>Back
            </a>
        </div>
        <div class="main-card mb-3 card body-tabs-shadow">
            <div class="card-body">
                <div class="mb-2"><b>Course:</b> <span id="parentAcademicPerformanceCourseName">N/A</span></div>
                <div class="mb-2"><b>Current Overall Score:</b> <span id="parentAcademicPerformanceScore">N/A</span></div>
                <div class="mb-2"><b>Current Overall Grade:</b> <span id="parentAcademicPerformanceGradeLetter">N/A</span></div>
                <div class="mb-2"><b>Duration:</b> <span id="parentAcademicPerformanceScheduleDate">N/A</span></div>
                <div id="parentAcademicPerformancePercentActivity" class="mb-3"></div>
                <div class="main-card mb-3" style="overflow-x:auto;">
                    <table class="details-table table table-striped table-bordered dt-responsive" style="min-width:980px;width:100%;">
                        <thead>
                            <tr>
                                <th>Total Assignments</th>
                                <th>Submitted</th>
                                <th>Upcoming</th>
                                <th>Pending</th>
                                <th>Passed</th>
                                <th>Failed</th>
                                <th>Submitted BEFORE TIME</th>
                                <th>Submitted ON TIME</th>
                                <th>Submitted LATE</th>
                                ${gradeByTeacherHeaderHtml}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><span id="totalAssign">0</span></td>
                                <td><span id="submiteAssign">0</span></td>
                                <td><span id="upcomingAssign">0</span></td>
                                <td><span id="pendingAssign">0</span></td>
                                <td><span id="passesAssign">0</span></td>
                                <td><span id="failedAssign">0</span></td>
                                <td><span id="submitBeforeTimeAssign">0</span></td>
                                <td><span id="submitOntimeAssign">0</span></td>
                                <td><span id="submitLateAssign">0</span></td>
                                ${gradeByTeacherCellHtml}
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="main-card mb-3" style="overflow-x:auto;">
                    <table class="details-table table table-striped table-bordered dt-responsive" style="min-width:980px;width:100%;">
                        <thead>
                            <tr>
                                <th>Activity Name</th>
                                <th>Due Date</th>
                                <th>Submitted Date</th>
                                <th>Time Spent (hh:mm:ss)</th>
                                <th>Submited Status</th>
                                <th>Score</th>
                                <th>Grade</th>
                                ${gradeByTeacherHeaderHtml}
                                <th>Detailed Assignment Status</th>
                            </tr>
                        </thead>
                        <tbody id="studentLmsProgress"></tbody>
                    </table>
                </div>
            </div>
        </div>
        <div id="studentGradeHistoryPopup" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog modal-xl box-shadow-none" role="document">
                <div class="modal-content border-0">
                    <div class="modal-header py-2 bg-primary text-white">
                        <h5 class="modal-title">Grade History</h5>
                        <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <table class="details-table table table-striped table-bordered dt-responsive" style="min-width:980px;width:100%;">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Visits</th>
                                    <th>Time</th>
                                    <th>Score</th>
                                    <th>By</th>
                                </tr>
                            </thead>
                            <tbody id="studentGradeHistory"></tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>`;
}

function getParentAcademicPerformancePercentActivityHtml(gradablePercent, gradableDone, gradableTotal, allPercent, allDone, allTotal){
    return `<div class="text-center d-flex align-items-start mb-1">
            <div class="mb-0 progress col-2 pl-0 mt-1">
                <div class="progress-bar bg-primary" role="progressbar" style="width:${gradablePercent}%;" aria-valuenow="${gradablePercent}" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
            <div class="text-center">&nbsp;${gradablePercent}% of gradable activities completed (${gradableDone} of ${gradableTotal})</div>
        </div>
        <div class="text-center d-flex align-items-start">
            <div class="mb-0 progress col-2 pl-0 mt-1">
                <div class="progress-bar bg-primary" role="progressbar" style="width:${allPercent}%;" aria-valuenow="${allPercent}" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
            <div class="text-center">&nbsp;${allPercent}% of all activities completed (${allDone} of ${allTotal})</div>
        </div>`;
}
