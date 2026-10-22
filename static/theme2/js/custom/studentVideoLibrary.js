/* =====================================================================
 * Video Library — Student (Videos) : logic
 * Depends on: studentVideoLibraryContent.js (templates),
 *             callCommonAjax / showMessageTheme2 / customLoader (common),
 *             globals SCHOOL_ID, USER_ID, APP_BASE_URL, API_VERSION.
 * ===================================================================== */

var svlState = {
    videos: [],
    subjects: [],
    activeSubject: 0,
    search: '',
    gsapReady: false
};

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
    if ($('#svlPlayerModal').length === 0) {
        $('body').append(getStudentVideoPlayerModalHtml());
        $('#svlPlayerModal').on('hidden.bs.modal', svlStopPlayer);
    }
    svlState.activeSubject = 0;
    svlState.search = '';
    svlLoadGsap();
    $('#svlSearch').off('input').on('input', function () {
        svlState.search = (this.value || '').trim().toLowerCase();
        svlRender();
    });
    svlLoadVideos();
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

function svlLoadVideos() {
    customLoader(true);
    callCommonAjax({
        method: 'POST',
        url: svlApiBase() + 'student/list',
        body: { schoolId: SCHOOL_ID, userId: USER_ID },
        global: true,
        showMessage: false
    }).then(function (response) {
        customLoader(false);
        if (svlIsSuccess(response)) {
            svlState.videos = response.details || [];
            svlState.subjects = svlDeriveSubjects(svlState.videos);
            $('#svlChips').html(renderStudentSubjectChips(svlState.subjects));
            svlRender();
        } else {
            showMessageTheme2(0, (response && response.message) ? response.message : 'Failed to load videos.');
        }
    }).catch(function () {
        customLoader(false);
        showMessageTheme2(0, 'Failed to load videos.');
    });
}

function svlDeriveSubjects(videos) {
    var seen = {};
    var list = [];
    (videos || []).forEach(function (v) {
        if (v.subjectId && !seen[v.subjectId]) {
            seen[v.subjectId] = true;
            list.push({ subjectId: v.subjectId, subjectName: v.subjectName || 'Subject' });
        }
    });
    list.sort(function (a, b) { return (a.subjectName || '').localeCompare(b.subjectName || ''); });
    return list;
}

function svlRender() {
    var filtered = svlState.videos.filter(function (v) {
        var okSubject = (svlState.activeSubject === 0) || (parseInt(v.subjectId, 10) === parseInt(svlState.activeSubject, 10));
        var okSearch = !svlState.search
            || (v.title && v.title.toLowerCase().indexOf(svlState.search) !== -1)
            || (v.description && v.description.toLowerCase().indexOf(svlState.search) !== -1);
        return okSubject && okSearch;
    });
    $('#svlGrid').html(renderStudentVideoCards(filtered));
    svlAnimateCards();
}

function svlAnimateCards() {
    if (svlState.gsapReady && window.gsap) {
        window.gsap.to('.svl-card', { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: 'power2.out' });
    } else {
        $('.svl-card').addClass('svl-in');
    }
}

function svlFilterSubject(subjectId, el) {
    svlState.activeSubject = subjectId;
    $('#svlChips .svl-chip').removeClass('active');
    if (el) { $(el).addClass('active'); }
    svlRender();
}

/* ---- player ---- */
function svlPlayVideo(id) {
    var v = svlFindVideo(id);
    if (!v) { return; }
    $('#svlPlayerTitle').text(v.title || 'Video');
    $('#svlPlayerSubject').text(v.subjectName || '');
    $('#svlPlayerDesc').text(v.description || '');
    var html;
    if (v.videoType === 'FILE') {
        html = '<video src="' + svlEsc(v.videoUrl) + '" controls autoplay></video>';
    } else {
        var ytId = v.youtubeId || svlParseYoutubeId(v.videoUrl);
        html = ytId
            ? '<iframe src="https://www.youtube-nocookie.com/embed/' + ytId + '?autoplay=1&rel=0" allow="autoplay; fullscreen" allowfullscreen></iframe>'
            : '<div class="p-4 text-center text-danger">Unable to load this video.</div>';
    }
    $('#svlPlayerFrame').html(html);
    $('#svlPlayerModal').modal('show');
}

function svlStopPlayer() {
    $('#svlPlayerFrame').html('');
}

/* ---- helpers ---- */
function svlFindVideo(id) {
    id = parseInt(id, 10);
    for (var i = 0; i < svlState.videos.length; i++) {
        if (parseInt(svlState.videos[i].id, 10) === id) { return svlState.videos[i]; }
    }
    return null;
}

function svlThumbUrl(v) {
    if (v.thumbnailUrl) { return v.thumbnailUrl; }
    var ytId = v.youtubeId || svlParseYoutubeId(v.videoUrl);
    if (ytId) { return 'https://img.youtube.com/vi/' + ytId + '/hqdefault.jpg'; }
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
