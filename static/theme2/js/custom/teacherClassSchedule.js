var TEACHER_CALENDERVIEW = "agendaDay";
var TEACHER_CLASS_COUNT = 0;
var TEACHER_ACTIVITY_COUNT = 0;
var TEACHER_GLOBAL_EVENTS = [];

function formatDateHeading(dateStr) {
    return moment(dateStr).format("dddd, MMM DD, YYYY");
}

function formatTimeRange(start, end) {
    var s = moment(start).format("hh:mm A");
    var e = moment(end).format("hh:mm A");
    var duration = moment(end).diff(moment(start), 'minutes');
    return s + " to " + e + " | " + duration + " min";
}

function getEventStatus(event) {
    var currentTimeStr = $("#currentTimeForUser").text().trim();
    var now = moment(currentTimeStr, "MMM DD, YYYY hh:mm:ss a", true);
    var start = moment(event.start);
    var end = moment(event.end);
    if (now.isBefore(start)) {
        return "Upcoming";
    } else if (now.isSameOrAfter(start) && now.isSameOrBefore(end)) {
        return "Live";
    } else {
        var rawStatus = (event.classStatus || "").toString().trim();
        return rawStatus !== "" ? rawStatus : "Completed";
    }
}

function getStatusBadge(status) {
    if (status === "Live") {
        return '<div class="badge-pill bg-light-success text-success font-12 font-weight-semi-bold w-fit-content"><span class="badge badge-dot badge-dot-lg badge-success badge-pulse mr-1">Badge</span>Live</div>';
    }
    if (status === "Upcoming") {
        return '<div class="badge-pill bg-light-warning text-dark font-12 font-weight-semi-bold w-fit-content"><span class="badge badge-dot badge-dot-lg badge-warning mr-1">Badge</span>Upcoming</div>';
    }
    if (status === "Completed") {
        return '<div class="badge-pill bg-light text-gray font-12 font-weight-semi-bold w-fit-content"><span class="badge badge-dot badge-dot-lg badge-gray mr-1">Badge</span>Completed</div>';
    }
    if (status === "Not Started") {
        return '<div class="badge-pill bg-light-danger text-danger font-12 font-weight-semi-bold w-fit-content"><span class="badge badge-dot badge-dot-lg badge-danger mr-1">Badge</span>Not Started</div>';
    }
    if (status && status !== "") {
        return '<div class="badge-pill bg-light text-gray font-12 font-weight-semi-bold w-fit-content"><span class="badge badge-dot badge-dot-lg badge-gray mr-1">Badge</span>' + status + '</div>';
    }
    return '<div class="badge-pill bg-light-warning text-dark font-12 font-weight-semi-bold w-fit-content"><span class="badge badge-dot badge-dot-lg badge-warning mr-1">Badge</span>Upcoming</div>';
}

function teacherClassScheduleContentLoadEvent() {
    $("#teacherStartDate").datepicker({
        autoclose: true,
        format: 'M d, yyyy',
        container: 'body',
    });
    $("#teacherEndDate").datepicker({
        autoclose: true,
        format: 'M d, yyyy',
        container: 'body',
    });
    calendarTimeInterval("Asia/Singapore");
}

function viewTeacherCalender(src, calendarView) {
    if (calendarView != "custom") {
        TEACHER_CALENDERVIEW = calendarView;
        $(".teacher-calendar-view-button").removeClass("active");
        $(src).addClass("active");
    }
    renderTeacherClassesListing();
}

function showTeacherCustomCalendarFilterForm(src) {
    TEACHER_CALENDERVIEW = "custom";
    $(".teacher-calendar-view-button").removeClass("active");
    $(src).addClass("active");
    $(".teacher-custom-calendar-filter-form").show();
}

async function renderTeacherClassesListing() {
    TEACHER_CLASS_COUNT = 0;
    TEACHER_ACTIVITY_COUNT = 0;
    var response = await callTeacherClassSchedule();
    TEACHER_GLOBAL_EVENTS = response.events;
    setInterval(function () {
        updateTeacherEventStatuses();
    }, 1000);
    renderTeacherScheduleTable(response.events, response.startDate, response.endDate);
}

async function callTeacherClassSchedule() {
    var startFormatted, endFormatted;

    if (TEACHER_CALENDERVIEW == "agendaDay") {
        var today = moment();
        startFormatted = today.format('YYYY-MM-DD');
        endFormatted = today.format('YYYY-MM-DD');
    } else if (TEACHER_CALENDERVIEW == "agendaWeek") {
        var today = moment();
        startFormatted = today.clone().startOf('week').format('YYYY-MM-DD');
        endFormatted = today.clone().endOf('week').format('YYYY-MM-DD');
    } else if (TEACHER_CALENDERVIEW == "custom") {
        startFormatted = moment(new Date($("#teacherStartDate").val())).format('YYYY-MM-DD');
        endFormatted = moment(new Date($("#teacherEndDate").val())).format('YYYY-MM-DD');
    }

    if (TEACHER_CALENDERVIEW != "custom") {
        $(".teacher-custom-calendar-filter-form").hide();
    }

    var payload = {
        userId: USER_ID,
        startDate: startFormatted,
        endDate: endFormatted
    };

    var ajaxReqDetails = {
        method: "POST",
        url: APP_BASE_URL + SCHOOL_UUID + "/dashboard/teacher/class-schedule-and-summary",
        body: payload,
        global: true,
        showMessage: false,
        onFaildResolved: true,
        onSuccessResolved: true
    };

    var eventList = await callCommonAjax(ajaxReqDetails);
    var finalEvents = [];
    var events = (eventList && eventList.details && eventList.details.schedule) ? eventList.details.schedule : [];
    var countryISOCode = (eventList && eventList.details && eventList.details.countryISOCode) ? eventList.details.countryISOCode : '';
    var teacherTimezone = moment.tz.guess();

    if (countryISOCode) {
        $("#teacherCountryFlag").attr("src", PATH_FOLDER_FONT2 + countryISOCode + ".svg").show();
    }
    $(".teacher_timezone").html('<label>' + teacherTimezone + '&nbsp;</label>');

    if (events.length > 0) {
        events.forEach(function (obj) {
            obj.start = convertDatetimeWithFormat(obj.start, obj.timezone, teacherTimezone, DATE_UTC + 'T' + TIME_UTC);
            obj.end = convertDatetimeWithFormat(obj.end, obj.timezone, teacherTimezone, DATE_UTC + 'T' + TIME_UTC);
            finalEvents.push(obj);
        });
    }

    return {
        events: finalEvents,
        startDate: startFormatted,
        endDate: endFormatted
    };
}

function renderTeacherScheduleTable(events, startDate, endDate) {
    var start = moment(startDate);
    var end = moment(endDate);

    events.sort(function (a, b) { return new Date(a.start) - new Date(b.start); });

    var grouped = {};
    events.forEach(function (event) {
        var dateKey = moment(event.start).format("YYYY-MM-DD");
        if (!grouped[dateKey]) grouped[dateKey] = [];
        grouped[dateKey].push(event);
    });

    var html = "";
    var serial = 1;

    while (start.isSameOrBefore(end)) {
        var dateKey = start.format("YYYY-MM-DD");

        html += '<tr><td colspan="7" class="text-center font-weight-bold bg-light py-1 font-14">' + formatDateHeading(dateKey) + '</td></tr>';

        if (grouped[dateKey] && grouped[dateKey].length > 0) {
            grouped[dateKey].forEach(function (event) {
                if (event.category === "CLASS") {
                    TEACHER_CLASS_COUNT++;
                } else if (event.category === "ACTIVITY") {
                    TEACHER_ACTIVITY_COUNT++;
                }

                var typeBadge = event.category === "CLASS"
                    ? '<span class="badge badge-pill bg-light-primary text-primary ml-auto font-12 font-weight-semi-bold w-fit-content text-transform-none">Class</span>'
                    : '<span class="badge badge-pill bg-light-secondary text-secondary ml-auto font-12 font-weight-semi-bold w-fit-content text-transform-none">Activity</span>';

                var eventStatus = getEventStatus(event);
                var isActionable = (eventStatus === "Completed" || eventStatus === "Live");
                var viewSummaryBtn = isActionable
                    ? '<a href="javascript:void(0);" onclick="showTeacherClassSummary(\'' + event.meetingId + '\',\'' + event.id + '\')" class="border border-primary text-primary bg-light-primary rounded-10 btn btn-sm font-11"><i class="fa fa-eye" aria-hidden="true"></i> View</a>'
                    : 'N/A';
                var feedbackBtn = isActionable
                    ? (event.hasFeedback
                        ? '<a href="javascript:void(0);" onclick="openTeacherClassFeedback(\'' + event.id + '\')" class="border border-success text-success bg-light-success rounded-10 btn btn-sm font-11 teacher-view-feedback-btn" data-event-id="' + event.id + '" data-meeting-id="' + (event.meetingId || '') + '"><i class="fa fa-eye" aria-hidden="true"></i> View Feedback</a>'
                        : '<a href="javascript:void(0);" onclick="openTeacherClassFeedback(\'' + event.id + '\')" class="border border-warning text-warning bg-light-warning rounded-10 btn btn-sm font-11 teacher-submit-feedback-btn" data-event-id="' + event.id + '" data-meeting-id="' + (event.meetingId || '') + '"><i class="fa fa-pencil" aria-hidden="true"></i> Submit Feedback</a>')
                    : 'N/A';

                html += '<tr class="' + event.category + '-teacher-row even-teacher-row" data-event-id="' + event.id + '">' +
                    '<td class="py-2">' + serial++ + '</td>' +
                    '<td class="py-2">' + (event.courseName || 'N/A') + '</td>' +
                    '<td class="py-2">' + formatTimeRange(event.start, event.end) + '</td>' +
                    '<td class="py-2">' + typeBadge + '</td>' +
                    '<td class="py-2 teacher-status-cell">' + getStatusBadge(eventStatus) + '</td>' +
                    '<td class="py-2">' + viewSummaryBtn + '</td>' +
                    '<td class="py-2">' + feedbackBtn + '</td>' +
                    '</tr>';
            });
        } else {
            html += '<tr><td colspan="7" class="text-center text-muted">No Class / Activity</td></tr>';
        }

        start.add(1, 'day');
    }

    $(".teacher_over_All_Class_Activity_Count").text(TEACHER_CLASS_COUNT + TEACHER_ACTIVITY_COUNT);
    $(".teacher_class_Count").text(TEACHER_CLASS_COUNT);
    $(".teacher_activity_Count").text(TEACHER_ACTIVITY_COUNT);

    $("#teacherScheduleTable tbody").html(html);
}

function updateTeacherEventStatuses() {
    $("#teacherScheduleTable tbody tr[data-event-id]").each(function () {
        var eventId = $(this).data("event-id");
        var event = TEACHER_GLOBAL_EVENTS.find(function (e) { return e.id == eventId; });
        if (event) {
            $(this).find(".teacher-status-cell").html(getStatusBadge(getEventStatus(event)));
        }
    });
}

// Submit Feedback button -> reuse the shared class-feedback flow (feedbackStudentTeacher.js).
// openClassFeedback() refreshes FEEDBACK_WEBHOOK, hits get-feedback-submission and shows
// the embed iframe with the respondent + webhook params attached.
function openTeacherClassFeedback(eventId) {
    var event = TEACHER_GLOBAL_EVENTS.find(function (e) { return (e.id + "") === (eventId + ""); });
    if (!event) return;

    openClassFeedback({
        eventId: event.entityId,
        eventType: event.type,
        eventTitle: event.courseName,
        teacherName: event.teacherName,
        start: { _i: event.start }
    });
}

function teacherCalendarRequestByFilter(src) {
    $(".teacher_calendar_request_button").removeClass("active_calendar_catergory");
    $(src).addClass("active_calendar_catergory");
    var filterType = $(src).attr("data-category");
    if (filterType === "CLASS") {
        $(".even-teacher-row").hide();
        $(".CLASS-teacher-row").show();
    } else if (filterType === "ACTIVITY") {
        $(".even-teacher-row").hide();
        $(".ACTIVITY-teacher-row").show();
    } else {
        $(".even-teacher-row").show();
    }
}

async function showTeacherClassSummary(meetingId, eventId) {
    if ($("#teacherClassSummaryModal").length < 1) {
        $("body").append(getTeacherClassSummaryModal());
    }
    $("#teacherClassSummaryModalBody").html(
        '<div class="py-5 text-center"><i class="fa fa-circle-o-notch fa-spin text-primary font-24 mb-2"></i><p class="mb-0 text-muted">Loading class summary...</p></div>'
    );
    $("#teacherClassSummaryModal").modal("show");

    var eventObj = TEACHER_GLOBAL_EVENTS.find(function (e) { return (e.id + "") === (eventId + ""); });
    if (!eventObj && meetingId) {
        eventObj = TEACHER_GLOBAL_EVENTS.find(function (e) { return (e.meetingId + "") === (meetingId + ""); });
    }

    var payload = { meetingId: meetingId + "" };
    var ajaxReqDetails = {
        method: "POST",
        url: APP_BASE_URL + SCHOOL_UUID + "/dashboard/parent/student-class-summary",
        body: payload,
        global: true,
        showMessage: false,
        onFaildResolved: true,
        onSuccessResolved: true
    };

    try {
        var response = await callCommonAjax(ajaxReqDetails);
        var details = (response && response.details) ? response.details : {};
        if (!details || $.isEmptyObject(details)) {
            $("#teacherClassSummaryModalBody").html(
                '<div class="py-5 text-center"><i class="fa fa-info-circle text-muted font-24 mb-2"></i><p class="mb-0 text-muted">No class summary found.</p></div>'
            );
            return;
        }
        $("#teacherClassSummaryModalBody").html(buildTeacherSummaryBodyHTML(details, eventObj));
    } catch (err) {
        $("#teacherClassSummaryModalBody").html(
            '<div class="py-5 text-center"><i class="fa fa-info-circle text-muted font-24 mb-2"></i><p class="mb-0 text-muted">Unable to load class summary.</p></div>'
        );
    }
}

function getTeacherClassSummaryModal() {
    return `
    <div id="teacherClassSummaryModal" class="modal fade pr-0 right-slide-modal" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static">
        <div class="modal-dialog modal-xl m-0 ml-auto h-100" role="document">
            <div class="modal-content border-0 h-100 rounded-0">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                <div class="modal-header border-0 px-4 py-3" style="background:linear-gradient(90deg,#007FFF 0%,#02b9cc 100%);">
                    <div class="d-flex align-items-center">
                        <div class="mr-1 d-flex align-items-center justify-content-center text-white" style="width:40px;height:28px;">
                            <img src="${PATH_FOLDER_IMAGE2}class-schedule-calender-icon.png" alt="icon" style="height:100%;width:auto;"/>
                        </div>
                        <div>
                            <h4 class="text-white font-weight-bold mb-0">Class Summary</h4>
                            <p class="text-white-50 mb-0 font-13">Detailed session report</p>
                        </div>
                    </div>
                </div>
                <div class="modal-body px-4 py-3 overflow-auto" id="teacherClassSummaryModalBody"></div>
            </div>
        </div>
    </div>`;
}

function buildTeacherSummaryBodyHTML(details, eventObj) {
    var courseName = (eventObj && eventObj.courseName) ? eventObj.courseName : (details.subjectName || details.courseName || 'N/A');
    var startMoment = (eventObj && eventObj.start) ? moment(eventObj.start) : null;
    var endMoment = (eventObj && eventObj.end) ? moment(eventObj.end) : null;
    var classDate = (startMoment && startMoment.isValid()) ? startMoment.format("MMMM D, YYYY") : 'N/A';
    var classTime = ((startMoment && startMoment.isValid()) ? startMoment.format("hh:mm A") : 'N/A') +
                    ' - ' + ((endMoment && endMoment.isValid()) ? endMoment.format("hh:mm A") : 'N/A');
    var duration = (startMoment && endMoment && startMoment.isValid() && endMoment.isValid())
        ? endMoment.diff(startMoment, 'minutes') + ' minutes' : 'N/A';

    var summaryHTML = '';
    if ($.isArray(details.summaryDetails) && details.summaryDetails.length > 0) {
        $.each(details.summaryDetails, function (_, item) {
            if (item) {
                summaryHTML += '<div class="mb-3"><h6 class="font-16 font-weight-bold">' + (item.label || item.title || 'Overview') + '</h6>' +
                    '<div class="font-14">' + ((item.summary || item.description || item.content || '').replace(/\n/g, '<br/>')) + '</div></div>';
            }
        });
    } else if (typeof details.classSummary === 'string' && details.classSummary.trim() !== '') {
        summaryHTML = '<div class="font-14">' + details.classSummary.replace(/\n/g, '<br/>') + '</div>';
    } else if (typeof details.overview === 'string' && details.overview.trim() !== '') {
        summaryHTML = '<div class="font-14">' + details.overview.replace(/\n/g, '<br/>') + '</div>';
    }

    if (!summaryHTML) {
        summaryHTML = '<div class="text-muted">No summary available.</div>';
    }

    return `
    <div class="container-fluid px-0">
        <div class="row mb-3">
            <div class="col-md-4 mb-2">
                <div class="border rounded-10 p-2">
                    <div class="text-muted font-12 mb-1"><i class="fa fa-book mr-1"></i> Course</div>
                    <div class="font-weight-bold text-dark">${courseName}</div>
                </div>
            </div>
            <div class="col-md-4 mb-2">
                <div class="border rounded-10 p-2">
                    <div class="text-muted font-12 mb-1"><i class="fa fa-calendar mr-1"></i> Date</div>
                    <div class="font-weight-bold text-dark">${classDate}</div>
                </div>
            </div>
            <div class="col-md-4 mb-2">
                <div class="border rounded-10 p-2">
                    <div class="text-muted font-12 mb-1"><i class="fa fa-clock-o mr-1"></i> Time | Duration</div>
                    <div class="font-weight-bold text-dark">${classTime} | ${duration}</div>
                </div>
            </div>
        </div>
        <hr class="my-3"/>
        <div class="mb-2">
            <h4 class="font-20 font-weight-bold text-dark"><i class="fa fa-calendar-o mr-2"></i>Class Summary</h4>
        </div>
        ${summaryHTML}
    </div>`;
}
