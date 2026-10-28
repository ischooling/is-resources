/* =====================================================================
 * Video Library — Student (Videos) : logic
 * Depends on: studentVideoLibraryContent.js (templates),
 *             callCommonAjax / showMessageTheme2 / customLoader (common),
 *             globals SCHOOL_ID, USER_ID, APP_BASE_URL, API_VERSION.
 * Course playlists: a "step" is one lesson (its main video first, other teachers'
 * explanations as alternates); videos without a lesson come last as their own steps.
 * Watch progress is saved on the server (resume point, furthest point, watched ✓).
 * ===================================================================== */

var svlState = {
    playlists: [],      // VideoPlaylistDetailDTO[] for the student's courses (locked ones carry titles only)
    access: null,       // VideoAccessDTO: paywall, trial, the student's plans (null = paywall off)
    sub: { options: null, pick: { planCode: '', subjectIds: [] }, busy: false },   // the Subscribe modal
    active: 0,          // selected course index
    steps: [],          // steps of the selected course
    stepIndex: 0,
    videoIndex: 0,      // which explanation of the step is playing
    search: '',
    autoplay: true,
    started: false,     // the student has pressed something -> later videos may autoplay
    resumeAt: null,     // {videoId, seconds}: continue there on the first mount
    yt: null,           // YT.Player for the current frame
    ytApi: null,        // promise of the YouTube IFrame API
    gsapReady: false,
    // progress reporting for the video in the player
    // seen = the player reported PLAYING for this video: until then its clock may still be the previous video's
    track: { video: null, seen: false, timer: null, lastSentAt: 0, lastSentPos: -1, inFlight: false, pending: null }
};

var SVL_STORE_KEY = 'svl.videoLibrary';
var SVL_SAVE_EVERY_MS = 15000;   // while playing
var SVL_TICK_MS = 5000;

function svlApiBase() {
    return svlNormalizeUrl(APP_BASE_URL + API_VERSION + 'video-library/');
}

/* collapse accidental double slashes while preserving the protocol "://". */
function svlNormalizeUrl(u) {
    var i = (u || '').indexOf('://');
    if (i < 0) { return (u || '').replace(/\/{2,}/g, '/'); }
    return u.substring(0, i + 3) + u.substring(i + 3).replace(/\/{2,}/g, '/');
}

function svlIsSuccess(response) {
    return response && (response.status === 'SUCCESS' || response.status === '1'
        || response.statusCode === '200' || response.statusCode === 'SUCCESS');
}

function studentVideoLibraryOnLoad() {
    var saved = svlReadStore();
    svlStopTracking();
    svlState.playlists = [];
    svlState.access = null;
    svlState.active = 0;
    svlState.steps = [];
    svlState.stepIndex = 0;
    svlState.videoIndex = 0;
    svlState.search = '';
    svlState.started = false;
    svlState.resumeAt = null;
    svlState.yt = null;   // the old frame left with the previous page
    svlState.autoplay = saved.autoplay !== false;
    svlLoadGsap();
    $('#svlSearch').off('input').on('input', function () {
        svlState.search = (this.value || '').trim().toLowerCase();
        svlRenderMain();
    });
    // switching tab / closing: keep the resume point
    $(document).off('visibilitychange.svl').on('visibilitychange.svl', function () {
        if (document.visibilityState === 'hidden') { svlSaveProgress(false); }
    });
    svlLoadPlaylists();
}

function svlLoadGsap() {
    if (window.gsap) { svlState.gsapReady = true; svlRevealIntro(); return; }
    var existing = document.getElementById('vlmGsapScript');
    if (existing) {
        existing.addEventListener('load', function () { svlState.gsapReady = true; svlRevealIntro(); });
        return;
    }
    var s = document.createElement('script');
    s.id = 'vlmGsapScript';
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js';
    s.onload = function () { svlState.gsapReady = true; svlRevealIntro(); };
    document.head.appendChild(s);
}

/* text-reveal intro for the student hero / chips (staggered fade-up) */
function svlRevealIntro() {
    if (!window.gsap) { return; }
    try {
        window.gsap.from('.svl-scope .svl-reveal', { y: 18, opacity: 0, duration: 0.6, stagger: 0.09, ease: 'power3.out' });
    } catch (e) { /* ignore */ }
}

function svlLoadPlaylists() {
    customLoader(true);
    callCommonAjax({
        method: 'POST',
        url: svlApiBase() + 'student/playlists',
        body: { schoolId: SCHOOL_ID, userId: USER_ID },
        global: true,
        showMessage: false
    }).then(function (response) {
        customLoader(false);
        if (svlIsSuccess(response)) {
            // {access, playlists}; a plain list (older server) = no paywall
            var details = response.details || [];
            var list = Array.isArray(details) ? details : (details.playlists || []);
            svlState.access = Array.isArray(details) ? null : (details.access || null);
            svlState.playlists = list.filter(function (d) { return svlBuildSteps(d).length > 0; });
            svlRestoreLastPosition();
            svlRenderMain();
        } else {
            showMessageTheme2(0, (response && response.message) ? response.message : 'Failed to load videos.');
            $('#svlMain').html(renderStudentEmpty('Videos could not be loaded', 'Please refresh the page and try again.', 'fa-exclamation-circle'));
        }
    }).catch(function () {
        customLoader(false);
        showMessageTheme2(0, 'Failed to load videos.');
        $('#svlMain').html(renderStudentEmpty('Videos could not be loaded', 'Please refresh the page and try again.', 'fa-exclamation-circle'));
    });
}

/* steps of one course: each lesson that has videos, then the videos without a lesson */
function svlBuildSteps(d) {
    var steps = [];
    ((d && d.lessons) || []).forEach(function (l) {
        if (l.videos && l.videos.length) { steps.push({ lesson: l, videos: l.videos }); }
    });
    ((d && d.otherVideos) || []).forEach(function (v) {
        steps.push({ lesson: null, videos: [v] });
    });
    return steps;
}

/* a lesson counts as watched when any teacher's explanation of it was watched */
function svlStepDone(step) {
    return !!(step && step.videos.some(function (v) { return v.watchCompleted; }));
}

function svlStepPercent(step) {
    return step ? step.videos.reduce(function (m, v) { return Math.max(m, v.watchedPercent || 0); }, 0) : 0;
}

function svlIsLocked(d) {
    return !!(d && d.playlist && d.playlist.locked);
}

/* "Continue where you left off": the video watched last (server), else the last one in this browser.
   Locked courses are skipped; with nothing to continue the first open course is shown. */
function svlRestoreLastPosition() {
    svlState.active = 0;
    for (var o = 0; o < svlState.playlists.length; o++) {
        if (!svlIsLocked(svlState.playlists[o])) { svlState.active = o; break; }
    }
    svlState.stepIndex = 0;
    svlState.videoIndex = 0;
    svlState.resumeAt = null;
    var best = null;
    svlState.playlists.forEach(function (d, p) {
        if (svlIsLocked(d)) { return; }
        svlBuildSteps(d).forEach(function (step, s) {
            step.videos.forEach(function (v, i) {
                var at = parseInt(v.lastWatchedAt || '0', 10);
                if (at && (!best || at > best.at)) { best = { p: p, s: s, i: i, v: v, at: at }; }
            });
        });
    });
    if (best) {
        svlState.active = best.p;
        var steps = svlBuildSteps(svlState.playlists[best.p]);
        if (best.v.watchCompleted && best.s < steps.length - 1) {
            svlState.stepIndex = best.s + 1;                       // finished it -> the next lesson
        } else {
            svlState.stepIndex = best.s;
            svlState.videoIndex = best.i;
            if (!best.v.watchCompleted && (best.v.lastPosition || 0) > 5) {
                svlState.resumeAt = { videoId: best.v.id, seconds: best.v.lastPosition };
            }
        }
        return;
    }
    var saved = svlReadStore();
    if (!saved.course) { return; }
    for (var p = 0; p < svlState.playlists.length; p++) {
        if (svlCourseKey(svlState.playlists[p]) !== saved.course || svlIsLocked(svlState.playlists[p])) { continue; }
        svlState.active = p;
        var st = svlBuildSteps(svlState.playlists[p]);
        for (var s = 0; s < st.length; s++) {
            if (st[s].videos.some(function (v) { return v.id === saved.videoId; })) { svlState.stepIndex = s; }
        }
        return;
    }
}

function svlCourseKey(d) {
    var p = (d && d.playlist) || {};
    return p.id ? 'p' + p.id : 'c' + (p.standardName || '') + '|' + (p.title || '');
}

/* access bar + chips + (player | locked course | search results | empty state) */
function svlRenderMain() {
    $('#svlAccess').html(renderStudentAccessBar(svlState.access, svlState.playlists));
    if (!svlState.playlists.length) {
        $('#svlChips').html('');
        $('#svlMain').html(renderStudentEmpty('No videos yet', 'Videos for your courses will appear here once your teachers add them.'));
        return;
    }
    $('#svlChips').html(renderStudentCourseChips(svlState.playlists, svlState.search ? -1 : svlState.active));
    if (svlState.search) {
        svlStopPlayer();
        $('#svlMain').html(renderStudentSearchResults(svlSearchHits(svlState.search), svlState.search));
        return;
    }
    var current = svlState.playlists[svlState.active];
    if (svlIsLocked(current)) {
        svlStopPlayer();          // also keeps the resume point of an open course being left
        svlState.steps = [];
        $('#svlMain').html(renderStudentLockedCourse(current, svlState.access));
        return;
    }
    if (!$('#svlMain .svl-layout').length) {
        $('#svlMain').html(renderStudentPlayerLayout());
        $('#svlAutoplay').prop('checked', svlState.autoplay);
    }
    svlState.steps = svlBuildSteps(svlState.playlists[svlState.active]);
    if (svlState.stepIndex >= svlState.steps.length) { svlState.stepIndex = 0; }
    svlPlayStep(svlState.stepIndex, svlState.videoIndex, false);
}

function svlSelectCourse(index) {
    if (svlState.search) {
        svlState.search = '';
        $('#svlSearch').val('');
    }
    if (index === svlState.active && $('#svlMain .svl-layout').length) { return; }
    svlState.active = index;
    svlState.stepIndex = 0;
    svlState.videoIndex = 0;
    svlState.resumeAt = null;
    svlRenderMain();
}

/* play explanation videoIndex of step stepIndex. byUser = the student pressed something. */
function svlPlayStep(stepIndex, videoIndex, byUser) {
    var step = svlState.steps[stepIndex];
    if (!step || svlIsLocked(svlState.playlists[svlState.active])) { return; }
    if (byUser) {
        svlState.started = true;
        svlState.resumeAt = null;
    }
    svlSaveProgress(false);   // keep where the student was in the video being left
    svlState.stepIndex = stepIndex;
    svlState.videoIndex = Math.min(videoIndex || 0, step.videos.length - 1);
    var v = step.videos[svlState.videoIndex];
    var d = svlState.playlists[svlState.active];
    var p = (d && d.playlist) || {};

    $('#svlNowLesson').text(step.lesson
        ? 'Module ' + step.lesson.moduleNo + ' · Lesson ' + step.lesson.lessonNo + ' — ' + step.lesson.title
        : (p.title || ''));
    $('#svlNowTitle').text(v.title || 'Video');
    $('#svlNowDesc').text(v.description || '');
    $('#svlAlt').html(renderStudentAlternates(step, svlState.videoIndex));
    $('#svlPrevBtn').prop('disabled', stepIndex === 0);
    $('#svlNextBtn').prop('disabled', stepIndex >= svlState.steps.length - 1);
    $('#svlSideTitle').text(p.title || '').attr('title', p.title || '');
    $('#svlSideProgress').text((step.lesson ? 'Lesson ' : 'Video ') + (stepIndex + 1) + ' of ' + svlState.steps.length
        + (p.standardName ? ' · ' + p.standardName : ''));
    svlRefreshProgressUi();
    svlScrollActiveIntoView();

    var startAt = (svlState.resumeAt && svlState.resumeAt.videoId === v.id) ? svlState.resumeAt.seconds : 0;
    svlState.resumeAt = null;
    $('#svlResume').html(startAt
        ? '<i class="fa fa-history"></i> Continuing where you left off (' + svlFmtTime(startAt) + ')'
          + ' · <button type="button" class="svl-resume-btn" onclick="svlStartOver()">Start over</button>'
        : '');
    svlMountVideo(v, svlState.started, startAt);
    svlStartTracking(v);
    svlWriteStore({ course: svlCourseKey(d), videoId: v.id });
}

function svlNext() {
    if (svlState.stepIndex < svlState.steps.length - 1) { svlPlayStep(svlState.stepIndex + 1, 0, true); }
}

function svlPrev() {
    if (svlState.stepIndex > 0) { svlPlayStep(svlState.stepIndex - 1, 0, true); }
}

function svlOnEnded() {
    svlSaveProgress(true);
    if (svlState.autoplay && svlState.stepIndex < svlState.steps.length - 1) {
        svlPlayStep(svlState.stepIndex + 1, 0, true);
    }
}

function svlStartOver() {
    $('#svlResume').html('');
    svlState.started = true;
    if (svlState.yt && svlState.yt.seekTo) {
        try { svlState.yt.seekTo(0, true); svlState.yt.playVideo(); } catch (e) { /* not ready */ }
        return;
    }
    var vid = document.querySelector('#svlPlayerFrame video');
    if (vid) { vid.currentTime = 0; vid.play && vid.play(); }
}

function svlToggleAutoplay(on) {
    svlState.autoplay = !!on;
    svlWriteStore({ autoplay: svlState.autoplay });
}

/* ✓ / progress bars in the sidebar, the course bar and the chips — without touching the player */
function svlRefreshProgressUi() {
    var steps = svlState.steps;
    $('#svlSideList').html(renderStudentPlaylistItems(steps, svlState.stepIndex));
    var done = steps.filter(svlStepDone).length;
    var pct = steps.length ? Math.round(done * 100 / steps.length) : 0;
    var noun = steps.length && steps[0].lesson ? 'lessons' : 'videos';
    $('#svlCourseProgress').html('<div class="svl-cp-label"><span>' + done + ' of ' + steps.length + ' ' + noun + ' watched</span>'
        + '<span' + (done === steps.length && done ? ' class="is-done"' : '') + '>' + pct + '%</span></div>'
        + '<div class="svl-cp-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pct + '"><span style="width:' + pct + '%"></span></div>');
    $('#svlAlt').html(renderStudentAlternates(steps[svlState.stepIndex], svlState.videoIndex));
    if (!svlState.search) {
        $('#svlChips').html(renderStudentCourseChips(svlState.playlists, svlState.active));
    }
}

/* keep the playing lesson visible inside the sidebar (without scrolling the page) */
function svlScrollActiveIntoView() {
    var list = document.getElementById('svlSideList');
    var item = list ? list.querySelector('.svl-item.active') : null;
    if (!list || !item || list.scrollHeight <= list.clientHeight) { return; }
    var top = item.offsetTop - list.offsetTop;
    if (top < list.scrollTop || top + item.offsetHeight > list.scrollTop + list.clientHeight) {
        list.scrollTop = Math.max(0, top - list.clientHeight / 3);
    }
}

/* ---- search across every course ---- */
function svlSearchHits(q) {
    var hits = [];
    svlState.playlists.forEach(function (d, p) {
        var course = (d.playlist && d.playlist.title) || '';
        svlBuildSteps(d).forEach(function (step, s) {
            step.videos.forEach(function (v, i) {
                var hay = [v.title, v.description, step.lesson ? step.lesson.title : ''].join(' ').toLowerCase();
                if (hay.indexOf(q) !== -1) {
                    hits.push({ p: p, s: s, v: i, video: v, course: course, locked: svlIsLocked(d),
                        lessonLabel: step.lesson ? 'M' + step.lesson.moduleNo + ' · L' + step.lesson.lessonNo : '' });
                }
            });
        });
    });
    return hits;
}

function svlOpenHit(p, s, v) {
    svlState.search = '';
    $('#svlSearch').val('');
    svlState.active = p;
    svlState.stepIndex = s;
    svlState.videoIndex = v;
    svlState.started = true;
    svlState.resumeAt = null;
    svlRenderMain();
    var stage = document.querySelector('#svlMain .svl-stage');
    if (stage && stage.scrollIntoView) { stage.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
}

/* ---- subscription: trial / subscribe ---- */

/* one click: the trial opens every enrolled course for the trial days, once per student */
function svlStartTrial(btn) {
    $('.svl-btn').prop('disabled', true);
    customLoader(true);
    callCommonAjax({
        method: 'POST',
        url: svlApiBase() + 'student/trial/start',
        body: { schoolId: SCHOOL_ID, userId: USER_ID },
        global: true,
        showMessage: false
    }).then(function (response) {
        customLoader(false);
        if (svlIsSuccess(response)) {
            showMessageTheme2(1, 'Your free trial has started — enjoy all your course videos!');
            svlLoadPlaylists();
        } else {
            $('.svl-btn').prop('disabled', false);
            showMessageTheme2(0, (response && response.message) ? response.message : 'The trial could not be started.');
        }
    }).catch(function () {
        customLoader(false);
        $('.svl-btn').prop('disabled', false);
        showMessageTheme2(0, 'The trial could not be started.');
    });
}

/* a monthly plan (paid / granted) ends within the renewal window and nothing follows it yet */
function svlRenewDue(access) {
    if (!access || !access.paywall) { return false; }
    var days = access.renewBeforeDays || 0;
    var subs = access.subscriptions || [];
    var monthly = subs.filter(function (s) { return s.planCode !== 'TRIAL' && s.planCode !== 'LIFETIME' && s.endDate; });
    if (!monthly.length || subs.some(function (s) { return s.planCode === 'LIFETIME'; })) { return false; }
    var lastEnd = Math.max.apply(null, monthly.map(function (s) { return parseInt(s.endDate, 10); }));
    return lastEnd - Date.now() <= days * 86400000;
}

/* only a trial is running: offer to subscribe before it ends */
function svlTrialOnly(access) {
    var subs = (access && access.paywall && access.subscriptions) || [];
    return subs.length > 0 && subs.every(function (s) { return s.planCode === 'TRIAL'; });
}

/* a Full course plan is running (it is listed only while one of its courses runs): nothing can be bought meanwhile */
function svlFullCourseRunning(access) {
    return !!(access && access.paywall && (access.subscriptions || []).some(function (s) { return s.planCode === 'LIFETIME'; }));
}

/* the access entry of a playlist's course (grade + title), or null */
function svlCourseAccess(access, p) {
    var key = String(p.title || '').trim().toLowerCase();
    return ((access && access.courses) || []).filter(function (c) {
        return c.standardId === p.standardId && String(c.courseTitle || '').trim().toLowerCase() === key;
    })[0] || null;
}

/* ---- subscribe: plans -> courses -> checkout (the server prices it) -> the shared payment modal ---- */
function svlOpenSubscribe() {
    if ($('#svlSubModal').length === 0) {
        $('body').append(getStudentSubscribeModalHtml());
    }
    svlState.sub = { options: null, pick: { planCode: '', count: 0, subjectIds: [] }, busy: false };
    $('#svlSubBody').html('<div class="svl-sub-loading">Loading plans…</div>');
    $('#svlSubFooter').html('');
    $('#svlSubModal').modal('show');
    callCommonAjax({
        method: 'POST',
        url: svlApiBase() + 'student/subscription/options',
        body: { schoolId: SCHOOL_ID, userId: USER_ID },
        global: false,
        showMessage: false
    }).then(function (response) {
        if (svlIsSuccess(response) && response.details) {
            var o = response.details;
            svlState.sub.options = o;
            // one card only -> pick it
            var cards = o.canBuy ? svlPlanCards(o) : [];
            if (cards.length === 1) { svlPickCard(cards[0].key, true); }
            svlRenderSubscribe();
        } else {
            $('#svlSubBody').html('<div class="svl-sub-blocked">' + svlEsc((response && response.message) || 'Plans could not be loaded.') + '</div>');
            $('#svlSubFooter').html(renderStudentSubscribeFooter(null));
        }
    }).catch(function () {
        $('#svlSubBody').html('<div class="svl-sub-blocked">Plans could not be loaded. Please try again.</div>');
        $('#svlSubFooter').html(renderStudentSubscribeFooter(null));
    });
}

function svlRenderSubscribe() {
    var o = svlState.sub.options;
    $('#svlSubBody').html(renderStudentSubscribeBody(o, svlState.sub.pick));
    $('#svlSubFooter').html(renderStudentSubscribeFooter(o, svlState.sub.pick));
}

/* the cards of the modal: the custom plan becomes one card per course count ("1 course", "2 courses"), first */
function svlPlanCards(o) {
    var custom = [], rest = [];
    (o.plans || []).forEach(function (p) {
        if (p.planCode === 'CUSTOM') {
            for (var n = Math.max(p.minCourses, 1); n <= p.maxCourses; n++) { custom.push({ key: 'CUSTOM:' + n, plan: p, count: n }); }
        } else {
            rest.push({ key: p.planCode, plan: p, count: p.minCourses });
        }
    });
    return custom.concat(rest);
}

function svlPickKey(pick) {
    return pick.planCode === 'CUSTOM' ? 'CUSTOM:' + pick.count : pick.planCode;
}

function svlPickCard(key, quiet) {
    var parts = String(key).split(':');
    svlPickPlan(parts[0], parts[1] ? parseInt(parts[1], 10) : 0, quiet);
}

/* choose a plan (custom: with its course count); the courses already ticked are kept up to the new count */
function svlPickPlan(code, count, quiet) {
    var o = svlState.sub.options;
    var pick = svlState.sub.pick;
    pick.planCode = code;
    var plan = svlPickedPlan(o, pick);
    pick.count = plan ? (code === 'CUSTOM' ? Math.min(Math.max(count || plan.minCourses, plan.minCourses), plan.maxCourses) : plan.minCourses) : 0;
    var need = svlPickNeed(o, pick);
    if (need > 0 && o.courses && need === o.courses.length) {
        pick.subjectIds = o.courses.map(function (c) { return c.subjectId; });   // nothing to choose: every course is in it
    } else if (pick.subjectIds.length > need) {
        pick.subjectIds = pick.subjectIds.slice(0, need);
    }
    if (!quiet) { svlRenderSubscribe(); }
}

/* how many courses the chosen card needs (0 = all of them, nothing to choose) */
function svlPickNeed(o, pick) {
    var plan = svlPickedPlan(o, pick);
    if (!plan || plan.minCourses === 0) { return 0; }
    return plan.planCode === 'CUSTOM' ? pick.count : plan.minCourses;
}

function svlPickCourse(subjectId, on) {
    var ids = svlState.sub.pick.subjectIds;
    var i = ids.indexOf(subjectId);
    if (on && i === -1) { ids.push(subjectId); }
    if (!on && i !== -1) { ids.splice(i, 1); }
    svlRenderSubscribe();
}

function svlPickedPlan(o, pick) {
    if (!o || !o.plans) { return null; }
    for (var i = 0; i < o.plans.length; i++) {
        if (o.plans[i].planCode === pick.planCode) { return o.plans[i]; }
    }
    return null;
}

function svlPickValid(o, pick) {
    if (!svlPickedPlan(o, pick)) { return false; }
    var need = svlPickNeed(o, pick);
    return need === 0 || pick.subjectIds.length === need;
}

/* shown to the student only; the server prices the checkout itself */
function svlPickTotal(o, pick) {
    var plan = svlPickedPlan(o, pick);
    if (!plan) { return 0; }
    var fee = Number(plan.fee) || 0;
    return plan.perCourse ? fee * svlPickNeed(o, pick) : fee;
}

function svlMoney(n) {
    return (Number(n) || 0).toFixed(2);
}

function svlStartCheckout() {
    var o = svlState.sub.options;
    var pick = svlState.sub.pick;
    if (svlState.sub.busy || !svlPickValid(o, pick)) { return; }
    svlState.sub.busy = true;
    $('#svlSubPay').prop('disabled', true).html('<i class="fa fa-spinner fa-spin"></i> Preparing payment…');
    callCommonAjax({
        method: 'POST',
        url: svlApiBase() + 'student/subscription/checkout',
        body: { schoolId: SCHOOL_ID, userId: USER_ID, planCode: pick.planCode, subjectIds: pick.subjectIds },
        global: false,
        showMessage: false
    }).then(function (response) {
        svlState.sub.busy = false;
        if (svlIsSuccess(response) && response.details && response.details.userPaymentDetailsId) {
            var d = response.details;
            $('#svlSubModal').modal('hide');
            if (typeof checkPayment === 'function') {
                checkPayment('svlSubModal', d.userPaymentDetailsId, SCHOOL_ID);   // the dashboard's gateway chooser (Stripe / Airwallex)
            } else if (d.paymentLink) {
                window.location.href = d.paymentLink;
            }
        } else {
            showMessageTheme2(0, (response && response.message) ? response.message : 'The payment could not be started.');
            svlRenderSubscribe();
        }
    }).catch(function () {
        svlState.sub.busy = false;
        showMessageTheme2(0, 'The payment could not be started. Please try again.');
        svlRenderSubscribe();
    });
}

function svlFmtDate(ms) {
    var d = new Date(parseInt(ms, 10));
    return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

function svlDaysLeft(ms) {
    var days = Math.ceil((parseInt(ms, 10) - Date.now()) / 86400000);
    return days <= 0 ? 'ends today' : (days === 1 ? '1 day left' : days + ' days left');
}

/* ---- player: YouTube IFrame API (so the next lesson can follow), else a plain embed ---- */
function svlMountVideo(v, autoplay, startAt) {
    var frame = document.getElementById('svlPlayerFrame');
    if (!frame) { return; }
    var start = Math.max(0, Math.floor(startAt || 0));
    if (v.videoType === 'FILE') {
        svlDestroyYt();
        frame.innerHTML = '<video src="' + svlEsc(v.videoUrl) + '" controls playsinline' + (autoplay ? ' autoplay' : '') + '></video>';
        var vid = frame.querySelector('video');
        if (start) { vid.addEventListener('loadedmetadata', function () { vid.currentTime = start; }, { once: true }); }
        vid.addEventListener('playing', function () { svlState.track.seen = true; });
        vid.addEventListener('pause', function () { if (!vid.ended) { svlSaveProgress(false); } });
        vid.addEventListener('ended', svlOnEnded);
        return;
    }
    var ytId = v.youtubeId || svlParseYoutubeId(v.videoUrl);
    if (!ytId) {
        svlDestroyYt();
        frame.innerHTML = '<div class="p-4 text-center text-white">Unable to load this video.</div>';
        return;
    }
    svlLoadYtApi().then(function () {
        if (svlState.yt && svlState.yt.loadVideoById && document.getElementById('svlYt')) {
            var req = { videoId: ytId, startSeconds: start };
            if (autoplay) { svlState.yt.loadVideoById(req); } else { svlState.yt.cueVideoById(req); }
            return;
        }
        frame.innerHTML = '<div id="svlYt"></div>';
        svlState.yt = new window.YT.Player('svlYt', {
            host: 'https://www.youtube-nocookie.com',
            videoId: ytId,
            playerVars: { autoplay: autoplay ? 1 : 0, rel: 0, modestbranding: 1, playsinline: 1, start: start },
            events: {
                onStateChange: function (e) {
                    if (e.data === window.YT.PlayerState.PLAYING) { svlState.track.seen = true; }
                    else if (e.data === window.YT.PlayerState.ENDED) { svlOnEnded(); }
                    else if (e.data === window.YT.PlayerState.PAUSED) { svlSaveProgress(false); }
                }
            }
        });
    }, function () {
        // API blocked / offline: a plain embed still plays; Next still works, only auto-advance + progress are lost
        svlDestroyYt();
        frame.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + ytId + '?rel=0' + (autoplay ? '&autoplay=1' : '')
            + (start ? '&start=' + start : '') + '" allow="autoplay; fullscreen; encrypted-media" allowfullscreen title="Video player"></iframe>';
    });
}

function svlLoadYtApi() {
    if (window.YT && window.YT.Player) { return Promise.resolve(); }
    if (svlState.ytApi) { return svlState.ytApi; }
    svlState.ytApi = new Promise(function (resolve, reject) {
        var previous = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = function () {
            if (typeof previous === 'function') { try { previous(); } catch (e) { /* other page's hook */ } }
            resolve();
        };
        var s = document.createElement('script');
        s.src = 'https://www.youtube.com/iframe_api';
        s.async = true;
        s.onerror = function () { reject(new Error('YouTube API failed to load')); };
        document.head.appendChild(s);
        setTimeout(function () { if (!(window.YT && window.YT.Player)) { reject(new Error('YouTube API timeout')); } }, 8000);
    });
    // a failed attempt may be retried on the next video
    svlState.ytApi.catch(function () { svlState.ytApi = null; });
    return svlState.ytApi;
}

function svlDestroyYt() {
    if (svlState.yt && svlState.yt.destroy) {
        try { svlState.yt.destroy(); } catch (e) { /* already gone */ }
    }
    svlState.yt = null;
}

function svlStopPlayer() {
    svlSaveProgress(false);
    svlStopTracking();
    svlDestroyYt();
    $('#svlPlayerFrame').html('');
}

/* ---- watch progress ---- */

function svlStartTracking(v) {
    var t = svlState.track;
    t.video = v;
    t.seen = false;
    t.lastSentAt = Date.now();
    t.lastSentPos = -1;
    if (t.timer) { clearInterval(t.timer); }
    t.timer = setInterval(svlTick, SVL_TICK_MS);
}

function svlStopTracking() {
    var t = svlState.track;
    if (t.timer) { clearInterval(t.timer); }
    t.timer = null;
    t.video = null;
}

/* while playing, report every SVL_SAVE_EVERY_MS; stop when the page was left */
function svlTick() {
    if (!document.getElementById('svlPlayerFrame')) { svlStopTracking(); return; }
    var now = svlPlayerTime();
    if (now && now.playing && Date.now() - svlState.track.lastSentAt >= SVL_SAVE_EVERY_MS) {
        svlSaveProgress(false);
    }
}

/* {position, duration, playing} of what is in the player, or null */
function svlPlayerTime() {
    try {
        if (svlState.yt && svlState.yt.getCurrentTime) {
            var st = svlState.yt.getPlayerState ? svlState.yt.getPlayerState() : -1;
            return { position: svlState.yt.getCurrentTime() || 0, duration: svlState.yt.getDuration() || 0, playing: st === 1 };
        }
        var vid = document.querySelector('#svlPlayerFrame video');
        if (vid) {
            return { position: vid.currentTime || 0, duration: isFinite(vid.duration) ? vid.duration : 0, playing: !vid.paused && !vid.ended };
        }
    } catch (e) { /* player not ready */ }
    return null;
}

/* send the current video's position (one request in flight; a newer report replaces a waiting one) */
function svlSaveProgress(ended) {
    var t = svlState.track;
    var v = t.video;
    if (!v || !t.seen) { return; }   // this video never played (yet): nothing of it was watched
    var now = svlPlayerTime();
    if (!now) { return; }
    var pos = Math.floor(now.position);
    if (!ended && (pos < 1 || pos === t.lastSentPos)) { return; }   // nothing watched / nothing new
    var body = { videoId: v.id, position: pos, duration: Math.floor(now.duration), ended: !!ended };
    t.lastSentAt = Date.now();
    t.lastSentPos = pos;
    if (t.inFlight) { t.pending = body; return; }
    svlSendProgress(body);
}

function svlSendProgress(body) {
    var t = svlState.track;
    t.inFlight = true;
    callCommonAjax({
        method: 'POST',
        url: svlApiBase() + 'student/progress',
        body: $.extend({ schoolId: SCHOOL_ID, userId: USER_ID }, body),
        global: false,          // background: no page loader
        showMessage: false
    }).then(function (response) {
        if (svlIsSuccess(response) && response.details) { svlApplyProgress(body.videoId, response.details); }
    }).catch(function () { /* the next report will try again */ }).then(function () {
        t.inFlight = false;
        if (t.pending) {
            var next = t.pending;
            t.pending = null;
            svlSendProgress(next);
        }
    });
}

/* store the server's answer on the video and refresh ✓ / bars */
function svlApplyProgress(videoId, p) {
    var changed = false;
    svlState.playlists.forEach(function (d) {
        svlBuildSteps(d).forEach(function (step) {
            step.videos.forEach(function (v) {
                if (v.id !== videoId) { return; }
                changed = changed || v.watchCompleted !== !!p.completed || v.watchedPercent !== p.watchedPercent;
                v.watchedPercent = p.watchedPercent;
                v.watchCompleted = !!p.completed;
                v.lastPosition = p.lastPosition;
                v.lastWatchedAt = String(Date.now());
            });
        });
    });
    if (changed && $('#svlMain .svl-layout').length) { svlRefreshProgressUi(); }
}

function svlFmtTime(sec) {
    sec = Math.max(0, Math.floor(sec || 0));
    var h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
    var mm = h ? String(m).padStart(2, '0') : String(m);
    return (h ? h + ':' : '') + mm + ':' + String(s).padStart(2, '0');
}

/* ---- per-browser memory (last course / lesson, autoplay choice); storage may be unavailable ---- */
function svlReadStore() {
    try {
        return JSON.parse(window.localStorage.getItem(SVL_STORE_KEY) || '{}') || {};
    } catch (e) {
        return {};
    }
}

function svlWriteStore(patch) {
    try {
        window.localStorage.setItem(SVL_STORE_KEY, JSON.stringify($.extend(svlReadStore(), patch)));
    } catch (e) { /* private mode / blocked: just don't remember */ }
}

/* ---- helpers ---- */
function svlThumbUrl(v) {
    if (v.thumbnailUrl) { return v.thumbnailUrl; }
    var ytId = v.youtubeId || svlParseYoutubeId(v.videoUrl);
    if (ytId) { return 'https://img.youtube.com/vi/' + ytId + '/hqdefault.jpg'; }
    // a locked course: the server hides the YouTube id and serves the thumbnail itself
    if (v.youtubeThumb && v.id) { return svlApiBase() + 'student/thumbnail/' + encodeURIComponent(v.id); }
    return svlFallbackThumb();
}

function svlFallbackThumb() {
    var pc = (getComputedStyle(document.documentElement).getPropertyValue('--pc') || '').trim() || '#007fff';
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180"><rect width="100%" height="100%" fill="#1b2030"/><text x="50%" y="52%" fill="' + pc + '" font-family="sans-serif" font-size="20" text-anchor="middle">VIDEO</text></svg>');
}

function svlParseYoutubeId(url) {
    if (!url) { return null; }
    var m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|v\/)|youtu\.be\/)([\w-]{11})/);
    if (m) { return m[1]; }
    if (/^[\w-]{11}$/.test(url.trim())) { return url.trim(); }
    return null;
}

function svlEsc(s) {
    if (s === null || s === undefined) { return ''; }
    return String(s).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
}
