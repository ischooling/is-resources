var CLASS_SUMMARY_GLOBAL_EVENTS = [];
var CLASS_SUMMARY_ACTIVE_STUDENT_ID = "";
var CLASS_SUMMARY_CALENDERVIEW = "agendaDay";
var CLASS_SUMMARY_CLASS_COUNT = 0;
var CLASS_SUMMARY_ACTIVITY_COUNT = 0;

function classSummaryTodayDate() {
    var d = new Date($("#currentTimeForUser").text());
    var day = d.getDate();
    var month = d.getMonth() + 1;
    var year = d.getFullYear();
    if (day < 10) day = "0" + day;
    if (month < 10) month = "0" + month;
    return year + "-" + month + "-" + day;
}

function parentStudentClassSummaryContentLoadEvent() {
    $("#classSummaryStartDate").datepicker({
        autoclose: true,
        format: 'M d, yyyy',
        container: 'body',
        endDate: '0d'
    });
    $("#classSummaryEndDate").datepicker({
        autoclose: true,
        format: 'M d, yyyy',
        container: 'body',
        endDate: '0d'
    });
    if (typeof getSlidesToShow === "function" && $('.user-slider').length) {
        $('.user-slider').slick({
            slidesToShow: getSlidesToShow(),
            slidesToScroll: 1,
            infinite: false,
            arrows: true,
            responsive: [
                { breakpoint: 992, settings: { slidesToShow: 3 } },
                { breakpoint: 768, settings: { slidesToShow: 2 } },
                { breakpoint: 576, settings: { slidesToShow: 1 } }
            ]
        });
    }
}

function getRequestForClassSummaryCalendar(userId, startdate, enddate) {
    var dto = {};
    dto['studentUserId'] = userId;
    dto['startDate'] = changeDateFormat(new Date(moment(moment(startdate)).add(-1, 'days')), 'yyyy-mm-dd');
    dto['endDate'] = changeDateFormat(new Date(moment(moment(enddate)).add(1, 'days')), 'yyyy-mm-dd');
    return dto;
}

async function renderClassSummaryListing(studentId) {
    CLASS_SUMMARY_ACTIVE_STUDENT_ID = studentId;
    CLASS_SUMMARY_CLASS_COUNT = 0;
    CLASS_SUMMARY_ACTIVITY_COUNT = 0;
    $(".student-thumb").removeClass("active-student");
    $(".student-" + studentId).addClass("active-student");
    $(".class-summary-view-button").attr("data-student-id", studentId);
    var response = await callClassSummaryCalendar(studentId);
    CLASS_SUMMARY_GLOBAL_EVENTS = response.events;
    renderClassSummaryTable(response.events, response.startDate, response.endDate);
}

async function viewClassSummaryCalender(src, calendarView) {
    if (calendarView != "custom") {
        CLASS_SUMMARY_CALENDERVIEW = calendarView;
        $(".class-summary-view-button").removeClass("active");
        $(src).addClass("active");
    }
    var studentId = $(".class-summary-view-button").attr("data-student-id");
    renderClassSummaryListing(studentId);
}

function showClassSummaryCustomFilterForm(src) {
    CLASS_SUMMARY_CALENDERVIEW = "custom";
    $(".class-summary-view-button").removeClass("active");
    $(src).addClass("active");
    $(".class-summary-custom-filter-form").show();
}

async function callClassSummaryCalendar(studentId) {
    var today = classSummaryTodayDate();
    var startFormatted, endFormatted;

    if (CLASS_SUMMARY_CALENDERVIEW == "agendaDay") {
        var yesterday = moment(today).subtract(1, 'days').format('YYYY-MM-DD');
        startFormatted = yesterday;
        endFormatted = yesterday;
    } else if (CLASS_SUMMARY_CALENDERVIEW == "agendaWeek") {
        endFormatted = moment(today).subtract(1, 'days').format('YYYY-MM-DD');
        startFormatted = moment(endFormatted).subtract(6, 'days').format('YYYY-MM-DD');
    } else if (CLASS_SUMMARY_CALENDERVIEW == "custom") {
        var startDate = new Date($("#classSummaryStartDate").val());
        startFormatted = moment(startDate).format('YYYY-MM-DD');
        var endDate = new Date($("#classSummaryEndDate").val());
        endFormatted = moment(endDate).format('YYYY-MM-DD');
        if (endFormatted > today) endFormatted = today;
    }

    if (CLASS_SUMMARY_CALENDERVIEW != "custom") {
        $(".class-summary-custom-filter-form").hide();
    }

    var payload = getRequestForClassSummaryCalendar(studentId, startFormatted, endFormatted);
    var ajaxReqDetails = {
        method: "POST",
        url: APP_BASE_URL + SCHOOL_UUID + "/dashboard/parent/student-class-schedule-summary",
        body: payload,
        global: true,
        showMessage: false,
        onFaildResolved: true,
        onSuccessResolved: true
    };

    var eventList = typeof isDummyStudentMode === "function" && isDummyStudentMode() && typeof getDummyStudentScheduleResponse === "function"
        ? getDummyStudentScheduleResponse(studentId)
        : await callCommonAjax(ajaxReqDetails);
    var _studentList = (typeof STUDENT_LIST !== "undefined") ? STUDENT_LIST : null;
    var _activeStudent = _studentList?.studentBasicDetails?.find(s => s.userId == CLASS_SUMMARY_ACTIVE_STUDENT_ID);
    var timeZoneFlag = _activeStudent?.countryISOCode || '';
    $("#classSummaryCountryFlag").attr("src", PATH_FOLDER_FONT2 + timeZoneFlag + ".svg").show();
    $(".class_summary_user_timezone").html(`<label>${_activeStudent?.studentTimezone || moment.tz.guess()}&nbsp;</label>`);

    var finalEvents = [];
    var events = eventList.details.schedule || [];
    var nowMoment = moment();

    if (events.length > 0) {
        events.forEach(function(obj) {
            if (obj.id.startsWith("announce", 0) || obj.id.startsWith("holiday", 0)) {
                finalEvents.push(obj);
            } else {
                var activeStudentTimezone = _activeStudent?.studentTimezone || moment.tz.guess();
                obj.start = convertDatetimeWithFormat(obj.start, obj.timezone, activeStudentTimezone, DATE_UTC + 'T' + TIME_UTC);
                obj.end = convertDatetimeWithFormat(obj.end, obj.timezone, activeStudentTimezone, DATE_UTC + 'T' + TIME_UTC);
                // Only include past classes where student attended
                var attendance = (obj.classesAttendance || "").toString().trim().toLowerCase();
                if (moment(obj.end).isBefore(nowMoment) && (attendance === "attended" || attendance === "attending")) {
                    finalEvents.push(obj);
                }
            }
        });
    }

    return {
        events: finalEvents,
        startDate: startFormatted,
        endDate: endFormatted
    };
}

function classSummaryFormatDateHeading(dateStr) {
    return moment(dateStr).format("dddd, MMM DD, YYYY");
}

function classSummaryFormatTimeRange(start, end) {
    var s = moment(start).format("hh:mm A");
    var e = moment(end).format("hh:mm A");
    var duration = moment(end).diff(moment(start), 'minutes');
    return s + " to " + e + " | " + duration + " min";
}

function classSummaryGetEventStatus(event) {
    var attendance = (event.classesAttendance || "").toString().trim().toLowerCase();
    if (attendance === "attended" || attendance === "attending") {
        return "Completed";
    }
    var rawStatus = (event.classStatus || "").toString().trim();
    return rawStatus !== "" ? rawStatus : "Not Started";
}

function classSummaryGetStatusBadge(status) {
    if (status === "Completed") {
        return `<div class="badge-pill bg-light text-gray font-12 font-weight-semi-bold w-fit-content">
            <span class="badge badge-dot badge-dot-lg badge-gray mr-1">Badge</span>
            Completed
        </div>`;
    }
    if (status === "Not Started") {
        return `<div class="badge-pill bg-light-danger text-danger font-12 font-weight-semi-bold w-fit-content">
            <span class="badge badge-dot badge-dot-lg badge-danger mr-1">Badge</span>
            Not Started
        </div>`;
    }
    if (status !== "") {
        return `<div class="badge-pill bg-light text-gray font-12 font-weight-semi-bold w-fit-content">
            <span class="badge badge-dot badge-dot-lg badge-gray mr-1">Badge</span>
            ${status}
        </div>`;
    }
    return `<div class="badge-pill bg-light text-gray font-12 font-weight-semi-bold w-fit-content">
        <span class="badge badge-dot badge-dot-lg badge-gray mr-1">Badge</span>
        Completed
    </div>`;
}

function classSummaryCalendarRequestByFilter(src) {
    $(".class_summary_request_button").removeClass("active_calendar_catergory");
    $(src).addClass("active_calendar_catergory");
    var filterType = $(src).attr("data-category");
    if (filterType == "CLASS") {
        $(".class-summary-even-row").hide();
        $(".CLASS-summary-row").show();
    } else if (filterType == "ACTIVITY") {
        $(".class-summary-even-row").hide();
        $(".ACTIVITY-summary-row").show();
    } else if (filterType == "ALL") {
        $(".class-summary-even-row").show();
    }
}

function classSummaryBuildEventInstanceKey(eventObj) {
    if (!eventObj) return "";
    return [
        eventObj.id || "",
        eventObj.meetingId || "",
        eventObj.start || "",
        eventObj.end || ""
    ].join("|");
}

async function showClassSummaryMeetingSummary(meetingId, eventId, eventInstanceKey) {
    classSummaryEnsureSummaryModal();
    $("#classSummaryDetailModalBody").html(classSummaryGetLoadingHtml());
    $("#classSummaryDetailModal").modal("show");

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
        var response = typeof isDummyStudentMode === "function" && isDummyStudentMode() && typeof getDummyStudentClassSummaryResponse === "function"
            ? getDummyStudentClassSummaryResponse(meetingId)
            : await callCommonAjax(ajaxReqDetails);
        var details = response && response.details ? response.details : {};
        details = classSummaryNormalizeResponse(details);
        var eventMeta = classSummaryGetEventMeta(meetingId, eventId, eventInstanceKey);
        if (!details || $.isEmptyObject(details)) {
            $("#classSummaryDetailModalBody").html(classSummaryGetNoDataHtml("No class summary found."));
            return;
        }
        $("#classSummaryDetailModalBody").html(classSummaryDetailBodyHTML(details, eventMeta));
    } catch (err) {
        $("#classSummaryDetailModalBody").html(classSummaryGetNoDataHtml("Unable to load class summary."));
        showMessageTheme2(0, "Unable to load class summary.");
    }
}

function classSummaryEnsureSummaryModal() {
    if ($("#classSummaryDetailModal").length < 1) {
        $("body").append(classSummaryGetRightSlideModal());
    }
}

function classSummaryGetRightSlideModal() {
    return `
    <div id="classSummaryDetailModal" class="modal fade pr-0 right-slide-modal" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static">
        <div class="modal-dialog modal-xl m-0 ml-auto h-100" role="document">
            <div class="modal-content border-0 h-100 rounded-0">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                <div class="modal-header border-0 px-4 py-3" style="background:linear-gradient(90deg,#007FFF 0%,#02b9cc 100%);">
                    <div class="d-flex align-items-center">
                        <div class="mr-1 d-flex align-items-center justify-content-center text-white" style="width:40px;height:28px;">
                            <img src="${PATH_FOLDER_IMAGE2}class-schedule-calender-icon.png" alt="icon" style="height:100%;width:auto;" />
                        </div>
                        <div>
                            <h4 class="text-white font-weight-bold mb-0">Student Class Summary</h4>
                            <p class="text-white-50 mb-0 font-13">Detailed attendance and session report</p>
                        </div>
                    </div>
                </div>
                <div class="modal-body px-4 py-3 overflow-auto" id="classSummaryDetailModalBody"></div>
            </div>
        </div>
    </div>`;
}

function classSummaryGetLoadingHtml() {
    return `
    <div class="py-5 text-center">
        <i class="fa fa-circle-o-notch fa-spin text-primary font-24 mb-2" aria-hidden="true"></i>
        <p class="mb-0 text-muted">Loading class summary...</p>
    </div>`;
}

function classSummaryGetNoDataHtml(message) {
    return `
    <div class="py-5 text-center">
        <i class="fa fa-info-circle text-muted font-24 mb-2" aria-hidden="true"></i>
        <p class="mb-0 text-muted">${message || "No class summary found."}</p>
    </div>`;
}

function classSummaryNormalizeResponse(details) {
    var normalized = details || {};
    if ($.isPlainObject(details.summary)) {
        normalized.studentName = normalized.studentName || details.summary.studentName;
        normalized.studentId = normalized.studentId || details.summary.studentId;
        normalized.profilePic = normalized.profilePic || details.summary.profilePic;
        normalized.subjectName = normalized.subjectName || details.summary.subjectName;
        normalized.teacherName = normalized.teacherName || details.summary.teacherName;
        normalized.classDate = normalized.classDate || details.summary.classDate;
        normalized.classTime = normalized.classTime || details.summary.classTime;
        normalized.classDuration = normalized.classDuration || details.summary.classDuration;
        normalized.attendanceStatus = normalized.attendanceStatus || details.summary.attendanceStatus;
    }
    return normalized;
}

function classSummarySafe(value, fallback) {
    if (value === null || value === undefined || value === "") return fallback || "N/A";
    return value;
}

function classSummaryAttendanceClass(status) {
    var normalized = (status || "").toString().toLowerCase();
    if (normalized.indexOf("present") > -1 || normalized.indexOf("attend") > -1) {
        return "bg-light-success text-success border border-success";
    }
    if (normalized.indexOf("absent") > -1 || normalized.indexOf("miss") > -1) {
        return "bg-light-danger text-danger border border-danger";
    }
    return "bg-light-warning text-dark border border-warning";
}

function classSummaryEscapeHtml(str) {
    return $("<div>").text(str || "").html();
}

function classSummaryParagraphs(text) {
    return classSummaryEscapeHtml(text || "").replace(/\n/g, "<br/>");
}

function classSummaryGetSummarySections(details) {
    var sections = [];
    if ($.isArray(details.summaryDetails)) {
        $.each(details.summaryDetails, function(_, item) {
            if (item) {
                sections.push({
                    title: item.label || item.title || item.heading || "Overview",
                    content: item.summary || item.description || item.content || ""
                });
            }
        });
    }
    if ($.isPlainObject(details.summary) && details.summary.summaryOverview) {
        sections.unshift({ title: "Overview", content: details.summary.summaryOverview });
    }
    if ($.isArray(details.classSummarySections)) {
        $.each(details.classSummarySections, function(_, item) {
            if (item) {
                sections.push({
                    title: item.title || item.heading || "Overview",
                    content: item.description || item.summary || item.content || ""
                });
            }
        });
    }
    if ($.isPlainObject(details.classSummarySections)) {
        $.each(details.classSummarySections, function(key, value) {
            if (value) sections.push({ title: key, content: value });
        });
    }
    if ($.isPlainObject(details.classSummary)) {
        $.each(details.classSummary, function(key, value) {
            if (value) sections.push({ title: key, content: value });
        });
    } else if (typeof details.classSummary === "string" && details.classSummary.trim() !== "") {
        sections.push({ title: "Overview", content: details.classSummary });
    }
    if (typeof details.overview === "string" && details.overview.trim() !== "") {
        sections.push({ title: "Overview", content: details.overview });
    }
    if (typeof details.meetingSummary === "string" && details.meetingSummary.trim() !== "") {
        sections.push({ title: "Meeting Summary", content: details.meetingSummary });
    }
    return sections;
}

function classSummaryGetEventMeta(meetingId, eventId, eventInstanceKey) {
    var meta = {};
    if (!$.isArray(CLASS_SUMMARY_GLOBAL_EVENTS)) return meta;
    var eventObj = null;
    if (eventInstanceKey) {
        eventObj = CLASS_SUMMARY_GLOBAL_EVENTS.find(function(e) {
            return classSummaryBuildEventInstanceKey(e) === eventInstanceKey;
        });
    }
    if (eventId) {
        eventObj = eventObj || CLASS_SUMMARY_GLOBAL_EVENTS.find(function(e) {
            return (e.id + "") === (eventId + "");
        });
    }
    if (!eventObj && meetingId) {
        eventObj = CLASS_SUMMARY_GLOBAL_EVENTS.find(function(e) {
            return (e.meetingId + "") === (meetingId + "");
        });
    }
    if (!eventObj) return meta;
    var startMoment = eventObj.start ? moment(eventObj.start) : null;
    var endMoment = eventObj.end ? moment(eventObj.end) : null;
    var durationText = "N/A";
    if (startMoment && endMoment && startMoment.isValid() && endMoment.isValid()) {
        durationText = endMoment.diff(startMoment, "minutes") + " minutes";
    }
    meta.subjectName = eventObj.courseName || "N/A";
    meta.teacherName = eventObj.teacherName || "N/A";
    meta.teacherGender = eventObj.teacherGender || "";
    meta.classDate = startMoment && startMoment.isValid() ? startMoment.format("MMMM D, YYYY") : "N/A";
    meta.classTime = (startMoment && startMoment.isValid() ? startMoment.format("hh:mm A") : "N/A") + " - " + (endMoment && endMoment.isValid() ? endMoment.format("hh:mm A") : "N/A");
    meta.classDuration = durationText;
    meta.totalClassDuration = eventObj.classesAttendanceDuration || durationText;
    meta.classStartTime = startMoment && startMoment.isValid() ? startMoment.format("hh:mm A") : "N/A";
    meta.classEndTime = endMoment && endMoment.isValid() ? endMoment.format("hh:mm A") : "N/A";
    meta.studentJoined = eventObj.studentJoinedTime || eventObj.classesAttendanceStartTime || "N/A";
    meta.studentLeft = eventObj.studentLeftTime || eventObj.classesAttendanceEndTime || "N/A";
    return meta;
}

function classSummaryDetailBodyHTML(details, eventMeta) {
    var _sl = (typeof STUDENT_LIST !== "undefined") ? STUDENT_LIST : null;
    var activeStudent = (_sl && _sl.studentBasicDetails ? _sl.studentBasicDetails : []).find(function(s) {
        return (s.userId + "") === (CLASS_SUMMARY_ACTIVE_STUDENT_ID + "");
    }) || {};

    var studentName = classSummarySafe(details.studentName || details.userName || details.childName || activeStudent.studentName, "N/A");
    var studentImage = classSummarySafe(details.profilePic || details.studentProfilePic || activeStudent.profilePic, PATH_FOLDER_FONT2 + "dummy-user.png");
    var attendanceStatus = classSummarySafe(details.attendanceStatus || details.classAttendanceStatus || "Present", "Present");
    var subject = classSummarySafe(eventMeta.subjectName || details.subjectName || details.courseName || "", "N/A");
    var teacher = classSummarySafe(eventMeta.teacherName || details.teacherName || details.hostName, "N/A");
    var classDate = classSummarySafe(eventMeta.classDate || details.classDate || details.date, "N/A");
    var classTime = classSummarySafe(eventMeta.classTime || details.classTime || details.time || details.classTiming, "N/A");
    var classDuration = classSummarySafe(eventMeta.classDuration || details.classDuration || details.duration, "N/A");

    var summarySections = classSummaryGetSummarySections(details);
    var summaryHTML = summarySections.length ? summarySections.map(function(section) {
        return `<div class="mb-3">
            <h6 class="font-16 font-weight-bold">${classSummaryEscapeHtml(section.title)}</h6>
            <div class="font-14">${classSummaryParagraphs(section.content)}</div>
        </div>`;
    }).join("") : `<div class="">No summary available.</div>`;

    return `
    <div class="container-fluid px-0">
        <div class="d-flex align-items-center justify-content-between flex-wrap mb-3">
            <div class="d-flex align-items-center mb-2 mb-md-0">
                <img src="${studentImage}" class="mr-3 rounded-circle border" alt="Student" style="width:56px;height:56px;object-fit:cover;">
                <div class="text-truncate">
                    <h4 class="mb-1 font-25 font-weight-bold text-dark text-truncate">${classSummaryEscapeHtml(studentName)}</h4>
                </div>
            </div>
            <span class="badge badge-pill ${classSummaryAttendanceClass(attendanceStatus)} px-3 py-2 font-12">${classSummaryEscapeHtml(attendanceStatus)}</span>
        </div>
        <div class="row">
            <div class="col-lg-12">
                <div class="row">
                    <div class="col-md-6 col-lg-2 mb-2">
                        <div class="border rounded-10 p-2">
                            <div class="text-muted font-12 mb-2"><i class="fa fa-book mr-1"></i> Course</div>
                            <div class="font-weight-bold text-dark">${classSummaryEscapeHtml(subject)}</div>
                        </div>
                    </div>
                    <div class="col-md-6 col-lg-2 mb-2">
                        <div class="border rounded-10 p-2">
                            <div class="text-muted font-12 mb-2"><i class="fa fa-user mr-1"></i> Teacher</div>
                            <div class="font-weight-bold text-dark">${getSalutationByGender(eventMeta.teacherGender)} ${classSummaryEscapeHtml(teacher)}</div>
                        </div>
                    </div>
                    <div class="col-md-6 col-lg-2 mb-2">
                        <div class="border rounded-10 p-2">
                            <div class="text-muted font-12 mb-2"><i class="fa fa-calendar mr-1"></i> Date</div>
                            <div class="font-weight-bold text-dark">${classSummaryEscapeHtml(classDate)}</div>
                        </div>
                    </div>
                    <div class="col-md-6 col-lg-2 mb-2">
                        <div class="border rounded-10 p-2">
                            <div class="text-muted font-12 mb-2"><i class="fa fa-clock-o mr-1"></i> Time</div>
                            <div class="font-weight-bold text-dark">${classSummaryEscapeHtml(classTime)}</div>
                        </div>
                    </div>
                    <div class="col-md-6 col-lg-2 mb-2">
                        <div class="border rounded-10 p-2">
                            <div class="text-muted font-12 mb-2"><i class="fa fa-hourglass-half mr-1"></i> Duration</div>
                            <div class="font-weight-bold text-dark">${classSummaryEscapeHtml(classDuration)}</div>
                        </div>
                    </div>
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
