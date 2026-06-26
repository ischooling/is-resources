// Class feedback flow.
//
// Opens from two places in dashboardCalendar.js:
//   1. When a LIVE class ends  -> checkClassEndedStatus(endTime, info, "LIVE")
//   2. Feedback button on a past class -> openClassFeedbackById(eventId)
//
// In both cases we hit the backend, which decides what to render:
//   S001 (Feedback submitted)     -> details has embed URL -> show in iframe
//   S002 (Feedback not submitted) -> details has embed URL -> show in iframe
//   S003 (Class not attended)     -> no URL                -> show message modal
//
// The old in-page star/suggestion modal is intentionally removed.

var FEEDBACK_MODAL_ID = "classFeedbackModal";
var FEEDBACK_OPEN_IN_RIGHT_SLIDE = false;
var FEEDBACK_SHOW_FROM_DATE = undefined;
var FEEDBACK_SHOW_POPUP_AFTER_CLASS = undefined;
var FEEDBACK_PENDING_POPUP_KEY = "";

// Refreshed every time the feedback flow opens (LIVE end or past-class button),
// just before the iframe is shown. Consumed by the webhook API (handled elsewhere).
var FEEDBACK_WEBHOOK = {};

function getPreviousWeekDateRange() {
	var today = new Date();
	var day = today.getDay();
	var previousWeekEnd = new Date(today);
	previousWeekEnd.setDate(today.getDate() - day - 1);
	var previousWeekStart = new Date(previousWeekEnd);
	previousWeekStart.setDate(previousWeekEnd.getDate() - 6);
	return {
		startDate: changeDateFormat(previousWeekStart, 'yyyy-mm-dd'),
		endDate: changeDateFormat(previousWeekEnd, 'yyyy-mm-dd')
	};
}

function shouldShowBulkFeedbackPopupToday() {
	if(SHOULD_SHOW_BULK_FEEDBACK_POPUP_TODAY != undefined){
		return SHOULD_SHOW_BULK_FEEDBACK_POPUP_TODAY;
	}
	try {
		var setting = getSettingsByTypeAndKey("CONFIGURATION", "BULK_FEEDBACK_SHOW_DAY", false);
		var showDay = parseInt(getSettingMetaValue(setting), 10);
		SHOULD_SHOW_BULK_FEEDBACK_POPUP_TODAY = !isNaN(showDay) && showDay == new Date().getDay();
	} catch (e) {
		SHOULD_SHOW_BULK_FEEDBACK_POPUP_TODAY = false;
	}
	return SHOULD_SHOW_BULK_FEEDBACK_POPUP_TODAY;
}

function updateFeedbackWebhook(info) {
    var eventStart = info.start && info.start._i ? info.start._i : info.start;
    FEEDBACK_WEBHOOK = {
        userId: USER_ID,
        entityId: info.eventId,
        entityType: info.eventType,
        feedbackDateTime: convertToUTC(eventStart, USER_TIMEZONE),
        // Purpose = which class (name + date); Feedback For = the teacher being rated.
        purpose: buildClassFeedbackPurposeLabel(info),
        feedbackFor: getClassFeedbackTeacherName(info),
        feedbackUserIdTo: info.feedbackUserIdTo
    };
}

// Purpose of a class feedback: the class name plus its date, e.g. "Comprehensive Science I - 2026-06-09".
function buildClassFeedbackPurposeLabel(info) {
    var className = info.eventTitle || info.title || 'Class';
    var dateLabel = '';
    try {
        var eventStart = info.start && info.start._i ? info.start._i : info.start;
        dateLabel = changeDateFormat(new Date(eventStart), 'yyyy-mm-dd');
    } catch (e) { dateLabel = ''; }
    return dateLabel ? (className + ' - ' + dateLabel) : className;
}

// The teacher a class feedback is about. The calendar event carries the teacher under
// teacherName (or name for a student/parent view); fall back to a generic label.
function getClassFeedbackTeacherName(info) {
    var name = (info.teacherName || info.name || '').toString().trim();
    return (name && name !== 'N/A') ? name : 'Teacher';
}

// Whether a calendar entry is an activity rather than a class. Activities are flagged on the
// dashboard calendar event by an "activity" id prefix or an "ACTIVITY" category/type.
function isFeedbackActivity(info) {
    var id = (info.id || info.eventId || '').toString().toLowerCase();
    var category = (info.category || '').toString().toUpperCase();
    var eventType = (info.eventType || '').toString().toUpperCase();
    return id.indexOf('activity') === 0 || category.indexOf('ACTIVITY') === 0 || eventType.indexOf('ACTIVITY') !== -1;
}

function buildFeedbackRequest(info) {
    var eventStart = info.start && info.start._i ? info.start._i : info.start;
    return {
        entityType: info.eventType,
        entityId: info.eventId,
        userId: USER_ID,
        userRoleId: USER_ROLE_ID,
        schoolId: SCHOOL_ID,
        userFullName: USER_FULL_NAME,
        eventDateTime: convertToUTC(eventStart, USER_TIMEZONE)
    };
}

function openClassFeedback(info) {
    if (!info) {
        FEEDBACK_OPEN_IN_RIGHT_SLIDE = false;
        return;
    }

    var rightSlideModal = FEEDBACK_OPEN_IN_RIGHT_SLIDE;
    FEEDBACK_OPEN_IN_RIGHT_SLIDE = false;

    updateFeedbackWebhook(info);

    callCommonAjax({
        method: "POST",
        url: getURLForHTML("dashboard", "get-feedback-submission"),
        body: buildFeedbackRequest(info),
        global: false,
        showMessage: false
    }).then(function (data) {
        var title = info.eventTitle || info.title || "Class";
        var code = data && data.statusCode;
        var eventStart = info.start && info.start._i ? info.start._i : info.start;
        var classDateTime = changeDateFormat(new Date(eventStart), "MMM dd, yyyy hh:mm A");

        if (code === "S001" || code === "S002") {
            if (data.details) {
                showFeedbackIframeModal(data.details, title, classDateTime, rightSlideModal);
            }
        } else if (code === "S003") {
            var entityKind = isFeedbackActivity(info) ? "activity" : "class";
            showFeedbackMessageModal(
                title,
                "You have not attended the " + entityKind + " hence you are eligible for the feedback of this " + entityKind + ".",
                classDateTime
            );
        } else if (code === "S004") {
            // S004 -> no modal, just a toast message.
            showMessageTheme2(0, data.message);
        }
    }).catch(function () {
        showMessageTheme2(0, "Something went wrong. Please try again.");
    });
}

// Triggered by the feedback button on past classes (see getFeedbackBtn).
function openClassFeedbackById(eventOrEventId, eventId) {
    var clickEvent = null;
    if (eventOrEventId && typeof eventOrEventId !== "string") {
        clickEvent = eventOrEventId;
    } else {
        eventId = eventOrEventId;
    }

    // Stop the button click from also triggering the calendar/activity wrapper.
    if (clickEvent) {
        clickEvent.preventDefault();
        clickEvent.stopPropagation();
    }
    if (window.event && window.event.stopPropagation) {
        window.event.stopPropagation();
    }

    // Stop the bubbled calendar eventClick from also opening the join modal.
    IS_CLICKED_FEEDBACK_BTN = true;
    var info = (typeof FEEDBACK_EVENT_MAP !== "undefined") ? FEEDBACK_EVENT_MAP[eventId] : null;
    if (info) {
        openClassFeedback(info);
    } else {
        FEEDBACK_OPEN_IN_RIGHT_SLIDE = false;
        IS_CLICKED_FEEDBACK_BTN = false;
    }
}

function getFeedbackModalDelayMinutes() {
    try {
        var setting = getSettingsByTypeAndKey("CONFIGURATION", "FEEDBACK_MODAL_DELAY_MIN", false);
        var delayValue = getSettingMetaValue(setting);
        var delayMinutes = parseInt(delayValue, 10);
        return isNaN(delayMinutes) || delayMinutes < 0 ? 0 : delayMinutes;
    } catch (e) {
        return 0;
    }
}

function shouldShowFeedbackPopupAfterClass() {
    if (FEEDBACK_SHOW_POPUP_AFTER_CLASS != undefined) {
        return FEEDBACK_SHOW_POPUP_AFTER_CLASS;
    }
    try {
        var setting = getSettingsByTypeAndKey("CONFIGURATION", "FEEDBACK_SHOW_POPUP_AFTER_CLASS", false);
        var value = (getSettingMetaValue(setting) || "").toString().trim().toUpperCase();
        FEEDBACK_SHOW_POPUP_AFTER_CLASS = value === "TRUE" || value === "Y" || value === "YES" || value === "1";
    } catch (e) {
        FEEDBACK_SHOW_POPUP_AFTER_CLASS = false;
    }
    return FEEDBACK_SHOW_POPUP_AFTER_CLASS;
}

// LIVE -> wait for the class to end plus configured feedback delay, then open. Otherwise open immediately.
function checkClassEndedStatus(classEndTime, info, callFrom) {
    if (callFrom !== "LIVE") {
        openClassFeedback(info);
        return;
    }
    if (!shouldShowFeedbackPopupAfterClass()) {
        return;
    }
    var feedbackModalDelayMs = getFeedbackModalDelayMinutes() * 60 * 1000;
    var feedbackOpenTime = classEndTime + feedbackModalDelayMs;
    var intervalId = setInterval(function () {
        var now = new Date($("#currentTimeForUser").text()).getTime();
        if (now > feedbackOpenTime) {
            clearInterval(intervalId);
            openClassFeedback(info);
        }
    }, 1000);
}

function buildFeedbackModalShell(title, bodyHtml, options) {
    options = options || {};
    var sizeClass = options.sizeClass !== undefined ? options.sizeClass : "modal-lg";
    var centeredClass = options.centered ? "modal-dialog-centered" : "";
    var metaHtml = options.metaText
        ? `<span class="badge badge-light text-primary ml-2 align-middle font-weight-semi-bold" style="font-size:12px;">${options.metaText}</span>`
        : "";
    var headerIconHtml = options.headerIcon
        ? `<i class="fa fa-info-circle text-white mr-3" style="font-size:26px;"></i>`
        : "";
    if (options.rightSlideModal) {
        return `
        <div class="modal fade pr-0 right-slide-modal" id="${FEEDBACK_MODAL_ID}" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static">
            <div class="modal-dialog" role="document" style="width:42%;max-width:760px;min-width:520px;">
                <div class="modal-content border-0 rounded-0 shadow-lg">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <div class="modal-header bg-primary border-0 py-2 align-items-center">
                        <div>
                            <h5 class="modal-title text-white font-weight-bold mb-0 d-inline-block align-middle">${title}</h5>
                            ${metaHtml}
                            <small class="d-block text-white" style="opacity:.9;">Help Us Improve Your Learning Experience</small>
                        </div>
                    </div>
                    <div class="modal-body p-0 overflow-auto">${bodyHtml}</div>
                </div>
            </div>
        </div>`;
    }
    return `
    <div class="modal fade" id="${FEEDBACK_MODAL_ID}" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog ${sizeClass} ${centeredClass} shadow-none" role="document">
            <div class="modal-content" style="border-radius:16px;overflow:hidden;">
                <div class="modal-header bg-primary border-0 py-3 align-items-center">
                    <div class="d-flex align-items-center">
                        ${headerIconHtml}
                        <div>
                            <h5 class="modal-title text-white font-weight-bold mb-0 d-inline-block align-middle">${title}</h5>
                            ${metaHtml}
                            <small class="d-block text-white" style="opacity:.9;">Help Us Improve Your Learning Experience</small>
                        </div>
                    </div>
                    <button type="button" class="close text-white ml-auto" data-dismiss="modal" aria-label="Close">
                        <i class="fa fa-times"></i>
                    </button>
                </div>
                <div class="modal-body p-0">${bodyHtml}</div>
            </div>
        </div>
    </div>`;
}

function showFeedbackModalShell(html) {
    $("#" + FEEDBACK_MODAL_ID).remove();
    $("body").append(html);
    $("#" + FEEDBACK_MODAL_ID).modal({ backdrop: "static", keyboard: false });
    $("#" + FEEDBACK_MODAL_ID).on("hidden.bs.modal", function () {
        IS_CLICKED_FEEDBACK_BTN = false;
        $(this).remove();
    });
}

function showFeedbackIframeModal(url, title, dateTimeText, rightSlideModal) {
    var embedUrl = buildClassFeedbackEmbedUrl(url);
    var body =
        `<iframe src="${embedUrl}" title="${title}" style="width:100%;height:calc(100vh - 76px);border:0;display:block;background:#fff;"></iframe>`;
    // Show the class date/time beside the title (like the not-attended modal). The
    // inner feedback-ui page hides its own header (hideHeader=1) so we get one clean modal.
    showFeedbackModalShell(buildFeedbackModalShell(title, body, { metaText: dateTimeText, rightSlideModal: rightSlideModal }));
}

// The feedback form (feedback-ui /embed page) reads the respondent identity and
// webhook payload from the iframe URL query string. Without this the form has no
// userName/userId and rejects the submission ("Embedded userName is missing").
//   userName, userId, optionalValue1/2 -> who is submitting (logged-in user)
//   webhookData (JSON)                  -> class context forwarded to the webhook
function buildClassFeedbackEmbedUrl(url) {
    var profile = (typeof commonProfileDTO === "object" && commonProfileDTO) ? commonProfileDTO : null;
    try {
        var feedbackUrl = new URL(url, window.location.origin);

        var userName = (typeof USER_FULL_NAME !== "undefined" && USER_FULL_NAME) || (profile && profile.profileName) || "";

        feedbackUrl.searchParams.set("userName", String(userName));
        if (typeof USER_ID !== "undefined" && USER_ID) {
            feedbackUrl.searchParams.set("userId", String(USER_ID));
        }
        if (profile && profile.profileRole) {
            feedbackUrl.searchParams.set("optionalValue2", String(profile.profileRole));
        }
        if (FEEDBACK_WEBHOOK && Object.keys(FEEDBACK_WEBHOOK).length > 0) {
            feedbackUrl.searchParams.set("webhookData", JSON.stringify(FEEDBACK_WEBHOOK));
        }
        // The class modal already shows a header, so tell the embedded page to hide its own.
        feedbackUrl.searchParams.set("hideHeader", "1");
        return feedbackUrl.toString();
    } catch (e) {
        return url;
    }
}

function showFeedbackMessageModal(title, message, dateTimeText) {
    var body =
        `<div class="text-center px-4 py-4">
            <h5 class="font-weight-semi-bold mb-0 text-dark" style="line-height:1.5;">${message}</h5>
        </div>`;
    showFeedbackModalShell(buildFeedbackModalShell(title, body, {
        sizeClass: "",          // default (smaller) width instead of modal-lg
        centered: true,
        metaText: dateTimeText, // class date/time shown beside the title
        headerIcon: true        // info icon moved into the header
    }));
}

function showPendingFeedbackPopup(events, viewName) {
	var feedbackContent = "";
	var feedbackKey = viewName;
	var feedbackCount = 0;
	var activityCount = 0;
	var classCount = 0;
	$.each(events, function(index, info) {
		if(info.id.startsWith("announce", 0) || info.id.startsWith("holiday", 0)){
			return true;
		}
		var isFeedbackSubmitted = info.isFeedbackSubmitted;
		if(isFeedbackSubmitted != "N"){
			return true;
		}
		var feedbackShowFromDate = getSettingMetaValue(getSettingsByTypeAndKey("CONFIGURATION", "FEEDBACK_SHOW_FROM_DATE", false));
		var eventDate = info.start && info.start._i ? info.start._i : info.start;
		var eventDateText = eventDate ? moment(eventDate).format("YYYY-MM-DD") : "";
		if(feedbackShowFromDate && eventDateText && eventDateText < feedbackShowFromDate){
			return true;
		}
		FEEDBACK_EVENT_MAP[info.id] = info;
		feedbackKey += "|" + info.id;
		feedbackCount++;
		var courseName = info.eventTitle || info.title || "Class";
		if(info.courseName != undefined && info.courseName != ""){
			courseName = info.courseName;
		}else if(info.subjectName != undefined && info.subjectName != ""){
			courseName = info.subjectName;
		}else if(info.className != undefined && info.className != ""){
			courseName = info.className;
		}else if(info.id.startsWith("activity", 0)){
			courseName = info.title.split("~")[0];
		}
		var startDate = "N/A";
		var startTime = "";
		var endTime = "";
		var duration = "N/A";
		if(info.start != undefined && info.start != ""){
			startDate = typeof moment === "function" ? moment(info.start._i || info.start).format("MMM DD, YYYY") : changeDateFormat(new Date(info.start._i || info.start), "mmm dd, yyyy");
			startTime = typeof moment === "function" ? moment(info.start._i || info.start).format("hh:mm A") : new Date(info.start._i || info.start).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
		}
		if(info.end != undefined && info.end != ""){
			endTime = typeof moment === "function" ? moment(info.end._i || info.end).format("hh:mm A") : new Date(info.end._i || info.end).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
		}
		if(startTime != "" && endTime != ""){
			duration = startTime + " - " + endTime;
		}
		var teacher = info.name || "N/A";
		if(info.teacherName != undefined && info.teacherName != ""){
			teacher = info.teacherName;
		}else if(info.teacher != undefined && info.teacher != ""){
			teacher = info.teacher;
		}else if(info.instructorName != undefined && info.instructorName != ""){
			teacher = info.instructorName;
		}else if(info.instructor != undefined && info.instructor != ""){
			teacher = info.instructor;
		}else if(info.hostName != undefined && info.hostName != ""){
			teacher = info.hostName;
		}
		var category = info.category || info.eventType || "N/A";
		var categoryName = category.toString().toUpperCase();
		var cardIcon = categoryName.indexOf("ACTIVITY") > -1 ? "fa-users" : "fa-book";
		var teacherHtml = "";
		if(categoryName.indexOf("ACTIVITY") > -1){
			activityCount++;
		}else if(categoryName.indexOf("BATCH") > -1){
			classCount++;
		}else{
			classCount++;
			teacherHtml = `<span class="mr-3"><i class="fa fa-user-o mr-1"></i>${teacher}</span>`;
		}
		// var showFromDate = getFeedbackShowFromDate();
		// var eventDate = info.start && info.start._i ? info.start._i : info.start;
		// var eventDateText = eventDate ? moment(eventDate).format("YYYY-MM-DD") : "";
		// var feedbackBtn = "";
		// if (showFromDate && eventDateText && eventDateText < showFromDate) {
		// 	// return "";
		// }else{
			feedbackBtn = getFeedbackBtn(info.id, courseName, info.start);
		// }
		// if(feedbackBtn == ""){
		// 	return true;
		// }
		feedbackContent += `<div class="card mb-2 border shadow-none" style="border-radius:16px;">
			<div class="card-body p-3">
				<div class="d-flex align-items-center justify-content-between">
					<div class="d-flex align-items-center pr-3">
						<div class="bg-light text-primary rounded d-flex align-items-center justify-content-center mr-3" style="width:42px;height:42px;">
							<i class="fa ${cardIcon}" aria-hidden="true"></i>
						</div>
						<div>
							<h5 class="font-weight-bold text-dark mb-1" style="font-size:16px;">${courseName}</h5>
							<div class="d-flex flex-wrap align-items-center text-muted font-weight-semi-bold" style="font-size:13px;">
								<span class="badge badge-light text-primary font-weight-semi-bold px-3 mr-2">${category}</span>
								${teacherHtml}
								<span class="mr-3"><i class="fa fa-calendar-o mr-1"></i>${startDate}</span>
								<span><i class="fa fa-clock-o mr-1"></i>${duration}</span>
							</div>
						</div>
					</div>
					<div class="pending-feedback-button ml-3">${feedbackBtn}</div>
				</div>
			</div>
		</div>`;
	});
	if(feedbackContent == ""){
		return false;
	}
	if(FEEDBACK_PENDING_POPUP_KEY == feedbackKey){
		return false;
	}
	FEEDBACK_PENDING_POPUP_KEY = feedbackKey;

	var modalHtml = `<div class="modal fade" id="pendingFeedbackPopup" tabindex="-1" role="dialog" aria-hidden="true">
		<div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" role="document" style="max-width:700px;">
			<div class="modal-content border-0 shadow-lg" style="border-radius:22px;overflow:hidden;">
				<div class="modal-header bg-primary border-0 d-block py-3 px-4">
					<div class="d-flex align-items-start justify-content-between">
						<div class="d-flex align-items-center">
							<div class="side-bar-icon bg-white rounded d-flex align-items-center justify-content-center mr-3" style="width:48px;height:48px;">
								<i class="metismenu-icon emoji-student-feedback d-inline-block" style="width:32px;height:32px;position:static;margin:0;"></i>
							</div>
							<div>
								<h4 class="modal-title text-white font-weight-bold mb-1">Pending Feedback</h4>
								<small class="d-block text-white">Please submit your pending weekly feedback.</small>
							</div>
						</div>
						<button type="button" class="close text-white ml-auto" data-dismiss="modal" aria-label="Close">
							<i class="fa fa-times"></i>
						</button>
					</div>
					<div class="row mt-3">
						<div class="col-4">
							<div class="text-center rounded py-2 bg-white">
								<h5 class="text-primary font-weight-bold mb-0">${feedbackCount}</h5>
								<small class="text-primary">Total</small>
							</div>
						</div>
						<div class="col-4">
							<div class="text-center rounded py-2 bg-white">
								<h5 class="text-primary font-weight-bold mb-0">${activityCount}</h5>
								<small class="text-primary">Activities</small>
							</div>
						</div>
						<div class="col-4">
							<div class="text-center rounded py-2 bg-white">
								<h5 class="text-primary font-weight-bold mb-0">${classCount}</h5>
								<small class="text-primary">Classes</small>
							</div>
						</div>
					</div>
				</div>
				<div class="modal-body p-3" style="background:#f7f9fc;">
					${feedbackContent}
				</div>
				<div class="modal-footer bg-light border-0 justify-content-between px-4 py-3">
					<span class="text-muted font-weight-semi-bold"><i class="fa fa-check-circle text-primary mr-1"></i>${feedbackCount} pending sessions</span>
					<button type="button" class="btn btn-outline-primary btn-sm rounded-pill px-4 font-weight-bold" data-dismiss="modal">Skip</button>
				</div>
			</div>
		</div>
	</div>`;

	$("#pendingFeedbackPopup").remove();
	$("body").append(modalHtml);
	$("#pendingFeedbackPopup .pending-feedback-button button").each(function () {
		var clickFun = $(this).attr("onclick");
		var rightSlideClick = viewName == "agendaWeek" ? "FEEDBACK_OPEN_IN_RIGHT_SLIDE=true;" : "";
		$(this)
			.removeClass("position-absolute")
			.addClass("font-weight-bold px-4 rounded-pill shadow-sm")
			.removeAttr("style")
			.attr("onclick", rightSlideClick + clickFun);
	});
	$("#pendingFeedbackPopup").modal("show");
}

function getFeedbackBtn(id, title, eventStart) {
    return `<button
            id="feedbackBtn_${id}"
            class="btn btn-sm btn-primary position-absolute"
            style="top:10px; right:10px; z-index:9;"
            onclick="openClassFeedbackById(event, '${id}')"
            data-className="${title}">
            Feedback
        </button>`;
}

function getFeedbackShowFromDate() {
    if (FEEDBACK_SHOW_FROM_DATE != undefined) {
        return FEEDBACK_SHOW_FROM_DATE;
    }
    var setting = getSettingsByTypeAndKey("CONFIGURATION", "FEEDBACK_SHOW_FROM_DATE", false);
    FEEDBACK_SHOW_FROM_DATE = getSettingMetaValue(setting);
    return FEEDBACK_SHOW_FROM_DATE;
}
