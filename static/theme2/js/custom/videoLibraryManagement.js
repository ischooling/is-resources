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
    activeSubject: 0,
    search: '',
    editingId: 0,
    deleteId: 0,
    source: 'URL',
    gsapReady: false
};

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

function videoLibraryManagementOnLoad() {
    // append modals once
    if ($('#vlmModal').length === 0) {
        $('body').append(getVideoLibraryModalHtml());
        $('body').append(getVideoLibraryPlayerModalHtml());
        $('body').append(getVideoLibraryConfirmModalHtml());
        $('#vlmConfirmDeleteBtn').on('click', vlmDoDelete);
        $('#vlmPlayerModal').on('hidden.bs.modal', vlmStopPlayer);
        $('#vlmVideoUrl').on('input', vlmRenderUrlPreview);
        // when a subject is picked, show its already-uploaded videos (delegated: #vlmSubject is re-rendered)
        $('#vlmModal').on('change', '#vlmSubject', vlmShowSubjectVideos);
    }
    vlmState.activeSubject = 0;
    vlmState.search = '';
    vlmLoadGsap();
    vlmLoadGrades();
    vlmLoadSubjects().then(function () {
        vlmLoadVideos();
    });
    $('#vlmSearch').off('input').on('input', function () {
        vlmState.search = (this.value || '').trim().toLowerCase();
        vlmRender();
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
        window.gsap.from('.vlm-scope .vlm-stats.vlm-reveal, .vlm-scope .vlm-toolbar.vlm-reveal', { y: 18, opacity: 0, duration: 0.5, delay: 0.12, stagger: 0.09, ease: 'power3.out' });
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

/* ---- list (load all once, filter client-side via chips + search) ---- */
function vlmLoadVideos() {
    customLoader(true);
    callCommonAjax({
        method: 'POST',
        url: vlmApiBase() + 'list',
        body: { schoolId: SCHOOL_ID, userId: USER_ID },
        global: true,
        showMessage: false
    }).then(function (response) {
        customLoader(false);
        if (vlmIsSuccess(response)) {
            vlmState.videos = response.details || [];
            $('#vlmStats').html(renderVideoLibraryStats(vlmState.videos));
            $('#vlmChips').html(renderVideoLibraryChips(vlmDeriveSubjects(), vlmSubjectCounts()));
            vlmRender();
        } else {
            showMessageTheme2(0, (response && response.message) ? response.message : 'Failed to load videos.');
        }
    }).catch(function () {
        customLoader(false);
        showMessageTheme2(0, 'Failed to load videos.');
    });
}

function vlmRender() {
    var filtered = vlmState.videos.filter(function (v) {
        var okSubject = (vlmState.activeSubject === 0) || (parseInt(v.subjectId, 10) === parseInt(vlmState.activeSubject, 10));
        var okSearch = !vlmState.search
            || (v.title && v.title.toLowerCase().indexOf(vlmState.search) !== -1)
            || (v.description && v.description.toLowerCase().indexOf(vlmState.search) !== -1);
        return okSubject && okSearch;
    });
    $('#vlmGrid').html(renderVideoLibraryCards(filtered));
    vlmAnimateCards();
}

function vlmDeriveSubjects() {
    var seen = {};
    var list = [];
    vlmState.videos.forEach(function (v) {
        if (v.subjectId && !seen[v.subjectId]) {
            seen[v.subjectId] = true;
            list.push({ subjectId: v.subjectId, subjectName: v.subjectName || 'Subject' });
        }
    });
    list.sort(function (a, b) { return (a.subjectName || '').localeCompare(b.subjectName || ''); });
    return list;
}

function vlmSubjectCounts() {
    var counts = {};
    vlmState.videos.forEach(function (v) {
        if (v.subjectId) { counts[v.subjectId] = (counts[v.subjectId] || 0) + 1; }
    });
    return counts;
}

function vlmAnimateCards() {
    if (vlmState.gsapReady && window.gsap) {
        window.gsap.to('.vlm-card', { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power2.out' });
    } else {
        $('.vlm-card').addClass('vlm-in');
    }
}

function vlmFilterChip(subjectId, el) {
    vlmState.activeSubject = subjectId;
    $('#vlmChips .vlm-chip').removeClass('active');
    if (el) { $(el).addClass('active'); }
    vlmRender();
}

/* ---- add / edit ---- */
function vlmOpenAddModal() {
    vlmState.editingId = 0;
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
    $('#vlmModal').modal('show');
    vlmModalIntro();
}

function vlmOpenEditModal(id) {
    var v = vlmFindVideo(id);
    if (!v) { return; }
    vlmState.editingId = id;
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
    var type = $('input[name="vlmSource"]:checked').val() || 'URL';
    var title = ($('#vlmTitle').val() || '').trim();
    var subjectId = parseInt($('#vlmSubject').val() || '0', 10);
    var gradeIds = ($('#vlmGrades').val() || []).map(function (g) { return parseInt(g, 10); }).filter(Boolean);
    var videoUrl = (type === 'URL') ? ($('#vlmVideoUrl').val() || '').trim() : ($('#vlmFileUrl').val() || '').trim();

    if (!title) { showMessageTheme2(0, 'Please enter a title.'); return; }
    if (!subjectId) { showMessageTheme2(0, 'Please select a course.'); return; }
    if (!gradeIds.length) { showMessageTheme2(0, 'Please select at least one grade.'); return; }
    if (!videoUrl) { showMessageTheme2(0, type === 'URL' ? 'Please enter a YouTube link.' : 'Please enter the video URL.'); return; }
    if (type === 'URL' && !vlmParseYoutubeId(videoUrl)) { showMessageTheme2(0, 'That does not look like a valid YouTube link.'); return; }

    var selSubject = vlmFindSubject(subjectId);
    var body = {
        id: parseInt($('#vlmEditId').val() || '0', 10),
        schoolId: SCHOOL_ID,
        userId: USER_ID,
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

    customLoader(true);
    callCommonAjax({
        method: 'POST',
        url: vlmApiBase() + 'save',
        body: body,
        global: true,
        showMessage: false
    }).then(function (response) {
        customLoader(false);
        if (vlmIsSuccess(response)) {
            $('#vlmModal').modal('hide');
            showMessageTheme2(1, 'Video saved successfully.');
            vlmLoadVideos();
        } else {
            showMessageTheme2(0, (response && response.message) ? response.message : 'Failed to save video.');
        }
    }).catch(function () {
        customLoader(false);
        showMessageTheme2(0, 'Failed to save video.');
    });
}

/* ---- delete ---- */
function vlmAskDelete(id) {
    vlmState.deleteId = id;
    $('#vlmConfirmModal').modal('show');
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
    var v = vlmFindVideo(id);
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

/* ---- helpers ---- */
function vlmFindVideo(id) {
    id = parseInt(id, 10);
    for (var i = 0; i < vlmState.videos.length; i++) {
        if (parseInt(vlmState.videos[i].id, 10) === id) { return vlmState.videos[i]; }
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
