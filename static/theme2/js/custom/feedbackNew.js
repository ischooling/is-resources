/**
 Feedback Content - Feedback System Integration
 Supports both static (share URL) and dynamic (questions from is-rest-api) feedback forms.

 Usage:

   // 1. Static form (pre-configured in FEEDBACK_FORMS table)
   showFeedbackPopup('SMS_FEEDBACK');
   showFeedbackPopup('SMS_FEEDBACK', {renderMode: 'inline',target: '#feedbackContainer'});
   showTemplateFeedbackPopup('SMS_FEEDBACK', {
       feedbackTitle: 'Rate your teachers',
       question1: 'Rate your Language Art teacher.',
       question2: 'Rate your Science teacher.'
   }, {
       renderMode: 'inline',
       target: '#feedbackContainer'
   });

   // 2. Dynamic form (is-rest-api provides questions at runtime)
   showDynamicFeedbackPopup({
       code: 'TEACHER_FEEDBACK',
       title: 'Session Feedback - Math Class',
       description: 'Please share your feedback',
       questions: [
           { questionType: 'RATING',          questionText: 'Rate your Math session',  isRequired: true },
           { questionType: 'RADIO',           questionText: 'Rate teacher Mr. Sharma', options: ['Excellent','Good','Average'], isRequired: true },
           { questionType: 'MULTIPLE_CHOICE', questionText: 'What did you like?',      options: ['Content','Teaching','Interaction'], isRequired: true },
           { questionType: 'DESCRIPTION',     questionText: 'Any suggestions?',        isRequired: false }
       ]
   });

   // 3. Direct URL
   showFeedbackPopupByUrl('http://localhost:3000/embed/8da3edd5...');

   // 4. Close
   closeFeedbackPopup();
*/
// FOR modal
//showFeedbackPopup('SMS_FEEDBACK');

//FOR inline
//showFeedbackPopup('SMS_FEEDBACK', {renderMode: 'inline',target: '#dashboardContentInHTML'});

async function rateYourTeacher(feedbackCode, feedbackType, congigObj){
    congigObj = congigObj || {};
    if(feedbackType == 'GENERAL'){
        // General student feedback -> the school is the subject of the feedback.
        congigObj.feedbackContext = {
            purpose: 'Student Feedback',
            feedbackFor: getFeedbackSchoolName()
        };
        showFeedbackPopup(feedbackCode,  congigObj);
    }else if(feedbackType == 'DYNAMIC'){
        await renderTeacherSelectFeedbackScreen(feedbackCode, congigObj);
    }
}

// ==================== TEACHER SELECT (side-nav "management feedback") ====================
// The teacher dropdown and the feedback form render together in one screen as soon as the
// module opens. The form area stays covered by an overlay (which doubles as the "please
// select a teacher" validation) until a teacher is picked, so it is never possible to reach
// the form's own submit button without a teacher selected.
var TEACHER_SELECT_FEEDBACK_STATE = {};

async function renderTeacherSelectFeedbackScreen(feedbackCode, congigObj){
    var targetContainer = getFeedbackTargetContainer(congigObj) || document.querySelector("#dashboardContentInHTML");
    if(!targetContainer){
        console.warn("[Feedback] Teacher select render target not found.");
        return;
    }

    var teachers;
    try{
        teachers = await getSchoolTeacherListForFeedback();
    }catch(e){
        console.error("[Feedback] Unable to load teacher list:", e);
        teachers = [];
    }

    TEACHER_SELECT_FEEDBACK_STATE = {
        feedbackCode: feedbackCode,
        congigObj: congigObj,
        teachers: teachers,
        embedUrl: null
    };

    $(targetContainer).html(buildTeacherSelectScreenHtml(teachers));

    $(targetContainer).find("#teacherSelectFeedbackDropdown").on("change", function(){
        onTeacherSelectFeedbackDropdownChange();
    });

    $(targetContainer).find("#teacherSelectFeedbackOverlay").on("click", function(){
        showTeacherSelectFeedbackValidation();
    });

    // Load the actual feedback form immediately (no teacher picked yet) so it is visible
    // together with the dropdown; the overlay keeps it non-interactive until then.
    loadTeacherSelectFeedbackForm();
}

function teacherSelectFeedbackEscapeHtml(value){
    return $("<div>").text(value == null ? "" : value).html();
}

function buildTeacherSelectScreenHtml(teachers){
    var optionsHtml = '<option value="">-- Select Teacher --</option>';
    $.each(teachers || [], function(_, teacher){
        optionsHtml += '<option value="' + teacher.id + '" data-teacher-name="' + teacherSelectFeedbackEscapeHtml(teacher.name) + '">'
            + teacherSelectFeedbackEscapeHtml(teacher.name) + '</option>';
    });

    return `
    <div class="w-100">
        <div class="main-card mb-3 card">
            <div class="card-body">
                <h5 class="text-primary font-weight-semi-bold mb-3 text-center">Rate Your Teacher</h5>
                <div class="form-group mx-auto text-center"  style="max-width:420px;">
                    <label class="font-weight-semi-bold">Select Teacher <span class="text-danger">*</span></label>
                    <select id="teacherSelectFeedbackDropdown" class="form-control text-center">${optionsHtml}</select>
                    <small id="teacherSelectFeedbackValidationMsg" class="text-danger d-none" style="font-size:14px;">Please select teacher.</small>
                </div>
            </div>
            <div id="teacherSelectFeedbackFormWrapper" style="position:relative;height:70vh;">
                <div id="teacherSelectFeedbackFormArea" style="height:100%;"></div>
                <div id="teacherSelectFeedbackOverlay" style="position:absolute;inset:0;background:rgba(255,255,255,0.85);display:flex;align-items:center;justify-content:center;cursor:not-allowed;">
                    <div class="text-center px-4">
                        <i class="fa fa-arrow-up text-primary mb-2 d-block" style="font-size:20px;"></i>
                        <p class="text-muted font-weight-semi-bold mb-0" style="font-size:18px;">Please select a teacher above to give feedback.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
}

// Clicking the overlay (i.e. trying to use the form before a teacher is picked) surfaces
// the same validation the user would expect from a required field.
function showTeacherSelectFeedbackValidation(){
    var dropdown = $("#teacherSelectFeedbackDropdown");
    $("#teacherSelectFeedbackValidationMsg").removeClass("d-none");
    dropdown.addClass("is-invalid");
    dropdown.trigger("focus");
}

function onTeacherSelectFeedbackDropdownChange(){
    var selectedOption = $("#teacherSelectFeedbackDropdown option:selected");
    var teacherId = selectedOption.val();

    if(!teacherId){
        $("#teacherSelectFeedbackOverlay").show();
        showTeacherSelectFeedbackValidation();
        return;
    }

    $("#teacherSelectFeedbackValidationMsg").addClass("d-none");
    $("#teacherSelectFeedbackDropdown").removeClass("is-invalid");
    $("#teacherSelectFeedbackOverlay").hide();

    // The teacher (and therefore feedbackUserIdTo/feedbackFor) is baked into the embed
    // URL's query params, so the form has to reload once a teacher is chosen/changed.
    loadTeacherSelectFeedbackForm();
}

function buildTeacherSelectFeedbackContext(){
    var selectedOption = $("#teacherSelectFeedbackDropdown option:selected");
    var teacherId = selectedOption.val();
    var teacherName = selectedOption.attr("data-teacher-name");
    var state = TEACHER_SELECT_FEEDBACK_STATE || {};

    return {
        // The submitter (admin) id, so the webhook back to is-rest-api can populate
        // FEEDBACK_SUBMISSION.USER_ID (otherwise it comes through null).
        userId: (typeof USER_ID !== "undefined" && USER_ID) ? USER_ID : "",
        entityId: 0,
        entityType: '',
        feedbackDateTime: convertToUTC(moment().format("YYYY-MM-DD HH:mm:ss"), USER_TIMEZONE),
        purpose: state.feedbackLabel || 'Management feedback',
        feedbackFor: teacherName || '',
        feedbackUserIdTo: teacherId ? parseInt(teacherId, 10) : 0
    };
}

function loadTeacherSelectFeedbackForm(){
    var state = TEACHER_SELECT_FEEDBACK_STATE || {};
    var formArea = document.getElementById("teacherSelectFeedbackFormArea");
    if(!formArea){
        return;
    }

    // Built lazily (rather than once up front) so it always carries the freshest
    // feedbackLabel/teacher selection, including right after the feedback-url lookup
    // below resolves the form's label for the first time.
    function buildInlineCongigObj(){
        var inlineCongigObj = $.extend({}, state.congigObj || {}, {
            renderMode: 'inline',
            target: formArea,
            showHeader: false,
            height: '100%'
        });
        inlineCongigObj.feedbackContext = buildTeacherSelectFeedbackContext();
        return inlineCongigObj;
    }

    if(state.embedUrl){
        openFeedbackIframe(state.embedUrl, buildInlineCongigObj());
        return;
    }

    $.ajax({
        url: API_VERSION + "review/feedback-url",
        type: "GET",
        data: { eventCode: state.feedbackCode, schoolId: SCHOOL_ID },
        success: function (res) {
            if (res.status === "SUCCESS" && res.url) {
                state.embedUrl = res.url.replace("/share/", "/embed/");
                // FEEDBACK_FORMS.LABEL -> used as the webhook "purpose" instead of a
                // hardcoded string.
                state.feedbackLabel = res.label || '';
                openFeedbackIframe(state.embedUrl, buildInlineCongigObj());
            } else {
                console.warn("[Feedback] No form found for code:", state.feedbackCode);
            }
        },
        error: function (err) {
            console.error("[Feedback] Error:", err);
        }
    });
}

// Full teacher list for the school, formatted for the teacher-select dropdown. Reuses the
// existing Masters "TEACHER_LIST" endpoint (already used elsewhere to populate teacher
// dropdowns) rather than adding a new backend endpoint.
async function getSchoolTeacherListForFeedback(){
    var ajaxReqDetails = {
        method: "POST",
        url: getURLForCommon("masters"),
        body: {
            authentication: {
                hash: getHash(),
                schoolId: SCHOOL_ID,
                schoolUUID: SCHOOL_UUID,
                userType: "COMMON"
            },
            requestData: {
                requestKey: "TEACHER_LIST_APPROVED",
                requestValue: SCHOOL_ID
            }
        },
        global: false,
        showMessage: false
    };

    var response = await callCommonAjax(ajaxReqDetails);
    var rows = (response && response.mastersData && $.isArray(response.mastersData.data))
        ? response.mastersData.data
        : [];

    return $.map(rows, function(row){
        // value is "Full Name - Official Email"; keep just the name for feedbackFor.
        var name = ((row && row.value) || "").split(" - ")[0].trim();
        return { id: row && row.key, name: name || "Teacher" };
    });
}

// Subject ("feedback for") of a general student feedback form.
function getFeedbackSchoolName(){
    if (typeof SCHOOL_NAME !== "undefined" && SCHOOL_NAME) return String(SCHOOL_NAME);
    return "School";
}

// Combined "feedback for" label listing the rated teachers.
function buildTeacherFeedbackForLabel(rows){
    var names = [];
    $.each(rows || [], function(index, row){
        var name = (row.teacherName || "").trim();
        if (name && name !== "N/A" && names.indexOf(name) === -1) names.push(name);
    });
    return names.length ? names.join(", ") : "Assigned Teachers";
}

// Per-question subject map keyed by the same questionKey buildTeacherRatingQuestions() emits,
// so the responses table can show which teacher each answer is about.
function buildTeacherQuestionTargets(rows){
    var targets = {};
    $.each(rows || [], function(index, row){
        var key = "teacher_rating_" + parseInt(index + 1);
        var teacher = (row.teacherName || "N/A");
        var course = (row.courseName || "").trim();
        targets[key] = course ? (teacher + " (" + course + ")") : teacher;
    });
    return targets;
}

function buildTeacherRatingQuestions(rows){
    var questions = [];

    $.each(rows || [], function(index, row){
        questions.push({
            questionKey: "teacher_rating_" + parseInt(index + 1),
            questionType: "RATING",
            questionText: "Rate your " + (row.courseName || "N/A") + " teacher, " + (row.teacherName || "N/A"),
            isRequired: true,
            sortOrder: parseInt(index + 1)
        });
    });

    return questions;
}

async function getAssignedTeachers(){
    var payload = { userId: USER_ID + "", studentUserId: USER_ID + "" };
    var ajaxReqDetails = {
        method: "POST",
        url: APP_BASE_URL + SCHOOL_UUID + "/dashboard/parent/student-assgined-teacher",
        body: payload,
        global: true,
        showMessage: false,
        onFaildResolved: true,
        onSuccessResolved: true
    };
    return await callCommonAjax(ajaxReqDetails);
}
function getAssignedTeachersAsRow(apiResponse){
    var rowList = getAssignedTeachersAsRowFinal(apiResponse);
    var rows = [];
    $.each(rowList || [], function(index, item){
        rows.push({
            courseName: item.selectedCourses || item.courseName || item.subjectName || item.subject || item.course || "N/A",
            teacherName: item.teacherAssignedForTeacherSupport || item.teacherName || item.assignedTeacherName || item.teacherFullName || item.teacherSupportName || item.facultyName || "N/A"
        });
    });
    return rows;
}

function getAssignedTeachersAsRowFinal(apiResponse){
    if(!apiResponse){
        return [];
    }
    if($.isArray(apiResponse)){
        return apiResponse;
    }
    var details = apiResponse.details || apiResponse.data || apiResponse.response || {};
    if($.isArray(details)){
        return details;
    }
    var listCandidates = [
        details.assignedTeachers, details.assignedTeacherList, details.studentAssignedTeacherList, details.teacherAssignedList, details.teacherSupportList, details.list, details.rows,
        apiResponse.assignedTeachers, apiResponse.assignedTeacherList, apiResponse.studentAssignedTeacherList, apiResponse.teacherAssignedList, apiResponse.list
    ];
    var resolved = [];
    $.each(listCandidates, function(index, candidate){
        if($.isArray(candidate) && resolved.length === 0){
            resolved = candidate;
        }
    });
    return resolved;
}

// ==================== STATIC FORM ====================
function showFeedbackPopup(code, options) {
    options = options || {};
    $.ajax({
        url: API_VERSION + "review/feedback-url",
        type: "GET",
        data: { eventCode: code, schoolId: SCHOOL_ID },
        success: function (res) {
            if (res.status === "SUCCESS" && res.url) {
                var embedUrl = res.url.replace("/share/", "/embed/");
                options.feedbackCode = code;
                openFeedbackIframe(embedUrl, options);
            } else {
                console.warn("[Feedback] No form found for code:", code);
            }
        },
        error: function (err) {
            console.error("[Feedback] Error:", err);
        }
    });
}

function showTemplateFeedbackPopup(code, templateParams, options) {
    options = options || {};
    options.templateParams = templateParams || {};
    showFeedbackPopup(code, options);
}

// ==================== DYNAMIC FORM ====================
function showDynamicFeedbackPopup(config) {
    if (!config || !config.code || !config.title || !config.questions || config.questions.length === 0) {
        console.error("[Feedback] Dynamic feedback requires: code, title, questions[]");
        return;
    }

    // Show loading overlay immediately
    showFeedbackLoader();

    $.ajax({
        url: API_VERSION + "review/dynamic-feedback",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            code: config.code,
            title: config.title,
            description: config.description || "",
            questions: config.questions
        }),
        global :false,
        success: function (res) {
            hideFeedbackLoader();
            if (res.status === "SUCCESS" && res.url) {
                openFeedbackIframe(res.url, config);
            } else {
                console.warn("[Feedback] Dynamic form creation failed:", res.message);
            }
        },
        error: function (err) {
            hideFeedbackLoader();
            console.error("[Feedback] Dynamic feedback error:", err);
        }
    });
}

// ==================== DIRECT URL ====================
function showFeedbackPopupByUrl(url, options) {
    if (url) openFeedbackIframe(url, options || {});
}

// ==================== IFRAME POPUP ====================
function openFeedbackIframe(url, options) {
    closeFeedbackPopup();

    options = options || {};
    var embedUrl = appendFeedbackEmbedParams(url, options);
    var renderMode = getFeedbackRenderMode(options);

    if (renderMode === "inline") {
        openFeedbackInline(embedUrl, options);
        return;
    }

    openFeedbackModal(embedUrl, options);
}

function hideFeedbackLoader() {
    var el = document.getElementById("fb-loading-overlay");
    if (el) el.remove();
}

// ==================== CLOSE & ESC ====================
function closeFeedbackPopup() {
    var el = document.getElementById("fb-popup-overlay");
    if (el) el.remove();
    var inlineEl = document.getElementById("fb-inline-wrapper");
    if (inlineEl) inlineEl.remove();
    hideFeedbackLoader();
    document.removeEventListener("keydown", handleFeedbackEscKey);
}

function handleFeedbackEscKey(e) {
    if (e.key === "Escape") closeFeedbackPopup();
}

function appendFeedbackEmbedParams(url, options) {
    var feedbackUrl = new URL(url, window.location.origin);
    var metadata = getFeedbackEmbedMetadata(options || {});
    var templateParams = getFeedbackTemplateParams(options || {});
    feedbackUrl.searchParams.set("userId", metadata.userId);
    feedbackUrl.searchParams.set("userName", metadata.userName);
    feedbackUrl.searchParams.set("email", metadata.email);
    feedbackUrl.searchParams.set("optionalValue1", metadata.optionalValue1);
    feedbackUrl.searchParams.set("optionalValue2", metadata.optionalValue2);
    Object.keys(templateParams).forEach(function (key) {
        feedbackUrl.searchParams.set(key, templateParams[key]);
    });
    var webhookData = getFeedbackWebhookData(options || {});
    if (webhookData && Object.keys(webhookData).length > 0) {
        feedbackUrl.searchParams.set("webhookData", JSON.stringify(webhookData));
    }
    return feedbackUrl.toString();
}

// Webhook payload forwarded to the feedback form (purpose, feedbackFor, per-question
// targets, plus any caller-supplied webhookData). Persisted by feedback-api and shown
// in the responses table.
function getFeedbackWebhookData(options) {
    var webhookData = {};
    if (options.webhookData && typeof options.webhookData === "object") {
        Object.assign(webhookData, options.webhookData);
    }
    if (options.feedbackContext && typeof options.feedbackContext === "object") {
        Object.assign(webhookData, options.feedbackContext);
    }
    return webhookData;
}

function getFeedbackEmbedMetadata(options) {
    var profile = (typeof commonProfileDTO === "object" && commonProfileDTO) ? commonProfileDTO : null;
    options = options || {};
    var userId = getFeedbackMetadataValue(options.userId, (typeof USER_ID !== "undefined" ? USER_ID : (profile ? profile.userId : null)), "");
    var userName = getFeedbackMetadataValue(options.userName, profile ? profile.profileName : null, "Unknown User");
    var email = getFeedbackMetadataValue(options.email, profile ? profile.emailId : null, "");
    var optionalValue1 = getFeedbackMetadataValue(options.optionalValue1, profile ? profile.userId : null, "");
    var optionalValue2 = getFeedbackMetadataValue(options.optionalValue2, profile ? profile.profileRole : null, "");
    return {
        userId: String(userId),
        userName: String(userName),
        email: String(email),
        optionalValue1: String(optionalValue1),
        optionalValue2: String(optionalValue2)
    };
}

function getFeedbackMetadataValue(primaryValue, fallbackValue, defaultValue) {
    if (primaryValue !== undefined && primaryValue !== null && String(primaryValue).trim() !== "") {
        return primaryValue;
    }
    if (fallbackValue !== undefined && fallbackValue !== null && String(fallbackValue).trim() !== "") {
        return fallbackValue;
    }
    return defaultValue;
}

function getFeedbackTemplateParams(options) {
    var templateParams = options.templateParams || options.placeholders || {};
    var sanitizedParams = {};

    Object.keys(templateParams).forEach(function (key) {
        var value = templateParams[key];
        if (value !== undefined && value !== null && String(value).trim() !== "") {
            sanitizedParams[key] = String(value);
        }
    });

    return sanitizedParams;
}



function getFeedbackRenderMode(options) {
    var renderMode = (options.renderMode || options.displayMode || "modal").toString().toLowerCase();
    return renderMode === "inline" ? "inline" : "modal";
}

function getFeedbackTargetContainer(options) {
    var target = options.target || options.targetSelector || options.container || options.targetElement;
    if (!target && options.containerId) {
        target = "#" + options.containerId;
    }

    if (typeof HTMLElement !== "undefined" && target instanceof HTMLElement) {
        return target;
    }

    if (target && target.jquery && target.length > 0) {
        return target[0];
    }

    if (typeof target === "string" && target.trim() !== "") {
        return document.querySelector(target);
    }

    return null;
}

function getFeedbackInlineHeight(options) {
    if (options.height) {
        return String(options.height);
    }
    if (options.inlineHeight) {
        return String(options.inlineHeight);
    }
    return "85vh";
}
