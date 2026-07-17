var commonProfileDTO;
var chatEligibility;
async function rendereTeacherHomeContent(){
    commonProfileDTO = await getUserShortProfile(USER_ID);
    chatEligibility = await getChatEligibility(USER_ID,SCHOOL_ID);
    customLoader(true);
    if(commonProfileDTO.lastPassUpdatedDate){
        window.setTimeout(function(){callCommonDashboardPageForPasswordChange('14', 'No')},1000)
    }
    var payload = {};
    payload['userId'] = USER_ID;
    var responseData = await getDashboardDataBasedUrlAndPayload(true, true,'get-teacher-dashboard', payload);
    renderTeacherDashboard(responseData);
    getTeacherTimePreference();
	renderAnnouncement(responseData.userId);
    renderNews(USER_ID);
    renderSchoolDaiaryBtnCount();
    //renderActivity(responseData.userId)
    callTeacherLastAttendance('', responseData.userId, '', '');
    getChat(responseData.email, responseData.userRole, responseData.userId);
    if(commonProfileDTO.declarecheckshow == 'show' && commonProfileDTO.isAgreementUpdated){
        $('head').append(`<script src="${PATH_FOLDER_JS2}${RESOURCES_FROM_MIN_LOCATION}custom/signupTeacherStage6.js${SCRIPT_VERSION}">`)
        if($("#teacherAgreementModal").length>0){
            $("#teacherAgreementModal").remove();
        }
        if(responseData.teacherAgreementDTO!=undefined){
            var teacherAgreementDetails = JSON.parse(responseData.teacherAgreementDTO);
            if(teacherAgreementDetails.agreementExpiryAck != 'Y'){
                $('body').append(teacherAgreementContent(commonProfileDTO, teacherAgreementDetails));
                clearRecipientSignatureAndDate();
                $("#teacherAgreementModal").modal('show');
                $("#preferenceTimeavailabilityFlag").val(true);
                callLocationDetails('teacherAgreementModal');
                startTeacherContractCountdown(teacherAgreementDetails);
            }
        }
    }
    $("body").append(newsAllListWithDetailsModalCotent()+calendarActivityModal()+viewActivityAttachmentModal());
    callTeacherClassesToUpdateStatus();
    //$('[data-toggle="tooltip"]').tooltip();
}

async function renderTeacherDashboard(data){
    $('#dashboardContentInHTML').html(dashboardContentTeacher(data)+getAnnouncementAndNewsContent());
    $('#currentTimeForUser').html(convertUTCToTimezoneAs(getUTCTime(), DATETIME_FORMATTER, data.userTimezone).format('MMM DD, YYYY hh:mm:ss a'));
    setInterval(function(){
        $('#currentTimeForUser').html(convertUTCToTimezoneAs(getUTCTime(), DATETIME_FORMATTER, data.userTimezone).format('MMM DD, YYYY hh:mm:ss a'));
    }, 1000);
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
        callSchoolCalendar('', USER_ID, UNIQUEUUID, viewName, startdate, enddate, false);
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
    '<div class="app-page-title mb-3 py-2">'
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
        `<div class="modal fade " id="teacherAgreementModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel1" data-backdrop="false" data-keyboard="false" style="z-index:1070;background:rgba(0,0,0,0.5);">
            <input type="hidden" id="userId" value="${data.userId}">
            <input type="hidden" id="location" value="">
            <div class="modal-dialog" role="document" style="top:0%;max-width:1200px;width:100%;">
                <div class="modal-content">
                    <div class="modal-header py-2 bg-primary text-white">
                        <h5 class="modal-title">Teacher Agreement</h5>	
                        ${/*button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>*/''}
                    </div>
                    <div class="modal-body" style="max-height:400px;overflow:auto;width:100%;">
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
                                        <span class="ml-4">I hereby confirm that I have read and agree to the terms and understand that this contract is digitally signed and does not require a physical signature.</span>
                                        <span class="form-check-sign">
                                            <span class="check"></span>
                                        </span>
                                </label>
                            </div>`
                        }
                        html+=`
                        <button type="submit" id="teacherAgreementConfirmBtn" onclick="callForSignupTeacherAgreement('teacherAgreementModal','${data.userId}','${responseData.agreementLogId}','${data.agreementAcceptanceFrom}');" class="btn btn-info" style="float:right;">Confirm</button>
                    </div>`
                    if(responseData.validityEnd){
                        html+=teacherContractValidityCard(responseData);
                    }
                    html+=`
                </div>
            </div>
        </div>`;
    return html;
}

function teacherContractValidityCard(responseData){
    var validTill = changeDateFormat(new Date(responseData.validityEnd), "MMM-dd-yyyy");
    var html=
        `<div class="mx-3 mb-3 p-3 bg-light-primary rounded" id="contractValidityCard" style="border-left:4px solid #007bff;">
            <div class="row align-items-center">
                <div class="col-12 col-md-auto text-center text-md-left">
                    <div class="font-weight-bold text-dark">Contract Valid Till</div>
                    <div class="text-dark font-weight-semi-bold" style="font-size:26px;" id="contractValidTillDate">${validTill}</div>
                </div>
                <div class="col-12 col-md-auto ml-md-auto text-center text-md-right mt-2 mt-md-0">
                    <div class="font-weight-bold text-dark mb-2" id="contractCountdownLabel">Time left to accept the contract</div>
                    <div class="d-inline-flex" id="contractValidityCountdown">
                        <div class="bg-white rounded text-center px-2 py-1 ml-2 border" style="min-width:52px;">
                            <div class="font-18 font-weight-bold text-primary line-height-1 mb-1" id="contractCountdownDays">00</div>
                            <div class="font-10 text-dark line-height-1">DAYS</div>
                        </div>
                        <div class="bg-white rounded text-center px-2 py-1 ml-2 border" style="min-width:52px;">
                            <div class="font-18 font-weight-bold text-primary line-height-1 mb-1" id="contractCountdownHours">00</div>
                            <div class="font-10 text-dark line-height-1">HRS</div>
                        </div>
                        <div class="bg-white rounded text-center px-2 py-1 ml-2 border" style="min-width:52px;">
                            <div class="font-18 font-weight-bold text-primary line-height-1 mb-1" id="contractCountdownMinutes">00</div>
                            <div class="font-10 text-dark line-height-1">MIN</div>
                        </div>
                        <div class="bg-white rounded text-center px-2 py-1 ml-2 border" style="min-width:52px;">
                            <div class="font-18 font-weight-bold text-primary line-height-1 mb-1" id="contractCountdownSeconds">00</div>
                            <div class="font-10 text-dark line-height-1">SEC</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="w-100 text-center mt-2 font-weight-bold" id="contractValidityNote" style="color:#e69500;">Please review and accept before the contract window closes.</div>
        </div>`;
    return html;
}

var TEACHER_CONTRACT_COUNTDOWN_INTERVAL;
function startTeacherContractCountdown(agreementDetails){
    var validityEnd = agreementDetails != undefined ? agreementDetails.validityEnd : "";
    if(!validityEnd || $("#contractValidityCountdown").length < 1){
        return;
    }
    var endTime = new Date(validityEnd + "T23:59:59").getTime();
    if(isNaN(endTime)){
        return;
    }
    clearInterval(TEACHER_CONTRACT_COUNTDOWN_INTERVAL);
    var isExpiredHandled = false;
    var pad = function(value){
        return String(value).padStart(2, "0");
    };
    var updateCountdown = function(){
        var diff = endTime - new Date().getTime();
        if(diff <= 0){
            diff = 0;
            clearInterval(TEACHER_CONTRACT_COUNTDOWN_INTERVAL);
            if(!isExpiredHandled){
                isExpiredHandled = true;
                showTeacherContractExpiredState(agreementDetails);
            }
        }
        $("#contractCountdownDays").text(pad(Math.floor(diff / 86400000)));
        $("#contractCountdownHours").text(pad(Math.floor(diff / 3600000) % 24));
        $("#contractCountdownMinutes").text(pad(Math.floor(diff / 60000) % 60));
        $("#contractCountdownSeconds").text(pad(Math.floor(diff / 1000) % 60));
    };
    updateCountdown();
    if(!isExpiredHandled){
        TEACHER_CONTRACT_COUNTDOWN_INTERVAL = setInterval(updateCountdown, 1000);
    }
}

function clearRecipientSignatureAndDate(){
    var recipientSignatureBox = $("#teacherAgreementModal #rightSignatureBox");
    if(recipientSignatureBox.length){
        recipientSignatureBox.html("<br>");
    }
    var recipientSignDate = $("#teacherAgreementModal #rightDate");
    if(recipientSignDate.length){
        recipientSignDate.text("____");
    }
}

var TEACHER_CONTRACT_MODAL_PRIORITY_INTERVAL;
function keepTeacherContractModalsOnTop(){
    var agreementModal = $("#teacherAgreementModal");
    var expiredModal = $("#contractExpiredModal");
    var isAgreementOpen = agreementModal.hasClass("show");
    var isExpiredOpen = expiredModal.hasClass("show");
    if(!isAgreementOpen && !isExpiredOpen){
        clearInterval(TEACHER_CONTRACT_MODAL_PRIORITY_INTERVAL);
        TEACHER_CONTRACT_MODAL_PRIORITY_INTERVAL = undefined;
        return;
    }
    var maxZ = 1050;
    $(".modal.show, .modal-backdrop").not("#teacherAgreementModal, #contractExpiredModal").each(function(){
        var z = parseInt($(this).css("z-index"), 10);
        if(!isNaN(z) && z > maxZ){
            maxZ = z;
        }
    });
    if(isAgreementOpen){
        var agreementZ = parseInt(agreementModal.css("z-index"), 10);
        var agreementOutOfOrder = isNaN(agreementZ) || agreementZ <= maxZ
            || agreementModal.nextAll(".modal.show").not("#contractExpiredModal").length > 0;
        if(agreementOutOfOrder){
            agreementModal.appendTo("body").css("z-index", maxZ + 10);
        }
    }
    if(isExpiredOpen){
        var agreementZNow = parseInt(agreementModal.css("z-index"), 10);
        var minRequiredZ = Math.max(maxZ, isNaN(agreementZNow) ? 0 : agreementZNow);
        var expiredZ = parseInt(expiredModal.css("z-index"), 10);
        var expiredOutOfOrder = isNaN(expiredZ) || expiredZ <= minRequiredZ
            || expiredModal.nextAll(".modal.show").length > 0;
        if(expiredOutOfOrder){
            expiredModal.appendTo("body").css("z-index", minRequiredZ + 10);
        }
    }
    $(document).off("focusin.bs.modal");
    if(TEACHER_CONTRACT_MODAL_PRIORITY_INTERVAL == undefined){
        TEACHER_CONTRACT_MODAL_PRIORITY_INTERVAL = setInterval(keepTeacherContractModalsOnTop, 500);
    }
}
$(document).off("shown.bs.modal.contractModalPriority").on("shown.bs.modal.contractModalPriority", ".modal", function(){
    keepTeacherContractModalsOnTop();
});
$(document).off("hidden.bs.modal.contractModalPriority").on("hidden.bs.modal.contractModalPriority", ".modal", function(){
    if($("#teacherAgreementModal").is(":visible") || $("#contractExpiredModal").is(":visible")){
        $("body").addClass("modal-open");
    }
});

function showTeacherContractExpiredState(agreementDetails){
    $("#teacherAgreementConfirmBtn").prop("disabled", true);
    $("#agreementDeclarationConfirm").prop("disabled", true);
    $("#teacherAgreementModal #recipientSignatureUpload").prop("disabled", true);
    $("#contractValidityCard").removeClass("bg-light-primary").css({"background-color":"#fdf1f2","border-left-color":"#dc3545"});
    $("#contractValidTillDate").addClass("text-danger");
    $("#contractCountdownLabel").text("Acceptance window closed");
    $("#contractCountdownDays, #contractCountdownHours, #contractCountdownMinutes, #contractCountdownSeconds").removeClass("text-primary").addClass("text-secondary");
    $("#contractValidityNote").css("color","#dc3545").text("This contract has expired. Please contact HR to request a new contract.");
    $("#contractExpiredModal").remove();
    $("body").append(teacherContractExpiredModalContent(agreementDetails));
    $("#contractExpiredModal").modal("show");
}

function teacherContractExpiredModalContent(agreementDetails){
    var closedOn = changeDateFormat(new Date(agreementDetails.validityEnd), "MMM-dd-yyyy");
    var hrEmail = "hiring@internationalschooling.org";
    var hrPhone = "+1 (585) 499-0662";
    var html=
    `<div class="modal fade" id="contractExpiredModal" tabindex="-1" role="dialog" data-backdrop="false" data-keyboard="false" style="z-index:1080;background:rgba(0,0,0,0.5);">
        <div class="modal-dialog modal-dialog-centered shadow-none" role="document" style="max-width:600px;width:100%;">
            <div class="modal-content">
                <div class="modal-body text-center p-4">
                    <div class="d-inline-flex align-items-center justify-content-center rounded-circle mb-3" style="width:72px;height:72px;background:#fdecea;">
                        <i class="fa fa-exclamation-circle text-danger" style="font-size:42px;"></i>
                    </div>
                    <h4 class="font-weight-bold text-danger mb-2">Contract Expired</h4>
                    <p class="text-dark mb-3">The acceptance window for this contract closed on <b>${closedOn}</b>. This contract can no longer be accepted online.</p>
                    <div class="text-left p-3 rounded border bg-light">
                        <p class="mb-2 text-dark">To have a new contract issued, please contact the HR team:</p>
                        <p class="mb-1 text-dark"><b>Email:</b> <a href="mailto:${hrEmail}" class="text-primary">${hrEmail}</a></p>
                        <p class="mb-1 text-dark"><b>WhatsApp:</b> <a href="https://api.whatsapp.com/send?phone=${hrPhone.replace(/[^\d]/g, "")}" target="_blank" class="text-primary">${hrPhone}</a></p>
                        ${agreementDetails.agreementRefNumber ? `<p class="mb-0 text-dark"><b>Ref:</b> ${agreementDetails.agreementRefNumber}</p>` : ""}
                    </div>
                    <button type="button" class="btn btn-primary px-4 mt-3" onclick="acknowledgeTeacherContractExpiry('${agreementDetails.agreementLogId}');">Acknowledge</button>
                </div>
            </div>
        </div>
    </div>`;
    return html;
}

async function acknowledgeTeacherContractExpiry(contractId){
    var payload = {};
    payload['userId'] = USER_ID;
    payload['hash'] = "";
    payload['contractId'] = parseInt(contractId);
    var responseData = await getDashboardDataBasedUrlAndPayloadWithParentUrl(true, true, 'save-teacher-agreement-expiry-acknowledgement', payload, '/teacher/signup');
    if(responseData.statusCode == "SUCCESS"){
        $("#contractExpiredModal").modal("hide");
        $("#teacherAgreementModal").modal("hide");
        showMessageTheme2(1, responseData.message);
    }
}

function teacherAgreementView(data){
    var formattedPublishDateTime = changeDateFormat(new Date(data.publishDateTime), "MMM dd, yyyy hh:mm A");
    var datePart = formattedPublishDateTime.substring(0, 12);
    var timePart = formattedPublishDateTime.substring(13);
    var html=
    `
        <body style="font-family: 'Times New Roman', Times, serif; height: 100%; text-align: justify">
            <div class="contract-page" style="width: 21cm; margin: 0 auto; padding: 10px 10px 20px; page-break-after: always; ">
                <div>
                    <img src="${schoolSettingsLinks.logoUrl}${SCRIPT_VERSION}" width="300px;" />
                </div>
                <div class="text-editor-content" style="min-height: 250px; padding-top: 65px">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                        <div style="width:60%;">
                            <div style="font-weight:bold; margin-bottom:4px;">
                                ${data.salutation}${data.salutation ? '. ' : ''}${data.name},
                            </div>
                            <div style="font-weight:normal;">
                                ${data.city}${data.city ? ',<br/>' : ''}
                                ${data.state}${data.state ? ',<br/>' : ''}
                                ${data.country}
                            </div>
                        </div>

                        <div style="width:40%; text-align:right;">
                            <div>
                                <strong>Date:</strong> ${datePart}
                            </div>
                            <div>
                                <strong>Time:</strong> ${timePart}
                            </div>
                        </div>
                    </div>

                    <div id="editorData" style="margin-top:25px;">
                        ${cleanBase64Images(data.content)}
                    </div>
                    <div class="contact-detail-footer" style="padding-top: 12px">
                        <div class="full mt-4 mb-4 signature-upload">
                            <label class="mb-2 text-dark" style="font-weight: bold;">
                                Upload Recipient Signature
                            </label>
                            <div class="custom-file">
                                <input 
                                    type="file" 
                                    class="custom-file-input cursor" 
                                    id="recipientSignatureUpload"
                                    accept="image/*"
                                    onchange="handleRecipientSignatureUpload(this, 'rightSignatureBox'); updateFileName(this); handleFileInputCancel('teacherAgreementModal', 'recipientSignatureUpload', 'rightSignatureBox');"
                                >
                                <label class="custom-file-label text-truncate" for="recipientSignatureUpload">
                                    Choose file...
                                </label>
                            </div>
                            <small class="form-text text-danger font-12 mt-1">
                                Please upload your signature image (PNG/JPG only, white/transparent background, max size: 300KB).
                            </small>
                        </div>
                        <div class="full mt-4">
                            <div class="d-flex">
                                <p class="m-0"><b>Address:</b> ${schoolSettingsOffice.address}</p>
                                ${/*<p class="m-0 ml-auto">${data.name}</p>*/''}
                            </div>
                            ${data.publishDateTime != "" ? `<p class="m-0"><b>Date:</b> ${formattedPublishDateTime}</p>`:``}
                        </div>
                    </div>
                </div>
            </div>
        </body>
    `
    return html;
}

function dashboardSchoolCalendar(data) {
    var html = `
    <div class="main-card mb-3 pr-4">
        <div class="full">
            <div class="card-body pt-0 px-0">
                <!-- <div class="full home-page-skeleton-wrapper"> -->
                <!--     ${getDashboardSkeleton()} -->
                <!-- </div> -->
                <div class="home-page-wrapper">
                    <div class="row">
                        <div class="col-lg-12 col-md-12 col-sm-12 col-12 pb-2">
                            <div class="full mt-1">
                                <div class="card">
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
                                                    <span class="user_current_time clock-bg font-18 text-primary font-weight-semi-bold time-label"></span>
                                                </div>
                                            </div>
                                            <div class="school-calender-tabs tabs ml-auto text-right">
                                                <button class="btn-wide btn btn-outline-dark btn-sm bg-light-dark text-dark rounded px-4 calendar_request_button active_calendar_catergory mb-sm-0 mb-2" data-category="ALL" onclick="calendarRequestByFilter(this)">
                                                    <div class="font-16 font-weight-bold line-height-1 over_All_Class_Activity_Count">0</div>
                                                    <div class="font-12 line-height-1 font-weight-light over_All_Class_Activity_Label">All</div>
                                                </button>
                                                <button class="btn-wide btn ml-2 btn-outline-alternate bg-light-alternate btn-sm rounded text-alternate calendar_request_button mb-sm-0 mb-2" data-category="BATCH" onclick="calendarRequestByFilter(this)">
                                                    <div class="font-16 font-weight-bold line-height-1 group_class_Count">0</div>
                                                    <div class="font-12 text-dark line-height-1 font-weight-light">Group Classes</div>
                                                </button>
                                                <button class="btn-wide btn ml-2 btn-outline-primary bg-light-primary btn-sm rounded text-primary calendar_request_button mb-sm-0 mb-2" data-category="ONE_TO_ONE" onclick="calendarRequestByFilter(this)">
                                                    <div class="font-16 font-weight-bold line-height-1 one_to_one_class_Count">0</div>
                                                    <div class="font-12 text-dark line-height-1 font-weight-light">One-To-One Classes</div>
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
                        <div class="col-lg-12 col-md-12 col-sm-12 col-12">
                            <div class="full mt-3" id="activityDiv"></div>
                        </div>
                        ${/*<div class="col-lg-4 col-md-12 col-sm-12 col-12">*/''}
                            ${/*<div class="full" id="announcementDiv"></div>*/''}
                            ${/*<div class="full mt-3" id="activityDiv"></div> */''}
                            ${/*<div class="full mt-3" id="newsyDiv"></div>*/''}
                        ${/*</div>*/''}
                        ${/*
                            <div class="custome-ui-theme-settings ui-theme-settings col-lg-4 col-md-12 col-sm-12 col-12">
                                <div class="full" id="announcementDiv"></div>
                                <div class="full mt-3" id="newsyDiv"></div>
                            </div>    
                        */''}
                        
                    </div>
                </div>
            </div>
        </div>
    </div>
    ${/*<div id="announceDataId" class="full"></div>*/''}

    
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

function onBordingMandotryVideo(){
    var html = `
            <div class="modal fade fade-scale" id="mandatoryVideoModal" data-backdrop="static">
            <div class="modal-dialog modal-xl modal-dialog-centered box-shadow-none" role="document">
                <div class="modal-content text-center">
                    <div class="modal-header pt-2 pb-2 bg-primary text-white justify-content-center">
                        <h5 class="heading">Welcome! `+USER_FULL_NAME+`</h5>
                    </div>
                    <div class="modal-body d-flex flex-wrap px-1 full pt-1">
                        <div class="d-flex w-100 my-2">
                        ${CHAT_URL != ''?
                            `<div class="header-dots mr-0 position-relative ml-auto" style="min-width: 60px;">
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

// async function renderActivity(userId){
//     try{
// 		var payload = {};
// 		payload['userId'] = userId;
//         var localDatetime=changeDateFormat(new Date(), 'yyyy-mm-dd')+' '+getCurrentTimeOnly()
// 		payload['startDatetime'] = convertLocalToUTCWithFormat(getBeforeAndAfterDate(localDatetime,-24),USER_TIMEZONE, DATETIME_UTC_FORMATTER);
// 		payload['endDatetime'] = convertLocalToUTCWithFormat(getBeforeAndAfterDate(localDatetime,24),USER_TIMEZONE, DATETIME_UTC_FORMATTER);
// 		responseData = await getDashboardDataBasedUrlAndPayload(true, false,'get-acivity-details', payload,true);
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

function meetingStatusUpdateModal(data){
	var html=
	`<div class="modal fade" id="teacherMeetingStatus" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
		<div class="modal-dialog modal-xl" role="document">
			<div class="modal-content">
				<div class="modal-header bg-primary py-2">
                    <h5 class="modal-title text-white">Update Class Status (${data.classDetails.classCount})</h5>
                    <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
					    <span aria-hidden="true">&times;</span>
				    </button>
				</div>
				<div class="modal-body">
                    <div style="width:100%; text-align: center;font-weight: bold;display:none;color:red;margin-bottom: 10px;" id="teacherMeetingStatusErrorTxt"></div>
					<div class="full table-responsize" style="max-height: 450px;overflow-y: auto;">
                        <form id="updatePendingMeetingResultForm" action="javascript:void(0);">
                            <table class="table table-borderedtable table-bordered font-12 table-striped" id="teacherMeetingStatusTable" style="min-width:768px">
                                <thead class="bg-primary text-white">
                                    <tr>
                                        <th>S.no</th>
                                        <th>Your class timing details</th>
                                        <th>Student Details</th>
                                        <th>Class status</th>
                                    </tr>
                                </thead>
                                <tbody>`
                                    +meetingStatusUpdateModalBodyContent(data);
                                html+=
                                `</tbody>
                            </table>
                        </form>
					</div>
				</div>
				<div class="modal-footer text-right">
                    <a href="javascript:void(0)" class="btn btn-success btn-sm" onclick="updateBulkClassStatus();">Update All</a>
                </div>    
            </div>
		</div>
	</div>`;
	return html;
}

function meetingStatusUpdateModalBodyContent(data){
	var html=``;
	if(data.classDetails != '' && data.classDetails.classDetails.length>0){
		$.each(data.classDetails.classDetails, function(i,v){
            html+=
			`<tr data-meetingid="${v.meetingId}" data-userid="${v.userId}">
                <td style="vertical-align: top;">${++i}</td>
                <td>
                    <span class="full">Start: ${v.meetingStartDateTime}</span>
					<span class="full">End: ${v.meetingEndDateTime}</span>
					<span class="full">Type: ${v.meetingType == 'PTM' ? 'Parent Teacher Meeting' : 'One Day Class'}</span>
                </td>
				<td style="vertical-align: top;">
					<span class="full">Name: ${v.attendeName}</span>
					<span class="full">Course: ${v.subjectName}</span>
				</td>
				<td>
                    <select class="form-control status" name="meetingResult${i}" id="meetingResult${i}" required="">
                        <option value="" selected="">Select Status</option>
                        ${v.meetingType == 'PTM' ? `
                        <option value="Completed">Completed</option>
                        ` : `
                        <option value="Reschedule Session">Reschedule Class</option>
                        <option value="Missed by Student">Missed by Student</option>
                        <option value="Completed">Completed</option>
                        `}
                    </select>
                </td>
            </tr>`;
		});
	}
	return html;
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
		<div class="modal-dialog modal-dialog-centered shadow-none" role="document">
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

var INTERNATIONAL_SCHOOLING_POPOVER_TIMER;

function toggleInternationalSchoolingPopover(show){
	clearTimeout(INTERNATIONAL_SCHOOLING_POPOVER_TIMER);
	var btn=$("#internationalSchoolingBtn"), pop=$("#internationalSchoolingSlideBtn");
	if(btn.length<1 || pop.length<1) return;

	if(show){
		$(".tooltip").remove();
		var btnOffset=btn.offset()||{top:0};
		var popHeight=pop.outerHeight()||0;
		var top=(btnOffset.top-$(window).scrollTop())+(btn.outerHeight()/2)-(popHeight/2);
		top=Math.max(10,Math.min(top,$(window).height()-popHeight-10));
		pop.css("top",top+"px").addClass("show");
	}else{
		INTERNATIONAL_SCHOOLING_POPOVER_TIMER=setTimeout(function(){
			pop.removeClass("show");
		},150);
	}
}
