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