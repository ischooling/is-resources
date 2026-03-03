async function renderAtendaceByStudentIdContent(){
    if(STUDENT_LIST.studentBasicDetails.length>0){
        $('#dashboardContentInHTML').html(getStudentTabSliderContent(STUDENT_LIST,'getStudentAttendanceDetails')+getAttendanceDetailsCardWrapper());
        getStudentAttendanceDetails(ACTIVE_STUDENT_ID);
        attendaceByStudentIdContentOnLoadEvent();
    }else{
        showMessageTheme2(0, "No student found");
    }
}

function getAttendanceDetailsCardWrapper(){
    var html=
    ` <div class="main-card mb-3">
        <div class="card">
            <div class="card-body">
                <div class="full" id="attendanceDetailsCard"></div>
                ${getTodayStudentSession()}
            </div>
        </div>
    </div>`;
    return html;
}

function getStudentShortOverviewByIdContent(data){
    var d = new Date();
    var monthName = d.toLocaleString('en-US', { month: 'long' });
    var year = d.getFullYear();
    var html=
            `<div class="form-row">
                <div class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 mb-lg-0 mb-2">
                    <div class="card rounded-10">
                        <div class="card-body pt-3 pb-2">
                            <div class="d-flex">
                                <div class="w-fit-content">
                                    <p class="mb-1 font-12">Classes Today</p>
                                    <h4 class="font-28 font-weight-bold text-review-dark">${data.classesToday}</h4>
                                </div>
                                <div class="w-fit-content d-inline-flex ml-auto">
                                    <div class="icon-wrapper m-0 rounded justify-content-center" style="width: 40px;height: 40px;">
                                        <div class="icon-wrapper-bg bg-review"></div>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" width="22" style="fill:#000088">
                                            <path d="M192 384c53 0 96 43 96 96 0 17.7-14.3 32-32 32L32 512c-17.7 0-32-14.3-32-32 0-53 43-96 96-96l96 0zM544 32c35.3 0 64 28.7 64 64l0 288c0 33.1-25.2 60.4-57.5 63.7l-6.5 .3-211.1 0c-5.1-24.2-16.3-46.1-32.1-64l51.2 0 0-32c0-17.7 14.3-32 32-32l96 0c17.7 0 32 14.3 32 32l0 32 32 0 0-288-352 0 0 57.3c-14.8-6-31-9.3-48-9.3-5.4 0-10.8 .3-16 1l0-49c0-35.3 28.7-64 64-64l352 0zM144 352a80 80 0 1 1 0-160 80 80 0 1 1 0 160z"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 mb-lg-0 mb-2">
                    <div class="card rounded-10">
                        <div class="card-body pt-3 pb-2">
                            <div class="d-flex">
                                <div class="w-fit-content">
                                    <p class="mb-1 font-12">Attendance</p>
                                    <div class="text-dark d-flex align-items-center justify-content-center mt-1">
                                        <h4 class="font-28 font-weight-bold text-success mr-1">${data.attendancePercentThisMonth}%</h4>`
                                            if(data.attendanceDeltaFromLastMonth < 1){
                                                html+=
                                                `<span class="bg-light-danger circle mr-1 d-inline-flex justify-content-center align-items-center p-1" style="width:20px;height:20px;">    
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="bg-light-danger circle m-0" style="width:15px;height:15px;fill:#d92550">
                                                        <path d="M384 352c-17.7 0-32 14.3-32 32s14.3 32 32 32l160 0c17.7 0 32-14.3 32-32l0-160c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 82.7-169.4-169.4c-12.5-12.5-32.8-12.5-45.3 0L192 242.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0L320 205.3 466.7 352 384 352z"/>
                                                    </svg>
                                                </span>
                                                <span class="text-dark font-14 font-weight-normal">${data.attendanceDeltaFromLastMonth}% ${monthName} ${year}</span>`;
                                            }else{
                                                html+=
                                                `<span class="bg-light-success circle mr-1 d-inline-flex justify-content-center align-items-center p-1" style="width:20px;height:20px;">    
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="bg-light-success circle m-0" style="width:15px;height:15px;fill:#1fc747">
                                                        <path d="M384 160c-17.7 0-32-14.3-32-32s14.3-32 32-32l160 0c17.7 0 32 14.3 32 32l0 160c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-82.7-169.4 169.4c-12.5 12.5-32.8 12.5-45.3 0L192 269.3 54.6 406.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l160-160c12.5-12.5 32.8-12.5 45.3 0L320 306.7 466.7 160 384 160z"/>
                                                    </svg>
                                                </span>
                                                <span class="text-dark font-14 font-weight-normal">${data.attendanceDeltaFromLastMonth}% ${monthName} ${year}</span>`;
                                            }
                                    html+=`</div>
                                </div>
                                <div class="w-fit-content d-inline-flex ml-auto">
                                    <div class="icon-wrapper m-0 rounded" style="width: 40px;height: 40px;">
                                        <div class="icon-wrapper-bg bg-success"></div>
                                        <i class="fa fa-pie-chart text-success font-22"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 mb-lg-0 mb-2">
                    <div class="card rounded-10">
                        <div class="card-body pt-3 pb-2">
                            <div class="d-flex">
                                <div class="w-fit-content">
                                    <p class="mb-1 font-12">Late</p>
                                    <div class="text-dark d-flex align-items-center justify-content-center mt-1">
                                        <h4 class="font-28 font-weight-bold text-warning mr-1">${data.latePercentThisMonth}</h4>`
                                            if(data.lateDeltaFromLastMonth < 1){
                                                html+=
                                                `<span class="bg-light-danger circle mr-1 d-inline-flex justify-content-center align-items-center p-1" style="width:20px;height:20px;">    
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="bg-light-danger circle m-0" style="width:15px;height:15px;fill:#d92550">
                                                        <path d="M384 352c-17.7 0-32 14.3-32 32s14.3 32 32 32l160 0c17.7 0 32-14.3 32-32l0-160c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 82.7-169.4-169.4c-12.5-12.5-32.8-12.5-45.3 0L192 242.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0L320 205.3 466.7 352 384 352z"/>
                                                    </svg>
                                                </span>
                                                <span class="text-dark font-14 font-weight-normal">${data.lateDeltaFromLastMonth}% ${monthName} ${year}</span>`;
                                            }else{
                                                html+=
                                                `<span class="bg-light-success circle mr-1 d-inline-flex justify-content-center align-items-center p-1" style="width:20px;height:20px;">    
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="bg-light-success circle m-0" style="width:15px;height:15px;fill:#1fc747">
                                                        <path d="M384 160c-17.7 0-32-14.3-32-32s14.3-32 32-32l160 0c17.7 0 32 14.3 32 32l0 160c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-82.7-169.4 169.4c-12.5 12.5-32.8 12.5-45.3 0L192 269.3 54.6 406.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l160-160c12.5-12.5 32.8-12.5 45.3 0L320 306.7 466.7 160 384 160z"/>
                                                    </svg>
                                                </span>
                                                <span class="text-dark font-14 font-weight-normal">${data.lateDeltaFromLastMonth}% ${monthName} ${year}</span>`;
                                            }
                                    html+=`</div>
                                </div>
                                <div class="w-fit-content d-inline-flex ml-auto">
                                    <div class="icon-wrapper m-0 rounded" style="width: 40px;height: 40px;">
                                        <div class="icon-wrapper-bg bg-warning"></div>
                                        <i class="fa fa-clock text-warning font-22"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                ${/*<div class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 mb-lg-0 mb-2">
                    <div class="card rounded-10">
                        <div class="card-body pt-3 pb-2">
                            <a href="javascript:void(0)" class="d-flex btn align-items-center bg-primary-green-gradient mb-1 justify-content-between">
                                <div>
                                    <div class="text-white text-left">Download Attendance Report</div>
                                    <div class="font-12 font-weight-normal text-left text-white">${monthName}&nbsp;${year}</div>
                                </div>
                                <div class="ml-2">
                                    <i class="fa fa-download font-22 text-white"></i>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>*/''}
            </div>`;
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

function getTodayStudentSession() {
    var html=
    `<div class="full mt-3">
        <div class="d-flex flex-wrap card-body py-0">
            <h5 class="text-dark font-weight-semi-bold mb-2">Today's Session</h5>
            <a href="javascript:void(0)" class="text-primary ml-auto font-weight-semi-bold" onclick="callDashboardPageSchool(251,'parent-class-schedule')">
                View All <i class="fa fa-arrow-right ml-1"></i>
            </a>
        </div>
        <div class="card rounded-10">
            <div class="card-body py-3 overflow-y-auto d-flex flex-wrap gap-15" id="todayStudentSessionWrapper">
                ${getParentRightCardSkeletonRows(4)}
            </div>
        </div>
    </div>`;
    return html;
}


function getStudentTodaySessionList(data){
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
            if(i <= 4){
                html+=
                `<div class="border box box-shadow-none card class-card mb-2 rounded-10" data-start="${startDateForBadge}" data-end="${endDateForBadge}" data-class-status="${classStatusForBadge}">
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
                                        <div class="widget-subheading opacity-6 text-dark mr-4">${convertDatetimeWithFormat(v.start, v.timezone, activeStudentTimezone, DISPLAY_TIME_FORMATTER)} to ${convertDatetimeWithFormat(v.end, v.timezone, activeStudentTimezone, DISPLAY_TIME_FORMATTER)}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </a>
                </div>`;
            }
        });
        
    }else{
        html+=`<div class="full font-14 font-weight-semi-bold text-dark text-center">No classes or activities today</div>`
    }
    
    
    return html;
}
