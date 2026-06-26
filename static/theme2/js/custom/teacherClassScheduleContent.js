function renderTeacherClassScheduleContent() {
    $('#dashboardContentInHTML').html(teacherClassScheduleContent());
    teacherClassScheduleContentLoadEvent();
    renderTeacherClassesListing();
}

function teacherClassScheduleContent() {
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
                                        <div class="d-inline-flex align-items-center">
                                            <div class="fc-right">
                                                <div class="btn-group">
                                                    <button type="button" class="fc-today-button btn btn-light active btn-pill teacher-calendar-view-button" onclick="viewTeacherCalender(this,'agendaDay')">Daily</button>
                                                    <button type="button" class="fc-agendaDay-button btn btn-light btn-pill teacher-calendar-view-button" onclick="viewTeacherCalender(this,'agendaWeek')">Weekly</button>
                                                    <button type="button" class="fc-agendaWeek-button btn btn-light btn-pill teacher-calendar-view-button" onclick="showTeacherCustomCalendarFilterForm(this)">Custom</button>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="fc-center mx-auto">
                                            <div>
                                                <span class="d-inline-block country-flag mr-2">
                                                    <img src="" class="rounded" id="teacherCountryFlag" width="30px" alt="Flag" style="display:none"/>
                                                </span>
                                                <span class="teacher_timezone d-inline-block font-size-lg font-weight-semi-bold text-dark"></span>
                                                <div class="clock-box">
                                                    <span class="user_current_time clock-bg font-18 text-primary font-weight-semi-bold time-label"></span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="school-calender-tabs tabs text-right">
                                            <button class="btn-wide btn btn-sm bg-light-dark text-white btn-outline-dark rounded px-4 teacher_calendar_request_button active_calendar_catergory mb-sm-0 mb-2" data-category="ALL" onclick="teacherCalendarRequestByFilter(this)">
                                                <div class="font-16 font-weight-bold line-height-1 teacher_over_All_Class_Activity_Count">0</div>
                                                <div class="font-12 line-height-1 font-weight-light">All</div>
                                            </button>
                                            <button class="btn-wide btn ml-2 btn-outline-primary bg-light-primary btn-sm rounded text-primary teacher_calendar_request_button mb-sm-0 mb-2" data-category="CLASS" onclick="teacherCalendarRequestByFilter(this)">
                                                <div class="font-16 font-weight-bold line-height-1 teacher_class_Count">0</div>
                                                <div class="font-12 text-dark line-height-1 font-weight-light">Classes</div>
                                            </button>
                                            <button class="btn-wide btn ml-2 btn-outline-secondary bg-light-secondary btn-sm rounded text-secondary teacher_calendar_request_button mb-sm-0 mb-2" data-category="ACTIVITY" onclick="teacherCalendarRequestByFilter(this)">
                                                <div class="font-16 font-weight-bold line-height-1 teacher_activity_Count">0</div>
                                                <div class="font-12 line-height-1 font-weight-light">Activity</div>
                                            </button>
                                        </div>
                                    </div>
                                    <hr/>
                                    <div class="d-flex p-3 flex-wrap border rounded-top-left-10 rounded-top-right-10 align-items-center">
                                        <h4 class="m-0 text-dark font-weight-bold font-20">Class Summary</h4>
                                        <div class="ml-auto teacher-custom-calendar-filter-form" style="display:none">
                                            <div class="d-inline-flex gap-5">
                                                <div>
                                                    <input type="text" class="datepicker form-control form-control-sm" id="teacherStartDate" name="teacherStartDate" placeholder="Select Start Date"/>
                                                </div>
                                                <div>
                                                    <input type="text" class="datepicker form-control form-control-sm" id="teacherEndDate" name="teacherEndDate" placeholder="Select End Date"/>
                                                </div>
                                                <button class="btn btn-primary btn-sm" onclick="viewTeacherCalender('', 'custom')">Search</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="full table-responsive">
                                        <table class="table border" id="teacherScheduleTable" style="min-width:800px">
                                            <thead>
                                                <tr>
                                                    <th class="bg-primary text-white font-12">S.No</th>
                                                    <th class="bg-primary text-white font-12">Course Name</th>
                                                    <th class="bg-primary text-white font-12">Time | Duration</th>
                                                    <th class="bg-primary text-white font-12">Type</th>
                                                    <th class="bg-primary text-white font-12">Status</th>
                                                    <th class="bg-primary text-white font-12">View Summary</th>
                                                    <th class="bg-primary text-white font-12">Feedback Summary</th>
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
