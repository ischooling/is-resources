function renderLeadDemoDashboardSchool(title, roleAndModule, schoolId, userId, role){
	var html =
		'<div class="app-container app-theme-white body-tabs-shadow fixed-header fixed-sidebar">'
			+dashboardHeaderContent()
			+'<div class="app-main">'
				+'<div class="col p-0">'
					+'<div class="app-main__inner pt-2">'
						+leadDemoDashboardContent(title, roleAndModule, schoolId, userId, role)
					+'</div>'
				+'</div>'
			+'</div>'
			+dashboardFooterContent()
		+'</div>'
		+loaderContent();
		$('body').html(html);

		getCalendarDemoAvailability('timeAvailabilityPopup',userId,"time-demo-calendar","","Week", '', '', USER_ROLE_ID, '0', '0', '0', '0','0');

		$("#timeDemoPreCalMonth").unbind('click').bind("click",  function(){
			var firstDatePreMonth=$("#timeDemoFirstDatePreMonth").val();
			getCalendarDemoAvailability('timeAvailabilityPopup',userId,"time-demo-calendar",""+firstDatePreMonth+"","Week",'', '', USER_ROLE_ID, '0', '0', '0', '0','0');
		  });
		  $("#timeDemoNextCalMonth").unbind('click').bind("click",  function(){
			var firstDateNextMonth=$("#timeDemoFirstDateNextMonth").val();
			getCalendarDemoAvailability('timeAvailabilityPopup',userId,"time-demo-calendar",""+firstDateNextMonth+"","Week",'', '', USER_ROLE_ID, '0', '0', '0', '0','0');
			
		});
}

function leadDemoDashboardContent(title, roleAndModule, schoolId, userId, role){
	var html = 
		'<div class="app-page-title mb-0 pb-4">'
			+'<div class="page-title-wrapper">'
				+'<div class="page-title-heading">'
					+'<div class="page-title-icon"><i class="pe-7s-users text-primary"></i></div>'
					+'<div>'
						// +'<span class="text-primary welcome-name-text">Welcome '+data.userFullName+'</span>'
						+'<div class="page-title-subheading">'+title+'</div>'
					+'</div>'
				+'</div>'
			+'</div>'
		+'</div>'
		+'<div class="main-card mb-3 card">'
			+'<div class="card-body py-1">'
			+'<div class="d-flex align-items-center check-top-header-touch flex-wrap">'
			+'<span type="button" class="badge btn-info mr-1" style="font-size-12px">Booked Slots</span>'
			+'<span type="button" class="badge  btn-warning mr-1" style="font-size-12px">Available Slots</span>'
			+'<div role="group" class="ml-auto mr-auto btn-group-lg btn-group btn-group-toggle" data-toggle="buttons">'
				+'<h3 class="d-flex align-items-center mb-0 position-relative">'
					+'<button type="button" id="timeDemoPreCalMonth" class="btn-icon btn-pill btn calendar-tabs py-0">'
					+'<i class="fa fa-angle-left" style="font-size:25px"></i> '
					+'</button>'
					+'<span id="timeDemoCalMonthYear" class="font-size-lg calendar-tabs "></span>'
					+'<button type="button" id="timeDemoNextCalMonth" class="btn-icon btn-pill btn calendar-tabs">'
						+'<i class="fa fa-angle-right" style="font-size:25px"></i> '
					+'</button>'
				+'</h3>'
			+'</div>'
		
			+'</div>'
			+'<div class="row">'
				+'<input type="hidden" name="weekCount" id="weekCount" value="" />'
				+'<input type="hidden" name="monthCount" id="monthCount" value="1" />'
				+'<input type="hidden" name="timeDemoToDayDate" id="timeDemoToDayDate" value="" />'
				+'<input type="hidden" name="timeDemoFirstDate" id="timeDemoFirstDate" value="" />'
				+'<input type="hidden" name="timeDemoFirstDatePreMonth" id="timeDemoFirstDatePreMonth" value="" />'
				+'<input type="hidden" name="timeDemoFirstDateNextMonth" id="timeDemoFirstDateNextMonth" value="" />'
				+'<input type="hidden" name="timeDemoZoneId" id="timeDemoZoneId" value="" />'
				+'<div id="time-demo-calendar" class="col-12 mb-1 mt-1 p-0 pb-2 not-radius overflow-y-auto" style="max-height:515px"></div>'
			+'</div>'
			+'</div>'
		+'</div>';
	return html;
}



async function dashboardHeaderContent(){
	var schoolSettingsLinks = await getSchoolSettingsLinks(SCHOOL_ID);
	var html=
		'<div class="sticky-header">'
			+'<div class="app-header header-shadow">'
				+'<div class="app-header__logo">'
					+'<a href="'+schoolSettingsLinks.schoolWebsite+'" target="blank" class="logo-src" style="background:url('+schoolSettingsLinks.logoUrl+SCRIPT_VERSION+');"></a>'
				+'</div>'
				+'<div class="app-header__logo"></div>'
			+'</div>'
		+'</div>';
	return html;
}

async function dashboardFooterContent(){
	var schoolSettingsTechnical = await getSchoolSettingsTechnical(SCHOOL_ID);
	var html=
	'<div class="app-wrapper-footer">'
		+'<div class="app-footer">'
			+'<div class="app-footer__inner">'
				+'<div class="col">'
					+'<p style="margin: 0">'+schoolSettingsTechnical.copyrightYear+' © '+schoolSettingsTechnical.copyrightUrl+'</p>'
				+'</div>'
			+'</div>'
		+'</div>'
		+'<div class="server-message">'
			+'<span class="msg" id="msgTheme2"></span>'
		+'</div>'
	+'</div>';
	return html;
}

function loaderContent(){
	var html=
	'<div id="commonloaderIdNewLoader" class="loader-wrapper d-flex justify-content-center align-items-center loader-style hide-loader">'
		// +'<div class="loader primary-border-top-color">'
		if(SCHOOL_ID==1){
			
			html+=`
				<img src="`+PATH_FOLDER_IMAGE2+`loader-new.gif" alt="`+SCHOOL_NAME+` Loader" class="new-loader-2024" />
			`
		}else{
			html+=
			'<div class="ball-rotate">'
				+'<div style="background-color: rgb(247, 185, 36);"></div>'
			+'</div>'
			+'<p>Loading ...</p>'
		}
		html+=
		// '</div>'
	+'</div>';
	return html;
}
function getCalendarDemoAvailability(formId, userId,elementId, startDate, slotType, prestartTime, preendTime, userRoleId, min, max, slotBufferLimit, slotDateLimit,  slotDayLimit) {
	var response=true;
	 customLoader(true);
	 var slotDisplyType='calendar'
	 var request = { userId:userId, lUserId:USER_ID, startDate: startDate, slotType: slotType, slotDisplyType:slotDisplyType, onlyCounts:'N'};
	 $.ajax({
		 type: "POST",
		 url: getURLFor('timeavailability', 'get-calendar-meeting-availability'),
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
				 response=false;
			 } else {
				 $("#"+elementId).html('');
				 var monthyear = data.monthName+' - '+data.year;
				 $("#timeDemoCalMonthYear").html(monthyear);
				 $("#timeDemoToDayDate").val(data.startDate);
				 $("#timeDEmoFirstDate").val(data.firstDate);
				 $("#timeDemoFirstDateNextMonth").val(data.firstDateNextMonth);
				 $("#timeDemoFirstDatePreMonth").val(data.firstDatePreMonth);
				 
 
				 var htmlss = getCalendarDemoAvailabilityTable(formId, userId, data);
				 $("#"+elementId).html(htmlss);
 
				 response=true;
			 }
			 customLoader(false);
			 //return false;
		 }
	 });
	 return response;
 }
 
 function getCalendarDemoAvailabilityTable(formId, userId, data){
	 console.log(data);
	 
	 var dayOfWeekVal = data.dayOfWeekVal;
	 var startDate=dayOfWeekVal;
	 var enabledDateList = data.calendarDateList;
	 var timeSlotList=data.timeSlotList;
	 var htmlCal = "";
	 htmlCal=htmlCal+'<table class="table table-bordered dt-responsive">';
	 htmlCal=htmlCal+'<thead><tr class="text-uppercase ">'
	 htmlCal=htmlCal+'<th style="top:0;left:0;z-index:1; width:5%" class="bold position-sticky bg-light"></th>';
	 htmlCal=htmlCal+'<th style="top:0;left:0;z-index:1; width:10%" class="bold position-sticky bg-light">Sun</th>';
	 htmlCal=htmlCal+'<th style="top:0;left:0;z-index:1; width:10%" class="bold position-sticky bg-light ">Mon</th>';
	 htmlCal=htmlCal+'<th style="top:0;left:0;z-index:1; width:10%" class="bold position-sticky bg-light ">Tue</th>';
	 htmlCal=htmlCal+'<th style="top:0;left:0;z-index:1; width:10%" class="bold position-sticky bg-light ">Wed</th>';
	 htmlCal=htmlCal+'<th style="top:0;left:0;z-index:1; width:10%" class="bold position-sticky bg-light ">Thu</th>';
	 htmlCal=htmlCal+'<th style="top:0;left:0;z-index:1; width:10%" class="bold position-sticky bg-light ">Fri</th>';
	 htmlCal=htmlCal+'<th style="top:0;left:0;z-index:1; width:10%" class="bold position-sticky bg-light ">Sat</th>';
	 htmlCal=htmlCal+'</tr>';
	 htmlCal=htmlCal+'</thead>';
	 htmlCal=htmlCal+'<tbody>';
	 htmlCal=htmlCal+'<tr>';
	 htmlCal=htmlCal+'<td style="top:0;left:0;z-index:1;" class="position-sticky">Time</td>';
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
		 var borderClass='';
		 var dates = enabledDateList[i];
		 var countryTimezone=dates.toTimeZone;
		var visitDate=dates.slotDate;
		var weekDayId=dates.weekDayId;
		//if(i==0){
			callFreeSlotsForCounselor(countryTimezone, visitDate, weekDayId, 5, "");
		//}
		 //var bookingTime =dates.bookingDateList;
		 //var availabilityTime =dates.availabilityDateList;
		 var holidayClass="";
		//  if(startDate==1 || startDate==7){
		// 	 holidayClass=dates.available==1?'selected-date':'active-date';
		//  }else 
		 
		 if(dates.isClick == 0){
			 holidayClass='expired-date';
		 }else if(dates.available == 1){
			 holidayClass='selected-date';
		 }else{
			 holidayClass='active-date';
		 }
		 if(startDate<=7){
			 //if(dates.isClick == 1){
				 var onSclick = "openCalendarMenuBtn(this, '"+dates.day1+"')";
				 if(dates.isClick == 1){
					 htmlCal=htmlCal+'<td style="top:0;left:0;z-index:1;" class="border-top-4 td-bg-white text-right  position-relative position-sticky '+holidayClass+'"  data-week-day="'+dates.slotDateId+'" id="week-date-'+i+'">';
				 }else{
					 htmlCal=htmlCal+'<td style="top:0;left:0;z-index:1;" class="td-bg-gray text-right position-relative position-sticky '+holidayClass+'" data-week-day="'+dates.slotDateId+'" id="week-date-'+i+'">';
				 }
				 if(dates.isClick == 1 && dates.timeCategory=='availability'){
					htmlCal=htmlCal+'<a href="javascript:void(0);" id="slotSelectDate'+dates.day1+'"  onclick="'+onSclick+'"  class="'+holidayClass+' d-inline-block">'+dates.day1+'</a>';	
				}else{
					htmlCal=htmlCal+dates.day1;
				}
				 htmlCal=htmlCal+'</td>'
			     startDate=startDate+1;
		 }
		 if(startDate>7){
			 startDate=1;
			 htmlCal=htmlCal+'</tr>';
		 }
	 }
	 htmlCal=htmlCal+'</tr>';
	 for (let i = 0; i < timeSlotList.length; i++) {
		var timedates = timeSlotList[i];
		let time24h = convertTo24Hour(timedates);
		time24h=time24h.replace(":","");

		htmlCal=htmlCal+'<tr>';
		htmlCal=htmlCal+'<td class="bold" style="font-size:12px;">'+timedates+'</td>';
		for (let d = 0; d < enabledDateList.length; d++) {
			var datess = enabledDateList[d];
			

			var calendarDemoList = datess.calendarDemoList;
			var tdSlotId=parseInt(datess.slotDateId+''+time24h);
			htmlCal=htmlCal+'<td id="'+datess.slotDateId+''+time24h+'">';
			htmlCal=htmlCal+'<div class="d-flex flex-wrap mb-1">';
				for (let t = 0; t < calendarDemoList.length; t++) {
					const demotime = calendarDemoList[t];
					
					var tdTiemSlotId=parseInt(demotime.meetingdemoid);
					if(tdSlotId>=tdTiemSlotId && tdSlotId<=tdTiemSlotId){
						let firstCharName = demotime.assignName.charAt(0).toUpperCase();
						htmlCal=htmlCal+'<div class="dropdown float-left btn-'+datess.slotDateId+''+time24h+'"> ';
						htmlCal=htmlCal+'<button type="button"  aria-haspopup="true" aria-expanded="false" data-toggle="dropdown" class="dropdown-toggle btn-info mr-1 cname-booking" style="font-size-11px">'+firstCharName+'</button>';
						htmlCal=htmlCal+'<div tabindex="-1" role="menu" aria-hidden="true" class="dropdown-menu-lg dropdown-menu" x-placement="bottom-start" style="position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(0px, 33px, 0px);">';
						htmlCal=htmlCal+'<div class="popover-body">'
						htmlCal=htmlCal+'<div class="dropdown-menu-header">';
						htmlCal=htmlCal+'<div class="bg-primary">';
						htmlCal=htmlCal+'<div class="menu-header-content"><h6 class="menu-header-title">'+demotime.assignName+'</h6></div>';
						htmlCal=htmlCal+'</div>';
						htmlCal=htmlCal+'</div>';
						htmlCal=htmlCal+'<ul class="nav flex-column">';
						htmlCal=htmlCal+'<li class="nav-item"><b>Time:</b> '+demotime.startTime+' - '+demotime.endtime+'</li>';
						htmlCal=htmlCal+'<li class="nav-item"><b>Lead No:</b> '+demotime.leadNo+'</li>';
						htmlCal=htmlCal+'<li class="nav-item"><b>Demo With:</b> '+demotime.leadName+'</li>';
						htmlCal=htmlCal+'</ul>';
						htmlCal=htmlCal+'</div>';
						htmlCal=htmlCal+'</div>';
						htmlCal=htmlCal+'</div>';
					}
				}
			htmlCal=htmlCal+'</div>';
			htmlCal=htmlCal+'<div class="d-flex flex-wrap" id="div'+datess.slotDateId+''+time24h+'"></div>';
			htmlCal=htmlCal+'</td>';
		}
		htmlCal=htmlCal+'</tr>';
	 }
	 htmlCal=htmlCal+'</tbody>  ';                
	 htmlCal=htmlCal+'</table>';
	
 
	 return htmlCal;
 }



function callFreeSlotsForCounselor(countryTimezone, visitDate, dayId, eventId, userId) {
	//	hideMessage('');
	
	var data = {}
	data['timezone'] = countryTimezone;
	data['visitDate'] = visitDate;
	data['dayId'] = dayId;
	data['eventId']=eventId;
	data['userId']=userId;
	console.log(data);
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLForHTML('timeavailability', 'get-slots-to-book-event'),
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
				var slotShowMsg=true;
				var slot="";
				
				if(data.slotList.length>=1){
					
					$.each(data.slotList, function(key, item){
						if(item.length>0){
							slotShowMsg=false;
							$.each(item, function(index, itemList){
								var cnameArr =[];
								var trl = $("#"+itemList.meetingDateId+" .btn-"+itemList.meetingDateId);
								trl.each(function(index, tr) { 
									//console.log(index);
									//console.log(tr);
									//console.log($(tr).find(".cname-booking").text());
									cnameArr.push($(tr).find(".cname-booking").text());
								 });
								
								//console.log(itemList);
								var htmlCal='';
								let firstCharName = itemList.counselorName.charAt(0).toUpperCase();
								let result = cnameArr.filter(num => num === firstCharName);
								 if(result.length==0){
									 htmlCal=htmlCal+'<div class="dropdown float-left"> ';
									 htmlCal=htmlCal+'<button type="button"  aria-haspopup="true" aria-expanded="false" data-toggle="dropdown" class="dropdown-toggle btn-warning mr-1" style="font-size:11px">'+firstCharName+'</button>';
									 htmlCal=htmlCal+'<div tabindex="-1" role="menu" aria-hidden="true" class="dropdown-menu-lg dropdown-menu" x-placement="bottom-start" style="position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(0px, 33px, 0px);">';
									 htmlCal=htmlCal+'<div class="popover-body">'
									 
									 htmlCal=htmlCal+'<div class="dropdown-menu-header">';
									 htmlCal=htmlCal+'<div class="bg-warning">';
									 htmlCal=htmlCal+'<div class="menu-header-content"><h6 class="menu-header-title">'+itemList.counselorName+'</h6></div>';
									 htmlCal=htmlCal+'</div>';
									 htmlCal=htmlCal+'</div>';
									 
									 htmlCal=htmlCal+'</div>';
									 htmlCal=htmlCal+'</div>';
									 htmlCal=htmlCal+'</div>';
									 $("#div"+itemList.meetingDateId).append(htmlCal);
								 }
							});
						}
					});
				}else{
					
				}
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