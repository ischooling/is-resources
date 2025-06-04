var DATE_UTC='YYYY-MM-DD';
var TIME_UTC='HH:mm:ss';
var DATETIME_UTC_FORMATTER=DATE_UTC+' '+TIME_UTC;
var TIME_FORMATTER='hh:mm:ss a'
var DISPLAY_TIME_FORMATTER='hh:mm A'
var DATETIME_FORMATTER='YYYY-MM-DD'+' '+TIME_FORMATTER;
var DISPLAY_DATE_FORMATTER='DD MMM, YYYY'
var DISPLAY_DATE_FORMATTER_COMPLETE='ddd, DD MMM, YYYY'
var DISPLAY_DATETIME_FORMATTER=DISPLAY_DATE_FORMATTER_COMPLETE+' '+DISPLAY_TIME_FORMATTER
var DISPLAY_DATETIME_FORMATTER_WITHOUT_DAY =DISPLAY_DATE_FORMATTER+' '+DISPLAY_TIME_FORMATTER
var DISPLAY_DATE_ONLY='MMM D, YYYY'
var DISPLAY_DATE_AND_TIME=DISPLAY_DATE_ONLY+' '+DISPLAY_TIME_FORMATTER
var momentGlobal='';
var baseTimezone='';
function renderTimzoneConverter(){
	momentGlobal=getUTCTime();
	$('#timeZoneCalCulatorModal').remove();
	var html=
	'<div class="modal fade fade-scale py-3" id="timeZoneCalCulatorModal" tabindex="-1" data-backdrop="static">'
		+'<div class="modal-dialog modal-lg h-100 m-auto p-0" role="document">'
			+'<div class="modal-content text-center h-100">'
				+'<div class="modal-header pt-2 pb-2 bg-primary text-white justify-content-center" style="'+(tt=="theme1"?"min-height:inherit !important":"")+'">'
					+'<h5 class="heading" id="warningMessage">Time Zone Converter</h5>'
					+'<button type="button" class="close text-white" data-dismiss="modal"aria-label="Close">'
						+'<span aria-hidden="true">&times;</span>'
					+'</button>'
				+'</div>'
				+'<div class="modal-body overflow-auto" style="'+(tt=="theme1"?"overflow-y:auto !important":"")+'">'
					+'<div class="full mt-3">'
						+'<ul class="current-timezone-list-ul m-0 p-0">'
						+'</ul>'
					+'</div>'
					+'<div class="w-100 search-country-wrapper position-relative" style="'+(tt=="theme1"?"float:left":"")+'">'
						+'<div class="d-flex flex-wrap">'
							+'<span class="w-100 d-flex flex-sm-nowrap flex-wrap justify-content-end align-items-center" style="gap:10px">'
								+'<input type="text" class="form-control" id="sarchByValue" name="sarchByValue" style="width: 100%;" placeholder="Search for a city...">'
								+'<a href="javascript:void(0)" class="btn btn-primary '+(tt=="theme1"?"btn-sm":"btn-lg")+'" onclick="renderSearchData()">Search</a>'
							+'</span>'
						+'</div>'
						+'<div class="w-100 position-relative">'
							+'<ul class="m-0 p-0 border overflow-y-auto position-absolute w-100 bg-white" id="countryStateCitySuggestionList" style="display:none;max-height:250px;top:0;left:0;z-index:1;'+(tt=="theme1"?"overflow-y:auto !important":"")+'"></ul>'
						+'</div>'
					+'</div>'
					+'<div class="full">'	
						+'<hr/>'
					+'</div>'
					+'<div class="w-100" id="currentTimeOfUTC-and-removeAll-wrapper" style="display:none; '+(tt=="theme1"?"float:left":"")+'">'
						+'<div class="d-flex justify-content-between">'
							+'<a href="javascript:void(0)" id="currentTimeOfUTC" class="btn btn-primary '+(tt=="theme1"?"btn-sm":"")+'" onClick="renderCurrentTimeOfUTC()">Current Time</a>'
							+'<span id="currentTimeOfUTCValue" style="display:none;"></span>'
							+'<a href="javascript:void(0)" class="btn btn-outline-danger '+(tt=="theme1"?"btn-sm":"")+'" id="removeAllTimezoneBtn" onclick="removeAllTimeZone(\'timezone-list-ul\')">'
								+'<i class="fa fa-trash mr-1"></i>Remove All'
							+'</a>'
						+'</div>'
					+'</div>'
					+'<div class="full mt-3">'
						+'<ul class="timezone-list-ul m-0 p-0">'
						+'</ul>'
					+'</div>'
				+'</div>'
			+'</div>'
		+'</div>'
	+'</div>';
	$('body').append(html);
	renderCurrentTimeOfUTC();
	getCurrentTimezoneContent();
	$('#timeZoneCalCulatorModal').modal({ backdrop: 'static', keyboard: false });
}

function renderSingleTimezone(results){
	var countryStateCityList = $('#countryStateCitySuggestionList');
	countryStateCityList.empty();
	if (results.length) {
		results.forEach(function(item) {
			countryStateCityList.append(countryStateCitySuggestionList(item));
		});
	} else {
		countryStateCityList.append('<li style="padding: 5px; border-bottom: 1px solid #ccc;">No results found</li>');
	}
	countryStateCityList.show();
	customLoader(false);
}

function countryStateCitySuggestionList(results){
	html=
	'<li class="border-bottom bg-light-gray px-2 bg-light-primary" id="'+results.iso2+'-TIMEZONE">'
		+'<a href="javascript:void(0)" class="d-flex flex-wrap" onclick="selectTimeZone(event,\''+results.location.lng+'\',\''+results.location.lat+'\',\''+btoa(results.formatted_address)+'\',\''+results.iso2+'\')">'
			+'<div class="satate-and-city">'
				// +'<span class="city full text-primary text-left">'+results.city+'</span>'
				+'<span class="state-and-country full text-dark text-left ml-2">'
					+results.formatted_address
					// +'<label class="m-0">'+results.country+'</label>' 
				+'</span>'
			+'</div>'
			+'<span class="ml-auto">'
				+'<img src="'+PATH_FOLDER_FONT2+results.iso2+'.svg"/>'
			+'</span>'
		+'</a>'
	+'</li>';
	return html;
}

function selectTimeZone(e, lng, lat, formatted_address, iso2){
	$('#countryStateCitySuggestionList').hide();
	$('.timezone-list-ul').append(singleTimezone(lng, lat, formatted_address, iso2,true));
	$(".date-picker").datepicker({
		format:"D, d M, yyyy"
	});
	$('#sarchByValue').val("");
	renderAllTimezone();
	$("#currentTimeOfUTC-and-removeAll-wrapper").show();
	// var container = $("#countryStateCitySuggestionList > li");
	// if(!container.is(e.target) && container.has(e.target).length === 0 ){
	//     container.hide();
	// }
}

function singleTimezone(lng, lat, formatted_address, iso2,deleteButtonRequired){
	var res=getTimezoneByLatLon(lng, lat);
	var timezone=res.timeZoneId;
	formatted_address=atob(formatted_address)
	var elementId=formatted_address.replaceAll('(','_').replaceAll(')','_').replaceAll(' ','_').replaceAll(',','_').replaceAll('\'','_').replaceAll('ʻ','_')+'-TIMEZONE';
	$('#'+elementId).remove();
	var data=convertUTCToTimezoneAsObject(momentGlobal,DATETIME_FORMATTER,timezone)
	var html=
	'<li class="timezone-list-li border py-2 mb-2 card" id="'+elementId+'" timezone='+data.timezone+'>'
		+'<div class="d-flex flex-wrap">'
			+'<div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 text-left mb-2">'
				+'<div class="d-flex align-items-center flex-wrap justify-content-center justify-content-sm-start ">'
					+'<span class="flag d-inline-block mr-2" style="background:url('+PATH_FOLDER_FONT2+iso2+'.svg);height: 38px;width: 50px;background-size: 50px 38px;"></span>'
					+'<span class="d-inline-block col-sm-auto col-12 p-0 mt-sm-0 mt-2">'
						+'<h4 class="m-0 font-weight-semi-bold  font-size-lg">'
							+'<label class="city-name text-primary m-0">'+(formatted_address)+'</label>'
							// +'<label class="country-name m-0">'+country+'</label>'
						+'</h4>'
						+'<hr class="my-1"/>'
						+'<div class="country-UTC">UTC '+data.offset+' '+data.aheadBehind+'</div>'
					+'</span>'
				+'</div>'
			+'</div>'
			+renderSingleContent(elementId,deleteButtonRequired)
		+'</div>'
	+'</li>';
	return html;
}

function renderAllTimezone(){
	$('.timezone-list-li').each(function(){
		var timezone=$(this).attr('timezone');
		if(timezone!=undefined){
			var data=convertUTCToTimezoneAsObject(momentGlobal,DATETIME_FORMATTER,timezone);
			$(this).find('.date').val(data.date).datepicker("update");
			$(this).find('.hoursc').val(data.hours);
			$(this).find('.mins').val(data.mins);
			$(this).find('.ampm').val(data.ampm);
		}
	})
	// $('.current-timezone-list-ul > li').each(function(){
	// 	var timezone=$(this).attr('timezone');
	// 	if(timezone!=undefined){
	// 		var data=convertUTCToTimezoneAsObject(momentGlobal,DATETIME_FORMATTER,timezone);
	// 		$(this).find('.date').val(data.date).datepicker("update");
	// 		$(this).find('.hoursc').val(data.hours);
	// 		$(this).find('.mins').val(data.mins);
	// 		$(this).find('.ampm').val(data.ampm);
	// 	}
	// })
}

function renderSingleContent(elementId, deleteButtonRequired){
	var html=
	'<div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 text-left mb-1">'
		+'<div class="singleDateAndTime d-flex align-items-center h-100 flex-md-nowrap flex-wrap justify-content-end" style="gap:10px">'
			+'<span class="country-date w-100">'
				+'<input name="date" id="date" type="text" class="date date-picker form-control font-weight-semi-bold text-primary" value="" onchange="updateTime(this)">'
			+'</span>'
			+'<span class="country-time d-flex col-sm-6 p-0" style="min-width: 140px; gap:10px">'
				+'<select name="hour" id="hour" class="hoursc form-control" onchange="updateTime(this)">'
					+getHourMinsContent(1,12,'')
				+'</select>'
				+'<select name="mins" id="mins" class="mins form-control" onchange="updateTime(this)">'
					+getHourMinsContent(0,59,'')
				+'</select>'
				+'<select name="ampm" id="ampm" class="ampm form-control" onchange="updateTime(this)">'
					+getAmPm('')
				+'</select>'
			+'</span>';
			if(deleteButtonRequired){
				html+=
				'<a href="javascript:void(0)" class="btn btn-outline-danger '+(tt=="theme1"?"btn-sm":"")+'" onclick="removeSingleTimeZone(\''+elementId+'\')">'
					+'<i class="fa fa-trash"></i>'
				+'</a>';
			}
			html+=
		'</div>'
	+'</div>';
	return html;
}

function getHourMinsContent(start, end, preselect){
	var html='';
	for(var index=start;index<=end;index++){
		var optionValue=index>9?index:'0'+index;
		html+='<option value="'+optionValue+'" '+(optionValue==preselect?'selected':'')+'>'+optionValue+'</option>';
	}
	return html;
}

function removeSingleTimeZone(timeZoneID){
	$("#"+timeZoneID).remove();
	if($(".timezone-list-ul li").length >= 1){
		$("#currentTimeOfUTC-and-removeAll-wrapper").show();
	}else{
		$("#currentTimeOfUTC-and-removeAll-wrapper").hide();
	}
}

function getAmPm(preselect){
	var html=
	'<option value="am" '+('am'==preselect?'selected':'')+'>AM</option>'
	+'<option value="pm" '+('pm'==preselect?'selected':'')+'>PM</option>';
	return html;
}


function removeAllTimeZone(timeZoneWrapperCls){
	$("."+timeZoneWrapperCls).html('');
	$("#currentTimeOfUTC-and-removeAll-wrapper").hide();
}
function renderSearchData(){
	var searchVal = $('#sarchByValue').val().toLowerCase();
	if(searchVal!='' && searchVal.length >=3 ){
		customLoader(true);
		var results=searchFromJSON(searchVal);
		renderSingleTimezone(results);
		// if(results.length>0){
		// 	for (var i=0 ; i < results.length ; i++){
		// 		renderSingleTimezone(results[i]);
		// 	}
		// }
	}else if(searchVal.length <1){
		showMessageTheme2(0, "City name is required");
		$("#countryStateCitySuggestionList").html("");
	}
}

function updateTime(src){
	var id=$(src).attr('id');
	var date='';
	var hour='';
	var mins='';
	var ampm='';
	var timezone=$(src).parent().parent().parent().parent().parent().attr('timezone');
	if(id=='date'){
		date=$(src).val();
		hour=$(src).parent().parent().find('.hoursc').val();
		mins=$(src).parent().parent().find('.mins').val();
		ampm=$(src).parent().parent().find('.ampm').val();
	}else if(id=='hour'){
		date=$(src).parent().parent().find('.date').val();
		hour=$(src).val();
		mins=$(src).parent().find('.mins').val();
		ampm=$(src).parent().find('.ampm').val();
	}else if(id=='mins'){
		date=$(src).parent().parent().find('.date').val();
		hour=$(src).parent().find('.hoursc').val();
		mins=$(src).val();
		ampm=$(src).parent().find('.ampm').val();
	}else if(id=='ampm'){
		date=$(src).parent().parent().find('.date').val();
		hour=$(src).parent().find('.hoursc').val();
		mins=$(src).parent().find('.mins').val();
		ampm=$(src).val();
	}
	
	var dateTime=date+' '+hour+':'+mins+':00'+' '+ampm
	// console.log('dateTime '+dateTime)
	m=convertLocalToUTCAs(dateTime,DISPLAY_DATETIME_FORMATTER,timezone);
	momentGlobal=m.format(DATETIME_FORMATTER);
	// console.log('momentGlobal '+momentGlobal)
	$('#currentTimeOfUTCValue').html(momentGlobal);

	var mCurrent = moment.tz(dateTime, DISPLAY_DATETIME_FORMATTER, timezone);
	offset=mCurrent.format('Z');
	$(src).parent().parent().parent().parent().parent().find('.country-UTC').text('UTC '+offset);
	renderAllTimezone();
}

function convertUTCToTimezoneAsObject(utcDt, utcDtFormat, timezone) {
	var m=convertUTCToTimezoneAs(utcDt, utcDtFormat, timezone);
	var data={};
	data['date']=m.format(DISPLAY_DATE_FORMATTER)
	data['hours']= m.format('hh');
	data['mins']=m.format('mm');
	data['sec']=m.format('ss');
	data['ampm']=m.format('a');
	data['offset']=m.format('Z');
	data['timezone']=m.tz();

	var baseTime=convertUTCToTimezoneAs(utcDt, utcDtFormat, baseTimezone);
	var mins = baseTime.diff(m, 'minutes');
	data['aheadBehind']=aheadBehind(mins);
	return data;
}

function convertUTCToTimezone(utcDt, utcDtFormat, timezone) {
	return convertUTCToTimezoneAs(utcDt, utcDtFormat, timezone).format(DATETIME_FORMATTER);
}

function convertUTCToTimezoneAs(utcDt, utcDtFormat, timezone) {
	return moment.utc(utcDt, utcDtFormat).tz(timezone);
}

function convertLocalToUTC(dateTime, datetimeFormat, timezone) {
	return convertLocalToUTCAs(dateTime, datetimeFormat, timezone).format(DATETIME_FORMATTER);
}

function convertLocalToUTCWithFormat(dateTime, timezone, datetimeFormat) {
	return convertLocalToUTCAs(dateTime, DATETIME_UTC_FORMATTER, timezone).format(datetimeFormat);
}

function convertLocalToUTCAs(dateTime, datetimeFormat, timezone) {
	return moment.tz(dateTime, datetimeFormat, timezone).utc();
}

function convertTime(dateTime, datetimeFormat, fromTimezone, toTimezone, outputDateFormat, outputTimeFormat){
	var m=moment.utc(moment.tz(dateTime, datetimeFormat, fromTimezone).utc()).tz(toTimezone)
	var data={};
	data['date']=m.format(outputDateFormat)
	data['time']=m.format(outputTimeFormat)
	data['hours']= m.format('hh');
	data['mins']=m.format('mm');
	data['sec']=m.format('ss');
	data['ampm']=m.format('a');
	data['offset']=m.format('Z');
	data['timezone']=m.tz();
}

function convertU2L(dateTime, toTimezone, outputDateFormat){
	var m=moment.utc(moment.tz(dateTime, DATETIME_UTC_FORMATTER, 'UTC').utc()).tz(toTimezone);
	return m.format(outputDateFormat)
}

function convertDatetimeWithFormat(dateTime, fromTimezone, toTimezone, outputDateFormat){
	var sgtTime=moment.tz(dateTime, fromTimezone);
	var localTime=sgtTime.clone().tz(toTimezone);
	return localTime.format(outputDateFormat);
}
function getUTCTime(){
	momentGlobal=moment().utc().format(DATETIME_FORMATTER).toString();
	return momentGlobal;
}

function renderCurrentTimeOfUTC(){
	getUTCTime()
	$('#currentTimeOfUTCValue').html(momentGlobal);
	renderAllTimezone();
}

function searchFromJSON(searchVal){
	var countryStateCities=getCountriesStatesCities(searchVal);
	return countryStateCities.results;
}

$(document).mouseup(function(e){
	var container = $("#countryStateCitySuggestionList > li");
	var serachInput = $("#sarchByValue");
	if(!container.is(e.target) && container.has(e.target).length === 0 && !serachInput.is(e.target) && serachInput.has(e.target).length === 0){
		container.hide();
	}
});

function getDefaultLocation(){
	return getActualData();
}

function getCurrentTimezoneContent(){
	var res=getDefaultLocation();
	baseTimezone=res.timezone;
	var formatted_address=btoa(res.city+', '+res.country);
	$('.current-timezone-list-ul').append(singleTimezone(res.lon, res.lat, formatted_address, res.countryCode, false));
	$(".date-picker").datepicker({
		format:"D, d M, yyyy"
	});
	renderAllTimezone();
}

function aheadBehind(mins){
	if(mins==0){
		return '';
	}
	var suffix=' hour(s) ahead';
	if(mins<0){
		suffix=' hour(s) behind';
	}
	mins=Math.abs(mins);
	var hours=getHoursMins(mins)
	return hours+suffix;
}

function getHoursMins(mins){
	var hours = Math.trunc(mins/60);
	var minutes = mins % 60;
	return hours +":"+ minutes;
}

function getCountriesStatesCities(text){
	var responseData={};

	var data={};
	data['text']=text;

	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLFor('country-state-city',''),
		data : JSON.stringify(data),
		dataType : 'json',
		async: false,
		success : function(data) {
			responseData=data
		}
	});
	return responseData;
}

function getTimezoneByLatLon(lng, lat){
	var responseData={};

	var data={};
	data['lng']=lng;
	data['lat']=lat;

	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLFor('timezone-by-lat-lon',''),
		data : JSON.stringify(data),
		dataType : 'json',
		async: false,
		success : function(data) {
			responseData=data
		}
	});
	return responseData;
}