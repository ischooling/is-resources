var DM_STATE = null;

function dmUrl(path) {
  return CONTEXT_PATH + SCHOOL_UUID + "/dashboard/demand-booking/" + path;
}

function dmEsc(v) {
  return String(v == null ? "" : v).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

function dmPost(path, body) {
  return $.ajax({ type: "POST", url: dmUrl(path), contentType: "application/json", dataType: "json", data: JSON.stringify(body), global: false });
}

async function demandBookingOpen(subjectId, roleModuleId, studentStandardId, weekLeftClassCount) {
  var fallback = function () {
    bookingSlotModalNew(subjectId, roleModuleId, studentStandardId, true, weekLeftClassCount, null, true);
  };
  customLoader(true);
  try {
    var data = { userId: USER_ID, subjectId: subjectId, roleModuleId: roleModuleId, studentStandardId: studentStandardId };
    var teacher = await $.ajax({
      type: "GET",
      contentType: APPLICATION_JSON_VALUE,
      url: getURLForHTML("dashboard", "student-subject-session-booking-new?payload=" + encode(JSON.stringify(data))),
      dataType: "json",
      cache: false
    });
    if (teacher["status"] == "3") {
      customLoader(false);
      redirectLoginPage();
      return;
    }
    if (teacher["status"] == "0" || teacher["status"] == "2" || teacher["teacherAssigned"] !== "YES") {
      customLoader(false);
      showMessageTheme2(2, teacher["message"] || "You do not have a teacher assigned yet", "", true);
      return;
    }
    var realSsId = teacher["studentStandardId"] || studentStandardId;
    var opts = await dmPost("options", { studentStandardId: realSsId, subjectId: subjectId, teacherUserId: teacher["assignedTeacherUserId"] });
    customLoader(false);
    if (!opts || !opts.enabled || !opts.days) {
      console.warn("Demand booking: using the old pop-up", opts);
      fallback();
      return;
    }
    DM_STATE = {
      subjectId: subjectId,
      roleModuleId: roleModuleId,
      studentStandardId: realSsId,
      cardStudentStandardId: studentStandardId,
      weekLeft: weekLeftClassCount,
      teacherUserId: teacher["assignedTeacherUserId"],
      opts: opts,
      sessionId: Date.now().toString(36) + Math.random().toString(36).slice(2, 10),
      date: null,
      time: null,
      result: null
    };
    dmEnsureStyles();
    $("#weeklyBookClassModal").modal("hide");
    $("#dmBookModal,#dmConfirmModal").remove();
    $("body").append(dmModalHtml());
    dmRenderDays();
  } catch (e) {
    console.warn("Demand booking: options call failed, using the old pop-up", e && e.status, e);
    customLoader(false);
    fallback();
  }
}

function dmModalHtml() {
  var o = DM_STATE.opts;
  return '<div class="dm-bg" id="dmBookModal" role="dialog" aria-modal="true" aria-labelledby="dmTitle"><div class="dm-modal">'
    + '<header><h3 id="dmTitle">Book a Class for ' + dmEsc(o.subjectName) + " with " + dmEsc(o.teacherName) + "</h3>"
    + '<button type="button" class="dm-x" aria-label="Close" onclick="dmClose()">&#10005;</button></header>'
    + '<div class="dm-body">'
    + '<div id="dmPick"><div class="dm-pk"><span class="dm-lbl">Choose a date</span><div class="dm-daystrip" id="dmDays"></div></div>'
    + '<div class="dm-pk dm-hidden" id="dmTimesWrap"><span class="dm-lbl">Choose your preferred time</span><div id="dmTimes"></div></div></div>'
    + '<div id="dmResult"></div></div>'
    + '<div class="dm-summary dm-hidden" id="dmSummary"></div>'
    + '<div class="dm-notes"><span>**All slots are in your timezone (' + dmEsc(o.timezone) + ")</span><span>**Duration of each class is " + dmEsc(o.duration) + " minutes</span></div>"
    + "</div></div>";
}

function dmRenderDays() {
  var html = "";
  $.each(DM_STATE.opts.days, function (i, d) {
    var dt = new Date(d.date + "T00:00:00");
    var sel = DM_STATE.date === d.date ? " sel" : "";
    html += '<button type="button" class="dm-day' + sel + '"' + (d.past ? " disabled" : "") + ' onclick="dmPickDate(\'' + d.date + "')\">"
      + "<small>" + dt.toLocaleDateString("en-US", { weekday: "short" }) + "</small><b>" + dt.getDate() + "</b><em>"
      + dt.toLocaleDateString("en-US", { month: "short" }) + "</em></button>";
  });
  $("#dmDays").html(html);
}

function dmPickDate(date) {
  DM_STATE.date = date;
  DM_STATE.time = null;
  dmRenderDays();
  dmRenderTimes();
  $("#dmTimesWrap").removeClass("dm-hidden");
  dmRenderSummary();
}

function dmMinutes(hhmm) {
  var p = hhmm.split(":");
  return parseInt(p[0], 10) * 60 + parseInt(p[1], 10);
}

function dmHhmm(m) {
  return String(Math.floor(m / 60)).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0");
}

function dmLabel(m) {
  var h = Math.floor(m / 60) % 24;
  var ap = h >= 12 ? "PM" : "AM";
  var h12 = h % 12 || 12;
  return String(h12).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0") + " " + ap;
}

function dmRenderTimes() {
  var o = DM_STATE.opts;
  var from = dmMinutes(o.pickerFrom), to = dmMinutes(o.pickerTo), step = o.pickerStep || 30;
  var groups = [["Morning", 0, 720], ["Afternoon", 720, 1020], ["Evening", 1020, 1441]];
  var html = "";
  $.each(groups, function (i, g) {
    var chips = "";
    for (var m = Math.max(from, g[1]); m <= to && m < g[2]; m += step) {
      var t = dmHhmm(m);
      var past = (DM_STATE.date + " " + t + ":00") < o.earliest;
      chips += '<button type="button" class="' + (DM_STATE.time === t ? "sel" : "") + '"' + (past ? " disabled" : "")
        + ' onclick="dmPickTime(\'' + t + "')\">" + dmLabel(m) + "</button>";
    }
    if (chips) {
      html += '<div class="dm-tgroup"><span>' + g[0] + '</span><div class="dm-chips">' + chips + "</div></div>";
    }
  });
  $("#dmTimes").html(html);
}

function dmPickTime(t) {
  DM_STATE.time = t;
  dmRenderTimes();
  dmRenderSummary();
}

function dmRenderSummary() {
  var o = DM_STATE.opts;
  if (!DM_STATE.date || !DM_STATE.time) {
    $("#dmSummary").addClass("dm-hidden").html("");
    return;
  }
  var m = dmMinutes(DM_STATE.time);
  var dt = new Date(DM_STATE.date + "T00:00:00");
  var initials = (o.teacherName || "").split(" ").map(function (w) { return w.charAt(0); }).join("").slice(0, 2).toUpperCase();
  $("#dmSummary").removeClass("dm-hidden").html(
    '<div class="dm-sumHead"><span class="dm-avatar">' + dmEsc(initials) + "</span><div><b>" + dmEsc(o.teacherName) + "</b><small>"
    + dmEsc(o.subjectName) + (o.gradeName ? " · " + dmEsc(o.gradeName) : "") + "</small></div></div>"
    + '<div class="dm-sumHero"><b>' + dt.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" }) + "</b><span>"
    + dmLabel(m) + " – " + dmLabel(m + parseInt(o.duration, 10)) + "</span></div>"
    + '<button type="button" class="dm-btn" id="dmBookBtn" onclick="dmRequest()">Book Class</button>');
}

function dmRequest() {
  $("#dmBookBtn").prop("disabled", true);
  dmPost("request", {
    studentStandardId: DM_STATE.studentStandardId,
    subjectId: DM_STATE.subjectId,
    teacherUserId: DM_STATE.teacherUserId,
    date: DM_STATE.date,
    time: DM_STATE.time,
    sessionId: DM_STATE.sessionId
  }).done(function (r) {
    if (!r || r.error) {
      $("#dmBookBtn").prop("disabled", false);
      showMessageTheme2(0, (r && r.error) || "Something went wrong. Please try again.", "", false);
      return;
    }
    DM_STATE.result = r;
    if (r.result === "AVAILABLE") {
      $("#dmBookBtn").prop("disabled", false);
      dmOpenConfirm(r.requested);
      return;
    }
    $("#dmPick,#dmSummary").addClass("dm-hidden");
    dmRenderResult();
  }).fail(function () {
    $("#dmBookBtn").prop("disabled", false);
    showMessageTheme2(0, "Something went wrong. Please try again.", "", false);
  });
}

function dmRenderResult() {
  var r = DM_STATE.result, o = DM_STATE.opts, q = r.requested;
  var html;
  if (r.result === "AVAILABLE") {
    html = '<div class="dm-match"><div class="dm-big">Great news — ' + dmEsc(q.startLabel) + " on " + dmEsc(q.dateLabel) + " is free!</div>"
      + '<button type="button" class="dm-btn dm-ok" onclick="dmOpenConfirm(DM_STATE.result.requested)">Confirm</button></div>';
  } else if (r.result === "NEAREST") {
    var alts = "";
    $.each(r.nearest, function (i, s) {
      alts += '<button type="button" class="dm-alt" onclick="dmOpenConfirm(DM_STATE.result.nearest[' + i + '])"><small>' + dmEsc(s.dateLabel) + "</small><b>" + dmEsc(s.startLabel) + "</b></button>";
    });
    html = '<div class="dm-nomatch"><p>Oh no! <span class="dm-reqchip">' + dmEsc(q.startLabel) + " on " + dmEsc(q.dateLabel) + "</span> is already taken with "
      + dmEsc(o.teacherName) + ". Here are the closest free slots — just tap one to book it:</p><div class=\"dm-alts\">" + alts + "</div>"
      + '<div class="dm-actions"><button type="button" class="dm-btn dm-ghost" onclick="dmViewAll()">View all slots</button>'
      + '<button type="button" class="dm-btn" onclick="dmPickAnother()">Pick another time</button></div></div>';
  } else {
    html = '<div class="dm-nomatch"><p>' + dmEsc(o.teacherName) + " is fully booked this week. Please try another week.</p>"
      + '<div class="dm-actions"><button type="button" class="dm-btn" onclick="dmPickAnother()">Pick another time</button></div></div>';
  }
  $("#dmResult").html(html);
}

function dmPickAnother() {
  DM_STATE.time = null;
  DM_STATE.result = null;
  $("#dmResult").html("");
  $("#dmPick").removeClass("dm-hidden");
  dmRenderTimes();
  dmRenderSummary();
}

function dmViewAll() {
  var s = DM_STATE;
  $("#dmBookModal").remove();
  bookingSlotModalNew(s.subjectId, s.roleModuleId, s.cardStudentStandardId, true, s.weekLeft, null, true);
}

function dmClose() {
  $("#dmBookModal,#dmConfirmModal").remove();
  DM_STATE = null;
}

function dmOpenConfirm(slot) {
  var o = DM_STATE.opts;
  DM_STATE.slot = slot;
  $("#dmConfirmModal").remove();
  $("body").append('<div class="dm-bg dm-top" id="dmConfirmModal" role="dialog" aria-modal="true" aria-labelledby="dmConfirmTitle"><div class="dm-modal dm-sm">'
    + '<header><h3 id="dmConfirmTitle">Confirm Booking</h3><button type="button" class="dm-x" aria-label="Close" onclick="dmCancelConfirm()">&#10005;</button></header>'
    + '<div class="dm-body"><div class="dm-confirm">'
    + "<div><small>Course</small><b>" + dmEsc(o.subjectName) + "</b></div>"
    + "<div><small>Teacher</small><b>" + dmEsc(o.teacherName) + "</b></div>"
    + "<div><small>Date</small><b>" + dmEsc(slot.dateLabel) + "</b></div>"
    + "<div><small>Time (" + dmEsc(o.timezone) + ")</small><b>" + dmEsc(slot.startLabel) + " – " + dmEsc(slot.endLabel) + "</b></div>"
    + "<div><small>Duration</small><b>" + dmEsc(o.duration) + " minutes</b></div></div></div>"
    + '<footer><button type="button" class="dm-btn dm-danger" onclick="dmCancelConfirm()">Cancel</button>'
    + '<button type="button" class="dm-btn dm-ok" id="dmConfirmBtn" onclick="dmSubmit()">Confirm</button></footer></div></div>');
}

function dmCancelConfirm() {
  $("#dmConfirmModal").remove();
  if (DM_STATE && DM_STATE.result && DM_STATE.result.result === "AVAILABLE") {
    dmPickAnother();
  }
}

function dmSubmit() {
  var s = DM_STATE, slot = s.slot;
  if (s.submitting) {
    return;
  }
  s.submitting = true;
  $("#dmConfirmBtn").prop("disabled", true).text("Booking...");
  var request = {
    authentication: { hash: getHash(), schoolId: SCHOOL_ID, schoolUUID: SCHOOL_UUID, userType: s.roleModuleId, userId: USER_ID },
    meetingSlotDTO: {
      meetingPersoneId: USER_ID,
      meetingDate: slot.meetingStart,
      meetingEndDate: slot.meetingEnd,
      meetingType: "STUDENT_DOUBT_SESSION",
      subjectId: s.subjectId,
      studentStandardId: s.cardStudentStandardId,
      teachUserId: s.teacherUserId,
      schoolPersonId: s.teacherUserId,
      schoolId: SCHOOL_ID,
      meetingVendor: "LENS"
    }
  };
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLForHTML("dashboard", "student-book-session-slots-submit-new"),
    data: JSON.stringify(request),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      s.submitting = false;
      if (data["status"] == "0" || data["status"] == "2") {
        $("#dmConfirmBtn").prop("disabled", false).text("Confirm");
        showMessageTheme2(0, data["message"], "", false);
        return;
      }
      demandLinkBooking(slot.meetingStart);
      showMessageTheme2(1, data["message"], "", false);
      dmClose();
      setTimeout(function () {
        renderBookClassContent(`${data.studentStandardId}`, `${s.roleModuleId}`, $("#classPlanCount").attr("data-classPlanCount"), false, `${s.roleModuleId}`);
      }, 1000);
    },
    error: function () {
      $("#dmConfirmBtn").text("Confirm");
      showMessageTheme2(0, "We could not confirm whether your class was booked. Please refresh the page and check your booked classes before trying again.", "", false);
    }
  });
}

function demandLinkBooking(meetingStart) {
  if (!DM_STATE || !DM_STATE.sessionId || !meetingStart) {
    return;
  }
  dmPost("booked", { studentStandardId: DM_STATE.studentStandardId, sessionId: DM_STATE.sessionId, meetingStart: meetingStart });
}

function dmEnsureStyles() {
  if (document.getElementById("dmStyles")) {
    return;
  }
  var css = ".dm-bg{--blue:#1a7dff;--blue-soft:#e8f1ff;--blue-dark:#0b5ed7;--ink:#1f2a37;--muted:#6b7684;--line:#dfe4ea;--ok:#1f9d55;--ok-soft:#d8f3e1;--bad:#e03a3a;--bad-soft:#fde2e2;--na-soft:#eef0f3;"
    + "position:fixed;inset:0;background:rgba(10,20,40,.45);display:flex;align-items:center;justify-content:center;padding:16px;z-index:1050;color:var(--ink)}"
    + ".dm-bg.dm-top{z-index:1060}"
    + ".dm-modal{background:#fff;border-radius:10px;width:min(980px,100%);max-height:94vh;display:flex;flex-direction:column;overflow:hidden}"
    + ".dm-modal.dm-sm{width:min(560px,100%)}"
    + ".dm-modal header{background:var(--pc,var(--blue));color:#fff;padding:12px 18px;display:flex;align-items:center;gap:12px}"
    + ".dm-modal header h3{margin:0;font-size:20px;font-weight:500;flex:1;line-height:1.25;color:#fff}"
    + ".dm-x{background:#e03a3a;color:#fff;border:0;border-radius:4px;width:30px;height:30px;font-size:16px;cursor:pointer}"
    + ".dm-body{padding:18px;overflow:auto;flex:1}"
    + ".dm-modal footer{border-top:1px solid var(--line);padding:12px 18px;display:flex;gap:10px;justify-content:flex-end}"
    + ".dm-hidden{display:none !important}"
    + ".dm-pk{margin-bottom:12px}.dm-lbl{display:block;font-size:16px;font-weight:600;margin-bottom:8px}"
    + ".dm-daystrip{display:grid;grid-template-columns:repeat(7,1fr);gap:8px}"
    + ".dm-day{border:1px solid var(--blue);background:#fff;color:var(--blue);border-radius:8px;padding:8px 4px 7px;display:flex;flex-direction:column;align-items:center;cursor:pointer}"
    + ".dm-day small,.dm-day em{font-size:12px;font-style:normal;color:inherit}.dm-day b{font-size:22px;font-weight:600;line-height:1.1}"
    + ".dm-day:hover:not(:disabled){background:var(--blue-soft)}.dm-day.sel{background:var(--blue);color:#fff}"
    + ".dm-day:disabled{background:var(--na-soft);border-color:transparent;color:#b4bcc6;cursor:not-allowed}"
    + ".dm-tgroup{margin-bottom:8px}.dm-tgroup>span{display:block;font-size:14px;font-weight:700;margin-bottom:5px}"
    + ".dm-chips{display:grid;grid-template-columns:repeat(auto-fill,minmax(84px,1fr));gap:6px}"
    + ".dm-chips button{border:1px solid var(--blue);background:#fff;color:var(--blue);border-radius:6px;padding:4px 0;font-size:13px;cursor:pointer;font-variant-numeric:tabular-nums}"
    + ".dm-chips button:hover:not(:disabled){background:var(--blue-soft)}.dm-chips button.sel{background:var(--blue);color:#fff}"
    + ".dm-chips button:disabled{color:#b4bcc6;background:var(--na-soft);border-color:var(--line);cursor:not-allowed}"
    + ".dm-summary{display:flex;align-items:center;gap:22px;flex-wrap:wrap;background:#f7f9fc;border-top:1px solid var(--line);padding:10px 18px;box-shadow:0 -6px 16px rgba(15,35,70,.06)}"
    + ".dm-sumHead{display:flex;align-items:center;gap:10px}.dm-sumHead b,.dm-sumHero b{display:block;font-weight:600;font-size:16px;line-height:1.2}"
    + ".dm-sumHead small{font-size:14px}.dm-sumHero{border-left:1px solid var(--line);padding:2px 0 2px 22px}.dm-sumHero span{display:block;font-size:14px;color:var(--muted)}"
    + ".dm-avatar{width:36px;height:36px;border-radius:50%;background:var(--blue-soft);color:var(--blue-dark);font-weight:700;display:flex;align-items:center;justify-content:center;font-size:13px}"
    + ".dm-summary .dm-btn{margin-left:auto}"
    + ".dm-btn{border:1px solid var(--blue);background:var(--blue);color:#fff;border-radius:6px;padding:7px 16px;cursor:pointer;font-size:14px}"
    + ".dm-btn:disabled{opacity:.5;cursor:not-allowed}.dm-btn.dm-ghost{background:#fff;color:var(--blue)}"
    + ".dm-btn.dm-ok{background:#28a745;border-color:#28a745}.dm-btn.dm-danger{background:#dc3545;border-color:#dc3545}"
    + ".dm-notes{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;font-weight:600;font-size:14px;padding:10px 18px;border-top:1px solid var(--line)}"
    + ".dm-match{border:2px solid var(--ok);background:var(--ok-soft);border-radius:10px;padding:16px 18px;display:flex;gap:16px;align-items:center;flex-wrap:wrap}"
    + ".dm-big{font-size:20px;font-weight:600;flex:1}"
    + ".dm-nomatch{border:1px solid var(--line);border-radius:10px;padding:14px 18px}.dm-nomatch p{margin:0 0 12px}"
    + ".dm-reqchip{display:inline-block;border:1px solid var(--bad);color:#b42323;background:var(--bad-soft);border-radius:6px;padding:1px 8px;font-weight:600}"
    + ".dm-alts{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px}"
    + ".dm-alt{border:1px solid var(--ok);border-radius:6px;padding:6px 14px;background:var(--ok-soft);color:var(--ink);cursor:pointer;font-size:14px}"
    + ".dm-alt:hover{background:#c6ecd3}.dm-alt b::before{content:'\\00b7';margin:0 6px;font-weight:400}"
    + ".dm-actions{display:flex;gap:8px;flex-wrap:wrap}"
    + ".dm-confirm{display:grid;grid-template-columns:1fr 1fr;gap:10px 24px}.dm-confirm div{padding:6px 0;border-bottom:1px solid var(--line)}"
    + ".dm-confirm small{display:block;color:var(--muted);font-size:12px}.dm-confirm b{font-weight:600}"
    + "@media (max-width:600px){.dm-daystrip{grid-template-columns:repeat(4,1fr)}.dm-confirm{grid-template-columns:1fr}.dm-sumHero{border-left:0;padding-left:0}}";
  $('<style id="dmStyles"></style>').text(css).appendTo("head");
}
