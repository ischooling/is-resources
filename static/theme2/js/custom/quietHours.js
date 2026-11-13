/**
 * Add / Edit Quiet Hours modal for a user's Profile Page.
 *
 * Include this file on any ProfileView.jsp and add a button like:
 *   <button type="button" id="quietHoursBtn" onclick="openQuietHoursModal(${user.id}, 'quietHoursBtn')">Add Quiet Hours</button>
 * (swap ${user.id} for whatever EL variable that page uses for the profile being viewed)
 *
 * Bootstrap theme2 modal (cards, form-control, custom-switch, standard header).
 * Clock-ring summary, day chips, overnight alert, weekend override. Reuses getTimeZones() from
 * masterContent.js for the timezone dropdown and showMessageTheme2() for
 * toasts, so no new shared helpers are introduced. All requests go through
 * the encoded Payload envelope automatically applied by the site-wide
 * $.ajaxSetup beforeSend handler, decoded server-side in QuietHoursUtil.
 */

var QUIET_HOURS_DAYS = [
    { id: 1, label: "Mon" },
    { id: 2, label: "Tue" },
    { id: 3, label: "Wed" },
    { id: 4, label: "Thu" },
    { id: 5, label: "Fri" },
    { id: 6, label: "Sat" },
    { id: 7, label: "Sun" }
];
var QUIET_HOURS_WEEKEND_DAY_IDS = [6, 7];

var quietHoursState = {
    targetUserId: null,
    buttonElementId: null
};

var qhState = {
    enabled: true,
    start: "22:00",
    end: "07:00",
    days: [true, true, true, true, true, true, true],
    weekendSplit: false,
    weStart: "23:00",
    weEnd: "09:00",
    timezoneId: null,
    timezoneName: ""
};

function getURLForQuietHours(suffixUrl) {
    return BASE_URL + API_VERSION + "quiet-hours" + "/" + suffixUrl;
}

/* ---- small time helpers, ported from the mockup ---- */
function qhMins(t) { var p = t.split(":"); return parseInt(p[0], 10) * 60 + parseInt(p[1], 10); }
function qhCrossesMidnight(s, e) { return qhMins(s) >= qhMins(e); }
function qhTo12(t) {
    var p = t.split(":"), h = parseInt(p[0], 10), m = p[1];
    var ap = h < 12 ? "AM" : "PM", hh = h % 12; if (hh === 0) hh = 12;
    return hh + ":" + m + " " + ap;
}
function qhDayPhrase() {
    var on = [];
    qhState.days.forEach(function (v, i) { if (v) on.push(i); });
    if (on.length === 7) return "every day";
    if (on.length === 0) return "no days selected";
    if (on.length === 5 && on.every(function (i) { return i < 5; })) return "weekdays";
    if (on.length === 2 && on[0] === 5 && on[1] === 6) return "weekends";
    return on.map(function (i) { return QUIET_HOURS_DAYS[i].label; }).join(", ");
}

function ensureQuietHoursModal() {
    if ($("#quietHoursModal").length) {
        if ($("#qhMasterSwitch").length) {
            return;
        }
        $("#quietHoursModal").remove();
    }

    var style =
        '<style>' +
        '#quietHoursModal .qh-clock{position:relative;width:130px;height:130px;margin:0 auto;}' +
        '#quietHoursModal .qh-clock-center{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;}' +
        '#quietHoursModal .qh-clock-big{font-size:1.05rem;font-weight:700;}' +
        '#quietHoursModal .qh-clock-cap{font-size:.65rem;color:#6c757d;text-transform:uppercase;letter-spacing:.04em;}' +
        '#quietHoursModal .qh-summary-off .qh-clock-big{color:#6c757d;}' +
        '</style>';

    var dayChipsHtml = "";
    QUIET_HOURS_DAYS.forEach(function (d) {
        dayChipsHtml += '<button type="button" class="btn btn-sm btn-primary mr-1 mb-1 qh-day" data-day-idx="' + (d.id - 1) + '">' + d.label + '</button>';
    });

    var modalHtml =
        '<div class="modal fade" id="quietHoursModal" tabindex="-1" role="dialog" aria-hidden="true">' +
        '  <div class="modal-dialog modal-dialog-scrollable modal-lg" role="document">' +
        '    <div class="modal-content">' +
        '      <div class="modal-header">' +
        '        <h5 class="modal-title" id="quietHoursModalTitle">Quiet hours</h5>' +
        '        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
        '      </div>' +
        '      <div class="modal-body" id="quietHoursForm">' +
        '        <div class="row">' +
        '          <div class="col-lg-8">' +

        '            <div class="card mb-3">' +
        '              <div class="card-body d-flex justify-content-between align-items-center flex-wrap">' +
        '                <div class="pr-3 mb-2 mb-md-0">' +
        '                  <h6 class="mb-1">Pause notices during quiet hours</h6>' +
        '                  <p class="text-muted small mb-0">Non-urgent notices are held and delivered once quiet hours end.</p>' +
        '                </div>' +
        '                <div class="custom-control custom-switch ml-auto">' +
        '                  <input type="checkbox" class="custom-control-input" id="qhMasterSwitch" checked>' +
        '                  <label class="custom-control-label" for="qhMasterSwitch"></label>' +
        '                </div>' +
        '              </div>' +
        '            </div>' +

        '            <div id="qhScheduleWrap">' +
        '              <div class="card mb-3">' +
        '                <div class="card-body">' +
        '                  <h6 class="mb-1">Set the hours</h6>' +
        '                  <p class="text-muted small mb-3">The window when this person doesn\'t want to be disturbed.</p>' +
        '                  <div class="form-row align-items-end">' +
        '                    <div class="form-group col-sm-5"><label class="small font-weight-bold">Start</label>' +
        '                      <input type="time" class="form-control" id="qhStart" value="22:00"></div>' +
        '                    <div class="form-group col-sm-2 text-center text-muted d-none d-sm-block pb-2">&#8594;</div>' +
        '                    <div class="form-group col-sm-5"><label class="small font-weight-bold">End</label>' +
        '                      <input type="time" class="form-control" id="qhEnd" value="07:00"></div>' +
        '                  </div>' +
        '                  <div class="alert alert-info small py-2 mb-3 d-none" id="qhOvernightNote">This window runs overnight — from the evening into the next morning.</div>' +
        '                  <hr class="my-3">' +
        '                  <label class="small font-weight-bold">Repeat on <span class="font-weight-normal text-muted">— tap the days these hours apply</span></label>' +
        '                  <div class="mt-2" id="qhDayRow">' + dayChipsHtml + '</div>' +
        '                  <div class="mt-2 qh-quick">' +
        '                    <button type="button" class="btn btn-sm btn-outline-secondary mr-1 mb-1" data-set="all">Every day</button>' +
        '                    <button type="button" class="btn btn-sm btn-outline-secondary mr-1 mb-1" data-set="weekdays">Weekdays</button>' +
        '                    <button type="button" class="btn btn-sm btn-outline-secondary mr-1 mb-1" data-set="weekends">Weekends</button>' +
        '                  </div>' +
        '                </div>' +
        '              </div>' +

        '              <div class="card mb-3">' +
        '                <div class="card-body">' +
        '                  <div class="d-flex justify-content-between align-items-center flex-wrap">' +
        '                    <div class="pr-3 mb-2 mb-md-0">' +
        '                      <h6 class="mb-1">Use different hours on weekends</h6>' +
        '                      <p class="text-muted small mb-0">Keep a later start on Saturday and Sunday.</p>' +
        '                    </div>' +
        '                    <div class="custom-control custom-switch ml-auto">' +
        '                      <input type="checkbox" class="custom-control-input" id="qhWeekendSwitch">' +
        '                      <label class="custom-control-label" for="qhWeekendSwitch"></label>' +
        '                    </div>' +
        '                  </div>' +
        '                  <div class="d-none mt-3" id="qhWeekendWrap">' +
        '                    <div class="form-row align-items-end">' +
        '                      <div class="form-group col-sm-5 mb-0"><label class="small font-weight-bold">Weekend start</label>' +
        '                        <input type="time" class="form-control" id="qhWeStart" value="23:00"></div>' +
        '                      <div class="form-group col-sm-2 text-center text-muted d-none d-sm-block pb-2">&#8594;</div>' +
        '                      <div class="form-group col-sm-5 mb-0"><label class="small font-weight-bold">Weekend end</label>' +
        '                        <input type="time" class="form-control" id="qhWeEnd" value="09:00"></div>' +
        '                    </div>' +
        '                  </div>' +
        '                </div>' +
        '              </div>' +

        '              <div class="card mb-3">' +
        '                <div class="card-body">' +
        '                  <h6 class="mb-1">Time zone</h6>' +
        '                  <p class="text-muted small mb-2">Quiet hours are read in this time zone.</p>' +
        '                  <select class="form-control" id="quietHoursTimezone"></select>' +
        '                  <input type="hidden" id="quietHoursTimezoneInput">' +
        '                </div>' +
        '              </div>' +
        '            </div>' +

        '            <div class="alert alert-warning small mb-0">' +
        '              <strong>Emergency and legal-acknowledgment notices</strong> always come through, even during quiet hours. Everything else waits.' +
        '            </div>' +

        '          </div>' +
        '          <div class="col-lg-4 mt-3 mt-lg-0">' +
        '            <div class="card border h-100" id="qhSummary">' +
        '              <div class="card-body text-center d-flex flex-column justify-content-center">' +
        '                <div class="qh-clock" id="qhClock"></div>' +
        '                <div class="text-muted small text-uppercase font-weight-bold mt-2" id="qhSummaryLbl">You\'ll be muted</div>' +
        '                <div class="small mt-2" id="qhSummaryLine">—</div>' +
        '              </div>' +
        '            </div>' +
        '          </div>' +
        '        </div>' +
        '      </div>' +
        '      <div class="modal-footer">' +
        '        <button type="button" class="btn btn-outline-secondary" id="qhResetBtn">Reset to default</button>' +
        '        <button type="button" class="btn btn-light" data-dismiss="modal">Cancel</button>' +
        '        <button type="button" class="btn btn-success" onclick="saveQuietHours();">Save quiet hours</button>' +
        '      </div>' +
        '    </div>' +
        '  </div>' +
        '</div>';

    $("body").append(style).append(modalHtml);

    $("#qhDayRow").on("click", ".qh-day", function () {
        var idx = parseInt($(this).data("day-idx"), 10);
        qhState.days[idx] = !qhState.days[idx];
        $(this).toggleClass("btn-primary", qhState.days[idx]).toggleClass("btn-outline-secondary", !qhState.days[idx]);
        qhRender();
    });
    $(".qh-quick button").on("click", function () {
        var set = $(this).data("set");
        qhState.days = QUIET_HOURS_DAYS.map(function (d, i) {
            return set === "all" ? true : set === "weekdays" ? i < 5 : i >= 5;
        });
        qhSyncDayButtons();
        qhRender();
    });
    $("#qhMasterSwitch").on("change", function () {
        qhState.enabled = $(this).prop("checked");
        $("#qhScheduleWrap").toggleClass("d-none", !qhState.enabled);
        qhRender();
    });
    $("#qhWeekendSwitch").on("change", function () {
        qhState.weekendSplit = $(this).prop("checked");
        $("#qhWeekendWrap").toggleClass("d-none", !qhState.weekendSplit);
        qhRender();
    });
    $("#qhStart, #qhEnd, #qhWeStart, #qhWeEnd").on("input", function () {
        qhState.start = $("#qhStart").val() || qhState.start;
        qhState.end = $("#qhEnd").val() || qhState.end;
        qhState.weStart = $("#qhWeStart").val() || qhState.weStart;
        qhState.weEnd = $("#qhWeEnd").val() || qhState.weEnd;
        qhRender();
    });
    $("#quietHoursTimezone").on("change", function () {
        qhState.timezoneId = $(this).val();
        qhState.timezoneName = $(this).find("option:selected").text().trim();
        qhRender();
    });
    $("#qhResetBtn").on("click", function () {
        qhResetToDefault();
    });
}

function qhSyncDayButtons() {
    $("#qhDayRow .qh-day").each(function () {
        var idx = parseInt($(this).data("day-idx"), 10);
        var on = !!qhState.days[idx];
        $(this).toggleClass("btn-primary", on).toggleClass("btn-outline-secondary", !on);
    });
}

function qhDrawClock() {
    var box = $("#qhClock");
    if (!qhState.enabled) {
        box.html('<div class="qh-clock-center"><div class="qh-clock-big text-muted">Off</div><div class="qh-clock-cap">no mute window</div></div>');
        return;
    }
    var R = 55, C = 65, circ = 2 * Math.PI * R;
    var startFrac = qhMins(qhState.start) / 1440, endFrac = qhMins(qhState.end) / 1440;
    var len = (endFrac - startFrac + 1) % 1; if (len === 0) len = 1;
    var dash = len * circ, off = circ * (1 - startFrac);
    var totalH = Math.round(((qhMins(qhState.end) - qhMins(qhState.start) + 1440) % 1440) / 60 * 10) / 10 || 24;
    box.html(
        '<svg width="130" height="130" viewBox="0 0 130 130">' +
        '<circle cx="' + C + '" cy="' + C + '" r="' + R + '" fill="none" stroke="#e9ecef" stroke-width="12"/>' +
        '<circle cx="' + C + '" cy="' + C + '" r="' + R + '" fill="none" stroke="#007bff" stroke-width="12" stroke-linecap="round" stroke-dasharray="' + dash + ' ' + (circ - dash) + '" stroke-dashoffset="' + off + '"/>' +
        '</svg>' +
        '<div class="qh-clock-center"><div class="qh-clock-big text-primary">' + totalH + 'h</div><div class="qh-clock-cap">quiet</div></div>'
    );
}

function qhRender() {
    qhDrawClock();
    $("#qhOvernightNote").toggleClass("d-none", !qhCrossesMidnight(qhState.start, qhState.end));

    var rail = $("#qhSummary");
    if (!qhState.enabled) {
        rail.addClass("bg-light qh-summary-off");
        $("#qhSummaryLbl").text("Quiet hours are off");
        $("#qhSummaryLine").html("Every notice arrives as it's sent, at any hour.");
        return;
    }
    rail.removeClass("bg-light qh-summary-off");
    $("#qhSummaryLbl").text("You'll be muted");

    if (qhState.days.every(function (d) { return !d; })) {
        $("#qhSummaryLine").html("Pick at least one day for quiet hours to apply.");
        return;
    }
    var over = function (s, e) { return qhCrossesMidnight(s, e) ? " (overnight)" : ""; };
    var tz = qhState.timezoneName ? qhState.timezoneName.split(" ")[0] : "the selected";
    if (qhState.weekendSplit) {
        $("#qhSummaryLine").html(
            "Weekdays <b>" + qhTo12(qhState.start) + " &rarr; " + qhTo12(qhState.end) + "</b>" + over(qhState.start, qhState.end) +
            ", weekends <b>" + qhTo12(qhState.weStart) + " &rarr; " + qhTo12(qhState.weEnd) + "</b>" + over(qhState.weStart, qhState.weEnd) +
            " — in " + tz + " time."
        );
    } else {
        $("#qhSummaryLine").html("<b>" + qhTo12(qhState.start) + " &rarr; " + qhTo12(qhState.end) + "</b>" + over(qhState.start, qhState.end) +
            ", <b>" + qhDayPhrase() + "</b>, in " + tz + " time.");
    }
}

/** Keep qhState in sync with the timezone select (populate + default selection do not always fire change). */
function qhSyncTimezoneFromDom() {
    var $sel = $("#quietHoursTimezone");
    if (!$sel.length) {
        return;
    }
    var val = $sel.val();
    if (val != null && val !== "") {
        qhState.timezoneId = val;
        qhState.timezoneName = $sel.find("option:selected").text().trim();
    }
}

function qhSeedTimezoneDefaultFromProfile() {
    var $hint = $("#quietHoursTimezoneInput");
    if (!$hint.length) {
        return;
    }
    var fromHidden = $("#timezoneInput").val();
    if (fromHidden) {
        $hint.val(fromHidden);
        return;
    }
    var $profileTz = $("#timezone");
    if ($profileTz.length && $profileTz.find("option:selected").val()) {
        $hint.val($profileTz.find("option:selected").val());
        return;
    }
    var $adminTz = $("#countryTimezoneId");
    if ($adminTz.length && $adminTz.val()) {
        $hint.val($adminTz.val());
    }
}

function qhResetToDefault() {
    qhState = {
        enabled: true, start: "22:00", end: "07:00",
        days: [true, true, true, true, true, true, true],
        weekendSplit: false, weStart: "23:00", weEnd: "09:00",
        timezoneId: qhState.timezoneId, timezoneName: qhState.timezoneName
    };
    $("#qhMasterSwitch").prop("checked", true);
    $("#qhScheduleWrap").removeClass("d-none");
    $("#qhWeekendSwitch").prop("checked", false);
    $("#qhWeekendWrap").addClass("d-none");
    $("#qhStart").val(qhState.start);
    $("#qhEnd").val(qhState.end);
    $("#qhWeStart").val(qhState.weStart);
    $("#qhWeEnd").val(qhState.weEnd);
    qhSyncDayButtons();
    qhRender();
}

/** Public entry point — call this from the Profile Page button's onclick. */
function openQuietHoursModal(targetUserId, buttonElementId) {
    ensureQuietHoursModal();
    quietHoursState.targetUserId = targetUserId;
    quietHoursState.buttonElementId = buttonElementId;
    qhResetToDefault();
    qhSeedTimezoneDefaultFromProfile();

    getTimeZones("quietHoursForm", "quietHoursTimezone", "quietHoursTimezoneInput").then(function () {
        qhSyncTimezoneFromDom();
        $("#quietHoursTimezone").prop("disabled", true);
        fetchQuietHours(targetUserId);
    });
}

function fetchQuietHours(targetUserId) {
    $.ajax({
        type: "POST",
        contentType: APPLICATION_JSON_VALUE,
        url: getURLForQuietHours("get"),
        data: JSON.stringify({ targetUserId: targetUserId }),
        dataType: "json",
        success: function (rows) {
            qhPopulateFromRows(rows);
            $("#quietHoursModalTitle").text(rows && rows.length ? "Edit quiet hours" : "Add quiet hours");
            $("#quietHoursModal").modal("show");
        },
        error: function () {
            showMessageTheme2(0, "Could not load quiet hours.", "", false);
        }
    });
}

function qhPopulateFromRows(rows) {
    qhState.enabled = !!(rows && rows.length);
    $("#qhMasterSwitch").prop("checked", qhState.enabled);
    $("#qhScheduleWrap").toggleClass("d-none", !qhState.enabled);

    if (!rows || !rows.length) {
        qhSyncTimezoneFromDom();
        qhSyncDayButtons();
        qhRender();
        return;
    }

    qhState.days = [false, false, false, false, false, false, false];
    rows.forEach(function (r) { qhState.days[r.dayId - 1] = true; });

    var weekdayRow = rows.find(function (r) { return QUIET_HOURS_WEEKEND_DAY_IDS.indexOf(r.dayId) === -1; }) || rows[0];
    var weekendRow = rows.find(function (r) { return QUIET_HOURS_WEEKEND_DAY_IDS.indexOf(r.dayId) !== -1; });

    qhState.start = weekdayRow.startTime.substring(0, 5);
    qhState.end = weekdayRow.endTime.substring(0, 5);
    $("#qhStart").val(qhState.start);
    $("#qhEnd").val(qhState.end);

    if (weekendRow && (weekendRow.startTime !== weekdayRow.startTime || weekendRow.endTime !== weekdayRow.endTime)) {
        qhState.weekendSplit = true;
        qhState.weStart = weekendRow.startTime.substring(0, 5);
        qhState.weEnd = weekendRow.endTime.substring(0, 5);
        $("#qhWeekendSwitch").prop("checked", true);
        $("#qhWeekendWrap").removeClass("d-none");
        $("#qhWeStart").val(qhState.weStart);
        $("#qhWeEnd").val(qhState.weEnd);
    } else {
        qhState.weekendSplit = false;
        $("#qhWeekendSwitch").prop("checked", false);
        $("#qhWeekendWrap").addClass("d-none");
    }

    qhSyncTimezoneFromDom();

    qhSyncDayButtons();
    qhRender();
}

function saveQuietHours() {
    // Read straight from the DOM rather than the tracked qhState.* values —
    // <input type="time"> doesn't reliably fire "input" for every interaction
    // in every browser, so the tracked state can go stale even though the
    // field's visible value is correct.
    qhSyncTimezoneFromDom();
    var start = $("#qhStart").val() || qhState.start;
    var end = $("#qhEnd").val() || qhState.end;
    var weStart = $("#qhWeStart").val() || qhState.weStart;
    var weEnd = $("#qhWeEnd").val() || qhState.weEnd;

    var days = [];
    if (qhState.enabled) {
        qhState.days.forEach(function (on, i) {
            if (!on) return;
            var dayId = i + 1;
            var isWeekend = QUIET_HOURS_WEEKEND_DAY_IDS.indexOf(dayId) !== -1;
            days.push({
                dayId: dayId,
                startTime: (isWeekend && qhState.weekendSplit) ? weStart : start,
                endTime: (isWeekend && qhState.weekendSplit) ? weEnd : end
            });
        });
        if (!days.length) {
            showMessageTheme2(0, "Pick at least one day, or turn quiet hours off.", "", false);
            return;
        }
        if (!qhState.timezoneId) {
            showMessageTheme2(0, "Select a time zone.", "", false);
            return;
        }
    }

    var request = {
        targetUserId: quietHoursState.targetUserId,
        timezoneId: qhState.timezoneId ? parseInt(qhState.timezoneId, 10) : null,
        days: days
    };

    $.ajax({
        type: "POST",
        contentType: APPLICATION_JSON_VALUE,
        url: getURLForQuietHours("save"),
        data: JSON.stringify(request),
        dataType: "json",
        success: function (rows) {
            $("#quietHoursModal").modal("hide");
            showMessageTheme2(1, "Quiet hours saved.", "", false);
            if (quietHoursState.buttonElementId) {
                $("#" + quietHoursState.buttonElementId).text(rows && rows.length ? "Edit Quiet Hours" : "Add Quiet Hours");
            }
            var summaryHtml = typeof formatQuietHoursProfileSummary === "function"
                ? formatQuietHoursProfileSummary(rows)
                : (typeof formatAdminQuietHoursSummary === "function" ? formatAdminQuietHoursSummary(rows) : "");
            if (summaryHtml !== "") {
                $("#adminQuietHoursSummary, #profileQuietHoursSummary, #teacherQuietHoursSummary").html(summaryHtml);
            }
        },
        error: function (xhr) {
            var msg = (xhr.responseJSON && xhr.responseJSON.message) ? xhr.responseJSON.message : "Could not save quiet hours.";
            showMessageTheme2(0, msg, "", false);
        }
    });
}

function formatQuietHoursProfileSummary(rows) {
    if (!rows || !rows.length) {
        return '<p class="text-muted mb-0">No quiet hours configured. Notifications can arrive at any time.</p>';
    }
    var start = rows[0].startTime ? rows[0].startTime.substring(0, 5) : "";
    var end = rows[0].endTime ? rows[0].endTime.substring(0, 5) : "";
    var dayCount = rows.length;
    return '<p class="text-muted mb-0">Quiet hours are on: <strong>' + start + " – " + end + "</strong> across " +
        dayCount + " day slot" + (dayCount === 1 ? "" : "s") + ". Use the button below to change them.</p>";
}

function formatAdminQuietHoursSummary(rows) {
    return formatQuietHoursProfileSummary(rows);
}

/** Button label + summary for student, teacher, or admin profile pages. */
function initProfileQuietHoursSection(targetUserId, options) {
    if (!targetUserId) {
        return;
    }
    options = options || {};
    var summarySelector = options.summarySelector || "#profileQuietHoursSummary, #adminQuietHoursSummary, #teacherQuietHoursSummary";
    var buttonId = options.buttonId || "quietHoursBtn";
    var $btn = $("#" + buttonId);
    if (!$btn.length && options.fallbackButtonId) {
        buttonId = options.fallbackButtonId;
        $btn = $("#" + buttonId);
    }
    var apply = function (rows) {
        if ($btn.length) {
            $btn.text(rows && rows.length ? "Edit Quiet Hours" : "Add Quiet Hours");
        }
        if ($(summarySelector).length) {
            $(summarySelector).html(formatQuietHoursProfileSummary(rows));
        }
    };
    prefetchQuietHoursForProfile(targetUserId, apply, options.onError);
}

/** Load quiet hours for a profile page (button label + optional inline summary). */
function prefetchQuietHoursForProfile(targetUserId, onSuccess, onError) {
    if (!targetUserId) {
        return;
    }
    $.ajax({
        type: "POST",
        contentType: APPLICATION_JSON_VALUE,
        url: getURLForQuietHours("get"),
        data: JSON.stringify({ targetUserId: targetUserId }),
        dataType: "json",
        success: function (rows) {
            if (typeof onSuccess === "function") {
                onSuccess(rows || []);
            }
        },
        error: function () {
            if (typeof onError === "function") {
                onError();
            }
        }
    });
}
