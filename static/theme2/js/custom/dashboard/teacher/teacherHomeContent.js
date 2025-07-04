var commonProfileDTO;
var chatEligibility;
async function rendereTeacherHomeContent(){
    commonProfileDTO = await getUserShortProfile(USER_ID);
    chatEligibility = await getChatEligibility(USER_ID,SCHOOL_ID);
    customLoader(true);
    if(!commonProfileDTO.lastPassUpdatedDate){
        window.setTimeout(function(){callCommonDashboardPageForPasswordChange('14', 'No')},1000)
    }
    var payload = {};
    payload['userId'] = USER_ID;
    var responseData = await getDashboardDataBasedUrlAndPayload(false, false,'get-teacher-dashboard', payload);
    renderTeacherDashboard(responseData);
    getTeacherTimePreference();
	renderAnnouncement(responseData.userId)
    renderActitify(responseData.userId)
    callTeacherLastAttendance('', responseData.userId, '', '');
    getChat(responseData.email, responseData.userRole, responseData.userId);
    if(commonProfileDTO.declarecheckshow == 'show' && commonProfileDTO.isAgreementUpdated){
        $('head').append(`<script src="${PATH_FOLDER_JS2}${RESOURCES_FROM_MIN_LOCATION}custom/teacher/signupTeacherStage6.js${SCRIPT_VERSION}">`)
        if($("#teacherAgreementModal").length>0){
            $("#teacherAgreementModal").remove();
        }
        if(responseData.teacherAgreementDTO!=undefined){
            $('body').append(teacherAgreementContent(commonProfileDTO, JSON.parse(responseData.teacherAgreementDTO)));
            $("#teacherAgreementModal").modal('show');
            $("#preferenceTimeavailabilityFlag").val(true);
        }
    }
    
}

async function renderTeacherDashboard(data){
    $('#dashboardContentInHTML').html(dashboardContentTeacher(data));
    $('#currentTimeForUser').html(convertUTCToTimezoneAs(getUTCTime(), DATETIME_FORMATTER, data.userTimezone).format('MMM DD, YYYY hh:mm:ss a'));
    setInterval(function(){
        $('#currentTimeForUser').html(convertUTCToTimezoneAs(getUTCTime(), DATETIME_FORMATTER, data.userTimezone).format('MMM DD, YYYY hh:mm:ss a'));
    }, 1000);
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
    if(schoolSettingsLinks.dashboardVideoUrl !=null){
        onYouTubeIframeAPIReady(schoolSettingsLinks.dashboardVideoUrl)
    }
    if(data.firstTimeRequest=='Y'){
        $('#welcomeNoteModal').modal('show');
        window.setTimeout(function(){$('#welcomeNoteModal').modal('hide');},8000)
    }
}

function dashboardContentTeacher(data){
    var html=
    '<div class="app-page-title pt-1 pb-1 mb-2">'
		+'<div class="page-title-wrapper">'
			+'<div class="page-title-heading w-100">'
        +'</div>'
	+'</div>'
    
    +dashboardSchoolCalendar(data)
    +calendarMeetingLinkValidate()
    return html;
}

function teacherClassModal(){
    html+=
        `<div class="modal fade" id="modalTeacherClass" tabindex="-1" role="dialog">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content ">
                    <div class="modal-header text-white theme-bg py-2">
                        <h5 class="modal-title">Your Last Class Duration Break up </h5>
                        <button type="button" class="close text-white" data-dismiss="modal"
                            aria-label="Close">
                            <span aria-hidden="true"><i class="fa fa-times"></i></span>
                        </button>
                    </div>
                    <div id="mteacherLastClass" class="modal-body"></div>
                </div>
            </div>
        </div>`;
    return html;
}

function teacherAgreementContent(data, responseData){
    var html=
        `<div class="modal fade " id="teacherAgreementModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel1" data-backdrop="static">
            <input type="hidden" id="userId" value="${data.userId}">
            <div class="modal-dialog modal-xl" role="document" style="top:0%;">
                <div class="modal-content">
                    <div class="modal-header text-white theme-bg py-2">
                        <h4 class="modal-title" id="exampleModalLabel1" style="color:#fff;">Teacher Agreement</h4>	
                        ${/*button type="button" class="close" data-dismiss="modal"
                            aria-label="Close" style="margin-top:-22px;">
                            <span aria-hidden="true" style="color:#fff;">&times;</span>
                        </button>*/''}
                    </div>
                    <div class="modal-body" style="height:400px;overflow:auto;width:100%;">
                        <section id="section-linebox" class="text-left">`
                            html+=teacherAgreementView(responseData)
                        html+=`</section>
                    </div>
                    <div class="modal-footer">`
                        if(data.declarecheckshow == 'show'){
                            html+=
                            `<div class="form-check flex-grow-1">
                                <label class="form-check-label text-dark custom-checkbox">
                                    <input class="form-check-input" type="checkbox" id="agreementDeclarationConfirm">
                                        <span class="ml-4"> By clicking (ticking) the box here, I understand the responsibility to abide by all the rules, regulations and the above mentioned policies/points as established by ${schoolSettings.schoolName}</span>
                                        <span class="form-check-sign">
                                            <span class="check"></span>
                                        </span>
                                </label> 
                            </div>`
                        }
                        html+=`
                        <button type="submit" onclick="callForSignupTeacherAgreement('','${data.userId}','${responseData.agreementLogId}','${data.agreementAcceptanceFrom}');" class="btn btn-info" style="float:right;">Confirm</button>
                    </div>
                </div>
            </div>
        </div>`;
    return html;
}

function teacherAgreementView(data){
    var html=
    `
        <body style="font-family: 'Times New Roman', Times, serif; height: 100%; text-align: justify">
            <div class="contract-page" style="width: 21cm; margin: 0 auto; padding: 10px 10px 20px; page-break-after: always; ">
                <div>
                    <img src="${PATH_FOLDER_IMAGE}${data.agreementLetterHeadImg}${SCRIPT_VERSION}" width="300px;" />
                    ${/*<img src="${PATH_FOLDER_IMAGE}letter-header.png${SCRIPT_VERSION}" width="300px;" />*/''}
                </div>
                <span style="float: left; width: 50%; height: 75px;">
                    ${/*<strong>Tele:</strong> 011-4578902*/''}
                </span>
                <span style="float: right; width: 50%; height: 75px; text-align: right;">
                    ${data.addressSchool}
                </span>
                <span style="float: left; width: 50%; margin-top: 5px;">
                    <strong>Ref No.:</strong> ${data.agreementRefNumber}
                </span>
                <span style="float: right; width: 50%; margin-top: 5px; text-align: right;">
                    <strong>Date:</strong> ${data.agreementDate}
                </span>
                <span style="float: left; width: 100%; margin-top: 20px; font-weight: bold; height: auto;">
                    ${data.salutation}${data.salutation!=''?'. ':''}${data.name},<br />
                </span>
                <span style="float: left; width: 100%; margin-top: 0px; font-weight: normal; height: auto;">
                    ${data.address1}${data.address1!=''?',<br />':''}
                    ${data.address2}${data.address2!=''?',<br />':''}
                    ${data.city}${data.city!=''?',<br />':''}
                    ${data.state}${data.state!=''?',<br />':''}
                    ${data.country}${data.country!=''?',<br />':''}
                    ${data.pincode}
                </span>
                <span style="float: left; width: 45%; margin-top: 10px;"></span>
                <span style="text-align: center; margin-top: 10px;">
                    <strong><u>Sub: Offer Letter</u></strong>
                </span>
                <span style="float: left; width: 100%; margin-top: 10px;margin-bottom:10px;">
                    Dear <strong>${data.salutation}${data.salutation!=''?'. ':''}${data.name}</strong>
                </span>
                ${data.content}
                <p style="margin-bottom: 40px;">With Best Regards</p>
                <span style="width: 50%; height: 85px;">
                    <img src="${PATH_FOLDER_IMAGE}${data.agreementSignImg}${SCRIPT_VERSION}"
                        alt="Authorized Signature" title="Authorized Signature" style="width: 150px;"/>
                </span>
                <p style="width: 100%; float: left; text-align: left; margin-top: 40px; margin-bottom: 50px;">
                    ${schoolSettingsTechnical.authorizedPersonName} <br />
                    ${data.schoolName} <br />
                    (Authorised Signatory for ${data.schoolName})
                </p>
                <p style="margin-bottom: 0; margin-top: 50px;">
                    <strong>Acceptance of Offer:</strong>
                </p>
                <p style="margin-top: 0;">
                    I have read the above offer letter and
                    hereby acknowledge my acceptance of the above terms and conditions of
                    employment.
                </p>
                <span style="width: 50%; float: left; height: 28px;">
                    <span><strong>Place:</strong>${data.schoolCountry}</span>
                </span>
                <span style="width: 50%; float: right; text-align: right; height: 28px;">
                    ${/*<img src="${PATH_FOLDER_IMAGE}${TEACHER_AGREEMENT_SIGNTURE}${SCRIPT_VERSION}"
                        alt="Authorized Signature" title="Authorized Signature" style="width: 150px; height: 25px;"/>*/''}
                </span>
                <span style="width: 50%; float: left;">
                <strong>Date:</strong> ${data.agreementDate}</span>
                <span style="float: right; width: 50%; text-align: right">
                    <strong>Name:</strong> ${data.salutation}${data.salutation!=''?'. ':''}${data.name}
                </span>
                ${/*<div>
                    <img src="${PATH_FOLDER_IMAGE}letter-footer.jpg${SCRIPT_VERSION}" width="100%;" />
                </div>*/''}
            </div>
        </body>
    `
    return html;
}

function dashboardSchoolCalendar(data) {
    var html = `
    <div class="main-card mb-3">
        <div class="full">
            <div class="card-body pt-lg-3 pt-0 px-0 pb-0">
                <!-- <div class="full home-page-skeleton-wrapper"> -->
                <!--     ${getDashboardSkeleton()} -->
                <!-- </div> -->
                <div class="home-page-wrapper">
                    <div class="row">
                        <div class="col-lg-8 col-md-12 col-sm-12 col-12 pt-2">
                            <div class="full mt-1">
                                <div class="card">
                                    <div class="card-body">
                                        <span id="currentTimeForUser" class="d-none"></span>
                                        <div class="text-left d-flex align-items-center">
                                            <span class="d-inline-block country-flag mr-2">
                                                <img src="${PATH_FOLDER_FONT2}${data.countryISOCode}.svg" class="rounded" width="45px" alt="Flag"/>
                                            </span>
                                            <span class="user_timezone d-inline-block font-size-lg font-weight-semi-bold text-dark">
                                                <label>${data.userTimezone}&nbsp;</label>
                                            </span>
                                            <!--<span class="clock-box ml-1">
                                                <label class="user_current_day bg-primary text-white clock-bg font-size-lg time-label"></label>
                                            </span>
                                            <span class="clock-box ml-1">
                                                <label class="user_current_hour bg-primary text-white clock-bg font-size-lg time-label"></label>
                                            </span>
                                            <span class="clock-box ml-1 position-relative mr-3">
                                                <label class="user_current_mins bg-primary text-white clock-bg font-size-lg time-label"></label>
                                                <label class="user_current_second bg-primary text-white clock-bg time-label"></label>
                                            </span>
                                            <span class="clock-box ml-2">
                                                <label class="user_current_am_pm bg-primary text-white clock-bg font-size-lg time-label"></label>
                                            </span>-->
                                            <div class="clock-box">
                                                <span class="user_current_time clock-bg font-30 text-primary font-weight-semi-bold time-label"></span>
                                            </div>
                                        </div>
                                        <hr/>
                                        <div class="position-relative" style="z-index:0;" id="schoolcalendar"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-4 col-md-12 col-sm-12 pt-2 col-12">
                            <div class="full" id="announcementDiv"></div>
                            <div class="full mt-3" id="activityDiv"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div id="announceDataId" class="full"></div>
    ${holidayOne()}
    ${onBordingMandotryVideo()}
    ${/*feedbackPop(data.schoolLogo)*/''}
    `;
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

// async function renderActitify(userId){
//     try{
// 		var payload = {};
// 		payload['userId'] = userId;
//         var localDatetime=changeDateFormat(new Date(), 'yyyy-mm-dd')+' '+getCurrentTimeOnly()
// 		payload['startDatetime'] = convertLocalToUTCWithFormat(getBeforeAndAfterDate(localDatetime,-24),USER_TIMEZONE, DATETIME_UTC_FORMATTER);
// 		payload['endDatetime'] = convertLocalToUTCWithFormat(getBeforeAndAfterDate(localDatetime,24),USER_TIMEZONE, DATETIME_UTC_FORMATTER);
// 		responseData = await getDashboardDataBasedUrlAndPayload(false, false,'get-acivity-details', payload,true);
//         if(responseData.status==1){
//             $('#activityContent').html(dashboardActivityConent(responseData));
//             var activitylength = $(".card-activity .vertical-nav-menu > .sub-menu").length;
//             for(var i = 1; i<=activitylength; i++){
//                 var subActivityLength = $(".card-activity .vertical-nav-menu  .sub-menu:nth-child("+i+") > ul .sub-menu").length;
//                 if($(".card-activity .vertical-nav-menu > .sub-menu:nth-child("+i+") ul li").length < 1){
//                     $(".card-activity .vertical-nav-menu > .sub-menu:nth-child("+i+") a").addClass("disable-activity");
//                 }else if(subActivityLength >= 1){
//                     for(var j = 1; j<=subActivityLength; j++){
//                         $(".card-activity .vertical-nav-menu  .sub-menu:nth-child("+i+")").addClass('mm-active');
//                         $(".card-activity .vertical-nav-menu > .sub-menu:nth-child("+i+")  ul").addClass('mm-show');
//                         $(".card-activity .vertical-nav-menu > .sub-menu:nth-child("+i+") > ul > .sub-menu:nth-child("+j+")").addClass('mm-active');
//                         $(".card-activity .vertical-nav-menu > .sub-menu:nth-child("+i+") > ul > .sub-menu:nth-child("+j+") ul").addClass('mm-show');
//                     }
//                 }else{
//                     $(".card-activity .vertical-nav-menu > .sub-menu:nth-child("+i+")  ul").addClass('mm-show');
//                     $(".card-activity .vertical-nav-menu  .sub-menu:nth-child("+i+")").addClass('mm-active');
//                 }
//             }
//         }
// 	}catch(e){
// 		if(tt=='theme1'){
// 			showMessage(true, e);
// 		}else{
// 			showMessageTheme2(0, e,'',true);
// 		}
// 	}
    
// }



function getDashboardSkeleton(){
    var html=
        `<div class="row">
            <div class="col-lg-8 col-md-12 col-sm-12 col-12 pt-2">
                <div class="full animated zoomIn mt-1 skeleton">
                    <div class="card">
                        <div class="card-body">
                            <div class="text-center mb-2" style="height: 33px;">
                                <span class="user_timezone font-size-lg skeleton" style="width: 157px;height: 24px;"></span>
                                <span class="user_timezone font-size-lg skeleton" style="width: 217px;height: 24px;"></span>
                            </div>
                            <hr/>
                            <div class="schoolcalendar fc fc-bootstrap4 fc-ltr" class="position-relative" style="z-index:0;" >
                                <div class="fc-toolbar fc-header-toolbar">
                                    <div class="fc-left mb-1">
                                        <div class="btn-group">
                                            <div class="fc-prev-button btn skeleton" style="width: 33.6px;height: 32.8px;"></div>
                                            <div class="fc-next-button btn skeleton" style="width: 33.6px;height: 32.8px;"></div>
                                        </div>
                                        <div class="fc-today-button btn disabled skeleton" style="width: 59.96px;height: 32.8px;"></div>
                                    </div>
                                    <div class="fc-right skeleton rounded-5 mb-1" style="width: 122px;height:32.8px;"></div>
                                    <div class="fc-center skeleton mb-1" style="width: 235px;height: 32.8px;"></div>
                                </div>
                                <div class="fc-view-container">
                                    <div class="fc-view fc-agendaDay-view fc-agenda-view">
                                        <div class="table-bordered">
                                            <div class="fc-head skeleton" style="height: 23px;"></div>
                                            <div class="fc-body">
                                                <div>
                                                    <div class="full skeleton" style="height: 21.51px; margin-bottom: 3px;"></div>
                                                    <div class="full skeleton" style="height: 21.51px; margin-bottom: 3px;"></div>
                                                    <div class="full skeleton" style="height: 21.51px; margin-bottom: 3px;"></div>
                                                    <div class="full skeleton" style="height: 21.51px; margin-bottom: 3px;"></div>
                                                    <div class="full skeleton" style="height: 21.51px; margin-bottom: 3px;"></div>
                                                    <div class="full skeleton" style="height: 21.51px; margin-bottom: 3px;"></div>
                                                    <div class="full skeleton" style="height: 21.51px; margin-bottom: 3px;"></div>
                                                    <div class="full skeleton" style="height: 21.51px; margin-bottom: 3px;"></div>
                                                    <div class="full skeleton" style="height: 21.51px; margin-bottom: 3px;"></div>
                                                    <div class="full skeleton" style="height: 21.51px; margin-bottom: 3px;"></div>
                                                    <div class="full skeleton" style="height: 21.51px; margin-bottom: 3px;"></div>
                                                    <div class="full skeleton" style="height: 21.51px; margin-bottom: 3px;"></div>
                                                    <div class="full skeleton" style="height: 21.51px; margin-bottom: 3px;"></div>
                                                    <div class="full skeleton" style="height: 21.51px; margin-bottom: 3px;"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-4 col-md-12 col-sm-12 pt-2 col-12">
                <div class="full bg-white" style="height: 300px;">
                    <div class="card-header text-white  justify-content-between card-header-primary d-flex">
                        <div class="pull-left m-0 font-size-md skeleton" style="width: 118px;">&nbsp;</div>
                    </div>
                    <div class="card-body announcement-card-scroll">
                        <div>
                            <div class="full skeleton" style="height: 35px; margin-bottom: 3px;"></div>
                            <div class="full skeleton" style="height: 35px; margin-bottom: 3px;"></div>
                            <div class="full skeleton" style="height: 35px; margin-bottom: 3px;"></div>
                            <div class="full skeleton" style="height: 35px; margin-bottom: 3px;"></div>
                            <div class="full skeleton" style="height: 35px; margin-bottom: 3px;"></div>
                        </div>
                    </div>
                </div>
                <div class="full bg-white" style="height: 300px;">
                    <div class="card-header text-white  justify-content-between card-header-primary d-flex">
                        <div class="pull-left m-0 font-size-md skeleton" style="width: 118px;">&nbsp;</div>
                    </div>
                    <div class="card-body announcement-card-scroll">
                        <div>
                            <div class="full skeleton" style="height: 35px; margin-bottom: 3px;"></div>
                            <div class="full skeleton" style="height: 35px; margin-bottom: 3px;"></div>
                            <div class="full skeleton" style="height: 35px; margin-bottom: 3px;"></div>
                            <div class="full skeleton" style="height: 35px; margin-bottom: 3px;"></div>
                            <div class="full skeleton" style="height: 35px; margin-bottom: 3px;"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    return html;
}

function displayCourseDetails(descriptionUrl){
	window.open(descriptionUrl);
}