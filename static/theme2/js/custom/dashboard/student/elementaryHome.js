/*
 * Self-Study Dashboard revamp — Elementary (K-5) band, "Adventure Learning World" (Phase 4).
 * See student-self-study-dashboard-innovation-plan.html §5 / §17 for the full feature plan.
 *
 * Only loaded when gradeBand == 'ELEMENTARY' (see DashboardHeaderResourcePage.jsp), and only
 * activates when the dashboard root carries data-grade-band="ELEMENTARY" (set in Dashboard.jsp,
 * student role only — see GradeBandUtil). A no-op for every other role/band/program.
 *
 * Deliberately additive: reads the existing calendar/course/assignment data that
 * dashboardCalendarNew.js already fetches and renders (via its getStudentCalendarState()
 * accessor), and inserts new cards alongside the existing calendar widget. It never removes,
 * hides, or rewrites dashboardCalendarNew.js's own markup, so the original course-filter
 * checkboxes/calendar keep working exactly as before underneath the re-skin.
 *
 * Known limitations of this first slice (tracked in the plan's Phase 4 checklist):
 *  - Mission Board/Adventure Map re-render on mount and whenever the course-filter list
 *    re-renders; they do not yet live-update on every calendar filter click.
 *  - The companion card shows a static rotating tip, not yet triggered by real submit events.
 *  - Learning Streak Garden is intentionally not built here — gated on a new daily-activity
 *    table that does not exist yet (see plan §19).
 */
(function () {
	"use strict";

	function isElementaryBand() {
		var root = document.querySelector(".app-container[data-grade-band]");
		return !!root && root.getAttribute("data-grade-band") === "ELEMENTARY";
	}
	// NOTE: this file's own <script> tag loads in <head> (DashboardHeaderResourcePage.jsp),
	// which executes BEFORE .app-container exists in the body - so isElementaryBand() must be
	// checked from inside init() (after DOM-ready), never at the top level of this IIFE, or it
	// always sees no matching element and the whole script silently no-ops.

	var MISSION_LIMIT = 4;
	var FRIENDLY_EMPTY_COPY = {
		"No calendar items found.": "Nothing on the calendar right now — a great day to explore your courses!",
		"No course filters available": "Your courses will show up here once they're assigned."
	};

	function escapeHtml(str) {
		return String(str == null ? "" : str)
			.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
	}

	function getCalendarApi() {
		return window.dashboardCalendarNew || null;
	}

	/* ---- Adventure Map: re-skins the existing "My Courses" list as islands, without
	   touching its own checkboxes - clicking an island just forwards the click. ---- */
	function buildAdventureMap() {
		var api = getCalendarApi();
		var filtersEl = document.getElementById("dashboardCalendarCourseFilters");
		if (!api || !filtersEl) {
			return "";
		}
		var rows = filtersEl.querySelectorAll(".course-row[data-course-id]");
		if (!rows.length) {
			return '<div class="es-elem-empty">' + escapeHtml(FRIENDLY_EMPTY_COPY["No course filters available"]) + "</div>";
		}
		var islands = "";
		rows.forEach(function (row, index) {
			var courseId = row.getAttribute("data-course-id");
			var label = row.querySelector(".c-label");
			var swatch = row.querySelector(".c-swatch");
			var color = swatch ? swatch.style.background : "#2E86DE";
			var isOn = row.querySelector(".c-check") && row.querySelector(".c-check").classList.contains("on");
			islands += '<button type="button" class="es-elem-island' + (isOn ? " is-on" : "") + '" data-es-course-id="' + escapeHtml(courseId) + '" style="--island-color:' + escapeHtml(color) + '">'
				+ '<span class="es-elem-island-num">' + (index + 1) + "</span>"
				+ '<span class="es-elem-island-dot"></span>'
				+ '<span class="es-elem-island-label">' + escapeHtml(label ? label.textContent : courseId) + "</span>"
				+ "</button>";
		});
		return '<div class="es-elem-map">' + islands + "</div>";
	}

	function bindAdventureMapClicks(container) {
		container.querySelectorAll(".es-elem-island").forEach(function (island) {
			island.addEventListener("click", function () {
				var courseId = island.getAttribute("data-es-course-id");
				var realCheck = document.querySelector('#dashboardCalendarCourseFilters [data-filter-course="' + CSS.escape(courseId) + '"]');
				if (realCheck) {
					realCheck.click();
					island.classList.toggle("is-on");
				}
			});
		});
	}

	/* ---- Daily Mission Board data source.
	   BUG (found live, Oct 2026): the shared calendar's studentCalendarState.masterEvents is
	   REPLACED (not accumulated) by whatever narrow +-1-day window the user last navigated to
	   via the datepicker/view (see refreshCalendarFromCurrentView in dashboardCalendarNew.js) -
	   so reading getStudentCalendarState().filteredEvents made the Mission Board's item set
	   depend on calendar browsing history instead of the real, complete picture. Fixed by giving
	   Mission Board its OWN independent fetch, hitting the exact same /dashboard/school-calendar
	   endpoint the calendar itself uses but never writing into studentCalendarState - so this
	   cannot affect the main calendar's display. Window is a few days either side of today
	   (not just today alone) purely as a timezone/off-by-one safety margin - renderMissionBoardHtml
	   below does the real "is this actually today" filtering against the student's own timezone. ---- */
	function fetchMissionAssignments(onDone) {
		var api = getCalendarApi();
		if (!api || typeof api.normalizeCalendarEvent !== "function" || typeof window.$ !== "function"
				|| typeof window.getURLForHTML !== "function" || !window.UNIQUEUUID) {
			onDone([]);
			return;
		}
		var request = {
			userId: window.USER_ID,
			schoolId: window.SCHOOL_ID,
			agenda: "agendaWeek",
			startDate: moment().subtract(2, "days").format("YYYY-MM-DD"),
			endDate: moment().add(2, "days").format("YYYY-MM-DD"),
			uniqueId: window.UNIQUEUUID
		};
		window.$.ajax({
			type: "POST",
			contentType: "application/json",
			url: window.getURLForHTML("dashboard", "school-calendar"),
			data: JSON.stringify(request),
			dataType: "json",
			cache: false,
			timeout: 30000,
			success: function (data) {
				var rawEvents = (data && data.event) || [];
				var events = rawEvents.map(function (ev) { return api.normalizeCalendarEvent(ev, data.courseDetails); });
				onDone(events);
			},
			error: function () { onDone([]); }
		});
	}

	/* ---- Daily Mission Board: ONLY today's date (student-timezone-aware) - both Assignments
	   due today AND Classes that are Live or Upcoming today. Explicitly excludes: assignments
	   overdue from a prior day (not "today's"), past/completed/missed classes, and anything
	   dated tomorrow or later. Scope confirmed directly by the project owner (Oct 2026): "jis
	   date per click karega student sirf uss din ka Assignments, Class (Live, upcoming) aayega"
	   — but note Today's Missions itself intentionally does NOT follow the clicked calendar
	   date (that's the main calendar's own Day view, untouched by this file); it always reflects
	   the real "today", independent of calendar navigation (see fetchMissionAssignments above). ---- */
	function renderMissionBoardHtml(events) {
		var api = getCalendarApi();
		var todayKey = moment().tz(api.getStudentTimezone ? api.getStudentTimezone() : moment.tz.guess()).format("YYYY-MM-DD");

		var assignmentMissions = events
			.filter(function (ev) { return ev.eventKind === "assignment" && (ev.dueDate || ev.paceDate) === todayKey; })
			.map(function (ev) { return { type: "assignment", event: ev, sortKey: "9999" }; });

		var classMissions = events
			.filter(function (ev) { return ev.eventKind === "class" && ev.localDateKey === todayKey; })
			.map(function (ev) { return { type: "class", event: ev, status: api.getEventStatus ? api.getEventStatus(ev) : null }; })
			.filter(function (m) { return m.status === "live" || m.status === "upcoming"; })
			.map(function (m) { return { type: "class", event: m.event, classStatus: m.status, sortKey: (m.status === "live" ? "0" : "1") + (m.event.start || "") }; });

		var missions = classMissions.concat(assignmentMissions)
			.sort(function (a, b) { return a.sortKey < b.sortKey ? -1 : a.sortKey > b.sortKey ? 1 : 0; })
			.slice(0, MISSION_LIMIT);

		if (!missions.length) {
			return '<div class="es-elem-empty">Nothing due today — great time for free exploring! 🎉</div>';
		}
		return '<div class="es-elem-missions">' + missions.map(function (m) {
			var color = api.getCourseColor ? api.getCourseColor(m.event.courseId) : "#2E86DE";
			var when = m.type === "class"
				? (m.classStatus === "live" ? "Live now" : ("Upcoming" + (m.event.displayTime ? " · " + m.event.displayTime : "")))
				: "Due today";
			var title = m.type === "class" ? (m.event.eventTitle || m.event.title || "Class") : (m.event.title || "Assignment");
			return '<div class="es-elem-mission" style="--mission-color:' + escapeHtml(color) + '">'
				+ '<span class="es-elem-mission-dot"></span>'
				+ '<div class="es-elem-mission-body"><div class="es-elem-mission-title">' + escapeHtml(title) + "</div>"
				+ '<div class="es-elem-mission-when">' + escapeHtml(when) + "</div></div>"
				+ "</div>";
		}).join("") + "</div>";
	}

	function refreshMissionBoard() {
		var container = document.getElementById("esElemMissionBoard");
		if (!container) {
			return;
		}
		fetchMissionAssignments(function (events) {
			// Container may have been replaced by a renderHome() re-run while the fetch was
			// in flight (e.g. course list changed) - re-fetch the live element, not the closed-
			// over one, so this never writes into a detached node.
			var liveContainer = document.getElementById("esElemMissionBoard");
			if (liveContainer) {
				liveContainer.innerHTML = renderMissionBoardHtml(events);
			}
		});
	}

	/* ---- Static companion tip (CSS-only idle animation; no live event hooks yet). ---- */
	var COMPANION_TIPS = [
		"Finishing one mission at a time makes the whole map easier!",
		"Stuck on something? It's okay to try again — that's how we learn.",
		"Pick your favorite subject first today and build momentum!",
		"Don't forget to check your missions before you explore your courses."
	];

	function buildCompanion() {
		var tip = COMPANION_TIPS[Math.floor(Math.random() * COMPANION_TIPS.length)];
		return '<div class="es-elem-companion">'
			+ '<div class="es-elem-companion-avatar" aria-hidden="true">🧭</div>'
			+ '<div class="es-elem-companion-bubble">' + escapeHtml(tip) + "</div>"
			+ "</div>";
	}

	function renderHome(hostCard) {
		var panel = document.getElementById("esElementaryHome");
		if (!panel) {
			panel = document.createElement("div");
			panel.id = "esElementaryHome";
			panel.className = "es-elem-home main-card mb-3 pr-4";
			hostCard.parentNode.insertBefore(panel, hostCard);
		}
		// Mission Board starts as a loading placeholder here (sync, DOM-only) and is filled in
		// by refreshMissionBoard()'s independent fetch - see fetchMissionAssignments() above for
		// why it can't just read the shared calendar state.
		panel.innerHTML =
			'<div class="card rounded-15 es-elem-home-card"><div class="card-body">'
			+ '<div class="es-elem-section"><h5 class="es-elem-heading">Today\'s Missions</h5><div id="esElemMissionBoard" class="es-elem-empty">Loading your missions…</div></div>'
			+ '<div class="es-elem-section"><h5 class="es-elem-heading">Your Learning Islands</h5>' + buildAdventureMap() + "</div>"
			+ buildCompanion()
			+ "</div></div>";
		bindAdventureMapClicks(panel);
		refreshMissionBoard();
	}

	function translateKnownEmptyStates() {
		document.querySelectorAll(".dashboard-today-empty, #dashboardCalendarCourseFilters .text-muted").forEach(function (el) {
			var friendly = FRIENDLY_EMPTY_COPY[el.textContent.trim()];
			if (friendly) {
				el.textContent = friendly;
			}
		});
	}

	// MISSION_POLL_MS: there's no event to observe for "an assignment was submitted elsewhere",
	// so Mission Board re-fetches on a cheap interval instead. This only refetches the mission
	// data itself, not the whole panel - Adventure Map/companion don't need to re-render that often.
	var MISSION_POLL_MS = 60000;

	function setupOngoing(hostCard) {
		renderHome(hostCard);
		translateKnownEmptyStates();

		// Adventure Map tracks #dashboardCalendarCourseFilters directly - it alone re-renders
		// whenever courses/filters change, and renderHome() never touches that element itself,
		// so this cannot feed back into itself.
		var coursesEl = document.getElementById("dashboardCalendarCourseFilters");
		if (coursesEl) {
			new MutationObserver(function () {
				renderHome(hostCard);
				translateKnownEmptyStates();
			}).observe(coursesEl, { childList: true });
		}

		setInterval(refreshMissionBoard, MISSION_POLL_MS);
	}

	var initCalled = false;
	function init() {
		if (initCalled) {
			return;
		}
		initCalled = true;
		if (!isElementaryBand()) {
			return;
		}
		var hostCard = document.querySelector(".dashboard-calendar-new-card");
		if (hostCard) {
			setupOngoing(hostCard);
			return;
		}
		// Calendar shell hasn't mounted yet - watch for it once, then stop watching the body.
		var initialObserver = new MutationObserver(function () {
			var card = document.querySelector(".dashboard-calendar-new-card");
			if (card) {
				initialObserver.disconnect();
				setupOngoing(card);
			}
		});
		initialObserver.observe(document.body, { childList: true, subtree: true });
	}

	document.addEventListener("DOMContentLoaded", init);
	if (document.readyState === "complete" || document.readyState === "interactive") {
		init();
	}
})();
