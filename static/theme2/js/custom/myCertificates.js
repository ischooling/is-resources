/*
 * myCertificates.js
 * Logic for "My Certificates": lists the signed-in user's own certificates
 * (the server takes the user from the session). Markup lives in myCertificatesContent.js.
 * Shared: callCommonAjax / showMessageTheme2 / customLoader, globals
 * SCHOOL_ID / USER_ID / APP_BASE_URL / API_VERSION.
 */

var mcrState = { certificates: [], search: '', requests: [], options: null };

function mcrApiBase() {
    var u = APP_BASE_URL + API_VERSION + 'certificate/';
    var i = u.indexOf('://');
    return i < 0 ? u.replace(/\/{2,}/g, '/') : u.substring(0, i + 3) + u.substring(i + 3).replace(/\/{2,}/g, '/');
}

function mcrEscape(s) {
    if (s === null || s === undefined) { return ''; }
    return String(s).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
}

function mcrFormatDate(d) {
    if (!d) { return ''; }
    var dt = new Date(d);
    if (isNaN(dt.getTime())) { return ''; }
    return dt.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
}

function myCertificatesOnLoad() {
    mcrState.certificates = [];
    mcrState.search = '';
    $('#mcrSearch').val('').off('input').on('input', function () {
        mcrState.search = (this.value || '').trim().toLowerCase();
        mcrRender();
    });
    if ($('#mcrRequestModal').length === 0) {
        $('body').append(mcrRequestModalHtml());
    }
    mcrLoad();
    mcrLoadRequests();
}

function mcrPost(path, body) {
    return callCommonAjax({
        method: 'POST',
        url: mcrApiBase() + path,
        body: $.extend({ schoolId: SCHOOL_ID, userId: USER_ID }, body || {}),
        global: false,
        showMessage: false
    });
}

function mcrIsSuccess(response) {
    return response && (response.status === 'SUCCESS' || response.statusCode === '200');
}

/* ---- requests ---- */

function mcrLoadRequests() {
    mcrPost('my/requests').then(function (response) {
        mcrState.requests = mcrIsSuccess(response) ? (response.details || []) : [];
        $('#mcrRequests').html(mcrRequestsHtml(mcrState.requests));
        $('#mcrCertTitle').toggle(mcrState.requests.length > 0);
    }, function () {
        $('#mcrRequests').empty();
    });
}

function mcrOpenRequest() {
    $('#mcrReqType').html('<option value="">Loading…</option>');
    $('#mcrReqGrade').empty();
    $('#mcrReqName, #mcrReqPurpose').val('');
    $('#mcrReqNameBox').hide();
    $('#mcrReqSubmit').prop('disabled', true);
    $('#mcrRequestModal').modal('show');
    mcrPost('my/request-options').then(function (response) {
        if (!mcrIsSuccess(response)) {
            $('#mcrReqType').html('<option value="">' + mcrEscape((response && response.message) || 'Could not load the options.') + '</option>');
            return;
        }
        var d = mcrState.options = response.details || { types: [], enrolments: [] };
        if (!(d.types || []).length) {
            $('#mcrReqType').html('<option value="">Your school is not taking requests right now</option>');
            return;
        }
        $('#mcrReqType').html(mcrTypeOptionsHtml(d.types));
        $('#mcrReqGrade').html(mcrEnrolmentOptionsHtml(d.enrolments || []));
        $('#mcrReqGradeBox').toggle((d.enrolments || []).length > 0);
        $('#mcrReqSubmit').prop('disabled', false);
    }, function () {
        $('#mcrReqType').html('<option value="">Could not load the options</option>');
    });
}

function mcrSelectedType() {
    var id = parseInt($('#mcrReqType').val(), 10);
    return ((mcrState.options || {}).types || []).filter(function (t) { return t.id === id; })[0] || null;
}

function mcrOnTypeChange() {
    var t = mcrSelectedType();
    $('#mcrReqNameBox').toggle(!!(t && t.askName));
    if (t && t.askName) { $('#mcrReqName').focus(); }
}

function mcrSubmitRequest() {
    var t = mcrSelectedType();
    if (!t) { showMessageTheme2(0, 'Please choose the certificate you need.'); return; }
    var name = ($('#mcrReqName').val() || '').trim();
    if (t.askName && !name) { showMessageTheme2(0, 'Please enter the name of the certificate you need.'); $('#mcrReqName').focus(); return; }
    var hasGrades = ((mcrState.options || {}).enrolments || []).length > 0;
    var grade = parseInt($('#mcrReqGrade').val(), 10) || null;
    if (hasGrades && !grade) { showMessageTheme2(0, 'Please choose the grade.'); return; }
    $('#mcrReqSubmit').prop('disabled', true);
    mcrPost('my/requests/create', { requestTypeId: t.id, otherName: t.askName ? name : null, studentStandardId: grade,
        purpose: ($('#mcrReqPurpose').val() || '').trim() }).then(function (response) {
        $('#mcrReqSubmit').prop('disabled', false);
        if (!mcrIsSuccess(response)) {
            showMessageTheme2(0, (response && response.message) || 'Could not send the request.');
            return;
        }
        showMessageTheme2(1, 'Your request has been sent to the school. You will see it here once it is approved.');
        $('#mcrRequestModal').modal('hide');
        mcrLoadRequests();
    }, function () {
        $('#mcrReqSubmit').prop('disabled', false);
        showMessageTheme2(0, 'Could not send the request. Please try again.');
    });
}

function mcrCancelRequest(id) {
    if (!window.confirm('Cancel this request?')) { return; }
    mcrPost('my/requests/cancel', { requestId: id }).then(function (response) {
        if (!mcrIsSuccess(response)) {
            showMessageTheme2(0, (response && response.message) || 'Could not cancel the request.');
        } else {
            showMessageTheme2(1, 'Request cancelled');
        }
        mcrLoadRequests();
    });
}

function mcrLoad() {
    customLoader(true);
    callCommonAjax({
        method: 'POST',
        url: mcrApiBase() + 'my/list',
        body: { schoolId: SCHOOL_ID, userId: USER_ID },
        global: true,
        showMessage: false
    }).then(function (response) {
        customLoader(false);
        var ok = response && (response.status === 'SUCCESS' || response.statusCode === '200');
        mcrState.certificates = ok ? (response.details || []) : [];
        if (!ok) {
            $('#mcrList').html('<div class="mcr-empty">' + mcrEscape((response && response.message) || 'Could not load your certificates.') + '</div>');
            return;
        }
        $('#mcrSearch').toggle(mcrState.certificates.length > 6);
        mcrRender();
    }, function () {
        customLoader(false);
        $('#mcrList').html('<div class="mcr-empty">Could not load your certificates. Please try again.</div>');
    });
}

function mcrRender() {
    var q = mcrState.search;
    var rows = mcrState.certificates.map(function (c, i) { return { cert: c, index: i }; }).filter(function (r) {
        var c = r.cert;
        return !q || [c.activityTitle, c.activityType, c.templateName, c.certCode].some(function (v) {
            return v && String(v).toLowerCase().indexOf(q) >= 0;
        });
    });
    $('#mcrList').html(mcrListHtml(rows, !!q));
}

/* copies the public verification link, e.g. to add it to a CV or an application */
function mcrCopyLink(index) {
    var c = mcrState.certificates[index];
    if (!c || !c.verifyUrl) { return; }
    var done = function () { showMessageTheme2(1, 'Verification link copied'); };
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(c.verifyUrl).then(done, function () { mcrCopyFallback(c.verifyUrl, done); });
    } else {
        mcrCopyFallback(c.verifyUrl, done);
    }
}

function mcrCopyFallback(text, done) {
    var box = $('<textarea readonly style="position:fixed;top:-1000px;"></textarea>').val(text).appendTo('body');
    box[0].select();
    try {
        if (document.execCommand('copy')) { done(); } else { window.prompt('Copy this link:', text); }
    } catch (e) {
        window.prompt('Copy this link:', text);
    }
    box.remove();
}
