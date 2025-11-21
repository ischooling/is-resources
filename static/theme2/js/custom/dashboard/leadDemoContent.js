

async function renderMeetingTimeDashboard(title, roleAndModule, SCHOOL_ID,USER_ID,USER_ROLE){
	//var urlLead = "lead-list?moduleId=" +roleAndModule.moduleId + "&leadFrom=LEAD&clickFrom=list&startDate=&endDate=&country=0&campaign=&currentPage=0&euid=" +ENCRYPTED_USER_ID +"&leadType=" +LEAD_CATEGORY
	ROLE_MODULE=roleAndModule;
    var html=leadDemoDashboardContent(title, roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE)
    $('#dashboardContentInHTML').html(html);
	getCalendarDemoAvailability('timeAvailabilityPopup',0,"time-demo-calendar","","Day", '', '', USER_ROLE_ID, '0', '0', '0', '0','0');

	$("#timeDemoPreCalMonth").unbind('click').bind("click",  function(){
		var firstDatePreMonth=$("#timeDemoFirstDatePreMonth").val();
		var slectuserId=$("#assignToSearch").val();
        var slottype=$("#searchDaywiseDemo").val();
		getCalendarDemoAvailability('timeAvailabilityPopup',slectuserId,"time-demo-calendar",""+firstDatePreMonth+"",""+slottype+"",'', '', USER_ROLE_ID, '0', '0', '0', '0','0');
	});
	$("#timeDemoNextCalMonth").unbind('click').bind("click",  function(){
		var firstDateNextMonth=$("#timeDemoFirstDateNextMonth").val();
		var slectuserId=$("#assignToSearch").val();
        var slottype=$("#searchDaywiseDemo").val();
		getCalendarDemoAvailability('timeAvailabilityPopup',slectuserId,"time-demo-calendar",""+firstDateNextMonth+"",""+slottype+"",'', '', USER_ROLE_ID, '0', '0', '0', '0','0');
		
	});
	$("#assignToSearch").select2({
        theme:"bootstrap4",
        dropdownParent:"#demoSearchForm"
    });
	callLeadAssignUserList('demoSearchForm','B2C','assignToSearch', true, true, USER_ID);
	$("#dataDemoStartDate").datepicker({
            format : 'dd-mm-yyyy',
            autoclose: true,
    });
	// $("#searchDaywiseDemo").on("change",  function(){
	// 	var slottype=$("#searchDaywiseDemo").val();
	// 	getCalendarDemoAvailability('timeAvailabilityPopup',USER_ID,"time-demo-calendar","",""+slottype+"", '', '', USER_ROLE_ID, '0', '0', '0', '0','0');
	// });

	$("#searchDaywiseDemo").on("change", function(){
		var slectuserId=$("#assignToSearch").val();
        if($("#searchDaywiseDemo").val()=='CUSTOM'){
            $(".hidestudentdate").css({"display":"block"});
        }else{
            $(".hidestudentdate").css({"display":"none"})
            var slottype=$("#searchDaywiseDemo").val();
			if(slottype!="CUSTOM"){
				getCalendarDemoAvailability('timeAvailabilityPopup',slectuserId,"time-demo-calendar","",""+slottype+"", '', '', USER_ROLE_ID, '0', '0', '0', '0','0');
			}
        }
    });
	$("#assignToSearch").on("change", function(){
		var startDate='';
		var slectuserId=$("#assignToSearch").val();
        var slottype=$("#searchDaywiseDemo").val();
		if($("#dataDemoStartDate").val()!='' && $("#dataDemoStartDate").val()!=undefined){
			startDate = $("#dataDemoStartDate").val();
			startDate=startDate.split("-")[2]+'-'+startDate.split("-")[1]+'-'+startDate.split("-")[0];
			slottype="Day";
		}
		getCalendarDemoAvailability('timeAvailabilityPopup',slectuserId,"time-demo-calendar","",""+slottype+"", '', '', USER_ROLE_ID, '0', '0', '0', '0','0');
            
    });

	$("#btnDemoWiseSubmit").on("click",function(){
		var startDate='';
		var slectuserId=$("#assignToSearch").val();
		var slottype=$("#searchDaywiseDemo").val();
        if($("#dataDemoStartDate").val()=='' && $("#dataDemoStartDate").val()==undefined){
            showMessageTheme2(1, 'Please choose  date','',true);
                return false;
        }else{
			startDate = $("#dataDemoStartDate").val();
			startDate=startDate.split("-")[2]+'-'+startDate.split("-")[1]+'-'+startDate.split("-")[0];
		}
		slottype="Day";
		getCalendarDemoAvailability('timeAvailabilityPopup',slectuserId,"time-demo-calendar",startDate,""+slottype+"", '', '', USER_ROLE_ID, '0', '0', '0', '0','0');
    });

}




async function renderLeadDemoDashboardSchool(title, roleAndModule, schoolId, userId, role){
	var html =
		'<div class="app-container app-theme-white body-tabs-shadow fixed-header fixed-sidebar">'
			+ await dashboardHeaderContent()
			+'<div class="app-main">'
				+'<div class="col p-0">'
					+'<div class="app-main__inner">'
						+leadDemoDashboardContent(title, roleAndModule, schoolId, userId, role)
					+'</div>'
				+'</div>'
			+'</div>'
			+await dashboardFooterContent()
		+'</div>';
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
		'<div class="app-page-title mb-3 py-2">'
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
			+'<div class="card-body">'
			
			
			+'<div class="row">'
			+'<div class="col-12">'
			+'<div class="w-100" style="gap:0.5rem">'
				+' <form action="javascript:void(0);" class="d-flex align-items-center flex-wrap justify-content-end" id="demoSearchForm" name="demoSearchForm" autocomplete="off">'
					+'<div class="w-fit-content mr-2" style="width:250px !important">'
						+'<select name="assignToSearch" id="assignToSearch" class="form-control" style="width:fit-content"></select>	'	
					+'</div>'
					+'<div class="w-fit-content">'
						+'<select class="form-control mr-1" id="searchDaywiseDemo" name="searchDaywiseDemo" style="width:fit-content">'
							+'<option value="Day">Today</option>'
							+'<option value="Week">Week</option>'
							+'<option value="CUSTOM" >Custom</option>'
						+'</select>'
					+'</div>'
					+'<div class="hidestudentdate">'
						+'<div class="d-flex align-items-center flex-wrap" style="gap:0.5rem">'
							+'<div class="d-inline-flex align-items-center flex-wrap" style="gap:0.5rem">'
								+'<input type="text" name="dataDemoStartDate" class="form-control form-control-sm" id="dataDemoStartDate" placeholder="Start Date" style="width:100px" readonly onkeydown="return false" /> '
							+'</div>'
							+'<button class="btn btn-primary" id="btnDemoWiseSubmit">Submit</button>'
						+'</div>'
					+'</div>'
				+'</form>'
				+'<div class="row w-fit-content ml-1">'
			+'<div class=" text-primary font-weight-bold bg-white px-3 py-2 border shadow rounded-10 mr-3" id="demoWebsite"></div>'
			+'<div class="text-primary font-weight-bold bg-white px-3 py-2 border shadow rounded-10 mr-3" id="demoLinksite"></div>'
			+'<div class="text-primary font-weight-bold bg-white px-3 py-2 border shadow rounded-10" id="demoInvalidsite"></div>'
			+'</div>'
			+'</div>'
			+'</div>'
			+'</div>'
			+'<div class="d-flex align-items-center mt-3 check-top-header-touch flex-wrap">'
				+'<span type="button" class="badge btn-primary mr-1" style="font-size-12px">Booked Slots</span>'
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
					+ `<p style="margin:0">${schoolSettingsTechnical.isCoPoweredBy != null ? 'Powered by ' + schoolSettingsTechnical.copyrightName : 'Copyright © ' + schoolSettingsTechnical.copyrightYear + ' - ' + schoolSettingsTechnical.copyrightName + ' - All Rights Reserved.'}</p>`
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
		
	 console.log(request);

	 $.ajax({
		 type: "POST",
		 url: getURLFor('timeavailability', 'get-calendar-meeting-availability'),
		 contentType: APPLICATION_JSON_VALUE,
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
				 var dayDate=data.today.split("-")[2];
				 var monthyear = data.monthName+' - '+data.year;
				 if(data.slotType=='Day'){
					monthyear= dayDate+' - '+monthyear;
				 }
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
	 //console.log(data);
	 
	 var dayOfWeekVal = data.dayOfWeekVal;
	 var startDate=dayOfWeekVal;
	 var enabledDateList = data.calendarDateList;
	 var timeSlotList=data.timeSlotList;
	 $("#demoWebsite").html('<span style="color:#7000FF" >Demo By Website : '+data.webTotal+'</span>');
	 $("#demoLinksite").html('<span style="color:#0051FF" >Demo By Link : '+data.copyTotal+'</span>');
	 $("#demoInvalidsite").html('<span class="text-danger" >Invalid Demo : '+data.invalidTotal+'</span>');

	 var htmlCal = "";
	 htmlCal=htmlCal+'<table class="table table-bordered dt-responsive">';
	 htmlCal=htmlCal+'<thead><tr class="text-uppercase ">';
	 htmlCal=htmlCal+'<th style="top:0;left:0;z-index:1; width:12%" class="bold position-sticky bg-light"></th>';
	if(data.slotType=='Day'){
		if(data.dayOfWeekVal==1){
			htmlCal=htmlCal+'<th style="top:0;left:0;z-index:1; width:88%" class="bold position-sticky bg-light">Sun</th>';
		}else if(data.dayOfWeekVal==2){
			htmlCal=htmlCal+'<th style="top:0;left:0;z-index:1; width:88%" class="bold position-sticky bg-light ">Mon</th>';
		}else if(data.dayOfWeekVal==3){
			htmlCal=htmlCal+'<th style="top:0;left:0;z-index:1; width:88%" class="bold position-sticky bg-light ">Tue</th>';
		}else if(data.dayOfWeekVal==4){
			htmlCal=htmlCal+'<th style="top:0;left:0;z-index:1; width:88%" class="bold position-sticky bg-light ">Wed</th>';
		}else if(data.dayOfWeekVal==5){
			htmlCal=htmlCal+'<th style="top:0;left:0;z-index:1; width:88%" class="bold position-sticky bg-light ">Thu</th>';
		}else if(data.dayOfWeekVal==6){
			htmlCal=htmlCal+'<th style="top:0;left:0;z-index:1; width:88%" class="bold position-sticky bg-light ">Fri</th>';
		}else if(data.dayOfWeekVal==7){
			htmlCal=htmlCal+'<th style="top:0;left:0;z-index:1; width:88%" class="bold position-sticky bg-light ">Sat</th>';
		}
	}else{
		htmlCal=htmlCal+'<th style="top:0;left:0;z-index:1; width:10%" class="bold position-sticky bg-light">Sun</th>';
		htmlCal=htmlCal+'<th style="top:0;left:0;z-index:1; width:10%" class="bold position-sticky bg-light ">Mon</th>';
		htmlCal=htmlCal+'<th style="top:0;left:0;z-index:1; width:10%" class="bold position-sticky bg-light ">Tue</th>';
		htmlCal=htmlCal+'<th style="top:0;left:0;z-index:1; width:10%" class="bold position-sticky bg-light ">Wed</th>';
		htmlCal=htmlCal+'<th style="top:0;left:0;z-index:1; width:10%" class="bold position-sticky bg-light ">Thu</th>';
		htmlCal=htmlCal+'<th style="top:0;left:0;z-index:1; width:10%" class="bold position-sticky bg-light ">Fri</th>';
		htmlCal=htmlCal+'<th style="top:0;left:0;z-index:1; width:10%" class="bold position-sticky bg-light ">Sat</th>';
	}

	 htmlCal=htmlCal+'</tr>';
	 htmlCal=htmlCal+'</thead>';
	 htmlCal=htmlCal+'<tbody>';
	 htmlCal=htmlCal+'<tr>';
	 htmlCal=htmlCal+'<td style="top:0;left:0;z-index:1;" class="position-sticky">Time ('+data.timeZone.replace('/',' | ')+')</td>';
	 if(data.slotType=='Day'){

	 }else{
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
	 }
	 for (let i = 0; i < enabledDateList.length; i++) {
		 var borderClass='';
		 var dates = enabledDateList[i];
		 var countryTimezone=dates.toTimeZone;
		var visitDate=dates.slotDate;
		var weekDayId=dates.weekDayId;
		var slUserId=$("#assignToSearch").val();
		//if(i==0){
			callFreeSlotsForCounselor(countryTimezone, visitDate, weekDayId, 5, slUserId);
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
		var timedates1 = (timeSlotList.length-1)!=i?timeSlotList[i+1]:'12:00 AM';
		let time24h = convertTo24Hour(timedates);
		time24h=time24h.replaceAll(":","");

		htmlCal=htmlCal+'<tr>';
		htmlCal=htmlCal+'<td class="bold" style="font-size:12px;"><span class="p-1 mb-1 mr-1 text-center font-weight-semi-bold d-inline-block text-primary border border-primary rounded-5 font-12">'+timedates+' - '+timedates1+'</span></td>';
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
						let firstCharName = demotime.assignName.substring(0, 2).toUpperCase();
						// if(data.slotType=='Day'){
						// 	firstCharName = demotime.assignName;
						// }
						htmlCal=htmlCal+'<div class="dropdown float-left btn-'+datess.slotDateId+''+time24h+'"> ';
						htmlCal=htmlCal+'<button type="button"  aria-haspopup="true" aria-expanded="false" data-toggle="dropdown" class="dropdown-toggle  mr-1 cname-booking '+(demotime.invalidLead==1?'bg-danger':'btn-primary')+'" style="font-size-11px">'+firstCharName+'</button>';
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
	//console.log(data);
	$.ajax({
		type: "POST",
		contentType: APPLICATION_JSON_VALUE,
		url: getURLForHTML('timeavailability', 'get-slots-to-book-event'),
		data: JSON.stringify(data),
		dataType: 'json',
		global:false,
		async:true,
		success: function (data) {
			//console.log(data);
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
								let firstCharName = itemList.counselorName.substring(0, 2).toUpperCase();
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