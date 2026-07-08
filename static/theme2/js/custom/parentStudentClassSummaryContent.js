function renderParentStudentClassSummaryContent() {
    if (typeof getStudentTabSliderContent !== "function") {
        CLASS_SUMMARY_ACTIVE_STUDENT_ID = USER_ID;
        $('#dashboardContentInHTML').html(parentStudentClassSummaryContent());
        renderClassSummaryListing(CLASS_SUMMARY_ACTIVE_STUDENT_ID);
        parentStudentClassSummaryContentLoadEvent();
        return;
    }
    if (STUDENT_LIST.studentBasicDetails.length > 0) {
        CLASS_SUMMARY_ACTIVE_STUDENT_ID = ACTIVE_STUDENT_ID || STUDENT_LIST.studentBasicDetails[0].userId;
        $('#dashboardContentInHTML').html(getStudentTabSliderContent(STUDENT_LIST, 'renderClassSummaryListing') + parentStudentClassSummaryContent());
        renderClassSummaryListing(CLASS_SUMMARY_ACTIVE_STUDENT_ID);
        parentStudentClassSummaryContentLoadEvent();
    } else {
        showMessageTheme2(0, "No student found");
    }
}

function parentStudentClassSummaryContent() {
    return `
    <div class="main-card mb-3">
        <div class="full">
            <div class="card-body px-0 pb-0 pt-0">
                <div class="row">
                    <div class="col-lg-12 col-md-12 col-sm-12 col-12 pt-2">
                        <div class="full mt-1">
                            <div class="card rounded-15">
                                <div class="card-body">
                                    <div class="text-left d-flex align-items-center flex-wrap fc-toolbar fc-header-toolbar">
                                        <div class="d-inline-flex align-items-center">
                                            <div class="fc-right">
                                                <div class="btn-group">
                                                    <button type="button" class="fc-today-button btn btn-light active btn-pill class-summary-view-button" data-student-id="" onclick="viewClassSummaryCalender(this,'agendaDay')">Daily</button>
                                                    <button type="button" class="fc-agendaDay-button btn btn-light btn-pill class-summary-view-button" data-student-id="" onclick="viewClassSummaryCalender(this,'agendaWeek')">Weekly</button>
                                                    <button type="button" class="fc-agendaWeek-button btn btn-light btn-pill class-summary-view-button" data-student-id="" onclick="showClassSummaryCustomFilterForm(this)">Custom</button>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="fc-center mx-auto">
                                            <div>
                                                <span class="d-inline-block country-flag mr-2">
                                                    <img src="" class="rounded" id="classSummaryCountryFlag" width="30px" alt="Flag" style="display:none"/>
                                                </span>
                                                <span class="class_summary_user_timezone d-inline-block font-size-lg font-weight-semi-bold text-dark"></span>
                                            </div>
                                        </div>
                                        <div class="school-calender-tabs tabs text-right">
                                            <button class="btn-wide btn btn-sm bg-light-dark text-dark btn-outline-dark rounded px-4 class_summary_request_button active_calendar_catergory mb-sm-0 mb-2" data-category="ALL" onclick="classSummaryCalendarRequestByFilter(this)">
                                                <div class="font-16 font-weight-bold line-height-1 text-dark class_summary_all_count">0</div>
                                                <div class="font-12 line-height-1 font-weight-light text-dark">All</div>
                                            </button>
                                            <button class="btn-wide btn ml-2 btn-outline-primary bg-light-primary btn-sm rounded text-primary class_summary_request_button mb-sm-0 mb-2" data-category="CLASS" onclick="classSummaryCalendarRequestByFilter(this)">
                                                <div class="font-16 font-weight-bold line-height-1 text-dark class_summary_class_count">0</div>
                                                <div class="font-12 text-dark line-height-1 font-weight-light">Classes</div>
                                            </button>
                                            <button class="btn-wide btn ml-2 btn-outline-secondary bg-light-secondary btn-sm rounded text-secondary class_summary_request_button mb-sm-0 mb-2" data-category="ACTIVITY" onclick="classSummaryCalendarRequestByFilter(this)">
                                                <div class="font-16 font-weight-bold line-height-1 text-dark class_summary_activity_count">0</div>
                                                <div class="font-12 line-height-1 font-weight-light text-dark">Activity</div>
                                            </button>
                                        </div>
                                    </div>
                                    <hr/>
                                    <div class="d-flex p-3 flex-wrap border rounded-top-left-10 rounded-top-right-10 align-items-center">
                                        <h4 class="m-0 text-dark font-weight-bold font-20">Class Summary</h4>
                                        <div class="ml-auto class-summary-custom-filter-form" style="display:none">
                                            <div class="d-inline-flex gap-5">
                                                <div>
                                                    <input type="text" class="datepicker form-control form-control-sm" id="classSummaryStartDate" name="classSummaryStartDate" placeholder="Select Start Date"/>
                                                </div>
                                                <div>
                                                    <input type="text" class="datepicker form-control form-control-sm" id="classSummaryEndDate" name="classSummaryEndDate" placeholder="Select End Date"/>
                                                </div>
                                                <button class="btn btn-primary btn-sm" onclick="viewClassSummaryCalender('', 'custom')">Search</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="full table-responsive">
                                        <table class="table border" id="classSummaryTable" style="min-width:800px">
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
}

function renderClassSummaryTable(events, startDate, endDate) {
    var start = moment(startDate);
    var end = moment(endDate);

    events.sort(function(a, b) { return new Date(a.start) - new Date(b.start); });

    var grouped = {};
    events.forEach(function(event) {
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
                ${classSummaryFormatDateHeading(dateKey)}
            </td>
        </tr>`;

        if (grouped[dateKey] && grouped[dateKey].length > 0) {
            grouped[dateKey].forEach(function(event) {
                var typeBadge = event.category === "CLASS"
                    ? `<span class="badge badge-pill bg-light-primary text-primary ml-auto font-12 font-weight-semi-bold w-fit-content text-transform-none">Class</span>`
                    : `<span class="badge badge-pill bg-light-secondary text-secondary ml-auto font-12 font-weight-semi-bold w-fit-content text-transform-none">Activity</span>`;

                if (event.category === "CLASS") {
                    CLASS_SUMMARY_CLASS_COUNT++;
                } else if (event.category === "ACTIVITY") {
                    CLASS_SUMMARY_ACTIVITY_COUNT++;
                }

                var eventInstanceKey = classSummaryBuildEventInstanceKey(event);
                html += `
                <tr class="${event.category}-summary-row class-summary-even-row" data-event-id="${event.id}">
                    <td class="py-2">${serial++}</td>
                    <td class="py-2">${event.courseName}</td>
                    <td class="py-2">${classSummaryFormatTimeRange(event.start, event.end)}</td>
                    <td class="py-2">${getSalutationByGender(event.teacherGender)} ${event.teacherName || 'N/A'}</td>
                    <td class="py-2">${typeBadge}</td>
                    <td class="py-2">${classSummaryGetStatusBadge(classSummaryGetEventStatus(event))}</td>
                    <td class="py-2 text-primary">${event.classesAttendance == "Attended" ? event.classesAttendance + " | " + event.classesAttendanceDuration : (event.classesAttendance == "Attending" ? event.classesAttendance : "<span class='text-dark'>N/A</span>")}</td>
                    <td class="py-2">${event.classesAttendance == "Attended" ? `<a href='javascript:void(0);' onclick='showClassSummaryMeetingSummary("${event.meetingId}","${event.id}","${eventInstanceKey}")' class='border border-primary text-primary bg-light-primary rounded-10 btn btn-sm font-11'><i class="fa fa-eye" aria-hidden="true"></i> View</a>` : "N/A"}</td>
                </tr>`;
            });
        } else {
            html += `
            <tr>
                <td colspan="8" class="text-center text-muted">No Class / Activity</td>
            </tr>`;
        }

        start.add(1, 'day');
    }

    $(".class_summary_all_count").text(CLASS_SUMMARY_CLASS_COUNT + CLASS_SUMMARY_ACTIVITY_COUNT);
    $(".class_summary_class_count").text(CLASS_SUMMARY_CLASS_COUNT);
    $(".class_summary_activity_count").text(CLASS_SUMMARY_ACTIVITY_COUNT);

    $("#classSummaryTable tbody").html(html);
}
