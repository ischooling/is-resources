function getDateBetweenTweDates(timezone, startDate, endDatetime, startTime, endTime, day) {
	var start = moment(startDate);
	var end = moment(endDatetime);
	var result = [];
	var current = start.clone();
	if (current.day(day).isSameOrAfter(start) && current.isSameOrBefore(end)) {
		result.push(prepareDate(timezone, current, startTime, endTime));
	}
	while (current.day(7 + day).isSameOrAfter(start) && current.isSameOrBefore(end)) {
		result.push(prepareDate(timezone, current, startTime, endTime));
	}
	return result;
}

function prepareDate(timezone, current, startTime, endTime) {
	var singleDate = {};
	var tempStartDate = convertLocalToUTCAs(current.format(DATE_UTC) + ' ' + startTime, DATETIME_UTC_FORMATTER, timezone);
	var tempEndDate = convertLocalToUTCAs(current.format(DATE_UTC) + ' ' + endTime, DATETIME_UTC_FORMATTER, timezone);
	singleDate['startDateTime'] = tempStartDate.format(DATETIME_UTC_FORMATTER);
	singleDate['endDateTime'] = tempEndDate.format(DATETIME_UTC_FORMATTER);
	singleDate['startDayId'] = tempStartDate.day();
	singleDate['endDayId'] = tempEndDate.day();
	return singleDate;
}

function addHourAndMinInDate(hour,min,date){
	var totalMiliSec = ((hour*60)+ parseInt(min))*60*1000;
	return new Date(date.getTime()+totalMiliSec);
}

function getStartAndEndDayOfTypeUTC(timezone, type, currentDate, dateformat) {
	var today = moment(currentDate);
	var from_date = today.clone().startOf(type);
	var to_date = today.clone().endOf(type);
	var singleDate = {};
	var tempStartDate = from_date.format(DATETIME_UTC_FORMATTER);
	singleDate['startDatetime'] = convertLocalToUTCWithFormat(tempStartDate, timezone, dateformat);
	var tempEndDate = to_date.format(DATETIME_UTC_FORMATTER);
	singleDate['endDatetime'] = convertLocalToUTCWithFormat(tempEndDate, timezone, dateformat);
	singleDate['startDayId'] = from_date.day();
	singleDate['endDayId'] = to_date.day();
	return singleDate;
}

function getStartAndEndDayOfType(type, currentDate, dateformat) {
	var today = moment(currentDate);
	var from_date = today.clone().startOf(type);
	var to_date = today.clone().endOf(type);
	var singleDate = {};
	var tempStartDate = from_date.format(dateformat);
	singleDate['startDatetime'] = tempStartDate;
	var tempEndDate = to_date.format(dateformat);
	singleDate['endDatetime'] = tempEndDate;
	singleDate['startDayId'] = from_date.day();
	singleDate['endDayId'] = to_date.day();
	return singleDate;
}

function getCurrentTime(timezone, dateformat){
	return moment().tz(timezone).format(dateformat)
}

function getDayId(currentDate){
	return moment(currentDate).day()
}



function addMonthsToDate(date, months) {
    var newDate = moment(date); // Create a moment object with the given date
    newDate.add(months, 'months'); // Add the specified number of months
    return newDate.format('YYYY-MM-DD'); // Format the new date as a string
}



function getOptimizedDayIdForServer(dayId){
	//0=SUN,1=MON,2=TUE,3=WED,4=THU.5=FRI,6=SAT for Moment
	//1=SUN,2=MON,3=TUE,4=WED,5=THU.6=FRI,7=SAT for Mysql and server
	if(dayId > 6){
		return 7;
	}else{
		return dayId+1
	}
}

function updateDayIdInAllDateTimeObject(object){
	object.forEach(element => {
		element.startDayId = getOptimizedDayIdForServer(element.startDayId);
		element.endDayId = getOptimizedDayIdForServer(element.endDayId);
	});
	return object;
}

function getYear(currentDate){
	var year;
	if(currentDate!=''){
		year=moment(currentDate)
	}
	year=year.format('YYYY')
	return year;
}

function getMonth(currentDate, monthFormat){
	var month;
	if(currentDate!=''){
		month=moment(currentDate)
	}
	month=month.format(monthFormat)
	return month;
}

function getMonthDescription(currentDate) {
	var details={};
	var m;
	if(currentDate!=''){
		m=moment(currentDate)
	}
	details['month']=m.format('MM');
	details['shortName']=m.format('MMM');
	details['name']=m.format('MMMM');
    return details;
}

function getDateAfterNDays(n) {
    const today = new Date();
    today.setDate(today.getDate() + n);

    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();

    return `${year}-${month}-${day}`;
}

function getWeeksBetweenDates(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffInMs = Math.abs(end - start);
    const weeks = diffInMs / (7 * 24 * 60 * 60 * 1000);
    return Math.floor(weeks);
}

function getSaturdayAfterNDays(n) {
    const today = new Date();
    today.setDate(today.getDate() + n);

    const dayOfWeek = today.getDay();
    const daysToSaturday = 6 - dayOfWeek;
    today.setDate(today.getDate() + daysToSaturday);

    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();

    return `${year}-${month}-${day}`;
}

function calculateEndDate(formId, startDateId, durationId, endDateId, type) {
    var startDate = $("#" + formId + " #" + startDateId).val();
    var duration  = parseInt($("#" + formId + " #" + durationId).val());

    if (!startDate || !duration) {
        $("#" + formId + " #" + endDateId).val("");
        return;
    }

    var sDate = new Date(startDate);
    var eDate = new Date(sDate);

    if (type === "YEAR") {
        eDate.setFullYear(sDate.getFullYear() + duration);
    }else if (type === "MONTH") {
		eDate.setMonth(sDate.getMonth() + duration);
	} else if (type === "DAY") {
        eDate.setDate(sDate.getDate() + duration);
    }

    var monthNames = ["Jan","Feb","Mar","Apr","May","Jun", "Jul","Aug","Sep","Oct","Nov","Dec"];

    var day = eDate.getDate();
    if (day < 10) {
        day = "0" + day;
    }

    var endDateFormatted =
        monthNames[eDate.getMonth()] + " " +
        day + ", " + eDate.getFullYear();

    $("#" + formId + " #" + endDateId).val(endDateFormatted);
}

function getWeekDays() {
  return [
	{ dayId: 1, shortName: "Sun", fullName: "Sunday" },
    { dayId: 2, shortName: "Mon", fullName: "Monday" },
    { dayId: 3, shortName: "Tue", fullName: "Tuesday" },
    { dayId: 4, shortName: "Wed", fullName: "Wednesday" },
    { dayId: 5, shortName: "Thu", fullName: "Thursday" },
    { dayId: 6, shortName: "Fri", fullName: "Friday" },
    { dayId: 7, shortName: "Sat", fullName: "Saturday" }
  ];
}

function isExpired(expiredDate) {
    const today = new Date();
    today.setHours(0,0,0,0);
    const exp = new Date(expiredDate);
    exp.setHours(0,0,0,0);
    return exp < today;
}

function minutesTo12Hr(mins) {
    mins = mins % 1440;
    let h = Math.floor(mins / 60);
    let m = mins % 60;
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12;
    if (h === 0) h = 12;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")} ${ampm}`;
}
