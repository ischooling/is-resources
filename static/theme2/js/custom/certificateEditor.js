/*
 * certificateEditor.js
 * Behaviour of the visual certificate editor (drag, resize, properties, images,
 * undo, save, PDF preview). Markup, designs and the HTML serializer live in
 * certificateEditorContent.js. Talks to the API through cfmPost / cfmMutate /
 * cfmApiBase from certificateManagement.js.
 */

var cfeState = {
    templateId: null,
    status: 'Active',
    layout: null,
    selectedId: null,
    undo: [],
    dirty: false,
    scale: 1,
    drag: null,
    imageTarget: null,
    nextId: 0,
    pageMode: 'new'      // what the page chooser is open for: 'new' template or 'change' the open one
};

var CFE_SNAP_MM = 1.5;
var CFE_UNDO_MAX = 60;

/* ---- open / close ---- */

/* page: {format, orientation} for a new template (from the page chooser) */
function cfeOpen(template, page) {
    cfeState.templateId = template ? template.id : null;
    cfeState.status = template && template.status ? template.status : 'Active';
    cfeState.selectedId = null;
    cfeState.undo = [];
    cfeState.dirty = false;
    cfeState.drag = null;
    cfeState.nextId = 0;

    var layout = null;
    if (template && template.layoutJson) {
        try { layout = JSON.parse(template.layoutJson); } catch (e) { layout = null; }
    }
    var fresh = !layout || !layout.elements;
    if (fresh) {
        layout = { version: 1, background: { type: 'design', design: 'navy' }, elements: CFE_STARTERS.navy() };
    }
    // the template's saved size wins; templates from before the chooser are A4 landscape
    var pg = template && template.pageFormat ? { format: template.pageFormat, orientation: template.orientation }
        : (layout.page || page || {});
    cfeSetPage(pg.format, pg.orientation);
    layout.page = { format: CFE_PAGE.format, orientation: CFE_PAGE.orientation };
    if (fresh) { cfeScaleElements(layout.elements, CFE_BASE.w, CFE_BASE.h); }
    layout.elements.forEach(function (el) { el.id = cfeNewId(); });
    cfeState.layout = layout;

    $('#cfeRoot').remove();
    $('.cfm-scope').hide();
    $('#dashboardContentInHTML').append(getCertificateEditorHtml());
    $('#cfeName').val(template ? (template.templateName || '') : 'New certificate');
    $('#cfeCategoryBox').html(cfmCategorySelectHtml('cfeCategory', template ? (template.category || '') : '', 'cfe-cat'));
    if (layout.background && layout.background.type === 'color') { $('#cfeBgColor').val(cfeColor(layout.background.color, '#ffffff')); }

    cfeBindEvents();
    cfeFitStage();
    cfeRender();
    cfeShowProps();
}

function cfeClose() {
    if (!cfeState.dirty) { cfeDoClose(); return; }
    cfmDialog({
        title: 'Unsaved changes', tone: 'danger', okText: 'Leave without saving', cancelText: 'Keep editing',
        message: 'You have unsaved changes. Leave the editor anyway?'
    }).then(function (r) { if (r) { cfeDoClose(); } });
}

function cfeDoClose() {
    $(document).off('.cfe');
    $(window).off('.cfe');
    $('#cfeRoot').remove();
    $('.cfm-scope').show();
    if (typeof cfmLoadTemplates === 'function') { cfmLoadTemplates(); }
}

function cfeBindEvents() {
    $(document).off('.cfe');
    $(window).off('.cfe');
    $(window).on('resize.cfe', function () { cfeFitStage(); cfeDrawSelection(); });

    $(document).on('mousedown.cfe', '#cfePage', function (e) {
        if (e.button !== 0) { return; }
        var $handle = $(e.target).closest('.cfe-handle');
        var $el = $(e.target).closest('[data-cfe-id]');
        if ($handle.length) {
            e.preventDefault();
            var sel = cfeSelected();
            if (sel) { cfeState.drag = { mode: 'resize', id: sel.id, sx: e.clientX, sy: e.clientY, ow: sel.w, oh: sel.h, moved: false }; }
        } else if ($el.length) {
            e.preventDefault();
            var el = cfeFind($el.attr('data-cfe-id'));
            if (!el) { return; }
            if (cfeState.selectedId !== el.id) { cfeSelect(el.id); }
            cfeState.drag = { mode: 'move', id: el.id, sx: e.clientX, sy: e.clientY, ox: el.x, oy: el.y, moved: false };
        } else {
            cfeSelect(null);
        }
    });
    $(document).on('mousemove.cfe', function (e) { if (cfeState.drag) { cfeDragTo(e); } });
    $(document).on('mouseup.cfe', function () {
        if (!cfeState.drag) { return; }
        var moved = cfeState.drag.moved;
        cfeState.drag = null;
        $('#cfePage .cfe-guide').hide();
        if (moved) { cfeRender(); cfeShowProps(); }
    });

    $(document).on('keydown.cfe', function (e) {
        if (!document.getElementById('cfeRoot') || $(e.target).is('input, textarea, select')) { return; }
        var meta = e.ctrlKey || e.metaKey;
        if (meta && (e.key === 'z' || e.key === 'Z')) { e.preventDefault(); cfeUndo(); return; }
        var el = cfeSelected();
        if (!el) { return; }
        if (meta && (e.key === 'd' || e.key === 'D')) { e.preventDefault(); cfeDuplicate(); return; }
        if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); cfeDelete(); return; }
        var step = e.shiftKey ? 5 : 0.5;
        var moves = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
        if (moves[e.key]) {
            e.preventDefault();
            cfePushUndo();
            el.x = cfeClamp(cfeNum(el.x) + moves[e.key][0], 0, CFE_PAGE.w - cfeNum(el.w));
            el.y = cfeClamp(cfeNum(el.y) + moves[e.key][1], 0, CFE_PAGE.h - cfeNum(el.h));
            cfeRender();
            cfeShowProps();
        }
    });

    // properties panel: snapshot for undo when a control is entered, apply live while typing
    $(document).on('focusin.cfe', '#cfeProps [data-prop]', function () { cfePushUndo(); });
    $(document).on('input.cfe change.cfe', '#cfeProps [data-prop]', function () {
        var el = cfeSelected();
        if (!el) { return; }
        var prop = $(this).attr('data-prop');
        var value;
        if (this.type === 'checkbox') {
            value = this.checked;
        } else if (this.type === 'number' || this.type === 'range') {
            value = parseFloat(this.value);
            if (isNaN(value)) { return; }
            if ((prop === 'w' || prop === 'h') && value <= 0) { return; }
        } else {
            value = this.value;
        }
        el[prop] = value;
        if (el.type === 'qr' && (prop === 'w' || prop === 'h')) { el.w = el.h = value; }
        cfeState.dirty = true;
        cfeRender();
    });
    // background image visibility: one undo step per drag, applied live
    $(document).on('pointerdown.cfe keydown.cfe', '#cfeBgOpacity', function () { cfePushUndo(); });
    $(document).on('input.cfe change.cfe', '#cfeBgOpacity', function () {
        var bg = cfeState.layout.background || {};
        if (bg.type !== 'image') { return; }
        bg.opacity = parseInt(this.value, 10);
        cfeState.dirty = true;
        cfeRender();
    });
    $(document).on('change.cfe', '#cfeInsertField', function () {
        var key = this.value;
        var ta = $('#cfeProps textarea[data-prop="text"]')[0];
        this.value = '';
        if (!key || !ta) { return; }
        cfePushUndo();
        var token = '{{' + key + '}}';
        // selectionStart is 0 when the selection begins at the start, so test for a number, not truthiness
        var start = typeof ta.selectionStart === 'number' ? ta.selectionStart : ta.value.length;
        var end = typeof ta.selectionEnd === 'number' ? ta.selectionEnd : ta.value.length;
        ta.value = ta.value.substring(0, start) + token + ta.value.substring(end);
        $(ta).trigger('input');
    });
    $(document).on('change.cfe', '#cfeFile', function () {
        var file = this.files && this.files[0];
        if (file) { cfeUploadImage(file); }
    });
}

/* ---- rendering ---- */

function cfeFitStage() {
    var wrap = document.getElementById('cfeStageWrap');
    if (!wrap) { return; }
    var pageW = CFE_PAGE.w * CFE_PX_PER_MM, pageH = CFE_PAGE.h * CFE_PX_PER_MM;
    var available = Math.max(200, wrap.clientWidth - 32);
    // fit the width, and keep a tall (portrait) page within the window as well
    var tall = Math.max(320, window.innerHeight - 140);
    cfeState.scale = Math.min(1.25, available / pageW, Math.max(0.35, tall / pageH));
    $('#cfeStage').css({ width: pageW * cfeState.scale, height: pageH * cfeState.scale });
    $('#cfePage').css({ width: pageW, height: pageH, transform: 'scale(' + cfeState.scale + ')' });
}

function cfeRender() {
    var page = document.getElementById('cfePage');
    if (!page) { return; }
    var sample = $('#cfeSample').is(':checked');
    page.innerHTML = cfeBuildHtml(cfeState.layout, { editor: true, sample: sample })
        + '<div class="cfe-guide" id="cfeGuideV" style="left:' + (CFE_PAGE.w / 2) + 'mm;top:0;width:0.3mm;height:' + CFE_PAGE.h + 'mm;"></div>'
        + '<div class="cfe-guide" id="cfeGuideH" style="left:0;top:' + (CFE_PAGE.h / 2) + 'mm;width:' + CFE_PAGE.w + 'mm;height:0.3mm;"></div>';
    cfeFit(page);
    cfeDrawSelection();
    var bg = cfeState.layout.background || {};
    $('#cfeRoot .cfe-design').each(function () {
        $(this).toggleClass('active', bg.type === 'design' && $(this).attr('data-design') === bg.design);
    });
    $('#cfeUndoBtn').prop('disabled', cfeState.undo.length === 0);
    var isImage = bg.type === 'image';
    $('#cfeBgOpacityBox').toggle(isImage);
    if (isImage && !$('#cfeBgOpacity').is(':focus')) {
        var o = bg.opacity == null ? 100 : bg.opacity;
        $('#cfeBgOpacity').val(o);
        $('#cfeBgOpacityBox .cfe-opacity-val').text(o + '%');
    }
}

function cfeDrawSelection() {
    $('#cfePage .cfe-sel').remove();
    var el = cfeSelected();
    if (!el) { return; }
    var handle = 4 / cfeState.scale;   // keep the dot a usable size at any zoom
    $('#cfePage').append('<div class="cfe-sel" style="left:' + cfeNum(el.x) + 'mm;top:' + cfeNum(el.y) + 'mm;width:'
        + cfeNum(el.w) + 'mm;height:' + Math.max(cfeNum(el.h), 1) + 'mm;"><div class="cfe-handle" style="width:' + handle
        + 'mm;height:' + handle + 'mm;right:-' + (handle / 2) + 'mm;bottom:-' + (handle / 2) + 'mm;"></div></div>');
}

function cfeShowProps() {
    $('#cfeProps').html(getCertificateEditorPropsHtml(cfeSelected(), cfeState.layout.customFields));
}

/* ---- dragging / resizing ---- */

function cfeDragTo(e) {
    var d = cfeState.drag;
    var el = cfeFind(d.id);
    if (!el) { cfeState.drag = null; return; }
    var perMm = cfeState.scale * CFE_PX_PER_MM;
    var dx = (e.clientX - d.sx) / perMm, dy = (e.clientY - d.sy) / perMm;
    if (!d.moved) {
        if (Math.abs(dx) < 0.3 && Math.abs(dy) < 0.3) { return; }
        d.moved = true;
        cfePushUndo();
    }
    var $node = $('#cfePage [data-cfe-id="' + el.id + '"]');
    if (d.mode === 'move') {
        var x = cfeClamp(d.ox + dx, 0, CFE_PAGE.w - cfeNum(el.w));
        var y = cfeClamp(d.oy + dy, 0, CFE_PAGE.h - cfeNum(el.h));
        var snapV = Math.abs(x + el.w / 2 - CFE_PAGE.w / 2) < CFE_SNAP_MM;
        var snapH = Math.abs(y + el.h / 2 - CFE_PAGE.h / 2) < CFE_SNAP_MM;
        if (snapV) { x = CFE_PAGE.w / 2 - el.w / 2; }
        if (snapH) { y = CFE_PAGE.h / 2 - el.h / 2; }
        el.x = Math.round(x * 10) / 10;
        el.y = Math.round(y * 10) / 10;
        $('#cfeGuideV').toggle(snapV);
        $('#cfeGuideH').toggle(snapH);
        $node.css({ left: el.x + 'mm', top: el.y + 'mm' });
    } else {
        var w = Math.max(3, d.ow + dx);
        var h = Math.max(0.3, d.oh + dy);
        if (el.type === 'qr') { h = w; }
        if (el.type === 'image' && d.ow > 0) { h = w * (d.oh / d.ow); }
        el.w = Math.round(Math.min(w, CFE_PAGE.w - el.x) * 10) / 10;
        el.h = Math.round(Math.min(h, CFE_PAGE.h - el.y) * 10) / 10;
        $node.css({ width: el.w + 'mm', height: el.h + 'mm' });
    }
    cfeState.dirty = true;
    cfeDrawSelection();
}

/* ---- model helpers ---- */

function cfeNewId() { cfeState.nextId += 1; return 'e' + cfeState.nextId; }
function cfeFind(id) { return (cfeState.layout.elements || []).filter(function (el) { return el.id === id; })[0] || null; }
function cfeSelected() { return cfeState.selectedId ? cfeFind(cfeState.selectedId) : null; }
function cfeClamp(v, min, max) { return Math.min(Math.max(v, min), Math.max(min, max)); }

function cfeSelect(id) {
    cfeState.selectedId = id;
    cfeDrawSelection();
    cfeShowProps();
}

function cfePushUndo() {
    cfeState.undo.push(JSON.stringify(cfeState.layout));
    if (cfeState.undo.length > CFE_UNDO_MAX) { cfeState.undo.shift(); }
    cfeState.dirty = true;
    $('#cfeUndoBtn').prop('disabled', false);
}

function cfeUndo() {
    if (!cfeState.undo.length) { return; }
    cfeState.layout = JSON.parse(cfeState.undo.pop());
    cfeSyncPage();
    if (!cfeSelected()) { cfeState.selectedId = null; }
    cfeRender();
    cfeShowProps();
}

function cfeAdd(el) {
    cfePushUndo();
    el.id = cfeNewId();
    cfeState.layout.elements.push(el);
    cfeState.selectedId = el.id;
    cfeRender();
    cfeShowProps();
}

function cfeNextY() { return 60 + (cfeState.layout.elements.length % 8) * 12; }

function cfeAddField(key) {
    var isName = key === 'recipientName';
    var w = isName ? 200 : 160;
    cfeAdd(cfeT('{{' + key + '}}', (CFE_PAGE.w - w) / 2, cfeNextY(), w, isName ? 16 : 10, isName ? 30 : 16,
        { italic: isName, fit: isName }));
}
function cfeAddText() { cfeAdd(cfeT('Your text here', (CFE_PAGE.w - 120) / 2, cfeNextY(), 120, 10, 14)); }

/* a field the issuer fills in per certificate (e.g. Position); the issue form asks for it */
function cfeAddCustomField() {
    cfmDialog({
        title: 'Add custom field', icon: 'fa-i-cursor', okText: 'Add field',
        message: 'It will be asked for when a certificate is issued.',
        input: { label: 'Field name', placeholder: 'e.g. Position, Grade or Hours', maxLength: 40, required: true }
    }).then(function (r) { if (r && r.value) { cfeInsertCustomField(r.value.slice(0, 40)); } });
}

function cfeInsertCustomField(label) {
    var fields = cfeState.layout.customFields = cfeState.layout.customFields || [];
    var field = fields.filter(function (f) { return f.label.toLowerCase() === label.toLowerCase(); })[0];
    if (!field) {
        field = { key: cfeCustomKey(label, fields), label: label };
        fields.push(field);
    }
    cfeAdd(cfeT('{{' + field.key + '}}', (CFE_PAGE.w - 160) / 2, cfeNextY(), 160, 10, 16));
}
function cfeAddQr() { cfeAdd(cfeQ(CFE_PAGE.w - 45, CFE_PAGE.h - 45, 25)); }
function cfeAddLine() { cfeAdd(cfeL((CFE_PAGE.w - 100) / 2, 150, 100, 0.5, '#999999')); }

function cfeSetProp(prop, value) {
    var el = cfeSelected();
    if (!el) { return; }
    cfePushUndo();
    el[prop] = value;
    cfeRender();
    cfeShowProps();
}

function cfeDuplicate() {
    var el = cfeSelected();
    if (!el) { return; }
    var copy = JSON.parse(JSON.stringify(el));
    copy.x = cfeClamp(cfeNum(copy.x) + 5, 0, CFE_PAGE.w - cfeNum(copy.w));
    copy.y = cfeClamp(cfeNum(copy.y) + 5, 0, CFE_PAGE.h - cfeNum(copy.h));
    cfeAdd(copy);
}

function cfeDelete() {
    var el = cfeSelected();
    if (!el) { return; }
    cfePushUndo();
    cfeState.layout.elements = cfeState.layout.elements.filter(function (x) { return x.id !== el.id; });
    cfeState.selectedId = null;
    cfeRender();
    cfeShowProps();
}

function cfeLayer(dir) {
    var els = cfeState.layout.elements, el = cfeSelected();
    if (!el) { return; }
    var i = els.indexOf(el), j = i + dir;
    if (j < 0 || j >= els.length) { return; }
    cfePushUndo();
    els.splice(i, 1);
    els.splice(j, 0, el);
    cfeRender();
}

function cfeCenter() {
    var el = cfeSelected();
    if (!el) { return; }
    cfePushUndo();
    el.x = Math.round((CFE_PAGE.w - cfeNum(el.w)) / 2 * 10) / 10;
    cfeRender();
    cfeShowProps();
}

/* ---- background ---- */

function cfeSetDesign(key) {
    cfePushUndo();
    cfeState.layout.background = { type: 'design', design: key };
    cfeRender();
}

function cfeSetBgColor(color) {
    cfePushUndo();
    cfeState.layout.background = { type: 'color', color: color };
    cfeRender();
}

function cfeUseStarter() {
    var bg = cfeState.layout.background || {};
    var key = bg.type === 'design' && CFE_STARTERS[bg.design] ? bg.design : 'blank';
    var apply = function () { cfeApplyStarter(key); };
    if (!cfeState.layout.elements.length) { apply(); return; }
    cfmDialog({
        title: 'Use starter layout', icon: 'fa-magic', okText: 'Replace layout',
        message: 'Replace everything on the certificate with the starter layout for this design? You can undo this with Ctrl+Z.'
    }).then(function (r) { if (r) { apply(); } });
}

function cfeApplyStarter(key) {
    cfePushUndo();
    cfeState.layout.elements = cfeScaleElements(CFE_STARTERS[key](), CFE_BASE.w, CFE_BASE.h)
        .map(function (el) { el.id = cfeNewId(); return el; });
    cfeState.selectedId = null;
    cfeRender();
    cfeShowProps();
}

/* ---- page size ---- */

/* CFE_PAGE follows the layout (after undo, or a page change) */
function cfeSyncPage() {
    var pg = (cfeState.layout && cfeState.layout.page) || {};
    cfeSetPage(pg.format, pg.orientation);
    $('#cfePageBtn span').text(cfePageLabel(CFE_PAGE));
    cfeFitStage();
}

function cfeOpenPageModal(mode) {
    if ($('#cfePageModal').length === 0) {
        $('body').append(cfePageModalHtml());
    }
    cfeState.pageMode = mode === 'change' ? 'change' : 'new';
    var current = cfeState.pageMode === 'change' ? CFE_PAGE : { format: 'A4', orientation: 'Landscape' };
    $('#cfePageModal input[name="cfePageFormat"][value="' + current.format + '"]').prop('checked', true);
    $('#cfePageModal input[name="cfePageOrientation"][value="' + current.orientation + '"]').prop('checked', true);
    $('#cfePageModalTitle').text(cfeState.pageMode === 'change' ? 'Page size' : 'New certificate');
    $('#cfePageGo').text(cfeState.pageMode === 'change' ? 'Apply' : 'Start designing');
    $('#cfePageNote').text(cfeState.pageMode === 'change'
        ? 'Everything on the certificate is moved and resized to fit the new page. You can undo it.'
        : 'You can change this later from the editor.');
    $('#cfePageModal').modal('show');
}

function cfeApplyPageChoice() {
    var format = $('#cfePageModal input[name="cfePageFormat"]:checked').val() || 'A4';
    var orientation = $('#cfePageModal input[name="cfePageOrientation"]:checked').val() || 'Landscape';
    $('#cfePageModal').modal('hide');
    if (cfeState.pageMode === 'change') {
        cfeChangePage(format, orientation);
    } else {
        cfeOpen(null, { format: format, orientation: orientation });
    }
}

function cfeChangePage(format, orientation) {
    var next = cfePageSize(format, orientation);
    if (next.format === CFE_PAGE.format && next.orientation === CFE_PAGE.orientation) { return; }
    cfePushUndo();
    var fromW = CFE_PAGE.w, fromH = CFE_PAGE.h;
    cfeState.layout.page = { format: next.format, orientation: next.orientation };
    cfeSyncPage();
    cfeScaleElements(cfeState.layout.elements, fromW, fromH);
    cfeRender();
    cfeShowProps();
}

/* ---- images ---- */

function cfePickImage(target) {
    cfeState.imageTarget = target;
    $('#cfeFile').val('').trigger('click');
}

/* shrink big photos in the browser before upload; PNG/WEBP keep transparency */
function cfeShrinkImage(file, maxPx) {
    return new Promise(function (resolve, reject) {
        var url = URL.createObjectURL(file);
        var img = new Image();
        img.onload = function () {
            URL.revokeObjectURL(url);
            var ratio = Math.min(1, maxPx / Math.max(img.width, img.height));
            var keepAlpha = /png|webp/.test(file.type);
            if (ratio === 1 && file.size < 1.5 * 1024 * 1024) {
                resolve({ blob: file, ext: (file.name.split('.').pop() || 'png').toLowerCase(), w: img.width, h: img.height });
                return;
            }
            var canvas = document.createElement('canvas');
            canvas.width = Math.round(img.width * ratio);
            canvas.height = Math.round(img.height * ratio);
            canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
            canvas.toBlob(function (blob) {
                if (!blob) { reject(new Error('Could not read the image.')); return; }
                resolve({ blob: blob, ext: keepAlpha ? 'png' : 'jpg', w: canvas.width, h: canvas.height });
            }, keepAlpha ? 'image/png' : 'image/jpeg', 0.88);
        };
        img.onerror = function () { URL.revokeObjectURL(url); reject(new Error('This file is not an image.')); };
        img.src = url;
    });
}

function cfeUploadImage(file) {
    if (!/^image\/(png|jpeg|webp)$/.test(file.type)) { showMessageTheme2(0, 'Please choose a PNG, JPG or WEBP image.'); return; }
    var target = cfeState.imageTarget;
    var maxPx = target === 'background' ? 2400 : 1200;
    customLoader(true);
    cfeShrinkImage(file, maxPx).then(function (img) {
        if (img.blob.size > 5 * 1024 * 1024) { throw new Error('Image is larger than 5MB even after shrinking.'); }
        var form = new FormData();
        form.append('file', img.blob, 'design.' + (img.ext === 'jpeg' ? 'jpg' : img.ext));
        form.append('schoolId', SCHOOL_ID);
        form.append('userId', USER_ID);
        return $.ajax({ url: cfmApiBase() + 'upload-image', type: 'POST', data: form, processData: false, contentType: false })
            .then(function (response) { return { response: response, img: img }; });
    }).then(function (result) {
        customLoader(false);
        if (!cfmIsSuccess(result.response)) {
            showMessageTheme2(0, (result.response && result.response.message) || 'Upload failed. Please try again.');
            return;
        }
        var url = result.response.details;
        if (target === 'background') {
            cfePushUndo();
            var prev = cfeState.layout.background || {};
            cfeState.layout.background = { type: 'image', src: url, opacity: prev.type === 'image' ? prev.opacity : undefined };
            cfeRender();
        } else if (target === 'replace' && cfeSelected()) {
            cfeSetProp('src', url);
        } else {
            var w = 50, h = Math.min(40, w * (result.img.h / Math.max(1, result.img.w)));
            if (h === 40) { w = h * (result.img.w / Math.max(1, result.img.h)); }
            cfeAdd({ type: 'image', src: url, x: (CFE_PAGE.w - w) / 2, y: 20, w: Math.round(w * 10) / 10, h: Math.round(h * 10) / 10 });
        }
    }).catch(function (err) {
        customLoader(false);
        showMessageTheme2(0, (err && err.message) || 'Upload failed. Please try again.');
    });
}

/* ---- save / preview ---- */

function cfeSave() {
    var name = ($('#cfeName').val() || '').trim();
    if (!name) { showMessageTheme2(0, 'Please enter a template name.'); return Promise.resolve(null); }
    if (!cfeState.layout.elements.length) { showMessageTheme2(0, 'Add at least one element to the certificate.'); return Promise.resolve(null); }
    var layout = JSON.parse(JSON.stringify(cfeState.layout));
    layout.elements.forEach(function (el) { delete el.id; });
    // keep only custom fields that are still on the certificate
    var used = layout.elements.map(function (el) { return el.text || ''; }).join(' ');
    layout.customFields = (layout.customFields || []).filter(function (f) { return used.indexOf('{{' + f.key + '}}') >= 0; });
    var body = {
        templateId: cfeState.templateId,
        templateName: name,
        category: cfmReadCategory('cfeCategory'),
        templateHtml: cfeBuildHtml(cfeState.layout, {}),
        layoutJson: JSON.stringify(layout),
        editorType: 'VISUAL',
        pageFormat: CFE_PAGE.format,
        orientation: CFE_PAGE.orientation,
        templateStatus: cfeState.status
    };
    return cfmMutate('templates/save', body, 'Template saved').then(function (response) {
        if (!response) { return null; }
        cfeState.templateId = response.details;
        cfeState.dirty = false;
        return cfeState.templateId;
    });
}

function cfePreviewPdf() {
    var ready = (!cfeState.templateId || cfeState.dirty) ? cfeSave() : Promise.resolve(cfeState.templateId);
    ready.then(function (templateId) {
        if (!templateId) { return; }
        cfmPost('templates/preview-pdf', { templateId: templateId }).then(function (response) {
            if (!cfmIsSuccess(response)) {
                showMessageTheme2(0, (response && response.message) || 'Could not create the PDF preview.');
                return;
            }
            var bytes = atob(response.details.base64);
            var buf = new Uint8Array(bytes.length);
            for (var i = 0; i < bytes.length; i++) { buf[i] = bytes.charCodeAt(i); }
            var url = URL.createObjectURL(new Blob([buf], { type: 'application/pdf' }));
            $('#cfePreviewFrame').attr('src', url);
            $('#cfePreviewDownload').attr('href', url);
            $('#cfePreviewModal').modal('show');
        }, function () {
            showMessageTheme2(0, 'Could not create the PDF preview.');
        });
    });
}
