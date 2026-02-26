async function renderParentDashboardContent(){
    var payload = {userId:USER_ID}
    var ajaxReqDetails = {
        method: "POST",
        url: APP_BASE_URL + SCHOOL_UUID + "/dashboard/parent/get-students-by-parent",
        body: payload,
        global: true,
        showMessage: false,
        onFaildResolved: true,
        onSuccessResolved: true
    }
    var getStudentList = await callCommonAjax(ajaxReqDetails);
    console.log(getStudentList);
    $('#dashboardContentInHTML').html(getStudentTabSliderContent(getStudentList,'getStudentDetailsByStudentID')+getStudentDetailsByIDWrapper());
    if(STUDENT_LIST.studentBasicDetails.length>0){
        
        getStudentDetailsByStudentID(STUDENT_LIST.studentBasicDetails[0].userId);
    }
    parentDashbaordOnLoadEvent();
}

function getStudentTabSliderContent(data, clickFunctionName){
    var html =
    `<div class="parent-tab-slider-wrapper">
        <span id="currentTimeForUser" class="d-none"></span>
        <ul class="nav nav-tabs user-slider justify-content-center">`;

    STUDENT_LIST = data;

    $.each(data.studentBasicDetails, function(i, v){
        html +=
        `<li class="nav-item">
            <a href="javascript:void(0)" 
               class="nav-link p-1 pr-3 bg-white gap-5 student-thumb student-${v.userId} ${i == 0 ? 'active-student':''}" 
               onclick="${clickFunctionName}('${v.userId}')">
                <img src="${v.profilePic}" class="circle" style="width:25px;height:25px">
                <span>Child ${i+1}: ${getStudentFirstfName(v.studentName)}</span>
            </a>
        </li>`;
    });

    html += `</ul></div>`;

    return html;
}
function getStudentDetailsByIDWrapper(){
    var html=
    `<div class="form-row">
        <div class="col-xl-8 col-lg-8 col-md-12 col-sm-12 col-12" id="studentPerformanceDetails"></div>
        <div class="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12">
            <div class="row">
                <div class="col-xl-12 col-lg-12 col-md-6 col-sm-12 col-12">
                    <div class="card rounded-10">
                        <div class="card-header rounded-top-left-10 rounded-top-right-10">
                            <div class=""> 
                                <h4 class="text-dark font-weight-semi-bold font-20 text-transform-none m-0">Upcoming Classes & Activities</h4>
                            </div>
                        </div>
                        <div class="card-body py-3 overflow-y-auto" id="studentUpcomingClassActivityWrapper" style="max-height:250px"></div>
                    </div>
                </div>
                <div class="col-xl-12 col-lg-12 col-md-6 col-sm-12 col-12 mt-3">
                    <div class="card rounded-10">
                        <div class="card-header rounded-top-left-10 rounded-top-right-10">
                            <div class=""> 
                                <h4 class="text-dark font-weight-semi-bold font-20 text-transform-none m-0">Due & Upcoming Payment</h4>
                            </div>
                        </div>
                        <div class="card-body py-3 overflow-y-auto" id="studentPaymentListingWrapper" style="max-height:250px"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
    return html;
}

function getStudentPerformanceDetailsCard(data){
    var html=
    `<div class="card rounded-10"data>
        <div class="card-body">
            <div class="position-absolute text-gray font-12" style="right:1.25rem">
                <span class="bg-gray d-inline-block rounded-circle" style="width:10px;height:10px;"></span>&nbsp; Last active: ${data.student.lastActive}
            </div>
            <div class="d-flex">
                <div class="avatar-icon-wrapper mr-2 avatar-icon-xl">
                    <div class="avatar-icon">
                        <img src="${data.student.profilePic}" alt="Avatar 5">
                    </div>
                </div>
                <div>
                    <h5 class="text-dark font-weight-bold mb-1">${data.student.studentName}</h5>
                    <div>
                        <span class="text-gray">
                            <i class="fa fa-graduation-cap mr-1 text-primary"></i>${data.student.grade}
                        </span>
                        <span class="text-gray">
                            <i class="fa fa-users mr-1 text-primary"></i>${getLearningProgramLabel(data.student.learningProgram)}
                        </span>
                    </div>
                </div>    
            </div>
            <div class="form-row mt-3">
                <div class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 mb-lg-0 mb-2">
                    <div class="card rounded-10 h-100">
                        <div class="card-body py-2">
                            <a href="javascript:void(0)" class="d-inline-block text-center text-decoration-none w-100">
                                <h4 class="text-success font-weight-bold font-26 mb-1">${data.summary.attendancePercentThisMonth}%</h4>
                                <p class="m-0 text-success">Attendance This Month</p>
                                <div class="text-dark d-flex align-items-center justify-content-center mt-1">`
                                    if(data.summary.attendanceDeltaFromLastMonth < 1){
                                        html+=
                                        `<span class="bg-light-danger circle mr-1 d-inline-flex justify-content-center align-items-center p-1" style="width:20px;height:20px;">    
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="bg-light-danger circle m-0" style="width:15px;height:15px;fill:#d92550">
                                                <path d="M384 352c-17.7 0-32 14.3-32 32s14.3 32 32 32l160 0c17.7 0 32-14.3 32-32l0-160c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 82.7-169.4-169.4c-12.5-12.5-32.8-12.5-45.3 0L192 242.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0L320 205.3 466.7 352 384 352z"/>
                                            </svg>
                                        </span>
                                        &nbsp;${data.summary.attendanceDeltaFromLastMonth}% This Month`;
                                    }else{
                                        html+=
                                        `<span class="bg-light-success circle mr-1 d-inline-flex justify-content-center align-items-center p-1" style="width:20px;height:20px;">    
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="bg-light-success circle m-0" style="width:15px;height:15px;fill:#1fc747">
                                                <path d="M384 160c-17.7 0-32-14.3-32-32s14.3-32 32-32l160 0c17.7 0 32 14.3 32 32l0 160c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-82.7-169.4 169.4c-12.5 12.5-32.8 12.5-45.3 0L192 269.3 54.6 406.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l160-160c12.5-12.5 32.8-12.5 45.3 0L320 306.7 466.7 160 384 160z"/>
                                            </svg>
                                        </span>
                                        &nbsp;${data.summary.attendanceDeltaFromLastMonth}% This Month`;
                                    }
                                html+=`</div>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 mb-lg-0 mb-2">
                    <div class="card rounded-10 h-100">
                        <div class="card-body py-2">
                            <a href="javascript:void(0)" class="d-inline-block text-center text-decoration-none w-100">
                                <h4 class="text-review-dark font-weight-bold font-26 mb-1">${data.summary.totalClassesThisMonth}</h4>
                                <p class="m-0 text-review-dark">Attendance This Month</p>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 mb-lg-0 mb-2">
                    <div class="card rounded-10 h-100">
                        <div class="card-body py-2">
                            <a href="javascript:void(0)" class="d-inline-block text-center text-decoration-none w-100">
                                <h4 class="text-primart font-weight-bold font-26 mb-1">${data.summary.avgGradeThisMonth}</h4>
                                <p class="m-0 text-primart">Avg Grade</p>
                                <div class="text-dark d-flex align-items-center justify-content-center mt-1" id="gradeCompare">`;
                                    
                                html+=`</div>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 mb-lg-0 mb-2">
                    <div class="card rounded-10 h-100">
                        <div class="card-body py-2">
                            <a href="javascript:void(0)" class="d-inline-block text-center text-decoration-none w-100">
                                <h4 class="text-secondary font-weight-bold font-26 mb-1">${data.summary.totalCourses}</h4>
                                <p class="m-0 text-secondary">Course</p>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="mt-4 mb-3">
                <h4 class="text-dark font-weight-semi-bold font-20">Performance Overview</h4>
            </div>
            <div class="card p-4">
                <!-- Tabs -->
                <ul class="nav nav-pills mb-2">
                    <li class="nav-item btn-group-sm">
                        <a href="#attendanceChartTab" class="nav-link btn active attendance-tab" data-toggle="tab" role="tab" aria-controls="attendanceChartTab" aria-selected="true">Attendance</a>
                    </li>
                    <li class="nav-item btn-group-sm ml-2">
                        <a href="#gradesChartTab" class="nav-link btn grade-tab" data-toggle="tab" role="tab" aria-controls="gradesChartTab" aria-selected="false">Grades</a>
                    </li>
                </ul>
                <div class="tab-content">
                    <div class="tab-pane fade show active" id="attendanceChartTab">
                        <div id="attendanceChart"></div>
                    </div>
                    <div class="tab-pane fade" id="gradesChartTab">
                        <div id="gradesChart"></div>
                    </div>
                </div>
            </div>
        </div>  
    </div> `;   
    return html;
}

function parseClassDateTime(value){
    if (value instanceof Date) {
        return isNaN(value.getTime()) ? null : value;
    }
    if (typeof value === "number") {
        var dateFromNumber = new Date(value);
        return isNaN(dateFromNumber.getTime()) ? null : dateFromNumber;
    }
    if (typeof value === "string") {
        var trimmedValue = value.trim();
        if (trimmedValue === "") {
            return null;
        }
        var parsedDate = new Date(trimmedValue);
        if (!isNaN(parsedDate.getTime())) {
            return parsedDate;
        }
        if (trimmedValue.indexOf(" ") > -1 && trimmedValue.indexOf("T") === -1) {
            parsedDate = new Date(trimmedValue.replace(" ", "T"));
            if (!isNaN(parsedDate.getTime())) {
                return parsedDate;
            }
        }
    }
    return null;
}

function formatClassTime(dateValue){
    if (!dateValue) {
        return "--";
    }
    return dateValue.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true
    });
}

function getStudentUpcomingClassActivityListing(data){
    var html=``;
    if(data && Array.isArray(data.details.schedule) && data.details.schedule.length > 0){
        $.each(data.details.schedule, function(i,v){
            var startDate = parseClassDateTime(v.start);
            var endDate = parseClassDateTime(v.end);
            var startTime = formatClassTime(startDate);
            var endTime = formatClassTime(endDate);
            var startDateForBadge = startDate ? startDate.toISOString() : "";
            var endDateForBadge = endDate ? endDate.toISOString() : "";
            html+=
            `<div class="card rounded-10 mb-2 class-card" data-start="${startDateForBadge}" data-end="${endDateForBadge}">
                <a href="javascript:void(0)" class="card-body p-2">
                    <div class="widget-content p-0">
                        <div class="widget-content-wrapper">
                            <div class="widget-content-left mr-2">
                                <div class="widget-content-left">
                                    <img width="40" height="40" class="rounded-5" src="${v.icon != null && v.icon != undefined && v.icon != ""? v.icon : ''}" alt="" style="object-fit: cover;">
                                </div>
                            </div>
                            <div class="widget-content-left flex2">
                                <div class="widget-heading font-weight-semi-bold text-dark">${v.courseName}</div>
                                <div class="d-flex">
                                    <div class="widget-subheading opacity-6 text-dark">${startTime} to ${endTime}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </a>
            </div>`;
        });
        var card = $("#studentUpcomingClassActivityWrapper").closest(".card");
        card.find(".card-footer").remove();
        if(data && Array.isArray(data.details.schedule) && data.details.schedule.length > 0){
            card.append(`
                <div class="card-footer rounded-bottom-left-10 rounded-bottom-right-10">
                    <a href="javascript:void(0)" class="text-primary ml-auto font-weight-semi-bold">
                        View All <i class="fa fa-arrow-right ml-1"></i>
                    </a>
                </div>
            `);
        }
    }else{
        html+=`<div class="full font-14 font-weight-semi-bold text-dark text-center">No classes or activities today</div>`
    }
    
    
    return html;
}

// function getStudentPaymentListing(data){
//     var html=
//     `<div class="card rounded-10 mb-2">
//         <a href="javascript:void(0)" class="card-body p-2">
//             <div class="widget-content p-0">
//                 <div class="widget-content-wrapper">
//                     <div class="widget-content-left mr-2">
//                         <div class="widget-content-left">
//                             <i class="doller-icon d-inline-block" style="width:30px;height:30px"></i>
//                         </div>
//                     </div>
//                     <div class="widget-content-left flex2">
//                         <div class="widget-heading font-weight-semi-bold text-dark">Fee payment</div>
//                         <div class="d-flex">
//                             <div class="widget-subheading opacity-6 text-dark">Feb 16, 2026</div>
//                             <div class="badge-pill bg-light-danger text-danger ml-auto font-12 font-weight-semi-bold"><span class="badge badge-dot badge-dot-lg badge-danger blink mr-1">Badge</span>Due</div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </a>
//     </div>

//     <div class="card rounded-10 mb-2">
//         <a href="javascript:void(0)" class="card-body p-2">
//             <div class="widget-content p-0">
//                 <div class="widget-content-wrapper">
//                     <div class="widget-content-left mr-2">
//                         <div class="widget-content-left">
//                             <i class="doller-icon d-inline-block" style="width:30px;height:30px"></i>
//                         </div>
//                     </div>
//                     <div class="widget-content-left flex2">
//                         <div class="widget-heading font-weight-semi-bold text-dark">March Fee Payment</div>
//                         <div class="d-flex">
//                             <div class="widget-subheading opacity-6 text-dark">Mar 16, 2026</div>
//                             <div class="badge-pill bg-light-warning text-dark ml-auto font-12 font-weight-semi-bold"><span class="badge badge-dot badge-dot-lg badge-warning  mr-1">Badge</span>Upcoming</div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </a>
//     </div>

//     <div class="card rounded-10 mb-2">
//         <a href="javascript:void(0)" class="card-body p-2">
//             <div class="widget-content p-0">
//                 <div class="widget-content-wrapper">
//                     <div class="widget-content-left mr-2">
//                         <div class="widget-content-left">
//                             <i class="doller-icon d-inline-block" style="width:30px;height:30px"></i>
//                         </div>
//                     </div>
//                     <div class="widget-content-left flex2">
//                         <div class="widget-heading font-weight-semi-bold text-dark">March Fee Payment</div>
//                         <div class="d-flex">
//                             <div class="widget-subheading opacity-6 text-dark">Mar 16, 2026</div>
//                             <div class="badge-pill bg-light-warning text-dark ml-auto font-12 font-weight-semi-bold"><span class="badge badge-dot badge-dot-lg badge-warning  mr-1">Badge</span>Upcoming</div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </a>
//     </div>

//     <div class="card rounded-10 mb-2">
//         <a href="javascript:void(0)" class="card-body p-2">
//             <div class="widget-content p-0">
//                 <div class="widget-content-wrapper">
//                     <div class="widget-content-left mr-2">
//                         <div class="widget-content-left">
//                             <i class="doller-icon d-inline-block" style="width:30px;height:30px"></i>
//                         </div>
//                     </div>
//                     <div class="widget-content-left flex2">
//                         <div class="widget-heading font-weight-semi-bold text-dark">March Fee Payment</div>
//                         <div class="d-flex">
//                             <div class="widget-subheading opacity-6 text-dark">Mar 16, 2026</div>
//                             <div class="badge-pill bg-light-warning text-dark ml-auto font-12 font-weight-semi-bold"><span class="badge badge-dot badge-dot-lg badge-warning  mr-1">Badge</span>Upcoming</div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </a>
//     </div>
//     <div class="card rounded-10 mb-2">
//         <a href="javascript:void(0)" class="card-body p-2">
//             <div class="widget-content p-0">
//                 <div class="widget-content-wrapper">
//                     <div class="widget-content-left mr-2">
//                         <div class="widget-content-left">
//                             <i class="doller-icon d-inline-block" style="width:30px;height:30px"></i>
//                         </div>
//                     </div>
//                     <div class="widget-content-left flex2">
//                         <div class="widget-heading font-weight-semi-bold text-dark">March Fee Payment</div>
//                         <div class="d-flex">
//                             <div class="widget-subheading opacity-6 text-dark">Mar 16, 2026</div>
//                             <div class="badge-pill bg-light-warning text-dark ml-auto font-12 font-weight-semi-bold"><span class="badge badge-dot badge-dot-lg badge-warning  mr-1">Badge</span>Upcoming</div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </a>
//     </div>
//     <div class="card rounded-10 mb-2">
//         <a href="javascript:void(0)" class="card-body p-2">
//             <div class="widget-content p-0">
//                 <div class="widget-content-wrapper">
//                     <div class="widget-content-left mr-2">
//                         <div class="widget-content-left">
//                             <i class="doller-icon d-inline-block" style="width:30px;height:30px"></i>
//                         </div>
//                     </div>
//                     <div class="widget-content-left flex2">
//                         <div class="widget-heading font-weight-semi-bold text-dark">March Fee Payment</div>
//                         <div class="d-flex">
//                             <div class="widget-subheading opacity-6 text-dark">Mar 16, 2026</div>
//                             <div class="badge-pill bg-light-warning text-dark ml-auto font-12 font-weight-semi-bold"><span class="badge badge-dot badge-dot-lg badge-warning  mr-1">Badge</span>Upcoming</div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </a>
//     </div>`;
//     return html;
// }


// attendance page content //

function getStudentPaymentListing(data) {
    debugger
    
    var html = "";
    var today = new Date();
    today.setHours(0, 0, 0, 0); // remove time part

    if (data.length>0) {

        $.each(data, function (i, v) {

            if(v.status === "SCHEDULED" && v.scheduledPayDate) {

                var scheduledDate = new Date(v.scheduledPayDate);
                scheduledDate.setHours(0, 0, 0, 0);

                var badgeHtml = "";

                // ✅ TODAY bhi Due hoga
                if (scheduledDate <= today) {
                    badgeHtml = `
                        <div class="badge-pill bg-light-danger text-danger ml-auto font-12 font-weight-semi-bold">
                            <span class="badge badge-dot badge-dot-lg badge-danger blink mr-1">badge</span>Due
                        </div>`;
                } else {
                    badgeHtml = `
                        <div class="badge-pill bg-light-warning text-dark ml-auto font-12 font-weight-semi-bold">
                            <span class="badge badge-dot badge-dot-lg badge-warning mr-1">badge</span>Upcoming
                        </div>`;
                }

                html += `
                <div class="card rounded-10 mb-2">
                    <a href="javascript:void(0)" class="card-body p-2">
                        <div class="widget-content p-0">
                            <div class="widget-content-wrapper">
                                <div class="widget-content-left mr-2">
                                    <i class="doller-icon d-inline-block" style="width:30px;height:30px"></i>
                                </div>
                                <div class="widget-content-left flex2">
                                    <div class="widget-heading font-weight-semi-bold text-dark">
                                        ${v.paymentName}
                                    </div>
                                    <div class="d-flex">
                                        <div class="widget-subheading opacity-6 text-dark">
                                            ${v.scheduledPayDate}
                                        </div>
                                        ${badgeHtml}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </a>
                </div>`;
            }else{
                if(i < 2){
                    var badgeHtml = `
                            <div class="badge-pill bg-light-success text-success ml-auto font-12 font-weight-semi-bold">
                                <span class="badge badge-dot badge-dot-lg badge-success blink mr-1">badge</span>Paid
                            </div>`;
                    html += `
                    <div class="card rounded-10 mb-2">
                        <a href="javascript:void(0)" class="card-body p-2">
                            <div class="widget-content p-0">
                                <div class="widget-content-wrapper">
                                    <div class="widget-content-left mr-2">
                                        <i class="doller-icon d-inline-block" style="width:30px;height:30px"></i>
                                    </div>
                                    <div class="widget-content-left flex2">
                                        <div class="widget-heading font-weight-semi-bold text-dark">
                                            ${v.paymentName}
                                        </div>
                                        <div class="d-flex">
                                            <div class="widget-subheading opacity-6 text-dark">
                                                ${v.scheduledPayDate}
                                            </div>
                                            ${badgeHtml}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>`;
                }
            }
        });
        var card = $("#studentPaymentListingWrapper").closest(".card");
        card.find(".card-footer").remove();
        if(data && data.length > 0){
            card.append(`
                <div class="card-footer rounded-bottom-left-10 rounded-bottom-right-10">
                    <a href="javascript:void(0)" class="text-primary ml-auto font-weight-semi-bold" onclick="callDashboardPageSchool(104,'parent-fee-details');">
                        View All <i class="fa fa-arrow-right ml-1"></i>
                    </a>
                </div>
            `);
        }
    }

    // If no scheduled payments
    if (html === "") {
        html = `<div class="text-center font-weight-semi-bold font-14 text-dark">
                    No upcoming or due payments
                </div>`;
    }

    return html;
}
function getStudentAttendanceDetailsContent(){
    var html=
    `<div class="full">
        <div class="">
            <div class="form-row mt-3"></div>
            <div class="form-row">
                <div class="col-xl-8 col-lg-8 col-md-12 col-sm-12 col-12">
                    <div>
                        <h5 class="text-dark font-weight-semi-bold mb-0">Performance Overview</h5>
                    </div>
                    <div class="card">
                        <div class="card-body" id="studentAttendaceByIDWrapper">${getStudentAttendanceChartDetails()}</div>
                    </div>
                </div>
                <div class="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12">
                    <div>
                        <h5 class="text-dark font-weight-semi-bold mb-0">Monthly Summary</h5>
                    </div>
                    <div class="card">
                        <div class="card-body" id="customAngleCircleChartWrapper">${getStudentMonthlySummaryDetails()}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
    return html;
}

function getStudentAttendanceChartDetails(){
    var html=
    `<div class="full p-4 mb-2">
        <div id="attendanceChartDetails"></div>
    </div>`;
    return html;
}
function getStudentMonthlySummaryDetails(){
    var html=
    `<div class="full p-4 mb-2">
        <div id="customAngleCircleChart"></div>
    </div>`;
    return html;
}
