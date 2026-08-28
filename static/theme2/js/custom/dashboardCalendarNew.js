var IS_CLICKED_FEEDBACK_BTN = false;
var IS_CLASS_ENDED_STATUS_CALLED = false;
var IS_PENDING_FEEDBACK_POPUP_REQUEST = false;
var IS_PENDING_FEEDBACK_POPUP_REQUESTED = false;
var SHOULD_SHOW_BULK_FEEDBACK_POPUP_TODAY = undefined;
var userIdsForFeedback = getSettingsByTypeAndKey("CONFIGURATION", "USER_FOR_FEEDBACK_TEST", false)
var USER_ID_FOR_FEEDBACK = getSettingMetaValue(userIdsForFeedback).split(",").includes(USER_ID);
// Shared with feedbackStudentTeacher.js, which reads/writes this map by event id
// (openClassFeedbackById + showPendingFeedbackPopup). The legacy dashboardCalendar.js
// used to own it, but it is no longer loaded on the dashboard, so define it here.
var FEEDBACK_EVENT_MAP = (typeof FEEDBACK_EVENT_MAP !== "undefined" && FEEDBACK_EVENT_MAP) ? FEEDBACK_EVENT_MAP : {};
(function(window, $) {
    "use strict";
    var STUDENT_CALENDAR_SELECTOR = "#schoolcalendar";
    var STORAGE_KEY = "studentDashboardCalendarNew";
    var ACTIVE_REFRESH_MS = 1000;
    // ── Feedback flow integration (functions live in feedbackStudentTeacher.js) ──
    var feedbackTestUserCache = null;   // cached "is this user a feedback test user" lookup
    var liveObservedEvents = {};        // event.id -> true once the event was seen LIVE this session
    var feedbackLiveScheduled = {};     // event.id -> true once live-end feedback has been scheduled
    var feedbackBulkChecked = false;    // bulk pending-feedback popup already attempted this page load
    var studentCalendarState = {
        loaded: false,
        calendarReady: false,
        masterEvents: [],
        filteredEvents: [],
        courses: {},
        filters: {
            courseVisibility: {},
            classes: true,
            activities: true,
            schoolEvents: true,
            holidays: true,
            pendingAssignments: true,
            submittedAssignments: true,
            upcomingAssignments: true,
            liveActivities: true,
            upcomingActivities: true,
            pastActivities: true,
            missedClasses: true,
            lateJoinClasses: true
        },
        viewName: "today",
        selectedDate: null,
        datepickerReady: false,
        suppressDatepickerEvent: false,
        activeRefreshTimer: null,
        clockTimer: null,
        lastRequest: null
    };

    var defaultCoursePalette = [
        "#f06292",
        "#2196f3",
        "#f44336",
        "#c9a800",
        "#673ab7",
        "#795548",
        "#1a237e",
        "#800000",
        "#cc0099",
        "#006d77"
    ];

    function getStudentTimezone() {
        if (typeof USER_TIMEZONE !== "undefined" && USER_TIMEZONE) {
            return USER_TIMEZONE;
        }
        if (window.Intl && Intl.DateTimeFormat) {
            return Intl.DateTimeFormat().resolvedOptions().timeZone;
        }
        return moment.tz.guess();
    }

    function isTodayView(viewName) {
        return viewName === "today" || viewName === "agendaDay" || viewName === "listDay" || viewName === "weekDayList" || !viewName;
    }

    function getBackendAgenda(viewName) {
        return isTodayView(viewName) ? "agendaDay" : viewName;
    }

    function escapeHtml(value) {
        return $("<div>").text(value == null ? "" : value).html();
    }

    function safeId(value) {
        return String(value || "default").replace(/[^a-zA-Z0-9_-]/g, "_");
    }

    function loadStoredState() {
        try {
            var stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : {};
        } catch (error) {
            return {};
        }
    }

    function saveStoredState() {
        var payload = {
            courses: studentCalendarState.courses,
            filters: studentCalendarState.filters
        };
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        } catch (error) {
            console.warn("Unable to persist student calendar preferences", error);
        }
    }

    function hexToRgb(hex) {
        var value = String(hex || "#888888").replace("#", "");
        if (value.length === 3) {
            value = value.split("").map(function(part) { return part + part; }).join("");
        }
        return {
            r: parseInt(value.slice(0, 2), 16),
            g: parseInt(value.slice(2, 4), 16),
            b: parseInt(value.slice(4, 6), 16)
        };
    }

    function colorWithAlpha(hex, alpha) {
        var rgb = hexToRgb(hex);
        return "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + "," + alpha + ")";
    }

    function getCourseColor(courseId) {
        var course = studentCalendarState.courses[courseId] || {};
        return course.color || "#1a73e8";
    }

    function normalizeEventType(event) {
        var id = String(event.id || "");
        var category = String(event.category || event.eventType || "").toUpperCase();
        if (id.indexOf("holiday") === 0 || category.indexOf("HOLIDAY") >= 0) {
            return "holiday";
        }
        if (id.indexOf("announce") === 0 || category.indexOf("ANNOUNCE") >= 0 || category.indexOf("EVENT") >= 0) {
            return "schoolEvent";
        }
        if (id.indexOf("activity") === 0 || category.indexOf("ACTIVITY") >= 0) {
            return "activity";
        }
        if (category.indexOf("ASSIGNMENT") >= 0) {
            return "assignment";
        }
        return "class";
    }

    function getCourseId(event) {
        return safeId(event.courseId || event.subjectId || event.standardId || event.category || event.eventType || "classes");
    }

    function getCourseLabel(event) {
        return event.courseName || event.subjectName || event.eventTitle || event.category || event.eventType || "Classes";
    }

    function normalizeDateTime(value, fromTimezone) {
        var studentTimezone = getStudentTimezone();
        if (!value) {
            return null;
        }
        if (moment.isMoment(value)) {
            return value.clone().tz(studentTimezone);
        }
        var sourceValue = String(value);
        if (sourceValue.indexOf("Z") > -1 || /[+-]\d\d:?\d\d$/.test(sourceValue)) {
            return moment.utc(sourceValue).tz(studentTimezone);
        }
        if (fromTimezone) {
            return moment.tz(sourceValue.replace("T", " "), DATETIME_UTC_FORMATTER, fromTimezone).tz(studentTimezone);
        }
        return moment.utc(sourceValue.replace("T", " "), DATETIME_UTC_FORMATTER).tz(studentTimezone);
    }

    function normalizeCalendarEvent(rawEvent, courseDetails) {
        // 
        var eventType = normalizeEventType(rawEvent);
        // assignments carry dueDate/paceDate instead of start — use it so they appear on the calendar
        var startMoment = normalizeDateTime(rawEvent.start || rawEvent.startDateTime || rawEvent.date || rawEvent.dueDate || rawEvent.paceDate, rawEvent.timezone);
        var endMoment = normalizeDateTime(rawEvent.end || rawEvent.endDateTime, rawEvent.timezone);
        var allDay = rawEvent.allDay === true || eventType === "holiday";
        var courseId = getCourseId(rawEvent)
        // CLASS events (esp. BATCH/group classes) may not carry a subjectId — getCourseId then
        // falls back to the "CLASS" category, which matches no My Courses entry, so the class
        // renders in the default color and the course filter can't hide it. Map by subject name
        // (eventTitle -> courseDetails.subjectName/courseName) to recover the real course id.
        if (eventType === "class" && !rawEvent.subjectId && rawEvent.eventTitle && courseDetails) {
            $.each(courseDetails, function(i, v){
                if (getCourseLabel(v) === rawEvent.eventTitle) {
                    courseId = getCourseId(v);
                    return false; // break out of $.each
                }
            });
        }
        // CLASS events: title is suppressed (rendered via eventRender).
        // ASSIGNMENT events: eventTitle is null — fall back to the raw title field.
        var title = rawEvent.eventTitle;
        if (!title && eventType !== "class") {
            title = rawEvent.title || "";
        }else if(rawEvent.category == "CLASS" && (rawEvent.eventType == "CUSTOM" || rawEvent.eventType == "PTM" || rawEvent.eventType == "BATCH")){
            title = rawEvent.title
        }else if(title && rawEvent.category == "BATCH"){
            title = rawEvent.title || "";
        }else{
            title=="";
        }

        if (!endMoment && startMoment) {
            endMoment = allDay ? startMoment.clone().endOf("day") : startMoment.clone().add(30, "minutes");
        }
        $.each(courseDetails, function(i, v){
            var coursesId = getCourseId(v);
            // colorCode comes from the backend course list (fallback: color). registerCourse
            // uses it as the course color so every class of that course renders the same color.
            registerCourse(coursesId, getCourseLabel(v), 'class', v.colorCode || v.color);
        })
        // if (eventType === "class" || eventType === "activity" || eventType === "assignment") {
        //      
        //     registerCourse(courseId, getCourseLabel(rawEvent), eventType);
        // }
        var normalized = $.extend({}, rawEvent, {
            id: rawEvent.id || rawEvent.eventId || ("event-" + Math.random().toString(36).slice(2)),
            title: ((rawEvent.category == "CLASS" && (rawEvent.eventType == "PTM" || rawEvent.eventType == "CUSTOM" || rawEvent.eventType == "BATCH")) ? title : rawEvent.category != "CLASS"?title:""),
            start: startMoment ? startMoment.format() : rawEvent.start,
            end: endMoment ? endMoment.format() : rawEvent.end,
            name: "",
            // Original teacher/student name (name is blanked above) — kept for the feedback flow.
            origName: rawEvent.name || rawEvent.teacherName || "",
            allDay: allDay,
            eventKind: eventType,
            courseId: courseId,
            className: buildEventClassNames(rawEvent, eventType, courseId),
            localStartMoment: startMoment,
            localEndMoment: endMoment,
            localDateKey: startMoment ? startMoment.format("YYYY-MM-DD") : "",
            eventDate: startMoment ? startMoment.format("MMM D, YYYY") : "",
            displayTime: startMoment && endMoment ? startMoment.format("hh:mm A") + " - " + endMoment.format("hh:mm A") : "",
            backgroundColor: "#fff",
            borderColor: getEventTextColor(eventType, courseId),
            textColor: getEventTextColor(eventType, courseId)
        });

        // miscProps is a self-reference so FullCalendar eventLimitClick can read normalised fields
        normalized.miscProps = normalized;
        return normalized;
    }

    function buildEventClassNames(rawEvent, eventType, courseId) {
        var dashedClass = eventType == "class" ? " is-timed-event" : " border";
        var getColorCode = getEventTextColor(eventType, courseId);
        var classes = [
            "dashboard-calendar-event",
            "calendar-event-" + eventType,
            "calendar-course-" + safeId(courseId),
            dashedClass
        ];
        if(eventType == "class"){
            classes.push("border","btn-dashed")   
        }
        if (rawEvent.category) {
            classes.push(String(rawEvent.category).replace(/\s+/g, "-"));
        }
        return classes.join(" ");
    }

    function registerCourse(courseId, label, eventType, colorCode) {
        var stored = loadStoredState();
        var storedCourse = stored.courses && stored.courses[courseId] ? stored.courses[courseId] : {};
        if (!studentCalendarState.courses[courseId]) {
            var colorIndex = Object.keys(studentCalendarState.courses).length % defaultCoursePalette.length;
            var defaultColor = courseId === "ACTIVITY" ? "#0d2a64" : defaultCoursePalette[colorIndex];
            studentCalendarState.courses[courseId] = {
                id: courseId,
                label: label || "Classes",
                // Prefer the student's own saved color, then the course's colorCode from the
                // backend course list, then a palette fallback. Never hardcode per course name.
                color: storedCourse.color || colorCode || defaultColor,
                // track which event kind registered this course so filters can bucket correctly
                eventType: eventType || "class"
            };
        }
        if (studentCalendarState.filters.courseVisibility[courseId] == null) {
            var storedVisibility = stored.filters && stored.filters.courseVisibility;
            studentCalendarState.filters.courseVisibility[courseId] = storedVisibility && storedVisibility[courseId] != null ? storedVisibility[courseId] : true;
        }
    }

    function getEventBorder(eventType, courseId) {
        if (eventType === "holiday") {
            return "#1b5e20";
        }
        if (eventType === "activity") {
            return "#0d2a64";
        }
        if (eventType === "assignment") {
            return "#f4b400";
        }
        return getCourseColor(courseId);
    }

    function getEventBackground(eventType, courseId) {
        if (eventType === "holiday") {
            return "#e6f4ea";
        }
        if (eventType === "activity") {
            return "#fff4e6";
        }
        if (eventType === "assignment") {
            return "#fff8d8";
        }
        return colorWithAlpha(getCourseColor(courseId), 0.12);
    }

    function getEventTextColor(eventType, courseId) {
        if (eventType === "holiday") {
            return "#1b5e20";
        }
        if (eventType === "activity") {
            return "#0d2a64";
        }
        return getCourseColor(courseId);
    }

    // Display color for a rendered event. Completed (past) timed events are shown in a
    // muted grey to match the today-view treatment; everything else keeps its own color.
    function getEventDisplayColor(event) {
        // if (getStatusLabel(getEventStatus(event)) === "PAST") {
        //     return "#767b81";
        // }
        return getEventTextColor(event.eventKind, event.courseId);
    }

    function restoreFilters() {
        var stored = loadStoredState();
        if (stored.filters) {
            studentCalendarState.filters = $.extend(true, {}, studentCalendarState.filters, stored.filters);
        }
    }

    // ── Assignment Status Classification ──────────────────────────────────────────
    // Returns { status: "submitted"|"pending"|"upcoming", label, timingLabel, dateDisplay }
    // status      — used by the filter engine
    // label       — primary badge text ("Submitted", "Pending", "Upcoming")
    // timingLabel — secondary text for submitted ("Early (X Days)", "On Time", "Late (X Days)") or null
    // dateDisplay — formatted date to show alongside the status (submittedDate for submitted)
    function getAssignmentStatus(event) {
        // if(event.dueDate == "2026-07-08"){
        //      
        // }
        var tz = getStudentTimezone();
        var todayKey = moment().tz(tz).format("YYYY-MM-DD");
        var dueDate  = event.dueDate || event.paceDate || "";
        var isSubmitted = String(event.assignmentType || "").toLowerCase() === "submitted";

        if (isSubmitted) {
            var submittedDate = event.submittedDate || "";
            var result = { status: "submitted", label: "Submitted", timingLabel: "On Time", dateDisplay: "" };

            if (submittedDate) {
                result.dateDisplay = moment(submittedDate, "YYYY-MM-DD").format("MMM D, YYYY");
                if (dueDate) {
                    // positive diff = submitted BEFORE due date (early)
                    var diff = moment(dueDate, "YYYY-MM-DD").diff(moment(submittedDate, "YYYY-MM-DD"), "days");
                    if (diff > 0) {
                        result.timingLabel = "Early (" + diff + (diff === 1 ? " Day" : " Days") + ")";
                    } else if (diff < 0) {
                        var late = Math.abs(diff);
                        result.timingLabel = "Late (" + late + (late === 1 ? " Day" : " Days") + ")";
                    }
                    // diff === 0 → "On Time" (default)
                }
            } else if (dueDate) {
                result.dateDisplay = moment(dueDate, "YYYY-MM-DD").format("MMM D, YYYY");
            }
            return result;
        }

        // Not submitted — classify by due date:
        //   dueDate in the future  → Upcoming
        //   dueDate today/past      → Pending
        if (dueDate && moment(dueDate, "YYYY-MM-DD").isAfter(todayKey, "day")) {
            return {
                status: "upcoming",
                label: "Upcoming",
                timingLabel: null,
                dateDisplay: moment(dueDate, "YYYY-MM-DD").format("MMM D, YYYY")
            };
        }
        return { status: "pending", label: "Pending", timingLabel: null, dateDisplay: "" };
    }

    function applyFilters() {
        studentCalendarState.filteredEvents = studentCalendarState.masterEvents.filter(function(event) {

            // ── Course visibility: applies to CLASS and ASSIGNMENT events by courseId (= safeId(subjectId)) ──
            // When a course checkbox is unchecked, hide every event — regardless of category — whose
            // courseId matches, covering both CLASS sessions and ASSIGNMENT items for that subject.
            if ((event.eventKind === "class" || event.eventKind === "assignment") &&
                studentCalendarState.filters.courseVisibility[event.courseId] === false) {
                return false;
            }

            // ── Category-level switches ──
            if (event.eventKind === "class" && !studentCalendarState.filters.classes) {
                return false;
            }
            // ACTIVITY events — School Activities toggle
            if (event.eventKind === "activity" && !studentCalendarState.filters.activities) {
                return false;
            }
            if (event.eventKind === "schoolEvent" && !studentCalendarState.filters.schoolEvents) {
                return false;
            }
            // HOLIDAY events — Holidays & Breaks toggle
            if (event.eventKind === "holiday" && !studentCalendarState.filters.holidays) {
                return false;
            }

            // ── Assignment filters: Submitted / Pending / Upcoming ──
            // Classification is determined once via getAssignmentStatus() so logic stays in one place.
             
            if (event.eventKind === "assignment") {
                var aStatus = getAssignmentStatus(event);
                if (aStatus.status === "submitted" && !studentCalendarState.filters.submittedAssignments) {
                    return false;
                }
                if (aStatus.status === "upcoming"  && !studentCalendarState.filters.upcomingAssignments) {
                    return false;
                }
                if (aStatus.status === "pending"   && !studentCalendarState.filters.pendingAssignments) {
                    return false;
                }
            }

            // ── Live / Upcoming / Past / Missed / Late Join — CLASS events only ──
            // Completed classes are split by the attendance the backend recorded
            // (refreshed at class-end via getLiveClassAttendanceStatus): a class the
            // student missed, joined late, or attended on time.
            if (event.eventKind === "class") {
                var eventStatus = getEventStatus(event);
                if (eventStatus === "live"      && !studentCalendarState.filters.liveActivities)      { return false; }
                if (eventStatus === "upcoming"  && !studentCalendarState.filters.upcomingActivities)  { return false; }
                if (eventStatus === "completed") {
                    // Expired (pastActivities) governs EVERY completed class — unchecking it hides
                    // past, missed and late-join classes alike.
                    if (!studentCalendarState.filters.pastActivities) { return false; }
                    var completion = getClassCompletionStatus(event);
                    // Missed / Late Join each hide only their own kind.
                    if (completion === "missed"   && !studentCalendarState.filters.missedClasses)   { return false; }
                    if (completion === "lateJoin" && !studentCalendarState.filters.lateJoinClasses) { return false; }
                }
            }

            return true;
        });
    }

    function isEventActive(event) {
        if (!event.localStartMoment || !event.localEndMoment || event.allDay) {
            return false;
        }
        var now = moment().tz(getStudentTimezone());
        return now.isSameOrAfter(event.localStartMoment) && now.isBefore(event.localEndMoment);
    }

    function getEventStatus(event) {
        if (event.allDay || !event.localStartMoment || !event.localEndMoment) {
            var today = moment().tz(getStudentTimezone()).startOf("day");
            var eventDay = event.localStartMoment ? event.localStartMoment.clone().startOf("day") : today;
            if (eventDay.isBefore(today)) {
                return "completed";
            }
            return "upcoming";
        }
        if (isEventActive(event)) {
            return "live";
        }
        if (moment().tz(getStudentTimezone()).isBefore(event.localStartMoment)) {
            return "upcoming";
        }
        return "completed";
    }

    function getStatusLabel(status) {
        if (status === "live") {
            return "LIVE";
        }
        if (status === "completed") {
            return "PAST";
        }
        return "UPCOMING";
    }

    // Coerces a backend boolean-ish value to true / false / undefined. Handles real booleans
    // as well as string ("true"/"false") and numeric (1/0) forms, because depending on the
    // serializer/proxy the calendar JSON can carry attended/onTime either way. Returns
    // undefined for null / missing so a class with no attendance record is NOT treated as missed.
    function toTriBool(value) {
        if (value === true  || value === "true"  || value === 1 || value === "1") { return true; }
        if (value === false || value === "false" || value === 0 || value === "0") { return false; }
        return undefined;
    }

    // Fine-grained status for a COMPLETED class/activity, derived from the attendance the
    // backend recorded (refreshed via getLiveClassAttendanceStatus when a live class ends):
    //   attended === false          -> "missed"
    //   attended === true, late > 0 -> "lateJoin"  (i.e. onTime === false)
    //   otherwise (on time/unknown) -> "past"
    function getClassCompletionStatus(event) {
        var attended = toTriBool(event.attended);
        var lateSeconds = Number(event.lateSeconds) || 0;
        if (attended === false) {
            return "missed";
        }
        if (attended === true && (toTriBool(event.onTime) === false || lateSeconds > 0)) {
            return "lateJoin";
        }
        return "past";
    }

    // Display status = the time-based status (live / upcoming / completed) refined into
    // past / missed / lateJoin for completed classes. Used for badges and status text.
    function getEventDisplayStatus(event) {
        var status = getEventStatus(event);
        if (status === "completed" && event.eventKind === "class") {
            return getClassCompletionStatus(event);
        }
        return status;
    }

    function getDisplayStatusLabel(status) {
        switch (status) {
            case "live":     return "LIVE";
            case "upcoming": return "UPCOMING";
            case "missed":   return "MISSED";
            case "lateJoin": return "LATE JOIN";
            default:         return "ON TIME"; // completed / past
        }
    }

    // Badge/accent color for a display status. Missed = red, Late Join = amber; everything
    // else keeps the course/theme color the calendar already uses.
    function getDisplayStatusColor(status, eventKind, courseId) {
        if (status === "live")     { return "red"; }
        if (status === "missed")   { return "#d93025"; }
        if (status === "lateJoin") { return "#ff6d00"; }
        return getEventTextColor(eventKind, courseId);
    }

    function statusBadgeHtml(label, color, statusKey) {
        return '<span class="dashboard-today-badge status-' + statusKey + '" style="background:' + color + '">' + label + '</span>';
    }

    // Status badge(s) for an event tile. Live/Upcoming get one badge. A PAST class or
    // activity always gets an "Expired" badge, plus a second attendance badge when the
    // recorded attendance says the student missed it or joined late:
    //   attended === false            -> Expired + Missed
    //   attended, not onTime, late>0  -> Expired + Late Joined
    //   otherwise                     -> Expired only
    // (Activities carry no attendance, so they resolve to "Expired only".)
    function buildStatusBadges(event) {
        var status = getEventStatus(event);
        var colorCode = getEventTextColor(event.eventKind, event.courseId)
        if (status === "live") {
            return statusBadgeHtml("LIVE", colorCode, "live");
        }
        if (status === "upcoming") {
            return statusBadgeHtml("UPCOMING", colorCode, "upcoming");
        }
        var badges = statusBadgeHtml("EXPIRED", colorCode, "expired");
        return badges;
    }

    function joinStatus(event) {
        var completion = getClassCompletionStatus(event);
        var badges="";
        if (completion === "missed") {
            badges += getDisplayStatusLabel(getEventDisplayStatus(event));
        } else if (completion === "lateJoin") {
            badges += getDisplayStatusLabel(getEventDisplayStatus(event));
        }
        return badges;
    }

    function isTimedEvent(event) {
        return event.eventKind === "class" || event.eventKind === "activity" || event.eventKind === "schoolEvent";
    }

    function getTodayEventSortValue(event) {
        if (isEventActive(event)) {
            return -1;
        }
        if (event.localStartMoment) {
            return event.localStartMoment.valueOf();
        }
        return Number.MAX_SAFE_INTEGER;
    }

    function getEventSubtitle(event) {
        var parts =[]
        
        var course = studentCalendarState.courses[event.courseId];
                // Lead with course/subject label
        
        if (course && course.label) {
            parts.push(course.label);
        } else if (event.eventKind === "holiday") {
            parts.push("Holiday / Break");
        } else if (event.eventKind === "schoolEvent") {
            parts.push("School Event");
        } else if (event.eventKind === "activity") {
            parts.push("Activity");
        } else if (event.subjectName) {
            parts.push(event.subjectName);
        }
        if(course == undefined && USER_ROLE == "TEACHER"){
            parts.push(event.eventTitle);
        }

        if (event.eventKind === "assignment") {
            //  
            // Use the classification helper so subtitle exactly matches the filter state
            var aStatus = getAssignmentStatus(event);
            var statusColor = aStatus.status === "submitted" ? "#1b5e20"
                        : aStatus.status === "pending"   ? "#f4b400"
                        : "#1a73e8";
            var html=`<div class="full"> ${course.label}</div>`;
            
            //parts.push(aStatus.label);                         // "Submitted" | "Pending" | "Upcoming"
            if (aStatus.timingLabel) {
                if(aStatus.timingLabel.startsWith('Early')){
                    // html+=`<span class="font-weight-semi-bold text-success">${aStatus.timingLabel}</span> · `;
                }else if(aStatus.timingLabel.startsWith('Late')){
                    // html+=`<span class="font-weight-semi-bold text-danger">${aStatus.timingLabel}</span> `;   
                }
                
                //parts.push(aStatus.timingLabel);               // "Early (X Days)" | "On Time" | "Late (X Days)"
            }
            if (aStatus.dateDisplay) {
               // html+=`${aStatus.dateDisplay}`;
                // parts.push(aStatus.dateDisplay);               // e.g. "Jun 1, 2026"
            }
            return html;
            // return parts.join(" · ");
        }

        // CLASS / ACTIVITY / HOLIDAY etc.
        if (event.displayTime && isTimedEvent(event)) {
            parts.push(event.displayTime);
        }
        if (event.name) {
            parts.push(event.name);
        }
        return parts.join(" · ");
    }

    function groupEventsByLocalDate(events) {
        var groupsByDate = {};
        events.forEach(function(event) {
            if (!event.localStartMoment) {
                return;
            }
            var dateKey = event.localStartMoment.format("YYYY-MM-DD");
            if (!groupsByDate[dateKey]) {
                groupsByDate[dateKey] = {
                    date: event.localStartMoment.clone().startOf("day"),
                    events: []
                };
            }
            groupsByDate[dateKey].events.push(event);
        });
        return Object.keys(groupsByDate).sort().map(function(dateKey) {
            var group = groupsByDate[dateKey];
            group.events.sort(function(left, right) {
                // Teachers see the list in strict chronological order (by start time),
                // e.g. 11:00 AM, then 01:00 PM, then 04:30 PM — live events are NOT
                // pulled to the top.
                if (typeof USER_ROLE !== "undefined" && USER_ROLE === "TEACHER") {
                    return left.localStartMoment.valueOf() - right.localStartMoment.valueOf();
                }
                var leftStatus = getEventStatus(left);
                var rightStatus = getEventStatus(right);
                if (leftStatus === "live" && rightStatus !== "live") {
                    return -1;
                }
                if (rightStatus === "live" && leftStatus !== "live") {
                    return 1;
                }
                return getTodayEventSortValue(left) - getTodayEventSortValue(right);
            });
            return group;
        });
    }

    function getTodayGroups() {
        var today = moment().tz(getStudentTimezone()).format("YYYY-MM-DD");
        var groups = {
            live: [],
            upcoming: [],
            completed: []
        };
        studentCalendarState.filteredEvents.forEach(function(event) {
            if (event.localDateKey !== today || event.allDay) {
                return;
            }
            // Today Summary shows only Class & School Activity — exclude assignments (and other non-timed kinds)
            if (!isTimedEvent(event)) {
                return;
            }
            if (isEventActive(event)) {
                groups.live.push(event);
            } else if (event.localStartMoment && moment().tz(getStudentTimezone()).isBefore(event.localStartMoment)) {
                groups.upcoming.push(event);
            } else {
                groups.completed.push(event);
            }
        });
        Object.keys(groups).forEach(function(key) {
            groups[key].sort(function(left, right) {
                return left.localStartMoment.valueOf() - right.localStartMoment.valueOf();
            });
        });
        return groups;
    }

    function buildStudentCalendarShell(data) {
        var timezone = data && data.userTimezone ? data.userTimezone : getStudentTimezone();
        var countryISOCode = data && data.countryISOCode ? data.countryISOCode : "";
        return `
            <div class="main-card mb-3 pr-4">
                <div class="full">
                    <div class="card rounded-15 dashboard-calendar-new-card">
                        <div class="card-body p-0">
                            <div class="dashboard-calendar-new">
                                <span id="currentTimeForUser" class="d-none"></span>
                                <div class="dashboard-calendar-topbar">
                                    <div class="clock-pill flex-column" id="dashboardCalendarClockTod">
                                        <div class="d-inline-flex align-items-center gap-5">
                                            ${countryISOCode ? `<img src="${PATH_FOLDER_FONT2}${countryISOCode}.svg" class="rounded" width="24" alt="Flag">` : ""}
                                            <span class="tz">${escapeHtml(timezone)}</span>
                                            <span class="clock-tod-icon" id="dashboardCalendarClockIcon" aria-hidden="true"></span>
                                        </div>
                                        <div>
                                            <img src="${PATH_FOLDER_IMAGE2}Icon/sidebar/earth.webp" width="15px" class="position-relative" style="bottom:1px"/>
                                            <span class="ct font-weight-semi-bold text-dark" id="dashboardCalendarLiveClock">--:--:-- --</span>
                                            <span class="clock-tod" role="img">
                                                <span class="clock-tod-label" id="dashboardCalendarClockLabel"></span>
                                            </span>
                                        </div>
                                    </div>
                                    <div class="nav-pill">
                                        <button type="button" id="dashboardCalendarPrev" aria-label="Previous">&lsaquo;</button>
                                        <span class="nav-view-label" id="dashboardCalendarViewLabel">Day</span>
                                        <button type="button" id="dashboardCalendarNext" aria-label="Next">&rsaquo;</button>
                                    </div>
                                    ${/*<button type="button" class="today-btn" id="dashboardCalendarToday">Today</button>*/''}
                                    <span class="topbar-month" id="dashboardCalendarTitle"></span>
                                    <div class="spacer"></div>
                                    <div class="view-pill">
                                        <button type="button" class="vp-btn active" data-view="today">Today</button>
                                        <button type="button" class="vp-btn" data-view="agendaWeek">Week</button>
                                        <button type="button" class="vp-btn" data-view="month">Month</button>
                                    </div>
                                </div>
                                <div class="legend-strip">
                                    <div class="mx-auto d-inline-flex align-items-center gap-10 flex-wrap">
                                        <span>Legend:</span>
                                        ${USER_ROLE != "TEACHER" ? `<div class="leg-item"><div class="leg-box"></div>Assignment</div>`:``}
                                        <div class="leg-item"><div class="leg-box btn-dashed"></div>Live Class</div>
                                        <div class="leg-item" style="color:#0d2a64;"><div class="leg-box school-event"></div>School Activity</div>
                                        <div class="leg-item" style="color:#1b5e20;"><div class="leg-box holiday"></div>Holiday</div>
                                    </div>
                                </div>
                                <div class="dashboard-calendar-layout">
                                    <aside class="dashboard-calendar-sidebar">
                                        <div class="dashboard-datepicker" id="dashboardCalendarDatepicker"></div>
                                        <div class="sb-divider"></div>
                                        <div class="sb-section">
                                            <h5>Today</h5>
                                            <div id="dashboardCalendarTodaySummary"></div>
                                        </div>
                                        ${(typeof USER_ROLE !== "undefined" && USER_ROLE === "TEACHER") ? "" : `
                                            <div class="sb-divider"></div>
                                            <div class="sb-section">
                                                <h5>My Courses</h5>
                                                <div id="dashboardCalendarCourseFilters"></div>
                                            </div>
                                            <div class="sb-divider"></div>
                                            <div class="sb-section">
                                                <h5>Assignments</h5>
                                                <div id="dashboardCalendarAssignmentFilters"></div>
                                            </div>`
                                        }
                                        <div class="sb-divider"></div>
                                        <div class="sb-section">
                                            <h5>Class Status</h5>
                                            <div id="dashboardCalendarLiveActivityFilters"></div>
                                        </div>
                                        <div class="sb-divider"></div>
                                        <div class="sb-section">
                                            <h5>Events</h5>
                                            <div id="dashboardCalendarSchoolEventFilters"></div>
                                        </div>
                                        <div class="sb-divider"></div>
                                        <div class="sb-section">
                                            <h5>Holidays</h5>
                                            <div id="dashboardCalendarHolidayFilters"></div>
                                            <div id="dashboardCalendarCategoryFilters" class="d-none"></div>
                                        </div>
                                    </aside>
                                    <main class="dashboard-calendar-main">
                                        <div id="schoolcalendar"></div>
                                    </main>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            ${holidayOne()}
            ${getAnnouncementAndNewsContent()}
            ${onBordingMandotryVideo()}`;
    }

    function injectStyles() {
        if ($("#dashboardCalendarNewStyle").length) {
            return;
        }
        $("head").append(`
            <style id="dashboardCalendarNewStyle">
                
                .dashboard-calendar-new { height: calc(100vh - 150px); min-height: 620px; display: flex; flex-direction: column; overflow: hidden; background: #fff; border-radius: 10px; }
                .dashboard-calendar-topbar { height: 56px; display: flex; align-items: center; padding: 0 16px 0 0; gap: 10px; background: #fff; border-bottom: 1px solid #e8eaed; flex-shrink: 0; }
                .clock-pill { display: flex; align-items: center; gap: 0px; background: #f1f3f4; border-radius: 4px; padding: 5px 12px; font-size: 12px; }
                .clock-pill .tz { color: #555; }
                /* Time-of-day badge beside the live clock: icon + Morning/Evening/Night label,
                   tinted per period. Sizing tracks the clock text; the badge's own flex layout
                   handles vertical alignment + spacing between icon and label. */
                .clock-pill .clock-tod { display: inline-flex; align-items: center; gap: 5px; border-radius: 24px; padding: 3px 10px; line-height: 1; font-size: 12px; font-weight: 600; }
                .clock-pill .clock-tod:empty { display: none; }
                .clock-pill .clock-tod-icon { display: inline-flex; align-items: center; font-size: 15px; line-height: 1; }
                .clock-pill .clock-tod-label { white-space: nowrap; }
                .tod-morning { background: #fff8e5; color: #ecaf02; }
                .tod-evening { background: #ffe8dc; color: #e94e00; }
                .tod-night   { background: #e3e8fb; color: #1b3ba8; }
                .clock-pill .clock-tod.tod-pop { animation: clockTodPop 0.3s ease; }
                @keyframes clockTodPop { 0% { transform: scale(0.5); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
                .nav-pill { display: flex; align-items: center; gap: 2px; background: #f1f3f4; border-radius: 24px; padding: 3px 5px; }
                .nav-pill button { border: 0; background: transparent; cursor: pointer; border-radius: 50%; width: 28px; height: 28px; font-size: 18px; color: #5f6368; display: flex; align-items: center; justify-content: center; box-shadow: none; }
                .nav-pill button:hover { background: #e0e0e0; }
                .nav-view-label { min-width: 46px; text-align: center; font-size: 12px; font-weight: 600; color: var(--pc); white-space: nowrap; padding: 0 4px; }
                .today-btn { border: 0; border-radius: 24px; background: #e8f0fe; padding: 6px 16px; font-size: 12px; cursor: pointer; color: var(--pc); font-weight: 500; box-shadow: none; }
                .topbar-month { font-family: "Google Sans", Arial, sans-serif; font-size: 15px; font-weight: 400; color: #202124; white-space: nowrap; }
                .spacer { flex: 1; }
                .view-pill { display: flex; background: #f1f3f4; border-radius: 24px; padding: 3px; gap: 2px; }
                .vp-btn { border: 0; background: transparent; border-radius: 20px; padding: 5px 14px; font-size: 12px; font-weight: 500; cursor: pointer; color: #5f6368; box-shadow: none; }
                .vp-btn.active { background: #fff; color: var(--pc); box-shadow: 0 1px 4px rgba(60,64,67,0.2); }
                .legend-strip { display: flex; align-items: center; justify-content: flex-end; gap: 14px; padding: 5px 16px; background: #fff; border-bottom: 1px solid #e8eaed; flex-shrink: 0; }
                .legend-strip span { font-size: 10px; font-weight: 700; color: #9aa0a6; text-transform: uppercase; letter-spacing: 0.8px; }
                .leg-item { display: flex; align-items: center; gap: 4px; font-size: 11px; color: #5f6368; }
                .leg-box { width: 15px; height: 15px; border-radius: 3px; flex-shrink: 0; border: 2px solid #888; }
                .leg-box.school-event { background: #e7ebf4; border-color: #0d2a64; }
                .leg-box.holiday { background: #e6f4ea; border-color: #1b5e20; }
                .leg-box.active-event { background: #fff; border: 2px dashed #e53935; }
                .dashboard-calendar-layout { display: flex; flex: 1; overflow: hidden; min-height: 0; }
                .dashboard-calendar-sidebar { width: 300px; padding: 12px; display: flex; flex-direction: column; overflow-y: auto; flex-shrink: 0; background: #fff; border-right: 1px solid #e8eaed; }
                .dashboard-calendar-main { flex: 1; overflow-y: auto;  overflow-x: hidden; background: #f8faff; min-width: 0; padding: 0; }
                .dashboard-calendar-main #schoolcalendar { background: #fff; border: 0; border-radius: 0; padding: 0; height: 100%; }
                .dashboard-calendar-main #schoolcalendar .fc-view-container .fc-month-view{ background: #fff;}
                .dashboard-datepicker .datepicker { width: 100%; border: 0; }
                .dashboard-datepicker .datepicker table { width: 100%; }
                .dashboard-calendar-date-has-event { position: relative; font-weight: 700; color: var(--pc); }
                .dashboard-calendar-date-has-event:after { content: ""; position: absolute; left: 50%; bottom: 3px; width: 4px; height: 4px; transform: translateX(-50%); border-radius: 50%; background: var(--pc); }
                .sb-divider { height: 1px; background: #f1f3f4; margin: 12px 0; }
                .sb-section h5 { font-size: 9px; font-weight: 700; color: #9aa0a6; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
                .course-row { display: flex; align-items: center; gap: 8px; padding: 5px 6px; cursor: pointer; border-radius: 10px; transition: background 0.12s; position: relative; }
                .course-row:hover { background: #f1f3f4; }
                .c-check { width: 16px; height: 16px; border-radius: 4px; border: 2px solid; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
                .c-check.on:after { content: ""; width: 8px; height: 8px; background: #fff; clip-path: polygon(14% 44%,0 65%,50% 100%,100% 16%,80% 0%,43% 62%); display: block; }
                .c-swatch { width: 14px; height: 14px; border-radius: 50%; flex-shrink: 0; cursor: pointer; border: 2px solid rgba(0,0,0,0.1); }
                .c-label { font-size: 12px; color: #3c4043; flex: 1; }
                .cpop { position: absolute; left: 0; top: 32px; background: #fff; border-radius: 12px; box-shadow: 0 4px 20px rgba(60,64,67,0.2); padding: 10px; z-index: 100; display: none; width: 170px; }
                .cpop.open { display: block; }
                .color-grid { display: grid; grid-template-columns: repeat(5,1fr); gap: 5px; }
                .color-swatch { width: 24px; height: 24px; border-radius: 50%; cursor: pointer; border: 2px solid transparent; transition: transform 0.1s; }
                .color-swatch.selected { border-color: #202124; }
                .today-summary-group { margin-bottom: 10px; }
                .today-summary-title { font-size: 11px; font-weight: 700; color: #5f6368; margin-bottom: 5px; }
                .today-summary-item {text-align:center; font-size: 11px; color: #3c4043; padding: 5px 7px; border: 1px solid #e8eaed; border-radius: 8px; margin-bottom: 4px; background: #fff; cursor: pointer; }
                .dashboard-today-view { height: 100%; overflow-y: auto; padding: 18px 22px; background: #f8faff; }
                .dashboard-week-day-view { height: 100%; overflow-y: auto; padding: 18px 22px; background: #f8faff; }
                .dashboard-week-back { border: 0; background: #e8f0fe; color: var(--pc); font-size: 13px; font-weight: 500; cursor: pointer; padding: 8px 20px; border-radius: 24px; display: inline-flex; align-items: center; gap: 6px; margin-bottom: 18px; box-shadow: none; }
                .dashboard-week-back:hover { background: #d2e3fc; }
                .dashboard-today-group { display: flex; width: 100%; margin-bottom: 18px; }
                .dashboard-today-date { width: 72px; flex-shrink: 0; padding-top: 10px; text-align: center; color: #3c4043; }
                .dashboard-today-date.is-today .dashboard-today-dow { color: var(--pc); }
                .dashboard-today-date.is-today .dashboard-today-day { background: var(--pc); color: #fff; border-radius: 50%; font-size: 18px; font-weight: 500; width: 38px; height: 38px; display: inline-flex; align-items: center; justify-content: center; }
                .dashboard-today-dow { display: block; font-size: 10px; color: #9aa0a6; font-weight: 700; letter-spacing: 0.5px; }
                .dashboard-today-day { display: block; font-size: 24px; font-weight: 300; line-height: 1.1; }
                .dashboard-today-items { flex: 1; display: flex; flex-direction: column; gap: 9px; min-width: 0; }
                .dashboard-today-event { position: relative; display: flex; align-items: flex-start; gap: 12px; min-height: 50px;  background: #fff; box-shadow: 0 1px 4px rgba(60,64,67,0.07); cursor: pointer; }
                .dashboard-today-event:hover { box-shadow: 0 4px 12px rgba(60,64,67,0.13);transform: translateY(-1px);}
                .dashboard-today-event.is-timed-event { border-style: dashed; border-width: 2px; }
                .dashboard-today-event.is-timed-event.CLASS_PAST{cursor:pointer}
                .dashboard-today-dot { width: 11px; height: 11px; border-radius: 50%; margin-top: 4px; flex-shrink: 0;}
                .dashboard-today-content { min-width: 0; }
                .dashboard-today-title { font-size: 14px; line-height: 1.25; }
                .dashboard-today-subtitle { font-size: 12px; margin-top: 4px; line-height: 1.35; }
                .dashboard-today-badge { display: inline-block; vertical-align: 1px; line-height: 12px;font-size: 9px;padding: 2px 8px;border-radius: 4px;margin-right: 6px;text-transform: uppercase;color:#fff}
               
                .dashboard-today-badge.status-upcoming { background: #6f6f00; }
                .dashboard-today-badge.status-completed { background: #5f6368; }
                .dashboard-today-empty { padding: 42px; text-align: center; color: #9aa0a6; font-size: 14px; }
                .fc-event.dashboard-calendar-active.is-timed-event, .today-summary-item.dashboard-calendar-active.is-timed-event, .dashboard-today-event.dashboard-calendar-active.is-timed-event { animation: dashboardCalendarPulse 1.4s ease-in-out infinite; border-style: dashed !important; border-width: 2px !important; }
                /* Any LIVE event (class OR activity) blinks — dashboard-calendar-active is only ever set on a live timed event. Activities keep their own border style; only the pulse is shared. */
                .fc-event.dashboard-calendar-active, .today-summary-item.dashboard-calendar-active, .dashboard-today-event.dashboard-calendar-active { animation: dashboardCalendarPulse 1.4s ease-in-out infinite; }
                .fc-agendaWeek-view .fc-day-header, .fc-agendaWeek-view .fc-day-top { cursor: pointer; }
                .fc-agendaWeek-view .fc-day-header:hover, .fc-agendaWeek-view .fc-day-top:hover { background: #f1f6ff; }
                .fc-agendaWeek-view table, .fc-agendaWeek-view td, .fc-agendaWeek-view th { border-color: #e8eaed; }
                .fc-agendaWeek-view .fc-head-container { border-left: 0; border-right: 0; }
                .fc-agendaWeek-view .fc-head .fc-axis { width: 64px !important; background: #fff; border-right: 2px solid #e8eaed; }
                .fc-agendaWeek-view .fc-day-header { height: 88px; padding: 12px 4px 10px; background: #fff; border-bottom: 1px solid #e8eaed; vertical-align: top; }
                .dashboard-week-head { display: flex; flex-direction: column; align-items: center; gap: 4px; line-height: 1; }
                .dashboard-week-head-dow { font-size: 12px; color: #70757a; font-weight: 700; text-transform: uppercase; }
                .dashboard-week-head-day { font-size: 26px; color: #202124; font-weight: 300; }
                .dashboard-week-head.is-today .dashboard-week-head-dow { color: var(--pc); }
                .dashboard-week-head.is-today .dashboard-week-head-day { width: 38px; height: 38px; border-radius: 50%; background: var(--pc); color: #fff; display: inline-flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 500; }
                .fc-agendaWeek-view .fc-time-grid { background: #f8faff; }
                .fc-agendaWeek-view .fc-time-grid .fc-slats td { height: 38px; border-color: #f1f3f4; }
                .fc-agendaWeek-view .fc-time-grid .fc-slats tr:nth-child(odd) td { border-top-style: solid; }
                .fc-agendaWeek-view .fc-time-grid .fc-slats tr:nth-child(even) td { border-top-style: dashed; }
                .fc-agendaWeek-view .fc-time-grid .fc-axis { width: 64px !important; padding: 0 10px 0 0; color: #4b5563; font-size: 12px; font-weight: 500; background: #fff; border-right: 2px solid #e8eaed; vertical-align: top; }
                .fc-agendaWeek-view .fc-time-grid .fc-day { background: #f8faff; }
                .fc-agendaWeek-view .fc-content-col { border-color: #e4e7ec; }
                .fc-agendaWeek-view .fc-event { min-height: 29px; border-radius: 7px; border-width: 2px; padding: 4px 8px; box-shadow: none; font-size: 12px; font-weight: 600; overflow: hidden; }
                .fc-agendaWeek-view .fc-event.calendar-event-class, .fc-agendaWeek-view .fc-event.calendar-event-activity { border-style: dashed; }
                .fc-agendaWeek-view .fc-event.calendar-event-schoolEvent { border-style: solid; }
                .fc-agendaWeek-view .fc-event .fc-content { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .fc-agendaWeek-view .fc-event .fc-time { display: none; }
                .fc-agendaWeek-view .fc-event .font-weight-bold { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .fc-more{display: block; color: var(--pc) !important;font-size: 12px; font-weight: 700;text-decoration: none; }
                .fc-event .event-start-Time, .fc-event .event-end-Time { font-size: 11px; }
                .fc-scroller.fc-time-grid-container[style]{height:100% !important}
                @keyframes dashboardCalendarPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
                #dashboardCalendarDatepicker > .datepicker table tr td.active, #dashboardCalendarDatepicker > .datepicker table tr td.active:hover {background-image: none !important;background-color: #007bff !important;color: #fff !important;font-weight: 600;}
                #dashboardCalendarDatepicker > .datepicker td, #dashboardCalendarDatepicker > .datepicker th:not(.datepicker-switch) {width: 36px;height: 36px;line-height: 36px;text-align: center;}
                #dashboardCalendarDatepicker > .datepicker th.datepicker-title{border-radius:8px}
                #dashboardCalendarDatepicker > .datepicker table tr td.active, #dashboardCalendarDatepicker > .datepicker table tr td.active:hover, #dashboardCalendarDatepicker > .datepicker table tr td.active:focus {background: var(--pc) !important;color: #fff !important;width: 36px;height: 36px;line-height: 36px;}
                #dashboardCalendarDatepicker > .datepicker table tr td.active::after{background:#fff !important}
                .fc-event-container .fc-title{display:none}
                @media (max-width: 990px) {
                    .view-pill .vp-btn[data-view="month"] { display: none !important; }
                    .dashboard-calendar-new { height: auto; min-height: 520px; }
                    .dashboard-calendar-topbar, .legend-strip { flex-wrap: wrap; height: auto; padding: 10px; justify-content: flex-start; }
                    .dashboard-calendar-layout { flex-direction: column; }
                    .dashboard-calendar-sidebar { width: 100%; max-height: 330px; border-right: 0; border-bottom: 1px solid #e8eaed; }
                    .dashboard-calendar-main { min-height: 520px; }
                    .dashboard-today-view { padding: 14px 10px; }
                    .dashboard-week-day-view { padding: 14px 10px; }
                    .dashboard-today-date { width: 54px; }
                }
            </style>`);
    }

    // Time-of-day glyph for the live clock, keyed on the local hour:
    //   05:00–11:59 -> morning (sun), 12:00–19:59 -> evening (sunset), else night (moon).
    // FontAwesome 4.7 (the project's version) has no sunset / moon-with-stars glyph, so we
    // use the matching emoji — they render crisply everywhere and scale with the clock text.
    function getTimeOfDayIcon(hour) {
        if (hour >= 5 && hour < 12) {
            return { period: "morning", glyph: `${PATH_FOLDER_IMAGE2}morning.webp`, label: "Morning" };
        }
        if (hour >= 12 && hour < 17) {
            return { period: "morning", glyph: `${PATH_FOLDER_IMAGE2}morning.webp`, label: "Afternoon" };
        }
        if (hour >= 17 && hour < 20) {
            return { period: "evening", glyph: `${PATH_FOLDER_IMAGE2}afternoon.webp`, label: "Evening" };
        }
        return { period: "night", glyph: `${PATH_FOLDER_IMAGE2}evening.webp`, label: "Night" };
    }

    // Syncs the clock-pill's time-of-day badge (icon + Morning/Evening/Night label + tint) with
    // the current period. Only touches the DOM when the period actually changes (tracked via
    // data-period on the badge), and replays a small pop animation.
    function updateClockPeriodIcon(now) {
        var badgeEl = document.getElementById("dashboardCalendarClockTod");
        var iconEl = document.getElementById("dashboardCalendarClockIcon");
        var labelEl = document.getElementById("dashboardCalendarClockLabel");
        if (!badgeEl || !iconEl || !labelEl) {
            return;
        }
        var tod = getTimeOfDayIcon(now.hour());
        // Guard on the label (Morning/Afternoon/Evening/Night) — morning & afternoon share the
        // "morning" period, so keying on period alone would skip the Afternoon transition and
        // leave the badge stale until refresh. updateClock() runs this every second, so the badge
        // now auto-updates at every boundary (e.g. 4:59 -> 5:00) with no refresh and no API call.
        if (badgeEl.getAttribute("data-tod") === tod.label) {
            return;
        }
        badgeEl.setAttribute("data-tod", tod.label);
        badgeEl.setAttribute("data-period", tod.period);
        badgeEl.setAttribute("title", tod.label);
        badgeEl.setAttribute("aria-label", tod.label);
        $("#dashboardCalendarClockIcon").html(`<img src="${tod.glyph}" width="35px"/>`);
        labelEl.textContent = tod.label;
        badgeEl.classList.remove("tod-morning", "tod-evening", "tod-night", "tod-pop");
        badgeEl.classList.add("tod-" + tod.period);
        labelEl.classList.remove("tod-morning", "tod-evening", "tod-night", "tod-pop");
        labelEl.classList.add("tod-" + tod.period);
        void badgeEl.offsetWidth; // force reflow so the animation restarts on each change
        badgeEl.classList.add("tod-pop");
    }

    function updateClock() {
        var now = moment().tz(getStudentTimezone());
        $("#dashboardCalendarLiveClock").text(now.format("hh:mm:ss A"));
        $("#currentTimeForUser").text(now.format(DATETIME_FORMATTER));
        updateClockPeriodIcon(now);
    }

    function renderCourseFilters() {
        var html = "";
        // Render ONLY courses registered from CLASS events (keyed by subjectId).
        // ACTIVITY and assignment course entries are excluded here.
        Object.keys(studentCalendarState.courses).forEach(function(courseId, index) {
            var course = studentCalendarState.courses[courseId];
            if (course.eventType !== "class") {
                return; // skip ACTIVITY and assignment entries
            }
            var color   = getCourseColor(courseId);
            var checked = studentCalendarState.filters.courseVisibility[courseId] !== false;
            html += `
                <div class="course-row" data-course-id="${escapeHtml(courseId)}">
                    <span class="c-sequence font-weight-semi-bold text-dark">${index + 1}.</span>
                    <div class="c-check ${checked ? "on" : ""}" data-filter-course="${escapeHtml(courseId)}" style="border-color:${color};background:${checked ? color : "#fff"};"></div>
                    <div class="c-swatch" data-color-course="${escapeHtml(courseId)}" style="background:${color};"></div>
                    <span class="c-label">${escapeHtml(course.label)}</span>
                    <div class="cpop" id="calendarColorPicker-${escapeHtml(courseId)}">
                        <div class="color-grid">
                            ${defaultCoursePalette.map(function(paletteColor) {
                                return `<div class="color-swatch ${paletteColor === color ? "selected" : ""}" data-palette-course="${escapeHtml(courseId)}" data-color="${paletteColor}" style="background:${paletteColor};"></div>`;
                            }).join("")}
                        </div>
                    </div>
                </div>`;
        });
        $("#dashboardCalendarCourseFilters").html(html || '<div class="text-muted font-12">No course filters available</div>');
    }
    function renderSchoolEventFilters() {
        // Events section: fixed single row for School Activities (event.category === "ACTIVITY").
        // Uses data-filter-key="activities" so the existing filter engine handles toggling.
        var checked = studentCalendarState.filters.activities !== false;
        var html = `
            <div class="course-row" data-filter-key="activities">
                <div class="c-check ${checked ? "on" : ""}" id="chk-sev"
                     style="border-color:#0d2a64;background:${checked ? "#0d2a64" : "#fff"};">
                </div>
                <span class="c-label">School Activities</span>
            </div>`;
        $("#dashboardCalendarSchoolEventFilters").html(html);
    }
    

    function renderCategoryFilters() {
        // Assignments: 3 categories — Pending / Submitted / Upcoming
        var assignmentFilters = [
            { key: "pendingAssignments",   label: "Pending",   color: "#f4b400" },
            { key: "submittedAssignments", label: "Submitted", color: "#1b5e20" },
            { key: "upcomingAssignments",  label: "Upcoming",  color: "#1a73e8" }
        ];
        // Live Classes & Activities: CLASS events only (live/upcoming/past)
        var liveActivityFilters = [
            { key: "liveActivities",     label: "Live",            color: "#e53935" },
            { key: "upcomingActivities", label: "Upcoming",        color: "#1a73e8" },
            { key: "pastActivities",     label: "Past",            color: "#5f6368" },
            { key: "missedClasses",      label: "Missed Class",    color: "#d93025" },
            { key: "lateJoinClasses",    label: "Late Join Class", color: "#ff6d00" }
        ];
        // Holidays section: single Holidays & Breaks row
        var holidayFilters = [
            { key: "holidays", label: "Holidays & Breaks", color: "#1b5e20" }
        ];
        var legacyFilters = [
            { key: "classes",      label: "Classes",       color: "#1a73e8" },
            { key: "activities",   label: "Activities",    color: "#6f42c1" },
            { key: "schoolEvents", label: "School Events", color: "#ff6d00" }
        ];
         
        $("#dashboardCalendarAssignmentFilters").html(renderFilterRows(assignmentFilters));
        $("#dashboardCalendarLiveActivityFilters").html(renderFilterRows(liveActivityFilters));
        $("#dashboardCalendarHolidayFilters").html(renderFilterRows(holidayFilters));
        $("#dashboardCalendarCategoryFilters").html(renderFilterRows(legacyFilters));
    }

    function renderFilterRows(filters) {
        return filters.map(function(filter) {
            var checked = studentCalendarState.filters[filter.key] !== false;
            return `
                <div class="course-row" data-filter-key="${filter.key}">
                    <div class="c-check ${checked ? "on" : ""}" style="border-color:${((filter.label == "Live" || filter.label ==  "Upcoming" || filter.label == "Past") && filter.key != "upcomingAssignments" ? "green": filter.color)};background:${checked ? ((filter.label == "Live" || filter.label ==  "Upcoming" || filter.label == "Past") && filter.key != "upcomingAssignments" ? "green": filter.color) : "#fff"};"></div>
                    <span class="c-label">${filter.label == "Past"?"Expired":filter.label}</span>
                </div>`;
        }).join("");
    }

    function renderTodaySummary() {
        var groups = getTodayGroups();
        var labels = {
            live: "Live Class & School Activity",
            upcoming: "Upcoming Class & School Activity",
            completed: "Completed Class & School Activity"
        };
        var html = Object.keys(labels).map(function(key) {
            var events = groups[key];
            return `
                <div class="today-summary-group">
                    <div class="today-summary-title">${labels[key]}</div>
                    ${events.length ? events.slice(0, 5).map(function(event) {
                        return `<div class="today-summary-item ${key === "live" ? "dashboard-calendar-active bhagat 2" : ""}" data-summary-event-id="${event.id}" style="border-color:${getEventBorder(event.eventKind, event.courseId)};">${escapeHtml(event.title)}<div class="text-muted">${event.displayTime}</div></div>`;
                    }).join("") : '<div class="text-muted font-12">No Class & School Activity</div>'}
                </div>`;
        }).join("");
        $("#dashboardCalendarTodaySummary").html(html);
    }

    function renderCustomTodayView() {
        var calendar = $(STUDENT_CALENDAR_SELECTOR);
        if (!calendar.length) {
            return;
        }
        if (calendar.data("fullCalendar")) {
            calendar.fullCalendar("destroy");
            studentCalendarState.calendarReady = false;
        }
        studentCalendarState.viewName = "today";
        $(".vp-btn").removeClass("active");
        $('.vp-btn[data-view="today"]').addClass("active");
        updateActiveViewLabel();
        var selected = studentCalendarState.selectedDate
            ? moment.tz(studentCalendarState.selectedDate, "YYYY-MM-DD", getStudentTimezone())
            : moment().tz(getStudentTimezone());
        $("#dashboardCalendarTitle").text(selected.format("dddd, MMMM D, YYYY"));

        // Only show events for the selected day. The backend fetch for the "today"
        // view returns a ±1 day window (see refreshCalendarFromCurrentView), so
        // without this filter the adjacent days (e.g. Jun 7 & Jun 9 when Jun 8 is
        // selected) would also appear. Restrict to the selected date only.
        var selectedKey = selected.format("YYYY-MM-DD");
        var dayEvents = studentCalendarState.filteredEvents.filter(function(event) {
            return event.localDateKey === selectedKey;
        });

        var groups = groupEventsByLocalDate(dayEvents);
        var html = groups.length ? groups.map(function(group) {
            var isToday = group.date.isSame(moment().tz(getStudentTimezone()), "day");
            return `
                <div class="dashboard-today-group">
                    <div class="dashboard-today-date ${isToday ? "is-today" : ""}">
                        <span class="dashboard-today-dow">${group.date.format("ddd").toUpperCase()}</span>
                        <span class="dashboard-today-day">${group.date.format("D")}</span>
                    </div>
                    <div class="dashboard-today-items">
                        ${group.events.map(renderCustomTodayEvent).join("")}
                    </div>
                </div>`;
        }).join("") : '<div class="dashboard-today-empty">No calendar items found.</div>';

        calendar.html('<div class="dashboard-today-view">' + html + '</div>');
        updateDatepicker();
        renderTodaySummary();
    }

    function renderCustomWeekView() {
        var calendar = $(STUDENT_CALENDAR_SELECTOR);
        if (!calendar.length) return;

        if (calendar.data("fullCalendar")) {
            calendar.fullCalendar("destroy");
            studentCalendarState.calendarReady = false;
        }

        studentCalendarState.viewName = "agendaWeek";
        $(".vp-btn").removeClass("active");
        $('.vp-btn[data-view="agendaWeek"]').addClass("active");
        updateActiveViewLabel();

        var selected = studentCalendarState.selectedDate ? moment.tz(studentCalendarState.selectedDate, "YYYY-MM-DD", getStudentTimezone()) : moment().tz(getStudentTimezone());
        var weekStart = selected.clone().startOf("week");
        var days = [];
        for (var i = 0; i < 7; i++) {
            days.push(weekStart.clone().add(i, "days"));
        }
        var weekEnd = days[6];
        var title = weekStart.month() === weekEnd.month()
            ? weekStart.format("MMMM YYYY")
            : weekStart.format("MMM") + " - " + weekEnd.format("MMM YYYY");
        $("#dashboardCalendarTitle").text(title);

        var todayKey = moment().tz(getStudentTimezone()).format("YYYY-MM-DD");
        var HOUR_H = 60;

        var hdr = '<div style="width:52px;flex-shrink:0;background:#fff;border-right:1px solid #e8eaed;"></div>';
        days.forEach(function(day) {
            var dk = day.format("YYYY-MM-DD");
            var isToday = dk === todayKey;
            var numStyle = isToday
                ? "background:#1a73e8;color:#fff;font-weight:500;border-radius:50%;"
                : "color:#202124;font-weight:300;";
            hdr += '<div style="flex:1;text-align:center;padding:8px 4px;">'
                + '<div style="font-size:11px;color:' + (isToday ? 'var(--pc,#1a73e8)' : '#70757a') + ';text-transform:uppercase;font-weight:' + (isToday ? '700' : '600') + ';letter-spacing:0.5px;">' + day.format("ddd").toUpperCase() + '</div>'
                + '<div data-week-day="' + dk + '" style="font-size:22px;' + numStyle + 'width:40px;height:40px;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;margin:2px auto 0;border-radius:50%;">' + day.format("D") + '</div>'
                + '</div>';
        });

        var allDayRow = '<div style="display:flex;background:#fff;border-bottom:1px solid #e8eaed;flex-shrink:0;padding-right:6.5px">'
            + '<div style="width:52px;flex-shrink:0;background:#fff;border-right:1px solid #e8eaed;font-size:9px;color:#9aa0a6;display:flex;align-items:center;justify-content:center;padding:2px;text-transform:uppercase;letter-spacing:0.5px;">All day</div>';
        days.forEach(function(day) {
            var dk = day.format("YYYY-MM-DD");
            var allDayEvs = studentCalendarState.filteredEvents.filter(function(ev) {
                return ev.allDay && ev.localDateKey === dk;
            });
            var cellHtml = allDayEvs.map(function(ev) {
                var color = getEventBorder(ev.eventKind, ev.courseId);
                var bg = getEventBackground(ev.eventKind, ev.courseId);
                var textColor = getEventTextColor(ev.eventKind, ev.courseId);
                return '<div class="p-1 mx-1" data-today-event-id="' + ev.id + '" style="font-size:10px;font-weight:600;border-radius:4px;margin:1px 2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;background:' + bg + ';border:1px solid ' + color + ';color:' + textColor + ';cursor:pointer;">'
                    + escapeHtml(ev.title || "Holiday")
                    + '</div>';
            }).join('');
            allDayRow += '<div style="flex:1;border-left:1px solid #e8eaed;padding:2px 0;min-height:22px;white-space:nowrap;overflow:hidden;">' + cellHtml + '</div>';
        });
        allDayRow += '</div>';

        var tlabels = '';
        for (var h = 0; h < 24; h++) {
            var lbl = h === 0 ? '' : h < 12 ? h + ' AM' : h === 12 ? '12 PM' : (h - 12) + ' PM';
            tlabels += '<div style="height:' + HOUR_H + 'px;display:flex;align-items:flex-start;justify-content:flex-end;padding-right:8px;padding-top:0;font-size:10px;color:#70757a;font-weight:500;white-space:nowrap;">' + lbl + '</div>';
        }

        var dayCols = '';
        days.forEach(function(day) {
            var dateKey2 = day.format("YYYY-MM-DD");
            var lines = '';
            for (var h2 = 0; h2 < 24; h2++) {
                lines += '<div style="position:absolute;left:0;right:0;top:' + (h2 * HOUR_H) + 'px;border-top:1px solid #f1f3f4;"></div>';
                lines += '<div style="position:absolute;left:0;right:0;top:' + ((h2 + 0.5) * HOUR_H) + 'px;border-top:1px dashed #f1f3f4;"></div>';
            }

            var dayEvs = studentCalendarState.filteredEvents.filter(function(ev) {
                return ev.localDateKey === dateKey2 && !ev.allDay && ev.localStartMoment;
            });

            if (!dayEvs.length) {
                dayCols += '<div style="position:relative;flex:1;border-left:1px solid #e8eaed;">' + lines + '</div>';
                return;
            }

            var buckets = {};
            dayEvs.forEach(function(ev) {
                var sm = ev.localStartMoment.hours() * 60 + ev.localStartMoment.minutes();
                var bk = Math.floor(sm / 60) * 60;
                if (!buckets[bk]) buckets[bk] = [];
                buckets[bk].push({ ev: ev, sm: sm });
            });

            var SH = 24;
            var MAX_COLS = 2;
            var html = lines;

            Object.keys(buckets).sort(function(a, b) { return Number(a) - Number(b); }).forEach(function(bkKey) {
                //  
                var bk = Number(bkKey);
                var bevs = buckets[bkKey];
                var top = bk / 60 * HOUR_H;
                var visible = bevs.slice(0, MAX_COLS);
                var overflow = bevs.slice(MAX_COLS);
                var tc = visible.length;

                visible.forEach(function(item, idx) {
                    var ev = item.ev;
                    if(ev.eventKind == "activity"){
                        //  
                    }
                    var activeClass = status === "live" ? "dashboard-calendar-active" : "";
                    var dashedClass = isTimedEvent(ev) ? " is-timed-event" : "";
                    var color = getEventBorder(ev.eventKind, ev.courseId);
                    var bg = getEventBackground(ev.eventKind, ev.courseId);
                    // Completed (past) events use the muted grey theme (see getEventDisplayColor).
                    var textColor = getEventDisplayColor(ev);
                    var status = getEventStatus(ev);
                    var displayStatus = getEventDisplayStatus(ev);
                    // For TEACHER: a missed / late-joined class uses the status color (missed = red,
                    // late join = #ff6d00) for both border and text; other classes stay as-is.
                    if (typeof USER_ROLE !== "undefined" && USER_ROLE === "TEACHER" && ev.eventKind === "class" && (displayStatus === "missed" || displayStatus === "lateJoin")) {
                        textColor = getDisplayStatusColor(displayStatus, ev.eventKind, ev.courseId);
                    }
                    var isLive = status === "live";
                    var statusBadge = isTimedEvent(ev) || ev.eventKind === "assignment"
                        ? '<span class="dashboard-today-badge status-' + displayStatus + '" style="background:'+ getDisplayStatusColor(displayStatus, ev.eventKind, ev.courseId) +'">' + getDisplayStatusLabel(displayStatus) + '</span>'
                        : "";
                   
                    // 
                    var isDashed = ev.eventKind === "class";
                    var pct = 100 / tc;
                    var lft = idx * pct;
                    // 
                    var sty = "position:absolute;top:" + top + "px;height:" + SH + "px;"
                        + "left:calc(" + lft + "% + 2px);width:calc(" + pct + "% - 4px);"
                        + "border-radius:6px;padding:0 5px;font-size:11px;font-weight:500;cursor:pointer;"
                        + "overflow:hidden;display:flex;align-items:center;z-index:3;box-sizing:border-box;"
                        + "background:#fff;border:2px " + (isDashed ? "dashed" : "solid") + " " + textColor + ";color:" + textColor + ";"
                        + (isLive ? "animation:dashboardCalendarPulse 1.4s ease-in-out infinite;" : "");
                    var badge = isLive ? '<span style="flex-shrink:0;background:#e53935;color:#fff;font-size:8px;border-radius:3px;padding:0 3px;font-weight:700;margin-right:3px;">LIVE</span>' : "";
                    html += '<div class="'+activeClass+'" style="' + sty + '" data-today-event-id="' + ev.id + '">'
                        + '<span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + (status == 'live' ? statusBadge:'') +''+ (ev.category == "ASSIGNMENTS" ? escapeHtml(ev.title):escapeHtml(ev.eventTitle)) + '</span>'
                        + '</div>';
                });
                if (overflow.length > 0) {
                    var chipTop = top + SH + 2;
                    var eventIds = bevs.map(function(item) { return item.ev.id; }).join(",");
                    html += '<div style="position:absolute;left:2px;right:2px;top:' + chipTop + 'px;height:' + SH + 'px;'
                        + 'font-size:11px;font-weight:600;color:#1a73e8;background:#e8f0fe;'
                        + 'border-radius:6px;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:4;"'
                        + ' data-week-more="' + eventIds + '">+' + overflow.length + ' more</div>';
                }
            });

            dayCols += '<div style="position:relative;flex:1;border-left:1px solid #e8eaed;">' + html + '</div>';
        });

        var totalH = 24 * HOUR_H;
        var weekHtml = '<div style="display:flex;flex-direction:column;height:100%;overflow:hidden;">'
            + '<div style="display:flex;background:#fff;border-bottom:1px solid #e8eaed;flex-shrink:0;">' + hdr + '</div>'
            + allDayRow
            + '<div id="dashboardWeekBody" style="flex:1;overflow-y:auto;">'
                + '<div style="display:flex;height:' + totalH + 'px;position:relative;">'
                    + '<div style="width:52px;flex-shrink:0;background:#fff;border-right:1px solid #e8eaed;position:sticky;left:0;z-index:5;">' + tlabels + '</div>'
                    + dayCols
                + '</div>'
            + '</div>'
            + '</div>';

        calendar.html(weekHtml);

        setTimeout(function() {
            var wb = document.getElementById("dashboardWeekBody");
            if (wb) wb.scrollTop = 7 * HOUR_H;
        }, 0);

        updateDatepicker();
        renderTodaySummary();

        calendar.find("[data-week-day]").off("click.weekDrilldown").on("click.weekDrilldown", function() {
             
            var dk = $(this).attr("data-week-day");
            if (dk) {
                // Drilled in from WEEK view — Back should return to week.
                studentCalendarState.weekDayListOrigin = "agendaWeek";
                renderWeekDayListView(dk);
                refreshCalendarFromCurrentView(true);
            }
        });

        calendar.find("[data-week-more]").off("click.weekMore").on("click.weekMore", function() {
            //  
            var ids = $(this).attr("data-week-more").split(",");
            var items = ids.map(function(id) {
                return studentCalendarState.filteredEvents.filter(function(ev) { return String(ev.id) === id; })[0];
            }).filter(Boolean);
            if (items.length) {
                var fakeCellInfo = {
                    segs: items.map(function(ev) { return { event: ev }; })
                };
                handleEventLimitClick(fakeCellInfo, null);
            }
        });
    }

    function renderWeekDayListView(dateKey) {
        var calendar = $(STUDENT_CALENDAR_SELECTOR);
        if (!calendar.length) {
            return;
        }
        if (calendar.data("fullCalendar")) {
            calendar.fullCalendar("destroy");
            studentCalendarState.calendarReady = false;
        }
        studentCalendarState.viewName = "weekDayList";
        studentCalendarState.selectedDate = dateKey;
        $(".vp-btn").removeClass("active");
        $('.vp-btn[data-view="agendaWeek"]').addClass("active");
        updateActiveViewLabel();
        var selected = moment.tz(dateKey, "YYYY-MM-DD", getStudentTimezone());
        $("#dashboardCalendarTitle").text(selected.format("dddd, MMMM D"));

        var dayEvents = studentCalendarState.filteredEvents.filter(function(event) {
            return event.localDateKey === dateKey;
        }).sort(function(left, right) {
            return getTodayEventSortValue(left) - getTodayEventSortValue(right);
        });
        var html = dayEvents.length ? `
            <div class="dashboard-today-group">
                <div class="dashboard-today-date ${selected.isSame(moment().tz(getStudentTimezone()), "day") ? "is-today" : ""}">
                    <span class="dashboard-today-dow">${selected.format("ddd").toUpperCase()}</span>
                    <span class="dashboard-today-day">${selected.format("D")}</span>
                </div>
                <div class="dashboard-today-items">
                    ${dayEvents.map(renderCustomTodayEvent).join("")}
                </div>
            </div>` : '<div class="dashboard-today-empty">No calendar items found.</div>';

        calendar.html(`
            <div class="dashboard-week-day-view">
                <button type="button" class="dashboard-week-back" id="dashboardCalendarWeekBack">&larr; Back</button>
                ${html}
            </div>`);
        updateDatepicker();
        renderTodaySummary();
        bindTopbarEvents();
    }

    function renderCustomTodayEvent(event) {
        //  

        
        if(event.eventKind=="activity"){
            //  completed
        }
        
        var status = getEventStatus(event);
        var color = getEventBorder(event.eventKind, event.courseId);
        var colorCode = getEventTextColor(event.eventKind, event.courseId);
        var activeClass = status === "live" ? "dashboard-calendar-active bhagat 1" : "";
        var aStatus = getAssignmentStatus(event);
        var statusColor = aStatus.status === "submitted" ? "#1b5e20"
                        : aStatus.status === "pending"   ? "#f4b400"
                        : "#1a73e8";
        // var dashedClass = isTimedEvent(event) ? " is-timed-event" : " border";
        var dashedClass = event.eventKind == "class" ? " is-timed-event" : " border";
        // PAST class/activity -> two badges: "Expired" + (Missed | Late Joined) when attendance
        // applies. Live/Upcoming -> single badge. Non-timed events -> none.
        var statusBadge = isTimedEvent(event) ? buildStatusBadges(event) : "";
        var joinStatusLabel = isTimedEvent(event) ? joinStatus(event) : "";
            /*<div class="dashboard-today-event p-2 rounded-10 ${activeClass} ${dashedClass}" data-today-event-id="${event.id}" style="border-color:${(status == 'live' ? `red`:getEventTextColor(event.eventKind, event.courseId))} !important;">*/
            var html=`<div class="dashboard-today-event p-2 rounded-10 justify-content-center ${activeClass} ${dashedClass}" data-today-event-id="${event.id}" style="border-color:${(status == 'live' ? colorCode:colorCode)} !important;">
                
                <div class="dashboard-today-content text-center">`;
                    if(event.eventKind === "assignment" || event.eventKind === "activity"){
                        html+=
                        `<div class="full font-weight-semi-bold">`;
                        if(event.eventKind == "assignment"){
                                html+=`<p class="font-weight-semi-bold d-inline-flex mb-0 ${aStatus.status == "pending" ?"text-dark":"text-white"}" style="line-height:12px; background:${statusColor};font-size:9px;padding:2px 8px;border-radius:4px;margin-right:5px;text-transform:uppercase">${escapeHtml(aStatus.label)}</p>`;
                                if (aStatus.timingLabel) {
                                    if(aStatus.timingLabel.startsWith('Early')){
                                        // html+=` <span class="font-weight-bold" style="color:${statusColor}">Very Well Done!</span>`
                                    }
                                }
                            }else if(event.eventKind == "activity"){
                                html+=`${statusBadge}`
                            }
                        html+=`</div>`;
                    }
                    html+=`<div class="dashboard-today-title font-weight-semi-bold" style="color:${colorCode};">
                        <span class="dashboard-today-dot d-inline-block" style="background:${colorCode};"></span>    
                        ${event.eventKind != "activity" ? statusBadge:""}
                        ${escapeHtml(event.title)}
                    </div>
                    <div class="dashboard-today-subtitle ${getStatusLabel(status) == "PAST"?"text-black-50":""}">
                        ${event.eventType == "SYS-TRAINING" ? `<h5 class="font-weight-semi-bold text-primary font-16">School System Training</h5>`:``}
                        ${
                            /*${USER_ROLE == "STUDENT" ? getEventSubtitle(event):event.eventTitle+' '+`<b class="${getStatusLabel(status) == "PAST"?"text-black-50":"text-dark"}">${getEventSubtitle(event)}</b>`}${getStatusLabel(status) == "PAST" && (event.eventKind != "assignment" && event.eventKind != "activity") ?`&nbsp;<label class="m-0 font-weight-semi-bold" style="color:${getDisplayStatusColor(getEventDisplayStatus(event), event.eventKind, event.courseId)}">${joinStatusLabel}</label>`:""} */''
                        }
                        ${USER_ROLE == "STUDENT" ? getEventSubtitle(event):`<b class="${getStatusLabel(status) == "PAST"?"text-black-50":"text-dark"}">${getEventSubtitle(event)}</b>`}${getStatusLabel(status) == "PAST" && (event.eventKind != "assignment" && event.eventKind != "activity") ?`&nbsp;<label class="m-0 font-weight-semi-bold" style="color:${getDisplayStatusColor(getEventDisplayStatus(event), event.eventKind, event.courseId)}">${joinStatusLabel}</label>`:""}
                        ${
                            (event.category !="BATCH" && event.category == "CLASS" && event.eventType != "CUSTOM" && event.eventType != "PTM") ? 
                                `<span class="full font-weight-semi-bold ${getStatusLabel(status) == "PAST"?"text-black-50":"text-dark"}">
                                    ${USER_ROLE == "TEACHER" ? `Student Name: ${event.origName}`:`${event.eventType == "SYS-TRAINING" ? `Admin Name: ${event.salutation}&nbsp;${event.origName}`:`${(event.category == "BATCH" || event.category == "CLASS" || event.eventType == "CUSTOM")? `<span class="full font-weight-semi-bold ${getStatusLabel(status) == "PAST"?"text-black-50":"text-dark"}">${USER_ROLE == "STUDENT" ? `Teacher Name:&nbsp;${event.salutation}.&nbsp;${event.origName}`:``}</span>`:``}`}`} 
                                </span>`:
                            `${(event.category == "BATCH" || event.category == "CLASS" || event.eventType == "CUSTOM") && event.eventType != "PTM" ? `<span class="full font-weight-semi-bold ${getStatusLabel(status) == "PAST"?"text-black-50":"text-dark"}">${USER_ROLE == "STUDENT" ? `Teacher Name:&nbsp;${event.salutation}.&nbsp;${event.origName}`:`${event.category != "BATCH"? `Student Name:&nbsp;${event.origName}`:``}`}</span>`:``}`
                        }
                        
                    </div>
                </div>
            </div>`;
        return html;
    }

    function eventDateMap() {
        var dateMap = {};
        studentCalendarState.filteredEvents.forEach(function(event) {
            if (event.localStartMoment) {
                dateMap[event.localStartMoment.format("YYYY-MM-DD")] = true;
            }
        });
        return dateMap;
    }

    function updateDatepicker() {
        var $datepicker = $("#dashboardCalendarDatepicker");
        if (!$datepicker.length || !$.fn.datepicker) {
            return;
        }
        if (!studentCalendarState.datepickerReady) {
            $datepicker.datepicker({
                todayHighlight: true,
                autoclose: false,
                beforeShowDay: function(date) {
                    var key = moment(date).format("YYYY-MM-DD");
                    if (eventDateMap()[key]) {
                        return { classes: "dashboard-calendar-date-has-event" };
                    }
                    return true;
                }
            }).on("changeDate", function(event) {
                
                if (studentCalendarState.suppressDatepickerEvent) {
                    return;
                }
                studentCalendarState.selectedDate = moment(event.date).format("YYYY-MM-DD");
                if (studentCalendarState.viewName === "today") {
                    renderCustomTodayView();
                    refreshCalendarFromCurrentView(true);
                } else if (studentCalendarState.viewName === "agendaWeek") {
                    renderCustomWeekView();
                    refreshCalendarFromCurrentView(true);
                } else if (studentCalendarState.viewName === "weekDayList") {
                    renderWeekDayListView(studentCalendarState.selectedDate || moment(event.date).format("YYYY-MM-DD"));
                    refreshCalendarFromCurrentView(true);
                } else if ($(STUDENT_CALENDAR_SELECTOR).data("fullCalendar")) {
                    $(STUDENT_CALENDAR_SELECTOR).fullCalendar("gotoDate", studentCalendarState.selectedDate);
                }
            });
            studentCalendarState.datepickerReady = true;
        }
        var selected = studentCalendarState.selectedDate || moment().tz(getStudentTimezone()).format("YYYY-MM-DD");
        studentCalendarState.suppressDatepickerEvent = true;
        $datepicker.datepicker("update", moment(selected, "YYYY-MM-DD").toDate());
        studentCalendarState.suppressDatepickerEvent = false;
    }

    function refreshUIOnly() {
        applyFilters();
        renderCourseFilters();
        renderSchoolEventFilters();
        renderCategoryFilters();
        renderTodaySummary();
        updateDatepicker();
        if (studentCalendarState.viewName === "today") {
            renderCustomTodayView();
        } else if (studentCalendarState.viewName === "weekDayList") {
            renderWeekDayListView(studentCalendarState.selectedDate || moment().tz(getStudentTimezone()).format("YYYY-MM-DD"));
        } else if (studentCalendarState.viewName === "agendaWeek") {
            renderCustomWeekView();
        } else if ($(STUDENT_CALENDAR_SELECTOR).data("fullCalendar")) {
            $(STUDENT_CALENDAR_SELECTOR).fullCalendar("removeEvents");
            $(STUDENT_CALENDAR_SELECTOR).fullCalendar("addEventSource", studentCalendarState.filteredEvents);
            $(STUDENT_CALENDAR_SELECTOR).fullCalendar("rerenderEvents");
        }
        saveStoredState();
    }

    // Human label for the currently-active view pill, shown between the prev/next arrows.
    // "today"/"weekDayList" render a single day -> "Day"; agendaWeek -> "Week"; month -> "Month".
    function getViewLabel(viewName) {
        if (viewName === "agendaWeek") { return "Week"; }
        if (viewName === "month")      { return "Month"; }
        return "Day";
    }

    // Keeps #dashboardCalendarViewLabel in sync with the highlighted view pill.
    function updateActiveViewLabel() {
        var active = $(".vp-btn.active").attr("data-view") || studentCalendarState.viewName;
        $("#dashboardCalendarViewLabel").text(getViewLabel(active));
    }

    function updateCalendarTitle(view) {
        if (!view) {
            return;
        }
        var title = view.name === "agendaWeek" ? getWeekRangeTitle(view) : view.title;
        $("#dashboardCalendarTitle").text(title);
        $(".vp-btn").removeClass("active");
        $('.vp-btn[data-view="' + view.name + '"]').addClass("active");
        updateActiveViewLabel();
        studentCalendarState.viewName = view.name;
        studentCalendarState.selectedDate = moment().isBetween(view.start, view.end, "day", "[)") ? moment().format("YYYY-MM-DD") : view.intervalStart.format("YYYY-MM-DD");
        updateDatepicker();
    }

    function getWeekRangeTitle(view) {
        var start = view.start.clone();
        var end = view.end.clone().subtract(1, "day");
        if (start.format("YYYY") !== end.format("YYYY")) {
            return start.format("MMM YYYY") + " - " + end.format("MMM YYYY");
        }
        if (start.format("MMM") !== end.format("MMM")) {
            return start.format("MMM") + " - " + end.format("MMM YYYY");
        }
        return start.format("MMMM YYYY");
    }

    function refreshCalendarFromCurrentView(flag) {
        var calendar = $(STUDENT_CALENDAR_SELECTOR);
        if (!studentCalendarState.lastRequest) {
            return;
        }
        var viewName = studentCalendarState.viewName;
        var start = studentCalendarState.selectedDate || moment().tz(getStudentTimezone()).format("YYYY-MM-DD");
        var end;
        if(viewName == "today"){
            start = moment(start, "YYYY-MM-DD").subtract(1, "days").format("YYYY-MM-DD");
            end = moment(start, "YYYY-MM-DD").add(2, "days").format("YYYY-MM-DD");
        }else if(viewName == "agendaWeek"){
            start = moment(start, "YYYY-MM-DD").subtract(1, "days").format("YYYY-MM-DD");
            end = moment(start, "YYYY-MM-DD").add(7, "days").format("YYYY-MM-DD");
        }
        
        
        if (viewName !== "today" && calendar.data("fullCalendar")) {
            var view = calendar.fullCalendar("getView");
            start = moment(view.start.format("YYYY-MM-DD"), "YYYY-MM-DD").subtract(1, "day").format("YYYY-MM-DD");
            end = view.end.format("YYYY-MM-DD");
            viewName = view.name;
        }
        console.warn("Calendar View ==> "+viewName+" Start Date ==> "+start+" End Date ==> "+end);
        callSchoolCalendar(
            studentCalendarState.lastRequest.formId, 
            studentCalendarState.lastRequest.userId, 
            studentCalendarState.lastRequest.uniqueId,
            viewName,
            start,
            end,
            flag
        );
    }

    function initializeFullCalendar(initialEvents, viewName) {
        var calendar = $(STUDENT_CALENDAR_SELECTOR);
        if (!calendar.length) {
            return;
        }
        studentCalendarState.calendarReady = false;
        if (calendar.data("fullCalendar")) {
            calendar.fullCalendar("destroy");
        }
        // The custom today/week views inject their own markup via calendar.html(...)
        // (e.g. .dashboard-today-view) and destroy the FullCalendar instance. That
        // leftover markup is NOT cleared by FullCalendar init, so remove it here
        // before (re)initializing, otherwise the old view stays visible.
        calendar.empty();
        calendar.fullCalendar({
            firstDay: 0,
            header: false,
            forceEventDuration: true,
            themeSystem: "bootstrap4",
            defaultView: viewName === "month" ? "month" : "agendaWeek",
            defaultDate: studentCalendarState.selectedDate || moment().tz(getStudentTimezone()).format("YYYY-MM-DD"),
            timeFormat: "h(:mm)a",
            slotLabelFormat: "h A",
            columnFormat: "ddd",
            navLinks: true,
            editable: false,
            allDayDefault: false,
            eventLimit: true,
            eventStartEditable: false,
            // minTime: "07:00:00",
            // maxTime: "16:30:00",
            // slotDuration: "00:30:00",
            events: initialEvents,
            
            viewRender: function(view) {
                updateCalendarTitle(view);
                renderWeekHeaderDates(view);
                if (studentCalendarState.calendarReady && getSession()) {
                    refreshCalendarFromCurrentView(true);
                } else if (!getSession()) {
                    redirectLoginPage();
                }
            },
            eventClick: function(event) {
                //  
                
                openDashboardCalendarEvent(event);
                return false;
            },
            eventRender: function(event, element) {
                renderDashboardCalendarEvent(event, element);
            },
            eventAfterAllRender: function() {
                renderTodaySummary();
                markActiveEvents();
                bindWeekHeaderDrilldown();
            },
            eventLimitClick: function(cellInfo, jsEvent) {
                //  
                return handleEventLimitClick(cellInfo, jsEvent);
            }

        });
        studentCalendarState.calendarReady = true;
        bindTopbarEvents();
        startActiveRefresh();
    }

    function handleEventLimitClick(cellInfo, jsEvent) {
        //  

        var events = (cellInfo.segs || [])
            .map(function(seg) {
                return seg.event || (seg.footprint && seg.footprint.eventDef);
            })
            .filter(function(event) {
                return event;
            });

        if (!events.length) {
            return false;
        }

        var html = `<h6 class="font-weight-semi-bold mb-3">
                        ${events[0].miscProps.localStartMoment.format(DISPLAY_DATE_ONLY)}
                    </h6>`;

        console.log(events);
        
        events.forEach(function(event) {
            //  
           
            html += `
                <div class="dashboard-today-event nisha mb-2 p-2 rounded-10 ${event.miscProps.category == "CLASS" ? 'border btn-dashed' : 'border'}"
                    data-today-event-id="${event.id}"
                    style="border-color:${getEventTextColor(event.miscProps.eventKind, event.miscProps.courseId)} !important;">
                    <span class="dashboard-today-dot"
                        style="background:${getEventTextColor(event.miscProps.eventKind, event.miscProps.courseId)};">
                    </span>

                    <div class="dashboard-today-content">
                        <div class="dashboard-today-title font-weight-semi-bold" style="color:${getEventTextColor(event.miscProps.eventKind, event.miscProps.courseId)}">
                            ${escapeHtml(event.miscProps.category == "CLASS" ? event.eventTitle:event.title)}
                        </div>

                        <div class="dashboard-today-subtitle mt-0">
                            ${event.miscProps.category == "ASSIGNMENTS"
                                ? getEventSubtitle(event.miscProps)
                                : escapeHtml(getEventSubtitle(event.miscProps))}
                        </div>
                    </div>
                </div>
            `;
        });

        html += `
            <div class="full text-right mt-2">
                <button type="button" class="btn btn-pill btn-light px-3" data-dismiss="modal">
                    Close
                </button>
            </div>
        `;

        $("#fa-more-popover .modal-body").html(html);
        $("#fa-more-popover").modal("show");

        return false;
    }

    function renderDashboardCalendarEvent(event, element) {
        var isActive = isEventActive(event);
        var status = getEventStatus(event);
        var borderStyle="Solid";
        if (event.eventKind === "class"){
            borderStyle="dashed"
        }
        // Completed (past) events use the muted grey theme (see getEventDisplayColor).
        var displayColor = getEventDisplayColor(event);
        // For TEACHER: a completed class that was missed / late-joined uses the status color
        // (missed = red, late join = #ff6d00) for both border and text. For STUDENT the class keeps
        // its My Courses (course) color regardless of missed/late-join status.
        if (event.eventKind === "class" && typeof USER_ROLE !== "undefined" && USER_ROLE === "TEACHER") {
            var classDisplayStatus = getEventDisplayStatus(event);
            if (classDisplayStatus === "missed" || classDisplayStatus === "lateJoin") {
                displayColor = getDisplayStatusColor(classDisplayStatus, event.eventKind, event.courseId);
            }
        }
        element.attr("style",`border:2px ${borderStyle+' '+displayColor} !important;background:#fff !important;color:${displayColor} !important;`);

        element.toggleClass("dashboard-calendar-active", isActive);
        // Completed classes open a read-only details modal on click — keep the pointer cursor.
        if (event.eventKind === "class" && getEventStatus(event) === "completed") {
            element.css("cursor", "pointer");
        }
        if (event.eventKind === "activity") {
            element.addClass("ACTIVITY");
        } else if (event.eventKind === "class") {
            element.addClass("CLASS");
        }
        element.addClass(`CLASS_`+getStatusLabel(status));
        // 
        if (event.displayTime && event.eventKind == "class") {
            element.find(".fc-time").html('<span class="event-start-Time cursor">' + event.localStartMoment.format("hh:mm A") + '</span>');
        }else if(event.eventKind == "assignment"){
            element.find(".fc-time").html('<span class="event-start-Time d-block overflow-hidden cursor" style="white-space: nowrap;text-overflow: ellipsis;">' + event.title + '</span>')   
        }else if(event.eventKind == "holiday"){
            element.find(".fc-content").html('<span class="event-start-Time d-block overflow-hidden cursor font-weight-bold" style="white-space: nowrap;text-overflow: ellipsis;">' + event.title + '</span>')   
        }
        element.find(".fc-title").html(
            '<div class="font-weight-bold">' + escapeHtml(event.title) + '</div>' +
            (event.name || event.subjectName ? '<div class="font-12 text-muted">' + escapeHtml(event.eventKind == "activity" ? event.subjectName:event.salutation+'&nbsp;'+event.name) + '</div>' : "") +
            (isActive ? '<div class="font-11 text-danger font-weight-bold bhagat">Live</div>' : "")
        );
        $(STUDENT_CALENDAR_SELECTOR).find(".fc-day-number").off("click.weekDrilldown").on("click.weekDrilldown", function() {
            var dk = $(this).parent().attr("data-date");
            if (dk) {
                // Drilled in from MONTH view — Back should return to month.
                studentCalendarState.weekDayListOrigin = "month";
                renderWeekDayListView(dk);
                refreshCalendarFromCurrentView(true);
            }
        });
    }

    function markActiveEvents() {
        studentCalendarState.filteredEvents.forEach(function(event) {
            var selector = '.fc-event[data-event-id="' + event._id + '"]';
            $(selector).toggleClass("dashboard-calendar-active", isEventActive(event));
        });
        renderTodaySummary();
    }

    // Comma-joined key of all currently-live event ids. Used to detect a
    // live-status change (an event going live / a live event ending) so we
    // only re-render when the live status actually changes.
    function getLiveEventKey() {
        var liveIds = [];
        studentCalendarState.filteredEvents.forEach(function(event) {
            if (isEventActive(event)) {
                liveIds.push(event.id);
            }
        });
        return liveIds.sort().join(",");
    }

    function startActiveRefresh() {
        if (studentCalendarState.activeRefreshTimer) {
            clearInterval(studentCalendarState.activeRefreshTimer);
        }
        studentCalendarState.lastLiveKey = getLiveEventKey();
        studentCalendarState.activeRefreshTimer = setInterval(function() {
            updateClock();
            // Detect live -> ended transitions each tick and run the post-event
            // attendance refresh + feedback flow (self-deduped per event). While an
            // event is still LIVE this never opens the feedback popup.
            processLiveEventLifecycle();

            // Per-second: only check the live status. Skip the (heavy) re-render
            // unless the set of live events has actually changed.
            var liveKey = getLiveEventKey();
            if (liveKey === studentCalendarState.lastLiveKey) {
                return;
            }
            studentCalendarState.lastLiveKey = liveKey;
            if (studentCalendarState.viewName === "today") {
                renderCustomTodayView();
            } else if (studentCalendarState.viewName === "weekDayList") {
                renderWeekDayListView(studentCalendarState.selectedDate || moment().tz(getStudentTimezone()).format("YYYY-MM-DD"));
            } else if ($(STUDENT_CALENDAR_SELECTOR).data("fullCalendar")) {
                $(STUDENT_CALENDAR_SELECTOR).fullCalendar("rerenderEvents");
            }
            renderTodaySummary();
        }, ACTIVE_REFRESH_MS);
    }

    function bindTopbarEvents() {
        console.log("studentCalendarState",studentCalendarState)
        $(document).off("click.dashboardCalendarNew", "#dashboardCalendarPrev");
        $(document).on("click.dashboardCalendarNew", "#dashboardCalendarPrev", function() {
            if (studentCalendarState.viewName === "today") {
                var prevDate = moment(studentCalendarState.selectedDate || moment().tz(getStudentTimezone()).format("YYYY-MM-DD"), "YYYY-MM-DD").subtract(1, "days");
                studentCalendarState.selectedDate = prevDate.format("YYYY-MM-DD");
                renderCustomTodayView();
                refreshCalendarFromCurrentView(true);
            } else if (studentCalendarState.viewName === "weekDayList") {
                var prevListDate = moment(studentCalendarState.selectedDate || moment().tz(getStudentTimezone()).format("YYYY-MM-DD"), "YYYY-MM-DD").subtract(1, "days");
                renderWeekDayListView(prevListDate.format("YYYY-MM-DD"));
                refreshCalendarFromCurrentView(true);
            } else if (studentCalendarState.viewName === "agendaWeek") {
                var curWk = moment(studentCalendarState.selectedDate || moment().tz(getStudentTimezone()).format("YYYY-MM-DD"), "YYYY-MM-DD");
                studentCalendarState.selectedDate = curWk.startOf("week").subtract(7, "days").format("YYYY-MM-DD");
                renderCustomWeekView();
                refreshCalendarFromCurrentView(true);
            } else {
                $(STUDENT_CALENDAR_SELECTOR).fullCalendar("prev");
            }
        });
        $(document).off("click.dashboardCalendarNew", "#dashboardCalendarNext");
        $(document).on("click.dashboardCalendarNew", "#dashboardCalendarNext", function() {
            
            if (studentCalendarState.viewName === "today") {
                var nextDate = moment(studentCalendarState.selectedDate || moment().tz(getStudentTimezone()).format("YYYY-MM-DD"), "YYYY-MM-DD").add(1, "days");
                studentCalendarState.selectedDate = nextDate.format("YYYY-MM-DD");
                renderCustomTodayView();
                refreshCalendarFromCurrentView(true);
            } else if (studentCalendarState.viewName === "weekDayList") {
                var nextListDate = moment(studentCalendarState.selectedDate || moment().tz(getStudentTimezone()).format("YYYY-MM-DD"), "YYYY-MM-DD").add(1, "days");
                renderWeekDayListView(nextListDate.format("YYYY-MM-DD"));
                refreshCalendarFromCurrentView(true);
            } else if (studentCalendarState.viewName === "agendaWeek") {
                var curWk2 = moment(studentCalendarState.selectedDate || moment().tz(getStudentTimezone()).format("YYYY-MM-DD"), "YYYY-MM-DD");
                studentCalendarState.selectedDate = curWk2.startOf("week").add(7, "days").format("YYYY-MM-DD");
                renderCustomWeekView();
                refreshCalendarFromCurrentView(true);
            } else {
                $(STUDENT_CALENDAR_SELECTOR).fullCalendar("next");
            }
        });
        $(document).off("click.dashboardCalendarNew", "#dashboardCalendarToday");
        $(document).on("click.dashboardCalendarNew", "#dashboardCalendarToday", function() {
            studentCalendarState.selectedDate = moment().tz(getStudentTimezone()).format("YYYY-MM-DD");
            if (studentCalendarState.viewName === "today") {
                renderCustomTodayView();
                refreshCalendarFromCurrentView(true);
            } else if (studentCalendarState.viewName === "weekDayList") {
                renderWeekDayListView(studentCalendarState.selectedDate);
                refreshCalendarFromCurrentView(true);
            } else {
                $(STUDENT_CALENDAR_SELECTOR).fullCalendar("today");
            }
        });
        $(document).off("click.dashboardCalendarNew", ".vp-btn");
        $(document).on("click.dashboardCalendarNew", ".vp-btn", function() {
            // data-view is one of: "today" | "agendaWeek" | "month".
            // Each button switches directly to its own view (instant, no page reload).
            // The active button highlight is handled inside each render path
            // (renderCustomTodayView / renderCustomWeekView / updateCalendarTitle),
            // which does removeClass("active") on all .vp-btn then addClass on the current one.
            var viewName = $(this).attr("data-view");

            // TODAY: jump to the current date, then show the Day (Today) view.
            if (viewName === "today") {
                studentCalendarState.viewName = "today";
                // Equivalent to FullCalendar's today() — reset the selected date to now
                // so the custom day view renders the current date.
                studentCalendarState.selectedDate = moment().tz(getStudentTimezone()).format("YYYY-MM-DD");
                renderCustomTodayView();
                refreshCalendarFromCurrentView(true);
                return;
            }

            // WEEK: show the Week view.
            if (viewName === "agendaWeek") {
                studentCalendarState.viewName = "agendaWeek";
                renderCustomWeekView();
                refreshCalendarFromCurrentView(true);
                return;
            }

            // MONTH: rendered by FullCalendar. Reuse the live instance and call
            // changeView() so events are preserved and it is not reinitialized.
            // The custom today/week views destroy the instance, so when coming from
            // one of those we build it once via initializeFullCalendar().
            studentCalendarState.viewName = "month";
            var calendar = $(STUDENT_CALENDAR_SELECTOR);
            if (calendar.data("fullCalendar")) {
                calendar.fullCalendar("changeView", "month");
            } else {
                initializeFullCalendar(studentCalendarState.filteredEvents, "month");
            }
            refreshCalendarFromCurrentView(true);
        });
        $(document).off("click.dashboardCalendarNew", "#dashboardCalendarWeekBack");
        $(document).on("click.dashboardCalendarNew", "#dashboardCalendarWeekBack", function() {
            // Return to whichever view we drilled in from.
            if (studentCalendarState.weekDayListOrigin === "month") {
                studentCalendarState.viewName = "month";
                var calendar = $(STUDENT_CALENDAR_SELECTOR);
                if (calendar.data("fullCalendar")) {
                    calendar.fullCalendar("changeView", "month");
                } else {
                    initializeFullCalendar(studentCalendarState.filteredEvents, "month");
                }
                refreshCalendarFromCurrentView(true);
            } else {
                studentCalendarState.viewName = "agendaWeek";
                renderCustomWeekView();
                refreshCalendarFromCurrentView(true);
            }
        });
    }

    function bindWeekHeaderDrilldown() {
        var calendar = $(STUDENT_CALENDAR_SELECTOR);
        if (!calendar.data("fullCalendar")) {
            return;
        }
        var view = calendar.fullCalendar("getView");
        if (!view || view.name !== "agendaWeek") {
            return;
        }
        renderWeekHeaderDates(view);
        calendar.find(".fc-day-header[data-date], .fc-day-top[data-date]").off("click.dashboardCalendarWeekDay").on("click.dashboardCalendarWeekDay", function() {
            var dateKey = $(this).attr("data-date");
            if (dateKey) {
                renderWeekDayListView(dateKey);
                refreshCalendarFromCurrentView(true);
            }
        });
    }

    function renderWeekHeaderDates(view) {
        if (!view || view.name !== "agendaWeek") {
            return;
        }
        
        if (view.name === "month") {
            return;
        }
        var todayKey = moment().tz(getStudentTimezone()).format("YYYY-MM-DD");
        $(STUDENT_CALENDAR_SELECTOR).find(".fc-day-header").each(function(index) {
            var day = view.start.clone().add(index, "days");
            var dateKey = day.format("YYYY-MM-DD");
            $(this).attr("data-date", dateKey).html(
                '<div class="dashboard-week-head ' + (dateKey === todayKey ? "is-today" : "") + '">' +
                    '<span class="dashboard-week-head-dow">' + day.format("ddd").toUpperCase() + '</span>' +
                    '<span class="dashboard-week-head-day">' + day.format("D") + '</span>' +
                '</div>'
            );
        });
    }

    function bindFilterEvents() {
        // 
        $(document).off("click.dashboardCalendarFilters", "[data-filter-course]");
        $(document).on("click.dashboardCalendarFilters", "[data-filter-course]", function(event) {
            //  
            event.stopPropagation();
            var courseId = $(this).attr("data-filter-course");
            studentCalendarState.filters.courseVisibility[courseId] = !studentCalendarState.filters.courseVisibility[courseId];
            refreshUIOnly();
        });
        $(document).off("click.dashboardCalendarFilters", "[data-filter-key]");
        $(document).on("click.dashboardCalendarFilters", "[data-filter-key]", function() {
            var key = $(this).attr("data-filter-key");
            studentCalendarState.filters[key] = !studentCalendarState.filters[key];
            refreshUIOnly();
        });
        $(document).off("click.dashboardCalendarFilters", "[data-color-course]");
        $(document).on("click.dashboardCalendarFilters", "[data-color-course]", function(event) {
            event.stopPropagation();
            $(".cpop").removeClass("open");
            $("#calendarColorPicker-" + $(this).attr("data-color-course")).addClass("open");
        });
        $(document).off("click.dashboardCalendarFilters", "[data-palette-course]");
        $(document).on("click.dashboardCalendarFilters", "[data-palette-course]", function(paletteEvt) {
            paletteEvt.stopPropagation();
            var courseId  = $(this).attr("data-palette-course");
            var newColor  = $(this).attr("data-color");

            // Persist the new color for this course
            if (studentCalendarState.courses[courseId]) {
                studentCalendarState.courses[courseId].color = newColor;
            }

            // Update color ONLY on CLASS events that belong to this course (same courseId = same subjectId).
            // ASSIGNMENTS, HOLIDAY, and ACTIVITY events are intentionally left unchanged.
            studentCalendarState.masterEvents = studentCalendarState.masterEvents.map(function(ev) {
                if (ev.eventKind === "class" && ev.courseId === courseId) {
                    ev.backgroundColor = getEventBackground(ev.eventKind, ev.courseId);
                    ev.borderColor     = getEventTextColor(ev.eventKind, ev.courseId);
                    ev.textColor       = getEventTextColor(ev.eventKind, ev.courseId);
                }
                return ev;
            });

            $(".cpop").removeClass("open");
            refreshUIOnly();
        });
        $(document).off("click.dashboardCalendarSummary", "[data-summary-event-id]");
        $(document).on("click.dashboardCalendarSummary", "[data-summary-event-id]", function() {
            //  
            var eventId = $(this).attr("data-summary-event-id");
            var event = studentCalendarState.filteredEvents.filter(function(item) { return String(item.id) === String(eventId); })[0];
            if (event) {
                openDashboardCalendarEvent(event);
            }
        });
        $(document).off("click.dashboardCalendarTodayEvent", "[data-today-event-id]");
        $(document).on("click.dashboardCalendarTodayEvent", "[data-today-event-id]", function(clickEvent) {
            // A click on the "Rate this class/activity" button is handled by
            // openClassFeedbackById — don't also open the event details modal.
            if ($(clickEvent.target).closest("[id^='feedbackBtn_']").length) {
                return;
            }
            var eventId = $(this).attr("data-today-event-id");
            var event = studentCalendarState.filteredEvents.filter(function(item) { return String(item.id) === String(eventId); })[0];
            if (event) {
                openDashboardCalendarEvent(event);
            }
        });
        $(document).off("mouseup.dashboardCalendarFilters");
        $(document).on("mouseup.dashboardCalendarFilters", function(event) {
            if (!$(event.target).closest(".cpop, [data-color-course]").length) {
                $(".cpop").removeClass("open");
            }
        });
    }
    function proceedwithControll(url, response, eventKind, courseId, classTitle, teacherName, classStatus, eventType, salutation){
        if (response['status'] == '0' || response['status'] == '2' || response['status'] == '3') {
            if (response['status'] == '3') {
                redirectLoginPage();
            } else {
                if(response['message']){
                    var message=response['message'];
                    if('Too many attempts. Please try after some time'==message){
                        message='Please click on the class again'
                    }
                showMessageTheme2(0, message);
                }else{
                    if(response['dateStatus']=='past' || response['dateStatus']=='future'){
                        $('#classJoinInSameWindowModal').modal({backdrop: 'static', keyboard: false});
                        $('#classTime').html(response['classDate']);
                        $('#className').html(response['className']);
                        $('#subjectName').html(response['subjectName']);
                        if(response['userRole']!='TEACHER'){
                            $('#classJoinInSameWindowBody').html(calendarMeetingLinkValidateStudent(url, response, eventKind, courseId, classTitle, teacherName, classStatus, eventType, salutation));
                        }else{
                            $('#classJoinInSameWindowBody').html(calendarMeetingLinkValidateTeacher(url, response, eventKind, courseId, eventType));
                        }
                    }
                }
            }
        } else {
            if(response['dateStatus']=='between'){
                var classUrl=response['redirectUrl'];
                $('#classJoinInSameWindowModal').modal({backdrop: 'static', keyboard: false});
                $('#classJoinInSameWindowBody').html(calendarMeetingLinkValidateStudent(classUrl, response, eventKind, courseId, "", "", "", "", salutation));
                window.setTimeout(function () { $('#classJoinInSameWindowModal').modal('hide');}, response['meetingJoinModalHideMin']*1000);
                window.open(classUrl,"_blank");
            }
        }
        var getColorCode = getEventTextColor(eventKind, courseId);
        $("#classJoinInSameWindowModal .modal-event-border").css({"background":getColorCode});
    }
    function calendarMeetingLinkValidateStudent(url, response, eventKind, courseId, classTitle, teacherName, classStatus, eventType, salutation){
        //  
        var getColorCode = getEventTextColor(eventKind, courseId);
        var warringMessage=false;
        if(response['dateStatus']=='past'){
            warringMessage=true;
        }else if(response['dateStatus']=='future'){
            warringMessage=true;
        }
        var html = 
        `<div id="classJoinWaringDiv">`
            if(warringMessage){
                if(response.classType == 'SYS-TRAINING'){
                    html+=`<div id="classWaringMessage" class="full text-center my-4">
                        <h5>The ${response.className} | ${response.subjectName} is scheduled for ` + response.classDate + `.</h5>
                        <h5>You can join the training on ${response.canJoindateStart}.</h5>
                    </div>`;
                }else{
                    console.log(response);
                    html+=`<div id="classWaringMessage" class="full text-center mb-4">
                        <h5 class="font-18 text-left mb-2" style="color:${getColorCode}">${response.className}</h5>
                        ${((eventType == "CUSTOM" || eventType == "PTM") ? '<h6 class="font-weight-semi-bold mb-3 text-left text-dark">' + escapeHtml(classTitle) + '</h6>':"")}
                        <ul class="full p-0 m-0">
                                ${/*
                                    <li class="d-flex flex-wrap mb-1">
                                        <span class="text-black-80 font-weight-semi-bold font-14 pr-2 text-left" style="min-width:80px">Course</span>
                                        <span class="text-black-80 font-weight-semi-bold font-14">${response.className}</span>
                                    </li>    
                                */''}
                                <li class="d-flex flex-wrap mb-1">
                                    <span class="text-black-80 font-weight-semi-bold font-14 pr-2 text-left" style="min-width:80px">Date</span>
                                    <span class="text-black-80 font-weight-semi-bold font-14">${convertDatetimeWithFormat((response.classDate), response.classTimezone, USER_TIMEZONE, DISPLAY_DATE_ONLY)}</span>
                                </li>
                                <li class="d-flex flex-wrap mb-1">
                                    <span class="text-black-80 font-weight-semi-bold font-14 pr-2 text-left" style="min-width:80px">Time</span>
                                    <span class="text-black-80 font-weight-semi-bold font-14">${getTime(convertDatetimeWithFormat((response.classDate),response.classTimezone, USER_TIMEZONE, DISPLAY_DATE_AND_TIME))}</span>
                                </li>
                                <li class="d-flex flex-wrap mb-1">
                                    <span class="text-black-80 font-weight-semi-bold font-14 pr-2 text-left" style="min-width:80px">Teacher</span>
                                    <span class="text-black-80 font-weight-semi-bold font-14">${salutation+"."+ " "+response.subjectName}</span>
                                </li>
                                <li class="d-flex flex-wrap mb-1">
                                    <span class="text-black-80 font-weight-semi-bold font-14 pr-2 text-left" style="min-width:80px">Status</span>
                                    <span class="text-black-80 font-weight-semi-bold font-14">${(classStatus != null && classStatus != undefined && classStatus != "" ? classStatus: response.dateStatus == "past" ? 'Expired':response.dateStatus == "future" ? "Upcoming":response.dateStatus == "between"? "Live":"")}</span>
                                </li>   
                            </ul> 
                        ${/*
                            <ul class="full p-0 m-0">
                                <li class="d-flex flex-wrap mb-1">
                                    <span class="text-black-80 font-weight-semi-bold font-14">Course</span>
                                    <span class="text-black-80 font-weight-semi-bold font-14">${response.className}</span>
                                </li>
                                <li class="d-flex flex-wrap mb-1">
                                    <span class="text-black-80 font-weight-semi-bold font-14">Date</span>
                                    <span class="text-black-80 font-weight-semi-bold font-14">${convertDatetimeWithFormat((response.classDate), response.classTimezone, USER_TIMEZONE, DISPLAY_DATE_AND_TIME)}</span>
                                </li>
                                <li class="d-flex flex-wrap mb-1">
                                    <span class="text-black-80 font-weight-semi-bold font-14">Time</span>
                                    <span class="text-black-80 font-weight-semi-bold font-14">${}</span>
                                </li>
                                <li class="d-flex flex-wrap mb-1">
                                    <span class="text-black-80 font-weight-semi-bold font-14">Teacher</span>
                                    <span class="text-black-80 font-weight-semi-bold font-14">${}</span>
                                </li>
                                <li class="d-flex flex-wrap mb-1">
                                    <span class="text-black-80 font-weight-semi-bold font-14">Status</span>
                                    <span class="text-black-80 font-weight-semi-bold font-14">${}</span>
                                </li>   
                            </ul> 
                            
                            <h5>The class ${response.className} | ${response.subjectName} is scheduled for ` + convertDatetimeWithFormat((response.classDate), response.classTimezone, USER_TIMEZONE, DISPLAY_DATE_AND_TIME) + `.</h5>
                            <h5>You can join the class on `+ convertDatetimeWithFormat((response.canJoindateStart), response.classTimezone, USER_TIMEZONE, DISPLAY_DATE_AND_TIME) + `.</h5>
                        */''}
                        
                    </div>`;
                }
            }
            if(!warringMessage){
            html+=`
                ${response.joinType == "H" ?
                `
                    <h5 class="font-18 text-left mb-2" style="color:${getColorCode}">${response.className}</h5>
                    <ul class="full p-0 m-0">
                        <li class="d-flex flex-wrap mb-1">
                            <span class="text-black-80 font-weight-semi-bold font-14 pr-2 text-left" style="min-width:80px">Course</span>
                            <span class="text-black-80 font-weight-semi-bold font-14">${response.className}</span>
                        </li>
                        <li class="d-flex flex-wrap mb-1">
                            <span class="text-black-80 font-weight-semi-bold font-14 pr-2 text-left" style="min-width:80px">Date</span>
                            <span class="text-black-80 font-weight-semi-bold font-14">${convertDatetimeWithFormat((response.classDate), response.classTimezone, USER_TIMEZONE, DISPLAY_DATE_ONLY)}</span>
                        </li>
                        <li class="d-flex flex-wrap mb-1">
                            <span class="text-black-80 font-weight-semi-bold font-14 pr-2 text-left" style="min-width:80px">Time</span>
                            <span class="text-black-80 font-weight-semi-bold font-14">${getTime(convertDatetimeWithFormat((response.classDate),response.classTimezone, USER_TIMEZONE, DISPLAY_DATE_AND_TIME))}</span>
                        </li>
                        <li class="d-flex flex-wrap mb-1">
                            <span class="text-black-80 font-weight-semi-bold font-14 pr-2 text-left" style="min-width:80px">Student</span>
                            <span class="text-black-80 font-weight-semi-bold font-14">${response.subjectName}</span>
                        </li>
                        <li class="d-flex flex-wrap mb-1">
                            <span class="text-black-80 font-weight-semi-bold font-14 pr-2 text-left" style="min-width:80px">Status</span>
                            <span class="text-black-80 font-weight-semi-bold font-14" style="color:${getColorCode}">${(classStatus != null && classStatus != undefined && classStatus != "" ? classStatus: response.dateStatus == "past" ? 'Expired':response.dateStatus == "future" ? "Upcoming":response.dateStatus == "between"? "Live Now":"")}</span>
                        </li>   
                    </ul> 
                    
                    ${/*
                        <h6 class="text-center">The class ${response.className} is scheduled for ` + convertDatetimeWithFormat((response.classDate), response.classTimezone, USER_TIMEZONE, DISPLAY_DATE_AND_TIME) + `</h6>
                        <a target="_blank" id="classJoinWaring" href="${url}" onclick="autodiposeModel('classJoinInSameWindowModal')" class="btn btn-sm rounded mt-2 mx-auto" style="background-color: #027FFF; box-shadow: 0px 0px; padding: 5px 10px; display: flex; width: max-content; font-weight: bold; color: white;">Join Class Now</a>    
                    */''}
                    <hr style="border-top: 2px dashed #cdcdcd;">
                    <h6 class="text-center">If you face issues with joining, copy the host link below and paste it into a new tab on your browser:</h6>
                    <p class="copy-msg-0 mt-3 mb-0" style="text-align: center; font-weight: bold;"></p>
                    ${DEPLOYMENT_MODE != "PROD" ?
                    `
                        <textarea style="width:100%;height:100px;">${url}</textarea>
                    `
                    :
                    `
                        <input style="opacity:0;height:0px;display:none;">
                    `
                    }
                    <button value="${url}" class="btn btn-pill btn-success mt-2 mx-auto align-items-center" style="border: 0px; box-shadow: 0px 0px; padding: 5px 10px; display: flex; width: max-content; font-weight: bold;" onclick="copyURL('copyURL0','copy-msg-0')"><i class="fa fa-clone" style="font-size: 14px;"></i>&nbsp;Copy Class Link</button>
                    <div style="top:0;left:0;position:absolute;">
                    <input type="text" id="copyURL0" value="${url}" style="opacity:0;height:0px">
                    </div>
                    <hr style="border-top: 2px dashed #cdcdcd;">
                    <h6 class="text-center">If your student has trouble joining, share the class link below with them:</h6>
                    <p class="copy-msg-1 mt-3 mb-0" style="text-align: center; font-weight: bold;"></p>
                    ${DEPLOYMENT_MODE != "PROD" ?
                    `
                        <textarea style="width:100%;height:100px;">${response.commonJoinUrlOfSMS}</textarea>
                    `
                    :
                    `
                        <input style="opacity:0;height:0px;display:none;">
                    `
                    }
                    <button value="${response.commonJoinUrlOfSMS}" class="btn btn-pill mt-2 mx-auto align-items-center text-white" style="border: 0px; box-shadow: 0px 0px; padding: 5px 10px; display: flex; width: max-content; font-weight: bold; background-color: #DFAE00;" onclick="copyURL('copyURL1','copy-msg-1')"><i class="fa fa-clone" style="font-size: 14px;"></i>&nbsp;Copy Student's Class Link</button>
                    <div style="top:0;left:0;position:absolute;">
                    <input type="text" id="copyURL1" value="${response.commonJoinUrlOfSMS}" style="opacity:0;height:0px">
                    </div>
                `
                :
                `   
                
                    <h5 class="font-18 text-left mb-2" style="color:${getColorCode}">${response.className}</h5>
                    <ul class="full p-0 m-0">
                            <li class="d-flex flex-wrap mb-1">
                                <span class="text-black-80 font-weight-semi-bold font-14 pr-2 text-left" style="min-width:80px">Course</span>
                                <span class="text-black-80 font-weight-semi-bold font-14">${response.className}</span>
                            </li>
                            <li class="d-flex flex-wrap mb-1">
                                <span class="text-black-80 font-weight-semi-bold font-14 pr-2 text-left" style="min-width:80px">Date</span>
                                <span class="text-black-80 font-weight-semi-bold font-14">${convertDatetimeWithFormat((response.classDate), response.classTimezone, USER_TIMEZONE, DISPLAY_DATE_ONLY)}</span>
                            </li>
                            <li class="d-flex flex-wrap mb-1">
                                <span class="text-black-80 font-weight-semi-bold font-14 pr-2 text-left" style="min-width:80px">Time</span>
                                <span class="text-black-80 font-weight-semi-bold font-14">${getTime(convertDatetimeWithFormat((response.classDate),response.classTimezone, USER_TIMEZONE, DISPLAY_DATE_AND_TIME))}</span>
                            </li>
                            <li class="d-flex flex-wrap mb-1">
                                <span class="text-black-80 font-weight-semi-bold font-14 pr-2 text-left" style="min-width:80px">Teacher</span>
                                <span class="text-black-80 font-weight-semi-bold font-14">${salutation+"."+ " "+response.subjectName}</span>
                            </li>
                            <li class="d-flex flex-wrap mb-1">
                                <span class="text-black-80 font-weight-semi-bold font-14 pr-2 text-left" style="min-width:80px">Status</span>
                                <span class="text-black-80 font-weight-semi-bold font-14" style="color:${response.dateStatus == "between" ? `${getColorCode}`:``};">${(classStatus != null && classStatus != undefined && classStatus != "" ? classStatus: response.dateStatus == "past" ? 'Expired':response.dateStatus == "future" ? "Upcoming":response.dateStatus == "between"? "Live Now":"")}</span>
                            </li>   
                        </ul> 
                    ${/*
                        <h6 class="text-center">The class ${response.className} is scheduled for ` + convertDatetimeWithFormat((response.classDate), response.classTimezone, USER_TIMEZONE, DISPLAY_DATE_AND_TIME) + `</h6>
                        <a target="_blank" id="classJoinWaring" href="${url}" onclick="autodiposeModel('classJoinInSameWindowModal')" class="btn btn-sm rounded mt-2 mx-auto" style="background-color: #027FFF; box-shadow: 0px 0px; padding: 5px 10px; display: flex; width: max-content; font-weight: bold; color: white;">Join Class Now</a>    
                    */''}
                    <hr style="border-top: 2px dashed #cdcdcd;">
                    <h6 class="text-center">If you are facing issues with joining, copy the class link below and paste it into a new tab on your browser:</h6>
                    <p class="copy-msg-0 mt-3 mb-0" style="text-align: center; font-weight: bold;"></p>
                    ${DEPLOYMENT_MODE != "PROD" ?
                    `
                        <textarea style="width:100%;height:100px;">${url}</textarea>
                    `
                    :
                    `
                        <input style="opacity:0;height:0px;display:none;">
                    `
                    }
                    <button value="${url}" class="btn btn-pill btn-success mt-2 mx-auto align-items-center" style="border: 0px; box-shadow: 0px 0px; padding: 5px 10px; display: flex; width: max-content; font-weight: bold;" onclick="copyURL('copyURL0','copy-msg-0')"><i class="fa fa-clone" style="font-size: 14px;"></i>&nbsp;Copy Class Link</button>
                    <div style="top:0;left:0;position:absolute;">
                    <input type="text" id="copyURL0" value="${url}" style="opacity:0;height:0px">
                    </div>`
                }`;
            }
        html+=`</div>
        <div class="full text-right mt-2">
            <button type="button" class="btn btn-pill btn-light px-3 mr-2" data-dismiss="modal">Close</button>`;
            if(!warringMessage){
                html+=`<a target="_blank" id="classJoinWaring" href="${url}" onclick="autodiposeModel('classJoinInSameWindowModal')" class="btn btn-pill" style="background:${getColorCode};color:#fff;">Join Class</a>`;
                // if(response.joinType != "H"){
                // }
            }
        html+=`</div>`;
        return html;
    }

    function calendarMeetingLinkValidateTeacher(url, response, eventKind, courseId, eventType) {
        var warringMessage = false;
        if (response["dateStatus"] == "past") {
            if (response["pastClassWarning"]) {
                warringMessage = true;
            }
        } else if (response["dateStatus"] == "future") {
            if (response["futureClassWarning"]) {
                warringMessage = true;
            }
        }
        if (warringMessage) {
            var jfmUrl = url + "?jfm=Y";
            var html =
            `<div class="full text-center mb-2">
                <h5 class="font-weight-bold">You are about to start the following class:</h5>
            </div>
            <div id="classJoinWaringDiv">
                <div id="classWaringMessage" class="full text-center my-4">
                    <h5>The class ` + convertDatetimeWithFormat(response.classDate, response.classTimezone, USER_TIMEZONE, DISPLAY_DATE_AND_TIME) + ` | ` + response.className + ` | ` + response.subjectName + `</h5>
                    <h5>The current time does not match this scheduled class time. Do you still wish to proceed?</h5>
                </div>
                <div class="full text-center mt-2">
                    <button type="button" class="btn btn-outline-dark font-size-lg" data-dismiss="modal">No</button>
                    <a id="classJoinWaring" href="javascript:void(0)" class="btn btn-primary font-size-lg" onclick="classDetailsOnModal('` +jfmUrl +`', '` +eventKind +`', '` +courseId +`', '` +eventType +`')"> Start Class</a>
                </div>
                
            </div>`;
        return html;
        }
        var html =
        `<div id="classJoinWaringDiv">
            <div id="classWaringMessage" class="full text-center my-4">
                <h5>The class is scheduled for ` + convertDatetimeWithFormat(response.classDate, response.classTimezone, USER_TIMEZONE, DISPLAY_DATE_AND_TIME) + `.</h5>
                <h5>You can start the class on ` + convertDatetimeWithFormat(response.canJoindateStart, response.classTimezone, USER_TIMEZONE, DISPLAY_DATE_AND_TIME) + `.</h5>
            </div>
            ${eventType != "BATCH"? `<div class="full"> <h5 class="text-center font-18">Student Name:&nbsp;${response.subjectName}</h5> </div>`:``}
            
            <div class="full"> <h5 class="text-center font-18">Course Name:&nbsp;${eventType != "BATCH"?`${response.className}`:`${response.subjectName}`}</h5> </div>
        </div>
        <div class="full text-right mt-3">
            <button type="button" class="btn btn-pill btn-light px-3" data-dismiss="modal">Close</button>
        </div>`;
        return html;
    }
    async function classDetailsOnModal(url, eventKind, courseId, classTitle, teacherName, classStatus, eventType, salutation) {
        //  
        try {
        const responseData = await getActualURL(url);
        if (responseData) {
            if (responseData.redirect) {
                window.open(responseData.redirectUrl, '_blank');
            }
            proceedwithControll(url, responseData, eventKind, courseId, classTitle, teacherName, classStatus, eventType, salutation);
        }
        } catch (error) {
        console.error("Failed to fetch data:", error);
        }
    }
    function getActualURL(baseUrl) {
        return new Promise(function(resolve, reject) {
        $.ajax({
            type: "GET",
            contentType: APPLICATION_JSON_VALUE,
            dataType: 'json',
            url: baseUrl,
            async: true,
            success: function(data) {
            resolve(data);
            }
        });
        });
    }

    // ── Feedback flow integration ──────────────────────────────────────────────
    // The actual feedback UI (modal, webhook, iframe) lives in feedbackStudentTeacher.js.
    // Here we only: (a) decide which events get a "Rate this class/activity" button,
    // (b) hand a compatible `info` object to those global functions, and (c) auto-open
    // feedback when a live class ends + show the bulk pending-feedback popup.

    // Cached "is this a configured feedback test user" check. Test users bypass the
    // FEEDBACK_SHOW_FROM_DATE restriction (mirrors the legacy dashboardCalendar.js gate).
    function isFeedbackTestUser() {
        if (feedbackTestUserCache !== null) {
            return feedbackTestUserCache;
        }
        try {
            var setting = getSettingsByTypeAndKey("CONFIGURATION", "USER_FOR_FEEDBACK_TEST", false);
            var ids = (getSettingMetaValue(setting) || "").split(",").map(function(id) { return id.trim(); });
            feedbackTestUserCache = ids.indexOf(String(USER_ID)) > -1;
        } catch (e) {
            feedbackTestUserCache = false;
        }
        return feedbackTestUserCache;
    }

    // Build an `info` object shaped like the one the legacy calendar passed into
    // feedbackStudentTeacher.js. `start` is a wall-clock string (no TZ offset) in the
    // student timezone because convertToUTC() parses it as such — a moment().format()
    // string carrying an offset would break its manual split.
    function buildFeedbackInfo(event) {
        return {
            id: event.id,
            eventId: event.eventId || event.id,
            eventType: event.eventType,
            eventTitle: event.eventTitle || event.title || "",
            title: event.eventTitle || event.title || "",
            category: event.category,
            start: event.localStartMoment ? event.localStartMoment.format("YYYY-MM-DDTHH:mm:ss") : event.start,
            teacherName: event.teacherName || event.origName || "",
            name: event.origName || event.teacherName || "",
            salutation: event.salutation || event.teacherSalutation || "",
            teacherSalutation: event.teacherSalutation || event.salutation || "",
            feedbackUserIdTo: event.feedbackUserIdTo,
            isFeedbackFormMapped: event.isFeedbackFormMapped,
            isFeedbackSubmitted: event.isFeedbackSubmitted,
            grade:event.grade,
            feedbackForUserRole: event.feedbackForUserRole,
            feedbackSubmittedByRole:event.feedbackSubmittedByRole,
            feedbackSubmittedBySalutation:event.feedbackSubmittedBySalutation
        };
    }

    // Whether a completed class/activity is eligible for a feedback button:
    // the backend must have mapped a feedback form, and either the user is a test
    // user or the event is on/after the configured FEEDBACK_SHOW_FROM_DATE.
    function canShowFeedbackButton(event) {
        if (event.eventKind !== "class" && event.eventKind !== "activity") {
            return false;
        }
        if (getEventStatus(event) !== "completed") {
            return false;
        }
        if (event.isFeedbackFormMapped !== "Y") {
            return false;
        }
        if (isFeedbackTestUser()) {
            return true;
        }
        var showFromDate = (typeof getFeedbackShowFromDate === "function") ? getFeedbackShowFromDate() : "";
        var eventDateText = event.localStartMoment ? event.localStartMoment.format("YYYY-MM-DD") : event.localDateKey;
        return !!(showFromDate && eventDateText && eventDateText >= showFromDate);
    }

    // "Rate this class/activity" button for the past-class details modal. Registers the
    // event in FEEDBACK_EVENT_MAP so openClassFeedbackById() (feedbackStudentTeacher.js)
    // can resolve it on click. data-dismiss closes this details modal before the feedback
    // modal opens.
    function renderModalFeedbackButton(event) {
        if (typeof openClassFeedbackById !== "function" || !canShowFeedbackButton(event)) {
            return "";
        }
        FEEDBACK_EVENT_MAP[event.id] = buildFeedbackInfo(event);
        var isActivity = event.eventKind === "activity" || String(event.id || "").toLowerCase().indexOf("activity") === 0;
        var label = isActivity ? "Rate this activity" : "Rate this class";
        return '<button id="feedbackBtn_' + escapeHtml(event.id) + '" type="button" ' +
            'class="btn btn-pill btn-primary px-3 font-weight-semi-bold mr-2" data-dismiss="modal" ' +
            'onclick="openClassFeedbackById(event, \'' + escapeHtml(event.id) + '\')">' +
            '<i class="fa fa-star-o mr-1" aria-hidden="true"></i>' + label +
            '</button>';
    }

    // Past-class details modal (see screenshot): Course / Date / Time / Teacher / Status
    // plus a "Rate this class" button. Reuses the shared #calendarActivityModal shell.
    function openPastClassModal(event) {
        var colorCode = getEventTextColor(event.eventKind, event.courseId);
        var course = studentCalendarState.courses[event.courseId];
        var courseName = (course && course.label) ? course.label
            : (event.courseName || event.subjectName || event.eventTitle || "");
        var title = event.eventTitle || event.title || courseName || "Class";

        var dateText = event.localStartMoment ? event.localStartMoment.format("MMM D, YYYY") : "";
        var timeText = "";
        var classStartTime = event.localStartMoment.format("h:mm A");
        var LatetimeText="";
        var status = getEventStatus(event);
        if (event.localStartMoment) {
            if (event.localEndMoment) {
                var mins = event.localEndMoment.diff(event.localStartMoment, "minutes");
                if (mins > 0) {
                    var hours = Math.floor(mins / 60);
                    var minutes = mins % 60;

                    if (hours > 0) {
                        timeText += hours + (hours === 1 ? " hour" : " hours");
                    }

                    if (minutes > 0) {
                        if (timeText) timeText += " ";
                        timeText += minutes + (minutes === 1 ? " min" : " mins");
                    }

                    // var hrs = Math.round((mins / 60) * 100) / 100;
                    // timeText += " (" + hrs + (hrs === 1 ? " hr" : " hrs") + ")";
                }
            }
            if (event.lateSeconds>0) {
                var totalSeconds = event.lateSeconds;
                var hours = Math.floor(totalSeconds / 3600);
                var minutes = Math.floor((totalSeconds % 3600) / 60);
                var seconds = totalSeconds % 60;
                if (hours > 0) {
                    LatetimeText += hours + (hours === 1 ? " hour" : " hours");
                }

                if (minutes > 0) {
                    if (hours > 0) LatetimeText += " ";
                    LatetimeText += minutes + (minutes === 1 ? " min" : " mins");
                }

                if (seconds > 0) {
                    if (hours > 0 || minutes > 0) LatetimeText += " ";
                    LatetimeText += seconds + (seconds === 1 ? " sec" : " secs");
                }
            }
        }

        var teacherLabel = (typeof USER_ROLE !== "undefined" && USER_ROLE === "TEACHER") ? "Student" : "Teacher";
        var teacherName = (typeof getClassFeedbackTeacherDisplay === "function")
            ? getClassFeedbackTeacherDisplay(buildFeedbackInfo(event))
            : (event.origName || event.teacherName || "");

        function row(label, value, salutation) {
            if (!value) { return ""; }
            return '<li class="d-flex flex-wrap mb-2">' +
                '<span class="text-black-80 font-weight-semi-bold font-14 pr-2 text-left" style="min-width:90px">' + escapeHtml(label) + '</span>' +
                '<span class="text-black-80 font-weight-semi-bold font-14">'+ escapeHtml(value) + '</span>' +
                '</li>';
        }
        var rateBtn = renderModalFeedbackButton(event);
        var body =
            (event.category == "BATCH" ? '<h4 class="font-weight-semi-bold mb-3 text-center" style="color:' + colorCode + '">' + event.batchName + '</h4>':'' )+
            '<h5 class="font-weight-semi-bold mb-3" style="color:' + colorCode + '">' + escapeHtml(title) + '</h5>' +
            (((event.category == "CLASS" && event.eventType == "CUSTOM") || (event.category == "CLASS" && event.eventType == "PTM")) ? '<h6 class="font-weight-semi-bold mb-3 text-dark">' + escapeHtml(event.title) + '</h6>':"")+
            
            '<ul class="full p-0 m-0 list-unstyled">' +
                // row("Course", courseName) +
                row("Date", dateText, "") +
                '<li class="d-flex flex-wrap mb-2">' +
                    '<span class="text-black-80 font-weight-semi-bold font-14 pr-2 text-left" style="min-width:90px">Status</span>' +
                    '<span class="font-14 font-weight-semi-bold">' + (getStatusLabel(status) == "PAST"?"Expired":"")+ '</span>' +
                '</li>' +
                row("Time", classStartTime, "") +
                row("Duration", timeText, "") +
                '<li class="d-flex flex-wrap mb-2">' +
                    '<span class="text-black-80 font-weight-semi-bold font-14 pr-2 text-left" style="min-width:90px">Join Status</span>' +
                    '<span class="font-14 font-weight-semi-bold" style="color:' + getDisplayStatusColor(getEventDisplayStatus(event), event.eventKind, event.courseId) + '">' + getDisplayStatusLabel(getEventDisplayStatus(event))+ '</span>' +
                '</li>' +
                (event.lateSeconds>0 ? row("Late", LatetimeText, ""):"") +
                (event.category != "BATCH" ? (teacherName && teacherName !== "Teacher" ? row(teacherLabel, teacherName, event.salutation) : "") :"") +
                
            '</ul>' +
            '<div class="full text-right mt-3">' +
                rateBtn +
                '<button type="button" class="btn btn-pill btn-light px-3" data-dismiss="modal">Close</button>' +
            '</div>';

        $("#calendarActivityModal .modal-event-border").css({ "background": colorCode });
        $("#calendarActivityWrapper").html(body);
        $("#calendarActivityModal").modal("show");
    }

    // Per-tick lifecycle check for classes AND activities (called from the active-refresh
    // interval). While an event is LIVE we only remember it — the feedback popup is NEVER
    // opened during a live event. The moment a *previously-live* event ends we:
    //   1. refresh the attendance for classes (getLiveClassAttendanceStatus),
    //   2. re-render so the tile flips to Past / Missed / Late Join, and only THEN
    //   3. evaluate + open the feedback popup (via checkClassEndedStatus).
    // Deduped per event via feedbackLiveScheduled; only events observed live this session
    // are processed, so a calendar full of already-past events never auto-pops feedback.
    function processLiveEventLifecycle() {
        var now = moment().tz(getStudentTimezone());
        studentCalendarState.filteredEvents.forEach(function(event) {
            if (event.eventKind !== "class" && event.eventKind !== "activity") {
                return;
            }
            if (event.allDay || !event.localStartMoment || !event.localEndMoment) {
                return;
            }
            if (isEventActive(event)) {
                // LIVE — remember it; never open feedback here.
                liveObservedEvents[event.id] = true;
                return;
            }
            // Only act on an event that was seen live and has since ended, exactly once.
            if (!liveObservedEvents[event.id] || feedbackLiveScheduled[event.id]) {
                return;
            }
            if (now.isBefore(event.localEndMoment)) {
                return;
            }
            feedbackLiveScheduled[event.id] = true;
            handleEventCompleted(event);
        });
    }

    // A previously-live class/activity has just ended: refresh attendance (classes only),
    // update the event so its status becomes Past / Missed / Late Join, re-render, then hand
    // off to checkClassEndedStatus (feedbackStudentTeacher.js) which applies the configured
    // delay + eligibility checks before opening classFeedbackModal.
    function handleEventCompleted(event) {
        refreshEventAttendance(event).then(function() {
            refreshUIOnly();
            if (typeof checkClassEndedStatus === "function") {
                checkClassEndedStatus(event.localEndMoment.valueOf(), buildFeedbackInfo(event), "LIVE");
            }
        });
    }

    // Fetches the freshest attendance for a completed CLASS and copies attended / onTime /
    // lateSeconds onto the event (and its miscProps self-reference) so status classification
    // and the filters see the latest values. Activities carry no attendance, so they resolve
    // immediately. Never rejects — on failure the event keeps whatever the calendar fetch
    // already provided.
    function refreshEventAttendance(event) {
        if (event.eventKind !== "class" || typeof getLiveClassAttendanceStatus !== "function") {
            return Promise.resolve();
        }
        return getLiveClassAttendanceStatus(event).then(function(details) {
            if (details) {
                event.attended = details.attended;
                event.onTime = details.onTime;
                event.lateSeconds = details.lateSeconds;
                if (event.miscProps && event.miscProps !== event) {
                    event.miscProps.attended = details.attended;
                    event.miscProps.onTime = details.onTime;
                    event.miscProps.lateSeconds = details.lateSeconds;
                }
            }
        }).catch(function() { /* keep existing attendance on failure */ });
    }

    // Bulk "Pending Feedback" popup for the previous week — only on the configured
    // day-of-week, once per page load. Mirrors the legacy calendar's separate fetch.
    function maybeShowBulkPendingFeedback() {
        if (feedbackBulkChecked || typeof showPendingFeedbackPopup !== "function" ||
            typeof shouldShowBulkFeedbackPopupToday !== "function" || typeof getPreviousWeekDateRange !== "function") {
            return;
        }
        feedbackBulkChecked = true;
        if (!shouldShowBulkFeedbackPopupToday() || !studentCalendarState.lastRequest) {
            return;
        }
        var req = studentCalendarState.lastRequest;
        var previousWeek = getPreviousWeekDateRange();
        $.ajax({
            type: "POST",
            contentType: APPLICATION_JSON_VALUE,
            url: getURLForHTML("dashboard", "school-calendar"),
            data: JSON.stringify(getRequestForNewSchoolCalendar(req.formId, req.userId, req.uniqueId, "agendaWeek", previousWeek.startDate, previousWeek.endDate)),
            dataType: "json",
            cache: false,
            timeout: 600000,
            global: false,
            success: function(data) {
                if (!data || data.status === "0" || data.status === "2" || data.status === "3") {
                    return;
                }
                // showPendingFeedbackPopup expects raw events with start times already in
                // the user timezone (like the legacy flow), so convert non-announce/holiday ones.
                var finalEvents = [];
                (data.event || []).forEach(function(obj) {
                    if (!obj || !obj.id) {
                        return;
                    }
                    if (obj.id.indexOf("announce") === 0 || obj.id.indexOf("holiday") === 0) {
                        finalEvents.push(obj);
                        return;
                    }
                    try {
                        obj.start = convertDatetimeWithFormat(obj.start, obj.timezone, USER_TIMEZONE, DATE_UTC + "T" + TIME_UTC);
                        obj.end = convertDatetimeWithFormat(obj.end, obj.timezone, USER_TIMEZONE, DATE_UTC + "T" + TIME_UTC);
                    } catch (e) { /* leave raw start/end on failure */ }
                    var baseDate = (obj.start || "").split("T")[0];
                    if (!data.holidays || $.inArray(baseDate, data.holidays) < 0) {
                        finalEvents.push(obj);
                    }
                });
                showPendingFeedbackPopup(finalEvents, "agendaWeek");
            }
        });
    }

    function openDashboardCalendarEvent(event) {
        // Completed CLASS events open a read-only details modal (with a "Rate this class"
        // button) instead of the join flow.
        if (event.eventKind === "class"  && getEventStatus(event) === "completed") {
            openPastClassModal(event);
            return;
        }
        var getColorCode = getEventTextColor(event.eventKind, event.courseId);
        $("#calendarActivityModal .modal-event-border").css({"background":getColorCode});
        if (event.category === "ASSIGNMENTS" || event.eventKind === "assignment") {
            openAssignmentModal(event);
            return;
        }
        if (event.url) {
            classDetailsOnModal(event.url, event.eventKind, event.courseId, event.title, event.name, event.classStatus, event.eventType, event.salutation);
            return;
        }
        if (event.eventKind === "holiday" || event.eventKind === "schoolEvent") {
            eventDetailsOnModal(event.id, event.eventType || event.title, event.activities || event.title);
            return;
        }
        if (event.eventKind === "activity"){
            renderViewActitifyDetails(`${event.eventId}`, '', getColorCode, event.occurrenceDate || event.localDateKey || '', event.eventKind);
            // var rateBtn = renderModalFeedbackButton(event);
            // if($("#feedbackBtn_"+event.id).length<1){
            //     $(".activity_rate_wrapper").append(rateBtn);
            // }
            $('#calendarActivityModal').on('shown.bs.modal', function () {
                var rateBtn = renderModalFeedbackButton(event);
                if ($("#feedbackBtn_" + event.id).length < 1) {
                    $(".activity_rate_wrapper .activity_close_btn").before(rateBtn);
                }
            });
        }else{
            $("#calendarActivityWrapper").html(body);
            $("#calendarActivityModal").modal("show");
        }
    }

    function openAssignmentModal(event) {
        var lms_url = $(".redirectLmsUrl").attr("changeurl");
        var getColorCode = getEventTextColor(event.eventKind, event.courseId);
        var aStatus    = getAssignmentStatus(event);
        var course     = studentCalendarState.courses[event.courseId];
        var courseName = course ? course.label : (event.courseName || event.subjectName || "");
        var dueDate    = event.dueDate
            ? moment(event.dueDate, "YYYY-MM-DD").format("MMM D, YYYY")
            : "";

        var statusColor = aStatus.status === "submitted" ? "#1b5e20"
                        : aStatus.status === "pending"   ? "#f4b400"
                        : "#1a73e8";

        var timingHtml = "";
        if (aStatus.timingLabel) {
            var tColor = aStatus.timingLabel.startsWith("Early") ? "#1b5e20"
                       : aStatus.timingLabel.startsWith("Late")  ? "#d93025"
                       : "#5f6368";
            timingHtml = `
                <li class="d-flex align-items-center mb-2">
                    <span class="text-black-80 font-weight-semi-bold font-14 pr-2 text-left" style="min-width:90px">Timing</span>
                    <span class="font-14 font-weight-semi-bold" style="color:${tColor}">
                        ${/* <span style="background:${tColor};color:#fff;font-size:11px;padding:2px 8px;border-radius:4px;margin-right:5px;">${escapeHtml(aStatus.label)}</span> */''}
                        ${escapeHtml(aStatus.timingLabel)}
                    </span>
                </li>`;
        }

        var submittedHtml = aStatus.status === "submitted" && aStatus.dateDisplay
            ? `<li class="d-flex mb-2">
                    <span class="text-black-80 font-weight-semi-bold font-14 pr-2 text-left" style="min-width:90px">Submitted</span>
                    <span class="font-14 font-weight-semi-bold">${escapeHtml(aStatus.dateDisplay)}</span>
               </li>`
            : "";

        var body = `
            <h5 class="font-weight-semi-bold mb-3" style="color:${getColorCode}">${escapeHtml(event.title)}</h5>
            <ul class="full p-0 m-0 list-unstyled">
                ${courseName ? `<li class="d-flex mb-2">
                    <span class="text-black-80 font-weight-semi-bold font-14 pr-2 text-left" style="min-width:90px">Course</span>
                    <span class="font-14 font-weight-semi-bold">${escapeHtml(courseName)}</span>
                </li>` : ""}
                ${dueDate ? `<li class="d-flex mb-2">
                    <span class="text-black-80 font-weight-semi-bold font-14 pr-2 text-left" style="min-width:90px">Due Date</span>
                    <span class="font-14 font-weight-semi-bold">${escapeHtml(dueDate)}</span>
                </li>` : ""}
                <li class="d-flex mb-2">
                    <span class="text-black-80 font-weight-semi-bold font-14 pr-2 text-left" style="min-width:90px">Status</span>
                    <span class="font-14 font-weight-semi-bold" style="color:${statusColor};">${escapeHtml(aStatus.label)}</span>
                </li>
                ${timingHtml}
                ${submittedHtml}
            </ul>
            <div class="full text-right mt-3">
                <button type="button" class="btn btn-pill btn-light px-3" data-dismiss="modal">Close</button>
                ${aStatus.label == "Pending" ? `<a href="${lms_url}" target="_blank" class="btn btn-pill btn-light px-3 text-white" style="background:${getColorCode}">Attempt</a>`:``}
            </div>`;

        $("#calendarActivityWrapper").html(body);
        $("#calendarActivityModal").modal("show");
    }

    function eventDetailsOnModal(modalId, modalTitle, activities){
        $(".calendarbox").attr('id',modalId);
        $("#"+modalId).modal("show");
        $("#calendarbox_title").html(modalTitle);
        $("#"+modalId+ " .activity_type .activity").html(activities)
    }

    function getRequestForNewSchoolCalendar(formId, userId, uniqueId, viewName, startdate, enddate) {
        if (typeof getRequestForSchoolCalendar === "function" && getRequestForSchoolCalendar !== getRequestForNewSchoolCalendar) {
            return getRequestForSchoolCalendar(formId, userId, uniqueId, viewName, startdate, enddate);
        }
        var request = {};
        request.userId = userId;
        request.schoolId = SCHOOL_ID;
        request.agenda = getBackendAgenda(viewName);
        request.startDate = startdate || moment().format("YYYY-MM-DD");
        request.endDate = enddate || request.startDate;
        request.uniqueId = uniqueId;
        return request;
    }

    // Success handler shared by the live AJAX flow and the dummy-student flow
    // (mirrors the legacy dashboardCalendar.js handleSchoolCalendarResponse), so a
    // dummy student and a real student go through identical event processing.
    function handleNewSchoolCalendarResponse(data, formId, userId, uniqueId, viewName, startdate, enddate, flag, resolve, reject) {
        console.log(data);
        if (data.status === "0" || data.status === "2") {
            showMessageTheme2(0, data.message);
            resolve([]);
            return;
        }
        if (data.status === "3") {
            redirectLoginPage();
            reject("Redirected to login");
            return;
        }
        var events = data.event || [];
        restoreFilters();
        if(events.length<1){
            $.each(data.courseDetails || [], function(i, v){
                registerCourse(getCourseId(v), getCourseLabel(v), 'class');
            });
        }
        
        // studentCalendarState.masterEvents = events.map(normalizeCalendarEvent);
        studentCalendarState.masterEvents = events.map(event =>
            normalizeCalendarEvent(event, data.courseDetails)
        );
        console.log("studentCalendarState", studentCalendarState)
        applyFilters();
        if (typeof CAN_SHOW_ENROLL_RESERVE_MODAL !== "undefined") {
            if (studentCalendarState.filteredEvents.length < 1) {
                CAN_SHOW_ENROLL_RESERVE_MODAL = true;
            } else {
                CAN_SHOW_ENROLL_RESERVE_MODAL = !checkIfAnyClassRunning(studentCalendarState.filteredEvents);
            }
        }
        renderCourseFilters();
        renderSchoolEventFilters();
        renderCategoryFilters();
        updateDatepicker();
        if (viewName === "weekDayList" || studentCalendarState.viewName === "weekDayList") {
            studentCalendarState.viewName = "weekDayList";
            renderWeekDayListView(studentCalendarState.selectedDate || startdate || moment().tz(getStudentTimezone()).format("YYYY-MM-DD"));
        } else if (isTodayView(viewName)) {
            studentCalendarState.viewName = "today";
            renderCustomTodayView();
            bindTopbarEvents();
            startActiveRefresh();
        } else if (viewName === "agendaWeek" || studentCalendarState.viewName === "agendaWeek") {
            studentCalendarState.viewName = "agendaWeek";
            renderCustomWeekView();
            bindTopbarEvents();
            startActiveRefresh();
        } else if (!studentCalendarState.calendarReady || !$(STUDENT_CALENDAR_SELECTOR).data("fullCalendar")) {
            initializeFullCalendar(studentCalendarState.filteredEvents, viewName);
        } else {
            $(STUDENT_CALENDAR_SELECTOR).fullCalendar("removeEvents");
            $(STUDENT_CALENDAR_SELECTOR).fullCalendar("addEventSource", studentCalendarState.filteredEvents);
            $(STUDENT_CALENDAR_SELECTOR).fullCalendar("rerenderEvents");
        }
        if (data.activitiesWithClass != null) {
            window.ACTIVITIES_WITH_CLASS = data.activitiesWithClass;
        }
        if (flag && typeof scrollEvent === "function") {
            scrollEvent();
        }
        // Once per page load (on the configured day), show the bulk pending-feedback popup.
        maybeShowBulkPendingFeedback();
        resolve(studentCalendarState.filteredEvents);
    }

    function callSchoolCalendarNew(formId, userId, uniqueId, viewName, startdate, enddate, flag) {
        studentCalendarState.lastRequest = {
            formId: formId,
            userId: userId,
            uniqueId: uniqueId
        };
        return new Promise(function(resolve, reject) {
            var schoolCalendarRequest = getRequestForNewSchoolCalendar(formId, userId, uniqueId, getBackendAgenda(viewName), startdate, enddate);
            if (typeof isDummyStudentMode === "function" && isDummyStudentMode() && typeof getDummyGradeKSchoolCalendarResponse === "function") {
                handleNewSchoolCalendarResponse(getDummyGradeKSchoolCalendarResponse(schoolCalendarRequest), formId, userId, uniqueId, viewName, startdate, enddate, flag, resolve, reject);
                return;
            }
            $.ajax({
                type: "POST",
                contentType: APPLICATION_JSON_VALUE,
                url: getURLForHTML("dashboard", "school-calendar"),
                data: JSON.stringify(schoolCalendarRequest),
                dataType: "json",
                cache: false,
                timeout: 600000,
                async: true,
                success: function(data) {
                    handleNewSchoolCalendarResponse(data, formId, userId, uniqueId, viewName, startdate, enddate, flag, resolve, reject);
                },
                error: function(error) {
                    reject(error);
                }
            });
        });
    }

    function getAttendanceEntityType(event) {
        if (event.entityType) {
            return event.entityType;
        }
        if (String(event.eventType || "").toUpperCase() === "BATCH") {
            return "BATCH_TEACHER_MAPPING";
        }
        return "MEETINGS";
    }

    function getUtcClassStartTime(event) {
        var classStart = event.classStartTime || event.classDate || event.occurrenceDate || event.start;
        if (!classStart) {
            return classStart;
        }
        if (moment.isMoment(classStart)) {
            return classStart.clone().utc().format(DATETIME_UTC_FORMATTER);
        }
        if (event.timezone && String(classStart).indexOf("Z") === -1 && !/[+-]\d\d:?\d\d$/.test(String(classStart))) {
            return moment.tz(String(classStart).replace("T", " "), DATETIME_UTC_FORMATTER, event.timezone).utc().format(DATETIME_UTC_FORMATTER);
        }
        return moment(classStart).utc().format(DATETIME_UTC_FORMATTER);
    }

    function getLiveClassAttendanceStatus(entityId, entityType, classDate, classStartTime) {
        if (entityId && typeof entityId === "object") {
            var event = entityId.miscProps || entityId;
            classStartTime = getUtcClassStartTime(event);
            classDate = event.classDate || event.occurrenceDate || classStartTime;
            entityType = getAttendanceEntityType(event);
            entityId = event.entityId || event.eventId || event.itemId;
        }
        var requestData = {
            entityId: entityId,
            entityType: entityType,
            classDate: classDate,
            classStartTime: classStartTime
        };
        return new Promise(function(resolve, reject) {
            $.ajax({
                type: "POST",
                contentType: APPLICATION_JSON_VALUE,
                url: getURLForHTML("dashboard", "live-class-attendance-status"),
                data: JSON.stringify(requestData),
                dataType: "json",
                cache: false,
                timeout: 600000,
                success: function(data) {
                    if (!data || data.status === "FAILED" || data.status === "EXCEPTION") {
                        reject(data);
                        return;
                    }
                    resolve(data.details);
                },
                error: function(error) {
                    reject(error);
                }
            });
        });
    }

    function initializeDashboardCalendarNew() {
        injectStyles();
        updateClock();
        if (studentCalendarState.clockTimer) {
            clearInterval(studentCalendarState.clockTimer);
        }
        studentCalendarState.clockTimer = setInterval(updateClock, 1000);
        bindFilterEvents();
        renderCategoryFilters();
        updateDatepicker();
    }

    // Public alias used by the Events-section onclick="toggleSEv()"
    window.toggleSEv = function() {
        studentCalendarState.filters.activities = !studentCalendarState.filters.activities;
        refreshUIOnly();
    };

    // applyCalendarFilters — public alias for the centralised filter engine
    window.applyCalendarFilters = function() {
        refreshUIOnly();
    };

    window.dashboardSchoolCalendarNew = function(data) {
        // The dashboard is (re)loaded via AJAX navigation (e.g. the "My Dashboard"
        // menu -> callDashboardPageSchool(...,'student-home')), which rebuilds the
        // calendar DOM but leaves the singleton studentCalendarState intact. Reset
        // the transient, DOM-bound state so the calendar re-renders from scratch
        // against the freshly created elements (datepicker rebinds, view resets to
        // Today, timers restart). User preferences (courses/filters) live in
        // localStorage and are restored separately, so they are left untouched.
        if (studentCalendarState.activeRefreshTimer) {
            clearInterval(studentCalendarState.activeRefreshTimer);
            studentCalendarState.activeRefreshTimer = null;
        }
        if (studentCalendarState.clockTimer) {
            clearInterval(studentCalendarState.clockTimer);
            studentCalendarState.clockTimer = null;
        }
        studentCalendarState.loaded = false;
        studentCalendarState.calendarReady = false;
        studentCalendarState.datepickerReady = false;
        studentCalendarState.masterEvents = [];
        studentCalendarState.filteredEvents = [];
        studentCalendarState.viewName = "today";
        studentCalendarState.selectedDate = null;
        studentCalendarState.suppressDatepickerEvent = false;
        // Reset per-session feedback lifecycle tracking so a fresh dashboard load can
        // re-observe live events and fire the post-event feedback flow again.
        liveObservedEvents = {};
        feedbackLiveScheduled = {};
        feedbackBulkChecked = false;
        injectStyles();
        setTimeout(initializeDashboardCalendarNew, 0);
        return buildStudentCalendarShell(data || {});
    };
    window.callSchoolCalendar = callSchoolCalendarNew;
    window.calendarRequestByFilter = function(src) {
        var category = $(src).attr("data-category");
        if (category === "CLASS") {
            studentCalendarState.filters.classes = true;
            studentCalendarState.filters.activities = false;
        } else if (category === "ACTIVITY") {
            studentCalendarState.filters.classes = false;
            studentCalendarState.filters.activities = true;
        } else {
            studentCalendarState.filters.classes = true;
            studentCalendarState.filters.activities = true;
        }
        $(".calendar_request_button").removeClass("active_calendar_catergory");
        $(src).addClass("active_calendar_catergory");
        refreshUIOnly();
    };
    window.dashboardCalendarNewState = studentCalendarState;

    // Expose all internal (private) functions globally so they can be
    // reused from other JS files (e.g. activityContent.js).
    var __dashboardCalendarInternals = {
        getStudentTimezone: getStudentTimezone,
        isTodayView: isTodayView,
        getBackendAgenda: getBackendAgenda,
        escapeHtml: escapeHtml,
        safeId: safeId,
        loadStoredState: loadStoredState,
        saveStoredState: saveStoredState,
        hexToRgb: hexToRgb,
        colorWithAlpha: colorWithAlpha,
        getCourseColor: getCourseColor,
        normalizeEventType: normalizeEventType,
        getCourseId: getCourseId,
        getCourseLabel: getCourseLabel,
        normalizeDateTime: normalizeDateTime,
        normalizeCalendarEvent: normalizeCalendarEvent,
        buildEventClassNames: buildEventClassNames,
        registerCourse: registerCourse,
        getEventBorder: getEventBorder,
        getEventBackground: getEventBackground,
        getEventTextColor: getEventTextColor,
        restoreFilters: restoreFilters,
        getAssignmentStatus: getAssignmentStatus,
        applyFilters: applyFilters,
        isEventActive: isEventActive,
        getEventStatus: getEventStatus,
        getStatusLabel: getStatusLabel,
        isTimedEvent: isTimedEvent,
        getTodayEventSortValue: getTodayEventSortValue,
        getEventSubtitle: getEventSubtitle,
        groupEventsByLocalDate: groupEventsByLocalDate,
        getTodayGroups: getTodayGroups,
        buildStudentCalendarShell: buildStudentCalendarShell,
        injectStyles: injectStyles,
        updateClock: updateClock,
        renderCourseFilters: renderCourseFilters,
        renderSchoolEventFilters: renderSchoolEventFilters,
        renderCategoryFilters: renderCategoryFilters,
        renderFilterRows: renderFilterRows,
        renderTodaySummary: renderTodaySummary,
        renderCustomTodayView: renderCustomTodayView,
        renderCustomWeekView: renderCustomWeekView,
        renderWeekDayListView: renderWeekDayListView,
        renderCustomTodayEvent: renderCustomTodayEvent,
        eventDateMap: eventDateMap,
        updateDatepicker: updateDatepicker,
        refreshUIOnly: refreshUIOnly,
        updateCalendarTitle: updateCalendarTitle,
        getWeekRangeTitle: getWeekRangeTitle,
        refreshCalendarFromCurrentView: refreshCalendarFromCurrentView,
        initializeFullCalendar: initializeFullCalendar,
        handleEventLimitClick: handleEventLimitClick,
        renderDashboardCalendarEvent: renderDashboardCalendarEvent,
        markActiveEvents: markActiveEvents,
        startActiveRefresh: startActiveRefresh,
        bindTopbarEvents: bindTopbarEvents,
        bindWeekHeaderDrilldown: bindWeekHeaderDrilldown,
        renderWeekHeaderDates: renderWeekHeaderDates,
        bindFilterEvents: bindFilterEvents,
        proceedwithControll: proceedwithControll,
        calendarMeetingLinkValidateStudent: calendarMeetingLinkValidateStudent,
        calendarMeetingLinkValidateTeacher: calendarMeetingLinkValidateTeacher,
        getActualURL: getActualURL,
        openDashboardCalendarEvent: openDashboardCalendarEvent,
        openAssignmentModal: openAssignmentModal,
        eventDetailsOnModal: eventDetailsOnModal,
        getRequestForNewSchoolCalendar: getRequestForNewSchoolCalendar,
        callSchoolCalendarNew: callSchoolCalendarNew,
        getLiveClassAttendanceStatus: getLiveClassAttendanceStatus,
        initializeDashboardCalendarNew: initializeDashboardCalendarNew
    };
    // Grouped namespace access: window.dashboardCalendarNew.<fnName>(...)
    window.dashboardCalendarNew = __dashboardCalendarInternals;
    // Flat global access: <fnName>(...) from any file
    Object.keys(__dashboardCalendarInternals).forEach(function(fnName) {
        if (typeof window[fnName] === "undefined") {
            window[fnName] = __dashboardCalendarInternals[fnName];
        }
    });
})(window, jQuery);


function todayDate() {
    var d = new Date($("#currentTimeForUser").text());
    var day = d.getDate();
    var month = d.getMonth() + 1;
    var year = d.getFullYear();
    if (day < 10) { day = "0" + day; }
    if (month < 10) { month = "0" + month; }
    return year + "-" + month + "-" + day;
}

function checkIfAnyClassRunning(todayClassArray) {
    var currentTime = new Date($("#currentTimeForUser").text());
    var currentMs = currentTime.getTime();
    for (var i = 0; i < todayClassArray.length; i++) {
        var startTime = new Date(todayClassArray[i].start).getTime();
        var endTime = new Date(todayClassArray[i].end).getTime();
        if (currentMs >= startTime && currentMs <= endTime) {
            return true;
        }
    }
    return false;
}

var scrollEventInterval = null;
function scrollEvent() {
    if (scrollEventInterval) {
        clearInterval(scrollEventInterval);
        scrollEventInterval = null;
    }
    scrollEventInterval = setInterval(function () {
        var calendarContainer = $(window).width() <= 767
            ? $('.fc-list-view .fc-scroller')
            : $('.fc-scroller.fc-time-grid-container');

        var target;
        if ($(".live-class-blink:visible").length > 0) {
            target = $(".live-class-blink:visible").first();
        } else if ($(".upcoming-class-blink:visible").length > 0) {
            target = $(".upcoming-class-blink:visible").first();
        } else if ($(".future-class:visible").length > 0) {
            if (typeof USER_ROLE !== "undefined" && USER_ROLE == "STUDENT" && $(".future-class:visible").hasClass("SYS-TRAINING")) {
                target = $(".fc-event-container .SYS-TRAINING.future-class").first();
            } else {
                var category = $(".active_calendar_catergory").attr("data-category");
                target = $(".fc-event-container ." + category + ".future-class").first();
            }
        } else {
            target = $(".fc-event-container .past-class").first();
        }

        if (target && target.length > 0 && calendarContainer.length) {
            calendarContainer.animate({ scrollTop: target.position().top }, 700);
            clearInterval(scrollEventInterval);
        }
    }, 1500);
}

function callTeacherLastAttendance(formId, userId, startdate, enddate) {
	//console.log('callTeacherLastAttendance');
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLForHTML('dashboard', 'teacher-last-class'),
		data : JSON.stringify(getRequestForTeacherLastclass(formId, userId,startdate, enddate)),
		dataType : 'json',
		async : true,
		success : function(data) {
		if (data['status'] == '0' || data['status'] == '2') {
			//showMessageTheme2(0, data['message']);
			} else {
			// console.log(data['teacherClass']['teacheClassList']);
			var classlist = data['teacherClass']['teacheClassList'];
			if(classlist!=null){
				var tblHtml='';
				var int=1;
				tblHtml+='<table class="table table-bordered responsive nowrap"><thead><th>sr no.</th><th>Grade</th><th>Duration</th></thead>';
				tblHtml+='<tbody>';
				for(t=0;t<classlist.length;t++){
					tblHtml+='<tr>';
					tblHtml+='<td>'+(int++)+'</td>';
					tblHtml+='<td>'+classlist[t]['standard']+'</td>';
					tblHtml+='<td class="text-center">'+classlist[t]['jobSpentTime']+'</td>';
					tblHtml+='</tr>';
				}
					
				tblHtml+='</tbody>';
				tblHtml+='<tfoot><tr><th></th><th></th><th class="text-center">Total Duration - '+ data['teacherClass']['totaltime']+'</th></tr></tfoot>';
				tblHtml+='</table>';

				$('#mteacherLastClass').html(tblHtml);
				$('#modalTeacherClass').modal('show');
				window.setTimeout(function(){$('#modalTeacherClass').modal('hide');;},8000);
			}
			}
		}
	});
}

function getRequestForTeacherLastclass(formId, userId, startdate, enddate) {
	var monthdate = startAndEndOfMonth();
	if(startdate=='' || startdate==undefined){
        startdate = monthdate[0];
    }
    if(enddate=='' || enddate==undefined){
        enddate = monthdate[1];
    }
    var schoolCalendarRequestDTO = {};
    schoolCalendarRequestDTO['userId'] =userId;
    schoolCalendarRequestDTO['schoolId'] = SCHOOL_ID;
    schoolCalendarRequestDTO['startDate']=startdate;
    schoolCalendarRequestDTO['endDate']=enddate;
    return schoolCalendarRequestDTO;
}

function getNeedAnyHelpForTeacher(userId) {
    var postData = {};
    postData['userId'] = userId;
    $.ajax({
        type: "POST",
        contentType: APPLICATION_JSON_VALUE,
        url: getURLForHTML('dashboard', 'need-any-help-teacher'),
        data: JSON.stringify(postData),
        dataType: 'json',
        success: function (data) {
            if (data.status == '0' || data.status == '2' || data.status == '3') {
                if (data.status == '3') { redirectLoginPage(); }
                $('.reserve-seat-wrapper').hide();
            } else {
                if (data.eligible == "Y") {
                    if ($("body #need-help-slide-wrapper").length == 0) {
                        $("body").append(getNeedAnyHelpHtml(data.standardId));
                    }
                    setTimeout(function () {
                        needHelpContentShowTeacher(true);
                        setTimeout(function () {
                            needHelpContentShowTeacher(false);
                        }, data.durationTime * 1000);
                        setInterval(function () {
                            needHelpContentShowTeacher(true);
                            setTimeout(function () {
                                needHelpContentShowTeacher(false);
                            }, data.durationTime * 1000);
                        }, (data.timeInterval * 1000 * 60) + (data.durationTime * 1000));
                    }, data.durationTime * 1000);
                }
            }
        }
    });
}

function needHelpContentShowTeacher(needShow) {
    if (needShow) {
        $(".reserve-seat-btn").addClass("slide-out-btn");
        $(".need-help-slide-wrapper").show();
        $(".need-help-slide-wrapper").addClass("slide-in");
        $(".reserve-seat-slide-wrapper").removeClass("slide-in");
    } else {
        $(".need-help-slide-wrapper").removeClass("slide-in");
    }
}

function startAndEndOfWeek(date) {
    var now = date ? new Date(date) : new Date();
    now.setHours(0, 0, 0, 0);
    var sunday = new Date(now);
    sunday.setDate(sunday.getDate() - sunday.getDay());
    var startDate = (sunday.getFullYear() + "-" + ((sunday.getMonth() > 8) ? (sunday.getMonth() + 1) : ('0' + (sunday.getMonth() + 1))) + "-" + ((sunday.getDate() > 9) ? sunday.getDate() : ('0' + sunday.getDate())));
    var saturday = new Date(now);
    saturday.setDate(saturday.getDate() - saturday.getDay() + 6);
    var endDate = (saturday.getFullYear() + "-" + ((saturday.getMonth() > 8) ? (saturday.getMonth() + 1) : ('0' + (saturday.getMonth() + 1))) + "-" + ((saturday.getDate() > 9) ? saturday.getDate() : ('0' + saturday.getDate())));
    return [startDate, endDate];
}

function startAndEndOfMonth(date) {
    var now = date ? new Date(date) : new Date();
    now.setHours(0, 0, 0, 0);
    var firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    var startDate = (firstDay.getFullYear() + "-" + ((firstDay.getMonth() > 8) ? (firstDay.getMonth() + 1) : ('0' + (firstDay.getMonth() + 1))) + "-" + ((firstDay.getDate() > 9) ? firstDay.getDate() : ('0' + firstDay.getDate())));
    var lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    var endDate = (lastDay.getFullYear() + "-" + ((lastDay.getMonth() > 8) ? (lastDay.getMonth() + 1) : ('0' + (lastDay.getMonth() + 1))) + "-" + ((lastDay.getDate() > 9) ? lastDay.getDate() : ('0' + lastDay.getDate())));
    return [startDate, endDate];
}


function calendarMeetingLinkValidate(){
	var html =
	    `<div class="calendarClassDetails modal fade" id="classJoinInSameWindowModal" tabindex="-1" role="dialog" aria-labelledby="classJoinInSameWindowModalLabel" aria-hidden="true">
			<div class="modal-dialog modal-lg modal-dialog-centered box-shadow-none" style="max-width:420px">
				<div class="modal-content rounded-15 overflow-hidden">
					<div class="py-1 modal-event-border"></div>
					<div id="classJoinInSameWindowBody" class="modal-body py-4"></div>
				</div>
			</div>
		</div>`;
  	return html;
}


function getTime(date_and_time){
    var time = new Date(date_and_time.replace(" ", "T")).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true
    });
    return time;
}
