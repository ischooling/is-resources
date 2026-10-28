/* =====================================================================
 * Video Library — Student (Videos) : HTML template builders
 * Paired logic file: studentVideoLibrary.js
 * Rendered into #dashboardContentInHTML by initStudentVideoLibrary().
 * One playlist per enrolled course: lessons in order, an inline player that
 * moves on to the next lesson, and search across all courses.
 * ===================================================================== */

function getStudentVideoLibraryPageContent(title) {
    return `
    <div class="custom-field-scope svl-scope">
        <div class="svl-hero">
            <div class="svl-hero-inner">
                <div class="svl-hero-icon svl-reveal"><i class="fa fa-play-circle"></i></div>
                <div>
                    <div class="svl-hero-title svl-reveal">${title}</div>
                    <div class="svl-hero-sub svl-reveal">Your course playlists — watch the lessons in order</div>
                </div>
                <div class="svl-hero-search svl-reveal">
                    <i class="fa fa-search"></i>
                    <input type="text" id="svlSearch" placeholder="Search all your videos..." aria-label="Search videos"/>
                </div>
            </div>
        </div>

        <div id="svlAccess"></div>
        <div id="svlChips" class="svl-chips svl-reveal" role="tablist" aria-label="Your courses"></div>
        <div id="svlMain"></div>
    </div>

    ${getStudentVideoLibraryStyles()}
    `;
}

/* one chip per course playlist (a locked course shows a lock instead of its progress) */
function renderStudentCourseChips(playlists, activeIndex) {
    return playlists.map(function (d, i) {
        var p = d.playlist || {};
        var steps = svlBuildSteps(d);
        var done = steps.filter(svlStepDone).length;
        var count = p.locked
            ? '<span class="svl-chip-count is-locked"><i class="fa fa-lock"></i></span>'
            : '<span class="svl-chip-count' + (done === steps.length ? ' is-done' : '') + '">'
              + (done === steps.length ? '<i class="fa fa-check"></i> ' : '') + done + '/' + steps.length + '</span>';
        return '<button type="button" role="tab" aria-selected="' + (i === activeIndex) + '" class="svl-chip' + (i === activeIndex ? ' active' : '') + (p.locked ? ' is-locked' : '') + '"'
            + ' title="' + svlEsc(p.title) + (p.locked ? ' — locked' : ' — ' + done + ' of ' + steps.length + ' done') + '" onclick="svlSelectCourse(' + i + ')">'
            + '<span class="svl-chip-txt">' + svlEsc(p.title) + '</span>'
            + (p.standardName ? '<span class="svl-chip-grade">' + svlEsc(p.standardName) + '</span>' : '')
            + count + '</button>';
    }).join('');
}

var SVL_PLAN_NAMES = { TRIAL: 'Free trial', THREE_COURSES: '3-course plan', CUSTOM: 'Custom plan', ALL: 'All-courses plan', LIFETIME: 'Full course plan' };

/* paywall on: the student's plan(s) and, while something is locked, the trial / subscribe buttons */
function renderStudentAccessBar(access, playlists) {
    if (!access || !access.paywall) { return ''; }
    var locked = (playlists || []).filter(function (d) { return d.playlist && d.playlist.locked; }).length;
    var total = (playlists || []).length;
    var plans = (access.subscriptions || []).map(function (s) {
        var name = SVL_PLAN_NAMES[s.planCode] || 'Plan';
        if (s.planCode === 'CUSTOM' || s.planCode === 'THREE_COURSES') { name += ' · ' + (s.courseCount || 0) + ' course' + (s.courseCount === 1 ? '' : 's'); }
        var ends = s.endDate ? (s.planCode === 'TRIAL' ? svlDaysLeft(s.endDate) : 'until ' + svlFmtDate(s.endDate))
            : s.courseEnds ? 'until ' + svlFmtDate(s.courseEnds) : 'until your course ends';
        return '<span class="svl-plan-pill' + (s.planCode === 'TRIAL' ? ' is-trial' : '') + '"><i class="fa ' + (s.planCode === 'TRIAL' ? 'fa-hourglass-half' : 'fa-check-circle') + '"></i> '
            + svlEsc(name) + ' <small>' + svlEsc(ends) + '</small></span>';
    }).join('');
    if (!plans && !locked) { return ''; }
    var line = locked
        ? (locked === total ? 'Your course videos are locked.' : locked + ' of ' + total + ' courses are locked.')
        : 'All your courses are open.';
    return `
    <div class="svl-access${locked ? '' : ' is-open'}">
        <div class="svl-access-icon"><i class="fa ${locked ? 'fa-lock' : 'fa-unlock'}"></i></div>
        <div class="svl-access-body">
            ${plans ? '<div class="svl-access-plans">' + plans + '</div>' : '<div class="svl-access-title">Videos need a subscription</div>'}
            <div class="svl-access-text">${svlEsc(line)}</div>
        </div>
        ${locked ? renderStudentUnlockButtons(access) : svlRenewDue(access)
            ? '<div class="svl-unlock-btns"><button type="button" class="svl-btn svl-btn-sub" onclick="svlOpenSubscribe()"><i class="fa fa-refresh"></i> Renew</button></div>'
            : svlTrialOnly(access)
            ? '<div class="svl-unlock-btns"><button type="button" class="svl-btn svl-btn-sub" onclick="svlOpenSubscribe()"><i class="fa fa-unlock-alt"></i> Subscribe</button></div>' : ''}
    </div>`;
}

/* the Subscribe modal: plans for the student's grade, course choice, live total, then the shared checkout */
function getStudentSubscribeModalHtml() {
    return `
    <div class="modal fade svl-sub-modal" id="svlSubModal" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div class="modal-content svl-sub-content">
          <div class="modal-header svl-sub-header">
            <h5 class="modal-title"><i class="fa fa-unlock-alt mr-2"></i>Subscribe to course videos</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span>&times;</span></button>
          </div>
          <div class="modal-body" id="svlSubBody"><div class="svl-sub-loading">Loading plans…</div></div>
          <div class="modal-footer svl-sub-footer" id="svlSubFooter"></div>
        </div>
      </div>
    </div>`;
}

/* o = VideoCheckoutOptionsDTO, pick = { planCode, count (custom), subjectIds[] } */
function renderStudentSubscribeBody(o, pick) {
    if (!o.canBuy) {
        return '<div class="svl-sub-blocked"><i class="fa fa-info-circle"></i> ' + svlEsc(o.blockedReason || 'Subscriptions are not available right now.') + '</div>';
    }
    var only = o.courses.length === 1 ? o.courses[0].courseTitle : null;
    var picked = svlPickKey(pick);
    var plans = svlPlanCards(o).map(function (card) {
        var p = card.plan;
        var custom = p.planCode === 'CUSTOM';
        var name = custom ? (card.count === 1 ? '1 course' : card.count + ' courses') : p.name;
        var price = custom
            ? '$' + svlMoney((Number(p.fee) || 0) * card.count) + ' <small>/ month' + (card.count > 1 ? ' · $' + svlMoney(p.fee) + ' per course' : '') + '</small>'
            : '$' + svlMoney(p.fee) + (p.lifetime ? ' <small>one-time</small>' : ' <small>/ month</small>');
        var what = p.lifetime ? (only ? only + ', until your course ends' : 'All your courses, until your course ends') + (p.untilDate ? ' (' + svlFmtDate(p.untilDate) + ')' : '')
            : p.planCode === 'ALL' ? 'All ' + o.courses.length + ' of your courses'
            : p.planCode === 'THREE_COURSES' ? 'Choose any 3 of your courses'
            : only ? only : 'Choose ' + card.count + ' of your courses';
        return '<label class="svl-plan' + (picked === card.key ? ' active' : '') + '">'
            + '<input type="radio" name="svlPlan" value="' + card.key + '"' + (picked === card.key ? ' checked' : '') + ' onchange="svlPickCard(this.value)"/>'
            + '<span class="svl-plan-name">' + svlEsc(name) + '</span>'
            + '<span class="svl-plan-price">' + price + '</span>'
            + '<span class="svl-plan-what">' + svlEsc(what) + '</span></label>';
    }).join('');
    var need = svlPickNeed(o, pick);
    var courses = '';
    if (need > 0 && need < o.courses.length) {
        var n = pick.subjectIds.length;
        courses = '<div class="svl-sub-label">Choose ' + need + ' course' + (need === 1 ? '' : 's') + ' <span class="svl-sub-count' + (svlPickValid(o, pick) ? ' is-ok' : '') + '">'
            + n + ' of ' + need + '</span></div>'
            + '<div class="svl-sub-courses">' + o.courses.map(function (c) {
                var on = pick.subjectIds.indexOf(c.subjectId) !== -1;
                var full = !on && n >= need;
                return '<label class="svl-sub-course' + (on ? ' active' : '') + (full ? ' is-full' : '') + '">'
                    + '<input type="checkbox" value="' + c.subjectId + '"' + (on ? ' checked' : '') + (full ? ' disabled' : '')
                    + ' onchange="svlPickCourse(' + c.subjectId + ', this.checked)"/><span>' + svlEsc(c.courseTitle) + '</span></label>';
            }).join('') + '</div>';
    }
    return '<div class="svl-sub-label">Choose a plan' + (o.standardName ? ' <span class="svl-sub-grade">' + svlEsc(o.standardName) + '</span>' : '') + '</div>'
        + '<div class="svl-plans">' + plans + '</div>' + courses;
}

function renderStudentSubscribeFooter(o, pick) {
    if (!o || !o.canBuy) {
        return '<button type="button" class="svl-nav-btn" data-dismiss="modal">Close</button>';
    }
    var plan = svlPickedPlan(o, pick);
    var total = svlPickTotal(o, pick);
    var starts = o.startsAt && o.startsAt > Date.now() + 60000 ? ' · starts ' + svlFmtDate(o.startsAt) : '';
    var summary = plan
        ? '<div class="svl-sub-total"><span>Total</span><b>$' + svlMoney(total) + '</b><small>' + (plan.lifetime ? 'one-time · until your course ends' : '1 month') + starts + '</small></div>'
        : '<div class="svl-sub-total is-empty">Choose a plan</div>';
    return summary + '<div class="svl-sub-actions">'
        + '<span class="svl-sub-note"><i class="fa fa-lock"></i> Secure online payment · the payment link is also emailed to you</span>'
        + '<button type="button" class="svl-btn svl-btn-sub" id="svlSubPay" onclick="svlStartCheckout()"' + (svlPickValid(o, pick) ? '' : ' disabled') + '>'
        + 'Continue to payment <i class="fa fa-arrow-right"></i></button></div>';
}

function renderStudentUnlockButtons(access) {
    if (svlFullCourseRunning(access)) { return ''; }   // nothing can be bought while the Full course runs
    return '<div class="svl-unlock-btns">'
        + (access && access.trialAvailable && access.trialDays > 0
            ? '<button type="button" class="svl-btn svl-btn-trial" onclick="svlStartTrial(this)"><i class="fa fa-gift"></i> Start ' + access.trialDays + '-day free trial</button>' : '')
        + '<button type="button" class="svl-btn svl-btn-sub" onclick="svlOpenSubscribe()"><i class="fa fa-unlock-alt"></i> Subscribe</button>'
        + '</div>';
}

/* a locked course: what it holds (titles only) and how to open it */
function renderStudentLockedCourse(d, access) {
    var p = d.playlist || {};
    var steps = svlBuildSteps(d);
    var shown = steps.slice(0, 12);
    var lastModule = null;
    var list = shown.map(function (s) {
        var head = '';
        if (s.lesson && s.lesson.moduleNo !== lastModule) {
            lastModule = s.lesson.moduleNo;
            head = '<div class="svl-side-module">Module ' + lastModule + '</div>';
        }
        return head + '<div class="svl-locked-item"><span class="svl-locked-thumb" style="background-image:url(\'' + svlThumbUrl(s.videos[0] || {}) + '\')"><i class="fa fa-lock"></i></span>'
            + (s.lesson ? '<span class="svl-item-no">L' + s.lesson.lessonNo + '</span>' : '')
            + '<span>' + svlEsc(s.lesson ? s.lesson.title : s.videos[0].title) + '</span></div>';
    }).join('');
    var more = steps.length > shown.length ? '<div class="svl-locked-more">+ ' + (steps.length - shown.length) + ' more</div>' : '';
    var noun = steps.length && steps[0].lesson ? 'lesson' : 'video';
    var course = svlCourseAccess(access, p);
    var text = course && course.courseEnds && course.courseEnds < Date.now()
        ? 'This course ended on ' + svlFmtDate(course.courseEnds) + ', so its ' + noun + 's are closed.'
        : svlFullCourseRunning(access) ? 'Your Full course plan does not cover this course.'
        : 'Subscribe to watch its ' + steps.length + ' ' + noun + (steps.length === 1 ? '' : 's') + (p.standardName ? ' · ' + svlEsc(p.standardName) : '') + '.';
    return `
    <div class="svl-locked">
        <div class="svl-locked-head">
            <div class="svl-locked-icon"><i class="fa fa-lock"></i></div>
            <div class="svl-locked-title">${svlEsc(p.title || 'This course')} is locked</div>
            <div class="svl-locked-text">${text}</div>
            ${renderStudentUnlockButtons(access)}
        </div>
        <div class="svl-locked-list">${list}${more}</div>
    </div>`;
}

function renderStudentEmpty(title, text, icon) {
    return `
    <div class="svl-empty">
        <div class="svl-empty-icon"><i class="fa ${icon || 'fa-film'}"></i></div>
        <div class="svl-empty-title">${svlEsc(title)}</div>
        <div class="svl-empty-text">${svlEsc(text)}</div>
    </div>`;
}

/* player + playlist sidebar for the selected course */
function renderStudentPlayerLayout() {
    return `
    <div class="svl-layout">
        <div class="svl-stage">
            <div class="svl-player"><div id="svlPlayerFrame" class="svl-player-frame"></div></div>
            <div class="svl-now">
                <div class="svl-now-lesson" id="svlNowLesson"></div>
                <h2 class="svl-now-title" id="svlNowTitle"></h2>
                <div class="svl-resume" id="svlResume"></div>
                <div class="svl-alt" id="svlAlt"></div>
                <div class="svl-now-actions">
                    <button type="button" class="svl-nav-btn" id="svlPrevBtn" onclick="svlPrev()"><i class="fa fa-chevron-left"></i> Previous</button>
                    <label class="svl-autoplay" title="Play the next lesson when this one ends">
                        <input type="checkbox" id="svlAutoplay" onchange="svlToggleAutoplay(this.checked)"/>
                        <span class="svl-switch" aria-hidden="true"></span>
                        <span>Autoplay next</span>
                    </label>
                    <button type="button" class="svl-nav-btn svl-next" id="svlNextBtn" onclick="svlNext()">Next lesson <i class="fa fa-chevron-right"></i></button>
                </div>
                <div class="svl-now-desc" id="svlNowDesc"></div>
            </div>
        </div>
        <aside class="svl-side" aria-label="Course playlist">
            <div class="svl-side-head">
                <div class="svl-side-title" id="svlSideTitle"></div>
                <div class="svl-side-progress" id="svlSideProgress"></div>
                <div class="svl-course-progress" id="svlCourseProgress"></div>
            </div>
            <div class="svl-side-list" id="svlSideList"></div>
        </aside>
    </div>`;
}

/* sidebar list: module headers, one row per lesson (its main video), then other videos */
function renderStudentPlaylistItems(steps, activeStep) {
    var html = '';
    var lastModule = null;
    var otherHeader = false;
    steps.forEach(function (s, i) {
        if (s.lesson && s.lesson.moduleNo !== lastModule) {
            lastModule = s.lesson.moduleNo;
            html += '<div class="svl-side-module">Module ' + lastModule
                + (s.lesson.moduleTitle ? ' <span>— ' + svlEsc(s.lesson.moduleTitle) + '</span>' : '') + '</div>';
        }
        if (!s.lesson && !otherHeader) {
            otherHeader = true;
            html += '<div class="svl-side-module">' + (steps[0].lesson ? 'More videos' : 'Videos') + '</div>';
        }
        var v = s.videos[0];
        var done = svlStepDone(s);
        var pct = svlStepPercent(s);
        var more = s.videos.length > 1 ? '<span class="svl-item-more">+' + (s.videos.length - 1) + ' more</span>' : '';
        html += '<button type="button" class="svl-item' + (i === activeStep ? ' active' : '') + (done ? ' is-done' : '') + '" data-step="' + i + '" onclick="svlPlayStep(' + i + ',0,true)"'
            + (i === activeStep ? ' aria-current="true"' : '') + (done ? ' aria-label="Watched: ' + svlEsc(s.lesson ? s.lesson.title : v.title) + '"' : '') + '>'
            + '<span class="svl-item-thumb" style="background-image:url(\'' + svlThumbUrl(v) + '\')">'
            + (i === activeStep ? '<span class="svl-item-playing"><i class="fa fa-volume-up"></i></span>' : '')
            + (done ? '<span class="svl-item-done" title="Watched"><i class="fa fa-check"></i></span>' : '')
            + (!done && pct > 0 ? '<span class="svl-item-bar"><span style="width:' + pct + '%"></span></span>' : '') + '</span>'
            + '<span class="svl-item-body">'
            + (s.lesson ? '<span class="svl-item-no">L' + s.lesson.lessonNo + '</span>' : '')
            + '<span class="svl-item-title">' + svlEsc(s.lesson ? s.lesson.title : v.title) + '</span>'
            + more + '</span></button>';
    });
    return html;
}

/* the other teachers' explanations of the current lesson */
function renderStudentAlternates(step, videoIndex) {
    if (!step || step.videos.length < 2) { return ''; }
    return '<span class="svl-alt-label">Explanations:</span>' + step.videos.map(function (v, i) {
        return '<button type="button" class="svl-alt-pill' + (i === videoIndex ? ' active' : '') + '" title="' + svlEsc(v.title) + '"'
            + ' onclick="svlPlayStep(svlState.stepIndex,' + i + ',true)">'
            + (i === 0 ? '<i class="fa fa-star"></i> Main' : 'Video ' + (i + 1))
            + (v.watchCompleted ? ' <i class="fa fa-check svl-alt-done" title="Watched"></i>' : '') + '</button>';
    }).join('');
}

/* flat search results across every course */
function renderStudentSearchResults(hits, query) {
    if (!hits.length) {
        return renderStudentEmpty('No videos found', 'Nothing matches "' + query + '" in your courses.', 'fa-search');
    }
    var html = '<div class="svl-results-head">' + hits.length + ' video' + (hits.length === 1 ? '' : 's') + ' for "' + svlEsc(query) + '"</div><div class="svl-results">';
    var lastCourse = null;
    hits.forEach(function (h) {
        if (h.course !== lastCourse) {
            lastCourse = h.course;
            html += '<div class="svl-side-module">' + svlEsc(h.course) + '</div>';
        }
        html += '<button type="button" class="svl-item' + (h.locked ? ' is-locked' : '') + '" onclick="svlOpenHit(' + h.p + ',' + h.s + ',' + h.v + ')">'
            + '<span class="svl-item-thumb" style="background-image:url(\'' + svlThumbUrl(h.video) + '\')">'
            + (h.locked ? '<span class="svl-item-lock"><i class="fa fa-lock"></i></span>' : '') + '</span>'
            + '<span class="svl-item-body">'
            + (h.lessonLabel ? '<span class="svl-item-no">' + svlEsc(h.lessonLabel) + '</span>' : '')
            + '<span class="svl-item-title">' + svlEsc(h.video.title) + '</span></span></button>';
    });
    return html + '</div>';
}

function getStudentVideoLibraryStyles() {
    return `
    <style>
    .svl-scope{width:100%;display:block;box-sizing:border-box;padding:18px 0 34px;}
    .svl-scope *{box-sizing:border-box;}
    .svl-scope .svl-hero{background:var(--pc,#16aaff);border-radius:18px;padding:22px 24px;margin-bottom:16px;color:#fff;box-shadow:0 12px 30px color-mix(in srgb, var(--pc,#16aaff) 28%, transparent);}
    .svl-hero-inner{display:flex;align-items:center;gap:16px;flex-wrap:wrap;}
    .svl-hero-icon{width:52px;height:52px;border-radius:14px;background:rgba(255,255,255,.18);display:flex;align-items:center;justify-content:center;font-size:26px;}
    .svl-hero-title{font-size:21px;font-weight:700;}
    .svl-hero-sub{font-size:13px;opacity:.9;margin-top:2px;}
    .svl-hero-search{margin-left:auto;position:relative;min-width:250px;}
    .svl-hero-search i{position:absolute;left:14px;top:50%;transform:translateY(-50%);color:#8a93a8;}
    .svl-hero-search input{width:100%;border:0;border-radius:30px;padding:10px 16px 10px 38px;font-size:13px;color:#333;outline:none;box-shadow:0 4px 14px rgba(0,0,0,.12);}
    .svl-chips{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px;}
    .svl-chip{border:1.5px solid #e2e6ef;background:#fff;color:#4a5260;border-radius:30px;padding:6px 8px 6px 15px;font-size:12.5px;font-weight:700;cursor:pointer;transition:all .15s ease;display:inline-flex;align-items:center;gap:7px;max-width:300px;}
    .svl-chip-txt{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
    .svl-chip-grade{font-size:10.5px;font-weight:600;color:#8a94a2;white-space:nowrap;}
    .svl-chip-count{background:#eef1f6;color:#5a6472;border-radius:20px;padding:1px 8px;font-size:10.5px;flex-shrink:0;}
    .svl-chip:hover{border-color:var(--pc,#16aaff);color:var(--pc,#16aaff);}
    .svl-chip.active{background:var(--pc,#16aaff);border-color:transparent;color:#fff;box-shadow:0 5px 14px color-mix(in srgb, var(--pc,#16aaff) 30%, transparent);}
    .svl-chip.active .svl-chip-grade{color:rgba(255,255,255,.85);}
    .svl-chip.active .svl-chip-count{background:rgba(255,255,255,.25);color:#fff;}
    /* player + sidebar */
    .svl-layout{display:grid;grid-template-columns:minmax(0,1fr) 340px;gap:18px;align-items:start;}
    .svl-stage{background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 6px 20px rgba(16,42,67,.06);}
    .svl-player{background:#000;}
    .svl-player-frame{position:relative;width:100%;aspect-ratio:16/9;}
    .svl-player-frame iframe,.svl-player-frame video,.svl-player-frame > div{position:absolute;inset:0;width:100%;height:100%;border:0;display:block;background:#000;}
    .svl-now{padding:14px 18px 18px;}
    .svl-now-lesson{font-size:12px;font-weight:800;color:var(--pc,#16aaff);text-transform:uppercase;letter-spacing:.4px;}
    .svl-now-title{font-size:18px;font-weight:800;color:#1f2733;margin:4px 0 8px;line-height:1.3;}
    .svl-alt{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:10px;}
    .svl-alt:empty{display:none;}
    .svl-alt-label{font-size:12px;color:#7a8492;font-weight:600;}
    .svl-alt-pill{border:1.5px solid #e4e7ec;background:#fff;color:#5a6472;font-size:12px;font-weight:700;padding:4px 12px;border-radius:20px;cursor:pointer;}
    .svl-alt-pill i{color:#f7b924;}
    .svl-alt-pill.active{border-color:var(--pc,#16aaff);color:var(--pc,#16aaff);background:color-mix(in srgb, var(--pc,#16aaff) 8%, white);}
    .svl-now-actions{display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:10px 0;border-top:1px solid #f1f3f6;border-bottom:1px solid #f1f3f6;}
    .svl-nav-btn{border:1.5px solid #e4e7ec;background:#fff;color:#444;border-radius:10px;padding:8px 14px;font-size:13px;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;gap:7px;}
    .svl-nav-btn:hover:not(:disabled){border-color:var(--pc,#16aaff);color:var(--pc,#16aaff);}
    .svl-nav-btn:disabled{opacity:.4;cursor:default;}
    .svl-nav-btn.svl-next{margin-left:auto;background:var(--pc,#16aaff);border-color:var(--pc,#16aaff);color:#fff;}
    .svl-nav-btn.svl-next:hover:not(:disabled){background:color-mix(in srgb, var(--pc,#16aaff) 85%, black);color:#fff;}
    .svl-autoplay{display:inline-flex;align-items:center;gap:7px;font-size:12.5px;font-weight:600;color:#5a6472;cursor:pointer;margin:0;user-select:none;}
    .svl-autoplay input{position:absolute;opacity:0;width:1px;height:1px;}
    .svl-switch{width:34px;height:19px;border-radius:20px;background:#d5dae2;position:relative;transition:background .15s ease;flex-shrink:0;}
    .svl-switch::after{content:'';position:absolute;top:2px;left:2px;width:15px;height:15px;border-radius:50%;background:#fff;transition:left .15s ease;box-shadow:0 1px 3px rgba(0,0,0,.2);}
    .svl-autoplay input:checked + .svl-switch{background:#16d39a;}
    .svl-autoplay input:checked + .svl-switch::after{left:17px;}
    .svl-autoplay input:focus-visible + .svl-switch{outline:2px solid var(--pc,#16aaff);outline-offset:2px;}
    .svl-now-desc{font-size:13px;color:#5f6876;line-height:1.5;margin-top:12px;white-space:pre-line;}
    .svl-side{background:#fff;border-radius:16px;box-shadow:0 6px 20px rgba(16,42,67,.06);overflow:hidden;position:sticky;top:12px;}
    .svl-side-head{padding:14px 16px;border-bottom:1px solid #f1f3f6;}
    .svl-side-title{font-size:14.5px;font-weight:800;color:#1f2733;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
    .svl-side-progress{font-size:12px;color:#7a8492;font-weight:600;margin-top:2px;}
    .svl-side-list{max-height:calc(100vh - 210px);min-height:200px;overflow-y:auto;padding:4px 8px 10px;}
    .svl-side-module{font-size:11px;font-weight:800;color:var(--pc,#16aaff);text-transform:uppercase;letter-spacing:.5px;margin:12px 8px 6px;}
    .svl-side-module span{color:#8a94a2;font-weight:600;text-transform:none;letter-spacing:0;}
    .svl-item{display:flex;align-items:center;gap:10px;width:100%;text-align:left;border:none;background:transparent;border-radius:10px;padding:6px 8px;cursor:pointer;transition:background .12s ease;}
    .svl-item:hover{background:#f4f6fa;}
    .svl-item.active{background:color-mix(in srgb, var(--pc,#16aaff) 10%, white);}
    .svl-item:focus-visible{outline:2px solid var(--pc,#16aaff);outline-offset:1px;}
    .svl-item-thumb{position:relative;width:96px;aspect-ratio:16/9;flex-shrink:0;border-radius:7px;background:#0b1020 center/cover no-repeat;}
    .svl-item-playing{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:color-mix(in srgb, var(--pc,#16aaff) 55%, transparent);color:#fff;font-size:15px;border-radius:7px;}
    .svl-item-body{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px;}
    .svl-item-no{font-size:10.5px;font-weight:800;color:var(--pc,#16aaff);}
    .svl-item-title{font-size:12.5px;font-weight:700;color:#2a2f3a;line-height:1.3;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
    .svl-item.active .svl-item-title{color:var(--pc,#16aaff);}
    .svl-item-more{font-size:10.5px;font-weight:700;color:#c48a00;}
    .svl-results-head{font-size:13px;font-weight:700;color:#5a6472;margin-bottom:8px;}
    .svl-results{background:#fff;border-radius:16px;box-shadow:0 6px 20px rgba(16,42,67,.06);padding:4px 8px 10px;}
    /* watch progress */
    .svl-chip-count.is-done{background:#e4faf2;color:#0ea67b;}
    .svl-chip.active .svl-chip-count.is-done{background:rgba(255,255,255,.25);color:#fff;}
    .svl-course-progress{margin-top:8px;}
    .svl-course-progress:empty{display:none;}
    .svl-cp-label{display:flex;justify-content:space-between;font-size:11.5px;font-weight:700;color:#5a6472;margin-bottom:4px;}
    .svl-cp-label .is-done{color:#0ea67b;}
    .svl-cp-bar{height:6px;border-radius:20px;background:#eef1f6;overflow:hidden;}
    .svl-cp-bar > span{display:block;height:100%;background:#16d39a;border-radius:20px;transition:width .3s ease;}
    .svl-item-done{position:absolute;top:4px;right:4px;width:20px;height:20px;border-radius:50%;background:#16d39a;color:#fff;font-size:10px;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 4px rgba(0,0,0,.3);}
    .svl-item-bar{position:absolute;left:0;right:0;bottom:0;height:4px;background:rgba(255,255,255,.35);border-radius:0 0 7px 7px;overflow:hidden;}
    .svl-item-bar > span{display:block;height:100%;background:var(--pc,#16aaff);}
    .svl-item.is-done .svl-item-title{color:#6b7583;}
    .svl-item.is-done.active .svl-item-title{color:var(--pc,#16aaff);}
    .svl-alt-done{color:#16d39a !important;}
    .svl-resume{display:flex;align-items:center;gap:8px;flex-wrap:wrap;font-size:12.5px;color:#5a6472;margin-bottom:10px;}
    .svl-resume:empty{display:none;}
    .svl-resume i{color:var(--pc,#16aaff);}
    .svl-resume-btn{border:none;background:none;color:var(--pc,#16aaff);font-weight:700;font-size:12.5px;padding:0;cursor:pointer;text-decoration:underline;}
    /* subscription paywall */
    .svl-access{display:flex;align-items:center;gap:14px;flex-wrap:wrap;background:#fff;border:1.5px solid #f2d48a;border-radius:16px;padding:14px 16px;margin-bottom:16px;box-shadow:0 4px 14px rgba(16,42,67,.05);}
    .svl-access.is-open{border-color:#bfeedd;}
    .svl-access-icon{width:42px;height:42px;border-radius:12px;background:#fff6e7;color:#f7b924;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;}
    .svl-access.is-open .svl-access-icon{background:#e4faf2;color:#16d39a;}
    .svl-access-body{flex:1;min-width:200px;}
    .svl-access-title{font-size:15px;font-weight:800;color:#1f2733;}
    .svl-access-text{font-size:12.5px;color:#6b7583;margin-top:2px;}
    .svl-access-plans{display:flex;gap:8px;flex-wrap:wrap;}
    .svl-plan-pill{display:inline-flex;align-items:center;gap:6px;background:#e4faf2;color:#0b8a65;font-size:12.5px;font-weight:800;border-radius:20px;padding:5px 12px;}
    .svl-plan-pill small{font-weight:600;color:#3f8f74;}
    .svl-plan-pill.is-trial{background:#fff6e7;color:#8a6200;}
    .svl-plan-pill.is-trial small{color:#a8925c;}
    .svl-unlock-btns{display:flex;gap:8px;flex-wrap:wrap;}
    .svl-btn{border:none;border-radius:10px;padding:9px 16px;font-size:13px;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;gap:7px;color:#fff;}
    .svl-btn:disabled{opacity:.6;cursor:default;}
    .svl-btn-trial{background:#16d39a;}
    .svl-btn-trial:hover:not(:disabled){background:#0fbf8a;}
    .svl-btn-sub{background:var(--pc,#16aaff);}
    .svl-btn-sub:hover:not(:disabled){background:color-mix(in srgb, var(--pc,#16aaff) 85%, black);}
    .svl-chip.is-locked:not(.active){color:#8a94a2;}
    .svl-chip-count.is-locked{background:#fff6e7;color:#c48a00;}
    .svl-chip.active .svl-chip-count.is-locked{background:rgba(255,255,255,.25);color:#fff;}
    .svl-locked{display:grid;grid-template-columns:minmax(0,1fr) 340px;gap:18px;align-items:start;}
    .svl-locked-head{background:#fff;border-radius:16px;box-shadow:0 6px 20px rgba(16,42,67,.06);padding:40px 24px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:6px;}
    .svl-locked-icon{width:64px;height:64px;border-radius:50%;background:#fff6e7;color:#f7b924;display:flex;align-items:center;justify-content:center;font-size:28px;margin-bottom:6px;}
    .svl-locked-title{font-size:19px;font-weight:800;color:#1f2733;}
    .svl-locked-text{font-size:13px;color:#6b7583;margin-bottom:10px;}
    .svl-locked-list{background:#fff;border-radius:16px;box-shadow:0 6px 20px rgba(16,42,67,.06);padding:4px 14px 14px;}
    .svl-locked-item{display:flex;align-items:center;gap:8px;font-size:12.5px;font-weight:600;color:#5a6472;padding:7px 2px;border-bottom:1px dashed #eef1f6;}
    .svl-locked-item:last-child{border-bottom:none;}
    .svl-locked-item > i{color:#c3c9d2;font-size:11px;}
    .svl-locked-thumb{position:relative;width:96px;aspect-ratio:16/9;flex-shrink:0;border-radius:7px;background:#1b2030 center/cover no-repeat;display:flex;align-items:center;justify-content:center;overflow:hidden;}
    .svl-locked-thumb::before{content:'';position:absolute;inset:0;background:rgba(11,16,32,.45);}
    .svl-locked-thumb i{position:relative;color:#fff;font-size:12px;width:26px;height:26px;border-radius:50%;background:rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;}
    .svl-locked-more{font-size:12px;color:#8a94a2;font-weight:700;padding-top:8px;}
    .svl-item-lock{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(17,24,39,.45);color:#fff;font-size:14px;border-radius:7px;}
    /* subscribe modal */
    .svl-sub-modal .modal-dialog{box-shadow:none !important;background:transparent !important;}
    .svl-sub-content{border:none;border-radius:16px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.25);}
    .svl-sub-header{background:var(--pc,#16aaff);color:#fff;border:none;}
    .svl-sub-header .close{color:#fff;opacity:.9;text-shadow:none;}
    .svl-sub-loading,.svl-sub-blocked{font-size:13.5px;color:#5a6472;padding:18px 4px;}
    .svl-sub-blocked{background:#fff6e7;color:#8a6200;border-radius:12px;padding:14px 16px;font-weight:600;}
    .svl-sub-label{font-size:12.5px;font-weight:800;color:#5a6472;text-transform:uppercase;letter-spacing:.4px;margin:4px 0 10px;display:flex;align-items:center;gap:8px;}
    .svl-sub-grade{background:#eef1f6;color:#5a6472;border-radius:20px;padding:2px 9px;font-size:11px;text-transform:none;letter-spacing:0;}
    .svl-plans{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:10px;margin-bottom:18px;}
    .svl-plan{position:relative;display:flex;flex-direction:column;gap:3px;border:1.5px solid #e4e7ec;border-radius:12px;padding:12px 14px;cursor:pointer;margin:0;font-weight:400;transition:border-color .15s ease,background .15s ease;}
    .svl-plan:hover{border-color:color-mix(in srgb, var(--pc,#16aaff) 50%, white);}
    .svl-plan.active{border-color:var(--pc,#16aaff);background:color-mix(in srgb, var(--pc,#16aaff) 7%, white);}
    .svl-plan input{position:absolute;opacity:0;}
    .svl-plan-name{font-size:14px;font-weight:800;color:#1f2733;}
    .svl-plan-price{font-size:18px;font-weight:800;color:var(--pc,#16aaff);}
    .svl-plan-price small{font-size:11px;font-weight:600;color:#8a94a2;}
    .svl-plan-what{font-size:12px;color:#6b7583;}
    .svl-sub-count{background:#eef1f6;color:#5a6472;border-radius:20px;padding:2px 9px;font-size:11px;text-transform:none;letter-spacing:0;}
    .svl-sub-count.is-ok{background:#e4faf2;color:#0b8a65;}
    .svl-sub-courses{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:8px;}
    .svl-sub-course{display:flex;align-items:center;gap:8px;border:1.5px solid #e4e7ec;border-radius:10px;padding:9px 12px;cursor:pointer;margin:0;font-size:13px;font-weight:600;color:#2a2f3a;}
    .svl-sub-course.active{border-color:var(--pc,#16aaff);background:color-mix(in srgb, var(--pc,#16aaff) 7%, white);}
    .svl-sub-course.is-full{opacity:.5;cursor:default;}
    .svl-sub-course input{width:16px;height:16px;accent-color:var(--pc,#16aaff);flex-shrink:0;}
    .svl-sub-footer{display:flex;flex-direction:column;align-items:stretch;gap:10px;border-top:1px solid #f1f3f6;}
    .svl-sub-total{display:flex;align-items:baseline;gap:8px;font-size:13px;color:#5a6472;}
    .svl-sub-total b{font-size:22px;color:#1f2733;}
    .svl-sub-total.is-empty{color:#9aa0a6;}
    .svl-sub-actions{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;}
    .svl-sub-note{font-size:12px;color:#8a94a2;}
    .svl-sub-note i{color:#16d39a;}
    .svl-empty{text-align:center;padding:60px 20px;color:#9aa0a6;background:#fff;border-radius:16px;}
    .svl-empty-icon{font-size:48px;color:#d8dbe0;margin-bottom:10px;}
    .svl-empty-title{font-size:18px;font-weight:700;color:#5a5f66;}
    .svl-empty-text{font-size:13px;margin-top:4px;}
    @media (max-width:991px){
        .svl-layout{grid-template-columns:1fr;}
        .svl-side{position:static;}
        .svl-side-list{max-height:none;}
        .svl-locked{grid-template-columns:1fr;}
    }
    @media (max-width:575px){
        .svl-hero-search{margin-left:0;width:100%;min-width:0;}
        .svl-now{padding:12px 14px 16px;}
        .svl-now-title{font-size:16px;}
        .svl-autoplay{order:3;width:100%;}
        .svl-chip{max-width:100%;}
        .svl-access{padding:12px;}
        .svl-unlock-btns{width:100%;flex-direction:column;}
        .svl-btn{justify-content:center;}
        .svl-plan-pill{flex-wrap:wrap;row-gap:0;border-radius:12px;}
        .svl-plan-pill small{flex-basis:100%;padding-left:20px;}
        .svl-locked-head{padding:28px 16px;}
        .svl-sub-actions .svl-btn{width:100%;justify-content:center;}
    }
    </style>`;
}
