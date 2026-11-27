// Student Management > Performance Dashboard - Students page: logic + AJAX + ApexCharts.
// HTML in performanceStudentsContent.js. Endpoint: {schoolUuid}/dashboard/performance-students.
// Real data only - missing values arrive as 0 from the server.

var PS_MODULE_ID = '';
var PS_COLORS = ['#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4', '#6250d6', '#e34948', '#5a9e2f'];
var PS_CHARTS = {};   // sel -> ApexCharts instance, so a re-fetch replaces rather than stacks

function renderPerformanceStudents(title, roleAndModule, schoolId, userId, userRole) {
    PS_MODULE_ID = (roleAndModule && roleAndModule.moduleId) ? roleAndModule.moduleId
        : (typeof MODULE_ID !== 'undefined' ? MODULE_ID : '');
    $('#dashboardContentInHTML').html(getPerformanceStudentsContent(title));
    $('#psSession').off('change').on('change', psOnSessionChange);
    $('.ps-tab').off('click').on('click', function () { psSwitchTab($(this).data('tab')); });
    psSwitchTab('students');
}

var PS_ACTIVE_TAB = 'students';
var PS_BUILT_TABS = {
    'students': fetchPerformanceStudents,
    'student-tags': fetchPerformanceTags,
    'retention': fetchPerformanceRetention,
    'student-performance': fetchPerformanceStudentPerformance,
    'live-classes': fetchPerformanceLiveClasses,
    'staff': fetchPerformanceStaff,
    'operations': fetchPerformanceOperations
};

// Students, Student tags and Retention are built (real data); the other BRD tabs show a placeholder.
function psSwitchTab(key) {
    PS_ACTIVE_TAB = key;
    $('.ps-tab').removeClass('on');
    $('.ps-tab[data-tab="' + key + '"]').addClass('on');
    $('#psStudentsPanel').toggle(key === 'students');
    $('#psTagsPanel').toggle(key === 'student-tags');
    $('#psRetentionPanel').toggle(key === 'retention');
    $('#psPerfPanel').toggle(key === 'student-performance');
    $('#psLivePanel').toggle(key === 'live-classes');
    $('#psStaffPanel').toggle(key === 'staff');
    $('#psOpsPanel').toggle(key === 'operations');
    var built = PS_BUILT_TABS[key];
    if (built) {
        $('#psOtherPanel').hide();
        // Staff is school-wide (not per academic year), so hide the year filter there.
        $('#psSession, #psShowing').css('visibility', key === 'staff' ? 'hidden' : 'visible');
        built();
    } else {
        $('#psOtherPanel').html(getPerformanceComingSoon(key)).show();
        $('#psSession, #psShowing').css('visibility', 'hidden');
    }
}

function psOnSessionChange() {
    var built = PS_BUILT_TABS[PS_ACTIVE_TAB];
    if (built) { built(); }
}

// Fill the year dropdown + "showing" label from any built page's response (shared shape).
function psSyncSession(data) {
    var sessions = data.sessions || [];
    var sel = $('#psSession');
    if (sel.children().length !== sessions.length) {
        sel.empty();
        sessions.forEach(function (s) { sel.append('<option value="' + s.id + '">' + s.name + '</option>'); });
    }
    sel.val(data.sessionId);
    var current = sessions.filter(function (s) { return s.id == data.sessionId; })[0];
    $('#psShowing').text('Showing: ' + (current ? current.name : data.sessionId));
}

function getPerformanceStudentsRequest() {
    return {
        schoolId: SCHOOL_ID,
        userId: USER_ID,
        moduleId: PS_MODULE_ID,
        sessionId: parseInt($('#psSession').val(), 10) || 0   // 0 = current active year (resolved server-side)
    };
}

function fetchPerformanceStudents() {
    $.ajax({
        type: 'POST',
        contentType: APPLICATION_JSON_VALUE,
        url: getURLForHTML('dashboard', 'performance-students'),
        data: JSON.stringify(getPerformanceStudentsRequest()),
        dataType: 'json',
        cache: false,
        timeout: 600000,
        success: function (data) {
            if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
                if (data['status'] == '3') { redirectLoginPage(); return; }
                showMessageTheme2(0, data['message'] || 'Unable to load dashboard.');
                return;
            }
            renderPerformanceStudentsData(data);
        },
        error: function (xhr, status, error) {
            if (checkonlineOfflineStatus()) { return; }
            console.error('performance-students error: ' + error);
            showMessageTheme2(0, 'Unable to load dashboard. Please retry.');
        }
    });
}

function renderPerformanceStudentsData(data) {
    psSyncSession(data);

    // KPI tiles
    $('#psEnrolled').text(psNum(data.studentsEnrolled));
    $('#psCountries').text(psNum(data.countries));
    if (data.prevEnrolled !== undefined && data.prevEnrolled > 0) {
        var pct = Math.round((data.studentsEnrolled - data.prevEnrolled) / data.prevEnrolled * 1000) / 10;
        $('#psEnrolledCmp').html('<span class="' + (pct >= 0 ? 'ps-up' : 'ps-down') + '">'
            + (pct >= 0 ? '+' : '') + pct + '%</span> vs previous');
    } else {
        $('#psEnrolledCmp').html('&mdash; vs previous');
    }

    // Grade bands come from the school's grade-group setting; hidden when it is not configured.
    if (data.bands) {
        $('#psElemTile,#psMiddleTile,#psHighTile').show();
        $('#psElem').text(psNum(data.bands.elementary));
        $('#psMiddle').text(psNum(data.bands.middle));
        $('#psHigh').text(psNum(data.bands.high));
    } else {
        $('#psElemTile,#psMiddleTile,#psHighTile').hide();
    }

    // Charts
    psColumn('#psMonthChart', data.byMonth || [], 'name');
    psDonut('#psProgramChart', data.byProgram || []);
    psBar('#psCountryChart', (data.byCountry || []).slice(0, 10));
    psBar('#psGradeChart', data.byGrade || []);
    psDonut('#psGenderChart', data.byGender || []);
}

// ---- chart helpers (rows = [{name/id, count}]) ----
function psRender(sel, opt) {
    if (typeof ApexCharts === 'undefined') { return; }
    if (PS_CHARTS[sel]) { PS_CHARTS[sel].destroy(); }
    PS_CHARTS[sel] = new ApexCharts(document.querySelector(sel), opt);
    PS_CHARTS[sel].render();
}
function psEmpty(sel, rows) {
    if (rows && rows.length) { return false; }
    $(sel).html('<div class="ps-empty">No data for this year.</div>');
    if (PS_CHARTS[sel]) { PS_CHARTS[sel].destroy(); delete PS_CHARTS[sel]; }
    return true;
}
function psNames(rows) { return rows.map(function (r) { return r.name || '—'; }); }
function psVals(rows) { return rows.map(function (r) { return Number(r.count || 0); }); }

function psBar(sel, rows) {
    if (psEmpty(sel, rows)) { return; }
    psRender(sel, {
        chart: { type: 'bar', height: Math.max(160, rows.length * 28 + 40), toolbar: { show: false } },
        series: [{ data: psVals(rows) }],
        xaxis: { categories: psNames(rows) },
        plotOptions: { bar: { horizontal: true, borderRadius: 3, distributed: true } },
        colors: PS_COLORS, legend: { show: false }, dataLabels: { enabled: false }
    });
}
function psColumn(sel, rows) {
    if (psEmpty(sel, rows)) { return; }
    psRender(sel, {
        chart: { type: 'bar', height: 220, toolbar: { show: false } },
        series: [{ name: 'Enrolled', data: psVals(rows) }],
        xaxis: { categories: psNames(rows) },
        plotOptions: { bar: { columnWidth: '55%', borderRadius: 3 } },
        colors: [PS_COLORS[0]], dataLabels: { enabled: false }
    });
}
function psDonut(sel, rows) {
    if (psEmpty(sel, rows)) { return; }
    psRender(sel, {
        chart: { type: 'donut', height: 240 },
        series: psVals(rows), labels: psNames(rows),
        colors: PS_COLORS, legend: { position: 'bottom', fontSize: '12px' },
        dataLabels: { enabled: false }
    });
}
function psNum(v) { return Number(v || 0).toLocaleString(); }

// ---- Student tags page ----
function fetchPerformanceTags() {
    $.ajax({
        type: 'POST',
        contentType: APPLICATION_JSON_VALUE,
        url: getURLForHTML('dashboard', 'performance-student-tags'),
        data: JSON.stringify(getPerformanceStudentsRequest()),
        dataType: 'json',
        cache: false,
        timeout: 600000,
        success: function (data) {
            if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
                if (data['status'] == '3') { redirectLoginPage(); return; }
                showMessageTheme2(0, data['message'] || 'Unable to load dashboard.');
                return;
            }
            renderPerformanceTagsData(data);
        },
        error: function (xhr, status, error) {
            if (checkonlineOfflineStatus()) { return; }
            console.error('performance-student-tags error: ' + error);
            showMessageTheme2(0, 'Unable to load dashboard. Please retry.');
        }
    });
}

function renderPerformanceTagsData(data) {
    psSyncSession(data);
    $('#psTagStudents').text(psNum(data.studentsTotal));
    $('#psTagActivity').text(psNum(data.activityStudents));
    $('#psTagClubs').text(psNum((data.clubs || []).length));
    $('#psTagGpa').text(data.avgGpa != null ? data.avgGpa : '—');
    $('#psTagBilingual').text(psNum(data.bilingualPlus));
    psRenderSummaryTable(data.summary || [], data.summaryTotals || {});
    psBar('#psClubsChart', data.clubs || []);
    psBar('#psLangChart', data.languages || []);
}

function psRenderSummaryTable(rows, totals) {
    if (!rows.length) {
        $('#psSummaryTable').html('<div class="ps-empty">No enrolled students for this year.</div>');
        return;
    }
    var gpa = function (v) { return (v !== undefined && v !== null) ? v : '—'; };
    var h = '<table class="ps-tbl"><thead><tr><th>Grade band</th><th>1:1</th><th>Group</th>'
        + '<th>Other</th><th>Total</th><th>Avg GPA</th></tr></thead><tbody>';
    rows.forEach(function (r) {
        h += '<tr><td>' + r.band + '</td><td>' + psNum(r.oneToOne) + '</td><td>' + psNum(r.group)
            + '</td><td>' + psNum(r.other) + '</td><td>' + psNum(r.total) + '</td><td>' + gpa(r.avgGpa) + '</td></tr>';
    });
    h += '<tr class="ps-totr"><td>Total</td><td>' + psNum(totals.oneToOne) + '</td><td>' + psNum(totals.group)
        + '</td><td>' + psNum(totals.other) + '</td><td>' + psNum(totals.total) + '</td><td>' + gpa(totals.avgGpa) + '</td></tr>';
    h += '</tbody></table>';
    $('#psSummaryTable').html(h);
}

// ---- Retention page ----
function fetchPerformanceRetention() {
    $.ajax({
        type: 'POST',
        contentType: APPLICATION_JSON_VALUE,
        url: getURLForHTML('dashboard', 'performance-retention'),
        data: JSON.stringify(getPerformanceStudentsRequest()),
        dataType: 'json',
        cache: false,
        timeout: 600000,
        success: function (data) {
            if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
                if (data['status'] == '3') { redirectLoginPage(); return; }
                showMessageTheme2(0, data['message'] || 'Unable to load dashboard.');
                return;
            }
            renderPerformanceRetentionData(data);
        },
        error: function (xhr, status, error) {
            if (checkonlineOfflineStatus()) { return; }
            console.error('performance-retention error: ' + error);
            showMessageTheme2(0, 'Unable to load dashboard. Please retry.');
        }
    });
}

function renderPerformanceRetentionData(data) {
    psSyncSession(data);
    $('#psRetCohort').text(psNum(data.cohort));
    $('#psRetReenrolled').text(psNum(data.reEnrolled));
    $('#psRetReenrolledPct').html(data.reEnrolledPct != null ? data.reEnrolledPct + '% of cohort' : '&mdash;');
    $('#psRetNot').text(psNum(data.notRetained));
    $('#psRetWithdrawn').text(psNum(data.withdrawn) + ' withdrawn');
    $('#psRetGrad').text(psNum(data.graduated));

    if (data.hasNext) {
        $('#psRetNote').hide();
    } else {
        $('#psRetNote').text('No academic year after this one is set up, so "re-enrolled" can only count same-year re-enrollments. Pick an earlier year to see true year-over-year retention.').show();
    }

    psDonut('#psRetDonut', [
        { name: 'Re-enrolled', count: data.reEnrolled },
        { name: 'Not retained', count: data.notRetained },
        { name: 'Graduated', count: data.graduated }
    ]);
    psBar('#psRetProgramChart', (data.byProgram || []).map(function (p) {
        return { name: p.name, count: p.reEnrolled };
    }));
    psBar('#psRetReasonsChart', data.withdrawalReasons || []);
}

// ---- Student performance page ----
function fetchPerformanceStudentPerformance() {
    $.ajax({
        type: 'POST',
        contentType: APPLICATION_JSON_VALUE,
        url: getURLForHTML('dashboard', 'performance-student-performance'),
        data: JSON.stringify(getPerformanceStudentsRequest()),
        dataType: 'json',
        cache: false,
        timeout: 600000,
        success: function (data) {
            if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
                if (data['status'] == '3') { redirectLoginPage(); return; }
                showMessageTheme2(0, data['message'] || 'Unable to load dashboard.');
                return;
            }
            renderPerformanceStudentPerformanceData(data);
        },
        error: function (xhr, status, error) {
            if (checkonlineOfflineStatus()) { return; }
            console.error('performance-student-performance error: ' + error);
            showMessageTheme2(0, 'Unable to load dashboard. Please retry.');
        }
    });
}

function renderPerformanceStudentPerformanceData(data) {
    psSyncSession(data);
    $('#psPfGpa').text(data.avgGpa != null ? data.avgGpa : '—');
    $('#psPfGpaCmp').html(data.prevGpa != null ? 'vs ' + data.prevGpa + ' prev' : '&mdash;');
    $('#psPf3plus').text(psNum(data.at3plus));
    $('#psPfRisk').text(psNum(data.atRisk));
    $('#psPfProg').text(data.avgProgress != null ? data.avgProgress + '%' : '—');
    $('#psPfGraded').text(psNum(data.gradedCount));

    psBar('#psPfBandChart', data.gpaBands || []);
    psBar('#psPfProgramChart', (data.byProgram || []).map(function (p) {
        return { name: p.name, count: p.avgGpa || 0 };
    }));
    psColumn('#psPfYearChart', (data.byYear || []).map(function (y) {
        return { name: y.name, count: y.avgGpa || 0 };
    }));
    psBar('#psPfProgressChart', data.progressBands || []);
}

// ---- Live classes page ----
function fetchPerformanceLiveClasses() {
    $.ajax({
        type: 'POST',
        contentType: APPLICATION_JSON_VALUE,
        url: getURLForHTML('dashboard', 'performance-live-classes'),
        data: JSON.stringify(getPerformanceStudentsRequest()),
        dataType: 'json',
        cache: false,
        timeout: 600000,
        success: function (data) {
            if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
                if (data['status'] == '3') { redirectLoginPage(); return; }
                showMessageTheme2(0, data['message'] || 'Unable to load dashboard.');
                return;
            }
            renderPerformanceLiveClassesData(data);
        },
        error: function (xhr, status, error) {
            if (checkonlineOfflineStatus()) { return; }
            console.error('performance-live-classes error: ' + error);
            showMessageTheme2(0, 'Unable to load dashboard. Please retry.');
        }
    });
}

function renderPerformanceLiveClassesData(data) {
    psSyncSession(data);
    $('#psLcTotal').text(psNum(data.total));
    $('#psLcCompleted').text(psNum(data.completed));
    $('#psLcMissedPct').text(data.missedPct != null ? data.missedPct + '%' : '—');
    $('#psLcPerStudent').text(data.perStudent != null ? data.perStudent : '—');
    $('#psLcStudents').text(psNum(data.students));

    psColumn('#psLcMonthChart', data.byMonth || []);
    psDonut('#psLcOutcomeChart', data.outcomes || []);
    psBar('#psLcCourseChart', data.byCourse || []);
    psBar('#psLcTeacherChart', data.byTeacher || []);
}

// ---- Staff page ----
function fetchPerformanceStaff() { psPost('performance-staff', renderPerformanceStaffData, 'staff'); }

function renderPerformanceStaffData(data) {
    $('#psStTeachers').text(psNum(data.teachers));
    $('#psStNat').text(psNum(data.nationalities));
    $('#psStLang').text(psNum(data.languages));
    $('#psStExp').text(data.avgExperience != null ? data.avgExperience : '—');
    psColumn('#psStExpChart', data.experienceBands || []);
    psBar('#psStLangChart', data.languagesSpoken || []);
    psBar('#psStNatChart', data.byNationality || []);
}

// ---- Operations page ----
function fetchPerformanceOperations() { psPost('performance-operations', renderPerformanceOperationsData, 'operations'); }

function renderPerformanceOperationsData(data) {
    psSyncSession(data);
    $('#psOpMeetings').text(psNum(data.meetings));
    $('#psOpActivities').text(psNum(data.activities));
    $('#psOpConvos').text(psNum(data.conversations));
    $('#psOpMessages').text(psNum(data.messages));
    $('#psOpPerDay').text(data.messagesPerDay != null ? data.messagesPerDay : '—');
    psBar('#psOpTypeChart', data.byMeetingType || []);
    psDonut('#psOpRoleChart', data.byRole || []);
    psColumn('#psOpMonthChart', data.chatByMonth || []);
    $('#psOpTurnaround').html(data.refundHours != null
        ? '<h5>' + data.refundHours + ' hrs</h5><p>average refund request turnaround. Transcript and tech-request turnaround are not tracked with resolved timestamps yet.</p>'
        : '<p class="ps-empty">No resolved refund requests to measure turnaround.</p>');
}

// Shared POST helper for school-wide/year pages that need no custom pre-handling.
function psPost(suffix, onData, tab) {
    $.ajax({
        type: 'POST',
        contentType: APPLICATION_JSON_VALUE,
        url: getURLForHTML('dashboard', suffix),
        data: JSON.stringify(getPerformanceStudentsRequest()),
        dataType: 'json',
        cache: false,
        timeout: 600000,
        success: function (data) {
            if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
                if (data['status'] == '3') { redirectLoginPage(); return; }
                showMessageTheme2(0, data['message'] || 'Unable to load dashboard.');
                return;
            }
            onData(data);
        },
        error: function (xhr, status, error) {
            if (checkonlineOfflineStatus()) { return; }
            console.error(tab + ' error: ' + error);
            showMessageTheme2(0, 'Unable to load dashboard. Please retry.');
        }
    });
}
