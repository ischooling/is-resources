async function renderParentDashboardContent(){
    $('#dashboardContentInHTML').html(getParentDashboardPageSkeleton());
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
    // console.log(getStudentList);
    $('#dashboardContentInHTML').html(getParentDashboardContent(getStudentList,'getStudentDetailsByStudentID'));
    if(STUDENT_LIST.studentBasicDetails.length>0){
        getStudentDetailsByStudentID(STUDENT_LIST.studentBasicDetails[0].userId);
    }
    parentDashbaordOnLoadEvent();
}

function getParentDashboardContent(studentList, funName){
    var html= 
    `<div class="main-card mb-3 pr-4">
        ${getStudentTabSliderContent(studentList, funName)+getStudentDetailsByIDWrapper()+getAnnouncementAndNewsContent()}
    </div>`;
    
    return html;
}

function getParentDashboardPageSkeleton(){
    var html=
    `<div class="parent-tab-slider-wrapper">
        <span id="currentTimeForUser" class="d-none"></span>
        <ul class="nav nav-tabs user-slider justify-content-center">
            <li class="nav-item">
                <a href="javascript:void(0)" class="nav-link p-1 pr-3 bg-white gap-5 student-thumb active-student">
                    <div class="skeleton" style="width:25px;height:25px;border-radius:50%;"></div>
                    <div class="skeleton" style="width:130px;height:16px;"></div>
                </a>
            </li>
            <li class="nav-item">
                <a href="javascript:void(0)" class="nav-link p-1 pr-3 bg-white gap-5 student-thumb">
                    <div class="skeleton" style="width:25px;height:25px;border-radius:50%;"></div>
                    <div class="skeleton" style="width:130px;height:16px;"></div>
                </a>
            </li>
            <li class="nav-item">
                <a href="javascript:void(0)" class="nav-link p-1 pr-3 bg-white gap-5 student-thumb">
                    <div class="skeleton" style="width:25px;height:25px;border-radius:50%;"></div>
                    <div class="skeleton" style="width:130px;height:16px;"></div>
                </a>
            </li>
        </ul>
    </div>
    <div class="form-row">
        <div class="col-xl-8 col-lg-8 col-md-12 col-sm-12 col-12" id="studentPerformanceDetails">
            ${getParentPerformanceOverviewSkeletonCard()}
        </div>
        <div class="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12">
            <div class="row">
                <div class="col-xl-12 col-lg-12 col-md-6 col-sm-12 col-12">
                    <div class="card rounded-10">
                        <div class="card-header rounded-top-left-10 rounded-top-right-10">
                            <div class=""> 
                                <h4 class="text-dark font-weight-semi-bold font-20 text-transform-none m-0">Upcoming Classes & Activities</h4>
                            </div>
                        </div>
                        <div class="card-body py-3 overflow-y-auto" style="max-height:250px">
                            ${getParentRightCardSkeletonRows(4)}
                        </div>
                    </div>
                </div>
                <div class="col-xl-12 col-lg-12 col-md-6 col-sm-12 col-12 mt-3">
                    <div class="card rounded-10">
                        <div class="card-header rounded-top-left-10 rounded-top-right-10">
                            <div class=""> 
                                <h4 class="text-dark font-weight-semi-bold font-20 text-transform-none m-0">Due & Upcoming Payment</h4>
                            </div>
                        </div>
                        <div class="card-body py-3 overflow-y-auto" style="max-height:250px">
                            ${getParentRightCardSkeletonRows(3)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
    return html;
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
            <a href="javascript:void(0)" class="nav-link p-1 pr-3 bg-white gap-5 student-thumb student-${v.userId} ${i == 0 ? 'active-student':''}"  onclick="${clickFunctionName}('${v.userId}')" style="${i == 0 ? 'padding-left:30px !important':''}"> 
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
        <div class="col-xl-8 col-lg-8 col-md-12 col-sm-12 col-12" id="studentPerformanceDetails">
            ${getParentPerformanceOverviewSkeletonCard()}
        </div>
        <div class="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12">
            <div class="row">
                <div class="col-xl-12 col-lg-12 col-md-6 col-sm-12 col-12">
                    <div class="card rounded-10">
                        <div class="card-header rounded-top-left-10 rounded-top-right-10">
                            <div class=""> 
                                <h4 class="text-dark font-weight-semi-bold font-20 text-transform-none m-0">Upcoming Classes & Activities</h4>
                            </div>
                        </div>
                        <div class="card-body py-3 overflow-y-auto" id="studentUpcomingClassActivityWrapper" style="max-height:250px">
                            ${getParentRightCardSkeletonRows(4)}
                        </div>
                    </div>
                </div>
                <div class="col-xl-12 col-lg-12 col-md-6 col-sm-12 col-12 mt-3">
                    <div class="card rounded-10">
                        <div class="card-header rounded-top-left-10 rounded-top-right-10">
                            <div class=""> 
                                <h4 class="text-dark font-weight-semi-bold font-20 text-transform-none m-0">Due & Upcoming Payment</h4>
                            </div>
                        </div>
                        <div class="card-body py-3 overflow-y-auto" id="studentPaymentListingWrapper" style="max-height:250px">
                            ${getParentRightCardSkeletonRows(3)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
    return html;
}

function getParentPerformanceOverviewSkeletonCard(){
    var html =
    `<div class="card rounded-10">
        <div class="card-body">
            <div class="d-flex mb-3">
                <div class="skeleton mr-2" style="width:64px;height:64px;border-radius:50%;"></div>
                <div style="flex:1">
                    <div class="skeleton mb-2" style="height:18px;max-width:220px;"></div>
                    <div class="skeleton mb-1" style="height:14px;max-width:180px;"></div>
                    <div class="skeleton" style="height:14px;max-width:200px;"></div>
                </div>
            </div>
            <div class="form-row mt-3">
                <div class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 mb-2"><div class="skeleton" style="height:84px;border-radius:10px;"></div></div>
                <div class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 mb-2"><div class="skeleton" style="height:84px;border-radius:10px;"></div></div>
                <div class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 mb-2"><div class="skeleton" style="height:84px;border-radius:10px;"></div></div>
                <div class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 mb-2"><div class="skeleton" style="height:84px;border-radius:10px;"></div></div>
            </div>
            <div class="mt-4 mb-3">
                <div class="skeleton" style="height:22px;max-width:220px;"></div>
            </div>
            <div class="card p-4">
                <div class="d-flex mb-2">
                    <div class="skeleton mr-2" style="width:110px;height:32px;border-radius:20px;"></div>
                    <div class="skeleton" style="width:90px;height:32px;border-radius:20px;"></div>
                </div>
                <div class="skeleton" style="height:260px;border-radius:8px;"></div>
            </div>
        </div>
    </div>`;
    return html;
}

function getParentLoaderLikeSkeleton(){
    return `<div class="row m-0">
        <div class="col-4 px-1 mb-2"><div class="skeleton" style="height:42px;"></div></div>
        <div class="col-4 px-1 mb-2"><div class="skeleton" style="height:24px;width:35%;"></div></div>
        <div class="col-4 px-1 mb-2"></div>
        <div class="col-4 px-1 mb-2"></div>
        <div class="col-4 px-1 mb-2"><div class="skeleton" style="height:42px;"></div></div>
    </div>`;
}

function getParentRightCardSkeletonRows(totalRows){
    var html = '';
    for(var i = 0; i < totalRows; i++){
        html += `<div class="mb-2">
            <div style="height:16px;" class="mb-1 skeleton"></div>
            <div style="height:12px;width:70%;" class="skeleton"></div>
        </div>`;
    }
    return html;
}

function getParentGreetingIconByMessage(welcomeMessage){
    var normalizedMessage = (welcomeMessage || "").toLowerCase();
    var timeOfDay = new Date().getHours();
    var iconPath = PATH_FOLDER_IMAGE2 + "good_morning_good_evening.svg";
    var extraClass = "";

    if(normalizedMessage.indexOf("afternoon") > -1){
        iconPath = PATH_FOLDER_IMAGE2 + "good_afternoon.svg";
    }else if(timeOfDay >= 21 && timeOfDay < 24){
        iconPath = PATH_FOLDER_IMAGE2 + "good_evening.svg";
    }else if((timeOfDay >= 0 && timeOfDay < 12) || (timeOfDay >= 16 && timeOfDay < 21)){
        extraClass = "mb-2";
    }
    return `<img src="${iconPath}" alt="Greeting Icon" class="${extraClass}" style="width:20px;height:20px;object-fit:contain;">`;
}

function getStudentPerformanceDetailsCard(data){
    var parentName = (typeof USER_FULL_NAME !== "undefined" && USER_FULL_NAME) ? USER_FULL_NAME : "Parent";
    var welcomeMessage = getWelcomeMessage();
    var showGreetingBanner = !(typeof window !== "undefined" && window.PARENT_DASHBOARD_GREETING_SHOWN_ONCE === true);
    var salutation = getSalutationByGender(GENDER) 
    var html=
    `<div class="card rounded-10 overflow-hidden"data>
        ${showGreetingBanner ? `
        <div class="js-parent-greeting-banner-wrap" style="overflow:hidden;max-height:260px;opacity:1;transform:translateY(0);margin-bottom:0;transition:max-height 0.55s ease,opacity 0.45s ease,transform 0.55s ease,margin 0.55s ease;">
            <div class="bg-primary-green-gradient text-center text-white py-3 px-2">
                <div class="d-inline-flex align-items-center px-3 py-1 rounded-pill mb-2" style="background:rgba(0,0,0,0.15);">
                    <span class="font-22 mr-1 d-inline-flex align-items-center" style="line-height:1;">${getParentGreetingIconByMessage(welcomeMessage)}</span>
                    <span class="font-weight-semi-bold font-16">${welcomeMessage}</span>
                </div>
                <h4 class="font-weight-bold m-0 text-white">${salutation} ${parentName}</h4>
                <p class="m-0 text-white">Thank you for standing strong in your child&#39;s journey.</p>
            </div>
        </div>
        ` : ""}
        <div class="card-body pt-3">
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
                            <a href="javascript:void(0)" class="d-inline-block text-center text-decoration-none w-100" onclick="callDashboardPageSchool(247,'parent-syllabus-assigned-teacher')">
                                <h4 class="text-secondary font-weight-bold font-26 mb-1">${data.summary.totalCourses}</h4>
                                <p class="m-0 text-secondary">Courses</p>
                            </a>
                        </div>
                    </div>
                </div>
                
                <div class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 mb-lg-0 mb-2">
                    <div class="card rounded-10 h-100">
                        <div class="card-body py-2">
                            <a href="javascript:void(0)" class="d-inline-block text-center text-decoration-none w-100" onclick="callDashboardPageSchool(251,'parent-class-schedule')">
                                <h4 class="text-review-dark font-weight-bold font-26 mb-1">${data.summary.totalClassesThisMonth}</h4>
                                <p class="m-0 text-review-dark">No. of Classes & Activities ${new Date().toLocaleString('en-US', { month: 'long' })} ${new Date().getFullYear().toString()}</p>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 mb-lg-0 mb-2">
                    <div class="card rounded-10 h-100">
                        <div class="card-body py-2">
                            <a href="javascript:void(0)" class="d-inline-block text-center text-decoration-none w-100" onclick="callDashboardPageSchool(253,'parent-attendance')">
                                <h4 class="text-success font-weight-bold font-26 mb-1">${data.summary.attendancePercentThisMonth}%</h4>
                                <p class="m-0 text-success">Attendance</p>
                                <div class="text-dark d-flex align-items-center justify-content-center mt-1">`
                                    if(data.summary.attendanceDeltaFromLastMonth < 1){
                                        html+=
                                        `<span class="bg-light-danger circle mr-1 d-inline-flex justify-content-center align-items-center p-1" style="width:20px;height:20px;">    
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="bg-light-danger circle m-0" style="width:15px;height:15px;fill:#d92550">
                                                <path d="M384 352c-17.7 0-32 14.3-32 32s14.3 32 32 32l160 0c17.7 0 32-14.3 32-32l0-160c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 82.7-169.4-169.4c-12.5-12.5-32.8-12.5-45.3 0L192 242.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0L320 205.3 466.7 352 384 352z"/>
                                            </svg>
                                        </span>
                                        &nbsp;${data.summary.attendanceDeltaFromLastMonth}% ${new Date().toLocaleString('en-US', { month: 'long' })} ${new Date().getFullYear().toString()}`;
                                    }else{
                                        html+=
                                        `<span class="bg-light-success circle mr-1 d-inline-flex justify-content-center align-items-center p-1" style="width:20px;height:20px;">    
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="bg-light-success circle m-0" style="width:15px;height:15px;fill:#1fc747">
                                                <path d="M384 160c-17.7 0-32-14.3-32-32s14.3-32 32-32l160 0c17.7 0 32 14.3 32 32l0 160c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-82.7-169.4 169.4c-12.5 12.5-32.8 12.5-45.3 0L192 269.3 54.6 406.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l160-160c12.5-12.5 32.8-12.5 45.3 0L320 306.7 466.7 160 384 160z"/>
                                            </svg>
                                        </span>
                                        &nbsp;${data.summary.attendanceDeltaFromLastMonth}% ${new Date().toLocaleString('en-US', { month: 'long' })} ${new Date().getFullYear().toString()}`;
                                    }
                                html+=`</div>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 mb-lg-0 mb-2">
                    <div class="card rounded-10 h-100">
                        <div class="card-body py-2">
                            <a href="javascript:void(0)" class="d-inline-block text-center text-decoration-none w-100" onclick="callDashboardPageSchool(254,'parent-academic-performance')">
                                <h4 class="text-primart font-weight-bold font-26 mb-1">${getGradeFromPercentage(data.summary.avgGradeThisMonth)}</h4>
                                <p class="m-0 text-primart">Performance</p>
                                <div class="text-dark d-flex align-items-center justify-content-center mt-1" id="gradeCompare">`;
                                    
                                html+=`</div>
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
        var activeStudentTimezone = STUDENT_LIST?.studentBasicDetails?.find(s => s.userId == ACTIVE_STUDENT_ID) ?.studentTimezone || moment.tz.guess();
        $.each(data.details.schedule, function(i,v){
            var startDate = convertDatetimeWithFormat(v.start, v.timezone, activeStudentTimezone, DATE_UTC+'T'+TIME_UTC);
            var endDate = convertDatetimeWithFormat(v.end, v.timezone, activeStudentTimezone, DATE_UTC+'T'+TIME_UTC)
            startDate = parseClassDateTime(startDate);
            endDate = parseClassDateTime(endDate);
            var startDateForBadge = startDate ? startDate.toISOString() : "";
            var endDateForBadge = endDate ? endDate.toISOString() : "";
            var classStatusForBadge = v.classStatus ? String(v.classStatus).replace(/"/g, '&quot;') : "";
            html+=
            `<div class="card rounded-10 mb-2 class-card" data-start="${startDateForBadge}" data-end="${endDateForBadge}" data-class-status="${classStatusForBadge}">
                <a href="javascript:void(0)" class="card-body p-2" onclick="callDashboardPageSchool(251,'parent-class-schedule')">
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
                                    <div class="widget-subheading opacity-6 text-dark">${convertDatetimeWithFormat(v.start, v.timezone, activeStudentTimezone, DISPLAY_TIME_FORMATTER)} to ${convertDatetimeWithFormat(v.end, v.timezone, activeStudentTimezone, DISPLAY_TIME_FORMATTER)}</div>
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
                    <a href="javascript:void(0)" class="text-primary ml-auto font-weight-semi-bold" onclick="callDashboardPageSchool(251,'parent-class-schedule')">
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



// attendance page content //

function getStudentPaymentListing(data) {
    
    var html = "";
    var today = new Date();
    today.setHours(0, 0, 0, 0);

    var cardFooterFlag = true;

    // ✅ Check if all payments are SUCCESS
    var allSuccessFlag = data.length > 0 &&  data.every(item => item.status === "SUCCESS");

    if (data.length > 0) {

        $.each(data, function (i, v) {

            // ✅ Only show cards for SCHEDULED payments
            if (v.status === "SCHEDULED" && v.scheduledPayDate) {

                var scheduledDate = new Date(v.scheduledPayDate);
                scheduledDate.setHours(0, 0, 0, 0);

                var badgeHtml = "";

                if (scheduledDate <= today) {
                    badgeHtml = `
                        <div class="badge-pill bg-light-danger text-danger ml-auto font-12 font-weight-semi-bold">
                            <span class="badge badge-dot badge-dot-lg badge-danger blink mr-1"></span>Due
                        </div>`;
                } else {
                    badgeHtml = `
                        <div class="badge-pill bg-light-warning text-dark ml-auto font-12 font-weight-semi-bold">
                            <span class="badge badge-dot badge-dot-lg badge-warning mr-1"></span>Upcoming
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
            }
        });

        // ✅ Show Ribbon ONLY if all payments SUCCESS
        if (allSuccessFlag) {
            cardFooterFlag = false;

            html = `
                <div class="mb-2">
                    <div class="full text-center">
                        <img src="${PATH_FOLDER_IMAGE2}badge_ribbon.png" 
                             alt="Payment" style="width:50px;"/>
                    </div>
                    <div class="text-dark opacity-8 text-center font-16">
                        Your punctual payments reflect your strong commitment 
                        to your child’s education. Thank you for your continued trust and support.
                    </div>
                </div>`;
        }

        var card = $("#studentPaymentListingWrapper").closest(".card");
        card.find(".card-footer").remove();

        if (data && data.length > 0 && cardFooterFlag && !allSuccessFlag) {
            card.append(`
                <div class="card-footer rounded-bottom-left-10 rounded-bottom-right-10">
                    <a href="javascript:void(0)" class="text-primary ml-auto font-weight-semi-bold"
                       onclick="callDashboardPageSchool(104,'parent-fee-details');">
                        View All <i class="fa fa-arrow-right ml-1"></i>
                    </a>
                </div>
            `);
        }
    }

    if (html === "") {
        html = `<div class="text-center font-weight-semi-bold font-14 text-dark">
                    No upcoming or due payments
                </div>`;
    }

    return html;
}
