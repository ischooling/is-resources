/*
 * Attendance report — BEHAVIOUR / EVENTS / AJAX file.
 * Pairs with AttendanceReportContent.js (markup). Config vars below are set by
 * renderAttendanceReport() before the first data load; the AJAX data endpoints
 * (/table, /filter-options, /dependent-options, /class-detail, /student-wise)
 * are unchanged.
 */

var ADMIN_VIEW = false;
var EUID = "";
var MODULE_ID = "";
var PROFILE_STATUS = "A";
var API_BASE = "";
var talkChart = null;
var currentPage = 1;
var currentStudents = [];
var activeStuFilter = null;
let AI_MODEL= "gemma2:2b-instruct-q4_K_M";

function collectFilters(page) {
	return {
		euid: EUID, moduleId: MODULE_ID, profileStatus: PROFILE_STATUS,
		classType: $("#f-type").val(), learningProgram: $("#f-program").val(),
		grade: $.trim($("#f-grade").val()), assignedBatch: $.trim($("#f-batch").val()),
		course: $.trim($("#f-course").val()), studentName: $.trim($("#f-student").val()),
		teacherName: ADMIN_VIEW ? $.trim($("#f-teacher").val()) : "",
		dateRange: $("#f-range").val(), startDate: $("#f-from").val(), endDate: $("#f-to").val(),
		sort: $("#f-sort").val(), page: page || 1, pageSize: parseInt($("#page-size").val(), 10) || 10
	};
}

function handleAttendanceSessionOut() {
	if ($("#sessionOutPermission").length > 0 && typeof redirectLoginPage === "function") {
		redirectLoginPage();
		return true;
	}
	return false;
}

function handleAttendanceResponseError(jqXHR) {
	if (jqXHR && jqXHR.status === 401) {
		return handleAttendanceSessionOut();
	}
	if (typeof checkonlineOfflineStatus === "function" && checkonlineOfflineStatus()) {
		return true;
	}
	if (typeof showMessageTheme2 === "function") {
		showMessageTheme2(0, (jqXHR && jqXHR.responseText) ? jqXHR.responseText : "Something went wrong. Please try again.", "", true);
	}
	return true;
}

function ajaxPost(path, data, onDone) {
	if(!getSession()){
		redirectLoginPage();
		return;
	}
	$.ajax({
		url: API_BASE + path,
		type: "POST",
		contentType: APPLICATION_JSON_VALUE,
		data: JSON.stringify(data),
		success: function (r) {
			if (r && r.status == "3") {
				handleAttendanceSessionOut();
				onDone(null);
				return;
			}
			if (r && (r.status == "0" || r.status == "2")) {
				if (typeof showMessageTheme2 === "function") {
					showMessageTheme2(0, r.message || "Unable to process request.", "", true);
				}
				onDone(null);
				return;
			}
			onDone(r);
		},
		error: function (jqXHR) {
			handleAttendanceResponseError(jqXHR);
			onDone(null);
		}
	});
}
function searchAttendance() { currentPage = 1; loadTable(); }
function loadTable() {
	ajaxPost("/table", collectFilters(currentPage), function (res) {
		if (!res) { return; }
		renderStats(res.statCards); renderRows(res.rows || []); renderPagination(res);
	});
}
function renderStats(s) {
	if (!s) { return; }
	if (ADMIN_VIEW) { $("#s-teachers").text(s.teachersWhoTookClass == null ? 0 : s.teachersWhoTookClass); }
	$("#s-classes").text(s.classesConducted);
	$("#s-ontime").text((s.onTimeRatePct || 0) + "%");
	$("#s-duration").text((s.avgDurationMin || 0) + " min");
	$("#s-talk").text((s.avgTalkTimePct || 0) + "%");
}
function typePill(t) {
	var map = { "group":["groups","Group","badge-primary"], "one-to-one":["person","One to One","badge-info"],
		"ptm":["family_restroom","PTM","badge-warning"], "custom-class":["tune","Custom Class","badge-success"],
		"activity":["sports_esports","Activity","badge-secondary"] };
	var m = map[t] || map["group"];
	return '<span class="badge badge-pill ' + m[2] + '"><i class="material-icons" style="font-size:13px;vertical-align:middle">' + m[0] + '</i> ' + m[1] + '</span>';
}
function statusPill(s) {
	if (s === "ontime") { return '<span class="badge badge-pill badge-success">On time</span>'; }
	if (s === "late") { return '<span class="badge badge-pill badge-danger">Late</span>'; }
	if (s === "early") { return '<span class="badge badge-pill badge-primary">Early</span>'; }
	return '<span class="badge badge-pill badge-secondary">-</span>';
}
// Trims the demo/versioning suffix off a class title, e.g. "Elementary Technology Grade 5 v19 (GS) (Master)." -> "Elementary Technology Grade 5".
function formatClassTitle(title) {
	return String(title || "").replace(/\s+v\d+[\s\S]*$/i, "").trim();
}
function esc(v) { return $("<div>").text(v == null ? "" : v).html(); }
function renderRows(rows) {
	var body = $("#table-body");
	if (!rows.length) {
		var cols = ADMIN_VIEW ? 9 : 8;
		body.html('<tr><td colspan="' + cols + '" class="text-center text-muted p-4">No classes found for the selected filters.</td></tr>');
		return;
	}
	var html = "";
	for (var i = 0; i < rows.length; i++) {
		var c = rows[i];
		html += "<tr>";
		html += '<td><div class="font-weight-bold">' + esc(formatClassTitle(c.classTitle)) + '</div><div class="font-11 text-muted mt-1">' + esc(c.grade) + '</div></td>';
		if (ADMIN_VIEW) { html += '<td>' + esc(c.teacherName) + '</td>'; }
		html += '<td>' + typePill(c.classType) + '</td>';
		html += '<td>' + esc(c.meetingDate) + '<div class="font-11 text-muted mt-1">' + esc(c.meetingTime) + '</div></td>';
		html += '<td>' + esc(c.joinTime) + '<div class="font-11 text-muted mt-1">to ' + esc(c.leaveTime) + '</div></td>';
		html += '<td>' + statusPill(c.status) + '</td>';
		html += '<td>' + (c.durationMin || 0) + ' min</td>';
		var vmid = (c.vendorMeetingId || "").replace(/'/g, "");
		html += '<td><span class="text-primary font-weight-bold text-underline" style="cursor:pointer" onclick="openStudentWise(\'' + vmid + '\')">' + (c.presentCount || 0) + '/' + (c.totalCount || 0) + '</span></td>';
		html += '<td><button class="btn btn-sm btn-outline-primary" onclick="openDetails(' + c.meetingId + ',\'' + vmid + '\')">Details</button></td>';
		html += "</tr>";
	}
	body.html(html);
}
function renderPagination(res) {
	var totalPages = res.totalPages || 0;
	var cur = res.page;
	var from = res.totalRecords === 0 ? 0 : (cur - 1) * res.pageSize + 1;
	var to = Math.min(cur * res.pageSize, res.totalRecords);
	var info = 'Showing ' + from + ' to ' + to + ' of ' + res.totalRecords + ' entries';
	var btns = '<li' + (cur <= 1 ? ' class="disabled"' : '') + '><a href="javascript:void(0)" onclick="goPage(' + (cur - 1) + ')">Prev</a></li>';
	var win = pageWindow(cur, totalPages);
	for (var i = 0; i < win.length; i++) {
		if (win[i] === '...') {
			btns += '<li class="disabled"><span>&hellip;</span></li>';
		} else {
			btns += '<li' + (win[i] === cur ? ' class="active"' : '') + '><a href="javascript:void(0)" onclick="goPage(' + win[i] + ')">' + win[i] + '</a></li>';
		}
	}
	btns += '<li' + (cur >= totalPages ? ' class="disabled"' : '') + '><a href="javascript:void(0)" onclick="goPage(' + (cur + 1) + ')">Next</a></li>';
	$("#pagination").html('<div class="font-12 text-muted mb-2">' + info + '</div><ul class="pagination mb-0">' + btns + '</ul>');
}
// First page, last page, and a small window around the current page; gaps become "…".
function pageWindow(cur, total) {
	var out = [];
	if (total <= 0) { return out; }
	var range = [1];
	for (var i = cur - 1; i <= cur + 1; i++) { if (i > 1 && i < total) { range.push(i); } }
	if (total > 1) { range.push(total); }
	range = range.filter(function (v, idx, a) { return a.indexOf(v) === idx; }).sort(function (a, b) { return a - b; });
	var prev = 0;
	for (var j = 0; j < range.length; j++) {
		if (range[j] - prev > 1) { out.push('...'); }
		out.push(range[j]); prev = range[j];
	}
	return out;
}
function goPage(p) { if (p < 1) { return; } currentPage = p; loadTable(); }
function changePageSize() { currentPage = 1; loadTable(); }
function onRangeChange() {
	var custom = $("#f-range").val() === "custom";
	$("#grp-from,#grp-to").toggle(custom);
	if (!custom) { $("#f-from").val(""); $("#f-to").val(""); }
}
function resetFilters() {
	$("#f-type,#f-program,#f-sort").each(function () { this.selectedIndex = 0; });
	$("#f-grade,#f-course").val("all");
	$("#f-batch").val("all").prop("disabled", true);
	$("#f-student,#f-teacher").val("");
	$("#f-range").val("today"); $("#f-from,#f-to").val(""); $("#grp-from,#grp-to").hide();
	$("#page-size").val("10"); currentPage = 1;
	loadDependentOptions();
	loadTable();
}
function populateSelect(id, opts, allLabel) {
	var sel = $(id); var cur = sel.val();
	var html = '<option value="all">' + allLabel + '</option>';
	for (var i = 0; i < opts.length; i++) {
		html += '<option value="' + esc(opts[i].value) + '">' + esc(opts[i].label) + '</option>';
	}
	sel.html(html);
	if (cur && sel.find("option[value='" + cur + "']").length) { sel.val(cur); } else { sel.val("all"); }
}
function loadFilterOptions() {
	ajaxPost("/filter-options", collectFilters(1), function (res) {
		if (!res) { return; }
		populateSelect("#f-grade", res.grades || [], "All Grades");
	});
}
// Course depends on Grade (+ Learning Program); Batch depends on Grade and only for Type=group.
function loadDependentOptions() {
	var isGroup = $("#f-type").val() === "group";
	ajaxPost("/dependent-options", collectFilters(1), function (res) {
		if (!res) { return; }
		populateSelect("#f-course", res.courses || [], "All Courses");
		if (isGroup) {
			populateSelect("#f-batch", res.batches || [], "All Batches");
			$("#f-batch").prop("disabled", false);
		} else {
			populateSelect("#f-batch", [], "All Batches");
			$("#f-batch").prop("disabled", true);
		}
	});
}
function onTypeChange() {
	if ($("#f-type").val() !== "group") { $("#f-batch").val("all").prop("disabled", true); }
	loadDependentOptions();
}
function ensureMaterialIcons() {
	if (!document.getElementById("attn-material-icons")) {
		var mi = document.createElement("link");
		mi.id = "attn-material-icons"; mi.rel = "stylesheet";
		mi.href = "https://fonts.googleapis.com/icon?family=Material+Icons";
		document.head.appendChild(mi);
	}
}
function ensureChart(cb) {
	if (typeof Chart !== "undefined") { cb(); return; }
	var s = document.createElement("script");
	s.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js";
	s.onload = cb; document.head.appendChild(s);
}
function openDetails(meetingId, vendorMeetingId) {
	ajaxPost("/class-detail", { euid: EUID, meetingId: meetingId, vendorMeetingId: vendorMeetingId }, function (res) {
		if (!res) { return; }
		$("#m-title").text(formatClassTitle(res.classTitle) || "");
		$("#m-sub").text((res.grade || "") + "  |  " + (res.date || "") + "  " + (res.time || ""));
		var punct = res.status === "ontime" ? "On time" : res.status === "late" ? "Late" : res.status === "early" ? "Early" : "-";
		$("#m-teacher-detail").html(
			detailItem("Join Time", res.joinTime) + detailItem("Leave Time", res.leaveTime) + detailItem("Punctuality", punct) +
			detailItem("Duration", (res.durationMin || 0) + " min") +
			detailItem("Teacher Talk Time", (res.talkTime ? res.talkTime.teacher : 0) + "%") +
			detailItem("Student Talk Time", (res.talkTime ? res.talkTime.student : 0) + "%"));
		var t = res.talkTime || { teacher: 0, student: 0, other: 0 };
		$("#m-talk-legend").html(legend("#1565c0", "Teacher speaking", t.teacher) + legend("#34a853", "Students", t.student) + legend("#e8eaed", "Silence/Other", t.other));

		// DB summary comes with /class-detail; only generate when there is none.
		if (res.rawAiSummary) {
			$("#m-ai-summary").html(renderAiSummaryHtml(res.rawAiSummary, res.aiSummary));
		} else if (res.entityId) {
			showAttendanceAiLoader();
			fetchAndRenderAttendanceAiSummary(res.meetingId, res.entityId, res.entityName);
		} else {
			$("#m-ai-summary").html(renderAiSummaryHtml(null, []));
		}

		ensureChart(function () {
			if (talkChart) { talkChart.destroy(); }
			talkChart = new Chart(document.getElementById("m-talk-chart"), {
				type: "doughnut",
				data: { labels: ["Teacher", "Students", "Other"], datasets: [{ data: [t.teacher, t.student, t.other], backgroundColor: ["#1565c0", "#34a853", "#e8eaed"], borderColor: ["#1565c0", "#34a853", "#9aa0a6"], borderWidth: 1 }] },
				options: { responsive: false, plugins: { legend: { display: false } }, cutout: "68%" }
			});
		});
		$("#detailModal").modal("show");
	});
}

/** Shows a spinner inside the AI summary block. */
function showAttendanceAiLoader() {
	$("#m-ai-summary").html(
		"<div style='text-align:center;padding:12px;color:#7b1fa2'>" +
		"<i class='fa fa-spinner fa-spin' style='font-size:18px'></i>" +
		" <span style='font-size:13px;vertical-align:middle;margin-left:6px'>Generating AI Summary…</span>" +
		"</div>"
	);
}

/** Asks ai/summary for the summary; polls when generation is still running. */
function fetchAndRenderAttendanceAiSummary(meetingId, entityId, entityName) {
	if (window._attendanceAiPoll) { clearInterval(window._attendanceAiPoll); window._attendanceAiPoll = null; }

	var payload = {
		model: (typeof AI_MODEL !== "undefined" ? AI_MODEL : "deepseek-ai"),
		userId: (typeof USER_ID !== "undefined" ? USER_ID : 0),
		entityType: entityName,
		entityId: entityId,
		forceGenerate: false
	};
	var ajaxReqDetails = {
		method: "POST",
		url: (typeof APP_BASE_URL !== "undefined" ? APP_BASE_URL : (BASE_URL + CONTEXT_PATH)) + "ai/summary",
		body: payload,
		global: false,
		showMessage: false,
		onFaildResolved: true,
		onSuccessResolved: true
	};
	callCommonAjax(ajaxReqDetails).then(function (data) {
		if (!data || !data.details) {
			pollAttendanceAiSummary(meetingId, entityId, entityName);
			return;
		}
		var summary = data.details.ollamaSummary || null;
		if (summary) {
			$("#m-ai-summary").html(renderAiSummaryHtml(summary, []));
		} else if (data.details.transcriptAvailable === false) {
			// No transcript => nothing will ever be generated. Stop, don't poll.
			$("#m-ai-summary").html(renderAiSummaryHtml(null, []));
		} else {
			pollAttendanceAiSummary(meetingId, entityId, entityName);
		}
	}).catch(function () {
		$("#m-ai-summary").html(renderAiSummaryHtml(null, []));
	});
}

/** Polls ai/summary-status every 30 s until the summary arrives or the modal closes. */
function pollAttendanceAiSummary(meetingId, entityId, entityName) {
	var attempts = 0;
	var MAX_ATTEMPTS = 20; // ~10 min safety cap; stops the loader if generation never completes.
	window._attendanceAiPoll = setInterval(function () {
		if (!$("#detailModal").hasClass("show") && !$("#detailModal").is(":visible")) {
			clearInterval(window._attendanceAiPoll); window._attendanceAiPoll = null;
			return;
		}
		if (++attempts > MAX_ATTEMPTS) {
			clearInterval(window._attendanceAiPoll); window._attendanceAiPoll = null;
			$("#m-ai-summary").html(renderAiSummaryHtml(null, []));
			return;
		}
		var payload = {
			model: (typeof AI_MODEL !== "undefined" ? AI_MODEL : "deepseek-ai"),
			entityType: entityName,
			entityId: entityId
		};
		var ajaxReqDetails = {
			method: "POST",
			url: (typeof APP_BASE_URL !== "undefined" ? APP_BASE_URL : (BASE_URL + CONTEXT_PATH)) + "ai/summary-status",
			body: payload,
			global: false,
			showMessage: false
		};
		callCommonAjax(ajaxReqDetails).then(function (statusData) {
			if (statusData && statusData.details && statusData.details.ollamaSummary) {
				clearInterval(window._attendanceAiPoll); window._attendanceAiPoll = null;
				$("#m-ai-summary").html(renderAiSummaryHtml(statusData.details.ollamaSummary, []));
			}
		});
	}, 30000);
}

// Stop polling when detail modal is closed
$(document).on("hidden.bs.modal", "#detailModal", function () {
	if (window._attendanceAiPoll) { clearInterval(window._attendanceAiPoll); window._attendanceAiPoll = null; }
});
function detailItem(l, v) { return '<div class="col-4 mb-2"><div class="bg-light rounded-10 p-3 h-100"><div class="font-10 text-uppercase font-weight-bold text-muted">' + esc(l) + '</div><div class="font-15 font-weight-bold text-dark mt-1">' + esc(v) + '</div></div></div>'; }
function legend(col, txt, val) { return '<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px"><span style="width:11px;height:11px;border-radius:50%;background:' + col + ';border:1px solid #9aa0a6;box-sizing:border-box"></span><span style="flex:1;font-size:12px;color:#3c4043">' + txt + '</span><strong style="font-size:13px">' + (val || 0) + '%</strong></div>'; }

/**
 * Renders the AI summary exactly as it appears in the teacher-class-review
 * Deepseek AI Summary panel. Markdown subset supported:
 *   **text**        → <strong>text</strong>
 *   ### / ## / #    → bold section heading (same purple colour as panel header)
 *   * text / - text → <li> inside a <ul>
 *   blank line      → paragraph break / close an open list
 *
 * Falls back to the legacy aiSummary bullet list when rawAiSummary is absent.
 */
function renderAiSummaryHtml(raw, fallbackBullets) {
	if (!raw || !raw.trim()) {
		var ai = fallbackBullets || [];
		return ai.length
			? "<ul style='margin:0;padding-left:18px'>" + ai.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>"
			: "<span style='color:#9aa0a6;font-style:italic'>No AI summary available for this class.</span>";
	}

	var lines = raw.split(/\r?\n/);
	var html = "";
	var inList = false;

	for (var i = 0; i < lines.length; i++) {
		var line = lines[i];

		// blank line — close list, add paragraph gap
		if (!line.trim()) {
			if (inList) { html += "</ul>"; inList = false; }
			html += "<div style='height:6px'></div>";
			continue;
		}

		// heading: ### text or **text** on its own line (Deepseek section headers)
		var headingMatch = line.match(/^#{1,3}\s+(.+)$/) || (line.match(/^\*\*(.+)\*\*$/) ? ["", line.replace(/\*\*/g, "")] : null);
		if (headingMatch) {
			if (inList) { html += "</ul>"; inList = false; }
			html += "<div style='font-size:13px;font-weight:700;color:#4a148c;margin-top:10px;margin-bottom:4px'>" + esc(headingMatch[1].trim()) + "</div>";
			continue;
		}

		// bullet: * text or - text (but not ** which is bold)
		var bulletMatch = line.match(/^[\*\-]\s+(.+)$/) && !line.match(/^\*\*/);
		if (bulletMatch) {
			if (!inList) { html += "<ul style='margin:4px 0;padding-left:18px'>"; inList = true; }
			html += "<li>" + formatInline(line.replace(/^[\*\-]\s+/, "")) + "</li>";
			continue;
		}

		// numbered list: 1. text
		var numberedMatch = line.match(/^\d+\.\s+(.+)$/);
		if (numberedMatch) {
			if (!inList) { html += "<ul style='margin:4px 0;padding-left:18px'>"; inList = true; }
			html += "<li>" + formatInline(numberedMatch[1]) + "</li>";
			continue;
		}

		// plain paragraph line
		if (inList) { html += "</ul>"; inList = false; }
		html += "<div style='margin-bottom:3px'>" + formatInline(line) + "</div>";
	}

	if (inList) { html += "</ul>"; }
	return html;
}

/**
 * Handles inline markdown inside a line:
 *   **text** → <strong>text</strong>
 *   *text*   → <em>text</em>
 */
function formatInline(text) {
	return esc(text)
		.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
		.replace(/\*(.+?)\*/g, "<em>$1</em>");
}

function openStudentWise(vendorMeetingId) {
	ajaxPost("/student-wise", { euid: EUID, vendorMeetingId: vendorMeetingId }, function (res) {
		if (!res) { return; }
		$("#sm-title").text(formatClassTitle(res.classTitle) || "");
		$("#sm-sub").text((res.date || "") + "  " + (res.time || "") + "  |  " + (res.totalStudents || 0) + " students");
		currentStudents = res.students || []; activeStuFilter = null;
		$("#sm-att-summary").html(
			'<div class="card border-0 bg-light-success rounded-10 d-flex flex-row align-items-center p-3 mr-3 mb-2" data-key="present" data-stat style="cursor:pointer;flex:2;min-width:280px" onclick="toggleStuFilter(\'present\')">' +
				'<div class="text-center pr-3 mr-3 border-right"><span class="font-26 font-weight-bold d-block">' + (res.presentCount || 0) + '</span><span class="font-12 font-weight-bold">Present</span></div>' +
				'<div class="d-flex flex-wrap">' +
					subItem("early", "text-primary", "Early", res.earlyCount) +
					subItem("ontime", "text-success", "On time", res.onTimeCount) +
					subItem("late", "text-warning", "Late", res.lateCount) +
				'</div>' +
			'</div>' +
			'<div class="card border-0 bg-light-danger rounded-10 text-center p-3 mb-2" data-key="absent" data-stat style="cursor:pointer;flex:1;min-width:110px" onclick="toggleStuFilter(\'absent\')"><div class="font-22 font-weight-bold">' + (res.absentCount || 0) + '</div><div class="font-11 font-weight-bold">Absent</div></div>');
		$("#sm-search").val(""); renderStudents(); $("#stuModal").modal("show");
	});
}
function subItem(key, colorClass, lbl, val) {
	return '<div class="d-flex align-items-center mr-3" data-key="' + key + '" data-stat style="cursor:pointer" onclick="event.stopPropagation();toggleStuFilter(\'' + key + '\')"><i class="material-icons ' + colorClass + ' mr-1" style="font-size:11px">fiber_manual_record</i>' + lbl + ' <strong class="ml-1">' + (val || 0) + '</strong></div>';
}
function miniPill(s) {
	if (s === "ontime") { return '<span class="badge badge-pill badge-success">On time</span>'; }
	if (s === "early") { return '<span class="badge badge-pill badge-primary">Early</span>'; }
	if (s === "late") { return '<span class="badge badge-pill badge-warning">Late</span>'; }
	return '<span class="badge badge-pill badge-danger">Absent</span>';
}
function renderStudents() {
	var q = $.trim($("#sm-search").val()).toLowerCase();
	var rows = "";
	for (var i = 0; i < currentStudents.length; i++) {
		var st = currentStudents[i];
		if (activeStuFilter) {
			if (activeStuFilter === "present" && st.status === "absent") { continue; }
			if (activeStuFilter !== "present" && st.status !== activeStuFilter) { continue; }
		}
		if (q && (st.name || "").toLowerCase().indexOf(q) < 0) { continue; }
		var dur = st.status === "absent" ? "&mdash;" : (st.durationMin || 0) + " min";
		var talk = st.status === "absent" ? "&mdash;" : (st.talkPct || 0) + "%<div class='font-11 text-muted mt-1'>" + (st.talkMin || 0) + " min</div>";
		rows += "<tr><td><span class='d-flex align-items-center'><span class='rounded-circle bg-primary text-white font-12 font-weight-bold d-inline-flex align-items-center justify-content-center mr-2' style='width:30px;height:30px;flex-shrink:0'>" + initials(st.name) + "</span>" + esc(st.name) + "</span></td><td>" + esc(st.joinTime || "—") + "</td><td>" + esc(st.leaveTime || "—") + "</td><td>" + miniPill(st.status) + "</td><td>" + dur + "</td><td>" + talk + "</td></tr>";
	}
	$("#sm-body").html(rows || '<tr><td colspan="6" class="text-center text-muted p-4">No students.</td></tr>');
}
function initials(name) {
	var p = $.trim(name || "").split(/\s+/);
	var s = (p[0] ? p[0][0] : "") + (p.length > 1 ? p[p.length - 1][0] : "");
	return esc(s.toUpperCase() || "?");
}
function filterStudents() { renderStudents(); }
function toggleStuFilter(key) {
	activeStuFilter = activeStuFilter === key ? null : key;
	$("#sm-att-summary [data-stat]").removeClass("shadow border border-primary");
	if (activeStuFilter) { $("#sm-att-summary [data-key='" + activeStuFilter + "']").addClass("shadow border border-primary"); }
	renderStudents();
}
