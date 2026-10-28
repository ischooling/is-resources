/* =====================================================================
 * Video Library — Admin (Videos Management) : HTML template builders
 * Paired logic file: videoLibraryManagement.js
 * Rendered into #dashboardContentInHTML by initVideoLibraryManagement().
 * ===================================================================== */

function getVideoLibraryManagementPageContent(title) {
    return `
    <div class="custom-field-scope vlm-scope">
        <div class="vlm-header">
            <div class="vlm-header-left">
                <div class="vlm-title-icon vlm-reveal"><i class="fa fa-video-camera"></i></div>
                <div>
                    <div class="vlm-title vlm-reveal">${title}</div>
                    <div class="vlm-summary vlm-reveal" id="vlmSummary">Loading…</div>
                </div>
            </div>
            <button type="button" class="btn vlm-add-btn vlm-reveal" onclick="vlmOpenAddFromHeader()">
                <i class="fa fa-plus mr-1"></i> Add Video
            </button>
        </div>

        <div class="vlm-viewbar vlm-reveal">
            <div class="vlm-views" role="tablist">
                <button type="button" class="vlm-view-btn active" data-view="playlists" onclick="vlmSwitchView('playlists')">
                    <i class="fa fa-list-ol"></i> Courses
                </button>
                <button type="button" class="vlm-view-btn" data-view="videos" onclick="vlmSwitchView('videos')">
                    <i class="fa fa-th-large"></i> All videos
                </button>
                <button type="button" class="vlm-view-btn" data-view="plans" onclick="vlmSwitchView('plans')">
                    <i class="fa fa-credit-card"></i> Plans &amp; Fees
                </button>
                <button type="button" class="vlm-view-btn" data-view="subscribers" onclick="vlmSwitchView('subscribers')">
                    <i class="fa fa-users"></i> Subscribers
                </button>
            </div>
            <div class="vlm-sort-box vlm-grade-box">
                <i class="fa fa-graduation-cap"></i>
                <select id="vlmGradeFilter" title="Filter by grade"><option value="0">All grades</option></select>
            </div>
        </div>

        <div id="vlmVideosView" class="vlm-hidden">
            <div class="vlm-toolbar vlm-reveal">
                <div class="vlm-chips" id="vlmChips"></div>
                <div class="vlm-sort-box">
                    <i class="fa fa-sort-amount-asc"></i>
                    <select id="vlmSort" title="Sort videos">
                        <option value="playlist">Playlist order</option>
                        <option value="newest">Newest first</option>
                        <option value="oldest">Oldest first</option>
                        <option value="title_az">Title A–Z</option>
                        <option value="title_za">Title Z–A</option>
                    </select>
                </div>
                <div class="vlm-search-box">
                    <i class="fa fa-search"></i>
                    <input type="text" id="vlmSearch" placeholder="Search videos..." />
                </div>
            </div>
            <div id="vlmGrid" class="vlm-grid"></div>
        </div>

        <div id="vlmPlaylistsView">
            <div id="vlmPlListWrap">
                <div class="vlm-toolbar">
                    <div class="vlm-search-box vlm-pl-search">
                        <i class="fa fa-search"></i>
                        <input type="text" id="vlmPlSearch" placeholder="Search courses..." />
                    </div>
                </div>
                <div id="vlmPlGrid"></div>
            </div>
            <div id="vlmPlDetail" class="vlm-hidden"></div>
        </div>

        <div id="vlmPlansView" class="vlm-hidden"></div>
        <div id="vlmSubsView" class="vlm-hidden"></div>
    </div>

    ${getVideoLibraryStyles()}
    `;
}

/* one summary line under the title: "75 videos · 22 courses · 3 not in a lesson" */
function renderVideoLibrarySummary(videos) {
    var subjects = {};
    videos.forEach(function (v) { if (v.subjectName) { subjects[(v.standardId || '') + '|' + v.subjectName] = true; } });
    var courses = Object.keys(subjects).length;
    var noLesson = videos.filter(function (v) { return !v.lessonId; }).length;
    var plural = function (n, word) { return '<b>' + n + '</b> ' + word + (n === 1 ? '' : 's'); };
    return plural(videos.length, 'video') + ' <span class="vlm-dot">·</span> ' + plural(courses, 'course')
        + (noLesson ? ' <span class="vlm-dot">·</span> <span class="vlm-summary-warn" title="Open a course and drag these videos into a lesson">'
            + '<b>' + noLesson + '</b> not in a lesson</span>' : '');
}

/* course filter chips (admin): one chip per course (grade + name); the grade is shown when a name repeats */
function renderVideoLibraryChips(courses, activeKey) {
    var chips = '<button class="vlm-chip' + (activeKey ? '' : ' active') + '" data-key="" onclick="vlmFilterChip(this)"><span class="vlm-chip-txt">All</span></button>';
    chips += courses.map(function (c) {
        var label = c.subjectName + (c.showGrade && c.gradeName ? ' · ' + c.gradeName : '');
        return '<button class="vlm-chip' + (c.key === activeKey ? ' active' : '') + '" title="' + vlmEsc(label) + '" data-key="' + vlmEsc(c.key) + '" onclick="vlmFilterChip(this)">'
            + '<span class="vlm-chip-txt">' + vlmEsc(label) + '</span><span class="vlm-chip-count">' + c.count + '</span></button>';
    }).join('');
    return chips;
}

/* Responsive card grid for the list */
function renderVideoLibraryCards(videos) {
    if (!videos || videos.length === 0) {
        return `
        <div class="vlm-empty">
            <div class="vlm-empty-icon"><i class="fa fa-film"></i></div>
            <div class="vlm-empty-title">No videos yet</div>
            <div class="vlm-empty-text">Click <strong>Add Video</strong> to add your first subject video.</div>
        </div>`;
    }
    var cards = videos.map(function (v) {
        var thumb = vlmThumbUrl(v);
        var badge = v.subjectName ? v.subjectName : 'Subject';
        var gradeText = v.gradeNames || v.standardName || '';
        var std = gradeText ? `<span class="vlm-card-std" title="${vlmEsc(gradeText)}">${vlmEsc(gradeText)}</span>` : '';
        var isActive = (v.status === 'ACTIVE');
        var isFile = (v.videoType === 'FILE');
        var lessonLine = v.lessonId
            ? `<div class="vlm-card-lesson" title="${vlmEsc(vlmLessonLabel(v))}">
                   ${v.primary ? '<i class="fa fa-star vlm-star" title="Primary video of this lesson"></i>' : '<i class="fa fa-list-ol"></i>'}
                   <span>${vlmEsc(vlmLessonLabel(v))}</span>
               </div>`
            : `<div class="vlm-card-lesson is-none"><i class="fa fa-list-ol"></i><span>No lesson yet</span></div>`;
        return `
        <div class="vlm-card" data-id="${v.id}">
            <div class="vlm-card-thumb" onclick="vlmPlayVideo(${v.id})">
                <img src="${thumb}" alt="thumb" onerror="this.src='${vlmFallbackThumb()}'"/>
                <div class="vlm-card-scrim"></div>
                <div class="vlm-play-overlay"><i class="fa fa-play"></i></div>
                <span class="vlm-card-type ${isFile ? 'is-file' : 'is-yt'}">
                    <i class="fa ${isFile ? 'fa-film' : 'fa-youtube-play'}"></i>${isFile ? 'Uploaded' : 'YouTube'}
                </span>
            </div>
            <div class="vlm-card-body">
                <div class="vlm-card-badges">
                    <span class="vlm-card-badge" title="${vlmEsc(badge)}">${vlmEsc(badge)}</span>${std}
                    ${isActive ? '' : '<span class="vlm-card-status is-inactive">Inactive</span>'}
                </div>
                <div class="vlm-card-title" title="${vlmEsc(v.title)}">${vlmEsc(v.title)}</div>
                <div class="vlm-card-foot">
                    ${lessonLine}
                    <button class="vlm-icon-circle vlm-edit" title="Edit" onclick="vlmOpenEditModal(${v.id})"><i class="fa fa-pencil"></i></button>
                    <button class="vlm-icon-circle vlm-del" title="Remove" onclick="vlmAskDelete(${v.id})"><i class="fa fa-trash"></i></button>
                </div>
            </div>
        </div>`;
    }).join('');
    return cards;
}

/* Add / Edit modal */
function getVideoLibraryModalHtml() {
    return `
    <div class="modal fade vlm-modal" id="vlmModal" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div class="modal-content vlm-modal-content">
          <div class="modal-header vlm-modal-header">
            <h5 class="modal-title" id="vlmModalTitle">Add Video</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span>&times;</span></button>
          </div>
          <div class="modal-body">
            <input type="hidden" id="vlmEditId" value="0"/>
            <!-- opened from a lesson: where the video goes, instead of the grade / course / lesson pickers -->
            <div class="vlm-context vlm-hidden" id="vlmContextBox">
                <div class="vlm-context-icon"><i class="fa fa-list-ol"></i></div>
                <div class="vlm-context-body">
                    <div class="vlm-context-lbl">Adding to</div>
                    <div class="vlm-context-course" id="vlmContextCourse"></div>
                    <div class="vlm-context-lesson" id="vlmContextLesson"></div>
                </div>
                <button type="button" class="vlm-context-change" onclick="vlmShowPickers()">Change</button>
            </div>
            <!-- adding to a lesson: a new video, or videos of this course that were uploaded already -->
            <div class="vlm-views vlm-mode-bar vlm-hidden" id="vlmModeBar">
                <button type="button" class="vlm-view-btn active" data-mode="new" onclick="vlmSetAddMode('new')"><i class="fa fa-plus"></i> New video</button>
                <button type="button" class="vlm-view-btn" data-mode="pick" onclick="vlmSetAddMode('pick')"><i class="fa fa-film"></i> Choose uploaded <span class="vlm-chip-count" id="vlmPickCount"></span></button>
            </div>
            <div class="vlm-hidden" id="vlmPickWrap">
                <div class="vlm-search-box vlm-pick-search"><i class="fa fa-search"></i><input type="text" id="vlmPickSearch" placeholder="Search this course's videos..."/></div>
                <div id="vlmPickList" class="vlm-pick-list"></div>
            </div>
            <div id="vlmNewWrap">
            <div id="vlmPickers">
                <!-- 1) Grade -->
                <div class="form-group">
                    <label class="vlm-label">Grade(s) <span class="text-danger">*</span></label>
                    <select id="vlmGrades" class="form-control" multiple></select>
                    <small class="text-muted">Choose grade(s) first — the course list is filtered to them.</small>
                </div>
                <!-- 2) Course -->
                <div class="form-group">
                    <label class="vlm-label">Course <span class="text-danger">*</span></label>
                    <select id="vlmSubject" class="form-control" disabled></select>
                    <small class="text-muted" id="vlmSubjectHint">Select grade(s) above to see courses.</small>
                </div>
                <!-- 2b) Lesson (decides the video's place in the course playlist) -->
                <div class="form-group">
                    <label class="vlm-label">Lesson <span class="vlm-label-note">— where this video sits in the course playlist</span></label>
                    <select id="vlmLesson" class="form-control" disabled>
                        <option value="0">Select a course first</option>
                    </select>
                    <small class="text-muted" id="vlmLessonHint">Pick the lesson this video teaches. Several teachers can add videos to the same lesson.</small>
                    <div class="vlm-new-lesson vlm-hidden" id="vlmNewLessonBox">
                        <div class="vlm-new-lesson-head"><i class="fa fa-plus-circle"></i> New lesson for this course</div>
                        <div class="form-row">
                            <div class="form-group col-4 col-md-2 mb-2">
                                <label class="vlm-label">Module no.</label>
                                <input type="number" id="vlmNewModuleNo" class="form-control" min="1" step="1" value="1"/>
                            </div>
                            <div class="form-group col-4 col-md-2 mb-2">
                                <label class="vlm-label">Lesson no.</label>
                                <input type="number" id="vlmNewLessonNo" class="form-control" min="1" step="1" value="1"/>
                            </div>
                            <div class="form-group col-12 col-md-8 mb-2">
                                <label class="vlm-label">Lesson title</label>
                                <input type="text" id="vlmNewLessonTitle" class="form-control" maxlength="200" placeholder="e.g. Cite Your Sources"/>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="form-group vlm-hidden" id="vlmSubjectVideosWrap">
                    <label class="vlm-label"><i class="fa fa-film mr-1"></i>Already uploaded for this course</label>
                    <div id="vlmSubjectVideos" class="vlm-sv-strip"></div>
                </div>
            </div>
            <!-- video: YouTube link or a file -->
            <div class="form-group">
                <label class="vlm-label">Video</label>
                <div class="vlm-source-toggle">
                    <label class="vlm-source-opt active" id="vlmSrcYoutubeLbl">
                        <input type="radio" name="vlmSource" value="URL" checked onchange="vlmToggleSource('URL')"/>
                        <i class="fa fa-youtube-play"></i> YouTube link
                    </label>
                    <label class="vlm-source-opt" id="vlmSrcFileLbl">
                        <input type="radio" name="vlmSource" value="FILE" onchange="vlmToggleSource('FILE')"/>
                        <i class="fa fa-desktop"></i> Upload a file
                    </label>
                </div>
            </div>
            <div class="form-group" id="vlmUrlWrap">
                <label class="vlm-label">YouTube Link <span class="text-danger">*</span></label>
                <input type="text" id="vlmVideoUrl" class="form-control" placeholder="https://www.youtube.com/watch?v=..."/>
                <small class="text-muted">Paste a YouTube watch / share / embed link.</small>
                <div id="vlmUrlPreview" class="vlm-url-preview"></div>
            </div>
            <div class="form-group vlm-hidden" id="vlmFileWrap">
                <label class="vlm-label">Choose a video from your computer <span class="text-danger">*</span></label>
                <div class="vlm-upload-box" id="vlmUploadBox" onclick="document.getElementById('vlmFileInput').click()">
                    <input type="file" id="vlmFileInput" accept="video/*" class="vlm-file-input" onchange="vlmUploadFile()"/>
                    <div class="vlm-upload-inner">
                        <i class="fa fa-cloud-upload"></i>
                        <div class="vlm-upload-text">Click to choose a video</div>
                        <div class="vlm-upload-hint">MP4, WebM, MOV, M4V, MKV — up to 100MB</div>
                    </div>
                </div>
                <input type="hidden" id="vlmFileUrl" value=""/>
                <div class="vlm-upload-progress vlm-hidden" id="vlmUploadProgress"><div class="vlm-upload-bar" id="vlmUploadBar"></div></div>
                <div class="vlm-upload-status" id="vlmUploadStatus"></div>
            </div>
            <!-- title + status -->
            <div class="form-row">
                <div class="form-group col-md-8">
                    <label class="vlm-label">Title <span class="text-danger">*</span></label>
                    <input type="text" id="vlmTitle" class="form-control" maxlength="250" placeholder="e.g. Introduction to Algebra"/>
                </div>
                <div class="form-group col-md-4">
                    <label class="vlm-label">Status</label>
                    <select id="vlmStatus" class="form-control">
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                    </select>
                </div>
            </div>
            <!-- overview -->
            <div class="form-group">
                <label class="vlm-label">Overview</label>
                <textarea id="vlmDescription" class="form-control" rows="2" maxlength="1000" placeholder="Short overview (optional)"></textarea>
            </div>
            <!-- custom thumbnail (optional) -->
            <div class="form-group">
                <label class="vlm-custom-thumb-toggle">
                    <input type="checkbox" id="vlmUseThumb" onchange="vlmToggleThumb()"/>
                    <span><i class="fa fa-image mr-1"></i>Add a custom thumbnail <span class="text-muted">(optional — else the video's own thumbnail is used)</span></span>
                </label>
                <div class="vlm-hidden" id="vlmThumbWrap">
                    <div class="vlm-thumb-box" id="vlmThumbBox" onclick="document.getElementById('vlmThumbInput').click()">
                        <input type="file" id="vlmThumbInput" accept="image/*" class="vlm-file-input" onchange="vlmUploadThumb()"/>
                        <div class="vlm-thumb-inner" id="vlmThumbInner">
                            <i class="fa fa-image"></i>
                            <div class="vlm-upload-text">Choose an image</div>
                            <div class="vlm-upload-hint">JPG, PNG, WebP — up to 5MB</div>
                        </div>
                        <img id="vlmThumbPreview" class="vlm-thumb-preview vlm-hidden" alt="thumbnail"/>
                    </div>
                    <input type="hidden" id="vlmThumbUrl" value=""/>
                    <div class="vlm-upload-progress vlm-hidden" id="vlmThumbProgress"><div class="vlm-upload-bar" id="vlmThumbBar"></div></div>
                    <div class="vlm-upload-status" id="vlmThumbStatus"></div>
                </div>
            </div>
            </div>
          </div>
          <div class="modal-footer vlm-modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-success vlm-save-btn" id="vlmSaveVideoBtn" onclick="vlmSaveVideo()">
                <i class="fa fa-check mr-1"></i> <span id="vlmSaveVideoLbl">Save Video</span>
            </button>
          </div>
        </div>
      </div>
    </div>`;
}

/* "Choose uploaded": videos of the course that can go into the lesson ({v, where}); picked = {id: true} */
function renderVideoPickList(items, picked) {
    if (!items.length) {
        return '<div class="vlm-pick-empty">No video matches.</div>';
    }
    return items.map(function (it) {
        var v = it.v;
        var on = picked[v.id] ? ' checked' : '';
        return `<label class="vlm-pick${on ? ' is-picked' : ''}">
            <input type="checkbox" value="${v.id}"${on} onchange="vlmTogglePick(${v.id}, this.checked)"/>
            <span class="vlm-pick-thumb" style="background-image:url('${vlmThumbUrl(v)}')"></span>
            <span class="vlm-pick-body">
                <span class="vlm-pick-title" title="${vlmEsc(v.title)}">${vlmEsc(v.title)}</span>
                <span class="vlm-pick-where ${it.lessonId ? '' : 'is-loose'}">${vlmEsc(it.where)}${v.status !== 'ACTIVE' ? ' · Inactive' : ''}</span>
            </span>
        </label>`;
    }).join('');
}

/* Player modal (embedded YouTube iframe / HTML5 video) */
function getVideoLibraryPlayerModalHtml() {
    return `
    <div class="modal fade vlm-player-modal" id="vlmPlayerModal" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div class="modal-content vlm-modal-content">
          <div class="modal-header vlm-modal-header">
            <h5 class="modal-title" id="vlmPlayerTitle">Video</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close" onclick="vlmStopPlayer()"><span>&times;</span></button>
          </div>
          <div class="modal-body p-0">
            <div class="vlm-player-frame" id="vlmPlayerFrame"></div>
          </div>
        </div>
      </div>
    </div>`;
}

/* Delete confirm modal */
function getVideoLibraryConfirmModalHtml() {
    return `
    <div class="modal fade vlm-confirm-modal" id="vlmConfirmModal" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered vlm-confirm-dialog" role="document">
        <div class="modal-content vlm-confirm-box">
          <div class="modal-body text-center px-4 py-4">
            <div class="vlm-confirm-icon"><i class="fa fa-exclamation-triangle"></i></div>
            <div class="vlm-confirm-title" id="vlmConfirmTitle">Remove this video?</div>
            <div class="vlm-confirm-text" id="vlmConfirmText">Students will no longer see it. This can be re-added later.</div>
            <div class="vlm-confirm-actions">
                <button type="button" class="btn vlm-confirm-cancel" data-dismiss="modal">Cancel</button>
                <button type="button" class="btn vlm-confirm-yes" id="vlmConfirmDeleteBtn">Yes, remove</button>
            </div>
          </div>
        </div>
      </div>
    </div>`;
}

/* ---------- course playlists ---------- */

/* course cards (one playlist per course); unplaced = {playlistId: videos not in a lesson} */
function renderPlaylistCards(playlists, unplaced) {
    if (!playlists || !playlists.length) {
        return `
        <div class="vlm-empty">
            <div class="vlm-empty-icon"><i class="fa fa-list-ol"></i></div>
            <div class="vlm-empty-title">No courses here yet</div>
            <div class="vlm-empty-text">Pick a grade to see all of its courses, or click <strong>Add Video</strong>.</div>
        </div>`;
    }
    var groups = [];
    playlists.forEach(function (p) {
        var g = p.standardName || 'Other';
        if (!groups.length || groups[groups.length - 1].grade !== g) { groups.push({ grade: g, list: [] }); }
        groups[groups.length - 1].list.push(p);
    });
    if (groups.length > 1) {
        return groups.map(function (g) {
            return '<div class="vlm-pl-group">' + vlmEsc(g.grade) + ' <span>' + g.list.length + '</span></div>' + renderPlaylistCards(g.list, unplaced);
        }).join('');
    }
    return '<div class="vlm-pl-grid">' + playlists.map(function (p) {
        var lessons = p.lessonCount || 0;
        var videos = p.videoCount || 0;
        var loose = (unplaced && unplaced[p.id]) || 0;
        var open = p.empty ? 'vlmOpenEmptyCourse(' + p.subjectId + ')' : 'vlmOpenPlaylist(' + p.id + ')';
        return `
        <div class="vlm-pl-card ${p.empty ? 'is-empty' : ''}" role="button" tabindex="0" data-id="${p.id}" onclick="${open}"
             onkeydown="if(event.key==='Enter'){${open}}">
            <div class="vlm-pl-top">
                <span class="vlm-pl-grade">${vlmEsc(p.standardName || 'Course')}</span>
                ${loose ? `<span class="vlm-pl-loose" title="Videos not placed in a lesson yet">${loose} to place</span>` : ''}
            </div>
            <div class="vlm-pl-title" title="${vlmEsc(p.title)}">${vlmEsc(p.title)}</div>
            <div class="vlm-pl-meta">
                ${p.empty ? '<span>No videos yet</span>' : `<span>${lessons} lesson${lessons === 1 ? '' : 's'}</span><span class="vlm-dot">·</span>
                <span>${videos} video${videos === 1 ? '' : 's'}</span>`}
                <i class="fa fa-angle-right vlm-pl-arrow"></i>
            </div>
        </div>`;
    }).join('') + '</div>';
}

/* one course: "not in a lesson" tray, then its lessons in order (grouped by module), each with its videos.
   Lessons drag inside their module block; videos drag inside / across lessons and the tray. */
function renderPlaylistDetail(d) {
    var p = d.playlist || {};
    var lessons = d.lessons || [];
    var other = d.otherVideos || [];

    var tray = other.length ? `
        <div class="vlm-tray">
            <div class="vlm-tray-head"><i class="fa fa-inbox"></i> Not in a lesson yet <span class="vlm-tray-count">${other.length}</span>
                <span class="vlm-tray-hint">— drag them into a lesson</span></div>
            <div class="vlm-ls-videos" data-lesson-id="0">${other.map(function (v) { return renderPlaylistVideoRow(v, 0, false, lessons); }).join('')}</div>
        </div>` : '';

    // consecutive lessons of one module form a block (a lesson is only dragged inside its own module)
    var blocks = [];
    lessons.forEach(function (l) {
        var last = blocks[blocks.length - 1];
        if (last && last.moduleNo === l.moduleNo) { last.lessons.push(l); }
        else { blocks.push({ moduleNo: l.moduleNo, moduleTitle: l.moduleTitle, lessons: [l] }); }
    });
    var body = blocks.map(function (b) {
        return `
        <div class="vlm-pd-module">
            <span>Module ${b.moduleNo}${b.moduleTitle ? ' <em>— ' + vlmEsc(b.moduleTitle) + '</em>' : ''}</span>
            <button type="button" class="vlm-link-btn" onclick="vlmOpenLessonModal(0, ${b.moduleNo})"><i class="fa fa-plus"></i> Lesson</button>
        </div>
        <div class="vlm-pd-block" data-module="${b.moduleNo}">${b.lessons.map(function (l) { return renderPlaylistLesson(l, lessons); }).join('')}</div>`;
    }).join('');
    if (!lessons.length) {
        body = `
        <div class="vlm-empty">
            <div class="vlm-empty-icon"><i class="fa fa-list-ol"></i></div>
            <div class="vlm-empty-title">No lessons yet</div>
            <div class="vlm-empty-text">${vlmState.readOnly ? 'This AP course has no videos.' : "Click <strong>Add lesson</strong> to build this course's playlist."}</div>
        </div>`;
    }

    return `
    <div class="vlm-pd-head">
        <button type="button" class="vlm-back-btn" onclick="vlmBackToPlaylists()" title="All courses"><i class="fa fa-arrow-left"></i></button>
        <div class="vlm-pd-titlewrap">
            <div class="vlm-pd-title" title="${vlmEsc(p.title)}">${vlmEsc(p.title)}</div>
            <div class="vlm-pd-sub">
                <span class="vlm-pl-grade">${vlmEsc(p.standardName || 'Course')}</span>
                ${p.lessonCount || 0} lessons · ${p.videoCount || 0} videos
            </div>
        </div>
        ${vlmState.readOnly ? '' : '<button type="button" class="btn vlm-ghost-btn" onclick="vlmOpenLessonModal(0)"><i class="fa fa-plus mr-1"></i> Add lesson</button>'}
    </div>
    ${vlmState.readOnly ? '<div class="vlm-pd-readonly"><i class="fa fa-eye"></i> AP courses are view-only. Videos cannot be added to them.</div>'
        : '<div class="vlm-pd-hint"><i class="fa fa-arrows"></i> Drag <i class="fa fa-bars"></i> to rearrange. The first video of a lesson (<i class="fa fa-star"></i>) is the one students get first.</div>'}
    ${tray}
    <div class="vlm-pd-lessons">${body}</div>`;
}

function renderPlaylistLesson(l, lessons) {
    var videos = l.videos || [];
    return `
    <div class="vlm-ls" data-id="${l.id}">
        <div class="vlm-ls-head">
            <span class="vlm-handle vlm-ls-handle" title="Drag to reorder the lesson"><i class="fa fa-bars"></i></span>
            <span class="vlm-ls-no">L${l.lessonNo}</span>
            <div class="vlm-ls-title" title="${vlmEsc(l.title)}">${vlmEsc(l.title)}</div>
            <div class="vlm-ls-actions">
                <button type="button" class="vlm-add-video-btn" title="Add a video to this lesson" onclick="vlmOpenAddToLesson(${l.id})"><i class="fa fa-plus"></i><span> Video</span></button>
                <button type="button" class="vlm-icon-circle vlm-plain" title="Edit lesson" onclick="vlmOpenLessonModal(${l.id})"><i class="fa fa-pencil"></i></button>
                <button type="button" class="vlm-icon-circle vlm-plain vlm-plain-del" title="Delete lesson" onclick="vlmAskDeleteLesson(${l.id})"><i class="fa fa-trash"></i></button>
            </div>
        </div>
        <div class="vlm-ls-videos" data-lesson-id="${l.id}">${videos.map(function (v, i) { return renderPlaylistVideoRow(v, l.id, i === 0, lessons); }).join('')}</div>
    </div>`;
}

/* one video of a lesson (lessonId 0 = the tray). "⋯" is a native select so it works with touch and keyboard. */
function renderPlaylistVideoRow(v, lessonId, isFirst, lessons) {
    var thumb = vlmThumbUrl(v);
    var tags = (lessonId && isFirst ? '<span class="vlm-tag-primary" title="Students get this video first"><i class="fa fa-star"></i> First</span>' : '')
        + (v.status !== 'ACTIVE' ? '<span class="vlm-tag-muted">Inactive</span>' : '');
    var moves = (lessons || []).filter(function (l) { return l.id !== lessonId; }).map(function (l) {
        return '<option value="move:' + l.id + '">' + vlmEsc(vlmLessonLabel({ moduleNo: l.moduleNo, lessonNo: l.lessonNo, lessonTitle: l.title })) + '</option>';
    }).join('');
    if (lessonId) { moves += '<option value="move:0">Not in a lesson</option>'; }
    return `<div class="vlm-vr" data-id="${v.id}">
        <span class="vlm-handle vlm-vr-handle" title="Drag to move"><i class="fa fa-bars"></i></span>
        <div class="vlm-vr-thumb" style="background-image:url('${thumb}')" onclick="vlmPlayVideo(${v.id})" title="Play"><i class="fa fa-play"></i></div>
        <div class="vlm-vr-body">
            <div class="vlm-vr-title" title="${vlmEsc(v.title)}">${vlmEsc(v.title)}</div>
            ${tags ? `<div class="vlm-vr-tags">${tags}</div>` : ''}
        </div>
        <select class="vlm-more" title="More" aria-label="More actions" onchange="vlmVideoAction(this, ${v.id}, ${lessonId})">
            <option value="" selected>⋯</option>
            ${lessonId && !isFirst ? '<option value="first">★ Make it first</option>' : ''}
            <option value="edit">Edit video</option>
            ${moves ? '<optgroup label="Move to">' + moves + '</optgroup>' : ''}
            <option value="delete">Delete video</option>
        </select>
    </div>`;
}

/* ---------- subscription: Plans & Fees ---------- */

/* priced plans in table order: code, column title, unit */
var VLM_PLAN_COLUMNS = [
    { code: 'THREE_COURSES', title: '3 courses', unit: 'per month', setting: 'planThreeCourses' },
    { code: 'CUSTOM', title: 'Custom', unit: 'per course / month', setting: 'planCustom' },
    { code: 'ALL', title: 'All courses', unit: 'per month', setting: 'planAll' },
    { code: 'LIFETIME', title: 'Full course', unit: 'one-time, till course end', setting: 'planLifetime' }
];

/* p = { settings (form values), fees {"grade|PLAN": "12.00"}, grades [{gradeId, gradeName}], dirtySettings, dirtyFees, anyFee } */
function renderPlansView(p) {
    var s = p.settings || {};
    var toggle = function (key, label, sub) {
        return `<label class="vlm-switch">
            <input type="checkbox" data-setting="${key}" ${s[key] ? 'checked' : ''} onchange="vlmPlanSettingChanged(this)"/>
            <span class="vlm-switch-track"><span class="vlm-switch-knob"></span></span>
            <span class="vlm-switch-text"><b>${label}</b>${sub ? '<small>' + sub + '</small>' : ''}</span>
        </label>`;
    };
    var plans = VLM_PLAN_COLUMNS.map(function (c) {
        return toggle(c.setting, c.title, c.code === 'THREE_COURSES' ? 'Shown when enrolled in more than 3 courses'
            : c.code === 'CUSTOM' ? 'Sold as 1 course or 2 courses · per-course fee × N' : c.code === 'ALL' ? 'Every enrolled course' : 'All enrolled courses until each course ends, one payment');
    }).join('');

    var head = '<div class="vlm-fee-row vlm-fee-head"><div class="vlm-fee-grade">Grade</div>' + VLM_PLAN_COLUMNS.map(function (c) {
        return `<div class="vlm-fee-cell ${s[c.setting] ? '' : 'is-off'}"><b>${c.title}</b><small>${c.unit}</small></div>`;
    }).join('') + '</div>';
    var rows = (p.grades || []).map(function (g) {
        return `<div class="vlm-fee-row" data-grade="${g.gradeId}"><div class="vlm-fee-grade">${vlmEsc(g.gradeName)}</div>`
            + VLM_PLAN_COLUMNS.map(function (c) {
                var key = g.gradeId + '|' + c.code;
                var val = p.fees[key] !== undefined ? p.fees[key] : '';
                return `<div class="vlm-fee-cell ${s[c.setting] ? '' : 'is-off'}">
                    <span class="vlm-fee-label">${c.title} <small>${c.unit}</small></span>
                    <span class="vlm-money"><i>$</i><input type="number" min="0" max="99999.99" step="0.01" inputmode="decimal"
                        placeholder="0" value="${vlmEsc(val)}" data-fee="${key}" oninput="vlmPlanFeeChanged(this)"
                        title="${vlmEsc(c.title + ' — ' + g.gradeName)}"/></span>
                </div>`;
            }).join('') + '</div>';
    }).join('');
    if (!rows) {
        rows = '<div class="vlm-loading">No grades with courses found.</div>';
    }
    var warn = s.enabled && !p.anyFee
        ? `<div class="vlm-plans-warn"><i class="fa fa-exclamation-triangle"></i> The paywall is on but no plan has a fee yet — students can only start the free trial${s.trialDays > 0 ? '' : ' (and the trial is off)'}.</div>` : '';

    return `
    <div class="vlm-plans">
        <div class="vlm-box">
            <div class="vlm-box-head">
                <div>
                    <div class="vlm-box-title">Subscription settings</div>
                    <div class="vlm-box-sub">Saved in Settings (VIDEO_SUBSCRIPTION) and used straight away.</div>
                </div>
                <button type="button" class="btn vlm-add-btn" id="vlmSaveSettingsBtn" onclick="vlmSaveSubscriptionSettings()" ${p.dirtySettings ? '' : 'disabled'}>
                    <i class="fa fa-check mr-1"></i> Save settings
                </button>
            </div>
            <div class="vlm-paywall">${toggle('enabled', 'Videos need a subscription', 'Off = every enrolled student watches for free, as before')}</div>
            <div class="vlm-set-grid">
                <label class="vlm-set">
                    <span>Free trial</span>
                    <span class="vlm-set-input"><input type="number" min="0" max="365" step="1" data-setting="trialDays" value="${vlmEsc(s.trialDays)}" oninput="vlmPlanSettingChanged(this)"/><i>days</i></span>
                    <small>Once per student · 0 = no trial</small>
                </label>
                <label class="vlm-set">
                    <span>Renewal opens</span>
                    <span class="vlm-set-input"><input type="number" min="0" max="28" step="1" data-setting="renewBeforeDays" value="${vlmEsc(s.renewBeforeDays)}" oninput="vlmPlanSettingChanged(this)"/><i>days before the end</i></span>
                    <small>The new month starts when the current one ends</small>
                </label>
                <label class="vlm-set">
                    <span>Reminder emails</span>
                    <span class="vlm-set-input"><input type="text" data-setting="reminderDays" value="${vlmEsc(s.reminderDaysText)}" placeholder="3,1" oninput="vlmPlanSettingChanged(this)"/><i>days before the end</i></span>
                    <small>Comma separated, e.g. 3,1 · empty = no reminders</small>
                </label>
            </div>
            <div class="vlm-set-label">Plans offered</div>
            <div class="vlm-plan-toggles">${plans}</div>
        </div>

        <div class="vlm-box">
            <div class="vlm-box-head">
                <div>
                    <div class="vlm-box-title">Fees by grade <span class="vlm-box-cur">USD</span></div>
                    <div class="vlm-box-sub">A plan with no fee (0) is not shown to that grade's students.</div>
                </div>
                <button type="button" class="btn vlm-add-btn" id="vlmSaveFeesBtn" onclick="vlmSavePlanFees()" ${p.dirtyFees ? '' : 'disabled'}>
                    <i class="fa fa-check mr-1"></i> Save fees
                </button>
            </div>
            ${warn}
            <div class="vlm-fees">${head}${rows}</div>
        </div>
    </div>`;
}

/* Subscribers tab frame: header + numbers + filters + list (S = vlmState.subs) */
function renderSubscribersView(S, loading) {
    var opt = function (v, label, cur) { return `<option value="${v}" ${cur === v ? 'selected' : ''}>${label}</option>`; };
    return `
    <div class="vlm-box">
        <div class="vlm-box-head">
            <div>
                <div class="vlm-box-title">Subscribers</div>
                <div class="vlm-box-sub">Who can watch, on which plan, until when. The grade filter above applies here too.</div>
            </div>
            <button type="button" class="btn vlm-add-btn" onclick="vlmOpenGrant()"><i class="fa fa-gift mr-1"></i> Grant free access</button>
        </div>
        <div class="vlm-stats" id="vlmSubsStats">${renderSubscriberStats(loading ? null : S.summary)}</div>
        <div class="vlm-subs-filters">
            <div class="vlm-search-box">
                <i class="fa fa-search"></i>
                <input type="text" placeholder="Search name or email..." value="${vlmEsc(S.search)}" data-filter="search" oninput="vlmSubsFilterChanged(this)"/>
            </div>
            <div class="vlm-sort-box">
                <select data-filter="status" onchange="vlmSubsFilterChanged(this)" title="Status">
                    ${opt('', 'All statuses', S.status)}${opt('ACTIVE_NOW', 'Active now', S.status)}${opt('UPCOMING', 'Starts later', S.status)}
                    ${opt('EXPIRED', 'Expired', S.status)}${opt('PENDING', 'Payment pending', S.status)}${opt('REVOKED', 'Revoked', S.status)}
                    ${opt('CANCELLED', 'Cancelled', S.status)}
                </select>
            </div>
            <div class="vlm-sort-box">
                <select data-filter="plan" onchange="vlmSubsFilterChanged(this)" title="Plan">
                    ${opt('', 'All plans', S.plan)}${opt('TRIAL', 'Free trial', S.plan)}${opt('THREE_COURSES', '3 courses', S.plan)}
                    ${opt('CUSTOM', 'Custom', S.plan)}${opt('ALL', 'All courses', S.plan)}${opt('LIFETIME', 'Full course', S.plan)}
                </select>
            </div>
            <div class="vlm-sort-box">
                <select data-filter="source" onchange="vlmSubsFilterChanged(this)" title="How they got it">
                    ${opt('', 'Paid, free &amp; trial', S.source)}${opt('PAID', 'Paid', S.source)}${opt('ADMIN', 'Free (granted)', S.source)}
                    ${opt('TRIAL', 'Trial', S.source)}
                </select>
            </div>
        </div>
        <div id="vlmSubsList">${loading ? '<div class="vlm-loading">Loading subscribers…</div>' : renderSubscriberRows(S.rows, S.total)}</div>
    </div>`;
}

function renderSubscriberStats(d) {
    var stat = function (n, label, cls) { return `<div class="vlm-stat ${cls || ''}"><b>${d ? n : '–'}</b><span>${label}</span></div>`; };
    return stat(d && d.activeNow, 'Active now') + stat(d && d.paying, 'Paying', 'is-paid') + stat(d && d.free, 'Free (granted)', 'is-free')
        + stat(d && d.onTrial, 'On trial', 'is-trial') + stat(d ? vlmMoney(d.collected, 'USD') : 0, 'Collected (all time)');
}

var VLM_STATE_LABELS = { ACTIVE: 'Active', UPCOMING: 'Starts later', EXPIRED: 'Expired', PENDING: 'Payment pending', REVOKED: 'Revoked', CANCELLED: 'Cancelled' };
var VLM_SOURCE_LABELS = { PAID: 'Paid', ADMIN: 'Free', TRIAL: 'Trial' };

function renderSubscriberRows(rows, total) {
    if (!rows || !rows.length) {
        return '<div class="vlm-loading">No subscriptions match these filters.</div>';
    }
    var head = `<div class="vlm-sub-row vlm-sub-head"><div>Student</div><div>Plan</div><div>Status</div><div>Period</div><div>Amount</div><div></div></div>`;
    var body = rows.map(function (r) {
        var plan = VLM_PLAN_NAMES[r.planCode] || r.planCode;
        var courses = r.planCode === 'TRIAL' ? 'All enrolled courses'
            : (r.planCode === 'ALL' || r.planCode === 'LIFETIME') ? 'All enrolled courses of ' + vlmEsc(r.standardName || 'the grade')
            : (r.courses || []).map(vlmEsc).join(', ');
        var period = r.startDate ? vlmFmtDate(r.startDate) + ' → ' + (r.endDate ? vlmFmtDate(r.endDate) : r.planCode === 'LIFETIME' ? 'course end' : 'no end') : 'Not started';
        var amount = r.source === 'PAID' ? vlmMoney(r.amount, r.currency) : '<span class="vlm-muted">Free</span>';
        var by = r.source === 'ADMIN' ? '<div class="vlm-sub-by"><i class="fa fa-gift"></i> Granted by ' + vlmEsc(r.grantedByName || ('#' + r.grantedBy)) + '</div>' : '';
        var note = r.note ? '<div class="vlm-sub-note" title="' + vlmEsc(r.note) + '">' + vlmEsc(r.note) + '</div>' : '';
        var canRevoke = r.source === 'ADMIN' && r.status === 'ACTIVE' && r.state !== 'EXPIRED';
        return `<div class="vlm-sub-row" data-sub="${r.id}">
            <div class="vlm-sub-student"><b>${vlmEsc(r.studentName || 'Student #' + r.userId)}</b><small>${vlmEsc(r.email || '')}</small>
                ${r.standardName ? '<span class="vlm-sub-grade">' + vlmEsc(r.standardName) + '</span>' : ''}</div>
            <div class="vlm-sub-plan"><b>${vlmEsc(plan)}</b> <span class="vlm-src vlm-src-${vlmEsc(String(r.source).toLowerCase())}">${VLM_SOURCE_LABELS[r.source] || vlmEsc(r.source)}</span>
                <small>${courses}</small>${by}${note}</div>
            <div><span class="vlm-state vlm-state-${vlmEsc(String(r.state).toLowerCase())}">${VLM_STATE_LABELS[r.state] || vlmEsc(r.state)}</span></div>
            <div class="vlm-sub-period"><span class="vlm-sub-label">Period</span>${period}</div>
            <div class="vlm-sub-amount"><span class="vlm-sub-label">Amount</span>${amount}</div>
            <div class="vlm-sub-actions">${canRevoke ? `<button type="button" class="vlm-revoke-btn" onclick="vlmAskRevoke(${r.id})"><i class="fa fa-ban"></i> Revoke</button>` : ''}</div>
        </div>`;
    }).join('');
    var more = rows.length < total
        ? `<div class="vlm-subs-more"><span>Showing ${rows.length} of ${total}</span><button type="button" class="vlm-ghost-btn" onclick="vlmSubsLoadMore(this)">Load more</button></div>`
        : `<div class="vlm-subs-more"><span>${total} ${total === 1 ? 'subscription' : 'subscriptions'}</span></div>`;
    return `<div class="vlm-subs">${head}${body}</div>${more}`;
}

/* grant modal body once a student is found: G = vlmState.grant, plan = chosen plan option */
function renderGrantForm(G, plan) {
    var p = G.preview;
    var current = (p.current || []).map(function (c) {
        return '<li>' + vlmEsc(VLM_PLAN_NAMES[c.planCode] || c.planCode) + ' (' + (VLM_SOURCE_LABELS[c.source] || c.source) + ') · '
            + (c.endDate ? 'until ' + vlmFmtDate(c.endDate) : c.planCode === 'LIFETIME' ? 'until the course ends' : 'no end') + (c.startDate > Date.now() ? ' · starts ' + vlmFmtDate(c.startDate) : '') + '</li>';
    }).join('');
    var n = (p.courses || []).length;
    if (!n) {
        return `<div class="vlm-grant-student">${vlmGrantStudentCard(p)}</div>
            <div class="vlm-plans-warn"><i class="fa fa-exclamation-triangle"></i> This student has no enrolled course in ${vlmEsc(p.standardName || 'their grade')}, so there is nothing to grant.</div>`;
    }
    var plans = (p.plans || []).map(function (o) {
        var all = n === 1 ? 'The 1 course' : 'All ' + n + ' courses';
        var hint = o.lifetime ? all + ' · until the course ends' + (o.untilDate ? ' (' + vlmFmtDate(o.untilDate) + ')' : '')
            : o.minCourses === 0 ? all
            : o.minCourses === o.maxCourses ? 'Choose ' + o.minCourses + ' courses' : 'Choose ' + o.minCourses + '–' + o.maxCourses + ' courses';
        return `<label class="vlm-grant-plan ${G.plan === o.planCode ? 'active' : ''}">
            <input type="radio" name="vlmGrantPlan" value="${o.planCode}" ${G.plan === o.planCode ? 'checked' : ''} onchange="vlmGrantPickPlan(this.value)"/>
            <b>${vlmEsc(o.name)}</b><small>${hint}</small></label>`;
    }).join('');
    var choose = plan && plan.minCourses > 0;
    var courses = (p.courses || []).map(function (c) {
        var on = choose ? !!G.picked[c.subjectId] : true;
        return `<label class="vlm-pick ${on ? 'is-picked' : ''} ${choose ? '' : 'is-fixed'}">
            <input type="checkbox" value="${c.subjectId}" ${on ? 'checked' : ''} ${choose ? '' : 'disabled'} onchange="vlmGrantPickCourse(this); $(this).closest('.vlm-pick').toggleClass('is-picked', this.checked)"/>
            <span>${vlmEsc(c.courseTitle)}</span></label>`;
    }).join('');
    var count = choose ? Object.keys(G.picked).length + ' of ' + (plan.minCourses === plan.maxCourses ? plan.maxCourses : plan.minCourses + '–' + plan.maxCourses) + ' chosen' : 'all included';
    return `
        <div class="vlm-grant-student">${vlmGrantStudentCard(p)}</div>
        ${current ? '<div class="vlm-grant-current"><b>Already has</b><ul>' + current + '</ul><small>A new grant runs alongside; the student gets whichever lasts longer.</small></div>' : ''}
        <div class="vlm-label">Plan</div>
        <div class="vlm-grant-plans">${plans}</div>
        <div class="vlm-label">Courses <span class="vlm-label-note" id="vlmGrantPickCount">${count}</span></div>
        <div class="vlm-grant-courses">${courses}</div>
        <div class="vlm-grant-meta ${plan && plan.lifetime ? 'is-lifetime' : ''}">
            ${renderGrantDuration('one', G.durValue, G.durUnit, plan && plan.lifetime)}
            <div class="form-group">
                <label class="vlm-label" for="vlmGrantNote">Note <span class="vlm-label-note">(optional, admins only)</span></label>
                <input type="text" id="vlmGrantNote" class="form-control" maxlength="500" placeholder="e.g. Scholarship, sibling offer" value="${vlmEsc(G.note)}" data-field="note" oninput="vlmGrantField(this)"/>
            </div>
        </div>`;
}

function vlmGrantStudentCard(p) {
    var initials = String(p.studentName || p.email || '?').split(/\s+/).map(function (w) { return w.charAt(0); }).join('').substring(0, 2).toUpperCase();
    return `<div class="vlm-context"><div class="vlm-context-icon">${vlmEsc(initials)}</div>
        <div class="vlm-context-text"><b>${vlmEsc(p.studentName || 'Student')}</b><small>${vlmEsc(p.email || '')} · ${vlmEsc(p.standardName || 'No grade')}</small></div></div>`;
}

/* how long a grant runs: N days / months with quick picks and the end date (scope 'one' | 'many') */
function renderGrantDuration(scope, value, unit, hidden) {
    var presets = VLM_DUR_PRESETS.map(function (p) {
        var label = p[1] === 'DAY' ? p[0] + ' days' : p[0] === 1 ? '1 month' : p[0] + ' months';
        var on = String(value) === String(p[0]) && unit === p[1];
        return `<button type="button" class="vlm-dur-preset ${on ? 'active' : ''}" data-value="${p[0]}" data-unit="${p[1]}"
            onclick="vlmDurPreset('${scope}', ${p[0]}, '${p[1]}')">${label}</button>`;
    }).join('');
    return `
    <div class="form-group vlm-dur ${hidden ? 'vlm-hidden' : ''}" id="vlmDur-${scope}">
        <label class="vlm-label">How long</label>
        <div class="vlm-dur-row">
            <input type="number" class="form-control vlm-dur-value" min="1" step="1" value="${vlmEsc(value)}" data-scope="${scope}" data-dur="durValue"
                oninput="vlmDurChanged(this)" aria-label="Number of days or months"/>
            <select class="form-control vlm-dur-unit" data-scope="${scope}" data-dur="durUnit" onchange="vlmDurChanged(this)" aria-label="Days or months">
                <option value="DAY" ${unit === 'DAY' ? 'selected' : ''}>Days</option>
                <option value="MONTH" ${unit === 'MONTH' ? 'selected' : ''}>Months</option>
            </select>
        </div>
        <div class="vlm-dur-presets">${presets}</div>
        <small class="vlm-dur-end"></small>
    </div>`;
}

/* many students: grade, name filter, the list, plan, length, note (B = vlmState.bulk) */
function renderBulkPanel(B, grades) {
    var gradeOpts = '<option value="0">Choose a grade</option>' + (grades || []).map(function (g) {
        return `<option value="${g.gradeId}" ${parseInt(g.gradeId, 10) === B.standardId ? 'selected' : ''}>${vlmEsc(g.gradeName)}</option>`;
    }).join('');
    var plan = function (code, name, hint) {
        return `<label class="vlm-grant-plan ${B.plan === code ? 'active' : ''}">
            <input type="radio" name="vlmBulkPlan" value="${code}" ${B.plan === code ? 'checked' : ''} data-bulk="plan" onchange="vlmBulkField(this)"/>
            <b>${name}</b><small>${hint}</small></label>`;
    };
    return `
    <div class="vlm-bulk-filters">
        <div class="vlm-sort-box"><i class="fa fa-graduation-cap"></i>
            <select data-bulk="standardId" onchange="vlmBulkField(this)" title="Grade">${gradeOpts}</select></div>
        <div class="vlm-search-box"><i class="fa fa-search"></i>
            <input type="text" placeholder="Filter by name or email..." value="${vlmEsc(B.search)}" data-bulk="search" oninput="vlmBulkField(this)"/></div>
    </div>
    <div id="vlmBulkList"></div>
    <div class="vlm-label">Plan</div>
    <div class="vlm-grant-plans">
        ${plan('ALL', 'All courses', "Each student's own courses")}
        ${plan('LIFETIME', 'Full course', 'Until each course ends')}
    </div>
    ${renderGrantDuration('many', B.durValue, B.durUnit, B.plan === 'LIFETIME')}
    <div class="form-group">
        <label class="vlm-label">Note <span class="vlm-label-note">(optional, admins only)</span></label>
        <input type="text" class="form-control" maxlength="500" placeholder="e.g. Scholarship batch" value="${vlmEsc(B.note)}" data-bulk="note" oninput="vlmBulkField(this)"/>
    </div>`;
}

function renderBulkList(B) {
    if (!B.standardId) {
        return '<div class="vlm-bulk-empty">Choose a grade to list its active students.</div>';
    }
    if (!B.loaded) {
        return '<div class="vlm-bulk-empty">Loading students…</div>';
    }
    if (!B.rows.length) {
        return '<div class="vlm-bulk-empty">' + (B.search ? 'No student matches this filter.' : 'No active students in this grade.') + '</div>';
    }
    var free = B.rows.filter(function (r) { return !r.hasPlan; });
    var all = free.length > 0 && free.every(function (r) { return B.selected[r.userId]; });
    var n = Object.keys(B.selected).length;
    var rows = B.rows.map(function (r) {
        var on = !!B.selected[r.userId];
        return `<label class="vlm-bulk-row ${on ? 'is-picked' : ''} ${r.hasPlan ? 'is-off' : ''}">
            <input type="checkbox" value="${r.userId}" ${on ? 'checked' : ''} ${r.hasPlan ? 'disabled' : ''} onchange="vlmBulkToggle(this)"/>
            <span class="vlm-bulk-who"><b>${vlmEsc(r.studentName || r.email || ('Student #' + r.userId))}</b><small>${vlmEsc(r.email || '')}</small></span>
            ${r.hasPlan ? '<span class="vlm-state vlm-state-active">Has a plan</span>' : ''}
        </label>`;
    }).join('');
    var more = B.total > B.rows.length ? `<div class="vlm-bulk-more">Showing ${B.rows.length} of ${B.total}. Use the filter to find the others.</div>` : '';
    return `
    <div class="vlm-bulk-head">
        <label class="vlm-bulk-all"><input type="checkbox" id="vlmBulkAll" ${all ? 'checked' : ''} ${free.length ? '' : 'disabled'} onchange="vlmBulkToggleAll(this)"/>
            Select all ${free.length}</label>
        <span class="vlm-label-note" id="vlmBulkCount">${n} selected</span>
    </div>
    <div class="vlm-bulk-list">${rows}</div>${more}`;
}

/* what a bulk grant did */
function renderBulkResult(d) {
    var rest = (d.items || []).filter(function (i) { return i.result !== 'GRANTED'; }).map(function (i) {
        return `<li><b>${vlmEsc(i.studentName || ('Student #' + i.userId))}</b> <span class="vlm-state ${i.result === 'FAILED' ? 'vlm-state-revoked' : 'vlm-state-pending'}">${i.result === 'FAILED' ? 'Failed' : 'Skipped'}</span>
            <small>${vlmEsc(i.message || '')}</small></li>`;
    }).join('');
    return `
    <div class="vlm-stats">
        <div class="vlm-stat is-paid"><b>${d.granted || 0}</b><span>Got access</span></div>
        <div class="vlm-stat is-free"><b>${d.skipped || 0}</b><span>Skipped</span></div>
        <div class="vlm-stat"><b>${d.failed || 0}</b><span>Failed</span></div>
    </div>
    ${rest ? '<div class="vlm-label">Not granted</div><ul class="vlm-bulk-result">' + rest + '</ul>' : '<div class="vlm-bulk-empty">Every chosen student got access.</div>'}`;
}

/* Grant free access modal */
function getVideoLibraryGrantModalHtml() {
    return `
    <div class="modal fade vlm-modal" id="vlmGrantModal" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div class="modal-content vlm-modal-content">
          <div class="modal-header vlm-modal-header">
            <h5 class="modal-title"><i class="fa fa-gift mr-1"></i> Grant free access</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span>&times;</span></button>
          </div>
          <div class="modal-body">
            <div class="vlm-views vlm-grant-mode" role="tablist">
                <button type="button" class="vlm-view-btn active" data-mode="one" onclick="vlmGrantSetMode('one')"><i class="fa fa-user"></i> One student</button>
                <button type="button" class="vlm-view-btn" data-mode="many" onclick="vlmGrantSetMode('many')"><i class="fa fa-users"></i> Many students</button>
            </div>
            <small class="text-muted d-block mb-3">No payment is created. The access is recorded as granted by you and can be revoked.</small>
            <div id="vlmGrantOne">
                <label class="vlm-label" for="vlmGrantEmail">Student email <span class="text-danger">*</span></label>
                <div class="vlm-grant-find">
                    <input type="email" id="vlmGrantEmail" class="form-control" placeholder="student@example.com" autocomplete="off"
                        onkeydown="if (event.key === 'Enter') { event.preventDefault(); vlmGrantFind(); }"/>
                    <button type="button" class="vlm-ghost-btn" onclick="vlmGrantFind()"><i class="fa fa-search mr-1"></i> Find</button>
                </div>
                <div id="vlmGrantBody"></div>
            </div>
            <div id="vlmGrantMany" class="vlm-hidden"><div id="vlmBulkBody"></div></div>
          </div>
          <div class="modal-footer vlm-modal-footer">
            <span class="vlm-grant-problem" id="vlmGrantProblem"></span>
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-success vlm-save-btn" id="vlmGrantSaveBtn" onclick="vlmGrantSave()" disabled>
                <i class="fa fa-check mr-1"></i> Grant access
            </button>
          </div>
        </div>
      </div>
    </div>`;
}

/* Add / Edit lesson modal */
function getVideoLibraryLessonModalHtml() {
    return `
    <div class="modal fade vlm-modal" id="vlmLessonModal" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content vlm-modal-content">
          <div class="modal-header vlm-modal-header">
            <h5 class="modal-title" id="vlmLessonModalTitle">Add lesson</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span>&times;</span></button>
          </div>
          <div class="modal-body">
            <input type="hidden" id="vlmLessonEditId" value="0"/>
            <div class="form-row">
                <div class="form-group col-4">
                    <label class="vlm-label">Module no. <span class="text-danger">*</span></label>
                    <input type="number" id="vlmLmModuleNo" class="form-control" min="1" step="1"/>
                </div>
                <div class="form-group col-8">
                    <label class="vlm-label">Module title <span class="vlm-label-note">(optional)</span></label>
                    <input type="text" id="vlmLmModuleTitle" class="form-control" maxlength="200" placeholder="e.g. Start it up"/>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group col-4">
                    <label class="vlm-label">Lesson no. <span class="text-danger">*</span></label>
                    <input type="number" id="vlmLmLessonNo" class="form-control" min="1" step="1"/>
                </div>
                <div class="form-group col-8">
                    <label class="vlm-label">Lesson title <span class="text-danger">*</span></label>
                    <input type="text" id="vlmLmTitle" class="form-control" maxlength="200" placeholder="e.g. Cite Your Sources"/>
                </div>
            </div>
            <small class="text-muted">Module and lesson numbers must be unique in this course. New lessons are placed by their numbers; you can reorder them afterwards.</small>
          </div>
          <div class="modal-footer vlm-modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-success vlm-save-btn" onclick="vlmSaveLesson()">
                <i class="fa fa-check mr-1"></i> Save lesson
            </button>
          </div>
        </div>
      </div>
    </div>`;
}

/* Scoped styles (kept inline so the module is self-contained) */
function getVideoLibraryStyles() {
    return `
    <style>
    .vlm-scope{width:100%;display:block;box-sizing:border-box;padding:18px 0 34px;}
    .vlm-scope *{box-sizing:border-box;}
    .vlm-scope .vlm-title{font-size:21px;font-weight:700;color:#222;}
    .vlm-header{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:16px;}
    .vlm-header-left{display:flex;align-items:center;flex:1;min-width:0;}
    .vlm-title-icon{background:var(--pc,#16aaff);color:#fff;border-radius:12px;width:46px;height:46px;display:flex;align-items:center;justify-content:center;font-size:21px;margin-right:12px;box-shadow:0 6px 16px color-mix(in srgb, var(--pc,#16aaff) 35%, transparent);}
    .vlm-add-btn{background:var(--pc,#16aaff);color:#fff;border:none;border-radius:10px;padding:10px 20px;font-weight:600;box-shadow:0 6px 16px color-mix(in srgb, var(--pc,#16aaff) 30%, transparent);transition:transform .15s ease,box-shadow .15s ease;flex-shrink:0;white-space:nowrap;}
    .vlm-add-btn:hover{color:#fff;transform:translateY(-2px);box-shadow:0 10px 22px color-mix(in srgb, var(--pc,#16aaff) 42%, transparent);}
    .vlm-toolbar{display:flex;align-items:flex-start;gap:12px;flex-wrap:wrap;margin-bottom:18px;}
    .vlm-chips{display:flex;gap:8px;flex-wrap:wrap;flex:1;min-width:0;align-content:flex-start;}
    .vlm-chip{border:1.5px solid #e2e6ef;background:#fff;color:#555;border-radius:30px;padding:6px 15px;font-size:12.5px;font-weight:600;cursor:pointer;transition:all .15s ease;display:inline-flex;align-items:center;gap:5px;max-width:230px;}
    .vlm-chip:hover{border-color:var(--pc,#16aaff);color:var(--pc,#16aaff);}
    .vlm-chip.active{background:var(--pc,#16aaff);border-color:transparent;color:#fff;box-shadow:0 5px 14px color-mix(in srgb, var(--pc,#16aaff) 30%, transparent);}
    .vlm-chip-txt{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
    .vlm-chip-count{background:rgba(0,0,0,.08);border-radius:20px;padding:0 6px;font-size:10.5px;flex-shrink:0;}
    .vlm-chip.active .vlm-chip-count{background:rgba(255,255,255,.28);}
    .vlm-search-box{position:relative;min-width:230px;flex-shrink:0;}
    .vlm-search-box i{position:absolute;left:14px;top:50%;transform:translateY(-50%);color:#9aa0b5;}
    .vlm-search-box input{border:1.5px solid #e4e7ec;border-radius:30px;padding:9px 16px 9px 38px;font-size:13px;width:100%;outline:none;transition:border-color .15s ease;}
    .vlm-search-box input:focus{border-color:var(--pc,#16aaff);}
    .vlm-label{font-size:12px;font-weight:600;color:#555;margin-bottom:4px;}
    .vlm-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:18px;}
    .vlm-card{background:#fff;border-radius:16px;overflow:hidden;border:1px solid #eef1f6;box-shadow:0 4px 14px rgba(16,42,67,.05);opacity:0;transform:translateY(16px);transition:box-shadow .22s ease,transform .22s ease,border-color .22s ease;}
    .vlm-card.vlm-in{opacity:1;transform:none;}
    .vlm-card:hover{box-shadow:0 16px 34px rgba(16,42,67,.14);transform:translateY(-5px);border-color:#d6ebfb;}
    .vlm-card-thumb{position:relative;cursor:pointer;aspect-ratio:16/9;background:#0b1020;overflow:hidden;}
    .vlm-card-thumb img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .4s ease;}
    .vlm-card:hover .vlm-card-thumb img{transform:scale(1.06);}
    .vlm-card-scrim{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0) 55%,rgba(0,0,0,.28) 100%);pointer-events:none;}
    .vlm-play-overlay{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:color-mix(in srgb, var(--pc,#16aaff) 28%, transparent);opacity:0;transition:opacity .2s ease;}
    .vlm-card-thumb:hover .vlm-play-overlay{opacity:1;}
    .vlm-play-overlay i{background:#fff;color:var(--pc,#16aaff);width:52px;height:52px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;padding-left:3px;box-shadow:0 6px 18px rgba(0,0,0,.25);}
    .vlm-card-type{position:absolute;top:9px;right:9px;display:inline-flex;align-items:center;gap:4px;background:rgba(17,24,39,.72);color:#fff;font-size:10px;font-weight:600;padding:3px 9px;border-radius:20px;letter-spacing:.2px;backdrop-filter:blur(2px);}
    .vlm-card-type i{font-size:10px;}
    .vlm-card-type.is-yt i{color:#ff5a5f;}
    .vlm-card-body{padding:13px 14px 14px;}
    .vlm-card-badges{display:flex;align-items:center;gap:6px;margin-bottom:8px;flex-wrap:nowrap;overflow:hidden;}
    .vlm-card-badge{background:color-mix(in srgb, var(--pc,#16aaff) 10%, white);color:var(--pc,#16aaff);font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;max-width:140px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex-shrink:1;}
    .vlm-card-std{background:#f1f3f5;color:#5a6b7b;font-size:10.5px;font-weight:600;padding:3px 9px;border-radius:20px;white-space:nowrap;flex-shrink:0;}
    .vlm-card-status.is-inactive{background:#f1f3f5;color:#9098a3;}
    .vlm-card-status.is-inactive::before{background:#c2c8d0;}
    .vlm-icon-circle{width:36px;height:36px;flex-shrink:0;border-radius:10px;border:none;display:inline-flex;align-items:center;justify-content:center;font-size:13px;cursor:pointer;transition:all .15s ease;}
    .vlm-icon-circle.vlm-edit{background:#fff6e7;color:#f7b924;}
    .vlm-icon-circle.vlm-edit:hover{background:#f7b924;color:#fff;}
    .vlm-icon-circle.vlm-del{background:#fde8ee;color:#d92550;}
    .vlm-icon-circle.vlm-del:hover{background:#d92550;color:#fff;}
    .vlm-empty{grid-column:1/-1;text-align:center;padding:50px 20px;color:#9aa0a6;}
    .vlm-empty-icon{font-size:46px;color:#d8dbe0;margin-bottom:10px;}
    .vlm-empty-title{font-size:17px;font-weight:700;color:#5a5f66;}
    .vlm-empty-text{font-size:13px;margin-top:4px;}
    /* MDB/material theme puts a box-shadow on .modal-dialog (a full-height element) which
       shows as a tall "ghost" rectangle behind the card — kill it for our modals. */
    .vlm-modal .modal-dialog,.vlm-player-modal .modal-dialog,.vlm-confirm-modal .modal-dialog{box-shadow:none !important;background:transparent !important;}
    .vlm-modal-content{border:none;border-radius:16px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.25);}
    .vlm-modal-header{background:var(--pc,#16aaff);color:#fff;border:none;}
    .vlm-modal-header .close{color:#fff;opacity:.9;text-shadow:none;}
    .vlm-source-toggle{display:flex;gap:10px;}
    .vlm-source-opt{flex:1;border:1.5px solid #e4e7ec;border-radius:10px;padding:10px 12px;cursor:pointer;font-size:13px;font-weight:600;color:#666;display:flex;align-items:center;gap:8px;margin:0;transition:all .15s ease;}
    .vlm-source-opt.active{border-color:var(--pc,#16aaff);background:color-mix(in srgb, var(--pc,#16aaff) 10%, white);color:var(--pc,#16aaff);}
    .vlm-source-opt input{display:none;}
    .vlm-url-preview{margin-top:10px;border-radius:10px;overflow:hidden;}
    .vlm-url-preview iframe{width:100%;aspect-ratio:16/9;border:0;border-radius:10px;}
    .vlm-hidden{display:none !important;}
    .vlm-upload-box{position:relative;border:2px dashed #cdd3e0;border-radius:12px;padding:22px 14px;text-align:center;cursor:pointer;transition:all .15s ease;background:#fafbff;}
    .vlm-upload-box:hover{border-color:var(--pc,#16aaff);background:color-mix(in srgb, var(--pc,#16aaff) 10%, white);}
    .vlm-upload-box .vlm-file-input{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%;}
    .vlm-upload-inner i{font-size:26px;color:var(--pc,#16aaff);}
    .vlm-upload-text{font-size:13.5px;font-weight:600;color:#555;margin-top:6px;}
    .vlm-upload-hint{font-size:11.5px;color:#9aa0a6;margin-top:2px;}
    .vlm-upload-progress{height:7px;border-radius:20px;background:#e9ecf3;margin-top:10px;overflow:hidden;}
    .vlm-upload-bar{height:100%;width:0;background:var(--pc,#16aaff);transition:width .2s ease;}
    .vlm-upload-status{font-size:12px;font-weight:600;margin-top:6px;min-height:16px;}
    .vlm-custom-thumb-toggle{display:flex;align-items:center;gap:8px;cursor:pointer;font-size:13px;font-weight:600;color:#444;margin:0;}
    .vlm-custom-thumb-toggle input{width:16px;height:16px;cursor:pointer;accent-color:#16aaff;}
    .vlm-custom-thumb-toggle .text-muted{font-weight:500;}
    .vlm-thumb-box{position:relative;margin-top:10px;border:2px dashed #cdd3e0;border-radius:12px;min-height:120px;cursor:pointer;background:#fafbff;overflow:hidden;display:flex;align-items:center;justify-content:center;}
    .vlm-thumb-box:hover{border-color:#16aaff;background:#e0f3ff;}
    .vlm-thumb-box .vlm-file-input{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%;}
    .vlm-thumb-inner{text-align:center;padding:14px;}
    .vlm-thumb-inner i{font-size:24px;color:#16aaff;}
    .vlm-thumb-preview{width:100%;max-height:200px;object-fit:cover;display:block;}
    .vlm-player-frame iframe,.vlm-player-frame video{width:100%;aspect-ratio:16/9;border:0;display:block;background:#000;}
    /* "already uploaded for this subject" — one-line horizontal slider */
    .vlm-sv-strip{display:flex;gap:10px;overflow-x:auto;padding:4px 2px 8px;scroll-snap-type:x proximity;-webkit-overflow-scrolling:touch;}
    .vlm-sv-strip::-webkit-scrollbar{height:6px;}
    .vlm-sv-strip::-webkit-scrollbar-thumb{background:#d4d8e0;border-radius:20px;}
    .vlm-sv-item{flex:0 0 auto;width:118px;scroll-snap-align:start;cursor:default;}
    .vlm-sv-thumb{position:relative;width:118px;aspect-ratio:16/9;border-radius:8px;background:#0b1020 center/cover no-repeat;box-shadow:0 3px 10px rgba(0,0,0,.1);}
    .vlm-sv-thumb i{position:absolute;inset:0;margin:auto;width:26px;height:26px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:11px;background:rgba(0,0,0,.45);border-radius:50%;padding-left:2px;}
    .vlm-sv-title{font-size:10.5px;color:#555;font-weight:600;margin-top:5px;line-height:1.2;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
    .vlm-sv-empty{font-size:12px;color:#9aa0a6;padding:6px 2px;}
    .vlm-confirm-dialog{max-width:400px;margin-left:auto;margin-right:auto;}
    .vlm-confirm-box{border:none !important;border-radius:18px !important;overflow:hidden;box-shadow:0 16px 44px rgba(16,24,40,.18) !important;}
    .vlm-confirm-icon{width:64px;height:64px;margin:0 auto 12px;border-radius:50%;background:#fff6e7;color:#f7b924;display:flex;align-items:center;justify-content:center;font-size:30px;}
    .vlm-confirm-title{font-size:18px;font-weight:700;color:#2a2f3a;}
    .vlm-confirm-text{font-size:13px;color:#8a8f98;margin-top:6px;line-height:1.45;}
    .vlm-confirm-actions{display:flex;gap:10px;justify-content:center;margin-top:20px;}
    .vlm-confirm-cancel{border:1.5px solid #e4e7ec;background:#fff;color:#555;border-radius:10px;padding:8px 22px;font-weight:600;min-width:110px;}
    .vlm-confirm-cancel:hover{background:#f6f7f9;color:#333;}
    .vlm-confirm-yes{background:#d92550;color:#fff;border:none;border-radius:10px;padding:8px 22px;font-weight:600;min-width:110px;box-shadow:0 6px 16px rgba(217,37,80,.28);}
    .vlm-confirm-yes:hover{background:#b81f45;color:#fff;}
    .vlm-label-note{font-weight:500;color:#9aa0a6;}
    /* view switch */
    .vlm-views{display:inline-flex;gap:4px;background:#eef1f6;border-radius:12px;padding:4px;margin-bottom:16px;}
    .vlm-view-btn{border:none;background:transparent;color:#5a6472;font-size:13px;font-weight:700;padding:8px 16px;border-radius:9px;cursor:pointer;display:inline-flex;align-items:center;gap:7px;transition:all .15s ease;}
    .vlm-view-btn:hover{color:var(--pc,#16aaff);}
    .vlm-view-btn.active{background:#fff;color:var(--pc,#16aaff);box-shadow:0 2px 8px rgba(16,42,67,.08);}
    /* sort */
    .vlm-sort-box{position:relative;flex-shrink:0;}
    .vlm-sort-box i{position:absolute;left:13px;top:50%;transform:translateY(-50%);color:#9aa0b5;pointer-events:none;}
    .vlm-sort-box select{appearance:none;-webkit-appearance:none;border:1.5px solid #e4e7ec;border-radius:30px;padding:9px 34px;font-size:13px;color:#444;background:#fff url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239aa0b5' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>") no-repeat right 13px center;cursor:pointer;outline:none;transition:border-color .15s ease;}
    .vlm-sort-box select:focus{border-color:var(--pc,#16aaff);}
    /* lesson line on a video card */
    .vlm-card-lesson{display:flex;align-items:center;gap:6px;font-size:11.5px;font-weight:600;color:#5a6472;margin-bottom:6px;min-width:0;}
    .vlm-card-lesson span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
    .vlm-card-lesson i{color:var(--pc,#16aaff);flex-shrink:0;}
    .vlm-card-lesson .vlm-star{color:#f7b924;}
    .vlm-card-lesson.is-none{color:#b5bcc6;font-weight:500;}
    .vlm-card-lesson.is-none i{color:#c9cfd8;}
    /* lesson picker in the upload modal */
    .vlm-new-lesson{margin-top:10px;border:1.5px dashed color-mix(in srgb, var(--pc,#16aaff) 45%, white);background:color-mix(in srgb, var(--pc,#16aaff) 5%, white);border-radius:12px;padding:12px 12px 4px;}
    .vlm-new-lesson-head{font-size:12.5px;font-weight:700;color:var(--pc,#16aaff);margin-bottom:8px;}
    /* playlist list */
    .vlm-pl-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:16px;}
    .vlm-pl-grade{display:inline-block;background:#f1f3f5;color:#5a6b7b;font-size:10.5px;font-weight:700;padding:3px 9px;border-radius:20px;}
    /* playlist detail */
    .vlm-pd-head{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:16px;}
    .vlm-pd-titlewrap{flex:1;min-width:0;}
    .vlm-pd-title{font-size:19px;font-weight:800;color:#1f2733;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
    .vlm-pd-sub{font-size:12px;color:#7a8492;font-weight:600;margin-top:3px;display:flex;align-items:center;gap:8px;}
    .vlm-ls-no{background:var(--pc,#16aaff);color:#fff;font-size:11px;font-weight:800;border-radius:8px;padding:4px 8px;flex-shrink:0;}
    .vlm-ls-title{flex:1;min-width:0;font-size:14px;font-weight:700;color:#1f2733;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
    .vlm-vr:last-child{border-bottom:none;}
    .vlm-vr-thumb i{position:absolute;inset:0;margin:auto;width:24px;height:24px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:10px;background:rgba(0,0,0,.45);border-radius:50%;padding-left:2px;}
    .vlm-vr-body{flex:1;min-width:0;}
    .vlm-vr-title{font-size:13px;font-weight:700;color:#2a2f3a;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
    .vlm-tag-primary{background:#fff6e7;color:#c48a00;font-size:10.5px;font-weight:700;padding:2px 8px;border-radius:20px;}
    .vlm-tag-primary i{color:#f7b924;}
    .vlm-tag-muted{background:#f1f3f5;color:#9098a3;font-size:10.5px;font-weight:700;padding:2px 8px;border-radius:20px;}
    .vlm-summary{font-size:12.5px;color:#7a8492;margin-top:3px;}
    .vlm-summary b{color:#2a2f3a;font-weight:700;}
    .vlm-dot{color:#c3c9d2;margin:0 3px;}
    .vlm-summary-warn,.vlm-summary-warn b{color:#c48a00;}
    .vlm-card-title{font-size:14.5px;font-weight:700;color:#1f2733;line-height:1.3;margin-bottom:10px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:38px;}
    .vlm-card-status{margin-left:auto;flex-shrink:0;font-size:10px;font-weight:700;padding:3px 9px;border-radius:20px;text-transform:uppercase;letter-spacing:.3px;}
    .vlm-card-foot{display:flex;align-items:center;gap:6px;}
    .vlm-card-foot .vlm-card-lesson{flex:1;margin:0;}
    .vlm-card-foot .vlm-icon-circle{width:32px;height:32px;}
    /* add-video modal: where the video goes (opened from a lesson) */
    .vlm-context{display:flex;align-items:center;gap:12px;border:1.5px solid color-mix(in srgb, var(--pc,#16aaff) 35%, white);background:color-mix(in srgb, var(--pc,#16aaff) 6%, white);border-radius:12px;padding:12px 14px;margin-bottom:16px;}
    .vlm-context-icon{width:38px;height:38px;border-radius:10px;background:var(--pc,#16aaff);color:#fff;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
    .vlm-context-body{flex:1;min-width:0;}
    .vlm-context-lbl{font-size:10.5px;font-weight:700;color:#8a94a2;text-transform:uppercase;letter-spacing:.4px;}
    .vlm-context-course{font-size:14px;font-weight:700;color:#1f2733;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
    .vlm-context-lesson{font-size:12.5px;color:#5a6472;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
    .vlm-mode-bar{display:flex;margin-bottom:14px;}
    .vlm-mode-bar .vlm-view-btn{flex:1;justify-content:center;}
    .vlm-pick-search{width:100%;min-width:0;margin-bottom:10px;}
    .vlm-pick-list{max-height:340px;overflow-y:auto;border:1px solid #eef1f6;border-radius:12px;padding:4px;}
    .vlm-pick{display:flex;align-items:center;gap:10px;padding:8px;border-radius:10px;cursor:pointer;margin:0;font-weight:400;}
    .vlm-pick:hover{background:#f6f8fb;}
    .vlm-pick.is-picked{background:color-mix(in srgb, var(--pc,#16aaff) 8%, white);}
    .vlm-pick input{width:16px;height:16px;flex-shrink:0;accent-color:var(--pc,#16aaff);cursor:pointer;}
    .vlm-pick-thumb{width:72px;aspect-ratio:16/9;flex-shrink:0;border-radius:6px;background:#0b1020 center/cover no-repeat;}
    .vlm-pick-body{flex:1;min-width:0;display:flex;flex-direction:column;}
    .vlm-pick-title{font-size:13px;font-weight:700;color:#2a2f3a;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
    .vlm-pick-where{font-size:11.5px;color:#8a94a2;font-weight:600;}
    .vlm-pick-where.is-loose{color:#c48a00;}
    .vlm-pick-empty{font-size:12.5px;color:#a0a8b3;padding:16px 8px;text-align:center;}
    .vlm-context-change{border:none;background:none;color:var(--pc,#16aaff);font-weight:700;font-size:12.5px;cursor:pointer;flex-shrink:0;}
    /* courses list */
    .vlm-pl-search{flex:1;max-width:360px;}
    /* plans & fees */
    .vlm-plans{display:flex;flex-direction:column;gap:16px;}
    .vlm-box{background:#fff;border:1px solid #eef1f6;border-radius:16px;padding:18px;box-shadow:0 2px 10px rgba(16,42,67,.04);}
    .vlm-box-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:14px;flex-wrap:wrap;}
    .vlm-box-title{font-size:16px;font-weight:800;color:#1f2733;}
    .vlm-box-sub{font-size:12.5px;color:#8a94a2;margin-top:2px;}
    .vlm-box-cur{background:#eef1f6;color:#5a6472;font-size:11px;font-weight:700;border-radius:20px;padding:2px 8px;margin-left:4px;vertical-align:middle;}
    .vlm-box .vlm-add-btn:disabled{opacity:.45;box-shadow:none;transform:none;cursor:default;}
    .vlm-paywall{background:#f7f9fc;border-radius:12px;padding:12px 14px;margin-bottom:14px;}
    .vlm-switch{display:flex;align-items:flex-start;gap:10px;cursor:pointer;margin:0;font-weight:400;}
    .vlm-switch input{position:absolute;opacity:0;width:0;height:0;}
    .vlm-switch-track{position:relative;width:38px;height:22px;border-radius:20px;background:#d5dae2;flex-shrink:0;transition:background .15s ease;margin-top:1px;}
    .vlm-switch-knob{position:absolute;top:3px;left:3px;width:16px;height:16px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.2);transition:left .15s ease;}
    .vlm-switch input:checked + .vlm-switch-track{background:#16d39a;}
    .vlm-switch input:checked + .vlm-switch-track .vlm-switch-knob{left:19px;}
    .vlm-switch input:focus-visible + .vlm-switch-track{outline:2px solid var(--pc,#16aaff);outline-offset:2px;}
    .vlm-switch-text{display:flex;flex-direction:column;font-size:13px;color:#2a2f3a;min-width:0;}
    .vlm-switch-text small{font-size:11.5px;color:#8a94a2;}
    .vlm-set-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px;margin-bottom:14px;}
    .vlm-set{display:flex;flex-direction:column;gap:5px;margin:0;font-weight:400;}
    .vlm-set > span:first-child{font-size:12px;font-weight:700;color:#555;}
    .vlm-set small{font-size:11.5px;color:#9aa0a6;}
    .vlm-set-input{display:flex;align-items:center;gap:8px;}
    .vlm-set-input input{width:90px;border:1.5px solid #e4e7ec;border-radius:10px;padding:7px 10px;font-size:13.5px;outline:none;}
    .vlm-set-input input:focus{border-color:var(--pc,#16aaff);}
    .vlm-set-input i{font-style:normal;font-size:12.5px;color:#6b7583;}
    .vlm-set-label{font-size:12px;font-weight:700;color:#555;margin-bottom:8px;}
    .vlm-plan-toggles{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px;}
    .vlm-plans-warn{background:#fff6e7;color:#8a6200;border-radius:10px;padding:10px 12px;font-size:12.5px;font-weight:600;margin-bottom:12px;}
    .vlm-plans-warn i{color:#f7b924;margin-right:4px;}
    .vlm-fees{border:1px solid #eef1f6;border-radius:12px;overflow:hidden;}
    .vlm-fee-row{display:grid;grid-template-columns:minmax(120px,1.2fr) repeat(4,minmax(110px,1fr));gap:10px;align-items:center;padding:8px 12px;border-top:1px solid #f1f3f6;}
    .vlm-fee-row:first-child{border-top:none;}
    .vlm-fee-head{background:#f7f9fc;font-size:12px;color:#5a6472;}
    .vlm-fee-head small{display:block;font-size:10.5px;color:#9aa0a6;font-weight:600;}
    .vlm-fee-grade{font-size:13px;font-weight:700;color:#1f2733;}
    .vlm-fee-head .vlm-fee-grade{font-size:12px;color:#5a6472;}
    .vlm-fee-cell.is-off{opacity:.4;}
    .vlm-fee-label{display:none;}
    .vlm-money{display:flex;align-items:center;border:1.5px solid #e4e7ec;border-radius:10px;padding:0 8px;background:#fff;}
    .vlm-money:focus-within{border-color:var(--pc,#16aaff);}
    .vlm-money i{font-style:normal;color:#9aa0a6;font-size:13px;}
    .vlm-money input{border:none;outline:none;width:100%;min-width:0;padding:7px 4px;font-size:13.5px;background:transparent;}
    .vlm-money.is-bad{border-color:#d92550;}
    .vlm-viewbar{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:16px;}
    /* subscribers */
    .vlm-stats{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:10px;margin-bottom:14px;}
    .vlm-stat{background:#f7f9fc;border-radius:12px;padding:10px 12px;display:flex;flex-direction:column;}
    .vlm-stat b{font-size:19px;color:#1f2733;line-height:1.2;}
    .vlm-stat span{font-size:11.5px;color:#7a8492;font-weight:600;}
    .vlm-stat.is-paid b{color:#16a87a;}
    .vlm-stat.is-free b{color:#c48a00;}
    .vlm-stat.is-trial b{color:var(--pc,#16aaff);}
    .vlm-subs-filters{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:12px;}
    .vlm-subs-filters .vlm-search-box{flex:1;min-width:200px;}
    .vlm-subs{border:1px solid #eef1f6;border-radius:12px;overflow:hidden;}
    .vlm-sub-row{display:grid;grid-template-columns:minmax(170px,1.5fr) minmax(170px,1.6fr) 110px minmax(150px,1.2fr) 80px 88px;gap:10px;align-items:center;padding:10px 12px;border-top:1px solid #f1f3f6;font-size:12.5px;color:#3a4250;}
    .vlm-sub-row:first-child{border-top:none;}
    .vlm-sub-head{background:#f7f9fc;font-size:12px;font-weight:700;color:#5a6472;}
    .vlm-sub-student,.vlm-sub-plan{min-width:0;}
    .vlm-sub-student b,.vlm-sub-plan b{color:#1f2733;font-size:13px;}
    .vlm-sub-student small,.vlm-sub-plan small{display:block;color:#8a94a2;font-size:11.5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
    .vlm-sub-grade{display:inline-block;background:#eef1f6;color:#5a6472;border-radius:20px;padding:1px 8px;font-size:10.5px;font-weight:700;margin-top:3px;}
    .vlm-sub-by{font-size:11px;color:#a77700;margin-top:2px;}
    .vlm-sub-note{font-size:11px;color:#8a94a2;font-style:italic;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
    .vlm-sub-label{display:none;}
    .vlm-sub-amount{font-weight:700;color:#1f2733;}
    .vlm-muted{color:#9aa0a6;font-weight:600;}
    .vlm-src{font-size:10.5px;font-weight:700;border-radius:20px;padding:1px 8px;vertical-align:1px;}
    .vlm-src-paid{background:#e3f8f0;color:#128a63;}
    .vlm-src-admin{background:#fff3d6;color:#9a6b00;}
    .vlm-src-trial{background:color-mix(in srgb, var(--pc,#16aaff) 12%, white);color:var(--pc,#16aaff);}
    .vlm-state{display:inline-block;font-size:11px;font-weight:700;border-radius:20px;padding:2px 9px;background:#eef1f6;color:#5a6472;white-space:nowrap;}
    .vlm-state-active{background:#e3f8f0;color:#128a63;}
    .vlm-state-upcoming{background:color-mix(in srgb, var(--pc,#16aaff) 12%, white);color:var(--pc,#16aaff);}
    .vlm-state-pending{background:#fff3d6;color:#9a6b00;}
    .vlm-state-revoked{background:#fde8ee;color:#c21f48;}
    .vlm-sub-actions{text-align:right;}
    .vlm-revoke-btn{border:1.5px solid #f3c2cf;background:#fff;color:#d92550;border-radius:8px;padding:5px 10px;font-size:12px;font-weight:700;cursor:pointer;white-space:nowrap;}
    .vlm-revoke-btn:hover{background:#d92550;border-color:#d92550;color:#fff;}
    .vlm-subs-more{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:12px;font-size:12.5px;color:#7a8492;}
    .vlm-grant-find{display:flex;gap:8px;margin-bottom:4px;}
    .vlm-grant-find input{flex:1;min-width:0;}
    .vlm-grant-student .vlm-context{margin-bottom:12px;}
    .vlm-context-text{display:flex;flex-direction:column;min-width:0;}
    .vlm-context-text b{color:#1f2733;}
    .vlm-context-text small{color:#7a8492;overflow:hidden;text-overflow:ellipsis;}
    .vlm-grant-current{background:#fff6e7;border-radius:10px;padding:10px 12px;font-size:12.5px;color:#7a5a00;margin-bottom:12px;}
    .vlm-grant-current ul{margin:4px 0;padding-left:18px;}
    .vlm-grant-current small{color:#a8925c;}
    .vlm-grant-plans{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px;margin-bottom:14px;}
    .vlm-grant-plan{border:1.5px solid #e4e7ec;border-radius:10px;padding:9px 11px;cursor:pointer;margin:0;display:flex;flex-direction:column;font-weight:400;}
    .vlm-grant-plan input{position:absolute;opacity:0;width:0;height:0;}
    .vlm-grant-plan b{font-size:13px;color:#1f2733;}
    .vlm-grant-plan small{font-size:11.5px;color:#8a94a2;}
    .vlm-grant-plan.active{border-color:var(--pc,#16aaff);background:color-mix(in srgb, var(--pc,#16aaff) 7%, white);}
    .vlm-grant-plan.active b{color:var(--pc,#16aaff);}
    .vlm-grant-plan:focus-within{outline:2px solid var(--pc,#16aaff);outline-offset:1px;}
    .vlm-grant-courses{border:1px solid #eef1f6;border-radius:10px;max-height:220px;overflow:auto;margin-bottom:14px;}
    .vlm-grant-courses .vlm-pick{display:flex;align-items:center;gap:10px;padding:8px 12px;margin:0;border-top:1px solid #f1f3f6;font-weight:600;font-size:13px;cursor:pointer;}
    .vlm-grant-courses .vlm-pick:first-child{border-top:none;}
    .vlm-grant-courses .vlm-pick.is-fixed{cursor:default;color:#5a6472;}
    #vlmGrantPickCount.is-bad{color:#d92550;}
    .vlm-grant-problem{flex:1;font-size:12px;color:#8a94a2;}
    .vlm-grant-mode{display:inline-flex;margin-bottom:6px;}
    .vlm-dur-row{display:flex;gap:8px;max-width:280px;}
    .vlm-dur-row .vlm-dur-value{width:96px;flex-shrink:0;}
    .vlm-dur-presets{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px;}
    .vlm-dur-preset{border:1.5px solid #e4e7ec;background:#fff;color:#5a6472;border-radius:20px;padding:3px 11px;font-size:12px;font-weight:700;cursor:pointer;}
    .vlm-dur-preset:hover{border-color:var(--pc,#16aaff);color:var(--pc,#16aaff);}
    .vlm-dur-preset.active{background:var(--pc,#16aaff);border-color:var(--pc,#16aaff);color:#fff;}
    .vlm-dur-end{display:block;margin-top:6px;font-size:12px;font-weight:600;color:#16a87a;}
    .vlm-dur-end.is-bad{color:#d92550;}
    .vlm-bulk-filters{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:10px;}
    .vlm-bulk-filters .vlm-search-box{flex:1;min-width:200px;}
    .vlm-bulk-head{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:8px 12px;background:#f7f9fc;border:1px solid #eef1f6;border-bottom:none;border-radius:10px 10px 0 0;}
    .vlm-bulk-all{display:flex;align-items:center;gap:8px;margin:0;font-size:12.5px;font-weight:700;color:#3a4250;cursor:pointer;}
    .vlm-bulk-all input,.vlm-bulk-row input{width:16px;height:16px;accent-color:var(--pc,#16aaff);flex-shrink:0;}
    .vlm-bulk-list{border:1px solid #eef1f6;border-radius:0 0 10px 10px;max-height:260px;overflow:auto;margin-bottom:12px;}
    .vlm-bulk-row{display:flex;align-items:center;gap:10px;padding:8px 12px;margin:0;border-top:1px solid #f1f3f6;cursor:pointer;font-weight:400;}
    .vlm-bulk-row:first-child{border-top:none;}
    .vlm-bulk-row.is-picked{background:color-mix(in srgb, var(--pc,#16aaff) 7%, white);}
    .vlm-bulk-row.is-off{cursor:default;opacity:.75;}
    .vlm-bulk-who{display:flex;flex-direction:column;min-width:0;flex:1;}
    .vlm-bulk-who b{font-size:13px;color:#1f2733;}
    .vlm-bulk-who small{font-size:11.5px;color:#8a94a2;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
    .vlm-bulk-empty{font-size:13px;color:#8a94a2;padding:16px 4px;}
    .vlm-bulk-more{font-size:12px;color:#8a94a2;margin:-6px 0 12px;}
    .vlm-bulk-result{list-style:none;padding:0;margin:0 0 6px;max-height:240px;overflow:auto;}
    .vlm-bulk-result li{padding:7px 0;border-top:1px solid #f1f3f6;font-size:13px;}
    .vlm-bulk-result small{display:block;color:#8a94a2;}
    .vlm-pd-readonly{background:#f1f5fb;color:#4a5462;border-radius:10px;padding:9px 12px;font-size:12.5px;font-weight:600;margin:-4px 0 14px;}
    .vlm-pd-readonly i{color:var(--pc,#16aaff);margin-right:4px;}
    .vlm-readonly .vlm-handle,.vlm-readonly .vlm-more,.vlm-readonly .vlm-ls-actions,.vlm-readonly .vlm-link-btn,
    .vlm-readonly .vlm-add-video-btn,.vlm-readonly .vlm-tray-hint{display:none !important;}
    .vlm-grant-meta{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:0 14px;}
    .vlm-grant-meta.is-lifetime{grid-template-columns:1fr;}
    .vlm-viewbar .vlm-views{margin-bottom:0;}
    .vlm-pl-group{font-size:12px;font-weight:800;color:#5a6472;text-transform:uppercase;letter-spacing:.5px;margin:18px 0 10px;}
    .vlm-pl-group:first-child{margin-top:0;}
    .vlm-pl-group span{background:#e9edf3;color:#5a6472;border-radius:20px;padding:1px 8px;font-size:10.5px;margin-left:4px;}
    .vlm-pl-card{background:#fff;border:1px solid #eef1f6;border-radius:14px;padding:14px 16px;cursor:pointer;box-shadow:0 2px 10px rgba(16,42,67,.04);transition:box-shadow .2s ease,border-color .2s ease;outline:none;}
    .vlm-pl-card:hover,.vlm-pl-card:focus{border-color:color-mix(in srgb, var(--pc,#16aaff) 45%, white);box-shadow:0 10px 24px rgba(16,42,67,.10);}
    .vlm-pl-top{display:flex;align-items:center;gap:6px;}
    .vlm-pl-card.is-empty{background:#fafbfc;border-style:dashed;box-shadow:none;}
    .vlm-pl-card.is-empty .vlm-pl-title{color:#5a6472;}
    .vlm-pl-tip{font-size:12.5px;color:#8a94a2;margin:-6px 0 14px;}
    .vlm-pl-tip i{color:var(--pc,#16aaff);margin-right:4px;}
    .vlm-pl-found{font-size:13px;font-weight:600;color:#495057;margin:-6px 0 12px;}
    .vlm-pl-loose{background:#fff6e7;color:#c48a00;font-size:10.5px;font-weight:700;padding:3px 9px;border-radius:20px;}
    .vlm-pl-title{font-size:15px;font-weight:700;color:#1f2733;margin:9px 0 6px;line-height:1.3;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:39px;}
    .vlm-pl-meta{display:flex;align-items:center;font-size:12px;color:#7a8492;font-weight:600;}
    .vlm-pl-arrow{margin-left:auto;color:var(--pc,#16aaff);font-size:18px;}
    /* course page */
    .vlm-back-btn{border:1.5px solid #e4e7ec;background:#fff;color:#555;border-radius:10px;width:38px;height:38px;font-size:14px;cursor:pointer;flex-shrink:0;}
    .vlm-back-btn:hover{border-color:var(--pc,#16aaff);color:var(--pc,#16aaff);}
    .vlm-ghost-btn{border:1.5px solid color-mix(in srgb, var(--pc,#16aaff) 45%, white);background:#fff;color:var(--pc,#16aaff);border-radius:10px;padding:8px 16px;font-weight:600;font-size:13px;flex-shrink:0;white-space:nowrap;}
    .vlm-ghost-btn:hover{background:var(--pc,#16aaff);color:#fff;}
    .vlm-loading{font-size:13px;color:#a0a8b3;padding:20px 2px;}
    .vlm-pd-hint{font-size:12px;color:#8a94a2;margin:-4px 0 14px;}
    .vlm-pd-hint i{color:#b5bcc6;margin:0 2px;}
    .vlm-pd-hint .fa-star{color:#f7b924;}
    .vlm-pd-module{display:flex;align-items:center;justify-content:space-between;font-size:12px;font-weight:800;color:var(--pc,#16aaff);text-transform:uppercase;letter-spacing:.5px;margin:18px 0 8px;}
    .vlm-pd-module em{color:#8a94a2;font-weight:600;font-style:normal;text-transform:none;letter-spacing:0;}
    .vlm-pd-lessons > .vlm-pd-module:first-child{margin-top:0;}
    .vlm-link-btn{border:none;background:none;color:var(--pc,#16aaff);font-size:12px;font-weight:700;text-transform:none;letter-spacing:0;cursor:pointer;padding:2px 4px;}
    .vlm-link-btn:hover{text-decoration:underline;}
    .vlm-ls{background:#fff;border:1px solid #eef1f6;border-radius:14px;margin-bottom:10px;box-shadow:0 2px 8px rgba(16,42,67,.04);}
    .vlm-ls-head{display:flex;align-items:center;gap:10px;padding:9px 12px;border-bottom:1px solid #f1f3f6;}
    .vlm-ls-actions{display:flex;align-items:center;gap:4px;flex-shrink:0;}
    .vlm-add-video-btn{border:none;background:color-mix(in srgb, var(--pc,#16aaff) 10%, white);color:var(--pc,#16aaff);font-size:12px;font-weight:700;border-radius:8px;padding:6px 11px;cursor:pointer;white-space:nowrap;}
    .vlm-add-video-btn:hover{background:var(--pc,#16aaff);color:#fff;}
    .vlm-icon-circle.vlm-plain{width:30px;height:30px;background:transparent;color:#9aa3af;}
    .vlm-icon-circle.vlm-plain:hover{background:#f1f3f6;color:#4a5462;}
    .vlm-icon-circle.vlm-plain-del:hover{background:#fde8ee;color:#d92550;}
    .vlm-ls-videos{padding:4px 12px;min-height:44px;}
    .vlm-ls-videos:empty::before{content:'No video yet — drag one here or click + Video';display:block;font-size:12.5px;color:#a0a8b3;padding:12px 2px;}
    .vlm-handle{color:#c3c9d2;cursor:grab;flex-shrink:0;padding:6px 4px;font-size:13px;touch-action:none;}
    .vlm-handle:hover{color:var(--pc,#16aaff);}
    .vlm-no-drag .vlm-handle{display:none;}
    .vlm-vr{display:flex;align-items:center;gap:10px;padding:7px 0;border-bottom:1px dashed #eef1f6;background:#fff;}
    .vlm-vr:last-child{border-bottom:none;}
    .vlm-vr-thumb{position:relative;width:88px;aspect-ratio:16/9;flex-shrink:0;border-radius:8px;background:#0b1020 center/cover no-repeat;cursor:pointer;}
    .vlm-vr-tags{display:flex;gap:6px;margin-top:4px;flex-wrap:wrap;}
    .vlm-more{appearance:none;-webkit-appearance:none;width:32px;height:32px;flex-shrink:0;border:none;border-radius:8px;background:transparent;color:#6b7583;font-size:18px;font-weight:700;text-align:center;text-align-last:center;cursor:pointer;padding:0;line-height:1;}
    .vlm-more:hover,.vlm-more:focus{background:#f1f3f6;outline:none;}
    .vlm-tray{background:#fffdf7;border:1.5px dashed #f2d48a;border-radius:14px;margin-bottom:16px;}
    .vlm-tray-head{font-size:13px;font-weight:700;color:#8a6200;padding:10px 12px 4px;}
    .vlm-tray-head i{color:#f7b924;margin-right:4px;}
    .vlm-tray-count{background:#f7b924;color:#fff;border-radius:20px;padding:0 7px;font-size:11px;margin-left:2px;}
    .vlm-tray-hint{font-weight:500;color:#a8925c;}
    .vlm-tray .vlm-vr{background:transparent;}
    /* drag & drop (SortableJS) */
    .vlm-drag-ghost{opacity:.45;background:color-mix(in srgb, var(--pc,#16aaff) 8%, white) !important;border-radius:10px;}
    .vlm-drag-chosen{box-shadow:0 10px 24px rgba(16,42,67,.16);border-radius:10px;}
    .vlm-saving{opacity:.7;pointer-events:none;transition:opacity .15s ease;}
    @media (max-width:575px){
        .vlm-header{align-items:flex-start;}
        .vlm-add-btn{width:100%;display:flex;align-items:center;justify-content:center;}
        .vlm-toolbar{flex-direction:column;align-items:stretch;}
        .vlm-search-box{width:100%;min-width:0;}
        .vlm-sort-box select{width:100%;}
        .vlm-views{display:flex;}
        .vlm-view-btn{flex:1;justify-content:center;}
        .vlm-pl-search{max-width:none;}
        .vlm-viewbar{flex-direction:column;align-items:stretch;}
        .vlm-view-btn{padding:8px 4px;font-size:12px;gap:5px;white-space:nowrap;}
        .vlm-box{padding:14px;}
        .vlm-box-head .vlm-add-btn{width:100%;}
        .vlm-fee-head{display:none;}
        .vlm-fee-row{grid-template-columns:1fr 1fr;gap:8px 10px;padding:12px;}
        .vlm-fee-grade{grid-column:1/-1;}
        .vlm-fee-label{display:block;font-size:11px;font-weight:700;color:#5a6472;margin-bottom:3px;}
        .vlm-fee-label small{font-weight:600;color:#9aa0a6;}
        .vlm-grade-box select{width:100%;}
        .vlm-pd-head{gap:10px;}
        .vlm-pd-head .vlm-ghost-btn{width:100%;}
        .vlm-add-video-btn span{display:none;}
        .vlm-vr-thumb{width:64px;}
        .vlm-views{flex-wrap:wrap;}
        .vlm-view-btn{flex:1 1 45%;}
        .vlm-stats{grid-template-columns:1fr 1fr;}
        .vlm-stat:last-child{grid-column:1/-1;}
        .vlm-subs-filters .vlm-search-box,.vlm-subs-filters .vlm-sort-box{flex:1 1 100%;min-width:0;}
        .vlm-sub-head{display:none;}
        .vlm-sub-row{grid-template-columns:1fr auto;gap:6px 10px;padding:12px;}
        .vlm-sub-student,.vlm-sub-plan{grid-column:1/-1;}
        .vlm-sub-student{order:-2;}
        .vlm-sub-row > div:nth-child(3){order:-1;grid-column:1/-1;}
        .vlm-sub-label{display:block;font-size:10.5px;font-weight:700;color:#9aa0a6;}
        .vlm-sub-amount{text-align:right;}
        .vlm-sub-actions{grid-column:1/-1;text-align:left;}
        .vlm-sub-actions:empty{display:none;}
        .vlm-subs-more{flex-direction:column;align-items:stretch;text-align:center;}
        .vlm-grant-plans{grid-template-columns:1fr 1fr;}
        .vlm-grant-meta{grid-template-columns:1fr;}
        .vlm-grant-mode{display:flex;}
        .vlm-bulk-filters .vlm-search-box,.vlm-bulk-filters .vlm-sort-box{flex:1 1 100%;min-width:0;}
        .vlm-bulk-filters .vlm-sort-box select{width:100%;}
        .vlm-dur-row{max-width:none;}
        .vlm-ls-head{gap:6px;padding:8px;}
        .vlm-ls-videos{padding:4px 8px;}
    }
    </style>`;
}
