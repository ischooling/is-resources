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
            <div class="vlm-empty-text">Click <strong>Add lesson</strong> to build this course's playlist.</div>
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
        <button type="button" class="btn vlm-ghost-btn" onclick="vlmOpenLessonModal(0)"><i class="fa fa-plus mr-1"></i> Add lesson</button>
    </div>
    <div class="vlm-pd-hint"><i class="fa fa-arrows"></i> Drag <i class="fa fa-bars"></i> to rearrange. The first video of a lesson (<i class="fa fa-star"></i>) is the one students get first.</div>
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
    .vlm-viewbar{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:16px;}
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
        .vlm-grade-box select{width:100%;}
        .vlm-pd-head{gap:10px;}
        .vlm-pd-head .vlm-ghost-btn{width:100%;}
        .vlm-add-video-btn span{display:none;}
        .vlm-vr-thumb{width:64px;}
        .vlm-ls-head{gap:6px;padding:8px;}
        .vlm-ls-videos{padding:4px 8px;}
    }
    </style>`;
}
