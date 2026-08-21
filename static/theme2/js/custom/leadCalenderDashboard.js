// ─────────────────────────────────────────────────────────────────────────
// Lead & Demo Calendar Dashboard
// Same visual design as the "dashboard-today-view" calendar (dashboardCalendarNew.js)
// but the data source is /dashboard/school-demo-list (studentEnrolledList — lead demo
// meetings), so this is a fully self-contained module: its own state, its own scoped
// CSS ("lead-cal-" prefixed classes so it never collides with the student/teacher
// calendar when both scripts happen to be loaded on the same page), its own fetch.
// ─────────────────────────────────────────────────────────────────────────
(function(window, $) {
    "use strict";

    var LEAD_CAL_SELECTOR = "#leadCalendarBody";
    var LEAD_CAL_CONTAINER = "#leadCalendarDashboardContainer";

    var leadCalendarState = {
        loaded: false,
        masterMeetings: [],
        filteredMeetings: [],
        filters: {
            completed: true,
            noShow: true,
            pending: true,
            cancelled: true,
            reschedule: true,
            confirmed: true,
            notConfirmed: true
        },
        selectedDate: null,
        viewName: "today", // "today" | "week" | "month"
        // Counselor join-window buffers (minutes), read off the /dashboard/school-demo-list
        // response itself (same value for every row — see StudentEnrolledStatusResponse
        // .pastClassBufferCounselor / .futureClassBufferCounselor, backed by the CONFIGURATION
        // settings PAST_CLASS_X_AMOUNT_BUFFER_COUNSELOR / FUTURE_CLASS_X_AMOUNT_BUFFER_COUNSELOR).
        // Default 0 mirrors the backend's own fallback (getSettingValueByTypeAndKeyAsInt(..., 0)).
        pastClassBufferCounselor: 0,
        futureClassBufferCounselor: 0,
        datepickerReady: false,
        suppressDatepickerEvent: false,
        clockTimer: null,
        activeRefreshTimer: null,
        lastLiveKey: "",
        // Raw, as-is /timeavailability/get-slots-to-book-event response for the currently fetched
        // date — normalized "available to book" slots (userId:null -> every counselor), shown on
        // the calendar alongside the /dashboard/school-demo-list meetings, not filtered further.
        availableSlots: [],
        // ADMIN-DASHBOARD-SPACIAL-RIGHTS flag off the latest /timeavailability/get-slots-to-book-event
        // response (same flag as each meeting's .searchUser — see isMyMeeting). false means that
        // response was built across EVERY counselor, so getAvailableSlotsForSelectedDate() merges
        // same-time slots into one card listing every counselor instead of one card per counselor.
        // Defaults to true (today's existing per-counselor behaviour) until a response says otherwise.
        slotsSearchUser: true,
        // Set once the first /dashboard/school-demo-list or /timeavailability/get-slots-to-book-event
        // response comes back with searchUser === false (backend couldn't filter to just this
        // counselor). Once set, fetchAndRenderLeadCalendar skips calling BOTH APIs on every later
        // navigation (prev/next/today/week/month/date-picker) instead of re-hitting them just to
        // hide the widget again — see the early-exit guard at the top of that function.
        hiddenForNonSearchUser: false
    };

    // How often to check for a live-status change (a demo starting/ending) while the
    // clock pill ticks — mirrors dashboardCalendarNew.js's ACTIVE_REFRESH_MS.
    var ACTIVE_REFRESH_MS = 1000;

    // Status metadata — every meetingStatus value seen from /dashboard/school-demo-list
    // is normalised into one of these keys so filters/legend/badges stay consistent.
    var STATUS_META = {
        completed:    { label: "Completed",         color: "#1b5e20" },
        noShow:       { label: "No Show",           color: "#d93025" },
        pending:      { label: "No Status",         color: "#1a73e8" },
        cancelled:    { label: "Cancelled",         color: "#5f6368" },
        reschedule:   { label: "Reschedule",        color: "#ff6d00" },
        confirmed:    { label: "Demo Confirmed",    color: "#0d2a64" },
        notConfirmed: { label: "Demo Not Confirmed", color: "#6f42c1" }
    };

    function getLeadTimezone() {
        if (typeof USER_TIMEZONE !== "undefined" && USER_TIMEZONE) {
            return USER_TIMEZONE;
        }
        if (window.Intl && Intl.DateTimeFormat) {
            return Intl.DateTimeFormat().resolvedOptions().timeZone;
        }
        return moment.tz.guess();
    }

    function escapeHtml(value) {
        return $("<div>").text(value == null ? "" : value).html();
    }

    function getMeetingStatusKey(item) {
        var status = String(item.meetingStatus || "").toUpperCase();
        if (status === "COMPLETED") { return "completed"; }
        if (status === "NOTATTENDED") { return "noShow"; }
        if (status === "CANCELLED") { return "cancelled"; }
        if (status === "RESCHEDULE") { return "reschedule"; }
        if (status === "DEMO CONFIRMED") { return "confirmed"; }
        if (status === "DEMO NOT CONFIRMED") { return "notConfirmed"; }
        return "pending"; // PENDING / anything unrecognised
    }

    // Coerces a backend buffer value to a valid non-negative minute count, defaulting to 0
    // (no restriction) for missing/null/invalid input — mirroring the backend's own fallback
    // (commonUtil.getSettingValueByTypeAndKeyAsInt(..., 0)) rather than inventing a new default.
    function toValidMinutes(value) {
        var n = Number(value);
        return (value != null && !isNaN(n) && n >= 0) ? n : 0;
    }

    // Counselor join window for a meeting: [demoStartTime - pastBuffer, demoEndTime + futureBuffer].
    // Spans the FULL scheduled duration (not just the start instant) so a demo stays "live" for its
    // entire run, plus the configured grace period on either side. Falls back to start-only (as an
    // end) when the demo has no parseable end time. moment's add/subtract normalise across midnight/
    // hour boundaries on their own, so no special-casing is needed for a buffer that crosses one.
    function getJoinWindow(meeting) {
        if (!meeting.localStartMoment) { return null; }
        var end = meeting.localEndMoment || meeting.localStartMoment;
        return {
            start: meeting.localStartMoment.clone().subtract(leadCalendarState.pastClassBufferCounselor, "minutes"),
            end: end.clone().add(leadCalendarState.futureClassBufferCounselor, "minutes")
        };
    }

    // "live"    -> now is inside [demoStartTime - pastBuffer, demoEndTime + futureBuffer] -> counselor
    //              can join now (drives the join-modal routing on card click — NOT the LIVE badge,
    //              see isMeetingActive() below).
    // "upcoming"-> now is before that window opens -> too early to join.
    // "past"    -> now is after that window closes, or the meeting has no parseable start time.
    function getJoinability(meeting) {
        var window = getJoinWindow(meeting);
        if (!window) { return "past"; }
        var now = moment().tz(getLeadTimezone());
        if (now.isBefore(window.start)) { return "upcoming"; }
        if (now.isAfter(window.end)) { return "past"; }
        return "live";
    }

    // LIVE badge check — strictly the ACTUAL scheduled window [demoStartTime, demoEndTime), with NO
    // buffer applied. The pastBuffer/futureBuffer only extend the counselor's ability to *join*
    // (getJoinability, used by the click handler / modal) — they must not make the badge itself
    // appear early or linger late.
    function isMeetingActive(meeting) {
        // A cancelled demo is never "live" even if now falls inside its old scheduled window.
        if (meeting.statusKey === "cancelled") { return false; }
        if (!meeting.localStartMoment || !meeting.localEndMoment) { return false; }
        var now = moment().tz(getLeadTimezone());
        return now.isSameOrAfter(meeting.localStartMoment) && now.isBefore(meeting.localEndMoment);
    }

    // Comma-joined key of every currently-live meeting id — same trick as
    // dashboardCalendarNew.js's getLiveEventKey(): only re-render when the live set actually
    // changes, instead of re-rendering every second.
    function getLiveMeetingKey() {
        var liveIds = [];
        leadCalendarState.filteredMeetings.forEach(function(meeting) {
            if (isMeetingActive(meeting)) {
                liveIds.push(meeting.id);
            }
        });
        return liveIds.sort().join(",");
    }

    // Scrolls a demo's card into view in the "today" list — used both by the sidebar summary click
    // (below, in bindLeadCalendarEvents) and automatically the moment a demo goes live.
    function scrollToMeetingCard(meetingId) {
        var card = $("[data-lead-meeting-id='" + meetingId + "']").get(0);
        if (card) { card.scrollIntoView({ behavior: "smooth", block: "center" }); }
    }

    // Ticks once a second (piggy-backing on the clock pill) and re-renders the current view
    // — via the cheap, no-fetch refreshUIOnly() — the moment a demo crosses into or out of its
    // [demoStartTime, demoEndTime) window, so the LIVE badge shows up automatically.
    function startActiveRefresh() {
        if (leadCalendarState.activeRefreshTimer) {
            clearInterval(leadCalendarState.activeRefreshTimer);
        }
        leadCalendarState.lastLiveKey = getLiveMeetingKey();
        // A demo can already be live the moment this view loads/refetches (e.g. it went live before
        // the page opened, or before the counselor switched back to "Today") — not just when it
        // transitions to live mid-session. Jump straight to it here too, same as the "just went
        // live" case in the interval below.
        if (leadCalendarState.lastLiveKey && leadCalendarState.viewName === "today") {
            scrollToMeetingCard(leadCalendarState.lastLiveKey.split(",")[0]);
        }
        leadCalendarState.activeRefreshTimer = setInterval(function() {
            var liveKey = getLiveMeetingKey();
            if (liveKey === leadCalendarState.lastLiveKey) {
                return;
            }
            var previousLiveIds = leadCalendarState.lastLiveKey ? leadCalendarState.lastLiveKey.split(",") : [];
            var currentLiveIds = liveKey ? liveKey.split(",") : [];
            // The id(s) that just went live this tick (present now, weren't a moment ago) — i.e. a
            // demo starting right now, not one that was already live before this refresh cycle.
            var newlyLiveIds = currentLiveIds.filter(function(id) { return previousLiveIds.indexOf(id) === -1; });
            leadCalendarState.lastLiveKey = liveKey;
            refreshUIOnly();
            // Only auto-scroll on the "today" list view (week/month cards use a different, more
            // compact layout that a mid-page scroll wouldn't help with), and only for the FIRST
            // newly-live demo — if several start in the same tick, jumping between them would be
            // more disorienting than useful.
            if (newlyLiveIds.length && leadCalendarState.viewName === "today") {
                scrollToMeetingCard(newlyLiveIds[0]);
            }
        }, ACTIVE_REFRESH_MS);
    }

    function normalizeMeeting(item) {
        var tz = getLeadTimezone();
        var startMoment = (item.demoDate && item.demoStartTime)
            ? moment.tz(item.demoDate + " " + item.demoStartTime, "ddd D MMM, YYYY hh:mm A", tz)
            : null;
        var endMoment = (item.demoDate && item.demoEndTime)
            ? moment.tz(item.demoDate + " " + item.demoEndTime, "ddd D MMM, YYYY hh:mm A", tz)
            : null;
        if (startMoment && !startMoment.isValid()) { startMoment = null; }
        if (endMoment && !endMoment.isValid()) { endMoment = null; }

        var statusKey = getMeetingStatusKey(item);
        var meta = STATUS_META[statusKey];
        var joinList = item.meetingJoinTimeList || [];
        var hostJoins = joinList.filter(function(j) { return j.joinType === "host"; }).length;
        var attendeeJoins = joinList.filter(function(j) { return j.joinType === "attendee"; }).length;

        return $.extend({}, item, {
            id: item.meetingId,
            localStartMoment: startMoment,
            localEndMoment: endMoment,
            localDateKey: startMoment ? startMoment.format("YYYY-MM-DD") : "",
            displayTime: startMoment && endMoment ? startMoment.format("hh:mm A") + " - " + endMoment.format("hh:mm A") : "",
            statusKey: statusKey,
            statusLabel: item.leadStatus || meta.label,
            statusColor: meta.color,
            title: item.meetingPersoneName || item.email || "Lead",
            hostJoins: hostJoins,
            attendeeJoins: attendeeJoins
        });
    }

    // Normalizes one raw slot from /timeavailability/get-slots-to-book-event's "slotList" (a flat
    // array here — see fetchAndRenderLeadCalendar, which flattens the API's array-of-arrays) into
    // the shape renderAvailableSlotCard()/groupBySelectedDate-style filtering expects. Shown as-is,
    // no filtering beyond picking the fields needed to place it on the calendar.
    function normalizeAvailableSlot(item) {
        var tz = getLeadTimezone();
        var startMoment = (item.meetDate && item.startTime)
            ? moment.tz(item.meetDate + " " + item.startTime, "YYYY-MM-DD hh:mm A", tz)
            : null;
        var endMoment = (item.meetEndDate && item.endTime)
            ? moment.tz(item.meetEndDate + " " + item.endTime, "YYYY-MM-DD hh:mm A", tz)
            : null;
        if (startMoment && !startMoment.isValid()) { startMoment = null; }
        if (endMoment && !endMoment.isValid()) { endMoment = null; }
        return $.extend({}, item, {
            id: "slot-" + (item.meetingDateId || "") + "-" + (item.adminUserId || ""),
            localStartMoment: startMoment,
            localEndMoment: endMoment,
            localDateKey: startMoment ? startMoment.format("YYYY-MM-DD") : "",
            displayTime: startMoment && endMoment ? startMoment.format("hh:mm A") + " - " + endMoment.format("hh:mm A") : "",
            counselorName: String(item.counselorName || "").trim()
        });
    }

    // Client-side safety net for "only my leads": /dashboard/school-demo-list's response is shown
    // as-is otherwise (no other filtering) — this only decides ownership. If item.userId matches the
    // logged-in USER_ID, it's mine. If it DOESN'T match (or is missing), don't exclude it outright —
    // also check assignName against USER_FULL_NAME before hiding it, since the userId on some rows
    // may not have resolved correctly server-side.
    function isMyMeeting(item) {
        // searchUser === false means the backend already returned every counselor's data
        // (ADMIN-DASHBOARD-SPACIAL-RIGHTS, see ReportUtil.getReportTotalSchoolDemo) — don't narrow
        // that down to "my meetings" client-side, show it all as-is. searchUser === true means the
        // backend already filtered to the logged-in counselor, so this ownership check still applies
        // as an extra safety net (behaviour unchanged in that case).
        if (item.searchUser === false) { return true; }
        var userIdMatches = item.userId != null && typeof USER_ID !== "undefined" && USER_ID != null
            && Number(item.userId) === Number(USER_ID);
        if (userIdMatches) { return true; }
        if (typeof USER_FULL_NAME !== "undefined" && USER_FULL_NAME) {
            return String(item.assignName || "").trim().toLowerCase() === String(USER_FULL_NAME).trim().toLowerCase();
        }
        // Can't determine ownership (userId didn't match/was missing, no USER_FULL_NAME to fall
        // back on) — don't hide data outright.
        return true;
    }

    function applyFilters() {
        leadCalendarState.filteredMeetings = leadCalendarState.masterMeetings.filter(function(meeting) {
            return leadCalendarState.filters[meeting.statusKey] !== false;
        });
    }

    function groupBySelectedDate() {
        var selectedKey = leadCalendarState.selectedDate || moment().tz(getLeadTimezone()).format("YYYY-MM-DD");
        var meetings = leadCalendarState.filteredMeetings.filter(function(meeting) {
            return meeting.localDateKey === selectedKey;
        });
        meetings.sort(function(left, right) {
            var l = left.localStartMoment ? left.localStartMoment.valueOf() : Number.MAX_SAFE_INTEGER;
            var r = right.localStartMoment ? right.localStartMoment.valueOf() : Number.MAX_SAFE_INTEGER;
            return l - r;
        });
        return meetings;
    }

    // Available-to-book slots (from /timeavailability/get-slots-to-book-event, fetched once per day
    // across the active view's range — see fetchAndRenderLeadCalendar) for one particular
    // "YYYY-MM-DD" date, shown as-is alongside the demo meetings — no status/ownership filtering.
    // Shared by the "today" list (getAvailableSlotsForSelectedDate) and the week/month grids, which
    // look this up per day cell.
    function getMergedAvailableSlotsForDateKey(dateKey) {
        var slots = leadCalendarState.availableSlots.filter(function(slot) {
            return slot.localDateKey === dateKey;
        });
        // searchUser === false -> this response was built across every counselor (see slotsSearchUser),
        // so the same time slot shows up once per counselor — collapse those into a single card per
        // time slot, with every counselor's name comma-separated, instead of one block each.
        // searchUser === true -> left exactly as-is (a counselor only ever sees their own slots there).
        if (leadCalendarState.slotsSearchUser === false) {
            var mergedByTime = {};
            var mergedOrder = [];
            slots.forEach(function(slot) {
                var timeKey = (slot.localStartMoment ? slot.localStartMoment.valueOf() : slot.displayTime) + "|" +
                    (slot.localEndMoment ? slot.localEndMoment.valueOf() : "");
                if (!mergedByTime[timeKey]) {
                    mergedByTime[timeKey] = $.extend({}, slot, { counselorNames: [] });
                    mergedOrder.push(mergedByTime[timeKey]);
                }
                if (slot.counselorName && mergedByTime[timeKey].counselorNames.indexOf(slot.counselorName) === -1) {
                    mergedByTime[timeKey].counselorNames.push(slot.counselorName);
                }
            });
            slots = mergedOrder.map(function(merged) {
                return $.extend({}, merged, { counselorName: merged.counselorNames.join(", ") });
            });
        }
        slots.sort(function(left, right) {
            var l = left.localStartMoment ? left.localStartMoment.valueOf() : Number.MAX_SAFE_INTEGER;
            var r = right.localStartMoment ? right.localStartMoment.valueOf() : Number.MAX_SAFE_INTEGER;
            return l - r;
        });
        return slots;
    }

    function getAvailableSlotsForSelectedDate() {
        var selectedKey = leadCalendarState.selectedDate || moment().tz(getLeadTimezone()).format("YYYY-MM-DD");
        return getMergedAvailableSlotsForDateKey(selectedKey);
    }

    function getTodaySummaryGroups() {
        var todayKey = moment().tz(getLeadTimezone()).format("YYYY-MM-DD");
        var groups = { live: [], upcoming: [], completed: [] };
        var now = moment().tz(getLeadTimezone());
        leadCalendarState.filteredMeetings.forEach(function(meeting) {
            if (meeting.localDateKey !== todayKey || !meeting.localStartMoment) { return; }
            // isMeetingActive() also excludes cancelled demos, so a cancelled demo never lands in
            // the "Live Demo" sidebar list even if another (non-cancelled) demo at the same time does.
            if (isMeetingActive(meeting)) {
                groups.live.push(meeting);
            } else if (now.isBefore(meeting.localStartMoment)) {
                groups.upcoming.push(meeting);
            } else {
                groups.completed.push(meeting);
            }
        });
        Object.keys(groups).forEach(function(key) {
            groups[key].sort(function(l, r) { return l.localStartMoment.valueOf() - r.localStartMoment.valueOf(); });
        });
        return groups;
    }

    function eventDateMap() {
        var dateMap = {};
        leadCalendarState.filteredMeetings.forEach(function(meeting) {
            if (meeting.localDateKey) { dateMap[meeting.localDateKey] = true; }
        });
        return dateMap;
    }

    // ── Shell markup (mirrors dashboard-calendar-new but scoped under lead-cal-*) ──
    function buildLeadCalendarShell() {
        var timezone = getLeadTimezone();
        return `
            <div class="main-card mb-3">
                <div class="full">
                    <div class="card rounded-15 lead-cal-card">
                        <div class="card-body p-0">
                            <div class="lead-cal-new">
                                <div class="lead-cal-topbar">
                                    <div class="lead-cal-clock-pill" id="leadCalendarClockPill">
                                        <span class="tz">${escapeHtml(timezone)}</span>
                                        <span class="ct font-weight-semi-bold text-dark" id="leadCalendarLiveClock">--:--:-- --</span>
                                    </div>
                                    <div class="lead-cal-nav-pill">
                                        <button type="button" id="leadCalendarPrev" aria-label="Previous">&lsaquo;</button>
                                        <span class="lead-cal-nav-view-label">Day</span>
                                        <button type="button" id="leadCalendarNext" aria-label="Next">&rsaquo;</button>
                                    </div>
                                    <span class="lead-cal-topbar-month" id="leadCalendarTitle"></span>
                                    <div class="lead-cal-spacer"></div>
                                    <div class="lead-cal-view-pill">
                                        <button type="button" class="lead-cal-vp-btn active" data-lead-view="today">Today</button>
                                        <button type="button" class="lead-cal-vp-btn" data-lead-view="week">Week</button>
                                        <button type="button" class="lead-cal-vp-btn" data-lead-view="month">Month</button>
                                    </div>
                                </div>
                                <div class="lead-cal-legend-strip">
                                    <div class="mx-auto d-inline-flex align-items-center gap-10 flex-wrap">
                                        <span>Legend:</span>
                                        ${Object.keys(STATUS_META).map(function(key) {
                                            var meta = STATUS_META[key];
                                            return `<div class="lead-cal-leg-item" style="color:${meta.color};"><div class="lead-cal-leg-box" style="border-color:${meta.color};"></div>${meta.label}</div>`;
                                        }).join("")}
                                        <div class="lead-cal-leg-item" style="color:${AVAILABLE_SLOT_COLOR};"><div class="lead-cal-leg-box" style="border-color:${AVAILABLE_SLOT_COLOR};"></div>Available Slot</div>
                                    </div>
                                </div>
                                <div class="lead-cal-layout">
                                    <aside class="lead-cal-sidebar">
                                        <div class="lead-cal-datepicker" id="leadCalendarDatepicker"></div>
                                        <div class="lead-cal-sb-divider"></div>
                                        <div class="lead-cal-sb-section">
                                            <h5>Today</h5>
                                            <div id="leadCalendarTodaySummary"></div>
                                        </div>
                                        <div class="lead-cal-sb-divider"></div>
                                        <div class="lead-cal-sb-section">
                                            <h5>Demo Status</h5>
                                            <div id="leadCalendarStatusFilters"></div>
                                        </div>
                                    </aside>
                                    <main class="lead-cal-main">
                                        <div id="leadCalendarBody"></div>
                                    </main>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
    }

    function injectLeadCalendarStyles() {
        if ($("#leadCalendarDashboardStyle").length) { return; }
        $("head").append(`
            <style id="leadCalendarDashboardStyle">
                .lead-cal-new { height: calc(100vh - 150px); min-height: 620px; display: flex; flex-direction: column; overflow: hidden; background: #fff; border-radius: 10px; }
                .lead-cal-topbar { height: 56px; display: flex; align-items: center; padding: 0 16px 0 0; gap: 10px; background: #fff; border-bottom: 1px solid #e8eaed; flex-shrink: 0; }
                .lead-cal-clock-pill { display: flex; align-items: center; gap: 8px; background: #f1f3f4; border-radius: 4px; padding: 5px 12px; font-size: 12px; margin-left: 16px; }
                .lead-cal-clock-pill .tz { color: #555; }
                .lead-cal-nav-pill { display: flex; align-items: center; gap: 2px; background: #f1f3f4; border-radius: 24px; padding: 3px 5px; }
                .lead-cal-nav-pill button { border: 0; background: transparent; cursor: pointer; border-radius: 50%; width: 28px; height: 28px; font-size: 18px; color: #5f6368; display: flex; align-items: center; justify-content: center; box-shadow: none; }
                .lead-cal-nav-pill button:hover { background: #e0e0e0; }
                .lead-cal-nav-view-label { min-width: 46px; text-align: center; font-size: 12px; font-weight: 600; color: var(--pc); white-space: nowrap; padding: 0 4px; }
                .lead-cal-today-btn { border: 0; border-radius: 24px; background: #e8f0fe; padding: 6px 16px; font-size: 12px; cursor: pointer; color: var(--pc); font-weight: 500; box-shadow: none; }
                .lead-cal-topbar-month { font-family: "Google Sans", Arial, sans-serif; font-size: 15px; font-weight: 400; color: #202124; white-space: nowrap; }
                .lead-cal-spacer { flex: 1; }
                .lead-cal-view-pill { display: flex; background: #f1f3f4; border-radius: 24px; padding: 3px; gap: 2px; margin-right: 16px; }
                .lead-cal-vp-btn { border: 0; background: transparent; border-radius: 20px; padding: 5px 14px; font-size: 12px; font-weight: 500; cursor: pointer; color: #5f6368; box-shadow: none; }
                .lead-cal-vp-btn.active { background: #fff; color: var(--pc); box-shadow: 0 1px 4px rgba(60,64,67,0.2); }
                .lead-cal-legend-strip { display: flex; align-items: center; justify-content: flex-end; gap: 14px; padding: 5px 16px; background: #fff; border-bottom: 1px solid #e8eaed; flex-shrink: 0; flex-wrap: wrap; }
                .lead-cal-legend-strip span { font-size: 10px; font-weight: 700; color: #9aa0a6; text-transform: uppercase; letter-spacing: 0.8px; }
                .lead-cal-leg-item { display: flex; align-items: center; gap: 4px; font-size: 11px; }
                .lead-cal-leg-box { width: 15px; height: 15px; border-radius: 3px; flex-shrink: 0; border: 2px solid #888; background: #fff; }
                .lead-cal-layout { display: flex; flex: 1; overflow: hidden; min-height: 0; }
                .lead-cal-sidebar { width: 300px; padding: 12px; display: flex; flex-direction: column; overflow-y: auto; flex-shrink: 0; background: #fff; border-right: 1px solid #e8eaed; }
                .lead-cal-main { flex: 1; overflow-y: auto; overflow-x: hidden; background: #f8faff; min-width: 0; padding: 0; }
                .lead-cal-datepicker .datepicker { width: 100%; border: 0; }
                .lead-cal-datepicker .datepicker table { width: 100%; }
                .lead-cal-date-has-event { position: relative; font-weight: 700; color: var(--pc); }
                .lead-cal-date-has-event:after { content: ""; position: absolute; left: 50%; bottom: 3px; width: 4px; height: 4px; transform: translateX(-50%); border-radius: 50%; background: var(--pc); }
                .lead-cal-sb-divider { height: 1px; background: #f1f3f4; margin: 12px 0; }
                .lead-cal-sb-section h5 { font-size: 9px; font-weight: 700; color: #9aa0a6; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
                .lead-cal-row { display: flex; align-items: center; gap: 8px; padding: 5px 6px; cursor: pointer; border-radius: 10px; transition: background 0.12s; }
                .lead-cal-row:hover { background: #f1f3f4; }
                .lead-cal-check { width: 16px; height: 16px; border-radius: 4px; border: 2px solid; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
                .lead-cal-check.on:after { content: ""; width: 8px; height: 8px; background: #fff; clip-path: polygon(14% 44%,0 65%,50% 100%,100% 16%,80% 0%,43% 62%); display: block; }
                .lead-cal-label { font-size: 12px; color: #3c4043; flex: 1; }
                .lead-cal-today-summary-group { margin-bottom: 10px; }
                .lead-cal-today-summary-title { font-size: 11px; font-weight: 700; color: #5f6368; margin-bottom: 5px; }
                .lead-cal-today-summary-item { text-align: center; font-size: 11px; color: #3c4043; padding: 5px 7px; border: 1px solid #e8eaed; border-radius: 8px; margin-bottom: 4px; background: #fff; cursor: pointer; }
                .lead-cal-today-view { height: 100%; overflow-y: auto; padding: 18px 22px; background: #f8faff; }
                .lead-cal-today-group { display: flex; width: 100%; margin-bottom: 18px; }
                .lead-cal-today-date { width: 72px; flex-shrink: 0; padding-top: 10px; text-align: center; color: #3c4043; }
                .lead-cal-today-date.is-today .lead-cal-today-dow { color: var(--pc); }
                .lead-cal-today-date.is-today .lead-cal-today-day { background: var(--pc); color: #fff; border-radius: 50%; font-size: 18px; font-weight: 500; width: 38px; height: 38px; display: inline-flex; align-items: center; justify-content: center; }
                .lead-cal-today-dow { display: block; font-size: 10px; color: #9aa0a6; font-weight: 700; letter-spacing: 0.5px; }
                .lead-cal-today-day { display: block; font-size: 24px; font-weight: 300; line-height: 1.1; }
                .lead-cal-today-items { flex: 1; display: flex; flex-direction: column; gap: 9px; min-width: 0; }
                .lead-cal-today-event { position: relative; display: flex; align-items: flex-start; gap: 12px; min-height: 50px; background: #fff; box-shadow: 0 1px 4px rgba(60,64,67,0.07); cursor: pointer; border-style: dashed; border-width: 2px; border-radius: 10px; padding: 10px; text-align: center; }
                .lead-cal-today-event:hover { box-shadow: 0 4px 12px rgba(60,64,67,0.13); transform: translateY(-1px); }
                .lead-cal-today-dot { width: 11px; height: 11px; border-radius: 50%; margin-top: 4px; flex-shrink: 0; }
                .lead-cal-today-content { min-width: 0; flex: 1; }
                .lead-cal-today-title { font-size: 14px; line-height: 1.25; }
                .lead-cal-today-subtitle { font-size: 12px; margin-top: 4px; line-height: 1.35; color: #5f6368; }
                .lead-cal-today-badge { display: inline-block; vertical-align: 1px; line-height: 12px; font-size: 9px; padding: 2px 8px; border-radius: 4px; margin-right: 6px; text-transform: uppercase; color: #fff; }
                .lead-cal-live-badge { display: inline-block; line-height: 12px; font-size: 9px; font-weight: 700; padding: 2px 8px; border-radius: 4px; margin-right: 6px; text-transform: uppercase; color: #fff; background: #e53935; animation: leadCalendarPulse 1.4s ease-in-out infinite; }
                .lead-cal-today-empty { padding: 42px; text-align: center; color: #9aa0a6; font-size: 14px; }
                @keyframes leadCalendarPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
                .lead-cal-today-event.is-live { animation: leadCalendarPulse 1.4s ease-in-out infinite; }
                .lead-cal-slot-event { border-style: dashed; opacity: 0.9; }
                #leadCalendarDatepicker > .datepicker table tr td.active, #leadCalendarDatepicker > .datepicker table tr td.active:hover, #leadCalendarDatepicker > .datepicker table tr td.active:focus { background: var(--pc) !important; color: #fff !important; }
                #leadCalendarDatepicker > .datepicker td, #leadCalendarDatepicker > .datepicker th:not(.datepicker-switch) { width: 36px; height: 36px; line-height: 36px; text-align: center; }
                /* ── Week view ── */
                .lead-cal-week-view { height: 100%; overflow-y: auto; padding: 14px 18px; background: #f8faff; }
                .lead-cal-week-grid { display: flex; gap: 8px; align-items: stretch; }
                .lead-cal-week-day-col { flex: 1; min-width: 0; background: #fff; border-radius: 10px; border: 1px solid #e8eaed; display: flex; flex-direction: column; }
                .lead-cal-week-day-col.is-today { border-color: var(--pc); }
                .lead-cal-week-day-head { text-align: center; padding: 8px 4px; border-bottom: 1px solid #e8eaed; cursor: pointer; }
                .lead-cal-week-day-head:hover { background: #f1f6ff; }
                .lead-cal-week-day-head .dow { display: block; font-size: 10px; font-weight: 700; color: #9aa0a6; text-transform: uppercase; letter-spacing: 0.5px; }
                .lead-cal-week-day-head .daynum { display: block; font-size: 18px; font-weight: 300; color: #202124; }
                .lead-cal-week-day-col.is-today .daynum { background: var(--pc); color: #fff; border-radius: 50%; width: 28px; height: 28px; line-height: 28px; margin: 2px auto 0; font-size: 13px; }
                .lead-cal-week-day-body { flex: 1; padding: 6px; display: flex; flex-direction: column; gap: 6px; min-height: 140px; }
                .lead-cal-week-chip { border-radius: 6px; border: 1px dashed; padding: 5px 6px; font-size: 10px; cursor: pointer; text-align: left; background: #fff; line-height: 1.3; }
                .lead-cal-week-chip:hover { box-shadow: 0 2px 6px rgba(0,0,0,0.1); }
                .lead-cal-week-chip .t { font-weight: 700; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
                .lead-cal-week-empty { font-size: 10px; color: #c2c6cc; text-align: center; padding-top: 10px; }
                /* ── Month view ── */
                .lead-cal-month-view { height: 100%; overflow-y: auto; padding: 14px 18px; background: #f8faff; }
                .lead-cal-month-head-row { display: flex; }
                .lead-cal-month-head-row > div { flex: 1; text-align: center; font-size: 11px; font-weight: 700; color: #9aa0a6; text-transform: uppercase; padding: 6px 0; }
                .lead-cal-month-grid { display: flex; flex-direction: column; gap: 4px; }
                .lead-cal-month-row { display: flex; gap: 4px; }
                .lead-cal-month-cell { flex: 1; min-height: 78px; background: #fff; border: 1px solid #e8eaed; border-radius: 8px; padding: 4px 6px; cursor: pointer; display: flex; flex-direction: column; }
                .lead-cal-month-cell.is-outside { background: #fafbfc; color: #c2c6cc; }
                .lead-cal-month-cell.is-today { border-color: var(--pc); }
                .lead-cal-month-cell:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
                .lead-cal-month-cell .daynum { font-size: 12px; font-weight: 600; }
                .lead-cal-month-cell.is-today .daynum { color: var(--pc); }
                .lead-cal-month-count { margin-top: auto; font-size: 10px; font-weight: 700; border-radius: 10px; padding: 2px 6px; align-self: flex-start; color: #fff; }
                .lead-cal-month-count + .lead-cal-month-count { margin-top: 2px; }
                .lead-cal-month-slot-counselor { font-size: 9px; color: #0d8a5f; margin-top: 2px; line-height: 1.2; word-break: break-word; }
                @media (max-width: 990px) {
                    .lead-cal-new { height: auto; min-height: 520px; }
                    .lead-cal-topbar, .lead-cal-legend-strip { flex-wrap: wrap; height: auto; padding: 10px; justify-content: flex-start; }
                    .lead-cal-layout { flex-direction: column; }
                    .lead-cal-sidebar { width: 100%; max-height: 330px; border-right: 0; border-bottom: 1px solid #e8eaed; }
                    .lead-cal-main { min-height: 520px; }
                    .lead-cal-today-view { padding: 14px 10px; }
                    .lead-cal-today-date { width: 54px; }
                    .lead-cal-week-grid { flex-direction: column; }
                    .lead-cal-month-row { flex-direction: column; }
                }
                /* ── Meeting detail modal (opened on clicking a lead-cal-today-event card) ── */
                .lead-cal-modal-overlay { position: fixed; inset: 0; background: rgba(32,33,36,0.5); display: flex; align-items: center; justify-content: center; z-index: 20000; opacity: 0; transition: opacity 0.15s ease; padding: 20px; }
                .lead-cal-modal-overlay.open { opacity: 1; }
                .lead-cal-modal { background: #fff; border-radius: 16px; width: 100%; max-width: 480px; max-height: 85vh; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 12px 40px rgba(0,0,0,0.25); transform: translateY(10px); transition: transform 0.15s ease; }
                .lead-cal-modal-overlay.open .lead-cal-modal { transform: translateY(0); }
                .lead-cal-modal-strip { height: 6px; flex-shrink: 0; }
                .lead-cal-modal-body { padding: 24px 26px; overflow-y: auto; }
                .lead-cal-modal-title { font-size: 20px; font-weight: 700; margin: 0 0 16px; }
                .lead-cal-modal-field { display: flex; align-items: flex-start; gap: 10px; padding: 6px 0; font-size: 14px; }
                .lead-cal-modal-label { width: 110px; flex-shrink: 0; color: #5f6368; font-weight: 600; }
                .lead-cal-modal-value { color: #202124; }
                .lead-cal-modal-subheading { font-size: 11px; font-weight: 700; color: #9aa0a6; text-transform: uppercase; letter-spacing: 0.6px; margin: 18px 0 8px; }
                .lead-cal-modal-empty { font-size: 13px; color: #9aa0a6; padding: 10px 0; }
                .lead-cal-modal-table-wrap { max-height: 220px; overflow-y: auto; border: 1px solid #e8eaed; border-radius: 8px; }
                .lead-cal-modal-table { width: 100%; border-collapse: collapse; font-size: 12px; }
                .lead-cal-modal-table th { position: sticky; top: 0; background: #f8faff; text-align: left; padding: 8px 10px; border-bottom: 1px solid #e8eaed; color: #5f6368; font-weight: 700; }
                .lead-cal-modal-table td { padding: 8px 10px; border-bottom: 1px solid #f1f3f4; vertical-align: top; }
                .lead-cal-modal-join-meta { color: #9aa0a6; font-size: 10px; margin-top: 2px; }
                .lead-cal-modal-footer { display: flex; justify-content: flex-end; margin-top: 20px; }
                .lead-cal-modal-close-btn { border: 0; background: #f1f3f4; color: #3c4043; font-size: 13px; font-weight: 500; padding: 9px 24px; border-radius: 24px; cursor: pointer; }
                .lead-cal-modal-close-btn:hover { background: #e4e7ec; }
                .lead-cal-modal-join-btn { border: 0; color: #fff; font-size: 13px; font-weight: 600; padding: 9px 24px; border-radius: 24px; cursor: pointer; margin-right: 8px; }
                .lead-cal-modal-join-btn:hover { opacity: 0.9; color: #fff; }
            </style>`);
    }

    function updateClock() {
        var now = moment().tz(getLeadTimezone());
        $("#leadCalendarLiveClock").text(now.format("hh:mm:ss A"));
    }

    function renderStatusFilters() {
        var html = Object.keys(STATUS_META).map(function(key) {
            var meta = STATUS_META[key];
            var checked = leadCalendarState.filters[key] !== false;
            return `
                <div class="lead-cal-row" data-lead-filter-key="${key}">
                    <div class="lead-cal-check ${checked ? "on" : ""}" style="border-color:${meta.color};background:${checked ? meta.color : "#fff"};"></div>
                    <span class="lead-cal-label">${escapeHtml(meta.label)}</span>
                </div>`;
        }).join("");
        $("#leadCalendarStatusFilters").html(html);
    }

    function renderTodaySummary() {
        var groups = getTodaySummaryGroups();
        var labels = { live: "Live Demo", upcoming: "Upcoming Demo", completed: "Past Demo" };
        var html = Object.keys(labels).map(function(key) {
            var meetings = groups[key];
            return `
                <div class="lead-cal-today-summary-group">
                    <div class="lead-cal-today-summary-title">${labels[key]}</div>
                    ${meetings.length ? meetings.slice(0, 5).map(function(meeting) {
                        return `<div class="lead-cal-today-summary-item" data-lead-summary-id="${meeting.id}" style="border-color:${meeting.statusColor};">${escapeHtml(meeting.title)}<div class="text-muted">${meeting.displayTime}</div></div>`;
                    }).join("") : '<div class="text-muted font-12">No demo meetings</div>'}
                </div>`;
        }).join("");
        $("#leadCalendarTodaySummary").html(html);
    }

    function renderMeetingCard(meeting) {
        // LIVE badge driven by isMeetingActive(), i.e. now falls strictly inside
        // [demoStartTime, demoEndTime) — no join buffer applied to this badge (see isMeetingActive()).
        // The actual "Join Class" action lives inside openLiveJoinModal() (opened on card click,
        // routed by the buffered getJoinability()), not as a separate button on the card itself.
        var isLive = isMeetingActive(meeting);
        var joinInfo = "";
        if (meeting.hostJoins || meeting.attendeeJoins) {
            joinInfo = `<span class="ml-2">Host Joined: <b>${meeting.hostJoins}</b> &nbsp; Attendee Joined: <b>${meeting.attendeeJoins}</b></span>`;
        }
        // "System Training" meetings aren't tied to a real lead, so there's no Lead No to show for them.
        var isSystemTraining = String(meeting.meetingFrom || "").trim() === "System Training";
        var leadNoLine = isSystemTraining ? "" : `Lead No: ${escapeHtml(meeting.leadNo || "-")} <br/>`;
        // searchUser === false -> this card is one of MANY counselors' meetings (backend didn't
        // filter by user, see isMyMeeting), so show whose meeting it is. searchUser === true -> the
        // backend already scoped this to the logged-in counselor, so leave the card as-is (no name).
        var assignNameLine = meeting.searchUser === false && meeting.assignName
            ? `Assigned To: ${escapeHtml(meeting.assignName)} <br/>`
            : "";
        return `
            <div class="lead-cal-today-event ${isLive ? "is-live" : ""}" data-lead-meeting-id="${meeting.id}" style="border-color:${meeting.statusColor} !important;">
                <div class="lead-cal-today-content">
                    <div class="lead-cal-today-title font-weight-semi-bold" style="color:${meeting.statusColor};">
                        ${isLive ? '<span class="lead-cal-live-badge">LIVE</span>' : ""}
                        <span class="lead-cal-today-badge d-block" style="background:${meeting.statusColor};width:fit-content;margin:4px auto 0;">${escapeHtml(meeting.statusLabel)}</span>
                         ${escapeHtml(meeting.title)}
                    </div>
                    <div class="lead-cal-today-subtitle">
                        <b>${escapeHtml(meeting.displayTime)}</b> ${leadNoLine ? "&nbsp;|&nbsp; " + leadNoLine : "<br/>"}
                        ${assignNameLine}
                        Source: ${escapeHtml(meeting.meetingFrom || "-")}<br/>
                        ${joinInfo}
                    </div>
                </div>
            </div>`;
    }

    // "AVAILABLE SLOT" cards — /timeavailability/get-slots-to-book-event data, shown as-is
    // alongside the booked demo/lead meetings on the "today" list view (see renderLeadTodayView).
    // Not clickable/bookable here — purely informational, so no click handler is attached.
    var AVAILABLE_SLOT_COLOR = "#0d8a5f";
    function renderAvailableSlotCard(slot) {
        // Only shown when slotsSearchUser === false — that's when getAvailableSlotsForSelectedDate()
        // merges several counselors' same-time slots into this one card, so the comma-separated
        // counselorName is the only way to tell whose slots they are. Left off otherwise (as-is).
        var counselorLine = (leadCalendarState.slotsSearchUser === false && slot.counselorName)
            ? `<b>Counselor's: ${escapeHtml(slot.counselorName)}</b><br/>`
            : "";
        return `
            <div class="lead-cal-today-event lead-cal-slot-event" data-lead-slot-id="${slot.id}" style="border-color:${AVAILABLE_SLOT_COLOR} !important;">
                <div class="lead-cal-today-content">
                    <div class="lead-cal-today-title font-weight-semi-bold" style="color:${AVAILABLE_SLOT_COLOR};">
                        <span class="lead-cal-today-badge d-block" style="background:${AVAILABLE_SLOT_COLOR};width:fit-content;margin:4px auto 0;">AVAILABLE SLOT</span>
                    </div>
                    <div class="lead-cal-today-subtitle">
                        <b>${escapeHtml(slot.displayTime)}</b><br/>
                        ${counselorLine}
                    </div>
                </div>
            </div>`;
    }

    // ── Meeting join-time detail modal ──────────────────────────────────────────
    function formatJoinCell(join) {
        var metaParts = [join.city, join.country, (join.timeZone || "").replace("/", "-")].filter(Boolean);
        return escapeHtml(join.clickTime || "-") +
            (metaParts.length ? `<div class="lead-cal-modal-join-meta">${escapeHtml(metaParts.join(" | "))}</div>` : "");
    }

    function buildJoinTableHtml(meeting) {
        var list = meeting.meetingJoinTimeList || [];
        if (!list.length) {
            return '<div class="lead-cal-modal-empty">No join activity recorded for this meeting.</div>';
        }
        var hostRows = list.filter(function(j) { return j.joinType === "host"; });
        var attendeeRows = list.filter(function(j) { return j.joinType !== "host"; });
        var rowCount = Math.max(hostRows.length, attendeeRows.length, 1);
        var rowsHtml = "";
        for (var i = 0; i < rowCount; i++) {
            rowsHtml += `<tr><td>${hostRows[i] ? formatJoinCell(hostRows[i]) : "-"}</td><td>${attendeeRows[i] ? formatJoinCell(attendeeRows[i]) : "-"}</td></tr>`;
        }
        return `
            <table class="lead-cal-modal-table">
                <thead><tr><th>Host</th><th>Attendee</th></tr></thead>
                <tbody>${rowsHtml}</tbody>
            </table>`;
    }

    function closeLeadMeetingModal() {
        $("#leadCalMeetingModalOverlay").removeClass("open");
        setTimeout(function() { $("#leadCalMeetingModalOverlay").remove(); }, 150);
    }

    function openLeadMeetingModal(meeting) {
        $("#leadCalMeetingModalOverlay").remove();
        // "System Training" meetings aren't tied to a real lead, so there's no Lead No to show for them.
        var isSystemTraining = String(meeting.meetingFrom || "").trim() === "System Training";
        var leadNoField = isSystemTraining ? "" : `<div class="lead-cal-modal-field"><span class="lead-cal-modal-label">Lead No</span><span class="lead-cal-modal-value">${escapeHtml(meeting.leadNo || "-")}</span></div>`;
        // Same searchUser === false rule as renderMeetingCard — only show whose meeting it is when
        // this record wasn't already scoped to the logged-in counselor.
        var assignNameField = meeting.searchUser === false && meeting.assignName
            ? `<div class="lead-cal-modal-field"><span class="lead-cal-modal-label">Assigned To</span><span class="lead-cal-modal-value">${escapeHtml(meeting.assignName)}</span></div>`
            : "";
        var html = `
            <div class="lead-cal-modal-overlay" id="leadCalMeetingModalOverlay">
                <div class="lead-cal-modal">
                    <div class="lead-cal-modal-strip" style="background:${meeting.statusColor};"></div>
                    <div class="lead-cal-modal-body">
                        <h4 class="lead-cal-modal-title" style="color:${meeting.statusColor};">${escapeHtml(meeting.title)}</h4>
                        ${leadNoField}
                        ${assignNameField}
                        <div class="lead-cal-modal-field"><span class="lead-cal-modal-label">Date &amp; Time</span><span class="lead-cal-modal-value">${escapeHtml(meeting.demoDate || "-")} &nbsp;•&nbsp; ${escapeHtml(meeting.displayTime || "-")}</span></div>
                        <div class="lead-cal-modal-field"><span class="lead-cal-modal-label">Status</span><span class="lead-cal-modal-value font-weight-semi-bold" style="color:${meeting.statusColor};">${escapeHtml(meeting.statusLabel)}</span></div>
                        <div class="lead-cal-modal-subheading">Meeting Join Details</div>
                        ${buildJoinTableHtml(meeting)}
                        <div class="lead-cal-modal-footer">
                            <button type="button" class="lead-cal-modal-close-btn" id="leadCalMeetingModalClose">Close</button>
                        </div>
                    </div>
                </div>
            </div>`;
        $("body").append(html);
        setTimeout(function() { $("#leadCalMeetingModalOverlay").addClass("open"); }, 10);
    }

    // ── "Join Meeting" — reuses the classJoinInSameWindowModal/-Body ids used across the app
    // (dashboardCalendarNew.js, dashboardCalendar.js, commonActivityModel.js) for the same
    // "open the meeting link" pattern. This dashboard isn't loaded alongside those files, so the
    // shell is built and injected here rather than depending on their calendarMeetingLinkValidate().
    function ensureJoinInSameWindowModalShell() {
        if ($("#classJoinInSameWindowModal").length) { return; }
        $("body").append(`
            <div class="modal fade" id="classJoinInSameWindowModal" tabindex="-1" role="dialog" aria-labelledby="classJoinInSameWindowModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg modal-dialog-centered box-shadow-none" style="max-width:420px">
                    <div class="modal-content rounded-15 overflow-hidden">
                        <div class="py-1" id="classJoinInSameWindowStrip"></div>
                        <div id="classJoinInSameWindowBody" class="modal-body py-4"></div>
                    </div>
                </div>
            </div>`);
    }

    // LIVE (inside the counselor join window): the modal shows only fields actually present in the
    // API response (title/date/time/status) and redirects in THE SAME TAB (no target="_blank") when
    // "Join Class" is clicked — unlike the generic teacher/student class-join modal this is modeled
    // after, there is no separate host/attendee link here, just startMeetingUrl.
    // LIVE join modal — mirrors the teacher dashboard's "Join Class" modal (dashboardCalendarNew.js
    // calendarMeetingLinkValidateTeacher): a hidden input holding startMeetingUrl, a "Copy Class
    // Link" button (reuses the app-wide copyURL()/showCopyMessage() clipboard helpers), and the
    // actual join link opening startMeetingUrl in a NEW TAB (target="_blank"), same as there.
    function openLiveJoinModal(meeting) {
        ensureJoinInSameWindowModalShell();
        $("#classJoinInSameWindowStrip").css("background", meeting.statusColor);
        var timeLabel = meeting.localStartMoment ? meeting.localStartMoment.format("hh:mm A") : (meeting.demoStartTime || "-");
        var bodyHtml = `
            <div class="text-center">
                <span class="lead-cal-live-badge">LIVE</span>
                <h5 class="font-weight-semi-bold mb-3 mt-2" style="color:${meeting.statusColor};">${escapeHtml(meeting.title)}</h5>
                <div class="lead-cal-modal-field text-left"><span class="lead-cal-modal-label">Date</span><span class="lead-cal-modal-value">${escapeHtml(meeting.demoDate || "-")}</span></div>
                <div class="lead-cal-modal-field text-left"><span class="lead-cal-modal-label">Time</span><span class="lead-cal-modal-value">${escapeHtml(timeLabel)}</span></div>
                <div class="lead-cal-modal-field text-left"><span class="lead-cal-modal-label">Status</span><span class="lead-cal-modal-value font-weight-semi-bold" style="color:#d93025;">Live Now</span></div>
                ${meeting.startMeetingUrl ? `
                <input type="text" id="leadCalLiveJoinUrlInput" value="${escapeHtml(meeting.startMeetingUrl)}" style="position:absolute;opacity:0;height:0;width:0;pointer-events:none;" readonly/>
                <div class="mt-3 d-flex flex-column align-items-center" style="gap:8px;">
                    <a target="_blank" href="${meeting.startMeetingUrl}" onclick="autodiposeModel('classJoinInSameWindowModal')" class="lead-cal-modal-join-btn" style="background:${meeting.statusColor};display:inline-block;text-decoration:none;">Join School Demo</a>
                    <b class="leadCalCopyMsg d-block"></b>
                </div>` : `<p class="text-muted mb-0 mt-3">Meeting link is not available for this demo.</p>`}
                <button type="button" class="lead-cal-modal-close-btn mt-3" data-dismiss="modal">Close</button>
            </div>`;
        $("#classJoinInSameWindowBody").html(bodyHtml);
        $("#classJoinInSameWindowModal").modal({ backdrop: "static", keyboard: false });
    }

    // UPCOMING (before the join window opens): no join action yet, just tell the counselor when
    // they can start.
    function openUpcomingNoticeModal(meeting) {
        ensureJoinInSameWindowModalShell();
        $("#classJoinInSameWindowStrip").css("background", meeting.statusColor);
        // "scheduled for" = the actual demo time; "can start" = when the join window opens
        // (scheduled start - pastClassBufferCounselor) — same distinction the reference
        // teacher-class modal makes between classDate and canJoindateStart.
        var scheduledLabel = meeting.localStartMoment
            ? meeting.localStartMoment.format("MMM D, YYYY [at] hh:mm A")
            : (meeting.demoDate || "the scheduled time");
        var joinWindow = getJoinWindow(meeting);
        var canStartLabel = joinWindow ? joinWindow.start.format("MMM D, YYYY [at] hh:mm A") : scheduledLabel;
        var bodyHtml = `
            <div class="text-center">
                <h5 class="font-weight-semi-bold mb-3" style="color:${meeting.statusColor};">${escapeHtml(meeting.title)}</h5>
                <p class="mb-1">The demo is scheduled for <b>${escapeHtml(scheduledLabel)}</b></p>
                <p class="mb-3">You can start the class on <b>${escapeHtml(canStartLabel)}</b>.</p>
                <button type="button" class="lead-cal-modal-close-btn" data-dismiss="modal">Close</button>
            </div>`;
        $("#classJoinInSameWindowBody").html(bodyHtml);
        $("#classJoinInSameWindowModal").modal({ backdrop: "static", keyboard: false });
    }

    function renderLeadTodayView() {
        var body = $(LEAD_CAL_SELECTOR);
        if (!body.length) { return; }
        var selected = leadCalendarState.selectedDate
            ? moment.tz(leadCalendarState.selectedDate, "YYYY-MM-DD", getLeadTimezone())
            : moment().tz(getLeadTimezone());
        $("#leadCalendarTitle").text(selected.format("dddd, MMMM D, YYYY"));

        var meetings = groupBySelectedDate();
        var availableSlots = getAvailableSlotsForSelectedDate();
        var isToday = selected.isSame(moment().tz(getLeadTimezone()), "day");

        // Merge booked demos and available slots into ONE list, sorted by start time, so they
        // render in actual chronological sequence (e.g. a 12:00-12:30 "Demo Booked" followed by a
        // 12:30-01:00 "AVAILABLE SLOT" shows in that order) instead of all demos first, then all
        // slots. Items with no parseable start time sort last, after everything with a time.
        var combinedItems = meetings.map(function(meeting) {
            return { sortKey: meeting.localStartMoment ? meeting.localStartMoment.valueOf() : Number.MAX_SAFE_INTEGER, html: renderMeetingCard(meeting) };
        }).concat(availableSlots.map(function(slot) {
            return { sortKey: slot.localStartMoment ? slot.localStartMoment.valueOf() : Number.MAX_SAFE_INTEGER, html: renderAvailableSlotCard(slot) };
        }));
        combinedItems.sort(function(left, right) { return left.sortKey - right.sortKey; });

        var html = combinedItems.length
            ? `<div class="lead-cal-today-group">
                    <div class="lead-cal-today-date ${isToday ? "is-today" : ""}">
                        <span class="lead-cal-today-dow">${selected.format("ddd").toUpperCase()}</span>
                        <span class="lead-cal-today-day">${selected.format("D")}</span>
                    </div>
                    <div class="lead-cal-today-items">
                        ${combinedItems.map(function(item) { return item.html; }).join("")}
                    </div>
                </div>`
            : '<div class="lead-cal-today-empty">No demo/lead meetings found for this day.</div>';

        body.html(`<div class="lead-cal-today-view">${html}</div>`);
        updateDatepicker();
        renderTodaySummary();
    }

    function renderWeekChip(meeting) {
        return `
            <div class="lead-cal-week-chip" data-lead-meeting-id="${meeting.id}" style="border-color:${meeting.statusColor};color:${meeting.statusColor};">
                <span class="t">${escapeHtml(meeting.title)}</span>${escapeHtml(meeting.displayTime || "")}
            </div>`;
    }

    // Same bold "Counselor: ..." rule as renderAvailableSlotCard — only present when
    // slotsSearchUser === false merged this slot's counselorName from several counselors.
    function renderWeekSlotChip(slot) {
        var counselorLine = (leadCalendarState.slotsSearchUser === false && slot.counselorName)
            ? `<br/><b>Counselor: ${escapeHtml(slot.counselorName)}</b>`
            : "";
        return `
            <div class="lead-cal-week-chip lead-cal-week-slot-chip" data-lead-slot-id="${slot.id}" style="border-color:${AVAILABLE_SLOT_COLOR};color:${AVAILABLE_SLOT_COLOR};">
                <span class="t">AVAILABLE SLOT</span>${escapeHtml(slot.displayTime || "")}${counselorLine}
            </div>`;
    }

    function renderLeadWeekView() {
        var body = $(LEAD_CAL_SELECTOR);
        if (!body.length) { return; }
        var tz = getLeadTimezone();
        var selected = leadCalendarState.selectedDate ? moment.tz(leadCalendarState.selectedDate, "YYYY-MM-DD", tz) : moment().tz(tz);
        var weekStart = selected.clone().startOf("week");
        var days = [];
        for (var i = 0; i < 7; i++) { days.push(weekStart.clone().add(i, "days")); }
        var weekEnd = days[6];
        var title = weekStart.month() === weekEnd.month()
            ? weekStart.format("MMMM YYYY")
            : weekStart.format("MMM") + " - " + weekEnd.format("MMM YYYY");
        $("#leadCalendarTitle").text(title);

        var todayKey = moment().tz(tz).format("YYYY-MM-DD");
        var colsHtml = days.map(function(day) {
            var dayKey = day.format("YYYY-MM-DD");
            var isToday = dayKey === todayKey;
            var dayMeetings = leadCalendarState.filteredMeetings.filter(function(m) { return m.localDateKey === dayKey; });
            var daySlots = getMergedAvailableSlotsForDateKey(dayKey);
            // Same merge-by-start-time as renderLeadTodayView — a 12:00-12:30 "Demo Booked" followed
            // by a 12:30-01:00 "AVAILABLE SLOT" should render in that order, not all demos first.
            var dayItems = dayMeetings.map(function(meeting) {
                return { sortKey: meeting.localStartMoment ? meeting.localStartMoment.valueOf() : Number.MAX_SAFE_INTEGER, html: renderWeekChip(meeting) };
            }).concat(daySlots.map(function(slot) {
                return { sortKey: slot.localStartMoment ? slot.localStartMoment.valueOf() : Number.MAX_SAFE_INTEGER, html: renderWeekSlotChip(slot) };
            }));
            dayItems.sort(function(left, right) { return left.sortKey - right.sortKey; });
            var dayItemsHtml = dayItems.map(function(item) { return item.html; }).join("");
            return `
                <div class="lead-cal-week-day-col ${isToday ? "is-today" : ""}" data-lead-week-day="${dayKey}">
                    <div class="lead-cal-week-day-head">
                        <span class="dow">${day.format("ddd").toUpperCase()}</span>
                        <span class="daynum">${day.format("D")}</span>
                    </div>
                    <div class="lead-cal-week-day-body">
                        ${dayItemsHtml || '<div class="lead-cal-week-empty">No demos</div>'}
                    </div>
                </div>`;
        }).join("");

        body.html(`<div class="lead-cal-week-view"><div class="lead-cal-week-grid">${colsHtml}</div></div>`);
        updateDatepicker();
        renderTodaySummary();
    }

    function renderLeadMonthView() {
        var body = $(LEAD_CAL_SELECTOR);
        if (!body.length) { return; }
        var tz = getLeadTimezone();
        var selected = leadCalendarState.selectedDate ? moment.tz(leadCalendarState.selectedDate, "YYYY-MM-DD", tz) : moment().tz(tz);
        var monthStart = selected.clone().startOf("month");
        var monthEnd = selected.clone().endOf("month");
        var gridStart = monthStart.clone().startOf("week");
        var gridEnd = monthEnd.clone().endOf("week");
        $("#leadCalendarTitle").text(selected.format("MMMM YYYY"));

        var todayKey = moment().tz(tz).format("YYYY-MM-DD");
        var dowHeadHtml = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(function(d) { return `<div>${d}</div>`; }).join("");

        var rowsHtml = "";
        var cursor = gridStart.clone();
        while (cursor.isSameOrBefore(gridEnd, "day")) {
            var rowHtml = "";
            for (var i = 0; i < 7; i++) {
                var dayKey = cursor.format("YYYY-MM-DD");
                var isOutside = cursor.month() !== selected.month();
                var isToday = dayKey === todayKey;
                var dayMeetings = leadCalendarState.filteredMeetings.filter(function(m) { return m.localDateKey === dayKey; });
                var daySlots = getMergedAvailableSlotsForDateKey(dayKey);
                var slotCounselorLine = (leadCalendarState.slotsSearchUser === false)
                    ? daySlots.filter(function(s) { return s.counselorName; }).map(function(s) { return s.counselorName; })
                    : [];
                rowHtml += `
                    <div class="lead-cal-month-cell ${isOutside ? "is-outside" : ""} ${isToday ? "is-today" : ""}" data-lead-month-day="${dayKey}">
                        <span class="daynum">${cursor.format("D")}</span>
                        ${dayMeetings.length ? `<span class="lead-cal-month-count" style="background:var(--pc);">${dayMeetings.length} demo${dayMeetings.length > 1 ? "s" : ""}</span>` : ""}
                        ${daySlots.length ? `<span class="lead-cal-month-count" style="background:${AVAILABLE_SLOT_COLOR};">${daySlots.length} slot${daySlots.length > 1 ? "s" : ""}</span>` : ""}
                        ${slotCounselorLine.length ? `<div class="lead-cal-month-slot-counselor"><b>Counselor: ${escapeHtml(slotCounselorLine.join(", "))}</b></div>` : ""}
                    </div>`;
                cursor.add(1, "day");
            }
            rowsHtml += `<div class="lead-cal-month-row">${rowHtml}</div>`;
        }

        body.html(`
            <div class="lead-cal-month-view">
                <div class="lead-cal-month-head-row">${dowHeadHtml}</div>
                <div class="lead-cal-month-grid">${rowsHtml}</div>
            </div>`);
        updateDatepicker();
        renderTodaySummary();
    }

    // Keeps the nav-view-label ("Day"/"Week"/"Month") and the active view-pill button in sync
    // with leadCalendarState.viewName.
    function updateActiveViewLabel() {
        var label = leadCalendarState.viewName === "week" ? "Week" : leadCalendarState.viewName === "month" ? "Month" : "Day";
        $(".lead-cal-nav-view-label").text(label);
        $(".lead-cal-vp-btn").removeClass("active");
        $(".lead-cal-vp-btn[data-lead-view='" + leadCalendarState.viewName + "']").addClass("active");
    }

    function updateDatepicker() {
        var $datepicker = $("#leadCalendarDatepicker");
        if (!$datepicker.length || !$.fn.datepicker) { return; }
        if (!leadCalendarState.datepickerReady) {
            $datepicker.datepicker({
                todayHighlight: true,
                autoclose: false,
                beforeShowDay: function(date) {
                    var key = moment(date).format("YYYY-MM-DD");
                    if (eventDateMap()[key]) {
                        return { classes: "lead-cal-date-has-event" };
                    }
                    return true;
                }
            }).on("changeDate", function(event) {
                if (leadCalendarState.suppressDatepickerEvent) { return; }
                leadCalendarState.selectedDate = moment(event.date).format("YYYY-MM-DD");
                fetchAndRenderLeadCalendar(leadCalendarState.selectedDate);
            });
            leadCalendarState.datepickerReady = true;
        }
        var selected = leadCalendarState.selectedDate || moment().tz(getLeadTimezone()).format("YYYY-MM-DD");
        leadCalendarState.suppressDatepickerEvent = true;
        $datepicker.datepicker("update", moment(selected, "YYYY-MM-DD").toDate());
        leadCalendarState.suppressDatepickerEvent = false;
    }

    function refreshUIOnly() {
        applyFilters();
        renderStatusFilters();
        updateActiveViewLabel();
        if (leadCalendarState.viewName === "week") {
            renderLeadWeekView();
        } else if (leadCalendarState.viewName === "month") {
            renderLeadMonthView();
        } else {
            renderLeadTodayView();
        }
    }

    function bindLeadCalendarEvents() {
        $(document).off("click.leadCalendarNew", "#leadCalendarPrev");
        $(document).on("click.leadCalendarNew", "#leadCalendarPrev", function() {
            var cur = moment(leadCalendarState.selectedDate || moment().tz(getLeadTimezone()).format("YYYY-MM-DD"), "YYYY-MM-DD");
            var prevDate = leadCalendarState.viewName === "week" ? cur.subtract(7, "days")
                : leadCalendarState.viewName === "month" ? cur.subtract(1, "months")
                : cur.subtract(1, "days");
            fetchAndRenderLeadCalendar(prevDate.format("YYYY-MM-DD"));
        });
        $(document).off("click.leadCalendarNew", "#leadCalendarNext");
        $(document).on("click.leadCalendarNew", "#leadCalendarNext", function() {
            var cur = moment(leadCalendarState.selectedDate || moment().tz(getLeadTimezone()).format("YYYY-MM-DD"), "YYYY-MM-DD");
            var nextDate = leadCalendarState.viewName === "week" ? cur.add(7, "days")
                : leadCalendarState.viewName === "month" ? cur.add(1, "months")
                : cur.add(1, "days");
            fetchAndRenderLeadCalendar(nextDate.format("YYYY-MM-DD"));
        });
        $(document).off("click.leadCalendarViewPill", "[data-lead-view]");
        $(document).on("click.leadCalendarViewPill", "[data-lead-view]", function() {
            var view = $(this).attr("data-lead-view");
            leadCalendarState.viewName = view;
            if (view === "today") {
                leadCalendarState.selectedDate = moment().tz(getLeadTimezone()).format("YYYY-MM-DD");
            }
            fetchAndRenderLeadCalendar(leadCalendarState.selectedDate || moment().tz(getLeadTimezone()).format("YYYY-MM-DD"));
        });
        $(document).off("click.leadCalendarWeekDrill", ".lead-cal-week-day-head");
        $(document).on("click.leadCalendarWeekDrill", ".lead-cal-week-day-head", function() {
            var dk = $(this).closest("[data-lead-week-day]").attr("data-lead-week-day");
            if (dk) {
                leadCalendarState.viewName = "today";
                fetchAndRenderLeadCalendar(dk);
            }
        });
        $(document).off("click.leadCalendarMonthDrill", "[data-lead-month-day]");
        $(document).on("click.leadCalendarMonthDrill", "[data-lead-month-day]", function() {
            var dk = $(this).attr("data-lead-month-day");
            leadCalendarState.viewName = "today";
            fetchAndRenderLeadCalendar(dk);
        });
        $(document).off("click.leadCalendarFilters", "[data-lead-filter-key]");
        $(document).on("click.leadCalendarFilters", "[data-lead-filter-key]", function() {
            var key = $(this).attr("data-lead-filter-key");
            leadCalendarState.filters[key] = !leadCalendarState.filters[key];
            refreshUIOnly();
        });
        $(document).off("click.leadCalendarSummary", "[data-lead-summary-id]");
        $(document).on("click.leadCalendarSummary", "[data-lead-summary-id]", function() {
            scrollToMeetingCard($(this).attr("data-lead-summary-id"));
        });
        // Card click branches on the counselor join window (getJoinability): live -> same-tab
        // join modal, upcoming -> "you can start on <date/time>" notice, everything else (past/
        // completed/cancelled/etc.) -> the existing meeting-details modal, unchanged.
        $(document).off("click.leadCalendarMeetingModal", "[data-lead-meeting-id]");
        $(document).on("click.leadCalendarMeetingModal", "[data-lead-meeting-id]", function(clickEvent) {
            // Defensive: this element is a plain <div>, so there's no native default action to
            // prevent, but stopping propagation here guards against any ancestor click handler
            // (e.g. a generic ".card" delegate elsewhere in the app) firing a second, conflicting
            // action off the same click.
            clickEvent.preventDefault();
            clickEvent.stopPropagation();
            var id = $(this).attr("data-lead-meeting-id");
            var meeting = leadCalendarState.filteredMeetings.filter(function(m) { return String(m.id) === String(id); })[0]
                || leadCalendarState.masterMeetings.filter(function(m) { return String(m.id) === String(id); })[0];
            if (!meeting) { return; }
            var joinability = getJoinability(meeting);
            if (joinability === "live") {
                openLiveJoinModal(meeting);
            } else if (joinability === "upcoming") {
                openUpcomingNoticeModal(meeting);
            } else {
                openLeadMeetingModal(meeting);
            }
        });
        $(document).off("click.leadCalendarMeetingModalClose", "#leadCalMeetingModalClose");
        $(document).on("click.leadCalendarMeetingModalClose", "#leadCalMeetingModalClose", function() {
            closeLeadMeetingModal();
        });
        $(document).off("click.leadCalendarMeetingModalOverlay", "#leadCalMeetingModalOverlay");
        $(document).on("click.leadCalendarMeetingModalOverlay", "#leadCalMeetingModalOverlay", function(clickEvent) {
            if (clickEvent.target.id === "leadCalMeetingModalOverlay") { closeLeadMeetingModal(); }
        });
    }

    // ── Data fetch — POST to /dashboard/school-demo-list, same body shape as leads.js:getRequestForLeadDemo ──
    // NOTE: the backend parses startDate/endDate with DateUtil.STANDARD_DATE_FORMAT_7 ("dd-MM-yyyy")
    // when modeSearch is "CUSTOM" (see ReportUtil.getReportTotalSchoolDemo) — the same format the
    // existing Lead Report List date pickers use (LeadReportListContent.js: format: 'dd-mm-yyyy').
    // startKey/endKey are our internal "YYYY-MM-DD" state keys, reformatted before sending.
    function fetchLeadDemoList(startKey, endKey) {
        var authentication = {
            hash: getHash(),
            schoolId: SCHOOL_ID,
            schoolUUID: SCHOOL_UUID,
            userId: USER_ID,
            userType: "COMMON"
        };
        var requestBody = {
            schoolId: SCHOOL_ID,
            modeSearch: "CUSTOM",
            startDate: moment(startKey, "YYYY-MM-DD").format("DD-MM-YYYY"),
            endDate: moment(endKey, "YYYY-MM-DD").format("DD-MM-YYYY"),
            authentication: authentication
        };
        return new Promise(function(resolve, reject) {
            $.ajax({
                type: "POST",
                contentType: APPLICATION_JSON_VALUE,
                url: getURLForHTML("dashboard", "school-demo-list"),
                data: JSON.stringify(requestBody),
                dataType: "json",
                cache: false,
                timeout: 600000,
                success: function(data) {
                    if (data && (data.status === "0" || data.status === "2")) {
                        reject(data);
                        return;
                    }
                    resolve(data || {});
                },
                error: function(error) {
                    reject(error);
                }
            });
        });
    }

    // ── Data fetch — POST to /timeavailability/get-slots-to-book-event, same "available slots to
    // book a demo" call the public booking widget uses (leadDemoContent.js:callFreeSlotsForCounselor),
    // but with userId:null so the backend returns every counselor's free slots for visitDate, not
    // just one counselor's — see TimeAvailabilityApiUtil.getFreeSlotOfCounselorDateWise. The backend
    // controller takes a Payload DTO ({"payload": "<base64(encodeURI(json))>"} ), decoded server-side
    // via AesUtil.decode — but that wrapping is done for EVERY APPLICATION_JSON_VALUE ajax call
    // automatically by the global $.ajaxSetup({beforeSend...}) in jquery.commonFunction.js (it
    // base64+encodeURI's settings.data and re-stuffs it into {"payload": ...} before the request
    // goes out). So the body sent here must be the PLAIN request JSON — wrapping it again ourselves
    // double-encodes it and the backend's single decode then fails, returning the generic "technical
    // glitch" response. dayId is accepted by the endpoint but unused server-side for this call; sent
    // anyway to match the shape the app's other callers use. Resolves to {slotList: []} on failure
    // instead of rejecting, so a slots-API hiccup never breaks the demo-list half of the calendar.
    function fetchAvailableSlots(dateKey) {
        var requestBody = {
            timezone: getLeadTimezone(),
            visitDate: dateKey,
            dayId: moment(dateKey, "YYYY-MM-DD").day() + 1,
            eventId: 5,
            userId: USER_ID,
        };
        return new Promise(function(resolve) {
            $.ajax({
                type: "POST",
                contentType: APPLICATION_JSON_VALUE,
                url: getURLForHTML("timeavailability", "get-slots-to-book-event"),
                data: JSON.stringify(requestBody),
                dataType: "json",
                cache: false,
                timeout: 600000,
                success: function(data) {
                    resolve(data || {});
                },
                error: function(error) {
                    console.warn("Unable to load available slots (get-slots-to-book-event)", error);
                    resolve({ slotList: [] });
                }
            });
        });
    }

    // Resolves the [start, end] fetch window ("YYYY-MM-DD" moments) for the active view around
    // dateKey — a single day for Today, the containing week for Week, and the containing month's
    // full display grid (including the leading/trailing days from adjacent months) for Month.
    function getRangeForView(viewName, dateKey) {
        var m = moment(dateKey, "YYYY-MM-DD");
        if (viewName === "week") {
            return { start: m.clone().startOf("week"), end: m.clone().endOf("week") };
        }
        if (viewName === "month") {
            return { start: m.clone().startOf("month").startOf("week"), end: m.clone().endOf("month").endOf("week") };
        }
        return { start: m.clone(), end: m.clone() };
    }

    // True when the page already told us (via BaseController#updateModel /
    // CommonCustomScript.jsp — same ADMIN-DASHBOARD-SPACIAL-RIGHTS email-list check the backend
    // itself runs) that this user's searchUser will come back false. Checking this BEFORE ever
    // calling /dashboard/school-demo-list or /timeavailability/get-slots-to-book-event means a
    // special-rights user never triggers either API just to have the widget hidden afterwards.
    function isKnownNonSearchUser() {
        return typeof ADMIN_DASHBOARD_SPECIAL_RIGHTS !== "undefined" && ADMIN_DASHBOARD_SPECIAL_RIGHTS === true;
    }

    function fetchAndRenderLeadCalendar(dateKey) {
        dateKey = dateKey || moment().tz(getLeadTimezone()).format("YYYY-MM-DD");
        leadCalendarState.selectedDate = dateKey;
        // Known up front (page-level flag) OR already established (from an earlier response) that
        // this user gets searchUser === false — the widget stays hidden, so don't hit
        // /dashboard/school-demo-list or /timeavailability/get-slots-to-book-event at all.
        if (isKnownNonSearchUser() || leadCalendarState.hiddenForNonSearchUser) {
            leadCalendarState.hiddenForNonSearchUser = true;
            $(LEAD_CAL_CONTAINER).hide();
            return;
        }
        var body = $(LEAD_CAL_SELECTOR);
        if (body.length) {
            body.html('<div class="lead-cal-today-empty">Loading demo meetings...</div>');
        }
        var range = getRangeForView(leadCalendarState.viewName, dateKey);
        // /timeavailability/get-slots-to-book-event only ever answers for a single visitDate, so to
        // cover Week/Month views (which show every day in `range`, not just `dateKey`) it's called
        // once per day in the visible range and the results are merged below — otherwise only the
        // single selected day would ever have slots to show, and every other day cell in Week/Month
        // would look "empty" even when slots exist for it.
        var slotDateKeys = [];
        var cursor = range.start.clone();
        while (cursor.isSameOrBefore(range.end, "day")) {
            slotDateKeys.push(cursor.format("YYYY-MM-DD"));
            cursor.add(1, "day");
        }
        // Check searchUser FIRST, off /dashboard/school-demo-list alone, before ever calling
        // /timeavailability/get-slots-to-book-event. StudentEnrolledStatusResponse now carries a
        // top-level searchUser (see StudentEnrolledStatusResponse#searchUser /
        // ReportUtil.getReportTotalSchoolDemo) that's reliable even when studentEnrolledList is
        // empty, unlike reading it off list[0]. Only when that comes back true do we go on to fetch
        // available slots (one call per day in range) — when it's false the slots call for this
        // user would just be more of the same "every counselor" data we're already hiding, so it's
        // skipped outright.
        fetchLeadDemoList(range.start.format("YYYY-MM-DD"), range.end.format("YYYY-MM-DD")).then(function(data) {
            var list = data.studentEnrolledList || [];
            // Buffers ride on the response itself (same for every row) — see getJoinWindow().
            leadCalendarState.pastClassBufferCounselor = toValidMinutes(data.pastClassBufferCounselor);
            leadCalendarState.futureClassBufferCounselor = toValidMinutes(data.futureClassBufferCounselor);
            if (data.searchUser === false) {
                // Remember this so every later navigation short-circuits at the top of this
                // function instead of hitting either API again just to hide the widget.
                leadCalendarState.hiddenForNonSearchUser = true;
                if (leadCalendarState.activeRefreshTimer) {
                    clearInterval(leadCalendarState.activeRefreshTimer);
                    leadCalendarState.activeRefreshTimer = null;
                }
                $(LEAD_CAL_CONTAINER).hide();
                return;
            }
            // isMyMeeting only excludes a row when BOTH userId and assignName fail to match the
            // logged-in counselor — everything else is shown as-is.
            leadCalendarState.masterMeetings = list.map(normalizeMeeting).filter(isMyMeeting);
            return Promise.all(slotDateKeys.map(fetchAvailableSlots)).then(function(slotsDataList) {
                // Each entry in slotsDataList is one day's {slotList, searchUser} response (see
                // slotDateKeys above) — slotList itself is an array of arrays (one sub-array per
                // counselor), so flatten both levels before normalizing.
                var allSlots = [];
                var slotsSearchUser = true;
                slotsDataList.forEach(function(slotsData) {
                    var slotList = slotsData.slotList || [];
                    allSlots = allSlots.concat([].concat.apply([], slotList));
                    // searchUser === false from ANY day means that day's response already covers
                    // every counselor — keep the merge-by-time-slot behaviour on for the whole range.
                    if (slotsData.searchUser === false) { slotsSearchUser = false; }
                });
                leadCalendarState.availableSlots = allSlots.map(normalizeAvailableSlot);
                // Drives the same-time-slot merge in getMergedAvailableSlotsForDateKey().
                leadCalendarState.slotsSearchUser = slotsSearchUser;
                $(LEAD_CAL_CONTAINER).show();
                leadCalendarState.loaded = true;
                refreshUIOnly();
                startActiveRefresh();
            });
        }).catch(function(error) {
            console.warn("Unable to load lead/demo calendar", error);
            if (body.length) {
                body.html('<div class="lead-cal-today-empty">Unable to load demo meetings.</div>');
            }
        });
    }

    // ── Public entry point — call renderLeadDemoCalendarDashboard('containerId') after
    // the target container exists in the DOM (see CounselorDashboardContent.js). ──
    window.renderLeadDemoCalendarDashboard = function(containerSelector) {
        var container = $("#" + (containerSelector || "leadCalendarDashboardContainer").replace(/^#/, ""));
        if (!container.length) {
            container = $(LEAD_CAL_CONTAINER);
        }
        if (!container.length) { return; }

        // Known up front that this user gets searchUser === false — don't even build the shell or
        // call fetchAndRenderLeadCalendar, so /dashboard/school-demo-list and
        // /timeavailability/get-slots-to-book-event never get hit in the first place.
        if (isKnownNonSearchUser()) {
            leadCalendarState.hiddenForNonSearchUser = true;
            container.hide();
            return;
        }

        injectLeadCalendarStyles();
        container.html(buildLeadCalendarShell());

        updateClock();
        if (leadCalendarState.clockTimer) {
            clearInterval(leadCalendarState.clockTimer);
        }
        leadCalendarState.clockTimer = setInterval(updateClock, 1000);

        renderStatusFilters();
        bindLeadCalendarEvents();
        fetchAndRenderLeadCalendar(moment().tz(getLeadTimezone()).format("YYYY-MM-DD"));
    };

    window.leadCalendarDashboardState = leadCalendarState;

})(window, jQuery);
