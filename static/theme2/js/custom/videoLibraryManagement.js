/* =====================================================================
 * Video Library — Admin (Videos Management) : logic
 * Depends on: videoLibraryManagementContent.js (templates),
 *             callCommonAjax / showMessageTheme2 / customLoader (common),
 *             globals SCHOOL_ID, USER_ID, APP_BASE_URL, API_VERSION.
 * ===================================================================== */

var vlmState = {
    videos: [],
    subjects: [],
    grades: [],
    activeSubject: '',      // course chip key ("standardId|name"), '' = all
    grade: 0,               // grade filter of both tabs, 0 = all grades
    search: '',
    sortBy: 'playlist',
    editingId: 0,
    deleteId: 0,
    source: 'URL',
    gsapReady: false,
    // lesson picker (upload modal)
    lessons: [],            // lessons of the course picked in the modal
    lessonReq: 0,           // only the latest lessons request may render
    pendingLessonId: null,  // lesson to pre-select once the course's lessons arrive (edit)
    autoTitle: '',          // last title we filled in, so we never overwrite a typed one
    // course playlists view (the default screen)
    view: 'playlists',
    playlists: [],
    playlistsLoaded: false,
    plSearch: '',
    openPlaylistId: 0,
    playlist: null,         // detail of the open playlist
    sortables: [],          // drag & drop instances of the open playlist
    addMode: 'new',         // add-video modal: 'new' upload, or 'pick' already uploaded videos
    pickLessonId: 0,        // lesson the picked videos go into
    pickItems: [],          // [{v, where, lessonId}] videos of the course that can be picked
    picked: {},             // {videoId: true}
    pickSearch: '',
    sortableLoading: null,  // promise of the SortableJS script
    confirmAction: null
};

var VLM_SORTABLE_SRC = 'https://cdnjs.cloudflare.com/ajax/libs/Sortable/1.15.6/Sortable.min.js';

function vlmApiBase() {
    return vlmNormalizeUrl(APP_BASE_URL + API_VERSION + 'video-library/');
}

/* collapse accidental double slashes (e.g. APP_BASE_URL trailing "/" + API_VERSION leading "/"),
   while preserving the protocol "://". */
function vlmNormalizeUrl(u) {
    var i = (u || '').indexOf('://');
    if (i < 0) { return (u || '').replace(/\/{2,}/g, '/'); }
    return u.substring(0, i + 3) + u.substring(i + 3).replace(/\/{2,}/g, '/');
}

function vlmIsSuccess(response) {
    return response && (response.status === 'SUCCESS' || response.status === '1'
        || response.statusCode === '200' || response.statusCode === 'SUCCESS');
}

/* POST to the video-library API with school/user context; optional loader */
function vlmPost(path, body, withLoader) {
    if (withLoader !== false) { customLoader(true); }
    return callCommonAjax({
        method: 'POST',
        url: vlmApiBase() + path,
        body: $.extend({ schoolId: SCHOOL_ID, userId: USER_ID }, body || {}),
        global: withLoader !== false,   // global ajax events show the page loader
        showMessage: false
    }).then(function (response) {
        if (withLoader !== false) { customLoader(false); }
        return response;
    }, function (err) {
        if (withLoader !== false) { customLoader(false); }
        throw err;
    });
}

/* a change call: shows the server message on failure, resolves to the response or null */
function vlmMutate(path, body, okMessage, quiet) {
    return vlmPost(path, body, !quiet).then(function (response) {
        if (vlmIsSuccess(response)) {
            if (okMessage) { showMessageTheme2(1, okMessage); }
            return response;
        }
        showMessageTheme2(0, (response && response.message) ? response.message : 'Something went wrong. Please try again.');
        return null;
    }, function () {
        showMessageTheme2(0, 'Something went wrong. Please try again.');
        return null;
    });
}

function videoLibraryManagementOnLoad() {
    // append modals once
    if ($('#vlmModal').length === 0) {
        $('body').append(getVideoLibraryModalHtml());
        $('body').append(getVideoLibraryPlayerModalHtml());
        $('body').append(getVideoLibraryConfirmModalHtml());
        $('body').append(getVideoLibraryLessonModalHtml());
        $('#vlmConfirmDeleteBtn').on('click', function () {
            var action = vlmState.confirmAction;
            vlmState.confirmAction = null;
            $('#vlmConfirmModal').modal('hide');
            if (action) { action(); }
        });
        $('#vlmPlayerModal').on('hidden.bs.modal', vlmStopPlayer);
        $('#vlmVideoUrl').on('input', vlmRenderUrlPreview);
        // course picked -> its uploaded videos + its lessons (delegated: #vlmSubject is re-rendered)
        $('#vlmModal').on('change', '#vlmSubject', vlmOnCourseChange);
        $('#vlmModal').on('change', '#vlmLesson', vlmOnLessonChange);
        $('#vlmModal').on('input', '#vlmNewModuleNo, #vlmNewLessonNo, #vlmNewLessonTitle', vlmApplyAutoTitle);
        $('#vlmModal').on('input', '#vlmPickSearch', function () {
            vlmState.pickSearch = (this.value || '').trim().toLowerCase();
            vlmRenderPickList();
        });
    }
    vlmState.activeSubject = '';
    vlmState.grade = 0;
    vlmState.search = '';
    vlmState.sortBy = 'playlist';
    vlmState.openPlaylistId = 0;
    vlmState.playlist = null;
    vlmLoadGsap();
    vlmLoadSortable().catch(function () { /* drag & drop off; the ⋯ menu still works */ });
    vlmSwitchView('playlists');
    vlmLoadGrades();
    vlmLoadSubjects().then(function () {
        vlmLoadVideos();
    });
    $('#vlmSearch').off('input').on('input', function () {
        vlmState.search = (this.value || '').trim().toLowerCase();
        vlmRender();
    });
    $('#vlmSort').off('change').on('change', function () {
        vlmState.sortBy = this.value || 'playlist';
        vlmRender();
    });
    $('#vlmGradeFilter').off('change').on('change', function () {
        vlmState.grade = parseInt(this.value, 10) || 0;
        vlmState.activeSubject = '';
        vlmRenderChips();
        vlmRender();
        vlmRenderPlaylists();
    });
    $('#vlmPlSearch').off('input').on('input', function () {
        vlmState.plSearch = (this.value || '').trim().toLowerCase();
        vlmRenderPlaylists();
    });
}

/* ---- GSAP (optional, loaded from CDN; UI still works without it) ---- */
function vlmLoadGsap() {
    if (window.gsap) { vlmState.gsapReady = true; vlmRevealIntro(); return; }
    if (document.getElementById('vlmGsapScript')) {
        document.getElementById('vlmGsapScript').addEventListener('load', function () {
            vlmState.gsapReady = true; vlmRevealIntro();
        });
        return;
    }
    var s = document.createElement('script');
    s.id = 'vlmGsapScript';
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js';
    s.onload = function () { vlmState.gsapReady = true; vlmRevealIntro(); };
    document.head.appendChild(s);
}

/* text-reveal intro for the page header / toolbar (standard staggered fade-up) */
function vlmRevealIntro() {
    if (!window.gsap) { return; }
    try {
        // header row (icon/title/subtitle/add-btn) must land together, not stagger — a
        // staggered button would visibly lag below the already-settled icon/title.
        window.gsap.from('.vlm-scope .vlm-header .vlm-reveal', { y: 18, opacity: 0, duration: 0.5, stagger: 0, ease: 'power3.out' });
        window.gsap.from('.vlm-scope .vlm-stats.vlm-reveal, .vlm-scope .vlm-views.vlm-reveal, .vlm-scope .vlm-toolbar.vlm-reveal', { y: 18, opacity: 0, duration: 0.5, delay: 0.12, stagger: 0.09, ease: 'power3.out' });
    } catch (e) { /* ignore */ }
}

/* ---- subjects ---- */
function vlmLoadSubjects() {
    return callCommonAjax({
        method: 'POST',
        url: vlmApiBase() + 'subjects',
        body: { schoolId: SCHOOL_ID, userId: USER_ID },
        global: true,
        showMessage: false
    }).then(function (response) {
        if (vlmIsSuccess(response)) {
            // store all subjects (each carries standardId); the Subject dropdown is
            // populated only after grade(s) are chosen, filtered to those grades.
            vlmState.subjects = response.details || [];
            vlmFillGradeFilter();
            if (vlmState.grade) { vlmRenderPlaylists(); }   // a grade lists all of its courses
        }
    }).catch(function () { /* handled by global error */ });
}

/* ---- grades (multi-select) ---- */
function vlmLoadGrades() {
    return callCommonAjax({
        method: 'POST',
        url: vlmApiBase() + 'grades',
        body: { schoolId: SCHOOL_ID, userId: USER_ID },
        global: true,
        showMessage: false
    }).then(function (response) {
        if (vlmIsSuccess(response)) {
            vlmState.grades = response.details || [];
            vlmFillGradeSelect();
            vlmFillGradeFilter();
            vlmRender();   // playlist order sorts by grade order
        }
    }).catch(function () { /* handled globally */ });
}

function vlmFillGradeSelect() {
    var opts = vlmState.grades.map(function (g) {
        return '<option value="' + g.gradeId + '">' + vlmEsc(g.gradeName) + '</option>';
    }).join('');
    var $sel = $('#vlmGrades');
    $sel.html(opts);
    try {
        $sel.select2({ theme: 'bootstrap4', placeholder: 'Select grade(s)', dropdownParent: $('#vlmModal'), width: '100%' });
    } catch (e) { /* select2 optional */ }
    // when grade(s) change, re-filter the Subject dropdown
    $sel.off('change.vlmGrade').on('change.vlmGrade', vlmFilterSubjectsByGrade);
}

/* Populate the Subject dropdown from the selected grade(s) only (deduped by title). */
function vlmFilterSubjectsByGrade() {
    var selected = ($('#vlmGrades').val() || []).map(function (g) { return parseInt(g, 10); });
    var $subject = $('#vlmSubject');
    if (!selected.length) {
        $subject.html('<option value="">Select grade(s) first</option>').prop('disabled', true);
        try { $subject.select2({ theme: 'bootstrap4', dropdownParent: $('#vlmModal') }); } catch (e) {}
        $('#vlmSubjectHint').text('Select grade(s) above to see subjects.');
        $('#vlmSubjectVideosWrap').addClass('vlm-hidden');
        vlmLoadLessons();
        return;
    }
    var seen = {};
    var filtered = [];
    vlmState.subjects.forEach(function (s) {
        if (selected.indexOf(parseInt(s.standardId, 10)) !== -1) {
            var key = (s.subjectName || '').trim().toLowerCase();
            if (key && !seen[key]) { seen[key] = true; filtered.push(s); }
        }
    });
    filtered.sort(function (a, b) { return (a.subjectName || '').localeCompare(b.subjectName || ''); });
    var opts = '<option value="">Select course</option>' + filtered.map(function (s) {
        return '<option value="' + s.subjectId + '">' + vlmEsc(s.subjectName) + '</option>';
    }).join('');
    $subject.html(opts).prop('disabled', filtered.length === 0);
    try { $subject.select2({ theme: 'bootstrap4', dropdownParent: $('#vlmModal') }); } catch (e) {}
    $('#vlmSubjectHint').text(filtered.length
        ? filtered.length + ' course(s) for the selected grade(s).'
        : 'No courses found for the selected grade(s).');
    vlmShowSubjectVideos();
    vlmLoadLessons();
}

function vlmOnCourseChange() {
    vlmShowSubjectVideos();
    vlmLoadLessons();
}

/* Show a one-line slider of videos already uploaded for the chosen subject. */
function vlmShowSubjectVideos() {
    var title = ($('#vlmSubject option:selected').text() || '').trim().toLowerCase();
    var selfId = parseInt($('#vlmEditId').val() || '0', 10);
    if (!title || $('#vlmSubject').val() === '' || $('#vlmSubject').prop('disabled')) {
        $('#vlmSubjectVideosWrap').addClass('vlm-hidden');
        return;
    }
    var list = vlmState.videos.filter(function (v) {
        return (v.subjectName || '').trim().toLowerCase() === title && parseInt(v.id, 10) !== selfId;
    });
    // nothing uploaded for this subject -> hide the whole section (no empty-state clutter)
    if (!list.length) {
        $('#vlmSubjectVideosWrap').addClass('vlm-hidden');
        return;
    }
    // newest first (all of them)
    list.sort(function (a, b) { return parseInt(b.id, 10) - parseInt(a.id, 10); });
    $('#vlmSubjectVideos').html(list.map(function (v) {
        var thumb = vlmThumbUrl(v);
        return '<div class="vlm-sv-item" title="' + vlmEsc(v.title) + '">'
            + '<div class="vlm-sv-thumb" style="background-image:url(\'' + thumb + '\')"><i class="fa fa-play"></i></div>'
            + '<div class="vlm-sv-title">' + vlmEsc(v.title) + '</div></div>';
    }).join(''));
    $('#vlmSubjectVideosWrap').removeClass('vlm-hidden');
    if (vlmState.gsapReady && window.gsap) {
        window.gsap.from('#vlmSubjectVideos .vlm-sv-item', { x: 24, opacity: 0, duration: 0.4, stagger: 0.06, ease: 'power2.out' });
    }
}

/* In edit mode, select the subject whose title matches the saved video. */
function vlmSetSubjectByTitle(title) {
    if (!title) { return; }
    var t = title.trim().toLowerCase();
    var matchVal = '';
    $('#vlmSubject option').each(function () {
        if (($(this).text() || '').trim().toLowerCase() === t) { matchVal = this.value; }
    });
    if (matchVal) {
        try { $('#vlmSubject').val(matchVal).trigger('change'); } catch (e) {}
    }
}

/* ---- lesson picker (upload modal) ---- */

/* Load the chosen course's lessons into #vlmLesson (or reset it when no course is chosen). */
function vlmLoadLessons() {
    var req = ++vlmState.lessonReq;
    var subjectId = parseInt($('#vlmSubject').val() || '0', 10);
    var $lesson = $('#vlmLesson');
    vlmState.lessons = [];
    if (!subjectId || $('#vlmSubject').prop('disabled')) {
        $lesson.html('<option value="0">Select a course first</option>').prop('disabled', true);
        $('#vlmNewLessonBox').addClass('vlm-hidden');
        return;
    }
    $lesson.html('<option value="0">Loading lessons…</option>').prop('disabled', true);
    vlmPost('playlist/lessons', { subjectId: subjectId }, false).then(function (response) {
        if (req !== vlmState.lessonReq) { return; }   // a newer course was picked meanwhile
        vlmState.lessons = vlmIsSuccess(response) ? (response.details || []) : [];
        var select = vlmState.pendingLessonId;
        vlmState.pendingLessonId = null;
        vlmRenderLessonSelect(select);
    }, function () {
        if (req !== vlmState.lessonReq) { return; }
        vlmState.lessons = [];
        vlmRenderLessonSelect(null);
    });
}

function vlmRenderLessonSelect(selectId) {
    var opts = '<option value="0">No lesson — place it in the playlist later</option>';
    opts += vlmState.lessons.map(function (l) {
        var n = l.videoCount || 0;
        return '<option value="' + l.id + '">'
            + vlmEsc(vlmLessonLabel({ moduleNo: l.moduleNo, lessonNo: l.lessonNo, lessonTitle: l.title }))
            + (n ? ' (' + n + ' video' + (n === 1 ? '' : 's') + ')' : '') + '</option>';
    }).join('');
    opts += '<option value="new">＋ Create a new lesson…</option>';
    var $lesson = $('#vlmLesson');
    $lesson.html(opts).prop('disabled', false);
    var want = (selectId !== null && selectId !== undefined) ? String(selectId) : '0';
    if (!$lesson.find('option[value="' + want + '"]').length) { want = '0'; }
    $lesson.val(want);
    $('#vlmLessonHint').text(vlmState.lessons.length
        ? 'Pick the lesson this video teaches. Several teachers can add videos to the same lesson.'
        : 'This course has no lessons yet — create the first one.');
    vlmOnLessonChange();
}

function vlmOnLessonChange() {
    var val = $('#vlmLesson').val();
    var isNew = (val === 'new');
    $('#vlmNewLessonBox').toggleClass('vlm-hidden', !isNew);
    if (isNew) {
        var next = vlmSuggestNextLesson(vlmState.lessons);
        $('#vlmNewModuleNo').val(next.moduleNo);
        $('#vlmNewLessonNo').val(next.lessonNo);
        $('#vlmNewLessonTitle').val('');
        setTimeout(function () { $('#vlmNewLessonTitle').trigger('focus'); }, 50);
    }
    vlmApplyAutoTitle();
}

/* next free slot: last module, last lesson + 1 (1/1 for an empty course) */
function vlmSuggestNextLesson(lessons) {
    var moduleNo = 1;
    var lessonNo = 0;
    (lessons || []).forEach(function (l) {
        var m = parseInt(l.moduleNo, 10) || 1;
        var n = parseInt(l.lessonNo, 10) || 0;
        if (m > moduleNo) { moduleNo = m; lessonNo = n; }
        else if (m === moduleNo && n > lessonNo) { lessonNo = n; }
    });
    return { moduleNo: moduleNo, lessonNo: lessonNo + 1 };
}

/* Fill the title as "Course | Lesson | Module M, Lesson L" — only while the admin hasn't typed their own. */
function vlmApplyAutoTitle() {
    var current = ($('#vlmTitle').val() || '').trim();
    if (current && current !== vlmState.autoTitle) { return; }
    var lesson = vlmSelectedLessonParts();
    var course = ($('#vlmSubject option:selected').text() || '').trim();
    if (!lesson || !course || !$('#vlmSubject').val()) {
        // the lesson we titled the video after is no longer picked -> drop our suggestion
        if (current && current === vlmState.autoTitle) {
            $('#vlmTitle').val('');
            vlmState.autoTitle = '';
        }
        return;
    }
    var t = course + ' | ' + lesson.title + ' | Module ' + lesson.moduleNo + ', Lesson ' + lesson.lessonNo;
    vlmState.autoTitle = t;
    $('#vlmTitle').val(t);
}

/* {moduleNo, lessonNo, title} of the picked / new lesson, or null */
function vlmSelectedLessonParts() {
    var val = $('#vlmLesson').val();
    if (val === 'new') {
        var title = ($('#vlmNewLessonTitle').val() || '').trim();
        if (!title) { return null; }
        return { moduleNo: parseInt($('#vlmNewModuleNo').val(), 10) || 1, lessonNo: parseInt($('#vlmNewLessonNo').val(), 10) || 1, title: title };
    }
    var id = parseInt(val || '0', 10);
    for (var i = 0; i < vlmState.lessons.length; i++) {
        if (vlmState.lessons[i].id === id) {
            return { moduleNo: vlmState.lessons[i].moduleNo, lessonNo: vlmState.lessons[i].lessonNo, title: vlmState.lessons[i].title };
        }
    }
    return null;
}

/* ---- list (load all once, filter client-side via chips + search) ---- */
function vlmLoadVideos(silent) {
    if (!silent) { customLoader(true); }
    callCommonAjax({
        method: 'POST',
        url: vlmApiBase() + 'list',
        body: { schoolId: SCHOOL_ID, userId: USER_ID },
        global: !silent,
        showMessage: false
    }).then(function (response) {
        if (!silent) { customLoader(false); }
        if (vlmIsSuccess(response)) {
            vlmState.videos = response.details || [];
            $('#vlmSummary').html(renderVideoLibrarySummary(vlmState.videos));
            vlmFillGradeFilter();
            vlmRenderChips();
            vlmRender();
            if (vlmState.view === 'playlists' && !vlmState.openPlaylistId) { vlmRenderPlaylists(); }   // "to place" badges
        } else {
            showMessageTheme2(0, (response && response.message) ? response.message : 'Failed to load videos.');
        }
    }).catch(function () {
        if (!silent) { customLoader(false); }
        showMessageTheme2(0, 'Failed to load videos.');
    });
}

function vlmRender() {
    var filtered = vlmState.videos.filter(function (v) {
        var okSubject = vlmInGrade(v) && (!vlmState.activeSubject || vlmCourseKey(v) === vlmState.activeSubject);
        var okSearch = !vlmState.search
            || (v.title && v.title.toLowerCase().indexOf(vlmState.search) !== -1)
            || (v.description && v.description.toLowerCase().indexOf(vlmState.search) !== -1);
        return okSubject && okSearch;
    });
    filtered = vlmSortVideos(filtered);
    $('#vlmGrid').html(renderVideoLibraryCards(filtered));
    vlmAnimateCards();
}

/* Sort the (already filtered) list by the toolbar choice. "Playlist order" = grade order, course,
   then the course playlist: lesson order, primary first, item order; videos without a lesson last. */
function vlmSortVideos(list) {
    var by = vlmState.sortBy || 'playlist';
    var arr = list.slice();
    function num(x) { var n = parseInt(x, 10); return isNaN(n) ? 0 : n; }
    function title(v) { return (v && v.title ? v.title : '').toLowerCase(); }
    if (by === 'newest') {
        arr.sort(function (a, b) { return num(b.createdDate) - num(a.createdDate) || num(b.id) - num(a.id); });
    } else if (by === 'oldest') {
        arr.sort(function (a, b) { return num(a.createdDate) - num(b.createdDate) || num(a.id) - num(b.id); });
    } else if (by === 'title_az') {
        arr.sort(function (a, b) { return title(a).localeCompare(title(b)); });
    } else if (by === 'title_za') {
        arr.sort(function (a, b) { return title(b).localeCompare(title(a)); });
    } else {
        arr.sort(function (a, b) {
            return vlmGradeRank(a) - vlmGradeRank(b)
                || (a.subjectName || '').localeCompare(b.subjectName || '')
                || (a.lessonId ? 0 : 1) - (b.lessonId ? 0 : 1)
                || num(a.lessonSeq) - num(b.lessonSeq)
                || (a.primary ? 0 : 1) - (b.primary ? 0 : 1)
                || num(a.itemSeq) - num(b.itemSeq)
                || num(a.id) - num(b.id);
        });
    }
    return arr;
}

/* position of the video's course grade in the grade list (server sends it in grade order) */
function vlmGradeRank(v) {
    var name = (v.standardName || '').trim().toLowerCase();
    for (var i = 0; i < vlmState.grades.length; i++) {
        var g = vlmState.grades[i];
        if ((name && (g.gradeName || '').trim().toLowerCase() === name) || (!name && parseInt(g.gradeId, 10) === parseInt(v.standardId, 10))) {
            return i;
        }
    }
    return 9999;
}

/* a course = grade + name (provider sibling ids share it) */
function vlmCourseKey(v) {
    return (v.standardId || '') + '|' + (v.subjectName || '').trim().toLowerCase();
}

function vlmInGrade(v) {
    var g = vlmState.grade;
    if (!g) { return true; }
    return parseInt(v.standardId, 10) === g || (v.gradeIds || []).some(function (x) { return parseInt(x, 10) === g; });
}

/* chips of the courses that have videos in the chosen grade */
function vlmRenderChips() {
    var byKey = {};
    var list = [];
    vlmState.videos.filter(vlmInGrade).forEach(function (v) {
        var key = vlmCourseKey(v);
        if (!byKey[key]) {
            byKey[key] = { key: key, subjectName: v.subjectName || 'Course', gradeName: v.standardName || '', count: 0, rank: vlmGradeRank(v) };
            list.push(byKey[key]);
        }
        byKey[key].count++;
    });
    var names = {};
    list.forEach(function (c) { var n = c.subjectName.toLowerCase(); names[n] = (names[n] || 0) + 1; });
    list.forEach(function (c) { c.showGrade = names[c.subjectName.toLowerCase()] > 1; });
    list.sort(function (a, b) { return a.subjectName.localeCompare(b.subjectName) || a.rank - b.rank; });
    if (vlmState.activeSubject && !byKey[vlmState.activeSubject]) { vlmState.activeSubject = ''; }
    $('#vlmChips').html(renderVideoLibraryChips(list, vlmState.activeSubject));
}

/* grade filter: the grades that have courses, in grade order */
function vlmFillGradeFilter() {
    var used = {};
    vlmState.videos.forEach(function (v) { if (v.standardId) { used[parseInt(v.standardId, 10)] = true; } });
    vlmState.playlists.forEach(function (p) { if (p.standardId) { used[parseInt(p.standardId, 10)] = true; } });
    vlmState.subjects.forEach(function (s) { if (s.standardId) { used[parseInt(s.standardId, 10)] = true; } });
    var opts = '<option value="0">All grades</option>' + vlmState.grades.filter(function (g) {
        return used[parseInt(g.gradeId, 10)] || parseInt(g.gradeId, 10) === vlmState.grade;
    }).map(function (g) {
        return '<option value="' + g.gradeId + '">' + vlmEsc(g.gradeName) + '</option>';
    }).join('');
    $('#vlmGradeFilter').html(opts).val(String(vlmState.grade));
}

function vlmAnimateCards() {
    if (vlmState.gsapReady && window.gsap) {
        window.gsap.to('.vlm-card', { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power2.out' });
    } else {
        $('.vlm-card').addClass('vlm-in');
    }
}

function vlmFilterChip(el) {
    vlmState.activeSubject = $(el).attr('data-key') || '';
    $('#vlmChips .vlm-chip').removeClass('active');
    $(el).addClass('active');
    vlmRender();
}

/* ---- add / edit ---- */
function vlmOpenAddModal() {
    vlmState.editingId = 0;
    vlmState.pendingLessonId = null;
    vlmState.autoTitle = '';
    $('#vlmModalTitle').text('Add Video');
    $('#vlmEditId').val('0');
    $('#vlmTitle').val('');
    $('#vlmDescription').val('');
    $('#vlmVideoUrl').val('');
    $('#vlmFileUrl').val('');
    $('#vlmStatus').val('ACTIVE');
    try { $('#vlmGrades').val(null).trigger('change'); } catch (e) {}  // clears -> subject disabled
    vlmFilterSubjectsByGrade();
    $('input[name="vlmSource"][value="URL"]').prop('checked', true);
    vlmToggleSource('URL');
    vlmRenderUrlPreview();
    vlmResetUpload(false);
    $('#vlmUseThumb').prop('checked', false);
    vlmToggleThumb();
    vlmShowPickers();
    vlmState.pickLessonId = 0;
    $('#vlmModeBar').addClass('vlm-hidden');
    vlmSetAddMode('new');
    $('#vlmModal').modal('show');
    vlmModalIntro();
}

/* the header button: inside an open course, the course is picked already */
function vlmOpenAddFromHeader() {
    if (vlmState.view === 'playlists' && vlmState.playlist) {
        vlmOpenAddToLesson(0);
    } else {
        vlmOpenAddModal();
    }
}

/* "+ Video" of a lesson: course, grade and lesson are filled in (and the pickers folded away);
   lessonId 0 = only the open course is picked. */
function vlmOpenAddToLesson(lessonId) {
    var p = vlmState.playlist && vlmState.playlist.playlist;
    if (!p) { vlmOpenAddModal(); return; }
    vlmOpenAddModal();
    try { $('#vlmGrades').val(p.standardId ? [String(p.standardId)] : []).trigger('change'); } catch (e) {}
    vlmFilterSubjectsByGrade();
    vlmState.pendingLessonId = lessonId || 0;   // picked once the course's lessons arrive
    vlmPickCourse(p.subjectId, p.title);
    var l = lessonId ? vlmFindPlaylistLesson(lessonId) : null;
    if (l) {
        $('#vlmContextCourse').text(p.title + (p.standardName ? ' · ' + p.standardName : ''));
        $('#vlmContextLesson').text(vlmLessonLabel({ moduleNo: l.moduleNo, lessonNo: l.lessonNo, lessonTitle: l.title }));
        $('#vlmContextBox').removeClass('vlm-hidden');
        $('#vlmPickers').addClass('vlm-hidden');
        vlmPreparePick(l);
    }
    setTimeout(function () { $('#vlmVideoUrl').trigger('focus'); }, 350);
}

/* videos of the open course that can go into lesson l: the ones not in a lesson first, then those of other lessons */
function vlmPreparePick(l) {
    var d = vlmState.playlist || {};
    var items = (d.otherVideos || []).map(function (v) { return { v: v, where: 'Not in a lesson', lessonId: 0 }; });
    (d.lessons || []).forEach(function (o) {
        if (o.id === l.id) { return; }
        (o.videos || []).forEach(function (v) {
            items.push({ v: v, where: 'Now in ' + vlmLessonLabel({ moduleNo: o.moduleNo, lessonNo: o.lessonNo, lessonTitle: o.title }), lessonId: o.id });
        });
    });
    vlmState.pickLessonId = l.id;
    vlmState.pickItems = items;
    vlmState.picked = {};
    vlmState.pickSearch = '';
    $('#vlmPickSearch').val('');
    var loose = items.filter(function (it) { return !it.lessonId; }).length;
    $('#vlmPickCount').text(items.length).toggleClass('vlm-hidden', !items.length);
    $('#vlmModeBar').toggleClass('vlm-hidden', !items.length);
    vlmRenderPickList();
    // nothing to upload for: unplaced videos waiting -> start on the list
    vlmSetAddMode(loose ? 'pick' : 'new');
}

function vlmRenderPickList() {
    var q = vlmState.pickSearch;
    var items = vlmState.pickItems.filter(function (it) { return !q || (it.v.title || '').toLowerCase().indexOf(q) !== -1; });
    $('#vlmPickList').html(renderVideoPickList(items, vlmState.picked));
}

function vlmTogglePick(videoId, on) {
    if (on) { vlmState.picked[videoId] = true; } else { delete vlmState.picked[videoId]; }
    $('#vlmPickList input[value="' + videoId + '"]').closest('.vlm-pick').toggleClass('is-picked', !!on);
    vlmUpdateSaveButton();
}

function vlmPickedIds() {
    // in list order, so they land in the lesson in the order shown
    return vlmState.pickItems.map(function (it) { return it.v.id; }).filter(function (id) { return vlmState.picked[id]; });
}

function vlmSetAddMode(mode) {
    vlmState.addMode = (mode === 'pick' && vlmState.pickLessonId) ? 'pick' : 'new';
    var pick = vlmState.addMode === 'pick';
    $('#vlmModeBar .vlm-view-btn').removeClass('active');
    $('#vlmModeBar .vlm-view-btn[data-mode="' + vlmState.addMode + '"]').addClass('active');
    $('#vlmPickWrap').toggleClass('vlm-hidden', !pick);
    $('#vlmNewWrap').toggleClass('vlm-hidden', pick);
    vlmUpdateSaveButton();
}

function vlmUpdateSaveButton() {
    if (vlmState.addMode === 'pick') {
        var n = vlmPickedIds().length;
        $('#vlmSaveVideoLbl').text(n ? 'Add ' + n + ' video' + (n === 1 ? '' : 's') + ' to the lesson' : 'Add to the lesson');
        $('#vlmSaveVideoBtn').prop('disabled', !n);
    } else {
        $('#vlmSaveVideoLbl').text('Save Video');
        $('#vlmSaveVideoBtn').prop('disabled', false);
    }
}

/* move the picked videos into the lesson one by one (each lands at its end); stops at the first refusal */
function vlmAddPickedVideos() {
    var ids = vlmPickedIds();
    var lessonId = vlmState.pickLessonId;
    if (!ids.length || !lessonId) { return; }
    $('#vlmSaveVideoBtn').prop('disabled', true);
    var moved = [];
    var chain = ids.reduce(function (p, id) {
        return p.then(function (ok) {
            if (!ok) { return false; }
            return vlmMutate('lesson/video/assign', { videoId: id, lessonId: lessonId }, null, true).then(function (r) {
                if (r) { moved.push(id); }
                return !!r;
            });
        });
    }, Promise.resolve(true));
    chain.then(function (ok) {
        var done = moved.length;
        if (done) {
            showMessageTheme2(1, done + ' video' + (done === 1 ? '' : 's') + ' added to the lesson.');
            vlmAfterPlaylistChange();
        }
        if (ok) {
            $('#vlmModal').modal('hide');
            return;
        }
        // the refusal's message is shown; the modal stays open with only what is still to add
        vlmState.pickItems = vlmState.pickItems.filter(function (it) { return moved.indexOf(it.v.id) < 0; });
        moved.forEach(function (id) { delete vlmState.picked[id]; });
        $('#vlmPickCount').text(vlmState.pickItems.length);
        vlmRenderPickList();
        vlmUpdateSaveButton();
    });
}

function vlmShowPickers() {
    $('#vlmContextBox').addClass('vlm-hidden');
    $('#vlmPickers').removeClass('vlm-hidden');
}

/* pick a course in #vlmSubject: by id when listed, else by title (the list keeps one provider id per course) */
function vlmPickCourse(subjectId, title) {
    if (subjectId && $('#vlmSubject option[value="' + subjectId + '"]').length) {
        $('#vlmSubject').val(String(subjectId)).trigger('change');
        return;
    }
    var s = vlmFindSubject(subjectId);
    vlmSetSubjectByTitle(s ? s.subjectName : title);
}

function vlmOpenEditModal(id) {
    var v = vlmFindAnyVideo(id);
    if (!v) { return; }
    vlmState.editingId = id;
    vlmState.autoTitle = '';
    $('#vlmModalTitle').text('Edit Video');
    $('#vlmEditId').val(id);
    $('#vlmTitle').val(v.title || '');
    $('#vlmDescription').val(v.description || '');
    $('#vlmStatus').val(v.status || 'ACTIVE');
    // set grades first (this filters + populates the Subject dropdown), then pick the subject by title.
    // fall back to the video's standardId for older rows saved before multi-grade existed.
    var gradeVals = (v.gradeIds && v.gradeIds.length) ? v.gradeIds : (v.standardId ? [v.standardId] : []);
    try { $('#vlmGrades').val(gradeVals.map(String)).trigger('change'); } catch (e) {}
    vlmFilterSubjectsByGrade();
    // picking the subject loads its lessons; pre-select the video's current lesson then
    vlmState.pendingLessonId = v.lessonId || 0;
    vlmSetSubjectByTitle(v.subjectName);
    var src = (v.videoType === 'FILE') ? 'FILE' : 'URL';
    $('input[name="vlmSource"][value="' + src + '"]').prop('checked', true);
    vlmResetUpload(false);
    if (src === 'FILE') {
        $('#vlmFileUrl').val(v.videoUrl || '');
        $('#vlmVideoUrl').val('');
        if (v.videoUrl) {
            $('#vlmUploadStatus').removeClass('text-danger').addClass('text-success')
                .html('<i class="fa fa-check-circle"></i> Current video kept — choose a file to replace');
        }
    } else {
        $('#vlmVideoUrl').val(v.videoUrl || '');
        $('#vlmFileUrl').val('');
    }
    vlmToggleSource(src);
    vlmRenderUrlPreview();
    // custom thumbnail: show it if this video has one stored
    if (v.thumbnailUrl) {
        $('#vlmUseThumb').prop('checked', true);
        vlmToggleThumb();
        $('#vlmThumbUrl').val(v.thumbnailUrl);
        $('#vlmThumbInner').addClass('vlm-hidden');
        $('#vlmThumbPreview').removeClass('vlm-hidden').attr('src', v.thumbnailUrl);
        $('#vlmThumbStatus').removeClass('text-danger').addClass('text-success').html('<i class="fa fa-check-circle"></i> Current thumbnail kept — choose to replace');
    } else {
        $('#vlmUseThumb').prop('checked', false);
        vlmToggleThumb();
    }
    vlmShowPickers();
    vlmState.pickLessonId = 0;
    $('#vlmModeBar').addClass('vlm-hidden');
    vlmSetAddMode('new');
    $('#vlmModal').modal('show');
    vlmModalIntro();
}

function vlmModalIntro() {
    if (vlmState.gsapReady && window.gsap) {
        window.gsap.fromTo('#vlmModal .vlm-modal-content',
            { y: 24, opacity: 0.6 }, { y: 0, opacity: 1, duration: 0.35, ease: 'power2.out' });
    }
}

function vlmToggleSource(type) {
    vlmState.source = type;
    $('#vlmSrcYoutubeLbl').toggleClass('active', type === 'URL');
    $('#vlmSrcFileLbl').toggleClass('active', type === 'FILE');
    $('#vlmUrlWrap').toggleClass('vlm-hidden', type !== 'URL');
    $('#vlmFileWrap').toggleClass('vlm-hidden', type !== 'FILE');
}

function vlmRenderUrlPreview() {
    var id = vlmParseYoutubeId($('#vlmVideoUrl').val());
    if (id) {
        $('#vlmUrlPreview').html('<iframe src="https://www.youtube-nocookie.com/embed/' + id + '" allowfullscreen></iframe>');
    } else {
        $('#vlmUrlPreview').html('');
    }
}

function vlmResetUpload(keepUrl) {
    if (!keepUrl) { $('#vlmFileUrl').val(''); }
    try { document.getElementById('vlmFileInput').value = ''; } catch (e) {}
    $('#vlmUploadProgress').addClass('vlm-hidden');
    $('#vlmUploadBar').css('width', '0%');
    $('#vlmUploadStatus').removeClass('text-success text-danger').text('');
}

/* Multipart upload of the chosen video to AWS S3 via the backend. */
function vlmUploadFile() {
    var input = document.getElementById('vlmFileInput');
    if (!input || !input.files || !input.files.length) { return; }
    var file = input.files[0];
    if (file.size > 100 * 1024 * 1024) {
        showMessageTheme2(0, 'Video is larger than 100MB. Please choose a smaller file.');
        vlmResetUpload(false);
        return;
    }
    var fd = new FormData();
    fd.append('file', file);
    fd.append('schoolId', SCHOOL_ID);
    fd.append('userId', USER_ID);

    $('#vlmUploadProgress').removeClass('vlm-hidden');
    $('#vlmUploadBar').css('width', '0%');
    $('#vlmUploadStatus').removeClass('text-success text-danger').text('Uploading ' + vlmEsc(file.name) + ' ...');
    $('#vlmFileUrl').val('');

    $.ajax({
        url: vlmApiBase() + 'upload',
        type: 'POST',
        data: fd,
        processData: false,
        contentType: false,       // multipart; global beforeSend only wraps JSON, but still adds UNIQUEUUID header
        global: true,
        xhr: function () {
            var xhr = $.ajaxSettings.xhr();
            if (xhr.upload) {
                xhr.upload.addEventListener('progress', function (e) {
                    if (e.lengthComputable) {
                        var pct = Math.round((e.loaded / e.total) * 100);
                        $('#vlmUploadBar').css('width', pct + '%');
                    }
                });
            }
            return xhr;
        },
        success: function (resp) {
            if (vlmIsSuccess(resp) && resp.details && resp.details.videoUrl) {
                $('#vlmFileUrl').val(resp.details.videoUrl);
                $('#vlmUploadBar').css('width', '100%');
                $('#vlmUploadStatus').removeClass('text-danger').addClass('text-success').html('<i class="fa fa-check-circle"></i> Uploaded successfully');
            } else {
                $('#vlmUploadStatus').removeClass('text-success').addClass('text-danger')
                    .text((resp && resp.message) ? resp.message : 'Upload failed. Please try again.');
            }
        },
        error: function () {
            $('#vlmUploadStatus').removeClass('text-success').addClass('text-danger').text('Upload failed. Please try again.');
        }
    });
}

/* ---- custom thumbnail ---- */
function vlmToggleThumb() {
    var on = $('#vlmUseThumb').is(':checked');
    $('#vlmThumbWrap').toggleClass('vlm-hidden', !on);
    if (!on) { vlmResetThumb(); }
}

function vlmResetThumb() {
    $('#vlmThumbUrl').val('');
    try { document.getElementById('vlmThumbInput').value = ''; } catch (e) {}
    $('#vlmThumbPreview').addClass('vlm-hidden').attr('src', '');
    $('#vlmThumbInner').removeClass('vlm-hidden');
    $('#vlmThumbProgress').addClass('vlm-hidden');
    $('#vlmThumbBar').css('width', '0%');
    $('#vlmThumbStatus').removeClass('text-success text-danger').text('');
}

function vlmUploadThumb() {
    var input = document.getElementById('vlmThumbInput');
    if (!input || !input.files || !input.files.length) { return; }
    var file = input.files[0];
    if (!/^image\//.test(file.type)) { showMessageTheme2(0, 'Please choose an image file.'); vlmResetThumb(); return; }
    if (file.size > 5 * 1024 * 1024) { showMessageTheme2(0, 'Image is larger than 5MB.'); vlmResetThumb(); return; }

    var fd = new FormData();
    fd.append('file', file);
    fd.append('schoolId', SCHOOL_ID);
    fd.append('userId', USER_ID);

    $('#vlmThumbProgress').removeClass('vlm-hidden');
    $('#vlmThumbBar').css('width', '0%');
    $('#vlmThumbStatus').removeClass('text-success text-danger').text('Uploading...');
    $('#vlmThumbUrl').val('');

    $.ajax({
        url: vlmApiBase() + 'thumbnail',
        type: 'POST',
        data: fd,
        processData: false,
        contentType: false,
        global: true,
        xhr: function () {
            var xhr = $.ajaxSettings.xhr();
            if (xhr.upload) {
                xhr.upload.addEventListener('progress', function (e) {
                    if (e.lengthComputable) { $('#vlmThumbBar').css('width', Math.round(e.loaded / e.total * 100) + '%'); }
                });
            }
            return xhr;
        },
        success: function (resp) {
            if (vlmIsSuccess(resp) && resp.details && resp.details.thumbnailUrl) {
                $('#vlmThumbUrl').val(resp.details.thumbnailUrl);
                $('#vlmThumbBar').css('width', '100%');
                $('#vlmThumbInner').addClass('vlm-hidden');
                $('#vlmThumbPreview').removeClass('vlm-hidden').attr('src', resp.details.thumbnailUrl);
                $('#vlmThumbStatus').removeClass('text-danger').addClass('text-success').html('<i class="fa fa-check-circle"></i> Uploaded');
            } else {
                $('#vlmThumbStatus').removeClass('text-success').addClass('text-danger').text((resp && resp.message) ? resp.message : 'Upload failed.');
            }
        },
        error: function () {
            $('#vlmThumbStatus').removeClass('text-success').addClass('text-danger').text('Upload failed. Please try again.');
        }
    });
}

function vlmSaveVideo() {
    if (vlmState.addMode === 'pick') { vlmAddPickedVideos(); return; }
    var type = $('input[name="vlmSource"]:checked').val() || 'URL';
    var title = ($('#vlmTitle').val() || '').trim();
    var subjectId = parseInt($('#vlmSubject').val() || '0', 10);
    var gradeIds = ($('#vlmGrades').val() || []).map(function (g) { return parseInt(g, 10); }).filter(Boolean);
    var videoUrl = (type === 'URL') ? ($('#vlmVideoUrl').val() || '').trim() : ($('#vlmFileUrl').val() || '').trim();
    var lessonVal = $('#vlmLesson').prop('disabled') ? '0' : ($('#vlmLesson').val() || '0');

    if (!title) { showMessageTheme2(0, 'Please enter a title.'); return; }
    if (!subjectId) { showMessageTheme2(0, 'Please select a course.'); return; }
    if (!gradeIds.length) { showMessageTheme2(0, 'Please select at least one grade.'); return; }
    if (!videoUrl) { showMessageTheme2(0, type === 'URL' ? 'Please enter a YouTube link.' : 'Please enter the video URL.'); return; }
    if (type === 'URL' && !vlmParseYoutubeId(videoUrl)) { showMessageTheme2(0, 'That does not look like a valid YouTube link.'); return; }

    var newLesson = null;
    if (lessonVal === 'new') {
        newLesson = {
            subjectId: subjectId,
            moduleNo: parseInt($('#vlmNewModuleNo').val(), 10),
            lessonNo: parseInt($('#vlmNewLessonNo').val(), 10),
            title: ($('#vlmNewLessonTitle').val() || '').trim()
        };
        if (!(newLesson.moduleNo >= 1) || !(newLesson.lessonNo >= 1)) { showMessageTheme2(0, 'Please enter valid module and lesson numbers.'); return; }
        if (!newLesson.title) { showMessageTheme2(0, 'Please enter the new lesson title.'); return; }
    }

    var selSubject = vlmFindSubject(subjectId);
    var body = {
        id: parseInt($('#vlmEditId').val() || '0', 10),
        subjectId: subjectId,
        gradeIds: gradeIds,
        standardId: selSubject ? selSubject.standardId : null,
        title: title,
        description: ($('#vlmDescription').val() || '').trim(),
        videoType: type,
        videoUrl: videoUrl,
        thumbnailUrl: ($('#vlmUseThumb').is(':checked') ? ($('#vlmThumbUrl').val() || '').trim() : ''),
        status: $('#vlmStatus').val() || 'ACTIVE'
    };

    // a new lesson is created first; the video then goes into it
    var lessonStep = newLesson
        ? vlmMutate('lesson/save', newLesson).then(function (response) {
            if (!response || !response.details || !response.details.id) { return null; }
            vlmState.pendingLessonId = response.details.id;   // a failed video save keeps the lesson picked
            return response.details.id;
        })
        : Promise.resolve(parseInt(lessonVal, 10) || 0);

    lessonStep.then(function (lessonId) {
        if (lessonId === null) { return; }
        body.lessonId = lessonId;
        vlmPost('save', body).then(function (response) {
            if (vlmIsSuccess(response)) {
                vlmState.pendingLessonId = null;
                $('#vlmModal').modal('hide');
                showMessageTheme2(1, 'Video saved successfully.');
                vlmLoadVideos();
                vlmRefreshPlaylistViews();
            } else {
                showMessageTheme2(0, (response && response.message) ? response.message : 'Failed to save video.');
                if (newLesson) { vlmLoadLessons(); }
            }
        }, function () {
            showMessageTheme2(0, 'Failed to save video.');
            if (newLesson) { vlmLoadLessons(); }
        });
    });
}

/* ---- delete ---- */

/* generic confirm dialog (title, text, yes-button label, action on yes) */
function vlmConfirm(title, text, yesLabel, action) {
    $('#vlmConfirmTitle').text(title);
    $('#vlmConfirmText').text(text);
    $('#vlmConfirmDeleteBtn').text(yesLabel);
    vlmState.confirmAction = action;
    $('#vlmConfirmModal').modal('show');
}

function vlmAskDelete(id) {
    vlmState.deleteId = id;
    vlmConfirm('Remove this video?', 'Students will no longer see it. This can be re-added later.', 'Yes, remove', vlmDoDelete);
}

function vlmDoDelete() {
    var id = vlmState.deleteId;
    if (!id) { return; }
    customLoader(true);
    callCommonAjax({
        method: 'POST',
        url: vlmApiBase() + 'delete',
        body: { id: id, schoolId: SCHOOL_ID, userId: USER_ID },
        global: true,
        showMessage: false
    }).then(function (response) {
        customLoader(false);
        $('#vlmConfirmModal').modal('hide');
        if (vlmIsSuccess(response)) {
            showMessageTheme2(1, 'Video removed.');
            vlmLoadVideos();
            vlmRefreshPlaylistViews();
        } else {
            showMessageTheme2(0, (response && response.message) ? response.message : 'Failed to remove video.');
        }
    }).catch(function () {
        customLoader(false);
        $('#vlmConfirmModal').modal('hide');
        showMessageTheme2(0, 'Failed to remove video.');
    });
}

/* ---- player ---- */
function vlmPlayVideo(id) {
    var v = vlmFindAnyVideo(id);
    if (!v) { return; }
    $('#vlmPlayerTitle').text(v.title || 'Video');
    var html;
    if (v.videoType === 'FILE') {
        html = '<video src="' + vlmEsc(v.videoUrl) + '" controls autoplay></video>';
    } else {
        var ytId = v.youtubeId || vlmParseYoutubeId(v.videoUrl);
        html = ytId
            ? '<iframe src="https://www.youtube-nocookie.com/embed/' + ytId + '?autoplay=1&rel=0" allow="autoplay; fullscreen" allowfullscreen></iframe>'
            : '<div class="p-4 text-center text-danger">Unable to load this video.</div>';
    }
    $('#vlmPlayerFrame').html(html);
    $('#vlmPlayerModal').modal('show');
}

function vlmStopPlayer() {
    $('#vlmPlayerFrame').html('');
}

/* ---- course playlists ---- */

function vlmSwitchView(view) {
    vlmState.view = view;
    $('.vlm-view-btn').removeClass('active');
    $('.vlm-view-btn[data-view="' + view + '"]').addClass('active');
    $('#vlmVideosView').toggleClass('vlm-hidden', view !== 'videos');
    $('#vlmPlaylistsView').toggleClass('vlm-hidden', view !== 'playlists');
    if (view === 'playlists') {
        // coming back to the tab reopens the playlist that was open (it was kept in sync meanwhile)
        if (vlmState.openPlaylistId && vlmState.playlist) {
            $('#vlmPlListWrap').addClass('vlm-hidden');
            $('#vlmPlDetail').removeClass('vlm-hidden');
            vlmLoadPlaylistDetail(true);
        } else if (vlmState.playlist) {
            vlmOpenEmptyCourse(vlmState.playlist.playlist.subjectId);
        } else {
            vlmBackToPlaylists();
        }
    }
}

function vlmLoadPlaylists(silent) {
    return vlmPost('playlist/list', {}, !silent).then(function (response) {
        if (vlmIsSuccess(response)) {
            vlmState.playlists = response.details || [];
            vlmState.playlistsLoaded = true;
            vlmFillGradeFilter();
            vlmRenderPlaylists();
        } else if (!silent) {
            showMessageTheme2(0, (response && response.message) ? response.message : 'Failed to load playlists.');
        }
    }, function () {
        if (!silent) { showMessageTheme2(0, 'Failed to load playlists.'); }
    });
}

function vlmRenderPlaylists() {
    if (!vlmState.playlistsLoaded) {
        $('#vlmPlGrid').html('<div class="vlm-loading">Loading courses…</div>');
        return;
    }
    var q = vlmState.plSearch;
    var list = vlmCourseList().filter(function (p) {
        return !q || (p.title || '').toLowerCase().indexOf(q) !== -1 || (p.standardName || '').toLowerCase().indexOf(q) !== -1;
    });
    $('#vlmPlGrid').html((vlmState.grade ? '' : '<div class="vlm-pl-tip"><i class="fa fa-info-circle"></i> Showing courses that have videos. Pick a grade to see all of its courses.</div>')
        + renderPlaylistCards(list, vlmUnplacedByPlaylist()));
    if (vlmState.gsapReady && window.gsap) {
        window.gsap.from('#vlmPlGrid .vlm-pl-card', { y: 14, opacity: 0, duration: 0.4, stagger: 0.03, ease: 'power2.out' });
    }
}

/* the cards of the Courses tab: all grades = courses that have a playlist (grade order);
   one grade = every course of that grade (from /subjects), the ones without videos yet included */
function vlmCourseList() {
    var key = function (standardId, title) { return (standardId || '') + '|' + (title || '').trim().toLowerCase(); };
    var playlists = vlmState.playlists.slice().sort(function (a, b) { return vlmGradeRank(a) - vlmGradeRank(b); });
    if (!vlmState.grade) { return playlists; }
    var g = vlmState.grade;
    var byKey = {};
    playlists.forEach(function (p) {
        if (parseInt(p.standardId, 10) === g) { byKey[key(p.standardId, p.courseTitle || p.title)] = p; }
    });
    var list = [];
    var used = {};
    vlmState.subjects.forEach(function (s) {
        if (parseInt(s.standardId, 10) !== g) { return; }
        var k = key(s.standardId, s.subjectName);
        if (used[k]) { return; }
        used[k] = true;
        list.push(byKey[k] || { id: 0, subjectId: s.subjectId, standardId: s.standardId, standardName: s.standardName,
            title: s.subjectName, courseTitle: s.subjectName, lessonCount: 0, videoCount: 0, empty: true });
    });
    // a playlist whose course is no longer offered still shows (it may have videos)
    Object.keys(byKey).forEach(function (k) { if (!used[k]) { list.push(byKey[k]); } });
    return list;
}

/* open a course that has no playlist yet: an empty course page; the first lesson / video creates its playlist */
function vlmOpenEmptyCourse(subjectId) {
    var s = vlmFindSubject(subjectId);
    if (!s) { return; }
    vlmState.openPlaylistId = 0;
    vlmState.playlist = {
        playlist: { id: 0, subjectId: s.subjectId, standardId: s.standardId, standardName: s.standardName,
            title: s.subjectName, courseTitle: s.subjectName, lessonCount: 0, videoCount: 0 },
        lessons: [], otherVideos: []
    };
    $('#vlmPlListWrap').addClass('vlm-hidden');
    $('#vlmPlDetail').removeClass('vlm-hidden vlm-saving').html(renderPlaylistDetail(vlmState.playlist));
    vlmInitSortables();
}

/* after the first video / lesson of an empty course: open the playlist the server just created for it */
function vlmOpenCreatedPlaylist(playlistId) {
    var open = vlmState.playlist && vlmState.playlist.playlist;
    if (playlistId) { vlmState.openPlaylistId = playlistId; vlmLoadPlaylistDetail(true); return; }
    vlmLoadPlaylists(true).then(function () {
        if (!open || vlmState.openPlaylistId || !vlmState.playlist) { return; }   // user moved on meanwhile
        var t = (open.courseTitle || '').trim().toLowerCase();
        var p = vlmState.playlists.filter(function (x) {
            return parseInt(x.standardId, 10) === parseInt(open.standardId, 10) && (x.courseTitle || x.title || '').trim().toLowerCase() === t;
        })[0];
        if (p) { vlmState.openPlaylistId = p.id; vlmLoadPlaylistDetail(true); }
    });
}

/* {playlistId: number of its videos not in a lesson} from the loaded videos list */
function vlmUnplacedByPlaylist() {
    var map = {};
    vlmState.videos.forEach(function (v) {
        if (v.playlistId && !v.lessonId) { map[v.playlistId] = (map[v.playlistId] || 0) + 1; }
    });
    return map;
}

function vlmOpenPlaylist(id) {
    vlmState.openPlaylistId = id;
    vlmLoadPlaylistDetail(false);
}

function vlmLoadPlaylistDetail(silent) {
    var id = vlmState.openPlaylistId;
    if (!id) { return; }
    vlmPost('playlist/detail', { playlistId: id }, !silent).then(function (response) {
        if (id !== vlmState.openPlaylistId) { return; }   // user went back / opened another meanwhile
        if (vlmIsSuccess(response) && response.details) {
            vlmState.playlist = response.details;
            $('#vlmPlListWrap').addClass('vlm-hidden');
            $('#vlmPlDetail').removeClass('vlm-hidden vlm-saving').html(renderPlaylistDetail(response.details));
            vlmInitSortables();
            if (!silent && vlmState.gsapReady && window.gsap) {
                window.gsap.from('#vlmPlDetail .vlm-ls', { y: 12, opacity: 0, duration: 0.35, stagger: 0.025, ease: 'power2.out' });
            }
        } else {
            showMessageTheme2(0, (response && response.message) ? response.message : 'Failed to load the playlist.');
        }
    }, function () {
        showMessageTheme2(0, 'Failed to load the playlist.');
    });
}

function vlmBackToPlaylists() {
    vlmState.openPlaylistId = 0;
    vlmState.playlist = null;
    vlmDestroySortables();
    $('#vlmPlDetail').addClass('vlm-hidden').html('');
    $('#vlmPlListWrap').removeClass('vlm-hidden');
    vlmRenderPlaylists();
    vlmLoadPlaylists(vlmState.playlistsLoaded);   // refresh counts; show the loader only the first time
}

/* after a change made from the playlist view: re-read the playlist + the videos grid quietly */
function vlmAfterPlaylistChange() {
    vlmLoadPlaylistDetail(true);
    vlmLoadVideos(true);
}

/* after a video save / delete: keep whichever playlist screen is open in sync */
function vlmRefreshPlaylistViews() {
    if (vlmState.openPlaylistId) {
        vlmLoadPlaylistDetail(true);
    } else if (vlmState.playlist) {
        vlmOpenCreatedPlaylist(0);   // an empty course just got its first video
    } else if (vlmState.view === 'playlists') {
        vlmLoadPlaylists(true);
    }
}

function vlmFindPlaylistLesson(lessonId) {
    var lessons = (vlmState.playlist && vlmState.playlist.lessons) || [];
    for (var i = 0; i < lessons.length; i++) {
        if (lessons[i].id === lessonId) { return lessons[i]; }
    }
    return null;
}

/* lessonId 0 = new lesson; moduleNo (optional) = add it at the end of that module */
function vlmOpenLessonModal(lessonId, moduleNo) {
    var l = lessonId ? vlmFindPlaylistLesson(lessonId) : null;
    $('#vlmLessonModalTitle').text(l ? 'Edit lesson' : 'Add lesson');
    $('#vlmLessonEditId').val(l ? l.id : 0);
    if (l) {
        $('#vlmLmModuleNo').val(l.moduleNo);
        $('#vlmLmModuleTitle').val(l.moduleTitle || '');
        $('#vlmLmLessonNo').val(l.lessonNo);
        $('#vlmLmTitle').val(l.title || '');
    } else {
        var lessons = (vlmState.playlist && vlmState.playlist.lessons) || [];
        var next = vlmSuggestNextLesson(lessons);
        if (moduleNo) {
            var inModule = lessons.filter(function (x) { return x.moduleNo === moduleNo; });
            next = { moduleNo: moduleNo, lessonNo: inModule.reduce(function (m, x) { return Math.max(m, x.lessonNo || 0); }, 0) + 1 };
        }
        var sameModule = lessons.filter(function (x) { return x.moduleNo === next.moduleNo && x.moduleTitle; });
        $('#vlmLmModuleNo').val(next.moduleNo);
        $('#vlmLmModuleTitle').val(sameModule.length ? sameModule[0].moduleTitle : '');
        $('#vlmLmLessonNo').val(next.lessonNo);
        $('#vlmLmTitle').val('');
    }
    $('#vlmLessonModal').modal('show');
    setTimeout(function () { $('#vlmLmTitle').trigger('focus'); }, 300);
}

function vlmSaveLesson() {
    var lessonId = parseInt($('#vlmLessonEditId').val() || '0', 10);
    var body = {
        moduleNo: parseInt($('#vlmLmModuleNo').val(), 10),
        moduleTitle: ($('#vlmLmModuleTitle').val() || '').trim(),
        lessonNo: parseInt($('#vlmLmLessonNo').val(), 10),
        title: ($('#vlmLmTitle').val() || '').trim()
    };
    if (!(body.moduleNo >= 1) || !(body.lessonNo >= 1)) { showMessageTheme2(0, 'Please enter valid module and lesson numbers.'); return; }
    if (!body.title) { showMessageTheme2(0, 'Please enter the lesson title.'); return; }
    if (lessonId) {
        body.lessonId = lessonId;
    } else if (vlmState.openPlaylistId) {
        body.playlistId = vlmState.openPlaylistId;
    } else {
        body.subjectId = vlmState.playlist.playlist.subjectId;   // empty course: the server creates its playlist
    }
    vlmMutate('lesson/save', body, 'Lesson saved.').then(function (response) {
        if (response) {
            $('#vlmLessonModal').modal('hide');
            if (!vlmState.openPlaylistId) {
                vlmOpenCreatedPlaylist(response.details && response.details.playlistId);
                vlmLoadPlaylists(true);
                return;
            }
            vlmAfterPlaylistChange();
        }
    });
}

function vlmAskDeleteLesson(lessonId) {
    var l = vlmFindPlaylistLesson(lessonId);
    vlmConfirm('Delete this lesson?',
        (l ? '"' + l.title + '" will be removed. ' : '') + 'Its videos stay in the course playlist under "Other videos".',
        'Yes, delete', function () {
            vlmMutate('lesson/delete', { lessonId: lessonId }, 'Lesson deleted.').then(function (response) {
                if (response) { vlmAfterPlaylistChange(); }
            });
        });
}

/* ---- drag & drop (SortableJS, loaded on demand like GSAP) ---- */
function vlmLoadSortable() {
    if (window.Sortable) { return Promise.resolve(); }
    if (!vlmState.sortableLoading) {
        vlmState.sortableLoading = new Promise(function (resolve, reject) {
            var s = document.createElement('script');
            s.src = VLM_SORTABLE_SRC;
            s.onload = resolve;
            s.onerror = function () { vlmState.sortableLoading = null; reject(); };
            document.head.appendChild(s);
        });
    }
    return vlmState.sortableLoading;
}

function vlmDestroySortables() {
    vlmState.sortables.forEach(function (x) { try { x.destroy(); } catch (e) { /* already gone */ } });
    vlmState.sortables = [];
}

/* lessons drag inside their module block; videos drag inside / across lessons and the "not in a lesson" tray */
function vlmInitSortables() {
    vlmDestroySortables();
    var $detail = $('#vlmPlDetail');
    if (!window.Sortable) {
        $detail.addClass('vlm-no-drag');   // handles appear once the script is in
        vlmLoadSortable().then(function () { if (vlmState.playlist) { vlmInitSortables(); } }, function () { /* menu only */ });
        return;
    }
    $detail.removeClass('vlm-no-drag');
    var common = { animation: 150, ghostClass: 'vlm-drag-ghost', chosenClass: 'vlm-drag-chosen' };
    $detail.find('.vlm-pd-block').each(function () {
        vlmState.sortables.push(window.Sortable.create(this, $.extend({}, common,
            { handle: '.vlm-ls-handle', draggable: '.vlm-ls', onEnd: vlmOnLessonDrop })));
    });
    $detail.find('.vlm-ls-videos').each(function () {
        vlmState.sortables.push(window.Sortable.create(this, $.extend({}, common,
            { group: 'vlm-videos', handle: '.vlm-vr-handle', draggable: '.vlm-vr', onEnd: vlmOnVideoDrop })));
    });
}

function vlmOnLessonDrop(evt) {
    if (evt.oldIndex === evt.newIndex) { return; }
    var ids = $('#vlmPlDetail .vlm-ls[data-id]').map(function () { return parseInt(this.getAttribute('data-id'), 10); }).get();
    vlmSaveArrangement('lesson/reorder', { playlistId: vlmState.openPlaylistId, orderedIds: ids });
}

function vlmOnVideoDrop(evt) {
    var from = parseInt(evt.from.getAttribute('data-lesson-id'), 10) || 0;
    var to = parseInt(evt.to.getAttribute('data-lesson-id'), 10) || 0;
    var videoId = parseInt(evt.item.getAttribute('data-id'), 10);
    if (from === to && evt.oldIndex === evt.newIndex) { return; }
    if (from === to && !to) { vlmLoadPlaylistDetail(true); return; }   // the tray has no order of its own
    var ids = $(evt.to).children('.vlm-vr').map(function () { return parseInt(this.getAttribute('data-id'), 10); }).get();
    if (from === to) {
        vlmSaveArrangement('lesson/video/reorder', { lessonId: to, orderedIds: ids });
    } else {
        vlmSaveArrangement('lesson/video/assign', { videoId: videoId, lessonId: to, orderedIds: to ? ids : null });
    }
}

/* save a drag result quietly; on failure the playlist is re-read so the screen shows the saved order again */
function vlmSaveArrangement(path, body, okMessage) {
    $('#vlmPlDetail').addClass('vlm-saving');
    return vlmMutate(path, body, okMessage, true).then(function (response) {
        if (response) { vlmAfterPlaylistChange(); } else { vlmLoadPlaylistDetail(true); }
        return response;
    });
}

/* the "⋯" select of a video row */
function vlmVideoAction(select, videoId, lessonId) {
    var value = select.value;
    select.value = '';
    if (value === 'first') {
        vlmSetPrimary(lessonId, videoId);
    } else if (value === 'edit') {
        vlmOpenEditModal(videoId);
    } else if (value === 'delete') {
        vlmAskDelete(videoId);
    } else if (value.indexOf('move:') === 0) {
        vlmAssignVideo(videoId, value.substring(5));
    }
}

/* make a video the lesson's first (= primary) one */
function vlmSetPrimary(lessonId, videoId) {
    vlmSaveArrangement('lesson/video/primary', { lessonId: lessonId, videoId: videoId });
}

/* move a video into another lesson of its course (at its end; "0" = out of any lesson) */
function vlmAssignVideo(videoId, value) {
    if (value === '' || value === null || value === undefined) { return; }
    vlmSaveArrangement('lesson/video/assign', { videoId: videoId, lessonId: parseInt(value, 10) || 0 }, 'Video moved.');
}

/* ---- helpers ---- */
function vlmFindVideo(id) {
    id = parseInt(id, 10);
    for (var i = 0; i < vlmState.videos.length; i++) {
        if (parseInt(vlmState.videos[i].id, 10) === id) { return vlmState.videos[i]; }
    }
    return null;
}

/* the videos grid and the open playlist may represent one upload by different provider rows */
function vlmFindAnyVideo(id) {
    var v = vlmFindVideo(id);
    if (v || !vlmState.playlist) { return v; }
    id = parseInt(id, 10);
    var pools = (vlmState.playlist.lessons || []).map(function (l) { return l.videos || []; });
    pools.push(vlmState.playlist.otherVideos || []);
    for (var p = 0; p < pools.length; p++) {
        for (var i = 0; i < pools[p].length; i++) {
            if (parseInt(pools[p][i].id, 10) === id) { return pools[p][i]; }
        }
    }
    return null;
}

function vlmFindSubject(id) {
    id = parseInt(id, 10);
    for (var i = 0; i < vlmState.subjects.length; i++) {
        if (parseInt(vlmState.subjects[i].subjectId, 10) === id) { return vlmState.subjects[i]; }
    }
    return null;
}

/* "M1 · L3 · Making Connections" for a video / lesson-like object */
function vlmLessonLabel(o) {
    if (!o || !o.lessonNo) { return ''; }
    return 'M' + (o.moduleNo || 1) + ' · L' + o.lessonNo + (o.lessonTitle ? ' · ' + o.lessonTitle : '');
}

function vlmThumbUrl(v) {
    if (v.thumbnailUrl) { return v.thumbnailUrl; }
    var ytId = v.youtubeId || vlmParseYoutubeId(v.videoUrl);
    if (ytId) { return 'https://img.youtube.com/vi/' + ytId + '/hqdefault.jpg'; }
    return vlmFallbackThumb();
}

function vlmFallbackThumb() {
    var pc = (getComputedStyle(document.documentElement).getPropertyValue('--pc') || '').trim() || '#007fff';
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180"><rect width="100%" height="100%" fill="#1b2030"/><text x="50%" y="52%" fill="' + pc + '" font-family="sans-serif" font-size="20" text-anchor="middle">VIDEO</text></svg>');
}

function vlmParseYoutubeId(url) {
    if (!url) { return null; }
    var m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|v\/)|youtu\.be\/)([\w-]{11})/);
    if (m) { return m[1]; }
    if (/^[\w-]{11}$/.test(url.trim())) { return url.trim(); }
    return null;
}

function vlmEsc(s) {
    if (s === null || s === undefined) { return ''; }
    return String(s).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
}
