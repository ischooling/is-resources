var validatToSaveFlag = true;
var validatToSaveMsg = ''
var overLapmsg='';
var dropdownTimeGap = 15;
var totalGivenTime = [];  
var excludeDates =[];
var dayCounts = [];
var getDaycurrentDate = new Date();
var getDayYear = getDaycurrentDate.getFullYear();
var getDayMonth = getDaycurrentDate.getMonth() + 1
var getDayDate = getDaycurrentDate.getDate();
var daysNum = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

var eventsBasedOnRole={};
function getMinutesFromTime(time) {
    var timeParts = time.split(":");
    var hours = parseInt(timeParts[0], 10);
    var minutes = parseInt(timeParts[1], 10);
    return hours * 60 + minutes;
}

function validateTimes(timeSlotClass, fromClassName, toClassName, userRoleId, min, max, slotBufferLimit) {
	var timeSlots = $('.'+timeSlotClass);//.not('.d-none');
	var errorMessage = $('#errorMessage');
	var times = [];
	var status=true;
	validatToSaveFlag = true;

	timeSlots.not('.d-none').each(function() {
		if($(this).text()=='Unavailable'){
		}else{
			var dynamicDataStatus = $(this).find('.'+fromClassName).attr("data-status");
			var sTime = $(this).find('.'+fromClassName).val();
			var eTime = $(this).find('.'+toClassName).val();
			var strEndStatus=false;
			
				if(sTime!='' && sTime!=null && eTime != '' && eTime !=null){
					let startTime = convertTo24Hour(sTime);
					let endTime = convertTo24Hour(eTime);
					if (startTime && endTime) {
						if (startTime >= endTime) {
							//errorMessage.text('Start time must be before end time within each slot.');
							showMessageTheme2(0, 'Please choose an end time greater than start time.', '', true);
							validatToSaveMsg= 'Please choose an end time greater than start time.';
							// $(this).find('.'+fromClassName).val(sTime);
							// $(this).find('.'+toClassName).val(eTime);
							status=false;
							validatToSaveFlag=false;
							return status;
						}
						if(USER_ROLE_ID==3){
							if(dynamicDataStatus!='Y'){
								var startMinutes = getMinutesFromTime(startTime);
								var endMinutes = getMinutesFromTime(endTime);
								var difference = endMinutes - startMinutes;
								var slotmin=min*60;
								if(slotmin==60 || endTime=='23:59'){
									slotmin=slotmin-1;
								}
								var slotmax=max*60;

								if (difference<slotmin){
									showMessageTheme2(0, 'Please add available slots minimum ' + min.split(".")[0] + ' hours.', '', true);
									status=false;
									validatToSaveFlag=false;
									validatToSaveMsg= 'Please add available slots minimum ' + min.split(".")[0] + ' hours.';
									return status;
									//difference += 24 * 60; // Add 24 hours worth of minutes
								}else if (difference>slotmax) {
									showMessageTheme2(0, 'Please add available slots maximum ' + max.split(".")[0]+' hours.', '', true);
									status=false;
									validatToSaveFlag=false;
									validatToSaveMsg= 'Please add available slots maximum ' + max.split(".")[0]+' hours.';
									return status;
									//difference += 24 * 60; // Add 24 hours worth of minutes
								}else if (difference >=slotmin &&  difference<=slotmax) {
									validatToSaveFlag=true;
									//difference += 24 * 60; // Add 24 hours worth of minutes
								}else{
									showMessageTheme2(0, 'Please add available slots with durations between ' + min.split(".")[0] + ' to ' + max.split(".")[0]+' hours.', '', true);
									status=false;
									validatToSaveFlag=false;
									validatToSaveMsg= 'Please add available slots with durations between ' + min.split(".")[0] + ' to ' + max.split(".")[0]+' hours.';
									return status;
								}
							}
						}
			
						times.push({ start: startTime, end: endTime,  dynamicDataStatus: dynamicDataStatus});
					}
				}else{
					strEndStatus=true;
					if(sTime=='' && eTime==''){
						times = [];
					}
				}
			
		}

	});
	
	for (var i = 0; i < times.length; i++) {
		for (var j = i + 1; j < times.length; j++) {
			
			if (timesOverlap(times[i], times[j], slotBufferLimit, userRoleId)) {
				showMessageTheme2(0, overLapmsg, '', true);
				validatToSaveMsg= overLapmsg;
				validatToSaveFlag=false;
				status=false;
				return status;
			}
		}
	}

	errorMessage.text('');
	return status;
}

function timesOverlap(slot1, slot2, slotBufferLimit, userRoleId) {
	console.log(slot1.start+" "+slot2.end);
	overLapmsg='';
	if(slot2.dynamicDataStatus=='N' && userRoleId==3){
			if(slot1.start < slot2.end && slot1.end > slot2.start){
			   overLapmsg='Please check that one of your time slots is overlapping with another time slot.';
			   return true;
			}else{
				if(slotBufferLimit>0){
					var stMin = getMinutesFromTime(slot1.end);
					var enMin = getMinutesFromTime(slot2.start);
					var diffMin = enMin - stMin;
					if(diffMin<0){
						diffMin = stMin - enMin;
						var stMin1 = getMinutesFromTime(slot2.end);
						var enMin1 = getMinutesFromTime(slot1.start);	
						diffMin=enMin1-stMin1;
					}
					if(diffMin<slotBufferLimit){
						overLapmsg='There must be at least a '+slotBufferLimit+' minute gap between each slot.';
						return true;
					}
				}
			}
	}else{
		if(userRoleId!=3){
			 if(slot1.start < slot2.end && slot1.end > slot2.start){
				msg='Please check that one of your time slots is overlapping with another time slot.';
				return true;
			 }
		}
	}
}


function getCalendarDateAvailability(formId, userId, elementId, startDate, visitDate, slotType, calSectionHide, prestartTime, preendTime, callFrom, slotTypeId,dayTimeElementId, userRoleId, min, max, slotBufferLimit, slotDateLimit,  slotDayLimit) {
    customLoader(false);
	var response=true;
	var selecDates = $("#inActDate").val();
	if(selecDates!=undefined && selecDates!=''){
		visitDate=selecDates;
	}
	var request = {userId:userId, lUserId:USER_ID, startDate: startDate, visitDate:visitDate, slotType: slotType, slotTypeId:slotTypeId };
	$.ajax({
		type: "POST",
		url: getURLFor('timeavailability', 'get-calendar-date'),
		contentType: "application/json",
		data: JSON.stringify(request),
		dataType: 'json',
		cache: false,
		async: false,
		timeout: 600000,
		success: function (data) {
			console.log(data);
			if (data['status'] == '0' || data['status'] == '2') {
				//showMessage(true, data['message']);
				showMessageTheme2(0, data['message'], '', true);
				response=false;
			} else {
				$("#"+elementId).html('');
				var htmlss = getCalendarTable(formId, userId, data, visitDate, callFrom, prestartTime, preendTime, elementId, dayTimeElementId, userRoleId, min, max, slotBufferLimit, slotDateLimit,  slotDayLimit);
				$("#"+elementId).html(htmlss);
				if(USER_ROLE_ID==2){
					if(data.timeSlotType=='calendar'){
						$("#refreshWeekBtn").removeClass("d-none");
					}else{
						$("#refreshWeekBtn").addClass("d-none");
					}
				}
				// if(calSectionHide){
				// 	$("#timeCalendarPopup").show();
				// }else{
				// 	$("#timeCalendarPopup").hide();
				// }
				
				$(".timesection .fromTime").select2({
					theme:"bootstrap4",
					dropdownParent:"#timeAvailabilityPopup",
					closeOnSelect:true,
				});
				
				$(".timesection .toTime").select2({
					theme:"bootstrap4",
					dropdownParent:"#timeAvailabilityPopup",
					closeOnSelect:true,
				});
				

				if(USER_ROLE_ID==3){
					// var monthViewMin=parseInt($("#monthViewMin").val());
					// var monthViewMax=parseInt($("#monthViewMax").val());
					// if(monthViewMin>0){
					// 	$("#preCalMonth").show();
					// }else{
					// 	$("#preCalMonth").hide();
					// }
					// if(monthViewMax>0){
					// 	$("#nextCalMonth").show();
					// }else{
					// 	$("#nextCalMonth").hide();
					// }
				}

				response=true;
			}
		}
	});
	return response;
}

function getCalendarTable(formId, userId, data, visitDate, callFrom, prestartTime, preendTime,elementId, dayTimeElementId, userRoleId, min, max, slotBufferLimit, slotDateLimit,  slotDayLimit){
	var monthyear = data.monthName+' - '+data.year;
	if($("#"+formId+" #weekDayName").val()!='' && $("#"+formId+" #weekDayName").val()!=undefined){
		$("#"+formId+" #calMonthYear").html(""+$("#weekDayName").val()+" availability");
		$("#"+formId+" #preCalMonth").hide();
		$("#"+formId+" #nextCalMonth").hide();
	}else{
		$("#"+formId+" #calMonthYear").html(monthyear);
		$("#"+formId+" #preCalMonth").show();
		$("#"+formId+" #nextCalMonth").show();
	}
	$("#"+formId+" #weekDayNum").val(data.weekDayNum);
	$("#"+formId+" #firstStartDate").val(data.startDate);
	$("#"+formId+" #firstDate").val(data.firstDate);
	$("#"+formId+" #firstDateNextMonth").val(data.firstDateNextMonth);
	$("#"+formId+" #firstDatePreMonth").val(data.firstDatePreMonth);
	var dateNum = parseInt(visitDate.split("-")[2]);
	var preStartTime=data.preStartTime;
	var preEndTime=data.preEndTime;

	var dayOfWeekVal = data.dayOfWeekVal;
	var startDate=dayOfWeekVal;
	var timeDropdown = data.timeAvailableList;
	var timeDropdownlimit=timeDropdown;
	var bookingDateList = data.bookingDateList; 
	var enabledDateList = data.calendarDateList;
	if(USER_ROLE_ID == 3 && bookingDateList.length<1){
		timeDropdownlimit=getTimeLastValue(min,timeDropdown);
	}
	
	var htmlCal = "";
	htmlCal=htmlCal+'<table class="table mb-0 text-center" style="table-layout:fixed;">';
	htmlCal=htmlCal+'<thead><tr>'
	htmlCal=htmlCal+'<td class="bold">Sun</td>';
	htmlCal=htmlCal+'<td class="bold">Mon</td>';
	htmlCal=htmlCal+'<td class="bold">Tue</td>';
	htmlCal=htmlCal+'<td class="bold">Wed</td>';
	htmlCal=htmlCal+'<td class="bold">Thu</td>';
	htmlCal=htmlCal+'<td class="bold">Fri</td>';
	htmlCal=htmlCal+'<td class="bold">Sat</td>';
	htmlCal=htmlCal+'</tr>';
	htmlCal=htmlCal+'</thead>';
	htmlCal=htmlCal+'<tbody>';
	htmlCal=htmlCal+'<tr>';
	
		if(dayOfWeekVal!=7){
			startDate=dayOfWeekVal;
			for (let i = 1; i <= (dayOfWeekVal-1); i++) {
				htmlCal=htmlCal+'<td></td>';
			}
		}
		if(dayOfWeekVal==7){
			for (let i = 1; i <= (dayOfWeekVal-1); i++) {
				htmlCal=htmlCal+'<td></td>';
			}
		}
		for (let i = 0; i < enabledDateList.length; i++) {
			var dates = enabledDateList[i];
			var holidayClass="";
			if(dates.isActive>0){
				holidayClass = dates.isActive==1?'selected-date':'active-date'
			}else{
				if(startDate==1 || startDate==7){
					holidayClass=dates.available==1?'selected-date':'active-date';
				}else if(dates.isClick == 0){
					holidayClass='expired-date';
				}else if(dates.available == 1){
					holidayClass='selected-date';
				}else{
					holidayClass='active-date';
				}
			}
			if(startDate<=7){
				if(dates.isClick==1){
					var onSclick = "openAvailabilitySection('"+formId+"','"+userId+"','"+data.startDate+"','"+dates.slotDate+"','timeSelectDate"+dates.day1+"', '"+startDate+"', '"+prestartTime+"','"+preendTime+"','"+elementId+"', '"+dayTimeElementId+"','"+userRoleId+"','"+min+"', '"+max+"','"+slotBufferLimit+"','"+slotDateLimit+"', '"+slotDayLimit+"')";
					htmlCal=htmlCal+'<td class="'+holidayClass+'">';
					htmlCal=htmlCal+'<a href="javascript:void(0);" id="timeSelectDate'+dates.day1+'" onclick="'+onSclick+'"  class="'+holidayClass+' d-inline-block">'+dates.day1+'</a>';	
					htmlCal=htmlCal+'</td>';
				}
				if(dates.isClick==0){
					htmlCal=htmlCal+'<td class="'+holidayClass+'">'+dates.day1+'</td>';
				}
				startDate=startDate+1;
			}
			if(startDate>7){
				startDate=1;
				htmlCal=htmlCal+'</tr>';
			}
		}
				
		htmlCal=htmlCal+'</tr>';
		htmlCal=htmlCal+'</tbody>  ';                
		htmlCal=htmlCal+'</table>';

		var htmlDropCal="";
		$("."+dayTimeElementId).html('');
		if(data.dayTimeType=="Unavailable"){
			if(callFrom=='add-new-row'){
				htmlDropCal=htmlDropCal+'<div class="row px-3 align-items-center justify-content-sm-start justify-content-around calday-hours calhours-0 mb-1">';
				htmlDropCal=htmlDropCal+'<div class="mr-1 flex-grow-1 flex-sm-grow-0" style="min-width:100px">';
				var fromFunc="getFromTime(this,'"+prestartTime+"','"+preendTime+"','"+userRoleId+"','"+min+"','"+max+"','"+slotBufferLimit+"','"+slotDateLimit+"', '"+slotDayLimit+"')";
				htmlDropCal=htmlDropCal+'<select class="form-control font-12 fromTime" data-id="calday-hours" data-checkid="'+dates.day1+'" onchange="'+fromFunc+'" data-status="N">';
				if(timeDropdownlimit.length>0){
					htmlDropCal=htmlDropCal+'<option value="">Start Time</option>';
					for (let t = 0; t < timeDropdownlimit.length; t++) {
						const timeopt = timeDropdownlimit[t];
						var strSelect = (preStartTime==timeopt)?'selected':'';
						htmlDropCal=htmlDropCal+'<option value="'+timeopt+'" '+strSelect+'>'+timeopt+'</option>';
					}
				}
				htmlDropCal=htmlDropCal+'</select>';
				htmlDropCal=htmlDropCal+'</div>';
				htmlDropCal=htmlDropCal+'<div class="mr-1 flex-grow-1 flex-sm-grow-0" style="min-width:100px">';
				var toFunc="getToTime(this,'"+prestartTime+"','"+preendTime+"','"+userRoleId+"','"+min+"','"+max+"','"+slotBufferLimit+"','"+slotDateLimit+"', '"+slotDayLimit+"' )";
				htmlDropCal=htmlDropCal+'<select class="form-control font-12 toTime" data-id="calday-hours" data-checkid="'+dates.day1+'"  onchange="'+toFunc+'" data-status="N">';
				if(timeDropdown.length>0){
					for (let t = 0; t < timeDropdown.length; t++) {
						const timeopt = timeDropdown[t];
						var strSelect =(preEndTime==timeopt)?'selected':'';
						htmlDropCal=htmlDropCal+'<option value="'+timeopt+'" '+strSelect+'>'+timeopt+'</option>';
					}
				}
				htmlDropCal=htmlDropCal+'</select>';
				htmlDropCal=htmlDropCal+'</div>';
				htmlDropCal=htmlDropCal+'<div>';
				var funRemoveClick= "removeSingleTimeDiv('calhours-0','0', '0', '"+userId+"', 'N', '"+preStartTime+"', '"+preendTime+"', '"+userRoleId+"','time-wise')";
				htmlDropCal=htmlDropCal+'<a href="javascript:void(0)" class="btn btn-lg btn-outline-danger btn-sm" onclick="'+funRemoveClick+'" style="line-height:5px;"><i class="ion-android-close" style="font-size:14px;line-height:10px;height:14px;"></i></a><span id="calhours-time-0" class="slot-duration"></span>';
				htmlDropCal=htmlDropCal+'</div>';
				htmlDropCal=htmlDropCal+'</div>';
			}else{
				
				htmlDropCal=htmlDropCal+'<div class="row px-3 align-items-center justify-content-sm-start justify-content-around calday-hours calhours-0 mb-1" data-status="N">';
				htmlDropCal=htmlDropCal+'Unavailable';
				htmlDropCal=htmlDropCal+'</div>';
			}
		}else{
			if(bookingDateList.length>0){
				var totalDuration = 0;
				htmlDropCal=htmlDropCal+'<div class="bold m-0">Total given availability: <span class="specificTotalGivenAvailability"></span></div>';
				for (let b = 0; b < bookingDateList.length; b++) {
					const bookDate = bookingDateList[b];
					duration=0;
					var stStarttime = bookDate.startTime;
					var endTime = bookDate.endTime;
					if(stStarttime!=undefined &&  stStarttime!=null && stStarttime!='' && endTime !=undefined && endTime !=null && endTime !=''){
						diff = getTimeDifference(stStarttime, endTime);
						duration += diff.asMilliseconds();
						totalDuration +=diff.asMilliseconds();
					}
					var ddisabled="";
					//&& USER_ROLE_ID==3
					if(bookDate.dataStatus=='Y' && userRoleId==3){
						ddisabled='disabled';
					}
					htmlDropCal=htmlDropCal+'<div class="row px-3 align-items-center justify-content-sm-start justify-content-around calday-hours mb-1 calhours-'+b+'">';
					htmlDropCal=htmlDropCal+'<div class="mr-1 flex-grow-1 flex-sm-grow-0" style="min-width:100px">';
					var fromFunc="getFromTime(this,'"+prestartTime+"','"+preendTime+"','"+userRoleId+"','"+min+"','"+max+"','"+slotBufferLimit+"','"+slotDateLimit+"', '"+slotDayLimit+"')";
					htmlDropCal=htmlDropCal+'<select class="form-control font-12 fromTime" data-id="calday-hours" data-checkid="'+dateNum+'"  onchange="'+fromFunc+'" '+ddisabled+' data-status="Y">';
					if(timeDropdownlimit.length>0){
						htmlDropCal=htmlDropCal+'<option value="">Start Time</option>';
						for (let t = 0; t < timeDropdownlimit.length; t++) {
							const timeopt = timeDropdownlimit[t];
							var strSelect = (bookDate.startTime==timeopt)?'selected':'';
							htmlDropCal=htmlDropCal+'<option value="'+timeopt+'" '+strSelect+'>'+timeopt+'</option>';
						}
					}
	
					htmlDropCal=htmlDropCal+'</select>';
					htmlDropCal=htmlDropCal+'</div>';
					htmlDropCal=htmlDropCal+'<div class="mr-1 flex-grow-1 flex-sm-grow-0" style="min-width:100px">';
					var toFunc="getToTime(this,'"+prestartTime+"','"+preendTime+"','"+userRoleId+"','"+min+"','"+max+"','"+slotBufferLimit+"','"+slotDateLimit+"', '"+slotDayLimit+"' )";
					htmlDropCal=htmlDropCal+'<select class="form-control font-12 toTime" data-id="calday-hours" data-checkid="'+dateNum+'"  onchange="'+toFunc+'" '+ddisabled+' data-status="Y">';
					if(timeDropdown.length>0){
						htmlDropCal=htmlDropCal+'<option value="">End Time</option>';
						for (let t = 0; t < timeDropdown.length; t++) {
							const timeopt = timeDropdown[t];
							var strSelect = (bookDate.endTime==timeopt)?'selected':'';
							htmlDropCal=htmlDropCal+'<option value="'+timeopt+'" '+strSelect+'>'+timeopt+'</option>';
						}
					}
					htmlDropCal=htmlDropCal+'</select>';
					htmlDropCal=htmlDropCal+'</div>';
					var ddclass="";
					if(bookDate.dataStatus=='Y' && USER_ROLE_ID==3){
						ddclass='d-none';
					}
					htmlDropCal=htmlDropCal+'<div class="calendar-remove-date ">';
					var funRemoveClick= "removeSingleTimeDiv('calhours-"+b+"','"+b+"', '"+bookDate.timeid+"', '"+userId+"', 'N', '"+bookDate.startTime+"', '"+bookDate.endTime+"', '"+userRoleId+"','"+bookDate.timetype+"')";
					htmlDropCal=htmlDropCal+'<a href="javascript:void(0)" class="btn btn-lg btn-outline-danger btn-sm mr-1 '+ddclass+'" onclick="'+funRemoveClick+'" style="line-height:5px;"><i class="ion-android-close" style="font-size:14px;line-height:10px;height:14px;"></i></a><span id="calhours-time-'+b+'" class="slot-duration">'+(duration>0?getTimeWithFormat(duration):'0h 0m')+'</span>';
					htmlDropCal=htmlDropCal+'</div>';

					htmlDropCal=htmlDropCal+'</div>';
				}
			}else{
				if(userRoleId==3){
					if(callFrom=='add-new-row'){
						htmlDropCal=htmlDropCal+'<div class="row px-3 align-items-center justify-content-sm-start justify-content-around calday-hours mb-1 calhours-0">';
						htmlDropCal=htmlDropCal+'<div class="mr-1 flex-grow-1 flex-sm-grow-0" style="min-width:100px">';
						var fromFunc="getFromTime(this,'"+prestartTime+"','"+preendTime+"','"+userRoleId+"','"+min+"','"+max+"','"+slotBufferLimit+"','"+slotDateLimit+"', '"+slotDayLimit+"')";
						htmlDropCal=htmlDropCal+'<select class="form-control font-12 fromTime" data-id="calday-hours" data-checkid="'+dateNum+'"    onchange="'+fromFunc+'" data-status="N">';
						if(timeDropdownlimit.length>0){
							for (let t = 0; t < timeDropdownlimit.length; t++) {
								const timeopt = timeDropdownlimit[t];
								var strSelect = (preStartTime==timeopt)?'selected':'';
								htmlDropCal=htmlDropCal+'<option value="'+timeopt+'" '+strSelect+'>'+timeopt+'</option>';
							}
						}
						htmlDropCal=htmlDropCal+'</select>';
						htmlDropCal=htmlDropCal+'</div>';
						htmlDropCal=htmlDropCal+'<div class="mr-1 flex-grow-1 flex-sm-grow-0" style="min-width:100px">';
						var toFunc="getToTime(this,'"+prestartTime+"','"+preendTime+"','"+userRoleId+"','"+min+"','"+max+"','"+slotBufferLimit+"','"+slotDateLimit+"', '"+slotDayLimit+"' )";
						htmlDropCal=htmlDropCal+'<select class="form-control font-12 toTime" data-id="calday-hours" data-checkid="'+dateNum+'"    onchange="'+toFunc+'" data-status="N">';
						if(timeDropdown.length>0){
							for (let t = 0; t < timeDropdown.length; t++) {
								const timeopt = timeDropdown[t];
								var strSelect =(preEndTime==timeopt)?'selected':'';
								htmlDropCal=htmlDropCal+'<option value="'+timeopt+'" '+strSelect+'>'+timeopt+'</option>';
							}
						}
						htmlDropCal=htmlDropCal+'</select>';
						htmlDropCal=htmlDropCal+'</div>';
						htmlDropCal=htmlDropCal+'<div>';
						var funRemoveClick= "removeSingleTimeDiv('calhours-0','0', '0', '"+userId+"', 'N', '"+preStartTime+"', '"+preendTime+"', '"+userRoleId+"','time-wise')";
						htmlDropCal=htmlDropCal+'<a href="javascript:void(0)" class="btn btn-lg btn-outline-danger btn-sm" onclick="'+funRemoveClick+'" style="line-height:5px;"><i class="ion-android-close" style="font-size:14px;line-height:10px;height:14px;"></i></a><span id="calhours-time-0" class="slot-duration"></span>';
						htmlDropCal=htmlDropCal+'</div>';
						htmlDropCal=htmlDropCal+'</div>';
					}else{
						htmlDropCal=htmlDropCal+'<div class="row px-3 align-items-center justify-content-sm-start justify-content-around calday-hours mb-1 calhours-0">';
						htmlDropCal=htmlDropCal+'Unavailable';
						htmlDropCal=htmlDropCal+'</div>';
					}
				}else{
					htmlDropCal=htmlDropCal+'<div class="row px-3 align-items-center justify-content-sm-start justify-content-around calday-hours mb-1 calhours-0">';
					htmlDropCal=htmlDropCal+'<div class="mr-1 flex-grow-1 flex-sm-grow-0" style="min-width:100px">';
					var fromFunc="getFromTime(this,'"+prestartTime+"','"+preendTime+"','"+userRoleId+"','"+min+"','"+max+"','"+slotBufferLimit+"','"+slotDateLimit+"', '"+slotDayLimit+"')";
					htmlDropCal=htmlDropCal+'<select class="form-control font-12 fromTime" data-id="calday-hours" data-checkid="'+dateNum+'"    onchange="'+fromFunc+'" data-status="N">';
					if(timeDropdownlimit.length>0){
						for (let t = 0; t < timeDropdownlimit.length; t++) {
							const timeopt = timeDropdownlimit[t];
							var strSelect = (preStartTime==timeopt)?'selected':'';
							htmlDropCal=htmlDropCal+'<option value="'+timeopt+'" '+strSelect+'>'+timeopt+'</option>';
						}
					}
					htmlDropCal=htmlDropCal+'</select>';
					htmlDropCal=htmlDropCal+'</div>';
					htmlDropCal=htmlDropCal+'<div class="mr-1 flex-grow-1 flex-sm-grow-0" style="min-width:100px">';
					var toFunc="getToTime(this,'"+prestartTime+"','"+preendTime+"','"+userRoleId+"','"+min+"','"+max+"','"+slotBufferLimit+"','"+slotDateLimit+"', '"+slotDayLimit+"' )";
					htmlDropCal=htmlDropCal+'<select class="form-control font-12 toTime" data-id="calday-hours" data-checkid="'+dateNum+'"    onchange="'+toFunc+'" data-status="N">';
					if(timeDropdown.length>0){
						for (let t = 0; t < timeDropdown.length; t++) {
							const timeopt = timeDropdown[t];
							var strSelect =(preEndTime==timeopt)?'selected':'';
							htmlDropCal=htmlDropCal+'<option value="'+timeopt+'" '+strSelect+'>'+timeopt+'</option>';
						}
					}
					htmlDropCal=htmlDropCal+'</select>';
					htmlDropCal=htmlDropCal+'</div>';
					htmlDropCal=htmlDropCal+'<div>';
					var funRemoveClick= "removeSingleTimeDiv('calhours-0','0', '0', '"+userId+"', 'N', '"+preStartTime+"', '"+preendTime+"', '"+userRoleId+"','time-wise')";
					htmlDropCal=htmlDropCal+'<a href="javascript:void(0)" class="btn btn-lg btn-outline-danger btn-sm mr-1" onclick="'+funRemoveClick+'" style="line-height:5px;"><i class="ion-android-close" style="font-size:14px;line-height:10px;height:14px;"></i></a><span id="calhours-time-0" class="slot-duration"></span>';
					htmlDropCal=htmlDropCal+'</div>';
					htmlDropCal=htmlDropCal+'</div>';
				}
			}
		}
		$("."+dayTimeElementId).html(htmlDropCal);
		$(".specificTotalGivenAvailability").text(totalDuration>0?getTimeWithFormat(totalDuration):'0h 0m');
		if(visitDate!=''){
			$("#"+formId+" .timesection").show();
			$("#"+formId+" #inActDate").val(visitDate)
		}

		return htmlCal;
}

function openAvailabilitySection(formId, userId,startDate, selectDate,id,weekcount, prestartTime, preendTime, elementId, dayTimeElementId, userRoleId, min, max, slotBufferLimit, slotDateLimit,  slotDayLimit){
	$(".timesection").show();
	$("#timeAvailabilitySave").removeClass('d-none');
	$("#inActDate").val(selectDate);
	var selecDates = $("#inActDate").val();
	// if($("#"+id).parent("td").hasClass("selected-date")){
	// 	$("#"+id).parent("td").removeClass("selected-date"); 
	// 	$("#"+id).parent("td").addClass("active-date");
	// 	selecDates = selecDates.replace(","+selectDate, '');
	// }else{
	// 	$("#"+id).parent("td").removeClass("active-date"); 
	// 	$("#"+id).parent("td").addClass("selected-date");
	// 	selecDates = selecDates + ',' + selectDate;
	// }
	if($("#"+id).parent("td").hasClass("selected-date")){
		$("#"+id).parent("td").removeClass("selected-date"); 
		$("#"+id).parent("td").addClass("active-date");
		$(".timesection").hide();
		$("#timeAvailabilitySave").addClass('d-none');
		return false;
	}
	
	var uniqueList=selecDates.split(',').filter(function(allItems,i,a){
		return i==a.indexOf(allItems);
	}).join(',');
	
	//$('#output').append(uniqueList);
	var arryList = []
	var multipleSlot=uniqueList.split(",");
	if(multipleSlot.length>0){
		for (let is = 0; is < multipleSlot.length; is++) {
			const eless = multipleSlot[is];
			if(eless!=''){
				arryList.push(eless);
			}
		}
		if(arryList.length<2){
			//uniqueList
			var resp=getCalendarDateAvailability(formId, userId, "timeCalendarPopup",startDate,uniqueList,"Month", true, ""+prestartTime+"", ""+preendTime+"",'open-edit-date',0,'daytime', userRoleId, min, max, slotBufferLimit, slotDateLimit,  slotDayLimit);
			if(resp==undefined){

			}else{
				if(!resp){
					$("#inActDate").val('')
					$(".timesection").hide();
					if($("#"+id).parent("td").hasClass("selected-date")){
						$("#"+id).parent("td").removeClass("selected-date"); 
						$("#"+id).parent("td").addClass("active-date");
						selecDates='';
						return false;
					}
				}else{
					var startFromTime = $(".calhours-0").find('.toTime').val();
					var totalsDuration=0;
					if(startFromTime != null && startFromTime != ''){
						startFromTime = convertTo24Hour(startFromTime);
						startFromTime=startFromTime.split(':')
						//var fromT = "1970-12-31 "+$(".calhours-"+(divLen-1)+"").find('.toTime').val(); // Example date string in the format YYYY-MM-DD
						var fromT = new Date(1990, 1, 1, startFromTime[0], startFromTime[1], 0);
						var timestamp = Date.parse(fromT);
						var dateObject = new Date(timestamp);
						if(startFromTime[0]!="23" && startFromTime[1]!="59"){
							var timeinter = getTimePlusInterval(dateObject,0);
							//$(".calhours-"+divLen+"").find('.fromTime').val(timeinter);
						}else{
							var timeinter = $(".calhours-0").find('.toTime').val();
							//$(".calhours-"+divLen+"").find('.fromTime').val($(".calhours-"+(divLen-1)+"").find('.toTime').val());
						}

						// if(userRoleId!=3){
						// 	var ST = $(".calhours-0").find('.fromTime').val();//timeinter;
						// }else{
						// 	var ST = "00:00 AM";
						// }
						var ST = $(".calhours-0").find('.fromTime').val();
					}
					
					
					//console.log(timeinter);
					
					//var toT = "1970-12-31 "+timeinter; // Example date string in the format YYYY-MM-DD
					var ET;
					if(timeinter){
						var endToTime = convertTo24Hour(timeinter);
					}
					if(endToTime != null && endToTime != ''){
						endToTime = endToTime.split(':');
						var toT = new Date(1990, 1, 1, endToTime[0], endToTime[1], 0);

						var timestampTo = Date.parse(toT);
						var totimedate = new Date(timestampTo);
						if(endToTime[0]!="23" && endToTime[1]!="59"){
							var timeinterTo = getTimePlusInterval(totimedate,0);
							//$(".calhours-"+divLen+"").find('.toTime').val(timeinterTo)
							// if(USER_ROLE !="TEACHER" && USER_ROLE !="DIRECTOR"){
							// 	ET=timeinterTo
							// }else{
							// 	ET = "00:00 AM"
							// }
							ET=timeinterTo
						}else{
							//$(".calhours-"+divLen+"").find('.toTime').val($(".calhours-"+(divLen-1)+"").find('.toTime').val())
							// if(USER_ROLE !="TEACHER" && USER_ROLE !="DIRECTOR"){
							// 	ET=timeinter
							// }else{
							// 	ET = "00:00 AM"
							// }
							ET=timeinter
							

						}
					}
					if(ST!=undefined){
						diff = getTimeDifference(ST, ET);
						totalsDuration += diff.asMilliseconds();
					}
					$(".calhours-0").find("#calhours-time-0").text((totalsDuration>0?getTimeWithFormat(totalsDuration):'0h 0m'));
				}
			}
		}
	}	
	
	//$("#inActDate").val(uniqueList);
	var daytimeHtml=$(".daytime").html();
	if(daytimeHtml==''){
		
	}
}

function addNewRowTime(dayname, indx, prestartTime, preendTime, userRoleId, min, max, slotBufferLimit, slotDateLimit,  slotDayLimit, callFrom ){
	validatToSaveFlag=true;
	validatToSaveMsg='';
	if(userRoleId==3){
		if(!$(".timeAvailabilityConfirmationAction").hasClass("show")){
			$(".timeAvailabilityConfirmationAction").addClass("show");
		}
	}
	var userid= $("#userId").val();
	if(userRoleId==3){
		if($('.'+dayname+'-'+indx).text()=='Unavailable'){
			$("#day"+indx).removeAttr("disabled");
		}
	}else{
		$("#day"+indx).removeAttr("disabled");
	}
	//$("#copy-hours-"+indx).removeClass('d-none');
	var timeSlotAvailability=[];
	if(!$("#day"+indx).is(":checked")){
		$('#day'+indx+'').trigger('click');
		if(USER_ROLE_ID==2){

		}else if(userRoleId==3){
			$("#day"+indx).attr("disabled",true);
		}
		return false;
	}
	if ($('.week-time-available .fromTime').data('select2')) {
		$(".week-time-available .fromTime").select2("destroy");
	}
	if ($('.week-time-available .toTime').data('select2')) {
		$(".week-time-available .toTime").select2("destroy");
	}
	var divLen = $('.'+dayname+'-'+indx).not('.unavailable-'+dayname+'-'+indx).length;
	if(divLen>0){
		$('.'+dayname+'-'+indx).each(function(index, tr) { 
			if(index==(divLen-1)){
				var day_Ids=$(this).attr("id");//$(".available-"+dayname+'-'+indx+"").attr("id");
				var prePositionInd= parseInt(day_Ids.split("-")[2]);
			
				if($("."+dayname+"-time-"+prePositionInd+"").find('.fromTime').val()!='' && $("."+dayname+"-time-"+prePositionInd+"").find('.toTime').val()!=''){

				}else{
					if($("."+dayname+"-time-"+prePositionInd+"").hasClass('d-none')){
						$("#"+dayname+"-time-"+prePositionInd+"").removeClass('d-none');
						return false;
					}
					
					showMessageTheme2(0, 'Please select start time and end time', '', true);
					return false;
				}
				var positionInd=(prePositionInd+1);
				var htmlTr = tr.outerHTML;
				htmlTr=htmlTr.replace(day_Ids,"");
				htmlTr=htmlTr.replace(""+dayname+'-'+indx+"",""+dayname+'-'+indx+" "+dayname+"-time-"+positionInd+"");
				$(".cal-hours-"+indx).append(htmlTr);
				// alert($("."+dayname+"-time-"+prePositionInd+"").find('.toTime').val());
				var removeFun =  "removeTimeDiv('"+dayname+"-time-"+positionInd+"','"+indx+"','"+prestartTime+"','"+preendTime+"','"+userRoleId+"','"+min+"' ,'"+max+"','"+slotBufferLimit+"','"+slotDateLimit+"' ,'"+slotDayLimit+"','0')";
				$("."+dayname+"-time-"+positionInd+"").find("a").attr("onclick",removeFun);
				$("."+dayname+"-time-"+positionInd+" .remove-time-slot-btn").removeClass("time-save-Y").addClass("time-save-N");
				$("."+dayname+"-time-"+positionInd+" .fromTime").removeClass("startTimeDropDown"+positionInd);
				$("."+dayname+"-time-"+positionInd+" .toTime").removeClass("endTimeDropDown"+positionInd);
				$("."+dayname+"-time-"+positionInd+"").find("a").removeClass('d-none');
				$("."+dayname+"-time-"+positionInd+"").find('.fromTime').attr('data-id',""+dayname+"-"+indx+"");
				$("."+dayname+"-time-"+positionInd+"").find('.toTime').attr('data-id',""+dayname+"-"+indx+"");
				$("."+dayname+"-time-"+positionInd+"").find('.fromTime').attr('id',""+dayname+"-start-time-dropdown-"+positionInd+"");
				$("."+dayname+"-time-"+positionInd+"").find('.toTime').attr('id',""+dayname+"-end-time-dropdown-"+positionInd+"");
				$("."+dayname+"-time-"+positionInd+"").find('.fromTime').attr('data-status',"N");
				$("."+dayname+"-time-"+positionInd+"").find('.toTime').attr('data-status',"N");
				$("."+dayname+"-time-"+positionInd+"").attr("id",""+dayname+"-time-"+positionInd+"");
				$("#"+dayname+"-time-"+positionInd+"").removeClass('d-none');
				$("."+dayname+"-time-"+positionInd+"").find('.min-hours').find('span').attr("id",""+dayname+"-hour-"+positionInd+"");
				// if(USER_ROLE == "TEACHER" || USER_ROLE == "DIRECTOR"){
				if(userRoleId==3){
					if(prePositionInd == 0 && !$("."+dayname+"-time-"+prePositionInd+"").find(".remove-time-slot-btn").hasClass("time-save-Y")){
						$("."+dayname+"-time-"+positionInd+"").find('.fromTime').prepend("<option value=''>Start Time</option>");
					}
					$("."+dayname+"-time-"+positionInd+"").find('.fromTime').val("").trigger("change");
				}
				if(callFrom=='remove-slot-week'){
					var totalDuration=0;
					$("."+dayname+"-time-"+positionInd+"").find('.fromTime').val(prestartTime);
					$("."+dayname+"-time-"+positionInd+"").find('.toTime').val(preendTime)
					$("."+dayname+"-time-"+positionInd+" .remove-time-slot-btn").addClass('d-none');
					diff = getTimeDifference(prestartTime, preendTime);
					totalDuration = diff.asMilliseconds();
					$("#"+dayname+"-hour-"+positionInd).text(getTimeWithFormat(totalDuration));
				}else{
					var startFromTime = $("."+dayname+"-time-"+prePositionInd+"").find('.toTime').val();
					var totalsDuration=0;
					if(startFromTime != null && startFromTime != ''){
						startFromTime = convertTo24Hour(startFromTime);
						startFromTime=startFromTime.split(':')
						var fromT = new Date(1990, 1, 1, startFromTime[0], startFromTime[1], 0);
						var timestamp = Date.parse(fromT);
						var dateObject = new Date(timestamp);
						var timeinter = getTimePlusInterval(dateObject,slotBufferLimit);
						
						if(USER_ROLE !="TEACHER" && USER_ROLE !="DIRECTOR"){
							var ST = timeinter;
							$("."+dayname+"-time-"+positionInd+"").find('.fromTime').val(timeinter);
						}else{
							var ST = "00:00 AM";
						}
					}
					var ET;
					//console.log(timeinter);
					if(timeinter){
						var endToTime = convertTo24Hour(timeinter);
					}
					if(endToTime != null && endToTime != ''){
						endToTime = endToTime.split(':');
						var toT = new Date(1990, 1, 1, endToTime[0], endToTime[1], 0);
						var timestampTo = Date.parse(toT);
						var totimedate = new Date(timestampTo);

						if(endToTime[0]!="23" && endToTime[1]!="59"){
							if(min == "0.0" && USER_ROLE != "TEACHER" && USER_ROLE !="DIRECTOR"){
								min = 1;
							}
							var mintime=min*60;
							var timeinterTo = getTimePlusInterval(totimedate,mintime);
							if(USER_ROLE !="TEACHER" && USER_ROLE !="DIRECTOR"){
								$("."+dayname+"-time-"+positionInd+"").find('.toTime').val(timeinterTo);
								ET=timeinterTo
							}else{
								ET = "00:00 AM"
							}
						}else{
							if(USER_ROLE !="TEACHER" && USER_ROLE !="DIRECTOR"){
								$("."+dayname+"-time-"+positionInd+"").find('.toTime').val(timeinter);
								ET=timeinter
							}else{
								ET = "00:00 AM"
							}
						}
					}

					
					
					if(ST!=undefined){
						diff = getTimeDifference(ST, ET);
						totalsDuration += diff.asMilliseconds();
					}
					
					//$("."+dayname+"-time-"+positionInd+"").find('.min-hours').find('span').text((totalsDuration>0?getTimeWithFormat(totalsDuration):'0h 0m'));
					$("."+dayname+"-time-"+positionInd+"").find('.fromTime').removeAttr("disabled");
					$("."+dayname+"-time-"+positionInd+"").find('.toTime').removeAttr("disabled");
					$("#"+dayname+"-hour-"+positionInd+"").text((totalsDuration>0?getTimeWithFormat(totalsDuration):'0h 0m'));
					$(".week-time-available .fromTime").select2({
						theme:"bootstrap4",
					});
					
					$(".week-time-available .toTime").select2({
						theme:"bootstrap4",
					});
				}
				if(USER_ROLE_ID==2){

				}else if(userRoleId==3){
					if($("#day"+indx).is(":checked")){
						$("#day"+indx).attr('disabled',true);
					}
				}
			}
		});
		if(userRoleId==3){
			$(".week-time-available .fromTime").select2({
				theme:"bootstrap4",
			});
			
			$(".week-time-available .toTime").select2({
				theme:"bootstrap4",
			});
		}
		var days=0;
		var totalDuration=0;
		var timeclas=dayname+'-'+indx;
		var validStatus=validateTimes(timeclas, 'fromTime', 'toTime', userRoleId, min, max, slotBufferLimit);
		if(validStatus){
			$('.'+dayname+'-'+indx).not('.d-none').each(function() { 
				var teacherTime={};
				var startTime = $(this).find('.fromTime').val();
				var endTime = $(this).find('.toTime').val();
				days = $(this).find('.toTime').attr('data-checkid');
				if(startTime!=undefined &&  startTime!=null && startTime!='' && endTime !=undefined && endTime !=null && endTime !=''){
					teacherTime['dayid']=days;
					teacherTime['startTime']=startTime;
					teacherTime['endTime']=endTime;
					teacherTime['dayCheck']='Y';
					timeSlotAvailability.push(teacherTime);
					diff = getTimeDifference(startTime, endTime);
					totalDuration += diff.asMilliseconds();
				}
			});
			//console.log("addNewRowTime")	
			$(".total-minutes-"+indx).text(getTimeWithFormat(totalDuration));
			if(userRoleId!=3){
				saveTimeCalendarWeekWise(userid,days,timeSlotAvailability,'add','new-time',prestartTime, preendTime, userRoleId, min, max, slotBufferLimit, slotDateLimit,  slotDayLimit );
			}

		}

	}
	else{
		///already check select time
		//getDaysCheckUncheck('day'+indx+'')
		//$('#day'+indx+'').trigger('click');
		// $(".fromTime").select2({
		// 	theme:"bootstrap4",
		// });
		// $(".toTime").select2({
		// 	theme:"bootstrap4",
		// });
		if($("#day"+indx).is(":checked")){
			getDaysCheckUncheck('day'+indx+'',''+prestartTime+'',''+preendTime+'', ''+userRoleId+'', ''+min+'', ''+max+'', ''+slotBufferLimit+'', ''+slotDateLimit+'', ''+slotDayLimit+'');
		}
		// if(!$("#day"+indx).is(":checked")){
		// 	$('#day'+indx+'').trigger('click');
		// 	return false;
		// }
	}
}
function removeTimeDiv(divid, dayid, prestartTime, preendTime, userRoleId, min, max, slotBufferLimit, slotDateLimit,  slotDayLimit, dayslotId){
	timeSlotAvailability=[];
	var userid= $("#userId").val();
	var timeclass=divid.split("-");
	var dayname=timeclass[0];
	var timeclas = timeclass[0]+"-"+dayid;
	if(userRoleId!=3){
		$( "."+divid).remove();
		if($('.'+timeclas).not('.d-none').length>0){
			var validStatus=validateTimes(timeclas, 'fromTime', 'toTime', userRoleId, min, max,slotBufferLimit);
			if(validStatus){
				$('.'+timeclas).each(function() { 
					var teacherTime={};
					var startTime = $(this).find('.fromTime').val();
					var endTime = $(this).find('.toTime').val();
					teacherTime['dayid']=dayid;
					teacherTime['startTime']=startTime;
					teacherTime['endTime']=endTime;
					teacherTime['dayCheck']='Y';
					timeSlotAvailability.push(teacherTime);
				});
				saveTimeCalendarWeekWise(userid,dayid,timeSlotAvailability, 'add','remove-time',prestartTime, preendTime, userRoleId, min, max, slotBufferLimit, slotDateLimit,  slotDayLimit);
			}
		}else{
			$("#day"+dayid+"").prop('checked',false);
			var dayname = $("#day"+dayid+"").attr("data-name");
			$(".cal-hours-"+dayid+"").html('');
			var htmlw="";
			htmlw='<div class="row justify-content-sm-start justify-content-around  unavailable-'+dayname+'-'+dayid+' '+dayname+'-'+dayid+' '+dayname+'-time-0" id="'+dayname+'-time-0" style="padding-left:50px; font-size:16px">';
			htmlw=htmlw+'Unavailable';
			htmlw=htmlw+'</div>';
			
			$(".cal-hours-"+dayid+"").html(htmlw);
	
			var teacherTime={};
				teacherTime['dayid']=dayid;
				teacherTime['startTime']=prestartTime;
				teacherTime['endTime']=preendTime;
				teacherTime['dayCheck']='N';
				timeSlotAvailability.push(teacherTime);

			saveTimeCalendarWeekWise(userid,dayid,timeSlotAvailability, 'add','remove-time',prestartTime, preendTime, userRoleId, min, max);
		}
		
		if($("cal-hours-"+dayid+" .fromTime:not(:disabled)").length == 0 && $("cal-hours-"+dayid+" .fromTime:disabled")>0){
			$("#day"+dayid).attr("disabled",true);
		}
		if($(".week-time-available .time-save-N").length == 0){
			$(".timeAvailabilityConfirmationAction").removeClass("show");
		}
	}else{
		if(userRoleId==3){
			if(dayslotId>0){
				var resp = getTeacherMeetingStatus('day-wise',dayid, userid, dayslotId, divid,'');
				if(resp){
					$("."+divid).addClass("d-none");
					var totalval=$('.'+timeclas).not('.d-none').length;
					if(totalval==0){
						$(".cal-hours-"+dayid+"").html('');
						$(".cal-hours-"+dayid+"").addClass("save-slot-wrapper");
						var htmlw="";
						htmlw='<div class="row justify-content-sm-start justify-content-around unavailable-'+dayname+'-'+dayid+' '+dayname+'-'+dayid+' '+dayname+'-time-0" id="'+dayname+'-time-0" style="padding-left:50px; font-size:16px">';
						htmlw=htmlw+'Unavailable';
						htmlw=htmlw+'</div>';
						$(".cal-hours-"+dayid+"").html(htmlw);
						$(".total-minutes-"+dayid).text('0h 0m');
					}else{
						var totalDuration=0;
						$('.'+timeclas).not('.d-none').each(function() { 
							var startTime = $(this).find('.fromTime').val();
							var endTime = $(this).find('.toTime').val();
							if(startTime!=undefined &&  startTime!=null && startTime!='' && endTime !=undefined && endTime !=null && endTime !=''){
								diff = getTimeDifference(startTime, endTime);
								totalDuration += diff.asMilliseconds();
							}
						});
						$(".total-minutes-"+dayid).text(getTimeWithFormat(totalDuration));
					}
					if(!$(".timeAvailabilityConfirmationAction").hasClass("show")){
						$(".timeAvailabilityConfirmationAction").addClass("show");
					}
					return false;
				}
			}else{
				$("."+divid).addClass("d-none");

				if($('.'+timeclas).not('.d-none').length>0){
					var totalDuration=0;
						$('.'+timeclas).not('.d-none').each(function() { 
							var startTime = $(this).find('.fromTime').val();
							var endTime = $(this).find('.toTime').val();
							if(startTime!=undefined &&  startTime!=null && startTime!='' && endTime !=undefined && endTime !=null && endTime !=''){
								diff = getTimeDifference(startTime, endTime);
								totalDuration += diff.asMilliseconds();
							}
						});
						$(".total-minutes-"+dayid).text(getTimeWithFormat(totalDuration));
				}
				else{
					$("#day"+dayid+"").prop('checked',false);
					var dayname = $("#day"+dayid+"").attr("data-name");
					$(".cal-hours-"+dayid+"").html('');
					var htmlw="";
					htmlw='<div class="row justify-content-sm-start justify-content-around  unavailable-'+dayname+'-'+dayid+' '+dayname+'-'+dayid+' '+dayname+'-time-0" id="'+dayname+'-time-0" style="padding-left:50px; font-size:16px">';
					htmlw=htmlw+'Unavailable';
					htmlw=htmlw+'</div>';
					$(".cal-hours-"+dayid+"").html(htmlw);
					$(".total-minutes-"+dayid).text('0h 0m');
				}
				if($(".week-time-available .time-save-N").length == $(".available-dropdown-Wrapper.d-none").length && !$(".cal-hours-"+dayid+"").hasClass("save-slot-wrapper")){
					$(".timeAvailabilityConfirmationAction").removeClass("show");
				}
			}
		}
	}
	
}

function addSingleRowTime(formId, userId, cloneDiv, prestartTime, preendTime, userRoleId, min, max, slotBufferLimit, slotDateLimit,  slotDayLimit, callFrom, timeid){
	var divLen = $('.calday-hours').length;
	var selectDate= $("#inActDate").val();
	var strUnavailable=$('.calday-hours').text();
	//console.log(divLen);
	var daynum=selectDate.split("-")[2];
	if(divLen>0){
		if(strUnavailable != 'Unavailable'){
			if($('.timesection .fromTime').data('select2')) {
				$(".timesection .fromTime").select2("destroy");
			}
			if($('.timesection .toTime').data('select2')) {
				$(".timesection .toTime").select2("destroy");
			}
		}
		$('.calday-hours').each(function(index, tr) { 
			if(index==0){
				if(strUnavailable=='Unavailable'){
					getCalendarDateAvailability(formId, userId, "timeCalendarPopup",'',selectDate,"Month",true,""+prestartTime+"", ""+preendTime+"",'add-new-row',0,'daytime', userRoleId, min, max, slotBufferLimit, slotDateLimit,  slotDayLimit);
				}else{
					if($(".calhours-"+(divLen-1)+"").find('.fromTime').val()!='' && $(".calhours-"+(divLen-1)+"").find('.toTime').val()!=''){

					}else{
						showMessageTheme2(0, 'Please select start time and end time', '', true);
						return false;
					}
					var htmlTr = tr.outerHTML;
					htmlTr=htmlTr.replace("calhours-0","");
					htmlTr=htmlTr.replace("calday-hours","calday-hours calhours-"+divLen);
					$("."+cloneDiv).append(htmlTr);
					$(".calhours-"+divLen+"").removeClass("d-none");
					if(timeid==undefined){
						timeid=0;
					}
					var removeFun =  "removeSingleTimeDiv('calhours-"+divLen+"','"+divLen+"', '"+timeid+"', '"+userId+"', 'N', '"+prestartTime+"', '"+preendTime+"', '"+userRoleId+"','time-wise')";
					$('.calhours-'+divLen).find("a").attr("onclick",removeFun);
					$('.calhours-'+divLen).find(".calendar-remove-date").removeClass("d-none");
					
					$(".calhours-"+divLen+"").find('.fromTime').removeAttr('disabled');
					$(".calhours-"+divLen+"").find('.toTime').removeAttr('disabled');
					$(".calhours-"+divLen+"").find('.fromTime').attr('data-id',"calday-hours");
					$(".calhours-"+divLen+"").find('.toTime').attr('data-id',"calday-hours");
					$(".calhours-"+divLen+"").find('.fromTime').attr('data-checkid',""+daynum+"");
					$(".calhours-"+divLen+"").find('.toTime').attr('data-checkid',""+daynum+"");
					$(".calhours-"+divLen+"").find('.fromTime').attr('data-status',"N");
					$(".calhours-"+divLen+"").find('.toTime').attr('data-status',"N");
					$(".calhours-"+divLen+"").find(".slot-duration").attr("id", "calhours-time-"+divLen+"")


					if(callFrom=='remove-slot-week'){
						//var totalDuration=0;
						$(".calhours-"+divLen+"").addClass("hide-remove-button");
						$(".calhours-"+divLen+"").find('.fromTime').val(prestartTime);
						//$(".calhours-"+divLen+"").find('.fromTime').val("").trigger("change");
						$(".calhours-"+divLen+"").find('.toTime').val(preendTime);
						//$(".calhours-"+divLen+"").find('.toTime').val("").trigger("change");
						// diff = getTimeDifference(prestartTime, preendTime);
						// totalDuration = diff.asMilliseconds();
						// $("#"+dayname+"-hour-"+positionInd).text(getTimeWithFormat(totalDuration));
						$(".calhours-"+divLen+"").find('.fromTime').attr('disabled',true);
						$(".calhours-"+divLen+"").find('.toTime').attr('disabled',true);
						$('.calhours-'+divLen).find(".calendar-remove-date").addClass("d-none");
					}else{
						var startFromTime = $(".calhours-"+(divLen-1)+"").find('.toTime').val();
						var totalsDuration=0;
						if(startFromTime != null && startFromTime != ''){
							startFromTime = convertTo24Hour(startFromTime);
							startFromTime=startFromTime.split(':')
							//var fromT = "1970-12-31 "+$(".calhours-"+(divLen-1)+"").find('.toTime').val(); // Example date string in the format YYYY-MM-DD
							var fromT = new Date(1990, 1, 1, startFromTime[0], startFromTime[1], 0);
							var timestamp = Date.parse(fromT);
							var dateObject = new Date(timestamp);
							if(startFromTime[0]!="23" && startFromTime[1]!="59"){
								var timeinter = getTimePlusInterval(dateObject,slotBufferLimit);
								//$(".calhours-"+divLen+"").find('.fromTime').val(timeinter);
							}else{
								var timeinter = $(".calhours-"+(divLen-1)+"").find('.toTime').val();
								//$(".calhours-"+divLen+"").find('.fromTime').val($(".calhours-"+(divLen-1)+"").find('.toTime').val());
							}

							if(userRoleId!=3){
								var ST = $(".calhours-"+(divLen)+"").find('.fromTime').val();//timeinter;
							}else{
								var ST = "00:00 AM";
							}
						}
						
						
						//console.log(timeinter);
						
						//var toT = "1970-12-31 "+timeinter; // Example date string in the format YYYY-MM-DD
						var ET;
						if(timeinter){
							var endToTime = convertTo24Hour(timeinter);
						}
						if(endToTime != null && endToTime != ''){
							endToTime = endToTime.split(':');
							var toT = new Date(1990, 1, 1, endToTime[0], endToTime[1], 0);

							var timestampTo = Date.parse(toT);
							var totimedate = new Date(timestampTo);
							if(endToTime[0]!="23" && endToTime[1]!="59"){
								var timeinterTo = getTimePlusInterval(totimedate,slotBufferLimit);
								//$(".calhours-"+divLen+"").find('.toTime').val(timeinterTo)
								if(USER_ROLE !="TEACHER" && USER_ROLE !="DIRECTOR"){
									ET=timeinterTo
								}else{
									ET = "00:00 AM"
								}
							}else{
								//$(".calhours-"+divLen+"").find('.toTime').val($(".calhours-"+(divLen-1)+"").find('.toTime').val())
								if(USER_ROLE !="TEACHER" && USER_ROLE !="DIRECTOR"){
									ET=timeinter
								}else{
									ET = "00:00 AM"
								}
							}
						}
						if(ST!=undefined){
							diff = getTimeDifference(ST, ET);
							totalsDuration += diff.asMilliseconds();
						}
						$(".calhours-"+divLen+"").find("#calhours-time-"+divLen+"").text((totalsDuration>0?getTimeWithFormat(totalsDuration):'0h 0m'));
						// if(USER_ROLE == "TEACHER" || USER_ROLE == "DIRECTOR"){
						if((divLen-1) == 0 && !$(".calhours-"+(divLen-1)+"").find(".calendar-remove-date").hasClass("d-none")){
							if($(".calhours-"+divLen+"").find('.fromTime option:first-child').val() != ""){
								$(".calhours-"+divLen+"").find('.fromTime').prepend("<option value=''>Start Time</option>");
							}
						}
						if(userRoleId == 3){
							$(".calhours-"+divLen+"").find('.fromTime').val("").trigger("change");
						}	
					}
				}
			}
		});

		if($('.timesection .fromTime').data('select2')) {
			$(".timesection .fromTime").select2("destroy");
		}
		if($('.timesection .toTime').data('select2')) {
			$(".timesection .toTime").select2("destroy");
		}

		$(".timesection .fromTime").select2({
			theme:"bootstrap4",
			closeOnSelect:true,
			dropdownParent:"#timeAvailabilityPopup .timesection"
		});
		$(".timesection .toTime").select2({
			theme:"bootstrap4",
			closeOnSelect:true,
			dropdownParent:"#timeAvailabilityPopup .timesection"
		});
		
	}
}

function removeSingleTimeDiv(divid, indx, timeid, userId, dateWise, prestartTime, preendTime, userRoleId, timetype){
	if(userRoleId!=3){
		$( "."+divid).remove();
		var totalTimeInDay=$(".daytime").find(".calday-hours").length;
		if(totalTimeInDay>0){
			$('.calday-hours').each(function(index, tr) { 
				console.log($(this).attr("class"));
				var onclick = $(this).find("a");
				
				var sclass = $(this).attr("class");
				var spliClass=$.trim(sclass).split(" ");
				var rClass=spliClass[spliClass.length-1];
				console.log(rClass);
				$(this).removeClass(rClass);
				$(this).addClass("calhours-"+index);
				var removeClick="removeSingleTimeDiv('calhours-"+index+"','"+index+"', '"+timeid+"', '"+userId+"', '"+dateWise+"', '"+prestartTime+"', '"+preendTime+"', '"+userRoleId+"','"+timetype+"')";
				onclick.attr("onclick",removeClick);
			});
		}
	
		//console.log(totalTimeInDay);
		if(totalTimeInDay==0){
			var htmlw="";
			htmlw=htmlw+'<div class="row px-3 align-items-center justify-content-sm-start justify-content-around calday-hours mb-1 calhours-0">';
			htmlw=htmlw+'Unavailable';
			htmlw=htmlw+'</div>';
			$(".daytime").html(htmlw);
		}
	}else{
		if(userRoleId==3){
			var slotRemoveType='time-wise';
			if(timetype=='weekwise'){
				slotRemoveType='day-wise';
			}
			if(timeid==0){
				$( "."+divid).remove();
			}else{
				var selectDate=$("#inActDate").val();
				var resp = getTeacherMeetingStatus(slotRemoveType,0, userId, timeid, divid, selectDate);
				if(resp){
					$( "."+divid).remove();
					var totalTimeInDay=$(".daytime").find(".calday-hours").length;
					if(totalTimeInDay==0){
						var htmlw="";
						htmlw=htmlw+'<div class="row px-3 align-items-center justify-content-sm-start justify-content-around calday-hours mb-1 calhours-0">';
						htmlw=htmlw+'Unavailable';
						htmlw=htmlw+'</div>';
						$(".daytime").html(htmlw);
					}
					// if(!$(".timeAvailabilityConfirmationAction").hasClass("show")){
					// 	$(".timeAvailabilityConfirmationAction").addClass("show");
					// }
				}
			}
		}
	}
	
}


function getFromTime(obj, prestartTime, preendTime, userRoleId, min, max, slotBufferLimit, slotDateLimit,  slotDayLimit){
	//if(USER_ROLE == "TEACHER" || USER_ROLE == "DIRECTOR"){
		if(userRoleId==3 ){
			checkStartTimeVlidation(obj, true, min, max, dropdownTimeGap);
		}
		var timeSlotAvailability=[];
		var timeclass = $(obj).attr('data-id');
		var showTotlaTime = $(obj).attr('data-id').split("-")[0];
		var days = $(obj).attr('data-checkid');
		var userid= $("#userId").val();
		if(userRoleId==3 && !$("#timeAvailabilityPopup").hasClass("show")){
			if(!$(".timeAvailabilityConfirmationAction").hasClass("show")){
				$(".timeAvailabilityConfirmationAction").addClass("show");
			}
		}
		
		var validStatus=validateTimes(timeclass, 'fromTime', 'toTime', userRoleId, min, max,slotBufferLimit);
		//if(timeclass != "calday-hours"){
			if(validStatus){
				var dayn;
				$('.'+timeclass).each(function() { 
					var teacherTime={};
					var startTime = $(this).find('.fromTime').val();
					var endTime = $(this).find('.toTime').val();
					if(startTime!=undefined &&  startTime!=null && startTime!='' && endTime !=undefined && endTime !=null && endTime !=''){
						teacherTime['dayid']=days;
						teacherTime['startTime']=startTime;
						teacherTime['endTime']=endTime;
						teacherTime['dayCheck']='Y';
						timeSlotAvailability.push(teacherTime);
					}
					var duration=0
					if(startTime!=undefined &&  startTime!=null && startTime!='' && endTime !=undefined && endTime !=null && endTime !=''){
						diff = getTimeDifference(startTime, endTime);
						duration += diff.asMilliseconds();

						var timeID = $(this).attr("id");
						if(timeID!=undefined){
							var dayId = timeclass.split("-")[1];
							dayn = timeID.split("-")[0];
							var dayi = timeID.split("-")[2];
							$("#"+dayn+"-hour-"+dayi).text((duration>0?getTimeWithFormat(duration):'0h 0m'));
							$(".total-minutes-"+dayId).text((duration>0?getTimeWithFormat(duration):'0h 0m'));
						}
					}else if(endTime ==''){
						$("#"+dayn+"-hour-"+dayi).text('0h 0m');
					}
				});
				var totalDuration=0;
				$('.'+dayn+'-'+days).not('.d-none').each(function() { 
					var teacherTime={};
					var startTime = $(this).find('.fromTime').val();
					var endTime = $(this).find('.toTime').val();
					days = $(this).find('.toTime').attr('data-checkid');
					if(startTime!=undefined &&  startTime!=null && startTime!='' && endTime !=undefined && endTime !=null && endTime !=''){
						teacherTime['dayid']=days;
						teacherTime['startTime']=startTime;
						teacherTime['endTime']=endTime;
						teacherTime['dayCheck']='Y';
						timeSlotAvailability.push(teacherTime);

						diff = getTimeDifference(startTime, endTime);
						totalDuration += diff.asMilliseconds();
					}
				});
				$(".total-minutes-"+days).text(getTimeWithFormat(totalDuration));
				
				//console.log("getFromTime");
				if(userRoleId!=3){
					saveTimeCalendarWeekWise(userid,days,timeSlotAvailability, 'add','from-time',prestartTime, preendTime, userRoleId, min, max, slotBufferLimit, slotDateLimit,  slotDayLimit);
				}
			}
		//}
	//}
}

function getToTime(obj,prestartTime, preendTime, userRoleId, min, max, slotBufferLimit, slotDateLimit,  slotDayLimit){
	var timeSlotAvailability=[];
	var timeclass = $(obj).attr('data-id');
	var showTotlaTime = $(obj).attr('data-id').split("-")[0];
	var days = $(obj).attr('data-checkid');
	var userid= $("#userId").val();
	if(userRoleId==3 && !$("#timeAvailabilityPopup").hasClass("show")){
		if(!$(".timeAvailabilityConfirmationAction").hasClass("show")){
			$(".timeAvailabilityConfirmationAction").addClass("show");
		}
	}
	var validStatus=validateTimes(timeclass, 'fromTime', 'toTime', userRoleId, min, max,slotBufferLimit);
	//if(timeclass != "calday-hours"){
		if(validStatus){
			var dayn;
			$('.'+timeclass).not('.d-none').each(function(index) { 
				var teacherTime={};
				var startTime = $(this).find('.fromTime').val();
				var endTime = $(this).find('.toTime').val();
				if(startTime!=undefined &&  startTime!=null && startTime!='' && endTime !=undefined && endTime !=null && endTime !=''){
					teacherTime['dayid']=days;
					teacherTime['startTime']=startTime;
					teacherTime['endTime']=endTime;
					teacherTime['dayCheck']='Y';
					timeSlotAvailability.push(teacherTime);
				}

				var duration=0
				if(startTime!=undefined &&  startTime!=null && startTime!='' && endTime !=undefined && endTime !=null && endTime !=''){
					diff = getTimeDifference(startTime, endTime);
					duration += diff.asMilliseconds();
					if(timeclass != "calday-hours"){
						var timeID = $(this).attr("id");
						if(timeID!=undefined){
							var dayId = timeclass.split("-")[1];
							dayn = timeID.split("-")[0];
							var dayi = timeID.split("-")[2];
							$("#"+dayn+"-hour-"+dayi).text((duration>0?getTimeWithFormat(duration):'0h 0m'));
							$(".total-minutes-"+dayId).text((duration>0?getTimeWithFormat(duration):'0h 0m'));
						}
					}else{
						$("#calhours-time-"+index).text((duration>0?getTimeWithFormat(duration):'0h 0m'));
					}
				}else if(endTime ==''){
					if(timeclass != "calday-hours"){
						var timeID = $(this).attr("id");
						if(timeID!=undefined){
							var dayId = timeclass.split("-")[1];
							dayn = timeID.split("-")[0];
							var dayi = timeID.split("-")[2];
							$("#"+dayn+"-hour-"+dayi).text('0h 0m');
						}
					}else{
						$("#calhours-time-"+index).text('0h 0m');
					}
				}
				
			});
			if(timeclass != "calday-hours"){
				var totalDuration=0;
				$('.'+dayn+'-'+days).not('.d-none').each(function() { 
					var teacherTime={};
					var startTime = $(this).find('.fromTime').val();
					var endTime = $(this).find('.toTime').val();
					days = $(this).find('.toTime').attr('data-checkid');
					if(startTime!=undefined &&  startTime!=null && startTime!='' && endTime !=undefined && endTime !=null && endTime !=''){
						teacherTime['dayid']=days;
						teacherTime['startTime']=startTime;
						teacherTime['endTime']=endTime;
						teacherTime['dayCheck']='Y';
						timeSlotAvailability.push(teacherTime);

						diff = getTimeDifference(startTime, endTime);
						totalDuration += diff.asMilliseconds();
					}
				});
				$(".total-minutes-"+days).text(getTimeWithFormat(totalDuration));
			}else{
				var totalDuration=0;
				$('.calday-hours').not('.d-none').each(function() { 
					var startTime = $(this).find('.fromTime').val();
					var endTime = $(this).find('.toTime').val();
					if(startTime!=undefined &&  startTime!=null && startTime!='' && endTime !=undefined && endTime !=null && endTime !=''){
						diff = getTimeDifference(startTime, endTime);
						totalDuration += diff.asMilliseconds();
					}
				});
				$(".specificTotalGivenAvailability").text(getTimeWithFormat(totalDuration));
			}
			
			
			if(userRoleId!=3){
				saveTimeCalendarWeekWise(userid,days,timeSlotAvailability, 'add','to-time',prestartTime, preendTime, userRoleId, min, max, slotBufferLimit, slotDateLimit,  slotDayLimit);
			}
		}
	//}
}

function getCalendarAvailabilityData(formId, userId,elementId, startDate, slotType, prestartTime, preendTime, userRoleId, min, max, slotBufferLimit, slotDateLimit,  slotDayLimit) {
	customLoader(false);
	var responseData={};
	var slotDisplyType='availability';
	var request = { userId:userId, lUserId:USER_ID, startDate: startDate, slotType: slotType, slotDisplyType:slotDisplyType, onlyCounts:'Y'};
	$.ajax({
		type: "POST",
		url: getURLFor('timeavailability', 'get-calendar-availability'),
		contentType: "application/json",
		data: JSON.stringify(request),
		dataType: 'json',
		async : false,
		success: function (data) {
			responseData=data;
		}
	});
	return responseData;
}

///TODO:Mayank
function getTeacherTotalAvailability(teacherUserId) {
	customLoader(true);
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForHTML('report', 'get-teacher-availability'),
		data : JSON.stringify(getRequestForTeacherTotalAvailability(teacherUserId)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		async : false,
		success : function(data) {
			responseData=data;
		},
		error : function(e) {
			console.log(e);
		}
	});
	return responseData
}

function getRequestForTeacherTotalAvailability(teacherUserId){
	var data={};
	var teacherTimeListFilterDTO={};
	teacherTimeListFilterDTO['callType']='time-availability';
	teacherTimeListFilterDTO['userId']=USER_ID;
	if(teacherUserId!=''){
		teacherTimeListFilterDTO['teacherUserId']=teacherUserId;
	}
	teacherTimeListFilterDTO['datetype']='MONTH';
	data['teacherTimeListFilterDTO']=teacherTimeListFilterDTO;
	return data;
}

function getRequestForTeacherRemainingTime(callfrom, teacherUserId, userRole, callType, autoForwordStatus) {
	var teacherAssignRequest = {};
	teacherAssignRequest['userId'] = teacherUserId;
	teacherAssignRequest['userRole'] = userRole;
	teacherAssignRequest['schoolId'] = SCHOOL_ID;
	teacherAssignRequest['callFrom'] = callfrom;
	teacherAssignRequest['callType'] = callType;
	teacherAssignRequest['autoForwordStatus'] = autoForwordStatus;
	teacherAssignRequest['dataType']='MONTH';

	console.log(teacherAssignRequest);
	return teacherAssignRequest;
}

function getTeacherRemainingTime(callfrom, teacherUserId, userRole, modalID, callType, autoForwordStatus) {
	var responseData=null;
	customLoader(false);
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLForHTML('report', 'get-teacher-time-preference-datewise'),
		data: JSON.stringify(getRequestForTeacherRemainingTime(callfrom, teacherUserId, userRole, callType, autoForwordStatus)),
		dataType: 'json',
		cache: false,
		timeout: 600000,
		async: false,
		success: function (data) {
			console.log(data);
			responseData=data;
		},
		error: function (e) {
			if (tt == 'theme2') {
				showMessageTheme2(2, TECHNICAL_GLITCH, '', true);
			} 
		}
	});
	return responseData
}

function getCalendarAvailability(formId, userId,elementId, startDate, slotType, prestartTime, preendTime, userRoleId, min, max, slotBufferLimit, slotDateLimit,  slotDayLimit) {
   var response=true;
	customLoader(true);
	var slotDisplyType=$('input[name="availabilitySlot"]:checked').val();
	var request = { userId:userId, lUserId:USER_ID, startDate: startDate, slotType: slotType, slotDisplyType:slotDisplyType, onlyCounts:'N'};
	$.ajax({
		type: "POST",
		url: getURLFor('timeavailability', 'get-calendar-availability'),
		contentType: "application/json",
		data: JSON.stringify(request),
		dataType: 'json',
		cache: false,
		async: true,
		timeout: 600000,
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
				response=false;
			} else {
				$("#"+elementId).html('');
				var monthyear = data.monthName+' - '+data.year;
				$("#timeCalMonthYear").html(monthyear);
				$("#timeToDayDate").val(data.startDate);
				$("#timeFirstDate").val(data.firstDate);
				$("#timeFirstDateNextMonth").val(data.firstDateNextMonth);
				$("#timeFirstDatePreMonth").val(data.firstDatePreMonth);

				

				var htmlss = getCalendarAvailabilityTable(formId, userId, data, prestartTime, preendTime, slotDisplyType,userRoleId, min, max, slotBufferLimit, slotDateLimit,  slotDayLimit);
				$("#"+elementId).html(htmlss);
				$('[data-toggle="tooltip"]').tooltip();
				$(".btnEditDate").hide();
				$(".btnEditWeek").hide();

				$('.dropdown').on('shown.bs.dropdown', function(){
					$(".show-view-more").css({"overflow-y":"inherit"});
				});
				$('.dropdown').on('hidden.bs.dropdown', function(e){
					$(".show-view-more").css({"overflow-y":"auto"});
					if(userRoleId == 3){
						$(e).parent().find("bg-danger").removeClass("bg-danger")
					}
				});
				$('.dropdown-toggle').on('click', function(event) {
					if(userRoleId == 3){
						$('.dropdown-toggle').removeClass("bg-danger px-1");
						$(this).addClass("bg-danger px-1");
					}
					var $dropdownMenu = $(this).next('.dropdown-menu');
					var windowWidth = $(window).width();
					var dropdownOffset = $(this).offset();
					var dropdownWidth = $dropdownMenu.outerWidth();
					var spaceRight = windowWidth - (dropdownOffset.left + $(this).outerWidth());
					
					// Adjust the alignment based on available space
					if (spaceRight < dropdownWidth) {
						$dropdownMenu.addClass('dropdown-menu-left').removeClass('dropdown-menu-right');
					} else {
						$dropdownMenu.addClass('dropdown-menu-right').removeClass('dropdown-menu-left');
					}
					if($("#timeCalendar .dropdown-menu").hasClass("show")){
						$("#timeCalendar .dropdown-menu").removeClass("show");
						$("#timeCalendar .dropdown-menu").parent().closest(".scrollbar-container").css({"overflow-y":"auto"});
					}
				});
				//$("#timeCalendar > table > thead").css({"position":"sticky","z-index":"9","top":"0"});
				$("#timeCalendar > table > thead td").css({"background":"#fff"});
				
				// if(USER_ROLE_ID==3){
				// 	var monthViewMin=parseInt($("#monthViewMin").val());
				// 	var monthViewMax=parseInt($("#monthViewMax").val());
				// 	if(monthViewMin>0){
				// 		$("#timePreCalMonth").show()
				// 	}else{
				// 		$("#timePreCalMonth").hide();
				// 	}
				// 	if(monthViewMax>0){
				// 		$("#timeNextCalMonth").show()
				// 	}else{
				// 		$("#timeNextCalMonth").hide();
				// 	}
				// }


				response=true;
			}
			customLoader(false);
			//return false;
		}
	});
	return response;
}

function getCalendarAvailabilityTable(formId, userId, data, prestartTime, preendTime, slotDisplyType, userRoleId, min, max, slotBufferLimit, slotDateLimit,  slotDayLimit){
	console.log(data);
	
	var dayOfWeekVal = data.dayOfWeekVal;
	var startDate=dayOfWeekVal;
	var enabledDateList = data.calendarDateList;
	var htmlCal = "";
	htmlCal=htmlCal+'<table class="table text-center mb-0">';
	htmlCal=htmlCal+'<thead><tr class="text-uppercase">'
	htmlCal=htmlCal+'<td class="bold">Sun';
	if(userRoleId==3 && USER_ROLE!='TEACHER'){
		htmlCal=htmlCal+'<a href="javascript:void(0);" id="reset-sun" onclick="resetAllDateSpecificByDayAndUserId('+userId+',1,\''+prestartTime+'\', \''+preendTime+'\', '+userRoleId+',\' '+min+'\', \''+max+'\', '+slotBufferLimit+','+ slotDateLimit+','+slotDayLimit+')" style="right:8px;bottom:50px;font-size:20px" data-toggle="tooltip" data-placement="top" data-original-title="Reset-All-Date-specific"><i class="lnr lnr-sync float-right text-primary"></i></a>';
	}
	htmlCal=htmlCal+'</td>';
	htmlCal=htmlCal+'<td class="bold">Mon';
	if(userRoleId==3 && USER_ROLE!='TEACHER'){
		htmlCal=htmlCal+' <a href="javascript:void(0);" id="reset-mon" onclick="resetAllDateSpecificByDayAndUserId('+userId+',2,\''+prestartTime+'\', \''+preendTime+'\', '+userRoleId+',\' '+min+'\', \''+max+'\', '+slotBufferLimit+','+ slotDateLimit+','+slotDayLimit+')" style="right:8px;bottom:50px;font-size:20px" data-toggle="tooltip" data-placement="top" data-original-title="Reset-All-Date-specific"><i class="lnr lnr-sync float-right text-primary"></i></a>';
	}
	htmlCal=htmlCal+'</td>';
	htmlCal=htmlCal+'<td class="bold">Tue';
	if(userRoleId==3 && USER_ROLE!='TEACHER'){
		htmlCal=htmlCal+' <a href="javascript:void(0);" id="reset-tue" onclick="resetAllDateSpecificByDayAndUserId('+userId+',3,\''+prestartTime+'\', \''+preendTime+'\', '+userRoleId+',\' '+min+'\', \''+max+'\', '+slotBufferLimit+','+ slotDateLimit+','+slotDayLimit+')" style="right:8px;bottom:50px;font-size:20px" data-toggle="tooltip" data-placement="top" data-original-title="Reset-All-Date-specific"><i class="lnr lnr-sync float-right text-primary"></i></a>';
	}
	htmlCal=htmlCal+'</td>';
	htmlCal=htmlCal+'<td class="bold">Wed ';
	if(userRoleId==3 && USER_ROLE!='TEACHER'){
		htmlCal=htmlCal+' <a href="javascript:void(0);" id="reset-wed" onclick="resetAllDateSpecificByDayAndUserId('+userId+',4,\''+prestartTime+'\', \''+preendTime+'\', '+userRoleId+',\' '+min+'\', \''+max+'\', '+slotBufferLimit+','+ slotDateLimit+','+slotDayLimit+')" style="right:8px;bottom:50px;font-size:20px" data-toggle="tooltip" data-placement="top" data-original-title="Reset-All-Date-specific"><i class="lnr lnr-sync float-right text-primary"></i></a>';
	}
	htmlCal=htmlCal+'</td>';
	htmlCal=htmlCal+'<td class="bold">Thu';
	if(userRoleId==3 && USER_ROLE!='TEACHER'){
		htmlCal=htmlCal+' <a href="javascript:void(0);" id="reset-thu" onclick="resetAllDateSpecificByDayAndUserId('+userId+',5,\''+prestartTime+'\', \''+preendTime+'\', '+userRoleId+',\' '+min+'\', \''+max+'\', '+slotBufferLimit+','+ slotDateLimit+','+slotDayLimit+')" style="right:8px;bottom:50px;font-size:20px" data-toggle="tooltip" data-placement="top" data-original-title="Reset-All-Date-specific"><i class="lnr lnr-sync float-right text-primary"></i></a>';
	}
	htmlCal=htmlCal+'</td>';
	htmlCal=htmlCal+'<td class="bold">Fri';
	if(userRoleId==3 && USER_ROLE!='TEACHER'){
		htmlCal=htmlCal+' <a href="javascript:void(0);" id="reset-fri" onclick="resetAllDateSpecificByDayAndUserId('+userId+',6,\''+prestartTime+'\', \''+preendTime+'\', '+userRoleId+',\' '+min+'\', \''+max+'\', '+slotBufferLimit+','+ slotDateLimit+','+slotDayLimit+')" style="right:8px;bottom:50px;font-size:20px" data-toggle="tooltip" data-placement="top" data-original-title="Reset-All-Date-specific"><i class="lnr lnr-sync float-right text-primary"></i></a>';
	}
	htmlCal=htmlCal+'</td>';
	htmlCal=htmlCal+'<td class="bold">Sat';
	if(userRoleId==3 && USER_ROLE!='TEACHER'){
		htmlCal=htmlCal+' <a href="javascript:void(0);" id="reset-sat" onclick="resetAllDateSpecificByDayAndUserId('+userId+',7,\''+prestartTime+'\', \''+preendTime+'\', '+userRoleId+',\' '+min+'\', \''+max+'\', '+slotBufferLimit+','+ slotDateLimit+','+slotDayLimit+')" style="right:8px;bottom:50px;font-size:20px" data-toggle="tooltip" data-placement="top" data-original-title="Reset-All-Date-specific"><i class="lnr lnr-sync float-right text-primary"></i></a>';
	}
	htmlCal=htmlCal+'</td>';
	htmlCal=htmlCal+'</tr>';
	htmlCal=htmlCal+'</thead>';
	htmlCal=htmlCal+'<tbody>';
	htmlCal=htmlCal+'<tr>';
	if(dayOfWeekVal!=7){
		startDate=dayOfWeekVal;
		for (let i = 1; i <= (dayOfWeekVal-1); i++) {
			htmlCal=htmlCal+'<td></td>';
		}
	}
	if(dayOfWeekVal==7){
		for (let i = 1; i <= (dayOfWeekVal-1); i++) {
			htmlCal=htmlCal+'<td></td>';
		}
	}
	var grandTotalDuration=0;
	for (let i = 0; i < enabledDateList.length; i++) {
		var borderClass='';
		var dates = enabledDateList[i];
		//var bookingTime =dates.bookingDateList;
		var availabilityTime =dates.availabilityDateList;
		var holidayClass="";
		if(startDate==1 || startDate==7){
			holidayClass=dates.available==1?'selected-date':'active-date';
		}else if(dates.isClick == 0){
			holidayClass='expired-date';
		}else if(dates.available == 1){
			holidayClass='selected-date';
		}else{
			holidayClass='active-date';
		}
		if(startDate<=7){
			//if(dates.isClick == 1){
				var onSclick = "openCalendarMenuBtn(this, '"+dates.day1+"')";
				var onCalclick = "openCalendarPopup('"+formId+"','"+userId+"','"+data.startDate+"', '"+dates.slotDate+"', '"+prestartTime+"', '"+preendTime+"', '"+userRoleId+"', '"+min+"', '"+max+"', '"+slotBufferLimit+"', '"+slotDateLimit+"', '"+slotDayLimit+"')";
				var onWeeekSclick = "openCalendarWeekPopup('"+formId+"','"+userId+"','"+dates.weekDayName+"', '','"+dates.slotDate+"','"+dates.weekDayId+"', '"+prestartTime+"', '"+preendTime+"','"+userRoleId+"', '"+min+"', '"+max+"', '"+slotBufferLimit+"', '"+slotDateLimit+"', '"+slotDayLimit+"')";
				var onWeekRefreshSclick = "getRefreshWeek('from-counselor','"+userId+"','"+dates.slotDate+"','"+dates.weekDayId+"', '"+prestartTime+"', '"+preendTime+"','"+userRoleId+"', '"+min+"', '"+max+"', '"+slotBufferLimit+"', '"+slotDateLimit+"', '"+slotDayLimit+"')";
				if(dates.isClick == 1){
					htmlCal=htmlCal+'<td class="border-top-4 td-bg-white  position-relative '+holidayClass+'">';
				}else{
					htmlCal=htmlCal+'<td class="td-bg-gray position-relative '+holidayClass+'">';
				}
				if(availabilityTime!=null && availabilityTime.length>0){
						var viewcount = availabilityTime.length;
						var totalDuration=0;
						if(viewcount>0){
							for (let bt = 0; bt < availabilityTime.length; bt++) {
								bookt = availabilityTime[bt];
								diff = getTimeDifference(bookt.startTime, bookt.endTime);
								totalDuration += diff.asMilliseconds();
							}
						}
						grandTotalDuration+=totalDuration;
						// console.log('i = '+i+' | totalDuration='+totalDuration+' | '+getTimeWithFormat(totalDuration)+' | grandTotalDuration='+grandTotalDuration+' | '+getTimeWithFormat(grandTotalDuration));
						var color='primary';
						if(slotDisplyType == "booked"){
							color ="danger"
						}else if(slotDisplyType == "available"){
							color ="success"
						}
						
						htmlCal=htmlCal+dates.day1;
						if(dates.dayTimeType=='Unavailable'){
							//htmlCal=htmlCal+'<span  class="d-inline-block float-right text-white font-12 px-1 bg-'+color+'">'+getTimeWithFormat(totalDuration)+'</span>';
						}else{
							htmlCal=htmlCal+'<span  class="d-inline-block float-right text-white font-12 px-1 bg-'+color+'">'+getTimeWithFormat(totalDuration)+'</span>';
						}
						// if(dates.isClick == 1){
						// 	if(slotDisplyType=='booked' || slotDisplyType=='available'){
						// 	}else{
						// 		if(dates.timeType=='calendar'){
						// 			htmlCal=htmlCal+'<a href="javascript:void(0);" id="slotSelectDate'+dates.day1+'"  onclick="'+onSclick+'"  class="'+holidayClass+' d-inline-block float-right calendarBtn"><i class="lnr-calendar-full float-right text-primary"></i></a>';
						// 		}else{
						// 			htmlCal=htmlCal+'<a href="javascript:void(0);" id="slotSelectDate'+dates.day1+'"  onclick="'+onSclick+'"  class="'+holidayClass+' d-inline-block float-right syncBtn"><i class="lnr lnr-sync float-right text-primary"></i></a>';
						// 		}
						// 	}
						// }
						htmlCal=htmlCal+'<div class="full mt-2 show-view-more scrollbar-container h-auto" style="position:static">';
						if(userRoleId!=3){
							htmlCal=htmlCal+'<div class="full btnEditDate pr-3"  id="btnEditDate'+dates.day1+'"><a href="javascript:void(0)" onclick="'+onCalclick+'" class="mb-1 full btn btn-sm btn-outline-dark d-inline-block "><i class="lnr-calendar-full mr-1"></i>Edit <b>date(s)</b></a></div>';
						}
						if(dates.timeType=='calendar'){
							htmlCal=htmlCal+'<div class="full btnEditWeek pr-3"  id="btnEditWeek'+dates.day1+'"><a href="javascript:void(0)" onclick="'+onWeekRefreshSclick+'" class="mb-1 full btn btn-sm btn-outline-dark d-inline-block "><i class="lnr-sync mr-1"></i>Reset to Weekly hours</b></a></div>';
						}else{
							htmlCal=htmlCal+'<div class="full btnEditWeek pr-3"  id="btnEditWeek'+dates.day1+'"><a href="javascript:void(0)" onclick="'+onWeeekSclick+'" class="mb-1 full btn btn-sm btn-outline-dark d-inline-block "><i class="lnr lnr-frame-expand mr-1"></i>Edit <b>all '+dates.weekDayName+'</b></a></div>';
						}

						if(dates.dayTimeType=='Unavailable'){
							htmlCal=htmlCal+'<div class="time-row full font-weight-semi-bold p-1 mb-1 text-center" style="color:#9f9c9c;" >'+dates.dayTimeType+'</div>';
						}else{

							for (let bt = 0; bt < availabilityTime.length; bt++) {
								//console.log(bt)
								const bookt = availabilityTime[bt];
								var meetingClick="";
								if(slotDisplyType=='booked'){
									var startdateid=bookt.slotDate.toString().replace("-","");
									if(userRoleId==3){
										meetingClick="getTeacherTimeBooked('"+bookt.entityId+"','"+bookt.entityType+"','"+bookt.slotDate+"','"+startdateid+"');"
									}else{
										meetingClick="callMeetingBooking('calendar-available','"+bookt.timeid+"','"+bookt.timeCategory+"','"+bookt.slotDate+"','"+bookt.entityType+"','"+bookt.entityId+"');"
									}
								}
								borderClass=getColorByEntityType(bookt.entityType);
								// if(bookt.timeCategory=='booked'){
								// 	borderClass='border-success';
								// }
								if(bt>2){
									htmlCal=htmlCal+'<div class="time-row full font-weight-semi-bold p-1 mb-1 border-'+borderClass+'" style="display:none">';
									if(slotDisplyType!='booked'){
										htmlCal=htmlCal+'<span class=\'text-'+color+'\'>'+bookt.startTime+' - '+bookt.endTime+'</span>';
									}else{
										htmlCal=htmlCal+'<a href="javascript:void(0)" aria-haspopup="true" aria-expanded="false" data-toggle="dropdown" class="btn btn-sm p-1 font-12 dropdown-toggle  btn-'+borderClass+' text-white" onClick="'+meetingClick+'" >'+bookt.startTime+' - '+bookt.endTime+'</a>';
										if(userRoleId==3){
											if(bookt.recurringClass=='Y'){
												htmlCal=htmlCal+'&nbsp;<label class="font-12" data-toggle="tooltip" data-placement="top" data-original-title="Recurring Class">R</label>';
											}
										}
										htmlCal=htmlCal+'<div tabindex="-1" role="menu" aria-hidden="true" class="dropdown-menu-md dropdown-menu p-0 mt-2 meetingDetailclass'+bookt.timeid+'" style="min-width:450px"></div>';
									}
									htmlCal=htmlCal+'</div>';
								}else{
									htmlCal=htmlCal+'<div class="full font-weight-semi-bold p-1 mb-1 dropdown">';
									//htmlCal=htmlCal+'<a href="javascript:void(0)" aria-haspopup="true" aria-expanded="false" data-toggle="dropdown" class="+((slotDisplyType=='booked'?'dropdown-toggle ':'')+'">'+bookt.startTime+' - '+bookt.endTime+'</a>';
									if(slotDisplyType!='booked'){
										htmlCal=htmlCal+'<span class=\'text-'+color+'\'>'+bookt.startTime+' - '+bookt.endTime+'</span>';
									}else{
										htmlCal=htmlCal+'<a href="javascript:void(0)" aria-haspopup="true" aria-expanded="false" data-toggle="dropdown" class="btn btn-sm p-1 font-12 dropdown-toggle btn-'+borderClass+' text-white" onClick="'+meetingClick+'" >'+bookt.startTime+' - '+bookt.endTime+'</a>';
										if(userRoleId==3){
											if(bookt.recurringClass=='Y'){
												htmlCal=htmlCal+'&nbsp;<label class="font-12" data-toggle="tooltip" data-placement="top" data-original-title="Recurring Class">R</label>';
											}
										}
										htmlCal=htmlCal+'<div tabindex="-1" role="menu" aria-hidden="true" class="dropdown-menu-md dropdown-menu p-0 mt-2 meetingDetailclass'+bookt.timeid+'" style="min-width:450px"></div>';
									}	
									htmlCal=htmlCal+'</div>';
								}
								
							}
							if(dates.isClick == 1){
								// if(slotDisplyType=='booked' || slotDisplyType=='available'){
									
								// }else{
									
									if(dates.timeType=='calendar'){
										if(userRoleId!=3){
											if(slotDisplyType!='booked' && slotDisplyType!='available'){
												htmlCal=htmlCal+'<a href="javascript:void(0);" id="slotSelectDate'+dates.day1+'"  onclick="'+onSclick+'" class="'+holidayClass+' d-inline-block float-right calendarBtn position-absolute font-size-md" style="right:8px;bottom:50px;font-size:20px" data-toggle="tooltip" data-placement="top" data-original-title="Date-specific"><i class="lnr-calendar-full float-right text-primary"></i></a>';
											}
										}else{
											if(USER_ROLE=='TEACHER' ){
												htmlCal=htmlCal+'<span id="slotSelectDate'+dates.day1+'"  class="'+holidayClass+' d-inline-block float-right position-absolute font-size-md" style="right:8px;bottom:50px;font-size:20px" data-toggle="tooltip" data-placement="top" data-original-title="Date-specific"><i class="lnr-calendar-full float-right" style="color:#333"></i></span>';
											}else{
												htmlCal=htmlCal+'<a href="javascript:void(0);" id="slotSelectDate'+dates.day1+'" onclick="'+onSclick+'" class="'+holidayClass+' d-inline-block float-right position-absolute font-size-md" style="right:8px;bottom:50px;font-size:20px" data-toggle="tooltip" data-placement="top" data-original-title="Date-specific"><i class="lnr-calendar-full float-right text-primary"></i></a>';
											}
										}
									}else{
										if(userRoleId!=3){
											if(slotDisplyType!='booked' && slotDisplyType!='available'){
												htmlCal=htmlCal+'<a href="javascript:void(0);" id="slotSelectDate'+dates.day1+'" onclick="'+onSclick+'" class="'+holidayClass+' d-inline-block float-right syncBtn position-absolute font-size-md" style="right:8px;bottom:50px;font-size:20px" data-toggle="tooltip" data-placement="top" data-original-title="Weekly"><i class="lnr lnr-sync float-right text-primary"></i></a>';
											}
										}else{
											htmlCal=htmlCal+'<span id="slotSelectDate'+dates.day1+'"  class="'+holidayClass+' d-inline-block float-right position-absolute font-size-md" style="right:8px;bottom:50px;font-size:20px" data-toggle="tooltip" data-placement="top" data-original-title="Weekly"><i class="lnr lnr-sync float-right" style="color:#333"></i></span>';
										}
									}
								//}
							}else{
								// if(slotDisplyType=='booked' || slotDisplyType=='available'){
								// 	if(userRoleId!=3){
										
								// 	}else{
								// 		htmlCal=htmlCal+'<span href="javascript:void(0);" id="slotSelectDate'+dates.day1+'"  class="'+holidayClass+' d-inline-block float-right position-absolute font-size-md" style="right:8px;bottom:50px;font-size:20px" data-toggle="tooltip" data-placement="top" data-original-title="Weekly"><i class="lnr-calendar-full float-right" style="color:#333"></i></span>';
								// 	}
								// }
								// else{
									
									if(dates.timeType=='calendar'){
										if(userRoleId==3){
											htmlCal=htmlCal+'<span id="slotSelectDate'+dates.day1+'"  class="'+holidayClass+' d-inline-block float-right position-absolute font-size-md" style="right:8px;bottom:50px;font-size:20px" data-toggle="tooltip" data-placement="top" data-original-title="Date-specific"><i class="lnr-calendar-full float-right" style="color:#333"></i></span>';
										}
									}else{
										if(userRoleId==3){
											htmlCal=htmlCal+'<span href="javascript:void(0);" id="slotSelectDate'+dates.day1+'"  class="'+holidayClass+' d-inline-block float-right position-absolute font-size-md" style="right:8px;bottom:50px;font-size:20px" data-toggle="tooltip" data-placement="top" data-original-title="Weekly"><i class="lnr lnr-sync float-right" style="color:#333"></i></span>';
										}
									}
								//}
							}
							if(viewcount>3){
								htmlCal=htmlCal+'<a href="javascript:void(0)" onclick="viewMore(this)" class="position-absolute" style="right:8px;bottom:20px;font-size:20px"><i class="fa fa-angle-down ml-1 mt-1"></i></a></td>';
							}
						}
						
						htmlCal=htmlCal+'</div>';
				}else{
					if(dates.isClick == 1 && dates.timeCategory=='availability'){
						htmlCal=htmlCal+'<a href="javascript:void(0);" id="slotSelectDate'+dates.day1+'"  onclick="'+onSclick+'"  class="'+holidayClass+' d-inline-block">'+dates.day1+'</a>';	
					}else{
						htmlCal=htmlCal+dates.day1;
					}
					htmlCal=htmlCal+'<div class="full btnEditDate pr-3"  id="btnEditDate'+dates.day1+'"><a href="javascript:void(0)" onclick="'+onCalclick+'" class="mb-1 full btn btn-sm btn-outline-dark d-inline-block "><i class="lnr-calendar-full mr-1"></i>Edit <b>date(s)</b></a></div>';
					htmlCal=htmlCal+'<div class="full btnEditWeek pr-3"  id="btnEditWeek'+dates.day1+'"><a href="javascript:void(0)" onclick="'+onWeeekSclick+'" class="mb-1 full btn btn-sm btn-outline-dark d-inline-block "><i class="lnr lnr-frame-expand mr-1"></i>Edit <b>all '+dates.weekDayName+'</b></a></div>';
				}
				// if(viewcount>3){
				// 	htmlCal=htmlCal+'<a href="javascript:void(0)" onclick="viewMore(this)" class="position-absolute" style="right:20px;bottom:20px;font-size:20px"><i class="fa fa-angle-down ml-1 mt-1"></i></a></td>';
				// }
				htmlCal=htmlCal+'</td>'
				// }
				// if(dates.isClick==0){
					//htmlCal=htmlCal+'<td class="td-bg-gray '+holidayClass+'">'+dates.day1+'<i class="lnr-sync float-right"></i><div class="full text-center font-weight-semi-bold" style="color:#9f9c9c"></div></td>';
				//}
			startDate=startDate+1;
		}
		if(startDate>7){
			startDate=1;
			htmlCal=htmlCal+'</tr>';
		}
	}
	htmlCal=htmlCal+'</tr>';
	htmlCal=htmlCal+'</tbody>  ';                
	htmlCal=htmlCal+'</table>';
	// if(slotDisplyType=='booked'){
	// 	$('.totalOccupied').html(getTimeWithFormat(grandTotalDuration));
	// }else if(slotDisplyType=='availability'){
	// 	$('.totalAvailabilityGiven').html(getTimeWithFormat(grandTotalDuration));
	// }else if(slotDisplyType=='available'){
	// 	$('.totalUnoccupied').html(getTimeWithFormat(grandTotalDuration));
	// }
		$('.totalOccupied').html(getTimeFormat(data.bookedHoursTotal));
		$('.totalAvailabilityGiven').html(getTimeFormat(data.toatlAvailableHours));
		$('.totalUnoccupied').html(getTimeFormat(data.remainingHoursTotal));

		$('.GROUP_CLASS').html(getTimeFormat(data.bookedGroupHoursTotal));
		$('.STUDENT_DOUBT_SESSION').html(getTimeFormat(data.bookedOneToOneHoursTotal));
		$('.ACTIVITY_CLASS').html(getTimeFormat(data.bookedActivityHoursTotal));

	return htmlCal;
}


function getBookMeetingDetail(bookdata){
	var htmlCal='';
	htmlCal=htmlCal+'<div class="widget-chart text-left card-top-border card-shadow-primary border-'+bookdata.meetingColor+' card w-100" style="min-width:400px">';
	htmlCal=htmlCal+'<ul class="p-0 m-0 w-100">';
	htmlCal=htmlCal+'<li class="d-flex flex-wrap">';
	htmlCal=htmlCal+'<label class="m-0 font-weight-bold mr-1">Event Name:</label>';
	htmlCal=htmlCal+'<span>'+bookdata.meetingType+'</span>';
	htmlCal=htmlCal+'</li>';
	htmlCal=htmlCal+'<li class="d-flex flex-wrap">';
	htmlCal=htmlCal+'<label class="m-0 font-weight-bold mr-1">Invitee Name:</label>';
	htmlCal=htmlCal+'<span>'+bookdata.meetingAttandeePerson+'</span>';
	htmlCal=htmlCal+'</li>';
	htmlCal=htmlCal+'<li class="d-flex flex-wrap">';
	htmlCal=htmlCal+'<label class="m-0 font-weight-bold mr-1">Event Duration:</label>';
	htmlCal=htmlCal+'<span>'+bookdata.eventDuration+'</span>';
	htmlCal=htmlCal+'</li>';
	htmlCal=htmlCal+'<li class="d-flex flex-wrap">';
	htmlCal=htmlCal+'<label class="m-0 font-weight-bold mr-1">Slot Buffer Time:</label>';
	htmlCal=htmlCal+'<span>'+bookdata.bufferTime+'</span>';
	htmlCal=htmlCal+'</li>';
	htmlCal=htmlCal+'<li class="d-flex flex-wrap">';
	htmlCal=htmlCal+'<label class="m-0 font-weight-bold mr-1">Status:</label>';
	htmlCal=htmlCal+'<span>'+bookdata.meetingStatus+'</span>';
	htmlCal=htmlCal+'</li>';
	htmlCal=htmlCal+'<li class="d-flex flex-wrap">';
	htmlCal=htmlCal+'<label class="m-0 font-weight-bold mr-1">Invitee Date and Time Zone:</label>';
	htmlCal=htmlCal+'<span>'+bookdata.studentDateTime+' '+bookdata.meetingAttendeeTimezone+'</span>';
	htmlCal=htmlCal+'</li>';
	htmlCal=htmlCal+'</ul>';
	htmlCal=htmlCal+'</div>';
	return htmlCal;
}

function viewMore(src){
	var display = $(src).parent().find(".time-row").css("display");
	if(display== "none"){
		$(src).parent().find(".time-row").show();
		$(src).html("<i class='fa fa-angle-up'></i>");
	}else{
		$(src).parent().find(".time-row").hide();
		$(src).html("<i class='fa fa-angle-down'></i>");
	}
	
}
function openCalendarMenuBtn(src, btnId){
	$(".btnEditDate").hide();
	$(".btnEditWeek").hide();
	$("#btnEditDate"+btnId+"").show();
	$("#btnEditWeek"+btnId+"").show();
	$(src).parent().find(".show-view-more").animate({ scrollTop: 0 }, "slow");
	// $(src).parent().find(".show-view-more").each(function() {
	// 	var $this = $(this);
	// 	if ($this[0].scrollHeight > $this.innerHeight()) {
	// 		$this.css('overflow', 'auto'); // Optional: Set overflow to auto
	// 	}
	// });
}
function openCalendarPopup(formId, userId, slotDate, timeselect, prestartTime, preendTime, userRoleId, min, max, slotBufferLimit, slotDateLimit,  slotDayLimit){
	$("#timeAvailabilityPopup").modal('show');
	$("#inActDate").val('')
	$("#weekCount").val("");
	$("#weekDayName").val("");
	if(userRoleId!=3){
		$("#timeAvailabilitySave").removeClass('d-none');
	}
	getCalendarDateAvailability(formId, userId, "timeCalendarPopup",slotDate,timeselect,"Month", true, ""+prestartTime+"", ""+preendTime+"",'open-edit-date',0,'daytime', userRoleId, min, max, slotBufferLimit, slotDateLimit,  slotDayLimit);
}

function openCalendarWeekPopup(formId, userId, dayName, slotDate, timeselect, dayweekcount, prestartTime, preendTime, userRoleId, min, max, slotBufferLimit, slotDateLimit,  slotDayLimit){
	$("#timeAvailabilityPopup").modal('show');
	$("#inActDate").val('')
	$("#weekCount").val(""+dayweekcount+"");
	$("#weekDayName").val(""+dayName+"");
	if(userRoleId!=3){
		$("#timeAvailabilitySave").removeClass('d-none');
	}
	getCalendarDateAvailability(formId, userId, "timeCalendarPopup",slotDate,timeselect,"Month", false, ""+prestartTime+"", ""+preendTime+"",'open-edit-week-date',0,'daytime', userRoleId, min, max, slotBufferLimit, slotDateLimit,  slotDayLimit);
}

function dateTimeValidation(classValidate){
		var overlapping = false;
		var validatMsg ="";
        var datetimeGroups = $('.'+classValidate+'');

		
        datetimeGroups.each(function(index, group) {
			var startTime = $(group).find('.fromTime').val();
			var endTime = $(group).find('.toTime').val();

			var fromT = "1970-12-31 "+startTime;
			var fromstamp = Date.parse(fromT);
			var from1 = new Date(fromstamp);

			var toT = "1970-12-31 "+endTime; // Example date string in the format YYYY-MM-DD
			var toStamp = Date.parse(toT);
			var to1 = new Date(toStamp);
			if (from1 > to1) {
				overlapping = true;
				validatMsg='Please make sure To datetime is greater than From datetime.';
				return false;
			}

            datetimeGroups.each(function(innerIndex, innerGroup) {
                if (index !== innerIndex) {
					var startTimeInner = $(innerGroup).find('.fromTime').val();
					var endTimeInner = $(innerGroup).find('.toTime').val();
					var fromT = "1970-12-31 "+startTimeInner;
					var fromstamp = Date.parse(fromT);
					var from2 = new Date(fromstamp);

					var toT = "1970-12-31 "+endTimeInner; // Example date string in the format YYYY-MM-DD
					var toStamp = Date.parse(toT);
					var to2 = new Date(toStamp);

                    if (from1 < to2 && to1 > from2) {
                        overlapping = true;
						validatMsg='Datetime ranges overlap.';
                        return false; // Break the loop
                    }
                }
            });

            if (overlapping) {
                return false; // Break the loop
            }
        });

        if (overlapping) {
			showMessageTheme2(0, validatMsg, '', true);
			return false;
        }

	return true;
}


function saveTimeCalendarAvailability(callFrom, userId, modalID, prestartTime, preendTime, userRoleId, min, max, slotBufferLimit, slotDateLimit,  slotDayLimit) {
	hideMessageTheme2('');
	// if(!dateTimeValidation('calday-hours')){
	// 	return false;
	// }
	if(userRoleId!=3){
		var validStatus=validateTimes('calday-hours', 'fromTime', 'toTime', userRoleId, min, max,slotBufferLimit);
		if(validStatus){}else{
			return false;
		}
	}

	var startDate=$("#firstStartDate").val();
	
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLFor('timeavailability', 'save-time-availablity'),
		data: JSON.stringify(getRequestForTimeAvailability(callFrom, userId, modalID, prestartTime, preendTime, userRoleId)),
		dataType: 'json',
		cache: false,
		timeout: 600000,
		success: function (data) {
			//console.log(data);
			if (data['status'] == '0' || data['status'] == '2') {
				showMessageTheme2(0, data['message'], '', true);
			} else {
				showMessageTheme2(1, data['message'], '', true);
				$("#timeAvailabilityPopup").modal('hide')
				if(callFrom=='from-confirm'){

				}else{
					getCalendarAvailability('timeAvailabilityPopup',userId,"timeCalendar",""+startDate+"","Month", prestartTime, preendTime, userRoleId, min, max, slotBufferLimit, slotDateLimit,  slotDayLimit);
				}
				getUserAvailability('user-time-available',userId,'', prestartTime, preendTime, userRoleId);
				saveAvailabilityOfActiveEvents('CALL-CALENDAR','ALL', userRoleId);
			}
			return false;
		},
		error: function (e) {
			//showMessage(true, e.responseText);
			return false;
		}
	});
}

function getRequestForTimeAvailability(callFrom,  userId,  modalID, prestartTime, preendTime, userRoleId){
	var timeAvailabilityRequest = {};
	var timeSlotAvailability = [];
	
	timeAvailabilityRequest['callfrom'] = callFrom;
	timeAvailabilityRequest['userId'] = userId;
	timeAvailabilityRequest['schoolId']= SCHOOL_ID;
	timeAvailabilityRequest['slotAddUserId']=USER_ID;
	timeAvailabilityRequest['userRole'] = (userRoleId==3?'TEACHER':'ADMIN');
	var selectDate = $("#inActDate").val();
	timeAvailabilityRequest['selectDate']=selectDate;
	timeAvailabilityRequest['slotType']='';
	if(userRoleId!=3){
		if($('.calday-hours').text()=='Unavailable'){
			timeAvailabilityRequest['controlType']='edit-unavailable';
			var teacherTime={};
			let startTime = prestartTime;
			let endTime = preendTime;
			if(startTime!=undefined &&  startTime!=null && startTime!='' && endTime !=undefined && endTime !=null && endTime !=''){
				teacherTime['startTime']=startTime;
				teacherTime['endTime']=endTime;
				timeSlotAvailability.push(teacherTime);
			}
		}else{
			$('.calday-hours').each(function() { 
				var teacherTime={};
				var startTime = $(this).find('.fromTime').val();
				var endTime = $(this).find('.toTime').val();
				if(startTime!=undefined &&  startTime!=null && startTime!='' && endTime !=undefined && endTime !=null && endTime !=''){
					teacherTime['startTime']=startTime;
					teacherTime['endTime']=endTime;
					timeSlotAvailability.push(teacherTime);
				}
			});
			timeAvailabilityRequest['controlType']='add';
		}
	}else{
		$('.specific-time-add').each(function() { 
			var teacherTime={};
			var seldate = $(this).attr('data-select-date');
			var startTime = $(this).attr('data-starttime');
			var endTime = $(this).attr('data-endtime');
			var dateType = $(this).attr('data-controltype');
			if(dateType=='edit-unavailable'){
				timeAvailabilityRequest['controlType']='edit-unavailable';
				timeAvailabilityRequest['selectDate']=seldate;
				teacherTime['startTime']=startTime;
				teacherTime['endTime']=endTime;
				teacherTime['selectDate']=seldate;
				teacherTime['dateType']=dateType;
				timeSlotAvailability.push(teacherTime);
			}else{
				if(startTime!=undefined &&  startTime!=null && startTime!='' && endTime !=undefined && endTime !=null && endTime !=''){
					teacherTime['startTime']=startTime;
					teacherTime['endTime']=endTime;
					teacherTime['selectDate']=seldate;
					teacherTime['dateType']=dateType;
					timeSlotAvailability.push(teacherTime);
				}
			}
		});
	}
	
	//$("#"+modalID+" #controlType").val();
	//return false;
	timeAvailabilityRequest['timeSlotAvailability']=timeSlotAvailability;
	
	console.log(timeAvailabilityRequest);
	//return false;
	return timeAvailabilityRequest;
}

function getUserAvailability(elementId, userId, slotType, prestartTime, preendTime, userRoleId) {
    customLoader(true);
	var request = { userId: userId, slotType: slotType };
	$.ajax({
		type: "POST",
		url: getURLFor('timeavailability', 'get-user-availability'),
		contentType: "application/json",
		data: JSON.stringify(request),
		dataType: 'json',
		cache: false,
		async: true,
		timeout: 600000,
		success: function (data) {
                //console.log(data);
				if (data['status'] == '0' || data['status'] == '2') {
                    showMessage(true, data['message']);
                } else {
					$("."+elementId).html('');
                   	var htmlss = getUserAvailabilityHtml(data, userId, prestartTime, preendTime,userRoleId);
				  	$("."+elementId).html(htmlss);
					$("#btnTimeCalendar").on("click",function(){
						$(".timeAvailabilityConfirmationAction").removeClass("show");
						$(".tooltip.show").remove();
						$("#timeAvailabilityPopup .timesection").hide();
						$("#timeAvailabilityPopup #inActDate").val('')
						$("#timeAvailabilityPopup #weekCount").val("");
						$("#timeAvailabilityPopup #weekDayName").val("");
						$("#timeAvailabilityPopup #refreshWeekBtn").addClass("d-none");
						$("#timeAvailabilityPopup").modal('show');

						var slotMin=$("#slotMin").val()
						var slotMax=$("#slotMax").val()
						var slotBufferLimit=$("#slotBufferTime").val()
						var slotDateLimit=$("#slotDateLimit").val()
						var slotDayLimit=$("#slotMax").val()

						getCalendarDateAvailability('timeAvailabilityPopup', ""+userId+"","timeCalendarPopup","","","Month",true,""+prestartTime+"",""+preendTime+"",'add-specify-date','0','daytime', ""+userRoleId+"", ""+slotMin+"", ""+slotMax+"", ""+slotBufferLimit+"", ""+slotDateLimit+"", ""+slotDayLimit+"");

						
					});
					$('[data-toggle="tooltip"]').tooltip();
					
                }
				return false;
		},
		error: function (e) {
			//showMessage(true, e.responseText);
			return false;
		}
	});
}

function getUserAvailabilityHtml(data, userId, prestartTime, preendTime,userRoleId){
	
	var hideSpecificBtn=$("#btnSpecificHide").val();
	var timeAvailableList = data.timeAvailable;
	var specific_tr = $(".specific_tr").length;
	var htmlCal = "";
	if(specific_tr==0){
		htmlCal = htmlCal="<table class=\"table\">";
		htmlCal=htmlCal+'<thead>';
		htmlCal=htmlCal+'<tr>'; 
			htmlCal=htmlCal+'<th>Specific Date</th>';
			if(userRoleId==3){
				htmlCal=htmlCal+'<th>Live Classes Slot</th>';
			}else{
				htmlCal=htmlCal+'<th>&nbsp;</th>';
			}
			htmlCal=htmlCal+'<th width="215px">';
			if(hideSpecificBtn=='N'){
				htmlCal=htmlCal+'<button class="my-1 mr-2 btn-icon btn btn-outline-primary p-1" id="btnTimeCalendar" data-toggle="tooltip" data-placement="top" title="Override your availability for specific dates when your hours differ from your regular weekly hours."><i class="pe-7s-plus btn-icon-wrapper"> </i>Add date-specific hours</button>';
			}
			htmlCal=htmlCal+'</th>';
		htmlCal=htmlCal+'</tr>'; 
		htmlCal=htmlCal+'</thead>'; 
		htmlCal=htmlCal+'<tbody class="tbody-user-time">';  
	} 
	if(timeAvailableList!=null && timeAvailableList.length>0){
		for (let i = 0; i < timeAvailableList.length; i++) {
			var rownum=i+specific_tr;
			var userdates = timeAvailableList[i];
			var userTimeav=userdates.teacherPreferTime;
			htmlCal=htmlCal+'<tr class="specific_tr specific_tr_date_'+(userdates.strSelectDate.toString().replaceAll('-',''))+''+(userdates.dataType!='Y'? 'new-add-availibality-row':'')+'" id="specific_tr_'+rownum+'" >'; 
			htmlCal=htmlCal+'<td>'+userdates.selectDate+'</td>'; 
			htmlCal=htmlCal+'<td id="specific_td_'+rownum+'">';
			var onFuncDate ="removeTimePrefRence('specific_tr_"+rownum+"', '"+userdates.selectDate+"', '"+userId+"','Y','"+prestartTime+"','"+preendTime+"','"+userRoleId+"')";
			var specifictimeClass="";
			if(userdates.dataType!='Y'){
				specifictimeClass="specific-time-add text-danger";
			}
			if(userdates.dayTimeType=="Unavailable"){
				htmlCal=htmlCal+'<span class="'+specifictimeClass+'" id="specific_tr_'+rownum+'_0" data-timeid="0" data-select-date="'+userdates.strSelectDate+'" data-controlType="edit-unavailable" data-starttime="'+prestartTime+'" data-endtime="'+preendTime+'">Unavailable</span>';
			}else{
				if(userTimeav!=null){
					for (let ut = 0; ut < userTimeav.length; ut++) {
						utime = userTimeav[ut];
						
						var onFunc ="removeTimePrefRence('specific_tr_"+rownum+"_"+ut+"', '"+utime.timeid+"','"+userId+"','N','"+prestartTime+"','"+preendTime+"','"+userRoleId+"')";
						htmlCal=htmlCal+'<span class="d-inline-block '+specifictimeClass+' specific_tr_'+rownum+'_'+ut+'" style="min-width:135px" data-timeid="'+utime.timeid+'"  data-select-date="'+userdates.strSelectDate+'" data-controlType="add" data-starttime="'+(utime.startTime.split(" - ")[0])+'" data-endtime="'+(utime.startTime.split(" - ")[1])+'">'+utime.startTime+'</span>';
						if(userdates.dataType!='Y' && USER_ROLE_ID==3){
							
							// onFunc ="removeTimePrefRence('specific_tr_"+rownum+"_"+ut+"', '0','"+userId+"','N','"+prestartTime+"','"+preendTime+"','"+userRoleId+"')";
							// htmlCal=htmlCal+'<span class="d-inline-block ml-2 mb-1 remove specific_tr_'+rownum+'_'+ut+'">';
							// htmlCal=htmlCal+'<a href="javascript:void(0);" class="click-to-catalog btn btn-sm btn-outline-danger" onclick="'+onFunc+'"><i class="ion-android-close"></i></a>';
							// htmlCal=htmlCal+'</span>';
						}else{
							if(utime.timetype=='remove-hide'){

							}else{
								if(USER_ROLE_ID!=3){
									if(userdates.dateValid=='Y'){
										htmlCal=htmlCal+'<span class="d-inline-block ml-1 mb-1 remove specific_tr_'+rownum+'_'+ut+'">';
										htmlCal=htmlCal+'<a href="javascript:void(0);" class="click-to-catalog btn btn-sm btn-outline-danger" onclick="'+onFunc+'"><i class="ion-android-close"></i></a>';
										htmlCal=htmlCal+'</span>';
									}
								}
							}
						}
						htmlCal=htmlCal+'<br/>';
						// if(ut == (userTimeav.length - 1) && userTimeav.length > 1){
						// 	htmlCal=htmlCal+'<a href="javascript:void(0);" class="click-to-catalog btn btn-sm btn-danger" onclick="'+onFuncDate+'"><i class="fa fa-trash mr-2"></i>Remove all</a>';
						// }
					}
				}
			}

			htmlCal=htmlCal+'</td>';  
			if(userdates.dayTimeType=="Unavailable"){
				htmlCal=htmlCal+'<td></td>';
			}else{
				htmlCal=htmlCal+'<td class="'+(userdates.dataType!='Y'? 'new-add-availibality-time-td':'')+'">'+userdates.totalTimeHrsMins+'</td>';
			}

			if(userRoleId!=3){
				htmlCal=htmlCal+'<td><a href="javascript:void(0);" class="click-to-catalog btn btn-sm" style="font-size:24px !important" onclick="'+onFuncDate+'"><i class="lnr lnr-cross"></i></a></td>';   
			}else{
				// if(userdates.dataType!='Y' && USER_ROLE_ID==3){
				// 	onFuncDate ="removeTimePrefRence('specific_tr_"+rownum+"', '"+userdates.selectDate+"', '"+userId+"','Y','"+prestartTime+"','"+preendTime+"','"+userRoleId+"')";
				// 	htmlCal=htmlCal+'<td><a href="javascript:void(0);" class="click-to-catalog btn btn-sm" style="font-size:24px !important" onclick="'+onFuncDate+'"><i class="lnr lnr-cross"></i></a></td>';   
				// }else{
				// 	if(USER_ROLE_ID!=3){
				// 		if(userdates.dateValid=='Y'){
				// 			htmlCal=htmlCal+'<td><a href="javascript:void(0);" class="click-to-catalog btn btn-sm" style="font-size:24px !important" onclick="'+onFuncDate+'"><i class="lnr lnr-cross"></i></a></td>';   
				// 		}
				// 	}
				// }
			}
			
			htmlCal=htmlCal+'<td>&nbsp;</td>'
			htmlCal=htmlCal+'</tr>';
			excludeDates.push(new Date(userdates.selectDate).toDateString()) 
			// $.each(data.timeAvailable, function(i, v){
			// });
			
		}
				
	}
	if(specific_tr==0){
		htmlCal=htmlCal+'</tbody>  ';  
		htmlCal = htmlCal+"</table>";
		if(userRoleId == 3){
			if($(".totalAvailabilityLabel .totalAvailabilityGiven").text() != '--' && $(".totalAvailabilityLabel .totalAvailabilityGiven").text() != ''){
				takedHoursInMinutes = parseInt($(".totalAvailabilityLabel .totalAvailabilityGiven").text().split(" ")[0].split("h")[0])*60 + parseInt($(".totalAvailabilityLabel .totalAvailabilityGiven").text().split(" ")[1].split("m")[0]);
			}else{
				takedHoursInMinutes = 0;
			}
			// takedHoursInMinutes = parseInt($(".totalAvailabilityLabel .totalAvailabilityGiven").text().split(" ")[0].split("h")[0])*60 + parseInt($(".totalAvailabilityLabel .totalAvailabilityGiven").text().split(" ")[1].split("m")[0]);
			
			if(takedHoursInMinutes == 0){
				dayCounts = countDaysFromCurrentDate(getDayYear, getDayMonth, 1);
			}else{
				dayCounts = countDaysFromCurrentDate(getDayYear, getDayMonth, getDayDate);
			}
		}
		return htmlCal;
	}else{
		$(".tbody-user-time").append(htmlCal);
		if(userRoleId == 3){
			takedHoursInMinutes = parseInt($(".totalAvailabilityLabel .totalAvailabilityGiven").text().split(" ")[0].split("h")[0])*60 + parseInt($(".totalAvailabilityLabel .totalAvailabilityGiven").text().split(" ")[1].split("m")[0]);
			if(takedHoursInMinutes == 0){
				dayCounts = countDaysFromCurrentDate(getDayYear, getDayMonth, 1);
			}else{
				dayCounts = countDaysFromCurrentDate(getDayYear, getDayMonth, getDayDate);
			}
		}
		
	}
	
}


function saveTimeCalendarWeekWise(userId,dayid,timeSlotAvailability, controlType, callTime, prestartTime, preendTime, userRoleId, min, max, slotBufferLimit, slotDateLimit,  slotDayLimit) {
	

	customLoader(true);
	hideMessageTheme2('');
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLFor('timeavailability', 'save-availablity-weekwise'),
		data: JSON.stringify(getRequestForTimeCalendarWeekWise(userId,dayid,timeSlotAvailability, prestartTime, preendTime,callTime, controlType, userRoleId, min, max, slotBufferLimit)),
		dataType: 'json',
		cache: false,
		timeout: 600000,
		success: function (data) {
			//console.log(data);
			if (data['status'] == '0' || data['status'] == '2') {
				showMessageTheme2(0, data['message'], '', true);
			} else {
				//$("#timeAvailabilityPopup").modal('hide')
				if(callTime=='first'){}
				else{
					showMessageTheme2(1, data['message'], '', true);
					$(".timeAvailabilityConfirmationAction").removeClass("show");
					if(callTime=='edit-all-week'){
						getCalendarAvailability('timeAvailabilityPopup',userId,"timeCalendar","","Month", prestartTime, preendTime, userRoleId, min, max, slotBufferLimit, slotDateLimit,  slotDayLimit);
						getUserAvailability('user-time-available',userId,'', prestartTime, preendTime, userRoleId);
						$("#timeAvailabilityPopup").modal('hide');
					}else{
						getUserWeeklyAvailability('week-time-available',userId,'',prestartTime, preendTime,0,0, userRoleId, min, max,'', slotBufferLimit, slotDateLimit,  slotDayLimit);
					}
					saveAvailabilityOfActiveEvents('CALL-CALENDAR-WEEK','ALL', userRoleId);
					if ($('.timesection .fromTime').data('select2')) {
						$(".timesection .fromTime").select2("destroy");
					}
					if ($('.timesection .toTime').data('select2')) {
						$(".timesection .toTime").select2("destroy");
					}
					$(".timesection .fromTime").select2({
						theme:"bootstrap4",
						closeOnSelect:true,
						dropdownParent:"#timeAvailabilityPopup .timesection"
					});
					$(".timesection .toTime").select2({
						theme:"bootstrap4",
						closeOnSelect:true,
						dropdownParent:"#timeAvailabilityPopup .timesection"
					});
					var dayOptions = [];
					$( '.dropdown-menu .copy-times' ).on( 'click', function( ) {
						return false;
					});
					$( '.dropdown-menu label.day-type-label').on( 'click', function( event ) {
						var $disable = $(event.currentTarget),
							$isDisable = $disable.attr('for');
							if($("#"+$isDisable).prop("disabled")){
								return false;
							}
						$( '.day-list').each(function() {
							if($(this).is(":checked")){
								dayOptions.push($(this).val());
							}
						});
						var $target = $(event.currentTarget),
							val = $target.attr( 'data-value' ),
							dayNo=val.split("-"),
							dayNo=parseInt(dayNo[1]),
							$inp = $target.parent().find('input'),
							idx;
							// if($inp.is(':checked')){
							// 	dayOptions.push(val);
							// }
						if((idx = dayOptions.indexOf(val)) > -1) {
							dayOptions.splice( idx, 1 );
							setTimeout( function() {$inp.prop('checked', false)}, 0);
						}else {
							dayOptions.push(val);
							setTimeout( function() {$inp.prop('checked', true)}, 0);
						}
						$(event.target ).blur();
						// dayOptions=[];
						
						console.log( dayOptions );
						//$(".eventTotal").text(dayOptions.length);
						return false;
					});
				}
			}
			customLoader(false);
			return false;
		},
		error: function (e) {
			//showMessage(true, e.responseText);
			customLoader(false);
			return false;
		}
	});
}

function getRequestForTimeCalendarWeekWise(userId, dayid, timeSlotAvailability1,prestartTime, preendTime,callTime, controlType, userRoleId, min, max, slotBufferLimit){
	var timeAvailabilityRequest = {};
	var timeSlotAvailability = [];
	timeAvailabilityRequest['userId'] = userId;
	timeAvailabilityRequest['slotAddUserId']=USER_ID;
	timeAvailabilityRequest['slotType']=callTime;
	timeAvailabilityRequest['dayid']=dayid;
	timeAvailabilityRequest['userRoleId']=userRoleId;

	if(timeSlotAvailability1.length>0){
		timeSlotAvailability=timeSlotAvailability1;
	}else{
		$('.week-slot-available').each(function() { 
			var dayNameval = $(this).attr("data-dayname");
			var days=$(this).val();
			if ($(this).is(":checked")) {
				timeAvailabilityRequest['dayid']=days;
				var validStatus=validateTimes(dayNameval, 'fromTime', 'toTime', userRoleId, min, max,slotBufferLimit);
				if(validStatus){
					$('.'+dayNameval).not('.d-none').each(function() { 
						var teacherTime={};
						var startTime = $(this).find('.fromTime').val();
						var endTime = $(this).find('.toTime').val();
						var dayCheck='Y';
						if(startTime==undefined){
							startTime=prestartTime;
							endTime=preendTime;
							dayCheck='N';
						}
						if(startTime!=undefined &&  startTime!=null && startTime!='' && endTime !=undefined && endTime !=null && endTime !=''){
							teacherTime['dayid']=days;
							teacherTime['startTime']=startTime;
							teacherTime['endTime']=endTime;
							teacherTime['dayCheck']=dayCheck;
							timeSlotAvailability.push(teacherTime);
						}
					});
				}
				if(!validatToSaveFlag){
					showMessageTheme2(1, validatToSaveMsg, '', true);
					return false;
				}
			}else{
				// if(userRoleId==3){
					
				// }else{
					timeAvailabilityRequest['dayid']=days;
					$('.'+dayNameval).each(function() { 
						var teacherTime={};
						var startTime = $(this).attr('data-starttime');
						var endTime = $(this).attr('data-endTime');
						if(startTime==undefined){
							startTime=prestartTime;
							endTime=preendTime;
						}
						if(startTime!=undefined &&  startTime!=null && startTime!='' && endTime !=undefined && endTime !=null && endTime !=''){
							teacherTime['dayid']=days;
							teacherTime['startTime']=startTime;
							teacherTime['endTime']=endTime;
							teacherTime['dayCheck']='N';
							timeSlotAvailability.push(teacherTime);
						}
					});
				//}
			}
		});
	}
	
	timeAvailabilityRequest['controlType']=controlType;//$("#"+modalID+" #controlType").val();
	//return false;
	timeAvailabilityRequest['timeSlotAvailability']=timeSlotAvailability;
	console.log(timeAvailabilityRequest);
	//return false;
	return timeAvailabilityRequest;
}


function getUserWeeklyAvailability(elementId, userId, slotType, prestartTime, preendTime, dayId, slotTypeId, userRoleId, min, max, callTime, slotBufferLimit, slotDateLimit,  slotDayLimit) {
	customLoader(true);
	var request = { userId: userId, lUserId:USER_ID, slotType: slotType, dayId:dayId, slotTypeId:slotTypeId };
	$.ajax({
		type: "POST",
		url: getURLFor('timeavailability', 'get-user-week-availability'),
		contentType: "application/json",
		data: JSON.stringify(request),
		dataType: 'json',
		cache: false,
		async: true,
		timeout: 600000,
		success: function (data) {
				//console.log(data);
				if (data['status'] == '0' || data['status'] == '2') {
                    showMessage(true, data['message']);
                } else {
					var timeDropdown =data.timeAvailabilityList;
					var timeDropdownlimit=timeDropdown;
					if(USER_ROLE_ID == 3){
						timeDropdownlimit=getTimeLastValue(min,timeDropdown);
					}
					if(dayId==0){
						
						$("."+elementId).html('');
						   getWeekDaysAvailabilityHtml(userId, data, elementId,prestartTime, preendTime, slotTypeId, userRoleId, min, max, callTime, slotBufferLimit, slotDateLimit,  slotDayLimit, data.timeAvailabilityList);
					}
					else{
						var dataDayList = data.weekDaysAvailabilityList;
						if(dataDayList.length>0){
							for (let d = 0; d < dataDayList.length; d++) {
								htmlw="";
								const days = dataDayList[d];
								var userTimeAvailable = days.timeSlotAvailability;
								var drophtml = bindTimeAvailableDropdown(userTimeAvailable, timeDropdownlimit, days, prestartTime, preendTime, userRoleId, min, max, callTime, slotBufferLimit, slotDateLimit,  slotDayLimit, timeDropdown);
								$("."+elementId).html(drophtml);
								// if($("."+elementId+" .endTimeDropDown"+dayId+" option:last-child") == "11:59 PM"){
								// 	$("."+elementId+" .endTimeDropDown"+dayId+"").append('<option value="11:59 PM">11:59 PM</option>');
								// }
								// var startselectedOptionIndex = $("."+elementId+" .startTimeDropDown"+dayId+" option:selected").index()+4;
								// $("."+elementId+" .endTimeDropDown"+dayId+" option").each(function(i){
								// 	if(i == 0){i= i+1}
								// 	if(startselectedOptionIndex > i){
								// 		$("."+elementId+" .endTimeDropDown"+dayId+" option:nth-child(1)").remove();
								// 	}
								// });
								// $("."+elementId+" .endTimeDropDown"+dayId+" option:selected").nextAll().remove();
								var totalDuration=0;
								if(callTime=='day-check'){
									$("."+days.dayName+'-'+days.dayId).each(function() { 
										var teacherTime={};
										var startTime = $(this).find('.fromTime').val();
										var endTime = $(this).find('.toTime').val();
										if(startTime!=undefined &&  startTime!=null && startTime!='' && endTime !=undefined && endTime !=null && endTime !=''){
											diff = getTimeDifference(startTime, endTime);
											totalDuration += diff.asMilliseconds();
										}
									});
									$(".total-minutes-"+days.dayId).text(getTimeWithFormat(totalDuration));
								}
							}
						}	
					}
					if(slotTypeId>0){
						getEventWiseWeekHours(data.weekDaysAvailabilityList)
					}
					$(".week-time-available .fromTime").select2({
						theme:"bootstrap4",
					});
					
					$(".week-time-available .toTime").select2({
						theme:"bootstrap4",
					});
                }
				return false;
		},
		error: function (e) {
			//showMessage(true, e.responseText);
			return false;
		}
	});
}

function getEventWiseWeekHours(data){
	var html='';
	html=html+'<table class="table">';
	html=html+'<tbody>';
	if(data!=null && data.length>0){
		for (let ind = 0; ind < data.length; ind++) {
			const eleWeek = data[ind];
			var timeSlot = eleWeek.timeSlotAvailability;
			html=html+'<tr><th width="50">'+eleWeek.dayName+'</th><td>';
			if(timeSlot!=null && timeSlot.length>0){
				var jk=0;
				for (let inds = 0; inds < timeSlot.length; inds++) {
					const timeWeek = timeSlot[inds];
					if(timeWeek.dayCheck=='N'){
						if(jk==0){
							html=html+'<span style="color:#9f9c9c">Unavailable</span>';
							jk=jk+1;
						}
					}else{
						html=html+'<span>'+timeWeek.startTime+' - '+timeWeek.endTime+'</span><br/>';
					}
				}
			}
			html=html+'</td></tr>';
			//html=html+'<tr><th width="50">Mon</th><td>9:00am - 5pm</td></tr>';
		}
	}else{
		html=html+'<tr><th colspan="2">No Availability</th></tr>';
	}
	html=html+'</tbody>'
	html=html+'</table>'
	// html=html+'<p class="ml-2"><i class="fa fa-globe mr-1"></i>Indian standard time</p>'

	$("#weeklyHours").html(html);
}



function getWeekDaysAvailabilityHtml(userId, data, elementId, prestartTime, preendTime, slotTypeId, userRoleId, min, max,callTime, slotBufferLimit, slotDateLimit,  slotDayLimit, endTimeDorpdownobj){
	console.log(userRoleId);
	//console.log(USER_ROLE_ID);
	var htmlw = "";
	var timeDropdown =data.timeAvailabilityList;
	var dataDayList = data.weekDaysAvailabilityList;
	if(dataDayList.length>0){
		for (let d = 0; d < dataDayList.length; d++) {
			htmlw="";
			const days = dataDayList[d];
			var userTimeAvailable = days.timeSlotAvailability;
			
			htmlw=htmlw+'<li class="list-group-item px-0 p-md-2">';
			htmlw=htmlw+'<div class="widget-content p-0">';
				htmlw=htmlw+'<div class="widget-content-wrapper flex-wrap align-items-baseline">';
					htmlw=htmlw+'<div class="col-xl-2 col-lg-2 col-md-2 col-sm-12 col-12">';
					// htmlw=htmlw+'<h5 class="font-weight-semi-bold" style="font-size:14px">Weekday</h5>';
						htmlw=htmlw+'<div class="widget-content-left">';
							htmlw=htmlw+'<div class="custom-checkbox custom-control">';
								var funChange="getDaysCheckUncheck('day"+days.dayId+"','"+prestartTime+"','"+preendTime+"', '"+userRoleId+"', '"+min+"', '"+max+"', '"+slotBufferLimit+"', '"+slotDateLimit+"', '"+slotDayLimit+"');";
							
							if(userRoleId!=3){
								htmlw=htmlw+'<input type="checkbox" id="day'+days.dayId+'" value="'+days.dayId+'" data-name="'+days.dayName+'"  data-dayname="'+days.dayName+'-'+days.dayId+'" onChange="'+funChange+'"  class="custom-control-input week-slot-available">';
								htmlw=htmlw+'<label class="custom-control-label bold text-uppercase" for="day'+days.dayId+'">'+days.dayName+'</label>';
							}else{
								var disablclass="";
								if(USER_ROLE_ID==2){
									disablclass=""
								}else if(days.dataType=='Y' && userRoleId==3){
									disablclass="disabled";
								}
								htmlw=htmlw+'<input type="checkbox" id="day'+days.dayId+'" value="'+days.dayId+'" data-name="'+days.dayName+'"  data-dayname="'+days.dayName+'-'+days.dayId+'" onChange="'+funChange+'" '+disablclass+'  class="custom-control-input week-slot-available">';
								htmlw=htmlw+'<label class="custom-control-label bold text-uppercase" for="day'+days.dayId+'">'+days.dayName+'</label>';
							}
								
								htmlw=htmlw+'</div>';
						htmlw=htmlw+'</div>';
					htmlw=htmlw+'</div>';
					htmlw=htmlw+'<div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 cal-hours-'+days.dayId+'">';
									// htmlw=htmlw+'<h5 class="font-weight-semi-bold" style="font-size:14px">Live Classes Slot</h5>';
					htmlw=htmlw+'</div>';
					htmlw=htmlw+'<div class="col-xl-2 col-lg-2 col-md-2 col-sm-12 col-12">';
						// htmlw=htmlw+'<h5 class="font-weight-semi-bold" style="font-size:14px">Total Time</h5>';
					htmlw=htmlw+'<div class="total-minutes-'+days.dayId+'">'+days.totalTimeHrsMins+'</div>';
					htmlw=htmlw+'</div>';
					htmlw=htmlw+'<div class="col-xl-2 col-lg-2 col-md-2 col-sm-12 col-12 text-right mt-2 mt-sm-0 p-0">';
						// htmlw=htmlw+'<h5 class="font-weight-semi-bold" style="font-size:14px">Action</h5>';
						htmlw=htmlw+"<a href=\"javascript:void(0)\" class='btn btn-lg btn-outline-primary btn-sm mr-2 addWeekTimeBtn' onclick=\"addNewRowTime('"+days.dayName+"','"+days.dayId+"','"+prestartTime+"','"+preendTime+"','"+userRoleId+"', '"+min+"', '"+max+"','"+slotBufferLimit+"', '"+slotDateLimit+"', '"+slotDayLimit+"','' );\" style=\'line-height:0\'><i class=\"icon ion-android-add\" style=\"font-size:15px;line-height:13px\"></i><span class=\"d-md-none\">&nbsp; Add</span></a>";
						if(slotTypeId>0){}else{
							
							var ddclass="";
							if(days.dataType=='Y' && userRoleId==3){
								ddclass="d-none"
							}
							if(callTime=='first' && userRoleId==3){
								ddclass="d-none"
							}
							//ddclass="d-none";///change after discussion
							htmlw=htmlw+'<button class="btn btn-lg btn-outline-success btn-sm dropdown-toggle '+ddclass+'" id="copy-hours-'+days.dayId+'" data-bs-auto-close="outside" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fa fa-copy" style="font-size:18px;line-height:20px"></i><span class=\"d-md-none\">&nbsp; Clone</span></button>';
							//}
						
						}
							
						htmlw=htmlw+'<div class="dropdown-menu" style="max-width: 200px;">';
							htmlw=htmlw+'<div class="full px-2">';
							htmlw=htmlw+'<div class="full font-12 copy-times" style="color:#ccc">Copy times to..</div>';
								htmlw=htmlw+'<ul class="m-0 p-0 " id="apply-all-days-'+d+'">';
								var checkSun = (('Sun-'+days.dayId)==(days.dayName+'-'+days.dayId)?'checked disabled':'');
								var checkMon = (('Mon-'+days.dayId)==(days.dayName+'-'+days.dayId)?'checked disabled':'');
								var checkTue = (('Tue-'+days.dayId)==(days.dayName+'-'+days.dayId)?'checked disabled':'');
								var checkWed = (('Wed-'+days.dayId)==(days.dayName+'-'+days.dayId)?'checked disabled':'');
								var checkThu = (('Thu-'+days.dayId)==(days.dayName+'-'+days.dayId)?'checked disabled':'');
								var checkFri = (('Fri-'+days.dayId)==(days.dayName+'-'+days.dayId)?'checked disabled':'');
								var checkSat = (('Sat-'+days.dayId)==(days.dayName+'-'+days.dayId)?'checked disabled':'');
									htmlw=htmlw+'<li class="custom-checkbox custom-control p-0">';
										htmlw=htmlw+'<input type="checkbox" id="Sun-'+days.dayId+'" '+checkSun+' value="1" data-value="day'+d+'-1" class="custom-control-input day-list apply-all-days-'+days.dayId+'"/>';
										htmlw=htmlw+'<label for="Sun-'+days.dayId+'" class="py-2 full custom-control-label copy-time day-type-label font-weight-semi-bold" data-value="sun-'+days.dayId+'" >Sunday</label>';
									htmlw=htmlw+'</li>';
									htmlw=htmlw+'<li class="custom-checkbox custom-control p-0">';
										htmlw=htmlw+'<input type="checkbox" id="Mon-'+days.dayId+'" '+checkMon+'  value="2" data-value="day'+d+'-2" class="custom-control-input day-list apply-all-days-'+days.dayId+'"/>';
										htmlw=htmlw+'<label for="Mon-'+days.dayId+'" class="py-2 full custom-control-label copy-time day-type-label font-weight-semi-bold" data-value="mon-'+days.dayId+'" >Monday</label>';
									htmlw=htmlw+'</li>';
									htmlw=htmlw+'<li class="custom-checkbox custom-control p-0">';
										htmlw=htmlw+'<input type="checkbox" id="Tue-'+days.dayId+'" '+checkTue+'  value="3" data-value="day'+d+'-3" class="custom-control-input day-list apply-all-days-'+days.dayId+'"/>';
										htmlw=htmlw+'<label for="Tue-'+days.dayId+'" class="py-2 full custom-control-label copy-time day-type-label font-weight-semi-bold" data-value="tue-'+days.dayId+'" >Tuesday</label>';
									htmlw=htmlw+'</li>';
									htmlw=htmlw+'<li class="custom-checkbox custom-control p-0">';
										htmlw=htmlw+'<input type="checkbox" id="Wed-'+days.dayId+'" '+checkWed+' value="4" data-value="day'+d+'-4" class="custom-control-input day-list apply-all-days-'+days.dayId+'"/>';
										htmlw=htmlw+'<label for="Wed-'+days.dayId+'" class="py-2 full custom-control-label copy-time day-type-label font-weight-semi-bold" data-value="wed-'+days.dayId+'" >Wednesday</label>';
									htmlw=htmlw+'</li>';
									htmlw=htmlw+'<li class="custom-checkbox custom-control p-0">';
										htmlw=htmlw+'<input type="checkbox" id="Thu-'+days.dayId+'" '+checkThu+' value="5" data-value="day'+d+'-5" class="custom-control-input day-list apply-all-days-'+days.dayId+'"/>';
										htmlw=htmlw+'<label for="Thu-'+days.dayId+'" class="py-2 full custom-control-label copy-time day-type-label font-weight-semi-bold" data-value="thr-'+days.dayId+'" >Thursday</label>';
									htmlw=htmlw+'</li>';
									htmlw=htmlw+'<li class="custom-checkbox custom-control p-0">';
										htmlw=htmlw+'<input type="checkbox" id="Fri-'+days.dayId+'" '+checkFri+' value="6" data-value="day'+d+'-6" class="custom-control-input day-list apply-all-days-'+days.dayId+'"/>';
										htmlw=htmlw+'<label for="Fri-'+days.dayId+'" class="py-2 full custom-control-label copy-time day-type-label font-weight-semi-bold" data-value="fri-'+days.dayId+'" >Friday</label>';
									htmlw=htmlw+'</li>';
									htmlw=htmlw+'<li class="custom-checkbox custom-control p-0">';
										htmlw=htmlw+'<input type="checkbox" id="Sat-'+days.dayId+'" '+checkSat+' value="7" data-value="day'+d+'-7" class="custom-control-input day-list apply-all-days-'+days.dayId+'"/>';
										htmlw=htmlw+'<label for="Sat-'+days.dayId+'" class="py-2 full custom-control-label copy-time day-type-label font-weight-semi-bold" data-value="sat-'+days.dayId+'">Saturday</label>';
									htmlw=htmlw+'</li>';
								htmlw=htmlw+'</ul>';
							htmlw=htmlw+'</div>';
							var onclik = "applyAllDays('apply-all-days-"+days.dayId+"','"+(days.dayName+'-'+days.dayId)+"','"+prestartTime+"','"+preendTime+"','"+userRoleId+"','"+min+"','"+max+"','"+slotBufferLimit+"', '"+slotDateLimit+"', '"+slotDayLimit+"')";
							// var onclik = "appendCloneTime('apply-all-days-"+days.dayId+"','"+(days.dayName+'-'+days.dayId)+"','"+prestartTime+"','"+preendTime+"','"+userRoleId+"','"+min+"','"+max+"','"+slotBufferLimit+"', '"+slotDateLimit+"', '"+slotDayLimit+"')";
							htmlw=htmlw+'<div class="full px-3 mb-2 mt-2 text-center"><a href="javascript:void(0)" class="btn-pill full btn btn-primary px-3" onclick="'+onclik+'" >Apply</a></div>';
							htmlw=htmlw+'</div></div>';
					htmlw=htmlw+'</div>';
				htmlw=htmlw+'</div>';
			htmlw=htmlw+'</li>';

			$("."+elementId).append(htmlw);
			var drophtml = bindTimeAvailableDropdown(userTimeAvailable, timeDropdown, days, prestartTime, preendTime, userRoleId, min, max, callTime, slotBufferLimit, slotDateLimit,  slotDayLimit, endTimeDorpdownobj);
			$(".cal-hours-"+days.dayId).html(drophtml);
			if(userTimeAvailable==null){
				// $(".fromTime").val(prestartTime);
				// $(".toTime").val(preendTime);
				if($('#day'+days.dayId).is(":checked")){
					var validStatus=validateTimes(days.dayName+'-'+days.dayId, 'fromTime', 'toTime', userRoleId, min, max,slotBufferLimit);
					if(validStatus){
						timeSlotAvailability=[];
						$("."+days.dayName+'-'+days.dayId).each(function() { 
							var teacherTime={};
							var startTime = $(this).find('.fromTime').val();
							var endTime = $(this).find('.toTime').val();
							if(startTime!=undefined &&  startTime!=null && startTime!='' && endTime !=undefined && endTime !=null && endTime !=''){
								teacherTime['dayid']=days.dayId;
								teacherTime['startTime']=startTime;
								teacherTime['endTime']=endTime;
								teacherTime['dayCheck']='Y';
								timeSlotAvailability.push(teacherTime);
							}
						});
						//console.log("getWeekDaysavailableHtml");
						if(userRoleId!=3){
							saveTimeCalendarWeekWise(userId,days.dayId,timeSlotAvailability, 'add','new-time',prestartTime, preendTime, userRoleId, min, max, slotBufferLimit, slotDateLimit,  slotDayLimit);
						}
					}
				}
			}
		}
	copyListViewTimeDropdownFun()		
	}
}
function bindTimeAvailableDropdown(userTimeAvailable, timeDropdown, days, prestartTime, preendTime, userRoleId, min, max, callTime, slotBufferLimit, slotDateLimit,  slotDayLimit, endTimeObjt){
	//console.log(days);
	var htmlw = "";
	if(callTime=='day-check'){
		userTimeAvailable=null;
	}
	var totalsDuration;
	var startsTime;
	var endsTime;
	if(userTimeAvailable!=null && userTimeAvailable.length>0){
		for (let ttt = 0; ttt < userTimeAvailable.length; ttt++) {
			var userTimeA=userTimeAvailable[ttt];
			if(userTimeA.dayid==days.dayId){
				totalsDuration=0
				startsTime = userTimeA.startTime;
				endsTime = userTimeA.endTime;
				if(startsTime!=undefined &&  startsTime!=null && startsTime!='' && endsTime !=undefined && endsTime !=null && endsTime !=''){
					diff = getTimeDifference(startsTime, endsTime);
					totalsDuration += diff.asMilliseconds();
				}


				var disable="";
				//&& USER_ROLE_ID==3
				if(userTimeA.dataType=='Y' && userRoleId==3 ){
					disable="disabled";
				}
				if(userTimeA.dayCheck=='N'){
					$("#day"+days.dayId).prop( "checked", false );
					$(".total-minutes-"+days.dayId).text("0h 0m");
					htmlw='<div class="row justify-content-sm-start justify-content-around  unavailable-'+days.dayName+'-'+days.dayId+' '+days.dayName+'-'+days.dayId+' '+days.dayName+'-time-'+ttt+'" id="'+days.dayName+'-time-'+ttt+'" data-status="Y" style="padding-left:50px; font-size:16px">';
					htmlw=htmlw+'Unavailable';
					htmlw=htmlw+'</div>';
				}else{
					$("#day"+days.dayId).prop( "checked", true );
					htmlw=htmlw+'<div class="my-1 mx-0 row align-items-center justify-content-sm-start available-dropdown-Wrapper justify-content-around available-'+days.dayName+'-'+days.dayId+' '+days.dayName+'-'+days.dayId+' '+days.dayName+'-time-'+ttt+'" id="'+days.dayName+'-time-'+ttt+'"  style="gap: 5px;" >';
					htmlw=htmlw+'<div class="flex-grow-1 flex-sm-grow-0" style="min-width:60px">';
					var fromFunc="getFromTime(this,'"+prestartTime+"','"+preendTime+"','"+userRoleId+"','"+min+"','"+max+"','"+slotBufferLimit+"', '"+slotDateLimit+"', '"+slotDayLimit+"')";
					htmlw=htmlw+'<select class="form-control font-12 fromTime" '+disable+' data-id="'+days.dayName+'-'+days.dayId+'" data-checkid="'+days.dayId+'"  id="'+days.dayName+'-start-time-dropdown-'+ttt+'" onchange="'+fromFunc+'" data-status="Y">';
					if(timeDropdown.length>0){
						htmlw=htmlw+'<option value="">Start Time</option>';
						for (let t = 0; t < timeDropdown.length; t++) {
							var timeopt = timeDropdown[t];
							var strSelect = (userTimeA.startTime==timeopt)?'selected':'';
							htmlw=htmlw+'<option value="'+timeopt+'" '+strSelect+'>'+timeopt+'</option>';
						}
					}
		
					htmlw=htmlw+'</select>';
					htmlw=htmlw+'</div>';
					htmlw=htmlw+'<div>-</div>'
					htmlw=htmlw+'<div class="flex-grow-1 flex-sm-grow-0" style="min-width:60px">';
					var toFunc="getToTime(this,'"+prestartTime+"','"+preendTime+"','"+userRoleId+"','"+min+"','"+max+"','"+slotBufferLimit+"', '"+slotDateLimit+"', '"+slotDayLimit+"' )";
					htmlw=htmlw+'<select class="form-control font-12 toTime" '+disable+' data-id="'+days.dayName+'-'+days.dayId+'" data-checkid="'+days.dayId+'" id="'+days.dayName+'-end-time-dropdown-'+ttt+'" onchange="'+toFunc+'" data-status="Y">';
					if(timeDropdown.length>0){
						htmlw=htmlw+'<option value="">End Time</option>';
						for (let t = 0; t < timeDropdown.length; t++) {
							var timeopt = timeDropdown[t];
							var endSelect = (userTimeA.endTime==timeopt)?'selected':'';
							htmlw=htmlw+'<option value="'+timeopt+'" '+endSelect+'>'+timeopt+'</option>';
						}
					}
					htmlw=htmlw+'</select>';
					htmlw=htmlw+'</div>';
					htmlw=htmlw+'<div class="min-hours">';
				
						var ddclass="";
						if(userTimeA.dataType=='Y' && USER_ROLE_ID==3){
							ddclass="d-none"
						}
					    htmlw=htmlw+"<a href=\"javascript:void(0)\" class=\"btn btn-lg btn-outline-danger remove-time-slot-btn btn-sm ml-2 mr-1 "+ddclass+"  time-save-"+userTimeA.dataType+"\" onclick=\"removeTimeDiv('"+days.dayName+"-time-"+ttt+"','"+days.dayId+"','"+prestartTime+"','"+preendTime+"','"+userRoleId+"','"+min+"','"+max+"','"+slotBufferLimit+"','"+slotDateLimit+"' ,'"+slotDayLimit+"','"+userTimeA.timeid+"')\" style=\"line-height:5px;\"><i class=\"ion-android-close d-inline-block\" style=\"font-size:14px;line-height:10px;height:14px;\"></i></a>";
					    htmlw=htmlw+"<span id='"+days.dayName+'-hour-'+ttt+"'>"+(totalsDuration>0?getTimeWithFormat(totalsDuration):'0h 0m')+"</span>";
						
					
					htmlw=htmlw+'</div>';
					htmlw=htmlw+'</div>';
					
				}
				
			}else{
				htmlw=htmlw+'<div class="row justify-content-sm-start justify-content-around unavailable-'+days.dayName+'-'+days.dayId+' '+days.dayName+'-'+days.dayId+' '+days.dayName+'-time-'+ttt+'"  id="'+days.dayName+'-time-'+ttt+'" data-status="N" style="width:450px !important; padding-left:50px; font-size:16px">';
				htmlw=htmlw+'Unavailable';
				htmlw=htmlw+'</div>';
			}

		}
	}else{
		// if(callTime=='first'){

		// }else{

		// }
		var addDropdown=true;
			if(userRoleId==3){
				if(callTime=='' || callTime=='first' || callTime=='next'){
					addDropdown=false;
					htmlw=htmlw+'<div class="row justify-content-sm-start justify-content-around unavailable-'+days.dayName+'-'+days.dayId+' '+days.dayName+'-'+days.dayId+' '+days.dayName+'-time-0"  id="'+days.dayName+'-time-0" data-status="N" style="width:450px !important; padding-left:50px; font-size:16px">';
					htmlw=htmlw+'Unavailable';
					htmlw=htmlw+'</div>';
				}
			}
			if(addDropdown){
				var totalsDuration=0
					diff = getTimeDifference(prestartTime, preendTime);
					totalsDuration += diff.asMilliseconds();


				var toFuncFrom="getFromTime(this,'"+prestartTime+"','"+preendTime+"','"+userRoleId+"','"+min+"','"+max+"','"+slotBufferLimit+"', '"+slotDateLimit+"', '"+slotDayLimit+"')";
				var toFuncTo="getToTime(this,'"+prestartTime+"','"+preendTime+"','"+userRoleId+"','"+min+"','"+max+"','"+slotBufferLimit+"', '"+slotDateLimit+"', '"+slotDayLimit+"')";
				$("#day"+days.dayId).prop( "checked", true );
				htmlw=htmlw+'<div class="my-1 mx-0 row align-items-center justify-content-sm-start available-dropdown-Wrapper justify-content-around available-'+days.dayName+'-'+days.dayId+' p-1 '+days.dayName+'-'+days.dayId+' '+days.dayName+'-time-0"  id="'+days.dayName+'-time-0" style="gap: 5px;">';
				htmlw=htmlw+'<div class="flex-grow-1 flex-sm-grow-0" style="min-width:60px">';
				htmlw=htmlw+'<select class="form-control font-12 fromTime startTimeDropDown'+days.dayId+'" data-id="'+days.dayName+'-'+days.dayId+'" data-checkid="'+days.dayId+'" onchange="'+toFuncFrom+'" data-status="N">';
				if(timeDropdown.length>0){
					for (let t = 0; t < timeDropdown.length; t++) {
						const timeopt = timeDropdown[t];
						var strSelect = (prestartTime==timeopt)?'selected':'';
						htmlw=htmlw+'<option value="'+timeopt+'" '+strSelect+'>'+timeopt+'</option>';
					}
				}
	
				htmlw=htmlw+'</select>';
				htmlw=htmlw+'</div>';
				htmlw=htmlw+'<div>-</div>'
				htmlw=htmlw+'<div class="flex-grow-1 flex-sm-grow-0" style="min-width:60px">';
				htmlw=htmlw+'<select class="form-control font-12 toTime endTimeDropDown'+days.dayId+'" data-id="'+days.dayName+'-'+days.dayId+'" data-checkid="'+days.dayId+'"  onchange="'+toFuncTo+'" data-status="N">';
				if(endTimeObjt.length>0){
					for (let t = 0; t < endTimeObjt.length; t++) {
						const timeopt = endTimeObjt[t];
						var endSelect = (preendTime==timeopt)?'selected':'';
						htmlw=htmlw+'<option value="'+timeopt+'" '+endSelect+'>'+timeopt+'</option>';
					}
				}
				htmlw=htmlw+'</select>';
				htmlw=htmlw+'</div>';
				htmlw=htmlw+'<div class="min-hours">'
				htmlw=htmlw+"<a href=\"javascript:void(0)\" class=\"btn btn-lg btn-outline-danger remove-time-slot-btn btn-sm ml-2 mr-1 time-save-N\" onclick=\"removeTimeDiv('"+days.dayName+"-time-0','"+days.dayId+"','"+prestartTime+"','"+preendTime+"','"+userRoleId+"','"+min+"','"+max+"','"+slotBufferLimit+"','"+slotDateLimit+"' ,'"+slotDayLimit+"','0')\" style=\"line-height:5px;\"><i class=\"ion-android-close d-inline-block\" style=\"font-size:14px;line-height:10px;height:14px;\"></i></a>";
				htmlw=htmlw+"<span id='"+days.dayName+"-hour-0'>&nbsp;"+(totalsDuration>0?getTimeWithFormat(totalsDuration):'0h 0m')+"</span>";
				htmlw=htmlw+'</div>';
				htmlw=htmlw+'</div>';
			}
			
	}
	return htmlw;
}


function getDaysCheckUncheck(checkDayId, prestartTime, preendTime, userRoleId, min, max, slotBufferLimit, slotDateLimit,  slotDayLimit){
	
	// $(".fromTime").select2("destroy");
	// $(".toTime").select2("destroy");
	
	
	
	var htmlw="";
	var dayNameval = $("#"+checkDayId).attr("data-dayname");
	var dayname=$("#"+checkDayId).attr("data-name");
	var dayId = $("#"+checkDayId).val();
	var userId = $("#userId").val();
	if(userRoleId==3){
		if(!$(".timeAvailabilityConfirmationAction").hasClass("show")){
			$(".timeAvailabilityConfirmationAction").addClass("show");
		}
	}
	if(USER_ROLE_ID==3){
		$("#"+checkDayId).attr('disabled',true);
	}
	if($("#"+checkDayId).is(":checked")){
		$(".cal-hours-"+dayId+"").html('');
			if(userRoleId!=3){
				getUserWeeklyAvailability("cal-hours-"+dayId+"", userId, '', prestartTime, preendTime, dayId,0, userRoleId, min, max,'', slotBufferLimit, slotDateLimit,  slotDayLimit);
				if(userRoleId!=3){
					setTimeout(function() {
						saveAvailabilityOfActiveEvents('CALL-CALENDAR-WEEK','ALL', userRoleId);
					}, 800);
				}
			}else{
				getUserWeeklyAvailability("cal-hours-"+dayId+"", userId, '', prestartTime, preendTime, dayId,0, userRoleId, min, max,'day-check', slotBufferLimit, slotDateLimit,  slotDayLimit);
			}

	}else{
		htmlw="";
		var startTime = "";
		var endTime = "";
		var timeSlotAvailability=[];
		if($("."+dayname+'-'+dayId).length>0){
			var validStatus=validateTimes(dayname+'-'+dayId, 'fromTime', 'toTime', userRoleId, min, max, slotBufferLimit,'N');
			if(validStatus){
				$("."+dayname+'-'+dayId).each(function() { 
					var teacherTime={};
					startTime = $(this).find('.fromTime').val();
					endTime = $(this).find('.toTime').val();
					if(startTime!=undefined &&  startTime!=null && startTime!='' && endTime !=undefined && endTime !=null && endTime !=''){
						teacherTime['dayid']=dayId;
						teacherTime['startTime']=startTime;
						teacherTime['endTime']=endTime;
						teacherTime['dayCheck']='N';
						timeSlotAvailability.push(teacherTime);
					}
				});
				//console.log("getDaysCheckUncheck");
				if(userRoleId!=3){
					saveTimeCalendarWeekWise(userId,dayId,timeSlotAvailability, 'add','day-check-uncheck',prestartTime, preendTime, userRoleId, min, max, slotBufferLimit, slotDateLimit,  slotDayLimit);
				}
			}
		}
			$(".cal-hours-"+dayId+"").html('');
			htmlw=htmlw+'<div class="row justify-content-sm-start justify-content-around unavailable-'+dayname+'-'+dayId+' '+dayname+'-'+dayId+'" data-starttime="'+startTime+'", data-endTime="'+endTime+'" style="width:450px !important; padding-left:50px; font-size:16px">';
			htmlw=htmlw+'Unavailable';
			htmlw=htmlw+'</div>';
			$(".cal-hours-"+dayId+"").html(htmlw);

	}
	$(".week-time-available .fromTime").select2({
		theme:"bootstrap4",
	});
	$(".week-time-available .toTime").select2({
		theme:"bootstrap4",
	});



	// if(!$("#"+checkDayId).is(":checked")){
    //     if($(".week-time-available .time-save-N").length == $(".available-dropdown-Wrapper.d-none").length){
    //         $(".timeAvailabilityConfirmationAction").removeClass("show");
    //     }
    // }
}

function applyAllDays(classId, dayClassid, prestartTime, preendTime, userRoleId, min, max, slotBufferLimit, slotDateLimit,  slotDayLimit){
	//console.log(classId);
	//console.log(dayClassid);
	var userId = $("#userId").val();
	var timeSlotAvailability=[];
		if($("."+dayClassid).length>0){
			var validStatus=validateTimes(dayClassid, 'fromTime', 'toTime', userRoleId, min, max, slotBufferLimit);
			if(validStatus){
				$("."+dayClassid).each(function() { 
					
					var startTime = $(this).find('.fromTime').val();
					var endTime = $(this).find('.toTime').val();
					if(startTime!=undefined &&  startTime!=null && startTime!='' && endTime !=undefined && endTime !=null && endTime !=''){
						$("."+classId).each(function() { 
							var teacherTime={};
							var dayId=0;
							if($(this).is(":checked")){
								dayId=$(this).val();
								teacherTime['dayid']=dayId;
								teacherTime['startTime']=startTime;
								teacherTime['endTime']=endTime;
								teacherTime['dayCheck']='Y';
								timeSlotAvailability.push(teacherTime);
							}
						});
					}
				});
				if(userRoleId!=3){
					saveTimeCalendarWeekWise(userId,'0',timeSlotAvailability, 'add','apply-allday-time',prestartTime, preendTime, userRoleId, min, max, slotBufferLimit, slotDateLimit,  slotDayLimit);
				}
			}
		}

}

function removeTimePrefRence(divid, timeid, userId, dateWise, prestartTime, preendTime, userRoleId) {
	$(".request_delete_teacher_time").html('');
	$(".request_teacher_time").html('');
	if(userRoleId!=3){
		var request = { userId: userId, value: timeid, dateWise: dateWise };
		$.ajax({
			type: "POST",
			url: getURLFor('timeavailability', 'remove-time-prefrence'),
			contentType: "application/json",
			data: JSON.stringify(request),
			dataType: 'json',
			cache: false,
			async: false,
			timeout: 600000,
			success: function (data) {
					//console.log(data);
					if (data['status'] == '0' || data['status'] == '2') {
						showMessageTheme2(0, data['message'], '', true);
					} else {
						showMessageTheme2(1, data['message'], '', true);
						getUserAvailability('user-time-available',userId,'', prestartTime, preendTime, userRoleId);
					}
					return false;
			},
			error: function (e) {
				//showMessage(true, e.responseText);
				return false;
			}
		});
	}else{
		
		if(userRoleId==3){
			var slotRemoveType='time-wise';
			if(dateWise=='Y'){
				slotRemoveType='date-wise';
			}
			var selectDate = $("."+divid).attr("data-select-date")
			var resp = getTeacherMeetingStatus(slotRemoveType,0, userId, timeid, divid, selectDate);
			if(resp){
				// $("."+divid).removeClass("d-inline-block");
				// $("."+divid).addClass("d-none");
				
				var spanId = divid.split("_")[0]+"_"+divid.split("_")[1]+"_"+divid.split("_")[2];
				var rownum=divid.split("_")[3];
				var startDate="";
				$("#"+spanId+" span").not(".remove").each(function() { 
					if($(this).hasClass(divid)){
						$(this).removeClass("d-inline-block");
						$(this).addClass("d-none");
						$("."+divid).removeClass("d-inline-block");
						$("."+divid).addClass("d-none");
						startDate=$("."+divid).attr('data-select-date');

					}else{
						$(this).addClass("specific-time-add");
					}
				});
				var specificUnval=$("#"+spanId+" span").not('.d-none').length;
				if(specificUnval==0){
					var htmlw="";
					// htmlw=htmlw+'<div class="row px-3 align-items-center justify-content-sm-start justify-content-around calday-hours calhours-0">';
					// htmlw=htmlw+'Unavailable';
					// htmlw=htmlw+'</div>';
					htmlw=htmlw+'<span class="d-inline-block  specific-time-add '+spanId+'"_"'+rownum+'  text-danger" style="min-width:135px" data-timeid="0" data-select-date="'+startDate+'" data-controltype="edit-unavailable" data-starttime="'+prestartTime+'" data-endtime="'+preendTime+'">Unavailable</span>';
					$("#specific_td_"+divid.split("_")[2]).html(htmlw);
				}

				if(!$(".timeAvailabilityConfirmationAction").hasClass("show")){
					$(".timeAvailabilityConfirmationAction").addClass("show");
				}
			}
		}
	}

}


function getMeetingEvents(lUserId,prestartTime, preendTime, userRoleId, min, max, slotBufferLimit, slotDateLimit,  slotDayLimit) {
	var request = { userId: USER_ID, lUserId: lUserId };
	$.ajax({
		type: "POST",
		url: getURLFor('timeavailability', 'get-meeting-events'),
		contentType: "application/json",
		data: JSON.stringify(request),
		dataType: 'json',
		cache: false,
		async: false,
		timeout: 600000,
		success: function (data) {
                console.log(data);
				if (data['status'] == '0' || data['status'] == '2') {
					showMessageTheme2(0, data['message']);
                } else {
				var html = getEventList(data.eventList, lUserId,prestartTime, preendTime, userRoleId, min, max, slotBufferLimit, slotDateLimit,  slotDayLimit);
				$(".eventMeetinglist").html(html);

				$(".eventDropdownList").html('');
				var htmlDrp = getEventDropdownList(data.eventList, 'eventDropdownList');
                }
				return false;
		},
		error: function (e) {
			//showMessage(true, e.responseText);
			return false;
		}
	});
}

function getEventList(eventList, userId,prestartTime, preendTime, userRoleId, min, max, slotBufferLimit, slotDateLimit,  slotDayLimit){
	console.log(eventList);
	eventsBasedOnRole=eventList;
	// console.log(USER_ROLE);
	var html=''
	html+='<div class="d-flex align-items-center w-100">'
		+'<div class="d-inline-flex perfectScroll oveflow-auto position-relative align-items-center  '+((userRoleId==3)?'w-100':'')+'">';
			if(userRoleId==3){
				html+='<div style="min-width:210px;max-width:210px">'
						+'<h5 class="m-0 font-weight-bold py-2 w-100">'
							+'<span class="font-weight-bold pull-left p-1 full" style="border-color:#dee2e6;border-style:none none double none; font-size:.88rem">Contract Hours: <label id="agreedHourTotalCount" class="font-weight-bold"></label></span>'
							+'<span class="font-weight-bold pull-left p-1 full font-11">'
								+'Live Classes: <label id="liveClassesHours" class="font-weight-bold"></label> | ' 
								+'Admin Tasks: <label id="adminTaskHours" class="font-weight-bold"></label>'
							+'</span>'
						+'</h5>'
				+'</div>'
				+'<div role="group" class="btn-group-lg btn-group btn-group-toggle totalAvailabilityLabel ml-2 mb-4" style="min-width:fit-content">'
					+'<label class="text-primary text-white p-1 px-2 font-weight-semi-bold d-inline-block mr-2 mb-0 border-bottom">'
						+'Availability&nbsp;<span class="totalAvailabilityGiven">--</span>'
					+'</label>'
					+'<label class="text-success text-white p-1 px-2 font-weight-semi-bold d-inline-block mr-2 mb-0 border-bottom">'
						+'Remaining&nbsp;<span class="totalUnoccupied">--</span>'
					+'</label>'
					+'<label class="text-danger text-white p-1 px-2 font-weight-semi-bold  d-inline-block mr-2 mb-0 border-bottom">'
						+'Booked&nbsp;<span class="totalOccupied">--</span>&nbsp;:'
					+'</label>'
				+'</div>'
				+'<div role="group" class="btn-group-lg btn-group-toggle btn-group calendar-tabs d-none totalAvailabilityEvent ml-2" data-toggle="buttons" style="min-width:fit-content">'
					+'<label class="btn btn-outline-primary mr-2 px-1 rounded active p-1">'
						+'<input type="radio" name="availabilitySlot" class="availabilitySlot" value="availability" checked  autocomplete="off" onclick="">Availability&nbsp;<span class="totalAvailabilityGiven">--</span>'
					+'</label>'
					+'<label class="btn btn-outline-success mr-2 px-1 rounded p-1">'
						+'<input type="radio" name="availabilitySlot"  class="availabilitySlot" value="available"  autocomplete="off" onclick="">Remaining&nbsp;<span class="totalUnoccupied">--</span>'
					+'</label>'
					+'<label class="btn btn-outline-danger mr-2 px-1 rounded p-1">'
						+'<input type="radio" name="availabilitySlot" class="availabilitySlot" value="booked"  autocomplete="off" onclick="">Booked&nbsp;<span class="totalOccupied">--</span>'
					+'</label>'
				+'</div>';
			}
			if(eventList.length>0){
				var lightbgObj=["#e7edf4","#e3e0f9","#e8f6f6"]
				var ci=1;
				for (let e = 0; e < eventList.length; e++) {
					const events = eventList[e];
					var editFun="getEditEvents('"+events.slotId+"','edit','"+userId+"','"+prestartTime+"','"+preendTime+"','"+userRoleId+"', '"+min+"','"+max+"','"+slotBufferLimit+"', '"+slotDateLimit+"','"+slotDayLimit+"');"
					if(userRoleId == 3){
						var borderClass="bg-"+events.bgColor;
					}else{
						var borderClass="card-shadow-primary border-"+events.bgColor;
					}
					
					// if(ci==2){
					// 	borderClass="card-shadow-danger border-danger";
					// }
					// if(ci==3){
					// 	borderClass="card-shadow-success border-success";
					// }
					// if(ci==4){
					// 	borderClass="card-shadow-warning border-warning";
					// }
					// if(ci==5){
					// 	borderClass="card-shadow-warning border-orange";
					// }
					var eActive="Y";
					if(events.activated=='Y' && events.slotActiveByUser=='Y'){
						eActive="N";
					}
					html+='<div class="mx-1 widget-chart widget-chart2 text-left mb-2 '+((userRoleId==3)?'p-1':'px-2 pt-1 pb-2 card-top-border')+'  '+borderClass+' rounded w-100  '+((events.activated=='N' && events.slotActiveByUser=='N')?"envetn_overlay":"")+'" style="'+((userRoleId==3)?'min-width:135px;border-radius:0px !important; max-width:135px; border:2px solid '+lightbgObj[e]+'':'min-width:300px')+' ">'
							+'<div class="full position-absolute text-left bg-white pl-2 text-center" style="left:0pxright:0px;top:0;z-index:1">'
									+'<b class="start-copy-msg-'+e+'"></b>'
								// +'<a href="javascript:void(0)" class="cursor mr-2" style="color:#ccc"><i class="fa fa-edit"></i></a>'
								// +'<a href="javascript:void(0)" class="cursor" style="color:#ccc"><i class="fa fa-trash"></i></a>'
								//(events.activated=='Y' && events.slotId==events.activeAll)
							+'</div>'
							+'<div class="widget-chat-wrapper-outer wrapper-overlay-'+e+'">';
								if(events.userRole!='TEACHER'){
									//html+='<div class="w-100 text-center mb-2 check-disable-overlay envetn_overlay"><a href="javascript:void(0)" class="d-inline-block text-gray" onclick="'+editFun+'">Customize</a></div>';
								}
								
								html+='<div class="widget-chart-content">';
									if(events.userRole!='TEACHER'){
										html+='<div class="d-flex align-items-center font-12 font-weight-semi-bold mb-3 position-relative">'
											+'<span class="d-inline-flex align-items-center">'
												+'<label class="small-switch m-0">'
													+'<input type="checkbox" '+((events.activated=='Y' && events.slotActiveByUser=='Y')?'checked':'')+' onclick="inactiveMeetingSlotType(\''+userId+'\',\''+events.slotId+'\',\''+eActive+'\', \'wrapper-overlay-'+e+'\', \''+prestartTime+'\' , \''+preendTime+'\', \''+userRoleId+'\' , \''+min+'\', \''+max+'\', \''+slotBufferLimit+'\' , \''+slotDateLimit+'\' , \''+slotDayLimit+'\' );">'
													+'<span class="small-switch-slider round"></span>'
												+'</label>&nbsp;On/Off'
											+'</span>'
											+'<span class="ml-auto check-disable-overlay '+(events.slotActiveByUser=='N'?"envetn_overlay":"")+'">';
												// +'<a href="javascript:void(0)" class="cursor mr-2" style="color:#ccc" data-toggle="tooltip" data-placement="top" title="Edit" onclick="'+editFun+'"><i class="fa fa-edit"></i></a>';
												// html+='<a href="javascript:void(0)" class="cursor mr-2" style="color:#ccc" data-toggle="tooltip" data-placement="top" title="Remove" onclick="showDeleteEventWarningModal()"><i class="fa fa-trash"></i></a>';
												//if(events.userRole!='TEACHER'){
												html+='<a href="javascript:void(0)" style="color:#ccc" onclick="copyURL(\'copyLink-'+e+'\',\'start-copy-msg-'+e+'\')" data-toggle="tooltip" data-placement="top" title="Copy Link"><i class="fa fa-copy"></i></a>';
												//}
												// html+'=<a href='+events.meetingBookUrl+' target="_blank" class="cursor btn btn-sm btn-success">Copy Link</a>';
											html+='</span>'
											+'<div style="top:18px;left:0;position:absolute;">'
												+'<input type="text" id="copyLink-'+e+'" value="'+events.meetingBookUrl+'" style="opacity:0;height:0px">'
											+'</div>'
										+'</div>';
									}
									html+='<div class="full">'
										+'<h6 class="font-weight-bold text-center '+((userRoleId==3)?'mb-0 text-white':'text-dark mb-1')+'" style="'+((userRoleId==3)?'font-size:14px; line-height:12px':'font-size:1.1rem !important')+'">'+events.slotName+'</h6>'
										if(userRoleId == 3){
											html+='<h6 class="font-weight-bold text-white mb-0 mt-1 text-center '+events.slotShortName+'" style="font-size:11px"></h6>';
										}
										if(events.userRole!='TEACHER'){
											html+='<div class="m-0 d-flex check-disable-overlay text-gray" style="color:#ccc">'
												+'<div>'
													+'<div class="w-100">Duration</div>'
													+'<div class="w-100">Buffer</div>'
												+'</div>'
												+'<div class="ml-auto">'
													+'<div class="w-100">'+events.timeDuration+' min</div>'
													+'<div class="w-100">'+events.bufferTime+' min</div>'
												+'</div>'
											+'</div>';
										}
									html+='</div>'
								+'</div>'
							+'</div>'
						+'</div>';
					ci=ci+1;
				}
			}
			if(userRoleId==3){
				// html+='<div class="mx-1 widget-chart widget-chart2 text-left mb-2 p-1 rounded w-100  ml-auto" style="min-width:135px;max-width:135px;border-radius:0px !important; border:2px solid #e7edf4;background:#0b5cff">'
				// 	+'<div class="full position-absolute text-left bg-white pl-2" style="left:0px;top:0;z-index:1">'
				// 		+'<b class="start-copy-msg-0"></b>'
				// 	+'</div>'
				// 	+'<div class="widget-chat-wrapper-outer wrapper-overlay-0">'
				// 		+'<div class="widget-chart-content">'
				// 			+'<div class="full">'
				// 				+'<h6 class="font-weight-bold text-center mb-0 text-white" style="font-size:14px; line-height:12px">Zoom Hours</h6>'
				// 				+'<h6 class="font-weight-bold text-white mb-0 mt-1 text-center ZOOM_HOURS" style="font-size:11px">0h 0m</h6>'
				// 			+'</div>'
				// 		+'</div>'
				// 	+'</div>'
				// +'</div>';
				html+='<div style="min-width:210px" class="ml-auto">'
					+'<h5 class="m-0 font-weight-bold py-2 w-100">'
						+'<span class="font-weight-bold pull-left p-1 pr-1 d-inline-block" style="border-color:#dee2e6;border-style:none none double none;font-size:.88rem">Accepted working hrs till now: <label class="font-weight-bold ZOOM_HOURS"></label></span>'
						// +'<span class="font-weight-bold pull-left p-1 full font-11">'
						// 	+'Live Classes: <label id="liveClassesHours" class="font-weight-bold">40</label> | ' 
						// 	+'Admin Tasks: <label id="adminTaskHours" class="font-weight-bold">40</label>'
						// +'</span>'
					+'</h5>'
				+'</div>';			
			}
		html+='</div>'
		if(userRoleId!=3){
			+'<div class="d-inline-flex">'
				+'<a href="javascript:void(0)" class="p-3 rounded-10 border-primary border ml-2 mr-auto d-inline-block card position-relative envetn_overlay" style="min-width:130px">'
					+'<div class="full text-center"><i class="fa fa-plus"></i></div>'
					+'<div class="full text-center">Create<br/>New Event</div>'
				+'</a>'
			+'</div>';	
		}		

	// html+='<a href="javascript:void(0)" class="mx-1 widget-chart mb-2 widget-chart2 text-center card border-primary border text-decoration-none"  style="min-width:130px">';
	// html+='<div class="widget-chat-wrapper-outer align-items-center">';
	// html+='<div class="widget-chart-content text-primary mt-2">';
	// html+='<div class="widget-title text-uppercase"><i class="pe-7s-plus" style="font-size: 34px;"></i></div>';
	// html+='<div class="text-center font-weight-semi-bold">Create <br/>New Event</div>';
	// html+='</div>';
	// html+='</div>';
	// html+='</a>';

	html+='</div>';
	return html;
}

function getEventDropdownList(eventDrpList, dropdownElementId){
	var html=''
	html+='<a href="javascript:void(0)" class="dropdown-toggle text-decoration-none font-size-lg font-weight-semi-bold" data-bs-auto-close="outside" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">';
	html+='<span class="eventTotal">0</span> event type<i class="fa fa-angle-down ml-2"></i>';
	html+='</a>';
	html+='<div tabindex="-1" role="menu" aria-hidden="true" class="dropdown-menu-md dropdown-menu">';
	html+='<ul class="nav flex-column" id="activeOnEventList">';
	html+='<li class="nav-item-header nav-item font-weight-normal">Active on</li>';
	if(eventDrpList.length>0){
		for (let e = 0; e < eventDrpList.length; e++) {
			const events = eventDrpList[e];
			html+='<li class="nav-item-header py-0 nav-item custom-checkbox custom-control">';
			html+='<input type="checkbox" id="'+events.slotId+'" name="'+events.slotId+'" value="'+events.slotName+'" class="custom-control-input event-type-list" >';
			html+='<label for="'+events.slotId+'" class="py-2 full custom-control-label copy-time event_type_label slotType'+events.slotId+' text-dark font-weight-semi-bold" data-value="'+events.slotName+'">'+events.slotName+'</label>';
			html+='</li>';
		}
		
	}	
	
	html+='</ul>';
	html+='<div class="full text-center mt-3">';
	html+='<a href="javascript:void(0)" class="btn btn-outline-primary mr-2">Cancel</a>';
	html+='<a href="javascript:void(0)" class="btn btn-primary" onclick="saveAvailabilityOfActiveEvents(\'EVENTS-SAVE\',\'ALL\')">Save</a>';
	html+='</div>';
	html+='</div>';
	$("."+dropdownElementId).html(html);
	//$(".eventTotal").text(totalEvent);
	if(eventDrpList.length>0){
		var totalEvent=0;
		for (let ie = 0; ie < eventDrpList.length; ie++) {
			const eventss = eventDrpList[ie];
			if(eventss.activeAll==eventss.slotId){
				//$("#"+eventss.slotId).trigger('click');
				$(".slotType"+eventss.slotId).trigger('click');
				$("#"+eventss.slotId).prop('checked', true);
				totalEvent=totalEvent+1;
				//options.push(eventss.slotName);
			}
		}
		$(".eventTotal").text(totalEvent);
	}

}

function saveAvailabilityOfActiveEvents(callFrom, scheduleType, userRoleId){
	customLoader(false);
		// var showvalidation = true;
		// $('#activeOnEventList li').each(function() { 
		// 	var eventCheck = $(this).find('.event-type-list').prop('checked');
		// 	if(eventCheck){
		// 		showvalidation=false;
		// 	}
		// });
		// if(callFrom=='EVENTS-SAVE'){
		// 	hideMessageTheme2('');
		// 	if(showvalidation){
		// 		showMessageTheme2(0, "Select atleast one event to save.", '', true);
		// 		return false;
		// 	}
		// }else{
		// 	if(showvalidation){
		// 		return false;
		// 	}
		// }	

		var eventList=[];
		if(userRoleId==3){
			var eventIds=$("#slotTypeIds").val();
			eventList.push(eventIds)
		}

	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLFor('timeavailability', 'save-availablity-activeon-events'),
		data: JSON.stringify(getRequestForSaveAvailabilityOfActiveEvents(scheduleType,eventList, userRoleId, callFrom)),
		dataType: 'json',
		cache: false,
		timeout: 600000,
		success: function (data) {
			//console.log(data);
			if(callFrom=='EVENTS-SAVE'){
				if (data['status'] == '0' || data['status'] == '2') {
					showMessageTheme2(0, data['message'], '', true);
				} else {
					if(userRoleId!=3){
						showMessageTheme2(1, data['message'], '', true);	
					}
				}
			}
			return false;
		},
		error: function (e) {
			//showMessage(true, e.responseText);
			return false;
		}
	});
}

function getRequestForSaveAvailabilityOfActiveEvents(scheduleType, eventList1, userRoleId, callFrom){
	var timeAvailabilityRequest = {};
	var eventList = [];
	timeAvailabilityRequest['callfrom']=callFrom;
	timeAvailabilityRequest['userId']=$('#userId').val();
	timeAvailabilityRequest['scheduleType']=scheduleType;
	timeAvailabilityRequest['schoolId']= SCHOOL_ID;
	timeAvailabilityRequest['slotAddUserId']=USER_ID;
	timeAvailabilityRequest['userRole'] = 'ADMIN';
	var showvalidation = true;
	if(userRoleId==3){
		if(eventList1.length>0){
			eventList=eventList1;
		}
	}else{
		$('#activeOnEventList li').each(function() { 
			var eventCheck = $(this).find('.event-type-list').prop('checked');
			if(eventCheck){
				showvalidation=false;
				eventList.push($(this).find('.event-type-list').attr('id'));
			}
		});
	}
	// if(showvalidation){
	// 	showMessageTheme2(0, "Select atleast one event to save.", '', true);
	// 	return false;
	// }
	timeAvailabilityRequest['eventList']=eventList;
	console.log(timeAvailabilityRequest);
	return timeAvailabilityRequest;
}

function dataForBookAnEventSlot() {
	$("#timeAvailabilityUIContent").html(skeleton());
	var data={};
	data['userId']=$('#userId').val();
	data['forAllCounselor']=$('#forAllCounselor').val();
	data['eventId']=$('#eventId').val();
	data['sendToEmail']=$('#sendToEmail').val();
	data['sendUserName']=$('#sendUserName').val();
	data['sendToPhone']=$('#sendToPhone').val();
	data['schoolId']=SCHOOL_ID;
	data['meetingId']=$('#meetingId').val();;
	customLoader(true);
	$.ajax({
		 type : "POST",
		 contentType : "application/json",
		 url : getURLForHTML('timeavailability','get-data-for-book-slot'),
		 data : JSON.stringify(data),
		 dataType : 'json',
		 async:true,
		 success : function(data) {
			customLoader(false);
			if (data['status'] == '0' || data['status'] == '2') {
				
			}else {
				data["forAllCounselor"] = $("#forAllCounselor").val();
				data["counselorAutoSelect"] = $("#counselorAutoSelect").val();
				data["demoRoleId"] = $("#demoRoleId").val();
				getLocationAndSelectCountry('bookSlotForEventForm', data);
				customLoader(false);
				// renderStudentEnrollmentRecord(data, moduleId, clickFrom, currentPage);
				
			}
		 },
		 error:function(e){
			// console.log(e);
			 customLoader(false);
		 }
	 });
}

function callFreeSlotsToBookEvent(visitDate,dayId) {
	//	hideMessage('');
	var eventId = $('#eventId').val();
	var userId = '';
	if($("#forAllCounselor").val() == 'false'){
		userId = $('#userId').val();
	}
	var countryTimezone= $('#countryTimezoneId option:selected').val();
	if ($('#countryTimezoneId option:selected').val().trim() != null && $('#countryTimezoneId option:selected').val().trim() != '0') {
		countryTimezone = $('#countryTimezoneId option:selected').val();
	} else {
		showMessageTheme2(0, 'Please select a timezone','',true);
		return false
	}
	var data = {}
	data['timezone'] = countryTimezone;
	data['visitDate'] = visitDate;
	data['dayId'] = dayId;
	data['eventId']=eventId;
	data['userId']=userId;
	
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLForHTML('timeavailability', 'get-free-slots-to-book-event'),
		data: JSON.stringify(data),
		dataType: 'json',
		global:false,
		async:true,
		success: function (data) {
			console.log(data);
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if(data['status'] == '3'){
					redirectLoginPage();
				}else{
					showMessageTheme2(0, data['message'],'',true);
				}
			}else {
				// renderCounselorCotent(data);
				//showMessageTheme2(1, data['message'],'',true);
				$(".slot-wrapper").show();
				$(".counselor-slot-ui-column.slot-wrapper").css({"width":"200px"});
				var windowWidth= $(window).width();
				if(windowWidth<=990){
					//$("body").css({"position":"fixed"});
				}
				
				var slotShowMsg=true;
				var slot="";
				$(".slot-rapper-scroll, .day-and-date, #meetingTimeAndDate").html("");
				if(data.slotList.length>=1){
					$("#slotCounselorIds").val(data.slotCounselorIds);
					$.each(data.slotList, function(key, item){
						if(item.length>0){
							slotShowMsg=false;
							$.each(item, function(index, itemList){
								slot+='<li class="mb-3 d-flex justify-content-center">'
									+'<input type="radio" name="time-slot-list" id="slot_'+index+key+'" class="time-slot-radio" style="opacity: 0;height: 0px;width: 0px;font-size:0px;position: absolute;">'
									+'<label for="slot_'+index+key+'" class="mb-0 font-weight-semi-bold time-slot-custom rounded text-center">'+itemList.startTime+'</label>'
									+'<button class="custom-btn rounded mb-0" onclick="scheduleEvent(\''+itemList.adminUserId+'\',\''+itemList.meetingType+'\',\''+data.visitDateStr+'\',\''+itemList.stTime+'\',\''+itemList.eventEdTime+'\',\''+itemList.startTime+'\',\''+itemList.eventEndTime+'\',\''+data.timezone+'\',\''+itemList.timeZoneId+'\',\''+data.visitDate+'\')">Next</button>'
								+'</li>'
							});
						}
					});
					if(slotShowMsg){
						//showMessageTheme2(0, "No slots are available at the moment. Please try selecting another date.",'',true);
						//return false;
						slot='<li class="text-primary"><div class="full text-center"><i class="fa fa-frown fa-2x"></i></div><div class="full text-center font-weight-bold font-size-lg"> No slot available</div><li>';
						$(".slot-rapper-scroll").html(slot);
					}
					$(".slot-rapper-scroll").html(slot);
					$(".day-and-date").html(data.visitDate);
					$("#meetingSelectDate").val(visitDate);
					$("#meetingSelectDateWeekId").val(dayId);
				}else{
					slot='<li class="text-primary"><div class="full text-center"><i class="fa fa-frown fa-2x"></i></div><div class="full text-center font-weight-bold font-size-lg"> No slot available</div><li>';
					$(".slot-rapper-scroll").html(slot);
				}
				$('.time-slot-radio').change(function() {
					$('.custom-btn').hide();
					$(this).siblings('.custom-btn').show();
				});
				customLoader(false);
			}
		},
		error: function (e) {
			if (checkonlineOfflineStatus()) {
				return;
			}else{
				showMessage(true, e.responseText);
			}
			customLoader(false);
		}
	});
}


function getCalendarForMeeting(elementId,  startDate, slotType, timeZone) {
	var userId=$('#userId').val();
	var eventId=$('#eventId').val();
	var request = {userId:userId, eventId: eventId, startDate: startDate, slotType:slotType, timeZone:timeZone};
	$.ajax({
		type: "POST",
		url: getURLFor('timeavailability', 'get-calendar-meeting-book'),
		contentType: "application/json",
		data: JSON.stringify(request),
		dataType: 'json',
		cache: false,
		async: true,
		timeout: 600000,
		success: function (data) {
				if (data['status'] == '0' || data['status'] == '2') {
                    showMessage(true, data['message']);
                } else {
					$("."+elementId).html('');
					$(".calender-nav").removeClass('d-none').addClass('d-flex');
                   	var htmlss = getMeetingCalendarTable(userId, data, startDate);
					if(data.slotStatus=='N' && data.slotNotAvailable=='N'){
						var htmlMessage=$(".name").text()+' is not taking School Demos at this time. For assistance, please contact us at chat.support@internationalschooling.org';
						$("#eventOffMessage").html(htmlMessage);
					}else if(data.slotStatus=='Y' && data.slotNotAvailable=='N'){
						var htmlMessage='No slots are available at the moment. For assistance, please contact us at chat.support@internationalschooling.org';
						$("#eventOffMessage").html(htmlMessage);
					}else{
						$("#eventOffMessage").html('');
					}
					
				 	 $("."+elementId).html(htmlss);
				 	 var monthyear = data.monthName+' - '+data.year;
					$("#meetingcalMonthYear").html(monthyear);
					$("#meetingTodayDate").val(data.startDate);
					$("#meetingFirstDate").val(data.firstDate);
					$("#meetingFirstDatePreMonth").val(data.firstDatePreMonth);
					$("#meetingFirstDateNextMonth").val(data.firstDateNextMonth);
					if(data.arrowEnabled>0){
						$("#meetingPreCalMonth").show();
					}else{
						$("#meetingPreCalMonth").hide();
					}
					customLoader(false);
                }
				return false;
		},
		error: function (e) {
			//showMessage(true, e.responseText);
			return false;
		}
	});
}

function getMeetingCalendarTable(userId, data, startDate){
	

	
	var preStartTime=data.preStartTime;
	var preEndTime=data.preEndTime;

	var dayOfWeekVal = data.dayOfWeekVal;
	var startDate=dayOfWeekVal;
	var timeDropdown = data.timeAvailableList;
	var enabledDateList = data.calendarDateList;
	var bookingDateList = data.bookingDateList; 
	var htmlCal = "";
	htmlCal=htmlCal+'<table class="table mb-0 text-center" style="table-layout:fixed;">';
	htmlCal=htmlCal+'<thead><tr>'
	htmlCal=htmlCal+'<td class="bold">Sun</td>';
	htmlCal=htmlCal+'<td class="bold">Mon</td>';
	htmlCal=htmlCal+'<td class="bold">Tue</td>';
	htmlCal=htmlCal+'<td class="bold">Wed</td>';
	htmlCal=htmlCal+'<td class="bold">Thu</td>';
	htmlCal=htmlCal+'<td class="bold">Fri</td>';
	htmlCal=htmlCal+'<td class="bold">Sat</td>';
	htmlCal=htmlCal+'</tr>';
	htmlCal=htmlCal+'</thead>';
	htmlCal=htmlCal+'<tbody>';
	htmlCal=htmlCal+'<tr>';
		if(dayOfWeekVal!=7){
			startDate=dayOfWeekVal;
			for (let i = 1; i <= (dayOfWeekVal-1); i++) {
				htmlCal=htmlCal+'<td></td>';
			}
		}
		if(dayOfWeekVal==7){
			for (let i = 1; i <= (dayOfWeekVal-1); i++) {
				htmlCal=htmlCal+'<td></td>';
			}
		}
		for (let i = 0; i < enabledDateList.length; i++) {
			var dates = enabledDateList[i];
			var holidayClass="";
			if(dates.isActive>0){
				holidayClass = dates.isActive==1?'selected-date':'active-date'
			}else{
				if(startDate==1 || startDate==7){
					//holidayClass=dates.available==1?'selected-date':'active-date';
					holidayClass='active-date';
				}else if(dates.isClick == 0){
					holidayClass='expired-date';
				}else if(dates.isClick == 1){
					holidayClass='active-date';
				}else{
					///holidayClass='active-date';
				}
			}

			if(startDate<=7){
				if(dates.isClick==1){
					var onSclick = "getAvailableSlotByEventDate('"+dates.slotDate+"', 'timeSelectDate"+dates.day1+"','"+startDate+"')";
					htmlCal=htmlCal+'<td class="'+holidayClass+'">';
					htmlCal=htmlCal+'<a href="javascript:void(0);" id="timeSelectDate'+dates.day1+'" onclick="'+onSclick+'"  class="d-inline-block'+holidayClass+'">'+dates.day1+'</a>';	
					htmlCal=htmlCal+'</td>';
				}
				if(dates.isClick==0){
					htmlCal=htmlCal+'<td class="'+holidayClass+'"><span class="disabled-date"><label class="m-0 d-inline-block">'+dates.day1+'</label></span></td>';
				}
				startDate=startDate+1;
			}
			if(startDate>7){
				startDate=1;
				htmlCal=htmlCal+'</tr>';
			}
		}
				
		htmlCal=htmlCal+'</tr>';
		htmlCal=htmlCal+'</tbody>  ';                
		htmlCal=htmlCal+'</table>';
		htmlCal=htmlCal+'<div class="d-flex mt-3 pl-4 ml-1 justify-content-center">';
			htmlCal=htmlCal+'<div class="d-inline-flex align-items-center "><span class="disabled-date legend d-inline-block" style="background-color: #e7e7e7;font-weight: bold;color: #676d71;border-radius: 6px;width:20px;height:20px;position: relative;"></span><label class="m-0 d-inline-block ml-1">Not Available</label></div>';
			htmlCal=htmlCal+'<div class="d-inline-flex align-items-center ml-3"><span class="d-inline-block active-date text-center" style="background-color: #d7e5f5;font-weight: bold;color: #007bff;border-radius: 6px;width:20px;height:20px;position: relative;"></span><label class="m-0 d-inline-block ml-1">Available</label></div>';
		htmlCal=htmlCal+'</div>';

		return htmlCal;
}

function getAvailableSlotByEventDate(selectDate, selectDateId, dayId){
	if($("#"+selectDateId).parent("td").hasClass("selected-date")){
		$("#"+selectDateId).parent("td").removeClass("selected-date"); 
		$("#"+selectDateId).parent("td").addClass("active-date");
	}else{
		$(".selected-date").addClass("active-date");
		$(".selected-date").removeClass("selected-date");
		$("#"+selectDateId).parent("td").removeClass("active-date"); 
		$("#"+selectDateId).parent("td").addClass("selected-date");
		$("#"+selectDateId).removeClass("active-date"); 
		$("#"+selectDateId).addClass("selected-date");
	}

	// $(".slot-wrapper").show();
	// $(".counselor-slot-ui-column.slot-wrapper").css({"width":"230px"});
	// var windowWidth= $(window).width();
	// if(windowWidth<=990){
	// 	$("body").css({"position":"fixed"});
	// }
	customLoader(true);
	getTimeZonesList("bookSlotForEventForm","countryTimezoneId","meetingZoneId",selectDate+' 00:00:00');
	callFreeSlotsToBookEvent(selectDate,dayId);
}

function getRefreshWeek(callFrom,userId,selectDate,dayId, prestartTime, preendTime, userRoleId,min, max, slotBufferLimit, slotDateLimit,  slotDayLimit){
	if(callFrom=='from-teacher'){
		selectDate=$("#inActDate").val();
		dayId=$("#timeAvailabilityPopup #weekDayNum").val();
	}
	var request = { userId: userId, selectDate: selectDate, dayId:dayId, updatedBy: USER_ID};
	$.ajax({
		type: "POST",
		url: getURLFor('timeavailability', 'refresh-time-prefrence'),
		contentType: "application/json",
		data: JSON.stringify(request),
		dataType: 'json',
		cache: false,
		async: false,
		timeout: 600000,
		success: function (data) {
                //console.log(data);
			if (data['status'] == '0' || data['status'] == '2') {
                    showMessageTheme2(0, data['message'], '', true);
                } else {
					showMessageTheme2(1, data['message'], '', true);
					if(callFrom=='from-teacher'){
						$("#weekRefreshStatus").val("N");
						$("#timeAvailabilityPopup").modal('hide');
						getUserAvailability('user-time-available',userId,'', prestartTime, preendTime, userRoleId);
					}else{
						getCalendarAvailability('timeAvailabilityPopup', userId,"timeCalendar","","Month", prestartTime, preendTime, userRoleId, min, max, slotBufferLimit, slotDateLimit,  slotDayLimit);
					}
                }
			return false;
		},
		error: function (e) {
			//showMessage(true, e.responseText);
			return false;
		}
	});
}

function inactiveMeetingSlotType(userId,slotTypeId,activeSlot,overlayEleWrapper, prestartTime, preendTime, userRoleId, min, max, slotBufferLimit, slotDateLimit,  slotDayLimit){
	var request = { userId: userId, slotTypeId: slotTypeId, activeSlot:activeSlot, updatedBy: USER_ID};
	$.ajax({
		type: "POST",
		url: getURLFor('timeavailability', 'inactive-meeting-slottype'),
		contentType: "application/json",
		data: JSON.stringify(request),
		dataType: 'json',
		async: false,
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessageTheme2(0, data['message'], '', true);
			} else {
				if(USER_ROLE!='TEACHER'){
					showMessageTheme2(1, data['message'], '', true);
					getMeetingEvents(userId, prestartTime, preendTime, userRoleId, min, max, slotBufferLimit, slotDateLimit,  slotDayLimit);
					$('.dropdown-menu label.event_type_label' ).on( 'click', function( event ) {
						
						eventOptions=[];
						$( '.event-type-list').each(function() {
							if($(this).is(":checked")){
								eventOptions.push($(this).val());
							}
						});
						var $target = $( event.currentTarget ),
							val = $target.attr( 'data-value' ),
							dayNo=val.split("-"),
							dayNo=parseInt(dayNo[1]),
							$inp = $target.parent().find('input'),
							idx;
							
						if((idx = eventOptions.indexOf(val)) > -1) {
							eventOptions.splice( idx, 1 );
							setTimeout( function() {$inp.prop('checked', false)}, 0);
						}else {
							eventOptions.push(val);
							setTimeout( function() {$inp.prop('checked', true)}, 0);
						}
						$(event.target ).blur();
						console.log( eventOptions );
						$(".eventTotal").text(eventOptions.length);
						return false;
					});
					if(activeSlot == 'Y'){
						$("."+overlayEleWrapper).find(".check-disable-overlay").removeClass("envetn_overlay");
					}else{
						$("."+overlayEleWrapper).find(".check-disable-overlay").addClass("envetn_overlay");
					}
				}
			}
			return false;
		}
	});
}


function scheduleMeetingForEvent(formId){
	var eventId = $('#eventId').val();
	var userId = '';
	if($("#forAllCounselor").val() == 'true' && $("#counselorAutoSelect").val() != 'true'){
		userId = $('#counselorName').val();
		if(userId == undefined || userId == null || userId == '' || userId == 0 && userId == '0'){
			showMessageTheme2(0,"Counselor field is mandatory",'',true);
			return false;
		}
		if($('#counselorLeadSource').val()!=undefined){
			if($('#counselorLeadSource').val()==''){
				showMessageTheme2(0,"Lead source field is mandatory",'',true);
				return false;
			}
		}
	}else{
		userId = $('#userId').val();
	}
	var name = $('#name').val();
	if(name==undefined || name==null || name==''){
		showMessageTheme2(0,"Name field is mandatory",'',true);
		return false;
	}
	var email =$('#email').val();
	if(email==undefined || email==null || !validateEmail(email)){
		showMessageTheme2(0,"Email is either empty or invalid",'',true);
		return false;
	}
	
	if($('#'+formId+' #gradeId').val()!=undefined){
		if($('#'+formId+' #gradeId').val()==undefined || $('#'+formId+' #gradeId').val()==null || $('#'+formId+' #gradeId').val()==''){
			showMessageTheme2(0,"Grade field is mandatory",'',true);
			return false;
		}
		if($('#'+formId+' #countryId').val()==undefined || $('#'+formId+' #countryId').val()==null || $('#'+formId+' #countryId').val()==''){
			showMessageTheme2(0,"Country field is mandatory",'',true);
			return false;
		}
		if($('#'+formId+' #phoneNo').val()==undefined || $('#'+formId+' #phoneNo').val()==null || $('#'+formId+' #phoneNo').val()==''){
			showMessageTheme2(0,"Phone No. field is mandatory",'',true);
			return false;
		}
	}
	customLoader(true);

	$("#meetingScheduleform").hide();
	$("#thankyouPageSkeleton").show();
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url: getURLFor('timeavailability','meetingslots-new-submit-for-event'),
		data : JSON.stringify(getRequestForSubmitMeetingForEvent(formId)),
		dataType : 'json',
		success : function(data) {
			console.log(data);
			
			if (data['status'] == '0' || data['status'] == '2') {
				customLoader(false);
				showMessageTheme2(0, data['message'], '', true);
				setTimeout(function() {
					window.location.reload();
				}, 1500);
			} else {
				customLoader(false);
				//showMessageTheme2(1, data['message']);
				$("#thankyouPageSkeleton").html($("#thankyouContent").html());
				// $("#thankyouContent").html();

				var minDuration=$("#meetingTimeDuration").text();
				var userName=$(".cName").text();
				var selectTime=$("#meetingTimeAndDate").text();
				var selectTimeZone=$('#countryTimezoneId option:selected').text();
				var grade=$('#gradeId option:selected').text();
				var meetingFor=$('#meetingFor').val();
				var urlSend = '/timeavailability/send-thank-you-page?'
					+'moduleId=' +moduleId
					+ '&schoolId=' + SCHOOL_ID 
					+'&userId='+userId
					+'&eventId='+eventId
					+'&minDuration='+minDuration
					+'&userName='+userName
					+'&selectTime='+selectTime
					+'&selectTimeZone='+selectTimeZone
					+'&grade='+grade
					+'&forAllCounselor='+$("#forAllCounselor").val()
					+'&counselorAutoSelect='+$("#counselorAutoSelect").val()
					+'&counselorName='+$("#counselorName :selected").text()
					+'&meetingFor='+meetingFor;
				console.log(urlSend);
				getAsPostWithoutUUID(urlSend,'_self');
				customLoader(false)
			}
			customLoader(false);
			return false;
		}
	});
	//$(".meetingSlotAdd").prop("disabled", false);
}


function getRequestForSubmitMeetingForEvent(formId){
	var meetingSlotDTO= {};
	
	meetingSlotDTO['timezone'] = $('#'+formId+' #meetingTimzoneId').val();
	meetingSlotDTO['timeZoneCheck'] = $("#" + formId + " #userTimeZone").val();
	meetingSlotDTO['meetingPersoneId'] = 0;
	var userId = '';
	var leadSource='';
	if($("#forAllCounselor").val() == 'true'){
		if($("#counselorAutoSelect").val() == 'true'){
			var numbers = $("#autoSelectCounselorIds").val().split(",");
			userId = numbers[Math.floor(Math.random() * numbers.length)]
		}else{
			userId = $('#counselorName').val();
			if($('#counselorLeadSource').val()!=undefined){
				leadSource=$('#counselorLeadSource').val();
			}
		}
	}else{
		userId = $("#" + formId + " #schoolPersonId").val();
	}
	meetingSlotDTO['leadSource']=leadSource;
	meetingSlotDTO['schoolPersonId'] = userId;
	meetingSlotDTO['userId'] = userId;
	meetingSlotDTO['meetingId'] = $('#meetingId').val();
	meetingSlotDTO['meetingType'] = $("#" + formId + " #meetingSlotType").val();
	if($("#loginId").val()!='' && $("#loginId").val()!=undefined){
		meetingSlotDTO['lastUserId'] = $("#loginId").val();
	}else{
		meetingSlotDTO['lastUserId'] = USER_ID!=undefined?USER_ID:userId;
	}
	
	
	meetingSlotDTO['meetingDate'] = $('#' + formId +' #meetingSelectDate').val();
	meetingSlotDTO['subject'] = $("#" + formId + " #meetingSlotType").val();
	meetingSlotDTO['startTime'] = $('#'+formId+' #meetingStartTime').val();
	meetingSlotDTO['endTime'] = $('#'+formId+' #meetingEndTime').val();
	meetingSlotDTO['email'] = $('#'+formId+' #email').val().trim();
	meetingSlotDTO['name'] = $('#'+formId+' #name').val().trim();
	
	meetingSlotDTO['slotTypeId'] = $('#'+formId+' #slotTypeId').val();
	if($('#location').val()!=undefined){
		meetingSlotDTO['userlocation'] = $('#location').val();
	}
	meetingSlotDTO['schoolId'] = SCHOOL_ID;
	//meetingSlotDTO['dataFrom'] = "EMAIL-URL";
	meetingSlotDTO['dataFrom'] = "COPY-URL";
	if($('#'+formId+' #gradeId').val()!=undefined){
		meetingSlotDTO['standardId'] = $('#'+formId+' #gradeId').val();
	}
	meetingSlotDTO['countryId'] = $('#'+formId+' #countryId').val();
	meetingSlotDTO['isdCode'] = $('#'+formId+' #isdCode').val();
	meetingSlotDTO['countryCode'] = $('#'+formId+' #pCountryCode').val();
	meetingSlotDTO['phoneNo'] = $('#'+formId+' #phoneNo').val();

	console.log(meetingSlotDTO);
	return meetingSlotDTO;
}

function callCreateNewMeeitingSlot(){
	$("#createNewEventModal").modal("show");
}

function getDataForTimeAvailability() {
	window.location.reload();
}

function initializePerfectScrollbar($container) {
	if ($container[0].scrollHeight > $container.innerHeight()) {
		new PerfectScrollbar($container[0], {
			wheelSpeed: 2,
			wheelPropagation: false,
			minScrollbarLength: 20
		});
		$container.css('overflow', 'auto');
	}
}

function convertTime(dateTime, datetimeFormat, fromTomefromTimezone, toTimezone, outputDateFormat, outputTimeFormat){
	var m=moment.utc(moment.tz(dateTime, datetimeFormat, fromTomefromTimezone).utc()).tz(toTimezone)
	var data={};
	data['date']=m.format(outputDateFormat)
	data['time']=m.format(outputTimeFormat)
	data['hours']= m.format('hh');
	data['mins']=m.format('mm');
	data['sec']=m.format('ss');
	data['ampm']=m.format('a');
	data['offset']=m.format('Z');
	data['timezone']=m.tz();
	return data;
}

function dropdownparseTime(time) {
	var [t, period] = time.split(' ');
	var [hour, minutes] = t.split(':').map(Number);
	if (period === "PM" && hour !== 12) hour += 12;
	if (period === "AM" && hour === 12) hour = 0;
	return hour * 60 + minutes;
}
var bindStartTimeDorpDownFlag = true;
function checkStartTimeVlidation(src,flag,minTimeSlotGap,maxTimeSlotGap, slotGap){
	var startTime_endTime_gap = minTimeSlotGap;
	var end_Time_endTime_gap = maxTimeSlotGap;
	startTime_endTime_gap = parseInt(startTime_endTime_gap, 10);
	end_Time_endTime_gap = parseInt(end_Time_endTime_gap, 10);
	var slotTimeGap = slotGap;
	var startTime = $(src).val();
	var startFormTime ;
	var endFormTime = "11:59 PM";
	var isLastTimeShow = false;
	var isStartLastTimeShow = false;
	if(startTime == "" || startTime == null || startTime == undefined){
		startTime = "12:00 AM";
		startFormTime = "12:00 AM";
		
	}else{
		startFormTime = startTime;
	}
	var startTimeDropdown = $(src);
	var endTimeDropdown = $(src).parent().parent().find('.toTime');
	
	if(startTime != null && startTime != undefined){
		if($(src).find("option").length == $(src).find("option:selected").index()+1){
			endTimeDropdown.empty();
			endTimeDropdown.append('<option value="">End Time</option>');
			endTimeDropdown.append('<option value="11:59 PM">11:59 PM</option>');
			endTimeDropdown.val("").trigger("change");
		}else{
			endTimeDropdown.empty();
			endTimeDropdown.append('<option value="">End Time</option>');
			endTimeDropdown.val("").trigger("change");
			if(flag){
				var endTime = $(src).parent().parent().find('.toTime').val();
			}
			
			// var start_mins = dropdownparseTime(startTime) + 15;
			// if(endTime != ''){
			// 	var end_mins = dropdownparseTime(endTime) + 15;
			// }
			// if(end_mins < start_mins || end_mins == start_mins || endTime == ''){
				// if($(src).val() == "11:45 PM"){
				// 	showMessageTheme2(0, "Invalid Time");
				// }
				
				// if(startTime == 09:00 PM)
				if(USER_ROLE== "TEACHER"){
					var startTimeMinutes = dropdownparseTime(startFormTime);
					var startTimeEndMinuteslimit =  dropdownparseTime(endFormTime) - (startTime_endTime_gap*60)+15;
					// if(startTimeEndMinuteslimit > 24 * 60){
					// 	isStartLastTimeShow =true;
					// 	startTimeEndMinuteslimit = 24 * 60
					// }
					var startMinutes = dropdownparseTime(startTime) + (startTime_endTime_gap*60);
					var endMinuteslimit = dropdownparseTime(startTime) + (end_Time_endTime_gap*60);
					if(endMinuteslimit > 24 * 60){
						isLastTimeShow =true;
						endMinuteslimit = 24 * 60
					}
				}else{
					var startMinutes = dropdownparseTime(startTime) + 15;
					var endMinuteslimit = dropdownparseTime(startTime);
				}
				if(USER_ROLE== "TEACHER"){
					
					
					// startTimeDropdown.empty();
					// if(bindStartTimeDorpDownFlag){
					// 	startTimeDropdown.append('<option value="">Start Time</option>');
					// 	startTimeDropdown.val("").trigger("change");
					// 	bindStartTimeDorpDownFlag=false;
					// }
					// for (var i = startTimeMinutes; i <=startTimeEndMinuteslimit; i += 15) {
					// 	var startHour = Math.floor(i / 60);
					// 	var startMinute = i % 60;
					// 	var startPeriod = startHour >= 12 ? "PM" : "AM";
					// 	if (startHour > 12) startHour -= 12;
					// 	if (startHour === 0) startHour = 12;
					// 	var formattedStartTime = `${startHour}:${startMinute.toString().padStart(2, '0')} ${startPeriod}`;
					// 	startTimeDropdown.append(`<option value="${formattedStartTime}">${formattedStartTime}</option>`);
					// }
					for (var i = startMinutes; i <=(isLastTimeShow?(endMinuteslimit - 15):endMinuteslimit); i += 15) {
						var endHour = Math.floor(i / 60);
						var endMinutes = i % 60;
						var endPeriod = endHour >= 12 ? "PM" : "AM";
						if (endHour > 12) endHour -= 12;
						if (endHour === 0) endHour = 12;
						endHour = prefixZero(endHour);
						var formattedEndTime = `${endHour}:${endMinutes.toString().padStart(2, '0')} ${endPeriod}`;
						endTimeDropdown.append(`<option value="${formattedEndTime}">${formattedEndTime}</option>`);
					}
				}else{
					var i;
					for (i = startMinutes; i < 24*60; i += 15) {
						var endHour = Math.floor(i / 60);
						var endMinutes = i % 60;
						var endPeriod = endHour >= 12 ? "PM" : "AM";
						if (endHour > 12) endHour -= 12;
						if (endHour === 0) endHour = 12;
						endHour = prefixZero(endHour);
						var formattedEndTime = `${endHour}:${endMinutes.toString().padStart(2, '0')} ${endPeriod}`;
						endTimeDropdown.append(`<option value="${formattedEndTime}">${formattedEndTime}</option>`);
					}
					if(i == 24*60){
						endTimeDropdown.append('<option value="11:59 PM">11:59 PM</option>');
					}
				}
				
				if(isLastTimeShow){
					endTimeDropdown.append('<option value="11:59 PM">11:59 PM</option>');
				}
				
			// }
		}
	}
}
function prefixZero(number) {
    return number < 10 ? '0' + number : number;
}
function checkendTimeVlidation(src){
	var endTime = $(src).val();
	var startTime = $(src).parent().parent().find('.fromTime').val();

	if (startTime && endTime) {
		var startMinutes = dropdownparseTime(startTime);
		var endMinutes = dropdownparseTime(endTime);

		if (startMinutes >= endMinutes) {
			showMessageTheme2(0, "Please choose an end time greater than start time.");
			$(this).val('').trigger('change');
		}
	}
}

function getEditEvents(eventId,controlType, userId,prestartTime, preendTime, userRoleId, min, max, slotBufferLimit, slotDateLimit,  slotDayLimit){
	customLoader(true);
	var data={};
	data['eventId'] = eventId;
	data['controlType'] = controlType;
	data['schoolId'] = SCHOOL_ID;
	data['userId'] = userId;
	$.ajax({
		 type : "POST",
		 contentType : "application/json",
		 url : getURLForHTML('timeavailability','get-data-for-add-edit-event'),
		 data : JSON.stringify(data),
		 dataType : 'json',
		 async:true,
		 globle:false,
		 success : function(data) {
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if(data['status'] == '3'){
					redirectLoginPage();
				}else{
					showMessageTheme2(2, data['message'],'',true);
					if($('#createNewEventModal').length<1){
						$('body').append(renderAddEditEventModal(data,''+userId+'',''+prestartTime+'',''+preendTime+'',''+userRoleId+'',''+min+'',''+max+'',''+slotBufferLimit+'',''+slotDateLimit+'',''+slotDayLimit+''));
					}else{
						$("#createNewEventModal").remove();
						$('body').append(renderAddEditEventModal(data,''+userId+'',''+prestartTime+'',''+preendTime+'',''+userRoleId+'',''+min+'',''+max+'',''+slotBufferLimit+'',''+slotDateLimit+'',''+slotDayLimit+''));
					}
					$('#createNewEventModal').modal("show");
				}
			} else {
				if($('#createNewEventModal').length<1){
					$('body').append(renderAddEditEventModal(data,''+userId+'',''+prestartTime+'',''+preendTime+'',''+userRoleId+'',''+min+'',''+max+'',''+slotBufferLimit+'',''+slotDateLimit+'',''+slotDayLimit+''));
				}else{
					$("#createNewEventModal").remove();
					$('body').append(renderAddEditEventModal(data,''+userId+'',''+prestartTime+'',''+preendTime+'',''+userRoleId+'',''+min+'',''+max+'',''+slotBufferLimit+'',''+slotDateLimit+'',''+slotDayLimit+''));
				}
				$(".custom_duration").hide();
				$('#createNewEventModal').modal("show");
				getUserWeeklyAvailability('custom-week-time-available',''+userId+'','',''+prestartTime+'',''+preendTime+'','0',''+data.eventId+'', userRoleId, min, max,'', slotBufferLimit, slotDateLimit,  slotDayLimit);
				// $('#dateRangepick').daterangepicker({
				// 	opens: 'left', // Position where the calendar opens
				// 	parentEl:"#createNewEventModal",
				// 	locale: {
				// 		format: 'YYYY-MM-DD', // Date format
				// 		separator: ' - ', // Separator between dates
				// 		applyLabel: 'Apply', // Text for apply button
				// 		cancelLabel: 'Cancel', // Text for cancel button
				// 		fromLabel: 'From', // Text for the start date label
				// 		toLabel: 'To', // Text for the end date label
				// 		customRangeLabel: 'Custom', // Text for custom range label
				// 		daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr','Sa'], // Days of the week, starting from Sunday
				// 		monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'], // Month names
				// 		firstDay: 1 // Start week on Monday
				// 	}
				// });
				// $('input[name="dateRangeRadio"]').on("click",function(){
				// 	if($('#dateRange').is(':checked')){
				// 		$("#dateRangepickerWrapper").show()
				// 	}else{
				// 		$("#dateRangepickerWrapper").hide()
				// 	}
				// });

				// TODO:: after slot
				$("#toggleWeekAndhours").click(function(){
					$("#toggleWeekAndhours i").toggleClass("fa-angle-right fa-angle-down");
					$("#WeekdaysWrapper").slideToggle()
					$("#availableHoursWrapper").slideToggle()
				});


				// $('input[name="dateSpecificHour"]').click(function(){
				// 	if($('input[name="dateSpecificHour"]').is(':checked')){
				// 		$(".tab-wrapper").hide();
				// 		$(".custom-popup").removeClass("show");
				// 		if($(this).val() == "allEvent"){
				// 			$("#addBySpecificDate").show();
				// 			$("#showAddBySpecificDate").trigger("click");
				// 		}else{
				// 			$("#weeklyHoursList").show();
				// 		}
				// 	}
				// });
				$("#showAddBySpecificDate").click(function(){
					$("#createNewEventModal #inActDate").val('')
					$("#createNewEventModal #weekCount").val("");
					$("#createNewEventModal #weekDayName").val("");
					$("#addBySpecificDate").show();
					$("#weeklyHoursList").hide();
					$("#createNewEventModal .timesection").hide();
					var userRoleids=$("#userRoleid").val()
					var slotMin=$("#slotMin").val()
					var slotMax=$("#slotMax").val()
					var slotBufferLimit=$("#slotBufferTime").val()
					var slotDateLimit=$("#slotDateLimit").val()
					var slotDayLimit=$("#slotMax").val()

					getCalendarDateAvailability('createNewEventModal', ''+userId+'',"timeCalendarSepcificDate","","","Month",true,''+prestartTime+'',''+preendTime+'','add-specify-date',''+data.eventId+'','daySpecifictime', userRoleids, slotMin, slotMax, slotBufferLimit, slotDateLimit,  slotDayLimit);
				
					$("#preSpecificCalMonth").unbind('click').bind("click",  function(){
						var firstDatePreMonth=$("#createNewEventModal #firstDatePreMonth").val();
						var selectDate=$("#createNewEventModal #inActDate").val();
						getCalendarDateAvailability('createNewEventModal', "${euid}","timeCalendarSepcificDate",""+firstDatePreMonth+"",""+selectDate+"","Month", true,'${fromTime}','${toTime}','prev-specify-date','0','daySpecifictime', userRoleids, slotMin, slotMax, slotBufferLimit, slotDateLimit,  slotDayLimit);
					  });
					  $("#nextSpecificCalMonth").unbind('click').bind("click",  function(){
						var firstDateNextMonth=$("#createNewEventModal #firstDateNextMonth").val();
						var selectDate=$("#createNewEventModal #inActDate").val();
						getCalendarDateAvailability('createNewEventModal', "${euid}","timeCalendarSepcificDate",""+firstDateNextMonth+"",""+selectDate+"","Month", true,'${fromTime}','${toTime}','next-specify-date','0','daySpecifictime', userRoleids, slotMin, slotMax, slotBufferLimit, slotDateLimit,  slotDayLimit);
					});

					
					// $('#SpecificDatePicker').datepicker({
					// 	format: 'yyyy-mm-dd',
					// 	//todayHighlight: true,
					// 	orientation: "auto",
					// 	container: '#date-wrapper',
					// 	//todayBtn: true,
					// 	inline: true, // Always show the datepicker
					// 	beforeShowDay: function(date) {
					// 		var highlightDates = [ // Array of dates to highlight
					// 		new Date('2024-04-20'),
					// 		new Date('2024-04-21'),
					// 		new Date('2024-04-22')
					// 		];
					// 		var currentDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
					// 		if (highlightDates.some(function(d) { return d.toDateString() === date.toDateString(); })) {
					// 		return { classes: 'circle-highlight' };
					// 		} else {
					// 		return { classes: '' };
					// 		}
					// 	}
					// }).datepicker('show');
					// $('#SpecificDatePicker').data('datepicker').hide = function () {};
				});
				$('.meeting-color-wrapper .dropdown-menu span.d-flex.align-items-center').on( 'click', function(event) {
					return false;
				});
				// $(document).mouseup(function (e) {
				// 	if ($(e.target).closest(".custom-popup .card").length=== 0) {
				// 		$(".custom-popup").removeClass("show");
				// 	}
				// }); 
				$(".back-step").click(function(){
					$('input[name="dateSpecificHour"]').prop("checked",false)
					if($(this).parent().attr("id") == "weeklyHoursList"){
						$("#weeklyHoursList").hide();
						$(".tab-wrapper").show();
					}else if($(this).parent().attr("id") == "addBySpecificDate"){
						$("#weeklyHoursList").show();
						$("#addBySpecificDate").hide();
					}else{

					}
				});
				customLoader(false);
			}
		 },
		error:function(e){
		// console.log(e);
			customLoader(false);
		}
	});
}

function getDataForSaveDataAddEditEvents(formId, controlType){
	var addEditEventRequest={};
	addEditEventRequest['userId'] = USER_ID;
	addEditEventRequest['schoolId'] = SCHOOL_ID;
	addEditEventRequest['controlType'] = controlType;
	addEditEventRequest['eventId']=5;
	
	return addEditEventRequest;
}

function saveDataAddEditEvents(formId, controlType){
	//$("#createNewEventModal").modal("show");
	customLoader(true);
	$.ajax({
		 type : "POST",
		 contentType : "application/json",
		 url : getURLForHTML('timeavailability','save-data-of-add-edit-event'),
		 data : JSON.stringify(getDataForSaveDataAddEditEvents(formId,controlType)),
		 dataType : 'json',
		 async:true,
		 globle:false,
		 success : function(data) {
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if(data['status'] == '3'){
					redirectLoginPage();
				}else{
					showMessageTheme2(0, data['message'],'',true);
				}
			} else {
				customLoader(false);
			}
		 },
		error:function(e){
		// console.log(e);
			customLoader(false);
		}
	});
}

function viewBookSlotDetails(){
	$("#bookSlotDetailsModal").modal("show");
}

$("#duration").on('change',function(){
	if($(this).val()=='CUSTOM'){
		$(".custom_duration").show();
	}else{
		$(".custom_duration").hide();
	}
});


function renderAddEditEventModal(data,userId, prestartTime, preendTime, userRoleId, min, max, slotBufferLimit, slotDateLimit,  slotDayLimit){
	var html =
		'<div class="modal fade" id="createNewEventModal" tabindex="-1" role="dialog" aria-modal="true" >'
			+'<div class="modal-dialog" role="document" style="max-width: 500px;">'
				+'<div class="modal-content">'
					+'<div class="modal-header py-2">'
						+'<h5 class="modal-title text-dark font-weight-semi-bold">Event Type</h5>'
						+'<button type="button" class="close" data-dismiss="modal" aria-label="Close">'
							+'<span aria-hidden="true">'
								+'<i class="fa fa-times"></i>'
							+'</span>'
						+'</button>'
					+'</div>'
					+'<div class="modal-body">'
						+'<form class="full">'
							+'<div class="row">'
								+'<div class="col-12 mb-2">'
									+'<label class="m-0 font-size-lg font-weight-semi-bold">Event</label>'
									+'<div class="input-group mb-3">'
										+'<div class="input-group-prepend">'
										+'<button class="btn btn-outline-secondary dropdown-toggle d-flex align-items-center" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'
											+'<a class="bg-success d-inline-block mx-1 prev-event-color" data-event-color="bg-success" href="#" style="width:20px;height: 20px;border-radius: 50%;"></a>'
											+'<i class="fa fa-angle-down mr-1"></i>'
										+'</button>'
										+'<div class="dropdown-menu">'
											+'<div class="font-weight-semi-bold dark px-2">Event Color</div>'
											+'<div role="separator" class="dropdown-divider"></div>'
											+'<div class="full px-2">'
												+'<a class="bg-success d-inline-block mx-1" data-event-color="bg-success" href="javascript:void(0)" onclick="chooseEventColor(this)" style="width:20px;height: 20px;border-radius: 50%;"></a>'
												+'<a class="bg-danger d-inline-block mx-1" data-event-color="bg-danger" href="javascript:void(0)" onclick="chooseEventColor(this)" style="width:20px;height: 20px;border-radius: 50%;"></a>'
												+'<a class="bg-primary d-inline-block mx-1" data-event-color="bg-primary" href="javascript:void(0)" onclick="chooseEventColor(this)" style="width:20px;height: 20px;border-radius: 50%;"></a>'
												+'<a class="bg-warning d-inline-block mx-1" data-event-color="bg-warning" href="javascript:void(0)" onclick="chooseEventColor(this)" style="width:20px;height: 20px;border-radius: 50%;"></a>'
												+'<a class="bg-orange d-inline-block mx-1" data-event-color="bg-orange" href="javascript:void(0)" onclick="chooseEventColor(this)" style="width:20px;height: 20px;border-radius: 50%;"></a>'
											+'</div>'
										+'</div>'
										+'</div>'
										+'<input type="text" id="slotName" class="form-control" aria-label="Text input with dropdown button" placeholder="Name your event" '+(data.userStatus=='N'?'disabled':'')+'  value="'+data.slotName+'">'
									+'</div>'
								+'</div>'
								+'<div class="col-12 mb-2">'
									+'<div class="row">'
										+'<div class="col-xl-5 col-lg-5 col-md-7 col-sm-10 col-12">'
											+'<label class="m-0 font-size-lg font-weight-semi-bold">Duration</label>'
											+'<select name="duration" id="duration" class="form-control" '+(data.userStatus=='N'?'disabled':'')+'>'
												+'<option value="CUSTOM">Custom</option>'
												// +'<option value="00">0 min</option>'
												+'<option '+(data.timeDuration==15?'selected':'')+' value="15">15 min</option>'
												+'<option '+(data.timeDuration==30?'selected':'')+' value="30">30 min</option>'
												+'<option '+(data.timeDuration==40?'selected':'')+' value="40">40 min</option>'
												+'<option '+(data.timeDuration==50?'selected':'')+' value="50">50 min</option>'
											+'</select>'
										+'</div>'
									+'</div>'
								+'</div>'
								+'<div class="col-xl-5 col-lg-5 col-md-7 col-sm-10 col-12 mb-2 custom_duration" >'
									+'<div class="row">'
										+'<div class="col-5 pr-0">'
											+'<input id="customDuration" name="customDuration" type="text" class="form-control">'
										+'</div>'
										+'<div class="col-7">'
											+'<select name="customDurationTimeIn" id="customDurationTimeIn" class="form-control">'
												+'<option value="M">Min</option>'
												// +'<option value="H">Hr</option>'
											+'</select>'
										+'</div>'
									+'</div>'
								+'</div>'
								+'<div class="col-12 mb-2 mt-2">'
									+'<label class="m-0 font-size-lg font-weight-semi-bold full">Buffer time <span class="float-right text-primary">None</span></label>'
									+'<div class="d-flex align-items-center mb-2">'
										+'<span class="d-inline-flex mr-2" style="width: 90px;">Before event:</span>'
										+'<select name="beforeTime" id="beforeTime" class="form-control w-auto">'
											+'<option value="CUSTOM">Custom</option>'
											+'<option '+(data.beforeTime==0?'selected':'')+' value="0">0 min</option>'
											+'<option '+(data.beforeTime==5?'selected':'')+' value="5">5 min</option>'
											+'<option '+(data.beforeTime==10?'selected':'')+' value="10">10 min</option>'
											+'<option '+(data.beforeTime==15?'selected':'')+' value="15">15 min</option>'
											+'<option '+(data.beforeTime==30?'selected':'')+' value="30">30 min</option>'
										+'</select>'
									+'</div>'
									+'<div class="d-flex align-items-center mb-2">'
										+'<span class="d-inline-flex mr-2" style="width: 90px;">After event:</span>'
										+'<select name="afterTime" id="afterTime" class="form-control w-auto">'
											+'<option value="CUSTOM">Custom</option>'
											+'<option '+(data.afterTime==0?'selected':'')+' value="0">0 min</option>'
											+'<option '+(data.afterTime==5?'selected':'')+' value="5">5 min</option>'
											+'<option '+(data.afterTime==10?'selected':'')+' value="10">10 min</option>'
											+'<option '+(data.afterTime==15?'selected':'')+' value="15">15 min</option>'
											+'<option '+(data.afterTime==30?'selected':'')+' value="30">30 min</option>'
										+'</select>'
									+'</div>'
								+'</div>'
								+'<div class="col-12 mb-2 mt-2">'
									+'<div class="d-flex align-items-center">'
										+'<label class="m-0 font-size-lg font-weight-semi-bold">Available hours</label>'
										+'<span class="d-inline-flex ml-1 meeting-color-wrapper">'
											+'<button class="btn btn-lg dropdown-toggle d-flex align-items-center" style="border: 1px solid #ced4da;" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'
												+'Copy from'
												+'<i class="fa fa-angle-down ml-1"></i>'
											+'</button>'
											+'<div class="dropdown-menu" style="max-width: 200px;">'
												+'<span class="d-flex align-items-center"><a class="d-inline-block mx-1 bg-success" data-color-class="bg-success" href="#" style="width:20px;height: 20px;border-radius: 50%;"></a>IS Demo Meetings</span>'
												+'<div role="separator" class="dropdown-divider"></div>'
												+'<span class="d-flex align-items-center"><a class="d-inline-block mx-1 bg-primary" data-color-class="bg-primary" href="#" style="width:20px;height: 20px;border-radius: 50%;"></a>Demo Meetings</span>'
												+'<div role="separator" class="dropdown-divider"></div>'
												+'<span class="d-flex align-items-center"><a class="d-inline-block mx-1 bg-danger" data-color-class="bg-danger" href="#" style="width:20px;height: 20px;border-radius: 50%;"></a>Meetings</span>'
											+'</div>'
										+'</span>'
									+'</div>'
									+'<div style="color:#9f9c9c">Set repeating times or date-specific orerrides for the free time Calendly will offer on your calendar.</div>'
									+'<hr class="mb-0"/>'
								+'</div>'
								+'<div class="col-12 mb-2">'
									+'<div class="full">'
										+'<div class="full" id="WeekdaysWrapper">'
											+'<label class="full font-weight-bold text-dark m-0">Weekdays, 9am - 5pm</label>'
											+'<div class="#9f9c9c">+1 date-specific time</div>'
										+'</div>'
										+'<a href="javascript:void(0)" class="position-absolute" id="toggleWeekAndhours"  style="right:12px; top:2px;">'
											+'<i class="fa fa-angle-right font-weight-semi-bold text-dark" style="font-size: 26px;"></i>'
										+'</a>'
										+'<div class="full" id="availableHoursWrapper" style="display: none;">'
											+'<div class="full">'
												+'<label class="full font-weight-bold text-dark mb-0">Available Hours</label>'
												+'<div class="mt-2" style="color:#9f9c9c">Set repeating times or date-specific orerrides for the free time Calendly will offer on your calendar.</div>'
											+'</div>'
											+'<div class="full bg-light rounded mt-2">'
												+'<div class="card-header card-header-tab-animation bg-light rounded">'
													+'<ul class="nav nav-justified">'
														+'<li class="nav-item"><a data-toggle="tab" href="#weeklyHours" class="active nav-link">Weekly hours</a></li>'
														+'<li class="nav-item"><a data-toggle="tab" href="#DateSpecificHours" class="nav-link">Date-specifics hours</a></li>'
													+'</ul>'
												+'</div>'
												+'<div class="tab-wrapper">'
													+'<div class=" tab-content p-3">'
														+'<div class="tab-pane active" id="weeklyHours" role="tabpanel">'
													+'</div>'
												+'<div class="tab-pane" id="DateSpecificHours" role="tabpanel">'
															+'<div class="d-flex">'
																+'<div>Override your available for specific dates when your hours differ from your regular weekly hours.</div>'
																+'<a href="javascript:void(0)" class="text-dark" style="width:80px" onclick="showEventTypeRadioButton()">'
																	+'<i class="fa fa-edit"></i>'
																+'</a>'
															+'</div>'
														+'</div>'
													+'</div>'
												+'</div>'
												+'<div class="full p-2" id="weeklyHoursList" style="display: none;">'
													+'<div class="cursor d-inline-block back-step"><i class="fa fa-angle-left mr-1"></i>Back</div>'
													+'<label class="full font-weight-bold text-dark mb-0">Weekly hours</label>'
													+'<ul class="list-group list-group-flush custom-week-time-available">'
													+'</ul>'
													+'<label class="full font-weight-bold text-dark mb-0 mt-2">Date-specific hours</label>'
													+'<div class="my-1">Override your available for specific dates when your hours differ from your regular weekly hours.</div>'
													+'<a href="javascript:void(0)" class="btn btn-outline-dark mb-2" id="showAddBySpecificDate">Add date-specific hours</a>'
													+'<p class="my-2"><i class="fa fa-globe mr-1"></i>Indian standard time</p>'
												+'</div>'
												+'<div class="full p-2" id="addBySpecificDate" style="display: none;">'
													+'<div class="cursor d-inline-block back-step"><i class="fa fa-angle-left mr-1"></i>Back</div>'
													+'<label class="full font-weight-bold text-dark mb-0 font-size-lg">Select the date(s) you want to assign specific hours</label>'
													+'<div class="row">'
														+'<div>'
															+'<h3 class="cal-title font-20px" id="calMonthYear"></h3>'
															// +'<span class="">Set your weekly hours</span>'
														+'</div>'
														+'<div class="arrowBtn ml-auto">'
															+'<button type="button" id="preSpecificCalMonth" class="mb-2 mr-2 btn-icon btn-pill btn" >'
																+'<i class="fa fa-angle-left" style="font-size:25px"></i> '
															+'</button>'
															+'<button type="button" id="nextSpecificCalMonth" class="mb-2 mr-2 btn-icon btn-pill btn" >'
																+'<i class="fa fa-angle-right" style="font-size:25px"></i> '
															+'</button>'
														+'</div>'
														+'<input type="hidden" name="weekDayName" id="weekDayName" value="" />'
														+'<input type="hidden" name="weekCount" id="weekCount" value="" />'
														+'<input type="hidden" name="weekDayNum" id="weekDayNum" value="" />'
														+'<input type="hidden" name="inActDate" id="inActDate" value="" />'
														+'<input type="hidden" name="firstStartDate" id="firstStartDate" value="" />'
														+'<input type="hidden" name="firstDate" id="firstDate" value="" />'
														+'<input type="hidden" name="firstDateNextMonth" id="firstDateNextMonth" value="" />'
														+'<input type="hidden" name="firstDatePreMonth" id="firstDatePreMonth" value="" />'
														+'<input type="hidden" name="timeZoneId" id="timeZoneId" value="" />'
													+'</div>'
													+'<div class="my-1" id="timeCalendarSepcificDate">'
														//+'<input type="" id="SpecificDatePicker" style="height: 0px;width: 0px; visibility: hidden;"/>'
													+'</div>'
													+'<div class="full mt-2 timesection">'
														// +'<label class="full font-weight-bold text-dark mb-0">What hours are you available?</label>'
														// +'<ul class="list-group list-group-flush">'
														// 	+'<li class="d-flex p-3 bg-white border-bottom align-items-center justify-content-between">'
														// 		+'<div class="mr-2">'
														// 			+'<input type="text" class="form-control" value="9:00am">'
														// 		+'</div>'
														// 		+'<div class="mr-2">-</div>'
														// 		+'<div class="mr-2">'
														// 			+'<input type="text" class="form-control" value="5:00pm">'
														// 		+'</div>'
														// 		+'<div class="mr-2 text-center" style="width: 60px;">'
														// 			+'<a href="javascript:void(0)" onclick="">'
														// 			+'	<i class="ion-android-close" style="font-size:25px"></i>'
														// 			+'</a> '
														// 		+'</div>'
														// 		+'<div class="text-center" style="width: 60px;">'
														// 			+'<a href="javascript:void(0)" onclick="">'
														// 				+'<i class="icon ion-android-add" style="font-size:25px"></i>'
														// 			+'</a>'
														// 		+'</div>'
														// 	+'</li>'
														// 	+'</li>'
														// +'</ul>'
														+'<div class="bold my-2">'
															+'<span>What hours are you available? </span>'
															+'<a href="javascript:void(0)" class="btn btn-lg btn-outline-primary btn-sm float-right bhagat1" onclick="addSingleRowTime(\'createNewEventModal\',\''+userId+'\',\'daySpecifictime\',\''+prestartTime+'\',\''+preendTime+'\', \''+userRoleId+'\',\''+min+'\', \''+max+'\', \''+slotBufferLimit+'\',\''+slotDateLimit+'\', \''+slotDayLimit+'\',\'\',\'0\');" style="line-height:0"><i class="icon ion-android-add" style="font-size:15px;line-height:13px"></i></a>'
														+'</div>'
														+'<div class="row overflow-y-auto scrollbar-container" style="height:170px">'
															+'<div class="col-12 daySpecifictime"></div>'
														+'</div>'
													+'</div>'
													+'<hr/>'
													+'<div class="full text-center mb-2">'
														+'<a href="javascript:void(0)" class="btn btn-outline-primary">Cancel</a>'
														+'<a href="javascript:void(0)" class="btn btn-primary">Apply</a>'
													+'</div>'
												+'</div>'
												
											+'</div>'
											// +'<div class="custom-popup align-items-center justify-content-center">'
											// 	+'<div class="col-10">'
											// 		+'<div class="card p-2">'
											// 			+'<span class="d-inline-block custom-radio custom-control w-auto mb-2">'
											// 				+'<input type="radio" id="event" name="dateSpecificHour" class="custom-control-input" value="singleEvent">'
											// 				+'<label class="custom-control-label" for="event">For this event type only</label>'
											// 			+'</span>'
											// 			+'<span class="d-inline-block custom-radio custom-control w-auto">'
											// 				+'<input type="radio" id="allEvent" name="dateSpecificHour" class="custom-control-input" value="allEvent">'
											// 				+'<label class="custom-control-label" for="allEvent">For all event types using this schedule</label>'
											// 			+'</span>'
											// 		+'</div>'
											// 	+'</div>'
											// +'</div>'
										+'</div>'
									+'</div>'
								+'</div>'
							+'</div>'
						+'</form>'
					+'</div>'
					+'<div class="modal-footer">'
						+'<button type="button" class="btn btn-secondary close-modal-btn" data-dismiss="modal">Close</button>'
						+'<button type="button" class="btn btn-primary close-modal-btn" id="">Apply</button>'
					+'</div>'
				+' </div>'
			+'</div>'
		+'</div>';
	return html;
}


function bookSlotDetailsModal(){
	var html =
			'<div id="bookSlotDetailsModal" class="modal fade fade-scale" tabindex="" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">'
				+'<div class="modal-dialog modal-md modal-dialog-centered box-shadow-none">'
					+'<div class="modal-content border-0">'
						+'<div class="modal-header pt-2 pb-2 theme-bg text-white">'
							+'<h5 class="modal-title" id="exampleModalLabel">Booked Slot Detials</h5>'
							+'<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">'
								+'<span aria-hidden="true">×</span>'
							+'</button>'
						+'</div>'
						+'<div class="modal-body">'
							+'<div class="widget-chart text-left mb-2 card-top-border card-shadow-primary border-success card w-100 ">'
								+'<ul class="p-0 m-0 w-100">'
									+'<li class="d-flex flex-wrap">'
										+'<label class="m-0 font-weight-bold mr-1">Event Name:</label>'
										+'<span>School Demo</span>'
									+'</li>'
									+'<li class="d-flex flex-wrap">'
										+'<label class="m-0 font-weight-bold mr-1">Invitee Name:</label>'
										+'<span>Bhagat Singh Garakoti</span>'
									+'</li>'
									+'<li class="d-flex flex-wrap">'
										+'<label class="m-0 font-weight-bold mr-1">Event Duration:</label>'
										+'<span>30 minute</span>'
									+'</li>'
									+'<li class="d-flex flex-wrap">'
										+'<label class="m-0 font-weight-bold mr-1">Status:</label>'
										+'<span>Pending</span>'
									+'</li>'
									+'<li class="d-flex flex-wrap">'
										+'<label class="m-0 font-weight-bold mr-1">Invitee Date and Time Zone:</label>'
										+'<span>Jun 29, 2024 05:20 AM - 05:50 AM Netherlands | Amsterdam | UTC +01:00</span>'
									+'</li>'
								+'</uli>'
							+'</div>'
						+'</div>'
						+'<div class="modal-footer">'
							+'<button type="button" class="btn btn-info btn-shadow float-right pr-4 pl-4 ml-2" data-dismiss="modal">Close</button>'
						+'</div>'
					+'</div>'
				+'</div>'
			+'</div>';
		return html;
}

function showDeleteEventWarningModal(){
	$("#eventDeleteWarningModal").modal("show")
}


function callMeetingBooking(callfrom, bookingId, bookType, startDate, entityType, entityId) {
	customLoader(true);
	data={};
	data['bookingId']=bookingId;
	data['bookType']=bookType;
	data['startDate']=startDate;
	data['entityType']=entityType;
	data['entityId']=entityId;
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLFor('timeavailability', 'get-meeting-booking-time'),
		data: JSON.stringify(data),
		dataType: 'json',
		cache: false,
		timeout: 600000,
		async: true,
		success: function (data) {
			console.log(data);
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if (data['status'] == '3') {
					redirectLoginPage();
				} else {
					
				}
			} else {
				var html=getBookMeetingDetail(data);
				$(".meetingDetailclass"+bookingId).html(html);
				
			}
			
			customLoader(false);
		},
		error: function (e) {
			if (tt == 'theme2') {
				showMessageTheme2(2, TECHNICAL_GLITCH, '', true);
			} 
		}
	});
}



function getColorByEntityType(entityType){
	var actualEntityType='';
	if(entityType=='COUNSELORMEET' 
		|| entityType=='CUSTOM' 
		|| entityType=='INTERVIEW' 
		|| entityType=='PTM' 
		|| entityType=='MEETINS'|| entityType=='MEETINGS'){
		actualEntityType='STUDENT_DOUBT_SESSION';
	}else if(entityType=='REQUESTDEMO' 
		|| entityType=='CONNECTMEET' 
		|| entityType=='B2B-INTERVIEW' 
		|| entityType=='SYS-TRAINING' 
		){
		actualEntityType=entityType;
	}else if(entityType=='BATCH_CLASS_RESCHEDULE' || entityType=='BATCH_TEACHER_MAPPING'){
		actualEntityType='GROUP_CLASS';
	}else if(entityType=='EXTRA_ACTIVITY_DETAILS'){
		actualEntityType='ACTIVITY_CLASS';
	}
	var colorByEntityType='';
	$.each(eventsBasedOnRole, function(k, v){
		if(v.slotShortName==actualEntityType){
			colorByEntityType=v.bgColor;
		}
	});
	return colorByEntityType;
}

function getSepcificDateTime(){
	var selectDate = $("#inActDate").val();
	var data={};
	var timeAvailableList=[];
	var selDate = selectDate.split(",");
	for (let s = 0; s < selDate.length; s++) {
		const selm = selDate[s];
		if(selm!=''){
			$(".specific_tr_date_"+selm.toString().replaceAll("-","")).remove();
			var timeSlotAvailability=[];
			var timeAvailableObj={};
			var date1 = new Date(selm);
			var strDate=date1.toString().split(" ")[0]+', '+date1.toString().split(" ")[1]+' '+date1.toString().split(" ")[2]+' '+date1.toString().split(" ")[3];
			timeAvailableObj['selectDate']=strDate;
			timeAvailableObj['strSelectDate']=selm;
			timeAvailableObj['startTime']=null;
			timeAvailableObj['endTime']=null;
			timeAvailableObj['dayId']=null;
			timeAvailableObj['dayName']=null;
			timeAvailableObj['slotType']=null;
			timeAvailableObj['duration']=null;
			timeAvailableObj['dayTimeType']='';
			timeAvailableObj['dataType']='N';
			timeAvailableObj['dateValid']='Y';
			var totalTimeHrsMins='0h 0s';
			var totalDiff=0;
			$('.calday-hours').not('.d-none').each(function() { 
				var teacherTime={};
				var slottimeType='remove-hide';
				if($(this).hasClass('hide-remove-button')){
					slottimeType='remove-hide';
				}
				var startTime = $(this).find('.fromTime').val();
				var endTime = $(this).find('.toTime').val();
				if(startTime!=undefined &&  startTime!=null && startTime!='' && endTime !=undefined && endTime !=null && endTime !=''){
					teacherTime['timeid']=0;
					teacherTime['dayid']=null;
					teacherTime['dayCheck']=null;
					teacherTime['startTime']=startTime+' - '+endTime;
					teacherTime['endTime']=null;
					teacherTime['slotType']=null;
					teacherTime['slotTypeId']=null;
					teacherTime['dataType']='N';
					teacherTime['timetype']=slottimeType;
					timeSlotAvailability.push(teacherTime);
					startTime = convertTo24Hour(startTime);
					endTime = convertTo24Hour(endTime);
					var stDateTime = new Date('1970-01-01T' + startTime + 'Z');
					var enDateTime = new Date('1970-01-01T' + endTime + 'Z');
					var diff = (Date.parse(enDateTime) - Date.parse(stDateTime)) / 1000 / 60;
					totalDiff=totalDiff+diff;
				}else{
					timeAvailableObj['dayTimeType']='Unavailable';
				}
			});
			var hours = String(100 + Math.floor(totalDiff / 60)).substr(1);
			var mins = String(100 + totalDiff % 60).substr(1);
			totalTimeHrsMins=hours+'h '+mins+'m';
			timeAvailableObj['totalTimeHrsMins']=totalTimeHrsMins;
			timeAvailableObj['teacherPreferTime']=timeSlotAvailability;
			timeAvailableList.push(timeAvailableObj);
		}
	}

	data['timeAvailable']=timeAvailableList;
	data['status']=1;
	data['statusCode']='SUCCESS';
	data['message']=null;
	data['userId']=null;
	return data;
}

function getTeacherMeetingStatus(availableType, weekDayId, userId, daySlotId, divid, selectDate) {
	customLoader(true);
	var response=true;
	data={};
	data['availableType']=availableType;
	data['weekDayId']=weekDayId;
	data['userId']=userId;
	data['daySlotId']=daySlotId;
	if(selectDate!=undefined){
		data['selectDate']=selectDate;
	}
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLFor('timeavailability', 'get-meeting-status-booking-time'),
		data: JSON.stringify(data),
		dataType: 'json',
		cache: false,
		timeout: 600000,
		async: false,
		success: function (data) {
			console.log(data);
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				response=true;
			} else {

				var hhtml="<span>"+data.teacherPreferSlotStime+"</span>";
				$(".request_delete_teacher_time").html(hhtml);

				var notSaveTime="";
				$(".request_teacher_time").html(notSaveTime);
				var preferTimeList=data.preferSlotList;
				var addParam="'','','',''";
				if(preferTimeList.length>0){
					for (let d = 0; d < preferTimeList.length; d++) {
						var preferTime=preferTimeList[d];
						if(preferTime.slotDelStatus=='N'){
							notSaveTime+='<span class="d-none add-time-after-remove" data-userid="'+userId+'" data-timeid="'+daySlotId+'" data-select-date="'+preferTime.selectDate+'" data-controltype="'+preferTime.slotAddType+'" data-starttime="'+preferTime.tStartTime+'" data-endtime="'+preferTime.tEndTime+'"></span>';
							addParam ="'"+preferTime.slotAddType+"', '"+preferTime.selectDate+"','"+preferTime.tStartTime+"','"+preferTime.tEndTime+"'";
						}
					}
					$(".request_teacher_time").html(notSaveTime);
				}

				var html = bindClassData(data.leetingList);
				$("#avialabilityRemoveList").html(html);
				var onclick = "removeWeekSlot('"+divid+"','"+availableType+"','"+weekDayId+"',"+addParam+")";
				var markAsRescheduleConfirm = "markAsRescheduleConfirm()";
				$("#timeAvailabilityRemoveSave").attr('onClick',onclick);
				$("#timeRemoveReschedule").attr('onClick',markAsRescheduleConfirm);
				$("#timeAvailabilityRemovePopup").modal('show');
				response=false;
			}
			
			customLoader(false);
		},
		error: function (e) {
			if (tt == 'theme2') {
				showMessageTheme2(2, TECHNICAL_GLITCH, '', true);
			} 
		}
	});
	return response;
}

function bindClassData(meetingList){
	var htmlCal='';
	if(meetingList.length>0){
		for (let ind = 0; ind < meetingList.length; ind++) {
			const bookdata = meetingList[ind];
			var hiddenValue = bookdata.meetingType.replaceAll(" ","_")+"|"+bookdata.timeId+"|"+bookdata.adminClassDate
			htmlCal=htmlCal+'<tr>';
			htmlCal=htmlCal+'<td style="vertical-align:top"><input type="hidden" class="timeId" value='+hiddenValue+'></input>'+bookdata.meetingType+'<br/>'+bookdata.recurringClassStart+'</td>';
			htmlCal=htmlCal+'<td style="vertical-align:top">'+bookdata.studentName+'</td>';
			htmlCal=htmlCal+'<td style="vertical-align:top">'+bookdata.teacherName+'</td>';
			htmlCal=htmlCal+'<td style="vertical-align:top">';
			htmlCal=htmlCal+'<span class="text-danger" style="font-size:14px"><b>Teacher: </b>'+bookdata.teacherDatetime+' '+(bookdata.teacherTimezone.toString().replace("/"," | "))+'</span><br/>';
			htmlCal=htmlCal+'<span><b>Student: </b>'+bookdata.studentDateTime+' '+bookdata.studentTimezone.toString().replace("/"," | ")+'</span><br/>';
			htmlCal=htmlCal+'<span><b>Admin: </b>'+bookdata.adminDatetime+' '+bookdata.adminTimeZone.toString().replace("/"," | ")+'</span>';
			htmlCal=htmlCal+'</td>';
			htmlCal=htmlCal+'</tr>';
		}
	}
	return htmlCal;
}

function removeWeekSlot(divid, availableType, weekDayId, slotAddType, selectDate, stTime, enTime){
	var userId=$("#userId").val();
	var userRoleId=$("#userRoleId").val();
	var prestartTime=$("#slotFromTime").val();
	var preendTime=$("#slotToTime").val();
	var min=$("#slotMin").val();
	var max=$("#slotMax").val();
	var slotBufferLimit=$("#slotDateLimit").val();
	var slotDateLimit=$("#slotBufferTime").val();
	var slotDayLimit=$("#dayChangeLimit").val();
	var calhrsClass=divid.split("-")[0];
	if(calhrsClass=='calhours'){
		availableType='day-wise';
	
		
		
	}
	if(availableType=='week-wise' || availableType=='day-wise'){
		$("#"+divid).addClass('d-none');
		

		var dayName=divid.split("-")[0];
		var dayId=weekDayId;
		

		var prePositionInd= parseInt(divid.split("-")[2]);

		$(".add-time-after-remove").each(function() { 
			stTime=$(this).attr('data-starttime');
			enTime=$(this).attr('data-endtime');
			var timeid=$(this).attr('data-timeid');
			var userId=$(this).attr('data-userid');

			if(calhrsClass=='calhours'){
				$("."+divid).addClass('d-none');
				addSingleRowTime('createNewEventModal',''+userId+'','daytime',''+stTime+'',''+enTime+'', ''+userRoleId+'',''+min+'', ''+max+'', ''+slotBufferLimit+'',''+slotDateLimit+'', ''+slotDayLimit+'','remove-slot-week', timeid);
			}else{
				addNewRowTime(""+dayName+"",""+dayId+"",""+stTime+"",""+enTime+"",""+userRoleId+"", ""+min+"", ""+max+"",""+slotBufferLimit+"", ""+slotDateLimit+"", ""+slotDayLimit+"",'remove-slot-week' );
				$(".fromTime").select2({
					theme:"bootstrap4",
				});
				$(".toTime").select2({
					theme:"bootstrap4",
				});
				var positionInd=(prePositionInd+1);
				$("#"+dayName+"-time-"+positionInd+"").find('.fromTime').attr('disabled', true);
				$("#"+dayName+"-time-"+positionInd+"").find('.toTime').attr('disabled', true);
			}

			setTimeout(function(){
				$("body").addClass("modal-open");
				$("body").css({"padding-right":"7px"})
				}, 500);
		});
		
	}else{

		//if(slotAddType=='TIME-SPECIFIC'){
			var spanId = divid.split("_")[0]+"_"+divid.split("_")[1]+"_"+divid.split("_")[2];
			var rownum=divid.split("_")[2];
			var ut=0//divid.split("_")[3];
			var htmlCal="";
			var selectsDate="";
			var ddclass="";
			var timeid=0;
			$("#"+spanId+" span").not(".remove").each(function() { 
				if($(this).hasClass('text-danger')){
					$(this).remove();
				}else{
					if($(this).hasClass(divid)){
						selectsDate=$(this).attr('data-select-date');
						stTime=$(this).attr('data-starttime');
						enTime=$(this).attr('data-endtime');
						timeid=$(this).attr('data-timeid');
						onFunc ="removeTimePrefRence('specific_tr_"+rownum+"_"+ut+"', '"+timeid+"','"+userId+"','N','"+prestartTime+"','"+preendTime+"','"+userRoleId+"')";
						htmlCal=htmlCal+'<span class="d-none specific_tr_'+rownum+'_'+ut+'" style="min-width:135px" data-timeid="'+timeid+'" data-select-date="'+selectsDate+'" data-controltype="add" data-starttime="'+stTime+'" data-endtime="'+enTime+'">'+stTime+' - '+enTime+'</span>';
						htmlCal=htmlCal+'<span class="d-none ml-2 mb-1 remove specific_tr_'+rownum+'_'+ut+'">';
						htmlCal=htmlCal+'<a href="javascript:void(0);" class="click-to-catalog btn btn-sm btn-outline-danger" onclick="'+onFunc+'"><i class="ion-android-close"></i></a>';
						htmlCal=htmlCal+'</span></br>';
						ut=ut+1;
					}else{
						selectsDate=$(this).attr('data-select-date');
						stTime=$(this).attr('data-starttime');
						enTime=$(this).attr('data-endtime');
						timeid=$(this).attr('data-timeid');
						//$(this).addClass("specific-time-add");
						onFunc ="removeTimePrefRence('specific_tr_"+rownum+"_"+ut+"', '"+timeid+"','"+userId+"','N','"+prestartTime+"','"+preendTime+"','"+userRoleId+"')";
						htmlCal=htmlCal+'<span class="d-inline-block  specific-time-add specific_tr_'+rownum+'_'+ut+' '+ddclass+'" style="min-width:135px" data-timeid="'+timeid+'" data-select-date="'+selectsDate+'" data-controltype="add" data-starttime="'+stTime+'" data-endtime="'+enTime+'">'+stTime+' - '+enTime+'</span>';
						htmlCal=htmlCal+'<span class="d-inline-block ml-2 mb-1 remove specific_tr_'+rownum+'_'+ut+'">';
						htmlCal=htmlCal+'<a href="javascript:void(0);" class="click-to-catalog btn btn-sm btn-outline-danger" onclick="'+onFunc+'"><i class="ion-android-close"></i></a>';
						htmlCal=htmlCal+'</span></br>';
						ut=ut+1;
					}
				}
			});
	//	}
		
		$(".add-time-after-remove").each(function() { 
			var selectsDate=$(this).attr('data-select-date');
			var stTime=$(this).attr('data-starttime');
			var enTime=$(this).attr('data-endtime');
			var timeid=$(this).attr('data-timeid');
			// var data = getSepcificDateTimeRemove(selectsDate, stTime, enTime);
			// var htmlss = getUserAvailabilityHtml(data, ""+userId+"",""+stTime+"",""+enTime+"", ""+userRoleId+"");
				onFunc ="removeTimePrefRence('specific_tr_"+rownum+"_"+ut+"', '"+timeid+"','"+userId+"','N','"+prestartTime+"','"+preendTime+"','"+userRoleId+"')";
				htmlCal=htmlCal+'<span class="d-inline-block  specific-time-add specific_tr_'+rownum+'_'+ut+'  text-danger" style="min-width:135px" data-timeid="'+timeid+'" data-select-date="'+selectsDate+'" data-controltype="add" data-starttime="'+stTime+'" data-endtime="'+enTime+'">'+stTime+' - '+enTime+'</span>';
				// htmlCal=htmlCal+'<span class="d-inline-block ml-2 mb-1 remove specific_tr_'+rownum+'_'+ut+'">';
				// htmlCal=htmlCal+'<a href="javascript:void(0);" class="click-to-catalog btn btn-sm btn-outline-danger" onclick="'+onFunc+'"><i class="ion-android-close"></i></a>';
				// htmlCal=htmlCal+'</span></br>';
				htmlCal=htmlCal+'</br>';
				ut=ut+1;
		});

		$("#specific_td_"+rownum).html(htmlCal);
	}
	
	$("#timeAvailabilityRemovePopup").modal('hide');

	if(calhrsClass!='calhours'){
		if(!$(".timeAvailabilityConfirmationAction").hasClass("show")){
			$(".timeAvailabilityConfirmationAction").addClass("show");
		}
	}

}

function getSepcificDateTimeRemove(selectdate, stTime, enTime){
	var data={};
	var timeAvailableList=[];
		const selm = selectdate;
		if(selm!=''){
			var timeSlotAvailability=[];
			var timeAvailableObj={};
			var date1 = new Date(selm);
			var strDate=date1.toString().split(" ")[0]+', '+date1.toString().split(" ")[1]+' '+date1.toString().split(" ")[2]+' '+date1.toString().split(" ")[3];
			timeAvailableObj['selectDate']=strDate;
			timeAvailableObj['strSelectDate']=selm;
			timeAvailableObj['startTime']=null;
			timeAvailableObj['endTime']=null;
			timeAvailableObj['dayId']=null;
			timeAvailableObj['dayName']=null;
			timeAvailableObj['slotType']=null;
			timeAvailableObj['duration']=null;
			timeAvailableObj['dayTimeType']='';
			timeAvailableObj['dataType']='N';
			timeAvailableObj['dateValid']='Y';
			var totalTimeHrsMins='0h 0s';
			var totalDiff=0;
			$('.calday-hours').each(function() { 
				var teacherTime={};
				var startTime = stTime;
				var endTime = enTime;
				if(startTime!=undefined &&  startTime!=null && startTime!='' && endTime !=undefined && endTime !=null && endTime !=''){
					teacherTime['timeid']=null;
					teacherTime['dayid']=null;
					teacherTime['dayCheck']=null;
					teacherTime['startTime']=startTime+' - '+endTime;
					teacherTime['endTime']=null;
					teacherTime['slotType']=null;
					teacherTime['slotTypeId']=null;
					teacherTime['dataType']='N';
					timeSlotAvailability.push(teacherTime);
					startTime = convertTo24Hour(startTime);
					endTime = convertTo24Hour(endTime);
					var stDateTime = new Date('1970-01-01T' + startTime + 'Z');
					var enDateTime = new Date('1970-01-01T' + endTime + 'Z');
					var diff = (Date.parse(enDateTime) - Date.parse(stDateTime)) / 1000 / 60;
					totalDiff=totalDiff+diff;
				}else{
					timeAvailableObj['dayTimeType']='Unavailable';
				}
			});
			var hours = String(100 + Math.floor(totalDiff / 60)).substr(1);
			var mins = String(100 + totalDiff % 60).substr(1);
			totalTimeHrsMins=hours+'h '+mins+'m';
			timeAvailableObj['totalTimeHrsMins']=totalTimeHrsMins;
			timeAvailableObj['teacherPreferTime']=timeSlotAvailability;
			timeAvailableList.push(timeAvailableObj);
		}
	

	data['timeAvailable']=timeAvailableList;
	data['status']=1;
	data['statusCode']='SUCCESS';
	data['message']=null;
	data['userId']=null;
	return data;
}


function callTimeBookingTeacher(callfrom, bookingId, bookType, startDate, iddate) {
	customLoader(true);
	data={};
	data['bookingId']=bookingId;
	data['bookType']=bookType;
	data['startDate']=startDate;
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLForHTML('report', 'get-booking-time'),
		data: JSON.stringify(data),
		dataType: 'json',
		cache: false,
		timeout: 600000,
		async: true,
		success: function (data) {
			//console.log(data);
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if (data['status'] == '3') {
					redirectLoginPage();
				} else {
					
				}
			} else {
				var html = bindTeacherBookedClass(data);
				$(".meetingDetailclass"+bookingId).html(html);
			}
			customLoader(false);
		},
		error: function (e) {
			if (tt == 'theme2') {
				showMessageTheme2(2, TECHNICAL_GLITCH, '', true);
			} 
		}
	});
}

function getTeacherTimeBooked(bookingId, bookType, startDate, iddate){
	callTimeBookingTeacher('', bookingId, bookType, startDate, iddate)
	//$('#teacherOccupiedClass').modal('show');
}
function bindTeacherBookedClass(bookdata){
	var htmlCal='';
	htmlCal=htmlCal+'<div class="widget-chart text-left card-top-border card-shadow-primary border-'+bookdata.meetingColor+' card w-100" style="min-width:450px">';
	htmlCal=htmlCal+'<ul class="p-0 m-0 w-100">';
	if(bookdata.meetingType=='Activity'){
		htmlCal=htmlCal+'<li class="d-flex flex-wrap">';
		htmlCal=htmlCal+'<label class="m-0 font-weight-bold mr-1">Activity Title:</label>';
		htmlCal=htmlCal+'<span>'+bookdata.subjectName+'</span>';
		htmlCal=htmlCal+'</li>';
		htmlCal=htmlCal+'<li class="d-flex flex-wrap">';
		htmlCal=htmlCal+'<label class="m-0 font-weight-bold mr-1">Class Type:</label>';
		htmlCal=htmlCal+'<span>'+bookdata.meetingType+'</span>';
		htmlCal=htmlCal+'</li>';
		if(USER_ROLE_ID!=3){
			htmlCal=htmlCal+'<li class="d-flex flex-wrap">';
			htmlCal=htmlCal+'<label class="m-0 font-weight-bold mr-1">Admin Timings:</label>';
			htmlCal=htmlCal+'<span>'+bookdata.adminDatetime+'</span>';
			htmlCal=htmlCal+'</li>';
		}
	}else if(bookdata.meetingType=='Group'){
		htmlCal=htmlCal+'<li class="d-flex flex-wrap">';
		htmlCal=htmlCal+'<label class="m-0 font-weight-bold mr-1">Class with:</label>';
		htmlCal=htmlCal+'<span>'+bookdata.studentName+'</span>';
		htmlCal=htmlCal+'</li>';
		htmlCal=htmlCal+'<li class="d-flex flex-wrap">';
		htmlCal=htmlCal+'<label class="m-0 font-weight-bold mr-1">Course Name:</label>';
		htmlCal=htmlCal+'<span>'+bookdata.subjectName+'</span>';
		htmlCal=htmlCal+'</li>';
		htmlCal=htmlCal+'<li class="d-flex flex-wrap">';
		htmlCal=htmlCal+'<label class="m-0 font-weight-bold mr-1">Class Type:</label>';
		htmlCal=htmlCal+'<span>'+bookdata.meetingType+'</span>';
		htmlCal=htmlCal+'</li>';
		if(USER_ROLE_ID!=3){
			htmlCal=htmlCal+'<li class="d-flex flex-wrap">';
			htmlCal=htmlCal+'<label class="m-0 font-weight-bold mr-1">Admin Timings:</label>';
			htmlCal=htmlCal+'<span>'+bookdata.adminDatetime+'</span>';
			htmlCal=htmlCal+'</li>';
		}
		// htmlCal=htmlCal+'<li class="d-flex flex-wrap">';
		// htmlCal=htmlCal+'<label class="m-0 font-weight-bold mr-1">Buffer Time:</label>';
		// htmlCal=htmlCal+'<span>'+bookdata.bufferTime	+'</span>';
		// htmlCal=htmlCal+'</li>';
	}else{
		htmlCal=htmlCal+'<li class="d-flex flex-wrap">';
		htmlCal=htmlCal+'<label class="m-0 font-weight-bold mr-1">Class with:</label>';
		htmlCal=htmlCal+'<span>'+bookdata.studentName+'</span>';
		htmlCal=htmlCal+'</li>';
		htmlCal=htmlCal+'<li class="d-flex flex-wrap">';
		htmlCal=htmlCal+'<label class="m-0 font-weight-bold mr-1">Course Name:</label>';
		htmlCal=htmlCal+'<span>'+bookdata.subjectName+'</span>';
		htmlCal=htmlCal+'</li>';
		htmlCal=htmlCal+'<li class="d-flex flex-wrap">';
		htmlCal=htmlCal+'<label class="m-0 font-weight-bold mr-1">Class Type:</label>';
		htmlCal=htmlCal+'<span>'+bookdata.meetingType+'</span>';
		htmlCal=htmlCal+'</li>';
		htmlCal=htmlCal+'<li class="d-flex flex-wrap">';
		htmlCal=htmlCal+'<label class="m-0 font-weight-bold mr-1">Student Timings:</label>';
		htmlCal=htmlCal+'<span>'+bookdata.studentDateTime+'</span>';
		htmlCal=htmlCal+'</li>';
		if(USER_ROLE_ID!=3){
			htmlCal=htmlCal+'<li class="d-flex flex-wrap">';
			htmlCal=htmlCal+'<label class="m-0 font-weight-bold mr-1">Admin Timings:</label>';
			htmlCal=htmlCal+'<span>'+bookdata.adminDatetime+'</span>';
			htmlCal=htmlCal+'</li>';
		}
		// htmlCal=htmlCal+'<li class="d-flex flex-wrap">';
		// htmlCal=htmlCal+'<label class="m-0 font-weight-bold mr-1">Buffer Time:</label>';
		// htmlCal=htmlCal+'<span>'+bookdata.bufferTime	+'</span>';
		// htmlCal=htmlCal+'</li>';
	}
	
	htmlCal=htmlCal+'</ul>';
	htmlCal=htmlCal+'</div>';
	return htmlCal;
}

$(document).on('visibilitychange', function() {
	$("#timeAvailabilityPopup").on("hide.bs.modal",function(){
		if ($('.week-time-available .fromTime').data('select2')) {
			$(".week-time-available .fromTime").select2("destroy");
		}
		if ($('.week-time-available .toTime').data('select2')) {
			$(".week-time-available .toTime").select2("destroy");
		}
		$(".week-time-available .fromTime").select2({
			theme:"bootstrap4",
		});
		$(".week-time-available .toTime").select2({
			theme:"bootstrap4",
		});
		$("#timeAvailabilityPopup .modal-footer #timeAvailabilitySave").addClass("d-none");
	});
	if (document.visibilityState == "visible") {
		var checkToolTipIsVisible = setInterval(function(){
			if($(".tooltip").hasClass("show")){
				$(".tooltip").remove();
			}
		},10);
		setTimeout(function(){
			clearInterval(checkToolTipIsVisible)
		},1000);
    }
});


function getTimeLastValue(min, timesOptions){
	var minTimeGap = min;
	minTimeGap = parseInt(minTimeGap, 10); // 1
	var times = timesOptions;
	var endTime = times.filter(function(time) {
		return time.endsWith(":00 AM") || time.endsWith(":00 PM");
	});
	endTime = endTime.reverse();
	var filteredTimes = times.slice(0, times.indexOf(endTime[(minTimeGap-1)]) + 1);
	return filteredTimes;
}


$(document).click(function(event) {
	// Check if the click is outside the dropdown
  	if($(event.target).closest('.dropdown').length) {
		$("#timeCalendar .dropdown-menu").removeClass("show");
		$("#timeCalendar .dropdown-menu").parent().closest(".scrollbar-container").css({"overflow-y":"auto"});
		$(event.target).closest(".dropdown-menu").addClass("show");
		$(event.target).closest(".dropdown-menu").parent().closest(".scrollbar-container").css({"overflow-y":"inherit"});
  	}else{
		$("#timeCalendar .dropdown-menu").removeClass("show");
		$("#timeCalendar .dropdown-menu").parent().closest(".scrollbar-container").css({"overflow-y":"auto"});
	}
});
  
$(document).ready(function(){
	getWaringContent1();
	$(".dropdown-toggle").click(function(){
		if($("#timeCalendar .dropdown-menu").hasClass("show")){
			$("#timeCalendar .dropdown-menu").removeClass("show");
			$("#timeCalendar .dropdown-menu").parent().closest(".scrollbar-container").css({"overflow-y":"auto"});
		}
	});
});  


function markAsRescheduleRequest(){
	var allMeetingTypeAndIds = '';
	$('#avialabilityRemoveList tr').each(function() {
		allMeetingTypeAndIds += ","+$(this).find(".timeId").val();
	  });
	  return allMeetingTypeAndIds.slice(1,allMeetingTypeAndIds.length)
}

function markAsReschedule(){
	var data = {
		"allMeetingTypeAndIds" : markAsRescheduleRequest()
	}
	customLoader(true);
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLForHTML('report', 'remove-availability-reschedule-class'),
		data: JSON.stringify(data),
		dataType: 'json',
		cache: false,
		timeout: 600000,
		async: true,
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if (data['status'] == '3') {
					redirectLoginPage();
				} else {
					showMessageTheme2(2, data['message'], '', true);
				}
			} else {
				showMessageTheme2(1, data['message'], '', true);
				$("#timeAvailabilityRemovePopup").modal('hide');
				var mettingsIdsAndTypeWithDate = markAsRescheduleRequest()
				mettingsIdsAndTypeWithDate = mettingsIdsAndTypeWithDate.split(",");
				mettingsIdsAndTypeWithDate.forEach(element => {
					var type = element.split("|")[0]
					var id = element.split("|")[1]
					var date = element.split("|")[2]
					date = new Date(date);
					date = changeDateFormat(date,"mm-dd-yyyy");
					if(type == "Group"){
						sendMailCancelClassSlotRemove("sendmail-cancel", id, date);
					}
				});
			}
			customLoader(false);
		},
		error: function (e) {
			if (tt == 'theme2') {
				showMessageTheme2(2, TECHNICAL_GLITCH, '', true);
			} 
			customLoader(false);
		}
	});
}

function sendMailCancelClassSlotRemove(status, batchTeacherMappingId, classDate){
	let data = {}
		
	data.batchTeacherMappingId = batchTeacherMappingId
	
	data.status = status;
	data.classCancelDate = classDate
	data.userId = USER_ID
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLForHTML('dashboard','class-cancel-and-reschedule'),
		data: JSON.stringify(data),
		dataType: 'json',
		cache: false,
		timeout: 600000,
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessageTheme2(0, data['message']);
			} else {
				// showMessageTheme2(1, data['message']);
			}
		}
	});
}	


function showWarningMessageShow(warningMessage1, functionName1, bodyMsg) {
	if (bodyMsg == "info-modal-sm") {
		if($("#remarksresetDelete2").length<1){
			$('body #schoolReportContent').append(deleteWarning(warningMessage1, functionName1));
		}
		
		if (functionName1 == '') {
			$('#resetDeleteErrorWarningYes2').hide();
			$('#resetDeleteErrorWarningNo2').hide();
			$('#resetDeleteErrorWarningCancel2').show();
		} else {
			$('#resetDeleteErrorWarningYes2').show();
			$('#resetDeleteErrorWarningNo2').show();
			$('#resetDeleteErrorWarningCancel2').hide();
		}
		functionName1 = "$('#remarksresetDelete2').modal('hide');" + functionName1 + ";";
		$('#warningMessage2').html(warningMessage1);
		if (bodyMsg !== "info-modal-sm") {
			var strText = "Please note that any recurring class created for this student will be deactivated after the student is withdrawn. If for any reason the class is not deactivated, kindly do the same from the Recurring Class menu";
			$("#statusMessage-2").html(strText);
		} 
		else {
			$("#statusMessage-2").html('<i class="fas fa-sync fa-4x text-info"></i>');
		}
		$('#resetDeleteErrorWarningYes2').attr('onclick', functionName1);
		$('#remarksresetDelete2').modal('show');
	} else {
		if (functionName1 == '') {
			$('#resetDeleteErrorWarningYes1').hide();
			$('#resetDeleteErrorWarningNo1').hide();
			$('#resetDeleteErrorWarningCancel1').show();
		} else {
			$('#resetDeleteErrorWarningYes1').show();
			$('#resetDeleteErrorWarningNo1').show();
			$('#resetDeleteErrorWarningCancel1').hide();
		}
		functionName1 = "$('#remarksresetDelete1').modal('hide');" + functionName1 + ";";
		$('#warningMessage1').html(warningMessage1);
		if (bodyMsg) {
			var strText = "Please note that any recurring class created for this student will be deactivated after the student is withdrawn. If for any reason the class is not deactivated, kindly do the same from the Recurring Class menu";
			$("#statusMessage-1").html(strText);
		} else {
			$("#statusMessage-1").html('<i class="fa fa-refresh fa-4x" style="color:#337ab7 !important;"></i>');
		}
		$('#resetDeleteErrorWarningYes1').attr('onclick', functionName1);
		$('#remarksresetDelete1').modal('show');
	}
}

function markAsRescheduleConfirm(){
	showWarningMessageShow("Are you sure you want to reschedule and cancel classes ?","markAsReschedule()");
}

function countDaysFromCurrentDate(year, month, currentDate) {
    var daysInMonth = new Date(year, month, 0).getDate();
    var firstDay = new Date(year, month - 1, currentDate).getDay();
    var dayCount = [0, 0, 0, 0, 0, 0, 0]; // Sunday to Saturday

    // Dates to exclude
    

    for (var i = currentDate - 1; i < daysInMonth; i++) {
        var currentDateObj = new Date(year, month - 1, i + 1);
        if (excludeDates.includes(currentDateObj.toDateString())) {
            continue; // Skip the excluded dates
        }
        dayCount[(firstDay + i - (currentDate - 1)) % 7]++;
    }

    var days = ["0", "1", "2", "3", "4", "5", "6"];
    var result = {};
    for (var j = 0; j < 7; j++) {
        result[days[j]] = dayCount[j];
    }
	console.log(excludeDates);
    return result;
}

function callRefreshWeek(callFrom,userId,userRoleId){
	if(userRoleId==3){
		$("#weekRefreshStatus").val("Y");
		if(!$(".timeAvailabilityConfirmationAction").hasClass("show")){
			$(".timeAvailabilityConfirmationAction").addClass("show");
		}
	}	
}

function getCounselerByDateTimeAndTimeZone(date, startTime, endTime, timeZone, slotCounselorIds, elementId, defaultOptinValue){
	customLoader(true);
	var data = {
		date,
		startTime,
		endTime,
		timeZone,
		slotCounselorIds
	}
	$.ajax({
		 type : "POST",
		 contentType : "application/json",
		 url : getURLForHTML('timeavailability','get-counselor-for-demo-book'),
		 data : JSON.stringify(data),
		 dataType : 'json',
		 async:true,
		 globle:false,
		 success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				var result = data['counselorList'];
				if($("#forAllCounselor").val() == 'true' && $("#counselorAutoSelect").val() != 'true'){
					var dropdown = $('#'+elementId);
					dropdown.html('');
					if(defaultOptinValue){
						dropdown.append('<option value="0">'+defaultOptinValue+'</option>');	
					}
					$.each(result, function(k, v) {
						dropdown.append('<option value="' + v.userId + '">' + v.userName + '</option>');
					});
				}else{
					var autoSelectCounselorIds = '';
					$.each(result, function(k, v) {
						autoSelectCounselorIds += v.userId+","
					});
					$("#autoSelectCounselorIds").val(autoSelectCounselorIds.slice(0,autoSelectCounselorIds.length-1,));
				}
			}
		 },
		error:function(e){
			customLoader(false);
		}
	});
}


function resetAllDateSpecificDayAndUserId(userId,dayId,prestartTime, preendTime, userRoleId, min, max, slotBufferLimit, slotDateLimit,  slotDayLimit){
    var request = { userId: userId, dayId:dayId, updatedBy: USER_ID};
    $.ajax({
        type: "POST",
        url: getURLFor('timeavailability', 'refresh-all-time-prefrence'),
        contentType: "application/json",
        data: JSON.stringify(request),
        dataType: 'json',
        cache: false,
        async: false,
        timeout: 600000,
        success: function (data) {
                //console.log(data);
            if (data['status'] == '0' || data['status'] == '2') {
                    showMessageTheme2(0, data['message'], '', true);
                } else {
                    showMessageTheme2(1, data['message'], '', true);
                    $(".resetAvailabilityConfirmationAction").removeClass("show");
                    getCalendarAvailability('timeAvailabilityPopup', userId,"timeCalendar","","Month", prestartTime, preendTime, userRoleId, min, max, slotBufferLimit, slotDateLimit,  slotDayLimit);
                    
                }
            return false;
        },
        error: function (e) {
            //showMessage(true, e.responseText);
            return false;
        }
    });
}
function resetAllDateSpecificByDayAndUserId(userId,dayId,prestartTime, preendTime, userRoleId, min, max, slotBufferLimit, slotDateLimit,  slotDayLimit){
    $(".resetAvailabilityConfirmationAction").addClass("show");
    $("#restAllDateSpecific").on('click',function(){
        resetAllDateSpecificDayAndUserId(userId,dayId,prestartTime, preendTime, userRoleId, min, max, slotBufferLimit, slotDateLimit,  slotDayLimit);
    });
    
}
function copyListViewTimeDropdownFun(){
	$('.dropdown-menu .copy-times' ).on( 'click', function( ) {
		return false;
	});
	var dayOptions = [];
		$( '.dropdown-menu label.day-type-label').on( 'click', function( event ) {
			var $disable = $(event.currentTarget),
				$isDisable = $disable.attr('for');
				if($("#"+$isDisable).prop("disabled")){
					return false;
				}
			$( '.day-list').each(function() {
				if($(this).is(":checked")){
					dayOptions.push($(this).val());
				}
			});
			var $target = $(event.currentTarget),
				val = $target.attr( 'data-value' ),
				dayNo=val.split("-"),
				dayNo=parseInt(dayNo[1]),
				$inp = $target.parent().find('input'),
				idx;
				// if($inp.is(':checked')){
				// 	dayOptions.push(val);
				// }
			if((idx = dayOptions.indexOf(val)) > -1) {
				dayOptions.splice( idx, 1 );
				setTimeout( function() {$inp.prop('checked', false)}, 0);
			}else {
				dayOptions.push(val);
				setTimeout( function() {$inp.prop('checked', true)}, 0);
			}
			$(event.target ).blur();
			//$(".eventTotal").text(dayOptions.length);
			return false;
		});
}