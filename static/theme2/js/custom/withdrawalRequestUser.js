/* ==========================================================================
   Withdrawal Request — shared user module (parent & student profiles)
   Loaded on both the parent/admin profile (adminProfileContent.js) and the
   student profile (profileViewNewContent.js). Entry points:
     - parent:  openWithdrawalRequest()            (child selection then form)
     - student: openWithdrawalRequestForStudent(id) (own form directly)
   ========================================================================== */
var WITHDRAWAL_MODE = "parent";   // "parent" | "student"

/* Parent entry: hide the profile card, show child selection, then the form. */
function openWithdrawalRequest(){
    WITHDRAWAL_MODE = "parent";
    withdrawalEnsureStyles();
    withdrawalBindNfFocus();
    $("#withdrawalProfileCard").addClass("d-none");
    $("#withdrawalRequestSection").removeClass("d-none");
    $("#withdrawalRequestBody").html(getWithdrawalChildSelectionHtml());
    renderWithdrawalRequestChildCards();
}

/* Student entry: the student initiates their own withdrawal (no child selection). */
function openWithdrawalRequestForStudent(studentUserId){
    WITHDRAWAL_MODE = "student";
    withdrawalEnsureStyles();
    withdrawalBindNfFocus();
    selectWithdrawalRequestChild(studentUserId);
}

/* true when a parent is acting for a child (controls wording: "your child's" vs "your"). */
function withdrawalSubIsParent(){ return WITHDRAWAL_MODE === "parent"; }

function withdrawalBindNfFocus(){
    if(window.__wdNfBound){ return; }
    window.__wdNfBound = true;
    $(document).on("focusin", ".wd-scope .wd-nf", function(){ $(this).addClass("focus filled"); });
    $(document).on("focusout", ".wd-scope .wd-nf", function(){
        var $nf = $(this).removeClass("focus");
        var c = $nf.find("input,textarea,select");
        if(!($.trim(c.val() || "")) && !$nf.hasClass("readonly")){ $nf.removeClass("filled"); }
    });
    $(document).on("input change", ".wd-scope .wd-nf input, .wd-scope .wd-nf textarea, .wd-scope .wd-nf select", function(){
        if($.trim($(this).val() || "")){ $(this).closest(".wd-nf").addClass("filled"); }
    });
}

function withdrawalEnsureStyles(){
    if(document.getElementById("withdrawalStyles")){ return; }
    var css =
        `<style id="withdrawalStyles">
        :root{--isb:#2B7FFF;--isbd:#1667D4;--isbs:#EAF2FF;--isb100:#DCEAFF;--isg:#16A34A;--isgd:#15803D;--isgs:#E7F7ED;--isr:#EF4444;--isrd:#DC2626;--isrs:#FDECEC;--isa:#D97706;--isas:#FEF3E2;--ist:#0D9488;--ists:#E2F6F4;--isp:#7C3AED;--isps:#F1EBFE;--ink:#1F2A3A;--inks:#5A6B82;--inkf:#94A3B8;--line:#D7E0EC;--lines:#E8EEF6}
        .wd-scope{color:var(--ink)}
        .wd-scope h3,.wd-scope h4,.wd-scope h5{font-family:'Poppins','Nunito Sans',sans-serif}
        .wd-back{border:1.5px solid var(--line);background:#fff;color:var(--ink);border-radius:8px;padding:7px 13px;font-size:12.5px;font-weight:700;display:inline-flex;align-items:center;gap:6px;cursor:pointer}
        .wd-back:hover{background:var(--isbs);border-color:var(--isb)}
        .wd-sec-title{display:flex;align-items:center;gap:10px;font-weight:600;font-size:18px;margin:0 0 18px;color:var(--ink)}
        .wd-sec-title .bi{width:26px;height:26px;border-radius:7px;background:var(--isbs);color:var(--isb);display:grid;place-items:center;font-size:14px;flex:0 0 auto}
        .wd-head{display:flex;align-items:center;gap:9px;font-size:12px;font-weight:800;letter-spacing:.03em;text-transform:uppercase;color:var(--isbd);margin:2px 0 12px}
        .wd-nf{position:relative;border:1.5px solid var(--line);border-radius:9px;padding:8px 12px 6px;background:#fff;transition:.15s;margin-bottom:2px}
        .wd-nf.filled,.wd-nf.focus{border-color:var(--isb)}
        .wd-nf.focus{box-shadow:0 0 0 3px var(--isbs)}
        .wd-nf .lab{position:absolute;top:-8px;left:11px;background:#fff;padding:0 6px;font-size:11px;font-weight:700;color:var(--inkf)}
        .wd-nf.filled .lab,.wd-nf.focus .lab{color:var(--isb)}
        .wd-nf .req{color:var(--isr)}
        .wd-nf input,.wd-nf select,.wd-nf textarea{width:100%;border:0;outline:none;background:transparent;font-size:14.5px;color:var(--ink);padding:2px 0;font-family:inherit}
        .wd-nf textarea{resize:vertical;min-height:74px}
        .wd-nf select{-webkit-appearance:none;appearance:none;cursor:pointer}
        .wd-nf.sel::after{content:"▾";position:absolute;right:12px;top:50%;transform:translateY(-40%);color:var(--inkf);pointer-events:none}
        .wd-nf.readonly{background:#F7FAFE}
        .wd-nf.readonly input{color:var(--inks)}
        .wd-grid2{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}
        .wd-grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
        @media(max-width:680px){.wd-grid2,.wd-grid3{grid-template-columns:1fr}}
        .wd-divider{height:1px;background:var(--lines);margin:20px 0}
        .wd-btn{border:0;border-radius:8px;padding:11px 18px;font-weight:700;font-size:14px;display:inline-flex;align-items:center;gap:8px;justify-content:center;font-family:inherit;cursor:pointer;transition:.15s}
        .wd-btn:disabled{opacity:.5;cursor:not-allowed}
        .wd-btn-sm{padding:7px 13px;font-size:12.5px}
        .wd-btn-blue{background:var(--isb);color:#fff}.wd-btn-blue:hover:not(:disabled),.wd-btn-blue:hover{background:var(--isbd);color:#fff}
        .wd-btn-green{background:var(--isg);color:#fff}.wd-btn-green:hover:not(:disabled){background:var(--isgd)}
        .wd-btn-red{background:var(--isr);color:#fff}
        .wd-btn-ghost{background:#fff;border:1.5px solid var(--line);color:var(--ink)}
        .wd-btn-block{width:100%}
        .wd-badge{display:inline-flex;align-items:center;gap:6px;font-size:11.5px;font-weight:800;padding:4px 11px;border-radius:20px;white-space:nowrap}
        .wd-badge .dot{width:7px;height:7px;border-radius:50%}
        .wd-b-review{background:var(--isas);color:var(--isa)}.wd-b-review .dot{background:var(--isa)}
        .wd-b-approved{background:var(--isgs);color:var(--isgd)}.wd-b-approved .dot{background:var(--isg)}
        .wd-b-denied{background:var(--isrs);color:var(--isrd)}.wd-b-denied .dot{background:var(--isr)}
        .wd-b-refund{background:var(--ists);color:var(--ist)}.wd-b-refund .dot{background:var(--ist)}
        .wd-b-challenge{background:var(--isps);color:var(--isp)}.wd-b-challenge .dot{background:var(--isp)}
        .wd-reqcard{border:1px solid var(--line);border-radius:12px;padding:18px;margin-bottom:14px}
        .wd-req-top{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap}
        .wd-req-id{font-size:11.5px;color:var(--inkf);font-weight:800;letter-spacing:.03em}
        .wd-req-h{font-family:'Poppins';font-weight:600;font-size:15.5px;margin:2px 0 0}
        .wd-req-meta{font-size:12.5px;color:var(--inks);margin-top:2px}
        .wd-tracker{display:flex;align-items:flex-start;margin:18px 0 6px;overflow-x:auto;padding-bottom:4px}
        .wd-step{display:flex;flex-direction:column;align-items:center;text-align:center;width:92px;flex:0 0 auto}
        .wd-step .rg{width:30px;height:30px;border-radius:50%;border:2px solid var(--line);background:#fff;display:grid;place-items:center;font-size:12px;font-weight:800;color:var(--inkf)}
        .wd-step .cp{font-size:10.5px;margin-top:7px;font-weight:700;color:var(--inkf);line-height:1.25}
        .wd-step.done .rg{background:var(--isb);border-color:var(--isb);color:#fff}.wd-step.done .cp{color:var(--ink)}
        .wd-step.active .rg{border-color:var(--isb);color:var(--isb);box-shadow:0 0 0 4px var(--isbs)}.wd-step.active .cp{color:var(--isbd)}
        .wd-step.good .rg{background:var(--isg);border-color:var(--isg);color:#fff}
        .wd-step.bad .rg{background:var(--isr);border-color:var(--isr);color:#fff}
        .wd-step.esc .rg{background:var(--isp);border-color:var(--isp);color:#fff}
        .wd-step.teal .rg{background:var(--ist);border-color:var(--ist);color:#fff}
        .wd-conn{flex:1;min-width:16px;height:2px;background:var(--line);margin:14px -8px 0}
        .wd-conn.fill{background:var(--isb)}
        .wd-note{border-radius:10px;padding:13px 15px;font-size:13px;margin-top:14px}
        .wd-note .who{font-size:10.5px;font-weight:800;text-transform:uppercase;letter-spacing:.04em;color:var(--inkf);margin-bottom:3px}
        .wd-note.approved{background:var(--isgs);border:1px solid #BBE7C9;color:#186234}
        .wd-note.denied{background:var(--isrs);border:1px solid #F5C3C3;color:#8f2020}
        .wd-note.refund{background:var(--ists);border:1px solid #B9E5E0;color:#0b5e58}
        .wd-note.plain{background:#F7FAFE;border:1px solid var(--lines);color:var(--inks)}
        .wd-refund-steps{background:var(--isbs);border:1px solid var(--isb100);border-radius:11px;padding:16px 18px;margin-top:14px}
        .wd-refund-steps .rt{font-family:'Poppins';font-weight:600;font-size:15px;color:var(--isbd);margin-bottom:8px}
        .wd-challenge{border:1px dashed var(--isp);background:var(--isps);border-radius:11px;padding:16px;margin-top:14px}
        .wd-challenge h4{margin:0 0 3px;font-size:14.5px;color:var(--isp)}
        .wd-challenge p{margin:0;font-size:13px;color:#4a2c86}
        .wd-acc{border:1px solid var(--line);border-radius:10px;margin-bottom:12px;overflow:hidden}
        .wd-acc summary{list-style:none;cursor:pointer;padding:14px 16px;display:flex;align-items:center;gap:11px;font-weight:700;font-size:14px}
        .wd-acc summary::-webkit-details-marker{display:none}
        .wd-acc summary .tag{font-size:10.5px;font-weight:800;padding:3px 8px;border-radius:20px;background:var(--isbs);color:var(--isbd);text-transform:uppercase;letter-spacing:.03em}
        .wd-acc summary .chev{margin-left:auto;color:var(--inkf);transition:.2s}
        .wd-acc[open] summary .chev{transform:rotate(180deg)}
        .wd-acc-body{padding:4px 16px 16px;font-size:13.5px;color:var(--inks);border-top:1px solid var(--lines)}
        .wd-acc-body ul{margin:11px 0;padding-left:20px}.wd-acc-body li{margin-bottom:6px}
        .wd-ack{display:flex;gap:11px;align-items:flex-start;background:var(--isbs);border:1px solid var(--isb100);border-radius:10px;padding:13px 15px;margin:16px 0 6px}
        .wd-ack input{width:18px;height:18px;margin-top:2px;accent-color:var(--isb);flex:0 0 auto}
        .wd-ack label{font-size:13px;color:#2c4870;margin:0}
        .wd-warn{display:flex;gap:12px;align-items:flex-start;background:var(--isas);border:1px solid #F5D9A8;border-radius:10px;padding:14px 16px;margin:16px 0}
        .wd-warn .wt{font-weight:800;color:#92600a;font-size:13.5px;margin-bottom:2px}
        .wd-warn .wdd{font-size:13px;color:#9a6a12}
        .wd-child-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:14px}
        .wd-child{border:1px solid var(--line);border-radius:12px;padding:16px;display:flex;gap:13px;align-items:center;cursor:pointer;transition:.15s;background:#fff}
        .wd-child:hover{border-color:var(--isb);box-shadow:0 0 0 3px var(--isbs)}
        .wd-child .cav{width:46px;height:46px;border-radius:50%;background:var(--isb100);color:var(--isbd);display:grid;place-items:center;font-weight:800;font-size:16px;flex:0 0 auto}
        .wd-child .cn{font-weight:700;font-size:15px;color:var(--ink)}
        .wd-child .cm{font-size:12.5px;color:var(--inks);margin-top:2px}
        .wd-child .cid{font-size:11px;color:var(--inkf);margin-top:2px;letter-spacing:.02em}
        .wd-child .go{margin-left:auto;color:var(--isb);font-weight:800;font-size:18px}
        .wd-ov{position:fixed;inset:0;background:rgba(20,34,54,.55);display:none;align-items:center;justify-content:center;z-index:1080;padding:18px}
        .wd-ov.show{display:flex}
        .wd-modal{background:#fff;border-radius:16px;max-width:520px;width:100%;box-shadow:0 18px 50px rgba(30,58,95,.2);max-height:92vh;overflow:auto;font-family:'Nunito Sans',system-ui,sans-serif;color:#1F2A3A}
        .wd-modal-h{padding:22px 24px 0}
        .wd-modal-h h3{margin:0;font-size:20px;font-weight:600;font-family:'Poppins'}
        .wd-modal-h p{margin:6px 0 0;color:#5A6B82;font-size:13.5px}
        .wd-modal-b{padding:18px 24px}
        .wd-modal-f{padding:0 24px 22px;display:flex;gap:10px;justify-content:flex-end;flex-wrap:wrap}
        .wd-m-icon{width:52px;height:52px;border-radius:50%;display:grid;place-items:center;font-size:24px;margin:0 auto 4px}
        .wd-otp{display:flex;gap:8px;justify-content:center;margin:6px 0 10px}
        .wd-otp input{width:44px;height:52px;text-align:center;font-size:22px;font-weight:800;border:1.5px solid #D7E0EC;border-radius:10px;font-family:'Poppins'}
        .wd-otp input:focus{outline:none;border-color:#2B7FFF;box-shadow:0 0 0 3px #EAF2FF}
        .wd-contact{background:#EAF2FF;border:1px solid #DCEAFF;border-radius:10px;padding:12px 14px;font-size:13px;color:#2c4870;margin-top:4px}
        </style>`;
    $("head").append(css);
}

function withdrawalBackToProfile(){
    $("#withdrawalRequestSection").addClass("d-none");
    $("#withdrawalProfileCard").removeClass("d-none");
}

function getWithdrawalChildSelectionHtml(){
    return `<div class="mb-3"><button type="button" class="wd-back" onclick="withdrawalBackToProfile()">&#8592; Back</button></div>
            <div class="wd-sec-title" style="justify-content:center"><span class="bi"><i class="fa fa-users"></i></span> Select a child</div>
            <p style="color:var(--inks);font-size:13.5px;margin:-8px auto 18px;max-width:520px;text-align:center">Choose the child you want to submit a withdrawal request for. Their details will be pre-filled on the next screen.</p>
            <div class="wd-child-grid" id="withdrawalRequestChildCards" style="max-width:640px;margin:0 auto">
                ${getWithdrawalRequestChildCardsSkeleton()}
            </div>`;
}

function withdrawalBackToChildren(){
    $("#withdrawalRequestBody").html(getWithdrawalChildSelectionHtml());
    renderWithdrawalRequestChildCards();
}

function getWithdrawalRequestChildCardsSkeleton(){
    var card =
        `<div class="wd-child" style="cursor:default">
            <div class="skeleton rounded-circle" style="width:46px;height:46px;flex:0 0 auto"></div>
            <div style="flex:1">
                <div class="skeleton mb-2" style="width:60%;height:15px;"></div>
                <div class="skeleton mb-2" style="width:80%;height:12px;"></div>
                <div class="skeleton" style="width:50%;height:12px;"></div>
            </div>
        </div>`;
    return card + card;
}

function resolveWithdrawalRequestChildren(){
    if(typeof STUDENT_LIST === "undefined" || !STUDENT_LIST){
        return [];
    }
    if($.isArray(STUDENT_LIST)){
        return STUDENT_LIST;
    }
    if($.isArray(STUDENT_LIST.studentBasicDetails)){
        return STUDENT_LIST.studentBasicDetails;
    }
    if(STUDENT_LIST.data && $.isArray(STUDENT_LIST.data.studentBasicDetails)){
        return STUDENT_LIST.data.studentBasicDetails;
    }
    return [];
}

async function renderWithdrawalRequestChildCards(){
    var container = $("#withdrawalRequestChildCards");
    if(container.length < 1){
        return;
    }
    var students = resolveWithdrawalRequestChildren();
    if(students.length < 1){
        try{
            var payload = {userId: USER_ID};
            var ajaxReqDetails = {
                method: "POST",
                url: APP_BASE_URL + SCHOOL_UUID + "/dashboard/parent/get-students-by-parent",
                body: payload,
                global: true,
                showMessage: false,
                onFaildResolved: true,
                onSuccessResolved: true
            };
            var response = await callCommonAjax(ajaxReqDetails);
            if(response && $.isArray(response.studentBasicDetails)){
                STUDENT_LIST = response;
                students = response.studentBasicDetails;
            }
        }catch(e){
            students = [];
        }
    }
    if(students.length < 1){
        container.html(`<div class="col-12 text-center text-gray py-3">No child found.</div>`);
        return;
    }
    var html = "";
    $.each(students, function(i, student){
        html += getWithdrawalRequestChildCard(student, i);
    });
    container.html(html);
}

function getWithdrawalRequestChildCard(student, index){
    var studentUserId = student.userId != null ? student.userId : "";
    var studentName = student.studentName || student.fullName || student.userFullName || "Student";
    var grade = student.standardName || student.grade || "";
    var learningLabel = (typeof getLearningProgramLabel === "function")
        ? getLearningProgramLabel(student.learningProgramName || student.learningProgram || "")
        : (student.learningProgramName || student.learningProgram || "");
    var rollNo = student.studentRollNo || student.rollNo || "";
    var detailParts = [];
    if(grade){ detailParts.push(grade); }
    if(learningLabel){ detailParts.push(learningLabel); }
    var detailLine = detailParts.join(" &middot; ");
    var initials = getWithdrawalChildInitials(studentName);
    var html =
        `<div class="wd-child" onclick="selectWithdrawalRequestChild('${studentUserId}')">
            <div class="cav">${withdrawalEscape(initials)}</div>
            <div>
                <div class="cn">${withdrawalEscape(studentName)}</div>
                ${detailLine ? `<div class="cm">${detailLine}</div>` : ``}
                ${rollNo ? `<div class="cid">${withdrawalEscape(rollNo)}</div>` : ``}
            </div>
            <span class="go">&#8250;</span>
        </div>`;
    return html;
}

function getWithdrawalChildInitials(name){
    if(!name){
        return "";
    }
    var parts = $.trim(name).split(/\s+/);
    var initials = parts[0].charAt(0);
    if(parts.length > 1){
        initials += parts[parts.length - 1].charAt(0);
    }
    return initials.toUpperCase();
}

/* ==========================================================================
   Withdrawal Request — parent flow (form -> OTP -> tracker -> bank/challenge)
   ========================================================================== */
var WITHDRAWAL_ACTIVE_CHILD = null;   // studentUserId currently open
var WITHDRAWAL_INIT = null;           // last init response for the open child
var WITHDRAWAL_OTP_CTX = null;        // { requestId, email }

function withdrawalParentApi(path, body){
    return callCommonAjax({
        method: "POST",
        url: APP_BASE_URL + SCHOOL_UUID + "/dashboard/parent/" + path,
        body: body || {},
        global: true,
        showMessage: false,
        onFaildResolved: true,
        onSuccessResolved: true
    });
}

function withdrawalEscape(str){
    if(str === null || str === undefined){ return ""; }
    return String(str)
        .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

async function selectWithdrawalRequestChild(studentUserId){
    WITHDRAWAL_ACTIVE_CHILD = studentUserId;
    var body = $("#withdrawalRequestBody");
    if(body.length < 1){ return; }
    body.html(`<div class="text-center text-gray py-5"><i class="fa fa-spinner fa-spin mr-2"></i>Loading…</div>`);
    try{
        var resp = await withdrawalParentApi("withdrawal-init", { studentUserId: studentUserId });
        if(!resp || resp.status === "3"){ redirectLoginPage(); return; }
        if(resp.status !== "1"){
            body.html(`<div class="text-center text-danger py-4">${withdrawalEscape(resp && resp.message ? resp.message : "Unable to load withdrawal details.")}</div>`);
            return;
        }
        WITHDRAWAL_INIT = resp;
        renderWithdrawalForm(resp);
    }catch(e){
        body.html(`<div class="text-center text-danger py-4">Something went wrong. Please try again.</div>`);
    }
}

function renderWithdrawalForm(data){
    var body = $("#withdrawalRequestBody");
    if(body.length < 1){ return; }
    var s = data.student || {};
    var name = s.studentName || "Student";
    var requests = data.requests || [];
    var canCreate = data.canCreate === true;

    var backBtn = withdrawalSubIsParent()
        ? `<div class="mb-2"><button type="button" class="wd-back" onclick="withdrawalBackToChildren()">&#8592; Back to my children</button></div>`
        : "";
    var title = withdrawalSubIsParent() ? (name ? " — " + withdrawalEscape(name) : "") : "";
    var html =
        `${backBtn}
        <div class="wd-sec-title"></div>
        ${getWithdrawalPrefillHtml(s)}
        <div id="withdrawalRequestsAndForm">${getWithdrawalRequestsAndFormHtml(data)}</div>`;
    body.html(html);
    withdrawalValidateNewForm();
}

function getWithdrawalPrefillHtml(s){
    function ro(label, val){
        return `<div class="wd-nf filled readonly"><span class="lab">${label}</span><input value="${withdrawalEscape(val || "N/A")}" readonly></div>`;
    }
    var learning = (typeof getLearningProgramLabel === "function")
        ? (getLearningProgramLabel(s.programName || "") || s.programName || "")
        : (s.programName || "");
    return `<div class="wd-head">&#9672; Student Details</div>
        <div class="wd-grid2">
            ${ro("Student ID", s.studentStringId)}
            ${ro("Full Name", s.studentName)}
            ${ro("Grade", s.standardName)}
            ${ro("Learning Program", learning)}
        </div>`;
}

function getWithdrawalRequestsAndFormHtml(data){
    var requests = data.requests || [];
    var canCreate = data.canCreate === true;
    var html = "";
    if(requests.length){
        html += `<div class="wd-divider"></div><div class="wd-head">&#9672; My withdrawal requests</div>`;
        requests.forEach(function(r){ html += getWithdrawalRequestCardHtml(r); });
    }
    if(canCreate){
        html += getWithdrawalNewRequestFormHtml(data);
    }else if(requests.length){
        html += `<div class="wd-note" style="background:var(--isbs);border:1px solid var(--isb100);color:#2c4870;margin-top:16px">
            You have a withdrawal request in progress (see status above). You can submit a new request only once the current one is completed. Need help? Contact
            <b>admin.support@internationalschooling.org</b> or <b>+1 (585) 4990662</b>.
        </div>`;
    }else{
        html += `<div class="text-center py-4" style="color:var(--inkf)">No withdrawal request yet.</div>`;
    }
    return html;
}

function getWithdrawalNewRequestFormHtml(data){
    var reasons = data.reasons || [];
    var options = `<option value="">Select a reason…</option>`;
    reasons.forEach(function(r){
        options += `<option value="${withdrawalEscape(r.id)}">${withdrawalEscape(r.reason)}</option>`;
    });
    return `<div class="wd-divider"></div>
        <div class="wd-head">&#9672; New withdrawal request</div>
        <div class="wd-nf sel filled">
            <span class="lab">Primary reason <span class="req">*</span></span>
            <select id="withdrawalReason" onchange="withdrawalValidateNewForm()">${options}</select>
        </div>
        <div class="wd-nf filled" style="margin-top:16px">
            <span class="lab">Tell us more <span class="req">*</span></span>
            <textarea id="withdrawalDesc" placeholder="Briefly explain the reason for this withdrawal request…" oninput="withdrawalValidateNewForm()"></textarea>
        </div>
        <div style="margin-top:16px">${getWithdrawalPolicyBlock()}</div>
        <div class="wd-ack">
            <input type="checkbox" id="withdrawalAck" onchange="withdrawalValidateNewForm()">
            <label for="withdrawalAck">I have read and accept the Withdrawal Terms &amp; Conditions and the Fee Refund Policy.</label>
        </div>
        <div class="wd-warn">
            <span style="font-size:18px;flex:0 0 auto">&#9888;&#65039;</span>
            <div style="flex:1;min-width:0"><div class="wt">Please read before submitting</div>
            <div class="wdd">Submitting this request begins the cancellation of ${withdrawalSubIsParent() ? "your child's" : "your"} enrollment and notifies administration. Enrollment and fees remain active until a withdrawal is formally approved. You'll verify with a one-time code sent to your email before it's submitted.</div></div>
        <button type="button" class="wd-btn wd-btn-blue mt-4" id="withdrawalSubmitBtn" disabled onclick="withdrawalStartOtp()" style="flex:0 0 auto;white-space:nowrap">Verify &amp; submit request</button></div>`;
}

function getWithdrawalPolicyBlock(){
    return `<details class="wd-acc">
            <summary>Withdrawal Terms &amp; Conditions <span class="tag">Please read</span><span class="chev">&#9662;</span></summary>
            <div class="wd-acc-body">
                <ul>
                    <li>Once the withdrawal process is completed, the student's access will be disabled from all the platforms he/she was enrolled in.</li>
                    <li>In case the child wishes to re-apply any time after the withdrawal process is completed, he/she shall be considered as a <b>fresh enrollment</b>.</li>
                    <li>Kindly note that a refund will be made (if any) <b>ONLY</b> to the bank account from which the fee was paid. The refund amount (if any) will be exclusive of the handling fee & transaction fee.</li>
                    <li>Without the specified format, no requests shall be entertained.</li>
                    <li>In case of concealment/misrepresentation of personal, academic, or any other detail by the student/guardian or/and in case of submission of false/fake documents by student/guardian, <b>no refund shall apply</b>.</li>
                    <li>No refund of the <b>Enrollment Fee</b>will be made under any circumstances.</li>
                </ul>
            </div>
        </details>
        <details class="wd-acc">
            <summary>Fee Refund Policy <span class="tag">Please read</span><span class="chev">&#9662;</span></summary>
            <div class="wd-acc-body">
                <p class="mt-2 mb-2">Refunds (if any) are governed by International Schooling's official Fee Refund Policy. Please read the full policy before submitting your request.</p>
                <a href="https://internationalschooling.org/fee-refund-policy" target="_blank" rel="noopener" class="wd-btn wd-btn-blue wd-btn-sm" style="text-decoration:none;color:#fff">View the full Fee Refund Policy &#8599;</a>
            </div>
        </details>`;
}

function withdrawalValidateNewForm(){
    var btn = $("#withdrawalSubmitBtn");
    if(btn.length < 1){ return; }
    var reason = $("#withdrawalReason").val();
    var desc = ($("#withdrawalDesc").val() || "").trim();
    var ack = $("#withdrawalAck").is(":checked");
    btn.prop("disabled", !(reason && desc && ack));
}

/* ---------------- request card + tracker ---------------- */
function withdrawalStatusMeta(status){
    switch((status || "").toUpperCase()){
        case "PENDING":
        case "INITIATED":    return { label:"In Review",       badge:"wd-b-review",    group:"review" };
        case "ACCEPTED":     return { label:"Approved",         badge:"wd-b-approved",  group:"approved" };
        case "BANKDETAIL":   return { label:"Approved · Bank details submitted", badge:"wd-b-approved", group:"approved" };
        case "TRANSFERRED":  return { label:"Refund Initiated", badge:"wd-b-refund",    group:"refund" };
        case "REJECTED":     return { label:"Denied",           badge:"wd-b-denied",    group:"denied" };
        case "CHALLENGED":   return { label:"Challenged",       badge:"wd-b-challenge", group:"challenged" };
        case "CANCELLED":    return { label:"Cancelled",        badge:"wd-b-denied",    group:"cancelled" };
        default:             return { label:(status||"—"),      badge:"wd-b-review",    group:"review" };
    }
}

function withdrawalStatusBadge(status){
    var m = withdrawalStatusMeta(status);
    return `<span class="wd-badge ${m.badge}"><span class="dot"></span>${withdrawalEscape(m.label)}</span>`;
}

function getWithdrawalTrackerHtml(req){
    var group = withdrawalStatusMeta(req.status).group;
    var status = (req.status || "").toUpperCase();
    var n = 0;
    function step(state, label, extraClass){
        n++;
        var cls = state === "done" ? "done" : (state === "active" ? "active" : "");
        if(extraClass){ cls += " " + extraClass; }
        var mark = state === "done" ? "&#10003;" : String(n);
        return `<div class="wd-step ${cls}"><div class="rg">${mark}</div><div class="cp">${label}</div></div>`;
    }
    function conn(filled){ return `<div class="wd-conn ${filled ? "fill" : ""}"></div>`; }

    var inReview = (status === "PENDING" || status === "INITIATED");
    var h = `<div class="wd-tracker">`;
    h += step("done", "Submitted");
    h += conn(true);
    h += step(inReview ? "active" : "done", "In Review");
    h += conn(!inReview);
    if(group === "approved" || group === "refund"){
        h += step("done", "Approved");
        h += conn(group === "refund");
        h += step(group === "refund" ? "done" : "active", group === "refund" ? "Refund initiated" : "Refund");
    }else if(group === "denied" || group === "challenged"){
        h += step("done", "Denied", "bad");
        if(group === "challenged"){
            h += conn(true);
            h += step("done", "Challenged");
        }
    }else{
        h += step("pending", "Decision");
    }
    h += `</div>`;
    return h;
}

function getWithdrawalRequestCardHtml(req){
    var status = (req.status || "").toUpperCase();
    var h = `<div class="wd-reqcard">
        <div class="wd-req-top">
            <div>
                <div class="wd-req-id">${withdrawalEscape(req.requestNo || ("WD-" + req.requestId))}</div>
                <div class="wd-req-h">${withdrawalEscape(req.reason || "Withdrawal request")}</div>
                <div class="wd-req-meta">Submitted ${withdrawalEscape(req.createdDate || "")}</div>
            </div>
            ${withdrawalStatusBadge(req.status)}
        </div>
        ${getWithdrawalTrackerHtml(req)}
        <div class="wd-note plain">
            <div class="who">Your request</div>
            <div><b style="color:var(--ink)">Details:</b> ${withdrawalEscape(req.description || "—")}</div>
        </div>`;

    if((status === "REJECTED" || status === "CHALLENGED") && (req.remarks || req.reason)){
        h += `<div class="wd-note denied"><div class="who">Decision &middot; Student Services</div><b>${withdrawalEscape(req.reason || "")}</b>${req.remarks ? "<br>" + withdrawalEscape(req.remarks) : ""}</div>`;
    }
    if(status === "REJECTED"){
        h += `<div class="wd-challenge"><h4>Disagree with this decision?</h4>
            <p>As set out in the Terms &amp; Conditions, you may challenge this decision in a <b>United States</b> or <b>Singapore</b> court. To proceed, contact <b>admin.support@internationalschooling.org</b> — a school administration representative will be in touch.</p></div>`;
    }
    if(status === "CHALLENGED"){
        h += `<div class="wd-challenge"><h4>&#9878; This request is marked as Challenged</h4>
            <p>Your challenge is under review. A school administration representative will be in touch.</p></div>`;
    }
    if(status === "ACCEPTED"){
        if(req.remarks || req.reason){
            h += `<div class="wd-note approved"><div class="who">Decision &middot; Student Services</div><b>${withdrawalEscape(req.reason || "Approved")}</b>${req.remarks ? "<br>" + withdrawalEscape(req.remarks) : ""}</div>`;
        }
        h += getWithdrawalRefundStepsHtml();
        h += req.bank ? getWithdrawalBankSummaryHtml(req.bank, true) : getWithdrawalBankFormHtml(req);
    }
    if(status === "BANKDETAIL"){
        h += `<div class="wd-note refund"><div class="who">Refund</div><b>Bank details submitted.</b><br>Your refund will be initiated by the school and processed to the original payer within 5–10 business working days per the Fee Refund Policy.</div>`;
        if(req.bank){ h += getWithdrawalBankSummaryHtml(req.bank, true); }
    }
    if(status === "TRANSFERRED"){
        h += `<div class="wd-note refund"><div class="who">Refund &middot; Finance</div><b>Refund initiated from our end.</b><br>${withdrawalEscape(req.remarks || "Your refund is being processed and will reach the original payer within 5–10 business working days.")}</div>`;
        if(req.bank){ h += getWithdrawalBankSummaryHtml(req.bank, true); }
    }
    h += `</div>`;
    return h;
}

function getWithdrawalRefundStepsHtml(){
    return `<div class="wd-refund-steps">
        <div class="rt">Process for Fee Refund</div>
        <p style="margin:0;font-size:13.5px;color:#2c4870">Please refer to the Fee Refund Policy <a href="https://internationalschooling.org/fee-refund-policy" target="_blank" rel="noopener"><b>here</b></a>.</p>
    </div>`;
}

/* ---------------- bank details (after approval) ---------------- */
function getWithdrawalBankFormHtml(req){
    var rid = req.requestId;
    var fields = [
        ["accountHolder","Account holder name",true],
        ["holderAddress","Account holder address",true],
        ["postalCode","Postal code",true],
        ["phone","Phone number",true],
        ["accountNo","Account number",true],
        ["bankName","Bank name",true],
        ["branchAddress","Bank branch address",true],
        ["swiftCode","Bank SWIFT code",true],
        ["routingNo","ABA / Routing number (if applicable)",false]
    ];
    var inputs = "";
    fields.forEach(function(f){
        inputs += `<div class="wd-nf" id="wbankwrap-${rid}-${f[0]}">
            <span class="lab">${f[1]}${f[2] ? ' <span class="req">*</span>' : ''}</span>
            <input type="text" id="wbank-${rid}-${f[0]}" oninput="withdrawalValidateBank('${rid}')">
        </div>`;
    });
    return `<div style="margin-top:16px">
        <div class="wd-head">&#9672; Add your bank details to start the refund</div>
        <div class="wd-grid2">${inputs}</div>
        <div style="font-size:12px;color:var(--inkf);margin-top:7px">Please double-check these details — incorrect information can delay or fail your refund.</div>
        <div class="wd-warn"><span style="font-size:18px;flex:0 0 auto">&#9888;&#65039;</span><div><div class="wt">${withdrawalSubIsParent() ? "Your child's" : "Your"} account will be deactivated</div><div class="wdd">Once the refund is initiated by the school, ${withdrawalSubIsParent() ? "your child's" : "your"} account and access to all enrolled platforms will be permanently deactivated.</div></div></div>
        <button type="button" class="wd-btn wd-btn-green wd-btn-block" id="wbankBtn-${rid}" disabled onclick="withdrawalSubmitBank('${rid}')">Submit bank details</button>
    </div>`;
}

function withdrawalValidateBank(requestId){
    var keys = ["accountHolder","holderAddress","postalCode","phone","accountNo","bankName","branchAddress","swiftCode"];
    var ok = keys.every(function(k){ return ($("#wbank-" + requestId + "-" + k).val() || "").trim(); });
    $("#wbankBtn-" + requestId).prop("disabled", !ok);
}

function withdrawalSubmitBank(requestId){
    var isP = withdrawalSubIsParent();
    withdrawalShowWarn(
        (isP ? "Your child's" : "Your") + " account will be deactivated",
        "Once " + (isP ? "your child's" : "your") + " refund is initiated by the school, " + (isP ? "their" : "your") + " account and access to all enrolled platforms will be deactivated. Do you want to submit the bank details now?",
        "Submit bank details",
        function(){ withdrawalDoSubmitBank(requestId); }
    );
}

async function withdrawalDoSubmitBank(requestId){
    var g = function(k){ return ($("#wbank-" + requestId + "-" + k).val() || "").trim(); };
    var body = {
        requestId: requestId,
        accountHolder: g("accountHolder"), holderAddress: g("holderAddress"), postalCode: g("postalCode"),
        phone: g("phone"), accountNo: g("accountNo"), bankName: g("bankName"),
        branchAddress: g("branchAddress"), swiftCode: g("swiftCode"), routingNo: g("routingNo")
    };
    var btn = $("#wbankBtn-" + requestId);
    btn.prop("disabled", true);
    try{
        var resp = await withdrawalParentApi("withdrawal-bank-details", body);
        if(!resp || resp.status === "3"){ redirectLoginPage(); return; }
        if(resp.status === "1"){
            if(typeof showMessageTheme2 === "function"){ showMessageTheme2(1, resp.message || "Bank details submitted.", "", true); }
            withdrawalRefresh();
        }else{
            if(typeof showMessageTheme2 === "function"){ showMessageTheme2(0, resp.message || "Unable to submit bank details.", "", true); }
            btn.prop("disabled", false);
        }
    }catch(e){
        if(typeof showMessageTheme2 === "function"){ showMessageTheme2(0, "Something went wrong.", "", true); }
        btn.prop("disabled", false);
    }
}

function getWithdrawalBankSummaryHtml(bank, submitted){
    var rows = [
        ["Account holder", bank.accountHolder], ["Address", bank.holderAddress], ["Postal code", bank.postalCode],
        ["Phone", bank.phone], ["Account number", bank.accountNo], ["Bank name", bank.bankName],
        ["Branch", bank.branchAddress], ["SWIFT", bank.swiftCode], ["ABA/Routing", bank.routingNo || "—"]
    ];
    var cells = "";
    rows.forEach(function(r){
        cells += `<div class="wd-nf filled readonly"><span class="lab">${r[0]}</span><input value="${withdrawalEscape(r[1] || "—")}" readonly></div>`;
    });
    return `<div style="margin-top:16px">
        <div class="wd-head">&#9672; Bank details ${submitted ? "submitted" : "on file"}</div>
        <div class="wd-grid3">${cells}</div>
    </div>`;
}

/* ---------------- OTP flow ---------------- */
async function withdrawalStartOtp(){
    var reasonId = $("#withdrawalReason").val();
    var desc = ($("#withdrawalDesc").val() || "").trim();
    if(!reasonId || !desc){ return; }
    var btn = $("#withdrawalSubmitBtn");
    btn.prop("disabled", true);
    try{
        var resp = await withdrawalParentApi("withdrawal-send-otp", {
            studentUserId: WITHDRAWAL_ACTIVE_CHILD, reasonId: reasonId, otherReason: desc
        });
        if(!resp || resp.status === "3"){ redirectLoginPage(); return; }
        if(resp.status === "1"){
            WITHDRAWAL_OTP_CTX = { requestId: resp.requestId, email: resp.email };
            withdrawalOpenOtpModal(resp.email);
        }else{
            if(typeof showMessageTheme2 === "function"){ showMessageTheme2(0, resp.message || "Unable to send OTP.", "", true); }
            btn.prop("disabled", false);
        }
    }catch(e){
        if(typeof showMessageTheme2 === "function"){ showMessageTheme2(0, "Something went wrong.", "", true); }
        btn.prop("disabled", false);
    }
}

var WITHDRAWAL_WARN_CB = null;

function withdrawalOpenM(id){ $("#" + id).addClass("show"); }
function withdrawalCloseM(id){ $("#" + id).removeClass("show"); }
function withdrawalCloseOtp(){ withdrawalCloseM("withdrawalOtpModal"); $("#withdrawalSubmitBtn").prop("disabled", false); }

function withdrawalShowWarn(head, msg, confirmLabel, cb){
    withdrawalEnsureModals();
    $("#withdrawalWarnHead").text(head);
    $("#withdrawalWarnMsg").text(msg);
    WITHDRAWAL_WARN_CB = cb;
    $("#withdrawalWarnConfirm").text(confirmLabel || "Confirm").off("click.wd").on("click.wd", function(){
        withdrawalCloseM("withdrawalWarnModal");
        var f = WITHDRAWAL_WARN_CB; WITHDRAWAL_WARN_CB = null;
        if(f){ f(); }
    });
    withdrawalOpenM("withdrawalWarnModal");
}

function withdrawalEnsureModals(){
    if($("#withdrawalOtpModal").length > 0){ return; }
    withdrawalEnsureStyles();
    var modals =
        `<div class="wd-ov" id="withdrawalOtpModal"><div class="wd-modal">
            <div class="wd-modal-h"><h3>Verify it's you</h3><p id="withdrawalOtpSub">We've sent a 6-digit code to your registered email.</p></div>
            <div class="wd-modal-b">
                <div class="wd-otp" id="withdrawalOtpInputs"></div>
                <div class="wd-warn" style="margin:6px 0 0"><span style="font-size:18px;flex:0 0 auto">&#9888;&#65039;</span><div><div class="wt">This begins ${withdrawalSubIsParent() ? "your child's" : "your"} enrollment cancellation</div><div class="wdd">Once verified, the withdrawal request is submitted and administration is notified. You can track its status here afterward.</div></div></div>
            </div>
            <div class="wd-modal-f">
                <button type="button" class="wd-btn wd-btn-ghost wd-btn-sm" onclick="withdrawalCloseOtp()">Cancel</button>
                <button type="button" class="wd-btn wd-btn-blue wd-btn-sm" id="withdrawalOtpVerifyBtn" onclick="withdrawalDoVerifyOtp()">Verify &amp; submit</button>
            </div>
        </div></div>
        <div class="wd-ov" id="withdrawalOkModal"><div class="wd-modal">
            <div class="wd-modal-h" style="text-align:center"><div class="wd-m-icon" style="background:#E7F7ED">&#9989;</div><h3 id="withdrawalOkTitle">Request submitted</h3><p id="withdrawalOkSub"></p></div>
            <div class="wd-modal-b" id="withdrawalOkBody"></div>
            <div class="wd-modal-f"><button type="button" class="wd-btn wd-btn-blue wd-btn-sm" onclick="withdrawalCloseM('withdrawalOkModal')">Done</button></div>
        </div></div>
        <div class="wd-ov" id="withdrawalWarnModal"><div class="wd-modal">
            <div class="wd-modal-h" style="text-align:center"><div class="wd-m-icon" style="background:#FEF3E2">&#9888;&#65039;</div><h3 id="withdrawalWarnTitle">Please confirm</h3></div>
            <div class="wd-modal-b"><div class="wd-warn" style="margin:0"><span style="font-size:18px;flex:0 0 auto">&#9888;&#65039;</span><div><div class="wt" id="withdrawalWarnHead"></div><div class="wdd" id="withdrawalWarnMsg"></div></div></div></div>
            <div class="wd-modal-f"><button type="button" class="wd-btn wd-btn-ghost wd-btn-sm" onclick="withdrawalCloseM('withdrawalWarnModal')">Cancel</button><button type="button" class="wd-btn wd-btn-red wd-btn-sm" id="withdrawalWarnConfirm">Confirm</button></div>
        </div></div>`;
    $("body").append(modals);
}

function withdrawalOpenOtpModal(email){
    withdrawalEnsureModals();
    $("#withdrawalOtpSub").html(`We've sent a 6-digit code to <b>${withdrawalEscape(email || "your registered email")}</b>.`);
    var wrap = $("#withdrawalOtpInputs");
    wrap.empty();
    for(var i = 0; i < 6; i++){
        wrap.append(`<input type="text" maxlength="1" inputmode="numeric" class="withdrawal-otp-box">`);
    }
    var boxes = wrap.find(".withdrawal-otp-box");
    boxes.on("input", function(){
        this.value = this.value.replace(/\D/g, "");
        if(this.value && $(this).next(".withdrawal-otp-box").length){ $(this).next(".withdrawal-otp-box").focus(); }
    });
    boxes.on("keydown", function(e){
        if(e.key === "Backspace" && !this.value && $(this).prev(".withdrawal-otp-box").length){ $(this).prev(".withdrawal-otp-box").focus(); }
    });
    $("#withdrawalOtpVerifyBtn").prop("disabled", false);
    withdrawalOpenM("withdrawalOtpModal");
    setTimeout(function(){ boxes.first().focus(); }, 200);
}

async function withdrawalDoVerifyOtp(){
    if(!WITHDRAWAL_OTP_CTX){ return; }
    var entered = $("#withdrawalOtpInputs .withdrawal-otp-box").map(function(){ return this.value; }).get().join("");
    if(entered.length !== 6){
        if(typeof showMessageTheme2 === "function"){ showMessageTheme2(0, "Please enter the 6-digit code.", "", true); }
        return;
    }
    var btn = $("#withdrawalOtpVerifyBtn");
    btn.prop("disabled", true);
    try{
        var resp = await withdrawalParentApi("withdrawal-verify-otp", {
            requestId: WITHDRAWAL_OTP_CTX.requestId, otp: entered
        });
        if(!resp || resp.status === "3"){ redirectLoginPage(); return; }
        if(resp.status === "1"){
            withdrawalCloseM("withdrawalOtpModal");
            var email = WITHDRAWAL_OTP_CTX.email;
            WITHDRAWAL_OTP_CTX = null;
            $("#withdrawalOkTitle").text("Withdrawal request submitted");
            $("#withdrawalOkSub").text("Reference " + (resp.requestNo || "") + " · Status: In Review");
            $("#withdrawalOkBody").html(
                `<p style="font-size:13.5px;color:var(--inks);margin:0 0 12px">${withdrawalSubIsParent() ? "Your child's" : "Your"} withdrawal request has been submitted and a confirmation email has been sent to <b>${withdrawalEscape(email || "")}</b>. <b style="color:var(--ink)">A representative from our school administration will be in touch.</b></p>
                 <div class="wd-contact">Need help? You can contact us at <b>admin.support@internationalschooling.org</b> for further clarification.</div>`);
            withdrawalOpenM("withdrawalOkModal");
            withdrawalRefresh();
        }else{
            if(typeof showMessageTheme2 === "function"){ showMessageTheme2(0, resp.message || "The OTP is incorrect.", "", true); }
            btn.prop("disabled", false);
        }
    }catch(e){
        if(typeof showMessageTheme2 === "function"){ showMessageTheme2(0, "Something went wrong.", "", true); }
        btn.prop("disabled", false);
    }
}

async function withdrawalRefresh(){
    if(WITHDRAWAL_ACTIVE_CHILD == null){ return; }
    try{
        var resp = await withdrawalParentApi("withdrawal-list", { studentUserId: WITHDRAWAL_ACTIVE_CHILD });
        if(!resp || resp.status === "3"){ redirectLoginPage(); return; }
        if(resp.status === "1" && WITHDRAWAL_INIT){
            WITHDRAWAL_INIT.requests = resp.requests || [];
            WITHDRAWAL_INIT.canCreate = resp.canCreate === true;
            $("#withdrawalRequestsAndForm").html(getWithdrawalRequestsAndFormHtml(WITHDRAWAL_INIT));
            withdrawalValidateNewForm();
        }
    }catch(e){ /* keep current view on failure */ }
}

