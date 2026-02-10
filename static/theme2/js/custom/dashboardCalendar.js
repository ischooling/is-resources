var ISCALENDARLOAD = true;
function validateRequestForSchoolHoliday(formId){
	if($("#"+formId+" #holidayFor").val()==''){
		showMessageTheme2(0, "Please select holiday for");
		return false;
	}

	var selectRole = $("#holidayFor").val();
	//selectRole = selectRole.toString();
	//var str2 = "STUDENT";
	//if(selectRole.indexOf(str2) != -1){
	if(selectRole=="STUDENT"){
		if($("#"+formId+" #enrollType").val()==''){
			showMessageTheme2(0, "Please select Enrollment type for");
			return false;
		}
	}
	
	if($("#"+formId+" #holidayHome").val()==''){
		showMessageTheme2(0, "Please enter holiday Subject");
		return false;
	}
	var str = $("#"+formId+" #holidayHome").val();
	if(str.length>100){
		showMessageTheme2(0, "You cannot have more than 100 characters in Subject");
		return false;
	}
	if($("#"+formId+" #holidayStartDate").val()==''){
		showMessageTheme2(0, "Please select start date");
		return false;
	}
	// if($("#"+formId+" #holidayType").val()==''){
	// 	showMessageTheme2(0, "Please select holiday type");
	// 	return false;
	// }
	if($("#"+formId+" #lmsPlatform").val()==''){
		showMessageTheme2(0, "Please select LMS Platform");
		return false;
	}
	return true;
}
function submitSchoolHoliday(formId) {
	hideMessageTheme2('');
	if(!validateRequestForSchoolHoliday(formId)){
		return false;
	}
	
	var fdata = {};
	fdata['userId']=$("#"+formId+" #userId").val();
	fdata['holidayId']=$("#"+formId+" #holidayId").val();
	fdata['standardId']=$("#"+formId+" #standardId").select2('val');
	fdata['batchId']=$("#"+formId+" #batchId").select2('val');
	fdata['studentId']=$("#"+formId+" #studentId").select2('val');
	fdata['schoolId']=SCHOOL_ID;
	fdata['enrollType']=$("#"+formId+" #enrollType").val();
	fdata['holidayFor']=$("#"+formId+" #holidayFor").val();
	fdata['holidayType']=$("#"+formId+" #holidayType").val();
	
	if($("#" + formId + " #enrollType").val()=='BATCH'){
		fdata['lmsPlatform']='38';
	}else if($("#" + formId + " #enrollType").val()=='SSP'){
		fdata['lmsPlatform']='37,40,41';
	}else if($("#" + formId + " #enrollType").val()=='SCHOLARSHIP'){
		fdata['lmsPlatform']='37,39,40,41';
	}else if($("#" + formId + " #enrollType").val()=='ALL' || $("#" + formId + " #holidayFor").val()=='TEACHER'){
		fdata['lmsPlatform']='37,38,39,40,41';
	}else if($("#" + formId + " #enrollType").val()=='ONE_TO_ONE_FLEX'){
		fdata['lmsPlatform']='37';
	}else{
		fdata['lmsPlatform']='37,39,41';
	}
	if($("#" + formId + " #holidayFor").val()=='TEACHER'){
		fdata['lmsPlatform']='37,38,39,40,41';
	}
	fdata['holidayHome']= $("#"+formId+" #holidayHome").val();
	fdata['holidayStartDate']=$("#"+formId+" #holidayStartDate").val();
	if(editor1!=undefined){
		fdata['holidayRemark']= editor1.getData().trim();
	}
	
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLForHTML('dashboard','school-holiday-submit'),
		data : JSON.stringify(fdata),
		dataType : 'json',
		//processData: false,
		//contentType: false,
		//enctype: 'multipart/form-data',
		success : function(data) {
			if (data.status == '0' || data.status == '2') {
				showMessageTheme2(0, data.message);
			} else {
				$('#'+formId+ ' #enrollType').val('').trigger("change");
				$('#'+formId+ ' #holidayFor').val('').trigger("change");
				$('#'+formId+ ' #standardId').val('').trigger("change");
				$('#'+formId+ ' #batchId').val('').trigger("change");
				$('#'+formId+ ' #studentId').val('').trigger("change");
				$("#"+formId+" #batchId").html('');
				$("#"+formId+" #studentId").html('');
				initEditor(1, 'mymceHoliday','Please start here', true);
				$("#"+formId+" #fileupload1Span").text('No file chosen...');
				$('#'+formId)[0].reset();
				showMessageTheme2(1, data.message);
				
			}
			return false;
		}
	});
}
function updateSchoolHolidays(userId,holidayid,controllType,moduleId) {
	hideMessageTheme2('');
	// var fdata = new FormData();
	// fdata.append('userId',userId);
	// fdata.append('holidayId',holidayid);
	// fdata.append('controllType',controllType);
	var fdata = {};
	fdata['userId']=userId;
	fdata['holidayId']=holidayid;
	fdata['controllType']=controllType;

	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLForHTML('dashboard','holidays-update'),
		data : JSON.stringify(fdata),
		dataType : 'json',
		//processData: false,
		//contentType: false,
		//enctype: 'multipart/form-data',
		success : function(data) {
			if (data.status == '0' || data.status == '2') {
				showMessageTheme2(0, data.message);
			} else {
				showMessageTheme2(1, data.message);
				setTimeout(function (){callDashboardPageSchool(moduleId,'holiday-list');},1000);
			}
			return false;
		}
	});
}


var CALENDAR_EVENT_DATA=[];
function callSchoolCalendar(formId, userId, UNIQUEUUID, viewName, startdate, enddate, flag) {
	return new Promise((resolve, reject) => {
        $.ajax({
            type: "POST",
            contentType: APPLICATION_JSON_VALUE,
            url: getURLForHTML('dashboard', 'school-calendar'),
            data: JSON.stringify(getRequestForSchoolCalendar(formId, userId, UNIQUEUUID, viewName, startdate, enddate)),
            dataType: 'json',
            cache: false,
            timeout: 600000,
            async: true,
            success: function (data) {
                if (data.status === '0' || data.status === '2') {
                    showMessageTheme2(0, data.message);
                    resolve([]); // return empty array if error
                } else if (data.status === '3') {
                    redirectLoginPage();
                    reject('Redirected to login');
                } else {
					var finalEvents=[];
                    var events = data.event || [];
					if(events.length>0){
						console.log(data)
						// events.sort((a, b) => new Date(a.start) - new Date(b.start));
						events.forEach(obj => {
							if(obj.id.startsWith("announce", 0) || obj.id.startsWith("holiday", 0)){
								finalEvents.push(obj);
							}else{
								obj.start = convertDatetimeWithFormat(obj.start, obj.timezone, USER_TIMEZONE, DATE_UTC+'T'+TIME_UTC);
								obj.end = convertDatetimeWithFormat(obj.end, obj.timezone, USER_TIMEZONE, DATE_UTC+'T'+TIME_UTC);
								ACTIVITY_CLASS_START_TIME.push({"startTime":obj.start.replace("T", " "), "endTime":obj.end.replace("T", " "), "title":"class"});
								var baseDate=obj.start.split('T')[0];
								if($.inArray(baseDate,data.holidays)<0){
									finalEvents.push(obj);
								}
							}
						});
					};
					CALENDAR_EVENT_DATA = finalEvents;
					$('#schoolcalendar').fullCalendar('removeEvents');
					//$('#schoolcalendar').fullCalendar('destroy');
					getFullCalendar(finalEvents, viewName, formId, userId, UNIQUEUUID, viewName, startdate, enddate, flag, data.activityTypes);
					if(flag){
						$("#schoolcalendar").fullCalendar('addEventSource', finalEvents);
					}
					resolve(finalEvents); // return event array
					if($('#schoolcalendar').fullCalendar('getView').name == "agendaWeek"){
						$(".upcoming-icon").addClass("upcoming-week-view-icon");
						$(".live-class-blink .live-symbol").addClass("live-week-view-icon");
					}else{
						$(".upcoming-icon").removeClass("upcoming-week-view-icon");
						$(".live-class-blink .live-symbol").removeClass("live-week-view-icon");
					}
					
					ISCALENDARLOAD=false;
				}
            }
        });
    });
}

function getRequestForSchoolCalendar(formId, userId, UNIQUEUUID, viewName, startdate, enddate) {
	if(startdate=='' || startdate==undefined){
		startdate = todayDate();
	}
	if(enddate=='' || enddate==undefined){
		enddate = todayDate();
	}
	var schoolCalendarRequestDTO = {};
	schoolCalendarRequestDTO['userId'] =userId;
	schoolCalendarRequestDTO['schoolId'] = SCHOOL_ID;
	schoolCalendarRequestDTO['agenda'] = viewName;
	schoolCalendarRequestDTO['startDate']=changeDateFormat(new Date(moment(moment(startdate)).add(-1,'days')),'yyyy-mm-dd');
	if(viewName=='agendaDay'){
		schoolCalendarRequestDTO['endDate']=changeDateFormat(new Date(moment(moment(startdate)).add(1,'days')),'yyyy-mm-dd');
	}else{
		schoolCalendarRequestDTO['endDate']=changeDateFormat(new Date(moment(moment(enddate)).add(1,'days')),'yyyy-mm-dd');
	}
	schoolCalendarRequestDTO['uniqueId']= UNIQUEUUID;
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

function firstDateMonth(){
	var monthdate=[];
	var date = new Date();
	var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
	var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
	monthdate=[firstDay, lastDay];
	return monthdate;
}

function getHash() {
    return 'ajslfkjalksdf'
}
var todayClassArray = [];
$(document).ready(function() {
	// setInterval(function(){
	// 	if($("#currentTimeForUser").length>0){
	// 		var userTime = new Date($("#currentTimeForUser").text());
	// 		var year = userTime.getFullYear();
	// 		var month = userTime.toLocaleString('en-US', {month: 'short'});
	// 		var day = userTime.getDate();
	// 		var hours = userTime.getHours();
	// 		var minutes = userTime.getMinutes();
	// 		var seconds = userTime.getSeconds();
	// 		var ampm = hours >= 12 ? 'PM' : 'AM';
	// 		minutes = minutes<=9 ? '0'+minutes:minutes;
	// 		seconds = seconds<=9 ? '0'+seconds:seconds;
	// 		// Convert hours from 24-hour to 12-hour format
	// 		hours = hours % 12;
	// 		hours = hours ? hours : 12; // The hour '0' should be '12'
	// 		hours = hours<=9 ? '0'+hours:hours;
	// 		$(".user_current_day").text(month+" "+day+","+" "+year);
	// 		// $(".user_current_hour").text(hours);
	// 		// $(".user_current_mins").text(minutes);
	// 		// $(".user_current_second").text(seconds);
	// 		// $(".user_current_am_pm").text(ampm);
	// 		$(".user_current_time").html(hours+":"+minutes+":"+seconds+" "+`<span class="user_current_am_pm clock-bg time-label">${ampm}</span>`);
	// 	}
	// },1000);
	
});


function calendarTimeInterval() {
	var userTimeInterval = setInterval(function () {
        if($("#currentTimeForUser").length>0){
			var userTime = new Date($("#currentTimeForUser").text());
			var year = userTime.getFullYear();
			var month = userTime.toLocaleString('en-US', {month: 'short'});
			var day = userTime.getDate();
			var hours = userTime.getHours();
			var minutes = userTime.getMinutes();
			var seconds = userTime.getSeconds();
			var ampm = hours >= 12 ? 'PM' : 'AM';
			minutes = minutes<=9 ? '0'+minutes:minutes;
			seconds = seconds<=9 ? '0'+seconds:seconds;
			// Convert hours from 24-hour to 12-hour format
			hours = hours % 12;
			hours = hours ? hours : 12; // The hour '0' should be '12'
			hours = hours<=9 ? '0'+hours:hours;
			$(".user_current_day").text(month+" "+day+","+" "+year);
			// $(".user_current_hour").text(hours);
			// $(".user_current_mins").text(minutes);
			// $(".user_current_second").text(seconds);
			// $(".user_current_am_pm").text(ampm);
			$(".user_current_time").html(hours+":"+minutes+":"+seconds+" "+`<span class="user_current_am_pm clock-bg time-label">${ampm}</span>`);
		} else {
			clearInterval(userTimeInterval);
        }
    }, 1000);
}


// var data1=getStudentDashboardDetails();
var scrollEventTriggered = false;
function getFullCalendar(CALENDAR_EVENT_ARRAY, viewName, formId, userId, UNIQUEUUID, viewName, startdate, enddate, flag, activityTypes) {
	todayClassArray = [];
    var initialView = window.innerWidth < 768 ? 'listDay' : 'agendaDay';
	$("#schoolcalendar").fullCalendar({
		firstDay: 1,
        header: {
            left: "today",
            center: "prev,next, title",
            right: "agendaDay,agendaWeek",
		},
        buttonText: {
            today: 'Today',
            month: 'Monthly',
            week: 'Weekly',
            day: 'Daily'
        },
        forceEventDuration: true,
        themeSystem: "bootstrap4",
        bootstrapFontAwesome: true,
        defaultView: initialView,
        defaultDate: todayDate(),
        timeFormat: 'h(:mm)a',
        navLinks: true,
        editable: false,
        allDayDefault: false,
        eventLimit: true,
        eventStartEditable: false,
        minTime: '00:00:00',
        maxTime: '24:00:00',
        slotDuration: '00:30:00',
        events: CALENDAR_EVENT_ARRAY,
        
        // Add these callbacks for v3.10.1 to handle view changes
        viewRender: function(view, element) {
			if(getSession()){
				if(!ISCALENDARLOAD){
					var currentView = view.name;
					var start = view.start.format('YYYY-MM-DD');
					var end = view.end.format('YYYY-MM-DD');
					// Reload events for the new date range
					callSchoolCalendar(formId, userId, UNIQUEUUID, currentView, start, end, true);
				}
				var legentHtml=
					`<div class="d-flex w-100 flex-wrap justify-content-center mt-1 gap-5 legent_wrapper">
						<div class="d-inline-flex align-items-center mr-2">
							<label class="d-inline-block rounded-circle m-0" style="width:10px;height:10px;background:#bfbebe"></label>
							<span class="d-inline-block ml-1 font-12 font-weight-semi-bold">Expired Classes & Activities</span>
						</div>
						<div class="d-inline-flex align-items-center mr-2">
							<label class="d-inline-block rounded-circle m-0" style="width:10px;height:10px;background:#007c00"></label>
							<span class="d-inline-block ml-1 font-12 font-weight-semi-bold">Live Class & Activity</span>
						</div>
						<div class="d-inline-flex align-items-center mr-2">
							<label class="d-inline-block rounded-circle m-0" style="width:10px;height:10px;background:#433a11"></label>
							<span class="d-inline-block ml-1 font-12 font-weight-semi-bold">Upcoming Classes & Activities</span>
						</div>
						<div class="d-inline-flex align-items-center mr-2">
							<label class="d-inline-block rounded-circle bg-primary m-0" style="width:10px;height:10px;"></label>
							<span class="d-inline-block ml-1 font-12 font-weight-semi-bold">Classes</span>
						</div>
						<div class="d-inline-flex align-items-center">
							<label class="d-inline-block rounded-circle bg-danger m-0" style="width:10px;height:10px;"></label>
							<span class="d-inline-block ml-1 font-12 font-weight-semi-bold">Activities</span>
						</div>
					</div>`;
					if($(".legent_wrapper").length<1){
						$("#schoolcalendar .fc-header-toolbar").after(legentHtml);
					}
			}else{
				redirectLoginPage();
			}
			// 🟢 ADD "Week of" TEXT
			if (view.name === "agendaWeek") {
				$('.fc-scroller .fc-unselectable .fc-bg .fc-day.fc-sat, .fc-scroller .fc-unselectable .fc-day.fc-sun').each(function () {
					$(this).append('<div class="font-weight-bold text-center mt-3">Day Off</div>');
				});
			}

			if (view.name === "agendaDay") {
				$(".fc-center h2").text(view.start.format("dddd, MMM D, YYYY"));
			}

			$('.fc-head-container  .fc-axis').each(function () {
				if (!$(this).find('.axis-icon').length) {
					$(this).prepend('<i class="fa fa-clock-o axis-icon fa-2x"></i>');
				}
			});
			updateTabCounts(CALENDAR_EVENT_DATA);
		},
        eventClick: function(info) {
			if(info.url) {
                if (getSession()) {
                    classDetailsOnModal(info.url);
                    return false;
                } else {
                    redirectLoginPage();
                }
                return false;
            } else if(!info.id.startsWith("activity", 0)) {
                eventDetailsOnModal(info.id, info.eventType, info.activities);
            }
        },
        
        eventRender: function(event, element) {
			if(!event.id.startsWith("announce", 0) && !event.id.startsWith("holiday", 0)) {
                if (event.start && event.end) {
                    const startStr = event.start.format();
                    const endStr = event.end.format();
					const eventExists = todayClassArray.some(e =>
                        e.start === startStr &&
                        e.endTime === endStr &&
                        e.eventType === event.eventType
                    );
					
					if(!eventExists) {
                        todayClassArray.push({
							start: startStr,
							end: endStr,
							eventId: event.id,
							eventTitle: event.eventTitle,
							eventType: event.eventType
						});
					}
					var startTime = event.start.format('h:mm A');
					var endTime   = event.end.format('h:mm A');
					var customTimeHtml =``;
					
					if(!event.id.startsWith("activity", 0)){
						customTimeHtml=`<div class="d-inline-block py-1 px-2 rounded class-time class-start-Time event-start-Time">${startTime}</div>
						<div class="d-inline-block py-1 px-2 rounded class-time class-end-Time ml-1 event-end-Time">${endTime}</div>`;
					}else if(event.id.startsWith("activity", 0)){
						customTimeHtml=`<div class="d-inline-block py-1 px-2 rounded activety-time activety-start-Time event-start-Time">${startTime}</div>
            			<div class="d-inline-block py-1 px-2 rounded activety-time activety-end-Time ml-1 event-end-Time">${endTime}</div>`;
					}
					element.find('.fc-time').html(customTimeHtml);
					var customEventTitleHtml =``;
					if(!event.id.startsWith("activity", 0)){
						if(event.category.startsWith("BATCH", 0)){
							customEventTitleHtml+=`<div class="text-dark text-center font-weight-bold mt-1 class-title">${event.title}</div>`;
						}else{
							customEventTitleHtml=`<div class="text-dark text-center font-weight-bold mt-1 class-title">${event.eventTitle}</div>`;
						}
						if(!event.category.startsWith("BATCH", 0)){
							customEventTitleHtml+=`<div class="text-dark pt-2 font-weight-semi-bold text-center assign-teacher-wrapper w-100">
								<div>
									<span class="font-weight-normal">${USER_ROLE == "TEACHER"?'Student Name: ':'Teacher Name: '}</span><span class="assign-teacher-name">${event.name}</span>
								</div>
							</div>`;
						}
						
						customEventTitleHtml+=`<div class="class-indicator position-absolute w-100"></div>`;
					}else if(event.id.startsWith("activity", 0)){
						var activityTitle = event.title.split("~");
						var subActivityTitle = activityTitle[1];
						activityTitle = activityTitle[0];
						customEventTitleHtml=`<div class="text-dark text-center font-weight-bold mt-1 class-title">${activityTitle}</div>
						<div class="text-dark pt-4 font-weight-semi-bold text-center  assign-teacher-wrapper w-100">
							${subActivityTitle != null && subActivityTitle != undefined && subActivityTitle != "" ? `<div class="font-14 font-weight-semi-bold text-dark w-100 text-center sub-activity-title">${subActivityTitle}</div>`:``}
							<span class="font-weight-normal sub-activity-label">${event.eventTitle}</span>
						</div>
						<div class="class-indicator position-absolute w-100"></div>`;
					}
					
					element.find('.fc-title').html(customEventTitleHtml);
				}
				updateEventIcons(event, element, todayClassArray, viewName, activityTypes);
			}
		},

        eventAfterAllRender: function() {
			if (!scrollEventTriggered) {
                scrollEventTriggered = true;
				scrollEvent();
                setTimeout(function() {
                    scrollEventTriggered = false;
                }, 1500);
            }
			$('.fc-today-button, .fc-agendaDay-button, .fc-agendaWeek-button').removeClass('btn-primary').addClass('btn-light btn-pill');
			// label bhi yahin set karo
			if ($('#schoolcalendar').fullCalendar('getView').name === "agendaWeek" || $('#schoolcalendar').fullCalendar('getView').name === "listDay") {
				$(".over_All_Class_Activity_Label").text("Total Weekly Classes & Activities");
			} else {
				$(".over_All_Class_Activity_Label").text("Total Daily Classes & Activities");
			}
		},

        windowResize: function() {
            updateCalendarView();
        }
    });

    CALENDAR_EVENT = true;
    updateCalendarView();
	console.log(todayClassArray)
}

$(window).off('resize').on('resize', function() {
	if($('#schoolcalendar').length>0){
		updateCalendarView();
	}
});
function updateCalendarView() {
	var currentView = $('#schoolcalendar').fullCalendar('getView');
	if(window.innerWidth < 768) {
		if(currentView.name == "agendaDay" || currentView.name == "listDay"){
			$('#schoolcalendar').fullCalendar('changeView', 'listDay');
			$('.over_All_Class_Activity_Label').text("Total Daily Classes & Activities");
		}
		if(currentView.name == "agendaWeek" || currentView.name == "listWeek"){
			$('#schoolcalendar').fullCalendar('changeView', 'listWeek');
			$('.over_All_Class_Activity_Label').text("Total Weekly Classes & Activities");
		}
	}else{
		if(currentView.name == "agendaDay" || currentView.name == "listDay"){
			$('#schoolcalendar').fullCalendar('changeView', 'agendaDay');
			$('.over_All_Class_Activity_Label').text("Total Daily Classes & Activities");
		}
		if(currentView.name == "agendaWeek" || currentView.name == "listWeek"){
			$('#schoolcalendar').fullCalendar('changeView', 'agendaWeek');
			$('.over_All_Class_Activity_Label').text("Total Weekly Classes & Activities");
		}
		$("#legentCalendar").remove();
	}
}

function checkIfAnyClassRunning(todayClassArray) {
    var currentTime = new Date($("#currentTimeForUser").text());
    var currentMs = currentTime.getTime();

    for (var i = 0; i < todayClassArray.length; i++) {
        var startTime = new Date(todayClassArray[i].start).getTime();
        var endTime = new Date(todayClassArray[i].endTime).getTime();

        if (currentMs >= startTime && currentMs <= endTime) {
            return true;
        }
    }
    return false;
}

function getEventsInCurrentView(allEvents) {

    var view = $('#schoolcalendar').fullCalendar('getView');
    if (!view || !view.start || !view.end) return [];

    var viewName = view.name;
    var start, end;

    // ✅ Day views (agendaDay / listDay)
    if (viewName === 'agendaDay' || viewName === 'listDay') {

        start = moment(view.start).startOf('day');
        end   = moment(view.start).endOf('day');

    } 
    // ✅ Week / Month views
    else {

        start = moment(view.start).startOf('day');
        end   = moment(view.end).subtract(1, 'seconds');

    }

    return allEvents.filter(function (e) {
        var eventStart = moment(e.start);
        return eventStart.isBetween(start, end, null, '[]');
    });
}




function updateTabCounts(allEvents) {
	var filteredEvents = getEventsInCurrentView(allEvents);
    $(".over_All_Class_Activity_Count").text(filteredEvents.length);
    $(".activity_Count").text(
        filteredEvents.filter(e => e.category === 'ACTIVITY').length
    );

    if (USER_ROLE === "STUDENT") {
        $(".class_Count").text(
            filteredEvents.filter(e => e.category === 'CLASS').length
        );
    } else if (USER_ROLE === "TEACHER") {
        $(".one_to_one_class_Count").text(
            filteredEvents.filter(e => e.category === 'ONE_TO_ONE').length
        );
        $(".group_class_Count").text(
            filteredEvents.filter(e => e.category === 'BATCH').length
        );
    }
}



var updateEventIconsStyle = true;
// function updateEventIcons(info, element, todayClassArray, viewName) {

// 	if(updateEventIconsStyle){
// 		$("head").append('<style>.tooltip-inner{max-width:500px;width:fit-content}.fc-scroller.fc-time-grid-container[style]{height:425px !important}</style>');
// 		updateEventIconsStyle=false;
// 	}
// 	if(todayClassArray.length>0){
// 		var date = new Date(todayClassArray.start);
// 		var formattedDate = date.toLocaleDateString("en-US", {
// 			weekday: "short",
// 			month: "short",
// 			day: "2-digit",
// 			year: "numeric"
// 		});

// 		element.attr("data-toggle","tooltip");
// 		element.attr("data-container","body");
// 		element.attr("data-html",true);
// 		element.attr(`data-original-title`,
// 			// `Class Start Time: ${element.find(".fc-time .class-end-Time").text()}</br>${element.find(".fc-title").text()}`
// 			`<div class="card">
// 				<div class="card-body">
// 					<div class="full">
// 						<img src="https://www.kindpng.com/picc/m/154-1546828_transparent-chemistry-icon-png-chemical-effects-of-electric.png" width="30px" />
// 					</div>
// 					<div>
// 						<h5>Course Name</h5>
// 						<p>${formattedDate}</p>
// 						<p>Grade</p>
// 					</div>
// 					<div class="d-flex my-2">
// 						<div class="d-inline-flex py-1 px-2 rounded bg-dark text-white">${element.find(".fc-time .class-start-Time").text()}</div>
// 						<div class="d-inline-flex py-1 px-2 rounded bg-dark text-white">${element.find(".fc-time .class-end-Time").text()}</div>
// 					</div>
// 					<div class="full">
// 						<p>Teacher Name: </p>
// 						<h5 class="font-weight-bold">${element.find(".fc-title .assign-teacher-name").text()}</h5>
// 					</div>
// 				</div>
// 			</div>`
// 		)
// 		setInterval(function() {
// 			var currentTime = new Date($("#currentTimeForUser").text());
// 			// console.log(info.start._i + info.end);
// 			if(info.start!=null && info.end!=null){
// 				var startTime = new Date(info.start._i);
// 				var endTime = new Date(info.end._i);
// 				var currentDate = currentTime.getDate();
// 				var currentMilliseconds = currentTime.getTime()
// 				var eventDate = startTime.getDate();
// 				var eventStartMilliseconds = startTime.getTime();
// 				var eventEndMilliseconds = endTime.getTime();
// 				element.find(".live-symbol").remove();
// 				element.removeClass("live-class-blink");
// 				element.removeClass("upcoming-class-blink");
// 				element.find('.live-symbol').remove(); // Remove existing icons
// 				element.find('.upcoming-icon').remove(); // Remove existing icons
// 				if(currentMilliseconds > eventEndMilliseconds && currentMilliseconds > eventStartMilliseconds) {
// 					// element.find(".fc-time span").find(".upcoming-symbol").remove();
// 					// var liveIcon = $('<b class="d-inline-block pull-right live-symbol font-size-lg">🔴 Live Class</b>'); 
// 					//orignalClassBg = element.css("background-color");
// 					//orignalClassborderColor = element.css("border-color");
// 					//element.find(".fc-time span").append(liveIcon);
// 					element.addClass("past-class");
// 				}else 
// 					if(currentMilliseconds >= eventStartMilliseconds && currentMilliseconds <= eventEndMilliseconds) {
// 					element.find(".fc-title .class-indicator").find(".upcoming-symbol").remove();
// 					var liveIcon = $('<b class="d-inline-block pull-right live-symbol font-size-lg">🔴 Live Class</b>'); 
// 					orignalClassBg = element.css("background-color");
// 					orignalClassborderColor = element.css("border-color");
// 					element.find(".fc-title .class-indicator").append(liveIcon);
// 					element.addClass("live-class-blink");
// 				}else if (currentMilliseconds < eventEndMilliseconds && currentMilliseconds < eventStartMilliseconds) {
// 					if($(".upcoming-class-blink").length < 1){
// 						var closestEvent = getClosestUpcomingEvent(todayClassArray);
// 						if (closestEvent && closestEvent.eventType === info.eventType) {
// 							var upcomingIcon=$('<b class="d-flex w-100 flex-row-reverse align-itmes-center upcoming-icon upcoming-week-view-icon"> <img style="filter:brightness(0) invert(1);" class="timer-img position-relative"  src="'+PATH_FOLDER_IMAGE2+'timer.gif"/> Upcoming</b>'); 
// 							element.addClass("upcoming-class-blink");
// 							element.find(".fc-title .class-indicator").append(upcomingIcon);
// 						}
// 					}
// 				}
// 				CAN_SHOW_ENROLL_RESERVE_MODAL = !checkIfAnyClassRunning(todayClassArray);
// 				$('[data-toggle="tooltip"]').tooltip();
// 				if($('#schoolcalendar').fullCalendar('getView').name == "agendaWeek"){
// 					$(".upcoming-icon").addClass("upcoming-week-view-icon");
// 					$(".live-class-blink .live-symbol").addClass("live-week-view-icon");
// 				}else{
// 					$(".upcoming-icon").removeClass("upcoming-week-view-icon");
// 					$(".live-class-blink .live-symbol").removeClass("live-week-view-icon");
// 				}
// 			}
// 		}, 1000);
		
// 		//console.log(todayClassArray);
// 		if($("#legentCalendar").length<1 && window.innerWidth < 768){
// 			$("#schoolcalendar .fc-header-toolbar").prepend(
// 				`<div class="d-flex w-100 flex-wrap justify-content-center mb-1" id="legentCalendar">
// 					<div class="mb-1 d-inline-flex align-items-center">
// 						<span class="d-inline-block mr-1" style="width:13px;height:13px;background:green"></span>
// 						Live Class
// 					</div>
// 					<div class="mb-1 d-inline-flex align-items-center">
// 						<span class="d-inline-block mr-1" style="width:13px;height:13px;background:#453900"></span>
// 						Upcoming class
// 					</div>
// 				</div>`
// 			);
// 		}
		
// 	}	
// }
async function updateEventIcons(info, element, todayClassArray, viewName, activityTypes) {
	updateTabCounts(CALENDAR_EVENT_DATA);
	if (updateEventIconsStyle) {
		$("head").append(`
		<style>
			.tooltip-inner{max-width:500px;width:fit-content;background-color:transparent;padding:0}
			.calendar-tooltip .arrow:before{border-top-color:#d1cbcb !important}
			.fc-scroller.fc-time-grid-container[style]{height:425px !important}
		</style>
		`);
		updateEventIconsStyle = false;
	}

	if (todayClassArray.length > 0) {
		// ✅ DATE FORMAT SAFE
		var date = new Date(info.start);
		var formattedDate = isNaN(date)
		? ""
		: date.toLocaleDateString("en-US", {
			weekday: "short",
			month: "short",
			day: "2-digit",
			year: "numeric"
			});

		// ✅ TOOLTIP HTML
		var tooltipHTML = `
		<div class="card bg-light text-dark">
			<div class="card-body">
			<div class="mb-2">
				<img src='${info.icon}' width="30" />
			</div>
			<div>
				<h5 class="font-weight-bold font-16">${element.find(".fc-title .class-title").text()}</h5>`;
				if(info.id.startsWith("activity", 0)){
					
					tooltipHTML+=
					`${element.find(".sub-activity-title").length>0?`<p class="mb-0 font-weight-semi-bold font-14">${element.find(".sub-activity-title").text()}</p>`:``}
					<p class="mb-0">${element.find(".sub-activity-label").text()}</p>`;
				}
				if(info.grade != null && info.grade != undefined && info.grade != '' && info.session != null && info.session != undefined && info.session != ''){
					tooltipHTML+=`<p class="mb-0">${info.grade}|Batch ${info.session}</p>`;
				}
				tooltipHTML+=`<p class="mb-0">${formattedDate}</p>
			</div>
			<div class="d-flex my-2 justify-content-around w-fit-content gap-5 mx-auto">
				<div class="py-1 px-2 rounded bg-dark text-white">
				${element.find(".event-start-Time").text()}
				</div>
				<div class="py-1 px-2 rounded bg-dark text-white">
				${element.find(".event-end-Time").text()}
				</div>
			</div>
			<div>`
				if(info.id.startsWith("activity", 0)){
					var activitiesList = await dashboardCalendarActivityListContent(info);
					tooltipHTML+=
					`<ul class="vertical-nav-menu" id="main-nav1">${activitiesList}</ul>`;
				}else{
					if(!info.category.startsWith("BATCH", 0)){
						tooltipHTML+=
						`<p class="mb-0">${USER_ROLE == "TEACHER"?'Student Name: ':'Teacher Name: '}</p>
						<strong>${element.find(".assign-teacher-name").text()}</strong>`;
					}
					
				}
			tooltipHTML+=`</div>
			</div>
		</div>`;

		// ❌ REMOVE OLD TOOLTIP
		element.removeAttr("data-original-title title");

		// ✅ INIT TOOLTIP ONLY ONCE
		if(!element.data('bs.tooltip')) {
		element.tooltip({
			container: 'body',
			html: true,
			title: tooltipHTML,
			placement: 'auto',
			boundary: 'window',
			trigger: 'hover'
		});
		element.on('shown.bs.tooltip', function () {
			$('.tooltip').last().addClass('calendar-tooltip');
			});
		}

		// ============================
		// ⏱ LIVE / UPCOMING LOGIC
		// ============================
		setInterval(function () {
			var currentTime = new Date($("#currentTimeForUser").text());
			if (!info.start || !info.end) return;

			var startTime = new Date(info.start._i);
			var endTime = new Date(info.end._i);
			var now = currentTime.getTime();
			element.find(".live-symbol, .upcoming-icon").remove();
			element.removeClass("live-class-blink upcoming-class-blink past-class");
			if(info.category.startsWith("ONE_TO_ONE", 0)){
				element.addClass("ONE_TO_ONE");
			}
			if(info.category.startsWith("BATCH", 0)){
				element.addClass("BATCH");
			}
			if(info.category.startsWith("CLASS", 0)){
				element.addClass("CLASS");
			}
			if(info.category.startsWith("ACTIVITY", 0)){
				element.addClass("ACTIVITY");
			}
			if(info.id.startsWith("activity", 0)){
				element.addClass("activity-wrapper-div");
				var activityId = info.id.split("activity");
				activityId=activityId[1];
				element.attr("onclick","renderViewActitifyDetails('" + activityId + "', '')");

			}
			if (now > endTime.getTime()) {
				element.addClass("past-class");
				element.removeClass("activity-wrapper-div");
			}else if (now >= startTime.getTime() && now <= endTime.getTime()) {
				var liveIcon = $('<b class="d-flex flex-row-reverse live-symbol">🔴 Live Class</b>');
				element.find(".fc-title .class-indicator").append(liveIcon);
				element.removeClass("activity-wrapper-div");
				if(info.id.startsWith("activity", 0)){
					element.addClass("live-activity-blink live-class-blink");
				}else{
					element.addClass("live-class-blink");
				}
			} else {
				if ($(".upcoming-class-blink").length < 1) {
					var closestEvent = getClosestUpcomingEvent(todayClassArray);
					if (closestEvent && closestEvent.eventId === info.id) {
						var upcomingIcon = $(`
						<b class="d-flex flex-row-reverse upcoming-icon upcoming-week-view-icon">
							<img class="timer-img" src="${PATH_FOLDER_IMAGE2}timer.gif" style="filter:brightness(0) invert(1);"/> Upcoming
						</b>
						`);
						element.find(".fc-title .class-indicator").append(upcomingIcon);
						element.removeClass("activity-wrapper-div");
						if(info.id.startsWith("activity", 0)){
							element.addClass("upcoming-activity-blink upcoming-class-blink");
						}else{
							element.addClass("upcoming-class-blink");
						}
					}
				}else{
					element.addClass("future-class");
				}
			}

			CAN_SHOW_ENROLL_RESERVE_MODAL = !checkIfAnyClassRunning(todayClassArray);

			if ($('#schoolcalendar').fullCalendar('getView').name === "agendaWeek") {
				$(".upcoming-icon").addClass("upcoming-week-view-icon");
				$(".live-class-blink .live-symbol").addClass("live-week-view-icon");
			}

		}, 1000);
	}
}


function getClosestUpcomingEvent(events) {
	var currentTime = new Date($("#currentTimeForUser").text());
	var closestEvent = null;
	var closestTimeDiff = Infinity;
	events.forEach(function(event) {
		var startTime = new Date(event.start);
		if(startTime > currentTime) {
			var timeDiff = startTime - currentTime;
			if(timeDiff < closestTimeDiff) {
		  		closestTimeDiff = timeDiff;
		  		closestEvent = event;
			}
	  	}
	});
	return closestEvent;
}

function eventDetailsOnModal(modalId, modalTitle, activities){
    $(".calendarbox").attr('id',modalId);
    $("#"+modalId).modal("show");
    $("#calendarbox_title").html(modalTitle);
    $("#"+modalId+ " .activity_type .activity").html(activities)
}

function startAndEndOfWeek(date) {
  var now = date? new Date(date) : new Date();
  now.setHours(0,0,0,0);
  var sunday = new Date(now);
  sunday.setDate(sunday.getDate() - sunday.getDay());
  var startDate = (sunday.getFullYear()+"-"+((sunday.getMonth() > 8) ? (sunday.getMonth() + 1) : ('0' + (sunday.getMonth() + 1)))+"-"+((sunday.getDate() > 9) ? sunday.getDate() : ('0' + sunday.getDate())));
  var saturday = new Date(now);
  saturday.setDate(saturday.getDate() - saturday.getDay() + 6);
  var endDate = (saturday.getFullYear()+"-"+((saturday.getMonth() > 8) ? (saturday.getMonth() + 1) : ('0' + (saturday.getMonth() + 1)))+"-"+((saturday.getDate() > 9) ? saturday.getDate() : ('0' + saturday.getDate())));
  return [startDate, endDate];
}

function startAndEndOfMonth(date) {
  var now = date? new Date(date) : new Date();
  now.setHours(0,0,0,0);
  var firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  var startDate = (firstDay.getFullYear()+"-"+((firstDay.getMonth() > 8) ? (firstDay.getMonth() + 1) : ('0' + (firstDay.getMonth() + 1)))+"-"+((firstDay.getDate() > 9) ? firstDay.getDate() : ('0' + firstDay.getDate())));

  var lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  var endDate = (lastDay.getFullYear()+"-"+((lastDay.getMonth() > 8) ? (lastDay.getMonth() + 1) : ('0' + (lastDay.getMonth() + 1)))+"-"+((lastDay.getDate() > 9) ? lastDay.getDate() : ('0' + lastDay.getDate())));
  return [startDate, endDate];
}


function callTeacherLastAttendance(formId, userId, startdate, enddate) {
	//console.log('callTeacherLastAttendance');
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLForHTML('dashboard', 'teacher-last-class'),
		data : JSON.stringify(getRequestForTeacherLastclass(formId, userId,startdate, enddate)),
		dataType : 'json',
		async : true,
		success : function(data) {
		if (data['status'] == '0' || data['status'] == '2') {
			//showMessageTheme2(0, data['message']);
			} else {
			// console.log(data['teacherClass']['teacheClassList']);
			var classlist = data['teacherClass']['teacheClassList'];
			if(classlist!=null){
				var tblHtml='';
				var int=1;
				tblHtml+='<table class="table table-bordered responsive nowrap"><thead><th>sr no.</th><th>Grade</th><th>Duration</th></thead>';
				tblHtml+='<tbody>';
				for(t=0;t<classlist.length;t++){
					tblHtml+='<tr>';
					tblHtml+='<td>'+(int++)+'</td>';
					tblHtml+='<td>'+classlist[t]['standard']+'</td>';
					tblHtml+='<td class="text-center">'+classlist[t]['jobSpentTime']+'</td>';
					tblHtml+='</tr>';
				}
					
				tblHtml+='</tbody>';
				tblHtml+='<tfoot><tr><th></th><th></th><th class="text-center">Total Duration - '+ data['teacherClass']['totaltime']+'</th></tr></tfoot>';
				tblHtml+='</table>';

				$('#mteacherLastClass').html(tblHtml);
				$('#modalTeacherClass').modal('show');
				window.setTimeout(function(){$('#modalTeacherClass').modal('hide');;},8000);
			}
			}
		}
	});
}

function getRequestForTeacherLastclass(formId, userId, startdate, enddate) {
	var monthdate = startAndEndOfMonth();
	if(startdate=='' || startdate==undefined){
        startdate = monthdate[0];
    }
    if(enddate=='' || enddate==undefined){
        enddate = monthdate[1];
    }
    var schoolCalendarRequestDTO = {};
    schoolCalendarRequestDTO['userId'] =userId;
    schoolCalendarRequestDTO['schoolId'] = SCHOOL_ID;
    schoolCalendarRequestDTO['startDate']=startdate;
    schoolCalendarRequestDTO['endDate']=enddate;
    return schoolCalendarRequestDTO;
}


function getNeedAnyHelpForTeacher(userId){
	var postData = {};
	postData['userId'] = userId;
	$.ajax({
		type: "POST",
		contentType: APPLICATION_JSON_VALUE,
		url: getURLForHTML('dashboard', 'need-any-help-teacher'),
		data: JSON.stringify(postData),
		dataType: 'json',
		success: function (data) {
			if (data.status == '0' || data.status == '2' || data.status == '3') {
				if(data.status == '3'){
					redirectLoginPage();
				}
				$('.reserve-seat-wrapper').hide();
			} else {
				if(data.eligible == "Y"){
					if($("body #need-help-slide-wrapper").length == 0){
						$("body").append(getNeedAnyHelpHtml(data.standardId));
					}
					setTimeout(function() {
						needHelpContentShowTeacher(true)
						setTimeout(function() {
							needHelpContentShowTeacher(false)
						}, data.durationTime*1000)
						setInterval(function() {
							needHelpContentShowTeacher(true)
							setTimeout(function() {
								needHelpContentShowTeacher(false)
							}, data.durationTime*1000)
						},(data.timeInterval*1000*60)+ (data.durationTime*1000)) 
					}, data.durationTime*1000)
				}
			}
		}
	});
}

function needHelpContentShowTeacher(needShow) {
	if (needShow) {
		$(".reserve-seat-btn").addClass("slide-out-btn");
		$(".need-help-slide-wrapper").show()
		$(".need-help-slide-wrapper").addClass("slide-in");
		$(".reserve-seat-slide-wrapper").removeClass("slide-in");
	} else {
		$(".need-help-slide-wrapper").removeClass("slide-in");
	}
}
var scrollEventInterval = null;
function scrollEvent(){
	//console.log("scroll")
	if (scrollEventInterval) {
		clearInterval(scrollEventInterval);
		scrollEventInterval = null;
	}
	scrollEventInterval = setInterval(function(){
		var calendarContainer = $('.fc-scroller.fc-time-grid-container');

        var target = $(".live-class-blink").length ? $(".live-class-blink") : $(".upcoming-class-blink");
		if($(".live-class-blink:visible").length>0){
			var target = $(".live-class-blink:visible").first()
		}else if($(".upcoming-class-blink:visible").length>0){
			var target = $(".upcoming-class-blink:visible").first()
		}else if($(".future-class:visible").length>0){
			var category = $(".active_calendar_catergory").attr("data-category");
			var target = $(".fc-event-container ."+category+".future-class").first();
			
		}else{
			var target = $(".fc-event-container .past-class").first();
		}
		// var target = $(".live-class-blink:visible").length ? $(".live-class-blink:visible").first() : $(".upcoming-class-blink:visible").first();
		if (target.length > 0 && calendarContainer.length) {
			calendarContainer.animate({ scrollTop: target.position().top }, 700);
            clearInterval(scrollEventInterval);
        }
    },1500);
}




async function classDetailsOnModal(url) {
	try {
	  const responseData = await getActualURL(url);
	  if (responseData) {
		if (responseData.redirect) {
			window.open(responseData.redirectUrl, '_blank');
		}
		proceedwithControll(url, responseData);
	}
	} catch (error) {
	  console.error("Failed to fetch data:", error);
	}
}

function getActualURL(baseUrl) {
	return new Promise(function(resolve, reject) {
	  $.ajax({
		type: "GET",
		contentType: APPLICATION_JSON_VALUE,
		dataType: 'json',
		url: baseUrl,
		async: true,
		success: function(data) {
		  resolve(data);
		}
	  });
	});
}

function calendarEventBind(){
	$(document).on('click', '.fc-day-header, .fc-next-button, .fc-prev-button, .fc-agendaDay-button, .fc-agendaWeek-button', function () {
		// if(getSession()){
		
		// 	var viewName = $('#schoolcalendar').fullCalendar('getView').name;
		// 	var b = $('#schoolcalendar').fullCalendar('getDate');
		// 	var startdate = b.format('YYYY-MM-DD');
		// 	var enddate = b.format('YYYY-MM-DD');
		// 	if(viewName === 'agendaDay' || viewName == "listDay") {
	
		// 	} else if(viewName === 'agendaWeek' || viewName === 'listWeek') {
		// 		const today = new Date(startdate);
		// 		const dates = startAndEndOfWeek(today);
		// 		startdate = dates[0];
		// 		enddate = dates[1];
		// 	} 
		// 	// else if (viewName === 'month') {
		// 	// 	const today = new Date(startdate);
		// 	// 	const dates = startAndEndOfMonth(today);
		// 	// 	startdate = dates[0];
		// 	// 	enddate = dates[1];
		// 	// }
		// 	callSchoolCalendar('', USER_ID, UNIQUEUUID, viewName, startdate, enddate, true)
		// }else{
		// 	redirectLoginPage();
		// }
		// if(getSession()){
			
		// }else{
		// 	redirectLoginPage();
		// }
	});
}

function calendarRequestByFilter(src){
	$(".calendar_request_button").removeClass("active_calendar_catergory")
	$(src).addClass("active_calendar_catergory");
	var category = $(".active_calendar_catergory").attr("data-category");
	if(category == "ALL"){
		$("#schoolcalendar .fc-event-container .fc-time-grid-event").show();
	}else if(category == "BATCH"){
		$("#schoolcalendar .fc-event-container .fc-time-grid-event").hide();
		$("#schoolcalendar .fc-event-container .BATCH").show();
	}else if(category == "ONE_TO_ONE"){
		$("#schoolcalendar .fc-event-container .fc-time-grid-event").hide();
		$("#schoolcalendar .fc-event-container .ONE_TO_ONE").show();
	}else if(category == "CLASS"){
		$("#schoolcalendar .fc-event-container .fc-time-grid-event").hide();
		$("#schoolcalendar .fc-event-container .CLASS").show();
	}else if(category == "ACTIVITY"){
		$("#schoolcalendar .fc-event-container .fc-time-grid-event").hide();
		$("#schoolcalendar .fc-event-container .ACTIVITY").show();
	}
	scrollEvent();
}


function proceedwithControll(url, response){
	if (response['status'] == '0' || response['status'] == '2' || response['status'] == '3') {
		if (response['status'] == '3') {
			redirectLoginPage();
		} else {
            if(response['message']){
                var message=response['message'];
                if('Too many attempts. Please try after some time'==message){
                    message='Please click on the class again'
                }
               showMessageTheme2(1, message);
            }else{
                if(response['dateStatus']=='past' || response['dateStatus']=='future'){
                    $('#classJoinInSameWindowModal').modal({backdrop: 'static', keyboard: false});
                    $('#classTime').html(response['classDate']);
                    $('#className').html(response['className']);
                    $('#subjectName').html(response['subjectName']);
                    if(response['userRole']!='TEACHER'){
                        $('#classJoinInSameWindowBody').html(calendarMeetingLinkValidateStudent(url, response));
                    }else{
                        $('#classJoinInSameWindowBody').html(calendarMeetingLinkValidateTeacher(url, response));
                    }
                }
            }
		}
	} else {
		if(response['dateStatus']=='between'){
        var classUrl=response['redirectUrl'];
        $('#classJoinInSameWindowModal').modal({backdrop: 'static', keyboard: false});
        $('#classJoinInSameWindowBody').html(calendarMeetingLinkValidateStudent(classUrl, response));
        window.setTimeout(function () { $('#classJoinInSameWindowModal').modal('hide');}, response['meetingJoinModalHideMin']*1000);
        window.open(classUrl,"_blank");
		}
	}
}

function calendarMeetingLinkValidateStudent(url, response){
	var warringMessage=false;
	if(response['dateStatus']=='past'){
		warringMessage=true;
	}else if(response['dateStatus']=='future'){
		warringMessage=true;
	}
	var html = 
	  `<div id="classJoinWaringDiv">`
	   	if(warringMessage){
			if(response.classType == 'SYS-TRAINING'){
				html+=`<div id="classWaringMessage" class="full text-center my-4">
					<h5>The ${response.className} | ${response.subjectName} is scheduled for ` + response.classDate + `.</h5>
					<h5>You can join the training on ${response.canJoindateStart}.</h5>
				</div>`;
			}else{
				html+=`<div id="classWaringMessage" class="full text-center my-4">
					<h5>The class ${response.className} | ${response.subjectName} is scheduled for ` + convertDatetimeWithFormat((response.classDate), response.classTimezone, USER_TIMEZONE, DISPLAY_DATE_AND_TIME) + `.</h5>
					<h5>You can join the class on `+ convertDatetimeWithFormat((response.canJoindateStart), response.classTimezone, USER_TIMEZONE, DISPLAY_DATE_AND_TIME) + `.</h5>
				</div>`;
			}
	  	}
		if(!warringMessage){
		  html+=`
			${response.joinType == "H" ?
			  `
				<h6 class="text-center">The class ${response.className} is scheduled for ` + convertDatetimeWithFormat((response.classDate), response.classTimezone, USER_TIMEZONE, DISPLAY_DATE_AND_TIME) + `</h6>
				<a target="_blank" id="classJoinWaring" href="${url}" onclick="autodiposeModel('classJoinInSameWindowModal')" class="btn btn-sm rounded mt-2 mx-auto" style="background-color: #027FFF; box-shadow: 0px 0px; padding: 5px 10px; display: flex; width: max-content; font-weight: bold; color: white;">Join Class Now</a>
				<hr style="border-top: 2px dashed #cdcdcd;">
				<h6 class="text-center">If you face issues with joining, copy the host link below and paste it into a new tab on your browser:</h6>
				<p class="copy-msg-0 mt-3 mb-0" style="text-align: center; font-weight: bold;"></p>
				${DEPLOYMENT_MODE != "PROD" ?
				  `
					<textarea style="width:100%;height:100px;">${url}</textarea>
				  `
				  :
				  `
					<input style="opacity:0;height:0px;display:none;">
				  `
				}
				<button value="${url}" class="btn btn-sm btn-success rounded mt-2 mx-auto align-items-center" style="border: 0px; box-shadow: 0px 0px; padding: 5px 10px; display: flex; width: max-content; font-weight: bold;" onclick="copyURL('copyURL0','copy-msg-0')"><i class="fa fa-clone" style="font-size: 14px;"></i>&nbsp;Copy Class Link</button>
				<div style="top:0;left:0;position:absolute;">
				  <input type="text" id="copyURL0" value="${url}" style="opacity:0;height:0px">
				</div>
				<hr style="border-top: 2px dashed #cdcdcd;">
				<h6 class="text-center">If your student has trouble joining, share the class link below with them:</h6>
				<p class="copy-msg-1 mt-3 mb-0" style="text-align: center; font-weight: bold;"></p>
				${DEPLOYMENT_MODE != "PROD" ?
				  `
					<textarea style="width:100%;height:100px;">${response.commonJoinUrlOfSMS}</textarea>
				  `
				  :
				  `
					<input style="opacity:0;height:0px;display:none;">
				  `
				}
				<button value="${response.commonJoinUrlOfSMS}" class="btn btn-sm rounded mt-2 mx-auto align-items-center text-white" style="border: 0px; box-shadow: 0px 0px; padding: 5px 10px; display: flex; width: max-content; font-weight: bold; background-color: #DFAE00;" onclick="copyURL('copyURL1','copy-msg-1')"><i class="fa fa-clone" style="font-size: 14px;"></i>&nbsp;Copy Student's Class Link</button>
				<div style="top:0;left:0;position:absolute;">
				  <input type="text" id="copyURL1" value="${response.commonJoinUrlOfSMS}" style="opacity:0;height:0px">
				</div>
			  `
			  :
			  `
				<h6 class="text-center">The class ${response.className} is scheduled for ` + convertDatetimeWithFormat((response.classDate), response.classTimezone, USER_TIMEZONE, DISPLAY_DATE_AND_TIME) + `</h6>
				<a target="_blank" id="classJoinWaring" href="${url}" onclick="autodiposeModel('classJoinInSameWindowModal')" class="btn btn-sm rounded mt-2 mx-auto" style="background-color: #027FFF; box-shadow: 0px 0px; padding: 5px 10px; display: flex; width: max-content; font-weight: bold; color: white;">Join Class Now</a>
				<hr style="border-top: 2px dashed #cdcdcd;">
				<h6 class="text-center">If you are facing issues with joining, copy the class link below and paste it into a new tab on your browser:</h6>
				<p class="copy-msg-0 mt-3 mb-0" style="text-align: center; font-weight: bold;"></p>
				${DEPLOYMENT_MODE != "PROD" ?
				  `
					<textarea style="width:100%;height:100px;">${url}</textarea>
				  `
				  :
				  `
					<input style="opacity:0;height:0px;display:none;">
				  `
				}
				<button value="${url}" class="btn btn-sm btn-success rounded mt-2 mx-auto align-items-center" style="border: 0px; box-shadow: 0px 0px; padding: 5px 10px; display: flex; width: max-content; font-weight: bold;" onclick="copyURL('copyURL0','copy-msg-0')"><i class="fa fa-clone" style="font-size: 14px;"></i>&nbsp;Copy Class Link</button>
				<div style="top:0;left:0;position:absolute;">
				  <input type="text" id="copyURL0" value="${url}" style="opacity:0;height:0px">
				</div>
			  `
			}`;
		}
	html+=`</div>`
	return html;
}

function calendarMeetingLinkValidateTeacher(url, response) {
	var warringMessage = false;
	if (response["dateStatus"] == "past") {
	  	if (response["pastClassWarning"]) {
			warringMessage = true;
	  	}
	} else if (response["dateStatus"] == "future") {
	  	if (response["futureClassWarning"]) {
			warringMessage = true;
	  	}
	}
	if (warringMessage) {
	  	var jfmUrl = url + "?jfm=Y";
	  	var html =
		`<div class="full text-center mb-2">
			  <h5 class="font-weight-bold">You are about to start the following class:</h5>
		  </div>
		  <div id="classJoinWaringDiv">
			  <div id="classWaringMessage" class="full text-center my-4">
				  <h5>The class ` + convertDatetimeWithFormat(response.classDate, response.classTimezone, USER_TIMEZONE, DISPLAY_DATE_AND_TIME) + ` | ` + response.className + ` | ` + response.subjectName + `</h5>
				  <h5>The current time does not match this scheduled class time. Do you still wish to proceed?</h5>
			  </div>
			  <div class="full text-center mt-2">
				  <button type="button" class="btn btn-outline-dark font-size-lg" data-dismiss="modal">No</button>
				  <a id="classJoinWaring" href="javascript:void(0)" class="btn btn-primary font-size-lg" onclick="classDetailsOnModal('` +
		jfmUrl +
		`')"> Start Class</a>
			  </div>
		  </div>`;
	  return html;
	}
	var html =
	  `<div id="classJoinWaringDiv">
		  <div id="classWaringMessage" class="full text-center my-4">
			  <h5>The class ` + response.className + ` is scheduled for ` + convertDatetimeWithFormat(response.classDate, response.classTimezone, USER_TIMEZONE, DISPLAY_DATE_AND_TIME) + `.</h5>
			  <h5>You can start the class on ` + convertDatetimeWithFormat(response.canJoindateStart, response.classTimezone, USER_TIMEZONE, DISPLAY_DATE_AND_TIME) + `.</h5>
		  </div>
	  </div>`;
	return html;
}

function calendarMeetingLinkValidate(){
	var html =
	    `<div class="calendarClassDetails modal fade" id="classJoinInSameWindowModal" tabindex="-1" role="dialog" aria-labelledby="classJoinInSameWindowModalLabel" aria-hidden="true">
			<div class="modal-dialog modal-lg">
				<div class="modal-content" style="border-radius: 16px !important;">
					<div class="modal-header py-2 bg-primary" style="border-radius: 16px 16px 0px 0px;">
						<div class="d-flex justify-content-between align-items-center w-100">
              				<h5 class="modal-title text-white d-flex align-items-center" style="gap:5px;">
                				<i class="fa fa-info-circle" aria-hidden="true"></i>
                				Information
              				</h5>
             				<button type="button" class="btn btn-sm bg-transparent" data-dismiss="modal" style="box-shadow: 0px 0px; padding: 8px; font-weight: bold;"><i class="fa fa-times" style="font-size: 18px; color: #FFF;" aria-hidden="true"></i></button>
            			</div>
					</div>
					<div id="classJoinInSameWindowBody" class="modal-body py-4"></div>
				</div>
			</div>
		</div>`;
  	return html;
}