var GLOBAL_EVENTS=[];
function parentStudentClassScheduleContentLoadEvent(){
    $("#startDate").datepicker({
        autoclose: true,
        format: 'M d, yyyy',
        container: 'body',
    });
    $("#endDate").datepicker({
        autoclose: true,
        format: 'M d, yyyy',
        container: 'body',
    });
    if(typeof getSlidesToShow === "function" && $('.user-slider').length){
        $('.user-slider').slick({
            slidesToShow:getSlidesToShow(),
            slidesToScroll:1,
            infinite:false,
            arrows:true,
            responsive:[
                {breakpoint:992, settings:{slidesToShow:3}},
                {breakpoint:768, settings:{slidesToShow:2}},
                {breakpoint:576, settings:{slidesToShow:1}}
            ]
        });
    }
    calendarTimeInterval("Asia/Singapore");
}

function getRequestForSchoolCalendar(userId, UNIQUEUUID, viewName, startdate, enddate) {
	if(startdate=='' || startdate==undefined){
		startdate = todayDate();
	}
	if(enddate=='' || enddate==undefined){
		enddate = todayDate();
	}
	var schoolCalendarRequestDTO = {};
	schoolCalendarRequestDTO['studentUserId'] =userId;
	schoolCalendarRequestDTO['startDate']=changeDateFormat(new Date(moment(moment(startdate)).add(-1,'days')),'yyyy-mm-dd');
	if(viewName=='agendaDay'){
		schoolCalendarRequestDTO['endDate']=changeDateFormat(new Date(moment(moment(startdate)).add(1,'days')),'yyyy-mm-dd');
	}else{
		schoolCalendarRequestDTO['endDate']=changeDateFormat(new Date(moment(moment(enddate)).add(1,'days')),'yyyy-mm-dd');
	}
	return schoolCalendarRequestDTO;
}

function todayDate(){
	var d = new Date($("#currentTimeForUser").text());
	var day = d.getDate();
	var month = d.getMonth() + 1;
	var year = d.getFullYear();
	if (day < 10) {
		day = "0" + day;
	}
	if (month < 10) {
		month = "0" + month;
	}
	var date = year + "-" + month + "-" + day;
	return date;
}

async function viewCalender(src, calendarView){
    if(calendarView != "custom"){
        CALENDERVIEW=calendarView;
        $(".calendar-view-button").removeClass("active");
        $(src).addClass("active");
    }
    var studentId = $(".calendar-view-button").attr("data-student-id");
    renderClassesListing(studentId)
}

function showCustomCalendarFilterForm(src){
    CALENDERVIEW="custom"
    $(".calendar-view-button").removeClass("active");
    $(src).addClass("active");
    $(".custom-calendar-filter-form").show();   
}

async function renderClassesListing(studentId){
    ACTIVE_STUDENT_ID=studentId;
    CLASS_COUNT=0;
    ACTIVITY_COUNT=0;
    SUTDENT_ID = studentId;
    $(".student-thumb").removeClass("active-student");
    $(".student-"+studentId).addClass("active-student");
    $(".calendar-view-button").attr("data-student-id",SUTDENT_ID);
    var response  = await callSchoolCalendar(studentId, UNIQUEUUID, CALENDERVIEW);
    GLOBAL_EVENTS = response.events;
    setInterval(function(){
        updateEventStatuses(response);
        calendarTimeInterval("Asia/Singapore");
    }, 1000);

    
    renderClassScheduleTable(response.events,response.startDate,response.endDate);
    console.log(response.events)
}

async function callSchoolCalendar(studentId){
    if(CALENDERVIEW == "agendaDay"){
        var startDate = new Date();
        var startFormatted = moment(startDate).format('YYYY-MM-DD');
        var endDate = moment(startDate).add(1, 'days');
        var endFormatted = endDate.format('YYYY-MM-DD');
    }else if(CALENDERVIEW == "agendaWeek"){
        var today = moment();
        var weekStartDate = today.clone().startOf('week');  // Sunday
        var weekEndDate = today.clone().endOf('week');      // Saturday
        var startFormatted = weekStartDate.format('YYYY-MM-DD');
        var endFormatted = weekEndDate.format('YYYY-MM-DD');
    }else if(CALENDERVIEW == "custom"){
        var startDate = new Date($("#startDate").val());
        var startFormatted = moment(startDate).format('YYYY-MM-DD');
        var endDate = new Date($("#endDate").val());
        var endFormatted = moment(endDate).format('YYYY-MM-DD');
    }
    if(CALENDERVIEW != "custom"){
        $(".custom-calendar-filter-form").hide();  
    }
    var payload = getRequestForSchoolCalendar(studentId,'', CALENDERVIEW, startFormatted, endFormatted);
    var ajaxReqDetails = {
        method: "POST",
        url: APP_BASE_URL + SCHOOL_UUID + "/dashboard/parent/student-schedule",
        body: payload,
        global: true,
        showMessage: false,
        onFaildResolved: true,
        onSuccessResolved: true
    }
    var eventList = await callCommonAjax(ajaxReqDetails);
    var _studentList = (typeof STUDENT_LIST !== "undefined") ? STUDENT_LIST : null;
    var _activeStudent = _studentList?.studentBasicDetails?.find(s => s.userId == ACTIVE_STUDENT_ID);
    var timeZoneFlag = _activeStudent?.countryISOCode || ''
    $("#countryFlag").attr("src", PATH_FOLDER_FONT2+timeZoneFlag+".svg").show();
    $(".user_timezone").html(`<label>${_activeStudent?.studentTimezone || moment.tz.guess()}&nbsp;</label>`)
    var finalEvents=[];
    var events = eventList.details.schedule || [];

    if(events.length>0){
        events.forEach(obj => {
            if(obj.id.startsWith("announce", 0) || obj.id.startsWith("holiday", 0)){
                finalEvents.push(obj);
            }
            else{
                var activeStudentTimezone = _activeStudent?.studentTimezone || moment.tz.guess();
                obj.start = convertDatetimeWithFormat(obj.start, obj.timezone, activeStudentTimezone, DATE_UTC+'T'+TIME_UTC);
                obj.end = convertDatetimeWithFormat(obj.end, obj.timezone, activeStudentTimezone, DATE_UTC+'T'+TIME_UTC);
                ACTIVITY_CLASS_START_TIME.push({"startTime":obj.start.replace("T", " "), "endTime":obj.end.replace("T", " "), "title":"class"});
                var baseDate=obj.start.split('T')[0];
                if($.inArray(baseDate)){
                    finalEvents.push(obj);
                }
            }
        });
    };
    CALENDAR_EVENT_DATA = finalEvents;
    if(CALENDERVIEW == "agendaDay"){
        endFormatted = moment(endFormatted).subtract(1, 'days').format('YYYY-MM-DD');
    }

    return {
        events: finalEvents,
        startDate: startFormatted,
        endDate: endFormatted
    };
}

// Submit Feedback button -> reuse the shared class-feedback flow (feedbackStudentTeacher.js).
// openClassFeedback() refreshes FEEDBACK_WEBHOOK, hits get-feedback-submission and shows
// the embed iframe with the respondent + webhook params attached.
function openParentStudentClassFeedback(eventId) {
    var event = GLOBAL_EVENTS.find(function (e) { return (e.id + "") === (eventId + ""); });
    if (!event) return;

    openClassFeedback({
        eventId: event.entityId,
        eventType: event.type,
        eventTitle: event.courseName,
        teacherName: event.teacherName,
        start: { _i: event.start }
    });
}

function updateEventStatuses() {

    $("#schoolcalendarTable tbody tr[data-event-id]").each(function(){

        var eventId = $(this).data("event-id");

        var event = GLOBAL_EVENTS.find(e => e.id == eventId);
        if(event){
            var newStatus = getStatusBadge(getEventStatus(event));
            $(this).find(".status-cell").html(newStatus);
        }

    });
}

// function callSchoolCalendar1(userId, UNIQUEUUID) {
//     if(CALENDERVIEW == "agendaDay"){
//         var startDate = new Date();
//         var startFormatted = moment(startDate).format('YYYY-MM-DD');
//         var endDate = moment(startDate).add(1, 'days');
//         var endFormatted = endDate.format('YYYY-MM-DD');
//     }else if(CALENDERVIEW == "agendaWeek"){
//         var today = moment();
//         var weekStartDate = today.clone().startOf('week');  // Sunday
//         var weekEndDate = today.clone().endOf('week');      // Saturday
//         var startFormatted = weekStartDate.format('YYYY-MM-DD');
//         var endFormatted = weekEndDate.format('YYYY-MM-DD');
//     }else if(CALENDERVIEW == "custom"){
//         var startDate = new Date($("#startDate").val());
//         var startFormatted = moment(startDate).format('YYYY-MM-DD');
//         var endDate = new Date($("#endDate").val());
//         var endFormatted = endDate.format('YYYY-MM-DD');
//     }
    
//     if(CALENDERVIEW != "custom"){
//         $(".custom-calendar-filter-form").hide();  
//     }
// 	return new Promise((resolve, reject) => {
//         $.ajax({
//             type: "POST",
//             contentType: APPLICATION_JSON_VALUE,
//             url: getURLForHTML('dashboard', 'school-calendar'),
//             data: JSON.stringify(getRequestForSchoolCalendar(userId, UNIQUEUUID, CALENDERVIEW, startFormatted, endFormatted)),
//             dataType: 'json',
//             cache: false,
//             timeout: 600000,
//             async: true,
//             success: function (data) {
//                 if (data.status === '0' || data.status === '2') {
//                     showMessageTheme2(0, data.message);
//                     resolve([]); // return empty array if error
//                 } else if (data.status === '3') {
//                     redirectLoginPage();
//                     reject('Redirected to login');
//                 } else {
// 					var finalEvents=[];
//                     var events = data.event || [];
// 					if(events.length>0){
						
// 						// events.sort((a, b) => new Date(a.start) - new Date(b.start));
// 						events.forEach(obj => {
// 							if(obj.id.startsWith("announce", 0) || obj.id.startsWith("holiday", 0)){
// 								finalEvents.push(obj);
// 							}
//                             else{
// 								obj.start = convertDatetimeWithFormat(obj.start, obj.timezone, USER_TIMEZONE, DATE_UTC+'T'+TIME_UTC);
// 								obj.end = convertDatetimeWithFormat(obj.end, obj.timezone, USER_TIMEZONE, DATE_UTC+'T'+TIME_UTC);
// 								ACTIVITY_CLASS_START_TIME.push({"startTime":obj.start.replace("T", " "), "endTime":obj.end.replace("T", " "), "title":"class"});
// 								var baseDate=obj.start.split('T')[0];
// 								if($.inArray(baseDate,data.holidays)<0){
// 									finalEvents.push(obj);
// 								}
// 							}
// 						});
// 					};
// 					CALENDAR_EVENT_DATA = finalEvents;
					
// 					resolve(finalEvents); // return event array
//                     // console.log(finalEvents)
					
					
// 					ISCALENDARLOAD=false;
// 				}
//             }
//         });
//     });
// }


function formatDateHeading(dateStr) {
    return moment(dateStr).format("dddd, MMM DD, YYYY");
}

function formatTimeRange(start, end) {
    var s = moment(start).format("hh:mm A");
    var e = moment(end).format("hh:mm A");
    var duration = moment(end).diff(moment(start), 'minutes');
    return s + " to " + e + " | " + duration + " min";
}

function getEventStatus(event) {

    var currentTimeStr = $("#currentTimeForUser").text().trim(); 
    var now = moment(
        currentTimeStr,
        "MMM DD, YYYY hh:mm:ss a",
        true   // strict parsing (recommended)
    );

    var start = moment(event.start);
    var end = moment(event.end);

    if (now.isBefore(start)) {
        return "Upcoming";
    } 
    else if (now.isSameOrAfter(start) && now.isSameOrBefore(end)) {
        return "Live";
    } 
    else {
        var attendance = (event.classesAttendance || "").toString().trim().toLowerCase();
        if (attendance === "attended" || attendance === "attending") {
            return "Completed";
        }
        var rawStatus = (event.classStatus || "").toString().trim();
        return rawStatus !== "" ? rawStatus : "Not Started";
    }
}

function getStatusBadge(status) {

    if (status === "Live") {
        return `
        <div class="badge-pill bg-light-success text-success font-12 font-weight-semi-bold w-fit-content">
            <span class="badge badge-dot badge-dot-lg badge-success badge-pulse mr-1">Badge</span>
            Live
        </div>`;
    }

    if (status === "Upcoming") {
        return `
        <div class="badge-pill bg-light-warning text-dark font-12 font-weight-semi-bold w-fit-content">
            <span class="badge badge-dot badge-dot-lg badge-warning mr-1">Badge</span>
            Upcoming
        </div>`;
    }

    if (status === "Completed") {
        return `
        <div class="badge-pill bg-light text-gray font-12 font-weight-semi-bold w-fit-content">
            <span class="badge badge-dot badge-dot-lg badge-gray mr-1">Badge</span>
            Completed
        </div>`;
    }

    if (status === "Not Started") {
        return `
        <div class="badge-pill bg-light-danger text-danger font-12 font-weight-semi-bold w-fit-content">
            <span class="badge badge-dot badge-dot-lg badge-danger mr-1">Badge</span>
            Not Started
        </div>`;
    }

    if (status !== "") {
        return `
        <div class="badge-pill bg-light text-gray font-12 font-weight-semi-bold w-fit-content">
            <span class="badge badge-dot badge-dot-lg badge-gray mr-1">Badge</span>
            ${status}
        </div>`;
    }

    return `
        <div class="badge-pill bg-light-warning text-dark font-12 font-weight-semi-bold w-fit-content">
            <span class="badge badge-dot badge-dot-lg badge-warning mr-1">Badge</span>
            Upcoming
        </div>`;
}

function parentStudentCalendarRequestByFilter(src){
    $(".calendar_request_button").removeClass("active_calendar_catergory")
	$(src).addClass("active_calendar_catergory");
    var filterType = $(src).attr("data-category");
    if(filterType == "CLASS"){
        $(".even-row").hide();
        $("."+filterType+"-row").show();
    }else if(filterType == "ACTIVITY"){
        $(".even-row").hide();
        $("."+filterType+"-row").show();
    }else if(filterType == "ALL"){
        $(".even-row").show();
    }
}

async function showClassMeetingSummary(meetingId, eventId, eventInstanceKey){
    parentStudentClassScheduleEnsureSummaryModal();
    $("#parentStudentClassSummaryModalBody").html(getParentStudentClassSummaryLoadingHtml());
    $("#parentStudentClassSummaryModal").modal("show");

    var payload = {meetingId: meetingId + ""};
    var ajaxReqDetails = {
        method: "POST",
        url: APP_BASE_URL + SCHOOL_UUID + "/dashboard/parent/student-class-summary",
        body: payload,
        global: true,
        showMessage: false,
        onFaildResolved: true,
        onSuccessResolved: true
    };

    try{
        var response = await callCommonAjax(ajaxReqDetails);
        var details = response && response.details ? response.details : {};
        details = parentStudentClassScheduleNormalizeSummaryResponse(details);
        var eventMeta = parentStudentClassScheduleGetEventMeta(meetingId, eventId, eventInstanceKey);
        if(!details || $.isEmptyObject(details)){
            $("#parentStudentClassSummaryModalBody").html(getParentStudentClassSummaryNoDataHtml("No class summary found."));
            return;
        }
        $("#parentStudentClassSummaryModalBody").html(parentStudentClassScheduleSummaryBodyHTML(details, eventMeta));
    }catch(err){
        $("#parentStudentClassSummaryModalBody").html(getParentStudentClassSummaryNoDataHtml("Unable to load class summary."));
        showMessageTheme2(0, "Unable to load class summary.");
    }
}

function parentStudentClassScheduleEnsureSummaryModal(){
    if($("#parentStudentClassSummaryModal").length < 1){
        $("body").append(getParentStudentClassSummaryRightSlideModal());
    }
}

function parentStudentClassScheduleSummaryBodyHTML(details, eventMeta){
    var _sl = (typeof STUDENT_LIST !== "undefined") ? STUDENT_LIST : null;
    var activeStudent = (_sl && _sl.studentBasicDetails ? _sl.studentBasicDetails : []).find(function(s){
        return (s.userId + "") === (ACTIVE_STUDENT_ID + "");
    }) || {};

    var studentName = parentStudentClassScheduleSafe(details.studentName || details.userName || details.childName || activeStudent.studentName, "N/A");
    var studentId = parentStudentClassScheduleSafe(details.studentId || details.userId || details.studentUserId || activeStudent.userId, "N/A");
    var studentImage = parentStudentClassScheduleSafe(details.profilePic || details.studentProfilePic || activeStudent.profilePic, PATH_FOLDER_FONT2 + "dummy-user.png");
    var attendanceStatus = parentStudentClassScheduleSafe(details.attendanceStatus || details.classAttendanceStatus || "Present", "Present");

    var subject = parentStudentClassScheduleSafe((eventMeta.subjectName || details.subjectName || details.courseName || ""),"N/A");
    var teacher = parentStudentClassScheduleSafe(eventMeta.teacherName || details.teacherName || details.hostName, "N/A");
    var classDate = parentStudentClassScheduleSafe(eventMeta.classDate || details.classDate || details.date, "N/A");
    var classTime = parentStudentClassScheduleSafe(eventMeta.classTime || details.classTime || details.time || details.classTiming, "N/A");
    var classDuration = parentStudentClassScheduleSafe(eventMeta.classDuration || details.classDuration || details.duration, "N/A");
    var attendanceRate = parentStudentClassScheduleSafe(details.attendanceRate || details.attendancePercentage, "N/A");
    var totalClassDuration = parentStudentClassScheduleSafe(eventMeta.totalClassDuration || details.totalClassDuration || details.totalDuration, "N/A");

    var classStartTime = parentStudentClassScheduleSafe(eventMeta.classStartTime || details.classStartTime || details.startTime, "N/A");
    var studentJoined = parentStudentClassScheduleSafe(eventMeta.studentJoined || details.studentJoinedTime || details.studentJoinTime || details.joinedTime, "N/A");
    var studentLeft = parentStudentClassScheduleSafe(eventMeta.studentLeft || details.studentLeftTime || details.studentLeaveTime || details.leftTime, "N/A");
    var classEndTime = parentStudentClassScheduleSafe(eventMeta.classEndTime || details.classEndTime || details.endTime, "N/A");

    var summarySections = parentStudentClassScheduleGetSummarySections(details);
    var summaryHTML = summarySections.length ? summarySections.map(function(section){
        return `
            <div class="mb-3">
                <h6 class="font-16 font-weight-bold">${parentStudentClassScheduleEscapeHtml(section.title)}</h6>
                <div class="font-14">${parentStudentClassScheduleParagraphs(section.content)}</div>
            </div>`;
    }).join("") : `<div class="">No summary available.</div>`;

    return `
    <div class="container-fluid px-0">
        <div class="d-flex align-items-center justify-content-between flex-wrap mb-3">
            <div class="d-flex align-items-center mb-2 mb-md-0">
                <img src="${studentImage}" class="mr-3 rounded-circle border" alt="Student" style="width:56px;height:56px;object-fit:cover;">
                <div class="text-truncate">
                    <h4 class="mb-1 font-25 font-weight-bold text-dark text-truncate">${parentStudentClassScheduleEscapeHtml(studentName)}</h4>
                </div>
            </div>
            <span class="badge badge-pill ${parentStudentClassScheduleAttendanceClass(attendanceStatus)} px-3 py-2 font-12">${parentStudentClassScheduleEscapeHtml(attendanceStatus)}</span>
        </div>
        <div class="row">
            <div class="col-lg-12">
                <div class="row">
                    <div class="col-md-6 col-lg-2 mb-2">
                        <div class="border rounded-10 p-2">
                            <div class="text-muted font-12 mb-2"><i class="fa fa-book mr-1" aria-hidden="true"></i> Course</div>
                            <div class="font-weight-bold text-dark">${parentStudentClassScheduleEscapeHtml(subject)}</div>
                        </div>
                    </div>
                    <div class="col-md-6 col-lg-2 mb-2">
                        <div class="border rounded-10 p-2">
                            <div class="text-muted font-12 mb-2"><i class="fa fa-user mr-1" aria-hidden="true"></i> Teacher</div>
                            <div class="font-weight-bold text-dark">${getSalutationByGender(eventMeta.teacherGender)} ${parentStudentClassScheduleEscapeHtml(teacher)}</div>
                        </div>
                    </div>
                    <div class="col-md-6 col-lg-2 mb-2">
                        <div class="border rounded-10 p-2">
                            <div class="text-muted font-12 mb-2"><i class="fa fa-calendar mr-1" aria-hidden="true"></i> Date</div>
                            <div class="font-weight-bold text-dark">${parentStudentClassScheduleEscapeHtml(classDate)}</div>
                        </div>
                    </div>
                    <div class="col-md-6 col-lg-2 mb-2">
                        <div class="border rounded-10 p-2">
                            <div class="text-muted font-12 mb-2"><i class="fa fa-clock-o mr-1" aria-hidden="true"></i> Time</div>
                            <div class="font-weight-bold text-dark">${parentStudentClassScheduleEscapeHtml(classTime)}</div>
                        </div>
                    </div>
                    <div class="col-md-6 col-lg-2 mb-2">
                        <div class="border rounded-10 p-2">
                            <div class="text-muted font-12 mb-2"><i class="fa fa-hourglass-half mr-1" aria-hidden="true"></i> Duration</div>
                            <div class="font-weight-bold text-dark">${parentStudentClassScheduleEscapeHtml(classDuration)}</div>
                        </div>
                    </div>
                    ${/*<div class="col-md-6 col-lg-4 mb-2">
                        <div class="border rounded p-3">
                            <div class="text-muted font-12 mb-2"><i class="fa fa-line-chart mr-1" aria-hidden="true"></i> Attendance Rate</div>
                            <div class="font-weight-bold text-dark">${parentStudentClassScheduleEscapeHtml(attendanceRate)}</div>
                        </div>
                    </div>*/''}
                </div>
            </div>
            ${/*<div class="col-lg-4 mb-2">
                <div class="border rounded-10 bg-light p-3">
                    <div class="d-flex align-items-center justify-content-between mb-2">
                        <h5 class="mb-0 font-16 font-weight-bold"><i class="fa fa-history mr-1" aria-hidden="true"></i>Time Details</h5>
                        <span class="font-12 text-muted">Total Class duration: ${parentStudentClassScheduleEscapeHtml(totalClassDuration)}</span>
                    </div>
                    <div class="d-flex align-items-center justify-content-between py-1">
                        <div class="text-muted font-13"><i class="fa fa-play-circle text-primary mr-1" aria-hidden="true"></i>Class Start Time:</div>
                        <div class="font-weight-bold text-primary">${parentStudentClassScheduleEscapeHtml(classStartTime)}</div>
                    </div>
                    <div class="d-flex align-items-center justify-content-between py-1">
                        <div class="text-muted font-13"><i class="fa fa-sign-in text-success mr-1" aria-hidden="true"></i>Student Joined:</div>
                        <div class="font-weight-bold text-success">${parentStudentClassScheduleEscapeHtml(studentJoined)}</div>
                    </div>
                    <div class="d-flex align-items-center justify-content-between py-1">
                        <div class="text-muted font-13"><i class="fa fa-sign-out text-warning mr-1" aria-hidden="true"></i>Student Left:</div>
                        <div class="font-weight-bold text-warning">${parentStudentClassScheduleEscapeHtml(studentLeft)}</div>
                    </div>
                    <div class="d-flex align-items-center justify-content-between py-1">
                        <div class="text-muted font-13"><i class="fa fa-stop-circle text-danger mr-1" aria-hidden="true"></i>Class End Time:</div>
                        <div class="font-weight-bold text-danger">${parentStudentClassScheduleEscapeHtml(classEndTime)}</div>
                    </div>
                </div>
            </div>*/''}
        </div>
        <hr class="my-3"/>
        <div class="mb-2">
            <h4 class="font-20 font-weight-bold text-dark"><i class="fa fa-calendar-o mr-2" aria-hidden="true"></i>Class Summary</h4>
        </div>
        ${summaryHTML}
    </div>`;
}

function parentStudentClassScheduleGetSummarySections(details){
    var sections = [];
    if($.isArray(details.summaryDetails)){
        $.each(details.summaryDetails, function(_, item){
            if(item){
                sections.push({
                    title: item.label || item.title || item.heading || "Overview",
                    content: item.summary || item.description || item.content || ""
                });
            }
        });
    }
    if($.isPlainObject(details.summary) && details.summary.summaryOverview){
        sections.unshift({
            title: "Overview",
            content: details.summary.summaryOverview
        });
    }
    if($.isArray(details.classSummarySections)){
        $.each(details.classSummarySections, function(_, item){
            if(item){
                sections.push({
                    title: item.title || item.heading || "Overview",
                    content: item.description || item.summary || item.content || ""
                });
            }
        });
    }
    if($.isPlainObject(details.classSummarySections)){
        $.each(details.classSummarySections, function(key, value){
            if(value){
                sections.push({title: key, content: value});
            }
        });
    }
    if($.isPlainObject(details.classSummary)){
        $.each(details.classSummary, function(key, value){
            if(value){
                sections.push({title: key, content: value});
            }
        });
    }else if(typeof details.classSummary === "string" && details.classSummary.trim() !== ""){
        sections.push({title: "Overview", content: details.classSummary});
    }
    if(typeof details.overview === "string" && details.overview.trim() !== ""){
        sections.push({title: "Overview", content: details.overview});
    }
    if(typeof details.meetingSummary === "string" && details.meetingSummary.trim() !== ""){
        sections.push({title: "Meeting Summary", content: details.meetingSummary});
    }
    return sections;
}

function parentStudentClassScheduleSafe(value, fallback){
    if(value === null || value === undefined || value === ""){
        return fallback || "N/A";
    }
    return value;
}

function parentStudentClassScheduleAttendanceClass(status){
    var normalized = (status || "").toString().toLowerCase();
    if(normalized.indexOf("present") > -1 || normalized.indexOf("attend") > -1){
        return "bg-light-success text-success border border-success";
    }
    if(normalized.indexOf("absent") > -1 || normalized.indexOf("miss") > -1){
        return "bg-light-danger text-danger border border-danger";
    }
    return "bg-light-warning text-dark border border-warning";
}

function parentStudentClassScheduleEscapeHtml(str){
    return $("<div>").text(str || "").html();
}

function parentStudentClassScheduleParagraphs(text){
    var safeText = parentStudentClassScheduleEscapeHtml(text || "");
    return safeText.replace(/\n/g, "<br/>");
}

function parentStudentClassScheduleNormalizeSummaryResponse(details){
    var normalized = details || {};
    if($.isPlainObject(details.summary)){
        normalized.studentName = normalized.studentName || details.summary.studentName;
        normalized.studentId = normalized.studentId || details.summary.studentId;
        normalized.profilePic = normalized.profilePic || details.summary.profilePic;
        normalized.subjectName = normalized.subjectName || details.summary.subjectName;
        normalized.teacherName = normalized.teacherName || details.summary.teacherName;
        normalized.classDate = normalized.classDate || details.summary.classDate;
        normalized.classTime = normalized.classTime || details.summary.classTime;
        normalized.classDuration = normalized.classDuration || details.summary.classDuration;
        normalized.attendanceRate = normalized.attendanceRate || details.summary.attendanceRate;
        normalized.attendanceStatus = normalized.attendanceStatus || details.summary.attendanceStatus;
    }
    return normalized;
}

function parentStudentClassScheduleBuildEventInstanceKey(eventObj){
    if(!eventObj){
        return "";
    }
    return [
        eventObj.id || "",
        eventObj.meetingId || "",
        eventObj.start || "",
        eventObj.end || ""
    ].join("|");
}

function parentStudentClassScheduleGetEventMeta(meetingId, eventId, eventInstanceKey){
    var meta = {};
    if(!$.isArray(GLOBAL_EVENTS)){
        return meta;
    }
    var eventObj = null;
    if(eventInstanceKey){
        eventObj = GLOBAL_EVENTS.find(function(e){
            return parentStudentClassScheduleBuildEventInstanceKey(e) === eventInstanceKey;
        });
    }
    if(eventId){
        eventObj = eventObj || GLOBAL_EVENTS.find(function(e){
            return (e.id + "") === (eventId + "");
        });
    }
    if(!eventObj && meetingId){
        eventObj = GLOBAL_EVENTS.find(function(e){
            return (e.meetingId + "") === (meetingId + "");
        });
    }
    if(!eventObj){
        return meta;
    }
    var startMoment = eventObj.start ? moment(eventObj.start) : null;
    var endMoment = eventObj.end ? moment(eventObj.end) : null;
    var durationText = "N/A";
    if(startMoment && endMoment && startMoment.isValid() && endMoment.isValid()){
        var mins = endMoment.diff(startMoment, "minutes");
        durationText = mins + " minutes";
    }
    meta.subjectName = eventObj.courseName || "N/A";
    meta.teacherName = eventObj.teacherName || "N/A";
    meta.classDate = startMoment && startMoment.isValid() ? startMoment.format("MMMM D, YYYY") : "N/A";
    meta.classTime = (startMoment && startMoment.isValid() ? startMoment.format("hh:mm A") : "N/A") + " - " + (endMoment && endMoment.isValid() ? endMoment.format("hh:mm A") : "N/A");
    meta.classDuration = durationText;
    meta.totalClassDuration = eventObj.classesAttendanceDuration || durationText;
    meta.classStartTime = startMoment && startMoment.isValid() ? startMoment.format("hh:mm A") : "N/A";
    meta.classEndTime = endMoment && endMoment.isValid() ? endMoment.format("hh:mm A") : "N/A";
    meta.studentJoined = eventObj.studentJoinedTime || eventObj.classesAttendanceStartTime || "N/A";
    meta.studentLeft = eventObj.studentLeftTime || eventObj.classesAttendanceEndTime || "N/A";
    meta.teacherGender = eventObj.teacherGender || ""
    return meta;
}

