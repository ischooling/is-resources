var CALENDERVIEW="agendaDay";
var CLASS_COUNT=0;
var ACTIVITY_COUNT=0;
function renderParentStudentClassScheduleContent(){
    if(STUDENT_LIST.studentBasicDetails.length>0){
        $('#dashboardContentInHTML').html(getStudentTabSliderContent(STUDENT_LIST, 'renderClassesListing')+parentStudentClassScheduleContent());
        renderClassesListing(ACTIVE_STUDENT_ID, CALENDERVIEW);
        parentStudentClassScheduleContentLoadEvent()
    }else{
        showMessageTheme2(0, "No student found");
    }  
}

function parentStudentClassScheduleContent() {
    var html = `
    <div class="main-card mb-3">
        <div class="full">
            <div class="card-body px-0 pb-0 pt-0">
                <div class="row">
                    <div class="col-lg-12 col-md-12 col-sm-12 col-12 pt-2">
                        <div class="full mt-1">
                            <div class="card rounded-15">
                                <div class="card-body">
                                    <div class="text-left d-flex align-items-center flex-wrap fc-toolbar fc-header-toolbar">
                                        ${/*
                                            <div>
                                                <span class="d-inline-block country-flag mr-2">
                                                    <img src="${PATH_FOLDER_FONT2}.svg" class="rounded" width="30px" alt="Flag"/>
                                                </span>
                                                <span class="user_timezone d-inline-block font-size-lg font-weight-semi-bold text-dark">
                                                    <label>&nbsp;</label>
                                                </span>
                                                <div class="clock-box">
                                                    <span class="user_current_time clock-bg font-18 text-primary font-weight-semi-bold time-label"></span>
                                                </div>
                                            </div>    
                                        */''}
                                        
                                        <div class="d-inline-flex align-items-center">
                                            <div class="fc-right">
                                                <div class="btn-group">
                                                    <button type="button" class="fc-today-button btn btn-light active btn-pill calendar-view-button" data-student-id="" onclick="viewCalender(this,\'agendaDay\')">Daily</button>
                                                    <button type="button" class="fc-agendaDay-button btn  btn-light btn-pill calendar-view-button" data-student-id="" onclick="viewCalender(this,\'agendaWeek\')">Weekly</button>
                                                    <button type="button" class="fc-agendaWeek-button btn btn-light btn-pill calendar-view-button" data-student-id="" onclick="showCustomCalendarFilterForm(this)">Custom</button>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="fc-center mx-auto">
                                                
                                            ${/*
                                            <div class="btn-group">
                                            <button type="button" class="fc-prev-button btn btn-primary" aria-label="prev">
                                                <span class="fa fa-chevron-left"></span>
                                            </button>
                                            <button type="button" class="fc-next-button btn btn-primary" aria-label="next">
                                                <span class="fa fa-chevron-right"></span>
                                            </button> 
                                            </div>
                                            <h4>Wednesday, Feb 25, 2026</h4>
                                            */''}
                                            
                                            <div>
                                                <span class="d-inline-block country-flag mr-2">
                                                    <img src="" class="rounded" id="countryFlag" width="30px" alt="Flag" style="display:none"/>
                                                </span>
                                                <span class="user_timezone d-inline-block font-size-lg font-weight-semi-bold text-dark"></span>
                                                <div class="clock-box">
                                                    <span class="user_current_time clock-bg font-18 text-primary font-weight-semi-bold time-label"></span>
                                                </div>
                                            </div> 
                                        </div>
                                        <div class="school-calender-tabs tabs text-right">
                                            <button class="btn-wide btn btn-sm bg-light-dark text-dark btn-outline-dark rounded px-4 calendar_request_button active_calendar_catergory mb-sm-0 mb-2" data-category="ALL" onclick="parentStudentCalendarRequestByFilter(this)">
                                                <div class="font-16 font-weight-bold line-height-1 over_All_Class_Activity_Count">0</div>
                                                <div class="font-12 line-height-1 font-weight-light over_All_Class_Activity_Label">All</div>
                                            </button>
                                            <button class="btn-wide btn ml-2 btn-outline-primary bg-light-primary btn-sm rounded text-primary calendar_request_button mb-sm-0 mb-2" data-category="CLASS" onclick="parentStudentCalendarRequestByFilter(this)">
                                                <div class="font-16 font-weight-bold line-height-1 class_Count">0</div>
                                                <div class="font-12 text-dark line-height-1 font-weight-light">Classes</div>
                                            </button>
                                            <button class="btn-wide btn ml-2 btn-outline-secondary bg-light-secondary btn-sm rounded text-secondary calendar_request_button mb-sm-0 mb-2" data-category="ACTIVITY" onclick="parentStudentCalendarRequestByFilter(this)">
                                                <div class="font-16 font-weight-bold line-height-1 activity_Count">0</div>
                                                <div class="font-12 line-height-1 font-weight-light">Activity</div>
                                            </button>
                                        </div>
                                    </div>
                                    <hr/>
                                    <div class="d-flex p-3 flex-wrap border rounded-top-left-10 rounded-top-right-10 align-items-center">
                                        <h4 class="m-0 text-dark font-weight-bold font-20 ">Class Schedule</h4>
                                        <div class="ml-auto custom-calendar-filter-form" style="display:none">
                                            <div class="d-inline-flex gap-5" >
                                                <div>
                                                    <input type="text" class="datepicker form-control form-control-sm" id="startDate" name="startDate" placeholder="Select Start Date"/>
                                                </div>
                                                <div>
                                                    <input type="text" class="datepicker form-control form-control-sm" id="endDate" name="endDate" placeholder="Select End Date"/>
                                                </div>  
                                                <button class="btn btn-primary btn-sm" onclick="viewCalender(\'\', \'custom\')">Search</button>  
                                            </div>        
                                        </div>        
                                    </div>
                                    <div class="full table-responsive">
                                        <table class="table border" id="schoolcalendarTable" style="min-width:800px">
                                            <thead>
                                                <tr>
                                                    <th class="bg-primary text-white font-12">S.No</th>
                                                    <th class="bg-primary text-white font-12">Course Name</th>
                                                    <th class="bg-primary text-white font-12">Time | Duration</th>
                                                    <th class="bg-primary text-white font-12">Teacher | Host</th>
                                                    <th class="bg-primary text-white font-12">Type</th>
                                                    <th class="bg-primary text-white font-12">Status</th>
                                                    <th class="bg-primary text-white font-12">Classes Attendance</th>
                                                    <th class="bg-primary text-white font-12">View Summary</th>
                                                </tr>
                                            </thead>
                                            <tbody class="font-12"></tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;

    return html;
}

function renderClassScheduleTable(events, startDate, endDate) {
    var start = moment(startDate);
    var end = moment(endDate);

    events.sort((a, b) => new Date(a.start) - new Date(b.start));

    var grouped = {};
    events.forEach(event => {
        var dateKey = moment(event.start).format("YYYY-MM-DD");
        if (!grouped[dateKey]) grouped[dateKey] = [];
        grouped[dateKey].push(event);
    });

    var html = "";
    var serial = 1;

    while (start.isSameOrBefore(end)) {

        var dateKey = start.format("YYYY-MM-DD");

        html += `
        <tr>
            <td colspan="8" class="text-center font-weight-bold bg-light py-1 font-14">
                ${formatDateHeading(dateKey)}
            </td>
        </tr>`;

        if (grouped[dateKey] && grouped[dateKey].length > 0) {
            grouped[dateKey].forEach(event => {

                var typeBadge = event.category === "CLASS"
                ? `<span class="badge badge-pill bg-light-primary text-primary ml-auto font-12 font-weight-semi-bold w-fit-content text-transform-none">Class</span>`
                : `<span class="badge badge-pill bg-light-secondary text-secondary ml-auto font-12 font-weight-semi-bold w-fit-content text-transform-none">Activity</span>`;

                if(event.category === "CLASS"){
                    CLASS_COUNT++;
                }else if(event.category === "ACTIVITY"){
                    ACTIVITY_COUNT++;
                } 
                html += `
                <tr class="${event.category}-row even-row" data-event-id="${event.id}">
                    <td class="py-2">${serial++}</td>
                    <td class="py-2">${event.courseName}</td>
                    <td class="py-2">${formatTimeRange(event.start, event.end)}</td>
                    <td class="py-2">${getSalutationByGender(event.teacherGender)} ${event.teacherName || 'N/A'}</td>
                    <td class="py-2">${typeBadge}</td>
                    <td class="py-2 status-cell">${getStatusBadge(getEventStatus(event))}</td>
                    <td class="py-2 text-primary">${event.classesAttendance == "Attended" ? event.classesAttendance + " | " + event.classesAttendanceDuration : (event.classesAttendance == "Attending" ? event.classesAttendance : "<span class='text-dark'>N/A<span>")}</td>
                    <td class="py-2">${event.classesAttendance == "Attended" ? `<a href='javascript:void(0);' onclick='showClassMeetingSummary("${event.meetingId}","${event.id}")' class='border border-primary text-primary bg-light-primary rounded-10 btn btn-sm font-11'> <i class="fa fa-eye" aria-hidden="true"></i> View</a>` : "N/A"}</td>
                </tr>`;
            });

        } else {

            html += `
            <tr>
                <td colspan="8" class="text-center text-muted">
                    No Class / Activity
                </td>
            </tr>`;
        }

        start.add(1, 'day');
    }

    $(".over_All_Class_Activity_Count").text(CLASS_COUNT + ACTIVITY_COUNT);
    $(".class_Count").text(CLASS_COUNT);
    $(".activity_Count").text(ACTIVITY_COUNT);

    $("#schoolcalendarTable tbody").html(html);
}

function getParentStudentClassSummaryRightSlideModal(){
    return `
    <div id="parentStudentClassSummaryModal" class="modal fade pr-0 right-slide-modal" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static">
        <div class="modal-dialog modal-xl m-0 ml-auto h-100" role="document">
            <div class="modal-content border-0 h-100 rounded-0">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                <div class="modal-header border-0 px-4 py-3" style="background:linear-gradient(90deg,#007FFF 0%,#02b9cc 100%);">
                    <div class="d-flex align-items-center">
	                        <div class="mr-1 d-flex align-items-center justify-content-center text-white" style="width: 40px;height: 28px;">
	                            <img src="${PATH_FOLDER_IMAGE2}class-schedule-calender-icon.png" alt="icon" style="height: 100%; width: auto;" />
	                        </div>
                        <div>
                            <h4 class="text-white font-weight-bold mb-0">Student Class Summary</h4>
                            <p class="text-white-50 mb-0 font-13">Detailed attendance and session report</p>
                        </div>
                    </div>
                </div>
                <div class="modal-body px-4 py-3 overflow-auto" id="parentStudentClassSummaryModalBody"></div>
            </div>
        </div>
    </div>`;
}

function getParentStudentClassSummaryLoadingHtml(){
    return `
    <div class="py-5 text-center">
        <i class="fa fa-circle-o-notch fa-spin text-primary font-24 mb-2" aria-hidden="true"></i>
        <p class="mb-0 text-muted">Loading class summary...</p>
    </div>`;
}

function getParentStudentClassSummaryNoDataHtml(message){
    return `
    <div class="py-5 text-center">
        <i class="fa fa-info-circle text-muted font-24 mb-2" aria-hidden="true"></i>
        <p class="mb-0 text-muted">${message || "No class summary found."}</p>
    </div>`;
}


