var flagWatchVideo = false;
var isSkipped = false;
var videoUrl="N";

function rendereDashboardContent(isParent){
    customLoader(true);
    $("body").append(batchImpAnnouncementModal())
    var data = getStudentDashboardOrMigrationSection();
    if(data.studentGraduate == 'N'){
		//student dashboard content
        if(data.showBatchImpAnnouncementModal=='Y'){
            //model hide by Nisha as not required now
            $('#batchImpAnnouncementModal').modal('hide');
            $('#batchStudentMappingId').val(data.batchStudentMappingId);  
            $("#batchStartDate").text(data.batchAcademicYearStartDate);      
            $("#batchFeeDueDate").text(data.feePayDueDate);    
        }else{
            $('#batchImpAnnouncementModal').modal('hide');
        }
        
        if(data.firstTimeRequest=='Y' && data.timePrefrenceSelectionStatus=='Y' && (data.systemTrainingStatus=='Skipped' || data.systemTrainingStatus=='COMPLETED')){
            $('#welcomeNoteModal').modal('show');
            window.setTimeout(function(){$('#welcomeNoteModal').modal('hide');},8000)
        }
        var dashboardData=getStudentDashboardDetails();
        videoUrl=dashboardData.videoUrl;
        if (isParent!=="false") {
            dashboardData ['isParent'] = true;
        }
        renderStudentDashboard(dashboardData);
        renderAnnouncement(dashboardData.userId)
        renderActitify(dashboardData.userId)
        getCartDetails(dashboardData.userId);
        setTimeout(function () {
            getReserveASeatForNextGrade(dashboardData.userId);
        }, 10000);
        $("#timeStuStandardId").val(dashboardData.studentStandardId);
        if(data.showStudentCourseSelectionModel=='Y'){
            getStudentTimePreference(data.studentId, data.standardId, data.providerId);
        }
        
	}else if(data.studentGraduate == 'Y'){
		//call migration content
        if(data.showBatchImpAnnouncementModal=='Y'){
            $("#batchStartDate").text(data.batchAcademicYearStartDate)      
            $("#batchFeeDueDate").text(data.feePayDueDate)  
             //model hide by Nisha as not required now
            $('#batchImpAnnouncementModal').modal('hide');
            $('#batchStudentMappingId').val(data.batchStudentMappingId);
        }else{
            $('#batchImpAnnouncementModal').modal('hide'); 
        }
		data=getStudentMigraionOptionDetails();
        if (isParent!=="false") {
            dashboardData ['isParent'] = true;
        }
		renderMigrationDetailsOptionContent(data)
	}
    if (isParent!=="true") {
        if(!data.lastPassUpdatedDate){
            window.setTimeout(function(){callCommonDashboardPageForPasswordChange('14','No')},1000)
        }
    }
    getChat(data.email, USER_ROLE);
}

async function renderStudentDashboard(data){
    var html=dashboardContent(data);
    $('#dashboardContentInHTML').html(html);
    $('#currentTimeForUser').html(convertUTCToTimezoneAs(getUTCTime(), DATETIME_FORMATTER, data.userTimezone).format('MMM DD, YYYY hh:mm:ss a'));
    setInterval(function(){
        $('#currentTimeForUser').html(convertUTCToTimezoneAs(getUTCTime(), DATETIME_FORMATTER, data.userTimezone).format('MMM DD, YYYY hh:mm:ss a'));
    }, 1000);
    var activitylength = $(".card-activity .vertical-nav-menu > .sub-menu").length;
    for(var i = 1; i<=activitylength; i++){
        var subActivityLength = $(".card-activity .vertical-nav-menu  .sub-menu:nth-child("+i+") > ul .sub-menu").length;
        if($(".card-activity .vertical-nav-menu > .sub-menu:nth-child("+i+") ul li").length < 1){
            $(".card-activity .vertical-nav-menu > .sub-menu:nth-child("+i+") a").addClass("disable-activity");
        }else if(subActivityLength >= 1){
            for(var j = 1; j<=subActivityLength; j++){
                $(".card-activity .vertical-nav-menu  .sub-menu:nth-child("+i+")").addClass('mm-active');
                $(".card-activity .vertical-nav-menu > .sub-menu:nth-child("+i+")  ul").addClass('mm-show');
                $(".card-activity .vertical-nav-menu > .sub-menu:nth-child("+i+") > ul > .sub-menu:nth-child("+j+")").addClass('mm-active');
                $(".card-activity .vertical-nav-menu > .sub-menu:nth-child("+i+") > ul > .sub-menu:nth-child("+j+") ul").addClass('mm-show');
            }
        }else{
            $(".card-activity .vertical-nav-menu > .sub-menu:nth-child("+i+")  ul").addClass('mm-show');
            $(".card-activity .vertical-nav-menu  .sub-menu:nth-child("+i+")").addClass('mm-active');
        }
    }
    $(".announcement-anchor .announcement-list").click(function(){
    	$(this).parent().find(".horizontal-scroll-table").slideToggle();
    	$(this).parent().closest("li").siblings().find(".horizontal-scroll-table").slideUp();
    });
    var startDate = new Date();
    var startFormatted = moment(startDate).format('YYYY-MM-DD');
    var endDate = moment(startDate).add(1, 'days');
    var endFormatted = endDate.format('YYYY-MM-DD');
    callSchoolCalendar('', USER_ID, UNIQUEUUID, 'agendaDay', startFormatted, endFormatted, false);
    calendarEventBind();
    setTimeout(function(){
        $('button.fc-today-button').unbind("click").bind("click", function() {
            $('#schoolcalendar').fullCalendar('today');
            var viewName = $('#schoolcalendar').fullCalendar('getView').name;
            var b = $('#schoolcalendar').fullCalendar('getDate');
                if(viewName === 'agendaDay') {
                    var sd = new Date();
                    var startdate = moment(sd).format('YYYY-MM-DD');
                    var ed = moment(sd).add(1, 'days');
                    var enddate = ed.format('YYYY-MM-DD');
                } else if(viewName === 'agendaWeek') {
                    var startdate = b.format('YYYY-MM-DD');
                    var today = new Date(startdate);
                    var dates = startAndEndOfWeek(today);
                    startdate = dates[0];
                    enddate = dates[1];
                }
            callSchoolCalendar('', USER_ID, UNIQUEUUID, viewName, startdate, enddate, true)
        });
    },1000);
    if(data.schoolId==1){
        //getFeedbackQuestion(data.eventId, [0,1], 0, 0, 100, data.feedbackId, data.email, 'feedback_review', 'student-feedback');
        // if(data.registrationType!='BATCH'){
        //     callStudentTimePreference('STUDENT',data.studentStandardId);
        // }
    };
    $("#moveToTimePreferencePopup").click(function(){
        $("#mandatoryVideoModal").modal("hide");
        $("#timePreferencePopup").removeClass("d-none");
        $("#timePreferencePopup").modal("show");
    });
    if(data.videoUrl !='N'){
        onYouTubeIframeAPIReady(data.videoUrl)
    }
}

function slideMenu(val){
    $("#main-nav1").metisMenu({
        toggle: false // disable the auto collapse. Default: true.
    });
}

function dashboardContent(data){
	var html=
    '<div class="app-page-title pt-1 pb-1 mb-2">'
		+'<div class="page-title-wrapper">'
			+'<div class="page-title-heading w-100">'
            //     +'<div class="page-title-icon"> <i class="pe-7s-users icon-gradient bg-ripe-malin"> </i> </div>';
            //         if(!data.isParent){
            //             html += '<div> You are observing '+data.userName+'\'s dashboard </div>'
            //         }else{
            //             html += '<div>'+data.userName+' <span id="currentTimeForUser" class="d-none"></span></div>'
            //             +'<div class="ml-auto">'
            //                 +'<span class="user_timezone d-inline-block">'
            //                     +'<label>'+data.userTimezone+'&nbsp;</label>'
            //                     +'<div class="font-size-md">&nbsp;</div>'
            //                 +'</span>'
            //                 +'<span class="clock-box ml-1">'
            //                     +'<label class="user_current_day bg-primary text-white clock-bg"></label>'
            //                     +'<div class="font-size-md text-center font-weight-semi-bold">Day</div>'
            //                 +'</span>'
            //                 +'<span class="clock-box ml-1">'
            //                     +'<label class="user_current_hour bg-primary text-white clock-bg"></label>'
            //                     +'<div class="font-size-md text-center font-weight-semi-bold">Hr</div>'
            //                 +'</span>'
            //                 +'<span class="clock-box ml-1 position-relative mr-3">'
            //                     +'<label class="user_current_mins bg-primary text-white clock-bg"></label>'
            //                     +'<label class="user_current_second bg-primary text-white clock-bg"></label>'
            //                     +'<div class="font-size-md text-center font-weight-semi-bold">Min</div>'
            //                 +'</span>'
            //                 +'<span class="clock-box ml-2">'
            //                     +'<label class="user_current_am_pm bg-primary text-white clock-bg"></label>'
            //                     +'<div class="font-size-md">&nbsp;</div>'
            //                 +'</span>'
            //             +'</div>'
            //         }
            // html+='</div>'
            +'<div class="page-title-actions mt-0 mb-1 d-lg-none pt-4">'
				+'<div class="d-inline-block">'
					+'<label class="switch">'
						+'<input class="switch-input redirectLmsUrl" type="checkbox" value="yes" onclick="redirectLms(this, \''+data.isPayLmsPaymentPending+'\');" changeUrl="'+data.lmsProviderURL+'" />'
						+'<span class="switch-label" data-on="" data-off="LMS"></span>'
						+'<span class="switch-handle"></span>'
					+'</label>'
				+'</div>'
			+'</div>'
		+'</div>'
	+'</div>'
    +dashboardSchoolCalendar(data)
    if(USER_ROLE == "STUDENT"){
        html+=calendarMeetingLinkValidate();
    }
	return html;
}

function dashboardAnnouncement(data){
	var html = 
    '<div class="card box-shadow-none">'
        +'<div class="card-header theme-bg text-white justify-content-between card-header-primary d-flex">'
            +'<h6 class="pull-left m-0 font-size-md">';
                if(data.schoolAnnouncements!=null && data.schoolAnnouncements.newAnnouncementCount>0){
                    html+=data.schoolAnnouncements.newAnnouncementCount+' New Announcement(s)';
                }else{
                    html+='Announcement';
                }
                html+=
            '</h6>'
        +'</div>'
		+'<div class="card-body announcement-card-scroll">'
            +'<div class="announcement-wrapper">'
                +'<ul>';
                if(data.schoolAnnouncements!=null && data.schoolAnnouncements.schoolAnnounceDTO.length>0){
                    $.each(data.schoolAnnouncements.schoolAnnounceDTO, function(k, schoolAnnounce) {
                        html+=
                        '<li class="col-md-12 col-sm-12 col-12 p-0">'
							+'<div class="announcement-anchor" onclick="showAnnounceDataById('+schoolAnnounce.announceId+','+moduleId+');">'
                                +'<div class="announcement-list">'
                                    +'<span class="annoucement-icon">'
                                        +'<i class="fa fa-bullhorn"></i>';
										if(schoolAnnounce.replyStatus == 'N'){
											html+='<label class="new-label">New</label>'
                                        }
                                        html+=
									'</span>'
									+'<h4 class="announcement-title">'
                                        +'<span>'+schoolAnnounce.announceTitle;
                                            if(schoolAnnounce.replyStatus == 'N' && schoolAnnounce.latestStstus == 'Y'){
                                                html+=
                                                '<label class="m-0 announcement-ribbon">New</label>'
												+'<i class="fa fa-star announcement-ribbon-star"></i>';
                                            }
                                            html+=
                                        '</span>'
                                    +'</h4>'
                                +'</div>'
                            +'</div>'
                        +'</li>';
                    });
                }else{
                    html+='<li class="col-md-12 col-sm-12 col-xs-12 text-center">No new announcements</li>';
                }
                html+=
				'</ul>'
            +'</div>'
        +'</div>'
	+'</div>';
	return html;
}

function dashboardSchoolCalendar(data){
    html=
	'<div class="main-card mb-3">'
        +'<div class="full">'
            +'<div class="card-body px-0 pb-0">'
                +'<div class="row">';
                    if(data.userRole == 'STUDENT' || data.userRole == 'TEACHER'){
                        html+=
                        '<div class="col-lg-8 col-md-8 col-sm-12 col-12 pt-2">';
                    }else{
                        html+=
                        '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">';
                    }
                        html+=
                            '<div class="full  mt-1">'
                                +'<div class="card">'
                                    +'<div class="card-body">'
                                        +'<span id="currentTimeForUser" class="d-none"></span>'
                                        +'<div class="text-center mb-2">'
                                            +'<span class="user_timezone d-inline-block font-size-lg">'
                                                +'<label>'+data.userTimezone+'&nbsp;</label>'
                                                // +'<div class="font-size-md">&nbsp;</div>'
                                            +'</span>'
                                            +'<span class="clock-box ml-1">'
                                                +'<label class="user_current_day bg-primary text-white clock-bg font-size-lg time-label"></label>'
                                                // +'<div class="font-size-md text-center font-weight-semi-bold">Day</div>'
                                            +'</span>'
                                            +'<span class="clock-box ml-1">'
                                                +'<label class="user_current_hour bg-primary text-white clock-bg font-size-lg time-label"></label>'
                                                // +'<div class="font-size-md text-center font-weight-semi-bold">Hr</div>'
                                            +'</span>'
                                            +'<span class="clock-box ml-1 position-relative mr-3">'
                                                +'<label class="user_current_mins bg-primary text-white clock-bg font-size-lg time-label"></label>'
                                                +'<label class="user_current_second bg-primary text-white clock-bg time-label"></label>'
                                                // +'<div class="font-size-md text-center font-weight-semi-bold">Min</div>'
                                            +'</span>'
                                            +'<span class="clock-box ml-2">'
                                                +'<label class="user_current_am_pm bg-primary text-white clock-bg font-size-lg time-label"></label>'
                                                // +'<div class="font-size-md">&nbsp;</div>'
                                            +'</span>'
                                        +'</div>'

                                        +'<hr/>'
                                        +'<div class="position-relative" style="z-index:0;" id="schoolcalendar"></div>'
                                    +'</div>'
                                +'</div>'
                            +'</div>'
                        +'</div>';
                    if(data.userRole == 'STUDENT' || data.userRole == 'TEACHER'){
                        html+=
                        '<div class="col-lg-4 col-md-4 col-sm-12 pt-2 col-12 animated zoomIn">'
                            +'<div class="full" id="announcementDiv">'
                            +'</div>'
                            +'<div class="full mt-3" id="activityDiv">'
                            +'</div>'
                        +'</div>';
                    }
                    html+=
                '</div>'
            +'</div>'
        +'</div>'
    +'</div>'
    +'<div id="announceDataId" class="full"></div>'
    +holidayOne()
    +onBordingMandotryVideo()
    
   // +feedbackPop(data.schoolLogo);
    return html;
}

function holidayOne(){
	var html=
	'<div class="modal fade calendarbox" id="holiday1" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-modal="true">'
		+'<div class="modal-dialog" role="document">'
			+'<div class="modal-content">'
				+'<div class="modal-header pt-2 pb-2 theme-bg text-white">'
					+'<h5 class="modal-title" id="calendarbox_title"></h5>'
					+'<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">'
						+'<span aria-hidden="true">X</span>'
					+'</button>'
				+'</div>'
				+'<div class="modal-body">'
					+'<p class="activity_type"><b><span class="activity"></span></b></p>'
				+'</div>'
			+'</div>'
		+'</div>'
	+'</div>'
	return html;
}

function batchImpAnnouncementModal(){
    var html = `<div id="batchImpAnnouncementModal" class="modal fade bd-example-modal-lg fade-scale" data-backdrop="static" data-keyboard="false" tabindex="" role="dialog">
                <input type="hidden" id="batchStudentMappingId">
                <input type="hidden" id="batchStudentMappingId">
                <div class="modal-dialog modal-dialog-centered box-shadow-none" role="document" style="max-width: 715px;">
                    <div class="modal-content">
                        <div class="modal-header py-2 bg-primary">
                            <h5 class="modal-title text-white text-left">Important Announcement</h5>
                        </div>
                        <div class="modal-body">
                            <h6 class="font-weight-semi-bold text-justify text-primary" style="line-height: 26px;">Our Group Learning batch for UTC+ time zone starts on Sept 18, 2024 and for UTC- time zone starts on Sep 25, 2024! To secure your enrollment please make sure to pay the full fee at the earliest. Don't miss out - enroll today!</h6>
                            <h6 class="d-flex flex-wrap align-items-center justify-content-start font-weight-semi-bold  mt-3 fullView" style="gap:10px">
                                For any queries regarding enrollment, please
                                <a target="_blank" href="https://chat.internationalschooling.org/onboarding-support?uuid=${UNIQUEUUID}" class="notify-bell-chat d-flex justify-content-center align-items-center group position-relative" style="width: fit-content;">
                                    <svg class="chat-logo bg-primary" width="35" height="35" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M16.0156 16.0156V16.7969C16.0156 17.4414 15.4883 17.9688 14.8438 17.9688H7.61719L7.42188 18.125L4.88281 20.0781V17.9688H3.32031C2.67578 17.9688 2.14844 17.4414 2.14844 16.7969V8.59375C2.14844 7.94922 2.67578 7.42188 3.32031 7.42188H7.8125V6.64062H3.32031C2.24609 6.64062 1.36719 7.51953 1.36719 8.59375V16.7969C1.36719 17.8711 2.24609 18.75 3.32031 18.75H4.10156V21.6797L7.89063 18.75H14.8438C15.918 18.75 16.7969 17.8711 16.7969 16.7969V16.0156H16.0156Z" fill="white"/>
                                        <path d="M21.6797 4.29688C22.3242 4.29688 22.8516 4.82422 22.8516 5.46875V13.6719C22.8516 14.3164 22.3242 14.8438 21.6797 14.8438H20.1172V16.9727L17.5781 15.0195L17.3828 14.8438H10.1562C9.51172 14.8438 8.98438 14.3164 8.98438 13.6719V5.46875C8.98438 4.82422 9.51172 4.29688 10.1562 4.29688H21.6797ZM21.6797 3.51562H10.1562C9.08203 3.51562 8.20312 4.39453 8.20312 5.46875V13.6719C8.20312 14.7461 9.08203 15.625 10.1562 15.625H17.1094L20.8984 18.5547V15.625H21.6797C22.7539 15.625 23.6328 14.7461 23.6328 13.6719V5.46875C23.6328 4.39453 22.7539 3.51562 21.6797 3.51562Z" fill="white"/>
                                    </svg>
                                    <span class="chat-message" style="box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, .5) !important;padding:8px 5px 8px 22px">
                                        Talk to School Administration
                                    </span>
                                    <span class="UNSEEN start-100 translate-middle badge position-absolute"></span>
                                </a>
                            </h6>
                        </div>
                        <div class="modal-footer justify-content-center">
                            <button type="button" class="btn bg-primary text-white btn-shadow float-right px-4 b-4" onclick="updateAnnouncementAcknowledgeStatus();">Acknowledge & Close</button>
                        </div>
                    </div>
                </div>
            </div>`;
        return html;
}

function onBordingMandotryVideo(){
    var html = `
            <div class="modal fade fade-scale" id="mandatoryVideoModal" data-backdrop="static">
            <div class="modal-dialog modal-lg modal-dialog-centered box-shadow-none" role="document">
                <div class="modal-content text-center">
                    <div class="modal-header pt-2 pb-2 bg-primary text-white justify-content-center">
                        <h5 class="heading">Welcome! `+USER_FULL_NAME+`</h5>
                    </div>
                    <div class="modal-body d-flex flex-wrap px-1 full pt-1">
                        <div class="d-flex w-100 my-2">
                            <div class="header-dots mr-0 position-relative ml-auto" style="min-width: 60px;">
                                <a target="_blank" href="https://chat.internationalschooling.org/signIn?uuid=`+UNIQUEUUID+`" class="notify-bell-chat d-flex justify-content-center align-items-center group">
                                    <svg class="chat-logo bg-primary" width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M16.0156 16.0156V16.7969C16.0156 17.4414 15.4883 17.9688 14.8438 17.9688H7.61719L7.42188 18.125L4.88281 20.0781V17.9688H3.32031C2.67578 17.9688 2.14844 17.4414 2.14844 16.7969V8.59375C2.14844 7.94922 2.67578 7.42188 3.32031 7.42188H7.8125V6.64062H3.32031C2.24609 6.64062 1.36719 7.51953 1.36719 8.59375V16.7969C1.36719 17.8711 2.24609 18.75 3.32031 18.75H4.10156V21.6797L7.89063 18.75H14.8438C15.918 18.75 16.7969 17.8711 16.7969 16.7969V16.0156H16.0156Z" fill="white"/>
                                        <path d="M21.6797 4.29688C22.3242 4.29688 22.8516 4.82422 22.8516 5.46875V13.6719C22.8516 14.3164 22.3242 14.8438 21.6797 14.8438H20.1172V16.9727L17.5781 15.0195L17.3828 14.8438H10.1562C9.51172 14.8438 8.98438 14.3164 8.98438 13.6719V5.46875C8.98438 4.82422 9.51172 4.29688 10.1562 4.29688H21.6797ZM21.6797 3.51562H10.1562C9.08203 3.51562 8.20312 4.39453 8.20312 5.46875V13.6719C8.20312 14.7461 9.08203 15.625 10.1562 15.625H17.1094L20.8984 18.5547V15.625H21.6797C22.7539 15.625 23.6328 14.7461 23.6328 13.6719V5.46875C23.6328 4.39453 22.7539 3.51562 21.6797 3.51562Z" fill="white"/>
                                    </svg>
                                    <span class="chat-message" style="box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.5) !important;">Talk to School Administration</span>
                                    <span class="UNSEEN start-100 translate-middle badge position-absolute"></span>
                                </a>
                            </div>
                        </div>
                        <div class="full">
                            <div id="player"></div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button href="javascript:void(0)" id="play-again-btn" class="btn btn-outline-gray" onclick="playAgain()" disabled>Watch Again</button>
                        <button href="javascript:void(0)" id="moveToTimePreferencePopup" class="btn btn-gray" disabled>Book System Training</button>
                    </div>
                </div>
            </div>
        </div>`;
    return html;
}

var player, player1;
function onYouTubeIframeAPIReady(videoID) {
    window.YT.ready(function() {
        if(!flagWatchVideo){
            player = new YT.Player('player', {
                height: '390',
                width: '100%',
                videoId: videoID, // Replace with your YouTube video ID
                playerVars: {
                    /// 'controls': 0, // Hides the progress bar and other controls
                    'modestbranding': 1, // Reduces the YouTube branding
                    'rel': 0, // Prevents showing related videos at the end
                    'iv_load_policy': 3, // Hides video annotations
                    'fs': 0, // Disables fullscreen button
                    'cc_load_policy': 0, // Hides closed captions
                    'disablekb': 1, // Disables keyboard controls
                    'playsinline': 1, // Plays inline on mobile devices
                    'autohide': 1 // Automatically hides video controls
                },
                events: {
                    'onStateChange': onPlayerStateChange
                }
            });
        }else{
            player1 = new YT.Player('player1', {
                height: '390',
                width: '100%',
                videoId: videoID, // Replace with your YouTube video ID
                playerVars: {
                   /// 'controls': 0, // Hides the progress bar and other controls
                    'modestbranding': 1, // Reduces the YouTube branding
                    'rel': 0, // Prevents showing related videos at the end
                    'iv_load_policy': 3, // Hides video annotations
                    'fs': 0, // Disables fullscreen button
                    'cc_load_policy': 0, // Hides closed captions
                    'disablekb': 1, // Disables keyboard controls
                    'playsinline': 1, // Plays inline on mobile devices
                    'autohide': 1 // Automatically hides video controls
                },
                
            });
        }
    });
}

function onPlayerStateChange(event) {
	// When the video ends
	if (event.data == YT.PlayerState.ENDED) {
        customLoader(true);
		flagWatchVideo = true;
        $("#play-again-btn").removeClass("btn-outline-gray");
        $("#play-again-btn").addClass("btn-outline-primary");
        $("#moveToTimePreferencePopup").removeClass("btn-gray")
        $("#moveToTimePreferencePopup").addClass("btn-primary")
		$("#moveToTimePreferencePopup, #play-again-btn").attr("disabled",false);
        var data={};
        data['flagWatchVideo'] = "Y";
        data['userId'] = USER_ID;
        data['studentStandardId'] =  $("#timeStuStandardId").val();
        data['schoolId'] = SCHOOL_ID;
        $.ajax({
            type : "POST",
            contentType : "application/json",
            url : getURLForHTML('dashboard','update-vedio-watched-status'),
            data : JSON.stringify(data),
            dataType : 'json',
            async:true,
            success : function(data) {
            if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
                if(data['status'] == '3'){
                    redirectLoginPage();
                }else{
                    showMessageTheme2(0, data['message'],'',true);
                }
            } else {
                // showMessageTheme2(1, data['message'],'',true);
                customLoader(false);
            }
            },
            error:function(e){
            // console.log(e);
                customLoader(false);
            }
        });
        

	}
}

function playAgain(){
	player.seekTo(0);
	player.playVideo();
}