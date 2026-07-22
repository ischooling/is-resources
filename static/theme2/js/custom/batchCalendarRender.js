/*
 * Batch calendar — JS render of the legacy batch calendar fragment from the /calendar-dates-data JSON.
 * calendarDates() (dashboardSchoolBatches.js) fetches the JSON and calls buildBatchCalendarHtml()
 * + initBatchCalendar(). The grid cell rendering mirrors the legacy role-branched markup
 * (TEACHER / STUDENT / DIRECTOR + roleAndModule rights). The action functions + modals below are
 * moved verbatim from the JSP's inline <script> / modal markup.
 */

var __bcUserId = null;
var __bcBatchId = null;
var __bcCurrentCalendarStartDate = null;
var __bcCurrentCalendarSlotType = null;

function ensureBatchCalendarStyles() {
	if ($("#batchCalendarRenderStyle").length > 0) {
		return;
	}
	$("head").append(
		'<style id="batchCalendarRenderStyle">' +
			'.selected-date a{background-color:#a7a7a7;color:#fff !important;padding:10px 12px;border-radius:100%;}' +
			'.expired-date{color:#cfcfcf;}' +
			'.active-date a{background-color:#12dbfe;color:#fff !important;padding:10px 12px;border-radius:100%;}' +
			'.custom-calendar{vertical-align:baseline !important;width:150px;position:relative;white-space:nowrap;padding:8px 5px !important;}' +
			'.cdate{font-size:40px;line-height:24px;font-weight:700;display:inline-block;color:#fff;}' +
			'.batchName{color:var(--pc);margin:5px 0;display:block;}' +
			'.scroller{overflow-x:auto;display:block;margin-bottom:30px;border-radius:4px;}' +
			'.day-calendar .scroller{max-width:100% !important;}' +
			'.batchCourses{background:#f1f5f8;margin-bottom:3px;color:#051370;padding:2px;border-radius:4px;font-size:11px !important;text-align:left;}' +
			'.day-calendar .scroller .batchCourses{margin:10px !important;text-align:center !important;}' +
			'.join-wrapper{position:absolute;bottom:10px;left:0;right:0;width:100%;}' +
			'.btn.btn-pill{border-radius:30px !important;}' +
			'.join-btn-url{width:100%;background:#4ca412;text-align:center;padding:2px 5px;border-radius:4px;margin-top:2px;display:inline-block;color:#fff !important;}' +
			'.send-btn-url{width:100%;background:var(--pc);text-align:center;padding:2px 5px;border-radius:4px;margin-top:2px;display:inline-block;color:#fff !important;}' +
			'.subject-name{margin:0 !important;}' +
			'.holiday-wrapper{background:#b8e7b8;}' +
			'.holiday-wrapper .holiday{border:3px solid green;border-radius:2px;padding:4px;margin-top:30px;}' +
			'.holiday-wrapper .holiday span{padding:8px 0;position:relative;margin:1px;display:inline-block;width:100%;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:3px;color:green;}' +
			'.holiday-wrapper .holiday span:before{content:"";position:absolute;left:0;top:0;width:100%;height:2px;background:green;}' +
			'.holiday-wrapper .holiday span:after{content:"";position:absolute;left:0;bottom:0;width:100%;height:2px;background:green;}' +
			'.dayclass{float:left;padding-right:5px;padding-left:5px;border:1px solid gray;}' +
			'.day1{background:#DED6DE;}' +
			'.day2{background:#9CE0D6;}' +
			'.day3{background:#B0E8C7;}' +
			'.day4{background:#F0DEBA;}' +
			'.day5{background:#E3E6D1;}' +
			'.day6{background:#B8DBD6;}' +
			'.day7{background:#D6E3E6;}' +
			'.reschedule{background:#aed7f6;margin-bottom:3px;color:#051370;padding:2px;border-radius:4px;font-size:11px !important;text-align:left;}' +
		'</style>'
	);
}

function bcEsc(value) {
	if (value === undefined || value === null) {
		return "";
	}
	return String(value)
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");
}

function bcJsArg(value) {
	if (value === undefined || value === null) {
		return "";
	}
	return String(value).replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

function bcParseCalendarDate(value) {
	if (!value) {
		return null;
	}
	var text = String(value).trim();
	var iso = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
	if (iso) {
		return new Date(parseInt(iso[1], 10), parseInt(iso[2], 10) - 1, parseInt(iso[3], 10));
	}
	var us = text.match(/^(\d{2})-(\d{2})-(\d{4})/);
	if (us) {
		return new Date(parseInt(us[3], 10), parseInt(us[1], 10) - 1, parseInt(us[2], 10));
	}
	var parsed = new Date(text);
	return isNaN(parsed.getTime()) ? null : parsed;
}

function bcCanMoveToNextMonth(lastDate, firstNext) {
	var end = bcParseCalendarDate(lastDate);
	var next = bcParseCalendarDate(firstNext);
	if (!end || !next) {
		return true;
	}
	end.setHours(23, 59, 59, 999);
	next.setHours(0, 0, 0, 0);
	return end.getTime() >= next.getTime();
}

// One class entry within a day cell. Mirrors the legacy batchTime markup
// (Month/Week: lines 267-402; Day: lines 101-222). isDay toggles the minor Day-view differences.
function buildBatchTimeHtml(dates, bt, ctx, isDay, dIdx, bIdx) {
	if (dates.available != 0) {
		return "";
	}
	var html = "";
	var slotDate = bcJsArg(dates.slotDate);
	var dateForShow = bcJsArg(dates.dateForShow);

	if (ctx.roleType === 'TEACHER') {
		if (ctx.meetingProvServiceReq === 'Y') {
			if (bt.batchName) {
				html += '<div class="batchCourses' + (isDay ? ' dayclass' : '') + '">' +
					'<b>' + bcEsc(bt.scheduleTime) + '</b><br/>' +
					'<b>' + bcEsc(bt.batchName) + '</b><br/>' +
					'<p class="subject-name"><b>' + bcEsc(bt.subjectName) + '</b></p>';
				if (ctx.sessUserRole === ctx.roleType) {
					if (bt.classStatus === 'cancel' && (bt.meetingLink || !bt.enterClassOnlyAfterMeetingStatus)) {
						html += '<a onclick="return false" style="border:1px solid #f44336 !important;background-color: #f44336;pointer-events: none;" class="join-btn-url">Cancelled</a><br/>';
					}
					if (!bt.meetingLink || bt.meetingGenerateStatus === 'MANUAL') {
						html += 'Click on "Enter Classroom" to create your class link';
					}
				}
				html += '</div>';
			}
		} else {
			html += '<div class="batchCourses">' +
				'<b>' + bcEsc(bt.scheduleTime) + '</b><br/>' +
				'<b>' + bcEsc(bt.batchName) + '</b><br/>' +
				'<p class="subject-name"><b>' + bcEsc(bt.subjectName) + '</b></p>' +
				(bt.meetingLink ? '' : 'Click on "Enter Classroom" to create your class link') +
				'</div>';
		}
		// Month/Week only: copy-meeting-link cell for non-owner viewers.
		if (!isDay && (ctx.sessUserRole !== ctx.roleType) && bt.meetingLink) {
			if (bt.classStatus === 'cancel') {
				html += '<a href="javascript:void(0)"><i class="text-danger" aria-hidden="true">Cancelled</i></a>';
			} else {
				html += '<input type="text" name="' + bcEsc(bt.meetingLinkId) + '" id="' + bcEsc(bt.meetingLinkId) + '" class="form-control" style="opacity:0; height:0;padding:0;" value="' + bcEsc(bt.meetingLink) + '">';
			}
		}
	}

	if (ctx.roleType === 'STUDENT' || ctx.roleType === 'DIRECTOR' || ctx.roleUpdated === 'Y' || ctx.roleAdded === 'Y') {
		if (bt.batchName && (ctx.roleType === 'DIRECTOR' || ctx.roleUpdated === 'Y' || ctx.roleAdded === 'Y')) {
			html += '<div class="batchCourses ' + bcEsc(bt.classStatus) + '">' +
				'<p class="subject-name"><b>' + bcEsc(bt.subjectName) + '</b></p>' +
				'<b>' + bcEsc(bt.scheduleTime) + '</b><br/>';
			if (ctx.roleUpdated === 'Y' || ctx.roleAdded === 'Y') {
				html += '<b>' + bcEsc(bt.teacherName) + '</b><br/>';
			}
			if (ctx.roleUpdated === 'Y') {
				if (bt.meetingJoinUrl != null) {
					if (bt.classStatus === 'cancel') {
						html += '<a onclick="return false" style="border:1px solid #f44336 !important;background-color: #f44336;pointer-events: none;" class="join-btn-url">Cancelled</a><br />';
					} else {
						html += '<a onclick="cancelClassModal(\'' + bcEsc(bt.rescheduleClassId) + '\',\'' + bt.id + '\',\'' + slotDate + '\',\'' + bcJsArg(bt.batchName) + '\',\'' + bcJsArg(bt.subjectName) + '\',\'' + bcJsArg(bt.scheduleTime) + '\',\'' + bcJsArg(bt.teacherName) + '\',\'' + dateForShow + '\',\'cancel\')" href="javascript:void(0);" class="join-btn-url">Cancel</a><br />';
					}
					html += '<a href="javascript:void(0);" onclick="rescheduleContentModal(\'' + bcEsc(bt.rescheduleClassId) + '\',\'' + bt.id + '\',\'' + bt.subjectId + '\',\'' + slotDate + '\', \'' + dates.weekdaynum + '\', \'' + bcJsArg(bt.batchStartDate) + '\', \'' + bcJsArg(bt.batchEndDate) + '\',\'' + bcJsArg(bt.batchName) + '\',\'' + bcJsArg(bt.subjectName) + '\',\'' + bcJsArg(bt.scheduleTime) + '\',\'' + bcJsArg(bt.teacherName) + '\',\'' + dateForShow + '\',\'' + bcJsArg(bt.timeZone) + '\', \'' + bt.teacherId + '\');" class="join-btn-url">Reschedule</a><br />';
					if (bt.classStatus === 'cancel' || bt.classStatus === 'reschedule') {
						html += '<a onclick="sendMailClass(\'' + bt.id + '\',\'' + slotDate + '\',\'sendmail-' + bcEsc(bt.classStatus) + '\')" href="javascript:void(0);" class="send-btn-url">Send Mail</a><br />';
					}
					if (bt.externalUserLink && bt.classStatus !== 'cancel') {
						var cid = 'copyURL' + dIdx + bIdx;
						var msgc = 'copy-msg-' + dIdx + bIdx;
						html += '<br/><input class="tinyUrl" style="display: none;" type="text" id="' + cid + '" value="' + bcEsc(bt.externalUserLink) + '">' +
							'<div style="display: flex;flex-direction: column;">' +
							'<b class="' + msgc + '"></b>' +
							'<button id="' + cid + '" onclick="copyURL(\'' + cid + '\',\'' + msgc + '\')" class="send-btn-url">Copy External Link</button>' +
							'</div>';
					}
				} else {
					html += '<p>Your class has not started yet</p>';
				}
			}
			html += '</div>';
		}
		if (bt.batchName && ctx.roleType === 'STUDENT' && bt.classStatus !== 'cancel') {
			html += '<div class="batchCourses">' +
				'<p class="subject-name"><b>' + bcEsc(bt.subjectName) + '</b></p>' +
				'<b>' + bcEsc(bt.scheduleTime) + '</b><br/>';
			if (ctx.sessUserRole === ctx.roleType && bt.meetingJoinUrl == null) {
				html += '<p>Your class has not started yet</p>';
			}
			html += '</div>';
		}
	}
	return html;
}

var __BC_WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var __BC_WEEKDAY_BG = ['#9C8CC9', '#36A391', '#61913D', '#C78F3D', '#6BAB4D', '#00828C', '#008AC4'];

function buildBatchCalendarHtml(data) {
	ensureBatchCalendarStyles();
	var ctx = {
		roleType: data.roleType,
		sessUserRole: data.sessUserRole,
		meetingProvServiceReq: data.meetingProvServiceReq,
		roleUpdated: data.roleUpdated,
		roleAdded: data.roleAdded
	};
	var isDay = data.slotType === 'Day';
	var dayOfWeekVal = data.dayOfWeekVal;
	var list = data.dates || [];

	var head;
	if (isDay) {
		var wi = dayOfWeekVal - 1;
		head = '<td style="background-color:' + __BC_WEEKDAY_BG[wi] + ';color:#fff;">' + __BC_WEEKDAYS[wi] + '</td>';
	} else {
		head = '<tr>';
		for (var w = 0; w < 7; w++) {
			head += '<td style="background-color:' + __BC_WEEKDAY_BG[w] + ';color:#fff;">' + __BC_WEEKDAYS[w] + '</td>';
		}
		head += '</tr>';
	}

	var body = '';
	var startDate = dayOfWeekVal;
	if (isDay) {
		body += '<tr>';
		for (var i = 0; i < list.length; i++) {
			var d = list[i];
			var weekdaycl = 'day' + d.weekdaynum;
			if (startDate <= 7) {
				var scroller = '';
				var cl = d.classes || [];
				for (var b = 0; b < cl.length; b++) {
					scroller += buildBatchTimeHtml(d, cl[b], ctx, true, i, b);
				}
				body += '<td class="day-calendar ' + (d.available == 1 ? 'holiday-wrapper' : '') + ' ' + weekdaycl + '">' +
					'<span class="cdate">' + bcEsc(d.day1) + '</span>' +
					(d.available == 1 ? '<div class="holiday"><span>Holiday ' + bcEsc(d.day1) + '</span></div>' : '') +
					'<div class="scroller" style="text-align:center">' + scroller + '</div>' +
					'</td>';
				startDate = startDate + 1;
			}
			if (startDate > 7) { startDate = 1; body += '</tr>'; }
		}
		body += '</tr>';
	} else {
		body += '<tr>';
		for (var e = 1; e <= dayOfWeekVal - 1; e++) { body += '<td></td>'; }
		for (var j = 0; j < list.length; j++) {
			var dm = list[j];
			var wcl = 'day' + dm.weekdaynum;
			if (startDate <= 7) {
				var dayCell;
				if (dm.classes && dm.classes.length && (data.sessUserRole === data.roleType)) {
					dayCell = '<a href="javascript:void(0);" onclick="getToday(\'' + bcJsArg(dm.slotDate) + '\');">' + bcEsc(dm.day1) + '</a>';
				} else {
					dayCell = bcEsc(dm.day1);
				}
				var scroll = '';
				var cls = dm.classes || [];
				for (var k = 0; k < cls.length; k++) {
					scroll += buildBatchTimeHtml(dm, cls[k], ctx, false, j, k);
				}
				body += '<td class="custom-calendar ' + (dm.available == 1 ? 'holiday-wrapper' : '') + ' ' + wcl + '">' +
					'<span class="cdate">' + dayCell + '</span>' +
					(dm.available == 1 ? '<div class="holiday"><span>Holiday</span></div>' : '') +
					'<div class="scroller">' + scroll + '</div>' +
					'</td>';
				startDate = startDate + 1;
			}
			if (startDate > 7) { startDate = 1; body += '</tr>'; }
		}
		body += '</tr>';
	}

	var table = '<table class="table table-bordered responsive" style="width:100%;table-layout:fixed">' +
		'<thead>' + head + '</thead><tbody>' + body + '</tbody></table>';
	return table;
}

// Init — adapted from the legacy inline $(document).ready + nav bindings. Runs after
// each render; the nav/title elements (#weekCount, #monthTitle, #preVisitMonth, #nextVisitMonth…)
// live in the host page, so bindings are refreshed with the current data on every render.
function initBatchCalendar(data) {
	__bcUserId = data.userId;
	__bcBatchId = data.batchId;
	__bcCurrentCalendarSlotType = data.slotType || $("#dateCategory").val() || __bcCurrentCalendarSlotType;

	$("#moduleFormModal, #booksclassOutsideAvailabilityConfirmationModal, #remarksresetDelete, #recurringClassShowModel, #recurringClassShowModelValidation, #classCancelModal").remove();
	$("body").append(batchCalendarModalsHtml());
	$("#classJoinInSameWindowModal, #joinUrlInfo").remove();
	$("body").append(calendarMeetingLinkValidate());
	$('.batchCourses:contains("Recess")').addClass('recess').find('br').remove();
	generateTinyUrls();
	$('#endTime').timepicker({ format: 'HH:mm' });
	$('#endTime').off('click.batchCalendar').on('click.batchCalendar', function () {
		if ($("#startTime").val() != '') {
		} else {
			showMessageTheme2(2, "Please Select Start Time First");
			return false;
		}
	});
	$('#startTime').off('click.batchCalendar').on('click.batchCalendar', function () {
		if ($("#startDate").val() == '') {
			showMessageTheme2(2, "Please Select Reschedule Date First");
			return false;
		}
	});
	$("#teacherId").select2({ theme: "bootstrap4", dropdownParent: "#moduleFormModal" });

	$("#inActDate").val('');
	$("#meetingCategory").val(data.slotTypeId);
	$("#meetingCategory").attr('text', data.slotType);

	var meetingCategory = $("input[name='meetingCategory']:checked").val();
	var meetingCategoryText = "Week";
	var title = data.monthName + ' - ' + data.year;
	if (meetingCategory == 1) { $("#monthTitle").html(title); meetingCategoryText = 'Month'; }
	else if (meetingCategory == 2) { meetingCategoryText = 'Week'; $("#monthTitle").html(title); }
	else if (meetingCategory == 3) { meetingCategoryText = 'Day'; $("#monthTitle").html(title); }

	$("#monthYear").html($("#weekCount").val() + ' ' + meetingCategoryText + "(s) Selected");
	if (parseInt($("#weekCount").val()) >= 1) { $("#preVisitMonth").show(); } else { $("#preVisitMonth").hide(); }
	if (parseInt($("#weekCount").val()) == 2) { $("#nextVisitMonth").hide(); } else { $("#nextVisitMonth").show(); }
	$("#dateCategory").val(meetingCategoryText);

	var firstNext = data.firstDateNextMonth;
	var firstPre = data.firstDatePreMonth;
	var uid = data.userId;
	var bid = data.batchId;
	$("#nextVisitMonth").unbind('click').bind("click", function () {
		var lastDate = $("#batchEndDate").val();
		var dateflag = bcCanMoveToNextMonth(lastDate, firstNext);
		$("#batchDate").val($("#batchEndDate").val());
		var next = parseInt($("#weekCount").val()) + 1;
		if ($("#dateCategory").val() == 'Month' && dateflag) {
			$("#weekCount").val(next);
			calendarDates('calendarWeek', firstNext, meetingCategoryText, uid, bid);
		} else {
			if (dateflag) {
				$("#weekCount").val(next);
				calendarDates('calendarWeek', firstNext, meetingCategoryText, uid, bid);
			} else {
				$("#nextVisitMonth").hide();
			}
		}
	});
	$("#preVisitMonth").unbind('click').bind("click", function () {
		$("#weekCount").val(parseInt($("#weekCount").val()) - 1);
		calendarDates('calendarWeek', firstPre, meetingCategoryText, uid, bid);
		$("#nextVisitMonth").show();
	});
}

function getToday(today) {
	$("#calendarWeek").show();
	$(".arrowBtn").show();
	$(".cal-title").show();
	$("#inActDate").val('');
	var meetingCategoryText = "Day";
	$("#monthYear").html($("#weekCount").val() + ' ' + meetingCategoryText + "(s) Selected");
	$("#dateCategory").val(meetingCategoryText);
	$("#meetingCategory3").prop('checked', true);
	var nd = today.split("-")[2] + "-" + today.split("-")[0] + "-" + today.split("-")[1];
	$("#weekCount").val(1);
	calendarDates('calendarWeek', nd, meetingCategoryText, __bcUserId, __bcBatchId);
	$('#nextVisitMonth').show();
}

// --- Modals appended to body by initBatchCalendar() ---
function batchCalendarModalsHtml() {
	return `
<!-- testing modal code start -->
<div class="modal fade" id="moduleFormModal" role="dialog" aria-labelledby="exampleModalLabel1" data-backdrop="static">
	<div id="lmsStudentContent" class="modal-dialog modal-xl" role="document">
		<div class="modal-content">
			<div class="modal-header py-2 bg-primary">
				<h5 class="modal-title text-white"  >Reschedule Class - <span id="batch-timezone-reschedule"></span></h5>
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<span class="text-white" aria-hidden="true">&times;</span>
				</button>
			</div>
			<div class="modal-body">
				<label for="rescheduleClass" class="full text-left" style="font-size: medium;">Class Details</label>
				<b><p id="scheduleDetails" class="full text-left" style="font-size: small;"></p></b>
				<form autocomplete="off" id="moduleFormId" class="custom-field-scope">
				<input type="hidden" name="subjectId" id="subjectId" value="" />
				<input type="hidden" name="batchName" id="batchName" value="" />
				<input type="hidden" name="courseName" id="courseName" value="" />
				<input type="hidden" name="batchStartDateAsDate" id="batchStartDateAsDate" value="" />
				<input type="hidden" name="batchEndDateAsDate" id="batchEndDateAsDate" value="" />
				<input type="hidden" name="dayId" id="dayId" value="" />
				<input type="hidden" name="batchTeacherMappingId" id="batchTeacherMappingId" value="" />
				<input type="hidden" name="rescheduleClassId" id="rescheduleClassId" value="" />
				<input type="hidden" name="timeZone" id="timeZone" value="" />
				<input type="hidden" name="classDate" id="classDate" value="" />
				<input type="hidden" name="needToAddTimePreferrence" id="needToAddTimePreferrence" value="" />
				<input type="hidden" name="saveForcefully" id="saveForcefully" value="" />
					<div class="row">
						<div class="col-lg-3 col-lg-4 col-md-6 col-sm-12 col-12 mb-1">
							<div class="position-relative form-group custom-field mb-2">
								<input type="text" name="startDate" id="startDate" class="form-control" onchange="hideUploadButton();" required="required" readonly onkeydown="return false" placeholder=" ">
								<label for="startDate" class="mb-0  text-left">Reschedule Date<span class="text-danger">*</span></label>
							</div>
						</div>
						<div class="col-lg-3 col-lg-4 col-md-6 col-sm-12 col-12 mb-1">
							<div class="position-relative form-group custom-field mb-0">
								<input type="text" name="startTime" id="startTime" class="form-control" onchange="hideUploadButton();" required="required" placeholder=" ">
								<label for="startTime" class="mb-0  text-left">Start Time<span class="text-danger">*</span></label>
							</div>
						</div>
						<div class="col-lg-3 col-lg-4 col-md-6 col-sm-12 col-12 mb-1">
							<div class="position-relative form-group custom-field mb-0">
								<input type="text" name="endTime" id="endTime" class="form-control" onchange="hideUploadButton();" required="required" placeholder=" ">
								<label for="endTime" class="mb-0  text-left">End Time<span class="text-danger">*</span></label>
							</div>
						</div>
						<div class="col-lg-3 col-lg-4 col-md-6 col-sm-12 col-12 text-left mb-1">
							<div class="position-relative form-group custom-field mb-2">
								<select class="form-control" name="teacherId" id="teacherId" onchange="hideUploadButton();" required="required"></select>
								<label for="teacherId" class="mb-0  text-left">Teacher Name<span class="text-danger">*</span></label>
							</div>
						</div>
						<div class="col-lg-12 col-lg-12 col-md-12 col-sm-12 col-12 mb-1">
							<div class="position-relative form-group custom-field mb-0">
								<textarea type="text" name="reason" id="reason" class="form-control" maxlength="250"  required="required" placeholder=" "></textarea>
								<label for="reason" class="mb-0  text-left">Reason<span class="text-danger">*</span></label>
							</div>
						</div>
						<div class="full text-center mt-2">
							<button type="button" class="btn btn-primary" onclick="return validateTeacherTimeTableReSchedule();">Validate class</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	</div>
</div>

<div class="modal fade fade-scale" id="booksclassOutsideAvailabilityConfirmationModal" tabindex="-1">
	<div class="modal-dialog modal-lg modal-dialog-centered box-shadow-none" role="document" style="max-width:600px;">
		<div class="modal-content border-primary" style="border-top: 10px solid;">
			<div class="modal-body">
				<div class="text-center text-warning mb-2"><i class="fa fa-exclamation-triangle fa-3x" aria-hidden="true"></i></div>
				<div class="full my-2">
					<p class="text-center mb-1 font-weight-semi-bold text-primary">The class for <span id="studentBatchName"></span> - <span id="courseActivity"></span>will be scheduled<span id="meetingDateTime"></span>. If this class is outside teacher's current availability, it will be added to teacher's availability.
						Do you wish to proceed?</p>
				</div>
			</div>
			<div class="modal-footer justify-content-between">
				<button type="button" class="btn btn-outline-danger" data-dismiss="modal">Cancel</button>
				<button type="button" class="btn btn-outline-success" id="rescheduleConfirm" data-Url="" onclick="">Confirm</button>
			</div>
		</div>
	</div>
</div>

<div class="modal fade" id="remarksresetDelete" tabindex="-1">
	<div class="modal-dialog modal-sm modal-notify modal-danger" role="document">
		<div class="modal-content text-center">
			<div class="modal-header bg-danger justify-content-center" style="top: 0 !important;width:100% !important;background-color:#f44336 !important; padding: 15px 10px;">
				<p class="heading text-white" id="warningMessage">Are you sure?</p>
			</div>
			<div id="statusMessage-1" class="modal-body delete-modal" style="padding-top:12px">
				<i class="fa fa-trash fa-4x" style="color:#f44336 !important;"></i>
			</div>
			<div class="modal-footer text-center">
				<div class="text-center" style="margin: 0 auto;">
					<button id='resetDeleteErrorWarningYes' type="button" class="btn" style="color:#f44336 !important;border:1px solid #f44336 !important;background:transparent !important">Yes</button>
					<button id='resetDeleteErrorWarningNo' type="button" class="btn btn-danger 	" data-dismiss="modal" style="">No</button>
					<button id='resetDeleteErrorWarningCancel' type="button" class="btn btn-default" data-dismiss="modal" style="">Close</button>
				</div>
			</div>
		</div>
	</div>
</div>
<!-- testing modal code end -->
<div class="modal fade" id="recurringClassShowModel"  role="dialog" aria-labelledby="recurringClassShowModelLabel">
	<div class="modal-dialog modal-xl" role="document">
		<div class="modal-content">
			<div class="modal-header py-2 bg-primary">
				<h5 class="modal-title text-white" id="recurringClassShowModelLabel">Teacher's Availability Details</h5>
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<span class="text-white" aria-hidden="true">&times;</span>
				</button>
			</div>
			<div class="modal-body"  style="max-height:480px;margin-top:0 !important; overflow-x:auto">
				<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 p-0">
					<!-- <div class="full" id="availaibilityHeading"><h3>Teacher's Availability Details</h3></div> -->
					<div class="teacherAvailabilityTableWrapper table-responsive">
						<table class="table table-bordered table-striped border-radius-table font-12 nowrap" id="teacherAvailabilityTable" style="display: none;width:100%;min-width: 1000px;">
							<thead class="position-sticky" style="top:0;left:0;z-index: 10;">
								<tr class="bg-primary text-white">
									<th>Teacher Availability</th>
									<th>Class Timing</th>
									<th>Status</th>
								</tr>
							</thead>
							<tbody id="teacherAvailabilityTbody"></tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<div class="modal fade" id="recurringClassShowModelValidation"  role="dialog" aria-labelledby="recurringClassShowModelValidationLabel">
	<div class="modal-dialog modal-xl" role="document">
		<div class="modal-content">
			<div class="modal-header py-2 bg-primary">
				<h5 class="modal-title text-white" id="recurringClassShowModelValidationLabel">Class Validation Details</h5>
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<span class="text-white" aria-hidden="true">&times;</span>
				</button>
			</div>
			<div class="modal-body"  style="max-height:480px;margin-top:0 !important; overflow-x:auto">
				<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 p-0" id="teacherAvailabilityWarningTitle"></div>
				<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 p-0">
					<!-- <div class="full"><h3>Class Validation Details</h3></div> -->
					<div style="width:100%;">
						<table class="table table-bordered nowrap" >
							<thead>
								<tr>
									<th style="text-align: center; font-weight: bold">S.No</th>
									<th  style="font-weight: bold">Subject Name</th>
									<th  style="font-weight: bold">Teacher Name</th>
									<th  style="font-weight: bold">Teacher Meeting Time</th>
									<th  style="font-weight: bold">Availability Status</th>
									<th  style="font-weight: bold">Reason of Availability Status</th>
								</tr>
							</thead>
							<tbody id="trRecurring"></tbody>
						</table>
					</div>
				</div>
			</div>
			<div class="modal-footer">
				<button type="button"  class="btn btn-primary updateBatchBtn" onclick="validateBatchOutsideAvailabilityConfirmationModalReschedule('reschedule')">Update</button>
			</div>
		</div>
	</div>
</div>
<div class="modal fade" id="classCancelModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header bg-primary py-2">
                <p class="modal-title text-white" >Cancel Class</p>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span class="text-white" aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body custom-field-scope">
				<label for="classCancelReason" class="text-left" style="font-size: medium;">Class Details</label>
				<b><p id="classDetails" class="full text-left" style="font-size: small;"></p></b>
                <div class="full position-relative form-group custom-field mb-0">
					<textarea class="form-control" name="classCancelReason" id="classCancelReason" maxlength="250" rows="3" style="resize: none;" required placeholder=" "></textarea>
					<label for="classCancelReason" class="text-left">Cancel Class Reason<span class="text-danger">*</span></label>
				</div>
				<div class="full text-center">
					<button type="button" class="btn btn-danger " onclick="cancelClass('cancel')">Yes</button>
					<button type="button" class="btn btn-outline-success" data-dismiss="modal">No</button>
				</div>
            </div>
        </div>
    </div>
</div>
`;
}

// --- Action functions carried forward from the legacy inline script ---
	function validateBatchOutsideAvailabilityConfirmationModalReschedule(status){
		var batchName = $("#batchName").val();
		var courseName = $("#courseName").val();
		var rescheduleDate = $("#startDate").val();
		var hour = $("#startTime").val().split(":")[0];
		var mins = $("#startTime").val().split(":")[1];
		var amPm = " AM"
		if(hour >= 12){
			if(hour != 12){
				hour = hour-12;
			}
			amPm = " PM"
		}
		rescheduleDate = rescheduleDate+" at "+hour+":"+mins
		let data = {}
		if(status == 'reschedule'){
			if($("#reason").val() == undefined || $("#reason").val() == ''){
				showMessageTheme2(0,'Reason is required');
				return false;
			}
            data.subjectId = $("#subjectId").val();
            data.teacherId = $("#teacherId").val();
            data.startDate = $("#startDate").val();
            data.startTime = $("#startTime").val();
            data.endTime = $("#endTime").val();
			data.reason = $("#reason").val();
        }else{
			if($("#classCancelReason").val() == undefined || $("#classCancelReason").val() == ''){
				showMessageTheme2(0,'Reason is required');
				return false;
			}
			data.reason = $("#classCancelReason").val();
		}
		if(rescheduleDate != undefined && rescheduleDate != ""){
			$("#meetingDateTime").text(" for "+rescheduleDate+amPm);
		}
		if(batchName != undefined && batchName != ""){
			$("#studentBatchName").text(batchName);
		}
		if(courseName != undefined && courseName != ""){
			$("#courseActivity").text(courseName);
		}
		$("#booksclassOutsideAvailabilityConfirmationModal").modal("show");
		var saveForcefully = $("#saveForcefully").val();
		// var needToAddTimePref = $("#needToAddTimePreferrence").val();
		// if(needToAddTimePref=='true'){
		// 	$("#rescheduleConfirm").hide();
		// }else{
		// 	$("#rescheduleConfirm").show();
		// }
		if(saveForcefully=='Y'){
			$("#rescheduleConfirm").show();
		}
		var fun = "cancelClass('"+status+"')"
		$("#rescheduleConfirm").attr("onclick", fun)
	}

	function cancelClass(status){
		let data = {}
        if(status == 'reschedule'){
			data.subjectId = $("#subjectId").val();
            data.teacherId = $("#teacherId").val();
            data.startDate = $("#startDate").val();
            data.startTime = $("#startTime").val();
            data.endTime = $("#endTime").val();
			data.reason = $("#reason").val();
        }else{
			data.reason = $("#classCancelReason").val();
		}
        data.batchTeacherMappingId = $("#batchTeacherMappingId").val();;
        
        data.rescheduleClassId = $("#rescheduleClassId").val();
        data.status = status;
        data.classCancelDate = $("#classDate").val();
        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: getURLForHTML('dashboard','class-cancel-and-reschedule'),
            data: JSON.stringify(data),
            dataType: 'json',
            cache: false,
            timeout: 600000,
            success: function (data) {
				$("#booksclassOutsideAvailabilityConfirmationModal").modal("hide");
                if (data['status'] == '0' || data['status'] == '2') {
                    showMessageTheme2(0, data['message']);
                } else {
                    showMessageTheme2(1, data['message']);
                    $("#classCancelModal, #moduleFormModal, #recurringClassShowModelValidation").modal("hide");
                    setTimeout(function () { $(".modal-backdrop").remove(); $("body").removeClass("modal-open").css("padding-right", ""); }, 300);
                    calendarDates('calendarWeek', __bcCurrentCalendarStartDate || $("#classDate").val(), __bcCurrentCalendarSlotType || $("#dateCategory").val(), __bcUserId, __bcBatchId);
                }
            }
        });
    }

	function getTeacherBySubjectId(subjectId, teacherId) {
		hideMessage('');
		resetDropdown($("#teacherId"), 'Select Teacher');
		$.ajax({
			type: "POST",
			contentType: "application/json",
			url: getURLForCommon('masters'),
			//data : JSON.stringify(getRequestForMaster('formId', 'TEACHER-LIST-BY-SUBJECT-ID', subjectId)),
			data: JSON.stringify(getRequestForMaster('formId', 'TEACHER_LIST', SCHOOL_ID)),
			dataType: 'json',
			cache: false,
			timeout: 600000,
			success: function (data) {
				if (data['status'] == '0' || data['status'] == '2') {
					showMessage(true, data['message']);
				} else {
					//buildDropdown(data['mastersData']['courseList'], $("#"+formId+" #"+toElementId), 'Select course');
					var result = data['mastersData']['data'];
					var dropdown = $("#teacherId");
					dropdown.html('');
					dropdown.append('<option value="0">Select teacher</option>');
					$.each(result, function (k, v) {
						dropdown.append('<option value="' + v.extra + '">' + v.value + '</option>');
					});
					$("#teacherId").val(teacherId).trigger('change');	
				}
			}
		});
	}

	function getTeacherBySubjectIdAndDateTime(){
		let data = {
				// 'teacherId' : teacherId,
				'subjectId' : $("#subjectId").val(),
				'startDate' : $("#startDate").val(),
				'endDate' : $("#startDate").val(),
				'startTime' : $("#startTime").val(),
				'endTime' : $("#endTime").val()
			}
		$.ajax({
			type: "POST",
			contentType: "application/json",
			url: getURLForHTML('dashboard','reschedule-teacher-list'),
			data: JSON.stringify(data),
			dataType: 'json',
			cache: false,
			timeout: 600000,
			success: function (data) {
				if (data['status'] == '0' || data['status'] == '2') {
					showMessage(true, data['message']);
				} else {
					let html = "<option value='0'>Select Teacher Name</option>";
					data.teacherList.forEach((k,v)=>{
						html += "<option value='"+k.id+"'>"+k.teacherName+"</option>";
					})
					$("#teacherId").html(html);
				}
			}
		});
	}
	function convertUTCtoLocal(utcDate) {
		var selectedTimezone = ($("#timeZone").val() != null || $("#timeZone").val() != undefined) ? $("#timeZone").val() : BASE_TIMEZONE;
		var options = { timeZone: selectedTimezone };
		var localDate = new Date(utcDate.toLocaleString('en-US', options));
		return localDate;
	}

	function rescheduleContentModal(rescheduleClassId,batchTeacherMappingId,subjectId, classDate, dayId, batchStartDate, batchEndDate, batchName, courseName, scheduleTime, teacherName, showDate, timeZone, teacherId){
		console.table(subjectId,classDate);
		$("#batchTeacherMappingId").val(batchTeacherMappingId);
		$("#rescheduleClassId").val(rescheduleClassId);
		$("#subjectId").val(subjectId);
		$("#classDate").val(classDate);
		$("#dayId").val(dayId);
		$("#batchStartDateAsDate").val(batchStartDate);
		$("#batchEndDateAsDate").val(batchEndDate);
		$("#timeZone").val(timeZone);
		$("#batch-timezone-reschedule").text($("#batch-timezone").text());
		$('#moduleFormModal #startDate').val('');
		$('#moduleFormModal #endDate').val('');
		$('#moduleFormModal #startTime').val('');
		$('#moduleFormModal #endTime').val('');
		//$('#moduleFormModal #teacherId').val(teacherId);
		$('#moduleFormModal #teacherId').val('')
		$('#moduleFormModal #reason').val('');
		$("#rescheduleConfirm").hide();
		$("#startDate").datepicker("destroy");
		// var startDate = $("#batchStartDateAsDate").val().split("-");
		// startDate = new Date(startDate[0], parseInt(startDate[1]-1), parseInt(startDate[2]));
		let details = batchName + " | " + courseName + " | " + showDate + " | " + scheduleTime + " | " + teacherName;
		$("#scheduleDetails").html(details);
		$("#batchName").val(batchName);
		$("#courseName").val(courseName);
		var endDate = $("#batchEndDateAsDate").val().split("-");
		endDate = new Date(endDate[0], parseInt(endDate[1]-1), parseInt(endDate[2]));
		var newdate = new Date();
		newdate.setDate(newdate.getDate() - 1); // minus the date
		var startDate = convertUTCtoLocal(newdate);

		$("#startDate").datepicker({
			autoclose: true,
			startDate : startDate,
			endDate : endDate,
			format : 'mm-dd-yyyy',
		}).on("changeDate", function(e){
			startDate = convertUTCtoLocal(new Date())
			var selectedDate = e.date;
			var todayDate = startDate;
			if(selectedDate.toDateString() === today.toDateString()){ 
				disablePastTimes("startTime", "endTime", startDate);
			}else{
				$('#startTime').timepicker({
					format:'HH:mm',
				});
			}
		});
		$('#moduleFormModal').modal('show');	
		getTeacherBySubjectId(subjectId, teacherId);
	}

	function getRequestForBatchTeacherTimeReSchedule(batchTeacherMappingId, subjectId, teacherId, elementId, subjectPId, batchId) {
		var request = {};
		var authentication = {};
		var batchTeacherMappingDTO = {}
		var batchTeacherSavedMappingDTO = [];
		var daysIds = "";
		var is = 0;
		batchTeacherMappingDTO['firstBatchTeacherMappingId'] = $("#batchTeacherMappingId").val();
		batchTeacherMappingDTO['batchStartDate'] = $("#batchStartDate").val();
		batchTeacherMappingDTO['batchEndDate'] = $("#batchEndDate").val();
		batchTeacherMappingDTO['batchId'] = $("#batchId").val();
		batchTeacherMappingDTO['subjectId'] = $("#subjectId").val();
		batchTeacherMappingDTO['subjectPId'] = $("#subjectId").val();
		batchTeacherMappingDTO['oldTeacherId'] = $("#teacherId").val();
		batchTeacherMappingDTO['newTeacherId'] = $("#teacherId").val();
		batchTeacherMappingDTO['steachStartDate'] = $("#startDate").val();
		batchTeacherMappingDTO['steachEndDate'] = $("#startDate").val();

		var batchTeacherSavedMapping = {};
		batchTeacherSavedMapping['batchTeacherMappingId'] = $("#batchTeacherMappingId").val();
		// batchTeacherSavedMapping['dayId'] = $("#dayId").val();
		batchTeacherSavedMapping['scheduleTime'] = $("#startTime").val()+"-"+$("#endTime").val();
		batchTeacherSavedMappingDTO.push(batchTeacherSavedMapping);

		batchTeacherMappingDTO['batchTeacherSavedMappingList'] = batchTeacherSavedMappingDTO;
		request['batchTeacherMapping'] = batchTeacherMappingDTO;
		authentication['hash'] = getHash(); authentication['schoolId'] = SCHOOL_ID; authentication['schoolUUID'] = SCHOOL_UUID;
		authentication['userType'] = moduleId;
		authentication['userId'] = USER_ID;
		request['authentication'] = authentication;
		request['isClassReschedule'] = true;
		console.log("payload")
		return request;
	}

	function validateTeacherTimeTableReSchedule() {
		console.log("request")
		if (!validateRequestBatchRescheduleTeacherTime()) {
			return false;
		}
		$.ajax({
			type: "POST",
			contentType: "application/json",
			url: getURLForHTML('dashboard', 'validate-teacher-batch-time-schedule'),
			data: JSON.stringify(getRequestForBatchTeacherTimeReSchedule()),
			dataType: 'json',
			cache: false,
			//timeout : 600000,
			success: function (data) {
				if (data['status'] == '0' || data['status'] == '2') {
					showMessageTheme2(0, data['message']);
					// $("#rescheduleConfirm").show();
				} else {
					var recurringclassForAA = data['recurringClassListForAvailability'];
					if(recurringclassForAA.length>0){
						$("#teacherAvailabilityWarningTitle").html(`<h5 class="text-center bold text-danger">This slot is not in teacher's availability. If you book this class a date-specific availability will be created for this date.</h5>`);
					}else{
						$("#teacherAvailabilityWarningTitle").html(``);
					}
					//teacherMappingSetTime
					var saveForcefully= data['saveForcefully'];
					// var recurringclassForAA = data['recurringClassListForAvailability'];
					// if(recurringclassForAA.length>0){
					// 	$("#needToAddTimePreferrence").val(true);
					// 	$("#teacherAvailabilityTable").show();
					// 	var html='';
					// 	for(var k=0; k < recurringclassForAA.length; k++){
					// 		html+=`<tr class='text-danger'>
					// 				<td>`+recurringclassForAA[k]['teacherTime']+`</td>
					// 				<td>`+recurringclassForAA[k]['meetingDate']+`</td>
					// 				<td>`+recurringclassForAA[k]['slotAvailableReason']+`</td>
					// 			</tr>`;
					// 	}
					// 	$("#teacherAvailabilityTable #teacherAvailabilityTbody").html(html);
					// 	$("#rescheduleConfirm").hide();
					// }else{
					// 	$("#teacherAvailabilityTable").hide();
					// 	$("#needToAddTimePreferrence").val(false);
					// }
					
					// if(saveForcefully=='Y'){
					// 	$("#rescheduleConfirm").show();
					// }
					$("#saveForcefully").val(saveForcefully);
					
					
					var recurringclass = data['recurringClassList'];
					var htmlRecu = "";
					var inc = 1;
					var validateClass = true;
					for (var i = 0; i < recurringclass.length; i++) {
						if (recurringclass[i]['slotAvailable'] != 'Available' || recurringclass[i]['slotAvailableBatch'] != 'Available') {
							$("#teacherAvailabilityWarningTitle").html(``);
							$(".updateBatchBtn").hide();
							htmlRecu = htmlRecu + "<tr class='text-danger'>";
						} else {
							htmlRecu = htmlRecu + "<tr>";
							$(".updateBatchBtn").show();
						}
						htmlRecu = htmlRecu + " <td>" + (inc++) + "</td>";

						htmlRecu = htmlRecu + " <td>" + recurringclass[i]['subjects'] + "</td>";
						htmlRecu = htmlRecu + " <td>" + recurringclass[i]['teachName'] + "</td>";

						htmlRecu = htmlRecu + " <td>" + recurringclass[i]['teacherTime'] + "</td>";
						if (recurringclass[i]['slotAvailableBatch'] != 'Available') {
							htmlRecu = htmlRecu + " <td>" + recurringclass[i]['slotAvailableBatch'] + "</td>";
						} else {
							htmlRecu = htmlRecu + " <td>" + recurringclass[i]['slotAvailable'] + "</td>";
						}
						if (recurringclass[i]['slotAvailableBatch'] != 'Available') {
							htmlRecu = htmlRecu + " <td>" + recurringclass[i]['reason'] + "</td>";
						} else {
							htmlRecu = htmlRecu + " <td>" + recurringclass[i]['studentName'] + "</td>";
						}
						htmlRecu = htmlRecu + "</tr>";
						if (recurringclass[i]['slotAvailable'] != 'Available' || recurringclass[i]['slotAvailableBatch'] != 'Available') {
							validateClass = false;
						}
					}
					if (validateClass) {
						$("#rescheduleConfirm").show();
					} else {
						$("#rescheduleConfirm").hide();
					}
					$("#trRecurring").html(htmlRecu);
					
					$("#recurringClassShowModelValidation").modal('show');
				}

			}
		});
	}


	function validateRequestBatchRescheduleTeacherTime(subjectId, elementId) {
		if ($("#startDate").val() == undefined || $("#startDate").val() == '') {
			showMessageTheme2(0, 'Please enter reschedule date.');
			return false;
		}

		var stDate = $("#startDate").val();
		if($("#startTime").val() == undefined || $("#startTime").val() == ''){
			showMessageTheme2(0, 'Please enter start time.');
			return false;
		}
		if($("#endTime").val() == undefined || $("#endTime").val() == ''){
			showMessageTheme2(0, 'Please enter end time.');
			return false;
		}
		var startDateTime = new Date($("#startDate").val()+' '+$("#startTime").val());
		var endDateTime = new Date($("#startDate").val()+' '+$("#endTime").val());
		var endTimeForValidation = $("#endTime").val();
		if(endTimeForValidation.startsWith('00') && !$("#startTime").val().startsWith('00')){
			var nextDay = new Date($("#startDate").val()+' '+$("#endTime").val());
			nextDay.setDate(nextDay.getDate() + 1);
			endDateTime = new Date(nextDay);
		}
		var currentDate = convertUTCtoLocal(new Date());
		if(currentDate.getTime() >= startDateTime.getTime()){
			showMessageTheme2(0, 'Start time should be greater than batch current time');
			return false;
		}
		if(startDateTime.getTime() >= endDateTime.getTime()){
			showMessageTheme2(0, 'End time should be greater than class start time');
			return false;
		}
		if($("#teacherId").val() == undefined || $("#teacherId").val() == '' || $("#teacherId").val() == 0){
			showMessageTheme2(0, 'Please select teacher');
			return false;
		}
		return true;
	}

	function cancelClassModal(rescheduleClassId,batchTeacherMappingId, classCancelDate, batchName, courseName, time, teacherName, showDate){
        $("#batchTeacherMappingId").val(batchTeacherMappingId);
        $("#rescheduleClassId").val(rescheduleClassId);
        $("#classDate").val(classCancelDate);
		let title = batchName + " | " + courseName + " | " + showDate + " | " + time + " | " + teacherName;
		$("#classDetails").html(title);
		$("#classCancelReason").val('');
        $("#classCancelModal").modal("show");
    }

		function sendMailClass(batchTeacherMappingId, classCancelDate, status){
			var ssts = status.split("-")[1];
			showWarningMessageShow("Are you sure you want to send "+ssts+" mail?","sendMailCancelClass('"+status+"','"+batchTeacherMappingId+"','"+classCancelDate+"')");
		}

	function hideUploadButton(){
		$("#rescheduleConfirm").hide();
	}

	
