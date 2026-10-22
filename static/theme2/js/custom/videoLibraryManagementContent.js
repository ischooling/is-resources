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
                    <div class="vlm-subtitle vlm-reveal">Upload &amp; organise learning videos by subject</div>
                </div>
            </div>
            <button type="button" class="btn vlm-add-btn vlm-reveal" onclick="vlmOpenAddModal()">
                <i class="fa fa-plus mr-1"></i> Add Video
            </button>
        </div>

        <div class="vlm-stats vlm-reveal" id="vlmStats"></div>

        <div class="vlm-toolbar vlm-reveal">
            <div class="vlm-chips" id="vlmChips"></div>
            <div class="vlm-search-box">
                <i class="fa fa-search"></i>
                <input type="text" id="vlmSearch" placeholder="Search videos..." />
            </div>
        </div>

        <div id="vlmGrid" class="vlm-grid"></div>
    </div>

    ${getVideoLibraryStyles()}
    `;
}

/* stats pills */
function renderVideoLibraryStats(videos) {
    var total = videos.length;
    var active = videos.filter(function (v) { return v.status === 'ACTIVE'; }).length;
    var subjects = {};
    videos.forEach(function (v) { if (v.subjectId) { subjects[v.subjectId] = true; } });
    var subjCount = Object.keys(subjects).length;
    return `
        <div class="vlm-stat"><div class="vlm-stat-num">${total}</div><div class="vlm-stat-lbl">Total videos</div></div>
        <div class="vlm-stat"><div class="vlm-stat-num">${active}</div><div class="vlm-stat-lbl">Active</div></div>
        <div class="vlm-stat"><div class="vlm-stat-num">${subjCount}</div><div class="vlm-stat-lbl">Subjects</div></div>`;
}

/* subject filter chips (admin) */
function renderVideoLibraryChips(subjects, counts) {
    var chips = '<button class="vlm-chip active" data-subject="0" onclick="vlmFilterChip(0,this)"><span class="vlm-chip-txt">All</span></button>';
    chips += subjects.map(function (s) {
        var c = counts && counts[s.subjectId] ? '<span class="vlm-chip-count">' + counts[s.subjectId] + '</span>' : '';
        return '<button class="vlm-chip" title="' + vlmEsc(s.subjectName) + '" data-subject="' + s.subjectId + '" onclick="vlmFilterChip(' + s.subjectId + ',this)">'
            + '<span class="vlm-chip-txt">' + vlmEsc(s.subjectName) + '</span>' + c + '</button>';
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
        var desc = vlmEsc(v.description || '');
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
                    <span class="vlm-card-status ${isActive ? 'is-active' : 'is-inactive'}">${isActive ? 'Active' : 'Inactive'}</span>
                </div>
                <div class="vlm-card-title" title="${vlmEsc(v.title)}">${vlmEsc(v.title)}</div>
                ${desc ? `<div class="vlm-card-desc">${desc}</div>` : '<div class="vlm-card-desc vlm-card-desc-empty">No description</div>'}
                <div class="vlm-card-actions">
                    <button class="vlm-play-btn" onclick="vlmPlayVideo(${v.id})"><i class="fa fa-play"></i><span>Play</span></button>
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
            <div class="form-group vlm-hidden" id="vlmSubjectVideosWrap">
                <label class="vlm-label"><i class="fa fa-film mr-1"></i>Already uploaded for this course</label>
                <div id="vlmSubjectVideos" class="vlm-sv-strip"></div>
            </div>
            <!-- 3) Title + Status -->
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
            <!-- 4) Overview -->
            <div class="form-group">
                <label class="vlm-label">Overview</label>
                <textarea id="vlmDescription" class="form-control" rows="2" maxlength="1000" placeholder="Short overview (optional)"></textarea>
            </div>
            <!-- 5) Upload Video -->
            <div class="form-group">
                <label class="vlm-label">Upload Video</label>
                <div class="vlm-source-toggle">
                    <label class="vlm-source-opt active" id="vlmSrcYoutubeLbl">
                        <input type="radio" name="vlmSource" value="URL" checked onchange="vlmToggleSource('URL')"/>
                        <i class="fa fa-youtube-play"></i> Upload from Youtube
                    </label>
                    <label class="vlm-source-opt" id="vlmSrcFileLbl">
                        <input type="radio" name="vlmSource" value="FILE" onchange="vlmToggleSource('FILE')"/>
                        <i class="fa fa-desktop"></i> Upload from system
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
            <!-- 6) Custom thumbnail (optional) -->
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
          <div class="modal-footer vlm-modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-success vlm-save-btn" onclick="vlmSaveVideo()">
                <i class="fa fa-check mr-1"></i> Save Video
            </button>
          </div>
        </div>
      </div>
    </div>`;
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
            <div class="vlm-confirm-title">Remove this video?</div>
            <div class="vlm-confirm-text">Students will no longer see it. This can be re-added later.</div>
            <div class="vlm-confirm-actions">
                <button type="button" class="btn vlm-confirm-cancel" data-dismiss="modal">Cancel</button>
                <button type="button" class="btn vlm-confirm-yes" id="vlmConfirmDeleteBtn">Yes, remove</button>
            </div>
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
    .vlm-scope .vlm-subtitle{font-size:12.5px;color:#7a7a7a;margin-top:2px;}
    .vlm-header{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:16px;}
    .vlm-header-left{display:flex;align-items:center;flex:1;min-width:0;}
    .vlm-title-icon{background:var(--pc,#16aaff);color:#fff;border-radius:12px;width:46px;height:46px;display:flex;align-items:center;justify-content:center;font-size:21px;margin-right:12px;box-shadow:0 6px 16px color-mix(in srgb, var(--pc,#16aaff) 35%, transparent);}
    .vlm-add-btn{background:var(--pc,#16aaff);color:#fff;border:none;border-radius:10px;padding:10px 20px;font-weight:600;box-shadow:0 6px 16px color-mix(in srgb, var(--pc,#16aaff) 30%, transparent);transition:transform .15s ease,box-shadow .15s ease;flex-shrink:0;white-space:nowrap;}
    .vlm-add-btn:hover{color:#fff;transform:translateY(-2px);box-shadow:0 10px 22px color-mix(in srgb, var(--pc,#16aaff) 42%, transparent);}
    .vlm-stats{display:flex;gap:14px;flex-wrap:wrap;margin-bottom:16px;}
    .vlm-stat{background:#fff;border-radius:14px;padding:14px 20px;min-width:120px;box-shadow:0 4px 16px rgba(0,0,0,.05);border-left:4px solid var(--pc,#16aaff);}
    .vlm-stat:nth-child(2){border-left-color:#16d39a;}
    .vlm-stat:nth-child(3){border-left-color:#f7b924;}
    .vlm-stat-num{font-size:24px;font-weight:800;color:#2a2f3a;line-height:1;}
    .vlm-stat-lbl{font-size:11.5px;color:#8a8f98;font-weight:600;margin-top:5px;text-transform:uppercase;letter-spacing:.4px;}
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
    .vlm-card-status{margin-left:auto;flex-shrink:0;font-size:10px;font-weight:700;padding:3px 9px;border-radius:20px;text-transform:uppercase;letter-spacing:.3px;display:inline-flex;align-items:center;gap:4px;}
    .vlm-card-status::before{content:'';width:6px;height:6px;border-radius:50%;}
    .vlm-card-status.is-active{background:#e4faf2;color:#0ea67b;}
    .vlm-card-status.is-active::before{background:#16d39a;}
    .vlm-card-status.is-inactive{background:#f1f3f5;color:#9098a3;}
    .vlm-card-status.is-inactive::before{background:#c2c8d0;}
    .vlm-card-title{font-size:15px;font-weight:700;color:#1f2733;line-height:1.3;margin-bottom:3px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:39px;}
    .vlm-card-desc{font-size:12.5px;color:#8a94a2;line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:35px;margin-bottom:12px;}
    .vlm-card-desc-empty{font-style:italic;color:#c0c7d0;}
    .vlm-card-actions{display:flex;align-items:center;gap:8px;}
    .vlm-play-btn{flex:1;display:inline-flex;align-items:center;justify-content:center;gap:7px;background:var(--pc,#16aaff);color:#fff;border:none;border-radius:10px;padding:9px 0;font-size:13px;font-weight:700;cursor:pointer;transition:background .15s ease,box-shadow .15s ease,transform .1s ease;box-shadow:0 5px 14px color-mix(in srgb, var(--pc,#16aaff) 30%, transparent);}
    .vlm-play-btn:hover{background:color-mix(in srgb, var(--pc,#16aaff) 85%, black);box-shadow:0 8px 18px color-mix(in srgb, var(--pc,#16aaff) 40%, transparent);}
    .vlm-play-btn:active{transform:translateY(1px);}
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
    @media (max-width:575px){
        .vlm-header{align-items:flex-start;}
        .vlm-add-btn{width:100%;display:flex;align-items:center;justify-content:center;}
        .vlm-toolbar{flex-direction:column;align-items:stretch;}
        .vlm-search-box{width:100%;min-width:0;}
    }
    </style>`;
}
