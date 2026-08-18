/* ============================================================================
   My Rating (Teacher) — logged-in teacher's own rating dashboard
   - SUMMARY → POST teacher-evaluation/rating/teacher-performance
   Visualises the profile header, rating banner and the feedback section cards
   (details.feedbackSections — one card per group with trend + parameter table).
   ========================================================================== */

var tmrState = { detail: null, trendCharts: [] };

function teacherMyRatingOnLoad() {
    loadTeacherMyRating();
}

async function loadTeacherMyRating() {
    try {
        var response = await callCommonAjax({
            method: 'POST',
            url: APP_BASE_URL + API_VERSION + 'teacher-evaluation/rating/teacher-performance',
            body: {
                userId:          USER_ID,
                periodId:        null,      // backend resolves the active period
                roleUnderReview: 'Teacher',
                startDate:       null,
                endDate:         null
            },
            global: true,
            showMessage: false
        });
        if (response && response.status == '1' && response.details) {
            tmrState.detail = response.details;
            renderTeacherMyRating(response.details);
        } else {
            showMessageTheme2(0, (response && response.message) ? response.message : 'Failed to load your rating.');
        }
    } catch (e) {
        showMessageTheme2(0, 'Failed to load your rating.');
    }
}

// Banner tiers: 4.0–5.0 green, 3.0–3.99 yellow, 1.0–2.99 red.
function tmrTier(avg, firstName) {
    if (avg >= 4) return {
        bg: 'linear-gradient(135deg,#e6f4ea,#c8e6c9)', border: '#a5d6a7', accent: '#2e7d32',
        icon: 'fa-check', message: 'Keep up the good work, ' + firstName + '!'
    };
    if (avg >= 3) return {
        bg: 'linear-gradient(135deg,#fff8e1,#ffecb3)', border: '#ffd54f', accent: '#f9a825',
        icon: 'fa-exclamation', message: 'Steady progress, ' + firstName + '! You\'ve got this!'
    };
    return {
        bg: 'linear-gradient(135deg,#fce8e6,#ffcdd2)', border: '#ef9a9a', accent: '#c62828',
        icon: 'fa-line-chart', message: 'Every step counts, ' + firstName + '. Let\'s grow together!'
    };
}

// Neutral band for when no feedback has been submitted yet — a 0 score/rating here means
// "no data", not poor performance, so we avoid the red tier and its misleading message.
function tmrNeutralTier(firstName) {
    return {
        bg: 'linear-gradient(135deg,#f1f3f4,#e8eaed)', border: '#dadce0', accent: '#5f6368',
        icon: 'fa-comments-o', message: 'No feedback yet, ' + firstName + '. Your ratings will appear here once responses come in.'
    };
}

function renderTeacherMyRating(d) {
    var profile   = d.profile || {};
    var fullName  = profile.userFullName || ((typeof USER_FULL_NAME !== 'undefined' && USER_FULL_NAME) ? USER_FULL_NAME : '');
    // "Mr."/"Ms." style titles alone read awkward in the banner — carry the actual first name along
    var nameTokens = fullName.split(' ').filter(Boolean);
    var firstName = nameTokens[0] || 'there';
    if (/^(mr|mrs|ms|miss|dr|prof)\.?$/i.test(firstName) && nameTokens[1]) {
        firstName = firstName + ' ' + nameTokens[1];
    }

    // ── Profile header ──
    $('#tmrTeacherName').text(fullName);
    // same icon meta row as the teacher rating detail page header
    var metaParts = [];
    if (profile.employmentType) metaParts.push('<span><i class="fa fa-briefcase mr-1 text-muted"></i>Type: <span class="badge badge-info">' + profile.employmentType + '</span></span>');
    if (profile.country) metaParts.push('<span><i class="fa fa-globe mr-1 text-muted"></i>Country: <strong>' + profile.country + '</strong></span>');
    if (profile.timezone) metaParts.push('<span><i class="fa fa-clock-o mr-1 text-muted"></i>Timezone: <strong>' + profile.timezone + '</strong></span>');
    if (profile.workingHoursLabel || profile.workingHours != null) metaParts.push('<span><i class="fa fa-clock-o mr-1 text-muted"></i>Working Hours: <strong>' + (profile.workingHoursLabel || (profile.workingHours + ' hrs / mo')) + '</strong></span>');
    // if (profile.salaryLabel || profile.salary != null) metaParts.push('<span><i class="fa fa-money mr-1 text-muted"></i>Salary: <strong>' + (profile.salaryLabel || ('$' + profile.salary + ' / mo')) + '</strong></span>');
    $('#tmrTeacherMeta').html(metaParts.length ? metaParts.join('') : '<span class="text-muted">Teacher</span>');
    if (profile.photo) {
        $('#tmrAvatar').html('<img src="' + profile.photo + '" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:50%">');
    } else {
        var initials = fullName.split(' ').filter(Boolean).slice(0, 2).map(function (w) { return w[0].toUpperCase(); }).join('');
        $('#tmrAvatar').text(initials || 'T');
    }

    // ── Rating banner ──
    // Message + colors are decided here by rating range, not by the API's eligibilityTitle.
    var avg = d.averageRating != null ? d.averageRating : 0;
    // no responses at all → neutral band instead of the red "needs improvement" tier
    var hasResponses = (d.responses || 0) > 0 || avg > 0;
    var t = hasResponses ? tmrTier(avg, firstName) : tmrNeutralTier(firstName);
    var message = t.message;

    // star distribution rows, 5★ → 1★
    var counts = [5, 4, 3, 2, 1].map(function (star) {
        var item = (d.starDistribution || []).find(function (x) { return x.stars === star; });
        return item ? (item.count || 0) : 0;
    });
    var maxCount = Math.max.apply(null, counts.concat([1]));
    var dist = '';
    counts.forEach(function (count, i) {
        var pct = Math.round((count / maxCount) * 100);
        dist += '<div class="d-flex align-items-center" style="gap:6px">'
             +  '<span style="font-size:11px;width:22px;text-align:right;flex-shrink:0">' + (5 - i) + '&#9733;</span>'
             +  '<div style="flex:1;height:5px;background:rgba(0,0,0,.08);border-radius:3px;overflow:hidden"><div style="width:' + pct + '%;height:100%;background:' + t.accent + ';border-radius:3px"></div></div>'
             +  '<span style="font-size:11px;width:18px;flex-shrink:0">' + count + '</span>'
             +  '</div>';
    });

    var overall = d.overallScore != null ? d.overallScore : 0;
    var h = '<div class="mb-3 d-flex align-items-center flex-wrap" style="border-radius:12px;padding:18px 24px;gap:16px;background:' + t.bg + ';border:1px solid ' + t.border + '">'
        +   '<div style="width:52px;height:52px;border-radius:50%;background:' + t.accent + ';display:flex;align-items:center;justify-content:center;flex-shrink:0"><i class="fa ' + t.icon + ' text-white" style="font-size:24px"></i></div>'
        +   '<div style="font-size:17px;font-weight:700">' + message + '</div>'
        +   '<div class="d-flex align-items-center ml-auto" style="gap:20px">'
        +     '<div class="text-center"><div style="font-size:22px;font-weight:700">' + overall + '%</div><div style="font-size:11px;font-weight:500;text-transform:uppercase;letter-spacing:.4px">Overall Score</div></div>'
        +     '<div style="width:1px;background:rgba(0,0,0,.1);align-self:stretch"></div>'
        +     '<div class="text-center"><div style="font-size:22px;font-weight:700">' + Number(avg).toFixed(1) + '/5</div><div style="font-size:11px;font-weight:500;text-transform:uppercase;letter-spacing:.4px">Avg Rating</div></div>'
        +     '<div style="width:1px;background:rgba(0,0,0,.1);align-self:stretch"></div>'
        +     '<div style="display:flex;flex-direction:column;gap:3px;min-width:150px">' + dist + '</div>'
        +   '</div>'
        + '</div>';

    $('#tmrBanner').html(h);

    renderTmrFeedbackSections(d);
}

/* ============================================================================
   Feedback section cards — one per details.feedbackSections entry
   ========================================================================== */

// per-group accent palette, assigned by section index (blue, orange, then extras)
var TMR_SECTION_PALETTE = [
    { accent: '#1565c0', soft: '#e8f0fe' },
    { accent: '#e65100', soft: '#fff3e0' },
    { accent: '#188038', soft: '#e6f4ea' },
    { accent: '#7b1fa2', soft: '#f3e5f5' }
];

// score/star bands (score% = stars/5 × 100): 75–100% green, 52–74% amber, 0–51% red
var TMR_SCORE_AMBER_FLOOR = 52;   // amber band starts here (= 2.6★)

// same rating ranges as trStarColor (teacherRating.js): 0–2.5 red, 2.6–3.74 amber, 3.75–5 green
function tmrStarColor(rating) {
    var r = Number(rating) || 0;
    if (r < 2.6) return '#d93025';
    if (r < 3.75) return '#fbbc04';
    return '#1e8a3c';
}

// same score ranges as trScoreColor (teacherRating.js):
// >= threshold green, 52 to below-threshold amber, below 52 red
function tmrScoreColor(score, threshold) {
    if (score == null) return '#9aa0a6';
    if (score >= threshold) return '#1e8a3c';
    if (score >= TMR_SCORE_AMBER_FLOOR) return '#f57c00';
    return '#d93025';
}

// star row with fractional fill (4.8 = 4 full + one 80%-filled star), colored by rating range
function tmrStarsHtml(rating) {
    var r = Math.max(0, Math.min(5, Number(rating) || 0));
    var color = tmrStarColor(r);
    var pct = (r / 5) * 100;
    var greyRow = '', colorRow = '';
    for (var i = 0; i < 5; i++) {
        greyRow  += '<i class="fa fa-star" style="color:#e0e0e0"></i>';
        colorRow += `<i class="fa fa-star" style="color:${color}"></i>`;
    }
    return `<span style="position:relative;display:inline-block;line-height:1;font-size:16px;vertical-align:middle"><span style="white-space:nowrap">${greyRow}</span><span style="position:absolute;top:0;left:0;width:${pct}%;overflow:hidden;white-space:nowrap">${colorRow}</span></span>`;
}

// same ranges as trDetailStatusMeta (teacherRating.js), relabeled:
// >= threshold "Above Threshold" green, 52 to below-threshold "Needs Improvement" amber,
// below 52 "Below Threshold" red; No Response stays grey
function tmrStatusBadge(p, threshold) {
    if (p.status === 'No Response' || p.score == null) return `<span class="badge badge-secondary">${p.status || 'No Response'}</span>`;
    if (p.status === 'Pass' || p.status === 'Above Threshold' || p.score >= threshold) return `<span class="badge badge-success">Above Threshold</span>`;
    if (p.score >= TMR_SCORE_AMBER_FLOOR) return `<span class="badge text-white" style="background:#f57c00">Needs Improvement</span>`;
    return `<span class="badge badge-danger">Below Threshold</span>`;
}

function tmrScoreCellHtml(p, threshold) {
    if (p.score == null) return `<span class="text-muted">—</span>`;
    return `<span style="font-weight:700;color:${tmrScoreColor(p.score, threshold)}">${p.score}%</span>`;
}

// parameter avg rating as range-colored stars (tmrStarColor tiers) + numeric value
function tmrRatingCellHtml(p) {
    if (p.averageRating == null) return `<span class="text-muted">—</span>`;
    return `<span style="white-space:nowrap">${tmrStarsHtml(p.averageRating)}<span class="ml-1" style="font-size:12px;color:#5f6368;vertical-align:middle">${Number(p.averageRating).toFixed(1)}</span></span>`;
}

function renderTmrFeedbackSections(d) {
    // re-render safety: drop previous chart instances before rebuilding the DOM
    (tmrState.trendCharts || []).forEach(function (c) { try { c.destroy(); } catch (e) {} });
    tmrState.trendCharts = [];

    // groups nobody has rated yet (e.g. Management Evaluation with 0 responses) are
    // hidden; palette is picked BEFORE filtering so each group keeps its accent color
    var sections = (d.feedbackSections || [])
        .map(function (s, idx) { return { s: s, pal: TMR_SECTION_PALETTE[idx % TMR_SECTION_PALETTE.length] }; })
        .filter(function (x) { return (x.s.responseCount || 0) > 0 || Number(x.s.averageRating) > 0; });
    if (!sections.length) { $('#tmrFeedbackSections').empty(); return; }

    var threshold = d.minParamThreshold != null ? d.minParamThreshold : 75;
    var colClass = sections.length === 1 ? 'col-12' : 'col-xl-6';
    var thStyle = 'font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.4px;padding:0 12px 10px;text-align:left;border-bottom:1px solid #e8eaed';
    var tdStyle = 'padding:12px;border-bottom:1px solid #f1f3f4;font-size:13px';

    var cards = sections.map(function (x, i) {
        var s = x.s, pal = x.pal;
        var avg = s.averageRating != null ? Number(s.averageRating) : 0;

        var rows = (s.parameters || []).map(function (p) {
            return `
            <tr>
                <td style="${tdStyle}">${p.parameterName || '—'}</td>
                <td style="${tdStyle}">${tmrRatingCellHtml(p)}</td>
                <td style="${tdStyle}">${tmrScoreCellHtml(p, threshold)}</td>
                <td style="${tdStyle}">${tmrStatusBadge(p, threshold)}</td>
            </tr>`;
        }).join('');
        if (!rows) {
            rows = `<tr><td colspan="4" class="text-center text-muted" style="padding:16px;font-size:13px">No parameters available.</td></tr>`;
        }

        var trendBlock = `
                        <div style="flex:1;min-width:220px">
                            <div id="tmrTrendChart${i}"></div>
                            <div class="text-center" style="font-size:11px;color:#5f6368">Rating trend across months</div>
                        </div>`;

        // info bar temporarily hidden — re-enable when needed
        // var infoBar = s.infoMessage ? `
        //     <div class="d-flex align-items-center rounded px-3 py-2 mb-3" style="gap:6px;background:#f8f9fa;border:1px solid #e8eaed">
        //         <i class="fa fa-info-circle" style="color:#5f6368"></i>
        //         <span style="font-size:11px;color:#212529">${s.infoMessage}</span>
        //     </div>` : '';
        var infoBar = '';

        return `
        <div class="${colClass} d-flex mb-3">
            <div class="card w-100">
                <div class="card-body">
                    <div class="font-weight-bold mb-2" style="font-size:14px">${s.groupName || ''}</div>

                    <div class="d-flex align-items-center flex-wrap" style="gap:14px;padding:8px 0 14px;border-bottom:1px solid #f1f3f4;margin-bottom:12px">
                        <div style="flex-shrink:0">
                            <div style="font-size:36px;font-weight:700;line-height:1">${avg.toFixed(1)}<span style="font-size:16px;color:#5f6368;font-weight:600">/5</span></div>
                            <div class="mt-1">${tmrStarsHtml(avg)}</div>
                            <div class="d-flex align-items-center mt-1" style="gap:4px;font-size:12px;color:#5f6368"><i class="fa fa-users"></i><span>${s.responseLabel || '0 responses'}</span></div>
                        </div>
                        ${trendBlock}
                        <div class="text-center rounded ml-auto" style="flex-shrink:0;background:${pal.soft};padding:8px 14px">
                            <div style="font-size:18px;font-weight:700;color:${pal.accent}">${s.weight != null ? s.weight : 0}%</div>
                            <div style="font-size:10px;color:#5f6368;text-transform:uppercase;letter-spacing:.3px">Weight</div>
                        </div>
                    </div>

                    ${infoBar}

                    <div class="font-weight-bold" style="font-size:12px;text-transform:uppercase;letter-spacing:.4px;margin-bottom:8px">Parameter-Wise Scores</div>
                    <div class="table-responsive">
                        <table class="w-100" style="border-collapse:collapse">
                            <thead>
                                <tr>
                                    <th style="${thStyle}">Parameter</th>
                                    <th style="${thStyle};width:130px">Rating</th>
                                    <th style="${thStyle};width:90px">Score</th>
                                    <th style="${thStyle};width:140px">Status</th>
                                </tr>
                            </thead>
                            <tbody>${rows}</tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>`;
    }).join('');

    $('#tmrFeedbackSections').html(`
        <div class="d-flex align-items-center mb-2" style="gap:8px">
            <i class="fa fa-commenting-o text-primary"></i>
            <span class="font-weight-bold" style="font-size:15px">Student & Management Feedback</span>
        </div>
        <div class="row">${cards}</div>`);

    sections.forEach(function (x, i) { tmrRenderTrendChart(x.s, i, x.pal); });
}

function tmrRenderTrendChart(section, idx, pal) {
    if (typeof ApexCharts === 'undefined') return;
    var el = document.querySelector('#tmrTrendChart' + idx);
    if (!el) return;

    var trend = section.trend || [];
    var options = {
        chart: { type: 'area', height: 160, toolbar: { show: false }, zoom: { enabled: false }, parentHeightOffset: 0 },
        series: [{
            name: 'Avg Rating',
            data: trend.map(function (t) { return t.averageRating; })
        }],
        xaxis: {
            categories: trend.map(function (t) { return t.monthLabel || ''; }),
            labels: { style: { fontSize: '10px', colors: '#9aa0a6' } },
            axisBorder: { show: false },
            axisTicks: { show: false },
            tooltip: { enabled: false }
        },
        yaxis: { min: 1, max: 5, tickAmount: 4, labels: { style: { fontSize: '10px', colors: '#9aa0a6' } } },
        colors: [pal.accent],
        stroke: { curve: 'straight', width: 2.5 },
        fill: { type: 'gradient', gradient: { shadeIntensity: 0, opacityFrom: 0.25, opacityTo: 0.05 } },
        markers: { size: 3.5, hover: { size: 5 } },
        dataLabels: { enabled: false },
        grid: { borderColor: '#f1f3f4', strokeDashArray: 3, padding: { left: 6, right: 6 } },
        tooltip: {
            y: {
                formatter: function (v, ctx) {
                    if (v == null) return 'No responses';
                    var t = trend[ctx.dataPointIndex] || {};
                    var resp = t.responseCount != null ? t.responseCount : 0;
                    return v + '/5 · ' + resp + ' response' + (resp === 1 ? '' : 's');
                }
            }
        }
    };
    try {
        var chart = new ApexCharts(el, options);
        chart.render();
        tmrState.trendCharts.push(chart);
    } catch (e) { /* noop */ }
}
