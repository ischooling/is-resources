// Student Management > Performance Dashboard (Performance & Reports).
// HTML builder + one-time CSS. Logic + AJAX + ApexCharts live in performanceStudents.js.
// 7 page tabs (BRD); only Students is built now - the rest are "coming soon" placeholders.
// Endpoint: {schoolUuid}/dashboard/performance-students  (POST, JSON auto-wrapped as Payload).
// Real data only: a figure the data does not have shows as 0.

function getPerformanceStudentsStyles() {
    // Inject once into <head> so it survives content re-renders (same reason as the enrolment dashboard).
    if ($("#ps-styles").length) { return ""; }
    return ''
        + '<style id="ps-styles">'
        + '.ps-wrap{padding:4px 2px 40px;}'
        + '.ps-top{display:flex;align-items:center;flex-wrap:wrap;gap:12px;margin:6px 2px 10px;}'
        + '.ps-top h4{font-size:18px;font-weight:600;margin:0;color:#1a2233;}'
        + '.ps-top .ps-showing{font-size:12px;color:#5b6577;margin-left:auto;}'
        + '.ps-top select{height:34px;border:1px solid #d4d9e2;border-radius:8px;background:#fff;color:#1a2233;padding:0 8px;font-size:13px;}'
        + '.ps-tabs{display:flex;gap:2px;flex-wrap:wrap;border-bottom:1px solid #e6e9f0;margin:0 2px 14px;}'
        + '.ps-tab{border:0;background:transparent;color:#5b6577;padding:9px 13px;font-size:13px;cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-1px;font-family:inherit;}'
        + '.ps-tab.on{color:#2a78d6;border-bottom-color:#2a78d6;font-weight:600;}'
        + '.ps-kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin-bottom:14px;}'
        + '.ps-kpi{background:#fff;border:1px solid #e6e9f0;border-radius:10px;padding:13px 15px;box-shadow:0 1px 2px rgba(16,24,40,.04);}'
        + '.ps-kpi .ps-cap{font-size:11px;color:#5b6577;font-weight:500;}'
        + '.ps-kpi .ps-val{font-size:26px;font-weight:700;line-height:1.1;margin:5px 0 2px;color:#1a2233;font-variant-numeric:tabular-nums;}'
        + '.ps-kpi .ps-foot{font-size:11px;color:#5b6577;}'
        + '.ps-up{color:#1e7a34;} .ps-down{color:#c0392b;}'
        + '.ps-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:12px;}'
        + '.ps-card{background:#fff;border:1px solid #e6e9f0;border-radius:12px;padding:14px;}'
        + '.ps-card h6{font-size:13px;font-weight:600;margin:0 0 10px;color:#1a2233;}'
        + '.ps-empty{color:#8a94a6;font-size:12px;padding:18px 2px;}'
        + '.ps-note{font-size:11px;color:#8a94a6;margin:0 2px 12px;}'
        + '.ps-tbl{width:100%;border-collapse:collapse;font-size:13px;}'
        + '.ps-tbl th{text-align:right;font-size:11px;color:#5b6577;font-weight:600;padding:8px 10px;border-bottom:1px solid #e6e9f0;}'
        + '.ps-tbl th:first-child,.ps-tbl td:first-child{text-align:left;}'
        + '.ps-tbl td{padding:8px 10px;border-bottom:1px solid #eef1f7;text-align:right;color:#1a2233;font-variant-numeric:tabular-nums;}'
        + '.ps-tbl tr.ps-totr td{font-weight:700;border-top:2px solid #e6e9f0;}'
        + '.ps-coming{background:#fff;border:1px solid #e6e9f0;border-radius:12px;padding:46px 20px;text-align:center;}'
        + '.ps-coming h5{font-size:16px;color:#1a2233;margin:0 0 8px;}'
        + '.ps-coming .ps-tag{display:inline-block;font-size:11px;font-weight:600;color:#2a78d6;background:#e6f1fb;border-radius:20px;padding:3px 11px;margin-bottom:12px;}'
        + '.ps-coming p{font-size:12.5px;color:#5b6577;margin:0 auto;max-width:560px;line-height:1.7;}'
        + '</style>';
}

// BRD page tabs. Only "students" is built; the others show a placeholder listing their planned widgets.
var PS_TABS = [
    { key: 'students', label: 'Students' },
    { key: 'student-tags', label: 'Student tags', widgets: 'Tags on students, athletes (school/national/international), special needs, bilingual/multilingual, summary by grade.' },
    { key: 'student-performance', label: 'Student performance', widgets: 'Average GPA, at-risk students, GPA by band, program, teacher and course, gradable progress.' },
    { key: 'retention', label: 'Retention', widgets: 'Re-enrolled / not retained / graduated by year and program, withdrawal reasons.' },
    { key: 'live-classes', label: 'Live classes', widgets: 'Classes taken (1:1 vs group), outcomes, classes per student, by course and teacher.' },
    { key: 'operations', label: 'Operations', widgets: 'Meetings, activity sessions, chat conversations and messages, request turnaround.' },
    { key: 'staff', label: 'Staff', widgets: 'Teachers, nationalities, languages, experience, by grade band and country.' }
];

function getPerformanceStudentsContent(title) {
    $("head").append(getPerformanceStudentsStyles());
    var tabs = PS_TABS.map(function (t) {
        return '<button class="ps-tab" data-tab="' + t.key + '">' + t.label + '</button>';
    }).join('');
    return ''
        + '<div class="ps-wrap">'
        + '  <div class="ps-top">'
        + '    <h4>' + (title || 'Performance Dashboard') + '</h4>'
        + '    <select id="psSession"></select>'
        + '    <span class="ps-showing" id="psShowing">&mdash;</span>'
        + '  </div>'
        + '  <div class="ps-tabs">' + tabs + '</div>'
        + '  <div id="psStudentsPanel">'
        + '    <div class="ps-kpis">'
        + '      <div class="ps-kpi"><div class="ps-cap">Students enrolled</div><div class="ps-val" id="psEnrolled">0</div><div class="ps-foot" id="psEnrolledCmp">&mdash;</div></div>'
        + '      <div class="ps-kpi"><div class="ps-cap">Countries</div><div class="ps-val" id="psCountries">0</div><div class="ps-foot">residence</div></div>'
        + '      <div class="ps-kpi" id="psElemTile"><div class="ps-cap">Elementary</div><div class="ps-val" id="psElem">0</div><div class="ps-foot">K&ndash;5</div></div>'
        + '      <div class="ps-kpi" id="psMiddleTile"><div class="ps-cap">Middle</div><div class="ps-val" id="psMiddle">0</div><div class="ps-foot">6&ndash;8</div></div>'
        + '      <div class="ps-kpi" id="psHighTile"><div class="ps-cap">High</div><div class="ps-val" id="psHigh">0</div><div class="ps-foot">9&ndash;12</div></div>'
        + '    </div>'
        + '    <div class="ps-grid">'
        + '      <div class="ps-card"><h6>Enrollments by month</h6><div id="psMonthChart"></div></div>'
        + '      <div class="ps-card"><h6>Learning program</h6><div id="psProgramChart"></div></div>'
        + '      <div class="ps-card"><h6>Top countries</h6><div id="psCountryChart"></div></div>'
        + '      <div class="ps-card"><h6>Students by grade</h6><div id="psGradeChart"></div></div>'
        + '      <div class="ps-card"><h6>Gender</h6><div id="psGenderChart"></div></div>'
        + '    </div>'
        + '  </div>'
        + '  <div id="psTagsPanel" style="display:none;">'
        + '    <div class="ps-note">Shown from real data: grade band, program, GPA, extra-curricular clubs, and languages known (free-text).</div>'
        + '    <div class="ps-kpis">'
        + '      <div class="ps-kpi"><div class="ps-cap">Students</div><div class="ps-val" id="psTagStudents">0</div><div class="ps-foot">current year</div></div>'
        + '      <div class="ps-kpi"><div class="ps-cap">In an activity / club</div><div class="ps-val" id="psTagActivity">0</div><div class="ps-foot">&ge;1 club</div></div>'
        + '      <div class="ps-kpi"><div class="ps-cap">Activities offered</div><div class="ps-val" id="psTagClubs">0</div><div class="ps-foot">with members</div></div>'
        + '      <div class="ps-kpi"><div class="ps-cap">Average GPA</div><div class="ps-val" id="psTagGpa">&mdash;</div><div class="ps-foot">enrolled students</div></div>'
        + '      <div class="ps-kpi"><div class="ps-cap">Bilingual+</div><div class="ps-val" id="psTagBilingual">0</div><div class="ps-foot">&ge;2 languages known</div></div>'
        + '    </div>'
        + '    <div class="ps-card" style="margin-bottom:12px;"><h6>Summary &mdash; grade band &times; program</h6><div id="psSummaryTable"></div></div>'
        + '    <div class="ps-grid"><div class="ps-card"><h6>Students by club / activity</h6><div id="psClubsChart"></div></div>'
        + '      <div class="ps-card"><h6>Languages (bilingual+)</h6><div id="psLangChart"></div></div></div>'
        + '  </div>'
        + '  <div id="psRetentionPanel" style="display:none;">'
        + '    <div class="ps-note" id="psRetNote" style="display:none;"></div>'
        + '    <div class="ps-kpis">'
        + '      <div class="ps-kpi"><div class="ps-cap">Cohort</div><div class="ps-val" id="psRetCohort">0</div><div class="ps-foot">enrolled this year</div></div>'
        + '      <div class="ps-kpi"><div class="ps-cap">Re-enrolled</div><div class="ps-val" id="psRetReenrolled">0</div><div class="ps-foot" id="psRetReenrolledPct">&mdash;</div></div>'
        + '      <div class="ps-kpi"><div class="ps-cap">Not retained</div><div class="ps-val" id="psRetNot">0</div><div class="ps-foot" id="psRetWithdrawn">&mdash;</div></div>'
        + '      <div class="ps-kpi"><div class="ps-cap">Graduated</div><div class="ps-val" id="psRetGrad">0</div><div class="ps-foot">passed out</div></div>'
        + '    </div>'
        + '    <div class="ps-grid">'
        + '      <div class="ps-card"><h6>Retention breakdown</h6><div id="psRetDonut"></div></div>'
        + '      <div class="ps-card"><h6>Re-enrolled by program</h6><div id="psRetProgramChart"></div></div>'
        + '      <div class="ps-card"><h6>Why students leave</h6><div id="psRetReasonsChart"></div></div>'
        + '    </div>'
        + '  </div>'
        + '  <div id="psPerfPanel" style="display:none;">'
        + '    <div class="ps-kpis">'
        + '      <div class="ps-kpi"><div class="ps-cap">Average GPA</div><div class="ps-val" id="psPfGpa">&mdash;</div><div class="ps-foot" id="psPfGpaCmp">&mdash;</div></div>'
        + '      <div class="ps-kpi"><div class="ps-cap">Students at 3.0+</div><div class="ps-val" id="psPf3plus">0</div><div class="ps-foot">of graded</div></div>'
        + '      <div class="ps-kpi"><div class="ps-cap">At risk (&lt;2.0)</div><div class="ps-val" id="psPfRisk">0</div><div class="ps-foot">GPA below 2</div></div>'
        + '      <div class="ps-kpi"><div class="ps-cap">Avg gradable progress</div><div class="ps-val" id="psPfProg">&mdash;</div><div class="ps-foot">active subjects</div></div>'
        + '      <div class="ps-kpi"><div class="ps-cap">Graded students</div><div class="ps-val" id="psPfGraded">0</div><div class="ps-foot">with a GPA</div></div>'
        + '    </div>'
        + '    <div class="ps-grid">'
        + '      <div class="ps-card"><h6>GPA segregation</h6><div id="psPfBandChart"></div></div>'
        + '      <div class="ps-card"><h6>GPA by program</h6><div id="psPfProgramChart"></div></div>'
        + '      <div class="ps-card"><h6>GPA progression by year</h6><div id="psPfYearChart"></div></div>'
        + '      <div class="ps-card"><h6>Students by gradable progress</h6><div id="psPfProgressChart"></div></div>'
        + '    </div>'
        + '  </div>'
        + '  <div id="psLivePanel" style="display:none;">'
        + '    <div class="ps-note">Shows 1:1 classes (student doubt sessions) for the selected year. Group/batch class counting is a separate step.</div>'
        + '    <div class="ps-kpis">'
        + '      <div class="ps-kpi"><div class="ps-cap">1:1 classes</div><div class="ps-val" id="psLcTotal">0</div><div class="ps-foot">this year</div></div>'
        + '      <div class="ps-kpi"><div class="ps-cap">Completed</div><div class="ps-val" id="psLcCompleted">0</div><div class="ps-foot">held</div></div>'
        + '      <div class="ps-kpi"><div class="ps-cap">Missed by student</div><div class="ps-val" id="psLcMissedPct">&mdash;</div><div class="ps-foot">of total</div></div>'
        + '      <div class="ps-kpi"><div class="ps-cap">Classes / student</div><div class="ps-val" id="psLcPerStudent">&mdash;</div><div class="ps-foot">average</div></div>'
        + '      <div class="ps-kpi"><div class="ps-cap">Students</div><div class="ps-val" id="psLcStudents">0</div><div class="ps-foot">with a class</div></div>'
        + '    </div>'
        + '    <div class="ps-grid">'
        + '      <div class="ps-card"><h6>Monthly classes taken</h6><div id="psLcMonthChart"></div></div>'
        + '      <div class="ps-card"><h6>Class outcomes</h6><div id="psLcOutcomeChart"></div></div>'
        + '      <div class="ps-card"><h6>Classes by course (top 20)</h6><div id="psLcCourseChart"></div></div>'
        + '      <div class="ps-card"><h6>Classes by teacher (top 20)</h6><div id="psLcTeacherChart"></div></div>'
        + '    </div>'
        + '  </div>'
        + '  <div id="psStaffPanel" style="display:none;">'
        + '    <div class="ps-kpis">'
        + '      <div class="ps-kpi"><div class="ps-cap">Teachers</div><div class="ps-val" id="psStTeachers">0</div><div class="ps-foot">active</div></div>'
        + '      <div class="ps-kpi"><div class="ps-cap">Nationalities</div><div class="ps-val" id="psStNat">0</div><div class="ps-foot">teachers</div></div>'
        + '      <div class="ps-kpi"><div class="ps-cap">Languages</div><div class="ps-val" id="psStLang">0</div><div class="ps-foot">spoken</div></div>'
        + '      <div class="ps-kpi"><div class="ps-cap">Avg experience</div><div class="ps-val" id="psStExp">&mdash;</div><div class="ps-foot">years</div></div>'
        + '    </div>'
        + '    <div class="ps-grid">'
        + '      <div class="ps-card"><h6>Teaching experience</h6><div id="psStExpChart"></div></div>'
        + '      <div class="ps-card"><h6>Languages teachers speak</h6><div id="psStLangChart"></div></div>'
        + '      <div class="ps-card"><h6>Teachers by nationality</h6><div id="psStNatChart"></div></div>'
        + '    </div>'
        + '  </div>'
        + '  <div id="psOpsPanel" style="display:none;">'
        + '    <div class="ps-kpis">'
        + '      <div class="ps-kpi"><div class="ps-cap">Meetings</div><div class="ps-val" id="psOpMeetings">0</div><div class="ps-foot">non-class</div></div>'
        + '      <div class="ps-kpi"><div class="ps-cap">Activity sessions</div><div class="ps-val" id="psOpActivities">0</div><div class="ps-foot">this year</div></div>'
        + '      <div class="ps-kpi"><div class="ps-cap">Conversations</div><div class="ps-val" id="psOpConvos">0</div><div class="ps-foot">diary threads</div></div>'
        + '      <div class="ps-kpi"><div class="ps-cap">Messages</div><div class="ps-val" id="psOpMessages">0</div><div class="ps-foot">in-app</div></div>'
        + '      <div class="ps-kpi"><div class="ps-cap">Messages / day</div><div class="ps-val" id="psOpPerDay">&mdash;</div><div class="ps-foot">average</div></div>'
        + '    </div>'
        + '    <div class="ps-grid">'
        + '      <div class="ps-card"><h6>Meetings by type</h6><div id="psOpTypeChart"></div></div>'
        + '      <div class="ps-card"><h6>Messages by sender role</h6><div id="psOpRoleChart"></div></div>'
        + '      <div class="ps-card"><h6>Chat volume by month</h6><div id="psOpMonthChart"></div></div>'
        + '      <div class="ps-card"><h6>Request turnaround</h6><div id="psOpTurnaround" class="ps-coming" style="padding:26px 16px;"></div></div>'
        + '    </div>'
        + '  </div>'
        + '  <div id="psOtherPanel" style="display:none;"></div>'
        + '</div>';
}

function getPerformanceComingSoon(key) {
    var t = PS_TABS.filter(function (x) { return x.key === key; })[0] || {};
    return '<div class="ps-coming"><span class="ps-tag">Coming soon</span>'
        + '<h5>' + (t.label || '') + '</h5>'
        + '<p>' + (t.widgets || 'This page is planned for a later phase.') + '</p></div>';
}
