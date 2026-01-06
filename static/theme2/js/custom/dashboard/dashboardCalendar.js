
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
						// events.sort((a, b) => new Date(a.start) - new Date(b.start));
						events.forEach(obj => {
							if(obj.id.startsWith("announce", 0) || obj.id.startsWith("holiday", 0)){
								finalEvents.push(obj);
							}else{
								obj.start = convertDatetimeWithFormat(obj.start, obj.timezone, USER_TIMEZONE, DATE_UTC+'T'+TIME_UTC);
								obj.end = convertDatetimeWithFormat(obj.end, obj.timezone, USER_TIMEZONE, DATE_UTC+'T'+TIME_UTC);
								var baseDate=obj.start.split('T')[0];
								if($.inArray(baseDate,data.holidays)<0){
									finalEvents.push(obj);
								}
							}
						});
					}
					$('#schoolcalendar').fullCalendar('removeEvents')
					//$('#schoolcalendar').fullCalendar('destroy');
					getFullCalendar(finalEvents, viewName, formId, userId, UNIQUEUUID, viewName, startdate, enddate, flag);
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
                }
            }
        });
    });
}
// function callSchoolCalendar(formId, userId, UNIQUEUUID, viewName, startdate, enddate, flag) {

//     return new Promise((resolve, reject) => {
//         $.ajax({
//             type: "POST",
//             contentType: APPLICATION_JSON_VALUE,
//             url: getURLForHTML('dashboard', 'school-calendar'),
//             data: JSON.stringify(getRequestForSchoolCalendar(formId, userId, UNIQUEUUID, viewName, startdate, enddate)),
//             dataType: 'json',
//             cache: false,
//             timeout: 600000,
//             async: true,
//             success: function (data) {
//                 if (data.status === '0' || data.status === '2') {
//                     showMessageTheme2(0, data.message);
//                     resolve([]);
//                 } else if (data.status === '3') {
//                     redirectLoginPage();
//                     reject('Redirected to login');
//                 } else {
//                     var finalEvents = [];
//                     var events = data.event || [];
//                     if (events.length > 0) {
//                         events.forEach(obj => {
//                             if (obj.id.startsWith("announce", 0) || obj.id.startsWith("holiday", 0)) {
//                                 finalEvents.push(obj);
//                             } else {
//                                 obj.start = convertDatetimeWithFormat(obj.start, obj.timezone, USER_TIMEZONE, DATE_UTC + 'T' + TIME_UTC);
//                                 obj.end = convertDatetimeWithFormat(obj.end, obj.timezone, USER_TIMEZONE, DATE_UTC + 'T' + TIME_UTC);
//                                 var baseDate = obj.start.split('T')[0];
//                                 if ($.inArray(baseDate, data.holidays) < 0) {
//                                     finalEvents.push(obj);
//                                 }
//                             }
//                         });
//                     }

//                     // Your original logic with fixes
//                     $('#schoolcalendar').fullCalendar('removeEvents');
                    
//                     // Only call getFullCalendar if it's the first time or if needed
//                     if (!CALENDAR_EVENT) {
//                         getFullCalendar(finalEvents, viewName, formId, userId, UNIQUEUUID, viewName, startdate, enddate);
//                     } else {
//                         $('#schoolcalendar').fullCalendar('addEventSource', finalEvents);
//                     }
                    
//                     if (flag) {
//                         $("#schoolcalendar").fullCalendar('addEventSource', finalEvents);
//                     }
                    
//                     resolve(finalEvents);
                    
//                     if ($('#schoolcalendar').fullCalendar('getView').name == "agendaWeek") {
//                         $(".upcoming-icon").addClass("upcoming-week-view-icon");
//                         $(".live-class-blink .live-symbol").addClass("live-week-view-icon");
//                     } else {
//                         $(".upcoming-icon").removeClass("upcoming-week-view-icon");
//                         $(".live-class-blink .live-symbol").removeClass("live-week-view-icon");
//                     }
//                 }
//             }
//         });
//     });
// }



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
	calendarTimeInterval()
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
function getFullCalendar(CALENDAR_EVENT_DATA, viewName, formId, userId, UNIQUEUUID, viewName, startdate, enddate) {
    todayClassArray = [];
    var initialView = window.innerWidth < 768 ? 'listDay' : 'agendaDay';

    $("#schoolcalendar").fullCalendar({
        header: {
            left: "prev,next today",
            center: "title",
            right: "agendaDay,agendaWeek"
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
        events: CALENDAR_EVENT_DATA,
        
        // Add these callbacks for v3.10.1 to handle view changes
        viewRender: function(view, element) {
			if(getSession()){
				var currentView = view.name;
				var start = view.start.format('YYYY-MM-DD');
				var end = view.end.format('YYYY-MM-DD');
				// Reload events for the new date range
            	callSchoolCalendar(formId, userId, UNIQUEUUID, currentView, start, end, true);
			}else{
				redirectLoginPage();
			}
		},
        eventClick: function(info) {
            if (info.url) {
                if (getSession()) {
                    classDetailsOnModal(info.url);
                    return false;
                } else {
                    redirectLoginPage();
                }
                return false;
            } else {
                eventDetailsOnModal(info.id, info.title, info.activities);
            }
        },
        
        eventRender: function(event, element) {
            if (!event.id.startsWith("announce", 0) && !event.id.startsWith("holiday", 0)) {
                if (event.start && event.end) {
                    const startStr = event.start.format();
                    const endStr = event.end.format();

                    const eventExists = todayClassArray.some(e =>
                        e.start === startStr &&
                        e.endTime === endStr &&
                        e.title === event.title
                    );

                    if (!eventExists) {
                        todayClassArray.push({
                            start: startStr,
                            endTime: endStr,
                            title: event.title
                        });
                    }
                }
            }
            updateEventIcons(event, element, todayClassArray, viewName);
        },

        eventAfterAllRender: function() {
            if (!scrollEventTriggered) {
                scrollEventTriggered = true;
				scrollEvent();
                setTimeout(function() {
                    scrollEventTriggered = false;
                }, 1500);
            }
        },

        windowResize: function() {
            updateCalendarView();
        }
    });

    CALENDAR_EVENT = true;
    updateCalendarView();
}

$(window).off('resize').on('resize', function() {
	if($('#schoolcalendar').length>0){
		updateCalendarView();
	}
});
function updateCalendarView() {
	if(window.innerWidth < 768) {
		var currentView = $('#schoolcalendar').fullCalendar('getView');
		if(currentView.name == "agendaDay" || currentView.name == "listDay"){
			$('#schoolcalendar').fullCalendar('changeView', 'listDay');
		}
		if(currentView.name == "agendaWeek" || currentView.name == "listWeek"){
			$('#schoolcalendar').fullCalendar('changeView', 'listWeek');
		}
	}else{
		var currentView = $('#schoolcalendar').fullCalendar('getView');
		if(currentView.name == "agendaDay" || currentView.name == "listDay"){
			$('#schoolcalendar').fullCalendar('changeView', 'agendaDay');
		}
		if(currentView.name == "agendaWeek" || currentView.name == "listWeek"){
			$('#schoolcalendar').fullCalendar('changeView', 'agendaWeek');
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

var updateEventIconsStyle = true;
function updateEventIcons(info, element, todayClassArray, viewName) {
	if(updateEventIconsStyle){
		$("head").append('<style>.tooltip-inner{max-width:500px;width:fit-content}.fc-scroller.fc-time-grid-container[style]{height:425px !important}</style>');
		updateEventIconsStyle=false;
	}
	if(todayClassArray.length>0){
		element.attr("data-toggle","tooltip");
		element.attr("data-container","body");
		element.attr("data-html",true);
		element.attr("data-original-title","Class Start Time: "+element.find(".fc-time span").text()+"</br>"+element.find(".fc-title").text());
		setInterval(function() {
			var currentTime = new Date($("#currentTimeForUser").text());
			// console.log(info.start._i + info.end);
			if(info.start!=null && info.end!=null){
				var startTime = new Date(info.start._i);
				var endTime = new Date(info.end._i);
				var currentDate = currentTime.getDate();
				var currentMilliseconds = currentTime.getTime()
				var eventDate = startTime.getDate();
				var eventStartMilliseconds = startTime.getTime();
				var eventEndMilliseconds = endTime.getTime();
				element.find(".live-symbol").remove();
				element.removeClass("live-class-blink");
				element.removeClass("upcoming-class-blink");
				element.find('.live-symbol').remove(); // Remove existing icons
				element.find('.upcoming-icon').remove(); // Remove existing icons
				if(currentMilliseconds >= eventStartMilliseconds && currentMilliseconds <= eventEndMilliseconds) {
					element.find(".fc-time span").find(".upcoming-symbol").remove();
					var liveIcon = $('<b class="d-inline-block pull-right live-symbol font-size-lg">🔴 Live Class</b>'); 
					orignalClassBg = element.css("background-color");
					orignalClassborderColor = element.css("border-color");
					element.find(".fc-time span").append(liveIcon);
					element.addClass("live-class-blink");
				}else if (currentMilliseconds < eventEndMilliseconds && currentMilliseconds < eventStartMilliseconds) {
					if($(".upcoming-class-blink").length < 1){
						var closestEvent = getClosestUpcomingEvent(todayClassArray);
						if (closestEvent && closestEvent.title === info.title) {
							var upcomingIcon=$('<b class="d-inline-block pull-right live-symbol font-size-lg upcoming-icon"> <img style="width:34px;filter:brightness(0) invert(1);left:10px" class="timer-img position-relative"  src="'+PATH_FOLDER_IMAGE2+'timer.gif"/> Upcoming</b>'); 
							element.addClass("upcoming-class-blink");
							element.find(".fc-time span").append(upcomingIcon);
						}
					}
				}
				CAN_SHOW_ENROLL_RESERVE_MODAL = !checkIfAnyClassRunning(todayClassArray);
				$('[data-toggle="tooltip"]').tooltip();
				if($('#schoolcalendar').fullCalendar('getView').name == "agendaWeek"){
					$(".upcoming-icon").addClass("upcoming-week-view-icon");
					$(".live-class-blink .live-symbol").addClass("live-week-view-icon");
				}else{
					$(".upcoming-icon").removeClass("upcoming-week-view-icon");
					$(".live-class-blink .live-symbol").removeClass("live-week-view-icon");
				}
			}
		}, 1000);
		//console.log(todayClassArray);
		if($("#legentCalendar").length<1 && window.innerWidth < 768){
			$("#schoolcalendar .fc-header-toolbar").prepend(
				`<div class="d-flex w-100 flex-wrap justify-content-center mb-1" id="legentCalendar">
					<div class="mb-1 d-inline-flex align-items-center">
						<span class="d-inline-block mr-1" style="width:13px;height:13px;background:green"></span>
						Live Class
					</div>
					<div class="mb-1 d-inline-flex align-items-center">
						<span class="d-inline-block mr-1" style="width:13px;height:13px;background:#453900"></span>
						Upcoming class
					</div>
				</div>`
			);
		}
		
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
        let $target = $(".live-class-blink").length ? $(".live-class-blink") : $(".upcoming-class-blink");
		if ($target.length > 0 && $target.offset()) {
            const scrollTopValue = $target.offset().top - 65;
            $('.fc-scroller.fc-time-grid-container').animate({ scrollTop: scrollTopValue }, 1000);
            clearInterval(scrollEventInterval);
        }
    }, 100);
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
	});
}