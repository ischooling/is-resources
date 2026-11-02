/*
 * certificateEditorContent.js
 * Visual certificate editor: page model, built-in designs, starter layouts,
 * markup, and the layout -> template HTML serializer. The same serializer drives
 * the editor canvas and the saved TEMPLATE_HTML, so the PDF matches the screen.
 * Behaviour lives in certificateEditor.js (cfe* functions).
 *
 * Layout model (all positions/sizes in mm, font size in pt):
 *   { version: 1,
 *     background: { type: 'design' | 'image' | 'color', design, src, color },
 *     elements: [ { id, type: 'text' | 'image' | 'qr' | 'line', x, y, w, h,
 *                   text, font, size, color, bold, italic, align, spacing, fit, src } ] }
 */

/* the page being edited (set from the template / chooser by cfeSetPage); built-in designs and
   starter layouts are drawn for A4 landscape (CFE_BASE) and scaled to it */
var CFE_PAGE = { w: 297, h: 209, format: 'A4', orientation: 'Landscape' };
var CFE_BASE = { w: 297, h: 209 };
/* paper sizes in mm (long edge, short edge), as the PDF script and CertificateView @page name them */
var CFE_PAPER = { A4: [297, 210], Letter: [279.4, 215.9], Legal: [355.6, 215.9] };

/* page box in mm: whole mm, 1mm short of the paper height so the PDF stays on one page */
function cfePageSize(format, orientation) {
    var f = Object.keys(CFE_PAPER).filter(function (k) { return k.toLowerCase() === String(format || '').toLowerCase(); })[0] || 'A4';
    var o = /^portrait$/i.test(orientation || '') ? 'Portrait' : 'Landscape';
    var paper = CFE_PAPER[f];
    var w = o === 'Landscape' ? paper[0] : paper[1], h = o === 'Landscape' ? paper[1] : paper[0];
    return { w: Math.floor(w), h: Math.floor(h) - 1, format: f, orientation: o };
}

function cfeSetPage(format, orientation) {
    CFE_PAGE = cfePageSize(format, orientation);
    return CFE_PAGE;
}

function cfePageLabel(page) {
    return page.format + ' · ' + page.orientation;
}

/* moves and resizes elements laid out on a fromW x fromH page onto the current page: positions follow the
   page; text, QR codes and images keep their shape, scaled by the geometric mean of the two stretches so that
   switching back restores them exactly (text that no longer fits shrinks itself, see cfeFit) */
function cfeScaleElements(elements, fromW, fromH) {
    var sx = CFE_PAGE.w / fromW, sy = CFE_PAGE.h / fromH, s = Math.sqrt(sx * sy);
    if (sx === 1 && sy === 1) { return elements; }
    var r = function (v) { return Math.round(v * 10) / 10; };
    elements.forEach(function (el) {
        var x = cfeNum(el.x), y = cfeNum(el.y), w = cfeNum(el.w, 10), h = cfeNum(el.h, 5);
        var cx = (x + w / 2) * sx, cy = (y + h / 2) * sy;
        if (el.type === 'line') {
            if (w >= h) { el.w = r(w * sx); el.h = h; } else { el.h = r(h * sy); el.w = w; }
        } else if (el.type === 'text') {
            el.w = r(Math.min(w * sx, CFE_PAGE.w));
            el.h = r(Math.min(h * s, CFE_PAGE.h));
            el.size = r(cfeNum(el.size, 14) * s);
        } else {
            var k = Math.min(s, CFE_PAGE.w / w, CFE_PAGE.h / h);
            el.w = r(w * k);
            el.h = r(h * k);
        }
        el.x = r(Math.max(0, Math.min(CFE_PAGE.w - el.w, cx - el.w / 2)));
        el.y = r(Math.max(0, Math.min(CFE_PAGE.h - el.h, cy - el.h / 2)));
    });
    return elements;
}

var CFE_PX_PER_MM = 96 / 25.4;

var CFE_FONTS = {
    georgia: { label: 'Georgia', css: 'Georgia, serif' },
    times: { label: 'Times New Roman', css: '\'Times New Roman\', Times, serif' },
    arial: { label: 'Arial', css: 'Arial, Helvetica, sans-serif' },
    verdana: { label: 'Verdana', css: 'Verdana, Geneva, sans-serif' },
    trebuchet: { label: 'Trebuchet MS', css: '\'Trebuchet MS\', Helvetica, sans-serif' },
    courier: { label: 'Courier New', css: '\'Courier New\', Courier, monospace' }
};

var CFE_FIELDS = [
    { key: 'recipientName', label: 'Recipient name', sample: 'Aisha Khan' },
    { key: 'activityTitle', label: 'Activity title', sample: 'Inter-School Debate 2026' },
    { key: 'activityType', label: 'Activity type', sample: 'Extra-curricular' },
    { key: 'grade', label: 'Grade', sample: 'Grade 6' },
    { key: 'academicYear', label: 'Academic year', sample: '2026-2027' },
    { key: 'schoolName', label: 'School name', sample: 'International Schooling' },
    { key: 'issueDate', label: 'Issue date', sample: '28 October 2026' },
    { key: 'certCode', label: 'Certificate ID', sample: 'CERT-7KQ2M9XWD4PLR8TA' }
];

/* Built-in page designs: a background colour plus decoration drawn under the elements. */
var CFE_DESIGNS = {
    blank: { label: 'Blank', swatch: '#ffffff', color: '#ffffff', layer: function () { return ''; } },
    navy: {
        label: 'Classic Navy', swatch: '#1f3a6e', color: '#1f3a6e',
        layer: function (W, H) { return cfeRect(9, 9, W - 18, H - 18, 'background:#fffdf6;border:2.5mm solid #c9a227;'); }
    },
    maroon: {
        label: 'Maroon and Gold', swatch: '#7a1f2b', color: '#fbf7ef',
        layer: function (W, H) {
            return cfeRect(8, 8, W - 16, H - 16, 'border:1.2mm solid #7a1f2b;')
                + cfeRect(11.7, 11.7, W - 23.4, H - 23.4, 'border:0.5mm solid #b8952e;');
        }
    },
    teal: {
        label: 'Modern Teal', swatch: '#0f766e', color: '#ffffff',
        layer: function (W, H) { return cfeRect(0, 0, Math.round(W * 78 / 297), H, 'background:#0f766e;'); }
    },
    green: {
        label: 'Soft Green', swatch: '#2f6b3a', color: '#f3f8f3',
        layer: function (W, H) {
            var c = 'box-sizing:content-box;border-color:#2f6b3a;border-style:solid;border-width:0;';
            return cfeRect(12, 12, W - 24, H - 24, 'background:#ffffff;border:0.5mm solid #9cc3a1;')
                + cfeRect(16, 16, 16, 16, c + 'border-top-width:1.5mm;border-left-width:1.5mm;')
                + cfeRect(W - 32, 16, 16, 16, c + 'border-top-width:1.5mm;border-right-width:1.5mm;')
                + cfeRect(16, H - 32, 16, 16, c + 'border-bottom-width:1.5mm;border-left-width:1.5mm;')
                + cfeRect(W - 32, H - 32, 16, 16, c + 'border-bottom-width:1.5mm;border-right-width:1.5mm;');
        }
    },
    blue: {
        label: 'Blue Header', swatch: '#1d4ed8', color: '#ffffff',
        layer: function (W, H) {
            return cfeRect(0, 0, W, 42, 'background:#1d4ed8;') + cfeRect(0, 0, W, H, 'border:3mm solid #1d4ed8;');
        }
    }
};

/* an absolutely placed box of a design, in mm */
function cfeRect(x, y, w, h, style) {
    return '<div style="position:absolute;left:' + cfeNum(x) + 'mm;top:' + cfeNum(y) + 'mm;width:' + cfeNum(w) + 'mm;height:'
        + cfeNum(h) + 'mm;box-sizing:border-box;' + style + '"></div>';
}

/* ---- starter layouts (one per design) ---- */
function cfeT(text, x, y, w, h, size, o) {
    o = o || {};
    return { type: 'text', text: text, x: x, y: y, w: w, h: h, size: size, font: o.font || 'georgia',
        color: o.color || '#222222', bold: !!o.bold, italic: !!o.italic, align: o.align || 'center',
        spacing: o.spacing || 0, fit: !!o.fit };
}
function cfeL(x, y, w, h, color) { return { type: 'line', x: x, y: y, w: w, h: h, color: color }; }
function cfeQ(x, y, s) { return { type: 'qr', x: x, y: y, w: s, h: s }; }

function cfeSignature(xCenter, y, label, lineColor, textValue, font) {
    var els = [];
    if (textValue) { els.push(cfeT(textValue, xCenter - 35, y - 8, 70, 7, 12, { color: '#333333', font: font })); }
    els.push(cfeL(xCenter - 30, y, 60, 0.4, lineColor));
    els.push(cfeT(label, xCenter - 35, y + 1.5, 70, 6, 10, { color: '#777777', font: font }));
    return els;
}

var CFE_STARTERS = {
    blank: function () {
        return [
            cfeT('Certificate', 20, 40, 257, 18, 36),
            cfeT('{{recipientName}}', 40, 80, 217, 16, 30, { italic: true, fit: true }),
            cfeT('{{activityTitle}}', 20, 104, 257, 9, 14, { color: '#555555' }),
            cfeT('{{issueDate}}', 20, 120, 257, 7, 12, { color: '#555555' }),
            cfeT('Certificate ID: {{certCode}}', 20, 190, 257, 6, 9, { color: '#999999' })
        ];
    },
    navy: function () {
        return [
            cfeT('INTERNATIONAL SCHOOLING', 20, 30, 257, 8, 13, { color: '#9a7b1c', spacing: 6 }),
            cfeT('Certificate of Participation', 20, 41, 257, 20, 40, { color: '#1f3a6e' }),
            cfeL(118.5, 64, 60, 0.6, '#c9a227'),
            cfeT('This certificate is proudly presented to', 20, 72, 257, 9, 14, { color: '#555555' }),
            cfeT('{{recipientName}}', 30, 82, 237, 17, 34, { italic: true, fit: true }),
            cfeT('for participating in {{activityTitle}}', 20, 104, 257, 9, 14, { color: '#555555' }),
            cfeT('{{activityType}}', 20, 113, 257, 7, 12, { color: '#777777' }),
            cfeQ(136.5, 138, 24),
            cfeT('Certificate ID: {{certCode}}', 20, 184, 257, 6, 9, { color: '#999999' })
        ].concat(cfeSignature(80, 154, 'Date', '#999999', '{{issueDate}}'),
            cfeSignature(217, 154, 'Principal', '#999999'));
    },
    maroon: function () {
        return [
            cfeT('INTERNATIONAL SCHOOLING', 20, 28, 257, 8, 12, { color: '#7a1f2b', spacing: 7 }),
            cfeT('CERTIFICATE', 20, 37, 257, 20, 44, { color: '#7a1f2b', spacing: 2 }),
            cfeT('OF ACHIEVEMENT', 20, 58, 257, 9, 16, { color: '#b8952e', spacing: 6 }),
            cfeT('This certificate is awarded to', 20, 72, 257, 8, 13, { color: '#555555' }),
            cfeT('{{recipientName}}', 40, 81, 217, 17, 34, { color: '#2b2b2b', italic: true, fit: true }),
            cfeL(88.5, 99, 120, 0.4, '#b8952e'),
            cfeT('in recognition of outstanding performance in', 20, 104, 257, 8, 13, { color: '#555555' }),
            cfeT('{{activityTitle}}', 30, 112, 237, 10, 17, { color: '#7a1f2b', bold: true, fit: true }),
            cfeT('{{activityType}}', 20, 122, 257, 7, 11, { color: '#888888' }),
            cfeQ(136.5, 139, 24),
            cfeT('Certificate ID: {{certCode}}', 20, 186, 257, 6, 9, { color: '#999999' })
        ].concat(cfeSignature(80, 155, 'Date', '#b8952e', '{{issueDate}}'),
            cfeSignature(217, 155, 'Principal', '#b8952e'));
    },
    teal: function () {
        var a = { font: 'arial', align: 'left' };
        return [
            cfeT('INTERNATIONAL SCHOOLING', 12, 18, 62, 7, 10, $.extend({ color: '#ccfbf1', spacing: 3 }, a)),
            cfeT('Certificate\nof\nAttendance', 12, 48, 62, 44, 30, $.extend({ color: '#ffffff', bold: true }, a)),
            cfeL(12, 96, 20, 1.2, '#5eead4'),
            cfeQ(12, 118, 26),
            cfeT('Certificate ID', 12, 150, 62, 5, 9, $.extend({ color: '#ccfbf1' }, a)),
            cfeT('{{certCode}}', 12, 155, 62, 6, 10, $.extend({ color: '#ffffff', bold: true }, a)),
            cfeT('THIS IS TO CERTIFY THAT', 98, 62, 179, 7, 12, $.extend({ color: '#64748b', spacing: 2 }, a)),
            cfeT('{{recipientName}}', 98, 71, 179, 16, 34, $.extend({ color: '#0f172a', bold: true, fit: true }, a)),
            cfeL(98, 90, 30, 1, '#0f766e'),
            cfeT('has attended {{activityTitle}} ({{activityType}})', 98, 95, 179, 18, 14, $.extend({ color: '#334155' }, a)),
            cfeT('on {{issueDate}}.', 98, 114, 179, 8, 14, $.extend({ color: '#334155' }, a)),
            cfeL(98, 140, 60, 0.4, '#94a3b8'),
            cfeT('Program Coordinator', 98, 141.5, 60, 6, 10, $.extend({ color: '#64748b' }, a)),
            cfeL(176, 140, 60, 0.4, '#94a3b8'),
            cfeT('Principal', 176, 141.5, 60, 6, 10, $.extend({ color: '#64748b' }, a))
        ];
    },
    green: function () {
        return [
            cfeT('INTERNATIONAL SCHOOLING', 20, 36, 257, 8, 12, { color: '#2f6b3a', spacing: 6 }),
            cfeT('Certificate of Appreciation', 20, 46, 257, 18, 38, { color: '#2f6b3a' }),
            cfeT('With sincere gratitude, this certificate is presented to', 20, 72, 257, 8, 13, { color: '#666666' }),
            cfeT('{{recipientName}}', 40, 82, 217, 15, 32, { color: '#1f2d20', italic: true, fit: true }),
            cfeT('for a valuable contribution to {{activityTitle}} ({{activityType}})', 30, 102, 237, 9, 13, { color: '#555555' }),
            cfeQ(136.5, 132, 24),
            cfeT('Certificate ID: {{certCode}}', 20, 182, 257, 6, 9, { color: '#999999' })
        ].concat(cfeSignature(95, 148, 'Date', '#9cc3a1', '{{issueDate}}'),
            cfeSignature(202, 148, 'Principal', '#9cc3a1'));
    },
    blue: function () {
        var a = { font: 'arial' };
        return [
            cfeT('INTERNATIONAL SCHOOLING', 20, 12, 257, 6, 11, $.extend({ color: '#dbeafe', spacing: 5 }, a)),
            cfeT('CERTIFICATE OF COMPLETION', 20, 20, 257, 14, 32, $.extend({ color: '#ffffff', bold: true }, a)),
            cfeT('This is to certify that', 20, 62, 257, 8, 13, $.extend({ color: '#475569' }, a)),
            cfeT('{{recipientName}}', 40, 71, 217, 16, 32, $.extend({ color: '#0f172a', bold: true, fit: true }, a)),
            cfeL(123.5, 91, 50, 0.8, '#1d4ed8'),
            cfeT('has successfully completed {{activityTitle}}', 20, 98, 257, 10, 15, $.extend({ color: '#334155' }, a)),
            cfeT('{{activityType}}', 20, 108, 257, 7, 11, $.extend({ color: '#64748b' }, a)),
            cfeQ(258, 166, 24)
        ].concat(cfeSignature(75, 148, 'Date of issue', '#94a3b8', '{{issueDate}}', 'arial'),
            cfeSignature(148.5, 148, 'Certificate ID', '#94a3b8', '{{certCode}}', 'arial'),
            cfeSignature(222, 148, 'Principal', '#94a3b8', null, 'arial'));
    }
};

/* ---- serializer: layout -> template HTML ---- */
function cfeNum(v, d) {
    var n = parseFloat(v);
    if (isNaN(n)) { n = d || 0; }
    return Math.round(n * 100) / 100;
}
function cfeColor(c, d) { return /^#[0-9a-fA-F]{6}$/.test(c || '') ? c : (d || '#222222'); }
function cfeEscText(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function cfeSafeSrc(src) {
    return /^https?:\/\/[^\s"<>]+$/.test(src || '') ? src : '';
}

/* text with {{tokens}} kept for the server, or replaced by sample values in the editor
   (custom fields show their label in brackets, e.g. [Position]) */
function cfeTextHtml(text, sample, custom) {
    var html = cfeEscText(text).replace(/\n/g, '<br>');
    if (sample) {
        CFE_FIELDS.forEach(function (f) { html = html.split('{{' + f.key + '}}').join(cfeEscText(f.sample)); });
        (custom || []).forEach(function (f) { html = html.split('{{' + f.key + '}}').join('[' + cfeEscText(f.label) + ']'); });
    }
    return html;
}

/* a placeholder key for a custom field label: "Grade Level" -> gradeLevel, never clashing with others */
function cfeCustomKey(label, existing) {
    var words = String(label || '').replace(/[^A-Za-z0-9 ]+/g, ' ').trim().split(/\s+/).filter(Boolean);
    var key = words.map(function (w, i) {
        return i ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : w.toLowerCase();
    }).join('');
    if (!/^[a-z]/.test(key)) { key = 'field' + key; }
    var taken = CFE_FIELDS.map(function (f) { return f.key; }).concat(['qrCodeImage'],
        (existing || []).map(function (f) { return f.key; }));
    var unique = key, n = 2;
    while (taken.indexOf(unique) >= 0) { unique = key + n++; }
    return unique;
}

/* "Visibility" slider: 100 % = solid, lower = more transparent; attrs bind it (data-prop or an id) */
function cfeOpacityFieldHtml(attrs, value, hint) {
    var v = parseFloat(value);
    v = isNaN(v) ? 100 : Math.max(0, Math.min(100, Math.round(v)));
    return '<div class="cfe-field" style="margin-top:8px;"><label>Visibility <span class="cfe-opacity-val">' + v + '%</span></label>'
        + '<input type="range" min="5" max="100" step="5" ' + attrs + ' value="' + v + '" aria-label="Visibility (opacity)"'
        + ' oninput="$(this).closest(\'.cfe-field\').find(\'.cfe-opacity-val\').text(this.value + \'%\')" />'
        + (hint ? '<div class="cfe-hint">' + hint + '</div>' : '') + '</div>';
}

/* opacity as stored (0-100 %, missing = fully visible) to a CSS declaration; '' when fully visible */
function cfeOpacityCss(value) {
    var o = parseFloat(value);
    if (isNaN(o) || o >= 100) { return ''; }
    return 'opacity:' + (Math.max(0, Math.round(o)) / 100) + ';';
}

function cfeBox(el) {
    return 'position:absolute;left:' + cfeNum(el.x) + 'mm;top:' + cfeNum(el.y) + 'mm;width:' + cfeNum(el.w, 10)
        + 'mm;height:' + cfeNum(el.h, 5) + 'mm;box-sizing:border-box;';
}

/* opts: { sample: fill tokens with sample values, editor: tag elements for the editor } */
function cfeElementHtml(el, opts) {
    opts = opts || {};
    var tag = opts.editor ? ' data-cfe-id="' + cfeEscText(el.id) + '"' : '';
    if (el.type === 'text') {
        var align = (el.align === 'left' || el.align === 'right') ? el.align : 'center';
        var justify = align === 'left' ? 'flex-start' : (align === 'right' ? 'flex-end' : 'center');
        var font = (CFE_FONTS[el.font] || CFE_FONTS.georgia).css;
        var style = cfeBox(el) + 'display:flex;align-items:center;justify-content:' + justify + ';text-align:' + align
            + ';overflow:hidden;line-height:1.25;font-family:' + font + ';font-size:' + cfeNum(el.size, 14) + 'pt;color:'
            + cfeColor(el.color) + ';font-weight:' + (el.bold ? 'bold' : 'normal') + ';font-style:'
            + (el.italic ? 'italic' : 'normal') + ';letter-spacing:' + cfeNum(el.spacing) + 'px;';
        // every text box shrinks to fit (never cut off); "fit" additionally keeps it on one line
        var inner = cfeTextHtml(el.text, opts.sample, opts.custom);
        return '<div' + tag + ' data-fit="1" style="' + style + '"><span' + (el.fit ? ' style="white-space:nowrap;"' : '')
            + '>' + inner + '</span></div>';
    }
    if (el.type === 'image') {
        return '<img' + tag + ' src="' + cfeEscText(cfeSafeSrc(el.src)) + '" alt="" style="' + cfeBox(el) + 'object-fit:contain;'
            + cfeOpacityCss(el.opacity) + '">';
    }
    if (el.type === 'qr') {
        if (opts.editor) {
            return '<div' + tag + ' class="cfe-qr-ph" style="' + cfeBox(el) + '"><span>QR</span></div>';
        }
        return '<img src="{{qrCodeImage}}" alt="" style="' + cfeBox(el) + 'object-fit:contain;">';
    }
    if (el.type === 'line') {
        return '<div' + tag + ' style="' + cfeBox(el) + 'background:' + cfeColor(el.color, '#999999') + ';"></div>';
    }
    return '';
}

function cfeBackground(bg) {
    bg = bg || { type: 'design', design: 'blank' };
    if (bg.type === 'image' && cfeSafeSrc(bg.src)) {
        return { color: '#ffffff', layer: '<img src="' + cfeEscText(cfeSafeSrc(bg.src)) + '" alt="" style="position:absolute;left:0;top:0;width:'
            + CFE_PAGE.w + 'mm;height:' + CFE_PAGE.h + 'mm;object-fit:cover;' + cfeOpacityCss(bg.opacity) + '">' };
    }
    if (bg.type === 'color') {
        return { color: cfeColor(bg.color, '#ffffff'), layer: '' };
    }
    var d = CFE_DESIGNS[bg.design] || CFE_DESIGNS.blank;
    return { color: d.color, layer: d.layer(CFE_PAGE.w, CFE_PAGE.h) };
}

function cfeBuildHtml(layout, opts) {
    var bg = cfeBackground(layout.background);
    opts = $.extend({}, opts || {}, { custom: layout.customFields || [] });
    var els = (layout.elements || []).map(function (el) { return cfeElementHtml(el, opts); }).join('');
    return '<div style="position:relative;width:' + CFE_PAGE.w + 'mm;height:' + CFE_PAGE.h
        + 'mm;overflow:hidden;box-sizing:border-box;background:' + bg.color + ';">' + bg.layer + els + '</div>';
}

/* same shrink-to-fit as CertificateView.jsp (runs on freshly built HTML, so the
   element's own inline font-size is the starting point) */
function cfeFit(root) {
    $(root).find('[data-fit]').each(function () {
        var box = this, text = box.querySelector('span');
        if (!text) { return; }
        var size = parseFloat(window.getComputedStyle(box).fontSize);
        while ((text.offsetWidth > box.clientWidth || text.offsetHeight > box.clientHeight) && size > 6) {
            size -= 0.5;
            box.style.fontSize = size + 'px';
        }
    });
}

/* ---- page size chooser (new template / change page) ---- */
function cfePageOptionHtml(name, value, label, hint, icon, checked) {
    return '<label class="cfe-po"><input type="radio" name="' + name + '" value="' + value + '"' + (checked ? ' checked' : '') + ' />'
        + '<span class="cfe-po-box">' + icon + '<b>' + label + '</b><small>' + hint + '</small></span></label>';
}

function cfePageModalHtml() {
    var sizes = Object.keys(CFE_PAPER).map(function (f) {
        var p = CFE_PAPER[f];
        return cfePageOptionHtml('cfePageFormat', f, f, p[1] + ' × ' + p[0] + ' mm', '', f === 'A4');
    }).join('');
    var shape = function (w, h) { return '<span class="cfe-po-shape" style="width:' + w + 'px;height:' + h + 'px;"></span>'; };
    var orientations = cfePageOptionHtml('cfePageOrientation', 'Landscape', 'Landscape', 'Wide', shape(42, 30), true)
        + cfePageOptionHtml('cfePageOrientation', 'Portrait', 'Portrait', 'Tall', shape(30, 42), false);
    return `
    <div class="modal fade" id="cfePageModal" tabindex="-1" role="dialog" aria-labelledby="cfePageModalTitle">
      <div class="modal-dialog" role="document" style="max-width:520px;">
        <div class="modal-content">
          <style>
            #cfePageModal h6 { font-size:13px; color:#2b2f42; margin:4px 0 8px; }
            #cfePageModal .cfe-po-row { display:flex; gap:10px; flex-wrap:wrap; margin-bottom:16px; }
            #cfePageModal .cfe-po { flex:1; min-width:120px; margin:0; cursor:pointer; }
            #cfePageModal .cfe-po input { position:absolute; opacity:0; pointer-events:none; }
            #cfePageModal .cfe-po-box { display:flex; flex-direction:column; align-items:center; gap:4px; padding:12px 8px; border:1px solid #d7dae8;
                border-radius:10px; font-size:13px; color:#2b2f42; text-align:center; height:100%; }
            #cfePageModal .cfe-po-box small { color:#7a7f95; font-size:11px; }
            #cfePageModal .cfe-po input:checked + .cfe-po-box { border-color:var(--pc,#16aaff); background:color-mix(in srgb, var(--pc,#16aaff) 6%, white); box-shadow:0 0 0 1px var(--pc,#16aaff); }
            #cfePageModal .cfe-po input:focus-visible + .cfe-po-box { outline:2px solid var(--pc,#16aaff); outline-offset:2px; }
            #cfePageModal .cfe-po-shape { display:block; border:2px solid var(--pc,#16aaff); border-radius:3px; background:#fff; margin-bottom:4px; }
            #cfePageModal .cfe-po-note { font-size:12px; color:#7a7f95; }
          </style>
          <div class="modal-header">
            <h5 class="modal-title" id="cfePageModalTitle">New certificate</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">&times;</button>
          </div>
          <div class="modal-body">
            <h6>Page size</h6>
            <div class="cfe-po-row" role="radiogroup" aria-label="Page size">${sizes}</div>
            <h6>Orientation</h6>
            <div class="cfe-po-row" role="radiogroup" aria-label="Orientation">${orientations}</div>
            <div class="cfe-po-note" id="cfePageNote"></div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-light" data-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary" id="cfePageGo" onclick="cfeApplyPageChoice()">Start designing</button>
          </div>
        </div>
      </div>
    </div>`;
}

/* ---- markup ---- */
function getCertificateEditorHtml() {
    var addField = CFE_FIELDS.map(function (f) {
        return '<button type="button" class="cfe-add" onclick="cfeAddField(\'' + f.key + '\')"><i class="fa fa-user-o"></i> ' + f.label + '</button>';
    }).join('');
    var designs = Object.keys(CFE_DESIGNS).map(function (k) {
        var d = CFE_DESIGNS[k];
        return '<button type="button" class="cfe-design" data-design="' + k + '" onclick="cfeSetDesign(\'' + k + '\')" title="' + d.label + '">'
            + '<span class="cfe-swatch" style="background:' + d.swatch + ';"></span>' + d.label + '</button>';
    }).join('');

    return `
    <div id="cfeRoot" class="custom-field-scope cfe-scope">
        <style>
            .cfe-scope { font-family: inherit; }
            .cfe-top { display:flex; align-items:center; gap:10px; flex-wrap:wrap; margin-bottom:12px; }
            .cfe-top .cfe-name { flex:1; min-width:200px; font-size:16px; font-weight:600; padding:8px 10px; border:1px solid #d7dae8; border-radius:8px; }
            .cfe-top .cfe-cat { width:180px; padding:8px 10px; border:1px solid #d7dae8; border-radius:8px; background:#fff; }
            .cfe-btn { border:0; border-radius:8px; padding:8px 12px; font-size:13px; cursor:pointer; background:#e9ecef; color:#212529; white-space:nowrap; transition:filter .15s ease; }
            .cfe-btn:hover { filter:brightness(.92); }
            .cfe-btn.primary { background:var(--pc,#16aaff); color:#fff; }
            .cfe-btn.danger { background:#d92550; color:#fff; }
            .cfe-btn:disabled { opacity:.5; cursor:default; filter:none; }
            .cfe-layout { display:flex; gap:12px; align-items:flex-start; }
            .cfe-panel { width:210px; flex-shrink:0; background:#fff; border:1px solid #e6e8f0; border-radius:10px; padding:12px; }
            .cfe-panel h6 { font-size:11px; letter-spacing:1px; color:#7a7f95; text-transform:uppercase; margin:12px 0 6px; }
            .cfe-panel h6:first-child { margin-top:0; }
            .cfe-add, .cfe-design { display:flex; align-items:center; gap:8px; width:100%; text-align:left; border:1px solid #e6e8f0; background:#fafbff; border-radius:7px; padding:7px 9px; margin-bottom:5px; font-size:13px; cursor:pointer; color:#2b2f42; }
            .cfe-add:hover, .cfe-design:hover { border-color:var(--pc,#16aaff); }
            .cfe-design.active { border-color:var(--pc,#16aaff); background:color-mix(in srgb, var(--pc,#16aaff) 8%, white); font-weight:600; }
            .cfe-swatch { width:16px; height:16px; border-radius:4px; border:1px solid #ccd; flex-shrink:0; }
            .cfe-stage-wrap { flex:1; min-width:0; background:#e9eaf0; border-radius:10px; padding:16px; overflow:hidden; }
            .cfe-stage { position:relative; margin:0 auto; box-shadow:0 4px 18px rgba(0,0,0,.12); }
            .cfe-page { position:absolute; left:0; top:0; transform-origin:0 0; background:#fff; }
            .cfe-page [data-cfe-id] { cursor:move; }
            .cfe-qr-ph { display:flex; align-items:center; justify-content:center; background:repeating-linear-gradient(45deg,#222 0 2px,#fff 2px 5px); outline:1px solid #222; }
            .cfe-qr-ph span { background:#fff; padding:1mm 2mm; font:bold 9pt Arial, sans-serif; }
            .cfe-sel { position:absolute; outline:0.5mm dashed var(--pc,#16aaff); pointer-events:none; }
            .cfe-handle { position:absolute; right:-2mm; bottom:-2mm; width:4mm; height:4mm; background:var(--pc,#16aaff); border:0.5mm solid #fff; border-radius:50%; pointer-events:auto; cursor:nwse-resize; }
            .cfe-guide { position:absolute; background:#ff3b8d; pointer-events:none; display:none; }
            .cfe-field { margin-bottom:8px; }
            .cfe-field label { display:block; font-size:11px; color:#7a7f95; margin-bottom:3px; }
            .cfe-field input, .cfe-field select, .cfe-field textarea { width:100%; padding:6px 8px; border:1px solid #d7dae8; border-radius:6px; font-size:13px; box-sizing:border-box; }
            .cfe-row { display:flex; gap:6px; }
            .cfe-row .cfe-field { flex:1; }
            .cfe-toggle { display:flex; gap:4px; margin-bottom:8px; }
            .cfe-toggle button { flex:1; border:1px solid #d7dae8; background:#fff; border-radius:6px; padding:5px 0; cursor:pointer; font-size:13px; }
            .cfe-toggle button.on { background:var(--pc,#16aaff); color:#fff; border-color:var(--pc,#16aaff); }
            .cfe-hint { font-size:12px; color:#7a7f95; line-height:1.4; }
            .cfe-check { display:flex; align-items:center; gap:6px; font-size:13px; margin-bottom:8px; cursor:pointer; }
            .cfe-actions { display:flex; flex-wrap:wrap; gap:5px; margin-top:10px; }
            .cfe-actions .cfe-btn { flex:1; padding:6px 4px; font-size:12px; }
            #cfePreviewModal iframe { width:100%; height:70vh; border:0; }
            @media (max-width: 1100px) { .cfe-layout { flex-wrap:wrap; } .cfe-panel { width:100%; } }
        </style>

        <div class="cfe-top">
            <button type="button" class="cfe-btn" onclick="cfeClose()"><i class="fa fa-arrow-left"></i> Templates</button>
            <input type="text" class="cfe-name" id="cfeName" placeholder="Template name" />
            <span id="cfeCategoryBox" style="display:inline-flex;gap:6px;"></span>
            <button type="button" class="cfe-btn" id="cfePageBtn" onclick="cfeOpenPageModal('change')" title="Page size and orientation"><i class="fa fa-file-o"></i> <span>${cfeEscText(cfePageLabel(CFE_PAGE))}</span></button>
            <label class="cfe-check" style="margin:0;"><input type="checkbox" id="cfeSample" checked onchange="cfeRender()" /> Sample data</label>
            <button type="button" class="cfe-btn" id="cfeUndoBtn" onclick="cfeUndo()" title="Undo (Ctrl+Z)" aria-label="Undo"><i class="fa fa-undo"></i></button>
            <button type="button" class="cfe-btn" onclick="cfePreviewPdf()"><i class="fa fa-file-pdf-o"></i> Preview PDF</button>
            <button type="button" class="cfe-btn primary" onclick="cfeSave()"><i class="fa fa-check"></i> Save</button>
        </div>

        <div class="cfe-layout">
            <div class="cfe-panel">
                <h6>Add field</h6>
                ${addField}
                <button type="button" class="cfe-add" onclick="cfeAddCustomField()"><i class="fa fa-plus-square-o"></i> Custom field…</button>
                <h6>Add element</h6>
                <button type="button" class="cfe-add" onclick="cfeAddText()"><i class="fa fa-font"></i> Text</button>
                <button type="button" class="cfe-add" onclick="cfePickImage('element')"><i class="fa fa-picture-o"></i> Image / logo / signature</button>
                <button type="button" class="cfe-add" onclick="cfeAddQr()"><i class="fa fa-qrcode"></i> QR code (verify)</button>
                <button type="button" class="cfe-add" onclick="cfeAddLine()"><i class="fa fa-minus"></i> Line</button>
                <h6>Background</h6>
                ${designs}
                <button type="button" class="cfe-add" onclick="cfePickImage('background')"><i class="fa fa-upload"></i> Upload background image</button>
                <div id="cfeBgOpacityBox" style="display:none;">${cfeOpacityFieldHtml('id="cfeBgOpacity"', 100, '')}</div>
                <div class="cfe-field"><label>Plain colour</label><input type="color" id="cfeBgColor" value="#ffffff" onchange="cfeSetBgColor(this.value)" /></div>
                <button type="button" class="cfe-add" onclick="cfeUseStarter()"><i class="fa fa-magic"></i> Use starter layout for this design</button>
                <input type="file" id="cfeFile" accept="image/png,image/jpeg,image/webp" style="display:none;" />
            </div>

            <div class="cfe-stage-wrap" id="cfeStageWrap">
                <div class="cfe-stage" id="cfeStage"><div class="cfe-page" id="cfePage"></div></div>
            </div>

            <div class="cfe-panel" id="cfeProps"></div>
        </div>

        <div class="modal fade" id="cfePreviewModal" tabindex="-1" role="dialog">
            <div class="modal-dialog modal-xl" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">PDF preview (sample data)</h5>
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                    </div>
                    <div class="modal-body"><iframe id="cfePreviewFrame" title="PDF preview"></iframe></div>
                    <div class="modal-footer"><a class="cfe-btn" id="cfePreviewDownload" download="certificate-preview.pdf">Download</a></div>
                </div>
            </div>
        </div>
    </div>`;
}

/* properties panel for the selected element (or the page hint when nothing is selected) */
function getCertificateEditorPropsHtml(el, custom) {
    if (!el) {
        var customHint = (custom || []).length
            ? '<h6>Custom fields</h6><div class="cfe-hint">' + custom.map(function (f) { return '<b>' + cfeEscText(f.label) + '</b>'; }).join(', ')
                + ' will be asked for when you issue a certificate with this template.</div>'
            : '';
        return '<h6>Selection</h6><div class="cfe-hint">Click an element on the certificate to change it. '
            + 'Drag to move, drag the blue dot to resize. Arrow keys nudge, Delete removes, Ctrl+Z undoes.</div>'
            + '<h6>Fields</h6><div class="cfe-hint">Fields like <b>{{recipientName}}</b> are filled in automatically when a certificate is issued.</div>'
            + customHint;
    }
    var fonts = Object.keys(CFE_FONTS).map(function (k) {
        return '<option value="' + k + '"' + (el.font === k ? ' selected' : '') + '>' + CFE_FONTS[k].label + '</option>';
    }).join('');
    var insert = '<option value="">Insert field…</option>' + CFE_FIELDS.concat(custom || []).map(function (f) {
        return '<option value="' + cfeEscText(f.key) + '">' + cfeEscText(f.label) + '</option>';
    }).join('');
    var pos = '<div class="cfe-row">'
        + '<div class="cfe-field"><label>X (mm)</label><input type="number" step="0.5" data-prop="x" value="' + cfeNum(el.x) + '"></div>'
        + '<div class="cfe-field"><label>Y (mm)</label><input type="number" step="0.5" data-prop="y" value="' + cfeNum(el.y) + '"></div></div>'
        + '<div class="cfe-row">'
        + '<div class="cfe-field"><label>Width</label><input type="number" step="0.5" data-prop="w" value="' + cfeNum(el.w) + '"></div>'
        + '<div class="cfe-field"><label>Height</label><input type="number" step="0.1" data-prop="h" value="' + cfeNum(el.h) + '"></div></div>';
    var body = '';
    if (el.type === 'text') {
        var alignBtn = function (a, icon) {
            var label = 'Align ' + a;
            return '<button type="button" class="' + (el.align === a ? 'on' : '') + '" title="' + label + '" aria-label="' + label
                + '" aria-pressed="' + (el.align === a) + '" onclick="cfeSetProp(\'align\',\'' + a + '\')"><i class="fa fa-align-' + icon + '"></i></button>';
        };
        body = '<h6>Text</h6>'
            + '<div class="cfe-field"><textarea rows="3" data-prop="text">' + cfeEscText(el.text) + '</textarea></div>'
            + '<div class="cfe-field"><select id="cfeInsertField">' + insert + '</select></div>'
            + '<div class="cfe-field"><label>Font</label><select data-prop="font">' + fonts + '</select></div>'
            + '<div class="cfe-row"><div class="cfe-field"><label>Size (pt)</label><input type="number" min="6" max="120" step="1" data-prop="size" value="' + cfeNum(el.size, 14) + '"></div>'
            + '<div class="cfe-field"><label>Colour</label><input type="color" data-prop="color" value="' + cfeColor(el.color) + '"></div></div>'
            + '<div class="cfe-toggle">'
            + '<button type="button" class="' + (el.bold ? 'on' : '') + '" title="Bold" aria-label="Bold" aria-pressed="' + !!el.bold + '" onclick="cfeSetProp(\'bold\',' + !el.bold + ')"><b>B</b></button>'
            + '<button type="button" class="' + (el.italic ? 'on' : '') + '" title="Italic" aria-label="Italic" aria-pressed="' + !!el.italic + '" onclick="cfeSetProp(\'italic\',' + !el.italic + ')"><i>I</i></button>'
            + alignBtn('left', 'left') + alignBtn('center', 'center') + alignBtn('right', 'right') + '</div>'
            + '<div class="cfe-field"><label>Letter spacing (px)</label><input type="number" step="0.5" data-prop="spacing" value="' + cfeNum(el.spacing) + '"></div>'
            + '<label class="cfe-check"><input type="checkbox" data-prop="fit"' + (el.fit ? ' checked' : '') + '> Keep on one line</label>'
            + '<div class="cfe-hint">Long text always shrinks to fit inside its box.</div>';
    } else if (el.type === 'image') {
        body = '<h6>Image</h6><button type="button" class="cfe-btn" style="width:100%;" onclick="cfePickImage(\'replace\')"><i class="fa fa-refresh"></i> Replace image</button>'
            + cfeOpacityFieldHtml('data-prop="opacity"', el.opacity,
                'Lower it to use the image as a watermark; send it backward so text stays on top.');
    } else if (el.type === 'qr') {
        body = '<h6>QR code</h6><div class="cfe-hint">On the certificate this becomes a QR code that opens the verification page for that certificate.</div>';
    } else if (el.type === 'line') {
        body = '<h6>Line</h6><div class="cfe-field"><label>Colour</label><input type="color" data-prop="color" value="' + cfeColor(el.color, '#999999') + '"></div>';
    }
    return body + '<h6>Position</h6>' + pos
        + '<div class="cfe-actions">'
        + '<button type="button" class="cfe-btn" onclick="cfeDuplicate()" title="Duplicate (Ctrl+D)" aria-label="Duplicate"><i class="fa fa-clone"></i></button>'
        + '<button type="button" class="cfe-btn" onclick="cfeLayer(1)" title="Bring forward" aria-label="Bring forward"><i class="fa fa-arrow-up"></i></button>'
        + '<button type="button" class="cfe-btn" onclick="cfeLayer(-1)" title="Send backward" aria-label="Send backward"><i class="fa fa-arrow-down"></i></button>'
        + '<button type="button" class="cfe-btn" onclick="cfeCenter()" title="Centre horizontally" aria-label="Centre horizontally"><i class="fa fa-arrows-h"></i></button>'
        + '<button type="button" class="cfe-btn danger" onclick="cfeDelete()" title="Delete" aria-label="Delete"><i class="fa fa-trash"></i></button>'
        + '</div>';
}
