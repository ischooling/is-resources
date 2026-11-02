/*
 * myCertificatesContent.js
 * Markup + render helpers for "My Certificates" (a student's own certificates).
 * Rendered into #dashboardContentInHTML by initMyCertificates().
 * Logic lives in myCertificates.js (mcr* functions).
 */

function getMyCertificatesPageContent(title) {
    return `
    <div class="custom-field-scope mcr-scope">
        <style>
            .mcr-scope .mcr-header{display:flex;align-items:flex-end;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:18px;}
            .mcr-scope .mcr-title{font-size:20px;font-weight:600;color:#2b2f42;}
            .mcr-scope .mcr-sub{font-size:13px;color:#7a7f95;margin-top:2px;}
            .mcr-scope .mcr-search{min-width:220px;max-width:100%;padding:8px 12px;border:1px solid #d7dae8;border-radius:8px;font-size:13px;}
            .mcr-scope .mcr-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;}
            .mcr-scope .mcr-card{position:relative;border:1px solid #e6e8f0;border-radius:12px;background:#fff;overflow:hidden;display:flex;flex-direction:column;}
            .mcr-scope .mcr-card-top{padding:18px 18px 14px;background:linear-gradient(135deg,#f4f5ff 0%,#fffaf0 100%);border-bottom:1px solid #eef0f6;display:flex;gap:14px;align-items:flex-start;}
            .mcr-scope .mcr-seal{flex:0 0 44px;height:44px;border-radius:50%;background:var(--pc,#16aaff);color:#fff;display:flex;align-items:center;justify-content:center;font-size:20px;box-shadow:0 0 0 4px color-mix(in srgb, var(--pc,#16aaff) 20%, white);}
            .mcr-scope .mcr-card h4{margin:0 0 6px;font-size:16px;line-height:1.3;color:#2b2f42;word-break:break-word;}
            .mcr-scope .mcr-chip{display:inline-block;font-size:11px;padding:2px 8px;border-radius:20px;background:color-mix(in srgb, var(--pc,#16aaff) 12%, white);color:var(--pc,#16aaff);margin:0 6px 4px 0;}
            .mcr-scope .mcr-chip.mcr-wait{background:#fff4e0;color:#9a6200;}
            .mcr-scope .mcr-card-body{padding:12px 18px 16px;font-size:13px;color:#555b70;flex:1;display:flex;flex-direction:column;gap:6px;}
            .mcr-scope .mcr-code{font-family:Menlo,Consolas,monospace;font-size:12px;color:#2b2f42;}
            .mcr-scope .mcr-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:auto;padding-top:10px;}
            .mcr-scope .mcr-btn{border:0;border-radius:8px;padding:8px 12px;font-size:13px;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;gap:6px;}
            .mcr-scope .mcr-btn:hover{text-decoration:none;}
            .mcr-scope .mcr-btn-primary{background:var(--pc,#16aaff);color:#fff;}
            .mcr-scope .mcr-btn-primary:hover{color:#fff;background:color-mix(in srgb, var(--pc,#16aaff) 85%, black);}
            .mcr-scope .mcr-btn-light{background:#e9ecef;color:#212529;}
            .mcr-scope .mcr-btn-light:hover{color:#212529;background:#dde1e5;}
            .mcr-scope a.mcr-btn-light,.mcr-scope a.mcr-btn-light:hover{color:#212529;}
            .mcr-scope .mcr-empty{padding:48px 20px;text-align:center;color:#7a7f95;border:1px dashed #d7dae8;border-radius:12px;background:#fafbff;}
            .mcr-scope .mcr-empty i{font-size:34px;color:#c3c7e8;display:block;margin-bottom:10px;}
            .mcr-scope .mcr-tools{display:flex;gap:10px;align-items:center;flex-wrap:wrap;}
            .mcr-scope .mcr-section{font-size:15px;font-weight:600;color:#2b2f42;margin:6px 0 10px;}
            .mcr-scope .mcr-reqs{display:flex;flex-direction:column;gap:10px;margin-bottom:22px;}
            .mcr-scope .mcr-req{border:1px solid #e6e8f0;border-radius:12px;background:#fff;padding:12px 16px;display:flex;gap:12px;align-items:center;flex-wrap:wrap;}
            .mcr-scope .mcr-req-main{flex:1;min-width:200px;}
            .mcr-scope .mcr-req-main b{color:#2b2f42;}
            .mcr-scope .mcr-req-sub{font-size:12px;color:#7a7f95;margin-top:2px;}
            .mcr-scope .mcr-req-reason{font-size:12px;color:#c63b3b;margin-top:4px;}
            .mcr-scope .mcr-chip.mcr-ok{background:#e8f6ee;color:#1f8f4e;}
            .mcr-scope .mcr-chip.mcr-no{background:#fbeceb;color:#c63b3b;}
            .mcr-scope .mcr-chip.mcr-off{background:#f1f2f6;color:#7a7f95;}
            .mcr-scope .mcr-steps{display:flex;margin:10px 0 2px;padding:0;list-style:none;width:100%;}
            .mcr-scope .mcr-steps li{flex:1;position:relative;text-align:center;font-size:11px;color:#9aa0b5;padding-top:20px;min-width:0;}
            .mcr-scope .mcr-steps li:before{content:'';position:absolute;top:5px;left:50%;width:12px;height:12px;margin-left:-6px;border-radius:50%;background:#dfe2ee;z-index:1;}
            .mcr-scope .mcr-steps li:after{content:'';position:absolute;top:10px;left:-50%;width:100%;height:2px;background:#dfe2ee;}
            .mcr-scope .mcr-steps li:first-child:after{display:none;}
            .mcr-scope .mcr-steps li.done{color:#2b2f42;}
            .mcr-scope .mcr-steps li.done:before,.mcr-scope .mcr-steps li.done:after{background:var(--pc,#16aaff);}
            .mcr-scope .mcr-steps li.now{color:var(--pc,#16aaff);font-weight:600;}
            .mcr-scope .mcr-steps li.now:before{box-shadow:0 0 0 4px color-mix(in srgb, var(--pc,#16aaff) 20%, white);}
            .mcr-scope .mcr-steps li{padding-left:2px;padding-right:2px;line-height:1.25;}
            .mcr-scope .mcr-req .mcr-steps{flex:0 0 100%;}
            @media (max-width:480px){.mcr-scope .mcr-steps li{font-size:10px;}}
            .mcr-scope .mcr-form-field{display:flex;flex-direction:column;margin-bottom:14px;}
            .mcr-scope .mcr-form-field label{font-size:12px;color:#7a7f95;margin-bottom:4px;}
            .mcr-scope .mcr-form-field select,.mcr-scope .mcr-form-field input,.mcr-scope .mcr-form-field textarea{padding:9px 10px;border:1px solid #d7dae8;border-radius:8px;font-size:14px;}
            .mcr-scope .mcr-form-field .mcr-hint{font-size:12px;color:#9aa0b5;margin-top:4px;}
        </style>

        <div class="mcr-header">
            <div>
                <div class="mcr-title"><i class="fa fa-graduation-cap mr-2"></i>${title}</div>
                <div class="mcr-sub">Certificates your school has issued to you. Anyone can check one is genuine with its Certificate ID.</div>
            </div>
            <div class="mcr-tools">
                <input type="search" class="mcr-search" id="mcrSearch" placeholder="Search certificates…" aria-label="Search certificates" style="display:none;" />
                <button type="button" class="mcr-btn mcr-btn-primary" id="mcrRequestBtn" onclick="mcrOpenRequest()"><i class="fa fa-plus"></i> Request a certificate</button>
            </div>
        </div>
        <div id="mcrRequests"></div>
        <div class="mcr-section" id="mcrCertTitle" style="display:none;">My certificates</div>
        <div id="mcrList"><div class="mcr-empty">Loading…</div></div>
    </div>`;
}

function mcrCardHtml(c, index) {
    var title = c.activityTitle || c.templateName || 'Certificate';
    var chips = (c.activityType ? '<span class="mcr-chip">' + mcrEscape(c.activityType) + '</span>' : '')
        + (c.pdfStatus === 'READY' ? '' : '<span class="mcr-chip mcr-wait">Being prepared</span>');
    var download = c.pdfStatus === 'READY' && c.pdfUrl
        ? '<a class="mcr-btn mcr-btn-primary" href="' + mcrEscape(c.pdfUrl) + '" target="_blank" rel="noopener"><i class="fa fa-download"></i> Download PDF</a>'
        : '';
    var verify = c.verifyUrl
        ? '<a class="mcr-btn mcr-btn-light" href="' + mcrEscape(c.verifyUrl) + '" target="_blank" rel="noopener"><i class="fa fa-check-circle"></i> Verify</a>'
          + '<button type="button" class="mcr-btn mcr-btn-light" onclick="mcrCopyLink(' + index + ')" aria-label="Copy the verification link for ' + mcrEscape(title) + '"><i class="fa fa-link"></i> Copy link</button>'
        : '';
    return `
    <div class="mcr-card">
        <div class="mcr-card-top">
            <div class="mcr-seal" aria-hidden="true"><i class="fa fa-certificate"></i></div>
            <div style="min-width:0;">
                <h4>${mcrEscape(title)}</h4>
                <div>${chips}</div>
            </div>
        </div>
        <div class="mcr-card-body">
            <div>Awarded to <b>${mcrEscape(c.recipientName || '')}</b></div>
            <div>Issued ${mcrFormatDate(c.issueDate)}</div>
            <div>Certificate ID: <span class="mcr-code">${mcrEscape(c.certCode || '')}</span></div>
            ${c.pdfStatus === 'READY' ? '' : '<div style="font-size:12px;color:#9a6200;">Your PDF is being prepared. Please check back in a few minutes.</div>'}
            <div class="mcr-actions">${download}${verify}</div>
        </div>
    </div>`;
}

function mcrListHtml(rows, filtered) {
    if (!rows.length) {
        return filtered
            ? '<div class="mcr-empty">No certificate matches your search.</div>'
            : '<div class="mcr-empty"><i class="fa fa-certificate" aria-hidden="true"></i>You don\'t have any certificates yet.<br>When your school issues you one, it will appear here.</div>';
    }
    return '<div class="mcr-grid">' + rows.map(function (r) { return mcrCardHtml(r.cert, r.index); }).join('') + '</div>';
}

/* ---- requests ---- */

var MCR_REQUEST_STATUS = {
    PENDING: ['Requested', 'mcr-wait'], UNDER_REVIEW: ['Under review', 'mcr-wait'], GENERATING: ['Generating certificate', 'mcr-wait'],
    DISPATCHING: ['Dispatching', 'mcr-wait'], PROCESSING: ['Generating certificate', 'mcr-wait'], APPROVED: ['Certificate generated', 'mcr-ok'],
    REJECTED: ['Not approved', 'mcr-no'], CANCELLED: ['Cancelled', 'mcr-off']
};

/* where the request is: Requested, Under review, Generating certificate, (Dispatching, only for a physical copy), Certificate generated */
function mcrStepsHtml(status) {
    var steps = [['PENDING', 'Requested'], ['UNDER_REVIEW', 'Under review'], ['GENERATING', 'Generating certificate']];
    if (status === 'DISPATCHING') { steps.push(['DISPATCHING', 'Dispatching']); }
    steps.push(['APPROVED', 'Certificate generated']);
    var at = status === 'PROCESSING' ? 2 : steps.map(function (s) { return s[0]; }).indexOf(status);
    if (at < 0) { return ''; }
    return '<ol class="mcr-steps" aria-label="Request progress">' + steps.map(function (s, i) {
        var cls = i < at || status === 'APPROVED' ? 'done' : (i === at ? 'now' : '');
        return '<li class="' + cls + '"' + (i === at ? ' aria-current="step"' : '') + '>' + s[1] + '</li>';
    }).join('') + '</ol>';
}

function mcrRequestHtml(r) {
    var s = MCR_REQUEST_STATUS[r.status] || [r.status || '', 'mcr-off'];
    var grade = [r.gradeLabel || r.grade, r.academicYear].filter(function (v) { return v; }).join(' · ');
    var actions = '';
    if (r.status === 'PENDING') {
        actions = '<button type="button" class="mcr-btn mcr-btn-light" onclick="mcrCancelRequest(' + r.id + ')">Cancel</button>';
    } else if (r.status === 'APPROVED') {
        actions = (r.pdfUrl ? '<a class="mcr-btn mcr-btn-primary" href="' + mcrEscape(r.pdfUrl) + '" target="_blank" rel="noopener"><i class="fa fa-download"></i> Download</a>'
                : '<span class="mcr-req-sub">PDF being prepared</span>')
            + (r.verifyUrl ? ' <a class="mcr-btn mcr-btn-light" href="' + mcrEscape(r.verifyUrl) + '" target="_blank" rel="noopener">Verify</a>' : '');
    }
    return '<div class="mcr-req"><div class="mcr-req-main"><b>' + mcrEscape(r.typeName || '') + '</b> <span class="mcr-chip ' + s[1] + '">' + mcrEscape(s[0]) + '</span>'
        + '<div class="mcr-req-sub">' + (grade ? mcrEscape(grade) + ' · ' : '') + 'Requested ' + mcrFormatDate(r.requestedAt)
        + (r.purpose ? ' · ' + mcrEscape(r.purpose) : '') + '</div>'
        + (r.status === 'REJECTED' && r.rejectReason ? '<div class="mcr-req-reason">Reason: ' + mcrEscape(r.rejectReason) + '</div>' : '')
        + '</div><div>' + actions + '</div>' + mcrStepsHtml(r.status) + '</div>';
}

function mcrRequestsHtml(rows) {
    if (!rows.length) { return ''; }
    return '<div class="mcr-section">My requests</div><div class="mcr-reqs">' + rows.map(mcrRequestHtml).join('') + '</div>';
}

function mcrTypeOptionsHtml(types) {
    return '<option value="">Choose…</option>' + types.map(function (t) {
        return '<option value="' + t.id + '">' + mcrEscape(t.typeName) + '</option>';
    }).join('');
}

/* every enrolment the student has had; the current one is chosen first */
function mcrEnrolmentOptionsHtml(enrolments) {
    return enrolments.map(function (e, i) {
        var label = [e.gradeLabel || e.grade, e.academicYear].filter(function (v) { return v; }).join(' · ') + (e.current ? ' (current)' : '');
        return '<option value="' + e.studentStandardId + '"' + ((e.current || (i === 0 && !enrolments.some(function (x) { return x.current; }))) ? ' selected' : '')
            + '>' + mcrEscape(label) + '</option>';
    }).join('');
}

function mcrRequestModalHtml() {
    return `
    <div class="modal fade" id="mcrRequestModal" tabindex="-1" role="dialog" aria-labelledby="mcrRequestTitle">
      <div class="modal-dialog" role="document" style="max-width:520px;">
        <div class="modal-content custom-field-scope mcr-scope">
          <div class="modal-header">
            <h5 class="modal-title" id="mcrRequestTitle">Request a certificate</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">&times;</button>
          </div>
          <div class="modal-body" id="mcrRequestBody">
            <div class="mcr-form-field"><label for="mcrReqType">Certificate you need *</label><select id="mcrReqType" onchange="mcrOnTypeChange()"></select></div>
            <div class="mcr-form-field" id="mcrReqNameBox" style="display:none;"><label for="mcrReqName">Name of the certificate *</label>
              <input type="text" id="mcrReqName" maxlength="150" placeholder="e.g. Bonafide Certificate" /></div>
            <div class="mcr-form-field" id="mcrReqGradeBox"><label for="mcrReqGrade">Grade *</label><select id="mcrReqGrade"></select>
              <div class="mcr-hint">Choose the grade (and year) the certificate should mention.</div></div>
            <div class="mcr-form-field"><label for="mcrReqPurpose">Purpose (optional)</label>
              <textarea id="mcrReqPurpose" rows="2" maxlength="500" placeholder="e.g. a visa application"></textarea></div>
          </div>
          <div class="modal-footer">
            <button type="button" class="mcr-btn mcr-btn-light" data-dismiss="modal">Cancel</button>
            <button type="button" class="mcr-btn mcr-btn-primary" id="mcrReqSubmit" onclick="mcrSubmitRequest()">Send request</button>
          </div>
        </div>
      </div>
    </div>`;
}

