async function renderActivity(userId) {
	try {
		var payload = {};
		payload['userId'] = userId;
		var localDatetime = changeDateFormat(new Date(), 'yyyy-mm-dd') + ' ' + getCurrentTimeOnly()
		payload['startDatetime'] = convertLocalToUTCWithFormat(getBeforeAndAfterDate(localDatetime, -24), USER_TIMEZONE, DATETIME_UTC_FORMATTER);
		payload['endDatetime'] = convertLocalToUTCWithFormat(getBeforeAndAfterDate(localDatetime, 24), USER_TIMEZONE, DATETIME_UTC_FORMATTER);
		responseData = await getDashboardDataBasedUrlAndPayload(true, true, 'get-acivity-details', payload);
		if(responseData.status == 1) { //console.log("ACT DATA :: " + JSON.stringify(responseData));
			$('#activityDiv').html(await getActivityContent(responseData));
			$("#activity-nav").metisMenu({
				toggle: false // disable the auto collapse. Default: true.
			});
			getHomePageActivityCounter();
			var activitylength = $(".card-activity .vertical-nav-menu > .sub-menu").length;
			for (var i = 1; i <= activitylength; i++) {
				var subActivityLength = $(".card-activity .vertical-nav-menu  .sub-menu:nth-child(" + i + ") > ul .sub-menu").length;
				if ($(".card-activity .vertical-nav-menu > .sub-menu:nth-child(" + i + ") ul li").length < 1) {
					$(".card-activity .vertical-nav-menu > .sub-menu:nth-child(" + i + ") a").addClass("disable-activity");
				} else if (subActivityLength >= 1) {
					for (var j = 1; j <= subActivityLength; j++) {
						$(".card-activity .vertical-nav-menu  .sub-menu:nth-child(" + i + ")").addClass('mm-active');
						$(".card-activity .vertical-nav-menu > .sub-menu:nth-child(" + i + ")  ul").addClass('mm-show');
						$(".card-activity .vertical-nav-menu > .sub-menu:nth-child(" + i + ") > ul > .sub-menu:nth-child(" + j + ")").addClass('mm-active');
						$(".card-activity .vertical-nav-menu > .sub-menu:nth-child(" + i + ") > ul > .sub-menu:nth-child(" + j + ") ul").addClass('mm-show');
					}
				} else {
					$(".card-activity .vertical-nav-menu > .sub-menu:nth-child(" + i + ")  ul").addClass('mm-show');
					$(".card-activity .vertical-nav-menu  .sub-menu:nth-child(" + i + ")").addClass('mm-active');
				}
			}
		}
	} catch (e) {
		showMessageTheme2(0, e, '', true);
	}
}

//EXTRA ACTIVITY COUNTER SCRIPT START HERE//
function makeTimer(myActId, activityStartDateTimeByUserTimezone, currentDate) {
	var endTime = activityStartDateTimeByUserTimezone;
	endTime = (Date.parse(endTime) / 1000);
	var now = currentDate;
	now = (Date.parse(now) / 1000);
	var timeLeft = endTime - now;
	var days = Math.floor(timeLeft / 86400);
	var hours = Math.floor((timeLeft - (days * 86400)) / 3600);
	var minutes = Math.floor((timeLeft - (days * 86400) - (hours * 3600)) / 60);
	var seconds = Math.floor((timeLeft - (days * 86400) - (hours * 3600) - (minutes * 60)));

	if (hours < "10") { hours = "0" + hours; }
	if (minutes < "10") { minutes = "0" + minutes; }
	if (seconds < "10") { seconds = "0" + seconds; }
	if (days < 1) {
		days = "0"
	}
	$("#days" + myActId).html("<b class='time-number'>" + days + "</b>" + "<span class='count-span text-dark'>&nbsp; Days</span>");
	$("#hours" + myActId).html("<b class='time-number'>" + hours + "</b>" + "<span class='count-span text-dark'> &nbsp;Hours</span>");
	$("#minutes" + myActId).html("<b class='time-number'>" + minutes + "</b>" + "<span class='count-span text-dark'> &nbsp;Min</span>");
	$("#seconds" + myActId).html("<b class='time-number'>" + seconds + "</b>" + "<span class='count-span text-dark'> &nbsp;Sec</span>");
}


function getHomePageActivityCounter(activityID){
	var userCurrentTime = convertUTCToTimezoneAs(getUTCTime(), DATETIME_FORMATTER, USER_TIMEZONE).format('MMM DD, YYYY hh:mm:ss a');
	setInterval(function(){
        userCurrentTime = convertUTCToTimezoneAs(getUTCTime(), DATETIME_FORMATTER, USER_TIMEZONE).format('MMM DD, YYYY hh:mm:ss a');
    }, 1000);
	$('.myActivityLoop').each(function () {
		var intervalId = $(this).attr('data-timeid');
		intervalId = setInterval(function () {
			var acivityIndex = $(this).attr('data-activity-index');
			var timerId = $(this).attr('data-timeid');
			var activityStartTime = new Date($(this).attr('data-starttimedate'));
			var activityEndTime = new Date($(this).attr('data-endtimedate'));
			var joiningBefore = parseInt($(this).attr('data-joiningBefore'));
			var currentDateTimeByUserTimeZone = new Date($("#currentTimeForUser").text());
			if($("#currentTimeForUser").text() == ""){
				currentDateTimeByUserTimeZone = new Date(userCurrentTime);
			}
			if(activityEndTime >  currentDateTimeByUserTimeZone){
				if (activityStartTime > currentDateTimeByUserTimeZone) {
					$(this).find('.counter-div').show();
					$(this).find('.ongoing-div').hide();
					$(this).find('.joinLBtn' + timerId).hide().removeClass('d-inline-block');
					$('#displayJoinLinkDiv' + timerId).show();
					if((activityStartTime.getTime() - currentDateTimeByUserTimeZone.getTime()) <= joiningBefore * 60000) {
						$('#joinButton' + timerId).show().removeClass('join-activity-disabled');
						if(USER_ROLE =="STUDENT"){
							$("#join-btn-message-"+timerId).hide();
						}
					} else {
						if(USER_ROLE=='STUDENT'){
							$('#joinButton' + timerId).addClass('join-activity-disabled');
						}
					}
				} else {
					$(this).find('.joinLBtn' + timerId).show().addClass('d-inline-block');
					$(this).find('.counter-div').hide();
					$(this).find('.ongoing-div').show();
					$(this).find('.activity-btn').hide();
					if((activityStartTime.getTime() - currentDateTimeByUserTimeZone.getTime()) <= joiningBefore * 60000) {
						$('#joinButton' + timerId).show().removeClass('join-activity-disabled');
						if(USER_ROLE =="STUDENT"){
							$("#join-btn-message-"+timerId).hide();
						}
						$('#displayJoinLinkInfoDiv'+timerId).hide();
						$(this).find('.joinLBtn' + timerId).show().addClass('d-inline-block');
					} else {
						if(USER_ROLE=='STUDENT'){
							$('#joinButton' + timerId).addClass('join-activity-disabled');
						}
						$('#displayJoinLinkInfoDiv'+timerId).show();
					}
					
					// Activity Remove if acvity end time is over 
					if(currentDateTimeByUserTimeZone > activityEndTime){
						if(USER_ROLE=='STUDENT'){
							$('#joinButton' + timerId).addClass('join-activity-disabled');
						}
						if($("#activity-li-"+acivityIndex+" > ul.mm-collapse > li > ul.mm-collapse").length>0){
							$(this).parent().closest("li").remove();
						}else{
							$(this).remove();
						}
						if($("#activity-li-"+acivityIndex+" > ul.mm-collapse > li").length<1){
							$("#activity-li-"+acivityIndex+" > ul.mm-collapse").html('').removeClass("mm-show");
							$("#activity-li-"+acivityIndex).removeClass("mm-active");
							$("#activity-li-"+acivityIndex+" #parent-"+acivityIndex).addClass("disable-activity");
						}
						if($(".myActivityLoop").length<1){
							clearInterval(intervalId);
						}
					}
					// Activity Remove if acvity end time is over 
				}
				makeTimer(timerId, activityStartTime, currentDateTimeByUserTimeZone);
			}else{
				$('#joinButton' + timerId).addClass('join-activity-disabled');
				// $(this).remove();
				// $("#displayJoinLinkInfoDiv"+timerId).hide();
			}
			
			
		}.bind(this), 1000);
	});
}
//EXTRA ACTIVITY COUNTER SCRIPT END HERE//

async function renderViewActitifyDetails(activityId, meetingId) {
	var userCurrentTime = new Date($("#currentTimeForUser").text());
	var userActivityEndTime = new Date($("#activity-end-time-"+activityId).attr('data-endtimedate'));
	if(userActivityEndTime < userCurrentTime){
		showMessageTheme2(0, "Your activity has been completed.")
		return false;
	}
	try {
		var payload = {};
		payload['activityId'] = activityId;
		payload['meetingId'] = meetingId;
		payload['userId'] = USER_ID;
		responseData = await getDashboardDataBasedUrlAndPayload(true, true, 'view-extra-activity', payload);
		console.log("acivity modal", responseData)
		if (responseData.status == 1) {
			$("#calendarActivityWrapper").html(viewActivityContentModal(responseData))
			// $('#dashboardContentInHTML').html(viewActivityContent(responseData));
			$("#calendarActivityModal").modal("show");
			await studentExtraActivityOnLoadEvent(responseData);
			$("head #activityPageStyle").remove();
			$("head").append(activityPageStyle());
			$(".tooltip.calendar-tooltip").remove();
			getHomePageActivityCounter();
			console.log('getHomePageActivityCounter code for testing');
		}
	} catch (e) {
		showMessageTheme2(0, e, '', true);
	}
}

async function studentExtraActivityOnLoadEvent(){
	$('iframe.hasPDF').each(function () {
		if ($(this).attr('href').toLowerCase().match(/\.(pdf)/g)) {
			var currentURL = $(this).attr('href');
			var newURL = 'https://docs.google.com/gview?url=' + currentURL + '&embedded=true';
			$(this).attr('href', newURL)
		}
	});
}




function joinZoomMeeting(src) {
	customLoader(true);
	var meetingLink = $(src).attr("data-meeting-url");
	// Get the iframe element
	$("#zoomMeetingCard").css({ "margin": "0px !important" });
	$("#zoomMeetingCard").hide();
	var iframe = document.getElementById('activity-zoom-meeting-iframe');
	// Set the new URL for the iframe
	iframe.src = meetingLink;
	$("#activity-zoom-meeting-iframe").show();
	setTimeout(function () {
		customLoader(false);
	}, 3000);
}

function viewActivityAttachmentSource(uploadFile, filePath){
	var html=``;
	if(uploadFile!='' && uploadFile !='No file chosen...'){
		if(uploadFile.endsWith('.pdf')?'pdf-view':''){
			$("#viewActivityAttachmentModal .modal-dialog").addClass("modal-xl").removeClass("modal-lg");
			html+=`<iframe src="${filePath}" type="application/pdf" width="100%" height="500" style="overflow:auto;"></iframe>`;
		}else{
			$("#viewActivityAttachmentModal .modal-dialog").addClass("modal-lg").removeClass("modal-xl");
			html+=`<img src="${filePath}" style="width:100%;" class="activity-upload-img"/>`;
		}
	}
	$("#viewActivityAttachmentModal #viewActivityAttachmentModalWrapper").html(html);
	$("#viewActivityAttachmentModal").modal("show");
}