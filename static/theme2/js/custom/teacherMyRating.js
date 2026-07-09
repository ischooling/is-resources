/* ============================================================================
   My Rating (Teacher) — logged-in teacher's own rating dashboard
   - SUMMARY → POST teacher-evaluation/rating/teacher-performance
   Only the profile header + rating banner are visualised for now; the rest of
   the dashboard is a "coming soon" placeholder.
   ========================================================================== */

var tmrState = { detail: null };

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
    var t = tmrTier(avg, firstName);
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
}
