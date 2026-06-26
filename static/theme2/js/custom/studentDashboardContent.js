var flagWatchVideo = false;
var isSkipped = false;
var videoUrl="N";
var MIGRATION_DATA;


async function rendereDashboardContent(isParent){
    if($("#cropModal").length>0){
        $("#cropModal").remove();
    }
    $("body").append(cropperImageModalContent());
    customLoader(true);
    $("body").append(batchImpAnnouncementModal()+newsAllListWithDetailsModalCotent());
    var data = getStudentDashboardOrMigrationSection();
    // console.log(data)
    if(data.showBatchReEnrollmentPopUp == "Y"){
        $("body").append(batchReEnrollmentModal());
        $("#batchReEnrollmentModal").modal("show");
    }else{
        $("#batchReEnrollmentModal").remove();
    }
    if(data.showGraduationCeremonyPopup == "Y"){
        if($("#graduationCeremonyModal").length >= 1){
            $("#graduationCeremonyModal").remove();
        }
        if($("#graduationCeremonyPopupStyle").length >= 1){
            $("#graduationCeremonyPopupStyle").remove();
        }
        $("body").append(studentGraduationCeremontPopup(data.graduationCeremonyRegistrationDeadline, data.standardId));
        initializeStudentGraduationCeremonyPopup(data.email);
        setTimeout(() => {
            $("#graduationCeremonyModal").modal("show");
        }, 2000);
    }
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
        if(dashboardData.showGraduationCeremonyPopup == "Y"){
            if($("#enrollPaymentModal").length >= 1){
                $("#enrollPaymentModal").remove();
            }
            // $("body").append(enrollPaymentModalContent());
            // setTimeout(() => {
            //     $("#enrollPaymentModal").modal("show");
            // }, 2000);
        }
        // if (dashboardData.inactiveFlag) {
        //     if($("#enrollPaymentModal").length >= 1){
        //         $("#enrollPaymentModal").remove();
        //     }
        //     $("body").append(enrollPaymentModalContent());
        //     setTimeout(() => {
        //         $("#enrollPaymentModal").modal("show");
        //     }, 2000);
        // }
        videoUrl=dashboardData.videoUrl;
        if (isParent!=="false") {
            dashboardData ['isParent'] = true;
        }
        await renderStudentDashboard(dashboardData);
        renderAnnouncement(dashboardData.userId);
        renderNews(dashboardData.userId);
        renderSchoolDaiaryBtnCount();
        // renderActivity(dashboardData.userId)
        getCartCount(dashboardData.userId);
        await getReserveASeatForNextGrade(dashboardData.userId, dashboardData.nextGrade)
        // setTimeout(function () {
        //     getReserveASeatForNextGrade(dashboardData.userId, dashboardData.nextGrade);
        // }, 10000);
        $("#timeStuStandardId").val(dashboardData.studentStandardId);
        if(data.showStudentCourseSelectionModel=='Y'){
           await getStudentTimePreference(data.studentId, data.standardId, data.providerId);
        }
        if(ORIENTSTATUS == "PENDING" || CAN_SHOW_ENROLL_RESERVE_MODAL) {
            renderProfileDataInModal(dashboardData);
        }
	}else if(data.studentGraduate == 'Y'){
        $('head').append(`<script src="${PATH_FOLDER_JS2}${RESOURCES_FROM_MIN_LOCATION}custom/nextSessionStudentStage.js${SCRIPT_VERSION}">`)
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
        MIGRATION_DATA=data;
        if (isParent!=="false") {
            dashboardData ['isParent'] = true;
        }
        await renderMigrationDetailsOptionContent(data);
        // setTimeout(showRandomToast, 30000);
        // // Then every 3 min
        // setInterval(showRandomToast, 1 * 60 * 1000);

        var timerDiv = $("#reEnrollmentCountdown");
        reEnrollmentCountdown(
            data,
            function(time) {
                timerDiv.html(
                    `<h2></h2>
                    <div class="d-flex align-items-center mx-auto justify-content-center w-100">
                        <div class="d-inline-flex align-items-center">
                            <div class="d-inline-flex flex-column rounded bg-light-primary text-dark p-1 font-weight-bold border p-2">
                                <div class="font-28 px-1 mb-1 text-dark" style="line-height:24px">${time.days}</div>
                                <span class="font-weight-semi-bold font-12 text-center">DAYS</span>
                            </div> <span class="font-22 text-primary font-weight-bold d-inline-block px-2 pb-1">:</span> 
                        </div>
                        <div class="d-inline-flex align-items-center">
                            <div class="d-inline-flex flex-column rounded bg-light-primary text-dark p-1 font-weight-bold border p-2">
                                <div class="font-28 px-1 mb-1 text-dark" style="line-height:24px">${time.hours}</div>
                                <span class="font-weight-semi-bold font-12 text-center">HRS</span>
                            </div> <span class="font-22 text-primary font-weight-bold d-inline-block px-2 pb-1">:</span>
                        </div>
                        <div class="d-inline-flex align-items-center">
                            <div class="d-inline-flex flex-column rounded bg-light-primary text-dark p-1 font-weight-bold border p-2">
                                <div class="font-28 px-1 mb-1 text-dark" style="line-height:24px">${time.minutes}</div>
                                <span class="font-weight-semi-bold font-12 text-center">MIN</span>
                            </div> <span class="font-22 text-primary font-weight-bold d-inline-block px-2 pb-1">:</span>
                        </div>

                        <div class="flex-row">
                            <div class="d-inline-flex flex-column rounded bg-light-primary text-dark p-1 font-weight-bold border p-2">
                                <div class="font-28 px-1 mb-1 text-dark" style="line-height:24px">${time.seconds}</div>
                                <span class="font-weight-semi-bold font-12 text-center">SEC</span>
                            </div>
                        </div>
                    </div>`
                );
            },
            function () {
                // timerDiv.html("Timer Expired");
                $("#reEnrollmentDiscountWrapper").html('');
            }, 
        );
        
        $("head").append(`<script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js">`);
	}  
    if (isParent!=="true") {
        if(data.lastPassUpdatedDate){
            window.setTimeout(function(){callCommonDashboardPageForPasswordChange('14','No')},1000)
        }
    }
    getChat(data.email, USER_ROLE);
    $("body").append(calendarActivityModal()+viewActivityAttachmentModal());
    
}

async function renderStudentDashboard(data){
    var html=dashboardContent(data);
    $('#dashboardContentInHTML').html(html);
    $(".app-main__inner").addClass("pt-0")
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
    await callSchoolCalendar('', USER_ID, UNIQUEUUID, 'agendaDay', startFormatted, endFormatted, false);
    var showBulkFeedbackPopup = shouldShowBulkFeedbackPopupToday();
    if(showBulkFeedbackPopup){
        feedbackBulkShow = true;
        var previousWeek = getPreviousWeekDateRange();
        startdate = previousWeek.startDate;
        enddate = previousWeek.endDate;
        viewName = "agendaWeek";
        // await callSchoolCalendar(formId, userId, UNIQUEUUID, viewName, startdate, enddate, true);
    }
    calendarTimeInterval();
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
        getFeedbackQuestion(data.eventId, [0,1], 0, 0, 100, data.feedbackId, data.email, 'feedback_review', 'student-feedback');
        // if(data.registrationType!='BATCH'){
        //     callStudentTimePreference('STUDENT',data.studentStandardId);
        // }
    };
    $("#moveToTimePreferencePopup").click(function(){
        $("#mandatoryVideoModal").modal("hide");
        if(typeof showStudentDashboardWelcomeThenSystemTraining === "function"){
            showStudentDashboardWelcomeThenSystemTraining();
        }else{
            $("#timePreferencePopup").removeClass("d-none");
            $("#timePreferencePopup").modal("show");
        }
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

function dashboardContent(data) {
    let html = `
    <div class="app-page-title mb-3 py-2 d-lg-none">
        <div class="page-title-wrapper">
            <div class="page-title-actions mt-0 mb-1">
                <div class="d-inline-block">
                    <label class="switch">
                        <input class="switch-input redirectLmsUrl" type="checkbox" value="yes" onclick="redirectLms(this, '${data.isPayLmsPaymentPending}');" changeUrl="${data.lmsProviderURL}" />
                        <span class="switch-label" data-on="" data-off="LMS"></span>
                        <span class="switch-handle"></span>
                    </label>
                </div>
            </div>
        </div>
    </div>
    ${dashboardSchoolCalendar(data)}`;
    if (USER_ROLE === "STUDENT") {
        html += calendarMeetingLinkValidate();
    }
    return html;
}


function dashboardAnnouncement(data) {
    let html = `
    <div class="card box-shadow-none">
        <div class="card-header bg-white text-dark justify-content-between card-header-primary d-flex">
            <h6 class="pull-left m-0 font-size-md">
                ${data.schoolAnnouncements != null && data.schoolAnnouncements.newAnnouncementCount > 0 
                    ? `${data.schoolAnnouncements.newAnnouncementCount} New Announcement(s)` 
                    : 'Announcement'}
            </h6>
        </div>
        <div class="card-body announcement-card-scroll">
            <div class="announcement-wrapper">
                <ul>
                    ${data.schoolAnnouncements != null && data.schoolAnnouncements.schoolAnnounceDTO.length > 0
                        ? data.schoolAnnouncements.schoolAnnounceDTO.map(schoolAnnounce => `
                            <li class="col-md-12 col-sm-12 col-12 p-0">
                                <div class="announcement-anchor" onclick="showAnnounceDataById(${schoolAnnounce.announceId}, ${moduleId});">
                                    <div class="announcement-list">
                                        <span class="annoucement-icon">
                                            <i class="fa fa-bullhorn"></i>
                                            ${schoolAnnounce.replyStatus === 'N' ? '<label class="new-label">New</label>' : ''}
                                        </span>
                                        <h4 class="announcement-title">
                                            <span>${schoolAnnounce.announceTitle}
                                                ${schoolAnnounce.replyStatus === 'N' && schoolAnnounce.latestStstus === 'Y' 
                                                    ? `<label class="m-0 announcement-ribbon">New</label><i class="fa fa-star announcement-ribbon-star"></i>`
                                                    : ''}
                                            </span>
                                        </h4>
                                    </div>
                                </div>
                            </li>
                        `).join('') 
                        : '<li class="col-md-12 col-sm-12 col-xs-12 text-center">No new announcements</li>'
                    }
                </ul>
            </div>
        </div>
    </div>`;
    return html;
}

function dashboardSchoolCalendar(data) {
    var html=`
    <div class="main-card mb-3 pr-4">
        <div class="full">
            <div class="card-body px-0 pb-0 pt-0">
                <div class="row">
                    ${data.userRole === 'STUDENT' || data.userRole === 'TEACHER' ? `
                    <div class="col-lg-12 col-md-12 col-sm-12 col-12 pt-2">` : `
                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">`}
                        <div class="full mt-1">
                            <div class="card rounded-15">
                                <div class="card-body">
                                    <span id="currentTimeForUser" class="d-none"></span>
                                    <div class="text-left d-flex align-items-center flex-wrap">
                                        <div>
                                            <span class="d-inline-block country-flag mr-2">
                                                <img src="${PATH_FOLDER_FONT2}${data.countryISOCode}.svg" class="rounded" width="30px" alt="Flag"/>
                                            </span>
                                            <span class="user_timezone d-inline-block font-size-lg font-weight-semi-bold text-dark">
                                                <label>${data.userTimezone}&nbsp;</label>
                                            </span>
                                            <!--<span class="clock-box">
                                                <label class="user_current_day clock-bg font-size-lg time-label"></label>
                                            </span>
                                            <span class="clock-box">
                                                <label class="user_current_hour clock-bg font-size-lg time-label"></label>
                                            </span>
                                            <span class="clock-box position-relative">
                                                <label class="user_current_mins clock-bg font-size-lg time-label"></label>
                                                <label class="user_current_second clock-bg font-size-lg time-label"></label>
                                            </span>
                                            <span class="clock-box">
                                                <label class="user_current_am_pm clock-bg font-size-lg time-label"></label>
                                            </span>-->
                                            <div class="clock-box">
                                                <span class="user_current_time clock-bg font-18 text-primary font-weight-semi-bold time-label"></span>
                                            </div>
                                        </div>
                                        <div class="school-calender-tabs tabs  ml-auto text-right">
                                            <button class="btn-wide btn btn-sm btn-outline-dark bg-light-dark text-dark rounded px-4 calendar_request_button active_calendar_catergory mb-sm-0 mb-2" data-category="ALL" onclick="calendarRequestByFilter(this)">
                                                <div class="font-16 font-weight-bold line-height-1 over_All_Class_Activity_Count">0</div>
                                                <div class="font-12 line-height-1 font-weight-light over_All_Class_Activity_Label">All</div>
                                            </button>
                                            <button class="btn-wide btn ml-2 btn-outline-primary bg-light-primary btn-sm rounded text-primary calendar_request_button mb-sm-0 mb-2" data-category="CLASS" onclick="calendarRequestByFilter(this)">
                                                <div class="font-16 font-weight-bold line-height-1 class_Count">0</div>
                                                <div class="font-12 text-dark line-height-1 font-weight-light">Classes</div>
                                            </button>
                                            <button class="btn-wide btn ml-2 btn-outline-secondary bg-light-secondary btn-sm rounded text-secondary calendar_request_button mb-sm-0 mb-2" data-category="ACTIVITY" onclick="calendarRequestByFilter(this)">
                                                <div class="font-16 font-weight-bold line-height-1 activity_Count">0</div>
                                                <div class="font-12 line-height-1 font-weight-light">Activity</div>
                                            </button>
                                        </div>
                                    </div>
                                    <hr/>
                                    <div class="position-relative" style="z-index:0;" id="schoolcalendar"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    ${data.userRole === 'STUDENT' || data.userRole === 'TEACHER' ? `
                        ${/* 
                            <div class="col-lg-4 col-md-4 col-sm-12 pt-2 col-12 animated zoomIn">
                            <div class="full" id="announcementDiv"></div>
                            <div class="full mt-3" id="activityDiv"></div>
                            <div class="full mt-3" id="newsyDiv"></div>
                        </div>    
                        */''}
                        ` : ``}
                </div>
            </div>
        </div>
    </div>
    ${/*<div id="announceDataId" class="full"></div>*/''}
    ${getAnnouncementAndNewsContent()}
    ${holidayOne()}
    ${onBordingMandotryVideo()}`;
    // +feedbackPop(data.schoolLogo); // optional call if needed
    return html;
}


function holidayOne(){
	var html=
	'<div class="modal fade calendarbox" id="holiday1" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-modal="true">'
		+'<div class="modal-dialog" role="document">'
			+'<div class="modal-content">'
				+'<div class="modal-header py-2 bg-primary text-white">'
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
                                ${CHAT_URL != ''?`
                                    <a target="_blank" href="${CHAT_URL}/onboarding-support?uuid=${UNIQUEUUID}" class="notify-bell-chat d-flex justify-content-center align-items-center group position-relative" style="width: fit-content;">
                                        <svg class="chat-logo bg-primary" width="35" height="35" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M16.0156 16.0156V16.7969C16.0156 17.4414 15.4883 17.9688 14.8438 17.9688H7.61719L7.42188 18.125L4.88281 20.0781V17.9688H3.32031C2.67578 17.9688 2.14844 17.4414 2.14844 16.7969V8.59375C2.14844 7.94922 2.67578 7.42188 3.32031 7.42188H7.8125V6.64062H3.32031C2.24609 6.64062 1.36719 7.51953 1.36719 8.59375V16.7969C1.36719 17.8711 2.24609 18.75 3.32031 18.75H4.10156V21.6797L7.89063 18.75H14.8438C15.918 18.75 16.7969 17.8711 16.7969 16.7969V16.0156H16.0156Z" fill="white"/>
                                            <path d="M21.6797 4.29688C22.3242 4.29688 22.8516 4.82422 22.8516 5.46875V13.6719C22.8516 14.3164 22.3242 14.8438 21.6797 14.8438H20.1172V16.9727L17.5781 15.0195L17.3828 14.8438H10.1562C9.51172 14.8438 8.98438 14.3164 8.98438 13.6719V5.46875C8.98438 4.82422 9.51172 4.29688 10.1562 4.29688H21.6797ZM21.6797 3.51562H10.1562C9.08203 3.51562 8.20312 4.39453 8.20312 5.46875V13.6719C8.20312 14.7461 9.08203 15.625 10.1562 15.625H17.1094L20.8984 18.5547V15.625H21.6797C22.7539 15.625 23.6328 14.7461 23.6328 13.6719V5.46875C23.6328 4.39453 22.7539 3.51562 21.6797 3.51562Z" fill="white"/>
                                        </svg>
                                        <span class="chat-message" style="box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, .5) !important;padding:8px 5px 8px 22px">
                                            Talk to School Administration
                                        </span>
                                        <span class="UNSEEN start-100 translate-middle badge position-absolute"></span>
                                    </a>`:''}
                                
                            </h6>
                        </div>
                        <div class="modal-footer justify-content-center">
                            <button type="button" class="btn bg-primary text-white  float-right px-4 b-4" onclick="updateAnnouncementAcknowledgeStatus();">Acknowledge & Close</button>
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
                        ${CHAT_URL != ''?`<div class="header-dots mr-0 position-relative ml-auto" style="min-width: 60px;">
                                <a target="_blank" href="${CHAT_URL}/signIn?uuid=`+UNIQUEUUID+`" class="notify-bell-chat d-flex justify-content-center align-items-center group">
                                    <svg class="chat-logo bg-primary" width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M16.0156 16.0156V16.7969C16.0156 17.4414 15.4883 17.9688 14.8438 17.9688H7.61719L7.42188 18.125L4.88281 20.0781V17.9688H3.32031C2.67578 17.9688 2.14844 17.4414 2.14844 16.7969V8.59375C2.14844 7.94922 2.67578 7.42188 3.32031 7.42188H7.8125V6.64062H3.32031C2.24609 6.64062 1.36719 7.51953 1.36719 8.59375V16.7969C1.36719 17.8711 2.24609 18.75 3.32031 18.75H4.10156V21.6797L7.89063 18.75H14.8438C15.918 18.75 16.7969 17.8711 16.7969 16.7969V16.0156H16.0156Z" fill="white"/>
                                        <path d="M21.6797 4.29688C22.3242 4.29688 22.8516 4.82422 22.8516 5.46875V13.6719C22.8516 14.3164 22.3242 14.8438 21.6797 14.8438H20.1172V16.9727L17.5781 15.0195L17.3828 14.8438H10.1562C9.51172 14.8438 8.98438 14.3164 8.98438 13.6719V5.46875C8.98438 4.82422 9.51172 4.29688 10.1562 4.29688H21.6797ZM21.6797 3.51562H10.1562C9.08203 3.51562 8.20312 4.39453 8.20312 5.46875V13.6719C8.20312 14.7461 9.08203 15.625 10.1562 15.625H17.1094L20.8984 18.5547V15.625H21.6797C22.7539 15.625 23.6328 14.7461 23.6328 13.6719V5.46875C23.6328 4.39453 22.7539 3.51562 21.6797 3.51562Z" fill="white"/>
                                    </svg>
                                    <span class="chat-message" style="box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.5) !important;">Talk to School Administration</span>
                                    <span class="UNSEEN start-100 translate-middle badge position-absolute"></span>
                                </a>
                            </div>`:''}
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
            contentType : APPLICATION_JSON_VALUE,
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
            }
        });
        

	}
}

function playAgain(){
	player.seekTo(0);
	player.playVideo();
}

// function studentGraduationCeremontPopup(){
//     var html = 
//         `<div class="modal fade" id="graduationCeremonyModal" tabindex="-1" role="dialog" aria-labelledby="graduationCeremonyLabel" aria-hidden="true">
//             <div class="modal-dialog modal-lg modal-dialog-centered box-shadow-none" role="document">
//                 <div class="modal-content shadow-lg rounded-4 border-0">
//                     <div class="modal-header p-0 bg-white border-0">
//                         <button type="button" class="text-white btn btn-sm btn-danger d-flex ml-auto mr-2 mt-2 rounded-circle" data-dismiss="modal" aria-label="Close" style="font-size: 16px !important; margin: 0;">
//                             <i class="fa fa-times" aria-hidden="true"></i>
//                         </button>
//                     </div>
//                     <div class="modal-body px-5 pt-2 pb-4">
//                         <div class="d-flex align-items-center">
//                             <div class="text-center text-lg-start mb-4 mb-lg-0">
//                                 <h4 class="mb-3 font-weight-bold text-dark">
//                                     We are Celebrating our <span class="text-primary">First Graduation Ceremony 2025</span>
//                                     <i class="fa fa-graduation-cap text-dark" aria-hidden="true"></i>
//                                 </h4>
//                                 <p class="mb-4" style="font-size:16px;">
//                                     We are here to honor your hard work, celebrate your academic excellence,
//                                     and applaud your holistic growth — the journey that shaped you into who you are today.
//                                 </p>
//                                 <a href="https://join.internationalschooling.org/event-form" target="_blank" class="btn btn-primary px-4 py-2 rounded-10 font-weight-bold scale-btn-animate" style="font-size:14px;">
//                                     Fill Form to Join →
//                                 </a>
//                             </div>
//                     </div>
//                 </div>
//             </div>
//         </div>`;
//     return html;
// }

function studentGraduationCeremontPopup(registrationDeadline, standardId){
    var formattedDeadline = "";
    if(registrationDeadline){
        formattedDeadline = changeDateFormat(new Date(registrationDeadline + "T00:00:00"), "MMM-dd-yyyy");
    }
    var gradeName = SCHOOL_STANDARD_GRADE_MASTER.find(grade => grade.key == standardId)?.value || standardId || "12";
    var html =
        `<div class="modal fade" id="graduationCeremonyModal" tabindex="-1" role="dialog" aria-labelledby="graduationCeremonyLabel" aria-hidden="true">
            <div class="modal-dialog modal-xl modal-dialog-centered box-shadow-none graduation-ceremony-dialog" role="document">
                <div class="modal-content border-0 shadow-none overflow-hidden graduation-ceremony-modal-content">
                    <div class="graduation-ceremony-shell">
                        <button type="button" class="graduation-ceremony-close" data-dismiss="modal" aria-label="Close">
                            <i class="fa fa-times" aria-hidden="true"></i>
                        </button>
                        <div class="graduation-ceremony-content">
                            <div class="text-center">
                                <h2 class="graduation-ceremony-title">Graduation Ceremony, 2026</h2>
                                <p class="graduation-ceremony-subtitle">The wait is over - Graduation Ceremony to be held coming July 2026.</p>
                            </div>
                            <div class="graduation-ceremony-section">
                                <h4 class="graduation-ceremony-section-title">Will you attend as a</h4>
                                <div class="row justify-content-center graduation-option-row">
                                    <div class="col-md-4 col-sm-6 mb-3">
                                        <button type="button" class="graduation-option-card active" data-group="attendAs" data-value="graduate">
                                            <span class="graduation-option-icon"><i class="fa fa-graduation-cap" aria-hidden="true"></i></span>
                                            <span class="graduation-option-text">${gradeName}, Graduate</span>
                                            <span class="graduation-option-check"><i class="fa fa-circle-o" aria-hidden="true"></i><i class="fa fa-check-circle" aria-hidden="true"></i></span>
                                        </button>
                                    </div>
                                    <div class="col-md-4 col-sm-6 mb-3">
                                        <button type="button" class="graduation-option-card" data-group="attendAs" data-value="attendee">
                                            <span class="graduation-option-icon"><i class="fa fa-users" aria-hidden="true"></i></span>
                                            <span class="graduation-option-text">Attendee</span>
                                            <span class="graduation-option-check"><i class="fa fa-circle-o" aria-hidden="true"></i><i class="fa fa-check-circle" aria-hidden="true"></i></span>
                                        </button>
                                    </div>
                                    <div class="col-md-4 col-sm-6 mb-3">
                                        <button type="button" class="graduation-option-card" data-group="attendAs" data-value="performer">
                                            <span class="graduation-option-icon"><i class="fa fa-microphone" aria-hidden="true"></i></span>
                                            <span class="graduation-option-text">Performer</span>
                                            <span class="graduation-option-check"><i class="fa fa-circle-o" aria-hidden="true"></i><i class="fa fa-check-circle" aria-hidden="true"></i></span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div class="graduation-ceremony-divider"></div>
                            <div class="graduation-ceremony-section">
                                <h4 class="graduation-ceremony-section-title">The Graduation Ceremony will be held in Dubai <span class="graduation-option-icon graduation-location-icon"><img src="${PATH_FOLDER_IMAGE2}graduation-ceremony/dubai-infra.png${SCRIPT_VERSION}" alt="Dubai"></span></h4>
                                ${/*<div class="graduation-fixed-location">
                                    
                                    <span class="graduation-fixed-location-text">Dubai</span>
                                </div>*/''}
                            </div>
                            <div class="graduation-link-panel disabled" id="graduationLinkPanel">
                                <div class="graduation-link-label">
                                    <i class="fa fa-link" aria-hidden="true"></i>
                                    <span>Registration Form Link:</span>
                                </div>
                                <div class="graduation-link-input-wrap">
                                    <input type="text" id="graduationCeremonyRegistrationLink" class="graduation-link-input" value="" readonly placeholder="Select attendance type to generate your registration link">
                                </div>
                                <div class="graduation-link-actions">
                                    <button type="button" class="graduation-copy-btn" id="graduationCeremonyRedirectLinkBtn" disabled>
                                        <i class="fa fa-external-link" aria-hidden="true"></i>
                                        <span>Redirect to link</span>
                                    </button>
                                </div>
                            </div>
                            ${/*<div class="graduation-link-hint">
                                <a href="javascript:void(0)" id="graduationCeremonyOpenLink" class="graduation-open-link disabled-link">Select attendance type to generate your registration link</a>
                                <span class="graduation-copy-message" id="graduationCeremonyCopyMessage"></span>
                            </div>*/''}
                        </div>
                        <div class="graduation-deadline-strip">
                            <i class="fa fa-clock-o" aria-hidden="true"></i>
                            <span class="graduation-deadline-strong">DEADLINE TO REGISTER: ${formattedDeadline ? formattedDeadline.toUpperCase() : "TBA"}</span>
                            <span class="graduation-deadline-divider">|</span>
                            <span>Seats and slots are limited. Register now!</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <style id="graduationCeremonyPopupStyle">
            .graduation-ceremony-dialog { max-width: 72vw !important; padding: 10px; }
            .graduation-ceremony-modal-content { background: transparent; }
            .graduation-ceremony-shell { position: relative; background: #ffffff url(${PATH_FOLDER_IMAGE2}graduation-ceremony/graduation_ceremony_bg.png${SCRIPT_VERSION}) center top / cover no-repeat; border-radius: 24px; overflow: hidden; color: #143d93; box-shadow: 0 18px 42px rgba(11, 43, 117, 0.22); }
            .graduation-ceremony-content { position: relative; z-index: 2; padding: 38px 42px 42px; }
            .graduation-ceremony-close { position: absolute; right: 16px; top: 14px; width: 30px; height: 30px; border: 0; border-radius: 50%; background: #1848aa; color: #fff; z-index: 4; display: inline-flex; align-items: center; justify-content: center; box-shadow: 0 8px 18px rgba(24, 72, 170, 0.24); }
            .graduation-ceremony-close:focus, .graduation-option-card:focus { outline: none; }
            .graduation-ceremony-title { color: #143d93; font-size: 32px; line-height: 1.08; font-weight: 800; margin-bottom: 8px; }
            .graduation-ceremony-subtitle { color: #243150; font-size: 16px; line-height: 1.35; margin-bottom: 22px; }
            .graduation-ceremony-section, .graduation-link-panel { position: relative; z-index: 2; }
            .graduation-ceremony-section-title { color: #143d93; text-align: center; font-size: 22px; line-height: 1.2; font-weight: 800; margin-bottom: 16px; }
            .graduation-option-row { margin-left: -8px; margin-right: -8px; }
            .graduation-option-row > div { padding-left: 8px; padding-right: 8px; }
            .graduation-option-card { width: 100%; min-height: 68px; border: 2px solid #cfdcf8; background: rgba(255, 255, 255, 0.96); color: #143d93; border-radius: 16px; padding: 12px 14px; display: flex; align-items: center; justify-content: space-between; transition: all 0.25s ease; box-shadow: 0 6px 16px rgba(24, 72, 170, 0.08); text-align: left; }
            .graduation-option-card.active { background: #143d93; border-color: #143d93; color: #ffffff; box-shadow: 0 10px 24px rgba(20, 61, 147, 0.18); }
            .graduation-option-icon { width: 34px; font-size: 24px; line-height: 1; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
            .graduation-location-icon img { max-width: 32px; max-height: 32px; object-fit: contain; filter: brightness(0) saturate(100%) invert(21%) sepia(74%) saturate(1632%) hue-rotate(207deg) brightness(89%) contrast(91%); }
            .graduation-option-card.active .graduation-location-icon img { filter: brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(0%) hue-rotate(165deg) brightness(108%) contrast(101%); }
            .graduation-option-text { flex: 1; font-size: 16px; line-height: 1.15; font-weight: 700; padding: 0 10px; }
            .graduation-option-check { width: 22px; height: 22px; position: relative; flex-shrink: 0; font-size: 22px; line-height: 1; }
            .graduation-option-check .fa-check-circle { display: none; }
            .graduation-option-card.active .graduation-option-check .fa-circle-o { display: none; }
            .graduation-option-card.active .graduation-option-check .fa-check-circle { display: inline-block; }
            .graduation-ceremony-divider { height: 1px; background: #dce6f8; margin: 14px auto 20px; max-width: 760px; }
            .graduation-fixed-location { max-width: 260px; margin: 0 auto; min-height: 68px; border: 2px solid #cfdcf8; background: rgba(255, 255, 255, 0.96); color: #143d93; border-radius: 16px; padding: 12px 14px; display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 16px rgba(24, 72, 170, 0.08); }
            .graduation-fixed-location-text { font-size: 16px; line-height: 1.15; font-weight: 700; padding-left: 10px; }
            .graduation-link-panel { margin: 20px auto 8px; max-width: 760px; background: #143d93; border-radius: 16px; padding: 10px; display: flex; align-items: center; box-shadow: 0 14px 32px rgba(20, 61, 147, 0.22); }
            .graduation-link-panel.disabled { opacity: 0.8; }
            .graduation-link-label { width: 190px; color: #ffffff; display: flex; align-items: center; font-size: 14px; font-weight: 700; padding: 0 6px 0 4px; }
            .graduation-link-label i { font-size: 18px; margin-right: 8px; }
            .graduation-link-input-wrap { flex: 1; padding: 0 8px; }
            .graduation-link-input { width: 100%; min-height: 44px; border: 0; border-radius: 12px; padding: 10px 12px; color: #143d93; font-size: 13px; font-weight: 600; background: #ffffff; box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.18); }
            .graduation-link-input::placeholder { color: #6c7898; font-weight: 500; }
            .graduation-link-actions { width: 156px; }
            .graduation-copy-btn { width: 100%; min-height: 44px; border-radius: 12px; border: 2px solid rgba(255, 255, 255, 0.75); background: #1f5fe0; color: #ffffff; font-size: 13px; font-weight: 700; display: inline-flex; align-items: center; justify-content: center; transition: all 0.2s ease; }
            .graduation-copy-btn:disabled { opacity: 0.55; cursor: not-allowed; }
            .graduation-copy-btn i { font-size: 16px; margin-right: 6px; }
            .graduation-link-hint { text-align: center; font-size: 13px; color: #1e2f52; min-height: 18px; }
            .graduation-open-link { color: #1e2f52; text-decoration: none; }
            .graduation-open-link:hover { color: #143d93; text-decoration: underline; }
            .graduation-open-link.disabled-link, .graduation-open-link.disabled-link:hover { color: #7c88a8; text-decoration: none; cursor: default; pointer-events: none; }
            .graduation-copy-message { display: inline-block; margin-left: 8px; font-weight: 700; color: #1b8b3f; }
            .graduation-deadline-strip { position: relative; z-index: 2; background: #1848aa; color: #ffffff; text-align: center; padding: 10px 12px; font-size: 13px; font-weight: 500; display: flex; align-items: center; justify-content: center; flex-wrap: wrap; }
            .graduation-deadline-strip i { font-size: 16px; margin-right: 8px; }
            .graduation-deadline-strong { font-weight: 800; letter-spacing: 0.4px; }
            .graduation-deadline-divider { margin: 0 8px; opacity: 0.9; }
            @media (max-width: 1199.98px) { .graduation-ceremony-dialog { max-width: 82vw; } .graduation-ceremony-content { padding: 34px 24px 36px; } .graduation-ceremony-title { font-size: 28px; } .graduation-ceremony-subtitle { font-size: 14px; } .graduation-option-text, .graduation-fixed-location-text { font-size: 14px; } .graduation-link-panel { flex-wrap: wrap; } .graduation-link-label, .graduation-link-actions, .graduation-link-input-wrap { width: 100%; } .graduation-link-label { justify-content: center; margin-bottom: 10px; } .graduation-link-input-wrap { padding: 0; } .graduation-link-actions { margin-top: 10px; } }
            @media (max-width: 991.98px) { #graduationCeremonyModal .modal-dialog { max-width: calc(100vw - 20px) !important; padding: 6px; margin: 0.5rem auto; } .graduation-ceremony-modal-content { display: flex; justify-content: center; } .graduation-ceremony-shell { background: #ffffff; } .graduation-ceremony-content { padding: 56px 14px 26px; } .graduation-ceremony-title { font-size: 24px; } .graduation-ceremony-subtitle { font-size: 13px; margin-bottom: 18px; } .graduation-ceremony-section-title { font-size: 18px; } .graduation-option-card, .graduation-fixed-location { min-height: 60px; padding: 10px; } .graduation-option-icon { width: 30px; font-size: 20px; } .graduation-location-icon img { max-width: 28px; max-height: 28px; } .graduation-option-text, .graduation-fixed-location-text { font-size: 14px; padding: 0 8px; } .graduation-option-check { width: 20px; font-size: 20px; } .graduation-ceremony-divider { margin: 12px auto 16px; } .graduation-link-input { min-height: 40px; font-size: 12px; padding: 10px; } .graduation-copy-btn { min-height: 40px; } .graduation-deadline-strip { font-size: 12px; padding: 10px; } .graduation-deadline-strip i { font-size: 14px; } }
        </style>`;
    return html;
}

function initializeStudentGraduationCeremonyPopup(studentEmail){
    $(document).off("click", ".graduation-option-card");
    $(document).on("click", ".graduation-option-card", function(){
        var group = $(this).attr("data-group");
        $('.graduation-option-card[data-group="' + group + '"]').removeClass("active");
        $(this).addClass("active");
        updateStudentGraduationCeremonyRegistrationLink(studentEmail);
    });
    $(document).off("click", "#graduationCeremonyRedirectLinkBtn");
    $(document).on("click", "#graduationCeremonyRedirectLinkBtn", function(){
        if($(this).prop("disabled")){
            return false;
        }
        var registrationLink = $("#graduationCeremonyRegistrationLink").val();
        if(!registrationLink){
            return false;
        }
        window.open(registrationLink, "_blank");
        return false;
    });
    // $(document).off("click", "#graduationCeremonyOpenLink");
    // $(document).on("click", "#graduationCeremonyOpenLink", function(){
    //     var registrationLink = $("#graduationCeremonyRegistrationLink").val();
    //     if(!registrationLink){
    //         return false;
    //     }
    //     window.open(registrationLink, "_blank");
    //     return false;
    // });
    updateStudentGraduationCeremonyRegistrationLink(studentEmail);
}

function updateStudentGraduationCeremonyRegistrationLink(studentEmail){
    var attendAs = $('.graduation-option-card[data-group="attendAs"].active').attr("data-value") || "";
    var location = "dubai";
    var registrationLink = "";
    // var linkHint = "Select attendance type to generate your registration link";
    if (attendAs !== "") {
        var deploymentMode = (DEPLOYMENT_MODE || "").toLowerCase();
        var isTestEnv = deploymentMode === "dev" || deploymentMode === "uat";
        registrationLink = "https://event.internationalschooling.org" + "?attendAs=" + encodeURIComponent(attendAs) + "&location=" + encodeURIComponent(location) +  "&email=" + encodeURIComponent(studentEmail);
        if (isTestEnv) {
            registrationLink += "&type=T" + "&baseUrl=" + APP_BASE_URL;
        }
        // linkHint = "Click the link to open the registration form";
    }
    $("#graduationCeremonyRegistrationLink").val(registrationLink);
    $("#graduationCeremonyCopyMessage").text("");
    $("#graduationCeremonyRedirectLinkBtn").prop("disabled", registrationLink === "");
    $("#graduationLinkPanel").toggleClass("disabled", registrationLink === "");
    // $("#graduationCeremonyOpenLink").text(linkHint);
    // $("#graduationCeremonyOpenLink").attr("href", registrationLink !== "" ? registrationLink : "javascript:void(0)");
    // $("#graduationCeremonyOpenLink").toggleClass("disabled-link", registrationLink === "");
}

function batchReEnrollmentModal(){
    var html = 
        `<div id="batchReEnrollmentModal" class="modal fade bd-example-modal-lg fade-scale" data-backdrop="static" data-keyboard="false" tabindex="" role="dialog">
            <div class="modal-dialog modal-dialog-centered box-shadow-none" role="document" style="max-width: 715px;">
                <div class="modal-content">
                    <div class="modal-header py-2 bg-primary">
                        <h5 class="modal-title text-white text-left">Important Announcement</h5>
                    </div>
                    <div class="modal-body">
                        <h6 class="font-weight-semi-bold text-justify text-primary" style="line-height: 26px;">The last date to re-enroll for Group Learning is 15th September 2025 | Classes starting from 23 September 2025.</h6>
                    </div>
                    <div class="modal-footer justify-content-center">
                        <button type="button" class="btn bg-primary text-white float-right px-4 b-4" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>`;
    return html;
}

async function renderProfileDataInModal(dashboardData){
    getMissingDataByUser(dashboardData.payload).then(function(){
        $(document).on('shown.bs.modal', '#profileFielddModal', function() {
            buindProfileElementEvent(previousSchoolElementArray);
            getInputIntel(inputPhoneNumberArray);
        });
        PROFILE_DATA_INTERVAL = getProfileDateInterVal();
    });
}
function calendarActivityModal(data){
	var html=
	`<div class="modal fade" id="calendarActivityModal" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
		<div class="modal-dialog modal-md modal-dialog-centered shadow-none" role="document" style="max-width: 450px;">
			<div class="modal-content">
				<div class="modal-body">
                    <button type="button" class="close text-white bg-primary position-absolute circle" style="width:30px;height:30px;right:10px;top:5px;opacity:1;z-index:1" data-dismiss="modal" aria-label="Close">
					    <span aria-hidden="true" style="line-height:24px;font-size:24px">&times;</span>
				    </button>
                    <div class="full" id="calendarActivityWrapper"></div>
				</div>
			</div>
		</div>
	</div>`;
	return html;
}

function viewActivityAttachmentModal(){
	var html=
	`<div class="modal fade" id="viewActivityAttachmentModal" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
		<div class="modal-dialog modal-xl modal-dialog-centered shadow-none" role="document">
			<div class="modal-content">
				<div class="modal-body">
                    <button type="button" class="close text-white bg-primary position-absolute circle" style="width:30px;height:30px;right:10px;top:5px;opacity:1;z-index:1" data-dismiss="modal" aria-label="Close">
					    <span aria-hidden="true" style="line-height:24px;font-size:24px">&times;</span>
				    </button>
                    <div class="full" id="viewActivityAttachmentModalWrapper"></div>
				</div>
			</div>
		</div>
	</div>`;
	return html;
}
