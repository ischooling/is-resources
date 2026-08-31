async function renderActivity(userId) {
	try {
		if (typeof isDummyStudentMode === "function" && isDummyStudentMode() && typeof getDummyActivityDetailsResponse === "function") {
			responseData = getDummyActivityDetailsResponse();
			$('#activityDiv').html(await getActivityContent(responseData));
			$("#activity-nav").metisMenu({
				toggle: false
			});
			getHomePageActivityCounter();
			return;
		}
		var payload = {};
		payload['userId'] = userId;
		var localDatetime = changeDateFormat(new Date(), 'yyyy-mm-dd') + ' ' + getCurrentTimeOnly()
		payload['startDatetime'] = convertLocalToUTCWithFormat(getBeforeAndAfterDate(localDatetime, -24), USER_TIMEZONE, DATETIME_UTC_FORMATTER);
		payload['endDatetime'] = convertLocalToUTCWithFormat(getBeforeAndAfterDate(localDatetime, 24), USER_TIMEZONE, DATETIME_UTC_FORMATTER);
		responseData = await getDashboardDataBasedUrlAndPayload(true, true, 'get-acivity-details', payload);
		if(responseData.status == 1) { //console.log("ACT DATA :: " + JSON.stringify(responseData));
			$('#activityDiv').html(await getActivityContent(responseData));
			$("#activity-nav").metisMenu({
				toggle: false // disable the auto collapse. Default: true.
			});
			getHomePageActivityCounter();
			var activitylength = $(".card-activity .vertical-nav-menu > .sub-menu").length;
			for (var i = 1; i <= activitylength; i++) {
				var subActivityLength = $(".card-activity .vertical-nav-menu  .sub-menu:nth-child(" + i + ") > ul .sub-menu").length;
				if ($(".card-activity .vertical-nav-menu > .sub-menu:nth-child(" + i + ") ul li").length < 1) {
					$(".card-activity .vertical-nav-menu > .sub-menu:nth-child(" + i + ") a").addClass("disable-activity");
				} else if (subActivityLength >= 1) {
					for (var j = 1; j <= subActivityLength; j++) {
						$(".card-activity .vertical-nav-menu  .sub-menu:nth-child(" + i + ")").addClass('mm-active');
						$(".card-activity .vertical-nav-menu > .sub-menu:nth-child(" + i + ")  ul").addClass('mm-show');
						$(".card-activity .vertical-nav-menu > .sub-menu:nth-child(" + i + ") > ul > .sub-menu:nth-child(" + j + ")").addClass('mm-active');
						$(".card-activity .vertical-nav-menu > .sub-menu:nth-child(" + i + ") > ul > .sub-menu:nth-child(" + j + ") ul").addClass('mm-show');
					}
				} else {
					$(".card-activity .vertical-nav-menu > .sub-menu:nth-child(" + i + ")  ul").addClass('mm-show');
					$(".card-activity .vertical-nav-menu  .sub-menu:nth-child(" + i + ")").addClass('mm-active');
				}
			}
		}
	} catch (e) {
		showMessageTheme2(0, e, '', true);
	}
}

//EXTRA ACTIVITY COUNTER SCRIPT START HERE//
function makeTimer(myActId, activityStartDateTimeByUserTimezone, currentDate) {
	// Use the Safari-safe parser: Date.parse on "YYYY-MM-DD HH:mm:ss" returns
	// NaN in Safari, which produced the bogus countdown (e.g. "20695 Days").
	var endTimeDate = parseDateTimeSafe(activityStartDateTimeByUserTimezone);
	var nowDate = parseDateTimeSafe(currentDate);
	if (!endTimeDate || !nowDate) {
		return;
	}
	var endTime = endTimeDate.getTime() / 1000;
	var now = nowDate.getTime() / 1000;
	var timeLeft = endTime - now;
	var days = Math.floor(timeLeft / 86400);
	var hours = Math.floor((timeLeft - (days * 86400)) / 3600);
	var minutes = Math.floor((timeLeft - (days * 86400) - (hours * 3600)) / 60);
	var seconds = Math.floor((timeLeft - (days * 86400) - (hours * 3600) - (minutes * 60)));

	if (hours < "10") { hours = "0" + hours; }
	if (minutes < "10") { minutes = "0" + minutes; }
	if (seconds < "10") { seconds = "0" + seconds; }
	if (days < 1) {
		days = "0"
	}
	$("#days" + myActId).html("<b class='time-number'>" + days + "</b>" + "<span class='count-span text-dark'>&nbsp; Days</span>");
	$("#hours" + myActId).html("<b class='time-number'>" + hours + "</b>" + "<span class='count-span text-dark'> &nbsp;Hours</span>");
	$("#minutes" + myActId).html("<b class='time-number'>" + minutes + "</b>" + "<span class='count-span text-dark'> &nbsp;Min</span>");
	$("#seconds" + myActId).html("<b class='time-number'>" + seconds + "</b>" + "<span class='count-span text-dark'> &nbsp;Sec</span>");
}


// Registry of every countdown interval created by getHomePageActivityCounter so
// they can be cleared before a re-render. Without this the intervals stack up:
// each time an activity modal is (re)opened a fresh set of intervals is created
// while the old ones keep running. When two occurrences of the same recurring
// activity share the same activityId, the stale interval keeps writing its own
// remaining time into the reused #days<id>/#timer<id> element, so the countdown
// visibly flickers between the two values (e.g. 13 days <-> 41 days).
var ACTIVITY_TIMER_INTERVALS = [];
function clearAllActivityTimers(){
	if (Array.isArray(ACTIVITY_TIMER_INTERVALS)) {
		$.each(ACTIVITY_TIMER_INTERVALS, function (i, id) {
			clearInterval(id);
		});
	}
	ACTIVITY_TIMER_INTERVALS = [];
}
function getHomePageActivityCounter(activityID){
	// Drop any previously registered timers and rebuild from the currently
	// attached .myActivityLoop elements, so intervals never accumulate.
	clearAllActivityTimers();
	var userCurrentTime = convertUTCToTimezoneAs(getUTCTime(), DATETIME_FORMATTER, USER_TIMEZONE).format('MMM DD, YYYY hh:mm:ss a');
	ACTIVITY_TIMER_INTERVALS.push(setInterval(function(){
        userCurrentTime = convertUTCToTimezoneAs(getUTCTime(), DATETIME_FORMATTER, USER_TIMEZONE).format('MMM DD, YYYY hh:mm:ss a');
    }, 1000));
	$('.myActivityLoop').each(function () {
		var tick = function () {
			var acivityIndex = $(this).attr('data-activity-index');
			var timerId = $(this).attr('data-timeid');
			var activityStartTime = parseDateTimeSafe($(this).attr('data-starttimedate'));
			var activityEndTime = parseDateTimeSafe($(this).attr('data-endtimedate'));
			var joiningBefore = parseInt($(this).attr('data-joiningBefore'));
			// IMPORTANT: activityStartTime/activityEndTime are built from
			// convertDatetimeWithFormat(..., USER_TIMEZONE) -> a USER-timezone
			// wall-clock string parsed into a Date via local components. The
			// "current time" we compare against MUST be the same kind of value
			// (user-TZ wall-clock), otherwise a machine/user timezone offset
			// shifts the diff by hours and the Join button flips on/off.
			//
			// Resolution order (all user-TZ wall-clock):
			//   1) #currentTimeForUser (server-synced clock)
			//   2) userCurrentTime (moment formatted in USER_TIMEZONE, refreshed
			//      every second at the top of this function)
			// Only if BOTH are unavailable do we fall back to new Date(); that is
			// a last resort to keep the timer alive, not the normal path.
			// Use parseDateTimeSafe (not getCurrentDateTimeByUserTimeZone) to
			// read the synced clock: #currentTimeForUser is formatted differently
			// per page -- some use "YYYY-MM-DD hh:mm:ss a", others "MMM DD, YYYY
			// hh:mm:ss a". getCurrentDateTimeByUserTimeZone only understands the
			// first, so on pages using the second it returned null and we silently
			// fell through to a different code path -- which is exactly why the
			// Join button appeared inconsistently on the same event. parseDateTimeSafe
			// handles both formats and yields the same user-TZ wall-clock Date.
			var currentDateTimeByUserTimeZone = null;
			var syncedClockText = $("#currentTimeForUser").text();
			if (syncedClockText != "") {
				currentDateTimeByUserTimeZone = parseDateTimeSafe(syncedClockText);
			}
			if (!currentDateTimeByUserTimeZone) {
				currentDateTimeByUserTimeZone = parseDateTimeSafe(userCurrentTime);
			}
			if (!currentDateTimeByUserTimeZone) {
				currentDateTimeByUserTimeZone = new Date();
			}
			// Only a genuinely invalid activity (no start/end) is skipped.
			if (!activityStartTime || !activityEndTime) {
				return;
			}
			if(activityEndTime >  currentDateTimeByUserTimeZone){
				if (activityStartTime > currentDateTimeByUserTimeZone) {
					$(this).find('.counter-div').show();
					$(this).find('.ongoing-div').hide();
					$(this).find('.joinLBtn' + timerId).hide().removeClass('d-inline-block');
					$('#displayJoinLinkDiv' + timerId).show();
					if((activityStartTime.getTime() - currentDateTimeByUserTimeZone.getTime()) <= joiningBefore * 60000) {
						$('#joinButton' + timerId).show().removeClass('join-activity-disabled hide-acitvity-btn');
						if(USER_ROLE =="STUDENT"){
							$("#join-btn-message-"+timerId).hide();
						}
					} else {
						if(USER_ROLE=='STUDENT'){
							$('#joinButton' + timerId).addClass('join-activity-disabled hide-acitvity-btn');
						}
					}
				} else {
					$(this).find('.joinLBtn' + timerId).show().addClass('d-inline-block');
					$(this).find('.counter-div').hide();
					$(this).find('.ongoing-div').show();
					$(this).find('.activity-btn').hide();
					if((activityStartTime.getTime() - currentDateTimeByUserTimeZone.getTime()) <= joiningBefore * 60000) {
						$('#joinButton' + timerId).show().removeClass('join-activity-disabled hide-acitvity-btn');
						if(USER_ROLE =="STUDENT"){
							$("#join-btn-message-"+timerId).hide();
						}
						$('#displayJoinLinkInfoDiv'+timerId).hide();
						$(this).find('.joinLBtn' + timerId).show().addClass('d-inline-block');
					} else {
						if(USER_ROLE=='STUDENT'){
							$('#joinButton' + timerId).addClass('join-activity-disabled hide-acitvity-btn');
						}
						$('#displayJoinLinkInfoDiv'+timerId).show();
					}
					
					// Activity Remove if acvity end time is over 
					if(currentDateTimeByUserTimeZone > activityEndTime){
						if(USER_ROLE=='STUDENT'){
							$('#joinButton' + timerId).addClass('join-activity-disabled hide-acitvity-btn');
						}
						if($("#activity-li-"+acivityIndex+" > ul.mm-collapse > li > ul.mm-collapse").length>0){
							$(this).parent().closest("li").remove();
						}else{
							$(this).remove();
						}
						if($("#activity-li-"+acivityIndex+" > ul.mm-collapse > li").length<1){
							$("#activity-li-"+acivityIndex+" > ul.mm-collapse").html('').removeClass("mm-show");
							$("#activity-li-"+acivityIndex).removeClass("mm-active");
							$("#activity-li-"+acivityIndex+" #parent-"+acivityIndex).addClass("disable-activity");
						}
						if($(".myActivityLoop").length<1){
							clearInterval(intervalId);
						}
					}
					// Activity Remove if acvity end time is over 
				}
				makeTimer(timerId, activityStartTime, currentDateTimeByUserTimeZone);
			}else{
				$('#joinButton' + timerId).addClass('join-activity-disabled hide-acitvity-btn');
				$('#joinButton' + timerId).remove();
				$("#join-btn-message-"+timerId).remove();
				$("#displayJoinLinkInfoDiv"+timerId).remove();
				// $(this).remove();
				// $("#displayJoinLinkInfoDiv"+timerId).hide();
			}


		}.bind(this);
		// Run once immediately so the countdown paints right away instead of
		// waiting a full second (which left the modal showing empty boxes).
		tick();
		var intervalId = setInterval(tick, 1000);
		ACTIVITY_TIMER_INTERVALS.push(intervalId);
	});
}
//EXTRA ACTIVITY COUNTER SCRIPT END HERE//
async function renderViewActitifyDetails(activityId, meetingId, getColorCode, occurrenceDate) {
	var userCurrentTime = getCurrentDateTimeByUserTimeZone($("#currentTimeForUser").text())
	userCurrentTime = parseDateTimeSafe(userCurrentTime);
	var userActivityEndTime = parseDateTimeSafe($("#activity-end-time-"+activityId).attr('data-endtimedate'));
	if(userActivityEndTime && userCurrentTime && userActivityEndTime < userCurrentTime){
		showMessageTheme2(0, "Your activity has been completed.")
		return false;
	}
	try {
		if (typeof isDummyStudentMode === "function" && isDummyStudentMode() && typeof getDummyViewActivityResponse === "function") {
			responseData = getDummyViewActivityResponse(activityId);
			responseData.occurrenceDate = occurrenceDate;
			$("#calendarActivityWrapper").html(viewActivityContentModal(responseData))
			$("#calendarActivityModal").modal("show");
			await studentExtraActivityOnLoadEvent(responseData);
			$("head #activityPageStyle").remove();
			$("head").append(activityPageStyle());
			$(".tooltip.calendar-tooltip").remove();
			getHomePageActivityCounter();
			return;
		}
		var payload = {};
		payload['activityId'] = activityId;
		payload['meetingId'] = meetingId;
		payload['userId'] = USER_ID;
		if (occurrenceDate) {
			payload['occurrenceDate'] = occurrenceDate;
		}
		responseData = await getDashboardDataBasedUrlAndPayload(true, true, 'view-extra-activity', payload);
		console.log("acivity modal", responseData)
		if (responseData.status == 1) {
			responseData.occurrenceDate = occurrenceDate;
			$("#calendarActivityWrapper").html(viewActivityContentModal(responseData))
			// $('#dashboardContentInHTML').html(viewActivityContent(responseData));
			$("#calendarActivityModal").modal("show");
			await studentExtraActivityOnLoadEvent(responseData);
			$("head #activityPageStyle").remove();
			$("head").append(activityPageStyle());
			$(".tooltip.calendar-tooltip").remove();
			getHomePageActivityCounter();
			console.log('getHomePageActivityCounter code for testing');
			$("#calendarActivityModal .modal-event-border").css({"background":getColorCode});
		}
	} catch (e) {
		showMessageTheme2(0, e, '', true);
	}
}

async function studentExtraActivityOnLoadEvent(){
	$('iframe.hasPDF').each(function () {
		if ($(this).attr('href').toLowerCase().match(/\.(pdf)/g)) {
			var currentURL = $(this).attr('href');
			var newURL = 'https://docs.google.com/gview?url=' + currentURL + '&embedded=true';
			$(this).attr('href', newURL)
		}
	});
}




function joinZoomMeeting(src) {
	customLoader(true);
	var meetingLink = $(src).attr("data-meeting-url");
	// Get the iframe element
	$("#zoomMeetingCard").css({ "margin": "0px !important" });
	$("#zoomMeetingCard").hide();
	var iframe = document.getElementById('activity-zoom-meeting-iframe');
	// Set the new URL for the iframe
	iframe.src = meetingLink;
	$("#activity-zoom-meeting-iframe").show();
	setTimeout(function () {
		customLoader(false);
	}, 3000);
}

function viewActivityAttachmentSource(uploadFile, filePath){
	var html=``;
	if(uploadFile!='' && uploadFile !='No file chosen...'){
		if(uploadFile.endsWith('.pdf')?'pdf-view':''){
			// $("#viewActivityAttachmentModal .modal-dialog").addClass("modal-xl").removeClass("modal-lg");
			html+=`<iframe src="${getPdfViewerUrl(filePath)}" type="application/pdf" width="100%" height="500" style="overflow:auto;"></iframe>`;
		}else{
			// $("#viewActivityAttachmentModal .modal-dialog").addClass("modal-lg").removeClass("modal-xl");
			html+=`<img src="${filePath}" style="width:100%;" class="activity-upload-img"/>`;
		}
		html+=
		`<div class="full text-right mt-3">
			<button type="button" class="btn btn-pill btn-light px-3" data-dismiss="modal">Close</button>
		</div>`;
	}
	$("#viewActivityAttachmentModal #viewActivityAttachmentModalWrapper").html(html);
	$("#viewActivityAttachmentModal").modal("show");
}

// Safari-safe datetime parser.
//
// Strings like "2026-08-31 12:50:00" (space between date and time, no "T")
// are NOT valid ISO-8601. Chrome/Firefox parse them leniently, but Safari's
// Date.parse()/new Date() returns an Invalid Date (NaN), which downstream math
// turns into nonsense values (e.g. a "20695 Days" countdown). This helper
// normalizes the input and parses it into a real Date across all browsers.
//
// Accepts:
//   - a Date object (returned as-is)
//   - "YYYY-MM-DD HH:mm:ss" / "YYYY-MM-DDTHH:mm:ss"
//   - "YYYY-MM-DD hh:mm:ss am|pm"
// Returns a Date, or null when it cannot be parsed.
function parseDateTimeSafe(value) {
    if (value == null || value === "") {
        return null;
    }
    if (value instanceof Date) {
        return isNaN(value.getTime()) ? null : value;
    }

    var str = $.trim(String(value));

    // 12-hour format with am/pm.
    if (/\b(am|pm)$/i.test(str)) {
        // "YYYY-MM-DD hh:mm:ss am|pm" -> dedicated component parser.
        if (/^\d{4}-\d{2}-\d{2}\b/.test(str)) {
            return getCurrentDateTimeByUserTimeZone(str);
        }
        // Other am/pm layouts (e.g. moment's "MMM DD, YYYY hh:mm:ss a").
        // Parse with moment when available; it is Safari-safe.
        if (typeof moment === "function") {
            var m = moment(str, [
                "MMM DD, YYYY hh:mm:ss a",
                "MMM DD, YYYY hh:mm a",
                "MMM D, YYYY hh:mm:ss a",
                "MMM D, YYYY hh:mm a"
            ]);
            if (m.isValid()) {
                return m.toDate();
            }
        }
    }

    // 24-hour "YYYY-MM-DD HH:mm[:ss]" (space or "T" separator).
    var parts = str.match(
        /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?$/
    );
    if (parts) {
        return new Date(
            parseInt(parts[1], 10),
            parseInt(parts[2], 10) - 1,
            parseInt(parts[3], 10),
            parseInt(parts[4], 10),
            parseInt(parts[5], 10),
            parts[6] ? parseInt(parts[6], 10) : 0
        );
    }

    // Fallback: let the engine try (handles full ISO strings with timezone).
    var fallback = new Date(str);
    return isNaN(fallback.getTime()) ? null : fallback;
}

// Epoch-ms for a value using the Safari-safe parser, without throwing when the
// value is unparseable/empty. Returns `fallback` (default NaN) in that case, so
// callers can compare inline without ".getTime() of null" crashes. Pass
// fallback = Date.now() when a missing value should be treated as "now".
function getTimeSafe(value, fallback) {
    var d = parseDateTimeSafe(value);
    if (d) {
        return d.getTime();
    }
    return arguments.length > 1 ? fallback : NaN;
}