var DA = { period: "WEEK", tab: "peak", combined: false, sort: "most", data: null, options: null, last: {} };
var DA_PROGRAMS = [["ONE_TO_ONE", "One-to-one"], ["SSP", "Self Study Plus"], ["ONE_TO_ONE_FLEX", "Flexy"], ["DUAL_DIPLOMA", "Dual Diploma"], ["BATCH", "Group (extra 1:1)"]];

function daUrl(path) {
  return CONTEXT_PATH + SCHOOL_UUID + "/dashboard/demand-analytics/" + path;
}

function daEsc(v) {
  return String(v == null ? "" : v).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

function daPost(path, body) {
  return $.ajax({ type: "POST", url: daUrl(path), contentType: "application/json", dataType: "json", data: JSON.stringify(body || {}), global: false });
}

function daOffsetLabel(m) {
  var a = Math.abs(m);
  return "UTC" + (m < 0 ? "−" : "+") + String(Math.floor(a / 60)).padStart(2, "0") + ":" + String(a % 60).padStart(2, "0");
}

async function renderDemandAnalytics() {
  daEnsureStyles();
  $("#dashboardContentInHTML").html(daPageHtml());
  daLoadTimezones();
  $("#daPeriod").on("change", function () {
    DA.period = $(this).val();
    $(".daCustom").toggleClass("da-hidden", DA.period !== "CUSTOM");
  });
  if ($.fn.datepicker) {
    $("#daFrom,#daTo").datepicker({ autoclose: true, format: "M dd, yyyy" });
  }
  try {
    var o = await daPost("options");
    if (o.status != "1") {
      $("#daMain").html('<p class="da-muted">' + daEsc(o.message) + "</p>");
      return;
    }
    DA.options = o;
    daFillOptions();
    daSearch();
  } catch (e) {
    $("#daMain").html('<p class="da-muted">Demand Analytics could not be loaded. Please try again.</p>');
  }
}

function daField(cls, control, label) {
  return '<label class="da-field ' + (cls || "") + '">' + label + control.replace(/ class="form-control"/g, "") + "</label>";
}

function daPageHtml() {
  var hourOpts = '<option value="">Any</option>';
  for (var h = 0; h <= 24; h++) {
    hourOpts += '<option value="' + h + '">' + String(h).padStart(2, "0") + ":00</option>";
  }
  var progOpts = '<option value="">All programs</option>' + DA_PROGRAMS.map(function (p) { return '<option value="' + p[0] + '">' + p[1] + "</option>"; }).join("");
  var chev = '<svg class="da-ico da-ico-sm" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
  return '<div class="da">'
    + '<div class="app-page-title mb-3 py-2"><div class="page-title-wrapper"><div class="page-title-heading">'
    + '<div class="page-title-icon"><i class="fas fa-chart-line text-primary"></i></div><div>Demand Analytics'
    + '<div class="page-title-subheading">What students asked for, what they got, and where teacher hours sit idle. Weeks run Sunday to Saturday.</div></div></div></div></div>'
    + '<section class="da-card da-adv open" id="daAdv"><div class="da-card-head"><div><h2>Filters</h2><p><span id="daSummary"></span></p></div>'
    + '<button type="button" class="da-toggle" id="daToggle" aria-expanded="true" onclick="daToggleFilters()"><span id="daToggleText">Hide filters</span> ' + chev + '</button></div>'
    + '<form id="daFilterForm" class="da-filters" onsubmit="return false">'
    + daField("", '<select class="form-control" id="daPeriod"><option value="TODAY">Today</option><option value="WEEK" selected>This week</option><option value="MONTH">Month</option><option value="YEAR">Year</option><option value="CUSTOM">Custom</option></select>', "Period")
    + daField("daCustom da-hidden", '<input type="text" class="form-control" id="daFrom" readonly placeholder=" ">', "Start date")
    + daField("daCustom da-hidden", '<input type="text" class="form-control" id="daTo" readonly placeholder=" ">', "End date")
    + daField("", '<select class="form-control" id="daTzFrom"></select>', "Student timezone from")
    + daField("", '<select class="form-control" id="daTzTo"></select>', "Student timezone to")
    + daField("", '<select class="form-control" id="daLocalFrom">' + hourOpts + "</select>", "Time from (SGT)")
    + daField("", '<select class="form-control" id="daLocalTo">' + hourOpts + "</select>", "Time to (SGT)")
    + daField("", '<select class="form-control" id="daGrade" onchange="daFillCourses()"><option value="">All grades</option></select>', "Grade")
    + daField("", '<select class="form-control" id="daProgram">' + progOpts + "</select>", "Learning program")
    + daField("", '<select class="form-control" id="daCourse"><option value="">All courses</option></select>', "Course")
    + daField("", '<input type="text" class="form-control" id="daTeacher" placeholder="Name or email">', "Teacher")
    + daField("", '<select class="form-control" id="daStatus"><option value="">Any status</option><option value="FULFILLED">Fulfilled</option><option value="UNFULFILLED">Unfulfilled</option></select>', "Request status")
    + '<div class="da-filters-actions"><button type="button" class="da-btn da-btn-ghost" onclick="daReset()">'
    + '<svg class="da-ico da-ico-sm" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>Reset</button>'
    + '<button type="button" class="da-btn da-btn-primary" onclick="daSearch(true)">'
    + '<svg class="da-ico da-ico-sm" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>Apply filters</button></div>'
    + "</form></section>"
    + '<div id="daMain"><p class="da-muted">Loading…</p></div></div>';
}

function daToggleFilters() {
  var open = !$("#daAdv").hasClass("open");
  $("#daAdv").toggleClass("open", open);
  $("#daToggle").attr("aria-expanded", String(open));
  $("#daToggleText").text(open ? "Hide filters" : "Show filters");
}

function daOffsetMinutes(v) {
  if (!v) {
    return "";
  }
  var m = /^([+-−])?(\d{1,2}):?(\d{2})?$/.exec(String(v).replace("−", "-"));
  if (!m) {
    return "";
  }
  var mins = parseInt(m[2], 10) * 60 + parseInt(m[3] || "0", 10);
  return m[1] === "-" ? -mins : mins;
}

function daLoadTimezones() {
  $("#daTzFrom,#daTzTo").html('<option value="">Any</option>');
  if (typeof getURLForCommon !== "function" || typeof getRequestForMaster !== "function") {
    return;
  }
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLForCommon("masters"),
    data: JSON.stringify(getRequestForMaster("", "TIMEZONE-LIST", "")),
    dataType: "json",
    global: false,
    success: function (data) {
      if (!data || !data.mastersData) {
        return;
      }
      var opts = "";
      $.each(data.mastersData.countryTimeZones || [], function (k, v) {
        opts += '<option value="' + daEsc(daOffsetMinutes(v.extra4)) + '">(' + daEsc(v.extra) + ") - " + daEsc(v.extra1) + "/" + daEsc(v.extra3) + "</option>";
      });
      $("#daTzFrom,#daTzTo").append(opts);
      $("#daTzFrom").on("change", function () {
        var from = $(this).val();
        $("#daTzTo option").each(function () {
          var v = $(this).val();
          $(this).prop("disabled", from !== "" && v !== "" && parseInt(v, 10) < parseInt(from, 10));
        });
        if ($("#daTzTo").val() && from && parseInt($("#daTzTo").val(), 10) < parseInt(from, 10)) {
          $("#daTzTo").val(from);
        }
      });
    }
  });
}

function daIso(v) {
  if (!v) {
    return "";
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) {
    return v;
  }
  var d = new Date(v);
  return isNaN(d) ? "" : d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}

function daNice(iso) {
  if (!iso) {
    return "";
  }
  var p = iso.split("-");
  return new Date(+p[0], +p[1] - 1, +p[2]).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
}

function daFillOptions() {
  var g = '<option value="">All grades</option>';
  $.each(DA.options.grades || [], function (i, x) { g += '<option value="' + x.id + '">' + daEsc(x.name) + "</option>"; });
  $("#daGrade").html(g);
  daFillCourses();
}

function daFillCourses() {
  var grade = $("#daGrade").val();
  var c = '<option value="">All courses</option>';
  $.each(DA.options.courses || [], function (i, x) {
    if (!grade || String(x.standardId) === String(grade)) {
      c += '<option value="' + x.id + '">' + daEsc(x.name) + "</option>";
    }
  });
  $("#daCourse").html(c);
}

function daReset() {
  $("#daFilterForm")[0].reset();
  $("#daPeriod").val("WEEK").trigger("change");
  $("#daTzTo option").prop("disabled", false);
  daFillCourses();
  daSearch(true);
}

function daFilters() {
  return {
    period: $("#daPeriod").val() || "WEEK",
    from: daIso($("#daFrom").val()),
    to: daIso($("#daTo").val()),
    tzFrom: $("#daTzFrom").val(),
    tzTo: $("#daTzTo").val(),
    localFrom: $("#daLocalFrom").val(),
    localTo: $("#daLocalTo").val(),
    standardId: $("#daGrade").val(),
    program: $("#daProgram").val(),
    subjectId: $("#daCourse").val(),
    teacher: $.trim($("#daTeacher").val()),
    status: $("#daStatus").val()
  };
}

function daSummaryText(f) {
  var parts = [$("#daPeriod option:selected").text()];
  if (f.period === "CUSTOM" && f.from) {
    parts[0] = daNice(f.from) + " → " + daNice(f.to || f.from);
  }
  if (f.tzFrom || f.tzTo) {
    var name = function (sel) { var t = $(sel + " option:selected").text(); return t === "Any" ? "Any" : (t.match(/\(([^)]*)\)/) || [, t])[1]; };
    parts.push("TZ " + name("#daTzFrom") + " → " + name("#daTzTo"));
  }
  if (f.localFrom || f.localTo) {
    parts.push((f.localFrom ? $("#daLocalFrom option:selected").text() : "00:00") + "–" + (f.localTo ? $("#daLocalTo option:selected").text() : "24:00") + " SGT");
  }
  $.each([["standardId", "#daGrade"], ["program", "#daProgram"], ["subjectId", "#daCourse"], ["status", "#daStatus"]], function (i, x) {
    if (f[x[0]]) {
      parts.push($(x[1] + " option:selected").text());
    }
  });
  if (f.teacher) {
    parts.push(f.teacher);
  }
  return parts.join(" · ");
}

function daSearch(close) {
  var f = daFilters();
  DA.last = f;
  $("#daSummary").text(daSummaryText(f));
  if (close && $("#daAdv").hasClass("open")) {
    daToggleFilters();
  }
  $("#daMain").html('<p class="da-muted">Loading…</p>');
  daPost("search", f).done(function (r) {
    if (r.status != "1") {
      $("#daMain").html('<p class="da-muted">' + daEsc(r.message) + "</p>");
      return;
    }
    DA.data = r;
    daRender();
  }).fail(function () {
    $("#daMain").html('<p class="da-muted">Search failed. Please try again.</p>');
  });
}

function daPct(part, total) {
  return total > 0 ? Math.round(total * part / 100) : 0;
}

function daStat(label, value, sub, cls, pct) {
  return '<div class="da-stat ' + (cls || "") + '"><dt>' + label + "</dt><dd>" + value + "<span>" + sub + "</span></dd>"
    + (pct == null ? "" : '<div class="da-sbar" aria-hidden="true"><i style="width:' + Math.min(100, pct) + '%"></i></div>') + "</div>";
}

function daRender() {
  var k = DA.data.kpis;
  var total = k.requests;
  var html = '<dl class="da-card da-stats">'
    + daStat("Requests", total, "in this period", "", null)
    + daStat("Fulfilled", k.fulfilled + "%", daPct(k.fulfilled, total) + " of " + total, "good", k.fulfilled)
    + daStat("Exact match", k.exact + "%", daPct(k.exact, total) + " of " + total, "", k.exact)
    + daStat("Unfulfilled", k.unfulfilled + "%", daPct(k.unfulfilled, total) + " of " + total, "bad", k.unfulfilled) + "</dl>"
    + '<div class="da-tabs" role="tablist"><button type="button" role="tab" aria-selected="' + (DA.tab === "peak") + '" class="' + (DA.tab === "peak" ? "on" : "") + '" onclick="daTab(\'peak\')">Peak times</button>'
    + '<button type="button" role="tab" aria-selected="' + (DA.tab === "teachers") + '" class="' + (DA.tab === "teachers" ? "on" : "") + '" onclick="daTab(\'teachers\')">Teachers</button></div>'
    + '<div id="daTabBody"></div>';
  $("#daMain").html(html);
  if (DA.tab === "peak") {
    daRenderPeak();
  } else {
    daRenderTeachers();
  }
}

function daTab(t) {
  DA.tab = t;
  daRender();
}

function daFlagTag(flag) {
  var cls = flag === "Undersupplied" ? "no" : flag === "Oversupplied" ? "over" : "ok";
  return '<span class="da-pill ' + cls + '">' + daEsc(flag) + "</span>";
}

function daRatio(r) {
  var ratio = r.ratio == null ? (r.requests > 0 ? 99 : 0) : r.ratio;
  var text = r.ratio == null ? (r.requests > 0 ? "∞" : "—") : r.ratio.toFixed(2);
  return '<div class="da-meter"><div class="da-track"><i class="' + (ratio > 1 ? "over" : "") + '" style="width:' + Math.min(100, ratio * 60) + '%"></i></div><span>' + text + "</span></div>";
}

function daCity(zoneId) {
  var p = String(zoneId || "").split("/");
  return p[p.length - 1].replace(/_/g, " ").trim();
}

function daSplitOffset(text) {
  var m = String(text || "").match(/^(.*?)\s*(UTC[+−\-]\d{2}:\d{2})\s*$/);
  return m ? { name: m[1].trim(), off: m[2] } : { name: String(text || "").trim(), off: "" };
}

function daCityList(namesText) {
  var seen = {};
  var out = [];
  String(namesText || "").split(" / ").forEach(function (z) {
    var c = daCity(z);
    if (c && !seen[c]) {
      seen[c] = 1;
      out.push(c);
    }
  });
  return out.join(" · ");
}

function daZoneCell(text) {
  var o = daSplitOffset(text);
  return (o.off ? '<span class="da-chip">' + daEsc(o.off) + "</span>" : "") + daEsc(daCityList(o.name));
}

function daZonesList(text) {
  var html = '<ul class="da-zones">';
  String(text || "").split(" · ").filter(Boolean).forEach(function (item) {
    var m = item.match(/^(.*?)\s*(UTC[+−\-]\d{2}:\d{2})\s+(\d{2}:\d{2})\s*$/);
    html += m ? '<li><span class="da-chip">' + daEsc(m[2] + " · " + m[3]) + "</span><span>" + daEsc(daCityList(m[1])) + "</span></li>" : "<li>" + daEsc(item) + "</li>";
  });
  return html + "</ul>";
}

function daZoneShort(text) {
  var o = daSplitOffset(text);
  return daEsc(daCity(o.name) + (o.off ? ", " + o.off : ""));
}

function daTeacherZone(text) {
  var o = daSplitOffset(text);
  return daEsc(daCity(o.name) + (o.off ? " · " + o.off : ""));
}

function daFilterRows(inputEl) {
  var q = String(inputEl.value || "").toLowerCase();
  $("#daTabBody tbody tr").each(function () {
    $(this).toggle(!q || $(this).text().toLowerCase().indexOf(q) > -1);
  });
}

function daRenderPeak() {
  var rows = DA.combined ? DA.data.combined : DA.data.peak;
  var search = '<label class="da-search"><svg class="da-ico da-ico-sm" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg><input type="search" placeholder="Filter by timezone or day" aria-label="Filter rows" oninput="daFilterRows(this)"></label>';
  var html = '<section class="da-card"><div class="da-card-head"><div><h2>Requested hours, ranked by demand</h2><p>'
    + (DA.combined ? "One row per hour, in " + daZoneShort(DA.data.viewerZone) + ". Each line shows the same moment in a student timezone." : "One row per hour and student timezone. Times are in the student’s local zone.") + "</p></div>"
    + '<div class="da-head-tools"><label class="da-check"><input type="checkbox" id="daCombine"' + (DA.combined ? " checked" : "") + ' onchange="DA.combined=this.checked;daRenderPeak()">Combine timezones</label>' + search + "</div></div>"
    + '<div class="da-scroll"><table class="da-data"><thead><tr><th>#</th><th>' + (DA.combined ? "Time (" + daZoneShort(DA.data.viewerZone) + ")" : "Time · day (student local)") + "</th><th>"
    + (DA.combined ? "Same moment in each student zone" : "Student timezone") + '</th><th class="num">Requests</th><th class="num">Booked</th><th class="num">Usable hrs</th><th>Demand ÷ supply</th><th>Flag</th></tr></thead><tbody>';
  if (!rows.length) {
    html += '<tr><td colspan="8" class="da-muted">No requests in this period.</td></tr>';
  }
  $.each(rows, function (i, r) {
    var req = r.requests > 0 ? '<button type="button" class="da-count" onclick="daDrillSlot(' + r.weekday + "," + r.hour + "," + (DA.combined ? "null" : r.offset) + ')">' + r.requests + "</button>" : "0";
    html += "<tr" + (r.requests === 0 ? ' class="da-idle"' : "") + '><td class="da-rank">' + (i + 1) + "</td><td><b>" + daEsc(r.time) + '</b><div class="da-subtxt">' + daEsc(r.day) + '</div></td><td class="da-tzs">' + (DA.combined ? daZonesList(r.zones) : daZoneCell(r.zones))
      + '</td><td class="num">' + req + '</td><td class="num">' + r.booked + '</td><td class="num">' + r.usable + "</td><td>" + daRatio(r) + "</td><td>" + daFlagTag(r.flag) + "</td></tr>";
  });
  html += '</tbody></table></div><div class="da-foot"><span>Showing ' + rows.length + ' rows · Select a request count to see the students behind it. Grey rows have availability but no requests.</span></div></section>';
  $("#daTabBody").html(html);
}

function daInitials(name) {
  var parts = String(name || "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) {
    return "?";
  }
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

function daRenderTeachers() {
  var rows = DA.data.teachers.slice();
  var by = {
    most: function (a, b) { return b.requested - a.requested; },
    least: function (a, b) { return a.requested - b.requested; },
    idle: function (a, b) { return b.idle - a.idle; },
    util: function (a, b) { return (b.utilisation || 0) - (a.utilisation || 0); }
  };
  rows.sort(by[DA.sort]);
  var sorts = [["most", "Most requested"], ["least", "Least requested"]].map(function (s) {
    return '<button type="button" aria-pressed="' + (DA.sort === s[0]) + '" class="' + (DA.sort === s[0] ? "on" : "") + '" onclick="DA.sort=\'' + s[0] + '\';daRenderTeachers()">' + s[1] + "</button>";
  }).join("");
  var search = '<label class="da-search"><svg class="da-ico da-ico-sm" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg><input type="search" placeholder="Find a teacher" aria-label="Find a teacher" oninput="daFilterRows(this)"></label>';
  var html = '<section class="da-card"><div class="da-card-head"><div><h2>Teacher demand and utilisation</h2><p>Hours are for the selected period. Usable availability is blocks of 60 minutes or more, after batch time and buffers.</p></div>'
    + '<div class="da-head-tools"><div class="da-seg" role="group" aria-label="Sort by requests">' + sorts + "</div>" + search + "</div></div>"
    + '<div class="da-scroll"><table class="da-data"><thead><tr><th>Teacher</th><th class="num">Contract hrs/wk</th><th class="num">Usable hrs</th><th class="num">Requested</th><th class="num">Fulfilled %</th>'
    + '<th class="num">Booked</th><th class="num">Hours booked</th><th>Booked ÷ usable</th><th class="num">Idle hrs</th><th>Peak band (local)</th></tr></thead><tbody>';
  if (!rows.length) {
    html += '<tr><td colspan="10" class="da-muted">No teachers in this period.</td></tr>';
  }
  $.each(rows, function (i, r) {
    var util = r.utilisation == null ? "—" : r.utilisation + "%";
    var width = Math.min(100, r.utilisation || 0);
    var pctCls = r.fulfilled >= 60 ? "good" : r.fulfilled === 0 ? "bad" : "";
    var reqCell = r.requested > 0 ? '<button type="button" class="da-count" onclick="daDrillTeacher(' + r.teacherUserId + ')">' + r.requested + "</button>" : "0";
    var fulCell = r.requested > 0 ? '<span class="da-pct ' + pctCls + '">' + r.fulfilled + "%</span>" : "—";
    html += '<tr><td><div class="da-person"><span class="da-avatar" aria-hidden="true">' + daEsc(daInitials(r.name)) + "</span><span><b>" + daEsc(r.name) + "</b>"
      + (r.overContract ? ' <span class="da-pill over da-pill-sm">Above contract</span>' : "") + '<span class="da-subtxt">' + daTeacherZone(r.timezone) + "</span></span></div></td>"
      + '<td class="num">' + (r.contract == null ? "—" : r.contract) + '</td><td class="num">' + r.usable + '</td><td class="num">' + reqCell + '</td><td class="num">' + fulCell + '</td><td class="num">' + r.booked + '</td><td class="num">' + r.hoursBooked
      + '</td><td><div class="da-meter"><div class="da-track"><i class="' + ((r.utilisation || 0) > 100 ? "over" : "") + '" style="width:' + width + '%"></i></div><span>' + util + '</span></div></td><td class="num">' + r.idle
      + "</td><td>" + (r.peakBand ? '<span class="da-chip">' + daEsc(String(r.peakBand).split(" ")[0]) + "</span>" : "—") + "</td></tr>";
  });
  html += '</tbody></table></div><div class="da-foot"><span>Showing ' + rows.length + ' teachers · Fulfilled % is requests that became a booked class. Booked can exceed Requested when students book from the week calendar. "Above contract" = booked hours above contract live hours.</span></div></section>';
  $("#daTabBody").html(html);
}

function daDrillSlot(weekday, hour, offset) {
  daDrill($.extend({}, DA.last, { weekday: weekday, hour: hour, offset: offset }));
}

function daDrillTeacher(teacherUserId) {
  daDrill($.extend({}, DA.last, { teacherUserId: teacherUserId }));
}

function daDrillZone(x) {
  var o = daSplitOffset(x.timezone);
  var place = [daCity(o.name), x.country].filter(function (v) { return v; }).join(" · ");
  return (o.off ? '<span class="da-chip">' + daEsc(o.off) + "</span>" : "") + daEsc(place);
}

function daDrill(body) {
  daPost("drill", body).done(function (r) {
    var rows = (r && r.rows) || [];
    var done = rows.filter(function (x) { return x.status === "Fulfilled"; }).length;
    var html = '<div class="da-modalbg" id="daDrill" role="dialog" aria-modal="true" aria-labelledby="daDrillTitle" onclick="if(event.target===this){$(\'#daDrill\').remove()}"><div class="da-modal">'
      + '<div class="da-modal-head"><div><h2 id="daDrillTitle">Requests</h2><div class="da-pills"><span class="da-pill neutral">' + rows.length + ' request' + (rows.length === 1 ? "" : "s") + '</span>'
      + '<span class="da-pill ok">' + done + ' fulfilled</span><span class="da-pill no">' + (rows.length - done) + ' unfulfilled</span></div></div>'
      + '<button type="button" class="da-iconbtn" aria-label="Close" onclick="$(\'#daDrill\').remove()"><svg class="da-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>'
      + '<div class="da-modalbody da-scroll"><table class="da-data"><thead><tr><th>Student</th><th>Program · grade · course</th><th>Teacher</th><th>Requested (student zone)</th><th>Booked slot (student zone)</th><th>Match</th><th>Timezone · country</th><th>Status</th></tr></thead><tbody>';
    if (!rows.length) {
      html += '<tr><td colspan="8" class="da-muted">No requests.</td></tr>';
    }
    $.each(rows, function (i, x) {
      html += "<tr><td><b>" + daEsc(x.name) + '</b><div class="da-mono">' + daEsc(x.studentId) + "</div></td><td>" + daEsc(x.program)
        + '<div class="da-subtxt">' + daEsc(x.grade) + " · " + daEsc(x.course) + "</div></td><td>" + daEsc(x.teacher) + "</td><td>" + daEsc(x.requested) + "</td><td>" + (x.bookedSlot ? daEsc(x.bookedSlot) : "—") + '</td><td>' + (x.match ? '<span class="da-pill ' + (x.match === "Exact match" ? "ok" : "neutral") + '">' + daEsc(x.match) + "</span>" : "—")
        + '</td><td>' + daDrillZone(x) + '</td><td><span class="da-pill ' + (x.status === "Fulfilled" ? "ok" : "no") + '">' + daEsc(x.status) + "</span></td></tr>";
    });
    html += '</tbody></table></div><div class="da-modal-foot"><span>Times are shown in each student’s local timezone.</span>'
      + '<button type="button" class="da-btn da-btn-primary" onclick="$(\'#daDrill\').remove()">Done</button></div></div></div>';
    $("#daDrill").remove();
    $("body").append(html);
  });
}

function daOpenStudent(userId) {
  $("#daDrill").remove();
  if (typeof renderProfilePage === "function") {
    renderProfilePage(userId);
  }
}

function daEnsureStyles() {
  if (document.getElementById("daStyles")) {
    return;
  }
  var css = ".da,.da-modalbg{--ink:#1b1f26;--ink-2:#3b4452;--muted:#5b6472;--faint:#8a93a2;--surface:#fff;--line:#e4e8ee;--line-soft:#eef1f5;--chip:#f1f4f8;--brand:#1858c7;--brand-dark:#113f91;--brand-soft:#e8f0fd;"
    + "--green-ink:#146c3a;--green-soft:#e3f5e9;--red:#d64545;--red-ink:#9b1c1c;--red-soft:#fde8e8;--amber-ink:#7a4e00;--amber-soft:#fff4d6;color:var(--ink)}"
    + ".da{padding:4px 2px 40px;display:flex;flex-direction:column;gap:18px}.da-muted{color:var(--muted)}.da-hidden{display:none !important}.da .page-title-heading>div:not(.page-title-icon){font-weight:700}.da .page-title-subheading{font-weight:400}.da-inline{display:inline !important}"
    + ".da-ico{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}.da-ico-sm{width:16px;height:16px}"
    + ".da-card{background:var(--surface);border:1px solid var(--line);border-radius:14px;box-shadow:0 1px 2px rgba(16,24,40,.04)}"
    + ".da-card-head{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:16px 20px;border-bottom:1px solid var(--line-soft);flex-wrap:wrap}"
    + ".da-card-head h2{margin:0;font-size:15px;font-weight:700;color:var(--ink)}.da-card-head p{margin:2px 0 0;font-size:12.5px;color:var(--muted)}"
    + ".da-head-tools{display:flex;gap:12px;align-items:center;flex-wrap:wrap}"
    + ".da-adv .da-card-head{border-bottom:0}.da-adv.open .da-card-head{border-bottom:1px solid var(--line-soft)}"
    + ".da-toggle{display:inline-flex;align-items:center;gap:6px;height:36px;padding:0 12px;border:1px solid var(--line);border-radius:10px;background:var(--surface);color:var(--ink);font-weight:600;font-size:13px;cursor:pointer}"
    + ".da-toggle .da-ico{transition:transform .15s}.da-adv.open .da-toggle .da-ico{transform:rotate(180deg)}"
    + ".da-filters{display:none;padding:20px;grid-template-columns:repeat(5,minmax(0,1fr));gap:14px 16px}.da-adv.open .da-filters{display:grid}"
    + ".da-field{display:flex;flex-direction:column;gap:6px;font-size:12.5px;color:var(--muted);margin:0;font-weight:500}"
    + ".da-field select,.da-field input{height:42px;padding:0 12px;border:1px solid #d9dfe7;border-radius:10px;background-color:var(--surface);color:var(--ink);width:100%;font-size:14px}"
    + ".da-field select{appearance:none;-webkit-appearance:none;background-image:url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%235b6472' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M6 9l6 6 6-6'/></svg>\");background-repeat:no-repeat;background-position:right 12px center;padding-right:36px}"
    + ".da-field select:hover,.da-field input:hover{border-color:#c4ccd6}"
    + ".da-filters-actions{grid-column:1 / -1;display:flex;justify-content:flex-end;gap:10px;margin-top:4px;padding-top:14px;border-top:1px solid var(--line-soft)}"
    + ".da-btn{display:inline-flex;align-items:center;gap:8px;height:40px;padding:0 16px;border-radius:10px;border:1px solid #d9dfe7;background:var(--surface);color:var(--ink);font-weight:600;font-size:13px;cursor:pointer}"
    + ".da-btn:hover{background:var(--chip)}.da-btn-primary{background:var(--brand);border-color:var(--brand);color:#fff}.da-btn-primary:hover{background:var(--brand-dark);border-color:var(--brand-dark)}"
    + ".da-btn-ghost{border-color:transparent;color:var(--muted)}"
    + ".da-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));padding:0;margin:0}"
    + ".da-stat{padding:18px 22px;border-right:1px solid var(--line-soft)}.da-stat:last-child{border-right:0}"
    + ".da-stat dt{font-size:12.5px;color:var(--muted);margin:0 0 6px;font-weight:500}"
    + ".da-stat dd{margin:0;font-size:26px;font-weight:700;letter-spacing:-.4px;font-variant-numeric:tabular-nums;line-height:1.1}"
    + ".da-stat dd span{font-size:12.5px;font-weight:500;color:var(--muted);margin-left:8px;letter-spacing:0}"
    + ".da-sbar{height:4px;border-radius:999px;background:#e9edf2;margin-top:12px;overflow:hidden}.da-sbar i{display:block;height:100%;border-radius:999px;background:var(--brand)}"
    + ".da-stat.good .da-sbar i{background:#1f8a4c}.da-stat.bad .da-sbar i{background:var(--red)}"
    + ".da-tabs{display:flex;gap:4px;border-bottom:1px solid var(--line)}"
    + ".da-tabs button{padding:10px 14px;margin-bottom:-1px;border:0;border-bottom:2px solid transparent;background:transparent;color:var(--muted);font-weight:600;font-size:14px;cursor:pointer}"
    + ".da-tabs button.on{color:var(--brand);border-bottom-color:var(--brand);font-weight:600}"
    + ".da-seg{display:inline-flex;background:var(--chip);border-radius:10px;padding:3px}"
    + ".da-seg button{height:32px;padding:0 12px;border:0;border-radius:8px;background:transparent;color:var(--muted);font-size:13px;font-weight:500;cursor:pointer}"
    + ".da-seg button.on{background:var(--surface);color:var(--ink);font-weight:600;box-shadow:0 1px 2px rgba(16,24,40,.08)}"
    + ".da-search{display:flex;align-items:center;gap:8px;height:38px;padding:0 12px;border:1px solid #d9dfe7;border-radius:10px;background:var(--surface);margin:0;color:var(--muted)}"
    + ".da-search input{border:0;outline:none;width:190px;background:transparent;color:var(--ink);font-size:13px}"
    + ".da-check{display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer;min-height:38px;margin:0;font-weight:500}.da-check input{width:16px;height:16px;margin:0}"
    + ".da-scroll{overflow-x:auto}table.da-data{width:100%;border-collapse:collapse;font-variant-numeric:tabular-nums;background:var(--surface);font-size:14px}"
    + "table.da-data thead tr{background:#f8fafc}table.da-data th{padding:10px 12px;font-size:12px;font-weight:700;color:var(--muted);text-align:left;white-space:nowrap;background:#f8fafc;border:0}"
    + "table.da-data td{padding:12px;border-top:1px solid var(--line-soft);vertical-align:middle;line-height:1.4}"
    + "table.da-data th:first-child,table.da-data td:first-child{padding-left:20px}table.da-data th:last-child,table.da-data td:last-child{padding-right:20px}"
    + "table.da-data tbody tr:hover td{background:#f7faff}table.da-data tr.da-idle td{color:#5d6673;background:#fafbfc}.num{text-align:right}"
    + ".da-zones{margin:0;padding:0;display:flex;flex-direction:column;gap:6px}.da-zones li{list-style:none;display:flex;gap:8px;align-items:baseline;font-size:13px;color:var(--ink-2)}.da-zones .da-chip{margin:0;flex-shrink:0;min-width:124px;text-align:center}.da-rank{color:var(--faint);font-size:12px}.da-subtxt{display:block;font-size:12px;color:var(--muted);font-weight:400}.da-person .da-subtxt{display:block}"
    + ".da-mono{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px;color:var(--muted)}.da-tzs{font-size:12.5px;color:var(--ink-2)}"
    + ".da-chip{display:inline-block;font-weight:600;font-size:12px;background:var(--chip);border-radius:6px;padding:2px 7px;margin-right:8px;color:var(--ink)}"
    + ".da-count{font-weight:700;color:var(--brand);background:none;border:0;padding:0;cursor:pointer;text-decoration:underline;text-decoration-color:transparent;font-size:14px}.da-count:hover{text-decoration-color:currentColor}"
    + ".da-meter{display:flex;align-items:center;gap:10px;min-width:160px}.da-track{flex:1;height:6px;border-radius:999px;background:#e9edf2;overflow:hidden}"
    + ".da-track i{display:block;height:100%;background:var(--brand);border-radius:999px}.da-track i.over{background:#e03a3a}.da-meter span{min-width:46px;font-size:12.5px;color:var(--ink-2)}"
    + ".da-pill{display:inline-flex;align-items:center;gap:6px;padding:3px 10px;border-radius:999px;font-size:12px;font-weight:600;white-space:nowrap}"
    + ".da-pill::before{content:\"\";width:6px;height:6px;border-radius:50%;background:currentColor;opacity:.85}.da-pill.neutral::before{display:none}"
    + ".da-pill.over{background:var(--amber-soft);color:var(--amber-ink)}.da-pill.ok{background:var(--green-soft);color:var(--green-ink)}.da-pill.no{background:var(--red-soft);color:var(--red-ink)}.da-pill.neutral{background:var(--chip);color:var(--ink-2)}"
    + ".da-pill-sm{padding:1px 8px;font-size:11px;margin-left:6px}"
    + ".da-pct.good{color:var(--green-ink);font-weight:600}.da-pct.bad{color:var(--red-ink);font-weight:600}"
    + ".da-person{display:flex;align-items:center;gap:10px}.da-person b{display:inline-block;white-space:nowrap}"
    + ".da-avatar{width:32px;height:32px;border-radius:50%;background:var(--brand-soft);color:var(--brand);font-weight:700;font-size:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0}"
    + ".da-foot{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 20px;border-top:1px solid var(--line-soft);font-size:12.5px;color:var(--muted);flex-wrap:wrap}"
    + ".da-modalbg{position:fixed;inset:0;background:rgba(16,24,40,.45);display:flex;align-items:center;justify-content:center;padding:16px;z-index:1060}"
    + ".da-modal{background:var(--surface);border-radius:16px;width:min(1180px,100%);max-height:90vh;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 24px 60px rgba(16,24,40,.28)}"
    + ".da-modal-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;padding:20px 24px 16px;border-bottom:1px solid var(--line-soft)}"
    + ".da-modal-head h2{margin:0;font-size:18px;font-weight:700;letter-spacing:-.2px;color:var(--ink)}.da-pills{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}"
    + ".da-iconbtn{width:40px;height:40px;border:1px solid #d9dfe7;background:var(--surface);border-radius:10px;display:inline-flex;align-items:center;justify-content:center;color:var(--muted);cursor:pointer}.da-iconbtn:hover{background:var(--chip);color:var(--ink)}"
    + ".da-modalbody{overflow:auto}.da-modal-foot{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 24px;border-top:1px solid var(--line-soft);font-size:12.5px;color:var(--muted)}"
    + "@media (max-width:1100px){.da-filters{grid-template-columns:repeat(3,minmax(0,1fr))}.da-stats{grid-template-columns:repeat(2,minmax(0,1fr))}.da-stat:nth-child(2){border-right:0}.da-stat:nth-child(-n+2){border-bottom:1px solid var(--line-soft)}}"
    + "@media (max-width:720px){.da-filters{grid-template-columns:1fr}.da-stats{grid-template-columns:1fr}.da-stat{border-right:0;border-bottom:1px solid var(--line-soft)}.da-stat:last-child{border-bottom:0}}";
  $('<style id="daStyles"></style>').text(css).appendTo("head");
}
