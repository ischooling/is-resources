/* =====================================================================
 * Video Library — Student (Videos) : HTML template builders
 * Paired logic file: studentVideoLibrary.js
 * Rendered into #dashboardContentInHTML by initStudentVideoLibrary().
 * Read-only subject-wise gallery of the student's subject videos.
 * ===================================================================== */

function getStudentVideoLibraryPageContent(title) {
    return `
    <div class="custom-field-scope svl-scope">
        <div class="svl-hero">
            <div class="svl-hero-inner">
                <div class="svl-hero-icon svl-reveal"><i class="fa fa-play-circle"></i></div>
                <div>
                    <div class="svl-hero-title svl-reveal">${title}</div>
                    <div class="svl-hero-sub svl-reveal">Learning videos for your subjects</div>
                </div>
                <div class="svl-hero-search svl-reveal">
                    <i class="fa fa-search"></i>
                    <input type="text" id="svlSearch" placeholder="Search videos..."/>
                </div>
            </div>
        </div>

        <div id="svlChips" class="svl-chips svl-reveal"></div>
        <div id="svlGrid" class="svl-grid"></div>
    </div>

    ${getStudentVideoLibraryStyles()}
    `;
}

function renderStudentVideoCards(videos) {
    if (!videos || videos.length === 0) {
        return `
        <div class="svl-empty">
            <div class="svl-empty-icon"><i class="fa fa-film"></i></div>
            <div class="svl-empty-title">No videos yet</div>
            <div class="svl-empty-text">Videos for your subjects will appear here once added.</div>
        </div>`;
    }
    return videos.map(function (v) {
        var thumb = svlThumbUrl(v);
        var badge = v.subjectName ? v.subjectName : 'Subject';
        return `
        <div class="svl-card" data-id="${v.id}" onclick="svlPlayVideo(${v.id})">
            <div class="svl-card-thumb">
                <img src="${thumb}" alt="thumb" onerror="this.src='${svlFallbackThumb()}'"/>
                <div class="svl-play-overlay"><i class="fa fa-play"></i></div>
                <span class="svl-card-dur">${v.videoType === 'FILE' ? 'Video' : 'YouTube'}</span>
            </div>
            <div class="svl-card-body">
                <div class="svl-card-badge" title="${svlEsc(badge)}">${svlEsc(badge)}</div>
                <div class="svl-card-title" title="${svlEsc(v.title)}">${svlEsc(v.title)}</div>
                <div class="svl-card-desc">${svlEsc(v.description || '')}</div>
            </div>
        </div>`;
    }).join('');
}

function renderStudentSubjectChips(subjects) {
    var chips = '<button class="svl-chip active" data-subject="0" onclick="svlFilterSubject(0,this)"><span class="svl-chip-txt">All</span></button>';
    chips += subjects.map(function (s) {
        return '<button class="svl-chip" title="' + svlEsc(s.subjectName) + '" data-subject="' + s.subjectId + '" onclick="svlFilterSubject(' + s.subjectId + ',this)">'
            + '<span class="svl-chip-txt">' + svlEsc(s.subjectName) + '</span></button>';
    }).join('');
    return chips;
}

function getStudentVideoPlayerModalHtml() {
    return `
    <div class="modal fade svl-player-modal" id="svlPlayerModal" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div class="modal-content svl-modal-content">
          <div class="modal-header svl-modal-header">
            <div>
                <h5 class="modal-title" id="svlPlayerTitle">Video</h5>
                <div class="svl-player-subject" id="svlPlayerSubject"></div>
            </div>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close" onclick="svlStopPlayer()"><span>&times;</span></button>
          </div>
          <div class="modal-body p-0">
            <div class="svl-player-frame" id="svlPlayerFrame"></div>
          </div>
          <div class="modal-footer svl-player-footer">
            <div class="svl-player-desc" id="svlPlayerDesc"></div>
          </div>
        </div>
      </div>
    </div>`;
}

function getStudentVideoLibraryStyles() {
    return `
    <style>
    .svl-scope{width:100%;display:block;box-sizing:border-box;padding:18px 0 34px;}
    .svl-scope *{box-sizing:border-box;}
    .svl-scope .svl-hero{background:var(--pc,#16aaff);border-radius:18px;padding:22px 24px;margin-bottom:18px;color:#fff;box-shadow:0 12px 30px color-mix(in srgb, var(--pc,#16aaff) 28%, transparent);}
    .svl-hero-inner{display:flex;align-items:center;gap:16px;flex-wrap:wrap;}
    .svl-hero-icon{width:52px;height:52px;border-radius:14px;background:rgba(255,255,255,.18);display:flex;align-items:center;justify-content:center;font-size:26px;}
    .svl-hero-title{font-size:21px;font-weight:700;}
    .svl-hero-sub{font-size:13px;opacity:.9;margin-top:2px;}
    .svl-hero-search{margin-left:auto;position:relative;min-width:230px;}
    .svl-hero-search i{position:absolute;left:14px;top:50%;transform:translateY(-50%);color:#8a93d8;}
    .svl-hero-search input{width:100%;border:0;border-radius:30px;padding:10px 16px 10px 38px;font-size:13px;color:#333;outline:none;box-shadow:0 4px 14px rgba(0,0,0,.12);}
    .svl-chips{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px;}
    .svl-chip{border:1.5px solid #e2e6ef;background:#fff;color:#555;border-radius:30px;padding:6px 16px;font-size:12.5px;font-weight:600;cursor:pointer;transition:all .15s ease;display:inline-flex;align-items:center;max-width:220px;}
    .svl-chip-txt{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
    .svl-chip:hover{border-color:var(--pc,#16aaff);color:var(--pc,#16aaff);}
    .svl-chip.active{background:var(--pc,#16aaff);border-color:transparent;color:#fff;box-shadow:0 5px 14px color-mix(in srgb, var(--pc,#16aaff) 30%, transparent);}
    .svl-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:18px;}
    .svl-card{background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 6px 20px rgba(0,0,0,.06);cursor:pointer;opacity:0;transform:translateY(16px);transition:box-shadow .2s ease,transform .2s ease;}
    .svl-card.svl-in{opacity:1;transform:none;}
    .svl-card:hover{box-shadow:0 16px 34px rgba(0,0,0,.14);transform:translateY(-5px);}
    .svl-card-thumb{position:relative;aspect-ratio:16/9;background:#0b1020;overflow:hidden;}
    .svl-card-thumb img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .35s ease;}
    .svl-card:hover .svl-card-thumb img{transform:scale(1.08);}
    .svl-play-overlay{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(10,12,25,.28);color:#fff;opacity:0;transition:opacity .2s ease;}
    .svl-card:hover .svl-play-overlay{opacity:1;}
    .svl-play-overlay i{background:rgba(255,255,255,.26);width:60px;height:60px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:22px;backdrop-filter:blur(2px);padding-left:4px;}
    .svl-card-dur{position:absolute;bottom:8px;right:8px;background:rgba(0,0,0,.65);color:#fff;font-size:10px;padding:2px 8px;border-radius:20px;}
    .svl-card-body{padding:12px 14px 14px;}
    .svl-card-badge{display:inline-block;max-width:100%;background:color-mix(in srgb, var(--pc,#16aaff) 10%, white);color:var(--pc,#16aaff);font-size:11px;font-weight:600;padding:2px 10px;border-radius:20px;margin-bottom:7px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;vertical-align:middle;}
    .svl-card-title{font-size:14.5px;font-weight:700;color:#242424;line-height:1.25;margin-bottom:4px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:36px;}
    .svl-card-desc{font-size:12px;color:#8a8f98;line-height:1.35;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:32px;}
    .svl-empty{grid-column:1/-1;text-align:center;padding:60px 20px;color:#9aa0a6;}
    .svl-empty-icon{font-size:48px;color:#d8dbe0;margin-bottom:10px;}
    .svl-empty-title{font-size:18px;font-weight:700;color:#5a5f66;}
    .svl-empty-text{font-size:13px;margin-top:4px;}
    .svl-player-modal .modal-dialog{box-shadow:none !important;background:transparent !important;}
    .svl-modal-content{border:none;border-radius:16px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.3);}
    .svl-modal-header{background:var(--pc,#16aaff);color:#fff;border:none;align-items:flex-start;}
    .svl-modal-header .close{color:#fff;opacity:.9;text-shadow:none;}
    .svl-player-subject{font-size:12px;opacity:.85;margin-top:2px;}
    .svl-player-frame iframe,.svl-player-frame video{width:100%;aspect-ratio:16/9;border:0;display:block;background:#000;}
    .svl-player-footer{border:0;padding:12px 18px;}
    .svl-player-desc{font-size:13px;color:#666;line-height:1.4;}
    @media (max-width:575px){.svl-hero-search{margin-left:0;width:100%;}}
    </style>`;
}
