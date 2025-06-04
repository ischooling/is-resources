
var schoolSettingsLinks;
(async function() {
    schoolSettingsLinks = await getSchoolSettingsLinks(SCHOOL_ID);
})();


function renderCounselorCotent(data){
	$("#timeAvailabilityUIContent").html(getCounselorCotent(data)+customLoaderContent()+serverMessageContent());
	callLocationDetails('meetingBookSlotForm');
	$('.time-slot-radio').change(function() {
		$('.custom-btn').hide();
		$(this).siblings('.custom-btn').show();
	});

	$("#meetingPreCalMonth").unbind('click').bind("click", function(){
		var firstDatePreMonth=$("#meetingFirstDatePreMonth").val();
		getTimeZonesList("bookSlotForEventForm","countryTimezoneId","meetingZoneId",firstDatePreMonth)+' 00:00:00';
		getCalendarForMeeting("bookMeetingCalendar",""+firstDatePreMonth+"","Month", $("#meetingZoneId").val());
	});
	$("#meetingNextCalMonth").unbind('click').bind("click", function(){
		var firstDateNextMonth=$("#meetingFirstDateNextMonth").val();
		getTimeZonesList("bookSlotForEventForm","countryTimezoneId","meetingZoneId",firstDateNextMonth+' 00:00:00');
		getCalendarForMeeting("bookMeetingCalendar",""+firstDateNextMonth+"","Month", $("#meetingZoneId").val());
	});
	getTimeZonesList("bookSlotForEventForm","countryTimezoneId","meetingZoneId",changeDateFormat(new Date(),'yyyy-mm-dd hh:mm:ss'));
	
	$("#bookSlotForEventForm #countryTimezoneId").on('change', function(){
		$(".slot-wrapper").hide();
		$("#bookSlotForEventForm #meetingZoneId").val($(this).val());
		var selectDate=$("#meetingTodayDate").val();
		getCalendarForMeeting("bookMeetingCalendar",""+selectDate+"","Month", ""+$(this).val()+"");
	});
	$("#countryTimezoneId").select2({
		theme:"bootstrap4",
		placeholder:"Select Time Zone"
	})
	
	$("#meetingBookSlotForm #gradeId").select2({
		theme:"bootstrap4"
	});
	getAllCountryList('meetingBookSlotForm','countryId');
	$("#meetingBookSlotForm #countryId").select2({
		theme:"bootstrap4"
	});
	$('.scrollbar-container').each(function () {
		const ps = new PerfectScrollbar($(this)[0], {
			wheelSpeed: 2,
			wheelPropagation: false,
			minScrollbarLength: 20
		});
	});
	$('#phoneNo').on('input', function(e) {
		inputNumberValidation(e)
	});
	var windowWidth = $(window).width();
	if(windowWidth < 990 && $("#meetingBookSlotForm").css("display") == "none"){
		$(".meeting-details").addClass("order-2");
		$(".meeting-details").removeClass("order-0");
		$(".hide-div-according-to-condition").hide();
	}else{
		$(".meeting-details").removeClass("order-2");
		$(".meeting-details").addClass("order-0");
		$(".hide-div-according-to-condition").show();
	}
	$("#counselorLeadSource").select2({
		theme:"bootstrap4",
	})
	getLeadSourceList('meetingBookSlotForm','counselorLeadSource');
	// setTimeout(function() {
	// 	if($("#meetingBookSlotForm #location").val()!=undefined 
	// 		&& $("#meetingBookSlotForm #location").val()!=''){
	// 		var location = JSON.parse($("#meetingBookSlotForm #location").val());
	// 		$("#bookSlotForEventForm #meetingZoneId").val(location.timezone);
	// 		getCalendarForMeeting("bookMeetingCalendar","","Month", location.timezone);
	// 	}
	// }, 1000);
	

}
function getLocationAndSelectCountry(formId, uiData) {
	console.log(formId);
	$.ajax({
		global: false,
		type: "GET",
		url: PRO_IP_API_URL,
		success: function (data) {
			renderCounselorCotent(uiData);
			getLocationAndSelectCountryFill(formId, data, uiData)
		},
		error: function(e){
			if (checkonlineOfflineStatus()) {
				return;
			}
		}
	});
}

function getLocationAndSelectCountryFill(formId, data, uiData) {
	if (data != undefined && data != '') {
		if ($("#" + formId + " #countryTimezoneId").length) {
			if(uiData.sendUserEmail){
				if(uiData.newFormateTimeZone!=""){
					$('#countryTimezoneId').val(uiData.newFormateTimeZone).trigger('change')	
				}else{
					$('#countryTimezoneId').val(data.timezone).trigger('change')
				}
			}else{
				$('#countryTimezoneId').val(data.timezone).trigger('change')
			}
		}
		$('#countryId').val(data.country);//.trigger('change')
		$("#location").val(JSON.stringify(data));
		//getCalendarForMeeting("bookMeetingCalendar","","Month", ""+data.timezone+"");
	}
}




function skeleton(){
	var html=
		'<div class="app-container" id="skeletonTimeavailability">'
			+'<div class="app-main">'
				+'<div class="app-main__inner m-auto px-0">'
					+'<div class="col-xl-10 col-lg-12 col-md-12 col-sm-12 col-12 px-md-3 px-0 mr-auto ml-auto  mt-md-4 mt-0 mb-4">'
						+'<h4 class="text-center font-weight-bold skeleton mb-2" style="width:100%;max-width:100%; height:25px;"></h4>'
						+'<div class="text-center mb-2"><h4 class="text-center font-weight-bold skeleton d-inline-block" style="width:100%;max-width:250px; height:25px;"></h4></div>'
						+'<div class="d-flex card flex-row counselor-slot-ui-flex">'
							+skeletonleftSide()
							+skeletonleftright()
						+'</div>'
					+'</div>';
				+'</div>'
			+'</div>'
		+'</div>';
	return html;
}

function skeletonleftSide(){
	var html = 
		'<div class="counselor-slot-ui-column border-right pr-0 meeting-details">'
			+'<div class="full text-center p-4 border-bottom mt-4">'
				+'<div class="form-holder skeleton d-inline-block" style="width:100%;max-width:300px; height:35px;"></div>'
			+'</div>'
			+'<div class="full py-sm-4 px-4 pt-2 pb-0">'
				+'<div class="full">'
					+'<div class="form-holder skeleton mb-2" style="width:100%;max-width:300px;height:25px;"></div>'
					// +'<div class="form-holder skeleton" style="width:100%;max-width:200px;height:30px;"></div>'
				+'</div>'
				+'<div class="full mt-3">'
					+'<span class="meeting-duration text-gray font-weight-semi-bold full mb-3">'
						+'<div class="form-holder skeleton" style="width:100%;max-width:200px;height:25px;"></div>'
					+'</span>'
					+'<span class="meeting-date-and-time text-gray font-weight-semi-bold full mb-3" style="display: none;">'
						+'<div class="form-holder skeleton" style="width:100%;max-width:100px;height:25px;"></div>'
					+'</span>'
					+'<span class="meeting-time-zone text-gray font-weight-semi-bold full mb-3" style="display: none;">'
						+'<div class="form-holder skeleton" style="width:100%;max-width:100px;height:25px;"></div>'
					+'</span>'
					+'<div class="mb-2 skeleton mb-2" style="width:100%;height:25px;"></div>'
					+'<ul class="m-0 pl-0">'
						+'<li class="skeleton mb-1" style="width:100%;height:20px;"></li>'
						+'<li class="skeleton mb-1" style="width:100%;height:20px;"></li>'
						+'<li class="skeleton mb-1" style="width:100%;height:20px;"></li>'
						+'<li class="skeleton mb-1" style="width:100%;height:20px;"></li>'
						+'<li class="skeleton mb-1" style="width:100%;height:20px;"></li>'
						+'<li class="skeleton mb-1" style="width:100%;height:20px;"></li>'
						+'<li class="skeleton mb-1" style="width:100%;height:20px;"></li>'
					+'</ul>'
					+'<div class="skeleton my-2" style="width:100%;height:40px;"></div>'
					+'<div class="skeleton mt-1" style="width:100%;height:40px;"></div>'
				+'</div>'
			+'</div>'
		+'</div>';
	return html;
}

function skeletonleftright(){
	var html = 
		'<div class="counselor-slot-ui-column pb-4 date-picker-wrapper">'
			+'<form id="bookSlotForEventForm">'
				+'<div class="date-calendar">'
					+'<div class="full py-sm-4 px-4 pt-3">'
						+'<div class="form-holder skeleton" style="width:100%;max-width:200px;height:30px;"></div>'
					+'</div>'
					+'<div class="full px-4 pt-2 mt-2">'
						+'<h6 class="font-weight-bold text-black">'
							+'<div class="form-holder skeleton" style="width:100%;max-width:200px; height:30px;"></div>'
						+'</h6>'
						+'<div class="form-holder skeleton mt-2" style="height:30px;"></div>'
					+'</div>'
					+'<div class="full px-4 pt-3">'
						+'<div class="row">'
							+'<div>'
								+'<h3 class="cal-title font-12px">'
									+'<div class="form-holder skeleton" style="width:100%;max-width:200px;height:30px;"></div>'
								+'</h3>'
							+'</div>'
							+'<div class="arrowBtn ml-auto">'
								+'<button type="button"  class="mb-2 mr-2 btn-icon btn-pill btn" >'
									+'<div class="form-holder skeleton" style="width:100%;max-width:30px;height:30px;"></div>'
								+'</button>'
								+'<button type="button"  class="mb-2 mr-2 btn-icon btn-pill btn" >'
									+'<div class="form-holder skeleton" style="width:100%;max-width:30px;height:30px;"></div>'
								+'</button>'
							+'</div>'
						+'</div>'
					+'</div>'
					+calenderSkeleton()
				+'</div>'
			+'</form>'
		+'</div>';
	return html;
}

function calenderSkeleton(){
	var html='<div class="form-holder skeleton" style="height:318px;"></div>';
	return html;
}

function thankyouPageSkeleton(){
	var html=
			'<div class="col-xl-6 col-lg-7 col-md-10 col-sm-12 col-12 px-md-3 px-0 mr-auto ml-auto mt-md-5 mt-0 mb-4" id="thankyouPageSkeleton" style="display:none">'
				+'<div class="d-flex card flex-row counselor-slot-ui-flex">'
					+'<div class="w-100 p-4">'
						+'<div class="full text-center">'
							+'<div class="form-holder skeleton d-inline-block" style="width:100%;max-width:300px; height:30px;"></div>'
						+'</div>'
						+'<div class="full text-center my-4">'
							+'<div class="form-holder skeleton d-inline-block" style="width:100%;max-width:300px; height:30px;"></div>'
							+'<div class="form-holder skeleton d-inline-block mt-2" style="width:100%;max-width:400px; height:30px;"></div>'
						+'</div>'
						+'<div class="full px-4">'
							+'<div class="full">'
								+'<ul class="p-3 m-0 border rounded-10">'
									+'<li>'
										+'<div class="form-holder skeleton d-inline-block mb-2" style="width:100%;max-width:200px; height:30px;"></div>'
									+'</li>'
									+'<li>'
										+'<div class="form-holder skeleton d-inline-block mb-2" style="width:100%;max-width:200px; height:30px;"></div>'
									+'</li>'
									+'<li>'
										+'<div class="form-holder skeleton d-inline-block mb-2" style="width:100%;max-width:200px; height:30px;"></div>'
									+'</li>'
									+'<li class="mb-0">'
										+'<div class="form-holder skeleton d-inline-block mb-2" style="width:100%;max-width:200px; height:30px;"></div>'
									+'</li>'
								+'</ul>'
							+'</div>'
						+'</div>'
					+'</div>'
				+'</div>'
			+'</div>'
		return html;
}


function getCounselorCotent(data){
	console.log(data);
	var html = 
		'<div class="app-container">'
			+'<div class="app-main">'
				+'<div class="app-main__inner m-auto px-0">'
				if(data.thanksStaus=='N'){
					if(data.leadType!=undefined && data.leadType=='B2B'){
						html+='';
					}else{
						if(data.timePreferenceSlotName == 'Interview'){
							html+='';
						}else{
							html+='<h4 class="text-center font-weight-bold px-3 bg-primary-gradient text-white py-3">Book Your FREE Live School Demo</h4>';
						}
						
					}
				}
				if(data.thanksStaus=='N'){
					html+='<div class="col-xl-10 col-lg-12 col-md-12 col-sm-12 col-12 px-md-3 px-0 mr-auto ml-auto  mt-md-4 mt-0 mb-4" id="meetingScheduleform">';
					if(data.leadType!=undefined && data.leadType=='B2B'){
						html+='';
					}
					
					html+='<div class="d-flex card flex-row counselor-slot-ui-flex">'
							+getCounselorMeetingDetailsCotent(data)
							+getCounselorDatePickerCotent(data)
							+getCounselorScheduleEventCotent(data)
							+getCounselorSlotCotent(data)
						+'</div>'
					+'</div>';
				}else{
					html+=thankyouPageContent(data)
				}
				html+=thankyouPageSkeleton()	
				+'</div>'
			+'</div>'
		+'</div>';
	return html;
}

function getCounselorMeetingDetailsCotent(data){
	var firstName = '';
	if(data.forAllCounselor == 'false'){
		firstName = data.userName.split(" ");
		firstName = firstName[0];
	}
	var html = 
		'<div class="counselor-slot-ui-column border-right pr-0 meeting-details order-lg-0 order-2">'
			+'<div class="back-btn-to-change-date" onclick="backToReschedule()">'
				+'<i class="fa fa-arrow-left"></i>'
			+'</div>'
			+'<div class="w-100 text-center p-4 border-bottom mt-4 hide-div-according-to-condition">'
				+'<a href="'+schoolSettingsLinks.schoolWebsite+'" target="blank" class="d-inline-block mb-4">'
					+'<img src="'+schoolSettingsLinks.logoUrl+''+SCRIPT_VERSION+'" style="max-width: 300px;width: 100%;" />'
				+'</a>'
			+'</div>'
			+'<div class="full py-sm-4 px-4 pt-2 pb-0">'
		// 		+'<div class="full">';
		// 		if(data.leadType!=undefined && data.leadType=='B2B'){
		// 			html += '<label class="name font-weight-bold text-dark font-size-lg cName">'+data.timePreferenceSlotName+'</label>';
		// 		}else{
		// 			if(data.forAllCounselor == 'true'){
		// 				html += '<label class="name font-weight-bold text-dark font-size-lg cName">'+data.timePreferenceSlotName+' with Counselor </label>';
		// 			}else{
		// 				if(data.demoRoleId == 0){
		// 					html += '<label class="name font-weight-bold text-dark font-size-lg cName">'+data.timePreferenceSlotName+' with Counselor </label>';
		// 				}else{
		// 					html += '<label class="name font-weight-bold text-dark font-size-lg cName">'+data.timePreferenceSlotName+' with '+data.userName+'</label>';
		// 				}
		// 			}
		// 		}
		// 			// +'<h3 class="font-weight-bold text-black partner-discussion">'+data.timePreferenceSlotName+'</h3>'
		// html += '</div>'
				+'<div class="full mt-3">'
					+'<span class="meeting-duration text-gray font-weight-semi-bold full  mb-3 ">'
						+'<div class="d-flex align-items-top flex-wrap">'
							+'<span class="font-weight-bold text-dark font-size-lg"><i class="fa fa-clock mr-1" style="line-height:22px"></i>Duration:</span>'
							+'<label class="m-0 ml-1  font-weight-bold text-dark font-size-lg" id="meetingTimeDuration">'+data.timeDuration+' minutes</label>'
						+'</div>'
					+'</span>'
					+'<span class="meeting-date-and-time text-gray font-weight-semi-bold full  mb-3 " style="display: none;">'
						+'<div class="d-flex align-items-top flex-wrap">'
							+'<span><i class="fa fa-calendar mr-1" style="line-height:22px"></i>Selected Date & Time: </span>'
							+'<label class="m-0 ml-1" id="meetingTimeAndDate"></label>'
						+'</div>'
					+'</span>'
					+'<span class="meeting-time-zone text-gray font-weight-semi-bold full  mb-3 " style="display: none;">'
						+'<div class="d-flex align-items-top flex-wrap">'
							+'<span><i class="fa fa-globe mr-1" style="line-height:22px"></i>Selected Time Zone: </span>'
							+'<label class="m-0 ml-1" id="meetingSelectTimeZone"></label>'
						+'</div>'
					+'</span>';
					if(data.leadType!=undefined && data.leadType=='B2B'){}
					else if(data.timePreferenceSlotName == 'Interview'){}
					else{
						html += 
						'<div class="full hide-on-second-step rounded border p-3 mt-2">'
							+'<div class="mb-2 font-weight-bold text-primary" style="font-size:24px">Meet our Academic Counselor to know more:</div>';
							// if(data.forAllCounselor == 'true'){
							// 	html += '<div class="mb-2 font-weight-bold">During these '+data.timeDuration+' minutes, Counselor will cover the below-mentioned points:</div>';
							// }else{
							// 	if(data.demoRoleId == 0){
							// 		html += '<div class="mb-2 font-weight-bold">During these '+data.timeDuration+' minutes, Counselor will cover the below-mentioned points:</div>';
							// 	}else{
							// 		html += '<div class="mb-2 font-weight-bold">During these '+data.timeDuration+' minutes, '+data.userName+' will cover the below-mentioned points:</div>';
							// 	}
							// }
							// html += 
							// '<ol class="m-0 pl-3">'
							// 	+'<li>School Accreditation | Recognition | Approval</li>'
							// 	+'<li>School Curriculum</li>'
							// 	+'<li>Teaching Methods</li>'
							// 	+'<li>Assessment | Examination</li>'
							// 	+'<li>Transcripts | Certification awarded by the school</li>'
							// 	+'<li>Fee Structure</li>'
							// 	+'<li>Enrollment Process</li>'
							// +'</ol>';
							// if(data.forAllCounselor != 'true'){
							// 	if(data.demoRoleId == 0){
							// 	}else{
							// 		html += '<div class="my-2 text-justify">'+firstName+' is the best counselor to answer all your questions. You are welcome to ask any additional queries or information during the '+data.timePreferenceSlotName+'.</div>';
							// 	}
							// }
							// html += '<div class="mb-2 text-justify">Please be mindful that the '+data.timePreferenceSlotName+' is limited to 30 minutes. We look forward to meeting with you soon!</div>';
							html+=
							'<ul class="m-0 pl-0">'
								+'<li class="font-size-lg mb-2"><i class="fa fa-check-circle mr-1 text-success" style="line-height:22px"></i> 11 years of parents\' trust</li>'
								+'<li class="font-size-lg mb-2"><i class="fa fa-check-circle mr-1 text-success" style="line-height:22px"></i> 14000+ Students across 190+ countries</li>'
								+'<li class="font-size-lg mb-2"><i class="fa fa-check-circle mr-1 text-success" style="line-height:22px"></i> Trusted and recommended by thousands of parents</li>'
								+'<li class="font-size-lg mb-2"><i class="fa fa-check-circle mr-1 text-success" style="line-height:22px"></i> Fully Accredited | Approved | Recognized</li>'
							+'</ul>'
						html += '</div>';
					}
				html += '</div>'
			+'</div>'
			if(data.leadType!=undefined && data.leadType=='B2B'){}
			else{
				html += '<div class="full py-sm-4 px-4 pt-2 pb-0 font-20 bold" id="eventOffMessage"></div>';
			}

		html += '</div>';
	return html;
}

function getCounselorDatePickerCotent(data){
	var html = 
		'<div class="counselor-slot-ui-column pb-4 date-picker-wrapper">'
			+'<form id="bookSlotForEventForm">'
				+'<div class="w-100 text-center p-4 border-bottom mt-4 d-lg-none d-block">'
					+'<a href="'+schoolSettingsLinks.schoolWebsite+'" target="blank" class="d-inline-block mb-4">'
						+'<img src="'+schoolSettingsLinks.logoUrl+''+SCRIPT_VERSION+'" style="max-width: 300px;width: 100%;" />'
					+'</a>'
				+'</div>'
				+'<div class="date-calendar">'
					+'<div class="full pt-sm-4 px-4 pt-3">';
					if(data.forAllCounselor != 'true'){
						if(data.leadType!=undefined && data.leadType=='B2B'){
							html += '<h5 class="text-black font-weight-bold">Select the Date & Time for the Partnership Discussion</h5>';
						}else{
							if(data.timePreferenceSlotName == 'Interview'){
							html += '<h5 class="text-black font-weight-bold">Select the Date & Time for the Interview</h5>';
						}else{
							html += '<h5 class="text-black font-weight-bold">Select the Date & Time for the School Demo</h5>';
						}
						}
						
					}else{
						if(data.counselorAutoSelect == 'true'){
							html += '<h5 class="text-black font-weight-bold">Select Date & Time as per your availability</h5>';
						}else{
							if(data.sendUserName != null && data.sendUserName != undefined && data.sendUserName != ''){
								html += '<h5 class="text-black font-weight-bold">Select Date & Time for '+data.sendUserName+'</h5>';
							}else{
								html += '<h5 class="text-black font-weight-bold">Select Date & Time for the Lead</h5>';
							}
						}
					}
					html += '</div>'
					+'<div class="full px-4 pt-2 mt-2 mb-5">';
					if(data.forAllCounselor != 'true' || data.counselorAutoSelect == 'true'){
						html += '<h6 class="font-weight-bold text-black">Your current time zone is </h6>'
					}
				html += '<select name="countryTimezoneId" id="countryTimezoneId" class="form-control">'
						+'</select>'
					+'</div>'
					+'<div class="full px-4">'
						+'<div class="calender-nav d-none">'
							+'<div>'
							+'<h3 class="cal-title font-12px" id="meetingcalMonthYear"></h3>'
							+'</div>'
							+'<div class="arrowBtn ml-auto">'
								+'<button type="button" id="meetingPreCalMonth" class="mb-2 mr-2 btn-icon btn-pill btn" >'
									+'<i class="fa fa-angle-left" style="font-size:25px"></i> '
								+'</button>'
								+'<button type="button" id="meetingNextCalMonth" class="mb-2 mr-2 btn-icon btn-pill btn" >'
									+'<i class="fa fa-angle-right" style="font-size:25px"></i> '
								+'</button>'
							+'</div>'
						+'</div>'
						+'<input type="hidden" name="meetingTodayDate" id="meetingTodayDate" value="" />'
						+'<input type="hidden" name="meetingFirstDate" id="meetingFirstDate" value="" />'
						+'<input type="hidden" name="meetingFirstDatePreMonth" id="meetingFirstDatePreMonth" value="" />'
						+'<input type="hidden" name="meetingFirstDateNextMonth" id="meetingFirstDateNextMonth" value="" />'
						+'<input type="hidden" name="meetingZoneId" id="meetingZoneId" value="" />'
					+'</div>'
					// +'<input type="text" id="datepicker-input" style="height: 0px;width: 0px; visibility: hidden;">'
					+'<div class="full bookMeetingCalendar" id="date-wrapper" style="min-height:347px">'
						+calenderSkeleton()
					+'</div>'
				+'</div>'
			+'</form>'
		+'</div>';
	return html;
}
function getCounselorScheduleEventCotent(data){
	var html = 
		'<div class="counselor-slot-ui-column pb-4 schedule-event-wrapper" id="meetingBookSlotForm" style="display: none;">';
			// +'<div class="back-btn-to-change-date on-mobile-view position-relative" onclick="backToReschedule()">'
			// 	+'<i class="fa fa-arrow-left"></i>'
			// +'</div>'
			if(data.forAllCounselor == 'true' && data.counselorAutoSelect != 'true'){
				html +='<div class="row">';
				if(data.userFindStatus=='N'){
					html +='<div class="col-lg-6">';
				}else{
					html +='<div class="col-lg-12">';
				}
					html +='<div class="full px-4 mt-3">'
							+'<div class="full mb-3">'
								+'<h5 class="text-black font-weight-bold">Counselor*</h5>'
								+'<select class="form-control" name="counselorName" id="counselorName"></select>'
							+'</div>'
						+'</div>'
					+'</div>';
					if(data.userFindStatus=='N'){
						html +='<div class="col-lg-6">' 
							+'<div class="full px-4 mt-3">'
								+'<div class="full mb-3">'
									+'<h5 class="text-black font-weight-bold">Lead Source*</h5>'
									+'<select class="form-control" name="counselorLeadSource" id="counselorLeadSource"></select>'
								+'</div>'
							+'</div>'
						+'</div>';
					}
				html +='</div>';
			}
			html +='<div class="full px-4 pt-4">';
			if(data.leadType!=undefined && data.leadType=='B2B'){
				html +='<h5 class="text-black font-weight-bold">Individual/Organization Details</h5>';
			}else if(data.timePreferenceSlotName == 'Interview'){
				html +='<h5 class="text-black font-weight-bold">Attendee Details</h5>';
			}else{
				html +='<h5 class="text-black font-weight-bold">Parent Details</h5>';
			}
			html +='</div>'
			+'<input type="hidden" name="meetingSlotType" id="meetingSlotType" value="" />'
			+'<input type="hidden" name="meetingSelectDateWeekId" id="meetingSelectDateWeekId" value="" />'
			+'<input type="hidden" name="meetingSelectDate" id="meetingSelectDate" value="" />'
			+'<input type="hidden" name="meetingStartTime" id="meetingStartTime" value="" />'
			+'<input type="hidden" name="meetingEndTime" id="meetingEndTime" value="" />'
			+'<input type="hidden" name="meetingTimzoneId" id="meetingTimzoneId" value="" />'
			+'<input type="hidden" name="userTimeZone" id="userTimeZone" value="" />'
			+'<input type="hidden" name="schoolPersonId" id="schoolPersonId" value="" />'
			+'<input type="hidden" name="slotTypeId" id="slotTypeId" value="'+data.slotTypeId+'" />'
			
			+'<input type="hidden" name="isdCode" id="isdCode" value="" />'
			+'<input type="hidden" name="pCountryCode" id="pCountryCode" value="" />'
			+'<div class="full px-4 mt-3">'
				+'<div class="full mb-3">'
					+'<label class="font-weight-bold text-black">Name*</label>'
					+'<input type="text" name="name" id="name"  value="'+data.sendUserName+'" class="form-control" '+(data.sendUserName != ""?"disabled":"")+' onkeydown="return M.isChars(event);">'
				+'</div>'
				+'<div class="full mb-3">'
					+'<label class="font-weight-bold text-black">Email*</label>'
					+'<input type="text" name="email" id="email" value="'+data.sendUserEmail+'" class="form-control" '+(data.sendUserEmail != ""?"disabled":"")+' pattern="^([A-Za-z0-9_\-\.])+@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$">'
				+'</div>';
					if(data.userFindStatus=='N'){
						if(data.leadType!=undefined && data.leadType=='B2B'){
							html+='<div class="full mb-3">'
								+'<label class="font-weight-bold text-black" for="">Country*</label>'
								+'<select class="form-control" name="countryId" id="countryId">'
								+'</select>'
							+'</div>'
							+'<div class="full mb-3">'
								+'<label class="font-weight-bold text-black">Phone No.*</label>'
								+'<input type="text" name="phoneNo" id="phoneNo"  value="" class="form-control" maxlength="12" onkeydown="return M.digit(event);">'
							+'</div>';
						}else if(data.timePreferenceSlotName == 'Interview'){
							html+='<div class="full mb-3">'
								+'<label class="font-weight-bold text-black" for="">Country*</label>'
								+'<select class="form-control" name="countryId" id="countryId">'
								+'</select>'
							+'</div>'
							+'<div class="full mb-3">'
								+'<label class="font-weight-bold text-black">Phone No.*</label>'
								+'<input type="text" name="phoneNo" id="phoneNo"  value="" class="form-control" maxlength="12" onkeydown="return M.digit(event);">'
							+'</div>';
						}else{
							html+='<div class="full mb-3">'
								+'<label class="font-weight-bold text-black">Grade*</label>'
								+'<select class="form-control" name="gradeId" id="gradeId">'+getStandardContent(SCHOOL_ID, false, true)+'</select>'
							+'</div>'
							+'<div class="full mb-3">'
								+'<label class="font-weight-bold text-black" for="">Country*</label>'
								+'<select class="form-control" name="countryId" id="countryId">'
								+'</select>'
							+'</div>'
							+'<div class="full mb-3">'
								+'<label class="font-weight-bold text-black">Phone No.*</label>'
								+'<input type="text" name="phoneNo" id="phoneNo"  value="" class="form-control" maxlength="12" onkeydown="return M.digit(event);">'
							+'</div>';
						}
					}
				
				html+='<div class="full mt-4 text-right">'
					+'<a href="javascript:void(0)" class="btn btn-primary btn-pill py-2 px-4 font-size-lg scheduleMeeting" onclick="scheduleMeetingForEvent(\'meetingBookSlotForm\');" >Book '+data.timePreferenceSlotName+'</a>'
				+'</div>'
			+'</div>'
		+'</div>';
	return html;
}
function getCounselorSlotCotent(){
var html = 
	'<div class="counselor-slot-ui-column slot-wrapper pr-1 mt-4" style="display: none;min-width:200px">'
		+'<div class="full slot-gap" style="opacity: 0;height:170px">'
			+'<h5 class="text-black font-weight-bold">&nbsp;</h5>'
		+'</div>'
		+'<div class="back-btn-to-change-date" onclick="backToChangeDate()">'
			+'<i class="fa fa-arrow-left"></i>'
		+'</div>'
		+'<div class="full">'
			// +'<h6 class="mt-1 day-and-date text-center"><span class="day-name">Tuesday,</span> April 30, 2024</h6>'
			+'<h6 class="mt-1 day-and-date text-center"></h6>'
		+'</div>'
		+'<ul class="p-0 m-0 slot-rapper-scroll scrollbar-container"></ul>'
	+'</div>';
return html;
}

function customLoaderContent(){
	var html = 
	`
	<div id="commonloaderIdNewLoader" class="loader-wrapper d-flex justify-content-center align-items-center loader-style hide-loader">
		<img src="`+PATH_FOLDER_IMAGE2+`loader-new.gif" alt="`+SCHOOL_NAME+` Loader" class="new-loader-2024" />
	</div>`;
	return html;
}
function serverMessageContent(){
	var html=
		'<div class="server-message">'
			+'<span class="msg" id="msgTheme2"></span>'
		+'</div>';
	return html;	
}
function thankyouPageContent(data){
	var counsellorName = '';
	if(data.forAllCounselor == 'true'){
		if(data.counselorAutoSelect == 'true'){
			counsellorName = 'School Demo';
		}else{
			counsellorName = data.userName.replace('Counselor', data.counselorName.trim());
		}
	}else{
		counsellorName = data.userName
	}
	var html=
	'<div class="col-xl-6 col-lg-7 col-md-10 col-sm-12 col-12 px-md-3 px-0 mr-auto ml-auto mt-md-5 mt-0 mb-4" id="thankyouContent" style="display:none">'
		+'<div class="d-flex card flex-row counselor-slot-ui-flex">'
			+'<div class="w-100 p-4">'
				+'<div class="full text-center">'
					+'<a href="'+schoolSettingsLinks.schoolWebsite+'" target="blank">'
						+'<img src="'+schoolSettingsLinks.logoUrl+''+SCRIPT_VERSION+'" style="max-width: 300px;width: 100%;" />'
					+'</a>'
				+'</div>'
				+'<div class="full text-center my-4">'
					+'<h4 class="text-center font-weight-bold"><i class="fa fa-check-circle text-success"></i>&nbsp;Your '+data.meetingFor+' is booked</h4>'
					+'<p class="font-size-lg mb-0">A calendar invitation has been sent to your email address.</p>'
				+'</div>'
				+'<div class="full px-md-4 px-0">'
					+'<div class="full">'
						+'<ul class="p-3 m-0 border rounded-10">'
							+'<li>'
								+'<label class="name font-weight-bold text-dark font-size-lg cName full mb-3">'+counsellorName+'</label>'
							+'</li>'
							+'<li>'
								+'<span class="text-gray font-weight-semi-bold full mb-3">'
									+'<div class="d-flex align-items-top flex-wrap">'
										+'<span>'
											+'<i class="fa fa-clock mr-1" style="line-height:22px"></i>Duration:'
										+'</span>'	
										+'<label class="m-0 ml-1" id="thankUserName">'+data.timeDuration+'</label>'
									+'</div>'
								+'</span>'
							+'</li>'
							// +'<li>'
							// 	+'<span class="text-gray font-weight-semi-bold full mb-3">'
							// 		+'<div class="d-flex align-items-top">'	
							// 			+'<i class="fa fa-user mr-2" style="line-height:22px"></i><label class="m-0" id="thankUserName">'+data.userName+'</label>'
							// 		+'</div>'
							// 	+'</span>'
							// +'</li>'
							+'<li>'
								+'<span class="text-gray font-weight-semi-bold full mb-3">'
									+'<div class="d-flex align-items-top flex-wrap">'	
										+'<span>'
											+'<i class="fa fa-calendar mr-1" style="line-height:22px"></i>Selected Date & Time:'
										+'</span>'	
										+'<label class="m-0 ml-1" id="thankTimeAndDate">'+data.selectTimeDate+'</label>'
									+'</div>'
								+'</span>'
							+'</li>'
							+'<li class="mb-0">'
								+'<span class="text-gray font-weight-semi-bold full mb-3">'
									+'<div class="d-flex align-items-top flex-wrap">'	
										+'<span>'
											+'<i class="fa fa-globe mr-1" style="line-height:22px"></i>Selected Time Zone:'
										+'</span>'	
										+'<label class="m-0 ml-1" id="thankSelectTimeZone">'+data.selectTimeZone.replaceAll('  ','+')+'</label>'
									+'</div>'
								+'</span>'
							+'</li>'
						+'</ul>'
						+'<p class="full font-size-lg mt-2 mb-0 text-center"> Please check your email to join the '+data.meetingFor+'.</p>'
					+'</div>'
				+'</div>'
			+'</div>'
		+'</div>'
	+'</div>'
	return html;
}